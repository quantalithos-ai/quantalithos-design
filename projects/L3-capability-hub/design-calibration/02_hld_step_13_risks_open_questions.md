# L3-capability-hub 02 概要 Step 13: 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 本轮口径: 在 Step 4 ~ Step 12 已收稳的代码主体、主要组成部分、对象、接口、处理流、状态机、异常、配置影响和详细设计承接清单基础上,只收纳概要设计层仍未闭环的风险与待确认事项;不写 backlog、TODO、开发排期、配置 key、测试结果、证据 alias、run_id、实现 commit 或实施 boundary。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `02-概要设计.md` |
| 当前 Step | Step 13 `设计风险与待确认事项` |
| 用户确认 | 用户已回复“同意”,允许从 Step 12 进入 Step 13 |
| 正式文档写入 | 本 Step 不修改正式 `02-概要设计.md`;正式装配仍留到 Step 14 |
| 上游基线 | 新版 `00-需求文档.md`;新版 `01-架构设计.md`;`02` Step 1 ~ Step 12 中间产物 |
| 旧材料处理 | 旧 `02/03/05/06`、README 仅作 historical material 和差异审计,不得作为当前风险 / 待确认的直接结论来源 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复点确认 | done | 已读取项目台账和 `02_hld_calibration_flow.md`,确认 Step 12 已获用户同意 | pass | 进入标准读取 |
| 标准读取 | done | 已读取概要设计 SOP Step 13、概要设计书写规范 §4.13 和风险 / 待确认表模板 | pass | 进入参考项目读取 |
| 参考项目读取 | done | 已读取 L1-governance、L1-artifact、L3-method-library Step 13 粒度 | pass | 进入来源池 |
| 风险 / 待确认来源池 | done | 汇总正式 `00/01`、Step 3、Step 11、Step 12 和历史材料中的候选项 | pass | 进入过滤 |
| 已收稳结论排除与非风险过滤 | done | 排除 Step 12 已承接、普通任务、实现细节和后续文档细化项 | pass | 进入风险筛选 |
| 设计风险筛选 | done | 输出设计风险清单和当前处理口径 | pass | 进入待确认筛选 |
| 待确认事项筛选 | done | 输出待确认事项清单和挂起口径 | pass | 进入未闭环说明 |
| 当前设计层未闭环项说明 | done | 区分不阻塞 Step 14 与会阻塞后续实现的事项 | pass | 进入旧材料差异审计 |
| 旧材料差异审计 | done | 记录旧风险 / 待确认污染处理 | pass | 进入回填草稿 |
| 回填草稿 | done | 准备正式 §13 回填草稿,但不写正式 `02` | pass | 进入自检与停审 |
| 自检与停审 | done | 检查未把任务包装成风险、未把待确认润色成定论、未重复挂起 Step 12 输入 | pass_wait_review | 等待用户审查 Step 13;确认后进入 Step 14 |

---

## 2. 必读文档

| 文档 | 已读取结论 | 对本 Step 的约束 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 13 | 本步只收纳概要设计层未闭环项,输出设计风险清单、待确认事项清单和未闭环说明。 | 不写项目 backlog、TODO、实施方案,不把 Step 12 已承接内容重新写成待确认。 |
| `standards/document/概要设计书写规范.md` §4.13 | 正式 §13 必须输出设计风险表和待确认事项表,禁止画风险矩阵、roadmap 或任务看板。 | 风险 / 待确认必须分表表达,并写清当前处理口径 / 挂起口径。 |
| `design-calibration/02_hld_step_03_constraints.md` | 已收稳 forbidden body、依赖裁剪、配置不可越界、产品中立和待确认保守承接口径。 | 本步风险必须保护这些约束,不得把 open question 写成已定契约。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` ~ `02_hld_step_12_detailed_design_handoff.md` | 已收稳代码主体、组成部分、对象、接口、flow、状态、异常、配置和 handoff。 | 已收稳结论不得再挂成待确认;若需改变必须按 Step 12 回退规则处理。 |
| `projects/L3-capability-hub/00-需求文档.md` §15 | 需求层风险已记录旧 ProviderContract、QueryCapabilities、CostRecord、governance truth、method body、SDK client、marketplace、observability 和伪量化回流。 | 本步只抽取仍影响概要层的风险,不复制需求风险全文。 |
| `projects/L3-capability-hub/01-架构设计.md` §15 | 架构层风险已记录旧主线回流、消费面反写、forbidden body、非 `L0-core` 编译依赖、核心同步与 handoff 混写、实现自行补真相源。 | 本步把这些风险转成概要层处理口径。 |
| `projects/L1-governance/design-calibration/02_hld_step_13_risks_open_questions.md` | 参考其风险 / 待确认拆分、未闭环说明、非风险过滤和正式回填草稿粒度。 | 只参考结构,不复制 governance 领域主语。 |
| `projects/L1-artifact/design-calibration/02_hld_step_13_risks_open_questions.md` | 参考其产品 / 指标 / handoff / 配置未定不阻塞正式概要,但会阻塞后续实现的表达方式。 | 只参考处理框架,不复制 artifact 领域内容。 |
| `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md` | 参考其旧材料污染后置审计和“已进入 Step 12 不重复挂起”的门禁。 | 本仓改写为 capability access truth 语境。 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前风险不是 Step 4 ~ Step 12 尚未收稳,而是后续详细设计、配置设计、测试、验收或实施若误用历史口径或未定事项,会打穿已经收稳的 capability access truth 边界。主要风险包括:

- 旧 `ProviderContract`、KMS / Vault、quota、route、cost、failover、provider runtime 口径回流,把 adapter descriptor 膨胀为 provider contract 或 secret 平台。
- 旧 `QueryCapabilities`、allow / deny、policy refresh、runtime cache 回流,把 formal exposure / controlled consumer view 写成执行裁决。
- governance approval、Policy effective fact、shared_rules 与本仓 access review fact、governance seam relation 混写。
- capability-method relation 携带 method body、definition source truth 或方法正文版本。
- secret、governance、method、runtime、SDK、marketplace、observability、external document 等 forbidden body 通过 ref、safe summary、descriptor、export 或 handoff 进入本仓 truth。
- Query、Consumer、Job、projection、report、reconciliation、event collaboration 或 handoff 反写、修复或回滚核心 truth。
- 非 `L0-core` sibling 仓成为核心语义编译期依赖。
- 旧 P95、Policy 30s、SLA、成本覆盖率、明文 key grep 等历史量化口径被写成测试 / 验收硬指标。
- 外围增强未完成被误判为核心闭环未完成。
- 后续实现因 `03/04/05/06/07` 未闭口而自行补 schema、状态、port、配置、产品或证据口径。

### 3.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

当前仍需挂起的问题主要是:

- governance seam 最小字段 / safe summary 形态与变化感知粒度。
- capability-method relation 摘要强度和适用性摘要边界。
- adapter descriptor taxonomy 是否细分 MCP、A2A、external API、LLM provider API 或其他子类。
- secret ref / safe summary 的最小内容和安全摘要展示强度。
- formal exposure 到 `L0-sdk` 的服务端 handoff contract。
- marketplace、console、observability 等外围消费面是否需要正式只读接缝。
- event collaboration 的 outbox / topic / payload / retry / planned implementation boundary。
- formal exposure / consumer view / propagation / handoff 是否需要正式量化目标。
- 具体 DB、cache、broker、search、object store、API gateway、adapter 产品和部署形态。
- 高风险配置变更是否需要 operator approval、governance decision 或发布流程控制。

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

风险与待确认事项的影响范围在 §5 和 §6 表中逐项标注。若影响 Step 4 ~ Step 12 已收稳的主语稳定性,后续不得在 `03-详细设计.md` 中暗改,必须按 Step 12 回退规则先回到对应概要 Step。

### 3.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导详细设计的是“看起来像默认方案,但实际还未定论”的内容:

- 旧 ProviderContract、QueryCapabilities、CostRecord、KMS / Vault、policy refresh 和 outbox relay。
- 旧性能、传播、SLA、成本、密钥扫描和验收数字。
- PostgreSQL、cache、broker、search、API gateway、provider adapter、KMS、observability 等具体产品。
- marketplace / console / observability / SDK / handoff 等外围增强是否进入当前 P0。
- event payload、topic、repository trait、configuration key、implementation boundary 仍应由后续文档闭口的 exact contract。

### 3.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

以下内容不进入本步:

- 文档润色、章节排序、交叉引用、术语统一。
- 测试用例逐条编写、fixture、mock 数据、CI、脚本、报告样式。
- crate / file / module 命名、代码目录、提交拆分、开发排期。
- 已经由 Step 12 交给 `03` 的字段、DTO、状态矩阵、repository / port、event payload、job report 和 config contract 细化工作。

---

## 4. 风险 / 待确认来源池与过滤

| 来源 | 候选项 | 裁决 |
|---|---|---|
| 正式 `00` §15 | 旧 ProviderContract、QueryCapabilities、CostRecord、KMS / Vault、governance truth、method body、SDK client、marketplace、observability、旧指标回流 | 接收为概要层风险,但按 Step 4 ~ Step 12 当前主语重写。 |
| 正式 `01` §15 | 旧主线回流、消费面反写、forbidden body、非 `L0-core` 编译依赖、核心同步与 handoff 混写、实现自行补真相源 | 接收为概要层风险,并明确当前处理口径。 |
| Step 3 | seam field、relation summary、descriptor taxonomy、secret summary、SDK handoff、外围只读接缝、量化指标和 implementation boundary 保守承接 | 未被后续 Step 完全闭口的项进入待确认;已由 Step 6~12 闭口的项不重复挂起。 |
| Step 11 | descriptor taxonomy、governance seam 字段、method relation 摘要、secret safe summary、SDK handoff、event collaboration、量化指标 / evidence 格式 | 接收为待确认事项,后移 `03/04/05/06/07`。 |
| Step 12 | 不进入承接清单的产品选型、配置 key、测试证据、实施 boundary、边界外职责 | 作为 Step 13 风险 / 待确认来源;已进入 handoff 的 exact contract 不再挂起。 |
| 旧 `02/03/05/06` | ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS、policy refresh、execution gateway、outbox relay、旧测试 / 验收 | 只作 historical material 和污染审计;不得作为当前结论来源。 |

### 4.1 已收稳结论排除

以下内容已由 Step 4 ~ Step 12 收稳,不在本步重新写成待确认:

- 8 个业务主要组成部分。
- 43 个关键对象及其 owner。
- Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton 分类。
- 通用写 / 读 / consumer / job / event candidate 路径和重点独立处理流。
- 多状态族、允许 / 禁止迁移和状态传播。
- Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair、event collaboration failure no rollback。
- 配置影响轮廓和禁止配置化边界。
- `03-详细设计.md` 需要继续展开的字段、DTO、状态矩阵、repository / port、event payload、job report 和 config contract。

### 4.2 非风险 / 非待确认过滤

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 文档润色、章节排序、引用修正 | 不影响概要设计成立性 | Step 14 |
| 测试用例逐条编写、fixture、mock 数据 | 属于测试方案细化 | `05-测试方案.md` |
| crate / module / file 命名、代码目录 | 属于详细设计或实施安排 | `03-详细设计.md` / `07-实施计划.md` |
| 配置 key、默认值、env var、secret 名称、部署挂载 | 属于配置设计 | `04-配置设计.md` |
| CI、脚本、报告样式、真实 evidence 路径 | 属于测试 / 验收 / 实施 | `05` / `06` / `07` |
| 开发排期、人员分工、提交顺序 | 属于项目管理或实施计划 | `07-实施计划.md` |

---

## 5. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 旧 `ProviderContract`、API key、KMS / Vault、quota、route、cost、failover、provider runtime 回流,把 `AdapterDescriptor` 膨胀为 provider contract 或 secret 平台。 | 接入描述与风险摘要;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;配置影响;异常边界。 | 继续按 adapter descriptor + secret ref / safe summary 分层处理;secret 正文、KMS / Vault truth、provider runtime、quota / route / cost / failover 均为 forbidden body 或边界外职责。 |
| 旧 `QueryCapabilities`、allow / deny、capability whitelist、policy refresh、runtime cache 回流,把 formal exposure 写成 runtime 裁决或 policy cache。 | 正式暴露与受控消费;`FormalExposureBoundary`;`ControlledConsumerView`;Query API;状态机;测试验收。 | formal exposure 是服务端 truth,controlled consumer view 是快照;allow / deny enforcement、runtime cache、Policy refresh 不进入本仓 truth。 |
| governance approval、Policy effective fact、shared_rules 或 access review fact 混写,导致 capability-hub 越权生成治理 truth。 | 治理与方法关系;`GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityAccessReviewFact`;接口和数据归属。 | 本仓只保存 governance result / policy result ref、allowed safe summary 和 seam relation;approval、Policy、shared_rules truth 归 `L1-governance`。 |
| capability-method relation 携带 method body、definition source truth 或方法正文版本。 | 治理与方法关系;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;method-library 依赖;forbidden body。 | 维持 body-free relation + method asset ref;method body、method definition truth 和版本正文归 `L3-method-library`。 |
| secret、governance、method、runtime、SDK、marketplace、observability、external document 正文通过 ref、safe summary、descriptor、export 或 handoff 进入本仓 truth。 | 数据归属;`SecretHandlingSafeSummary`;`AuditFriendlyExportSummary`;`ExternalDocumentRef`;handoff;配置验证。 | 只允许 ref / allowed safe summary / snapshot / marker / handoff surface;正文禁止入仓,forbidden 状态不得伪装为 resolved。 |
| Query、Consumer、Operations Job、projection、report、reconciliation、event collaboration 或 handoff 反写、修复或回滚核心 truth。 | Step 7 接口分类;Step 8 处理流;Step 9 状态传播;Step 10 异常边界;Step 11 配置禁止边界。 | Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair、event collaboration failure no rollback 均作为正式红线保留。 |
| formal exposure、controlled consumer view、SDK exposure、runtime / tools consumer ref、marketplace / console / observability 只读消费面互相替代。 | 正式暴露与受控消费;外部引用与安全摘要支撑;SDK exposure boundary;外围增强。 | 服务端 exposure 归本仓;SDK client、runtime execution、tools execution、marketplace listing / transaction、console UI 状态和 observability store 均不归本仓。 |
| 非 `L0-core` sibling 仓成为核心语义编译期依赖。 | 依赖裁剪;Ports;External Port Skeleton;实施边界。 | 继续执行依赖裁剪;除 `L0-core` 外的内部仓只能通过 ref、summary、event、port、adapter 或 handoff 协作。 |
| 旧 P95、Policy 30s、SLA、未白名单拦截率、成本覆盖率、明文 key grep 等历史量化口径被写成测试 / 验收硬指标。 | NFR、测试方案、验收标准、容量模型、配置设计。 | 当前只保留结构性 NFR 和候选量化线索;正式指标必须在 `05/06` 基于当前能力面重新定义。 |
| 外围增强未完成被误判为核心闭环未完成。 | 派生维护与只读输出;marketplace / console / observability / SDK / search / export;验收边界。 | 管理入口、搜索浏览、候选发现、安全摘要深化、SDK 说明、只读生态发现、审计友好导出不阻塞核心 capability access truth 闭环。 |
| 后续实现因 `03/04/05/06/07` 未闭口而自行补 schema、状态、port、配置、产品、evidence 或 implementation boundary。 | `03~07` 全链路;设计真相源闭环;实现可落码性。 | 未闭合 exact contract 必须回到对应设计文档闭口;实现侧不得私补 truth owner、接口协议、配置、证据或 planned boundary。 |
| event collaboration / outbox / relay / retry 实现被误写成概要层 truth 或被用于回滚已提交 fact。 | Outbound Event;`CapabilityAccessEventCollaborationPort`;trace / impact;handoff;`07` planned boundary。 | 当前只固定 event candidate、handoff surface 和 no-rollback;outbox / relay / topic / retry / boundary skeleton 留给 `03/07`。 |

---

## 6. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| governance seam 的最小承载形态、safe summary 字段和 change awareness 粒度。 | `GovernanceSeamRelation`;`GovernanceResultRef`;formal exposure 前置;`03-详细设计.md`。 | 当前只锁定 ref / allowed safe summary / relation 边界,不迁入 approval / Policy / shared_rules truth。 |
| capability-method relation 是否需要能力类型、method asset 适用性摘要,以及摘要强度如何限定。 | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;method-library seam;`03-详细设计.md`。 | 当前只锁定 body-free relation + method asset ref,不保存 method body。 |
| adapter descriptor taxonomy 是否细分 MCP、A2A、external API、LLM provider API 或其他接入类别。 | `AdapterDescriptor`;descriptor state;AdapterConfig;`03/04`。 | 当前只锁定外部 MCP / A2A / API 接入语义和 provider runtime 边界,不提前固定字段或 adapter 类型。 |
| secret reference / safe summary 的最小内容和展示强度是否需要进一步收窄。 | `SecretRef`;`SecretHandlingSafeSummary`;security;`03/04/05`。 | 当前只确认 secret ref / allowed safe summary 和 secret 正文禁止入仓;字段级摘要后移。 |
| formal exposure 到 `L0-sdk` 的 handoff contract 如何定义。 | `FormalExposureBoundary`;`SdkExposureConsumerRef`;External Port Skeleton;`03/07`。 | 当前只锁定服务端 exposure 与 SDK client 分层;不定义 SDK package、cache 或 language binding。 |
| marketplace、console、observability 等外围消费面是否需要正式只读接缝或继续保留为外围候选。 | 派生维护与只读输出;外部引用与安全摘要支撑;`03/07`。 | 当前按外围只读候选处理;listing、transaction、UI 状态、observability store 不进入本仓 truth。 |
| event collaboration outbox / topic / payload / retry / dead-letter / planned implementation boundary 如何划分。 | Outbound Event;Operations Job;`CapabilityAccessEventCollaborationPort`;`03/07`。 | 当前只保留 event candidate、publisher / handoff 配置影响和 no-rollback 红线;不定义实现。 |
| formal exposure、consumer view、propagation、handoff 是否需要具体读取延迟、传播延迟或可用性目标。 | NFR、状态传播、测试方案、验收标准、容量模型。 | 当前只保留结构性 NFR,不继承旧 Policy 30s、P95 或 SLA;具体阈值后移 `05/06`。 |
| 具体 DB、cache、broker、search、object store、API gateway、adapter、observability 产品是否进入正式配置和实施基线。 | `04-配置设计.md`;`07-实施计划.md`;ADR;容量验证。 | 当前只固定承载角色和产品中立边界,不锁具体产品。 |
| 高风险配置变更是否需要 operator approval、governance decision 或发布流程控制。 | Step 11 配置影响;security;traceability;operations;`03/04/07`。 | 当前只要求配置可审计且不可越界;具体审批流程后移。 |
| 测试 evidence schema、验收证据路径和 evidence alias 规则如何定义。 | `05-测试方案.md`;`06-验收标准.md`;`07-实施计划.md`。 | 当前不得伪造 evidence alias、测试结果或验收签署;后续正式文档闭口。 |
| `04-配置设计.md` 与 `07-实施计划.md` 如何补齐并接续 implementation ledger / planned boundary skeleton。 | 文档链、项目台账、实施准备。 | 当前作为后续正式文档缺口挂起;进入 `07` 时必须同步创建 implementation ledger 和 planned boundary skeleton。 |

---

## 7. 当前设计层未闭环项说明

### 7.1 不阻塞进入 Step 14 的事项

以下事项不阻塞整理正式 `02-概要设计.md`:

- 产品选型和具体部署形态仍未确定。
- 旧性能、传播、容量和 SLA 数字未升级为正式指标。
- 外围增强是否进入当前迭代未定。
- high-risk config change 的具体审批流程未定。
- event collaboration / handoff 的 outbox、topic、payload、retry、dead-letter 和恢复流程未定。
- `04-配置设计.md` 与 `07-实施计划.md` 仍待后续正式文档重建。

这些事项没有推翻 Step 4 ~ Step 12 已收稳的概要主线,只会影响后续详细设计、配置设计、测试方案、验收标准、实施计划或 ADR。

### 7.2 进入实现前会阻塞的事项

以下事项若在进入实现前仍未闭合,会阻塞落码:

- `03-详细设计.md` 没有给出对象字段、DTO、状态矩阵、repository / port、event payload、job report 和 runtime construction contract。
- `04-配置设计.md` 没有给出 adapter / job / consumer / publisher / handoff 必需配置和校验规则。
- `05-测试方案.md` 没有覆盖 query no-write、consumer / job 不写 core truth、forbidden body、configuration negative gates、event collaboration failure no rollback。
- `06-验收标准.md` 没有定义正式 evidence / signoff / release gate,或沿用旧 QueryCapabilities / KMS / Cost / SLA 口径。
- `07-实施计划.md` 在正式设计缺口处要求实现侧自行补 schema、状态、端口、产品、容量或 planned boundary。

### 7.3 风险与待确认处理规则

- 风险项必须在正式 `02-概要设计.md` 中保留为设计红线或保守处理口径。
- 待确认事项不得在 Step 14 整理时润色成已确认结论。
- 如果 Step 14 发现某个待确认事项实际会改变 Step 4 ~ Step 12 的稳定主语,必须回退对应 Step 修正。
- 如果后续详细设计要改变某条风险的当前处理口径,应先回到需求、架构或概要对应章节重新收口。

---

## 8. 旧材料差异审计

| 旧材料内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `ProviderContract` / provider runtime / route / quota / failover 风险 | 会把 descriptor 写成 provider runtime contract。 | 改写为 adapter descriptor 边界风险;provider runtime 仍边界外。 |
| 旧 `CapabilityDecision` / allow-deny / policy refresh 风险 | 会把本仓写成 governance / runtime enforcement 仓。 | 改写为 formal exposure / controlled consumer view 分层风险。 |
| 旧 `QueryCapabilities` 风险 | 混合 formal truth、runtime cache、SDK view 和 policy decision。 | 改写为 QueryCapabilities 回流风险;正式接口已拆分。 |
| 旧 `CostRecord` / billing / finance 风险 | 会把 capability-hub 写成成本事实仓。 | 保留为边界外风险;不进入当前对象、接口、flow 或状态。 |
| 旧 KMS / Vault / secret store 风险 | 会把本仓写成 secret 平台。 | 改写为 secret ref / safe summary / forbidden body 风险。 |
| 旧 outbox relay / retry / worker 风险 | 把实现机制提前定为概要 truth。 | 改写为 event collaboration planned boundary 待确认,不定义实现。 |
| 旧测试 / 验收中的 P95、Policy 30s、明文 key grep、成本覆盖率 | 与当前能力面不匹配,容易形成伪量化。 | 挂起到 `05/06`,不得作为当前硬指标。 |
| 旧 `03` 目录、service、repository、DTO、state | 建立在旧主线之上。 | 只作 historical material;后续 `03` 必须按 Step 12 handoff 重建。 |

---

## 9. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否复制 `00/01` 风险全文 | 不复制全文 | Step 13 只保留仍直接影响概要设计成立性的部分。 |
| 是否把 Step 12 已承接给 `03` 的 exact contract 再写成待确认 | 不重复挂起 | 那些内容已经是详细设计稳定输入,不是概要层未定项。 |
| 是否把产品未定本身写成阻塞风险 | 不直接写成阻塞风险 | 产品未定当前可接受;只有产品选择反向改变 truth 主线才是风险。 |
| 是否把普通任务写成待确认 | 不写 | 任务不是设计未闭口项。 |
| 是否阻塞进入 Step 14 | 不阻塞 | 当前风险和待确认均有保守口径,可以进入正式概要整理。 |

---

## 10. 正式 §13 回填草稿

> 注意: 本节只是 Step 14 装配正式 `02-概要设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 13. 设计风险与待确认事项

> 校准来源：
> - `design-calibration/02_hld_step_13_risks_open_questions.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/02_hld_step_13_risks_open_questions.md` 的“设计风险清单”“设计待确认事项清单”“当前设计层未闭环项说明”和“旧材料差异审计”小节,了解哪些事项必须作为风险保留、哪些事项仍需挂起到后续文档。

### 13.1 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 旧 `ProviderContract`、KMS / Vault、CostRecord、QueryCapabilities、policy refresh、provider runtime、outbox relay 等主线回流。 | 代码主体、对象、接口、处理流、状态、异常、配置和后续测试验收。 | 旧材料只作 historical material;当前主线以 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure、trace / impact 和 reference support 为准。 |
| forbidden body 通过 ref、safe summary、descriptor、export 或 handoff 进入本仓 truth。 | 数据归属、external ref、safe summary、traceability、handoff 和配置验证。 | 只允许 ref / allowed safe summary / marker / handoff surface;secret、governance、method、runtime、SDK、marketplace、observability、external document 正文禁止入仓。 |
| Query、Consumer、Job、projection、report、reconciliation、event collaboration 或 handoff 反写、修复或回滚核心 truth。 | 接口分类、处理流、状态传播、异常边界和配置禁止边界。 | 保留 Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair、event collaboration failure no rollback 红线。 |
| 后续实现因 `03/04/05/06/07` 未闭口而自行补 schema、状态、port、配置、产品、evidence 或 implementation boundary。 | `03~07` 全链路和实现可落码性。 | 未闭合 exact contract 必须回到对应设计文档闭口,不得由实现侧私补。 |

### 13.2 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| governance seam 字段 / safe summary、method relation 摘要强度、descriptor taxonomy、secret safe summary、SDK handoff contract。 | `03-详细设计.md`;`04-配置设计.md`;正式 exposure / relation / descriptor / safe summary。 | 当前只锁定边界和 owner,字段级 contract 后移,不得迁入 governance truth、method body、secret 正文或 SDK client。 |
| event collaboration outbox / topic / payload / retry / dead-letter / planned boundary。 | Outbound Event、Operations Job、`CapabilityAccessEventCollaborationPort`、`03/07`。 | 当前只保留 event candidate、handoff surface 和 no-rollback 红线;实现边界后移。 |
| formal exposure / consumer view / propagation / handoff 的量化目标。 | NFR、测试方案、验收标准、容量模型。 | 当前只保留结构性 NFR,不继承旧 Policy 30s、P95 或 SLA;具体阈值后移 `05/06`。 |
| 具体 DB、cache、broker、search、object store、API gateway、adapter、observability 产品和配置参数。 | `04-配置设计.md`;`07-实施计划.md`;ADR。 | 当前只固定产品中立边界和承载角色,不锁具体产品。 |
| evidence schema、验收证据路径、implementation ledger 和 planned boundary skeleton。 | `05`;`06`;`07`。 | 当前不得伪造证据、签署、run_id 或 commit;进入 `07` 时再同步创建 implementation ledger 和 planned boundary skeleton。 |

当前待确认事项不阻塞 Step 14 整理正式概要设计,但不得在正式整理时被润色成已确认结论。若后续发现待确认事项会改变 Step 4 ~ Step 12 稳定主语,必须回退对应 Step 修正。
```

---

## 11. 自检与停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否输出设计风险表 | pass | 已按“风险 / 影响 / 当前处理口径”列出概要层风险。 |
| 是否输出待确认事项表 | pass | 已按“待确认 / 影响范围 / 当前挂起口径”列出仍未形成定论的问题。 |
| 是否把风险和待确认拆开 | pass | 风险写已识别需保守处理的问题;待确认写尚未形成定论的问题。 |
| 是否重复挂起 Step 12 已承接内容 | pass | 字段、DTO、状态矩阵、port、repository、event payload、job report 和 config contract 作为 `03` 输入,未重复写成概要待确认。 |
| 是否把任务 / backlog 包装成风险 | pass | 文档润色、测试用例、CI、目录命名、开发排期等均过滤到后续归属。 |
| 是否保留 capability-hub 边界 | pass | 未合并 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret / KMS、cost / billing、provider runtime 或 observability store。 |
| 是否修改正式 `02-概要设计.md` | no | 本 Step 只创建中间产物,正式文档仍等 Step 14 装配。 |
| 是否伪造测试、证据、run_id、签署或 commit | no | 未写真实测试结果、evidence alias、验收签署、run_id 或 commit。 |

---

## 12. 进入下一步条件

- 已明确概要设计层哪些问题构成风险。
- 已明确哪些问题仍待确认并挂起到后续文档或 ADR。
- 已说明风险和待确认事项影响哪些设计范围。
- 已排除普通任务、优化项、开发排期和已进入 Step 12 稳定输入的内容。
- 未把待确认事项润色为已确认结论。
- 用户审查确认后才允许进入 Step 14 `整理正式概要设计文档`。
