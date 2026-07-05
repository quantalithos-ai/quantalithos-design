# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 Step 4 ~ Step 11 已经收稳的代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响,显式列为未来 `03-详细设计.md` 的稳定输入,防止详细设计重新发明 `L1-artifact` 的主语,或在落字段、协议、port、状态和事务时暗改概要设计结论。

本步不新增未经讨论的新对象、新接口、新流程或新状态;不写开发任务、排期、测试用例全集、实施 commit boundary、完整 DTO schema、完整 trait、DDL、配置项清单或产品选型结论。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架和实现分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责和边界 |
| `02_hld_step_06_key_objects.md` 及 6 个对象附录 | 已完成 | 提供对象主语、对象分类和对象反查清单 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Outbound Event / Operations Job 五类接口骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供关键处理流、通用读写骨架和关键函数骨架 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态组、允许 / 禁止迁移和状态传播关系 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供异常与边界场景轮廓 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响、禁止配置化边界和 `04-配置设计.md` 后移边界 |
| `projects/L1-artifact/00-需求文档.md` | 当前正式需求基线 | 提供核心能力闭环、业务规则、非功能约束和验收否决线 |
| `projects/L1-artifact/01-架构设计.md` | 当前正式架构基线 | 提供依赖方向、一致性策略、横切边界和运行承载约束 |
| `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 作为 Step 12 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳的代码主体框架包括:

- Inbound / Operations 主体:
  `Artifact Sync Entry`、`Artifact Async Intake`、`Artifact Operations Jobs`
- Application Service 主体:
  `Truth Write Services`、`Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Derived Maintenance Services`
- Domain Model / Policy 主体:
  `Artifact Truth Domain Core`、`ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactIntakePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ExternalReferenceValidityPolicy`
- Ports / Persistence / Projection / Handoff 主体:
  `Truth Persistence Ports`、`Reference / Snapshot / Body Source Ports`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports`

详细设计可以继续把这些主体落为 crate / module / trait / struct / constructor,但不能改变“谁承接入口、谁拥有 truth、谁只做派生、谁只做交接”的职责分工。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

以下内容已经成为详细设计稳定输入:

- Step 5 的 10 个主要组成部分。
- Step 6 的 6 组对象附录:
  truth core、boundary context、support states、policies、projections、references / audit。
- Step 7 的五类接口:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job。
- Step 8 的主路径:
  intake register、fact establish、version publish、lineage establish、baseline freeze、authorized read、6 个 state-writing consumer、truth change relay、rebuild / refresh / reconcile / handoff job。
- Step 9 的 8 组状态机:
  intake / submission、fact / content、version / lineage / baseline、review / responsibility、automation boundary、consumption / read / backref、derived / reference / refresh / report、trace / handoff。
- Step 10 的异常与边界场景。
- Step 11 的配置影响与禁止配置化边界。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

详细设计应继续展开:

- 每个关键对象的正式 struct / enum / value object、字段、typed ref、summary、cursor、reason、kind、scope、policy basis 和状态字段。
- 每个接口的 request / response DTO、event envelope、job input / report、idempotency、authorization、stored result 和 error surface。
- 每个处理流的 application service 编排、port / repository trait、unit-of-work、expected version、change record、trace / handoff / stale marker 顺序。
- 每个状态组的正式 enum、允许 / 禁止迁移矩阵、重入规则、并发冲突规则和错误映射。
- 详细错误 taxonomy、degraded / restricted / unavailable / failed response mapping、duplicate replay、quarantine、dead-letter、retry 和 recovery cut。
- query no-write、consumer 不写核心 truth、job 不修复核心 truth、baseline formal-only、automation candidate-only、handoff failure 不回滚 truth 的测试矩阵。
- 配置 owner、builder 注入、ConfigLoader / ConfigValidator / ConfigError、adapter config、job config、handoff config,以及未来 `04-配置设计.md` 的承接口径。

### 3.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果详细设计发现需要新增、删除、合并、重命名或改职责归属,说明概要设计还没有真正收稳,必须回退到对应 Step 修正:

- 代码主体 / 实现分层变更:回退 Step 4。
- 主要组成部分 / 职责边界变更:回退 Step 5。
- 关键对象主语变更:回退 Step 6。
- 接口分类或接口族变更:回退 Step 7。
- 处理流顺序或处理流族变更:回退 Step 8。
- 状态组、状态主线、禁止迁移或传播关系变更:回退 Step 9。
- 异常边界变更:回退 Step 10。
- 配置影响或禁止配置化边界变更:回退 Step 11。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约?

需要交给详细设计收口的配置影响包括:

- command / query / consumer / job / handoff / adapter 的 config owner。
- runtime builder 注入边界和 config validation 失败语义。
- read degraded、refresh cadence、rebuild scope、handoff retry 的正式配置 surface。
- truth / trace / derived / handoff store 承载选择的实现级接入方式。
- 高风险配置变更的审计、evidence 和审批切口。

### 3.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

以下内容不能当作“已稳定输入”写入承接清单,应进入 Step 13 或后续文档:

- 具体 DB / queue / object store / search / archive / observability / sync / external source 产品选型。
- 旧性能数字是否升级为 SLO / 容量约束。
- content hashing、tamper detection、search / report / reconciliation 的产品级机制。
- 完整配置 key、默认值、环境变量、密钥和部署挂载。
- 完整测试用例全集、验收证据路径、实施 commit boundary 和开发排期。

---

## 4. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| `Artifact Sync Entry`、`Artifact Async Intake`、`Artifact Operations Jobs` 三类入口 / 运维主体 | 定义各自 handler / consumer / job runner、metadata、builder 注入、idempotency 和 run report 契约 |
| `Truth Write Services`、`Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Derived Maintenance Services` | 定义 application service 函数、输入输出类型、repository 依赖、unit-of-work 和 result surface |
| `Artifact Truth Domain Core` | 定义 truth aggregate / entity / value object 组织、成员函数、factory、DomainError 和 invariants |
| `Truth Persistence Ports` | 定义 truth repository、versioned save / load、list / lookup、history record、stored result 和 transaction boundary |
| `Reference / Snapshot / Body Source Ports` | 定义 external context / definition / content / automation source resolver、snapshot / mirror load、source version 和 failure surface |
| `Projection / Preview / Report Read Models` | 定义 summary view、read surface、preview、report、reconciliation projection 的 persisted shape、freshness 和 rebuild source |
| `Derived Persistence / Handoff Preparation Ports` | 定义 derived state、handoff material、prepared package / export record 和 retryable / failed marker 的持久化契约 |
| `Event / Audit / Handoff Relay Ports` | 定义 truth change relay、trace export、handoff delivery、receipt、publish failure 和 audit trail 契约 |
| 10 个主要组成部分 | 为每个组成部分定义 module boundary、service ownership、对象归属、读写面和跨部分接缝 |
| `ArtifactFact`、`ArtifactContentFactContext` | 定义字段、typed refs、content source 关系、状态字段、构造函数、establish / suspend / close 规则 |
| `ArtifactVersion`、`ArtifactVersionCandidate` | 定义 version identity、candidate / published / frozen / superseded / retired 结构、publish / supersede 规则和 history 承载 |
| `ArtifactLineageLink` | 定义 relation kind、basis carrier、source / target anchor、establish / reject / retire 规则和 trace relationship |
| `ArtifactBaseline`、`ArtifactBaselineMembership` | 定义 candidate / frozen membership、freeze scope、historical baseline read、formal-version-only guard 和 drift surface |
| `ArtifactIntakeContext`、`ArtifactSubmissionRecord` | 定义 intake kind、resolved refs、pending / rejected / transferred 语义、submission acceptance / supersede 记录 |
| `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment` | 定义 review basis、responsible party、assignment acceptance、ready / invalid / closed 规则 |
| `AutomationArtifactInput` | 定义 automation source、candidate kind、pending review / accepted / rejected / superseded 规则 |
| `ConsumableArtifactReference`、`ArtifactConsumptionBackref` | 定义 read anchor、consumer scope、backref record、explanation closure 和 stale / retired 语义 |
| `ArtifactDerivedViewState`、`ExternalReferenceResolutionState` | 定义 freshness、rebuilding、unavailable、pending / resolved / stale / failed 等正式状态与持久化字段 |
| 10 个 Policy / Guard 对象 | 定义 guard 输入、返回面、error shape、snapshot 依赖、trace basis 和 negative tests |
| 9 个 Projection / Read Model 对象 | 定义 view ref、view body、freshness、visibility、degraded / restricted / unavailable surface 和 rebuild contract |
| Reference / Audit / History 对象组 | 定义 typed ref family、change record、trace record、handoff record、refresh record、audit record 的 exact carrier 和存储面 |
| Step 7 Command 骨架 | 逐 command 定义 request / response、actor context、metadata、idempotency、expected version、stored result 和 error mapping |
| Step 7 Query 骨架 | 逐 query 定义 request / response、page、visibility、freshness、restricted / stale / unavailable surface 和 no-write tests |
| Step 7 Inbound Event Consumer 骨架 | 定义 event envelope、schema version、source id、dedup、accepted / duplicate / delayed / rejected / quarantine receipt |
| Step 7 Outbound Event 骨架 | 定义 event payload、relay envelope、routing abstraction、publication result 和 partial failure surface |
| Step 7 Operations Job 骨架 | 定义 job input / report、cursor、batch、retry、parallelism、idempotency 和 failed refs / receipts |
| Step 8 通用 Command 写路径 | 定义 validation、load current truth、apply domain transition、save truth / history / trace / stale mark、relay trigger 的 exact order |
| `RegisterArtifactIntake` / `EstablishArtifactFact` 流 | 定义 intake-to-fact transfer、content source check、definition basis、review anchor 前置和失败 surface |
| `PublishArtifactVersion` / `EstablishArtifactLineageLink` / `FreezeArtifactBaseline` 流 | 定义 publish / lineage / freeze 编排、formal guard、change record 和 relay behavior |
| `GetArtifactReadSurface` 流 | 定义 visibility、freshness、resolution、restricted / degraded / unavailable read surface 和 read-only contract |
| 6 个 state-writing consumer 流 | 定义 source-specific mapping、context ref upsert、resolution update、pending / stale marker 和 duplicate handling |
| truth change relay 与 handoff job 流 | 定义 committed truth change signal、archive / observability / sync handoff preparation、delivery / receipt / failed / retryable surface |
| Step 9 8 组状态机 | 定义正式 enum、初始态、终态、允许 / 禁止迁移矩阵、可重入规则、并发冲突和序列化策略 |
| Step 10 异常与边界场景 | 定义 error taxonomy、response mapping、retry / quarantine / dead-letter / recovery 切口和 negative tests |
| Step 11 配置影响轮廓 | 定义 RuntimeConfig ownership、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、HandoffConfig、ConfigError 和 runtime builder 注入关系 |

---

## 5. 详细设计继续展开方向

### 5.1 对象与状态契约

详细设计必须把 Step 6 / Step 9 闭成可落码对象契约:

- 关键对象的字段、newtype、typed ref、enum variant、状态字段和 summary / reason / basis carrier。
- 工厂函数、成员函数、状态迁移函数、DomainError 和 history / trace / handoff 副作用。
- 每个状态组的初始态、终态、可重入迁移、禁止迁移、expected version 和并发冲突规则。

### 5.2 协议与接口契约

详细设计必须把 Step 7 闭成正式接口契约:

- Command / Query request / response DTO。
- Consumer / Outbound Event envelope、schema version、trace context、dedup key、source id。
- Job input / report、run metadata、cursor、batch 和 retry result。
- not visible、restricted、stale、unavailable、failed、duplicate、unsupported version、quarantine 等 response surface。

### 5.3 Application flow 与事务契约

详细设计必须把 Step 8 闭成 application / transaction 契约:

- service 编排顺序、port / repository trait、save order、result store、relay trigger。
- truth、history、trace、audit、handoff、stale marker、stored result 的事务边界。
- Query no-write、Consumer no-truth-write、Job no-truth-repair 的显式约束。

### 5.4 Persistence / projection / handoff 契约

详细设计必须定义:

- truth repository、history repository、read model repository、reference / mirror repository。
- trace / audit / handoff / refresh / reconciliation report 的 persisted shape。
- projection rebuild、freshness marker、read degraded source、receipt validation 和 partial failure report。

### 5.5 配置与运行承载契约

详细设计必须定义:

- config owner、builder 注入、validation failure surface、adapter disabled / delayed / degraded semantics。
- job schedule / batch / cursor / retry / parallelism 的 formal config surface。
- read degraded、handoff retry、external refresh cadence 的实现级接缝。
- 对未来 `04-配置设计.md` 的参数和填写说明承接口径。

### 5.6 测试与验收承接

详细设计必须为后续 `05-测试方案.md` 和 `06-验收标准.md` 提供结构化输入:

- state transition tests
- DTO / event / report contract roundtrip tests
- query no-write / visibility / degraded tests
- consumer duplicate / unsupported version / forbidden body tests
- rebuild / refresh / reconcile / handoff job tests
- forbidden configuration / boundary violation negative tests

---

## 6. 概要设计回退规则

如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计修正,而不是在 `03-详细设计.md` 中暗改。

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要新增或删除代码主体骨架 | Step 4 | 代码主体决定谁承接入口、谁拥有 truth、谁只做派生 |
| 需要新增、删除或合并主要组成部分 | Step 5 | 业务组成部分不是实现期可私改项 |
| 需要新增关键对象或改变对象归属 | Step 6 | 对象主语必须先在概要层正式化 |
| 需要新增接口族或改变接口分类 | Step 7 | 入口类别必须先在接口骨架收稳 |
| 需要新增处理流族或改变主路径顺序 | Step 8 | 这会直接影响应用编排和事务语义 |
| 需要改变状态组、主状态或禁止迁移 | Step 9 | 状态机红线不能在详细设计临时修改 |
| 需要改变异常边界、让 Query 写状态或让 Job 修 truth | Step 10 | 这已经触动概要层边界规则 |
| 需要改变配置影响或允许配置绕过红线 | Step 11 | 配置不可越界是概要层门禁 |
| 需要改变 truth ownership、外部正文边界或路径分离 | 回退 Step 1~3 或更上游 `00/01` | 这已超出概要局部调整范围 |

---

## 7. 不进入本承接清单的内容

以下内容不写入本承接清单,应进入 Step 13 或后续文档:

| 内容 | 后续归属 |
|---|---|
| DB、message bus、object store、Git、search、archive、observability、sync、external source 的具体产品选型 | Step 13 / `04-配置设计.md` / ADR / 实施计划 |
| SLO、P95 / P99、容量、告警阈值 | Step 13 / `05-测试方案.md` / `06-验收标准.md` |
| 完整配置 key、默认值、env var、secret、部署挂载 | 未来 `04-配置设计.md` |
| 完整测试用例全集、mock 数据、evidence 路径 | `05-测试方案.md` / `06-验收标准.md` |
| 实施 commit boundary、开发排期、提交顺序 | `07-实施计划.md` |
| 仍未决定的产品级完整性校验、tamper、search / report / reconciliation 强化路线 | Step 13 / 后续演进设计 |

---

## 8. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 `02/03` 没有明确“哪些是 03 的稳定输入” | 详细设计容易重新发明对象、接口和状态名 | 本步把 Step 4~11 的正式输入集中列成承接清单 |
| `L1-artifact` 结构主语较多 | support states / projections / audit / handoff 容易在 03 中被弱化或重命名 | 本步按代码主体、组成部分、对象、接口、流、状态逐层锁定 |
| `04-配置设计.md` 当前缺失 | 后续容易在 03 中顺手写配置项清单 | 本步把配置实现契约和配置说明边界拆开 |
| 缺少回退规则 | 03 可能暗改概要结论而不回写 02 | 本步显式写死回退位置和门禁 |

---

## 9. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 详细设计输入 | 分散在 Step 4~11 | 集中收敛为一张承接清单 |
| 主语变更处理 | 未明确 | 明确必须回退对应概要 Step |
| 详细设计职责 | 只有“后续细化”的笼统口径 | 明确对象、协议、流程、状态、配置、持久化和测试展开方向 |
| 配置承接 | 只有 Step 11 的轮廓 | 本步明确哪些进入 03,哪些继续后移未来 `04` |
| 风险与承接边界 | 容易混写 | 明确哪些不进入承接清单而进入 Step 13 |

---

## 10. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 Step 4~11 全文机械粘贴到本步 | 不粘贴全文 | Step 12 需要稳定索引,不需要复制已有细节 |
| 是否在本步新增主语 | 不新增 | 承接清单只承接已收稳结论 |
| 是否把实施任务写入本步 | 不写 | 实施任务属于 `07-实施计划.md` |
| 是否把风险项混入承接清单 | 不混入 | 风险和待确认事项专门进入 Step 13 |
| 是否允许 03 微调落码命名 | 允许细化命名,不允许改职责主语 | 03 可以收敛 exact type / function 名,但不能改业务边界 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §12 引用本文件 §4 的详细设计承接清单表。
- §12 摘录本文件 §5 的详细设计继续展开方向。
- §12 摘录本文件 §6 的概要设计回退规则。
- §12 摘录本文件 §7 的“不进入本承接清单的内容”。
- 正式文档中应明确:如果 `03-详细设计.md` 发现主语需要变更,应先回到 `02-概要设计.md` 对应 Step 修正,不得暗改。

---

## 12. 待确认事项

本步不新增阻塞 Step 13 的待确认事项。Step 13 将专门收纳当前概要设计层尚未闭合的设计风险、待确认事项和后续文档缺口。

---

## 13. 进入下一步条件

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计继续展开对象、接口、流程、状态、异常、配置、持久化和测试。
- 已明确详细设计发现主语变更时必须回退概要设计。
- 未新增未经讨论的新对象、新接口、新流程或新状态。
- 未写入开发任务、排期、测试用例全集或实施指令。
- 可以进入 Step 13 “设计风险与待确认事项”。
