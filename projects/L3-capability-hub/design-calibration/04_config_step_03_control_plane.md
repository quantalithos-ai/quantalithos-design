# L3-capability-hub 04 配置设计 Step 3：配置控制面总览

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §3
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_03_completed_continuous_execution`

---

## 1. 本步目标、输入与限制

| 项目 | 收口内容 |
|---|---|
| 本步目标 | 建立配置来源链、唯一装配入口、可读模块、控制面和功能配置域总览 |
| 输入 | Step 1/2；formal 03 §13.1~13.12；DDD Step 14 §145~148；formal 00/01 的依赖与边界 |
| 本步输出 | 来源链图、控制面总表、配置域表、停审记录、跨控制面审计 |
| 本步不定义 | 最终 raw key、JSON path、数值/单位/默认、优先级、secret 存储、环境值和具体产品 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置来自哪里？ | v1 只允许配置文件、环境字段、符号化 secret reference 和 deterministic fixture 这四类来源进入候选 root；code default 只能在 Step 7 作为显式审计过的规则，不在本步偶然生成。优先级留 Step 5。 |
| 唯一入口是什么？ | `infra/config.rs` 读取有限 raw source，构造 candidate 并校验成不可变 `CapabilityRuntimeConfig`；`infra/runtime_builder.rs` 消费 root 并按 Stage 0~7 组装。 |
| 谁不能读配置？ | `contracts` 和 `domain` 不读；`application` 不读 root/ref，只接收已注入 Port 与 typed technical policy；`api/worker/jobs` 不读 raw root，只接收各自 entry handoff/parameters。 |
| 配置控制什么？ | profile、entry、adapter availability、store/binding material、source/feed/actor、route、Job technical limits、retry/timeout、diagnostic mode 和其他 operator-facing 语义。 |
| 配置不能控制什么？ | truth owner、protocol identity、state transition、query no-write、UoW order、idempotency winner/replay、capture/intent phase、body-free rule、external owner、runtime execution、approval、listing、method body 和 delivery lifecycle。 |

## 3. 配置来源链图

### L3-capability-hub 配置覆盖链

```text
[versioned JSON file]
        +
[bounded environment fields]
        +
[symbolic secret references]
        +
[deterministic fixture source for Local/CI]
        |
        v
[infra/config.rs: parse candidate]
        -> [unknown/duplicate/shape checks]
        -> [cross-field/profile/entry checks]
        -> [immutable CapabilityRuntimeConfig]
        -> [infra/runtime_builder.rs Stage 0..7]
        -> [typed Port/adapter/entry handoffs]
        -> [API | Worker | Jobs ownership gate]
```

Key rules:

- 本图表示配置语义流向，不表示部署命令、文件挂载或实际 endpoint。
- raw source 在 `infra/config.rs` 结束；不允许 raw key/ref 穿过 builder 进入 application/domain/contracts。
- fixture 是明确的 Local/CI 材料，不是 Deployment 默认或不可用时的 fallback。
- `CapabilityRuntimeConfig` 是 process-lifetime immutable root，不是 domain object、public DTO、persisted row 或配置中心快照。

## 4. 配置控制面总表

| ID | 控制面 | 作用 | 对应模块/所有者 | P0 | 不允许控制 |
|---|---|---|---|---|---|
| `CP-01` | root/profile/entry | schema version、profile、selected API/Worker/Jobs | `infra/config.rs` -> `runtime_builder.rs` -> selected entry | yes | 业务 owner、protocol/state、entry 以外的动态调度 |
| `CP-02` | local authority | persistence binding、UoW、27 local/base Port 共享 `A` | `infra/runtime_builder.rs` + local adapters | yes | second authority、replica guess、split commit、TTL/cleanup |
| `CP-03` | technical primitives | clock、ID、compatibility、codec/digest policy | `infra/clock_id.rs` + contracts/application owners | yes | application/domain fallback、runtime algorithm selector |
| `CP-04` | API entry | body/page limit、non-cancelling observation timeout | API entry parameter builder | yes | 取消、detach、redispatch、Query write |
| `CP-05` | Worker entry/source | body/fetch/parallelism/deadline、6 source slots、feed/actor refs | Worker root + source resolver | yes | transport identity、delivery lifecycle、local queue/lease/ack |
| `CP-06` | external Port slots | 9 named slots、Configured/Fake/Disabled/Missing、ref material | builder + external adapter owners | yes | 合并族、execution/body、approval/listing |
| `CP-07` | Outbound collaboration | 10 route refs、destination/TLS/credential class | `infra/publishers.rs` + collaboration adapter | yes | route 改变 envelope/digest/state/intent、local delivery ledger |
| `CP-08` | Jobs entry | body/planning/run/retry parameters、8 typed dispatches | Jobs root + application Job services | yes | scheduler/queue/lease/target parallelism/host report truth |
| `CP-09` | recovery/technical policy | external/contention/commit observation retry、internal scan | application wrapper + UoW recovery | yes | blind mutation retry、text classifier、unknown terminalization |
| `CP-10` | diagnostics/observer | `Off/Redacted`、safe sink/ref/backend-neutral binding | infra/observer callsite owners | yes | raw/full/verbose、observer Port/state、business outcome change |

## 5. 配置域 / 功能模块总表

| Domain | Control plane | 03 exact source | 允许配置的能力 | 禁止控制 |
|---|---|---|---|---|
| root schema/profile/entry | CP-01 | §13.1、13.2 rows 1~3 | schema version、profile kind、selected entry、section presence | 新 protocol、new entry、implicit deployment |
| local persistence | CP-02 | §13.2 row 4、13.3、§10 | authority binding、durable/fake eligibility、constructor ref class | truth schema、CAS/version、UoW order、second store |
| clock/id/compatibility | CP-03 | §13.2 rows 6~7、13.10 | system/deterministic binding、fixed compatibility fixture | fallback time/id、wire/digest algorithm choice |
| API technical parameters | CP-04 | §13.2 rows 8~10、13.5 | request/page bound、observation duration | cancellation、redispatch、body persistence |
| Worker technical parameters | CP-05 | §13.2 rows 11~17、13.6 | body/fetch/parallelism/deadline、six slot refs | event identity、delivery retry/ack/lease |
| external Port material | CP-06 | §13.2 row 5、13.4、146 | slot kind/ref/credential/TLS/fixture/Disabled | execution request/response、approval、method body |
| Outbound routes | CP-07 | §13.2 row 18、13.7 | ten named route refs and destination material | dynamic route/cost/quota/state mutation |
| Jobs technical parameters | CP-08 | §13.2 rows 19~22、13.8 | admission/planning/run/reentry policy | scheduler business identity、auto retry、target concurrency |
| retry/scan/diagnostics | CP-09/10 | §13.2 rows 23~27、13.10/14 | bounded policy, scan bound, Off/Redacted | generic retry, raw diagnostics, observer-side repair |

## 6. 配置域停审记录

| Domain group | source chain | owner | 允许/禁止是否明确 | 03 影响 | 结论 |
|---|---|---|---|---|---|
| CP-01 root/profile/entry | file/env/ref/fixture -> config -> builder | infra | yes | none | pass |
| CP-02/03 local/technical | config -> builder -> typed adapters | infra + UoW/codec owner | yes | none | pass |
| CP-04/05 entries | config -> selected entry handoff | API/Worker/Jobs entry owner | yes | none | pass |
| CP-06/07 external/event | config -> adapter/route constructor | external Port/publisher owner | yes | none | pass |
| CP-08/09 Jobs/recovery | config -> application technical wrapper | Jobs/application/UoW owner | yes | none | pass |
| CP-10 diagnostics | config -> private observer projection | callsite/infra owner | yes | none | pass |

No domain was closed by assuming a product or a raw key. The next Steps may fill operator-facing details only within these owners.

## 7. 跨控制面审计

| Audit item | Result | Required rule |
|---|---|---|
| raw config reader count | 1 conceptual owner: `infra/config.rs` | no direct raw reads elsewhere |
| immutable root assembly count | 1: `runtime_builder.rs` | no partial graph/entry bypass |
| local authority ownership | 1 authority `A` for 27 local/base Port | no second store/session |
| entry parameter ownership | 1 selected variant per process | no mixed API/Worker/Jobs root |
| external slot cardinality | 9 named slots | no generic map or family substitution |
| source cardinality | 6 named Worker slots | no vector/map that loses identity |
| route cardinality | 10 named routes when configured | no wildcard/silent route |
| Job cardinality | 8 typed arms | no generic execute/scheduler fallback |
| secret ownership | symbolic ref in config; raw value external | no raw secret in root/log/error |
| observer ownership | private backend-neutral callsite | no observer Port/state/repository |
| control-plane overlap | 0 unresolved | store/route/job/diagnostic owners assigned once |
| 03 code-contract delta | 0 | any new field/Port/error/flow reopens owning DDD Step |

## 8. 设计取舍

| 议题 | 裁决 | 原因 |
|---|---|---|
| 按 crate 还是按控制面拆分 | 按控制面拆分，回指 crate/file owner | 配置审查需要看行为和边界，不是只看目录 |
| 是否把 fixture 当默认 | 否；fixture 只能明确注入 | 避免 Deployment 静默 fake |
| 是否将 Disabled 当业务关闭 | 否；只改变该外部 Port/source/route 可用性 | 核心 local invariant 和协议不变 |
| 是否允许一个 generic `extensions` map | 否 | unknown-field/typed/Rustdoc 门禁会被绕过 |

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 这 10 个控制面对已有 27 rows 重新组织 | 否 | configuration grouping only | §13、DDD Step 14 §145~148 | 无回写 |
| 固定 `infra/config.rs` 为 raw-reader 和 builder 为唯一组装入口 | 否 | existing owner restatement | §13.1、13.9 | 无回写 |
| 将 fixture/secret/backend 分为后续域 | 否 | scope/handoff | §13.11~13.12、17 | 无回写 |
| 新增任何配置 field/Port/error/flow | 本步未发生 | code contract trigger | originating DDD Step | 无回写 |

Impact audit: `待回写=0`; `阻塞待确认=0`.

## 10. Formal §3 回填草稿

Formal §3 shall embed the source-chain diagram, CP-01..CP-10 table, domain table and the direct-read prohibition. It shall state that the validated root is startup-local and immutable, that only `infra/config.rs` reads raw input, and that `runtime_builder.rs` is the sole graph assembly owner. The chapter shall not present source precedence, exact raw keys or product readiness as decided.

## 11. Step 完成门禁

| 检查 | 结果 |
|---|---|
| 来源链图 | present; no deployment command |
| 唯一 raw-reader/builder | closed |
| 控制面 | 10/10 命名、owner、P0、forbidden boundary |
| 配置域 | 有 03 源、允许/禁止能力和 owner |
| 跨控制面重叠 | 0 unresolved |
| 对 03 影响 | 无回写；无 pending/blocker |
| 强行事实 | 没有产品、配置、连通或测试结果声称 |

```text
document = 04-配置设计.md
step = 3
status = 04_step_03_completed_continuous_execution
control_planes = 10
raw_reader_owner = infra/config.rs
assembly_owner = infra/runtime_builder.rs
unresolved_upstream_blocker = none
detailed_design_writeback = none
next_allowed_action = complete_04_step_04_categories_boundaries
commit_required = no
```
