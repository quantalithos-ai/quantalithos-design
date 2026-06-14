# 04 配置设计 Step 11 · 定义失效模式与降级 / fail-fast 策略

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 11 定义失效模式与降级 / fail-fast 策略
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 11 定义失效模式与降级 / fail-fast 策略 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 5 sources / priority / conflicts;Step 7 config items;Step 8 sensitive secrets;Step 9 loading / validation / activation;Step 10 change / audit / rollback;新版正式 `03-详细设计.md` §12~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_11_failure_degradation.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 12 downstream handoff |

本 Step 定义 `L1-identity` 配置缺失、格式错误、类型错误、范围错误、交叉字段冲突、敏感信息违规、配置来源不可用、adapter disabled / unavailable、配置漂移、配置过期或红线失败时系统如何表现。

本 Step 只回答:

- 哪些配置失败必须 `fail-fast`,阻止 runtime builder 暴露 facade。
- 哪些安全相关失败必须 `fail-closed`,不得用宽松默认值继续。
- 哪些 job-run-start 或 entry-local 失败只拒绝当前 run / entry。
- 哪些运行期依赖不可用可以显式返回 degraded / delayed / failed marker。
- P0 是否允许 silent fallback、低优先级 fallback、online last-known-good 或 hot reload。
- 配置失败时是否告警、允许输出哪些 redacted evidence,以及下游测试切口是什么。
- 当前结论是否需要回写 `03-详细设计.md` 的 schema、port、state、error、DTO 或 flow。

本 Step 不定义:

- 具体告警平台、SLO、dashboard、pager、runbook、部署命令或运维产品。
- 具体 config center、secret provider、KMS、Vault、cloud secret manager API。
- retry/backoff 精确数值、HTTP status、RPC code、broker ack 绑定或 CI job 名。
- 新的 `IdentityRuntimeConfig` struct、config error enum、degraded DTO、evidence object、repository、port 或 adapter constructor。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 `defaults < file < env`、高优先级非法值不 fallback、P0 no config center/admin override |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供十二个配置域、配置项、必填性、来源、作用域、生效方式、敏感级别和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 sensitive / secret / forbidden body、ref-only、禁止输出和 profile sensitive handling |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 source merge、strict JSON parse、type/range/cross-field/sensitive validation、startup/job/entry/test activation |
| `04_config_step_10_change_audit_rollback.md` | 已审核通过 | 提供变更 actor、review level、审计字段、previous validated restart rollback 和 critical rejected 口径 |
| `03-详细设计.md` §12 | 已完成 | 提供 rejected、degraded、delayed、retryable、terminal、manual recovery 和 forbidden body 错误边界 |
| `03-详细设计.md` §13 | 已完成 | 提供 config ownership、runtime builder、adapter binding、disabled/degraded/unavailable 和 forbidden configuration boundary |
| `03-详细设计.md` §14~§15 | 已完成 | 提供 config/runtime/adapter observability、redaction 和最小测试切口 |
| 旧 `04_config_step_11_failure_degradation.md` | 历史诊断输入 | 只用于识别旧名和旧口径;本 Step 按新版 Step 5~10 重写 |
| `L1-governance` Step 11 calibration | 参考样式 | 只参考“术语 + 失效表 + activation 矩阵 + 告警 / 测试切口”粒度,不复用 governance 业务字段 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填配置缺失时系统如何处理? | startup 必填配置缺失时 runtime builder `Failed`,不暴露 API / worker / jobs facade。job-run-start 必填 run id、scope、target、batch、replay root 或 report root 缺失时 reject current run。entry-local 必填 selector、actor context、trace context、idempotency metadata 或 page cursor 缺失时 reject current entry。test fixture 必填缺失时 test fail-fast。 |
| 配置类型错误、范围错误、交叉字段错误时如何处理? | 统一由 Step 9 validator 产生 redacted validation issue。startup 错误 fail-fast;job-run-start 错误 reject current run;entry-local 错误 reject current entry;test harness 错误 test fail-fast。高优先级非法值不得 fallback 低优先级来源。 |
| secret / KMS / Vault 不可用时如何处理? | P0 不定义具体 secret provider/KMS/Vault,普通配置只保存 opaque refs。若 selected profile / adapter mode 要求 endpoint-backed secret ref 但 ref shape 或 resolver boundary 不可用,则 startup fail-fast 或当前 job rejected。不得 fallback fake、不得输出 secret、不得把 raw secret 存入 config/log/audit/report/evidence。 |
| config center 不可达时如何处理? | P0 没有 remote config center/admin override,因此 runtime 不依赖 config center。配置中出现 config center/admin override/hot reload source 视为 unsupported source,validation reject。未来若引入,必须回写 `03` 的 loader、audit、rollback 和 last-known-good contract。 |
| 配置漂移或过期如何发现和处理? | 通过 config source digest、profile ref、adapter mode summary、topic map digest、role source fingerprint、migration marker、replay root digest、fixture digest、redline guard 和 validation issue refs 检测。startup 漂移 fail-fast;job input drift reject current run;fixture drift creates new test baseline or fail-fast;已 accepted truth、stored result、outbox material、job report 不因配置回滚被改写。 |
| P0 是否允许 last-known-good 或 degraded? | P0 不支持 online last-known-good、runtime reload 或 hot update。只允许 Step 10 的 previous validated config restart rollback。`degraded` 只适用于运行期 read model / external dependency / adapter outcome 的显式 surface,不适用于非法配置。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项 | 单项已有失败策略,但缺统一失效模式表 | 本 Step 汇总为 fail-fast / fail-closed / reject-run / reject-entry / test fail-fast / degraded / delayed / failed marker |
| Step 8 敏感配置 | 已定义 raw secret/body forbidden,但 secret provider unavailable 仍需统一策略 | 本 Step 固定 P0 ref-only;future provider 不可用不得 fallback fake |
| Step 9 加载机制 | 已定义 validation chain,但缺告警和测试切口汇总 | 本 Step 增加 alert/test cut 表 |
| Step 10 回滚 | 已定义 previous validated restart rollback,但 last-known-good 和 silent fallback 边界需明确 | 本 Step 固定 P0 无 online LKG/reload/hot |
| `03` §12~§15 | 已定义错误恢复、配置绑定、观测和测试切口 | 本 Step 只做配置层映射,不新增错误/DTO/port |
| 旧 Step 11 | 含旧 command/job 名和旧外部口径 | 本 Step 全量替换为新版正式名称和 Step 5~10 结论 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 失效策略 | 分散在配置项表 | 汇总到 startup、job-run-start、entry-local、test harness、runtime adapter call | 下游测试、验收和实施需要统一判定 |
| 高优先级非法值 | Step 5 已定,Step 11 未汇总 | 明确不得 fallback 低优先级 | 避免错误 env / entry selector 被静默忽略 |
| 安全配置 | raw secret forbidden 分散在 Step 8 | 明确 fail-closed,不得 fail-open | 防止 redaction、redline、secret ref 被宽松默认值覆盖 |
| `degraded` | 容易被误用为配置错误容错 | 只允许运行期依赖/read model 显式 degraded | 避免非法配置伪装成可运行 |
| last-known-good | Step 10 只写 restart rollback | 明确 P0 无在线 LKG/live switch | 避免实现侧私造 reload path |
| 下游承接 | 告警/测试切口未集中 | 增加告警安全字段和测试切口 | 为 Step 12 downstream handoff 做输入 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 非法 startup config | A. 用默认值继续;B. fail-fast | 采用 B。高风险失败不得 silent fallback |
| 高优先级 env 非法 | A. fallback file/default;B. fail-fast | 采用 B。承接 Step 5 |
| 安全配置不确定 | A. fail-open;B. fail-closed | 采用 B。redline、redaction、raw secret/body、fixture isolation 均不可放宽 |
| 外部 adapter 不可用 | A. 一律启动失败;B. required startup adapter fail-fast,运行期依赖按 role degraded/delayed/failed | 采用 B。区分配置闭合和运行依赖健康 |
| last-known-good | A. 在线切换 LKG;B. P0 只允许 previous validated config restart rollback | 采用 B。P0 无 reload/hot contract |
| optional adapter 缺 target | A. 自动 disabled;B. explicit disabled required | 采用 B。避免 enabled 配置遗漏被 silent success 掩盖 |

## 7. 结构化中间产物

### 7.1 策略术语定义

| 策略 | 本项目含义 | 适用范围 | 不适用范围 |
|---|---|---|---|
| `fail-fast` | validation / build 阶段立即失败,不暴露 runtime facade | startup config、store/adapter binding、redline、required refs、migration marker、strict JSON parse | 已 accepted truth、已 stored result、已 outbox material 的事后改写 |
| `fail-closed` | 安全边界不明确时拒绝,不使用宽松默认值 | raw secret/body、redaction unsafe、redline false、fake fixture 越界、governance basis unavailable 的高风险动作 | 普通 batch 收窄或 optional disabled |
| `reject-run` | job-run-start validation 失败时拒绝当前 job run | run id、scope、batch、replay roots、handoff target、report root、retry family | startup runtime config 全局变更 |
| `reject-entry` | entry-local validation 失败时拒绝当前 API / worker / jobs entry | actor context、trace context、idempotency metadata、page cursor、selector | 全局 config fallback 或 accepted mutation |
| `test fail-fast` | fixture / deterministic setup 不合法时测试启动失败 | local-dev / ci-test fixture、fixed clock、deterministic id、seed refs | integration-like / operations-replay production-like evidence |
| `degraded` | read / runtime dependency surface 显式暴露 stale、not-ready、unavailable 或 partial | projection not-ready、reference unavailable、adapter availability degraded、query stale-visible | parse/type/range/cross-field 配置错误 |
| `delayed` | worker/event/job 因临时依赖不可用而推迟重试 | inbound event resolver unavailable、store unavailable、retryable external dependency | invalid config、unsupported version、raw body |
| `failed marker` | outbox/handoff/job/reference/projection 操作失败后写正式 failed item / report / issue | publish failure、handoff delivery failure、projection rebuild item failed、reference refresh item failed | command accepted truth rollback |
| `explicit-disabled` | optional capability 必须显式 disabled 才允许缺 target / endpoint / fixture | P1/P2 external refs、handoff target、work source、publisher where profile allows disabled | enabled 但缺 ref 的隐式成功 |
| `restart rollback` | operator 恢复上一份已验证 config ref/digest 后重新启动 runtime | startup 配置变更失败或异常 | runtime hot patch、跳过 validation |

### 7.2 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| runtime config file missing and required by profile | runtime 无法确定配置输入 | startup fail-fast or entry rejected | 是 | missing config path rejects before builder |
| strict JSON parse failed | runtime config 不可信 | fail-fast;builder `Failed`;不暴露 facade | 是 | JSONC/comment/trailing comma rejected |
| unknown top-level section | 可能拼写错误或越界配置 | fail-fast | 是 | unknown module validation issue |
| unknown nested field | 可能拼写错误或未来字段误入 P0 | fail-fast unless formally future-reserved | 是 | unknown field redacted path |
| required startup field missing | store/adapter/audit/redline 不闭合 | fail-fast | 是 | each required Step 7 startup item missing |
| required job-run-start field missing | job run 不可复核或不可重放 | reject current run | 是 | run id / replay roots / target missing |
| required entry-local metadata missing | request/envelope/job entry 无法审计或幂等 | reject current entry | 可选/安全日志 | actor/trace/idempotency missing |
| invalid enum | profile/mode/kind 不可执行 | fail-fast or reject current input | 是 | bad profile / adapter mode / job kind |
| invalid type | typed config snapshot 无法组装 | fail-fast or reject current input | 是 | string vs bool/integer/ref mismatch |
| invalid range | batch/retention/max attempts/page 不安全 | fail-fast or reject current run | 是 | batch/retention boundary |
| duplicate key in config file | 配置意图歧义 | fail-fast | 是 | duplicate key validation issue |
| high-priority source invalid | env 或 entry value 非法 | fail-fast/reject;不得 fallback lower priority | 是 | invalid env does not use file/default |
| conflicting source aliases | 同一语义多 key | fail-fast | 是 | alias conflict issue |
| entry-local tries global override | 当前入口越权改 store/adapter/redline | reject current entry | 是/安全 | selector cannot override startup invariant |
| job input tries global override | job 越权改 runtime binding | reject current run | 是/安全 | job input cannot override startup config |
| raw secret in ordinary config/env | secret 泄露风险 | fail-closed;validation reject | 是/安全 | credential material pattern rejected |
| raw external body in config/fixture/job input | ref-only/body-free 边界破坏 | fail-closed;reject config/run/fixture | 是/安全 | forbidden body scan |
| full sensitive ref requested in output | 可能泄露 endpoint/target/topology | fail-closed or redacted failure | 是/安全 | log/report/evidence redaction check |
| redaction profile invalid or unsafe relax | 输出面可能泄露 | fail-closed;startup fail-fast | 是/安全 | redaction unsafe rejected |
| any `redline.*` false | 架构红线被关闭 | fail-fast;critical rejected | 是/安全 | redline false rejected |
| static boundary override key present | 试图配置 truth/state/query/outbox/idempotency invariant | fail-closed;validation reject | 是/安全 | forbidden invariant key rejected |
| test fixture in non-test profile | fake 成功污染 integration/replay | fail-closed;startup fail-fast or run rejected | 是/安全 | fixture profile compatibility |
| `store.mode` missing or incompatible | repository / UoW 无法装配 | startup fail-fast | 是 | store binding missing |
| durable store selected but `store.dsn_ref` missing | durable adapter 无法构造 | startup fail-fast | 是 | durable requires opaque ref |
| migration marker mismatch | persisted schema 不可信 | startup fail-fast | 是 | migration baseline mismatch |
| idempotency disabled | duplicate replay 不可靠 | startup fail-fast | 是 | idempotency false rejected |
| actor context disabled | identity 越界承担 auth 或无审计入口 | startup fail-fast | 是 | actor context required false rejected |
| write entry lacks trace/idempotency metadata | accepted flow 不可审计或不可重放 | reject current entry before mutation | 可选/安全日志 | command/event/job metadata negative |
| role source mode invalid or required ref missing | role/capability summary 不可信 | startup fail-fast | 是 | role source binding negative |
| role source unavailable during command | role/capability 无法验证 | command rejected or dependency unavailable;no accepted side effects | 是 | resolver unavailable no mutation |
| role fingerprint drift | source snapshot 与配置 baseline 不一致 | dependent writes rejected;reconcile/read surface degraded by formal flow | 是 | role drift degraded/rejected |
| bus publisher enabled but endpoint/topic ref missing | outbound material 无法路由 | startup fail-fast | 是 | topic/endpoint completeness |
| topic map missing enabled event key | outbound event 不能安全发布 | fail-fast or publisher disabled only if explicit | 是 | topic map completeness |
| bus publish runtime failure | downstream 未收到事件 | mark outbox retryable/failed by formal outcome;truth unchanged | 是 | publish failure no truth rollback |
| outbox publish job input invalid | job 不可复核 | reject current run | 是 | publish batch/attempt invalid |
| projection store binding invalid | query/read model 无法装配 | startup fail-fast | 是 | projection store missing |
| projection query not ready | query 无可用摘要 | query returns not-ready/degraded;no write/rebuild | 可聚合 | query no-write degraded |
| projection rebuild input invalid | rebuild job 无法启动 | reject current run | 是 | rebuild scope/batch invalid |
| operations replay roots missing | replay 不可复核 | reject current run | 是 | replay root required |
| operations report root unavailable | job report/evidence 无法保存 | reject run before body or mark failed if already accepted by formal flow | 是 | report writer unavailable |
| propagation retry disabled | retry job 不允许执行 | reject current retry run | 否/信息 | disabled retry job rejected |
| optional external resolver enabled but endpoint ref missing | adapter 配置不闭合 | startup fail-fast | 是 | endpoint mode requires ref |
| optional external resolver explicit disabled | 外围能力不可用 | runtime assembled with disabled marker;dependent operation rejected/degraded by flow | 否/信息 | disabled adapter no fake success |
| external resolver unavailable during query | read surface 不完整 | query degraded/unavailable;no write | 可聚合 | query degraded no repository write |
| external resolver unavailable during consumer/callback | event 无法解析 | delayed/quarantined/failed receipt by formal flow | 是 | consumer delayed no accepted marker |
| governance basis unavailable for high-risk action | 高风险动作依据不可信 | fail-closed;command rejected/pending by formal flow | 是 | basis unavailable fail-closed |
| trace handoff target missing/disabled | handoff 不可执行 | reject run/request or failed marker after accepted start by formal flow | 是 | handoff target disabled |
| audit sink endpoint ref missing | audit adapter 无法装配 | startup fail-fast | 是 | audit sink ref missing |
| audit sink runtime unavailable | external audit 不可写 | use formal compensation/local marker;do not disable core audit | 是 | audit compensation test |
| audit compensation disabled | 审计红线被绕过 | startup fail-fast | 是/安全 | compensation false rejected |
| config digest drift from expected release/run | runtime 与审计 baseline 不一致 | startup fail-fast or run not comparable/rejected | 是 | digest mismatch blocks startup/run |
| previous rollback target not validated | rollback 可能引入坏配置 | rollback rejected;must supply validated digest | 是 | rollback target validation |
| config center/admin override present | P0 unsupported | validation reject | 是 | unsupported source rejected |
| hot/reload activation present | P0 unsupported 且无 rollback contract | validation reject | 是 | hot/reload config rejected |
| future secret provider unavailable | future credential 不可解析 | required startup fail-fast;job target rejected;no fake fallback | 是 | provider unavailable cannot fallback fake |
| fixture seed missing in deterministic suite | 测试不可复现 | test fail-fast | 否/测试失败 | fixture required |
| fake/controlled fixture exposes private map | 测试泄露或越过 formal port | fail-closed/test fail-fast | 是/测试失败 | private fake material scan |
| runtime builder partial assembly | facade 可能半可用 | builder `Failed`;不暴露 services | 是 | partial builder no facade |

### 7.3 按配置域组织的失败策略表

| 配置域 | 典型失败 | 策略 | Public / worker / job surface |
|---|---|---|---|
| profile | invalid profile、test override 越界、future production-like 被当作 P0 | fail-fast / fail-closed | startup failed;entry selector rejected |
| store | missing store、invalid `dsn_ref`、migration mismatch、idempotency disabled | fail-fast | no facade |
| actor_context | actor required false、trace/idempotency metadata missing | fail-fast / reject-entry | entry rejected before application mutation |
| role_catalog | source mode invalid、snapshot/fixture missing、fingerprint drift、source unavailable | startup fail-fast;runtime rejected/degraded/delayed by flow | command rejected/query degraded/worker delayed |
| bus | publisher mode invalid、topic map missing、endpoint ref missing、runtime publish failed | fail-fast for config;failed marker for runtime publish | outbox failed/retryable report;truth unchanged |
| outbox | invalid batch/max attempts/backoff/failure mode | fail-fast or reject-run | job rejected/partial report |
| projection | store/checkpoint missing、not-ready、rebuild input invalid | fail-fast;query degraded;job rejected | query not-ready/degraded;job report |
| operations | missing run id、missing replay/report roots、retry disabled | reject-run | job rejected or failed report by formal flow |
| external_refs | endpoint enabled without ref、explicit disabled、runtime unavailable | fail-fast;explicit-disabled;fail-closed/degraded/delayed by role | command rejected/query degraded/worker delayed/job failed |
| audit | sink ref missing、runtime sink unavailable、compensation disabled、redaction unsafe | fail-fast or compensation marker | startup failed;safe audit marker |
| redline | any guard false、static boundary override | fail-closed/fail-fast | validation rejected |
| fixture | seed missing、fixed/deterministic outside test profile、private map output | test fail-fast / fail-closed | test failure;non-test startup reject |

### 7.4 生效方式到失效策略矩阵

| 生效方式 | 失败检测点 | 策略 | 审计 / 观测 | 恢复 |
|---|---|---|---|---|
| startup | source merge、strict JSON parse、known-field、type/range/ref-shape、cross-field、sensitive、activation validation、runtime builder assembly | fail-fast/fail-closed | config validation rejected log + redacted issue ref + config digest | fix config or restore previous validated digest and restart |
| job-run-start | job metadata/input validation、run id、target/scope/batch/replay roots/report root、enabled job kind | reject current run | job rejected surface + run input digest + issue ref | start new run with valid input |
| entry-local | profile/config selector、actor context、trace/idempotency metadata、page cursor、dry-run diagnostic selector | reject current entry | entry validation log + issue ref | rerun entry with valid selector/metadata |
| test harness | fixture ref、fixed clock/id、seed、fake adapter fixture,profile compatibility | test fail-fast | test failure + redacted fixture issue | fix fixture and rerun |
| runtime adapter call | resolver/publisher/handoff/audit/report writer/store call outcome | degraded/delayed/failed marker by formal role | adapter unavailable log/metric/report issue | retry/backoff/new job/manual repair by downstream docs |
| rejected critical config | raw secret/body、redline relax、static boundary override、fake non-test、hot/reload/config center | fail-closed | security/config validation audit | formal design change or remove invalid config |

### 7.5 告警规则表

| 场景 | 是否告警 | 推荐级别 | 告警安全字段 | 禁止字段 |
|---|---|---|---|---|
| startup config validation rejected | 是 | error | config source ref、section、validation issue ref、profile、config digest | raw config、secret、full sensitive ref |
| runtime builder failed | 是 | error | assembly state、adapter slot、issue ref、profile | adapter credential、endpoint body |
| high-priority invalid source | 是 | error | source kind、section、issue ref | env value、raw file body |
| raw secret/body detected | 是 | security/error | forbidden class、section、issue ref | detected secret/body |
| redline or redaction unsafe | 是 | security/error | guard/profile path、issue ref | attempted raw value |
| job input invalid | 是 for scheduled/ops;optional for local manual | warn | job kind、run id、issue ref、input digest | raw job body、raw target |
| entry-local invalid | 可选 | warn/debug by environment | entry kind、selector class、issue ref | local path if sensitive |
| test fixture invalid | 否 as ops alert;test failure | test failure | fixture ref digest、profile | fixture body/private map |
| query degraded due projection/reference | 可聚合 | warn | query kind、state kind、issue ref | body/full ref |
| resolver unavailable | 是/聚合 | warn/error by dependency | resolver family、adapter mode、retryable、issue ref | upstream response body |
| publisher failed | 是 | warn/error | outbox ref、event kind、failure class、report ref | payload body、transport credential |
| handoff/report writer failed | 是 | warn/error | target/report root digest、marker ref、job report ref | package/report body、target credential |
| config digest drift | 是 | error | expected digest、actual digest、profile | full config |

### 7.6 测试切口表

| 测试切口 | 覆盖内容 | 预期 |
|---|---|---|
| strict JSON rejects JSONC | runtime parser | comment/trailing comma rejected with issue ref |
| missing required startup field | store/resolver/bus/audit/redline | builder failed,no facade |
| invalid env does not fallback | source priority | higher-priority invalid env fail-fast |
| raw secret rejected | sensitive validator | no raw value in issue/log |
| forbidden body rejected | body-free validator | no external body in config/report/evidence |
| static boundary override rejected | forbidden config key validator | validation reject,no runtime assembly |
| reload/hot/config center rejected | activation validator | P0 unsupported issue |
| redline false rejected | redline validator | fail-closed/fail-fast |
| topic binding missing for enabled event | bus cross-field | startup fail-fast |
| endpoint mode missing endpoint ref | adapter cross-field | startup fail-fast |
| explicit disabled adapter no fake success | adapter availability | dependent flow rejected/degraded,not accepted |
| job input cannot override startup | job-run-start validator | current run rejected |
| entry selector cannot override global | entry-local validator | current entry rejected |
| query degraded no-write | projection/reference unavailable | degraded surface,no repository write |
| consumer resolver unavailable delayed | inbound consumer | delayed/quarantined receipt,no accepted marker |
| publisher failure no truth rollback | outbox job | publication failed/retryable marker;truth unchanged |
| audit sink unavailable compensation | audit runtime | compensation/local marker;core audit not disabled |
| rollback target must be validated | Step 10 recovery | unvalidated previous config rejected |
| fixture cannot enter non-test profile | profile/fixture validation | fail-closed |
| config digest drift blocks startup/run | artifact/run validation | fail-fast or run rejected with redacted digests |

### 7.7 配置失效模式停审记录

| 配置项 / 失效类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| required missing | startup/job/entry/test 行为 | 通过 | no silent default |
| parse/type/range/cross-field invalid | fail-fast/reject/test fail-fast | 通过 | high-priority invalid no fallback |
| sensitive/raw secret/body invalid | fail-closed、禁止输出、告警 | 通过 | raw material never logged |
| config center/admin override/hot reload | P0 是否引入 | 通过 | P0 unsupported;future design required |
| secret provider unavailable | P0/future 口径 | 通过 | P0 ref-only;future no fake fallback |
| adapter unavailable | config failure vs runtime dependency failure | 通过 | required startup fail-fast;runtime degraded/delayed/failed |
| drift/expired config | digest/revalidation/rollback | 通过 | rollback target must be validated |
| last-known-good | 是否在线使用 | 通过 | P0 no online LKG/reload |
| query/job/consumer degraded | no-write/no-truth-rollback | 通过 | degradation only via formal surface |
| alert/test cuts | 下游承接 | 通过 | Step 12 will map to 05/06/07/09 |

### 7.8 跨失效策略审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险失败是否 silent fallback | 不允许 | fail-fast/fail-closed |
| 高优先级非法 source 是否 fallback 低优先级 | 不允许 | validation issue and fail-fast |
| 安全配置是否 fail-open | 不允许 | fail-closed |
| 配置错误是否被 degraded 掩盖 | 不允许 | degraded only runtime dependency/read model |
| runtime builder 是否可能半暴露 | 不允许 | builder Failed no facade |
| query degraded 是否写修复副作用 | 不允许 | query no-write |
| publisher/handoff failure 是否回滚 accepted truth | 不允许 | marker/report only |
| optional disabled 是否伪造成功 | 不允许 | explicit disabled returns formal disabled/unavailable surface |
| online last-known-good 是否被当作 reload | 不允许 | restart rollback only |
| raw secret/body 是否进入 alert/log/audit/report | 不允许 | redacted issue refs only |
| 是否需要回写 `03` | 当前无 | future config center/secret provider/hot reload/formal config error enum requires `03` update |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| startup 配置错误统一 fail-fast,不暴露 facade | 否 | 承接 `03` §13 runtime builder state | 不适用 | 无回写 |
| 高优先级非法值不得 fallback 低优先级来源 | 否 | 承接 Step 5 来源优先级 | 不适用 | 无回写 |
| raw secret/body/redaction unsafe/static boundary override fail-closed | 否 | 承接 Step 8 / `03` §14 forbidden output | 不适用 | 无回写 |
| degraded 只用于运行期 external dependency / projection / reference surface | 否 | 承接 `03` §12 error recovery | 不适用 | 无回写 |
| P0 不支持 online last-known-good、runtime reload、hot update、config center fallback | 否 | 承接 Step 9 / Step 10 activation and rollback | 不适用 | 无回写 |
| optional adapter 缺 target 不自动 disabled,必须 explicit disabled | 否 | 承接 Step 6 / Step 7 profile and config item semantics | 不适用 | 无回写 |
| 若后续要求 remote config center、online LKG、hot reload、secret provider health contract、formal config error enum、formal degraded response schema、config drift object 或 config evidence object | 是 | runtime builder / config loader / adapter availability / error recovery / observability contract | `03` §12~§15 或对应详细设计校准 Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §11 可回填:

```md
## 11. 失效模式与降级 / fail-fast 策略

> 校准来源:
> - `design-calibration/04_config_step_11_failure_degradation.md`

`L1-identity` 的配置失效策略按影响面处理。startup 必填缺失、strict JSON parse 失败、类型错误、范围错误、cross-field 错误、schema / migration mismatch、redline false、raw secret 或 raw external body 进入普通配置时 fail-fast 或 fail-closed,并且 runtime builder 不暴露 API / worker / jobs facade。job-run-start 配置错误 reject current run;entry-local metadata 或 selector 错误 reject current entry;test fixture 错误 test fail-fast。

高优先级来源一旦存在但非法,不得 fallback 低优先级来源。P0 不启用 config center、admin override、runtime reload、hot update 或 online last-known-good;回滚只能恢复 previous validated config ref/digest 后 restart。`degraded` 只适用于运行期 external dependency、projection/reference/read model 或 adapter outcome 的正式 surface,不适用于非法配置。

所有错误、告警、审计、report 和 evidence 只能输出 config section、source kind、profile、adapter mode、safe failure class、redacted digest、validation issue ref 或 safe diagnostic ref。不得输出 raw config、raw secret、full sensitive ref、endpoint credential、external body、adapter raw response 或 fake private material。
```

回填要求:

- 必须保留 SOP 规定的失效模式表。
- 必须明确高风险失败不得 silent fallback。
- 必须明确高优先级非法来源不得 fallback 低优先级来源。
- 必须区分非法配置 fail-fast / fail-closed 与运行期依赖 degraded / delayed / failed marker。
- 必须说明 P0 无 remote config center、admin override、hot reload 和 online last-known-good。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q48 | future production-like 是否需要 online last-known-good config | 影响 runtime reload、config store、rollback contract | P0 不支持;Step 13/14 记录演进 |
| ID-CONFIG-Q49 | future 是否需要 remote config center/admin override | 影响 source priority、availability、audit、rollback | P0 不引入;出现即 validation reject |
| ID-CONFIG-Q50 | future secret provider/KMS 是否进入 runtime builder | 影响 adapter constructor、health check 和 error mapping | P0 只保存 refs;provider body 不进入 config |
| ID-CONFIG-Q51 | 告警阈值、聚合窗口、SLO | 影响运维手册和部署 | 本 Step 只定义是否告警和安全字段 |
| ID-CONFIG-Q52 | config validation issue enum / degraded response schema 是否需要正式代码对象 | 影响 `03` error/protocol contract | 当前不新增;若实施需要 1:1 类型,先回写 `03` |
| ID-CONFIG-Q53 | redacted digest canonicalization 算法是否固定 | 影响 audit/evidence 稳定性 | 当前只要求 redacted canonical digest;算法留 Step 12/14 或 implementation standard |

## 11. 进入下一步条件

- P0 配置失效模式有处理方式。
- `fail-fast`、`fail-closed`、`reject-run`、`reject-entry`、`test fail-fast`、`degraded`、`delayed`、`failed marker` 和 `explicit-disabled` 已区分。
- 高风险失败不得 silent fallback 已明确。
- secret / config center / drift / expired config 已处理。
- 告警安全字段已定义。
- 测试切口已定义。
- 配置失效模式停审完成。
- 跨失效策略审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义 Rust struct、config error enum、secret provider API、remote config center、hot reload、degraded DTO、测试编号、evidence 路径或 implementation boundary。

下一步进入 Step 12:定义测试、验收、实施与运维承接。
