# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

显式收纳当前概要设计层仍需后续收敛的设计风险和待确认事项,避免它们在 Step 14 正式文档整理时被误写成已定结论,也避免详细设计暗改概要主语。

本步不写项目 backlog、TODO 清单、实施方案、排期、字段 schema、协议契约或具体开发任务。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 汇总概要设计已收稳结论和仍需挂起的问题 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 承接需求层风险、待确认和后续阻塞口径 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 承接架构层风险、待确认和阻塞性判断 |
| `01_arch_step_15_adr_traceability.md` | 已完成 | 承接长期 ADR 红线和追溯口径 |

---

## 3. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| RuntimeProcessShape 与 method-library definition body 在详细设计中再次混写 | `Runtime shape management`、对象契约、source adapter、shape sync flow | 概要已固定 Process 只拥有 runtime shape / index 语境;method definition 正文只能通过 ref / snapshot / source version 进入 |
| ProcessProfile 被实现成 Project 或 method profile 的复制体 | `Profile adoption management`、Work / method-library 边界 | profile 只表达项目采用过程语境,不拥有 Project truth 或 method-library profile definition truth |
| ProcessInstance / Activity / Token / Gateway 与 WorkItem / Iteration / runtime step 混写 | `Process execution management`、状态机、outbound event、query view | 概要已固定它们只表达过程运行事实、节点和流控位置;不得成为 Work 或 Runtime truth |
| WaitingGate 被实现成 governance Gate / Policy / decision truth | `Gate coordination`、consumer、resume flow、状态机 | waiting gate 只表达等待意图、暂停语境和恢复依据引用;decision truth 归 governance |
| Runtime feedback event 直接完成 Activity | runtime consumer、Activity 状态机、feedback command | consumer 只能写 pending / unresolved marker;正式绑定和完成必须经过 `RecordActivityFeedback` 与 policy |
| checkpoint / recovery 产生第二份 Process truth | `Checkpoint and recovery`、recovery maintenance、archive handoff | 概要已固定 recovery 必须沿同一 ProcessInstance 连续;不得创建平行实例或覆盖 checkpoint truth |
| projection / timeline / summary / reconciliation 反写真相 | Derived maintenance、query、job、异常落点 | 派生和维护只能暴露 stale / failed / report,不得推进、暂停、恢复或完成业务 truth |
| outbox / handoff 可靠性被理解为同步成功条件 | command result、outbox state、trace handoff、archive handoff | 同步成功只表示 Process truth 成立;发布和交接用独立 pending / failed / retryable 状态表达 |
| 外部正文通过 snapshot、ref、trace、report 或 handoff 入仓 | 数据归属、对象契约、storage adapter、query result | 所有外部材料只能以 ref / snapshot / summary / marker 承接;正文入仓命中回退条件 |
| 非 `L0-core` sibling 仓进入编译期依赖 | crate / module 设计、ports、adapter wiring | 概要和架构均固定非 core sibling 只能通过运行期接缝、事件、ref、snapshot 或 handoff 协作 |
| 配置层绕过状态机红线或 truth 边界 | config、runtime builder、job runner | Step 11 已列禁止配置化边界;配置只能注入参数,不得重定义 invariant |
| 完整 BPMN、嵌套过程、模板刚度或自动调度误升为当前核心主线 | 详细设计范围、实施计划、测试范围 | 当前作为外围增强或演进触发项;不得阻塞 C-1~C-5 核心闭环 |
| 后续 Agent 因 DTO / VO / state matrix 未定而自行补字段 | `03-详细设计.md`、contracts、tests、实现可落码性 | 当前明确这些属于详细设计正式真相源;未闭合前不得进入实现或临时补 schema |

---

## 4. 待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| Command / Query / Event / Job DTO 字段全集和 result schema | contracts、API、tests | Step 7 固定接口名称、读写边界、metadata / idempotency 必备项和写入对象;详细设计定义字段全集和 result surface |
| repository / port / adapter trait 函数签名 | application / infra boundary | Step 4 / Step 7 已点名主体;详细设计展开函数签名、事务参数和 adapter contract |
| state enum 最终命名、完整状态矩阵和迁移错误 | domain、tests、acceptance | Step 9 固定状态集合和迁移方向;详细设计定正式 enum 名称、错误和完整 allowed / forbidden matrix |
| marker schema:`pending`、`failed`、`retryable`、`stale`、`unresolved`、`invalid`、`unavailable` | public contract、query result、consumer receipt、fixtures | 概要只固定语义和落点;字段级 schema 必须在详细设计闭合 |
| ProcessTruthRef、TraceHandoffRef、外部 ref / snapshot 字段级 schema | outbox、handoff、projection、external mirror | 详细设计必须按相邻仓 contracts 对齐,不可降级为裸字符串,不可保存正文 |
| checkpoint / recovery evidence、retention、handoff 证据承载 | domain、jobs、observability / archive seam | 当前只固定同一实例连续性和正文排除;证据字段、保留和 handoff 协议后移详细设计 |
| outbox event schema、routing、publication evidence | event collaboration、bus adapter、publisher tests | 概要只定 outbound event 骨架和 outbox state;详细设计定事件契约 |
| archive / observability handoff 协议 | trace / handoff / operations | 当前只保留交接接缝;后续与对应仓设计收敛 |
| query authorization / visibility 的具体裁决来源 | query、security、identity / conversation / governance | 概要固定 ActorContext、project context 和 visibility boundary;详细设计定裁决机制 |
| storage、projection、search、cache、queue 产品和索引策略 | infra、config、test | 当前不选产品;详细设计和配置设计在约束内选择 |
| 性能 / 容量目标是否升级为正式验收数值 | tests、acceptance、capacity | 当前只保留结构性口径和候选目标;测试方案和验收标准基于证据收敛 |
| 外围增强能力进入哪个版本主线 | BPMN、复杂网关、嵌套过程、模板刚度、自动调度 | 当前不阻塞核心闭环;实施计划或后续版本再定 |

---

## 5. 当前设计层未闭环项说明

| 未闭环项 | 是否阻塞 Step 14 | 原因 |
|---|---|---|
| DTO / trait / state matrix 详细契约 | 不阻塞 | 概要已给主语和边界,详细设计职责是继续展开 |
| marker / receipt / error 字段级 schema | 不阻塞 | 概要固定语义落点,详细设计必须形成可落码真相源 |
| 相邻仓具体 ref 字段 | 不阻塞 | 概要固定引用 / 快照原则,详细设计需按 contracts 对齐 |
| 存储 / 搜索 / 队列产品 | 不阻塞 | 概要禁止产品反向定义 truth,具体选型后移 |
| archive / observability 交接协议 | 不阻塞 | 本仓只需保留交接接缝和状态,完整协议由对应仓协作 |
| 高风险治理前置细节 | 有条件风险 | 若详细设计需要落高风险 tailoring / gate 变更,必须先和 governance / method-library 对齐 |
| 外围增强版本范围 | 不阻塞 | 不属于当前核心闭环成立条件 |

---

## 6. 不应包装成设计风险的内容

| 内容 | 处理口径 |
|---|---|
| “还没写代码” | 不是设计风险,属于实施阶段 |
| “还没选数据库 / 队列产品” | 当前是有意后移,只在反向定义 truth 时变成风险 |
| “图不够细” | 只有影响对象、接口、状态或边界时才是设计风险 |
| “外围增强暂不做” | 已明确为非核心闭环,不是当前概要风险 |
| “具体错误码未列出” | 属于详细设计,不是概要未闭环 |
| “配置项默认值未列出” | 属于配置设计,不是概要未闭环 |

---

## 7. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §13 “设计风险与待确认事项”摘录本文件 §3、§4 和 §5。
- §13 必须区分风险与待确认事项,不能混写。
- §13 不写实施任务、排期、TODO、测试脚本或具体配置项。

---

## 8. 进入下一步条件

- 已明确概要设计层风险和待确认事项。
- 已说明未闭环项是否阻塞正式概要设计整理。
- 已避免把任务层事项、上游风险或实现优化包装成概要设计风险。
- 可以进入 Step 14 “整理正式概要设计文档”。
