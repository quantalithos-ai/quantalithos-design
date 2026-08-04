# L4-observability 04-配置设计 Step 04 · 定义配置分类与禁止配置化边界

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节: `04-配置设计.md` §4
> 当前模式: `full-restart`
> 本步边界: 分类current配置、固定更新时机、逐域绑定禁止项；不定义source precedence、raw key、exact value、environment profile、secret provider、加载函数、产品或部署命令

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 04 `定义配置分类与禁止配置化边界` |
| 当前模块 | `category-update-forbidden-boundary` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_04_categories_boundaries.md` |
| 用户确认 | Step03 current复核已通过；用户于2026-08-02授权连续完成全部M4 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_05` |
| gate_reason | 九个SOP问题、5个主类别+2个约束属性+1个明确不适用类、更新时机、24组禁止项、23域分类边界、逐域停审、跨分类/VETO审计和`03`影响均闭合，并已按最终M3传播12项affected |
| blocker | `none` |
| next_allowed_action | `continue_to_current_step_05_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step01~03 | §3输入 | done | recovery point与用户确认一致 |
| 读取SOP Step04、书写规范§5.4及current红线 | §3输入 | done | truth/safety/state/UoW/audit/idempotency材料完整 |
| 回答九个SOP问题 | §4 | done | category、hot/cold、forbidden与逐域适用性均有结论 |
| 先从current `03`生效边界建立分类 | §6~§8.2 | done | 不复制L1不存在的entry-local/debug假设 |
| 后置审计旧Step04与L1参考 | §5~§6 | done | historical schema与自动门禁不进入current truth |
| 建立禁止项及设计回退路径 | §8.3 | done | 每项回指requirement/architecture/DDD owner |
| 完成23域分类、停审与跨分类审计 | §8.4~§8.7 | done | 类别/更新/禁止项无unresolved conflict |
| 形成formal §4草稿、影响判定与自检 | §9~§12 | done | formal正文仍未修改，等待Step05确认 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step04中间产物全量重建；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step03 pass，用户已确认Step04 |
| 文档级门禁 | pass_for_current_step；flow允许Step04，不允许Step05 |
| Step思考状态 | done；先读current source与L1粒度，再读old Step04差异审计 |
| 正式正文污染 | no；old formal `04`继续是historical material |
| 越过未来Step | no；不锁定Step05 priority、Step06 profile、Step07 key/value或Step08 provider |
| `03`静默扩展 | no；不新增hot reload、entry-local args、debug field、root section或feature enum |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 给current root config建立有限且可判定的类别词表，明确主类别与约束属性，避免把运行参数、domain policy、secret和test fixture混成“配置”。
2. 明确startup/new assembly、entry registration、accepted Job start snapshot与old execution之间的生效边界。
3. 明确current不支持in-place hot update，并区分“新assembly使用新值”与“旧Job继续使用snapshot”。
4. 把requirement VETO、架构红线和formal `03`状态/事务/审计/幂等不变量转为可执行禁止配置化项。
5. 为每个禁止项给出正式设计变更路径，不允许以配置审批代替设计变更。
6. 对Step03全部23个配置域标注适用类别、不适用类别、更新时机与禁止项。
7. 审计P1实例材料是否污染P0语义，以及同一行为在不同域是否分类不一致。

### 2.2 本步非目标

- 不命名JSON key、env var、CLI flag、文件路径、topic、route、endpoint、secret key或schedule key。
- 不决定code/file/env的最终priority、冲突处理和source unavailable策略。
- 不给duration、limit、retention、retry、lease、batch、timeout、freshness或SLO具体值。
- 不定义actual environment / deployment profile名称或矩阵。
- 不选择secret provider、store、broker、telemetry、scheduler、archive、GRC、dashboard或APM产品。
- 不定义loader、validator、activation、drain、rollback、LKG或audit record的具体算法。
- 不新增entry-local override。未来若binary需要CLI/env参数，必须先有正式arg schema，不能由本Step预留。
- 不把domain policy、state、transaction、audit history、retention marker或telemetry sink当普通config category。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `配置设计讨论流程_SOP.md` Step04 | current process standard | 九问、分类表、禁止表、逐域边界、停审和跨分类审计 |
| `配置设计书写规范.md` §5.4 / §6 | current writing standard | formal §4两张必备表与评审口径 |
| 通用三项设计标准与依赖裁剪规则 | current global standard | 配置不改不变量、entry arg需schema、逐Step与only-core compile edge |
| `04_config_step_01_upstream_boundary.md` | current Step01 | 配置不再回答的问题、15类输入和`03` trigger |
| `04_config_step_02_scope.md` | current Step02 | P0/P1/P2/Forbidden、无配置结论和残余风险 |
| `04_config_step_03_control_plane.md` | direct previous Step | 11控制面、23配置域、reader、owner、telemetry结论和lifecycle边界 |
| formal `00-需求文档.md` §4 / §10~§14 | current requirement baseline | truth/body-free/no-write/retention/handoff红线与`VF-OBS-001~010` |
| formal `01-架构设计.md` §3.2 / §4.3 / §8 / §9 / §13 | current architecture baseline | 数据/依赖/产品/派生/配置变更红线 |
| formal `02-概要设计.md` §11.1~§11.2 | current HLD baseline | 配置影响轮廓与21项禁止配置化边界 |
| formal `03-详细设计.md` §3.2 / §9~§14 | direct code baseline | 27状态、logical store/UoW、recovery、idempotency/fence/token、immutable root/snapshot和telemetry |
| `03_ddd_step_14_config_external_binding.md` §8.5 / §14 / §17~§18 | detailed config baseline | exact forbidden shapes、mode/capability、complete assembly、validation与activation |
| `03_ddd_step_15_observability_audit.md` §8 / §14~§16 | telemetry baseline | redaction、recursion、sink non-authority、retention/handoff/no-write边界 |
| old `04_config_step_04_categories_boundaries.md` | historical material | 后置诊断其81行schema-first、无分类/禁止/停审与自动推进问题 |
| L1-governance / L1-artifact Step04 | granularity reference | 参考分类/更新/禁止/逐域结构，不复制其entry-local/feature配置事实 |

### 3.1 分类判定原则

| 原则 | 本Step解释 |
|---|---|
| Category描述语义，不描述source | 同一startup field未来可来自file或env；source归Step05 |
| Category描述合法用途，不创造field | 没有formal `03` owner的debug、feature、CLI或telemetry key不能因分类表出现而合法化 |
| Root config immutable | current P0在new complete assembly前validate，assembly exposed后不原地替换 |
| New assembly不等于hot update | 新进程/新complete runtime可使用新config；old request/Job/effect仍按drain/snapshot/binding解释 |
| Job snapshot不是第二source | accepted Job start只冻结root中相关typed subset，不能新增/覆盖global field |
| Policy binding不是domain rule | 配置只选择existing policy implementation/ref和bounded basis，不能改state/guard/authority |
| Sensitive locator不是raw secret | locator属于config，resolved material只在adapter-private memory；raw value不进入root/snapshot/log |
| Test-only必须formal且隔离 | Fake/InMemory/Fixed/Deterministic只允许LocalTest；Controlled只允许LocalTest/IntegrationLike；不能自造mode或进入RuntimeLike |
| Forbidden不是一种配置 | 禁止项没有default=true/false，也不能包装成feature flag、debug override或emergency switch |

## 4. SOP问题回答

### 4.1 当前系统有哪些启动、运行时、策略、敏感和调试配置?

Current分类模型由五个主类别与两个可叠加约束属性组成:

1. `startup / assembly configuration`: raw source identity、runtime class、adapter/store/entry wiring、capability totality与new complete assembly输入。
2. `bounded runtime parameter`: request/page/timeout、retention、batch、lease、parallelism、retry、cadence等formal bounded parameter。
3. `policy binding configuration`: redaction、source allowlist、safe label、correlation、visibility、body-free scanner、freshness等existing policy ref / finite set。
4. `dispatch / target mapping configuration`: enabled operation、Consumer transport/actor/schema、schedule，以及outbound event/handoff/export exact target catalog。
5. `compatibility / lifecycle configuration`: config revision、store schema、digest read/write、old binding解析、new assembly activation/rollback/retire guard。
6. `sensitive locator configuration`约束属性: credential/endpoint/store/adapter/policy/transport/schedule等opaque locator与conditional-required关系。
7. `test-only deterministic configuration`约束属性: LocalTest允许的Fake/InMemory/Fixed/Deterministic，以及LocalTest/IntegrationLike允许的Controlled binding与body-free fixture locator。

`diagnostic / debug configuration`在current root config明确**不适用**。Safe runtime telemetry字段、metric labels、span attributes和redaction规则由formal `03` code contract固定；telemetry sink是host-managed P1 handoff。没有debug dump、raw-body bypass、diagnostics level、dry-run、output root或采样key。

### 4.2 哪些配置允许热更新?

Current没有任何root field允许in-place hot update。Formal `03`只支持“构造一个新的complete validated assembly，再让new work使用”；这属于cold/new-assembly activation，不是对live root、adapter或entry slice原地mutate。

New assembly激活后:

- 未开始的新request / Consumer loop / Job invocation可在activation policy允许时使用new assembly。
- 已接受Job继续使用plan内`JobExecutionConfigSnapshot`。
- 已持久化outbox / intent / preparation继续使用exact historical `ExternalEffectBindingRef`。
- in-flight request是否drain由Step09~10定义，但不能把其dependency handle换成new adapter。

Future若需要hot reload、in-place adapter swap、remote/admin override或dynamic feature controller，必须先重开`01/03/04`并定义authorization、audit、atomic swap、failure、drain、rollback、old binding和test contract。

### 4.3 哪些配置只能冷更新或启动读取?

所有current root config均先在startup/new assembly读取与validate。其中profile、technical、safety、store、digest、entry totality、external catalog、schema revision和sensitive locator必须在façade暴露前完成。Boundary与bounded runtime parameter虽然在operation时被消费，也来自immutable assembly；它们不是operation-time mutable config。

Job相关candidate limit、parallelism、claim lease、retry、timeout和exact external binding在accepted Job start时从validated assembly冻结到snapshot。此后的“只随new Job生效”仍不是hot update，也不授权operator在同一Job中途改值。

### 4.4 哪些安全、审计、事务、一致性或领域规则禁止配置化?

禁止面包括24组，详见§8.3。核心是:truth/data ownership；forbidden body/body-free/redaction；protocol/actor/visibility；state/transition；UoW/write order/append-only audit；idempotency/digest/result replay；claim/fence/version/cursor；token/probe/historical binding；Query/Consumer/Job no-write；retention protection；gap/degraded/delivery语义；telemetry non-authority/recursion；evidence/signoff；only-core dependency；fake parity。它们都不是可关闭的P0 feature。

### 4.5 禁止配置化项如需改变应走什么流程?

| 变化类型 | 必须回到 | 后续同步 |
|---|---|---|
| 仓定位、truth/data ownership、source no-write | formal `00/01` | `02~07`、ADR、测试/验收VETO |
| protocol、DTO、schema、operation/entry surface | formal `02/03`协议与flow | `04~07`、compatibility/migration |
| object/state/transition/policy invariant | formal `02/03`对象/状态/flow | persistence、tests、acceptance、implementation |
| UoW、logical store、audit/history、outbox | formal `03` §10~§12 | config capability、migration、failure、tests |
| config field/enum/reader/builder/adapter capability | formal `03` §5/§13与DDD Step14 | current `04`对应Step、`05~07` |
| telemetry field/port/sink authority/loopback | formal `03` §14与DDD Step15 | config/test/acceptance/operations |
| dependency/product becomes compile/truth source | formal `01`依赖/ADR + formal `03` | `04~07`与workspace boundary |

仅做配置审批、运维变更单或emergency override不足以改变禁止项。对应正式设计和current calibration未闭合前，受影响domain/boundary保持blocked。

### 4.6 每个配置域下哪些类别适用、哪些明确不适用?

§8.4逐一覆盖CFG-D01~D23。一个域可同时包含startup wiring与sensitive locator，例如resolver/target；也可包含bounded runtime parameter与Job snapshot，例如projection/execution。但domain state、business policy、debug bypass、in-place hot update和untyped entry-local override对所有域均不适用。

### 4.7 每个禁止项是否回指架构红线或详细设计不变量?

是。§8.3的每行都有current source，优先回指formal `00` VETO、formal `01`红线、formal `02` §11.2或formal `03` exact section。禁止项不以本Step自我引用证明成立。

### 4.8 每个配置域分类边界是否通过停审?

23个域均已按“类别适用性、cold/snapshot边界、禁止项可执行、`03`影响”完成停审，见§8.5。D01/D02不引入remote/admin/hot source；D06/D07没有debug relax；D22明确new assembly不是hot swap；D23只做matrix view，不创造第二配置schema。

### 4.9 是否存在分类不一致、禁止项遗漏、P1污染P0或规则绕过?

跨分类审计见§8.6~§8.7。P1 Endpoint/target/telemetry/operations material只能实例化formal seam，不能放宽P0 schema、requiredness、redline或failure。相同参数只有一个category owner；snapshot/lifecycle不会把新值重定向给old execution。Requirement `VF-OBS-001~010`全部映射到禁止项或historical gate，当前无unresolved conflict。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本Step处理 |
|---|---|---|
| Step03 23域 | 已有允许/禁止能力和owner，但未给category与更新时机 | 逐域标记主类别/约束属性、cold/snapshot边界和禁止项 |
| formal `03` §13.8 | P0 immutable和new assembly已固定，但“new assembly”可能被误称hot update | 明确current无in-place hot update，new assembly/Job snapshot分层 |
| formal `03` `entries` | entry slice会被L1参考中的entry-local override概念污染 | current只承认validated slice；未定义CLI/env override不合法化 |
| formal `03` `safety` / §14 | policy ref与telemetry hook容易被误写成debug/redaction config | policy binding可配置；safe field/recursion/redline不可配置；debug类不适用 |
| formal `03` `idempotency` | 名称容易与business retention marker混淆 | 分类为technical compatibility parameter，不授权cleanup/source delete |
| formal `00` VETO / formal `01`红线 | 上游边界多但未形成配置审计清单 | 合并为24组可执行禁止项并保留精确source |
| old Step04全文 | 81行重复log/metric/trace/audit schema对象，没有分类、更新时机、禁止项、逐域停审或跨分类审计 | 整份替换 |
| old Step04门禁 | `next_step_or_formal_assembly`允许自动推进 | 替换为`wait_user_confirmation_before_step_05` |
| L1参考 | 分类含entry-local dry-run/output root、feature flags和泛化diagnostic config | 只参考结构；current无formal field/arg者明确不适用 |

### 5.1 Historical material隔离

旧Step04中的`NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`CorrelationContext`和`EvidenceLink`不是配置类别或配置域。Current分类主语是formal config field/binding的用途与生效时机；observation/domain对象继续由formal `03`拥有。

旧README/formal `04`中的产品、P95、cold retention、hash chain、debug/detail level和旧feature/profile也不能借“分类”恢复为current配置。没有current code/schema owner的字符串保持historical或P2。

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Step04粒度 | 81行schema-first摘要 | 九问、5个主类别+2个属性+1类不适用、更新矩阵、24禁止组、23域、逐域/跨域审计 | 满足SOP并为Step05~11提供稳定分类轴 |
| 配置分类 | 无 | 按assembly/parameter/policy/mapping/compatibility/sensitive/test用途分类 | 分类可直接回指formal binding，不按产品或crate |
| hot update | 未定义 | current root无in-place hot update；new complete assembly only | 承接formal `03` immutable P0 |
| Job参数 | 泛化runtime config | root启动validate，accepted start冻结subset，resume只读stored snapshot | 防止Job中途漂移或current config重建 |
| entry-local | 容易照抄L1 selector/dry-run | current不创建未定义CLI/env override | 遵守entry arg schema闭环标准 |
| debug/diagnostic | 旧schema输出愿景 | current root不适用；safe telemetry行为由code contract固定 | 防止debug bypass和telemetry root field漂移 |
| 禁止配置化 | 只有泛化no-write陈述 | 24组、source、禁止形态与正式变更路径 | 可被Step07/12/14和current `06`逐项审计 |
| P1边界 | 产品候选可能弱化core | P1只给existing seam实例材料，不改P0 requiredness/redline/failure | 防止optional integration污染主链 |
| 推进门禁 | 自动next/formal assembly | Step04 pass后停审等Step05确认 | 遵守逐Step规则 |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 分类轴 | 按配置语义/用途 | 按source；按crate；按产品 | source属于Step05，crate/product不能表达不变量边界 |
| root更新 | new complete assembly，no in-place hot | live field reload；adapter hot swap | current `03`无atomic swap/audit/rollback contract |
| Job参数 | startup validated + accepted-start snapshot | Job中途读current config；operator即时override | immutable plan/digest/resume要求固定 |
| policy config | only existing policy binding / finite basis | 将domain policy/state rule变config | 后者会让配置成为业务authority |
| diagnostic/debug | current root不适用 | 增加debug level/raw dump/redaction relax/sampling | 无formal field且会打穿security/telemetry边界 |
| entry-local args | 不在本Step预留 | 照抄`--profile/--dry-run/--output-root` | current `03`无arg schema，不能配置先行 |
| sensitive配置 | locator/ref属于config，raw material adapter-private | raw secret作为高优先级config value | 防止root/snapshot/log/report泄露 |
| optional integration | P1实例材料，P0 schema/failure不变 | feature flag关闭required core或missing=success | optional不等于语义不完整 |
| forbidden changes | 正式设计回退 | 配置审批/emergency override | truth/state/UoW等不变量不属于运维变更权限 |

## 8. 结构化中间产物

### 8.1 配置分类表

| Category ID | 配置类别 | 说明 | Current示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|---|
| `CAT-STARTUP` | startup / assembly configuration | complete runtime暴露前读取、validate并冻结的source/profile/wiring/totality输入 | config ref、runtime class、store mode、entry enabled set、adapter mode/capability | 否；只可new complete assembly | partial runtime、silent fallback、old/new binding漂移 |
| `CAT-RUNTIME` | bounded runtime parameter | 运行时被consumer使用、但来自immutable assembly并受positive/hard bound约束的技术参数 | page/request/query timeout、retention、batch、lease、parallelism、retry、cadence | 否；new assembly/new Job only | 误认为可即时调参、越界/zero/unbounded、snapshot漂移 |
| `CAT-POLICY` | policy binding configuration | 选择existing validated policy ref、finite allowlist或typed basis，不改变domain rule | redaction、source family、safe label、correlation、visibility、freshness policy | 否；new assembly only | policy locator被当作修改state/authority的入口 |
| `CAT-MAPPING` | dispatch / target mapping configuration | 将formal typed subject/operation映射到entry transport、schedule或exact external binding | Consumer producer/actor/schema、12 event target、handoff/export consumer、schedule | 否；new assembly；old effect pin old ref | missing/duplicate mapping、route改schema、old target重定向 |
| `CAT-COMPAT` | compatibility / lifecycle configuration | 维护config/store/digest/binding revision与new/old assembly可解释性 | config ref、schema revision、digest read/write、activation/rollback/retire guard | 否；受控cold lifecycle | 移除仍在用版本、rollback重写durable material |
| `CAT-SENSITIVE` | sensitive locator configuration | 普通config只携带opaque locator，resolved material停留infra adapter memory | credential、endpoint、store、adapter、policy、transport locator | 否；new assembly且rotation需historical guard | raw secret扩散、locator误当evidence、rotation丢old binding |
| `CAT-TEST` | test-only deterministic configuration | LocalTest限定InMemory/Fake/Fixed/Deterministic；Controlled限定LocalTest/IntegrationLike | InMemory、Fake、Controlled、Fixed clock、Deterministic ID、fixture locator | 否；只构造隔离test assembly | 进入错误runtime class、fake success、跳过CAS/fence/probe |
| `CAT-DIAG-N/A` | diagnostic / debug configuration | current root明确不提供此类别；只记录禁止与future trigger | raw dump、debug bypass、diagnostic level、sampling/bucket/sink key均不存在 | 不适用 | 先于`03`新增field、泄露正文、telemetry成为authority |

分类规则:

- `CAT-STARTUP/RUNTIME/POLICY/MAPPING/COMPAT`是五个主类别；每个current field在Step07必须恰有一个主类别和明确activation。
- `CAT-SENSITIVE/CAT-TEST`是约束属性，可以叠加到主类别；例如Endpoint locator属于`CAT-MAPPING + CAT-SENSITIVE`，LocalTest Fake resolver属于`CAT-MAPPING + CAT-TEST`，但owner仍只有一个。
- `CAT-RUNTIME`不表示live mutable。它只表示参数在operation/runtime被消费。
- `CAT-DIAG-N/A`不是可生成配置项的类别，Step07不得以此生成key。

### 8.2 更新时机与冻结边界表

| Update ID | 时机 | 允许内容 | 生效规则 | 必须保持 | 禁止内容 |
|---|---|---|---|---|---|
| `UPD-DESIGN` | design / code change | truth/protocol/state/UoW/config schema本身的正式变更 | 先改owning formal design/code并完成兼容/测试/验收 | historical material、migration与dependency解释 | 用JSON/env/flag直接改变不变量 |
| `UPD-ASSEMBLY` | startup / new complete assembly | CAT-STARTUP/RUNTIME/POLICY/MAPPING/COMPAT/SENSITIVE的validated candidate | 13-stage complete-or-error后仅供new work；失败不暴露partial runtime | old assembly、old Job snapshot、old binding可解释 | live struct mutate、partial adapter swap、warning bypass |
| `UPD-ENTRY` | entry-local registration | 从root派生的API/worker/jobs validated slice和assigned façade | builder完成后静态注册；slice不能扩权或覆盖root | formal operation/schema/actor/transport mapping | entry另读env、动态加route、Disabled仍consume/ack |
| `UPD-JOB-SNAPSHOT` | accepted Job start | CAT-RUNTIME/MAPPING中formal Job相关subset | 与plan digest一起持久化；resume/finalize只读stored snapshot | work set、binding、retry、lease、limit与digest兼容 | run中热读、operator override、missing snapshot重建 |
| `UPD-DRAIN` | activation drain / rollback | 旧assembly停止接new work、保留in-flight和historical resolution | exact policy留Step09~10；不改变old durable refs | outbox/plan/intent/preparation/token/receipt/report | current route重定向old material、rollback改state |
| `UPD-TEST-ASSEMBLY` | isolated LocalTest/IntegrationLike assembly | CAT-TEST与相应validated root | 仅formal allowed combination；仍走shared validator/conformance | same state/UoW/idempotency/fence/probe semantics | production inheritance、private map truth、default fake success |
| `UPD-HOT-N/A` | in-place hot runtime update | current无允许内容 | 不支持；future需重开design | n/a | store/adapter/policy/limit/entry/secret原地更新 |

### 8.3 禁止配置化项表

| Forbidden ID | 禁止配置化项 | 禁止形态 / 风险 | Current设计来源 | 如需改变应走什么流程 |
|---|---|---|---|---|
| `F-CFG-01` | observation与external truth/data ownership | `truth_owner=external`、provider/dashboard/sink定义truth | formal `00` §2/§11/`VF-OBS-004`;formal `01` §3.2/§9 | 重开`00/01` ownership与context，再同步`02~07` |
| `F-CFG-02` | raw/forbidden body与secret不入仓 | `allow_raw_body`、debug dump、保存payload/provider/evidence/runtime body | `VF-OBS-002~003`;formal `01` §4.3;formal `03` §14.7 | 重开需求安全/数据归属及`03`对象/serialization；当前VETO |
| `F-CFG-03` | redaction-first与body-free scanner | `redaction_enabled=false`、scanner disabled、hash/base64逃逸 | formal `02` §11.2;formal `03` §13.9/§14.7 | 重开安全/DDD validation/telemetry与VETO；不得配置放宽 |
| `F-CFG-04` | body-free evidence linkage与visibility | evidence body入linkage、NotVisible=Missing/Success、digest在Layer A泄露 | `VF-OBS-003`;formal `03` §9.2/§14.9 | 重开evidence/visibility对象、flow、state和安全测试 |
| `F-CFG-05` | protocol/DTO/schema/operation identity | config新增operation/variant，route/topic改event schema | formal `03` §7/§13.7;可落码标准§2.12 | 重开`02/03` protocol/compatibility，再更新`04~07` |
| `F-CFG-06` | actor/metadata/scope/visibility authority | bypass actor、schedule生成scope/key、opaque ref推business identity | formal `03` §7~§8/§12;formal `02` §11.2 | 重开protocol/security/flow/idempotency设计 |
| `F-CFG-07` | domain state variants与transition | profile改from/to、terminal复活、reserved transition启用 | formal `03` §9全矩阵 | 重开DDD state/flow/error/test，不能feature-enable |
| `F-CFG-08` | gap/degraded/delivery语义 | Suppressed=Resolved、Blocked=success、Delivered=Accepted/verdict | formal `03` §9.3/§9.5/§13.9 | 重开owner state/protocol/handoff/acceptance设计 |
| `F-CFG-09` | Query strict no-write与diagnostic no-control | refresh-on-miss、Query写audit/gap、diagnostic下发kill/retry | `VF-OBS-005`;formal `03` §8.3/§14.9 | 重开query/diagnostic protocol与flow；current VETO |
| `F-CFG-10` | Consumer/Job/replay/rebuild no-source-repair | `repair_source=true`、maintenance改upstream truth | `VF-OBS-005`;formal `01` §4.3;formal `03` §8.4/§8.6/§9 | 重开ownership、operations flow和state/test |
| `F-CFG-11` | logical store/schema/key/version/cursor ownership | store product改logical key/owner、disable expected version/source fence | formal `03` §10/§12 | 重开persistence/consistency/adapter conformance与migration |
| `F-CFG-12` | accepted UoW与write ordering | optional history/idempotency/outbox/result、best-effort cross-store write | formal `03` §10.5/§14.6;truth-source standard | 重开transaction/flow/recovery/test；不能降级继续 |
| `F-CFG-13` | mandatory native audit/history append-only | audit hook关闭、accepted owner无history、修改旧record | formal `03` §10/§14.6 | 重开owner/history/UoW设计及acceptance VETO |
| `F-CFG-14` | idempotency namespace/digest/stored replay | 配置operation/actor/key组成、digest include list、duplicate rerun | formal `03` §12.2~§12.4/§12.9 | 重开protocol/idempotency/digest/migration/tests |
| `F-CFG-15` | claim/fence/CAS/global work authority | fencing=false、process lock替durable claim、stale worker记成功 | formal `03` §12.6~§12.7/§13.3 | 重开Job/persistence/concurrency设计；unsupported则不注册 |
| `F-CFG-16` | external stable token/probe/phase semantics | token reset、Unknown=NotSent、blind retry、phase capability谎报 | formal `03` §12.8/§13.2/§13.6 | 重开port/outcome/recovery/config capability和tests |
| `F-CFG-17` | immutable payload/plan/snapshot/historical binding | current truth重建payload、resume读new config、old route fallback current | formal `03` §10/§12.6/§13.5/§13.8 | 重开persistence/config lifecycle/migration/recovery设计 |
| `F-CFG-18` | retention hold/active reference与technical material guard | force release、删除unresolved reservation/intent、retention授权source cleanup | `VF-OBS-007`;formal `03` §9.3/§13.4/§14.9 | 重开retention Command/state/operations/acceptance；physical delete另设计 |
| `F-CFG-19` | failure/recovery classification | timeout=rollback proof、Unavailable=empty、missing dependency=fake | formal `03` §11/§13.6/§13.9 | 重开typed error/recovery/adapter validation；不得string推断 |
| `F-CFG-20` | handoff/export/evidence/acceptance authority | receipt/sink ack=signoff，配置real run/evidence/verdict | `VF-OBS-006`;formal `03` §9.3/§14.9 | 只能由真实execution+authorized acceptance；协议变化回`00~03/05~07` |
| `F-CFG-21` | telemetry non-authority与self-recursion | sink failure触发business retry、own telemetry回采own façade、sink retention=marker | formal `03` §14.8~§14.9;DDD Step15 §15~§16 | 重开telemetry topology/port/config/recursion/test；current禁止回采 |
| `F-CFG-22` | dependency裁剪与product neutrality | config动态增加non-core sibling Cargo edge、provider type进domain、product成为truth | `VF-OBS-008~009`;formal `01` §8 | 重开architecture/ADR/dependency review与`03~07` |
| `F-CFG-23` | fake/controlled parity与profile isolation | RuntimeLike自动fake/in-memory、fake跳过UoW/CAS/fence/probe | formal `03` §13.2/§13.6;formal test cuts | 重开mode/profile/config schema与conformance tests |
| `F-CFG-24` | current design baseline与no-fabrication | 恢复README旧数字/key/profile；配置/设计伪造test/evidence/commit/signoff | `VF-OBS-010`;project ledger;formal `00` §4.2 | 回current source重新校准；真实结果只能来自真实执行/授权验收 |

禁止项执行规则:

- Step07不得为F-CFG-01~24的反向表达生成key，即使默认值看似安全。
- Unknown key若命中禁止语义必须reject，不能ignore-and-continue；exact规则在Step05/09定义。
- P1/P2、emergency、debug、test或operator profile都不能豁免禁止项。
- 违反F-CFG-01~24的实现/fixture/profile应作为current `05/06` negative/VETO输入，不在本Step声称测试或验收结果。

### 8.4 按配置域组织的分类边界表

| Domain ID | 配置域 | 适用类别 | 明确不适用类别 | 更新/冻结边界 | 主要禁止项 | 分类理由 |
|---|---|---|---|---|---|---|
| `CFG-D01` | source acquisition | STARTUP;COMPAT | SENSITIVE material;TEST as source;DIAG;HOT | UPD-ASSEMBLY；source汇成one candidate | F02/F03/F24 | source只装载raw candidate，不授权fixture/secret绕priority |
| `CFG-D02` | config identity | STARTUP;COMPAT | RUNTIME business identity;SENSITIVE raw;DIAG;HOT | stage 4建立，随assembly冻结 | F02/F20/F24 | config ref只关联validated revision，不是run/evidence/path |
| `CFG-D03` | runtime class / technical adapters | STARTUP;TEST;SENSITIVE locator | POLICY/domain;DIAG;HOT | new assembly；test独立assembly | F01/F19/F23 | profile只约束formal mode组合与clock/ID binding |
| `CFG-D04` | protocol boundary | STARTUP;RUNTIME | POLICY authority;MAPPING schema expansion;DIAG;HOT | root冻结；request只能在formal规则内收窄 | F05/F06/F09/F19 | limit/schema guard在pre-dispatch，不改协议或可见性 |
| `CFG-D05` | entry dispatch / scheduling | STARTUP;MAPPING;RUNTIME cadence | untyped entry-local;DIAG;HOT | UPD-ENTRY来自validated slice | F05/F06/F09/F10 | enabled/mapping total；schedule不生成actor/key/scope |
| `CFG-D06` | redaction / body-free safety | STARTUP;POLICY;SENSITIVE locator | RUNTIME relax;DIAG/debug;TEST bypass;HOT | façade暴露前必需，new assembly only | F02/F03/F04/F21 | safety只能选择validated binding，不能关闭或放宽 |
| `CFG-D07` | correlation / safe label / visibility | STARTUP;POLICY;SENSITIVE locator | MAPPING authority;DIAG relax;HOT | new assembly；operation接pure input | F04/F06/F08/F21 | policy basis不创造truth或高基数输出 |
| `CFG-D08` | observation + atomic idempotency store | STARTUP;SENSITIVE locator;COMPAT | RUNTIME mutation;TEST in RuntimeLike;HOT | stage 6~7 capability gate | F01/F11/F12/F14/F23 | store选择不能改owner/UoW/replay authority |
| `CFG-D09` | projection store | STARTUP;SENSITIVE locator;COMPAT | Query repair;POLICY truth;HOT | new assembly；rebuild按fence | F09/F10/F11/F17 | projection承载derived replace，不成为truth |
| `CFG-D10` | Job execution / report store | STARTUP;SENSITIVE locator;COMPAT | process-lock fallback;DIAG;HOT | enabled Job前qualified；snapshot/plan durable | F11/F12/F15/F17 | claim/fence/report authority必须durable |
| `CFG-D11` | transaction / schema compatibility | STARTUP;RUNTIME timeout;COMPAT | automatic truth migration;TEST bypass;HOT | stage 6 validate，assembly冻结 | F11/F12/F19/F23 | timeout不证明rollback，revision不授权auto repair |
| `CFG-D12` | digest compatibility | STARTUP;COMPAT | arbitrary POLICY/list;DIAG;HOT | assembly validate；old profile在引用期保留 | F14/F17/F24 | algorithm/field set由versioned code contract固定 |
| `CFG-D13` | technical reservation / intent retention | STARTUP;RUNTIME;COMPAT | business retention state;cleanup authority;HOT | new assembly/new material；old unresolved保留 | F14/F17/F18 | duration只保护technical material，不替代marker |
| `CFG-D14` | projection bounds / freshness | STARTUP;RUNTIME;POLICY freshness | truth repair;partial-success;DIAG;HOT | root冻结；accepted Job snapshot相关limit | F09/F10/F11/F19 | bounded planner/policy不授权inline repair或false Fresh |
| `CFG-D15` | claim / concurrency / Job budget | STARTUP;RUNTIME;COMPAT | fence toggle;operator mid-run override;HOT | accepted start冻结snapshot | F15/F17/F19 | lease/parallelism/timeout不改变claim authority |
| `CFG-D16` | retry policies | STARTUP;RUNTIME;COMPAT | domain transition;blind retry;mid-run override;HOT | accepted start冻结budget；same snapshot | F14/F16/F17/F19 | retry同时受recovery class、budget、token/probe约束 |
| `CFG-D17` | safe resolver bindings | STARTUP;MAPPING;SENSITIVE;TEST | source truth/default body;non-core dependency;HOT | new assembly；operation见formal availability | F01/F02/F19/F22/F23 | adapter mode/binding只返回body-free formal resolution |
| `CFG-D18` | event publication binding | STARTUP;MAPPING;SENSITIVE;TEST;COMPAT | event schema config;current-route fallback;HOT | new rows用new binding；old rowspin old ref | F05/F12/F16/F17/F22 | target mapping不改event语义或accepted truth |
| `CFG-D19` | report handoff targets | STARTUP;MAPPING;SENSITIVE;TEST;COMPAT | verdict/evidence config;fallback target;HOT | accepted start/intent pin binding | F08/F16/F17/F20/F22 | delivery是transport fact，旧preparation不重定向 |
| `CFG-D20` | peripheral export targets | STARTUP;MAPPING;SENSITIVE;TEST;COMPAT | external truth/core dependency;HOT | optional target独立；old intent pin binding | F01/F08/F16/F17/F20/F22 | 外围可Disabled但不得fake Delivered或污染core |
| `CFG-D21` | sensitive reference resolution | STARTUP;SENSITIVE;COMPAT | raw secret config;application visibility;DIAG;HOT | stage 5 adapter-private；rotation建new assembly | F02/F03/F17/F19 | locator可审计，resolved material不进入root/snapshot |
| `CFG-D22` | activation / rollback / historical binding | STARTUP;COMPAT | in-place HOT;state rewrite;current-route recovery | UPD-ASSEMBLY/UPD-DRAIN；old material保持 | F12/F15/F16/F17/F18 | lifecycle只切new work，不重写durable truth |
| `CFG-D23` | environment / verification matrix | STARTUP view;TEST view | second schema;DIAG;fabricated result;HOT | Step06组合view，不成为source/field owner | F01/F22/F23/F24 | profile矩阵引用同一schema与禁止项，不创造特例 |

表中缩写对应`CAT-*`；`HOT`表示`UPD-HOT-N/A`。`STARTUP view` / `TEST view`表示D23只展示组合，不拥有新配置值。

### 8.5 分类边界停审记录

| 配置域 | 类别适用性 | 更新边界 | 禁止项 | `03`影响 | 结论 / 缺口 |
|---|---|---|---|---|---|
| CFG-D01 source | 清楚 | assembly-only | F02/F03/F24 | 无 | pass；priority留Step05 |
| CFG-D02 identity | 清楚 | stage4 frozen | F02/F20/F24 | 无 | pass；change audit留Step10 |
| CFG-D03 runtime/technical | 清楚 | new/test assembly | F01/F19/F23 | 无 | pass；actual matrix留Step06 |
| CFG-D04 boundary | 清楚 | immutable runtime input | F05/F06/F09/F19 | 无 | pass；exact range留Step07 |
| CFG-D05 entry | 清楚 | derived slice/registration | F05/F06/F09/F10 | 无 | pass；无entry-local override |
| CFG-D06 safety | 清楚 | required pre-façade | F02/F03/F04/F21 | 无 | pass；debug类不适用 |
| CFG-D07 correlation/visibility | 清楚 | policy binding frozen | F04/F06/F08/F21 | 无 | pass；不成为authority |
| CFG-D08 atomic store | 清楚 | stage6~7 gate | F01/F11/F12/F14/F23 | 无 | pass；product proof后置 |
| CFG-D09 projection store | 清楚 | assembly + fenced rebuild | F09/F10/F11/F17 | 无 | pass；无query repair |
| CFG-D10 Job store | 清楚 | enabled-Job required | F11/F12/F15/F17 | 无 | pass；无process lock fallback |
| CFG-D11 transaction/schema | 清楚 | assembly validate | F11/F12/F19/F23 | 无 | pass；migration留Step13 |
| CFG-D12 digest | 清楚 | referenced profile retained | F14/F17/F24 | 无 | pass；不配置字段集 |
| CFG-D13 technical retention | 清楚 | new material + old guard | F14/F17/F18 | 无 | pass；不等于business marker |
| CFG-D14 projection/freshness | 清楚 | root + Job snapshot | F09/F10/F11/F19 | 无 | pass；无partial Fresh |
| CFG-D15 claim/budget | 清楚 | Job start snapshot | F15/F17/F19 | 无 | pass；无mid-run override |
| CFG-D16 retry | 清楚 | Job start snapshot | F14/F16/F17/F19 | 无 | pass；recovery+budget双门禁 |
| CFG-D17 resolver | 清楚 | new assembly | F01/F02/F19/F22/F23 | 无 | pass；P1 Endpoint不弱化P0 outcome |
| CFG-D18 publication | 清楚 | new vs historical binding | F05/F12/F16/F17/F22 | 无 | pass；old row不重定向 |
| CFG-D19 handoff | 清楚 | intent pins target | F08/F16/F17/F20/F22 | 无 | pass；receipt非acceptance |
| CFG-D20 export | 清楚 | optional target isolated | F01/F08/F16/F17/F20/F22 | 无 | pass；外围不污染core |
| CFG-D21 sensitive refs | 清楚 | stage5/private memory | F02/F03/F17/F19 | 无 | pass；raw secret不入root |
| CFG-D22 lifecycle | 清楚 | new assembly/drain | F12/F15/F16/F17/F18 | 无 | pass；hot update不适用 |
| CFG-D23 environment/view | 清楚 | matrix only | F01/F22/F23/F24 | 无 | pass；不创造第二schema/结果 |

### 8.6 跨分类owner与一致性表

| 易混项 | Primary分类 / owner | 可叠加属性 | 不允许的第二解释 |
|---|---|---|---|
| endpoint/credential/store locator | 对应MAPPING/STARTUP域owner | SENSITIVE | 独立secret map、raw value、application-visible config |
| request/page/query timeout | RUNTIME / D04 | STARTUP activation | request级任意override、authorization/visibility policy |
| retention duration | RUNTIME+COMPAT / D13 | STARTUP activation | business marker state、cleanup/source delete authority |
| freshness policy ref | POLICY / D14 | STARTUP activation | inline rebuild、Fresh truth或provider health |
| Job batch/lease/retry/timeout | RUNTIME / D14~D16 | COMPAT snapshot | schedule/operator mid-run override、domain policy |
| entry schedule/cadence | MAPPING/RUNTIME / D05 | STARTUP activation | actor/key/scope/run authority |
| external target | MAPPING / D18~D20 | SENSITIVE+COMPAT | product truth、old binding fallback、entry outbound owner |
| test adapter/fixture | TEST / owning adapter domain | STARTUP isolated assembly | source priority、RuntimeLike fallback、fake semantic shortcut |
| config identity/revision | COMPAT / D02 | STARTUP | evidence/run/commit/deployment identity |
| telemetry hook/sink | hook行为是code contract；sink为host P1 handoff | none in root config | DIAG/feature/root key、business authority |
| environment matrix | D23 view | references all categories | new enum/field/default/source或forbidden exception |

### 8.7 跨分类 / 禁止项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 五个主类别与两个属性是否都有formal owner | pass | 每个主类别/属性可回指root section/binding/builder；DIAG明确N/A |
| 是否把source当category | pass | category与Step05 source分离 |
| 是否存在P0 in-place hot update | none | current全部new assembly；Job snapshot/old binding继续固定 |
| 是否把new assembly误称hot reload | pass | UPD-ASSEMBLY与UPD-HOT-N/A分离 |
| 是否把entry slice当独立config source | pass | UPD-ENTRY只能derived slice，不能env override |
| 是否把Job snapshot当第二source | pass | snapshot只冻结existing validated subset |
| 是否把domain policy/state当policy config | pass | CAT-POLICY仅existing binding/basis；F07/F08强制排除 |
| 是否把debug/diagnostic放宽安全 | pass | CAT-DIAG-N/A，D06/D07禁止relax |
| 是否把secret raw material当config | pass | CAT-SENSITIVE只含locator，D21 stage5 private resolution |
| P1实例是否污染P0 requiredness/redline/failure | pass | Endpoint/target/test/telemetry material不得改变P0语义 |
| 是否遗漏Step03 23域 | pass | CFG-D01~D23全部进入§8.4/§8.5 |
| 是否遗漏formal `03`主要禁止面 | pass | state/UoW/audit/idempotency/fence/token/retention/handoff/telemetry/dependency均有F-ID |
| requirement VETO是否有映射 | pass | VF001由完整control plane/gate；VF002~009映射F01~F23；VF010映射F24 |
| historical material是否成为配置事实 | pass | 仅§5 diagnosis出现，未进入category/domain结论 |
| 是否需要新增`03` field/enum/reload/port | 未发现 | current只分类existing contract；future trigger见§9.2 |
| 是否存在unresolved分类冲突 | none | owner表已收口；exact source/key/value留后续Step |

### 8.8 Requirement VETO到配置禁止项映射

| Requirement VETO | 配置侧必须证明 | 对应禁止项 / gate | Step04结论 |
|---|---|---|---|
| `VF-OBS-001` 核心闭环任一节点不成立 | required control plane、entry、store、安全、external binding和failure不能被profile裁掉或silent fallback | CFG-D03~D22逐域requiredness；F-CFG-01/03/09~19/23 | covered；具体组合由Step06/07/11闭合 |
| `VF-OBS-002` raw/secret/payload/runtime body进入观察面 | 不存在raw-body/debug bypass，secret只以locator进入infra | F-CFG-02/03；CAT-SENSITIVE；CAT-DIAG-N/A | covered；Step07不得生成反向key |
| `VF-OBS-003` evidence/artifact/identity/governance/source-audit body被保存 | linkage、resolver、handoff只接受body-free ref/summary，NotVisible不降级为正文fallback | F-CFG-02/04；CFG-D06/07/17/19 | covered；所有profile同一VETO |
| `VF-OBS-004` observation/telemetry/handoff被解释为external truth | product、sink、projection、delivery状态不成为truth authority | F-CFG-01/08/20/21/22 | covered；P1外围实例不豁免 |
| `VF-OBS-005` Query/maintenance/rebuild/export反写source truth | 无refresh-on-miss、repair-source、diagnostic control或maintenance writeback配置 | F-CFG-09/10；CFG-D09/14/17/20 | covered；违反即阻断对应surface |
| `VF-OBS-006` handoff/design伪造run/evidence/verdict/signoff | config ref、Job ref、receipt、sink ack均不得映射为真实验收身份 | F-CFG-20/24；CFG-D02/19/23 | covered；只能由真实执行和授权验收产生 |
| `VF-OBS-007` retention/cleanup删除仍被引用材料 | technical retention不替代marker/protection，unresolved plan/intent/binding不可清理 | F-CFG-17/18；CFG-D12/13/22 | covered；exact window与retire guard后置Step07/13 |
| `VF-OBS-008` 引入non-core sibling编译依赖 | profile、adapter、test和product binding都不能改变Cargo edge | F-CFG-22/23；CFG-D17~D20/23 | covered；dependency scan交给Step12/current `05/06` |
| `VF-OBS-009` 具名产品成为truth或需求硬前置 | product-neutral capability/locator与product choice分离，Disabled/Unavailable不伪成功 | F-CFG-01/19/22；CFG-D08~D11/17~D21 | covered；产品proof后置ADR/`07` spike |
| `VF-OBS-010` historical material直接升级为current硬验收 | old key/profile/value/product/number/evidence path不能进入current schema | F-CFG-24；project ledger historical gate | covered；current Step01~04链是唯一输入 |

本表只证明Step04已把requirement VETO转成配置侧禁止与后续gate输入，不声称current `05/06`测试、验收或evidence已经完成。

## 9. 对详细设计的影响判定

### 9.1 当前结论

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| current分类模型为5个主类别+2个属性，diagnostic/debug明确N/A | 否 | 对existing fields按用途分类 | 不适用 | 无回写 |
| current无in-place hot update，只支持new complete assembly | 否 | 承接formal `03` §13.8 | 不适用 | 无回写 |
| entry registration只使用derived validated slice | 否 | 承接builder stage 11~13 | 不适用 | 无回写 |
| accepted Job start冻结related subset，resume只读stored snapshot | 否 | 承接formal `03` §12.6/§13.5 | 不适用 | 无回写 |
| policy category只选择existing binding，不改变domain rule | 否 | 分类边界澄清 | 不适用 | 无回写 |
| sensitive category只含locator/ref，raw material infra-private | 否 | 承接formal `03` §13.1/§13.8 | 不适用 | 无回写 |
| CAT-TEST只承接formal mode/enum且隔离RuntimeLike | 否 | 承接formal mode validation | 不适用 | 无回写 |
| 24组禁止项均为current upstream不变量 | 否 | 红线可执行化 | 不适用 | 无回写 |

### 9.2 Future impact trigger

| 后续要求 | `03`影响 | 处理规则 |
|---|---|---|
| 任一root field需要in-place hot reload | 是 | 回§5/§13定义atomic swap、reader、audit、failure、drain/rollback与tests |
| binary需要CLI/env entry-local override | 可能是 | 先定义arg schema、binary、scope、default/missing与global override边界；影响slice/constructor则回`03` |
| diagnostic/debug/telemetry field进入root config | 是 | 回§5/§13/§14及DDD Step14/15闭合owner、redaction、recursion、failure |
| feature flag改变core entry/accepted semantics | 是且违反current边界 | 回`00~03` scope/protocol/flow/state，不能直接加boolean |
| new policy kind改变state/authority | 是 | 回domain policy/object/flow/state；配置只能在新contract后绑定 |
| test需要新mode/profile/fake shortcut | 是 | 回formal enum/port/conformance/config validation，不得fixture先行 |
| forbidden项希望emergency bypass | 是且当前阻塞 | 先重开其owning正式设计和VETO；未经批准保持拒绝 |

当前actual影响表没有`待回写`或`阻塞待确认`；上游blocker=`none`。

## 10. 回填草稿

以下草稿只供Step15装配formal `04` §4；当前不修改正式正文。

````md
## 4. 配置分类与禁止配置化边界

> 校准来源:
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置分类表”“更新时机与冻结边界表”“禁止配置化项表”“按配置域组织的分类边界表”“分类边界停审记录”和“跨分类 / 禁止项审计表”,了解current配置为何不支持hot update，以及哪些不变量永远不能成为配置项。

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| startup / assembly | complete runtime暴露前validate的source/profile/wiring/totality输入 | config ref、runtime class、store/adapter/entry binding | 否；new complete assembly only | partial runtime、fallback、old/new漂移 |
| bounded runtime parameter | operation消费但来自immutable assembly的bounded技术参数 | limit、timeout、retention、batch、lease、retry、cadence | 否；new assembly/new Job only | 越界、mid-run drift、snapshot不可复核 |
| policy binding | existing validated policy ref、finite allowlist或typed basis | redaction、correlation、visibility、freshness | 否 | 将policy ref误作state/authority入口 |
| dispatch / target mapping | formal operation/subject到entry transport/schedule/external target映射 | Consumer mapping、event/handoff/export target | 否；old effect pin old ref | missing/duplicate、route改schema、target重定向 |
| compatibility / lifecycle | config/store/digest/binding revision和new/old assembly解释 | schema/digest profile、activation/rollback/retire guard | 否 | 移除in-use版本、rollback重写durable material |
| sensitive locator | opaque locator；resolved material只在infra adapter memory | credential/endpoint/store/transport/policy ref | 否 | raw secret扩散、rotation丢old binding |
| test-only deterministic | LocalTest限定InMemory/Fake/Fixed/Deterministic，Controlled可用于LocalTest/IntegrationLike | InMemory、Fake、Controlled、Fixed clock | 否；isolated test assembly only | runtime class越界、fake shortcut |
| diagnostic / debug | current root不适用，不生成配置项 | raw dump/debug bypass/sampling/sink key均不存在 | 不适用 | 先于`03`扩展、泄露正文、telemetry变authority |

Current root configuration不支持in-place hot update。变化必须形成new complete validated assembly，只影响符合activation规则的new work；existing Job继续使用stored `JobExecutionConfigSnapshot`，existing outbox/intent/preparation继续使用historical binding。Entry只使用builder派生的validated slice，不能另读env覆盖root。

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| truth/data ownership与外部产品non-authority | 防止Observability或provider成为业务/外部truth owner | 重开formal `00/01` ownership/context，再同步`02~07` |
| raw/forbidden body、body-free与redaction-first | 防止正文/secret泄露和evidence边界失效 | 重开需求安全/数据归属与`03` object/validation/telemetry；current VETO |
| protocol/actor/visibility与state transition | 防止route/profile/feature改协议、authority或合法迁移 | 重开`02/03` protocol/flow/state/security |
| Query no-write、Consumer/Job/replay no-source-repair | 防止读侧/维护侧成为隐式control/write source | 重开ownership与对应flow；current VETO |
| logical store/UoW/write order/append-only audit | 防止配置关闭atomicity、history、outbox或stored result | 重开`03` persistence/transaction/recovery/test |
| idempotency/digest/replay、claim/fence/version/cursor | 防止duplicate rerun、stale writer或process lock替durable authority | 重开protocol/concurrency/persistence/migration |
| stable token/probe/phase与immutable snapshot/historical binding | 防止blind retry、new token、current route重定向old effect | 重开port/outcome/recovery/config lifecycle |
| retention protection与gap/degraded/delivery语义 | 防止误删、source cleanup、Suppressed/Blocked/Delivered伪成功 | 重开state/retention/handoff/acceptance设计 |
| telemetry non-authority/self-recursion与evidence/signoff | 防止sink驱动business、回采own façade或伪造验收 | 重开telemetry topology/port和真实execution/acceptance链 |
| dependency裁剪、fake parity与current baseline | 防止non-core Cargo edge、RuntimeLike fake和historical material复活 | 重开architecture/ADR/formal config/test design |

上述禁止项不存在相反boolean key，不受P1/P2、debug、test、emergency或operator profile豁免。每个配置域都必须在Step07证明没有生成其反向表达。
````

## 11. 待确认事项

| 待确认事项 | 当前影响 | Owner / 最迟关闭 | 未确认前处理 |
|---|---|---|---|
| code/file/env的最终precedence与unknown-key策略 | 决定各category如何进入raw candidate | Step05 | 当前只分类，不声明priority |
| actual environment/profile与test组合 | 决定CAT-TEST/RuntimeLike隔离 | Step06 | 只承认formal runtime class/mode |
| 每个field的primary category、default/range与activation | 决定Step07 schema可落码性 | Step07 | 不从old formal/README恢复 |
| sensitive locator/provider/rotation细节 | 决定CAT-SENSITIVE validation与lifecycle | Step08/10 | raw material不入root，new assembly only |
| new assembly activation/drain/rollback exact机制 | 决定UPD-ASSEMBLY/UPD-DRAIN可执行性 | Step09/10/11 | current无hot update，old durable ref不重定向 |
| forbidden项到current `05/06` negative/VETO映射 | 决定验证与release gate | Step12及current `05/06` | 只交付input，不伪造case/result/signoff |
| future是否需要hot reload/entry-local/debug field | 可能影响formal `03` | Step13/14；需求出现即回`03` | current全部N/A，不预留key |

上述事项不阻塞Step04。若任一事项要求新增field/enum/reader/port/builder/reload contract，则升级为`03`回写blocker。

## 12. Current M3 后置复核与 redline affected 传播

Pre-M3 Step 04 的存在和旧 pass 状态不构成 current 证据。本节以最终 formal `03` §9~§14、§16.10
和 §17 重新核对分类、更新边界、禁止配置化项和 affected 传播。

### 12.1 Final baseline revalidation

| Redline | 最终 formal `03` owner / invariant | Step 04 current 判断 | 结果 |
|---|---|---|---|
| raw / body / secret prohibition | §13 raw infra-only、§14 redaction-before-serialization | 不能由 category 或 profile 放宽 | pass |
| Query no-write | §8.3、§10.8、§14.9 | diagnostic/debug 类不适用，不能启用 refresh-on-miss | pass |
| accepted UoW / history / outbox | §10.5、§14.6 | transaction 与 append-only 是禁止配置化不变量 | pass |
| state / recovery / idempotency / fence | §9、§11、§12 | policy 参数只能输入既有 typed contract | pass |
| external phase / token / probe | §12.8、§13.6 | capability 不足时 manual / fail-closed，不得配置 blind retry | pass |
| truth / evidence / retention / handoff | formal `00/01`、§9.3、§14.9 | marker/linkage/handoff 不成为 source truth 或 signoff | pass |
| runtime class | §13.2 仅三类 | 不创建旧 profile 或新的 mode | pass |

### 12.2 Affected redline register

| Affected ID | 分类 / 禁止配置化承接 | 本 Step 不得关闭的方式 | Current 状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | protocol/schema ownership 是 forbidden override | 不以 schema allowlist、disabled 或 generic category 补上游 schema | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | producer binding 必须 exact，不可全订阅 | 不以 transport category 推导 event binding | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | replay execution/H13 positive path 是 controlled-open | 不以 `enable_replay` 或 debug category 生成 H13 | open_controlled |
| `R06-F-AFFECT-UOW-01` | UoW order、append、commit 是 invariant-guarded | 不提供 optional history/result/outbox 或 best-effort 开关 | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | recovery class owner 不能由 config category 创造 | 不把 timeout/disabled 映射为任意 recovery | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | phase link 完整性是 binding invariant | 不用 Available/category 代替 intent/result relation | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | retry/probe accounting 属于既有 flow | 不用 retry category 关闭 probe 或换 token | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | same-UoW owner-coupled event 是硬红线 | 不以 Consumer disabled 或 optional category 绕过 | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit-unknown action 不得被类别折叠 | 不把 unknown 分类为 success/ack | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | report ref owner 和 finalize 语义不可配置化 | 不以 report category/placeholder 创建 ref | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | secondary carrier owner/schema 是 contracts 事实 | 不以 category alias/free-form map 补类型 | inherited_affected |
| `03-RPR-S09-PER-FLOW` | exact flow coverage 不能替代逐 flow 实现审计 | 不以 category 矩阵声称 vertical slice 完成 | inherited_affected |

Step 04 为 12 项提供永久禁止配置化和 fail-closed 入口，但关闭 `0/12`。本轮新发现上游 blocker=`none`。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已读取SOP Step04、书写规范§5.4及current红线 | pass | §3 |
| 九个SOP问题逐项回答 | pass | §4.1~§4.9 |
| old Step04后置审计且schema对象隔离 | pass | §5 / §5.1 |
| 五个主类别、两个约束属性与一类N/A已定义 | pass | §8.1 |
| hot/cold/new assembly/Job snapshot边界明确 | pass | §4.2~§4.3 / §8.2 |
| 24组禁止项均有source与变更流程 | pass | §8.3 |
| 23个配置域均标注适用/不适用类别 | pass | §8.4 |
| 每域更新时机与禁止项明确 | pass | §8.4~§8.5 |
| 逐域分类边界已停审 | pass | §8.5 |
| 跨分类owner与P1/P0边界已收口 | pass | §8.6~§8.7 |
| requirement VETO与formal redline无遗漏 | pass | §8.3 / §8.8 |
| diagnostic/debug/entry-local未静默新增 | pass | CAT-DIAG-N/A / §7 / §9 |
| `03`影响判定已完成 | pass | 当前无回写；§9 |
| formal §4草稿不含key/value/provider/deployment command | pass | §10 |
| 未进入Step05、未修改formal `04`或future Step | pass | 当前只更新Step04 / flow / project ledger |
| 未伪造实现、测试、验收、commit、run或evidence | pass | 全文只记录design conclusion / downstream input |
| 上游blocker | pass | `none` |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置类别已明确 | pass | §8.1 |
| hot/cold与snapshot边界已明确 | pass | §8.2 |
| 禁止配置化项及回退流程已明确 | pass | §8.3 |
| 23域分类边界已停审 | pass | §8.4~§8.5 |
| 跨分类/禁止项审计无unresolved conflict | pass | §8.6~§8.7 |
| `03` impact无actual待回写 | pass | §9 |
| Step04 gate_status | `pass_consumed_by_step_05` | 最终M3 redline与12项affected传播复核通过，连续授权已消费本Step |
| next_allowed_action | `continue_to_current_step_05_under_continuous_M4_authorization` | 按SOP进入Step05；不得将分类结论误写为最终source或配置项 |
