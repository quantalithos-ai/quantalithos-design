# L4-observability 04-配置设计 Step 07 · 定义配置项清单

> 对应SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节: `04-配置设计.md` §7
> 当前模式: `full-restart`
> 本步边界: 从current Step03~06和formal `03` typed config逐字段建立P0 JSON schema；不得在`04`静默定义缺失的Rust类型、enum variant、DTO、reader、builder或error

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前Step | Step 07 `定义配置项清单` |
| 当前模块 | `field-registry-schema-demo-closure` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_07_config_items.md` |
| 用户确认 | Step06 current复核已通过；用户于2026-08-02授权连续完成全部M4 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_after_M3_revalidation` |
| 自检状态 | `pass` |
| gate_status | `pass_consumed_by_step_08` |
| gate_reason | `CFG-BLK-07-01`已定向修复并进入最终M3；P0 exact field registry、numeric bound、nested schema、strict JSON/完整JSONC、23域停审、跨项/VETO、12项affected与`03`影响均已复核 |
| blocker | `none`；`CFG-BLK-07-01` resolved on 2026-07-14 |
| next_allowed_action | `continue_to_current_step_08_under_continuous_M4_authorization` |

### 1.1 Step内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复project ledger、flow与Step03~06 | §3输入 | done | Step06 pass且用户已确认Step07 |
| 读取SOP Step07、书写规范§5.7及formal typed config | §3~§4 | done | 12问、总表、模块demo、完整demo和逐域停审要求明确 |
| 独立建立root section、field与default/range决策 | §8.1~§8.3 | done_for_audit | 未从old Step07反推current schema |
| 执行formal `03` definition/use审计 | §8.4~§8.6 | done | 发现6个直接依赖类型未闭口 |
| 后置审计old Step07 / old formal §7 / L1参考 | §5~§7 | done | 旧profile/key/value/source/evidence path全部隔离 |
| 执行`CFG-BLK-07-01` targeted `03` repair | §8.5~§9.2 | done | 6 type唯一owner、exact value/newtype、9 Consumer map与formal同步 |
| 写配置项总表与可复用对象schema | §8.7~§8.10 | done | exact raw representation、baseline/hard bound、source/sensitivity/failure闭合 |
| 写模块级严格JSON与完整JSONC | §8.11~§8.12 | done | 示例可由current schema判定且无raw secret/product/evidence占位 |
| 完成23域停审、跨项/VETO审计与formal草稿 | §8.13~§12 | done | 无重复owner、无反向红线key、无actual `03`回写遗留 |

### 1.2 写入前检查

| 检查项 | 结论 |
|---|---|
| 写入类型 | current Step07中间产物 blocker checkpoint；不是formal正文回填 |
| 项目级门禁 | pass；project ledger停在Step06 pass，用户已确认Step07 |
| 文档级门禁 | pass_for_current_step；flow允许Step07，不允许Step08 |
| Step思考状态 | done_for_blocker；先从current source建立字段模型，再读old Step07作差异审计 |
| 正式正文污染 | controlled；formal `03`只按用户授权完成`CFG-BLK-07-01`最小定向回写；formal `04`未修改 |
| 越过未来Step | no；不定义Step08 provider/rotation、Step09 loader算法或Step10 activation/rollback |
| `03`静默扩展 | prevented；缺失类型进入blocker而非在JSON schema中私造 |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 把`ValidatedObservabilityConfig`及其typed sections映射为唯一项目本地strict JSON schema。
2. 为每个P0 leaf固定名称、类型、单位、默认/必填、来源allowlist、作用域、生效方式、敏感级别、失败策略和consumer。
3. 固定可复用store、retry、external adapter、capability、consumer、target与schedule对象的raw shape和cross-field gate。
4. 逐项回指Step03控制面/配置域、Step04分类/禁止边界、Step05来源优先级和Step06环境矩阵。
5. 按功能section提供模块级strict JSON demo和完整JSONC文档示例，不使用`storage/common/misc`泛化模块。
6. 对全部23域执行配置项停审、重复owner审计、sensitive分类审计和`03`影响判定。
7. 在写字段前验证formal type definition/use闭合，防止配置文档替代详细设计定义代码契约。

### 2.2 本步非目标

- 不定义Rust struct/enum/newtype/trait/function/DTO或修改builder stage。
- 不新增`observability`项目名前缀；项目本地root直接使用formal section，系统聚合映射另行说明。
- 不定义env variable exact name、CLI flag、config path、include、remote source或hot reload。
- 不选择DB、bus、scheduler、secret、archive、report、GRC、dashboard或APM产品。
- 不写raw endpoint、credential、token、DSN、cert、secret body、topic或provider response。
- 不把示例ref、duration或limit写成真实environment readiness、SLO、测试结果或验收证据。
- 不恢复old Step07中的profile、key、数字、report root、`<run_id>`路径或evidence开关。
- 不在上游type未闭口时用free-form string、placeholder enum或实现者自行决定替代正式契约。

## 3. 本步输入

| 输入 | current身份 | 本步采用内容 |
|---|---|---|
| `配置设计讨论流程_SOP.md` Step07 | current process standard | 12问、总表、域批次、module JSON、完整JSONC、逐项停审和跨项审计 |
| `配置设计书写规范.md` §2.4 / §5.7 / §6 | current writing standard | 不静默新增代码契约、十列配置表、strict JSON与formal §7结构 |
| 通用三项设计标准与依赖裁剪规则 | current global standard | truth-source、可落码、definition/use、targeted repair和only-core dependency |
| `04_config_step_03_control_plane.md` | current Step03 | 11控制面、23域、reader/assembly/snapshot边界 |
| `04_config_step_04_categories_boundaries.md` | current Step04 | 允许分类、cold lifecycle、`F-CFG-01~24`禁止项 |
| `04_config_step_05_sources_priority_conflicts.md` | current Step05 | `SRC-DECL < SRC-JSON < SRC-ENV`、field allowlist、derived identity和no-fallback |
| `04_config_step_06_environment_profiles_matrix.md` | direct previous Step | 三类runtime、六lane、mode/requiredness和truthfulness状态 |
| formal `03-详细设计.md` §6 / §7 / §13 | direct code baseline | protocol finite surface、typed config、cross-field gate、entry/catalog/builder契约 |
| `03_ddd_step_06_object_contracts.md` | definition owner input | typed ref family、operation enum、source/version/ref use site |
| `03_ddd_step_08_protocol_contracts.md` | protocol input | 16/14/9/12/9 surface名称、envelope和consumer/job schema |
| `03_ddd_step_13_concurrency_idempotency.md` | operation namespace input | 14 Query exact operation name清单和snapshot/history不变量 |
| `03_ddd_step_14_config_external_binding.md` | primary field baseline | root/section/leaf types、binding objects、default/missing与validation |
| old `04_config_step_07_config_items.md`;old formal `04` §7 | historical material | 后置审计26个旧key、旧profile/source/value/evidence path |
| L1-governance / L1-artifact Step07 | granularity reference | 参考表/demo/停审结构；不继承其profile、mode、数字、entry-local或product truth |

### 3.1 字段建模原则

| 原则 | 本Step解释 |
|---|---|
| Code type先于raw key | 每个JSON field必须映射existing formal field或明确为derived/non-field |
| Root不重复项目名 | 项目本地JSON使用`profile/technical/boundary/...`；聚合层可映射`l4_observability.<path>` |
| Raw使用`snake_case` | 与formal Rust field一一对应；不建立camelCase alias或历史key兼容 |
| Unit写入key | duration使用`*_ms`，byte/count/revision字段保留typed语义；禁止`1m`/`manual`等多态字符串 |
| Set/catalog whole value | canonical sorted/unique list整体来自JSON；ENV默认不能增量append/delete/deep merge |
| Derived不是raw field | `ConfigBindingRef`、entry slice、safe catalog与Job snapshot由validator/builder派生 |
| Ref不是raw material | locator/ref可在ordinary config；resolved endpoint/credential/provider body不进入root/demo |
| Explicit required优先 | 只有上游正式给出的default才使用default；required marker不生成zero/empty/first enum |
| Example不是evidence | demo value仅说明schema，不能变成环境ready、run、artifact、evidence或验收结论 |

## 4. SOP问题回答

### 4.1 每个P0配置项的名称、类型、默认值是什么?

Root section和全部leaf已从formal `03` §13、DDD Step14及修复后的support type确定。Current只建立三组implicit declaration default：digest write/read为`v1`/`[v1]`、`execution.max_parallelism=1`、四类retry的`max_additional_attempts=0`；其他duration/limit/binding仍显式必填。§8.8给出required numeric field的P0 candidate baseline与validator hard range，baseline用于准备可运行candidate，不是缺失时自动default，也不是SLO、容量证据或环境ready结论。

### 4.2 哪些配置项必填?

Profile、technical mode、boundary、six safety values、four store objects、transaction/schema、digest、five technical retention、seven projection、claim/plan/job controls、four retry policy objects和entry loop controls是root required。Store binding在Durable时conditional required；technical binding按mode/constructor contract conditional required；external binding的mode/binding/credential/capability按family和profile conditional required；enabled Consumer/Job/Event/target要求exact total mapping。

修复后的`SchemaVersion`、`SourceFamilyKind`与Consumer static producer map已闭口；root schema set、source allowlist和每个enabled Consumer binding均可做non-empty/canonical/totality校验。Conditional required、explicit nullable与enabled mapping规则见§8.9~§8.10。

### 4.3 每个配置项从哪里来、作用域是什么?

Ordinary field只从逐field登记的`SRC-DECL/SRC-JSON/SRC-ENV`子集取得，优先级固定R0<R1<R2。默认策略为required complex object/set/catalog只允许JSON；有限scalar/mode/opaque locator是否允许ENV需逐field登记。所有root field均属于new assembly/process scope并冷生效；Job snapshot和entry slice是derived scope，不是override source。

### 4.4 每个配置项如何生效、是否敏感、失败策略是什么?

Root candidate完整merge、parse、type/range、cross-field/profile/redline后建立identity，再解析selected sensitive locator并执行capability/totality gate；只有complete runtime可暴露façade。Raw material不存在合法field；opaque store/adapter/credential/policy/transport/schedule locator标为`ref-sensitive`或`sensitive-locator`。Missing/invalid required field阻断new assembly，高优先级非法值不fallback；post-assembly exact target Unavailable不换binding。

### 4.5 每个配置项关联哪些模块?

Formal consumer已由section固定：`technical`到clock/id constructors；`boundary`到API/worker pre-dispatch；`safety`到infra validator/application policy input；`stores`到repository/UoW；`digest`到serializer/loaders；`idempotency`到reservation/result/intent stores；`projection/execution`到planner/Job services；`external`到adapter registry/safe catalog；`entries`到API/worker/jobs roots。

### 4.6 每个模块的JSON demo如何写?

模块demo使用strict JSON、`snake_case`和current finite token，只包含functional section或可复用object，不含注释、raw secret、产品、endpoint/topic/path或真实identity。完整demo使用JSONC并明确运行时必须删除注释；全部`demo:*`值只是可解析opaque ref，不代表实例、provider、route、run、evidence或readiness。

### 4.7 模块拆分是否避免泛化模块?

是。候选root严格沿用formal section：`profile`、`technical`、`boundary`、`safety`、`stores`、`digest`、`idempotency`、`projection`、`execution`、`external`、`entries`。不使用`storage/common/misc/runtime`吞并不同owner；`profile`是root scalar，`config_ref`为derived output。

### 4.8 项目本地配置是否避免重复项目前缀?

是。项目本地JSON不使用`observability.*`前缀。若未来system-level aggregator承载多个项目，只允许做显式外层映射`l4_observability.<local_path>`；该映射不表示current loader支持聚合文件，也不改变local schema、priority或identity。

### 4.9 完整配置demo是否需要文档注释?

需要，用于说明conditional required和environment mode；必须标记`jsonc`，实际candidate必须删除注释后成为strict JSON。§8.12已提供可去注释解析的完整示例，并明确current loader不支持JSONC。

### 4.10 每项能否回指Step03~06和`03`?

可以。§8.13把每个配置域回指Step03控制面、Step04分类/禁止项、Step05 source和Step06 environment；support type回指targeted-repaired Step06/08/13/14与formal §6/§7/§12/§13。

### 4.11 每个配置域是否通过停审?

是。§8.14逐域停审覆盖`CFG-D01~D23`；D02/D22/D23明确为derived/no-raw-field/view-only，其余域均有exact field或nested schema、requiredness、source、sensitivity、activation、failure和consumer。

### 4.12 是否存在重复项、泛化混写、必填无失败策略、敏感遗漏或`03`影响未判定?

未发现重复owner、泛化module、必填无失败、sensitive遗漏或环境特例。曾发现的definition/use缺口已按最小范围回写`03`并重新检查；§8.15跨项/VETO审计无unresolved conflict。Step07完成后仍停审，必须等待用户确认才能进入Step08。

## 5. 当前文档问题诊断

| 位置 | historical问题 | Current处理 |
|---|---|---|
| old Step07全文 | 仅67行，26个粗粒度key，无12问、domain batch、JSON demo、逐项停审或跨项审计 | 整份替换；当前先停在definition/use blocker checkpoint |
| old Step07状态 | 开工即`gate_status=pass`并直接允许Step08 | 废弃；current上游审计未通过时gate必须blocked |
| old profile | `local-dev/ci-test/integration-like/operations-replay`并默认`local-dev` | 废弃；只允许formal `LocalTest/IntegrationLike/RuntimeLike`显式值 |
| old source | `CLI > env > file`、`secret provider > env ref` | 废弃；ordinary固定DECL<JSON<ENV，secret result不参与priority |
| old mode | `fake/controlled/durable-disabled` store、fake/controlled redaction | 废弃；store只有InMemory/Durable，redaction是required policy binding无Fake bypass |
| old fields | retention class/archive、signal rollup/log模板、report roots、evidence alias开关、四个cadence | formal `03`无对应root field；不得静默恢复 |
| old values | `200`、`1m/5m/1h`、`standard`、`quarantine`等 | historical unsupported values；不得作为current default/hard max |
| old path | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 禁止进入current root；设计阶段不得配置真实run/evidence identity |
| old secret | redaction/report writer token ref | formal current adapter/safety边界不同；只能由current Step07/08 locator清单产生 |
| old impact | 声称`ObservabilityRuntimeConfig`已回写但current正式类型完全不同 | historical false closure；不得继承“已回写”状态 |
| old formal `04` §7 | 只保留六列且复制上述key/value | historical；Step15只能从current Step01~14装配 |
| L1参考 | 使用其项目私有profile、entry-local、fake target和历史数字 | 只参考结构与粒度，不复制配置truth |

### 5.1 Historical material隔离

Old Step07/formal §7中的所有`observability.*` key、四profile、CLI precedence、report path、evidence开关、adapter mode和数值都只允许在本节诊断出现。它们不能成为alias、migration input、default、demo或test expected value。

## 6. 改动前后对比

| 项 | 改动前 | Current方向 / blocker | 原因 |
|---|---|---|---|
| Schema owner | 26个自创key | exact映射formal `ValidatedObservabilityConfig` sections | 配置不得替代详细设计 |
| Root naming | `observability.<group>` | project-local root不重复前缀；聚合层显式外包 | 对齐SOP项目本地规则 |
| Naming style | mixed snake/path | formal field同名`snake_case` | 一对一serde/validator可追溯 |
| Type粒度 | string/bool/integer摘要 | typed enum/newtype/object/set/catalog + unit/range | 可解析、可校验、可测试 |
| Defaults | 大量无来源值 | 只保留formal explicit default；其余required | 防止historical数字升级current truth |
| Source | CLI/env/file混排 | field-level DECL<JSON<ENV allowlist | 承接Step05唯一precedence |
| Environment | 旧四profile | three formal runtime classes + six document lanes | 承接Step06，不新增profile |
| Sensitive | token ref与普通字段混写 | ordinary locator和resolved material分离 | Step08继续provider/rotation/no-output |
| Demo | none | 应有per-module strict JSON + full JSONC | SOP硬要求；当前被finite type缺口阻断 |
| `03`影响 | 错误声称已回写 | 6个未闭口type进入targeted repair blocker | 不能在`04`补造Rust契约 |

## 7. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| Raw schema | formal section/field同名snake_case | 恢复旧key或自创业务模块 | 保持definition/use与serde映射 |
| Config identity | effective candidate校验后派生`ConfigBindingRef` | raw `config_ref`由operator填写 | path/run/evidence不能成为identity；算法留Step09 |
| Duration | raw integer milliseconds，key含`_ms` | `1m`/`manual`/ISO string混用 | 单一解析规则且与`PositiveDurationMillis`一致 |
| Set/catalog | typed entry list、canonical sorted/unique、whole replace | free-form map或ENV fragment merge | 避免duplicate/alias/order歧义 |
| Default | 仅formal explicit default | Rust zero、旧数字、provider default、first item | requiredness不能由实现猜 |
| External binding | reusable exact object，family约束phase | mode字符串+任意extra map | capability/credential/Disabled可cross-field校验 |
| Full demo | 只有type/value闭口后生成 | placeholder、`<value>`或虚构产品ref | “完整”示例必须可被validator判定 |
| Missing code type | blocker + targeted `03` repair | 在`04`定义enum/string convention | 后者违反配置设计相对详细设计边界 |

## 8. 结构化中间产物

### 8.1 Root schema候选

| JSON path | Formal target | Raw身份 | Current状态 |
|---|---|---|---|
| `profile` | `ValidatedObservabilityConfig.profile` | required finite scalar | definition closed |
| `technical` | `TechnicalRuntimeConfig` | required object | definition closed |
| `boundary` | `BoundaryConfig` | required object | definition closed；exact values见§8.8~§8.9 |
| `safety` | `SafetyBindingConfig` | required object | definition closed；allowlist与policy refs见§8.9 |
| `stores` | `StoreBindingConfig` | required object | definition closed |
| `digest` | `DigestCompatibilityConfig` | required object | definition closed |
| `idempotency` | `IdempotencyRetentionConfig` | required object | definition closed |
| `projection` | `ProjectionRuntimeConfig` | required object | definition closed |
| `execution` | `ExecutionRuntimeConfig` | required object | definition closed |
| `external` | `ExternalBindingSet` | required object / catalogs | definition closed；nested schema见§8.10 |
| `entries` | `EntryBindingConfig` | required object / finite sets | definition closed；9 producer map见§8.10 |
| no raw path | `ValidatedObservabilityConfig.config_ref` | stage4 derived output | must not appear in JSON |

### 8.2 已闭口字段族

| Field family | Formal type | 已确认default / required | Source上限 | 生效 / failure |
|---|---|---|---|---|
| `profile` | `RuntimeProfileClass` | required；无default | JSON；ENV可批准scalar | new assembly；unknown/profile mismatch fail |
| `technical.clock_mode` | `ClockAdapterMode` | required；无default | JSON；ENV可批准scalar | new assembly；profile mismatch fail |
| `technical.clock_binding_ref` | `Option<AdapterBindingRef>` | mode/constructor conditional | JSON；ENV可批准opaque locator | selected resolution/construction fail |
| `technical.id_generator_mode` | `IdGeneratorAdapterMode` | required；无default | JSON；ENV可批准scalar | new assembly；profile mismatch fail |
| `technical.id_generator_binding_ref` | `Option<AdapterBindingRef>` | mode/constructor conditional | JSON；ENV可批准opaque locator | selected resolution/construction fail |
| boundary numeric leaves | `PositiveByteSize/PositiveLimit/PositiveDurationMillis` | required；P0 baseline/hard range见§8.8 | JSON；approved scalar ENV | range/cross-field fail，request只可收窄 |
| safety policy refs | five `PolicyBindingRef` leaves | all required；无default | JSON+approved locator ENV；管理机制留Step08 | missing/resolution/redline fail |
| four store objects | `StoreAdapterBindingConfig` | mode required；Durable binding conditional | JSON；mode/ref可逐leaf批准ENV | schema/atomicity/fence fail，无fallback |
| transaction/schema | duration + `StoreSchemaRevision` | required；无default | JSON；approved scalar ENV | mismatch/timeout semantics fail closed |
| digest | profile version + canonical set | `v1` / `[v1]` | DECL/JSON；ENV deny | unknown/in-use removal fail |
| five retention leaves | `PositiveDurationMillis` | required；无default | JSON；approved whole values ENV | invalid/cross-window fail |
| six projection limits + policy ref | `PositiveLimit` + `PolicyBindingRef` | required；无default | JSON；scalar ENV optional，policy locator restricted | overflow whole boundary fail |
| claim lease | two positive durations | required；heartbeat < lease | JSON；ENV whole object deny | invalid/fence capability fail |
| execution limits | `PositiveLimit` / duration | max_parallelism default 1；others required | JSON；approved scalar ENV | hard cap/start fail；Job freezes |
| four retry objects | `RetryPolicyConfig` | additional attempts default 0；backoff fields仍typed required object | JSON；ENV whole object deny | invalid/backoff/capability fail |
| four resolver + publisher binding | `ExternalAdapterBindingConfig` | object required；mode controls conditional leaves | JSON；selected locator ENV restricted | family/profile/descriptor fail |
| target/catalog entry shape | formal typed structs | list requiredness按enabled surface | JSON whole list；ENV fragment deny | duplicate/missing/phase mismatch fail |
| enabled operation sets | finite operation vectors | explicit canonical sets；无implicit all | JSON whole list；ENV deny | unknown/duplicate/route incompleteness fail |
| schedule / loop | typed list + duration/limit | schedule list may empty；loop leaves required | JSON；approved loop scalar ENV | schedule不生成input truth；invalid fail |

本表保留definition-closed inventory的审计层；完成后的exact default/baseline/range/source与finite value以§8.7~§8.10为准，formal §7只允许从该完成层装配。

### 8.3 配置域到候选field映射

| Domain ID | 候选配置项 / derived material | Definition状态 | Step07停审 |
|---|---|---|---|
| `CFG-D01` | field registry、strict JSON candidate、ENV allowance metadata | closed at semantic level | pending full field table |
| `CFG-D02` | no raw field；derived effective `ConfigBindingRef` | type closed；algorithm Step09 | pending |
| `CFG-D03` | `profile`;`technical.*` | closed | pending numeric/demo integration |
| `CFG-D04` | `boundary.*` | closed after targeted repair | pass；§8.8/§8.9/§8.14 |
| `CFG-D05` | `entries.*` | closed after targeted repair | pass；§8.10/§8.14 |
| `CFG-D06` | `safety.redaction_policy_ref`;`body_free_scanner_policy_ref` | closed | pending Step08 classification |
| `CFG-D07` | `safety.source_family_allowlist`;other safety refs | closed after targeted repair | pass；§8.9/§8.14 |
| `CFG-D08` | `stores.observation`;`stores.idempotency_result` | closed | pending exact values |
| `CFG-D09` | `stores.projection` | closed | pending exact values |
| `CFG-D10` | `stores.job_execution` | closed | pending enabled-Job matrix |
| `CFG-D11` | `stores.transaction_timeout_ms`;`required_schema_revision` | closed | pending exact values |
| `CFG-D12` | `digest.write_profile`;`readable_profiles` | closed | pending table/demo |
| `CFG-D13` | `idempotency.*_ms` | closed | pending exact values/cross-window |
| `CFG-D14` | `projection.*` | closed | pending exact values |
| `CFG-D15` | `execution.claim_lease`;limits;`job_timeout_ms` | closed | pending exact values |
| `CFG-D16` | four `execution.*_retry` | closed | pending exact backoff values |
| `CFG-D17` | four resolver bindings | closed | pending object table/demo |
| `CFG-D18` | publisher + outbound event targets | event names known；target shape closed | pending totality/demo |
| `CFG-D19` | report handoff targets | closed after targeted repair | pass；§8.10/§8.14 |
| `CFG-D20` | peripheral export targets | closed after targeted repair | pass；§8.10/§8.14 |
| `CFG-D21` | all locator/ref leaves | ref types mostly closed | pending Step08 classification |
| `CFG-D22` | no activation field；new candidate + stored historical refs | closed semantic | pending no-field audit |
| `CFG-D23` | no lane field；`profile` references Step06 view | closed semantic | pending no-field audit |

### 8.4 Definition/use审计方法

```text
formal config leaf / nested object
  -> referenced Rust type
  -> unique owner and exact definition
  -> finite variants or newtype invariant
  -> raw JSON representation can be mapped losslessly
  -> only then may Step07 assign key/default/source/demo
```

Use site、名字列表或“has exact variants”文字不能替代type definition。Opaque ref可以用统一`BodyFreeRef` newtype模式闭口，但必须在typed ref family具名登记；finite enum/set必须列出exact variants，不能让parser接受free-form string。

### 8.5 `CFG-BLK-07-01`发现时缺失类型清单（已修复）

| Missing type | Current use site | 已有语义 | 缺失内容 | 直接阻断的Step07 field |
|---|---|---|---|---|
| `SchemaVersion` | protocol envelope、stored replay、`BoundaryConfig`、Consumer binding | 表示typed payload schema；unsupported不parse body | owner、raw representation、validation、current supported values | `boundary.accepted_inbound_schema_versions`;`entries.inbound_consumers[].accepted_schema_versions` |
| `SourceFamilyKind` | intake DTO、reference scope、safe summary、`SafetyBindingConfig` | finite source material family；unknown reject/quarantine | enum owner与exact variants | `safety.source_family_allowlist` |
| `ObservationProducerFamily` | inbound envelope/source version/idempotency identity/Consumer binding | producer + source exact identity和ordering scope | enum owner与exact variants | `entries.inbound_consumers[].producer_family` |
| `ObservationQueryOperation` | operation namespace、API enabled set | Step13列出14个exact names | actual enum definition与owner文件；Step06仅文字占位 | `entries.enabled_queries` |
| `ReportConsumerRef` | handoff object/protocol/target catalog | body-free external report/archive consumer identity | typed-ref family具名newtype/invariant | `external.report_handoff_targets[].consumer_ref` |
| `PeripheralConsumerRef` | export object/protocol/target catalog | body-free dashboard/alert/external-audit/GRC consumer identity | typed-ref family具名newtype/invariant | `external.peripheral_export_targets[].consumer_ref` |

本表保留blocker发现证据，不再代表当前缺口。用户授权后已由Step06定义type owner/variant/token/newtype，Step08固定9 Consumer static map，Step13/14同步idempotency/config use，Step17/19/formal §6/§7/§12/§13同步承接；`04`只消费这些definition，不成为第二代码真相源。

### 8.6 Blocker影响与禁止绕过

| 可能绕过方式 | 为什么禁止 | Current处理 |
|---|---|---|
| 把缺失enum写成任意string | parser/validator无法exhaustive，配置可扩展protocol/truth | 不生成field contract；回写`03` exact type |
| 从九Consumer名称猜producer family | consumer operation不等于producer owner，统一consumer可接多个source family | 不猜；需要formal mapping vocabulary |
| 把schema默认写成`v1` | digest v1与protocol schema version不是同一contract | 不复用；需要SchemaVersion定义与supported set |
| 从old formal/README恢复source family或version | historical material无current baseline资格 | 禁止alias/default/migration |
| demo使用`<schema>`或`example-family` | 完整JSON应可被validator判定，placeholder会伪装闭合 | blocked期间不生成full demo |
| 在`04`附录定义Rust enum | 配置文档静默改变code contract | 进入targeted `03` repair |
| 让实现agent自行补newtype/variant | 破坏唯一真相源并导致不同adapter取值漂移 | implementation readiness继续blocked |

Repair后上述绕过方式仍全部禁止；区别只是合法definition现已可引用。`CFG-BLK-07-01`状态=`resolved`，definition/use检查入口见§12.1。

### 8.7 Raw JSON 命名、表示与登记图例

| 规则面 | Current contract |
|---|---|
| 本地root | 只使用`profile`、`technical`、`boundary`、`safety`、`stores`、`digest`、`idempotency`、`projection`、`execution`、`external`、`entries`；不重复项目名前缀 |
| 系统聚合 | 未来聚合器只可显式映射`l4_observability.<local_path>`；不表示current loader支持聚合文件 |
| 字段名 | 全部lowercase `snake_case`；duration raw key以`_ms`结尾；不接受camelCase、旧key或alias |
| enum | exact lowercase `snake_case` token；unknown、case-fold、trim alias、numeric alias、`Other`和first-variant default均拒绝 |
| ref / locator | JSON string只承载non-empty opaque ref；不得解析prefix取得owner、endpoint、topic、path、credential或正文 |
| optional ref | key仍必须出现，值为exact string或`null`；missing与explicit null不等价，禁止空字符串表示clear |
| set | JSON array；parse后按typed canonical bytes排序去重；输入duplicate直接拒绝而非静默deduplicate；ENV不做增量append/delete |
| catalog | JSON array of typed entry；以formal subject key判重并做totality；不使用free-form object map或array index override |
| object | strict object；unknown/duplicate key拒绝；不允许`extra`/`properties`扩展桶 |
| derived | `config_ref`、entry slice、safe catalog与Job snapshot不出现在raw JSON；由validated effective candidate派生 |

以下表格使用三个简写：`N`=ordinary non-sensitive，`R`=ref-sensitive opaque locator/identity，`S-L`=sensitive locator（不是secret material）；`A`=new complete assembly scope，`E`=derived entry-registration scope，`J`=accepted new Job snapshot scope，`H`=historical effect/binding scope。`JSON+ENV`表示该canonical leaf允许R1/R2 winner，未授权的ENV仍按Step05拒绝；complex set/catalog/object默认`JSON only`。

### 8.8 P0 numeric baseline、hard range 与交叉约束

本表的“P0 baseline”是本 Step 完整candidate与初始环境准备值，不是缺失时default。除明确标为`DECL default`的值外，raw candidate必须显式提供。Hard range是validator contract，不是性能目标、SLO、容量证明或生产调优结论。

| JSON path / family | P0 baseline | Inclusive hard range | Unit | Cross-field / failure contract |
|---|---:|---:|---|---|
| `boundary.max_request_body_bytes` | 262144 | 1024..1048576 | bytes | pre-parse reject；不得截断后继续 |
| `boundary.default_page_limit` | 50 | 1..200 | items | `<= max_page_limit` |
| `boundary.max_page_limit` | 200 | 1..1000 | items | request只能收窄；超界reject |
| `boundary.query_read_timeout_ms` | 5000 | 100..30000 | ms | timeout只返回unavailable；不得触发write |
| `stores.transaction_timeout_ms` | 10000 | 1000..60000 | ms | timeout after commit request仍可`CommitOutcomeUnknown` |
| `stores.required_schema_revision` | 1 | P0 exact 1 | revision | descriptor mismatch fail startup；不得自动migration |
| `idempotency.command_reservation_ms` | 86400000 | 3600000..2592000000 | ms | 不短于caller retry/commit-unknown处理窗口 |
| `idempotency.consumer_dedup_ms` | 604800000 | 3600000..7776000000 | ms | 不短于声明的producer/broker redelivery窗口 |
| `idempotency.job_reservation_ms` | 604800000 | 3600000..7776000000 | ms | `>= job_timeout_ms`且覆盖nonterminal plan/report |
| `idempotency.reserved_reconciliation_age_ms` | 3600000 | 60000..86400000 | ms | `< command/consumer/job reservation`；到龄不证明rollback |
| `idempotency.external_intent_ms` | 2592000000 | 86400000..15552000000 | ms | `>= job_reservation_ms`；覆盖probe/manual window |
| `projection.max_source_items_per_capture` | 1000 | 1..10000 | items | overflow使whole capture失败 |
| `projection.max_relation_closure_items` | 5000 | 1..50000 | items | `>= max_source_items_per_capture`；不得截断后Fresh |
| `projection.default_rebuild_batch` | 100 | 1..1000 | items | Job input只能收窄 |
| `projection.default_refresh_batch` | 100 | 1..1000 | items | Job start冻结 |
| `projection.default_gap_scan_batch` | 100 | 1..1000 | items | 不得漏项后complete |
| `projection.default_rollup_batch` | 500 | 1..5000 | items | 只读stored `SafeSignal` |
| `execution.claim_lease.lease_duration_ms` | 30000 | 5000..300000 | ms | durable adapter决定Expired |
| `execution.claim_lease.heartbeat_interval_ms` | 10000 | 1000..60000 | ms | `< lease_duration_ms` |
| `execution.max_parallelism` | 1 | 1..32 | workers | `DECL default=1`；不关闭fence/CAS |
| `execution.max_plan_items` | 10000 | 1..100000 | items | overflow rollback Job start；不建partial plan |
| `execution.*_retry.max_additional_attempts` | 0 | 0..5 | attempts | `DECL default=0`；不含first attempt |
| `execution.*_retry.backoff.initial_delay_ms` | 500 | 1..60000 | ms | additional attempts为0时仍须合法但不执行 |
| `execution.*_retry.backoff.maximum_delay_ms` | 30000 | 1..300000 | ms | `>= initial_delay_ms` |
| `execution.*_retry.backoff.multiplier_milli` | 2000 | 1000..10000 | milli-ratio | 2000表示2x；fixed canonical integer |
| `execution.*_retry.backoff.jitter_ratio_milli` | 200 | 0..1000 | milli-ratio | 200表示20%；不得改变retry classification |
| `execution.job_timeout_ms` | 300000 | 1000..3600000 | ms | safe phase协作yield；不取消unknown external call |
| resolver `call_timeout_ms` | 5000 | 100..60000 | ms | timeout映射formal unavailable/unknown；不产default truth |
| publisher/handoff/export `call_timeout_ms` | 10000 | 100..300000 | ms | `< job_timeout_ms`；ambiguous outcome走probe/manual |
| `entries.outbox_loop_cadence_ms` | 1000 | 100..60000 | ms | 只影响调度，不改变eligibility |
| `entries.outbox_loop_candidate_limit` | 100 | 1..1000 | items | 超界reject；不截断并宣称complete |

所有required numeric winner先做primitive range，再做本表cross-field/profile/redline validation。任一失败拒绝complete candidate且不fallback低优先级值。未来若真实workload要求越过hard range，必须先回到`03`/`04`说明内存、事务、plan、fence、timeout和测试影响；不能只改部署文件。

### 8.9 十列配置项总表

#### 8.9.1 `profile` / `technical` / `boundary` / `safety`

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `profile` | enum `local_test/integration_like/runtime_like` | 无 | 是 | JSON+ENV | A | cold new assembly | N | unknown/profile-mode mismatch=`InvalidConfiguration` | config validator/runtime builder |
| `technical.clock_mode` | enum `system/fixed` | 无 | 是 | JSON+ENV | A | cold；constructor select | N | invalid profile combination fail assembly | infra clock builder |
| `technical.clock_binding_ref` | string or null `AdapterBindingRef` | 无；explicit null/value | 是；constructor条件 | JSON+ENV | A | cold；selected adapter only | R | missing/invalid selected binding fail assembly | infra clock builder |
| `technical.id_generator_mode` | enum `runtime/deterministic` | 无 | 是 | JSON+ENV | A | cold；constructor select | N | invalid profile combination fail assembly | infra ID builder |
| `technical.id_generator_binding_ref` | string or null `AdapterBindingRef` | 无；explicit null/value | 是；constructor条件 | JSON+ENV | A | cold；selected adapter only | R | missing/invalid selected binding fail assembly | infra ID builder |
| `boundary.max_request_body_bytes` | positive u64 bytes | 无；baseline 262144 | 是 | JSON+ENV | A/E | cold；API/worker slice | N | range invalid fail assembly；request超界pre-parse reject | config/API/worker |
| `boundary.default_page_limit` | positive u32 items | 无；baseline 50 | 是 | JSON+ENV | A/E | cold；API slice | N | range/default>max fail assembly | config/API/query mapper |
| `boundary.max_page_limit` | positive u32 items | 无；baseline 200 | 是 | JSON+ENV | A/E | cold；API/repository guard | N | range invalid fail assembly；request超界reject | API/read repositories |
| `boundary.query_read_timeout_ms` | positive u64 ms | 无；baseline 5000 | 是 | JSON+ENV | A/E | cold；API slice | N | invalid fail assembly；runtime timeout unavailable/no-write | API/read service wrapper |
| `boundary.accepted_inbound_schema_versions` | non-empty set `SchemaVersion` | 无 | 是 | JSON only | A/E | cold；worker schema router | N | P0非`[v1]`/duplicate/empty fail assembly；unknown input不parse | config/worker/contracts |
| `safety.redaction_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A | cold；pre-façade resolve | R | missing/unresolved fail closed | infra safety validator/application policy |
| `safety.source_family_allowlist` | non-empty set `SourceFamilyKind` | 无 | 是 | JSON only | A/E | cold；API/worker mapper | N | unknown/duplicate/empty fail assembly；input outside reject/quarantine | config/API/worker |
| `safety.safe_label_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A | cold；pre-façade resolve | R | missing/unresolved fail closed；no high-cardinality fallback | safe-signal validator |
| `safety.correlation_mapping_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A | cold；pre-façade resolve | R | missing/unresolved fail closed；opaque IDs不推truth | correlation mapper |
| `safety.visibility_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A | cold；pre-façade resolve | R | missing/unresolved fail closed；NotVisible不变Missing | query/resolver mapper |
| `safety.body_free_scanner_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A | cold；pre-façade resolve | R | missing/unresolved fail assembly；无Disabled | intake/resolver/fixture validator |

#### 8.9.2 `stores` / `digest` / `idempotency` / `projection`

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `stores.<observation,projection,idempotency_result,job_execution>.mode` | enum `in_memory/durable` | 无 | 是 | JSON+ENV | A | cold adapter construction | N | profile mismatch/capability mismatch fail assembly | infra repositories/UoW/builder |
| `stores.<...>.binding_ref` | string or null `StoreBindingRef` | 无；explicit null/value | 是；Durable必须value，InMemory必须null | JSON+ENV | A | cold；adapter-private resolution | S-L | invalid/missing/ref resolution fail；no in-memory fallback | infra store constructors |
| `stores.transaction_timeout_ms` | positive u64 ms | 无；baseline 10000 | 是 | JSON+ENV | A/J | cold；UoW parameter | N | range invalid fail；runtime timeout按commit-unknown分类 | UoW manager/application flow |
| `stores.required_schema_revision` | positive u64 revision | 无；P0 exact 1 | 是 | JSON+ENV | A | cold capability gate | N | mismatch=`StoreCompatibilityMismatch`；no auto migration | store schema validator |
| `digest.write_profile` | enum `v1` | `v1` DECL | 否 | DECL/JSON | A/J/H | cold；new material writer | N | unknown/in-use incompatibility fail assembly | canonical serializer/loaders |
| `digest.readable_profiles` | canonical set，P0 `[v1]` | `[v1]` DECL | 否 | DECL/JSON | A/J/H | cold；retained material readers | N | missing write/in-use profile fail；never recompute old digest | result/outbox/plan/intent loaders |
| `idempotency.command_reservation_ms` | positive u64 ms | 无；baseline 86400000 | 是 | JSON+ENV | A | cold；new reservation | N | range/window invalid fail；no source cleanup authority | idempotency/result store |
| `idempotency.consumer_dedup_ms` | positive u64 ms | 无；baseline 604800000 | 是 | JSON+ENV | A | cold；new Consumer reservation | N | range/window invalid fail；duplicate identity retained | worker/idempotency store |
| `idempotency.job_reservation_ms` | positive u64 ms | 无；baseline 604800000 | 是 | JSON+ENV | A/J | cold；new Job snapshot | N | shorter than job lifecycle fail；resume old snapshot only | Job plan/result store |
| `idempotency.reserved_reconciliation_age_ms` | positive u64 ms | 无；baseline 3600000 | 是 | JSON+ENV | A | cold selector input | N | cross-window invalid fail；age never means rollback | reconciliation selector |
| `idempotency.external_intent_ms` | positive u64 ms | 无；baseline 2592000000 | 是 | JSON+ENV | A/J/H | cold；new intent retention | N | shorter than job/probe window fail；old intent preserved | handoff/export/publication intent stores |
| `projection.max_source_items_per_capture` | positive u32 | 无；baseline 1000 | 是 | JSON+ENV | A/J | cold；Job snapshot | N | overflow whole item/start failure；no truncation | projection source reader |
| `projection.max_relation_closure_items` | positive u32 | 无；baseline 5000 | 是 | JSON+ENV | A/J | cold；Job snapshot | N | closure overflow rollback/no Fresh | membership planner |
| `projection.default_rebuild_batch` | positive u32 | 无；baseline 100 | 是 | JSON+ENV | A/J | cold；new Job default,request may narrow | N | invalid/over-hard reject Job start | read-model rebuild planner |
| `projection.default_refresh_batch` | positive u32 | 无；baseline 100 | 是 | JSON+ENV | A/J | cold；new Job default | N | invalid/over-hard reject Job start | reference refresh planner |
| `projection.default_gap_scan_batch` | positive u32 | 无；baseline 100 | 是 | JSON+ENV | A/J | cold；new Job default | N | invalid/over-hard reject；no partial complete | gap scan planner |
| `projection.default_rollup_batch` | positive u32 | 无；baseline 500 | 是 | JSON+ENV | A/J | cold；new Job default | N | invalid/over-hard reject；stored signals only | rollup planner |
| `projection.freshness_policy_ref` | `PolicyBindingRef` string | 无 | 是 | JSON+ENV | A/J | cold；policy resolve and snapshot | R | missing/unresolved fail；never inline rebuild/default Fresh | query/projection assembler |

#### 8.9.3 `execution`

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `execution.claim_lease.lease_duration_ms` | positive u64 ms | 无；baseline 30000 | 是 | JSON only | A/J | cold；new Job snapshot | N | range invalid fail；durable claim capability required | Job execution repository/runners |
| `execution.claim_lease.heartbeat_interval_ms` | positive u64 ms | 无；baseline 10000 | 是 | JSON only | A/J | cold；new Job snapshot | N | `>= lease`或range invalid fail | claim heartbeat/fence validator |
| `execution.max_parallelism` | positive u32 | `1` DECL | 否 | DECL/JSON+ENV | A/J | cold；new Job snapshot | N | >32/zero fail；不关闭claim/fence | maintenance/publication services |
| `execution.max_plan_items` | positive u32 | 无；baseline 10000 | 是 | JSON+ENV | A/J | cold；Job start freeze | N | overflow/invalid rollback start；no partial plan | Job planners |
| `execution.<resolver,publication,handoff,export>_retry.max_additional_attempts` | u32 0..5 | `0` DECL | 否；四对象均存在 | DECL/JSON only | A/J/H | cold；new Job snapshot | N | invalid fail；recovery class仍可禁止retry | resolver/publisher/delivery wrappers |
| `execution.<...>_retry.backoff.initial_delay_ms` | positive u64 ms | 无；baseline 500 | 是 | JSON only | A/J/H | cold；new Job snapshot | N | invalid fail；attempts=0时inert | retry scheduler |
| `execution.<...>_retry.backoff.maximum_delay_ms` | positive u64 ms | 无；baseline 30000 | 是 | JSON only | A/J/H | cold；new Job snapshot | N | `< initial`/range invalid fail | retry scheduler |
| `execution.<...>_retry.backoff.multiplier_milli` | u32 ratio | 无；baseline 2000 | 是 | JSON only | A/J/H | cold；new Job snapshot | N | outside 1000..10000 fail | retry scheduler |
| `execution.<...>_retry.backoff.jitter_ratio_milli` | u16 ratio | 无；baseline 200 | 是 | JSON only | A/J/H | cold；new Job snapshot | N | >1000 fail；不得由provider改写 | retry scheduler |
| `execution.job_timeout_ms` | positive u64 ms | 无；baseline 300000 | 是 | JSON+ENV | A/E/J | cold；jobs slice/new Job | N | range invalid fail；runtime timeout不证明external abort | jobs invocation wrapper |

四个retry object必须分别完整出现。相同baseline不表示共享mutable policy：每个family独立进入Job snapshot，`Unknown/Unsupported`、commit unknown、state conflict和no-write guard仍可把remaining budget降为不可执行；配置不能反向授权blind retry。

#### 8.9.4 `external` / `entries`

Root adapter slot是`observation_source`、`runtime_sandbox`、`governance_artifact`、`subject_context`、`event_publisher`；catalog adapter slot是`report_handoff_targets[].adapter`、`peripheral_export_targets[].adapter`。后两类作为whole catalog只允许JSON。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `external.<root_adapter>.mode` | enum `fake/controlled/endpoint/disabled` | 无 | 是 | JSON+ENV | A | cold adapter construction | N | profile/family mismatch=`InvalidConfiguration` | infra adapter registry |
| `external.<root_adapter>.binding_ref` | `AdapterBindingRef` string or null | 无；explicit null/value | 是；mode条件 | JSON+ENV | A | cold；selected adapter resolution | R | required missing/unresolved fail；Disabled必须null | infra adapter constructor |
| `external.<root_adapter>.credential_ref` | `CredentialRef` string or null | 无；explicit null/value | 是；Endpoint/provider条件 | JSON+ENV locator only | A | cold；stage5 private resolution | S-L | raw material/required locator missing=`SensitiveReferenceUnavailable` | infra secret boundary/adapter |
| `external.<root_adapter>.call_timeout_ms` | positive u64 ms | 无；resolver baseline 5000，publisher 10000 | 是 | JSON+ENV | A/J/H | cold；safe catalog / snapshot | N | invalid fail；timeout按formal outcome，无fallback | resolver/publisher wrappers |
| `external.<root_adapter>.effect_capabilities` | canonical capability array | 无 | 是；resolver=`[]`，publisher=exact Publication | JSON only | A/J/H | cold descriptor gate | N | duplicate/missing/overclaim=`RequiredCapabilityMissing` | runtime builder/safe catalog |
| `external.outbound_event_targets` | array `OutboundEventTargetBindingConfig` | 无 | 是；可空仅在无enabled producer surface | JSON only | A/H | cold；future accepted snapshot | R | enabled event missing/duplicate target=`EntryBindingIncomplete` | publisher registry/application catalog |
| `external.outbound_event_targets[].event_name` | enum 12 outbound names | 无 | 每entry是 | JSON only | A/H | cold；subject key | N | unknown/duplicate fail assembly | contracts/publisher registry |
| `external.outbound_event_targets[].effect_binding_ref` | `ExternalEffectBindingRef` string | 无 | 每entry是 | JSON only | A/J/H | cold；accepted UoW freezes | R | missing/unresolvable historical binding blocks effect | application outbox/publisher |
| `external.outbound_event_targets[].transport_binding_ref` | `TransportBindingRef` string | 无 | 每entry是 | JSON only | A | cold；infra route only | S-L | missing/unresolved fail publisher assembly；not public/digest | infra publisher adapter |
| `external.report_handoff_targets` | array `ReportHandoffTargetBindingConfig` | 无 | 是；array可空 | JSON only | A/J/H | cold；new intent target catalog | R | duplicate typed consumer/effect mismatch fail；missing exact target unavailable | handoff registry/service |
| `external.report_handoff_targets[].consumer_ref` | `ReportConsumerRef` string | 无 | 每entry是 | JSON only | A/J/H | cold；typed subject | R | empty/wrong wrapper/duplicate fail | contracts/handoff service |
| `external.report_handoff_targets[].effect_binding_ref` | `ExternalEffectBindingRef` string | 无 | 每entry是 | JSON only | A/J/H | cold；intent/token pins | R | missing old binding manual/unavailable；no reroute | handoff service/adapter |
| `external.report_handoff_targets[].adapter` | `ExternalAdapterBindingConfig` object | 无 | 每entry是 | JSON only | A/J/H | cold；new target construction | mixed | invalid mode/phase/locator fail；receipt not signoff | infra handoff adapter |
| `external.peripheral_export_targets` | array `PeripheralExportTargetBindingConfig` | 无 | 是；array可空 | JSON only | A/J/H | cold；new intent target catalog | R | duplicate typed consumer/effect mismatch fail；unrelated core continues | export registry/service |
| `external.peripheral_export_targets[].consumer_ref` | `PeripheralConsumerRef` string | 无 | 每entry是 | JSON only | A/J/H | cold；typed subject | R | empty/wrong wrapper/duplicate fail | contracts/peripheral service |
| `external.peripheral_export_targets[].effect_binding_ref` | `ExternalEffectBindingRef` string | 无 | 每entry是 | JSON only | A/J/H | cold；intent/token pins | R | missing old binding manual/unavailable；no current default | export service/adapter |
| `external.peripheral_export_targets[].adapter` | `ExternalAdapterBindingConfig` object | 无 | 每entry是 | JSON only | A/J/H | cold；new target construction | mixed | invalid mode/phase/locator fail；Delivered not verdict | infra export adapter |
| `entries.enabled_commands` | canonical set `ObservationCommandOperation` | 无；无implicit all | 是；array可空 | JSON only | A/E | cold route registration | N | unknown/duplicate/static-map gap fail API root | API composition root |
| `entries.enabled_queries` | canonical set `ObservationQueryOperation` | 无；无implicit all | 是；array可空 | JSON only | A/E | cold route registration | N | unknown/duplicate/static-map gap fail API root | API composition root |
| `entries.inbound_consumers` | array `InboundConsumerBindingConfig` | 无 | 是；array可空 | JSON only | A/E | cold worker registration | mixed | operation duplicate/producer/schema/actor gap fail worker root | worker composition root |
| `entries.inbound_consumers[].operation` | enum 9 Consumer operations | 无 | 每entry是 | JSON only | A/E | cold route key | N | unknown/duplicate fail | worker/contracts |
| `entries.inbound_consumers[].producer_family` | enum `ObservationProducerFamily` | 无 | 每entry是 | JSON only | A/E/H | cold identity namespace | N | must equal static 9-map；mismatch pre-payload reject/startup fail | worker/idempotency/source comparator |
| `entries.inbound_consumers[].transport_binding_ref` | `TransportBindingRef` string | 无 | 每entry是 | JSON only | A/E | cold infra registration | S-L | unresolved fail worker root；no fallback resolver | infra consumer adapter |
| `entries.inbound_consumers[].accepted_schema_versions` | non-empty set `SchemaVersion` | 无 | 每entry是 | JSON only | A/E | cold header gate | N | P0非`[v1]`/not subset root fail；unknown payload unparsed | worker schema router |
| `entries.inbound_consumers[].actor_mapping_policy_ref` | `PolicyBindingRef` string | 无 | 每entry是 | JSON only | A/E | cold system actor mapper | R | unresolved/ambiguous actor fail worker root | worker/context factory |
| `entries.enabled_jobs` | canonical set `ObservationJobOperation` | 无；无implicit all | 是；array可空 | JSON only | A/E/J | cold runner registration | N | unknown/duplicate/required store/capability gap fail jobs root | jobs composition root |
| `entries.job_schedules` | array `JobScheduleBindingConfig` | 无；explicit `[]`允许 | 是 | JSON only | A/E | cold scheduler registration | R | duplicate op/unknown schedule ref fail；empty仍operator-callable | jobs/scheduler root |
| `entries.job_schedules[].operation` | `ObservationJobOperation` | 无 | 每entry是 | JSON only | A/E | cold schedule key | N | must be enabled job；duplicate fail | jobs root |
| `entries.job_schedules[].schedule_binding_ref` | `ScheduleBindingRef` string | 无 | 每entry是 | JSON only | A/E | cold trigger binding | R | unresolved disables/fails configured schedule；不生成actor/key/input | infra scheduler adapter |
| `entries.outbox_loop_cadence_ms` | positive u64 ms | 无；baseline 1000 | 是 | JSON+ENV | A/E | cold worker loop slice | N | invalid fail worker root；不改变outbox eligibility | worker outbox loop |
| `entries.outbox_loop_candidate_limit` | positive u32 | 无；baseline 100 | 是 | JSON+ENV | A/E | cold worker loop slice | N | invalid fail worker root；no truncation-as-complete | worker/publication service |

### 8.10 Reusable nested object schema 与 finite inventory

#### 8.10.1 Nested object leaf schema

| Object / field | Raw JSON type | Default / required | Source / sensitivity | Validation | Failure / consumer |
|---|---|---|---|---|---|
| `StoreAdapterBindingConfig.mode` | enum string | no default；required | root JSON+ENV；N | InMemory only LocalTest；Durable all classes | invalid/profile/capability fail；store builder |
| `StoreAdapterBindingConfig.binding_ref` | string or null | explicit；Durable value / InMemory null | root JSON+ENV；S-L | non-empty opaque；not raw DSN | resolution/schema/atomicity fail；store builder |
| `ClaimLeaseConfig.lease_duration_ms` | integer | required | JSON；N | §8.8 range | fail assembly；Job claim store |
| `ClaimLeaseConfig.heartbeat_interval_ms` | integer | required | JSON；N | §8.8 range and `< lease` | fail assembly；runner heartbeat |
| `RetryBackoffConfig.initial_delay_ms` | integer | required | JSON；N | §8.8 range | fail assembly；retry scheduler |
| `RetryBackoffConfig.maximum_delay_ms` | integer | required | JSON；N | `>= initial` and §8.8 range | fail assembly；retry scheduler |
| `RetryBackoffConfig.multiplier_milli` | integer | required | JSON；N | 1000..10000 | fail assembly；retry scheduler |
| `RetryBackoffConfig.jitter_ratio_milli` | integer | required | JSON；N | 0..1000 | fail assembly；retry scheduler |
| `RetryPolicyConfig.max_additional_attempts` | integer | DECL 0；optional leaf | DECL/JSON；N | 0..5；first attempt excluded | fail assembly；family wrapper |
| `RetryPolicyConfig.backoff` | strict object | required | JSON；N | all four leaves complete | fail assembly；Job snapshot |
| `ExternalEffectCapabilityConfig.phase` | enum string | required | JSON；N | family exact phase set | descriptor mismatch fail；safe catalog |
| `.stable_token` | `enforced/not_guaranteed` | required | JSON；N | capability must match adapter descriptor | overclaim fail；external effect preflight |
| `.probe` | `supported/unsupported` | required | JSON；N | descriptor match；Unsupported not negative outcome | overclaim fail/manual；external effect preflight |
| `ExternalAdapterBindingConfig.mode` | enum string | required | root JSON+ENV/catalog JSON；N | profile + family mode matrix | invalid config；runtime builder |
| `.binding_ref` | string or null | explicit；mode conditional | root JSON+ENV/catalog JSON；R | Fake/Controlled/Endpoint value；Disabled null | construction fail；infra adapter |
| `.credential_ref` | string or null | explicit；provider conditional | root JSON+ENV locator/catalog JSON；S-L | Fake/Disabled null；Endpoint as required | sensitive resolution fail；infra private memory |
| `.call_timeout_ms` | integer | required | root JSON+ENV/catalog JSON；N | §8.8 + `< job timeout` where effect Job | invalid config；adapter wrapper |
| `.effect_capabilities` | array | required | JSON；N | resolver `[]`;publisher Publication;handoff/export exact two phases | capability mismatch fail；safe catalog |
| `OutboundEventTargetBindingConfig` | strict 3-field object | every field required | JSON；R/S-L mix | event unique；enabled totality；refs non-empty | entry/catalog failure；publisher |
| `ReportHandoffTargetBindingConfig` | strict 3-field object | every field required | JSON；R/mixed | consumer unique；adapter phases handoff prep+delivery | catalog failure；handoff service |
| `PeripheralExportTargetBindingConfig` | strict 3-field object | every field required | JSON；R/mixed | consumer unique；adapter phases export prep+delivery | catalog failure；export service |
| `InboundConsumerBindingConfig` | strict 5-field object | every field required | JSON；mixed | operation unique；producer static map；schema `[v1]`;actor policy valid | worker root failure；consumer/context/idempotency |
| `JobScheduleBindingConfig` | strict 2-field object | every field required | JSON；R | operation enabled/unique；ref non-empty | schedule registration failure；jobs root |

#### 8.10.2 Finite wire inventory

| Family | Exact raw tokens |
|---|---|
| runtime class | `local_test`;`integration_like`;`runtime_like` |
| clock / ID mode | `system`;`fixed` / `runtime`;`deterministic` |
| store / external mode | `in_memory`;`durable` / `fake`;`controlled`;`endpoint`;`disabled` |
| schema / digest | `v1` / `v1`（不同typed owner，不互转） |
| source / producer family | `bus`;`source_owner`;`identity`;`governance`;`artifact`;`runtime`;`sandbox`;`archive`;`report_consumer` |
| effect phase | `publication`;`handoff_preparation`;`handoff_delivery`;`export_preparation`;`export_delivery` |
| stable token / probe | `enforced`;`not_guaranteed` / `supported`;`unsupported` |
| Command | `submit_observation_material`;`record_safety_disposition`;`bind_correlation_context`;`record_safe_signal`;`append_audit_projection`;`link_body_free_evidence`;`prepare_report_handoff`;`evaluate_authenticity_hint`;`set_retention_marker`;`protect_active_reference`;`define_replay_scope`;`record_no_write_violation`;`record_gap_state`;`prepare_external_audit_export`;`register_reference_snapshot`;`update_reference_snapshot_state` |
| Query | `get_observation_receipt`;`get_intake_status`;`get_safe_signal`;`get_signal_rollup`;`get_audit_timeline`;`get_evidence_index_input`;`get_report_handoff`;`get_retention_protection`;`get_observation_read_model`;`get_diagnostic_view`;`get_gap_status`;`get_peripheral_export_view`;`get_reference_snapshot_view`;`get_rebuild_progress` |
| Inbound Consumer | `consume_bus_observation_material`;`consume_source_audit_material`;`consume_identity_observation_context`;`consume_governance_audit_context`;`consume_artifact_evidence_context`;`consume_runtime_signal_summary`;`consume_sandbox_signal_summary`;`consume_archive_handoff_feedback`;`consume_report_consumer_feedback` |
| Outbound Event | `observation_receipt_changed`;`safety_disposition_changed`;`safe_signal_recorded`;`audit_projection_appended`;`evidence_linkage_changed`;`report_handoff_changed`;`retention_marker_changed`;`no_write_violation_recorded`;`gap_state_changed`;`reference_snapshot_changed`;`derived_projection_changed`;`peripheral_delivery_changed` |
| Job | `publish_observation_outbox`;`rebuild_observation_read_models`;`rebuild_signal_rollups`;`refresh_reference_snapshots`;`scan_observation_gaps`;`coordinate_observation_replay`;`prepare_report_handoff_delivery`;`prepare_external_audit_export_delivery`;`rebuild_peripheral_views` |

#### 8.10.3 Cardinality、totality 与系统聚合映射

| Collection | Cardinality / totality rule |
|---|---|
| schema/readable/source/operation sets | explicit array；typed sorted/unique；schema/source required non-empty；enabled operation set可empty但无implicit all |
| inbound Consumer bindings | zero or one entry per enabled operation；every listed operation must match exact producer map and `[v1]`;unlisted operation不注册、不consume、不ack |
| outbound event targets | every event that an enabled accepted flow may emit must have exactly one target beforewrite façade exposure；full exemplar maps all 12 |
| report/peripheral targets | typed consumer unique；array可empty；missing requested exact consumer returns formal unavailable/blocked，不污染unrelated core truth |
| job schedules | zero or one schedule per enabled Job；`[]`合法且Job仍可由完整protocol request调用 |
| external capabilities | resolver empty；publisher exactly Publication；handoff target exactly HandoffPreparation+HandoffDelivery；export target exactly ExportPreparation+ExportDelivery |

项目本地path保持如`execution.max_parallelism`。若未来系统聚合器承载多项目，只允许机械映射为`l4_observability.execution.max_parallelism`、`l4_observability.external.outbound_event_targets`等；聚合层不得改token、merge、source priority、requiredness、identity或historical binding规则，也不表示current loader已支持该外层对象。

### 8.11 模块级 strict JSON demo 与作用说明

所有`demo:*` string都是文档用opaque ref示例，只证明raw shape与type可解析，不证明adapter、store、transport、policy、consumer、environment或credential存在。模块demo是strict JSON，不含注释；注释只允许出现在§8.12的JSONC文档示例。

#### 8.11.1 `profile` / `technical`

```json
{
  "profile": "local_test",
  "technical": {
    "clock_mode": "fixed",
    "clock_binding_ref": "demo:adapter:clock:fixed:v1",
    "id_generator_mode": "deterministic",
    "id_generator_binding_ref": "demo:adapter:id:deterministic:v1"
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `profile` | enum | `local_test` / no default | 选择formal runtime class | 必须显式；不从lane/binary推断 | unknown或mode mismatch fail assembly |
| `technical.clock_*` | enum + optional ref | `fixed` + demo ref / no default | 构造clock adapter | Fixed仅LocalTest；selected binding必须可构造 | invalid/unresolved fail assembly |
| `technical.id_generator_*` | enum + optional ref | `deterministic` + demo ref / no default | 构造ID adapter | Deterministic仅LocalTest；不生成业务identity | invalid/unresolved fail assembly |

#### 8.11.2 `boundary` / `safety`

```json
{
  "boundary": {
    "max_request_body_bytes": 262144,
    "default_page_limit": 50,
    "max_page_limit": 200,
    "query_read_timeout_ms": 5000,
    "accepted_inbound_schema_versions": [
      "v1"
    ]
  },
  "safety": {
    "redaction_policy_ref": "demo:policy:redaction:v1",
    "source_family_allowlist": [
      "bus",
      "source_owner",
      "identity",
      "governance",
      "artifact",
      "runtime",
      "sandbox",
      "archive",
      "report_consumer"
    ],
    "safe_label_policy_ref": "demo:policy:safe-label:v1",
    "correlation_mapping_policy_ref": "demo:policy:correlation:v1",
    "visibility_policy_ref": "demo:policy:visibility:v1",
    "body_free_scanner_policy_ref": "demo:policy:body-free:v1"
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `boundary.*` numeric | positive integer | §8.8 baseline / no default | pre-dispatch size/page/timeout guard | hard range；default page <= max page | candidate invalid fail；request超界reject/no-write |
| `boundary.accepted_inbound_schema_versions` | enum set | `["v1"]` / no default | header schema gate | P0 exact `[v1]`；duplicate/unknown拒绝 | worker root不暴露；input payload不parse |
| `safety.source_family_allowlist` | enum set | all 9 / no default | 限制可进入观测面的source family | 不扩大Step08 Consumer compatibility | invalid candidate fail；input reject/quarantine |
| five `safety.*_policy_ref` | opaque ref | `demo:policy:*` / no default | 注入existing safety policy | non-empty；body-free scanner无Disabled | unresolved fail closed；无fallback policy |

#### 8.11.3 `stores` / `digest` / `idempotency`

```json
{
  "stores": {
    "observation": {
      "mode": "in_memory",
      "binding_ref": null
    },
    "projection": {
      "mode": "in_memory",
      "binding_ref": null
    },
    "idempotency_result": {
      "mode": "in_memory",
      "binding_ref": null
    },
    "job_execution": {
      "mode": "in_memory",
      "binding_ref": null
    },
    "transaction_timeout_ms": 10000,
    "required_schema_revision": 1
  },
  "digest": {
    "write_profile": "v1",
    "readable_profiles": [
      "v1"
    ]
  },
  "idempotency": {
    "command_reservation_ms": 86400000,
    "consumer_dedup_ms": 604800000,
    "job_reservation_ms": 604800000,
    "reserved_reconciliation_age_ms": 3600000,
    "external_intent_ms": 2592000000
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| four `stores.*` objects | mode + nullable ref | InMemory/null / no default | 选择logical store adapter | InMemory仅LocalTest；Durable必须ref；atomic/fence parity | profile/schema/capability mismatch fail assembly |
| `stores.transaction_timeout_ms` | positive ms | 10000 / no default | UoW timeout parameter | timeout不证明rollback | invalid fail；runtime按commit unknown分类 |
| `stores.required_schema_revision` | revision | 1 / no default | store compatibility gate | P0 exact 1；no auto migration | mismatch fail assembly |
| `digest.*` | version + set | `v1/[v1]` / DECL same | stable digest write/read compatibility | schema v1不等digest v1；in-use profile不可移除 | unknown/missing retained profile fail/manual |
| `idempotency.*` | positive ms | §8.8 baselines / no default | reservation/dedup/reconciliation/intent retention | cross-window rules；不授权source cleanup | candidate invalid fail；old material保留 |

#### 8.11.4 `projection` / `execution`

```json
{
  "projection": {
    "max_source_items_per_capture": 1000,
    "max_relation_closure_items": 5000,
    "default_rebuild_batch": 100,
    "default_refresh_batch": 100,
    "default_gap_scan_batch": 100,
    "default_rollup_batch": 500,
    "freshness_policy_ref": "demo:policy:freshness:v1"
  },
  "execution": {
    "claim_lease": {
      "lease_duration_ms": 30000,
      "heartbeat_interval_ms": 10000
    },
    "max_parallelism": 1,
    "max_plan_items": 10000,
    "resolver_retry": {
      "max_additional_attempts": 0,
      "backoff": {
        "initial_delay_ms": 500,
        "maximum_delay_ms": 30000,
        "multiplier_milli": 2000,
        "jitter_ratio_milli": 200
      }
    },
    "publication_retry": {
      "max_additional_attempts": 0,
      "backoff": {
        "initial_delay_ms": 500,
        "maximum_delay_ms": 30000,
        "multiplier_milli": 2000,
        "jitter_ratio_milli": 200
      }
    },
    "handoff_retry": {
      "max_additional_attempts": 0,
      "backoff": {
        "initial_delay_ms": 500,
        "maximum_delay_ms": 30000,
        "multiplier_milli": 2000,
        "jitter_ratio_milli": 200
      }
    },
    "export_retry": {
      "max_additional_attempts": 0,
      "backoff": {
        "initial_delay_ms": 500,
        "maximum_delay_ms": 30000,
        "multiplier_milli": 2000,
        "jitter_ratio_milli": 200
      }
    },
    "job_timeout_ms": 300000
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| six projection limits | positive count | §8.8 baselines / no default | bounded capture/closure/Job planning | closure >= capture；Job input只收窄 | overflow whole boundary fail；no false Fresh |
| `projection.freshness_policy_ref` | opaque ref | demo ref / no default | 注入fresh/stale classification | 只分类，不触发rebuild | unresolved fail closed |
| `execution.claim_lease` | duration object | 30000/10000 / no default | durable claim/heartbeat | heartbeat < lease；fence永不关闭 | invalid/capability mismatch fail |
| `execution.max_parallelism` | positive count | 1 / DECL 1 | bounded worker concurrency | 1..32；claim/fence/CAS仍required | invalid candidate fail |
| `execution.max_plan_items` / `job_timeout_ms` | positive count/ms | 10000/300000 / no default | plan和invocation hard budget | no partial plan；timeout不证明abort | invalid/rejected start；unknown manual |
| four retry objects | policy object | additional attempts 0 / DECL 0 | known-failure retry budget | backoff合法；formal recovery + frozen budget双门禁 | invalid fail；Unknown/Unsupported无blind retry |

#### 8.11.5 `external`

```json
{
  "external": {
    "observation_source": {
      "mode": "fake",
      "binding_ref": "demo:adapter:observation-source:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "runtime_sandbox": {
      "mode": "fake",
      "binding_ref": "demo:adapter:runtime-sandbox:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "governance_artifact": {
      "mode": "fake",
      "binding_ref": "demo:adapter:governance-artifact:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "subject_context": {
      "mode": "fake",
      "binding_ref": "demo:adapter:subject-context:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "event_publisher": {
      "mode": "fake",
      "binding_ref": "demo:adapter:event-publisher:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 10000,
      "effect_capabilities": [
        {
          "phase": "publication",
          "stable_token": "enforced",
          "probe": "supported"
        }
      ]
    },
    "outbound_event_targets": [
      {
        "event_name": "observation_receipt_changed",
        "effect_binding_ref": "demo:effect:event:observation-receipt-changed:v1",
        "transport_binding_ref": "demo:transport:event:observation-receipt-changed:v1"
      },
      {
        "event_name": "safety_disposition_changed",
        "effect_binding_ref": "demo:effect:event:safety-disposition-changed:v1",
        "transport_binding_ref": "demo:transport:event:safety-disposition-changed:v1"
      },
      {
        "event_name": "safe_signal_recorded",
        "effect_binding_ref": "demo:effect:event:safe-signal-recorded:v1",
        "transport_binding_ref": "demo:transport:event:safe-signal-recorded:v1"
      },
      {
        "event_name": "audit_projection_appended",
        "effect_binding_ref": "demo:effect:event:audit-projection-appended:v1",
        "transport_binding_ref": "demo:transport:event:audit-projection-appended:v1"
      },
      {
        "event_name": "evidence_linkage_changed",
        "effect_binding_ref": "demo:effect:event:evidence-linkage-changed:v1",
        "transport_binding_ref": "demo:transport:event:evidence-linkage-changed:v1"
      },
      {
        "event_name": "report_handoff_changed",
        "effect_binding_ref": "demo:effect:event:report-handoff-changed:v1",
        "transport_binding_ref": "demo:transport:event:report-handoff-changed:v1"
      },
      {
        "event_name": "retention_marker_changed",
        "effect_binding_ref": "demo:effect:event:retention-marker-changed:v1",
        "transport_binding_ref": "demo:transport:event:retention-marker-changed:v1"
      },
      {
        "event_name": "no_write_violation_recorded",
        "effect_binding_ref": "demo:effect:event:no-write-violation-recorded:v1",
        "transport_binding_ref": "demo:transport:event:no-write-violation-recorded:v1"
      },
      {
        "event_name": "gap_state_changed",
        "effect_binding_ref": "demo:effect:event:gap-state-changed:v1",
        "transport_binding_ref": "demo:transport:event:gap-state-changed:v1"
      },
      {
        "event_name": "reference_snapshot_changed",
        "effect_binding_ref": "demo:effect:event:reference-snapshot-changed:v1",
        "transport_binding_ref": "demo:transport:event:reference-snapshot-changed:v1"
      },
      {
        "event_name": "derived_projection_changed",
        "effect_binding_ref": "demo:effect:event:derived-projection-changed:v1",
        "transport_binding_ref": "demo:transport:event:derived-projection-changed:v1"
      },
      {
        "event_name": "peripheral_delivery_changed",
        "effect_binding_ref": "demo:effect:event:peripheral-delivery-changed:v1",
        "transport_binding_ref": "demo:transport:event:peripheral-delivery-changed:v1"
      }
    ],
    "report_handoff_targets": [
      {
        "consumer_ref": "demo:consumer:archive:v1",
        "effect_binding_ref": "demo:effect:handoff:archive:v1",
        "adapter": {
          "mode": "fake",
          "binding_ref": "demo:adapter:handoff:archive:fake:v1",
          "credential_ref": null,
          "call_timeout_ms": 10000,
          "effect_capabilities": [
            {
              "phase": "handoff_preparation",
              "stable_token": "enforced",
              "probe": "supported"
            },
            {
              "phase": "handoff_delivery",
              "stable_token": "enforced",
              "probe": "supported"
            }
          ]
        }
      }
    ],
    "peripheral_export_targets": [
      {
        "consumer_ref": "demo:consumer:external-audit:v1",
        "effect_binding_ref": "demo:effect:export:external-audit:v1",
        "adapter": {
          "mode": "fake",
          "binding_ref": "demo:adapter:export:external-audit:fake:v1",
          "credential_ref": null,
          "call_timeout_ms": 10000,
          "effect_capabilities": [
            {
              "phase": "export_preparation",
              "stable_token": "enforced",
              "probe": "supported"
            },
            {
              "phase": "export_delivery",
              "stable_token": "enforced",
              "probe": "supported"
            }
          ]
        }
      }
    ]
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| four resolver objects | external adapter object | Fake demo refs / no default | 构造body-free resolver | LocalTest Fake；credential null；capabilities empty | invalid/unresolved fail or formal unavailable；no default truth |
| `event_publisher` | external adapter object | Fake + Publication capability / no default | 构造publisher | exact one Publication phase；descriptor match | assembly fail or publisher unavailable；outbox retained |
| `outbound_event_targets` | 12 typed entries | all 12 / no default | event -> immutable effect + infra transport | enabled subject exactly one；catalog whole JSON | missing/duplicate fail before write façade；old event no reroute |
| `report_handoff_targets` | typed catalog | one demo archive consumer / no default | report consumer target selection | typed ref unique；exact two handoff phases | missing exact target blocked/unavailable；receipt not signoff |
| `peripheral_export_targets` | typed catalog | one demo external-audit consumer / no default | peripheral target selection | typed ref unique；exact two export phases | target isolated；Delivered not verdict/truth |
| all `credential_ref` | nullable sensitive locator | null / no implicit default | selected Endpoint credential indirection | Fake/Disabled must null；raw secret forbidden | selected required locator unavailable blocks assembly |

#### 8.11.6 `entries`

```json
{
  "entries": {
    "enabled_commands": [
      "submit_observation_material",
      "record_safety_disposition",
      "bind_correlation_context",
      "record_safe_signal",
      "append_audit_projection",
      "link_body_free_evidence",
      "prepare_report_handoff",
      "evaluate_authenticity_hint",
      "set_retention_marker",
      "protect_active_reference",
      "define_replay_scope",
      "record_no_write_violation",
      "record_gap_state",
      "prepare_external_audit_export",
      "register_reference_snapshot",
      "update_reference_snapshot_state"
    ],
    "enabled_queries": [
      "get_observation_receipt",
      "get_intake_status",
      "get_safe_signal",
      "get_signal_rollup",
      "get_audit_timeline",
      "get_evidence_index_input",
      "get_report_handoff",
      "get_retention_protection",
      "get_observation_read_model",
      "get_diagnostic_view",
      "get_gap_status",
      "get_peripheral_export_view",
      "get_reference_snapshot_view",
      "get_rebuild_progress"
    ],
    "inbound_consumers": [
      {
        "operation": "consume_bus_observation_material",
        "producer_family": "bus",
        "transport_binding_ref": "demo:transport:consumer:bus:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_source_audit_material",
        "producer_family": "source_owner",
        "transport_binding_ref": "demo:transport:consumer:source-audit:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_identity_observation_context",
        "producer_family": "identity",
        "transport_binding_ref": "demo:transport:consumer:identity:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_governance_audit_context",
        "producer_family": "governance",
        "transport_binding_ref": "demo:transport:consumer:governance:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_artifact_evidence_context",
        "producer_family": "artifact",
        "transport_binding_ref": "demo:transport:consumer:artifact:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_runtime_signal_summary",
        "producer_family": "runtime",
        "transport_binding_ref": "demo:transport:consumer:runtime:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_sandbox_signal_summary",
        "producer_family": "sandbox",
        "transport_binding_ref": "demo:transport:consumer:sandbox:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_archive_handoff_feedback",
        "producer_family": "archive",
        "transport_binding_ref": "demo:transport:consumer:archive:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      },
      {
        "operation": "consume_report_consumer_feedback",
        "producer_family": "report_consumer",
        "transport_binding_ref": "demo:transport:consumer:report-consumer:v1",
        "accepted_schema_versions": [
          "v1"
        ],
        "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"
      }
    ],
    "enabled_jobs": [
      "publish_observation_outbox",
      "rebuild_observation_read_models",
      "rebuild_signal_rollups",
      "refresh_reference_snapshots",
      "scan_observation_gaps",
      "coordinate_observation_replay",
      "prepare_report_handoff_delivery",
      "prepare_external_audit_export_delivery",
      "rebuild_peripheral_views"
    ],
    "job_schedules": [],
    "outbox_loop_cadence_ms": 1000,
    "outbox_loop_candidate_limit": 100
  }
}
```

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `enabled_commands` | enum set | all 16 / no default | API Command route registration | exact static name/body map；array explicit | unknown/duplicate/gap fail API root |
| `enabled_queries` | enum set | all 14 / no default | API Query route registration | exact `ObservationQueryOperation`;Query no reserve/write | unknown/duplicate/gap fail API root |
| `inbound_consumers` | typed catalog | all 9 / no default | worker consumer registration | one operation；exact producer map；schema `[v1]`;actor/transport refs | any mismatch fails worker root before consume/ack |
| `enabled_jobs` | enum set | all 9 / no default | jobs runner registration | required plan/store/claim/fence/capability totality | missing dependency fails jobs root；no process-lock fallback |
| `job_schedules` | typed catalog | `[]` / no default | optional automatic triggers | no schedule still protocol-callable；does not supply actor/key/input | configured invalid ref fails schedule registration |
| outbox loop fields | positive ms/count | 1000/100 / no default | resident publication scan cadence/bound | only scheduling/candidate selection | invalid fails worker root；does not altereligibility |

### 8.12 完整 JSONC 文档示例

下例用于文档说明一个`LocalTest + InMemory + Fake`完整candidate。实际运行配置必须删除所有`//`注释后作为strict JSON；current loader不因本示例获得JSONC支持。`demo:*`均为文档用opaque ref，不是产品、endpoint、topic、path、credential、真实run/evidence identity或环境ready声明。

```jsonc
{
  // Runtime class and technical adapters are explicit; lane/binary names do not infer them.
  "profile": "local_test",
  "technical": {
    "clock_mode": "fixed",
    "clock_binding_ref": "demo:adapter:clock:fixed:v1",
    "id_generator_mode": "deterministic",
    "id_generator_binding_ref": "demo:adapter:id:deterministic:v1"
  },

  // Limits are P0 candidate baselines, not SLO or capacity evidence.
  "boundary": {
    "max_request_body_bytes": 262144,
    "default_page_limit": 50,
    "max_page_limit": 200,
    "query_read_timeout_ms": 5000,
    "accepted_inbound_schema_versions": ["v1"]
  },
  "safety": {
    "redaction_policy_ref": "demo:policy:redaction:v1",
    "source_family_allowlist": [
      "bus",
      "source_owner",
      "identity",
      "governance",
      "artifact",
      "runtime",
      "sandbox",
      "archive",
      "report_consumer"
    ],
    "safe_label_policy_ref": "demo:policy:safe-label:v1",
    "correlation_mapping_policy_ref": "demo:policy:correlation:v1",
    "visibility_policy_ref": "demo:policy:visibility:v1",
    "body_free_scanner_policy_ref": "demo:policy:body-free:v1"
  },

  // InMemory/null is valid only for LocalTest; RuntimeLike requires qualified Durable bindings.
  "stores": {
    "observation": {"mode": "in_memory", "binding_ref": null},
    "projection": {"mode": "in_memory", "binding_ref": null},
    "idempotency_result": {"mode": "in_memory", "binding_ref": null},
    "job_execution": {"mode": "in_memory", "binding_ref": null},
    "transaction_timeout_ms": 10000,
    "required_schema_revision": 1
  },
  "digest": {
    "write_profile": "v1",
    "readable_profiles": ["v1"]
  },
  "idempotency": {
    "command_reservation_ms": 86400000,
    "consumer_dedup_ms": 604800000,
    "job_reservation_ms": 604800000,
    "reserved_reconciliation_age_ms": 3600000,
    "external_intent_ms": 2592000000
  },

  // Projection bounds fail whole planning/capture boundaries; they never authorize truncation-as-Fresh.
  "projection": {
    "max_source_items_per_capture": 1000,
    "max_relation_closure_items": 5000,
    "default_rebuild_batch": 100,
    "default_refresh_batch": 100,
    "default_gap_scan_batch": 100,
    "default_rollup_batch": 500,
    "freshness_policy_ref": "demo:policy:freshness:v1"
  },
  "execution": {
    "claim_lease": {
      "lease_duration_ms": 30000,
      "heartbeat_interval_ms": 10000
    },
    "max_parallelism": 1,
    "max_plan_items": 10000,
    "resolver_retry": {
      "max_additional_attempts": 0,
      "backoff": {"initial_delay_ms": 500, "maximum_delay_ms": 30000, "multiplier_milli": 2000, "jitter_ratio_milli": 200}
    },
    "publication_retry": {
      "max_additional_attempts": 0,
      "backoff": {"initial_delay_ms": 500, "maximum_delay_ms": 30000, "multiplier_milli": 2000, "jitter_ratio_milli": 200}
    },
    "handoff_retry": {
      "max_additional_attempts": 0,
      "backoff": {"initial_delay_ms": 500, "maximum_delay_ms": 30000, "multiplier_milli": 2000, "jitter_ratio_milli": 200}
    },
    "export_retry": {
      "max_additional_attempts": 0,
      "backoff": {"initial_delay_ms": 500, "maximum_delay_ms": 30000, "multiplier_milli": 2000, "jitter_ratio_milli": 200}
    },
    "job_timeout_ms": 300000
  },

  // Fake adapters are formal LocalTest seams. Null credentials are explicit and no raw secret is present.
  "external": {
    "observation_source": {
      "mode": "fake",
      "binding_ref": "demo:adapter:observation-source:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "runtime_sandbox": {
      "mode": "fake",
      "binding_ref": "demo:adapter:runtime-sandbox:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "governance_artifact": {
      "mode": "fake",
      "binding_ref": "demo:adapter:governance-artifact:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "subject_context": {
      "mode": "fake",
      "binding_ref": "demo:adapter:subject-context:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 5000,
      "effect_capabilities": []
    },
    "event_publisher": {
      "mode": "fake",
      "binding_ref": "demo:adapter:event-publisher:fake:v1",
      "credential_ref": null,
      "call_timeout_ms": 10000,
      "effect_capabilities": [
        {"phase": "publication", "stable_token": "enforced", "probe": "supported"}
      ]
    },
    "outbound_event_targets": [
      {"event_name": "observation_receipt_changed", "effect_binding_ref": "demo:effect:event:observation-receipt-changed:v1", "transport_binding_ref": "demo:transport:event:observation-receipt-changed:v1"},
      {"event_name": "safety_disposition_changed", "effect_binding_ref": "demo:effect:event:safety-disposition-changed:v1", "transport_binding_ref": "demo:transport:event:safety-disposition-changed:v1"},
      {"event_name": "safe_signal_recorded", "effect_binding_ref": "demo:effect:event:safe-signal-recorded:v1", "transport_binding_ref": "demo:transport:event:safe-signal-recorded:v1"},
      {"event_name": "audit_projection_appended", "effect_binding_ref": "demo:effect:event:audit-projection-appended:v1", "transport_binding_ref": "demo:transport:event:audit-projection-appended:v1"},
      {"event_name": "evidence_linkage_changed", "effect_binding_ref": "demo:effect:event:evidence-linkage-changed:v1", "transport_binding_ref": "demo:transport:event:evidence-linkage-changed:v1"},
      {"event_name": "report_handoff_changed", "effect_binding_ref": "demo:effect:event:report-handoff-changed:v1", "transport_binding_ref": "demo:transport:event:report-handoff-changed:v1"},
      {"event_name": "retention_marker_changed", "effect_binding_ref": "demo:effect:event:retention-marker-changed:v1", "transport_binding_ref": "demo:transport:event:retention-marker-changed:v1"},
      {"event_name": "no_write_violation_recorded", "effect_binding_ref": "demo:effect:event:no-write-violation-recorded:v1", "transport_binding_ref": "demo:transport:event:no-write-violation-recorded:v1"},
      {"event_name": "gap_state_changed", "effect_binding_ref": "demo:effect:event:gap-state-changed:v1", "transport_binding_ref": "demo:transport:event:gap-state-changed:v1"},
      {"event_name": "reference_snapshot_changed", "effect_binding_ref": "demo:effect:event:reference-snapshot-changed:v1", "transport_binding_ref": "demo:transport:event:reference-snapshot-changed:v1"},
      {"event_name": "derived_projection_changed", "effect_binding_ref": "demo:effect:event:derived-projection-changed:v1", "transport_binding_ref": "demo:transport:event:derived-projection-changed:v1"},
      {"event_name": "peripheral_delivery_changed", "effect_binding_ref": "demo:effect:event:peripheral-delivery-changed:v1", "transport_binding_ref": "demo:transport:event:peripheral-delivery-changed:v1"}
    ],
    "report_handoff_targets": [
      {
        "consumer_ref": "demo:consumer:archive:v1",
        "effect_binding_ref": "demo:effect:handoff:archive:v1",
        "adapter": {
          "mode": "fake",
          "binding_ref": "demo:adapter:handoff:archive:fake:v1",
          "credential_ref": null,
          "call_timeout_ms": 10000,
          "effect_capabilities": [
            {"phase": "handoff_preparation", "stable_token": "enforced", "probe": "supported"},
            {"phase": "handoff_delivery", "stable_token": "enforced", "probe": "supported"}
          ]
        }
      }
    ],
    "peripheral_export_targets": [
      {
        "consumer_ref": "demo:consumer:external-audit:v1",
        "effect_binding_ref": "demo:effect:export:external-audit:v1",
        "adapter": {
          "mode": "fake",
          "binding_ref": "demo:adapter:export:external-audit:fake:v1",
          "credential_ref": null,
          "call_timeout_ms": 10000,
          "effect_capabilities": [
            {"phase": "export_preparation", "stable_token": "enforced", "probe": "supported"},
            {"phase": "export_delivery", "stable_token": "enforced", "probe": "supported"}
          ]
        }
      }
    ]
  },

  // Entry sets are explicit; no list means "all". Empty schedules do not create protocol inputs.
  "entries": {
    "enabled_commands": [
      "submit_observation_material", "record_safety_disposition", "bind_correlation_context", "record_safe_signal",
      "append_audit_projection", "link_body_free_evidence", "prepare_report_handoff", "evaluate_authenticity_hint",
      "set_retention_marker", "protect_active_reference", "define_replay_scope", "record_no_write_violation",
      "record_gap_state", "prepare_external_audit_export", "register_reference_snapshot", "update_reference_snapshot_state"
    ],
    "enabled_queries": [
      "get_observation_receipt", "get_intake_status", "get_safe_signal", "get_signal_rollup",
      "get_audit_timeline", "get_evidence_index_input", "get_report_handoff", "get_retention_protection",
      "get_observation_read_model", "get_diagnostic_view", "get_gap_status", "get_peripheral_export_view",
      "get_reference_snapshot_view", "get_rebuild_progress"
    ],
    "inbound_consumers": [
      {"operation": "consume_bus_observation_material", "producer_family": "bus", "transport_binding_ref": "demo:transport:consumer:bus:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_source_audit_material", "producer_family": "source_owner", "transport_binding_ref": "demo:transport:consumer:source-audit:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_identity_observation_context", "producer_family": "identity", "transport_binding_ref": "demo:transport:consumer:identity:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_governance_audit_context", "producer_family": "governance", "transport_binding_ref": "demo:transport:consumer:governance:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_artifact_evidence_context", "producer_family": "artifact", "transport_binding_ref": "demo:transport:consumer:artifact:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_runtime_signal_summary", "producer_family": "runtime", "transport_binding_ref": "demo:transport:consumer:runtime:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_sandbox_signal_summary", "producer_family": "sandbox", "transport_binding_ref": "demo:transport:consumer:sandbox:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_archive_handoff_feedback", "producer_family": "archive", "transport_binding_ref": "demo:transport:consumer:archive:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"},
      {"operation": "consume_report_consumer_feedback", "producer_family": "report_consumer", "transport_binding_ref": "demo:transport:consumer:report-consumer:v1", "accepted_schema_versions": ["v1"], "actor_mapping_policy_ref": "demo:policy:consumer-actor:v1"}
    ],
    "enabled_jobs": [
      "publish_observation_outbox", "rebuild_observation_read_models", "rebuild_signal_rollups",
      "refresh_reference_snapshots", "scan_observation_gaps", "coordinate_observation_replay",
      "prepare_report_handoff_delivery", "prepare_external_audit_export_delivery", "rebuild_peripheral_views"
    ],
    "job_schedules": [],
    "outbox_loop_cadence_ms": 1000,
    "outbox_loop_candidate_limit": 100
  }
}
```

Document comments explain conditional requiredness and boundary intent only. Deleting comment lines leaves the same field/value candidate shown by the strict module demos；it still requires an implementation, selected JSON source, registered demo refs and a validated LocalTest assembly before it can run, none of which this design claims exists。

### 8.13 按配置域组织的配置项批次表

| 配置域 | 配置项 / raw field | 控制面 | 分类 | 来源规则 | 环境差异 | `03`影响判定 |
|---|---|---|---|---|---|---|
| `CFG-D01` source acquisition | field registry metadata；无root source-selector field | source/merge | startup | DECL<JSON<allowlisted ENV；selected source metadata外置 | all lanes同priority；named lane要求one strict JSON | 无回写；loader算法留Step09 |
| `CFG-D02` config identity | no raw `config_ref`；effective candidate派生 | identity/lifecycle | compatibility | `SRC-DERIVED` only | identity覆盖各lane实际winner，不用lane/path/run | 无回写；existing stage4 contract |
| `CFG-D03` runtime/technical | `profile`;`technical.*` | runtime assembly | startup + test-only | scalar/ref JSON+ENV | LocalTest可Fixed/Deterministic；INT/RT System/Runtime | 无回写；formal enum/matrix不变 |
| `CFG-D04` protocol boundary | `boundary.*` | API/worker pre-dispatch | bounded runtime + compatibility | numeric JSON+ENV；schema set JSON | same schema；numeric可在hard range内按lane选择 | 已完成support-type回写；字段无新回写 |
| `CFG-D05` entry dispatch/schedule | `entries.*` | API/worker/jobs registration | dispatch mapping | sets/catalog JSON；loop leaf JSON+ENV | LocalTest Fake transport；INT Controlled/Endpoint；RT Endpoint | 已完成Query/producer type回写；无剩余 |
| `CFG-D06` redaction/body-free | redaction/body-free policy refs | safety validation | policy + sensitive-ref | locator JSON+ENV | all lanesrequired；test不可bypass | 无回写；existing policy binding |
| `CFG-D07` correlation/visibility/labels | source allowlist + three policy refs | mapper/policy | policy + compatibility | set JSON；refs JSON+ENV | input instance不同，outcome semantics相同 | 已完成SourceFamily回写；无剩余 |
| `CFG-D08` atomic observation/idempotency store | two store objects | store/UoW | startup + test-only + sensitive-ref | mode/ref JSON+ENV | ISO InMemory；INT/RT Durable | 无回写；atomicity invariant不配置化 |
| `CFG-D09` projection store | `stores.projection` | projection persistence | startup + test-only + sensitive-ref | mode/ref JSON+ENV | ISO InMemory；INT/RT Durable | 无回写；Query no-repair保持 |
| `CFG-D10` Job execution/report store | `stores.job_execution` | staged Job persistence | startup + test-only + sensitive-ref | mode/ref JSON+ENV | enabled ISO conformance；INT/RT Durable | 无回写；claim/fence required |
| `CFG-D11` transaction/schema | timeout + revision | UoW/schema gate | bounded runtime + compatibility | scalar JSON+ENV | same bounds；Durable descriptor实际证明层级不同 | 无回写；no auto migration |
| `CFG-D12` digest | `digest.*` | canonical serializer/loaders | compatibility | DECL/JSON only | all lanesexact v1 semantics | 无回写；schema v1分离 |
| `CFG-D13` technical retention | `idempotency.*` | reservation/result/intent stores | bounded runtime + compatibility | duration JSON+ENV | test可取range内值；RT需operations approval | 无回写；不替代RetentionMarker |
| `CFG-D14` projection/freshness | `projection.*` | capture/planner/assembler | bounded runtime + policy | numeric/ref JSON+ENV | ISO deterministic；INT durable；RT workload-backed later | 无回写；overflow/no-Fresh invariant固定 |
| `CFG-D15` claim/concurrency/budget | claim lease、parallelism、plan、job timeout | Job execution | bounded runtime + compatibility | lease JSON；scalar JSON+ENV | ISO small/deterministic；INT/RT durable fence | 无回写；accepted snapshot不变 |
| `CFG-D16` retry | four retry objects | resolver/effect wrapper | bounded runtime + compatibility | DECL/JSON only | mode/capability不同；Unknown规则相同 | 无回写；recovery taxonomy不配置化 |
| `CFG-D17` safe resolvers | four root adapter objects | external resolver assembly | startup/mapping + sensitive-ref + test-only | scalar/locator JSON+ENV；capability JSON | ISO Fake/Controlled/Disabled；INT Controlled/Endpoint/Disabled；RT Endpoint/Disabled | 无回写；formal adapter object复用 |
| `CFG-D18` publication | publisher + 12 event targets | outbox/publisher | dispatch mapping + compatibility + sensitive-ref | root adapter leaf JSON+ENV；catalog JSON | ISO Fake；INT Controlled/Endpoint；RT Endpoint/Disabled with outbox | 无回写；target schema不改event |
| `CFG-D19` report handoff | report target catalog | handoff intent/effect | dispatch mapping + compatibility + sensitive-ref | JSON whole catalog | ISO Fake；INT Controlled/Endpoint；RT Endpoint/Disabled | consumer ref已回写；receipt非signoff |
| `CFG-D20` peripheral export | export target catalog | export intent/effect | peripheral mapping + compatibility + sensitive-ref | JSON whole catalog | same mode restriction；可empty/Disabled隔离 | consumer ref已回写；不成GRC truth |
| `CFG-D21` sensitive refs | all store/adapter/credential/policy/transport/schedule refs | secret/ref boundary | sensitive attribute | ordinary config只含locator；raw material无source | ownership随lane，raw secret全lane禁止 | 无回写；Step08继续provider/rotation/no-output |
| `CFG-D22` lifecycle | no activation/rollback raw field | new assembly/history | compatibility | derived/history only | all lanesnew complete assembly；old Job/effect pinned | 无回写；Step09/10继续exact lifecycle |
| `CFG-D23` environment/view | no lane/profile alias field；只引用`profile` | environment verification | view-only | no independent source | six document lanes映射three runtime classes | 无回写；不新增enum/result/evidence |

### 8.14 配置域 / 配置项停审记录

| 配置域 | Field/schema | Required/source | Sensitivity | Activation/failure | `03`影响 | 结论 / 缺口 |
|---|---|---|---|---|---|---|
| D01 | registry/strict JSON规则closed | source precedence exact | provenance不含raw value | candidate atomic fail | none | pass；exact loader留Step09 |
| D02 | no raw field intentional | derived only | body-free identity | stage4/new assembly | none | pass；无path/run identity |
| D03 | 5 fields closed | required/conditional；leaf ENV allowlisted | binding refs R | cold/profile mismatch fail | none | pass |
| D04 | 5 fields + bounds closed | required；set JSON/numeric leaf ENV | N | cold/preparse/reject | repaired | pass；schema vs digest分离 |
| D05 | sets/catalog/scalars closed | explicit arrays；no implicit all | transport/schedule refs R/S-L | cold root-specific fail | repaired | pass；9 producer map total |
| D06 | 2 required policy refs closed | JSON+ENV locator | R | pre-façade/fail closed | none | pass；无bypass key |
| D07 | allowlist + 3 refs closed | set JSON/ref ENV | N/R | pre-façade/reject or fail | repaired | pass；no authority switch |
| D08 | 4 store leaves across 2 slots | mode/ref conditional | store ref S-L | cold/schema/atomic fail | none | pass；no InMemory fallback |
| D09 | projection store pair | mode/ref conditional | store ref S-L | cold/no false Fresh | none | pass |
| D10 | Job store pair | enabled Job conditional | store ref S-L | cold/claim-fence fail | none | pass |
| D11 | timeout/revision closed | required JSON+ENV | N | cold descriptor fail | none | pass；timeout not rollback proof |
| D12 | two version fields closed | DECL v1/[v1] or JSON | N | cold/history-compatible | none | pass；no configurable algorithm |
| D13 | five duration fields/bounds closed | required JSON+ENV | N | cold/new material;guard old | none | pass；cross-window closed |
| D14 | six bounds + policy closed | required JSON+ENV | N/R | cold/Job snapshot/whole fail | none | pass |
| D15 | lease + limits + timeout closed | default only parallelism；others required | N | cold/Job snapshot/fence fail | none | pass |
| D16 | four complete retry objects | DECL attempts=0；JSON policy | N | cold/frozen/recovery dual gate | none | pass；no blind retry |
| D17 | four adapter objects closed | all object keys explicit | R/S-L | cold/descriptor/resolution fail | none | pass；Disabled formal outcome |
| D18 | publisher + 12-target schema closed | target totality conditional | R/S-L | cold/freeze effect binding | none | pass；old route pinned |
| D19 | typed report catalog closed | explicit array;may empty | R/S-L | cold/intent snapshot/target isolation | repaired | pass；no verdict/signoff |
| D20 | typed peripheral catalog closed | explicit array;may empty | R/S-L | cold/intent snapshot/target isolation | repaired | pass；core unaffected |
| D21 | every locator classified | raw material forbidden | R or S-L | stage5 private resolution | none | pass_for_step07；Step08 handoff explicit |
| D22 | no raw activation field | history/derived only | no new material | new assembly + pinned old work | none | pass_for_step07；Step09/10 handoff |
| D23 | no lane field | same root schema | no new material | view-only/not evidence | none | pass；six lanes traceable |

### 8.15 跨配置项闭环与 VETO 审计

#### 8.15.1 跨项审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在重复owner / 同义key | pass | each formal field one canonical path；`config_ref`/slice/catalog/snapshot derived，不重复raw field |
| 是否存在`storage/common/misc/runtime`泛化混写 | pass | root沿formal functional sections；`stores`只含formal store binding，不吞并retention/targets |
| 每项是否具备十列语义 | pass | §8.9 leaf registry + §8.10 repeated object schema覆盖type/default/required/source/scope/effect/sensitivity/failure/consumer |
| Default是否来自formal declaration | pass | only digest v1/[v1]、parallelism 1、retry additional 0；其余baseline不作implicit default |
| Required/conditional required是否有失败策略 | pass | missing/invalid阻断candidate/root exposure；optional arrays/Disabled有explicit semantics |
| Source是否与Step05一致 | pass | DECL<JSON<allowlisted ENV；sets/catalog JSON whole；invalid winner不fallback |
| Environment是否与Step06一致 | pass | one schema；LocalTest/IntegrationLike/RuntimeLike mode matrix不被demo放宽 |
| Sensitive是否误放raw material | pass | only opaque R/S-L refs；demo credential null；no endpoint/topic/path/DSN/token/body |
| Schema v1是否与digest v1混同 | no | distinct typed path、owner、validation与failure；同wire token不互转 |
| 9 Consumer producer map是否一致 | pass | Step08/13/14/formal与entries demo exact matching；source family另行compatibility gate |
| 12 outbound / target totality是否可判定 | pass | explicit typed arrays/unique key；all 12 mapped in complete exemplar |
| Numeric baseline是否伪装SLO/readiness | no | §8.8明确candidate baseline + hard validator range；staging/prod/not-run状态未改变 |
| Profile/feature是否可改变truth/state/UoW | no | no reverse boolean；all Step04 F-CFG redlines preserved |
| Old Job/effect是否可能读current target/config | no | A/J/H scope和historical binding failure明确；no reroute/rebuild |
| `03` definition/use缺口是否遗留 | none | `CFG-BLK-07-01`已回写6个type、9-map与formal摘要；definition/use check列入§12 |
| 是否伪造implementation/test/evidence/signoff | no | only design/demo refs；no commit/run/result/verdict/readiness claim |

#### 8.15.2 Requirement VETO映射

| Requirement VETO | Step07可判定配置证明 | 结论 |
|---|---|---|
| `VF-OBS-001` core closure缺失 | required stores/safety/entry/binding/capability有fail-fast/conditional totality | covered；missing不partial expose |
| `VF-OBS-002` raw secret/payload/runtime body进入 | schema只有scalar/enum/opaque locator；body scanner required；demo无raw material | covered；违反candidate reject |
| `VF-OBS-003` external evidence/identity/governance/artifact body被保存 | resolver/evidence/handoff只绑定body-free refs与formal summary ports | covered；无body/path field |
| `VF-OBS-004` telemetry/handoff/export成为external truth | no product/health/verdict/success authority key；delivery capability只是adapter contract | covered |
| `VF-OBS-005` Query/rebuild/replay/export反写source | no refresh-on-miss/repair-source/force-write field；limits only bound work | covered |
| `VF-OBS-006` 配置伪造run/evidence/verdict/signoff | `config_ref` derived；demo refs不是evidence；target receipt非signoff | covered |
| `VF-OBS-007` retention删除active/unresolved material | windows受cross-field/in-use guard；无cleanup/release override | covered |
| `VF-OBS-008` 配置引入non-core Cargo dependency | adapter/transport/store全部runtime opaque binding；无crate/product selector | covered |
| `VF-OBS-009` 具名产品成为truth/硬前置 | product-neutral enum/ref/capability；no DSN/provider schema | covered |
| `VF-OBS-010` historical material升级current硬规则 | old key/profile/number/path均不在registry；current baseline独立记录 | covered |

跨项与VETO审计没有unresolved conflict。Step08必须继续细化R/S-L locator的provider、存储、明文禁止、轮换、审计与no-output；该下游工作不反向阻塞本Step的field identity和preliminary sensitivity classification。

## 9. 对详细设计的影响判定

### 9.1 当前回写清单

| 配置结论 | 是否影响03 | 影响类型 | `03`回写位置 | 处理状态 |
|---|---|---|---|---|
| `BoundaryConfig`要求可解析`SchemaVersion`集合 | 是 | contracts value type + protocol/config parser contract | DDD Step06/08/14；formal `03` §6/§7/§13 | 已回写 |
| `SafetyBindingConfig`要求finite `SourceFamilyKind` set | 是 | contracts enum + intake/reference/config validation | DDD Step06/08/14；formal `03` §6/§7/§13 | 已回写 |
| Consumer binding要求`ObservationProducerFamily`及9行static map | 是 | contracts enum + envelope/idempotency/config mapping | DDD Step06/08/13/14；formal `03` §6/§7/§12/§13 | 已回写 |
| `entries.enabled_queries`要求actual `ObservationQueryOperation` enum | 是 | application operation enum definition | DDD Step06/13/14；formal `03` §6/§12/§13 | 已回写 |
| target catalog要求两个consumer typed refs | 是 | contracts typed ref definitions | DDD Step06/08/14；formal `03` §6/§7/§13 | 已回写 |
| project-local JSON采用formal field同名snake_case | 否 | raw serde/config语义 | 不适用 | 无回写 |
| `ConfigBindingRef`由effective candidate派生而非raw field | 否 | 澄清existing stage4 identity边界 | 不适用；Step09继续算法 | 无回写 |
| duration使用integer milliseconds与`*_ms` raw key | 否 | raw representation / unit | 不适用 | 无回写 |
| required numeric field使用§8.8 baseline/hard range但无implicit default | 否 | configuration value/range/failure strategy | 不适用 | 无回写 |
| R/S-L locator只允许opaque ref，raw material留infra private resolution | 否 | preliminary sensitivity classification | 不适用；Step08继续管理机制 | 无回写 |

### 9.2 Targeted repair完成记录

| Repair target | 完成内容 | Scope guard / 结果 |
|---|---|---|
| Step06 | six support type owner/variant/token/newtype与14 Query enum | no business object/state/UoW/port change；pass |
| Step08 | finite decode、source compatibility、9 Consumer producer map | 60 surface name/DTO business field unchanged；pass |
| Step13 | Query type use、producer identity map、publication schema token | key/digest/claim/fence unchanged；pass |
| Step14 | config finite set/static pair/typed ref validation | raw key/default/source仍由本Step定义；builder stages unchanged；pass |
| Step17/19 | implementation closure与assembly repair batch | no implementation/evidence claim；pass |
| formal `03` §6/§7/§12/§13 | unique owner、decode/map/idempotency/config摘要 | truth/protocol count/flow/state unchanged；pass |

`CFG-BLK-07-01`已关闭。Current Step07随后只定义loader-facing raw schema、value/default/source/sensitivity/failure，不再改变Rust type。若未来要求remote/admin/CLI/multi-file/hot source、new enum variant、new adapter field、new target DTO或不同builder stage，必须重新执行`03`影响判定。

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读:
> - 建议继续阅读本文件§8.7~§8.15的raw命名、numeric baseline/hard range、十列配置项总表、nested schema、finite inventory、strict JSON/完整JSONC、23域停审和跨项/VETO审计，了解formal §7每个字段如何从Step03~06与current `03`收敛。

正式`04-配置设计.md` §7在Step15应按以下顺序装配，不能从old formal §7恢复key/value:

1. 固定项目本地root section与`snake_case`/`*_ms`/explicit-null/set/catalog规则；系统聚合只作`l4_observability.<local_path>`机械映射。
2. 回填§8.9十列总表及§8.10 repeated object/finite/cardinality表，不把baseline写成implicit default。
3. 回填§8.11六组strict JSON及说明表。
4. 回填§8.12完整JSONC并保留“实际运行必须删除注释，current loader不支持JSONC”的醒目声明。
5. 回填§8.13~§8.15 traceability、23域停审、跨项/VETO与`03`已回写状态。

Formal §7必须保留以下收口句义:

```text
Only digest v1/[v1], max_parallelism=1, and retry max_additional_attempts=0
have declaration defaults. Every other P0 baseline is an explicit candidate value.
Missing, invalid, unknown, duplicate, profile-incompatible, or cross-field-invalid
winning values fail the complete candidate and never fall back to a lower source.

All configuration changes build a new complete assembly. Accepted Jobs freeze a
typed snapshot, and existing outbox/intent/preparation work remains pinned to its
historical effect binding. Configuration never owns or rewrites business truth.
```

本Step不修改formal `04`；上述草稿只在Step15、经过Step08~14门禁后装配。

## 11. 待确认事项

| 事项 | 当前影响 | Owner / 最迟关闭 | Current处理 |
|---|---|---|---|
| `CFG-BLK-07-01`与6个support type | Step07曾被阻断 | user + targeted `03` repair | resolved；不再是待确认项 |
| P0 baseline/hard range | candidate准备与validator | current Step07 | closed in §8.8；不是SLO/readiness |
| sensitive locator provider/store/rotation/audit/no-output | R/S-L管理机制 | Step08 | field identity已闭口；raw material继续禁止，不提前选provider |
| exact JSON/ENV reader、env key、provenance、identity canonicalization | loader落码 | Step09 | source allowlist已闭口；不在Step07发明env name/algorithm |
| new assembly activation/drain/rollback与old assembly policy | lifecycle | Step09/10 | current只固定cold/new assembly、Job/history pinning |
| missing/invalid/unavailable的跨入口最终矩阵 | failure taxonomy下游承接 | Step11 | 当前字段已有failure owner；不提前复制完整error matrix |
| staging/prod product、topology、credential、capacity | environment material | ADR/current `07`/operations | contract defined；instance not established/not evaluated |
| 是否进入Step08 | Step切换 | 用户 | 必须显式确认；确认前停在Step07 pass |

没有会阻塞Step07完成的未确认配置值或`03`回写项。下游事项不能被实现agent自行补成provider、env key、activation、test result或production setting。

## 12. Current M3 后置复核与 affected field registry

### 12.1 Final typed-contract revalidation

| Field surface | Final formal `03` truth | Step07 registry verdict |
|---|---|---|
| root identity/profile | derived `ConfigBindingRef` + required `RuntimeProfileClass` | exact；config ref不是raw field |
| ten sections | `technical/boundary/safety/stores/digest/idempotency/projection/execution/external/entries` | exact field-to-owner mapping，无`common/runtime/misc`泛化域 |
| finite support types | six repaired types及9 Consumer static producer map已进入formal §6/§7/§13 | exact；`CFG-BLK-07-01`保持resolved |
| defaults | digest v1/read v1、parallelism 1、retry additional attempts 0 | exact；其余required baseline不是缺失default |
| numeric values | candidate baseline与hard range分离 | exact；不升级为SLO/capacity/evidence |
| entry bindings | raw locator只在infra root；safe worker/jobs slice不携带locator | exact after R2；demo不表达private material |
| examples | per-section strict JSON + full JSONC documentation | 可解析schema example；不代表实例或ready |

### 12.2 Affected field-level register

| Affected ID | Step07 field/schema decision | 未关闭前字段行为 | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | root只登记accepted schema set，不定义payload DTO | I05未获canonical schema时不得进入enabled binding | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `inbound_consumers`要求exact operation/producer/schema/binding | producer mapping缺失则candidate invalid/slot absent | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | execution/entry字段不包含H13 enable/success payload | J06保持Blocked/manual | open_controlled |
| `R06-F-AFFECT-UOW-01` | store fields只声明atomicity/CAS capability | 不存在可选history/outbox/result或save-order字段 | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | retry object只含budget/backoff/jitter等typed parameter | 未分类branch不读取policy执行retry | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | external catalog逐subject/family/ref/phase capability闭口 | link不完整时binding不暴露 | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | retry policy与external binding分离且均进入snapshot | 无same-token/probe/accounting不得自动additional attempt | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | entry schema不包含outbox rebuild/suppress开关 | 无same-UoW surface则handler不激活 | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | 无`ack_on_unknown`、default action或wildcard字段 | unknown只能按formal probe/manual处理 | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | config无report ref/root/run identity字段 | owner缺失不得finalize Completed | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | raw schema只映射已有finite type | 不建立string alias、private enum或first-value fallback | inherited_affected |
| `03-RPR-S09-PER-FLOW` | enabled sets/catalog只选择既有protocol | 配置全量映射不替代60 exact flow implementation audit | inherited_affected |

本Step关闭`0/12`。`CFG-BLK-07-01`是既有definition gap的design repair，不等于上述activation affected或
implementation readiness关闭；当前仍未实现parser、validator、fixture或测试。

## 13. 自检与进入下一步条件

### 13.1 自检

| 检查项 | 状态 | 证据 |
|---|---|---|
| 已读取SOP Step07、书写规范§5.7和Step03~06 | pass | §3 |
| 已从formal `03`/DDD Step14独立建立root与field inventory | pass | §8.1~§8.3 |
| 已执行definition/use审计并修复上游 | pass | §8.4~§8.6；§9.2 |
| 6个support type是否有unique owner/exact schema | pass | Step06 + formal §6；definition/use scan |
| 9 Consumer producer map是否跨Step08/13/14/formal/Step07一致 | pass | §8.10/§8.11/§8.15 |
| 已后置审计old Step07/formal §7/L1参考 | pass | §5~§7 |
| 是否用`04`补造code type | no | §8.6禁止绕过 |
| exact root/field/nested/finite schema是否闭口 | pass | §8.7~§8.10 |
| numeric baseline/hard range是否区分default/SLO | pass | §8.8；only the three declared default families |
| 每个P0 field是否有十列语义 | pass | §8.9 + repeated schema §8.10 |
| 模块strict JSON是否可parse | pass | §8.11；final static extraction/JSON parse |
| JSONC删除注释后是否可parse且声明runtime不支持注释 | pass | §8.12；final static extraction/JSON parse |
| 23域是否逐域停审 | pass | §8.13~§8.14 |
| 跨项/VETO是否无unresolved conflict | pass | §8.15 |
| 是否完成`03`影响判定且无待回写/阻塞待确认 | pass | §9；actual影响均已回写或无回写 |
| 是否修改formal文档 | formal `03` targeted only；formal `04` no | user-authorized minimal repair；Step15才装配formal `04` |
| 是否越过Step08~15 | no | sensitive/loading/lifecycle/failure只作明确handoff |
| 是否伪造实现、commit、run、test、evidence、verdict或signoff | no | design schema/demo only；environment仍not established/evaluated |
| Markdown table/fence/whitespace与`git diff --check` | pass | final static checks；无输出/无结构错误 |

### 13.2 完成门禁

| 条件 | 状态 | 说明 |
|---|---|---|
| P0配置项无缺口 | pass | §8.7~§8.10 |
| 每项required/source/scope/effect/sensitivity/failure/consumer闭口 | pass | §8.9~§8.10 |
| 模块strict JSON和完整JSONC已提供 | pass | §8.11~§8.12 |
| 配置项逐域停审 | pass | D01~D23；§8.14 |
| 跨配置项/VETO无unresolved conflict | pass | §8.15 |
| `03` impact无actual待回写 | pass | `CFG-BLK-07-01` resolved；§9 |
| Step07 gate_status | `pass_consumed_by_step_08` | 最终M3 typed config、field registry、JSON示例和12项affected复核通过 |
| next_allowed_action | `continue_to_current_step_08_under_continuous_M4_authorization` | 按SOP进入Step08 sensitive locator/provider/rotation边界 |
