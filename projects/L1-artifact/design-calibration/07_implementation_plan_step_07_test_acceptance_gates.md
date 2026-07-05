# Step 7. 嵌入测试与验收门禁

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填章节: `07-实施计划.md` §7 测试与验收门禁嵌入
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 嵌入测试与验收门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 phase 顺序;Step 6 commit boundary;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 PH-01~PH-08 | 已完成;用户已确认 | 将阶段目标与测试 / 验收 / 证据门禁绑定 |
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 将每个 boundary 的提交前 tests、artifact/report、AC/VETO 风险绑定 |
| `05-测试方案.md` §9 自动化与 CI/CD 门禁 | 已存在 | 提供 P0 suites、脚本入口、artifact/report 路径和执行层级 |
| `05-测试方案.md` §10 非功能 / 恢复 / redaction / replay | 已存在 | 提供 config、dependency、redaction、report audit、replay 类门禁 |
| `05-测试方案.md` §13 证据与报告 | 已存在 | 提供 `EV-CAND-ART-*`、candidate evidence、artifact/report pairing 和 acceptance draft 规则 |
| `06-验收标准.md` §5~§14 | 已存在 | 提供 `AC-ART-001~058`、`VETO-ART-001~009`、risk acceptance 和 final decision 门禁 |
| Step 3 前置路径规则 | 已完成 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、禁止 `latest` |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 phase 应执行哪些测试切口? | PH-01 跑 workspace/config/script/dependency 基础门禁。PH-02~PH-04 以 `contract-domain-fast` 和 `service-flow-fast` 的 command/state slice 为主。PH-05 跑 query no-write、visibility、projection 和 API query tests。PH-06 跑 consumer、outbox、relay publish 和 topic map。PH-07 跑 public jobs、rebuild/refresh/reconcile、handoff/export。PH-08 跑 `release-main-smoke`、`report-generation-audit`、`redaction-boundary`、`dependency-boundary` 和 acceptance draft generators。 |
| 每个 phase 是否都需要绑定正式验收项? | 需要。Step 7 不把 AC/VETO 留到最终总验收,而是把相关风险提前挂到 phase 和 boundary。 |
| 证据是否可以在前期就生成正式 `EV-ART-*`? | 不可以。当前 authoritative evidence family 仍是 `EV-CAND-ART-*`;Step 7 只能约束 candidate evidence、artifact/report 路径和 acceptance handoff draft,不得发明真实 `EV-ART-*` alias。 |
| 哪些门禁必须自动化? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke` 必须自动化。 |
| 哪些门禁必须有人或 agent 审查? | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、release summary 必须由人或 agent 审查,不能只靠脚本产出即视为通过。 |
| 门禁失败后是否允许进入下一 phase? | 不允许。任何 P0 blocking gate 失败都不得进入下一 phase、不得提交当前 boundary、不得以 residual 或 unavailable 伪装通过。 |
| `p1-real-like-selected-run` 如何处理? | 它不计入 P0 pass。若 unavailable,只能记入 residual / unavailable,不得污染 `AC-ART-*`、`VETO-ART-*` 或 final handoff 结论。 |
| `PublishPendingArtifactRelays` 在门禁中如何计数? | 它继续保持 worker-only relay publication facade,只进入 PH-06 relay / publisher 相关门禁,不计入 6 public jobs。 |
| release 证据的最小真实性规则是什么? | `release-main-smoke` 必须是五个核心能力的业务闭环,不是通用测试计数。`evidence-index.md`、`veto-checklist.md` 和 `report-audit.md` 必须从 raw artifact/report 推导,不能静态伪造。 |
| 早期 phase 是否也要生成 reports? | 可以生成 targeted run reports,但 PH-08 才能生成正式 acceptance drafts 和 final evidence pack。 |
| 每个 boundary 提交前是否都要有 artifact/report 归属? | 要。即使只是 skeleton/config/dependency boundary,也必须说明是否产生 targeted artifact/report 或明确 N/A 理由。 |
| Step 7 是否要承接 Step 6 的 boundary gate matrix? | 要。Step 7 不是重新拆 boundary,而是在 Step 6 已固定的 `allowed_scope` / `required_checks` 基础上补齐 suite、AC/VETO、artifact/report、失败处理和审查责任。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | 已有 boundary gate,但仍偏向“跑哪些 checks” | 实施时可能只跑测试,不归档证据,也不看 AC/VETO | 增加 phase / boundary 级测试-验收-证据矩阵 |
| `05-测试方案.md` | suite 定义是全局的 | 需要压到 `commit-01-a`~`commit-08-b` 的提交前门禁 | 增加 boundary 级 required suite / report 输出 |
| `06-验收标准.md` | `AC-ART-*` / `VETO-ART-*` 数量多,且有 evidence integrity 红线 | 若只在 PH-08 才对齐,返工成本高 | 将 AC/VETO 风险前移到 phase / boundary |
| candidate evidence | `EV-CAND-ART-*` 与 report path 已固定 | 若 Step 7 不承接,PH-08 容易出现静态造证据 | 明确 candidate evidence family 与 acceptance draft 的衔接 |
| acceptance reports | 已有路径,但还没有阶段化责任 | 实现侧可能过早写 handoff / veto passed | 规定只有 PH-08 产出 `reports/acceptance/*` 且必须审查 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| phase 门禁 | 只知道 phase 对应大概 suite | phase 绑定 suites、AC/VETO、artifact/report、失败处理 | 防止最后补测 |
| boundary 门禁 | 只有 Step 6 的 `required_checks` | 加入 artifact/report 归属、AC/VETO 关联、失败后阻断规则 | 让提交前门禁可执行 |
| evidence discipline | 来自 `05/06`,但未进入实施计划主链 | 明确 `EV-CAND-ART-*`、`reports/runs/<run_id>`、`reports/acceptance/*` 的阶段责任 | 保持证据真实性 |
| acceptance 审查 | 可能被误当脚本自动通过 | 固定为脚本生成初稿 + 人/agent 审查 | 防止静态 `passed` |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有 EV 都在每个 boundary 固化 | 可追溯最细 | 过早冻结正式结论,且运行基线会频繁变化 | 不采用 |
| 前期只生成 suite artifact/report,PH-08 汇总 acceptance material | 保持证据真实,不提前宣告通过 | PH-08 收口工作量更大 | 采用 |
| release 用全量 `cargo test` 代替业务 smoke | 简单 | 不能证明五个核心能力最小闭环 | 不采用 |
| query / consumer / job 只看测试通过,不单独看 VETO 风险 | 文档更短 | 会把 no-write / no-truth-repair 这类硬红线藏起来 | 不采用 |

## 7. 结构化中间产物

### 7.1 门禁输出与证据规则

| 输出类型 | 路径 | 生成阶段 | 要求 |
|---|---|---|---|
| raw suite artifact | `artifacts/test/<run_id>/suites/<suite>/` | 所有执行 suites 的 phase | 必须包含 status、case refs、profile、failure reason、digest |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | PH-02~PH-08 | 必须从 raw artifact 生成,不能手写补洞 |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | PH-01 targeted,PH-08 full | 必须证明 only `L0-core/core-contracts` compile-time upstream |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | PH-04 targeted,PH-08 full | artifact 与 report 都必须被扫描 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | PH-08 必须 | blocking / non-blocking 分类清楚,不能改写失败为通过 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | PH-08 必须 | 只能从 `EV-CAND-ART-*` 对应 artifact/report 推导 |
| report audit | `reports/runs/<run_id>/report-audit.md` | PH-08 必须 | pairing、no-static-evidence、no orphan EV 全部通过 |
| acceptance handoff | `reports/acceptance/handoff.md` | PH-08 | 只能是送验交接稿,不是默认 `passed` 结论 |
| veto checklist | `reports/acceptance/veto-checklist.md` | PH-08 | 每个 `VETO-ART-*` 都必须回指真实 evidence/report/defect |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | PH-08 | 不得接受 `VETO-ART-*` 或 S 级缺陷 |
| open issues | `reports/acceptance/open-issues.md` | PH-08 | 必须列出失败项、未覆盖项、residual 和复验状态 |

规则:

- authoritative candidate evidence family 仍是 `EV-CAND-ART-*`。
- `reports/acceptance/*` 与 `reports/review/*` 只能引用 `EV-CAND-ART-*`,不得私造 `EV-ART-*`。
- 禁止正式使用 `latest` 作为 artifact root、report root 或 evidence source。
- PH-08 之前允许生成 targeted run reports,但不得生成 final pass / signoff / VETO 全通过结论。

### 7.2 门禁失败处理表

| 失败类型 | 是否允许继续 | 处理 |
|---|---|---|
| formatting / compile failure | 否 | 修复后重跑当前 boundary 全部门禁 |
| `contract-domain-fast` / `service-flow-fast` blocking failure | 否 | 不得提交;若根因是设计缺口,回写设计真相源 |
| `config-redline` failure | 否 | 修正 config/profile/runtime builder;不得静默 fallback |
| `dependency-boundary` failure | 否 | 移除 non-core compile dependency;不得风险接受 |
| `redaction-boundary` failure | 否 | 视为高风险红线;修复后重跑所有相关 suites 与 redaction report |
| `report-generation-audit` failure | 否 | 修正 artifact/report pairing 或 no-static-evidence 缺陷 |
| `release-main-smoke` failure | 否 | 修复业务主链;不得用普通测试计数替代 |
| `p1-real-like-selected-run` unavailable | 是,但不计 P0 pass | 记录 residual / unavailable,不得写入 P0 通过结论 |
| acceptance draft 未审查 | 否 | PH-08 不能结束,必须补审查记录 |

### 7.3 P0 suites 与脚本表

| suite / script | 覆盖范围 | 执行层级 | artifact 输出 | report 输出 | 阻断级别 |
|---|---|---|---|---|---|
| `contract-domain-fast` | DTO / typed ref / metadata / state matrix / invariant / reject surface | PR / main | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | P0 blocking |
| `service-flow-fast` | 16 Command、13 Query、6 Consumer 的 service orchestration、duplicate、conflict、no-write | PR / main | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | P0 blocking |
| `config-redline` | strict JSON、source priority、profile isolation、topic completeness、replay root、forbidden override | PR / main / release | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | P0 blocking |
| `dependency-boundary` | non-core sibling compile dependency 检查 | PR / main / release | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | P0 blocking |
| `infra-runtime-fake` | repository / UoW / runtime builder / fake resolver/publisher/handoff / idempotency | main | `artifacts/test/<run_id>/suites/infra-runtime-fake/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` | P0 blocking |
| `entry-worker-job` | API handler、worker consumer disposition、relay loop、public job runner entry | main | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | P0 blocking |
| `operations-replay-core` | outbox payload snapshots、relay publication、public jobs、stored report replay、no-truth-repair | main / release | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | P0 blocking |
| `redaction-boundary` | logs / metrics / audit / trace / report / outbox / handoff forbidden body scan | main / release | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | P0 blocking |
| `report-generation-audit` | raw artifact/report pairing、candidate evidence derivation、no-static-evidence | nightly / release | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | P0 blocking |
| `release-main-smoke` | 五个核心能力最小业务闭环 | release | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | P0 blocking |
| `p1-real-like-selected-run` | future durable-like / real-like seam selected run | selected P1 | `artifacts/test/<run_id>/suites/p1-real-like-selected-run/` | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md` | non-P0 |

### 7.4 阶段门禁矩阵

| Phase | 测试门禁 | 验收 / VETO 关联 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | `cargo check`;config parse smoke;scripts dry-run;`dependency-boundary` targeted | `AC-ART-025`;`AC-ART-045`;`AC-ART-046`;`VETO-ART-007`;`VETO-ART-009` | `scripts/checks/check_dependency_boundary.sh`;config smoke shell | dependency/config targeted artifact | dependency/config targeted report | 不得进入 PH-02 |
| PH-02 | `contract-domain-fast` fact slice;`service-flow-fast` fact slice | `AC-ART-001~004`;`AC-ART-021`;`AC-ART-026`;`AC-ART-033~035`;`VETO-ART-001`;`VETO-ART-005` | `scripts/gates/run_ci_gate.sh --gate pr --suite contract-domain-fast`;`--suite service-flow-fast` | fact contract/domain/service artifacts | targeted suite reports | 不得提交 PH-02 boundary;设计缺口则回写 |
| PH-03 | `contract-domain-fast` version/lineage slice;`service-flow-fast` version/lineage slice;`infra-runtime-fake` targeted | `AC-ART-005~012`;`AC-ART-023`;`AC-ART-038~040`;`VETO-ART-003`;`VETO-ART-005` | `run_ci_gate.sh --gate pr` targeted + `run_ci_gate.sh --gate main --suite infra-runtime-fake` targeted | version/lineage/runtime artifacts | targeted suite reports | 不得进入 PH-04 |
| PH-04 | `contract-domain-fast` baseline slice;`service-flow-fast` baseline slice;`redaction-boundary` targeted | `AC-ART-013~016`;`AC-ART-022`;`AC-ART-023`;`AC-ART-044`;`VETO-ART-002`;`VETO-ART-003`;`VETO-ART-006` | `run_ci_gate.sh --gate pr` targeted;`scripts/checks/check_redaction.sh` | baseline/redaction artifacts | baseline suite report + redaction report | redaction 或 freeze truth 边界失败即阻断 |
| PH-05 | query no-write、visibility/freshness/degraded、projection tests、API query tests | `AC-ART-017`;`AC-ART-019`;`AC-ART-024`;`AC-ART-027`;`AC-ART-037`;`VETO-ART-004` | `run_ci_gate.sh --gate pr --suite service-flow-fast` targeted + query targeted tests | query/projection artifacts | query suite reports | query write side effect 或 visibility surface 缺口即阻断 |
| PH-06 | consumer tests;outbound contract tests;relay publish/topic map;redaction targeted | `AC-ART-010`;`AC-ART-018`;`AC-ART-024`;`AC-ART-028`;`AC-ART-029`;`AC-ART-031`;`AC-ART-041`;`VETO-ART-002`;`VETO-ART-004` | `run_ci_gate.sh --gate main --suite entry-worker-job`;`run_ci_gate.sh --gate main --suite operations-replay-core`;`check_redaction.sh` targeted | consumer/outbox/relay artifacts | worker/outbox/redaction reports | unsupported parse/write、payload from current truth、relay counted as public job 都阻断 |
| PH-07 | job contract tests;`operations-replay-core`;`entry-worker-job`;handoff/export/redaction targeted | `AC-ART-016`;`AC-ART-020`;`AC-ART-024`;`AC-ART-030`;`AC-ART-032`;`AC-ART-036`;`AC-ART-040`;`AC-ART-043`;`AC-ART-047~048`;`VETO-ART-004` | `run_ci_gate.sh --gate main --suite operations-replay-core`;`run_ci_gate.sh --gate main --suite entry-worker-job`;handoff/export targeted | jobs/handoff/export artifacts | job and operations reports | duplicate replay、partial failure 无 report、truth repair 均阻断 |
| PH-08 | `release-main-smoke`;`config-redline`;`dependency-boundary`;`redaction-boundary`;`operations-replay-core`;`report-generation-audit` | `AC-ART-042~049`;`AC-ART-050~058`;`VETO-ART-001~009` | `scripts/gates/run_release_gate.sh --run-id <run_id>` + report/check scripts | full release artifacts | `reports/runs/<run_id>` 与 `reports/acceptance/*` | 任一 blocking gate / VETO / report audit 失败不得 `pass` |

### 7.5 Commit boundary 门禁矩阵

| Commit boundary | 提交前测试门禁 | 验收 / VETO 关联 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|
| `commit-01-a` | `cargo fmt --check`;`cargo check`;`dependency-boundary`;`git diff --check` | `AC-ART-025`;`AC-ART-046`;`VETO-ART-007` | dependency targeted artifact | dependency report | 不提交;修正 workspace/dependency |
| `commit-01-b` | config parse smoke;scripts dry-run;`cargo check`;`git diff --check` | `AC-ART-045`;`VETO-ART-009` | config/shell dry-run artifact | config targeted report | 不提交;修正 config/scripts |
| `commit-02-a` | `contract-domain-fast` fact contracts/domain slice | `AC-ART-001~004`;`AC-ART-021`;`AC-ART-033` | fact contract/domain artifacts | suite report | 不提交;修 DTO/state 闭环 |
| `commit-02-b` | `service-flow-fast` fact slice;`infra-runtime-fake` fact slice | `AC-ART-021`;`AC-ART-026`;`AC-ART-035`;`AC-ART-038`;`VETO-ART-005` | fact service/runtime artifacts | service/runtime reports | 不提交;修 accepted flow / idempotency |
| `commit-03-a` | `contract-domain-fast` version slice | `AC-ART-005~008`;`AC-ART-023`;`AC-ART-033~034`;`VETO-ART-003` | version artifacts | suite report | 不提交;修 version/state/history |
| `commit-03-b` | `contract-domain-fast` lineage slice | `AC-ART-009~012`;`AC-ART-023`;`AC-ART-033`;`VETO-ART-003` | lineage artifacts | suite report | 不提交;修 lineage/relation surface |
| `commit-03-c` | `service-flow-fast` version/lineage slice;`infra-runtime-fake` targeted | `AC-ART-023`;`AC-ART-038~040`;`VETO-ART-003`;`VETO-ART-005` | version/lineage service artifacts | suite reports | 不提交;修 replay/conflict/rollback |
| `commit-04-a` | `contract-domain-fast` baseline slice | `AC-ART-013~016`;`AC-ART-023`;`AC-ART-033~034`;`VETO-ART-003` | baseline artifacts | suite report | 不提交;修 baseline truth |
| `commit-04-b` | `service-flow-fast` baseline slice;`redaction-boundary` targeted | `AC-ART-016`;`AC-ART-022`;`AC-ART-035`;`AC-ART-044`;`VETO-ART-002`;`VETO-ART-006` | baseline service + redaction artifacts | suite/redaction reports | redaction 或 audit 失败不得提交 |
| `commit-05-a` | query/view contract tests;projection identity tests | `AC-ART-017`;`AC-ART-024`;`AC-ART-027`;`AC-ART-033` | query/view artifacts | query contract report | 不提交;修 query/view public surface |
| `commit-05-b` | query no-write;visibility/freshness/degraded;projection tests | `AC-ART-019`;`AC-ART-024`;`AC-ART-027`;`AC-ART-037`;`VETO-ART-004` | query service artifacts | query suite report | query side effect / visibility 泄露即阻断 |
| `commit-05-c` | API query tests;query regression | `AC-ART-020`;`AC-ART-024`;`AC-ART-037` | API query artifacts | API query report | 不提交;修 entry 映射或 backref/report read |
| `commit-06-a` | inbound event contract tests | `AC-ART-028`;`AC-ART-031` | inbound artifacts | inbound report | 不提交;修 schema/variant |
| `commit-06-b` | consumer tests;snapshot/stale targeted;redaction targeted | `AC-ART-010`;`AC-ART-018`;`AC-ART-028`;`AC-ART-036`;`VETO-ART-002`;`VETO-ART-004` | consumer/stale artifacts | consumer/redaction reports | unsupported parse/write 或 stale gap 阻断 |
| `commit-06-c` | outbound contract tests;relay publish/topic map;service regression | `AC-ART-029`;`AC-ART-031`;`AC-ART-041`;`VETO-ART-004`;`VETO-ART-005` | outbound/relay artifacts | outbox/relay reports | payload source、topic binding、truth unchanged 任一缺口阻断 |
| `commit-07-a` | public job contract tests;duplicate replay contract | `AC-ART-030`;`AC-ART-036`;`AC-ART-047` | job contract artifacts | job contract report | stored report surface 缺口阻断 |
| `commit-07-b` | `operations-replay-core` jobs slice | `AC-ART-016`;`AC-ART-024`;`AC-ART-030`;`AC-ART-036`;`AC-ART-038`;`AC-ART-043`;`VETO-ART-004` | operations artifacts | operations report | rebuild/refresh/reconcile truth source 或 no-truth-repair 缺口阻断 |
| `commit-07-c` | handoff/export tests;`entry-worker-job`;redaction targeted | `AC-ART-020`;`AC-ART-030`;`AC-ART-032`;`AC-ART-040`;`AC-ART-048`;`VETO-ART-002`;`VETO-ART-004`;`VETO-ART-006` | handoff/export artifacts | handoff/export reports | failed refs / redaction / target state 缺口阻断 |
| `commit-08-a` | release gate dry-run;dependency/redaction/report shell dry-run;no-static-evidence guard | `AC-ART-049`;`AC-ART-055`;`VETO-ART-008`;`VETO-ART-009` | release dry-run artifacts | report audit skeleton | 不提交;修脚本或 evidence source |
| `commit-08-b` | `release-main-smoke`;`config-redline`;`dependency-boundary`;`redaction-boundary`;`report-generation-audit`;acceptance draft audit | `AC-ART-042~058`;`VETO-ART-001~009` | full release artifacts | `reports/runs/<run_id>` + `reports/acceptance/*` | 任一 blocking / VETO 失败不得送验 |

### 7.6 Candidate evidence family 与 acceptance 衔接

| 证据族 | 当前定位 | 阶段使用方式 | PH-08 使用方式 |
|---|---|---|---|
| `EV-CAND-ART-CORE-*` | authoritative candidate evidence | 追踪五个核心能力最小闭环 | 支撑 `release-main-smoke`、`AC-ART-042`、`VETO-ART-001` |
| `EV-CAND-ART-CONTRACT-*`;`EV-CAND-ART-STATE-*` | authoritative candidate evidence | 追踪 contracts/domain/state | 支撑 `AC-ART-021`;`AC-ART-023`;`AC-ART-033~034`;`VETO-ART-003` |
| `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` | authoritative candidate evidence | 追踪 public command/query/consumer 主链 | 支撑 `AC-ART-026~028`;`AC-ART-037`;`VETO-ART-004` |
| `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` | authoritative candidate evidence | 追踪 event/replay/relay/job/handoff | 支撑 `AC-ART-029~032`;`AC-ART-041`;`AC-ART-047~048` |
| `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-ARCH-*`;`EV-CAND-ART-REPORT-*` | authoritative candidate evidence | 追踪一致性、配置、安全、依赖与证据真实性 | 支撑 `AC-ART-043~046`;`AC-ART-049~055`;`VETO-ART-005~009` |

规则:

- PH-02~PH-07 只负责生成能被 `EV-CAND-ART-*` 回指的 raw artifacts 与 suite reports。
- PH-08 负责把 `EV-CAND-ART-* -> artifact_path -> report_path -> run_id` 固定进 `evidence-index.md`。
- acceptance drafts 只能引用 `EV-CAND-ART-*` 和真实 report path。

### 7.7 Acceptance reports 生成与审查规则

| 报告 | 生成方式 | 必须审查内容 | 不允许 |
|---|---|---|---|
| `reports/acceptance/handoff.md` | `generate_acceptance_handoff.sh` 初稿 + 人/agent 审查 | baseline、run_id、scope、P0/P1/P2、failed/unavailable/open issues | 缺 run refs 或直接宣告最终 `pass` |
| `reports/acceptance/veto-checklist.md` | `generate_veto_checklist.sh` + 审查 | `VETO-ART-001~009` 每项来源、证据、结论 | 默认全 passed、缺证据 passed |
| `reports/acceptance/risk-acceptance.md` | `generate_risk_acceptance.sh` + 审查 | residual 影响、接受理由、接受人、截止条件 | 接受 `VETO-ART-*` 或 S 级缺陷 |
| `reports/acceptance/open-issues.md` | `generate_open_issues.sh` + 审查 | failed suites、未覆盖项、缺陷级别、复验状态 | 隐藏 blocking failures |
| `reports/runs/<run_id>/evidence-index.md` | `build_evidence_candidates.sh` + report audit | EV、TC、suite、artifact、report、digest、status | 手写 coverage 表 |

### 7.8 门禁停审记录

| Phase / boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | foundation boundary 是否已有 dependency/config/script/path 级门禁 | 设计层通过 | 目标实现仓不存在仍是开工 blocker |
| PH-02 | fact accepted flow 是否绑定 truth / tx / idempotency 红线 | 设计层通过 | 开工前复核 expected_version 与 stored result surface |
| PH-03 | version / lineage 是否绑定 replay / history / illegal transition 门禁 | 设计层通过 | 开工前复核 replay / rollback coverage |
| PH-04 | baseline 是否绑定 body-free / redaction / formal-member-only redline | 设计层通过 | redaction targeted 不得缺席 |
| PH-05 | query no-write / visibility / degraded 是否成为 blocking gate | 设计层通过 | 开工前复核 visibility source 与 stale source |
| PH-06 | consumer/outbox/relay 是否绑定 snapshot / truth unchanged / topic map | 设计层通过 | relay 仍不得计入 public jobs |
| PH-07 | public jobs 是否绑定 no-truth-repair / duplicate replay / partial failure | 设计层通过 | handoff/export 必须有 report 和 redaction |
| PH-08 | final evidence 是否从真实 artifact/report 推导 | 设计层通过 | 严禁静态 evidence / default passed |
| `commit-01-a`~`commit-08-b` | 每个 boundary 是否都有提交前 tests + artifact/report 归属 | 设计层通过 | 见 §7.5 |
| acceptance drafts | 是否固定了人/agent 审查责任 | 设计层通过 | PH-08 执行时必须回写审查结果 |

### 7.9 跨门禁覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 phase 至少有一个 blocking gate | 通过 | PH-01~PH-08 均有 |
| 每个 boundary 都有提交前门禁 | 通过 | `commit-01-a`~`commit-08-b` 均有 |
| 五个核心能力是否被门禁覆盖 | 通过 | `release-main-smoke` 与各阶段 suites 共同覆盖 |
| query / consumer / job / replay 的 no-write / no-truth-repair 是否已前置 | 通过 | `AC-ART-024`;`AC-ART-036`;`AC-ART-037`;`VETO-ART-004` 已前置 |
| evidence integrity 是否只在 PH-08 才第一次出现 | 否 | PH-01 已有 dependency,PH-04 有 redaction,PH-08 做 final report audit 汇总 |
| 是否存在 raw artifact 无人读 report 的情况 | 已阻断 | `report-generation-audit` 和 acceptance 审查共同兜底 |
| 是否存在 acceptance report 在 PH-08 前生成正式结论 | 已阻断 | PH-08 前只允许 targeted run reports |
| 是否存在 `p1-real-like-selected-run` 污染 P0 pass | 已阻断 | unavailable 只记录 residual / unavailable |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“门禁输出与证据规则”“阶段门禁矩阵”“Commit boundary 门禁矩阵”“Candidate evidence family 与 acceptance 衔接”“Acceptance reports 生成与审查规则”和“跨门禁覆盖审计表”小节,了解本章门禁如何收敛。

正式 `07-实施计划.md` §7 应回填:

L1-artifact 的测试与验收门禁必须按 phase 和 commit boundary 前置嵌入。PH-01 先锁定 workspace/config/dependency 基础门禁;PH-02~PH-04 逐步验证 fact、version/lineage、baseline truth 与 accepted write path;PH-05 锁定 13 Query 的 no-write、visibility、degraded 和 projection read surface;PH-06 锁定 6 Consumer、8 Outbound Event 和 worker-only relay publication;PH-07 锁定 6 public jobs、reconciliation、handoff/export 的 no-truth-repair 与 partial failure;PH-08 再从真实 release run artifact/report 生成 final evidence、veto checklist、risk acceptance 和 acceptance handoff。

当前 authoritative evidence family 仍是 `EV-CAND-ART-*`。实施过程中只能生成 raw artifacts 与 suite reports,不得提前发明真实 `EV-ART-*` alias,也不得在 `reports/acceptance/*` 中静态写入默认 `passed`。`release-main-smoke` 必须证明五个核心能力的业务闭环,`report-generation-audit` 必须证明 artifact/report pairing 与 no-static-evidence,`dependency-boundary` 必须证明 only `L0-core/core-contracts` compile upstream,`redaction-boundary` 必须证明 artifact 和 report 都未泄露 raw body / secret / full sensitive ref。

任何 P0 blocking gate 失败都不得进入下一 phase、不得提交当前 boundary、不得用 residual 或 unavailable 伪装通过。PH-08 生成的 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 只能作为审查稿,必须附真实 run_id、artifact/report 路径和 evidence 引用,并经人或 agent 审查后才能进入正式送验。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| release `run_id` 命名规则 | 影响 PH-08 报告路径 | 本 Step 继续使用 `<run_id>` 占位,Step 12 收口 |
| acceptance draft 的审查记录落点 | 影响 PH-08 完整交接 | Step 11 / Step 12 再固定审查记录格式 |
| nightly `operations-replay-extended` 是否进入正式 `07` 正文 | 影响正文篇幅,不影响 P0 门禁 | 当前保留为辅助 gate,不作为 P0 pass 前提 |
| targeted run 是否都要生成人读 report | 影响实施效率 | 当前要求 P0 blocking targeted run 都要生成 suite report |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| phase 门禁矩阵完整 | 通过 | PH-01~PH-08 已覆盖 |
| boundary 门禁矩阵完整 | 通过 | `commit-01-a`~`commit-08-b` 已覆盖 |
| candidate evidence / acceptance 衔接明确 | 通过 | `EV-CAND-ART-*` 与 `reports/acceptance/*` 责任已固定 |
| acceptance 审查责任明确 | 通过 | 仅 PH-08 生成并审查 |
| 门禁失败处理明确 | 通过 | blocking failures 不得继续 |
| 可进入 Step 8 | 待用户确认 | 下一步定义配置、环境与外部依赖准备 |
