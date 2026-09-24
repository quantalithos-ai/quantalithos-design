# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9  
> 回填章节：`05-测试方案.md` §9  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 9 |
| current_module | `automation_gates:suite_pipeline_artifact_report_contract` |
| gate_status | `pass_for_step_10` |
| gate_reason | P0 用例已分配到可重复 suite；PR/main/nightly/controlled/release 边界、阻断级别、逻辑脚本参数、artifact/report 路径、flaky/timeout/dependency 故障处理和跨 suite 证据配对均已收口；未创建或执行任何脚本。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 10 |

本 Step 的 suite、gate、script、artifact、report 和证据 ID 都是计划合同。`scripts/gates/*.sh`、`scripts/checks/*.sh`、`scripts/reports/*.sh` 以及 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 当前均不存在，不能据此声称 CI、测试或 release 已通过。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 4～8 的分层、用例、数据和环境收敛为可以交给实施阶段的自动化门禁合同：

1. 每个 P0 切口有主 suite、触发流水线和阻断级别；
2. 每个阻断 suite 有逻辑 gate/check/report 脚本位置及统一参数；
3. 失败、超时、flaky、依赖不可用和基础设施故障有不混淆的结果分类；
4. artifact 与人类可读 report 成对产生，并能反查 TC/EV 候选和后续 06；
5. release gate 只汇总低层结果，不把 fake、blocked 或未执行升级为通过。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 提供 Contract/Unit、Service、Controlled integration、Entry、Release 分层和失败阻断原则。 |
| `05_test_plan_step_05_traceability_coverage.md` | 提供 CP/FR/BR/AC/NFR 与测试切口的双向映射。 |
| `05_test_plan_step_06_cases.md` | 提供 18 个 CUT、`TC-RUN-*` 和 `EV-CAND-RUN-*` 候选。 |
| `05_test_plan_step_07_test_data.md` | 提供 `DS-RUN-*` 数据集、run namespace、fault profile 和清理要求。 |
| `05_test_plan_step_08_environment_config.md` | 提供四个 profile、环境 ID、依赖类型和 unavailable 分类。 |
| `03-详细设计.md` §8～§15 | 提供 protocol、flow、state、UoW、恢复、配置和观测断言。 |
| `04-配置设计.md` §6、§9～§12 | 提供 strict profile、builder/readiness、redaction、change/rollback 门禁。 |

### 2.3 非目标

- 不选择具体 CI 平台、编程语言、测试框架、shell 解释器或容器技术。
- 不创建脚本、测试代码、fixture、数据库、CI 配置、artifact、report 或证据。
- 不把 `integration-pending`、`product-pending`、`blocked`、`not_run` 或人工 review 当作 P0 自动通过。
- 不把 `latest`、共享目录、project 子目录或静态手写 EV 作为正式证据来源。
- 不给性能、SLO、生产容量或跨仓正向集成设置无 authority 的阈值。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些 suite 必须进 PR？ | Contract/Unit、纯 Service、协议/状态边界、no-write/no-parse/no-event、静态依赖边界和 redaction helper 扫描进入 PR；这些 suite 只依赖 `test-deterministic`。 |
| 哪些 suite 进 main CI？ | PR suite 加上 UoW/幂等/恢复、controlled adapter、entry/worker/job、配置 builder/readiness 和全量 forbidden-field 扫描；P0 失败阻断合并。 |
| 哪些 suite 进 nightly？ | 全部 P0 重复运行、operations replay、故障矩阵、并发/claim/checkpoint、投影 generation 和跨 profile negative；nightly 的环境故障标 `not_run/blocked`，不改写为 pass。 |
| 哪些 suite 是 staging smoke/release gate？ | 未来仅允许固定 `<run_id>` 的最小组合 smoke、profile/config/boundary 汇总和真实 owner seam；当前因 `RUN-UP-*`、`RUN-DDD-*`、`RUN-OPS-*` 保持 planned/blocked。 |
| flaky、超时和依赖故障怎么处理？ | flaky 必须先保留原始失败并进入 quarantine/issue；有限重试只用于分类，不覆盖首个结果；超时为 `timeout`，意外依赖或 harness 崩溃为 `not_run/blocked`，预期 controlled failure 才是该 TC 的断言输入。 |
| 每个阻断 suite 用哪个脚本？ | 规划 `scripts/gates/<gate>.sh`；路径、参数和输出合同先固定，实际脚本待实现仓与 07。 |
| 默认 artifact-root 和参数是什么？ | 每个 gate 接受 `--run-id`、`--artifact-root`、`--config-profile`，默认计划根为 `artifacts/test/<run_id>`；不得省略显式 run id 或回退 `latest`。 |
| report/check 脚本在哪里？ | report 规划在 `scripts/reports/`，静态或安全检查规划在 `scripts/checks/`；生成脚本不能放进报告输出目录。 |
| 哪些 P0 不能自动化？ | 语义 P0 均要求可重复自动化；`local-safe` 的页面可理解性和未来 product-like 跨平台体验只能作为人工补充，不能替代语义 gate，也不关闭 P0。 |
| 所有 suite 是否通过停审？ | 已逐 suite 检查覆盖、参数、阻断级别、artifact/report 配对和失败分类；跨 suite 审计无 unresolved 冲突，但真实执行仍未发生。 |

## 4. 自动化分层与 suite 总表

| Suite ID | suite 名称 | 主要层级 | 覆盖切口 | 触发位置 | 阻断级别 | profile |
|---|---|---|---|---|---|---|
| `S-RUN-CONTRACT` | contract_and_schema | Contract/Unit | CUT-01、10、17、18 | PR、main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-DOMAIN` | state_and_policy_unit | Domain/Unit | CUT-01、02、04、06、07、08、16、18 | PR、main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-SERVICE` | application_flow_service | Application service | CUT-03、04、05、07、09、11、12、13、16 | PR、main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-UOW` | uow_idempotency_recovery | Repository/UoW/Service | CUT-07、11、12、15 | main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-CONTROLLED` | controlled_adapter_integration | semantic controlled integration | CUT-02、03、04、06、07、08、16、17 | main、nightly、未来 controlled | P0 semantic 阻断；真实正向 blocked | `test-deterministic` / `integration-pending` |
| `S-RUN-ENTRY` | entry_dispatch_boundary | Command/Query entry | CUT-09、10、13 | main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-CONSUMER` | consumer_header_first | Worker/Consumer | CUT-10、14、18 | main、nightly | P0 negative 阻断；positive blocked | `test-deterministic` / `integration-pending` |
| `S-RUN-JOB` | job_claim_checkpoint_report | Job/Operations | CUT-07、11、12、15 | main、nightly、operations replay | P0 阻断；owner positive blocked | `test-deterministic` / `integration-pending` |
| `S-RUN-CONFIG` | config_builder_readiness | Config unit/builder | CUT-02、08、10、16 | PR、main、nightly | P0 阻断 | `test-deterministic` |
| `S-RUN-SECURITY` | redaction_dependency_boundary | static/contract scan | CUT-08、17、18 | PR、main、nightly、future release | P0 阻断 | `test-deterministic` |
| `S-RUN-REPLAY` | operations_snapshot_replay | replay/recovery | CUT-07、09、11、12、14、15、17 | nightly、operations replay | P0 evidence candidate；source unavailable blocked | `integration-pending` |
| `S-RUN-E2E` | minimal_selected_run_smoke | future composed smoke | CUT-01～08、16 | future staging/release | 当前 blocked，不计 P0 通过 | `integration-pending` / `product-pending` |

`S-RUN-E2E` 不是低层 suite 的替代品；在任何上游 seam 未闭合时必须输出 `blocked/not_run`，不能用 semantic fake 的结果冒充产品 smoke。

## 5. 流水线与 CI/CD 门禁矩阵

| 流水线/门禁 | 触发 | 必跑 suite | 可选 suite | 通过条件 | 失败处理 |
|---|---|---|---|---|---|
| `G-RUN-PR` | pull request / change set | CONTRACT、DOMAIN、SERVICE、CONFIG、SECURITY | ENTRY | 所有 P0 断言通过；无依赖边界违规；无未分类失败 | 直接阻断；不允许 retry 后覆盖首个失败 |
| `G-RUN-MAIN` | main 合并候选 | PR 全集 + UOW、ENTRY、CONSUMER、JOB、CONTROLLED | REPLAY | P0 semantic suites 全部 `pass`；negative blocked 语义准确 | 阻断合并/发布候选；真实 positive blocked 单独记录 |
| `G-RUN-NIGHTLY` | 定时或手动固定 run id | MAIN 全集 + REPLAY、并发、故障矩阵 | E2E（若依赖可用） | 重复性、隔离、恢复和 report 完整；flaky 不得静默通过 | 失败建 issue；`not_run/blocked` 不计通过 |
| `G-RUN-CONTROLLED` | 获得某个 upstream slot authority 后 | CONTROLLED、ENTRY、CONSUMER、JOB、REPLAY | E2E | 每个 slot 的 contract 与 unavailable/positive 证据分离 | slot 失败阻断该 slot；不影响未授权 slot 的 blocked 状态 |
| `G-RUN-STAGING` | 未来候选产品环境 | 固定最小 E2E + SECURITY + report completeness | full replay | 仅在 approved environment、fixed run id 和依赖闭合时执行 | 当前 `blocked`；不生成 release evidence |
| `G-RUN-RELEASE` | 未来 release candidate | staging 结果、boundary/redaction、artifact/report completeness | capacity/SLO（需 authority） | 06/治理明确的全部 gate 和 evidence 满足 | 当前未定义 verdict；不能凭 profile 名称放行 |

### 5.1 自动化门禁图: L5-runner suite 到流水线

```text
[change]
   |
   v
[G-RUN-PR] --fail--> [blocked]
   |
   v
[G-RUN-MAIN: semantic P0]
   |\
   | \-- dependency fault --> [not_run/blocked]
   v
[G-RUN-NIGHTLY: replay + fault + repeatability]
   |
   +--> [G-RUN-CONTROLLED] --slot not ready--> [blocked]
   |
   +--> [future G-RUN-STAGING] --> [future G-RUN-RELEASE]
```

关键说明:

- 图表达 suite 的门禁顺序和故障分类，不表达某个 CI 产品、agent 或部署拓扑。
- `not_run/blocked` 是事实状态，不可被重试、fake fallback 或 `latest` 改写为通过。
- release gate 只消费固定 `<run_id>` 的真实 artifact/report 关系。

## 6. 逻辑脚本与参数合同

| 逻辑脚本路径 | 类型 | 责任 | 必选输入 | 计划输出 | 失败分类 |
|---|---|---|---|---|---|
| `scripts/gates/run-pr.sh` | gate | 运行 PR 必跑 suite | `--run-id`、`--artifact-root`、`--config-profile` | suite 结果索引和退出状态 | assertion / timeout / infra |
| `scripts/gates/run-main.sh` | gate | 运行 main P0 semantic 集 | 同上 + suite selection | 每 suite `report.json` 引用 | assertion / dependency / infra |
| `scripts/gates/run-nightly.sh` | gate | 运行 replay、故障和重复性集 | 同上 + deterministic seed/ref | replay/fault summary | flaky / timeout / blocked |
| `scripts/gates/run-controlled.sh` | gate | 运行指定 controlled slot | 同上 + explicit slot ref | slot contract result | unavailable / unsupported / assertion |
| `scripts/gates/run-release.sh` | gate | 未来汇总 release 条件 | fixed run id + approved profile | gate summary | blocked until authority |
| `scripts/checks/check-boundary.sh` | check | 扫描私有依赖、绕过 SDK、技术泄漏和 event-zero | source/build manifest（实现阶段） | machine-readable findings | violation = block |
| `scripts/checks/check-redaction.sh` | check | 扫描 artifact/report forbidden fields | artifact root、report root | redaction report | finding = block |
| `scripts/checks/check-evidence-links.sh` | check | 校验 TC→suite→artifact→report 关系 | evidence index、fixed run id | link report | orphan/mismatch = block |
| `scripts/reports/render-suite-report.sh` | report | 将 suite artifact 汇总成人读 report | artifact root、suite id | `reports/runs/<run_id>/suites/<suite>.md` | missing artifact = incomplete |
| `scripts/reports/render-run-summary.sh` | report | 生成固定 run summary/gate results | all suite reports | `summary.md`、`gate-results.md` | incomplete/blocked |

这些只是路径合同。实现阶段若需改名，必须同步 07、项目台账和正式 05，不得在报告目录临时放脚本。

### 6.1 统一参数与输出约束

| 参数/约束 | 规则 |
|---|---|
| `--run-id` | 必须显式、不可为 `latest`；用于所有 artifact/report/evidence 关联。 |
| `--artifact-root` | 默认计划为 `artifacts/test/<run_id>`；不得拼接项目子目录。 |
| `--config-profile` | 只能是四个正式 profile；未知值 fail-fast。 |
| `--suite` | 只允许已登记 suite；未知 suite 不得静默跳过。 |
| exit status | 逻辑结果与进程失败分开记录；`pass/fail/blocked/not_run/timeout/flaky` 必须进入 report。 |
| stdout/stderr | 原始日志进入 run-scoped artifact；必须经 redaction scan 后才可进入 report。 |
| 清理 | gate 结束执行 run namespace 清理；清理失败单独报告，不改写业务结果。 |

## 7. Suite 到切口、用例和证据候选映射

| Suite | 测试切口 | 用例范围 | EV 候选范围 | artifact | report | 阻断 |
|---|---|---|---|---|---|---|
| CONTRACT | CUT-01/10/17/18 | `TC-RUN-CTX-*`、`TC-RUN-CON-*`、`TC-RUN-OBS-*`、`TC-RUN-BND-*` | 对应 `EV-CAND-RUN-CTX/CON/OBS/BND-*` | `artifacts/test/<run_id>/suites/S-RUN-CONTRACT/` | `reports/runs/<run_id>/suites/S-RUN-CONTRACT.md` | P0 |
| DOMAIN | CUT-01/02/04/06/07/08/16/18 | `TC-RUN-SEL/ACQ/INT/RES/REC/PRE/CFG/BND-*` | 对应候选族 | `.../S-RUN-DOMAIN/` | `.../S-RUN-DOMAIN.md` | P0 |
| SERVICE | CUT-03/04/05/07/09/11/12/13/16 | `TC-RUN-REQ/CTL/OWN/QRY/IDM/UOW/ENT/CFG-*` | 对应候选族 | `.../S-RUN-SERVICE/` | `.../S-RUN-SERVICE.md` | P0 |
| UOW | CUT-07/11/12/15 | `TC-RUN-REC/IDM/UOW/JOB-*` | recovery/idempotency/UoW/job candidates | `.../S-RUN-UOW/` | `.../S-RUN-UOW.md` | P0 |
| CONTROLLED | CUT-02/03/04/06/07/08/16/17 | corresponding controlled cases | corresponding candidates | `.../S-RUN-CONTROLLED/` | `.../S-RUN-CONTROLLED.md` | P0 semantic |
| ENTRY/CONSUMER/JOB | CUT-09/10/13/14/15/18 | `TC-RUN-ENT/CNS/JOB/BND-*` | entry/consumer/job/boundary candidates | separate suite dirs | matching suite reports | P0 |
| CONFIG/SECURITY | CUT-08/16/17/18 | `TC-RUN-CFG/PRE/OBS/BND-*` | config/presentation/observability candidates | separate suite dirs | matching suite reports | P0 |
| REPLAY | CUT-07/09/11/12/14/15/17 | replayable cases only | candidates become EV only after real artifact/report | `.../S-RUN-REPLAY/` | matching replay report | blocked if source absent |
| E2E | selected future subset | fixed smoke cases only | future EV after approved run | `.../S-RUN-E2E/` | matching E2E report | currently blocked |

The mapping is intentionally family-level in this Step; Step 13 must derive final EV index from actual suite artifact/report relationships rather than this static table.

## 8. Failure、flaky、timeout 与依赖不可用处理

| 结果类别 | 识别条件 | 是否重试 | 是否计 suite 通过 | 必须保留 |
|---|---|---:|---:|---|
| `pass` | 断言、redaction、boundary 和 cleanup 均满足 | 不需要 | 是 | assertion summary、call/write journal 摘要 |
| `assertion_failed` | 业务/契约断言失败 | 仅按 gate policy 可复现一次；首失败不可覆盖 | 否 | 首失败日志、输入 refs、diff、环境 profile |
| `flaky_suspected` | 同一固定数据重复结果不稳定 | 允许诊断重跑，不得隐藏原结果 | 否，直到 quarantine 解除 | 每次尝试、seed、timing、原因 issue |
| `timeout` | suite 或单 case 超过已获 authority 的时间预算 | 不自动升格 | 否 | timeout marker、最后阶段、清理结果 |
| `expected_controlled_failure` | TC 明确注入 unavailable/unsupported/unknown | 不需要 | 仅该负向 TC 可通过 | fault profile、typed outcome、零副作用断言 |
| `dependency_unavailable` | 未授权或外部 seam 不存在 | 不用 fake fallback | 否；suite `blocked/not_run` | blocker ID、slot、未执行原因 |
| `harness_infra_failure` | runner、fixture、clock/id/digest、存储或脚本本身崩溃 | 可修复后重新开始新 run | 否 | infrastructure diagnosis、未执行清单 |
| `redaction_failure` | raw secret/body/path/URL/PID/port/stack 出现或扫描器失效 | 不重试掩盖 | 否，安全阻断 | quarantined raw artifact 位置（受控）、scan result、issue |
| `cleanup_failure` | run namespace 或 journal 未清理 | 不改写业务断言 | suite incomplete/blocked | cleanup journal、残留引用、后续处置 |

同一 `<run_id>` 不得通过重跑覆盖历史结果；重跑必须生成新的 run id，并在报告中显式链接 predecessor。

## 9. P0 自动化缺口与人工补充

| 场景 | 自动化状态 | 人工补充 | 边界 |
|---|---|---|---|
| 18 个语义 P0 切口 | 规划为自动化或 controlled-fake | 无需手工替代 | 实现仓存在后必须实现对应 suite/gate |
| `local-safe` 页面文案/可理解性 | 自动化 semantic assertions + 人工 UX review | 记录 review notes，不产生 owner truth | 人工 review 不能关闭契约 gate |
| `product-pending` 跨平台体验 | 当前 blocked | 未来由产品/平台 authority 定义 | 当前不产生 release evidence |
| release/验收叙事审查 | 自动 report 初稿 + 人/Agent 审查 | 补充风险接受、blocker 和上下文 | 不能手写静态 EV 冒充 artifact |

## 10. Suite 停审记录

| Suite / Gate | 覆盖审查 | 脚本/参数 | artifact/report 配对 | 失败处理 | 结论 |
|---|---|---|---|---|---|
| CONTRACT/DOMAIN | 18 个切口的 schema/state/no-write 红线已映射 | `run-pr.sh` 合同完整 | 固定 run-scoped 路径 | assertion/violation 阻断 | 通过（设计层） |
| SERVICE/UOW | flow、幂等、UoW、Unknown、RecoveryCase 已映射 | `run-main.sh` 合同完整 | suite report 必须来自 artifact | timeout/infra 不得 pass | 通过（设计层） |
| ENTRY/CONSUMER/JOB | entry/header-first/claim/checkpoint/report 已映射 | main/nightly 参数完整 | 每 suite 独立目录 | positive seam blocked 保真 | 通过（设计层） |
| CONFIG/SECURITY | strict profile、redaction、依赖边界已映射 | check scripts 位置正确 | scan report 成对 | finding 直接阻断 | 通过（设计层） |
| REPLAY | safe snapshot/report replay 已映射 | nightly/replay 参数完整 | source 缺失显式 blocked | 不改变 owner cursor | 通过（设计层） |
| E2E/RELEASE | 仅 future composed smoke | 仅保留 planned path | 无 run 不生成证据 | 当前 blocked | 通过（边界层） |

## 11. 跨 suite 门禁与证据审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 每个 P0 切口至少有一个自动化主 suite | 通过 | 18/18；见 §7。 |
| P0 是否只依赖手工测试 | 无 | 页面/UX 人工仅为补充。 |
| 阻断 suite 是否有明确触发和级别 | 通过 | PR/main/nightly/controlled 分工清楚。 |
| gate/check/report 脚本目录是否正确 | 通过（计划） | gate/check/report 分别位于 `scripts/gates`、`scripts/checks`、`scripts/reports`；文件尚未创建。 |
| artifact/report 是否固定且不含 project/latest | 通过（计划） | 使用 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`。 |
| flaky/timeout/dependency 是否会伪造 pass | 无 | 保留原始结果并分类。 |
| EV 是否可能由静态表直接生成 | 无 | Step 13 必须从真实 artifact/report 关系推导。 |
| release gate 是否越过 upstream blocker | 无 | `S-RUN-E2E`/release 当前 blocked。 |
| suite 重叠与证据 ID 冲突 | 无 unresolved | 家族映射可重叠，但最终 EV 由 run-scoped index 去重。 |

## 12. 结构化回填草稿

正式 §9 应收录：suite 总表、PR/main/nightly/controlled/staging/release 门禁矩阵、自动化门禁图、逻辑脚本与参数合同、suite→CUT/TC/EV 候选映射、故障分类和 P0 自动化边界。正文必须说明脚本、artifact、report 和执行结果均待实施/执行阶段，不得写成已通过。

## 13. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓、测试 runner、CI 平台和脚本 shell (`RUN-DDD-001/002`) | 无法创建真实命令和 job | 保留逻辑路径及参数合同。 |
| durable store/cache 与重启语义 (`RUN-DDD-003`) | UOW/replay 只能验证 semantic fake | 标记 crash/restart parity blocked。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK seam (`RUN-UP-001~008`) | controlled positive、staging/release 无法运行 | 只保留 negative/blocked suite。 |
| telemetry/SLO 与 GRC (`RUN-OPS-001~002`) | 不得设 release 性能阈值或 verdict | 留待 Step 10/13/06。 |

## 14. Step 9 进入下一步门禁

- [x] 每个 P0 切口有主 suite、触发位置、阻断级别和 profile。
- [x] PR/main/nightly/controlled/future release 边界明确。
- [x] gate/check/report 的逻辑路径、参数、artifact/report 输出合同明确。
- [x] flaky、timeout、预期 controlled failure、依赖不可用和基础设施故障分类明确。
- [x] suite→CUT→TC→EV 候选映射可反查，且静态表不冒充真实证据。
- [x] P0 不依赖手工；人工仅补充 UX/验收审查。
- [ ] 脚本、CI job、artifact、report、测试执行和 readiness：未创建/未执行，不作为本 Step 条件。

Step 9 完成，允许进入 Step 10；正式 `05-测试方案.md` 仍不可写。
