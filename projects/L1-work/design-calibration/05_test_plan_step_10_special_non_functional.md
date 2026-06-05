# Step 10. 设计专项测试与非功能验证

> 本步定义 `05-测试方案.md` §10 的专项测试与非功能验证矩阵。本步只承接 `00/03/04` 已有非功能、事务、错误、并发、配置和观测契约,不新增性能硬指标、不写压测脚本、不做验收裁决。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 10 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §10 专项测试与非功能验证 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §13 / §14 | 取得性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性要求和 `AC-WORK-024`~`029` |
| `03-详细设计.md` §10 / §11 / §12 / §14 / §15 | 取得事务、错误恢复、并发幂等、观测审计和最小验证切口 |
| `04-配置设计.md` §8 / §9 / §10 / §11 / §12 | 取得 sensitive / forbidden output、配置加载校验、fail-fast / fail-closed、redaction gate 和证据路径 |
| `05_test_plan_step_05_traceability_coverage.md` | 取得 `AC-WORK-024`~`029` 与 `EV-WORK-NFR-*` 编号族 |
| `05_test_plan_step_06_cases_matrix.md` | 取得 `TC-WORK-NFR-001`~`005` 和相关 `CFG` / `OPS` / `QUERY` 用例 |
| `05_test_plan_step_08_environment_config.md` | 取得 `ci-test`、`integration-like`、`operations-replay` 环境边界和不可用处理 |
| `05_test_plan_step_09_automation_gates.md` | 取得 automation suite、gate、check、report、artifact / report 路径和阻断规则 |
| `测试方案讨论流程_SOP.md` Step 10 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些性能指标必须验证? | P0 只验证有来源的运行边界和退化风险: command / query / job 耗时样本必须被采集并进入报告,`boundary.query_read_timeout`、`store.transaction_timeout`、`jobs.job_timeout` 等配置阈值必须生效。旧 `CreateWorkItem P95 < 100ms` / `GetProjectBoard P95 < 300ms` 仅作为候选观察项,不升级为 P0 release 硬阈值。 |
| 哪些安全和边界红线必须负向测试? | raw secret、raw token、raw payload、source body、ImplementationPlan body、runtime progress body、artifact / evidence body 不得进入配置、truth、event、log、audit、report 或 artifact;未授权 query / command 必须 `NotVisible` 或 reject;配置不得关闭 truth / metadata / idempotency / visibility / audit / outbox / redaction 边界。 |
| 哪些一致性和恢复场景必须故障注入? | duplicate、same key different digest、version conflict、commit unknown、publisher failure、resolver unavailable、projection rebuild failure、reference refresh failure、handoff failure、replay baseline mismatch 均必须有故障注入或 replay 用例。 |
| 哪些日志、指标和审计证据必须存在? | accepted / rejected / failed / duplicate / conflict / unavailable / stale / rebuilt / published / handoff failed 场景必须有 safe structured log、low-cardinality metric、trace / audit / outbox 或 job report 证据。 |
| 阈值来自哪里? | 只使用 `03-详细设计.md` 与 `04-配置设计.md` 已定义的 config timeout / batch / retry / stale threshold / page limit / body limit / report path / redaction gate 作为 P0 阈值来源;旧性能数字无正式硬阈值来源,只进入观察报告和 Step 14 风险。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `00-需求文档.md` §13 | 非功能类别已定义,但旧性能数字仍是候选目标 | 本步明确不设 P0 性能硬阈值,只采集样本并验证配置 timeout / gate |
| Step 5 / Step 6 | `NFR` 编号族和用例已存在,但专项矩阵未展开 | 本步把 `TC-WORK-NFR-001`~`005` 映射到专项、方法、环境和证据 |
| Step 8 / Step 9 | 已有环境、gate 和 redaction 脚本边界,但没有专项阻断矩阵 | 本步定义 P0 redline、故障注入和证据 presence 的阻断口径 |
| `04-配置设计.md` §8 / §11 | 已定义 raw material 禁止和 fail-fast / fail-closed,但测试专项未集中承接 | 本步把 raw material、forbidden boundary、fake marker、configured adapter unavailable 纳入安全 / 可用性专项 |
| 旧 `05-测试方案.md` | 旧性能 / 安全 / 观测表不能对应新版 `EV-WORK-*` | 本步重建正式 §10 回填草稿 |

## 5. 改动前后对比

| 维度 | Step 9 后 | Step 10 收敛后 |
|---|---|---|
| 非功能覆盖 | 有 `NFR` 用例候选和 gate | 专项矩阵明确性能、安全、可用性、恢复、一致性、观测和审计 |
| 性能口径 | `AC-WORK-024` 待细化 | 不设旧数字硬阈值;采集样本并验证正式 timeout / batch / page / body limit |
| 安全红线 | redaction gate 已定义 | raw secret / token / payload / body 泄露一票阻断 |
| 故障注入 | 分散在 OPS / CFG / NFR 用例 | 形成故障注入矩阵和恢复通过条件 |
| 证据要求 | gate / report 路径已定义 | 每个专项映射到 `EV-WORK-NFR-*`、`EV-WORK-CFG-*` 或 `EV-WORK-OPS-*` |
| 上游影响 | 无 | 无;本步不新增配置、DTO、错误、状态或硬性能指标 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 将旧 `100ms / 300ms` 候选值设为 P0 release 硬阈值 | 看起来明确 | 需求文档已说明旧数字只是候选,缺少环境和容量来源 | 不采用 |
| 方案 B: P0 性能只采集样本,但验证正式 timeout、page limit、body limit、batch、retry 和 report presence | 来源清晰,不虚构容量承诺 | 不能给出生产性能 SLA | 采用 |
| 方案 C: 安全 / redaction 只做人工审查 | 成本低 | raw material 泄露是 release redline,人工不能替代阻断 gate | 不采用 |
| 方案 D: 故障恢复只在 nightly 跑 | main CI 快 | P0 恢复和一致性错误可能进入 release | 不采用;核心恢复进 main / release,长耗时 stress 进 nightly |

采用方案 B,并要求安全红线、幂等一致性、可恢复性、观测证据进入 P0 自动化。

原因:

- `L1-work` 当前目标是核心工作事实闭环和可落码设计验证,不是生产容量承诺。
- 安全、幂等、一致性和可观测性是需求一票否决和详细设计最小验证清单,必须可自动化留证。
- 所有 P0 通过条件都必须能回指 `00/03/04` 已定义契约,不得由测试方案自行发明阈值。

## 7. 结构化中间产物

### 7.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 性能观察 | 核心 command / query / job 不成为明显瓶颈;旧性能数字只作候选 | 对 `CORE` / `FORMAL` / `QUERY` / `OPS` smoke 采集 `duration_ms`、item count、batch size、page size | `ci-test`;nightly 可扩展 | 报告必须包含样本、P50 / P95 观察值、fixture 规模和 config profile;不以旧 `100ms / 300ms` 作为 P0 release fail 条件 | `EV-WORK-NFR-001`;`reports/runs/<run_id>/nfr-performance.md` |
| 运行边界性能 | query timeout、transaction timeout、job timeout、batch、page、body limit 是否生效 | 构造超时、超 page、超 body、非法 batch / retry 输入 | `ci-test` | 触发正式 config / handler 阈值时 fail-fast、reject 或 timeout surface;不得 silent truncate 或改用默认值 | `EV-WORK-CFG-005`~`009`;`EV-WORK-NFR-001` |
| 可用性 / 降级 | 外部依赖延迟或失败不得导致 Work 造真相 | 注入 resolver unavailable、publisher failure、projection failed、handoff failure | `ci-test`;`integration-like`;`operations-replay` | core truth closure 不被外部失败破坏;返回 `TemporarilyUnavailable`、`Unresolved`、`Failed`、`Stale` 或 failed marker;不得 fake success | `EV-WORK-NFR-002`;`EV-WORK-OPS-*` |
| 安全 / 授权 | unauthorized access、forbidden body、相邻仓正文和敏感材料泄露 | command / query unauthorized negative、forbidden output scan、DTO / event / report dump scan | `ci-test`;release gate | unauthorized -> `NotVisible` / reject;raw secret / token / payload / source body / ImplementationPlan body / runtime body 零命中;命中一票阻断 | `EV-WORK-NFR-003`;`EV-WORK-CFG-010`~`012`;redaction report |
| 幂等 / 一致性 | duplicate、conflict、version conflict、commit unknown 不产生重复 truth | same key same digest、same key different digest、并发 review、commit unknown retry | `ci-test`;nightly stress | duplicate 返回既有 result;conflict reject;single-winner;commit unknown 先查 idempotency;无重复 Project / Work / trace / outbox | `EV-WORK-NFR-004`;`EV-WORK-CORE-004`;`EV-WORK-PROMOTE-005` |
| 可恢复性 | publish / projection / reference / handoff / replay failure 可恢复且不改业务真相 | failure injection、rerun job、operations replay、baseline mismatch | `ci-test`;`operations-replay`;release selected | failed marker 可见;retry 后按正式状态推进;reconciliation read-only;baseline mismatch fail-fast;不得自动修 truth | `EV-WORK-OPS-001`~`006`;`EV-WORK-NFR-002` |
| 可观测性 | 核心变化、边界越界、依赖延迟和维护状态可发现 | 收集 structured log、metric、trace / audit / outbox / job report | `ci-test`;main CI;release gate | 必须包含 `trace_context_ref` / `request_id` / `operation` / `status` / `error_kind` / `duration_ms` 等 safe 字段;metric label low-cardinality;无 raw body / secret | `EV-WORK-NFR-005`;`EV-WORK-QUERY-*`;`EV-WORK-OPS-*` |
| 审计 / 可追溯 | Project、Member、Work、Iteration、promote、completion / blocker / maintenance 可解释 | accepted command、reject command、job report、trace page cross-check | `ci-test`;release smoke | accepted truth change 有 trace / audit / outbox 或 report;reject 有 sanitized reason;query 能回读解释链 | `EV-WORK-CORE-*`;`EV-WORK-DEP-*`;`EV-WORK-NFR-005` |

### 7.2 性能专项口径表

| 项 | P0 口径 | 是否 release 硬阈值 | 来源 | 说明 |
|---|---|---|---|---|
| `CreateWorkItem P95 < 100ms` | 观察候选 | 否 | `00-需求文档.md` §13 旧候选目标 | 需要后续固定环境、容量模型和实现基准后才能升级 |
| `GetProjectBoard P95 < 300ms` | 观察候选 | 否 | `00-需求文档.md` §13 旧候选目标 | 高级 board / projection 仍受 feature 和 projection state 影响 |
| `boundary.query_read_timeout = 2s` | 必须验证 timeout 生效 | 是,按配置契约 | `04-配置设计.md` §7 | 超时必须返回正式 query timeout / degraded surface,不得写状态 |
| `store.transaction_timeout = 5s` | 必须验证配置可解析、非正数 fail-fast | 是,按配置契约 | `04-配置设计.md` §7 / §9 | 不要求人为制造真实 DB 锁超时 |
| `jobs.job_timeout = 300s` | 必须验证 job-run-start 参数和非法值处理 | 是,按配置契约 | `04-配置设计.md` §7 / §9 | P0 用例不跑 300s,只验证配置和超时 surface |
| `boundary.max_page_limit = 100` | 必须验证 page limit | 是,按配置契约 | `04-配置设计.md` §7 | 超限 reject 或 clamp 口径必须按 handler 设计,不得 silent over-read |
| `boundary.max_command_body_bytes = 1048576` | 必须验证 body limit | 是,按配置契约 | `04-配置设计.md` §7 | 超限请求 reject;不得落入 domain truth |
| `jobs.default_batch_size = 100` / `outbox.publish_batch_size = 100` | 必须验证 batch 配置和非法值 | 是,按配置契约 | `04-配置设计.md` §7 | 实测吞吐不在 P0 设硬指标 |

### 7.3 安全与边界红线矩阵

| 红线 | 测试方法 | 阻断条件 | 证据 |
|---|---|---|---|
| raw secret / raw token 不得出现 | 配置、env capture、log、audit、report、artifact scan | 任一 raw secret / token 命中 | `EV-WORK-CFG-010`~`012`;redaction report |
| raw payload / source body 不得出现 | DTO / event / repository dump / report scan | source body、provider response body、runtime progress body、ImplementationPlan body 命中 | `EV-WORK-FORMAL-004`;`EV-WORK-PROMOTE-004`;`EV-WORK-NFR-003` |
| 未授权访问不得返回 truth | command / query unauthorized negative | 返回 visible truth 或写入 truth | `EV-WORK-QUERY-001`;`EV-WORK-NFR-003` |
| 配置不得关闭核心边界 | 提供关闭 truth / metadata / idempotency / visibility / audit / outbox / redaction 的配置 | runtime build 成功或 silent ignore | `EV-WORK-CFG-017` |
| configured adapter 不得 fallback fake success | 缺 endpoint / credential ref 或 provider unavailable | 自动使用 fake 并返回 success | `EV-WORK-CFG-013` / `014`;fake marker check |
| query / projection / reconciliation 不得反写真相 | query、projection rebuild、reconciliation read-only 用例 | 写入 Project / Work / Iteration truth | `EV-WORK-QUERY-*`;`EV-WORK-OPS-004` |
| report / artifact 路径不得用 `latest` | path check | 出现 `latest` 或 `artifacts/test/<project>/<run_id>` | `EV-WORK-NFR-005`;path validation report |

### 7.4 故障注入与恢复矩阵

| 故障 | 注入方法 | 预期恢复 / 失败口径 | 环境 | 证据 |
|---|---|---|---|---|
| duplicate command | same key same digest 重放 | 返回既有 result;无新 truth / outbox | `ci-test` | `EV-WORK-CORE-004` |
| idempotency conflict | same key different digest | `IdempotencyConflict`;无业务副作用 | `ci-test` | `EV-WORK-NFR-004` |
| version conflict | 并发 review / lifecycle update | single-winner;loser `VersionConflict`;无 loser outbox | `ci-test`;nightly stress | `EV-WORK-PROMOTE-005` |
| commit unknown | UoW commit 后响应丢失或状态未知 | retry 先查 idempotency;不重复提交 | `ci-test`;nightly | `EV-WORK-NFR-004` |
| publisher failure | fake publisher 返回 failure | business truth 保留;outbox `Failed`;retry 可推进 | `ci-test`;`operations-replay` | `EV-WORK-OPS-001` |
| projection rebuild failure | projection builder 注入失败 | freshness `Failed`;query surface 可解释;retry 后可 Fresh | `ci-test`;`operations-replay` | `EV-WORK-OPS-002` |
| resolver unavailable | identity / source / evidence resolver unavailable | unresolved / failed marker 或 sanitized reject;不造 truth | `ci-test`;`integration-like` | `EV-WORK-NFR-002`;`EV-WORK-CFG-014` |
| handoff failure | trace / archive handoff target failure | failed marker / failed report;不保存 external body;rerun 幂等 | `ci-test`;`operations-replay` | `EV-WORK-OPS-005` / `006` |
| replay baseline mismatch | replay config digest 与 bundle baseline 不匹配 | replay fail-fast;不修 truth | `operations-replay` | `EV-WORK-CFG-004`;`EV-WORK-OPS-*` |
| forbidden output hit | scan fixture 故意注入 sentinel | gate 阻断;报告只写 sanitized hit location | `ci-test`;release gate | `EV-WORK-NFR-003` |

### 7.5 可观测性与审计证据矩阵

| 场景 | 必须存在的安全字段 | 禁止字段 | 验证方式 | 证据 |
|---|---|---|---|---|
| accepted command | `trace_context_ref`、`request_id`、`operation`、`actor_ref`、`subject_ref`、`status=accepted`、`result_ref`、`duration_ms` | raw request body、source body、secret、token | structured log + audit + outbox cross-check | `EV-WORK-NFR-005`;对应 `EV-WORK-*` |
| rejected command | `request_id`、`operation`、`status=rejected`、`error_kind`、sanitized reason | raw invalid body、secret、external body | error surface + log scan | `EV-WORK-NFR-003` / `005` |
| duplicate / conflict | `idempotency_key_ref` 或 safe digest ref、`status=duplicate/conflict`、`operation` | full idempotency key secret-like value、raw payload | idempotency report + log scan | `EV-WORK-NFR-004` |
| query not visible / stale / failed | `consumer_ref`、`view_kind`、`status`、`freshness_state`、`duration_ms` | hidden subject body、projection body dump | query response + no-write assertion | `EV-WORK-QUERY-*` |
| outbox publish failed | `outbox_record_ref`、`event_kind`、`status=failed`、`error_kind` | event raw body dump、credential | outbox state + publisher report | `EV-WORK-OPS-001` |
| projection rebuild | `projection_ref`、`view_kind`、`status`、`source_cursor_ref` | full projection body dump | job report + query surface | `EV-WORK-OPS-002` |
| reference refresh failed | `external_ref`、`adapter_kind`、`status=failed/unresolved`、`error_kind` | provider response body、credential | reference state + safe log | `EV-WORK-OPS-003` |
| handoff failed | `handoff_ref`、`target_kind`、`status=failed`、`error_kind` | observability / archive body、credential | handoff report + redaction scan | `EV-WORK-OPS-005` / `006` |
| reconciliation gap | `report_ref`、`scope_ref`、`gap_kind`、`status` | truth body dump、projection body dump | read-only report + no-write assertion | `EV-WORK-OPS-004` |

### 7.6 专项到自动化 suite 映射

| 专项 | PR | Main CI | Nightly | Release gate |
|---|---|---|---|---|
| 性能观察 | smoke sample in `service-core` | `service-all` / `integration-p0` reports | extended sample | release summary includes latest explicit run sample,not hard threshold |
| 运行边界性能 | `config-fast` | `config-redaction` / `integration-p0` | extended config matrix | `release-config-redline` |
| 安全 / 授权 / redaction | `api-contract-fast` selected | `config-redaction` | `extended-redaction-scan` | `release-config-redline` |
| 幂等 / 一致性 | `service-core` | `service-all` / `consumer-outbox` | `concurrency-idempotency-stress` | selected release smoke |
| 可恢复性 | unit selected | `worker-job-contract` / `consumer-outbox` | `operations-replay` | selected release smoke / evidence pack |
| 可观测性 / 审计 | structured log unit selected | `config-redaction` / `worker-job-contract` | extended report validation | `release-evidence-pack` |

### 7.7 专项证据索引

| 证据 ID | 专项 | 主要来源 | report |
|---|---|---|---|
| `EV-WORK-NFR-001` | 性能观察 / 运行边界 | `TC-WORK-NFR-001`;`TC-WORK-CFG-005`~`009` | `reports/runs/<run_id>/nfr-performance.md` |
| `EV-WORK-NFR-002` | 可用性 / 降级 | `TC-WORK-NFR-002`;`TC-WORK-OPS-*`;`TC-WORK-CFG-014`~`016` | `reports/runs/<run_id>/nfr-availability.md` |
| `EV-WORK-NFR-003` | 安全 / 授权 / redaction | `TC-WORK-NFR-003`;`TC-WORK-CFG-010`~`012`;`FORMAL-004`;`PROMOTE-004` | `reports/runs/<run_id>/redaction-report.md` |
| `EV-WORK-NFR-004` | 幂等 / 一致性 | `TC-WORK-NFR-004`;`CORE-004`;`PROMOTE-005`;nightly stress | `reports/runs/<run_id>/idempotency-consistency.md` |
| `EV-WORK-NFR-005` | 可观测性 / 审计 | `TC-WORK-NFR-005`;`QUERY-*`;`OPS-*`;release evidence pack | `reports/runs/<run_id>/observability-audit.md` |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 旧 `100ms / 300ms` 性能数字不升级为 P0 release 硬阈值,只作为观察候选 | 否 | 承接需求文档候选目标口径 | 无 | 无回写 |
| P0 性能专项验证正式 timeout、batch、page、body limit 和样本报告 presence | 否 | 承接 04 配置契约,不新增指标 | 无 | 无回写 |
| raw secret / token / payload / source body / external body 泄露一票阻断 | 否 | 承接 00 数据归属和 04 sensitive / redaction | 无 | 无回写 |
| duplicate / conflict / version conflict / commit unknown / job rerun 进入 P0 一致性专项 | 否 | 承接 03 幂等与恢复契约 | 无 | 无回写 |
| structured log、low-cardinality metric、trace / audit / outbox / report presence 进入观测专项 | 否 | 承接 03 观测字段契约 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续要把旧性能候选值升级为 release 硬阈值,必须先补固定环境、数据规模、容量目标和验收来源,再回写 `00` / `05` / `06`。
```

## 9. 回填草稿

正式 `05-测试方案.md` §10 建议采用以下结构:

```text
10. 专项测试与非功能验证
  10.1 专项测试矩阵
  10.2 性能专项口径表
  10.3 安全与边界红线矩阵
  10.4 故障注入与恢复矩阵
  10.5 可观测性与审计证据矩阵
  10.6 专项到自动化 suite 映射
  10.7 专项证据索引
  10.8 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §10.1 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.1 |
| §10.2 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.2 |
| §10.3 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.3 |
| §10.4 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.4 |
| §10.5 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.5 |
| §10.6 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.6 |
| §10.7 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §7.7 |
| §10.8 | `design-calibration/05_test_plan_step_10_special_non_functional.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 11 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| 性能硬阈值 | 是否接受当前不把旧 `100ms / 300ms` 候选值设为 P0 release 硬阈值 |
| 安全红线 | 是否确认 raw secret / token / payload / source body / external body 泄露一票阻断 |
| 故障注入范围 | 是否确认 duplicate、conflict、version conflict、commit unknown、publisher / resolver / projection / handoff failure 均进入自动化 |
| 观测证据 | 是否确认 safe structured log、low-cardinality metric、trace / audit / outbox / job report presence 是 P0 通过条件 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能和红线均有验证方式 | 通过 | 见 §7.1 / §7.3 |
| 非功能阈值均有来源 | 通过 | 只使用正式配置阈值;旧性能数字仅观察 |
| 可观测性可通过证据验证 | 通过 | 见 §7.5 / §7.7 |
| 故障注入和恢复可定位 | 通过 | 见 §7.4 |
| 对上游设计影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 11 | 通过 | 下一步定义缺陷管理与复验规则 |
