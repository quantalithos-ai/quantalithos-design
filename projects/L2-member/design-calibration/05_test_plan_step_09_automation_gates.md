# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节：`projects/L2-member/05-测试方案.md` §9「自动化与 CI/CD 门禁」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_09_automation_gates.md`
> 状态口径：本文件只定义 planned suite / gate / script / artifact / report 契约，不创建脚本、不运行测试、不生成真实 run_id 或证据实例。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9：设计自动化与 CI/CD 门禁 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 4 分层；Step 6 用例；Step 7 数据；Step 8 环境 / 配置；`03` Step 16 最小切口；`04` §12 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_09_automation_gates.md` |
| 回填位置 | 正式 `05-测试方案.md` §9（Step 15） |
| 停审方式 | 每个 blocking suite 逐项停审；完成跨 suite、artifact/report、redaction 和 P0 自动化缺口审计后进入 Step 10 |

## 2. 本步目标

定义 P0 测试套件在哪条流水线执行、何时触发、失败是否阻断，以及每个 gate / check / report 如何产生可追溯的 planned 输出。脚本路径是实施计划的 planned skeleton，不表示文件已经存在。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 测试层级与失败阻断姿态 |
| `05_test_plan_step_06_cases.md` | `TC-L2M-*` 用例和候选证据族 |
| `05_test_plan_step_07_test_data.md` | `DS-L2M-*` 数据与替身 |
| `05_test_plan_step_08_environment_config.md` | profile、依赖类型和不可用策略 |
| `03-详细设计.md` §13~§15、Step 16 | 配置、依赖、观测、最小切口和脚本命名约束 |
| `04-配置设计.md` §12 | strict validation、no silent fallback、redaction / blocked parity |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 suite 必须进入 PR？ | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`api-worker-entry`。它们覆盖协议、状态、UoW、no-write、配置、依赖和 pre-gate P0 红线。 |
| 哪些 suite 进入 main CI / nightly？ | main CI 增加 `infra-fake-parity`、`job-continuation`、`redaction-boundary`；nightly / operations replay 增加 `replay-recovery`、`projection-readmodel`、`local-smoke`。 |
| 哪些 suite 是 staging / release gate？ | `release-local-smoke`、`release-redline`、`report-generation-audit` 必须作为 P0 release gate；`owner-seam-selected` 只有合同闭合后才是 P1 selected-run，不是当前 P0 必过。 |
| gate / report / check 脚本放在哪里？ | planned gate 脚本放 `scripts/gates/`，静态检查放 `scripts/checks/`，报告生成放 `scripts/reports/`；输出目录不得承载脚本。 |
| 默认 artifact / report 路径是什么？ | 每次 run 使用 `artifacts/test/<run_id>`；人类可读报告使用 `reports/runs/<run_id>`；验收交接初稿使用 `reports/acceptance`。不得使用 `<project>` 子目录或 `latest`。 |
| 每个 gate 是否可传参？ | planned gate 需要支持 `--run-id`、`--artifact-root`、`--config-profile`；默认 root 仍必须是规范路径。具体实现参数留给 07 / 实现仓。 |
| flaky / 超时 / 依赖故障如何处理？ | 不自动重试成 pass。保留失败 artifact、stdout/stderr 和 failure reason；依赖不可用标记 `blocked / not_run`，P0 blocking suite 不得静默跳过。flaky 需隔离、复跑并建立缺陷，不覆盖原始失败。 |
| P0 用例能否只手工执行？ | 只有真实 owner positive lane 因 blocker 暂不可自动化时可保留 blocked / manual observation；双锚、redaction、no-write、replay、dependency 和 VF 红线必须自动化候选。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 没有稳定 suite / gate / artifact 约定 | 重新建立 suite 名、触发器、阻断级别和规范 root |
| 脚本路径与输出目录容易混用 | 规定 `scripts/gates|checks|reports` 与 `artifacts/test`、`reports/runs` 分离 |
| blocked external lane 容易被 CI skip 后误报通过 | gate 必须保留 `blocked / not_run` 原因并阻断相应 positive qualification |
| 证据 ID 可能静态手写 | Step 9 只映射 `EV-CAND-L2M-*`；正式 EV 在 Step 13 从真实 artifact/report 推导 |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| PR 门禁 | 只写“自动化测试” | 明确 5 个快速 blocking suite | P0 红线尽早阻断 |
| 输出路径 | 项目私有 artifacts / reports | 全局规范 root + 固定 run_id | 便于审计和验收消费 |
| 外部联调 | staging smoke 默认成功 | selected-run 条件化、blocked-aware | owner contract 未闭合 |
| 失败处理 | flaky / unavailable 语义不清 | 保留失败原始输出，禁止 silent pass | 防伪证据和误判 |

## 7. 测试设计取舍

| 议题 | 结论 | 取舍 |
|---|---|---|
| 是否将所有用例塞入 PR | 只将快速 P0 红线放 PR；慢速 replay / projection 放 main / nightly | 平衡反馈速度与覆盖 |
| 是否对 blocked lane 自动重试 | 不自动重试为成功；可执行受控重试但结果仍 blocked / not_run | 保持外部 truth 不伪造 |
| 是否让 release gate 依赖真实 Bus / Runtime | 当前不依赖；做 local smoke + negative seam | 上游 contract pending |
| 是否把 report 生成失败降为 warning | 不；report / artifact pairing 是 P0 evidence integrity | 防止无法验收 |

## 8. 结构化中间产物

### 8.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | planned 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `contract-domain-fast` | contracts schema、34 对象组、28 state、factory / policy | PR / main | 协议、对象、状态、错误变更 | P0 blocking | `scripts/gates/run_contract_domain_fast.sh` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `service-flow-fast` | 10 Command、16 Query、UoW、replay、no-write | PR / main | application / flow / Store / error 变更 | P0 blocking | `scripts/gates/run_service_flow_fast.sh` | `.../service-flow-fast/` | `.../service-flow-fast.md` |
| `api-worker-entry` | API、14 Consumer、pre-gate、receipt、Job entry | PR / main | contract / worker / jobs entry 变更 | P0 blocking | `scripts/gates/run_api_worker_entry.sh` | `.../api-worker-entry/` | `.../api-worker-entry.md` |
| `config-redline` | 四 P0 profile、strict validation、slot、non-configurable invariants | PR / main | config / builder / profile 变更 | P0 blocking | `scripts/gates/run_config_redline.sh` | `.../config-redline/` | `.../config-redline.md` |
| `dependency-boundary` | Core-only compile、runtime/event/ref/adapter/fake 分类、24 candidate | PR / main | manifest、module、event candidate、dependency 变更 | P0 blocking | `scripts/gates/run_dependency_boundary.sh` | `.../dependency-boundary/` | `.../dependency-boundary.md` |
| `infra-fake-parity` | Store / UoW / CAS / rollback / adapter unavailable / builder | main / nightly | infra / persistence / adapter 变更 | P0 blocking | `scripts/gates/run_infra_fake_parity.sh` | `.../infra-fake-parity/` | `.../infra-fake-parity.md` |
| `job-continuation` | 5 Job、partial item、report replay、no source repair | main / nightly | jobs / projection / continuation 变更 | P0 blocking | `scripts/gates/run_job_continuation.sh` | `.../job-continuation/` | `.../job-continuation.md` |
| `replay-recovery` | duplicate、same-key conflict、in-flight、commit unknown、rollback failure | nightly / operations-replay | idempotency / recovery 变更 | P0 blocking | `scripts/gates/run_replay_recovery.sh` | `.../replay-recovery/` | `.../replay-recovery.md` |
| `redaction-boundary` | body / secret / high-cardinality / stack trace scan | main / nightly / release | observability / serializer / config 变更 | P0 blocking | `scripts/gates/run_redaction_boundary.sh` | `.../redaction-boundary/` | `.../redaction-boundary.md` |
| `projection-readmodel` | CP07 projection、freshness、outlet safe view、Query no-write | nightly / replay | read model / projection 变更 | P0 blocking | `scripts/gates/run_projection_readmodel.sh` | `.../projection-readmodel/` | `.../projection-readmodel.md` |
| `local-smoke` | C1~C5 member-local最小组合 | nightly / release | release candidate / core boundary 变更 | P0 blocking | `scripts/gates/run_local_smoke.sh` | `.../local-smoke/` | `.../local-smoke.md` |
| `release-redline` | VF-L2M-001~009、dependency、evidence integrity | release gate | release candidate | P0 blocking | `scripts/gates/run_release_redline.sh` | `.../release-redline/` | `.../release-redline.md` |
| `report-generation-audit` | artifact/report pairing、index provenance、redaction check | release gate | report / evidence schema 变更 | P0 blocking | `scripts/gates/run_report_generation_audit.sh` | `.../report-generation-audit/` | `.../report-generation-audit.md` |
| `owner-seam-selected` | host / Runtime / Bus / resolver / image / durable-like positive seam | P1 selected-run | 对应 blocker 全部关闭且明确授权 | non-blocking for P0; blocks selected-run verdict | `scripts/gates/run_owner_seam_selected.sh` | `.../owner-seam-selected/` | `.../owner-seam-selected.md` |

### 8.2 Gate / check / report 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate orchestrator | `--run-id`、`--artifact-root`、`--config-profile`、suite selection | suite results + gate summary | 任一 P0 blocking suite 失败则非零；blocked / not_run 不得变 pass |
| `scripts/checks/check_redaction.sh` | check | artifact / report root、deny list profile | redaction result JSON / log | 泄漏或扫描失败阻断 |
| `scripts/checks/check_dependency_boundary.sh` | check | dependency metadata、candidate inventory | dependency result JSON | 非 Core package、未分类关系或 candidate materialization 阻断 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | run root、suite manifest | pairing result | 缺 `report.json` / stdout / stderr 或路径错阻断 |
| `scripts/checks/check_static_evidence.sh` | check | evidence index / report refs | provenance result | 静态手写 EV 或 `latest` 引用阻断 |
| `scripts/reports/generate_suite_reports.sh` | report | raw suite artifacts | `reports/runs/<run_id>/suites/*.md` | 生成失败阻断 report audit |
| `scripts/reports/generate_evidence_index.sh` | report | suite artifacts + case results | evidence index draft | 只能从真实 artifact 推导，缺来源则失败 |
| `scripts/reports/generate_acceptance_handoff.sh` | report | run reports、open issues、risk inputs | `reports/acceptance/*` 初稿 | 只生成初稿，不写通过 / signoff |
| `scripts/reports/generate_gate_summary.sh` | report | suite report JSON | `gate-results.md` | 失败 suite 仍保留 failure reason |

脚本目前均为 planned skeleton；不存在的脚本、run_id、artifact 或 report 不得在本文件或正式 05 中写成已完成事实。

### 8.3 Suite 到用例 / 证据候选映射

| Suite / Gate | 主要测试切口 | 用例族 | 证据候选族 | 阻断 |
|---|---|---|---|---|
| `contract-domain-fast` | contracts / domain / state | `TC-L2M-CMD-*`（schema部分）、`TC-L2M-COMMON-001/003/006` | `EV-CAND-L2M-CONTRACT-*` | P0 |
| `service-flow-fast` | application flow / Query no-write | `TC-L2M-CMD-*`、`TC-L2M-QRY-*`、`TC-L2M-COMMON-002~005` | `EV-CAND-L2M-SERVICE-*` | P0 |
| `api-worker-entry` | API / Consumer / Job entry | `TC-L2M-CON-*`、`TC-L2M-JOB-*`、`TC-L2M-COMMON-001` | `EV-CAND-L2M-ENTRY-*` | P0 |
| `config-redline` | config / builder / slot | `TC-L2M-COMMON-008`、config cuts | `EV-CAND-L2M-CONFIG-*` | P0 |
| `dependency-boundary` | dependency / candidate | `TC-L2M-EVT-001/002`、architecture cuts | `EV-CAND-L2M-BOUNDARY-*` | P0 |
| `infra-fake-parity` | Store / UoW / adapter | `TC-L2M-COMMON-004~006`、fault cases | `EV-CAND-L2M-INFRA-*` | P0 |
| `job-continuation` | five Job / partial | `TC-L2M-JOB-001~005` | `EV-CAND-L2M-JOB-*` | P0 |
| `replay-recovery` | duplicate / unknown / rollback | `TC-L2M-COMMON-002~005` | `EV-CAND-L2M-REPLAY-*` | P0 |
| `redaction-boundary` | body / secret / telemetry | `TC-L2M-COMMON-007`、NFR security cases | `EV-CAND-L2M-REDACTION-*` | P0 |
| `projection-readmodel` | CP07 / no-write | `TC-L2M-QRY-014~016`、`CON-013/014` | `EV-CAND-L2M-PROJECTION-*` | P0 |
| `local-smoke` | C1~C5 composition | one representative case per C1~C5 + VF negative | `EV-CAND-L2M-SMOKE-*` | P0 |
| `release-redline` | VF / static evidence | `TC-L2M-EVT-*`、redline family | `EV-CAND-L2M-RELEASE-*` | P0 |
| `owner-seam-selected` | external positive seam | blocked-aware candidates only until unblocked | `EV-CAND-L2M-OWNER-*` | P1 / conditional |

### 8.4 CI/CD 门禁图：L2-member

```text
[PR]
  -> contract-domain-fast + service-flow-fast + api-worker-entry
  -> config-redline + dependency-boundary
  -> [any P0 failure => block merge]

[main CI]
  -> PR suites + infra-fake-parity + job-continuation + redaction-boundary
  -> [failure / missing artifact => block main]

[nightly / operations-replay]
  -> replay-recovery + projection-readmodel + local-smoke
  -> [blocked external lane => record blocked, never pass]

[release candidate]
  -> local-smoke + release-redline + report-generation-audit
  -> [P0 redline / evidence integrity failure => block release]

[P1 selected run, only after owner contracts close]
  -> owner-seam-selected
  -> [not_run / blocked => no selected-run verdict]
```

关键说明：

- gate 只裁决 suite / artifact / report 完整性，不替代 `06` 的验收裁决。
- `blocked`、`not_run`、依赖不可用和 script failure 必须保留原始原因。
- 不得使用 `latest`、静态 EV 或项目私有 artifact root。

## 9. 自动化门禁停审记录

| Suite / Gate | 覆盖是否清楚 | 脚本位置正确 | artifact / report 配对 | 失败是否阻断 | 结论 |
|---|---|---|---|---|---|
| PR P0 suites | 是 | 是 | planned 完整 | 是 | `pass` |
| main / nightly suites | 是 | 是 | planned 完整 | 是 | `pass_with_blockers` |
| release redline / report audit | 是 | 是 | 必须配对 | 是 | `pass` |
| owner selected | 条件化 | 是 | 仅合同闭合后 | 不裁决 P0 | `blocked / P1` |

## 10. 跨 suite 门禁 / 证据审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 用例只依赖手工 | `none_for_redlines` | external positive 之外均有 automation candidate |
| suite 重叠导致重复断言 | `controlled` | shared cuts 允许复用，正式 EV 在 Step 13 唯一化 |
| artifact / report root | `compliant` | `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |
| script / output 目录混用 | `prevented` | 三类脚本目录与输出目录分离 |
| blocked / not_run 伪 pass | `prevented` | gate summary 保留 disposition / reason |
| redaction / dependency check | `blocking` | release gate 必须执行 |
| 24 candidate 被 suite 物化 | `none_allowed` | 只由 dependency-boundary 检查 non-materialization |

## 11. 回填草稿（供正式 §9）

P0 自动化套件包括 `contract-domain-fast`、`service-flow-fast`、`api-worker-entry`、`config-redline`、`dependency-boundary`、`infra-fake-parity`、`job-continuation`、`replay-recovery`、`redaction-boundary`、`projection-readmodel`、`local-smoke`、`release-redline` 和 `report-generation-audit`。PR 运行快速协议、服务、入口、配置和依赖套件；main / nightly 增加 fake parity、Job、replay、projection 和 redaction；release candidate 运行 local smoke、VF redline 和报告完整性审计。

planned gate 脚本位于 `scripts/gates/`，静态检查位于 `scripts/checks/`，报告脚本位于 `scripts/reports/`。所有 run 的 raw artifact 使用 `artifacts/test/<run_id>`，可读报告使用 `reports/runs/<run_id>`；失败 suite 仍必须保留 `report.json`、stdout/stderr 和 failure reason。真实 owner positive seam 仅作为合同闭合后的 P1 selected-run，不得用 fake 或 blocked 伪造通过。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 实现仓、测试 runner 和脚本参数 | 脚本落地 | `L2M-DDD-001`；Step 9 只留 planned skeleton |
| artifact / report schema 具体字段 | 证据生成 | Step 13 继续收口 |
| external selected-run contract | P1 suite | `L2M-UP-001~008`；blocked-aware |

- [x] P0 suite、触发器、阻断级别、脚本目录和输出 root 已明确。
- [x] 每个阻断 suite 可回指测试切口、用例族和证据候选族。
- [x] flaky、超时、依赖不可用、redaction、report 缺失和静态证据均有失败策略。
- [x] 未创建脚本、未运行测试、未产生 artifact / report / EV 实例。

**Step 9 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 10。
