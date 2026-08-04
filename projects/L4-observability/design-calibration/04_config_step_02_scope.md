# L4-observability 04-配置设计 Step 02 · 明确配置设计目标、范围和非范围

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节: `04-配置设计.md` §2
> 当前模式: `full-restart`
> 本步边界: 只确定配置设计目标、P0/P1/P2口径、非范围去向与残余风险；不定义配置域、raw key、source precedence、exact default、environment matrix或产品

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 02 `明确配置设计目标、范围和非范围` |
| 当前模块 | `scope-priority-boundary` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_02_scope.md` |
| 用户确认 | Step01已通过；用户于2026-08-02授权连续完成全部M4，本Step按顺序重新复核 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_03` |
| gate_reason | 五个SOP问题、目标、P0/P1/P2/Forbidden、非范围去向、无配置判定、残余风险、`03`影响与回填草稿完整，并已对最终formal `03`及12项affected完成后置复核 |
| blocker | `none` |
| next_allowed_action | `continue_to_current_step_03_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step01 | §3输入 | done | recovery point与用户确认一致 |
| 读取SOP Step02、书写规范5.2和current scope上游 | §3输入 | done | 输入足以做范围判断 |
| 回答五个SOP问题 | §4 | done | P0/P1/P2与下游职责不混淆 |
| 后置审计旧Step02、旧formal §2和L1参考 | §5 | done | 旧schema / key / profile不成为current scope |
| 完成改动前后对比与取舍 | §6~§7 | done | priority与非范围选择可审查 |
| 输出目标、范围、priority、非范围、无配置判定与风险 | §8 | done | 每个范围有后续Step,每个非范围有owner |
| 完成`03`影响判定与formal §2草稿 | §9~§10 | done | 不静默扩展code contract |
| 自检并停审 | §11~§12 | done | gate_status=pass且等待Step03确认 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step02中间产物全量重建；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step01 pass,用户已确认Step02 |
| 文档级门禁 | pass_for_current_step；flow已切到Step02 in progress |
| Step思考状态 | done；先读current source,再读old Step02做差异审计 |
| 正式正文污染 | no；old formal `04`继续保持historical |
| 批次规则误用 | no；本Step分批写入,最终粒度不受单批行数限制 |
| 越过未来Step | no；不建立Step03配置域,不定义Step05 source order或Step07 key/value |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 把Step01的15个候选输入族收束为可判定的P0、P1、P2与永久禁止配置化四类。
2. 明确current formal `04`必须完成到什么程度,避免把关键数值、source、failure或conditional requirement推给实现者。
3. 明确哪些内容属于deployment/runbook、current `05/06/07`、ADR / controlled spike或未来版本。
4. 判断本项目是否可以走“无配置说明文档”路径。
5. 为Step03建立配置控制面提供范围边界,但不提前命名配置域。
6. 记录所有非范围的残余风险、停止点和承接owner。

### 2.2 本步非目标

- 不把formal `03`的10个typed section直接命名为10个JSON module或配置域。
- 不给任何字段命名raw key、env var、CLI flag、file path、topic、route、endpoint、secret ref key或schedule key。
- 不固定duration、limit、retention、lease、retry、batch、parallelism、timeout、freshness或SLO具体数值。
- 不定义source precedence、environment profile matrix、sensitive provider、load/activation/change/rollback细节。
- 不选择DB、broker、object store、APM、OTel、Prometheus、Grafana、GRC、dashboard或archive产品。
- 不定义test suite、AC/VETO、artifact/evidence schema、phase、task、commit boundary、deployment command或runbook。
- 不把P2当作“以后可以配置绕过”的入口；违反truth、安全、state、transaction、no-write、fence/token/probe的事项永久禁止配置化。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | direct previous Step | 上游权威、15个候选输入族、不再回答 / 必须回答、tracked questions与`03`影响trigger |
| `配置设计讨论流程_SOP.md` Step02 | current process standard | 五个问题、目标 / 范围 / 非范围、P0/P1/P2和非范围去向 |
| `配置设计书写规范.md` §5.2 / §6 | current writing standard | formal §2目标表、非范围表、priority说明与评审口径 |
| formal `00-需求文档.md` §4 / §13~§15 | current requirement baseline | observation-only目标、产品/真实证据/旧数字非目标、NFR与需求AC/VETO方向 |
| formal `01-架构设计.md` §3~§15 | current architecture baseline | product-neutral、only-core dependency、runtime/event/handoff与架构不可配置红线 |
| formal `02-概要设计.md` §11 / §13 | current HLD baseline | 配置影响轮廓、禁止配置化边界、数值/产品后移与风险 |
| formal `03-详细设计.md` §2 / §13 / §16.7 / §17 | direct code baseline | 可实现范围、typed config / binding、current `04`责任和open item |
| `03_ddd_step_14_config_external_binding.md` §2 / §20 / §22 | detailed calibration | `04` exact handoff、不得改写项、产品 / 数值 / old binding / secret待确认 |
| old `04_config_step_02_scope.md` | historical material | 后置诊断其81行schema-first、无priority / non-scope / risk和自动门禁问题 |
| old formal `04` §2 | historical material | 诊断旧redaction/retention/signal/report/job范围是否仍有current source |
| L1-governance / L1-artifact Step02 | granularity reference | 参考目标表、范围表、priority、无配置判断、残余风险和停审结构 |

### 3.1 范围判断原则

| 原则 | 本Step解释 |
|---|---|
| Priority是交付优先级,不是安全等级 | P1/P2也不能弱化P0 redline；secret敏感性由Step08另行分类 |
| P0不等于“local fake only” | current `04`必须定义所有formal runtime class的安全语义；RuntimeLike缺required durable binding时应不可激活 |
| Conditional required仍是P0 | surface一旦enabled,其mapping/capability/secret locator/timeout等必须完整,不能因“可选集成”而TBD |
| P1不新增协议 | P1只能使用formal `03`已有adapter / target / schedule / telemetry接缝；新增field/enum/port必须回写`03` |
| P2不是current配置项 | P2只记录未来触发与回开文档,不得进入Step07 JSON / fixture / default |
| Forbidden不是P2 | truth owner、raw body、no-write、state/UoW、fence/token/probe、evidence/signoff等永远不能通过未来profile开放 |
| 非范围必须有owner和停止点 | “交给运维 / 实施”必须说明交付什么语义、在哪一步停止猜测 |
| Product-neutral不等于无配置 | mode、locator ref、capability、required/disabled/unavailable和failure仍必须设计 |

## 4. SOP问题回答

### 4.1 P0必须定义哪些配置才能运行主链?

P0定义的是“能够构造complete `ValidatedObservabilityConfig`、通过13-stage assembly并安全承载已启用formal surface”的最小完整配置语义。它覆盖LocalTest、IntegrationLike、RuntimeLike的约束,但不要求在每个环境启用所有optional target。

| P0范围簇 | 为什么是P0 | current `04`必须闭合 | 不要求在Step02决定 |
|---|---|---|---|
| config source / identity | raw source必须能稳定生成body-free config revision | JSON external shape、local/system naming、source policy、unknown-key、identity lifecycle | exact key/source order留Step05/07 |
| runtime class / technical | clock与ID mode决定可否构造基础runtime | class mapping、required/default、test-only guard、binding缺失行为 | actual environment matrix留Step06 |
| boundary / safety | 所有入口必须先满足size/page/schema/redaction/allowlist/visibility/body-free约束 | conditional required、type/range/source/failure与不可关闭redline | exact values留Step07 |
| core stores / transaction | owner/idempotency/result/projection/Job durability与atomicity是accepted flow前提 | mode/binding/schema/capability requirement及no-fallback | physical product由ADR / spike / Step14跟踪 |
| digest / technical retention | duplicate/replay/resume/old material解释依赖这些参数 | write/read profile、reservation/reconciliation/intent window和retire guard | exact values / migration留Step07/13 |
| projection / execution | formal Job与read-model维护依赖bounded capture/lease/fence/retry | requiredness、range/unit/profile、freeze与failure semantics | schedule实例值留Step06/07 |
| entry dispatch | enabled Command/Query/Job、9 Consumer和outbox loop必须可total-map | enabled/disabled、schema/actor/transport mapping、cadence/limit conditional rules | raw key/route留Step05/07 |
| external binding baseline | enabled resolver/publisher/handoff/export必须有typed family/phase/binding/capability | mode、locator ref、timeout/retry、capability、missing/disabled/unavailable与historical binding | concrete provider和production value不在Step02 |
| sensitive locator boundary | Endpoint / protected target不能把raw secret塞入config/application | sensitivity scope、conditional required、infra resolution、no-output与unavailable | provider/rotation细节留Step08/10 |
| assembly / activation / failure | P0 config只有complete build后才能供new work使用 | validation order、complete-or-error、immutable snapshot、new assembly/rollback原则与7 errors |具体流程留Step09~11 |
| downstream verification input | P0若无test/acceptance映射就不可审查 | environment combination、negative config、failure和dependency gate输入 | exact suite/AC/evidence留current `05/06` |

P0 completion rule:

- 每个P0项在Step07必须有type、default或明确`required_no_default`、required condition、source、scope、effect、sensitivity、failure、module与关联test cut。
- 不能以`TBD`、历史数字、provider default或“implementation decides”代替exact default/range；暂时无法定值时必须成为Step14 tracked blocker并阻塞受影响boundary。
- Optional surface可以Disabled,但Disabled本身是formal choice,不是missing mapping或silent no-op。
- RuntimeLike所需store / safety / identity / schema / capability缺失时不得自动降级为InMemory/Fake/Controlled。

### 4.2 哪些配置属于P1、P2或后续扩展?

| 分类 | current口径 | 代表范围 | 本轮处理 |
|---|---|---|---|
| P1 existing optional integration | formal `03`已有接缝,但不构成所有profile的core truth前提 | optional Endpoint resolver、optional peripheral handoff/export target、optional telemetry sink、optional Job schedule、deployment-specific tuning override | current `04`定义product-neutral schema、conditional validation、Disabled/Unavailable与failure；instance value可不启用 |
| P1 production hardening | code shape已存在,具体产品 / capability需后续reality | durable store locator、real publisher / target locator、credential ref、old binding retention、config rollout automation around new complete assembly | 定义ref / capability / safe lifecycle；产品选择与capability proof进入ADR / `07` spike |
| P2 topology / policy extension | current `03`未定义对应config/code contract | multi-region overlay、tenant-specific profile、remote config center/admin override、gray rollout、automatic hot reload | 只在Step13记录reopen trigger,不进入current配置项 |
| P2 product enhancement | 属于外部产品或外围消费能力 | vendor dashboard/alert/APM recipe、deep GRC/export options、adaptive capacity/sampling tuning | 只记录future/ADR,不得成为P0 default |
| P2 lifecycle expansion | 会改变current state / transaction / retention边界 | in-place adapter hot swap、physical deletion/cleanup、automatic source repair、archive package control | 不是可直接配置的future knob；必须先重开`00~03` |

P1与P0的边界按“语义是否必须存在”判断,不按“生产是否已经选产品”判断。例如publisher target catalog的typed mapping与disabled semantics是P0；某个真实provider endpoint/credential实例是P1部署材料。Job manual callable和optional schedule schema是P0；生产cron实例与平台注册动作分别是P1 value和运维动作。

### 4.3 哪些配置细节应留给部署与运维手册?

| 留给部署 / 运维 | `04`必须先提供的契约 | 禁止跨界 |
|---|---|---|
| 实际config文件位置、mount、ownership、permission与分发 | 文件格式、key schema、source precedence、validation/failure | `04`不写shell/k8s/systemd命令 |
| 真实endpoint/topic/route/DSN/bucket值 | product-neutral locator字段、type、required condition、redaction | 不把真实值或credential写进设计 |
| secret provider操作、KMS/Vault policy、证书安装与轮换步骤 | secret ref语义、读取边界、rotation invariant、audit/no-output | 不假定具体provider API |
| 实例拓扑、region placement、network policy和resource request | profile / binding / timeout / capacity config含义 | 不在`04`选择基础设施拓扑 |
| schedule注册、process restart、new assembly activation和drain操作 | schedule / activation / rollback语义与safe stop | 不把操作步骤当config contract |
| dashboard、alert、pager、on-call与incident runbook | telemetry signal/label/threshold input边界 | telemetry不得成为truth / acceptance authority |
| config drift检测操作与应急回退 | revision identity、audit record、LKG / reject / rollback语义 | 不伪造真实变更记录或执行结果 |

### 4.4 哪些配置细节应留给实施计划?

| 留给current `07` | `04`交付输入 | Step02停止点 |
|---|---|---|
| target repo initialization与config/runtime文件创建顺序 | formal JSON schema、typed mapping、builder/load contract | 不创建仓或代码 |
| phase / task / commit boundary | 每个config domain的实现对象、dependency和gate | 不拆commit |
| adapter capability spike与physical store / transport reality check | required capability、formal outcome、failure / blocker | 不声称产品可用 |
| config migration / fixture / profile文件物化 | key、format、migration/deprecation和environment matrix | 不创建future config文件 |
| test / acceptance gate嵌入和command | negative config矩阵、expected errors、artifact input | 不定义suite/AC或执行命令 |
| activation / rollback实施步骤 | new complete assembly、old snapshot/binding保护与safe stop | 不写发布动作 |
| implementation ledger / all planned skeleton | formal `03~07` boundary闭环 | 只在current formal `07`完成时创建 |
| git identity、commit message、review与delivery | design baseline和required gate | 不创建commit/hash |

### 4.5 哪些非范围仍有残余风险?

| 非范围 / 未定事项 | 残余风险 | 当前安全处理 | 后续owner / 阻塞点 |
|---|---|---|---|
| physical store / broker / provider产品 | 可能不支持atomicity/CAS/fence/stable token/probe/historical binding | product-neutral required capability；未证明则Disabled/Unavailable/Manual | ADR / `07` spike；production boundary前 |
| actual production values与secrets | 错值可能泄漏、误路由或破坏恢复窗口 | 设计只给schema/range/ref；真实值不进repo文档 | deployment / security；activation前 |
| workload/SLO/capacity evidence | 无法为timeout/batch/freshness/parallelism提供可辩护调优 | `04`给safe bounded配置；NFR标`not_evaluated` | current `05/06`；NFR acceptance前 |
| current `05/06`未重建 | environment组合、VETO、evidence consumer尚不权威 | formal `00`/`03`只提供方向 | current `05/06`;`07` audit前 |
| target repo / implementation reality缺失 | file/Cargo/adapter/config parser落点不能核实 | 不写代码、不假定existing workspace | current `07`;first edit前 |
| deployment/runbook未设计 | secret rotation、drain、rollback操作可能不一致 | `04`固定不可违反语义和handoff | deployment doc；production activation前 |
| P2需求被提前提出 | 可能暗增field/enum/port/state/topology | 不进入Step07；先重开owning design | Step13 trigger / formal `00~03` |
| telemetry backend binding缺少root config owner | 若Step03直接新增section会造成`03`漂移 | 当前只列P1 candidate；先判断能否由existing technical binding承接 | Step03影响判定；配置域定稿前 |

本Step没有把这些风险润色成“后续自然解决”。每一项都保留owner和停止点,但它们不阻塞Step02范围收口。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本Step处理 |
|---|---|---|
| Step01 §7.4 | 15个候选输入族只有存在性和后续Step,尚未分priority | 本Step按P0 semantic closure、P1 optional material、P2 future trigger和Forbidden四类收束 |
| formal `03` §13 | 10 sections全部出现在root config,但并未说明哪些optional surface可Disabled | P0覆盖完整schema和conditional required；P1只承接optional instance material |
| formal `03` §16.7 / §17 | key/source/profile/value/activation/rollback与产品/数值风险混在open inventory | current `04`范围接住前者；产品capability与NFR evidence保留owner/stop point |
| Step15 telemetry handoff | backend / sink binding后移config,但root config未单列telemetry section | 仅列P1 candidate并要求Step03做`03`影响判定,本Step不新增field |
| old Step02全文 | 81行重复旧Step01 schema对象,没有五问、P0/P1/P2、非范围去向、无配置判断或风险 | 整份替换 |
| old formal `04` §2 | 把redaction profile、retention class、metric label、report roots、job cadence混成范围,无formal `03` 10 sections / runtime class / catalog / snapshot映射 | historical；current scope从Step01候选输入重建 |
| old formal `04` §2 / §7 | 把report/acceptance roots与evidence alias flag当runtime config | 废弃；script/artifact/evidence归current `05~07`,real alias永不由config生成 |
| old `05/06` | 旧profile与TC/AC/EV编号可能反向扩大P0 | 只保留negative config和environment方向,不继承编号或配置事实 |
| README | product、P95、冷存、hash chain与dashboard愿景可能被误标P1/P2 | historical candidate；无current source不得进入priority表 |

### 5.1 旧Step02废弃对象审计

旧Step02中的`NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`EvidenceLink`均不属于current范围主语。它们只在本段historical diagnosis出现；current范围主语是config source / validated sections / binding catalog / runtime assembly / downstream handoff,而不是重新设计observation schema。

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Step02粒度 | 81行泛化schema摘要 | 五个SOP问题、priority规则、目标/范围/非范围、风险与影响判定完整闭环 | 对齐L1参考且匹配L4 config复杂度 |
| P0定义 | 未定义或等同旧local fake配置 | complete validated runtime语义+conditional required+all formal runtime class guard | fake-only无法验证RuntimeLike安全边界 |
| P1定义 | 旧产品化项散落 | 仅formal `03`既有optional seam的product-neutral material / hardening | 防止P1暗增协议 / field |
| P2定义 | 旧愿景都可列future config | current `03`之外只记录reopen trigger,不生成key | future capability先设计后配置 |
| Forbidden | 混入`enabled=true/false`配置 | 永久从P0/P1/P2剔除 | 不变量不存在可关闭默认 |
| 数值范围 | 旧数字或后续实现决定 | exact default/range是current `04`范围；无来源则Step14 blocker | 不能把可落码缺口外包 |
| 产品与部署 | 容易混进配置清单 | product-neutral schema在`04`;产品proof/instance/command分配给ADR/`07`/运维 | 保持层次边界 |
| telemetry backend | 默认当配置域 | 先列candidate,Step03判断existing owner或`03`回写 | 防止静默新增root section |
| 无配置路径 | 未判断 | 明确不适用,Step03~13必须执行 | formal `03`已有complete config contract |
| 推进门禁 | 自动next step | Step02完成后停审等待Step03确认 | 遵守用户逐Step规则 |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| P0基线 | 覆盖complete runtime语义和所有runtime class约束 | 只覆盖LocalTest fake / in-memory | 后者把RuntimeLike required binding留给实现者猜 |
| Optional surface | P0定义schema/Disabled/failure,P1承接实际optional material | 全部列P1或全部强制启用 | 兼顾totality与核心truth独立性 |
| exact numeric values | 属于current `04`正式范围,但需来源/owner | 一律后移运维；或恢复README默认 | 前者不可落码,后者无证据 |
| product selection | product-neutral locator/capability在scope,供应商选择在ADR/spike | Step02锁定产品；或完全不设计binding | 配置需要可实现语义但不替架构选型 |
| P2处理 | 仅记录future trigger,不进入current key/demo | 预留大量disabled key | 未进入code contract的字符串会制造假扩展性 |
| telemetry sink | scope为P1 candidate并设Step03 impact gate | 直接新增`telemetry`root section | current formal `03`尚无该section |
| artifact/report/evidence roots | 交给current `05~07`,不作为runtime config范围 | 沿用old formal `04` | 设计/测试输出路径不是business runtime config |
| 无配置路径 | 明确否决 | 因product未选而判无配置 | product-neutral config contract已存在 |

## 8. 结构化中间产物

### 8.1 P0 / P1 / P2 / Forbidden正式口径

| 等级 | 判定问题 | current formal `04`交付要求 | Step07是否生成配置项 | 未完成时处理 |
|---|---|---|---|---|
| P0 | 缺少该语义是否无法安全assemble runtime、注册enabled surface、保持redline或验证主链? | 完整定义schema、required condition、source、default/range、profile、validation、failure、change与test handoff | 是；包含conditionally required项 | 不得formal assembly；无来源项进入Step14 blocker |
| P1 | 是否为formal `03`已有optional seam的实际绑定、调优或production hardening? | 定义product-neutral schema、conditional validation、Disabled/Unavailable、sensitivity和handoff；可以不提供某个deployment实例值 | 仅为current schema已有项生成；未启用实例可为空但条件明确 | 不得silent enable或让missing变success |
| P2 | 是否超出current `03` code / protocol / state / topology contract? | 仅记录future trigger、收益/风险与需重开的文档 | 否 | 不得进入JSON demo、fixture、default或current profile |
| Forbidden | 是否会改变truth、安全、ownership、state、transaction、idempotency、no-write、token/probe或evidence authority? | 写入禁止配置化表并给出变更需重开的设计层 | 否,且不得有反向boolean key | 一旦发现立即停止受影响Step / boundary |

补充规则:

- `required_no_default`是合法P0口径；`TBD`和provider default不是。
- P0/P1描述配置语义和control contract,不等于要求在设计仓写真实deployment instance。
- P1不能作为“不用做validation / tests”的同义词；只要进入current schema,就必须有完整失败与敏感性口径。
- P2要进入未来版本时必须先回开scope / code contract,不能直接把key加到配置文件。

### 8.2 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 固定配置权威链 | 建立standard -> formal `00~03` -> current config calibration -> formal `04`的唯一链路 | `05/06/07`不再引用旧key/profile/value |
| 收稳priority与conditional required | 区分complete runtime必需语义、optional instance material、future capability和永久redline | Step03~07可判断哪些项必须闭合、哪些可Disabled |
| 收稳配置控制边界 | 把source、runtime、safety、store、execution、external、entry和lifecycle输入组织成后续可审计范围 | Step03配置控制面总览输入 |
| 保持代码契约不漂移 | 所有范围项回指formal `03` typed shape / reader / builder / failure；缺口触发回写 | 实现者不从配置字符串发明field/enum/port |
| 固定exact value责任 | type/default-or-required/range/unit/source/profile/failure均属于current `04`闭环 | Step07配置项可落码,Step14可识别真实blocker |
| 固定敏感配置边界 | secret仅以locator/ref进入raw infra边界,resolved material不越过adapter memory | Step08安全来源、rotation、audit与no-output输入 |
| 固定complete assembly与lifecycle | 配置先完整validate/assemble,Job与external material冻结old snapshot/binding,change不重写durable truth | Step09~11加载、生效、rollback与failure输入 |
| 固定product-neutral接缝 | 设计mode/binding/capability/availability,不预支provider | ADR/`07`可做capability proof而不反改domain |
| 固定下游验证输入 | 给环境组合、negative config、store capability、catalog totality、rotation与dependency gate提供配置矩阵 | current `05/06`可重建suite/AC而不沿用旧ID |
| 固定非范围去向 | deployment instance、product selection、implementation action、test evidence和future extension各有owner/stop point | 风险不因“非范围”静默消失 |

### 8.3 P0本轮覆盖范围矩阵

| P0 scope | 本轮必须定义 | Formal来源 | 完成判据 | 后续Step |
|---|---|---|---|---|
| external config representation | strict JSON、functional-module shape、local/system key mapping、unknown-key policy | config writing standard；formal `03` raw layout deferred | 可无歧义parse到existing validated fields且不暴露raw secret | 03/05/07/09 |
| source / config identity | source class、precedence/conflict、revision identity、unavailable behavior | formal `03` §13.1/§13.4 | 同一input有唯一winning value与body-free`ConfigBindingRef`来源 | 03/05/09/10 |
| runtime class / technical binding | actual profile到`RuntimeProfileClass`、clock/ID mode/binding、test-only约束 | formal `03` §13.2~§13.4 | LocalTest/IntegrationLike/RuntimeLike均有可判定allowed / required组合 | 04/06/07/09 |
| boundary controls | request bytes、page、query timeout、accepted schema set | formal `03` `boundary` section | type/default-or-required/range/unit/override/failure完整 | 04~07/09/11 |
| safety controls | redaction/source allowlist/safe label/correlation/visibility/body-free scanner refs | formal `03` `safety` section | 所有profilerequired,无Disabled / raw-body bypass | 04~09/11 |
| store / transaction bindings | observation/projection/idempotency/Job stores、timeout、schema revision、required capabilities | formal `03` `stores` section | RuntimeLike缺Durable或atomicity/CAS/fence则assembly fail；无fallback | 03~07/09/11/14 |
| digest compatibility | write/read profiles、canonical representation与retire guard | formal `03` `digest` section | v1 write/read闭合,被durable material引用的profile不可移除 | 04/07/09/10/13 |
| technical retention | Command/Consumer/Job/reconciliation/intent windows | formal `03` `idempotency` section | exact bounded value、lifetime cross-field和no-source-cleanup清楚 | 04/06/07/09/11/13/14 |
| projection / freshness | capture/closure/batch/freshness policy | formal `03` `projection` section | bounded whole-boundary semantics、freeze与Fresh禁止补造可验证 | 04/06/07/09/11/14 |
| execution controls | claim lease/heartbeat/parallelism/max plan/retries/Job timeout | formal `03` `execution` section | heartbeat<lease、retry authority、snapshot freeze、Unknown/manual闭合 | 04/06/07/09~11/14 |
| external binding schema | four resolvers、publisher、event targets、handoff/export catalogs、mode/phase/capability | formal `03` `external` section | 每个enabled subject unique total mapping；optional subject explicit Disabled | 03~11/13/14 |
| entry dispatch | enabled sets、9 Consumer mapping、schema/actor/transport、schedule ref、outbox loop | formal `03` `entries` section | enabled entry total,disabled不consume/ack/write,route不判family | 03~11/14 |
| sensitive locator rules | credential/store/adapter/target/policy/transport/schedule locators | formal `03` §13.1~§13.8 | raw secret不在JSON demo/log/report/application；missing mapping到safe error | 04/05/07~11 |
| runtime assembly | 13-stage validation/build、7 startup errors、complete runtime与entry slice isolation | formal `03` §13.8 | no partial runtime,validation顺序与side-effect boundary可测试 | 03/09/11/12 |
| activation / rollback baseline | immutable P0、new complete assembly、old Job snapshot / binding保护 | formal `03` §13.5/§13.8 | new work切换不重写reservation/outbox/plan/intent/report,rollback可解释 | 09/10/11/13/14 |
| configuration verification handoff | profile combinations、negative values、catalog/store/sensitive/rotation/dependency gates | formal `03` §15.8 / §16 | current `05/06/07`能直接引用配置矩阵而无旧ID依赖 | 06/11/12/14 |

P0范围包含exact numeric configuration responsibility,但不在Step02给出数值。Step07必须给出有来源的default/range或明确required-no-default；性能/SLO目标若无workload evidence则由current `05/06`标`not_evaluated`,不能反过来阻止功能安全配置被定义。

### 8.4 P1本轮覆盖范围矩阵

| P1 scope | current formal seam | 本轮定义到什么程度 | 不在本轮提供 |
|---|---|---|---|
| optional Endpoint resolver instance | four resolver bindings | mode/locator/timeout/credential/capability/Unavailable与conditional required | provider URL/secret value/SDK choice |
| optional real publisher instance | EventPublisher + 12 typed targets | target mapping、phase、binding revision、retry/probe/old route guard | actual broker/topic value与operator command |
| optional handoff/export target | report/peripheral consumer catalog | prepare/deliver same binding、credential、Disabled/Blocked/Manual | external verdict、consumer product config或real evidence alias |
| optional Job schedule instance | optional schedule refs | manual callable baseline、schedule ref schema、missing schedule非disable Job | platform cron registration与on-call |
| optional telemetry sink/backend | runtime telemetry hook / Step15 handoff | sink locator候选、redaction/non-recursion/non-authority/failure boundary | new root field未经Step03 impact gate；dashboard/alert product |
| environment-specific tuning override | bounded formal parameters | override allowlist、hard range、source conflict、change risk | workload-derived production value / SLO decision |
| production activation automation | new complete assembly lifecycle | revision、review/audit、drain/rollback invariants | controller implementation、gray rollout或hot in-place swap |

P1项如果最终进入current JSON schema,Step07仍必须提供完整列和测试入口。所谓“可选”只表示对应实例 / target可以不启用,不表示schema、failure或redaction可以缺失。

### 8.5 P2与未来重开触发

| P2候选 | 为什么不进入current配置项 | 未来进入前必须重开 |
|---|---|---|
| remote config center / admin override | current source chain与authorization/audit contract未定义 | `01/03/04/05/06/07` |
| automatic hot reload / in-place adapter swap | formal `03`固定immutable assembly和old binding protection | `03` builder / concurrency / recovery + `04` |
| multi-region / tenant-specific overlay | current scope / identity / isolation / precedence未定义 | `00/01/03/04` |
| adaptive sampling / autoscaling / capacity controller | workload、control authority、telemetry feedback和truth boundary未定义 | `00/01/03/04/05/06` |
| vendor-specific dashboard / alert / APM recipe | 属于external product / operations消费面 | ADR / `04` optional binding / operations docs |
| deep GRC / external audit workflow | current export只交接材料,不拥有external truth / verdict | `00/01/02/03` protocol + `04~07` |
| physical retention deletion / archive package control | current marker/protection不授权source cleanup或archive truth | `00/01/02/03` state/transaction + archive design |

### 8.6 永久禁止配置化边界

| Forbidden surface | 禁止的配置表达 | 若确需改变 |
|---|---|---|
| truth ownership | `own_source_truth=true`、external product as truth | 回到formal `00/01` |
| forbidden body | `allow_raw_body`、disable body-free scanner/redaction | 回到formal `00/03`安全边界；当前为VETO |
| visibility / no-write | Query refresh-on-miss、Consumer/Job repair source | 回到formal `02/03` protocol/flow/state |
| state / transaction | configurable variant/transition、Accepted前置、optional history/UoW/outbox | 回到formal `02/03` |
| retention protection | force release、ignore hold/reference、marker controls backend deletion | 回到formal `00~03` retention设计 |
| gap/degraded semantics | Suppressed=Resolved、Blocked=success、Unavailable=empty | 回到formal `03` state/error |
| idempotency / digest | configurable key scope、digest field list、result replay bypass | 回到formal `03` §7/§12/§13 |
| claim/fence/token/probe | disable fence、new token retry、Unknown=NotSent、old route fallback | 回到formal `03` §12/§13 |
| evidence / acceptance | configured real run/evidence alias/verdict/signoff | 只能来自real execution + authorized acceptance |
| dependency | dynamic/non-core sibling Cargo edge by profile | 回到formal `01/03` dependency review |
| telemetry authority | sink ack / health / metric drivestruth/retry/acceptance | 回到formal `03` §14且当前禁止 |
| fake semantics | fake default success、private fixture/map作为truth | 回到formal `03` fake parity contract |

Forbidden项不是P0 default=true,而是**不得存在相反配置项**。Step04必须把它们逐项审计,Step07不得为它们生成JSON key。

### 8.7 非范围及正式去向

| 非范围 | 本文仍提供什么 | 留给哪一层 / 文档 | 停止点 |
|---|---|---|---|
| 需求目标、truth owner、业务规则和需求AC重写 | 配置不可越过的引用 | formal `00` | 发现冲突立即停止`04` |
| 架构方案、dependency direction与产品ADR | required capability / product-neutral locator | formal `01` / ADR | 产品schema反改core contract前 |
| struct/enum/trait/port/DTO/flow/state/error/builder新增 | detailed-design impact record | formal `03` + owning calibration Step | 配置结论定稿前 |
| physical DDL/index/partition/queue/object schema | logical capability requirement | controlled spike / `07` implementation boundary | durable adapter开工前 |
| actual endpoint/topic/route/DSN/secret/cert值 | key/type/ref/sensitivity/validation | deployment inventory / secret system | activation前且不得入design repo |
| config file mount、container/network/topology与发布命令 | format/source/required/failure | deployment & operations manual | production rollout前 |
| KMS/Vault操作、证书安装、rotation runbook | secret lifecycle invariant与audit input | security / operations manual | Endpoint activation前 |
| workload、SLO、capacity sizing和pass threshold | configurable parameter range与`not_evaluated` handoff | current `05/06` + capacity review | NFR acceptance前 |
| full test suite/case/fixture/CI/artifact/evidence | environment/config scenario matrix | current `05` | `07` gate audit前 |
| AC/VETO/risk acceptance/final decision/signoff | candidate config gates / forbidden boundary | current `06` | release decision前 |
| phase/task/commit/rollback execution/gate command | config deliverable / dependency / safe stop | current `07` | implementation kickoff前 |
| implementation ledger / all skeleton | boundary inventory input | current formal `07` completion | current `07`完成前不创建 |
| dashboard/alert/pager/on-call/incident runbook | signal / label / threshold input boundary | operations docs | production operations前 |
| real run_id/evidence alias/test result/commit hash | no-fabrication rule | real execution/review | 永不由design生成 |

### 8.8 无配置路径判定

| 判断项 | 结论 | Current依据 |
|---|---|---|
| 是否存在root validated config | 是 | formal `03` §13.3 `ValidatedObservabilityConfig` |
| 是否存在raw source / profile / identity待定义 | 是 | formal `03` §13.1/§13.4与Step01 |
| 是否存在startup-required safety / store / technical binding | 是 | formal `03` §13.3/§13.6/§13.8 |
| 是否存在conditionally required external / entry mappings | 是 | formal `03` §13.5/§13.7 |
| 是否存在exact numeric / retention / execution参数 | 是 | formal `03` §13.2~§13.4/§17 |
| 是否存在secret / activation / rollback / migration配置职责 | 是 | formal `03` §13.5/§13.8/§17 |
| 是否可以只写无配置说明文档 | 否 | 无法解释runtime assembly、enabled surface、failure或profile |

结论:`L4-observability`不是“无配置”项目。Step03~13全部适用；未来可以判定某个配置域不适用,但不能跳过整个配置设计主链。

### 8.9 非范围残余风险表

| Risk ID | 非范围风险 | 影响 / 阻塞范围 | 当前缓解 | 关闭位置 |
|---|---|---|---|---|
| `OBS-CFG-SCOPE-R-001` | product capability尚未证明 | durable / external production boundary | formal capability + Disabled/Unavailable/Manual,不自动fake | Step14 + ADR/`07` spike |
| `OBS-CFG-SCOPE-R-002` | exact numeric value缺少workload / NFR evidence | config-dependent / NFR boundary | P0需safe bounded source；NFR可`not_evaluated` | Step07/14 + current `05/06` |
| `OBS-CFG-SCOPE-R-003` | current `05/06`未重建 | environment/test/acceptance handoff | 仅用formal `00`/`03` direction | Step12/14 + current `05/06` |
| `OBS-CFG-SCOPE-R-004` | telemetry sink无明确root config owner | telemetry binding配置域 | 只列P1 candidate,不得新增section | Step03 impact gate / formal `03` if needed |
| `OBS-CFG-SCOPE-R-005` | old binding / secret provider / drain物理策略未定 | external recovery / activation | old durable identity不得丢失或重定向 | Step08~10/13/14 |
| `OBS-CFG-SCOPE-R-006` | target repo和physical adapter reality缺失 | implementation kickoff | design-only,不伪造workspace/capability | current `07` |
| `OBS-CFG-SCOPE-R-007` | P2被提前写成disabled key | config schema / scope expansion | Step07禁止P2 key,Step13只记trigger | Step13/14 audit |
| `OBS-CFG-SCOPE-R-008` | deployment instance / secret操作未承接 | production activation | `04`给semantic handoff,real value不入design | operations / security docs |

上述风险不构成Step02上游blocker。若`R-004`证明必须新增typed config field,它会升级为`03`待回写并阻塞对应配置域,不能由Step03私自吸收。

### 8.10 跨范围闭环审计与Step03承接

| 审计项 | 结论 | Step03承接 |
|---|---|---|
| Step01 15个候选输入族是否均进入范围 / 非范围 | pass | P0矩阵覆盖14类runtime/config input；telemetry单列P1 candidate |
| formal `03` 10 sections是否均为P0 semantic scope | pass | Step03按功能边界组合,不得机械复制section |
| conditional required是否被误降为P1 | pass | enabled external / entry mapping仍为P0；实例material可P1 |
| forbidden invariant是否被误标P2 | pass | §8.6独立永久禁止表 |
| exact numeric responsibility是否被推给实现/运维 | pass | P0 scope要求Step07 exact default/range或blocker |
| current `05/06/07`职责是否误入`04` | pass | §8.7逐项分配owner和停止点 |
| product-neutral与product selection是否分开 | pass | locator/capability在scope,供应商/real value不在scope |
| 无配置路径是否明确 | pass | 不适用,Step03~13全部执行 |
| `03` impact是否存在actual待回写 | pass | 当前无；telemetry candidate在Step03设impact gate |

Step03可以从以下**候选控制面问题**开始,但必须重新按SOP建立控制面 / 配置域,不能把本表直接当配置域定稿:

1. config acquisition / identity如何唯一进入infra。
2. runtime / technical / entry assembly如何切片。
3. safety / boundary policy如何作为不可绕过的validated input。
4. store / digest / idempotency coordination如何绑定capability。
5. projection / execution参数如何冻结到Job。
6. resolver / publisher / handoff / export如何形成typed catalog。
7. activation / rollback / old binding如何跨新旧assembly保持可解释。
8. telemetry sink是否属于existing technical binding,还是触发`03`回写。

## 9. 对详细设计的影响判定

### 9.1 当前结论

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓不是无配置项目,Step03~13全部适用 | 否 | 从existing root config得出的流程判断 | 不适用 | 无回写 |
| P0覆盖complete runtime语义、all runtime class guard与conditional required | 否 | 承接formal `03` §13 | 不适用 | 无回写 |
| P1只覆盖formal `03`既有optional seam的实例material / hardening | 否 | 范围分层 | 不适用 | 无回写 |
| P2不进入current key/demo/fixture,需future reopen | 否 | 非范围 / evolution | 不适用 | 无回写 |
| Forbidden项永久排除于P0/P1/P2 | 否 | 承接formal invariant | 不适用 | 无回写 |
| exact numeric default/range属于current `04`责任 | 否 | formal `03`明确后移项 | 不适用 | 无回写 |
| old report/acceptance roots不属于runtime config scope | 否 | 下游文档归属修正 | 不适用 | 无回写 |
| telemetry sink仅为P1 candidate,尚未新增root section | 否 | scope candidate | 不适用 | 无回写 |

### 9.2 Future impact trigger

| 后续范围变化 | `03`影响 | 处理规则 |
|---|---|---|
| telemetry或任何新control surface需要新增validated field/section | 是 | Step03标`待回写`,回formal `03` §13/Step14后再继续 |
| P1需要新增adapter family/mode/capability/port/error | 是 | 停止对应域,回formal `03` §5~§13 |
| P2要进入current config schema | 是 | 先重开scope和owning `00~03`,不能直接升级priority |
| product capability迫使改变state/UoW/token/probe | 是 | product boundary阻塞,不得改core contract |

当前actual影响表没有`待回写`或`阻塞待确认`。Future trigger不是已批准的代码变化。

## 10. 回填草稿

以下草稿只供Step15装配formal `04` §2；当前不修改正式正文。

```md
## 2. 本次配置设计目标与范围

> 校准来源:
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“P0/P1/P2/Forbidden正式口径”“本轮覆盖范围矩阵”“非范围及正式去向”“无配置路径判定”和“残余风险表”,了解本轮为何覆盖完整runtime配置语义而不绑定具体产品或部署实例。

本轮配置设计以formal `03`的`ValidatedObservabilityConfig`、external binding catalog、entry slices、Job config snapshot和runtime builder为直接边界。P0必须定义complete runtime、all formal runtime class guard、enabled surface conditional required、safety/store/digest/execution/external/entry配置语义以及加载、activation、failure和下游验证输入。P1只承接formal `03`已有optional seam的实际外部绑定、schedule、telemetry sink和production hardening。P2不进入current key、JSON demo、fixture或default；truth、安全、state、transaction、no-write、fence/token/probe和evidence authority永久禁止配置化。

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 建立完整配置控制面 | 从raw source到validated runtime、binding、entry与Job snapshot形成唯一可审查链 | Step03~11可逐域定义并验证 |
| 固定P0/P1/P2与禁止边界 | conditional required不被误作optional,P2不提前生成key | Step04/07可执行分类与清单审计 |
| 固定exact value与sensitive责任 | 每个current schema项最终有default-or-required、range、source、failure和sensitivity | current `05/06/07`获得可执行矩阵 |
| 保持product-neutral和`03`一致 | locator/capability与provider选择分离,代码契约变化必须回写 | 实现者不现场发明product/schema |
| 固定非范围去向 | deployment、ADR、test、acceptance、implementation和operations各有owner | 风险不会因排除而静默消失 |

| 范围等级 | 本轮口径 | 是否生成current配置项 |
|---|---|---|
| P0 | complete runtime与enabled surface所需的完整配置语义,包括conditional required | 是 |
| P1 | formal `03`既有optional seam的product-neutral schema与可选实例material | 仅existing schema项；未启用实例可为空但条件明确 |
| P2 | remote/hot/multi-region/tenant/vendor/lifecycle扩展 | 否,仅记录future reopen trigger |
| Forbidden | 会改变truth、安全、state、transaction、idempotency、no-write或evidence authority的开关 | 永不生成 |

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| product/physical schema/capability选择 | ADR或current `07` controlled spike |
| actual endpoint/topic/DSN/secret值、mount和发布命令 | deployment / security / operations docs |
| workload/SLO/pass threshold | current `05/06`与capacity review |
| suite/AC/evidence/phase/commit/implementation ledger | current `05/06/07`;implementation assets只在formal `07`完成时创建 |
| 任何struct/enum/port/error/flow/state/builder变化 | formal `03`及对应calibration Step |

本仓不是无配置项目。Formal `03`已固定root config、startup-required与conditionally required binding、runtime assembly和immutable Job snapshot,因此Step03~13全部适用。产品、数值、secret、old binding和下游文档尚未闭合不会使本仓变成“无配置”,只会形成对应配置域或boundary的tracked risk。
```

## 11. 待确认事项

| 待确认事项 | 当前影响 | Owner / 最迟关闭 | 未确认前处理 |
|---|---|---|---|
| Step03如何把10 typed sections组合成功能配置域 | 决定Step04~11小循环主轴 | 配置设计维护者 / Step03 | 不机械复制sections,不建`common/runtime`泛化域 |
| telemetry sink是否能由existing technical binding承接 | 可能影响validated root field / builder | DDD + config owner / Step03域定稿前 | 只保留P1 candidate,不生成key |
| physical product与required capability | 影响RuntimeLike / Endpoint production boundary | architecture/infra/`07` spike / Step14 | product-neutral + fail-closed |
| exact numeric source与workload evidence | 影响Step07 default/range与NFR | config/test/acceptance owner / Step07/14和current `05/06` | required-no-default或safe bounded source,不继承README |
| actual environment/profile集合 | 影响P0/P1实例和test matrix | config/test/operations / Step06 | 只使用formal runtime class |
| secret provider、old binding retention与activation drain | 影响Endpoint / external recovery | security/infra/operations / Step08~10/14 | raw secret不入文档,old ambiguous identity不丢失 |
| current `05/06/07`何时重建 | 影响最终handoff / implementation readiness | 对应文档维护者 | `04`只给输入,不引用旧ID或提前创建assets |

这些事项均不阻塞进入Step03；若telemetry owner或其他项实际要求改变`03`,对应域立即转为blocker。

## 12. Current M3 后置复核与 affected 传播

本节是最终 formal `03` Step 19 装配完成后的 current 复核记录。§1~§11 中的范围结论只有在本节通过后
才可继续作为 current Step 02 产物；pre-M3 的通过状态本身不被继承。

### 12.1 最终基线差异复核

| 复核面 | 最终 formal `03` | 本Step既有结论 | Current处理 |
|---|---|---|---|
| typed root | `ValidatedObservabilityConfig`包含profile及10个typed section，entry raw binding仅infra可见 | P0覆盖完整root、conditional required与complete assembly | 一致，保留 |
| runtime class | 仅`LocalTest / IntegrationLike / RuntimeLike` | P0覆盖三类runtime，环境lane不成为代码profile | 一致，保留 |
| protocol/state/truth | 60协议、27状态owner、Query no-write及source truth边界已固定 | 永久Forbidden，不作为P1/P2扩展 | 一致，保留 |
| config lifecycle | immutable candidate、new complete assembly、old snapshot/binding pinning | activation/rollback属于P0，hot/in-place swap非范围 | 一致，保留 |
| telemetry | runtime telemetry不拥有truth，project root无telemetry section | host-managed P1 handoff，新增field必须回写`03` | 一致，保留 |
| readiness | `04~07`及真实implementation/test/evidence未完成 | 旧文本只给下游责任，不声称ready | 保持`blocked` |

### 12.2 Inherited affected scope register

| Affected ID | 本Step纳入范围 | 本Step不得关闭 / 伪造 | 后续owner |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | P0 Consumer schema activation gate | 不以JSON payload shape、alias或默认schema补上游owner | upstream + `04/07` binding audit |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | P0 registration totality gate | 不以全订阅、名称匹配或任意producer default启用I05 | upstream + `04/07` |
| `R06.6-F2-H13-UPSTREAM` | J06 controlled-open boundary | 不配置H13 fabricated success或默认execution record | H13 owner + `07` |
| `R06-F-AFFECT-UOW-01` | 所有accepted mutation的P0 invariant | 不把save order、atomicity或history append变成可选参数 | `03/07` boundary audit |
| `S08-RECOVERY-CLASS-OWNER-01` | error/retry/dead-letter配置承接 | 不由字符串、timeout或provider文本私定recovery class | `03/05/07` |
| `R07-EXTERNAL-PHASE-LINK-01` | external binding/capability P0 gate | 不用binding存在或health替代intent/result link | `04/07` |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | retry/probe/manual P0 gate | 不配置blind retry、new token或Unknown=NotSent | `04/07` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | Consumer enabled surface条件门禁 | 不以disabled、post-commit rebuild或generic outbox关闭 | `03/07` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | worker action/recovery条件门禁 | 不把commit-unknown配置成ack success | `03/05/07` |
| `S08-JOB-REPORT-REF-OWNER-01` | enabled Job completion条件门禁 | 不用report root、placeholder或config ref mint报告引用 | `03/07` |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | public protocol activation前置 | 不以config-local alias、free-form map或first enum补owner | `03/07` compile gate |
| `03-RPR-S09-PER-FLOW` | 60协议实施逐flow审计范围 | 不以family/profile/config coverage宣称vertical slice完成 | `03/07` per-boundary audit |

结论：12项均为本轮下游设计必须消费的activation gate；本Step关闭`0/12`。本轮新发现上游blocker=`none`，
但I05两项仍为`open_upstream_internal`、H13仍为`open_controlled`，其余为`inherited_affected`。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已恢复project/flow/Step01三层状态 | pass | §1.2 / §3 |
| 已读取SOP Step02、书写规范5.2与current scope source | pass | §3 |
| 五个SOP问题逐项回答 | pass | §4.1~§4.5 |
| old Step02后置审计且废弃对象被隔离 | pass | §5 / §5.1 |
| 配置目标完整且交付给下游 | pass | §8.2 |
| P0/P1/P2/Forbidden定义可判定 | pass | §8.1 / §8.3~§8.6 |
| conditional required未误降为optional | pass | §4.1 / §8.3 / §8.10 |
| exact numeric责任未推给实现者 | pass | §4.1 / §8.3 |
| 每个非范围都有owner和停止点 | pass | §8.7 |
| 无配置路径已判断 | pass | 不适用；§8.8 |
| 非范围残余风险有ID、影响、缓解、关闭位置 | pass | §8.9 |
| `03`影响判定已完成 | pass | 当前无回写；§9 |
| formal §2草稿符合目标 / 非范围双表 | pass | §10 |
| 未进入Step03、未修改formal `04`或future Step | pass | 当前只更新Step02 / flow / project ledger |
| 未伪造实现、测试、验收、commit、run或evidence | pass | 全文仅design scope / planned handoff |
| 上游blocker | pass | `none` |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置设计目标明确 | pass | §8.2 |
| 本轮范围 / 非范围收稳 | pass | §8.3~§8.7 |
| P0/P1/P2与Forbidden口径明确 | pass | §8.1 |
| 无配置路径判定明确 | pass | 本仓不是无配置项目 |
| 残余风险与owner明确 | pass | §8.9 / §11 |
| `03` impact无actual待回写 | pass | §9 |
| Step02 gate_status | `pass_consumed_by_step_03` | current M3后置复核和12项affected传播通过；连续M4授权已消费本Step门禁 |
| next_allowed_action | `continue_to_current_step_03_under_continuous_M4_authorization` | 只按SOP进入Step03；不得跳到未来Step或formal装配 |
