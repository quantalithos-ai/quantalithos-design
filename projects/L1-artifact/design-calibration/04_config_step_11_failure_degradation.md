# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节: `04-配置设计.md` §11 失效模式与降级 / fail-fast 策略

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义失效模式与降级 / fail-fast 策略 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 来源优先级;Step 7 配置项清单;Step 8 敏感配置;Step 9 加载、校验与生效机制;Step 10 配置变更、审计与回滚;详细设计 Step 12 / Step 14 / Step 15 / Step 16 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_11_failure_degradation.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 在配置缺失、配置错误、外部依赖不可用、配置漂移或运行期依赖退化时,系统应如何 `fail-fast`、`fail-closed`、`degraded`、`delayed` 或 `rejected`。

本 Step 只回答:

- 哪些配置失败必须阻止 startup facade 暴露。
- 哪些 job / entry / test 输入失败只能 reject 当前请求,不能 fallback。
- 哪些运行期外部依赖不可用允许表现为 degraded / delayed / failed marker。
- 哪些安全相关配置失败必须 fail-closed,不能宽松继续。
- 告警、审计、测试切口如何承接这些失效模式。

本 Step 不定义:

- 具体告警平台、SLO、pager、runbook、值班流程。
- 具体 config center、secret provider、KMS、Vault、cloud rotation 产品。
- 具体 retry/backoff 数值或运维修复脚本。
- live reload、online last-known-good switch、admin override;P0 均不支持。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供高优先级非法值不得 fallback 低优先级的规则 |
| `04_config_step_07_config_items.md` | 已完成 | 提供配置项、必填性、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 secret 禁入、敏感 ref 边界和禁止输出规则 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 startup / current entry / current job run / test harness 的加载校验和 activation 口径 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供 previous validated digest、restart / rerun rollback 和 change audit 最小字段集 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、adapter unavailable、query degraded、job failed、truth immutable 等恢复规则 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 runtime builder、adapter binding、禁止配置化边界和 disabled / fake 约束 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation、adapter unavailable、degraded marker 的日志 / 指标 / 审计边界 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 config validation、query degraded no-write、publisher failure、fixture isolation 的测试切口 |
| `projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md` | 已参考 | 提供 Step 11 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填配置缺失时如何处理? | startup 必填缺失时 builder `Failed`,不暴露 API / worker / jobs facade。current entry 参数缺失时当前 entry rejected。current job run 缺必填 target / batch / replay root 时当前 run rejected。test fixture 缺失时 test fail-fast。 |
| 类型错误、范围错误、交叉字段错误时如何处理? | 统一生成 redacted validation issue。startup 一律 fail-fast;entry-local 一律 reject current entry;job-run-start 一律 reject current run;test harness 一律 fail-fast。高优先级非法值不得 fallback 低优先级。 |
| 配置中心 / secret provider 不可用时如何处理? | P0 不依赖 config center 或 secret provider。若未来引入,config center 不可达不能在线降级到未验证配置;secret provider 不可用不能 fallback fake credential,required startup binding 必须 fail-fast。 |
| 什么情况下允许 degraded? | degraded 只适用于运行期 read / resolver / publisher / handoff 等外部依赖或派生面不可用,不适用于 startup config 非法。query degraded 必须 no-write;consumer/job 只能 delayed / failed marker,不能悄悄成功。 |
| 是否支持 silent fallback 或 live last-known-good? | 不支持。P0 只有 startup fail-fast、current entry reject、current job reject、test fail-fast 和 Step 10 的 restart / rerun rollback。 |
| 配置漂移或过期如何处理? | 使用 redacted config digest、profile ref、run-local digest、fixture digest 和 validation issue refs 检测。startup digest 与期望基线不一致时 fail-fast 或阻断 release gate。历史 stored result / stored report 不因漂移被改写。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项表 | 每项已有失败策略,但缺全局 failure catalog | 本 Step 汇总 startup / entry / job / test / runtime dependency 五类失效策略 |
| Step 8 敏感配置 | 已规定 raw secret reject,但未形成 fail-closed 总表 | 本 Step 固定 raw secret、redaction 放宽、boundary override 必须 fail-closed |
| Step 9 加载与生效 | 已定义 builder `Failed` 和 reject,但未区分 degraded 适用面 | 本 Step 明确 degraded 只用于运行期依赖和派生面 |
| Step 10 回滚 | 已定义 previous validated digest,但未明确 P0 无 live last-known-good | 本 Step 明确 restart / rerun 之外没有在线回退 |
| Step 14 adapter binding | 已说明 fake / controlled / replay-backed 绑定,但未收敛到 availability failure policy | 本 Step 区分 required startup binding 与 runtime dependency unavailable |
| Step 15 / Step 16 | 已给 observability / test cut,但未映射到具体 failure mode | 本 Step 补齐告警规则和测试切口表 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| fail-fast | 分散在 Step 7 / 9 | 汇总为统一失效模式表 | 实现和验收需要唯一 failure catalog |
| fail-closed | 只在敏感配置章节隐含 | 明确 raw secret、unsafe redaction、fake production-like、static boundary override 都 fail-closed | 防止安全边界被宽松默认值掩盖 |
| degraded | 详细设计已有若干 degraded surface | 明确 degraded 只用于运行期外部依赖 / read model,不适用于非法配置 | 避免把 config error 降级成“可运行” |
| live fallback | Step 10 只写 rollback | 明确 P0 无 live reload / last-known-good | 防止实现侧私造 reload path |
| alert/test | 只有分散的日志和测试切口 | 增加告警规则表和测试切口表 | 便于 Step 12 下游承接 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| startup 非法配置 | A. 使用默认值继续;B. fail-fast | 采用 B。P0 不允许 silent fallback |
| 高优先级非法覆盖 | A. 回退低优先级;B. 直接失败 | 采用 B。保持 Step 5 一致 |
| 安全边界不明确 | A. fail-open;B. fail-closed | 采用 B。raw secret / body / unsafe relax 都不能继续 |
| 外部依赖不可用 | A. 一律启动失败;B. required startup binding fail-fast,运行期依赖按 role degraded / delayed / failed | 采用 B。区分配置闭合和运行依赖健康 |
| handoff / relay 失败 | A. 回滚 accepted truth;B. truth 保持提交,只写 marker / report | 采用 B。与 Step 12 一致 |
| config center / secret provider | A. 视为 P0 能力;B. P0 不引入 | 采用 B。未来若引入必须回写 `03` |

## 8. 结构化中间产物

### 8.1 策略术语定义

| 策略 | 本项目含义 | 适用范围 | 不适用范围 |
|---|---|---|---|
| `fail-fast` | 在 startup / entry / job-start / test 早期直接失败,不进入后续 facade 或 mutation | startup config、job input、entry selector、fixture、required adapter binding | 已提交 truth 或 stored result 的事后改写 |
| `fail-closed` | 安全边界不明确时拒绝继续,不使用宽松默认值 | raw secret/body、unsafe redaction、static boundary override、future production-like fake | 普通低风险数值收窄 |
| `degraded` | 显式返回 stale / unavailable / unresolved surface,且 no-write | query view / reference unavailable、runtime resolver unavailable | startup config 非法 |
| `delayed` | 因临时依赖不可用而推迟处理 | inbound consumer unresolved、retryable resolver / handoff / publish path | 非法配置 |
| `failed marker` | 通过正式 marker / report 记录运行期失败 | relay publish、reference refresh、handoff prepare/deliver | startup parse/type/range failure |
| `restart rollback` | 恢复 previous validated config digest 后重启 | startup 配置变更失败或异常 | 不得跳过 validation |
| `last-known-good` | 在线继续运行旧配置 | P0 不支持 | 不得作为隐式 fallback |

### 8.2 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| strict JSON parse failed | runtime config 不可信 | startup fail-fast;builder `Failed`;不暴露 facade | 是 | strict JSON rejects JSONC |
| unknown field / section | 配置可能越界或拼写错误 | startup fail-fast | 是 | unknown field issue |
| required startup field missing | store / adapter / boundary / retention 不闭合 | startup fail-fast | 是 | missing required startup field |
| invalid type / enum / range | typed config 无法组装 | startup fail-fast / entry reject / job reject | 是 | invalid type / enum / range |
| high-priority source invalid | env / entry / job 覆盖值非法 | 直接失败,不得 fallback | 是 | invalid env does not fallback |
| cross-field conflict | profile / topic / target / retention 不一致 | startup fail-fast 或当前 run reject | 是 | cross-field conflict |
| raw secret in ordinary config | secret 泄露风险 | fail-closed;validation reject | 是 | raw secret rejected |
| raw body / historical body in replay root | body-free 边界破坏 | fail-closed;job reject | 是 | replay raw body rejected |
| redaction deny list empty / unsafe relax | 观测边界被放宽 | fail-closed;startup fail-fast | 是 | redaction deny list empty |
| high-cardinality labels enabled | 指标泄露或爆炸 | fail-closed;startup fail-fast | 是 | high-cardinality rejected |
| static boundary override key present | 试图改 truth / query / idempotency invariant | fail-closed;validation reject | 是 | forbidden boundary override |
| required logical store binding invalid | repository / UoW 无法装配 | startup fail-fast | 是 | store binding invalid |
| required resolver / publisher / clock / id binding invalid | core adapter 不可装配 | startup fail-fast | 是 | required adapter build failure |
| optional handoff target disabled by config | 外围交接不可用 | runtime Ready;对应 job rejected / disabled | 可选 | optional handoff disabled |
| inbound consumer namespace / schema invalid | worker 无法安全消费 | startup fail-fast | 是 | consumer schema / namespace invalid |
| job-run target / batch / replay root invalid | 当前 run 输入不合法 | current job run rejected | 是 | job input invalid |
| entry-local selector / profile / path invalid | 当前入口不合法 | current entry rejected | 可选 | entry selector invalid |
| fixture missing / invalid | 测试不可重现 | test fail-fast | 否 | fixture missing |
| config digest drift from expected baseline | runtime 与审计基线不一致 | startup fail-fast 或 release gate block | 是 | digest drift blocks startup |
| previous rollback target not validated | 回滚目标不安全 | rollback rejected | 是 | rollback target must be validated |
| runtime resolver unavailable during query | read side依赖不可用 | query degraded / unavailable;no write | 是/聚合 | query degraded no-write |
| runtime resolver unavailable during consumer | event 不能安全处理 | delayed receipt 或 failed marker;no truth write by guess | 是 | consumer resolver unavailable delayed |
| runtime resolver unavailable during command | command 缺正式依赖 | command rejected / dependency unavailable;no success trace/outbox | 是 | command resolver unavailable |
| relay publisher unavailable | outbound 未发送 | failed / retryable marker;truth unchanged | 是 | publisher failure no truth rollback |
| handoff target unavailable / delivery failed | archive / observability / sync 交接失败 | failed / retryable handoff record;truth unchanged | 是 | handoff failed marker |
| projection / reference store unavailable at query | read model 不可读 | query degraded / unavailable;no repair write | 是 | projection unavailable query |
| projection / reference maintenance config invalid | maintenance job 不可启动 | current job run rejected | 是 | maintenance config invalid |
| idempotency retention conflict | duplicate replay 窗口不可靠 | startup fail-fast | 是 | retention conflict |
| config center unavailable | P0 不适用 | 不接受该 source / activation | 不适用 | config center unsupported |
| future secret provider unavailable | future required credential 不可用 | required startup binding fail-fast;run-local target reject | 是 | future provider unavailable |

### 8.3 按配置域组织的失败策略表

| 配置域 | 典型失败 | 策略 | public / worker / job surface |
|---|---|---|---|
| `runtime` | profile invalid,strictValidation false,reload/hot requested | fail-fast / fail-closed | startup failed;no facade |
| `stores` | missing store,invalid ref,required durable adapter unavailable | fail-fast | startup failed |
| `sourceResolvers` | mode invalid,required adapter unavailable | config invalid -> fail-fast;runtime call unavailable -> degraded / delayed / reject | query degraded;consumer delayed;command rejected |
| `inboundConsumers` | sourceMode / namespace / schema invalid | fail-fast | worker not started |
| `relay` | publisher ref invalid,topic binding missing,batch invalid | config invalid -> fail-fast;runtime publish failure -> failed marker | outbox/job report only |
| `jobs` | unknown job kind,timeout/batch invalid,disabled target | fail-fast or current job reject | `ArtifactJobRunDisposition::Rejected` |
| `handoff` | target set missing,delivery target disabled,feature/topic mismatch | fail-fast or current job reject;runtime failed marker | handoff report / marker |
| `boundary` | body/page/timeout invalid | fail-fast or entry/job reject | handler/query/job reject |
| `idempotency` | retention too short,window conflict | fail-fast | startup failed |
| `projection` / `reference` | stale/batch invalid;runtime view unavailable | fail-fast or current job reject;query degraded | query degraded;maintenance job rejected |
| `redaction` | deny list empty,unsafe relax,label policy invalid | fail-closed | startup failed or output rejected |
| `clockId` | clock/id adapter missing | fail-fast | startup failed or mutation unavailable |
| `testFixtures` | fixture missing,raw replay body,profile mismatch | fail-fast / fail-closed / current run reject | test failure or replay reject |

### 8.4 生效方式到失效策略矩阵

| 生效方式 | 失败检测点 | 策略 | 审计 / 观测 | 恢复 |
|---|---|---|---|---|
| startup | merge、parse、type/range/cross-field/sensitive validate、builder assemble | fail-fast / fail-closed | config validation rejected log + issue ref + redacted digest | fix config or restore previous validated digest and restart |
| current entry | selector / profile / config path / local output root validate | reject current entry | entry validation log + issue ref | rerun with valid selector |
| current job run | request metadata、target、batch、replay root、run-local bounds validate | reject current run | job rejected surface + issue ref | rerun with valid request |
| test harness | fixture / fixed clock / deterministic id validate | test fail-fast | test failure + fixture digest | fix fixture and rerun |
| runtime dependency call | resolver / publisher / handoff / read store call | degraded / delayed / failed marker by role | dependency unavailable log/metric/report | retry,repair or new run |
| rejected critical change | secret/body/boundary override/fake production-like | fail-closed | security audit + issue ref | remove invalid change or formal design change |

### 8.5 告警规则表

| 场景 | 是否告警 | 推荐级别 | 告警安全字段 | 禁止字段 |
|---|---|---|---|---|
| startup config validation rejected | 是 | error | config source ref、section、profile、issue ref、config digest | raw config、secret、full sensitive ref |
| runtime builder failed | 是 | error | builder state、adapter slot、issue ref | credential / raw endpoint |
| raw secret / raw body detected | 是 | security/error | forbidden class、section、issue ref | detected material |
| unsafe redaction config | 是 | security/error | redaction rule class、issue ref | matched raw value |
| entry-local invalid | 可选 | warn | entry kind、selector class、issue ref | local sensitive path |
| job input invalid | 是 for scheduled / ops jobs | warn/error | job kind、run id、issue ref | raw job body / target credential |
| query degraded due projection/reference | 可聚合 | warn | query kind、freshness state、degraded reason ref | body / full ref |
| runtime resolver unavailable | 是/聚合 | warn/error | resolver family、adapter kind、retryable、diagnostic ref | upstream response body |
| relay publish failed | 是 | warn/error | relay ref、event kind、failure reason ref、report ref | payload body / transport credential |
| handoff failed | 是 | warn/error | target digest、handoff marker ref、job report ref | package body / sync private body |
| config digest drift | 是 | error | expected digest、actual digest、profile | full config |

### 8.6 测试切口表

| 测试切口 | 覆盖内容 | 预期 |
|---|---|---|
| `strict_json_rejects_jsonc` | parser | comment / trailing comma rejected |
| `missing_required_startup_field` | required startup config | builder failed;no facade |
| `invalid_env_does_not_fallback` | source priority | higher-priority invalid source fails |
| `raw_secret_rejected` | sensitive validator | no raw value in issue / log |
| `forbidden_boundary_override_rejected` | static boundary validator | fail-closed;no builder Ready |
| `redaction_empty_denied` | redaction validator | startup fail-fast |
| `job_input_invalid_rejected` | current job run | no job body entered |
| `entry_selector_invalid_rejected` | current entry | current entry rejected |
| `query_degraded_no_write` | projection/reference unavailable | degraded surface;no repository write |
| `consumer_resolver_unavailable_delayed` | inbound consumer | delayed receipt;no guessed truth write |
| `publisher_failure_no_truth_rollback` | relay publish failure | failed marker / report only |
| `handoff_failure_no_truth_rollback` | handoff delivery failure | handoff failed marker only |
| `optional_handoff_disabled_non_blocking` | optional target config | core runtime Ready;job rejected/disabled only |
| `rollback_target_must_be_validated` | Step 10 rollback gate | unvalidated digest rejected |
| `fixture_cannot_enter_non_test_profile` | fixture isolation | fail-closed |
| `config_digest_drift_blocks_startup` | baseline drift | startup fail-fast or release gate blocked |

### 8.7 配置失效模式停审记录

| 配置项 / 失效类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| required / type / range / cross-field invalid | startup / entry / job / test 行为 | 通过 | no silent fallback |
| sensitive / raw secret / raw body invalid | fail-closed、禁止输出、告警 | 通过 | no raw material in issue surface |
| runtime dependency unavailable | degraded / delayed / reject / failed marker 边界 | 通过 | degraded only for runtime dependency |
| relay / handoff failure | truth immutable、marker/report only | 通过 | no accepted truth rollback |
| digest drift / rollback target invalid | revalidation / validated target only | 通过 | startup gate remains strict |
| config center / secret provider future cases | P0 unsupported | 通过 | future introduction requires `03` writeback |

### 8.8 跨失效策略审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险失败是否 silent fallback | 不允许 | fail-fast / fail-closed |
| 高优先级非法 source 是否 fallback 低优先级 | 不允许 | validation reject |
| 配置错误是否被 degraded 掩盖 | 不允许 | degraded only for runtime dependency/read model |
| query degraded 是否触发修复写 | 不允许 | query no-write |
| relay / handoff failure 是否回滚 truth | 不允许 | marker / report only |
| optional handoff disabled 是否阻断核心 truth | 不阻断 | only related jobs rejected / disabled |
| last-known-good 是否被当作 online reload | 不允许 | restart rollback only |
| raw secret / body 是否进入 log / audit / metric | 不允许 | redacted issue refs only |
| 是否需要回写 `03` | 当前无 | future config center / secret provider / hot reload requires update |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| startup 非法配置统一 fail-fast,不暴露 facade | 否 | 承接 Step 14 builder state | 不适用 | 无回写 |
| degraded 仅适用于运行期依赖 / read model,不适用于非法配置 | 否 | 承接 Step 12 query / worker / job error mapping | 不适用 | 无回写 |
| relay / handoff failure 不回滚 accepted truth | 否 | 承接 Step 12 truth immutable 规则 | 不适用 | 无回写 |
| P0 不支持 config center、secret provider、live reload、online last-known-good | 否 | 配置治理口径 | 不适用 | 无回写 |
| 若未来引入 config center、secret provider、live reload 或 provider-backed failure contract | 是 | runtime builder / adapter constructor / error recovery / observability contract | `03` Step 12 / Step 14 / Step 15 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“策略术语定义”“失效模式表”“按配置域组织的失败策略表”“生效方式到失效策略矩阵”“告警规则表”“测试切口表”和“跨失效策略审计表”小节。

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

- 不得把非法配置错误写成 degraded success。
- 不得把 relay / handoff 失败写成 truth rollback。
- 不得把 config center、secret provider、live reload 写成当前 P0 已实现能力。
- 正式 `04-配置设计.md` 仍需等 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future production-like 是否需要 online last-known-good | 影响 runtime builder 和 rollback contract | P0 unsupported;留 Step 13 / Step 14 记录 |
| future secret provider unavailable 是否需要更细 retry taxonomy | 影响 adapter constructor / availability marker | 当前只保留 future watchpoint |
| degraded query 是否需要 environment-specific alert threshold | 影响运维和 `05/06/07` 承接 | 本 Step 只定义是否告警和安全字段 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 失效模式已覆盖 | 通过 | 见 §8.2 |
| fail-fast / fail-closed / degraded / delayed / failed marker 边界已区分 | 通过 | 见 §8.1 / §8.3 |
| startup / entry / job / test / runtime dependency 五类行为已定义 | 通过 | 见 §8.4 |
| 告警安全字段已定义 | 通过 | 见 §8.5 |
| 测试切口已定义 | 通过 | 见 §8.6 |
| 跨失效策略停审完成 | 通过 | 见 §8.7 / §8.8 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 12 | 通过 | 下一步定义测试、验收、实施与运维承接 |
