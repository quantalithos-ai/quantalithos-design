# 02 概要校准 Step 11：配置影响轮廓

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 10 completed / pass
> 本步目的：识别概要层结构的配置影响、禁止配置化边界和详细设计承接方向；不定义配置项清单、默认值、文件格式或部署参数

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP Step 11、书写规范 §4.11、配置影响图规则已复核 |
| 已读取项目输入 | yes；Step 4~10、正式 00 / 01、横切约束、运行角色、依赖裁剪和 blocker 注册表已复核 |
| 当前 Step | Step 11：配置影响轮廓 |
| 本 Step 输出 | `design-calibration/02_hld_step_11_configuration_impact.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 并行兄弟效力 | `L2-member`、`L2-member-images` 的配置 / 合同讨论不作为本仓 truth；相关 adapter / ref 只保留 pending / blocked / waiting |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 12 |

- [x] 区分直接受配置影响、间接受影响和禁止读取配置的结构。
- [x] 建立配置影响轮廓表，回指既有七个组成部分、入口、adapter、job、store 和运行形态。
- [x] 建立禁止配置化边界表，覆盖 domain invariant、状态机、审计、一致性和安全门禁。
- [x] 说明 03 / 04 的配置实现承接方向，不预支 key、默认值、JSON 或 secret 名称。
- [x] 完成配置影响图、pending 审计和 Gate 自检。

## 2. SOP 问题回答

### 2.1 哪些结构会受到配置影响

直接受配置影响的结构集中在运行装配和外围接缝：

- 同步 Command / Query entry 的 profile、受控 request / read limits、依赖可用性和 degraded surface。
- Inbound Consumer 的 source allowlist、版本兼容策略、dedup / quarantine 边界和延迟处理策略。
- Operations Job 的 schedule、batch、cursor、retry class、parallelism 和运行 profile。
- Host carrier、registry、Images supply、credential qualification、Sandbox binding、Runtime session、Member intake、Bus / handoff、Observability 的 adapter / target 选择。
- truth、history、outbox、handoff、projection 的 store binding、publication target、freshness / rebuild cadence 和安全裁剪 profile。

间接受配置影响的结构包括 application service、source resolver 编排、health evaluation、reconciliation 和 safe query。它们只能接收已经校验的 profile、limit、target、schedule、adapter capability 或 freshness policy；不能自行读取原始配置。

### 2.2 哪些结构不得直接读取配置

七个业务组成部分中的 domain objects、policy、状态转换和历史规则均不得直接读取 runtime configuration：

- `HostIntent`、`HostOrchestrationDecision`、`HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`。
- `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence`。
- `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy`。
- `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision`。
- `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase`。
- `HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry`。

这些对象可以接收 application service 传入的已验证 context / policy basis / outcome summary，但不能通过配置改变 owner、状态含义、required qualification、single-active、history 或 no-fallback。

### 2.3 哪些配置细节留给后续文档

本步不定义 config key、默认值、JSON / YAML / TOML、环境变量、secret 名称、部署挂载、热更新、具体 timeout / retry / heartbeat 数字或产品 endpoint。03 负责配置加载、校验和 builder / adapter / job 注入契约；04 负责可填写的配置分类、来源优先级、敏感引用和运行激活规则；05~07 负责测试、验收与实施证据。

## 3. 配置影响分类原则

| 分类 | 允许的影响 | 禁止的影响 |
|---|---|---|
| `startup / runtime wiring` | 选择已声明的 store、adapter、event / ref / fake seam 和运行 profile | 改变领域 owner、对象集合、状态含义或依赖类型 |
| `entry-local` | 影响当前 entry 的可见范围、freshness request、受控资源上限或 degraded response | 绕过 actor / scope / idempotency / required qualification guard |
| `job-run-start` | 影响本次 Job 的 schedule context、batch、cursor、retry class、parallelism 或 target selection | 形成新的 lifecycle decision、改变 generation 或删除 gap / history |
| `adapter / external binding` | 选择中立 port 的实现、能力 profile、目标类别和可用性策略 | 将 backend / product state 直接变成 Host Truth 或 external completion |
| `projection / handoff` | 影响投影范围、刷新 / 发布节奏、safe redaction profile 和失败可见性 | 让 projection / outbox / handoff 反写 source 或伪造 delivered / observed / accepted |
| `security / secret reference` | 传递由外部 owner 管理的安全引用和最小 qualification | 在本仓签发、撤销、保存或输出 secret body |

## 4. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| CMP-MS-01 Host intent / decision entry | 是 | runtime profile、entry enablement、request limit、idempotency store ref、operator / actor context binding | `RuntimeConfig`、`ConfigLoader`、`ConfigValidator` 和 command entry builder 的注入边界；不改变双锚和显式 decision。 |
| CMP-MS-02 qualification source resolvers | 是 | source adapter ref、freshness policy ref、capability availability、credential / supply / binding resolver target | `AdapterConfig`、resolver availability、invalid-config disposition；exact Images / credential / Sandbox contract 仍 `pending`。 |
| CMP-MS-02 assembly / readiness | 间接受影响 | assembly profile、qualification evaluation cadence、degraded / blocked surface | 03 定义已验证 `QualificationConfig` / builder 输入；不得把配置变成 required qualification 的替代物。 |
| CMP-MS-03 host carrier / registry adapters | 是 | carrier adapter ref、registry / pinned asset adapter ref、capability profile、external endpoint ref | `AdapterConfig` 和 runtime builder 绑定；产品状态、资源正文和 backend state 不进入 domain。 |
| CMP-MS-03 action dispatch Job | 是 | schedule、batch size、lease / concurrency class、retry class、unknown-effect handling profile | `JobConfig`、run metadata、stable effect key 注入；Job 不创建 decision 或盲重放 unknown。 |
| CMP-MS-04 registration / Host Session entry | 是 | registration source binding、credential qualification adapter、session association profile、request / freshness limits | registration builder、contract compatibility guard 和 disabled / blocked disposition；不改变 single-active。 |
| CMP-MS-05 health signal Consumer | 是 | subscribed source class、accepted schema-version class、dedup store ref、freshness / quarantine policy | Consumer config 校验、unsupported / delayed / ignored handling；不由配置直接写 healthy 或 recovery。 |
| CMP-MS-05 health evaluation Job | 是 | evaluation schedule、sampling window class、batch / cursor、failure visibility profile | `JobConfig` 与 health evaluator 注入方向；具体阈值需正式 measurement authority，不在本步定义。 |
| CMP-MS-05 recovery / restart orchestration | 间接受影响 | recovery action availability profile、operator / policy context ref、action timeout class | 03 定义 decision service 接收的已验证 action capability；配置不能创建或自动提交 recovery decision。 |
| CMP-MS-06 closure / cleanup | 是 | cleanup adapter ref、release target class、job schedule、retry / unknown disposition class | cleanup `AdapterConfig` / `JobConfig`、failure mapping 和 local-first UoW 方向；Sandbox exact caller / receipt 仍 pending。 |
| CMP-MS-06 reconciliation Job | 是 | scan scope、cursor、batch、retry class、escalation target ref | `JobConfig` 与 case disposition input；不得配置为自动删除历史、修复 sibling truth 或隐式 lifecycle action。 |
| CMP-MS-07 material / history formation | 间接受影响 | redaction profile ref、material target class、history retention / indexing adapter | 03 定义 material / history builder 注入和 forbidden-body validator；不改变 immutable / append-only 语义。 |
| CMP-MS-07 outbox / handoff publisher | 是 | publisher adapter ref、target class、route binding ref、publication retry class、delivery visibility policy | `AdapterConfig` / `HandoffConfig`、submission failure surface 和 stable publication key；exact route / receipt `MSVC-UP-007` pending。 |
| CMP-MS-07 projection rebuild | 是 | projection scope、store adapter ref、cursor / rebuild cadence、batch / parallelism、degraded exposure | `ProjectionConfig` / `JobConfig`、builder 与 unavailable handling；projection 不反写 source。 |
| CMP-MS-07 safe Query / History Query | 是 | visibility profile ref、page / result limit class、freshness request policy、projection selection | `ReadConfig`、safe-field slicing 和 unavailable response contract；Query 仍 no-write。 |
| local truth / history / outbox / projection stores | 是 | store adapter ref、durability / availability profile、migration compatibility class | 03 定义 store binding、startup validation 和 disabled / degraded behavior；不共享 sibling storage。 |
| Member / Runtime / Images / Sandbox host-side seams | 是 | seam enablement、capability profile、external endpoint / ref binding、contract version allowlist | 仅定义 host-side placeholder adapter slots；并行合同未闭口时正向路径保持 blocked / waiting。 |
| L0-bus / Observability publication seam | 是 | event publisher ref、target class、redaction profile、delivery / observation visibility | `HandoffConfig`、safe envelope mapping 和 feedback placeholder；不把 submitted 变成 delivered / observed / accepted。 |
| Clock / ID / OperationsContext support seam | 是 | clock / id / operations adapter ref、test fixture selection | 03 定义 builder / fake seam；fake 只证明本地语义，不证明真实依赖。 |

## 5. 只能间接受配置影响的模块

| 模块 / 对象族 | 间接输入 | 直接禁止 |
|---|---|---|
| CMP-MS-01~06 domain objects and policies | 已验证 actor / scope、resolver result、capability outcome、expected revision、freshness basis | 直接读取 config、按 flag 改状态迁移、用默认值补 required source |
| `HostHealthAssessment` 四轴判断 | 已验证 signal snapshot、freshness / uncertainty basis、health evaluator input | 由阈值开关直接伪造 healthy、忽略 uncertainty axis 或把 Observability receipt 当 health truth |
| `HostClosure` / `ReconciliationCase` | 已提交 closure / finding、case disposition input、cleanup outcome | 由 job profile 自动完成 closure、删除 residual 或绕过 owner disposition |
| `HostFactMaterial` / `HostHistoryEntry` | committed change、redaction validator、source refs | 由 config 扩展 forbidden body、改写历史或改变 material 的 source authority |
| `SafeHostView` | source revisions、visibility scope、projection state | 由 Query config 触发 refresh / repair、将 stale view 伪装 fresh |
| `HostProjectionState` | committed cursor、rebuild job input、store outcome | 由配置直接标 fresh、跳过 gap、反写 core truth |

## 6. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| `ProjectMemberRef` 执行主语与一致 `GlobalMemberRef` 锚 | 这是范围和授权语义，不是运行 profile | 正式 00 / 01 的需求与职责边界 |
| 七个组成部分及 29 个对象的 owner 归属 | 配置不能产生第二 Host Truth 或合并独立状态轴 | Step 4~6、正式 01 |
| `HostIntent` / `HostOrchestrationDecision` 的显式受理与决定 | 防止 feature flag / operator profile 生成隐式 lifecycle action | Step 7~9、正式 00 / 01 |
| required qualification 共同成立与 no-fallback | 防止配置以默认值、旧缓存或 disabled adapter 放行 | Step 3、Step 9、Step 10 |
| generation immutable、single-active、late / unknown fence | 并发和副作用安全不能由 profile 关闭 | Step 3、Step 9、03 并发契约 |
| local-first、attempt / gap / outcome 分层 | 防止 timeout、receipt 或 publisher profile 伪造完成 | Step 8~10、03 事务 / port 契约 |
| Query no-write、Consumer 限权、Job no-hidden-command | 入口角色是架构边界，不是可选 feature | Step 7~10、正式 01 |
| Host Session 不扩成 Runtime run / checkpoint / memory / outcome | 防止 session profile 侵入 Runtime truth | 正式 01 与 `MSVC-UP-001` 双侧合同 |
| 不拥有 Member、Images、Sandbox、Governance、Observability 或 L1 truth | owner 不能被 adapter selection 迁移 | 正式 00 / 01 与对应上游正式文档 |
| forbidden body / secret / external正文排除 | 安全与数据所有权红线不能配置放宽 | 正式 00 / 01、Step 3、Step 10 |
| immutable material、append-only history、source revision anchor | 审计连续性不能随 retention / projection profile 被破坏 | Step 6 / 9、03 history / transaction 契约 |
| `submitted`、delivery、observation、acceptance 分层 | 下游可用性不能反向定义本仓 truth | Step 7~10、`MSVC-UP-007` |
| projection / outbox / handoff 不反写 source | 读侧或传播侧不能成为第二写源 | Step 8~10、03 projection / handoff 契约 |
| 项目范围不扩展到非项目型、warm pool 或复杂调度 | 当前没有正式 FR / owner / 主语 | 先重开正式 00，再回退 01 / 02 |
| 依赖分类不转换 | compile、runtime、event、ref、adapter、fake 具有不同 authority | 正式 01 §8、全局依赖裁剪规则 |
| 真实 readiness、integration、test、evidence、signoff | 配置 / fake 不能生成实现事实 | 05~07 正式文档和真实证据链 |

## 7. 配置影响轮廓图

```text
validated runtime configuration
  │
  ├─► entry builders / Consumer builders / Job runners
  │       │
  │       ├─► adapter / store / publisher / projection bindings
  │       └─► bounded limits / cadence / degraded surface
  │
  └─► application services receive validated context only
          │
          ▼
      domain objects / policies / state guards
          │
          ├─► fixed owner, generation, no-fallback and audit invariants
          └─► committed Host Truth
                  │
                  ├─► material / history / outbox / handoff
                  └─► projection / safe query (stale or unavailable explicit)
```

关键说明：

- 配置只进入 builder、entry、Consumer、Job、adapter、store、publisher、projection 和 safe read seam；domain 不直接读取原始配置。
- 图只表达配置影响范围，不表达加载实现、JSON、密钥系统、部署挂载、热更新或产品参数。
- 配置可调节节奏、承载和可用性表面，但不能改写 source owner、状态迁移、审计链或 external outcome 分层。

## 8. 详细设计与配置设计承接

| 契约方向 | 03-详细设计需要继续回答 | 04-配置设计再回答 |
|---|---|---|
| runtime config ownership | 哪个 runtime builder / entry owner 读取并注入已验证配置 | 配置来源、优先级、激活时机和敏感引用分类 |
| validation and failure | invalid config 的 startup blocked、adapter disabled、read degraded、consumer delayed 或 job skipped 语义 | 配置校验规则、错误呈现、来源冲突和运维可见性 |
| adapter / store binding | port 到 adapter / store 的绑定关系、fake / placeholder seam、availability result | 可填写的 target / profile 分类和环境差异 |
| job / projection controls | job-run metadata、cursor、batch、retry class、parallelism 和 projection state 注入 | schedule / batch / retry / cadence 的具体配置说明 |
| read / handoff controls | visibility、freshness、redaction、publication / feedback matching | read / handoff 配置分类、敏感边界和变更控制 |
| change traceability | 配置 revision 如何进入 correlation / history / audit marker | 配置变更审计、回滚和实施交接要求 |

本步不定义 `RuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 参数、配置 key、默认值、环境变量或 JSON 示例。`04-配置设计.md` 尚未创建，不能以本步占位冒充配置实现或 readiness。

## 9. 当前 blocker 与非伪造审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 配置是否新增结构主语 | pass | 所有条目均回指七个 CMP、既有 entry / adapter / store / job / projection / handoff seam。 |
| domain 是否直接读配置 | pass | 只接收已验证 context / policy basis；不读取原始 config。 |
| 状态机 / owner 是否可被 flag 绕过 | pass | required qualification、generation、single-active、history、no-write 和 outcome layering 列为禁止配置化。 |
| 并行 sibling 合同是否被配置补闭 | pass | Member / Images / Runtime / Sandbox / Bus 只保留 adapter / ref placeholder；exact contract pending。 |
| 产品 / 数值是否提前锁定 | pass | 未写产品名、endpoint、默认值、timeout / retry / heartbeat 数值或容量目标。 |
| fake / planned 是否伪造 ready | pass | fake / disabled / degraded 只描述 seam 语义，不产生 integration / readiness evidence。 |
| 04 配置文档是否提前创建 | pass | 本步只给 04 承接方向，未创建 `04-配置设计.md`。 |

## 10. 正式第 11 章回填草稿

正式 §11 应保留配置影响轮廓表、禁止配置化边界表和一张简化影响图，核心结论为：

1. 配置影响 runtime wiring、entry、Consumer、Job、adapter、store、projection、publisher、handoff 和 safe read surface；application service 只接收已验证输入。
2. domain objects、policy、状态机、source owner、审计链、local-first、no-fallback、single-active、forbidden body 和 outcome layering 不可配置化。
3. Member / Images / Runtime / Sandbox / Bus 的 exact contract 未闭口时，配置只能选择 placeholder seam，不能把路径升级为 ready。
4. 03 继续定义 ConfigLoader / ConfigValidator / runtime builder / AdapterConfig / JobConfig / ReadConfig / HandoffConfig 方向；04 再定义可填写的配置分类和激活规则。

## 11. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 配置影响轮廓表 | pass | 覆盖七个 CMP、entry、Consumer、Job、adapter、store、projection、handoff 和支持 seam。 |
| 间接受影响与直接读取区分 | pass | domain / policy / state 只能接收已验证输入，不直接读配置。 |
| 禁止配置化边界 | pass | domain invariant、状态机红线、审计链、事务一致性、安全门禁和 owner 边界均列出。 |
| 影响图 | pass | `text` 图只表达配置影响范围，图后有说明，无实现细节。 |
| 03 / 04 承接 | pass | 明确 ConfigLoader、ConfigValidator、RuntimeConfig、AdapterConfig、JobConfig、ReadConfig、HandoffConfig 方向及后移内容。 |
| pending / blocker 保真 | pass_with_blockers | `MSVC-UP-001~008` 与并行 sibling exact contract 继续 pending / blocked / waiting。 |
| 深度边界 | pass | 未写 key、默认值、JSON、env、secret、产品参数、具体数字或热更新实现。 |
| 正式文档写入 | pass | 未修改旧正式 02；Step 12 尚未创建。 |

```text
step_11_status = completed
step_11_gate = pass
configuration_impact_cross_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 12 detailed_design_handoff
```
