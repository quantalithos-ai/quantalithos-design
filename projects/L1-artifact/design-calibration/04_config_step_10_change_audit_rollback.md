# Step 10. 定义配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节: `04-配置设计.md` §10 配置变更、审计与回滚

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义配置变更、审计与回滚 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 配置项清单;Step 8 敏感配置;Step 9 加载、校验与生效机制;详细设计 Step 12 / Step 14 / Step 15 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_10_change_audit_rollback.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 配置如何被变更、如何留下可追踪审计、以及变更失败或效果异常时如何回滚。

本 Step 只回答:

- P0 中哪些配置变更允许发生,哪些只能 reject 或上升为正式设计变更。
- 不同作用域下的变更发起方、评审要求、生效方式和回滚方式。
- 高风险配置族如何做审计,且不泄露 full sensitive ref 或 raw secret。
- startup、current job run、current entry、test harness 四类生效窗口各自怎样回滚。
- Step 7 配置项、Step 8 敏感性、Step 9 activation 以及 Step 11 失效策略如何互相承接。

本 Step 不定义:

- 具体工单系统、审批平台、值班系统、身份产品、审计后端或通知渠道。
- 具体 secret provider / KMS / Vault / cloud rotation API。
- remote config center、admin online override、runtime hot reload、last-known-good live switch。
- 详细失效模式矩阵和 degraded/fail-fast 分类,这些留给 Step 11。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、作用域、生效方式、失败策略和 formal binding |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive / secret 边界、禁止输出和敏感配置轮换口径 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 startup / current entry / current job run / test harness activation 口径 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、builder failed、target disabled、stored report immutable 等恢复规则 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 `ArtifactRuntimeConfig`、`ArtifactRuntimeBuilderState` 和 config validation reject 边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation audit、safe diagnostic ref 和 redaction 约束 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 config validation、runtime entry state、redaction 和 replay evidence 的测试承接 |
| `projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md` | 已参考 | 提供 Step 10 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置允许变更? | P0 允许 startup config artifact、current entry selector、current job run local inputs、test fixture/replay refs 的变更。static design boundary、raw secret 注入、redaction 放松、reload/hot request、truth/state/visibility invariant override 不属于普通 config change。 |
| 谁可以发起变更? | startup config 由 `operator_ref` 或 `release_automation_ref` 提交;current job run 由 `authorized_job_runner_ref` 提交;current entry selector 由 `entry_caller_ref` 提交;test fixture 由 `test_harness_ref` 提交。critical boundary 只能转为 `design_change_ref`。 |
| 哪些变更需要评审? | store refs、resolver / publisher refs、topic bindings、handoff targets、redaction、retention、profile 切换、clock/id refs、replay root 等 high-risk 变更必须评审并给出 rollback plan。batch/timeout/page limit 在 validator 允许范围内可视为 low/medium,仍需审计。 |
| 变更如何生效? | startup config 通过 restart 生效;current job run 输入只冻结到当前 run;current entry selector 只影响本次入口;test fixture 只影响本次 test/replay runtime。P0 无 runtime reload / hot update。 |
| 审计记录写什么? | 只记录产品中立的 `change_request_ref`、`actor_ref`、`reason_ref`、`config_section`、`profile_ref`、`activation_kind`、`old/new digest`、`validation_result`、`validation_issue_ref`、`rollback_ref`、`safe_diagnostic_ref`。不记录 raw config、raw secret、full sensitive ref、endpoint、route credential、external body。 |
| 如何回滚? | startup 回滚到 previous validated config digest 并 restart;current job run 用 previous valid input 重新发起 new run;current entry 由 caller 重新选择旧 selector 重试;test harness 恢复 previous fixture ref 并 rerun。stored result / stored report / accepted truth 不因配置回滚被改写。 |
| P0 是否支持 live rollback? | 不支持。没有 last-known-good live switch,没有在线切换 builder/facade。回滚本质上是重新加载 previous approved config/input/fixture 并 restart 或 rerun。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已给出字段和失败策略,但未定义变更 actor、评审和回滚 | 本 Step 按配置族补齐变更控制表 |
| Step 8 敏感配置 | 已定义 sensitive 边界和 redacted digest,但未定义变更审计字段 | 本 Step 固定敏感变更只记录 digest / issue ref |
| Step 9 activation | 已定义加载和冻结时点,但未定义 rollback | 本 Step 按 activation kind 定义 rollback 行为 |
| Step 12 error recovery | 已定义 invalid config / target disabled / duplicate replay 不变更 stored surface,但未转成配置变更规则 | 本 Step 把这些恢复约束接入 config change 语境 |
| Step 15 observability | 已定义 config validation log / audit redaction,但未定义 change audit 最小字段集 | 本 Step 补齐 safe audit field 规则 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更权限 | 只有来源和作用域 | 增加 actor / role 边界 | 防止实现侧把任意入口当配置修改面 |
| 评审层级 | 未定义 | 增加 `low / medium / high / critical` | 高风险配置需要稳定门禁 |
| 回滚口径 | Step 9 只定义 activation | 增加按 activation kind 的回滚矩阵 | 配置异常后需要可重复恢复 |
| 审计字段 | 只有 redaction 原则 | 固定安全审计字段和禁止字段 | 便于 Step 11、测试和验收承接 |
| 敏感配置轮换 | 只定义 restart/new run | 增加变更 actor、审计和回滚 | 防止变更面泄露敏感值 |
| live override | 只说 unsupported | 明确不提供 live rollback / hot switch | 避免暗含未闭口 runtime contract |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否绑定具体审批系统 | A. 指定工单/审批产品;B. 使用产品中立 refs | 采用 B。只要求有 `change_request_ref` 可追踪 |
| 审计是否记录完整配置 diff | A. 记录完整 diff;B. 记录 redacted digest + section + issue refs | 采用 B。完整 diff 容易含敏感值或拓扑细节 |
| 低风险数值调整是否都人工评审 | A. 全人工;B. 在 validator 范围内可由 release automation 落地 | 采用 B。仍有审计,但不把所有微调升成高风险 |
| current job run 是否能改 startup frozen config | A. 可覆盖;B. 只影响当前 run | 采用 B。承接 Step 9 run-local frozen params |
| rollback 是否允许在线切换 builder | A. 允许 live switch;B. restart / rerun | 采用 B。P0 未定义 live switch contract |
| sensitive ref 变更是否记录 full ref | A. 记录 full ref;B. 仅记录 redacted digest | 采用 B。full ref 暴露 endpoint/target/route identity |

## 8. 结构化中间产物

### 8.1 变更 actor 与评审层级

| Actor / role ref | 允许范围 | 不允许范围 | 审计要求 |
|---|---|---|---|
| `operator_ref` | 提交 startup config artifact、执行 restart / rollback | 绕过 validator、注入 raw secret、覆盖 static design boundary | actor、reason、change request、old/new digest、validation result |
| `release_automation_ref` | 应用已评审 config artifact、执行 validation、记录 deployment/run digest | 自动批准 critical 变更、伪造 validation pass | release run ref、config digest、validation issue refs |
| `authorized_job_runner_ref` | 提交 current job run 的 scope / batch / target / replay root / output root | 覆盖 startup store/topic/idempotency invariant、写 raw target credential | job run id、input digest、target digest、validation result |
| `entry_caller_ref` | 提交 current entry 的 profile/config source selector、request source、artifact/report root、dry-run selector | 修改持久 runtime config、绕过 startup validation | entry ref、selector digest、request source digest、rejection issue ref |
| `test_harness_ref` | 提交 fixture set、fixed clock/id、replay fixture | 进入非 test harness 的 production-like / staging-like runtime | test run ref、fixture digest、profile ref |
| `design_change_ref` | 对 critical boundary 触发正式设计变更 | 当作普通 config change 直接生效 | design baseline commit、review ref |

| 评审层级 | 适用变更 | 要求 |
|---|---|---|
| `low` | batch/page/time limit 的收窄、entry-local selector、dry-run 开关 | 可由 operator/release automation/entry caller 执行;必须审计 |
| `medium` | `local-dev` / `ci-test` / `integration-like` 的普通 profile 切换、fixture refs、clock/id refs、non-sensitive defaults | 至少需要 reviewer ref 或 release approval ref |
| `high` | store refs、resolver/publisher refs、topic bindings、handoff targets、retention、replay root、redaction deny list | 必须评审、审计、rollback plan |
| `critical` | raw secret 入普通配置、redaction 放松、reload/hot request、static design boundary override、fake/test fixture 进入 future production-like | P0 直接 reject 或要求 formal design change |

### 8.2 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| `runtime.profile` / `runtime.strictValidation` | operator / release automation / entry caller(selector only) | medium;future production-like high | startup 或 current entry selector | profile、old/new config digest、validation result | restore previous validated config digest and restart;selector by caller rerun |
| `stores.*` | operator / release automation | high | startup + restart | store slot、old/new ref digest、profile、validation issue ref | restore previous approved store ref and restart |
| `sourceResolvers.*` | operator / release automation | high | startup + restart | resolver mode、adapter digest、availability marker | restore previous adapter ref and restart |
| `inboundConsumers.*` | operator / release automation | medium to high | startup + restart | namespace digest、sourceMode、schema version、validation result | restore previous consumer config and restart |
| `relay.publisherAdapterRef` | operator / release automation | high | startup + restart | publisher slot、old/new digest、availability marker | restore previous publisher ref and restart |
| `relay.transportTopicBindings` | operator / release automation | high | startup + restart | changed topic-neutral keys、old/new route digest、coverage validation | restore previous route map and restart |
| `relay.publishBatchSize` / `jobs.defaultBatchSize` / `jobs.jobTimeoutSeconds` | operator / release automation;job runner may lower per run | low to medium | startup or current job run | numeric class、scope、run-local override flag | restore previous defaults or rerun with previous input |
| `jobs.maxParallelism` / `jobs.retryPolicyRef` | operator / release automation | medium | startup + restart | job params digest、profile、validation result | restore previous job defaults and restart |
| `handoff.*Targets` | operator / release automation;job runner selects current enabled target | high | startup or current job run | target kind、target digest、job run id optional | restore previous target set;new run with previous target |
| `handoff.emitTraceAvailableEventFromHandoff` | operator / release automation | medium to high | startup + restart | feature from/to、topic coverage validation | restore previous flag and restart |
| `boundary.*` | operator / release automation;job runner may narrow within allowed range | low to medium;widening high | startup or current job run | limit class old/new、scope、validation result | restore previous limit;entry/job rerun |
| `idempotency.*` | operator / release automation | high | startup + restart | retention class、affected replay window、validation result | restore previous retention and restart |
| `projection.*` / `reference.*` | operator / release automation;job runner may lower batch per run | medium | startup or current job run | stale/batch/feature digest、validation result | restore previous defaults;new job run |
| `redaction.denyFieldRefs` | operator / release automation | high;unsafe relax critical | startup + restart | added/removed digest、reason ref、review ref | restore previous deny list and restart |
| `redaction.safeDiagnosticRefPrefix` | operator / release automation | medium | startup + restart | old/new prefix digest、collision validation | restore previous prefix and restart |
| `redaction.allowHighCardinalityLabels` | any actor | critical reject | no activation | validation issue ref only | no runtime rollback;config never activates |
| `clockId.*` | operator / release automation;test harness in tests | medium | startup or test harness | port ref digest、profile、deterministic marker | restore previous refs;restart/rerun |
| `testFixtures.fixtureSetRef` / `testFixtures.fixedClockInstant` | test harness | medium | test harness | fixture digest、test run ref | restore previous fixture and rerun |
| `testFixtures.replayArtifactRootRef` | authorized_job_runner_ref / test_harness_ref | high | current job run / test harness | replay root digest、de-identified marker、run id | restore previous replay root;new run |
| forbidden raw secret / raw body attempt | any source | critical reject | no activation | section、validation issue ref、safe diagnostic ref | no rollback;requires corrected input |
| static design boundary override attempt | any source | critical reject | no activation | forbidden key class、validation issue ref | no rollback;requires formal design change |

### 8.3 配置变更到 Step 7 / Step 8 / Step 9 / Step 11 回指表

| 配置族 | Step 7 配置项 | Step 8 敏感性 | Step 9 生效机制 | Step 11 承接点 |
|---|---|---|---|---|
| runtime | `runtime.*` | internal | startup / current entry selector | invalid profile / unsupported activation fail-fast |
| stores | `stores.*` | durable refs sensitive | startup | missing/invalid store fail-fast |
| sourceResolvers | `sourceResolvers.*` | adapter refs sensitive | startup | unavailable adapter => degraded/delayed/reject by role |
| inboundConsumers | `inboundConsumers.*` | internal | startup | unsupported version / invalid sourceMode reject |
| relay | `relay.*` | publisher/topic refs sensitive | startup / current job run narrowing | topic missing fail-fast;publish failure retry/dead-letter |
| jobs | `jobs.*` | internal | startup / current job run | invalid run params reject;stored report immutable |
| handoff | `handoff.*` | target refs sensitive | startup / current job run | target disabled / failed marker / retryable delivery |
| boundary | `boundary.*` | internal | startup / current job run narrowing | invalid range reject |
| idempotency | `idempotency.*` | internal | startup | replay window / cleanup failure handled in Step 11 |
| projection/reference | `projection.*`,`reference.*` | internal | startup / current job run | stale/degraded/failed maintenance surface |
| redaction | `redaction.*` | internal safety-critical | startup | unsafe relax fail-fast |
| clockId/testFixtures | `clockId.*`,`testFixtures.*` | fixture/replay root sensitive | startup / test harness / current job run | fixture invalid fail-fast;replay root invalid reject |

### 8.4 审计记录规则

| 审计字段 | 必填性 | 说明 | 禁止内容 |
|---|---|---|---|
| `change_request_ref` | high/critical 必填;low 可由 release run ref 替代 | 产品中立 change reference | 工单正文、secret |
| `actor_ref` | 必填 | operator / automation / caller / job runner / test harness opaque ref | raw credential |
| `reason_ref` | high 变更必填 | 指向批准原因或运维原因的 safe ref | 原始审批文本 |
| `config_section` | 必填 | 如 `stores.truth`、`relay.transportTopicBindings` | raw config body |
| `profile_ref` | 必填 | 本次变更作用 profile | 无 |
| `activation_kind` | 必填 | startup、current_job_run、current_entry、test_harness、rejected | hot/reload success |
| `old_config_digest` / `new_config_digest` | startup 变更必填 | redacted canonical digest | 完整配置文件 |
| `old_ref_digest` / `new_ref_digest` | sensitive ref 变更必填 | store/adapter/target/route/replay refs 的 redacted digest | full sensitive ref、endpoint、route credential |
| `validation_result` | 必填 | accepted / rejected / failed_validation | raw validation input |
| `validation_issue_ref` | reject/fail 必填 | redacted issue ref | raw invalid value |
| `rollback_ref` | high 变更必填 | previous approved config/input/fixture ref 或 rollback run ref | rollback script body with secrets |
| `safe_diagnostic_ref` | 可选 | 指向 redacted diagnostic | stack trace with secret/body |

### 8.5 回滚规则矩阵

| 生效方式 | 成功判定 | 失败 / 异常判定 | 回滚方式 | 不允许的回滚 |
|---|---|---|---|---|
| startup | config validation pass;builder `Ready`;facade exposed | validation reject、builder `Failed`、required adapter missing、startup smoke failed | restore previous validated config digest and restart | hot patch、skip validator、fallback invalid env |
| current job run | run-local validation pass;run context frozen;job enters body | invalid target/scope/batch/replay root、target disabled | start new job with previous valid input or corrected input | mutate old report to pretend success |
| current entry | selector/path/root validation pass | invalid selector/profile/config path | caller rerun with previous selector | persist selector into global runtime config |
| test harness | fixture/replay validation pass;fake runtime assembled | invalid fixture/ref/time/id seed | restore previous fixture/root and rerun test | leak fixture into non-test runtime |
| rejected critical change | validation rejects before activation | raw secret、unsafe relax、reload/hot request、invariant override | no runtime rollback;record rejection issue | activate under emergency bypass |

补充:

- `stored result`、`stored receipt`、`stored report`、accepted truth、accepted trace、committed relay payload snapshot 都不因配置回滚被改写。
- rollback 目标必须是 previous validated / approved digest 或 previous valid run-local input,不能回滚到已知非法配置。

### 8.6 敏感配置变更附加规则

| 敏感配置族 | 读取规则 | 轮换规则 | 审计规则 | 禁止输出 |
|---|---|---|---|---|
| store refs | loader 只验 ref shape | new approved ref + restart | slot、old/new digest、profile、validation result | DSN、URL、credential、full ref |
| resolver adapter refs | builder 只按 ref 装配 | new approved ref + restart | family、mode、digest、availability marker | endpoint credential、external body |
| publisher/topic refs | topic-neutral key 到 route ref map | new route map + restart | changed keys、route digest、coverage check | raw topic secret、transport credential |
| handoff targets | target set 先验再选 current target | new target set + restart/new run | target digest、job run id、marker refs | package body、target credential |
| replay root refs | de-identified root ref only | new root per run | run id、root digest、de-identified marker | raw historical body |
| redaction config | deny list / prefix 先验再生效 | new approved config + restart | diff digest、review ref、reason ref | matched raw values |

### 8.7 配置变更停审记录

| 配置项 / 变更类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime / activation | actor、review、rollback、unsupported reload | 通过 | reload/hot rejected |
| stores | high-risk review、restart rollback、redacted audit | 通过 | durable product schema 留后续 |
| resolvers / consumers | family coverage、profile compatibility、audit | 通过 | fake fallback 未被允许到 integration/replay |
| relay publisher / topic map | coverage、availability、rollback | 通过 | missing enabled topic fail-fast |
| jobs defaults / run-local overrides | scope boundary、report immutability、rerun rollback | 通过 | current job run only narrows current run |
| handoff targets | sensitive target audit、failed marker consistency | 通过 | no package body in audit |
| boundary / idempotency / retention | widening review、startup rollback | 通过 | Step 11 继续定义失效模式 |
| redaction / diagnostics | critical relax reject、deny list rollback | 通过 | removing deny fields may need design review |
| clock/id/test fixture/replay | profile compatibility、fixture isolation | 通过 | fixture only test harness |
| raw secret/body / invariant override attempts | reject、audit issue、no activation | 通过 | formal design change only |

### 8.8 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| high-risk 配置是否都有评审 | 通过 | store/resolver/publisher/topic/target/redaction/retention/replay covered |
| high-risk 配置是否都有审计字段 | 通过 | §8.4 已固定 |
| high-risk 配置是否都有回滚方式 | 通过 | startup restore digest;job new run;test rerun |
| 是否假定具体工单系统 | 未假定 | 使用 product-neutral refs |
| sensitive ref 是否可能泄露到 audit/log/report | 不允许 | only redacted digest / issue ref |
| raw secret/body 是否能作为变更成功值 | 不允许 | critical reject |
| current job run 是否覆盖全局 startup invariant | 不允许 | run-local frozen params only |
| current entry 是否持久化覆盖 | 不允许 | current entry only |
| previous invalid config 是否可作为回滚目标 | 不允许 | rollback target must be previous validated / approved digest |
| stored report / stored result 是否被配置回滚改写 | 不允许 | immutable;only new run / new request |
| 是否需要回写 `03` | 当前无 | future remote config/reload/provider API 才需回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置变更审计使用 product-neutral refs,不假定具体工单系统 | 否 | 配置治理口径 | 不适用 | 无回写 |
| P0 配置变更生效仅限 restart、new job run、entry rerun、test rerun | 否 | 承接 Step 9 activation | 不适用 | 无回写 |
| 审计只记录 redacted digest / issue refs,不记录 raw config/full sensitive refs | 否 | 承接 Step 8 / Step 15 redaction 边界 | 不适用 | 无回写 |
| rollback 不改写 stored result / stored receipt / stored report / accepted truth | 否 | 承接 Step 12 immutability 和 duplicate replay 规则 | 不适用 | 无回写 |
| 若未来引入 remote config center、admin override、runtime hot reload、last-known-good live switch 或 secret provider rotation API | 是 | runtime builder / config loader / adapter constructor / audit rollback / error recovery contract | `03` Step 14 / Step 12 / Step 15 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“变更 actor 与评审层级”“配置变更表”“配置变更到 Step 7 / Step 8 / Step 9 / Step 11 回指表”“审计记录规则”“回滚规则矩阵”“敏感配置变更附加规则”和“跨变更审计 / 回滚审计表”小节。

正式 `04-配置设计.md` §10 应回填:

- 变更 actor 与评审层级。
- 配置变更表。
- 配置变更到 Step 7 / Step 8 / Step 9 / Step 11 回指表。
- 审计记录规则。
- 回滚规则矩阵。
- 敏感配置变更附加规则。
- 配置变更停审记录。
- 跨变更审计 / 回滚审计表。
- 对详细设计的影响判定。

回填要求:

- 不得假定具体工单系统或审批产品。
- 不得允许 high-risk 变更无评审、无审计或无回滚。
- 不得把 raw secret、full sensitive ref、endpoint、route、external body 或 package body 写入审计。
- 不得引入 P0 hot reload / runtime reload。
- 不得让 current job run 或 current entry 覆盖全局 startup invariant。
- 正式 `04-配置设计.md` 仍等 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future production-like 是否需要 zero-downtime config reload | 影响 runtime builder 和 rollback contract | P0 unsupported;Step 13 / Step 14 记录演进 |
| future secret provider rotation 是否需要应用内重读 | 影响 adapter constructor / provider port | P0 不定义 |
| config digest canonicalization 算法 | 影响审计和 evidence 比对 | 本 Step 只要求 redacted canonical digest |
| redaction deny list 放松是否允许例外 | 影响 critical 变更审查 | P0 视为 reject / design change |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置变更表已定义 | 通过 | 见 §8.2 |
| 每类变更的发起方和评审要求已定义 | 通过 | 见 §8.1 / §8.2 |
| 每类变更的生效方式已定义 | 通过 | 见 §8.2 / §8.5 |
| 审计记录规则已定义且不泄露敏感信息 | 通过 | 见 §8.4 / §8.6 |
| rollback 行为已定义 | 通过 | 见 §8.5 |
| 变更已回指 Step 7 / Step 8 / Step 9 / Step 11 | 通过 | 见 §8.3 |
| 配置变更停审完成 | 通过 | 见 §8.7 |
| 跨变更审计 / 回滚审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 11 | 通过 | 下一步定义失效模式与降级 / fail-fast 策略 |
