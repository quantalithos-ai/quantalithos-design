# L5-sync 架构 Step 8 · 数据所有权与一致性策略

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 8 |
| 输入 | Step 3 职责、Step 5 上下文、Step 7 依赖方向、正式 00 §11 |
| 回填章节 | 正式 01 §9 |
| 下一步 | Step 9：关键交互与通信方式 |

## 2. Step 内计划

- [x] 逐项回答本仓 truth、snapshot/projection/reference、forbidden body/write。
- [x] 按五个架构单元建立数据所有权与一致性口径。
- [x] 诊断历史材料中的双真相、Git/Workspace/Artifact 混层和 ACK 升格问题。
- [x] 形成数据归属、一致性、失败挂起和简化关系图。
- [x] 逐单元停审并完成跨数据边界审计。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| Step 3 | 本仓做/不做与 owner 红线 |
| Step 5 | 五个上下文、External Owner References、统一语言 |
| Step 7 | core/ports/adapters 与跨仓依赖裁剪 |
| 正式 00 §11 | local truth、snapshot/ref、forbidden body 的需求分类 |
| 上游正式 01 | Project/Artifact/Workspace/Governance/Archive ownership |

## 4. SOP 问题回答

### 4.1 哪些数据由本仓拥有真相？

本仓拥有 local sync session 与 command execution state、working-copy binding/metadata generation、local applied cursor、path/source mapping、conflict record、checkpoint/recovery attempt、handoff attempt/transport/probe association、provenance relation 和 bounded diagnostic history。它们只解释本地同步操作，不代表平台业务对象状态。

### 4.2 哪些只是 snapshot、projection 或 reference？

principal/project/access/posture、Artifact/Workspace source/version/watermark、Review Gate/decision、Archive posture、SDK compatibility 和 Git HEAD/branch/remote 都是外部 snapshot/ref/observation；必须携带来源与 freshness/observed-at 语义，不能由本地状态反写。

### 4.3 哪些正文与写入明确禁止？

禁止将 Project/Artifact/Baseline/Workspace/Review/Archive 正文或 owner record、credential/secret/token/private key、raw evidence/report/log、完整 provider response、Git remote truth 复制为 Sync truth。禁止通过 local projection/cache/metadata 反写或纠正外部 owner；禁止静默删除、伪造、补造 provenance 或冲突依据。

### 4.4 哪些关系需要强一致？

在一次本地 state transition / checkpoint 边界内，session phase、binding generation、applied cursor、mapping、conflict/checkpoint/provenance 之间必须一致；写入失败不能呈现部分推进的 local success。候选冻结与其 source/binding/checkpoint/provenance 必须一致，才可准备 handoff。

### 4.5 哪些可以最终一致？

外部 owner snapshots、Review decision、Archive posture、SDK compatibility 和 Git remote observation 可最终一致，但必须显式标记 stale/pending/unknown/unsupported。最终一致不授权危险动作；变更操作前仍需按 owner 合同重新验证。

### 4.6 失败时如何补偿或挂起？

本地持久化未原子完成则不推进 applied cursor；source gap/comparator/mapping 不明则挂起 materialization；Git/fs apply outcome 不明则恢复或人工审查，不能重放覆盖；handoff call unknown 先 probe；外部 decision 未得出时只显示 pending/unknown，不修改本地候选为 accepted。

## 5. 当前文档问题诊断

| 历史口径 | 问题 | 当前纠正 |
|---|---|---|
| “Local Git state 本地强一致” | Git 是外部本地系统，Sync 只能观察，不拥有其全部 truth | 分类为 observation snapshot；Sync 拥有 observation/correlation 记录 |
| “SyncMetadata 本地强一致”但未拆 generation/cursor/conflict | 容易用单文件写入掩盖部分状态 | 强一致对象改为 local transition/checkpoint 语义，布局后置 |
| “Review submission truth”归 Governance/Platform但本地又拥有 submission | attempt 与 decision 混层 | 本地只拥有 handoff attempt/ref/transport/probe association |
| Artifact code truth 与 Workspace source 未区分 | source owner 未闭合 | owner-neutral source ref/snapshot，保持 `SYNC-UP-002` |
| ACK/remote object 被当 success | 结果层混淆 | transport/decision 分层，ACK 不改变 Review truth |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. `.qs-sync` 单文件作为所有本地 truth | 不采用 | 布局与原子性尚未闭合，且易把 Git/owner snapshot 混入。 |
| B. 以语义 owner 分类，local transition 强一致，外部 snapshots 最终一致 | 采用 | 保护单一 truth，又支持断点恢复和离线状态展示。 |
| C. 用 Git commit/remote ref 代替 Sync metadata | 不采用 | 无法承载选择、source cursor、conflict、handoff 和 provenance 分层。 |

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据类别 | 类型 | 所有权/口径 | 边界 |
|---|---|---|---|
| sync session / operation phase | 正式 local truth | L5-sync | 不等于 Project/Review lifecycle |
| working-copy binding / metadata generation | 正式 local truth | L5-sync | 只描述 local target 与 source relation |
| local applied cursor / mapping | 正式 local truth | L5-sync | 不等于 platform latest 或 Git HEAD |
| conflict / checkpoint / recovery attempt | 正式 local truth | L5-sync | 不自动裁决或证明外部成功 |
| handoff attempt / transport / probe association | 正式 local truth | L5-sync | 不等于 Gate/Decision/accepted |
| provenance relation / diagnostic history | 正式 local truth | L5-sync | bounded/redacted，不等于 formal evidence |
| principal/project/access/posture | snapshot/reference | 外部 owner | source/freshness required；不得 default allow |
| Artifact/Workspace source/version/watermark | snapshot/reference | Artifact/Workspace owner | source priority/comparator pending |
| Review Gate/Decision | reference/snapshot | Governance | read only；ACK 不改 decision |
| Archive posture/package ref | reference/snapshot | Archive | 不复制 package/recovery body |
| Git HEAD/branch/index/worktree/remote | observation/reference | Git/local user/remote owner | Sync 只保存受限 observation |
| owner bodies/credentials/raw evidence/report/log | forbidden body | 外部 owner/secret systems | 不保存、不输出、不由 metadata 承载 |

### 7.2 按架构单元组织的数据所有权表

| 单元 | 本仓 truth | snapshot/projection | reference | forbidden body/write |
|---|---|---|---|---|
| Selection & Access | selection context、check attempt/outcome association | access/project posture snapshot | principal/project/source/action refs | identity/permission policy body；本地授权写入 |
| Working Copy & Metadata | binding、generation、cursor、mapping、metadata integrity state | Git/fs observation | source/target/tool refs | Workspace projection body、remote truth、secret |
| Source Materialization | materialization attempt、applied range/result | source manifest/delta snapshot | source/version/comparator refs | Artifact/Workspace body as truth；owner writes |
| Conflict & Recovery | conflict/checkpoint/recovery/probe association | local observation at conflict | source/path/operation refs | automatic conflict decision；unknown replay |
| Review Handoff & Provenance | frozen-candidate relation、handoff attempt/transport/probe/provenance | decision snapshot | Gate/Decision/Artifact refs | decision mutation、evidence/report body、accepted fabrication |

### 7.3 一致性策略表

| 场景 | 一致性口径 | 失败处理 | 说明 |
|---|---|---|---|
| binding generation 与 metadata integrity | local transition strong consistency | 不切换 generation；保留可恢复旧状态或 blocked | 不锁具体存储实现 |
| apply result 与 local applied cursor | local atomic visibility | apply/record 任一不确定则 cursor 不宣称推进，进入 recovery | 防止 cursor 超前掩盖损坏 |
| conflict 与 checkpoint/provenance | local strong association | 缺依据时 blocked/manual-review | 冲突不能只剩错误字符串 |
| frozen candidate 与 source/binding | freeze-bound consistency | source drift/dirty/generation change 则候选失效 | handoff 前重新验证 |
| owner snapshot 与 local operation | final consistency + pre-effect revalidation | stale/unknown 时不执行危险副作用 | cache 仅用于显示，不授权 |
| handoff attempt 与 Review decision | eventual, explicitly layered | ACK/timeout 只更新 transport/probe，decision 保持 pending/unknown | 不以 HTTP 成功代替 accepted |
| Archive posture 与 local state | eventual + revocation priority | archived/revoked 新状态使写入路径 blocked | local cache 不覆盖 owner posture |
| duplicate/reconnect/retry | idempotent local correlation | 等价未证明则 probe/manual-review | 不盲目重放外部副作用 |

### 7.4 简化关系示意图

```text
 external owner truth                  local L5-sync truth
 +--------------------+              +-------------------------+
 | project/source/    | --ref/snap-->| session/binding/cursor  |
 | review/archive     |              | mapping/conflict/checkpt|
 +--------------------+              | handoff/provenance      |
                                     +------------+------------+
                                                  |
                                                  | observe/apply only
                                                  v
                                     +------------+------------+
                                     | Git/filesystem working  |
                                     | copy observations       |
                                     +-------------------------+

 forbidden: external body/secret/evidence/report -> local truth
 forbidden: local truth/cache -> external owner write/decision
```

图示说明：

1. 外部 owner 只以 ref/snapshot 进入，不将正文或真相复制给 Sync。
2. Local truth 解释同步操作，并通过受限 seam 观察/应用 working copy。
3. 两个禁止方向同时防止外部正文入仓和本地状态反写 owner。

### 7.5 数据所有权停审记录

| 单元 | truth 唯一 | snapshot/ref 清楚 | forbidden 清楚 | 一致性清楚 | 结论 |
|---|---|---|---|---|---|
| Selection & Access | 是 | 是 | 是 | 是 | pass_with_owner_surface_pending |
| Working Copy & Metadata | 是 | 是 | 是 | 是 | pass_with_schema_pending |
| Source Materialization | 是 | 是 | 是 | 是 | pass_with_comparator_pending |
| Conflict & Recovery | 是 | 是 | 是 | 是 | pass_with_recovery_contract_pending |
| Review Handoff & Provenance | 是 | 是 | 是 | 是 | pass_with_handoff_contract_pending |

### 7.6 跨数据边界审计

| 审计项 | 结果 |
|---|---|
| 双真相 | 无；外部 owner 与 local operation truth 分层 |
| 投影反写 | 禁止；snapshot/cache 不授权 owner mutation |
| 引用正文入仓 | 禁止；仅 safe ref/bounded snapshot |
| 强/最终一致误用 | 已区分 local transition strong 与 external eventual |
| Git/Workspace/Artifact 混层 | 已分离 observation、projection、source truth |
| ACK/decision 混层 | 已分离 attempt/transport/probe/decision |

## 8. 回填草稿

正式 §9 回填数据归属、版本/游标角色、一致性策略、关系图和失败边界；停审/审计留在本文件。不得写具体 metadata 字段、表结构、DDL 或缓存实现。

## 9. 待确认事项

- `.qs-sync` schema/generation/migration/retention：`SYNC-UP-006`。
- source manifest/delta/cursor/comparator/mapping：`SYNC-UP-002/008`。
- Git observation/apply outcome 与 path protection：`SYNC-UP-007/010`。
- handoff idempotency/probe/decision ref：`SYNC-UP-004/005`。

## 10. 自检与进入下一步条件

- [x] truth、snapshot/projection、reference、forbidden body/write 已区分。
- [x] 五个单元逐一完成数据所有权停审。
- [x] 跨数据边界无双真相、投影反写或 ACK 升格冲突。
- [x] 未下沉字段、表、schema 或事务脚本。

`gate_status = pass_with_upstream_blockers`；可进入 Step 9。
