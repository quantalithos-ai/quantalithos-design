# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填目标：正式 `07-实施计划.md` §10

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 10 / rollback_pause_and_change_control |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 11；收稳提交、评审与交付纪律 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 16 boundary 及 gate matrix | Step 6/7 | completed / stop_review |
| 风险/Spike/截止点 | Step 9 | completed / stop_review |
| 状态/UoW/unknown 红线 | 03 §9～§12、06 §8/§11 | formal / stop_review |
| 工作区安全与台账规范 | 07 书写规范、代码实施台账规范 | read |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 哪些情况必须暂停？ | 设计字段/DTO/state/ref/metadata/idempotency 缺口、gate fail、owner/tool unknown、scope 越界、raw leak、VETO 风险、用户改动保护无法证明、baseline 变化。 | 07 SOP §2.10、06 §11/§12 |
| 何时可回退？ | 当前 boundary 未提交且 gate 失败时只修复当前边界；已验证 boundary 只能通过安全 revert/新修复提交回退，不改写历史事实或用户改动。 | 07 规范 §4.8、台账规范 §7 |
| 依赖不可用能否继续局部实施？ | 只允许不依赖该能力的 local/negative boundary；受影响 boundary 必须 blocked/wait_design。 | Step 8、03/06 blocker map |
| 设计变化怎么办？ | 暂停当前 boundary，回写正式真相源和 calibration，固定新 baseline，重新审计受影响 boundary；不能代码内临时取舍。 | 真相源标准 §九 |
| 如何恢复？ | 读取项目/当前 boundary 台账，确认新 baseline、required reads、Design/Scope Gate，再从唯一允许动作继续。 | 台账规范 §十一 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 实现仓可能有用户未提交改动 | 回退或提交可能覆盖用户工作 | Worktree Gate 先记录；只处理 allowed scope；不得 reset/checkout 用户文件 |
| unknown effect 不能通过普通回退消除 | 可能重复外部副作用 | 保留原 key/attempt/checkpoint，转 probe/manual；禁止换 key重放 |
| 设计 baseline 变化会让台账失真 | 旧证据与新设计混淆 | 关闭/标记旧 boundary，创建新 baseline，重跑受影响 gate |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 暂停 | 泛化“遇阻暂停” | 结构化触发、责任、证据、恢复条件 | 可执行 |
| 回退 | 未区分 local code 与 external effect | 代码提交可回退，external unknown 只能 probe/manual | 安全红线 |
| 变更 | 可能直接改计划 | 按影响范围回写 03/04/05/06/07 并刷新 baseline | 保持真相源 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 任何失败都 reset 到上一个 commit | 简单 | 破坏用户改动、丢失 unknown/provenance | 拒绝 |
| 所有失败都继续并记录风险 | 进度快 | 把设计/安全缺口推给实现者 | 拒绝 |
| 按失败类型选择 pause/fix/revert/probe/design-rebaseline | 安全、可恢复、审计清晰 | 需要台账纪律 | 采用 |

## 结构化中间产物

### 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 字段/DTO/ref/state 缺失或冲突 | `gate_status=blocked`、`next_allowed_action=wait_design` | 设计者/实现者 | blocker note、受影响章节 | 正式设计回写、新 baseline、重复复核 |
| metadata/UoW/idempotency authority 未闭合 | 暂停 mutation boundary | 设计者 | boundary ledger、缺口引用 | 03/04 明确定义 carrier/store/transition |
| owner/source/review/probe unknown | 暂停危险 action；Query 保留 degraded | 实现者/owner | typed blocked result、probe/check record | 正式 contract + fresh capability |
| dirty/untracked/path/symlink/lock unknown | 禁止 apply/overwrite | 实现者/tool owner | inspection result、path safety record | safe known state 或人工决策 |
| Test/Build/Redaction/Dependency gate fail | `fix_gate_failure`，不进下一 boundary | 实现者 | failed artifact/report、failure reason | 当前 boundary 重跑通过 |
| VETO/S defect | 停止 phase/交接 | 实现者/测试/验收负责人 | veto checklist、defect record | 修复并原 family 复验 |
| Scope Gate 越界 | 停止提交，拆出无关改动 | 实现者 | staged diff、scope note | allowed scope-only diff |
| 用户已有改动被触碰 | 立即停止，保护工作区 | 实现者 | initial/current status、文件清单 | 用户明确处理并重新核 Scope Gate |
| design baseline 改变 | 关闭当前门禁，刷新台账 | 设计者 | old/new baseline refs | 新 baseline 完成审计 |
| 证据含 raw secret/body/path/Git output | 停止 report/handoff，隔离载体 | 测试/安全负责人 | redaction failure record | 清理并从原始安全输入重跑 |

### 回退规则表

| 场景 | 允许动作 | 禁止动作 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交、纯本地 gate fail | 在当前 allowed scope 修复；必要时丢弃本 boundary 新增未提交文件 | reset/checkout 用户文件、跨 boundary 修复 | gate 重跑通过 |
| 已提交 boundary 行为缺陷 | 新 `fix` boundary 或按项目规则安全 revert | 改写已交付 commit、混入下一功能 | 原 TC/同 family/相关 audit 复验 |
| external effect outcome unknown | 保留 identity/digest/attempt/checkpoint，执行 formal probe/manual | retry、换 key、push/merge/rebase/stash | known result 或人工 resolution |
| partial materialization | 保留 checkpoint、cursor 不推进 | 自动清理/重放/覆盖 dirty | safe recovery plan + revalidation |
| 设计变更导致 boundary 不再适用 | 标记旧 boundary superseded/blocked，重新切分 | 在代码中静默适配两个真相 | 新 boundary/baseline 通过 review |
| 证据/report 失败但代码不变 | 只重跑 report/check；保留原 raw run | 用 latest 覆盖旧 run | pairing/redaction/report audit 通过 |

### 变更控制表

| 变化类型 | 必须回写 | 影响范围 | 允许继续条件 |
|---|---|---|---|
| 新字段/DTO/ref/state/transition | 03，必要时 05/06 | 相关 boundary、TC/AC/EV | 新 design baseline + 受影响复核 |
| 新 config leaf/source/activation | 04，05/06 | config/profile/builder/evidence | 42-leaf/count/source audit 更新 |
| owner/API/error/version 变化 | 01/03、相关 05/06 | adapter/flow/probe | typed mapping 和 blocker matrix 更新 |
| test case/suite/evidence path 变化 | 05/06/07 | gate/report/handoff | traceability 和 report schema 重审 |
| phase/boundary 拆分或合并 | 07 flow、Step 6、ledger skeleton | all downstream boundaries | 旧台账废止/新 skeleton 预创建 |
| 用户新增功能/历史工具启用 | 00～03 先重审 | scope and all gates | 明确 scope trigger 后才进入 07 |
| implementation repo/package choice | 03/04/07 | PH-01 onward | local choices fixed and baseline recorded |

### 恢复状态图

```text
[gate failure or blocker]
  | classify
  +--> [design gap] -> wait_design -> [new design baseline] -> read_docs
  +--> [test/build/redaction] -> fix_gate_failure -> run_gates
  +--> [unknown external effect] -> probe/manual -> [known or resolution]
  +--> [scope/worktree] -> protect user changes -> open_boundary
  +--> [accepted boundary] -> commit -> handoff -> start_next_boundary
```

关键说明：
- 图表达实施状态恢复关系，不表达 Git 命令或外部 owner 内部状态。
- `blocked` 不得直接跳到 `implement`；必须经过相应恢复条件和 Gate。
- external unknown 不通过代码回退伪造为 failed/known。

### 变更审查停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| pause triggers | pass (plan) | 覆盖设计、门禁、依赖、VETO、工作区和证据 |
| rollback safety | pass (plan) | 保护已验证阶段和用户改动；unknown 不回退成 known |
| change control | pass (plan) | 变化回写真相源并刷新 baseline |
| recovery | pass (plan) | 台账恢复顺序与合法 next action 一致 |

## 回填草稿

正式 §10 将回填暂停、回退、变更、恢复表和状态图；明确实现者不得自行补设计、不得覆盖用户修改、不得用 reset/checkout 或 blind replay 解决 unknown。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 实现仓工作区保护策略 | Worktree Gate | 01-a 前 |
| design baseline 更新责任人 | 所有 blocker | 实现移交前 |
| 外部 effect probe/manual owner | PH-04/05 | 04-b/05-b 前 |

## 进入下一步条件

- [x] pause/rollback/change/recovery 条件明确。
- [x] 用户改动和 unknown effect 保护规则明确。
- [x] 规则与 boundary/gate/blocker 表一致。
