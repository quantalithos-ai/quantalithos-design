# L4-sandbox 实施计划 Step 8 配置与Material反查分件

> 主件: `07_implementation_plan_step_08_config_environment_dependencies.md`
> 配置真相源: `projects/L4-sandbox/04-配置设计.md` §3~§12
> 用途: Step 8 supporting register;供Step 13装配正式`07` §8与32件planned boundary skeleton引用
> 创建日期: 2026-07-17
> 状态: completed_supporting_register
> 事实边界: 本文件只分配实施准备owner与检查,不重定义配置schema / material产品,不声明实现、provider、environment、run或evidence已存在。

---

## 1. 权威与机械覆盖规则

| 集合 | 权威入口 | 本分件必须证明 | 禁止替代 |
|---|---|---|---|
| S00~S08 | 正式`04`§5 | source lane、使用profile与失败处理均有实施owner | 自创env / CLI override |
| 40配置组 / I001~I101 | 正式`04`§7 / §12.11 | 40行不重不漏,Item并集恰好101项 | 只写“实现配置”或抽样字段 |
| D01~D44 | 正式`04`§3~§6 / §9 / §12.11.1 | 44域各有首个owner、激活检查和失败动作 | 以配置组覆盖代替domain行为 |
| SBX-MC-01~10 | 正式`04`§8.4 | material class与consumer不混层 | provider payload schema |
| 23 material-capable item slot | 正式`04`§8.6 | item、class、consumer、profile、boundary与不可用动作闭合 | raw material、full ref或共享lease |

若实现需要新增 /删除 /重命名item,改变type /default /required /source /scope /failure,或给D44增加current key,必须`wait_design`回写正式`04`;若同时改变public carrier /port /flow,先回写正式`03`。

## 2. S00~S08实施准备矩阵

| Source | 当前语义 | 首个实施owner | 允许Profile | 激活检查 | 失败 /越界动作 |
|---|---|---|---|---|---|
| S00 static design boundary | 非loadable source;NCFG /truth invariant | 03A validator negative | 全部 | NCFG-01~24和CAT-00不可覆盖 | validation reject + `wait_design` |
| S01 code defaults | ordinary layer 10 safe baseline | 03A | P01~07,但P05+仅strict /disabled | default自身合法;real-like无fake fallback | design /startup failure |
| S02 selected project JSON | ordinary layer 20,单一完整文档 | 03A | P01 optional;P02~07按profile | explicit source可读、strict parse、无duplicate /unknown | fail-fast;不得换文件 /S01 fallback |
| S03 allowlisted env | ordinary layer 30 | 03A | 各profile仅allowlisted scalar /opaque ref | present-invalid拒绝;无结构化body /raw material | fail-fast;不得fallback低层 |
| S04 secure material | 独立secure lane | 03B descriptor;13A真实binding | P05 /P06;P07 future | validated opaque ref、class、consumer、provider audit | required binding Blocked /fail-closed;无raw /fake fallback |
| S05 typed local selector | scoped entry /loop /job lane | 03A schema;03B scoped builder | P01~06受registry /ceiling约束;P07 future | 只收窄current unit,不改global /NCFG | current invocation reject;不clamp |
| S06 deterministic fixture | isolated fixture lane | 02B harness;03B registry | P01~04 only | fixture-owned slot、parity、run isolation | test fail-fast;P05+ profile reject |
| S07 remote config | current unsupported | 03A absence check;14A scope gate | none | declaration /endpoint /overlay均 absent | NCFG-24 + DesignReopen |
| S08 admin /emergency override | current unsupported | 03A absence check;14A scope gate | none | override /break-glass source均 absent | NCFG-24 + DesignReopen |

## 3. 40配置组 / I001~I101实施Owner矩阵

`First owner`表示首次把正式字段契约落为typed config / registry / builder的boundary;`Affected boundary`表示首次消费该配置语义的业务或门禁boundary。任何后序修改仍需读正式`04`对应组,不能只读本表。

| # | 配置组 / Item闭集 | First owner | 主要Affected boundary /环境 | Activation /检查 |
|---:|---|---|---|---|
| 1 | `configIdentity` I001 | 03A /03B | 全部runtime;13A identity;ENV-01~06 | exact profile、redacted config identity、inactive /incomplete拒绝 |
| 2 | `entryEnvelope` I002~I006 | 03A /03B | 04B /09B;ENV-01~03 | global ceiling、safe /quiet、S05不越界 |
| 3 | `workerEnvelope` I007~I009 | 03A /03B | 07A /08A /10A /10B | new-loop snapshot、batch /parallelism /timeout与failure receipt |
| 4 | `jobEnvelope` I010~I013 | 03A /03B | 11A~11C;ENV-04 | typed job input、ceiling、retry不改idempotency |
| 5 | `featureAssembly` I014~I016 | 03A /03B | 10B /11C | FC-01~06 complete dependency;disabled不删既有truth |
| 6 | `truthStore` I017 | 03A /03B | 02B、04B~12B | UoW /audit能力;P05+无memory fallback |
| 7 | `projectionStore` I018 | 03A /03B | 09B /11C | query degraded /no-write;real-like parity conditional |
| 8 | `derivedStore` I019 | 03A /03B | 09B /11C | 不fallback truth store;derived不升格truth |
| 9 | `referenceStore` I020 | 03A /03B | 04B /09B /10A /11B | body-free;unavailable不保存 /猜external truth |
| 10 | `relayStore` I021 | 03A /03B | 04B /10B /11B | I014启用时required;publish失败no rollback |
| 11 | `replayStore` I022 | 02B semantic kernel;03A /03B config | 全部Command /Consumer /Job | duplicate replay stored surface;missing不得重算 |
| 12 | `replayLifecycle` I023~I027 | 03A /03B | 04B~12B | retention cross-field;不从数值推导test artifact TTL |
| 13 | `contextSource` I028~I030 | 03A /03B | 04B /10A /11B | body-free、freshness /timeout formal mapping |
| 14 | `policySource` I031~I034 | 03A /03B | 06B /07A | missing /stale /conflict /timeout fail-closed |
| 15 | `backendCapability` I035~I038 | 03A /03B | 05B /11B /13A | P0-C fake parity;P0-Q candidate exact identity |
| 16 | `boundaryEnforcement` I039~I040 | 03A /03B | 05A /05B /13B | resource /fs /network /process同代完整,无partial |
| 17 | `isolationBackend` I041~I043 | 03A /03B | 05B /07A /08B /13A~13B | P01~04 non-executing;P05 candidate-real;无host fallback |
| 18 | `executionCapture` I044~I048 | 03A /03B | 07B /13B | bounded class、partial /failed诚实、obs enablement完整 |
| 19 | `inboundEvents` I049 | 03A /03B | 10A /12B | 9-key closed binding、schema、source /quarantine和S05 registry |
| 20 | `eventPublisher` I050 | 03A /03B | 10B /11B | enabled availability、typed outcome、no source rollback |
| 21 | `eventRoutes` I051 | 03A /03B | 10B /14A | 13-key closed map、active coverage、无raw topic合成 |
| 22 | `eventRelay` I052~I054 | 03A /03B | 10B /11B | bounded batch、retry /timeout、stored payload不重建 |
| 23 | `materialHandoff` I055~I056 | 03A /03B | 07C /11B /13B | target registry /class、receipt不升格Artifact truth |
| 24 | `observabilityHandoff` I057~I058 | 03A /03B | 07B /11B /13B | I048双向完整、target safe、formal audit独立 |
| 25 | `investigationHandoff` I059~I060 | 03A /03B | 08B /11C /13B | I074双向完整、receipt不得解除containment |
| 26 | `handoffDelivery` I061~I064 | 03A /03B | 07C /11B | retry /retention /timeout /batch,no rollback |
| 27 | `leaseSafety` I065~I067 | 03A /03B | 05B /07A /08B /11C /13B | I065在boundary establishment消费;run只读persisted window |
| 28 | `cleanupSafety` I068~I070 | 03A /03B | 08B /11C /13B | evidence /investigation /redline guard;无force-clean |
| 29 | `backendRelease` I071~I073 | 03A /03B | 08B /11C /13B | null仅复用I041 capability;non-Allowed call=0 |
| 30 | `redlineSafety` I074~I075 | 03A /03B | 08B /11C /13B | containment始终active;handoff optional但非advisory |
| 31 | `referenceRefresh` I076~I078 | 03A /03B | 11B | body-free、bounded、manual-only不伪调度 |
| 32 | `projectionMaintenance` I079~I081 | 03A /03B | 09B /11C | query no-write;job从committed source rebuild |
| 33 | `derivedMaintenance` I082~I084 | 03A /03B | 09B /11C | registered scope、bounded、no truth promotion |
| 34 | `reconciliationMaintenance` I085 | 03A /03B | 09B /11C | finding only、no auto-fix、partial report诚实 |
| 35 | `runtimeTelemetry` I086~I090 | 03A /03B | 04B~14C横切 | safe local保持、external sink可degraded、low-cardinality |
| 36 | `auditTrace` I091 | 03A /03B | 所有accepted mutation | truth same-UoW mandatory;provider audit不替代formal audit |
| 37 | `diagnostics` I092~I093 | 03A /03B | 全entry /script /report | 仅safe /quiet;无external raw surface或未授权TTL |
| 38 | `safeOutput` I094~I095 | 03A /03B | 全boundary;02D /12B /14A检查 | 17-class deny floor只可增强;all-carrier scan |
| 39 | `deterministicAdapters` I096~I097 | 02B fake;03A /03B config | ENV-01~04 /12B | fixed clock /id;P05+无fixture override |
| 40 | `testFixtures` I098~I101 | 02B harness;03A /03B registry | ENV-02 /04;全部P0-C negative | run-isolated、registered scenario、P05~07 reject |

覆盖判定:

```text
group_count = 40_of_40
item_union = I001..I101
item_count = 101_of_101
duplicate_item_owner = 0
unowned_item = 0
schema_truth_source = formal_04_only
```

## 4. D01~D44实施准备反查

| Domain | 首个实施owner | 主要消费boundary | 必查不变量 /准备 | 不可用 /冲突 |
|---|---|---|---|---|
| D01 config source intake | 03A | 03A /03B | 单一raw owner、single S02、S01 < S02 < S03、S07 /S08 absent | fail-fast;第二loader为`wait_design` |
| D02 runtime profile /identity | 03A /03B | 全部;13A | exact profile、redacted identity、same generation | profile reject /zero publication |
| D03 startup validation | 03A | 03A /03B | V01~V10、NCFG、FC、XVAL、safe issue | invalid发布0 handle |
| D04 runtime builder /registry | 03B | 03B+ | complete registry、availability、same-generation atomic publication | partial /mixed generation reject |
| D05 sync API envelope | 03A /03B | 04B /09B | typed ceiling、safe diagnostics、query no-write | current entry reject;不clamp |
| D06 worker envelope | 03A /03B | 07A /08A /10A /10B | new-loop snapshot、bounded batch /parallelism | loop不启动 /item formal failure |
| D07 job envelope | 03A /03B | 11A~11C | typed job、retry /retention、stored report | job reject /honest partial |
| D08 feature assembly | 03A /03B | 10B /11C | enabled dependency closure和FC-01~06 | startup reject;不silent disable |
| D09 truth /audit /UoW store | 02B /03B | all mutation | store + UoW + mandatory audit同闭包 | accepted mutation不得开始 |
| D10 projection /derived store | 03B | 09B /11C | read degraded、maintenance no truth fallback | profile unqualified /degraded read |
| D11 reference store | 03B | 04B /09B /10A /11B | body-free ref /summary /freshness | unresolved /degraded;不保存body |
| D12 relay store | 03B | 04B /10B /11B | stored payload /relay fact、source no rollback | enabled时startup reject |
| D13 replay /stored surface | 02B /03B | Commands /Consumers /Jobs | three-channel key、retention relation、stored replay | no mutation /duplicate不重算 |
| D14 context source | 03B | 04B /10A /11B | body-free controlled source、freshness、timeout | delayed /unresolved;不造truth |
| D15 policy source | 03B | 06B /07A | one-shot snapshot、high-risk strict、fail-closed | non-Allowed /0 launch |
| D16 backend capability | 03B | 05B /11B /13A | capability registry /freshness /candidate identity | boundary reject /Blocked |
| D17 coherent boundary | 03B | 05A /05B /13B | resource /filesystem /network /process + workspace requirement完整同代 | partial /unsupported reject;no weak fallback |
| D18 backend lifecycle | 03B | 05B /07A /08B /13A~13B | establish /launch /inspect /release typed adapter | P0-C fake;P0-Q missing Blocked /0 launch |
| D19 execution capture | 03B | 07B /13B | adapter /size /material class /timeout /obs enablement | `Unavailable/Failed/Partial`;不伪Complete |
| D20 handle /lease consumption | 03B | 05B /07A /08B /11C | establishment消费I065并persist window;exact handle /lease reads | run不得重算;inactive /expired 0 launch |
| D21 inbound subscription | 03B | 10A | 9-key map、schema /source /quarantine /dedup | loop reject或quarantine;不造success |
| D22 publisher | 03B | 10B /11B | feature dependency、typed outcome、availability | fail /retry /dead-letter;no rollback |
| D23 route binding | 03B | 10B /14A | 13-key closed map、active group coverage | startup reject;无ad hoc topic |
| D24 relay delivery | 03B | 10B /11B | bounded batch、retry /timeout、immutable stored payload | formal retry /failed;不重建payload |
| D25 material handoff | 03B | 07C /11B /13B | class /adapter /target /receipt identity | retryable /failed;不升格Artifact truth |
| D26 observability handoff | 03B | 07B /11B /13B | target /redaction、formal audit独立 | handoff degraded;不关audit |
| D27 investigation handoff | 03B | 08B /11C /13B | containment target、receipt no-release | pending /contained |
| D28 handoff retry | 03B | 07C /11B | retry /retention /timeout /batch和old fact immutable | current job reject /partial |
| D29 lease /orphan | 03B | 08B /11C /13B | persisted expiry、inspect-only、cadence /batch | orphan保持blocked;不delete |
| D30 cleanup guard | 03B | 08B /11C /13B | evidence /handoff /investigation /redline guard-first | default Blocked;no force-clean |
| D31 backend release | 03B | 08B /11C /13B | optional override /I041 reuse、retry、timeout | non-Allowed call=0;failure保留orphan |
| D32 redline | 03B | 08B /11C /13B | containment always active;handoff optional;safe escalation | Contained;receipt不解除guard |
| D33 reference refresh | 03B | 11B | threshold /batch /cadence、body-free report | manual-only /partial;不写external truth |
| D34 projection rebuild | 03B | 09B /11C | stale /batch /cadence、committed source | query no-write;job no core repair |
| D35 derived view | 03B | 09B /11C | store /scope /feature、bounded finding | degraded /partial;不升格truth |
| D36 reconciliation | 03B | 09B /11C | read /job /report closure、optional event | finding only;no auto-fix |
| D37 runtime log /metric | 03B | 横切 | safe local、sampling /label policy、optional sink degraded | external degraded;formal audit保持 |
| D38 audit /trace | 03B | all mutation | mandatory route、same-UoW、safe fields | 无audit不接受mutation |
| D39 diagnostic issue | 03B | all entry /jobs /scripts | safe /quiet、surface /retention、store前signal | unsafe output reject |
| D40 redaction gate | 03A /03B | all;02D /12B /14A | mandatory profile、17-class floor、all-carrier scan | startup /check Failed |
| D41 profile composition | 03A /03B | all ENV;13A | exact source /adapter /workload /material eligibility | profile reject;资格不传递 |
| D42 deterministic fixture | 02B /03B | ENV-01~04 /12B | clock /id /store /adapter /scenario配对 | test fail-fast;P05+ reject |
| D43 real-like composition | 03B schema;13A /future P1 activation | 13A~13B /future P1 | P05 /P06 complete binding;P07 inactive | missing -> Blocked /NotRunConditional /DesignReopen |
| D44 overlay /reload trigger | 03A absence;14A scope | none current | no key、no source、no remote /admin /reload /LKG /hot | NCFG-24 + `wait_design` |

```text
domain_count = 44_of_44
unowned_domain = 0
D43_current_raw_key = none_by_design
D44_current_implementation = forbidden
```

## 5. SBX-MC-01~10与23个Material Slot反查

### 5.1 Material class实施边界

| Class | Consumer闭集 | 首个descriptor owner | P05+资格检查 | 禁止 |
|---|---|---|---|---|
| SBX-MC-01 StoreAccessMaterial | six logical store adapters | 03B | per-store least privilege /audit /lease | DSN /password进入config /store row |
| SBX-MC-02 ContextResolverAccessMaterial | context resolver | 03B | body-free response与provider audit | identity /work正文 |
| SBX-MC-03 PolicyCapabilityAccessMaterial | policy /capability adapters | 03B | fail-closed、no policy body、class isolation | allowlist /approval truth |
| SBX-MC-04 IsolationBackendControlMaterial | isolation /release adapters | 03B;13A real binding | candidate identity、principal、no workload exposure | root credential /host fallback |
| SBX-MC-05 ExecutionCaptureAccessMaterial | capture adapter | 03B;13A real binding | body-free ref与capture separation | process output /credential混存 |
| SBX-MC-06 InboundSourceAccessMaterial | consumer source /quarantine adapters | 03B | each enabled binding独立slot | payload /topic /dedup body |
| SBX-MC-07 EventTransportAccessMaterial | publisher /route adapters | 03B | active route coverage与no rollback | raw topic /endpoint /response |
| SBX-MC-08 MaterialHandoffAccessMaterial | material handoff /target adapters | 03B | target class /receipt /provider audit | artifact /evidence truth promotion |
| SBX-MC-09 ObservabilityInvestigationAccessMaterial | obs /investigation adapters /targets | 03B | safe target、containment guard | ledger /investigation body;receipt release |
| SBX-MC-10 TelemetrySinkAccessMaterial | infra-private log /metric sink | 03B | low-cardinality、audit independence | credential作为log field /label |

### 5.2 23个Material-capable item slot

| # | Item / slot | Class | Consumer | 激活Profile / boundary | 不可用 /不匹配 |
|---:|---|---|---|---|---|
| 1 | I017 truth store | MC-01 | truth store /UoW | real binding P05+;03B /13A | startup fail-fast;accepted mutation=0 |
| 2 | I018 projection store | MC-01 | projection store | P05+ when real;03B /future P1 | profile unqualified;无memory fallback |
| 3 | I019 derived store | MC-01 | derived /reconciliation store | P05+ when real;03B /future P1 | startup fail-fast;不fallback truth store |
| 4 | I020 reference store | MC-01 | reference store | P05+ when real;03B /future P1 | unavailable /degraded;不保存body |
| 5 | I021 relay store | MC-01 | relay store | I014 + real binding;03B /future P1 | startup fail-fast;source no rollback |
| 6 | I022 replay store | MC-01 | idempotency /result /receipt /report | real binding P05+;03B /future P1 | startup fail-fast;duplicate不重算 |
| 7 | I028 context source | MC-02 | context resolver | real resolver P05+;03B /future P1 | unresolved /unavailable;无fake fallback |
| 8 | I031 policy source | MC-03 | policy adapter | real policy P05+;03B /future P1 | fail-closed |
| 9 | I035 capability source | MC-03 | backend capability adapter | P05 candidate;13A | profile Blocked /boundary reject |
| 10 | I041 isolation backend | MC-04 | isolation backend | P05 candidate;13A /13B | Blocked;0 launch;无host fallback |
| 11 | I044 execution capture | MC-05 | capture adapter | P05 candidate;13A /13B | capture Unavailable /Failed;不伪success |
| 12 | I049 inbound bindings | MC-06 | each source /quarantine adapter | enabled real entry P06;future P1 | loop不注册 /quarantine;无fixture fallback |
| 13 | I050 event publisher | MC-07 | publisher | I014 + real P06;future P1 | startup fail-fast;runtime no rollback |
| 14 | I051 event routes | MC-07 | each route adapter | active real route P06;future P1 | active group缺slot startup fail-fast |
| 15 | I055 material handoff adapter | MC-08 | handoff adapter | real target P05 /P06;13B /future P1 | startup fail-fast /retryable failed |
| 16 | I056 material targets | MC-08 | each target adapter | active target P05 /P06;13B /future P1 | target reject;receipt不升格truth |
| 17 | I057 observability adapter | MC-09 | obs handoff adapter | I048 + real P05 /P06;13B /future P1 | handoff degraded;formal audit不变 |
| 18 | I058 observability targets | MC-09 | each obs target | I048 + active target;13B /future P1 | startup fail-fast;不保存ledger body |
| 19 | I059 investigation adapter | MC-09 | investigation handoff | I074 + real P05 /P06;13B /future P1 | pending /contained |
| 20 | I060 investigation targets | MC-09 | each investigation target | I074 + active target;13B /future P1 | receipt不得解除guard |
| 21 | I071 backend release | MC-04 | release adapter | real override P05+;13A /13B | release unavailable;orphan remains Blocked |
| 22 | I086 log sink | MC-10 | infra-private log sink | external sink P05 /P06 as selected | safe local remains;external degraded |
| 23 | I087 metric sink | MC-10 | infra-private metric sink | external sink P05 /P06 as selected | degraded;formal audit /truth不变 |

Slot cardinality仍以正式`04`§8.6为准: I049最多18、I051最多13、I056 /058 /060各最多16,其余每item最多1。上述23行是material-capable item owner数,不是runtime实际slot实例数;当前实际provider /slot实例为0。

### 5.3 Provider资格与生命周期门禁

| Gate | 必需内容 | Owner /关闭点 | 未关闭动作 |
|---|---|---|---|
| descriptor | owner item、binding family、selected ref内存关联、class、predicate、consumer、provider marker、lease policy、audit=true | 03B synthetic registry | descriptor不完整则generation发布0 |
| provider selection | 产品、principal class、least privilege、native audit、expiry /version、release | 13A Activation /security owner | P05 Blocked |
| resolve outcome | Resolved /Unavailable /Denied /TypeMismatch /Expired /Revoked /AuditUnavailable /ProviderError closed set | 03B fake;13A real adapter | unknown不得猜测;fail-closed |
| lease | constructor-only或经批准adapter-bounded;per-slot /consumer | 03B;13A qualification | 无unbounded /shared decrypted cache |
| rotation | new ref或same-ref version均形成new generation;旧结果immutable | future config change /Step 10 | 禁止partial hot swap /LKG伪装 |
| revoke | stop-new-use;existing runtime经正式termination /restart收束 | provider +adapter /operations | 无silent continue /fake fallback |
| shutdown release | provider release有safe disposition | 13B /future operations | failure保留并阻止lease复用 |
| output scan | config /log /metric /audit /report /artifact /error /workload全载体 | 02D最小;12B /13B /14A完整 | unsafe finding阻断commit /source |

## 6. 配置 / Material反查结论

| 审计项 | 结论 | 说明 |
|---|---|---|
| S00~S08 | 9 /9 covered | S07 /S08明确current unsupported |
| 40配置组 | 40 /40 covered | 名称 /顺序与正式`04`一致 |
| I001~I101 | 101 /101 covered | 连续并集,无duplicate /orphan |
| D01~D44 | 44 /44 covered | D43资格与D44 absence单独覆盖 |
| Material class | 10 /10 covered | consumer闭集不混层 |
| Material-capable item | 23 /23 covered | 当前0真实slot /provider实例 |
| P01~P04真实S04调用 | forbidden | synthetic marker /outcome only |
| P05 fake /S06 fallback | forbidden | missing保持Blocked +0 launch |
| raw material输出 | forbidden | 不进入任何正式carrier /artifact /report |
| 是否新增配置语义 | no | 全部回指正式`04` |
