# L5-sync 架构 Step 3 · 职责边界

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 3 |
| 输入 | Step 1 需求基线、Step 2 目标与约束、专项上游 owner 边界 |
| 回填章节 | 正式 01 §4 |
| 下一步 | Step 4：系统边界与上下文 |

## 2. Step 内计划

- [x] 逐项回答本仓做什么、不做什么、哪些职责易混淆。
- [x] 将能力项提升为职责边界，不把功能清单或实现模块直接当职责。
- [x] 逐一核对 Project、Artifact、Baseline、Review、Workspace、Archive、Git remote、Identity/Permission owner。
- [x] 形成职责边界表、做/不做清单、红线和跨 owner 审计。
- [x] 完成停审记录后进入系统上下文。

## 3. 本步输入

| 输入 | 关键用途 |
|---|---|
| Step 1 | 确认本仓只能拥有 local sync operation truth |
| Step 2 | 确认禁止自动副作用、外部 truth 转移和绕过 seam |
| `L0-sdk` / `L1-work` / `L1-artifact` / `L1-governance` / `L1-workspace` / `L4-archive` 正式 01 | 核对相邻 owner 的职责边界 |
| 正式 00 §2、§6、§10、§11、§12 | 将需求能力翻译为仓级职责 |

## 4. SOP 问题回答

### 4.1 这个仓具体做什么？

`L5-sync` 负责把用户明确选择的项目/版本/来源与本地工作区建立可回链同步语境；在权限、来源、版本、映射和本地修改安全检查通过后，观察并应用可验证的来源变化；记录 cursor、mapping、冲突、checkpoint、恢复和 handoff attempt；将候选变化交给正式 Review Gate，并分层展示 transport/ACK/probe/decision/archive posture；为 Git/filesystem 工具提供受限适配边界和安全诊断。

### 4.2 这个仓具体不做什么？

不创建、修改或拥有 Project、ProjectMember、Artifact、Baseline、Review Gate、Workspace projection、Archive package、Git remote truth、身份/权限真相；不存储外部正文、credential、secret、正式 evidence/report；不自动 merge/rebase/push/stash；不替用户决定冲突；不把本地 commit 或上传 ACK 升格为平台业务结果。

### 4.3 哪些职责最容易混淆？

| 易混淆职责 | 正确归属 |
|---|---|
| 项目存在、项目成员和 archived/dissolved posture | `L1-work` / 正式 owner；Sync 只消费检查结果 |
| Artifact/version/lineage/baseline 和 materialization source | `L1-artifact` 或明确 source owner；Sync 只绑定和应用来源 |
| Workspace projection/view | `L1-workspace`；本地 working copy 是另一种本地事实 |
| Review Gate/Decision/accepted | `L1-governance`；Sync 只发起 handoff、查询外部状态 |
| Archive package/restore truth | `L4-archive`；Sync 只显示姿态或交接引用 |
| Git branch/commit/remote | 本地 Git 或 remote owner；Sync 只观察本地并执行白名单应用 |
| Principal/authentication/authorization truth | `L1-identity`、`L1-work`、治理/安全 owner；Sync 不裁决 |

### 4.4 哪些行为绝不能隐式发生？

隐式选择来源或版本、默认允许权限、刷新并推进 cursor、覆盖 dirty/untracked、自动解决冲突、隐式 stash/merge/rebase/push、绕过 Review Gate、删除或重绑 provenance、把 unknown outcome 当失败或成功、把 cache/ACK/HTTP 200 当 accepted，均属于职责红线。

## 5. 当前文档问题诊断

| 历史口径 | 问题 | 当前处理 |
|---|---|---|
| “Workspace Binding”被写成项目绑定真相 | 可能吞并 Project/Workspace owner | 改名为本地 working-copy binding，明确只拥有 local relation |
| “Governance Return Path”被写成 ReviewSubmission truth | 可能把 handoff 对象冒充 Gate decision | 改为 handoff attempt/reference，decision 仍归 governance |
| “Sync Engine”被描述为平台代码同步真相 | 可能吸收 Artifact/Baseline | 改为受门禁的 local materialization orchestration |
| “Git Facade”拥有 Git 状态和提交 | 可能把工具适配当 remote truth | 改为只读观察、受限锁和原子 materialize seam |
| metadata 被描述为不可删除主文件 | 把布局和保留语义提前固化 | 只保留 provenance/metadata 职责，细节 pending |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 用 clone/pull/push-review 命令作为职责定义 | 不采用 | 命令是入口，不是 ownership；会遗漏冲突、恢复、审计边界。 |
| B. 按 truth owner、local operation、adapter seam 划分职责 | 采用 | 能避免本仓吞并平台业务真相，同时支持后续 CLI/GUI 变体。 |
| C. 让 Sync 直接代理所有平台服务 | 不采用 | 形成全能 facade，破坏依赖裁剪和相邻仓单一真相。 |

## 7. 结构化中间产物

### 7.1 职责边界表

| 职责 | 类型 | 说明 |
|---|---|---|
| 本地同步语境与 operation lifecycle | 做 | 管理显式选择、阶段和本地结果，不代表平台业务生命周期。 |
| working-copy binding 与受控 metadata/provenance 关系 | 做 | 将本地目录、来源、版本、generation 和工具关联起来。 |
| 来源资格/权限检查编排 | 做（执行） | 调用正式 owner seam 并根据结果阻断/允许；不拥有权限真相。 |
| source materialization orchestration | 做 | 组织全量/增量读取和安全应用；不拥有 Artifact/Workspace 正文。 |
| Git/filesystem observation 与受限 apply seam | 做 | 观察 dirty/untracked/path state，执行白名单原子应用。 |
| conflict、checkpoint、recovery、probe 记录 | 做 | 保留本地操作语义和人工决定关联。 |
| Review handoff preparation/attempt | 做 | 冻结候选、发起 handoff、记录 transport/ACK/probe ref。 |
| 分层诊断与 archive posture 展示 | 做 | 输出 bounded/redacted 状态，不生成 evidence/verdict。 |
| Project / ProjectMember / Artifact / Baseline truth | 不做 | 由相邻 owner 管理。 |
| Workspace projection truth | 不做 | 本地 working copy 不等同 Workspace projection。 |
| Review Gate / decision / accepted truth | 不做 | 由治理 owner 决定。 |
| Archive package / restore truth | 不做 | 由 Archive owner 管理。 |
| Git remote / branch policy truth | 不做 | remote 与分支真相不归 Sync。 |
| authentication / authorization policy truth | 不做 | Sync 只执行正式检查并 fail-closed。 |

### 7.2 做 / 不做清单

**做：**显式选择、owner seam 调用、working-copy 绑定、只读 status、受门禁 pull/clone、冲突可见、checkpoint/recovery、handoff attempt、provenance 关联、bounded diagnostics。

**不做：**默认选择、业务对象创建、外部正文复制、自动合并/推送、治理裁决、归档编排、远端修复、跨仓事务、缓存替代 owner、删除用户修改。

### 7.3 边界红线清单

1. 本仓任何 local state 都必须带 operation/source/correlation/provenance 语境，不能冒充平台对象生命周期。
2. Git adapter 的输出只能是 observation 或受控 apply capability，不能提供 remote push、merge、rebase 或主分支写入能力。
3. handoff attempt、transport ACK、probe outcome、Review decision 必须使用不同语义层，不能用单一 `success` 表示。
4. `.qs-sync` 任何迁移、重绑、失效和修复均不得静默删除或伪造 provenance。
5. dirty/untracked/path protection 或 source comparator unknown 时，materialization 必须停止或转人工。

### 7.4 架构单元职责停审记录

| 单元候选 | 职责是否清楚 | 非职责是否清楚 | owner 边界 | 结论 |
|---|---|---|---|---|
| Selection & Access | 是 | 是 | 不拥有权限真相 | pass |
| Working Copy & Metadata | 是 | 是 | 不拥有 Workspace projection/Git remote | pass |
| Source Materialization | 是 | 是 | 不拥有 Artifact/Workspace source truth | pass_with_pending_source_contract |
| Conflict & Recovery | 是 | 是 | 不裁决冲突、不重放 unknown | pass |
| Review Handoff & Provenance | 是 | 是 | 不拥有 Gate decision/accepted | pass_with_pending_handoff_contract |

跨单元审计：没有发现两个单元同时拥有 Project、Artifact、Review 或 Git remote truth；Source Materialization 与 Working Copy 通过“source snapshot/ref vs local apply”分离。具体 source contract 与 handoff protocol 继续由 `SYNC-UP-002/004/005/008/010` 阻塞。

## 8. 回填草稿

正式 §4 将采用 7.1~7.3 的职责表和红线，省略历史诊断与取舍过程；易混淆职责用短表保留，避免把后续上下文图提前塞入本章。

## 9. 待确认事项

| 待确认项 | 备选方案 | 当前推荐 | 状态 |
|---|---|---|---|
| 权限职责 | A. Sync 本地裁决；B. owner seam 提供结论，Sync 编排 fail-closed；C. 仅依赖 Git | B | 已确认 |
| Review 回流职责 | A. Sync 拥有 decision；B. Sync 仅 handoff attempt，Governance 拥有 decision；C. 直接 remote push | B | 已确认 |
| Git 适配职责 | A. 全 Git workflow；B. observation/lock/atomic apply 白名单；C. 自建 VCS | B | 已确认 |

## 10. 自检与进入下一步条件

- [x] 做/不做、易混淆职责、边界红线已独立表达。
- [x] 没有把命令、模块、字段或技术栈当成职责真相。
- [x] 五个候选架构单元均完成单元停审；跨单元无 owner 重叠。
- [x] Source/handoff 未闭合项保持 pending，不阻止系统上下文抽象。

`gate_status = pass_with_upstream_blockers`；可进入 Step 4。
