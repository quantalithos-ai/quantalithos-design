# L2-member-images 05 测试方案 Step 9：自动化与 CI/CD 门禁

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填位置：正式 `05-测试方案.md` 第 9 章
> 执行边界：本文件只规划 future suite、脚本名和输出路径；未创建脚本、CI、run、artifact、report 或测试结果。

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 将 P0/P1/P2 切口映射为自动化套件、触发点、阻断规则和固定证据路径，且不伪造 CI 已存在或已经运行。 |
| 本步输入 | Step 1~8；03 §15~16；04 Step 12；测试方案书写规范 §4.6、§5.9、§5.13。 |
| 本步输出 | 自动化门禁图、suite 矩阵、未授权/blocked lane、artifact/report 命名纪律。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 哪些测试进入 PR 门禁？ | contracts/domain、query no-write、command/job zero-effect、entry marker、strict config、redaction/dependency 静态扫描；全部仍是 future planned suite。 |
| 哪些进入 CI main / nightly？ | controlled store/UoW/failure injection、full state matrix、concurrency/recovery negative seam；nightly 不是 scheduler、也不等 build sweep 已执行。 |
| staging/release gate 测什么？ | 只在 owner/环境闭合后做 local composition、controlled adapter smoke、evidence aggregation；当前 P1/P2 保持 blocked。 |
| 输出如何固定？ | gate 写入 `artifacts/test/<run_id>/...`，报告脚本生成 `reports/runs/<run_id>/...` 和 `reports/acceptance/...`；`<run_id>` 是未来运行占位符，不能填实际值或 `latest`。 |
| 什么失败必须阻断？ | P0 assertion 失败、redaction/dependency violation、strict config fail-open、Query write、inbound accepted input、outbound nonzero 一律阻断；环境/owner 未闭合产生 blocked，不得伪为 pass。 |

## 2. 自动化门禁图

#### 自动化门禁图: planned L2-member-images 验证流水线

```text
PR / local check
  -> contracts + domain + query-no-write + zero-effect + config + redaction scan
  -> artifacts/test/<run_id>/suites/pr-core/
                  |
CI main
  -> repository/UoW + projection + entry + dependency scan
  -> artifacts/test/<run_id>/suites/ci-integration/
                  |
Nightly planned lane
  -> state-matrix + concurrency + unavailable/recovery negative seam
  -> artifacts/test/<run_id>/suites/nightly-risk/
                  |
Owner-closed staging/release only
  -> controlled-adapter smoke + evidence aggregation
  -> reports/runs/<run_id>/ and reports/acceptance/
```

关键说明:

- 图是测试设计，不表示 CI workflow、scheduler、执行节点、真实环境或 run 已存在。
- `nightly-risk` 不激活 `RunNightlyBuildSweep` 的正向 job；它只运行未来测试套件或记录 blocked。
- 外部 owner 未闭合时，staging/release lane 只允许报告 blocked/pending，不能产出 readiness。

## 3. 套件与门禁矩阵

| 套件（规划） | 覆盖范围 | 执行位置/触发 | 阻断级别 | 规划脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|
| `pr-contract-domain` | typed refs、DTO、guard、19 state matrix、static/live | PR/local | P0 阻断 | `scripts/gates/check_contract_domain.sh` | `artifacts/test/<run_id>/suites/pr-contract-domain/` | `reports/runs/<run_id>/suites/pr-contract-domain.md` |
| `pr-boundary-no-write` | 10 Query、10 Command/6 Job stop、2 inbound、0 outbound | PR/local | P0 阻断 | `scripts/gates/check_boundary_no_write.sh` | `artifacts/test/<run_id>/suites/pr-boundary-no-write/` | `reports/runs/<run_id>/suites/pr-boundary-no-write.md` |
| `pr-config-security` | strict JSON、source priority、profile/fake、redaction | PR/local | P0 阻断 | `scripts/gates/check_config_security.sh` | `artifacts/test/<run_id>/suites/pr-config-security/` | `reports/runs/<run_id>/suites/pr-config-security.md` |
| `ci-integration-seams` | repository/version/UoW/projection/adapter failure | CI main | P0 阻断；P1 blocked record | `scripts/gates/run_integration_seams.sh` | `artifacts/test/<run_id>/suites/ci-integration-seams/` | `reports/runs/<run_id>/suites/ci-integration-seams.md` |
| `ci-entry-contracts` | api/worker/jobs logical entry mappers | CI main | P0 阻断 | `scripts/gates/check_entry_contracts.sh` | `artifacts/test/<run_id>/suites/ci-entry-contracts/` | `reports/runs/<run_id>/suites/ci-entry-contracts.md` |
| `ci-dependency-redaction` | sibling dependency cut、forbidden body/secret scan | CI main | P0 veto | `scripts/gates/check_dependency_redaction.sh` | `artifacts/test/<run_id>/suites/ci-dependency-redaction/` | `reports/runs/<run_id>/suites/ci-dependency-redaction.md` |
| `nightly-risk` | conflict/commit-unknown/Unavailable/recovery negative seam | planned nightly | P0 negative assertions；blocked recovery noted | `scripts/gates/run_risk_matrix.sh` | `artifacts/test/<run_id>/suites/nightly-risk/` | `reports/runs/<run_id>/suites/nightly-risk.md` |
| `release-controlled-smoke` | owner-closed controlled adapter/local composition | staging/release only after reopen | P1/P2; no current pass | `scripts/gates/run_controlled_smoke.sh` | `artifacts/test/<run_id>/suites/release-controlled-smoke/` | `reports/runs/<run_id>/suites/release-controlled-smoke.md` |

## 3.1 Gate / report / check 脚本输入输出契约（规划）

| 脚本 | 类型 | 必需输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/check_contract_domain.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile` | `pr-contract-domain/report.json`、case files、脱敏 stdout/stderr | P0 assertion 非零即阻断；保留 failure reason |
| `scripts/gates/check_boundary_no_write.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile` | `pr-boundary-no-write/report.json` | 任一 write / accepted inbound / outbound non-zero 即阻断 |
| `scripts/gates/check_config_security.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile` | `pr-config-security/report.json` | strict parse、redaction 或 fake isolation 失败即阻断 |
| `scripts/gates/run_integration_seams.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、受控 seam 选择 | `ci-integration-seams/report.json` | P0 failure 阻断；P1 owner gap 记录 blocked |
| `scripts/gates/check_entry_contracts.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile` | `ci-entry-contracts/report.json` | DTO/marker/action boundary failure 阻断 |
| `scripts/gates/check_dependency_redaction.sh` | gate/check wrapper | `--run-id`、`--artifact-root`、`--config-profile` | dependency/redaction reports | sibling compile dependency 或 forbidden output 即 veto 阻断 |
| `scripts/gates/run_risk_matrix.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile` | `nightly-risk/report.json` | assertion failure 失败；PF/owner gap 只能 blocked |
| `scripts/gates/run_controlled_smoke.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、approved owner refs | `release-controlled-smoke/report.json` | 未获批准或环境缺失不得进入 positive lane |
| `scripts/reports/generate_test_reports.sh` | report | `--run-id`、`--artifact-root`、`--report-root` | `reports/runs/<run_id>/summary.md` 与 suite reports | artifact 缺失/生成错误返回非零，不覆盖原结果 |
| `scripts/reports/generate_evidence_index.sh` | report | `--run-id`、`--artifact-root`、`--report-root` | `reports/runs/<run_id>/evidence-index.md` | 只能从真实 artifact/report pair 推导；缺配对即失败 |
| `scripts/reports/generate_gate_summary.sh` | report | `--run-id`、`--report-root` | `reports/runs/<run_id>/gate-results.md` | 不得把 blocked/failed 改写为 pass |
| `scripts/checks/check_redaction.sh` | check | `--run-id`、`--artifact-root`、`--report-root` | `reports/runs/<run_id>/redaction-check.md` | raw secret/body/full sensitive ref 发现即阻断 |
| `scripts/checks/check_dependency_boundary.sh` | check | `--run-id`、依赖元数据、`--artifact-root` | dependency boundary report | 非允许的 compile dependency 即阻断 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | `--run-id`、`--artifact-root`、`--report-root` | report audit | blocking suite 缺 raw/report pair 即阻断 |
| `scripts/checks/check_no_static_evidence.sh` | check | `--run-id`、reports/evidence index | static-evidence audit | 静态文件宣告 EV/VETO pass 即阻断 |

所有脚本路径均为 planned path；本文件不创建脚本、CI workflow、artifact 或 report 目录。

## 3.2 Suite → 测试切口 → TC → EV → 输出映射

| Suite | 测试切口 | 规划 TC | 规划 EV | artifact 输出 | report 输出 | 阻断级别 |
|---|---|---|---|---|---|---|
| `pr-contract-domain` | contracts/domain/state | `TC-CMD-001~003`、`TC-STATE-001~019` | `EV-UNIT-001` | `artifacts/test/<run_id>/suites/pr-contract-domain/` | `reports/runs/<run_id>/suites/pr-contract-domain.md` | P0 |
| `pr-boundary-no-write` | Command/Query/inbound/outbound boundary | `TC-CMD-004~010`、`TC-QUERY-001~010`、`TC-IN-001~002`、`TC-EVENT-001`、`TC-SEC-002` | `EV-SVC-001`、`EV-ENTRY-001`、`EV-GATE-001` | `artifacts/test/<run_id>/suites/pr-boundary-no-write/` | `reports/runs/<run_id>/suites/pr-boundary-no-write.md` | P0 |
| `pr-config-security` | config/profile/redaction | `TC-CONFIG-001~005`、`TC-SEC-001`、`TC-OBS-001` | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001` | `artifacts/test/<run_id>/suites/pr-config-security/` | `reports/runs/<run_id>/suites/pr-config-security.md` | P0 |
| `ci-integration-seams` | UoW/version/projection/adapter | `TC-CON-003~005`、`TC-STATE-008~011` | `EV-INT-001` | `artifacts/test/<run_id>/suites/ci-integration-seams/` | `reports/runs/<run_id>/suites/ci-integration-seams.md` | P0/P1 blocked |
| `ci-entry-contracts` | API/worker/job logical entry | `TC-IN-001~002`、`TC-JOB-001~006`、`TC-OBS-002` | `EV-ENTRY-001`、`EV-OBS-001` | `artifacts/test/<run_id>/suites/ci-entry-contracts/` | `reports/runs/<run_id>/suites/ci-entry-contracts.md` | P0 |
| `ci-dependency-redaction` | dependency/forbidden output | `TC-DEP-001`、`TC-SEC-001~002`、`TC-EVENT-001` | `EV-GATE-001`、`EV-OBS-001` | `artifacts/test/<run_id>/suites/ci-dependency-redaction/` | `reports/runs/<run_id>/suites/ci-dependency-redaction.md` | P0 veto |
| `nightly-risk` | concurrency/recovery/unknown | `TC-CON-001~005`、`TC-REC-001`、`TC-PERF-001` | `EV-REC-001`、`EV-PERF-001` | `artifacts/test/<run_id>/suites/nightly-risk/` | `reports/runs/<run_id>/suites/nightly-risk.md` | P0 negative / blocked |
| `release-controlled-smoke` | owner-closed controlled seam | future reopened TC only | future EV family only | `artifacts/test/<run_id>/suites/release-controlled-smoke/` | `reports/runs/<run_id>/suites/release-controlled-smoke.md` | P1/P2 |

## 3.3 阻断套件停审与跨套件审计

| Suite / Gate | 覆盖与停审检查 | 结论 |
|---|---|---|
| `pr-contract-domain` | 每个 state/typed-ref TC 有设计来源；不使用旧能力型编号 | planned pass；无执行结果 |
| `pr-boundary-no-write` | Query、Command/Job stop、inbound marker、outbound zero 均有 spy/no-effect 断言 | planned pass；B01/B02 保持 blocker |
| `pr-config-security` | 21 key、profile、source priority、startup-only、redaction 有固定输入输出 | planned pass；不绑定 provider |
| `ci-integration-seams` | UoW/version/append-only 与 partial failure 有 fault seam；PF 只 blocked | planned pass_with_blocker |
| `ci-entry-contracts` | 2 inbound / 6 Job 的 logical mapping 可反查，未添加 transport | planned pass |
| `ci-dependency-redaction` | dependency、raw output、zero outbound scan 成为 veto gate | planned pass |
| `nightly-risk` | `blocked` 与 `failed` 分开；无 scheduler 或 real run 假设 | planned pass_with_blocker |
| `release-controlled-smoke` | owner/环境未闭合不得进入正向门禁 | planned blocked |

| 跨 suite 审计项 | 结论 | 处置 |
|---|---|---|
| P0 TC 是否都有 suite 与 EV family | 通过（planned） | 以本节映射为准；未来执行产生具体 run item。 |
| suite 是否重复改变 truth | 不允许 | release smoke 只组合验证；底层 no-write / state suite 保持首要断言。 |
| artifact/report 是否一一配对 | 通过（规划） | `check_artifact_report_pairing.sh` 负责阻断。 |
| blocked/failed 是否可区分 | 通过（规划） | owner/PF/environment 为 blocked；断言失败为 failed。 |
| EV 是否可能静态伪造 | 不允许 | `check_no_static_evidence.sh`，EV 实例须由固定 run artifact 推导。 |
| redaction 是否覆盖 raw artifact 与 report | 通过（规划） | `check_redaction.sh` 扫描两侧；失败即 veto。 |

## 4. 门禁判定与失败处理

| 判定 | 动作 | 禁止动作 |
|---|---|---|
| P0 test assertion 失败 | suite failure，保留脱敏 stdout/stderr、failure reason 和 case mapping | 降级为 warning、跳过 TC、以 manual pass 覆盖 |
| blocker/owner gap 触发 | 标记 `blocked`/`pending`，记录对应 DDD/MI/Q 编号 | 把 fake、ACK、tag、cache 写为 success |
| 脱敏/依赖扫描失败 | veto candidate，阻断后续 gate | 输出 raw secret/body、临时添加 sibling Cargo dependency |
| 证据路径不可写/报告生成失败 | gate failure，保留原因但不伪造 evidence | 使用 `latest`、随机未映射路径或手填报告 |
| P1/P2 环境缺失 | 不进入 positive lane，报告 environment blocked | 宣称 staging/production 通过 |

## 5. 改动前后对比与设计取舍

旧材料可能把 CI、publish log 或具体产品结果写为既有事实。本轮只规划 product-neutral scripts 和固定输出结构；采用“P0 阻断、P1/P2 明确 blocked、报告不等验收”的策略，拒绝把测试脚本命名当作实现或执行证据。

## 6. 结构化中间产物与回填草稿

正式 §9 回填门禁图、suite 矩阵、脚本输入输出契约、suite→TC→EV 映射和跨 suite 审计。未来创建脚本、CI 配置、实际 `<run_id>` 或报告目录属于 07 后的实施/执行阶段，须受设计、实现和验收门禁控制。

## 7. 待确认事项

| 事项 | 当前处置 |
|---|---|
| 实现仓、测试框架、CI provider、执行命令 | 未核验；保持 planned script path，不创建文件 |
| real-like/staging 环境与 owner adapters | P1/P2 blocked，待各 owner 正式闭合 |
| performance/容量阈值 | 不伪造数值，留 Step 10 和后续 policy/运维确认 |

## 8. 进入下一步条件

- 每个 P0 测试切口有至少一个 planned suite、触发点、阻断级别和固定路径；
- `blocked` 与 `failed` 语义分离；
- 没有实现、run、report、evidence 或 readiness 被伪造；可进入 Step 10。
