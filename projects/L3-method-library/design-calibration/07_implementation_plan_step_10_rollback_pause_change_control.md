# Step 10. 定义回退、暂停与变更控制

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填章节: `07-实施计划.md` §10 回退、暂停与变更控制
> 当前模块: `R10.2 rollback pause change control:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义回退、暂停与变更控制 |
| 当前模块 | `R10.2 rollback pause change control:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 6 commit boundary;Step 7 gate;Step 8 dependency;Step 9 risk;`03` error/recovery/idempotency;`04` config rollback;`05` defects/retest;`06` pause/risk/final decision |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md` |
| 停审方式 | 用户已确认,允许进入 Step 11 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 6 candidate boundary | completed_confirmed | 定义默认回退单位、恢复单位和 phase / boundary scope 变更触发 |
| Step 7 gate matrix | completed_confirmed | 定义 blocking gate、VETO、artifact/report 失败后的暂停和复验 |
| Step 8 dependency preparation | completed_confirmed | 定义 target repo、core dependency、profile、fake seam、artifact/report root 不可用处理 |
| Step 9 risk / open question | completed_confirmed | 将 blocker / risk / OQ 转成可执行 pause / rollback / change / recovery 规则 |
| `03-详细设计.md` §11~§12 / §16~§17 | 已读取 | 提供 no rerun、commit unknown、source missing stop、query no-write、job no truth repair、实现前读 ledger 规则 |
| `04-配置设计.md` §10~§11 / §14 | 已读取 | 提供 config 变更、rollback、fail-fast、degraded 和 future/watch 处理 |
| `05-测试方案.md` §11~§14 | 已读取 | 提供 S/A/B/R、复验、artifact/report、regression 和 residual 规则 |
| `06-验收标准.md` §4 / §12~§14 | 已读取 | 提供暂停 / 不可裁决、risk acceptance、最终结论和不可风险接受 |
| L1-governance Step 10 | framework_reference | 只参考 pause / rollback / change / recovery 表格结构,不得复制旧项目编号或旧项目事实 |

## 3. SOP 问题回答

1. 哪些情况必须暂停当前阶段。

   回答: 目标仓 layout 未迁移、`core-contracts` 不可用、正式字段/DTO/port/state/mapper/marker/config/evidence source 缺失、phase / boundary 越界、blocking gate failed、redaction/dependency/report audit failed、VETO-ML 命中、query/job/observability 反写真相、static evidence、invalid P0 config silent fallback、无关用户改动混入当前 boundary,均必须暂停当前 boundary。

2. 哪些情况允许回退到上一个提交边界。

   回答: 默认只允许清理当前 boundary 的未提交试探改动。已验证历史提交、用户改动和其他 phase 文件不得擅自回退。已提交 boundary 若发现缺陷,优先新增修复 commit;只有用户明确要求时才 amend/rebase。

3. 哪些情况必须回写详细设计或测试方案。

   回答: object/protocol/flow/state/persistence/idempotency 缺口回写 `03`;config/profile/adapter/CLI/env 缺口回写 `04`;suite/artifact/report/gate 缺口回写 `05`;AC/VETO/risk/final decision 缺口回写 `06`;phase/commit boundary/gate embedding/ledger 缺口回写当前 `07`。

4. 门禁失败后如何处理。

   回答: blocking gate failed 不得提交。实现 bug 修复后重跑当前 boundary gates;测试工具或 report generator 缺口修工具并保留 failed artifact;设计冲突暂停并回写 owning source;redaction/dependency/report/VETO failure 不得风险接受。

5. 外部依赖不可用时是否允许继续局部实施。

   回答: 目标仓、core dependency、Rust toolchain、P0 required profile/config、artifact/report root、required fake seam 不可用时不得继续相关 boundary。P1/P2 real-like selected-run 不可用不阻断 P0,但只能进入 residual/risk acceptance,不得计入 P0 pass。

6. 恢复实施的条件是什么。

   回答: blocker 已修复或设计已回写并固定新 baseline;当前 boundary 重新完成 closure review;工作区只包含当前 boundary 授权改动;提交前 gates 重跑通过;failed artifact/report 被保留且 fixed run 可追溯。

7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理。

   回答: 立即暂停。记录文件、行号、影响 boundary、失败 gate、建议 owning source,回设计仓闭口。实现侧不得通过 placeholder 字段、private map、synthetic marker、raw string、route param、timestamp、SQL/HTTP code 或 fake-only shortcut 继续。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 9 | blocker 已列,但还不是操作规则 | 实现时可能继续推进 | 转为 pause / change / recovery 表 |
| Step 6 | boundary 是候选提交单位 | 缺默认 rollback 规则 | 明确当前 boundary 未提交改动为默认回退范围 |
| Step 7 | gate failure 已分散说明 | 缺统一失败处理矩阵 | 建立 gate failure handling |
| Step 8 | dependency unavailable 已说明 | 缺恢复条件 | 建立 dependency unavailable / residual 处理 |
| `03/04/05/06` | pause / rollback / retest 分散 | 实施计划需要统一引用 | 本 Step 汇总为 §7 结构化规则 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| pause 条件 | 分散在风险和验收 | 统一为暂停规则表 | 防止临场取舍 |
| rollback 范围 | 未集中说明 | 默认只处理当前 boundary 未提交改动 | 保护历史提交和用户改动 |
| change control | 只说回 owning source | 按 `03/04/05/06/07/standards` 分目标 | 可执行 |
| gate failure | 分散在 Step 7 / `05/06` | 建矩阵 | 防止失败被风险接受 |
| recovery | 未集中 | baseline/worktree/closure/gate/evidence 五项恢复条件 | 防止未闭口继续 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 实现者自行选择临时方案继续 | 快 | 破坏真相源、证据和 boundary | 不采用 |
| 所有失败都回设计 | 保守 | 普通实现 bug 会过度流程化 | 不采用 |
| 区分 implementation bug / test tool gap / design truth gap / dependency unavailable / VETO | 精确 | 规则较多 | 采用 |
| 自动回退已提交历史 | 清理快 | 破坏可追溯和用户改动 | 不采用 |
| 默认新增修复 commit | 保留历史 | commit 数可能增加 | 采用 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 目标实现仓 layout 未迁移或旧主线污染 | pause | 实施者 / 设计者 | workspace audit、README/Cargo diff | commit-01-a scope 修正并重跑 dependency-boundary |
| `core-contracts` path/package/lib 不可用 | pause | 实施者 / core owner | path check、Cargo error | core path 修复或设计回写 |
| schema / DTO / port / state / mapper / marker / config / evidence source missing | pause + change | 设计者 | 文件行号、影响 flow、失败 gate、建议 owning source | 回写 owning source,固定 baseline,重复 boundary review |
| phase / commit boundary 越界 | pause + change | 设计者 | boundary ledger / diff / source refs | 调整 Step 6/7/11/12 或移动到后续 boundary |
| blocking suite failed | pause | 实施者 | failed artifact/report、stdout/stderr safe ref | 修复实现或测试工具,重跑通过 |
| redaction leak | pause + defect | 实施者 / security reviewer | redaction report、safe issue ref | 修复泄露,重跑 redaction and affected suites |
| dependency-boundary failed | pause + change | 实施者 / architecture reviewer | dependency report | 移除依赖或回架构,重跑 dependency check |
| report-generation-audit failed | pause + change | 实施者 / test reviewer | report-audit、orphan artifact refs | 修 generator/source,重跑 audit |
| VETO-ML-001~014 命中 | pause + defect | 设计者 / 实施者 / 验收者 | VETO evidence/report | 修复并复验;不得风险接受 |
| invalid P0 config silent fallback | pause + defect | 实施者 / config owner | config-redline failed artifact | fail-fast / reject 修正后重跑 |
| 无关用户改动混入 boundary | pause | 实施者 | `git status --short`、diff review | 只 stage 当前 boundary 文件,保留用户改动 |
| P1 selected-run unavailable | no P0 pause;record residual | 测试 / 验收 | unavailable marker、risk item | 写入 residual / risk acceptance,不计 P0 pass |

### 7.2 回退规则表

| 场景 | 允许回退范围 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交试探实现失败 | 当前 boundary 未提交改动 | 不回退用户文件;不回退已验证提交 | 清理后重新按 boundary 实施 |
| 当前 boundary 门禁失败且为实现 bug | 当前 boundary 相关改动 | 不用删除 failed artifact 掩盖失败 | 修复并重跑 gate |
| 当前 boundary 暴露设计缺口 | 可保留工作区或清理试探改动 | 不继续补 schema/port/marker | 设计回写后重新核对 |
| 已提交 boundary 后发现缺陷 | 新增修复 commit | 不擅自改写历史 | 修复 gates 通过并记录原因 |
| 用户明确要求 amend/rebase | 仅用户指定提交范围 | 不混入无关改动 | staged diff review and gates pass |
| release evidence generator 错误 | 当前 generator 改动和 generated candidate reports | 不手写 pass;不删除 failed raw artifact | 修 generator,重跑 report audit |

### 7.3 变更控制表

| 触发条件 | 回写目标 | 必须同步 | 恢复条件 |
|---|---|---|---|
| object/protocol/flow/state/persistence/idempotency 缺口 | `03-详细设计.md` and calibration | affected Step 6/7/10/11/12 boundary | 新 baseline 固定后重复 closure review |
| config profile / adapter / CLI / env / failure strategy 缺口 | `04-配置设计.md` | Step 8 and affected boundary | config smoke / config-redline 通过 |
| suite / artifact / report / EV mapping / gate 缺口 | `05-测试方案.md` | Step 7/12 | report audit / affected suite 通过 |
| AC / VETO / risk acceptance / final decision 缺口 | `06-验收标准.md` | Step 7/12/13 | acceptance rule review 通过 |
| phase / commit boundary / allowed scope / required checks 冲突 | `07-实施计划.md` calibration and later formal §6~§12 | flow、project ledger、affected Step files | 重新跑文档检查并等待用户确认 |
| 可复用经验缺失 | `standards/document/设计真相源闭环与可落码性标准.md` 或相关规范 | 项目经验 / 正反例 | standards diff check and commit |

### 7.4 门禁失败处理矩阵

| 失败项 | 初始判定 | 处理 | 是否可继续 |
|---|---|---|---|
| `cargo check` / compile failed | implementation or dependency issue | 修实现/依赖;若 schema/port 缺口则回设计 | 否 |
| `contract-domain-fast` failed | contract/domain truth gap | 修实现或回 `03`;重跑 | 否 |
| `service-flow-fast` failed | flow/UoW/idempotency/query no-write gap | 修实现或回 `03`;重跑 | 否 |
| `infra-runtime-fake` failed | fake seam 或 runtime binding gap | 修 fake parity 或回 `03/04` | 否 |
| `entry-worker-job` failed | entry/consumer/outbound/job shell gap | 修 entry/worker/job 或回 `03` | 否 |
| `operations-replay-core` failed | replay/checkpoint/report/no truth repair gap | 修 job/replay 或回 `03` | 否 |
| `config-redline` failed | invalid config / silent fallback | 修 config validation or `04` | 否 |
| `dependency-boundary` failed | VETO dependency risk | 移除 non-core dependency or 回架构 | 否 |
| `redaction-boundary` failed | S/VETO security risk | 修 safe output and scanner fixture | 否 |
| `observability-boundary` failed | observability leak/truth risk | 修 logs/metrics/traces/audit | 否 |
| `report-generation-audit` failed | evidence integrity risk | 修 generator/source;保留 failed artifact | 否 |
| `release-main-smoke` failed | release readiness failed | 修底层 suite or representative path | 否 |
| P1 selected-run unavailable | residual | 记录 unavailable and risk acceptance | P0 可继续 |

### 7.5 恢复实施流程

```text
pause trigger
  -> classify: implementation bug / test tool gap / design truth gap / dependency unavailable / VETO / residual
  -> preserve evidence: error, artifact, report, file lines, diff scope
  -> fix implementation or write back owning design source
  -> fix baseline / target repo state
  -> repeat boundary closure review
  -> rerun boundary gates
  -> continue from same boundary
```

| 恢复检查 | 通过条件 |
|---|---|
| baseline | design commit、target repo HEAD、current boundary、required_reads 重新确认 |
| worktree | 只包含当前 boundary 授权改动,无未授权用户改动 staged |
| closure review | field、DTO、port、state、idempotency、query marker、event source、job report、config、evidence、scope 复核通过 |
| gate | 当前 boundary 提交前门禁重跑通过 |
| evidence | failed artifact/report 保留;fixed run 可追溯 |

### 7.6 暂停 / 回退 / 变更停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 必须暂停条件是否明确 | 通过 | 见 §7.1 |
| 回退范围是否保护已验证阶段 | 通过 | 默认只清理当前 boundary 未提交改动 |
| 设计回写目标是否明确 | 通过 | `03/04/05/06/07/standards` 分目标 |
| 门禁失败处理是否明确 | 通过 | 见 §7.4 |
| 外部依赖不可用处理是否明确 | 通过 | P0 暂停;P1/P2 residual |
| 恢复条件是否可判定 | 通过 | baseline/worktree/closure/gate/evidence |
| 是否禁止实现者临时补 schema / port / marker | 通过 | pause + change rule |
| 是否创建真实回退或变更 | 未创建 | 本 Step 只定义规则 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“门禁失败处理矩阵”和“恢复实施流程”小节。

正式 `07-实施计划.md` §10 后续应回填:

实施控制以 commit boundary 为默认恢复单位。目标仓 layout、`core-contracts`、设计真相源、P0 profile、artifact/report root、blocking suite、redaction、dependency、report audit、VETO 和 static evidence 任一失败时,必须暂停当前 boundary。暂停时保留错误、artifact/report、文件行号、diff 范围和建议 owning source;不得用 placeholder、private map、synthetic marker、raw string、timestamp、SQL/HTTP code 或 fake-only shortcut 继续。

回退默认只作用于当前 boundary 未提交改动。不得擅自回退用户改动、已验证历史提交或其他 phase 文件。已提交 boundary 需要修复时,优先新增修复 commit;只有用户明确要求时才 amend/rebase。

设计缺口按 owning source 回写:`03` 负责对象、协议、flow、state、persistence、idempotency;`04` 负责配置、profile、adapter、CLI/env、failure strategy;`05` 负责 suite、artifact、report、EV/gate;`06` 负责 AC、VETO、risk、final decision;`07` 负责 phase、commit boundary、allowed scope、required checks 和 ledger handoff。

恢复实施必须同时满足:新 baseline 固定、当前 boundary closure review 通过、工作区只含授权改动、提交前 gate 重跑通过、failed artifact/report 保留且 fixed run 可追溯。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 已提交 boundary 是否允许 amend/rebase | 默认不允许,除非用户明确要求 | Step 11 提交纪律 |
| failed artifact 保留策略 | 至少保留到修复后 report 可追溯 | Step 12 完成判定 |
| 设计修复后是否需要更新 standards | 若同类经验不存在则更新并给正反例 | standards 维护任务 |
| 真实 implementation ledger 中 pause / recovery 字段 | Step 11/12/13 后创建实例前固定 | Step 11 / Step 12 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 9 已确认 | 通过 | 用户已确认 |
| 暂停规则已定义 | 通过 | §7.1 |
| 回退规则已定义 | 通过 | §7.2 |
| 变更控制已定义 | 通过 | §7.3 |
| 门禁失败处理已定义 | 通过 | §7.4 |
| 恢复条件已定义 | 通过 | §7.5 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R10.2 / Step 11 | 通过 | 用户已确认,允许进入 Step 11 |

## 11. R10.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 10 回退、暂停与变更控制中间产物 |
| 后续动作 | 进入 Step 11 `R11.1 commit review delivery:先思考` |
| 限制 | Step 13 前仍不得修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
