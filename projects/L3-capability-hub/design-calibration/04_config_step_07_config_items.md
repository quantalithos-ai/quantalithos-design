# L3-capability-hub 04 配置设计 Step 7：完整配置项清单

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §7
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_07_completed_continuous_execution`

---

## 1. Step 状态与分批计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 `定义完整配置项清单` |
| 输入基线 | 04 Step 1~6；formal 03 §13；DDD Step 14 §§13~16、23~24、50~64、118、130 |
| 当前批次 | batch 7：完整 JSONC、跨配置项审计、03 impact 与 formal §7 handoff completed |
| 后续批次 | none；Step 8 may start after flow/ledger synchronization |
| formal 04 | not created；only Step 15 may assemble |
| 03 影响 | 当前 `无回写`；任何 typed shape delta 立即停止并受控回开 |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 将 formal 03 的 27 行 canonical configuration surface 转译为可直接实现 parser、validator、builder input 和配置测试的 strict JSON schema。每个 raw item 必须有：路径、类型、默认、required 条件、来源、范围、owner、effect、sensitivity 和 failure。

本 Step 必须产出：

1. 项目本地 JSON 模块结构和系统聚合映射。
2. 27/27 canonical row 到 raw path 的一对一责任映射。
3. root、technical policy、API/Worker/Jobs、9 external Port、6 source、10 route 和 named material section 的完整 item catalog。
4. bounded environment overlay allowlist，不提供 arbitrary CLI/env path。
5. 每个模块的 strict JSON demo 和逐项说明表。
6. 一个 JSONC 完整文档示例，并明确运行配置只接受 strict JSON。
7. 配置域停审、跨项闭环和 03 impact audit。

本 Step 不选择真实数据库、HTTP client、broker、secret provider 或 observability backend；不定义 raw secret；不写 loader function/error enum、变更流程、测试结果、验收签署、实施状态或部署命令。

## 3. 本步输入

| 输入 | 本步承接 | 禁止推导 |
|---|---|---|
| `04_config_step_03_control_plane.md` | CP-01~CP-10、唯一 raw reader/builder | generic config bag、second reader |
| `04_config_step_04_categories_boundaries.md` | startup-only、frozen view、22 redlines | hot reload、business feature flags |
| `04_config_step_05_sources_priority_conflicts.md` | constants < JSON < bounded env、ref-only、conflict rules | arbitrary CLI/env、config center/admin |
| `04_config_step_06_environment_profiles_matrix.md` | Local/Integration/Deployment、four-state activation | CI/staging/prod enum expansion |
| formal `03` §13.2 | exact 27 rows and owners | row split/merge/removal |
| DDD Step 14 §§14、23、24 | exact Rust typed shape and symbolic ref grammar | new field/variant/Port/error |
| DDD Step 14 §§50~64、118、130 | 6 sources、10 routes、8 Jobs、complete predicate | queue/lease/ack/outbox/runtime execution |
| DDD Step 15 | `Off/Redacted` and allowlist ownership | raw/full/verbose or editable fields |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| P0 item 名称、类型、默认是什么？ | §8 起按 18 个顶层功能模块展开。canonical required value 默认统一为 `none; explicit required`；只给 parser design constants（schema v1、fixed compatibility、grammar/bounds）和 optional registry empty-object default，不让 builder 猜值。 |
| 哪些必填？ | root 13 个 semantic fields、selected policy/entry section、9 external slots、selected Worker 的 6 source decisions、Configured collaboration 的 10 routes及所有被引用 section 必填。conditional variant payload 只在对应 kind 下必填，并禁止出现在其他 kind。 |
| 来源和作用域是什么？ | strict JSON 是完整 source；Step 7 closed env allowlist 可覆盖 selected scalar/ref leaf；CLI 只选择 config file。所有 runtime item startup 生效，entry/invocation 只消费 frozen view。 |
| 生效、敏感、失败如何处理？ | 统一 startup parse/type/cross-field/constructor validation。ref/endpoint metadata 为 `sensitive`，raw secret 为 forbidden；invalid/missing/duplicate/orphan/wrong-family/profile mismatch 均 fail-fast，无低优先级/fake fallback。 |
| 关联模块？ | raw parse 只归 `infra/config.rs`；graph/binding 归 `infra/runtime_builder.rs` 和具体 infra adapter；API/Worker/Jobs 只收 typed handoff；application/domain/contracts 不读 raw config。 |
| 模块 JSON demo 怎么写？ | 每个功能模块提供 strict `json` 最小 demo，紧跟字段说明；variant demo 只展示一种合法 shape，并另表说明其他 branch。 |
| 模块拆分是否避免泛化桶？ | 是。使用 `runtime`、`localPersistence`、`externalPorts`、`technicalPolicies`、`entries`、`diagnostics`、`configuredAdapters`、`inboundFeeds`、`trustedActors`、`outboundRoutes`、`fixtures`、`transports`、`endpoints`、`credentialRefs`、`tlsPolicies`。 |
| 是否避免项目前缀？ | 项目本地 root 不加 `capabilityHub`；若系统聚合，外部 owner 映射为 `capabilityHub.<localPath>`，本仓 parser 仍只接收去前缀后的本地 document。 |
| 完整 demo 是否 JSONC？ | 是，仅为文档解释；运行时必须删除注释，严格 JSON parser 不接受 comments/trailing commas。 |
| 是否回指 Steps 3~6 / 03？ | 每个 catalog batch 都有 CP、profile、typed owner 和 canonical row 列；最终 §17 做 27/27 audit。 |
| 每域是否停审？ | 每批写入后独立核对 required/default/source/profile/failure/impact；最终汇总停审。 |
| 是否存在重复、泛化、无失败策略、敏感遗漏或 03 gap？ | 当前建立强制审计维度；只有最终 batch 全部为 0 才能关闭 T013。 |

## 5. 当前问题诊断

| 位置 | 风险 | 本 Step 策略 |
|---|---|---|
| 27 canonical rows | typed row 不等于一个 raw leaf，尤其 retry/source/route | 保持 canonical responsibility 27/27，允许一个 row 展开为闭合 raw object |
| technical timeouts | typed policy和entry parameters都持有相关值，若 raw 重复会漂移 | 每个 timeout 只有一个 raw key；parser复制到 policy和selected entry typed view |
| Jobs runner retry | 不属于 `CapabilityRuntimeTechnicalPolicy` field，却由同一 runtime policy section提供 | raw policy section含 `jobsRunnerRetry`，只投影到 Jobs typed block |
| external Configured material | 产品未选择 | 定义 product-neutral closed endpoint/transport/TLS/credential-ref schema；constructorRef 未注册时 fail-fast |
| fixture material | 不能伪造真实 evidence | fixture section只命名 typed fixture family/id；不声明真实外部成功 |
| environment overlay | named maps容易变成 arbitrary path | 只允许 stable root/selected-entry/selected-policy/closed-slot leaves；named registries file-only |
| defaults | 参考项目大量 local defaults会弱化本项目 required semantics | canonical required values均无隐式默认，完整示例显式填写 |
| historical material | old provider/cost/outbox/store split可能回流 | 不使用 provider routing/cost、outbox/relay/DLQ、per-repository store 或 execution gateway key |

## 6. 改动前后对比

| 维度 | Step 7 前 | Step 7 目标态 | 原因 |
|---|---|---|---|
| raw schema | 只有 typed root和handoff | strict JSON modules + closed variants | parser 可直接实现 |
| numeric values | positive/bounded，无 unit/default/max | exact units、ranges、examples、requiredness | validator/test 可判定 |
| refs | exact typed newtypes，无 raw paths | closed section registries + 1..128 ASCII names | family resolution可实现 |
| entries | exact typed blocks | single raw source copied into policy/entry views | 避免重复 timeout drift |
| external binding | 9/6/10 inventory | exact slot keys和conditional payload | complete predicate可静态核对 |
| sensitive material | ref-only原则 | exact ref section schema + raw secret prohibition | Step 8 可承接 |
| examples | none | per-module strict JSON + full JSONC | 实现和review可复核 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决 |
|---|---|---|
| required value defaults | A. local-friendly implicit defaults；B. explicit required | 采用 B。避免 profile/entry/binding被隐式选择。 |
| JSON key style | A. snake_case；B. lowerCamelCase | 采用 B，与 Rust fields一一可读映射，同时 enum values也用 lowerCamelCase。 |
| section registry | A. generic `sections` map；B. family-specific maps | 采用 B，wrong-family在结构层可判定。 |
| timeout raw source | A. policy和entry重复；B. policy section唯一 raw source | 采用 B，parser复制到 typed views并保证无漂移。 |
| configured product material | A. free-form `settings`；B. closed neutral endpoint/transport/TLS/ref fields | 采用 B；产品特有字段需 controlled reopen，不允许 extension map。 |
| environment override | A. arbitrary JSON pointer；B. closed allowlist | 采用 B。高优先级值仍走完整 validation。 |
| unused sections | A. ignore；B. reject orphan | 采用 B。一个 process document只描述实际 selected graph，减少 stale sensitive material。 |

## 8. 结构化中间产物

### 8.1 命名、格式与静态 parser bounds

| Rule | Exact decision |
|---|---|
| document format | UTF-8 strict JSON object; max encoded document bytes `1,048,576`; BOM/comments/trailing commas rejected |
| local root | no project prefix; top-level keys are the 18 functional modules named in §4 |
| aggregate mapping | external aggregate owner may use `capabilityHub.<localPath>`; local parser never accepts wrapper key |
| key style | ASCII lowerCamelCase; unknown or duplicate key rejected at every object level |
| symbolic config name | 1..128 ASCII bytes; first alphanumeric; remaining alphanumeric/`.`/`_`/`-`; exact DDD forbidden characters apply |
| named registry | object keyed by symbolic config name; every declared section must be reachable from selected graph; orphan rejected |
| enum wire value | closed lowerCamelCase string; case-sensitive; no alias/trim/case-fold |
| integer | JSON integer only; float/exponent/string coercion rejected |
| duration | positive integer milliseconds; suffix/unit strings rejected |
| byte/count limit | positive integer in exact per-item range; no silent clamp |
| null | forbidden unless an item table explicitly says nullable; variant-irrelevant fields must be absent, not null |
| raw secret | forbidden in every module; only symbolic `credentialRef` / certificate/key ref names allowed |

### 8.2 Functional module inventory

| Module | Purpose | Primary CP | Candidate / builder output | Forbidden content |
|---|---|---|---|---|
| `runtime` | schema/profile/entry and selected refs | CP-01 | root identity + selected section refs | feature flags、schedule、business scope |
| `localPersistence` | one authority binding | CP-02 | `CapabilityLocalPersistenceBinding` | per-repository stores、replica/TTL |
| `externalPorts` | nine exact external slots | CP-06/07 | `CapabilityExternalPortBindings` | generic adapter map/family merge |
| `clock` / `idGenerator` / `compatibility` | technical primitives | CP-03 | exact typed bindings | fallback generator/algorithm selector |
| `technicalPolicies` | timeouts/retries/internal scan | CP-09 + entries | policy + selected entry copies | business retry/status classifier |
| `entries` | selected API/Worker/Jobs parameters | CP-04/05/08 | `CapabilityEntryParameters` | route/protocol/job identity override |
| `diagnostics` | `Off/Redacted` selection | CP-10 | `CapabilityDiagnosticMode` | allowlist/raw/full/verbose |
| `configuredAdapters` | configured external constructor material | CP-06/07 | adapter-private inputs | body/result/provider route/cost |
| `inboundFeeds` / `trustedActors` | configured Worker source material | CP-05 | feed + matcher constructor inputs | logical event/schema derived from topic |
| `outboundRoutes` | ten physical route materials | CP-07 | route constructor inputs | event/payload/digest/intent mutation |
| `fixtures` | deterministic typed fixture identity | CP-02/03/05/06/07 | fixture registry input | real evidence/signoff/external receipt |
| `transports` / `endpoints` | product-neutral connection metadata | CP-02/05/06/07 | adapter-private resolved material | credential in address、raw payload |
| `credentialRefs` / `tlsPolicies` | symbolic secret/TLS references | CP-02/05/06/07 | adapter-private safe refs | raw token/password/key/cert |

### 8.3 Raw source to typed-root mapping strategy

| Raw source owner | Parsed once into | Typed projection | Canonical rows |
|---|---|---|---|
| `runtime` | root identity/section refs | schema/profile/entry/ref fields | 1~3 |
| `localPersistence` | closed binding union | local authority binding | 4 |
| `externalPorts` + referenced sections | nine closed unions | external Port group | 5, 18 |
| `clock` / `idGenerator` | two closed unions | clock/id fields | 6 |
| `compatibility` | fixed pair | compatibility field | 7 |
| selected `entries` section | entry-specific scalars and sources | selected entry variant | 8~17, 19~20 |
| selected `technicalPolicies` section | exact timeout/retry/scan leaves | technical policy + timeout/retry copies in entry | 10, 14, 21~26 |
| `diagnostics` | closed mode | diagnostic field | 27 |

No canonical row has two independent raw values. `apiCallMs`、`workerInboundCallMs`、`workerCollaborationCallMs` and `jobsRunMs` originate only in the selected technical-policy section and are copied to both typed owners that need them. Builder code cannot reconcile conflicting duplicates because duplicate raw keys do not exist.

### 8.4 Section reachability and cardinality

| Registry | Maximum selected-graph sections | Reachability source | Orphan/wrong-family behavior |
|---|---:|---|---|
| `technicalPolicies` | 1 | `runtime.runtimePolicyConfigRef` | reject |
| `entries` | 1 | `runtime.entryConfigRef` | reject |
| `configuredAdapters` | 9 | configured external Port slots | reject |
| `inboundFeeds` | 6 | configured Worker source slots | reject |
| `trustedActors` | 6 | configured Worker source slots | reject |
| `outboundRoutes` | 10 | configured collaboration adapter | reject |
| `fixtures` | 17 | 9 Ports + 6 sources + clock + id | reject |
| `transports` | 26 | one store + adapters/feeds/routes as needed | reject |
| `endpoints` | 26 | transport sections | reject |
| `credentialRefs` | 26 | transport/TLS sections | reject |
| `tlsPolicies` | 26 | transport sections | reject |

Shared references are allowed only between consumers whose section kind permits sharing; sharing reduces section count but never merges Port/source/route identity. Cycles between registries, registry names that differ only by case, and unreferenced sensitive sections are rejected.

## 9. Batch 1 停审记录

| Gate | Result |
|---|---|
| SOP 12 questions answered | pass |
| modules tied to CP / typed owners | pass; 18 functional modules |
| 27-row mapping strategy | pass; no duplicate raw value |
| name/document/cardinality bounds | pass |
| product/secret/forbidden leakage | 0 |
| 03 typed delta | 0 |

Batch 1 closed the schema inventory and allowed batch 2 to write root, primitive, technical-policy and selected-entry catalogs. It did not authorize external material sections or formal 04 assembly.

## 10. Catalog notation and common semantics

The following item tables use these fixed abbreviations. They are part of the schema contract, not editorial shorthand.

| Term | Exact meaning |
|---|---|
| `file` | The value is required in the selected strict JSON document unless a listed bounded environment variable replaces that exact leaf. |
| `none; explicit required` | No parser, builder, library or profile default exists. Omission fails before runtime assembly. |
| `fixed explicit` | The value is still required in JSON, but only the listed compatibility literal is accepted. |
| `conditional` | The field is required exactly when its closed parent variant requires it and forbidden in every other variant. |
| `startup/frozen` | Parse and validate once at startup; the resulting typed value is immutable for the process lifetime. |
| `public` | Safe non-secret metadata; it can appear in a sanitized configuration inventory, but raw document echo remains forbidden. |
| `sensitive-ref` | Symbolic name or connection metadata that must be redacted in diagnostics and must never expose referenced secret material. |
| `fail-fast` | Emit one path-bearing, value-free validation category and stop before any listener, source, Job runtime or partial graph is exposed. |

Unless an item says otherwise, source is `file` plus only the exact bounded env leaf listed in §18, scope/effect is `process / startup/frozen`, and failure is `fail-fast; no fallback or clamp`. Unknown fields, duplicate fields, null, wrong JSON type, unselected-variant payload and values outside the inclusive bounds are rejected.

## 11. Runtime root and selected-section catalog

### 11.1 `runtime` items

| Configuration item | Type / allowed value | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / canonical row |
|---|---|---|---|---|---|---|---|---|
| `runtime.schemaVersion` | JSON integer; exactly `1` | fixed explicit | yes | file | process / chooses parser schema before all section decode | public | absent, non-integer or value other than `1` rejects document | `CapabilityConfigSchemaVersion::V1` / row 1 |
| `runtime.profile` | enum string: `local`, `integration`, `deployment` | none; explicit required | yes | file + bounded env | process / constrains every binding branch | public | unknown/case variant or incompatible binding rejects startup | `CapabilityRuntimeProfileKind` / row 2 |
| `runtime.entry` | enum string: `api`, `worker`, `jobs` | none; explicit required | yes | file + bounded env | process / selects exactly one binary composition branch | public | mixed, unknown or entry-section mismatch rejects startup | `CapabilityRuntimeEntryKind` / row 3 |
| `runtime.entryConfigRef` | symbolic config name `1..128` ASCII bytes | none; explicit required | yes | file + bounded env | process / resolves exactly one `entries` member | public | missing, orphan target, wrong kind or cycle rejects startup | `CapabilityEntryConfigRef` / rows 3, 8~22 |
| `runtime.runtimePolicyConfigRef` | symbolic config name `1..128` ASCII bytes | none; explicit required | yes | file + bounded env | process / resolves exactly one `technicalPolicies` member | public | missing/orphan target or wrong-family ref rejects startup | `CapabilityRuntimePolicyConfigRef` / rows 10, 14, 21~26 |

The raw root has five keys, while the validated Rust root has thirteen fields because the other eight typed fields are resolved from the remaining top-level modules. This is a projection, not a missing raw configuration surface.

### 11.2 `runtime` cross-field rules

| Rule ID | Predicate | Failure behavior |
|---|---|---|
| `RT-01` | `entries[runtime.entryConfigRef].kind == runtime.entry` | reject `entrySectionMismatch`; do not inspect another entry section |
| `RT-02` | exactly one `entries` member exists and it is the selected member | reject orphan or multiple-entry document; one process document describes one graph |
| `RT-03` | exactly one `technicalPolicies` member exists and it is selected | reject orphan or multiple-policy document |
| `RT-04` | `deployment` satisfies durable/system/non-fake matrix | reject at validation, before any product constructor/probe |
| `RT-05` | all top-level modules required by this schema are present exactly once | reject missing/duplicate module; empty named registries are accepted only when their maximum reachable count is zero |

## 12. Local authority, clock, identifier and compatibility catalog

### 12.1 `localPersistence` items

`localPersistence` contains one selected binding and the closed registry needed only by the durable branch. It never creates per-repository store choices.

| Configuration item | Type / allowed value | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed / constructor owner |
|---|---|---|---|---|---|---|---|---|
| `localPersistence.binding.kind` | enum: `inMemory`, `durable` | none; explicit required | yes | file | process / selects single authority `A` implementation family | public | unknown kind or `inMemory` under Deployment rejects startup | `CapabilityLocalPersistenceBinding` / row 4 |
| `localPersistence.binding.storeRef` | symbolic name | none | conditional: `durable` only | file + bounded env | process / resolves one member of `localPersistence.stores` | sensitive-ref | missing, orphan, wrong-family or present for `inMemory` rejects | `CapabilityStoreConfigRef` / row 4 |
| `localPersistence.stores` | object map keyed by symbolic name | `{}` only when binding is `inMemory` | yes | file only | startup constructor registry; selected graph max one member | sensitive-ref | selected ref absent, orphan member or >1 member rejects | local durable adapter builder |
| `localPersistence.stores.<name>.constructorRef` | symbolic name identifying one binary-registered durable constructor family | none; explicit required | each declared store | file only | selects code-registered constructor without selecting product semantics | public | unregistered/wrong-family constructor rejects assembly | local adapter builder; no new typed root field |
| `localPersistence.stores.<name>.transportRef` | symbolic name into `transports` | none; explicit required | each declared store | file only | supplies resolved product-neutral connection metadata | sensitive-ref | unresolved/wrong-kind transport rejects validation | local adapter-private input |

The durable store section may contain only `constructorRef` and `transportRef`. Database schema/table names, repository routing, replica selection, transaction isolation toggles, TTL, cleanup, migration execution, provider quota and raw DSN are not accepted keys. The selected constructor must prove the formal 03 single-UoW, CAS, cursor, rollback and commit-resolution contract; configuration cannot weaken it.

### 12.2 `clock` and `idGenerator` items

| Configuration item | Type / allowed value | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / canonical row |
|---|---|---|---|---|---|---|---|---|
| `clock.kind` | enum: `system`, `deterministic` | none; explicit required | yes | file | process / constructs sole `ClockPort` | public | unknown kind or deterministic under Deployment rejects | `CapabilityClockBinding` / row 6 |
| `clock.fixtureRef` | symbolic name into `fixtures` of kind `clock` | none | conditional: deterministic only | file only | process / resolves deterministic clock fixture | public | missing/wrong-kind/orphan or present for system rejects | `CapabilityClockBinding::Deterministic` / row 6 |
| `idGenerator.kind` | enum: `system`, `deterministic` | none; explicit required | yes | file | process / constructs sole `IdGeneratorPort` | public | unknown kind or deterministic under Deployment rejects | `CapabilityIdGeneratorBinding` / row 6 |
| `idGenerator.fixtureRef` | symbolic name into `fixtures` of kind `idGenerator` | none | conditional: deterministic only | file only | process / resolves deterministic ID fixture | sensitive-ref | missing/wrong-kind/orphan or present for system rejects | `CapabilityIdGeneratorBinding::Deterministic` / row 6 |

### 12.3 `compatibility` and `diagnostics` items

| Configuration item | Type / allowed value | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / canonical row |
|---|---|---|---|---|---|---|---|---|
| `compatibility.protocolCodec` | enum: exactly `stableSurfaceV1` | fixed explicit | yes | file | process / binds deterministic public/stored codec | public | any alias/future value rejects startup | `CapabilityProtocolCodecProfile::StableSurfaceV1` / row 7 |
| `compatibility.digest` | enum: exactly `sha256V1` | fixed explicit | yes | file | process / binds canonical digest profile | public | any alias/future value rejects startup | `CapabilityDigestProfile::Sha256V1` / row 7 |
| `diagnostics.mode` | enum: `off`, `redacted` | none; explicit required | yes | file + bounded env | process / controls optional safe diagnostics only | public | unknown/raw/full/verbose value rejects startup | `CapabilityDiagnosticMode` / row 27 |

Compatibility literals are explicit audit evidence of the selected schema contract, not runtime-tunable algorithms. A change requires a new schema/version and migration Step, not an environment override.

## 13. Technical policy catalog

### 13.1 Duration and count bounds

| Raw value family | JSON representation | Inclusive parser bound | Additional invariant |
|---|---|---:|---|
| API / Worker phase timeout | integer milliseconds | `1..600000` | cannot exceed the selected entry whole deadline where a narrower phase is nested |
| Jobs whole-run timeout | integer milliseconds | `1..86400000` | runner delay plus an attempt must remain inside this deadline; no deadline extension |
| external/local/commit timeout | integer milliseconds | `1..600000` | `externalPortCallMs` and `localStoreCallMs` are clipped by the owning whole phase |
| byte limit | integer bytes | `1..16777216` | checked against complete encoded bytes before typed decode; no truncation |
| public page limit | integer items | `1..1000` | caller value above the configured maximum is rejected, not clamped |
| internal/planning/fetch batch | integer items | `1..10000` | collect-before-mutate and stable cursor rules remain mandatory |
| Worker parallelism | integer independent tasks | `1..1024` | one global permit gate; never multiplied by six sources |
| total attempts | integer including initial call | `1..8` | retry count is `attempts - 1`; policy never grants eligibility by itself |

### 13.2 Selected technical-policy section

Every member `technicalPolicies.<policyName>` has this exact shape. All leaves are explicit and required; no retry or timeout uses a library default.

| Configuration item suffix under `technicalPolicies.<name>` | Type / range | Default | Source | Scope / effect | Sensitivity | Failure / invariant | Projection owner |
|---|---|---|---|---|---|---|---|
| `timeouts.apiCallMs` | integer `1..600000` | none | file + bounded env | API whole-call observation deadline | public | must be present even when API is not selected so profiles remain comparable; never cancels/detaches application | timeout policy + API row 10 |
| `timeouts.workerInboundCallMs` | integer `1..600000` | none | file + bounded env | one admitted inbound application call | public | timeout does not redispatch or infer rollback | timeout policy + Worker row 14 |
| `timeouts.workerCollaborationCallMs` | integer `1..600000` | none | file + bounded env | one exact capture-ref continuation call | public | cannot create second capture/intent | timeout policy + Worker row 14 |
| `timeouts.jobsRunMs` | integer `1..86400000` | none | file + bounded env | one complete one-shot Jobs run | public | residual started work must drain; unknown targets cannot be terminalized | timeout policy + Jobs row 21 |
| `timeouts.externalPortCallMs` | integer `1..600000` | none | file + bounded env | each resolver/handoff/collaboration call | public | uses min with remaining whole phase; no implicit fake/disabled fallback | technical policy / row 23 |
| `timeouts.localStoreCallMs` | integer `1..600000` | none | file + bounded env | one repository/UoW operation | public | timeout does not prove rollback or commit absence | technical policy / rows 24~25 |
| `timeouts.commitObservationMs` | integer `1..600000` | none | file + bounded env | resolve-commit/authority-read observation window | public | mutation is never repeated; only observation may repeat | technical policy / row 25 |
| `internalScanPageLimit` | integer `1..10000` | none | file + bounded env | internal stable scan page | public | not a public Query default; no mutation before full target collection | technical policy / row 26 |

Even for an unselected entry, all seven timeout leaves remain required. This keeps one schema shape across API/Worker/Jobs and allows profile validation without hidden conditional defaults. Only the selected entry receives its projected values.

### 13.3 Reusable retry-policy object

Each of `externalRetry`, `contentionRetry`, `commitObservationRetry` and `jobsRunnerRetry` uses the following exact object. `jobsRunnerRetry` is resolved from the same selected policy section and projected only into `CapabilityJobsEntryParameters`; it is not a new field in `CapabilityRuntimeTechnicalPolicy`.

| Retry object leaf | Type / inclusive bound | Default | Required | Effect | Failure / cross-field rule |
|---|---|---|---|---|---|
| `attempts` | integer `1..8`, total attempts including initial | none | yes | upper budget after an owning classifier and effect proof authorize retry | `1` means no retry; zero/string/float rejects |
| `delay.initialMs` | integer `1..60000` | none | yes | delay before first eligible retry | must be `<= maximumMs` |
| `delay.maximumMs` | integer `1..600000` | none | yes | saturating per-delay ceiling | must be `>= initialMs` and fit owning phase deadline after clipping |
| `delay.multiplierNumerator` | integer `1..1000` | none | yes | positive exact rational numerator | ratio `numerator / denominator` must be between `1` and `16` inclusive using checked integer arithmetic |
| `delay.multiplierDenominator` | integer `1..1000` | none | yes | positive exact rational denominator | float/exponent/string representation rejected |
| `delay.maximumJitterMs` | integer `1..60000` | none | yes | upper bound for injected jitter source | actual jitter may be zero; bound must not overflow or extend phase deadline |

| Policy path | Authorized classifier / consumer | Additional exact gate | Canonical row |
|---|---|---|---:|
| `technicalPolicies.<name>.externalRetry` | typed external Port wrapper | only already-classified temporary/timeout plus effect-safe call; malformed/unknown/permanent never retry | 23 |
| `technicalPolicies.<name>.contentionRetry` | application contention wrapper | confirmed rollback, exact owner reload, fresh UoW and remaining deadline | 24 |
| `technicalPolicies.<name>.commitObservationRetry` | UoW recovery wrapper | repeats only `resolveCommit` or authority read; never mutation | 25 |
| `technicalPolicies.<name>.jobsRunnerRetry` | application-owned Jobs safe-reentry controller | no typed response plus durable exact-invocation proof; typed `Retryable` response is terminal for that run | 22 |

Attempts and delays are technical ceilings, not retry authorization. A configuration with `attempts > 1` remains valid even when a particular invocation has no eligible failure; the wrapper then performs one attempt only.

## 14. Entry section catalog

### 14.1 Common entry rules

| Rule | Exact contract |
|---|---|
| registry | `entries` is a map keyed by symbolic name; exactly one member, selected by `runtime.entryConfigRef` |
| discriminator | each member has required `kind`; values are `api`, `worker`, `jobs`; no aliases |
| selected shape | only fields belonging to the discriminator are accepted; timeout/retry fields are forbidden here because policy is the sole raw source |
| provenance | parser records path provenance internally for diagnostics but no config ref/path enters public entry parameters |
| activation | selected typed block is copied once into the non-Clone handoff after all Stage 0~7 gates pass |

### 14.2 API entry items

| Configuration item | Type / range | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / row |
|---|---|---|---|---|---|---|---|---|
| `entries.<name>.kind` | exactly `api` | none | yes | file | selects API branch | public | mismatch with `runtime.entry` rejects | `CapabilityEntryParameters::Api` / row 3 |
| `entries.<name>.requestBodyLimitBytes` | integer `1..16777216` | none | yes | file + bounded env | complete encoded request gate before typed decode | public | oversize request fails pre-application; no body persistence/truncation | `CapabilityApiEntryParameters.request_body_limit` / row 8 |
| `entries.<name>.publicPageLimit` | integer `1..1000` | none | yes | file + bounded env | maximum caller-supplied Query page limit | public | zero/over-limit caller input rejected; no clamp/default substitution | `CapabilityApiEntryParameters.public_page_limit` / row 9 |

`CapabilityApiEntryParameters.call_timeout` is copied only from `technicalPolicies.<selected>.timeouts.apiCallMs`; an `entries` timeout key is unknown and rejected.

### 14.3 Worker entry scalar items

| Configuration item | Type / range | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / row |
|---|---|---|---|---|---|---|---|---|
| `entries.<name>.kind` | exactly `worker` | none | yes | file | selects Worker branch | public | mismatch rejects startup | `CapabilityEntryParameters::Worker` / row 3 |
| `entries.<name>.inboundBodyLimitBytes` | integer `1..16777216` | none | yes | file + bounded env | full encoded envelope gate before borrowed header/payload decode | public | oversize creates no decode/reservation/UoW; no truncation | Worker row 11 |
| `entries.<name>.fetchBatchLimit` | integer `1..10000` | none | yes | file + bounded env | per-source completed deliveries before cooperative yield | public | cannot become business batch, broker prefetch authority or ack count | Worker row 12 |
| `entries.<name>.parallelism` | integer `1..1024` | none | yes | file + bounded env | one global permit gate shared by six runners and continuation | public | per-source multiplication or same-work concurrency is invalid assembly | Worker row 13 |
| `entries.<name>.inboundSources` | object with exactly six named members | none | yes | file only | selects six closed source decisions | public/sensitive-ref by branch | missing/extra slot rejects; detailed in §16 | Worker rows 15~17 |

`inboundCallTimeout` and `collaborationCallTimeout` are copied only from the selected policy section. Worker entry sections carrying either duplicate are rejected.

### 14.4 Jobs entry items

| Configuration item | Type / range | Default | Required | Source | Scope / effect | Sensitivity | Failure | Typed owner / row |
|---|---|---|---|---|---|---|---|---|
| `entries.<name>.kind` | exactly `jobs` | none | yes | file | selects Jobs branch | public | mismatch rejects startup | `CapabilityEntryParameters::Jobs` / row 3 |
| `entries.<name>.requestBodyLimitBytes` | integer `1..16777216` | none | yes | file + bounded env | complete encoded one-shot request gate before typed decode | public | malformed/oversize creates no report/journal/application call | Jobs row 19 |
| `entries.<name>.planningPageLimit` | integer `1..10000` | none | yes | file + bounded env | application planning scan bound | public | not a public cursor/scope default; collect-before-mutate remains mandatory | Jobs row 20 |

`runTimeout` and `runnerRetry` are copied only from `technicalPolicies.<selected>.timeouts.jobsRunMs` and `.jobsRunnerRetry`. No schedule, cron, queue, lease, attempt, ack, target parallelism or runtime execution key is accepted in the Jobs entry section.

## 15. Batch 2 stop review

| Gate | Result |
|---|---|
| root paths and selected-section rules | pass; 5 raw root keys map to the 13-field validated root without a second source |
| single local authority | pass; one binding + at most one selected store section; no per-repository routing |
| clock/id/compatibility/diagnostics | pass; exact closed branches and profile gates |
| timeout catalog | pass; 7/7 exact phase values, one raw source each |
| retry catalog | pass; 4 policies use one exact reusable shape; policy never grants retry eligibility |
| API scalar rows | pass; rows 8~10 closed, timeout projected from policy |
| Worker scalar rows | pass; rows 11~14 closed; six source decisions reserved for batch 3 |
| Jobs scalar rows | pass; rows 19~22 closed; timeout/retry projected from policy |
| implicit semantic defaults | 0 |
| raw secret / execution / marketplace / approval leakage | 0 |
| 03 typed-shape delta | 0 |

Batch 3 may close the nine external Port slots, six Worker source slots, ten outbound route refs and all family-specific material registries. It must preserve the raw-to-typed paths and ranges above.

## 16. Nine external Port binding catalog

### 16.1 Exact slot inventory

`externalPorts` is an object with exactly the following nine fields. Each field is required even when intentionally unavailable.

| Raw slot | Exact application Port | Configured adapter family | Deterministic fixture kind | Callable count | Forbidden responsibility |
|---|---|---|---|---:|---|
| `externalPorts.externalSourceReference` | `ExternalCapabilitySourceReferencePort` | `externalSourceReference` | `externalSourceReference` | 1 | MCP/A2A/API execution, body or provider routing |
| `externalPorts.governanceResultReference` | `GovernanceResultReferencePort` | `governanceResultReference` | `governanceResultReference` | 1 | approval, Policy, vote or workflow truth |
| `externalPorts.methodAssetReference` | `MethodAssetReferencePort` | `methodAssetReference` | `methodAssetReference` | 1 | method body, source or lifecycle ownership |
| `externalPorts.secretReference` | `SecretReferencePort` | `secretReference` | `secretReference` | 1 | secret value, KMS/Vault operation or key custody |
| `externalPorts.externalDocumentReference` | `ExternalDocumentReferencePort` | `externalDocumentReference` | `externalDocumentReference` | 1 | protocol/schema/document body ingestion |
| `externalPorts.capabilityConsumerReference` | `CapabilityConsumerReferencePort` | `capabilityConsumerReference` | `capabilityConsumerReference` | 2 | runtime/tools execution or SDK client/package state |
| `externalPorts.observabilityAuditReference` | `ObservabilityAuditReferencePort` | `observabilityAuditReference` | `observabilityAuditReference` | 1 | telemetry, audit or evidence body ownership |
| `externalPorts.observabilityAuditHandoff` | `ObservabilityAuditHandoffPort` | `observabilityAuditHandoff` | `observabilityAuditHandoff` | 2 | delivery proof, evidence alias or acceptance sign-off |
| `externalPorts.accessEventCollaboration` | `CapabilityAccessEventCollaborationPort` | `accessEventCollaboration` | `accessEventCollaboration` | 4 | local outbox/relay/DLQ/attempt/ack or delivery truth |

Coverage is `9/9 slots` and `14/14 callables`. Slot names, families and call counts are static contracts and cannot be supplied by configuration.

### 16.2 Common binding union

Each slot uses exactly one of these JSON object shapes:

```json
{
  "kind": "configured",
  "adapterRef": "external.source.primary"
}
```

```json
{
  "kind": "deterministicFake",
  "fixtureRef": "external.source.fixture.v1"
}
```

```json
{
  "kind": "disabled"
}
```

| Child path under each slot | Type | Default | Required | Source | Effect / sensitivity | Failure |
|---|---|---|---|---|---|---|
| `kind` | enum `configured`, `deterministicFake`, `disabled` | none | yes | file | startup branch; public | unknown value rejects |
| `adapterRef` | symbolic name into `configuredAdapters` | none | configured only | file only | constructor material; sensitive-ref | missing, wrong-family, orphan or present in another branch rejects |
| `fixtureRef` | symbolic name into `fixtures` with exact slot kind | none | deterministicFake only | file only | parity fixture; sensitive-ref | missing, wrong-kind, orphan or Deployment use rejects |

`disabled` permits no child reference. It constructs the exact family Port returning typed `NotConfigured` when called; it is not omission and never means success. Constructor, probe or runtime failure of a configured branch is not converted to disabled or fake.

### 16.3 `configuredAdapters` section catalog

Every selected configured adapter member has the following common fields. The family is exact and must equal the referencing slot; family sharing is forbidden even when two adapters use the same transport.

| Configuration item under `configuredAdapters.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `family` | one of the nine exact family literals in §16.1 | none | yes | compile-time family discriminator; public | slot/family mismatch rejects |
| `constructorRef` | symbolic name `1..128` | none | yes | selects one binary-registered family constructor; public | unknown or wrong-family constructor rejects assembly |
| `transportRef` | symbolic name into `transports` | none | yes | resolves adapter-private connection handle; sensitive-ref | absent/orphan/wrong-kind rejects |
| `routeRefs` | exact ten-field object | none | only `accessEventCollaboration`; forbidden otherwise | maps ten immutable event families to physical routes; sensitive-ref | missing/extra/wrong route family rejects |

Resolver, handoff and consumer adapter families require a `requestResponse` transport. `accessEventCollaboration` requires one control `requestResponse` transport for its `get/list/repair` surface plus ten `outboundOneWay` route transports for collaboration. `constructorRef` cannot point at a dynamic plugin downloaded from configuration; the binary registration is implementation-owned and closed at startup.

### 16.4 Access-event route-ref object

| Child key under `configuredAdapters.<name>.routeRefs` | Required route family | Logical routing key fixed by formal 03 |
|---|---|---|
| `capabilityIdentityChanged` | `capabilityIdentityChanged` | `capability-hub.identity.changed.v1` |
| `capabilityRegistryChanged` | `capabilityRegistryChanged` | `capability-hub.registry.changed.v1` |
| `adapterDescriptorChanged` | `adapterDescriptorChanged` | `capability-hub.adapter-descriptor.changed.v1` |
| `governanceSeamRelationChanged` | `governanceSeamRelationChanged` | `capability-hub.governance-seam-relation.changed.v1` |
| `capabilityMethodRelationChanged` | `capabilityMethodRelationChanged` | `capability-hub.capability-method-relation.changed.v1` |
| `formalExposureBoundaryChanged` | `formalExposureBoundaryChanged` | `capability-hub.formal-exposure-boundary.changed.v1` |
| `controlledConsumerViewAvailabilityChanged` | `controlledConsumerViewAvailabilityChanged` | `capability-hub.controlled-consumer-view.availability-changed.v1` |
| `capabilityChangeImpactIdentified` | `capabilityChangeImpactIdentified` | `capability-hub.capability-change-impact.identified.v1` |
| `derivedMaterialRefreshed` | `derivedMaterialRefreshed` | `capability-hub.derived-material.refreshed.v1` |
| `referenceResolutionChanged` | `referenceResolutionChanged` | `capability-hub.reference-resolution.changed.v1` |

Each value is a symbolic `outboundRoutes` member name. The key and logical routing key are not configurable values. A route can select only physical transport metadata and never enters the public envelope, canonical digest, capture identity, local state or typed collaboration outcome.

## 17. Six Worker source binding catalog

### 17.1 Exact source-slot inventory

| Child key under `entries.<worker>.inboundSources` | Fixed consumer | Fixed source family | Configured actor refinement |
|---|---|---|---|
| `governanceResultReferenceChanged` | `ConsumeGovernanceResultReferenceChanged` | `governance` | L1-governance integration/system actor |
| `methodAssetReferenceChanged` | `ConsumeMethodAssetReferenceChanged` | `methodLibrary` | L3-method-library integration/system actor |
| `downstreamConsumptionImpactReported` | `ConsumeDownstreamConsumptionImpactReported` | `downstreamConsumer` | declared `runtime`, `tools`, `sdk` or `product` family |
| `externalCapabilitySourceReferenceChanged` | `ConsumeExternalCapabilitySourceReferenceChanged` | `externalCapabilitySource` | declared `mcp`, `a2a` or `externalApi` source kind |
| `auditMaterialReferenceChanged` | `ConsumeAuditMaterialReferenceChanged` | `observabilityAudit` | observability/audit integration actor |
| `externalDocumentReferenceChanged` | `ConsumeExternalDocumentReferenceChanged` | `externalDocument` | external-document integration actor |

All six use schema version `1`. Consumer name, source family, schema, payload DTO and logical event are fixed by this table and are not fields in the raw source binding.

### 17.2 Common source union

Configured source:

```json
{
  "kind": "configured",
  "feedRef": "governance.events.primary",
  "trustedActorRef": "governance.actor.primary"
}
```

Deterministic source:

```json
{
  "kind": "deterministicFake",
  "fixtureRef": "governance.events.fixture.v1"
}
```

Disabled source:

```json
{
  "kind": "disabled"
}
```

| Child path | Type | Default | Required | Source | Effect / sensitivity | Failure |
|---|---|---|---|---|---|---|
| `kind` | enum `configured`, `deterministicFake`, `disabled` | none | yes | file | source task decision; public | unknown value rejects |
| `feedRef` | symbolic name into `inboundFeeds` | none | configured only | file only | physical encoded-envelope feed; sensitive-ref | wrong source family/kind/orphan rejects |
| `trustedActorRef` | symbolic name into `trustedActors` | none | configured only and independent from feed | file only | compiles body-free actor matcher; sensitive-ref | missing/family/refinement mismatch rejects |
| `fixtureRef` | symbolic name into `fixtures` of exact source kind | none | fake only | file only | encoded-envelope parity fixture; sensitive-ref | Deployment, wrong-kind or body-bearing config rejects |

Disabled creates no task, fetch, decode, application call, receipt, action or physical completion. A configured source that ends unexpectedly is a runtime source failure, not a config-driven clean end. Configuration never supplies ack, offset, lease, consumer retry, queue or DLQ behavior.

### 17.3 `inboundFeeds` items

| Configuration item under `inboundFeeds.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `family` | enum `governance`, `methodLibrary`, `downstreamConsumer`, `externalCapabilitySource`, `observabilityAudit`, `externalDocument` | none | yes | fixed source-family gate; public | slot mismatch rejects |
| `constructorRef` | symbolic name | none | yes | binary-registered encoded-envelope feed driver; public | unknown/wrong family rejects assembly |
| `transportRef` | symbolic name into `transports` of kind `inboundStream` | none | yes | physical feed connection; sensitive-ref | missing/orphan/wrong-kind rejects |

There is no raw consumer name, schema version, payload decoder, logical event, event identity, retry disposition, ack mode or body codec field. The feed returns one complete encoded envelope or a typed source failure and cannot truncate to the configured body bound.

### 17.4 `trustedActors` items

| Configuration item under `trustedActors.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `family` | same six-value source-family enum | none | yes | limits matcher to one exact source slot family; public | slot/family mismatch rejects |
| `actorRefs` | array of `1..64` unique safe opaque actor refs, each `1..256` UTF-8 bytes without control characters | none | yes, non-empty | accepted integration/system identities; sensitive-ref | empty/duplicate/over-bound/control character rejects |
| `downstreamConsumerFamilies` | unique enum array from `runtime`, `tools`, `sdk`, `product` | none | only downstreamConsumer, non-empty | refines actor authority against payload consumer family; public | missing/other-family presence/unknown value rejects |
| `externalSourceKinds` | unique enum array from `mcp`, `a2a`, `externalApi` | none | only externalCapabilitySource, non-empty | refines actor authority against decoded typed source kind; public | missing/other-family presence/unknown value rejects |

Actor matching never derives authority from endpoint, topic, credential, payload free text or source actor display text. Actor refs are safe opaque identities, not credentials; raw credential material remains forbidden.

## 18. Outbound route section catalog

### 18.1 `outboundRoutes` exact families

| Route family literal | Fixed schema ref | Required source union | Configuration may choose |
|---|---|---|---|
| `capabilityIdentityChanged` | `capability-hub.outbound/CapabilityIdentityChanged@1` | `Change(Identity)` | one `outboundOneWay` transport only |
| `capabilityRegistryChanged` | `capability-hub.outbound/CapabilityRegistryChanged@1` | `Change(Registry)` | one `outboundOneWay` transport only |
| `adapterDescriptorChanged` | `capability-hub.outbound/AdapterDescriptorChanged@1` | `Change(Descriptor)` | one `outboundOneWay` transport only |
| `governanceSeamRelationChanged` | `capability-hub.outbound/GovernanceSeamRelationChanged@1` | `Change(GovernanceSeam)` | one `outboundOneWay` transport only |
| `capabilityMethodRelationChanged` | `capability-hub.outbound/CapabilityMethodRelationChanged@1` | `Change(MethodRelation)` | one `outboundOneWay` transport only |
| `formalExposureBoundaryChanged` | `capability-hub.outbound/FormalExposureBoundaryChanged@1` | `Change(Exposure)` | one `outboundOneWay` transport only |
| `controlledConsumerViewAvailabilityChanged` | `capability-hub.outbound/ControlledConsumerViewAvailabilityChanged@1` | `DerivedMaterial(ControlledConsumerView)` | one `outboundOneWay` transport only |
| `capabilityChangeImpactIdentified` | `capability-hub.outbound/CapabilityChangeImpactIdentified@1` | `Impact` | one `outboundOneWay` transport only |
| `derivedMaterialRefreshed` | `capability-hub.outbound/DerivedMaterialRefreshed@1` | allowed four derived-material families | one `outboundOneWay` transport only |
| `referenceResolutionChanged` | `capability-hub.outbound/ReferenceResolutionChanged@1` | `ReferenceResolution` | one `outboundOneWay` transport only |

Each `outboundRoutes.<name>` member has exactly:

| Configuration item | Type | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `family` | one exact family literal above | none | yes | proves route-ref/family symmetry; public | mismatch or duplicate family rejects |
| `constructorRef` | symbolic name | none | yes | binary-registered route driver; public | unregistered/wrong family rejects assembly |
| `transportRef` | symbolic name into `transports` of kind `outboundOneWay` | none | yes | physical destination connection; sensitive-ref | orphan/wrong-kind rejects |

The route section has no schema, logical key, payload mapping, source classifier, digest, capture identity, local event state, delivery status, retry class or external intent field. Ten selected route members must be distinct by name and cover all ten families exactly once; transports may be shared only if the constructor can preserve independent route identity.

## 19. Product-neutral material registries

### 19.1 `transports` items

| Configuration item under `transports.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `kind` | enum `durableStore`, `requestResponse`, `inboundStream`, `outboundOneWay` | none | yes | constrains legal ref consumers; public | wrong-kind reference rejects |
| `constructorRef` | symbolic name | none | yes | binary-registered product-neutral transport constructor; public | unregistered/wrong-kind rejects assembly |
| `endpointRef` | symbolic name into `endpoints` | none | yes | supplies one resolved address; sensitive-ref | missing/orphan rejects |
| `credentialRef` | symbolic name into `credentialRefs` | none | no | secret-provider lookup descriptor; secret-ref | wrong-family/orphan or raw credential rejects |
| `tlsPolicyRef` | symbolic name into `tlsPolicies` | none | no | TLS material policy; sensitive-ref | incompatible endpoint/profile or orphan rejects |

No `settings`, headers, request body, arbitrary options map, route/quota/cost/failover, retry, timeout or protocol schema fields are accepted. Product-specific requirements outside these fields trigger controlled reopen before implementation.

### 19.2 `endpoints` items

| Configuration item under `endpoints.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `kind` | enum `network`, `localSocket` | none | yes | constrains transport/TLS validation; public | unknown value rejects |
| `address` | absolute URI string `1..2048` UTF-8 bytes; no control, whitespace, userinfo or fragment | none | yes | adapter-private endpoint locator; sensitive-ref | malformed URI, embedded credential, unsupported constructor scheme or over-bound rejects |

URI query parameters are allowed only when the selected constructor declares them non-secret at implementation design closure; until then, a query component is rejected. Endpoint values never enter public errors, metrics, events, reports or config digests in clear text.

### 19.3 `credentialRefs` items

| Configuration item under `credentialRefs.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `kind` | enum `token`, `password`, `connectionCredential`, `trustBundle`, `clientCertificate`, `privateKey` | none | yes | validates consumer expectation; sensitive-ref | wrong-kind use rejects |
| `providerRef` | symbolic secret-provider registration name `1..128` ASCII bytes | none | yes | identifies deployment-owned secret provider adapter; secret-ref | missing/unregistered provider rejects assembly |
| `secretLocatorRef` | opaque safe locator `1..512` UTF-8 bytes, no control characters | none | yes | lookup pointer only; secret-ref | empty/over-bound/raw secret pattern rejects |
| `versionRef` | opaque safe version `1..128` UTF-8 bytes, no control characters | absent | no | optional startup pin; secret-ref | malformed value rejects; missing version never authorizes latest-value logging |

This registry stores only references. It never contains token, password, DSN, private key, certificate body, provider response or decrypted value. Secret-provider selection and injection are closed in Step 8; inability to resolve a required ref blocks startup.

### 19.4 `tlsPolicies` items

| Configuration item under `tlsPolicies.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `mode` | enum `disabled`, `serverAuthenticated`, `mutualTls` | none | yes | selects closed transport security branch; public | unknown or profile/endpoint-incompatible mode rejects |
| `minimumVersion` | exactly `tls1.3` | fixed explicit | required unless mode disabled; forbidden when disabled | fixed compatibility; public | alias/lower version rejects |
| `trustBundleRef` | credential ref kind `trustBundle` | none | serverAuthenticated or mutualTls | trust anchor lookup; secret-ref | missing/wrong-kind rejects |
| `clientCertificateRef` | credential ref kind `clientCertificate` | none | mutualTls only | client identity certificate lookup; secret-ref | missing/wrong-kind/other-mode presence rejects |
| `clientPrivateKeyRef` | credential ref kind `privateKey` | none | mutualTls only | client private-key lookup; secret-ref | missing/wrong-kind/other-mode presence rejects |

Network transports in Deployment require `serverAuthenticated` or `mutualTls`. `disabled` is allowed only for a local socket or an explicitly reviewed Local/Integration fixture boundary; it is not a downgrade fallback.

### 19.5 `fixtures` items

Each selected fixture member has exactly these fields:

| Configuration item under `fixtures.<name>` | Type / allowed value | Default | Required | Effect / sensitivity | Failure |
|---|---|---|---|---|---|
| `kind` | one of `clock`, `idGenerator`, nine §16 adapter families, or six §17 source slot names | none | yes | exact fixture-family discriminator; public | wrong-kind ref rejects |
| `schemaVersion` | integer exactly `1` | fixed explicit | yes | compatibility gate for fixture loader; public | unknown/future version rejects |
| `artifactRef` | opaque safe fixture artifact ref `1..512` UTF-8 bytes, no controls | none | yes | points to test-owned encoded fixture material; sensitive-ref | missing/unreadable/wrong schema blocks fixture assembly |

Fixture material is outside the runtime JSON and must be de-identified and body-policy compliant. For Worker sources it must generate complete encoded envelopes and traverse the same header/actor/schema/payload path. For external Ports it must return the same typed carriers and negative classes. A fixture never proves real connectivity, delivery, evidence, acceptance or implementation completion.

## 20. Registry reachability, sharing and cycle rules

| Registry edge | Allowed target | Sharing rule | Prohibited edge |
|---|---|---|---|
| local durable store -> transport | `durableStore` | one selected store only; transport can be dedicated | store -> adapter/feed/route |
| configured external adapter -> transport | `requestResponse` | same transport may be shared by same security/constructor compatibility | adapter -> another adapter |
| configured collaboration -> routeRefs | ten exact outbound routes | no route family reuse; physical transport may share | route ref for resolver/handoff family |
| configured Worker source -> feed + actor | exact source family | feed transport may share; matcher identity remains per source family | feed ref used as actor authority |
| feed -> transport | `inboundStream` | transport may be shared only with independent runner identity preserved | feed -> route or fixture |
| route -> transport | `outboundOneWay` | shared physical connection allowed | route -> event/schema/source override |
| transport -> endpoint/credential/TLS | exact material families | endpoint or credential may be shared after compatibility validation | material -> transport back-reference |
| TLS -> credential refs | trust/cert/key compatible refs | cert/key pair can be shared only by deployment policy | credential/TLS cycles |
| fixture | external artifact ref only | one fixture may have one exact kind only | fixture -> production credential/endpoint or another fixture |

The reference graph is acyclic. Every declared member must be reachable from the selected runtime graph, and every reference target must be used by an allowed consumer. Orphan sections, wrong-family reuse, case-colliding names and cycles fail validation. Sharing does not merge the identity of Ports, source runners, event routes or credentials.

## 21. Batch 3 stop review

| Gate | Result |
|---|---|
| external Port slots | pass; 9/9 slots, 14/14 callables, exact configured/fake/disabled union |
| Worker source slots | pass; 6/6 fixed consumer/family/schema mappings |
| outbound routes | pass; 10/10 families and source/schema identities remain static |
| configured adapter material | pass; family + registered constructor + typed transport; no arbitrary settings map |
| feed and actor authority separation | pass; physical feed never defines trusted actor/logical family |
| endpoint/transport/TLS/credential refs | pass; product-neutral, bounded and ref-only |
| fixture parity | pass; 17 closed kinds and no real-evidence claim |
| orphan/wrong-family/cycle handling | pass; all reject before assembly |
| raw secret/body/provider route/quota/cost | 0 |
| runtime/tools execution, marketplace, approval, method body, SDK product | 0 |
| 03 typed-shape delta | 0; all material remains adapter-private or maps existing config refs |

Batch 4 may now define the bounded environment allowlist, profile-specific item matrix and exact 27-row traceability. It cannot add new raw paths or make named registries environment-addressable.

## 22. Bounded environment overlay allowlist

### 22.1 Bootstrap selectors

Bootstrap selectors select one document; they never replace document content.

| Environment variable | Value grammar | Target / behavior | Failure |
|---|---|---|---|
| `QUANTALITHOS_CAPABILITY_HUB_CONFIG_FILE` | one non-empty filesystem path supplied by the host | selects the sole strict JSON document | absent uses the operations-owned conventional path; empty/unreadable/multiple selectors fail startup |
| `QUANTALITHOS_CAPABILITY_HUB_EXPECTED_PROFILE` | `local`, `integration`, `deployment` | assertion against `runtime.profile`; does not override it | mismatch or invalid literal fails startup |
| `QUANTALITHOS_CAPABILITY_HUB_EXPECTED_ENTRY` | `api`, `worker`, `jobs` | assertion against `runtime.entry`; does not override it | mismatch or invalid literal fails startup |

CLI may expose equivalent single-value selectors `--config-file`, `--expected-profile` and `--expected-entry`. CLI and environment selectors may not both provide different values. There is no `--set`, JSON pointer, repeated merge flag or raw secret CLI argument.

### 22.2 Content overlay allowlist

All content env values are UTF-8 strings parsed into the exact JSON leaf type, then passed through the same range and cross-field validator. An invalid present env value fails and never falls back to JSON.

| Environment variable | Exact JSON target | Parse rule |
|---|---|---|
| `QUANTALITHOS_CAPABILITY_HUB_PROFILE` | `runtime.profile` | closed enum string |
| `QUANTALITHOS_CAPABILITY_HUB_ENTRY` | `runtime.entry` | closed enum string |
| `QUANTALITHOS_CAPABILITY_HUB_ENTRY_CONFIG_REF` | `runtime.entryConfigRef` | symbolic name grammar |
| `QUANTALITHOS_CAPABILITY_HUB_RUNTIME_POLICY_CONFIG_REF` | `runtime.runtimePolicyConfigRef` | symbolic name grammar |
| `QUANTALITHOS_CAPABILITY_HUB_STORE_REF` | `localPersistence.binding.storeRef` | symbolic name; only valid for durable branch |
| `QUANTALITHOS_CAPABILITY_HUB_DIAGNOSTICS_MODE` | `diagnostics.mode` | `off` or `redacted` |
| `QUANTALITHOS_CAPABILITY_HUB_API_REQUEST_BODY_LIMIT_BYTES` | selected API entry `requestBodyLimitBytes` | base-10 integer, no sign/space/exponent |
| `QUANTALITHOS_CAPABILITY_HUB_API_PUBLIC_PAGE_LIMIT` | selected API entry `publicPageLimit` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_WORKER_INBOUND_BODY_LIMIT_BYTES` | selected Worker entry `inboundBodyLimitBytes` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_WORKER_FETCH_BATCH_LIMIT` | selected Worker entry `fetchBatchLimit` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_WORKER_PARALLELISM` | selected Worker entry `parallelism` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_JOBS_REQUEST_BODY_LIMIT_BYTES` | selected Jobs entry `requestBodyLimitBytes` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_JOBS_PLANNING_PAGE_LIMIT` | selected Jobs entry `planningPageLimit` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_API_CALL_MS` | selected policy `timeouts.apiCallMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_WORKER_INBOUND_CALL_MS` | selected policy `timeouts.workerInboundCallMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_WORKER_COLLABORATION_CALL_MS` | selected policy `timeouts.workerCollaborationCallMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_JOBS_RUN_MS` | selected policy `timeouts.jobsRunMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_EXTERNAL_PORT_CALL_MS` | selected policy `timeouts.externalPortCallMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_LOCAL_STORE_CALL_MS` | selected policy `timeouts.localStoreCallMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_TIMEOUT_COMMIT_OBSERVATION_MS` | selected policy `timeouts.commitObservationMs` | base-10 integer |
| `QUANTALITHOS_CAPABILITY_HUB_INTERNAL_SCAN_PAGE_LIMIT` | selected policy `internalScanPageLimit` | base-10 integer |

Retry subobjects, nine external slot decisions, six Worker source decisions, route refs, constructor refs, named registry members, endpoint addresses, credential refs, TLS refs and fixture refs are file-only. This prevents environment variable explosion, family substitution and environment-created graph members. Secret values are not allowlisted.

### 22.3 Overlay conflict rules

| Scenario | Result |
|---|---|
| env variable targets an unselected entry | reject; no dormant cross-entry overlay |
| env variable supplies conditional `storeRef` while branch is inMemory | reject |
| two names attempt the same semantic leaf | no aliases exist; any unknown legacy alias is rejected by deployment validation |
| JSON value valid, env value invalid | reject; no lower-priority fallback |
| environment supplies empty string | treat as present invalid value, not absence |
| process environment contains unrelated variables | ignored by this parser; variables using reserved prefix but not on allowlist are rejected |
| environment tries to carry raw secret/body/endpoint | no mapped target; reserved-prefix attempt rejects and safe diagnostic excludes value |

## 23. Profile-specific item matrix

| Configuration group | Local | Integration | Deployment | Hard failure |
|---|---|---|---|---|
| `runtime` | schema 1; Local profile; one entry | schema 1; Integration; one entry | schema 1; Deployment; one entry | mismatch/unknown blocks Stage 0 |
| local authority | inMemory or durable | inMemory or durable, semantic parity required | durable only | missing, second authority or Deployment inMemory blocks |
| external Port slots | configured/fake/disabled | configured/fake/disabled | configured/disabled | any missing slot or fake in Deployment blocks |
| Worker source slots | configured/fake/disabled when Worker selected | same | configured/disabled | six-slot incompleteness or fake in Deployment blocks |
| collaboration routes | 10 routes iff configured | same | same | configured with fewer/more/wrong family blocks |
| clock / ID | system or deterministic | system or deterministic | system only | deterministic under Deployment blocks |
| compatibility | fixed explicit v1 pair | same | same | any alternative blocks |
| policy / entry scalars | all explicit within bounds | same | same | no environment-specific implicit default |
| diagnostics | off or redacted | off or redacted | off or redacted | raw/full/verbose blocks |
| endpoint / transport / credential / TLS | optional only when no selected configured material needs it | selected configured refs resolve exactly | selected configured refs resolve; network TLS authenticated; secret provider approved by deployment | orphan, wrong-kind, missing selected ref blocks |
| fixtures | explicit selected fake/deterministic branches only | same | no selected fixture refs | selected fixture in Deployment blocks; unused fixture is orphan and blocks everywhere |

Environment-purpose labels remain those in Step 6: local development and deterministic CI map to Local or Integration as declared; integration-like and operations replay map to Integration; staging-like and production-like are Deployment direction only. No row asserts real deployment readiness or external success.

## 24. Canonical 27-row raw-to-typed traceability

| # | Canonical typed item | Sole raw path / source | Validation / profile gate | Owner / effect | CP / class | 03 impact |
|---:|---|---|---|---|---|---|
| 1 | schema version | `runtime.schemaVersion` | integer exactly 1 | parser schema gate | CP-01 / startup | none |
| 2 | runtime profile | `runtime.profile` | closed enum; binding matrix | parser -> builder | CP-01 / startup | none |
| 3 | selected entry | `runtime.entry` + selected `entries.<ref>.kind` as discriminator symmetry, not two values | exact equality; one selected member | selected composition root | CP-01 / startup | none |
| 4 | local persistence | `localPersistence.binding` + selected store material | one authority; Deployment durable | local adapter builder | CP-02 / startup+sensitive ref | none |
| 5 | external Port slots | nine exact `externalPorts.*` unions | 9/9; profile/family gate | Stage 4 external graph | CP-06 / peripheral | none |
| 6 | clock / ID | `clock` and `idGenerator` | two slots; Deployment system | `clock_id.rs` | CP-03 / startup+fixture | none |
| 7 | compatibility | `compatibility.protocolCodec`, `.digest` | fixed v1 pair | codec/digest assembly | CP-03 / assertion | none |
| 8 | API request bytes | selected API `requestBodyLimitBytes` | `1..16777216` | API pre-decode | CP-04 / entry technical | none |
| 9 | public Query page limit | selected API `publicPageLimit` | `1..1000`; no clamp | API Query mapper | CP-04 / entry technical | none |
| 10 | API whole-call timeout | selected policy `timeouts.apiCallMs` | `1..600000`; non-cancelling | policy -> API typed projection | CP-04/09 / policy | none |
| 11 | Worker inbound bytes | selected Worker `inboundBodyLimitBytes` | `1..16777216`; full bytes | Worker ingress | CP-05 / entry technical | none |
| 12 | Worker fetch batch | selected Worker `fetchBatchLimit` | `1..10000`; yield only | six source runners | CP-05 / entry technical | none |
| 13 | Worker parallelism | selected Worker `parallelism` | `1..1024`; one global gate | Worker permit gate | CP-05 / entry technical | none |
| 14 | Worker phase deadlines | policy `workerInboundCallMs`, `workerCollaborationCallMs` | each `1..600000`; no redispatch | policy -> Worker projection | CP-05/09 / policy | none |
| 15 | Worker source decisions | six exact selected Worker `inboundSources.*` unions | 6/6; profile/family gate | source resolver -> Worker | CP-05 / peripheral | none |
| 16 | configured feed refs | configured source `feedRef` -> `inboundFeeds` | exact family/transport; conditional | feed constructor | CP-05 / sensitive ref | none |
| 17 | trusted actor refs | configured source `trustedActorRef` -> `trustedActors` | independent exact family/refinement | matcher constructor | CP-05 / sensitive ref | none |
| 18 | configured route refs | configured collaboration `routeRefs` -> ten `outboundRoutes` | 10/10 exact family | publisher route constructors | CP-07 / sensitive ref | none |
| 19 | Jobs request bytes | selected Jobs `requestBodyLimitBytes` | `1..16777216` | Jobs pre-decode | CP-08 / entry technical | none |
| 20 | Jobs planning page | selected Jobs `planningPageLimit` | `1..10000`; collect before mutate | application planning wrapper | CP-08 / entry technical | none |
| 21 | Jobs whole-run timeout | policy `timeouts.jobsRunMs` | `1..86400000`; drain/unknown rules | policy -> Jobs projection | CP-08/09 / policy | none |
| 22 | Jobs runner retry | policy `jobsRunnerRetry` | exact retry shape; durable proof required | safe-reentry controller -> Jobs projection | CP-08/09 / policy | none |
| 23 | external call retry | policy `externalRetry` | exact shape; eligible temporary/timeout only | external wrapper | CP-09 / policy | none |
| 24 | local contention retry | policy `contentionRetry` | rollback+reload+fresh UoW | application wrapper | CP-09 / policy | none |
| 25 | commit observation | `timeouts.commitObservationMs` + `commitObservationRetry` | observation only; no mutation repeat | UoW recovery wrapper | CP-09 / policy | none |
| 26 | internal scan page | policy `internalScanPageLimit` | `1..10000`; not public default | stable scan wrapper | CP-09 / policy | none |
| 27 | diagnostics | `diagnostics.mode` | off/redacted only | infra/entry safe observer | CP-10 / diagnostics | none |

Traceability arithmetic: `27/27 rows`, `27/27 sole raw responsibility mappings`, `0 split rows`, `0 merged rows`, `0 independent duplicate values`, `0 typed-shape deltas`. Row 3's entry discriminator is a structural equality assertion; row 25 intentionally consists of timeout plus retry as already defined by formal 03.

## 25. Configuration-domain stop reviews

| Domain | Completeness checked | Source/profile/failure checked | Sensitive classification | Result |
|---|---|---|---|---|
| root/profile/entry | schema + five root leaves + selected section equality | yes | refs classified | pass |
| local authority | branch + store constructor/transport | yes | store/transport refs sensitive | pass |
| technical primitives | clock/id/fixed compatibility | yes | fixture refs sensitive | pass |
| technical policy | 7 timeout + 4 retry + scan | yes | public technical values | pass |
| API entry | body/page + policy timeout projection | yes | public | pass |
| Worker entry/source | 3 scalar + 2 timeout + 6 decisions + feed/actor | yes | feed/actor refs sensitive | pass |
| Jobs entry | 2 scalar + timeout/retry projections | yes | public | pass |
| external Port graph | 9 unions + configured/fake/disabled material | yes | adapter/transport refs sensitive | pass |
| outbound collaboration | ten exact route refs/material | yes | route/endpoint/credential/TLS sensitive | pass |
| diagnostics | off/redacted | yes | output policy, no raw values | pass |

## 26. Batch 4 stop review

| Gate | Result |
|---|---|
| bootstrap selector boundary | pass; three assertions/selectors, no content mutation |
| bounded content env allowlist | pass; 21 exact scalar/ref leaves |
| reserved-prefix unknown env handling | reject, value-free diagnostic |
| named registry / structure env override | 0 allowed |
| raw secret/body env variables | 0 allowed |
| profile matrix | pass; Local/Integration/Deployment only |
| canonical traceability | pass; 27/27, no split/merge/duplicate source |
| control-plane coverage | pass; CP-01~CP-10 |
| per-domain stop reviews | 10/10 pass |
| 03 writeback | 0 |

Batch 5 may add strict JSON module demos and item explanation tables for root, local authority, primitives, policy and entries. Demos must obey this exact catalog and may not establish implicit defaults.

## 27. Batch 5 core-module strict JSON demos

All code blocks in §§27~28 are strict JSON fragments. They demonstrate valid module shapes only; they are not standalone complete runtime documents and do not create defaults.

### 27.1 `runtime` configuration demo

```json
{
  "runtime": {
    "schemaVersion": 1,
    "profile": "integration",
    "entry": "worker",
    "entryConfigRef": "worker.primary",
    "runtimePolicyConfigRef": "policy.primary"
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `runtime.schemaVersion` | integer | `1` | selects strict schema | exactly 1 | reject document |
| `runtime.profile` | enum string | `integration` | constrains all binding branches | exact lowerCamelCase literal | reject unknown/incompatible graph |
| `runtime.entry` | enum string | `worker` | selects one composition root | one of api/worker/jobs | reject variant mismatch |
| `runtime.entryConfigRef` | symbolic name | `worker.primary` | selects one entry member | member exists and kind equals entry | reject missing/wrong/orphan |
| `runtime.runtimePolicyConfigRef` | symbolic name | `policy.primary` | selects one policy member | exactly one reachable policy | reject missing/wrong/orphan |

### 27.2 `localPersistence` configuration demo

```json
{
  "localPersistence": {
    "binding": {
      "kind": "durable",
      "storeRef": "store.primary"
    },
    "stores": {
      "store.primary": {
        "constructorRef": "durable-authority.v1",
        "transportRef": "store.transport.primary"
      }
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `binding.kind` | enum | `durable` | selects one authority family | Deployment requires durable | reject unsupported/profile mismatch |
| `binding.storeRef` | symbolic name | `store.primary` | selects one durable store section | durable only; exact target | reject absent/orphan/wrong family |
| `stores` | named object | one member | supplies selected authority constructor material | selected graph max one; no orphan | reject extra/unselected member |
| `constructorRef` | symbolic name | `durable-authority.v1` | chooses binary-registered authority constructor | registration and family must match | assembly fail-fast |
| `transportRef` | symbolic name | `store.transport.primary` | resolves product-neutral durable transport | transport kind durableStore | reject missing/wrong kind |

An in-memory fragment still includes an explicit empty registry:

```json
{
  "localPersistence": {
    "binding": {
      "kind": "inMemory"
    },
    "stores": {}
  }
}
```

### 27.3 `externalPorts` configuration demo

```json
{
  "externalPorts": {
    "externalSourceReference": {
      "kind": "configured",
      "adapterRef": "external.source.primary"
    },
    "governanceResultReference": {
      "kind": "deterministicFake",
      "fixtureRef": "governance.reference.fixture.v1"
    },
    "methodAssetReference": { "kind": "disabled" },
    "secretReference": { "kind": "disabled" },
    "externalDocumentReference": { "kind": "disabled" },
    "capabilityConsumerReference": { "kind": "disabled" },
    "observabilityAuditReference": { "kind": "disabled" },
    "observabilityAuditHandoff": { "kind": "disabled" },
    "accessEventCollaboration": {
      "kind": "configured",
      "adapterRef": "event.collaboration.primary"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| each nine named slot | closed binding object | configured/fake/disabled | forms total external Port graph | exactly 9 fields; no omission | startup reject |
| `kind` | enum | `configured` | selects exact branch | Deployment forbids fake | startup reject |
| `adapterRef` | symbolic name | `external.source.primary` | resolves same-family configured section | configured only | reject missing/wrong/orphan |
| `fixtureRef` | symbolic name | `governance.reference.fixture.v1` | resolves same-family parity fixture | fake only; Local/Integration | reject Deployment/wrong-kind |
| disabled branch | object with only kind | `{ "kind": "disabled" }` | constructs typed unavailable Port | no child refs | reject child material; never fake success |

### 27.4 `clock` configuration demo

```json
{
  "clock": {
    "kind": "deterministic",
    "fixtureRef": "clock.fixture.v1"
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `clock.kind` | enum | `deterministic` | selects sole application clock | system or deterministic; Deployment system only | reject profile mismatch |
| `clock.fixtureRef` | symbolic name | `clock.fixture.v1` | resolves deterministic clock fixture | deterministic only, kind clock | reject missing/wrong/orphan |

### 27.5 `idGenerator` configuration demo

```json
{
  "idGenerator": {
    "kind": "system"
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `idGenerator.kind` | enum | `system` | selects sole typed ID source | system or deterministic; Deployment system only | reject unknown/profile mismatch |
| `idGenerator.fixtureRef` | symbolic name | absent | deterministic fixture selector | required only for deterministic and forbidden for system | reject branch-shape mismatch |

### 27.6 `compatibility` configuration demo

```json
{
  "compatibility": {
    "protocolCodec": "stableSurfaceV1",
    "digest": "sha256V1"
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `protocolCodec` | fixed enum | `stableSurfaceV1` | asserts stored/public wire compatibility | only exact v1 literal | reject any alternative |
| `digest` | fixed enum | `sha256V1` | asserts canonical digest compatibility | only exact v1 literal | reject any alternative |

### 27.7 `technicalPolicies` configuration demo

```json
{
  "technicalPolicies": {
    "policy.primary": {
      "timeouts": {
        "apiCallMs": 30000,
        "workerInboundCallMs": 30000,
        "workerCollaborationCallMs": 15000,
        "jobsRunMs": 900000,
        "externalPortCallMs": 5000,
        "localStoreCallMs": 5000,
        "commitObservationMs": 10000
      },
      "externalRetry": {
        "attempts": 3,
        "delay": {
          "initialMs": 100,
          "maximumMs": 1000,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 50
        }
      },
      "contentionRetry": {
        "attempts": 3,
        "delay": {
          "initialMs": 10,
          "maximumMs": 100,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 10
        }
      },
      "commitObservationRetry": {
        "attempts": 4,
        "delay": {
          "initialMs": 50,
          "maximumMs": 500,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 25
        }
      },
      "jobsRunnerRetry": {
        "attempts": 2,
        "delay": {
          "initialMs": 250,
          "maximumMs": 1000,
          "multiplierNumerator": 1,
          "multiplierDenominator": 1,
          "maximumJitterMs": 50
        }
      },
      "internalScanPageLimit": 200
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `timeouts.*Ms` | integer milliseconds | `5000` | seven exact phase deadlines | phase-specific inclusive bounds | reject missing/out-of-range; no default |
| each retry `attempts` | integer total attempts | `3` | caps already-authorized retry | 1..8; includes initial | reject invalid; never grants eligibility |
| `delay.initialMs` / `maximumMs` | integer ms | `100` / `1000` | saturating retry delay bounds | initial <= maximum; fit deadline after clipping | reject inconsistent policy |
| multiplier numerator/denominator | positive integer ratio | `2` / `1` | deterministic exact multiplier | ratio 1..16; no float | reject overflow/invalid ratio |
| `maximumJitterMs` | positive integer ms | `50` | caps injected jitter | 1..60000; no deadline extension | reject out-of-range |
| `internalScanPageLimit` | integer items | `200` | internal stable scan page | 1..10000; not public default | reject out-of-range |

### 27.8 `entries` configuration demo

Worker example:

```json
{
  "entries": {
    "worker.primary": {
      "kind": "worker",
      "inboundBodyLimitBytes": 1048576,
      "fetchBatchLimit": 100,
      "parallelism": 16,
      "inboundSources": {
        "governanceResultReferenceChanged": {
          "kind": "configured",
          "feedRef": "governance.events.primary",
          "trustedActorRef": "governance.actor.primary"
        },
        "methodAssetReferenceChanged": { "kind": "disabled" },
        "downstreamConsumptionImpactReported": { "kind": "disabled" },
        "externalCapabilitySourceReferenceChanged": { "kind": "disabled" },
        "auditMaterialReferenceChanged": { "kind": "disabled" },
        "externalDocumentReferenceChanged": { "kind": "disabled" }
      }
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `kind` | enum discriminator | `worker` | matches selected process entry | exact equality with root | reject mismatch |
| `inboundBodyLimitBytes` | integer bytes | `1048576` | full envelope pre-decode limit | 1..16777216; no truncation | reject config; runtime oversize pre-application |
| `fetchBatchLimit` | integer items | `100` | cooperative yield cadence | 1..10000; not business batch/prefetch | reject invalid |
| `parallelism` | integer tasks | `16` | one global independent-work gate | 1..1024; not multiplied by sources | reject invalid/unsafe assembly |
| `inboundSources` | exact six-field object | one configured, five disabled | closes all source decisions | no missing/extra slot | reject incomplete graph |

API and Jobs variants use the same one-member registry rule:

```json
{
  "entries": {
    "api.primary": {
      "kind": "api",
      "requestBodyLimitBytes": 1048576,
      "publicPageLimit": 100
    }
  }
}
```

```json
{
  "entries": {
    "jobs.primary": {
      "kind": "jobs",
      "requestBodyLimitBytes": 1048576,
      "planningPageLimit": 200
    }
  }
}
```

API/Worker/Jobs timeout and Jobs retry fields are deliberately absent: they come only from the selected policy section.

### 27.9 `diagnostics` configuration demo

```json
{
  "diagnostics": {
    "mode": "redacted"
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `diagnostics.mode` | enum | `redacted` | permits only Step 15 allowlisted safe observations | off or redacted; no editable fields | reject raw/full/verbose/unknown |

## 28. Batch 5 stop review

| Gate | Result |
|---|---|
| core top-level module demos | 9/9 strict JSON |
| each demo followed by item explanation | pass |
| demonstrated implicit defaults | 0 |
| duplicate timeout/retry source in entries | 0 |
| external slot cardinality | 9/9 shown |
| Worker source cardinality | 6/6 shown |
| raw secret/body in examples | 0 |
| 03 typed-shape delta | 0 |

Batch 6 may add strict JSON demos for configured adapters, inbound feeds, trusted actors, outbound routes, fixtures, transports, endpoints, credential refs and TLS policies.

## 29. Batch 6 external-material strict JSON demos

### 29.1 `configuredAdapters` demo

```json
{
  "configuredAdapters": {
    "external.source.primary": {
      "family": "externalSourceReference",
      "constructorRef": "external-source-resolver.v1",
      "transportRef": "resolver.transport.primary"
    },
    "event.collaboration.primary": {
      "family": "accessEventCollaboration",
      "constructorRef": "access-event-collaboration.v1",
      "transportRef": "collaboration.control.primary",
      "routeRefs": {
        "capabilityIdentityChanged": "route.identity.primary",
        "capabilityRegistryChanged": "route.registry.primary",
        "adapterDescriptorChanged": "route.descriptor.primary",
        "governanceSeamRelationChanged": "route.governance-seam.primary",
        "capabilityMethodRelationChanged": "route.method-relation.primary",
        "formalExposureBoundaryChanged": "route.exposure.primary",
        "controlledConsumerViewAvailabilityChanged": "route.consumer-view.primary",
        "capabilityChangeImpactIdentified": "route.impact.primary",
        "derivedMaterialRefreshed": "route.derived-material.primary",
        "referenceResolutionChanged": "route.reference-resolution.primary"
      }
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `family` | closed family enum | `externalSourceReference` | proves exact Port family | must equal referencing slot | reject wrong-family |
| `constructorRef` | symbolic name | `external-source-resolver.v1` | selects binary-registered constructor | no dynamic plugin or downloaded code | assembly fail-fast |
| `transportRef` | symbolic name | `resolver.transport.primary` | selects adapter-private request/response transport | exact transport kind | reject missing/wrong-kind |
| `routeRefs` | exact ten-field object | ten named refs | binds collaboration physical destinations | required only for collaboration family; all 10 exact | reject missing/extra/duplicate |

### 29.2 `inboundFeeds` demo

```json
{
  "inboundFeeds": {
    "governance.events.primary": {
      "family": "governance",
      "constructorRef": "encoded-envelope-feed.v1",
      "transportRef": "governance.stream.primary"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `family` | source-family enum | `governance` | exact source isolation | matches Worker slot | reject mismatch |
| `constructorRef` | symbolic name | `encoded-envelope-feed.v1` | chooses feed driver | registered source family | reject unregistered/wrong-family |
| `transportRef` | symbolic name | `governance.stream.primary` | physical stream connection | kind `inboundStream` | reject missing/wrong-kind |

The feed section cannot specify consumer, event literal, schema, payload decoder, ack, lease, offset, retry, queue or DLQ.

### 29.3 `trustedActors` demo

```json
{
  "trustedActors": {
    "governance.actor.primary": {
      "family": "governance",
      "actorRefs": ["governance.integration.system"]
    },
    "downstream.actor.primary": {
      "family": "downstreamConsumer",
      "actorRefs": ["consumer.integration.system"],
      "downstreamConsumerFamilies": ["runtime", "sdk"]
    },
    "external-source.actor.primary": {
      "family": "externalCapabilitySource",
      "actorRefs": ["discovery.integration.system"],
      "externalSourceKinds": ["mcp", "a2a", "externalApi"]
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `family` | source-family enum | `downstreamConsumer` | limits matcher scope | exact slot family | reject mismatch |
| `actorRefs` | unique safe actor-ref array | one opaque ref | accepted integration/system identities | 1..64; no controls/duplicates | reject invalid |
| `downstreamConsumerFamilies` | enum array | `runtime`, `sdk` | refines actor match against payload | only downstream family; non-empty | reject absent/wrong family |
| `externalSourceKinds` | enum array | `mcp`, `a2a`, `externalApi` | refines source actor against typed source kind | only external-source family; non-empty | reject absent/wrong family |

### 29.4 `outboundRoutes` demo

```json
{
  "outboundRoutes": {
    "route.identity.primary": {
      "family": "capabilityIdentityChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.registry.primary": {
      "family": "capabilityRegistryChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.descriptor.primary": {
      "family": "adapterDescriptorChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.governance-seam.primary": {
      "family": "governanceSeamRelationChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.method-relation.primary": {
      "family": "capabilityMethodRelationChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.exposure.primary": {
      "family": "formalExposureBoundaryChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.consumer-view.primary": {
      "family": "controlledConsumerViewAvailabilityChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.impact.primary": {
      "family": "capabilityChangeImpactIdentified",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.derived-material.primary": {
      "family": "derivedMaterialRefreshed",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    },
    "route.reference-resolution.primary": {
      "family": "referenceResolutionChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "events.one-way.primary"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| route member name | symbolic name | `route.identity.primary` | physical route section identity | all selected refs reachable | reject orphan |
| `family` | exact route family | `capabilityIdentityChanged` | preserves fixed event family/source contract | one each of ten families | reject duplicate/missing |
| `constructorRef` | symbolic name | `outbound-route.v1` | selects route driver | registered family constructor | reject unknown |
| `transportRef` | symbolic name | `events.one-way.primary` | selects physical one-way connection | kind `outboundOneWay` | reject wrong kind |

The shared physical transport in this example does not merge logical route identity. Each route remains independently validated and maps only the physical destination.

### 29.5 `transports` demo

```json
{
  "transports": {
    "resolver.transport.primary": {
      "kind": "requestResponse",
      "constructorRef": "transport.request-response.v1",
      "endpointRef": "resolver.endpoint.primary",
      "credentialRef": "resolver.credential.ref",
      "tlsPolicyRef": "resolver.tls.primary"
    },
    "governance.stream.primary": {
      "kind": "inboundStream",
      "constructorRef": "transport.inbound-stream.v1",
      "endpointRef": "governance.endpoint.primary",
      "credentialRef": "governance.credential.ref",
      "tlsPolicyRef": "governance.tls.primary"
    },
    "events.one-way.primary": {
      "kind": "outboundOneWay",
      "constructorRef": "transport.outbound-one-way.v1",
      "endpointRef": "events.endpoint.primary",
      "credentialRef": "events.credential.ref",
      "tlsPolicyRef": "events.tls.primary"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `kind` | enum | `requestResponse` | limits legal consumer refs | exact consumer/transport family | reject wrong kind |
| `constructorRef` | symbolic name | `transport.request-response.v1` | selects registered transport implementation | no arbitrary settings | reject unknown |
| `endpointRef` | symbolic name | `resolver.endpoint.primary` | resolves address metadata | exact endpoint target | reject missing/orphan |
| `credentialRef` | symbolic name | `resolver.credential.ref` | points to provider-owned secret lookup | ref only; no value | reject wrong family/orphan |
| `tlsPolicyRef` | symbolic name | `resolver.tls.primary` | selects closed TLS policy | endpoint/profile compatible | reject incompatible |

### 29.6 `endpoints` demo

```json
{
  "endpoints": {
    "resolver.endpoint.primary": {
      "kind": "network",
      "address": "https://resolver.example.invalid/v1"
    },
    "events.endpoint.primary": {
      "kind": "network",
      "address": "https://events.example.invalid/v1"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `kind` | enum | `network` | constrains endpoint/TLS branch | network or localSocket | reject unknown |
| `address` | bounded URI | `https://resolver.example.invalid/v1` | adapter-private endpoint locator | 1..2048; no userinfo/control/fragment; query rejected until approved | reject malformed/credential-bearing |

The `.invalid` host names are documentation placeholders, not assertions of a reachable service or implementation evidence.

### 29.7 `credentialRefs` demo

```json
{
  "credentialRefs": {
    "resolver.credential.ref": {
      "kind": "connectionCredential",
      "providerRef": "secret-provider.primary",
      "secretLocatorRef": "resolver/connection/primary",
      "versionRef": "version-1"
    },
    "events.credential.ref": {
      "kind": "token",
      "providerRef": "secret-provider.primary",
      "secretLocatorRef": "events/token/primary"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `kind` | closed credential kind | `token` | checks consumer expectation | exact ref kind | reject mismatch |
| `providerRef` | symbolic provider registration | `secret-provider.primary` | selects provider adapter registration | no provider product claim | reject unregistered |
| `secretLocatorRef` | opaque safe locator | `events/token/primary` | points outside config to secret material | no controls/raw pattern; ref only | reject malformed |
| `versionRef` | opaque safe version | `version-1` | optional pin for deterministic lookup | no raw value | reject malformed; no clear logging |

The example contains no token, password, certificate, key or decrypted provider response. It is a reference document only.

### 29.8 `tlsPolicies` demo

```json
{
  "tlsPolicies": {
    "resolver.tls.primary": {
      "mode": "serverAuthenticated",
      "minimumVersion": "tls1.3",
      "trustBundleRef": "resolver.trust-bundle.ref"
    },
    "events.tls.primary": {
      "mode": "mutualTls",
      "minimumVersion": "tls1.3",
      "trustBundleRef": "events.trust-bundle.ref",
      "clientCertificateRef": "events.client-certificate.ref",
      "clientPrivateKeyRef": "events.client-key.ref"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `mode` | enum | `mutualTls` | selects closed transport security branch | profile/endpoint-compatible | reject downgrade/incompatible |
| `minimumVersion` | fixed enum | `tls1.3` | fixes minimum protocol | required unless disabled; exact literal | reject lower/alias |
| `trustBundleRef` | credential ref | `events.trust-bundle.ref` | resolves trust anchors | credential kind `trustBundle` | reject missing/wrong kind |
| `clientCertificateRef` | credential ref | `events.client-certificate.ref` | resolves client certificate | mutualTls only; kind clientCertificate | reject branch mismatch |
| `clientPrivateKeyRef` | credential ref | `events.client-key.ref` | resolves client key | mutualTls only; kind privateKey | reject branch mismatch |

### 29.9 `fixtures` demo

```json
{
  "fixtures": {
    "clock.fixture.v1": {
      "kind": "clock",
      "schemaVersion": 1,
      "artifactRef": "fixture-artifact/clock/v1"
    },
    "governance.reference.fixture.v1": {
      "kind": "governanceResultReference",
      "schemaVersion": 1,
      "artifactRef": "fixture-artifact/governance-reference/v1"
    },
    "governance.events.fixture.v1": {
      "kind": "governanceResultReferenceChanged",
      "schemaVersion": 1,
      "artifactRef": "fixture-artifact/governance-event/v1"
    }
  }
}
```

| Configuration item | Type | Example | Purpose | Constraint / validation | Failure |
|---|---|---|---|---|---|
| `kind` | closed fixture family | `governanceResultReferenceChanged` | preserves exact fake/source family | 17 closed kinds; profile eligible | reject wrong-kind/Deployment |
| `schemaVersion` | integer | `1` | fixture artifact compatibility | exactly 1 | reject future/unknown |
| `artifactRef` | bounded opaque ref | `fixture-artifact/governance-event/v1` | points to test-owned artifact | 1..512; no controls/body in config | reject missing/unreadable |

Fixtures must use the same typed gates as configured bindings. Their artifact contents are not included here and no execution/evidence/acceptance fact is asserted.

## 30. Batch 6 stop review

| Gate | Result |
|---|---|
| configured adapter demo | pass; family/constructor/transport/routes closed |
| inbound feed and actor demos | pass; source and authority remain separate |
| outbound route demo | pass; 10/10 family coverage |
| transport/endpoint demo | pass; no generic settings or raw address credential |
| credential/TLS demo | pass; ref-only and branch-complete |
| fixture demo | pass; exact kind/schema/artifact ref; no real-fact claim |
| orphan/wrong-family/cycle coverage | pass; rejected in catalog rules |
| raw secret/body in examples | 0 |
| provider route/quota/cost/execution/marketplace/approval leakage | 0 |
| 03 typed-shape delta | 0 |

Batch 7 will add one complete JSONC document, document-level cross-item audit, section reachability audit, 27-row/source/profile/failure closure, 03 impact statement and formal §7 handoff draft.

## 31. Complete configuration demo

The following block is a **JSONC documentation example**. Comments explain intent only; the runtime document must remove all comments and remain strict JSON. Placeholder `.invalid` endpoints, constructor names, provider refs and fixture artifact refs are design examples, not implementation facts, connectivity evidence or product selections.

```jsonc
{
  // One immutable Integration/Worker process graph.
  "runtime": {
    "schemaVersion": 1,
    "profile": "integration",
    "entry": "worker",
    "entryConfigRef": "worker.primary",
    "runtimePolicyConfigRef": "policy.primary"
  },
  // One in-memory authority with durable-semantic parity; no hidden store section.
  "localPersistence": {
    "binding": {
      "kind": "inMemory"
    },
    "stores": {}
  },
  // Nine slots are always explicit. Disabled is typed unavailability, not omission.
  "externalPorts": {
    "externalSourceReference": {
      "kind": "configured",
      "adapterRef": "external.source.primary"
    },
    "governanceResultReference": {
      "kind": "deterministicFake",
      "fixtureRef": "governance.reference.fixture.v1"
    },
    "methodAssetReference": { "kind": "disabled" },
    "secretReference": { "kind": "disabled" },
    "externalDocumentReference": { "kind": "disabled" },
    "capabilityConsumerReference": { "kind": "disabled" },
    "observabilityAuditReference": { "kind": "disabled" },
    "observabilityAuditHandoff": { "kind": "disabled" },
    "accessEventCollaboration": {
      "kind": "configured",
      "adapterRef": "event.collaboration.primary"
    }
  },
  "clock": {
    "kind": "deterministic",
    "fixtureRef": "clock.fixture.v1"
  },
  "idGenerator": {
    "kind": "system"
  },
  "compatibility": {
    "protocolCodec": "stableSurfaceV1",
    "digest": "sha256V1"
  },
  // All deadline and retry leaves are explicit. Attempts include the initial call.
  "technicalPolicies": {
    "policy.primary": {
      "timeouts": {
        "apiCallMs": 30000,
        "workerInboundCallMs": 30000,
        "workerCollaborationCallMs": 15000,
        "jobsRunMs": 900000,
        "externalPortCallMs": 5000,
        "localStoreCallMs": 5000,
        "commitObservationMs": 10000
      },
      "externalRetry": {
        "attempts": 3,
        "delay": {
          "initialMs": 100,
          "maximumMs": 1000,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 50
        }
      },
      "contentionRetry": {
        "attempts": 3,
        "delay": {
          "initialMs": 10,
          "maximumMs": 100,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 10
        }
      },
      "commitObservationRetry": {
        "attempts": 4,
        "delay": {
          "initialMs": 50,
          "maximumMs": 500,
          "multiplierNumerator": 2,
          "multiplierDenominator": 1,
          "maximumJitterMs": 25
        }
      },
      "jobsRunnerRetry": {
        "attempts": 2,
        "delay": {
          "initialMs": 250,
          "maximumMs": 1000,
          "multiplierNumerator": 1,
          "multiplierDenominator": 1,
          "maximumJitterMs": 50
        }
      },
      "internalScanPageLimit": 200
    }
  },
  // Exactly one selected entry section; timeout values come only from policy.primary.
  "entries": {
    "worker.primary": {
      "kind": "worker",
      "inboundBodyLimitBytes": 1048576,
      "fetchBatchLimit": 100,
      "parallelism": 16,
      "inboundSources": {
        "governanceResultReferenceChanged": {
          "kind": "configured",
          "feedRef": "governance.events.primary",
          "trustedActorRef": "governance.actor.primary"
        },
        "methodAssetReferenceChanged": { "kind": "disabled" },
        "downstreamConsumptionImpactReported": { "kind": "disabled" },
        "externalCapabilitySourceReferenceChanged": { "kind": "disabled" },
        "auditMaterialReferenceChanged": { "kind": "disabled" },
        "externalDocumentReferenceChanged": { "kind": "disabled" }
      }
    }
  },
  "diagnostics": {
    "mode": "redacted"
  },
  // Adapter families are fixed; constructor and transport refs are startup material.
  "configuredAdapters": {
    "external.source.primary": {
      "family": "externalSourceReference",
      "constructorRef": "external-source-resolver.v1",
      "transportRef": "integration.request-response.primary"
    },
    "event.collaboration.primary": {
      "family": "accessEventCollaboration",
      "constructorRef": "access-event-collaboration.v1",
      "transportRef": "integration.request-response.primary",
      "routeRefs": {
        "capabilityIdentityChanged": "route.identity.primary",
        "capabilityRegistryChanged": "route.registry.primary",
        "adapterDescriptorChanged": "route.descriptor.primary",
        "governanceSeamRelationChanged": "route.governance-seam.primary",
        "capabilityMethodRelationChanged": "route.method-relation.primary",
        "formalExposureBoundaryChanged": "route.exposure.primary",
        "controlledConsumerViewAvailabilityChanged": "route.consumer-view.primary",
        "capabilityChangeImpactIdentified": "route.impact.primary",
        "derivedMaterialRefreshed": "route.derived-material.primary",
        "referenceResolutionChanged": "route.reference-resolution.primary"
      }
    }
  },
  "inboundFeeds": {
    "governance.events.primary": {
      "family": "governance",
      "constructorRef": "encoded-envelope-feed.v1",
      "transportRef": "integration.inbound-stream.primary"
    }
  },
  "trustedActors": {
    "governance.actor.primary": {
      "family": "governance",
      "actorRefs": ["governance.integration.system"]
    }
  },
  // Ten route sections preserve ten independent immutable event families.
  "outboundRoutes": {
    "route.identity.primary": {
      "family": "capabilityIdentityChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.registry.primary": {
      "family": "capabilityRegistryChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.descriptor.primary": {
      "family": "adapterDescriptorChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.governance-seam.primary": {
      "family": "governanceSeamRelationChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.method-relation.primary": {
      "family": "capabilityMethodRelationChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.exposure.primary": {
      "family": "formalExposureBoundaryChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.consumer-view.primary": {
      "family": "controlledConsumerViewAvailabilityChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.impact.primary": {
      "family": "capabilityChangeImpactIdentified",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.derived-material.primary": {
      "family": "derivedMaterialRefreshed",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    },
    "route.reference-resolution.primary": {
      "family": "referenceResolutionChanged",
      "constructorRef": "outbound-route.v1",
      "transportRef": "integration.outbound-one-way.primary"
    }
  },
  // Fixtures point to test-owned artifacts; no fixture body or result is embedded.
  "fixtures": {
    "clock.fixture.v1": {
      "kind": "clock",
      "schemaVersion": 1,
      "artifactRef": "fixture-artifact/clock/v1"
    },
    "governance.reference.fixture.v1": {
      "kind": "governanceResultReference",
      "schemaVersion": 1,
      "artifactRef": "fixture-artifact/governance-reference/v1"
    }
  },
  "transports": {
    "integration.request-response.primary": {
      "kind": "requestResponse",
      "constructorRef": "transport.request-response.v1",
      "endpointRef": "integration.request-response.endpoint",
      "credentialRef": "integration.connection.credential-ref",
      "tlsPolicyRef": "integration.tls.primary"
    },
    "integration.inbound-stream.primary": {
      "kind": "inboundStream",
      "constructorRef": "transport.inbound-stream.v1",
      "endpointRef": "integration.inbound-stream.endpoint",
      "credentialRef": "integration.connection.credential-ref",
      "tlsPolicyRef": "integration.tls.primary"
    },
    "integration.outbound-one-way.primary": {
      "kind": "outboundOneWay",
      "constructorRef": "transport.outbound-one-way.v1",
      "endpointRef": "integration.outbound-one-way.endpoint",
      "credentialRef": "integration.connection.credential-ref",
      "tlsPolicyRef": "integration.tls.primary"
    }
  },
  "endpoints": {
    "integration.request-response.endpoint": {
      "kind": "network",
      "address": "https://resolver.example.invalid/v1"
    },
    "integration.inbound-stream.endpoint": {
      "kind": "network",
      "address": "https://inbound.example.invalid/v1"
    },
    "integration.outbound-one-way.endpoint": {
      "kind": "network",
      "address": "https://outbound.example.invalid/v1"
    }
  },
  // Credential sections contain provider and locator references only, never values.
  "credentialRefs": {
    "integration.connection.credential-ref": {
      "kind": "connectionCredential",
      "providerRef": "secret-provider.primary",
      "secretLocatorRef": "integration/connection/primary"
    },
    "integration.trust-bundle.ref": {
      "kind": "trustBundle",
      "providerRef": "secret-provider.primary",
      "secretLocatorRef": "integration/trust-bundle/primary"
    }
  },
  "tlsPolicies": {
    "integration.tls.primary": {
      "mode": "serverAuthenticated",
      "minimumVersion": "tls1.3",
      "trustBundleRef": "integration.trust-bundle.ref"
    }
  }
}
```

### 31.1 Complete-demo reachability audit

| Registry | Declared | Selected/reachable | Orphan | Family/cycle result |
|---|---:|---:|---:|---|
| technical policies | 1 | 1 | 0 | exact selected policy |
| entries | 1 | 1 | 0 | Worker discriminator symmetric |
| configured adapters | 2 | 2 | 0 | external source + collaboration exact families |
| inbound feeds | 1 | 1 | 0 | governance family |
| trusted actors | 1 | 1 | 0 | governance family |
| outbound routes | 10 | 10 | 0 | ten exact route families |
| fixtures | 2 | 2 | 0 | clock + governance-reference exact kinds |
| transports | 3 | 3 | 0 | requestResponse/inboundStream/outboundOneWay |
| endpoints | 3 | 3 | 0 | network + authenticated TLS |
| credential refs | 2 | 2 | 0 | connectionCredential + trustBundle |
| TLS policies | 1 | 1 | 0 | serverAuthenticated, TLS 1.3 |

The complete example is an Integration graph, so inMemory authority, deterministic clock and one deterministic external fixture are allowed. Converting only `runtime.profile` to Deployment would be invalid; Deployment also requires durable authority, system clock and zero selected fixtures.

## 32. Cross-configuration closure audit

| Audit item | Result | Fixed rule / correction |
|---|---|---|
| top-level module count | pass, 18 | exact inventory in §8.2 |
| generic `storage/common/misc/settings` bucket | 0 | family-specific modules and closed fields only |
| canonical typed rows | pass, 27/27 | §24 preserves row identities |
| raw responsibility duplication | 0 | timeouts/retries originate only in policy; entry receives projection |
| required item without failure strategy | 0 | every required/conditional item fail-fast rule recorded |
| implicit semantic default | 0 | only fixed schema/compatibility assertions and structurally empty unused registries |
| bounded env targets | pass, 21 | no named registry/structure/secret env override |
| profile branches | pass | Local/Integration/Deployment exact matrix; no new enum |
| binding cardinality | pass | local authority 1, external 9, Worker 6, routes 10 when configured |
| Missing conversion | 0 | never converts to disabled/fake/other entry |
| configured failure fallback | 0 | constructor/probe/runtime failure retains exact failure |
| sensitive level omission | 0 | ref/endpoint/transport/credential/TLS/fixture paths classified |
| raw secret/body example | 0 | only symbolic refs and `.invalid` placeholders |
| orphan/wrong-family/cycle acceptance | 0 | all reject before assembly |
| protocol/event/source identity configured | 0 | fixed by formal 03 tables |
| runtime/tools execution | 0 | resolver/reference and handoff only |
| marketplace listing/ranking/transaction | 0 | no configuration surface |
| governance approval/Policy/workflow | 0 | governance reference seam only |
| method body/source/lifecycle | 0 | method asset reference seam only |
| provider route/quota/cost/failover | 0 | excluded from all sections |
| SDK product/client/cache/delivery lifecycle | 0 | consumer reference only; no delivery state |
| test/evidence/run/signoff claim | 0 | examples are design-only placeholders |

## 33. Detailed-design impact determination

| Step 7 conclusion | Changes formal 03? | Reason | Action |
|---|---|---|---|
| strict JSON modules, paths and bounds | no | formal 03 explicitly delegates raw schema/unit/bounds/default/source to 04 | no writeback |
| single raw timeout/retry source with typed projection | no | preserves existing policy and entry typed fields without new field | no writeback |
| adapter/feed/route material registries | no | resolves existing symbolic config refs into adapter-private constructor inputs | no writeback |
| transport/endpoint/credential/TLS neutral schema | no | no value crosses existing constructor/Port boundary; raw secret excluded | no writeback |
| bounded env allowlist | no | source overlay is parser-local and does not add root fields | no writeback |
| parser issue paths/categories | no new enum declared | exact error carrier remains formal 03-owned; Step 9 maps categories to existing surface | no writeback |

Current impact audit: `03 writeback=0`, `blocking confirmation=0`, `upstream blocker=0`. This Step adds no Rust declaration, struct, struct field, enum variant/payload, trait, method or callable; therefore it creates no Rustdoc delta. Any implementation-time need for a new typed value or constructor argument must pause and reopen formal 03 before code.

## 34. Formal §7 assembly draft

Formal `04-配置设计.md` §7 must assemble, without changing semantics:

1. strict JSON/parser naming rules and 18-module inventory from §§8、10；
2. root/local/primitive/policy/entry catalog from §§11~14；
3. nine external Port, six Worker source and ten route catalogs from §§16~18；
4. product-neutral material registries and reachability rules from §§19~20；
5. bounded environment allowlist and profile matrix from §§22~23；
6. canonical 27-row traceability from §24；
7. module-level strict JSON demos and item explanation tables from §§27、29；
8. complete JSONC documentation example and audit from §§31~32；
9. detailed-design impact and controlled-reopen gate from §33。

The formal chapter may compact repeated retry/route rows by referencing one exact reusable shape, but it must retain all names, fields, bounds, required conditions, failure behavior and 27 canonical responsibilities. It must label JSONC as documentation-only and must not claim product selection, runtime readiness, tests, evidence, implementation or sign-off.

## 35. Step 7 completion gate

| Completion condition | Result |
|---|---|
| P0 configuration items complete | pass |
| type/default/required/source/scope/effect/sensitivity/failure/owner columns complete | pass |
| per-domain stop review complete | pass, 10/10 |
| module strict JSON demos complete | pass, 18/18 top-level modules represented |
| item explanation tables complete | pass |
| full JSONC example complete | pass; documentation-only label present |
| complete-example references closed | pass; orphan 0, wrong-family 0, cycles 0 |
| canonical traceability complete | pass, 27/27 |
| cross-item unresolved conflict | 0 |
| detailed-design writeback gap | 0 |
| upstream blocker | 0 |

Step 7 is complete. The next allowed action is Step 8: read the sensitive-configuration SOP/writing rules, Step 5 source boundary, this complete catalog and formal 03 security/observability constraints; then define secret storage, resolution, injection, rotation, output suppression and audit without adding raw secret material.
