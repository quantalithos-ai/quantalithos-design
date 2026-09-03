# 07 Step 7：测试与验收门禁嵌入

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填目标：正式 `07-实施计划.md` §7
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：本文件只定义 future test/gate/evidence contract；不执行测试、不创建 run、artifact、report、EV instance、verdict 或 signoff。

## 1. 本步目标与输入

本步将 Step 5 的八个 Phase、Step 6 的 24 个 boundary 与正式 `05-测试方案.md`、`06-验收标准.md` 的测试切口和验收方向绑定。测试编号、脚本和路径是 planned identity；当前不存在实现仓和执行环境，所有实际结果保持 `not_started`、`not_entered` 或 `not_evaluable`。

| 输入 | 使用方式 |
|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | phase 目标、出口和 blocker 传播。 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 24 boundary 与 Gate-01~24 的一对一绑定。 |
| `05-测试方案.md` | TC、EV、suite、script、fixture、artifact/report 路径。 |
| `06-验收标准.md` | AC、VETO、P0/P1/P2、same-run 和 acceptance authority。 |
| `设计真相源闭环与可落码性标准.md` §九 | no-write、状态、projection、artifact、redaction 和 phase 复核。 |

## 2. 测试分母与状态上限

当前唯一 canonical 设计分母为：

```text
10 Command + 10 Query + 2 marker-only inbound + 6 bounded Job + 0 outbound
19 state matrices + 20 local lifecycle subjects
5 capability domains + 21 configuration keys
planned TC/EV families from 05; no executed case or evidence instance
```

以下词语在实现期不得互换：`planned`、`blocked`、`unknown`、`unavailable`、`gap`、`not_evaluable`、`passed`、`accepted`、`ready`。当前 blocker 影响的正向 Command/Job、qualification、Artifact、availability terminal、consumer handoff 和 recovery 只能输出安全负向或等待状态。

## 3. 测试 lane 与证据流

#### 流程图：L2-member-images 测试与验收证据链

```text
[formal 00-07 + design baseline]
  -> read [boundary ledger]
  -> select [exact TC manifest]
  -> run [one fixed run_id]
  -> write [artifacts/test/<run_id>]
  -> derive [reports/runs/<run_id>]
  -> review [reports/acceptance/* drafts]
  -> handoff [formal 06 reviewer]
```

关键说明：

- 图表达测试、报告和验收移交的先后关系，不表达 CI 产品、调度器或真实外部服务已存在。
- `artifacts/test/<run_id>` 是 raw source；`reports/runs/<run_id>` 只能由 raw 派生。
- `reports/acceptance/*` 可以由脚本生成草稿，但必须由授权角色审查；实现 agent 不产出 verdict、signoff 或 readiness。
- `latest`、跨 run 聚合、手写 JSON/Markdown passed 和 stdout 单独引用均不可作为证据。

| Lane | 范围 | 允许的最高状态 | 当前状态 |
|---|---|---|---|
| `local-contract` | pure contract、typed ref、状态、strict config、no-write | `designed` 或 future `passed` | `not_entered` |
| `ci-fault-negative` | UoW/version/replay/unknown/redaction/依赖负向 | `blocked`/`failed`/future `passed` | `not_entered` |
| `owner-seam-candidate` | builder、qualification、Artifact、consumer controlled seam | `candidate`/`blocked`/`gap` | `blocked_dependency` |
| `acceptance-handoff` | same-run 汇总和 06 输入 | `draft`/`review_required` | `not_generated` |

## 4. Planned test suites 与 checks

| Suite | 覆盖范围 | 主要 TC | EV 方向 | 规划脚本 | 当前 |
|---|---|---|---|---|---|
| `pr-contract-domain` | typed ref、definition、assembly、19 state matrix、static/live | `TC-CMD-001~003`、`TC-STATE-001~019` | `EV-UNIT-001` | `scripts/gates/check_contract_domain.sh` | `planned_not_created` |
| `pr-boundary-no-write` | blocked Command/Job、10 Query、2 inbound、0 outbound | `TC-CMD-004~010`、`TC-QUERY-001~010`、`TC-IN-001~002`、`TC-EVENT-001` | `EV-SVC-001`、`EV-ENTRY-001`、`EV-GATE-001` | `scripts/gates/check_boundary_no_write.sh` | `planned_not_created` |
| `pr-config-security` | strict JSON、source priority、profile/fake、redaction | `TC-CONFIG-001~005`、`TC-SEC-001~002` | `EV-CONFIG-001`、`EV-SEC-001` | `scripts/gates/check_config_security.sh` | `planned_not_created` |
| `ci-integration-seams` | repository/version/UoW/projection/adapter failure | `TC-CON-003~005`、`TC-STATE-008~011` | `EV-INT-001` | `scripts/gates/run_integration_seams.sh` | `planned_not_created` |
| `ci-entry-contracts` | API/worker/jobs logical mapping | `TC-IN-001~002`、`TC-JOB-001~006`、`TC-OBS-002` | `EV-ENTRY-001`、`EV-OBS-001` | `scripts/gates/check_entry_contracts.sh` | `planned_not_created` |
| `ci-dependency-redaction` | sibling dependency、forbidden body、zero outbound | `TC-DEP-001`、`TC-SEC-001~002`、`TC-EVENT-001` | `EV-GATE-001`、`EV-SEC-001` | `scripts/gates/check_dependency_redaction.sh` | `planned_not_created` |
| `nightly-risk` | conflict、commit unknown、PF unavailable、performance candidate | `TC-CON-001~005`、`TC-REC-001`、`TC-PERF-001` | `EV-REC-001`、`EV-PERF-001` | `scripts/gates/run_risk_matrix.sh` | `planned_not_created` |
| `release-controlled-smoke` | owner-closed controlled composition | selected P1/P2 only | future EV | `scripts/gates/run_controlled_smoke.sh` | `blocked_dependency` |

检查脚本的 planned identity：

| Check | 规划脚本 | 必须断言 | 失败上限 |
|---|---|---|---|
| `SRC` | `scripts/checks/check_source_manifest.sh` | formal/calibration source 与 TC/EV/CUT 可解析 | source mismatch -> `blocked` |
| `DEN` | `scripts/checks/check_test_denominators.sh` | 10/10/2/6/0、19、20、21 的分母不漂移 | denominator drift -> P0 stop |
| `DEP` | `scripts/checks/check_dependency_boundary.sh` | compile/runtime/event/ref/adapter/fake 分类不漂移 | unauthorized sibling compile -> VETO direction |
| `FORBID` | `scripts/checks/check_forbidden_material.sh` | body、secret、live state、route、provider response 不入输出 | hit -> S/VETO stop |
| `FAKE` | `scripts/checks/check_fake_profile_leak.sh` | fake 只在 `ci-test + TestOnly` | leak -> S/VETO stop |
| `TRUTH` | `scripts/checks/check_status_truth.sh` | blocked/planned/ACK/marker 不升格为成功 | promotion -> P0 stop |
| `REDACT` | `scripts/checks/check_redaction.sh` | raw/log/trace/report 脱敏 | leak -> S/VETO stop |
| `PAIR` | `scripts/checks/check_artifact_report_pairing.sh` | same-run raw/report/EV 配对 | orphan/cross-run -> evidence ineligible |
| `NOSTATIC` | `scripts/checks/check_no_static_evidence.sh` | evidence 只能从 raw/report/check 派生 | static pass -> invalid evidence |

## 5. Phase 门禁矩阵

| Gate | Boundary / Phase | 规划测试切口 | Suite / checks | AC/VETO 方向 | 失败动作 |
|---|---|---|---|---|---|
| `GATE-01` | `commit-01-a` / PH-01 | workspace、package/crate、dependency | contract-domain；`SRC,DEP,FORBID` | `AC-SYNC-MI-*`、`VETO-MI-007` | 目标仓/名称/依赖不符，`blocked / wait_design`。 |
| `GATE-02` | `commit-01-b` / PH-01 | `TC-CONFIG-001~005`、strict binding | config-security；`SRC,DEN,REDACT` | `NFR-MI-*`、`VETO-MI-003` | whole-config reject；不 partial apply。 |
| `GATE-03` | `commit-01-c` / PH-01 | script args、path、ledger shell | contract-domain；`SRC,FORBID,NOSTATIC` | evidence integrity | 不生成 raw/report；修正设计契约。 |
| `GATE-04` | `commit-02-a` / PH-02 | `TC-CMD-001/003`、`TC-STATE-001~003` | contract-domain；`SRC,TRUTH` | `AC-FUNC-001`、`VETO-MI-002` | mapping body/fallback -> stop，`MI-UP-003` 保持 blocker。 |
| `GATE-05` | `commit-02-b` / PH-02 | `TC-CMD-002/005`、`TC-SEC-001~002` | contract-domain/config-security；`FORBID,REDACT` | `AC-FUNC-002`、`VETO-MI-003` | static/live 或 body leak -> S stop。 |
| `GATE-06` | `commit-02-c` / PH-02 | revision、supersede、append-only negative | integration-seams；`TRUTH,DEN` | `AC-STATE-MI-*` | B01/B02 或 illegal transition -> no write。 |
| `GATE-07` | `commit-03-a` / PH-03 | intent/snapshot/attempt/candidate shape | contract-domain；`SRC,TRUTH` | `AC-FUNC-003` | 不完整输入只保留 blocked/unknown。 |
| `GATE-08` | `commit-03-b` / PH-03 | `TC-CMD-004~005`、`TC-CON-004~005` | boundary-no-write/integration; `TRUTH,NOSTATIC` | `VETO-MI-004` | 不创建 candidate/digest/result。 |
| `GATE-09` | `commit-03-c` / PH-03 | `TC-JOB-001~002` bounded selector | entry-contracts/nightly; `DEN,TRUTH` | job boundary | 不启 scheduler/lease/run。 |
| `GATE-10` | `commit-04-a` / PH-04 | `TC-CMD-006`、`TC-STATE-006~011` | contract-domain; `SRC,TRUTH` | `AC-FUNC-004` | gate/evidence 缺失 -> unknown/blocked。 |
| `GATE-11` | `commit-04-b` / PH-04 | `TC-CMD-007`、Artifact gap | integration-seams/dependency; `DEP,FORBID` | `MI-UP-007`、`VETO-MI-005` | 不 mint Artifact ref。 |
| `GATE-12` | `commit-04-c` / PH-04 | qualification error/redaction | boundary-no-write/config-security; `TRUTH,REDACT` | eligibility boundary | 不返回 `Passed/Eligible`。 |
| `GATE-13` | `commit-05-a` / PH-05 | `TC-CMD-008~010`、`TC-STATE-012~015` | integration-seams; `TRUTH,DEN` | `AC-FUNC-005` | B03 阻断 terminal persistence。 |
| `GATE-14` | `commit-05-b` / PH-05 | `TC-QUERY-005~007` local supply | boundary-no-write; `TRUTH,NOSTATIC` | consumer separation | 不宣称 launch/health。 |
| `GATE-15` | `commit-05-c` / PH-05 | consumer gap/unavailable mapping | entry-contracts/dependency; `DEP,TRUTH` | `MI-UP-001` | `ConsumerHandoffGap`/`Unavailable`，不 confirmation。 |
| `GATE-16` | `commit-06-a` / PH-06 | `TC-QUERY-001~004/008~010` | boundary-no-write; `SRC,TRUTH` | Query no-write | Query 不 reserve/trace/gap。 |
| `GATE-17` | `commit-06-b` / PH-06 | freshness/rebuild negative | integration-seams/nightly; `TRUTH,NOSTATIC` | `PF-UNAVAILABLE-RECOVERY` | 保持 `Unavailable`，不造 recovery edge。 |
| `GATE-18` | `commit-06-c` / PH-06 | API visible/not-visible/degraded mapper | entry-contracts; `TRUTH,REDACT` | interface sync | 不绑定 transport 或产品策略。 |
| `GATE-19` | `commit-07-a` / PH-07 | `TC-IN-001~002` marker-only | entry-contracts/dependency; `DEP,TRUTH` | `MI-UP-005`、`VETO-MI-007` | `accepted_input=false`，无 envelope/receipt。 |
| `GATE-20` | `commit-07-b` / PH-07 | `TC-JOB-001~006` bounded | entry-contracts/boundary-no-write; `TRUTH,DEN` | job/no-repair | 不 scheduler、lease、positive mutation。 |
| `GATE-21` | `commit-07-c` / PH-07 | facade-only dispatch、direct-I/O negative | entry-contracts/dependency; `DEP,FORBID` | architecture redline | 发现 direct store/transport 即阻断。 |
| `GATE-22` | `commit-08-a` / PH-08 | fixture/gate/check argument shell | all planned suites; `SRC,DEN` | evidence input | 参数/path 不闭合 -> 不执行。 |
| `GATE-23` | `commit-08-b` / PH-08 | report/evidence pairing/redaction | all suites; `PAIR,REDACT,NOSTATIC` | `VETO-MI-001~007` | orphan/static/leak -> evidence ineligible。 |
| `GATE-24` | `commit-08-c` / PH-08 | controlled smoke/handoff draft | release smoke; all checks | 06 handoff only | `review_required`；不生成 verdict/signoff/readiness。 |

## 6. Artifact、report 与验收责任

```text
M0 planned identity
  -> M1 raw: artifacts/test/<run_id>/
  -> M2 report: reports/runs/<run_id>/
  -> M3 derived EV/index (same run)
  -> M4 acceptance drafts: reports/acceptance/
```

| 材料 | 生成方 | 固定路径 | 当前状态 | 可否人工改写 |
|---|---|---|---|---|
| raw context/case/suite/check | future runner/gate | `artifacts/test/<run_id>/...` | `not_generated` | 否 |
| run report/gate summary | future report script | `reports/runs/<run_id>/...` | `not_generated` | 只能追加 review note，不改 raw |
| evidence index/EV detail | future derivation | same-run report root | `not_generated` | 否 |
| acceptance handoff | script 初稿 + authorized review | `reports/acceptance/handoff.md` | `not_created` | 可补交接说明，不改结果 |
| VETO/risk/open issues | 06 authority input | `reports/acceptance/veto-checklist.md` 等 | `not_created` | 不可由实现 agent签署 |

证据 identity 必须至少包含：`run_id`、`evidence_id`、`case_id`、`owning_suite`、case artifact digest、suite report digest。当前不填具体 digest、run 或 alias。

## 7. 门禁失败与停审

| 失败类别 | 当前处理 | 是否允许下一个 boundary |
|---|---|---|
| 设计字段/DTO/state/ref 缺口 | 回写 03/04/05/06，冻结新 baseline 后重核 | 否 |
| 目标仓/工具链/配置不可用 | `blocked / wait_design`，不创建替代事实 | 否 |
| P0 assertion、Query write、fake leak、redaction 或 outbound violation | S/VETO stop，保留 raw（若已存在）并新 run 复验 | 否 |
| owner/Artifact/consumer/PF 未闭 | 记录 `blocked/gap/unknown/unavailable` | 只允许不受影响的负向边界 |
| report/index/pairing 失败 | `not_evaluable`，修复生成链并使用新 run | 否 |
| P1/P2 未选入本轮 | `residual/future` 独立记录 | 不影响 P0，但不可借此通过 |

## 8. 逐阶段停审与跨门禁审计

| Phase | 出口 Gate | 设计期结论 | 实际执行上限 |
|---|---|---|---|
| PH-01 | `GATE-03` | pass-designed；workspace/config/script contract 已绑定 | `not_started` |
| PH-02 | `GATE-06` | blocker-aware；definition/assembly/revision 正向受 owner/B01 限制 | `blocked`/negative only |
| PH-03 | `GATE-09` | blocker-aware；build candidate 不可正向形成 | `blocked`/unknown |
| PH-04 | `GATE-12` | blocker-aware；qualification/Artifact 只保留 safe gap | `blocked`/gap |
| PH-05 | `GATE-15` | blocker-aware；consumer 不可确认 | `ConsumerHandoffGap`/`Unavailable` |
| PH-06 | `GATE-18` | pass-designed；10 Query strict no-write | read-only only |
| PH-07 | `GATE-21` | blocker-aware；marker/bounded job/facade only | marker/blocked |
| PH-08 | `GATE-24` | pass-designed；evidence/handoff 只生成 review-required 草稿 | `not_generated` |

跨门禁审计结论：24 个 Gate 均有 boundary、TC、suite、check、AC/VETO 方向和失败动作；无 Gate 可以解除 B01/B02、B03、OPEN/PF、MI-UP 或 Q-MI blocker；所有 evidence 路径均保留 same-run 约束。

## 9. 回填草稿、待确认事项与进入下一步

### 回填草稿（正式 §7）

每个 Phase 和 commit boundary 都必须在提交前执行与其增量对应的 planned suite/check，并将 raw artifact、run report、EV index 和 acceptance draft 分层保存。当前只能验证 pure contract、negative/no-write、marker、gap 和 bounded selector；正向 mutation、qualification、Artifact、consumer、recovery 与发布成功不在当前上限内。

### 待确认事项

1. 未来实现仓的 test runner、machine JSON schema 和 digest canonicalization 尚未固定。
2. `MI-UP-*`、`Q-MI-*`、B01/B02、B03、OPEN/PF 关闭后，受影响 Gate 需重新选择 positive oracle。
3. `release-controlled-smoke` 的 profile、owner ref 和人工审查角色尚未授权。

### 进入 Step 8 条件

- 24 Gate 与 Step 6 boundary 一对一；每个 Gate 有 TC/suite/check/AC/VETO/失败处理。
- raw/report/evidence/acceptance 的路径、生成方、审查方和 same-run 规则明确。
- 失败、blocked、not_evaluable 和 VETO 处理不与完成/ready 混淆。

**Step 7 结论：`completed_with_explicit_blockers`；测试执行状态：`not_started`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

Step 6 boundary table、正式 05/06、SOP 与可落码标准

## 本步输出

24 Gate、suite/check、artifact/report、停审矩阵

## 事实边界

测试/验收 planned contract，不执行 runner；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 每个 Phase/boundary 绑定哪些 TC/suite/check？——按 `GATE-01~24` 一对一绑定，覆盖正式 05 的 planned families。
2. 哪些 AC/VETO 必须前置？——Query no-write、marker-only inbound、outbound zero、redaction、dependency 和 staged-status isolation。
3. 门禁失败能否继续？——不能；只能修复、回写或保留 blocked/not_evaluable。
4. 证据如何归档？——固定 run 的 raw→report→EV same-run pair；acceptance 仅 review-required。
## 当前文档问题诊断

- 旧材料容易把 planned TC/EV 或静态表当成通过证据。
- 当前实现仓缺失，无法执行 suite、script、run 或报告生成。
- 外部 positive lane 不能成为 P0 分母。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 门禁 | 仅有测试方案方向 | 24 Gate 逐 boundary 绑定 TC/suite/check/AC/VETO |
| 证据 | 路径易被误当实例 | raw/report/EV/acceptance 分层并固定 same-run |
| 失败 | 可能被写成 warning | P0/VETO/不配对明确阻断 |
## 设计取舍

- 采用每 boundary 独立 Gate，便于回退和证据归属。
- 采用 planned suites 而非当前创建脚本，避免伪造执行事实。
- 维持 release smoke 为 blocked dependency，不稀释 P0。
## 结构化中间产物

本步结构化产物是 suite 表、九类 check 表、24-Gate 矩阵、artifact/report 规则、失败处理矩阵和跨门禁审计。
