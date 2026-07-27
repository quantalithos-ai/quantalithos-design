# L3-capability-hub 04 配置设计 Step 11：失效模式与降级 / fail-fast 策略

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §11
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_11_completed_continuous_execution`

---

## 1. Step 状态与分批计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 `定义失效模式与降级 / fail-fast 策略` |
| 输入基线 | 04 Steps 5、7、8、9、10；formal 03 §§10~15；DDD Steps 12、14、15、16 |
| 已完成批次 | `11.1`：SOP 五问、策略术语、错误分层和全局失效模式；`11.2`：配置域/运行入口矩阵、告警/test cut、停审、03 impact 与 handoff completed |
| 当前批次 | none；Step 12 may start after flow/ledger synchronization |
| formal 04 | not created；only Step 15 may assemble |
| 03 影响 | 当前 `无回写`；不得新增 error、Port、DTO、state 或 recovery flow |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 把已闭合的 source precedence、27 行 typed configuration、secret injection、V0~V8 validation、Stage 0~7 assembly、entry barrier、change/rollback 规则，收敛为一个可判定的失败策略。实现者必须能仅凭本产物判断：失败发生在哪一层、是否允许进程暴露、是否保持已激活 root、调用方收到既有哪类结果、是否允许重试，以及观测中哪些字段安全。

本 Step 必须闭合：

1. 缺配置、类型/范围/cross-field 错误、ref 不可达、provider 不可用、secret/TLS 失效、constructor 失败、artifact 漂移/过期和 config center 不可达。
2. `fail-fast`、`fail-closed`、`degraded`、`delayed`、`failed marker`、`not applicable` 的唯一语义。
3. startup、已激活 Port、Query、Worker、Jobs、Outbound 和 observer 七个行为层。
4. 18/18 顶层模块与 27/27 canonical row 的失败责任，不把配置错误伪装成业务结果。
5. 告警意图、安全字段和未来测试切口，但不伪造监控阈值、告警实例、测试执行或 evidence。
6. 与 Step 7/8/9/10、formal 03 error/recovery taxonomy 的双向追溯。

本 Step 不定义新的 Rust error enum、API response、receipt、Job report、observer profile、retry policy、dashboard、pager 等级、SLO、runbook、部署命令或 config center 产品。运行期 external Port 的 typed failure、Query 的正常 degraded surface、Worker receipt、Job journal/report 和 Outbound collaboration outcome 仍完全由 formal 03 管理。

## 3. 本步输入

| 输入 | 已确认事实 | 本 Step 使用边界 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | `constants < strict JSON < bounded env`；非法高优先级 env 不回退 JSON | 判定 source missing/invalid/unreadable，不添加第四来源 |
| `04_config_step_07_config_items.md` | 18 modules、27/27 rows、closed refs/variants、strict bounds | 逐域覆盖 required/type/range/relation failure |
| `04_config_step_08_sensitive_secrets.md` | 四级 sensitivity；raw secret forbidden；provider 到 exact constructor 注入 | 定义 unavailable/expired/revoked/forbidden 的 fail-closed 行为 |
| `04_config_step_09_loading_validation_activation.md` | V0~V8、Stage 0~7、immutable root、API/Worker/Jobs barrier | 定位失败阶段和 prefix disposal，不发明 partial activation |
| `04_config_step_10_change_audit_rollback.md` | immutable artifact、review、safe audit、eligible restart rollback | drift/expiry/rejection 只作用于新 activation/release gate |
| formal `03-详细设计.md` | exact error、recovery、Port、Query、Worker、Jobs、observer 契约 | 复用既有 surface，不从配置层新增协议 |
| `03_ddd_step_12_error_recovery.md` | 17 error kinds、Port failure/retry proof、consistency/transaction rules | 固定错误分层和禁止转换 |
| `03_ddd_step_15_observability_audit.md` | fixed observation profiles、redaction、observer non-cancelling | 只声明未来切口和安全字段，不声明 signal 已存在 |
| `03_ddd_step_16_test_cuts.md` | executable cut ownership和 minimum verification style | 形成下游 test contract，不声称执行 |

## 4. SOP 五问回答

| SOP 问题 | L3-capability-hub 裁决 |
|---|---|
| 必填配置缺失时系统如何处理？ | raw source、selected section、required leaf、selected ref 或 required configured material 缺失，均在 V0~V8 或对应 Stage fail-fast。进程不得暴露 API listener、Worker source、Jobs facade 或 partial graph；完整 owned prefix 被丢弃，错误归 `InfraError::RuntimeAssembly`。只有配置明确选择既有 `Disabled` branch 时，才构造 `NotConfigured` external Port；`Missing` 不是 disabled default。 |
| 类型、范围、cross-field 错误如何处理？ | strict parser/type/range/relation gate 拒绝完整 candidate。未知/重复 key、null、coercion、越界、orphan/wrong-family ref、profile/entry/branch mismatch 均不得 clamp、trim、alias 或回退低优先级来源；不生成业务 response/receipt/report。 |
| secret / KMS / Vault 不可用时如何处理？ | P0 只定义 product-neutral deployment-injected provider。required provider、credential/certificate/private-key material 不可读、过期、撤销或无法安全解析时，在 exact constructor 前 fail-closed，并归 runtime assembly failure；不得 fallback fake、无 TLS、旧 secret 或另一 provider。已激活进程的连接级 failure 由既有 external Port failure 处理，不能在线改写 frozen root。 |
| config center 不可达时如何处理？ | P0 不支持 remote config center/admin override，所以 `not applicable`，启动和运行均不得依赖它，也不得声称有 last-known-good cache。未来引入会改变 source、builder、availability、audit 和 rollback 契约，必须受控回开 01/03/04。 |
| 漂移或过期如何发现和处理？ | immutable artifact identity/safe digest、schema/profile/entry、ref/provider material eligibility 只在新进程 validation/activation 或 release gate 比较。发现 mismatch/expiry/revocation 时拒绝 candidate 或 rollback target；当前已激活 root 保持 frozen，不在进程内 reload/repair。运行期 provider/remote dependency 失效走既有 Port semantics，不称作在线 config drift。 |

## 5. 当前问题诊断

| 位置 | Step 11 前的缺口/歧义 | 本 Step 修正 |
|---|---|---|
| Step 7 item failure 列 | 多为 `fail-fast`，但尚未区分 parser、Stage、active Port 与正常 typed unavailable | 建立 phase/error/surface 三维映射 |
| `Missing` / `Disabled` | 都可能被误写为“未配置” | `Missing` 永远 startup failure；只有显式合法 `Disabled` 才形成 `NotConfigured` Port |
| configured constructor failure | 容易被实现者转换为 fake/inMemory/disabled | 明确 complete candidate rejection 和 no branch conversion |
| secret/TLS expiry | 容易与 ordinary adapter timeout 混合 | activation eligibility fail-closed；active-call failure仍由 Port taxonomy 管理 |
| config drift | 容易推导 hot reload、watcher 或 background repair | 只允许 next activation/release gate 检查；current root frozen |
| degraded | 容易成为所有异常的兜底字符串 | 仅既有 typed read/reference/handoff/collaboration surface可用，不覆盖配置错误 |
| retry | 配置中存在 attempt/delay 值，容易被误认为所有失败可重试 | retry eligibility仍需 formal 03 effect proof；配置值不提供 proof |
| observer failure | 容易取消业务结果或递归告警 | 保持 non-cancelling observer和safe sink failure规则 |

## 6. 改动前后对比

| 维度 | Step 11 前 | Step 11 后目标态 |
|---|---|---|
| startup failure | 分散于 item/validation/stage表 | one fail-fast taxonomy，no exposed partial graph |
| security failure | ref-only和rotation边界已定 | exact fail-closed trigger、no unsafe rollback/fallback |
| runtime dependency | 03有Port taxonomy，04未明确隔离 | active-call failure严格复用03，不伪装config exception |
| degraded/delayed/marker | 各flow已有typed surface | 精确声明何时适用和何时禁止 |
| drift/expiry | change target eligibility已定 | next activation only，no online mutation |
| alert/test | observation profile与cuts已存在 | 形成安全意图/未来切口，不伪造运行事实 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决与原因 |
|---|---|---|
| invalid env | fallback JSON；reject | reject。高优先级值已被明确选择，fallback会隐藏发布错误 |
| missing external slot | infer Disabled；reject | reject。Disabled必须是显式 branch，不能由缺失推导 |
| configured provider unavailable | fake/disabled/LKG；reject candidate | reject candidate。branch conversion改变operator intent和profile guarantee |
| active dependency unavailable | reload config；typed Port failure | typed Port failure。root immutable，effect/retry由Port负责 |
| expired credential rollback | previous artifact；fix-forward | 只允许安全 fix-forward；过期/撤销/compromised material无资格成为rollback target |
| drift handling | background repair；next activation gate | next activation gate。P0无hot reload/config watcher |
| config center outage | use cached online LKG；not applicable | not applicable。P0根本没有该依赖 |
| observer sink outage | cancel business；non-cancelling | non-cancelling，沿用既有 observer contract |

## 8. 策略术语与判定顺序

### 8.1 精确定义

| 术语 | 精确定义 | 适用层 | 明确不表示 |
|---|---|---|---|
| `fail-fast` | 在 source parse、V0~V8、Stage 0~7 或 entry barrier 的首个确定失败处停止 candidate；丢弃完整 owned prefix；不暴露任何 facade/listener/task/source/partial graph | startup/new activation | process crash loop policy、business rejection、automatic retry |
| `fail-closed` | 安全/身份/credential/TLS/trust/redaction 条件无法证明满足时，拒绝 material/constructor/candidate，绝不选择更宽松 branch | provider/constructor/security gate | “返回 forbidden 业务结果”、无 TLS、旧 secret fallback |
| `degraded` | formal 03 已定义的正常 typed read/reference/consumer-facing surface，明确表达部分信息不可用且保持其 no-write/no-fabrication约束 | activated Query/read/reference/handoff surface | 配置非法、consistency defect、generic error swallowing |
| `delayed` | formal 03 已允许的 inbound/consumer/Job pending或retryable prerequisite surface，且 effect/reentry proof 成立 | activated Worker/Jobs protocol | sleep loop、无界重试、把永久失败延期 |
| `failed marker` | formal 03 已定义且由 owning transaction/journal/report/collaboration protocol持久化或返回的 terminal typed outcome | activated Job/Outbound/handoff flow | 配置层新增 marker、伪造 receipt/report/evidence |
| `not applicable` | 该能力不在 P0 control plane，因而不存在依赖、fallback或告警要求 | remote config center/admin/hot reload/online LKG | “已配置但暂时不用”、隐式 disabled |

### 8.2 判定顺序

```text
[raw source / candidate artifact]
  -> parse or V0..V8 invalid?
       yes -> fail-fast / InfraError::RuntimeAssembly / no graph
  -> required security/provider/material cannot be proven safe?
       yes -> fail-closed + fail-fast candidate / no constructor exposure
  -> Stage 0..7 or entry barrier fails?
       yes -> InfraError::RuntimeAssembly / dispose whole owned prefix
  -> selected entry activated with frozen root
  -> external call fails?
       yes -> existing ApplicationPortFailureKind + effect-proof retry rules
  -> typed normal incomplete/unavailable result?
       yes -> existing degraded/delayed/failed-marker surface only
  -> persisted relation or commit/rollback invariant fails?
       yes -> existing ConsistencyDefect / CommitOutcomeUnknown /
              TransactionRollbackFailed; never downgrade
```

关键说明：

1. 只有前三层属于本 Step 的配置失效策略；激活后的分支是为防止错误转换而记录的正式 03 边界。
2. `fail-closed` 是安全裁决，通常通过 candidate `fail-fast` 被执行；两者不是互斥状态 enum。
3. `degraded`、`delayed`、`failed marker` 必须由既有 typed protocol产生，配置 loader/builder没有创建这些结果的权限。
4. 任一持久化 consistency/transaction defect 都优先保留其 exact error，不能降级为 missing、unavailable或配置错误。

## 9. 错误分层与禁止转换

| 失败位置 | 唯一既有分类/表面 | 允许动作 | 禁止转换 |
|---|---|---|---|
| raw source、parser、V0~V8 | `InfraError::RuntimeAssembly` | stop candidate；safe issue observation | API response、receipt、Job report、业务 error/marker |
| Stage 0~7、provider、constructor、entry assembly | `InfraError::RuntimeAssembly` | dispose complete owned prefix；candidate rejected | partial graph、fake/disabled/inMemory fallback |
| activated external Port call | existing `ApplicationPortFailureKind` | exact mapping；bounded retry only after effect proof | generic config error、silent degradation |
| `TemporarilyUnavailable` / `Timeout` | exact Port failure | bounded retry only where formal flow proves safe effect/reentry | assumed retryability from configured attempts |
| `PermanentlyRejected` / `InvalidTypedResponse` / `UnexpectedSourceFailure` | exact Port failure | fail current flow per formal 03；operator/adapter repair | automatic retry、failed marker fabrication |
| normal typed unavailable/partial/reference/handoff/collaboration | existing typed surface | preserve exact state/reason/result ownership | convert to runtime assembly/config exception |
| loaded owner/version/union/index/sidecar defect | `ConsistencyDefect` | stop affected flow；owner/operator repair | missing/degraded、auto repair、current-truth fallback |
| commit durability cannot be proven | `CommitOutcomeUnknown` | exact durable reads then decide | blind mutation retry、claimed failure/success |
| rollback itself fails | `TransactionRollbackFailed` | preserve private source chain；operator inspection | claim rollback success、continue candidate |
| observer/redaction/sink failure | existing non-cancelling observer rules | suppress unsafe fields；safe diagnostic path where available | alter business result、recursive body logging |

No new error enum/code/API field is authorized by this table. If implementation cannot express a listed startup failure through existing `InfraError::RuntimeAssembly` or cannot preserve an activated-flow error through the existing formal 03 surface, it must stop and reopen detailed design.

## 10. 全局失效模式表

| ID | 失效模式 | 发现点/影响 | 系统行为 | 告警意图 | 测试切口合同 |
|---|---|---|---|---|---|
| `FM-01` | config file missing/unreadable/oversize/non-UTF-8/BOM | source/V0；whole candidate | fail-fast；no lower implicit source；`RuntimeAssembly` | startup error intent；source kind/path class only | missing、permission/read failure fixture、`1,048,577` bytes、invalid UTF-8/BOM all reject before parse |
| `FM-02` | malformed JSON、comment、trailing comma、duplicate/unknown key | parser/V0~V1；whole candidate | fail-fast；no JSONC/coercion/ignore | parser rejection intent；safe issue ref only | each syntax/shape defect rejects；raw token absent from diagnostic capture |
| `FM-03` | required module/item/ref missing | V1~V6；selected graph incomplete | fail-fast；never infer default/Disabled | validation rejection intent | remove each required class；assert no constructor/entry exposure |
| `FM-04` | wrong type、enum、unit、range、name grammar | V1~V4 | fail-fast；no trim/case-fold/clamp/alias | validation class and safe path | boundary below/above、float/string/null/case variants reject |
| `FM-05` | cross-field/profile/entry/variant conflict | V4~V6 | fail-fast；reject complete artifact | profile/entry/relation class | Deployment fake、entry mismatch、irrelevant payload、wrong branch reject |
| `FM-06` | orphan/cycle/wrong-family/duplicate target ref | V5~V6 | fail-fast；do not choose another section | ref family + safe issue ref | orphan/cycle/case-collision/wrong-family all reject deterministically |
| `FM-07` | invalid bounded env override | source merge then V1~V6 | fail-fast；do not fallback JSON | source kind=`env` + safe path; never value | valid JSON + invalid env must reject exact same as invalid file value |
| `FM-08` | required provider unavailable/denied/invalid response | exact provider read before constructor | fail-closed candidate；dispose material/prefix | provider family/result class, no body/ref | provider unavailable/denied/malformed result creates no adapter/facade and no secret output |
| `FM-09` | credential/key/certificate/trust material expired, revoked, compromised or mismatched | provider/constructor eligibility | fail-closed；unsafe previous artifact ineligible；fix-forward | security intent with material class/safe reason ref | expired/revoked/mismatched pair rejects; rollback cannot select same unsafe set |
| `FM-10` | endpoint/transport/TLS/constructor cannot initialize or prove compatibility | Stage 1~6 | fail-fast candidate；dispose complete owned prefix | exact stage/family/result class | each constructor family failure leaves graph unexposed; no weaker transport/fake |
| `FM-11` | local authority constructor/probe/barrier fails | Stage 1/3/7 | fail-fast; no API/Worker/Jobs exposure | `L-INF-03/04` intent | failure at every stage proves prefix disposal and zero entry exposure |
| `FM-12` | one of 9 external slots, 6 sources or 10 routes fails assembly | Stage 4/6/barrier | reject complete selected graph; no partial activation | family/count/complete-predicate class | fault inject every slot/source/route; exact `9/6/10` barrier remains closed |
| `FM-13` | selected entry barrier fails | API/Worker/Jobs barrier | fail-fast; listener/tasks/facade not exposed | entry/barrier class | fault each barrier prerequisite and assert no early request/source/dispatch |
| `FM-14` | activated external dependency unavailable/timeout | external Port call | existing Port failure; retry only with effect proof; root unchanged | `L-PORT-04` intent | fake exact failure kind; assert exact mapping, bounded eligibility and no config mutation |
| `FM-15` | activated Query/reference basis normally unavailable/partial | Query/application read | existing typed degraded/unavailable surface; no write/fabrication | existing query/profile intent where defined | assert exact typed state/reason, no repository write and no config error |
| `FM-16` | Worker prerequisite unavailable after activation | Worker inbound/collaboration | existing receipt/delayed/failure behavior; no stale acceptance | `L-WKR-03` and Port intent | assert gate, retry proof, no duplicate capture/effect and no source branch rewrite |
| `FM-17` | Jobs prerequisite/target unavailable after admission | Job plan/target loop | existing journal issue/disposition/failed marker only where formal flow authorizes | `L-JOB-07/08` intent | assert exact journal transition/result; Planned stays unresolved on unknown commit |
| `FM-18` | Outbound collaboration/handoff cannot complete | exact outbound Port/application flow | existing typed collaboration/handoff outcome; accepted Hub truth not rolled back | Port/Job profile intent | assert no event/source/payload/business-state rewrite and no fabricated receipt |
| `FM-19` | persisted relation malformed or transaction outcome uncertain | repository/UoW boundary | exact `ConsistencyDefect`/transaction error; no degradation/repair | existing critical diagnostic intent | defect/rollback/unknown fixtures preserve exact error and prohibit blind retry |
| `FM-20` | config artifact/safe digest/profile/ref eligibility drift at new release | release/new process validation | reject candidate/rollback target; current process frozen | config drift/release rejection intent | mismatch at gate rejects new activation; running root and business truth unchanged |
| `FM-21` | active external credential/dependency becomes unavailable after startup | exact call/connection boundary | external Port failure; operations may prepare reviewed restart artifact; no live root rewrite | dependency/security intent according cause | simulate post-start failure; assert no root reload, fake switch or hidden fallback |
| `FM-22` | observer/redaction/sink fails | observation path | existing non-cancelling rule; suppress unsafe output; business result unchanged | `L-DIAG-02/03` intent if safe | fault redactor/sink; assert no raw material and identical business result |
| `FM-23` | remote config center unavailable | none in P0 | `not applicable`; no dependency, cache or fallback exists | none | static design/config test proves no source/Port/worker/config key for config center |
| `FM-24` | hot reload/admin override/watch event requested | source/activation boundary | reject as unsupported design surface; controlled reopen required | forbidden-surface intent if request reaches validator | unknown key/CLI/admin/watch path rejected; current root stays frozen |

## 11. Batch 11.1 停审记录

| Gate | Result |
|---|---|
| SOP five questions | pass |
| six strategy terms exact and non-overlapping | pass |
| parser/assembly/active flow/consistency/transaction separation | pass |
| missing vs explicit Disabled | pass；no inferred `NotConfigured` |
| configured provider/constructor silent fallback | `0` |
| config center P0 dependency | `0`; not applicable |
| online LKG/hot reload/root repair | `0` |
| new error/API/receipt/report/marker | `0` |
| fake monitoring/test/evidence fact | `0` |
| current 03 writeback/upstream blocker | `0/0` |

Batch `11.1` is complete. Batch `11.2` may only add per-domain and per-entry behavior, observability/test handoff, audits and Step completion gates under the fixed taxonomy above.

## 12. 按配置域组织的失败策略

| 配置域 / modules | canonical rows | startup missing/invalid/unreachable | provider/constructor/activation failure | activated runtime boundary | 禁止 fallback / 修复 |
|---|---|---|---|---|---|
| root selection: `runtime` | 1~3 | schema/profile/entry/ref mismatch at V1/V4/V6 fail-fast | Stage 0 rejects whole candidate | none；root is already frozen | no alternate entry/profile/policy section；no CLI/env guess |
| local authority: `localPersistence` | 4 | missing/wrong branch/profile/material ref fail-fast | Stage 1/3 failure disposes prefix | repository/UoW errors retain formal 03 exact error | no inMemory fallback、second authority、config-only data repair |
| primitives: `clock`、`idGenerator`、`compatibility` | 6~7 | missing/wrong fixed literal/profile branch fail-fast | Stage 2 failure disposes prefix | clock/id implementation error follows existing technical boundary | no deterministic fixture in Deployment；no alternate codec/digest |
| external slots: `externalPorts` | 5 | any of 9 slots missing or wrong family fail-fast；explicit Disabled only is valid | Stage 4 configured constructor failure rejects all 9-slot graph | exact `ApplicationPortFailureKind`; Disabled returns existing `NotConfigured` | no Missing->Disabled、configured->Fake/Disabled、slot merge |
| technical policy: `technicalPolicies` | 10、14、21~26 | invalid duration/retry/bound/order fail-fast | Stage 2/5/6 projection mismatch rejects candidate | values bound retry/deadline only；effect proof and outcome still flow-owned | no clamp、unbounded retry、timeout-as-cancellation、attempt-as-proof |
| selected API entry: `entries` API branch | 8~10 | kind/body/page/deadline mismatch fail-fast | API barrier failure prevents listener exposure | per-request invalid input/timeout uses existing API/application contract | no alternate entry、partial listener、public-page clamp |
| selected Worker entry: `entries` Worker branch | 11~17 | body/fetch/parallelism/deadline/source decision invalid fail-fast | all 6 source branches and parked tasks required before release | inbound/Port/receipt behavior remains exact formal 03 | no five-of-six activation、source auto-disable、redispatch from timeout |
| selected Jobs entry: `entries` Jobs branch | 19~22 | body/page/run-timeout/retry invalid fail-fast | Jobs facade/barrier failure prevents request acceptance | journal/report/process observation rules remain exact formal 03 | no scheduler inference、entry auto-retry、report fabrication |
| diagnostics: `diagnostics` | 27 | value outside Off/Redacted fail-fast | wrapper/redaction gate failure blocks unsafe candidate path | sink failure non-cancelling; existing `L-DIAG-02/03` only | no Raw/Full/Verbose、allowlist override、business cancellation |
| configured adapters: `configuredAdapters` | 5、18 | orphan/wrong family/constructor/route shape fail-fast | exact provider/constructor failure rejects owning graph | activated external failure remains Port-owned | no product settings bag、provider route/quota/cost/failover |
| Worker feeds: `inboundFeeds` | 15~16 | selected feed absent/wrong family/transport fail-fast | one feed constructor failure blocks all selected Worker activation | source task failure follows Worker lifecycle/cleanup | no topic-derived logical identity、partial source success claim |
| trusted actors: `trustedActors` | 15、17 | selected actor set absent/empty/wrong family fail-closed | matcher constructor failure blocks Worker | malformed/untrusted inbound follows exact gate/receipt contract | no accept-all actor、raw token/role inference |
| outbound graph: `outboundRoutes` | 18 | configured collaboration requires exact 10/10 family refs | any route constructor failure rejects complete collaboration graph | exact typed collaboration outcome/Port failure | no nine-of-ten activation、route failover、payload/source mutation |
| test material: `fixtures` | 4~6、15 | missing/wrong fixture kind/schema/profile fail-fast | fake constructor/parity failure rejects candidate | none in Deployment；test behavior does not claim external success | no fixture in Deployment、fixture body/evidence/result in config |
| physical connection: `transports` | 4~5、15~18 | wrong kind/ref/reachability fail-fast | constructor cannot prove transport/TLS compatibility -> fail-closed | connection/call failure maps to owning existing Port | no plaintext/TLS downgrade、alternate transport discovery |
| address metadata: `endpoints` | 4~5、15~18 | invalid kind/address/forbidden embedded credential fail-closed | exact constructor failure rejects owning binding | endpoint outage is active Port failure, not config reload | no embedded token/userinfo、fallback endpoint list |
| credential refs: `credentialRefs` | 4~5、15~18 | raw material, wrong kind/provider/locator relation fail-closed | unreadable/denied/expired/revoked/malformed provider result rejects constructor | post-start access failure remains owning Port/security operation concern | no raw secret、full locator output、other-provider fallback |
| TLS policy: `tlsPolicies` | 4~5、15~18 | unsupported mode/version/trust relation fail-closed | certificate/key/trust mismatch or expiry rejects constructor | active transport failure does not mutate policy | no TLS disable/version downgrade/partial key-cert rotation |

This table covers all 18 top-level modules. A canonical row may legitimately touch more than one material module, but its raw semantic owner remains the one recorded in Step 7; the failure table does not introduce duplicate configuration authority.

## 13. 27/27 canonical row failure coverage

| Row group | Rows | Required failure checks | Runtime handoff | Coverage |
|---|---:|---|---|---|
| schema/profile/entry | 1~3 | fixed schema、closed profile、entry/ref symmetry、one selected graph | none after activation | `3/3` |
| authority/external/primitives/compatibility | 4~7 | one authority、9 slots、clock/id profile、fixed codec/digest | exact repository/Port/technical errors | `4/4` |
| API controls | 8~10 | body/page/deadline bounds and projection | existing API/application timeout behavior | `3/3` |
| Worker controls/sources | 11~17 | body/fetch/global parallelism/deadlines、6 decisions、feed/actor pairs | existing Worker/Port/receipt lifecycle | `7/7` |
| route graph | 18 | configured branch exact 10/10 family graph | existing collaboration outcome/Port error | `1/1` |
| Jobs controls | 19~22 | body/page/run deadline/reentry retry shape | existing journal/report/process behavior | `4/4` |
| cross-entry technical policy | 23~26 | external/contention/commit observation retry and internal page bounds | formal 03 effect/reload/read proof | `4/4` |
| diagnostics | 27 | Off/Redacted only、fixed allowlist、non-cancelling sink | existing observer rules | `1/1` |
| total | 1~27 | no missing/type/range/cross-field/provider/constructor branch omitted | no new runtime surface | `27/27` |

## 14. 分层运行行为矩阵

| Layer | Before activation/config failure | After activation/dependency or data failure | Retry authority | Persistent/business effect | Observation intent |
|---|---|---|---|---|---|
| startup/source/parser | fail-fast `RuntimeAssembly`; no graph | not applicable to frozen process | external process/release owner may start a newly reviewed candidate | zero Hub business effect | `L-INF-02` plus exact later infra cut only where stage reached |
| assembled Port slot | configured/Disabled branch must construct completely; Missing fails | exact `ApplicationPortFailureKind` or existing `NotConfigured` | only owning flow with zero/effect proof; config attempts are upper bound, not proof | exact owning flow; no branch rewrite | `L-INF-05` startup, `L-PORT-04` active failure |
| Query/read surface | config failure means no entry | normal unavailable/partial may be typed degraded; malformed persisted relation is `ConsistencyDefect` | Query-owned rules; no mutation retry | no repair/write/fabrication | existing query profile; redaction gate when actually violated |
| Worker | source graph/barrier failure prevents all task release | header/source/Port/collaboration failure follows existing receipt/delayed/cleanup contract | exact inbound flow/effect proof only | no duplicate capture/receipt/business effect | `L-WKR-02/03/06`, plus `L-PORT-04` where called |
| Jobs | facade/barrier failure prevents admission | planning/target/dependency/commit failure follows journal/report rules | exact journal/reentry proof only; no host blind redispatch | only formal Job UoWs/markers; unknown remains nonterminal | `L-JOB-01/07/08` and exact target/report cuts |
| Outbound | route graph/constructor failure blocks candidate | capture/handoff/collaboration typed result or Port failure | only formal continuation/repair Job rules | accepted truth never rolled back; no second event/capture | existing Outbound/Port/Job owner cuts |
| observer | unsafe diagnostic config blocks candidate; Off is valid explicit mode | sink/redaction failure cannot alter result, durability, receipt, report, handoff or cleanup | no observer retry state | zero business effect | `L-DIAG-02`; `L-DIAG-03` only with independent non-recursive fallback |

### 14.1 Startup prefix disposal invariant

At every Stage 0~7 failure, cleanup owns the complete successfully built prefix in reverse construction order. Cleanup failure may be observed through the existing infra disposal cut, but it cannot replace the original runtime-assembly classification with a partial success or expose the surviving prefix. The process must return no root and no neutral handoff.

### 14.2 Active-process immutability invariant

Once an entry barrier succeeds, the validated root, selected branch and resolved constructor inputs are immutable for that process lifetime. Drift, provider rotation, endpoint changes, Disabled/Configured changes or policy changes only become candidates for a separately validated fresh process. The current process may experience external dependency failure, but it may not inspect raw sources again or select a different branch in response.

## 15. 告警与安全观测意图

The following rows identify future observation intent and exact existing profile owners. They do not assert that a log, metric, trace, alert rule, dashboard or notification has been implemented or emitted.

| Failure family | Existing profile owner | Intent | Safe candidate fields | Forbidden fields / claims |
|---|---|---|---|---|
| root validation reject | `L-INF-02` | operator-visible startup rejection | phase、owner、stage、entry kind、outcome、binding state、fixed issue/error refs | config body、raw key/value、file/env path、partial graph、actual alert instance |
| primitive/authority failure | `L-INF-03` | stage/family attribution and cleanup result | stage、entry、adapter kind、result class、cleanup outcome | DSN、schema、secret、dependency response/body |
| local Port graph failure | `L-INF-04` | 27/27 completion failure | stage、count、Port family、binding state、safe issue ref | repository body、connection material、partial graph |
| external graph failure | `L-INF-05` | 9/9 slot/14 callable completeness failure | stage、count、family、branch state、result class | endpoint、credential/provider/route detail、fake fallback |
| prefix disposal | `L-INF-07` | prove no partial return and preserve original failure | stage、entry、cleanup outcome、fixed error ref | cleanup body、surviving object、original failure overwrite |
| active external Port failure | `L-PORT-04` | exact raw-to-typed failure family and retry eligibility owner | Port family、typed failure kind、safe refs、duration where allowed | raw status/provider code/response/body、retry decision from log |
| Worker activation/inbound/shutdown | `L-WKR-02/03/06` | barrier/gate/cleanup state | source family/slot、lifecycle/outcome、validated refs | payload、transport metadata、lease/ack invention、receipt fabrication |
| Jobs admission/process/runtime | `L-JOB-01/07/08` | distinguish malformed admission, non-cancelling observation and runtime technical failure | job/entry kind、run ref if formed、lifecycle/outcome、fixed issue/error refs | request/report body、scheduler internals、attempt/queue/lease claim |
| redaction violation | `L-DIAG-02` | report attempted forbidden-field submission without reproducing it | fixed phase/owner/mode/outcome/issue refs | field name/value/length/source path、raw secret/body |
| sink failure | `L-DIAG-03` | one non-recursive process fallback when independently available | phase、owner、outcome、static failed event key | backend response/body、recursive logging、retry loop、business rollback |

Severity thresholds, aggregation windows, notification routes, retention, dashboard layout and on-call action remain 09/operations-owned. Formal 04 may require the above intents and redaction constraints, but must not invent numeric thresholds or claim alert delivery.

## 16. 下游测试切口合同

| Cut ID | Preconditions | Action/fault | Required oracle | Prohibited assertion/fabrication |
|---|---|---|---|---|
| `CFG-F-01` | valid minimal artifact for each profile/entry | remove file or required module/leaf/ref | `RuntimeAssembly`; no root/constructor/entry exposure | no real filesystem permission result required in design |
| `CFG-F-02` | valid strict JSON | inject BOM/comment/trailing comma/duplicate/unknown/null/coercion/oversize | deterministic rejection at parser/V0~V1; diagnostic projection has no raw token | do not claim parser test run |
| `CFG-F-03` | valid JSON plus bounded env target | set higher-priority invalid env value | candidate rejects; JSON value is not used | no env value in observation |
| `CFG-F-04` | valid artifact variants | test min-1/max+1/type/case/name/profile/entry/cross-field | exact V1~V6 rejection and zero Stage constructor calls where applicable | no clamp/trim/alias/fallback |
| `CFG-F-05` | selected graph registries | orphan/cycle/wrong-family/case-collision/unreachable sensitive section | whole candidate rejects before provider/constructor | no arbitrary section choice |
| `CFG-F-06` | one external slot omitted vs explicit Disabled | build each candidate | omission rejects; explicit legal Disabled constructs existing `NotConfigured` Port | no Missing->Disabled equivalence |
| `CFG-F-07` | configured branch and fake/inMemory alternatives registered | make provider/constructor fail | complete candidate rejects; alternative constructors never invoked | no silent fallback claim |
| `CFG-F-08` | credential/TLS provider fixtures | unavailable/denied/malformed/expired/revoked/mismatched material | fail-closed, no adapter/root and no sensitive output | no real secret/provider evidence |
| `CFG-F-09` | fault-injectable Stage 0~7 builder | fail each stage and cleanup branch | complete owned prefix disposed; no neutral handoff; original failure retained | no partial graph introspection through public surface |
| `CFG-F-10` | API/Worker/Jobs candidate | fail each selected entry barrier prerequisite | listener/tasks/facade remain unexposed | no host-specific deployment assertion |
| `CFG-F-11` | configured collaboration and Worker source matrices | fail each of 9 slots, 6 sources and 10 routes in turn | exact complete predicate remains false; entire candidate rejects | no reduced graph success |
| `CFG-F-12` | activated fake Port with each failure kind | invoke owning flow | exact existing failure/surface; only temporary/timeout branch enters bounded retry when effect proof exists | attempts value alone is not retry proof |
| `CFG-F-13` | activated Query/reference fixtures | return normal partial/unavailable and malformed persisted relation separately | first remains typed degraded/no-write; second is `ConsistencyDefect` | no common degraded fallback |
| `CFG-F-14` | activated Worker/Jobs/Outbound fixtures | inject retryable/permanent/invalid response/commit unknown/rollback failed | exact receipt/journal/outcome/error and no duplicate effect | no fabricated marker/report/receipt |
| `CFG-F-15` | active frozen root plus changed artifact/material metadata | present drift only to new activation gate; fail active dependency separately | new candidate rejects or Port fails respectively; current root never reloads | no online LKG/hot reload |
| `CFG-F-16` | observer fake and forbidden candidate field | fail redaction/sink | safe omission/non-recursive behavior; business result byte-equivalent | no raw field/backend body, no claimed alert delivery |
| `CFG-F-17` | config source inventory/static dependency graph | search for config-center/admin/watch/hot-reload surfaces | zero P0 key/Port/worker/dependency; unsupported input rejected | no outage simulation for absent product |
| `CFG-F-18` | previous artifact eligibility fixtures | mark credential/TLS revoked/expired or digest/profile incompatible | rollback target rejected; fix-forward required | no claim that rollback was executed |

These are contracts handed to Step 12 and later formal `05-测试方案.md`; they are not full test cases and have no execution status, run ID, evidence alias or result.

## 17. Step 7/8/9/10 回指矩阵

| Failure conclusion | Step 7 item source | Step 8 security source | Step 9 phase source | Step 10 change/rollback source |
|---|---|---|---|---|
| raw/missing/type/range/relation reject | exact 18-module catalog and bounds | sensitivity determines projection only | V0~V6 | candidate validation rejection |
| provider/material/secret/TLS failure | material/credential/TLS registries | exact provider-to-constructor injection、raw output prohibition | V7/V8 and owning Stage | atomic rotation、unsafe target ineligible |
| configured constructor failure | slot/source/route/material refs | material disposed after exact use | Stage 1~6 + prefix disposal | baseline retained before cutover |
| entry barrier failure | selected API/Worker/Jobs parameters | no additional raw access | Stage 7 + exact barrier | candidate closed, no cutover |
| runtime Port/degraded/delayed/marker | policy upper bounds and selected branch | no secret/ref leakage | occurs only after activation | config artifact remains unchanged |
| drift/expiry/revocation | artifact/ref/profile catalog | safe eligibility and security precedence | detected on new validation/activation | target eligibility; fix-forward where unsafe |
| observer failure | Off/Redacted only | fixed output suppression | wrapper/barrier and active non-cancelling path | diagnostic mode changes require restart |

## 18. 配置失效模式停审记录

| 配置项 / 失效类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| source/parser | strict input、size/encoding、high-priority invalid behavior | pass | no fallback/raw output |
| required/type/range/cross-field | 18 modules、27 rows | pass `18/18`, `27/27` | none |
| Missing vs Disabled | branch intent | pass | only explicit Disabled creates `NotConfigured` |
| secret/provider/TLS | unavailable/expired/revoked/mismatch | pass | fail-closed; unsafe rollback forbidden |
| constructor/graph | local/9 external/6 source/10 route/barrier | pass | all-or-nothing; complete prefix disposal |
| active dependency | Port taxonomy/retry proof/root immutability | pass | no config exception/reload |
| typed degraded/delayed/failed marker | exact formal 03 owner | pass | config layer creates none |
| consistency/transaction | exact error precedence | pass | no downgrade/auto repair/blind retry |
| drift/expiry | detection and current process | pass | new gate only; current root frozen |
| config center/admin/hot reload/LKG | P0 applicability | pass | all unsupported/not applicable |
| observation | existing profiles、安全字段、non-cancelling | pass | no threshold/instance/result claim |
| testing | precondition/action/oracle/prohibition | pass `18` cuts | no execution/evidence claim |

## 19. 跨失效策略审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 failure mode without behavior | `0` | none |
| top-level module without failure coverage | `0`; `18/18` | none |
| canonical row without failure coverage | `0`; `27/27` | none |
| high-risk failure with silent fallback | `0` | candidate rejects/fail-closed |
| invalid high-priority env fallback | `0` | exact invalid source rejects |
| Missing inferred as Disabled/Fake | `0` | explicit branch required |
| configured provider/constructor fallback | `0` | no alternate constructor/branch |
| secret/TLS raw/full material output | `0` | safe class/ref only |
| expired/revoked/compromised rollback target | `0` | fix-forward only |
| partial 9/6/10 graph activation | `0` | all-or-nothing barriers |
| startup error exposed as API/receipt/report/business marker | `0` | `RuntimeAssembly` only |
| normal degraded converted to config exception | `0` | exact typed surface retained |
| consistency/transaction defect downgraded | `0` | exact errors retained |
| retry authorized solely by config attempts | `0` | formal effect proof mandatory |
| drift triggers current-process reload/repair | `0` | new activation/release gate only |
| config center/admin/hot reload/online LKG dependency | `0` | unsupported/not applicable |
| observer failure alters business result | `0` | non-cancelling |
| concrete alert threshold/dashboard/runbook/product | `0` | downstream operations-owned |
| fabricated monitoring/test/evidence/signoff/run/commit | `0` | design contracts only |
| forbidden Hub responsibility leakage | `0` | execution/listing/approval/method body/provider routing/SDK delivery excluded |
| 03 code-contract delta/writeback gap | `0/0` | existing taxonomy sufficient |

## 20. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| parser/V0~V8 invalid -> `InfraError::RuntimeAssembly` | 否 | reuses existing infra-local startup classification | formal 03 §13 / DDD Step 12 | 无回写 |
| Stage/provider/constructor failure disposes prefix and exposes no graph | 否 | reuses existing builder sequence | formal 03 §13.9 | 无回写 |
| Missing fails; explicit Disabled yields existing `NotConfigured` | 否 | preserves closed binding union/Port taxonomy | formal 03 §13 | 无回写 |
| active external failure uses existing `ApplicationPortFailureKind` | 否 | preserves error and retry proof | formal 03 §§10~12 | 无回写 |
| degraded/delayed/failed marker only through existing typed surfaces | 否 | prevents configuration-layer protocol expansion | formal 03 §§8~12 | 无回写 |
| consistency/transaction/observer failures retain exact rules | 否 | preserves persistence/recovery/observation contract | formal 03 §§10~14 | 无回写 |
| drift/expiry checked on fresh activation; root frozen | 否 | existing startup-only configuration lifecycle | formal 03 §13 | 无回写 |
| remote config center/admin/hot reload/online LKG absent | 否 | confirms existing non-scope | formal 03 §13 | 无回写 |
| future new failure enum/API/marker/reload watcher/config-center Port/provider-health protocol | 触发时是 | code/protocol/runtime lifecycle change | controlled reopen DDD Steps 6~9、12、14~15 as applicable | 当前未引入；受控回开 |

Current impact: `待回写=0`, `阻塞待确认=0`, `upstream blocker=0`。本 Step 新增 Rust declaration、struct、field、enum、variant/payload、trait、method或callable=`0`，Rustdoc delta=`0`。任何未来新增 Rust 声明必须为 declaration、每个 struct field、每个 enum variant/payload field、trait/method/callable 提供英文 `///` 注释。

## 21. Formal §11 回填草稿

正式 `04-配置设计.md` §11 应装配：

1. 六个策略术语和 phase-first 判定顺序；
2. parser/assembly/active Port/typed degraded/consistency/transaction/observer 错误分层；
3. 24 行全局失效模式表；
4. 18 modules 与 27 canonical rows 的逐域失败矩阵；
5. startup、Port、Query、Worker、Jobs、Outbound、observer 七层行为矩阵；
6. current root frozen、new activation drift gate、config center not applicable；
7. safe observation intent与18个future test-cut contract；
8. Steps 7~10回指、配置域停审、跨失效审计和03 no-writeback gate。

正式章节必须明确 `Missing != Disabled`、configured failure不能切Fake/Disabled、非法env不能回退JSON、expired/revoked material不能作为rollback target。不得新增 error/API/receipt/report/marker，不得声明真实日志、指标、告警、测试、evidence、run、验收或运维事实。

## 22. 待确认事项

| 事项 | 当前状态 | 是否阻塞 Step 12 | 未确认前处理 |
|---|---|---|---|
| concrete deployment/release restart and cutover mechanism | unselected | no | 07/09 prerequisite；04只要求fresh candidate + external outcome |
| provider-specific expiry/revocation/overlap signal | product-dependent | no | exact provider/constructor prerequisite；不能弱化fail-closed |
| alert aggregation/threshold/notification/retention | unselected | no | 09/operations-owned；04只提供profile和safe-field intent |
| independent non-recursive sink fallback availability | implementation-dependent | no | absent时不发第二条record；business result保持不变 |
| config center/hot reload/online LKG future need | not requested | no | P0 unsupported；future need triggers controlled reopen |

All items are downstream product/operations prerequisites or future evolution triggers. They do not block the current configuration contract and cannot be presented as implemented facts.

## 23. Step 11 completion gate

| Completion condition | Result |
|---|---|
| SOP five questions answered | pass |
| policy terms exact | pass `6/6` |
| global failure modes | pass `24` |
| modules/canonical rows covered | pass `18/18`, `27/27` |
| runtime behavior layers | pass `7/7` |
| high-risk silent fallback | `0` |
| startup vs active runtime taxonomy collision | `0` |
| unsafe secret/TLS/drift/rollback behavior | `0` |
| config center/hot reload/online LKG assumption | `0` |
| alert/test intent without fabricated facts | pass |
| per-domain stop review | pass |
| cross-failure unresolved conflict | `0` |
| 03 pending writeback/blocking confirmation | `0/0` |
| upstream blocker | `0` |
| formal 04 write before Step 15 | `0` |

Step 11 is complete. Next allowed action: read SOP Step 12、writing standard §5.12、test/acceptance/implementation/operations standards, Steps 6/7/11 and formal 03 test/implementation handoff；then define exact downstream ownership and inputs without writing full tests, acceptance decisions, implementation facts or deployment commands.
