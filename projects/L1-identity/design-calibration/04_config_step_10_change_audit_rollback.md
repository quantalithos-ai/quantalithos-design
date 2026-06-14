# 04 配置设计 Step 10 · 定义配置变更、审计与回滚

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 10 定义配置变更、审计与回滚
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 10 定义配置变更、审计与回滚 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 7 config items;Step 8 sensitive secrets;Step 9 loading / validation / activation;新版正式 `03-详细设计.md` §13~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_10_change_audit_rollback.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 11 failure / degradation |

本 Step 定义 `L1-identity` 配置如何变更、谁可以发起变更、哪些变更需要评审、变更如何生效、如何留下安全审计记录,以及变更失败或效果异常时如何回滚。

本 Step 只回答:

- 哪些配置项或配置族允许在 P0 中变更,哪些只能被 rejected 或走正式设计变更。
- 每类变更的发起方、评审要求、生效方式、审计记录和回滚方式。
- 高风险、安全关键、sensitive ref、target / route、redaction、store / adapter binding、operations replay refs 和 fixture 变更如何停审。
- startup、job-run-start、entry-local、test harness、static-rejected 五类变更的 rollback 口径。
- 审计记录允许携带哪些 safe metadata,禁止携带哪些 raw secret / full sensitive ref / external body。
- 每类变更如何回指 Step 7 配置项、Step 8 敏感性、Step 9 生效机制和 Step 11 失效策略。

本 Step 不定义:

- 具体 ticket system、审批平台、权限系统、值班系统、部署命令、运维 runbook 或 audit backend 产品。
- 具体 secret provider、KMS、Vault、cloud credential rotation API、config center 或 admin override。
- runtime hot reload、remote config center、last-known-good live switch 或 live mutation contract。P0 配置变更通过 restart、new job run、entry rerun 或 test rerun 生效。
- 新的 `ConfigChangeAudit` DTO、repository、error enum、loader API、adapter constructor 或 persistence schema。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已审核通过 | 提供配置项、来源、作用域、生效方式、敏感级别、失败策略和关联模块 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 sensitive / secret / redaction / target / route / replay refs 的禁止输出、轮换和审计边界 |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 startup、job-run-start、entry-local、test harness、reload/hot unsupported 和 redacted validation issue surface |
| `04_config_step_04_categories_boundaries.md` | 已审核通过 | 提供 static design boundary、P0 no hot update 和禁止配置化项 |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 high-priority invalid fail-fast、config center/admin override unsupported 和 entry-local 不覆盖全局 |
| `03-详细设计.md` §13 | 已完成 | 提供 raw config ownership、runtime builder、adapter binding 和 forbidden configuration boundary |
| `03-详细设计.md` §14~§15 | 已完成 | 提供 runtime/config observability、redaction、business audit 与测试切口 |
| 旧 `04_config_step_10_change_audit_rollback.md` | 历史诊断输入 | 只用于识别旧粒度和旧下游引用;本 Step 按新版 Step 7~9 重写 |
| `L1-governance` Step 10 calibration | 参考样式 | 只参考 actor / review / audit / rollback 粒度,不复用 governance 字段 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置可以由谁变更? | P0 只允许 `operator_ref` / `release_automation_ref` 变更 startup config;`authorized_job_runner_ref` 提交 job-run-start input;`entry_caller_ref` 提交 entry-local selector;`test_harness_ref` 提交 local-dev / ci-test fixture。static design boundary、raw secret/body、redline relax、idempotency disable、audit compensation disable、reload/hot/config center/admin override 不能通过普通配置变更生效。 |
| 哪些配置变更需要评审? | store refs、role source refs、publisher / topic refs、external resolver endpoint refs、handoff target refs、audit sink refs、redaction profile、redline guards、operations replay refs、idempotency/dead-letter retention、profile / adapter mode、future staging/production-like refs 都需要评审。低风险 batch / page / job defaults 在 validator 范围内可轻量评审,但必须审计。critical boundary 变更必须 rejected 或走正式设计变更。 |
| 变更如何生效? | startup config 变更必须重新 source merge、strict parse、validate、assemble,再通过 restart 生效。job-run-start 变更只冻结到 current job run。entry-local 变更只影响 current entry。test fixture 变更只影响 current test harness 或 fake runtime run。P0 不支持 runtime reload / hot update。 |
| 变更如何记录审计? | 审计记录使用产品中立 refs:change_request_ref、actor_ref、reason_ref、config_section、profile_ref、activation_kind、old/new redacted digest、validation_result、validation_issue_ref、rollback_ref、safe_diagnostic_ref、run/release ref。不得记录 raw config、raw secret、full sensitive ref、endpoint、route credential、external body、adapter raw response 或 fixture private map。 |
| 变更失败或效果异常如何回滚? | startup validation/activation 失败不暴露新 facade,回滚到 previous validated config ref/digest 并 restart。job-run-start 失败 reject current run,需要 new run with previous valid input,不得改写 stored job report。entry-local 失败 reject current entry,caller rerun with previous selector。test fixture 失败 restore previous fixture ref and rerun test。critical rejected change 没有 runtime rollback,因为它 never activates。 |
| 每个可变更配置项是否回指 Step 7 配置项、Step 8 敏感性、Step 9 生效机制和 Step 11 失效策略? | 是。§7.3 明确配置族到 Step 7 / Step 8 / Step 9 / Step 11 的回指。 |
| 每类配置变更完成后是否通过停审? | 已通过。§7.7 按权限、评审、审计、回滚、失败处理和敏感性逐类停审。 |
| 所有变更规则完成后是否存在高风险配置无评审、无审计、无回滚或敏感配置变更泄露? | 已审计。§7.8 未发现 unresolved 冲突。P0 不假定具体工单系统,只要求 opaque change / actor / reason / rollback refs 和 redacted digests。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已列字段和失败策略,但未定义变更主体、评审等级和 rollback | 本 Step 按配置族补齐变更控制表 |
| Step 8 敏感配置 | 已定义 refs、轮换和禁止输出,但变更审计字段未完整化 | 本 Step 固定 old/new redacted digest、validation issue ref、safe diagnostic ref 和 full sensitive ref 禁止输出 |
| Step 9 生效机制 | 已定义 activation,但没有变更失败后的 rollback 行为 | 本 Step 按 startup / job-run-start / entry-local / test harness / static-rejected 定义 rollback |
| Step 4 禁止配置化边界 | 已列 static boundary,但 Step 10 需要说明这些变更不是可审批配置 | 本 Step 将 static invariant / redline relax / raw body / hot reload 归为 critical rejected |
| 新版 `03` §13~§15 | 已定义 config ownership 和 observability redaction,但不定义配置变更 repository | 本 Step 使用配置设计审计语义,不新增 `03` repository / DTO |
| 旧 Step 10 | 粒度偏短,引用旧下游验收/实施,未完整回指 Step 7~11 | 本 Step 全量替换为新版 Step 7~9 结论 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 变更主体 | maintainer / release owner / ops runner 粗分 | product-neutral actor refs:operator、release automation、authorized job runner、entry caller、test harness、design change | 不绑定组织/产品,但可审计 |
| 评审层级 | 高风险/轻量粗分 | low / medium / high / critical,并明确 critical rejected | 防止红线被评审通过 |
| 生效方式 | Step 9 已定义 activation | 增加每种 activation 的 rollback 规则 | 变更异常需要稳定恢复路径 |
| 审计字段 | 旧稿只列 key/source/digest | 增加 change_request_ref、actor_ref、reason_ref、activation_kind、rollback_ref、validation_issue_ref、safe_diagnostic_ref | 支撑测试和验收 |
| 敏感配置变更 | 只说记录 digest | 按 store/resolver/publisher/topic/target/replay/redaction/future provider 建附加规则 | 防泄露和防产品假设 |
| 回滚对象 | 恢复旧 config 粗述 | previous validated config、new job run、entry rerun、test rerun、never-activated reject 分类 | 与 Step 9 生效机制一致 |
| hot/reload | 旧稿说不支持 | 变更/回滚层也没有 hot path;presence is rejected | 避免无 rollback contract 的在线切换 |
| `03` 影响 | 提到未来 repository | 扩展为 config center/hot reload/secret provider/change audit repository 都必须回写 | 保持 `04` 不补代码契约 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否绑定具体工单 / 审批系统 | A. 指定产品;B. 使用 opaque refs | 采用 B。配置设计不依赖具体平台 |
| P0 是否支持 runtime hot rollback | A. 支持;B. restart / new run / rerun | 采用 B。Step 9 已固定 reload/hot unsupported |
| 审计是否记录完整配置 diff | A. 记录完整 diff;B. 记录 redacted digest + section + issue refs | 采用 B。完整 diff 可能含 sensitive ref 或拓扑 |
| 低风险阈值变更是否都人工评审 | A. 全部人工评审;B. validator 范围内可由 release automation 轻量变更 | 采用 B。仍需审计 |
| job-run-start 配置是否覆盖全局 | A. 覆盖;B. 只影响 current run | 采用 B。承接 Step 9 |
| sensitive ref 轮换是否记录 full ref | A. 记录 full ref;B. 只记录 redacted digest | 采用 B。full ref 可能泄露 endpoint/target/credential identity |
| critical boundary 是否可紧急配置绕过 | A. 可 emergency override;B. reject 或 formal design change | 采用 B。防止配置绕过真相源 |

## 7. 结构化中间产物

### 7.1 变更 actor 与评审层级

| Actor / role ref | 允许范围 | 不允许范围 | 审计要求 |
|---|---|---|---|
| `operator_ref` | 提交 startup config file / env ref / deployment profile 变更,执行 restart / rollback | 修改 domain truth、绕过 validator、注入 raw secret、启用 hot reload | actor、reason、change request、old/new digest、validation result |
| `release_automation_ref` | 应用已评审 config artifact、运行 validation、记录 digest、执行 release restart | 自动批准 high / critical 变更,覆盖 redline | release run ref、config digest、validation issue refs |
| `authorized_job_runner_ref` | 提交 job-run-start scope、batch、target、replay roots、run identity 等 run-local input | 覆盖 startup invariant、修改全局 config、写 raw target credential | job run id、input digest、target/root digest、validation result |
| `entry_caller_ref` | 提交 entry-local profile/config selector、request metadata、page cursor、dry-run diagnostic selector | 持久化覆盖、绕过 startup validation、替代 protocol metadata | entry ref、selector digest、request source digest、rejection issue |
| `test_harness_ref` | 加载 fake fixture、fixed clock/id、seed refs、test-local fake adapter | 进入 integration-like / staging-like / production-like runtime | test run ref、fixture digest、profile |
| `design_change_ref` | 对 static design boundary / critical config 走正式设计变更 | 在 P0 runtime 中直接生效 | design baseline ref、review record、downstream sync ref |

| 评审层级 | 适用变更 | 要求 |
|---|---|---|
| `low` | batch/page/limit 收窄、job input 在已校验范围内变更、entry-local selector | 可由 release automation / job runner / entry caller 执行;必须有审计 |
| `medium` | local-dev / ci-test / integration-like profile、fake/controlled refs、fixture refs、non-sensitive job defaults | 需要 reviewer / release approval ref;validation pass 后生效 |
| `high` | durable store refs、role source refs、publisher/topic refs、external endpoint refs、handoff target refs、audit sink refs、operations-replay roots、retention、adapter mode changes | 必须评审、审计、rollback plan;失败不得 fallback fake |
| `critical` | redline 放松、raw secret/body 进入 ordinary config、fake fixture 进入 production-like、hot/reload request、truth invariant override、idempotency/audit compensation 关闭 | P0 直接 reject 或要求正式设计变更;不得作为普通 config change 生效 |

### 7.2 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| profile name / adapter policy | `operator_ref` / `release_automation_ref` | medium;future production-like high | startup + restart;entry-local selector only current entry | old/new profile digest、source kind、validation result | restore previous validated config and restart;entry selector rerun |
| test override boundary | `operator_ref` / `test_harness_ref` | medium;non-test profile attempt critical reject | startup / test harness | profile、fixture gate digest、validation issue | restore previous gate;rerun test |
| store mode / `dsn_ref` | `operator_ref` / `release_automation_ref` | high | startup + restart | store slot、old/new redacted ref digest、migration validation | restore previous approved store ref;restart |
| migration required version | `operator_ref` / `release_automation_ref` | high | startup + restart | old/new version digest、schema baseline result | restore previous version or perform formal schema design change |
| transaction / idempotency guard | any source | critical if relaxing | no activation for invalid value | rejected issue ref、source kind | no runtime rollback;never activates |
| dead-letter retention | `operator_ref` / `release_automation_ref` | medium;widen/narrow beyond replay expectations high | startup + restart | old/new retention class、validation result | restore previous retention;restart |
| actor context requirements | `operator_ref` / `release_automation_ref` | high if relaxing;medium if stricter | startup + restart | actor context rule digest、trace/idempotency requirement | restore previous guard;restart |
| role source mode / snapshot ref | `operator_ref` / `release_automation_ref` | high | startup + restart | source mode、snapshot ref digest、fingerprint validation | restore previous source ref;restart;accepted truth not rolled back |
| role fixture ref | `test_harness_ref` | medium;non-test attempt critical reject | test harness / startup for local-dev/ci-test | fixture digest、profile、test run ref | restore previous fixture;rerun test |
| bus publisher mode / endpoint ref | `operator_ref` / `release_automation_ref` | high | startup + restart | publisher slot、mode、old/new ref digest | restore previous publisher config;pending outbox unchanged |
| topic map ref | `operator_ref` / `release_automation_ref` | high | startup + restart | changed event keys digest、coverage validation | restore previous topic map;restart;do not synthesize topics |
| outbox batch / attempts / backoff | `operator_ref` / `authorized_job_runner_ref` | low to medium;unsafe range rejected | startup or job-run-start | job kind、old/new numeric class、run id optional | restore defaults or rerun job with previous input |
| outbox failure mode | any source | critical if not `mark-failed-no-rollback` | no activation for invalid value | rejected issue ref | no rollback;never activates |
| projection store/checkpoint | `operator_ref` / `release_automation_ref` | medium to high | startup + restart;checkpoint selector job-run-start where allowed | checkpoint digest、validation result | restore previous checkpoint/config;new job run |
| projection rebuild batch | `operator_ref` / `authorized_job_runner_ref` | low to medium | startup or job-run-start | batch class、job run id | restore default or rerun job |
| operations run id requirement | any source | critical if false | no activation | rejected issue ref | no rollback;never activates |
| operations replay roots | `authorized_job_runner_ref` / `release_automation_ref` | high | job-run-start | report/input root digest、run id、de-identification marker | reject run or new run with previous roots;stored reports immutable |
| propagation retry enabled | `operator_ref` / `release_automation_ref` | medium | startup/job-run-start | enabled digest、job kind、validation result | restore previous setting;terminal states unchanged |
| external resolver mode / endpoint refs | `operator_ref` / `release_automation_ref` | high when endpoint/controlled | startup + restart | resolver family、mode、old/new endpoint digest | restore previous resolver ref;restart;no fake fallback |
| work source mode | `operator_ref` / `release_automation_ref` | medium/high by mode | startup + restart | mode digest、profile、consumer availability | restore previous mode;restart |
| trace handoff target ref | `operator_ref` / `authorized_job_runner_ref` | high | startup or job-run-start | target digest、job run id optional、handoff marker refs | restore target set or new job with previous target |
| audit sink ref | `operator_ref` / `release_automation_ref` | high | startup + restart | sink mode、old/new ref digest、compensation status | restore previous sink;restart;compensation retained |
| audit redaction profile | `operator_ref` / `release_automation_ref` | high;unsafe relax critical reject | startup + restart | old/new profile digest、reason ref、validation result | restore previous profile;restart |
| redline guards | any source | critical if false | no activation for false | rejected issue ref、guard path | no rollback;never activates |
| fixture clock / id / seed | `test_harness_ref` | medium;non-test attempt critical reject | test harness / local-dev startup | fixture digest、clock/id mode、test run ref | restore previous fixture;rerun test |
| forbidden raw secret / body attempt | any source | critical reject | no activation | forbidden material class、validation issue ref | no rollback;config never activates |
| reload / hot / config center / admin override request | any source | critical reject in P0 | no activation | unsupported activation issue ref | no rollback;requires future design change |
| static design boundary override | any source | critical reject | no activation | forbidden key class、validation issue ref | no rollback;requires formal design change |

### 7.3 配置族回指表

| 配置族 | Step 7 配置项 | Step 8 敏感性 | Step 9 生效机制 | Step 11 失效策略承接 |
|---|---|---|---|---|
| profile | `profile.*` | internal | startup / entry-local selector | invalid profile fail-fast;unsupported reload reject |
| store | `store.*` | `dsn_ref` sensitive | startup | missing/invalid store fail-fast;previous digest rollback |
| actor_context | `actor_context.*` | internal;no auth secret | startup + entry metadata | missing actor/trace/idempotency rejects entry |
| role_catalog | `role_catalog.*` | snapshot sensitive-adjacent;fixture test-internal | startup / test harness | unavailable source rejected/degraded by flow;fixture invalid test fail-fast |
| bus / outbox | `bus.*`, `outbox.*` | endpoint/topic refs sensitive | startup / job-run-start | topic missing fail-fast;publish failure retry/failed marker |
| projection | `projection.*` | internal | startup / job-run-start | query not-ready/degraded;job failure report |
| operations | `operations.*` | replay roots sensitive-adjacent | job-run-start | invalid run rejected;stored report immutable |
| external_refs | `external_refs.*` | endpoint/target refs sensitive | startup / job-run-start | disabled/fail-closed/unavailable per adapter role |
| audit | `audit.*` | sink ref sensitive;redaction safety-critical | startup | audit sink unavailable / compensation handled Step 11 |
| redline | `redline.*` | internal safety-critical | startup/static guard | false fail-fast;no degraded bypass |
| fixture | `fixture.*` | test-internal | test harness / local startup | invalid fixture test fail-fast |
| critical rejected | raw secret/body, reload/hot, static override | secret / forbidden | no activation | validation reject;formal design change if needed |

### 7.4 审计记录规则

| 审计字段 | 必填性 | 说明 | 禁止内容 |
|---|---|---|---|
| `change_request_ref` | high / critical 必填;low 可由 release/run ref 替代 | 产品中立变更引用,不假定具体工单系统 | 工单正文、free-text secret |
| `actor_ref` | 必填 | operator、automation、job runner、entry caller 或 test harness opaque ref | credential、个人敏感正文 |
| `reason_ref` | high 必填 | 指向批准原因或运维原因的 safe ref | 原始审批正文 |
| `config_section` | 必填 | `store`, `bus`, `operations.replay`, `redline` 等 section | raw config body |
| `profile_ref` | 必填 | 变更作用 profile 或 run profile | 无 |
| `activation_kind` | 必填 | startup、job-run-start、entry-local、test-harness、rejected | hot/reload 不得作为 P0 成功值 |
| `old_config_digest` / `new_config_digest` | startup 变更必填 | redacted canonical digest,不含 raw secret/full sensitive ref | 完整配置文件 |
| `old_ref_digest` / `new_ref_digest` | sensitive refs 必填 | store/adapter/topic/target/replay refs 的 redacted digest | full sensitive ref、endpoint、route credential |
| `validation_result` | 必填 | accepted / rejected / failed_validation | raw validation input |
| `validation_issue_ref` | rejected 时必填 | redacted issue ref | raw invalid value |
| `rollback_ref` | high 变更必填 | previous approved config/input/fixture ref 或 rollback run ref | rollback script body with secrets |
| `safe_diagnostic_ref` | 可选 | 指向 redacted diagnostic material | stack trace with secrets、HTTP body、SQL、adapter raw response |
| `run_or_release_ref` | job/test/release 变更必填 | job run、test run 或 release run opaque ref | raw artifact body |

### 7.5 回滚规则矩阵

| 生效方式 | 变更成功判定 | 失败 / 异常判定 | 回滚方式 | 不允许的回滚 |
|---|---|---|---|---|
| startup | strict parse/type/range/cross-field/sensitive validation pass;runtime builder assembled;facade exposed | validation reject、builder failed、required adapter/store missing、post-start smoke failed | restore previous validated config ref/digest;restart;record rollback ref | runtime hot patch、跳过 validator、fallback lower-priority invalid value |
| job-run-start | job input validation pass;run context frozen;job report or rejected surface produced | invalid target/scope/batch/replay root、target disabled、partial failure | start new job with previous valid input or corrected target;stored report immutable | mutate previous report to pretend success、reuse conflicting idempotency key with different digest |
| entry-local | selector validation pass;entry uses selected profile/config source | invalid selector/config path/profile/page cursor | reject current entry;caller rerun with previous selector | write selector into global config |
| test harness | fixture validation pass;fake runtime assembled | invalid fixture/ref/time/id seed;non-test fixture attempt | restore previous fixture ref;rerun test | let fixture leak into production-like |
| rejected critical change | validation rejects before activation | raw secret、raw body、redline unsafe relax、hot/reload request、truth invariant override | no runtime rollback;record rejected issue;requires design change if needed | activate under emergency flag |

### 7.6 敏感配置变更附加规则

| 敏感配置族 | 读取规则 | 轮换规则 | 审计规则 | 禁止输出 |
|---|---|---|---|---|
| store refs | loader validates ref shape;adapter resolves internally if future provider exists | new approved store ref + restart | slot、old/new ref digest、profile、validation result | DSN、URL、credential、full ref |
| role source refs | snapshot/fixture refs validated by source mode and profile | new source ref + restart/test rerun | source mode、fingerprint status、ref digest | RoleDefinition / CapabilityDefinition body |
| publisher / topic refs | topic-neutral key to route ref map only | new route map + restart | changed keys、route digest、coverage check | raw topic secret、transport credential |
| external resolver refs | adapter family refs validated by mode/profile | new adapter ref + restart | family、mode、old/new digest、availability marker | endpoint credential、sibling response body |
| handoff targets | enabled target set validated at startup or job-run-start | new target ref + restart/new run | target digest、job run、marker refs | package body、target credential |
| replay root refs | de-identified report/input root ref only | new replay root per run | run id、root digest、de-identification marker | raw historical body |
| audit sink / redaction | sink ref and profile validate before builder exposure | new sink/profile + restart | old/new digest、review/reason ref、compensation status | raw log target credential、matched raw values |
| fixture refs | only local-dev / ci-test | new fixture ref + rerun test | fixture digest、test run ref | fake private map、raw seed body、secret |
| future secret provider refs | only if future `03` contract exists | provider-side rotation plus restart/revalidation | provider ref digest only | secret material |

### 7.7 配置变更停审记录

| 配置项 / 变更类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| profile / adapter policy | 权限、评审、生效、回滚 | 通过 | P1/P2 production-like 继续作为未来方向 |
| store refs / migration | high-risk review、redacted audit、restart rollback | 通过 | durable product schema 留 P1/P2 |
| actor context | no-auth boundary、trace/idempotency requirement | 通过 | 不新增 auth 配置 |
| role source / fixture | source body exclusion、fixture profile isolation | 通过 | fixture non-test rejected |
| bus / outbox | topic completeness、publisher endpoint、pending outbox rollback | 通过 | outbox truth 不回滚 |
| projection / operations jobs | run-local freeze、report immutability、new run rollback | 通过 | stored report immutable |
| external_refs / handoff | endpoint/target review、sensitive ref audit | 通过 | no body/package in audit |
| audit / redaction | compensation true、redaction relax rejected | 通过 | Step 11 handles sink failure |
| redline / critical rejected | no activation,formal design change required | 通过 | no emergency config bypass |
| fixture / test harness | local/CI only,rerun test rollback | 通过 | production-like fixture rejected |
| sensitive refs | redacted digest only,no full ref output | 通过 | exact digest algorithm留 Step 14 |

### 7.8 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险配置是否都有评审 | 通过 | store/source/publisher/topic/target/audit/replay/redaction/retention all high |
| 高风险配置是否都有审计字段 | 通过 | §7.4 fixed safe audit fields |
| 高风险配置是否都有回滚方式 | 通过 | startup restore previous digest;job new run;fixture rerun |
| 是否假定具体工单系统 | 未假定 | 使用 product-neutral refs |
| sensitive ref 是否可能泄露到 audit/log/report | 不允许 | only redacted digest / issue ref |
| raw secret/body 是否能作为配置变更成功 | 不可 | critical reject |
| hot/reload 是否绕过 rollback contract | 不可 | unsupported and rejected |
| job-run-start 是否覆盖全局 config | 不可 | run-local frozen params only |
| entry-local 是否能持久化覆盖 | 不可 | current entry only |
| previous invalid config 是否可作为 rollback target | 不可 | rollback target must be previous validated / approved digest |
| failed job report 是否可改写为成功 | 不可 | new run only;stored report immutable |
| static design boundary 是否可被审批绕过 | 不可 | requires formal design change |
| 变更规则是否回指 Step 7/8/9/11 | 通过 | §7.3 complete |
| 是否需要回写 `03` | 当前无 | config center/hot reload/secret provider/change audit repository 需要未来回写 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置变更审计使用 product-neutral refs,不假定具体 ticket / approval system | 否 | 运维 / 配置设计口径 | 不适用 | 无回写 |
| P0 变更生效仍限 startup restart、new job run、entry rerun、test rerun | 否 | 承接 Step 9 activation | 不适用 | 无回写 |
| high-risk 配置必须评审、审计、rollback plan | 否 | 配置治理规则 | 不适用 | 无回写 |
| 审计只记录 redacted digest / issue refs,不记录 raw config/full sensitive refs | 否 | 承接 Step 8 / `03` §14 forbidden output | 不适用 | 无回写 |
| stored job report、accepted truth、outbox material 不因 config rollback 被改写 | 否 | 承接 `03` idempotency/report/outbox immutability | 不适用 | 无回写 |
| critical boundary change 只能 reject 或 formal design change | 否 | 承接 Step 4 static design boundary | 不适用 | 无回写 |
| 若后续要求 remote config center、admin override、runtime hot reload、last-known-good live switch、real secret provider rotation API 或 config change audit repository | 是 | runtime builder / config loader / adapter constructor / audit repository / rollback / error recovery contract | `03` §13~§15 或对应 object-port-flow Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §10 可回填:

```md
## 10. 配置变更、审计与回滚

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`

`L1-identity` P0 不启用 config center、admin override、runtime reload 或 hot update。startup 配置变更必须重新 source merge、strict parse、validate、assemble,并通过 restart 生效;job-run-start 变更只影响 new job run;entry-local 参数只影响 current entry;test fixture 变更只影响 current test harness 或 fake runtime run。

配置变更使用 product-neutral refs 表达发起方、原因、评审和回滚:operator、release automation、authorized job runner、entry caller、test harness 和 design change refs。store refs、role source refs、publisher/topic refs、external endpoint refs、handoff target refs、audit sink refs、operations replay roots、retention、adapter mode 和 redaction 变更属于 high-risk,必须评审、审计并具备 rollback plan。redline 放松、raw secret/body 进入 ordinary config、fake fixture 进入 production-like、hot/reload request、truth invariant override、idempotency/audit compensation 关闭属于 critical rejected。

审计记录只允许保存 config section、profile、activation kind、old/new redacted digest、validation result、validation issue ref、rollback ref、safe diagnostic ref 和 run/release ref。不得保存 raw config、raw secret、full sensitive ref、endpoint、route credential、external body、adapter raw response 或 fixture private map。回滚只能恢复 previous validated config 后 restart、发起 new job run、entry rerun 或 test rerun;不得改写 accepted truth、stored job report、outbox material 或 projection truth。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q43 | future ticket / approval system 是否统一 | 影响 `change_request_ref` 外部解析 | P0 不指定产品,只保留 opaque ref |
| ID-CONFIG-Q44 | future production-like 是否需要 zero-downtime reload / last-known-good live switch | 影响 runtime builder、rollback、stateful adapter replacement | P0 unsupported;Step 13/14 记录演进 |
| ID-CONFIG-Q45 | secret provider rotation 是否需要应用内重读 | 影响 adapter constructor、secret provider port 和 error model | P0 不定义;future 回写 `03` |
| ID-CONFIG-Q46 | 是否需要正式 ConfigChangeAuditRepository / DTO | 影响 `03` repository / persistence / audit contract | 当前不新增;future 启用需回写 `03` |
| ID-CONFIG-Q47 | redacted config digest canonicalization 算法 | 影响 audit/evidence 稳定性 | 本 Step 只要求 redacted canonical digest;算法留 Step 14 / 实现规范 |

## 11. 进入下一步条件

- 配置变更表已覆盖 startup、job-run-start、entry-local、test harness 和 static-rejected。
- actor / review level 已定义,且不绑定具体 ticket / approval product。
- 审计字段已定义且排除 raw secret、full sensitive ref、external body、adapter raw response 和 fixture private map。
- 回滚规则已定义,且不回滚 accepted truth、stored job report、outbox material 或 projection truth。
- 敏感配置变更附加规则已覆盖 store、role source、publisher/topic、external resolver、handoff target、replay roots、audit/redaction、fixture 和 future provider。
- 配置变更停审和跨变更审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义 ConfigChangeAudit DTO、repository、ticket system、secret provider API、hot reload、config center、测试编号、evidence 路径或 implementation boundary。

下一步进入 Step 11:定义失效模式与降级 / fail-fast 策略。
