# Step 10. 设计专项测试与非功能验证

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 设计专项测试与非功能验证 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00` 非功能需求;Step 2 范围;Step 6 用例;Step 8 环境;Step 9 门禁;`03` 事务 / 错误 / 幂等 / 观测;`04` 失效策略 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_10_nonfunctional.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

定义性能、安全、一致性、恢复、观测、审计、配置失效和依赖边界专项测试,并明确每个专项的测试方法、环境、通过口径和候选证据。

本 Step 只回答:

- 哪些非功能指标或风险必须验证。
- 哪些红线必须做负向测试。
- 哪些一致性、恢复和故障注入场景必须自动化。
- 哪些日志、指标、审计、trace、report 和 redaction 证据必须存在。
- 哪些阈值有正式来源,哪些只能作为候选采样或残余风险。

本 Step 不定义正式验收通过 / 不通过裁决,不把旧性能数字硬化为 P0 阈值,不要求真实 DB / bus / external GRC / production-like 环境,不生成正式 EV 编号。正式证据编号由 Step 13 固定,验收裁决由新版 `06-验收标准.md` 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | 正式输入 | 提供非功能类别、AC-GOV-026~031、VF-GOV-001~010 和候选性能目标 |
| `05_test_plan_step_02_scope.md` | 已完成 | 固定 P0/P1/P2,说明硬性能阈值和真实产品不属于 P0 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-IDEMP-*、TC-GOV-CONFIG-*、TC-GOV-REDACTION-*、TC-GOV-ARCH-* 等专项用例 |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供 P0 profile、integration-like、operations-replay 和 P1/P2 环境边界 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 blocking suite、redaction/dependency/report checks 和 release smoke |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 UoW、version、stored result/report、outbox snapshot、projection/reference consistency |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 retryable/permanent、rollback failure、commit unknown、unsupported version、dead-letter |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 duplicate replay、same-key conflict、race guard 和 idempotency namespace |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 logs、metrics、audit、trace、handoff 和 redaction 字段边界 |
| `04-配置设计.md` §11 / §12 | 正式输入 | 提供 config fail-fast、degraded/no-write、redaction fail-closed 和配置门禁 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些性能指标必须验证? | P0 必须验证“基础主链不被外围增强阻断”的结构性性能口径:command/query/job 在 fake/controlled profile 下产出 duration/count sample,且 release smoke 不依赖高级 DSL、真实 GRC、高级看板或 production adapter。旧 `RaiseGate P95 < 150ms`、`DecideGate P95 < 200ms`、`GetApplicablePolicies P95 < 50ms`、`Policy 下发生效 < 30s`、`SLA >= 99.95%` 仅作为候选采样字段,不作为当前 P0 pass 阈值。 |
| 哪些安全和边界红线必须负向测试? | VF-GOV-002~010 均必须负向覆盖:相邻仓状态不能替代 Decision truth;外部正文 / secret / package body 不得入 truth/outbox/audit/trace/report/artifact;runtime/method 不得反向定义 Policy truth;低 scope 不得覆盖 shared rules;正式 Decision 不得原地改写;Nonconformity 不得退化;query/job 不得反写真相;非 core sibling 不得成为 compile dependency。 |
| 哪些一致性和恢复场景必须故障注入? | UoW begin/commit/rollback failure、commit unknown、version conflict、unique conflict、outbox append failure、stored result/report missing、idempotency complete failure、same-key conflict、consumer duplicate、job duplicate、publisher retryable/permanent failure、projection rebuild race、reference refresh failure、handoff/export target disabled 都必须通过 fake / controlled fault injection 验证。 |
| 哪些日志、指标和审计证据必须存在? | Accepted truth change 必须有 trace/audit/history/outbox/result;rejected/unsupported/failed path 必须有 structured log / metric / rejected report or marker,不得伪造成 accepted trace。指标只能用低基数 label。redaction report、dependency boundary report、write-audit report、job report、gate summary 和 report pairing audit 均为候选证据输入。 |
| 阈值来自哪里? | P0 通过条件来自正式需求、详细设计、配置设计和 Step 6/9 的可判定断言,不是旧性能数字。当前没有正式负载模型、真实产品 profile 或硬 SLO 基线,因此性能数字只记录 sample/trend。若后续要求 performance pass,必须先回写 `05/06/07/09` 或容量基线。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `00` §13 | 提到旧性能数字,但声明只是候选目标 | 本 Step 不把旧数字写成 P0 阈值 |
| Step 5 | AC-GOV-026~031 已映射,但未形成专项矩阵 | 本 Step 生成专项测试矩阵 |
| Step 6 | 已有 idempotency/config/redaction/dependency 用例 | 本 Step 汇总为非功能专项 |
| Step 9 | 已有 suite/gate,但未说明专项归属 | 本 Step 将专项映射到 suite / report |
| `03` Step 15 | 观测字段边界清楚,但测试方案需要可验证证据 | 本 Step 固定 log/metric/audit/redaction evidence candidate |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能 | 只有候选目标和范围说明 | 固定 P0 结构性验证 + sample/trend,不设硬阈值 | 缺正式负载模型和产品基线 |
| 安全红线 | 分散在 VF / 用例 / redaction | 汇总为安全专项矩阵 | 一票否决风险必须集中可审 |
| 一致性恢复 | 分散在 Step 6 用例 | 汇总故障注入矩阵 | 便于 implementation gate 承接 |
| 观测审计 | 详细设计有字段表 | 测试方案定义必须产生的 report / scan / audit | 可交给 Step 13 归档 |
| P1/P2 | 易被误写成当前 pass 条件 | 明确只采样或残余风险 | 防止伪 pass |

## 7. 专项测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 性能阈值是否硬化 | A. 继承旧 P95/SLA;B. 只做 sample/trend | 采用 B。旧数字没有正式基线来源 |
| 安全 redaction 是否只扫 report | A. 只扫 report;B. artifact + report + negative leak fixture | 采用 B。泄露可能发生在 raw artifact |
| 可用性是否要求真实外部依赖 | A. 要求真实依赖;B. fake/controlled failure mapping | 采用 B。P0 证明语义,真实产品留 P1/P2 |
| 可观测性是否写业务 audit for query | A. 写 audit;B. query no-write,只写 log/metric | 采用 B。符合详细设计 |
| 一致性是否靠 E2E 判断 | A. E2E;B. fake UoW/repository/adapter fault injection | 采用 B。需要精确断言 no write / rollback |

## 8. 结构化中间产物

### 8.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 性能结构性验证 | 核心 command/query/job 不被外围增强阻断 | release smoke + duration sample;禁用高级 DSL/外部 GRC/真实 dashboard;记录 duration/count | `ci-test`;`integration-like`;release gate | 无硬 P95;必须产生 duration sample,且不依赖 P1/P2 能力 | EV-CAND-GOV-NFR-PERF-001 |
| 可用性 / 降级 | 外部依赖延迟不造 truth | resolver unavailable、projection/reference missing、publisher/handoff failure injection | `integration-like`;`operations-replay` | command/query/consumer/job 返回正式 degraded/delayed/failed marker;core truth unchanged | EV-CAND-GOV-NFR-AVAIL-001 |
| 安全 / 正文边界 | raw body/secret/full sensitive ref 入仓或输出 | forbidden body negative fixtures + redaction scan | `ci-test`;release gate | redaction clean;negative leak fixture must fail without echoing secret | EV-CAND-GOV-REDACTION-* |
| 授权 / 治理约束 | 高影响裁决绕过 responsibility/policy/shared rules | policy/domain/service negative cases | `ci-test` | unauthorized / low-scope override / automation bypass rejected;no accepted trace | EV-CAND-GOV-STATE-*;EV-CAND-GOV-CMD-* |
| 审计 / 可追溯 | accepted truth 无 trace/audit/outbox/result | command/service assertions + trace query | `ci-test`;release smoke | accepted truth change has trace/audit/history/outbox/stored result;rejected path not accepted trace | EV-CAND-GOV-TRACE-* |
| 幂等 / 一致性 | duplicate 分叉、current truth 重算、commit unknown 盲写 | fake idempotency/UoW/repository fault injection | `ci-test`;`operations-replay` | duplicate replays stored result/receipt/report;missing result errors;no second truth write | EV-CAND-GOV-IDEMP-* |
| 恢复 / 维护 | publish/rebuild/refresh/reconcile/handoff partial failure | operations replay with retryable/permanent failures | `operations-replay`;nightly | report/marker reflects partial/failed;no core truth repair;terminal markers not republished | EV-CAND-GOV-JOB-*;EV-CAND-GOV-OUTBOX-* |
| 可观测性 | key changes / boundary failures / maintenance state not observable | structured log/metric/audit scan | main CI;release gate | required log/metric/audit/report refs present;metric labels low-cardinality | EV-CAND-GOV-NFR-OBS-001 |
| 配置失效 | invalid config silent fallback or unsafe runtime | strict JSON/source priority/topic/profile/runtime builder tests | PR;main;release | invalid config fail-fast/reject;no partial facade;no lower-priority fallback | EV-CAND-GOV-CONFIG-* |
| 依赖边界 | non-core sibling compile dependency | generated dependency graph scan | PR;main;release | only `L0-core` / `core-contracts` compile-time upstream;others runtime/event/replay only | EV-CAND-GOV-ARCH-001 |

### 8.2 性能专项口径表

| 项 | 当前口径 | 测试方式 | 是否 P0 pass 阈值 |
|---|---|---|---|
| Governance context / gate / decision latency | 不应成为主链瓶颈 | release smoke and service-flow duration sample | 否,只记录 sample |
| Policy / Control applicability latency | 不应被高级 DSL / simulation / external sync 阻断 | service-flow sample with DSL/external GRC disabled | 否,只记录 sample |
| Query / trace read latency | 基础读取不被高级 dashboard / archive 阻断 | query suite duration sample | 否,只记录 sample |
| Outbox / consumer lag | 事件输出可维护,失败有 marker/report | operations replay counts/duration | 否,只记录 sample |
| Job / report completion | 维护 job 生成 report,partial failure 可见 | operations replay job duration/report count | 否,只记录 sample |
| 旧 `RaiseGate P95 < 150ms` | 候选目标 | 后续容量基线可继承 | 否 |
| 旧 `DecideGate P95 < 200ms` | 候选目标 | 后续容量基线可继承 | 否 |
| 旧 `GetApplicablePolicies P95 < 50ms` | 候选目标 | 后续容量基线可继承 | 否 |
| 旧 `SLA >= 99.95%` | 候选目标 | 需要 production-like SLO 定义 | 否 |

### 8.3 安全 / 边界红线专项表

| 红线 | 负向输入 | 断言 | Suite / Gate | 候选证据 |
|---|---|---|---|---|
| VF-GOV-002 Decision truth 不可被相邻状态替代 | process waiting/work lifecycle/conversation card/runtime cache attempts | only refs/snapshots accepted;Decision truth unchanged | `service-flow-fast`;`release-main-smoke` | EV-CAND-GOV-BOUNDARY-* |
| VF-GOV-003 外部正文不得保存 | artifact/evidence/method/runtime/observability/external body fixture | rejected or body-free snapshot;redaction clean | `redaction-boundary` | EV-CAND-GOV-REDACTION-* |
| VF-GOV-004 Policy truth 不可被 runtime/method 反向定义 | runtime cache/capability whitelist/method definition update | PolicyEffectiveFact unchanged unless formal command | `service-flow-fast` | EV-CAND-GOV-POLICY-* |
| VF-GOV-005 shared rules 不可被低 scope 覆盖 | lower scope override | rejected or conflict record;organization hard rule active | `contract-domain-fast`;`service-flow-fast` | EV-CAND-GOV-STATE-* |
| VF-GOV-006 Decision 不可原地改写 | update finalized decision in-place | supersede creates new fact;original history intact | `contract-domain-fast`;`service-flow-fast` | EV-CAND-GOV-STATE-* |
| VF-GOV-007 AIIA/SoA body boundary | compliance conclusion with artifact body | body rejected;conclusion refs artifact/evidence only | `redaction-boundary`;`service-flow-fast` | EV-CAND-GOV-COMPLIANCE-* |
| VF-GOV-008 Nonconformity 不得退化 | close by bug/work blocker/alert only | rejected;formal cause/action/verification required | `contract-domain-fast`;`service-flow-fast` | EV-CAND-GOV-NC-* |
| VF-GOV-009 read/job no truth repair | query/rebuild/reconcile/handoff tries mutate truth | write audit clean;truth unchanged | `operations-replay-core` | EV-CAND-GOV-JOB-* |
| VF-GOV-010 dependency boundary | manifest contains process/work/artifact/etc path dependency | check fails | `dependency-boundary` | EV-CAND-GOV-ARCH-001 |

### 8.4 一致性 / 恢复故障注入矩阵

| 故障 | 注入位置 | 预期行为 | Suite | 候选证据 |
|---|---|---|---|---|
| version conflict | truth/projection/reference/outbox repository | operation fails or partial report;caller reload required;no overwrite | `service-flow-fast`;`operations-replay-core` | EV-CAND-GOV-IDEMP-* |
| UoW commit unknown | fake UoW commit | retry checks idempotency/result/truth before action;no blind second write | `service-flow-fast` | EV-CAND-GOV-IDEMP-004 |
| rollback failure | fake UoW rollback | safe diagnostic / manual intervention surface;no hidden compensating write | `fault-injection-matrix` | EV-CAND-GOV-IDEMP-013 |
| outbox append failure | accepted command transaction | entire transaction rolled back;truth/result not visible | `service-flow-fast` | EV-CAND-GOV-CMD-028 |
| stored result failure | result repository | idempotency not completed;truth/outbox not committed | `service-flow-fast` | EV-CAND-GOV-CMD-029 |
| duplicate stored result missing | idempotency result lookup | consistency error;no recompute from current truth | `infra-runtime-fake` | EV-CAND-GOV-IDEMP-002 |
| unsupported event version | worker envelope | payload not parsed;no snapshot/stale/accepted trace | `entry-worker-job` | EV-CAND-GOV-CONSUMER-012 |
| publisher retryable/permanent failure | fake publisher | failed/dead-letter marker and report;accepted truth unchanged | `operations-replay-core` | EV-CAND-GOV-OUTBOX-013~014 |
| projection rebuild race | projection repository | older cursor skipped/rejected;newer fresh state preserved | `operations-replay-extended` | EV-CAND-GOV-IDEMP-008 |
| reference refresh failure | fake resolver | last good snapshot retained;affected views stale;partial report | `operations-replay-core` | EV-CAND-GOV-IDEMP-010 |
| handoff/export target disabled | handoff/export adapter | job rejected/failed marker;no package/document body | `operations-replay-core` | EV-CAND-GOV-JOB-005~007 |

### 8.5 观测 / 审计证据矩阵

| 观测对象 | 必须存在 | 禁止内容 | 检查方式 | 候选证据 |
|---|---|---|---|---|
| structured logs | operation kind、status、error kind、diagnostic ref、duration/count | raw body、secret、stack trace、adapter response | redaction scan + log fixture assertions | EV-CAND-GOV-NFR-OBS-001 |
| metrics | low-cardinality labels for operation/result/error/job/view kind | actor ref、subject ref、trace id、outbox id、free text、secret | metric label scan | EV-CAND-GOV-NFR-OBS-002 |
| accepted trace/audit | trace record ref、audit trail ref、history/outbox/result refs | external body、trace body copy、secret | service assertions + trace query | EV-CAND-GOV-TRACE-* |
| rejected / unsupported path | log/metric/rejected receipt/report or diagnostic ref | accepted truth trace/outbox | service/worker assertions | EV-CAND-GOV-CONSUMER-* |
| job reports | item counts、failed refs/markers、report state、safe failure reason | package/export body、external response | operations replay report | EV-CAND-GOV-JOB-* |
| redaction report | clean scan or safe failure ref | detected raw value echo | `check_redaction.sh` | EV-CAND-GOV-REDACTION-* |
| dependency report | compile dependency graph and allowed upstream | hidden sibling package dependency | `check_dependency_boundary.sh` | EV-CAND-GOV-ARCH-001 |

### 8.6 专项到自动化 suite 映射表

| 专项 | Primary suite | Secondary gate | P0 blocking |
|---|---|---|---|
| 性能结构性 sample | `release-main-smoke` | `service-flow-fast`;`operations-replay-core` | blocking only for missing sample or dependency on P1/P2,not numeric threshold |
| 可用性 / 降级 | `operations-replay-core` | `infra-runtime-fake` | 是 |
| 安全 / redaction | `redaction-boundary` | `release-redaction-boundary` | 是 |
| 授权 / governance constraints | `contract-domain-fast`;`service-flow-fast` | release smoke representative scenario | 是 |
| 审计 / traceability | `service-flow-fast`;`release-main-smoke` | `report-generation-audit` | 是 |
| 幂等 / 一致性 | `infra-runtime-fake`;`operations-replay-core` | nightly fault matrix | 是 |
| 恢复 / maintenance | `operations-replay-core` | `operations-replay-extended` | 是 |
| observability / low-cardinality | `redaction-boundary`;`report-generation-audit` | release report audit | 是 |
| config fail-fast | `config-redline` | release config redline | 是 |
| dependency boundary | `dependency-boundary` | release dependency boundary | 是 |

### 8.7 专项停审记录

| 专项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| 性能 | 是否避免无来源硬阈值 | 通过 | 只记录 sample/trend;硬阈值留 P2 |
| 可用性 / 降级 | 是否覆盖 external dependency unavailable | 通过 | 使用 fake/controlled failure injection |
| 安全 / redaction | 是否覆盖 raw body/secret/full ref | 通过 | artifact + report scan |
| 授权 / governance constraints | 是否覆盖 shared rules、高影响裁决、automation bypass | 通过 | 由 domain/service negative case 覆盖 |
| 审计 / traceability | 是否 accepted truth 可追溯且 rejected 不伪造 accepted trace | 通过 | trace/audit/outbox/result 断言 |
| 幂等 / 一致性 | 是否覆盖 duplicate、stored missing、commit unknown、race | 通过 | fake UoW/repository/idempotency |
| 恢复 / maintenance | 是否 partial failure 可见且 no truth repair | 通过 | operations replay |
| observability | 是否 log/metric/audit 字段可验证 | 通过 | redaction + low-cardinality checks |
| config | 是否 invalid config fail-fast and no silent fallback | 通过 | config-redline |
| dependency | 是否 VF-GOV-010 自动检查 | 通过 | dependency-boundary |

### 8.8 跨专项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| AC-GOV-026~031 是否均有专项验证 | 通过 | 见 §8.1 / §8.6 |
| VF-GOV-002~010 是否有负向测试 | 通过 | 见 §8.3 |
| 是否存在无来源性能阈值 | 通过 | 旧 P95/SLA 仅候选 |
| 是否把 P1/P2 环境写成 P0 pass | 通过 | real-like/production-like 不阻断 P0 |
| 是否有故障注入覆盖一致性恢复 | 通过 | 见 §8.4 |
| 是否有 observability evidence | 通过 | logs/metrics/audit/report/redaction 均映射 |
| 是否提前固定正式 EV | 通过 | 仍使用 EV-CAND |

## 9. 对上游设计的影响判定

| 专项结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 旧 P95/SLA 不能作为 P0 阈值 | 否 | 需求已声明为候选目标 | Step 14 记录残余风险 |
| P0 使用 fake/controlled failure injection | 否 | 测试方案细化 | 符合产品中立和 Step 8 环境 |
| Redaction / dependency / no truth repair 均阻断 P0 | 否 | 门禁细化 | Step 9 已承接 |
| 若验收方要求 numeric performance pass | 是 | 验收基线变更 | 需回写 `05/06/07/09` 或容量基线 |
| 若真实 product adapter 变为 P0 | 是 | 范围变更 | 需回写环境、数据、门禁和实施计划 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_10_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“专项测试矩阵”“性能专项口径表”“安全 / 边界红线专项表”“一致性 / 恢复故障注入矩阵”“观测 / 审计证据矩阵”和“跨专项审计表”小节,了解非功能验证如何从需求和详细设计收敛。

正式 `05-测试方案.md` §10 应回填:

- 专项测试覆盖性能结构性验证、可用性 / 降级、安全 / redaction、授权约束、审计追溯、幂等一致性、恢复维护、可观测性、配置失效和依赖边界。
- 性能当前只记录 sample/trend 和“核心主链不依赖外围增强”的结构性验证,不设置旧 P95/SLA 为 P0 pass 阈值。
- 安全和边界红线必须通过负向测试和 redaction / dependency checks 阻断。
- 一致性和恢复必须通过 fake UoW、repository、resolver、publisher、handoff/export fault injection 验证。
- Query no-write、job no truth repair、accepted trace/audit/outbox/result 和 rejected not accepted trace 都必须可验证。
- 所有专项 evidence 仍使用 `EV-CAND-*`;正式 evidence ID 和验收引用由 Step 13 / 新版 `06` 固定。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 P95/SLA 是否未来硬化 | 影响性能 release gate | 当前不硬化;Step 14 记录残余风险 |
| 生产-like / staging-like 是否提前成为 P0 | 影响环境、数据和 gate | 当前不升级;需要正式基线变更 |
| observability backend 真实产品 | 影响日志/指标/trace 物理证据 | 当前只验证安全字段和 artifact/report |
| fault-injection-matrix 是否 release 必跑 | 影响 release 时间 | 当前核心进入 operations-replay-core,扩展矩阵留 nightly |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能和红线均有验证方式 | 通过 | 见 §8.1~§8.6 |
| 非功能指标没有无来源硬阈值 | 通过 | 性能数字只作候选 |
| 可观测性可通过证据验证 | 通过 | log/metric/audit/report/redaction 均有检查 |
| 跨专项审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 可进入 Step 11 | 通过 | 下一步定义缺陷管理与复验规则;进入前等待用户审查 |
