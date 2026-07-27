# L3-capability-hub 04 配置设计 Step 9: 配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.9
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §9
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_09_completed_step_10_pending_continuous_execution`
> 正式文档状态: 本 Step 不创建或修改正式 `04-配置设计.md`;正式装配留 Step 15

---

## 1. Step 开工确认与批次计划

| 项目 | 内容 |
|---|---|
| 当前文档 | `04-配置设计.md` |
| 当前 Step | Step 9 `定义配置加载、校验与生效机制` |
| 上游 Step gate | Step 8 已关闭敏感级别、ref/provider 分离、provider-to-exact-constructor 注入、restart-only 轮换、输出抑制和敏感失败边界 |
| 直接上游 | `04_config_step_05_sources_priority_conflicts.md`、`04_config_step_06_environment_profiles_matrix.md`、`04_config_step_07_config_items.md`、`04_config_step_08_sensitive_secrets.md`、正式 `03-详细设计.md` §13.1/§13.9、`03_ddd_step_14_config_external_binding.md` §§14~16/36 |
| 本步目标 | 把唯一 raw reader 的 source selection、strict parse、bounded overlay、结构校验、cross-field 校验、provider resolution、Stage 0~7 assembly 和 activation barrier 写成可直接承接的配置合同 |
| 本步非目标 | 不新增 Rust type/field/variant/trait/method/Port/error/DTO/flow/state；不选择具体数据库、broker、MCP/A2A/API、secret 产品或部署平台；不实现代码、不运行测试、不伪造 readiness/evidence |
| 正式文档 | 不允许在本 Step 创建；仅产出本中间产物和状态台账更新 |
| 当前 blocker | `0`；具体 provider/backend 产品未选定，但属于 implementation/deployment prerequisite，不阻塞本 Step 的产品中立装配规则 |

本 Step 按以下批次写入。每批先阅读已完成上游，再写入对应区段；批次完成后保留可审查停点，不自动把本 Step 结论写进正式 `04`。

| 批次 | 写入内容 | 完成门禁 | 状态 |
|---|---|---|---|
| `9.0` | 开工读取、SOP 问题、问题诊断、加载链、source 选择与 parse/merge contract | source 顺序唯一；无第二 raw reader；无 secret 普通来源；无隐式默认 | completed_stop_review |
| `9.1` | structural/type/range/reference validation 与 18 模块逐域校验矩阵 | 27/27 canonical rows、所有 required/conditional、unknown/duplicate/forbidden/type/range/ref grammar 均有 gate | completed_stop_review |
| `9.2` | cross-field/profile/reachability/family/cycle/TLS/credential 校验与 provider resolution | 交叉规则、profile matrix、provider-to-constructor boundary、failure mapping 均闭合 | completed_stop_review |
| `9.3` | Stage 0~7、entry activation barrier、atomic prefix disposal、startup-only contract | API/Worker/Jobs 均不得提前暴露；partial graph/listener/task/request=0 | completed_stop_review |
| `9.4` | 按配置域停审、跨加载审计、03 impact、回填草稿、待确认和 Step gate | unresolved loading gap=0；03 待回写/阻塞待确认=0；允许 Step 10 | completed_stop_review |

本次写入按 100~300 行批次执行；单批行数限制只约束写入动作，不压缩最终中间产物的配置完整性。

## 2. 本步目标、输出与边界

### 2.1 必须闭合

1. bootstrap selector、唯一配置文件读取、strict JSON parse、bounded environment overlay 的顺序和冲突行为。
2. top-level/module/field 的 duplicate、unknown、forbidden、JSON type、null、长度、数值范围和 symbol grammar 校验。
3. selected profile、selected entry、conditional branch、cardinality、reachability、family、cycle、TLS/credential cross-field 校验。
4. configured provider registration、credential/TLS material resolution 和 exact constructor injection 的时点、所有权、生命周期与失败处理。
5. 正式 `03` Stage 0~7 的配置前置条件、每一阶段的输入/输出/失败门禁与 activation 位置。
6. API/Worker/Jobs 三种 entry 的 exposure barrier，以及 `Configured`、`DeterministicFake`、`Disabled`、`Missing` 的不混淆规则。
7. 任一失败时完整丢弃已构造 prefix，不暴露 partial graph、listener、Worker task 或 Jobs request。
8. startup-only 和 no-hot-reload 约束；不把 Step 10 的变更/审计/回滚细节提前扩展成另一个加载机制。

### 2.2 明确不定义

- 不定义新的 validation enum、public diagnostic API 或 application error；复用正式 `03` 已定义的 `CapabilityConfigValidationIssueKind`、`CapabilityConfigValidationSubject`、`CapabilityConfigValidationIssues` 与 `InfraError::RuntimeAssembly`。
- 不让 JSON/env/CLI 直接携带 raw token、password、DSN credential、private key、certificate/trust body、external body 或 provider response。
- 不允许配置选择 runtime/tools execution、tools execution、marketplace listing、governance approval、method body、provider route/quota/cost/failover、SDK product 或 local delivery lifecycle。
- 不把 `SecretReferencePort` 当作配置 credential provider；它仍是 Hub 业务协议中的 body-free reference resolver。
- 不声明任何真实 provider read、TLS handshake、adapter connection、test run、evidence alias、acceptance signoff 或 implementation commit。

## 3. 本步输入与读取结论

| 输入 | 本步采用的规范性结论 | 本步不继承的内容 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | `constants < strict JSON < bounded env`；invalid present env 不回退 JSON；CLI 只有 selector；named registries file-only | config center/admin override、arbitrary `--set`、secret source |
| `04_config_step_06_environment_profiles_matrix.md` | 只有 `Local`、`Integration`、`Deployment`；四态 binding matrix；Deployment fake=0、durable/system only | 环境别名扩展成新 profile、隐式环境默认 |
| `04_config_step_07_config_items.md` | 18 顶层模块、27/27 raw-to-typed、1 MiB document cap、21 env leaves、closed registries、exact bounds | arbitrary `settings`、wildcard route、unbounded registry、旧 key |
| `04_config_step_08_sensitive_secrets.md` | 四级 sensitivity；protected metadata/ref only；provider 到 exact constructor；restart-only rotation；禁止输出 | 具体 KMS/Vault/cloud product、secret body、hot secret watcher |
| 正式 `03-详细设计.md` §13.1/§13.9 | `infra/config.rs` 是唯一 raw reader；immutable root；Stage 0~7；`InfraError::RuntimeAssembly`；partial prefix 不可见 | 任何未在 03 中声明的 builder、fallback、runtime listener |
| `03_ddd_step_14_config_external_binding.md` §§14~16、36 | candidate 字段、closed issue carrier、validation sequence、profile matrix、constructor graph | 过程文档中的候选数值或旧历史材料 |
| `projects/L1-governance` Step 9 | 按 source/parse/type/cross-field/assemble/expose 的表格粒度表达 | governance 的 approval/outbox/relay 领域配置 |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 裁决 |
|---|---|
| 1. 配置在什么时机加载？ | 进程启动时由选定 entry 的 composition root 触发一次。bootstrap selector 选择一个文件，`infra/config.rs` 读取并构造 candidate；Stage 0~7 全部成功后才把一个 non-Clone handoff 交给 API、Worker 或 Jobs。运行期间不读取 raw source、不监听文件/env、不 hot reload。 |
| 2. 如何 parse 和 type validate？ | 文件必须是严格 UTF-8 JSON；JSONC 只作为文档展示，不能作为 runtime input。reader 直接拒绝 BOM、comments、trailing comma、duplicate/unknown/forbidden/null，再解析闭合 enum、整数、duration、symbolic ref 与 closed variant，最后构造 `CapabilityRuntimeConfigCandidate`。 |
| 3. 哪些配置需要 cross-field validate？ | 所有 branch/ref/cardinality 都需要：profile-entry、entry/policy section kind、Configured/Fake/Disabled/Missing、27/9/6/10 cardinality、registry reachability/family/cycle、single authority、Deployment TLS/credential/fixture、mTLS cert-key-trust 配对、技术 policy 与 entry deadline 嵌套关系。 |
| 4. 哪些配置 startup/reload/hot/build-time/static？ | 27 个 canonical rows 全部 `startup/frozen`。compatibility literal 是固定 schema contract；named registry 和 sensitive material 不能 hot reload。Step 10 只定义未来变更通过新进程 restart 生效，当前不提供 reload API。 |
| 5. 校验失败如何处理？ | 可安全聚合的 issue 按 subject/kind 排序去重后包装为既有 `InfraError::RuntimeAssembly`；raw parser/provider/constructor source 只留在非 public source chain。任一 Stage 失败释放其 owned prefix，不启动 listener、Worker task 或 Jobs request。 |
| 6. 每项生效方式是否与 Step 7 一致？ | 是。每一项均为 parse once -> typed/cross-field validate -> immutable candidate/root -> exact constructor/entry projection；没有 silent clamp、implicit fallback、dormant-entry overlay 或 per-call config lookup。 |
| 7. 每个配置域是否可停审？ | 本 Step 按 root/profile、local authority、technical primitives/policy、API、Worker/source、Jobs、external graph/routes/material、diagnostics 分域；每域都检查 required/type/range/cross-field/failure/effect/03 impact。 |
| 8. 是否存在未校验必填项、cross-field 缺口、热更新无回滚或 builder 回写缺口？ | 当前审计目标为全部闭合。Step 9 不引入 hot update，因此不存在 hot-update rollback surface；future change 统一走 Step 10 restart/rollback。当前 03 impact 预判为 config-only，若实现需要新增 Rust declaration 或 callable，必须受控回开 03。 |

## 5. 当前问题诊断

| 位置/旧倾向 | 风险 | 本步修正 |
|---|---|---|
| 只写“读取 JSON 并校验” | 无法判断 selector、优先级、duplicate、unknown、invalid env 和 parser cap | 固定 bootstrap -> file -> strict parse -> bounded overlay -> same validator 的单一链路 |
| 将 JSONC demo 当运行时格式 | 宽松 parser 会吞掉未知字段或 duplicate key | JSONC 仅为带注释展示；runtime input 不接受 JSONC，也不执行注释预处理，BOM/comments/trailing comma 均直接拒绝 |
| 先构造部分 adapter 再发现 profile/ref 错误 | partial graph、secret handle、listener 可能泄露 | 所有安全可判定校验先完成；Stage failure 统一销毁 owned prefix，material 只在 exact constructor 阶段短暂出现 |
| invalid env 回退 JSON | 高优先级配置错误被隐藏，运行结果不可审计 | present-but-invalid env 直接 reject；不回退、不 clamp、不合并第二个文件 |
| `Missing` 通过 fake/disabled 继续 | 把 schema 不完整误当业务 unavailable | `Missing` 是 startup validation failure；只有显式 `Disabled` 才形成可调用的 `NotConfigured` Port |
| provider failure 转成 fake/disabled | Deployment 可能静默降级，安全边界失效 | configured provider/material/constructor failure fail-closed；profile branch 不变 |
| API/Worker/Jobs 各自实现 reader | source precedence、error carrier 和 profile 语义分叉 | 只有 `infra/config.rs` 读取 raw；entry 只接收 typed projection/handoff |
| 将 technical policy duplicated 到多个 raw section | 同一 timeout/retry 有多个 authority | timeout/retry 只来自 selected `technicalPolicies`，再投影到 entry typed view；duplicate raw authority 拒绝 |

## 6. 改动前后对比

| 维度 | Step 9 前可见口径 | Step 9 收敛口径 | 目的 |
|---|---|---|---|
| source chain | file/env/CLI 规则分散在 Step 5/7 | 一个 bootstrap selector + strict file + bounded env + same validator | 可重放、可审计、可落码 |
| validation | 只有 item-level type/range 表 | structural、type/range、reference、cross-field、profile、constructor 分层 | 阻止 partial graph 和错误 fallback |
| error carrier | 可能把 raw parser error直接暴露 | 复用 closed infra-local issue carrier -> `InfraError::RuntimeAssembly` | 不新增错误 taxonomy、不泄露敏感值 |
| activation | builder 顺序已存在但 barrier 分散 | 明确 Stage 0~7 与 API/Worker/Jobs first-exposure barrier | 确保任何 entry 只拿到完整 handoff |
| secret material | Step 8 已定义注入边界 | Step 9 固定 resolution 在 cross-field 后、exact constructor 内 | 缩短材料生命周期，配置错误不触发 provider fallback |
| runtime mutability | 未明确 reload 行为 | 全部 startup/frozen；hot reload 不适用 | 避免无 rollback 的 live graph mutation |
| 03 回写 | 可能误以为需要新 loader/error | 保持既有 candidate/root/issue/Stage contract，impact=0 | 不静默改代码契约 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决与理由 |
|---|---|---|
| 文件选择 | 多文件深度 merge；单文件 selector | 单文件。多文件 merge 会增加 duplicate/precedence/secret 生命周期和可重放复杂度，Step 7 已闭合一个 strict document |
| env 覆盖 | 任意 JSON pointer；21 个 bounded leaves | bounded leaves。避免环境变量创建 registry member、route、credential 或新的 graph 节点 |
| CLI | arbitrary override；selector only | selector only。CLI 不成为第二配置语言，也不承载 raw secret |
| JSON parser | permissive map；strict closed schema | strict。unknown/duplicate/forbidden 必须在启动前可判定 |
| invalid high-priority value | 回退低优先级；立即失败 | 立即失败。否则实际生效值与审计记录不一致 |
| issue aggregation | 首错即停；安全 issue deterministic aggregate | aggregate safe structural issues，随后统一 fail；provider/raw source 仍只保留非 public cause |
| provider 时机 | parse 阶段读取；cross-field 后 exact constructor | 后者。parser 不接触 secret body，且先验证 ref/family/profile/reachability |
| activation | 每个 entry 分阶段暴露；完整 graph 后一次 handoff | 完整 graph + one non-Clone handoff + entry barrier。防止部分 API/Worker/Jobs 暴露 |
| reload | hot swap；restart-only | restart-only。当前没有 atomic graph swap、watcher 或 rollback API |

## 8. 结构化中间产物: 加载链与 source contract

### 8.1 配置加载流程图: L3-capability-hub 配置加载与校验

```text
[bootstrap selector: file/profile/entry]
  -> [select exactly one JSON document]
  -> [bounded UTF-8 read, <= 1,048,576 bytes]
  -> [strict JSON structural parse]
  -> [reject duplicate/unknown/forbidden/null surfaces]
  -> [parse bounded env leaves and selector assertions]
  -> [merge constants < JSON < bounded env]
  -> [type + length + range validation]
  -> [reference/cardinality/family/reachability/cycle validation]
  -> [profile + cross-field + TLS/credential validation]
  -> [construct CapabilityRuntimeConfigCandidate]
  -> [CapabilityRuntimeConfig::try_from_candidate]
  -> [Stage 0 validate immutable root]
  -> [Stage 1~6 exact constructors,
      provider resolution only where referenced]
  -> [Stage 7 create one non-Clone handoff]
  -> [entry-specific activation barrier]
  -> [one non-Clone API/Worker/Jobs handoff]
```

关键说明:

1. `infra/config.rs` 是唯一 raw reader；任何 entry、application、adapter call 或 Worker source task 都不得再次读取文件、env、CLI 或 registry。
2. source selector 只选择 document 或断言 profile/entry；它不替换 document content。content overlay 只覆盖 Step 7 明确列出的 21 个 leaf。
3. “merge”是已知 typed leaf 的确定性投影，不是任意 object deep merge；没有第二份 raw registry、route、credential 或 secret source。
4. `CapabilityRuntimeConfigCandidate` 只存在于 startup-local parser/validator boundary；只有零 issue 才形成 immutable `CapabilityRuntimeConfig`。
5. provider material 在完整 structural/cross-field/profile validation 后才解析，并只交给引用它的 exact constructor；不能进入 candidate/root/application。

### 8.2 Source lane 与优先级

| Lane | 内容 | 优先级/行为 | 允许范围 | 失败行为 |
|---|---|---|---|---|
| parser constants | schema parser constants、固定 compatibility literal、closed family tags | lowest; 不是用户 override | `schemaVersion=1`、`stableSurfaceV1`、`sha256V1` 等已固定值 | 不可被 env/CLI 改写；future value rejected |
| strict JSON file | 选定 document 的全部 required module、named registry、conditional branch | middle canonical source | 18 modules、all file-only refs/material metadata、all non-overlay values | unreadable/invalid/duplicate/unknown/forbidden/null/type/range/ref error blocks |
| bounded env | 21 exact content leaves plus selector/assertion vars | highest only for mapped leaf; no aliases | Step 7 §22 allowlist | present invalid/empty/wrong branch/unknown reserved prefix blocks; no JSON fallback |
| CLI selector | `--config-file`、`--expected-profile`、`--expected-entry` | selector/assertion only; conflicts with env rejected | no content override, no `--set`, no secret | mismatch/duplicate/different env selector blocks |
| provider registration | deployment-injected provider handle selected after validated ref | not a raw config precedence lane | credential/TLS material resolution only | missing/unavailable/wrong-kind/expired blocks configured branch |
| host conventional path | operations-owned default path when file selector absent | bootstrap location convention, not schema default | one selected file | absent/unreadable path blocks; no alternate search |
| config center/admin | unsupported | no lane | none | reserved-prefix or attempted use is rejected/ignored according source owner; never silently consulted |

### 8.3 Bootstrap and source conflict matrix

| Scenario | Deterministic result | Partial/root behavior |
|---|---|---|
| no file selector, conventional path exists | read exactly that path | continue to strict parse |
| file selector supplied once | read selected path only | continue; no fallback path |
| file selector supplied by both CLI/env with same value | one equivalent selector accepted | continue; value is not content override |
| file selector supplied by CLI/env with different values | `RuntimeAssembly` failure | no document selected, no candidate |
| expected profile/entry assertion absent | no assertion; JSON required value remains authoritative | continue |
| expected assertion differs from selected JSON | validation failure | no candidate/root |
| JSON has valid value, mapped env absent | retain JSON value | continue |
| JSON has valid value, mapped env valid | replace only that leaf before type/cross-field checks | continue |
| JSON has valid value, mapped env empty/invalid | reject high-priority source | never fall back to JSON |
| unrelated environment variable | ignore if outside reserved prefix | no effect |
| unknown `QUANTALITHOS_CAPABILITY_HUB_*` variable | forbidden source surface | no candidate; value excluded from diagnostic |
| raw secret/body/endpoint supplied through env/CLI | forbidden/no target | no candidate; no redacted echo |
| second config file or deep-merge flag | unsupported source | no candidate |

### 8.4 Merge algorithm contract

The implementation must expose one parser-local sequence, conceptually:

```text
select_bootstrap_inputs()
  -> read_selected_document()
  -> parse_strict_document()
  -> parse_bounded_overlays()
  -> apply_overlay_to_declared_leaves()
  -> validate_raw_shape_and_construct_candidate()
```

The names above are process steps, not authorization to add public functions or a second API. The algorithm has these invariants:

| Invariant | Required behavior |
|---|---|
| one document | at most one selected file; no recursive include/import or multi-file merge |
| one raw reader | only `infra/config.rs` opens the file or reads process env/CLI selector inputs |
| bounded allocation | reject document over `1,048,576` bytes before unbounded parse allocation; apply per-name/value bounds from Step 7 |
| exact leaf overlay | env may replace only its named leaf; it may not add/remove object members or change registry cardinality |
| same validation path | file values and env values enter the same JSON-type/range/cross-field validator after overlay |
| no implicit semantic default | omitted required canonical value remains missing; parser/library/environment cannot synthesize it |
| no raw secret | secret material never exists in raw JSON/env/CLI parser values; refs are metadata only |
| immutable handoff | candidate is consumed once by `try_from_candidate`; no clone/export/reload path |

### 8.5 Strict parser structural rules

| Check | Exact rule | Existing issue subject/kind direction |
|---|---|---|
| encoding | input must be valid UTF-8; no replacement decoding | `RuntimeAssembly` source; no raw parser text in public output |
| document size | complete selected bytes `<= 1,048,576`; no truncation | `UnsupportedValue`/assembly source; exact public category deferred to existing carrier |
| root shape | exactly one JSON object root | `MissingRequiredBinding` or `UnsupportedValue` on `SchemaVersion`/`ForbiddenSurface` as applicable |
| top-level modules | required 18 modules, each exactly once; no unknown module | `MissingRequiredBinding`/`DuplicateBinding`/`ForbiddenConfigurationSurface` |
| object members | duplicate keys are rejected before map normalization; unknown keys are not ignored | `DuplicateBinding`/`ForbiddenConfigurationSurface` |
| null | forbidden unless the item catalog explicitly declares nullable; current canonical surface declares none | `UnsupportedValue` |
| strings | closed enum or bounded safe string grammar; no case folding/trim/Unicode normalization | `UnsupportedValue`/`InvalidConfigName` |
| integers | JSON integer only; decimal, exponent, negative, string-unit and float forms rejected where item says integer | `UnsupportedValue` |
| duration | base-10 integer milliseconds only; suffix/unit strings rejected | `UnsupportedValue`/range validation |
| conditional members | branch-required fields present; branch-irrelevant fields absent, not null | `MissingRequiredBinding`/`ForbiddenConfigurationSurface` |
| registry names | `1..128` ASCII bytes, no control/whitespace/path/URI syntax, case-collision rejected | `InvalidConfigName` |
| raw secret patterns | raw token/password/DSN/userinfo/key/cert/trust/body surfaces rejected; refs only | `ForbiddenConfigurationSurface` |
| BOM/comments/trailing comma | allowed only in the human-facing JSONC documentation example; runtime input rejects all three and has no comment preprocessor | syntax cannot be silently accepted as an extension |

### 8.6 Source-to-candidate ownership

| Candidate field | Sole raw authority | Overlay possibility | Construction gate |
|---|---|---|---|
| `schema_version` | `runtime.schemaVersion` + fixed parser literal | none | exact v1 |
| `profile` / `entry` | `runtime.profile` / `runtime.entry` | bounded env + expected assertions | closed enum and assertion equality |
| `local_persistence` | `localPersistence` + selected durable material | `storeRef` only when durable | one authority/profile branch |
| `external_ports` | nine named `externalPorts` slots + referenced adapter/material sections | slot decisions file-only | 9/9 family/cardinality/profile |
| `clock` / `id_generator` | `clock` / `idGenerator` | none | system/deterministic profile matrix |
| `compatibility` | fixed `compatibility` pair | none | StableSurfaceV1 + Sha256V1 only |
| `entry_config_ref` | `runtime.entryConfigRef` + selected `entries` member | bounded env | exact entry kind/cardinality |
| `runtime_policy_config_ref` / policy | `runtime.runtimePolicyConfigRef` + one `technicalPolicies` member | bounded env for ref and declared policy leaves | policy family and timeout/retry bounds |
| `entry_parameters` | selected entry member | selected scalar leaves only | branch-specific required/forbidden fields |
| `diagnostics` | `diagnostics.mode` | bounded env | Off/Redacted only |

No candidate field may be populated from a sibling section, current environment name, adapter discovery result, provider response, or fallback branch. The candidate is a typed semantic handoff, not a raw map and not an application configuration object.

## 9. Batch 9.0 停审记录

| Gate | Result | Evidence in this intermediate artifact |
|---|---|---|
| SOP source/parse/load questions answered | pass | §§4、8.1~8.4 |
| single raw reader and source order | pass | `infra/config.rs`; constants < JSON < bounded env |
| CLI arbitrary override forbidden | pass | §§2.2、8.2、8.3 |
| strict JSON and bounded parser cap | pass | §§8.4、8.5 |
| invalid env does not fallback | pass | §8.3 |
| raw secret/body ordinary source count | `0` | Step 8 ref-only boundary carried forward |
| second loader/hot reload | `0` | startup-only/frozen contract |
| new Rust declaration/field/variant/trait/method/Port/error | `0` | reuses formal 03 carrier and root |
| formal 04 write | `0` | Step 15 only |

Batch `9.0` is closed. The next write batch may add structural/type/range/reference and cross-field validation tables; it may not add a new source lane or parser API.

## 10. Structural, type, range and reference validation

### 10.1 Validation phase order

| Phase | Input prerequisite | Exact checks | Output | Failure boundary |
|---|---|---|---|---|
| `V0 bootstrap` | process selector inputs | one file selector, assertion grammar, CLI/env selector agreement | selected file + optional expected profile/entry | no file bytes/candidate |
| `V1 bounded read` | selected path | readable regular source, valid UTF-8, byte count `<=1,048,576`, no BOM | bounded document bytes | nonpublic raw-source cause -> `InfraError::RuntimeAssembly` |
| `V2 structural parse` | bounded bytes | strict JSON object, duplicate/unknown/forbidden/null/comment/trailing-comma rejection, 18 module presence | parser-local raw modules | safe issues where possible; no partial typed candidate |
| `V3 overlay parse` | raw modules + bounded env | reserved-prefix allowlist, exact leaf JSON type, selected branch, no empty-invalid fallback | one merged parser-local tree | invalid present env rejects whole input |
| `V4 scalar/type` | merged tree | closed enum, integer, duration, URI/ref/name grammar, fixed literal, per-item length/range | typed scalar/closed branch candidates | existing safe issue carrier only |
| `V5 reference graph` | typed raw registries | ref target existence, exact family/kind, selected cardinality, reachability, case collision, acyclic graph | resolved parser-local section graph | no constructor/provider call |
| `V6 cross-field/profile` | resolved graph | entry/profile/branch symmetry, Deployment gates, timeout/retry relations, TLS/credential/endpoint compatibility | complete candidate inputs | no root/adapter/task exposed |
| `V7 candidate/root` | zero structural issue | construct candidate, then consume via `CapabilityRuntimeConfig::try_from_candidate` | immutable `CapabilityRuntimeConfig` | non-empty issues -> one `InfraError::RuntimeAssembly` |
| `V8 constructor proof` | validated root + resolved private material | registered constructor family, provider material kind, adapter parity/capability, entry ownership | owned Stage prefix | constructor source remains nonpublic; prefix disposed on failure |

Later phases never repair an earlier phase. Independent safely classifiable structural issues may be accumulated, sorted by `subject` then `kind`, and deduplicated. A missing prerequisite suppresses only checks that cannot be evaluated without it; it does not authorize inferred values or alternate refs.

### 10.2 Existing validation carrier reuse

Step 9 does not add error variants. Raw checks map to the closed formal `03` surface as follows; rows with several raw causes still expose only the existing body-free subject/kind pair.

| Raw validation class | Existing `CapabilityConfigValidationIssueKind` direction | Existing subject selection | Forbidden output |
|---|---|---|---|
| required module/field/slot/ref absent | `MissingRequiredBinding` | nearest closed owner: schema/profile/entry/local/Port/source/route/clock/id/policy/diagnostics | raw path/value/document |
| duplicate module/field/slot | `DuplicateBinding` | nearest closed owner | duplicate value or parser offset |
| unknown enum/literal/type/range/URI shape | `UnsupportedValue` | nearest closed owner; forbidden schema key uses `ForbiddenSurface` | raw literal/address/parser text |
| invalid symbolic name/length/case collision | `InvalidConfigName` | ref-consuming closed owner | full name when sensitive |
| ref target absent | `MissingReferencedSection` | exact consuming Port/source/route/local/policy/entry owner | unresolved full ref |
| wrong registry/family/fixture/transport/credential kind | `ReferencedSectionKindMismatch` | exact consuming owner | target contents/material |
| profile forbids selected branch | `ProfileBindingMismatch` | exact binding owner or `RuntimeProfile` | environment label beyond closed profile |
| second local authority/per-repository split | `MultiplePersistenceAuthorities` | `LocalPersistence` | product/store details |
| non-v1 codec/digest pair | `CompatibilityMismatch` | `Compatibility` | alternate implementation details |
| forbidden key/body/settings/hot-reload/execution/approval/listing surface | `ForbiddenConfigurationSurface` | `ForbiddenSurface` or nearest exact owner | forbidden value and secret-derived hash |

The carrier remains infra-local and non-empty by construction. It is not serialized into an API response, Worker receipt, Jobs report, business audit record or evidence artifact. Parser/provider/constructor-specific errors may be the nonpublic source of `InfraError::RuntimeAssembly`, but their text/status/private code is never copied into the safe issue carrier.

### 10.3 Numeric, length and fixed-value validation

| Value family / exact paths | Accepted representation and bound | Cross-field gate | Failure behavior |
|---|---|---|---|
| document | UTF-8 bytes `1..1,048,576`; strict JSON object | selected once | oversize/empty/nonobject reject; no truncation |
| symbolic config names | `1..128` ASCII bytes; first alphanumeric; remaining alphanumeric/`.`/`_`/`-` | no case collision; exact target family | no trim/case-fold/normalization |
| endpoint address | absolute URI `1..2048` UTF-8 bytes; no controls/space/userinfo/fragment | constructor-supported scheme; query rejected until controlled implementation closure | no credential extraction or clear output |
| secret locator / fixture artifact ref | opaque safe UTF-8 `1..512` bytes; no controls | exact credential/fixture kind | raw body/secret pattern rejects |
| credential version ref | opaque safe UTF-8 `1..128` bytes; no controls | optional pin only | absent does not authorize logging or “latest” claim |
| API/Worker phase timeout | integer ms `1..600000` | nested phase cannot extend owning deadline | no suffix/float/exponent/clamp |
| Jobs whole-run timeout | integer ms `1..86400000` | retry delay + admitted attempt must fit remaining deadline; timeout does not cancel | no extension/terminalization guess |
| external/local/commit timeout | integer ms `1..600000` | clipped by owning remaining phase; commit timeout repeats observation only | no mutation repeat |
| byte limit | integer bytes `1..16777216` | complete encoded bytes checked before decode | no truncation |
| public page limit | integer items `1..1000` | caller over maximum rejected | no silent clamp/default |
| internal/planning/fetch batch | integer items `1..10000` | collect-before-mutate/stable cursor/yield semantics unchanged | no business batch reinterpretation |
| Worker parallelism | integer `1..1024` | one global permit gate, not six multipliers | same work cannot run concurrently |
| retry attempts | integer `1..8`, including initial | policy is ceiling, not eligibility | `1` means no retry |
| retry initial delay | integer ms `1..60000` | `initialMs <= maximumMs` | checked arithmetic only |
| retry maximum delay | integer ms `1..600000` | fits remaining owner deadline after clipping | no overflow/deadline extension |
| multiplier numerator/denominator | integer each `1..1000` | exact rational ratio in `[1,16]` using checked integer arithmetic | no float conversion |
| maximum jitter | integer ms `1..60000` | actual jitter may be zero; upper bound cannot extend deadline | no implicit RNG/clock authority |
| schema/fixture schema | integer exactly `1` | fixed v1 | zero/future/alias rejected |
| compatibility | `stableSurfaceV1` + `sha256V1` exactly | pair is static | no runtime algorithm selector |
| TLS minimum version | exactly `tls1.3` when TLS enabled; absent when disabled | TLS mode and endpoint/profile compatible | no downgrade/fallback |

### 10.4 Eighteen-module loading and validation matrix

| Module | Parse/type validation | Required cross-field validation | Candidate/constructor target | Failure / activation effect |
|---|---|---|---|---|
| `runtime` | five exact keys; schema/profile/entry enums; two symbolic refs | entry/ref kind equality; one entry and one policy selected; expected assertions equal | schema/profile/entry/ref candidate fields | blocks V7/Stage 0 |
| `localPersistence` | closed `inMemory/durable`; conditional storeRef; closed store members | one authority; durable store max 1; Deployment durable; transport kind `durableStore` | local persistence field + Stage 1 authority args | no partial authority or inMemory fallback |
| `externalPorts` | exactly nine required named closed unions | configured/fake/disabled branch fields; family/profile; no Missing | complete external binding field | blocks Stage 4 as a whole |
| `clock` | `system/deterministic`, conditional fixtureRef | fixture kind clock; Deployment system | clock field / Stage 2 | no substitute clock |
| `idGenerator` | `system/deterministic`, conditional fixtureRef | fixture kind idGenerator; Deployment system | id field / Stage 2 | no substitute ID source |
| `compatibility` | exact two literals | v1 pair only | compatibility field / Stage 2 verifier | incompatibility blocks graph |
| `technicalPolicies` | one named member; 7 timeout, 4 retry, 1 scan groups | selected ref only; retry arithmetic/deadline gates; sole raw authority | policy field + selected entry copies | no library default or duplicated entry timeout |
| `entries` | exactly one selected closed API/Worker/Jobs shape | discriminator equals runtime entry; unselected fields absent; selected env only | entry parameter field / Stage 6 | wrong branch does not fallback entry |
| `diagnostics` | exact `off/redacted` | no raw/full/verbose; exact observer contract remains fixed | diagnostics field / Stage 2/entry wrapper | invalid mode blocks; observer cannot alter graph result |
| `configuredAdapters` | max 9 named closed members; family/constructor/transport; routeRefs only collaboration | each selected configured slot exact family; unselected/orphan forbidden | Stage 4 family constructor args | configured failure never becomes fake/disabled |
| `inboundFeeds` | max 6 named members; exact family/constructor/transport | each configured Worker slot exact feed family; selected Worker only | Stage 6 parked source constructor args | no topic-derived logical identity |
| `trustedActors` | max 6; exact family; bounded non-empty actorRefs/refinement | independently matches configured source family; actor set not derived from feed/credential | Stage 6 immutable matcher args | no runner without matcher |
| `outboundRoutes` | exactly ten when collaboration configured; family/constructor/transport | one distinct route per formal event family; no wildcard/reuse of route identity | Stage 4 collaboration route args | no partial publisher route graph |
| `transports` | max 26; closed kind/constructor; endpoint + optional credential/TLS refs | consumer-compatible kind; endpoint/TLS/credential graph; sharing compatibility | Stage 1/4/6 exact private constructor args | no per-call config lookup |
| `endpoints` | max 26; kind + bounded absolute address | consumer scheme, network/localSocket, TLS/profile compatibility | exact transport constructor arg | no endpoint fallback or public echo |
| `credentialRefs` | max 26; closed kind + provider/locator/version refs | exact consumer/TLS expected kind; reachable only | provider lookup descriptor at exact constructor | material never enters root/application |
| `tlsPolicies` | max 26; closed mode and conditional refs | disabled/server/mTLS shape; TLS 1.3; trust/cert/key exact kinds; Deployment authenticated network TLS | exact TLS/transport constructor args | no downgrade or one-sided pair |
| `fixtures` | max 17; closed kind, schema 1, bounded artifact ref | exact consuming slot; Local/Integration only; reachable and parity-capable | Stage 1/2/4/6 deterministic constructor args | missing/wrong fixture blocks; no real-evidence claim |

### 10.5 Canonical 27-row validation coverage

| Canonical rows | Validation owner | Required proof before immutable root/entry handoff | Coverage |
|---|---|---|---:|
| 1~3 schema/profile/entry | V2~V7 root validator | v1, closed profile, one exact entry/ref symmetry | `3/3` |
| 4 local persistence | V4~V8 + Stage 1 | one authority, profile-compatible binding, selected store/transport/constructor | `1/1` |
| 5 external slots | V4~V8 + Stage 4 | 9/9 named slots, branch/family/profile, exact implementations | `1/1` |
| 6 clock/id | V4~V8 + Stage 2 | two independent slots, profile/fixture kind, no fallback | `1/1` |
| 7 compatibility | V4/V6 + Stage 2 | exact codec/digest pair | `1/1` |
| 8~10 API | V4/V6 + Stage 6 | body/page bounds and policy-derived non-cancelling timeout | `3/3` |
| 11~17 Worker | V4~V8 + Stage 6 | scalar bounds, policy timeouts, 6/6 source branch/feed/actor construction | `7/7` |
| 18 collaboration routes | V5/V6/V8 + Stage 4 | configured iff ten exact family routes; immutable event identity | `1/1` |
| 19~22 Jobs | V4/V6 + Stage 6 | body/page bounds, policy timeout/retry, eight-arm dispatcher fixed | `4/4` |
| 23~26 technical policy | V4/V6 + selected wrappers | retry eligibility remains code-owned; bounds/deadline/observation gates | `4/4` |
| 27 diagnostics | V4/V6 + selected wrapper | Off/Redacted only; no business-outcome effect | `1/1` |
| **Total** | | no split/merged/duplicate raw authority | **27/27** |

## 11. Batch 9.1 停审记录

| Gate | Result |
|---|---|
| validation phases | pass; V0~V8 ordered and non-repairing |
| existing issue carrier reuse | pass; new issue kind/subject/API=`0` |
| numeric/length/fixed-value families | pass; all Step 7 bounds retained |
| module loading matrix | pass; 18/18 modules |
| canonical typed responsibility | pass; 27/27 rows |
| required/conditional field without gate | `0` |
| implicit default/clamp/fallback | `0` |
| constructor/provider invoked before reference/profile validation | `0` |
| formal 03 writeback delta | `0` |

Batch `9.1` is closed. Batch `9.2` may now define whole-graph cross-field rules and provider/constructor resolution; it may not widen any module, profile, issue carrier or typed root.

## 12. Whole-graph cross-field validation

### 12.1 Root, selected branch and cardinality rules

| Rule ID | Predicate | Failure subject/direction | No-fallback consequence |
|---|---|---|---|
| `LA-ROOT-01` | all 18 top-level modules appear exactly once; unknown wrapper/project prefix absent | `ForbiddenSurface` / missing/duplicate/forbidden | do not parse alternate root |
| `LA-ROOT-02` | `runtime.schemaVersion == 1` and fixed compatibility pair present | schema/compatibility | no parser version negotiation |
| `LA-ROOT-03` | exactly one `entries` member and one `technicalPolicies` member; both selected refs resolve | runtime entry/policy | no dormant section or guessed member |
| `LA-ROOT-04` | selected entry discriminator exactly equals `runtime.entry` | runtime entry kind mismatch | no `as_* == None` fallback to another entry |
| `LA-ROOT-05` | one local authority; durable branch has one selected store, inMemory has zero store member | local persistence | no per-repository split/second authority |
| `LA-PORT-01` | external slots are exactly 9/9 and every slot is configured/fake/disabled | exact external subjects | Missing is invalid; disabled must be explicit |
| `LA-WORKER-01` | Worker selected iff entry payload may carry exactly 6/6 named sources | six inbound subjects | no source payload on API/Jobs; no seventh source |
| `LA-ROUTE-01` | collaboration configured iff routeRefs and selected routes cover 10/10 exact families | access collaboration + ten route subjects | no wildcard/default/partial route |
| `LA-ENTRY-01` | only selected entry scalar env overlays may be present | runtime entry | no dormant cross-entry override |
| `LA-POLICY-01` | all seven timeout leaves and four retry objects remain present even if an entry does not consume all | runtime policy | no hidden profile/entry defaults |

### 12.2 Profile compatibility rules

| Surface | Local | Integration | Deployment | Invalid result |
|---|---|---|---|---|
| local authority | inMemory or durable | inMemory or durable with semantic parity | durable only | `ProfileBindingMismatch`; no substitution |
| external Port slot | configured/fake/disabled | configured/fake/disabled | configured/disabled only | selected fake blocks entire graph |
| Worker source slot | configured/fake/disabled | configured/fake/disabled | configured/disabled only | any selected fixture blocks Worker graph |
| clock/id | system or deterministic | system or deterministic | system/system only | deterministic blocks Stage 0 |
| compatibility | fixed v1 pair | fixed v1 pair | fixed v1 pair | mismatch blocks |
| diagnostics | off/redacted | off/redacted | off/redacted | raw/full/verbose blocks |
| network TLS | profile-compatible selected policy | authenticated when required by integration boundary | serverAuthenticated or mutualTls | disabled network TLS in Deployment blocks |
| selected fixture | explicit exact-kind only | explicit exact-kind only | none | reachable fixture count must be zero |

`Disabled` remains legal for an external Port or Worker source under Deployment when the selected product intentionally does not provide that integration. It is not evidence that a dependency is healthy or accepted; it constructs an explicit unavailable branch only.

### 12.3 Registry reference graph rules

| Source edge | Required target and family | Sharing/cardinality | Rejection cases |
|---|---|---|---|
| runtime -> entry/policy | exact selected kind; one each | no unselected member | missing/wrong kind/orphan/cycle |
| durable store -> transport | `durableStore` | one selected store | another authority, wrong transport, orphan |
| configured Port -> adapter -> transport | exact Port family -> `requestResponse` except exact collaboration route graph | transport may share only with constructor/security compatibility | family masquerade, generic adapter, arbitrary settings |
| Worker source -> feed + actor | exact source family independently for both | max six each; feed transport may share, matcher identity cannot | feed as actor authority, mismatched family |
| feed -> transport | `inboundStream` | runner identity remains independent | route/adapter family target |
| collaboration -> ten routes | ten distinct exact event families | physical transport may share; route identity may not | missing/extra/duplicate/wildcard family |
| route -> transport | `outboundOneWay` | shared only if independent destination construction remains | event/schema/source/digest override |
| transport -> endpoint/credential/TLS | exact material families | sharing requires all consumers compatible | material-to-transport back-reference, cycle |
| TLS -> credentials | trustBundle and optional cert/privateKey exact kinds | cert/key pair treated atomically | one-sided mTLS, wrong-kind, cycle |
| fake/deterministic branch -> fixture | exact one of 17 closed fixture kinds, schema v1 | one fixture has one kind | Deployment use, production material edge, fixture-to-fixture |

Every declared registry member must be reachable from the selected runtime graph. Reachability is evaluated after bounded env overlays because overlays may change only selected root refs/scalars, never create registry members. Unreferenced sensitive metadata is rejected instead of retained as dormant material.

### 12.4 Endpoint, TLS and credential cross-field rules

| Rule ID | Predicate | Resolution phase | Failure behavior |
|---|---|---|---|
| `LA-MAT-01` | endpoint address is absolute, bounded, no userinfo/fragment/control/space; query absent until constructor-specific controlled closure | V4/V6 | reject without echoing address |
| `LA-MAT-02` | transport kind matches consumer family and constructor registration | V5 then V8 | wrong-kind validation or constructor failure; no auto-discovery |
| `LA-MAT-03` | localSocket may use disabled TLS only where Local/Integration boundary explicitly permits; network Deployment may not | V6 | profile mismatch; no TLS downgrade |
| `LA-MAT-04` | serverAuthenticated has TLS 1.3 + trustBundle, no client cert/key | V6 | missing/wrong/extra ref rejects |
| `LA-MAT-05` | mutualTls has TLS 1.3 + trustBundle + clientCertificate + privateKey as one set | V6/V8 | any missing/wrong-kind/pair mismatch blocks constructor |
| `LA-MAT-06` | disabled TLS carries none of minimumVersion/trust/cert/key | V4/V6 | branch-irrelevant member forbidden |
| `LA-MAT-07` | selected credential kind is accepted by exact transport/store constructor | V6/V8 | no kind coercion or DSN concatenation |
| `LA-MAT-08` | provider registration is deployment-injected and exact `providerRef` resolves once for that constructor | V8 | missing registration blocks configured graph |
| `LA-MAT-09` | credential/TLS material is unavailable, expired, forbidden or pair-incompatible | V8 | fail closed; no cached unknown/fake/disabled fallback |

### 12.5 Provider resolution and exact constructor injection

```text
[validated reachable credential/TLS refs]
  -> [lookup one deployment-injected provider registration]
  -> [request exact credential kind + locator/version]
  -> [validate provider result kind and required pair symmetry]
  -> [pass material directly into the referencing constructor]
  -> [retain only opaque adapter/transport runtime handle]
  -> [drop startup-local material/source as product API permits]
```

| Boundary | May hold | Must not hold or do |
|---|---|---|
| parser/candidate/root | provider/locator/version symbolic metadata only where needed for graph resolution | secret material, provider response, raw DSN, certificate/key body |
| provider registration lookup | one registration handle + exact validated ref descriptor | arbitrary locator chosen by constructor, `SecretReferencePort`, environment fallback |
| exact constructor | only the material its declared kind/TLS branch needs | generic secret bag, cross-adapter lookup, whole raw document |
| concrete runtime handle | opaque product state required for calls | root/config reader, secret output, dynamic config lookup |
| application/entry/domain/contracts | only constructed Port/service/facade or typed technical parameter | endpoint/credential/TLS/ref/provider material |

Provider resolution occurs inside the owning assembly Stage: durable store material in Stage 1, configured external adapter/route material in Stage 4, and configured Worker feed material in Stage 6. Stage 2 deterministic fixtures do not resolve production credentials. A failure in any owner Stage disposes the complete prefix owned so far.

### 12.6 Constructor registration and capability proof

| Constructor family | Required proof before Stage completion | Failure result |
|---|---|---|
| durable local authority | one `A` supports atomic multi-repository UoW, CAS/unique/current indexes, cursor semantics, rollback, transaction-ref resolution and linearizable authority reads | `InfraError::RuntimeAssembly`; no inMemory fallback |
| clock/id | sole source, deterministic fixture exact-kind/parity where selected | whole graph failure; no system/deterministic substitution |
| external configured Port | exact one of 9 families, 14-callable typed/body-free contract, safe failure mapping, no hidden responsibility | Stage 4 fails as a whole |
| external deterministic fake | same typed positive/negative/parity surface for exact family | Stage 4 fails; no generic fake |
| external disabled | exact family object returning existing `NotConfigured` | absence of implementation is assembly failure, not Missing conversion |
| Worker configured feed/matcher | exact source family, transport, trusted actor and schema/header gate capability; task remains parked | Stage 6 fails as a whole |
| Worker fake | complete encoded envelope through same gate and negative cases | no shortcut dispatch |
| collaboration routes | ten immutable event-family routes preserve name/schema/source/routing/digest/capture/intent | no subset publisher graph |
| selected entry factory | owns one complete neutral graph + typed parameters; cannot expose repository/config/adapter ref | activation blocked |

No row requires a network readiness claim when a product cannot safely probe at startup. Product-specific probe capability is an implementation-boundary prerequisite: when supported and required, failure blocks the constructor; when unsupported, design must not fabricate connectivity evidence or treat object construction as external health proof.

## 13. Batch 9.2 停审记录

| Gate | Result |
|---|---|
| root/entry/policy cardinality | pass |
| local/external/source/route counts | pass; `1 / 9 / 6 / 10` exact |
| Local/Integration/Deployment profile matrix | pass; Deployment fake=`0` |
| registry reachability/family/cycle | pass; orphan/wrong-family/cycle accepted=`0` |
| TLS/credential cross-field | pass; downgrade/kind coercion/raw secret=`0` |
| provider-to-exact-constructor sequence | pass; provider material root/application exposure=`0` |
| configured failure fallback | `0` |
| concrete product/readiness claim | `0` |
| new error/Port/type/field/callable | `0` |

Batch `9.2` is closed. Batch `9.3` may now bind this validated input to formal `03` Stage 0~7 and the three entry activation barriers; it may not change constructor families, entry inventory or failure taxonomy.

## 14. Stage 0~7 runtime assembly

### 14.1 Assembly pipeline

```text
Stage 0 validate_root
  -> Stage 1 build_single_authority
  -> Stage 2 bind_technical_primitives
  -> Stage 3 bind_local_base_ports_27_of_27
  -> Stage 4 bind_external_ports_9_of_9
  -> Stage 5 build_selected_application_graph
  -> Stage 6 resolve_selected_entry_parameters_and_neutral_inputs
  -> Stage 7 create_one_nonclone_entry_handoff
  -> selected entry-owned factory
  -> selected entry runtime ownership gate
  -> first exposure barrier
```

One stage starts only after the previous stage has produced a complete owned prefix. No stage publishes a global singleton, starts an entry runtime, spawns an unparked task, binds an accepting listener, reads a Jobs request or exposes a service handle to another owner.

### 14.2 Stage contract matrix

| Stage | Exact input | Required work and proof | Owned output prefix | Failure and disposal |
|---|---|---|---|---|
| `0 validate_root` | merged parser-local tree, zero safely aggregatable structural issues | consume candidate through `CapabilityRuntimeConfig::try_from_candidate`; prove profile/entry/ref/cardinality/reachability/family/cycle/TLS metadata/compatibility | one immutable root, still infra-owned | dispose candidate/raw buffers; return `InfraError::RuntimeAssembly`; provider/constructor calls=`0` |
| `1 build_single_authority` | root local binding + selected store/transport/endpoint/credential/TLS metadata | build exactly one `A`; resolve only exact store credential/TLS material; prove atomic UoW/CAS/unique/current/cursor/rollback/commit-resolution/linearizable reads | root + one authority handle | dispose provider material and authority handle; no inMemory fallback/second authority |
| `2 bind_technical_primitives` | root clock/id/compatibility/diagnostics + exact fixtures if selected | build sole Clock and ID sources; bind fixed codec/digest verifier and safe diagnostic mode; profile parity gate | root + `A` + technical primitives | dispose all handles; no entry-generated time/id or alternate algorithm |
| `3 bind_local_base_ports_27_of_27` | `A`, verifier, technical policy primitives | build UoW manager, 22 repository Ports, read-visibility resolver, Clock and Id Ports; prove all share exact authority/identity and 110-method semantics | complete 27/27 local/base Port graph | dispose all 27-prefix handles; no optional repository/read gate or partial service graph |
| `4 bind_external_ports_9_of_9` | nine validated branches + reachable adapter/route/material graph | construct exact Configured/Fake/Disabled implementation for 9 Ports/14 callables; resolve configured credentials only at exact constructors; collaboration configured branch proves 10/10 routes | complete 27 local + 9 external Port graph | dispose all external and prior handles; no failed-configured-to-disabled/fake conversion |
| `5 build_selected_application_graph` | complete 36-Port graph + typed policies/factories | construct only services needed by selected entry while preserving closed 83-flow implementation; API gets 7 Command + 8 Query service handles covering 26/33 operations; Worker/Jobs get exact existing facades | entry-neutral selected application bundle | dispose services and Port graph; no generic execute/map/optional handler |
| `6 resolve_selected_entry_parameters_and_neutral_inputs` | selected entry variant, policy projections, application bundle, validated entry-only materials | copy exact typed parameters; API prepares closed route/listener-neutral inputs; Worker resolves 6 source drivers/matchers and continuation inputs without starting tasks; Jobs prepares eight-arm dispatcher/runtime-neutral inputs without reading request | one complete entry-neutral input bundle | dispose source/entry handles; listener/task/request exposure=`0` |
| `7 create_one_nonclone_entry_handoff` | complete selected bundle | move root-independent service/parameter/neutral-input ownership into exactly one entry-specific non-Clone handoff; consume builder ownership | one handoff for API, Worker or Jobs | dispose unmoved prefix; no retry with another entry and no second handoff |

The validated root itself is not handed to the entry. Symbolic config refs are consumed during resolution, and application constructors receive existing Ports plus typed technical primitives only. Adapter implementations may retain only their own resolved opaque runtime handle, never the whole root or another section.

### 14.3 Complete predicate

Activation requires every row below to be true at the same time:

| Predicate component | Required value |
|---|---|
| immutable root | one v1 root, selected profile and selected entry exact |
| local authority | exactly one profile-compatible `A` |
| technical primitives | one Clock, one Id source, fixed codec/digest, valid diagnostics |
| local/base Ports | `27/27`; all share required authority/technical invariants |
| external Ports | `9/9`, `14/14` callable surfaces through exact branch implementations |
| selected application graph | no missing service for selected protocol inventory; no generic fallback |
| selected neutral inputs | exact API parameters, Worker 6-slot inputs or Jobs 8-arm inputs |
| handoff | exactly one non-Clone entry handoff |
| entry factory | selected entry alone owns runtime/facade/listener/task construction |
| runtime ownership | non-cancelling/drain/park semantics proven before exposure |
| static coverage | API `26+33`, Worker `6`, collaboration `10`, Jobs `8` identities remain closed |

`Configured`、`DeterministicFake` and `Disabled` contribute to this predicate only after exact validation and construction. `Missing` never contributes and never converts into another state or another entry.

## 15. Entry-specific activation barriers

### 15.1 API activation

| Phase | Required behavior | Activation forbidden until |
|---|---|---|
| consume handoff | API root moves the complete handoff once; receives typed API parameters and 15 service handles only | no raw root/ref/repository/UoW/resolver/credential remains visible |
| construct facade | build closed 26 Command + 33 Query handler/route mapping; no generic string dispatch or optional missing handler | all 59 operation mappings and protocol metadata are present |
| listener ownership | establish listener ownership without accepting traffic; prove framework can retain owned application future | listener bind/ownership succeeds and no partial route is published |
| non-cancelling proof | `call_timeout` ends transport observation only; dispatch is not aborted, dropped, detached or repeated | selected framework binding satisfies formal `03` contract |
| release barrier | atomically allow first request only after complete predicate | all prior phases pass |

Failure before barrier release returns startup `InfraError::RuntimeAssembly`; it is not an API response. A bound-but-not-accepting listener is closed during prefix disposal. No route may become available before all routes and the non-cancelling proof are complete.

### 15.2 Worker activation

| Phase | Required behavior | Activation forbidden until |
|---|---|---|
| consume handoff | Worker root receives six exact source decisions, already constructed drivers/matchers, global permit parameters and application facades | no raw config/ref or direct repository/publisher adapter is present |
| construct parked tasks | create one parked task for each Configured/Fake source; Disabled creates no runner/fetch/receipt/ack | every enabled task is parked and owns no processing permit while fetching |
| source proof | each task fixes logical event, source family, schema v1, body/header/actor gate and exact consumer | 6/6 slots are accounted for and no identity is inferred from topic/credential |
| continuation proof | exact capture-ref continuation uses application facade and owns drain semantics | no worker-direct capture repository/publisher path exists |
| supervision proof | stop signal, continuation drain, source stop, ordered joins and original-failure preservation are installed | a partial task set can be stopped/joined deterministically |
| release barrier | release all parked enabled tasks only after complete predicate | all prior phases pass |

If construction of task N fails, tasks `0..N-1` remain parked, receive stop, and are joined in deterministic order. The original assembly failure remains primary; safe ordered cleanup failures may remain nonpublic causes but cannot replace it with success. No fetch or delivery completion occurs before barrier release.

### 15.3 Jobs activation

| Phase | Required behavior | Activation forbidden until |
|---|---|---|
| consume handoff | Jobs root receives exact typed parameters, eight-arm dispatcher and application Job facades | no root/ref/repository/journal adapter/host schedule truth is exposed |
| runtime ownership | create owned Tokio current-thread runtime with fixed `rt,sync,time` boundary, monotonic deadline, terminal notification and join/drain ownership | runtime can drive and drain an owned application task without cancellation |
| dispatcher proof | exactly eight Job kind/input/result arms; no generic execute, schedule alias or target parallelism | all eight static mappings are present |
| release barrier | mark one-shot runner ready to read exactly one request | complete predicate and runtime ownership pass |
| admission after release | only now read bounded request bytes, validate kind/schema/body and dispatch | request read cannot precede activation |

Entry auto-retry authorization remains zero. Observation timeout after dispatch does not cancel the application task; residual work is joined/drained before process exit. Application alone may safely reenter from durable key/journal proof. A startup failure creates no Job report or protocol response.

### 15.4 Cross-entry activation matrix

| Selected entry | Stage 6 neutral inputs | Stage 7 handoff owner | First visible action | Never before barrier |
|---|---|---|---|---|
| API | typed request/page/timeout parameters + 15 service handles + closed route metadata | API composition root | listener accepts first request | accepted socket/request, protocol error/response |
| Worker | typed limits/deadlines + six constructed source inputs + continuation/permit inputs | Worker composition root | parked tasks released to fetch | fetch, receipt, ack/completion, application call |
| Jobs | typed body/page/deadline/reentry provenance + eight-arm dispatcher inputs | Jobs composition root | runner reads one request | request bytes read, report/journal/application call |

Unselected entry parameters may remain structurally present only where Step 7 requires profile-comparable policy leaves, but no unselected entry graph, runtime or handoff is constructed.

## 16. Failure atomicity and owned-prefix disposal

### 16.1 Prefix disposal matrix

| Failure point | Prefix that may exist | Required cleanup | Forbidden externally visible effect |
|---|---|---|---|
| V0~V7 | parser-local bytes/tree/candidate | drop buffers/candidate and nonpublic causes | root, provider read, constructor, listener/task/request |
| Stage 1 | root + partial authority/provider material | close/drop exact material and authority handle | local Port/application/service |
| Stage 2 | root + `A` + partial primitives | drop primitives then authority according owner dependencies | generated time/id, codec output |
| Stage 3 | partial local adapters | drop adapters in reverse dependency order, then primitives/authority | any Port handle or repository call |
| Stage 4 | complete local + partial external handles/material | close partial external handles/material, then local prefix | external call, fake success, disabled substitution |
| Stage 5 | complete Ports + partial application services | drop service graph, then Port graph | handler/facade invocation |
| Stage 6 | application graph + partial neutral inputs/source drivers | stop/close drivers that have not started, drop typed inputs/services | source fetch, listener bind, Jobs request read |
| Stage 7 | complete bundle during handoff move | either transfer exactly once or dispose entire unmoved bundle | second handoff/alternate entry |
| API pre-barrier | facade + non-accepting listener | close listener and drop facade/handoff | accepted request/response |
| Worker pre-barrier | parked task subset + supervisor | stop parked tasks, ordered join, preserve original failure | fetch/receipt/ack/application call |
| Jobs pre-barrier | owned runtime + dispatcher, no request | drain/stop empty runtime and drop handoff | request/report/journal/app call |

Cleanup is not a business rollback because no business invocation has begun. It must not write Hub truth, create protocol receipts/reports, emit evidence, or synthesize a successful Disabled/Fake branch. Product-specific close errors remain startup-private and follow the existing original-failure precedence.

### 16.2 Lifecycle failure surface

| Lifecycle phase | Existing outward category | Explicitly not used |
|---|---|---|
| source/path/read/parse/validation | `InfraError::RuntimeAssembly` with safe infra-local validation source or nonpublic raw cause | `ApplicationError`, API response, receipt, report, persisted issue |
| provider/material/constructor/Stage failure | `InfraError::RuntimeAssembly` with nonpublic source | Port failure, typed external outcome, fallback branch |
| explicit Disabled Port after activation | existing exact `ApplicationError::PortFailure(NotConfigured)` on invocation | startup Missing, fake success |
| configured Port call after activation | existing closed external Port failure/outcome mapping | config issue/raw provider error text |
| local repository/UoW call after activation | existing local transaction/repository/application mapping | runtime assembly reclassification |
| observer/redaction failure | existing non-cancelling observer rule | cancellation/reclassification of startup or business result |

### 16.3 Startup-only and reload contract

| Question | Contract |
|---|---|
| Does the process watch its JSON file or environment? | no |
| Can env/CLI change after startup affect the root? | no; process environment is sampled during one startup load only |
| Is there a reload endpoint, signal handler or config-center subscription? | no |
| Can one adapter reread its own section per call? | no |
| Can credential rotation alter an already running graph? | no current guarantee; full restart is required |
| What happens when an operator edits the file under a running process? | current process remains on its frozen graph; a new process must validate/assemble/activate the new document |
| How is a failed new configuration handled? | new process never crosses barrier; existing process is not modified by this loader contract |
| Is last-known-good loaded inside the failing process? | no; rollback/restart selection is Step 10 release/config control-plane responsibility |

No hot-update item exists, so the writing-standard requirement to define reject-old/retain-old/rollback for hot items is `not_applicable`. The replacement process validates a complete new graph; Step 10 defines review/audit/rollback records without adding live mutation.

## 17. Batch 9.3 停审记录

| Gate | Result |
|---|---|
| formal Stage sequence preserved | pass; Stage 0~7 exact order |
| Stage local/base/external counts | pass; 27/27 and 9/9 |
| one selected application graph/handoff | pass; non-Clone handoff exactly 1 |
| API first exposure | pass; complete routes/listener/non-cancelling proof before accept |
| Worker first exposure | pass; all enabled tasks parked before release |
| Jobs first exposure | pass; request read after runtime/dispatcher barrier |
| partial graph/listener/task/request exposure | `0` |
| Missing conversion/fallback | `0` |
| hot reload/reload API | `0` |
| startup execution/evidence claim | `0` |

Batch `9.3` is closed. Batch `9.4` may only perform configuration-domain stop review, cross-loading audit, detailed-design impact determination and handoff/next-step closure.

## 18. 按配置域组织的加载、校验与生效表

| 配置域 | 配置项 / 配置组 | parse | type validate | cross-field validate | assemble / expose target | 失败策略 |
|---|---|---|---|---|---|---|
| root/profile/entry | runtime five keys + selector assertions | strict singleton keys | v1/closed enum/symbol refs | selected member kind/cardinality/profile assertion | candidate -> root -> one handoff | fail-fast before Stage 1 |
| local authority | binding/store/transport/material refs | closed branch/object | kind/ref/address/TLS metadata | one `A`, Deployment durable, transport/material compatibility | Stage 1 then 27 local Ports | whole-prefix assembly failure |
| technical primitives | clock/id/compatibility/diagnostics | closed branch/literal | exact fixture/fixed values | profile and fixture kind; v1 pair | Stage 2; typed Ports/wrappers only | no fallback source/algorithm |
| technical policy | timeouts/retries/scan | exact one policy object | integer/rational bounds | deadline, retry/effect ownership, sole raw authority | Stage 2/5/6 typed projections | reject; no clamp/library default |
| API entry | body/page + policy timeout | selected API shape | bounds | discriminator, 59 mappings, non-cancelling framework | Stage 5~7 -> API barrier | no listener/request on failure |
| Worker entry/sources | scalar + six unions/feed/actor | exact Worker shape/6 slots | bounds/family/ref | profile, feed/actor independence, schema/event identity | Stage 5~7 -> parked task barrier | stop/join parked prefix; no fetch |
| Jobs entry | body/page + policy timeout/reentry | selected Jobs shape | bounds | discriminator, eight mappings, runtime/drain ownership | Stage 5~7 -> request-read barrier | no request/report on failure |
| external Ports | nine unions/adapters/fixtures | 9/9 closed branches | family/ref/constructor | profile, typed parity, no Missing/fallback | Stage 4 -> application Ports | whole external graph failure |
| collaboration routes | configured adapter + ten route members | exact 10-field object | route family/transport ref | 10/10 immutable event identity | Stage 4 publisher adapter | no partial route graph |
| material registries | transport/endpoint/credential/TLS/fixture | closed field sets | URI/ref/kind/length | reachability, cycle, sharing, TLS pair/profile | exact Stage 1/2/4/6 constructor | fail closed; material private |
| sensitive provider | provider/locator/version refs | metadata only | bounded ref grammar | expected kind/exact consumer | provider -> exact constructor | no raw output/cache/fallback |
| diagnostics | Off/Redacted | closed enum | exact mode | Step 15 allowlist/non-cancelling | infra/entry observer wrapper | invalid blocks; sink failure not business failure |

## 19. 加载校验停审记录

| 配置域 / 配置组 | 必填/类型/交叉校验 | 生效与失败 | 03 impact | 结论 / 缺口 |
|---|---|---|---|---|
| root/profile/entry | closed | startup/frozen; Stage 0 fail-fast | none | pass / none |
| local authority + 27 Ports | closed | one authority; Stage 1/3 atomic prefix | none | pass / none |
| clock/id/compatibility | closed | Stage 2; no fallback | none | pass / none |
| policy/API | closed | typed projection; API barrier | none | pass / none |
| Worker/six sources | closed | parked-all-before-release | none | pass / none |
| Jobs/eight arms | closed | request-after-barrier | none | pass / none |
| nine external Ports | closed | Stage 4 all-or-nothing | none | pass / none |
| ten outbound routes | closed | configured collaboration all-or-nothing | none | pass / none |
| registries/reachability/cycles | closed | selected exact constructor only | none | pass / none |
| credential/TLS/provider | closed | exact injection/fail-closed | none | pass / none |
| diagnostics/output | closed | Off/Redacted; no business effect | none | pass / none |

## 20. 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| required canonical value without validation | `0`; 27/27 covered | none |
| top-level module without parse/validate/assemble owner | `0`; 18/18 covered | none |
| duplicate raw authority | `0`; timeout/retry policy remains sole source | none |
| unbounded/unknown/duplicate/null acceptance | `0` | strict parser rejects |
| invalid high-priority env fallback | `0` | fail-fast |
| cross-field gap | `0`; root/profile/entry/branch/deadline/TLS all closed | none |
| ref orphan/wrong-family/case-collision/cycle acceptance | `0` | V5 rejects |
| profile mismatch/fake in Deployment | `0`; fake count must be zero | none |
| Missing -> Disabled/Fake/other entry | `0` | startup failure |
| configured provider/constructor -> fake/disabled | `0` | fail closed |
| raw secret/body in candidate/root/application/output | `0` | ref-only + exact injection |
| partial local/external/application graph exposure | `0` | Stage prefix disposal |
| API listener/Worker task/Jobs request before barrier | `0/0/0` | entry-specific barriers |
| second raw reader/per-call discovery | `0` | infra/config sole owner |
| hot reload without rollback | `not_applicable`; hot item count `0` | restart-only Step 10 handoff |
| new runtime builder/adapter signature/error carrier need | `0` | existing formal 03 surface sufficient |
| runtime/tools execution, marketplace, approval, method body, SDK product leakage | `0` | forbidden surfaces retained |
| implementation/test/readiness/evidence/signoff/commit claim | `0` | design predicates only |

## 21. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| bootstrap/file/env source order and strict parser | 否 | formal 03 delegated raw-source detail | §13.1/13.2 | 无回写 |
| existing issue carrier mapping | 否 | reuses closed infra-local carrier | DDD Step 14 §§15.1~15.4 | 无回写 |
| whole-graph cross-field/profile validation | 否 | fills formal 04 responsibility without typed delta | §13.2/13.12 | 无回写 |
| provider resolution at exact constructor Stage | 否 | preserves existing adapter-private material boundary | §13.9 + Step 8 sensitive handoff | 无回写 |
| Stage 0~7 and three activation barriers | 否 | exact reuse/clarification of formal 03 sequence | §13.5~13.9 | 无回写 |
| startup-only/no hot reload | 否 | existing immutable-root/process lifetime | §13.1/13.9 | 无回写 |
| future new config field/constructor arg/reload API/error variant | 触发时是 | code-contract change | reopen DDD Step 14 and originating Step | 当前未引入；受控回开 |

Current impact: `待回写=0`, `阻塞待确认=0`, `upstream blocker=0`。本 Step 新增 Rust declaration/struct/field/enum/variant/payload/trait/method/callable=`0`，因此 Rustdoc delta=`0`。未来任何新增 Rust declaration 必须有英文 `///`；struct 每个 field、enum 每个 variant/payload field、trait/method/callable 不得遗漏注释。

## 22. Formal §9 回填草稿

正式 `04-配置设计.md` §9 应从本 Step 装配以下已收口内容：

1. source selector、strict JSON、bounded env overlay 和 deterministic merge 流程图；
2. V0~V8 validation phase、existing issue carrier mapping 和 numeric/length bounds；
3. 18 模块逐域 parse/type/cross-field/assemble/failure matrix；
4. root/profile/cardinality/reachability/family/cycle/TLS/credential whole-graph rules；
5. provider-to-exact-constructor material flow；
6. Stage 0~7 matrix、complete predicate、API/Worker/Jobs activation barrier；
7. prefix disposal、failure phase separation、startup-only/no-hot-reload contract；
8. loading stop review、cross-loading audit 和 03 no-writeback gate。

正式章节可压缩重复的 module/value rows，但不得遗漏：`18/18 modules`、`27/27 canonical rows`、`27/9/6/10` cardinality、`21` env leaves、Stage `0~7`、three entry barriers、provider injection 和 no-partial-exposure。不得声称某 provider、adapter、listener、task、Jobs run、test/evidence/signoff 已成功。

## 23. 待确认事项

| 事项 | 当前状态 | 是否阻塞 Step 10 | 未确认前处理 |
|---|---|---|---|
| concrete durable store/transport/adapter products | unselected | no | 07 prerequisite + implementation boundary；必须证明 constructor capability，不得弱化 contract |
| concrete secret provider and material memory API | unselected | no | deployment prerequisite；保持 provider-to-constructor shortest path |
| product-specific startup probe capability | unknown by product | no | 不伪造 readiness；选择产品后明确 capability/failure gate |
| host conventional config path | operations-owned value not selected | no | Step 9 只固定单一路径 convention；09 运维文档填写具体路径 |
| listener/source/runtime concrete framework APIs | target repo absent | no | 07/implementation boundary核实；若不能满足 non-cancelling/park/drain，受控回开 03 |

All items are implementation/deployment prerequisites or controlled-reopen triggers, not unresolved upstream design blockers.

## 24. Step 9 completion gate

| Completion condition | Result |
|---|---|
| source selection/load/merge implementable | pass |
| type/range/reference/cross-field validation complete | pass |
| 18 configuration modules covered | `18/18` |
| canonical rows covered | `27/27` |
| local/external/source/route cardinality | `27/27`, `9/9`, `6/6`, `10/10` |
| Stage sequence and complete predicate | `0~7` complete |
| API/Worker/Jobs activation barriers | `3/3` complete |
| configuration-domain stop reviews | pass |
| cross-loading unresolved conflict | `0` |
| 03 pending writeback/blocker | `0/0` |
| formal 04 write before Step 15 | `0` |
| fabricated implementation/test/evidence/signoff/commit | `0` |

Step 9 is complete. Next allowed action: read SOP Step 10、writing standard §5.10、Steps 7~9 and Step 8 sensitive audit ownership；then define product-neutral configuration change classes、review、audit record、restart activation and rollback without adding live reload or a concrete ticket system.
