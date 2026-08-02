# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 在 Step 5~10 已收稳主要组成部分、关键对象、接口骨架、处理流、状态机和异常边界的前提下,识别 `L4-sandbox` 哪些概要层结构会受配置影响,哪些红线绝不允许被配置化改写,以及哪些配置实现契约必须后移 `03-详细设计.md` 和未来 `04-配置设计.md`。本步不定义配置项清单、默认值、JSON / YAML、环境变量名、密钥名、产品参数、`RuntimeConfig` 字段全集或 `ConfigError` 枚举全集。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 11 | 是。Step 10 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 11 | 是。`project_execution_ledger.md` 已将恢复点停在 `02-概要设计.md` Step 10,用户确认后允许进入 Step 11。 |
| 文档级 flow 是否允许进入 Step 11 | 是。`02_hld_calibration_flow.md` 已记录 Step 10 `pass_wait_review`,进入 Step 11 的门禁已满足。 |
| 是否已读取 Step 4~10 | 是。Step 4 提供代码主体框架,Step 5 提供主要组成部分,Step 7 提供接口骨架,Step 8 提供关键处理流,Step 9 提供状态机,Step 10 提供关键异常与边界场景。 |
| 是否已读取概要 SOP Step 11 和书写规范 §4.11 | 是。必须输出配置影响轮廓表、禁止配置化边界表,并把配置实现契约后移到 `03/04`。 |
| 是否发现阻塞 Step 11 的上游 blocker | 否。正式 `04-配置设计.md` 缺失、backend 组合和 security profile 未闭口仍是下游缺口,但不阻塞概要层先收稳配置影响边界。 |

---

## 2. 本步目标

本步要回答的不是“配置怎么写”,而是“配置可以影响哪里,又绝不能改写哪里”。

本步要收稳:

- 哪些主要组成部分、运行单元、接口入口、adapter port、job 或下游交接接缝会受到配置影响。
- 哪些 domain 主语、guard、状态机和审计 / 安全 / 一致性红线只能间接受配置影响,不能直接读配置。
- 哪些 backend / profile / limit / timeout / cadence / retention / enablement / degraded policy 可以后移为配置实现契约。
- 哪些红线必须在 `03-详细设计.md` 和未来 `04-配置设计.md` 中继续保持不可配置化绕过。

本步不展开:

- config key、默认值、文件格式、目录路径、环境变量名、secret 名称。
- Docker / gVisor / Firecracker / k8s / local_process 等产品级 profile 组合。
- domain / IP / port / protocol 粒度的网络放行清单。
- retry / backoff / cron / batch / cursor / retention / TTL 的具体数字。
- 配置加载函数、builder 构造参数全集、错误码和启动脚本。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供配置不得改变 truth owner、boundary、policy、handoff、cleanup、redline 或依赖裁剪的结构性门禁。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit` 等运行承载骨架。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 6 个正式主要组成部分和职责边界。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Outbound Event、Operations Job 和外部 port 骨架。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 intake、boundary、policy、run、capture、handoff、failure、cleanup、redline、projection、reconciliation 和 relay 主路径。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止被配置绕过的 accepted / established / fail-closed / cleanup / redline / relay 状态迁移红线。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供 capability stale、silent degrade、policy missing、capture failure、cleanup blocked、orphan、redline、relay failed 等异常红线。 |
| `projects/L4-sandbox/00-需求文档.md` §11 / §12 / §13 / §14 | 当前正式需求基线 | 提供 execution isolation truth ownership、接口依赖、NFR、验收红线和配置不可越界口径。 |
| `projects/L4-sandbox/01-架构设计.md` §3 / §8 / §9 / §10 / §13 / §15 | 当前正式架构基线 | 提供横切配置边界、数据所有权、一致性、通信方式、风险挂起项和“配置不得改变核心语义”的正式结论。 |
| `projects/L1-artifact/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 参考如何把运行承载、adapter、job、handoff 和只读面组织成配置影响轮廓。 |
| `projects/L1-governance/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 参考如何单列禁止配置化边界和详细设计配置契约方向。 |
| 旧 `README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于审计旧 Docker/gVisor、旧 allowlist、旧 security profile、旧 fallback、旧性能数字和旧后端设定回流风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 3~10、概要 Step 11 标准和 L1 样例。 | done | 确认只写配置影响轮廓,不写配置项清单。 |
| 2 | 从主要组成部分、接口骨架、处理流、状态机和异常边界中提炼可配置接缝。 | done | 形成“可配置承载 / 不可配置语义”候选池。 |
| 3 | 回答 Step 11 SOP 问题。 | done | 明确哪些结构受配置影响,哪些只能间接受影响。 |
| 4 | 输出配置影响轮廓表和禁止配置化边界表。 | done | 每条配置影响都回指已有主要部分 / 接缝,不引入新主语。 |
| 5 | 输出配置影响图、详细设计配置契约方向和 `04` 后移清单。 | done | 保障 Step 12 和后续 `03/04` 不会临时补真相源。 |
| 6 | 更新 flow 和项目级台账,并停在用户审查点。 | done | Step 11 完成后已进入 wait review,不跨到 Step 12。 |

---

## 5. SOP 问题回答

### 5.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

会受到配置影响的结构,主要集中在“运行承载选择”和“外围接缝装配”,而不是核心语义本身:

- `Sandbox Sync Entry` 的请求体上限、同步超时、幂等支撑、入口 profile、调用方引用解析 profile。
- `Sandbox controlled execution fulfillment unit` 的 backend 选择 profile、boundary profile ref、resource / filesystem / network / process 限制模板引用、capability refresh 口径和 lease profile。
- `Policy execution decision` 所消费的 policy summary / authorization summary adapter、source routing、freshness threshold、source availability degrade surface。
- capture / handoff / relay 的目标接缝、pending retention、delivery class、retry class、receipt validation profile 和 observability material export profile。
- cleanup / reaper / redline / investigation handoff 的 cadence、batch、parallelism、guard evaluation profile、containment escalation target ref。
- read projection、derived inspect / preview / trend、backend capability comparison、reconciliation report 的 stale threshold、rebuild cadence、page limit、degraded exposure policy。
- `ContextReferenceResolverPort`、`PolicySummaryPort`、`BackendCapabilityPort`、`IsolationBackendPort`、`MaterialHandoffPort`、`ObservabilityMaterialPort`、`EventRelayPort` 和 `InvestigationHandoffPort` 的 adapter 装配、认证方式、endpoint / channel ref 和 enablement。

### 5.2 哪些模块只能间接受配置影响,不能直接读取配置?

以下主语只能通过 application service 注入的已验证输入、profile summary、schedule outcome、adapter capability 或 degraded policy 间接受配置影响,不能直接读取 runtime config:

- 核心对象:
  `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`CleanupGuard`、`OrphanRecoveryRecord`、`RedlineContainment`。
- 核心 guard / policy:
  `ControlledExecutionIntakeGuard`、`BoundaryCoherenceGuard`、`FailClosedPolicyGuard`、`CaptureCompletenessGuard`、`HandoffOwnershipGuard`、`ControlConflictGuard`、`CleanupSafetyGuard`、`RedlineContainmentGuard`、`DerivedReadOnlyGuard`。
- 核心状态机和核心一致性规则:
  accepted / established / fail-closed / running / capture / cleanup / containment / relay 的正式迁移语义。

这些主语不能因为配置而直接改变:

- accepted context 的成立条件
- coherent boundary 的成立条件
- fail-closed 的触发条件
- capture truth 和 handoff truth 的边界
- cleanup guard 和 redline containment 的阻断语义
- query / consumer / job 的 no-write 红线

### 5.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- `L4-sandbox` 只拥有 execution isolation truth,不拥有 identity / work / runtime / artifact / observability / policy source truth。
- `ControlledExecutionContext::Accepted` 的最小闭口前提。
- `CoherentBoundary::Established` 必须同时满足 resource / filesystem / network / process 等必需边界。
- backend 不支持或无法验证时不得 host-run、旁路运行或 permissive fallback。
- `PolicyExecutionDecision::FailClosed`、`Rejected`、`Blocked` 语义不能被 feature flag 或 fallback profile 弱化。
- `HighRiskActionDecision::Blocked` / `Unsupported` 不能被“临时放行”配置绕过。
- `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact` 的 ownership 分层不能被配置打穿。
- `CleanupGuard`、`LeaseRecord`、`OrphanRecoveryRecord`、`RedlineContainment` 的保守收束链不能因 schedule / retention / force-clean profile 而绕过。
- `GetSandboxReadProjection`、`GetDerivedInspectPreviewTrend`、`GetSandboxReconciliationReport` 等 query / derived 只读面不能因配置变成 repair / rebuild / release 写入口。
- `PublishSandboxEventRelay` 或 handoff delivery 失败不能因配置变更而回滚已成立 truth。
- `L0-core` 之外的 sibling 不能因“开发便利配置”变成编译期依赖。

### 5.4 哪些配置影响需要在详细设计中继续定义配置实现契约?

`03-详细设计.md` 需要继续定义:

- `RuntimeConfig` 的分层归属: sync entry、consumer、execution fulfillment、maintenance jobs、read / derived、handoff / relay、port adapter。
- `ConfigLoader` / `ConfigValidator` / runtime builder 的注入关系,以及配置失败时是启动阻断、adapter disable、read degraded、consumer delayed 还是 job skipped。
- backend profile、boundary profile、lease profile、policy summary profile、handoff profile、cleanup profile、redline escalation profile、projection profile、reconciliation profile 的契约分类。
- key operations job 的 config surface: `RefreshBackendCapabilitySummaries`、`RetryPendingMaterialHandoffs`、`PublishSandboxEventRelay`、`RunLeaseOrphanReaper`、`EvaluatePendingCleanupGuards`、`MaintainRedlineContainmentHandoffs`、`RebuildSandboxReadProjections`、`MaintainDerivedInspectPreviewTrend`、`RunSandboxReconciliation`、`RefreshSandboxReferenceStates`。
- 配置快照如何进入 audit / trace / run metadata / acceptance evidence chain,以及哪些高风险配置变更需要额外审查。

### 5.5 哪些配置细节属于 `04-配置设计`,不能在概要设计中提前展开?

以下内容必须后移 `04-配置设计.md` 或更后续文档:

- config key、环境变量名、文件路径、目录结构、默认值、单位和字段级 JSON / YAML / TOML 结构。
- backend 产品名、镜像名、cluster / namespace / node pool、workspace mount 清单、seccomp / AppArmor / cap-drop 配置、具体 network allowlist 条目。
- queue / bus / object storage / trace store / audit store / secrets / observability / investigation 系统的 endpoint、bucket、topic、credential、token 和 secret ref。
- timeout、TTL、batch、cursor、retry、backoff、parallelism、retention、lease 窗口、redline escalations 的具体数字。
- rollout、feature flag 名称、灰度步骤、热更新、运维操作、部署脚本和 capacity / SLO 参数。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 README 的 Docker / gVisor / default no-egress 叙事 | 容易把具体后端组合、旧默认网络策略和旧安全 profile 写成当前正式配置基线。 | 本步保持产品中立,只点名 backend profile、boundary profile 和 capability summary 这类配置影响角色。 |
| 旧 `02` 的旧 allowlist / fallback / replay 线索 | 容易把策略来源、弱路径 fallback 或 replay 恢复主线配置化。 | 明确 policy source truth 外部拥有,fail-closed 不可配置化放宽,cleanup / replay 不改核心语义。 |
| `04-配置设计.md` 当前缺失 | 容易诱发在概要 Step 11 提前写 key、默认值、env var 和 JSON 模板。 | 本步只收稳配置影响轮廓和后移边界,不代写 `04`。 |
| cleanup / handoff / redline 细节尚未产品级闭口 | 容易在实现期用 retention、force cleanup 或 target enablement 配置临时绕过 guard。 | 单独列出 cleanup guard、reaper、redline containment 的禁止配置化边界。 |
| read-side / derived / relay 运行调节散落在 Step 8~10 | 后续详细设计可能把 read rebuild、relay retry 或 reconciliation 配成核心写路径。 | 本步单独限定 query / consumer / job 的写边界,并把调节类配置约束到 read / relay / maintenance 外围。 |

---

## 7. 配置影响分层原则

### 7.1 配置只影响承载,不改写正式语义

本步统一采用以下分层:

| 分层 | 允许受配置影响的内容 | 禁止受配置影响的内容 |
|---|---|---|
| runtime builder / entry | enablement、timeout、body limit、profile ref、adapter wiring、idempotency store choice | accepted context 语义、query no-write、formal truth 条件 |
| adapter / port | endpoint / channel ref、credential ref、cache / freshness threshold、delivery class | truth ownership、policy source truth、artifact truth、observability truth |
| maintenance / handoff / read job | cadence、batch、cursor、retry、parallelism、stale threshold、retention window | cleanup guard 解除、redline containment 解除、relay failure rollback |
| application service | 读取已校验 profile summary 和 runtime policy,选择已允许分支 | 直接读取原始配置并改写 domain invariant |
| domain object / guard / state machine | 间接受到上层已验证输入影响 | 直接读取配置、跳过 fail-closed、放宽 coherent boundary |

### 7.2 配置只在已有主语上生效

本步不发明新的“ConfigManager 子域”或“SandboxPolicyConfig 真相中心”。所有配置影响都必须回指 Step 4~10 已确认的:

- 主要组成部分
- 运行单元
- Command / Query / Consumer / Job
- external port / adapter
- projection / derived / relay / cleanup / reaper / containment 接缝

---

## 8. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `Controlled execution intake and identity` | 是 | intake profile、request body limit、sync timeout、idempotency backend profile、context resolver source set、safe summary freshness threshold | 定义 intake `RuntimeConfig`、resolver `AdapterConfig`、idempotency config 和启动 / 拒绝 / pending surface 规则,不得改变 accepted / rejected / unresolved 语义 |
| `Boundary establishment and enforcement` | 是 | backend profile ref、boundary profile ref、resource / filesystem / network / process limit template ref、capability stale threshold、lease profile | 定义 boundary / backend `AdapterConfig`、profile validator 和 unsupported / pending / failed surface,不得改变 `CoherentBoundary` 成立条件 |
| `Policy execution decision` | 是 | policy summary source routing、authorization summary freshness threshold、source auth ref、policy reevaluation profile、high-risk action summary profile | 定义 `PolicySummaryPort` config、summary validator、stale / missing / conflicted / unsupported handling,不得把 policy source truth 本地化 |
| `Execution capture and material handoff` | 是 | capture size class、material export class、handoff target enablement、receipt profile、relay publish class、pending retention threshold | 定义 capture / handoff / relay config 分类和 failed / retryable / pending surface,不得让 capture / handoff ownership 分层失效 |
| `Failure control and safety closure` | 是 | control intake timeout、lease duration profile、orphan scan cadence、cleanup evaluation cadence、reaper concurrency、redline escalation target ref | 定义 control / cleanup / reaper / containment `JobConfig` 和 runtime builder 注入,不得让 cleanup / reaper 绕过 guard |
| `Local reference, projection and derived support` | 是 | projection stale threshold、rebuild cadence、page limit、comparison scope、derived view enablement、reconciliation cadence、degraded exposure policy | 定义 read / projection / derived / reconciliation config 和 `QueryConfig`,不得让 query / derived 变成 repair path |
| `Sandbox Sync Entry` | 是 | command / query endpoint enablement、operator profile、sync timeout、request size / concurrency guard、idempotency store wiring | 定义 entry builder config、startup validation 和 degraded startup behavior,不得关闭正式入口门禁 |
| `Sandbox async control and handoff consumption unit` | 是 | subscribed source set、schema version allowlist、dedupe store profile、handoff status consumer profile、quarantine / delayed handling class | 定义 consumer config、source version validation 和 duplicate handling,不得让 consumer 直接创建核心 success |
| `Sandbox controlled execution fulfillment unit` | 是 | execution worker profile、launch timeout、backend adapter wiring、capture staging profile、run actor metadata profile | 定义 fulfillment runtime builder、launch config 和 backend lifecycle handling,不得把 worker profile 变成 policy / boundary 真相 |
| `Sandbox backend maintenance and cleanup unit` | 是 | schedule、batch、cursor、retry、parallelism、cleanup / orphan / containment evaluation profile、maintenance actor profile | 定义 maintenance `JobConfig`、idempotency、blocked / skipped / degraded handling,不得把后台 job 变成业务 command |
| `ContextReferenceResolverPort` | 是 | source endpoint ref、auth ref、cache TTL class、resolver fallback policy、stale threshold | 定义 resolver `AdapterConfig` 和 unavailable / unresolved surface,不得保存外部正文或接管外部生命周期 |
| `PolicySummaryPort` | 是 | source route、credential ref、summary cache class、refresh policy、availability threshold | 定义 policy adapter config 和 summary validator,不得改变 fail-closed 语义或 policy source ownership |
| `BackendCapabilityPort` | 是 | capability source route、probe cadence、summary freshness threshold、comparison scope、availability degrade class | 定义 capability adapter config 和 stale / unsupported / unavailable surface,不得把 capability summary 升格为 backend product truth |
| `IsolationBackendPort` | 是 | backend selection profile、launch / release timeout class、carrier auth ref、lifecycle signal profile、boundary translation profile | 定义 backend adapter config、profile validator 和 capability compatibility check,不得允许 host-run / weak fallback 成为 formal path |
| `MaterialHandoffPort` | 是 | target ref、delivery class、receipt validation policy、retry class、pending retention policy | 定义 handoff adapter config 和 receipt / failed / retryable status mapping,不得把 receipt 当下游 formal truth |
| `ObservabilityMaterialPort` | 是 | export target ref、material class、delivery mode、retry class、backpressure degrade policy | 定义 observability adapter config 和 delivery failure surface,不得让 observability handoff 覆盖 capture truth |
| `EventRelayPort` | 是 | route class、publish mode、retry / dead-letter class、feedback subscription profile | 定义 relay adapter config、publish failure state mapping 和 feedback validation,不得让 relay failure 回滚 source fact |
| `InvestigationHandoffPort` | 是 | escalation target ref、handoff class、receipt profile、retry class、safety acknowledgement threshold | 定义 investigation handoff config 和 pending / failed / blocked mapping,不得接管 investigation lifecycle truth |
| `GetSandboxReadProjection` / `GetDerivedInspectPreviewTrend` / `GetSandboxReconciliationReport` | 是 | query page limit、freshness hint policy、degraded / unavailable exposure mode、preview enablement、comparison scope | 定义 `QueryConfig`、read model selection 和 surface contract,不得触发 refresh、repair、cleanup 或 release |
| `PublishSandboxEventRelay` / `RetryPendingMaterialHandoffs` / `RunLeaseOrphanReaper` / `EvaluatePendingCleanupGuards` / `MaintainRedlineContainmentHandoffs` | 是 | schedule、batch、cursor、retry、parallelism、maintenance actor、skip / degraded policy | 定义 `JobConfig` 和 job state surface,不得让 job 自行修核心 truth 或解除 guard |

---

## 9. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| execution isolation truth ownership | 这是 `L4-sandbox` 的存在理由,不能由 profile、backend、flag 或 adapter 开关改变 | `00-需求文档.md` / `01-架构设计.md` |
| `ControlledExecutionContext::Accepted` 最小闭口前提 | 防止通过配置跳过 actor / refs / responsibility / idempotency 门禁 | 需求业务规则 / Step 9 状态机 |
| coherent boundary 必须整体成立 | 防止 resource / filesystem / network / process 任一必需边界 silent degrade | Step 3 约束 / Step 9 状态机 / `01-架构设计.md` |
| host-run / weak fallback 不能升格为 formal path | 防止 backend profile 不可用时落回宿主直跑或非托管执行 | 需求一票否决 / 架构承载边界 |
| policy source truth 外部拥有 | 防止 sandbox 反向拥有 allowlist、approval、capability 或 policy DSL truth | `00` 数据归属 / `01` 依赖与数据所有权 |
| fail-closed 不可被 feature flag 弱化 | 防止 missing / conflicted / unsupported / unauthorized 时继续执行 | Step 10 异常边界 / Step 9 状态机 |
| 高风险动作阻断不可被配置放行 | 防止所谓“特例 profile”绕过 `HighRiskActionDecision::Blocked` / `Unsupported` | 需求规则 / policy 执行边界 |
| capture truth 与 handoff truth 分层 | 防止 candidate material、observability material、receipt 或 downstream ack 静默升级为 formal truth | Step 8 流程 / Step 10 异常边界 |
| cleanup guard 先于删除动作 | 防止 retention / force cleanup / reaper schedule 直接删证据 | Step 8 / Step 10 / 需求否决项 |
| reaper 不得绕过 orphan / cleanup / investigation guard | 防止过期环境被“高优先级回收”配置直接清走 | Step 9 状态机 / Step 10 异常边界 |
| redline containment 不得 advisory-only | 防止 redline 只记日志不 containment,或在 investigation 未放行前释放 | Step 10 异常边界 / 安全红线 |
| Query no-write | 防止 read surface 配置化为 refresh、repair、release 或 policy 放行入口 | Step 3 约束 / Step 7 / Step 8 |
| Consumer 不写核心 truth | 防止 source subscription / schema policy 配置把 consumer 变成业务写入口 | Step 7 接口骨架 / Step 8 流程 |
| Job 不修复核心 truth | 防止 rebuild / reconciliation / retry / reaper job 直接补写核心 success | Step 8 流程 / Step 9 状态机 |
| relay / handoff failure 不回滚 accepted truth | 防止下游可用性通过配置反向定义 sandbox truth 成立与否 | Step 10 异常边界 / 一致性边界 |
| 外部正文禁止入仓 | 防止 resolver / debug / preview / replay / observability 便利把外部正文写进 sandbox truth | `00` 数据归属 / Step 3 / Step 10 |
| 同一执行 / policy / control 语义唯一 | 防止按调用方、backend profile 或下游 target 配置出第二套正式语义 | Step 9 状态机 / `00` AC / VF |
| `L0-core` 之外不得变成编译期依赖 | 防止用配置包装 sibling repo 或 backend SDK 进入 core 编译期主线 | 全局裁剪规则 / `01-架构设计.md` |

---

## 10. 配置影响轮廓图

```text
+====================================================================+
|                 Sandbox Configuration Impact Map                   |
+====================================================================+
| Runtime configuration                                               |
|   |                                                                 |
|   +--> Entry / Consumer / Job / Port builders                       |
|   |       | validate profiles, limits, targets, cadences            |
|   |       v                                                         |
|   |   Sync entry / async consumption / maintenance jobs             |
|   |       | pass validated settings into application services        |
|   |       v                                                         |
|   |   Intake / boundary / policy / capture / cleanup / read flows   |
|   |       | consume profile summaries, never raw config             |
|   |       v                                                         |
|   |   Domain objects / guards / state machines                      |
|   |       | invariants stay fixed; no direct config read            |
|   |       v                                                         |
|   |   Truth / handoff / cleanup / redline boundaries                |
|   |                                                                 |
|   +--> Adapter seams                                                |
|           | resolver / capability / backend / handoff / relay       |
|           | observability / investigation / projection              |
|           v                                                         |
|       External refs, material delivery, read-side degraded surfaces |
+====================================================================+
```

关键说明:

- 配置只影响 entry、consumer、job、adapter 和 read-side / handoff / maintenance 接缝,不允许 Domain 直接读取原始配置。
- application service 只能消费已校验的 profile summary、limits、targets、cadence 或 degraded policy,不能用配置改写 invariant。
- 图只表达“配置影响哪些概要层主要部分或接缝”,不表达 JSON 示例、环境变量、密钥系统、部署挂载、热更新或产品参数。
- backend / relay / handoff / cleanup / redline 的配置只能改变承载与节奏,不能改变 truth ownership、fail-closed、cleanup guard 或 containment 语义。

---

## 11. 交给详细设计的配置实现契约方向

| 契约方向 | `03-详细设计.md` 需要回答 | 本步不展开 |
|---|---|---|
| Runtime config ownership | 哪个 runtime owner 负责 sync entry、consumer、execution fulfillment、maintenance jobs、read-side 和 handoff / relay 配置读取与校验 | 具体文件、key、env var、默认值 |
| Config validation | 哪些配置错误导致启动阻断、adapter disabled、command reject、read degraded、consumer delayed、job skipped | 完整 `ConfigError` 枚举和错误码 |
| Builder injection | `Sandbox Sync Entry`、async consumption、fulfillment、maintenance 和各 port builder 如何接收已验证依赖 | constructor 参数全集 |
| Boundary profile contract | boundary profile、resource / fs / network / process limit template 如何表达和校验 | 具体 profile 字段和产品参数 |
| Policy summary contract | policy / authorization summary adapter 如何配置、缓存和映射 stale / missing / conflicted / unsupported | source matrix 细节、approval workflow 协议 |
| Backend capability contract | capability source、probe / refresh、comparison 和 stale 阈值如何表达 | probe payload、vendor schema |
| Handoff / relay contract | handoff target、receipt policy、retry class、dead-letter class、feedback mapping 如何表达 | topic、bucket、receipt schema、数字参数 |
| Cleanup / reaper / redline contract | lease profile、cleanup evaluation、orphan recovery、containment escalation 如何配置并保留 guard | cron、并发数、审批流、操作脚本 |
| Read / projection / derived contract | page limit、freshness hint、degraded surface、rebuild cadence、comparison scope、reconciliation cadence 如何表达 | 默认值、响应字段细节 |
| Config evidence / change control | 配置快照如何写入 trace / audit / evidence chain,哪些高风险变更需要审查 | UI、审批名单、hash 算法、报表格式 |

---

## 12. 配置细节留给 `04-配置设计`

| 配置细节 | 留给后续文档的原因 |
|---|---|
| config key、env var、YAML / JSON / TOML 结构 | 属于配置说明和实现约定 |
| backend 产品参数、endpoint、凭据、topic、bucket、secret ref | 属于产品接入和部署参数 |
| resource quota、memory / cpu / time / process count 上下限 | 需要后续详细设计、测试和 capacity 验证闭口 |
| network allowlist 条目、mount 清单、seccomp / AppArmor / cap-drop profile | 属于安全 profile 和环境配置 |
| retry / backoff / cron / batch / cursor / parallelism / retention / TTL 数字 | 需要运维、压测和异常恢复策略验证 |
| rollout、feature flag、灰度切换、热更新、回滚流程 | 属于实施计划和运维治理 |
| SLO、P95 / P99、吞吐和告警阈值 | 需要测试方案、验收标准和真实证据闭口 |

当前正式 `04-配置设计.md` 尚缺失。本 Step 只定义未来 `04` 必须承接哪些配置影响轮廓和不可越界边界,不提前代写配置项清单。

---

## 13. Step 12 承接与反查清单

| Step 12 要继续收稳的主语 | Step 11 已固定的配置边界 | Step 12 需要补什么 |
|---|---|---|
| 关键对象详细承接 | 已明确核心对象和 guard 只能间接受配置影响 | 详细设计需把对象、port、service、job 的配置注入边界映射到实现主语 |
| 接口与 port 契约 | 已明确哪些 Command / Query / Consumer / Job / Port 受配置影响 | 详细设计需把 config owner、validator、degraded surface 和 builder 注入关系写清 |
| 状态机与错误 surface | 已明确哪些状态禁止配置绕过 | 详细设计需把 config failure 的 surface 类型映射到状态 / 错误契约 |
| `04-配置设计.md` 入口 | 已明确本步不写 key、默认值、JSON 和产品参数 | Step 12 需给未来 `04` 提供稳定 config 主语和分类目录 |

---

## 14. 回填 `02-概要设计.md` §11 草稿

正式 `02-概要设计.md` 在 Step 14 才能重建。当前可回填的 §11 草稿骨架如下:

1. 先写一段总述:
   `L4-sandbox` 的配置只允许影响运行承载、外围接缝、调度节奏和降级暴露方式,不得改变 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff ownership、cleanup guard、redline containment 或依赖裁剪。
2. 再放配置影响轮廓表:
   至少摘录 6 个主要组成部分、4 个运行单元和关键 port / job 的配置影响轮廓。
3. 再放禁止配置化边界表:
   至少摘录 truth ownership、accepted context 门禁、coherent boundary、fail-closed、cleanup guard、redline containment、query no-write 和 `L0-core` 依赖裁剪。
4. 最后写详细设计承接说明:
   本章只识别配置影响轮廓,不定义配置项清单、JSON 示例、`RuntimeConfig` 字段、`ConfigError` 枚举或 adapter constructor 参数;相关实现契约后移 `03-详细设计.md`,配置填写和使用后移未来 `04-配置设计.md`。

---

## 15. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否只识别配置影响轮廓 | 是 | 未写 key、默认值、env var、JSON 或产品参数。 |
| `主要部分 / 接缝` 是否全部回指已存在主语 | 是 | 均来自 Step 4~10 的主要组成部分、运行单元、接口或 port。 |
| 是否显式列出禁止配置化边界 | 是 | 已覆盖 truth owner、状态机红线、审计 / 一致性 / 安全门禁。 |
| 是否明确 Domain / Guard 不能直接读配置 | 是 | §5.2 和 §7 已明确“只能间接受影响”。 |
| 是否给出 `03` 的配置实现契约方向 | 是 | §11 已按 builder、port、job、read-side、evidence 分类。 |
| 是否把 `04` 应承接的配置细节后移 | 是 | §12 已明确保留给未来 `04-配置设计.md`。 |
| 是否改动正式 `projects/L4-sandbox/02-概要设计.md` | 否 | 正式文档仍待 Step 14 重建。 |

---

## 16. 当前结论

`02-概要设计.md` Step 11 `配置影响轮廓` 已完成当前中间产物收敛,并已同步更新 `02_hld_calibration_flow.md` 与 `project_execution_ledger.md`。

当前 next allowed action:

1. 停在用户审查点,等待用户审查 `02_hld_step_11_configuration_impact.md`。
2. 只有在用户再次明确确认后,才允许进入 Step 12 `详细设计承接清单`。
