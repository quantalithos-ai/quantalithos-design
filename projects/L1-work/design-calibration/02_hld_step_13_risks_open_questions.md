# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

显式收纳当前概要设计层仍需后续收敛的设计风险和待确认事项,避免它们在 Step 14 正式文档整理时被误写成已定结论,也避免详细设计暗改概要主语。

本步不写项目 backlog、TODO 清单、实施方案、排期或具体开发任务。

---

## 2. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| ImplementationPlan / PlanItem 与 ChildWorkItem 在详细设计中再次混写 | `Formal work universe`、promote、WorkItem 状态机 | 概要已固定 Work 只拥有 promote 后正式结果和来源引用;详细设计若需改口径必须回退 Step 6 / Step 8 |
| ProjectMember 与 GlobalMember 生命周期被合并 | member responsibility、authorization、identity 边界 | ProjectMember 只表达项目内承担;identity truth 只以引用 / snapshot 进入 |
| Inbound event 被实现成直接写真相 | event consumer、promote、Iteration、reference support | Step 7 / Step 8 明确 consumer 只能写 snapshot / pending input;正式 truth 写入走 Command |
| Projection / board / report 被当成第二 truth | derived support、query、reconciliation | Step 9 / Step 10 已固定 stale / failed / report 只影响消费解释,不得反写核心 |
| 概要状态被误读为可随意改动的候选 | Step 9、详细对象契约、测试断言 | Step 9 状态集合和迁移方向是概要层正式约束;详细设计只展开 enum 名称、错误和完整矩阵,若需增删状态必须回退概要 |
| 高风险项目变化、风险拆分、promote 的治理 / 方法前置不够具体 | lifecycle、promote、dependency、member capability | 概要只固定不得绕过正式约束;具体来源和字段交给详细设计与相邻仓契约 |
| 外部 evidence / source / method / process ref 类型与相邻仓正式契约不匹配 | `SourceWorkRef`、`ExternalEvidenceRef`、snapshot、port / adapter | 详细设计必须逐一对齐相邻仓 contracts;概要字段骨架是最小语义约束,不能自行发明不可追溯 ref 或降级为裸字符串 |
| 配置层绕过依赖纪律或边界行为 | config、adapter、runtime builder | Step 11 禁止配置改变 truth 归属、promote、派生不反写和编译期依赖类型 |
| Outbox / handoff 可靠性被理解为同步成功条件 | command result、outbox state、archive / observability | 同步成功只表示 truth 成立;传播和交接用独立状态表达 |
| 外围增强被误升为核心闭环前置 | advanced board、capacity、auto unblock、cross-project dependency | 当前作为外围增强或演进项,不得阻塞核心概要通过 |

---

## 3. 待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| Command / Query / Event DTO 字段全集和 result schema | contracts、API、tests | Step 7 固定接口名称、读写边界、metadata / idempotency 必备项和写入对象;详细设计定义字段全集和结果 schema |
| repository / port / adapter trait 函数签名 | application / infra boundary | Step 4 / Step 7 已点名主体;详细设计展开函数和事务 |
| state enum 最终命名、完整状态矩阵和迁移错误 | domain、tests、acceptance | Step 9 固定状态集合和迁移方向;详细设计定正式 enum 名称、错误和完整 allowed / forbidden matrix |
| `SourceWorkRef`、`ExternalEvidenceRef`、`MethodDefinitionSnapshot` 的正式字段 | promote、completion、dependency、snapshot | 详细设计必须在概要字段骨架基础上对齐相邻仓契约,不可删除摘要 / 验证 / 解析状态语义,不可保存正文 |
| outbox event schema、topic / routing / publication evidence | event collaboration、bus adapter | 概要只定 outbound event 骨架和 state;详细设计定事件契约 |
| archive / observability handoff 协议 | trace / handoff / operations | 当前只保留交接接缝;后续与对应仓设计收敛 |
| storage、projection、search、cache、queue 产品和索引策略 | infra、config、test | 当前不选产品;详细设计和配置设计在约束内选择 |
| idempotency / dedup record schema 和保留策略 | Command、Consumer、Operations | Step 7 / Step 10 定边界;详细设计和配置设计定实现 |
| query authorization / visibility 的具体裁决来源 | query、security、identity / governance | 已由详细设计收口:`ActorMemberResolverPort` 解析 actor -> `GlobalMemberRef`;`ProjectMemberRepository.get_by_member` + `Active` / `Paused` responsibility 判定 project scope 可见;scope unresolved / unauthorized -> `NotVisible` |
| 性能 / 容量目标是否升级为正式验收数值 | tests、acceptance、capacity | 当前只保留结构性口径;测试方案和验收标准基于证据收敛 |
| 外围增强能力进入哪个版本主线 | advanced board、capacity、auto maintenance、cross-project | 当前不阻塞核心闭环;实施计划或后续版本再定 |

---

## 4. 当前设计层未闭环项说明

| 未闭环项 | 是否阻塞 Step 14 | 原因 |
|---|---|---|
| DTO / trait / state matrix 详细契约 | 不阻塞 | 概要已给主语和边界,详细设计职责是继续展开 |
| 相邻仓具体 ref 字段 | 不阻塞 | 概要固定引用 / 快照原则,详细设计需按 contracts 对齐 |
| 存储 / 搜索 / 队列产品 | 不阻塞 | 概要禁止产品反向定义 truth,具体选型后移 |
| archive / observability 交接协议 | 不阻塞 | 本仓只需保留交接接缝和状态,完整协议由对应仓协作 |
| 高风险治理前置细节 | 有条件风险 | 若详细设计需要落高风险路径,必须先和 governance / method-library 对齐 |
| 外围增强版本范围 | 不阻塞 | 不属于当前核心闭环成立条件 |

---

## 5. 不应包装成设计风险的内容

| 内容 | 处理口径 |
|---|---|
| “还没写代码” | 不是设计风险,属于实施阶段 |
| “还没选数据库 / 队列产品” | 当前是有意后移,只在反向定义 truth 时变成风险 |
| “图不够细” | 只有影响对象、接口、状态或边界时才是设计风险 |
| “外围增强暂不做” | 已明确为非核心闭环,不是当前概要风险 |
| “具体错误码未列出” | 属于详细设计,不是概要未闭环 |

---

## 6. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §13 “设计风险与待确认事项”摘录本文件 §2、§3 和 §4。
- §13 必须区分风险与待确认事项,不能混写。
- §13 不写实施任务、排期或 TODO。

---

## 7. 进入下一步条件

- 已明确概要设计层风险和待确认事项。
- 已说明未闭环项是否阻塞正式概要设计整理。
- 已避免把任务层事项、上游风险或实现优化包装成概要设计风险。
- 可以进入 Step 14 “整理正式概要设计文档”。
