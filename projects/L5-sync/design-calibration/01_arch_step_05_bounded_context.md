# L5-sync 架构 Step 5 · 限界上下文与子域划分

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 5 |
| 输入 | Step 3 职责边界、Step 4 系统上下文、正式 00 数据归属 |
| 回填章节 | 正式 01 §6 |
| 下一步 | Step 6：容器 / 部署架构 |

## 2. Step 内计划

- [x] 识别核心子域、支撑子域与本地 snapshot/projection/reference 层。
- [x] 对每个上下文分别收敛职责、非职责、统一语言和影子结构边界。
- [x] 输出上下文关系图并附图示说明。
- [x] 逐上下文停审：分类、职责、系统边界、实现泄漏。
- [x] 审计职责重叠、投影误作真相和术语冲突。

## 3. 本步输入

| 输入 | 承接 |
|---|---|
| Step 3 | 五个候选架构单元及做/不做边界 |
| Step 4 | 外部 owner、本地 Git/filesystem、handoff 与姿态边界 |
| 正式 00 §7、§11 | 能力闭环和 local truth/snapshot/ref/forbidden body 分类 |
| `L1-workspace` 正式 01 | local working copy 不等于 Workspace projection |
| `L1-artifact` / `L1-governance` / `L4-archive` | source、review、archive owner 边界 |

## 4. SOP 问题回答

### 4.1 本仓内部有哪些子域或本地上下文？

划分为五个上下文：Selection & Access、Working Copy & Metadata、Source Materialization、Conflict & Recovery、Review Handoff & Provenance。另有外部 owner reference layer，保存必要的 source/project/review/archive/Git refs 与有限 snapshots，不是业务子域。

### 4.2 哪些是核心子域？

核心是 `Controlled Synchronization`，由 Working Copy & Metadata、Source Materialization、Conflict & Recovery 共同承载：它们定义本地工作区如何安全接收来源变化、如何保护用户修改、如何保留冲突与恢复语义。Selection & Access、Review Handoff & Provenance 是支撑子域，分别守住进入和离开核心的正式边界。

### 4.3 哪些只是本地索引/投影/引用？

Project/principal/access posture、Artifact/Workspace source/version、Review Gate/decision、Archive posture、Git HEAD/branch/remote 和 SDK compatibility 都只能以 ref/snapshot/projection 进入；这些影子结构必须带 source/freshness，不可反写 owner 或被当作本仓 truth。

### 4.4 为什么不能混成一个上下文？

选择/权限、working-copy 状态、source materialization、冲突恢复、handoff decision 的 owner、生命周期和失败语义不同。如果合并为单一 SyncTask，就容易用同一个 `success` 混淆权限、apply、transport 与 review decision，用单个状态覆盖 dirty/conflict/unknown 等安全差异。

## 5. 当前文档问题诊断

| 历史上下文 | 问题 | 当前处理 |
|---|---|---|
| Binding | 把 Project 与本地目录关系写成平台 binding truth | 收窄为 local working-copy binding |
| Sync | clone/pull/push-review 混成一个生命周期 | 分成 source materialization、conflict/recovery、review handoff |
| Metadata | 与 Git 状态、provenance、外部 truth 混合 | 只拥有 local metadata/provenance relation；Git 是 observation snapshot |
| Review Return | 把 submission 当 governance object | 只拥有 handoff attempt/ref，不拥有 Gate/Decision |
| Git Layer | 被提升为支配全仓的技术核心 | 定位为 local observation/apply adapter boundary，而非核心子域 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 按命令 clone/pull/status/push-review 划上下文 | 不采用 | 命令共享语义且会重复权限、metadata、恢复逻辑。 |
| B. 按 owner/状态语义和失败边界划五个上下文 | 采用 | 能分离 local truth、外部 refs、冲突和 handoff decision。 |
| C. 单一 SyncTask 上下文承载全部状态 | 不采用 | 会形成巨型状态机与语义混层。 |

## 7. 结构化中间产物

### 7.1 子域 / 上下文划分表

| 上下文 | 分类 | 作用 | 明确非职责 | 与其他部分关系 |
|---|---|---|---|---|
| Selection & Access | 支撑子域 | 收集显式选择并消费 principal/project/posture/source/action eligibility | 不认证、不授权、不创建 Project | 为所有变更主路径提供 fail-closed 门禁 |
| Working Copy & Metadata | 核心子域 | 拥有 local binding、working-copy metadata、cursor/mapping 与完整性语义 | 不拥有 Workspace projection、Git remote 或 source body | 为 materialization、recovery、handoff 提供本地锚点 |
| Source Materialization | 核心子域 | 将可验证 source delta/full material 安全映射到 working copy | 不拥有 Artifact/Workspace source truth，不自动解决冲突 | 消费 Selection、Metadata 和 Git/fs observation |
| Conflict & Recovery | 核心子域 | 记录 conflict/checkpoint/unknown/probe/manual decision，控制安全恢复 | 不裁决用户冲突，不盲重放副作用 | 暂停或恢复 Materialization/Handoff |
| Review Handoff & Provenance | 支撑子域 | 冻结候选、准备/调用/probe handoff、保存 transport 与 provenance 关联 | 不拥有 Gate/Decision/accepted、Artifact/Baseline | 将 local candidate 交给 Governance，并分层展示结果 |
| External Owner References | 本地引用层 | 保存 Project/source/review/archive/Git/SDK refs 与有限 snapshots | 不保存外部正文或反写 owner | 为五个上下文提供可追溯外部锚点 |

### 7.2 上下文关系图

```text
             +----------------------+
             | Selection & Access   |
             +----------+-----------+
                        |
                        | eligibility context
                        v
+-----------------------+-------------------------+
|           Controlled Synchronization            |
|                                                 |
| +------------------+     +-------------------+  |
| | Working Copy &   |---->| Source            |  |
| | Metadata         |<----| Materialization    |  |
| +--------+---------+     +---------+---------+  |
|          |                         |            |
|          +------------+------------+            |
|                       v                         |
|              +--------+---------+               |
|              | Conflict &       |               |
|              | Recovery         |               |
|              +--------+---------+               |
+-----------------------+-------------------------+
                        |
                        | frozen candidate / checkpoint
                        v
             +----------+-----------+
             | Review Handoff &     |
             | Provenance           |
             +----------+-----------+
                        ^
                        |
             +----------+-----------+
             | External Owner Refs  |
             +----------------------+
```

图示说明：

1. Controlled Synchronization 是核心语义，不等同一个实现模块或进程。
2. Conflict & Recovery 可阻断 Materialization 或 Handoff，不自动决定解决方案。
3. External Owner References 是影子层，仅提供 ref/snapshot/freshness，不能反写外部 truth。
4. Handoff 接收冻结候选，但 Governance 仍拥有正式 Review decision。

### 7.3 统一语言

| 术语 | 当前架构定义 | 禁止混淆 |
|---|---|---|
| sync session | 一次显式、本地、可关联的同步操作语境 | 平台 Project/Review 生命周期 |
| working copy | 用户本地 filesystem/Git 工作目录及其观察状态 | `L1-workspace` projection |
| source binding | source/version/target/generation/provenance 到本地目录的受控关系 | Artifact/Baseline ownership |
| applied cursor | 已安全应用到本地的来源水位 | Git HEAD、remote ref、platform latest |
| conflict | 阻止安全自动应用/交接的可解释差异 | 自动 merge 任务 |
| checkpoint | 本地可恢复阶段与关联记录 | 远端业务事务 commit |
| handoff attempt | 向正式 Review 边界发起的候选交接尝试 | Review accepted/approved |
| provenance relation | local change、source、tool/path、operation、handoff 的可回链关系 | 正式 evidence/verdict |

### 7.4 单上下文停审记录

| 上下文 | 分类正确 | 职责/非职责明确 | 与系统边界一致 | 未泄漏实现 | 结论 |
|---|---|---|---|---|---|
| Selection & Access | 是 | 是 | 是 | 是 | pass |
| Working Copy & Metadata | 是 | 是 | 是 | 是 | pass_with_schema_pending |
| Source Materialization | 是 | 是 | 是 | 是 | pass_with_source_contract_pending |
| Conflict & Recovery | 是 | 是 | 是 | 是 | pass_with_exact_contract_pending |
| Review Handoff & Provenance | 是 | 是 | 是 | 是 | pass_with_handoff_contract_pending |
| External Owner References | 是 | 是 | 是 | 是 | pass |

### 7.5 跨上下文语义边界审计

| 审计项 | 结果 |
|---|---|
| 核心子域误归类 | 无；Selection/Handoff 是边界支撑，不冒充同步 truth 核心 |
| 职责重叠 | 无；Materialization 负责应用，Recovery 负责暂停/恢复，Handoff 负责候选交接 |
| 投影误作真相 | 无；所有外部 owner 材料均在 reference layer |
| 统一语言冲突 | 已区分 source binding/Workspace projection、cursor/Git HEAD、handoff/decision |
| 待确认项是否保留 | 是；`SYNC-UP-002/004~010` 未关闭 |

## 8. 回填草稿

正式 §6 回填 7.1~7.3；停审与跨上下文审计留在本文件。正文不得把上下文名机械映射为代码包、服务或进程。

## 9. 待确认事项

| 待确认项 | 当前口径 | 状态 |
|---|---|---|
| metadata 是否单文件/多文件 | 只锁上下文 ownership，不锁布局 | `SYNC-UP-006` pending |
| source resolver 如何在 Artifact/Workspace 之间选择 | 保留 owner-neutral `source binding` 语义 | `SYNC-UP-002` blocked |
| conflict 人工决定的正式 owner/input | 本仓只记录 local decision association，不代替 owner policy | `SYNC-UP-010` blocked |

## 10. 自检与进入下一步条件

- [x] 核心、支撑和本地引用层已区分。
- [x] 每个上下文完成职责、非职责、统一语言和影子结构停审。
- [x] 跨上下文审计无 unresolved ownership 冲突。
- [x] 没有写对象字段、数据库表、代码目录或接口 schema。

`gate_status = pass_with_upstream_blockers`；可进入 Step 6。
