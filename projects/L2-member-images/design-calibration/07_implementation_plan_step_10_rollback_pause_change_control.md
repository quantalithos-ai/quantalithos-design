# 07 Step 10：回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填目标：正式 `07-实施计划.md` §10
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：本文件定义 future implementation 的暂停、回退、恢复和设计变更协议；当前没有实现仓、commit、运行记录或可执行回退对象。

## 1. 控制原则

回退保护已验证的设计/代码增量，不是删除用户文件、重写历史或绕过 blocker。任何 schema、state、port、error、config key、artifact schema、phase 或 owner boundary 变化，必须先回写拥有该真相源的正式文档，再创建新的 design baseline；实现 agent 不得在代码中临时取舍。

```text
boundary ledger
  -> Design/Scope/Worktree gate
  -> Batch A/B/C
  -> Test/Evidence gate
  -> Commit gate
  -> Handoff gate
  -> explicit successor activation
```

当前唯一 current boundary 为 `commit-01-a`，其状态为 `blocked / wait_design`；未来 boundary 不能因为文件已预创建而自动激活。

## 2. 必须暂停的情况

| 触发条件 | 立即动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| target repo 不存在、不是 git worktree 或用户改动无法区分 | 停止写入实现 | preflight 输出与台账状态 | 目标仓、用户文件清单和 baseline 固定 |
| formal 03/04/05/06 与 boundary schema 冲突 | 停止当前 batch/boundary | 冲突文件/行号、影响对象 | 真相源回写、新 baseline、Step 6/7 重核 |
| 字段、DTO、support carrier、状态或 transition source 缺失 | 不让实现者补 schema | 缺口表、affected gate | 正式设计闭环并复核 |
| B01/B02/B03/OPEN/PF 影响的正向路径 | 只保留 pure/no-write/marker/gap | blocker id 与 safe disposition | owner 修复并重开对应 Step |
| MI-UP/Q-MI owner 合同未闭 | 不调用外部正向 seam | pending ref/gap | sibling/owner 正式提供 contract 与 oracle |
| Query 产生写、fake 产生成功、outbound 非零或 redaction leak | S/VETO stop | 原始失败与新 run 边界 | 修复、全量受影响回归、06 复核 |
| artifact/report/EV pairing 缺失或跨 run | 标 `not_evaluable` | raw/report/index 缺失记录 | 新固定 run 重新生成并配对 |
| 需求/优先级/责任边界变化 | 停止当前计划 | change request 与影响矩阵 | 用户/owner 批准并重做受影响文档 |

## 3. 回退规则

| 回退层级 | 允许条件 | 操作边界 | 禁止动作 |
|---|---|---|---|
| Batch 回退 | 当前 batch 失败且尚未形成提交 | 丢弃未验证的本地候选改动，保留台账/失败记录 | 覆盖已验证 truth、改写历史 |
| Boundary 回退 | Gate/Commit Gate 失败，需回到同 boundary 设计 | 回到该 boundary 的最后一个通过 gate；仍按同一 baseline | 跳到 successor 或用新字段绕过 |
| Phase 回退 | 跨 boundary 依赖或 phase 越界 | 停止 phase，回到前一已闭合 boundary，保留失败证据 | 跨 phase cherry-pick 未审设计 |
| Design 回写 | 设计真相源不完整或变更 | 修改正式 03/04/05/06 与 calibration，再生成新 baseline | 在实现仓私补 schema/port/state |
| Evidence 重跑 | raw/report/index 不完整、脱敏或配对失败 | 保留原 run 为失败/不可裁决，使用新 run | 覆盖原 raw、跨 run 拼接 |

当前设计仓没有实现代码可回退；“回退”在本轮仅表示 future implementation protocol，不表示已经执行任何 destructive command。

## 4. Gate 失败后的恢复状态机

| 当前状态 | 可执行动作 | 不可执行动作 | 转移条件 |
|---|---|---|---|
| `planned / wait_until_current` | 读取项目 ledger、前置文档 | 写实现、跑该 boundary gate | 前序 handoff + current 激活 |
| `current / pending` | 补当前 boundary 要求的设计/检查 | 进入下一 boundary | required checks 有结果 |
| `blocked / wait_design` | 回写设计、等待 owner、更新 blocker | 继续实现或提交 | blocker 关闭并重核 |
| `failed / fix_gate_failure` | 只修复失败门禁 | 扩大范围、改无关文件 | 重跑同一 gate 且 pair 有效 |
| `not_evaluable` | 修复 artifact/report 生成链并新 run | 手写 EV/pass | same-run raw/report/index 完整 |
| `handoff / review_required` | 提交 06 reviewer 所需草稿 | 生成 verdict/signoff/readiness | 授权角色完成审查（仍不由实现 agent裁决） |

## 5. 变更分类与审批边界

| 变更类型 | 示例 | 必须回写 | 批准前行为 |
|---|---|---|---|
| 文档排版 | 链接、表格、措辞，不改变语义 | 当前 calibration 文档 | 可在设计仓修订后静态审计 |
| 设计修复 | 字段、DTO、状态、port、error、UoW、replay、recovery | 03；受影响 04/05/06/07 | 当前/受影响 boundary blocked |
| 配置修复 | key、source、profile、sensitive、activation、rollback | 04，并重核 03 binding | 不新增 hidden default/alias |
| 测试/证据修复 | TC/EV/suite/schema/path/digest 规则 | 05/06，并重核 07 Gate | 不降低分母、不手写结果 |
| owner 合同变化 | Role mapping、component release、Artifact、consumer、event | 对应 owner 正式文档与 MI-UP/Q-MI | 本仓只改 pending/ref/gap 口径 |
| phase/boundary 变化 | 新增/删除/合并 boundary | 07 Step 5/6/11/12/13 与所有 ledger/skeleton | 冻结实现，重新做跨边界审计 |
| 需求/架构变化 | 新能力、责任转移、产品绑定 | 00/01/02 起逐级重建 | 不在 07 内自行吸收 |

变更记录至少包含：change id、原因、影响 formal 文档/Step/boundary、旧/新 baseline、测试/验收影响、owner、审批状态和恢复动作。当前不填写真实编号、hash、人员或日期之外的执行事实。

## 6. 保护历史与证据

- 已产生的 future raw artifact 不得被 report script 覆盖；失败、blocked、infra、invalid、cancelled 均保留原始状态。
- design baseline、boundary ledger、Gate 结果和 handoff 必须能相互回指；缺失配对时将当前输出标为 `not_evaluable`。
- 不得用 `latest`、stdout、cache、fake、ACK、bare digest 或手写 Markdown 恢复成功状态。
- 任何 recovery job 不能把 `ProjectionFreshnessLifecycle::Unavailable` 改成 `Rebuilding/Fresh`，不能修复 local truth，不能新增未定义 lease/TTL/cleanup。
- 回退不修改外部 owner truth、live memory/checkpoint/workspace、container、Artifact、consumer、event 或 governance approval。

## 7. 回填草稿、待确认事项与进入下一步

### 回填草稿（正式 §10）

实施按 boundary ledger 驱动；设计冲突、环境缺失、门禁失败、owner pending、证据不配对和 VETO 违规都有明确 pause/rollback/change/recovery 动作。回退只回到已验证边界，设计变化必须回写正式真相源并冻结新 baseline；当前所有正向恢复仍受 B01/B02、B03、OPEN/PF 和 MI-UP/Q-MI 限制。

### 待确认事项

1. 未来实现仓实际分支策略和用户改动保留方式。
2. 目标仓采用的 artifact writer、report generator 和新 run 生成工具。
3. owner closure 后是否需要调整 boundary 数量、Gate 或测试分母。

### 进入 Step 11 条件

- pause、rollback、change、recovery 状态和责任明确。
- 设计偏离必须回写的路径和重新核验条件明确。
- 规则与 24 boundary、24 Gate、台账状态机和 evidence pairing 一致。

**Step 10 结论：`completed_with_explicit_blockers`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

Step 6/7/8/9、ledger 与变更规范

## 本步输出

pause、rollback、rebaseline、reopen、证据保护

## 事实边界

不执行 destructive action；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 何时暂停？——设计冲突、门禁失败、环境/owner 缺失、VETO、证据不配对或需求变化。
2. 如何回退？——只回到已验证 batch/boundary，保留失败台账和 raw。
3. 如何恢复？——正式文档回写、新 baseline、重复 Design/Scope/Gate review、ledger 显式激活。
4. 如何处理变更？——按文档/设计/配置/测试/owner/phase 分类，不在实现端临时补口。
## 当前文档问题诊断

- “回退”可能被误解为删除用户改动或改写历史。
- PF/OPEN recovery 缺口不能用自造 lease/TTL/edge 解决。
- evidence 失败不能覆盖原 run。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 暂停 | 泛化处理 | 明确触发、责任、证据和恢复条件 |
| 回退 | 未区分层级 | batch/boundary/phase/design/evidence 分层 |
| 变更 | 可能现场改代码 | 强制回写真相源和新 baseline |
## 设计取舍

- 保护已验证增量优先于追求连续编码。
- 不使用 destructive reset 或历史覆盖。
- 将 evidence 重跑与业务回退分开，避免跨 run 污染。
## 结构化中间产物

本步结构化产物是 pause 表、rollback 表、状态机、变更分类和证据保护规则。
