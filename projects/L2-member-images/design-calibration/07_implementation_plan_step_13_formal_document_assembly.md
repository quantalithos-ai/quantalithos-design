# 07 Step 13：正式实施计划文档装配与总审计

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填目标：`projects/L2-member-images/07-实施计划.md`
> 本步状态：`completed_stop_review`
> 事实边界：本步只装配设计期实施计划、implementation ledger 和 planned boundary skeleton；不创建实现代码、不执行测试、不生成实际证据、不提交 commit。

## 1. 装配输入与顺序

正式 07 由 Step 1~12 的收口结论装配，不直接复制旧 README 或旧实施计划。装配前已重新读取 `实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`代码实施台账与门禁规范.md`、`子项目目录与代码文件组织规范.md`、Rust 规范、正式 00~06 和本项目 07 calibration。

```text
Step 1 input boundary
  -> Step 2 scope
  -> Step 3 prerequisites/reading
  -> Step 4 objects/deliverables
  -> Step 5 phases/dependencies
  -> Step 6 tasks/boundaries
  -> Step 7 test/acceptance gates
  -> Step 8 config/environment/dependencies
  -> Step 9 spikes/risks/questions
  -> Step 10 rollback/pause/change
  -> Step 11 commit/review/handoff
  -> Step 12 completion criteria
  -> formal 07 + ledgers + skeletons
```

## 2. 正式章节来源映射

| 正式章节 | 主校准来源 | 主要上游 authority | 装配结论 |
|---|---|---|---|
| §1 上游关系 | Step 1 | 正式 00~06、历史材料策略 | active formal 优先，pending 不闭合 |
| §2 目标与范围 | Step 2 | 正式 00/01/02/03 | 五 capability、15 F、C-MI-1~5、非范围 |
| §3 前置与阅读 | Step 3 | SOP、目录/Rust/ledger 规范 | 目标仓、baseline、阅读矩阵、永久记忆 |
| §4 对象与交付物 | Step 4 | 正式 02/03/04/05 | 七职责单元、代码/配置/测试/证据面 |
| §5 阶段与依赖 | Step 5 | 正式 03/04/05/06 | 八 Phase、依赖方向、24 Gate 入口 |
| §6 任务与提交 | Step 6 | 正式 03~06、可落码标准 §九 | 24 boundary、72 batch、逐 boundary 复核 |
| §7 测试与验收门禁 | Step 7 | 正式 05/06 | suites、checks、same-run、AC/VETO 方向 |
| §8 配置/环境/依赖 | Step 8 | 正式 03/04/05 | 五域 21 key、依赖类型、fake/profile |
| §9 Spike/风险/待确认 | Step 9 | 00/03/04/05/06 risks | SP/R/MI-UP/Q-MI/B/PF 列表 |
| §10 回退/暂停/变更 | Step 10 | SOP、ledger 规范 | pause/rollback/rebaseline/reopen |
| §11 提交/评审/交付 | Step 11 | commit/ledger/Rust 规范 | 一 boundary 一 commit、message、handoff |
| §12 完成判定 | Step 12 | 05/06、ledger 规范 | BoundaryComplete、phase exit、未完成项 |
| §13 参考 | 本 Step | 所有标准与正式文档 | 参考、历史和事实边界 |

每章在正式文档开头标注具体 calibration 来源和延伸阅读；过程性问题回答、差异审计和停审记录留在本目录，不在正式正文中伪装成执行报告。

## 3. 装配前静态检查清单

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 章节完整性 | 正式 07 含规范要求的 13 章且顺序一致 | `pass-designed` |
| 来源追溯 | 每章列出具体 `design-calibration/07_implementation_plan_step_*.md` | `pass-designed` |
| phase/boundary | 八 Phase、24 boundary、24 Gate、72 planned batch 一致 | `pass-designed` |
| current identity | 仅 `commit-01-a` 为 current | `pass-designed` |
| future status | 其余 boundary `planned / wait_until_current` | `pass-designed` |
| blocker | B01/B02/B03/OPEN/PF、MI-UP/Q-MI 显式保留 | `pass-designed` |
| evidence truth | 无真实 hash/run/artifact/report/EV/verdict/signoff/readiness | `pass-designed` |
| directory scope | 本轮本 agent 只新增/修改 `projects/L2-member-images/`；其他工作区改动不纳入本轮 | `pass-designed` |
| implementation state | `not_started`; acceptance `not_entered` | `pass-designed` |

## 4. 台账与 skeleton 装配

本步同时创建：

- `design-calibration/implementation_execution_ledger.md`：项目级实施状态、current boundary、24 boundary 汇总、blocker 和恢复协议。
- `design-calibration/implementation-boundaries/commit-*.md`：24 个 boundary planned ledger skeleton。每个 skeleton 含 header、status、required reads、allowed/forbidden scope、three batches、Required Checks、Gate Matrix、Design/Commit/Handoff Gate、Blockers、Commit Record 和 next action。

预创建不等于授权实现：只有项目级 ledger 指定为 current 的 boundary 才能被实现者打开；当前 `commit-01-a` 因 target repo 缺失仍 `blocked / wait_design`，其余均 `planned / wait_until_current`。

## 5. 总审计结果

| 审计面 | 结果 | 说明 |
|---|---|---|
| 文档主链 | `pass-designed` | 00→07 顺序不跳步，07 只承接不重定义上游。 |
| 模块分层 | `pass-designed` | 七职责 workspace 是 planned code boundary，不是七个服务/进程。 |
| 依赖裁剪 | `pass-designed` | active sibling compile dependency 为零；其他关系按 ref/runtime/event/adapter/fake。 |
| 正向 blocker | `explicit` | B01/B02、B03、OPEN/PF、MI-UP/Q-MI 不被 07 关闭。 |
| 测试/证据 | `pass-designed` | TC/EV/suite/check/path/same-run 规则已绑定，实例均未生成。 |
| commit/handoff | `pass-designed` | 24 boundary、Commit Gate、Handoff Gate 与 ledger 路径一致。 |
| 实际实现 | `none` | 目标仓不存在，未写代码、未运行测试、未提交 commit。 |

## 6. 回填草稿与剩余事项

### 正式 07 回填结论

本项目实施计划采用八个可验证 Phase、24 个 planned commit boundary 和每 boundary 三个 batch；实现前必须完成设计闭环、范围、工作区、测试/证据和提交/移交门禁。当前唯一 current boundary 为 `commit-01-a`，因目标仓和 immutable baseline 未固定而 `blocked / wait_design`；未来 boundary 均等待项目级台账推进。所有正向 mutation、stored replay、recovery、qualification、Artifact acceptance、consumer confirmation、event publisher 和 readiness 继续按 blocker 处理。

### 剩余待确认

1. 用户/项目负责人何时授权创建或核验目标实现仓并固定 baseline。
2. 上游/sibling owner 关闭 MI-UP/Q-MI、B/PF 后是否改变 formal 03~07 的边界或分母。
3. future implementation/test/evidence owner 与实际 runner 的身份和环境。

## 7. Step 13 停审结论

| 项 | 结论 |
|---|---|
| formal `07-实施计划.md` | 已按 13 章装配并可审查 |
| implementation ledger | 已创建 planned 项目级台账 |
| boundary skeleton | 24 个均已预创建；仅 `commit-01-a` current，且 blocked |
| 真实 implementation | 未开始 |
| 测试/run/artifact/report/evidence | 未开始/未生成 |
| acceptance/release/signoff/readiness | 未进入 |
| commit | 未提交 |

**Step 13 结论：`completed_stop_review`。**

## Step 状态

`completed_stop_review`

## 本步输入

Step 1~12、实施计划书写规范、台账规范

## 本步输出

13章正式文档、项目 ledger、24 skeleton、总审计

## 事实边界

07 装配完成但实现/验收未进入；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 正式 07 是否含 13 章？——是。
2. 每章是否回指具体 calibration？——是。
3. 24 boundary/skeleton/Gate 是否一致？——是。
4. 是否存在实现或验收事实？——否，全部保持 planned/not_started/not_generated。
## 当前文档问题诊断

- 正式正文不能复制过程性讨论或旧实施计划。
- planned skeleton 存在不等于实现授权。
- current boundary 必须唯一且 blocked。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 正式 07 | 尚未创建 | 13 章装配并标注来源/延伸阅读 |
| 台账 | 未创建 | 项目级 + 24 boundary skeleton |
| 状态 | 06 停审 | 07 停审；current 01-a blocked |
## 设计取舍

- 正式正文只承载收口结论，过程审计留在 calibration。
- 预创建全部 skeleton，避免实现期临场补台账。
- 保留所有 blocker 和无执行事实。
## 结构化中间产物

本步结构化产物是章节来源矩阵、装配前静态检查、台账/skeleton 装配和总审计结果。
