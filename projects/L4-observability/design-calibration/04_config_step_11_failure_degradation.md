# L4-observability 04-配置设计 Step 11：定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节：`04-配置设计.md` §11
> 当前模式：`full-restart_after_current_M3`
> 本步边界：定义配置缺失、错误、不可达、过期、漂移、激活不确定、排空不完整与历史绑定不可用时的
> fail-fast / fail-closed / degraded / blocked / manual 语义；不新增代码错误类型、业务状态、告警产品、
> 运维命令、真实测试结果或 evidence

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `projects/L4-observability/04-配置设计.md`，本 Step 不修改 |
| 当前 Step | Step 11 `定义失效模式与降级 / fail-fast 策略` |
| 当前模块 | `startup-runtime-activation-history-failure-taxonomy` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_11_failure_degradation.md` |
| 前序门禁 | Step 10 current M3复核`pass`；用户于2026-08-02授权连续完成全部M4 |
| 写入状态 | `completed_current_full_rewrite` |
| gate_status | `pass_consumed_by_step_12` |
| gate_reason | 五个SOP问题、七类startup error、四类availability、六类lifecycle failure、23域失效策略、12项affected、跨失效审计与formal草稿均闭合 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker / affected | I05两项`open_upstream_internal`、H13 `open_controlled`、其余9项`inherited_affected`均保持开放 |
| implementation readiness | `blocked`；本文件仅定义设计，告警、测试、provider、target repo和真实execution均未建立 |
| next_allowed_action | `continue_to_current_step_12_under_continuous_M4_authorization` |

### 1.1 Step 内执行记录

| 序号 | 动作 | 结果 | 状态 |
|---:|---|---|---|
| 1 | 读取项目台账、配置flow与Step09~10 | 恢复点为current Step11，formal `04`仍冻结 | done |
| 2 | 读取SOP Step11与书写规范§5.11 | 固定五问、五列表和高风险无silent fallback约束 | done |
| 3 | 读取formal `03` §11~§14、§16.10、§17 | 七error、四availability、unknown/manual、telemetry non-authority与affected完整 | done |
| 4 | 后置审计旧Step11与旧formal §11 | 旧81行模板主语错误，整份替换 | done |
| 5 | 读取L1-governance/L1-artifact §11 | 只采用矩阵密度与failure disposition结构 | done |
| 6 | 回答五问并形成跨域失效矩阵 | startup/runtime/activation/history/migration均有唯一处理 | done |
| 7 | 完成`03`影响、formal草稿、真实性与门禁 | 无新代码契约；继续Step12 | done |

### 1.2 写入前与越界检查

| 检查面 | 结论 |
|---|---|
| 正式正文 | blocked；只有Step15可装配formal `04` |
| code contract | 不新增`RuntimeAssemblyError`、availability enum、business state、trait或repository |
| alert / test | 只定义planned cut与required operator signal，不声称系统、pipeline或结果存在 |
| LKG | current不支持自动last-known-good；candidate失败仅保持old lifecycle不变，不能写“rollback成功” |
| config center | current明确unsupported；不可达不是运行时降级场景，而是unsupported source / invalid candidate |
| business truth | 配置失败不写business audit、gap、retention、handoff、evidence或source truth |
| downstream | 不提前定义current `05` case ID、`06` verdict或`07` implementation commit |

## 2. 本步目标与非目标

### 2.1 目标

1. 固定必填缺失、类型/范围/交叉字段错误的fail-fast边界。
2. 区分selected sensitive ref不可解析、adapter运行时Unavailable和historical binding不可恢复。
3. 区分`Disabled`、`Unavailable`、`Misconfigured`、`Degraded`，禁止折叠为bool或业务状态。
4. 消费Step10 `CFG-FH-01~06`，补齐影响、operator surface、告警条件和planned test cut。
5. 为`CFG-D01~D23`逐域给出fail-fast、fail-closed、degraded、blocked或manual的唯一disposition。
6. 明确配置漂移、过期、rotation和retirement如何发现，以及发现后不能做什么。
7. 传播12项inherited affected，证明配置失效策略不能伪关闭schema、owner、UoW、flow或capability gap。

### 2.2 非目标

- 不选择KMS、Vault、config center、store、broker、scheduler、alerting或incident产品。
- 不定义配置中心重试、watch、hot reload、in-process swap或自动LKG。
- 不定义host ownership API、drain force-stop命令、historical registry物理schema或恢复runbook。
- 不把startup error复用为Command/Consumer/Job业务结果，也不把业务error改成startup error。
- 不创建真实alert、dashboard、test suite、artifact、report、run id、evidence alias、verdict或signoff。
- 不允许以degraded继续执行source write、unsafe serialization、partial UoW、blind external retry或unknown ack。

## 3. Current 输入与权威顺序

| 输入 | 身份 | 本步采用 | 禁止继承 |
|---|---|---|---|
| 配置SOP Step11 / 书写规范§5.11 | current标准 | 五问、五列表、fail-fast/fail-closed/degraded/LKG口径 | 不允许摘要替代P0矩阵 |
| Step05 | current source contract | invalid winner no-fallback、unsupported config center、history不读current | 不恢复CLI/multi-file/remote override |
| Step07 | current field registry | required、range、conditional binding、numeric baseline/hard bound | demo不是ready或evidence |
| Step08 | current sensitive contract | locator/material分层、rotation、no-output、old binding | provider产品与真实credential未选 |
| Step09 | current loading/assembly | 13-stage complete-or-error、seven errors、zero partial root | 不假定loader已实现 |
| Step10 | current lifecycle contract | cold activation、ownership、drain、rollback、retirement与`CFG-FH-01~06` | 不假定control plane/audit landing存在 |
| formal `03` §11 | direct error baseline | typed error/recovery/unknown/manual/finalize-only | 不新增error variant或字符串推断 |
| formal `03` §13 | direct config baseline | startup errors、availability、binding/capability、history pinning | 不改struct/enum/flow |
| formal `03` §14 | telemetry boundary | safe runtime signal、no-output、sink non-authority/self-recursion | metric/log不是truth或acceptance evidence |
| formal `03` §16.10/§17 | readiness baseline | 12 affected与未关闭前行为 | 不把design record写成runtime-ready |
| old Step11 / old formal §11 | historical material | 识别失效主语错位与旧profile/fake fallback | 不恢复任何旧结论 |
| L1参考 | granularity only | failure matrix、operator/recovery/test列密度 | 不复制相邻域错误或产品 |

权威顺序：current standards -> formal `00~03` -> current Step01~10 -> 本Step；旧formal/README/reference仅作诊断。

## 4. SOP 五问回答

### 4.1 必填配置缺失时如何处理？

必填或conditional-required字段在effective candidate中缺失时，必须在adapter构造与entry exposure前停止。普通字段缺失
映射既有`InvalidConfiguration`；selected source整体不可得映射`ConfigSourceUnavailable`；required sensitive material缺失
映射`SensitiveReferenceUnavailable`；required binding/capability缺失使用既有family-specific assembly error。不得使用zero、empty、
first enum、旧README值、provider default、Fake/InMemory、current route或另一个target补齐。

显式`Disabled`只适用于formal允许optional的surface，并且必须不携带相冲突binding/credential/capability。Startup-required
store、UoW、clock、ID、digest和safety不能Disabled。I05/H13等affected也不能用“Disabled启动成功”宣称positive path已关闭。

### 4.2 类型、范围与交叉字段错误如何处理？

Strict JSON duplicate/unknown/alias、ENV非法、overflow、非法enum、noncanonical set、range、heartbeat/lease、default/max、
profile/mode、catalog totality、store capability、phase descriptor和entry totality任一失败，都拒绝complete candidate。高优先级
winner非法不fallback低优先级；collection/catalog不做partial merge；数值不truncate/clamp；不返回partial runtime + warning。

### 4.3 Secret / KMS / Vault不可用时如何处理？

本项目未选择KMS/Vault产品。语义只针对selected sensitive locator：

- candidate构建时required material不可解析：`SensitiveReferenceUnavailable`，zero adapter/root exposure。
- explicit Disabled optional binding：不解析material，也不产生success adapter。
- 已成功装配后exact target运行时Unavailable：只影响该formal surface，保留binding/token/intent/outbox并按typed outcome处理。
- old accepted work需要的historical material/descriptor不可恢复：external call前停止，保留durable material，进入manual/restore；不读current credential/route。
- error/log/metric/span/audit/report只输出body-free safe issue/family/phase类别，不输出locator、full ref、fingerprint或material。

### 4.4 Config center不可达时如何处理？

Current source contract不支持config center、remote admin、multi-file include、CLI field override或hot source。因此不存在“中心不可达时
继续用cache/LKG”的current运行策略。若deployment声明remote source，loader必须按unsupported source拒绝candidate。未来引入remote
source需回写formal `03` reader/carrier/error/consistency/activation contract和current `04~07`，不能只添加endpoint key。

### 4.5 配置漂移或过期如何发现和处理？

| Drift / expiry subject | Detection authority | 发现后处理 | 禁止 |
|---|---|---|---|
| protected candidate被修改/过期/supersede | external config control plane custody | activation前reject，重新review/protect | 从workspace/runtime memory反构 |
| loaded semantics与`ConfigBindingRef`不一致 | stage4 deterministic identity check | `InvalidConfiguration`，zero exposure | path/time/random ref或继续运行new candidate |
| binary/schema/profile与prior candidate不兼容 | rollback full Step09 validation | rollback blocked，保持known current ownership | 复用历史validation pass |
| adapter descriptor/capability漂移 | assembly descriptor validation或exact availability probe | startup fail或exact surfaceUnavailable/Misconfigured | 换target/fake success |
| credential rotation改变destination/namespace | binding/rotation review | new binding ref；old work保留old resolution | same-ref silent drift |
| historical binding reader/locator过期 | obligation scan + resolution probe | block retirement，restore/manual | current route fallback |
| digest reader/schema revision过早移除 | durable reference scan | block migration/retirement | 重算old digest或auto migrate |
| host ownership事实不一致 | four-class ownership probe | activation indeterminate，reconcile before next phase | 双owner或guess success |

Runtime telemetry可以发出safe drift category，但不拥有custody、approval、activation、retirement或acceptance事实。

## 5. Historical material诊断与设计取舍

### 5.1 旧材料问题

| Historical内容 | 问题 | Current处理 |
|---|---|---|
| 用log/metric/trace/audit schema作为配置失效主语 | 混淆formal §14 telemetry与config lifecycle | 删除，失效主语改为source/field/binding/assembly/activation/history |
| controlled secret缺失时local fake继续 | profile/surface不精确，可能在RuntimeLike silent fallback | required selected binding fail；optional exact surface显式Disabled/Unavailable |
| archive unavailable marker-only | 旧archive对象与current external catalog不一致 | 只按formal handoff/export exact target与durable marker边界 |
| bus disabled outsidelocal-dev fail | 旧profile/transport假设 | 以enabled entry/outbound mapping totality和formal mode为准 |
| report root invalid fail-fast | current root无report path/run/evidence字段 | 删除旧配置项；report ref/evidence不得由config生成 |
| 全部失败一个策略 | 未区分pre-identity、assembly、runtime、activation、history | 建立五层taxonomy和六类lifecycle handoff |
| 自动允许next step | 未做逐域、affected、真实性检查 | 本文件full rewrite后才pass |

### 5.2 核心取舍

| 议题 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| candidate错误 | fail-fast complete candidate | field fallback / clamp / partial root | 保持determinism与least authority |
| optional依赖 | explicit Disabled或typed runtime Unavailable | fake success / empty success | availability不等于业务结果 |
| old assembly | candidate失败时old lifecycle不变 | 自动LKG/rollback成功 | 尚未发生activation，无rollback事实 |
| activation unknown | probe/reconcile/manual | old-wins/new-wins默认 | 防双owner与duplicate admission |
| external unknown | same-token probe/manual | blind retry/换token/换target | 保持idempotency与historical binding |
| drift | authoritative custody/identity/capability scan | telemetry或文件时间裁决 | telemetry非控制面truth |
| alert | product-neutral required operator signal | 指定Prometheus/Pager产品 | 产品尚未选择 |

## 6. 失效语义词表

| Disposition | 适用时点 | 系统行为 | 明确不表示 |
|---|---|---|---|
| `fail_fast` | new candidate parse/validate/assembly/registration前后但exposure前 | stop candidate，cleanup candidate resources，zero new root | old runtime rollback成功或business rejection |
| `fail_closed` | 安全、truth、no-write、schema、mapper、UoW、unknown certainty | 拒绝受影响operation/surface，zero forbidden side effect | 可降级绕过红线 |
| `explicit_disabled` | formal允许的optional exact surface且配置完整表达Disabled | 不构造/call该adapter；返回formal disabled/unavailable surface | success、healthy或affected closed |
| `degraded_exact_surface` | complete runtime后某optional/exact依赖不可用或formal safe subset成立 | 只暴露typed degraded/unavailable；无关truth保持 | fallback body、partial UoW或acceptance pass |
| `blocked` | migration、retirement、H13或precondition未闭合 | 不推进对应phase/boundary，保留已有material | transient retryable或成功 |
| `manual_restore` | historical binding缺失、external unknown unsupported、ownership无法判定 | retain durable material，operator restore/probe/reconcile | current fallback、blind retry或fabricated result |
| `continue_old_lifecycle` | new candidate在activation前失败 | old known runtime继续其既有admission/lifecycle | automatic LKG selection或rollback execution |

`last_known_good`不作为current自动策略。Prior candidate只有在受保护、重新review、重新执行完整Step09并通过同一cold
activation时，才可成为一次新的rollback candidate。

## 7. Startup error与availability边界

### 7.1 七类 `RuntimeAssemblyError`

| Existing variant | Trigger class | Disposition | Operator signal | Planned cut |
|---|---|---|---|---|
| `ConfigSourceUnavailable` | selected JSON/coherent source不可完整读取 | fail-fast；zero candidate/root | required startup error, safe issue only | source missing/partial/coherence injection |
| `InvalidConfiguration` | unknown/duplicate/type/range/cross-field/profile/redline/identity | fail-fast；invalid winner不fallback | required startup error | registry/table-driven negative corpus |
| `SensitiveReferenceUnavailable` | required selected locator无法解析 | fail-fast；zero adapter/root | security/availability owner attention | provider unavailable/no-output spy |
| `StoreCompatibilityMismatch` | schema/atomicity/CAS/fence与声明不符 | fail-fast；zero write façade | data/infra owner attention | capability descriptor mismatch |
| `AdapterConstructionFailed` | exact adapter构造失败 | fail-fast；cleanup private material | adapter owner attention | constructor failure + cleanup spy |
| `RequiredCapabilityMissing` | family/phase/probe/trigger能力不足 | fail-fast for required surface；optional exact surface可Disabled only if formally allowed | integration owner attention | capability matrix negative |
| `EntryBindingIncomplete` | raw/private/safe/catalog/handler/registration不全或group失败 | fail-fast；revoke/join all；zero active root | entry owner attention | Nth prepare/arm failure barrier |

所有variant只携formal body-free refs；不得含raw config/path/env/secret/provider body，也不是run/evidence/signoff。

### 7.2 Availability四值

| Availability | 含义 | Operation行为 | 禁止映射 |
|---|---|---|---|
| `Available` | exact family/binding probe可用 | 允许继续formal operation guards；不证明调用成功 | Accepted/Published/Delivered/Ready |
| `Degraded` | exact capability子集或恢复能力受限 | 仅formal允许的typed degraded/manual surface | generic success或降低安全检查 |
| `Unavailable` | runtime exact dependency暂不可用 | 对应surface unavailable/delayed/blocked，保留durable work | not-found、empty success、换target |
| `Misconfigured` | descriptor/binding/capability与validated claim不一致 | fail closed；若startup-required则runtime不能暴露 | transient health failure或retry hint |

`Disabled`是config mode而不是availability enum；它表示surface未启用，不是runtime故障或成功。

## 8. P0失效模式总表

表中“告警”是future producer requirement，不表示alerting已实现。“测试切口”是current `05`输入，不表示已运行。

| Failure ID | 失效模式 | 影响 | 系统行为 | 是否告警 | Planned测试切口 |
|---|---|---|---|---|---|
| `CFG-FAIL-01` | selected source不可读/partial/incoherent | new candidate不存在 | fail-fast `ConfigSourceUnavailable`；old lifecycle不变 | required startup | coherent source fault |
| `CFG-FAIL-02` | unknown/duplicate/alias/unsupported source | schema歧义 | fail-fast `InvalidConfiguration` | required startup | strict registry corpus |
| `CFG-FAIL-03` | required/conditional-required缺失 | incomplete root/surface | fail-fast；不补default/fake | required startup | field omission matrix |
| `CFG-FAIL-04` | type/range/overflow/noncanonical set | typed contract不成立 | fail-fast；no clamp/truncate | required startup | boundary value/property |
| `CFG-FAIL-05` | cross-field/profile/redline错误 | invariant或mode冲突 | fail-fast；reject whole candidate | required startup | profile/cross-field matrix |
| `CFG-FAIL-06` | config identity collision/drift | candidate不可追溯 | fail-fast；不暴露runtime | security/config owner | semantic identity corpus |
| `CFG-FAIL-07` | required sensitive locator不可解析 | adapter不可安全构造 | fail-fast；zero material output | security/integration | provider fault + output spy |
| `CFG-FAIL-08` | store schema/atomicity/CAS/fence不足 | UoW/claim不可靠 | fail-fast `StoreCompatibilityMismatch` | critical data/infra | fake/durable conformance |
| `CFG-FAIL-09` | adapter family/phase descriptor mismatch | wrong target/effect风险 | fail-fast exact error | critical integration | descriptor matrix |
| `CFG-FAIL-10` | enabled catalog missing/duplicate target | dispatch/propagation不唯一 | fail-fast；zero first accepted write | critical entry/integration | catalog totality |
| `CFG-FAIL-11` | Consumer producer/schema binding不完整 | decode/write authority不成立 | entry fail-fast；I05 affected保持不激活 | critical entry | 9 Consumer registration matrix |
| `CFG-FAIL-12` | registrar Nth prepare/arm失败 | partial active root风险 | revoke/join全部；`EntryBindingIncomplete` | required entry | deterministic barrier injection |
| `CFG-FAIL-13` | optional exact adapter explicit Disabled | exact surface不可调用 | formal disabled/unavailable；无fake/no-op success | info/operator inventory | disabled parity |
| `CFG-FAIL-14` | post-assembly exact dependencyUnavailable | one surface受影响 | typed unavailable/degraded；无关truth继续 | warn per requiredness | availability transition |
| `CFG-FAIL-15` | commit outcome unknown | accepted certainty未知 | probe reservation/result；仍未知manual/no ack | critical consistency | UoW commit unknown |
| `CFG-FAIL-16` | external outcome Unknown/Unsupported | duplicate effect风险 | retain intent/token；same-token probe/manual；no blind retry | critical integration | publisher/handoff/export probe |
| `CFG-FAIL-17` | activation ownership unknown/partial | duplicate/zero admission风险 | stop phase；probe/reconcile；不得写activated | critical host | four-owner partial grant |
| `CFG-FAIL-18` | old drain timeout/stop unknown | process-local work不确定 | keep exact disposition；不kill并称rollback | warn/critical by work | drain barrier/timeout |
| `CFG-FAIL-19` | historical config/binding不可解析 | old durable work不能安全继续 | stop before external call；retain/manual/restore | critical recovery | restart old-binding missing |
| `CFG-FAIL-20` | migration closure缺失 | schema/digest/store兼容未知 | block candidate activation | required change gate | migration precondition |
| `CFG-FAIL-21` | active obligation阻止retirement | old reader/binding仍必需 | keep old resolution；rescan later | warn persistent | obligation scan nonzero |
| `CFG-FAIL-22` | protected prior candidate不可用/不兼容 | rollback不能执行 | rollback blocked；保持known ownership | critical incident | prior candidate validation |
| `CFG-FAIL-23` | authoritative config audit不可写 | change/activation不可审计 | stop before ownership mutation | critical control plane | audit precondition fault |
| `CFG-FAIL-24` | telemetry sink失败/递归 | runtime signal缺失 | suppress recursion；business outcome不变 | host-local safe counter only | sink failure non-authority |
| `CFG-FAIL-25` | target repo/environment/provider未建立 | implementation无法验证 | boundary remains blocked/not-evaluated | planning gate | reality precondition audit |

## 9. Step10 lifecycle handoff闭合

| Handoff ID | Impact | Current system behavior | Operator surface / alert | Planned test cut |
|---|---|---|---|---|
| `CFG-FH-01 candidate_rejected` | new configuration不可构造 | stop beforeprocess/ownership；cleanup；old lifecycle unchanged | finite stage + safe issue；required startup/change failure | invalid source/field/identity corpus |
| `CFG-FH-02 assembly_unavailable` | dependency/root不完整 | complete-or-error；zero exposed façade/entry | exact family/phase + safe issue；required owner attention | stage5~13 failpoints |
| `CFG-FH-03 activation_indeterminate` | admission owner未知 | freeze switch；probe four owners；manual reconcile | critical ownership incident；不得猜old/new | partial close/grant/probe |
| `CFG-FH-04 drain_incomplete` | old process-local work未排空 | no new old admission；preserve durable work；controlled wait/manual | bounded category/count only | deterministic drain barrier |
| `CFG-FH-05 historical_unavailable` | old Job/outbox/intent无法安全恢复 | stop call/finalize；retain material；restore exact reader/binding | critical recovery, no full binding ref | restart/rotation missing history |
| `CFG-FH-06 migration_or_retirement_blocked` | compatibility/obligation未闭合 | do not activate/retire；keep old reader/binding | persistent blocked signal + scheduled recheck contract | nonzero obligation/missing migration |

`CFG-FH-*`仍是文档handoff ID，不是代码enum、metric label或business state。

## 10. 23配置域失效与降级矩阵

| Domain | Primary failure | Disposition | 允许的degraded / continue | 禁止fallback | Planned cut |
|---|---|---|---|---|---|
| `CFG-D01` source acquisition | selected source missing/unknown/incoherent | fail-fast | none for new candidate | lower source after invalid winner、remote cache | source capture |
| `CFG-D02` config identity | semantic identity drift/collision | fail-fast/block migration | old stored identity remains immutable | random/path/time identity、reinterpret old | identity corpus |
| `CFG-D03` runtime/technical | profile/mode/ref/constructor invalid | fail-fast | optional exact adapter only ifformal Disabled | first adapter、RuntimeLike fake | profile matrix |
| `CFG-D04` protocol boundary | limit/schema invalid | fail-fast;runtime request reject ifover hard cap | request may only narrowformal hard cap | truncate、fallback schema | limit/schema corpus |
| `CFG-D05` entry/schedule | mapping/registrar/ownership incomplete | fail-fast or activation indeterminate | disabled exact entry only | partial root、route family guess | registration barrier |
| `CFG-D06` redaction/body-free | policy missing/unavailable/bypass | fail-closed/fail-fast | none | raw serialization、old hot policy | redaction fault |
| `CFG-D07` correlation/visibility | policy/allowlist invalid | fail-fast/fail-closed | formal NotVisible/Degraded only | default truth、high-card label | mapper matrix |
| `CFG-D08` atomic observation/idempotency store | atomicity/schema unavailable | fail-fast | none foraccepted write | best effort/InMemory RuntimeLike | UoW conformance |
| `CFG-D09` projection store | unavailable/mismatch | required startup fail or typed stale/unavailable per surface | existing old projection may remain stale | false Fresh/inline repair | projection fault |
| `CFG-D10` Job/report store | claim/fence/report capability missing | enabled Job fail-fast | disabled Job;existing durable Job manual ifhistory missing | process lock/fake report | Job store conformance |
| `CFG-D11` transaction/schema | timeout/revision mismatch | fail-fast/commit unknown | timeout may yieldindeterminate only | timeout=rollback proof、auto migration | transaction faults |
| `CFG-D12` digest | writer/reader incompatible | fail-fast/block retirement/manual old read | dual-read duringformal migration | recompute old digest、drop in-use reader | digest corpus |
| `CFG-D13` technical retention | duration/window invalid or active obligation | fail-fast/block cleanup | keep material longer | delete active/unresolved、source cleanup | retention guard |
| `CFG-D14` projection/freshness | overflow/policy unavailable | whole boundary fail/typed unavailable | old view remains stale/degraded | partial Fresh/default summary | planner overflow |
| `CFG-D15` claim/concurrency/budget | lease/fence/limit invalid | fail-fast/item conflict/manual | bounded lower parallelism only vianew snapshot | hot reread/process lock/stale success | claim/fence faults |
| `CFG-D16` retry | invalid budget/capability/unknown branch | fail-fast or manual | zero additional attempts | provider retry/blind retry/reset budget | retry table |
| `CFG-D17` resolvers | disabled/unavailable/invalid response | formal SafeResolution unavailable/blocked | operation-specific delayed/degraded | body/default truth/alternate resolver | resolver outcomes |
| `CFG-D18` publication | target missing/outcome unknown/history missing | startup fail or retain outbox/manual | unrelated owner truth stays committed | reroute/rebuild payload/false Published | publication faults |
| `CFG-D19` handoff | target/phase/credential unknown | block exact handoff/manual | core observation truth unaffected | receipt=signoff、switch target/token | handoff phases |
| `CFG-D20` export | target/phase/credential unknown | isolate peripheral export/manual | core observation truth unaffected | Delivered=verdict/product truth | export phases |
| `CFG-D21` sensitive refs | selected material missing/rotation drift | fail-fast or history manual | explicit Disabled optional surface | raw env secret/cache/current credential fallback | no-output/rotation |
| `CFG-D22` lifecycle/history | ownership/drain/history/retire unknown | blocked/manual/reconcile | known active runtime continues exact lifecycle | autoLKG/current route/history rewrite | restart/activation |
| `CFG-D23` environment/view | invalid class/mode or instance absent | fail-fast/not-evaluated | contract remains defined | environment name bypass/fake evidence | environment matrix |

## 11. Affected failure register

| Affected ID | Failure behavior before closure | Alert / evidence boundary | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | I05 slot不激活；parse/UoW/ack前fail closed | safe issue only；无payload/evidence fabrication | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | binding缺失/ambiguous时startup fail或disabled | 不输出route/topic/raw event | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | J06 positive保持Blocked/manual，zero H13/result fabrication | report不得伪造Completed/evidence | open_controlled |
| `R06-F-AFFECT-UOW-01` | any stage failure rollback/不可见；commit unknown不猜 | UoW failpoint planned，非pass evidence | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | unmapped class fail closed/manual；不从message猜 | finite safe error/recovery category only | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | link不完整不调用external target | retain intent；无binding/target leak | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | Unknown保留same token并probe/manual | no blind retry metric-as-authority | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | missing same-UoW snapshot => rollback/no registration | no post-commit current rebuild | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | no ack-success；stored probe后controlled retry/manual | ack telemetry不证明completion | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | no owner => noCompleted finalize/no fake ref | report path/run placeholder无权关闭 | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | unknown/missing owner在entry前reject | no alias/default/private wrapper | inherited_affected |
| `03-RPR-S09-PER-FLOW` | exact flow未审计不得声明slice完成 | matrix/test cut不是implementation evidence | inherited_affected |

Step11关闭`0/12`。Failure strategy只规定未关闭前的安全行为，不能替代owner/schema/flow/capability真相源。

## 12. 告警、审计与真实性边界

### 12.1 Product-neutral operator signal

| Signal class | Safe minimum | Authority | Forbidden fields / claims |
|---|---|---|---|
| startup candidate failure | stage、finite error kind、config ref?、family/phase?、issue ref | host/process diagnostic only | raw value/path/env/secret、business rejection |
| runtime availability | exact family + optional safe binding scope + availability kind | availability snapshot, non-business | target/endpoint/topic、operation success |
| activation/drain | attempt/process generation refs、finite phase/result、bounded category/count | external host control plane must own authority | runtime span as activated proof |
| historical blocked | family、obligation category/count、safe issue | recovery/control plane | full binding/token/intent/report ref |
| migration/retirement blocked | finite gate/result、scan coverage/count | config control plane | acceptance verdict或automatic risk acceptance |

Alert delivery failure不得触发business retry、gap、no-write marker、outbox或self-observation recursion。真实alert producer、
landing、retention和ack由`07`/operations选择并验证；当前状态=`planned_not_implemented`。

### 12.2 Configuration failure不得写入的truth

- 不创建或修改ObservationReceipt、EvidenceLinkage、RetentionMarker、ReportHandoff、Gap、NoWriteViolation或source truth。
- 不生成Outbound Event、Job report、run id、evidence alias、acceptance result或signoff。
- 不把provider health、sink ack、config audit、availability snapshot或operator alert变成business outcome。
- 如果no-write marker自身保存失败，仍必须阻止forbidden source write；不能以“审计失败”放行。

## 13. 跨失效审计与逐域停审

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 required failure是否都有处理 | pass | `CFG-FAIL-01~12`均在exposure前stop |
| runtime optional failure是否与startup混淆 | no | Disabled、Unavailable、Misconfigured、Degraded分离 |
| high-priority invalid是否fallback | no | whole candidate reject |
| secret/provider失败是否泄漏material | no | safe issue/family/phase only |
| config center不可达是否假定cache | no | current unsupported source，直接reject |
| LKG是否被伪造 | no | prior candidate必须重新走完整rollback activation |
| activation unknown是否允许双owner | no | freeze/probe/reconcile/manual |
| drain incomplete是否kill并称成功 | no | preserve work/disposition，future authority required |
| old binding unavailable是否current fallback | no | retain/manual/restore exact history |
| migration/retirement是否可普通变更绕过 | no | blocked until Step13/`07` closure |
| telemetry/alert是否成为truth | no | host/process diagnostic only |
| 23域是否均有disposition和cut | pass | §10 exact `CFG-D01~D23` |
| 12 affected是否均传播 | pass_with_affected_open | §11；`0/12` closed |
| 是否新增`03` code contract | no | 只消费既有error/availability/recovery/flow |
| 是否伪造测试/alert/evidence | no | 全部标planned/not_implemented/not_run |

逐域停审：`CFG-D01~D23`均明确primary failure、disposition、合法degraded、forbidden fallback和planned cut；
无unresolved failure-policy conflict。Physical control plane、alerting、drain authority、historical registry和selected provider仍是
implementation precondition，不阻塞本Step设计通过。

## 14. 对详细设计的影响判定

| Step11 conclusion | 是否改变formal `03` | Current basis | Action |
|---|---|---|---|
| seven startup errors exact reuse | no | §5.4/§11/§13.8 | no writeback |
| availability four-way distinction | no | §13.6/§13.9 | no writeback |
| candidate fail-fast/zero partial root | no | §13.8 | no writeback |
| commit/external unknown -> probe/manual | no | §11/§12 | no writeback |
| config lifecycle FH-01~06 | no code type | current Step10 document handoff | keep document-only IDs |
| operator signal required | no,producer未选 | §14 safe runtime telemetry + external control-plane authority | `07` reality mapping |
| drain force-stop/cancel policy | not defined | formal has no generic force-stop authority | remain open;do not invent |
| config center/LKG/hot reload | unsupported | §13 immutable cold assembly | future request reopens `03/04` |

Current没有新增struct/enum/trait/function/error/store/UoW/business state。若实现需要durable local config-failure audit、
public drift API、hot reload、force-stop authority或new error carrier，必须回写owning DDD Step与formal `03`后重审本Step。

## 15. Formal `04` §11回填草稿

```markdown
## 11. 失效模式与降级 / fail-fast策略

L4-observability配置采用complete-or-error。Selected source、schema、required field、range、cross-field、profile、
identity、sensitive reference、store capability、adapter descriptor、catalog totality或entry registration任一失败，
都在new runtime exposure前fail-fast；不得fallback低优先级值、Fake/InMemory、default route、另一个target或partial root。

`Disabled`是optional surface的显式配置，`Unavailable`是运行时能力缺失，`Misconfigured`是声明与事实不一致，
`Degraded`只表示formal允许的受限surface；四者都不等于业务success。Commit或external outcome unknown时保留
reservation/result/intent/token并probe/manual，不blind retry。Activation ownership不确定时停止切换并reconcile；
historical binding不可恢复时保留durable material并manual restore，禁止current route fallback。

<失效模式总表、lifecycle handoff和23域摘要由Step15从本产物装配>
```

正式装配必须保留：seven errors、four availability、no automatic LKG、six lifecycle handoffs、historical no-current-fallback、
telemetry non-authority和12 affected未关闭事实。

## 16. Downstream handoff与open material

| Downstream | 本Step提供 | 下游必须补齐 | 禁止声明 |
|---|---|---|---|
| Step12 | `CFG-FAIL-01~25`、FH-01~06、23域、12 affected | 测试/验收/实施/运维责任矩阵 | downstream已ready |
| current `05` | planned failure cuts、fault/barrier/spies需求 | suite/case/fixture/environment/command/artifact schema | test executed/pass |
| current `06` | fail-fast/no-fallback/unknown/manual/history VETO输入 | AC/VETO/evidence/reviewer/verdict规则 | acceptance pass/signoff |
| current `07` | control plane/host/alert/provider/history/drain/migration preconditions | phase/boundary/spike/rollback与implementation assets | implementation commit/ready |
| operations | concrete source/provider/alert/drain/restore/runbook | product、actor、command、retention、incident procedure | design doc proves operation |

| Open material | Status | Blocking scope | Required closure |
|---|---|---|---|
| selected provider/store/transport/scheduler | `not_selected` | corresponding RuntimeLike boundary | `07` reality/spike before implementation |
| config control-plane/audit/alert landing | `not_selected` | real auditable activation/alert | `07` + operations |
| drain timeout/cancel/force-stop authority | `not_defined` | incomplete drain disposition implementation | `07`/operations;return `03` ifnew code authority |
| historical registry/restore path | `not_selected` | old effect recovery/retirement | `07` boundary |
| real environment/target repo/tests | `not_established/not_run` | implementation/acceptance | current `05~07` + execution |

## 17. 自检与完成门禁

| 检查项 | 状态 | 证据 |
|---|---|---|
| SOP五问逐项回答 | pass | §4.1~§4.5 |
| required五列表 | pass | §8 `CFG-FAIL-01~25` |
| seven startup errors无扩展 | pass | §7.1 exact 7 |
| availability/Disabled不混淆 | pass | §7.2/§6 |
| FH-01~06全部消费 | pass | §9 exact 6 |
| CFG-D01~D23全部失效闭口 | pass | §10 exact 23 |
| 12 affected全部传播 | pass_with_affected_open | §11 exact 12，closed=0 |
| high-risk silent fallback | none | §6~§13 |
| LKG/config center/hot reload truthfulness | pass | unsupported，未伪造 |
| telemetry/alert non-authority | pass | §12 |
| `03`影响 | no_writeback | §14 |
| formal `04` | not modified | Step15 only |
| code/test/commit/run/evidence/signoff | none fabricated | all planned/not_selected/not_run |

| Gate | Current status | Reason / next action |
|---|---|---|
| Step11 input gate | pass | standards、current Step05/07/09/10、formal `03`已读取 |
| Step11 content gate | `pass_consumed_by_step_12` | P0 failure、23域、affected、truthfulness完整 |
| upstream blocker | none_new | I05/H13/inherited affected保持开放 |
| formal `04` gate | blocked | only Step15 may assemble |
| implementation readiness | blocked | current `04~07`、target/provider/tests/evidence未完成 |
| next_allowed_action | `continue_to_current_step_12_under_continuous_M4_authorization` | 按SOP进入Step12，不跳到formal装配 |
