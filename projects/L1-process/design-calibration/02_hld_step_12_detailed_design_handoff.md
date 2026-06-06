# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

把概要设计 Step 4~Step 11 已经收稳的代码主体、主要组成部分、关键对象、接口、处理流、状态机、异常边界和配置影响显式交给详细设计,防止详细设计重新发明主语或暗改边界。

本步不写开发任务、测试用例全集、实施 commit、字段全集、协议 schema、repository trait、事务实现或配置项清单。

---

## 2. 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 10 个主要组成部分:`Process truth core`、`Runtime shape management`、`Profile adoption management`、`Process execution management`、`Gate coordination`、`Checkpoint and recovery`、`Process timing and rhythm`、`Process consumption and traceability`、`Derived maintenance and reconciliation`、`External context mirror support` | module / crate / file layout、application service 归属、对象边界和依赖方向 |
| 实现分层:Inbound / Operations、Application Services、Domain Model、Domain Policy、Ports、Persistence、Projection、Outbox、Handoff | handler、service、repository、port、adapter、publisher、consumer、job runner 和 runtime builder |
| 核心 truth / state 对象:`RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`、`DerivedProcessViewState`、`ReferenceResolutionState` | 完整字段、构造函数、成员函数、状态矩阵、错误和不变量 |
| policy / guard 对象:`ProcessTruthPolicy`、`ShapeDefinitionPolicy`、`ProfileTailoringPolicy`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`WaitingGatePolicy`、`RecoveryContinuityPolicy`、`ProcessRhythmPolicy`、`ReadVisibilityPolicy`、`DerivedProcessViewPolicy` | 正式函数签名、输入快照、校验结果、domain error 映射和测试断言 |
| projection / read model 对象:`ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ActivityStatusView`、`ReconciliationReport` | projection schema、query view schema、stale / degraded / rebuild 行为和报告结构 |
| reference / snapshot 对象:`MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`GovernanceDecisionRef`、`RuntimeFeedbackRef`、`ConversationContextRef`、`TraceHandoffRef` | 外部 ref 类型、snapshot schema、解析状态、刷新口径和失败 surface |
| audit / history / outbox 对象:`ProcessTraceRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord`、`ProfileChangeRecord`、`ActivityProgressionRecord`、`WaitingGateChangeRecord`、`RecoveryHistoryRecord` | trace / audit record schema、history record、outbox event mapping、publication state 和 handoff 状态 |
| Command API 骨架 | command DTO、result DTO、idempotency result、validation、authorization 和 error mapping |
| Query API 骨架 | query DTO、read consistency、authorization / visibility boundary、projection fallback 和 pagination |
| Inbound Event Consumer 骨架 | event envelope、source event id、dedup key、source mapping、consumer transaction、duplicate / out-of-order handling |
| Outbound Event 骨架 | event contract、truth-to-outbox mapping、publication result、downstream evidence 和 visibility marker |
| Operations Job 骨架 | job input / output、scheduler、retry、failure state、job receipt、evidence path 和 run metadata |
| Step 8 关键处理流 | application service orchestration、transaction boundary、repository calls、port calls、trace / audit / outbox formation |
| Step 9 状态集合和流转 | formal state enum、allowed / forbidden transition matrix、state propagation tests |
| Step 10 异常与边界场景 | error taxonomy、reject / conflict / pending / unresolved / stale / failed / retryable result shape、test matrix |
| Step 11 配置影响轮廓 | RuntimeConfig、ConfigLoader、ConfigValidator、adapter config、job config、policy parameter config、forbidden config validation |

Step 7 的接口名称、读写边界、metadata / idempotency 必备项和写入对象是概要层固定约束。详细设计负责展开字段全集、result schema、错误和幂等记录结构,不得静默改名、删除 command 或放松缺失 idempotency key 的拒绝规则。

Step 9 的状态集合和迁移方向是概要层固定约束。详细设计负责给出正式 enum 名称、完整 allowed / forbidden matrix、迁移错误和测试断言;若需要增删状态或改变迁移方向,必须回退概要设计。

Step 10 的异常落点是概要层固定约束。详细设计可以细化错误类型和 recovery path,但不能把 unresolved / stale / failed / retryable 伪装成成功 truth。

---

## 3. 详细设计继续展开方向

| 详细设计章节方向 | 必须承接的概要结论 |
|---|---|
| 对象契约 | Step 6 对象骨架和 Step 9 状态集合 |
| 模块 / crate / 文件结构 | Step 4 代码主体框架和 Step 5 主要组成部分 |
| application service | Step 7 Command / Query / Consumer / Job 骨架和 Step 8 处理流 |
| repository / port / adapter | Step 4 实现分层、Step 7 接口分类、Step 11 配置影响和架构依赖裁剪 |
| 事务与一致性 | Step 3 约束、Step 8 写路径、Step 9 传播关系、Step 10 异常落点 |
| event / outbox / handoff | Step 7 Outbound Event、Step 8 `PublishProcessOutbox` / handoff flow、Step 9 outbox / handoff state |
| projection / query | Step 6 projection 对象、Step 7 query、Step 8 projection rebuild、Step 9 derived state |
| inbound consumer | Step 7 consumer skeleton、Step 8 consumer flows、Step 10 duplicate / out-of-order / unsupported source handling |
| recovery / checkpoint | Step 6 checkpoint / recovery objects、Step 8 recovery flows、Step 9 recovery states、Step 10 recovery no-fork boundary |
| config | Step 11 配置影响表、禁止配置化边界和详细配置实现契约方向 |
| tests / acceptance trace | Step 9 禁止迁移、Step 10 异常表、需求 AC / VF 结论 |

---

## 4. 概要设计回退规则

如果详细设计发现以下情况,不得在 `03-详细设计.md` 中暗改,必须回退到概要设计对应 Step 修正:

| 发现的问题 | 回退位置 |
|---|---|
| 需要新增或删除主要组成部分 | Step 5 |
| 需要新增核心 truth 对象或删除 Step 6 对象 | Step 6 |
| 需要新增 Command / Query / Event / Consumer / Job 主入口 | Step 7 |
| 处理流需要改变同步 / 异步 / 后台分工 | Step 8 或 Step 3 |
| 状态集合或迁移方向和 Step 9 冲突 | Step 9 |
| 异常落点需要改变 truth / projection / reference / handoff 边界 | Step 10 |
| 配置需要改变 truth 归属、正文排除、状态机红线、recovery 不分叉或依赖类型 | Step 11 / 架构设计 |
| 需要吸收相邻仓正文或编译期依赖非 `L0-core` 仓 | 需求 / 架构重新校准 |
| 详细设计无法按 Step 7 的幂等、dedup、metadata 或 actor context 口径落码 | Step 7 / Step 10 |
| 详细设计发现 job、projection、reconciliation 或 handoff 必须反写业务 truth | Step 5 / Step 8 / Step 10 |

---

## 5. 不进入承接清单的内容

| 内容 | 处理口径 |
|---|---|
| 外围增强能力的完整实现,如完整 BPMN 表达力、嵌套过程、模板刚度、高级自动调度 | 进入风险 / 待确认或后续版本计划 |
| 完整 ES / CQRS / Graph-first 是否升级为主体范式 | 保留观察,不得在详细设计暗定 |
| 具体数据库、搜索、缓存、队列、对象存储、调度产品 | 由详细设计 / 配置设计 / 实施计划在约束内选择 |
| 具体性能容量数字和 SLO 阈值 | 由测试方案 / 验收标准 / 容量评估收敛 |
| Archive / Observability 完整交接协议 | 保留接缝,协议细节后续与对应仓收敛 |
| 具体配置项默认值、JSON / TOML 示例、环境变量名 | 留给 `04-配置设计.md` |
| 开发任务、排期、commit boundary 和测试脚本 | 留给实施计划和测试方案 |

---

## 6. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 概要内容和详细设计字段 / 机制混写 | 详细设计容易继承旧实现候选而非稳定主语 | 本步只交付已收稳的结构、对象、接口、流程和边界 |
| 没有回退规则 | 详细设计遇到冲突时可能暗改概要设计 | 明确主语变更必须回退概要对应 Step |
| 外围增强和核心闭环混在一起 | 详细设计可能把增强功能当核心必选 | 本步把增强能力排除出承接清单,进入风险 / 待确认 |
| 配置、测试、实施内容提前混入 | 会让概要设计承担不该承担的实现职责 | 明确配置项、测试脚本和 commit boundary 后移 |

---

## 7. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §12 “详细设计承接清单”摘录本文件 §2 和 §3。
- §12 必须保留 §4 的回退规则。
- §12 不写实施任务、测试用例全集、配置清单或 commit 边界。

---

## 8. 进入下一步条件

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计继续展开什么。
- 已明确主语变更必须回退概要设计,不得在详细设计暗改。
- 未新增未经 Step 4~Step 11 讨论的新对象、新接口、新流程或新状态。
- 可以进入 Step 13 “设计风险与待确认事项”。
