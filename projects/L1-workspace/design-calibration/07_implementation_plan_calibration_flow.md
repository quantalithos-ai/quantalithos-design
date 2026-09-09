# L1-workspace 07 实施计划校准流程

> 模式：`full-restart + single-agent-serial`；承接停审的 00~06；07 完成后停审，不实现代码。
> 当前状态：Step1~13 已完成校准，正式 07 已装配并停审。
> 事实边界：所有阶段、任务、boundary、ledger、gate、脚本和 skeleton 均为 planned/blocked/waiting；没有实现仓、commit、run、测试结果、artifact、report、evidence 或 readiness。

## 1. 文档级恢复点

| 项 | 当前值 |
|---|---|
| current_document | `07-实施计划.md` |
| current_step | `13` |
| current_module | `formal_assembly` |
| gate_status | `formal_stop_review` |
| next_allowed_action | `wait_for_user_authorization_after_07` |
| formal_07_write_allowed | `false` |
| implementation_write_allowed | `false` |
| implementation_execution_allowed | `false` |
| upstream/local blockers | WS-UP-001~008/006-S；WS-LOCAL-001~003 |

## 2. 本轮目标与边界

把 03 详细设计、04 配置、05 测试和 06 验收转译为可执行的阶段化实施路径。不得补上游 truth、不得创建实现仓、不得提交、不得执行测试、不得伪造 commit hash/run/evidence/readiness。07 只在 `projects/L1-workspace/` 下创建计划文档、项目实施台账和 planned boundary skeleton。

## 3. Step 状态

| Step | 主题 | 状态 |
|---:|---|---|
| 1 | 实施输入边界 | completed / external_slots |
| 2 | 实施目标与范围 | completed / no_code_scope |
| 3 | 前置条件与阅读清单 | completed / blockers_preserved |
| 4 | 实施对象与交付物 | completed / planned_surface |
| 5 | 阶段与依赖顺序 | completed / phase_graph_fixed |
| 6 | 任务、批次与提交边界 | completed / boundary_skeleton_planned |
| 7 | 测试与验收门禁 | completed / gates_planned |
| 8 | 配置、环境与依赖准备 | completed / external_blocked |
| 9 | Spike、风险与待确认 | completed / risks_classified |
| 10 | 回退、暂停与变更控制 | completed / rules_fixed |
| 11 | 提交、评审与交付纪律 | completed / no_commit_now |
| 12 | 实施完成判定 | completed / not_satisfied |
| 13 | 正式文档装配 | completed / formal_stop_review |

## 4. 实施事实等级

- `planned`：设计了未来动作或边界，不代表文件/代码存在。
- `blocked`：必需 owner、bus、durable、binding、crypto、实现仓或 baseline 未闭合。
- `waiting`：等待用户、owning project、配置提供方或后续文档。
- 不允许写 `implemented`、`committed`、`tested`、`passed`、`evidence`、`signoff`、`readiness` 的当前事实。

## 5. 全局阶段与 boundary 规则

阶段按可验证纵切链路，而不是按对象、函数或文件堆叠。每个阶段必须有输入、输出、测试/验收门禁、批次、提交边界和暂停条件；每个 boundary 必须有 `design_baseline`、`required_reads`、`allowed_scope`、`forbidden_scope`、`required_checks`、Commit Gate、Handoff Gate 和独立台账文件。

## 6. 未来实施顺序

```text
PH-01 foundation / composition
  -> PH-02 contracts / domain invariants
  -> PH-03 local command-query vertical slice
  -> PH-04 projection / consumer / idempotency
  -> PH-05 recovery / generation / invalidation
  -> PH-06 config / adapters / controlled seams
  -> PH-07 API-worker-jobs / reports / evidence
  -> PH-08 formal seam conformance / handoff
```

formal seam 未闭合时，PH-08 和相关正向 boundary 保持 blocked；不以 fake 替代。

## 7. Planned ledger / skeleton 规则

项目级台账：`design-calibration/implementation_execution_ledger.md`。每个 boundary 台账：`design-calibration/implementation-boundaries/<boundary_id>.md`。所有骨架只记录 planned/blocked/waiting；实现者未来必须先读台账并通过 Design Gate 才能把 boundary 从 planned 推进为 current。当前不创建目标实现仓源码。

## 8. 进入完成审计

正式 07 已有 13 章、阶段图、任务/批次/提交矩阵、门禁、依赖/配置、风险/回退、提交纪律、完成判定和参考；implementation ledger 与全部 boundary skeleton 均已存在且未伪造 commit/run/evidence。已完成静态审计并将 flow/ledger 标为 `formal_stop_review`，等待后续用户决定是否进入实现。
