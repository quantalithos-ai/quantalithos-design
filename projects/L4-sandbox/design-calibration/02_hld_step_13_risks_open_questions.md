# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-07-08
> 状态: completed_current_closeout
> 最近定向回查: 2026-08-01 (`v7.9-closeout`)
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 在 Step 4~12 已收稳代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界、配置影响和详细设计承接清单后,显式收纳当前概要设计层仍未闭环的设计问题。这里必须区分“已经识别、需要保守处理的风险”和“尚未形成定论、只能挂起的问题”。本步不写 backlog、TODO、实现任务、排期、配置 key、产品参数、完整测试集或实施拆分。

> Current-source note: 下文 Step 13 原始问题回答保留为 historical assembly record；其中“`04` / `07` 缺失”只描述
> 2026-07-08 当时状态。当前 disposition 以本文末尾 `v7.9-closeout` 定向回查为准。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 13 | 是。Step 12 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 13 | 是。`project_execution_ledger.md` 已将恢复点停在 `02-概要设计.md` Step 12,用户确认后允许进入 Step 13。 |
| 文档级 flow 是否允许进入 Step 13 | 是。`02_hld_calibration_flow.md` 已记录 Step 12 `pass_wait_review`,进入 Step 13 的门禁已满足。 |
| 是否已读取 Step 4~12 | 是。代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界、配置边界和详细设计承接清单均已具备。 |
| 是否已读取概要 SOP Step 13 和书写规范 §4.13 | 是。必须输出风险表和待确认事项表,且两者不得混写。 |
| 是否发现阻塞 Step 13 的上游 blocker | 否。当时 `04-配置设计.md`、`07-实施计划.md` 尚未形成,只登记为下游文档缺口；该历史缺口现已按本文末尾 current disposition 关闭。 |

---

## 2. 本步目标

本步要解决的不是“再发明一轮概要设计”,而是把当前概要层还没有闭口、但如果不显式收纳就会误导 `03-详细设计.md` 的事项收纳清楚。

本步要收稳:

- 哪些问题已经构成 `L4-sandbox` 概要层风险,需要在后续设计中持续按保守口径处理。
- 哪些问题目前仍未形成定论,只能作为待确认事项挂起。
- 这些风险和待确认事项分别影响哪些主要组成部分、对象、接口、处理流、状态机或配置边界。
- 哪些事项当前不阻塞 Step 14 正式装配,但若进入实现前仍未闭口会转为阻塞。

本步不处理:

- 详细设计要继续展开的字段、DTO、状态矩阵、repository / port 契约。
- 具体 backend / DB / object store / bus / observability / investigation 产品选型。
- 具体 network allowlist、mount 清单、seccomp / AppArmor / cap-drop profile。
- timeout / retry / lease / retention / batch / SLO 等具体数字。
- 开发任务、提交拆分、实施排期、真实测试结果或验收签署。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供运行单元、代码主体骨架和实现分层。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 6 个主要组成部分、职责边界和相邻仓切缝。 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供 execution context、boundary、policy、run、capture、failure、cleanup、redline、read-side 等关键对象主语。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Outbound Event / Job / Port 骨架。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 intake、boundary、policy、run、capture、handoff、failure、cleanup、redline、relay、projection、reconciliation 主路径。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供 6 组并行状态机、允许 / 禁止迁移和传播关系。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供 fail-closed、pending / blocked / failed / degraded 等关键异常边界。 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓和禁止配置化边界。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供哪些内容已经成为 `03-详细设计.md` 稳定输入,哪些内容不能再挂成“未定”。 |
| `projects/L4-sandbox/00-需求文档.md` §15 | 当前正式需求基线 | 提供需求层风险、待确认事项和“当前不阻塞 / 后续会阻塞”的口径。 |
| `projects/L4-sandbox/01-架构设计.md` §15 / §17 | 当前正式架构基线 | 提供架构层风险、待确认事项、阻塞转换规则和 ADR 候选索引。 |
| `projects/L1-artifact/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 参考 Step 13 单文件结构、风险 / 待确认拆分和阻塞转换说明写法。 |
| `projects/L1-governance/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 参考如何避免把 Step 12 已交给详细设计的稳定输入重新写成待确认。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 13 标准、Step 12 和 L1 样例。 | done | 确认本步只收纳未闭环项,不重写稳定输入。 |
| 2 | 从正式 `00/01`、Step 10~12 和当前文档缺口中筛出风险项与待确认项。 | done | 形成风险候选池和挂起候选池。 |
| 3 | 回答 Step 13 SOP 问题。 | done | 明确风险、待确认、影响范围和排除项。 |
| 4 | 输出设计风险表和待确认事项表。 | done | 每条均回指 sandbox 已收稳主语,不写任务层事项。 |
| 5 | 输出当前不阻塞项、后续阻塞转换规则和正式文档回填草稿。 | done | 保障 Step 14 不会把挂起事项润色成结论。 |
| 6 | 更新 flow 和项目级台账,并停在用户审查点。 | done | 已同步 `02_hld_calibration_flow.md` 和 `project_execution_ledger.md`,当前进入 wait review,不跨到 Step 14。 |

---

## 5. SOP 问题回答

### 5.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前风险不在于 Step 4~12 没有收稳,而在于后续详细设计、配置设计或实现一旦错误地把某些“看似合理的补充”写成正式结论,就会打穿 sandbox 已收稳边界。主要风险包括:

- tools semantic execution、runtime agent loop、member lifecycle orchestration 或 runner host lifecycle 反向定义 sandbox 正式 execution isolation truth。
- 弱后端、测试承载或 host-run 路径反向定义 `CoherentBoundary`,让 resource / filesystem / network / process 边界 silent degrade。
- sandbox 反向拥有 launch / isolation policy truth、approval truth、allowlist truth 或 capability truth,导致高风险动作在缺 policy、冲突、过期或不支持时仍继续执行。
- capture fact、candidate material、observability material、handoff fact 和 investigation handoff 的分层被打穿,让输出、候选材料、观测材料或调查材料静默升级为下游正式 truth。
- Query、Consumer、Job、relay、projection、reconciliation 或 derived maintenance 反写核心 truth,或用派生 / 交接状态回滚 capture / cleanup / containment 结果。
- failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 被弱化成“best effort 运维补丁”,使 cleanup 先删证据、orphan 脱管运行或 containment 退化为提示。
- 配置越界改写 truth ownership、coherent boundary、fail-closed、cleanup guard、handoff no-rollback、redline semantics 或依赖裁剪。
- 历史 Docker / gVisor / Firecracker、旧 allowlist / security profile、旧 P95 / SLA、旧 README 术语和旧主线回流为当前概要默认基线。
- 后续实现因为 `03/04/07` 仍未闭口,自行补 schema、状态、port、产品、evidence 或 boundary 口径。

### 5.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

当前仍需挂起的问题主要是:

- 具体 isolation backend 组合、正式 / 测试承载边界和 stronger isolation profile 触发条件。
- backend capability matrix、同等边界证明和 capability stale / unsupported 的更细粒度解释材料。
- policy / authorization 来源矩阵,以及 network / filesystem / process / tool-runtime launch policy 的 high-risk action taxonomy。
- 具体 network allowlist 粒度、mount 清单、seccomp / AppArmor / cap-drop / process profile 分类。
- handoff receipt / failed / retryable / dead-letter / reconciliation 协议,以及 investigation handoff 的回链确认方式。
- material class、partial capture、retention、safe summary、cleanup release 和 deletion guard 的更细粒度约束。
- failure taxonomy、control conflict、containment release、operator control scope 和人工恢复边界。
- DB / object store / bus / observability / investigation 等产品是否进入后续正式基线。
- SLO、capacity、lease、timeout、retry、batch、cursor、retention 等具体数字。
- inspect / preview / backend comparison / trend / replay 等 read-side 增强是否进入当前迭代详细设计范围。
- 正式 `04-配置设计.md` 与 `07-实施计划.md` 如何承接当前概要挂起项和后续门禁。

### 5.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

所有风险项和待确认事项都必须指向已收稳主语,否则后续 `03` 很容易把风险误认成“实现自由度”。当前影响范围主要集中在:

- Step 5 的 6 个主要组成部分。
- Step 6 的 `ControlledExecutionContext`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`CleanupGuard`、`RedlineContainment`、`SandboxReadProjection` 等对象。
- Step 7 的 Command / Query / Consumer / Outbound Event / Job / Port 家族。
- Step 8 的 intake、boundary、policy、run、capture / handoff、failure / cleanup、redline、relay / reconciliation 主路径。
- Step 9 的 6 组并行状态机。
- Step 11 的配置影响轮廓和禁止配置化边界。

### 5.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导 `03-详细设计.md` 的不是明显缺口,而是“看起来像默认基线、实际上还没定”的内容:

- 历史后端产品、旧安全 profile 和旧性能数字。
- 下游配置契约尚未形成时被误当成可以直接在 `03` 写全配置 key / 默认值 / profile；当前该风险转为“不得绕过正式 `04` current contract”。
- handoff receipt、cleanup release 和 investigation handoff 尚未收细时,被实现误写成“收到任意回执即可放行 cleanup”。
- read-side 增强被误当成核心 truth 主线的一部分。
- 调用方语义、工具语义或 runtime loop 被误当成 sandbox 自己的业务主线。

### 5.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

以下内容不进入本步:

- 代码目录、crate 命名、文件组织、提交拆分、CI、脚本、报告样式。
- 测试用例逐条编写、fixture / mock 数据、验收 evidence 路径。
- 详细设计要继续展开的对象字段、DTO、状态矩阵、repository / port trait、event payload 和 job report。
- 开发排期、人员分工、run_id、commit boundary、真实验收签署。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 README / 旧 `02/03` 的“命令执行器”叙事 | 容易让 `L4-sandbox` 被误缩成后端适配器或 tool runner | 本步把第二套语义、弱边界和语义污染明确列为风险 |
| Step 12 已经交给 `03` 的稳定输入 | 容易又被当成“还未定”重新挂起 | 本步只挂真正未形成定论的问题,不重复挂对象字段、DTO、状态矩阵和 port 契约 |
| 当时 `04-配置设计.md` 与 `07-实施计划.md` 尚未形成 | 容易让实现侧先补配置 / 实施边界 | 作为 historical document gap 保留；当前两份正式文档、implementation ledger 与 32 件 planned skeleton 已形成，仍禁止实现侧私补第二套契约 |
| 产品中立要求与历史技术线索并存 | 容易把 Docker / gVisor / allowlist / 旧数字错读为默认基线 | 本步把历史线索回流明确列为风险,并把产品选型保持在待确认口径 |
| sandbox 边界跨 intake / boundary / policy / capture / cleanup / read-side 多条主线 | 风险和待确认项容易写成泛泛而谈 | 本步所有条目都回指主要组成部分、对象、接口、流或状态组 |

---

## 7. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| tools semantic execution、runtime agent loop、member lifecycle orchestration 或 runner host lifecycle 反向定义 sandbox 正式主线 | 影响 `Controlled execution intake and identity`、`ControlledExecutionContext`、`OpenControlledExecutionContext`、intake / run flow、execution context 状态组 | sandbox 只拥有 execution isolation truth; tools 语义、runtime loop、member 生命周期和 runner 触发语义只能作为外部语境输入,不得成为 sandbox 自己的 truth |
| 弱后端、测试承载、fallback 或 host-run 路径反向定义 `CoherentBoundary`,让 resource / filesystem / network / process 边界 silent degrade | 影响 `Boundary establishment and enforcement`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`EstablishExecutionBoundary`、boundary flow、boundary 状态组 | 任一必需边界不可落实、不可验证或后端不支持时只能 `Rejected`、`Pending`、`Unsupported` 或 `Failed`,不得 permissive fallback |
| sandbox 反向拥有 launch / isolation policy truth、approval truth、allowlist truth 或 capability truth,导致高风险动作 fail-open | 影响 `Policy execution decision`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`EvaluatePolicyExecution`、policy flow、policy / launch 状态组 | sandbox 只消费给定 policy / authorization / capability summary 并形成执行裁定; policy 定义、审批和能力 truth 继续外部拥有,缺失或冲突时 fail-closed |
| capture fact、candidate material、observability material、handoff fact 或 investigation handoff 的 ownership 分层被打穿 | 影响 `Execution capture and material handoff`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、capture / handoff flow、handoff 状态组 | 输出、候选材料、观测材料和调查交接只允许分层承接; 下游正式 truth 仍由下游确认,sandbox 不得静默升级 |
| Query、Consumer、Job、relay、projection、reconciliation 或 derived maintenance 反写核心 truth,或用派生状态回滚 capture / handoff / containment 结果 | 影响 `SandboxReadService`、`SandboxDerivedMaintenanceService`、Query / Consumer / Job 家族、relay / projection / reconciliation flow、read / relay 状态组 | Query no-write、Consumer 不写核心 truth、Job 不修核心 truth、relay / handoff no-rollback 是长期红线 |
| failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 被弱化成 best-effort 运维辅助 | 影响 `Failure control and safety closure`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`CleanupGuard`、`RedlineContainment`、failure / cleanup / redline flow、safety 状态组 | cleanup guard、lease / orphan、reaper 和 containment 是一等正式语义; cleanup 不得先删证据,orphan 不得托管外继续运行,containment 不得 advisory-only |
| 配置越界改写 truth ownership、coherent boundary、fail-closed、handoff no-rollback、cleanup guard、redline semantics 或 `L0-core` 依赖裁剪 | 影响 Step 11 配置边界、运行单元 builder、主要组成部分和所有核心状态机 | 配置只能影响运行承载、节奏、接缝 enablement 和 degraded surface,不能改变 domain invariant 或写源归属 |
| 历史 Docker / gVisor / Firecracker、旧 allowlist / security profile、旧 P95 / SLA、旧 README 术语和旧主线回流为当前默认基线 | 影响 Step 13 风险判断、后续 `03/04/05/06/07`、测试 / 验收边界 | 旧技术、旧对象词、旧数字和旧阶段路线只作 historical material 或候选输入,不得被默认继承 |
| 后续实现因 `03/04/07` 未闭口而自行补 schema、状态、port、product、evidence 或 boundary 口径 | 影响 `03~07` 全链路、实现可落码性和设计真相源闭环 | 遇到契约缺口必须回到对应设计文档闭口,不能由实现侧私补第二套真相源 |

---

## 8. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| 具体 isolation backend 组合、正式 / 测试承载边界和 stronger isolation profile 触发条件 | `Boundary establishment and enforcement`;`IsolationEnvironmentHandle`;backend capability refresh;`04/05/07`;ADR | 当前只固定抽象 isolation backend contract、backend capability summary 和 coherent boundary,不锁 Docker / gVisor / Firecracker / k8s / local_process 组合 |
| backend capability matrix、同等边界证明和 capability stale / unsupported 的解释材料 | `BackendCapabilitySummary`;`EstablishExecutionBoundary`;boundary state;验收与测试方案 | 当前按 capability 缺失或不支持即拒绝 / 等待 / 失败处理,不先写“等价能力矩阵”定论 |
| policy / authorization 来源矩阵,以及 network / filesystem / process / tool-runtime launch policy 的 high-risk action taxonomy | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`EvaluatePolicyExecution`;policy flow;`04/05/06` | 当前只固定“给定 policy / authorization + fail-closed”口径,不提前锁唯一来源仓、粒度或动作分类全集 |
| network allowlist 粒度、mount 清单、seccomp / AppArmor / cap-drop / process profile 分类 | `BoundaryRequirementSet`;`CoherentBoundary`;boundary profile;高风险动作测试;配置说明 | 当前只固定 deny-by-default 和“限制不可 silent degrade”,不在概要层写具体 profile / allowlist 条目 |
| material class、partial capture、retention、safe summary、cleanup release 和 deletion guard 的更细粒度约束 | `CaptureFact`;`CapturedMaterialRef`;`CleanupGuard`;capture / cleanup flow;配置设计;容量和验收 | 当前只固定 capture / handoff / cleanup 分层和 cleanup 不得先删证据,不写具体大小、保存期、summary 规则和放行数字 |
| handoff receipt / failed / retryable / reconciliation 协议、relay dead-letter 协议,以及 investigation handoff 的回链确认方式 | `HandoffFact`;`HandoffTargetDeliveryPort`;`SandboxEventPublisherPort`;`InvestigationHandoffPort`;handoff / relay / reconciliation flow;`05/06` | material handoff 只允许 `Pending / Attempting / Delivered / Retryable / Failed` 进展并机械派生 aggregate，不允许 material `DeadLetter`；`DeadLetter` 仅属于 relay；cleanup / containment 不自动放行 |
| failure taxonomy、control conflict、containment release、operator control scope 和人工恢复边界 | `FailureClassification`;`ControlFact`;`RedlineContainment`;`SubmitSandboxControl`;`ClassifySandboxFailure`;failure / redline 状态组 | 当前只固定 failure / control / containment 是正式主语,具体分类全集、解除条件和人工恢复流程后移 `03/05/06` |
| DB / object store / bus / observability / investigation 等产品是否进入后续正式基线 | ports、配置设计、实施计划、capacity、ADR | 当前只固定承载角色和 ownership boundary,不锁具体产品 |
| SLO、capacity、lease、timeout、retry、batch、cursor、retention 等具体数字 | 配置设计、测试方案、验收标准、后台 job 和运维 cadence | 当前保持产品中立和结构性预算口径,不把旧数字升级为硬门槛 |
| inspect / preview / backend comparison / trend / replay 等 read-side 增强是否进入当前迭代详细设计范围 | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;read query;derived jobs;外围增强范围 | 当前按只读派生和外围增强挂起,不反向影响核心 truth 主线和 Step 12 稳定输入 |
| 已形成的正式 `04-配置设计.md` 与 `07-实施计划.md` 如何保持 current contract 并关闭实现 Activation 前置 | 文档链、项目台账、实施准备、配置闭口 | 设计文档、implementation ledger 与 32 件 planned skeleton 已形成；实现仍保持 `CB-SBX-01A blocked / activation_gate / wait_design`，只能按显式 blocker 关闭条件推进 |

---

## 9. 当前设计层未闭环项说明

### 9.1 当前不阻塞 Step 14 的事项

以下事项当前不阻塞整理正式 `02-概要设计.md`:

- 具体 backend、DB、object store、bus、observability、investigation 产品尚未锁定。
- security profile、network allowlist、mount 分类和 capability matrix 尚未细化为完整参数集。
- handoff receipt、investigation handoff 回链、partial capture、retention 和 cleanup release 尚未细化为正式协议。
- read-side 增强和趋势 / replay / backend comparison 是否进入当前迭代仍未决定。
- SLO、capacity、lease、retry、batch 和 retention 具体数字尚未形成定论。
- 正式 `04-配置设计.md`、`07-实施计划.md`、implementation ledger 与 32 件 planned skeleton 已形成；这不等于 design baseline、目标仓或 Activation 前置已关闭。

这些事项当前不会推翻 Step 4~12 已收稳的概要主线,只会影响后续详细设计、配置说明、测试方案、验收标准、实施计划或 ADR。

### 9.2 进入实现前会阻塞的事项

以下情况若在进入实现前仍未闭合,会阻塞落码:

- `03-详细设计.md` 没有给出对象字段、DTO、状态矩阵、transaction boundary、repository / port、event payload 和 job report 的正式契约。
- `04-配置设计.md` 没有给出 config owner、validator、adapter / job / consumer / publisher / handoff 必需配置和越界校验规则。
- `05-测试方案.md` 没有覆盖 query no-write、consumer / job 不写 truth、boundary silent degrade、policy fail-closed、handoff no-rollback、cleanup guard、redline containment 等负向门禁。
- `06-验收标准.md` 没有把核心红线和挂起事项转译为正式验收门禁。
- `07-实施计划.md` 在正式设计仍有缺口时要求实现侧自行补 schema、状态、端口、产品、profile 或证据口径。

### 9.3 风险与待确认的处理规则

- 风险项必须在正式 `02-概要设计.md` 中保留为长期红线或保守处理口径。
- 待确认事项不得在 Step 14 装配时润色成已确认结论。
- 如果某个待确认事项后来证明会改变 Step 4~12 的稳定主语,必须回退对应 Step 修正,不得在 `03` 或 `04` 中偷偷改口。
- 如果后续详细设计要改变某条风险的当前处理口径,也必须先回到需求、架构或概要对应章节重新收口。

---

## 10. 不作为设计风险或待确认事项的内容

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 文档润色、术语统一、交叉引用修正 | 不改变设计主语或边界 | Step 14 |
| 详细设计要补的字段、DTO、状态矩阵、repository / port 契约 | 已进入 Step 12 稳定输入 | `03-详细设计.md` |
| 配置 key、默认值、env var、secret、部署挂载 | 属于配置说明 | `04-配置设计.md` |
| 测试用例逐条编写、fixture、mock 数据、evidence 路径 | 属于测试 / 验收细化 | `05-测试方案.md` / `06-验收标准.md` |
| crate / file 命名、代码目录、提交拆分、CI、脚本 | 属于实现或实施安排 | `03-详细设计.md` / `07-实施计划.md` |
| 开发排期、人员分工、真实 run_id、commit、验收签署 | 不属于概要设计未闭环项 | `07-实施计划.md` 或真实实施记录 |

---

## 11. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 Step 12 已交给 `03` 的 exact contract 再写成待确认 | 不重复挂起 | 那些内容已是稳定输入,不是“尚未成型”的问题 |
| 是否把具体产品未定本身写成风险 | 不直接写成风险 | 产品未定本身可接受,只有反向改变边界或 truth 才构成风险 |
| 是否把 `04/07` 缺失写成项目管理问题 | 不写成项目管理问题 | 这里只保留它们对文档链闭口和实现门禁的影响 |
| 是否把历史技术线索列为待确认 | 不列为待确认 | 历史线索不是待定方案,而是必须防止回流的污染风险 |
| 是否阻塞 Step 14 | 不阻塞 | 当前已存在明确保守口径,可以先整理正式概要文档 |

---

## 12. 回填 `02-概要设计.md` §13 草稿

正式 `02-概要设计.md` 在 Step 14 才能重建。当前可回填的 §13 草稿骨架如下:

1. 先写一段总述:
   Step 4~12 已把 `L4-sandbox` 的代码主体、对象、接口、处理流、状态机和配置边界收稳,但仍有一部分会影响后续详细设计展开的风险与待确认事项需要显式保留。
2. 再放设计风险表:
   至少摘录第二套语义污染、弱边界 silent degrade、policy truth 回流、capture / handoff ownership 打穿、read-side 反写核心、cleanup / redline 弱化和配置越界等风险。
3. 再放待确认事项表:
   至少摘录 backend 组合、capability matrix、policy source 矩阵、security profile / allowlist 粒度、handoff 协议、material retention、failure taxonomy、产品选型、数字阈值和 read-side 增强范围。
4. 最后写当前未闭环项说明:
   哪些事项当前不阻塞正式概要装配,哪些事项若进入实现前仍未闭口会转为阻塞,以及待确认事项不得在后续装配时润色成定论。

---

## 13. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否严格区分风险和待确认事项 | 是 | 风险表与待确认事项表已拆开表达。 |
| 是否把已进入 Step 12 的稳定输入又写成待确认 | 否 | 对象字段、DTO、状态矩阵、repository / port 契约没有重复挂起。 |
| 是否每条都写明影响范围 | 是 | 已指向主要组成部分、对象、接口、处理流、状态机或配置边界。 |
| 是否用具体挂起口径代替“以后再说” | 是 | 每条待确认事项都给出当前保守处理口径。 |
| 是否混入任务、排期或实现方案 | 否 | 项目任务、实施拆分、配置 key、产品参数和测试用例全集均已排除。 |
| 是否改动正式 `projects/L4-sandbox/02-概要设计.md` | 否 | 正式文档仍待 Step 14 重建。 |

---

## 14. 当前结论

`02-概要设计.md` Step 13 `设计风险与待确认事项` 已完成当前中间产物收敛,并已同步 `02_hld_calibration_flow.md` 与 `project_execution_ledger.md`。

当前恢复点已停在 Step 13 `completed_wait_user_review`。下一允许动作只有:

1. 等待用户审查本 Step 13 中间产物。
2. 只有在用户再次明确确认后,才允许读取概要设计 SOP Step 14、概要设计书写规范正式章节 1~14 和装配样例,并进入 Step 14 `整理正式概要设计文档`。

---

## 15. PHYSICAL EOF Current Disposition: `v7.9-closeout`

本节是 Step 13 的唯一 current 结论，覆盖上文 2026-07-08 的恢复动作和“`04` / `07` 缺失”判断，但不删除其历史审计价值。
本次只做下游完成后的定向风险回查，不重新打开概要主体，不新增实现、测试、验收或运行事实。

### 15.1 定向回查输入

| 输入 | 读取目的 | 当前判定 |
|---|---|---|
| `projects/L4-sandbox/03-详细设计.md` | 核对 capture、handoff、relay publisher、ordinary hook 的 current contract | current detailed-design baseline |
| `projects/L4-sandbox/04-配置设计.md` | 核对 config owner、binding、validator 与不可配置化边界 | current reviewed design; activation qualification仍开放 |
| `projects/L4-sandbox/05-测试方案.md` | 核对负向门禁、254项测试设计和material / relay状态边界 | current reviewed test design;未执行测试 |
| `projects/L4-sandbox/06-验收标准.md` | 核对64项设计检查、VETO和`NotEntered`事实边界 | current reviewed acceptance design;未进入验收 |
| `projects/L4-sandbox/07-实施计划.md` | 核对正式计划、implementation ledger和32件planned skeleton | current reviewed implementation design;未激活实现 |
| `03_ddd_step_07_capture_handoff_publisher_observability.md` | 核对旧generic port的失效处置和material / relay outcome分层 | current owner source |
| `07_implementation_plan_step_13_formal_document_assembly.md` | 核对current contract lock、库存和Activation前置 | current assembly source |

### 15.2 风险与文档缺口 disposition

| 原判断 | current disposition | 正式 `02` 回填 |
|---|---|---|
| 正式`04`缺失 | `resolved_by_formal_04_review`;配置设计已经形成，但candidate / provider / profile qualification与真实配置激活仍未发生 | 删除“文档缺失”，保留Activation安全前置 |
| 正式`07`、implementation ledger和planned skeleton缺失 | `resolved_by_07_step_13_review`;正式13章、ledger和32 /32 skeleton已经形成 | 删除“文档缺失”，明确`CB-SBX-01A`仍blocked |
| `MaterialHandoffPort` / `ObservabilityMaterialPort`可作为正向概要port | `superseded`;正向surface固定为`CaptureCollectionPort`、`HandoffTargetDeliveryPort`、`SandboxEventPublisherPort`和ordinary hook | 更新§4 / §7索引并增加current-source note |
| material handoff可出现`DeadLetter` | `rejected`;material progress只允许`Pending / Attempting / Delivered / Retryable / Failed`，aggregate机械派生 | §13将dead-letter明确限定为relay outcome |
| 下游文档形成即可进入实现 | `rejected`;设计文档完成不关闭现实Activation前置 | §13.3改为显式blocker集合 |

### 15.3 当前阻塞边界

当前没有新增L1 / L2上游blocker，也没有开放的正式设计文档缺口。实现仍由以下Activation前置阻塞：

`BLK-SBX-BASELINE-001`、`BLK-SBX-REPO-001`、`BLK-SBX-VERSION-001`、`BLK-SBX-GIT-001`、
`BLK-SBX-CANONICAL-001`、`BLK-SBX-SHELL-001`、`BLK-SBX-P0Q-001`、`BLK-SBX-CI-001`、
`BLK-SBX-REVIEW-001`。

这些blocker只允许按各自owner和关闭条件处理；本文不把planned material、工作区状态或静态设计审计写成关闭证据。

### 15.4 Current self-check

| 检查项 | 结果 |
|---|---|
| 风险与待确认事项仍保持概要层粒度 | pass |
| 主流程安全契约未被保障 /交付细节稀释 | pass |
| `04` / `07`缺失旧判断已降为historical material | pass |
| material `DeadLetter`与relay `DeadLetter`已分离 | pass |
| 未生成commit、run、测试、evidence、review、签署或验收通过事实 | pass |

```text
step_status = completed_current_closeout
current_plan_version = v7.9-closeout
formal_02_targeted_writeback = ready_for_step_14_current_assembly
new_upstream_blocker = none
implementation = CB-SBX-01A blocked / activation_gate / wait_design
next_allowed_action = apply_step_14_current_assembly_then_keep_design_flow_closed
commit_required = no
```
