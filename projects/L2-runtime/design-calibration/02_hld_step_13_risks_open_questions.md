# L2-runtime 02 概要 Step 13: 设计风险与待确认事项

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 13 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4~12 已收稳的概要结构、异常 / 配置边界、03 承接清单及既有上游 blocker |
| 目标 | 区分已识别且已有当前处理口径的设计风险，与尚未形成定论、只能保持 pending / blocked 的待确认事项 |
| 禁止 | 项目 backlog、TODO、排期、实现指令、把已承接稳定主语重新写成待确认、伪造 readiness / evidence / acceptance |

## 1. 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 上游 action execution seam 未形成完整正向合同 | ActionPreconditionDecision、ActionFeedbackRecord、SideEffectMarker、RecoveryDecision 无法进入正向 dispatch / feedback 闭环 | Runtime 只固定 action choice、guard、feedback ref、unknown fence；正向路径 candidate / blocked / fail-closed |
| checkpoint persistence / transaction / commit-unknown 物理语义未闭合 | RuntimeCheckpoint stable、resume / recovery、RunStatus unknown 的实现承接风险 | 只允许 stable-point 对象和 explicit unknown / manual_review 分支；03 必须先收敛 persistence port 与事务证据边界 |
| model adapter owner / route / semantic result 未闭合 | ModelTurn 无法稳定从 submitted 进入 classified，主循环可能停在 blocked / waiting | Runtime 保持 provider-neutral intent / decision；adapter 只作 candidate / unavailable，不把 route / secret 写入 domain |
| durable memory owner / snapshot / freshness 未闭合 | ContextCompositionDecision、MemoryCandidate、WorkingContext 的正向候选可能不可用 | working-only 与 degraded / unavailable 是合法轮廓；不声明 durable body、index、retention 或 accepted write |
| Runtime-specific Core / Bus / Observability event / ref seam 未闭合 | 出站 event、safe material、projection 更新和审计接缝可能无法形成正式协议 | 只保留类别、owner、typed ref / event candidate；delivery / observed 失败形成 gap / stale |
| multi-local state sets 的传播组合复杂 | Run、Turn、Action、Checkpoint、Outcome、Handoff、Projection 近义状态可能被详细设计压平 | 维持单对象归属、局部状态机和禁止迁移清单；主语变更必须回退 02 |
| language / physical carrying 未选择 | 03 不能直接固定代码目录、完整签名、serialization 或 DB schema | 当前所有类型、接口和 flow 保持语言中立；语言决策不从旧 Python / Rust / SDK 继承 |
| forbidden body / secret / raw provider response 贯穿边界的泄漏风险 | Context、Model、Checkpoint、Event、View、Handoff 可能意外持有外部正文或 hidden reasoning | 对象与接口仅允许 ref / digest / safe summary / redacted marker；Step 10 场景保持 reject / blocked |
| local outcome 与 handoff / observed / acceptance 语义混淆 | 外部 delivery 或 downstream summary 可能反写 Runtime outcome，破坏 local truth first | `RuntimeOutcome`、`HandoffAttempt`、`HandoffGap`、Safe View 分层；acknowledged 不等于 completed |

## 2. 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `L2R-UP-001` Tools-Sandbox action mapping、receipt、feedback、cleanup 的正式 producer / source / correlation | Action API、feedback event、side-effect fence、recovery | `pending / blocked / fail-closed`；Runtime 不补定义 execution schema |
| `L2R-UP-002` safe material producer、source、route、observed / acceptance 接缝 | HandoffAttempt、HandoffGap、outbound event、Observability view | 只生成 body-free eligibility / candidate / gap；不声明 delivered / observed |
| `L2R-UP-003` Core tools schema 与 SDK client candidate 的 owner / shape | Core compile boundary、Action ports、downstream consumer | 只引用 Core category / typed ref；SDK 作为下游，不反向 package 依赖 |
| `L2R-UP-004` model adapter owner、route、secret、quota、cost 和 semantic result 合同 | ModelTurn、ClassifyModelResult、配置影响 | provider-neutral intent / decision；positive adapter blocked |
| `L2R-UP-005` durable memory owner、retrieval、snapshot、freshness、retention 和 deletion contract | MemoryCandidate、WorkingMemory、SourceSnapshot、Context composition | ref-only / working-only / unavailable；不声明 durable write |
| `L2R-UP-006` Runtime-specific Core / Bus / Observability schema、event family、source / route | Command metadata、EventEnvelope、Outbound Event、projection | 只固定接口类别和 owner；公共 schema / route pending |
| `L2R-UP-007` Sandbox / Observability implementation readiness 与 fake parity | Action / safe material positive qualification、测试与验收 | fake / design file 只作 seam input；positive readiness blocked |
| `L2R-UP-008` `L3-method-library/03-详细设计.md` 未提交输入及基线状态 | Goal / plan / context definition refs、03 承接 | 使用当前已读正式内容的 ref-only 边界；不伪造 commit / hash |
| `L2R-CP-001` checkpoint persistence source、transaction、version、atomicity、commit-unknown 语义 | RuntimeCheckpoint、RecoveryDecision、实施 / 测试 | stable-point semantics fixed；物理 contract `blocked` |
| `L2R-ENTRY-001` member / product entry 与 actor / scope 传递边界 | AcceptRuntimeTrigger、Query / downstream consumer | capability-level command / query candidate；不固定产品 API / lifecycle |
| `L2R-LANG-001` 实现语言、框架、物理承载 | 全部 03 / 04 / 07 | `not_selected`；不得从历史 Python、Core Rust 或 SDK 语言推断 |

## 3. 当前设计层未闭环项说明

当前概要设计已经闭合 Runtime 的本地主语、owner 边界、接口分类、主流程、局部状态机、异常姿态和配置红线，但没有把任何开放 seam 润色为正向实现合同。上述风险可以通过本轮的 candidate / blocked / fail-closed 结构继续进入详细设计；待确认事项只有在正式 upstream contract、物理承载或用户明确决策到位后才能转为正向 schema、配置激活、测试资格或实施 boundary。

## 4. 风险 / 待确认边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 风险与待确认分离 | pass | 风险列当前结构性影响和安全口径；待确认列尚未形成定论的问题 |
| 已承接稳定结论未重复变成待确认 | pass | 对象、接口、流、状态主语只在 Step 12 作为稳定输入 |
| 上游风险未被无差别搬运 | pass | 只列会改变 Runtime 概要成立性或后续正向资格的 seam |
| 当前挂起姿态具体 | pass | 使用 pending / blocked / waiting / degraded / fail-closed / not_selected |
| 未伪造证据或 readiness | pass | 无测试结果、artifact、report、evidence alias、签署或 verdict |

## 5. 回填草稿

第 13 章应装配设计风险表、待确认事项表和当前设计层未闭环项说明。正式正文只保留风险 / 待确认的概要影响与当前挂起口径，不复制详细讨论过程。

## 6. Step 13 自检与门禁

| 检查项 | 结果 |
|---|---|
| 设计风险表已输出且每项有影响与当前处理口径 | pass |
| 待确认事项表已输出且每项有影响范围与挂起口径 | pass |
| 没有混入项目 TODO、任务、排期或详细实现 | pass |
| 持续 blocker `L2R-UP-001~008`、checkpoint、entry、language 已保留 | pass |
| 风险 / 待确认不改变已收稳对象、接口、流程、状态主语 | pass |

**Step 13 结论：** `done`。允许进入 Step 14 正式概要设计装配；必须先更新文档 flow、项目执行台账并创建 Step 14 中间产物。正式 `02-概要设计.md` 仍不得装配，直到 Step 14 完成装配前检查。
