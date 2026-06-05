# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

把概要设计 Step 4~Step 11 已经收稳的代码主体、主要组成部分、关键对象、接口、处理流、状态机、异常边界和配置影响显式交给详细设计,防止详细设计重新发明主语或暗改边界。

本步不写开发任务、测试用例全集、实施 commit、字段全集、协议 schema、repository trait 或事务实现。

---

## 2. 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 10 个主要组成部分:`Work truth core`、project、member、formal work、promote、dependency / blocker、iteration、consumption / trace、derived support、local reference support | module / crate / file layout、application service 归属、对象边界和依赖方向 |
| 实现分层:Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection、Outbox | 具体 handler、service、repository、port、adapter、worker 和 runtime builder |
| 核心 truth 对象:`Project`、`ProjectMember`、`Backlog`、`WorkItem`、`ChildWorkItem`、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、`PromoteResult` | 完整字段、构造函数、成员函数、状态矩阵、错误和不变量 |
| policy / guard 对象 | 正式函数签名、输入快照、校验结果、domain error 映射 |
| projection / read model 对象 | projection schema、stale / rebuild 行为、query result DTO |
| reference / snapshot 对象 | 外部 ref 类型、snapshot schema、刷新口径、解析失败状态 |
| audit / history / outbox 对象 | audit record、trace record、outbox event schema、publication state、handoff 状态 |
| Command API 骨架 | 正式 command DTO、result DTO、idempotency result、validation 和 error code |
| Query API 骨架 | query DTO、read consistency、authorization boundary、projection fallback |
| Inbound Event Consumer 骨架 | event envelope、event id、dedup key、source mapping、consumer transaction |
| Outbound Event 骨架 | event contract、outbox mapping、publication result、downstream evidence |
| Operations Job 骨架 | job input / output、scheduler、retry、failure state、evidence path |
| Step 8 关键处理流 | application service orchestration、transaction boundary、repository calls、outbox / trace formation |
| Step 9 状态集合和流转 | formal state enum、allowed / forbidden transition matrix、state propagation tests |
| Step 10 异常与边界场景 | error taxonomy、reject / pending / stale / failed result shape、test matrix |
| Step 11 配置影响轮廓 | RuntimeConfig、ConfigLoader、ConfigValidator、adapter config、job config、forbidden config validation |

Step 7 的接口名称、读写边界、metadata / idempotency 必备项和写入对象是概要层固定约束。详细设计负责展开字段全集、result schema、错误和幂等记录结构,不得静默改名、删除 command 或放松缺失 idempotency key 的拒绝规则。

Step 9 的状态集合和迁移方向是概要层固定约束。详细设计负责给出正式 enum 名称、完整 allowed / forbidden matrix、迁移错误和测试断言;若需要增删状态或改变迁移方向,必须回退概要设计。

---

## 3. 详细设计继续展开方向

| 详细设计章节方向 | 必须承接的概要结论 |
|---|---|
| 对象契约 | Step 6 对象骨架和 Step 9 状态集合 |
| 模块 / crate / 文件结构 | Step 4 代码主体框架和 Step 5 主要组成部分 |
| application service | Step 7 Command / Query / Consumer / Job 骨架和 Step 8 处理流 |
| repository / port / adapter | Step 7 接口分类、Step 11 配置影响和架构依赖裁剪 |
| 事务与一致性 | Step 3 约束、Step 8 写路径、Step 9 传播关系、Step 10 异常落点 |
| event / outbox | Step 7 Outbound Event、Step 8 `PublishWorkOutbox`、Step 9 outbox state |
| projection / query | Step 6 projection 对象、Step 7 query、Step 8 projection rebuild、Step 9 derived state |
| config | Step 11 配置影响表和禁止配置化边界 |
| tests / acceptance trace | Step 10 异常表、Step 9 禁止迁移、需求 AC / VF 结论 |

---

## 4. 概要设计回退规则

如果详细设计发现以下情况,不得在 `03-详细设计.md` 中暗改,必须回退到概要设计对应 Step 修正:

| 发现的问题 | 回退位置 |
|---|---|
| 需要新增或删除主要组成部分 | Step 5 |
| 需要新增核心 truth 对象或删除 Step 6 对象 | Step 6 |
| 需要新增 Command / Query / Event / Job 主入口 | Step 7 |
| 处理流需要改变同步 / 异步 / 后台分工 | Step 8 或 Step 3 |
| 状态集合或迁移方向和 Step 9 冲突 | Step 9 |
| 异常落点需要改变 truth / projection / reference 边界 | Step 10 |
| 配置需要改变 truth 归属、promote、派生不反写或依赖类型 | Step 11 / 架构设计 |
| 需要吸收相邻仓正文或编译期依赖非 `L0-core` 仓 | 需求 / 架构重新校准 |

---

## 5. 不进入承接清单的内容

| 内容 | 处理口径 |
|---|---|
| 外围增强能力的完整实现 | 进入风险 / 待确认或后续版本计划 |
| 完整 ES / CQRS / Graph-first 是否升级为主体范式 | 保留观察,不得在详细设计暗定 |
| 具体数据库、搜索、缓存、队列产品 | 由详细设计 / 配置设计 / 实施计划在约束内选择 |
| 具体性能容量数字 | 由测试方案 / 验收标准 / 容量评估收敛 |
| Archive / Observability 完整交接协议 | 保留接缝,协议细节后续与对应仓收敛 |

---

## 6. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §12 “详细设计承接清单”摘录本文件 §2 和 §3。
- §12 必须保留 §4 的回退规则。
- §12 不写实施任务、测试用例全集或 commit 边界。

---

## 7. 进入下一步条件

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计继续展开什么。
- 已明确主语变更必须回退概要设计,不得在详细设计暗改。
- 未新增未经 Step 4~Step 11 讨论的新对象、新接口、新流程或新状态。
- 可以进入 Step 13 “设计风险与待确认事项”。
