# L4-observability 04-配置设计 Step 06 · 定义环境、部署 profile 与配置矩阵

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节: `04-配置设计.md` §6
> 当前模式: `full-restart`
> 本步边界: 建立部署环境lane到既有`RuntimeProfileClass`、adapter/store mode、来源、依赖、敏感处理和验证用途的映射；不新增代码profile/mode，不定义raw key、exact value、产品、部署命令、suite、AC或真实环境结果

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 06 `定义环境、部署 profile 与配置矩阵` |
| 当前模块 | `environment-runtime-class-matrix` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_06_environment_profiles_matrix.md` |
| 用户确认 | Step05 current复核已通过；用户于2026-08-02授权连续完成全部M4 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_07` |
| gate_reason | 六条environment lane、formal runtime/mode组合、20类负向组合、23域停审、跨环境/VETO审计与`03`影响均已闭合，并按最终M3传播12项affected |
| blocker | `none` |
| next_allowed_action | `continue_to_current_step_07_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step01~05 | §3输入 | done | recovery point与用户确认一致 |
| 读取SOP Step06、书写规范§5.6及current部署/runtime/test契约 | §3输入 | done | local/CI/test/staging/prod、三类runtime与mode约束完整 |
| 从current上游独立收敛环境lane与class映射 | §4 / §8.1~§8.4 | done | 不恢复旧profile字符串或发明新enum |
| 后置审计旧Step06、旧formal §6、旧`05/06`与L1参考 | §5~§7 | done | historical mode/profile不进入current truth |
| 建立来源、依赖、敏感与验证承接矩阵 | §8.5~§8.11 | done | 每条lane可判定且未声称实例存在 |
| 完成23域环境矩阵、逐域停审和跨环境/VETO审计 | §8.12~§8.17 | done | 所有域同schema/redline且无profile特例 |
| 形成formal §6草稿、`03`影响判定与门禁 | §9~§12 | done | formal正文未修改，等待Step07确认 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step06中间产物全量重建；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step05 pass，用户已确认Step06 |
| 文档级门禁 | pass_for_current_step；flow允许Step06，不允许Step07 |
| Step思考状态 | done；先读current source并独立建模，再读old Step06/formal §6/L1作差异审计 |
| 正式正文污染 | no；old formal `04`继续是historical material |
| 越过未来Step | no；不锁定Step07 key/value、Step08 provider、Step09 activation或current `05/06` suite/AC |
| `03`静默扩展 | no；lane ID只作document view，不新增enum/field/reader/mode/port/error/builder stage |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 明确local、CI、test、staging、prod是否适用，以及它们如何映射到formal `LocalTest/IntegrationLike/RuntimeLike`。
2. 区分部署环境标签、document-only environment lane、Rust `RuntimeProfileClass`和per-adapter mode，防止四者互相替代。
3. 为每条lane固定Step05来源组合、store/technical/external mode约束、required/optional dependency和敏感引用处理。
4. 保证IntegrationLike与RuntimeLike真正验证durability/capability边界，而不是换名继续使用InMemory/Fake。
5. 明确operations replay、Job run和test suite是运行用途，不是新的root profile或source override层。
6. 给current `05/06/07`提供可消费的环境差异、negative combination和evidence适用边界，但不伪造执行结果。
7. 对Step03全部`CFG-D01~D23`标注LocalTest、IntegrationLike、RuntimeLike差异并完成逐域/跨环境审计。

### 2.2 本步非目标

- 不把lane ID写成JSON值、env var、CLI参数、Rust enum、public DTO或business profile。
- 不定义raw key、exact default/range/unit、文件路径、endpoint、topic、route、credential key、schedule或部署拓扑。
- 不选择durable store、bus、resolver、publisher、handoff、secret provider、scheduler、telemetry或外部审计产品。
- 不创建config file、fixture、CI pipeline、container、staging/prod实例、script、artifact、report或evidence。
- 不定义suite/case/coverage/workload/SLO/AC/VETO verdict；本Step只交付下游环境输入。
- 不因环境不同改变source precedence、truth ownership、schema、UoW、idempotency、fence/token/probe、no-write、redaction或historical binding。
- 不新增`operations-replay`、`test`、`staging`、`prod`代码profile，也不发明`replay-backed`、`durable-like`、`future-real-like`等adapter mode。
- 不声称任何lane当前可运行；target repo、adapter capability和真实环境均尚未核实。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `配置设计讨论流程_SOP.md` Step06 | current process standard | 五问、环境矩阵、local/CI/test/staging/prod适用性和P0差异门禁 |
| `配置设计书写规范.md` §5.6 / §6 | current writing standard | formal六列表与至少local/CI/staging/prod说明要求 |
| 通用三项设计标准与依赖裁剪规则 | current global standard | 环境不得改truth/contract，逐Step与only-core compile edge |
| `04_config_step_01_upstream_boundary.md` | current Step01 | environment待闭合项、planned/not_run test direction与product gap |
| `04_config_step_02_scope.md` | current Step02 | P0覆盖三类runtime、P1实例材料、P2拓扑与产品边界 |
| `04_config_step_03_control_plane.md` | current Step03 | 11控制面、23配置域、D23 view-only和部署/reader边界 |
| `04_config_step_04_categories_boundaries.md` | current Step04 | LocalTest/IntegrationLike/RuntimeLike的test/mode隔离和24禁止项 |
| `04_config_step_05_sources_priority_conflicts.md` | direct previous Step | DECL<one JSON<allowlisted ENV、selected secret、derived/history与24冲突 |
| formal `01-架构设计.md` §7 / §13.2 | architecture baseline | 同步/异步/后台职责可同部署但逻辑分离，配置不得越过安全/依赖红线 |
| formal `03-详细设计.md` §13.2~§13.8 | direct code baseline | 三个`RuntimeProfileClass`、store/external mode、requiredness、builder与availability |
| `03_ddd_step_14_config_external_binding.md` §9.1 / §13.4 / §14 / §17~§18 | detailed binding baseline | exact allowed mode、capability、Disabled/Unavailable、entry与assembly gate |
| formal `03-详细设计.md` §15 / DDD Step16 | verification direction | config/runtime/adapter/redaction/dependency/historical binding test cuts，全部not_run |
| old `04_config_step_06_environment_profiles_matrix.md`;old formal `04` §6 | historical material | 后置诊断旧81行schema摘要和冲突profile/mode矩阵 |
| old formal `05/06` | historical direction | 只识别环境差异需进入测试/验收，不继承profile、case、evidence或pass声明 |
| L1-governance / L1-artifact Step06 | granularity reference | 参考环境/来源/依赖/敏感/验证表格，不复制其in-memory IntegrationLike或私有mode |

### 3.1 环境判定原则

| 原则 | 本Step解释 |
|---|---|
| Environment label不是code contract | local/CI/test/staging/prod描述运行场所或用途；只能显式映射既有runtime class |
| Lane ID不是配置值 | `ENV-*`只是本文件稳定审计ID；实现不得parse或持久化它 |
| Runtime class必须显式 | 不能从binary、host、branch、namespace或lane名猜`RuntimeProfileClass` |
| Mode按adapter逐项选择 | profile不是“全fake/全real”开关；每个family仍受formal allowed mode与requiredness约束 |
| 同一schema与precedence | 所有环境使用同一root field registry和DECL<JSON<ENV；环境不建立第二loader/schema |
| Named lane必须可复现 | 每条current lane要求one strict JSON candidate；fileless只可作为loader测试场景，不是部署lane |
| Requiredness按surface判断 | startup-required不能Disabled；enabled Job/entry/target必须满足对应capability；环境名不豁免 |
| Test只是一种用途 | isolated/integration/recovery测试分布在local/CI/staging lane，不新增`Test` runtime class |
| Instance与contract分离 | 定义staging/prod语义不表示实例、产品、credential、run或evidence已经存在 |

## 4. SOP问题回答

### 4.1 local / CI / test / staging / prod分别是否适用?

五类均适用，但身份不同:

| 标准环境词 | 是否适用 | Current解释 | 对应lane / runtime class |
|---|---|---|---|
| local | 是 | 开发者本机的isolated与durable seam验证场所 | `ENV-LCL-ISO -> LocalTest`;`ENV-LCL-INT -> IntegrationLike` |
| CI | 是 | 自动化isolated与durable integration gate场所 | `ENV-CI-ISO -> LocalTest`;`ENV-CI-INT -> IntegrationLike` |
| test | 是，但不是独立部署profile | contract/domain/fake、durable integration、restart/recovery、RuntimeLike release rehearsal等用途轴 | 由local/CI lane承载；dedicated test cluster必须显式选`IntegrationLike`或`RuntimeLike` |
| staging | 是，语义适用但实例未建立 | 使用RuntimeLike限制做release rehearsal，不允许Controlled/Fake/InMemory | `ENV-STG-RT -> RuntimeLike` |
| prod | 是，语义适用但实例未建立 | 正式RuntimeLike运行语境，外围可Disabled但不得fake success | `ENV-PRD-RT -> RuntimeLike` |

Step06定义的是P0 runtime/config语义。Staging/prod的实际产品、拓扑、credential、capacity和部署动作属于P1 production material / ADR / `07` / 运维前置；这些未建立不允许把RuntimeLike从current设计中删除。

### 4.2 每个环境配置来源是什么?

六条lane都使用Step05同一优先级`SRC-DECL < SRC-JSON < SRC-ENV`，并要求one selected strict JSON candidate。ENV仍只可覆盖Step07逐field批准的leaf；secret result、entry slice、Job snapshot和historical binding不参与ordinary merge。

Local/CI使用suite/developer-owned非敏感JSON candidate，staging/prod使用deployment/operations-managed JSON candidate；这只是ownership handoff，不改变schema或priority。任何lane出现selected file不可读、unknown/alias、high-priority invalid或required missing，都按Step05 fail closed，不因“测试环境”回退default/fake。

### 4.3 每个环境依赖哪些外部服务?

`LocalTest` isolated lane不要求network service：可使用InMemory store和Fake/Controlled body-free seam，但fake必须通过共享UoW/CAS/fence/token/probe conformance。`IntegrationLike`必须使用Durable store、System clock、Runtime ID和Controlled/Endpoint/Disabled external mode，用于证明schema/atomicity/restart/capability边界。`RuntimeLike`必须使用Durable store、System/Runtime technical mode和Endpoint/Disabled external mode；所有enabled endpoint及secret material必须真实可解析，不能Controlled fallback。

所有环境仍只有`core-contracts` compile dependency。Bus、identity、governance、artifact、runtime、sandbox、archive、report或外部产品即使真实接入，也只能经formal event/port/ref/handoff collaboration，不产生sibling Cargo edge。

### 4.4 敏感配置在不同环境如何处理?

所有lane只允许opaque locator/ref进入ordinary config，raw token/password/private key/cert/DSN/endpoint/provider body一律禁止。Fake必须credential absent；Controlled只使用body-free controlled seam ref，若formal seam要求credential则使用非生产credential locator；Endpoint使用environment-owned binding与credential locator。任一selected binding所需material解析失败都阻断complete assembly；只有显式Disabled且无binding/credential时跳过解析。

Local/CI不得把真实production credential复制为fixture。Staging/prod不得用fixture ref、raw env secret或developer-local cache替代secret provider；Step08再定义provider、rotation、audit与no-output细节。

### 4.5 哪些环境差异会影响测试和验收?

`ENV-*-ISO`证明determinism、contract/domain/application、redline与fake/in-memory parity；`ENV-*-INT`证明durable store/UoW、restart、descriptor、Controlled/Endpoint outcome、historical binding和entry totality；`ENV-STG-RT`证明RuntimeLike禁止组合、managed secret/endpoint与release rehearsal；`ENV-PRD-RT`只提供production operations语义，不因在线健康或单次请求自动成为验收证据。

Current `05/06`必须据此区分“语义可由isolated证明”“需要durable integration证明”“需要RuntimeLike instance证明”和“当前not_evaluated”。本Step不生成case ID、run、artifact、evidence alias、pass/verdict或signoff；性能、容量、可用性、freshness与SLO在可信workload/environment/sample规则建立前保持`not_evaluated`。

## 5. 当前文档问题诊断

| 位置 | historical问题 | 本Step处理 |
|---|---|---|
| old Step06全文 | 81行仍以log/metric/trace/audit schema为主语，没有local/CI/test/staging/prod、runtime class、dependency或敏感矩阵 | 整份替换为environment/runtime class/23域主链 |
| old Step06状态 | 开工即全部done并允许`next_step_or_formal_assembly` | 废弃；本轮真实自检后才pass并等待Step07确认 |
| old formal §6 profile | `local-dev/ci-test/integration-like/operations-replay`被写成配置profile | lane改为document view并显式映射existing runtime class；operations replay降为用途 |
| old formal §6 IntegrationLike | store=`controlled`，redaction=`controlled/fake` | store只允许InMemory/Durable；IntegrationLike必须Durable且safety不能fake bypass |
| old formal §6 operations replay | fake/controlled store和独立profile | 不存在replay store mode/profile；recovery在LocalTest/IntegrationLike/RuntimeLike Job场景中执行 |
| old formal §6环境覆盖 | 只列四个旧profile，遗漏staging/prod | 本Step显式判断五类标准环境并建立六lane |
| old formal §5来源 | CLI/secret被排进普通priority，顺序与current Step05冲突 | 完全废弃；所有lane只承接DECL<one JSON<allowlisted ENV |
| old formal `05/06` | 使用旧profile、fake evidence候选与未经current `04`约束的case/AC | historical direction only；不继承ID、结果或evidence路径 |
| L1参考 | 部分IntegrationLike允许InMemory或私有`replay-backed/future-real-like` mode | 不复制；L4只承认formal enum与exact validation |

### 5.1 Historical material隔离

旧Step06中的`NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`和`EvidenceLink`只在historical diagnosis中成立。旧formal §6的四个profile名、fake/controlled store、fake redaction、local/report roots及旧`05/06`的case/evidence也不得成为current环境事实。

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境主轴 | 四个旧字符串profile | 六个document-only lane显式映射三类formal runtime | 防止配置文档暗增enum |
| local / CI | 每类只有一行，fake与integration混写 | 各拆isolated LocalTest与durable IntegrationLike | 同一行不能同时允许互斥mode |
| test | 被等同`ci-test` profile | 作为跨local/CI/staging的用途轴 | formal `03`无`Test` runtime class |
| staging / prod | 缺失或被列future而不约束RuntimeLike | 语义必须定义为RuntimeLike，实例状态明确未建立 | Step06必须说明适用性且不能逃避production redline |
| operations replay | 独立profile与虚构store mode | formal Job use case，运行于某一既有runtime class/lane | replay不改变root schema、store enum或snapshot规则 |
| IntegrationLike store | in-memory/controlled/fake混合 | Durable only，System/Runtime technical mode | 承接formal cross-field和restart/capability验证 |
| RuntimeLike external | 未定义 | Endpoint或Disabled；禁止Fake/Controlled | 防止production-like fallback测试接缝 |
| source | profile自行组合default/file/env/fixture | 所有lane同DECL<one JSON<allowlisted ENV；test value非source | 保持Step05唯一来源模型 |
| sensitive | fake/controlled/secret混写 | locator/source、selected resolution和runtime availability分离 | 防止raw secret或fixture污染 |
| 验证状态 | profile行看似已经可运行 | contract defined、instance not established、not run分列 | 不伪造环境、产品或evidence |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 环境粒度 | local/CI各拆ISO与INT，staging/prod为RT | 每个环境一行可选任意mode | 后者无法判定mode合法性与验证能力 |
| lane身份 | document-only稳定ID | 新`DeploymentProfile` enum或root field | current `03`只有`RuntimeProfileClass` |
| named lane source | 每条lane要求one strict JSON | local default-only；CI fixture override层 | 可复现、可审计且不创造第二source |
| LocalTest external | Fake/Controlled/Disabled | Endpoint | formal Endpoint只允许IntegrationLike/RuntimeLike |
| IntegrationLike store | Durable only | InMemory或`durable-like` | 必须验证schema/UoW/CAS/fence/restart的真实adapter能力 |
| IntegrationLike external | Controlled/Endpoint/Disabled | Fake或私有replay mode | formal Controlled用于接缝，Endpoint用于真实非生产target |
| RuntimeLike external | Endpoint/Disabled | Controlled fallback | RuntimeLike必须证明真实binding/secret/capability，不靠test seam |
| staging/prod范围 | 定义P0 semantic lane，instance为P1/operations material | 从current矩阵删除；或声称已具备 | 前者留下production空白，后者伪造现实 |
| operations replay | Job use case + stored snapshot/history | 独立profile/source/store mode | replay不能重写runtime config或old binding |
| topology | lane与API/worker/jobs部署拓扑正交 | profile固定同进程或拆分 | 架构允许P0同部署并后续拆分，逻辑边界始终不变 |
| acceptance | lane提供适用边界，current `05/06`定义裁决 | local smoke或prod health直接算pass | runtime状态不是真实evidence/signoff |

## 8. 结构化中间产物

### 8.1 概念分层与映射

```text
deployment place / automation context
  local | CI | dedicated test cluster | staging | prod
                              |
                              v
document-only environment lane (ENV-*)
                              |
                              | explicit mapping, never inferred
                              v
RuntimeProfileClass
  LocalTest | IntegrationLike | RuntimeLike
                              |
                              v
per-family validated mode
  StoreAdapterMode: InMemory | Durable
  ExternalAdapterMode: Fake | Controlled | Endpoint | Disabled
  Clock/ID: System|Fixed / Runtime|Deterministic
```

Environment lane只组织配置、依赖和验证语境。只有`RuntimeProfileClass`与formal mode进入typed config；lane名称、branch、host、namespace、binary或deployment tier都不能代替explicit runtime class field。

### 8.2 环境 / profile总表

| Lane ID / 环境 | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `ENV-LCL-ISO` / local isolated | 本地deterministic开发、contract/domain/application与failure injection | DECL + developer-owned one strict JSON + allowlisted ENV leaf | InMemory stores；Fake/Controlled/Disabled body-free seams；无required network | fixture/nonprod controlled locator；Fake credential absent；禁止production secret | 映射LocalTest；只证明isolated semantics，不证明durability或release readiness |
| `ENV-LCL-INT` / local integration | 本地调试durable adapter、restart、entry与external seam | DECL + developer-owned integration JSON + allowlisted ENV locator | Durable stores；Controlled/Endpoint/Disabled nonprod dependencies | nonprod endpoint/credential locator；selected material必须解析 | 映射IntegrationLike；不得InMemory/Fake/Fixed/Deterministic |
| `ENV-CI-ISO` / CI isolated | blocking deterministic schema/redline/service/fake conformance | DECL + suite-owned one strict JSON + allowlisted CI-safe ENV leaf | InMemory stores；Fake/Controlled/Disabled formal stubs；fixed barriers/failpoints | fixture/controlled locator only；禁止生产credential | 映射LocalTest；planned gate input，当前pipeline/file/test均未建立 |
| `ENV-CI-INT` / CI integration | blocking durable UoW/CAS/fence/restart/catalog/availability integration | DECL + suite-owned integration JSON + allowlisted CI locator | Durable stores；Controlled/Endpoint/Disabled nonprod services | CI secret-provider-facing nonprod locator；selected resolution fail closed | 映射IntegrationLike；不得用in-memory/fake替代失败依赖 |
| `ENV-STG-RT` / staging runtime | release rehearsal、RuntimeLike forbidden-combination与managed binding验证 | DECL + release-managed one strict JSON + allowlisted deployment ENV leaf | approved Durable stores；Endpoint/Disabled adapters；正式entry transport | staging-owned secret/provider locator；禁止fixture/raw env material | 映射RuntimeLike；contract适用但实例/产品/credential/evidence未建立 |
| `ENV-PRD-RT` / production runtime | 正式运行、restart/resume、old binding与外围隔离语境 | DECL + operations-managed one strict JSON + allowlisted deployment ENV leaf | approved Durable stores；Endpoint/Disabled adapters；正式entry/schedule | production-owned secret/provider locator；rotation/no-output后置Step08/10 | 映射RuntimeLike；不是测试profile，实例/产品/runbook当前未建立 |

六条lane都受相同`F-CFG-01~24`、unknown-key、no-fallback、complete-or-error和new-assembly-only规则约束。表中“owned JSON/locator”是责任归属，不表示物理文件、provider或credential当前存在。

### 8.3 Lane到formal runtime class映射

| Lane ID | `RuntimeProfileClass` | Store mode | Clock mode | ID mode | External mode allowed | 明确禁止 |
|---|---|---|---|---|---|---|
| `ENV-LCL-ISO` | `LocalTest` | `InMemory`；`LocalTest + Durable`仅作未命名conformance变体，见§8.10 | `Fixed`或`System` | `Deterministic`或`Runtime` | `Fake` / `Controlled` / `Disabled` | Endpoint、implicit fixture、fake success |
| `ENV-LCL-INT` | `IntegrationLike` | `Durable` | `System` | `Runtime` | `Controlled` / `Endpoint` / `Disabled` | InMemory、Fake、Fixed、Deterministic |
| `ENV-CI-ISO` | `LocalTest` | `InMemory` | `Fixed`或`System` | `Deterministic`或`Runtime` | `Fake` / `Controlled` / `Disabled` | Endpoint、production credential、private-map truth |
| `ENV-CI-INT` | `IntegrationLike` | `Durable` | `System` | `Runtime` | `Controlled` / `Endpoint` / `Disabled` | InMemory、Fake、Fixed、Deterministic |
| `ENV-STG-RT` | `RuntimeLike` | `Durable` | `System` | `Runtime` | `Endpoint` / `Disabled` | InMemory、Fake、Controlled、Fixed、Deterministic |
| `ENV-PRD-RT` | `RuntimeLike` | `Durable` | `System` | `Runtime` | `Endpoint` / `Disabled` | InMemory、Fake、Controlled、Fixed、Deterministic |

`Disabled`只适用于非startup-required external family。Observation/idempotency atomic group、UoW、clock、ID、digest与safety不能因任何lane而Disabled。Enabled Job、Consumer、publisher或target仍受conditional required和total mapping约束。

### 8.4 Formal mode合法组合表

| Runtime class | Store | Technical | Resolver / publisher / handoff / export | Fixture / credential | Validation结果 |
|---|---|---|---|---|---|
| LocalTest | InMemory或Durable | System/Runtime或Fixed/Deterministic | Fake、Controlled或符合family规则的Disabled | Fake需body-free fixture且credential absent；Controlled需seam ref | 合法，仍必须shared conformance |
| LocalTest | any | any | Endpoint | endpoint只允许IntegrationLike/RuntimeLike | `InvalidConfiguration` |
| IntegrationLike | Durable | System/Runtime | Controlled、Endpoint或符合family规则的Disabled | Controlled用nonprod seam；Endpoint按需credential locator | 合法，必须验证descriptor/capability |
| IntegrationLike | InMemory | any | any | n/a | `InvalidConfiguration` |
| IntegrationLike | Durable | Fixed/Deterministic | any | n/a | `InvalidConfiguration` |
| IntegrationLike | Durable | System/Runtime | Fake | fixture不能进入IntegrationLike | `InvalidConfiguration` |
| RuntimeLike | Durable | System/Runtime | Endpoint或符合family规则的Disabled | selected Endpoint按需credential locator | 合法，仍需capability/totality gate |
| RuntimeLike | InMemory | any | any | n/a | `InvalidConfiguration` |
| RuntimeLike | Durable | Fixed/Deterministic | any | n/a | `InvalidConfiguration` |
| RuntimeLike | Durable | System/Runtime | Fake或Controlled | 不允许test seam fallback | `InvalidConfiguration` |
| any | any | any | Disabled startup-required family | no binding/credential仍不能禁core dependency | `InvalidConfiguration` / required capability failure |

表中“合法”只表示配置组合可进入后续validation，不表示store schema、atomicity、fence、secret、endpoint、phase capability、entry totality或health已经通过。

### 8.5 配置来源与candidate ownership矩阵

| Lane ID | JSON candidate | ENV允许范围 | Secret result | Fixture / Job input | Source failure |
|---|---|---|---|---|---|
| `ENV-LCL-ISO` | developer/test-owned，required | Step07批准的non-sensitive leaf与fixture/controlled locator | selected Controlled material仅infra；Fake无credential | fixture是typed binding value；Job DTO不是source | selected file/invalid winner/required missing阻断assembly |
| `ENV-LCL-INT` | developer integration-owned，required | approved scalar/opaque nonprod locator | selected binding material仅infra | controlled scenario/Job DTO不覆盖root | 同Step05；不fallbackISO/fake |
| `ENV-CI-ISO` | suite-owned，required | CI-safe approved leaf/locator | selected Controlled material仅infra；禁prod secret | fixture run-scoped但不成为override layer | 同Step05；pipeline变量非法不fallbackfile |
| `ENV-CI-INT` | suite integration-owned，required | approved nonprod locator/leaf | CI provider解析后adapter-private | scenario/Job DTO不覆盖root | 同Step05；不fallbackCI-ISO |
| `ENV-STG-RT` | release-managed，required | approved deployment leaf/locator | staging provider解析后adapter-private | fixture禁止；Job start只派生snapshot | 同Step05；不fallbackControlled/local candidate |
| `ENV-PRD-RT` | operations-managed，required | approved deployment leaf/locator | production provider解析后adapter-private | fixture禁止；resume只读stored snapshot | 同Step05；不fallbackstaging/current route |

Fileless DECL+ENV组合仍是Step05允许的source semantic，可由current `05`验证loader；它不构成六条named lane，因为无法提供可复现的部署/测试candidate基线。

### 8.6 Dependency requiredness与环境承载

| Requirement class | Families / capability | LocalTest ISO | IntegrationLike INT | RuntimeLike RT | 禁止降级 |
|---|---|---|---|---|---|
| startup-required | observation + idempotency/result atomic group、UoW、clock、ID、digest、safety | InMemory/Fake technical implementation可用，但必须same semantics | Durable/System/Runtime并通过schema/atomicity | approved Durable/System/Runtime并通过schema/atomicity | partial runtime、Disabled、process-local shortcut |
| enabled-job-required | projection/source index、job execution/report、claim/fence | InMemory可模拟但需conformance，Job enabled才required | Durable且restart/CAS/fence可验证 | approved Durable且可恢复old plan/snapshot | process lock、missing plan重建、current config resume |
| operation-required | four resolver families | Fake/Controlled/Disabled formal outcome | Controlled/Endpoint/Disabled | Endpoint/Disabled | default body/truth、Unavailable=empty |
| propagation-required | event publisher + durable outbox | Fake/Controlled/Disabled；outbox仍保留 | Controlled/Endpoint/Disabled；outbox durable | Endpoint/Disabled；outbox durable | publisher missing丢outbox、fake Published |
| explicit peripheral | report handoff / export | Fake/Controlled/Disabled | Controlled/Endpoint/Disabled | Endpoint/Disabled | peripheral failure回滚core、receipt=signoff |
| inbound entry | Consumer transport/schema/actor mapping | fixture/Controlled或Disabled；enabled必须total | Controlled/Endpoint transport；enabled必须total | Endpoint transport；enabled必须total | Disabled仍consume/ack、schema/profile扩展 |

No lane changes compile-time dependency: `core-contracts` remains the only sibling path dependency。Real endpoint availability, health or product selection cannot upgrade an operation-required/peripheral family into business truth or acceptance authority。

### 8.7 敏感配置环境矩阵

| Lane group | Ordinary config可含 | Resolved material | 明确禁止 | Failure语义 |
|---|---|---|---|---|
| LocalTest ISO | body-free fixture ref、Controlled seam ref、非敏感policy/store locator | only selected Controlled adapter-private material | production credential、raw secret/endpoint、fixture body进入root/log/report | selected resolution failure阻断；Fake必须credential absent |
| IntegrationLike INT | nonprod store/endpoint/credential/policy/transport locator | provider或controlled seam解析到adapter-private memory | raw CI/local secret、provider response、credential进入snapshot | selected resolution failure阻断complete assembly |
| RuntimeLike staging | staging-owned product-neutral locator | staging provider解析，adapter-private | fixture、Controlled secret shortcut、developer cache/raw env material | selected resolution failure阻断；runtime Unavailable不换target |
| RuntimeLike production | production-owned product-neutral locator | production provider解析，adapter-private | fixture/nonprod/controlled locator、raw material、current route替old binding | selected resolution failure阻断；old material按history恢复 |

Step08必须继续定义每个sensitive field的store/read/rotation/audit/no-output；本表只固定环境隔离和source/failure上限。

### 8.8 部署拓扑与entry边界

| 议题 | 所有lane共同规则 | 环境可变部分 | 不得随环境改变 |
|---|---|---|---|
| API / worker / jobs | 只接收assigned validated slice + façade | process可同部署或按压力拆分 | entry读raw env/file、直接拿store/adapter/UoW |
| sync / async / background | 逻辑职责始终分离 | process count、placement与resource由部署决定 | schema、actor、UoW、no-write和truth owner |
| observation / projection stores | logical owner与atomicity固定 | physical adapter/instance可不同 | projection变truth、best-effort accepted UoW |
| external collaboration | event/port/ref/handoff正式接缝 | endpoint、transport、schedule与network实例 | sibling Cargo edge、provider type进domain |
| activation | new complete assembly only | process restart/rollout/drain操作后置 | in-place hot mutate、old snapshot/binding重写 |

Lane不选择container platform、namespace、region、replica、resource、mount或network policy。若split deployment需要不同root field、reader或entry constructor，必须先做`03`影响判定，不能由部署模板暗增。

### 8.9 环境实例与真实性状态

| Lane ID | Contract状态 | Instance状态 | Verification状态 | 当前允许声明 |
|---|---|---|---|---|
| `ENV-LCL-ISO` | `defined` | `not_established`；target repo/config不存在 | `not_run` | 仅设计语义已定义 |
| `ENV-LCL-INT` | `defined` | `not_established`；durable adapter未选/核验 | `not_run` | 仅integration precondition已定义 |
| `ENV-CI-ISO` | `defined` | `not_established`；CI/config/script不存在 | `not_run` | 仅planned gate input |
| `ENV-CI-INT` | `defined` | `not_established`；CI services/capability未核验 | `not_run` | 仅planned integration input |
| `ENV-STG-RT` | `defined` | `not_established`；产品/secret/topology未选 | `not_evaluated` | 仅RuntimeLike release语义 |
| `ENV-PRD-RT` | `defined` | `not_established`；production material/runbook未选 | `not_evaluated` | 仅RuntimeLike operations语义 |

`defined`不是“environment ready”。任何后续文件都不得把本表转换为真实run、artifact、evidence、availability、release readiness或acceptance signoff；状态只能由实际实现、环境准备、命令输出和授权评审更新。

### 8.10 Test、Job与recovery用途映射

| 用途 | Preferred lane | 仍需补充的positive lane | 必须验证 | 不得证明 |
|---|---|---|---|---|
| pure contract/domain/state/policy | `ENV-CI-ISO` | none | finite enum/state、body-free、no config/domain dependency | store/adapter/runtime可用 |
| application/UoW failure injection | `ENV-CI-ISO` | `ENV-CI-INT` | staged write、rollback invisibility、duplicate replay、no-write | durable adapter真实符合能力，仅fake通过不够 |
| store conformance | `ENV-CI-ISO`的explicit `LocalTest + Durable`变体 | `ENV-CI-INT` | LocalTest允许Durable；same suite覆盖InMemory/Durable | LocalTest Durable结果等于IntegrationLike/restart readiness |
| config source/profile negative | `ENV-CI-ISO` | `ENV-CI-INT`;`ENV-STG-RT` when established | source order、class/mode invalid、no fallback、complete-or-error | staging/prod当前已通过 |
| external formal outcome/token/probe | `ENV-CI-ISO` Fake/Controlled | `ENV-CI-INT` Controlled/Endpoint | all outcomes、same token/material、Unknown manual | real endpoint capability由fake证明 |
| durable restart/historical binding | `ENV-CI-INT` | `ENV-STG-RT` when established | stored snapshot、old binding、no current reroute、fence | production recovery readiness |
| inbound/outbound mapping totality | `ENV-CI-ISO` structural | `ENV-CI-INT` transport | producer/schema/actor/subject unique total mapping | external delivery或consumer acceptance |
| operations Job normal/duplicate | `ENV-CI-ISO` | `ENV-CI-INT` | plan/snapshot/digest/item/final report与duplicate no rerun | replay是新profile或config source |
| operations replay/resume | `ENV-CI-INT` | `ENV-STG-RT` when established | load original plan/snapshot/binding、no relist/current config | source truth repair、missing material重建 |
| redaction/telemetry safety | `ENV-CI-ISO` | `ENV-CI-INT`;RuntimeLike scan when established | same allowlist、no raw body/secret、no self-loop | host sink成功等于business success |
| performance/capacity/SLO | none current | dedicated workload context显式映射到IntegrationLike/RuntimeLike | workload、sample、threshold、environment identity与review rule | old number、single sample或local smoke作为pass |

`LocalTest + Durable`是formal合法组合而非第七个部署lane。Current `05`应在同一shared conformance suite中覆盖它，用来证明mode validator和adapter parity；需要restart/真实service/capability结论时仍必须在`IntegrationLike` lane验证。

### 8.11 环境差异到测试、验收、实施与运维承接

| 下游 | 本Step交付 | 必须区分 | 禁止写法 |
|---|---|---|---|
| current `05-测试方案.md` | six lane IDs、class/mode positive/negative、dependency requiredness、not-run状态 | isolated semantic proof、durable integration proof、RuntimeLike proof、NFR not_evaluated | 恢复旧profile/TC/EV；用fake证明endpoint/durable能力 |
| current `06-验收标准.md` | lane identity、required evidence environment、cross-lane VETO不变量 | `defined` / `ready` / `executed` / `reviewed`；functional vs NFR | local pass=release；health=acceptance；静态alias=真实evidence |
| current `07-实施计划.md` | config candidates、adapter/capability prerequisite、environment preparation boundary | target repo、LocalTest first、Durable integration、RuntimeLike precondition | 声称CI/staging/prod已存在；在设计仓实现环境 |
| deployment / operations | JSON/ENV/secret ownership、Endpoint/Disabled、new assembly与old history语义 | staging/prod product、topology、mount、network、credential、rollout/runbook | 环境名推runtime class；raw env secret；hot mutate |

环境lane应进入真实artifact/report的metadata，前提是current `05/06`定义正式schema并且真实执行产生该值。本Step的lane ID本身不是evidence alias，也不证明执行过。

### 8.12 负向环境组合矩阵

| Gate ID | 非法 / 风险组合 | Expected design result | 保护边界 |
|---|---|---|---|
| `ENV-G01` | lane名/host/branch/binary自动推runtime class | reject implicit inference；class必须explicit config | config identity / reproducibility |
| `ENV-G02` | LocalTest + Endpoint | `InvalidConfiguration` | test/product isolation |
| `ENV-G03` | IntegrationLike + InMemory | `InvalidConfiguration` | durability / restart真实性 |
| `ENV-G04` | IntegrationLike + Fake | `InvalidConfiguration` | controlled/endpoint seam真实性 |
| `ENV-G05` | IntegrationLike + Fixed/Deterministic | `InvalidConfiguration` | clock/ID runtime parity |
| `ENV-G06` | RuntimeLike + InMemory | `InvalidConfiguration` | durable truth/UoW |
| `ENV-G07` | RuntimeLike + Fake或Controlled | `InvalidConfiguration` | no test fallback |
| `ENV-G08` | RuntimeLike + Fixed/Deterministic | `InvalidConfiguration` | technical adapter真实性 |
| `ENV-G09` | startup-required family Disabled | assembly / required capability failure | complete runtime |
| `ENV-G10` | selected binding secret unresolved then fallback fake/other target | `SensitiveReferenceUnavailable`;no fallback | secret / exact target |
| `ENV-G11` | CI/local使用production credential或fixture含raw body | reject candidate / VETO | sensitive / forbidden material |
| `ENV-G12` | staging/prod使用fixture、developer cache或raw env secret | reject candidate / VETO | production material boundary |
| `ENV-G13` | profile改变DECL<JSON<ENV或启用CLI/admin/hot source | `InvalidConfiguration` / design stop | single source model |
| `ENV-G14` | profile关闭redaction/no-write/UoW/fence/token/probe | no field exists；VETO | `F-CFG-01~24` |
| `ENV-G15` | environment引入non-core sibling Cargo dependency | dependency VETO | architecture pruning |
| `ENV-G16` | IntegrationLike失败后自动切`ENV-CI-ISO`并记pass | fail original lane；不得跨lane fallback | evidence truth |
| `ENV-G17` | RuntimeLike failed candidate自动使用staging/local candidate | fail new assembly；lifecycle后置Step09/10 | config identity / activation |
| `ENV-G18` | Job resume按当前lane/config重建snapshot | manual consistency failure | immutable plan/history |
| `ENV-G19` | Endpoint health available被写成accepted/delivered/Fresh | remain runtime observation only | availability non-authority |
| `ENV-G20` | named lane未建立却生成run/evidence/verdict/signoff | no-fabrication VETO | acceptance truth |

本表是current `05/06`的planned negative input，不是已存在case或已执行结果。

### 8.13 按配置域组织的环境矩阵

| Domain ID | 配置域 | LocalTest ISO | IntegrationLike INT | RuntimeLike STG/PRD | 不可变环境红线 / 下游验证 |
|---|---|---|---|---|---|
| `CFG-D01` | source acquisition | suite/developer JSON + approved ENV；no fixture source layer | integration JSON + approved locator ENV | managed JSON + approved deployment ENV | all lanes DECL<JSON<ENV；selected source fail closed；G01/G13 |
| `CFG-D02` | config identity | effective ISO candidate identity | effective INT candidate identity | effective STG/PRD candidate identity | lane/path/run/evidence不作identity；env winner必须纳入semantics |
| `CFG-D03` | runtime class / technical | explicit LocalTest；Fixed/Deterministic allowed | explicit IntegrationLike；System/Runtime | explicit RuntimeLike；System/Runtime | mode matrix§8.3~§8.4；G01~G08 |
| `CFG-D04` | protocol boundary | same schema；deterministic bounded values可用于test | same schema；nonprod bounded values | same schema；deployment bounded values | 值可不同但hard bound/unknown-schema/preparse语义不变 |
| `CFG-D05` | entry dispatch / scheduling | fixture/Controlled entry或Disabled；enabled mapping total | Controlled/Endpoint transport；enabled mapping total | Endpoint transport；enabled mapping total | slice不扩权；Disabled不consume/ack；schedule不生成actor/run |
| `CFG-D06` | redaction / body-free safety | deterministic policy implementation可注入但不得bypass | nonprod policy locator；required | managed policy locator；required | all lanes同body-free scanner/redline；无fake redaction语义 |
| `CFG-D07` | correlation / label / visibility | finite test basis，same outcome | controlled/endpoint safe input，same outcome | managed safe input，same outcome | NotVisible不因环境变Missing/Resolved；label allowlist不放宽 |
| `CFG-D08` | observation + atomic idempotency store | InMemory baseline或explicit Durable conformance | Durable + schema/atomic UoW | approved Durable + schema/atomic UoW | same logical key/UoW/replay；G03/G06/G09 |
| `CFG-D09` | projection store | InMemory/Durable conformance，no false Fresh | Durable restart/atomic replace | approved Durable restart/atomic replace | Query no inline rebuild；projection不成truth |
| `CFG-D10` | Job execution / report store | Job enabled则InMemory/Durable claim/fence conformance | Job enabled则Durable plan/claim/fence/report | Job enabled则approved Durable recoverability | process lock/private map不能替代；resume old snapshot |
| `CFG-D11` | transaction / schema | formal timeout/revision，shared failure semantics | actual durable descriptor/revision | approved durable descriptor/revision | no auto truth migration；timeout不证明rollback |
| `CFG-D12` | digest compatibility | same write/read v1 semantics | same profile + durable old material | same profile + retained old material | environment不能换algorithm/field set或移除in-use profile |
| `CFG-D13` | technical retention | test-bounded windows但unresolved guard不变 | durable retry/restart windows | operations-approved windows | environment不能授权source cleanup或提前删nonterminal material |
| `CFG-D14` | projection bounds / freshness | deterministic bounded planning | durable capture/closure/freshness | workload-backed bounded values later | overflow whole boundary fail；Fresh不由profile/health生成 |
| `CFG-D15` | claim / concurrency / budget | deterministic/small bounded variant；fence仍required | durable lease/heartbeat/CAS | workload/operations-backed values later | accepted Job snapshot；timeout不取消unknown effect |
| `CFG-D16` | retry policies | formal outcomes/fault injection；same token | Controlled/Endpoint capability matched | Endpoint capability matched | Unknown/Unsupported manual；profile不启用blind retry |
| `CFG-D17` | safe resolver | Fake/Controlled/Disabled | Controlled/Endpoint/Disabled | Endpoint/Disabled | body-free formal result；no default truth；G02/G04/G07 |
| `CFG-D18` | event publication | Fake/Controlled/Disabled + exact fake binding | Controlled/Endpoint/Disabled + durable outbox | Endpoint/Disabled + durable outbox | target totality、same token、old ref；publisher failure不回滚truth |
| `CFG-D19` | report handoff | Fake/Controlled/Disabled | Controlled/Endpoint/Disabled | Endpoint/Disabled | exact target隔离；receipt不等verdict/signoff |
| `CFG-D20` | peripheral export | Fake/Controlled/Disabled | Controlled/Endpoint/Disabled | Endpoint/Disabled | optional外围不污染core；Delivered不等external truth |
| `CFG-D21` | sensitive refs | fixture/controlled locator；no prod credential | nonprod provider/locator | staging/prod provider/locator | raw material无source；selected resolution fail；Step08继续 |
| `CFG-D22` | activation / history | new isolated assembly；restart/recovery test | new complete assembly + durable old history | managed new assembly + old drain/history | no hot swap；old Job/effect不current fallback；G17/G18 |
| `CFG-D23` | environment / verification view | references same schema as LocalTest lane | references same schema as IntegrationLike lane | references same schema as RuntimeLike lane | view-only；不生成field/enum/source/result/evidence |

每个域的exact field、default/range和source allowance仍由Step07定义。表中“test-bounded”“deployment bounded”不允许无来源数字；如果Step07无法给出可辩护值，必须进入Step14 blocker，而不是让各环境自行决定。

### 8.14 Environment lane停审记录

| Lane ID | 显式class / mode | Source与candidate | Dependency / sensitive | Truthfulness / evidence | `03`影响 | 停审结论 |
|---|---|---|---|---|---|---|
| `ENV-LCL-ISO` | `LocalTest`;InMemory baseline;Fake/Controlled/Disabled | one developer-owned strict JSON；同一DECL<JSON<ENV | 无required network；Fake无credential，Controlled只解析nonprod locator | instance `not_established`;verification `not_run`;不证明durability | 无；lane是document view | pass；isolated语义可定位 |
| `ENV-LCL-INT` | `IntegrationLike`;Durable;System/Runtime;Controlled/Endpoint/Disabled | one integration JSON；invalid winner不fallback ISO | durable adapter与enabled nonprod dependency required；selected material fail closed | instance `not_established`;verification `not_run`;不证明release readiness | 无；承接existing class/mode | pass；restart/capability前置可定位 |
| `ENV-CI-ISO` | `LocalTest`;InMemory baseline;Fake/Controlled/Disabled | one suite-owned strict JSON；CI variable仍是allowlisted ENV leaf | formal fake/controlled seam；禁止production credential | pipeline/config不存在；verification `not_run`;不得生成evidence alias | 无；test harness不成为source | pass；planned isolated gate可定位 |
| `ENV-CI-INT` | `IntegrationLike`;Durable;System/Runtime;Controlled/Endpoint/Disabled | one suite integration JSON；不得跨lane fallback | durable service、schema、UoW、restart与selected secret required | services/capability未核验；verification `not_run` | 无；使用existing descriptor/capability gate | pass；planned durable gate可定位 |
| `ENV-STG-RT` | `RuntimeLike`;Durable;System/Runtime;Endpoint/Disabled | one release-managed strict JSON；同一priority | managed locator；禁止Fixture/Fake/Controlled/raw material | contract `defined`;instance `not_established`;verification `not_evaluated` | 无；不新增staging enum或binding type | pass；release rehearsal语义可定位 |
| `ENV-PRD-RT` | `RuntimeLike`;Durable;System/Runtime;Endpoint/Disabled | one operations-managed strict JSON；不得fallback staging/local | production-owned locator；old effect只读stored binding | contract `defined`;instance `not_established`;verification `not_evaluated` | 无；不新增production enum或truth owner | pass；operations语义可定位 |

Lane停审只确认P0环境差异可判定。它不确认JSON文件、adapter、service、credential、CI、staging、prod、runbook或证据已经建立。

### 8.15 配置域环境停审记录

| Domain ID | 环境差异是否定位 | 同schema / redline | Source与failure一致 | 下游未决owner | `03`影响 | 停审结论 |
|---|---|---|---|---|---|---|
| `CFG-D01` | yes；candidate owner按lane变化 | yes | DECL<JSON<ENV；selected source fail closed | Step07 exact field allowance | 无 | pass |
| `CFG-D02` | yes；identity覆盖各lane effective candidate | yes | lane/path/run/evidence均非identity source | Step07/09 identity算法 | 无 | pass |
| `CFG-D03` | yes；三类runtime与technical mode明确 | yes | implicit inference和非法组合reject | Step07 exact selector | 无 | pass |
| `CFG-D04` | yes；值可按用途变化 | yes | hard bound、unknown schema和preparse失败一致 | Step07 exact bound | 无 | pass |
| `CFG-D05` | yes；fixture/Controlled/Endpoint承载分离 | yes | enabled mapping total；Disabled不消费 | Step07 mapping；Step09 activation | 无 | pass |
| `CFG-D06` | yes；policy locator ownership变化 | yes | raw/body与redaction bypass全lane禁止 | Step07/08 sensitive field | 无 | pass |
| `CFG-D07` | yes；输入实例变化，outcome语义不变 | yes | NotVisible不重解释；label allowlist不放宽 | Step07 exact allowlist | 无 | pass |
| `CFG-D08` | yes；InMemory baseline对Durable runtime | yes | required atomic group不Disabled、不partial | Step07 locator；Step11 failure | 无 | pass |
| `CFG-D09` | yes；adapter和restart证明层级变化 | yes | projection不成truth；Query不inline repair | Step07 bound；Step11 degraded rule | 无 | pass |
| `CFG-D10` | yes；Job enabled时requiredness明确 | yes | plan/snapshot/fence不可process-local替代 | Step07 Job fields | 无 | pass |
| `CFG-D11` | yes；durable descriptor证明层级变化 | yes | no auto truth migration；timeout非outcome | Step07 exact revision/timeout | 无 | pass |
| `CFG-D12` | yes；相同digest profile跨环境 | yes | algorithm/field set不按环境改写 | Step07 profile registry；Step13 migration | 无 | pass |
| `CFG-D13` | yes；window值可变，guard不变 | yes | 不授权source cleanup或删nonterminal material | Step07 duration；Step10/13 lifecycle | 无 | pass |
| `CFG-D14` | yes；deterministic/durable/workload语境分离 | yes | overflow whole-boundary fail；Fresh不伪造 | Step07 bounds；current `05` workload | 无 | pass |
| `CFG-D15` | yes；bounded conformance到runtime lease | yes | accepted snapshot、fence与Unknown规则不变 | Step07 values；current `05` concurrency | 无 | pass |
| `CFG-D16` | yes；Fake/Controlled/Endpoint capability分层 | yes | same token；Unsupported/Unknown不blind retry | Step07 policy；Step11 failure | 无 | pass |
| `CFG-D17` | yes；external mode按class收紧 | yes | body-free/no-default-truth全lane一致 | Step07 binding；Step08 secret | 无 | pass |
| `CFG-D18` | yes；publisher mode与outbox durability分层 | yes | exact token/target；old ref不current fallback | Step07 mapping；Step11 availability | 无 | pass |
| `CFG-D19` | yes；handoff mode按class收紧 | yes | receipt不等verdict/signoff | Step07 mapping；current `05/06` | 无 | pass |
| `CFG-D20` | yes；export mode按class收紧 | yes | peripheral failure不污染core truth | Step07 mapping；Step11 isolation | 无 | pass |
| `CFG-D21` | yes；locator owner按环境隔离 | yes | raw material无source；selected resolution fail | Step07/08 provider与rotation | 无 | pass |
| `CFG-D22` | yes；new assembly与old history语境明确 | yes | no hot mutate；old snapshot/binding不读current | Step09/10 activation/rollback | 无 | pass |
| `CFG-D23` | yes；六lane只作verification view | yes | 不生成field/enum/source/result/evidence | current `05/06/07` metadata schema | 无 | pass |

23域均完成Step06环境层停审，但不提前宣称后续配置全链已完成。Exact key/type/default/range/required/source在Step07闭合，secret在Step08闭合，activation/history/failure在Step09~11闭合。

### 8.16 跨环境闭环审计

| 审计项 | 结论 | 约束 / 缺口处理 |
|---|---|---|
| 环境词、lane、runtime class、adapter mode是否混用 | no | 四层显式分离；只有formal class/mode进入typed config |
| local / CI / test / staging / prod是否全部判定 | pass | local/CI各有ISO/INT；test是用途轴；staging/prod为RuntimeLike语义 |
| named lane是否共享schema与priority | pass | one strict JSON candidate；DECL<JSON<ENV；无profile source特例 |
| LocalTest是否偷偷证明durability | no | InMemory为named baseline；`LocalTest + Durable`仅conformance变体，INT仍负责restart/capability证明 |
| IntegrationLike是否允许InMemory/Fake/Fixed | no | `ENV-G03~G05`全部reject |
| RuntimeLike是否允许InMemory/Fake/Controlled/Fixed | no | `ENV-G06~G08`全部reject |
| `Disabled`是否绕过required dependency | no | 只允许非startup-required family；enabled surface仍conditional required |
| selected secret失败是否切换fake/target/lane | no | `SensitiveReferenceUnavailable`；original candidate失败，无fallback |
| staging/prod是否被当成已经存在 | no | contract `defined`，instance `not_established`，verification `not_evaluated` |
| environment是否改变truth/no-write/redaction/UoW | no | `F-CFG-01~24`与`VF-OBS-001~010`跨lane不变 |
| environment是否引入sibling compile edge | no | 仍仅`core-contracts`；真实服务通过formal port/event/ref/handoff |
| Job replay是否成为profile/source | no | 是existing Job/recovery用途，只读stored plan/snapshot/binding |
| old snapshot/binding缺失是否读取current fallback | no | 保持manual/unavailable并保留material；不重建、不reroute |
| endpoint health是否升级operation或acceptance truth | no | health/probe仍只表示runtime observation |
| lane ID是否成为evidence alias或执行结果 | no | 只有未来真实artifact metadata可引用；本Step不生成run/evidence/verdict |
| 是否存在跨环境unresolved conflict | none | exact values/products/instances有明确下游owner，不改变本Step P0矩阵 |

### 8.17 Requirement VETO到环境门禁映射

| Requirement VETO | 环境侧风险 | Environment gate | Step06结论 |
|---|---|---|---|
| `VF-OBS-001` | 低等级lane掩盖required store/UoW/capability缺口 | `ENV-G03/G06/G09/G16/G17`；§8.6 | covered；每条lane complete-or-error，不跨lane伪成功 |
| `VF-OBS-002` | local fixture、CI变量或runtime provider material进入观察面 | `ENV-G10~G12/G14`；§8.7 | covered；只允许opaque locator，raw body全lane禁止 |
| `VF-OBS-003` | fixture/provider/evidence正文随环境进入root、snapshot或report | `ENV-G11/G12/G14`；D06/D17/D21 | covered；body-free边界不因test/runtime变化 |
| `VF-OBS-004` | endpoint/health/dashboard在RuntimeLike被解释为business truth | `ENV-G19`；D07/D09/D17~D20 | covered；runtime availability不拥有外部truth |
| `VF-OBS-005` | replay/rebuild或environment override反写source truth | `ENV-G13/G14/G18`；D22 | covered；无admin/hot source，old work不重写current truth |
| `VF-OBS-006` | named lane或staging/prod标签被静态写成run/evidence/verdict | `ENV-G20`；§8.9/§8.11 | covered；全部真实性状态显式，未生成签署 |
| `VF-OBS-007` | environment retention值删除仍被引用的old material | `ENV-G14/G18`；D12/D13/D22 | covered；retention guard与history binding跨lane不变 |
| `VF-OBS-008` | integration/runtime lane通过产品crate接入服务 | `ENV-G15`；§8.6 | covered；仅formal runtime collaboration，无新增Cargo edge |
| `VF-OBS-009` | staging/prod被某具名观测产品定义或其health成为前置truth | `ENV-G19`；§8.9 | covered；产品/实例未选且只允许product-neutral binding |
| `VF-OBS-010` | 恢复旧profile、旧source顺序、旧数字或旧evidence路径 | historical gate；`ENV-G13/G20` | covered；旧Step06/formal `04`/`05/06`仅作差异诊断 |

该映射证明环境层已承接requirements VETO，不代表current `05/06`的case、evidence schema、运行结果或裁决已经存在。

## 9. 对详细设计的影响判定

### 9.1 当前结论

| Step06结论 | 是否影响`03` | 判定依据 | 处理状态 |
|---|---|---|---|
| 六条`ENV-*` lane仅作document view | 否 | 不新增field、enum、reader、DTO、port或持久化对象 | 无回写 |
| lane显式映射existing `RuntimeProfileClass` | 否 | formal `03`已定义LocalTest/IntegrationLike/RuntimeLike | 无回写 |
| LocalTest允许InMemory/Durable与Fake/Controlled/Disabled | 否 | 承接formal allowed mode；Durable只作conformance变体 | 无回写 |
| IntegrationLike必须Durable + System/Runtime且禁止Fake | 否 | 承接formal profile validation与capability boundary | 无回写 |
| RuntimeLike必须Durable + System/Runtime且禁止Fake/Controlled | 否 | 承接formal production-like validation | 无回写 |
| named lane要求one strict JSON candidate | 否 | 是Step05 zero-or-one source semantic上的部署/测试收紧，不新增reader | 无回写 |
| selected secret失败、Disabled与post-assembly Unavailable分离 | 否 | 承接formal stage5、requiredness与availability语义 | 无回写 |
| operations replay是existing Job/recovery用途 | 否 | 不新增profile/source/store mode或protocol | 无回写 |
| staging/prod semantic contract存在但instance未建立 | 否 | 是deployment/verification状态，不改变runtime object contract | 无回写 |
| old snapshot/effect binding不得回退current environment | 否 | 承接formal immutable snapshot、exact binding与manual outcome | 无回写 |

### 9.2 Future impact trigger

| 后续要求 | `03`影响 | 处理规则 |
|---|---|---|
| 把lane ID变成root field、Rust enum、public DTO或stored business field | 是 | 先回`03`定义owner、type、flow、visibility、persistence与tests |
| 新增第四种runtime class或私有adapter mode | 是 | 先回profile/mode enum、validation、builder、capability和exhaustive match |
| LocalTest启用Endpoint或RuntimeLike启用Controlled | 是且当前禁止 | 重开external binding、安全与release真实性设计，不得Step07侧加值 |
| environment自动推断runtime class | 是且当前禁止 | 需要新的reader/identity/error契约；默认继续explicit field |
| split deployment要求不同root schema/reader/constructor | 是 | 回module/config/entry/assembly契约后再定义部署profile |
| replay读取current config重建old snapshot/binding | 是且违反current一致性 | 重开Job/recovery/idempotency设计；默认manual/unavailable |
| environment-specific redaction、truth、UoW或no-write开关 | 是且VETO | 不进入配置清单；需求与详细设计必须先重审 |

当前没有`待回写`或`阻塞待确认`项，上游blocker=`none`。

## 10. 回填草稿

以下草稿只供Step15装配formal `04` §6；当前不修改正式正文。

````md
## 6. 环境、部署 profile 与配置矩阵

> 校准来源:
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“概念分层与映射”“Formal mode合法组合表”“Dependency requiredness与环境承载”“负向环境组合矩阵”“配置域环境停审记录”和“跨环境闭环审计”，了解环境差异如何在不改变truth、schema和source priority的前提下交给测试、验收、实施与运维。

部署环境标签、document-only environment lane、`RuntimeProfileClass`和per-family adapter mode是四层不同概念。Lane只组织配置与验证语境，不进入typed config；runtime class必须显式配置，不能从host、branch、binary、namespace或lane名推断。所有named lane使用同一root schema、one selected strict JSON candidate和`code declaration < JSON < allowlisted ENV leaf`，环境不建立第二loader或priority。

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `ENV-LCL-ISO` / LocalTest | 本地deterministic开发与isolated failure injection | developer-owned strict JSON + approved ENV | InMemory；Fake/Controlled/Disabled body-free seam | fixture/nonprod locator；Fake无credential | 不证明durability；`LocalTest + Durable`仅作未命名conformance变体 |
| `ENV-LCL-INT` / IntegrationLike | 本地durable adapter、restart和entry调试 | integration strict JSON + approved nonprod locator | Durable；Controlled/Endpoint/Disabled | selected nonprod material必须解析 | 禁止InMemory/Fake/Fixed/Deterministic |
| `ENV-CI-ISO` / LocalTest | 自动化contract/domain/service与redline gate | suite-owned strict JSON + CI-safe approved ENV | InMemory；Fake/Controlled/Disabled | fixture/controlled locator；禁production credential | planned；pipeline/config尚未建立 |
| `ENV-CI-INT` / IntegrationLike | 自动化UoW/CAS/fence/restart/capability gate | suite integration JSON + approved nonprod locator | Durable；Controlled/Endpoint/Disabled | selected resolution fail closed | planned；不得fallback CI-ISO |
| `ENV-STG-RT` / RuntimeLike | release rehearsal与RuntimeLike组合验证 | release-managed strict JSON + approved deployment ENV | Durable；Endpoint/Disabled | staging-owned locator；禁fixture/raw material | contract defined；instance not established；not evaluated |
| `ENV-PRD-RT` / RuntimeLike | 正式运行、resume和old binding语境 | operations-managed strict JSON + approved deployment ENV | Durable；Endpoint/Disabled | production-owned locator；old work只读stored binding | contract defined；instance not established；not evaluated |

`test`是用途轴，不是第四种runtime class。Operations replay/resume是existing Job/recovery用途，不是profile、source或store mode。`Disabled`只允许非startup-required family；enabled Job、entry、publisher或target仍必须满足conditional required、mapping totality和capability gate。

| Runtime class | Store / technical mode | External mode | 结果 |
|---|---|---|---|
| LocalTest | InMemory或Durable；System/Runtime或Fixed/Deterministic | Fake/Controlled/Disabled | 合法候选；仍需shared conformance |
| LocalTest + Endpoint | 任意 | Endpoint | `InvalidConfiguration` |
| IntegrationLike | Durable + System/Runtime | Controlled/Endpoint/Disabled | 合法候选；必须验证durable descriptor/capability |
| IntegrationLike + InMemory/Fake/Fixed/Deterministic | 非法组合 | 任意 | `InvalidConfiguration` |
| RuntimeLike | Durable + System/Runtime | Endpoint/Disabled | 合法候选；selected binding必须完整 |
| RuntimeLike + InMemory/Fake/Controlled/Fixed/Deterministic | 非法组合 | 任意 | `InvalidConfiguration` |

环境不能改变redaction、body-free、truth ownership、no-write、UoW、idempotency、fence/token/probe、retention guard、source priority或historical binding。Selected secret解析失败阻断new assembly，不能切换Fake、target或其他lane；成功assembly后的Unavailable也不触发source fallback。Old Job/effect只能读取stored plan、snapshot和binding，缺失时保持manual/unavailable，不按current environment重建或reroute。

Lane contract `defined`不表示环境`ready`或验证`executed`。Current local/CI实例与脚本均未建立，staging/prod实例、产品、credential和runbook也未建立；本章不生成真实run、artifact、evidence alias、verdict或signoff。
````

Formal装配要求:

- §6必须保留六条lane的标准六列表、三类runtime合法/非法组合和test/replay非profile说明。
- 可以压缩23域细表，但不得删掉same schema/priority、IntegrationLike Durable、RuntimeLike no-Controlled、selected secret no-fallback、old binding no-current-fallback和truthfulness状态。
- 不得恢复旧`local-dev/ci-test/integration-like/operations-replay` profile，不得新增raw key/value、产品、部署命令、case/evidence ID或通过声明。

## 11. 待确认事项

| 待确认事项 | 当前影响 | Owner / 最迟关闭 | 未确认前处理 |
|---|---|---|---|
| 每个域的exact field、key、type、default、range与source allowance | 决定环境candidate的可落码schema | Step07 | 只使用domain/class/mode级结论；禁止从old formal恢复值 |
| 哪些optional external family在各runtime class允许Disabled | 决定conditional required矩阵 | Step07 | 只承认formal family requiredness；startup-required永不Disabled |
| sensitive locator的provider、store、rotation与safe audit字段 | 决定staging/prod material准备 | Step08 | 只允许opaque locator；raw material无ordinary source |
| new candidate activation、old assembly、rollback与drain | 决定部署切换行为 | Step09/10/11 | new candidate失败即不assembly；不声称LKG或自动rollback |
| CI isolated/integration candidate与service如何创建 | 决定真实测试环境ready状态 | current `05` / `07` | contract保持defined，instance not established，verification not_run |
| staging/prod产品、拓扑、credential和runbook | 决定RuntimeLike实例是否可评估 | ADR / `07` / deployment operations | contract不删；instance not established，verification not_evaluated |
| performance/capacity/SLO需要哪个workload context | 决定NFR evidence适用环境 | current `05/06` | 无可信workload/sample/threshold前保持not_evaluated |
| artifact/report中的lane metadata exact schema | 决定未来evidence可追溯字段 | current `05/06/07` | lane ID不是evidence alias，不静态填run或verdict |
| `LocalTest + Durable` conformance如何在test metadata表达 | 决定shared suite参数化方式 | current `05` | 保持未命名变体，不新增第七lane且不替代IntegrationLike |

上述事项均有owner和fail-closed处理，不阻塞Step06。若后续要求新runtime class/mode、reader、root field、entry constructor、hot swap或replay current fallback，必须升级为`03`回写blocker。

## 12. Current M3 后置复核与 affected environment matrix

### 12.1 Runtime class revalidation

| Environment claim | Final M3 contract | Current verdict |
|---|---|---|
| `ENV-LCL-ISO` / `ENV-CI-ISO` | 显式`LocalTest`；Fixed/Deterministic/InMemory/Fake仅在共享不变量下允许 | pass_as_design_lane |
| `ENV-LCL-INT` / `ENV-CI-INT` | 显式`IntegrationLike`；Durable store且不得把InMemory当integration proof | pass_as_design_lane |
| `ENV-STG-RT` / `ENV-PRD-RT` | 显式`RuntimeLike`；Durable/System/Runtime，Endpoint或Disabled，不允许Controlled fallback | pass_as_contract_instance_absent |
| source/schema | 六lane使用同一schema和`DECL < JSON < allowlisted ENV` | pass |
| sensitive material | selected locator不可解析时阻断；任何环境都不允许raw secret fallback | pass |
| test/replay | 是用途轴，不是新runtime class、source或truth owner | pass |
| readiness truth | lane契约已定义，但环境、产品、credential、run和evidence并未建立 | `not_established/not_run` |

### 12.2 Affected environment behavior

| Affected ID | LocalTest / IntegrationLike | RuntimeLike | 禁止的环境特例 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | I05只能做negative fail-closed；无positive fixture truth | slot不激活/startup fail | fake schema、fallback v1 |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | 只验证missing/ambiguous binding拒绝 | enabled mapping缺失即fail | test-only全订阅或name match |
| `R06.6-F2-H13-UPSTREAM` | J06 positive保持Blocked/manual | 同样Blocked/manual | replay profile生成H13成功 |
| `R06-F-AFFECT-UOW-01` | fake/durable都须相同save order/UoW contract | durable capability强制 | isolated lane跳过history/outbox/result |
| `S08-RECOVERY-CLASS-OWNER-01` | 可测试有限class，未知仍fail closed | 未闭合mapper不得release | test profile wildcard action |
| `R07-EXTERNAL-PHASE-LINK-01` | Controlled可返回formal outcomes但link仍必需 | Endpoint link/capability必需 | Fake/health替代intent link |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | same-token/probe accounting parity必需 | capability不足转manual | RuntimeLike blind retry或test budget reset |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | fake/durable都要求same-UoW snapshot | 同样强制 | CI中post-commit rebuild |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | fault lane保持no-ack/probe/manual | 同样强制 | test环境把unknown当success |
| `S08-JOB-REPORT-REF-OWNER-01` | 不生成假report ref或Completed | owner缺失则boundary blocked | report path/run placeholder mint ref |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | compile/fixture也只用canonical owner | release同样强制 | test-only alias/private duplicate |
| `03-RPR-S09-PER-FLOW` | suite可参数化但需exact flow reservation | 每boundary审计60 flow | profile coverage替代per-flow audit |

Step06关闭`0/12`。本轮新发现上游blocker=`none`；staging/prod语义存在不等于实例ready。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已读取SOP Step06、书写规范§5.6与current Step05/runtime/test契约 | pass | §3 |
| 五个SOP问题逐项回答 | pass | §4.1~§4.5 |
| old Step06/formal §6/旧`05/06`已后置审计并隔离 | pass | §5~§7 |
| local / CI / test / staging / prod均明确适用性 | pass | §4.1 / §8.2 |
| 六条lane均有用途、source、dependency、sensitive和difference | pass | §8.2 / §8.14 |
| environment、lane、runtime class与adapter mode未混用 | pass | §8.1 / §8.16 |
| 所有named lane同schema、one JSON和DECL<JSON<ENV | pass | §8.5 / §8.16 |
| LocalTest+Durable未新增lane且未替代IntegrationLike证明 | pass | §8.10 / §8.16 |
| IntegrationLike与RuntimeLike非法组合完整 | pass | §8.4 / `ENV-G03~G08` |
| selected secret失败、Disabled与runtime Unavailable分离 | pass | §8.6~§8.7 / `ENV-G09~G12` |
| Job replay/history不读取current environment fallback | pass | §8.10 / `ENV-G18` / D22 |
| staging/prod真实性状态未伪造 | pass | §8.9 / §8.14 |
| `ENV-G01~G20`完整且只作planned negative input | pass | §8.12 |
| `CFG-D01~D23`全部进入环境矩阵并逐域停审 | pass | §8.13 / §8.15 |
| 跨环境审计无unresolved conflict | pass | §8.16 |
| `VF-OBS-001~010`均有环境门禁映射 | pass | §8.17 |
| `03`影响判定完成且无actual回写项 | pass | §9 |
| formal §6草稿未新增key/value/product/evidence/result | pass | §10 |
| 未修改formal `04`或Step07产物 | pass | 本轮只更新Step06/flow/ledger |
| 未伪造实现、commit、run、artifact、evidence、verdict或signoff | pass | §8.9 / §10及全文truthfulness标记 |
| 上游blocker | pass | `none` |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| P0环境和profile差异可定位 | pass | 六lane显式映射三类formal runtime，source/dependency/sensitive/verification均可判定 |
| 23域环境差异全部停审 | pass | §8.13~§8.15，无漏域或环境特例schema |
| 跨环境/VETO审计无unresolved conflict | pass | §8.16~§8.17 |
| `03` impact无actual待回写 | pass | §9 |
| Step06 gate_status | `pass_consumed_by_step_07` | 最终M3 runtime class/readiness和12项affected环境行为复核通过 |
| next_allowed_action | `continue_to_current_step_07_under_continuous_M4_authorization` | 按SOP进入Step07字段registry与demo闭口 |
