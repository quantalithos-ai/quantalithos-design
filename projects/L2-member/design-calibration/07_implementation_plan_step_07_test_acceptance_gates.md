# Step 7. 嵌入测试与验收门禁

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7。
>
> 回填章节：未来 `07-实施计划.md` §7 测试与验收门禁嵌入。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`。仅使用阶段 / boundary 门禁、证据归属与停审结构；不继承 Governance 的 suite、AC、VETO、event、report 或结论。
>
> 事实边界：本文件定义 future test / acceptance contract。没有目标实现仓、fixed baseline、run_id、artifact、report、EV、defect、verdict、signoff 或 readiness；下述路径均为运行期变量或 planned generator output。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7：嵌入测试与验收门禁 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | Step 5 PH-01～08；Step 6 `commit-01-a`～`commit-08-b`；正式 `05`、`06` |
| 本步输出 | phase / boundary gate matrix、证据与报告规则、失败处理、审查责任、停审与跨门禁审计 |
| 当前执行事实 | `not_run`；不创建 script、artifact、report 或 evidence instance |
| 不可越过项 | 不将 fake、blocked、planned 或 dry-run 写为 P0 pass / EV / verdict；Step 13 前不创建 implementation ledger / boundary skeleton |

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| 07 Step 5 | 将 PH-01～08 的可验证增量绑定测试与验收关系 | 不改变 phase 顺序 |
| 07 Step 6 | 将 18 个 planned boundary 绑定提交前 test、artifact/report、AC / VF | 不改变 task、batch 或 boundary inventory |
| `05-测试方案.md` §3～§14 | 使用 suite、TC、EV candidate、环境、脚本与 artifact/report contract | 不执行或生成其中任何实例 |
| `06-验收标准.md` §4～§14 | 使用 AC、VF/VETO、缺陷、风险接受、evidence / handoff规则 | 不预先裁决验收 |
| `03-详细设计.md` §15 | 回指 module / protocol / state / consistency test cut | 不重写 case 或状态 / flow |
| `04-配置设计.md` §9～12 | 绑定 config redline、profile / slot failure与安全输出 | 不实装 config / secret / adapter |

## 3. SOP 问题回答

1. **每个 phase 的测试切口如何安排？**

   PH-01 验证 composition、config、dependency 与 generator capability；PH-02～04 逐步验证 CP01～03 的 contracts、state、UoW、replay 和 logical entry；PH-05 验证 CP04 / CP05 的 safe material、append-only trace与 redaction；PH-06 验证 CP06 / CP07 mirror、projection、Query no-write；PH-07 验证 14 Consumer、5 Job、receipt / report、partial isolation；PH-08 验证 release gate、local smoke、redaction、dependency、report generation 和 VETO handoff path。

2. **哪些验收项必须前置？**

   每一 phase 至少绑定 P0 test gate；任何状态变更、UoW、跨仓 seam、redaction、dependency、report path 均回指对应 `AC-L2M-*` 和 `VF-L2M-*`。`VF-L2M-001~009` 都是不可风险接受的提前红线，尤其禁止 wrong subject、foreign truth、raw body / secret、external success local化、generic adapter、non-Core compile、fake / blocked evidence和不可回链事实。

3. **什么是可接受的 future evidence？**

   每个实际 suite 必须将 raw output 写到 `artifacts/test/<run_id>/suites/<suite>/`，再由 generator 形成 `reports/runs/<run_id>/...`；正式 EV 必须同时回链 TC、suite、artifact、report、digest、disposition、AC/VF。`<run_id>` 不是当前 run，`EV-CAND-*` 不是 EV instance；blocked / not_run 只能作为 residual / blocker 记录。

4. **门禁失败后能否继续？**

   format、build、targeted test、redaction、dependency、replay、report-pairing、static-evidence 和任何 P0 blocking gate 失败均不得提交或进入下一 phase。P1 owner selected-run unavailable 可以记录为 unavailable / residual，但不能计作 P0 pass，且不能替代受影响 P0 local / negative test。

5. **哪些内容自动化，哪些需要人或 Agent 审查？**

   suite、redaction、dependency、artifact-report pairing 和 static evidence guard 应自动化。suite report 可由 scripts 生成；`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 只能生成初稿，须由获授权的人或 Agent 审查，脚本不能写 verdict、signoff 或 readiness。

6. **如何处理 external / DDD blocker？**

   当 `L2M-UP-*` 或 `L2M-DDD-*` 阻断正向 lane 时，运行结果必须是 `blocked` / `not_run` / `unknown` 的真实 disposition，且原因可回链；不得用 deterministic fake 或 static map 声称 owner positive success。24 个 candidate 只产生 non-materialization dependency check，绝不产生 Event / publisher / outbox evidence。

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 6 只有 future gate 名称，尚未关联 AC / VF / output | 实施者可能只跑局部测试而无证据归属 | 建立 phase 与 18 boundary 的完整门禁矩阵 |
| `05` 的 suite 是项目级定义 | 无法直接判断每一 boundary 何时跑什么 | 按 CP / boundary 切片绑定 targeted suite |
| `06` 的 VETO / evidence 条件严格 | 最后阶段才发现 provenance 缺失会造成返工 | 将 redaction、dependency、report-pairing 和 no-static-evidence前置 |
| 目标仓 / baseline / run 不存在 | 容易将 test plan 误写为结果 | 全部使用 `planned` / `not_run` 语义，不填写结果 |
| owner positive seam 尚未闭合 | fake 可能被误算 integration | P1 selected-run 独立，不纳入 P0 pass |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| phase gate | 仅有 capability / gate 名 | 每 phase 有 suite、AC/VF、path、失败处理 | 防止最后补测 |
| boundary gate | 仅有 commit 前检查 | 每 boundary 有 targeted tests、evidence category、AC/VF 关联 | 防止无证据提交 |
| report | 仅有目录和 schema | 明确 raw → report → EV / handoff 的成熟度 | 防止静态证据 |
| acceptance draft | 容易误作裁决 | 明确脚本初稿与人 / Agent 审查分层 | 防止伪造 verdict |
| P1 seam | 容易与 P0 混合 | `owner-seam-selected` 仅 conditional | 保持 blocker 真相 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 每个 boundary 立即生成正式 EV | 不采用 | EV 必须来自固定真实 artifact/report pair，早期只能有 suite output |
| 早期生成 raw / readable suite report，PH-08 汇总 EV 与 handoff | 采用 | 保持 evidence provenance 与验收裁决分层 |
| 使用全量 `cargo test` 代替 local-smoke | 不采用 | 测试数量不等于 C1～C5 业务闭环 |
| 将 owner fake 作为 selected-run success | 不采用 | fake 只能验证 local Port parity / blocked posture |
| 将 report script 作为自动 signoff | 不采用 | VETO、risk、handoff 仍须人 / Agent 审查 |

## 7. 结构化中间产物

### 7.1 Future gate output and evidence rules

| 输出 | future 路径 | 适用 phase | 最低要求 |
|---|---|---|---|
| raw suite artifact | `artifacts/test/<run_id>/suites/<suite>/` | 所有实际执行的 PH | status、TC refs、profile、failure reason、duration/count、digest；失败也保留 |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | PH-02～08 | 仅由 raw artifact 生成，保留 disposition |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | PH-01 起 | 只允许 `core-contracts` compile；24 candidate non-materialized |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | PH-03 起 targeted；PH-08 必须 | artifact / report / log / audit均扫描，无 forbidden body / secret |
| gate results | `reports/runs/<run_id>/gate-results.md` | PH-08 必须 | blocked / not_run 不得转写 passed |
| report audit | `reports/runs/<run_id>/report-audit.md` | PH-08 必须 | raw-report pair、digest、provenance、no-static-evidence |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | PH-08 | EV 仅从真实 pair 推导，含 TC / AC / VF / digest |
| acceptance drafts | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | PH-08 | generator draft + human / Agent review；非自动 verdict |

### 7.2 Gate failure handling

| 失败 / 不可用类型 | 是否可继续 | 处理 |
|---|---|---|
| format / build / targeted suite fail | 否 | 仅修当前 boundary 后重跑；设计冲突则 `wait_design` |
| illegal state / UoW / replay / Query write | 否 | P0 consistency blocker；回写或修复并复验 affected family |
| redaction leak | 否 | `VF-L2M-004` / S-risk；修复后重跑 redaction 和 affected suites |
| non-Core dependency / candidate materialization | 否 | `VF-L2M-006/007`；移除越界内容或回写 architecture |
| artifact / report missing or static evidence | 否 | `VF-L2M-008`；修 generator / output，不得手写补洞 |
| owner positive seam unavailable | 可以继续 local P0 | 真实记录 blocked / not_run；不计 P0 / P1 positive pass |
| unresolved DDD helper / receipt / version gap | 否（受影响 boundary） | `wait_design`；不得 fake-only / direct Store workaround |
| flaky / timeout | 否，除非后续正式 retry policy | 保留 failure artifact，按 defect / risk rule处理 |

### 7.3 Phase gate matrix

| Phase | future test gate | AC / VF / VETO focus | future script / check | artifact / report | failure handling |
|---|---|---|---|---|---|
| PH-01 | `cargo check`、config parse、script dry-run、dependency-boundary | `AC-L2M-026/029/033`; `VF-L2M-006/007/008` | `scripts/checks/check_dependency_boundary.sh`;config-redline | dependency/config targeted pair | 不进入 PH-02；修 path / config / dependency |
| PH-02 | `contract-domain-fast` CP01、`service-flow-fast`、`infra-fake-parity`、`api-worker-entry` | `AC-L2M-001/006~008/019/021/031`; `VF-L2M-001/002/005` | planned CI target selection | CP01 contract/service/entry reports | subject / state / replay error阻断；host positive可 blocked |
| PH-03 | `contract-domain-fast` CP02、`service-flow-fast`、`api-worker-entry`、redaction | `AC-L2M-002/009/010/019/025/031`; `VF-L2M-002/004` | planned CI target selection + redaction | CP02 suite/redaction reports | fail-open、raw body、scope helper / receipt gap阻断 |
| PH-04 | `contract-domain-fast` CP03、`service-flow-fast`、replay、entry/redaction | `AC-L2M-003/011/019/020/030/031`; `VF-L2M-003/004/005` | planned CI target selection | CP03 suite / replay / redaction reports | Runtime positive absent only blocked; local fence failure阻断 |
| PH-05 | CP04/05 contract/service、`infra-fake-parity`、redaction、Queries 007～011 | `AC-L2M-003/004/012~015/020/021/030/032`; `VF-L2M-004/005/009` | planned CI target selection + redaction | outbound / trace suite reports | material leak、delivery/observed localization、helper gap阻断 |
| PH-06 | `projection-readmodel`、Query no-write、service / entry、dependency | `AC-L2M-005/016/017/024/028/033`; `VF-L2M-003/007` | planned projection / dependency checks | mirror / projection reports | source repair、visibility leak、pseudo-version阻断 |
| PH-07 | `api-worker-entry`、`job-continuation`、replay、fake parity、redaction | `AC-L2M-008/013/016/021/031`; `VF-L2M-003/004/005/008/009` | planned worker/job targets | consumer / Job / report pair | receipt reconstruction、source repair、partial report缺失阻断 |
| PH-08 | `local-smoke`、`release-redline`、config / dependency / redaction / report-generation-audit | `AC-L2M-019~033`; `VF-L2M-001~009` | `scripts/gates/run_release_gate.sh --run-id <run_id>` | full run reports and acceptance drafts | 任一 P0 / VETO / provenance failure不得送验 |

### 7.4 Commit-boundary gate matrix

| Boundary | future pre-commit test / check | AC / VF focus | future artifact / report | failure treatment |
|---|---|---|---|---|
| `commit-01-a` | fmt、check、dependency-boundary、diff check | AC-026/033; VF-006/007 | dependency pair when executed | 不提交；修 workspace / Core-only cut |
| `commit-01-b` | config-redline、profile parse、generator dry-run、diff check | AC-029/033; VF-008 | config / dry-run report when executed | 不提交；不生成 static pass |
| `commit-02-a` | CP01 contract/domain/state tests | AC-001/006/007/019; VF-002 | contract/domain report | 不提交；修 double-anchor / state |
| `commit-02-b` | CP01 service/fake/entry/replay tests | AC-001/008/021/031; VF-001/005 | service / entry / replay report | 不提交；host seam unavailable only blocked |
| `commit-03-a` | CP02 contract/domain/body-free/redaction | AC-002/009/010/025; VF-002/004 | CP02 contract / redaction report | 不提交；unknown不得放行 |
| `commit-03-b` | CP02 service/worker/query/replay/fake | AC-009/010/031; VF-002/004 | CP02 service / entry / replay report | scope helper / receipt gap `wait_design` |
| `commit-04-a` | CP03 contract/state/body-free tests | AC-003/011/019/020; VF-003/004/005 | CP03 contract report | 不提交；不得造 Runtime outcome |
| `commit-04-b` | CP03 service/entry/replay/redaction | AC-003/011/030/031; VF-003/005 | CP03 service / entry report | runtime mapping缺失则 blocked |
| `commit-05-a` | CP04 contract/service/fake/replay/redaction | AC-003/012/013/020/021; VF-004/005 | outbound / replay report | DDD-004 或 any Event materialization阻断 |
| `commit-05-b` | CP05 contract/service/append/redaction | AC-004/014/015/021/032; VF-004/005/009 | trace / redaction report | DDD-005、observed claim或leak阻断 |
| `commit-06-a` | CP06 contract/service/fake/replay/redaction | AC-016/024/028/031; VF-003/004 | mirror / replay report | DDD-006 / owner resolver gap阻断 |
| `commit-06-b` | projection-readmodel、Query no-write、API query tests | AC-005/016/017/024/028; VF-003 | projection / query report | DDD-007、source repair / invocation inference阻断 |
| `commit-07-a` | external Consumer pre-gate / redaction tests | AC-008/010/011/025/031; VF-004/006 | consumer entry report | DDD-003 / source unknown阻断 accepted lane |
| `commit-07-b` | committed Consumer / receipt / projection replay | AC-013/016/021/031; VF-003/005/009 | continuation / replay report | no source scan or receipt reconstruction |
| `commit-07-c` | Job carrier / report / duplicate tests | AC-016/021/031/033; VF-005/008 | Job contract / replay report | missing typed report surface阻断 |
| `commit-07-d` | Job continuation / partial isolation / fake parity | AC-013/016/021/024/031; VF-003/005/009 | Job / partial report | DDD-004~007 and source repair阻断 |
| `commit-08-a` | release dry-run、dependency/config/redaction/report audit shell | AC-026/029/033; VF-006/007/008 | gate / report audit dry-run output | no static evidence / VETO default |
| `commit-08-b` | local-smoke、release-redline、report audit、VETO draft review | AC-001~005/019~033; VF-001~009 | fixed-run artifact/report and reviewed drafts | any P0/VETO/provenance fail blocks handoff |

### 7.5 Report generation and acceptance-review rules

| Phase | future generator | input | output | review rule |
|---|---|---|---|---|
| PH-01 | targeted dependency/config report shell | check raw output | targeted report | verify no static result assertion |
| PH-02～PH-05 | `scripts/reports/generate_suite_reports.sh` | contract/domain/service/entry raw artifacts | `reports/runs/<run_id>/suites/*.md` | implementation review failure / blocker mapping |
| PH-06～PH-07 | suite report generator plus projection / job mapping | projection / consumer / job artifacts | focused readmodel / operations reports | review no-write, source fence, partial item semantics |
| PH-08 | suite / gate / evidence / acceptance generators | full fixed-run artifact set and open issue inputs | runs summary, evidence index, acceptance drafts | human / Agent review required before any acceptance use |

| Acceptance report | generator role | mandatory human / Agent review | forbidden outcome |
|---|---|---|---|
| `handoff.md` | draft scope / baseline / open issue summary | source refs、run_id、coverage and residual | a script declares acceptance |
| `veto-checklist.md` | draft VF list from actual evidence / reports | all `VF-L2M-001~009` evidence and disposition | default-all-passed / no-source VETO |
| `risk-acceptance.md` | draft eligible B/R/P1 residual record | owner、acceptor、deadline / trigger; never VETO / S | accepting blocked P0 / VETO / S issue |
| `open-issues.md` | draft failure / residual aggregation | defect level, retest and status | hiding failed / blocked run as note |

### 7.6 Gate stop-review and cross-gate audit

| Phase / boundary | 停审项 | 设计层结论 | 执行期缺口 |
|---|---|---|---|
| PH-01 | path / config / dependency / generator 是否不宣称执行结果 | `pass_for_design` | target repo / baseline absent |
| PH-02～PH-04 | local state、UoW、replay、entry与 owner-positive 是否分层 | `pass_for_design` | UP-001/003/006/008; DDD-001 |
| PH-05～PH-06 | material / trace / mirror / projection 是否 body-free、no-write、no source repair | `pass_for_design` | DDD-004~007; external seams |
| PH-07 | Consumer / Job 是否只消费 finite committed / verified source且有 report rule | `pass_for_design` | DDD-003~007 |
| PH-08 | report / EV / VETO 是否只能来自 real raw/report pair | `pass_for_design` | no run / evidence / review |
| all 18 boundaries | 是否都有 targeted gate、AC/VF、artifact/report归属和失败处理 | `pass_for_design` | actual checks all `not_run` |

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 PH 至少一个 test gate | `pass_for_design` | actual execution awaits target repo |
| 每个 boundary 有 pre-commit test/check | `pass_for_design` | no boundary is current / executable |
| AC 与 VF/VETO 前置覆盖 | `pass_for_design` | final verdict remains `not_run` |
| artifact → report → EV / handoff provenance | `pass_for_design` | PH-08 only; no artifacts now |
| redaction / dependency / candidate non-materialization | `pass_for_design` | tests not executed; UP-005 stays open |
| P1 selected-run 与 P0 分离 | `pass_for_design` | exact owner contract remains pending |
| 无 unresolved design-level gate mapping conflict | `pass_for_design_with_blockers` | target repo, baseline, DDD / UP blockers still prevent execution |

## 8. 回填草稿

未来正式 `07-实施计划.md` §7 应说明：所有 PH 与 18 个 boundary 都有 future targeted tests、AC / VF 关联、artifact / report路径和失败处理。P0 raw suite artifact 必须由实际运行写入 `artifacts/test/<run_id>`，可读 report 必须生成在 `reports/runs/<run_id>`，只有 PH-08 才能从真实 pair 建 evidence index 和 acceptance draft。`reports/acceptance/*` 不是自动 verdict，必须审查。redaction、dependency、report pairing、no-static-evidence以及 24 candidate non-materialization均是 blocking checks；owner selected-run 是 P1 conditional，blocked / not_run 不得转写为通过。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| target repo / immutable baseline | 所有 gate execution | `L2M-DDD-001` / baseline blocker；当前全部 not_run |
| actual script names / CLI after implementation repo exists | Phase runner command | 当前只引用 `05` planned path；建仓后严格对齐，不预建 |
| P1 owner selected-run contract | external positive qualification | only after `L2M-UP-*` closure and explicit authorization |
| workload / SLO authority | performance / capacity gate | Step 9 spike；不填阈值 |
| DDD helper / receipt / version closure | affected boundary testability | `wait_design` before execution; no fake workaround |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| phase gate matrix | `pass_for_design` | PH-01～08 all mapped |
| boundary gate matrix | `pass_for_design` | 18 boundaries mapped |
| artifact / report / acceptance draft ownership | `pass_for_design` | paths and review responsibility explicit |
| failure / blocker handling | `pass_for_design` | no gate failure can be disguised |
| cross-gate audit | `pass_for_design_with_blockers` | all execution remains blocked / not_run |
| 可进入 Step 8 | `authorized` | 下一步只定义配置、环境、外部依赖与 fake 边界 |
