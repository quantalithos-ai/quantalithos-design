# L5-sync 架构 Step 2 · 明确架构目标与约束

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 2 |
| 输入 | Step 1 需求基线、全局依赖规则、专项上游边界 |
| 回填章节 | 正式 01 §2、§3 |
| 下一步 | Step 3：职责边界 |

## 2. Step 内计划

- [x] 从 Step 1 需求结论中提炼架构必须确保成立的结构性结果。
- [x] 区分不可变红线、当前阶段可接受收缩和架构范围排除项。
- [x] 诊断旧 01 中把技术实现、SLA 和历史候选写成约束的问题。
- [x] 为每条目标和约束写清边界理由，不下沉协议或实现细节。
- [x] 完成架构单元前置假设审计和进入 Step 3 门禁。

## 3. 本步输入

| 输入 | 关键承接 |
|---|---|
| `01_arch_step_01_requirements_baseline.md` | 显式选择、owner 边界、无覆盖、无自动治理、待确认项 |
| 正式 00 §4、§7、§10、§11、§13、§15 | 目标、规则、数据归属、NFR、风险 |
| 全局依赖裁剪规则 | `L0-core`/`L0-sdk` 编译期候选，其他 owner 通过运行期/事件/引用协作 |
| 上游正式 01 | Project、Artifact、Workspace、Governance、Archive、Observability 的边界约束 |

## 4. SOP 问题回答

### 4.1 架构层面必须确保什么成立？

1. 本地同步操作有可解释的上下文和单一 local truth，不依赖隐式 `latest`、默认分支或 remote 猜测。
2. 来源 materialization 与本地 working-copy 保护彼此分离，任何应用都先经过权限、姿态、版本、映射和 dirty 检查。
3. Sync 的本地状态与平台 Project/Artifact/Workspace/Review/Archive/Git remote 的状态有明确引用关系，不能互相冒充。
4. 只读查询不改变状态；变更路径能暂停、恢复、探测 unknown outcome，并保留 provenance。
5. review handoff 是候选交接，不是 review decision；归档姿态是消费到的外部状态，不是本地归档真相。

### 4.2 哪些约束不可变？

不可变约束是：外部 truth owner 不转移；不自动 merge/rebase/push/stash；不覆盖用户未提交修改；不绕过正式 SDK、权限或 Review Gate；unknown/failure fail-closed；不删除、伪造或静默重绑定 provenance；不把本地 commit/ACK/HTTP 200 当正式业务结果；不通过共享数据库、内部表、私有 endpoint 或跨仓事务绕过 seam。

### 4.3 哪些是当前阶段可接受取舍？

当前可以接受：先以单工作区、单来源、显式项目/版本选择为核心；批量预取与多结果比较作为外围能力；GUI/Tauri、LFS、浅克隆、大仓优化和离线缓存不进入当前主线；具体 metadata schema、协议字段、版本 comparator 和性能数字后移到后续文档或上游合同闭合后再定。

### 4.4 哪些事项不是当前架构主线？

本仓不设计 Project/Artifact/Baseline/Review/Workspace/Archive/Git remote 的内部架构，不设计 Git server、VCS 替代品、自动 merge/rebase/push、统一权限中心、平台归档引擎、UI 产品架构或外部正文存储架构。

## 5. 当前文档问题诊断

| 旧材料问题 | 架构影响 | 当前纠正 |
|---|---|---|
| 用“Rust CLI + Tauri”直接充当目标 | 把技术选择误当目标 | 目标改写为受控入口、边界隔离、可恢复和可追溯 |
| 用固定成功率/延迟/覆盖率作为约束 | 无权威 workload，可能伪造 SLA | 保留可审查的判断口径，数字待 NFR/测试闭合 |
| 把 Git 真相、平台代码真相和 metadata 真相混成一层 | 会造成双真相与错误恢复 | 目标明确要求 source/local/Git/transport/decision 分层 |
| 把 GUI、LFS、浅克隆列为当前必备 | 历史候选未核验 | 改为当前阶段取舍/待确认，不影响核心安全门禁 |

## 6. 设计取舍

| 方案 | 结论 | 取舍理由 |
|---|---|---|
| A. 以功能数量和工具栈为架构目标 | 不采用 | 功能与技术不能替代边界和真相约束。 |
| B. 以 local truth、owner seam、人工裁决和可恢复为结构目标 | 采用 | 直接保护 00 的核心能力闭环与一票否决项。 |
| C. 先承诺完整大仓/离线/GUI，再补安全约束 | 不采用 | 会让历史候选倒逼当前架构，且上游支持矩阵未闭合。 |

## 7. 结构化中间产物

### 7.1 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载可解释的本地同步操作真相 | 否则 session、cursor、冲突与恢复会散落在 Git 状态或日志里，无法回链。 |
| 守住平台 owner 与本地 working copy 的双向边界 | 否则 Sync 会把 Project/Artifact/Review/Workspace 等外部真相复制或反写。 |
| 支撑“观察—门禁—应用—记录”的安全主路径 | 否则 pull/clone 可能在权限、dirty 或版本不明时产生破坏性副作用。 |
| 允许人工冲突裁决和可探测恢复 | 否则 unknown outcome 或冲突会被隐式重试、覆盖或丢失。 |
| 让 review handoff 与正式 decision 可区分 | 否则上传成功会被误报为 accepted/approved。 |
| 让 Git 工具适配可替换且不掌握平台 truth | 否则本地工具差异会渗入业务 owner 边界。 |
| 让 provenance 与诊断可审计但不吸收敏感正文 | 否则可追溯性会以泄露正文/凭据为代价。 |

### 7.2 不可变约束表

| 约束 | 说明 |
|---|---|
| 不拥有外部 Project/Artifact/Baseline/Review/Workspace/Archive/Git remote truth | 这些对象仍由各正式 owner 管理。 |
| 不自动 merge/rebase/push/stash，不覆盖 dirty/untracked | 人工裁决和用户本地修改保护不可绕过。 |
| 不把本地 commit/ACK/HTTP 200/remote object 当业务接受 | Git、transport、handoff、decision 必须分层。 |
| status/query 无隐式写入 | 查询不得推进 cursor、刷新来源、修复 metadata 或改变上游。 |
| owner unknown/stale/revoked/archived/dissolved/conflicting 时 fail-closed | 旧缓存不能授权危险动作。 |
| 未证明副作用等价时不自动重放 | unknown outcome 先 probe 或转人工处理。 |
| 不删除、伪造或静默重绑定 provenance | 变更须可解释、可回链、可恢复。 |
| 不使用共享数据库、私有 seam 或跨仓事务绕过正式边界 | 防止依赖和真相边界被物理打穿。 |

### 7.3 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 工作区范围 | 当前先按单个显式绑定工作区闭合；多工作区批处理作为外围能力。 |
| 来源范围 | 当前只承诺逐来源门禁；多来源批量预取不放宽门禁。 |
| Git 工具范围 | 先抽象观察/原子应用边界；具体实现适配矩阵后置。 |
| 大仓策略 | LFS、浅克隆和特定优化暂不承诺；无支持矩阵时保持 pending。 |
| metadata 形态 | 只锁定受控、版本化、可回链方向；字段和布局待 `SYNC-UP-006`。 |
| GUI / Web IDE | 作为外围壳层，不进入核心同步语义。 |

### 7.4 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 设计 Project/Artifact/Baseline/Review/Workspace/Archive 内部架构 | 它们有各自正式 owner，本仓只消费能力边界。 |
| 设计 Git remote/server truth 或替代 VCS | Sync 只做本地工作区适配和受控 handoff。 |
| 设计自动 merge/rebase/push 或冲突算法 | 需求明确禁止，冲突需人工/owner 决策。 |
| 设计认证、统一权限中心或治理裁决 | 身份/权限/治理由上游 owner 提供，Sync 只执行检查和转交。 |
| 设计 GUI、LFS、浅克隆的产品/实现方案 | 当前支持矩阵与产品范围未闭合。 |
| 设计具体 schema、字段、命令 parser、数据库、测试用例 | 属于后续概要/详细/配置/测试阶段。 |

## 8. 回填草稿

§2 回填受控本地桥接、外部 owner 边界、人工裁决和可追溯的结构驱动力；§3 回填 7.2~7.4 的硬约束、取舍和非目标。不得在正式 01 中写入具体技术栈、协议或 SLA 数字。

## 9. 待确认事项

| 待确认项 | 备选方案 | 当前推荐 | 状态 |
|---|---|---|---|
| 当前工作区范围 | A. 单绑定工作区；B. 多工作区原子批处理；C. 全局工作区池 | A | 已确认作为当前架构收缩 |
| 外部 side effect 处理 | A. 盲重试；B. prepare→call→probe/finalize；C. 仅日志记录 | B | 已确认，精确合同待 `SYNC-UP-005` |
| GUI/LFS/浅克隆地位 | A. 当前主线；B. 外围 pending；C. 永久排除 | B | 已确认保守口径 |

## 10. 自检与进入下一步条件

- [x] 目标写成结构性结果而非功能或技术名词。
- [x] 不可变约束、阶段取舍和非目标彼此分离。
- [x] 所有目标均能回指 00 的边界、能力闭环或数据归属。
- [x] 没有新增未经需求基线支持的外部合同。
- [x] 可以进入 Step 3 收敛做 / 不做 / 易混淆职责 / 红线。

`gate_status = pass_with_upstream_blockers`；上游 blocker 不阻止职责边界讨论，但阻止具体协议和实现承诺。
