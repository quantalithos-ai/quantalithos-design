# Step 1. 确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填目标：正式 `07-实施计划.md` §1

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 1 / input_boundary |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 2；保留所有上游 blocker，不进入代码实现 |

## 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求、架构、概要 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | formal / stop_review | 作为范围、ownership 和依赖方向基线 |
| 详细设计 | `03-详细设计.md` | formal / stop_review | TypeScript/ESM 单 package、29 objects、protocol/state/flow/port 真相 |
| 配置设计 | `04-配置设计.md` | formal / stop_review | 42 leaf、profiles、builder、activation 和 redaction |
| 测试方案 | `05-测试方案.md` | formal / stop_review | TC/SUITE/EV 计划、G0～G7、证据路径 |
| 验收标准 | `06-验收标准.md` | formal / stop_review | AC/VETO、三值结论和 evidence ceiling |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sync` | absent / not_created | 不是当前可写入对象 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 00/01/02/03/05/06 是否齐全？ | 是；04 也已完成并作为配置输入。 | 正式文档状态与主台账 |
| 哪些是本轮 baseline？ | 当前正式 00～06 和本 07 Step 1～13 产物；无批准 implementation commit hash。 | 00～06 文档元信息、项目台账 |
| 详细设计是否支持 1:1 落码？ | local logical contract、字段、协议、状态、UoW 和 test cut 已闭合；external/physical/tool/package positive seam 受 blocker 限制。 | 03 §4～§17、`SYNC-UP-*`、`SYNC-LOCAL-*` |
| 测试/验收能否定义 phase gate？ | 能定义 planned gate、TC/EV 回指和失败姿态；当前没有真实 runner、artifact、report 或结果。 | 05 §9/§13、06 §10～§14 |
| 是否存在阻塞冲突？ | 存在上游 SDK/source/review/metadata/Git/comparator/dirty contract 与本地 Node/package/parser/runner/SDK dependency 未闭合；不允许实现者猜测。 | 03 §17、04 §12/§13、05 §14、06 §13 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 03 的实现仓尚不存在 | 无法填写实现仓 branch、git identity、真实 baseline 或 commit 记录 | 在 07 中记录 `TARGET-REPO-001`，保持 waiting/blocked |
| 03/04/05/06 仍有 positive seam blocker | 不能把 phase 标为可开工或把外部正向路径当作已实现 | phase/boundary 预置为 planned/blocked，并定义 wait_design 门禁 |
| 设计仓无用户批准 commit hash | implementation ledger 不能伪造 `design_baseline` | 使用 `blocked / no approved hash`，由后续维护者固定 baseline |
| 历史 README/draft 与当前 TypeScript 设计不同 | 可能污染实现计划 | 仅登记 historical_material，不引用旧工具选择 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 07 输入状态 | 06 停审后尚无 07 flow | 以正式 00～06 为输入，建立 07 Step 1 输入边界 | 遵守 07 SOP |
| 实现仓姿态 | 未声明 | `absent / not_created`，不创建 | 避免把设计仓当实现仓 |
| baseline | 未定义 | 记录为 pending/blocked，无 hash | 不伪造 commit |
| 外部能力 | 仅在 03/05/06 中列 blocker | 进入 07 开工和移交门禁 | 让实现者不能绕过设计缺口 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接按 03 文件树生成实现任务 | 快 | 把 planned tree 误当可开工契约，忽略 package/SDK/Git blocker | 拒绝 |
| 只记录“实现仓待创建” | 简洁 | 无法约束 phase、baseline 和 handoff | 拒绝 |
| 以正式 00～06 为真相，显式建立 blocker-aware 07 输入边界 | 可追溯，可在实现前阻断猜测 | 计划包含较多 waiting/blocked 口径 | 采用 |

## 结构化中间产物

### 上游输入边界表

| 输入族 | 正式真相 | 07 使用方式 | 当前门禁 |
|---|---|---|---|
| 需求/红线 | 00 | 约束范围、VETO 和非目标 | `pass`（设计输入） |
| 架构/ownership | 01 | 固定 local truth、owner seam、依赖方向 | `pass_with_upstream_blockers` |
| 概要/流程 | 02 | 阶段纵切和 CP 依赖 | `pass`（设计输入） |
| 详细/落码契约 | 03 | 模块、对象、ports、protocol、state、UoW、test cuts | `pass_with_upstream_blockers` |
| 配置 | 04 | builder、profile、activation、redaction | `pass_with_upstream_blockers` |
| 测试 | 05 | TC/SUITE/EV、脚本和 evidence roots | `pass_with_upstream_blockers` |
| 验收 | 06 | AC/VETO、S/A/B/R、handoff | `pass_with_upstream_blockers` |

### 继续条件

- 允许制定实施计划，但不等于允许实现。
- 所有 phase/boundary 必须承接已有设计，不补设计 truth。
- 目标实现仓、批准 design baseline、工具链和外部 owner contract 解锁前，保持 blocked/waiting。

## 回填草稿

正式 §1 应声明：实施计划承接正式 00～06，不重新定义需求、架构、对象、协议、状态、配置、测试或验收；03 是直接实现契约，04/05/06 分别提供配置、测试和验收门禁；上游正向 seam、目标实现仓和 design baseline 缺口必须在 implementation plan 和 boundary ledger 中保持 `blocked/waiting`。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| `/home/aris/Projects/quantalithos-sync` 创建并确认目录/branch | PH-01 bootstrap | 首个 boundary 开工前 |
| 用户批准 design baseline commit | 所有 boundary Design Gate | 实现移交前 |
| `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 解锁矩阵 | 各正向 adapter/CLI/test boundary | 对应 boundary 开工前 |

## 进入下一步条件

- [x] 正式 00～06 输入已列出。
- [x] 缺口已分类为 blocker / waiting / historical。
- [x] 允许继续讨论目标与范围，但不授权实现。
