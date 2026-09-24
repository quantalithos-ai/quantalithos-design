# Step 11. 配置影响轮廓

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 11 / 配置影响轮廓 |
| 状态 | `completed` |
| 当前模块 | `configuration_impact:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 配置只影响装配、provider、资源预算、调度与展示承载的轮廓已明确；domain invariant、多轴状态、ownership、事务与安全门禁全部列为不可配置化，03/04 承接边界清楚。 |
| next_allowed_action | `read_and_start_step_12` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复台账、02 flow、Step 10，读取概要 SOP Step 11 与书写规范 §4.11。
- [x] 从代码主体、接口、处理流、状态、异常和架构横切约束识别配置影响。
- [x] 区分直接读取配置的 composition root/adapter/job 与只能接收 validated policy 的 domain/application。
- [x] 明确禁止配置化的 ownership、状态机、事务、安全、证据和依赖边界。
- [x] 定义交给 03 的配置实现契约方向与交给 04 的填写/来源/校验说明边界。
- [x] 完成历史技术/数字污染扫描并同步 flow / 台账。

## 2. 核心判断

1. 配置只能选择或约束已在 Step 4～10 定义的承载、adapter、store、job、资源预算、展示裁剪和外部接缝；不能创造新业务能力或改变 truth owner。
2. 只有未来 composition root/runtime builder、ConfigLoader/Validator、adapter/provider、store、operations scheduler 和 presentation adapter 可以直接消费配置。Domain objects、状态机和核心 application services 只接收已验证、typed、bounded 的 policy/limits/ports，不读取环境或原始配置。
3. 所有配置在进入可产生副作用的 runtime 前必须整体校验；缺失、矛盾、不兼容或越界配置 fail-fast/blocked。不得用宽松默认值绕过安全门禁。
4. 03 定义配置实现契约、typed grouping、加载/验证/注入与错误传播；04 才说明正式配置项、来源、填写、默认/必填、约束、示例和变更运维。当前不锁任何 key、文件格式、环境变量或数值。
5. Secret 只以 secret reference / credential provider boundary 进入 adapter，不能作为普通配置值进入 domain、日志、preview、telemetry 或本地 state。

## 3. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Composition root / runtime builder | 是 | config path、profile、component enablement、provider selection、startup validation | `RuntimeConfig` 分组、`ConfigLoader`/`ConfigValidator`、validated config snapshot、builder 注入和 fail-fast `ConfigError`。 |
| GUI / CLI / product entry adapters | 间接受影响 | profile、display capability、locale、feature exposure | 入口只接收 validated presentation policy；同一 Command/Query facade 的注入关系与不支持能力处理。 |
| `RunnerEntryFacade` 与 application services | 间接受影响 | bounded policy、operation budget、port capability | 不直接读配置；定义构造注入的 typed policy/port，确保任何入口共享门禁。 |
| Context / Release authority adapters | 是 | external endpoint、SDK client profile、timeout、credential/secret ref、capability negotiation | `AdapterConfig`、client factory、readiness probe、typed timeout/error mapping；具体 endpoint/key 留 04。 |
| Context and explicit selection domain | 否 | 不适用 | 不定义 config reader；exact ref、generation、authority current 等不变量硬编码为领域规则/类型约束。 |
| Material source / transfer adapter | 是 | endpoint、transport provider、connection timeout、bandwidth/concurrency budget、staging/store root | acquisition adapter config、provider factory、bounded resource policy、secret ref；不锁 transport/产品。 |
| Integrity verifier adapter | 是，受 owner policy 限制 | verifier provider/capability、resource budget、trust material reference | verifier adapter config 与 owner-policy capability validation；算法/policy 不能由 Runner 本地配置补齐。 |
| Material cache/store | 是 | store root、capacity budget、quarantine layout policy、retention candidate policy | store/cache config、path validation、capacity units、atomic operation capability；删除许可仍由 guard。 |
| `AcquireAndVerifyMaterialJob` | 是 | scheduling、worker/concurrency budget、checkpoint cadence、timeout/cancellation policy | `JobConfig`、execution claim policy、bounded concurrency、cancellation/checkpoint 注入；retry 不得突破 unknown/binding gate。 |
| `EvaluateCacheEvictionJob` | 是 | evaluation cadence、capacity pressure thresholds、batch size | job config 与 candidate policy；只影响候选评估，不改变 ProtectionGuard。 |
| Sandbox/Runtime adapters | 是 | external endpoint、SDK profile、timeout、capability/readiness、credential ref | separate adapter configs、client factory、owner result/error normalization；私有 backend 产品不属于 Runner 配置。 |
| Run intent and lifecycle domain | 否 | 不适用 | request/accepted/execution/control 多轴、expected basis、unknown/no-replay 为固定规则。 |
| Platform resource adapter | 是 | platform provider、capability enablement、probe budget、safe resource scope | platform adapter config、OS/arch capability validation、safe probe policy；不允许静默抢占。 |
| `ReconcileRunnerStateJob` | 是 | scheduling trigger、read timeout、fan-out/batch budget、manual-review escalation policy | `JobConfig` 与 source query plan；配置不能启用 automatic side-effect replay。 |
| `ProtectionGuard` / cleanup boundary | 间接受影响 | retention/capability inputs from formal owner、local capacity observation | 仅以 validated owner/local inputs注入；guard truth table 和 missing→unknown 不可配置。 |
| Diagnostic/Observability adapters | 是 | external endpoint、SDK profile、safe payload budget、timeout、credential/secret ref | adapter config、capability negotiation、safe payload envelope builder；合同未闭合保持 blocked。 |
| Redaction adapter/policy provider | 是，受正式 policy 限制 | policy reference、redactor provider/capability、bounded output size | Redaction adapter config 和 required-policy validation；不得配置成 bypass/allow-raw。 |
| Archive reference adapter | 是（外围） | endpoint、SDK profile、timeout、feature exposure | conditional adapter config/readiness；不可进入核心 success/cleanup gate。 |
| `RefreshSafeDiagnosisJob` | 是 | scheduling trigger、source read budget、bounded content budget | job config、safe signal budget 与 cancellation；不允许抓 raw logs 作 fallback。 |
| `RefreshVisibleSourcesJob` | 是 | scheduling/foreground trigger policy、per-source read budget、fan-out/batch | job config、refresh generation 与 per-source timeout；Query/render 不读取它来触发 refresh。 |
| `RunnerStateStorePort` adapter | 是 | store provider、store root/connection、transaction capability、pool/resource budget | store adapter config、migration/readiness strategy、transaction capability validation；数据库产品留技术选择。 |
| `ClockConnectivityPort` adapter | 是 | clock/connectivity provider、observation cadence、freshness policy input | adapter config 与 monotonic/freshness capability；clock failure 必须变 unknown/stale。 |
| Presentation/read-model composition | 是，间接 | clipping/display budget、poll/refresh presentation policy、locale/accessibility profile | typed presentation policy、presenter injection、section-level degraded mapping；不产生 domain migration。 |
| Telemetry/local operational logging | 是 | sink/provider、sampling、bounded fields、retention、redaction policy ref | telemetry config 与 safe field enforcement；与 business audit/evidence 明确分离。 |
| Planned inbound event consumers | 是（当前 blocked） | SDK/event seam enablement、subscription profile、dedup storage capacity | 只有 owner contract 闭合后定义 consumer config；当前不得用 generic topic/group 配置启用。 |
| Runner outbound events | 不适用 | 不适用 | 当前无正式 event family，不能通过 feature flag/config 新增。 |

## 4. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| 禁止启用 `latest`、默认分支、目录最新文件或隐式版本 | 破坏 explicit immutable selection 与追溯。 | 需求 §9～10、架构 ADR 与概要 Step 3/6/9。 |
| 禁止跳过 actor/session/context、scope、authority/baseline/approval 校验 | Runner 不拥有身份、Release 或 Governance truth。 | 需求/架构 ownership 与相邻 owner 正式合同。 |
| 禁止本地配置 authority chain、approved/baselined 结论、revoke/expiry override | 会把配置变成治理 owner。 | L1-artifact/L1-governance 合同 + 本仓 00/01。 |
| 禁止跳过 manifest/digest/signature/platform/source binding 验证 | 会让未验证材料进入运行主线。 | 需求材料规则、概要 objects/flows/states。 |
| 禁止以宽松算法/default policy 补齐 owner 未提供的 integrity policy | Runner 不能创建验证 authority。 | Owner 合同与概要 required port。 |
| 禁止修改、重打包或重声明 Release/Artifact 内容 | 跨越 Artifact truth ownership。 | 上游需求/架构，不是配置变更。 |
| 禁止合并 transfer complete、verified、qualified、accepted、running、terminal、cleanup、evicted 状态 | 多轴语义是核心安全不变量。 | 概要 Step 6/9；若变更必须重开上游设计。 |
| 禁止把 ACK、HTTP 200、PID、端口、socket、toast 或本地日志映射成 running/success | 这些不是 owner execution truth。 | 需求验收、架构一致性、概要 Step 8～10。 |
| 禁止 unknown/stale/conflict 自动转 success 或启用副作用 replay | 会产生重复 start/stop/cancel/cleanup/handoff。 | 概要 Step 8～10 与 owner idempotency/reconcile 合同。 |
| 禁止关闭 expected generation/source/digest/lease/version 并发校验 | 破坏 local strong consistency 与 owner basis。 | 概要对象/流程/状态与 03 transaction design。 |
| 禁止将 query/render/reconnect 配置成写入、refresh 或 repair | 破坏 CQRS/no-write 和恢复边界。 | 概要 Step 7/8/10。 |
| 禁止绕过 lease/capture/handoff/retention/orphan `ProtectionGuard` | 可能误删 active/调查/交接材料。 | 需求保护规则、概要 Step 6/9。 |
| 禁止磁盘压力或用户角色 override unknown/protected | 安全优先级高于容量与便利。 | 概要 Step 9～10；若 owner 规则变化回上游合同。 |
| 禁止关闭 mandatory redaction、bounded preview、visibility/source/freshness attribution | 可能泄露 secret/raw body 并伪造完整信息。 | 安全需求、Observability 合同、概要 Step 6～10。 |
| 禁止把 local logs/telemetry/diagnosis/handoff receipt 配成 audit/evidence/report/verdict/signoff | 正式证据 ownership 不在 Runner。 | L4-observability 合同与本仓需求/架构。 |
| 禁止通过配置直连 sibling 内部表、事务、源码、Sandbox 私有 backend 或 L0-bus topic/group | 绕过 SDK/正式 API 与依赖方向。 | 全局依赖规则、架构 §8、ADR。 |
| 禁止通过 feature flag 创建 Runner outbound event family | 没有需求、owner/consumer、payload 与 delivery 合同。 | 回退 Step 7～9 及需求/架构校准。 |
| 禁止以配置关闭 local intent 与 operation basis 的原子保存 | 会扩大 crash window 并失去幂等恢复依据。 | 概要 Step 8/10 与 03 transaction design。 |
| 禁止让不兼容/未知配置静默采用安全性更弱的默认值 | 违反 fail-closed。 | 03 ConfigValidator/ConfigError，必要时回概要。 |

## 5. 直接与间接配置消费边界

| 层 / 主体 | 是否直接读取原始配置 | 允许接收 | 禁止接收 |
|---|---:|---|---|
| Config loader/validator + composition root | 是 | raw sources、profiles、secret refs；输出 immutable validated snapshot | domain 决策或 owner truth。 |
| Runtime builder | 否（只接 validated snapshot） | typed adapter/store/job/presentation configs | 未校验 map/JSON/环境散值。 |
| Adapters / store / job scheduler / presenters | 否（只接各自 typed slice） | endpoint/provider/budget/schedule/capability/policy refs | unrelated config、raw secrets、domain override flags。 |
| Application services | 否 | typed bounded policy、ports、clock、transaction coordinator | config loader、environment、provider-specific options。 |
| Domain objects / state machines / guards | 否 | 已验证的业务输入、owner refs、safe observations | 任意配置对象、feature flag、endpoint、timeout。 |
| Query view composition | 否 | typed clipping/display policy 与 safe projections | refresh trigger、owner write config、raw body access。 |

## 6. 配置影响轮廓图

```text
Config sources + secret references
              │
              ▼
ConfigLoader / ConfigValidator
  - 形成 immutable validated configuration snapshot
  - incompatible / missing / unsafe => fail-fast or blocked
              │
              ▼
Composition root / runtime builder
  ├─► Entry / presentation adapters
  ├─► Owner + platform + redaction adapters
  ├─► State store / material cache providers
  └─► Operations job schedulers and bounded resource policies
              │
              ▼
Application services receive typed ports / policies only
              │
              ▼
Domain objects / state machines / guards
  - no raw configuration access
  - invariants and ownership remain fixed
```

关键说明：

- 图只表达配置验证、装配和受影响主体，不选择配置格式、加载库、密钥系统、部署挂载或热更新机制。
- Domain 层不直接读取配置；可调预算必须先转为经过验证的 typed policy，且不能改变状态机红线。
- Adapter/provider 可替换不等于可以直连私有实现；每个实现仍必须满足 Step 7 required port 和 SDK-first 边界。
- 具体默认值、路径、endpoint、timeout、batch、capacity、retention 与 sampling 只在有 authority 时由 04 描述。

## 7. 交给 03-详细设计的配置实现契约方向

| 契约方向 | 03 必须回答 | 当前不得提前回答 |
|---|---|---|
| Config ownership and lifecycle | validated snapshot 的 owner、初始化顺序、不可变/变更边界、运行失败传播 | 具体 key、文件名、环境变量和 reload 运维。 |
| Typed grouping | runtime/adapter/store/cache/job/presentation/telemetry/secret-ref 的分组与最小暴露 | 字段全集与默认值。 |
| Loader and source precedence | 支持哪些抽象 source、合并冲突与来源追踪的接口 | 实际 JSON/YAML/TOML 示例和部署挂载。 |
| Validation | cross-field capability、安全红线、路径/预算、owner contract readiness 校验 | 固定数值与环境专用规则。 |
| Error model | startup fatal、feature blocked、adapter unavailable、unsafe config 的 typed error 分类 | 完整错误码/用户文案。 |
| Injection | composition root 到 adapter/store/job/service/presenter 的 slice 注入，domain no-read | 具体 DI 框架。 |
| Secret boundary | secret ref resolver interface、短暂使用、zero-persistence/redaction boundary | 密钥名称、provider 产品、轮换操作。 |
| Configuration observability | active profile/source fingerprint、安全 redacted diagnostics 与 change correlation | 将配置 dump 到日志或 evidence。 |
| Testing seams | validator table、unsafe config negative tests、injection isolation、config provenance tests | 测试结果或 baseline。 |

## 8. 交给 04-配置设计的内容边界

04 才可在 03 实现契约和真实技术选择成立后说明：正式配置项与分组、来源与优先级、是否必填、类型/单位、默认值及其 authority、允许范围、平台差异、secret reference、校验反馈、安全示例、变更与兼容口径。没有 workload、owner 合同或实现载体时，不得在 04 复用 README 的历史数字、路径或产品名。

## 9. 配置与异常/状态的一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 结构来源 | pass | 所有受配置主体均来自 Step 4～10；未新增业务模块。 |
| Domain isolation | pass | domain/guards/state machines 不直接读配置。 |
| State invariants | pass | 多轴、unknown、generation/binding、protection 等均不可配置化。 |
| Owner boundary | pass | endpoint/provider 配置不能改变 owner 或启用私有 backend。 |
| Security | pass | redaction、visibility、secret zero-persistence、fail-closed 不可关闭。 |
| Transactions/recovery | pass | 配置不能关闭原子 intent/basis、expected version 或启用 replay。 |
| Jobs | pass | cadence/budget 可调，语义出口和 binding checks 固定。 |
| Blockers | pass | adapter config 不等于 adapter readiness；`RUN-UP-001~008` 保持。 |
| 03/04 separation | pass | 03 做实现契约，04 做正式项/值/用法；当前未提前列 key/value。 |

## 10. 历史材料污染扫描

| 历史候选 | 当前处理 |
|---|---|
| Tauri/Electron、Rust runtime、Docker/gVisor/Firecracker provider | 未继承；待 03 基于真实约束选择，Sandbox backend 不成为 Runner 配置。 |
| 固定冷/热启动、并发、cache、timeout、retry 数字 | 未继承；等待 workload、owner contract、性能/测试 authority。 |
| 日志库、监控平台、数据库和配置格式 | 未继承；只保留 port/contract direction。 |
| `latest` 或 bypass guard feature flag | 明确列入禁止配置化。 |
| 本地日志审计开关 | telemetry 可配置但不能升级为 audit/evidence。 |

## 11. 回填草稿

正式 §11 保留配置影响轮廓表、禁止配置化边界表、直接/间接消费边界、配置影响图与 03/04 交接说明。可合并相邻 adapter 行，但必须保留：composition root 校验、domain no-read、job/provider/budget 可调、secret ref、owner readiness、不可配置的 explicit version/authority/integrity/multi-axis/no-replay/protection/redaction/evidence/SDK-first/transaction 红线。

## 12. 待确认事项

- 具体运行载体、语言、配置库、store/cache provider、GUI/CLI packaging 与进程模型尚未选择，03 必须重新核验，不能从 README 继承。
- Exact owner endpoints/client profiles/capabilities 取决于 `RUN-UP-001~008`；未闭合前相关 feature 配置只能校验为 blocked/not-ready。
- 所有数值预算需要 workload、平台与安全 authority；当前只定义“bounded/configurable/validated”，不定义值。
- 是否支持运行时 reload、哪些变更需重启、回滚和 secret rotation 属于 03/04 后续判断，当前不假定支持。

## 13. 进入下一步条件

- [x] 已明确哪些主要部分、入口、adapter、store、job 和接缝直接/间接受配置影响。
- [x] 已明确 domain/application 的原始配置隔离与 validated typed policy 注入方向。
- [x] 已显式列出 ownership、domain invariant、状态机、事务、一致性、安全、保护、证据和依赖的不可配置边界。
- [x] 已把实现契约交给 03，把配置项/值/示例/运维交给 04。
- [x] 未写配置 key、默认值、格式示例、环境变量、密钥名称或完整实现类型。
- [x] 配置不能关闭 `RUN-UP-001~008` 或制造 adapter readiness。

结论：`gate_status=pass`，允许进入 Step 12“详细设计承接清单”。
