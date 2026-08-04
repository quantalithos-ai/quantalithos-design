# L4-observability 04-配置设计 Step 09 · 定义配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 09
> 回填章节: `04-配置设计.md` §9
> 当前模式: `full-restart`
> 本步边界: 把 current source、exact field registry、sensitive ref 与 formal runtime builder 收敛为可实现的 load / parse / validate / assemble / expose 契约；不支持 reload / hot / in-place swap，不进入 Step 10 变更审批、审计和回滚流程

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/04-配置设计.md`，仍为 `historical_material`，本 Step 不修改 |
| 当前 Step | Step 09 定义配置加载、校验与生效机制 |
| 前序门禁 | Step 08 current M3复核`pass`；用户于2026-08-02授权连续完成全部M4 |
| 当前模块 | `coherent-source-validation-complete-assembly-exposure` |
| 输入状态 | Step 09 SOP/规范、current Step 04~08、formal `00~03`、DDD Step 12/14/15已先读取；旧 Step 09 与 L1/L0 参考已后置审查 |
| 写入状态 | `completed_current_after_M3_revalidation`；原current内容与R2均已对最终formal `03`复核 |
| gate_status | `pass_consumed_by_step_10` |
| next_allowed_action | `continue_to_current_step_10_under_continuous_M4_authorization` |
| 上游 blocker | `none`；`CFG-BLK-09-01` resolved by formal `03` R2 + Step08 R2：raw binding保持infra-only，worker/jobs只获得locator-free metadata + prebuilt registrar + opaque registered handle |
| implementation readiness | `blocked`；formal `04~07`、target repo、concrete provider/store/adapter与真实 tests/evidence 均未完成 |

### 1.1 Step 内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取 Step 09 标准与 current 输入 | §3 输入与采用方式 | done | current source before historical/reference |
| 独立形成 loader / validator / builder 判断 | §4/§7 | done | 不从旧 Step 或 L1 复制 profile/key/identity |
| 后置审查 historical / granularity reference | §5~§6 | done | 只采用结构粒度，不采用相邻项目语义 |
| 固定 source snapshot、ENV registry 与 identity | §8.1~§8.6 | done | exact allowlist、无歧义 parse、body-free revision |
| 闭合 validation / 23域 / assembly / expose | §8.7~§8.15 | done_after_R2 | D05/D21均通过raw/private/safe/catalog/opaque-handle totality审计 |
| 完成停审、VETO、`03` impact 与回填草稿 | §8.16~§11 | done_after_R2 | 23域、跨加载、10 VETO与formal §9草稿已重审 |
| 静态检查、flow/ledger 同步与停审 | §12 | done_after_R2 | Step09停在用户审查点；不得读取/进入Step10 |

### 1.2 写入前检查

| 检查面 | 结果 |
|---|---|
| 正式 `04` 是否允许写入 | no；只能 Step 15 装配 |
| Step 10 是否已获用户确认 | no；不得读取其 SOP/规范或修改其产物 |
| 是否需要第二 config reader | no；只有 `infra::config` 读取 ordinary raw source |
| 是否支持 reload / hot / watch | no；current 只有 cold new complete assembly |
| 是否允许 entry / Job DTO 覆盖 root | no；entry slice和Job snapshot是 derived，DTO只按formal protocol提供本次操作输入 |
| 是否允许 source/path/env name进入config identity | no；identity只覆盖effective typed semantics |
| 是否允许 resolved secret material进入identity/diagnostic | no；material在identity之后解析且不回填candidate |
| 是否需要立即回写 formal `03` | R2 completed：DDD Step05/07/14/17/19及formal §5/§6/§13/§15/§16已同步entry-safe prebuilt registration seam，未改变business port/protocol/state/UoW/schema |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 固定配置在process/new-assembly启动时如何获得one coherent ordinary source snapshot。
2. 将Step05的`DECL < one strict JSON < allowlisted ENV`落实为exact field winner与invalid-winner no-fallback算法。
3. 固定strict JSON、exact ENV key、primitive decode、typed parse、range、required、cross-field、profile和redline顺序。
4. 定义body-free `ConfigBindingRef`如何稳定代表effective typed candidate，同时不泄露source、locator或secret material。
5. 把Step08的R/S-L/mixed处理放到identity之后、adapter暴露之前的owner-specific resolution阶段。
6. 将formal 13-stage builder细化到store capability、adapter descriptor、safe catalog、five façades、three entry slices和entry-local composition。
7. 对`CFG-D01~D23`逐域说明parse、type validate、cross-field、assemble target、expose和failure，并逐域停审。
8. 审计required field、ENV mapping、cross-field、reload/hot、partial runtime、error/no-output、historical snapshot和`03` impact是否断裂。

### 2.2 本步非目标

- 不实现Rust loader、validator、builder、serde、hash、provider或adapter代码。
- 不新增public `ConfigLoader` / `ConfigValidator` trait、business port、remote config service或admin API。
- 不选择JSON文件path、deployment mount、secret provider产品、store产品、transport产品或credential实例。
- 不定义配置artifact的发布、审批、change audit、previous-approved registry、rollback authority、drain时限或retirement流程；这些属于Step10/13/`07`/operations。
- 不支持multi-file、include、overlay、JSONC runtime parse、whole-config ENV、CLI field override、entry-local root override、reload、hot或in-place adapter swap。
- 不把configuration validation、assembly telemetry、health、provider receipt或config ref写成business truth、run/evidence alias、验收结论或测试结果。
- 不为loader私自引入新的startup error variant；只使用formal七个`RuntimeAssemblyError` variant。

## 3. 输入与采用方式

| 输入 | 当前身份 | 本 Step 采用方式 |
|---|---|---|
| 配置设计 SOP Step09 / 书写规范 §5.9/§6 | current standard | 固定八问、流程图、两类表、逐域停审、跨加载审计与`03`影响门禁 |
| 通用编写/中间产物/可落码/依赖标准 | current standard | 固定逐Step、current-first、1:1输入来源、唯一owner、only-core compile edge与no-fabrication |
| current Step04 | direct upstream | current root全为startup/new assembly；24组禁止项无field/source/override |
| current Step05 | direct upstream | source词表、R0/R1/R2、24冲突、selected source与invalid winner语义 |
| current Step06 | direct upstream | six lane只映射three runtime classes；所有lane同source/schema，无implicit profile |
| current Step07 | direct upstream | exact root/leaf/nested schema、required/default/source/range/finite/cardinality、23域和10 VETO |
| current Step08 | direct upstream | R/S-L/mixed、three-layer ownership、private resolution、new assembly、historical binding与no-output |
| formal `03` §5.4/§11/§13/§14 | code baseline | `infra::config` owner、validated root、7 startup errors、13 stages、safe telemetry与three entry slices |
| DDD Step12/14/15 | detailed source | exact error boundary、builder/validation matrix、entry exposure与config telemetry allowlist |
| old L4 Step09 | historical material | current判断完成后才读取；仅诊断81行schema-first和自动推进问题 |
| L1-governance / L1-artifact / L1-identity / L0-bus Step09 | granularity reference | 只参考流程、cross-field、assemble target、issue/no-output与停审结构；不复制key/profile/job override/LKG/digest |

### 3.1 真相源优先级

发生冲突时按以下顺序裁定:

```text
current standards
  > current formal 00/01/02/03
  > current 04 Step01~08
  > old L4 Step09 as historical diagnosis only
  > L1/L0 Step09 as structure/granularity reference only
  > README / old formal 04/05/06/07 as historical material only
```

### 3.2 本步判断原则

| 原则 | 具体含义 |
|---|---|
| Coherent before merge | JSON bytes和allowlisted ENV occurrences必须各自一次性capture；禁止边parse边重读可变source |
| Registry before decode | 先以compile-time exact registry识别canonical JSON path/ENV key/allowed source，再对值做类型decode |
| Winner before validation | 每个field先按R0<R1<R2确定唯一winner；winner非法时拒绝，不回退 |
| Structural before semantic | strict JSON/unknown/duplicate/type先于range/required/cross-field/profile/redline |
| Identity before material | compatible typed candidate先产生`ConfigBindingRef`，再解析S-L material；provider result不改变config semantics |
| Complete before expose | store/adapter/capability/catalog/service/slice全部成功后才返回runtime；不暴露partial façade/root |
| Derived is not source | safe catalog、entry slice、Job snapshot、availability与history都不回到ordinary merge |
| No hidden authority | config只wiring/bounded parameter/policy binding，不改变truth/state/UoW/no-write/idempotency/token/redaction |

## 4. SOP 问题回答

### 4.1 配置在什么时机加载?

每次process composition或受控replacement准备一个**new complete assembly**时加载一次。API、worker、jobs binary可以各自启动，但必须调用同一`infra::config` loader/validator/builder语义；binary、host、lane或branch不能推断profile或建立第二schema。Assembly返回后root immutable；accepted Job只从该assembly在start UoW冻结relevant snapshot，resume只读stored snapshot。

### 4.2 配置如何 parse 和 type validate?

先capture selected strict JSON bytes和exact project ENV namespace，再以strict parser拒绝comment、trailing comma、duplicate/unknown/alias；ENV只按61项compile-time allowlist映射为canonical leaf。随后按field registry选择winner，执行exact null/bool/integer/enum/ref/object/array decode、overflow/range/canonical set/catalog/required校验。任何trim、case-fold、numeric string coercion、last-wins或ignore unknown均禁止。

### 4.3 哪些配置需要 cross-field validate?

所有required root、profile与technical/external/store mode、default/max、schema subsets、source/producer static map、store atomic group、digest readable/write、retention windows、projection closure、lease/backoff/timeout、adapter capability、enabled route/Consumer/Job/target totality、schedule与safe projection均需要。Exact规则编号见§8.6~§8.7。

### 4.4 哪些配置 startup / reload / hot / build-time / static?

全部current root field都是`startup`或cold new-assembly input。Boundary/retention/retry/batch等虽在operation时消费，仍来自immutable assembly；Job相关subset在accepted start时冻结。`reload`、`hot`均unsupported；build-time只包含binary/schema/registry/code invariant，不是root config；truth/state/UoW/no-write/redaction/idempotency/token等属于`static`设计边界且没有field。

### 4.5 校验失败后如何处理?

Source read失败映射`ConfigSourceUnavailable`；identity前的parse/type/range/required/cross-field/profile/redline失败映射`InvalidConfiguration { config_ref: None }`；identity后digest compatibility或derived invariant失败可携带`Some(config_ref)`；sensitive/store/adapter/capability/entry失败分别使用formal exact variant。所有失败返回one error、zero business write、zero业务external-effect call、zero façade exposure；已进入后续stage的candidate可能执行infra-private locator resolution或只读startup capability probe，但不得发送业务payload、做migration或改变外部truth。New candidate失败不声明LKG/rollback成功，old assembly生命周期交Step10。

### 4.6 每个配置项/组是否与Step07一致?

是。§8.3机械展开Step07批准的61个ENV leaf，§8.4/§8.6~§8.8覆盖winner、type、required与配置组，§8.9按23域映射parse/type/cross-field/assemble/expose/failure。JSON-only set/catalog/object没有新增ENV入口；range与requiredness没有增加implicit default。R2后raw Consumer/schedule binding不再进入entry slice，safe registration metadata与Step07 finite operation/schema完全一致。

### 4.7 每个配置域是否通过停审?

是。D01~D23全部通过停审。D05以raw binding -> resolved private slot -> locator-free safe item -> finite handler -> opaque handle闭合entry registration；D21确认registrar没有locator/material/private registry getter且不属于business port。

### 4.8 是否仍有未校验必填项、cross-field、hot rollback或`03`缺口?

Required/cross-field/reload/hot/error与entry exposure边界均已闭合，无未校验的required/cross-field/hot rollback或current `03`缺口。`RuntimeAssemblyIssueRef`仍由process-scoped infra-private bootstrap generator产生，不依赖未构造的business ID adapter。`CFG-BLK-09-01`已按用户授权的targeted R2路径关闭；修复没有放宽Step08强隔离。

## 5. Historical material 与参考审查

### 5.1 旧 L4 Step09 诊断

| 旧内容 | 问题 | Current处理 |
|---|---|---|
| 81行通用模板 | 无Step09八问、load图、field/domain表、cross-field、builder target、停审或`03`impact | 全量替换 |
| `NormalizedLogRecord`/`MetricPoint`/`TraceSpanRecord`等 | 把详细设计废弃schema当配置加载主语 | 不承接任何对象或字段 |
| `next_step_or_formal_assembly` | 跳过逐Step用户门禁 | 废弃；Step09完成后停在用户审查点 |
| README产品/数字线索 | 无current source资格 | 只作为historical risk，不进入loader/profile/range |

### 5.2 L1/L0 粒度采用边界

| 参考结构 | 采用 | 不采用 |
|---|---|---|
| load流程、校验总表、cross-field、assemble target、stop review | 作为结构完整性检查 | 其project-specific root/key/profile/target |
| strict JSON、high-priority invalid fail、no partial façade | 与current source一致，采用 | L1 entry-local/Job root override或CLI selector |
| reload/hot unsupported | 采用范围裁剪 | “收到reload请求保留旧graph”作为current API事实；本项目根本无该request surface |
| validation issue表 | 采用finite stage/error/no-output思想 | 新public issue enum、redacted digest、path/field名默认输出 |
| digest/config identity | 只保留stable body-free revision目标 | 相邻项目redacted config digest/audit字段、LKG registry |

## 6. 改动前后对比

| 维度 | 旧 Step09 | Current Step09 | 价值 |
|---|---|---|---|
| 主语 | log/metric/trace/audit schema | source snapshot -> validated root -> complete runtime | 回到配置设计职责 |
| source | 未定义 | DECL<one strict JSON<61 exact ENV leaves | 实现无权自造reader/key |
| parse | 泛化 | strict JSON/ENV lexical/typed/canonical分层 | 可建立确定失败切口 |
| validation | 无 | required/range/24+ cross-field/profile/redline | 防止partial或first-call failure |
| identity | 无 | effective typed semantic revision，material/source无关 | ENV override与old snapshot可解释 |
| sensitive | 无 | identity后owner-specific private resolution | 不扩大secret流经面 |
| assembly | 无 | formal 13-stage complete-or-error细化 | 可映射builder/constructor/entry |
| activation | 自动推进 | cold new assembly eligible；actual switch留Step10 | 不伪造reload/rollback |
| gate | 自动下一步 | static checks后等待用户确认Step10 | 遵守逐Step流程 |

## 7. 核心设计取舍

| 议题 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| JSON source | zero-or-one selected strict JSON | multi-file/include/overlay/JSONC runtime | 无原子排序、alias与迁移契约 |
| ENV namespace | `QUANTALITHOS_OBSERVABILITY__...` exact compile-time registry | runtime prefix-to-path reflection | unknown/collision/secret入口必须可穷举 |
| ENV nullable | exact sentinel `null`;empty非法 | empty=absent/null、trim后解析 | 区分absent/explicit null/invalid intent |
| merge | field winner R0<R1<R2 | whole-source winner或deep merge | 与Step05/07 field source一致 |
| invalid winner | reject complete candidate | fallback JSON/DECL | 不掩盖显式operator intent |
| canonical collections | typed sort + reject input duplicate | silent dedup或按input order identity | 保证totality与stable semantics |
| config identity | domain-separated whole-candidate semantic revision | file hash、path revision、per-field/locator fingerprint | 覆盖effective semantics且不建立hash逃逸输出 |
| sensitive resolution | identity之后infra-private owner resolver | loader解析material或provider覆盖candidate | 保持Step08三层ownership |
| activation | complete assembly仅标eligible fornew work | builder内部热换/自动LKG | actual switch/drain/rollback需Step10 authority |
| issue identity | infra-private bootstrap generator | business ID generator、time/path/raw hash、evidence alias | source失败发生在technical adapter构造前 |
| output | formal telemetry allowlist only | field path/env key/raw cause/digest dump | 遵守Step08/DDD Step15 no-output |

## 8. 结构化中间产物

### 8.1 配置加载流程图: L4-observability 配置加载与校验

```text
[process / new-assembly invocation]
  -> [infra-private bootstrap issue-ref generator ready]
  -> [capture code declaration registry R0]
  -> [capture zero-or-one selected strict JSON byte snapshot R1]
  -> [capture exact allowlisted ENV occurrence snapshot R2]
  -> [strict JSON structure parse + exact ENV lexical decode]
  -> [per canonical leaf choose winner: R0 < R1 < R2]
  -> [typed parse + primitive range + canonical collection validation]
  -> [required + cross-field + profile + redline validation]
  -> [derive whole-candidate ConfigBindingRef]
  -> [resolve selected sensitive locators into infra-private material]
  -> [validate store schema / atomicity / CAS / fence capability]
  -> [construct technical and external adapters + validate descriptors]
  -> [build body-free availability registry and safe external catalog]
  -> [assemble five application façades]
  -> [derive API / worker / jobs entry slices]
  -> [return one complete BuiltObservabilityRuntime]
  -> [entry-local static composition; eligible for new work]
```

任一箭头失败都立即返回formal `RuntimeAssemblyError`，并销毁本次candidate所持有的临时typed value、private material和未暴露adapter。失败路径不得跳过stage、不得回退低优先级winner、不得返回partial root，也不得把“旧assembly仍在运行”记录为本次candidate的成功、LKG或rollback。实际切换、drain、retire与rollback authority留给Step10。

### 8.2 Source capture 与 parser safety ceiling

#### 8.2.1 Invocation input 与唯一reader

| 输入 | Owner | Capture contract | 不进入的材料 |
|---|---|---|---|
| code declaration | `observability-infra::config` compile-time registry | 每次load复制同一schema/version/required/default/source metadata；不得从Rust `Default`反推required value | binary name、profile guess、test private map |
| selected JSON source | process/deployment composition传给`infra::config`的zero-or-one source selector | selector存在时先完整读取为one immutable byte buffer，再parse；读取失败不是“file absent” | selector/path、mtime、inode、permission detail、raw bytes均不进root/identity/telemetry |
| process ENV | `infra::config` exact registry reader | 在JSON capture完成后，一次枚举process ENV并复制项目namespace内全部raw key/value occurrence，再与61项registry比对；无关namespace忽略 | 运行中重读、prefix reflection到任意path、whole-config ENV、raw secret material |
| bootstrap issue identity | process-scoped infra-private generator | 在任何source/clock/business ID adapter构造前可生成opaque `RuntimeAssemblyIssueRef` | wall clock、source path、env key、raw hash、run/evidence alias |

Source selector是host/process invocation input，不是`ValidatedObservabilityConfig`字段，也不是CLI field override。Current可以由deployment选择“无JSON”或“一个JSON source”，但不能选择第二schema、include、overlay或priority。API、worker、jobs各binary即使独立组装，也调用同一reader和registry；entry crate不得读取raw source。

#### 8.2.2 Coherent snapshot 规则

1. R0 registry在binary内是immutable compile-time value；一次load只引用一个registry revision。
2. R1存在时必须先完成whole-byte read，再开始UTF-8/JSON parse；读取过程中短读、内容变化、超限或I/O失败均返回`ConfigSourceUnavailable`，不能使用部分bytes。
3. R2必须在one enumeration pass中复制所有以ASCII exact prefix `QUANTALITHOS_OBSERVABILITY__`开头的raw key/value occurrence，随后冻结map，再检查unknown/duplicate/non-UTF-8 key与61项allowlist；只有registry key可进入value decode。同一次load不得边merge边再次读取process ENV。
4. R1与R2无需跨OS source形成分布式原子快照；coherence边界是“各source内部一次capture + 固定capture顺序 + 后续只读captured values”。部署若要求跨file/env原子发布，必须通过启动编排保证，不得由loader猜测。
5. Capture结束后，parse、merge、identity和assembly只读snapshot；new assembly invocation才可取得下一份snapshot。
6. `SRC-HISTORY`、secret provider result、health/probe、Job DTO、entry args和current runtime state不属于ordinary source snapshot。

#### 8.2.3 Strict parser ceiling

| Gate | Exact rule | Failure | 边界说明 |
|---|---|---|---|
| JSON bytes | selected snapshot最大`1 MiB`，按原始byte count判定 | `InvalidConfiguration { config_ref: None }` | compile-time loader safety ceiling；不是request body limit、SLO、容量或环境验收值 |
| encoding | exact UTF-8；不接受BOM或替换字符恢复 | 同上 | 不trim whole document |
| nesting | root算depth 1，最大depth 8；进入object/array增加1 | 同上 | compile-time parser safety ceiling；不是业务schema扩展权 |
| syntax | strict JSON；拒绝comment、trailing comma、NaN/Infinity、duplicate object key | 同上 | runtime不parse Step07的JSONC文档示例 |
| root | exact object；11个known root section之外unknown拒绝 | 同上 | 不接收系统聚合外层`l4_observability` |
| object | exact key set；unknown/duplicate/alias拒绝 | 同上 | 不提供`extra`/`properties`逃逸桶 |
| number | 只接受无fraction/exponent的JSON integer，再做target width/positive/range | 同上 | 不做float/string coercion |
| string/ref | exact token或non-empty opaque UTF-8 string；不trim、不case-fold | 同上 | ref不解析prefix，不输出value |
| ENV value | exact non-empty UTF-8 occurrence；nullable ref仅exact lowercase `null` | 同上 | empty、whitespace-only、`NULL`、quoted `"null"`均非法 |

JSON source被成功读取但内容超限/非法属于candidate错误，因此映射`InvalidConfiguration`；只有source无法取得完整snapshot才映射`ConfigSourceUnavailable`。两者都使用bootstrap issue ref，但默认诊断不暴露path、key、value、byte count或parser原始message。

### 8.3 Exact ENV registry

ENV namespace固定为`QUANTALITHOS_OBSERVABILITY__`。Canonical JSON path的每个segment转uppercase snake case并以双下划线分隔；registry在compile time逐项登记，不允许运行时把任意prefix suffix反射成path。

| Registry family | Exact ENV key -> canonical JSON leaf |
|---|---|
| profile | `QUANTALITHOS_OBSERVABILITY__PROFILE` -> `profile` |
| technical | `QUANTALITHOS_OBSERVABILITY__TECHNICAL__CLOCK_MODE` -> `technical.clock_mode`; `QUANTALITHOS_OBSERVABILITY__TECHNICAL__CLOCK_BINDING_REF` -> `technical.clock_binding_ref`; `QUANTALITHOS_OBSERVABILITY__TECHNICAL__ID_GENERATOR_MODE` -> `technical.id_generator_mode`; `QUANTALITHOS_OBSERVABILITY__TECHNICAL__ID_GENERATOR_BINDING_REF` -> `technical.id_generator_binding_ref` |
| boundary | `QUANTALITHOS_OBSERVABILITY__BOUNDARY__MAX_REQUEST_BODY_BYTES` -> `boundary.max_request_body_bytes`; `QUANTALITHOS_OBSERVABILITY__BOUNDARY__DEFAULT_PAGE_LIMIT` -> `boundary.default_page_limit`; `QUANTALITHOS_OBSERVABILITY__BOUNDARY__MAX_PAGE_LIMIT` -> `boundary.max_page_limit`; `QUANTALITHOS_OBSERVABILITY__BOUNDARY__QUERY_READ_TIMEOUT_MS` -> `boundary.query_read_timeout_ms` |
| safety | `QUANTALITHOS_OBSERVABILITY__SAFETY__REDACTION_POLICY_REF` -> `safety.redaction_policy_ref`; `QUANTALITHOS_OBSERVABILITY__SAFETY__SAFE_LABEL_POLICY_REF` -> `safety.safe_label_policy_ref`; `QUANTALITHOS_OBSERVABILITY__SAFETY__CORRELATION_MAPPING_POLICY_REF` -> `safety.correlation_mapping_policy_ref`; `QUANTALITHOS_OBSERVABILITY__SAFETY__VISIBILITY_POLICY_REF` -> `safety.visibility_policy_ref`; `QUANTALITHOS_OBSERVABILITY__SAFETY__BODY_FREE_SCANNER_POLICY_REF` -> `safety.body_free_scanner_policy_ref` |
| stores | `QUANTALITHOS_OBSERVABILITY__STORES__OBSERVATION__MODE` -> `stores.observation.mode`; `QUANTALITHOS_OBSERVABILITY__STORES__OBSERVATION__BINDING_REF` -> `stores.observation.binding_ref`; `QUANTALITHOS_OBSERVABILITY__STORES__PROJECTION__MODE` -> `stores.projection.mode`; `QUANTALITHOS_OBSERVABILITY__STORES__PROJECTION__BINDING_REF` -> `stores.projection.binding_ref`; `QUANTALITHOS_OBSERVABILITY__STORES__IDEMPOTENCY_RESULT__MODE` -> `stores.idempotency_result.mode`; `QUANTALITHOS_OBSERVABILITY__STORES__IDEMPOTENCY_RESULT__BINDING_REF` -> `stores.idempotency_result.binding_ref`; `QUANTALITHOS_OBSERVABILITY__STORES__JOB_EXECUTION__MODE` -> `stores.job_execution.mode`; `QUANTALITHOS_OBSERVABILITY__STORES__JOB_EXECUTION__BINDING_REF` -> `stores.job_execution.binding_ref`; `QUANTALITHOS_OBSERVABILITY__STORES__TRANSACTION_TIMEOUT_MS` -> `stores.transaction_timeout_ms`; `QUANTALITHOS_OBSERVABILITY__STORES__REQUIRED_SCHEMA_REVISION` -> `stores.required_schema_revision` |
| idempotency | `QUANTALITHOS_OBSERVABILITY__IDEMPOTENCY__COMMAND_RESERVATION_MS` -> `idempotency.command_reservation_ms`; `QUANTALITHOS_OBSERVABILITY__IDEMPOTENCY__CONSUMER_DEDUP_MS` -> `idempotency.consumer_dedup_ms`; `QUANTALITHOS_OBSERVABILITY__IDEMPOTENCY__JOB_RESERVATION_MS` -> `idempotency.job_reservation_ms`; `QUANTALITHOS_OBSERVABILITY__IDEMPOTENCY__RESERVED_RECONCILIATION_AGE_MS` -> `idempotency.reserved_reconciliation_age_ms`; `QUANTALITHOS_OBSERVABILITY__IDEMPOTENCY__EXTERNAL_INTENT_MS` -> `idempotency.external_intent_ms` |
| projection | `QUANTALITHOS_OBSERVABILITY__PROJECTION__MAX_SOURCE_ITEMS_PER_CAPTURE` -> `projection.max_source_items_per_capture`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__MAX_RELATION_CLOSURE_ITEMS` -> `projection.max_relation_closure_items`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__DEFAULT_REBUILD_BATCH` -> `projection.default_rebuild_batch`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__DEFAULT_REFRESH_BATCH` -> `projection.default_refresh_batch`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__DEFAULT_GAP_SCAN_BATCH` -> `projection.default_gap_scan_batch`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__DEFAULT_ROLLUP_BATCH` -> `projection.default_rollup_batch`; `QUANTALITHOS_OBSERVABILITY__PROJECTION__FRESHNESS_POLICY_REF` -> `projection.freshness_policy_ref` |
| execution | `QUANTALITHOS_OBSERVABILITY__EXECUTION__MAX_PARALLELISM` -> `execution.max_parallelism`; `QUANTALITHOS_OBSERVABILITY__EXECUTION__MAX_PLAN_ITEMS` -> `execution.max_plan_items`; `QUANTALITHOS_OBSERVABILITY__EXECUTION__JOB_TIMEOUT_MS` -> `execution.job_timeout_ms` |
| root external modes | `QUANTALITHOS_OBSERVABILITY__EXTERNAL__OBSERVATION_SOURCE__MODE`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__RUNTIME_SANDBOX__MODE`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__GOVERNANCE_ARTIFACT__MODE`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__SUBJECT_CONTEXT__MODE`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__EVENT_PUBLISHER__MODE` -> corresponding `external.<slot>.mode` |
| root external bindings | `QUANTALITHOS_OBSERVABILITY__EXTERNAL__OBSERVATION_SOURCE__BINDING_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__RUNTIME_SANDBOX__BINDING_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__GOVERNANCE_ARTIFACT__BINDING_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__SUBJECT_CONTEXT__BINDING_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__EVENT_PUBLISHER__BINDING_REF` -> corresponding `external.<slot>.binding_ref` |
| root external credentials | `QUANTALITHOS_OBSERVABILITY__EXTERNAL__OBSERVATION_SOURCE__CREDENTIAL_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__RUNTIME_SANDBOX__CREDENTIAL_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__GOVERNANCE_ARTIFACT__CREDENTIAL_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__SUBJECT_CONTEXT__CREDENTIAL_REF`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__EVENT_PUBLISHER__CREDENTIAL_REF` -> corresponding `external.<slot>.credential_ref` |
| root external timeouts | `QUANTALITHOS_OBSERVABILITY__EXTERNAL__OBSERVATION_SOURCE__CALL_TIMEOUT_MS`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__RUNTIME_SANDBOX__CALL_TIMEOUT_MS`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__GOVERNANCE_ARTIFACT__CALL_TIMEOUT_MS`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__SUBJECT_CONTEXT__CALL_TIMEOUT_MS`; `QUANTALITHOS_OBSERVABILITY__EXTERNAL__EVENT_PUBLISHER__CALL_TIMEOUT_MS` -> corresponding `external.<slot>.call_timeout_ms` |
| entry loop | `QUANTALITHOS_OBSERVABILITY__ENTRIES__OUTBOX_LOOP_CADENCE_MS` -> `entries.outbox_loop_cadence_ms`; `QUANTALITHOS_OBSERVABILITY__ENTRIES__OUTBOX_LOOP_CANDIDATE_LIMIT` -> `entries.outbox_loop_candidate_limit` |

Registry coverage count必须保持：`1 profile + 4 technical + 4 boundary + 5 safety refs + 10 stores + 5 idempotency + 7 projection + 3 execution + 20 root external leaves + 2 entry loop = 61`。

以下字段明确**没有**ENV入口：schema/source/operation set、digest set、claim object、四个retry object、capability array、outbound/report/export catalog、inbound Consumer catalog、enabled surface set和schedule catalog。项目namespace内出现不在上述61项的key，包含拼写错误、旧alias、catalog index、set fragment或大小写变体，均拒绝整个candidate；process中不属于`QUANTALITHOS_OBSERVABILITY__` namespace的变量忽略。一个exact key在process ENV中天然只有一个winner occurrence，不定义逗号列表、append/delete或重复key语义。

### 8.4 Winner merge、typed parse 与 canonicalization

#### 8.4.1 Per-field winner algorithm

```text
for each canonical field in compile-time registry order:
  gather declared value/default-or-missing R0
  gather JSON occurrence-or-missing R1
  gather allowlisted ENV occurrence-or-missing R2
  reject any occurrence from a source not allowed for this field
  choose highest present occurrence: R2 else R1 else R0
  decode only that winner into the field's exact raw type
  if winner decode/type/range fails: reject candidate; never inspect lower value as fallback
after all leaves:
  validate required presence, object completeness, canonical collections,
  cross-field, profile, capability declaration shape and redlines
```

R0只在Step07明确给出DECL default的字段提供value：`digest.write_profile=v1`、`digest.readable_profiles=[v1]`、`execution.max_parallelism=1`和四个retry的`max_additional_attempts=0`。其他registry declaration只是required/type/source metadata，不提供Rust zero value、first enum、empty collection、null或P0 baseline作为缺失fallback。

#### 8.4.2 Decode 与 canonical output

| Raw family | Winner decode | Canonical typed output | Reject conditions |
|---|---|---|---|
| bool | current root无bool leaf | n/a | 新bool key/字符串bool均unknown |
| integer | JSON integer或ENV canonical decimal digits；positive type不得带sign，zero只在明确允许的retry attempts/jitter | exact `u16/u32/u64`或typed positive wrapper | `+`、`-0`、leading zero（值`0`除外）、whitespace、fraction、exponent、overflow、range失败 |
| enum | exact lowercase snake-case token | formal enum variant | trim/case-fold/alias/numeric/unknown/`Other` |
| required ref | exact non-empty opaque string | typed newtype | null、empty、whitespace-only；不解析prefix或格式外语义 |
| nullable ref | exact string或JSON null/ENV exact `null` | `Option<TypedRef>` | missing、empty、quoted sentinel、wrong mode combination |
| strict object | exact required/optional declared keys | formal nested config type | unknown/duplicate/missing child；禁止partial object fallback |
| finite set | JSON array only；逐项typed parse，按typed canonical bytes排序 | unique `Vec<Enum/Newtype>` | duplicate input、empty when required、unknown、unsupported subset |
| catalog | JSON array only；逐entry exact object parse，按typed subject key排序 | unique typed entries | duplicate subject/effect ref、unknown child、totality或static map失败 |
| capability list | JSON array only；按phase排序 | exact formal capability vector | duplicate phase、family不允许phase、descriptor overclaim |

Canonicalization只改变内部排序和typed representation，不修复operator input：duplicate仍失败；不同source产生相同effective typed semantics可得到同一config identity；input array顺序、JSON object key顺序和ENV capture顺序不改变identity。Canonical bytes不进入log、metric、span、audit、report、artifact或generic persistence。

### 8.5 Config identity

`ConfigBindingRef`代表**整个effective typed compatible candidate**的stable body-free semantic revision。它在cross-field/profile/redline通过后、任何sensitive material resolution前产生；因此identity存在不表示provider/store/adapter可用，也不表示runtime已assembly或activated。Current producer是`infra::config`内部的`CFGIDv1` encoder；它复用existing `ConfigBindingRef(BodyFreeRef)` carrier，但不声称上游已提供通用ref derivation service。

#### 8.5.1 Identity projection

| Included semantics | Excluded material |
|---|---|
| root的11个section及全部effective typed field；包括ENV winner后的值、explicit null、canonical finite set/catalog、opaque policy/store/adapter/credential/transport/schedule locator的typed value | source kind、source selector/path、env key、presence source、JSON order、ENV capture order、mtime/permission、parser detail |
| root adapter与catalog的declared mode、binding/effect ref、timeout、capability；entry enablement/mapping；technical/store mode；bounds/retry/retention/digest/profile | resolved secret/provider material、provider receipt/health/error、adapter runtime descriptor、availability、old assembly state |
| canonical schema version与identity domain version | run id、evidence alias、acceptance/signoff、business ID、wall clock、deployment name |

Opaque locator winner变化必须改变whole-candidate revision，因为它改变将被解析的binding semantics；这不违反Step08“禁止locator fingerprint/hash escape”：实现只返回one whole-candidate opaque `ConfigBindingRef`，不得输出locator、per-field digest、locator fingerprint、canonical bytes或raw hash。Credential provider在同一locator和destination语义下轮换private material，可以不改变config ref；是否需要new `ExternalEffectBindingRef`仍按Step08 destination/idempotency namespace规则判断。

#### 8.5.2 `CFGIDv1` canonical frame

`CFGIDv1`不是Step13 request/plan digest profile，不能调用operation digest helper或把config ref当`DigestSummary`。Encoder只接受已完成S08的typed candidate，按以下exact framing生成one ephemeral byte sequence：

| Frame element | Exact encoding |
|---|---|
| domain | ASCII `quantalithos/l4-observability/config-binding/CFGIDv1`，作为第一个length-prefixed segment |
| segment framing | one byte type tag + unsigned 32-bit big-endian payload length + payload；长度溢出或allocation失败即derivation failure |
| root | section顺序固定为`profile,technical,boundary,safety,stores,digest,idempotency,projection,execution,external,entries`；section/field ID使用compile-time canonical lowercase path segment，不使用source path或array index |
| unsigned integer | exact target width的big-endian bytes；type tag区分`u16/u32/u64` |
| enum | formal exact lowercase wire token的UTF-8 bytes；enum type tag与field ID共同隔离不同owner的同名token |
| typed ref/locator | typed owner discriminator + exact validated UTF-8 value；只存在于ephemeral preimage，不单独hash、输出或持久化 |
| optional | exact `none` tag或`some` tag + one framed typed value；missing不允许到达encoder |
| object | object tag + declared child count + 按compile-time field order排列的child field-ID/value frames |
| set/list | list tag + item count + canonical item frames；set已按typed canonical bytes排序，input order不保留 |
| catalog | catalog tag + entry count + 按typed subject discriminator/key排序的entry object；不编码raw array index |

Type tag与field-ID清单属于同一compile-time `CFGIDv1` registry；实现不得用language `Debug`、serde默认enum layout、map iteration order、platform endian、pointer value或locale构造preimage。Registry/type/field顺序任何变化都是identity schema变化，必须产生新`CFGIDv2`并进入Step13迁移，不能继续使用v1 tag。

#### 8.5.3 Derivation、representation 与 collision handling

1. 对完整`CFGIDv1` frame执行SHA-256一次；不对leaf、locator或section分别产生可观察digest。
2. `BodyFreeRef.value`固定为ASCII `qobs-cfg-v1:`加64个lowercase hexadecimal digest字符，再包装为`ConfigBindingRef`。Prefix属于config identity version，不是source/profile/environment/path信息。
3. 同一effective typed candidate必须得到相同ref；source kind、JSON key order、catalog input order或ENV winner位置变化但typed semantics相同时ref不变；任一included semantic变化时预期ref变化。
4. Encoder/length/constructor失败返回`InvalidConfiguration { config_ref: None }`。不得改用random、time、path、raw-file hash、business ID generator或evidence alias。
5. 同一process若已持有某ref对应的typed candidate，又观察到相同ref但typed candidate不等，必须视为collision并返回`InvalidConfiguration { config_ref: Some(ref) }`，两者都不得activate。跨process/global collision detection在physical historical registry未选定前不能伪称已具备；任何实际发现的collision都必须fail closed并触发CFGID version migration。
6. Identity成功后构造immutable `ValidatedObservabilityConfig`；后续private material、descriptor和availability不得回写或mutate该root。

SHA-256在此只形成whole-candidate opaque identity。允许输出的是formal telemetry allowlist中的typed `config_ref`；禁止输出64-hex suffix的独立字段、canonical frame、preimage、per-field/section digest、locator fingerprint或“redacted raw config hash”。

实现可以在stage内短暂持有canonical buffer，但必须在derivation结束后释放，不得把它放入generic audit、diagnostic、snapshot或application service。可恢复性依赖durable historical config/binding机制的具体实现，留给Step10/`07`；本Step只固定old work必须能按stored `ConfigBindingRef`和binding identity恢复，不能以current candidate补造。

### 8.6 Validation stage、requiredness 与 error mapping

Validation顺序是contract，不是实现建议。前一阶段未成功时，后一阶段不得运行；一个candidate只返回one formal error。内部实现可使用finite stage ID、rule ID和canonical field ID做测试定位，但不能新增public validation issue enum，也不能把field path/env key/raw cause默认输出。

| Stage ID | Input | Validation | Success output | Formal failure |
|---|---|---|---|---|
| `VAL-S01` | source selector / captured source | source存在时可完整读取；R1/R2 snapshot coherent | immutable raw source snapshot | `ConfigSourceUnavailable` |
| `VAL-S02` | JSON/ENV snapshot | ceiling、UTF-8、strict syntax、exact namespace/key/object shape | structural occurrences | `InvalidConfiguration { config_ref: None }` |
| `VAL-S03` | winning raw occurrences | exact primitive/enum/ref/null/object/array decode、integer width/range | typed leaf candidate | 同上 |
| `VAL-S04` | typed leaves | required root/leaf/object child、conditional null/value、collection cardinality | complete typed candidate | 同上 |
| `VAL-S05` | complete typed candidate | canonical set/catalog、finite token、static Consumer producer map、schema subset | canonical candidate | 同上；final entry totality可用`EntryBindingIncomplete` only after config ref |
| `VAL-S06` | canonical candidate | numeric/cross-window/lease/backoff/timeout/target totality | cross-field compatible candidate | `InvalidConfiguration { config_ref: None }` |
| `VAL-S07` | compatible candidate | profile/mode/environment matrix | profile-compatible candidate | 同上 |
| `VAL-S08` | profile-compatible candidate | 24 forbidden configuration redlines / 10 requirement VETO | redline-compatible candidate | 同上 |
| `VAL-S09` | redline-compatible candidate | digest readable/write compatibility + identity projection/derivation | immutable `ValidatedObservabilityConfig` with config ref | `InvalidConfiguration`; identity前`None`，identity后`Some` |
| `VAL-S10` | validated refs | selected owner-specific locator/material resolution | private resolution registry | `SensitiveReferenceUnavailable` |
| `VAL-S11` | store configs/private descriptors | schema revision、atomic UoW、unique/CAS、claim/fence capability | qualified store constructors | `StoreCompatibilityMismatch` / `RequiredCapabilityMissing` |
| `VAL-S12` | adapter config/private descriptors | mode/family/phase/token/probe capability与implementation descriptor一致 | concrete private adapter registry | `AdapterConstructionFailed` / `RequiredCapabilityMissing` |
| `VAL-S13` | validated entries/services/catalog | enabled surface/route/service/target totality与slice权限 | complete built runtime | `EntryBindingIncomplete` |

#### 8.6.1 Required 与 conditional required rules

| Rule ID | Exact rule | Failure stage |
|---|---|---|
| `CFG-RQ-01` | 11个root section全部存在；`profile`显式存在；除DECL default叶外，Step07标记required的leaf/object/catalog必须显式出现 | S04 |
| `CFG-RQ-02` | `technical.clock_binding_ref`与`id_generator_binding_ref`的key必须显式出现为value或null；每个mode的exact registered constructor分别声明value required/forbidden，selected constructor必须存在且可构造；不得把null统一解释为built-in或用null触发另一constructor fallback | S04/S06/S12 |
| `CFG-RQ-03` | 每个store object完整；`durable`必须non-null binding，`in_memory`必须null | S04/S06 |
| `CFG-RQ-04` | 五个root external object完整；`disabled`必须binding/credential null且capability满足family disabled规则；`fake/controlled/endpoint`必须binding value；credential按mode/provider descriptor required且Fake/Disabled必须null | S04/S06/S10 |
| `CFG-RQ-05` | 四个retry object及其backoff四叶完整出现；只有`max_additional_attempts`可用DECL 0 | S04 |
| `CFG-RQ-06` | root schema/source sets non-empty；enabled operation sets/catalog可以explicit empty但无implicit all；每个catalog entry的所有child required | S04/S05 |
| `CFG-RQ-07` | enabled inbound Consumer exactly one binding；enabled outbound-producing flow的每个可能event exactly one target；enabled Job必须有required store/capability，schedule可缺省为空 | S05/S13 |
| `CFG-RQ-08` | selected R/S-L locator仅在其mode/surface需要时解析；required selected locator失败不能以Disabled/Fake/null/低层值替代 | S10 |

### 8.7 Cross-field、profile 与 redline rule matrix

#### 8.7.1 Numeric、window 与 structural rules

| Rule ID | Exact predicate | Failure |
|---|---|---|
| `CFG-X01` | Step07 §8.8所有numeric leaf分别满足inclusive hard range；这些range不是SLO/容量/ready阈值 | `InvalidConfiguration` |
| `CFG-X02` | `boundary.default_page_limit <= boundary.max_page_limit` | 同上 |
| `CFG-X03` | `reserved_reconciliation_age_ms < command_reservation_ms`, `< consumer_dedup_ms`, `< job_reservation_ms` | 同上 |
| `CFG-X04` | `job_reservation_ms >= execution.job_timeout_ms`; `external_intent_ms >= job_reservation_ms` | 同上 |
| `CFG-X05` | `projection.max_relation_closure_items >= max_source_items_per_capture` | 同上 |
| `CFG-X06` | `claim_lease.heartbeat_interval_ms < lease_duration_ms` | 同上 |
| `CFG-X07` | 每个retry的`maximum_delay_ms >= initial_delay_ms`; attempts=0时backoff仍须合法但不执行 | 同上 |
| `CFG-X08` | root resolver timeout在100..60000；publisher及catalog effect timeout在100..300000，且会进入Job effect的timeout `< execution.job_timeout_ms` | 同上 |
| `CFG-X09` | `digest.write_profile`属于`readable_profiles`；P0只支持v1，且不得移除仍被historical material引用的read profile | `InvalidConfiguration`; historical unknown在resume为manual consistency failure |
| `CFG-X10` | root accepted schema set、每个Consumer schema set均为binary-supported non-empty subset；P0 exact `[v1]` | `InvalidConfiguration` / final `EntryBindingIncomplete` |
| `CFG-X11` | source family allowlist只含9个formal variant且non-empty；每个Consumer producer family等于compile-time 9-row static map | 同上 |
| `CFG-X12` | sets/catalog input无duplicate；outbound event、typed consumer、effect binding、Consumer operation、Job schedule operation各自唯一 | 同上 |

#### 8.7.2 Store、external、entry 与 lifecycle rules

| Rule ID | Exact predicate | Failure |
|---|---|---|
| `CFG-X13` | observation与idempotency-result store支持accepted mutation所需同一atomic UoW、unique/idempotency result；config不能拆成best-effort pair | `StoreCompatibilityMismatch` |
| `CFG-X14` | projection store支持formal version/source fence；Job execution store在enabled Job时支持durable plan/report、CAS claim、monotonic fence与resume | `StoreCompatibilityMismatch` / `RequiredCapabilityMissing` |
| `CFG-X15` | store descriptor schema revision exact等于`required_schema_revision=1`; loader/runtime不得自动migration | `StoreCompatibilityMismatch` |
| `CFG-X16` | resolver capability array exact empty；event publisher exact Publication；handoff exact preparation+delivery；export exact preparation+delivery；stable token/probe声明与descriptor一致 | `RequiredCapabilityMissing` |
| `CFG-X17` | enabled outbound event exactly one typed target；report/export consumer各自unique；application catalog subject/family/phase total；missing route不能延迟到first accepted write | `EntryBindingIncomplete` |
| `CFG-X18` | inbound Consumer operation unique、producer static-map一致、schema是root subset、transport/actor policy可解析；unlisted operation不register、不consume、不ack | `EntryBindingIncomplete` |
| `CFG-X19` | enabled command/query/job均能映射formal static handler/service；schedule operation必须在enabled jobs中；无schedule不影响operator invocation | `EntryBindingIncomplete` |
| `CFG-X20` | accepted Job只冻结relevant execution/projection/external bindings；snapshot entry无duplicate并与safe catalog相同；resume只用stored snapshot | startup candidate阶段确保factory total；runtime invariant failure不得读current config |
| `CFG-X21` | old outbox/intent/preparation携带的effect binding必须解析到原destination/token namespace；new current catalog不能reroute old work | assembly/history compatibility或manual unavailable；不外呼 |
| `CFG-X22` | no reload/hot/watch/in-place swap；每次candidate只能产生new complete immutable assembly | unsupported input=`InvalidConfiguration`; lifecycle交Step10 |

#### 8.7.3 Profile matrix

| Rule ID | Runtime class | Required store / technical | Allowed external mode | Reject |
|---|---|---|---|---|
| `CFG-P01` | `local_test` | store可`in_memory`或`durable`; clock可`system/fixed`; ID可`runtime/deterministic` | `fake/controlled/disabled`; Endpoint禁止 | Endpoint；Fake携带credential；任何conformance redline bypass |
| `CFG-P02` | `integration_like` | 所有required store `durable`; clock `system`; ID `runtime` | `controlled/endpoint/disabled` | InMemory、Fake、Fixed、Deterministic |
| `CFG-P03` | `runtime_like` | 所有required store `durable`; clock `system`; ID `runtime` | `endpoint/disabled` | InMemory、Fake、Controlled、Fixed、Deterministic |
| `CFG-P04` | all | same source/schema/range/VETO；profile不引入default、priority、field或reader | 严格继承P01~P03，不存在lane-specific mode | binary/lane/fixture推profile；failed lane跨profile fallback |

#### 8.7.4 Redline gate

`VAL-S08`逐条执行Step04的`F-CFG-01~24`，实现可将其编译为static “no field/no source/no override” registry。重点包括：truth/state/UoW/no-write/idempotency token/redaction/visibility/correlation/retention guard不能配置化；raw body/secret不得进入ordinary source；remote/admin/CLI/multi-file/include/hot source不存在；config不能生成business/evidence/verdict/signoff，也不能引入non-core sibling compile dependency。任何candidate或实现入口试图表达这些能力都拒绝并触发设计回写，不得仅忽略unknown key继续。

### 8.8 配置项 / 配置组加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `profile` + `technical.*` | process/new assembly；R0/R1/R2 winner | enum/ref/null、RQ02、P01~P04 | technical adapter constructor；root immutable | identity前`InvalidConfiguration`; constructor失败使用exact adapter error |
| `boundary.*` | same；4 scalar可ENV，schema set JSON | integer range、X02、schema X10 | API/worker derived slice；request只可formal收窄 | invalid candidate；runtime request超界pre-parse reject/no-write |
| `safety.*` | same；5 policy ref可ENV，source set JSON | typed ref、non-empty finite set、X11、selected resolver | stage10 policy input；API/worker/application只收safe policy handle/set | invalid或`SensitiveReferenceUnavailable`; no bypass |
| `stores.*` | same；mode/ref/timeout/revision可ENV | RQ03、X13~X15、profile matrix、descriptor capability | qualified repository/UoW constructors；不把root暴露给application | invalid / sensitive / store compatibility exact error；no in-memory fallback |
| `digest.*` | DECL/JSON only | exact v1、X09、historical readable guard | serializer/loader factories；new write profile与old read profile并存 | invalid；不重算old digest、不删除history |
| `idempotency.*` | same；5 duration可ENV | range、X03/X04 | new reservation/intent参数；relevant Job snapshot | invalid；old material不因new duration缩短 |
| `projection.*` | same；6 limit+policy ref可ENV | range、X05、policy resolution | planner/assembler parameters；Job start冻结relevant subset | invalid/sensitive；overflow whole boundary失败，不截断 |
| `execution.claim_lease` | JSON only | range、X06、store claim/fence capability | Job execution constructor/snapshot | invalid/capability fail；不以process lock替代 |
| four retry objects | DECL/JSON only | complete object、X07、formal recovery-class ceiling | family-specific immutable retry policy；Job snapshot | invalid；Unknown/Unsupported等仍禁止blind retry |
| execution scalar budgets | same；3 scalar可ENV | range、X04/X08 | service/entry parameters；accepted Job冻结 | invalid；timeout不证明abort/rollback |
| five root external adapters | same；mode/ref/credential/timeout可ENV，capability JSON | RQ04、X08/X16、P01~P03、private resolution/descriptor | private adapter registry + body-free safe catalog | invalid/sensitive/construction/capability exact error；no mode/target fallback |
| outbound target catalog | JSON only whole replace | strict entry、X12/X16/X17；transport private resolution | infra route registry + safe event binding catalog | invalid/entry/capability error；old outbox仍按stored binding |
| report/export catalogs | JSON only whole replace | typed consumer uniqueness、adapter phases、X12/X16/X17 | exact target private registry + safe catalog；new intents freeze | exact failure；one optional target unavailable不改core truth |
| enabled API surfaces | JSON only | finite enum、duplicate/static handler totality | API slice/static route registration after full build | `EntryBindingIncomplete`; no partial routes |
| inbound Consumer catalog | JSON only | strict object、X10/X11/X18、transport/actor resolution | worker slice/static consumer registration | `EntryBindingIncomplete`; no consume/ack |
| enabled Jobs/schedules | JSON only | finite/unique、X19、store/capability totality | jobs slice/static runner/schedule registration | `EntryBindingIncomplete`; empty schedule仍可operator call |
| outbox loop leaves | same；2 scalar可ENV | range | worker slice；调度参数不改变eligibility | invalid candidate；不截断后宣称complete |

### 8.9 按配置域组织的加载 / 校验 / 生效表

| 配置域 | 配置项 / 配置组 | parse | type validate | cross-field validate | assemble target / expose | 失败策略 |
|---|---|---|---|---|---|---|
| `CFG-D01` source acquisition | registry、JSON、61 ENV | S01~S03 strict capture/parse | exact source allowance | one snapshot、winner no fallback | `infra::config` only；raw不expose | source unavailable/invalid；zero adapter |
| `CFG-D02` config identity | no raw field | canonical typed projection | domain/version/ref derivation | identity覆盖all effective semantics | root config ref；safe telemetry/Job snapshot可引用 | invalid；不得random/path/time ref |
| `CFG-D03` runtime/technical | profile、clock/ID mode/ref | enum/ref/null | RQ02 | P01~P04 | clock/ID constructors；entry不见raw ref | invalid/sensitive/constructor exact error |
| `CFG-D04` protocol boundary | four integers + schema set | width/range/set | X01/X10 | X02、binary schema subset | API/worker slices | invalid；runtime input只收窄 |
| `CFG-D05` entry dispatch/schedule | entry sets/raw bindings/catalog/loop | finite enum/strict object | unique/required | X18/X19 + raw/private/safe/catalog totality | API slice + locator-free worker/jobs slices + prebuilt registrars | `EntryBindingIncomplete`；revoke/join all；no partial root |
| `CFG-D06` redaction/body-free | two policy refs | typed non-empty ref | required/RQ08 | redline/no bypass + resolver | private policy handle -> safety constructors | invalid/sensitive fail closed |
| `CFG-D07` correlation/visibility/labels | source set + three policy refs | finite set/ref | X11/required | static family + policy resolution | mapper/policy handles + safe set | invalid/sensitive；no default truth |
| `CFG-D08` atomic observation/idempotency store | two store objects | mode/ref/null | RQ03/profile | X13/X15 | atomic repositories/UoW -> write façades | store mismatch；no best effort |
| `CFG-D09` projection store | store object | mode/ref/null | RQ03/profile | X14/X15 | projection repositories/read services | exact failure；no false Fresh/inline repair |
| `CFG-D10` Job execution/report store | store object | mode/ref/null | RQ03/profile | enabled Job + X14/X15 | plan/claim/report repositories/jobs service | exact failure；no process-lock fallback |
| `CFG-D11` transaction/schema | timeout/revision | integer/range | X01 | X13~X15 | UoW timeout/schema gate | invalid/store mismatch；no auto migration |
| `CFG-D12` digest | write/read profiles | enum/set | exact v1/unique | X09/history readability | digest factories/snapshot loader | invalid/manual history failure；no recompute |
| `CFG-D13` technical retention | five durations | integer/range | X01 | X03/X04 + active reference guard | reservation/intent stores/new snapshots | invalid；does not authorize cleanup |
| `CFG-D14` projection/freshness | limits + policy ref | integer/ref | X01/required | X05/policy resolution | planners/assembler/Job snapshot | invalid/sensitive/overflow whole fail |
| `CFG-D15` claim/concurrency/budget | lease + scalars | strict object/integer | range/RQ05 where applicable | X04/X06 + store fence | Job services/snapshot/jobs slice | invalid/capability; no hot reread |
| `CFG-D16` retry | four retry objects | strict object/integer | complete/range | X07 + formal recovery taxonomy | family wrappers/Job snapshot | invalid；config不授权blind retry |
| `CFG-D17` safe resolvers | four root adapters | enum/ref/null/integer/list | RQ04/range | X08/X16/P01~P03 | private adapters + safe catalog -> relevant services | sensitive/construction/capability exact error |
| `CFG-D18` publication | publisher + outbound catalog | strict adapter/catalog | unique/required | X16/X17/history X21 | publisher registry + safe catalog -> publication service | exact error；no reroute/false publish |
| `CFG-D19` report handoff | report target catalog | strict typed entries | unique/all children | X08/X16/X17/X21 | target registry + safe catalog -> handoff service | exact target blocked；receipt not signoff |
| `CFG-D20` peripheral export | export target catalog | strict typed entries | unique/all children | X08/X16/X17/X21 | target registry + safe catalog -> export service | target isolation；Delivered not verdict |
| `CFG-D21` sensitive refs | all R/S-L winners | typed locator only | RQ08 | mode/owner/selected requirement | stage5 private resolution；entry只见safe metadata/opaque registrar，never locator/material | sensitive unavailable；zero material output/private getter |
| `CFG-D22` lifecycle/history | no raw field | derived new ref / stored old ref | immutable/presence | X20~X22 | new assembly eligible；old work pinned | new fail/no swap；old missing manual/no call |
| `CFG-D23` environment/view | no independent field | references profile | P01~P04 | same schema/source/rules all lanes | verification/deployment view only | invalid profile combination；no evidence generated |

### 8.10 Formal 13-stage assembly contract

Formal `ObservabilityRuntimeBuilder::build(validated_config)`从stage 5接手；stage 1~4由同属infra composition的config loader/validator完成，stage 13由entry crate完成。下表描述one logical process assembly，不新增第二public builder API，也不允许entry直接调用中间stage。

| Stage | Owner | Exact input | Complete output | Stop / cleanup contract |
|---:|---|---|---|---|
| 1 load raw sources | `infra::config::loader` | compile-time registry、optional source selector、process ENV | coherent R0/R1/R2 snapshots | source failure返回`ConfigSourceUnavailable`;只存在issue ref，无adapter |
| 2 parse/type/range | `infra::config::parser` | captured snapshots | complete typed candidate | S02~S04失败丢弃candidate；不得default-and-continue |
| 3 cross-field/profile/redline | `infra::config::validator` | typed candidate | compatible canonical candidate | X/P/VETO任一失败=`InvalidConfiguration`;无private resolution |
| 4 establish identity | config identity component | compatible candidate | immutable `ValidatedObservabilityConfig` + `ConfigBindingRef` | derivation/compatibility失败丢弃canonical buffer；无material |
| 5 resolve sensitive refs | infra owner-specific resolvers | selected typed R/S-L refs | candidate-scoped private resolution registry | required resolution失败=`SensitiveReferenceUnavailable`;reverse-drop all resolved handles |
| 6 validate stores | store builder/capability gate | store config + private binding + revision | qualified store/UoW constructor descriptors | no schema migration/business row；mismatch exact error，drop descriptors |
| 7 construct base technical adapters | runtime builder | qualified stores、clock/ID refs、digest/policy config | repositories、UoW、clock、ID、digest/policy factories | constructor failure不能暴露handle；reverse-drop stage7 then stage5/6 state |
| 8 construct external + entry technical adapters | family-specific infra builders | root/catalog binding config + private material + raw transport/actor-policy/schedule bindings | concrete adapter registry + immutable descriptors + private entry slots | constructor/capability mismatch exact error；scheduler必须carry complete request；不得fallback mode/target |
| 9 build availability registry | runtime builder | descriptors + safe probes | body-free `AdapterAvailabilityProbe` implementation | probe只能产formal availability；不得用health改config或business truth |
| 10 assemble five façades + context factory | application constructors via runtime builder | Step07 ports、safe policies/parameters/catalog、snapshot factory | five immutable service handles + existing `ObservationOperationContextFactory` | constructor/invariant失败返回one formal assembly error；entry不自行补actor/key/source identity |
| 11 derive safe slices + prebuilt registrars | runtime builder | validated root + service availability + private entry slots | API slice、locator-free worker/jobs slices、two one-assembly registrars | raw/private/safe count/operation/producer/schema不一致=`EntryBindingIncomplete`;不注冎ncallback |
| 12 return built runtime | runtime builder | five façades + context factory + probe + slices + registrars | one `BuiltObservabilityRuntime` | 返回成功只表示wiring ready；registrar尚未证明root active/healthy/delivered/accepted |
| 13 entry-local composition | `api`/`worker`/`jobs` root | assigned façades/context factory + assigned safe slice + assigned registrar | static routes、opaque registered Consumer / schedule sets、one-shot runners | finite catalog -> prepare-all -> totality -> arm-all；失败revoke/join all并留下zero exposed root；不读locator/private registry/repository/adapter/UoW |

Stage 6/8的“probe”只允许读取implementation descriptor或执行formal startup-safe capability/availability检查；不得创建domain row、idempotency reservation、outbox、intent、receipt、report、evidence或验收记录。若某provider只能通过有副作用业务调用证明能力，则它不满足current startup descriptor contract，不能在builder中试调用。

### 8.11 Sensitive resolution plan 与 candidate cleanup

#### 8.11.1 Owner-specific resolution registry

| Resolution family | Selected input | Private resolver/constructor | Result lifetime | Never projected |
|---|---|---|---|---|
| technical binding | clock/ID `AdapterBindingRef` according mode | clock/ID registry | owning technical adapter / assembly | fixed seed、provider body、path、full ref |
| policy binding | five safety refs + freshness + Consumer actor refs | exact policy registry | immutable policy handle held by relevant constructor | policy body、rule dump、full ref |
| store binding | four non-null `StoreBindingRef` | store family resolver | qualified store handle / assembly | DSN、credential、certificate、connection detail |
| root external binding | selected non-disabled `AdapterBindingRef` | exact adapter-family registry | concrete adapter / assembly | endpoint、topic、route、fixture/provider body |
| credential locator | selected conditional `CredentialRef` | adapter-family credential resolver | adapter-private memory only | secret material、version、provider receipt/error |
| outbound transport | each event target `TransportBindingRef` | publisher transport registry | historical-capable private route registry | topic/route/endpoint/full ref |
| inbound transport | each Consumer `TransportBindingRef` | worker transport registry | worker adapter / assembly | queue/topic/subscription/full ref |
| schedule binding | each schedule `ScheduleBindingRef` | scheduler registry | entry-private trigger descriptor | cron/body/provider handle/full ref |

Resolver key必须包含typed owner/family + typed ref，不能把相同raw string跨owner合并。Candidate内可做owner-scoped memoization以避免重复private lookup，但结果不得进入process-global generic cache成为第二source；是否允许跨assembly安全复用由具体provider/adapter ownership和Step10 lifecycle决定，current默认不复用。

#### 8.11.2 Resolution order 与 all-or-error

1. 先按canonical field/subject order生成resolution plan，只含typed owner、family和private ref handle；不得生成可输出的locator list。
2. `Disabled`且binding/credential均null的optional family不调用resolver；Fake要求credential null；Controlled仅在descriptor声明需要时解析nonprod credential；Endpoint按descriptor requiredness解析。
3. 依次解析technical/policy、store、root external、catalog transport/credential、Consumer transport/actor和schedule；顺序只用于deterministic failure/cleanup，不表示后者可覆盖前者。
4. 任一required selected ref失败，立即生成one safe issue ref并映射formal variant；不得继续尝试其他target来寻找fallback，也不得返回已成功解析的partial registry。
5. Failure按reverse acquisition order释放private handle/material；best-effort clear是最低要求，但本文不声称已选zeroize/mlock/provider SDK。
6. 成功后private material仅随具体store/adapter/trigger ownership存活；validated root、safe catalog、service constructor参数、entry slice和Job snapshot都无回指private registry的类型入口。

`SensitiveReferenceUnavailable`只用于typed locator已通过但required private material不可取得。Malformed ref/null/mode combination仍是`InvalidConfiguration`；adapter material已取得但constructor失败是`AdapterConstructionFailed`；descriptor缺能力是`RequiredCapabilityMissing`。不得把三者压成一个“secret error”。

### 8.12 Store 与 external descriptor gate

#### 8.12.1 Store qualification

| Store group | Required descriptor proof | Reject / forbidden substitute |
|---|---|---|
| observation + idempotency/result | schema revision 1、same accepted UoW、unique reservation/result、rollback invisibility、version/CAS | separate best-effort writes、process mutex、retry掩盖atomic gap |
| projection/source index | schema revision 1、version/source fence、bounded read/write contract | Query inline repair、truncate-and-Fresh、source truth write |
| Job execution/report | durable plan/snapshot/report、CAS claim、monotonic fence、terminal replay | process lock、memory-only claim、current-config resume |
| UoW/digest loaders | transaction outcome classification、readable digest v1、no auto migration | timeout=rollback proof、unknown digest recompute、startup migration |

`LocalTest + InMemory`仍须通过相同logical descriptor/conformance；只有durability/restart性质按profile不同。`IntegrationLike`/`RuntimeLike`不能以InMemory通过gate。Qualification产生constructor/descriptor，不执行业务transaction，也不以“连接成功”证明schema/atomicity。

#### 8.12.2 Adapter requirement class

| Requirement class | Family | Complete assembly decision |
|---|---|---|
| startup-required | atomic observation/idempotency group、UoW、clock、ID、digest、safety | missing/incompatible直接失败，五façade均不暴露 |
| enabled-job-required | projection + Job execution/report store | 任一依赖该能力的Job enabled时必须qualified，否则jobs slice不返回并使whole candidate失败 |
| operation-required | four resolver families | explicit Disabled可形成formal Unavailable only when no startup totality requires it；service仍完整并返回typed unavailable |
| propagation-required | event publisher | durable outbox/write façade可完整组装；publisher Disabled/Unavailable必须在availability和worker registration中显式，不得丢outbox或success no-op |
| explicit peripheral | report handoff / peripheral export target | target可explicit Disabled或array empty；请求exact target时blocked/unavailable，其他core/target不受污染 |

Adapter descriptor必须证明family、mode、effect phase、stable-token和probe capability与candidate一致。Health `Available`不补足缺失capability；`ProbeCapability::Unsupported`也不等于negative outcome。配置overclaim、family/phase错配或Enabled surface缺totality在expose前失败。

### 8.13 Safe projection 与 five-façade assembly

#### 8.13.1 Projection ownership

| Projection | Included | Excluded | Owner / consumer |
|---|---|---|---|
| validated root | typed refs + executable parameters + config ref | resolved material/provider result | infra config/runtime builder only |
| private adapter registry | concrete handle + route/credential/material + descriptor | application/public DTO exposure | infra runtime ownership only |
| `ExternalEffectBindingCatalog` | typed subject、family、`ExternalEffectBindingRef`、timeout、finite capabilities | adapter/transport/credential ref、endpoint/route/material、health | application services/snapshot factory |
| availability probe | finite family/mode/state + safe issue ref | provider body、endpoint、config dump；health不等于success | façades/entries for preflight/status only |
| entry slices | API enabled operations/bounds；worker Consumer operation/producer/schema；jobs enabled/scheduled operation；bounded loop/timeout values | transport/policy/schedule locator、root config、target catalog、private registry、repository/UoW | one assigned composition root |
| prebuilt registrars | same-assembly finite safe metadata + all-or-nothing `register_all` capability | locator/material/private registry getter、`Any`/downcast、generic lookup/invoke、repository/UoW | worker/jobs composition root；success后只持有opaque registered set |
| Job snapshot | config ref、operation、relevant bounds/lease/retry/safe effect binding | locator/material/current availability/unrelated fields | application start UoW + durable plan loader |

Safe catalog derivation以validated typed catalog与private descriptor totality为输入，但输出对象不能持有private registry pointer、closure、downcast handle或provider-specific extension。`effect_binding_ref`是application与infra的唯一join identity；外呼前infra按stored ref解析exact historical adapter，application不能反查route。Registrar是infra-owned least-authority technical capability，它可以在private implementation中持有pre-resolved slots，但公开面只允许读finite safe metadata并提交exact catalog，不是application port或service locator。

#### 8.13.2 Five service handles

| Façade | Receives at construction | Does not receive | Snapshot responsibility |
|---|---|---|---|
| `ObservationTruthWriteService` | repositories/UoW、clock/ID/digest、safety policies、safe catalog、execution parameters | validated root、transport/credential ref、concrete external adapter | accepted write在same UoW冻结outbound `effect_binding_ref` |
| `ObservationReadService` | read repositories、visibility/freshness policies、query bounds/timeout、availability | write UoW、target locator、inline repair authority | no Job snapshot；Query始终no-write |
| `ObservationInboundEventService` | truth write orchestration、Consumer static mapping、schema/source/actor policies | inbound transport handle、entry loop、raw envelope source config | accepted Consumer沿write flow冻结outbound binding |
| `ObservationMaintenanceService` | plan/claim/report stores、projection/resolver ports、execution/projection parameters、safe catalog + snapshot factory | schedule provider、current config reader、private target registry | Job start UoW构造并durable保存relevant `JobExecutionConfigSnapshot` |
| `ObservationPublicationService` | outbox/intent stores、publisher port、safe catalog、publication retry | worker loop、raw route/credential、current target fallback | publish只读outbox stored binding/snapshot；不改写old row |

Constructors只建立immutable handle和dependency graph，不执行Command/Query/Consumer/Job、不创建business ID/state/result。`BuiltObservabilityRuntime`还返回existing context factory供三entry共用，它不是第六个business façade。若任一service/entry constructor需要整个`ValidatedObservabilityConfig`、raw locator、private registry或concrete adapter downcast，视为ownership violation并在implementation前回写`03`，不能由Step09默许。

### 8.14 Entry slice derivation 与 registration

| Root | Slice exact content | Assigned façades | Registration gate | Forbidden action |
|---|---|---|---|---|
| API | enabled commands/queries、body/page/query timeout bounds | truth-write + read + availability + context factory | every enabled enum has exact static route/service；limits已validated | read env/file、construct adapter、access repo/UoW、target catalog |
| worker | `ValidatedInboundConsumerRegistration`(operation/producer/schema)、outbox cadence/candidate limit | inbound-event + publication + availability + context factory + inbound registrar | raw/private/safe/9-slot catalog exact；group register success后持有opaque set | transport/policy locator、private lookup、direct repo+publisher pair、partial active loop |
| jobs | enabled Job operations、`ValidatedJobScheduleRegistration`(operation only)、job timeout | maintenance + publication + availability + context factory + schedule registrar | scheduler可carry complete request；safe/private/9-slot catalog exact；group success后持有opaque set | schedule locator、补造actor/key/scope/target/cursor/input、build snapshot、resume读current config、造run/evidence ID |

Stage 11只derive immutable safe slice并构造one-assembly registrar，stage 13才由entry提交finite catalog执行group registration。Registrar必须prepare-all -> totality -> arm-all，返回`Ok`前不dispatch event/Job；任一prepare/arm失败必须revoke/join本次全部item并返回`EntryBindingIncomplete`。任何root registration失败都必须使本次process/new-root composition失败，不能先开放其他route再报告warning；多binary部署中只构造某一entry时，仍使用同一validated root和builder semantics，但该binary不得将未拥有的slice/registrar/handle暴露为admin/debug入口。

#### 8.14.1 `CFG-BLK-09-01` R2 closure record

原definition/use审计发现raw Consumer/schedule binding直接进入entry slice，与Step08 no-locator/no-material边界冲突。用户授权采用entry-safe prebuilt registration seam后，已定向回写DDD Step05/07/14/17/19、formal `03` §5/§6/§13/§15/§16并回灌Step08。原冲突不再作为current contract，但historical finding保留在本记录中。

| Closure link | Current exact contract | Stop assertion |
|---|---|---|
| raw config | `InboundConsumerBindingConfig` / `JobScheduleBindingConfig`只在`infra::config` validated root和builder内部，分别含transport/actor-policy与schedule locator | raw type、locator或material进入worker/jobs public constructor -> blocker |
| safe worker slice | `ValidatedInboundConsumerRegistration { operation, producer_family, accepted_schema_versions }` | operation/producer/schema不与9项static map或private slot exact -> `EntryBindingIncomplete` |
| safe jobs slice | `ValidatedJobScheduleRegistration { operation }`；scheduler private slot已证明能carry complete existing request | 从config/descriptor/default补造actor/key/scope/target/cursor/input/run/evidence -> blocker |
| runtime handoff | `BuiltObservabilityRuntime`包含existing context factory + two `Arc<dyn ...Registrar>`；registrar与safe metadata/private slots属于one assembly | registrar暴露lookup/material/private registry/concrete adapter或允许downcast -> blocker |
| finite callback | infra定义9-slot Consumer/Job handler catalog shape，worker/jobs只实现exact handler并构造catalog | free-text map/default/unknown handler或enabled/disabled/body/producer/schema mismatch -> blocker |
| registration transaction | prepare-all -> totality -> arm-all；失败revoke/join all，返回existing `EntryBindingIncomplete`；success后entry只持有opaque set | callback before success、partial active root/handle、new startup variant -> blocker |
| invocation carrier | Consumer只收bounded move-only frame + safe actor/finite metadata；Job只收nine existing complete request variants | provider envelope/ack token/topic/private cause进worker，或伪造response/report/business identity -> blocker |

Registrar是infra-owned least-authority technical capability，不是application business port、public protocol或generic service locator。Opaque registered set只维持process-local callback ownership，不是durable state、health proof、business result、真实run/evidence identity或acceptance结论。R2没有改变60 protocol、27 formal state、UoW/idempotency/persistence schema、13 assembly stages或seven startup error variants，也没有声称代码、registration、test或runtime已存在。

### 8.15 Activation boundary 与 historical snapshot

| Situation | Step09 decision | Deferred authority |
|---|---|---|
| first process assembly succeeds | complete runtime is eligible for new work after entry registration | process startup orchestration publishes handle |
| replacement candidate succeeds | produces a separate immutable eligible runtime;does not mutate/swap old adapters | Step10 defines approval/activate/drain/rollback sequence |
| replacement candidate fails | returns one error;candidate resources cleaned;old runtime untouched | Step10 decides operator record/action；不得称自动rollback成功 |
| accepted synchronous request on old root | may drain under old immutable handles | Step10 drain deadline/admission policy |
| accepted Job/outbox/intent/preparation | always uses durable config snapshot/effect binding/token | historical registry retention/retirement in Step10/`07` |
| old binding unavailable | stop before external call;retain old material and classify unavailable/manual | operations restoration/manual authority later |
| credential-only private material rotates | config ref may remain if locator/effective semantics unchanged;binding ref only underStep08 strict destination/token conditions | Step10 change classification and overlap proof |

“生效”在本Step只到**complete runtime eligible for new work**。Builder不关闭old admission、不切global pointer、不drain、不retire、不选择previous approved candidate，也不写config-change audit。Activation前后都不得重写domain state、reservation、outbox payload、plan、snapshot、intent、receipt或report。

### 8.16 加载校验停审记录

| 配置域 | Required / parse / type | Cross-field / profile / redline | Failure / no-output | Assemble / expose / `03` impact | 结论 |
|---|---|---|---|---|---|
| D01 source | registry、source capture、strict JSON/61 ENV exact | coherent snapshot、winner no fallback、unsupported source拒绝 | source/invalid exact error；无path/key/value | only `infra::config`;existing owner | pass |
| D02 identity | intentionally no raw field；typed whole candidate | domain/version/canonical order；source/material排除 | invalid；无digest/fingerprint输出 | root/snapshot safe ref；existing type/stage | pass |
| D03 technical | profile/mode/ref/null complete | RQ02 + P01~P04 | invalid/sensitive/constructor分层 | clock/ID handles；entry不见ref；no writeback | pass |
| D04 boundary | numeric width/range + schema set | X02/X10；request只收窄 | invalid；runtime reject no-write | API/worker slice；existing wrappers | pass |
| D05 entry | all sets/raw bindings/catalog/loop fields explicit | X18/X19 + route/service + raw/private/safe/catalog totality | invalid before identity/final `EntryBindingIncomplete`；revoke/join all；no partial root | locator-free worker/jobs metadata + two prebuilt registrars + opaque handles；formal R2 exact | pass |
| D06 redaction | two required typed policy refs | no Disabled/test bypass/body escape | invalid/sensitive fail closed | private policy handles；existing safety constructors | pass |
| D07 correlation/visibility | source set + three required refs | X11 + static mapping/policy resolution | no default truth/full ref output | safe mapper/set only；existing contracts | pass |
| D08 atomic stores | two complete mode/ref objects | profile + X13/X15 | store mismatch；no best effort/in-memory fallback | atomic repositories/UoW；existing ports | pass |
| D09 projection store | complete mode/ref | profile + X14/X15 | exact startup failure；no false Fresh | projection repository/read service；no writeback | pass |
| D10 Job store | complete mode/ref | enabled Job + durable claim/fence/report | exact failure；no process lock/current resume | Job repositories/service；existing snapshot | pass |
| D11 transaction/schema | timeout/revision required/ranged | X13~X15 | invalid/store mismatch；no migration | UoW/schema gate；existing stage | pass |
| D12 digest | DECL/JSON exact v1/[v1] | X09 + retained readability | invalid/manual history；no recompute | digest factories/loaders；existing type | pass |
| D13 retention | five required ranged durations | X03/X04 + active reference guard | invalid；no cleanup authority | new reservations/intents only；existing stores | pass |
| D14 projection/freshness | six limits + required policy ref | X05 + policy resolution | invalid/sensitive/whole overflow fail | planner/assembler/Job snapshot；existing fields | pass |
| D15 claim/budget | lease/scalars complete and ranged | X04/X06 + store capability | invalid/capability；no hot reread | Job service/snapshot/jobs slice；existing fields | pass |
| D16 retry | four complete objects | X07 + recovery taxonomy ceiling | invalid；no blind retry/provider override | four wrappers/relevant snapshot；existing types | pass |
| D17 resolvers | four strict root adapter objects | RQ04/X08/X16/P matrix | sensitive/construction/capability exact；no fallback | private adapters + safe catalog；existing ports | pass |
| D18 publication | publisher + whole outbound catalog | capability/12-event totality/history | exact error；no reroute/fake publish | publisher registry/catalog/service；existing binding types | pass |
| D19 handoff | whole typed target catalog | phase/consumer uniqueness/history | exact target unavailable；receipt not signoff | private registry + safe catalog/service；existing types | pass |
| D20 export | whole typed target catalog | phase/consumer uniqueness/history | target isolation；Delivered not verdict | private registry + safe catalog/service；existing types | pass |
| D21 sensitive | all selected R/S-L typed;material no raw source | mode/owner/selected resolution after identity | sensitive exact error；reverse cleanup；zero material output | raw locator infra-only；safe slice/registrar无locator/material/private getter；Step08 R2 pass | pass |
| D22 lifecycle | no activation raw field；new/stored refs only | immutable snapshot、no hot、old/current no merge | failed candidate no swap claim；old missing no call | eligible new runtime/history pin；Step10 handoff,no `03` change | pass |
| D23 environment | no lane field；explicit profile only | same loader/schema/source + P01~P04 | invalid combination；no cross-lane fallback/evidence | deployment/test view only；no enum/source/result | pass |

23域均已审查并pass。D05/D21的R2闭合依据是§8.14.1与formal `03` exact contract，不是将locator改名后暴露给entry。Formal §9仍只能在Step15从current Step01~14装配，本Step pass不允许提前修改正式`04`。

### 8.17 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Ordinary source是否唯一 | pass | only DECL < zero-or-one strict JSON < 61 exact ENV；无第二reader |
| JSON/ENV是否各自coherent | pass | whole bytes + exact occurrence map后才parse/merge；禁止热重读 |
| Parser是否有确定安全边界 | pass | 1 MiB/depth 8为compile-time loader ceiling；不是SLO/容量/验收值 |
| 每个ENV入口是否来自Step07 | pass | 61项机械展开；set/catalog/claim/retry/capability无ENV入口 |
| Unknown/duplicate/alias是否fail | pass | JSON exact object与项目namespace unknown ENV均reject；无ignore/last-wins |
| Winner非法是否fallback | no | high-priority invalid rejects whole candidate |
| Required是否被baseline/Rust default补齐 | no | 仅digest、parallelism、四retry attempts有DECL default |
| Primitive/range/canonical collection是否完整 | pass | S03~S05；duplicate不silent dedup，array input order不影响identity |
| Cross-field是否覆盖numeric/window/store/target/profile | pass | X01~X22 + P01~P04 + RQ01~RQ08 |
| Forbidden config/VETO是否在assembly前执行 | pass | S08 before identity/material/adapter；无debug/emergency bypass |
| Config identity是否代表effective ENV winner | pass | whole typed candidate；source/path/order/material均排除 |
| Locator进入identity是否造成hash escape | no | 只影响opaque whole-candidate ref；无locator/per-field fingerprint/canonical bytes输出 |
| Sensitive material是否在identity后解析 | pass | owner-specific S10；provider result不回填candidate或改变source priority |
| Store capability是否在façade前证明 | pass | S11/X13~X15；无migration/process lock/best effort替代 |
| Adapter capability是否相信config自述 | no | config与immutable implementation descriptor比较；health不补能力 |
| Safe catalog/slice/snapshot是否剔除private material | pass | raw binding infra-only；worker/jobs只获得locator-free metadata + prebuilt registrar；registrar无locator/material/private getter/downcast |
| Builder是否complete-or-error | pass | 13 stages；reverse cleanup；zero façade exposure on candidate failure |
| Startup probe是否产生业务副作用 | no | descriptor/read-only safe probe only；无payload/row/reservation/receipt |
| Reload/hot是否有半套rollback | no | surface unsupported；只构建separate cold assembly，actual lifecycle交Step10 |
| Accepted Job/effect是否热读current config | no | start UoW冻结snapshot；resume/外呼使用stored config/binding |
| Old/new source是否错误merge | no | `SRC-HISTORY`仅解释old work，不参与R0/R1/R2 |
| Formal error是否被扩展/压平 | no | exact七variant；内部stage/rule ID不形成public issue enum |
| Diagnostic是否泄露raw source/material | no | formal telemetry allowlist only；无path/env/full ref/provider body/hash surrogate |
| Runtime assembly是否被当业务/验收truth | no | assembled仅wiring ready；无run/evidence/verdict/signoff |
| Runtime builder/adapter是否有待回写`03`缺口 | no | formal `03` R2已同步exact safe slices/context factory/registrars/finite catalogs/tests/handoff；未改变business contract |

### 8.18 Requirement VETO 映射

| Requirement VETO | Step09 gate | 结论 |
|---|---|---|
| `VF-OBS-001` core closure missing | required/totality/store/capability失败阻断complete runtime；no partial façade | covered |
| `VF-OBS-002` raw secret/payload/runtime body enters | strict source + stage5 private resolution + safe projection/no-output | covered |
| `VF-OBS-003` external evidence/artifact/identity/governance body stored | ref-only parser；provider/policy body无root/snapshot/store/output入口 | covered |
| `VF-OBS-004` observation/handoff/export becomes external truth | health/receipt/assembled均non-authority；catalog只wiring metadata | covered |
| `VF-OBS-005` Query/maintenance/rebuild/export rewrites source truth | entry slice/façade/no-write边界；builder无business mutation | covered |
| `VF-OBS-006` fake run/evidence/verdict/signoff | config/issue/binding ref均非run/evidence；本文无执行结果 | covered |
| `VF-OBS-007` retention deletes active material | new duration不改old snapshot；historical binding不可current fallback/retire | covered |
| `VF-OBS-008` non-core sibling compile dependency | loader/binding只做runtime infra composition；不生成Cargo edge | covered |
| `VF-OBS-009` named product becomes truth/prerequisite | product-neutral locator/descriptor；具体产品仍`not_selected` | covered |
| `VF-OBS-010` historical material promoted | old Step09/L1只作诊断/粒度参考；current source独立重建 | covered |

任何profile、provider、test、debug、emergency、optional target或old assembly存在都不能放宽上述VETO。VETO失败不允许以warning返回runtime。

## 9. 对详细设计的影响判定

### 9.1 Current conclusion

| Step09 conclusion | 是否改变code contract | Current `03` basis | Action |
|---|---|---|---|
| one strict JSON + exact ENV registry/raw key | no | formal §5.4让raw reader/format归`infra::config`并明确由`04`固定 | no writeback |
| coherent snapshot、1 MiB/depth 8、strict parse | no | existing loader/parser responsibility；内部safety/parser contract未新增public API | no writeback；`05/07`需承接test/implementation |
| winner、required、cross/profile/redline顺序 | no | formal §13 validation boundary + existing typed root | no writeback |
| whole-candidate `ConfigBindingRef` canonical semantics | no | existing body-free type、stage4、Job snapshot/error fields | no writeback；algorithm在`04`闭合 |
| bootstrap issue-ref generator | no | existing startup-only `RuntimeAssemblyIssueRef`;只是infra-private creation约束 | no public factory/trait |
| identity后owner-specific resolution/cleanup | no | existing stage5、private memory、exact errors | no writeback；provider implementation仍open |
| store/adapter descriptor gates | no | existing stages6/8、capability matrix/error variants | no writeback |
| safe catalog、five façades、context factory、three entry slices + two registrars | yes, targeted R2 consumed | formal §5/§13已将raw binding保持infra-only，定义locator-free metadata、finite catalogs、prebuilt registrars、opaque handles和group atomicity | `CFG-BLK-09-01` resolved；保持Step08 strong isolation并在§15/§16补齐test/file/pause handoff |
| new complete assembly eligible only | no | formal activation says immutable/new assembly；switch/drain后置`04` | no writeback |
| accepted Job/history pinning | no | existing `JobExecutionConfigSnapshot`/effect binding contract | no writeback |

Step09 R2只要求新增infra-entry technical composition types，没有新增public business struct/enum/field/trait/port、business state/store、protocol DTO、builder stage或error variant。Registrar不是application business port，registration不创建UoW/reservation/state/row/outbox/Job identity。Current上游blocker=`none`；implementation readiness仍因formal `04~07`、target repo和真实tests/evidence未完成而`blocked`。

### 9.2 Future impact triggers

| Future request / discovery | Required return point | Block-until behavior |
|---|---|---|
| public `ConfigLoader/Validator/Source` trait、remote/config-center/admin/CLI source或multi-file/include | DDD Step04/05/07/12/14/17/19 + formal §4/§5/§11/§13 | no source/key/priority implementation before confirmed writeback |
| reload/watch/hot/in-place adapter swap或partial root activation | DDD Step09/11~14/17 + formal §8/§10~§13 | current remains cold complete assembly only |
| new startup error/validation issue public carrier或error附field/path/cause | DDD Step06/12/14/15/17 + formal §6/§11/§13/§14 | use existing seven variants/safe telemetry only |
| application/entry需要root config、locator、private registry或concrete adapter | DDD Step05/07/09/14/17 + formal §5/§8/§13 | prohibited；current R2 registrar只是finite least-authority capability，未来若扩权必须重开design blocker |
| durable config revision/change audit/historical registry新增local schema/repository | DDD Step06/07/09/11/14/15/17/19 + formal §5~§14 | Step10/`07` must identify owner and write back before implementation |
| identity domain/algorithm migration、config alias或dual schema | DDD Step11/13/14/17 + formal §10/§12/§13;then `04` Step13 | no silent ref change/reinterpretation |
| provider-specific root field/public provider port或non-core compile dependency | formal `01` + DDD Step03~07/12/14/17 | product-neutral current contract remains；no dependency shortcut |
| entry-specific root override、Job override或resume current-config read | DDD Step08/09/13/14/17 + formal §7/§8/§12/§13 | hard reject；snapshot semantics cannot be patched locally |

## 10. 正式 `04` §9 回填草稿

Formal `04-配置设计.md`只能在Step15装配。R2后以下§9草稿已通过D05/D21重审，可作为未来Step15装配输入；本Step仍不修改正式`04`，也不把calibration问题回答、旧材料诊断或停审表复制进正式正文：

````md
## 9. 配置加载、校验与生效机制

> 校准来源:
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Source capture 与 parser safety ceiling”“Exact ENV registry”“Validation rule matrix”“23域加载表”“Formal 13-stage assembly”“Safe projection”“Activation boundary”和“跨加载校验审计”。

### 9.1 加载流程与source snapshot

配置仅在process启动或准备new complete assembly时加载。`observability-infra::config`是唯一ordinary source reader：code declaration < zero-or-one strict JSON < 61项exact allowlisted ENV。JSON与ENV先各自形成immutable snapshot，再按canonical field选择winner；高优先级winner非法时拒绝candidate，不回退。Runtime不支持JSONC、multi-file、include、overlay、remote/admin/CLI field override、reload、hot或watch。

### 9.2 Parse、type、required与identity

Loader按strict structure -> winner decode -> type/range -> required/canonical set/catalog -> cross-field -> profile -> redline顺序校验。只有digest v1/[v1]、max_parallelism=1和四类retry additional attempts=0具有declaration default。Compatible whole typed candidate派生body-free `ConfigBindingRef`;source/path/env name/order和resolved material不参与identity，opaque locator的effective semantics变化会改变whole-candidate revision。Canonical bytes、per-field digest和locator fingerprint不得输出。

### 9.3 加载与校验表

正式正文回填本Step §8.8配置组表与§8.9的`CFG-D01~D23`表。每域必须保留parse、type、cross-field、assemble/expose与exact failure，不得压缩为“启动时校验”。

### 9.4 Runtime assembly 与exposure

Identity之后才由infra-private owner解析selected sensitive locator。Store schema/atomicity/CAS/fence与adapter family/phase/token/probe descriptor均在façade exposure前验证。13-stage assembly只返回one complete `BuiltObservabilityRuntime`或one formal startup error；成功对象包含five application façades、existing context factory、body-free availability probe、API slice、locator-free worker/jobs slices和two prebuilt registrars。Worker/jobs提交exact 9-slot catalog，registrar执行prepare-all -> totality -> arm-all；失败revoke/join all并留下zero exposed root。Application/entry不接收validated root、locator/material、private registry、repository、adapter或UoW。

### 9.5 生效与历史绑定

Builder成功只表示new immutable runtime eligible for new work，不自动activate、swap、drain、retire或rollback。Accepted Job在start UoW冻结relevant `JobExecutionConfigSnapshot`;old Job/outbox/intent/preparation只解析stored config/effect binding，缺失时停止外呼并保持manual/unavailable，不回退current route。实际审批、切换、drain、审计与回滚由后续变更流程定义，且不得重写business truth或durable historical work。
````

Formal §9必须保留61 ENV计数、exact seven-error边界、23域表和“assembled is not healthy/delivered/accepted/evidence”结论；不得加入真实path、env value、locator、provider、run、test result或activation成功声明。

## 11. Downstream handoff 与 open material

### 11.1 Step10 handoff

| Input fixed by Step09 | Next step must still define | Prohibited assumption |
|---|---|---|
| candidate/new assembly immutable且complete-or-error | change authority、review/approval、prepare/activate/drain/retire/rollback ordering | builder success自动切换或failed candidate自动LKG success |
| config identity覆盖effective semantics | safe change identity/metadata、previous-approved eligibility | raw diff/locator hash可直接audit |
| old work pinned tostored snapshot/binding | historical registry lookup、overlap/reference scan、retirement authority | restart/current route自动解释old work |
| candidate failure leaves old runtime untouched | operator-visible result、old admission/drain policy | “old仍运行”等于rollback已执行/已审计 |
| no config-change durable owner introduced | decide whetherexisting host audit suffices or `03` writeback is required | invent generic business audit row |

### 11.2 Step11 / Step12 / formal `05~07` handoff

| Downstream | Required input | Must not claim |
|---|---|---|
| Step11 failure/degradation | S01~S13、seven exact errors、optional Disabled vs Unavailable、old missing、candidate failure/cleanup | all startup failures are invalid config；health fallback changes source |
| Step12 config handoff | 61 ENV registry、RQ/X/P rules、23-domain table、13 stages、no-output、open implementation material | provider/store/env/deployment/tests already exist |
| current `05` | parser/merge/property cuts、61 key allowlist、invalid-winner、identity stability/change、all rules、failure cleanup、projection isolation、history no-current-read + seven entry-registration planned cuts | real case IDs/runs/results/evidence from this design Step |
| current `06` | VETO for partial root、raw/full-ref/hash escape、profile fallback、truth write、reroute、fake evidence | acceptance passed/verdict/signoff |
| current `07` | module/file boundaries for loader/parser/validator/identity/builder/private registry/registrars/worker/jobs catalogs、provider/store/transport/scheduler descriptor reality check、all planned tests | implementation commit,selected product,CI/staging/prod readiness |
| deployment/operations | one-source selector、exact ENV injection、provider bootstrap identity/permissions、historical overlap/drain/retire/runbook | parser semantics or source priority may be redefined operationally |

### 11.3 Open material and blocker classification

| Open material | Status | Design impact | Required closure |
|---|---|---|---|
| `CFG-BLK-09-01` entry-safe registration seam | `resolved_by_R2` | no current blocker；D05/D21/formal §9 draft已重审 | DDD Step05/07/14/17/19 + formal `03` §5/§6/§13/§15/§16 + Step08/09已同步；implementation仍须`05~07` reality gate |
| concrete store/secret/transport/scheduler/provider products/APIs | `not_selected` | no Step09 blocker；blocks affected Durable/Endpoint implementation/integration | ADR/`07` before implementation boundary |
| deployment JSON selector/path/mount and 61 ENV actual values | `not_established` | no semantic blocker；cannot claim environment ready | deployment material before bring-up |
| provider bootstrap identity/permission/network | `not_established` | no semantic blocker；blocks real selected material resolution | `07` + operations |
| historical config/effect-binding registry physical storage/retention | `not_selected` | semantic pinning closed；blocks recovery readiness | Step10 decision + `03` writeback if new store/API + `07` |
| body-free config identity implementation mechanism/collision tests | `not_implemented/not_run` | semantic algorithm closed；blocks implementation completion | `07` boundary + current `05` planned tests |
| target repository/toolchain/CI/fixtures | `not_established` | design can continue；implementation readiness blocked | current `07` reality check |
| staging/production instances、credentials、topology、capacity | `not_established/not_evaluated` | RuntimeLike contract still applies；no readiness/evidence claim | deployment/operations and real execution |

Current upstream blocker is `none`。Implementation readiness remains `blocked` until formal `04~07`、target repo、provider/store/adapter reality、planned tests and real evidence producers exist。`resolved_by_R2`不表示代码、registration、test或environment已存在。

## 12. Current M3 affected validation and exposure register

| Affected ID | Validation / assembly stage | Exposure stop rule | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | stage2/3 schema owner与binary-supported set校验 | owner缺失时I05 raw binding不得投影safe registration | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | stage3/8 exact producer/binding/descriptor totality | mismatch/missing在callback和UoW前`EntryBindingIncomplete` | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | stage10 façade组装不得生成H13 positive capability | J06只暴露Blocked/manual-safe path | open_controlled |
| `R06-F-AFFECT-UOW-01` | stage6验证atomic UoW/CAS，stage10不改变save order | capability不足zero runtime exposure | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | stage3只验证policy shape，不能定义branch class | unmapped recovery branch fail closed | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | stage8 descriptor与phase exact，accepted时冻结binding | link/capability不完整不暴露callable target | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | stage8/10验证probe capability与frozen policy | 无same-token/accounting则additional attempt不可激活 | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | stage10/11只装配已有same-UoW façade/safe handler | 缺outbox surface时对应registration totality失败 | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | stage11只投影typed action mapper依赖 | commit-unknown未闭口时不暴露ack-success path | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | stage6/10验证report durability与owner-backed service | owner缺失时Job completion surface不激活 | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | stage2/3 finite decode与owner registry | alias/private duplicate在runtime exposure前拒绝 | inherited_affected |
| `03-RPR-S09-PER-FLOW` | stage10~13只能装配exact typed handlers/catalog | complete runtime不等于60 flow均已实现审计 | inherited_affected |

Final M3 confirms 13 stages remain ordered and complete-or-error:coherent source -> parse/type/range -> cross-field/profile/redline
-> body-free identity -> sensitive resolution -> store capability -> technical adapters -> external/entry adapters -> availability
-> five façades/context -> safe slices/registrars -> complete runtime -> entry-local atomic registration。No stage can emit partial
business rows、run/evidence identity or acceptance facts。Step09关闭`0/12`，新上游blocker=`none`。

## 13. 自检与完成门禁

### 13.1 自检

| 检查项 | 当前状态 | 证据 / 待执行 |
|---|---|---|
| SOP八问、required outputs与formal §9位置 | pass | §4、§8.1、§8.8~§8.9、§8.16~§8.17、§10 |
| current source先于historical/reference | pass | §3、§5 |
| exact ENV registry count=61 | pass | unique-key静态计数=61；§8.3 |
| CFG-D01~D23逐域table/stop review | pass | table=23、review=23；D05/D21已按R2 exact registration seam重审 |
| RQ/X/P rule编号与引用闭合 | pass | RQ=8、X=22、P=4、VAL-S=13；§8.6~§8.9 |
| formal seven error variants未扩展 | pass | unique variant计数=7；§8.6、§8.10~§8.12 |
| 13 stages、five façades、context factory、three slices/two registrars一致 | pass | formal §5/§13与§8.10/§8.14 exact；raw/private/safe/catalog/handle chain闭合 |
| sensitive material/no-output/historical pinning | pass | catalog/snapshot/history pass；entry slice/registrar无locator/material/private getter |
| 10 VETO exact coverage | pass | `VF-OBS-001~010` unique coverage=10；§8.18 |
| `03` impact无漏判 | pass_after_R2 | `CFG-BLK-09-01` exact return points与formal/Step08/09回灌已完成；无business contract扩张 |
| 无实现/run/evidence/verdict/signoff伪造 | pass | design-only；open material保持`not_selected/not_established/not_run/not_evaluated` |
| Markdown table/fence/title/whitespace/git diff | pass | table pipe一致、8条fence边界成对、无trailing whitespace；`git diff --check`通过 |
| formal `04`未修改、Step10未读取/推进 | pass | 本Step只写calibration产物与flow/ledger；Step10仍blocked |

### 13.2 完成门禁

| 条件 | 当前状态 | 说明 |
|---|---|---|
| loader/validator/builder/exposure可落码 | pass_for_design | loader/identity/validation/assembly + entry-safe registration闭合；实现仍等current `05~07` |
| 23域加载校验停审 | pass | D01~D23全部pass |
| 跨加载/VETO无unresolved conflict | pass | 25项跨加载审计与10 VETO均无open conflict |
| upstream blocker | `none` | `CFG-BLK-09-01` resolved by targeted R2；其他open material只阻塞implementation/operations readiness |
| Step09 gate_status | `pass_consumed_by_step_10` | 最终M3 13-stage assembly、entry exposure与12项affected复核通过 |
| next_allowed_action | `continue_to_current_step_10_under_continuous_M4_authorization` | 按SOP进入Step10；formal `04`仍冻结到Step15 |
