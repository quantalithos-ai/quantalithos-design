# Step 10. 定义配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节: `04-配置设计.md` §10 配置变更、审计与回滚

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义配置变更、审计与回滚 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 配置项清单;Step 8 敏感配置;Step 9 加载、校验与生效机制;详细设计 Step 12 / Step 15 错误恢复与审计边界 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

本 Step 定义 `L1-governance` 配置如何被变更、谁可以发起变更、哪些变更需要评审、如何生效、如何留下安全审计记录,以及变更失败或效果异常时如何回滚。

本 Step 只回答:

- 哪些配置项或配置族允许在 P0 中变更。
- 每类变更的发起方、评审要求、生效方式、审计字段和回滚方式。
- 高风险、安全关键、敏感 ref、target/route、redaction、external GRC、store / adapter binding 变更如何停审。
- startup、job-run-start、entry-local、test harness 四类生效方式下的回滚口径。
- 审计记录允许携带哪些 safe metadata,禁止携带哪些 raw secret / full sensitive ref / external body。
- 每类变更如何回指 Step 7 配置项、Step 8 敏感性、Step 9 生效机制和 Step 11 失效策略。

本 Step 不定义:

- 具体工单系统、审批平台、值班系统、权限系统或审计产品。
- 具体 secret provider / KMS / Vault / cloud credential rotation API。
- runtime hot reload、remote config center、admin online override 或 live mutation contract。P0 中配置变更通过 restart、新 job run、当前 entry reject/rerun 或 test fixture rerun 生效。
- 配置失效模式和降级矩阵,这些由 Step 11 定义。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、来源、作用域、生效方式、敏感级别和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive / secret / redaction / target / route refs 的禁止输出、轮换和审计边界 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 startup、job-run-start、entry-local、test harness 和 unsupported reload/hot 生效机制 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、dependency unavailable、rollback failure、commit unknown 等恢复方向 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation audit、safe diagnostic ref、日志 / 审计 / trace 禁止字段 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置可以由谁变更? | P0 只允许 operator / maintainer / release automation / job runner / test harness 在各自作用域内变更配置。startup config 由 operator 或 release automation 提交;job-run-start config 由 authorized job runner 提交;entry-local selector 由 entry caller 提交;test fixture 由 test harness 提交。domain/application/contracts 不直接读取或变更配置。 |
| 哪些配置变更需要评审? | store refs、resolver/publisher refs、transport topic bindings、handoff/archive/external GRC targets、external GRC enablement、redaction deny list / diagnostics、idempotency retention、report retention、profile/adapter mode、production-like/staging-like 相关 future refs 都需要评审。低风险 batch/timeout 在已校验范围内可轻量评审或由 release automation 执行。raw secret、redaction 放松、fake 进入 production-like、hot/reload request、truth invariant override 必须 reject 或走正式设计变更。 |
| 变更如何生效? | startup config 变更必须重新加载、重新校验、重新组装 runtime builder,然后通过 restart 生效。job-run-start 变更只冻结到当前 job run。entry-local 变更只影响当前入口调用。test fixture 变更只影响 test harness 或 operations-replay 运行。P0 无 runtime reload / hot update。 |
| 变更如何记录审计? | 审计记录使用产品中立的 `change_request_ref`、`actor_ref`、`reason_ref`、`config_section`、`profile_ref`、`activation_kind`、`old_config_digest`、`new_config_digest`、`validation_result`、`validation_issue_ref`、`rollback_ref`、`safe_diagnostic_ref`。不得记录 raw config、raw secret、full sensitive ref、endpoint、route credential、external body 或 package body。 |
| 变更失败或效果异常如何回滚? | startup 失败不暴露 facade,回滚到 previous validated config ref/digest 并 restart。job-run-start 失败则 reject 当前 run,需要以 previous valid input 启动 new run,不得改写已存 job report。entry-local 失败 reject 当前 entry,由 caller 以 previous selector 重试。test fixture 失败恢复 previous fixture ref 并 rerun test。敏感 ref 轮换异常时只能切回 previous approved ref 或换新 approved ref,不得输出 secret。 |
| 每个可变更配置项是否回指 Step 7 配置项、Step 8 敏感性、Step 9 生效机制和 Step 11 失效策略? | 是。§8.2 / §8.3 将配置族逐项回指 Step 7 / Step 8 / Step 9,并在失败策略列保留 Step 11 承接点。 |
| 每类配置变更完成后是否通过停审? | 已通过。§8.7 按权限、评审、审计、回滚、失败处理和敏感性逐类停审。 |
| 所有变更规则完成后是否存在高风险配置无评审、无审计、无回滚或敏感配置变更泄露? | 已审计。§8.8 未发现 unresolved 冲突。P0 不假定具体工单系统,只要求可追踪的 change / actor / reason refs。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已列字段和失败策略,但未定义变更发起方、评审和回滚 | 本 Step 按配置族补齐变更控制表 |
| Step 8 敏感配置 | 已定义 refs 和禁止输出,但变更审计字段未完整化 | 本 Step 固定 old/new redacted digest、safe issue refs 和禁止 full sensitive ref 输出 |
| Step 9 生效机制 | 已定义 activation,但没有变更失败后的 rollback 行为 | 本 Step 按 activation kind 定义 rollback |
| 详细设计 Step 15 | 已定义 config validation audit,但没有配置变更审计口径 | 本 Step 补齐 `ConfigChangeAudit` 风格字段,不要求新增 `03` 对象 |
| 正式 `04` | 尚未创建 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更权限 | 只有来源优先级和作用域 | 定义 operator / release automation / job runner / entry caller / test harness | 防止实现侧把任意调用方当 config mutator |
| 评审层级 | 未定义 | 定义 low / medium / high / critical 四类 | 高风险配置必须可审计、可回滚 |
| 生效方式 | Step 9 已定义加载生效 | 增加每种生效方式的 rollback 口径 | 变更异常需要稳定恢复路径 |
| 审计字段 | Step 8 / Step 15 只给安全输出原则 | 固定 change refs、redacted digest、validation issue、rollback ref | 后续测试/验收可以检查审计完整性 |
| 敏感配置变更 | 只定义 raw secret 不进入配置 | 变更时禁止 full sensitive ref / raw secret 输出,轮换只记录 digest | 防止审计泄露 |
| 工单系统 | 未声明 | 明确不假定具体 ticket system | 保持产品中立 |
| reload/hot | Step 9 已 unsupported | 变更和回滚也不提供 reload/hot path | 避免无 rollback contract 的在线切换 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否引入具体审批系统 | A. 指定工单/审批产品;B. 使用产品中立 refs | 采用 B。只要求 `change_request_ref`、`actor_ref`、`reason_ref` 可追踪 |
| P0 是否支持 runtime hot rollback | A. 支持 reload/hot;B. restart/new run/rerun | 采用 B。Step 9 已固定 reload/hot unsupported |
| 审计是否记录完整配置 diff | A. 记录完整 diff;B. 记录 redacted digest + section + issue refs | 采用 B。完整 diff 可能含 sensitive refs 或拓扑信息 |
| 低风险阈值变更是否都人工评审 | A. 全部人工评审;B. 在 validator 范围内可由 release automation 执行 | 采用 B。仍需审计,但避免把 batch/timeout 全部升为高风险 |
| job-run-start 配置是否覆盖全局 | A. 覆盖 startup config;B. 只影响当前 run | 采用 B。承接 Step 9 run-local frozen params |
| sensitive ref 轮换是否记录 full ref | A. 记录 full ref 便于排障;B. 只记录 redacted digest | 采用 B。full ref 可能暴露 endpoint/target/route/credential identity |

## 8. 结构化中间产物

### 8.1 变更 actor 与评审层级

| Actor / role ref | 允许范围 | 不允许范围 | 审计要求 |
|---|---|---|---|
| `operator_ref` | 提交 startup config 文件或 env ref 的变更,执行 restart / rollback | 直接修改 domain truth、绕过 validator、注入 raw secret | actor、reason、change request、old/new digest、validation result |
| `release_automation_ref` | 在已评审变更中应用 config artifact、运行 validation、记录 digest | 自动批准 high-risk / critical 变更 | release run ref、config digest、validation issue refs |
| `authorized_job_runner_ref` | 提交 job-run-start scope、batch、target、replay root 等 run-local 输入 | 覆盖 startup invariant、修改全局 config、写 raw target credential | job run id、input digest、target digest、validation result |
| `entry_caller_ref` | 提交 entry-local profile/config selector、job request source、artifact/report output root、dry-run diagnostic selector | 修改持久配置、绕过 startup validation 或覆盖 job metadata | entry ref、selector digest、request source digest、rejection issue |
| `test_harness_ref` | 加载 fake fixture、fixed clock/id、replay fixture | 进入 production-like / staging-like runtime | test run ref、fixture digest、profile |
| `design_change_ref` | 对 critical boundary 做正式设计变更 | 在 P0 runtime 中直接生效 | design baseline commit、review record |

| 评审层级 | 适用变更 | 要求 |
|---|---|---|
| `low` | batch size、timeout、page limit 在 validator 范围内收窄;entry-local selector | 可由 release automation / entry caller 执行;必须有审计 |
| `medium` | local-dev / ci-test / integration-like 的 profile、fake/controlled adapter refs、test fixture refs | 至少需要 reviewer ref 或 release approval ref;必须 validation pass |
| `high` | durable store refs、resolver/publisher refs、topic bindings、handoff/archive targets、external GRC adapter/target、idempotency/report retention、operations-replay root | 必须评审、审计、rollback plan;失败不得 fallback fake |
| `critical` | redaction 放松、raw secret 进入普通配置、fake/test fixture 进入 production-like、hot/reload request、truth invariant override、query write override | P0 直接 reject 或要求正式设计变更;不得作为普通 config change 生效 |

### 8.2 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| runtime profile / strict validation | operator 或 release automation | medium;production-like future 为 high | startup + restart | profile、old/new config digest、validation result | restore previous config digest and restart |
| store config refs | operator / release automation | high | startup + restart | store slot、old/new redacted ref digest、profile、validation issue | restore previous approved store ref;restart;failed validation不暴露 facade |
| resolver adapter refs | operator / release automation | high | startup + restart | resolver family、mode、old/new redacted digest、availability marker | restore previous adapter ref;restart;do not fallback fake unless profile config says fake |
| inbound consumer namespace / version / dedup retention | operator / release automation | medium to high | startup + restart | namespace set digest、version、retention class、validation result | restore previous consumer config;restart;unsupported events follow Step 11 |
| outbox publisher adapter | operator / release automation | high | startup + restart | publisher slot、old/new redacted digest、availability marker | restore previous publisher ref;restart;unpublished records stay pending |
| transport topic bindings | operator / release automation | high | startup + restart | changed topic-neutral keys、old/new route digest、topic coverage validation | restore previous route map;restart;do not synthesize topics |
| job default batch / timeout / parallelism | operator / release automation;job runner may lower per run | low to medium | startup or job-run-start | job kind、old/new numeric class、run-local override flag | startup restore previous defaults;run-local rerun with previous input |
| job enabled kind set | operator / release automation | medium;external GRC / handoff jobs high | startup + restart | enabled kind set digest、profile、validation result | restore previous enabled set;restart |
| handoff trace/archive targets | operator / release automation;job runner selects enabled target | high | startup or job-run-start | target kind、redacted target digest、job run id optional | restore previous target set;rerun new job with previous target |
| external GRC enabled flag | operator / release automation | high | startup + restart | enabled from/to、adapter/target digest、reason ref | restore disabled/enabled previous config;restart;core truth unaffected |
| external GRC adapter / target refs | operator / release automation;job runner selects enabled target | high | startup or job-run-start | adapter/target digest、job run id optional、export marker refs | restore previous refs;new export job with previous input |
| redaction deny field refs | operator / release automation | high;removing deny field may be critical | startup + restart | added/removed field refs or digest、reason、review ref | restore previous deny list;restart;unsafe relax rejected |
| safe diagnostic prefix | operator / release automation | medium | startup + restart | old/new prefix digest、collision validation | restore previous prefix;restart |
| high-cardinality metric setting | operator / release automation | critical in P0 | validation reject | rejected attempt issue ref | no runtime rollback;config never activates |
| boundary max page/body/time limits | operator / release automation;job runner may narrow | low to medium;widening high | startup or job-run-start where allowed | limit class old/new、scope、validation result | restore previous limit;entry/job rerun |
| idempotency/result retention | operator / release automation | high | startup + restart | retention class、affected result surface、validation result | restore previous retention;restart;cleanup behavior follows Step 11 |
| projection/reference job defaults | operator / release automation;job runner may lower batch | medium | startup or job-run-start | job kind、batch/stale/retry class、validation result | restore previous defaults;new job run |
| clock/id generator refs | operator / release automation;test harness in tests | medium;production-like future high | startup or test harness | clock/id slot、profile、deterministic marker | restore previous port ref;restart/rerun test |
| test fixture / replay artifact root | test harness 或 authorized job runner | medium;operations-replay root high | test harness or job-run-start | fixture/root digest、de-identified marker、run id | restore previous fixture/root;rerun test/job |
| forbidden raw secret / raw body attempt | any source | critical;reject | no activation | validation issue ref、section、actor/source ref if safe | no rollback;config never activates |
| static design boundary override attempt | any source | critical;reject | no activation | forbidden key class、validation issue ref | no rollback;requires formal design change |

### 8.3 变更到 Step 7 / Step 8 / Step 9 / Step 11 回指表

| 配置族 | Step 7 配置项 | Step 8 敏感性 | Step 9 生效机制 | Step 11 失效策略承接 |
|---|---|---|---|---|
| runtime | `runtime.*` | config ref / profile internal | startup / entry-local selector | invalid profile fail-fast;unsupported reload reject |
| stores | `stores.*.kind`, `stores.*.configRef` | durable refs sensitive | startup | missing/invalid store fail-fast;previous digest rollback |
| resolvers | `externalResolvers.families[]` | endpoint-backed adapter refs sensitive | startup | unavailable adapter degraded/delayed by role;no fake fallback |
| consumers | `inboundConsumers.*` | mostly internal;namespace may be sensitive by deployment | startup | unsupported version rejected/dead-letter;dedup retention conflict fail-fast |
| outbox | `outbox.*` | publisher / topic refs sensitive | startup;batch job-run-start | publisher failure retry/dead-letter;topic missing fail-fast |
| jobs | `jobs.*` | internal;targeted jobs may include sensitive target refs | startup/job-run-start | invalid job rejected;partial failures in report |
| handoff/archive | `handoff.*` | target refs sensitive | startup/job-run-start | target disabled/retryable/permanent failure marker |
| external GRC | `externalGrc.*` | adapter/target refs sensitive | startup/job-run-start | disabled skips export;enabled missing target fail-fast/reject |
| redaction | `redaction.*` | internal safety-critical | startup | unsafe relax fail-fast;forbidden body reject |
| boundary | `boundary.*` | internal | startup/job-run-start narrowing | invalid range fail-fast/reject |
| idempotency | `idempotency.*` | internal | startup | duplicate replay/result retention defects surfaced |
| projection/reference | `projection.*`, `reference.*` | internal plus reference source refs | startup/job-run-start | stale/unavailable/ref failure in query/job surface |
| clock/id/test | `clockId.*`, `testFixtures.*` | fixture/replay root sensitive | startup/test harness/job-run-start | fixture invalid test fail-fast;replay missing rejected |

### 8.4 审计记录规则

| 审计字段 | 必填性 | 说明 | 禁止内容 |
|---|---|---|---|
| `change_request_ref` | high/critical 必填;low 可由 release run ref 替代 | 产品中立变更引用,不假定具体工单系统 | 工单正文、free-text secret |
| `actor_ref` | 必填 | 发起人、automation 或 job runner 的 opaque ref | raw credential、个人敏感正文 |
| `reason_ref` | high 必填 | 指向批准原因或运维原因的 safe ref | 原始审批正文 |
| `config_section` | 必填 | 例如 `stores.truth`, `outbox.transportTopicBindings` | raw config body |
| `profile_ref` | 必填 | 变更作用 profile | 无 |
| `activation_kind` | 必填 | startup、job-run-start、entry-local、test harness、rejected | hot/reload 不得作为 P0 成功值 |
| `old_config_digest` / `new_config_digest` | startup 必填 | redacted canonical digest,不含 raw secret/full sensitive ref | 完整配置文件 |
| `old_ref_digest` / `new_ref_digest` | sensitive refs 必填 | store/adapter/topic/target/replay refs 的 redacted digest | full sensitive ref、endpoint、route credential |
| `validation_result` | 必填 | accepted / rejected / failed_validation | raw validation input |
| `validation_issue_ref` | rejected 时必填 | redacted issue ref | raw invalid value |
| `rollback_ref` | high 变更必填 | previous approved config/input/fixture ref 或 rollback run ref | rollback script body with secrets |
| `safe_diagnostic_ref` | 可选 | 指向 redacted diagnostic | stack trace with secrets、HTTP body、SQL |

### 8.5 回滚规则矩阵

| 生效方式 | 变更成功判定 | 失败 / 异常判定 | 回滚方式 | 不允许的回滚 |
|---|---|---|---|---|
| startup | config parse/type/cross-field/sensitive validation 全部通过;runtime builder Ready;facade exposed | validation reject、builder Failed、adapter required missing、post-start smoke failed | restore previous validated config ref/digest;restart;record rollback ref | runtime hot patch、跳过 validator、fallback lower-priority invalid value |
| job-run-start | job input validation 通过;run context frozen;job report created or rejected surface clear | invalid target/scope/batch/replay root、target disabled、partial failure | start new job with previous valid input or corrected target;stored report immutable | mutate previous report to pretend success、reuse conflicting idempotency key with different digest |
| entry-local | selector validation 通过;entry uses selected profile/config source | invalid selector/config path/profile | reject current entry;caller rerun with previous selector | write selector into global config |
| test harness | fixture validation 通过;fake runtime assembled | invalid fixture/ref/time/id seed;production-like fixture attempt | restore previous fixture ref;rerun test | let fixture leak into production-like |
| rejected critical change | validation rejects before activation | raw secret、raw body、redaction unsafe relax、hot/reload request、truth invariant override | no runtime rollback;record rejected issue;requires design change if needed | activate under emergency flag |

### 8.6 敏感配置变更附加规则

| 敏感配置族 | 读取规则 | 轮换规则 | 审计规则 | 禁止输出 |
|---|---|---|---|---|
| store refs | loader validates ref shape;adapter resolves internally | new approved store ref + restart | slot、old/new ref digest、profile、validation result | DSN、URL、credential、full ref |
| resolver adapter refs | runtime builder registers adapter by ref | new adapter ref + restart | family、mode、old/new digest、availability marker | endpoint credential、sibling response body |
| publisher / topic refs | topic-neutral key to route ref map only | new route map + restart | changed keys、route digest、coverage check | raw topic secret、transport credential |
| handoff/archive targets | enabled target set validated at startup or job run | new target ref + restart/new run | target digest、job run、marker refs | package body、target credential |
| external GRC refs | disabled by default;enabled requires adapter+target | new refs + restart/new export run | enabled from/to、adapter/target digest、export marker refs | external GRC body/credential |
| replay root refs | de-identified root ref only | new replay root per run | run id、root digest、de-identification marker | raw historical body |
| redaction config | deny list and diagnostic prefix validate before builder Ready | new deny list + restart | added/removed digest、review/reason ref | matched raw values |
| future secret provider refs | only if future `03` contract exists | provider-side rotation plus restart/revalidation | provider ref digest only | secret material |

### 8.7 配置变更停审记录

| 配置项 / 变更类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime profile / activation | 权限、评审、生效、回滚 | 通过 | reload/hot rejected |
| store refs | high-risk review、redacted audit、restart rollback | 通过 | durable product schema 留 P1/P2 |
| resolver / consumer binding | family coverage、profile compatibility、audit | 通过 | controlled/production-like 细节由 profile validation |
| outbox publisher / topic map | route completeness、publisher availability、rollback | 通过 | missing enabled topic fail-fast |
| jobs defaults / enabled set | per-run override boundary、retention、report rollback | 通过 | stored report immutable |
| handoff / archive targets | target review、sensitive ref audit、failed marker | 通过 | no package body in audit |
| external GRC | default disabled、enablement review、core truth unaffected | 通过 | export failure不阻塞核心 truth |
| redaction / diagnostics | critical relax rejection、deny list rollback | 通过 | removing deny field may require design review |
| boundary / idempotency / retention | range validation、review on widening/high retention risk | 通过 | Step 11 handles retention failure modes |
| clock/id/test fixture/replay | profile compatibility、fixture isolation | 通过 | production-like fixture rejected |
| raw secret/body/static invariant attempts | reject、audit issue、no activation | 通过 | requires formal design change,not config change |

### 8.8 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险配置是否都有评审 | 通过 | store/resolver/publisher/topic/target/external GRC/idempotency/redaction all high |
| 高风险配置是否都有审计字段 | 通过 | §8.4 fixed safe audit fields |
| 高风险配置是否都有回滚方式 | 通过 | startup restore previous digest;job new run;fixture rerun |
| 是否假定具体工单系统 | 未假定 | 使用产品中立 refs |
| sensitive ref 是否可能泄露到 audit/log/report | 不允许 | only redacted digest / issue ref |
| raw secret/body 是否能作为配置变更成功 | 不可 | critical reject |
| hot/reload 是否绕过 rollback contract | 不可 | unsupported and rejected |
| job-run-start 是否覆盖全局 config | 不可 | run-local frozen params only |
| entry-local 是否能持久化覆盖 | 不可 | current entry only |
| previous invalid config 是否可回滚 | 不可 | rollback target must be previous validated / approved digest |
| failed job report 是否可改写为成功 | 不可 | new run only;stored report immutable |
| 变更规则是否回指 Step 7/8/9/11 | 通过 | §8.3 complete |
| 是否需要回写 `03` | 当前无 | 若新增 config center/hot reload/secret provider/admin override,必须回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置变更审计使用产品中立 refs,不假定具体工单系统 | 否 | 运维/配置设计口径 | 不适用 | 无回写 |
| P0 变更生效仍限 startup restart、new job run、entry rerun、test rerun | 否 | 承接 Step 9 activation | 不适用 | 无回写 |
| high-risk 配置必须评审、审计、rollback plan | 否 | 配置治理规则 | 不适用 | 无回写 |
| 审计只记录 redacted digest / issue refs,不记录 raw config/full sensitive refs | 否 | 承接 Step 8 / Step 15 forbidden output | 不适用 | 无回写 |
| stored job report / accepted result 不因 rollback 被改写 | 否 | 承接 Step 11/12 idempotency and report immutability | 不适用 | 无回写 |
| 若后续要求 remote config center、admin override、runtime hot reload、last-known-good live switch 或 real secret provider rotation API | 是 | runtime builder / config loader / adapter constructor / audit rollback / error recovery contract | `03` §13 / §14 / Step 12 / Step 15 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“变更 actor 与评审层级”“配置变更表”“变更到 Step 7 / Step 8 / Step 9 / Step 11 回指表”“审计记录规则”“回滚规则矩阵”“敏感配置变更附加规则”“配置变更停审记录”和“跨变更审计 / 回滚审计表”小节,了解配置变更如何从字段级配置项收敛到可审计、可回滚的运行规则。

正式 `04-配置设计.md` §10 应回填:

- 变更 actor 与评审层级。
- 配置变更表。
- 配置族到 Step 7 / Step 8 / Step 9 / Step 11 的回指表。
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
- 不得让 job-run-start 或 entry-local 配置覆盖全局 startup invariant。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 未来是否需要接入真实审批 / ticket 系统 | 影响 change_request_ref 的外部解析 | P0 不指定产品,只保留 opaque ref |
| 未来 production-like 是否需要 zero-downtime config reload | 影响 runtime builder、rollback、last-known-good config contract | P0 unsupported;Step 13/14 记录演进 |
| secret provider rotation 是否需要应用内重读 | 影响 adapter constructor 和 secret provider port | P0 不定义;future 回写 `03` |
| redaction deny list 放松是否允许例外 | 影响 critical 变更审查 | P0 作为 rejected/design-change 处理 |
| config digest canonicalization 算法 | 影响审计和 artifact 比对 | 本 Step 只要求 redacted canonical digest,算法留实现规范 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置变更表已定义 | 通过 | 见 §8.2 |
| 每类变更的发起方和评审要求已定义 | 通过 | 见 §8.1 / §8.2 |
| 每类变更的生效方式已定义 | 通过 | 见 §8.2 / §8.5 |
| 审计记录规则已定义且不泄露敏感信息 | 通过 | 见 §8.4 / §8.6 |
| rollback 行为已定义 | 通过 | 见 §8.5 |
| 每类变更已回指 Step 7 / Step 8 / Step 9 / Step 11 | 通过 | 见 §8.3 |
| 配置变更停审完成 | 通过 | 见 §8.7 |
| 跨变更审计 / 回滚审计没有 unresolved 冲突 | 通过 | 见 §8.8 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 11 | 通过 | 下一步定义失效模式与降级 / fail-fast 策略 |
