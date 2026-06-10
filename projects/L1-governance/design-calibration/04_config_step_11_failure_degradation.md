# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节: `04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义失效模式与降级 / fail-fast 策略 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 来源优先级;Step 7 配置项清单;Step 8 敏感配置;Step 9 加载、校验与生效机制;Step 10 配置变更、审计与回滚;详细设计 Step 12 / Step 14 / Step 15 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

本 Step 定义 `L1-governance` 配置缺失、格式错误、类型错误、范围错误、交叉字段冲突、敏感信息违规、配置来源不可用、外部 adapter 不可用、配置漂移或配置过期时系统如何表现。

本 Step 只回答:

- 哪些配置失败必须 fail-fast,阻止 runtime / job / entry / test 继续。
- 哪些安全相关失败必须 fail-closed,不得按宽松默认值继续。
- 哪些运行期外部依赖不可用可以映射为 degraded / delayed / failed marker。
- P0 是否允许 silent fallback、low-priority fallback、online last-known-good 或 hot reload。
- 配置失败时是否告警、记录哪些 redacted evidence,以及测试切口是什么。

本 Step 不定义:

- 具体告警平台、SLO、pager escalation、dashboard、runbook 命令或部署产品。
- 具体 config center 产品。P0 没有 remote config center/admin override。
- 具体 secret provider/KMS/Vault API。P0 普通配置只保存 opaque refs。
- retry/backoff 的精确时间参数。配置项只保存 retry policy ref,策略体和运行调度细节留给后续运维/实施。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 defaults/file/env/entry-local/job input 的优先级和高优先级非法值不 fallback 规则 |
| `04_config_step_07_config_items.md` | 已完成 | 提供配置项、必填性、来源、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 secret/sensitive/ref 禁止输出、raw secret reject 和轮换边界 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 startup、job-run-start、entry-local、test harness 生效时机和 validation issue surface |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供变更回滚、审计和 previous validated config 口径 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、adapter unavailable、degraded query、worker delayed、job failed 的错误映射 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 config binding、adapter registry、禁止配置化边界和外部依赖绑定 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation rejected、adapter unavailable、degraded/stale 的日志、指标和审计字段 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填配置缺失时系统如何处理? | startup 必填配置缺失时 runtime builder 进入 `Failed`,不暴露 API / worker / jobs facade。job-run-start 必填 scope/target/page/batch 缺失时当前 job rejected。entry-local selector 缺失或非法时当前 entry rejected。test fixture 必填缺失时 test fail-fast。 |
| 配置类型错误、范围错误、交叉字段错误时如何处理? | 统一由 Step 9 validator 产生 redacted validation issue。startup 错误 fail-fast;job-run-start 错误 reject current run;entry-local 错误 reject current entry;test harness 错误 test fail-fast。高优先级非法值不得 fallback 低优先级来源。 |
| secret / KMS / Vault 不可用时如何处理? | P0 不定义具体 secret provider/KMS/Vault,普通配置只保存 opaque refs。若 future secret provider 进入设计,provider 不可用在 startup required adapter 上必须 fail-fast;在 job-run-start target 上 reject/failed marker;在 query/consumer/job 的运行期 resolver 上按正式 adapter role 返回 degraded/delayed/failed,不得 fallback fake 或输出 secret。 |
| config center 不可达时如何处理? | P0 没有 remote config center/admin override,因此 runtime 不依赖 config center。若未来引入,config center 不可达不能在线回退到未验证配置;只能使用本地 previous validated artifact 作为新启动输入,并写 config source unavailable audit。 |
| 配置漂移或过期如何发现和处理? | 通过 redacted config digest、profile ref、activation kind、runtime builder state、job input digest、fixture digest 和 validation issue refs 检测。startup 漂移必须重新 validation;不一致则 fail-fast。job input 漂移只影响 new run,既有 stored report 不改写。operations-replay/test fixture 过期则 reject/fail-fast。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项 | 多数配置项写了 fail-fast/reject,但缺少统一失效模式表 | 本 Step 汇总所有 P0 failure behavior |
| Step 8 敏感配置 | 已定义 raw secret reject,但 secret provider unavailable 口径仍需归入 failure table | 本 Step 固定 P0 无 provider;future provider 不可用不得 fallback fake |
| Step 9 加载机制 | 已定义 validation issue surface,但未说明告警和测试切口 | 本 Step 增加 alert / test cut |
| Step 10 回滚 | 已定义 previous validated config restart,但未说明 last-known-good 与 silent fallback 边界 | 本 Step 固定 P0 无 live last-known-good;只允许 restart rollback |
| Step 14 adapter binding | 已定义 external dependency degraded,但配置错误与运行期 adapter unavailable 容易混淆 | 本 Step 区分 config validation failure 与 runtime dependency failure |
| 正式 `04` | 尚未创建 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| fail-fast | 分散在配置项表 | 汇总到 startup/job/entry/test 四个 activation surface | 实现和测试需要统一判定 |
| fail-closed | 只在安全章节隐含 | 明确 raw secret、redaction unsafe、visibility/capability bypass、static boundary override 均 fail-closed | 防止安全配置被宽松默认值覆盖 |
| degraded | 详细设计已有 query/job/consumer degraded | 明确 degraded 只适用于运行期外部依赖/read model,不适用于非法配置 | 避免把配置错误降级成成功运行 |
| last-known-good | Step 10 只有 previous validated rollback | 明确 P0 无在线 last-known-good/live switch | 避免实现侧私造 reload path |
| config center | 未进入 P0 | 明确不可达场景不适用;future 需回写 `03` | 避免凭空引入外部依赖 |
| 告警与测试 | Step 15 有日志指标切口 | 本 Step 给 failure mode 到 alert/test cut 的表 | 方便 Step 12 下游承接 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 非法 startup config | A. 使用默认值继续;B. fail-fast | 采用 B。高风险失败不得 silent fallback |
| 高优先级 env 非法 | A. fallback file/default;B. fail-fast | 采用 B。承接 Step 5 |
| 安全配置不确定 | A. fail-open;B. fail-closed | 采用 B。raw secret、redaction、visibility/capability 边界都不可放宽 |
| 外部 adapter 不可用 | A. 一律启动失败;B. required startup adapter fail-fast,运行期依赖按 role degraded/delayed/failed | 采用 B。区分配置闭合和运行依赖健康 |
| last-known-good | A. 在线切换 LKG;B. P0 只允许 previous validated config restart rollback | 采用 B。P0 无 reload/hot contract |
| config center | A. P0 引入;B. P0 不引入 | 采用 B。remote config center/admin override 留 Step 13/14 风险 |

## 8. 结构化中间产物

### 8.1 策略术语定义

| 策略 | 本项目含义 | 适用范围 | 不适用范围 |
|---|---|---|---|
| `fail-fast` | validation / build / entry / job start 阶段立即失败,不暴露 facade 或不进入 mutation | startup config、job input、entry selector、test fixture、required adapter binding | 已 accepted truth、已 stored report 的事后改写 |
| `fail-closed` | 安全边界不明确时拒绝,不使用宽松默认值 | raw secret/body、redaction unsafe、visibility bypass、static boundary override、production-like fake | 普通低风险 batch 收窄 |
| `degraded` | read/job/consumer surface 显式返回 stale/unavailable/failed marker,核心 truth 不被修复或回滚 | query projection/reference stale,external resolver unavailable,adapter degraded | startup config type/required/cross-field 错误 |
| `delayed` | worker/job 因临时依赖不可用而推迟重试 | inbound consumer resolver/store unavailable,outbox scan unavailable | invalid config、unsupported event version、raw body |
| `failed marker` | operations job 或 adapter action 失败后写入正式 failed publication/handoff/reference/report marker | outbox publish failure,reference refresh failure,handoff/export failure | command accepted truth rollback |
| `last-known-good` | 在线继续使用上一份已验证配置 | P0 不支持 | 不得作为 runtime reload fallback |
| `restart rollback` | operator 恢复上一份已验证 config ref/digest 后重新启动 runtime | startup 配置变更失败或异常 | 不得跳过 validation |

### 8.2 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| runtime config file missing and required by entry | runtime 无法确定配置输入 | entry rejected or startup fail-fast | 是 | missing config path rejects before builder |
| strict JSON parse failed | runtime config 不可信 | fail-fast;builder `Failed`;不暴露 facade | 是 | JSONC/comment/trailing comma rejected |
| unknown top-level section | 配置可能拼写错误或越界 | fail-fast | 是 | unknown section validation issue |
| unknown nested field | 配置可能拼写错误 | fail-fast unless explicitly future-reserved by schema | 是 | unknown field issue carries redacted path |
| required field missing | adapter/store/job/feature 不闭合 | startup fail-fast;job-run-start reject;test fail-fast | 是 | each required Step 7 item missing |
| invalid enum | profile/mode/kind 不可执行 | fail-fast/reject current input | 是 | bad profile/adapter/job kind |
| invalid type | loader 无法组装 typed config | fail-fast/reject current input | 是 | string vs integer/bool/list/map mismatch |
| invalid range | timeout/batch/retention/page 不安全 | fail-fast;job-run-start reject | 是 for startup;可选 for entry | boundary/job/idempotency range tests |
| invalid timestamp | fixture/replay 不可重现 | test fail-fast or replay job rejected | 否/低级别 | bad fixedClockInstant |
| duplicate list item | resolver family/topic/job kind 不唯一 | fail-fast | 是 | duplicate family/topic key |
| high-priority source invalid | env/entry/job 覆盖值非法 | fail-fast/reject;不得 fallback lower priority | 是 | invalid env does not use file/default |
| conflicting sources | file/env/job scope 冲突且无规则 | fail-fast/reject current input | 是 | source conflict produces issue |
| entry-local tries global override | 越权修改 startup invariant | entry rejected | 是/安全 | selector cannot override store/topic/invariant |
| job input tries global override | job 越权修改 runtime config | job rejected | 是/安全 | job input cannot override startup config |
| raw secret in ordinary config | secret 泄露风险 | fail-closed;validation reject | 是/安全 | password/token/private key patterns rejected |
| full sensitive ref in output request | 审计/日志泄露风险 | fail-closed or redaction issue;no raw output | 是/安全 | log/audit/report redaction check |
| redaction deny list empty | body/secret 可能输出 | fail-closed;startup fail-fast | 是/安全 | empty deny list rejected |
| high-cardinality labels enabled | 指标泄露/爆炸 | P0 fail-closed;startup fail-fast | 是 | true rejected |
| static boundary override key present | 试图改变 truth/state/query/outbox 不变量 | fail-closed;validation reject | 是/安全 | forbidden invariant key rejected |
| production-like selects fake/test fixture | 环境隔离破坏 | fail-closed;startup fail-fast | 是/安全 | fake in production-like rejected |
| integration-like controlled adapter unavailable at startup when required | required adapter 不可用 | startup fail-fast if required by profile;otherwise availability marker degraded/disabled | 是 | required adapter build failure |
| optional adapter disabled by config | 外围能力不可用 | builder Ready with `DisabledByConfig`;dependent job rejected | 可选 | external GRC disabled does not block core |
| external resolver unavailable during command | command 依赖无法验证 | command dependency unavailable/domain rejected;no success trace/outbox | 是 | resolver unavailable rolls back command |
| external resolver unavailable during query | read model/reference 不完整 | query degraded/unavailable marker;no write | 是/可聚合 | query degraded no repository write |
| external resolver unavailable during consumer | event 无法解析 | worker delayed or failed reference marker by flow | 是 | consumer delayed no snapshot/stale |
| publisher unavailable during outbox job | outbound event 未发布 | mark failed retryable or job partial;truth unchanged | 是 | outbox failed marker no truth rollback |
| publisher permanent failure | outbound event 需人工处理 | dead-letter/terminal failed marker by policy | 是/严重 | dead-letter report |
| handoff/export target disabled | handoff/export 不可执行 | job rejected before accepted start or failed marker after accepted start | 是 | target disabled job surface |
| external GRC disabled | export 不执行 | export job rejected/disabled;core commands unaffected | 否/信息 | disabled external GRC does not block truth |
| projection store unavailable at query | read view 不可读 | query degraded/unavailable;no repair write | 是 | query no-write on projection missing |
| projection rebuild config invalid | maintenance job 不可启动 | job rejected | 是 | rebuild batch/scope invalid |
| reference refresh config invalid | maintenance job 不可启动 | job rejected | 是 | refresh scope/batch invalid |
| idempotency retention too short | duplicate replay 不可靠 | startup fail-fast | 是 | retention cross-field conflict |
| report retention shorter than job idempotency | duplicate job report replay 不可靠 | startup fail-fast | 是 | report/job retention conflict |
| config digest drift from expected artifact | runtime 与审计 baseline 不一致 | startup fail-fast or operations audit block;requires revalidation | 是 | digest mismatch rejects release gate |
| previous rollback target not validated | 回滚可能引入坏配置 | rollback rejected;must supply validated digest | 是 | rollback to unvalidated digest rejected |
| config center unavailable | P0 不适用 | no dependency;future design required | 不适用 | config center keys not accepted |
| future secret provider unavailable | future required credential 不可用 | required startup adapter fail-fast;job target reject/failed;no fake fallback | 是 | provider unavailable cannot fallback fake |
| clock/id adapter missing | mutation id/time 无来源 | startup fail-fast or command/job rejected before mutation | 是 | missing id generator blocks command |
| test fixture missing | 测试不可重现 | test fail-fast | 否/测试失败 | fixture required |
| replay artifact root raw body or not de-identified | replay 泄露风险 | job rejected | 是/安全 | replay raw body rejected |
| runtime builder partial assembly | facade 可能半可用 | builder `Failed`;不暴露 facade | 是 | partial builder does not expose services |

### 8.3 按配置域组织的失败策略表

| 配置域 | 典型失败 | 策略 | Public / worker / job surface |
|---|---|---|---|
| runtime | profile invalid,strictValidation false,reload/hot requested | fail-fast / fail-closed | startup failed;no facade |
| stores | missing store,invalid store ref,required durable adapter unavailable | fail-fast | startup failed |
| externalResolvers | missing required family,invalid mode,required adapter unavailable | fail-fast for config;degraded/delayed for runtime calls | command dependency unavailable;query degraded;worker delayed |
| inboundConsumers | unsupported version config,namespace missing,dedup retention invalid | fail-fast | worker not started |
| outbox | topic binding missing,publisher ref invalid,batch invalid | fail-fast for config;failed/dead-letter for runtime publish | job rejected/partial/failed report |
| jobs | unknown job kind,timeout/batch invalid,job disabled | fail-fast or job rejected | `GovernanceJobRunDisposition::Rejected` |
| handoff/archive | target missing/disabled,retry ref invalid | startup fail-fast or job rejected;runtime failed marker | job failed/partial report |
| externalGRC | enabled without adapter/target,target disabled | startup fail-fast or job rejected;disabled no-op for core truth | export job rejected/failed;commands unaffected |
| redaction | deny list empty,unsafe relax,full sensitive output | fail-closed | startup failed or output rejected |
| boundary | page/body/time limit invalid | fail-fast or entry/job rejected | protocol invalid request/job rejected |
| idempotency/result | retention conflict,result replay window unsafe | fail-fast | startup failed |
| projection/reference | stale threshold/batch invalid,retry ref invalid | fail-fast or job rejected;query degraded for runtime missing view/ref | query degraded;job report |
| clock/id | adapter ref missing/profile incompatible | fail-fast | startup failed or mutation rejected before UoW |
| test/replay | fixture missing,raw replay body,production-like fixture | test fail-fast/job rejected/fail-closed | test failure/job rejected |

### 8.4 生效方式到失效策略矩阵

| 生效方式 | 失败检测点 | 策略 | 审计 / 观测 | 恢复 |
|---|---|---|---|---|
| startup | source merge、strict JSON parse、type/range/cross-field/sensitive validation、runtime builder assembly | fail-fast/fail-closed | `Runtime config validation rejected` log + config validation audit + metric | fix config or restore previous validated digest and restart |
| job-run-start | job metadata/input validation、target/scope/page/batch validation、enabled job kind check | reject current run | job rejected surface + validation issue ref | start new run with valid input |
| entry-local | config path/profile selector/dry-run selector validation | reject current entry | entry validation log + issue ref | rerun entry with valid selector |
| test harness | fixture/fake adapter/fixed clock/id validation | test fail-fast | test failure and redacted fixture issue | fix fixture and rerun |
| runtime adapter call | resolver/publisher/handoff/export/store call result | degraded/delayed/failed marker by role | adapter unavailable log/metric/report | retry/backoff/new job/manual repair |
| rejected critical config | secret/body/static boundary/hot reload/fake production-like | fail-closed | security/config validation audit | formal design change or remove invalid config |

### 8.5 告警规则表

| 场景 | 是否告警 | 推荐级别 | 告警安全字段 | 禁止字段 |
|---|---|---|---|---|
| startup config validation rejected | 是 | error | config source ref、section、validation issue ref、profile、config digest | raw config、secret、full sensitive ref |
| runtime builder failed | 是 | error | builder state、adapter slot、validation issue ref | adapter credential/body |
| high-priority invalid source | 是 | error | source kind、section、issue ref | env value/raw file |
| raw secret/body detected | 是 | security/error | forbidden class、section、issue ref | detected secret/body |
| redaction unsafe config | 是 | security/error | redaction rule class、issue ref | matched raw value |
| static boundary override attempt | 是 | security/error | forbidden key class、issue ref | attempted body |
| job input invalid | 是 for scheduled/ops jobs;optional for local manual | warn | job kind、run id、issue ref | job body/raw target |
| entry-local invalid | 可选 | warn/debug by environment | entry kind、selector class、issue ref | local path if sensitive |
| test fixture invalid | 否 as ops alert;test failure | test failure | fixture ref digest、profile | fixture body |
| query degraded due projection/reference | 可聚合 | warn | query kind、view/ref kind、freshness state、degraded marker ref | body/full ref |
| resolver unavailable | 是/聚合 | warn/error by dependency | resolver family、adapter kind、retryable、diagnostic ref | upstream response body |
| publisher failed/dead-letter | 是 | warn/error | outbox ref、event kind、failure reason ref、report ref | payload body/transport credential |
| handoff/export failed | 是 | warn/error | target digest、marker ref、job report ref | package/export body |
| config digest drift | 是 | error | expected digest、actual digest、profile | full config |

### 8.6 测试切口表

| 测试切口 | 覆盖内容 | 预期 |
|---|---|---|
| strict JSON rejects JSONC | runtime parser | comment/trailing comma rejected with issue ref |
| missing required startup field | stores/resolver/outbox/redaction | builder failed,no facade |
| invalid env does not fallback | source priority | higher-priority invalid env fail-fast |
| raw secret rejected | sensitive validator | no raw value in issue/log |
| static boundary override rejected | forbidden config key validator | validation reject,no builder Ready |
| reload/hot config rejected | activation validator | P0 unsupported issue |
| redaction deny list empty rejected | redaction validator | fail-closed |
| topic binding missing for enabled event | outbox cross-field | startup fail-fast |
| external GRC disabled does not block core | externalGrc config | core runtime Ready;export job rejected/disabled |
| enabled external GRC missing target | externalGrc cross-field | startup fail-fast or job rejected |
| job input cannot override store/topic | job-run-start validator | job rejected |
| entry selector cannot override global | entry-local validator | entry rejected |
| query degraded no-write | projection/reference unavailable | degraded surface;no repository write |
| consumer resolver unavailable delayed | inbound consumer | delayed receipt;no snapshot/stale if unresolved |
| publisher failure no truth rollback | outbox job | publication failed/dead-letter marker;truth unchanged |
| rollback target must be validated | Step 10 recovery | unvalidated previous config rejected |
| fixture cannot enter production-like | test/replay profile validation | fail-closed |
| config digest drift blocks release/startup | artifact validation | fail-fast with redacted digests |

### 8.7 配置失效模式停审记录

| 配置项 / 失效类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| required missing | startup/job/entry/test 行为 | 通过 | no silent default |
| parse/type/range/cross-field invalid | fail-fast/reject/test fail-fast | 通过 | high-priority invalid no fallback |
| sensitive/raw secret/body invalid | fail-closed、禁止输出、告警 | 通过 | raw material never logged |
| config center unavailable | P0 是否引入 | 通过 | P0 none;future design required |
| secret provider unavailable | P0/future 口径 | 通过 | P0 none;future no fake fallback |
| adapter unavailable | config failure vs runtime dependency failure | 通过 | required startup fail-fast;runtime degraded/delayed/failed |
| drift/expired config | digest/revalidation/rollback | 通过 | previous rollback target must be validated |
| last-known-good | 是否在线使用 | 通过 | P0 no live LKG/reload |
| degraded query/job/consumer | no-write/no-truth-rollback | 通过 | degradation only via formal surface |
| alert/test cuts | 下游承接 | 通过 | Step 12 will map to 05/06/07/09 |

### 8.8 跨失效策略审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险失败是否 silent fallback | 不允许 | fail-fast/fail-closed |
| 高优先级非法 source 是否 fallback 低优先级 | 不允许 | validation issue and fail-fast |
| 安全配置是否 fail-open | 不允许 | fail-closed |
| 配置错误是否被 degraded 掩盖 | 不允许 | degraded only runtime dependency/read model |
| runtime builder 是否可能半暴露 | 不允许 | builder Failed no facade |
| query degraded 是否写修复副作用 | 不允许 | query no-write |
| publisher/handoff failure 是否回滚 accepted truth | 不允许 | marker/report only |
| external GRC disabled 是否阻断核心 truth | 不阻断 | export disabled/rejected only |
| last-known-good 是否被当作 online reload | 不允许 | restart rollback only |
| raw secret/body 是否进入 alert/log/audit | 不允许 | redacted issue refs only |
| 是否需要回写 `03` | 当前无 | future config center/secret provider/hot reload requires `03` update |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| startup 配置错误统一 fail-fast,不暴露 facade | 否 | 承接 Step 14 runtime builder state | 不适用 | 无回写 |
| 高优先级非法值不得 fallback 低优先级来源 | 否 | 承接 Step 5 来源优先级 | 不适用 | 无回写 |
| raw secret/body/redaction unsafe/static boundary override fail-closed | 否 | 承接 Step 8 / Step 14 / Step 15 安全边界 | 不适用 | 无回写 |
| degraded 只用于运行期 external dependency / projection / reference surface | 否 | 承接 Step 12 error recovery | 不适用 | 无回写 |
| P0 不支持 online last-known-good、runtime reload 或 config center fallback | 否 | 承接 Step 9 / Step 10 activation and rollback | 不适用 | 无回写 |
| 若后续要求 remote config center、online LKG、hot reload、secret provider health contract 或 production alert threshold | 是 | runtime builder / config loader / adapter availability / error recovery / observability contract | `03` §13 / §14 / §15 或对应详细设计校准 Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“策略术语定义”“失效模式表”“按配置域组织的失败策略表”“生效方式到失效策略矩阵”“告警规则表”“测试切口表”“配置失效模式停审记录”和“跨失效策略审计表”小节,了解配置异常如何映射到 fail-fast、fail-closed、degraded、delayed 或 failed marker。

正式 `04-配置设计.md` §11 应回填:

- 策略术语定义。
- 失效模式表。
- 按配置域组织的失败策略表。
- 生效方式到失效策略矩阵。
- 告警规则表。
- 测试切口表。
- 配置失效模式停审记录。
- 跨失效策略审计表。
- 对详细设计的影响判定。

回填要求:

- 必须明确高风险失败不得 silent fallback。
- 必须明确高优先级非法来源不得 fallback 低优先级来源。
- 必须区分非法配置 fail-fast / fail-closed 与运行期外部依赖 degraded / delayed。
- 必须说明 P0 无 remote config center、admin override、hot reload 和 online last-known-good。
- 必须禁止 raw secret、full sensitive ref、external body 出现在告警、日志、审计、trace、report。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future production-like 是否需要 online last-known-good config | 影响 runtime reload、config store、rollback contract | P0 不支持;Step 13/14 记录演进 |
| future 是否需要 remote config center | 影响 source priority、availability、audit、rollback | P0 不引入 |
| future secret provider/KMS 是否进入 runtime builder | 影响 adapter constructor 和 health check | P0 只保存 refs;provider body 不进入 config |
| 告警阈值、聚合窗口、SLO | 影响运维手册和部署 | 本 Step 只定义是否告警和安全字段 |
| retry policy body 是否展开 | 影响 job/worker runtime | 当前只保存 retry policy ref;策略体留实施/运维 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置失效模式有处理方式 | 通过 | 见 §8.2 |
| fail-fast / fail-closed / degraded / delayed / failed marker 已区分 | 通过 | 见 §8.1 |
| 高风险失败不得 silent fallback 已明确 | 通过 | 见 §8.8 |
| secret / config center / drift / expired config 已处理 | 通过 | 见 §8.2 / §8.7 |
| 告警安全字段已定义 | 通过 | 见 §8.5 |
| 测试切口已定义 | 通过 | 见 §8.6 |
| 配置失效模式停审完成 | 通过 | 见 §8.7 |
| 跨失效策略审计没有 unresolved 冲突 | 通过 | 见 §8.8 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 12 | 通过 | 下一步定义测试、验收、实施与运维承接 |
