# Step 10. 定义回退、暂停与变更控制

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填章节: `07-实施计划.md` §10 回退、暂停与变更控制
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义回退、暂停与变更控制 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 commit boundary;Step 7 门禁矩阵;Step 8 依赖准备;Step 9 风险与待确认事项;代码实施台账与门禁规范;可落码性标准 §九 |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 定义回退单位、boundary 状态控制和 scope 越界处理 |
| Step 7 phase / boundary gate | 已完成;用户已确认 | 定义门禁失败后的暂停、证据保留和恢复重跑 |
| Step 8 外部依赖准备 | 已完成;用户已确认 | 定义目标仓、core dependency、P0 fake/profile、P1/P2 residual 的不可用处理 |
| Step 9 `R-ART-*` / `OQ-ART-*` | 已完成;用户已确认 | 将 blocker、risk、open question 转成可执行暂停 / 变更 / 恢复规则 |
| `代码实施台账与门禁规范.md` | 已存在 | 约束 project ledger、boundary ledger、Commit Gate、Handoff Gate 和 future boundary 状态 |
| `设计真相源闭环与可落码性标准.md` §九 | 已存在 | 约束设计冲突时必须暂停回写,实现 agent 不补 schema / port / state / boundary |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些情况必须暂停当前阶段? | 目标仓 / core dependency / Rust toolchain 不可用、project ledger / boundary ledger 未激活当前 boundary、字段 / DTO / 状态 / port / version / source / evidence 闭口缺失、phase boundary 越界、P0 blocking gate 失败、redaction / dependency / report audit 失败、`VETO-ART-*` 命中、无关用户改动进入 staged diff,都必须暂停当前 boundary。 |
| 哪些情况允许回退到上一个提交边界? | 当前 boundary 尚未提交且实现试探失败、门禁失败需要清理本 boundary 改动、或发现 scope 越界需要退回未提交改动时,允许只回退当前 boundary 的未提交改动。不得回退用户改动、已验证历史提交或其他 phase 文件。 |
| 哪些情况必须回写详细设计或测试方案? | 对象 / 协议 / flow / 状态 / repository / UoW / idempotency / outbox / job report 缺口回写 `03`;config/profile/adapter/CLI/env 缺口回写 `04`;suite/artifact/report/evidence 缺口回写 `05`;AC/VETO/risk/final decision 缺口回写 `06`;phase/boundary/gate/ledger 缺口回写 `07`。 |
| 门禁失败后如何处理? | P0 blocking gate 失败不得提交、不得进入下一 boundary。若是实现 bug,修复后重跑当前 boundary 门禁;若是测试工具缺口,修复工具并保留 failed artifact;若暴露设计冲突,暂停并回写设计真相源。 |
| 外部依赖不可用时是否允许继续局部实施? | 目标实现仓、`core-contracts`、Rust toolchain、P0 profile、required fake / replay seam 不可用时,对应 boundary 不得继续。P1/P2 real-like / production-like unavailable 只记录 residual,不得计入 P0 pass。 |
| 恢复实施的条件是什么? | blocker 已修复或设计已回写并固定新 baseline;当前 boundary 重新完成 Design / Scope Gate;worktree 只包含授权的当前 boundary 改动;required checks 重跑通过;failed artifact/report 保留且 fixed run 可追溯。 |
| 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理? | 立即暂停当前 boundary,记录正式文件路径、行号、影响 surface、建议闭口点和禁止替代方式,回写设计真相源并重新激活 boundary 后再继续。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 9 | 已列 blocker / risk / OQ,但还缺执行动作 | 实现 agent 可能只记录风险但继续写代码 | 转成 pause / rollback / change / recovery 表 |
| Step 6 | boundary 是 review / gate / handoff 单位 | 还需定义默认回退单位 | 固定当前 boundary 为默认回退范围 |
| Step 7 | 门禁失败处理分散在 phase / boundary 表 | 需要统一失败分类与恢复条件 | 增加门禁失败处理矩阵 |
| Step 8 | 依赖不可用有 blocking / residual 区分 | 需要转为实施控制规则 | 编译期和 P0 seam 不可用暂停;P1/P2 residual |
| 代码实施台账 | Step 13 才预创建正式 implementation ledger | 需要提前定义台账异常如何暂停 | 增加 ledger / boundary 状态控制表 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 暂停条件 | 分散在 Step 6~9 | 统一为暂停规则表 | 防止实现者临场取舍 |
| 回退范围 | 未集中定义 | 默认只回退当前 boundary 未提交改动 | 保护已验证阶段和用户改动 |
| 设计回写 | 只说必须回写 | 明确回写 `03/04/05/06/07/standards` | 提高可执行性 |
| 门禁失败 | 按 suite / phase 分散说明 | 统一 gate failure matrix | 失败后动作一致 |
| 恢复条件 | 未集中定义 | baseline、ledger、worktree、closure review、gate、evidence 六项 | 防止未修复即继续 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实现者用临时 schema / port / fake map 继续 | 短期推进快 | 破坏设计真相源和验收证据 | 不采用 |
| 所有失败都回写设计 | 保守 | 简单实现 bug 会过度流程化 | 不采用 |
| 区分 implementation bug、test tooling gap、design truth gap、dependency unavailable、VETO | 精确 | 控制表更长 | 采用 |
| 回退已验证历史提交 | 清理彻底 | 破坏可追溯,可能误伤用户改动 | 不采用,除非用户明确要求 |
| 当前 boundary 以新增修复 commit 修正已提交缺陷 | 保留历史 | 提交数更多 | 采用 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-artifact` 不存在 | pause | 实施者 / 设计者 | path check、`git status` 或 blocker note | 目标仓创建或确认,重新跑 PH-01 前置检查 |
| `core-contracts` path dependency 不可用 | pause | 实施者 / core owner | Cargo error、path check、dependency report | core repo/path/package 修复或设计回写 |
| project ledger 未推进到当前 boundary | pause | 设计者 | project ledger 行号、boundary 状态 | 设计仓正式推进 current boundary |
| boundary ledger 缺失或 future boundary 不是 `planned / wait_until_current` | pause + change | 设计者 | ledger 文件路径、状态截图 / 行号 | Step 13 或设计仓补齐 planned skeleton / 激活当前 boundary |
| 当前 boundary 未闭合字段 / DTO / 状态 / typed ref / port / version / source | pause + change | 设计者 | 正式文件行号、影响 surface、建议闭口点 | 回写 `03/04/05/06/07`,固定新 baseline,重跑 Design Gate |
| 当前实现越过 allowed_scope 或引用后续 phase surface | pause + change | 实施者 / 设计者 | diff scope、boundary ledger allowed_scope | 调整实现到当前 scope,或回写 Step 6 boundary |
| P0 blocking suite / `cargo check` / required checks failed | pause | 实施者 | raw artifact、suite report、stderr、安全失败摘要 | 修复实现或测试工具后重跑当前 boundary checks |
| redaction leak | pause + defect | 实施者 / 安全审查 | `redaction-check.md`、negative fixture safe failure refs | 修复输出、扫描 artifacts/reports,重跑 redaction 与受影响 suites |
| dependency boundary violation | pause + change | 实施者 / 架构审查 | `dependency-boundary.md`、dependency graph | 移除 non-core compile dependency 或回写架构/设计 |
| report-generation-audit / no-static-evidence failed | pause + change | 实施者 / 测试审查 | `report-audit.md`、orphan/static evidence refs | 修复 generator/source,重跑 report audit |
| `VETO-ART-001~009` 命中 | pause + defect | 设计者 / 实施者 / 验收者 | VETO evidence、defect、suite report | 修复并复验;不得风险接受 |
| 无关用户改动进入 staged diff | pause | 实施者 | `git status --short`;`git diff --cached` | 只 stage 当前 boundary 文件;用户改动保持 untouched |
| P1 selected-run unavailable | no P0 pause;record residual | 测试 / 验收 | unavailable marker、risk acceptance draft | 写入 residual;不得计入 P0 pass |

### 7.2 回退规则表

| 场景 | 允许回退范围 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交试探实现失败 | 当前 boundary 未提交改动 | 不回退用户文件;不回退已验证提交 | 清理试探改动后重新按 boundary 实施 |
| 当前 boundary 门禁失败且为实现 bug | 当前 boundary 相关改动 | 不用回退替代修复缺陷;不删除 failed artifact | 修复后重跑门禁 |
| 当前 boundary 暴露设计缺口 | 可暂停保留工作区或清理试探改动 | 不继续补 schema / port / mapper / fake map | 设计回写并重跑 Design Gate |
| 已提交 boundary 后发现同 boundary 缺陷 | 新增修复 commit;用户明确要求时才 amend/rebase | 不擅自改写历史 | 修复门禁通过,记录原因和关联 boundary |
| 提交前发现无关文件混入 | 当前 staged / unstaged diff | 不 `git reset --hard`;不删除用户改动 | 重新 staging 当前 boundary 文件 |
| release evidence 生成错误 | 当前 report/evidence generator 改动和本次 generated artifacts | 不手写 pass;不删除 failed raw artifact | 修复 generator,重跑 release audit |

### 7.3 变更控制表

| 触发条件 | 变更目标 | 动作 | 必须同步 | 恢复条件 |
|---|---|---|---|---|
| object / protocol / flow / state / repository / UoW / idempotency / outbox / job report 缺口 | `03-详细设计.md` and calibration | 回写正式设计和必要 calibration Step | Step 6/7/9/10 affected boundary | 新 design baseline 固定后重复核 |
| config profile / CLI / env / adapter binding / topic map / replay root 缺口 | `04-配置设计.md` | 回写配置项、profile、failure mapping 和 runtime builder 入口 | Step 8 / Step 10 / affected boundary | config smoke 和 config-redline 通过 |
| suite / artifact / report / gate / evidence derivation 缺口 | `05-测试方案.md` | 回写 suite、gate、artifact/report、no-static-evidence 规则 | Step 7 / Step 10 / Step 12 | report audit 通过 |
| AC / VETO / risk acceptance / final decision 口径缺口 | `06-验收标准.md` | 回写验收门禁、VETO、risk acceptance 和 final decision | Step 7 / Step 9 / Step 12 | 验收规则审查通过 |
| phase / commit boundary / required_reads / required_checks / Handoff Gate 不合理 | `07-实施计划.md` and Step calibration | 调整 phase、boundary、gate、ledger 计划 | flow 状态、project ledger、affected Step | 重新跑文档检查 |
| implementation ledger 状态不一致 | `design-calibration/implementation_execution_ledger.md` and boundary ledgers | 修正 current boundary、future planned、handoff record | Step 6 / Step 13 | 台账恢复顺序通过 |
| 同类设计 blocker 有复用价值 | `standards/document/设计真相源闭环与可落码性标准.md` | 检查标准是否已有;缺失则补规则、正反例、复核清单 | 项目经验记录 / standards 引用 | standards 检查通过 |

### 7.4 门禁失败处理矩阵

| 失败项 | 初始判定 | 处理 | 是否可继续 |
|---|---|---|---|
| `cargo check` / compile failed | implementation bug or dependency gap | 修复实现 / 依赖;若暴露设计缺口则回写 | 否 |
| `contract-domain-fast` failed | contract / domain / state gap | 定位实现 bug 或设计冲突;重跑 slice | 否 |
| `service-flow-fast` failed | application / UoW / idempotency / query no-write gap | 修复服务编排或暂停回写 | 否 |
| `config-redline` failed | config binding / profile / fail-fast gap | 修正配置或回写 `04` | 否 |
| `dependency-boundary` failed | architecture VETO risk | 移除依赖或回写架构 / `03` | 否 |
| `infra-runtime-fake` failed | fake parity / UoW / idempotency gap | 修复 fake parity,不得降级语义 | 否 |
| `entry-worker-job` failed | API / consumer / worker / job entry gap | 修复 entry mapping or source closure | 否 |
| `operations-replay-core` failed | replay / outbox / relay / job report gap | 修复 stored snapshot / report replay / no-truth-repair | 否 |
| `redaction-boundary` failed | security / VETO risk | 修复泄露并重跑 redaction / affected suites | 否 |
| `report-generation-audit` failed | evidence integrity gap | 修复 artifact/report pairing、no-static-evidence、orphan EV | 否 |
| `release-main-smoke` failed | five-capability closure failed | 修复业务主链;不得用普通测试计数替代 | 否 |
| acceptance draft 未审查 | handoff control gap | 补人 / agent review status | 否 |
| `p1-real-like-selected-run` unavailable | residual | 记录 unavailable marker and risk acceptance | P0 可继续 |

### 7.5 Ledger / boundary 状态控制表

| 状态问题 | 处理 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| project ledger `current_boundary` 不是待实现 boundary | pause | 不直接读取 future boundary 开工 | 设计仓推进 current boundary |
| 当前 boundary ledger 缺失 | pause + change | 不由实现 agent 私建正式 boundary | 设计仓创建 boundary ledger |
| 当前 boundary `status = blocked / wait_design` | pause | 不继续改实现仓 | 设计闭口并改回可读 / ready 状态 |
| future boundary `status != planned` 或 `next_allowed_action != wait_until_current` | pause + change | 不允许多个 boundary 同时 active | 修正 future skeleton 状态 |
| Handoff Gate 缺 commit hash / checks / evidence | pause handoff | 不推进下一 boundary | 回填 handoff evidence |

### 7.6 恢复实施流程

```text
pause trigger
  -> classify: implementation bug / test tooling gap / design truth gap / dependency unavailable / ledger gate / VETO
  -> preserve evidence: error, artifact, report, file lines, diff scope, ledger state
  -> fix implementation or write back design
  -> fix baseline / target repo / ledger state
  -> repeat boundary Design Gate and Scope Gate
  -> rerun required checks
  -> continue from same boundary or formally activated next boundary
```

| 恢复检查 | 通过条件 |
|---|---|
| design baseline | design commit、formal docs、calibration source 与 project ledger 一致 |
| ledger | project ledger current boundary 与 boundary ledger 状态一致 |
| worktree | 只包含当前 boundary 授权改动;无未授权用户改动 staged |
| closure review | 字段、DTO、状态、port、version、outbox、job、evidence、phase boundary 复核通过 |
| gates | 当前 boundary required checks 重跑通过 |
| evidence | failed artifact 保留;fixed run report 可追溯 |

### 7.7 暂停 / 回退 / 变更停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 必须暂停条件是否明确 | 通过 | 见 §7.1 |
| 回退范围是否保护已验证阶段和用户改动 | 通过 | 默认只回退当前 boundary 未提交改动 |
| 设计回写目标是否明确 | 通过 | `03/04/05/06/07/standards` 分目标 |
| 门禁失败处理是否明确 | 通过 | 见 §7.4 |
| 台账状态异常是否明确 | 通过 | 见 §7.5 |
| 外部依赖不可用处理是否明确 | 通过 | 编译期和 P0 seam 暂停;P1/P2 residual |
| 恢复条件是否可判定 | 通过 | baseline / ledger / worktree / review / gate / evidence |
| 是否禁止实现者临时补 schema / port / state | 通过 | pause + change rule |

### 7.8 跨控制规则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 Step 9 blockers | 通过 | `R-ART-001~016` 均有处理路径 |
| 是否与 Step 6 commit boundary 一致 | 通过 | boundary 是默认回退和恢复单位 |
| 是否与 Step 7 gates 一致 | 通过 | blocking gate failed 不得提交 |
| 是否与 Step 8 dependencies 一致 | 通过 | compile / P0 runtime / P1 residual 已区分 |
| 是否覆盖 implementation ledger 门禁 | 通过 | §7.5 |
| 是否存在“视情况处理” | 未发现 | 所有触发有动作和恢复条件 |
| 是否保护用户改动 | 通过 | 禁止回退用户文件和已验证提交 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“门禁失败处理矩阵”“Ledger / boundary 状态控制表”和“恢复实施流程”小节,了解实施中断与恢复规则如何收敛。

正式 `07-实施计划.md` §10 应回填:

L1-artifact 的实施控制以 commit boundary 为默认暂停、回退和恢复单位。目标仓、core dependency、P0 profile、required fake / replay seam、project ledger、boundary ledger、设计闭口、P0 blocking gate、redaction、dependency、report audit、VETO 和 staged scope 任一不满足时,必须暂停当前 boundary。

回退默认只允许作用于当前 boundary 未提交改动。不得擅自回退用户改动、已验证历史提交或其他 phase 文件。已提交 boundary 需要修复时,默认新增修复 commit;只有用户明确要求时才 amend / rebase。

设计真相源缺口按目标回写:`03` 承接对象、协议、flow、状态、repository、UoW、idempotency、outbox、job report;`04` 承接配置、profile、adapter、CLI/env、topic、replay root;`05` 承接 suite、artifact、report、evidence;`06` 承接 AC、VETO、risk acceptance、final decision;`07` 承接 phase、boundary、gate、ledger。实现 agent 只能二次校验和报告 blocker,不得自行补 schema、port、状态、mapper、gate、ledger 或 evidence 口径。

恢复实施必须同时满足:新 design baseline 或修复已固定;project ledger 与 boundary ledger 状态一致;当前 boundary Design / Scope Gate 重新通过;工作区只含授权改动;required checks 重跑通过;failed artifact/report 保留且 fixed run 可追溯。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 已提交 boundary 是否允许 amend/rebase | 默认不允许,除非用户明确要求 | Step 11 提交纪律 |
| failed artifact 保留周期 | 至少保留到修复后 report 可追溯 | Step 12 完成判定 |
| 设计修复后是否需要更新 standards | 若同类经验不存在则更新并给正反例 | standards 维护任务 |
| ledger handoff 缺 evidence 时是否能推进下一 boundary | 不能推进 | Step 13 implementation ledger skeleton / Handoff Gate |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 暂停规则明确 | 通过 | §7.1 |
| 回退规则明确 | 通过 | §7.2 |
| 变更控制明确 | 通过 | §7.3 |
| 门禁失败处理明确 | 通过 | §7.4 |
| ledger 状态控制明确 | 通过 | §7.5 |
| 恢复条件明确 | 通过 | §7.6 |
| 与 commit boundary / gates / dependencies / risks 一致 | 通过 | §7.8 |
| 正式 `07` 是否已创建 | 未创建 | 仍按 SOP 留到 Step 13 装配 |
| 可进入 Step 11 | 待用户确认 | 下一步定义提交、评审与交付纪律 |
