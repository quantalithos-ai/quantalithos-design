# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填章节：`07-实施计划.md` §10 回退、暂停与变更控制
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与输入确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 · 回退、暂停与变更控制 |
| 当前状态 | `done / pass / self_reviewed`（设计层；`step_stop_review`） |
| 输入基线 | Step 6 的 22 boundary；Step 7 phase/boundary gates；Step 8 dependency handling；Step 9 Spike/risk/OQ；可落码性标准 |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改 |
| 本步输出 | pause 规则、rollback 规则、change-control 矩阵、gate failure 处理、恢复流程、跨控制审计 |
| 下一动作 | Step 10 停审后进入 Step 11；正式 07、实现、测试和提交仍关闭 |

## 2. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 哪些情况必须暂停当前阶段？ | 目标仓/runner/config root 不可用；正式设计字段、DTO、Port、状态、scope、safe-field、reconcile、carrier、config、evidence 或 phase boundary 缺口；blocking gate、redaction、dependency、pairing/no-static、report audit 或 VETO 失败；Query/side-path 写入、forbidden body、private dependency、owner failure 扩散或无关改动混入。 |
| 2. 哪些情况允许回退到上一个提交边界？ | 当前 boundary 尚未提交且试探实现需要清理时，可回退当前 boundary 未提交改动；已验证历史 boundary、用户改动和其他 phase 不得擅自回退。已提交 boundary 的缺陷优先以新修复 commit 处理，amend/rebase 需用户明确要求。 |
| 3. 哪些情况必须回写详细设计/测试/验收？ | 对象/协议/flow/state/carrier/reconcile 回写 `03`；配置/profile/source 回写 `04`；TC/suite/artifact/report/evidence 回写 `05`；AC/VETO/risk/signoff/readiness 回写 `06`；phase/boundary/gate/commit/handoff 回写 `07` calibration/formal 文档。 |
| 4. 门禁失败如何处理？ | 保留失败 run/artifact/report；按失败类型区分实现 bug、测试工具缺口、设计真相源冲突、依赖不可用或 VETO/S。blocking 失败不得提交、不得进入下一 boundary；修复后使用新 run_id 重跑受影响集合。 |
| 5. 外部依赖不可用时能否局部继续？ | P0 基础仓、runner、config、fake、host semantic seam 不可用时，相关 boundary blocked；独立的 safe/negative/static 设计可继续校准，但不能写 positive implementation。P1/P2 selected/production-like 不可用只记录 residual，不贡献 P0 pass。 |
| 6. 恢复实施需要什么？ | blocker 已修复或正式设计已回写并固定新 baseline；当前 boundary 重新通过 Design/Scope/Worktree/closure review；工作区只含授权改动；适用 gate 用新 run_id 重跑并配对；项目/ boundary 台账更新后才允许继续。 |
| 7. 字段缺失、状态冲突、DTO 不完整或 phase 越界怎么办？ | 立即 pause，记录来源文件/章节/行号、影响 boundary、失败证据和建议闭口点；不得在代码中补字段、状态、DTO、Port、错误码、owner schema 或改变 phase scope。 |

## 3. 当前材料问题诊断

| 问题 | 风险 | 本 Step 修正 |
|---|---|---|
| blocker 只有文字，没有唯一动作 | 实施者可能继续猜造 | 每类触发固定 pause/block/change/residual 动作 |
| boundary 是提交与回退单位，但未说明历史保护 | 可能破坏已验证内容或用户改动 | 默认只处理当前 boundary 未提交改动；禁止 destructive rollback |
| 设计回写分散在各 Step | 缺口可能只改实现或测试 | 建立 03/04/05/06/07 唯一回写矩阵 |
| failed artifact 可能被覆盖 | 证据链断裂 | 失败材料保留；修复使用新 run_id 和新 digest |
| selected unavailable 与 P0 failure 混淆 | 残余风险污染 P0 结论 | 独立 `residual`，不贡献 pass/readiness |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实施者自行补缺口继续 | 速度快 | 破坏真相源和可落码性 | 不采用 |
| 所有异常一律回退到上一个 phase | 保守 | 破坏已验证阶段、扩大 diff | 不采用 |
| 按实现 bug/工具缺口/设计冲突/依赖不可用/VETO 分类 | 处理精确、可复验 | 规则较多 | 采用 |
| 删除失败 artifact 只保留成功结果 | 简洁 | 违反失败保真和审计 | 不采用 |
| P1/P2 unavailable 直接阻断全部 P0 | 避免漏项 | 把 selected 条件误作核心前置 | 不采用；记录 residual |

## 5. 结构化中间产物

### 5.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 必须保留 | 恢复条件 |
|---|---|---|---|---|
| target repo、package manager、runner 或 host authority 不可定位 | `pause / blocked` | 实施者+设计者 | path/manifest/status 检查、阻塞 ID | authority 可核验；重新跑 PH-01 前置 |
| formal `03/04/05/06` 与当前 boundary 冲突 | `pause + change` | 设计者 | 来源章节、diff、影响表 | 真相源回写、新 baseline、受影响 Step 重审 |
| field/DTO/Port/state/scope/safe-field/reconcile/carrier/config/evidence schema 缺失 | `pause + wait_design` | 设计者+owner | 文件行号、blocker、建议闭口点 | 正式设计闭合并重新 Design Gate |
| phase/boundary 越界或后续能力前置 | `pause + change` | 设计者 | boundary diff、Step 5/6/7 映射 | 调整 boundary/计划并重做覆盖审计 |
| Query/side-path write、private dependency、第二 truth 或 forbidden body | `pause + defect/VETO` | 实施者+架构/安全审查 | call/dependency/redaction report、failed run | 修复并跑受影响 P0/红线集合；VETO 不可风险接受 |
| P0 blocking suite/gate、state、race、a11y semantic 或 config gate 失败 | `pause` | 实施者+测试 | raw artifact、paired report、defect ref | 修复后同 family/邻接 gate 新 run 通过 |
| report 缺 raw、run mismatch、缺 digest、orphan、static evidence | `pause + change` | 测试/证据负责人 | report-audit、source refs、失败材料 | generator/pairing/no-static 修复并重跑 |
| VETO-CON-001～007 或 S 级命中 | `pause + defect` | 实施/架构/验收 | VETO evidence、failed run、review notes | 修复并全量 P0 复验；不可风险接受 |
| 无关用户改动 staged 或跨 boundary 文件混入 | `pause` | 实施者 | `git status`、staged diff、scope 清单 | 只保留当前 boundary 授权范围 |
| P1/P2 selected browser/AT、production sink、量化环境不可用 | `record residual` | 测试/验收 | unavailable marker、risk ref、trigger | authority/baseline 到达后升级并重审；不影响 P0 主链 |

### 5.2 回退规则表

| 场景 | 允许回退范围 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交的试探实现失败 | 当前 boundary 未提交文件/改动 | 不回退用户改动、已验证提交或其他 boundary；不使用 destructive reset | 工作区 scope 清晰，重新按当前 boundary 开工 |
| 当前 boundary gate 失败且确认为实现 bug | 当前 boundary 相关实现和测试改动 | 不删除 failed artifact；不以回退代替修复 | 修复、保留失败材料、同 family 新 run 通过 |
| 失败暴露设计缺口 | 暂停并保留或清理试探改动，取决于安全审查 | 不补 schema/状态/Port；不提交半成品 | 设计回写、baseline 更新、closure review 重过 |
| 已提交 boundary 后发现缺陷 | 新增修复 commit（同 boundary 语义） | 不擅自 amend/rebase 或改写历史 | 新 commit gate/handoff 完成；用户明确才可改历史 |
| 发现跨 boundary/无关文件混入 | 提交前重新 staging 当前 boundary | 不删除用户文件、不 `git reset --hard` | staged scope 只剩允许文件 |
| release/report generator 失败 | 当前 generator/check 变更与对应 future run 重新生成 | 不手写 pass、不覆盖失败 raw | 同 run pairing/report/no-static 审计通过 |

### 5.3 变更控制矩阵

| 变更触发 | 回写真相源 | 同步 07 位置 | 必须重跑/复核 |
|---|---|---|---|
| object/protocol/flow/state/carrier/reconcile/idempotency | `03-详细设计.md` 与对应 calibration | Step 6/7/8/9/12；受影响 boundary | design closure、state/flow/adapter/race 及受影响 P0 |
| config key/profile/source/activation/failure | `04-配置设计.md` | Step 8/9/10/12 | config redline、startup/fail-closed、报告来源 |
| TC/suite/fixture/data/artifact/report/EV/pairing | `05-测试方案.md` | Step 7/8/9/10/12 | affected suite、report/pairing/redaction/no-static |
| AC/VETO/defect/risk/signoff/readiness | `06-验收标准.md` | Step 7/9/10/12/13 | acceptance mapping、VETO、risk/decision boundary |
| phase/task/batch/boundary/gate/commit/handoff | `07` calibration/formal 07 | Step 5/6/7/10/11/12 | cross-phase/boundary audit、台账 skeleton consistency |
| 可复用文档经验缺口 | standards（仅经验不存在时） | 相关 calibration 来源 | standards change review 和正反例 |

### 5.4 门禁失败处理矩阵

| 失败项 | 初始状态 | 处理 | 是否可继续 |
|---|---|---|---|
| package/type/config/architecture static failure | `blocked` | 修复当前 boundary；若暴露设计缺口则回写 | 否 |
| Query write / forbidden dependency/body / VETO | `blocked` / S | 保留失败；修复并全量受影响 P0 | 否 |
| state/command/unknown/replay/race failure | `blocked` / S or P0 | 修复或回写 reconcile/state；新 run | 否 |
| redaction/pairing/no-static/report audit failure | evidence invalid | 修 generator/check/source；不手写 candidate | 否 |
| selected browser/AT/quantitative unavailable | `residual` | 记录 trigger/owner；维持 semantic/structural P0 | P0 主链可继续，但不计 selected pass |
| external owner positive contract unavailable | `blocked_for_positive` | safe/no-call/disabled；等待 authority | safety branch可继续设计，positive不可继续 |
| user/unrelated change in diff | `blocked` | 重新 scope/stage；保护用户改动 | 否 |

### 5.5 恢复实施流程

```text
pause trigger
  -> classify: implementation bug / tool gap / design truth gap / dependency unavailable / VETO
  -> preserve failure: raw artifact, report, refs, diff scope, file lines
  -> fix implementation/tool or write back formal truth
  -> establish new design/delivery/environment baseline
  -> repeat current boundary Design/Scope/Worktree/closure review
  -> run affected gate set with a new run_id
  -> pair/redact/audit reports and update ledgers
  -> only then continue same boundary or start_next_boundary
```

恢复检查必须同时满足：

1. blocker 已关闭或由正式变更明确转成允许的 residual；
2. 设计 baseline、target repo HEAD、config/dependency/environment refs 可定位；
3. 当前 boundary 的字段、DTO、Port、state、scope、carrier、evidence 和 phase boundary 复核无 blocker；
4. 工作区只含授权改动，用户无关文件未 staged；
5. 受影响 gate 使用新 run_id 重跑并有 raw/report pairing、redaction、digest 和 review refs；
6. 项目级与 boundary 级实施台账更新，`next_allowed_action` 与 gate_status 合法。

## 6. 跨控制规则审计

| 审计项 | 结论 | 依据 |
|---|---|---|
| 是否覆盖 Step 9 全部 blocker/risk/OQ | `pass` | 目标仓、契约、baseline、证据、selected residual 均有动作 |
| 是否与 Step 6 boundary 一致 | `pass` | boundary 是默认暂停、修复、回退和恢复单位 |
| 是否与 Step 7 gate 一致 | `pass` | P0/VETO/redaction/pairing/no-static 失败均阻断 |
| 是否与 Step 8 依赖处理一致 | `pass` | compile/tool/required fake 阻断；P1/P2 residual 分离 |
| 是否保护用户改动和已验证历史 | `pass` | 禁止 destructive rollback、默认新增修复 commit |
| 是否保留失败证据 | `pass` | failed artifact/report 不删除、不覆盖；新 run 重跑 |
| 是否允许实现者临时补设计 | `pass` | 缺口统一 `wait_design` 和回写矩阵 |
| 是否存在“视情况处理” | `pass` | 每类触发均有动作、责任、证据和恢复条件 |

## 7. 回填草稿

正式 §10 应保留四类规则：blocking 条件必须 pause；默认只回退当前 boundary 未提交改动；设计缺口按 03/04/05/06/07 回写；恢复必须通过 baseline、closure、worktree、gate、evidence 和台账复核。失败 run/artifact/report 保留，selected unavailable 只记 residual，禁止手写 pass 或改写历史。

## 8. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 已提交 boundary 是否允许 amend/rebase | 默认不允许；需用户明确授权 |
| failed artifact 保留期限 | 至少保留到 fixed run、report pairing 和缺陷关闭可追溯；具体 retention authority pending |
| 设计修复是否升级 standards | 仅当同类经验不存在时评估；不得跨项目复制业务语义 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 暂停规则明确 | `pass` | §5.1 |
| 回退范围保护已验证阶段和用户改动 | `pass` | §5.2 |
| 变更回写目标唯一 | `pass` | §5.3 |
| 门禁失败处理明确 | `pass` | §5.4 |
| 恢复条件可判定 | `pass` | §5.5 |
| 与 phase/boundary/dependency 一致 | `pass` | §6 |
| 正式 07 仍未写入且无执行事实 | `pass` | Step 13 前关闭 |
| 可进入 Step 11 | `pass` | 继续定义提交、评审与交付纪律 |

## 10. Step 自审记录

- [x] 已回答 Step 10 七个 SOP 问题。
- [x] 已建立暂停、回退、变更、门禁失败和恢复流程矩阵。
- [x] 已将设计缺口唯一回写至 03/04/05/06/07，禁止实现端临时补 schema/状态/Port。
- [x] 已规定失败 artifact/report 保留、新 run_id 重跑和 evidence pairing 纪律。
- [x] 已区分 P0 blocking 与 P1/P2 residual，不把 selected unavailable 变成 P0 failure 或 pass。
- [x] 未创建实现仓、代码、测试、run、artifact/report/evidence、verdict/signoff/readiness 或 commit。

## 11. Step 10 停审结论

Step 10 在设计层 `done / pass / self_reviewed`，并切换为 `step_stop_review`。任何设计真相源冲突、P0/VETO/evidence failure、越界或无关改动均有唯一安全动作；恢复必须在同一 boundary 重新闭环和重跑，不得绕过审计。按用户授权，下一步进入 Step 11。
