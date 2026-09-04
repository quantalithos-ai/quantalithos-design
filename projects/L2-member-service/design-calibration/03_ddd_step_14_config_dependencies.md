# Step 14：配置引用与外部依赖绑定

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`

## 1. Step 状态与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 14 配置引用与外部依赖绑定 |
| 状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 3/4/5 约束与布局、Step 6~13 对象/Port/协议/flow/状态/一致性/错误/并发 |
| 正式正文 | 仍禁止写入，直到 Step 19 |
| 本步不锁定 | 完整配置文件格式、环境变量、secret、endpoint、数据库/消息产品、cron、timeout/retry/retention 数值 |

本步只定义代码需要读取的配置引用、读取位置、validated binding 和外部依赖接缝。配置不能改变 Host Truth owner、执行主语、状态矩阵、安全边界、Query no-write、Job no-authorization 或正文排除规则。具体可填写配置由未来 `04-配置设计.md` 承接。

## 2. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 谁读取配置？ | `infra/config.rs` 加载并校验；`infra/runtime_builder.rs` 组装；`api`/`worker`/`jobs` 只接收已校验的 entry 参数。`domain`、`contracts`、application use-case 不读取 raw config。 |
| 外部依赖如何注入？ | 通过 Step 7 application Port，由 infra adapter 实现；runtime/event/ref/handoff/adapter/fake 不写成源码依赖。 |
| P0 如何运行？ | 允许 deterministic clock/id、in-memory/fake local stores 和 placeholder external adapters；这不是真实联调或 readiness 证据。 |
| 哪些依赖可进 Cargo？ | 仅已确认的 compile 类别 `L0-core contracts` 作为 planned path dependency；其余 sibling 只能走 Port/event/ref/adapter/fake。 |
| 上游未闭合怎么办？ | 维持 `blocked/waiting/unknown`；不在 config 中伪造 endpoint/schema，也不把 fake positive 升级为 ready。 |
| 配置能关闭哪些能力？ | 可禁用外围 publisher、handoff、external adapter、job 或 feature；不能关闭必需 metadata、幂等、审计、source owner 和安全校验。 |

## 3. 配置所有权与读取层

```text
ConfigLoader.load(profile)
  -> ConfigValidator.validate(raw)
  -> ValidatedMemberServiceConfig
  -> RuntimeBuilder.bind(stores, ports, adapters, entries)
  -> API / Worker / Jobs receive typed entry parameters
```

| 层 | 允许读取 | 禁止读取 |
|---|---|---|
| `infra/config.rs` | raw config source、profile、secret reference（不读取 secret body）、validated refs | 不创建 Host Truth、不解析 sibling body |
| `infra/runtime_builder.rs` | validated config、adapter registry、availability | 不把 availability 写成 Ready/Healthy |
| `api`/`worker`/`jobs` entry | boundary limits、job selector、runner options | 不读取 raw config、不绕过 facade |
| `application` | typed policy/runner parameters、Port trait | 不持有 `MemberServiceConfig` 或具体 client |
| `domain`/`contracts` | 显式方法参数和值对象 | 不读取配置、环境变量、secret 或 adapter handle |

## 4. 配置引用表

| 配置 section / binding | 类型（占位） | 读取位置 | P0 默认口径 | 详细配置落点 |
|---|---|---|---|---|
| profile / config identity | `MemberServiceProfileRef`、`MemberServiceConfigRef` | `infra/config.rs` | local/fixture profile | `04` runtime profile |
| logical truth stores | `HostStoreConfigRefSet` | `infra/runtime_builder.rs` | in-memory/fake per logical owner | `04` persistence |
| history/material stores | `HostMaintenanceStoreConfigRefSet` | runtime builder | in-memory append-only fake | `04` maintenance |
| outbox store | `HostOutboxStoreConfigRef` | runtime builder, publisher job | in-memory fake | `04` outbox |
| projection store | `HostProjectionStoreConfigRef` | runtime builder, read/job | in-memory fake | `04` projection |
| idempotency/result store | `HostIdempotencyStoreConfigRef` | runtime builder | deterministic fake | `04` replay/result |
| Identity/Work resolver refs | `AdapterConfigRefSet` | `infra/config.rs` | placeholder/fake | `04` resolver |
| Member registration/signal ref | `AdapterConfigRef` | runtime builder | placeholder/fake; positive disabled | `04` member seam |
| Images pinned-supply ref | `AdapterConfigRef` | runtime builder | placeholder/fake; fail-closed | `04` images seam |
| Runtime session/handoff ref | `AdapterConfigRef` | runtime builder | placeholder/fake; positive disabled | `04` runtime seam |
| Sandbox bind/release ref | `AdapterConfigRef` | runtime builder | placeholder/fake; positive disabled | `04` sandbox seam |
| carrier/registry ref | `AdapterConfigRef` | runtime builder | neutral fake | `04` carrier seam |
| publication target binding | `TopicBindingConfig` / publisher ref | publisher adapter | fake target in P0 | `04` publication |
| handoff target refs | `HandoffTargetRefSet` | handoff adapter/jobs | empty/disabled unless enabled | `04` handoff |
| clock / id generator | `ClockAdapterRef`、`IdGeneratorAdapterRef` | runtime builder | deterministic fake in tests | `04` runtime support |
| API boundary | byte/page/visibility limits | `api` handlers | explicit config required | `04` boundary |
| worker loop | batch/parallelism/lease/cancellation refs | `worker` runner | serial deterministic fake | `04` worker |
| job runner | batch/parallelism/retry/timeout refs | `jobs` runner | serial deterministic fake | `04` jobs |
| idempotency retention | duration/age policy refs | idempotency store/maintenance | policy placeholder | `04` idempotency |
| projection freshness | freshness threshold refs | read assembly/projection job | policy placeholder | `04` projection |
| feature switches | event/handoff/job enablement | runtime builder/entries | safe disabled for unresolved external seams | `04` features |

配置 section 只提供 binding point。任何数值、格式、环境变量和 secret provider 必须在 `04-配置设计.md` 定义，并保持与本文件的 section 名称一致。

## 5. Section 到代码绑定规则

| section | 绑定对象 | 约束 |
|---|---|---|
| stores | `Host*Repository`、`HostUnitOfWork`、`HostStoredResultRepository` | physical co-location 不改变 logical owner、revision 或 UoW write-set |
| projection | `HostProjectionRepository`、read mapper | stale/degraded/unavailable 只影响 derived read，不反写 source |
| idempotency | `HostIdempotencyRepository`、stored result port | reserve/complete、same digest replay、missing result defect必须保留 |
| resolver | qualification/session/health consumer ports | 只返回 typed ref、safe summary、freshness、gap、unknown；不保存外部正文 |
| carrier/runtime/sandbox | progression/session/cleanup ports | 未闭合时只能 blocked/waiting/unknown；不以配置开启 positive truth |
| publisher | `HostFactPublicationPortPlaceholder` | 只提交 immutable outbox payload；不回查 current truth |
| handoff | `HostFeedbackMapperPlaceholder`/handoff port | target-specific marker；四层 feedback 不被 flag 合并 |
| clock/id | `HostClockPort`、`HostIdGenerationPort` | domain 不拼 ID，不把时间当 revision/cursor |
| API/worker/jobs | entry validators/runners | entry 不能定义重复的 actor、scope、run_id、idempotency key |

## 6. 外部依赖分类与绑定

| 依赖 | 全局类别 | 绑定方式 | 当前状态/失败上限 |
|---|---|---|---|
| `L0-core` contracts | compile | planned `core-contracts` path dependency | exact package target需实现仓确认；不声明已编译 |
| `L0-bus` | event | outbox publisher / consumer envelope adapter | route/envelope/receipt pending；fake only |
| `L0-sdk` | limited compile / fake seam | 仅在 SDK target 闭合后评估；不进入 host runtime 主链 | `MSVC-UP-008` pending |
| `L1-identity` | runtime + event + ref | `GlobalMemberQualificationPort`、safe source consumer | 只消费 GlobalMember ref/summary；不复制 identity truth |
| `L1-work` | runtime + event + ref | `ProjectMemberQualificationPort` | 只消费 project/member scope；不复制 Work truth |
| `L2-member` | runtime + event/signal | registration/signal placeholder adapter | `MSVC-UP-002` pending；不能声明 register/heartbeat ready |
| `L2-member-images` | runtime + ref | pinned supply placeholder | `MSVC-UP-003` pending；digest/manifest不入仓 |
| `L2-runtime` | runtime + ref/event | Host Session / execution handoff placeholder | `MSVC-UP-001` pending；不定义 Runtime run/outcome |
| `L4-sandbox` | runtime + ref/event | bind/release/cleanup placeholder | `MSVC-UP-004` pending；不定义 backend/policy truth |
| carrier/registry/backend | adapter | neutral lifecycle port | 产品未知；不把 backend status变成 Host lifecycle |
| observability backend | event + ref/material | redacted telemetry/audit sink port | backend/retention未知；不成为 Host Truth |
| downstream handoff target | handoff | target-specific adapter | delivery/observed/accepted pending |

规则：compile dependency 才可能写入 Cargo；runtime/event/ref/adapter/fake 依赖只能通过 Port、envelope、material、handoff 或 test assembly 表达。兄弟目录存在不等于 exact contract ready。

## 7. Runtime builder 绑定顺序

```text
load profile/config source
  -> validate section presence, forbidden values and safe references
  -> create ValidatedMemberServiceConfig
  -> build logical stores and local UnitOfWork manager
  -> build idempotency + stored-result repositories
  -> build history/material/outbox/projection repositories
  -> build ClockPort + IdGeneratorPort
  -> build Identity/Work/Member/Images/Runtime/Sandbox/Carrier adapters
  -> build publication/handoff adapters and availability markers
  -> construct application facade from Port traits
  -> construct API handlers, worker consumers and job runners
  -> expose runtime only when required local dependencies are available
```

builder 规则：

1. `domain` 只接收 explicit input，不接收 config 或 adapter handle；
2. `application` 构造器只接收 Port trait 和 typed policy/runner 参数；
3. unresolved sibling seam 形成 `Blocked/Disabled/Unknown` availability，而不是 Ready；
4. optional publication/handoff/external target 可以 disabled，但不会放宽 local truth、metadata、idempotency、history、material 或 outbox要求；
5. builder 校验失败只返回 redacted config issue，不保存 raw secret、URL、topic、adapter error body；
6. fake runtime 必须保留 version conflict、rollback、unknown effect、forbidden body 和 duplicate replay parity。

## 8. 配置不可改变的边界

| 不可配置化项 | 违规处理 |
|---|---|
| 将非 ProjectMember 主语设为可执行主语 | validation reject；需回退需求/架构 |
| 改变 Host Truth owner 或引入第二写源 | validation/design reject |
| 关闭 command metadata、幂等或 stored replay | validation reject |
| 关闭 accepted history/material/outbox 约束 | validation reject |
| 让 Query refresh、projection/reconciliation/handoff/job 写 source truth | validation reject |
| 将 Runtime/Member/Images/Sandbox 正文、secret、manifest、backend status写入本仓 | validation reject |
| 通过 flag 绕过 actor/scope/visibility/redaction/generation guard | validation reject |
| 用 fallback/旧缓存/fake positive 把 qualification 变成 Ready | validation reject |
| 用 timeout/receipt/adapter availability 推导 external completion | validation reject |
| 将 sibling runtime/event/ref/adapter 依赖改写为 Cargo package | implementation gate reject |
| 关闭 unknown/late/gap 记录或自动换 effect key | validation reject |

## 9. 上游 blocker 与不可用策略

| blocker | 配置允许的状态 | 不允许的处理 |
|---|---|---|
| `MSVC-UP-001` Runtime session/handoff | adapter disabled/blocked；Host Session 保持 waiting/unknown | 配置 pseudo Runtime run/turn/outcome |
| `MSVC-UP-002` Member registration/heartbeat | placeholder/fake；positive path fail-closed | 配置猜造 register body/credential |
| `MSVC-UP-003` Images supply | pinned ref placeholder；qualification blocked | 配置解析 role→image、宣称 manifest verified |
| `MSVC-UP-004` Sandbox binding | bind/release disabled/unknown | 配置 backend/policy/cleanup complete |
| `MSVC-UP-005/006` policy/credential owner | opaque refs / blocked | 配置绕过 owner 或保存 secret |
| `MSVC-UP-007` Core/Bus schema | topic-neutral candidate/fake | 配置补 route/envelope/receipt schema |
| `MSVC-UP-008` SDK target | no compile claim; fake seam | 配置宣称 SDK/server self-test ready |

## 10. 前序闭环审计

| 审计项 | 结果 |
|---|---|
| Step 3 compile/runtime/event/ref/adapter/fake 分类 | pass |
| Step 4 file owner 与 builder/config 文件位置 | pass |
| Step 5 application-only Port、infra-only adapter | pass |
| Step 6 config refs/availability carrier 不成为业务对象 | pass_with_upstream_blockers |
| Step 7 Port 注入点覆盖 store/resolver/publisher/handoff/clock/id | pass_with_upstream_blockers |
| Step 8 protocol topic-neutral / job metadata binding | pass_with_upstream_blockers |
| Step 9 flow 的 adapter 调用与 local-first 顺序 | pass |
| Step 11~13 consistency/error/reentry configuration impact | pass |
| `MSVC-UP-001~008`、cursor exact type、具体产品和数值 | pending / blocked |
| 正式 `03-详细设计.md` | forbidden until Step 19 |

## 11. 回填草稿与 Step 15 handoff

正式 `03` 第 13 章只装配：配置读取层、section 到代码绑定、compile/runtime/event/ref/adapter/fake 分类、runtime builder 顺序、P0 fake/blocked 策略和不可配置化红线。完整 key、默认值、环境变量、secret、endpoint、retry/timeout/retention 数值留给 `04-配置设计.md`。

```text
step_14_status = completed
step_14_gate = pass_with_upstream_blockers
next_allowed_step = Step 15 observability_audit
formal_03_write_allowed = false_until_step_19
```
