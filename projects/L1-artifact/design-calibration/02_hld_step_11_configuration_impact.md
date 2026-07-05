# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

在主要组成部分、接口骨架、处理流、状态机和异常边界已收稳的前提下,识别 `L1-artifact` 哪些概要层结构会受配置影响,哪些边界禁止配置化,以及哪些配置实现契约应交给 `03-详细设计.md` 继续展开。

本步不定义配置项清单、默认值、JSON / YAML 示例、环境变量名、密钥名称、`RuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 参数或配置加载实现。当前也不因为 `04-配置设计.md` 缺失而提前补写实现级配置说明,只先收稳配置影响边界。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供配置不得改变 truth ownership、路径分离、外部正文边界和派生不反写规则 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 `Artifact Sync Entry`、`Artifact Async Intake`、`Truth Write Services`、`Truth Read / Consumption Services`、`Artifact Operations Jobs` 等代码主体骨架 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分和职责边界 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类接口入口 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供配置会影响的 intake、read、consumer、refresh、rebuild、handoff 主路径 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止被配置绕过的状态机红线 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供配置不能吞掉的 degraded、failed、restricted、pending 和 boundary failure surface |
| `projects/L1-artifact/00-需求文档.md` §12~14 | 当前正式需求基线 | 提供配置不可越界、外围增强非前置和后续 `04/07` 文档缺口 |
| `projects/L1-artifact/01-架构设计.md` §11 / §13 / §14 | 当前正式架构基线 | 提供横切配置边界、运行承载中立、产品级选择延后和高风险变更可追溯要求 |
| `projects/L1-governance/design-calibration/02_hld_step_11_configuration_impact.md` | 已读取 | 作为 Step 11 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

会受到配置影响的结构主要集中在运行承载和外围接缝:

- sync / async / background 三类入口的启停、超时、请求体上限、幂等存储和运行 profile。
- 外部内容来源、方法定义来源、work / process / governance 上下文、runtime / capability 自动化信号、bus、archive、observability、sync 等 adapter 接缝。
- derived view rebuild、external reference refresh、reconciliation、archive / observability / sync handoff 的 schedule、batch、cursor、retry、parallelism 和 target 选择。
- Query 读面的分页、consistency hint、freshness 暴露、restricted / degraded / unavailable 返回策略。
- truth / history / trace / handoff / derived 的承载型 store 选择,但只作为运行承载和接缝配置,不改变其语义边界。

### 3.2 哪些模块只能间接受配置影响,不能直接读取配置?

`Artifact Truth Domain Core`、`ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy` 和 `ExternalReferenceValidityPolicy` 都只能通过 application service 注入的已验证输入、resolver 结果、policy basis、schedule outcome、scope summary 或 adapter 能力间接受配置影响。

它们不得直接读取 runtime config,也不得让配置改变:

- truth 归属
- 正式版本 / 正式血缘 / 正式基线锚点
- review readiness / responsibility acceptance 前置
- query no-write、consumer 不写核心 truth、job 不修复核心 truth
- 外部正文禁止入仓和派生不反写规则

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- `L1-artifact` 对 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline` 和 `ArtifactConsumptionBackref` 的 truth ownership。
- 外部正文、runtime output、workspace view、archive package、observability record、sync private copy 不得进入 Artifact truth。
- baseline 只允许冻结正式 `ArtifactVersion`,不得因为配置变成“按 current latest 动态解析成员”。
- automation 只允许 candidate-only 进入收束链,不得靠配置绕过 review / intake / truth establish。
- Query 只读、Consumer 只写 reference / pending / stale、Job 只做 derived / refresh / reconcile / handoff。
- truth、history、trace、result、relay trigger 的同一成立边界。
- derived / preview / report / reconciliation / handoff receipt 不得成为第二 truth source。
- visibility / read authorization / restricted surface 不得被 feature flag、降级开关或消费端 profile 绕过。

### 3.4 哪些配置影响需要在详细设计中继续定义配置实现契约?

详细设计需要继续定义:

- `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、runtime builder 的 owner 和注入边界。
- Command / Query / Consumer / Job / Handoff / Adapter 各自的 `AdapterConfig`、`JobConfig`、`ReadConfig`、`HandoffConfig` 分类和校验关系。
- config 失效时是启动阻断、adapter disabled、read degraded、consumer delayed 还是 job skipped。
- configuration change 如何进入 audit / report / trace context,以及哪些高风险变更需要额外审批或 evidence。
- store / bus / search / object source / mirror / handoff target 的承载选择如何在不改变 truth 语义的前提下接入。

### 3.5 哪些配置细节属于 `04-配置设计`,不能在概要设计中提前展开?

以下内容属于后续 `04-配置设计.md` 或实施 / 测试文档,不在本步提前展开:

- config key、默认值、JSON / YAML / TOML 结构、环境变量名、secret 名称和路径。
- queue / bus / DB / object store / search / archive / observability / sync / external source 的产品参数。
- schedule 数字、retry 次数、backoff 策略、批量大小、并发数、retention 天数、SLO / 容量数字。
- rollout、feature flag 名称、部署挂载、热更新和密钥轮换细节。

---

## 4. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `Artifact fact management` | 间接受影响 | truth repository adapter、content source resolver adapter、trace / relay adapter、write admission runtime limits | 配置只能选择承载和外部接缝,不得改变 fact establish policy、外部正文边界或 accepted truth 条件 |
| `Artifact version management` | 间接受影响 | version history store adapter、read summary projection refresh policy、truth change relay target | 定义 version write/read adapter config,不得允许 current latest 或自动化结果无声覆盖正式 version |
| `Artifact lineage management` | 间接受影响 | lineage basis resolver adapter、trace export target、lineage summary refresh policy | 定义 lineage basis input adapter 和 summary refresh config,不得让 runtime trace / tool result 变成正式 lineage basis |
| `Artifact baseline management` | 间接受影响 | baseline read / handoff adapter、candidate admission runtime limits、archive / sync target enablement | 配置可影响候选承载和交接接缝,不得改变“只有正式 version 才能 freeze”为 baseline 的规则 |
| `Artifact intake convergence` | 是 | sync / async intake enablement、request size / timeout、content source adapter、external context resolver、pending / rejected surface policy | 定义 intake config ownership 和 validator,不得跳过最小输入闭口、边界判断或正文排除 |
| `Artifact review and responsibility context` | 间接受影响 | identity / work / process / governance context adapter、review summary read model、notification / handoff target | 配置可影响上下文解析和显化接缝,不得削弱 review ready / responsibility accepted 前置 |
| `Automation output control boundary` | 是 | runtime / capability source allowlist、automation signal adapter、candidate intake profile、manual review routing seam | 定义 automation adapter config 和 source validation,不得把 automation 直接配置成 truth source |
| `Artifact consumption and traceability` | 是 | read surface page limits、consistency hint、restricted / degraded exposure policy、backref trace export target、SDK / console / sync read adapter | 定义 read config 和 traceability config,不得允许 query 写 backref、绕过 visibility 或把下游副本当 truth |
| `Derived maintenance and handoff preparation` | 是 | rebuild scope、report retention、handoff target enablement、batch / cursor / retry / parallelism、failure visibility policy | 定义 job / handoff config 和 degraded surface,不得让 derived / report / handoff 修复或替代核心 truth |
| `External reference and local mirror support` | 是 | source adapter、refresh cadence、mirror capture policy、stale threshold、unresolved / degraded exposure strategy | 定义 resolver / refresh config 和 failure surface,不得把外部 truth 或正文复制成本仓 truth |
| Command intake | 是 | endpoint enablement、request body limit、timeout、idempotency store adapter、operator profile | 定义 command config validation 和 builder 注入,不得关闭 `ActorContext`、`CommandMetadata`、idempotency key 门禁 |
| Query intake | 是 | page limits、consistency hint、fallback / degraded response strategy、authorized read model selection | 定义 query config 和 response surface policy,不得允许 query 触发 refresh、repair 或隐式 write |
| Inbound Event Consumer | 是 | subscribed source、schema version allowlist、dedup store、quarantine / delayed / ignored disposition policy | 定义 consumer config、schema validation 和 duplicate handling,不得让 consumer 直接创建 fact / version / lineage / baseline |
| Outbound Event / relay seam | 是 | bus adapter、routing target、publish retry class、delivery mode、relay observability target | 定义 publisher config 和 publish failure surface,不得让 publish 失败回滚已成立 truth |
| Operations Job runner | 是 | schedule、batch、cursor、retry、parallelism、run actor、job profile | 定义 job config、run metadata 和 idempotency surface,不得把 job 变成业务 command |
| Archive / observability / sync handoff seam | 是 | target adapter、export scope、receipt handling、delivery mode、handoff retry class | 定义 handoff config、receipt validation 和 failed / retryable marker,不得把 receipt 或下游副本当 Artifact truth |

---

## 5. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| `L1-artifact` 的 truth ownership | 这是本仓存在理由,不能被运行 profile、feature flag 或接入方式改变 | `00-需求文档.md` / `01-架构设计.md` |
| 外部正文禁止入仓 | 防止 content backend、runtime output、archive body、observability body、sync copy 污染 Artifact truth | 需求数据归属和架构数据所有权 |
| sync / async / background 三类路径分离 | 防止 consumer 或 job 成为隐式 truth 写入口 | 架构交互方式和处理流主线 |
| Query no-write | 防止 read surface、preview、report、search、trace 查询反向写状态 | Step 7 / Step 8 / 详细设计读路径契约 |
| Consumer 不写核心 truth | 防止外部事件绕过 actor、review、policy 和 command 入口 | Step 7 / Step 8 / 详细设计 consumer 契约 |
| Job 不修复核心 truth | 防止 rebuild / refresh / reconcile / handoff 成为第二业务写源 | Step 8 / Step 9 / 详细设计 operations 契约 |
| `ArtifactVersion` / `ArtifactLineageLink` / `ArtifactBaseline` 的正式锚点规则 | 防止 current latest、trace、report 或外部集合替代正式对象 | Step 6 / Step 9 / 详细设计对象契约 |
| baseline 只冻结正式 version | 防止配置把候选、自动化临时产物或外部状态变成基线成员 | 需求业务规则、Step 9 状态机 |
| automation candidate-only boundary | 防止 runtime / capability 输出被直接配置成正式 truth | Step 5 / Step 7 / Step 9 |
| review readiness / responsibility accepted 前置 | 防止配置绕过责任语境和正式审查准备线 | 业务规则、Step 9 状态机、详细设计 policy |
| truth、history、trace、result、relay trigger 同一成立边界 | 防止半成立 truth、补造审计和成功假象 | 架构一致性策略、详细设计事务边界 |
| derived / preview / report / reconciliation 不反写真相 | 防止读侧或维护侧形成第二 truth center | Step 3 约束、Step 8 流程、Step 10 异常边界 |
| handoff / publish failure 不回滚 accepted truth | 防止下游可用性反向定义本仓 truth 成立与否 | Step 8、Step 10、详细设计 handoff / relay 契约 |
| visibility / restricted / degraded 安全门禁 | 防止 feature policy 或消费端 profile 绕过授权边界 | 读路径安全设计、详细设计 query contract |

---

## 6. 配置影响轮廓图

```text
+====================================================================+
|                    Artifact Configuration Impact                   |
+====================================================================+
| Runtime configuration                                               |
|   |                                                                 |
|   +--> Entry / Consumer / Job / Adapter builders                    |
|   |       | validate config and wire allowed dependencies           |
|   |       v                                                         |
|   |   Sync Entry / Async Intake / Operations Jobs                  |
|   |       | pass validated limits, targets, schedules, adapters     |
|   |       v                                                         |
|   |   Application services                                          |
|   |       | consume validated ports, profiles and runtime policies  |
|   |       v                                                         |
|   |   Domain model and policies                                     |
|   |       | no direct config read; invariants stay fixed            |
|   |       v                                                         |
|   |   Truth / trace / derived / handoff boundaries                  |
|   |                                                                 |
|   +--> Read / maintenance / handoff controls                        |
|           | page / degrade / refresh / rebuild / export cadence     |
|           v                                                         |
|       Read surfaces / mirror states / reports / handoff states      |
+====================================================================+
```

关键说明:

- 配置只进入 builder、entry、consumer、job、adapter、read surface 和 handoff seam,不允许 Domain 直接读取。
- Application service 只能接收已校验的 ports、limits、targets、schedules、profiles 或 degraded policy,不能用配置改写不变量。
- 图只表达配置影响哪些概要层主要部分或接缝,不表达 JSON 示例、密钥系统、部署挂载、热更新或产品参数。
- read / maintenance / handoff 配置只能改变承载与节奏,不能改变 truth ownership、正式锚点或派生不反写原则。

---

## 7. 配置实现契约交给详细设计的方向

| 契约方向 | 详细设计需要回答 | 不在概要设计展开 |
|---|---|---|
| Config ownership | 哪个 runtime owner 负责 command、query、consumer、job、handoff、adapter 配置读取和校验 | 具体文件路径、key、env var |
| Config validation | 哪些配置错误导致启动阻断、adapter disabled、read degraded、consumer delayed 或 job skipped | 完整 `ConfigError` 枚举和错误码 |
| Runtime builder injection | `Artifact Sync Entry`、`Artifact Async Intake`、`Truth Read / Consumption Services`、`Artifact Operations Jobs` 如何接收已验证依赖 | constructor 参数全集 |
| Store / adapter config | truth store、trace store、derived store、external resolver、bus、archive、observability、sync adapter 如何配置 | 产品名、endpoint、secret、topic、bucket |
| Read config | page limit、consistency hint、restricted / degraded / unavailable response policy 如何表达 | 默认值和字段级响应样例 |
| Job config | rebuild / refresh / reconcile / handoff 的 schedule、batch、cursor、retry、parallelism 如何表达 | cron、具体数字、回退策略 |
| Consumer config | source allowlist、schema version、dedup、quarantine / delayed / ignored disposition 如何表达 | payload schema、DLQ 名称、consumer group |
| Handoff config | archive / observability / sync target 选择、receipt validation、delivery failure surface 如何表达 | receipt schema、retry 数字、目标系统参数 |
| Change control | 哪些高风险配置变更需要 evidence、审查或运维审批 | 具体流程、UI、审批人名单 |
| Config evidence | 配置快照如何进入 report、trace context、run report 或验收证据 | 文件格式、hash 算法、落库结构 |

---

## 8. 配置细节留给 `04-配置设计`

| 配置细节 | 留给后续文档的原因 |
|---|---|
| config key、env var、文件格式、目录结构 | 属于配置说明和实现约定 |
| 默认值、上限、下限、单位 | 需要详细设计、测试和容量验证支撑 |
| DB、queue、object store、Git、search、archive、observability、sync、external source 产品参数 | 当前概要保持产品中立 |
| retry、backoff、cron、batch、cursor、parallelism 具体数字 | 需要运维、压测和恢复验证闭口 |
| secret、token、证书、endpoint、network policy | 属于部署和安全配置 |
| feature flag 名称、rollout、灰度和热更新策略 | 属于配置设计和实施计划 |
| SLO、容量、P95 / P99、告警阈值 | 需要测试方案、验收标准和实施证据 |

当前正式 `04-配置设计.md` 尚缺失。本步结论只定义未来 `04` 必须承接哪些配置影响轮廓,不提前代写 `04` 的配置项清单。

---

## 9. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史材料里的 Git / S3 / search / hash / archive / observability 线索 | 容易让产品或基础设施选择反向塑造 Artifact truth 结构 | 本步保持产品中立,只点名配置影响发生在哪些承载和接缝 |
| 旧文档未独立表达配置边界 | 容易在实现期把配置用来绕过 truth ownership、外部正文边界或派生不反写 | 本步显式列出禁止配置化边界表 |
| Job、Consumer、Query degraded、handoff 的运行调节散落在流程和异常里 | 后续详细设计可能自行决定 config owner 和注入关系 | 本步单独给出配置影响轮廓表和详细设计契约方向 |
| `04-配置设计.md` 当前缺失 | 容易诱发在概要设计或实现阶段提前写 JSON、env var、默认值 | 本步明确把配置细节后移 `04` 和后续实施 / 测试文档 |
| Domain / policy 是否可直接读配置未被单独钉住 | 容易把不变量做成 runtime 开关 | 本步明确 Domain / Policy 只能间接受配置影响 |

---

## 10. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 配置影响范围 | 隐含在架构横切关注点中 | 明确到主要组成部分、入口、adapter、job 和 handoff seam |
| 禁止配置化 | 只有约束句子,没有专门主表 | 独立列出 truth ownership、状态机红线、事务边界和安全门禁 |
| Domain 与配置关系 | 未在概要层单独收口 | 明确 Domain / Policy 不能直接读配置 |
| 详细设计承接 | 只知道后续要细化 | 明确 RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、HandoffConfig 等契约方向 |
| `04-配置设计` 边界 | 文档缺口已知,但没有本章承接口径 | 明确哪些内容必须后移 `04` 而不能在 Step 11 提前展开 |

---

## 11. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层列完整配置项 | 不列 | 配置项清单属于 `04-配置设计.md` 和实现契约 |
| 是否允许 Domain / Policy 直接读取配置 | 不允许 | 防止运行时开关改写 Artifact truth 不变量和状态机 |
| 是否允许用配置改变正式 truth 规则 | 不允许 | truth ownership、正式锚点、candidate-only、baseline freeze 都是业务和架构红线 |
| 是否允许用配置控制 adapter / job / read surface / handoff | 允许,但受控 | 这些属于运行承载和外围接缝,需要部署与运维弹性 |
| 是否在 Step 11 锁定产品级后端 | 不锁定 | 当前阶段只需要承载角色和边界,不需要产品选型结论 |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §11 引用本文件 §4 的配置影响轮廓表。
- §11 摘录本文件 §5 的禁止配置化边界表。
- §11 摘录本文件 §6 的配置影响轮廓图和关键说明。
- §11 引用本文件 §7 的详细设计配置实现契约方向。
- §11 明确配置 key、默认值、环境变量、密钥、产品参数和 schedule 数字进入未来 `04-配置设计.md`、测试方案、验收标准或实施计划。

---

## 13. 待确认事项

本步不新增阻塞 Step 12 的待确认事项。后续 `03-详细设计.md` 与未来 `04-配置设计.md` 需要继续闭合:

- command / query / consumer / job / handoff / adapter 各自的 config owner 和 builder 注入边界。
- config validation 失败时的启动阻断、adapter disabled、read degraded、consumer delayed、job skipped 语义。
- 哪些配置变更需要审查、evidence 或额外审批。
- read degraded、refresh cadence、rebuild scope、handoff retry 的正式配置 surface。
- 产品级 DB / queue / object store / search / archive / observability / sync / external source 何时进入后续基线。

这些属于 `03-详细设计.md`、未来 `04-配置设计.md` 及后续实施文档的责任,不阻塞概要设计进入 Step 12。

---

## 14. 进入下一步条件

- 已明确哪些主要组成部分、入口、adapter、job、worker 和外部接缝受配置影响。
- 已明确 Domain Model / Domain Policy / 核心状态机只能间接受配置影响,不能直接读取配置。
- 已显式列出禁止配置化边界。
- 已说明配置实现契约交给 `03-详细设计.md` 继续展开。
- 已说明配置项清单、默认值、JSON 示例、环境变量、密钥和产品参数后移到未来 `04-配置设计.md`。
- 未写入实现级配置类型定义或具体配置值。
- 可以进入 Step 12 “详细设计承接清单”。
