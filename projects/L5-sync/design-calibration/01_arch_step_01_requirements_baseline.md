# L5-sync 架构 Step 1 · 确认需求基线

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `standards/document/架构设计讨论流程_SOP.md` Step 1 |
| 回填章节 | 正式 01 §1、§3、§16 |
| 下一步 | Step 2：明确架构目标与约束 |
| 事实边界 | 仅收敛架构输入，不声明实现、测试、运行或接口已存在 |

## 2. Step 内计划

- [x] 读取正式 `00-需求文档.md`、00 Step 16/17、架构 SOP/规范与全局依赖规则。
- [x] 读取专项上游正式架构文档：`L0-sdk`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-archive`、`L4-observability`。
- [x] 按“已稳定 / 待确认 / 直接影响边界”分类需求。
- [x] 登记旧 README、旧正式 01 与 draft 的污染，不把历史选择升格为当前架构。
- [x] 形成需求基线、架构硬约束、未关闭风险和回填草稿。
- [x] 完成 Step 门禁与跨上游审计。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `projects/L5-sync/00-需求文档.md` §2、§4、§6~§16 | 直接需求边界、能力闭环、数据归属、接口层次、NFR、验收与风险 |
| `projects/L5-sync/design-calibration/00_req_step_16_traceability.md` | 核对需求主轴无孤儿，并保留 `SYNC-UP-001~010` |
| `projects/L5-sync/design-calibration/00_req_step_17_formal_assembly.md` | 确认 00 已 full-restart、停审、可作为架构输入 |
| 专项上游正式 01 与全局依赖规则 | 确认 Project、Artifact、Workspace、Review、Archive、SDK、观测和身份边界 |
| README、旧正式 01、draft | 仅作 `historical_material` 污染诊断 |

## 4. SOP 问题回答

### 4.1 当前架构设计依赖哪些需求结论？

直接依赖以下稳定结论：`L5-sync` 是平台与本地开发工作区之间的受控同步入口；操作必须有明确 principal、project、version/source、target 和 operation；能力主轴是选择与访问、来源绑定、status/增量 materialization、冲突与恢复、Review handoff、结果分层与归档姿态；本仓只能拥有本地 sync session、working-copy metadata、cursor、mapping、conflict、checkpoint、handoff attempt 与 provenance 关联。

### 4.2 哪些结论已经稳定？

稳定结论包括：

1. `Project`、`Artifact`、`Baseline`、`Review Gate`、`Workspace projection`、`Archive` 和 Git remote truth 均不属于 Sync。
2. status/query 是只读观察，不得隐式 refresh、推进 cursor、修复冲突或改变上游状态。
3. 不得自动 merge、rebase、push、stash，不得覆盖 dirty/untracked 或无法解释的本地修改。
4. 本地 commit、上传 ACK、HTTP 200、remote object、日志或 cache 都不能被解释为 Artifact、Baseline、Review accepted、approved、signoff 或 readiness。
5. 权限、项目姿态、来源资格和 Review 状态必须来自正式 owner；unknown/stale/revoked/archived/dissolved/conflicting/unsupported 时 fail-closed。
6. `.qs-sync` 只承载受控 metadata/provenance 方向，具体布局、schema、迁移和保留规则尚未闭合。

### 4.3 哪些结论仍待确认？

`SYNC-UP-001~010` 仍开放，尤其是 SDK 精确 surface、Artifact/Workspace materialization source、Project 权限与归档动作矩阵、Review handoff/ACK/probe/decision ref、unknown outcome 与幂等合同、`.qs-sync` schema、Git remote 关系、cursor/comparator/gap 语义、LFS/浅克隆/GUI 支持矩阵和 dirty/path protection 合同。它们可以约束架构形状，但不能被本 Step 假定为已存在的接口或协议。

### 4.4 哪些需求直接影响架构边界？

- “不拥有外部 truth”直接决定核心只能围绕本地操作 truth 建模。
- “显式选择与权限检查”决定必须有独立 Selection & Access 边界，不能由 Git remote、默认分支或缓存猜测。
- “working-copy 保护与 provenance”决定本地 Git/filesystem 观察、metadata 管理和同步应用必须分离。
- “Review handoff 不等于 accepted”决定 handoff 与外部 decision 读取必须分层。
- “归档姿态只作外部状态”决定 Archive 只能是查询 / 交接边界。

### 4.5 哪些需求直接影响数据所有权？

本仓的正式 truth 只能是本地操作语义：session、binding、cursor、mapping、conflict、checkpoint、handoff attempt、provenance 关联和 bounded diagnostic。来源、权限、Artifact、Workspace、Review、Archive、Git remote 的正文或主状态必须保留为 snapshot、projection 或 reference；外部正文、secret、credential、raw evidence/report 和平台业务对象正文禁止进入 Sync truth。

### 4.6 哪些需求直接影响依赖方向与一致性？

全局裁剪表允许 `L0-core` / `L0-sdk` 作为编译期候选；Artifact、Workspace、Archive 及其他 owner 能力经 `L0-sdk` 的运行期正式边界消费。Sync 内部核心不得依赖 sibling 的私有实现、共享数据库、任意 bus 或私有 endpoint。只有在来源资格、版本比较、路径映射和 dirty 保护均成立时，才可推进 local apply；外部副作用必须遵循 prepare→call→probe/finalize。

## 5. 当前文档问题诊断（历史污染）

| 历史材料问题 | 对架构的污染 | 当前处置 |
|---|---|---|
| 旧 01 将 Rust/Tauri、CLI、Git facade 写成既定技术方案 | 把候选实现提升为架构事实 | 只保留“本地受控入口 + Git/filesystem adapter”能力级结论，技术形态后置 |
| 旧 01 把 `.qs-sync/metadata.json` 和不可删除规则写死 | 可能预先决定 schema、迁移和保留语义 | 改为受控 metadata/provenance 方向，细节列 `SYNC-UP-006` |
| 旧 01 把 Git LFS、浅克隆、大仓数字写成能力承诺 | 可能形成无上游依据的兼容与 SLA | 标为历史候选 / pending，不进入当前主线 |
| 旧 01 将 review submission、上传成功和平台接受混为一谈 | 破坏 Governance truth 与 ACK/decision 分层 | 明确 handoff attempt、transport、probe、decision ref 四层 |
| 旧 draft 以“同步器拥有项目/Artifact”组织模块 | 造成跨仓 truth 泄漏 | 仅作为功能线索；以正式 00 的 owner 表为准 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 继续沿用旧 01 的 Git/metadata/GUI 方案 | 不采用 | 旧选择未通过当前上游合同核验，且夹带实现承诺。 |
| B. 以新版 00 为唯一直接需求基线，保留能力级本地受控入口 | 采用 | 能同时守住 Git 共存、外部 truth 不转移和后续可落码空间。 |
| C. 把 L5-sync 设计成平台全量同步服务 | 不采用 | 会吞并 Workspace、Artifact、Archive、Review 或 Git remote owner。 |

## 7. 结构化中间产物

### 7.1 架构需求基线清单

| 需求结论 | 架构影响 | 稳定性 |
|---|---|---|
| 显式选择 principal/project/version/source/target/operation | Selection & Access 是独立架构单元 | 稳定 |
| source binding 与 working-copy metadata 可回链 | Binding/Metadata 不能被 Git adapter 隐式替代 | 稳定 |
| status 只读、pull/clone 受安全门禁 | Query 与 mutation 必须分离 | 稳定 |
| 增量、冲突、恢复、幂等和 probe | Materialization 与 Conflict/Recovery 必须分离 | 稳定；精确合同 pending |
| handoff 只形成候选并回链正式 Gate | Review Handoff 不拥有 decision | 稳定 |
| 归档姿态、撤销和 source 失效优先于缓存 | Archive posture 只能是外部状态边界 | 稳定 |
| LFS/浅克隆/GUI 等历史选择待核验 | 技术选型不可提前锁定 | pending |

### 7.2 架构硬约束清单

| 硬约束 | 受保护边界 |
|---|---|
| 不拥有 Project/Artifact/Baseline/Review Gate/Workspace projection/Archive/Git remote truth | 相邻 owner 的单一真相 |
| 不自动 merge/rebase/push/stash，不覆盖 dirty/untracked | 用户本地修改与人工冲突裁决 |
| 不把本地 commit、ACK、HTTP 200 当平台接受 | Git、transport、decision 三层分离 |
| 不绕过正式 SDK、权限、Review Gate 或跨仓 seam | 全局依赖和治理链 |
| 不删除或伪造 provenance、冲突记录、恢复关联或敏感材料 | 可追溯和安全边界 |
| unknown 时 fail-closed，无法证明等价不得重放副作用 | 恢复与幂等安全 |

### 7.3 未关闭需求风险

| 风险 | 架构处理口径 | 是否阻塞目标/约束讨论 |
|---|---|---|
| SDK 与 owner surface 未闭合 | 只定义能力边界和 adapter seam，不写方法名/DTO | 否，阻塞具体协议 |
| source/version/comparator/gap 未闭合 | pull 结构保留 blocked/needs-action 分支 | 否，阻塞增量实现定稿 |
| `.qs-sync` schema/迁移未闭合 | 只定义 metadata owner 与完整性要求 | 否，阻塞字段/布局 |
| dirty/path protection 合同未闭合 | 架构硬约束先行，细节留后续 Step/03 | 否，不能取消保护 |

## 8. 回填草稿

- §1 只承接正式 00、专项上游和全局依赖来源，不把本 Step 的问题诊断写进正文。
- §3 回填硬约束、当前取舍和架构非目标；具体目标在 Step 2 进一步收敛。
- §16 在 Step 15 统一建立需求到架构单元的追溯矩阵，本 Step 仅提供需求主轴。

## 9. 待确认事项

| 待确认项 | 备选方案 | 当前推荐 | 状态 |
|---|---|---|---|
| 直接需求基线 | A. 新版 00；B. 新旧混用；C. 旧 01 | A | 已确认 |
| 外部来源承接方式 | A. Sync 拥有外部 truth；B. snapshot/ref + owner seam；C. 本地缓存代替 owner | B | 已确认 |
| 当前技术栈 | A. 立即锁 Rust/Tauri；B. 能力级本地入口，技术后置；C. 平台服务化 | B | 已确认 |

## 10. 自检与进入下一步条件

- [x] 需求基线、硬约束和风险均可回指正式 00。
- [x] 未把旧技术选择、接口名或运行结果写成架构事实。
- [x] Project/Artifact/Baseline/Review/Workspace/Archive/Git remote owner 未被转移。
- [x] `SYNC-UP-001~010` 仍保持 pending/blocked。
- [x] 足以进入 Step 2；下一步只讨论目标、不可变约束、当前取舍和非目标。

`gate_status = pass_with_upstream_blockers`；不阻止 Step 2，但阻止具体协议、字段和实现承诺。
