# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 ~ Step 12 已收稳代码主体框架、主要组成部分、对象、接口、处理流、状态机、异常边界、配置影响和详细设计承接清单后,显式收纳当前概要设计层仍需要保守看待的风险与待确认事项。

本步只收纳设计层未闭环项,不写项目 backlog、TODO 清单、具体实施方案、开发排期、配置 key、产品选型结论或测试用例全集。已经进入 Step 12 详细设计承接清单的对象、接口、流程、状态和配置契约,不在本步重复挂成待确认。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` ~ `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供已收稳概要设计结论和详细设计承接清单 |
| `00-需求文档.md` §15 | 已完成 | 提供需求层风险与待确认事项 |
| `01-架构设计.md` §15 | 已完成 | 提供架构层风险、待确认事项和当前处理口径 |
| `02_hld_step_12_detailed_design_handoff.md` §7 | 已完成 | 提供不进入承接清单、应进入本步或后续文档的内容 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前风险不是 Step 4 ~ Step 12 未收稳,而是后续详细设计、配置设计或实现若误用未定事项,会打穿已收稳边界。主要风险包括:

- 旧 Gate / Decision / Request 教学线索回流,替代新版业务主要组成部分。
- process waiting、conversation card、work lifecycle、runtime cache、dashboard row 或 external GRC record 替代正式 Governance Decision。
- Policy effective fact、shared rules、Control / AIIA / SoA conclusion、Nonconformity corrective loop 被外部定义、执行、报告或配置反向定义。
- 外部正文、artifact / evidence body、method body、runtime log、archive package 或 external GRC document 进入 Governance truth。
- Query、Consumer、Job、projection、report、handoff 或 outbox publish failure 反写、修复或回滚核心 truth。
- 非 `L0-core` sibling repo 进入核心语义编译期依赖。
- 后续实现因详细设计未闭合而自行补 schema、状态、port、产品或容量口径。

### 3.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

挂起事项主要是后续文档或演进阶段需要决定的内容:

- 具体 DB、message bus、cache、search、object storage、audit store、external GRC 产品是否进入配置 / 实施基线。
- 旧性能数字是否升级为正式 SLO 或验收目标。
- 高级治理看板、Policy DSL、复杂 Gate 编排、自动 AIIA / SoA 草拟、外部 GRC 深度集成和报告健康度分析是否进入演进 scope。
- 完整 ES / CQRS、rule engine、simulation 或复杂重放是否升级为 ADR 级决策。
- 高风险配置变更是否需要正式 Governance decision、operator approval 或独立配置治理。

### 3.3 未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

本步风险表和待确认表都必须写明影响范围。影响范围若触及 Step 4 ~ Step 11 的主语,后续不能直接在详细设计暗改,必须按 Step 12 回退规则处理。

### 3.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导详细设计的问题是“未定但看起来像默认方案”的内容:旧 SLA 数字、PostgreSQL、Policy engine、external GRC、完整 ES / CQRS、高级报告、复杂 Gate 编排和自动草拟。如果不明确挂起,详细设计可能把它们当成已批准基线。

### 3.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

普通排期、重构、文档润色、测试用例补全、提交拆分、代码生成、CI 配置、报告样式和开发任务不进入本步。它们应进入 `07-实施计划.md`、测试计划或项目管理工具,不作为概要设计风险。

---

## 4. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 旧 Gate / Decision / Request 教学线索回流为概要主线 | 影响 Step 4 代码主体、Step 5 主要组成部分、Step 7 接口和 Step 8 处理流 | 旧线索只能作为历史输入和术语背景;正式主线以 Step 4~12 收稳结论为准 |
| process waiting state、work lifecycle、conversation card、runtime cache 或 dashboard row 替代 `GovernanceDecision` | 影响 `Gate and decision management`、状态机、outbox、下游消费和验收红线 | Governance 拥有正式 Gate / Decision;相邻仓只能提供语境、等待、显化或消费结论 |
| Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist、tool execution 或 external GRC status 混写 | 影响 `Policy and shared rules management`、runtime consumption、配置影响和安全边界 | Policy 生效事实归 Governance;定义、执行、能力和外部系统只可引用、消费或反馈 |
| shared rules 不可覆盖语义被低 scope policy、项目配置、runtime default 或 timeout fallback 弱化 | 影响 Policy / shared rules 状态机、配置禁止边界和自动化授权 | shared rules 是组织级硬约束;低层配置和执行默认值不得覆盖 |
| Control / AIIA / SoA governance conclusion 与 standard、artifact / evidence body、method body 或 external GRC document 混写 | 影响数据归属、Control / compliance conclusion、archive / external GRC handoff | Governance 只保存控制适用、覆盖、排除、批准和结论;正文归来源仓或外部系统 |
| Nonconformity corrective loop 退化为 bug、work blocker、observability alert、report comment 或普通任务 | 影响 `Nonconformity corrective loop`、状态机、异常边界和验收闭环 | 不符合必须保留原因、纠正、复验、关闭和责任语境;外部线索只能作为 source / evidence |
| external body 通过 ref、snapshot、safe summary、handoff、report 或 maintenance 进入 Governance truth | 影响数据所有权、repository、snapshot、trace、handoff 和配置验证 | 所有外部材料只能以 ref / snapshot / safe summary / marker / handoff 承接,正文禁止入仓 |
| Query、report、dashboard、projection、reconciliation、archive preparation 或 external GRC export 反写真相 | 影响 Query no-write、derived maintenance、reconciliation 和状态传播 | 派生、导出、对账和投影只能消费、解释或交接,不能创建或改写 Governance truth |
| Consumer 直接生成 Decision、Policy、Control、Compliance 或 Nonconformity truth | 影响 inbound event consumer、external context mirror 和核心 command 边界 | Consumer 只写 snapshot / reference / pending marker / stale marker;正式变化必须走 Command |
| Operations Job 修复、批准、关闭或回滚核心 truth | 影响 rebuild、refresh、reconciliation、handoff、outbox publish 和异常边界 | Job 只能维护派生、快照、报告、publication 或 handoff marker |
| outbox publish failure 被解释为 command failure 并回滚已成立 truth | 影响 outbox、event publishing、下游消费和一致性分层 | outbox 只传播已成立 truth;发布失败进入 `Failed` / `DeadLettered` 和 operations surface |
| 同步成功伪装 runtime cache、report、external GRC、observability 或 archive handoff 已完成 | 影响通信方式、状态传播、query surface 和验收证据 | 同步只证明核心治理事实成立、拒绝、挂起或失败;外围消费和交接有独立状态 |
| 非 `L0-core` sibling repo 成为核心语义编译期依赖 | 影响依赖裁剪、ports、adapter 和实现边界 | 非 core sibling 只能通过 ref、snapshot、summary、event、port 或 handoff 协作 |
| 配置绕过 actor、metadata、idempotency、visibility、shared rules、closure 或 forbidden body 门禁 | 影响配置禁止边界、security、state machine 和异常处理 | 配置只能影响运行承载、adapter、job、限流和降级,不能改变 domain invariant |
| 后续实现因详细设计未闭合而自行补 schema、状态、port、产品或容量口径 | 影响 `03`~`07` 全链路和实现可落码性 | Step 12 已要求详细设计闭合后再实现;遇到主语缺口必须回退概要或设计文档 |

---

## 5. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| 具体 DB、message bus、cache、search、object storage、audit store、external GRC 产品是否进入配置和实施基线 | `04-配置说明.md`、`07-实施计划.md`、ADR、容量验证 | 当前只固定承载角色和产品中立边界,不锁具体产品 |
| 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 等候选数字是否升级为正式 SLO | 测试方案、验收标准、容量模型、性能预算 | 当前不作为概要或需求硬指标;需负载模型和验收数据支撑 |
| 高级治理看板是否进入当前详细设计范围 | Derived maintenance、Query、workspace / console consumption | 当前作为外围增强挂起,核心闭环只要求授权查询和必要派生 |
| Policy DSL / simulation / complex rule authoring 是否进入 ADR 或后续版本 | Policy and shared rules、method-library seam、runtime consumption | 当前 Policy truth 不依赖具体 DSL / engine;后续按复杂度和需求压力决定 |
| 复杂 Gate 编排是否进入当前 P0 详细设计 | Gate / Decision、Approval responsibility、process / conversation seam | 当前只固定 Gate / Decision 和责任链主线;复杂编排作为后续演进挂起 |
| AIIA / SoA 自动草拟是否进入当前 scope | Control / compliance、artifact seam、AI assistant capability | 当前只固定治理结论和 artifact ref;自动草拟属于外围增强 |
| external GRC 深度集成是否从导出 / handoff 升级为双向集成 | Governance consumption and traceability、handoff、configuration、security | 当前 external GRC 只能消费或导出 Governance facts,不得定义 truth |
| 报告健康度、策略传播健康度和容量分析是否成为正式产品能力 | Derived maintenance、observability seam、testing / acceptance | 当前是外围增强和运维分析线索,不阻塞核心闭环 |
| 完整 ES / CQRS、event replay、rule engine 或 simulation 是否需要正式 ADR | Persistence、outbox、trace、reconciliation、technical mechanism | 当前保持 traceability / outbox / event collaboration,不提前锁定范式 |
| 高风险配置变更是否需要正式 Governance decision、operator approval 或配置治理流程 | Configuration impact、security、traceability、operations | 当前只要求可审计和不可越界;具体审批流程留给详细设计 / 配置说明 |
| archive / observability / external GRC handoff 的人工恢复和回链验证是否进入当前交付范围 | Handoff jobs、traceability、acceptance evidence | 当前只固定 handoff marker 和 failed surface,恢复流程后续闭合 |
| 实施阶段 commit boundary 和代码提交计划如何划分 | `07-实施计划.md` | 当前不在概要设计决定,等 `02/03/04/05/06` 形成后再划分 |

---

## 6. 当前设计层未闭环项说明

### 6.1 不阻塞进入 Step 14 的事项

以下事项不阻塞整理正式 `02-概要设计.md`:

- 产品选型和技术产品参数未定。
- 旧性能数字是否升级为 SLO 未定。
- 外围增强能力是否进入当前迭代未定。
- 高风险配置变更的具体审批流程未定。
- handoff / export 的人工恢复细节未定。

这些事项没有推翻 Step 4 ~ Step 12 已收稳的概要主线,只影响后续详细设计、配置说明、测试方案、验收标准、实施计划或 ADR。

### 6.2 会阻塞后续实现的事项

以下情况如果在进入实现前仍未闭合,会阻塞落码:

- 详细设计没有给出对象字段、DTO、状态矩阵、repository / port、event payload 或 job report 的正式契约。
- 配置说明没有给出 adapter / job / consumer / publisher / handoff 必需配置和校验规则。
- 测试方案没有覆盖 query no-write、consumer / job 不写 core truth、forbidden body、outbox failure 和 configuration negative gates。
- 实施计划在正式设计缺口处要求实现侧自行补 schema、状态、端口、产品或容量口径。

### 6.3 风险与待确认的处理规则

- 风险项必须在正式 `02-概要设计.md` 中保留为设计红线或保守处理口径。
- 待确认事项不得在 Step 14 润色成已确认结论。
- 如果 Step 14 发现某个待确认事项实际影响 Step 4 ~ Step 12 主语稳定性,应回退对应 Step 修正,而不是在正式文档中补一句带过。
- 如果后续详细设计需要改变风险项的处理口径,应先回到需求、架构或概要对应章节重新收口。

---

## 7. 不作为设计风险或待确认事项的内容

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 普通文档润色、章节排序、交叉引用修正 | 不影响设计主语或边界 | Step 14 |
| 测试用例逐条编写 | 属于测试方案细化 | `05-测试方案.md` |
| 代码目录、文件名、crate 名和提交拆分 | 属于详细设计或实施计划 | `03-详细设计.md` / `07-实施计划.md` |
| CI 脚本、报告样式、证据路径 | 属于测试 / 验收 / 实施 | `05` / `06` / `07` |
| 具体配置 key、默认值、环境变量 | 属于配置说明 | `04-配置说明.md` |
| 重构、清理、排期和开发任务 | 属于项目管理或实施计划 | `07-实施计划.md` |

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧文档未区分风险和待确认 | 容易把未定事项润色成定论或把任务包装成风险 | 本步拆成风险表和待确认表 |
| 旧 external GRC、Policy engine、PostgreSQL、旧 SLA 数字容易回流 | 会让未批准产品或指标变成概要基线 | 本步作为待确认或风险保守挂起 |
| 旧文档中 API / 状态 / schema 未定容易被误读为概要缺失 | 这些已由 Step 12 承接到详细设计 | 本步不重复挂起已进入详细设计承接清单的契约细节 |
| 旧文档缺少“实现不得自行补设计”的红线 | 实现 agent 可能在缺 schema 时自行造口径 | 本步明确未闭合契约会阻塞实现,必须回设计闭口 |

---

## 9. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 风险表达 | 混在架构和需求风险里 | 按概要层边界重新筛选 |
| 待确认事项 | 与详细设计承接内容混合 | 已进入 Step 12 的内容不重复挂起 |
| 产品 / 容量 / 外围增强 | 容易被当成默认方案 | 明确挂起到后续文档或 ADR |
| 实现阻塞口径 | 未集中说明 | 明确未闭合 schema / 状态 / port / 产品不能由实现补 |
| Step 14 输入 | 缺风险保留规则 | 明确待确认不得润色成定论 |

---

## 10. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否复制需求 / 架构风险全文 | 不复制全文 | 本步只收纳概要层仍相关的风险 |
| 是否把详细设计要展开的字段 / DTO / 状态逐项挂起 | 不重复挂起 | Step 12 已把这些列为详细设计承接 |
| 是否把产品选型写成风险 | 作为待确认,不默认风险 | 产品未定本身可接受,只有反向改变 truth 才成为风险 |
| 是否把普通任务写成待确认 | 不写 | 任务不是设计未闭口 |
| 是否阻塞 Step 14 | 不阻塞 | 当前风险和待确认都有保守口径,可进入正式概要整理 |

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
- 已排除普通任务、优化项、开发排期和已进入详细设计承接清单的内容。
- 未把待确认事项润色为已确认结论。
- 可以进入 Step 14 “整理正式概要设计文档”。
