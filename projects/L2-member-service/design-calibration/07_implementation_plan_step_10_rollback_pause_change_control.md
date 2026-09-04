# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 10
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §10

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | rollback_pause_change_control |
| next_allowed_action | Step 11 commit_review_delivery |
| implementation_allowed | false |

## 本步输入

Step 6 boundary 与提交边界、Step 7 门禁矩阵、Step 8 依赖姿态、Step 9 Spike/风险/OQ、代码实施台账规范。

## SOP 问题回答

字段、DTO、状态、Port、scope、version、cursor、outbox source、job report、config binding、evidence source 或 phase boundary 缺口必须暂停并回写 owning document。当前 boundary 的未提交改动可以在实现仓安全回退；已提交 boundary 优先新增修复 commit，未经用户明确不得 amend/rebase 或回退其他用户改动。门禁失败保留原始 artifact/report，修复后用新 baseline/new run 重跑。外部依赖不可用时只能按正式 disabled/blocked/unknown 姿态继续局部工作，不得把 unavailable 变成 success。

## 当前文档问题诊断

缺乏明确暂停/恢复协议会诱使实现者以临时字段、假 adapter、换 key 或删除失败证据继续。需要把暂停触发、证据保留、回写目标、恢复条件和变更传播固定为台账状态。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| 暂停 | 口头判断 | 明确 blocker 触发器与台账状态 |
| 回退 | 可能破坏已验证提交 | 默认只回当前未提交改动 |
| 变更 | 直接改代码 | 先判断 owner，更新 baseline，再重审 boundary |
| 证据 | 失败可能覆盖 | failed run 保留，fixed run 新建 |

## 设计取舍

- 保护已验证历史优先于追求连续编码。
- 设计变更按影响面传播到 03/04/05/06/07，不允许只改实现计划。
- 未闭合依赖允许 local fake slice，但其状态必须在 ledger 中保持 blocked/waiting。

## 结构化中间产物

### 暂停规则表

| 触发条件 | 动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| 目标仓 / Core baseline 不存在 | blocked / wait_design | 路径检查、台账 | 仓与 baseline 固定 |
| 字段/DTO/状态/Port 无法 1:1 | 暂停并回写 03 | 行号、影响 boundary | 新 baseline + 重审 |
| config/profile/secret binding 缺口 | 暂停并回写 04 | config diff / validation | 04 固定并重跑 |
| suite/AC/VF/evidence 不一致 | 暂停并回写 05/06 | matrix diff | 新测试/验收 baseline |
| 越过 boundary 或混入用户改动 | 停止当前修改 | git status/diff | scope 清理并复核 |
| redaction/dependency/report audit 失败 | hard stop | failed artifact/report | fixed run + audit pass |
| Query 写入或 Job 修复 truth | VETO stop | failing test/trace | 代码/设计修复并复验 |
| sibling unavailable / timeout | 保持 blocked/unknown/gap | adapter outcome | 正式合同或 controlled seam |

### 回退规则表

| 场景 | 默认动作 | 禁止动作 |
|---|---|---|
| 当前 boundary 未提交失败 | 仅回退当前 boundary 的授权改动 | 回退用户改动或其他 boundary |
| 已提交 boundary 发现设计缺口 | 新建 fix boundary/commit 或回设计 | 擅自 amend/rebase/reset |
| gate failed | 保留 failed run，修复后新 run | 覆盖或删除失败证据 |
| 上游 baseline 变化 | 停止 successor，重新 Design Gate | 继续用旧 baseline |
| 外部 provider 变化 | 更新 04/08 绑定并重审 | 在 domain 临时适配产品 |

### 变更控制表

| 变更类型 | owning source | 传播目标 | 处理 |
|---|---|---|---|
| object/protocol/flow/state/persistence/idempotency | `03-详细设计.md` | 受影响 boundary、05、06、07 | controlled reopen |
| profile/default/adapter/CLI/env/secret | `04-配置设计.md` | 相关 gate 与 boundary | config baseline refresh |
| suite/TC/artifact/report/gate | `05-测试方案.md` | 07 gate matrix、06 evidence | test baseline refresh |
| AC/VF/risk/final decision | `06-验收标准.md` | 07 completion/handoff | acceptance baseline refresh |
| phase/boundary/order/commit | `07-实施计划.md` | ledger/skeleton | replan + new identity if needed |
| reusable experience | standards / SOP / project memory | project + standard | 先判断归属再沉淀 |

### 恢复实施流程

```text
blocker recorded
  -> owning source fixed or explicitly remains blocked
  -> new design baseline fixed
  -> current boundary Design/Scope Gate repeated
  -> worktree scope checked
  -> failed gate rerun with new run_id
  -> Commit/Handoff Gate
  -> successor activation
```

关键说明：
- 图表达恢复条件顺序，不表达实现调用链。
- failed artifact 必须保留，fixed run 不能复用旧 run_id。
- 任何 unknown 都不能通过换 key 或 scheduler retry 被升级为 success。

### 回退 / 变更停审审计

| 审计项 | 结论 |
|---|---|
| 暂停触发器覆盖设计/门禁/依赖/范围 | pass-designed |
| 回退保护已验证历史 | pass-designed |
| 变更有 owning source | pass-designed |
| 恢复需要重审与新 evidence | pass-designed |

## 回填草稿

正式 §10 应包含暂停、回退、变更传播和恢复流程，强调 implementation ledger 的 blocked/wait_design 状态及失败证据保留规则。

## 待确认事项

- 实现仓团队对修复 commit、amend/rebase 和 user-change 隔离的具体工具约定。
- 各上游 owner 的 baseline 发布方式。

## 进入下一步条件

暂停、回退、变更和恢复规则与 boundary/gate/ledger 一致，允许进入 Step 11 提交、评审与交付纪律。
