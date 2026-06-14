# Step 10. 设计专项测试与非功能验证

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 设计专项测试与非功能验证 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | `00` NFR / AC / VETO;Step 5 覆盖矩阵;Step 6 用例矩阵;Step 8 环境配置;Step 9 自动化门禁;`03` 事务 / 错误 / 幂等 / 配置 / 观测;`04` 失效策略 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_10_nonfunctional.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

定义 L1-identity 的性能、安全、一致性、恢复、观测、审计、配置失效、依赖边界和 fake / controlled parity 专项验证口径。

本 Step 只回答:

- 哪些 NFR-ID、AC-ID、VETO-ID 和 redline 风险必须作为专项测试验证。
- 哪些性能指标有正式来源,哪些只能做 sample / trend 或残余风险。
- 哪些安全和边界红线必须通过负向测试、redaction scan 或 dependency scan 阻断。
- 哪些一致性、幂等、事务、恢复和 fake / controlled parity 场景必须故障注入。
- 哪些 log、metric、trace、audit、report、artifact 和 redaction 证据必须存在。
- 每个专项由哪些 Step 9 suite / gate 承接。

本 Step 不定义正式 `EV-*` evidence ID,不定义 raw artifact JSON schema,不写验收 verdict,不把 P1/P2 real product、production-like SLO 或旧性能数字硬化为 P0 pass 条件。正式 evidence 编号和归档由 Step 13 固定,进入 / 退出与残余风险由 Step 12 / Step 14 固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | 正式输入 | 提供 NFR-ID-001~009、AC-ID-014~015、VETO-ID-001~006 和旧性能数字不可直接继承的约束 |
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 提供 NFR / AC / VETO 到测试切口的覆盖关系 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 `TC-ID-IDEMP-*`、`TC-ID-CONFIG-*`、`TC-ID-REDACTION-*`、`TC-ID-ARCH-*` 和 no-write / no-repair 用例 |
| `05_test_plan_step_07_test_data.md` | 已审核通过 | 提供 forbidden body、raw secret、fault injection、config negative 和 dependency metadata 数据集 |
| `05_test_plan_step_08_environment_config.md` | 已审核通过 | 提供 `ci-test`、`integration-like`、`operations-replay`、P1/P2 selected-run 和环境不可用处理 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 blocking suite、release checks、artifact/report 根目录和 evidence candidate 来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 UoW、version、stored result/report、outbox、projection、reference、handoff 事务边界 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 forbidden body、query degraded、duplicate no-rerun、manual recovery 和 fake/durable parity 规则 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 duplicate replay、same-key conflict、commit unknown 和 race guard |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 log、metric、trace、audit、report 和 redaction 字段边界 |
| `04-配置设计.md` §8 / §11 / §12 | 正式输入 | 提供 sensitive / forbidden material、fail-fast、fail-closed、degraded/no-write、audit compensation 和 downstream handoff |
| `L1-governance` Step 10 calibration | 参考输入 | 只参考专项矩阵粒度和停审结构,不复用 governance 业务对象、TC 或 EV |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些性能指标必须验证? | P0 必须验证结构性性能口径:identity 核心 command/query/job 在 `ci-test` / `operations-replay` / release smoke 下产出 duration/count sample,且核心身份锚点、生命周期读取和摘要读取不依赖 P1/P2 真实 DB、bus、archive、observability backend、HR/IdP 或 production-like profile。当前不设置硬 P95/SLA 阈值。 |
| 哪些安全和边界红线必须负向测试? | VETO-ID-001~006、NFR-ID-003~004、AC-ID-014 必须负向覆盖:ref 不复用、query/consumer/job 不隐式创建身份、不保存 RoleDefinition / ProjectMember / memory / artifact / conversation / runtime / archive body、不接受无依据高风险生命周期、不让 reconciliation 修相邻 truth、不引入 sibling business compile dependency。 |
| 哪些一致性和恢复场景必须故障注入? | duplicate same digest、same-key different digest、stored result/receipt/report missing、commit unknown、rollback failure、outbox append failure、idempotency complete failure、version conflict、projection rebuild race、reference refresh failure、publisher failure、handoff delivery failure 和 disabled adapter no fake success 均必须通过 fake / controlled 注入验证。 |
| 哪些日志、指标和审计证据必须存在? | Accepted mutation 必须有正式 trace/audit/outbox/stored result 或对应 effect refs;query 只能有 safe log/metric,不得写业务 audit;job 必须有 stored report / issue refs;redaction、dependency boundary、write-audit、report audit 和 gate summary 必须从 artifact/report 生成。 |
| 阈值来自哪里? | P0 通过条件来自 `00/03/04` 的明确零容忍和结构性断言,不是旧性能数字。NFR-ID-001 当前只要求 sample / trend 和 no P1/P2 dependency。若后续要把具体 latency、capacity 或 availability SLO 作为 pass 阈值,必须先回写 `05/06/07/09` 或容量基线。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `00` NFR-ID-001 / OQ-ID-005 | 要求测试方案给出基线或 sample 口径,但不授权继承旧硬阈值 | 本 Step 固定 sample / trend + 结构性验证,不设硬 P95 |
| Step 5 | NFR / AC / VETO 已覆盖,但专项矩阵未集中 | 本 Step 汇总成专项测试矩阵 |
| Step 6 | 一致性、redaction、config、dependency 用例已存在,但未按非功能维度归类 | 本 Step 将 TC 映射到专项和 gate |
| Step 8 | 环境边界已定义,但专项是否需要真实产品仍需明确 | 本 Step 明确 P0 用 fake / controlled / replay,P1/P2 不计 P0 pass |
| Step 9 | suite/gate 已定义,但专项归属和通过口径未集中 | 本 Step 固定专项到 suite / gate 映射 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能 | 只有候选 baseline / sample 提醒 | 固定 P0 结构性 sample,不硬化旧数字 | 缺正式负载模型和 SLO 来源 |
| 安全 redline | 分散在 VETO、用例和配置 | 集中到安全 / redaction 专项 | 零容忍风险必须可审计 |
| 可用性 / 降级 | 分散在环境和 query 用例 | 明确基础身份能力不受外围依赖整体阻断 | 承接 NFR-ID-002 |
| 一致性恢复 | 分散在 idempotency / job 用例 | 汇总为故障注入矩阵 | 便于 gate 和 defect 复验承接 |
| 观测审计 | 详细设计有字段边界 | 明确必须生成的 safe log/metric/audit/report evidence candidate | Step 13 可归档 |
| fake parity | 配置和错误恢复均提及 | 作为专项停审项 | 防止 fake 私有捷径通过 P0 |

## 7. 专项测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 性能是否继承旧硬阈值 | A. 继承旧 P95/SLA;B. 只做 sample/trend 和结构性验证 | 采用 B。旧数字没有当前正式负载模型来源 |
| 可用性是否要求真实产品 | A. 要求真实 DB/bus/archive/observability;B. fake/controlled/replay 证明语义 | 采用 B。真实产品留 P1/P2 selected-run 或后续部署运维 |
| redaction 是否只扫最终 report | A. 只扫 report;B. artifact + report + negative leak corpus | 采用 B。泄漏可能先出现在 raw artifact |
| query 是否写审计证明可观测 | A. query 写 business audit;B. query no-write,只允许 safe log/metric | 采用 B。符合 query no-write 设计 |
| fake parity 是否只靠人工评审 | A. 人工;B. fake / controlled / durable-like 行为必须有同构断言 | 采用 B。P0 自动化不能依赖 fake 私有语义 |

## 8. 结构化中间产物

### 8.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 性能结构性 sample | NFR-ID-001;核心 command/query/job 无正式 latency baseline | release smoke + service/job duration/count sample;记录 run id/profile/suite | `ci-test`;`operations-replay`;release gate | 无硬 P95;必须有 sample,且不得依赖 P1/P2 product capability | `EV-CAND-ID-NFR-PERF-001` |
| 可用性 / 降级 | NFR-ID-002;外围依赖不可用导致身份锚点/生命周期整体失效 | resolver/publisher/handoff unavailable injection;query degraded/no-write assertions | `integration-like`;`operations-replay` | anchor/lifecycle core read remains formal surface;role/memory/handoff degrade without corrupting truth | `EV-CAND-ID-NFR-AVAIL-001` |
| 安全 / trusted context | NFR-ID-003;无可信 actor/context 或越权写入 | metadata negative、high-risk lifecycle basis negative、entry validation | `ci-test` | rejected before mutation or policy denied;no accepted trace/outbox/result | `EV-CAND-ID-CONTRACT-*`;`EV-CAND-ID-CMD-*` |
| forbidden material / redaction | NFR-ID-004;raw body/secret/credential/full sensitive ref 泄漏 | forbidden body fixture + artifact/report/log scan | `ci-test`;release gate | scan clean;negative leak fixture fails safely and does not echo secret/body | `EV-CAND-ID-REDACTION-*` |
| 审计 / 可追溯 | NFR-ID-005;accepted identity changes 无 trace/audit/source | command/consumer assertions + trace/audit query | `ci-test`;release smoke | accepted mutation traceable to safe actor/reason/source refs;rejected path does not forge accepted trace | `EV-CAND-ID-CONSUME-*`;`EV-CAND-ID-JOB-*` |
| 幂等 / 一致性 | NFR-ID-006;duplicate 分叉、stored replay 缺失后重算 | fake idempotency/UoW/repository failure injection | `ci-test`;`operations-replay` | duplicate replays stored result/receipt/report;stored missing exposes error/degraded surface;no second truth write | `EV-CAND-ID-IDEMP-*` |
| append-only / history integrity | NFR-ID-007;career / trace history 原地改写 | domain state + command duplicate/correction tests | `ci-test` | correction appends new record;original remains intact;terminal state not released for reuse | `EV-CAND-ID-STATE-*`;`EV-CAND-ID-CMD-*` |
| 可观测性 / safe diagnostics | NFR-ID-008;无法定位失败能力或输出 unsafe diagnostic | log/metric/report scan and low-cardinality checks | main CI;release gate | safe issue refs、operation kind、status、duration/count present;no raw body/full ref/high-cardinality labels | `EV-CAND-ID-REDACTION-*` |
| 对账 / drift report | NFR-ID-009;对账修相邻 truth 或报告不可审计 | reconciliation job report-only tests + write-audit | `operations-replay` | report describes identity-owned projection/ref issue only;no adjacent truth repair | `EV-CAND-ID-JOB-*` |
| 配置失效 / no silent fallback | invalid config、disabled adapter、unsafe redline 伪成功 | strict config/runtime builder/profile tests | PR;main;release | invalid fail-fast/reject;disabled adapter returns formal disabled/unavailable/degraded;no partial facade | `EV-CAND-ID-CONFIG-*` |
| 依赖边界 | VETO-ID-006;non-core sibling compile dependency | generated dependency metadata / manifest scan | PR;main;release | only `L0-core` / core contracts compile-time;business sibling via runtime/event/replay only | `EV-CAND-ID-ARCH-001` |
| fake / controlled parity | fake 私有捷径与 formal semantics 不同 | fake vs controlled outcome assertions;write-audit and no private store scan | `ci-test`;`integration-like`;`operations-replay` | fake cannot mark success without formal marker;cannot repair truth/query;cannot retain raw body for assertions | `EV-CAND-ID-CONFIG-*`;`EV-CAND-ID-IDEMP-*` |

### 8.2 性能专项口径表

| 项 | 当前口径 | 测试方式 | 是否 P0 pass 阈值 |
|---|---|---|---|
| Establish / lifecycle / role / career / memory command duration | 必须产出 duration/count sample,用于后续 baseline | `service-flow-fast` and release smoke sample | 否;缺 sample 才失败 |
| Anchor / lifecycle / member summary read duration | 基础读取不得依赖 projection repair、external resolver 或 P1 backend | `service-flow-fast`;`release-main-smoke` | 否;只证明结构性 no hidden dependency |
| Trace / audit / report query duration | 读取必须 no-write,不可通过修复动作换取成功 | query suite sample + write-audit | 否 |
| Outbox / projection / reference / handoff job duration | operations replay 必须记录 item count、duration、failed refs | `operations-replay-core` | 否 |
| Availability / degraded path latency | 依赖不可用必须快速返回 formal surface,不等待真实产品 | controlled unavailable injection | 否 |
| 旧固定 P95 / SLA | 当前无正式负载模型、真实产品 profile 或容量基线 | 后续 P2 capacity 或新版 `06/09` 可重新定 | 否 |

### 8.3 安全 / 边界红线专项表

| 红线 | 负向输入 | 断言 | Suite / gate | 候选证据 |
|---|---|---|---|---|
| VETO-ID-001 ref reused | requested member ref already owned;terminal lifecycle reached | reject/conflict;member ref never released for another member | `contract-domain-fast`;`service-flow-fast` | `EV-CAND-ID-STATE-*`;`EV-CAND-ID-IDEMP-*` |
| VETO-ID-002 implicit create | query missing member;consumer missing member;job missing target | returns missing/not-visible/delayed/quarantined/rejected;no `GlobalMember` creation | `service-flow-fast`;`entry-worker-job`;`operations-replay-core` | `EV-CAND-ID-QUERY-*`;`EV-CAND-ID-CONSUMER-*`;`EV-CAND-ID-JOB-*` |
| VETO-ID-003 external body persisted | RoleDefinition / ProjectMember / memory text / artifact body / conversation body / runtime body / archive package fixture | rejected/quarantined or body-free marker only;redaction clean | `redaction-boundary`;release redaction check | `EV-CAND-ID-REDACTION-*` |
| VETO-ID-004 high-risk lifecycle without basis | high-risk lifecycle command without trusted basis or with unavailable basis | rejected/degraded before lifecycle save;no accepted trace/outbox/result | `service-flow-fast`;release smoke representative case | `EV-CAND-ID-CMD-*` |
| VETO-ID-005 reconciliation repairs adjacent truth | reconciliation report detects drift | report/finding/issue only;no work/governance/memory or identity business truth repair | `operations-replay-core` | `EV-CAND-ID-JOB-*` |
| VETO-ID-006 dependency loop | manifest / dependency graph includes non-core sibling business compile dependency | dependency check fails release gate | `dependency-boundary` | `EV-CAND-ID-ARCH-001` |
| Query no-write | any query route with write-audit repository | zero writes to truth/idempotency/trace/audit/outbox/projection/reference/report | `service-flow-fast` | `EV-CAND-ID-QUERY-*` |
| Job no business truth repair | rebuild/refresh/reconcile/publish/deliver/retry under write-audit | only maintenance/propagation/report stores change | `operations-replay-core` | `EV-CAND-ID-JOB-*` |
| Observability not business audit | query and rejected paths emit logs/metrics | safe diagnostics only;cannot replace formal trace/audit/outbox/stored result | `redaction-boundary`;`report-generation-audit` | `EV-CAND-ID-REDACTION-*` |

### 8.4 一致性 / 恢复故障注入矩阵

| 故障 | 注入位置 | 预期行为 | Suite | 候选证据 |
|---|---|---|---|---|
| version conflict | truth / projection / reference repository | conflict/degraded/partial report;no overwrite | `service-flow-fast`;`operations-replay-core` | `EV-CAND-ID-IDEMP-*` |
| duplicate same digest | command / consumer / callback / job idempotency | replay stored result/receipt/report only | `service-flow-fast`;`entry-worker-job`;`operations-replay-core` | `EV-CAND-ID-IDEMP-*` |
| duplicate different digest | same key with changed canonical digest | conflict surface;original stored result remains authoritative | `service-flow-fast` | `EV-CAND-ID-IDEMP-*` |
| stored result/receipt/report missing | completed idempotency points to missing stored surface | replay error/degraded surface;no recompute from current truth | `infra-runtime-fake`;`operations-replay-core` | `EV-CAND-ID-IDEMP-*` |
| commit unknown | fake UoW commit status unknown | retry checks idempotency/stored surface/truth before any action;no blind second write | `fault-injection-matrix` | `EV-CAND-ID-IDEMP-*` |
| rollback failure | fake UoW rollback fails | safe consistency/dependency surface;manual intervention marker if formal;no hidden compensating write | `fault-injection-matrix` | `EV-CAND-ID-IDEMP-*` |
| outbox append failure | accepted command same UoW | truth/history/trace/stale/result rolled back or operation fails before visible accepted result | `service-flow-fast` | `EV-CAND-ID-IDEMP-*` |
| idempotency complete failure | stored result saved but complete fails injected | completed idempotency never points to missing result;retry does not duplicate truth | `service-flow-fast` | `EV-CAND-ID-IDEMP-*` |
| projection rebuild race | older cursor attempts to replace newer fresh state | older replacement skipped/rejected;newer state preserved | `operations-replay-extended` | `EV-CAND-ID-IDEMP-*` |
| reference refresh unavailable | resolver unavailable/digest mismatch | last good snapshot retained;failed refs/report recorded;no body persisted | `operations-replay-core` | `EV-CAND-ID-IDEMP-*`;`EV-CAND-ID-JOB-*` |
| publisher failure | fake publisher retryable/permanent or unsupported topic | outbox retryable/failed item and job report;accepted truth unchanged | `operations-replay-core` | `EV-CAND-ID-OUTBOX-*` |
| handoff success without receipt | handoff adapter returns success but no formal receipt marker | not delivered;safe issue or retryable/failed marker | `operations-replay-core` | `EV-CAND-ID-JOB-*`;`EV-CAND-ID-IDEMP-*` |
| disabled adapter | resolver/publisher/handoff disabled | formal disabled/unavailable/rejected/degraded outcome;no fake success | `config-redline`;`integration-like` | `EV-CAND-ID-CONFIG-*` |

### 8.5 观测 / 审计证据矩阵

| 观测对象 | 必须存在 | 禁止内容 | 检查方式 | 候选证据 |
|---|---|---|---|---|
| accepted mutation trace | trace ref,member ref,operation ref,change kind,reason/source/basis safe refs | raw source body,external response,credential,full sensitive ref | service assertions + trace query | `EV-CAND-ID-CONSUME-*` |
| accepted mutation audit | actor ref,operation ref,redacted digest,safe metadata | raw request body,raw config,credential,adapter body | service assertions + redaction scan | `EV-CAND-ID-CONSUME-*`;`EV-CAND-ID-REDACTION-*` |
| query diagnostics | operation kind,query disposition,duration,count,safe issue ref | business audit replacement,UoW write,full member/ref/request digest labels | write-audit + metric/log scan | `EV-CAND-ID-QUERY-*`;`EV-CAND-ID-REDACTION-*` |
| job report | run id,item counts,ref sets,failed refs,issue refs,duration/count | raw replay input,package/export body,target credential | operations replay report | `EV-CAND-ID-JOB-*` |
| redaction report | clean scan or safe failure class | detected secret/body echoed in failure text | `check_redaction.sh` | `EV-CAND-ID-REDACTION-*` |
| dependency report | compile dependency graph,allowed upstream decision | hidden sibling business path dependency | `check_dependency_boundary.sh` | `EV-CAND-ID-ARCH-001` |
| report audit | raw artifact/report pairing and no static evidence guard | static JSON declaring EV / VETO pass | `check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | existing `EV-CAND-ID-*` only |

### 8.6 专项到自动化 suite 映射表

| 专项 | Primary suite | Secondary gate | P0 blocking |
|---|---|---|---|
| 性能结构性 sample | `release-main-smoke` | `service-flow-fast`;`operations-replay-core` | 缺 sample 或依赖 P1/P2 能力阻断;数值不阻断 |
| 可用性 / 降级 | `service-flow-fast`;`operations-replay-core` | `infra-runtime-fake` | 是 |
| 安全 / trusted context | `contract-domain-fast`;`service-flow-fast` | release smoke representative case | 是 |
| forbidden material / redaction | `redaction-boundary` | release redaction check | 是 |
| 审计 / traceability | `service-flow-fast`;`entry-worker-job` | release smoke;report audit | 是 |
| 幂等 / 一致性 | `infra-runtime-fake`;`operations-replay-core` | nightly `fault-injection-matrix` | 是 |
| append-only / history integrity | `contract-domain-fast`;`service-flow-fast` | release smoke representative case | 是 |
| observability / safe diagnostics | `redaction-boundary`;`report-generation-audit` | release report audit | 是 |
| reconciliation report-only | `operations-replay-core` | `operations-replay-extended` | 是 |
| config fail-fast | `config-redline` | release config redline | 是 |
| dependency boundary | `dependency-boundary` | release dependency boundary | 是 |
| fake / controlled parity | `infra-runtime-fake`;`integration-like` | operations replay | 是 |

### 8.7 专项停审记录

| 专项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| 性能 | 是否避免无来源硬阈值 | 通过 | 只做 sample/trend;硬阈值留 Step 14 residual 或后续容量基线 |
| 可用性 | 是否覆盖外围依赖不可用 | 通过 | fake/controlled/replay 注入;真实产品不作为 P0 |
| 安全 / trusted context | 是否覆盖 actor/context/high-risk basis | 通过 | entry/domain/service negative cases 承接 |
| forbidden material | 是否覆盖 raw body/secret/full ref | 通过 | artifact + report + log scan |
| 审计 / traceability | 是否 accepted 可追溯且 rejected 不伪造 accepted trace | 通过 | trace/audit/outbox/stored result 断言 |
| 幂等 / 一致性 | 是否覆盖 duplicate、stored missing、commit unknown、race | 通过 | fake UoW/repository/idempotency 注入 |
| append-only | 是否覆盖 career/history/terminal ref integrity | 通过 | domain state + command cases |
| observability | 是否 log/metric/report 可验证且安全 | 通过 | safe diagnostics and low-cardinality checks |
| config | 是否 invalid config no silent fallback | 通过 | config-redline |
| dependency | 是否 VETO-ID-006 自动检查 | 通过 | dependency-boundary |
| fake parity | 是否禁止 fake 私有捷径 | 通过 | fake/controlled parity + write-audit |

### 8.8 跨专项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| NFR-ID-001~009 是否均有专项验证 | 通过 | 见 §8.1 |
| AC-ID-014~015 是否承接 | 通过 | zero tolerance 和 baseline/sample 口径已覆盖 |
| VETO-ID-001~006 是否有负向测试 / gate | 通过 | 见 §8.3 |
| 是否存在无来源性能阈值 | 通过 | 旧 P95/SLA 不作为 P0 pass |
| 是否把 P1/P2 环境写成 P0 pass | 通过 | real product / production-like 只记录 residual |
| 是否有故障注入覆盖一致性恢复 | 通过 | 见 §8.4 |
| 是否有 observability evidence candidate | 通过 | 见 §8.5 |
| 是否提前固定正式 EV / acceptance verdict | 通过 | 仍使用 `EV-CAND-ID-*` |
| 是否改写正式 `05-测试方案.md` | 通过 | 本 Step 只写 `design-calibration` |

## 9. 对上游设计的影响判定

| 专项结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 性能硬阈值不作为 P0 pass | 否 | 承接 `00` OQ-ID-005 和 Step 5 口径 | Step 14 记录 residual |
| P0 使用 fake/controlled/replay failure injection | 否 | 测试方案细化 | 承接 Step 8 / Step 9 |
| Redaction / dependency / no-write / no-repair 阻断 P0 | 否 | 门禁细化 | Step 9 已承接 |
| fake parity 必须验证 | 否 | 承接 `04` no fake fallback | Step 9 suites 承接 |
| 若验收方要求 numeric performance pass | 是 | 验收基线变更 | 需回写 `05/06/07/09` 或容量设计 |
| 若真实 DB / bus / observability backend 变成 P0 | 是 | 环境范围变更 | 需回写 Step 8/9/13/14 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_10_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“专项测试矩阵”“性能专项口径表”“安全 / 边界红线专项表”“一致性 / 恢复故障注入矩阵”“观测 / 审计证据矩阵”和“跨专项审计表”小节,了解非功能验证如何从 NFR、AC、VETO 和详细设计收敛。

正式 `05-测试方案.md` §10 应回填:

- 专项测试覆盖性能结构性 sample、可用性 / 降级、安全 / trusted context、forbidden material / redaction、审计追溯、幂等一致性、append-only、可观测性、对账 report-only、配置失效、依赖边界和 fake / controlled parity。
- 性能当前只记录 sample / trend,并验证核心主链不依赖 P1/P2 外围增强;旧 P95/SLA 不作为当前 P0 pass 阈值。
- 安全和边界红线必须通过负向测试、redaction scan、dependency scan 和 write-audit 阻断。
- 一致性和恢复必须通过 fake UoW、repository、resolver、publisher、handoff 和 idempotency fault injection 验证。
- Query no-write、job no business truth repair、accepted trace/audit/outbox/stored result、duplicate stored replay 和 rejected not accepted trace 都必须可验证。
- 所有专项 evidence 仍使用 `EV-CAND-ID-*`;正式 evidence ID、raw artifact schema 和验收引用由 Step 13 / 新版 `06` 固定。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 P95/SLA 是否未来硬化 | 影响 release gate 和验收标准 | 当前不硬化;Step 14 记录残余风险 |
| production-like / staging-like 是否提前成为 P0 | 影响环境、数据、gate 和 evidence | 当前不升级;需正式范围变更 |
| 真实 observability backend 是否纳入 P0 | 影响 log/metric/trace 物理证据 | 当前只验证 safe fields and artifact/report |
| fault-injection-matrix 是否 release 必跑 | 影响 release 时间 | 当前核心进入 operations-replay-core,扩展留 nightly |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能和红线均有验证方式 | 通过 | 见 §8.1~§8.6 |
| 非功能指标没有无来源硬阈值 | 通过 | 性能数字只作 sample / trend |
| 可观测性可通过证据验证 | 通过 | log/metric/audit/report/redaction 均有检查 |
| fake / controlled parity 已进入专项 | 通过 | 见 §8.1 / §8.7 |
| 跨专项审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 11 | 待用户确认 | 用户审核通过后进入 Step 11: 定义缺陷管理与复验规则 |
