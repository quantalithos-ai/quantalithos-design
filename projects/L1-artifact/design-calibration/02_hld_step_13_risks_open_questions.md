# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 ~ Step 12 已收稳代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和详细设计承接清单后,显式收纳当前概要设计层仍未闭环的风险与待确认事项。

本步只收纳设计层未闭环项,不写 backlog、TODO、开发排期、实现指令、配置项清单、完整测试用例全集或产品落地参数。已经进入 Step 12 作为 `03-详细设计.md` 稳定输入的对象、接口、流程、状态和配置契约,不在本步重复写成待确认。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` ~ `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供已收稳概要设计结论和详细设计承接清单 |
| `projects/L1-artifact/00-需求文档.md` §15 | 当前正式需求基线 | 提供需求层风险、待确认事项和“后续一旦发生即阻塞”的红线 |
| `projects/L1-artifact/01-架构设计.md` §14 / §15 | 当前正式架构基线 | 提供架构层不可接受债务、风险和待确认项 |
| `02_hld_step_12_detailed_design_handoff.md` §7 | 已完成 | 提供不应写入承接清单、应转入本步或后续文档的内容 |
| `projects/L1-governance/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 作为 Step 13 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前风险不在于 Step 4 ~ Step 12 没有收稳,而在于后续详细设计、配置设计或实现若误用未定事项,会打穿已收稳边界。主要风险包括:

- 相邻仓、派生视图、消费副本或交接副本反向定义 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`。
- 外部正文、runtime output、archive package body、observability record、sync private copy 进入 Artifact truth。
- `current latest`、临时清单、发布说明、治理裁决、trace / graph query、report / preview 取代正式 version / lineage / baseline 锚点。
- Query、Consumer、Job、projection、report、reconciliation 或 handoff 反写、修复或回滚核心 truth。
- 历史 Draft 中的 Git / S3 / search / hash / graph / old SLA 数字回流为当前默认基线。
- 未来实现因为 `03/04/07` 未闭口而自行补 schema、状态、port、配置或产品口径。

### 3.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

当前仍需挂起的问题主要是:

- 具体 DB、message bus、object store、search、archive、observability、sync、external content source 产品是否进入正式基线。
- 旧性能 / 容量 / 可用性候选数字是否升级为正式 SLO 或验收目标。
- 高级 search / preview / report / reconciliation 增强是否进入当前详细设计范围。
- content integrity / tamper / content-addressing 是否升级为 ADR 级机制。
- external GRC / archive / observability / sync handoff 是否需要更深的回链验证或双向集成。
- 正式 `04-配置设计.md` 和 `07-实施计划.md` 缺口何时补齐以及如何接续门禁。

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

本步风险表和待确认表都必须点明影响范围。凡是影响 Step 4 ~ Step 11 已收稳主语稳定性的项,后续都不能在 `03-详细设计.md` 中直接暗改,必须按 Step 12 的回退规则先回概要设计修正。

### 3.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导详细设计的是“看起来像默认方案、但实际还未定论”的内容:

- 历史产品假设和旧性能数字。
- `04-配置设计.md` / `07-实施计划.md` 缺失时被误以为配置项或实施 boundary 已默认成立。
- 外围增强能力被误当成 P0 主线。
- 交接 / handoff / export 被误当成核心 truth 的一部分。

### 3.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

以下内容不进入本步:

- 目录调整、crate 名、提交拆分、CI、脚本、证据路径、报告样式。
- 测试用例逐条编写、mock 数据整理、实施排期。
- 已经明确交给 `03-详细设计.md` 展开的字段、DTO、状态矩阵、repository trait 和 job report。

---

## 4. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 相邻仓、派生材料、消费副本或同步副本补造 / 迁移 / 反向定义 Artifact truth | 影响 Step 5 主要组成部分、Step 6 truth core 对象、Step 8 truth write / read 流和 Step 9 主状态机 | `L1-artifact` 只拥有 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactConsumptionBackref` truth;相邻仓只能引用、消费、显化或交接 |
| 外部正文、runtime output、archive package body、observability body、sync private copy 进入 Artifact truth | 影响数据归属、`ArtifactContentFactContext`、content source ports、异常边界和配置禁止线 | 正文只允许以 ref / summary / safe summary / mirror state 承接,禁止进入 core truth |
| `ArtifactVersion` 被 current latest、自动化再生成结果或外部状态无声覆盖 | 影响 version management、状态机、baseline freeze、consumable reference 和验收红线 | 版本只允许显式 candidate / publish / supersede 路径演化,不得由外部当前态替代 |
| `ArtifactLineageLink` 被 trace、tool result、event stream、graph query 或 report 补造 | 影响 lineage management、traceability、query surface、observability handoff | lineage truth 只锚定正式 fact / version;trace / graph / report 只提供线索或只读派生 |
| `ArtifactBaseline` 被发布说明、治理裁决、项目状态、归档包或临时版本清单替代 | 影响 baseline management、archive / sync handoff、历史回看和验收否决 | baseline 只表达正式 version 的受控冻结集合,外部集合只能引用 baseline |
| Query、preview、report、reconciliation、handoff 或 projection 反写 Artifact truth | 影响 Query no-write、derived maintenance、reconciliation、handoff 和状态传播 | 派生、报告、对账、交接只读且最终一致,失败只暴露 stale / rebuilding / unavailable / failed / retryable |
| Consumer 直接生成 fact / version / lineage / baseline,或 Job 修复核心 truth | 影响接口骨架、处理流、状态机、异常边界和实现门禁 | Consumer 只写 reference / pending / stale / resolution;Job 只维护 derived / refresh / reconcile / handoff |
| 配置绕过 actor、metadata、idempotency、visibility、formal-only、candidate-only 或 forbidden-body 门禁 | 影响 Step 11 禁止配置化边界、状态机、安全门禁和测试负例 | 配置只能改变运行承载、节奏、降级和外部接缝,不能改变 domain invariant |
| 历史 Git / S3 / search / hash / graph / old SLA 数字回流为当前硬基线 | 影响配置影响轮廓、详细设计判断、测试 / 验收边界和产品中立性 | 历史技术线索只作参考输入,不得在 `02` 或后续实现中被默认继承 |
| 未来实现因 `03/04/07` 未闭口而自行补 schema、状态、port、mapper、配置或 evidence 真相源 | 影响 `03~07` 全链路,并直接破坏设计真相源闭环 | 未闭合的 exact contract 必须回到对应设计文档闭口,不能由实现侧私补 |

---

## 5. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| DB、message bus、object store、search、archive、observability、sync、external content source 的具体产品是否进入正式基线 | `04-配置设计.md`、`07-实施计划.md`、ADR、容量验证 | 当前只固定承载角色和产品中立边界,不锁具体产品 |
| 旧性能 / 容量 / 可用性候选数字是否升级为正式 SLO / 验收目标 | `05-测试方案.md`、`06-验收标准.md`、容量模型 | 当前不把旧数字写成硬指标,等待负载模型和验收数据支撑 |
| 高级 search / preview / report / reconciliation 增强是否进入当前详细设计范围 | Query、derived maintenance、workspace / console / sync 消费面 | 当前按外围增强挂起,不影响核心 truth 主线和 Step 12 稳定输入 |
| content integrity、hash、tamper、content-addressing 是否升级为 ADR 级机制 | external content boundary、configuration、testing、technical mechanism | 当前只保留“正文禁止入仓 + 完整性可作为候选线索”口径,具体机制后续决定 |
| external GRC / archive / observability / sync handoff 是否需要更深的回链验证、双向集成或人工恢复流程 | handoff jobs、traceability、acceptance evidence、operations | 当前只固定 handoff marker、failed / retryable surface 和 truth 不回滚规则 |
| 高风险配置变更是否需要正式审批、operator approval 或独立配置治理流程 | Step 11 配置影响、security、traceability、operations | 当前只要求配置可审计且不可越界,具体治理流程后移 `03/04/07` |
| 正式 `04-配置设计.md` 与 `07-实施计划.md` 如何补齐并接续门禁 | 文档链、项目台账、后续实现准备 | 当前作为正式文档缺口挂起;进入配置或实施前必须由对应文档闭口 |

---

## 6. 当前设计层未闭环项说明

### 6.1 当前不阻塞 Step 14 的事项

以下事项当前不阻塞整理正式 `02-概要设计.md`:

- 产品选型仍未确定。
- 旧性能数字未升级为正式 SLO。
- 外围增强能力是否进入当前迭代未定。
- 高风险配置变更的具体治理流程未定。
- handoff / export 的恢复和回链验证流程未定。

这些事项不会推翻 Step 4 ~ Step 12 已收稳的概要主线,只会影响后续详细设计、配置说明、测试方案、验收标准、实施计划或 ADR。

### 6.2 进入实现前会阻塞的事项

以下事项若在进入实现前仍未闭合,会阻塞落码:

- `03-详细设计.md` 没有给出对象字段、DTO、状态矩阵、repository / port、event payload、job report 的正式契约。
- `04-配置设计.md` 没有给出 adapter / job / consumer / publisher / handoff 的必需配置和校验规则。
- `05-测试方案.md` 没有覆盖 query no-write、consumer / job 不写 truth、forbidden body、handoff failure 和 configuration negative gates。
- `07-实施计划.md` 在存在正式设计缺口时仍要求实现侧自行补 schema、状态、端口、产品或容量口径。

### 6.3 风险与待确认的处理规则

- 风险项必须在正式 `02-概要设计.md` 中保留为设计红线或保守处理口径。
- 待确认事项不得在 Step 14 整理时润色成已确认结论。
- 如果 Step 14 发现某个待确认事项实际会改变 Step 4 ~ Step 12 的稳定主语,必须回退对应 Step 修正。
- 如果后续详细设计要改变某条风险的当前处理口径,应先回到需求、架构或概要对应章节重新收口。

---

## 7. 不作为设计风险或待确认事项的内容

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 文档润色、术语统一、交叉引用修正 | 不改变设计主语或边界 | Step 14 |
| 测试用例逐条编写、fixture、mock 数据 | 属于测试方案细化 | `05-测试方案.md` |
| crate / file / module 命名、代码目录、提交拆分 | 属于详细设计或实施安排 | `03-详细设计.md` / `07-实施计划.md` |
| 具体配置 key、默认值、env var、secret、部署挂载 | 属于配置说明 | `04-配置设计.md` |
| CI、脚本、报告样式、evidence 路径 | 属于测试 / 验收 / 实施文档 | `05` / `06` / `07` |
| 开发排期、人员分工、提交顺序 | 属于项目管理或实施计划 | `07-实施计划.md` |

---

## 8. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史材料未严格区分“风险”和“待确认” | 容易把未定事项润色成结论,或把任务包装成风险 | 本步拆成风险表和待确认表 |
| `L1-artifact` 历史 Draft 里有大量技术假设和旧数字 | 容易误导 03 把产品和指标当成默认基线 | 本步把它们显式挂为待确认或风险保守口径 |
| Step 12 已经承接给 03 的 exact contract 仍可能被重新挂起 | 会混淆“稳定输入”和“未定事项” | 本步不重复挂 Step 12 已交给 03 的字段、DTO、状态、port 契约 |
| `04/07` 文档缺口容易被当成“后面自然会补” | 可能导致实现前缺正式门禁 | 本步明确文档缺口的挂起口径和进入实现前的阻塞条件 |

---

## 9. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 风险表达 | 分散在需求 / 架构章节 | 按概要层主线重新筛选并集中收纳 |
| 待确认项 | 容易和详细设计承接内容混写 | 只保留真正未形成定论的问题 |
| 产品 / 指标 / 外围增强 | 容易被误读为默认方案 | 明确挂起到后续文档或 ADR |
| 实现阻塞口径 | 没有在 02 末段集中说明 | 明确哪些未闭合项会阻塞进入实现 |
| Step 14 边界 | 容易把待确认润色成结论 | 明确正式整理时必须保留挂起状态 |

---

## 10. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否复制 `00/01` 风险全文 | 不复制全文 | Step 13 只保留仍直接影响概要设计成立性的部分 |
| 是否把 Step 12 已承接给 03 的 exact contract 再写成待确认 | 不再重复挂起 | 那些内容已是稳定输入,不是未定项 |
| 是否把产品未定本身写成阻塞风险 | 不直接写成阻塞风险 | 产品未定本身可接受,只有反向改变 truth 主线才是风险 |
| 是否把普通任务写成待确认 | 不写 | 任务不是设计未闭口项 |
| 是否阻塞进入 Step 14 | 不阻塞 | 当前风险和待确认都有保守口径,可进入正式概要整理 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §13 引用本文件 §4 的设计风险清单。
- §13 引用本文件 §5 的设计待确认事项清单。
- §13 摘录本文件 §6 的当前设计层未闭环项说明。
- §13 保留“待确认事项不得在正式概要整理时润色成定论”的规则。
- 正式文档中不重复写 Step 12 已承接给详细设计的字段、DTO、状态、port、repository 和测试矩阵细节。

---

## 12. 进入下一步条件

- 已明确概要设计层哪些问题构成风险。
- 已明确哪些问题仍待确认并挂起到后续文档或 ADR。
- 已说明风险和待确认事项影响哪些设计范围。
- 已排除普通任务、优化项、开发排期和已进入 Step 12 稳定输入的内容。
- 未把待确认事项润色成已确认结论。
- 可以进入 Step 14 “整理正式概要设计文档”。
