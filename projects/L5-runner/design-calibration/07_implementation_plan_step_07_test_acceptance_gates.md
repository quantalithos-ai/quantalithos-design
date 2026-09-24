# Step 7. 嵌入测试与验收门禁

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7  
> 书写规范：`standards/document/实施计划书写规范.md` §5.7、§7  
> 测试真相源：`projects/L5-runner/05-测试方案.md` 及其 Step 1～15 calibration  
> 验收真相源：`projects/L5-runner/06-验收标准.md` 及其 Step 1～15 calibration  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §7  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 7` |
| `current_module` | `test_acceptance_gates` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_08` |
| `gate_reason` | 六个 phase、18 个 planned commit boundary 均已绑定测试 suite/CUT/TC、AC/AR/TX/NFA/VETO、artifact/report/evidence 归属、脚本参数、失败分类和停审责任；设计层覆盖审计通过，真实实现、运行和验收仍保持 blocked/not_run/not_created。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_08_config_environment_dependencies.md`；完成后停审 |

本 Step 只定义未来实施时如何执行和审查测试、验收、报告及证据门禁。下文的 suite、gate、TC、artifact、report、evidence、run-id、digest 和 review ref 均为计划合同或占位符，不表示任何实例已经创建或通过。当前不创建脚本、测试、artifact、report、evidence、baseline、verdict、signoff 或 readiness。

## 2. 本步输入、输出与执行约束

### 2.1 本步输入

| 输入 | 本步承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 六个可验证 phase、依赖方向、阶段级测试/验收入口 | 不新增 phase，不改变既定依赖顺序 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 18 个 boundary、批次、scope、required reads、Commit/Handoff Gate | 只把门禁嵌入既定 boundary，不重新拆分或合并 boundary |
| `05-测试方案.md` §3～§14 | 18 CUT、108 planned TC、12 suite、6 gate、18 planned evidence slot、固定路径和失败分类 | planned 不等 executed/pass；不生成实例 |
| `06-验收标准.md` §3～§14 | 11 AC、15 AR、10 TX、9 NFA、12 VETO、fixed-run 与 verdict 语义 | 不生成实际 verdict、risk acceptance、signoff 或 readiness |
| `05_test_plan_step_09_automation_gates.md` | suite、流水线、脚本参数、结果分类、跨 suite 审计 | 不选择具体 CI 产品或脚本实现技术 |
| `05_test_plan_step_13_evidence.md`、`06_acceptance_step_10_observability_evidence.md` | slot、artifact schema、report pairing、review 和 evidence maturity | 不把 planned slot/alias 当 runtime evidence |
| `06_acceptance_step_11_veto.md` | VETO 触发、不可豁免和复验语义 | 不用设计层 pass 清除 VETO |
| 实施计划 SOP/书写规范/中间产物规范/台账规范 | phase/boundary 停审、证据边界和移交纪律 | 不以本 Step 重定义规范 |

### 2.2 本步输出

- `GATE-01`～`GATE-12` 的 Step 7 门禁别名与正式 `G-RUN-*` gate 对照；
- 六个 phase 的测试/验收门禁矩阵、执行脚本、artifact/report 输出和失败处理；
- 18 个 boundary 的提交前测试门禁、AC/AR/TX/NFA/VETO 映射、证据归属和失败处理；
- 18 个 CUT、108 个 planned TC、12 个 suite、18 个 slot 的覆盖与主归属规则；
- report generator、redaction/dependency/link/pairing/cleanup check 与人工/Agent 审查规则；
- phase/boundary 停审记录、跨门禁覆盖/重复/缺失/证据 owner 审计；
- 可回填未来正式 `07-实施计划.md` §7 的草稿。

### 2.3 强制约束

1. 每个 phase 至少有一个测试门禁；涉及用户可见行为、跨仓接口、状态转换、数据一致性或资源清理时，必须同时回指验收门禁。
2. 每个 commit boundary 必须有提交前 Test Gate；不能执行的 positive lane 必须明确 `blocked / not_run`，不得用 fake、fixture、profile 名或设计审查替代。
3. 所有未来命令都必须显式携带 `--run-id`、`--artifact-root`、`--config-profile`；禁止 `latest`、跨 run 拼接、静态 evidence 和隐式默认选择。
4. artifact 只归档到 `artifacts/test/<run_id>/`；运行报告只归档到 `reports/runs/<run_id>/`；验收和 review 只归档到 `reports/acceptance/`、`reports/review/`。
5. `blocked`、`not_run`、`timeout`、`flaky`、`dependency_unavailable`、`redaction_failure` 和 `cleanup_failure` 必须保留原语义；不得压成 pass，也不得从分母删除。
6. `reports/acceptance/*` 只能是脚本初稿和人工/Agent 审查载体；不能自动写 verdict、signoff、risk acceptance 或 readiness。
7. Runner 的 Query 仍 no-write；Consumer 仍 header-first、no payload/no ACK；Job 仍 local-only/no owner repair；Runner outbound event/outbox/publisher/topic 仍为 0。
8. 当前所有 actual 状态保持 `not_evaluated`、`not_created` 或 `blocked`；Step 7 的 `pass` 只表示设计门禁矩阵完整。

## 3. SOP 问题回答

| SOP 问题 | Runner 本步回答 | 收口结论 |
|---|---|---|
| 每个阶段执行哪些测试切口？ | 由 phase 的纵切能力绑定 CUT、主 suite 和 negative/controlled lane；同一 CUT 可被多个 suite 观察，但只有一个 canonical evidence slot 主归属。 | 六个 phase 均有可追溯测试分母和主证据 owner。 |
| 哪些阶段必须对齐 AC？ | PH-02 起所有涉及选择、材料、运行、清理、诊断、Consumer、Job 或 handoff 的 phase 都回指 `AC-RUN-*`；PH-06 负责 fixed-run 条件下的最终交接输入。 | AC 只作为 future acceptance contract，不提前判定。 |
| 每个门禁产出什么证据？ | 低层 gate 产出同一 run 的 case/suite/check artifact；report generator 产出人读报告；evidence index 只从有效 raw/report/check pair 生成。 | 证据 owner 和 maturity 分层明确，静态表不能造证据。 |
| 门禁失败能否继续？ | 本 boundary 的 Test/Evidence Gate 失败时不得提交或进入下一 boundary；`dependency_unavailable` 使对应 lane blocked/not_run，只有明确不依赖该 lane 的 negative boundary 才可继续。 | 继续条件是显式、可审查的 carve-out，不是默认放行。 |
| 哪些门禁自动化、哪些人工？ | schema/state/write/dependency/redaction/link/pairing 由脚本和 suite 自动化；报告语义、VETO、风险、handoff 和范围审查需要独立人/Agent review。 | 人工 review 不能改 raw status/digest。 |
| 哪些 VETO 要前置规避？ | VETO-001～012 均在相关 phase/boundary 映射；尤其 implicit selector、owner write、private seam、Query/Consumer/Job 副作用、Unknown replay、redaction、证据真实性和伪 readiness。 | VETO 命中或 required check unavailable 时总体不可通过。 |
| 脚本和参数如何固定？ | 采用 `scripts/gates/`、`scripts/checks/`、`scripts/reports/`；所有调用显式传三项核心参数，report/check 另传其所需 root/ref。 | 路径是计划合同，具体实现待 Step 8/11 与实现仓 authority。 |
| 哪些报告需要人工补充？ | suite/run 报告可自动生成；`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 和 `reports/review/*` 必须独立审查。 | 未审查的 acceptance draft 不能进入最终裁决。 |
| 是否已执行任何测试或验收？ | 没有。实现仓、baseline、fixed run、artifact、report、evidence、review 均不存在或未授权。 | 本 Step 仅完成设计层 gate matrix，actual 全部保持未评估。 |

## 4. 当前文档问题诊断与设计取舍

### 4.1 问题诊断

| 问题 | 风险 | Step 7 处理 |
|---|---|---|
| Step 6 已有 boundary，但测试/验收责任仍可能被理解为 phase 末尾一次性执行 | 提交边界无法独立 review，失败会跨 boundary 泄漏 | 每个 boundary 建立 Test/Evidence/Commit Gate，绑定主 suite、TC 和失败处理。 |
| 05 的 suite、TC、slot 与 06 的 AC/AR/TX/NFA/VETO 分散在不同章节 | 可能遗漏安全红线或重复产生 evidence | 先固定 CUT/family/slot 主归属，再建立 boundary 和 cross-gate 反查。 |
| positive owner seam 尚未闭合 | 实现者可能用 fake pass 或本地 receipt 冒充真实结果 | positive lane 显式 `blocked/not_run`；negative lane 仍可验证安全拒绝。 |
| report generator 早于最终 evidence detail | 可能把报告初稿误当正式 evidence | 区分 script capability、minimal index shell、runtime evidence、reviewed handoff 四种 maturity。 |
| `blocked`、`not_run`、`timeout` 和 `flaky` 容易被汇总脚本压平 | 形成虚假 pass 或隐藏依赖问题 | 固定结果枚举、失败处理和新 run 重跑规则。 |
| Query/Consumer/Job 的副作用红线不同 | 统一“集成测试”会漏掉 no-write/no-ACK/no-owner-repair | 各自绑定专属 suite、静态扫描和 VETO。 |

### 4.2 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 只在六个 phase 末尾跑全量 suite | 表格较短 | boundary 无独立证据，失败定位和回退困难 | 不采用 |
| 每个 TC 独立生成一个 acceptance report | 粒度极细 | 报告/证据重复，无法保持 canonical owner | 不采用 |
| boundary 提交前跑目标切口，phase 完成再跑聚合 gate | 兼顾 review 粒度和阶段完整性 | 需要维护主归属、secondary 引用和 pair 规则 | 采用 |
| positive seam 不可用时用 semantic fake 代替 | 可快速得到绿色结果 | 会伪造跨仓/产品 readiness | 不采用；只允许明确的 negative/controlled fake |
| 所有报告由脚本自动判定 | 可重复 | 语义、风险和 VETO 需要责任审查 | 不采用；脚本生成初稿，独立 review 才能交接 |

## 5. 门禁编号、分母与证据主归属

### 5.1 Step 7 门禁别名

以下 `GATE-01`～`GATE-12` 是本 Step 为实施计划建立的可读别名，便于 boundary 表引用；它们不新增 05/06 的测试或验收 authority，正式执行仍必须回指现有 `S-RUN-*`、`G-RUN-*`、`AC/AR/TX/NFA/VETO`。

| Step 7 alias | 门禁主题 | 主要正式 suite/check | 失败后动作 |
|---|---|---|---|
| `GATE-01` | contract/schema/typed carrier | `S-RUN-CONTRACT`、`TC-RUN-CON-*`、`TC-RUN-ENT-*` | 回写 03 protocol/entry；停 boundary |
| `GATE-02` | domain/state/axis separation | `S-RUN-DOMAIN`、CTX/MAT/REQ/CTL/RES/REC | 回写 03 state/error；不得提交 |
| `GATE-03` | service/UoW/idempotency/recovery | `S-RUN-SERVICE`、`S-RUN-UOW` | 修复 flow/UoW/保存面并新 run 复验 |
| `GATE-04` | controlled/public owner seam | `S-RUN-CONTROLLED`、dependency check | seam 缺失为 blocked；禁止 private fallback |
| `GATE-05` | Query/read-model no-write | `S-RUN-ENTRY`、QRY/BND write audit | 任何 write/refresh/reconcile/probe=0，否则 VETO 候选 |
| `GATE-06` | Consumer header-first/no-ACK | `S-RUN-CONSUMER`、CNS/BND | payload/ACK/cursor 非零即阻断 |
| `GATE-07` | Job claim/checkpoint/local-only | `S-RUN-JOB`、`S-RUN-REPLAY` | stale fence、owner repair、unknown replay 即阻断 |
| `GATE-08` | strict config/readiness | `S-RUN-CONFIG`、CFG | fail-open/half facade/profile contamination 即阻断 |
| `GATE-09` | security/dependency/redaction | `S-RUN-SECURITY`、boundary/redaction check | finding 或 scanner unavailable 即阻断 |
| `GATE-10` | artifact/report/pairing | link/pairing/no-static checks | 缺 pair、跨 run、静态 EV 即 incomplete/blocked |
| `GATE-11` | AC/VETO/target-tier acceptance | `G-RUN-*` + 06 AC/VETO | required failed/blocked 或 VETO 未 clear 不得送验 |
| `GATE-12` | handoff/review/completion input | acceptance reports + `reports/review/*` | 未审查、缺 open issues 或伪 verdict 不得 handoff |

### 5.2 测试与验收分母

| 对象 | 正式分母 | 本 Step 的处理 |
|---|---:|---|
| 测试切口（CUT） | 18 | 每个 CUT 有唯一 family、主 suite、planned slot 和 phase/boundary 主归属；secondary suite 只引用不重复计数。 |
| planned TC | 108 | 逐 family 保留完整范围；未来 machine index 必须展开每一个 `TC-RUN-*`，不得用 range 隐藏缺失。 |
| planned suite | 12 | `S-RUN-CONTRACT`、`DOMAIN`、`SERVICE`、`UOW`、`CONTROLLED`、`ENTRY`、`CONSUMER`、`JOB`、`CONFIG`、`SECURITY`、`REPLAY`、`E2E`。 |
| pipeline gate | 6 | `G-RUN-PR`、`MAIN`、`NIGHTLY`、`CONTROLLED`、`STAGING`、`RELEASE`。 |
| evidence slot | 18 | `ESLOT-RUN-001~018`；仅有效 same-run raw/report/check pair 才能形成 runtime evidence。 |
| 功能 AC | 11 | `AC-RUN-001~011`，按 target tier 绑定；单项通过不推出总体 verdict。 |
| 架构红线 | 15 | `AR-RUN-001~015`，全部至少映射一项 VETO 和 boundary check。 |
| 事务/一致性 | 10 | `TX-RUN-001~010`，与 UoW/IDM/REC/JOB/Consumer/evidence 绑定。 |
| 非功能 | 9 | `NFA-RUN-001~009`；`NFA-RUN-008` 仅在有 authority 时进入 hard gate。 |
| 一票否决 | 12 | `VETO-RUN-001~012`；hit/disputed/required check unavailable 不得风险接受。 |

### 5.3 CUT、TC、slot 与主 evidence owner

| CUT | Family / TC 分母 | 主 suite | 主 slot / alias | Phase / 主 boundary |
|---|---|---|---|---|
| `CUT-01` | CTX / `TC-RUN-CTX-001~006`（6） | CONTRACT/DOMAIN/SERVICE | `ESLOT-RUN-001` / `EV-RUN-CTX-001` | PH-02 / `commit-ph-02-a` |
| `CUT-02` | MAT / `TC-RUN-MAT-001~007`（7） | DOMAIN/SERVICE/CONTROLLED | `ESLOT-RUN-002` / `EV-RUN-MAT-002` | PH-02 / `commit-ph-02-b` |
| `CUT-03` | REQ / `TC-RUN-REQ-001~006`（6） | SERVICE/UOW/CONTROLLED | `ESLOT-RUN-003` / `EV-RUN-REQ-003` | PH-03 / `commit-ph-03-b` |
| `CUT-04` | CTL / `TC-RUN-CTL-001~005`（5） | SERVICE/UOW/CONTROLLED | `ESLOT-RUN-004` / `EV-RUN-CTL-004` | PH-03 / `commit-ph-03-a` |
| `CUT-05` | OWN / `TC-RUN-OWN-001~005`（5） | SERVICE/CONTROLLED/REPLAY | `ESLOT-RUN-005` / `EV-RUN-OWN-005` | PH-03 / `commit-ph-03-d` |
| `CUT-06` | RES / `TC-RUN-RES-001~006`（6） | DOMAIN/CONTROLLED/JOB | `ESLOT-RUN-006` / `EV-RUN-RES-006` | PH-03 / `commit-ph-03-a` |
| `CUT-07` | REC / `TC-RUN-REC-001~006`（6） | SERVICE/UOW/JOB/REPLAY | `ESLOT-RUN-007` / `EV-RUN-REC-007` | PH-03 / `commit-ph-03-c` |
| `CUT-08` | PRE / `TC-RUN-PRE-001~006`（6） | DOMAIN/SERVICE/SECURITY | `ESLOT-RUN-008` / `EV-RUN-PRE-008` | PH-04 / `commit-ph-04-a` |
| `CUT-09` | QRY / `TC-RUN-QRY-001~006`（6） | SERVICE/ENTRY/SECURITY | `ESLOT-RUN-009` / `EV-RUN-QRY-009` | PH-04 / `commit-ph-04-c` |
| `CUT-10` | CON / `TC-RUN-CON-001~006`（6） | CONTRACT/ENTRY | `ESLOT-RUN-010` / `EV-RUN-CON-010` | PH-01/05 / `commit-ph-05-a` |
| `CUT-11` | IDM / `TC-RUN-IDM-001~006`（6） | SERVICE/UOW | `ESLOT-RUN-011` / `EV-RUN-IDM-011` | PH-03 / `commit-ph-03-b` |
| `CUT-12` | UOW / `TC-RUN-UOW-001~006`（6） | UOW/SERVICE/REPLAY | `ESLOT-RUN-012` / `EV-RUN-UOW-012` | PH-03 / `commit-ph-03-b` |
| `CUT-13` | ENT / `TC-RUN-ENT-001~005`（5） | ENTRY/CONTRACT/SERVICE | `ESLOT-RUN-013` / `EV-RUN-ENT-013` | PH-03 / `commit-ph-03-d` |
| `CUT-14` | CNS / `TC-RUN-CNS-001~006`（6） | CONSUMER/CONTRACT | `ESLOT-RUN-014` / `EV-RUN-CNS-014` | PH-05 / `commit-ph-05-a` |
| `CUT-15` | JOB / `TC-RUN-JOB-001~008`（8） | JOB/UOW/REPLAY | `ESLOT-RUN-015` / `EV-RUN-JOB-015` | PH-05 / `commit-ph-05-c` |
| `CUT-16` | CFG / `TC-RUN-CFG-001~006`（6） | CONFIG/CONTROLLED/SECURITY | `ESLOT-RUN-016` / `EV-RUN-CFG-016` | PH-01/02 / `commit-ph-01-b` |
| `CUT-17` | OBS / `TC-RUN-OBS-001~006`（6） | SECURITY/CONTRACT/REPLAY | `ESLOT-RUN-017` / `EV-RUN-OBS-017` | PH-04 / `commit-ph-04-b` |
| `CUT-18` | BND / `TC-RUN-BND-001~006`（6） | CONTRACT/SECURITY/SERVICE | `ESLOT-RUN-018` / `EV-RUN-BND-018` | PH-05/06 / `commit-ph-05-d` |

总和为 `6+7+6+5+5+6+6+6+6+6+6+6+5+6+8+6+6+6 = 108`。主归属不限制 secondary suite 对同一 TC 做一致性或安全复核，但 evidence index 只能由 canonical producer pair 产生一个主 alias。

## 6. 脚本、参数、artifact 与 report 合同

### 6.1 计划脚本目录与命令模板

以下命令仅为未来实现仓的逻辑合同，当前不执行、不创建脚本。`<run_id>`、`<artifact_root>`、`<profile>` 是占位符，不是实际 run 或路径实例。

| 逻辑路径 | 责任 | 最小命令形状（未来） | 计划输出 |
|---|---|---|---|
| `scripts/gates/run-pr.sh` | PR contract/domain/service/config/security | `run-pr.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile test-deterministic` | suite index/status |
| `scripts/gates/run-main.sh` | main P0 semantic suites | `run-main.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile test-deterministic` | suite reports + gate status |
| `scripts/gates/run-nightly.sh` | replay/fault/concurrency/repeatability | `run-nightly.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile test-deterministic` | replay/fault summary |
| `scripts/gates/run-controlled.sh` | 一个已授权 upstream slot | `run-controlled.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile integration-pending --slot <slot_ref>` | slot result |
| `scripts/gates/run-release.sh` | future staging/release aggregate | `run-release.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile product-pending` | blocked until authority |
| `scripts/checks/check-boundary.sh` | private dependency、SDK bypass、event-zero | `check-boundary.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile>` | `checks/dependency-boundary.json` |
| `scripts/checks/check-redaction.sh` | artifact/report/acceptance/review forbidden-field scan | `check-redaction.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile> --report-root reports` | redaction check |
| `scripts/checks/check-evidence-links.sh` | TC/CUT/suite/slot/AC/run/digest links | `check-evidence-links.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile>` | evidence link check |
| `scripts/checks/check-report-pairing.sh` | raw/report/case/log 双向配对 | `check-report-pairing.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile>` | pairing check |
| `scripts/checks/check-cleanup.sh` | run namespace、journal、canary、残留引用 | `check-cleanup.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile>` | cleanup journal/status |
| `scripts/reports/render-suite-report.sh` | suite artifact → 人读 suite report | `render-suite-report.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile> --report-root reports` | `reports/runs/<run_id>/suites/<suite>.md` |
| `scripts/reports/render-run-summary.sh` | 全 suite/check → run summary | `render-run-summary.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile> --report-root reports` | `summary.md`、`gate-results.md` |
| `scripts/reports/render-evidence-index.sh` | 有效 pair → machine/human evidence index | `render-evidence-index.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile> --report-root reports` | index/detail 或 incomplete slot |
| `scripts/reports/render-acceptance-handoff.sh` | run reports → acceptance 初稿 | `render-acceptance-handoff.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile <profile> --report-root reports` | `reports/acceptance/*.md` |

命令合同补充规则：`--run-id` 不能为 `latest`，`--artifact-root` 不能加入项目子目录，`--config-profile` 只能是 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending`；未知 profile、suite、slot 或路径权限失败必须 fail-fast。脚本不能读取 sibling 私有实现、直接 DB/bus/topic 或隐藏默认 config。

### 6.2 Artifact 与 report 归属

```text
artifacts/test/<run_id>/
  meta/{context,config-summary,source-revisions}.json
  suites/<suite>/{report.json,stdout.log,stderr.log,cases/<tc_id>.json,artifacts/*.json}
  checks/{redaction,dependency-boundary,evidence-links,report-pairing,cleanup}.json
  evidence-index.json

reports/runs/<run_id>/
  summary.md
  gate-results.md
  suites/<suite>.md
  evidence-index.md
  evidence/<evidence_id>.md
  {redaction-check,dependency-boundary,evidence-link-check,report-pairing,cleanup}.md

reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md
reports/review/{reviewer-notes,agent-review}.md
```

| 产物 | writer owner | reader/reviewer | 成熟度与限制 |
|---|---|---|---|
| case/suite/check machine JSON | 对应 suite/gate/check 脚本 | report/evidence generator | 必须带 run/suite/TC/status/digest；当前未创建 |
| suite/run report | `scripts/reports/*` | boundary/phase gate、人工/Agent | 只能由同 run raw 生成；不能改 raw 状态 |
| evidence index/detail | evidence generator | 06 acceptance | 无 valid pair 不生成 alias；slot 可为 incomplete |
| acceptance handoff/VETO/risk/issues | handoff generator + reviewer | acceptance authority/GRC | 初稿必须独立 review；不写 verdict/signoff |
| reviewer notes | 独立 reviewer/Agent | final decision authority | 只能增加审查意见，不覆盖 raw/report/digest |

Artifact status 允许 `passed/failed/blocked/not_run/timeout/flaky/incomplete`；review 允许 `pending/reviewed/disputed`；任何缺失、失败或 scanner unavailable 都必须显式保留。所有实际 status 在当前阶段均为 `not_created` 或 `not_evaluated`。

### 6.3 报告生成和人工/Agent 审查规则

| 报告阶段 | 自动生成输入 | 自动输出 | 必须人工/Agent 审查的内容 | 审查禁止事项 |
|---|---|---|---|---|
| suite | case JSON、stdout/stderr、check refs | suite markdown + machine summary | case 分母、失败类别、cleanup/redaction、TC 主归属 | 不可删除 failed/blocked/not_run |
| run | context + suite/check reports | summary、gate-results | tier/profile、denominator、依赖状态、跨 suite 重复 | 不可把 blocked 计 pass |
| evidence | valid same-run pairs | index/detail 或 incomplete slot | 逐 TC/CUT/AC、digest、link、缺失影响 | 不可手写 EV 或跨 run 补洞 |
| acceptance | run/evidence/VETO/risk/open issues | handoff、veto、risk、issues | 范围、未执行、VETO、风险资格、争议和下一 gate | 不可生成 verdict/signoff/readiness |
| independent review | acceptance package + 抽查 raw refs | reviewer notes | reviewer identity/role、抽查范围、结论和 dispute | 不可回写 raw status/digest |

审查顺序固定为：先核同一 run 和 source digest，再核 raw→suite report→check→evidence index/detail 的双向可达性，再核 AC/AR/TX/NFA/VETO 和 open issues，最后才写 review note。任何审查者发现设计 schema、owner seam、artifact schema 或 phase boundary 缺口，必须停止并回写设计台账，不能在报告中自行补定义。

## 7. 六个 phase 的测试与验收门禁矩阵

表中 `planned` 表示未来可执行合同，`blocked`/`not_run` 表示当前事实。任何 phase 的设计层 `pass` 都不能替代目标实现仓、工具链、baseline、fixed run 或外部 authority。

| Phase | 测试门禁（主 suite / CUT） | 验收门禁（AC / AR / TX / NFA / VETO） | 执行脚本（未来） | artifact 输出 | report 输出 | 失败、blocked 与继续规则 |
|---|---|---|---|---|---|---|
| `PH-01` 仓、配置、测试与证据前置 | `GATE-01/08/09/10`；`S-RUN-CONTRACT`、`S-RUN-CONFIG`、`S-RUN-SECURITY`；CUT-10/16/18 的 contract/config/boundary 负向 TC | AC-001/002/011；AR-004/008/009/010/011；TX-010；NFA-001/005/006；VETO-001/004/005/009/011/012 | `run-pr.sh`；`check-boundary.sh`、`check-redaction.sh`；当前目标仓/工具 authority 缺失，实际不调用 | 未来 `artifacts/test/<run_id>/meta/*`、对应 suite case/report/check；不生成 EV 实例 | `reports/runs/<run_id>/suites/*`、`gate-results.md`；无真实输入则不创建 | authority、schema、path 或 redaction 失败时停在 PH-01；只有不依赖缺失 positive seam 的 semantic negative 可继续，且仍需保留 blocker |
| `PH-02` Context、选择与材料资格 | `GATE-01/02/03/04/08/09`；`S-RUN-CONTRACT/DOMAIN/SERVICE/CONFIG/CONTROLLED`；CUT-01/02/10/13/16 | AC-001～004；AR-001/003/004/009/013/014；TX-004/005/006；NFA-001/002/003/006；VETO-001/002/003/004/009/010 | `run-main.sh`；获 slot 后才可 `run-controlled.sh`；三项核心参数必填 | `suites/S-RUN-{CONTRACT,DOMAIN,SERVICE,CONFIG,CONTROLLED}`、case JSON、call/write/redaction refs | 各 suite report、`summary.md`、必要时 incomplete slot；不得把 fake positive 计入 | implicit selector、authority/integrity bypass、Complete→Qualified shortcut 或 pair 缺失即阻断；Artifact/Governance positive unavailable 只记 blocked，不得进入 PH-03 positive lane |
| `PH-03` 请求、控制、资源与恢复 | `GATE-01/02/03/04/05/07/09`；`S-RUN-DOMAIN/SERVICE/UOW/CONTROLLED/ENTRY/JOB/REPLAY`；CUT-03～07/11/12/15/18 | AC-005～009；AR-001/003/004/005/007/012/013/014；TX-001～009；NFA-001～004/007；VETO-003/004/005/006/007/010 | `run-main.sh`、`run-nightly.sh`；授权 slot 才能 `run-controlled.sh`；`check-boundary.sh`、`check-cleanup.sh` | run/control/resource/recovery case、UoW/idempotency/claim/checkpoint artifacts；同 run | service/UoW/replay/job reports、cleanup report、gate results；无 owner readback 时为 blocked | external/commit Unknown 必须进入 RecoveryCase；任何 replay/resend/reclaim/delete、ACK/PID→Running 或 Confirmed→Cleaned 直接失败并停 phase |
| `PH-04` 预览、诊断、交接与 Query | `GATE-01/05/09/10`；`S-RUN-CONTRACT/SERVICE/ENTRY/SECURITY/REPLAY`；CUT-08/09/10/17 | AC-006/009/010/011；AR-002/003/005/010/015；TX-010；NFA-005/006/009；VETO-003/005/008/010/011/012 | `run-main.sh`、`run-nightly.sh`；`check-redaction.sh`、`check-evidence-links.sh`、`check-report-pairing.sh` | bounded view/diagnosis/handoff case、write-audit、redaction and source refs；不产生 formal EV | suite reports、redaction/link/pairing report；handoff 只为 planned draft | Query 任一 write/refresh/reconcile/probe/dispatch、raw leak、receipt→evidence 或 missing pair 即阻断；Observability positive unavailable 不得用 local log 替代 |
| `PH-05` Consumer、Job、自动化与报告能力 | `GATE-01/03/06/07/09/10`；`S-RUN-CONTRACT/CONSUMER/JOB/UOW/REPLAY/SECURITY`；CUT-10/14/15/17/18 | AC-003/008/009/010/011；AR-004/005/006/007/008/010/014/015；TX-004/007/008/010；NFA-001/003/004/005/006；VETO-004/005/007/008/010/011/012 | `run-main.sh`、`run-nightly.sh`；`check-boundary.sh`、`check-redaction.sh`、`render-*` 仅生成初稿 | header/receipt、job claim/checkpoint/report、script/check/index shell；同 run；不生成 final EV | suite/job/report/index 初稿；`reports/acceptance/*` 仍待审查 | Consumer payload/ACK/cursor、Job owner repair/replay、event/outbox 非零、静态 EV 或 report pairing 缺失即阻断；positive transport/scheduler unavailable 记 blocked |
| `PH-06` Selected integration、release 与 handoff | `GATE-04/09/10/11/12`；`S-RUN-CONTROLLED/E2E/SECURITY/REPLAY`；selected CUT/TC 与 18 slots | target-tier AC-001～011；AR-001～015；TX-001～010；NFA-001～009（008 仅有 authority 时）；VETO-001～012 | `run-controlled.sh`、`run-release.sh`；全量 boundary/redaction/link/pairing/cleanup checks；当前不执行 | same-run selected artifacts、checks、evidence index/detail（仅有效 pair）；当前 0 | `reports/runs/<run_id>/*`、`reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md`、`reports/review/*` | 缺 baseline、authority、fixed run、required check 或独立 review 即 blocked/incomplete；不得形成 verdict/signoff/readiness |

### 7.1 Phase gate 的执行顺序与停止条件

```text
[boundary Test Gate]
      | pass + required evidence pairing / planned N/A
      v
[phase aggregate gate]
      | pass + acceptance mapping + independent review where required
      v
[next phase / next boundary]

any failed | blocked required | not_run required | timeout | flaky
      -> stop current boundary/phase
      -> preserve raw status and blocker
      -> fix design / dependency / implementation or start a new run
```

关键说明：

- 图只表达门禁先后和停止关系，不表达 CI 平台、线程、部署拓扑或已经存在的命令。
- `planned N/A` 只适用于该 boundary 明确不产生该类 artifact 的设计场景；不能把缺少执行条件伪装成 N/A。
- phase aggregate 不能吞掉 boundary 的 failed/blocked/not-run；聚合报告必须保留分母、状态、source digest 和 blocker refs。
- 进入下一 phase 前必须完成当前 phase 的停审、跨 suite 覆盖审计和台账回写；当前所有 phase 仍是 planned/blocked。

## 8. 18 个 commit boundary 的提交前门禁矩阵

每一行都是未来 boundary 的最小 Test Gate / Evidence Gate 合同。`TC` 使用 family 范围只是索引写法；真正运行和 machine artifact 必须展开到每个正式 TC ID。`EV` 只代表主 slot/alias 计划，不代表实例存在。

| Boundary | 提交前测试门禁（suite / CUT / TC 主范围） | 验收与红线映射 | artifact / report 归属 | 失败与 handoff 规则 |
|---|---|---|---|---|
| `commit-ph-01-a` | `GATE-01/09`；`S-RUN-CONTRACT`；CUT-10/18：CON/ENT/BND contract/SDK/event-zero TC | AC-011；AR-004/008/011；TX-010；NFA-001/005；VETO-004/005/011 | `S-RUN-CONTRACT` case/report、dependency/event-zero check；无 EV 主 slot | 依赖/命名/边界 finding 停 boundary；不创建实现 commit 或 handoff hash |
| `commit-ph-01-b` | `GATE-08/09/10`；`S-RUN-CONFIG/SECURITY`；CUT-16/17/18：CFG/OBS/BND TC | AC-002/004/010/011；AR-009/010/015；TX-010；NFA-001/006；VETO-009/010/011/012 | config/redaction/boundary case、check JSON、planned report path；EV-016/017/018 仅 future | config fail-open、scanner unavailable、静态 evidence 或 pair 缺口停 boundary；PH-02 不得启用 |
| `commit-ph-02-a` | `GATE-01/02`；`S-RUN-CONTRACT/DOMAIN`；CUT-01：CTX-001~006 + selection state assertions | AC-001/002；AR-003/009/013/014；TX-004/005；NFA-001/002/003；VETO-001/009/010 | CTX case/suite reports、generation/write audit；`ESLOT-RUN-001/EV-RUN-CTX-001` planned | implicit/latest、scope/generation mismatch 或 state shortcut 失败；selection blocker 回写 03，不能进入 02-b |
| `commit-ph-02-b` | `GATE-02/03`；`S-RUN-DOMAIN/SERVICE/UOW`；CUT-02：MAT-001~007，关联 IDM/UOW negative | AC-003/004；AR-001/003/009/013/014；TX-004/005/006；NFA-001/002/003/004；VETO-002/003/009/010 | MAT/IDM/UOW cases、integrity/cache call journal、EV-002 planned | Complete/Verified/Qualified shortcut、digest/authority bypass 或 duplicate effect 停 boundary；positive verifier/cache unavailable 记 blocked |
| `commit-ph-02-c` | `GATE-04/05/09`；`S-RUN-CONTROLLED/CONFIG/SECURITY`；CUT-01/02/16/18 的 adapter unavailable、query no-write、boundary TC | AC-001～004/011；AR-003/004/005/009/014；TX-010；NFA-001/002/005/006；VETO-001～004/009 | adapter outcome、safe query、dependency/redaction checks；EV-010/016/018 future | private SDK/DB/bus、cache-as-authority 或 Query write 停 boundary；exact seam 未闭合则 `blocked/not_run` |
| `commit-ph-03-a` | `GATE-01/02`；`S-RUN-CONTRACT/DOMAIN`；CUT-04/06：CTL/RES state/guard TC | AC-005～008；AR-001/003/012/013/014；TX-003/009；NFA-001/002/007；VETO-003/006/010 | control/resource/guard cases、observation/guard refs、EV-004/006 planned | Accepted≠Running、Confirmed≠Cleaned 或 probe→allocation shortcut 失败；回写 state/guard，不进入 03-b |
| `commit-ph-03-b` | `GATE-03/04/09`；`S-RUN-SERVICE/UOW/CONTROLLED`；CUT-03/04/11/12：REQ/CTL/IDM/UOW TC | AC-005/008/009；AR-001/003/004/013/014；TX-001～006/009；NFA-001～004；VETO-003/004/006/007/010 | effect/UoW/idempotency cases、stored result/recovery refs、EV-003/004/011/012 planned | external/commit Unknown 不得重放；ACK/PID 不升 Running；failure 停 boundary并保留 RecoveryCase |
| `commit-ph-03-c` | `GATE-03/07`；`S-RUN-REPLAY/JOB/UOW`；CUT-07：REC-001~006 + IDM/UOW unknown | AC-009；AR-007/010/014；TX-006/007/010；NFA-004/005；VETO-007/010/011/012 | RecoveryCase/manual-review/replay cases、EV-007/012 planned；不产生 formal evidence | owner readback unavailable、replay/resend/reclaim 或 missing result 重构即阻断；PH-03-d 等待人工/设计闭口 |
| `commit-ph-03-d` | `GATE-03/05/09`；`S-RUN-SERVICE/ENTRY/REPLAY`；CUT-03～07/09/11/12/13 的 lifecycle/query no-write TC | AC-005～009；AR-005/010/014；TX-001～010；NFA-001～005；VETO-003/005/007/010/011 | service/query reports、write audit、EV-003～007/009/011/012/013 planned | Query/entry 写入、state compression 或 result detail 缺失停 boundary；无 entry/store authority 不得移交 |
| `commit-ph-04-a` | `GATE-01/09`；`S-RUN-CONTRACT/SECURITY`；CUT-08/17：PRE/OBS safe view/redaction TC | AC-010；AR-002/015；TX-010；NFA-005/006/009；VETO-008/010/012 | bounded presentation/redaction cases、EV-008/017 planned；无 raw | forbidden field、high-cardinality 或 scanner unavailable 停 boundary；不把 safe view 当 formal evidence |
| `commit-ph-04-b` | `GATE-04/05/09/10`；`S-RUN-SERVICE/ENTRY/SECURITY/REPLAY`；CUT-08/09/17 | AC-010/011；AR-002/003/005/010/015；TX-010；NFA-005/006/009；VETO-003/005/008/011/012 | diagnosis/handoff/query cases、redaction/link/pairing checks、EV-008/009/017 planned | handoff ACK→evidence、Query write、raw fallback 或 report orphan 停 boundary；Observability positive blocked |
| `commit-ph-04-c` | `GATE-05/09/10`；`S-RUN-ENTRY/SECURITY`；CUT-09/18：QRY/BND no-write/projection identity TC | AC-006/009/010/011；AR-005/010/014/015；TX-003/010；NFA-003/005/006；VETO-005/010/011 | read-model section/call audit、EV-009/018 planned；不生成 report evidence | implicit refresh/reconcile/upsert 或 section identity 缺失停 boundary；不进入 PH-05 |
| `commit-ph-05-a` | `GATE-01/06/09`；`S-RUN-CONSUMER/CONTRACT`；CUT-14/18：CNS-001~006、BND event-zero | AC-011；AR-004/006/008；TX-008/010；NFA-001/003/005/006；VETO-004/005/011 | header/receipt case、call/write/ACK audit、EV-014/018 planned | payload parse/hash/store、owner cursor、ACK 或 event 非零即阻断；transport schema 缺失保持 blocked |
| `commit-ph-05-b` | `GATE-01/03/07`；`S-RUN-JOB/UOW/REPLAY`；CUT-15：JOB-001~008 public/report/replay | AC-003/008/009/010/011；AR-007/010/014；TX-004/007/010；NFA-003/004/005；VETO-005/007/010/011 | job DTO/report/claim/checkpoint cases、EV-015 planned；不产生 owner evidence | public result detail、stored report 或 idempotency 不对称停 boundary；不实现 owner repair |
| `commit-ph-05-c` | `GATE-07/09`；`S-RUN-JOB/REPLAY`；CUT-15/18：claim/checkpoint/generation/no-repair TC | AC-003/009/010/011；AR-007/012/014；TX-003/006/007/009；NFA-001/004/005/007；VETO-006/007/010 | local job report/checkpoint cases、EV-015/018 planned；不生成 final EV | stale claim/checkpoint takeover、owner mutation、automatic replay/delete 停 boundary；scheduler/store unavailable 记 blocked |
| `commit-ph-05-d` | `GATE-09/10`；`S-RUN-SECURITY/CONTRACT/REPLAY`；CUT-10/17/18：boundary/redaction/link/pairing/no-static TC | AC-010/011；AR-004/008/010/015；TX-010；NFA-005/006；VETO-004/005/008/011/012 | script/check/report/index capability、EV-017/018 future；当前无实例 | static EV、cross-run、missing pair 或 report generator failure 停 boundary；只允许 PH-06 读取合约 |
| `commit-ph-06-a` | `GATE-04/08/09/11`；`S-RUN-CONTROLLED/E2E/CONFIG/SECURITY`；selected CUT/TC | target AC-001～011；AR-001～015；TX-001～010；NFA-001～009（008 conditional）；VETO-001～010 | baseline/preflight/selected adapter artifacts、all applicable checks；EV only with valid pair | 缺 authority/baseline/environment/fixed run 或 private seam 停 boundary；不伪造 positive result |
| `commit-ph-06-b` | `GATE-10/11/12`；`S-RUN-E2E/SECURITY/REPLAY` + all link/pairing/redaction checks | all target AC/AR/TX/NFA/VETO；06 exit/decision conditions | same-run evidence index/detail、acceptance/handoff/VETO/risk/issues/review paths；无 valid pair 则 incomplete | 任一 required check failed/unavailable、VETO 未 clear、review 缺失或 cross-run 即 blocked；不产生 verdict/signoff/readiness |

每个 boundary 的 Test Gate 都必须在其 planned ledger 中回写：实际 suite/case status、首失败、blocker、run/source digest、cleanup status、Evidence Gate 结论和下一动作。当前这些字段尚无实例，故统一保持 `planned / blocked / waiting / not_created`。

## 9. 报告生成、证据成熟度与人工审查

### 9.1 成熟度分层

| 成熟度 | 可做什么 | 不可声称 | 允许的 phase/boundary |
|---|---|---|---|
| `planned_slot` | 登记 slot、CUT/TC、主 suite、AC 和路径模板 | artifact、report、EV 已存在或通过 | PH-01～PH-05 的计划索引；所有 boundary |
| `script_capability` | 校验参数、路径、失败分类、redaction/check 入口 | 真实 suite 结果或 release readiness | PH-01-b、PH-05-d |
| `raw_run_record` | 固定 run 的 case/suite/check artifact 和实际状态 | 已审查验收或 verdict | 未来 PH-02～PH-06 执行 |
| `generated_report` | 从 raw 生成 suite/run/report | signoff、风险接受或 owner truth | PH-05-d、PH-06-b |
| `runtime_evidence` | 有效 same-run raw/report/check pair 的 evidence item/index | evidence 必然 pass 或自动放行 | 仅 PH-06-b 条件性 |
| `reviewed_handoff` | 独立 review、争议、未决项和送验材料 | 06/治理已裁决；不自动生成 verdict | 仅 PH-06-b 条件性 |

状态晋级必须单向且可回指 source digest；任何新 run、source revision、config/profile、dependency、platform、VETO 或 schema 变化都使相关旧链失效并要求新 run。旧失败材料不可覆盖或修改。

### 9.2 报告生成与审查矩阵

| 报告/检查 | 输入 owner | 逻辑生成器 | 输出路径 | 必须审查的内容 | 失败处理 |
|---|---|---|---|---|---|
| suite report | suite case JSON、stdout/stderr、call/write/cleanup refs | `scripts/reports/render-suite-report.sh` | `reports/runs/<run_id>/suites/<suite>.md` | case 分母、每种 status、首失败、blocker、redaction、cleanup 与 raw 一致 | 缺 raw/report 时 `incomplete`；不得手工补 pass |
| run summary/gate results | context、全部 suite/check report | `scripts/reports/render-run-summary.sh` | `reports/runs/<run_id>/summary.md`、`gate-results.md` | target tier、profile、denominator、依赖和 cross-suite overlap | required suite blocked/not_run 不得聚合为 pass |
| redaction report | artifact、stdout/stderr、run/acceptance/review report | `scripts/checks/check-redaction.sh` + report stage | `reports/runs/<run_id>/redaction-check.md`、`checks/redaction.json` | forbidden field、scanner version/availability、safe finding category | finding 或 unavailable 为安全阻断/VETO-008/012 候选 |
| dependency boundary report | manifest/import/call graph/runtime binding | `scripts/checks/check-boundary.sh` | `reports/runs/<run_id>/dependency-boundary.md`、`checks/dependency-boundary.json` | SDK/API only、无 private/DB/bus/topic、event=0 | finding/unavailable 阻断/VETO-004/005 候选 |
| link/pairing report | case、suite、slot、TC、AC、artifact/report/check refs | `check-evidence-links.sh`、`check-report-pairing.sh` | `evidence-link-check.md`、`report-pairing.md` | 双向可达、same run、digest、唯一主归属 | orphan/mismatch/cross-run 使 slot incomplete/VETO-011 |
| evidence index/detail | 通过完整性检查的 same-run pair | `scripts/reports/render-evidence-index.sh` | `artifacts/test/<run_id>/evidence-index.json`、`reports/runs/<run_id>/evidence-index.md`、`evidence/<id>.md` | 逐 TC、slot、status、AC、blocker、item/index digest | 无 valid pair 不生成 alias；保留 incomplete slot |
| acceptance handoff | run summary、evidence index、VETO/risk/open issues | `scripts/reports/render-acceptance-handoff.sh` | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | scope/tier、未执行、blocker、VETO、风险资格和下一 gate | 只生成初稿；缺 review 不得送最终裁决 |
| independent review | acceptance package + 抽查 raw refs | reviewer/Agent（独立于 generator） | `reports/review/*` | reviewer identity/role、抽查、争议、结论与 source digest | `pending/disputed` 不得写成 clear/pass；不得改 raw |

### 9.3 证据归档和 owner 边界

| 内容 | Runner/测试侧可以拥有 | 不可推出或写入 |
|---|---|---|
| local observability | safe kind/outcome/correlation、local ref、redaction posture、RecoveryCase/handoff posture | Release approval、Sandbox/Runtime running/cleaned、formal audit/evidence、verdict |
| test raw/report | fixed-run case/suite/check status、safe refs/digest、blocked/not-run 原因 | owner truth、product readiness、签署 |
| acceptance evidence | 同 run 合格 pair 的 EV/index/detail 和审查意见 | 自动风险接受、signoff、tier 升级 |
| owner formal audit/archive | 由 owner 提供的正式 ref，带 source/visibility/freshness/retention | Runner 修改、补写或用 local copy 替代 |

Evidence instance 唯一身份为 `(run_id, evidence_id, evidence_item_digest)`；slot、alias、路径、root digest、报告表格或本 Step 的设计 `pass` 都不是 evidence instance。`handoff receipt != formal evidence`，`local report != owner audit`，`report generated != verdict`。

## 10. 失败、暂停、重试、清理与恢复规则

| 结果类别 | 识别条件 | 是否允许重试 | 是否计 gate 通过 | 必须保留/动作 |
|---|---|---:|---:|---|
| `pass` | 所有 required assertion、redaction、boundary、pairing 和 cleanup 满足 | 不需要 | 是 | case/suite/check/report refs、digest |
| `assertion_failed` | 业务、协议、状态、资源或一致性断言失败 | 仅诊断性复跑；首失败不可覆盖 | 否 | 首失败 raw、输入 refs、diff、scope、issue；修复后新 run |
| `flaky_suspected` | 相同固定输入重复结果不稳定 | 可在新 run 诊断；不得挑选绿色尝试 | 否 | 每次尝试、seed、timing、quarantine/issue；受影响 gate 阻断 |
| `timeout` | 超过已获 authority 的时间预算或进程无响应 | 新 run；无权威预算不得自定义通过 | 否 | timeout marker、最后阶段、cleanup status |
| `expected_controlled_failure` | TC 明确注入 unavailable/unsupported/unknown 且 typed outcome、zero-effect、report 完整 | 不需重试 | 仅该负向 TC | fault/slot/ref、无副作用断言；不把环境故障当 controlled |
| `dependency_unavailable` | 外部 seam、实现仓、工具、平台或 authority 不存在/未授权 | 不用 fake fallback；依赖到达后新 run | 否；suite 为 `blocked/not_run` | blocker ID、slot、未执行范围、恢复条件 |
| `harness_infra_failure` | runner、fixture、clock/id/digest、store、脚本或报告器崩溃 | 修复后新 run | 否 | infrastructure diagnosis、未执行 TC、残留清理记录 |
| `redaction_failure` | forbidden raw 出现或 scanner 失效 | 不重试掩盖；隔离材料 | 否，安全阻断 | 受控 raw location、category、scan result、VETO 候选；不回显秘密 |
| `cleanup_failure` | run namespace、journal、canary 或临时资源未清理 | 不改写业务结果；按 guard/recovery 处理 | 否；`incomplete/blocked` | cleanup journal、残留 refs、owner/人工处置；不可强删受保护 material |
| `review_disputed` | reviewer 对 source、scope、VETO 或 status 有争议 | 新 review 或新 run，不能覆盖原记录 | 否；handoff 不完整 | dispute note、source digest、责任人和下一 gate |

失败处理总规则：

1. 失败、blocked、not-run、timeout、flaky、incomplete 和 unknown 都保留原始状态，不能从分母删除。
2. 重跑必须使用新 `<run_id>`，通过 predecessor/supersedes ref 连接旧 run；不能覆盖旧 artifact、report、status 或 digest。
3. required Test/Evidence Gate 未通过时，当前 boundary 不得提交，后续 boundary 只能 `planned / wait_until_current`；设计缺口必须 `wait_design` 并回写拥有 truth 的 03/04/05/06 文件。
4. `dependency_unavailable` 不得改写为 `expected_controlled_failure`，除非测试合同明确把该缺失作为输入；不得用 semantic fake 代替真实 positive seam。
5. 清理失败不改变业务断言，但会阻断该 suite/phase 的完整性；保护轴未知时保留 material/lease/RecoveryCase，不执行 delete/release/evict。
6. redaction、dependency boundary、link/pairing、no-static 或 event-zero 检查 unavailable 时不能记 clean；进入验收后按 `VETO-RUN-004/008/011/012` 处理。

## 11. Phase 与 boundary 停审记录

### 11.1 Phase 停审

| Phase | 测试覆盖 | 验收/证据覆盖 | 失败处理 | 设计层结论 | 当前事实 |
|---|---|---|---|---|---|
| `PH-01` | contract/config/security、CUT-10/16/18 | AC-001/002/011、boundary/redaction/path checks | authority/schema/tooling blocker 停留 | 通过 | physical/authority blocked |
| `PH-02` | context/material/service/config/controlled、CUT-01/02/10/13/16 | AC-001～004、VETO-001/002/009、EV-001/002/010/016/018 planned | implicit selector、integrity bypass、positive seam 缺失停留 | 通过 | upstream blocked；未运行 |
| `PH-03` | request/control/resource/recovery/UoW/job/replay、CUT-03～07/11/12/15/18 | AC-005～009、TX-001～009、VETO-003/006/007 | Unknown/replay/cleanup guard 失败停留 | 通过 | Sandbox/Runtime/platform/store blocked |
| `PH-04` | presentation/query/entry/security/replay、CUT-08/09/10/17 | AC-006/009/010/011、redaction/no-write/handoff evidence boundary | raw leak、Query write、receipt→evidence 停留 | 通过 | Observability seam blocked |
| `PH-05` | Consumer/job/UoW/replay/security、CUT-10/14/15/17/18 | AC-003/008/009/010/011、AR-005～008、event-zero/report pairing | payload/ACK/repair/event/pairing 失败停留 | 通过 | transport/scheduler/tooling blocked |
| `PH-06` | selected controlled/E2E/security/replay、适用全部 CUT/TC | target-tier AC/AR/TX/NFA/VETO、18 slots、review/handoff | 缺 baseline、fixed run、required check、review 或 VETO clear 停留 | 通过 | baseline/ops/GRC/positive seam blocked |

### 11.2 Commit boundary 停审

| Boundary | 一句话门禁增量 | 独立 review/验证 | 证据归属 | 停审结论 |
|---|---|---|---|---|
| `commit-ph-01-a` | 固定 authority/依赖/协议边界并证明 event=0 | contract/dependency/static scan | CONTRACT + boundary check；无 EV | 通过（设计层）；目标仓/authority blocked |
| `commit-ph-01-b` | 固定 config/readiness、redaction 和 path/pairing 合同 | CONFIG/SECURITY/schema scan | CFG/OBS/BND planned；无实例 | 通过（设计层）；脚本/store authority blocked |
| `commit-ph-02-a` | 固定 context/selection/generation 状态 | CTX contract/domain tests | `ESLOT-001` planned | 通过；Artifact/Governance positive blocked |
| `commit-ph-02-b` | 固定 material acquisition/integrity/cache 轴 | MAT/IDM/UOW tests | `ESLOT-002` planned | 通过；locator/verifier/cache seam blocked |
| `commit-ph-02-c` | 固定 semantic source slots 和 safe Query | controlled/CONFIG/security/no-write | `ESLOT-001/002/010/016/018` future | 通过；exact SDK/public seam blocked |
| `commit-ph-03-a` | 固定 run/control/resource/guard local truth | CTL/RES state/guard | `ESLOT-004/006` planned | 通过；Sandbox/Runtime/platform read blocked |
| `commit-ph-03-b` | 固定 external effect/UoW/Unknown/idempotency | REQ/CTL/IDM/UOW controlled negative | `ESLOT-003/004/011/012` planned | 通过；positive effect/durable store blocked |
| `commit-ph-03-c` | 固定 RecoveryCase/manual review/no-replay | REC/REPLAY/JOB | `ESLOT-007/012` planned | 通过；owner readback blocked |
| `commit-ph-03-d` | 固定 lifecycle service、entry 和 Q06～Q08 no-write | SERVICE/ENTRY/REPLAY/write audit | `ESLOT-003～007/009/011～013` planned | 通过；entry/store authority blocked |
| `commit-ph-04-a` | 固定 bounded/redacted presentation schema | PRE/OBS contract/security | `ESLOT-008/017` planned | 通过；safe source seam blocked |
| `commit-ph-04-b` | 固定 diagnosis/handoff/visibility/unknown | SERVICE/ENTRY/SECURITY/REPLAY | `ESLOT-008/009/017` planned | 通过；Observability positive blocked |
| `commit-ph-04-c` | 固定 Q12 projection identity 与 no-write entry | ENTRY/SECURITY/projection audit | `ESLOT-009/018` planned | 通过；store/rebuild authority blocked |
| `commit-ph-05-a` | 固定 Consumer header-first/duplicate/no-ACK | CNS/CONTRACT/event-zero | `ESLOT-014/018` planned | 通过；transport schema blocked |
| `commit-ph-05-b` | 固定 Job public result/report/idempotency surface | JOB/UOW/REPLAY | `ESLOT-015` planned | 通过；runner/scheduler authority blocked |
| `commit-ph-05-c` | 固定 local-only Job claim/checkpoint/no-repair | JOB/REPLAY/claim fence | `ESLOT-015/018` planned | 通过；durable store/ops blocked |
| `commit-ph-05-d` | 固定 script/check/report/index 和 no-static checks | SECURITY/CONTRACT/REPLAY | `ESLOT-017/018` future | 通过；tool authority blocked |
| `commit-ph-06-a` | 固定 selected baseline/preflight/adapter/run slot | CONTROLLED/E2E/config/security | 适用 slots；当前无实例 | 条件性通过设计复核；baseline/environment blocked |
| `commit-ph-06-b` | 固定 same-run evidence/VETO/handoff/review | E2E/security/replay + all checks | 18 slots only with valid pair | 通过设计合同；无 raw/report/review，不生成 handoff |

停审结论中的“通过”仅表示该 boundary 的计划、映射和失败口径可 review；它不改变 `implementation_write_allowed=false`、`test_execution_allowed=false` 或任何 upstream blocker。

## 12. 跨门禁覆盖、重复、缺失与证据归属审计

### 12.1 AC/AR/TX/NFA/VETO 反查

| 分母 | 覆盖 boundary / suite | 主证据或检查入口 | 审计结论 |
|---|---|---|---|
| `AC-RUN-001` | 02-a/c、06-a/b；CTX/CON/ENT/CFG/CONTROLLED | EV-CTX-001、EV-CON-010、VETO-001 | pass（planned mapping） |
| `AC-RUN-002` | 01-b、02-a/c、06-a；CTX/CFG | EV-CTX-001、EV-CFG-016、VETO-001/009 | pass（planned mapping） |
| `AC-RUN-003` | 02-b、05-b/c、06-a；MAT/JOB | EV-MAT-002、EV-JOB-015、VETO-002 | pass（planned mapping） |
| `AC-RUN-004` | 01-b、02-b/c、06-a；MAT/CFG/BND | EV-MAT-002、EV-CFG-016、EV-BND-018、VETO-002/009 | pass（planned mapping） |
| `AC-RUN-005` | 03-a/b/d、06-a；REQ/CTL/ENT | EV-REQ-003、EV-CTL-004、EV-ENT-013、VETO-003/010 | pass（planned mapping） |
| `AC-RUN-006` | 03-a/d、04-c、06-a；OWN/QRY/CTL | EV-OWN-005、EV-QRY-009、VETO-003/005/010 | pass（planned mapping） |
| `AC-RUN-007` | 03-a/b、06-a；RES/BND | EV-RES-006、EV-BND-018、VETO-006/012 | pass（planned mapping） |
| `AC-RUN-008` | 03-a/b/c、05-c、06-a；RES/CTL/JOB | EV-CTL-004、EV-RES-006、EV-JOB-015、VETO-006 | pass（planned mapping） |
| `AC-RUN-009` | 03-b/c/d、04-b/c、05-b/c、06-b；REC/IDM/UOW/JOB/QRY | EV-REC-007、EV-IDM-011、EV-UOW-012、EV-JOB-015、VETO-007 | pass（planned mapping） |
| `AC-RUN-010` | 04-a/b/c、05-c/d、06-b；PRE/OBS/QRY/JOB | EV-PRE-008、EV-OBS-017、EV-QRY-009、VETO-008/010/011 | pass（planned mapping） |
| `AC-RUN-011` | 01-a/b、02-c、04-b、05-a/d、06-a/b；CON/CNS/BND | EV-CON-010、EV-CNS-014、EV-BND-018、VETO-004/005/011/012 | pass（planned mapping） |

`AR-RUN-001~015` 均至少在 `commit-ph-01-a/b`、02-c、03、04、05、06 的 dependency/write/redaction/state checks 中出现；`TX-RUN-001~010` 均由 03-b/c/d、05-b/c/d 或 06-b 的 UoW/idempotency/recovery/report checks 消费；`NFA-RUN-001~009` 均在 phase aggregate 和适用 boundary 中出现，`NFA-RUN-008` 仅 conditional；`VETO-RUN-001`～`VETO-RUN-012` 均有至少一个触发入口和 failure-stop 规则。实际 status 仍为 `not_evaluated`。

### 12.2 跨门禁审计表

| 审计项 | 结论 | 依据/修正 |
|---|---|---|
| 每个 phase 至少一个测试门禁 | pass（设计层） | 六个 phase 均绑定 suite、CUT、脚本、artifact/report 和失败处理 |
| 每个 phase 的外部可见/状态/一致性行为有 AC/VETO | pass（设计层） | PH-02～PH-06 逐项回指 AC/AR/TX/NFA/VETO |
| 每个 boundary 有提交前 Test Gate | pass（设计层） | 18/18 行均有 suite/CUT/TC 范围和 GATE alias |
| boundary 是否越过后续 phase | pass（设计层） | 依赖保持 PH-01→PH-06；positive seam、final evidence 和 verdict 后置 |
| 108 TC 是否被静态 range 隐藏 | pass（计划） | 18 family 分母已展开计数；未来 machine index 强制逐 TC ID |
| 12 suite 是否有重复主归属 | pass（计划） | secondary suite 允许复核，canonical slot 只有一个 producer owner |
| 18 slot 是否都有 producer、AC、path 和缺失影响 | pass（计划） | CUT/slot 表与 05/06 evidence contract 对齐 |
| artifact/report/evidence 是否 same-run | pass（设计层） | 固定 run、source digest、link/pairing/no-static check；禁止 `latest` |
| report 生成器是否与输出目录分离 | pass（计划） | 生成器位于 `scripts/reports/`，输出位于 `reports/` |
| redaction/dependency/link/pairing/cleanup unavailable 是否会被误判 clean | pass | unavailable 进入 blocked/incomplete/VETO 候选 |
| Query/Consumer/Job/event-zero 红线是否独立覆盖 | pass | GATE-05/06/07/09、AR-005~008、VETO-005 |
| failure/flaky/timeout/blocked 是否有恢复路径 | pass | 新 run、predecessor、blocker、wait_design/fix_gate_failure 规则完整 |
| 人工/Agent review 是否能改 raw 或生成 verdict | pass | review 只增注释；不改 raw/digest、VETO 或 signoff |
| 当前是否伪造执行事实 | pass | 无脚本、实现仓、run、artifact、report、EV、verdict、signoff、readiness 实例 |

### 12.3 覆盖缺口与修正责任

| 发现条件 | owner | 立即动作 | 是否允许继续 |
|---|---|---|---|
| 正式 03 schema/state/port 与 TC/AC 名称冲突 | 03 truth owner + 设计者 | 停 boundary，回写 03/受影响 05/06，更新本 Step 和台账 | 否，直到重新审查 |
| 05 planned TC/slot/suite 变更 | 测试方案 owner | 更新 05、05 calibration、Step 7 matrix 与 evidence owner | 否，旧 mapping 失效 |
| 06 AC/AR/TX/NFA/VETO 变更 | 验收标准 owner | 更新 06、Step 7 映射、phase/boundary gate 和 review 规则 | 否，旧 acceptance gate 不再有效 |
| artifact/report schema 或路径变更 | 证据/实施计划 owner | 更新 05/06/07、script contract、pairing checks | 否，禁止跨 run/旧 schema 混用 |
| 设计修复影响多个 boundary | 设计者 | 识别同项目提交归属，横向扫描同类 boundary，补标准/SOP/记忆种子（如适用） | 否，直到所有受影响 boundary 重审 |

## 13. 回填草稿（未来正式 `07-实施计划.md` §7）

正式 §7 应按以下结构回填，本 Step 的过程表和停审证据保留在 calibration：

1. **阶段门禁矩阵**：承接 §7 的六阶段表，列出主 suite、CUT/TC、AC/AR/TX/NFA/VETO、脚本、artifact/report 和失败处理。
2. **Boundary Gate Matrix 的测试列**：承接 §8 的 18 行；每行保留 Test Gate、Evidence Gate、提交前阻断条件和 handoff 记录要求。
3. **脚本与路径合同**：承接 `scripts/gates/`、`scripts/checks/`、`scripts/reports/` 及显式 `--run-id`、`--artifact-root`、`--config-profile` 参数；不写实际命令结果。
4. **证据成熟度与审查**：承接 planned slot→raw→report→runtime evidence→reviewed handoff 的单向链；固定 same-run、digest、redaction、dependency、link、pairing 和 cleanup 检查。
5. **失败和恢复**：承接 failure table；required gate 失败停止 boundary/phase，新 run 保留 predecessor，不覆盖旧证据；设计缺口回写 truth source 并 `wait_design`。
6. **事实边界**：正式 §7 必须继续声明当前无实现仓、baseline、run、artifact、report、evidence、verdict、signoff、readiness；设计层 `pass` 不等执行层 `pass`。

## 14. 待确认事项、持续 blocker 与重开触发

| blocker / 待确认 | 影响 | 当前状态 | 重开与门禁动作 |
|---|---|---|---|
| `RUN-DDD-001` 目标实现仓不存在 | 所有 suite、script、artifact、report 无法执行 | blocked/not_created | 仓到达后先重开 PH-01/01-a，确认 authority、manifest、工具链，再允许任何 Test Gate |
| `RUN-DDD-002` 语言/runtime/GUI/CLI/process/packaging 未定 | 无法绑定真实 test/build/check 命令 | blocked | Step 8/11 关闭后更新脚本和 boundary required checks；历史技术选择不继承 |
| `RUN-DDD-003` local store/cache/locking/migration/atomicity 未定 | UOW/IDM/JOB/PROJECTION/cleanup suites 不能宣称 durable | blocked | 影响 PH-01-b、02-b、03-b/d、04-c、05-b/c 的 Test/Evidence Gate 全部重审 |
| `RUN-UP-001~008` 外部 positive seam 未闭合 | controlled/E2E/release positive lane 无法运行 | blocked | 对应 owner public contract 到达后重开 02-c、03-b/c/d、04-b、06-a/b；negative lane 保留 |
| `RUN-OPS-001~002` SLO/capacity/retention 与真实 GRC 环境未定 | NFA-008、staging/release/handoff 不可裁决 | blocked | 只在 authority/baseline/fixed-run 到达后启用；不继承历史阈值 |
| `RUN-DOC-003` 正式 07/implementation ledger/boundary skeleton 尚未创建 | 无法移交实现 agent | open/blocking | Step 13 才 full-restart 创建正式 07、implementation ledger 和 18 个 planned skeleton |
| 05/06 truth source 后续变化 | 所有映射和 evidence owner 可能失效 | waiting | 先更新拥有文档和项目台账，再重审受影响 phase/boundary |

## 15. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 六个 phase 均有至少一个测试门禁和必要验收门禁 | `pass` | §7 已覆盖 suite/CUT/TC、AC/AR/TX/NFA/VETO、脚本和失败处理 |
| 18 个 boundary 均有提交前 Test/Evidence Gate | `pass` | §8 18/18 有主 suite、TC 范围、验收映射、artifact/report 和停止规则 |
| 12 suite、108 planned TC、18 slot 分母和主归属闭合 | `pass` | §5.2～§5.3；secondary 引用不重复计 evidence |
| 报告、artifact、evidence 和 review 归属清楚 | `pass` | §6、§9 固定 writer/reader、路径、成熟度和人工责任 |
| 失败、blocked、not_run、timeout、flaky、redaction、cleanup 处理清楚 | `pass` | §10 保留原状态、新 run、清理和设计回写规则 |
| phase/boundary 停审完成 | `pass` | §11 已逐 phase、逐 boundary 记录设计层结论与当前缺口 |
| 跨门禁覆盖、重复、缺失和 evidence ownership 审计无 unresolved 冲突 | `pass` | §12 反查 AC/AR/TX/NFA/VETO 并列出修正责任 |
| 当前未生成任何执行事实 | `pass` | run/artifact/report/evidence/verdict/signoff/readiness 均未创建或未评估 |
| 可进入 Step 8 | `pass_for_step_08` | 下一步只能创建并完成 `07_implementation_plan_step_08_config_environment_dependencies.md`；正式 07 和 implementation ledger 仍禁止提前创建 |

## 16. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否承接 05/06 正式分母而未新增 authority | `pass` | 18 CUT、108 TC、12 suite、6 gate、18 slot、11 AC、15 AR、10 TX、9 NFA、12 VETO 均来自正式文档 |
| 是否每个 phase/boundary 都有测试、验收和证据责任 | `pass` | 六阶段矩阵、18 boundary 矩阵、停审表和 cross-gate audit 完整 |
| 是否区分 planned、executed、pass、blocked、not_run、incomplete | `pass` | 全文明确 maturity/status 与失败分类；当前 actual 未创建/未评估 |
| 是否固定显式 run/profile/path 和 no-latest | `pass` | 所有未来命令合同包含三项核心参数，路径无 project 子层 |
| 是否保留 Query/Consumer/Job/event-zero truth boundary | `pass` | GATE-05/06/07/09、AR/VETO、boundary scope 逐项绑定 |
| 是否把 acceptance handoff 当 verdict | `pass` | handoff、review、VETO、risk、signoff 均分离，未生成任何结论实例 |
| 是否绕过 implementation ledger / formal 07 时序 | `pass` | 本 Step 只创建 calibration；正式 07、implementation ledger、planned skeleton 保持 Step 13 限制 |

## 17. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 7
current_module = test_acceptance_gates
gate_status = completed / pass / self_reviewed
gate_reason = 六个 phase、18 个 commit boundary 均已绑定测试、验收、证据、报告、脚本和失败处理；跨门禁覆盖/重复/缺失及 owner 归属审计通过。实际实现和验收仍保持 blocked/not_run/not_created。
next_allowed_action = create_and_complete_07_step_08_config_environment_dependencies
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
