# L4-observability 04-配置设计 Step 03 · 建立配置控制面总览

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节: `04-配置设计.md` §3
> 当前模式: `full-restart`
> 本步边界: 建立配置来源、装配入口、读取边界、控制面、配置域与跨域owner；不定义最终source precedence、raw key、exact value、environment profile、secret provider、hot reload、产品或部署命令

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 03 `建立配置控制面总览` |
| 当前模块 | `control-plane-domain-map` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_03_control_plane.md` |
| 用户确认 | Step02 current复核已通过；用户于2026-08-02授权连续完成全部M4 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_04` |
| gate_reason | 九个SOP问题、来源与装配链、读取边界、11个控制面、23个配置域、逐域停审、跨域审计和telemetry owner均闭合，并已对最终formal `03`及12项affected完成后置复核 |
| blocker | `none` |
| next_allowed_action | `continue_to_current_step_04_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step01~02 | §3输入 | done | recovery point与用户确认一致 |
| 读取SOP Step03、书写规范§5.3和current上游 | §3输入 | done | runtime config / builder / adapter / architecture输入完整 |
| 回答九个SOP问题 | §4 | done | 来源、入口、reader、控制能力、下游和域划分均有结论 |
| 先按current source建立候选控制面 | §6~§8.4 | done | 不从旧Step03或formal `04`反推 |
| 后置审计旧Step03与L1参考 | §5~§6 | done | historical schema对象和自动门禁不进入current truth |
| 完成逐配置域停审和跨控制面审计 | §8.5~§8.7 | done | owner唯一、无不变量误配置、无unresolved overlap |
| 完成telemetry与`03`影响判定 | §8.8 / §9 | done | current无新增root field / port / builder stage |
| 形成formal §3草稿并自检 | §10~§12 | done | formal正文仍未修改，等待Step04确认 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step03中间产物全量重建；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step02 pass，用户已确认Step03 |
| 文档级门禁 | pass_for_current_step；flow允许Step03，不允许Step04 |
| Step思考状态 | done；先读current source与L1粒度，再读old Step03做差异审计 |
| 正式正文污染 | no；old formal `04`继续是historical material |
| 越过未来Step | no；不锁定Step04分类、Step05优先级、Step06 profile或Step07 key/value |
| `03`静默扩展 | no；telemetry不新增root section，future trigger显式记录 |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 建立从raw source到complete runtime、entry slice和Job snapshot的唯一配置流。
2. 固定哪些模块可读取raw / validated config，哪些模块只能接收port、façade、typed parameter或formal outcome。
3. 把Step02 P0/P1范围先拆成配置控制面，再拆成可在Step04~13逐域复用的功能模块。
4. 为每个配置域固定详细设计绑定、允许能力、禁止能力、priority与后续Step。
5. 对每个域完成来源、能力边界和`03`影响停审。
6. 通过跨控制面审计消除store、target、entry、execution、secret和lifecycle的重复owner。
7. 闭合runtime telemetry sink是否需要新增config/code contract的问题。

### 2.2 本步非目标

- 不把来源链箭头解释成最终优先级；Step05才决定覆盖、冲突和不可用策略。
- 不命名JSON key、env var、CLI flag、文件路径、topic、route、endpoint、credential key或schedule key。
- 不给duration、limit、retention、batch、retry、lease、timeout、freshness或SLO赋具体值。
- 不定义实际environment / deployment profile集合，不恢复旧`local-dev`、`ci-test`等字符串。
- 不决定启动、冷更新、热更新、drain、rollback和last-known-good算法。
- 不选择store、broker、telemetry、secret、scheduler、archive、GRC、dashboard或APM产品。
- 不新增`ValidatedObservabilityConfig`字段、enum、port、constructor、builder stage、error、flow或DTO。
- 不把配置域直接当最终config section；Step07仍须逐项映射到formal `03`的typed shape。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `配置设计讨论流程_SOP.md` Step03 | current process standard | 九个问题、来源链、控制面表、域表、逐域停审和跨域审计 |
| `配置设计书写规范.md` §5.3 / §6 | current writing standard | formal §3来源链图、控制面表与评审口径 |
| 通用三项设计标准与依赖裁剪规则 | current global standard | 逐Step、先思考后写、配置不改不变量、唯一compile dependency |
| `04_config_step_01_upstream_boundary.md` | current Step01 | 15个候选输入族、读取边界、builder / adapter输入和`03` trigger |
| `04_config_step_02_scope.md` | direct previous Step | P0/P1/P2/Forbidden、非范围、无配置判断和telemetry candidate |
| formal `01-架构设计.md` §5 / §8 | current architecture baseline | runtime/event/handoff外部边界、only-core compile edge、失效不接管truth |
| formal `02-概要设计.md` §4 / §5 / §11 | current HLD baseline | 10业务组成部分、实现分层、配置影响轮廓和禁止配置化边界 |
| formal `03-详细设计.md` §4 / §5 / §13 / §14 | direct code baseline | 七crate owner、infra文件、root config、builder、entry slice、telemetry hook和redline |
| `03_ddd_step_14_config_external_binding.md` §8~§18 | detailed config baseline | 三层形态、reader矩阵、typed sections、catalog、adapter requirement、13-stage assembly |
| `03_ddd_step_15_observability_audit.md` | telemetry baseline | host-managed sink、allowlist/redaction、self-recursion、non-authority与config handoff |
| old `04_config_step_03_control_plane.md` | historical material | 后置诊断其81行schema-first、无来源链/域/停审与自动推进问题 |
| L1-governance / L1-artifact Step03 | granularity reference | 参考控制面、域表、停审、影响判定结构，不复制相邻域配置truth |

### 3.1 真相源与拆分原则

| 原则 | 本Step解释 |
|---|---|
| Code contract先于配置分组 | 控制面必须回指formal `03`既有section、reader、builder、adapter或entry slice |
| 控制面不是crate列表 | 按配置行为与owner拆分，再列实现module；不能只按`infra/api/worker/jobs`分组 |
| 配置域不是raw key | 域是Step04~13的审查主语，不提前承诺JSON nesting或env prefix |
| Reader只能收窄 | raw只由`infra::config`读取；application/domain/contracts不得因方便新增config依赖 |
| Conditional required仍属P0 | optional resolver/target可Disabled，但enabled mapping、failure和totality仍在P0控制面 |
| Snapshot是控制面边界 | config change只影响new assembly/new Job；old Job / effect继续使用stored snapshot/binding |
| Telemetry不反向定义root config | existing host-managed hook先作为P1 integration handoff；需要runtime field时必须回写`03` |
| Forbidden横切所有域 | truth、安全、state、UoW、no-write、idempotency、fence/token/probe和evidence authority不归任何配置域 |

## 4. SOP问题回答

### 4.1 当前系统配置从哪些来源读取?

当前可确认的**raw配置来源类别**只有code baseline、external config file与environment variable。它们必须汇入同一个raw candidate，不能各自绕过validator直接构造adapter。Sensitive locator是raw配置中的typed ref，resolved material在后续infra boundary取得；LocalTest / IntegrationLike的fixture / controlled ref也是adapter binding value，不是独立override source。Remote config center、admin override、automatic hot reload属于Step02 P2，不进入current来源链。

Step03只确认来源存在性和汇流关系，不确认哪一来源覆盖哪一来源。`secret refs`也不是“secret value覆盖普通值”：普通配置仅携带locator，resolved material在assembly stage 5进入adapter-private memory，不能回填root config。

### 4.2 配置进入系统的唯一或主要装配入口是什么?

唯一主链为:

```text
raw source readers
  -> infra::config loader / parser / validator
  -> ValidatedObservabilityConfig + ConfigBindingRef
  -> infra::runtime_builder 13-stage complete-or-error assembly
  -> BuiltObservabilityRuntime
  -> API / worker / jobs validated slices + application façades
  -> accepted Job freezes JobExecutionConfigSnapshot
```

Entry-local registration是builder stage 13，不是第二配置入口。API、worker、jobs不能自行读取env后修改slice，也不能在Job resume时重读current root config重建snapshot。

### 4.3 哪些模块读取配置，哪些模块不得直接读取配置?

| 模块 | 允许读取 / 接收 | 注入方式 | 禁止读取 / 持有 |
|---|---|---|---|
| `infra::config` | code baseline、file/env source、secret locator、fixture/controlled locator | load / parse / validate | raw secret进入validated shell、issue、log、report |
| `infra::runtime_builder` | complete `ValidatedObservabilityConfig` | immutable build input | business outcome、partial runtime、invariant override |
| infra adapter constructors | assigned typed section与adapter-private resolved material | builder stage injection | root config扩散、provider body越过infra |
| `api` composition root | `ValidatedApiEntryConfig` + allowed façades | builder output | raw source、root config、repository、UoW、target catalog |
| `worker` composition root | `ValidatedWorkerEntryConfig` + inbound/publication façades | builder output | raw source、direct adapter/store、truth-write bypass |
| `jobs` composition root | `ValidatedJobsEntryConfig` + current Job DTO + façades | builder output / invocation input | raw source、target catalog、snapshot assembly、resume hot-read |
| `application` | executable typed parameters、ports、safe target catalog、stored Job snapshot | constructor / operation input | file/env/secret/endpoint/topic/infra section/root config |
| `domain` | validated pure policy input / formal outcome | application method parameter | raw/validated config、profile、retry、health、product kind |
| `contracts` | none | n/a | profile、mode、binding、timeout、secret、store配置 |

### 4.4 配置控制哪些行为，不控制哪些领域不变量?

配置允许控制source selection、runtime class、bounded boundary、policy locator、adapter/store binding、capability requirement、entry enablement与mapping、schedule/cadence、bounded execution参数、new assembly activation和historical binding解析。它只能选择正式代码契约中已经存在的运行承载。

配置不控制observation / external truth ownership、raw-body排除、state transition、accepted UoW写序、logical key/digest字段集、Query no-write、Consumer/Job no-source-repair、retention hold、claim/fence、stable token/probe、gap / delivery语义、telemetry authority或evidence / acceptance结论。Forbidden项没有任何“所属配置域”，只作为每个域必须通过的横切否定门禁。

### 4.5 配置变化会影响哪些下游文档?

| 下游 | Step03交付 | 不在本Step给出的内容 |
|---|---|---|
| Step04 | 控制面/配置域和逐域禁止能力 | exact分类、cold/hot判定与完整禁止表 |
| Step05 | 来源类别、唯一汇流点、owner | 最终priority、conflict和unavailable策略 |
| Step06 | formal runtime class与域适用性 | actual environment/profile矩阵 |
| Step07 | 域到typed section / consumer映射 | raw key、type、default、range、unit、source |
| Step08 | sensitive locator域、adapter-private边界 | provider、rotation和secret audit细节 |
| Step09~11 | builder、activation、snapshot和failure边界 | exact load/change/degrade/rollback算法 |
| current `05/06` | domain/profile/failure组合 | TC/AC/evidence、阈值或通过声明 |
| current `07` | config module / adapter / entry / lifecycle boundary inventory | phase/task/commit/command和真实reality result |
| deployment/operations | source、binding、activation semantic handoff | mount、permission、真实值、发布和runbook命令 |

任一后续结论若需要新增`03` field/enum/port/constructor/builder stage/error/flow，必须先回写`03`，不能由下游文档吸收。

### 4.6 每个配置控制面应拆成哪些配置域 / 功能模块?

本Step采用11个控制面、23个配置域。控制面按“谁拥有配置语义和validation”划分，配置域按“后续能否独立分类、列项、验证、变更和失败”划分。`technical`、`boundary`等10个formal section是code shape，不机械等于11个控制面；一个控制面可组合多个section，一个section也可被拆成多个有独立failure semantics的域。

### 4.7 每个配置域对应哪些详细设计绑定?

每个域在§8.4回指至少一项current binding：`ValidatedObservabilityConfig` section、`ConfigBindingRef`、adapter family、`ExternalEffectBindingCatalog`、entry slice、`JobExecutionConfigSnapshot`、runtime builder stage、`observability_hooks.rs`或formal external dependency seam。没有current binding的候选不得进入current域；它只能成为P2或`03`待回写。

### 4.8 每个配置域完成后是否通过停审?

23个配置域均已按“来源 / reader明确、允许能力明确、禁止能力明确、`03`影响明确”停审，见§8.5。Exact key/value/source order尚未定义不构成Step03缺口，因为它们已有明确后续Step；若缺的是代码owner或typed binding，则不能以“后续Step”掩盖。

### 4.9 跨控制面是否存在重叠、不变量误配置化或未识别的`03`影响?

跨域owner已收口：source只归acquisition；profile/mode归technical；request/schema/entry mapping归boundary-entry；policy refs归safety；store capability归store；retention/digest归compatibility；batch/lease/retry归projection-execution；resolver与effect target分离；activation/history归lifecycle；secret只作为上述binding的敏感解析横切面。Telemetry sink不进入root control plane。当前无unresolved overlap、无实际`03`回写项，上游blocker=`none`。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本Step处理 |
|---|---|---|
| Step02 §8.3 | P0范围已有16行，但还不是稳定控制面和域owner | 重组为11个控制面、23个配置域，并保留formal binding回指 |
| formal `02` §11 | 按10个业务组成部分列配置影响，容易使同一store / policy / job参数重复归属 | 从配置owner角度去重，业务部分仅作为consumer |
| formal `03` §13.3 | 10个typed section固定code shape，但不能直接等同JSON模块或评审域 | 按行为拆/并域，Step07再映射回section字段 |
| formal `03` §13.4 | code binding与missing behavior清楚，source chain和域间owner尚未说明 | 建立唯一来源/装配链及overlap ownership |
| formal `03` §14 / Step15 | telemetry hook存在，backend具体crate/config后移，但root config无telemetry field | 采用host-managed P1 handoff；不新增project runtime config；future field触发`03`回写 |
| old Step03全文 | 81行重复log/metric/trace/audit schema对象，没有来源链、控制面、配置域、停审或跨域审计 | 整份替换，旧对象仅保留historical诊断身份 |
| old Step03门禁 | `next_step_or_formal_assembly`允许自动推进 | 替换为`wait_user_confirmation_before_step_04` |
| L1参考 | 有控制面与域表，但部分按相邻域对象 / 旧profile拆分 | 只采用结构和停审深度，按current Observability契约重建 |

### 5.1 Historical material隔离

旧Step03中的`NormalizedLogRecord`、`MetricPoint`、`MetricRollup`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`和`EvidenceLink`不是current配置域。Current formal `03`明确不存在durable runtime span/log/metric store，runtime telemetry与durable audit分层；Step03只设计配置如何流入runtime与adapter，不重新定义任何observation schema。

README中的TimescaleDB、Grafana、P95、147 events、hash chain、cold retention和具名产品也没有进入current控制面。它们若有未来需求，必须先在owning design / ADR取得current source。

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Step03粒度 | 81行schema-first摘要 | 九问、来源链、11控制面、23域、逐域停审、跨域审计和影响判定 | 满足SOP并达到可供Step04~13复用的粒度 |
| 配置来源 | 未画 | 明确三类raw source、binding locator与source的区别及P2排除，但不提前锁定priority | 为Step05提供真实输入而不越步 |
| 装配入口 | 泛称配置设计 | 固定raw -> validated -> 13-stage builder -> built runtime -> slices/snapshot | 承接formal `03` exact contract |
| reader boundary | 未定义 | infra raw/validated reader、entry slice、application/domain/contracts禁止面完整 | 防止env/config泄漏到业务层 |
| 控制面主语 | log/metric/trace/audit对象 | runtime configuration ownership与功能域 | Step03设计配置，不重做DDD对象 |
| typed sections关系 | 未承接 | 每域回指现有section / catalog / builder / adapter | 防止配置字符串发明代码契约 |
| overlap owner | 未审计 | store、entry、target、retry、secret、snapshot、telemetry均唯一归属 | 防止Step07重复key和冲突validation |
| telemetry sink | 默认像独立配置面 | host-managed P1 handoff，不进root config；runtime-selectable时回写`03` | current root无telemetry field/port |
| 推进门禁 | 自动下一步或装配 | Step03 pass后停审等Step04确认 | 遵守逐Step规则 |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 来源链表达 | 画汇流与装配链，不声明最终precedence | 直接沿标准例图写死override order | Step05才有足够输入定义冲突与优先级 |
| 域拆分轴 | 配置行为 / owner + formal binding | 10业务组成部分；10 typed sections；七crate | 前者可独立验证且避免重复，后者分别是业务、code shape和技术层 |
| boundary与entry | 同一控制面内拆两个域 | 完全混合；或将entry单列无boundary约束 | schema/size/enablement共同发生在pre-dispatch，但mapping owner仍可区分 |
| digest与technical retention | 同一compatibility控制面拆两域 | 合并到store；或业务retention marker | 它们管理replay兼容材料，不是store选择或业务retention state |
| resolver与external effect | 分成safe resolution和outbound effect两个控制面 | 泛化为`external`一个域 | read-like resolution与token/probe/intent effect有不同authority与failure |
| activation与historical binding | 独立lifecycle控制面 | 散入每个adapter域 | new/old assembly、Job snapshot和binding retirement需统一审查 |
| telemetry backend | host-managed P1 integration handoff | 新增`telemetry`root section；塞进clock/ID `technical` | 两个未采用方案都会静默改变formal `03` field/semantics |
| environment | 作为cross-domain profile视图，不成为独立truth owner | 每个profile复制一套配置域 | Step06做矩阵，避免profile漂移成第二schema |
| sensitive refs | 作为binding解析横切面，不创建万能secret域 | 把所有locator集中成无owner map | required condition与rotation必须跟随具体adapter/target/store owner |

## 8. 结构化中间产物

### 8.1 配置来源链图: L4-observability 配置汇流与装配链

```text
[code baseline/default-or-required declarations]
                |
[external config file] ----+
                |          |
[environment variables] ---+--> [infra::config raw candidate]
                                        | contains typed fixture /
                                        | controlled / sensitive locators
                                        | parse / type / range /
                                        | cross-field / profile /
                                        v redline validation
                                            |
                                            v
                              [ValidatedObservabilityConfig]
                              [ConfigBindingRef, body-free]
                                            |
                                            v
                              [infra::runtime_builder]
                              [13-stage complete-or-error]
                                  |                 |
                    resolve sensitive refs          |
                    in adapter-private memory       |
                                  |                 v
                                  +------> [BuiltObservabilityRuntime]
                                             |              |
                                             |              +--> [application façades / ports]
                                             |
                   +-------------------------+-------------------------+
                   v                         v                         v
        [ValidatedApiEntryConfig] [ValidatedWorkerEntryConfig] [ValidatedJobsEntryConfig]
                   |                         |                         |
                   +-------------------------+-------------------------+
                                             |
                         entry combines assigned slice + allowed façade
                                             |
                                             v
                                [accepted Job start only]
                                             |
                                             v
                               [JobExecutionConfigSnapshot]
                               [frozen with accepted Job plan]
```

关键说明:

- 图表达来源类别、唯一汇流点、validation和装配去向，不表达Step05最终source precedence。
- Sensitive locator与fixture / controlled ref是raw candidate中的typed binding value，不是独立override source；resolved secret只在builder/adapter-private阶段使用。
- Fixture / controlled binding只允许formal profile/mode组合，不能成为RuntimeLike隐式fallback。
- `BuiltObservabilityRuntime`必须complete-or-error；entry slice不能扩权，entry不能另读env修改validated值。
- Job start冻结相关typed subset与binding，resume / finalize不得从new assembly或current config重建。
- Remote config center、admin override和automatic hot reload不在current链；它们是P2 reopen trigger。
- 架构/领域不变量不参与任何source override，Forbidden项没有可被覆盖的key。

### 8.2 配置读取与注入边界图

```text
raw source
   |
   v
infra::config --> infra::runtime_builder --> concrete infra adapters
                         |
                         +--> safe external catalog / executable parameters
                         |             |
                         |             v
                         |        application façades
                         |
                         +--> API / worker / jobs validated slices

contracts : reads no config
domain    : receives validated pure input / formal outcome only
application: receives ports, safe catalog, typed parameters, stored snapshot
entries   : receive assigned slice + façade; no root/raw config access
```

该边界意味着“模块受配置影响”不等于“模块读取配置”。Application service可以接收`PositiveLimit`、`RetryPolicyConfig`或safe catalog，但不能接收`ValidatedObservabilityConfig`，更不能解析file/env/secret。

### 8.3 配置控制面总表

| ID | 控制面 | 作用 | 对应模块 / binding | Priority | 是否P0 |
|---|---|---|---|---|---|
| `CP-01` | acquisition / identity | 把合法source汇成唯一raw candidate，建立body-free config revision | `infra::config`;`ConfigBindingRef`;builder stage 1~4 | P0 | 是 |
| `CP-02` | technical / runtime class | 选择formal runtime class、clock与ID构造方式 | `profile`;`technical`;`clock_id.rs`;builder stage 3/7 | P0 | 是 |
| `CP-03` | boundary / entry dispatch | 在pre-dispatch固定limit/schema/enabled set/consumer/schedule/loop映射 | `boundary`;`entries`;three entry slices;stage 11/13 | P0 | 是 |
| `CP-04` | safety / policy binding | 注入redaction、allowlist、safe label、correlation、visibility、body-free policy | `safety`;infra validators;application pure inputs | P0 | 是 |
| `CP-05` | store / transaction capability | 绑定四类store、UoW、schema和required capability | `stores`;repository/UoW builders;stage 6~7 | P0 | 是 |
| `CP-06` | digest / technical retention compatibility | 保持digest read/write与reservation/intent材料生命周期可解释 | `digest`;`idempotency`;serializer/store loaders | P0 | 是 |
| `CP-07` | projection / execution | 固定bounded capture、batch、freshness、claim、parallelism、retry与Job timeout | `projection`;`execution`;Job start/snapshot | P0 | 是 |
| `CP-08` | safe resolution | 绑定四类resolver及formal availability，不保存外部正文 | `external` resolver fields;resolver builders;availability registry | P0 schema + P1 endpoint material | 是 |
| `CP-09` | outbound effect / target catalog | total-map publisher、12 event targets、handoff/export target与phase capability | `external`;safe catalog;publisher/delivery adapters | P0 schema + P1 target material | 是 |
| `CP-10` | activation / historical compatibility | new complete assembly、old Job snapshot/binding解析、drain/rollback/retire guard | builder stage 12~13;snapshot;binding refs | P0 lifecycle + P1 operations material | 是 |
| `CP-11` | verification / environment view | 以formal runtime class横切展示组合、negative gate和下游验证输入 | all sections;formal test cuts;current `05/06` handoff | P0 verification view | 是 |

以下内容不是独立current control plane:

- `runtime telemetry backend/sink`: host-managed `observability_hooks.rs` P1 integration handoff，见§8.8；current root config无field。
- `secret`: 是CP-05/08/09等binding的infra-only解析横切面，Step08展开，不形成无owner万能map。
- `business retention marker`: 属于domain truth，不是CP-06 technical retention配置。
- `dashboard/alert/GRC`: 是CP-09 optional consumer target或P2 product material，不定义core control plane。

### 8.4 配置域 / 功能模块总表

| Domain ID | 配置域 / 功能模块 | 来源控制面 | Formal `03`绑定 / reader | 允许配置的能力 | 禁止控制的能力 | 后续Step |
|---|---|---|---|---|---|---|
| `CFG-D01` | source acquisition | CP-01 | raw loader;builder stage 1 | 选择current支持的baseline/file/env来源并形成一个candidate | 多入口绕validator、把fixture/secret resolution当override source、remote/admin/hot source、部署命令 | 04/05/07/09/11 |
| `CFG-D02` | config identity | CP-01 | `ConfigBindingRef`;stage 4 | 建立body-free、可审计、可关联的validated revision | path/secret/body/run/evidence作为identity | 04/07/09/10/13 |
| `CFG-D03` | runtime class and technical adapters | CP-02 | `profile`;`technical`;clock/ID constructors | 选择LocalTest/IntegrationLike/RuntimeLike允许的clock/ID mode和binding | fake/deterministic进入RuntimeLike、time/ID定义business truth | 04/06/07/09/11 |
| `CFG-D04` | protocol boundary | CP-03 | `boundary`;API/worker pre-parser | bounded request/page/query timeout和accepted schema set | 改public schema、truncate后继续、绕actor/visibility | 04~07/09/11 |
| `CFG-D05` | entry dispatch and scheduling | CP-03 | `entries`;three entry slices | enabled sets、9 Consumer exact mapping、optional schedule、outbox cadence/limit | entry扩权、schedule生成actor/key/scope/run、Disabled consume/ack | 04~07/09/11 |
| `CFG-D06` | redaction and body-free safety | CP-04 | `safety`;validators;`observability_hooks.rs` allowlist | policy locator与finite allowlist，失败fail closed | raw body开关、disable scanner/redaction、hash逃逸 | 04/05/07~11 |
| `CFG-D07` | correlation / safe label / visibility policy | CP-04 | `safety`;application pure inputs | 绑定既有typed correlation、label、visibility policy basis | opaque ref推truth、high-cardinality label、not-visible=missing | 04/05/07~11 |
| `CFG-D08` | observation + atomic idempotency store group | CP-05 | `stores.observation`;`idempotency_result`;UoW builder | 选择满足同UoW、unique/CAS与schema能力的binding | 改logical key/write order、cache authority、in-memory fallback | 04~07/09/11/14 |
| `CFG-D09` | projection store | CP-05 | `stores.projection`;source/planner/store builder | 选择bounded capture与atomic replace兼容store | Query inline rebuild、projection替truth、false Fresh | 04~07/09/11/14 |
| `CFG-D10` | Job execution / report store | CP-05 | `stores.job_execution`;plan/claim/fence/report builder | 选择global work key、monotonic fence和durable report binding | process lock替代、disable fence、重建missing plan/report | 04~07/09/11/14 |
| `CFG-D11` | transaction / schema compatibility | CP-05 | `transaction_timeout`;`required_schema_revision`;stage 6 | 绑定timeout与required compatible revision | 自动migration业务truth、timeout=rollback proof、best effort UoW | 04/05/07/09~11/13 |
| `CFG-D12` | digest compatibility | CP-06 | `digest`;digest builders/loaders | 选择formal write/read profile并执行retire guard | 配置digest字段集/算法、覆盖旧digest、移除in-use profile | 04/07/09/10/13 |
| `CFG-D13` | technical reservation / intent retention | CP-06 | `idempotency`;reservation/result/intent stores | bounded Command/Consumer/Job/reconciliation/intent保留窗口 | 删除unresolved material、授权source cleanup、替代RetentionMarker | 04/06/07/09~11/13/14 |
| `CFG-D14` | projection bounds / freshness | CP-07 | `projection`;source reader/planner/Job start | bounded capture/closure/four batch与freshness policy | overflow partial success、inline repair、Fresh伪造 | 04/06/07/09/11/14 |
| `CFG-D15` | claim / concurrency / Job budget | CP-07 | `execution.claim_lease/max_parallelism/max_plan/job_timeout`;snapshot | lease/heartbeat、bounded parallel/plan和safe invocation budget | disable fence、timeout证明rollback、resume热读 | 04/06/07/09~11/14 |
| `CFG-D16` | retry policies | CP-07 | four typed retry policies;service wrappers;snapshot | formal recovery允许时的same-input/additional-attempt budget | retry改token/binding/material、Unknown自动retry、adapter blind mutation retry | 04/06/07/09~11/14 |
| `CFG-D17` | safe resolver bindings | CP-08 | four `ExternalAdapterBindingConfig`;resolver builders | Fake/Controlled/Endpoint/Disabled、locator、timeout与availability | body/default truth、provider status直通、non-core Cargo dependency | 04~11/13/14 |
| `CFG-D18` | event publication binding | CP-09 | publisher binding;12 target mappings;safe catalog | event subject到exact historical effect/transport binding与Publication capability | route改变event schema、current target重定向old row、Published=consumed | 04~11/13/14 |
| `CFG-D19` | report handoff targets | CP-09 | report target catalog;handoff adapter | consumer到Preparation/Delivery binding、credential ref和Disabled/Unavailable | receipt=verdict/signoff、fallback target、真实run/evidence配置 | 04~11/13/14 |
| `CFG-D20` | peripheral export targets | CP-09 | peripheral catalog;export adapter | optional consumer的Preparation/Delivery binding与failure surface | external product反写truth、Delivered=fact accepted、核心依赖外围 | 04~11/13/14 |
| `CFG-D21` | sensitive reference resolution | CP-05/08/09 | builder stage 5;adapter-private memory | locator/ref、conditional required和infra-only resolution | raw secret进入root/application/log/report/snapshot | 04/05/07~11/13 |
| `CFG-D22` | activation / rollback / historical binding | CP-10 | complete runtime;stored snapshot/effect ref;stage 12~13 | new assembly切换、old drain、rollback与binding retirement guard | in-place hot swap、重写durable material、old token切current route | 04/09~11/13/14 |
| `CFG-D23` | environment / verification matrix | CP-11 | `RuntimeProfileClass`;all domains;formal test cuts | 展示每个class/domain allowed/required/disabled组合和negative gates | 新enum/profile暗增、profile改变Cargo/truth/invariant、伪造test result | 04/06/12/14 |

### 8.5 配置控制面停审记录

| 配置域 | 来源/reader | 允许与禁止能力 | `03`契约影响 | 结论 | 缺口 / 修正 |
|---|---|---|---|---|---|
| CFG-D01 source acquisition | 清楚；raw只进`infra::config` | 清楚；不含P2 source | 无 | pass | Step05再定precedence |
| CFG-D02 config identity | 清楚；stage 4 | 清楚；body-free且非evidence | 无 | pass | Step10定义change audit material |
| CFG-D03 runtime/technical | 清楚；profile + technical | 清楚；formal mode约束固定 | 无 | pass | Step06映射actual environments |
| CFG-D04 protocol boundary | 清楚；pre-parser / mapper | 清楚；limit不改schema/invariant | 无 | pass | Step07补exact bounded value |
| CFG-D05 entry dispatch | 清楚；three entry roots | 清楚；enabled mapping total、slice不扩权 | 无 | pass | schedule/loop exact值后置 |
| CFG-D06 redaction/body-free | 清楚；validator + hook | 清楚；无disable/bypass | 无 | pass | Step08补sensitive来源 |
| CFG-D07 correlation/label/visibility | 清楚；policy refs -> pure input | 清楚；不推truth、不泄露 | 无 | pass | policy locator schema后置 |
| CFG-D08 atomic store group | 清楚；store/UoW builder | 清楚；binding不改UoW/key | 无 | pass | product capability proof后置 |
| CFG-D09 projection store | 清楚；projection builder | 清楚；不inline rebuild/false Fresh | 无 | pass | product capability proof后置 |
| CFG-D10 Job store | 清楚；plan/claim/report builder | 清楚；global fence不可配置关闭 | 无 | pass | unsupported时Job root拒绝 |
| CFG-D11 transaction/schema | 清楚；stage 6 | 清楚；不自动migration truth | 无 | pass | migration细节Step13 |
| CFG-D12 digest | 清楚；builder/loaders | 清楚；code-versioned fields不配置 | 无 | pass | current只承接formal v1 |
| CFG-D13 technical retention | 清楚；technical stores | 清楚；不等于business marker | 无 | pass | exact values Step07/14 |
| CFG-D14 projection bounds | 清楚；reader/planner/start | 清楚；overflow whole-boundary fail | 无 | pass | exact values Step07/14 |
| CFG-D15 claim/concurrency/budget | 清楚；execution/snapshot | 清楚；fence/snapshot不变 | 无 | pass | exact values Step07/14 |
| CFG-D16 retry | 清楚；typed policy/snapshot | 清楚；recovery+budget双门禁 | 无 | pass | exact backoff Step07 |
| CFG-D17 resolver | 清楚；four builders | 清楚；formal result且body-free | 无 | pass | Endpoint instance为P1 material |
| CFG-D18 publication | 清楚；catalog/publisher | 清楚；exact old binding与same token | 无 | pass | target instance为P1 material |
| CFG-D19 handoff | 清楚；target catalog/adapter | 清楚；delivery不等于acceptance | 无 | pass | consumer instance为P1 material |
| CFG-D20 export | 清楚；target catalog/adapter | 清楚；外围不反写core | 无 | pass | consumer instance为P1 material |
| CFG-D21 sensitive refs | 清楚；stage 5 only | 清楚；raw material不扩散 | 无 | pass | provider/rotation Step08/10 |
| CFG-D22 lifecycle/history | 清楚；complete runtime + stored refs | 清楚；new/old隔离且不重写truth | 无 | pass | exact activation algorithm Step09/10 |
| CFG-D23 environment/verification | 清楚；formal class横切view | 清楚；不创造profile/schema/result | 无 | pass | actual matrix Step06/12 |

### 8.6 跨控制面owner与重叠收口表

| 易重叠事项 | 唯一owner | 其他域只可引用什么 | 禁止重复定义 |
|---|---|---|---|
| raw source / precedence | CFG-D01 | config ref / validated value | adapter/entry各自读env或设默认；把fixture/secret resolution当source |
| config revision | CFG-D02 | body-free `ConfigBindingRef` | path、deployment、Job或evidence identity |
| runtime class / fake guard | CFG-D03 | validated allowed mode | environment域新增class或adapter私判profile |
| schema / operation enablement | CFG-D04 / D05 | formal operation/schema enum | target route、schedule或product改协议 |
| safety policy | CFG-D06 / D07 | validated pure input / formal result | resolver、entry、telemetry自行弱化redaction/visibility |
| store choice/capability | CFG-D08~D11 | qualified repository/UoW handle | execution或profile改logical transaction semantics |
| digest / technical retention | CFG-D12 / D13 | frozen profile/window | store cleanup或business retention marker改其含义 |
| batch / claim / retry | CFG-D14~D16 | accepted Job snapshot | schedule、adapter或operator invocation覆盖frozen值 |
| resolver binding | CFG-D17 | body-free formal resolution | entry route或application选择provider |
| outbound destination | CFG-D18~D20 | safe exact binding metadata | entry config包含outbound route；current target替old ref |
| secret material | CFG-D21 | locator + availability only | 任一域保存raw secret或provider body |
| activation / historical refs | CFG-D22 | new assembly eligibility / stored old ref | 单adapter热换、rollback重写plan/outbox/intent |
| environment组合 | CFG-D23 | domain values和requiredness | 复制第二套field/default/schema |
| runtime telemetry sink | host integration handoff，非current root域 | safe hook availability/failure boundary | 塞入`technical`、以sink outcome驱动business或新增key |

### 8.7 跨控制面审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step02 P0范围是否全覆盖 | pass | source、runtime、boundary、safety、store、digest/retention、execution、external、entry、lifecycle、verification均有owner |
| Step02 P1是否与P0 schema区分 | pass | P0定义existing seam完整语义；Endpoint/target/telemetry/production material标P1实例 |
| P2是否混入current来源或域 | pass | remote/admin/hot/multi-region/tenant等未进入D01~D23 |
| 是否直接生成配置项清单 | pass | 当前只有域和binding；raw key/type/default留Step07 |
| 来源链是否偷写最终priority | pass | 只表达汇流；Step05仍需正式决策 |
| 是否存在无owner重叠 | pass | §8.6给出13类唯一owner，当前无unresolved overlap |
| 是否机械复制10 typed sections | pass | section按行为拆/并，但每域可回指formal字段 |
| 是否遗漏entry-local args边界 | pass | entry只收slice；未来新增CLI/env必须Step05/07列正式schema，不在本Step猜测 |
| 是否配置化业务不变量 | pass | Forbidden横切且不归任一域；每域禁止列完整 |
| 是否保持truth / telemetry分层 | pass | telemetry sink非authority、非durable owner、非root config current域 |
| 是否保持evidence / handoff边界 | pass | D19只配置target/binding，receipt不等于verdict/run/evidence/signoff |
| 是否保持retention分层 | pass | D13 technical material、business marker、telemetry backend retention三者分离 |
| 是否保持only-core compile edge | pass | D17~D20全部runtime/event/handoff binding，不引入sibling Cargo edge |
| 是否需要新增`03` field/port/stage | 未发现 | current全部可由existing binding承接；future trigger见§9.2 |
| telemetry candidate是否闭合 | pass | host-managed P1 handoff；runtime-selectable field/locator要求会阻塞并回写`03` |
| 下游是否可逐域承接 | pass | 每域列出Step04~14入口，Step06/07/12/14覆盖矩阵完整 |

### 8.8 Telemetry sink专项影响判定

| 问题 | current结论 | 理由 / 边界 |
|---|---|---|
| 是否已有telemetry实现接缝 | 是 | formal `03`固定`infra/observability_hooks.rs`，entry/application/infra boundary可emit，domain不依赖backend |
| root config是否已有telemetry field/section | 否 | `ValidatedObservabilityConfig`只有profile、technical(clock/ID)及boundary/safety/stores/digest/idempotency/projection/execution/external/entries |
| 是否可把sink塞进`technical` | 否 | `TechnicalRuntimeConfig` exact semantics只有clock / ID；扩充会改formal field与builder contract |
| current `04`是否生成telemetry sink key | 否 | 无existing typed owner，生成key会让配置先于code contract |
| 当前如何承接 | host/process composition提供host-managed telemetry façade；`04`只引用其non-authority、redaction、recursion和failure invariant | 这是P1 implementation/integration handoff，不是runtime config value |
| backend/product/sampling/bucket/retention/threshold如何处理 | product / operational material留ADR、current `05/06/07`或operations；不得成为business truth | Step15已明确这些后移，但“后移”不等于批准新增root field |
| 何时触发`03`回写 | 若要求按project config选择sink、locator、sampling/bucket/retention参数，或builder需要telemetry constructor/port/availability field | 停止对应域，回formal `03` §5/§13/§14及Step07/14/15，闭合field、owner、failure和test |

Current结论消除了Step02 `OBS-CFG-SCOPE-R-004` 的owner不确定性：**current root configuration不拥有telemetry sink；host integration handoff拥有具体sink注入。** 这不表示backend已选、实现已存在或production telemetry已可用，也不允许实现者现场新增env key。

## 9. 对详细设计的影响判定

### 9.1 当前结论

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 唯一链固定为raw -> validated -> builder -> built runtime -> slices/snapshot | 否 | 承接formal `03` §13 | 不适用 | 无回写 |
| 11控制面与23配置域 | 否 | 对existing section/binding按配置owner重组 | 不适用 | 无回写 |
| raw config只有`infra::config`读取 | 否 | 承接formal module ownership | 不适用 | 无回写 |
| application/domain/contracts不读取root/raw config | 否 | 承接constructor / dependency边界 | 不适用 | 无回写 |
| entry只接收validated slice与façade | 否 | 承接builder stage 11~13 | 不适用 | 无回写 |
| resolver、publisher、handoff/export与entry target owner分离 | 否 | 承接`ExternalBindingSet` / `EntryBindingConfig` | 不适用 | 无回写 |
| sensitive refs只在builder stage 5与adapter-private memory解析 | 否 | 承接formal security boundary | 不适用 | 无回写 |
| telemetry sink不进入current root配置，采用host-managed P1 handoff | 否 | 对existing hook和root field absence的边界判定 | 不适用 | 无回写 |
| Forbidden项无配置域owner | 否 | 承接formal redline | 不适用 | 无回写 |

### 9.2 Future impact trigger

| 后续发现 | `03`影响 | 处理规则 |
|---|---|---|
| 任一D01~D23需要existing root之外的新field/enum | 是 | 标`待回写`，回formal `03` §13 / Step14后再继续该域 |
| 需要application/domain/entry直接读root/raw config | 是且通常违反边界 | 停止；优先重构为typed parameter/port/slice，确需改变则回§4~§8/§13 |
| telemetry需要runtime-selectable sink/locator/parameter | 是 | 回§5/§13/§14及Step07/14/15闭合owner、constructor、failure、recursion和test |
| 新source需要remote/admin/hot reload | 是 | 先重开formal `00/01/03/04`的authorization/audit/topology/lifecycle设计 |
| new adapter family / capability / external phase | 是 | 回formal `03` contracts/ports/flow/error/config，不得以string key预留 |
| environment profile需要新`RuntimeProfileClass` | 是 | 回formal `03` enum、validation、test和migration，再进入Step06 |
| entry新增CLI/env local arg | 可能是 | 必须有正式arg schema、binary、scope、default/missing和global override边界；影响constructor则回`03` |

当前actual影响表没有`待回写`或`阻塞待确认`；上游blocker=`none`。

## 10. 回填草稿

以下草稿只供Step15装配formal `04` §3；当前不修改正式正文。

````md
## 3. 配置控制面总览

> 校准来源:
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源链图”“配置读取与注入边界图”“配置控制面总表”“配置域 / 功能模块总表”“配置控制面停审记录”“跨控制面审计”和“Telemetry sink专项影响判定”,了解配置如何汇流、装配并保持不反写业务truth。

#### 配置来源链图: L4-observability 配置汇流与装配链

```text
[code baseline] ----+
[config file] -------+--> [infra::config raw candidate]
[environment] -------+       contains typed binding locators
                                   | validate
                                   v
                       [ValidatedObservabilityConfig]
                                   |
                                   v
                       [infra::runtime_builder]
                          complete-or-error
                                   |
                                   v
                        [BuiltObservabilityRuntime]
                           |               |
                           |               +--> [application façades]
                           |
                           +--> API / worker / jobs validated slices
                                           |
                             entry combines slice + allowed façade
                                           |
                              accepted Job start freezes snapshot

[fixture / controlled locator] -> raw typed value,not an override source
[sensitive locator]            -> raw typed value;resolved material is adapter-private
```

该图只表达来源类别、唯一汇流点和装配去向,不表达最终source precedence。Raw source只由`infra::config`读取；application/domain/contracts不读取raw或root config，entry只接收assigned validated slice与façade。Job start冻结相关配置与exact binding，resume不得热读current config。

| 控制面 | 作用 | 对应模块 | 是否P0 |
|---|---|---|---|
| acquisition / identity | 汇流合法source并建立body-free config revision | `infra::config`;builder stage 1~4 | 是 |
| technical / runtime class | 约束runtime class、clock和ID binding | `profile`;`technical`;clock/ID builder | 是 |
| boundary / entry dispatch | 固定pre-dispatch limits/schema/enabled mapping | `boundary`;`entries`;entry slices | 是 |
| safety / policy binding | 注入不可绕过的redaction、allowlist、correlation、visibility和body-free policy | `safety`;validators | 是 |
| store / transaction capability | 绑定store/UoW/schema/atomicity/CAS/fence capability | `stores`;repository/UoW builder | 是 |
| digest / technical retention | 保持digest与reservation/intent材料兼容 | `digest`;`idempotency` | 是 |
| projection / execution | 固定bounded capture/batch/freshness/claim/retry/Job budget | `projection`;`execution`;Job snapshot | 是 |
| safe resolution | 绑定四类body-free resolver和formal availability | resolver builders / registry | 是 |
| outbound effect / target catalog | total-map publication、handoff、export exact binding与phase | `external`;safe catalog;delivery adapters | 是 |
| activation / historical compatibility | new complete assembly、old snapshot/binding、rollback/retire guard | builder;stored refs | 是 |
| verification / environment view | 横切展示formal runtime class组合与negative gates | all domains;test handoff | 是 |

配置域按上述控制面进一步拆为source/identity、runtime/technical、protocol/entry、safety、four store/transaction、digest/technical retention、projection/claim/retry、resolver、publication/handoff/export、sensitive refs、lifecycle和environment matrix。每个域只承接formal `03`已有typed field、reader、builder、adapter或entry slice；不得用配置新增protocol、state、port或business owner。

Runtime telemetry sink不是current root配置域。Current `03`已有`infra::observability_hooks.rs`和host-managed sink边界，但`ValidatedObservabilityConfig`无telemetry field；因此本轮不生成telemetry JSON key。若未来要求runtime-selectable sink、locator或参数，必须先回写`03`。Sink ack、failure、retention和dashboard状态永不成为accepted、retry、published、delivered、evidence或acceptance authority。

Truth ownership、raw-body排除、state/UoW、idempotency key/digest字段集、Query no-write、Consumer/Job no-source-repair、retention protection、claim/fence、stable token/probe、gap/delivery语义和evidence/signoff均不受任何配置来源覆盖。
````

## 11. 待确认事项

| 待确认事项 | 当前影响 | Owner / 最迟关闭 | 未确认前处理 |
|---|---|---|---|
| code/file/env来源最终precedence | 决定raw candidate冲突与identity | Step05 | 本Step只确认汇流；fixture/controlled/sensitive locator是typed value，不作为source参与priority |
| actual environment / deployment profile集合 | 决定D23矩阵与P0/P1实例 | Step06 | 只使用formal runtime class |
| D01~D23具体raw key/type/default/range/unit | 决定implementation schema | Step07 | 不从old formal/README恢复 |
| secret provider、locator格式和rotation | 影响D21及Endpoint binding | Step08/10 | raw secret不入design/root，required surface fail closed |
| store/external product capability | 影响RuntimeLike和Endpoint可实施性 | ADR / Step14 / current `07` spike | product-neutral + required capability，无fake fallback |
| activation/drain/rollback exact policy | 影响D22 new/old assembly lifecycle | Step09/10/11 | P0 immutable，old snapshot/binding不可重定向 |
| telemetry host integration具体crate/backend | 影响implementation wiring，不影响root config current schema | current `07` / ADR；若要求runtime field则先回`03` | 只允许host-managed safe façade，不生成config key |
| current `05/06/07`尚未重建 | 影响verification、acceptance和implementation readiness | 对应正式文档 | 只交付矩阵输入，不引用旧ID或伪造结果 |

上述事项不阻塞Step03。若任一项要求改变formal `03` field/enum/port/builder/error/flow，则升级为对应域blocker。

## 12. Current M3 后置复核与 affected 控制面路由

Pre-M3 Step 03 的存在和旧pass状态不构成current证据。本节以最终formal `03` §5、§13、§16.10和§17
重新核对本文件的来源链、reader boundary、11个控制面与23个配置域。

### 12.1 Control-plane baseline revalidation

| Control-plane invariant | 最终M3事实 | Step03结论 | Current verdict |
|---|---|---|---|
| raw owner | 只有`infra::config`读取JSON、ENV和sensitive locator | raw -> validated -> builder唯一汇流 | pass |
| application exposure | application只收typed executable values、façade、port或snapshot | 禁止root/raw locator穿透 | pass |
| entry exposure | API获得safe slice；worker/jobs获得locator-free slice + one-assembly registrar | D05/D21 least-authority控制面 | pass_after_R2 |
| runtime assembly | 13-stage complete-or-error；zero partial root | 配置控制面不直接注册半成品entry | pass |
| historical work | Job/outbox/intent按原snapshot/binding恢复 | lifecycle域不以current route重定向 | pass |
| telemetry | host-managed hook，非truth、非config root section | P1 handoff且新增field触发`03`回写 | pass |
| compile dependency | 仅`core-contracts`为sibling compile dependency | 产品/provider均留runtime/adapter域 | pass |

### 12.2 Affected-to-domain routing

| Affected ID | Step03唯一配置域路由 | 控制面停止规则 | Current state |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | D05 protocol/entry registration | schema owner缺失时I05 slot不进入safe catalog | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | D05 producer/transport binding | 不得由route/topic或source allowlist推导producer | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | D13 projection/replay execution | J06保持Blocked/manual，不装配positive H13 writer | open_controlled |
| `R06-F-AFFECT-UOW-01` | D06~D09 stores/UoW | config只能要求capability，不能重排accepted UoW | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | D14 retry/recovery policy | config budget只在typed recovery class允许后生效 | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | D17~D19 external binding | intent/result link未闭合则不暴露phase callable | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | D14 + D17~D19 retry/capability | same-token/probe/accounting不足则manual | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | D05 + D08 outbox/entry | 无same-UoW snapshot则对应handler不可激活 | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | D05 + D14 worker recovery | commit unknown不产生ack-success控制面 | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | D09 + D13 Job/report | report owner缺失时Job不得装配Completed finalize | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | D05 protocol catalog | config不得创建secondary DTO alias或free-form variant | inherited_affected |
| `03-RPR-S09-PER-FLOW` | D05/D13/D17~D19 implementation handoff | 控制面覆盖不能替代60条exact flow审计 | inherited_affected |

23个配置域均有formal field/reader/builder/adapter或明确view-only owner；没有配置域可以单独关闭上述affected。
本Step关闭`0/12`，没有新增root field、port、error、builder stage或truth owner。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已读取SOP Step03、书写规范§5.3及current上游 | pass | §3 |
| 九个SOP问题逐项回答 | pass | §4.1~§4.9 |
| old Step03后置审计且schema对象隔离 | pass | §5 / §5.1 |
| 配置来源链图已建立 | pass | §8.1 |
| 唯一装配入口和三层形态明确 | pass | §4.2 / §8.1 |
| raw/validated reader与禁止读取模块明确 | pass | §4.3 / §8.2 |
| 11个控制面覆盖P0/P1范围 | pass | §8.3 / §8.7 |
| 23个配置域回指formal binding | pass | §8.4 |
| 每个配置域已完成停审 | pass | §8.5 |
| overlap有唯一owner且无unresolved冲突 | pass | §8.6~§8.7 |
| Forbidden未进入任何配置域 | pass | §3.1 / §4.4 / §8.4 |
| telemetry owner / root field影响已闭合 | pass | §8.8 / §9 |
| `03`影响判定已完成 | pass | 当前无回写；§9 |
| formal §3草稿不含key/default/product/deployment command | pass | §10 |
| 未进入Step04、未修改formal `04`或future Step | pass | 当前只更新Step03 / flow / project ledger |
| 未伪造实现、测试、验收、commit、run或evidence | pass | 全文只记录design conclusion / planned handoff |
| 上游blocker | pass | `none` |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源链和装配链清楚 | pass | §8.1~§8.2 |
| 配置控制面与配置域清楚 | pass | §8.3~§8.4 |
| 每域允许/禁止能力与formal binding清楚 | pass | §8.4~§8.5 |
| 跨域审计无unresolved conflict | pass | §8.6~§8.7 |
| telemetry不静默扩展root config | pass | §8.8 |
| `03` impact无actual待回写 | pass | §9 |
| Step03 gate_status | `pass_consumed_by_step_04` | 最终M3 control-plane/entry边界及12项affected路由复核通过 |
| next_allowed_action | `continue_to_current_step_04_under_continuous_M4_authorization` | 连续授权只允许按SOP进入Step04，不允许跳步或正式装配 |
