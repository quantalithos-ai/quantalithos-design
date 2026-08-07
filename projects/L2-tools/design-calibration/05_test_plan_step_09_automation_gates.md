# L2-tools 05 测试方案 · Step 9 自动化与 CI/CD 门禁

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 9「设计自动化与 CI/CD 门禁」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §9
>
> 直接输入：`05_test_plan_step_04_strategy_layers.md`、`05_test_plan_step_06_cases.md`、
> `05_test_plan_step_08_environment_config.md`。本文件只定义 planned 自动化契约，不创建脚本、
> pipeline、run、artifact、report、evidence alias 或测试结果。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 9 / 设计自动化与 CI/CD 门禁 |
| 状态 | `accepted_for_step_09 / proceed_to_step_10` |
| 当前模块 | `automation_and_ci_cd_gates` |
| 本步结论 | P0 case family 已分配唯一主 suite；PR/main/nightly/integration/release 条件门禁、脚本接口和 artifact/report 规划闭合。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 10 专项测试与非功能验证。 |

### 1.1 Step 内计划

- [x] 固定 suite identity、主 oracle owner 和运行 profile。
- [x] 固定 PR、main、nightly、integration-like、release 和 conditional-provider gate。
- [x] 固定 `scripts/gates`、`scripts/checks`、`scripts/reports` planned 接口。
- [x] 固定 `--run-id`、`--artifact-root`、`--config-profile` 公共参数与禁止 `latest`。
- [x] 建立 suite 到 TC、candidate EV、artifact、report 的映射。
- [x] 完成单 suite 停审和跨 suite/证据审计。

## 2. 本步输入与 SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 suite 进入 PR？ | `static-boundary`、`contract-domain`、`application-core`、`query-purity`、`config-validator`；均使用 `ci-test`，失败阻断。 |
| 哪些 suite 进入 main CI？ | PR 全集加 `entry-worker-job`、`transaction-concurrency`、`config-assembly`、`observability-redaction`、`local-closure`；P0 失败阻断。 |
| 哪些 suite 进入 nightly？ | main 全集加确定性高组合并发、unknown/recovery、fake parity、全量 NC/VETO 和受控 event replay；失败阻断下一次 release candidate，不用重试掩盖失败。 |
| 哪些 suite 进入 integration/release？ | integration 以独立 `integration-like` run 执行 `controlled-seam`；release 以同一 `ci-test` run 执行 11 个 P0 semantic suite、`release-local-smoke` aggregate 和 11 checks。只有 `conditional-provider` 受 owner closure 条件启用，当前正向为 `blocked_dependency`。 |
| flaky、timeout、依赖故障如何处理？ | deterministic failure 为 fail；不稳定结果为 `not_evaluated`/缺陷，禁止 retry-to-pass；开放合同为 `blocked_dependency`；已配置依赖故障为 typed unavailable；unknown 保持 unknown/manual。 |
| Gate 参数和输出如何固定？ | 每个 gate 必须接受 `--run-id`、`--artifact-root`、`--config-profile`，默认 artifact root 为 `artifacts/test/<run_id>`；report 位于 `reports/runs/<run_id>`；禁止 `latest`。 |
| 哪些 P0 不能自动化？ | 没有已知 P0 语义用例只能人工执行。人工/Agent 只审查报告解释、风险接受和外部 owner closure，不能替代 TC 执行。 |

## 3. 自动化设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 一个 `all-tests` gate 覆盖所有风险 | 拒绝 | 无法定位首要 oracle、profile、blocked dependency 和 artifact 来源。 |
| 每个 TC 一个独立 shell script | 拒绝 | 产生大量重复脚本；TC 应由 suite manifest/过滤器调度。 |
| 按风险/层级建立稳定 suite，gate 组合 suite | 采用 | 既保持 TC identity，又能独立阻断、留证和回归。 |
| 失败自动重试直到通过 | 拒绝 | 会掩盖并发、unknown、外部副作用和 flaky 缺陷。 |
| 静态 evidence index 直接作为通过证据 | 拒绝 | EV 必须从真实 suite artifact/report 推导；静态映射只是计划。 |
| release gate 使用 `latest` | 拒绝 | 不可审计，无法绑定固定运行上下文。 |

## 4. Suite registry

| Suite ID | 首要 oracle / 覆盖 family | 默认 profile | 主执行位置 | 阻断级别 | 失败语义 |
|---|---|---|---|---|---|
| `static-boundary` | module/dependency/public protocol inventory、`VETO-001~013` 的静态可判定部分 | `ci-test` | PR/main/release check | P0 blocking | forbidden dependency/name/field/historical contract 任一命中即 fail |
| `contract-domain` | `FOUNDATION-001~018`、`STATE-001~012` 的 pure/enum/invariant 分支 | `ci-test` | PR/main | P0 blocking | typed field/state/safety/digest/redaction mismatch 即 fail |
| `application-core` | `CONTRACT-001~008`、`BIND-001~008`、`INV-001~008`、`PRE-001~010`、`OUTCOME-001~010`、`HANDOFF-001~008` | `ci-test` | PR/main/nightly | P0 blocking | flow/UoW/phase/pair/replay/owner mismatch 即 fail；正向外部条件保持 blocked |
| `query-purity` | `QUERY-001~011`、foundation/query zero-write probes | `ci-test` | PR/main/nightly | P0 blocking | 任一 UoW/write/refresh/repair/external Port call 非零即 fail |
| `entry-worker-job` | `CONSUMER-001~005`、`CONT-001~004`、`JOB-001~004`、entry metadata/version/receipt | `ci-test` | main/nightly | P0 blocking | envelope/source/claim/receipt/bounded report/registration mismatch 即 fail |
| `transaction-concurrency` | `TX-001~010`、`CONC-001~023`、`ERR-001~012` 及 state race 分支 | `ci-test` | main/nightly | P0 blocking | partial write、wrong winner、blind retry、unknown collapse 或 late overwrite 即 fail |
| `config-validator` | `CFG-001/007` pure baseline、`CFG-T-001~006/009/011~012`、`CFG-A-001~002/004~007/010`、`CFG-F-001~005/008~010/018/020`、`CFG-X-001/004/010~011` | `ci-test` | PR/main | P0 blocking | strict parse/source/profile/redline/no-output mismatch 即 fail |
| `config-assembly` | remaining `CFG`/`CFG-T/A/F/X` builder, Store/UoW/replay/adapter/feature cases | `ci-test` | main/nightly | P0 blocking | V0~V8/B0~B8 order、capability、no-partial-exposure 或 blocked mapping mismatch 即 fail |
| `observability-redaction` | `OBS-001~009`、all-surface forbidden-field/low-cardinality/status separation | `ci-test` | main/nightly/release check | P0 blocking | raw body/secret/full ref/high-cardinality、pair/status inference 或 observer cancellation 即 fail |
| `local-closure` | 五核心节点的 selected cross-module paths、carrier parity、local truth first | `local-dev` 或 `ci-test` | main/nightly | P0 blocking | 本地合同到 outcome/audit/handoff attempt 任一断链即 fail；不要求 provider success |
| `controlled-seam` | controlled Store/UoW/entry/Port/event replay parity | `ci-test` scripted local parity（release）；`integration-like` controlled parity（独立 integration/nightly run） | release 或 integration/nightly | P0 seam blocking；positive external conditional | local seam mismatch fail；未闭 owner positive 为 `blocked_dependency`，不能转 pass |
| `conditional-provider` | Hub/Auth/Sandbox/Bus/Obs/Core/SDK positive qualification | `staging-like` | conditional nightly/release | P1 conditional | 当前 `blocked_dependency`；只有逐项 owner gate 开启后才可判定 |
| `release-local-smoke` | selected same-run P0 local closure + report/redaction/dependency checks | `ci-test` | release aggregate | required release aggregate，非 semantic denominator | entry 条件不满足则 release `not_evaluated/blocked`，不得伪造通过 |

### 4.1 唯一主 owner 规则

- 每个 TC 只有一个上表主 suite；其他 suite 只能引用同一 TC 结果并增加 mapping/parity/组合断言。
- `local-closure` 和 `release-local-smoke` 不重新定义 contract、state、UoW 或 error oracle。
- `controlled-seam` 不以 real-like availability 覆盖 `application-core` 的本地语义结果。
- `conditional-provider` 的未运行/blocked 状态不影响 P0 local semantic 分母，但阻断任何 provider/release readiness 声明。

## 5. CI/CD 门禁图

#### 自动化门禁图: L2-tools planned pipeline

```text
[PR gate: ci-test]
  static-boundary + contract-domain + application-core
  + query-purity + config-validator
                     |
                     v
[main gate: ci-test]
  PR suites + entry-worker-job + transaction-concurrency
  + config-assembly + observability-redaction + local-closure
                     |
                     v
[nightly gate: two independent invocations]
  ci-test full deterministic/race/recovery/fake-parity
  integration-like controlled-seam/event-replay (optional)
                     |
          +----------+-----------+
          |                      |
          v                      v
[blocked provider ledger]   [release candidate: ci-test]
 L2T-UP-001..009             11 P0 suites + local smoke
 no pass/readiness           + 11 checks + reports/seal
                                  |
                                  v
                      [future conditional provider]
                       only after owner closure
```

关键说明:

- 每个 gate invocation 生成独立、固定 `run_id` 的 artifact；nightly 两个 profile 是两个 run，下游 gate 不引用 `latest` 或拼接其结果。
- `blocked provider ledger` 是状态分类，不是测试通过；它防止 open blocker 被静默计入 positive denominator。
- release candidate 先证明本地语义、证据配对和 redaction；不能据此声明 provider、delivery、observed 或 production readiness。

## 6. Gate script contract

### 6.1 Planned gate scripts

| 脚本 | 组合 suite | 默认 profile | 触发 | 输出 | 失败处理 |
|---|---|---|---|---|---|
| `scripts/gates/pr_gate.sh` | PR 五 suite | `ci-test` | PR/变更请求 | 每 suite raw report + gate status | 任一 P0 fail/invalid artifact 阻断 |
| `scripts/gates/main_gate.sh` | main 十 suite | `ci-test` | merge/main | 全量 suite raw report + gate status | 任一 P0 fail/unknown harness state 阻断 |
| `scripts/gates/nightly_gate.sh` | main + expanded concurrency/recovery；或 controlled seam | 每次 invocation 只能一个 profile：required `ci-test` run，optional 独立 `integration-like` run | schedule/manual | 每个 profile 独立 raw/report/index/seal | 各 run 独立判定；不得跨 run 聚合 pass；CI fail 阻断 release，integration blocked 单列 |
| `scripts/gates/integration_gate.sh` | `controlled-seam` | `integration-like` | adapter/entry/event change | seam report、dependency classification | local mismatch fail；open owner为blocked |
| `scripts/gates/release_gate.sh` | 11 个 P0 semantic suite（`controlled-seam` 取 scripted local parity）+ `release-local-smoke` aggregate + 全部 mandatory checks/reports | `ci-test` | release candidate | same-run raw/report/index/check/final seal + acceptance draft inputs | 任一 P0 suite/case/check、fixed run 或配对缺失即阻断 |
| `scripts/gates/conditional_provider_gate.sh` | `conditional-provider` selected seam | `staging-like` | owner closure + explicit enable | provider qualification raw report | 当前默认拒绝启动；blocked不转pass |
| `scripts/gates/run_suite.sh` | one named suite | caller-supplied | internal/manual diagnostic | suite-scoped raw report | unknown suite/profile/argument exit invalid；不充当 release gate |

### 6.2 公共 CLI 参数

所有 gate 必须支持下列参数；脚本实现前这些是接口设计，不是已存在命令。

| 参数 | 必填/默认 | 规则 |
|---|---|---|
| `--run-id <opaque-id>` | 正式 gate 必填 | 非空、不可为 `latest`；同一 gate invocation 全部 suite 共用；设计文档不分配真实值。 |
| `--artifact-root <path>` | 默认 `artifacts/test/<run_id>` | 必须解析到该固定 run；不得增加 project 子目录或指向 reports。 |
| `--config-profile <name>` | 必填 | 只接受 04 canonical profile；suite/profile 必须匹配 Step 8。 |
| `--suite <suite-id>` | `run_suite.sh` 必填 | 只接受 suite registry 中的 closed ID。 |
| `--case-filter <TC refs>` | 可选，诊断/复验 | 不能改变正式 full denominator；release 不得使用未披露过滤器。 |
| `--report-root <path>` | 默认 `reports/runs/<run_id>` | 只允许生成 planned human-readable report；raw artifact 仍在 artifact root。 |
| `--blocked-ledger <path>` | formal gate 必填；`run_suite.sh` optional | 输入本 run 冻结的 open blocker 安全投影；`check_blocker_truth` 必须绑定其 digest，gate 不得自行关闭 blocker。 |

### 6.3 Planned exit/status contract

| 状态 | 含义 | gate 行为 |
|---|---|---|
| `passed` | suite full denominator 执行且全部 oracle 成立 | 仅对该 suite/run/profile 有效，不代表验收或 readiness。 |
| `failed` | 至少一个已执行 case oracle 不成立 | blocking suite 阻断；保留失败 artifact/report。 |
| `blocked_dependency` | 运行所需 owner/schema/mapping/route 未闭 | 不算 pass；P0 negative suite可继续，受影响 positive gate阻断/跳过。 |
| `not_evaluated` | suite 未运行、被过滤、环境无效或结果无法判定 | 不算 pass；正式 gate 阻断。 |
| `invalid_artifact` | raw report、上下文、配对、schema 或 redaction 不合规 | 正式 gate 阻断，即使测试进程 exit 0。 |
| `cancelled` | 外部取消或基础设施中断 | 不算 pass；重新运行需新 `run_id`，旧记录不改写。 |

不存在 `flaky_pass`、`expected_fail_as_pass`、`latest_pass` 或 `health_ready` 状态。重跑必须创建新 run；不得覆盖旧 artifact 或把多次运行择优拼接成一次 pass。

Suite 和 gate 的聚合顺序固定为 `invalid_artifact > failed > blocked_dependency > cancelled > not_evaluated > passed`。先校验 denominator、schema、digest、path、pairing 与 redaction，任一 integrity 失败即 `invalid_artifact`；否则按上述从左到右取首个存在的子状态。只有声明的全部 case/suite/check 都为 `passed` 才可聚合为 `passed`，空分母或遗漏不得通过。

## 7. Check 与 report scripts

### 7.1 Mandatory checks

| 脚本 | 输入 | 核查内容 | 进入 gate | 输出方向 |
|---|---|---|---|---|
| `scripts/checks/check_case_manifest.sh` | suite report + Step 6 manifest projection | TC identity唯一、declared denominator完整、无静默过滤 | PR/main/nightly/integration/release/conditional-provider | `checks/check_case_manifest.json` |
| `scripts/checks/check_dependency_boundary.sh` | dependency/import graph | compile 仅 Core；无 sibling Hub/Sandbox/Runtime/Bus/Obs/SDK package | PR/main/nightly/integration/release/conditional-provider | `checks/check_dependency_boundary.json` |
| `scripts/checks/check_profile_isolation.sh` | context/config projection | fixture只 Local/CI；integration无隐式 fake；profile/source相容 | PR/main/nightly/integration/release/conditional-provider | `checks/check_profile_isolation.json` |
| `scripts/checks/check_query_no_write.sh` | query effect journal | begin/write/refresh/repair/external Port count 全为 0 | PR/main/nightly/release | `checks/check_query_no_write.json` |
| `scripts/checks/check_job_boundedness.sh` | job plan/report journal | scope/cursor/watermark/ordinal有界且 no-repair | main/nightly/release | `checks/check_job_boundedness.json` |
| `scripts/checks/check_phase_unknown_fence.sh` | Port/UoW call journal | Prepared-before-call、one-call、unknown no retry | PR/main/nightly/integration/release/conditional-provider | `checks/check_phase_unknown_fence.json` |
| `scripts/checks/check_outcome_audit_pair.sh` | UoW/store projection | outcome/audit same-UoW pair，无 half pair pass | PR/main/nightly/integration/release/conditional-provider | `checks/check_outcome_audit_pair.json` |
| `scripts/checks/check_redaction_boundary.sh` | all raw artifacts + generated reports | 无 raw secret/token/key/credential/full body/full sensitive ref/high-cardinality | PR/main/nightly/integration/release/conditional-provider | `checks/check_redaction_boundary.json` + redaction report |
| `scripts/checks/check_blocker_truth.sh` | blocker ledger + suite status | open blocker 未变 resolved/pass/readiness；positive denominator排除 | PR/main/nightly/integration/release/conditional-provider | `checks/check_blocker_truth.json` |
| `scripts/checks/check_artifact_report_pairing.sh` | artifact/report trees | 每个 suite report、stdout/stderr、context 与人类报告配对 | PR/main/nightly/integration/release/conditional-provider | `checks/check_artifact_report_pairing.json` |
| `scripts/checks/check_no_static_evidence.sh` | evidence index + raw reports | EV 只能从本 run raw suite records推导，不接受手写 pass/alias | PR/main/nightly/integration/release/conditional-provider | `checks/check_no_static_evidence.json` |

以上输出方向均相对于 `artifacts/test/<run_id>/`。check identity 是脚本 stem（例如 `check_case_manifest`），脚本、identity 与 JSON 文件一一映射；11 个 check 不属于 13 个 semantic suite，也不得占用 `suites/<suite>` namespace。gate context 必须分别记录 `suite_refs` 与 `check_refs`。

#### 7.1.1 Gate 到 check 的规范闭集

下表是 `meta/context.json.check_refs` 的唯一生成依据，`R` 表示 required，`-` 表示不属于该 gate 的 denominator。实现不得从 suite 是否产出文件、脚本是否存在或前一 run 的结果动态删减 check；required check 缺失或没有 closed status 时 gate 为 `invalid_artifact`。未列入 denominator 的 check 不生成占位 pass，也不能支撑该 gate 的 evidence eligibility。

| Check identity | PR | main | nightly | integration | release | conditional_provider |
|---|---:|---:|---:|---:|---:|---:|
| `check_case_manifest` | R | R | R | R | R | R |
| `check_dependency_boundary` | R | R | R | R | R | R |
| `check_profile_isolation` | R | R | R | R | R | R |
| `check_query_no_write` | R | R | R | - | R | - |
| `check_job_boundedness` | - | R | R | - | R | - |
| `check_phase_unknown_fence` | R | R | R | R | R | R |
| `check_outcome_audit_pair` | R | R | R | R | R | R |
| `check_redaction_boundary` | R | R | R | R | R | R |
| `check_blocker_truth` | R | R | R | R | R | R |
| `check_artifact_report_pairing` | R | R | R | R | R | R |
| `check_no_static_evidence` | R | R | R | R | R | R |

`main`、`nightly` 和 `release` 的闭集均为全部 11 个 check；PR 为除 `check_job_boundedness` 外的 10 个；integration 与 conditional-provider 为排除 Query/Job 专项后的 9 个。`run_suite.sh` 对应 `single_suite` 诊断上下文，不是 formal gate：调用者可显式请求与目标 suite 相符的 check，但它不得写 final eligibility、满足 §12 退出条件或替代上述任一闭集。

每个 formal gate invocation 只能绑定一个 profile 和一个 fixed run，并生成 owning suite report、pre-check `evidence-index.json` 和本 gate 的闭集 check。nightly matrix 的 `ci-test` 与 `integration-like` 是两个 invocation/run，不生成跨 run summary truth。只有 release 额外生成 acceptance working projection，并产生可供未来 06 校验的 final seal。release 固定 `ci-test`，先执行 11 个 P0 owning suite；其中 `controlled-seam` 只跑 scripted local parity，真实 controlled route 留给独立 integration run。随后 `release-local-smoke` 通过 `case_artifact_refs` 聚合同 run 已有 case；不得复制 case，也不得引用 main/nightly/integration 的另一个 run。PR/main/nightly/integration/conditional-provider 的 seal 只服务本 gate 反馈，不是 06 acceptance input。

### 7.2 Planned report scripts

| 脚本 | 来源 | 输出 | 人/Agent 后续审查 |
|---|---|---|---|
| `scripts/reports/generate_suite_reports.sh` | `artifacts/test/<run_id>/suites/*/report.json` | `reports/runs/<run_id>/suites/<suite>.md` | 失败解释、case refs、profile和blocked分类。 |
| `scripts/reports/generate_gate_summary.sh` | final `gate-summary.json` + check JSON | `reports/runs/<run_id>/summary.md`、`gate-results.md`、`dependency-boundary.md`、`artifact-report-pairing.md` | full denominator、blocking、依赖边界、pairing和遗漏；仅作final seal的safe-ref投影。 |
| `scripts/reports/generate_evidence_index.sh` | raw suite records + pre-index suite reports + case/EV mapping | machine `evidence-index.json`，再生成 `reports/runs/<run_id>/evidence-index.md`、`evidence/<candidate_slot>.md` | EV/TC/suite/artifact/AC/VF追溯；machine index先冻结；human evidence页不反向进入index。 |
| `scripts/reports/generate_redaction_report.sh` | redaction check raw result | `reports/runs/<run_id>/redaction-check.md` | 扫描范围、排除项和失败样本安全性。 |
| `scripts/reports/generate_acceptance_handoff.sh` | same-run context、suite/case raw records、pre-index suite reports、successful `evidence-index.json`、冻结 blocker safe projection、Step 14 residual registry | `reports/runs/<run_id>/acceptance-draft/handoff.md`、`risk-acceptance.md` | pre-seal draft；禁止读取 final report/seal，不构成签署或风险接受。 |
| `scripts/reports/generate_veto_checklist.sh` | successful same-run index、VETO/NC case records、current VF registry | `reports/runs/<run_id>/acceptance-draft/veto-checklist.md` | `VF-L2T-001~013`逐项引用 source record；不从 final check 推断结果。 |
| `scripts/reports/generate_open_issues.sh` | same-run source/derivation status、冻结 blocker 与 residual | `reports/runs/<run_id>/acceptance-draft/open-issues.md` | 禁止读取 seal；不得遗漏阻断项或把 blocker写成缺陷已关闭。 |

三类 acceptance generator 只允许由 `release_gate.sh` 对一个 fixed run 调用，并且只写 run-scoped staging；PR/main/nightly/integration/conditional-provider 不生成或发布 acceptance projection。release gate 完成全部 required check（redaction 必须扫描 staging exact bytes）后，内建 release publisher 对 `reports/acceptance/.projection.lock` 执行 non-blocking OS advisory exclusive lock，逐一用 same-directory temporary file + single-file replace 更新四份 `reports/acceptance/*.md`，最后 single-file replace `reports/acceptance/projection-manifest.json`；锁保持到本 run seal 写完。publisher 以打开的 descriptor 持锁；lockfile 存在或内容不代表锁，也不进入 evidence/digest/retention。manifest 绑定 source run/index digest、四个 staging/published path 与 exact-byte digest，是 publication marker，不声称文件系统能原子替换五个文件。lock acquire 失败、发布中断、缺项、mixed tuple 或 digest drift 都使固定视图和当前 release invalid；finalizer 写 diagnostic invalid seal，但不写 manifest ref/digest 或可交接 eligibility。run-scoped staging 与旧 run facts仍保留，旧 fixed view 不得 fallback；任何重生成都必须创建新 release run。

## 8. Artifact/report planned mapping

| Suite | TC family | Candidate EV | Artifact path | Report path | 阻断 |
|---|---|---|---|---|---|
| `static-boundary` | `VETO-001~013` + dependency/static redlines | `EV-CAND-L2T-VETO-001` | `artifacts/test/<run_id>/suites/static-boundary/` | `reports/runs/<run_id>/suites/static-boundary.md` | P0 |
| `contract-domain` | `FOUNDATION-001~018`;`STATE-001~012` pure branches | `EV-CAND-L2T-FOUNDATION-001`;`EV-CAND-L2T-STATE-001` | `artifacts/test/<run_id>/suites/contract-domain/` | `reports/runs/<run_id>/suites/contract-domain.md` | P0 |
| `application-core` | CONTRACT/BIND/INV/PRE/OUTCOME/HANDOFF | matching six EV families | `artifacts/test/<run_id>/suites/application-core/` | `reports/runs/<run_id>/suites/application-core.md` | P0 |
| `query-purity` | QUERY + no-write | `EV-CAND-L2T-QUERY-001` | `artifacts/test/<run_id>/suites/query-purity/` | `reports/runs/<run_id>/suites/query-purity.md` | P0 |
| `entry-worker-job` | CONSUMER/CONT/JOB | matching three EV families | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | P0 |
| `transaction-concurrency` | TX/CONC/ERR + race states | matching three EV families | `artifacts/test/<run_id>/suites/transaction-concurrency/` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | P0 |
| `config-validator` | assigned CFG baseline/T/A/F/X cases | `EV-CAND-L2T-CFG-001`;`EV-CAND-L2T-CFG-T-001`;`EV-CAND-L2T-CFG-A-001`;`EV-CAND-L2T-CFG-F-001`;`EV-CAND-L2T-CFG-X-001` | `artifacts/test/<run_id>/suites/config-validator/` | `reports/runs/<run_id>/suites/config-validator.md` | P0 |
| `config-assembly` | remaining CFG baseline/T/A/F/X cases | same CFG candidate families, distinct TC refs | `artifacts/test/<run_id>/suites/config-assembly/` | `reports/runs/<run_id>/suites/config-assembly.md` | P0 |
| `observability-redaction` | OBS + all-surface scan | `EV-CAND-L2T-OBS-001` | `artifacts/test/<run_id>/suites/observability-redaction/` | `reports/runs/<run_id>/suites/observability-redaction.md` | P0 |
| `local-closure` | selected C-L2T-1~5/TG-L2T-001~010 references | `EV-CAND-L2T-CORE-001` derived only from referenced TC results | `artifacts/test/<run_id>/suites/local-closure/` | `reports/runs/<run_id>/suites/local-closure.md` | P0 |
| `controlled-seam` | controlled entry/adapter/event parity refs | matching source TC EV candidates | `artifacts/test/<run_id>/suites/controlled-seam/` | `reports/runs/<run_id>/suites/controlled-seam.md` | P0 local seam；external conditional |
| `conditional-provider` | P1 external positive only | future candidate, not allocated in this Step | `artifacts/test/<run_id>/suites/conditional-provider/` | `reports/runs/<run_id>/suites/conditional-provider.md` | conditional |
| `release-local-smoke` | selected same-run references, no new business oracle | report/gate candidate only | `artifacts/test/<run_id>/suites/release-local-smoke/` | `reports/runs/<run_id>/suites/release-local-smoke.md` | required release aggregate |

Candidate EV 名称仍不是证据实例或 alias。Step 13 只会定义实例记录成立条件；只有未来真实 suite artifact、fixed run context 和 report 配对后，才能形成可被 06 引用的 evidence record。

## 9. P0 自动化缺口与人工审查

| 项 | 自动化状态 | 人/Agent 角色 | 处理 |
|---|---|---|---|
| P0 canonical semantic cases | 全部有主 suite candidate | 不替代执行 | 实现缺少 runner/fixture 时为 implementation blocker，不降级手工 pass。 |
| dependency/profile/redaction/phase/pair checks | 全部有 planned check | 审查 check 范围和例外 | 例外必须正式设计变更，不可在脚本中 allowlist 绕过。 |
| provider positive qualification | P1 conditional，当前 blocked | 审查 owner closure/source/version | 不进入 P0 pass denominator。 |
| acceptance handoff / veto / residual risk | 报告初稿可生成 | 人/Agent 必须审查补充 | 不能自动签署、接受风险或关闭 blocker。 |
| flaky/infra interruption | 不允许自动判 pass | 审查原因、建缺陷、决定新 run | 旧 run保持 failed/not_evaluated/cancelled。 |

## 10. 单 suite 停审与跨 suite 审计

### 10.1 单 suite 停审

| Suite group | 覆盖/owner | script/path | failure/blocked | 结论 |
|---|---|---|---|---|
| static + unit | 唯一 static/contract/domain owner明确 | PR/main gate + fixed paths | P0 fail阻断 | pass_for_step_09 |
| service + query | 六核心 family与Query主owner明确 | PR/main/nightly | blocked external不转pass；Query write即fail | pass_for_step_09 |
| entry + TX/concurrency | entry/receipt/job与事务race owner明确 | main/nightly | unknown/flaky不重试为pass | pass_for_step_09 |
| config + observation | CFG cases在validator/assembly精确分区；OBS唯一owner | PR/main/nightly/release checks | raw/partial/profile污染直接fail | pass_for_step_09 |
| cross-module + controlled | 只增加组合/adapter parity，不重定义业务oracle | main/integration | positive external受blocker约束 | pass_for_step_09 |
| release aggregate/provider | release aggregate 不新增 semantic denominator；provider 条件分离 | release/conditional scripts | smoke 缺失阻断 release；provider 当前 blocked | pass_for_step_09 |

### 10.2 跨 suite/证据审计

| 审计项 | 结论 | 约束 |
|---|---|---|
| P0 case family是否有主 suite | 通过；Step 6全部 family已映射 | 实现 manifest 必须精确列 TC，不可只写 family 名。 |
| P0是否被推给手工/E2E | 否；主 oracle在PR/main/nightly低层发现 | 人工只审查报告、risk和owner closure。 |
| suite是否重复拥有oracle | 未发现；cross-module/release只引用低层TC | duplicate execution可增加信心，不能生成冲突结论。 |
| artifact/report是否配对 | 每 suite已规划固定 run路径 | Step 13补 schema/真实性规则。 |
| candidate EV是否被当真实证据 | 否；均明确 planned/candidate | 禁止静态 index、alias或手写pass。 |
| blocker是否被算pass | 否；`blocked_dependency`独立状态 | negative blocked behavior通过不等 positive provider通过。 |
| `latest`/project子目录是否出现 | 正式路径无 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`。 |
| redaction是否覆盖raw和report | 已规划 every formal gate check | 失败 artifact也必须被扫描且保留安全failure reason。 |

## 11. 回填草稿（正式 05 §9）

> 校准来源：
> - `design-calibration/05_test_plan_step_09_automation_gates.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“Suite registry”“CI/CD 门禁图”“Gate script contract”“Check 与 report scripts”“Artifact/report planned mapping”和“跨 suite/证据审计”小节。

自动化以稳定 suite registry 为核心：PR 执行 static/contract/domain/application/query/config-validator；main 增加 entry/worker/job、transaction/concurrency、config assembly、observation/redaction 和 local closure；nightly 以独立 `ci-test`/`integration-like` run 扩展 race/recovery/fake parity/event replay；integration-like 执行 controlled seam；release 固定 `ci-test` 同 run P0 全量与 aggregate，provider positive 仅在 owner/profile/baseline 闭口后由独立 conditional gate 启用。每个 P0 TC 只有一个主 suite，组合/发布层不得重新定义业务 oracle。

正式 gate 通过 `scripts/gates/*.sh` 规划，checks 位于 `scripts/checks/*.sh`，report generators 位于 `scripts/reports/*.sh`。所有 gate 接受 `--run-id`、`--artifact-root`、`--config-profile`，raw 输出固定在 `artifacts/test/<run_id>`，人类可读报告与验收 staging 固定在 `reports/runs/<run_id>`；只有 release 在 checks 后发布 manifest-committed `reports/acceptance` 固定视图。禁止 `latest`、静态造 evidence、跨 run 拼接和 project 子目录。

状态严格区分 `passed`、`failed`、`blocked_dependency`、`not_evaluated`、`invalid_artifact`、`cancelled`。blocked/unknown/flaky/infra interruption 不得重试或改名为 pass；重新运行创建新 run。P0 语义用例均有自动化候选，人工/Agent 仅补报告解释、风险与 owner closure 审查，不替代执行或签署。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓、语言测试框架、entry 命令尚不存在 | `run_suite.sh` 内部命令和 manifest 文件格式 | 只固定外层脚本、参数、suite和输出契约；不伪造命令。 |
| durable adapter/runtime candidate 未选 | controlled seam具体执行 | P0 contract fake；integration保持candidate/blocked。 |
| CI provider/product 未选 | pipeline YAML和trigger syntax | 只定义逻辑 PR/main/nightly/release gate。 |
| `L2T-UP-001~009` open | conditional provider suite | 默认拒绝启动/blocked，不分配正向EV实例。 |
| 06 evidence authority未重建 | AC/VF最终消费 | 只保留 candidate EV和报告初稿方向。 |

## 13. 进入下一步条件

- [x] 每个 P0 family 有唯一主 suite、执行位置、profile和阻断级别。
- [x] gate/check/report script 路径和公共参数已固定。
- [x] artifact/report使用固定 `<run_id>` 路径且禁止 `latest`。
- [x] suite到TC/candidate EV/artifact/report映射完整。
- [x] blocked/unknown/flaky/invalid artifact不转pass。
- [x] 没有只能靠人工执行的 P0 语义用例。
- [x] 未创建脚本、pipeline、run、artifact、report、evidence alias或测试结果。

## 14. Step 9 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_09 / proceed_to_step_10` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；conditional provider/release positive 保持 blocked/not_evaluated |
| 正式文档写入 | 未写；Step 15 前保持锁定 |
| 下一步 | Step 10 专项测试与非功能验证 |
