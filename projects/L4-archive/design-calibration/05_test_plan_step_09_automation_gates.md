# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 正式回填：`05-测试方案.md` §9
> 日期：2026-09-13
> 状态：`completed / automation_planned_real_seam_gate_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 将 102 个 planned TC、环境/profile 和 blocker 映射为 suite、gate、planned scripts、artifact/report 输出与阻断语义 |
| 输入 | Step 4/6～8；测试书写规范 §4.6/5.9；目录组织规范 §9～10 |
| gate_status | `completed / automation_planned_real_seam_gate_blocked` |
| gate_reason | 所有本地 P0 与 real-seam required lane 都有 gate；脚本/路径仅 planned，未把 blocked/not-run 写成 pass |
| next_allowed_action | 创建并完成 Step 10 |
| source_files | 05 Step 4/6～8；03 §15；04 §12；目录组织规范 §9～10 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| Suite 与 pipeline | §6.1～6.2 | done | PR/main/nightly/formal/release职责明确 |
| Script contract | §6.3 | done | gates/reports/checks 分目录、参数/非零语义明确 |
| Artifact/report | §6.4 | done | fixed run roots、failure outputs、no latest |
| TC/EV candidate 映射 | §6.5 | done | 102 TC 家族无自动化孤儿 |
| 停审与跨 suite 审计 | §6.6～6.8 | done | blocked real seam、redaction、pairing、no static EV 可判定 |

## 2. 本步输入与事实边界

所有名称都是正式 07/实现阶段应创建的 planned boundary，不表示脚本、CI job、runner、测试文件、实现仓或输出已存在。本 Step 不选择 CI vendor 或测试 framework，不运行任何命令，不创建 `<run_id>`，不生成 artifact/report/evidence。

| 阻断级别 | 语义 |
|---|---|
| P0 local blocking | 实现后每次适用 gate 必须通过；failure/infra failure 均阻断 |
| P0 formal-seam blocking | 需求为 P0；前置缺失时 gate=`blocked`，不是 skipped/pass |
| P1 selected | 正式 provider/额外兼容加固；不能替代 P0 formal seam |
| P2 measured | workload/baseline 后才可运行；当前 pending，不造阈值 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| PR 必跑哪些 suite？ | contract/domain/state、service/no-write、config schema/assembly、dependency/outbound absence 快速门禁。 |
| main CI？ | PR 加 entry/worker/job、fake store/UoW/fault、authority/restore negative、security/observe。 |
| nightly？ | main 加完整 fault/race/partial/replay、resource L/L+1 与 report-generation audit。 |
| staging/release？ | formal-seam conformance 必须满足 owner/provider前置，否则 blocked；release review还需 local suites、VETO、redaction、raw/report pairing。 |
| flaky/timeout/dependency fault？ | 不自动转 pass；flaky视 failed，unexpected timeout/infrastructure为失败；MayHaveDispatched是业务 case，formal依赖缺失为blocked。 |
| gate scripts？ | planned `run_pr_gate.sh`、`run_main_gate.sh`、`run_nightly_gate.sh`、`run_formal_seam_gate.sh`、`run_release_gate.sh`。 |
| 参数/根目录？ | gates支持 `--run-id --artifact-root --config-profile`；artifact默认`artifacts/test/<run_id>`；report root为`reports`。 |
| release checks？ | redaction、dependency、outbound absence、artifact/report links、no-static-evidence、blocked-lane/VETO completeness。 |
| report scripts？ | generate reports/evidence index/acceptance handoff 初稿；只能读固定 run raw artifacts。 |
| suite覆盖谁？ | 见 §6.5；所有 Step 6 TC family 至少映射一个 blocking suite，real positive映射 formal-seam blocked suite。 |
| P0不可自动化？ | 无本地 P0 被降为人工；人/Agent只审查报告与未来06裁决，不能替代 suite。 |
| 是否有缺口？ | 无设计级自动化孤儿；实现、CI、formal environment 和真实输出均尚未存在。 |

## 4. Historical material 诊断与改动前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| `cargo test` 即全门禁 | 无业务/证据/外部接缝区分 | 分 11 suites + 5 gates + checks |
| `[待定 CI artifact]` | 路径不固定 | 严格使用标准 roots |
| E2E mock success | fake 冒 real seam | formal seam 独立 gate，缺前置=`blocked` |
| latest 报告 | 不可复核且可能跨 run | 正式引用固定 `<run_id>`，latest禁止 |
| 失败不产报告 | 丢失诊断/造成功 | 尽可能保留 report.json/stdout/stderr/failure reason |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 自动化 | 用例标“是” | suite→gate→script→raw→report→EV candidate |
| release | 总测试数/人工确认 | scenario/VETO/formal seam/redaction/pairing 审查 |
| blocked | skip | formal blocked result，不能计 pass denominator |
| scripts | 未分类 | gates/reports/checks 清晰分工 |

## 5. 自动化设计取舍

1. suite 按风险切口而非 crate 机械划分；底层 suite 可重叠，但 release smoke 不替代底层证明。
2. real-seam gate 不绑定具体 provider/endpoint/secret；它先检查正式合同、binding、vector、cleanup 与版本，缺失直接 blocked。
3. gates 与 reports 分离：gate生成raw；report脚本读取raw；check脚本验证边界，任何报告都不能反写 raw status。
4. 正式 EV 留 Step 13；Step 9 只把 `EV-CAND-AR-*` 映射至真实输出槽位。
5. 所有 planned script 都由未来 07 排期；当前不创建空 skeleton，避免伪造实现边界已落地。

## 6. 结构化中间产物

### 6.1 自动化套件表

| suite | 覆盖 | 执行位置/profile | 阻断 | planned 入口 | raw artifact | human report |
|---|---|---|---|---|---|---|
| `archive-contract-domain` | CONTRACT/OBJECT/STATE | PR/main；ci-test | P0 | `scripts/gates/run_pr_gate.sh --suite archive-contract-domain` | `artifacts/test/<run_id>/suites/archive-contract-domain/` | `reports/runs/<run_id>/suites/archive-contract-domain.md` |
| `archive-service-flow` | COMMAND/QUERY/no-write | PR/main；ci-test | P0 | `run_pr_gate.sh --suite archive-service-flow` | `.../archive-service-flow/` | `.../archive-service-flow.md` |
| `archive-config-boundary` | CONFIG/55 keys/assembly/profile | PR/main/release；ci-test | P0 | `run_pr_gate.sh --suite archive-config-boundary` | `.../archive-config-boundary/` | `.../archive-config-boundary.md` |
| `archive-dependency-boundary` | DEPENDENCY/outbound absence | PR/main/release；ci-test | P0 | `scripts/checks/check_dependency_boundary.sh` | `.../archive-dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` |
| `archive-entry-worker` | 3C/5Q handlers、5E/17J、claim/report | main/nightly；ci-test | P0 | `scripts/gates/run_main_gate.sh --suite archive-entry-worker` | `.../archive-entry-worker/` | `.../archive-entry-worker.md` |
| `archive-consistency-replay` | UOW/IDEMP/EFFECT/fault/race/partial | main/nightly/release；operations-replay | P0 local | `run_main_gate.sh --suite archive-consistency-replay` | `.../archive-consistency-replay/` | `.../archive-consistency-replay.md` |
| `archive-authority-restore-negative` | AUTHORITY/RESTORE/VETO fail-closed | main/release；integration-like | P0 | `run_main_gate.sh --suite archive-authority-restore-negative` | `.../archive-authority-restore-negative/` | `.../archive-authority-restore-negative.md` |
| `archive-security-observe` | SECURITY/OBSERVE/non-interference | main/release；ci-test | P0 | `scripts/checks/check_redaction.sh` + suite | `.../archive-security-observe/` | `reports/runs/<run_id>/redaction-check.md` |
| `archive-resource-bounds` | RESOURCE L/L+1、visible partial | nightly；ci-test | P0 qualitative | `run_nightly_gate.sh --suite archive-resource-bounds` | `.../archive-resource-bounds/` | `.../archive-resource-bounds.md` |
| `archive-report-audit` | REPORT/raw-report pairing/no-static/latest | nightly/release；ci-test | P0 | report/check scripts | `.../archive-report-audit/` | `reports/runs/<run_id>/report-audit.md` |
| `archive-formal-seam` | owner/source/governance/integrity/storage/receiver/durable positive | formal staging-like | P0 required | `scripts/gates/run_formal_seam_gate.sh` | `.../archive-formal-seam/` | `.../archive-formal-seam.md` |
| `archive-p1-hardening` | provider combinations/SDK consumers/optional handoff | selected staging-like | P1 | planned selected suite through formal gate | `.../archive-p1-hardening/` | `.../archive-p1-hardening.md` |
| `archive-p2-measured` | capacity/long-run/RTO/RPO | future measured profile | P2 | future after threshold authority | `.../archive-p2-measured/` | `.../archive-p2-measured.md` |

省略号只为本表减少重复，规范根目录仍完整固定为 `artifacts/test/<run_id>/suites/<suite>/` 与 `reports/runs/<run_id>/suites/<suite>.md`；实现不得把省略号作为路径。

### 6.2 自动化门禁图：planned pipeline

```text
PR -> contract-domain + service-flow + config + dependency
  |
  v
Main -> PR suites + entry-worker + consistency + authority/restore-negative
                  + security/observe
  |
  v
Nightly -> Main suites + full fault/race/replay + resource bounds + report audit
  |
  +----> Formal-seam gate -- prerequisites missing --> BLOCKED (never pass/skip)
  |                         -- formal exact seams ----> conformance results
  v
Release review -> selected fixed run local suites + formal-seam result
               -> VETO + redaction + dependency + pairing/no-static-evidence
               -> reports only; future 06 owns verdict
```

关键说明：

- PR/main/nightly 是 planned CI layers；当前没有 CI vendor、job 或执行事实。
- Formal-seam 是 P0 required lane；blocked 不能从 release denominator 删除。
- Release review 不复用 `latest`，也不把报告生成成功等同于测试或验收通过。
- P1/P2 不能代替 P0 formal-seam，也不允许无 threshold/owner authority 时运行。

### 6.3 Planned gate / report / check 脚本契约

| 脚本 | 类型 | 必需输入 | 输出 | 非零/阻断条件 |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | gate | `--run-id --artifact-root --config-profile`; optional `--suite` | PR suite raw | 任一 suite failed/infra failed/missing output |
| `scripts/gates/run_main_gate.sh` | gate | 同上 | main suite raw | 任一 P0 local suite 非 passed |
| `scripts/gates/run_nightly_gate.sh` | gate | 同上 | extended raw | flaky/timeout/fault hook/cleanup failure |
| `scripts/gates/run_formal_seam_gate.sh` | gate | 上述参数 + formal binding/vector refs | formal suite raw，含 `blocked` prerequisite details | 缺前置返回非零且状态 blocked；conformance fail 非零 |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id --artifact-root --config-profile --report-root` | release gate raw summary input | local/formal/VETO/check 任一不满足 |
| `scripts/reports/generate_reports.sh` | report | `--run-id --artifact-root --report-root reports` | run summary、suite reports、gate-results | raw缺失/跨run/schema错/生成失败 |
| `scripts/reports/generate_evidence_index.sh` | report | fixed run raw + suite reports | `reports/runs/<run_id>/evidence-index.md` 初稿 | 无真实case/raw/digest或orphan mapping |
| `scripts/reports/generate_acceptance_handoff.sh` | report | fixed run reports | `reports/acceptance/handoff.md` 初稿 | source run不固定/缺VETO与open issues |
| `scripts/checks/check_artifacts.sh` | check | artifact root | check raw report | context/index/suite raw/log/failure reason缺失 |
| `scripts/checks/check_redaction.sh` | check | artifact root + report root | redaction raw/report | 任一 denylist canary/raw body/secret泄漏 |
| `scripts/checks/check_report_links.sh` | check | fixed run artifacts/reports | pairing report | raw/report跨run、缺link、latest/absolute unsafe ref |
| `scripts/checks/check_dependency_boundary.sh` | check | source-derived graph/config surface | dependency raw/report | sibling compile、SDK reverse compile、provider package、ready outbound |
| `scripts/checks/check_no_static_evidence.sh` | check | raw/index/reports | evidence authenticity report | 静态表/手写JSON直接宣告EV/VETO/pass |
| `scripts/checks/check_blocked_lanes.sh` | check | blocker registry + formal suite result | blocked-lane report | required lane遗漏、blocked当skip/pass、fake closure |

所有 gate 的 CLI 参数优先于同名环境变量，再到允许的安全默认；`--run-id` 必须由 CI/操作者显式生成或传入，本文不定义真实值。report/check 不得修改 raw status；失败 suite 仍尽可能写 `report.json`、stdout/stderr 和 safe failure reason。

### 6.4 Artifact 与 report 输出契约

| 输出 | 固定位置 | 来源 | 最小要求 |
|---|---|---|---|
| run context | `artifacts/test/<run_id>/meta/context.json` | gate | schema/run/repository/commit/branch/profile/times/generated_by；均由真实运行填 |
| raw evidence index | `artifacts/test/<run_id>/evidence-index.json` | gate/report indexer | 只索引真实 suite/case raw；不得先填 pass |
| suite result | `artifacts/test/<run_id>/suites/<suite>/report.json` | suite runner/gate | suite/status/case refs/profile/times/command/exit/failure/digest |
| suite logs | `.../stdout.log`、`.../stderr.log` | runner | redacted；失败也保留；不得含 raw secret/body |
| case raw | `.../cases/<case_id>.json` | case runner | TC、assertions、actual status、safe issue、artifact digest |
| run summary | `reports/runs/<run_id>/summary.md` | generate_reports | 从同 run raw生成，不反写raw |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | generate_reports | raw links、case status、blocker limitation |
| gate results | `reports/runs/<run_id>/gate-results.md` | generate_reports | passed/failed/blocked/infra failed denominator分离 |
| redaction/pairing reports | `reports/runs/<run_id>/redaction-check.md`、`report-audit.md` | checks | release VETO input |
| acceptance handoff | `reports/acceptance/*.md` | report scripts + human/Agent review | 后续06输入；不在05产生 verdict/risk acceptance |

`latest` 仅可用于本地调试指针且不得出现在正式引用；正式路径不得写 `artifacts/test/<project>/<run_id>` 或 `reports/<project>/...`。

### 6.5 Suite → CUT / TC / evidence candidate 映射

| suite | CUT / TC | evidence candidate | 状态上限 |
|---|---|---|---|
| `archive-contract-domain` | CONTRACT-001～004、OBJECT-001～006、STATE-001～018 | CONTRACT/OBJECT/STATE | local planned |
| `archive-service-flow` | COMMAND-001～006、QUERY-001～005 | COMMAND/QUERY | local planned；authority positives blocked |
| `archive-config-boundary` | CONFIG-001～004、RESOURCE-001 | CONFIG/NFR | local planned；real refs/numbers blocked |
| `archive-dependency-boundary` | DEPENDENCY-001～002、VETO-001/004相关 | DEPENDENCY/VETO | source-derived scan planned |
| `archive-entry-worker` | CONSUMER-001～005、JOB-001～017、contract metadata negative | CONSUMER/JOB | local flow planned；external positives blocked |
| `archive-consistency-replay` | UOW-001～004、IDEMP-001～004、EFFECT-001～004、REPORT-001 | UOW/IDEMP/EFFECT/RECOVERY | fake/replay planned；durable blocked |
| `archive-authority-restore-negative` | AUTHORITY-001～005、RESTORE-001～005、VETO-001～005 | AUTHORITY/RESTORE/VETO | negative planned；formal positive blocked |
| `archive-security-observe` | SECURITY-001～002、OBSERVE-001～002、VETO disclosure/leak | SECURITY/OBSERVE/VETO | local capture planned；handoff blocked |
| `archive-resource-bounds` | RESOURCE-001～002 + relevant job/query L/L+1 | NFR | qualitative planned；numeric threshold pending |
| `archive-report-audit` | REPORT-001～002、VETO-005 | REPORT/VETO | planned；requires real raw at execution |
| `archive-formal-seam` | corresponding positive lanes for COMMAND/CONSUMER/JOB/UOW/EFFECT/AUTHORITY/RESTORE | formal families later Step13 | blocked by named owners/providers |

19 TC families / 102 unique IDs have at least one suite mapping. Formal seam does not duplicate TC IDs merely to manufacture coverage; it executes each existing positive vector under a formally identified environment and emits a distinct evidence family.

### 6.6 P0 手工与不可自动化清单

| 项 | 结论 | 处理 |
|---|---|---|
| local P0 cases | 无不可自动化项 | 全部进入 blocking suite/check |
| formal-seam P0 | 可自动/受控执行，但当前 prerequisite blocked | 不允许人工签字替代；解阻后由 formal gate执行 |
| report/evidence review | 需人/Agent复核 | 只能验证解释/链接/风险，不改 suite status |
| acceptance verdict/risk acceptance | 不属于05 | 后续正式06及明确 owner |
| P1/P2 | selected/future | 不计当前 P0 pass，不替代 formal seam |

### 6.7 Suite / Gate 停审记录

| suite/gate | 覆盖/路径/失败检查 | 结论 | 缺口/上限 |
|---|---|---|---|
| PR | 快速 contract/service/config/dependency | 通过 | planned only |
| main | entries/consistency/authority/security | 通过 | real positives blocked |
| nightly | fault/race/resource/report | 通过 | numbers pending |
| formal seam | prerequisite + conformance | 通过设计 | 当前 blocked，不能skip/pass |
| release | fixed run + all VETO/check/report | 通过设计 | 不产生06 verdict |
| script layout | gates/reports/checks符合规范 | 通过 | 实现留07 |
| roots/pairing | fixed artifacts/reports roots | 通过 | actual output未生成 |

### 6.8 跨 suite 门禁 / 证据审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| P0 自动化孤儿 | 无 | 19 TC families/102 IDs全映射 |
| suite 重叠 | 可接受 | release smoke/review不替代底层suite |
| formal blocked lane遗漏 | 无 | 独立 formal-seam gate + blocked-lane check |
| fake closure | 无 | fake结果不进入formal evidence family |
| raw/report路径 | 通过 | 固定run、无project层、无latest |
| failure artifact | 通过 | 失败尽可能保留raw/log/reason |
| static evidence风险 | 已门禁 | no-static check；EV仍candidate |
| redaction/dependency/VETO | 全部 blocking | release必审 |
| 当前执行事实 | 0 | 无script/suite/run/artifact/report/EV/pass |

## 7. 复杂度判断

13 个 suite（11个P0主体含formal、1个P1、1个P2）、5个 gate 与14个 planned scripts 足以覆盖 102 TC，而不绑定 CI vendor/framework。Step 13 将正式 evidence family 与 raw schema细化；Step 9 不创建脚本或提前生成报告。

## 8. 回填草稿

正式 §9 应保留 suite 表、pipeline、script contract、fixed-run output、suite→TC/EV candidate 和审计。必须醒目标明所有路径/脚本均 planned；formal-seam prerequisite 缺失返回 blocked且不能从 release denominator 删除；报告生成、人审、静态矩阵都不能把未运行或失败改成通过。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；未发明新 protocol/config key/activation |
| 新 blocker | 无 |
| 持续 blocker | formal-seam、durable、Core graph、workload thresholds、outbound 均保持原 ID |
| 07 承接 | 未来必须规划 suite/script/report/check 实现；当前不创建 skeleton |

## 10. 进入 Step 10 门禁

- [x] 所有 P0 TC 与 real-seam lane 均有 suite/gate，未以人工替代。
- [x] gate/report/check 职责、参数、失败和固定路径符合规范。
- [x] blocked/failed/infrastructure_failed/not_run 与 passed 分离。
- [x] raw→report→EV candidate 不能由静态表、latest或跨run拼接制造。
- [x] 每个 blocking suite 已停审，跨 suite 审计无 unresolved 冲突。
- [x] 允许进入 Step 10。
