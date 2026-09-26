# 00 需求 Step 9 · 功能需求

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`、`00_req_step_08_user_stories.md`
> 回填章节：正式 `00` §9
> 约束：按业务能力拆分，不按对象、CRUD、API 或内部实现拆分。

## 1. 核心功能需求表

| ID | 能力节点 | 功能需求 | 输入语境 | 外部可见输出 | 失败/降级姿态 | 故事映射 |
|---|---|---|---|---|---|---|
| `FR-SYNC-001` | `CP-SYNC-01` | 建立一次带 principal、project、version/source、target 和 operation 的同步语境。 | 用户选择与认证语境 | 可解释的 selection/session 状态 | 未认证、缺选择或上下文过期时 blocked | `US-SYNC-001~002` |
| `FR-SYNC-002` | `CP-SYNC-01` | 检查项目成员权限、项目姿态、来源可见性和允许动作。 | identity/work/artifact/archive owner 结论 | verified/denied/archived/restricted/unknown | owner 结论缺失或冲突时 fail-closed | `US-SYNC-002` |
| `FR-SYNC-003` | `CP-SYNC-02` | 将正式 source/version 与本地 working copy 建立可回链绑定。 | 已验证 selection、目标路径、source ref | binding/generation/provenance 摘要 | 目标不安全、已绑定其他 source 或 metadata 不明时停止 | `US-SYNC-003~004` |
| `FR-SYNC-004` | `CP-SYNC-02` | 初始化或受控迁移 `.qs-sync` metadata 主题并记录来源/工具关联。 | 目标目录、现有 metadata、source/version | metadata 健康、generation、迁移/需人工处理姿态 | schema/完整性/迁移未知时不静默继续 | `US-SYNC-003~004` |
| `FR-SYNC-005` | `CP-SYNC-03` | 提供只读 status，分层报告平台 source、local applied、Git/filesystem、metadata、conflict、recovery 和 handoff 状态。 | 已保存 local truth 与可查询 owner ref | 可解释 status、coverage、provenance、degraded reason | source/metadata/工具状态未知时标记 unknown/blocked，不修复 | `US-SYNC-005` |
| `FR-SYNC-006` | `CP-SYNC-03` | 获取可验证的全量或增量来源并在本地安全 materialize。 | source version/cursor/comparator、clean target | progress、applied cursor、mapping、materialization 结果 | comparator/gap/dirty/权限变化时暂停或人工处理 | `US-SYNC-006` |
| `FR-SYNC-007` | `CP-SYNC-04` | 检测来源分叉、路径映射、删除/重命名、metadata/provenance 和姿态冲突。 | source/local/Git/fs 观察与历史 binding | 冲突类别、影响范围、证据和恢复点 | 冲突可见且停止，不自动解决或抹除证据 | `US-SYNC-007` |
| `FR-SYNC-008` | `CP-SYNC-04` | 提供中断恢复、幂等重入和 unknown outcome probe 的安全入口。 | session/attempt/checkpoint、外部 probe | resumable、probe-required、manual-review、recovered | 无法证明副作用等价时 blocked，不盲重试 | `US-SYNC-008` |
| `FR-SYNC-009` | `CP-SYNC-05` | 在本地候选经重新检查后形成冻结并发起正式 Review handoff。 | clean/approved local state、source/provenance、权限姿态 | handoff attempt、transport outcome、外部 ref | dirty、source drift、archived 或协议未知时不提交 | `US-SYNC-009` |
| `FR-SYNC-010` | `CP-SYNC-05` | 展示 handoff ACK、probe 状态和正式 Review decision 的分离结果。 | handoff ref、Governance query | submitted/pending/unknown/decision-ref-known | ACK/HTTP 200/remote object 不显示 accepted | `US-SYNC-010` |
| `FR-SYNC-011` | `CP-SYNC-06` | 处理权限撤销、归档/解散姿态、source 失效和 provenance 缺口。 | 最新 owner posture 与 local binding | restricted/invalidated/blocked、需重新选择或人工处理 | 不凭旧缓存继续 materialize/handoff | `US-SYNC-011` |
| `FR-SYNC-012` | `CP-SYNC-06` | 输出安全诊断、操作关联、来源和恢复历史摘要。 | local records、observability 允许的安全材料 | redacted/bounded diagnostic 和 correlation | 诊断不可用不改变业务结果；不生成 evidence/verdict | `US-SYNC-012` |

## 2. 外围功能需求

| ID | 功能需求 | 类型 | 约束 |
|---|---|---|---|
| `FR-SYNC-013` | 对已明确选择且逐项通过门禁的多个来源提供批量预取/准备。 | 外围 | 不放宽 project/version/permission/integrity/dirty 检查。 |
| `FR-SYNC-014` | 提供多个本地同步结果的安全摘要比较。 | 外围 | 不合并 source truth、Baseline 或 Review 状态。 |
| `FR-SYNC-015` | 在 Archive 正式合同允许时展示归档项目的可消费引用和姿态。 | 外围 | 不参与当前 materialize/handoff 成功判定。 |

## 3. 功能输入/输出/触发/失败审计

| 审计项 | 结果 |
|---|---|
| 每项核心功能是否至少支撑一个故事 | pass；`FR-SYNC-001~012` 映射 `US-SYNC-001~012`。 |
| 每个核心能力节点是否有功能承接 | pass；六节点均有至少两项。 |
| 是否把命令名、API、对象或模块当作功能 | 否；`clone/pull/status/push-review` 只在用户可见操作方向上表达。 |
| 是否覆盖失败/unknown/blocked | 是；每项均有失败或降级姿态。 |
| 是否存在拥有上游 truth 的功能 | 否；所有输出均为本地操作状态或外部 ref。 |
| 外围功能是否错误成为核心前置 | 否。 |

## 4. 明确排除的功能候选

自动 `latest` 选择、自动 merge/rebase/push、直接写 Project/Artifact/Baseline/Gate、跨 bus replay、强制覆盖 dirty worktree、保存 raw Artifact/Git/Review 正文、把日志/ACK变成 verdict 均不进入功能需求。

## 5. 回填草稿与自检

正式 §9 回填 `FR-SYNC-001~012` 核心表和 `FR-SYNC-013~015` 外围表；具体 CLI 参数、协议、DTO、schema、模块和测试切口后置到 01~05。

- [x] 功能按业务能力组织。
- [x] 输入、输出、触发和失败边界已结构化。
- [x] 每项功能有故事/能力来源。
- [x] 未引入实现或伪造上游合同。

`Step 9 gate_status = pass_with_blockers`；允许进入 Step 10。
