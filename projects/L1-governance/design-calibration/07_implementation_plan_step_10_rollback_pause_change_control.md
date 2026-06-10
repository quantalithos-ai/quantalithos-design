# Step 10. 定义回退、暂停与变更控制

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填章节: `07-实施计划.md` §10 回退、暂停与变更控制

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义回退、暂停与变更控制 |
| 当前状态 | 进行中;按触发类型分批写入 |
| 输入基线 | Step 6 commit boundary;Step 7 门禁矩阵;Step 8 依赖准备;Step 9 风险与待确认事项 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 11 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 commit boundary | 已完成 | 定义可回退单位和提交前暂停点 |
| Step 7 门禁矩阵 | 已完成 | 定义门禁失败后的处理 |
| Step 8 外部依赖准备 | 已完成 | 定义依赖不可用时暂停 / 降级 / residual |
| Step 9 风险表 | 已完成 | 定义 blocker、risk、open question 和截止点 |
| 可落码性标准 §九 | 已存在 | 定义设计真相源冲突时的暂停与回写原则 |

## 3. SOP 问题回答

1. 哪些情况必须暂停当前阶段。

   回答: 目标仓/core dependency 不可用、设计真相源冲突、字段/DTO/状态/port/version/outbox/job/evidence 闭环缺失、blocking gate 失败、redaction/dependency/report audit 失败、VETO 命中、phase boundary 越界、无关改动混入提交,均必须暂停当前 boundary。

2. 哪些情况允许回退到上一个提交边界。

   回答: 已提交 boundary 本身通过,当前 boundary 的实现试探失败且没有设计变更时,允许回退当前 boundary 的未提交改动。不得回退用户改动或已验证历史提交,除非用户明确要求。

3. 哪些情况必须回写详细设计或测试方案。

   回答: 设计闭环缺口必须回写 `03`;配置/entry 参数缺口回写 `04`;suite/artifact/report/evidence 规则缺口回写 `05`;AC/VETO/final decision 口径缺口回写 `06`;phase/boundary/commit/gate 计划缺口回写 `07`。

4. 门禁失败后如何处理。

   回答: blocking gate 失败不得提交。若失败是实现 bug,修复后重跑当前 boundary 门禁;若失败暴露设计冲突,暂停并回写设计;若失败是测试工具缺口,修复测试工具并保留 failed artifact。

5. 外部依赖不可用时是否允许继续局部实施。

   回答: 编译期 core dependency、目标仓、P0 fake/runtime/profile 不可用时不能继续相关 boundary。P1/P2 real-like/production-like 不可用不阻断 P0,只能记录 residual。

6. 恢复实施的条件是什么。

   回答: blocker 已修复或设计已回写并固定新 baseline;当前 boundary 的开工前复核重新通过;工作区只含当前 boundary 改动;相关门禁重跑通过。

7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理。

   回答: 立即暂停当前 boundary,整理文件行号、影响范围和建议闭口点,回写设计真相源并重复核;实现者不得在代码中自行补字段、状态、DTO、port 或 phase scope。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 9 | blocker 已识别但未转成操作规则 | 实施时可能继续推进 | 本 Step 定义 pause/change/recover |
| Step 6 | commit boundary 是回退单位 | 需要说明何时可回退 | 本 Step 定义 rollback 规则 |
| Step 7 | 门禁失败处理较分散 | 需要统一失败处理 | 本 Step 定义 gate failure matrix |
| Step 8 | 外部依赖不可用处理分散 | 需要转为实施控制 | 本 Step 定义 dependency handling |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 暂停条件 | 分散在风险 / 门禁 | 统一为 pause 触发表 | 防止实现者临场取舍 |
| 回退条件 | 未集中定义 | 以当前 boundary 未提交改动为默认回退范围 | 保护已验证阶段和用户改动 |
| 设计回写 | 只说必须回写 | 按 `03/04/05/06/07` 分目标 | 提高可执行性 |
| 恢复条件 | 未集中定义 | baseline、复核、工作区、门禁四项 | 防止未修复即继续 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实现者自行选择临时方案继续 | 速度快 | 破坏真相源和可落码性 | 不采用 |
| 一律暂停并回写所有问题 | 保守 | 简单实现 bug 会过度流程化 | 不采用 |
| 区分实现 bug、测试工具 bug、设计真相源冲突、外部依赖不可用 | 精确 | 规则较多 | 采用 |
| 允许回退已验证历史提交 | 能快速清理 | 可能破坏可追溯和用户改动 | 不采用,除非用户明确要求 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 目标实现仓不存在 | pause | 实施者 / 设计者 | `git status` 或路径检查记录 | 创建或确认目标仓,重新跑 PH-01 前置检查 |
| `core-contracts` path dependency 不可用 | pause | 实施者 / core owner | Cargo error, path check | core repo/path 修复或设计改依赖 |
| 字段 / DTO / state / port / version / outbox / job report 闭环缺失 | pause + change | 设计者 | 文件行号、影响范围、建议闭口点 | 回写设计,固定 baseline,重复核 boundary |
| phase boundary 越界 | pause + change | 设计者 | boundary diff / design reference | 调整 Step 6/07 或移动实现到后续 boundary |
| blocking test gate failed | pause | 实施者 | failed artifact/report | 修复实现或测试工具,重跑通过 |
| redaction leak | pause + defect | 实施者 / 安全审查 | redaction report, safe failure refs | 修复泄露,重跑 redaction and affected suites |
| dependency boundary violation | pause + change | 实施者 / 架构审查 | dependency report | 移除依赖或回写架构,重跑 dependency check |
| report-generation-audit / no static evidence failed | pause + change | 实施者 / 测试审查 | report-audit | 修复 generator/source,重跑 audit |
| VETO-GOV-001~013 命中 | pause + defect | 设计者 / 实施者 / 验收者 | VETO evidence/report | 修复并复验;不得风险接受 |
| 无关用户改动混入 boundary | pause | 实施者 | `git status`;diff | 只 stage 当前 boundary;保留用户改动 |
| P1 selected-run unavailable | no P0 pause;record residual | 测试 / 验收 | unavailable marker | 写入 risk acceptance;不计 P0 pass |

### 7.2 回退规则表

| 场景 | 允许回退范围 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交试探实现失败 | 当前 boundary 未提交改动 | 不回退用户文件;不回退已验证提交 | 清理试探改动后重新按 boundary 实施 |
| 当前 boundary 门禁失败且为实现 bug | 当前 boundary 相关改动 | 不用回退替代修复缺陷;不删除 failed artifact | 修复后重跑门禁 |
| 当前 boundary 暴露设计缺口 | 可暂停保留工作区或清理试探改动 | 不继续补 schema;不提交半成品 | 设计回写后重新核对 |
| 已提交 boundary 后发现同 boundary 缺陷 | 新增修复 commit 或经用户要求 amend/rebase | 不擅自改写历史 | 修复门禁通过,记录原因 |
| 发现提交混入无关文件 | 当前提交前 unstaged/staged diff | 不 `git reset --hard`;不删除用户改动 | 重新 staging 当前 boundary 文件 |
| release evidence 生成错误 | 当前 report/evidence generator 改动 and generated artifacts | 不手写 pass;不删除 failed raw artifact | 修复 generator,重跑 release audit |

### 7.3 变更控制表

| 触发条件 | 变更目标 | 动作 | 必须同步 | 恢复条件 |
|---|---|---|---|---|
| object/protocol/flow/state/persistence/idempotency 缺口 | `03-详细设计.md` and calibration | 回写正式设计和必要 calibration | Step 6/7/10 affected boundary | 新 design commit 固定后重复核 |
| config profile / CLI / env / adapter binding 缺口 | `04-配置设计.md` | 回写配置项、profile、failure mapping | Step 8 and affected boundary | config smoke 通过 |
| suite / artifact / report / gate 缺口 | `05-测试方案.md` | 回写 suite/gate/artifact/report rules | Step 7/12 | report audit 通过 |
| AC / VETO / risk acceptance / final decision 口径缺口 | `06-验收标准.md` | 回写验收门禁和裁决规则 | Step 7/12 | 验收规则审查通过 |
| phase / commit boundary / gate embedding 不合理 | `07-实施计划.md` and Step calibration | 调整 phase/boundary/gate | flow 状态 and affected Step | 重新跑文档检查 |
| standards 经验需要沉淀 | `standards/document/设计真相源闭环与可落码性标准.md` | 检查同类经验是否存在;不存在则补正反例 | 项目记忆/标准引用 | standards 检查通过 |

### 7.4 门禁失败处理矩阵

| 失败项 | 初始判定 | 处理 | 是否可继续 |
|---|---|---|---|
| `cargo check` / compile failed | 实现或依赖问题 | 修复实现/依赖;若设计缺口则回写 | 否 |
| unit/service/query/consumer/job test failed | 实现 bug or design gap | 先定位;实现 bug 修复,design gap 暂停回写 | 否 |
| redaction failed | S/VETO 风险 | 修复输出和 scanner fixture | 否 |
| dependency-boundary failed | VETO 风险 | 移除依赖或回写架构 | 否 |
| report missing raw artifact | evidence integrity failure | 修复 suite/report generator | 否 |
| static evidence detected | VETO-GOV-011 | 删除静态来源,改为 artifact/report 推导 | 否 |
| release-main-smoke not scenario-level | release evidence invalid | 补固定业务闭环 smoke | 否 |
| P1 selected-run unavailable | residual | 记录 unavailable and risk acceptance | P0 可继续 |

### 7.5 恢复实施流程

```text
pause trigger
  -> classify: implementation bug / test tool gap / design truth gap / dependency unavailable / VETO
  -> preserve evidence: error, artifact, report, file lines, diff scope
  -> fix or write back design
  -> fix baseline / target repo state
  -> repeat boundary closure review
  -> rerun boundary gates
  -> continue from same boundary
```

| 恢复检查 | 通过条件 |
|---|---|
| baseline | design commit / target repo HEAD / Step 6 boundary 已重新确认 |
| worktree | 只包含当前 boundary 改动;无未授权用户改动 staged |
| closure review | 字段、DTO、状态、port、version、outbox、job、evidence、phase boundary 复核通过 |
| gate | 当前 boundary 提交前门禁重跑通过 |
| evidence | failed artifact 保留;fixed run report 可追溯 |

### 7.6 暂停 / 回退 / 变更停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 必须暂停条件是否明确 | 通过 | 见 §7.1 |
| 回退范围是否保护已验证阶段 | 通过 | 默认只回退当前 boundary 未提交改动 |
| 设计回写目标是否明确 | 通过 | `03/04/05/06/07/standards` 分目标 |
| 门禁失败处理是否明确 | 通过 | 见 §7.4 |
| 外部依赖不可用处理是否明确 | 通过 | 编译期暂停;P1 residual |
| 恢复条件是否可判定 | 通过 | baseline/worktree/review/gate/evidence |
| 是否禁止实现者临时补 schema / port / state | 通过 | pause + change rule |

### 7.7 跨控制规则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 规则是否覆盖 Step 9 blockers | 通过 | R-GOV-001~012 均有处理路径 |
| 规则是否与 Step 6 commit boundary 一致 | 通过 | boundary 是默认回退和恢复单位 |
| 规则是否与 Step 7 gates 一致 | 通过 | blocking gate failed 不得提交 |
| 规则是否与 Step 8 dependencies 一致 | 通过 | compile dependency vs runtime residual 已区分 |
| 是否存在“视情况处理” | 未发现 | 所有触发有动作和恢复条件 |
| 是否保护用户改动 | 通过 | 禁止回退用户文件和已验证提交 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §10。正式装配时可压缩说明,但必须保留 pause / rollback / change / recovery 四类规则。

### 10.1 Pause Rules

以下情况必须暂停当前 boundary:

- 目标仓或 core dependency 不可用。
- 字段、DTO、状态、port、scope、version、outbox source、job report、query marker、projection stale、evidence source 或 config binding 缺正式设计闭环。
- 当前实现越过 phase / commit boundary。
- blocking gate、redaction、dependency、report audit、release smoke or VETO failed。
- 无关用户改动混入当前 boundary。

暂停时必须保留文件行号、错误、artifact/report、diff 范围和建议闭口点。实现者不得用临时字段、临时状态、临时 port、字符串拼接 ref 或 fake-only shortcut 继续。

### 10.2 Rollback Rules

回退默认只作用于当前 boundary 未提交改动。不得擅自回退用户改动、已验证历史提交或其他 phase 的文件。已提交 boundary 需要修复时,优先新增修复 commit;只有用户明确要求时才 amend/rebase。

### 10.3 Change Control

设计真相源缺口按目标回写:

| 缺口 | 回写目标 |
|---|---|
| object/protocol/flow/state/persistence/idempotency | `03-详细设计.md` |
| config profile / adapter / CLI / env | `04-配置设计.md` |
| suite / artifact / report / gate | `05-测试方案.md` |
| AC / VETO / risk / final decision | `06-验收标准.md` |
| phase / commit boundary / gate embedding | `07-实施计划.md` |
| 可复用历史经验 | `standards/document/设计真相源闭环与可落码性标准.md` |

### 10.4 Recovery Rules

恢复实施必须同时满足:

1. blocker 已修复或设计已回写并固定新 baseline。
2. 当前 boundary 重新完成设计闭环复核。
3. 工作区只包含当前 boundary 的授权改动。
4. 当前 boundary 的提交前门禁重跑通过。
5. failed artifact/report 保留,fixed run 可追溯。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 已提交 boundary 是否允许 amend/rebase | 默认不允许,除非用户明确要求 | Step 11 提交纪律 |
| failed artifact 保留策略 | 至少保留到修复后 report 可追溯 | Step 12 完成判定 |
| 设计修复后是否需要更新 standards | 若同类经验不存在则更新并给正反例 | standards 维护任务 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 暂停规则明确 | 通过 | §7.1 |
| 回退规则明确 | 通过 | §7.2 |
| 变更控制明确 | 通过 | §7.3 |
| 门禁失败处理明确 | 通过 | §7.4 |
| 恢复条件明确 | 通过 | §7.5 |
| 与 commit boundary / gates / dependencies 一致 | 通过 | §7.7 |
| 可进入 Step 11 | 通过 | 下一步定义提交、评审与交付纪律 |
