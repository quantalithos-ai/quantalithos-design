# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

点名 `L1-work` 必须在概要设计层先讲清楚的异常路径与边界场景,说明它们会如何影响主要组成部分、接口、处理流或状态机。

本步不写完整错误码表、重试参数、补偿脚本、恢复流程或数据库约束。

---

## 2. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 影响的处理流 / 状态 | 当前概要口径 |
|---|---|---|---|
| Command 缺少 idempotency key 或重复 key 冲突 | Command intake / application service | 所有 Command 写路径 | 缺失直接拒绝;重复同 digest 返回既有结果;冲突不得进入 truth 写路径 |
| Project 不存在、已 Closed / Archived 或不可维护 | `Project subject management` | `CreateWorkItem`、member、dependency、Iteration 流 | 返回拒绝或不可处理;不得创建孤儿 WorkItem / ProjectMember |
| ProjectMember 来源成员不可解析或不可承担 | `Project member responsibility` | `AssignProjectMember`、capacity 判断 | 保持 `Proposed` 或拒绝;不得补造 GlobalMember / role truth |
| FormalWorkIntent 不满足协作级边界 | `Formal work universe` | `CreateWorkItem`、`CreateChildWorkItem` | 拒绝进入 Backlog;不得把 personal checklist / runtime step 写成正式工作 |
| `SourceWorkRef` 未解析、来源不可接受或携带正文 | `Work decomposition / promote boundary` | `RequestWorkPromotion` | 保持 `PendingReview` / reject;只保存引用、摘要或解析状态 |
| conversation / runtime / artifact event 试图直接创建 WorkItem | Inbound Event Consumer | `ConsumeRuntimePromoteRequested` 等 | 只写 pending source / reference state,必须回到 promote command 边界 |
| 依赖两端不是正式工作或形成不可解释循环 | `Dependency / blocker coordination` | `LinkWorkDependency` | 拒绝或保持 `Proposed`;不得保存孤儿关系 |
| 阻塞解除或完成缺少可接受依据 | `Dependency / blocker coordination` / `CompletionEvidencePolicy` | `ResolveWorkBlocker`、completion 变更 | 保持 `Open` / `Mitigating` 或工作未完成;不得伪造 evidence |
| Iteration 候选不在 Backlog 正式全集 | `Iteration commitment` | `CommitIterationScope` | 拒绝候选集合或保持原承诺范围 |
| process timing 试图直接维护 Iteration | Inbound Event Consumer / Iteration boundary | `ConsumeProcessTimingChanged` | 只刷新 timing snapshot;不得迁移 Iteration state |
| Query 无权限、引用不可见或 projection stale | `Work consumption / trace` / `Derived consumption support` | `GetProjectBoardView`、`SearchWork`、truth query | 返回不可见、不可解析或 stale marker;不得触发 truth 写入 |
| Inbound event duplicate、乱序或来源不可识别 | Event intake / reference support | 所有 consumer | dedup 后忽略或挂起;写入 `ReferenceResolutionState::Failed` / `Unresolved` |
| 外部快照刷新失败 | `Local reference / snapshot / projection support` | reference refresh / policy 判断 | 保留旧快照并标记 `Stale` / `Failed`;不得复制外部正文补齐 |
| outbox 发布失败 | `Work truth core` / Operations | `PublishWorkOutbox` | `WorkOutboxRecord` 进入 `Failed`;已成立 truth 不回滚 |
| projection rebuild 失败或 truth/projection 漂移 | `Derived consumption support` | `RebuildWorkProjections`、query | 视图进入 `Failed` / `Stale`;对账报告暴露漂移,不修业务 truth |
| 高风险项目变化缺少治理或方法定义约束 | Project / member / promote / dependency policy | high-risk lifecycle、risk split、tool capability | 拒绝或挂起;不得由 Work 自行发明治理结论 |
| 关键变化无法生成 audit / trace | `Work truth core` | 所有核心写路径 | 写路径不得成功完成;可追溯性是核心成立条件 |

---

## 3. 异常影响图

```text
+====================== exception impact boundary ==================+
| command / event / job / query                                      |
|        |                                                           |
|        +-- boundary violation --> reject / pending / unresolved     |
|        |                                                           |
|        +-- core truth accepted --> audit + outbox + projection stale |
|        |                                                           |
|        +-- derived / reference failure --> stale / failed marker    |
|        |                                                           |
|        +-- publication / handoff failure --> pending / failed state |
+==================================================================+
```

关键说明:

- 核心 truth 未成立时不得写 outbox 表示成功事实。
- 外部来源异常只能产生 reject、pending、unresolved、stale 或 failed 状态,不能补造成 truth。
- 派生、发布和交接异常只影响消费与传播,不得回滚已成立 Work truth。
- 本图不表达错误码、重试参数、补偿脚本或恢复实现。

---

## 4. 异常与状态关系

| 异常类型 | 允许落点状态 | 不允许落点 |
|---|---|---|
| 核心 command 被拒绝 | command result rejected / existing result | 不允许产生新的 `Active` / `Formalized` / `Committed` truth |
| 来源不可解析 | `ReferenceResolutionState::Unresolved` / `Failed` | 不允许创建 WorkItem |
| 快照过期 | `ReferenceResolutionState::Stale` | 不允许修改上游 truth |
| projection 过期 | `DerivedWorkViewState::Stale` | 不允许反写 Work truth |
| outbox 失败 | `OutboxPublicationState::Failed` | 不允许回滚 Project / WorkItem / Iteration |
| 对账漂移 | `ReconciliationReport` abnormal result | 不允许自动修正业务 truth |

---

## 5. 不在本步展开的内容

| 内容 | 后续归属 |
|---|---|
| 具体错误码、错误枚举和 message 文案 | `03-详细设计.md` / `05-测试方案.md` |
| 重试次数、退避、consumer group、dead letter | 详细设计 / 配置设计 |
| repository 级唯一约束、事务隔离、锁策略 | 详细设计 |
| 具体补偿脚本或恢复 job | 详细设计 / 实施计划 |
| 安全鉴权实现和权限矩阵 | 详细设计 / 相邻 identity / governance 设计 |

---

## 6. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §10 “异常与边界场景”引用本文件 §2 的异常场景表。
- §10 摘录 §3 的异常影响图和 §4 的异常 / 状态关系表。
- §10 明确错误码、重试、事务和恢复实现后移详细设计。

---

## 7. 进入下一步条件

- 已点名会打穿 Work truth 边界的异常路径。
- 已说明异常如何影响处理流、状态机和跨部分协作。
- 已区分核心 truth 异常、外部引用异常、派生异常、outbox / handoff 异常。
- 未展开完整错误码、重试参数或补偿实现。
- 可以进入 Step 11 “配置影响轮廓”。
