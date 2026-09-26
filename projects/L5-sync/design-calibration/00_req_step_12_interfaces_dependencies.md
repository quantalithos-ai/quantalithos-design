# 00 需求 Step 12 · 接口与依赖

> 状态：`completed`
> 前置：`00_req_step_06_consumers_dependencies.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_11_data_ownership.md`
> 回填章节：正式 `00` §12
> 本步只写能力级接口，不写 API 路径、DTO、协议 schema、handler、repository、port/adapter trait 或重试算法。

## 1. 对外能力接口表

| 接口类型 | 名称 | 需求层说明 | 所属能力层级 |
|---|---|---|---|
| 查询接口 | 同步语境与来源状态查询 | 返回显式选择、project/version/source binding、权限/姿态、cursor、Git/fs、metadata、冲突、恢复和 handoff 的安全状态。 | 核心闭环能力 |
| 变更接口 | 本地工作副本初始化与更新 | 受控建立/迁移 working copy、请求全量或增量 materialize，并返回局部结果或 needs-action。 | 核心闭环能力 |
| 查询接口 | 冲突与恢复状态查询 | 读取冲突影响、checkpoint、probe 和人工决策等待姿态。 | 核心闭环能力 |
| 变更接口 | Review 候选 handoff | 以明确用户意图提交冻结的本地候选到正式 Review Gate，并返回 handoff/ref/transport 状态。 | 核心闭环能力 |
| 查询接口 | 归档姿态与安全诊断查询 | 读取 archive posture、provenance、correlation 和 redacted diagnostic。 | 核心闭环能力/外围增强 |
| 变更接口 | 本地冲突决定/恢复继续 | 记录用户对冲突或恢复步骤的明确决定，不代表上游业务写入。 | 核心闭环能力 |
| 事件输入 | 来源/姿态变化通知（条件） | 在正式 SDK/事件面闭合时接收 source、permission、archive 或 handoff 变化提示。 | 核心闭环能力 |
| 后台任务接口 | 本地恢复、metadata 校验与安全 probe | 维护 Sync-owned local state，不修复 owner truth 或盲重放副作用。 | 核心闭环能力 |

## 2. 外部能力依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 能力级输入/输出边界 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` / `L0-sdk` | 编译期/运行期 | shared ref/error/trace 与正式平台访问能力。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-identity` / `L1-work` | 运行期 | principal、Project/ProjectMember、权限、项目姿态和允许动作。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-artifact` | 运行期 | Artifact/version/source/manifest/增量或可物化来源引用。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-workspace` | 运行期 | 若正式开放则提供 Workspace projection/source binding 摘要。 | 核心闭环能力/外围 |
| 输出/输入 | 治理结论依赖 | `L1-governance` | 运行期 | review handoff、接收/查询和正式 decision ref。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L4-archive` | 运行期 | archived/dissolved/retired posture 和安全 archive ref。 | 核心闭环能力/外围 |
| 输出 | 下游消费依赖 | `L4-observability` | 运行期/事件（条件） | redacted diagnostic/correlation 的安全交接或查询。 | 外围/条件 |
| 输入/输出 | 外部能力依赖 | Git CLI/library、filesystem/OS | 外部 adapter | 本地 HEAD/index/tree、路径、锁、dirty 状态和受限 I/O。 | 核心闭环能力 |

## 3. 接口语义约束

- 查询/status 必须 no-write：不能隐式推进 cursor、刷新 source、修复冲突、写 metadata 或发上游命令。
- 变更接口只表达用户意图和 Sync-local 操作；返回结果必须区分 prepared、applied、blocked、unknown、handoff submitted 和外部 decision。
- 事件输入（若闭合）只作为变化提示或可验证输入，不能把 bus delivery/ack/replay 变成 Sync truth。
- 后台任务只维护 local state；不得自动 merge/rebase/push、覆盖 dirty worktree 或把日志/ACK 升格为 verdict。

## 4. 后置清单

下列内容不在需求层锁定：CLI 精确命令/参数/退出码、HTTP/RPC/SDK 方法、DTO/JSON/proto、事件 payload、port/adapter trait、repository、数据库、metadata 字段和目录、重试/锁/事务、Git LFS/浅克隆/GUI 技术选择。它们必须在后续架构/概要/详细/配置阶段以当前上游合同重新校准。

## 5. 接口边界审计

| 检查项 | 结果 |
|---|---|
| 对外能力面是否覆盖核心闭环 | pass |
| 是否保留运行期/事件协作与编译期区分 | pass |
| 是否把命令名/DTO/schema 写成需求接口 | 否 |
| 是否把 Sync 变成 owner 或跨端协调器 | 否 |
| 查询 no-write、变更意图、事件条件和后台局部责任是否明确 | pass |

## 6. 取舍与回填草稿、自检

正式 §12 回填两张能力级接口/依赖表和语义约束；引用 Step 6 的裁剪关系但不重复总矩阵。所有 exact surface 留给后续文档。

- [x] 接口类型使用查询/变更/事件输入/后台任务最小枚举。
- [x] 依赖类型按定义来源/治理结论/下游消费/外部能力表达。
- [x] 没有 API 路径、字段、协议或内部实现。
- [x] 依赖 blocker 保持开放。

`Step 12 gate_status = pass_with_blockers`；允许进入 Step 13。
