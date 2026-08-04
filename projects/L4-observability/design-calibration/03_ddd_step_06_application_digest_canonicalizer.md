# L4-observability 03-详细设计 Step 06 - R06.6-F1 digest canonicalizer 与 material 契约

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前修复批次: `R06.6-F1`
> 当前写入批次: `R06.6-F1-W3`
> 正式回填: blocked until Step 19；本文件是设计讨论中间产物，不是实现代码

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::digest`；affected owner 为 `contracts::refs` 与 `application::errors` |
| 当前子批次 | `R06.6-F1-W3`；已闭合digest错误、profile migration、golden/property/migration test design、全量affected-use与静态totality；不进入F2 UoW cursor修复 |
| 当前状态 | `[x]` W3 已完成design-only并停审；W1/W2已由用户确认，F1整体完成但未经新确认不得进入F2 |
| 当前 gate_status | `R06.6-F1-W3_done_waiting_user_before_F2` |
| 下一允许动作 | `wait_user_confirmation_before_R06.6-F2` |
| 正式回填状态 | `blocked_until_step_19`；不得修改正式 `03-详细设计.md` |
| 外部上游 blocker | `none`；当前 `00/01/02` 的 ownership 与 no-write 边界可支撑本批 |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；`R06-F-AFFECT-UOW-01=open_controlled` |
| 是否需要提交 | 不需要；本批只写设计仓中间产物和三层设计台账 |

### 1.1 F1 写入批次计划

| 写入批次 | 覆盖范围 | 状态 | 完成门禁 |
|---|---|---|---|
| `R06.6-F1-W1` | profile v1、canonical framing、唯一 owner、material kind、registry 基础与核心 include/exclude 方向 | `done_confirmed` | owner 无重复、profile 语法可审查、不得依赖 raw serde/body/debug bytes |
| `R06.6-F1-W2` | 16 Command、14 Query、9 Consumer、9 Job 的逐入口 exact material 表；stored result / outbox / plan / item / outcome / report / external effect 逐对象字段表 | `done_confirmed` | 每个 material 字段有来源、顺序、Option/set 规则和消费者；旧 shape 已登记为 affected use |
| `R06.6-F1-W3` | 外部 digest 校验、profile readable/migration、golden vector / property test 设计、affected-use register、回填草稿与静态 closure | `done_waiting_user` | 五类application error、四阶段migration、12/48/8/4 totality与下游affected-use均已design-only闭合 |

F1 完成后必须停审，等待用户确认后才能进入 `R06.6-F2`。`R06.6-F2` 只处理同一 UoW 中 post-state、committed cursor 与 append-only record factory 的顺序，不得在 F1 中提前写入。

### 1.2 本写入批次允许与禁止

| 允许 | 禁止 |
|---|---|
| 新建或增量维护本文件；同步 Step 06 主控、flow、项目台账的 current pointer | 修改正式 `03-详细设计.md`、Step 07~19、任何 `04` 文件 |
| 从 Step 13 / Step 14 读取 definition/use 作为 affected-use 输入 | 把冻结下游的 `deterministic JSON` 段落直接当作 current truth |
| 定义 body-free typed material 的 canonical contract | 对 raw request、raw event、raw provider body、serde/debug 输出直接 hash |
| 登记 `ApplicationError` digest mismatch 的 affected definition | 在本批伪造测试结果、run id、evidence alias、实现 commit 或验收签署 |
| 写 planned test / golden vector 设计 | 进入 `R06.6-F2`、`R06.7` 或实现仓 |

## 2. 本步输入

### 2.1 必读输入与用途

| 输入 | 使用范围 | 当前权威限制 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` | Step 06 对象卡、字段来源、factory/member、状态和停审要求 | 约束产物结构，不提供本项目对象 truth |
| `standards/document/详细设计书写规范.md` | 5.5 对象实现契约格式 | 正式正文仍要到 Step 19 才装配 |
| `standards/document/设计文档讨论中间产物规范.md` | 固定十段结构、逐模块 capability、跨模块审计和分批门禁 | W1 已按十段结构静态闭环；W2 按四个入口/存储区段写入，F1 仍保持未完成并明确 W3 缺口 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 唯一 owner、typed secondary carrier、字段来源、no-truth-writeback | 不允许由历史下游段落偷渡 definition |
| `03_ddd_step_06_contracts_carriers.md` | `DigestProfileVersion`、`DigestValue`、`RequestDigest`、`DigestSummary` 的 current value owner | 本文件只引用这些 value type，不重复声明 contracts struct |
| `03_ddd_step_06_application_operation_context_idempotency.md` | operation family、actor、request digest、reservation relation | A 批是前置 definition；F1 只补 canonical material 生成和验证 |
| `03_ddd_step_06_application_stored_result_outbox.md` | stored result / payload digest 的承载位置与 immutable boundary | 不改变 B 批对象 owner 或 outbox state |
| `03_ddd_step_06_application_job_plan_claim_config.md` | plan、planned item、item outcome、claim/fence 中 digest 字段及排除项 | 不改变 D 批 immutable plan / claim semantics |
| `03_ddd_step_06_application_report_error_service.md` | report/result/service 对 digest 的消费；`ApplicationError` 唯一 owner | E 批不再被复制；digest-specific error 通过 affected-use 回填 |
| `03_ddd_step_13_concurrency_idempotency.md` | §§7、13~18 的 stable field、volatile exclusion、Command/Consumer/Job use table | 冻结文件只作 use-site 和差异输入；canonical grammar 由 F1 重建 |
| `03_ddd_step_14_config_external_binding.md` | §9.2、配置读取和 readable profile use | 只证明 runtime 可注入 profile support，不允许 config 改写 semantic grammar |
| 当前正式 `00/01/02` 与 Step 05 | truth ownership、模块依赖、forbidden body、application owner | 作为上游约束；本批不改写 |
| L1-governance、L1-artifact、L1-identity、L0-bus 对应 digest 产物 | 粒度、profile version、stable material 和 test cut 参考 | 只参考组织深度，不复制相邻域 truth |

### 2.2 权威顺序与冲突处理

1. 先以当前正式 `00/01/02` 和 Step 03~05 的 ownership / boundary 为约束。
2. `contracts::refs` 的四个 digest value type 只从 R06.2 current owner 读取；本批不创建同名 wrapper 或 alias。
3. F1 负责 `application::digest` 的 material registry、canonical framing、profile algorithm binding 和 validated input factory。
4. Step 13 的 operation 表提供 stable-field 候选和 affected use；若其表述与本文件冲突，以本文件完成确认后的 F1 结构化结论为准，并在 affected register 回灌。
5. Step 14 的“deterministic JSON + SHA-256”只是冻结下游材料。F1 重新给出精确 grammar；相同算法结论若被保留，也必须通过本文件的独立推导进入 current truth。
6. 任何 raw body、raw serde object、debug string、transport header 或 provider response 都不能因为下游已有字段而进入 canonical material。

## 3. SOP 问题回答

### 3.1 digest value type 与 canonicalizer 是否有唯一 owner?

有，且必须分成两个层次：

| 层次 | 唯一 owner | 负责内容 | 明确不负责 |
|---|---|---|---|
| value / wire carrier | `contracts::refs` | `DigestProfileVersion`、`DigestValue`、`RequestDigest`、`DigestSummary` 的表示、解析、wire 和 body-free debug 规则 | 不读取 material、不选择 operation 字段、不执行 hash |
| material / algorithm implementation | `application::digest` | `DigestMaterialKind`、material registry、typed canonical encoder、profile support、SHA-256 计算、supplied digest 验证 | 不拥有 public digest value type、不拥有业务 truth、不访问 repository / resolver / adapter |

这样既保持 `contracts` 不反向依赖 `application`，又避免每个 Command、Consumer、Job 私自拼接 digest。

### 3.2 profile v1 的算法和编码是否可落码?

W1 的 current proposal 是：`DigestProfileVersion(1)` 使用 registry-owned deterministic JSON byte model，再对 canonical UTF-8 bytes 做 SHA-256，输出 64 位 ASCII lowercase hexadecimal。这里的 JSON 只是 digest material 的 byte framing，不等于 public transport 使用 JSON，也不允许对未验证 raw JSON 求 hash。

可落码的关键不是“使用 JSON”这句话，而是下列 grammar 必须固定：对象字段顺序、typed discriminator、enum token、Option 表示、list/set 语义、整数表示、字符串 escaping、禁止 arbitrary map 和禁止 float。W1 先固定 grammar 总则；逐入口字段顺序在 W2 固定。

### 3.3 哪些输入必须进入或排除 digest?

- 必须进入：会改变 local logical result、accepted observation projection、immutable job work-set、stored replay surface 或 external effect binding 的 validated typed material。
- 必须排除：raw idempotency key、request/message/job execution identity、trace metadata、wall-clock timestamps、transport offset、delivery attempt、retry counter、claim/fence/lease token、generated row id 和 raw external body。
- `source_event_ref`、source/schema/version、typed actor scope、route-bound ref 和 semantic expected version属于稳定 material；它们不能因为看起来是“metadata”就统一排除。

### 3.4 supplied digest 如何验证?

入口先从 validated typed material 本地计算 expected digest，再与 caller / transport 携带的 digest 做 profile 和 value 的等价比较。缺失或 mismatch 在 reservation、domain mutation、outbox append、claim acquire 之前返回 typed application error；不得信任 transport digest，也不得 mismatch 后继续执行 mutation。

### 3.5 profile migration 如何处理?

写入 profile 与可读 profile 分离。当前写入只允许 v1；读取必须保留仍被 reservation、stored result、outbox snapshot、plan、intent、item outcome 或 report 引用的旧 profile。新 profile 必须显式 version bump，先 dual-read，再 switch-write，最后在 retention / migration audit 完成后 retire old；禁止以 current profile 重算并覆盖旧 digest。

### 3.6 Query 是否进入 idempotency / digest writer lane?

Query 可以计算一个 request digest 作为 validated read context 的完整性 marker，但 Query 不进入 reservation、stored result、outbox、cursor、refresh、rebuild 或 repair writer lane。相同 Query 只重复读取当前 authorized surface；digest 不能把 Query 变成 durable replay writer。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | F1 处理 |
|---|---|---|---|
| R06.2 `DigestProfileVersion` 卡 | 只固定 v1 数值和“canonical serializer profile”，未给完整 byte grammar | 实现者仍可选择任意 serde / map / number formatting | W1 固定 profile framing 和 primitive grammar |
| R06.2 `DigestValue` 卡 | 已固定 64 lowercase hex，但未把 hash input、domain separation 和 profile binding闭合 | 相同字段在不同 material family 可能产生可互换 digest | W1 将 `profile + kind + typed value` 纳入 hashed frame；字段语义变化必须提升 profile |
| Step 13 §13 | 有 enum/ref/Option/list/set 的原则和 global include/exclude，但定义与 use 分离 | Step 06 application object 仍无法知道谁负责 exact encoder | W1 建立 `application::digest` 唯一 owner 和 registry |
| Step 13 §§14~16 | 16 Command、9 Consumer、9 Job 有 stable field 表，但未形成 current registry | 新增 operation 时容易私补字段或遗漏排除项 | W2 逐入口卡和 totality audit |
| Step 14 §9.2 | “deterministic JSON + SHA-256”已写入冻结下游，但 JSON grammar不完整 | 不能直接作为实现契约；与当前 repair source 层级冲突 | 作为 historical / affected-use 输入，F1 重建精确规则 |
| R06.6-A/B/D/E | request/result/payload/plan/outcome/report 已携带 digest，但都把 canonicalization defer 给 F | carrier 有字段却没有生成和验证 owner | W1 固定 carrier-to-material kind；W2 补 exact field source |
| current `03` formal §5/§13 | 有 digest carrier 和 profile compatibility 摘要，但未由 current F1 中间产物追溯 | 正式正文不能证明字段来源和迁移条件 | 保持 formal 冻结，Step 19 只回填 F1 confirmed draft |
| 错误边界 | 历史`ApplicationError`只有通用变体，无法精确表达digest failure | profile mismatch可能被实现成字符串或generic unavailable | W3已在E批唯一owner中补五个有限variant并固定recovery/safe-detail；`SerializationFailed`不再代替digest错误 |

## 5. 改动前后对比

| 维度 | 改动前 | W1 改动后 | 原因 |
|---|---|---|---|
| value owner | contracts value type存在，但 canonicalizer owner不明确 | value 仍归 `contracts::refs`，material/algorithm 唯一归 `application::digest` | 防止 contracts 反向依赖 application，也防止入口各自 hash |
| domain separation | 依赖 operation 表的文字约定 | frame 固定包含 `profile`、`kind` 和 exact operation/material discriminator | 防止 RequestDigest / DigestSummary / payload digest 跨 family 互换 |
| profile v1 | 只写“canonical serializer”或冻结下游的一句 JSON 摘要 | 固定为 deterministic JSON byte model + UTF-8 + SHA-256 + lowercase hex，并补 primitive grammar | 让实现者知道 hash 的确切输入边界 |
| object encoding | 可能使用 Rust enum Debug、serde map 或 transport JSON | 只允许 registry-owned typed writer；固定字段顺序、token、Option、list/set和数值规则 | 消除跨语言、跨 fake/durable/entry 的 byte drift |
| material registry | Command / Consumer / Job 表散落在 Step 13 | 建立单一 registry，W2 逐入口填充，stored/plan/report/effect family一起纳入 | 便于总量审计和新增 operation 的门禁 |
| supplied digest | 只要求“compare” | 先本地计算 expected，再做 profile/value 校验；失败在 mutation 前返回 typed error | transport digest不能成为 truth或mutation授权 |
| migration | 只有 readable set 的概念 | 明确 write/read separation、dual-read、explicit version bump、old digest不可覆盖 | 保证 retained replay 可读且可审计 |
| Query | 共享 context 容易被误读为 reservation input | Query digest 仅为 read context integrity marker，明确 zero-write | 保持 Query no-write invariant |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. schema-owned deterministic JSON byte model | 可审查、跨 fake/durable/entry 易复现、与现有 profile compatibility 方向一致；可明确字段顺序和 typed token | 需要严格禁止 arbitrary map、float 和默认 serde；grammar 文档较长 | 采用；W1 固定 byte model，W2 补逐入口字段顺序 |
| B. 自定义 binary framing | 字节紧凑，primitive grammar容易机械化 | 需要新增 wire reader / version / cross-language tooling，现有下游没有该 owner；审计可读性差 | 不采用；除非后续证明 JSON 无法满足容量或安全约束，否则不得切换 |
| C. 直接对 transport JSON / serde bytes hash | 实现短 | 字段顺序、默认值、未知字段、raw body 和产品 wire 会改变 digest；无法证明 typed material | 禁止 |
| D. 由 `contracts` 实现 canonicalizer | public value 与算法靠近 | contracts 需要知道每个 operation / job / domain material，违反依赖方向并吞入 application truth | 不采用 |
| E. 由每个入口或 service 自己计算 digest | 局部简单 | 产生多套 grammar、key drift、Query 误写和 fake/durable 不一致 | 禁止；统一 `application::digest` |
| F. profile 完全由配置选择 | 便于部署切换 | 配置可改变 idempotency / replay identity，破坏已有 durable material 兼容性 | 不采用；配置只能提供 validated readable support，不能改写 profile semantics |

## 7. 结构化中间产物

### 7.1 shared vocabulary / typed carrier 收敛表

| 类型 | 所属层 | current owner | W1 契约 | 后续使用 |
|---|---|---|---|---|
| `DigestProfileVersion` | contracts value | `contracts::refs` | 只接受 finite supported profile；v1 由 `v1()` 构造；不得由 caller 任意选择 | 所有 digest carrier |
| `DigestValue` | contracts value | `contracts::refs` | exactly 64 ASCII lowercase hex；不携带 algorithm prefix；Debug redacted | `RequestDigest` / `DigestSummary` |
| `RequestDigest` | contracts value | `contracts::refs` | profile + value；表示 normalized Command / Query / Consumer / Job request | context、reservation、plan、result |
| `DigestSummary` | contracts value | `contracts::refs` | profile + value；表示 body-free material、stored payload、outcome 或 effect material | linkage、outbox、item、report、token |
| `DigestMaterialKind` | application discriminator | `application::digest` | finite tagged kind；token进入 canonical frame；不暴露为自由字符串 | canonicalizer registry |
| `ObservationDigestProfileSupport` | application support carrier | `application::digest` | `write_profile` + sorted unique `readable_profiles`；write必须可读；不改变 grammar | runtime assembly / loader |
| `ObservationDigestMaterial` | application sealed material contract | `application::digest` | 只允许 registry-owned typed implementations；必须声明 kind并按 profile-owned固定字段顺序写入 | Command/Query/Consumer/Job和durable material |
| `ObservationDigestCanonicalizer` | application service/helper | `application::digest` | pure typed encoder + SHA-256 + profile/value validation；不访问 I/O | all application façades |
| `DigestProfileSupportError` | startup support error | `application::digest` | finite compiled support / write-readable校验；由runtime builder映射startup invalid configuration | Step 14 runtime assembly |
| `RequestDigestCandidates` | application admission carrier | `application::digest` | `write_profile` + sorted unique readable-profile candidates；每个profile只有一个物理candidate，write candidate由profile选择；process-local，不持久化 | Command/Consumer/Job atomic reserve |
| `DigestFailureStage` / `DigestFailureContext` | process-local safe diagnostic carrier | `application::digest` | 只含finite kind/stage/optional profile；不含digest、bytes、key、body或locator | Step 15 affected telemetry |

`DigestMaterialKind` 不替代 `ObservationOperationName`、`SchemaVersion`、`DigestProfileVersion` 或 `StoredObservationResultKind`。它是 domain-separation token；每个上层类型仍由自己的 owner 持有。

### 7.2 `DigestMaterialKind` 初始 finite registry

| kind | canonical token | 输出类型 | 主要 owner / 来源 | 是否进入 reservation |
|---|---|---|---|---|
| Command request | `command_request` | `RequestDigest` | validated Command operation + body | 是 |
| Query request | `query_request` | `RequestDigest` | validated Query operation + read input | 否；Query no-write |
| Inbound consumer request | `inbound_consumer_request` | `RequestDigest` | validated envelope + producer/source/version + payload | 是 |
| Operations Job request | `operations_job_request` | `RequestDigest` | validated Job input + actor scope | 是 |
| Stored result surface | `stored_result_surface` | `DigestSummary` | exact immutable canonical result bytes；kind/schema独立校验 | 由 reservation result relation消费 |
| Outbox payload snapshot | `outbox_payload_snapshot` | `DigestSummary` | exact immutable canonical event bytes；event/schema/binding独立校验 | 由 outbox record消费 |
| Job execution plan | `job_execution_plan` | `RequestDigest` | immutable operation/config/work-set snapshot | 是；plan与reservation绑定 |
| Job plan item | `job_plan_item` | `RequestDigest` | one immutable work key + planned material | item row / report fold |
| Job item outcome | `job_item_outcome` | `DigestSummary` | typed state/outcome/ref sets/association | item CAS / report fold |
| Job report | `job_report` | `DigestSummary` | lossless plan-bound fold + terminal/report association | stored result / finalize |
| External effect intent | `external_effect_intent` | `DigestSummary` | append-only intent的derived semantic-effect material；不是对象新增字段 | repository semantic uniqueness / integrity compare |
| External effect token | `external_effect_token` | `DigestSummary` | stable binding/effect/material token | publisher / handoff / export |

The registry is exhaustive for W1's current application digest families. A new family requires a new kind token, profile compatibility review, owner entry, golden vectors and affected-use audit; it cannot reuse `command_request` or `job_report` by convention. Existing kind 的字段集合、字段顺序、Option/list/set 语义或 primitive encoding 发生变化时，必须提升 `DigestProfileVersion`；P0 不建立独立、未持久化的 material schema version。

### 7.3 Profile v1 canonical frame

The v1 frame is a generated JSON object with exactly three top-level members in this byte order:

```text
{"profile":1,"kind":"<kind-token>","value":<typed-value>}
```

The frame rules are:

| Element | Canonical rule |
|---|---|
| encoding | UTF-8 bytes; no BOM; no whitespace outside strings; one complete JSON value only |
| top-level order | exactly `profile`, `kind`, `value`; no extra member and no omitted member |
| profile | unsigned decimal `1`; it is the `DigestProfileVersion` domain separator, not `SchemaVersion` |
| kind | exact lowercase `snake_case` token from §7.2; no display name, numeric enum ordinal or `Other` fallback |
| value object | members are emitted in the order declared by the material registry; arbitrary maps are forbidden |
| typed enum | exact stable token or tagged object defined by its owner; Rust variant name and `Debug` output are never used |
| typed ref | encode owner/type discriminator before validated opaque value; two wrappers with the same inner bytes remain different material |
| `Option<T>` | explicit tagged object `{"tag":"absent"}` or `{"tag":"present","value":<T>}`; absent, null, empty and default are not interchangeable |
| ordered list | JSON array in validated semantic order; reordering changes digest |
| canonical set | validate owner/kind, reject duplicates unless the named set factory explicitly defines duplicate folding, then sort by each member's complete canonical bytes and emit array |
| boolean | lowercase `true` / `false` |
| integer | base-10 ASCII, no leading zero, zero is `0`, negative zero forbidden; no locale formatting |
| float | forbidden in v1; a domain requiring decimal data must supply a validated decimal/string value object whose encoding is fixed by the current profile |
| string | JSON string; preserve validated Unicode scalar sequence; emit non-ASCII as UTF-8; escape `"`, `\` and controls using one fixed JSON escape form; no Unicode normalization or case folding |
| null | forbidden in typed material; use explicit `Option` framing |
| map | arbitrary key maps forbidden; use a named typed object with fixed field order or a canonical set of key/value entries |
| raw bytes | must be a bounded typed byte value with an explicit material owner; raw request/event/provider body is forbidden |

The phrase “deterministic JSON” therefore does not mean `serde_json::to_vec` over an arbitrary struct. Every material writer is profile-owned, sealed to the registry, and must produce the frame above before SHA-256. The digest output is the lowercase hexadecimal encoding of the 32-byte hash and is then wrapped by the current contracts value type. Any v1 grammar change is a profile incompatibility, not an in-place serializer update.

### 7.4 Global material include / exclude matrix

| Material class | Include in canonical material | Exclude even when available | Source / owner |
|---|---|---|---|
| operation request | exact family + operation variant; effective actor scope; validated typed body/input; route-bound refs; semantic expected version | raw idempotency key; request id; requested/received/current time; metadata trace/span; transport headers | operation context + validated DTO |
| inbound event | exact Consumer variant; validated producer family; source event ref; source ref; schema version; optional comparable source version; typed payload fields | dedup key as digest material; message id; bus offset; occurred_at; delivery attempt; ack state | inbound envelope + producer catalog |
| operations Job | exact Job variant; actor scope; target/scope/filter/page/cursor/input refs; explicit source cursor/version; fields changing candidate set | execution ref; JobRunId correlation; claim/fence/lease; attempt/retry schedule; current clock | Job metadata + frozen validated input |
| stored result | exact bounded canonical serialized surface bytes；`stored_result_surface` kind 只作 domain separator | result kind、protocol schema、result/public/idempotency refs、disposition、actor、time、row version；这些仍须独立逐字段校验 | immutable replay surface |
| outbox payload | exact bounded canonical serialized event bytes；`outbox_payload_snapshot` kind 只作 domain separator | event/name/schema/subject/snapshot/binding/cursor/trace/time、route/default、endpoint/topic/credential、provider response；这些仍须独立逐字段校验 | immutable payload snapshot |
| plan | operation/request digest; complete config snapshot; canonical work-key set; each planned material digest; source/cursor/version guards | execution ref; report ref; claim/fence; worker; attempt; clock; mutable current config | immutable plan |
| plan item | typed work key；exact planned semantic material；optional source/observed version | `planned_input_digest` 自身；plan ref；所有 `captured_repository_version` / item row CAS version；claim/fence/lease、running time、worker identity | immutable item |
| item outcome | state classification；complete typed association；affected/failed/gap/progress sets | `outcome_digest` 自身；repository version；claim/fence；非 association-owning 的完成时间；不存在独立 material schema 字段 | item result factory |
| report | plan ref/digest; complete canonical fold; report-level typed failure association; terminal state | report row version; claim token; worker; current candidate list; signoff/verdict/evidence alias | report factory |
| external effect | phase/effect kind; historical binding ref; stable material digest; local intent/token relation | attempt; lease; current destination; credential; provider body; external runtime run id | external effect object |

### 7.5 Canonicalizer object card (W1)

#### Rust-facing design skeleton

```rust
/// Validated write/read support for the versioned observation digest profile.
pub(crate) struct ObservationDigestProfileSupport {
    write_profile: DigestProfileVersion,
    readable_profiles: Vec<DigestProfileVersion>,
}

/// Canonical typed material used by the observation digest registry.
pub(crate) trait ObservationDigestMaterial: sealed::Sealed {
    const KIND: DigestMaterialKind;

    fn write_value(&self, writer: &mut CanonicalJsonWriter) -> Result<(), ApplicationError>;
}

/// Sole application owner of material framing, hashing, and supplied-digest validation.
pub(crate) struct ObservationDigestCanonicalizer {
    profile_support: ObservationDigestProfileSupport,
}
```

#### Fields and source

| 字段 | 类型 | 来源 | 不变量 |
|---|---|---|---|
| `write_profile` | `DigestProfileVersion` | validated runtime support assembled from current profile policy | W1 只能是 v1；不能由 request 或 provider 选择 |
| `readable_profiles` | canonical `Vec<DigestProfileVersion>` | validated compatibility input | sorted unique；必须包含 write profile；不能移除仍被 durable material 引用的 profile |
| `KIND` | `DigestMaterialKind` | registry-owned implementation | exact finite token；不能由 caller string 拼接 |
| typed value | operation-specific validated type | Command / Query / Consumer / Job / immutable object factory | 不含 raw body、secret、locator 或未经验证 map |

#### Factory / member contract

| 函数 | 返回 | 副作用与约束 |
|---|---|---|
| `ObservationDigestProfileSupport::new(write_profile, readable_profiles)` | `Result<Self, DigestProfileSupportError>` | 校验 finite compiled profile、排序去重、write/read compatibility；startup invalid config不伪装成operation error；不访问 store |
| `ObservationDigestCanonicalizer::new(profile_support)` | `Self` | 只接受已验证 support；不从 config raw map 推断 profile；constructor不再有失败分支 |
| `digest_request<M>(&self, material: &M)` | `Result<RequestDigest, ApplicationError>` | 只计算current write-profile frame；供Query read context或不进入reservation的本地用途；纯函数 |
| `request_candidates<M>(&self, material: &M)` | `Result<RequestDigestCandidates, ApplicationError>` | Command / Consumer / Job admission对每个readable profile恰算一次；新row只保存write candidate |
| `digest_summary<M>(&self, material: &M)` | `Result<DigestSummary, ApplicationError>` | current write profile下生成新immutable material摘要；与request使用同一framing但输出类型和`KIND` relation不同 |
| `verify_supplied_for_write(&self, candidates, supplied)` | `Result<(), ApplicationError>` | supplied present时只与current write candidate比较；失败不得进入reservation或mutation |
| `verify_persisted_request<M>(&self, material: &M, stored: &RequestDigest)` | `Result<(), ApplicationError>` | 先验证stored profile readable，再在同profile重算；禁止current-profile substitution或覆盖stored值 |
| `verify_persisted_summary<M>(&self, material: &M, stored: &DigestSummary)` | `Result<(), ApplicationError>` | 只比较已验证typed persisted material；不能根据stored value反推material，也不能silent rehash |
| `supports_read_profile(&self, profile)` | `bool` | 只读 profile capability；不触发 migration 或重算 |
| private `encode_frame<M>(&self, material: &M)` | bounded `Vec<u8>` | 禁止 raw serde/debug;超过 bounded writer policy 返回 typed error |

#### Object invariants

1. Canonicalizer 不调用 clock、id generator、repository、resolver、publisher、UoW、claim 或 adapter。
2. Canonicalizer 只接受 validated typed material；没有 `encode_raw_json`, `hash_debug`, `hash_request_body` 或 `hash_provider_response` 成员。
3. `RequestDigest` 与 `DigestSummary` 不可互相转换；相同 bytes 也不消除 value-type / material-kind boundary。
4. supplied digest mismatch 是验证失败，不是“采用 caller digest”的分支；任何 mismatch 后的 mutation 都是实现 blocker。
5. profile algorithm 改变必须通过显式 version bump；不能在 v1 token 下替换 serializer、escaping 或 field ordering。

W1 的原构造/验证签名已由 W3 最终契约覆盖：startup support failure使用`DigestProfileSupportError`，operation与persisted consistency failure使用E批唯一`ApplicationError` owner的五个digest variant。实现侧不得恢复旧返回类型或用message text猜测分类。

### 7.6 W1 capability 到对象映射

| capability | 输入 | 输出 | 状态 / 副作用 | 承接对象 | 后续承接 |
|---|---|---|---|---|---|
| profile validation | profile version + readable set | validated support | 无 I/O；invalid support fail closed | `ObservationDigestProfileSupport` | Step 14 runtime assembly |
| typed frame construction | registry-owned material | canonical UTF-8 bytes | bounded pure computation | `CanonicalJsonWriter` + material implementation | W2 field cards |
| request digest creation | Command / Query / Consumer / Job typed material | `RequestDigest` | 无 mutation | `ObservationDigestCanonicalizer` | A/D/E carriers |
| summary digest creation | immutable result/payload/plan-item/report/effect material | `DigestSummary` or plan `RequestDigest` | 无 mutation | `ObservationDigestCanonicalizer` | B/C/D/E carriers |
| transport digest verification | validated material + optional supplied digest | verified digest or typed error | must happen before reserve/UoW | canonicalizer + application error owner | Step 08/09/12/13 affected use |
| profile readability check | persisted profile version | boolean / typed incompatibility | no silent re-encode | profile support | Step 11/12/14 |

### 7.7 W1 module stop review

| 审查项 | 当前结论 | 缺口 / 修正 |
|---|---|---|
| value type 是否只有一个 owner | `pass_for_W1` | R06.2 contracts owner未复制 |
| canonicalizer 是否只有一个 owner | `pass_for_W1` | `application::digest`；具体 file layout留 Step 04/R06.8 affected audit |
| profile v1 是否有 algorithm/domain separation | `pass_for_W1_consumed_by_W2_W3` | W2已闭字段；W3已补grammar/golden corpus与migration门禁 |
| primitive grammar 是否可落码 | `pass_after_W3` | §7.27有exact text/bytes/length/hash和JSONL contract |
| 16/14/9/9 每个入口是否已逐字段闭口 | `pass_after_W2` | §§7.10~7.13逐入口，§7.29逐fixture totality |
| supplied digest mismatch 是否有最终 error owner | `pass_after_W3` | E批唯一`ApplicationError` owner的五个digest-specific variants |
| 是否进入 UoW / cursor / record 顺序 | `no` | F2 保持独立 |

### 7.8 W1 正反例

**允许的实现形状：**

```text
validated typed Command body
  -> command_request material writer
  -> fixed v1 frame (profile/kind/value)
  -> SHA-256 lowercase hex
  -> RequestDigest
  -> compare supplied digest
  -> only then reserve / begin mutation UoW
```

**禁止的实现形状：**

```text
raw HTTP JSON / broker bytes / Debug output
  -> serde serializer chosen by endpoint
  -> hash string
  -> trust caller value
  -> reserve or mutate
```

W1 不对任何测试或实现结果作声称；上面的图只是 planned execution boundary。

### 7.9 W2 输入核准与公共 canonical value grammar

W2 重新读取了 Step 13 §§13~16、Step 08 Command / Query / Consumer / Job DTO，以及 A~E 批 current object cards。冻结 Step 08 / 13 只能证明 use-site，不能覆盖 Step 06 已完成的 owner 修复。数量核准结果为 16 Command、14 Query、9 Consumer、9 Job；这 48 个入口都需要一个本地 `RequestDigest`，但只有 Command、Consumer、Job 允许进入 reservation lane，Query 始终为 zero-write。

| 核准项 | W2 current conclusion | 禁止解释 |
|---|---|---|
| exact operation | 使用 A 批 `Observation*Operation` finite variant 的 stable `snake_case` token | route、handler 名、Rust ordinal、`Debug` 或 public display text |
| actor | 四个入口族都编码 effective `ActorSafeRef`；Consumer / Job 使用 route-bound stable system/operator principal | transport peer、pod、process、worker、display name |
| request metadata | Command 只编码 actor；Query 另编码 visibility scope 与 consistency；Consumer 编码 validated envelope identity；Job 只编码 actor | key、trace、request/job/event identity、clock、attempt |
| current snapshot identity | 只使用 `ReferenceSnapshotStateRef` | 冻结 Step 08 / 13 的 `ReferenceSnapshotRef` |
| peripheral target | 使用 `PeripheralConsumerRef + ObservationProjectionScope` 的结构化 pair | 无 owner 的 `PeripheralConsumerScopeRef` 或新透明 wrapper |
| material version | v1 不增加独立 `schema` 顶层字段 | 以 protocol schema、store revision 或 Rust type version替代 `DigestProfileVersion` |

#### 7.9.1 `value` 的四种入口骨架

下列对象就是 §7.3 顶层 frame 中 `value` 的 exact shape。成员名和顺序属于 profile v1；修改任一成员名、顺序或 presence rule 都要求提升 `DigestProfileVersion`。

```text
Command:
{"operation":<command-token>,"actor_ref":<typed-ref>,"body":<command-body>}

Query:
{"operation":<query-token>,"actor_ref":<typed-ref>,"visibility_scope_ref":<typed-ref>,"consistency":<option-enum>,"body":<query-body>}

Inbound Consumer:
{"operation":<consumer-token>,"actor_ref":<typed-ref>,"producer_family":<enum-token>,"source_event_ref":<typed-ref>,"source_ref":<typed-ref>,"source_version_ref":<option-source-version>,"schema_version":<enum-token>,"payload":<consumer-payload>}

Operations Job:
{"operation":<job-token>,"actor_ref":<typed-ref>,"input":<job-input>}
```

`command_name` / `query_name` / `consumer_name` / `job_name` 必须先通过 total static map 得到同一个 application operation variant，随后只编码 application variant token，不重复编码 public name。family-level `kind` 已在顶层 frame 提供，但 exact operation 仍必须在 `value` 中提供，二者共同完成 domain separation。

#### 7.9.2 Nested value encoding registry

| value category | exact v1 encoding | compatibility rule |
|---|---|---|
| unit enum | owner-declared lowercase `snake_case` JSON string | unknown、alias、display text和ordinal拒绝 |
| payload enum | `{"tag":"<stable-token>","value":<payload>}`；对象成员顺序固定为 `tag`,`value` | unit与payload variant不能互换 |
| typed opaque ref | `{"type":"<design-type-token>","value":"<validated-inner>"}`；顺序为 `type`,`value` | type token是本设计中的 exact type name，不是Rust module path；rename或wrapper变化要求profile bump |
| named struct / snapshot | 按 owning Step 06 object card 的字段顺序写固定 JSON object；不得反射字段或遍历 map | current owner字段变化要求profile bump；historical shape无encoder |
| `DigestSummary` / `RequestDigest` nested value | `{"profile":<unsigned-decimal>,"value":"<64-lowercase-hex>"}` | 不把algorithm name、Debug text或外层digest类型省略为裸hex |
| `ObservationSourceVersionRef` | `{"producer_family":<enum>,"source_ref":<typed-ref>,"version_token":<typed-value>}` | producer/source/token逐项保留；不得以schema/cursor/time替代 |
| page request | `{"cursor":<Option<ObservationPublicCursor>>,"limit":<u32>}` | cursor opaque但具名typed；limit在digest前完成bound validation |
| `VisibilitySurface` | `{"kind":<enum>,"gap_ref":<Option<GapStateRef>>,"degraded":<Option<DegradedSurface>>}` | malformed kind/gap/degraded组合在canonicalizer前拒绝 |
| `DegradedSurface` | `{"reason":<enum>,"gap_ref":<Option<GapStateRef>>,"limited_consumption_allowed":<bool>}` | false、absent和blocked不互换 |
| canonical set | JSON array，member先完整canonical encode，再按unsigned byte lexicographic order排序；owner允许exact duplicate fold时先fold，否则duplicate拒绝 | 不按Debug、inner裸字符串、database collation或输入顺序排序 |
| ordered list | JSON array，保留validated semantic order | 只有下表明确标为 `set` 的列表才可排序 |
| bounded bytes | lowercase hexadecimal JSON string，每个byte恰好两个字符 | 不使用base64、UTF-8猜测、lossy conversion或raw JSON splice |

v1 string escaping 固定为：`"` -> `\"`，`\` -> `\\`，U+0008/U+0009/U+000A/U+000C/U+000D 分别使用 `\b/\t/\n/\f/\r`；其余 U+0000~U+001F 使用小写十六进制 `\u00xx`；`/` 不转义；其余 Unicode scalar 直接输出 UTF-8。禁止 Unicode normalization、ASCII case folding、可选 solidus escaping、uppercase `\u` hex 或孤立 surrogate。W3已在§7.27将这些规则固化为exact byte/hash grammar seed与planned cross-language corpus contract。

#### 7.9.3 Collection / Option notation

后续表格使用以下记号：`Opt` 表示 §7.3 的显式 absent/present object；`Set` 表示 canonical sorted/unique set；`List` 表示保序数组；未标注者为 required scalar/enum/ref/named object。嵌套 named object必须递归遵守同一规则。字段来源统一为“完成 protocol validation 后的 typed DTO / current owner object”，不能从 raw transport重新解析。

### 7.10 16 个 Command exact material

所有行共用 §7.9.1 Command 前缀，表内只列 `body` 的 exact member order。Command metadata 的 `idempotency_key`、metadata `trace_ref`、supplied `request_digest` 和 `requested_at` 全部排除；body 内显式 `trace_ref` 是 semantic relation，按表编码。

| Command operation token | `body` exact member order | Option / collection semantics | current source / redline |
|---|---|---|---|
| `submit_observation_material` | `source_ref`;`source_family`;`submission_purpose`;`safe_summary_ref`;`redaction_marker` | final two are `Opt` | exact validated request；不读取/hash source body |
| `record_safety_disposition` | `receipt_ref`;`disposition_state`;`redaction_marker`;`sanitized_summary_ref`;`quarantine_reason` | final two are independent `Opt` | redaction marker不是summary/reason alias |
| `bind_correlation_context` | `receipt_ref`;`trace_ref`;`causation_ref`;`source_ref`;`correlation_seed` | middle two and final field are independent `Opt` | body `trace_ref`进入；metadata trace排除 |
| `record_safe_signal` | `correlation_context_ref`;`signal_kind`;`summary_ref`;`runtime_signal_ref`;`rollup_window_ref` | final two are independent `Opt` | 不编码raw log/metric/trace或resolver response |
| `append_audit_projection` | `subject_ref`;`correlation_context_ref`;`source_audit_ref`;`audit_action_summary_ref`;`visibility` | visibility is `Opt<VisibilitySurface>` | visibility递归使用§7.9.2；不含audit body |
| `link_body_free_evidence` | `projection_ref`;`boundary_ref`;`digest_summary`;`evidence_purpose` | nested digest fixed profile/value | supplied linkage digest是semantic input，不是本次RequestDigest |
| `prepare_report_handoff` | `handoff_scope_ref`;`evidence_index_input`;`consumer_ref`;`visibility` | visibility is `Opt`;snapshot sets follow owner canonical sets | evidence input使用下方 snapshot projection；不读取current evidence重组 |
| `evaluate_authenticity_hint` | `handoff_ref`;`evidence_index_input_ref`;`gap_refs`;`evidence_origin` | `gap_refs=Set` | origin只是finite hint input，不是verdict |
| `set_retention_marker` | `protected_ref`;`retention_purpose`;`hold_reason`;`release_reason` | two reasons are independent `Opt`；非法双intent先拒绝 | 不按当前retention state省略default |
| `protect_active_reference` | `protected_ref`;`consumer_ref`;`protection_reason` | required | consumer是typed boundary，不是truth owner |
| `define_replay_scope` | `target_refs`;`allowed_effect`;`boundary_constraint_ref`;`replay_purpose` | `target_refs=ReplayTargetRefSet`，owner已canonical | 空集/forbidden source-repair target在digest前拒绝 |
| `record_no_write_violation` | `trigger_context_ref`;`attempted_write_target`;`violation_reason` | required | 不含attempted body、write payload或adapter error |
| `record_gap_state` | `source_ref`;`gap_kind`;`degraded_reason`;`limited_consumption_allowed` | reason is `Opt`;bool required | false与absent不可互换 |
| `prepare_external_audit_export` | `export_scope_ref`;`consumer_ref`;`export_view_ref`;`visibility` | visibility required named object | 不编码endpoint、credential、product或provider body |
| `register_reference_snapshot` | `subject_ref`;`safe_summary_ref`;`freshness`;`source_version_ref` | two refs are independent `Opt` | source version递归保留producer/source/token；不使用requested time |
| `update_reference_snapshot_state` | `snapshot_ref`;`state`;`safe_summary_ref`;`reason_ref`;`source_version_ref` | summary/version are independent `Opt` | `snapshot_ref` current type必须是 `ReferenceSnapshotStateRef`；旧 `ReferenceSnapshotRef` 无encoder |

`EvidenceIndexInputView` 在 Command material 中使用 exact immutable projection，成员顺序为 `input_ref`,`consumer_scope`,`linkage_refs`,`audit_projection_refs`,`gap_refs`,`visibility`,`freshness`,`as_of_cursor`。三个 ref collection 均使用其 owner canonical set；`as_of_cursor` 为 `Opt`。`assembled_at` 是 boundary clock metadata，按 W1 global exclusion 不进入 request digest；其值仍保存在 immutable input object，并在 handoff factory中独立校验，不能由digest覆盖或重取。

Command material factory还必须验证 `ObservationCommandOperation` 与 concrete typed body是一对一映射。任一未知字段、错误body type、historical ref、malformed nested surface或未验证 set 都在计算digest和reserve前失败；canonicalizer不提供“忽略未知字段”模式。

### 7.11 14 个 Query exact material 与 zero-write gate

所有行共用 §7.9.1 Query 前缀。`visibility_scope_ref` 与 `consistency` 会改变 authorized/read consistency surface，因此必须进入 digest；metadata `trace_ref` 与 `requested_at` 排除。`consistency` 即使为 `None` 也显式编码 absent，不能与 `BestEffort` 合并。Query digest只进入 immutable operation context，不进入 reservation、stored result、outbox、cursor、refresh、repair、rebuild或history writer。

| Query operation token | `body` exact member order | Option / collection semantics | current source / redline |
|---|---|---|---|
| `get_observation_receipt` | `receipt_ref` | required | one typed receipt identity |
| `get_intake_status` | `scope`;`page` | page uses exact cursor/limit object | cursor不是repository row version |
| `get_safe_signal` | `signal_ref`;`correlation_context_ref`;`page` | all three are independent `Opt`；selector cardinality先验证 | absent selector不允许service自行扩大到全局扫描 |
| `get_signal_rollup` | `window_ref`;`scope`;`page` | first two `Opt`;page required | one/window-vs-scope rules在digest前验证 |
| `get_audit_timeline` | `subject_ref`;`page` | page required | subject为body-free typed ref |
| `get_evidence_index_input` | `scope_ref`;`handoff_ref` | handoff is `Opt` | Query preview不保存EvidenceIndexInputView |
| `get_report_handoff` | `handoff_ref` | required | read-only handoff identity |
| `get_retention_protection` | `protected_ref` | required | 不触发hold/release evaluation write |
| `get_observation_read_model` | `scope`;`page` | page is `Opt` | scope使用current structured `ObservationProjectionScope` |
| `get_diagnostic_view` | `request_context_ref`;`scope` | required | metadata visibility/consistency已在公共前缀；request context不作为projection lookup key |
| `get_gap_status` | `gap_ref`;`source_ref`;`page` | three independent `Opt`；selector/page组合先验证 | 不因missing触发gap create/close |
| `get_peripheral_export_view` | `consumer_ref`;`scope` | required | consumer/scope pair结构化，不使用产品route |
| `get_reference_snapshot_view` | `snapshot_ref`;`subject_ref` | both `Opt`；exact selector rules先验证 | snapshot current type必须是 `ReferenceSnapshotStateRef`；旧alias无encoder |
| `get_rebuild_progress` | `target_ref` | required | 不触发同步rebuild或resume |

Query `page.cursor`、scope、selector和consistency都是 caller 明确请求语义，不属于 W1 排除的 execution metadata；因此进入 digest。相反，repository page token的内部解码结果、loaded row version、current projection cursor、response freshness、visibility decision和返回 items 都不进入 request material。

### 7.12 9 个 Inbound Consumer exact material

所有行共用 §7.9.1 Inbound Consumer 前缀。entry 必须按顺序完成 route -> authenticated producer -> schema allowlist -> source-version relation -> typed payload validation，之后才能构造 material。`producer_family`、`source_event_ref`、`source_ref`、`source_version_ref` 和 `schema_version` 是公共前缀的一部分；表内只列 `payload` 的 exact member order。

| Consumer operation token | required producer | `payload` exact member order | Option / collection semantics |
|---|---|---|---|
| `consume_bus_observation_material` | `bus` | `source_family`;`submission_purpose`;`safe_summary_ref`;`redaction_marker` | final two are independent `Opt` |
| `consume_source_audit_material` | `source_owner` | `source_audit_ref`;`subject_ref`;`correlation_context_ref`;`audit_action_summary_ref`;`source_family` | context is `Opt` |
| `consume_identity_observation_context` | `identity` | `subject_ref`;`safe_summary_ref`;`freshness` | summary is `Opt` |
| `consume_governance_audit_context` | `governance` | `governance_evidence_ref`;`digest_summary`;`visibility` | nested digest and visibility use §7.9.2 |
| `consume_artifact_evidence_context` | `artifact` | `artifact_evidence_ref`;`digest_summary`;`evidence_purpose`;`visibility` | all required |
| `consume_runtime_signal_summary` | `runtime` | `runtime_signal_ref`;`signal_summary_ref`;`signal_kind`;`correlation_context_ref` | context is `Opt` |
| `consume_sandbox_signal_summary` | `sandbox` | `sandbox_signal_ref`;`receipt_ref`;`signal_summary_ref`;`safety_state` | receipt/state are independent `Opt` |
| `consume_archive_handoff_feedback` | `archive` | `archive_handoff_ref`;`handoff_ref`;`delivery_result`;`feedback_summary_ref` | summary is `Opt` |
| `consume_report_consumer_feedback` | `report_consumer` | `consumer_ref`;`delivery_ref`;`delivery_result`;`gap_kind` | delivery/gap are independent `Opt`;consumer is full structured `PeripheralConsumerRef` |

Consumer-specific constraints are part of validation, not extra implicit digest fields:

1. operation token到required producer是total static map；配置、topic、payload或ref prefix不能改写。
2. envelope `producer_family`必须等于required producer；若`source_version_ref`为present，其nested producer/source必须再次与envelope exact相等。
3. `source_family`只在两个明确携带它的payload中编码；其他Consumer的derived family由operation/producer static map证明，不重复增加一个隐式字段。
4. `dedup_key`只属于 idempotency logical scope，不进入digest；`occurred_at`、trace、bus offset、message id、delivery attempt与ack state全部排除。
5. unsupported schema在payload parse前拒绝，不创建partial payload digest、reservation或stored receipt。已验证schema version进入accepted material，避免相同typed-looking payload跨schema被静默视为same input。
6. raw event bytes、unknown fields、provider response、credential和unsafe body没有canonical writer；quarantine/reject路径不能通过hash raw bytes来补一个digest。

同一 `source_event_ref` 或 dedup key下，producer/source/schema/source-version/payload任一字段变化都会产生different digest，并在原logical scope下形成 conflict / producer inconsistency，而不是创建alias reservation。equal source version + same digest可走duplicate/no-op；equal version + different digest必须fail closed。

### 7.13 9 个 Operations Job exact material

所有行共用 §7.9.1 Operations Job 前缀。public `ObservationJobName` 必须先静态映射到 A 批 `ObservationJobOperation`；Job metadata的 `job_execution_ref` / public `JobRunId` correlation、idempotency key、trace和requested time全部排除。表内字段会改变candidate set、work boundary或结果语义，因此进入input digest；start阶段解析出的实际work-set另由plan digest冻结。

| Job operation token | `input` exact member order | Option / collection semantics | materialization redline |
|---|---|---|---|
| `publish_observation_outbox` | `cursor`;`limit`;`event_filter` | cursor=`Opt`;filter=`Set<ObservationOutboundEventName>` | limit先bound；start再冻结exact outbox refs/snapshot digests |
| `rebuild_observation_read_models` | `target_ref`;`scopes`;`replay_scope_ref`;`diagnostic_visibility_scope_ref`;`source_cursor` | scopes=`Set`;two refs=`Opt` as declared | target/scope compatibility、non-empty与source minimum先验证 |
| `rebuild_signal_rollups` | `scope`;`signal_cursor`;`window_refs` | cursor=`Opt`;windows=`Set` | empty windows表示scope expansion，resolved set只进入plan而不回写request digest |
| `refresh_reference_snapshots` | `scope`;`freshness_policy_ref`;`snapshot_refs` | snapshots=`Set<ReferenceSnapshotStateRef>` | frozen `ReferenceSnapshotRef`无encoder；empty set的scope expansion在plan冻结 |
| `scan_observation_gaps` | `scan_scope_ref`;`expected_source_refs`;`visibility_scope_ref` | expected refs=`Set`，empty语义保留 | 不从current gap/source body生成request material |
| `coordinate_observation_replay` | `replay_scope_ref`;`target_ref`;`no_write_guard_ref` | required | loaded Approved scope/target snapshots进入plan，不替换request字段 |
| `prepare_report_handoff_delivery` | `handoff_scope_ref`;`handoff_ref`;`consumer_ref` | required | exact evidence input、binding和intent identity在plan/item阶段冻结 |
| `prepare_external_audit_export_delivery` | `export_scope_ref`;`consumer_ref`;`preparation_ref` | required | public Job `PrepareExternalAuditExport`只映射到本token；不得碰撞Command token |
| `rebuild_peripheral_views` | `consumer_targets`;`source_cursor` | targets=`Set<PeripheralViewRebuildTarget>`；cursor=`Opt` | frozen `consumer_scopes: Vec<PeripheralConsumerScopeRef>` 是 affected use，不能进入current encoder |

`PeripheralViewRebuildTarget` 是 W2 digest-private projection，不新建 public wrapper或durable identity。其 `value` shape固定为 `{"consumer_ref":<PeripheralConsumerRef>,"projection_scope":<ObservationProjectionScope>}`；完整 structured consumer fields与scope都进入request digest，set按完整member bytes排序。后续 Step 08逐协议重组必须提供等价的具名 public item并在entry处构造该projection；在此之前，冻结 `PeripheralConsumerScopeRef` 不能落码。work key随后只取validated `PeripheralConsumerRefId + projection_scope`，完整consumer snapshot继续进入planned material。

#### 7.13.1 Job request material 与 immutable plan 的分界

| 层次 | 固定内容 | 不固定 / 排除 |
|---|---|---|
| Job request digest | exact operation、actor和上表typed input | execution/job-run identity、clock、claim/fence、current candidates |
| start materialization | validated request digest、current compatible candidate snapshots、config snapshot、source/cursor/version guards | later relist、current config substitution、worker ordering |
| plan digest | operation、request digest、config snapshot、canonical item material | plan/execution/idempotency/report refs、claim/fence、item current state/outcome |
| item digest | one work key + exact planned material + source/observed version | item row version、claim/fence、attempt、completion time |

因此，empty selector在协议上允许scope expansion时，request digest仍编码empty set，不能事后改写成resolved candidates；resolved candidate set必须进入plan/item digest。相同Job key + same request digest会命中同一reservation；若已有nonterminal plan则按fenced resume读取原plan，绝不重新list。相同key但cursor/limit/filter/scope/target变化必须Conflict。

### 7.14 Durable material 的公共非递归规则

W2 将 B/C/D/E 批中携带 digest 的 durable 对象反查到唯一 material writer。下列规则先于各对象表：

1. `payload_digest`、`planned_input_digest`、`outcome_digest`、`report_digest`、`material_digest` 绝不进入其自身 material；验证路径必须先从其他字段重算 expected，再比较 stored/supplied value。
2. nested `RequestDigest` / `DigestSummary` 只有在它表示已经独立冻结的上游 material 时才进入；这种 nested digest 按 §7.9.2 的 `profile,value` 完整编码，不展开其原始 bytes。
3. named object 的 canonical projection 只选择本节明确列出的 semantic fields。对象卡中存在字段不代表自动进入 digest；row/version/CAS proof、generated identity、clock、trace、claim/fence、attempt 和 current runtime locator 仍按表排除。
4. canonical set 按完整 member bytes 排序；plan items、report fold entries 和 scope rows也使用此排序规则，而不是 repository 返回顺序。发现 duplicate identity 时拒绝，不采用 last-write-wins。
5. v1 不增加隐式 `schema`、`material_version` 或 field count。字段集合、顺序、tag/presence rule发生变化时提升 `DigestProfileVersion`。

| durable object / digest field | material kind | exact `value` shape | digest consumer / independent checks |
|---|---|---|---|
| `StoredObservationReplaySurface.digest_summary` | `stored_result_surface` | `{"serialized_surface":<bounded-bytes-hex>}` | create/rehydrate/replay integrity；`result_kind`、protocol `schema_version`、operation/disposition作为独立 compatibility checks，不扩大 bytes digest |
| `ObservationOutboxPayloadSnapshot.payload_digest` | `outbox_payload_snapshot` | `{"serialized_payload":<bounded-bytes-hex>}` | snapshot create/rehydrate、publication token/receipt/failure；event/name/subject/schema/binding/cursor作为独立 equality checks |
| `ObservationJobPlanItem.planned_input_digest` | `job_plan_item` | §7.16 exact work key + planned semantic material + observed version | item factory/rehydrate、plan digest、resume；不含自身、plan/ref/CAS/claim/fence |
| `ObservationJobExecutionPlan.plan_digest` | `job_execution_plan` | §7.17 operation + request digest + config snapshot + canonical item entries | start/rehydrate/resume/report；不含 plan/execution/idempotency/job-run/report identity |
| `ObservationJobPlanItemOutcome.outcome_digest` | `job_item_outcome` | §7.18 state + four sets + typed association | item CAS/rehydrate/report fold；不含自身、row version、cursor、claim/fence |
| `ObservationJobReportDraft.report_digest` | `job_report` | §7.19 terminal state + plan digest + complete semantic fold + scope rows + report failure | terminal seal/rehydrate/stored result；不含 report/execution/claim proof或自身 |
| four phase token `material_digest` | `external_effect_token` | §7.20 phase-specific stable binding/material relation | token create/rehydrate/adapter/probe/result matching；不含 intent identity或自身 |
| tagged `ExternalEffectIntent` derived semantic digest | `external_effect_intent` | §7.21 variant + complete token projection including validated token material digest，排除intent identity | append-only repository semantic uniqueness / equality fast path；不是对象字段或 token `material_digest` 的替代 owner |

`StoredObservationResult` 和 `ObservationOutboxRecord` 不再拥有第二份 digest material。它们保存 identity、state和relation，并分别调用 replay surface / payload snapshot 的 integrity verifier。这样既保持 B 批“digest over exact canonical bytes”的 current 契约，也防止把 kind/schema/binding等 independent validation fields静默并入已有 digest语义。

### 7.15 Exact canonical bytes material

#### 7.15.1 Stored result surface

```text
kind = stored_result_surface
value = {"serialized_surface":<BodyFreeSerializedResult bytes as lowercase hex>}
```

`serialized_surface` 取 `BodyFreeSerializedResult::as_bytes()` 的 exact immutable sequence，每个 byte 输出两个 lowercase hexadecimal字符。bytes 必须先由 retained typed protocol encoder/decoder证明 canonical、body-free且长度在 `1..=65536`；canonicalizer不解析raw response、不重新序列化，也不从current protocol surface重建。

`result_kind` 和 `schema_version` 决定使用哪个 retained decoder并校验 bytes compatibility，但不进入本摘要。`StoredObservationResult` 的 result/idempotency/public refs、operation、actor、request digest、disposition和`stored_at`也不进入。上述字段任一 mismatch仍使 replay fail closed，只是不能借机改变 `digest_summary` 的既有“exact bytes”语义。

#### 7.15.2 Outbox payload snapshot

```text
kind = outbox_payload_snapshot
value = {"serialized_payload":<BodyFreeSerializedEvent bytes as lowercase hex>}
```

`serialized_payload` 取 exact `BodyFreeSerializedEvent::as_bytes()`，长度必须在 `1..=262144`。`payload_snapshot_ref`、binding/event/name/subject/schema/cursor/trace/`stored_at`和对应 outbox marker字段全部排除；publisher在调用前必须独立逐项验证这些字段与 record/token 相等。摘要只能证明 exact stored bytes未漂移，不能证明 route、binding availability、external publication或consumer acceptance。

### 7.16 Job plan item exact material

`job_plan_item` 的 `value` 固定为：

```text
{"work_key":<ObservationJobWorkKey>,"planned_material":<tagged-planned-material>,"observed_version":<Opt<ObservationSourceVersionRef>>}
```

`work_key` 采用 §7.9.2 typed enum/object grammar，不能直接嵌入 D-2 `canonical_bytes()` 的 binary blob；两者必须表达相同 variant和payload relation。`planned_material` 固定使用 `{"tag":"<variant-token>","value":{...}}`，九个 variant 的 payload如下：

| tag | exact payload member order | exact semantic projection / exclusions |
|---|---|---|
| `outbox` | `candidate`;`snapshot` | snapshot依次编码 `payload_snapshot_ref`,`effect_binding_ref`,`event_ref`,`event_name`,`subject_ref`,`schema_version`,`serialized_payload`,`payload_digest`,`committed_cursor`；排除 `trace_ref`,`stored_at`,`captured_repository_version`；`payload_digest`是上游 exact-bytes摘要，不递归展开bytes |
| `projection_scope` | `candidate`;`target_binding`;`observation_cursor`;`reference_cursor` | three optional fields显式`Opt`；target binding递归编码 `binding(target_ref,scopes)`,`dependencies`,`dependency_availability`；排除captured repository version |
| `signal_rollup` | `candidate`;`scope`;`window_kind`;`observation_cursor` | cursor显式`Opt`；scope编码 `projection_scope`,`signal_kind`；排除captured repository version |
| `reference_snapshot` | `candidate`;`state_snapshot`;`source_version`;`reference_cursor` | source/cursor均`Opt`；state snapshot依次编码 `snapshot_ref`,`subject_ref`,`state`,`safe_summary_ref`,`source_version`,`stale_reason`,`resolution_reason`,`invalid_reason`，排除`observed_at`；排除captured repository version |
| `gap_source` | `candidate`;`source_snapshot`;`scan_target_snapshot`;`observation_cursor`;`reference_cursor` | source snapshot依次编码 `gap_source_ref_id`,`source_kind`,`source_ref`,`visibility_constraint_ref`,`state`；target snapshot依次编码 `target_ref`,`projection_scopes`,`dependency_namespaces`,`authorization_mode`,`observation_cursor`,`reference_cursor`,`maintenance_policy_basis`；外层双cursor均`Opt`；排除captured repository version |
| `replay_target` | `candidate`;`target_snapshot`;`approval_snapshot`;`observation_cursor` | target snapshot依次编码 complete maintenance target binding/dependencies/availability；approval依次编码 `policy_basis`,`scope_snapshot`,`target_boundary_snapshots`,`outcome`；cursor显式`Opt`；排除captured repository version |
| `report_handoff` | `candidate`;`evidence_input`;`consumer_ref`;`observation_cursor`;`binding_material` | evidence input依次编码 `input_ref`,`consumer_scope`,`linkage_refs`,`audit_projection_refs`,`gap_refs`,`visibility`,`freshness`,`as_of_cursor`，排除`assembled_at`；cursor/binding均`Opt`；排除captured repository version |
| `external_export` | `candidate`;`view_snapshot`;`consumer_ref`;`binding_material`;`observation_cursor` | view依次编码 `view_ref`,`freshness_marker_ref`,`consumer_ref`,`scope`,`read_model_ref`,`diagnostic_view_ref`,`gap_ref`,`visibility`,`freshness`；binding/cursor均`Opt`；排除captured repository version |
| `peripheral_view` | `consumer_ref`;`projection_scope`;`consumer_snapshot`;`view_snapshot`;`observation_cursor` | consumer snapshot编码完整 structured `PeripheralConsumerRef`；view shape同上一行；cursor显式`Opt`；排除captured repository version |

本表中的完整 consumer 必须编码 id、kind、scope、export flag和state；完整 maintenance target必须编码 id、kind、object、allowed effect和no-write scope。`PolicyEvaluationBasis` 依次编码 `family`,`basis_ref`,`revision`,`basis_digest`；其 nested digest是独立 policy rule摘要。所有 owner-defined set使用canonical set规则。`ObservedAt`、trace和repository version被排除，不表示对象可丢弃这些持久化字段；它们仍由各自 owner作时序/CAS审计，只是不定义semantic planned input identity。

`planned_input_digest` 不进入上述 `value`。Item factory先从 exact material计算该字段，再保存；rehydrate从保存的 semantic fields重算比较。`observed_version` 是 item顶层 source stream marker，始终显式编码`Opt`；即使某个 nested snapshot也保存 source version，两处都按各自主语保留，不能相互省略。

### 7.17 Job execution plan exact material

```text
kind = job_execution_plan
value = {
  "operation":<ObservationJobOperation token>,
  "request_digest":<RequestDigest>,
  "config_snapshot":<JobExecutionConfigSnapshot>,
  "items":[<canonical-plan-item-entry>...]
}
```

`config_snapshot` member order为 `config_ref`,`operation_name`,`bindings`。`bindings` 按完整canonical bytes排序且拒绝duplicate；每项使用 tagged enum：

| binding tag | exact value member order |
|---|---|
| `candidate_limit` / `max_parallelism` | one unsigned `PositiveLimit` |
| `claim_lease` | `lease_duration_millis`;`heartbeat_interval_millis` |
| `resolver_retry` / `publication_retry` / `handoff_retry` / `export_retry` | `max_additional_attempts`;`backoff`，其中backoff依次为`initial_delay_millis`,`maximum_delay_millis`,`multiplier_milli`,`jitter_ratio_milli` |
| `external_effect` | `effect_binding_ref`;`family`;`call_timeout_millis`;`capabilities`；capability set按phase完整bytes排序，每项依次为`phase`,`stable_token`,`probe` |

每个 binding 使用 `{"tag":"<binding-token>","value":...}`；scalar binding 的 `value` 是canonical unsigned integer，object binding 的 `value` 是按表中顺序的object。Duration/limit均编码validated inner integer，不编码单位字符串、Rust `Duration` debug或raw config text。

每个 canonical plan item entry固定为 `{"work_key":...,"planned_input_digest":...,"observed_version":...}`。items按`work_key`完整canonical bytes排序且拒绝duplicate；plan不重复展开九类 planned material，因为 `planned_input_digest` 已唯一承诺其 exact semantic projection。该层排除 `plan_ref`,`execution_ref`,`idempotency_ref`,`job_run_id`,`plan_digest`自身、item state/outcome、所有captured repository versions、report/claim/fence/lease runtime state、worker/clock/attempt。

`config_snapshot.operation_name` 必须与顶层 `operation` exact相等，但两处都保留：顶层字段定义plan family，snapshot字段防止一个配置快照被跨operation复用。相同输入顺序变化产生相同digest；任何 item digest、source version、binding value/capability或operation变化产生different digest。

### 7.18 Job item outcome exact material

```text
kind = job_item_outcome
value = {
  "state":<terminal ObservationJobPlanItemState token>,
  "affected_refs":<BodyFreeRefSet>,
  "failed_refs":<BodyFreeRefSet>,
  "gap_refs":<GapStateRefSet>,
  "progress_refs":<BodyFreeRefSet>,
  "association":<Opt<tagged association>>
}
```

association tag total set固定为 11 个：`maintenance_failure`,`maintenance_block`,`publication_failure`,`publication_dead_letter`,`export_failure`,`export_block`,`replay_block`,`reference_resolution`,`diagnostic_unavailable`,`staleness`,`gap_scan_accepted`。除两个 structured tag 外，九个 scalar tag 的 value 使用对应 owner enum token。`publication_dead_letter` value 是严格有序 object：`reason`,`dead_letter_ref`,`retained_failure`；前两项使用 owner encoder，最后一项使用 §6 的 tagged `Option<PublicationFailureKind>` grammar，禁止 null/omission/default。`gap_scan_accepted` value依次编码 `target_ref`,`target_snapshot`,`discovered_gap_refs`,`outcome`,`completed_at`，其中 target snapshot字段顺序与§7.16一致，outcome为owner-defined tagged enum，`completed_at`使用canonical `ObservedAt`。该时间由 H12 association own，因此是semantic result的一部分，不受global execution-time exclusion影响。

只有 terminal item state可以生成本 material；state/association/refs matrix先由 D-3 validator验证。`outcome_digest`、item/plan identity、repository version、claim/fence和外层完成时间不进入。四个set均按member完整bytes排序；`BodyFreeRefSet` member按generic `BodyFreeRef` typed-ref shape编码，不能用无type framing的裸字符串，也不能伪造已被该generic set有意擦除的原始wrapper owner。

### 7.19 Job report exact material

report digest表达“一个plan-bound report当前可重放的完整semantic classification”，而不是 report row identity或执行authority：

```text
kind = job_report
value = {
  "plan_ref":<ObservationJobExecutionPlanRef>,
  "plan_digest":<RequestDigest>,
  "state":<JobReportState token>,
  "item_fold":[<semantic-fold-entry>...],
  "scope_items":[<scope-item>...],
  "report_failure":<Opt<JobReportFailureAssociation>>
}
```

| nested value | exact member order / rule |
|---|---|
| semantic fold entry | `work_key`;`classification`。classification固定为 tagged `pending` value=`{"state":...}` 或 `terminal` value=`{"state":...,"outcome_digest":...}`；entries按work key完整bytes排序且覆盖plan全部keys |
| scope item | `work_key`;`scope`;`outcome`。outcome tagged `succeeded` value依次为`read_model_ref`,`diagnostic_view_ref`，或`failed` value依次为`reason`,`gap_refs`；reason再以`maintenance`,`blocked`,`diagnostic`,`stale`四个private association tag包裹对应owner enum token；rows按 `(work_key bytes, scope bytes)` 排序且拒绝duplicate |
| report failure | tagged `maintenance`,`blocked`,`replay_blocked`,`persistence`；前三个引用owner enum token，persistence只接受七个finite token，不允许raw `ApplicationError` |

semantic fold明确排除 `JobReportItemSnapshotProof` 的plan/item row version、claim ref/subject/owner/fence/claim row version。它们仍是 report mutation authority和持久化审计字段，但不是 report内容身份；fresh equivalent proof不能无意义地改变report digest。terminal entry使用已经验证的 `outcome_digest`，不重复展开outcome；scope row保留其独立逐scope可重放内容，并必须先与terminal outcome逐字段校验。

`report_ref`,`execution_ref`,`job_run_id`,`idempotency_ref`,`request_digest`,`accepted_claim`,`report_digest`自身和任何derived summary/counters均排除。`plan_ref`防止相同content digest的另一plan lineage替换当前report，`plan_digest`承诺operation、request、config和work-set；`state`、完整fold、scope rows和report-level failure再冻结classification。W2固定report digest允许`Draft`阶段随fold演进后重算，但只有terminal report可进入`StoredObservationResultKind::JobReport`；每次持久化仍需report CAS与current claim/fence，digest本身不授权写入。

### 7.20 External effect token exact material

`external_effect_token` 对四个持久化 intent phase生成 `material_digest`。`ObservationPublicationToken` 没有自有 `material_digest`；它只复制并验证 outbox `payload_digest`，因此不再对同一 publication建立第二个摘要。

所有 phase的 `value` 都以 `phase`开头，并排除 generated `intent_ref` 与 `material_digest`自身：

| phase token | exact `value` member order | exact relation |
|---|---|---|
| `handoff_preparation` | `phase`;`effect_binding_ref`;`handoff_ref`;`evidence_index_input_ref`;`consumer_ref`;`input_identity` | `input_identity`是 committed `EvidenceIndexInputView` 的§7.16 evidence projection：input/consumer scope/三个sets/visibility/freshness/cursor，排除assembled time |
| `handoff_delivery` | `phase`;`effect_binding_ref`;`handoff_ref`;`preparation_ref`;`consumer_ref`;`preparation_identity` | `preparation_identity`依次编码prior source token的 `effect_binding_ref`,`handoff_ref`,`evidence_index_input_ref`,`consumer_ref`,`material_digest` 和当前 `preparation_ref`；排除prior/current intent refs |
| `export_preparation` | `phase`;`effect_binding_ref`;`preparation_ref`;`view_ref`;`consumer_ref`;`view_identity` | `view_identity`使用§7.16 Dashboard view完整semantic projection；不含产品locator/body/credential |
| `export_delivery` | `phase`;`effect_binding_ref`;`preparation_ref`;`delivery_ref`;`consumer_ref`;`package_identity` | `package_identity`依次为prior source token的 `effect_binding_ref`,`preparation_ref`,`view_ref`,`consumer_ref`,`material_digest`，再加`package_ref`,`package_digest`；排除prior/current intent refs |

外层字段与nested identity中重复出现的binding/owner字段必须exact相等；重复是cross-object substitution guard，不允许encoder择一省略。`HandoffDeliveryToken.material_digest`和`ExportDeliveryToken.material_digest`必须由本表重算，不能简单复制 preparation/package digest；后者只是nested committed material identity。C批早期“ExportDelivery material_digest copies package_digest”的短形状登记为 affected definition，由W3 affected-use register修正，不恢复为current规则。

### 7.21 External effect intent exact material

append-only intent使用独立 `external_effect_intent` kind生成derived semantic-effect digest，供repository semantic unique和rehydrate equality检查：

```text
{"variant":<phase-token>,"token":<intent-token-projection>}
```

`token` member order为 `effect_binding_ref`，随后按§7.20对应phase的 handoff/preparation/view/delivery/consumer fields，最后 `material_digest`。`intent_ref`和derived intent digest自身均排除；其中也不再嵌入 `input_identity` / `preparation_identity` / `view_identity` / `package_identity`，因为这些已由token material digest承诺并在append前与loaded immutable material核对。Intent digest因此不是token digest的递归输入，也不能替代token material校验。

| invariant | exact rule |
|---|---|
| identity boundary | `intent_ref`只由append-only row PK与embedded token equality校验，不进入semantic digest；digest不能替代PK或证明row存在 |
| semantic duplicate | `has_same_semantic_effect`比较同variant的token fields（含material digest）但排除intent ref；derived digest只作索引/fast path，命中后仍逐字段比较；same semantic/new intent必须拒绝或定位原row |
| variant totality | 只允许handoff/export prepare/deliver四个variant；Publication继续由outbox pair落地，无`ExternalEffectIntent` |
| no authorization promotion | intent/token digest不证明claim/fence、policy eligibility、binding runtime availability、external acceptance或signoff |

`ExternalEffectIntent` current object不新增 `intent_digest` 字段。Logical storage若为semantic unique index保存该derived value，它只能作为可重建secondary carrier，并必须在rehydrate时从tagged token重算；缺失/碰撞/不一致fail closed，不能成为第二个intent truth owner。

### 7.22 W2 affected-use 与 totality audit

| affected material | W2 current correction | W3 / later action |
|---|---|---|
| frozen Step 08/13 `ReferenceSnapshotRef` | current encoder只接受`ReferenceSnapshotStateRef` | W3登记所有具体use-site；Step08/13解冻时替换 |
| frozen `PeripheralConsumerScopeRef` | 无owner且无encoder；使用structured `PeripheralConsumerRef + ObservationProjectionScope` | W3登记协议和work-key use-site |
| public Job `PrepareExternalAuditExport` | 静态映射application operation `prepare_external_audit_export_delivery` | W3登记operation map affected use，防止与Command token碰撞 |
| C批 `ExportDeliveryToken.material_digest = package_digest`短形状 | current token digest是phase-specific material，package digest只作为nested package identity | W3回灌C批 affected-definition与Step09/13 use-site |
| Step13 plan item `observed_version = ObservationRepositoryVersion` | current source marker为`Option<ObservationSourceVersionRef>`；captured repository version不进digest | W3登记Step13/11 persistence affected use |
| report fold snapshot proof | proof保留持久化与authority，但从report digest material排除 | W3登记report repository/rehydrate tests，防止proof换代导致semantic digest漂移 |

W2 totality计数为：16 Command + 14 Query + 9 Consumer + 9 Job = 48 request material；8个durable family表全部有exact owner和non-recursive规则；四类external intent phase和无intent的Publication边界均已逐项说明。W2 checkpoint当时未关闭error、migration、golden vector/property test和全量affected-use；这些缺口现已由W3 §§7.24~7.33消费并关闭design-only。

### 7.23 W2 module stop review

| 审查项 | 当前结论 | 未完成事项 |
|---|---|---|
| 48个入口是否逐项有exact字段顺序 | `pass_W2_consumed_by_W3` | §7.29已登记48个planned production fixture |
| Query是否保持zero-write | `pass_W2_consumed_by_W3` | §7.29.2及`PROP-15`固定14条zero-write assertion |
| stored result/outbox是否保持exact bytes digest语义 | `pass_W2_consumed_by_W3` | persisted same-profile errors与`DUR-01/02`已闭合 |
| plan/item/outcome/report是否non-recursive且区分semantic/CAS material | `pass_W2_consumed_by_W3` | §7.30/§7.31已有inner-to-outer、proof exclusion与migration tests |
| external token/intent是否区分semantic token与row identity | `pass_W2_consumed_by_W3` | C批short shape已修正，P01~P04 totality已登记 |
| owner是否重复 | `pass_W2` | value owner仍为contracts，material owner仍为application::digest |
| F1是否完成 | `yes_after_W3_design_only` | §§7.24~7.33静态closure通过；tests仍planned/not_run |
| 是否可进入F2/R06.7/Step07 | `no_waiting_user_before_F2` | F1已停审；用户确认前不得进入F2，R06.7/Step07仍更后置 |

### 7.24 W3 输入核准与错误边界

W3 已重新读取 E 批 `ApplicationError` 唯一 owner、冻结 Step 11~16 的 digest use-site、Step 14 runtime assembly error，以及 L1-governance / L1-artifact / L1-identity / L0-bus 的 digest/profile 测试材料。参考项目只提供 canonical digest、profile 和测试分层方向，没有可直接复制的完整 byte grammar、迁移对象或 golden corpus；因此本节只复用其“contract/unit 先行、duplicate 不重算、旧 material 不覆盖”的粒度，不复制相邻域类型或摘要值。

W3 将 digest failure 分成三层，禁止跨层折叠：

| failure layer | canonical owner / variant | detection boundary | recovery authority |
|---|---|---|---|
| malformed public carrier | `contracts::errors::ProtocolError::{InvalidDigestProfile,InvalidDigestValue}` | contracts parse / public DTO validation | input correction；application canonicalizer尚未运行 |
| runtime support assembly | private `application::digest::DigestProfileSupportError`，由 infra 映射 `RuntimeAssemblyError::InvalidConfiguration` | runtime builder expose façade 前 | 修正配置或部署；不是 application operation failure |
| accepted typed material / persisted material | E 批唯一 `application::errors::ApplicationError` 的五个 digest-specific variant | canonical encode、supplied compare、rehydrate / replay / resume integrity check | §7.25 exact mapping；不得解析 message text |

`SerializationFailed` 继续只表示协议 surface / event bytes 的确定性序列化失败；它不能代替 digest profile、supplied mismatch 或 persisted mismatch。`PersistenceInvariantViolation` 继续承接不属于 digest 本身的 row relation / missing sidecar / owner mismatch；只要失败可精确归因于 profile readability 或 digest recomputation，就必须使用 digest-specific variant。

### 7.25 Digest failure contract

#### 7.25.1 `ApplicationError` affected extension

唯一 enum 声明仍在 `application::errors`，并由 `03_ddd_step_06_application_report_error_service.md` §12 实际维护。W3 固定以下五个新增 current variant；本文件只定义其 producer 和使用语义，不创建第二个 enum：

| variant | exact producer condition | recovery class | zero-side-effect requirement |
|---|---|---|---|
| `SuppliedDigestProfileUnsupported` | structurally valid supplied digest 的 profile 不等于当前 admission write profile，或当前 runtime不支持该profile作为supplied input | `DoNotRetrySameInput` | reserve / UoW / resolver / domain / outbox / claim均未调用 |
| `SuppliedDigestMismatch` | supplied profile正确，但与本地从同一 validated typed material计算的 write digest值不同 | `DoNotRetrySameInput` | 不采用caller value，不创建 conflict row或quarantine body hash |
| `DigestMaterialEncodingFailed` | registry-owned writer无法编码一个已声称validated的typed material、违反bound或遇到unregistered kind/shape | `ManualIntervention` | fail closed；不是dependency unavailable，也不尝试raw serde fallback |
| `PersistedDigestProfileUnreadable` | retained row携带well-formed profile，但当前 runtime没有该profile reader | `ManualIntervention` | 不用write profile重算、不从current truth/material补造、不改变row |
| `PersistedDigestMismatch` | 按row自身profile从其exact persisted semantic fields / bytes重算后与stored digest不等 | `ManualIntervention` | 不覆盖stored value、不继续replay/publish/resume/finalize |

`SuppliedDigestProfileUnsupported` 与 contracts 的 `InvalidDigestProfile` 不重复：后者表示 wire 数字本身不属于 contracts 已知 finite profile；前者表示该 profile 在 contracts 层合法，但不符合当前 admission/runtime support。`PersistedDigestProfileUnreadable` 也不等于前者，因为 persisted row 已经进入保留责任，不能要求外部 caller“换一个 digest”修复。

#### 7.25.2 Safe detail carrier

```rust
/// Finite stage where one digest failure was detected.
pub(crate) enum DigestFailureStage {
    /// A caller-supplied digest was checked before application mutation.
    SuppliedInput,
    /// Registry-owned canonical material could not be encoded.
    LocalMaterialEncoding,
    /// One durable object was reconstructed from persisted fields.
    PersistedRehydrate,
    /// A completed immutable result was checked for duplicate replay.
    ReplayVerification,
    /// An outbox payload and publication token were checked before publish.
    PublicationVerification,
    /// An immutable plan or item was checked before job resume.
    JobResumeVerification,
    /// A report fold was checked before seal or replay.
    ReportVerification,
    /// An external-effect token, intent, or result was checked before probe/call/finalize.
    ExternalEffectVerification,
}

/// Body-free diagnostic context kept outside `ApplicationError`.
pub(crate) struct DigestFailureContext {
    material_kind: DigestMaterialKind,
    stage: DigestFailureStage,
    profile_version: Option<DigestProfileVersion>,
}
```

| member | exact contract |
|---|---|
| `for_supplied(kind, profile)` | stage=`SuppliedInput`；profile来自已解析carrier；不保存digest value |
| `for_encoding(kind, profile)` | stage=`LocalMaterialEncoding`；profile来自selected encoder |
| `for_persisted(kind, stage, profile)` | 只接受六个persisted/replay/resume stage；profile来自durable row |
| `material_kind()` / `stage()` / `profile_version()` | borrowed/Copy-safe finite读取；不提供free-text detail |
| `as_safe_telemetry_fields()` | 只允许material kind token、stage token、有限profile number；Step 15决定实际emission，不在canonicalizer内发log/metric/span |

`DigestFailureContext` 是 process-local secondary carrier，不进入 `ApplicationError` payload、public error code、durable audit truth、report failure、result surface或evidence。以下值一律禁止进入 safe detail：expected/actual digest、canonical bytes、raw typed value、idempotency key、actor/ref完整值、payload/body、endpoint、credential、provider error、file path、stack或source chain。低基数 metric 只允许 `material_kind`、`stage` 和 application error variant；profile number只允许log/trace allowlist，不作为未设上限的metric label。

#### 7.25.3 Verification order and mapping

| boundary | exact order | failure |
|---|---|---|
| optional/required supplied request digest | contracts parse -> typed DTO validation -> compute current write digest -> compare profile -> constant-time/equivalent value compare | malformed=`ProtocolError`;runtime profile mismatch=`SuppliedDigestProfileUnsupported`;value mismatch=`SuppliedDigestMismatch` |
| idempotency existing row | atomic repository reads row profile -> selects same-profile candidate -> compares candidate with row digest -> classifies Replay/InFlight/Conflict | no candidate=`PersistedDigestProfileUnreadable`;candidate differs=`Conflict` only when incoming logical material genuinely differs；row corruption仍由rehydrate mapping处理 |
| stored result / outbox bytes | load exact bytes + digest -> ensure profile readable -> encode frame under stored profile -> compare -> run independent kind/schema/owner relation checks | unreadable/mismatch use persisted variants；kind/schema/ref mismatch keeps owning consistency variant |
| plan/item/outcome/report | rehydrate exact stored fields -> recompute each digest from non-recursive material under its own profile, inner before outer -> validate row/CAS/claim relation independently | first unreadable/mismatch stops；never recompute outer using current config/truth |
| external token/intent/result | load immutable source/token -> verify source digest -> recompute phase-specific token digest -> recompute derived intent digest if index exists -> compare all owner fields | profile/mismatch exact variants；same hash never bypasses fieldwise equality |

Missing required supplied digest remains protocol `InvalidEnvelope` / `InvalidRequest` according to the owning Step 08 wrapper；W3 does not turn absence into a digest mismatch. An optional supplied digest may be absent, in which case the locally computed current write digest is authoritative for new admission.

### 7.26 Profile support and migration contract

#### 7.26.1 Support construction and request candidates

W3 supersedes the W1 placeholder return types for profile support construction. Invalid startup support is not an application operation error:

```rust
/// Invalid process support for versioned digest encoding and reading.
pub(crate) enum DigestProfileSupportError {
    /// The configured write profile has no compiled encoder.
    UnsupportedWriteProfile,
    /// At least one configured readable profile has no compiled decoder/encoder pair.
    UnsupportedReadableProfile,
    /// The write profile is absent from the readable set.
    WriteProfileNotReadable,
}

/// All same-material request digests needed for atomic profile-aware admission.
pub struct RequestDigestCandidates {
    write_profile: DigestProfileVersion,
    digests: Vec<RequestDigest>,
}
```

`R07-VIS-DIGEST-CANDIDATES-01` visibility correction: `RequestDigestCandidates` is a public Rust type because the application-owned public `ObservationIdempotencyRepository` trait is implemented by the separate `infra` crate. Its fields, constructor and canonical generation path remain private to `application::digest`; `infra` can only name the opaque type and call the public read-only selectors below. This visibility does not make the carrier a public protocol DTO, serde surface, persisted row, telemetry field or caller-constructible value, and does not create a replacement carrier.

| factory / member | exact signature / result | invariant |
|---|---|---|
| profile support | `ObservationDigestProfileSupport::new(write_profile, readable_profiles) -> Result<Self, DigestProfileSupportError>` | finite compiled support；sort/dedup；write必须可读；无I/O |
| canonicalizer | `ObservationDigestCanonicalizer::new(profile_support) -> Self` | validated support only；constructor不再失败 |
| all request candidates | `request_candidates<M>(&self, material: &M) -> Result<RequestDigestCandidates, ApplicationError>` | 对每个readable profile恰算一次；`digests`按profile升序且profile唯一；`write_profile`必须在集合中恰好命中一项；不另存重复write digest；只供Command/Consumer/Job admission |
| write profile | `pub fn RequestDigestCandidates::write_profile(&self) -> DigestProfileVersion` | 返回构造时冻结的current write profile；不能由caller或candidate顺序推断 |
| write candidate | `pub fn RequestDigestCandidates::write_digest(&self) -> &RequestDigest` | 等价于按`write_profile`从`digests`选择唯一candidate；absent logical key只能保存此值，不存在第二个物理write槽位 |
| retained candidate | `pub fn RequestDigestCandidates::for_profile(&self, profile: DigestProfileVersion) -> Option<&RequestDigest>` | existing row只按row自身profile取值；没有fallback/current substitution；为独立infra crate实现atomic admission提供唯一candidate读取面 |
| supplied compare | `verify_supplied_for_write(&self, candidates, supplied) -> Result<(), ApplicationError>` | supplied present时必须等于write candidate；legacy candidate不能被caller选作new-write profile |
| request under profile | private `digest_request_for_profile<M>(profile, material)` | profile必须readable且有完整12-kind registry；不访问store |
| summary under profile | private `digest_summary_for_profile<M>(profile, material)` | rehydrate按stored profile；不自动选write profile |
| persisted request verify | `verify_persisted_request<M>(&self, material, stored) -> Result<(), ApplicationError>` | stored profile readable后同profile重算比较 |
| persisted summary verify | `verify_persisted_summary<M>(&self, material, stored) -> Result<(), ApplicationError>` | 同上；RequestDigest与DigestSummary仍不可转换 |

P0 compiled support仍只有v1，所以candidate set只有一项。未来v2只有在12个kind全部有reader/writer和golden corpus时才可进入readable set；“只支持新request、不支持旧report/token”的partial profile必须在startup失败。

#### 7.26.2 Atomic idempotency admission across a write-profile switch

直接把current write digest交给旧 `reserve_or_load(context)` 会让同一key、同一logical material的v1 row在切write=v2后误报Conflict。Current contract必须改为：repository在一个atomic decision中接收logical scope、optional inbound event identity和`RequestDigestCandidates`。

```text
validated typed input
  -> compute candidates for every readable profile
  -> verify optional/required supplied digest against current write candidate
  -> atomic reserve lookup by logical scope / event identity
       row absent: persist only write candidate
       row exists: select candidate matching row.profile
         equal: Replay or InFlight according to durable state
         different: Conflict
         candidate absent: persisted-profile-unreadable consistency stop
```

| branch | context/result digest authority | forbidden shortcut |
|---|---|---|
| `Acquired` | new reservation、operation context和later stored result均使用`candidates.write_digest()`从唯一`digests`集合选出的值 | caller选择legacy write；保存全部candidate；复制write candidate到第二个process-local槽位；第二次lookup后insert |
| `Replay` | original reservation/stored result digest保持authoritative；incoming write digest只证明current-profile material，same-material关系由row-profile candidate证明 | 要求old stored digest等于incoming current-profile digest；覆盖old digest |
| `InFlight` | original reserved row保持authoritative；same-material由row-profile candidate证明 | 创建v2 alias reservation或第二writer |
| `Conflict` | existing row不变；只有same-profile candidate value不同才是logical material conflict | 仅因profile不同就报Conflict |

Query没有durable reservation，因此只计算current write-profile request digest作为read context integrity marker，不构造`RequestDigestCandidates`、不调用repository，也不因为dual-read获得任何写入权。

#### 7.26.3 Rollout state machine

| rollout phase | write profile | readable profiles | admission / durable behavior | gate to next phase |
|---|---|---|---|---|
| `introduce-reader` | old | old + new | all new rows仍写old；所有节点能读/重算old+new；不产生new rows | 12-kind new-profile vectors、fake/durable/entry parity和全节点reader deployment gate均通过 |
| `switch-write` | new | old + new | absent logical key写new；existing old key按candidate replay/in-flight/conflict；old durable object按old验证 | mixed-version writer已停止；startup config和rollback policy确认 |
| `retirement-pending` | new | old + new | 不改写old digest；等待retention、copy-without-rehash或合法owner cleanup消除引用 | §7.26.4 zero-reference audit；相关backup/replay window不再要求old reader |
| `retired` | new | new | old profile从readable set移除；之后发现old row是consistency/manual defect | activation audit记录真实扫描结果；不得用设计文档或配置声明代替 |

普通热配置不能直接完成上述跨phase转换。尤其 incompatible profile migration没有“回滚后覆盖durable row”资格；若write switch需要撤回，只能在旧reader仍保留时改变**后续 absent key**的write selection，并重新进入迁移审计，已经写出的任一profile row保持原值。

#### 7.26.4 Retirement totality gate

retire old profile 前必须证明下列 durable carrier中该profile引用为零：reservation、stored result replay surface、outbox payload snapshot、job request/plan、plan item、item outcome、report、四类external token，以及可选external intent semantic-index carrier。扫描必须覆盖active、terminal但仍可replay、dead-letter/reconciliation、retained report和合法backup/replay窗口；不能只扫“当前pending”。

| retirement check | exact requirement |
|---|---|
| owner totality | 每个保存`RequestDigest`/`DigestSummary`的logical store都有profile filter/count或等价snapshot scan；由Step 07/11 affected review定义port/schema，不由canonicalizer访问repository |
| zero reference | 所有owner在同一个声明的store snapshot/cut下为zero，或有可审计的跨storebarrier；逐表不同时刻的best-effort zero不够 |
| no semantic rehash | migration可原样复制row和旧digest到新物理schema，但不得以new profile重算后覆盖、不得从current truth/config重建material |
| no business-retention promotion | observation `RetentionMarker` / `Released`不授权digest row物理删除或profile retire；technical retention必须单独满足owner责任 |
| activation | runtime builder在移除read profile前消费真实usage gate结果；失败保持旧readable set或拒绝启动，不以warning继续 |
| evidence honesty | 本设计只定义planned audit；当前没有真实scan、run id、evidence alias、验收签署或retirement pass声明 |

### 7.27 Language-neutral golden corpus contract

#### 7.27.1 Planned artifact layout and status

W3 只固定实现必须创建的 artifact contract，不在设计仓伪造实现文件。Step 04 / Step 16 affected review 后，目标实现仓的 planned layout 为：

| planned path | responsibility | current status |
|---|---|---|
| `crates/application/src/digest.rs` | 12-kind sealed registry、profile support、canonical writer、candidate和persisted verifier | `planned/not_created` |
| `crates/application/tests/fixtures/digest/v1/grammar.jsonl` | primitive / nested grammar与两个exact-byte frame seed | `planned/not_created` |
| `crates/application/tests/fixtures/digest/v1/request_material.jsonl` | 16 Command + 14 Query + 9 Consumer + 9 Job production fixture | `planned/not_created` |
| `crates/application/tests/fixtures/digest/v1/durable_material.jsonl` | 8 durable family、job/external variant totality fixture | `planned/not_created` |
| `crates/application/tests/digest_v1_vectors.rs` | real typed object -> exact bytes / SHA-256 conformance | `planned/not_created` |
| `crates/application/tests/digest_properties.rs` | presence、ordering、exclude/include、bound和domain-separation properties | `planned/not_created` |
| `crates/application/tests/digest_profile_migration.rs` | reader introduction、write switch、retirement和no-rehash state machine | `planned/not_created` |
| `scripts/checks/check_digest_vector_totality.*` | language-neutral corpus schema、ID uniqueness、12-kind/48-request/8-durable/4-phase coverage | `planned/not_created` |

路径是 W3 对 Step 04 的 affected definition，不表示目标仓、目录、脚本或测试已经存在。脚本扩展名和实现语言由后续实施计划确定，但输入/输出和失败条件不得弱化。

#### 7.27.2 JSONL record schema

三个 corpus 文件都使用 UTF-8 JSON Lines，一行一个完整 JSON object；空行、注释、重复 `case_id` 和未知顶层字段拒绝。Corpus line 本身不参与 digest；`normalized_material` 是完成 owner validation 后的语言中立 typed projection，不是 raw request/event/provider body。

```json
{
  "case_id": "REQ-C-01",
  "case_class": "production_golden",
  "profile": 1,
  "material_kind": "command_request",
  "subject": {"family": "command", "operation": "submit_observation_material"},
  "normalized_material": {},
  "expectation": {
    "tag": "digest",
    "canonical_utf8_hex": "",
    "canonical_byte_len": 0,
    "sha256_lower_hex": ""
  },
  "design_status": "planned"
}
```

| field | exact rule |
|---|---|
| `case_id` | unique ASCII ID from §§7.29~7.30；rename requires review because reports use it as stable test identity |
| `case_class` | finite `grammar_seed` / `production_golden` / `negative_contract` / `migration_scenario` |
| `profile` | unsigned supported profile；v1 corpus必须为`1`，不能由runner default |
| `material_kind` | exact §7.2 token；must match subject family and typed fixture builder |
| `subject` | finite owner discriminator + operation/phase/variant；不是hashed material的额外字段 |
| `normalized_material` | exact owner-validated semantic fields；typed refs、Option、set/list和nested digest保持tagged shape；禁止locator/body/debug/map fallback |
| `expectation.tag=digest` | 三个expected字段全部required；hex解码长度必须等于`canonical_byte_len`；SHA必须exact 64 lowercase hex |
| `expectation.tag=error` | required `error_layer` + exact finite `error_variant` + `zero_side_effect=true`；不得同时提供expected bytes/digest |
| `design_status` | 设计仓模板只能写`planned`；实现仓真实执行状态不得回写corpus冒充evidence |

Production runner 必须先把 `normalized_material` 构造成真实 owner type，再调用 sealed material writer；禁止直接hash `canonical_utf8_hex`、把expected bytes作为encoder输入，或以corpus JSON serializer代替production canonicalizer。至少有一个独立 conformance reader必须按本schema解析并核对expected bytes/hash；它不能调用被测 Rust encoder生成expected值。

#### 7.27.3 Document-time grammar seeds

下表固定 profile v1 grammar 的最小 exact bytes。SHA-256 是对表中 `canonical UTF-8 text` 的字节直接计算所得的**规范常量**，不是实现测试结果、run evidence或合法production fixture。`ref_1`、`safe`与字符串set member只用于grammar framing，不声称通过任何业务typed validator。

| seed ID | canonical UTF-8 text | bytes | SHA-256 lowercase hex | purpose |
|---|---|---:|---|---|
| `GRAM-OPT-ABSENT` | `{"tag":"absent"}` | 16 | `fffe81c0bdd93b3e366e531317454128c3f42461cd6602354a82f58040c2c161` | absent不是null/omission |
| `GRAM-OPT-PRESENT` | `{"tag":"present","value":"safe"}` | 32 | `b428a0426fc26a4f9afd3cb4b24a41d02c5efea514509584872d70e137f0620e` | present wrapper member order |
| `GRAM-TYPED-REF` | `{"type":"observation_receipt_ref","value":"ref_1"}` | 50 | `c81f01561e5134d34910d5dbf6d7fdbc1d507663bfd86d950276157111d5b258` | type discriminator precedes inner value |
| `GRAM-NESTED-DIGEST` | `{"profile":1,"value":"0000000000000000000000000000000000000000000000000000000000000000"}` | 88 | `ff26da7afdf49f8df96b6de6dab4a2fa5d0a2fdcf8259c37472b13e872cd047b` | nested digest includes profile |
| `GRAM-SET` | `["a","b"]` | 9 | `0473ef2dc0d324ab659d3580c1134e9d812035905c4781fdd6d529b0c6860e13` | canonical member-byte order |
| `GRAM-BYTES` | `"00ff"` | 6 | `9442dbaf8e48060aa532b565d0067ca106ea6418ce10a3852f638248a1de15b9` | two lowercase hex chars per byte |
| `GRAM-ESCAPE` | `"A\"B\\C\n/\u0001é"` | 20 | `2313e032f3b95c8df1085979b414441ee8662a8da5bc3cc2ce2fef0c142dee83` | quote/backslash/control、unescaped solidus、UTF-8 non-ASCII |
| `GRAM-STORED-FRAME` | `{"profile":1,"kind":"stored_result_surface","value":{"serialized_surface":"7b7d"}}` | 82 | `39a5ab7411a2c8000ae2427754cdca4df7569e831bfd52b13d6eaf9bde8bd535` | full frame over exact `{}` bytes |
| `GRAM-OUTBOX-FRAME` | `{"profile":1,"kind":"outbox_payload_snapshot","value":{"serialized_payload":"7b7d"}}` | 84 | `2beb59a60fa3d3599be831fb3be88825896f69cbdfb2475e2e2e1f15b4ce8515` | second kind proves domain separation |

`GRAM-ESCAPE` 的 exact byte hex 为 `22415c22425c5c435c6e2f5c7530303031c3a922`。Runner必须按hex核对，避免Markdown/host string literal二次解释。其他seed也必须在JSONL中保存expected byte hex；文档只展示可读文本，不能让复制/转义差异改变规范。

#### 7.27.4 Production golden acceptance rule

一条 production golden 只有同时满足以下条件才可进入实现仓baseline：真实typed builder构造成功；owner fieldwise equality通过；canonical bytes由独立review确认；expected SHA不是运行时自更新；同case在所有supported language runner中bytes/hash一致。任何 profile writer change导致golden drift时，必须新增profile与corpus，不得批量接受v1 snapshot update。

### 7.28 Twelve-kind coverage matrix

| # | material kind | required production fixtures | totality dimension | output | status |
|---:|---|---:|---|---|---|
| 1 | `command_request` | 16 | 每个Command operation恰一baseline，见§7.29.1 | `RequestDigest` | `planned/not_run` |
| 2 | `query_request` | 14 | 每个Query operation恰一baseline；所有case断言zero repository/UoW writes | `RequestDigest` | `planned/not_run` |
| 3 | `inbound_consumer_request` | 9 | 每个Consumer + required producer/static schema relation | `RequestDigest` | `planned/not_run` |
| 4 | `operations_job_request` | 9 | 每个Job operation；public/application operation static map | `RequestDigest` | `planned/not_run` |
| 5 | `stored_result_surface` | >=1 | exact retained bytes、empty/non-empty bounds与rehydrate mismatch | `DigestSummary` | `planned/not_run` |
| 6 | `outbox_payload_snapshot` | >=1 | exact retained bytes、event relation独立校验与publish mismatch | `DigestSummary` | `planned/not_run` |
| 7 | `job_execution_plan` | 9 operation baselines | request/config/item entry fold、canonical work-key order | `RequestDigest` | `planned/not_run` |
| 8 | `job_plan_item` | 9 planned-material variants | work key + material + explicit observed-version Option | `RequestDigest` | `planned/not_run` |
| 9 | `job_item_outcome` | every legal state/association pair | four sets + typed association；illegal pair negative | `DigestSummary` | `planned/not_run` |
| 10 | `job_report` | Draft + five terminal states | complete plan-bound fold、scope rows、report failure | `DigestSummary` | `planned/not_run` |
| 11 | `external_effect_intent` | 4 variants | semantic digest over token projection；identity excluded | `DigestSummary` | `planned/not_run` |
| 12 | `external_effect_token` | 4 phases | exact phase-specific nested immutable identity | `DigestSummary` | `planned/not_run` |

Coverage checker 必须证明kind set与§7.2 exact相等：缺少、重复、unknown或把Publication伪装为第五intent phase均失败。`>=1`只是family最低baseline；bound、negative和variant cases由§7.31追加，不允许用两个grammar seed代替真实typed durable fixtures。

### 7.29 Forty-eight request fixture ledger

每个下表fixture都必须包含：一个owner-valid baseline golden；一个included semantic field mutation使canonical bytes改变；一个excluded metadata mutation保持canonical bytes不变；所有适用Option/set/list边界。Digest不同只针对固定finite samples断言，不声称SHA-256数学无碰撞。Exact字段顺序仍唯一取自§§7.10~7.13，fixture不得重新定义schema。

#### 7.29.1 Command: 16 / 16

| fixture | operation token | required special coverage | status |
|---|---|---|---|
| `REQ-C-01` | `submit_observation_material` | two independent Option；forbidden source body absent | `planned/not_run` |
| `REQ-C-02` | `record_safety_disposition` | redaction/summary/quarantine presence legality | `planned/not_run` |
| `REQ-C-03` | `bind_correlation_context` | body trace included、metadata trace excluded | `planned/not_run` |
| `REQ-C-04` | `record_safe_signal` | optional runtime/rollup refs；no raw telemetry | `planned/not_run` |
| `REQ-C-05` | `append_audit_projection` | optional visibility named projection | `planned/not_run` |
| `REQ-C-06` | `link_body_free_evidence` | nested `DigestSummary` profile/value | `planned/not_run` |
| `REQ-C-07` | `prepare_report_handoff` | evidence input canonical sets + cursor Option | `planned/not_run` |
| `REQ-C-08` | `evaluate_authenticity_hint` | canonical gap set；origin finite token | `planned/not_run` |
| `REQ-C-09` | `set_retention_marker` | independent hold/release Option；invalid dual intent rejects before encode | `planned/not_run` |
| `REQ-C-10` | `protect_active_reference` | complete structured consumer identity | `planned/not_run` |
| `REQ-C-11` | `define_replay_scope` | target set permutation invariance / duplicate rejection | `planned/not_run` |
| `REQ-C-12` | `record_no_write_violation` | no attempted payload/body hash surrogate | `planned/not_run` |
| `REQ-C-13` | `record_gap_state` | explicit false vs true；reason absent/present | `planned/not_run` |
| `REQ-C-14` | `prepare_external_audit_export` | structured visibility；no product locator | `planned/not_run` |
| `REQ-C-15` | `register_reference_snapshot` | summary/source-version independent Option | `planned/not_run` |
| `REQ-C-16` | `update_reference_snapshot_state` | current `ReferenceSnapshotStateRef` only；historical ref negative | `planned/not_run` |

#### 7.29.2 Query: 14 / 14

| fixture | operation token | required special coverage | status |
|---|---|---|---|
| `REQ-Q-01` | `get_observation_receipt` | typed receipt discriminator | `planned/not_run` |
| `REQ-Q-02` | `get_intake_status` | page cursor Option + bounded limit | `planned/not_run` |
| `REQ-Q-03` | `get_safe_signal` | three selector Options + cardinality reject | `planned/not_run` |
| `REQ-Q-04` | `get_signal_rollup` | window/scope Options；page required | `planned/not_run` |
| `REQ-Q-05` | `get_audit_timeline` | subject + page exact order | `planned/not_run` |
| `REQ-Q-06` | `get_evidence_index_input` | handoff absent/present | `planned/not_run` |
| `REQ-Q-07` | `get_report_handoff` | handoff typed ref | `planned/not_run` |
| `REQ-Q-08` | `get_retention_protection` | protected ref discriminator | `planned/not_run` |
| `REQ-Q-09` | `get_observation_read_model` | structured scope + optional page | `planned/not_run` |
| `REQ-Q-10` | `get_diagnostic_view` | request context + scope；no diagnostic write | `planned/not_run` |
| `REQ-Q-11` | `get_gap_status` | three Options + selector legality | `planned/not_run` |
| `REQ-Q-12` | `get_peripheral_export_view` | full consumer + scope；no route | `planned/not_run` |
| `REQ-Q-13` | `get_reference_snapshot_view` | current snapshot/subject Options；historical ref reject | `planned/not_run` |
| `REQ-Q-14` | `get_rebuild_progress` | target typed ref；no synchronous rebuild | `planned/not_run` |

All 14 Query fixtures additionally assert: `request_candidates` is not called；idempotency repository、stored result、outbox、UoW、history、projection mutation和repair spy count均为zero。Query只调用`digest_request` under current write profile and stores the value in process-local application context.

#### 7.29.3 Inbound Consumer: 9 / 9

| fixture | operation token | required special coverage | status |
|---|---|---|---|
| `REQ-I-01` | `consume_bus_observation_material` | producer=`bus`；summary/redaction Options | `planned/not_run` |
| `REQ-I-02` | `consume_source_audit_material` | producer=`source_owner`；context Option | `planned/not_run` |
| `REQ-I-03` | `consume_identity_observation_context` | producer=`identity`；summary Option | `planned/not_run` |
| `REQ-I-04` | `consume_governance_audit_context` | producer=`governance`；nested digest + visibility | `planned/not_run` |
| `REQ-I-05` | `consume_artifact_evidence_context` | producer=`artifact`；purpose + visibility | `planned/not_run` |
| `REQ-I-06` | `consume_runtime_signal_summary` | producer=`runtime`；context Option | `planned/not_run` |
| `REQ-I-07` | `consume_sandbox_signal_summary` | producer=`sandbox`；receipt/state independent Options | `planned/not_run` |
| `REQ-I-08` | `consume_archive_handoff_feedback` | producer=`archive`；feedback summary Option | `planned/not_run` |
| `REQ-I-09` | `consume_report_consumer_feedback` | producer=`report_consumer`；full consumer + delivery/gap Options | `planned/not_run` |

Each Consumer baseline carries source event/source/schema and explicit source-version Option. Companion negatives cover wrong producer、source-version inner producer/source mismatch、unsupported schema and raw payload fallback; all must fail before candidate calculation/reservation.

#### 7.29.4 Operations Job: 9 / 9

| fixture | operation token | required special coverage | status |
|---|---|---|---|
| `REQ-J-01` | `publish_observation_outbox` | cursor Option、bounded limit、event set | `planned/not_run` |
| `REQ-J-02` | `rebuild_observation_read_models` | scope set + two optional refs + source cursor | `planned/not_run` |
| `REQ-J-03` | `rebuild_signal_rollups` | cursor Option + window set；empty expansion remains request-empty | `planned/not_run` |
| `REQ-J-04` | `refresh_reference_snapshots` | current snapshot ref set；historical alias reject | `planned/not_run` |
| `REQ-J-05` | `scan_observation_gaps` | expected source set empty/non-empty | `planned/not_run` |
| `REQ-J-06` | `coordinate_observation_replay` | scope/target/no-write guard complete tuple | `planned/not_run` |
| `REQ-J-07` | `prepare_report_handoff_delivery` | handoff scope/ref/consumer tuple | `planned/not_run` |
| `REQ-J-08` | `prepare_external_audit_export_delivery` | public `PrepareExternalAuditExport` static mapping；no Command-token collision | `planned/not_run` |
| `REQ-J-09` | `rebuild_peripheral_views` | structured consumer+scope set；unowned scope ref reject | `planned/not_run` |

Every Job case proves that `job_execution_ref`、public `JobRunId`、trace、requested time、claim/fence、attempt and current candidate ordering are excluded. Resolved candidate expansion is tested in plan/item fixtures, never by rewriting request golden material.

### 7.30 Eight durable-family and four-phase ledger

#### 7.30.1 Durable family totality

| durable ID | owner / material kind | required fixture set | persisted verification assertion | status |
|---|---|---|---|---|
| `DUR-01` | replay surface / `stored_result_surface` | min/max valid exact bytes + zero/over-bound negatives | verify under stored profile before replay；kind/schema/owner checked separately | `planned/not_run` |
| `DUR-02` | payload snapshot / `outbox_payload_snapshot` | min/max valid exact bytes + zero/over-bound negatives | verify under stored profile before token/publish；never rebuild from truth | `planned/not_run` |
| `DUR-03-I01..I09` | plan item / `job_plan_item` | all nine planned-material tags；observed version absent/present | same-profile rehydrate；CAS/claim/captured repository version perturbation invariant | `planned/not_run` |
| `DUR-04-J01..J09` | execution plan / `job_execution_plan` | all nine Job operations + canonical item order | inner item digest verified before outer plan；current config substitution negative | `planned/not_run` |
| `DUR-05` | item outcome / `job_item_outcome` | every legal state/11-tag association matrix row + each illegal pair；包括`publication_dead_letter` retained-failure absent/present | same-profile rehydrate；set permutation stable、duplicate rejected；dead-letter work-key/outbox/ref relation独立校验 | `planned/not_run` |
| `DUR-06-S01..S06` | report / `job_report` | Draft + five terminal states、all report failure tags | complete fold first；snapshot proof/CAS changes do not alter digest | `planned/not_run` |
| `DUR-07-P01..P04` | phase token / `external_effect_token` | four rows in §7.30.2 | source immutable material first；phase digest independently recomputed | `planned/not_run` |
| `DUR-08-P01..P04` | tagged intent index / `external_effect_intent` | same four variants | token material verified first；derived digest collision hit still fieldwise compare | `planned/not_run` |

The eight IDs match §7.14's eight durable rows exactly. `DUR-07`/`DUR-08` each expand to four phase cases; `DUR-03`/`DUR-04` expand to nine variants/operations；`DUR-05` expands from the owner legal matrix而不是由test author随意挑一个success case。

#### 7.30.2 External phase totality

| phase fixture | phase | token nested identity | intent semantic projection | mandatory negative |
|---|---|---|---|---|
| `P01` | `handoff_preparation` | exact evidence input identity | binding + handoff + input + consumer + token digest | assembled time/intent ref不得改变token digest |
| `P02` | `handoff_delivery` | prior preparation token identity + preparation ref | binding + handoff + preparation + consumer + token digest | copying preparation digest as delivery digest fails |
| `P03` | `export_preparation` | exact dashboard/export view identity | binding + preparation + view + consumer + token digest | locator/provider/body never gains encoder |
| `P04` | `export_delivery` | prior source token + package ref + `package_digest` | binding + preparation + delivery + consumer + independent token digest | `material_digest == package_digest` substitution fails |

Publication remains a separate outbox pair: its token copies the already verified payload digest and has no `ExternalEffectIntent`, `intent_ref` or second material digest. Coverage checker must include a negative case rejecting `publication` in both external-effect kinds.

### 7.31 Planned test cuts

#### 7.31.1 Golden and cross-language conformance

| test cut | exact assertion | failure meaning | status |
|---|---|---|---|
| grammar seed conformance | each §7.27.3 text decodes to exact byte hex/length/hash | primitive writer or corpus escaping drift | `planned/not_run` |
| production typed conformance | real owner type for every §7.29/§7.30 case emits corpus bytes/hash | missing writer、wrong field order/presence/profile | `planned/not_run` |
| independent reader parity | Rust under test and one independently implemented corpus checker agree | self-generated snapshot cannot prove spec conformance | `planned/not_run` |
| no auto-update | mismatch exits nonzero and prints onlycase ID/kind/profile/byte offset；does not print raw fixture or rewrite expected | drift must require reviewed profile/corpus change | `planned/not_run` |
| totality | exact 12-kind、48 request、8 durable family、4 phase and owner variant sets | incomplete registry/test coverage | `planned/not_run` |

#### 7.31.2 Property and negative matrix

| property ID | generated / paired input | invariant / expected failure | status |
|---|---|---|---|
| `PROP-01-DETERMINISM` | same validated material repeated and cloned | exact same bytes/hash；clock/process/order irrelevant | `planned/not_run` |
| `PROP-02-INCLUDED` | mutate one listed semantic field at a time | canonical bytes change；fixed samples' digest changes | `planned/not_run` |
| `PROP-03-EXCLUDED` | mutate trace/time/key/attempt/claim/fence/CAS/current config as applicable | canonical bytes unchanged | `planned/not_run` |
| `PROP-04-OPTION` | absent / present(default-like) / present(non-default) | all three encodings distinct；null/omission rejected | `planned/not_run` |
| `PROP-05-SET` | all permutations of unique members | one canonical order/hash；duplicate rejected unless owner explicitly folds | `planned/not_run` |
| `PROP-06-LIST` | reorder semantic ordered list | bytes change；writer never silently sorts | `planned/not_run` |
| `PROP-07-TYPED-REF` | same inner bytes under two owner wrappers | type discriminator changes bytes/hash | `planned/not_run` |
| `PROP-08-STRING` | escaped controls、solidus、non-ASCII、canonically equivalent Unicode scalars | exact escape rule；no normalization/case folding | `planned/not_run` |
| `PROP-09-DOMAIN` | same value under two kind/profile frames | frame bytes differ；known golden hashes differ | `planned/not_run` |
| `PROP-10-BOUNDS` | boundary-1/boundary/boundary+1 bytes and writer capacity | allowed values exact；overflow=`DigestMaterialEncodingFailed`，no partial hash/fallback | `planned/not_run` |
| `PROP-11-PERSISTED` | stored profile/value plus same semantic fields | same-profile recompute only；mismatch=`PersistedDigestMismatch` and object unchanged | `planned/not_run` |
| `PROP-12-REPORT-PROOF` | replace equivalent row/claim proof while semantic fold unchanged | report digest unchanged；authority validation remains independent | `planned/not_run` |
| `PROP-13-EXTERNAL-PHASE` | preparation/package identity reused across delivery phase | phase token digest independently framed；copy shortcut rejected | `planned/not_run` |
| `PROP-14-SAFE-CONTEXT` | all five digest errors | no expected/actual digest、bytes、key、body、locator、provider error in log/span/metric/report | `planned/not_run` |
| `PROP-15-QUERY-ZERO-WRITE` | all 14 Query fixtures | no candidates/repository/UoW/history/outbox/repair call | `planned/not_run` |
| `PROP-16-CANDIDATE-UNIQUE` | validated support with old+new readable profiles and either profile selected for write | candidate profiles equal the readable set exactly once；`write_digest()` borrows the one member matching `write_profile`；no duplicate write slot | `planned/not_run` |
| `PROP-17-PUBLICATION-DEAD-LETTER` | exact reason/ref with retained failure absent/present plus field/tag mutations | tag and value order are exact；illegal state、wrong outbox work key、reason/ref/failure mismatch or null/omitted Option fails before item CAS | `planned/not_run` |

#### 7.31.3 Supplied and persisted error matrix

| error fixture | trigger | exact result | zero-side-effect assertion | status |
|---|---|---|---|---|
| `ERR-DIGEST-01` | malformed profile/value carrier | contracts `ProtocolError` | canonicalizer/reserve never called | `planned/not_run` |
| `ERR-DIGEST-02` | legal carrier profile not accepted for current write | `SuppliedDigestProfileUnsupported` | no reservation/UoW/resolver/domain/outbox | `planned/not_run` |
| `ERR-DIGEST-03` | supplied write profile but wrong value | `SuppliedDigestMismatch` | same as above；no conflict row | `planned/not_run` |
| `ERR-DIGEST-04` | validated material writer cannot encode/bound | `DigestMaterialEncodingFailed` | no raw serde/debug fallback or partial digest | `planned/not_run` |
| `ERR-DIGEST-05` | retained object profile has no reader/candidate | `PersistedDigestProfileUnreadable` | no current-profile recompute/overwrite/use | `planned/not_run` |
| `ERR-DIGEST-06` | retained semantic material recomputes differently | `PersistedDigestMismatch` | no overwrite/replay/publish/resume/finalize | `planned/not_run` |

#### 7.31.4 Profile migration scenarios

Future alternate profiles may enter these scenarios only after all 12 kinds and §§7.29~7.30 totality have approved corpus rows. W3 does not declare a real v2, migration run or retirement pass.

| migration ID | setup / action | required result | forbidden result | status |
|---|---|---|---|---|
| `MIG-01` | write profile absent from readable set | support construction fails `WriteProfileNotReadable` | partial runtime assembly | `planned/not_run` |
| `MIG-02` | readable profile lacks any kind reader/writer | support construction fails `UnsupportedReadableProfile` | partial profile admission | `planned/not_run` |
| `MIG-03` | introduce reader, write remains old | new rows still old；candidates cover old+new | early new write | `planned/not_run` |
| `MIG-04` | switch write with existing old-profile same-material row | row-profile candidate yields Replay/InFlight；old row unchanged | profile-only Conflict/new alias row | `planned/not_run` |
| `MIG-05` | switch write with existing old-profile different material | same old-profile candidate differs -> Conflict | compare old row against new write digest | `planned/not_run` |
| `MIG-06` | switch write with absent logical key | persist only new write candidate | persist all candidates/old alias | `planned/not_run` |
| `MIG-07` | Query during dual-read | current write digest only；all writer spies zero | candidate/reservation lane | `planned/not_run` |
| `MIG-08` | old persisted result/outbox/plan/report/token readable | verify under old profile and continue exact owner flow | migrate-on-read/overwrite | `planned/not_run` |
| `MIG-09` | old profile unreadable or material mismatch | manual consistency error；row unchanged | warning + continue/current truth repair | `planned/not_run` |
| `MIG-10` | any one owner count nonzero at retirement gate | retirement denied | remove reader based onactive rows only | `planned/not_run` |
| `MIG-11` | each owner separately reports zero at unrelated times | retirement denied without shared snapshot/barrier | best-effort zero accepted | `planned/not_run` |
| `MIG-12` | all owners zero in one auditable cut | activation may remove reader after real gate consumption | design document claims actual retirement | `planned/not_run` |
| `MIG-13` | business `RetentionMarker::Released` | no digest cleanup/retire authority | physical delete/profile retire | `planned/not_run` |
| `MIG-14` | rollback write selection while old reader retained | only future absent keys use selected write profile；existing rows unchanged | rewrite rows produced before rollback | `planned/not_run` |

### 7.32 Full affected-use register

下表登记 definition/use 传播，不授权修改冻结 Step 07~16。`corrected_in_W3` 只表示本轮允许写入的 Step 06 current owner已同步；`affected_pending` 表示后续解冻时必须按该行修正。

| affected ID | location | current conflict / W3 contract | required later correction | status |
|---|---|---|---|---|
| `R06-F1-AFFECT-04-01` | Step 04 file layout | application只有`idempotency.rs`，无digest唯一owner和corpus paths | add planned `application/src/digest.rs`、three fixture files、vector/property/migration tests and totality checker；不新建crate | `affected_pending_R06.8` |
| `R06-F1-AFFECT-06-A01` | Step 06 A context/reservation | historical single incoming digest compare会在write switch误判old row | context/new row save write candidate；atomic comparison uses`RequestDigestCandidates` by row profile | `corrected_in_W3` |
| `R06-F1-AFFECT-06-B01` | Step 06 B stored result/outbox | object cards保存digest但rehydrate use-site未显式调用same-profile verifier | loaded exact bytes first；`verify_persisted_summary` before replay/token/publish；owner relation checks remain separate | `affected_pending_R06.8` |
| `R06-F1-AFFECT-06-C01` | Step 06 C export delivery | old card copied`package_digest` into delivery `material_digest` | independent `export_delivery` digest；package ref/digest nested only；factory accepts canonical digest | `corrected_in_W3` |
| `R06-F1-AFFECT-06-D01` | Step 06 D plan/item/outcome | F dependency was deferred；all rehydrate paths need exact same-profile verification | verify item inner-to-outer then plan/outcome；captured repository version/claim proof remain nonsemantic | `affected_pending_R06.8` |
| `R06-F1-AFFECT-06-E01` | Step 06 E `ApplicationError` | generic serialization/persistence errors cannot express digest failures | retain five exact variants、recovery groups and safe-detail prohibition from§7.25 | `corrected_in_W3` |
| `R06-F1-AFFECT-07-01` | Step 07 canonicalizer/context seam | no explicit application digest helper dependency | façade/input assembler consumes canonicalizer；Query calls write digest only；writers build/verify candidates before reserve | `affected_pending_after_R06.8` |
| `R06-F1-AFFECT-07-02` | Step 07 idempotency repository | `reserve_or_load(context,uow)` exposes onlycurrent context digest | atomic port accepts logical scope、optional event identity and candidates；existing row selects retained profile；new row stores write candidate | `affected_pending_after_R06.8` |
| `R06-F1-AFFECT-07-03` | Step 07 durable repository capabilities | no cross-owner profile usage/retirement scan contract | every digest-owning store exposes profile usage under one snapshot/barrier；canonicalizer itself gets no repository port | `affected_pending_after_R06.8` |
| `R06-F1-AFFECT-08-01` | Step 08 request wrappers | wording lets boundary derive/trust one request digest | parse carrier atcontracts boundary；application computes normalized typed material；supplied compare pre-mutation；absence rule per protocol | `affected_pending_per_protocol` |
| `R06-F1-AFFECT-08-02` | Step 08 historical refs/Job input | `ReferenceSnapshotRef` and `PeripheralConsumerScopeRef` lack current encoder；public/internal export operation names differ | use`ReferenceSnapshotStateRef` and structured consumer+scope；static map public export Job to application delivery token | `affected_pending_per_protocol` |
| `R06-F1-AFFECT-09-01` | Step 09 Command/Consumer/Job admission | current flows reserve on one current-profile digest | validate DTO -> build material/candidates -> verify supplied write digest -> atomic reserve；no mutation before all steps | `affected_pending_per_flow` |
| `R06-F1-AFFECT-09-02` | Step 09 Query/replay/resume/external flows | Query wording can share writer template；persisted digest checks are scattered | Query direct write digest + zero-write；replay/publish/resume/report/external verify stored profile/material before use | `affected_pending_per_flow` |
| `R06-F1-AFFECT-11-01` | Step 11 logical schema/rehydrate | no total same-profile verification and profile usage cut across all owners | persist profile/value losslessly；rehydrate verifies; add scan/count/index or equivalent snapshot support for every§7.26.4 owner | `affected_pending` |
| `R06-F1-AFFECT-11-02` | Step 11 migration | generic migration wording could rehash/copy current truth | physical copy may retain old bytes/digest only；no rehash-on-read/write；shared cut required for retirement | `affected_pending` |
| `R06-F1-AFFECT-12-01` | Step 12 recovery | generic digest conflict/manual rows do not cover five producers | total map: supplied two ->`DoNotRetrySameInput`; encoding/persisted three ->`ManualIntervention`; malformed staysprotocol | `affected_pending` |
| `R06-F1-AFFECT-13-01` | Step 13 idempotency | same digest historically means direct stored/current value equality | same material means candidate selected byretained profile；profile difference alone is not Conflict；no alias reservation | `affected_pending` |
| `R06-F1-AFFECT-13-02` | Step 13 concurrency/tests | profile switch race and immutable persisted verification absent | add atomic old/new writer race、candidate selection、no-overwrite and same-UoW result compatibility cuts | `affected_pending` |
| `R06-F1-AFFECT-14-01` | Step 14 runtime builder | generic digest config stage lacks complete support object/error mapping | assemble`ObservationDigestProfileSupport`; support error -> startup invalid configuration；all 12 kinds required before readable activation | `affected_pending` |
| `R06-F1-AFFECT-14-02` | Step 14 activation/retirement | config change could remove reader without durable usage gate | consume real shared-cut usage result；failure retains reader/refuses startup；no in-place row rewrite | `affected_pending` |
| `R06-F1-AFFECT-15-01` | Step 15 safe telemetry | broad error fields could expose digest material/profile as metric label | only finite material kind/stage/error variant; profile log/trace allowlist only；never digest/bytes/key/body/locator | `affected_pending` |
| `R06-F1-AFFECT-16-01` | Step 16 test cuts | one generic canonical digest cut lacks corpus/profile/error totality | consume §§7.27~7.31；12/48/8/4 checker、golden/property/error/migration cuts；all remain planned until execution | `affected_pending` |

Two ownership redlines apply to every row. First, Observability stores only observation-side digest/projection/coordination material and never promotes a digest to business truth, evidence authenticity, acceptance, verdict or signoff. Second, no affected review may log/hash forbidden bodies as a workaround, rewrite retained digests, or let `RetentionMarker` authorize technical profile retirement.

### 7.33 W3 static closure

| check | conclusion | basis |
|---|---|---|
| error owner and layers total | `pass_design_only` | contracts malformed、startup support、five application variants separated in §§7.24~7.25 |
| support/candidate API consistent | `pass_design_only` | W1 signatures superseded；A reservation uses row-profile candidate；Query excluded |
| migration state and retirement total | `pass_design_only` | four rollout phases + all owner shared-cut gate；no rehash/Retention promotion |
| grammar exact bytes anchored | `pass_design_only` | nine document-time seeds include bytes/length/hash；not implementation evidence |
| 12 material kinds covered | `pass_design_only` | §7.28 exact registry equality |
| 48 request operations covered | `pass_design_only` | 16/14/9/9 ledger in §7.29；fixtures remain planned |
| eight durable families covered | `pass_design_only` | §7.30.1 exact §7.14 row mapping |
| four external phases covered | `pass_design_only` | §7.30.2 token + intent expansion；Publication negative boundary |
| property/error/migration cuts actionable | `pass_design_only` | exact input/result/no-side-effect matrices in §7.31 |
| affected definitions complete | `pass_design_only` | Step04、Step06 A~E、Step07~16 in §7.32 |
| tests/evidence truthfulness | `pass` | all implementation artifacts `planned/not_created`; all tests `planned/not_run`; no run/evidence/signoff/commit claimed |
| F1 closure | `done_design_only_waiting_user` | W1+W2+W3 complete；F2 remains separate and frozen |

W3 closes `R06.6-DIGEST-CANONICALIZER` as `resolved_in_F1_design_only`. It does not close `03-RPR-S06-GRANULARITY` or `R06-F-AFFECT-UOW-01`: F2、R06.7、R06.8 and downstream affected reviews remain required. Current stop point is before F2.

## 8. 回填草稿

本节只作为 Step 19 重装配输入，不是对正式`03-详细设计.md`的修改。正式 application 对象章节至少必须保留下列可落码事实，不能压缩为“使用deterministic JSON和SHA-256”：

```md
### application::digest canonical material contract

`DigestProfileVersion`、`DigestValue`、`RequestDigest`和`DigestSummary`唯一归`contracts::refs`；`application::digest`唯一拥有12-kind material registry、sealed typed writer、profile support、canonical framing、SHA-256、candidate generation和persisted verification。Canonicalizer不访问repository、UoW、clock、resolver、adapter或业务truth。

Profile v1 frame固定为`profile`、`kind`、`value`三个有序成员。UTF-8、字符串escape、typed ref discriminator、tagged Option/enum、ordered list、canonical set、bounded bytes和nested digest均使用本Step exact grammar；arbitrary map、float、raw body、transport JSON、serde/debug bytes和forbidden-material hash surrogate没有encoder。字段、顺序、presence、kind或grammar变化必须提升profile，不能原地改变v1。

16 Command、14 Query、9 Inbound Consumer和9 Operations Job分别拥有exact typed material。Command/Consumer/Job在mutation前为每个readable profile建立`RequestDigestCandidates`，只用write candidate校验supplied digest和写新row；命中旧row时按row自身profile选candidate。Query只计算current write digest作为read context marker，永不进入candidate、reservation或writer lane。

Stored result、outbox snapshot、plan、plan item、item outcome、report、external token和external intent均按其自身profile从exact immutable semantic fields重算。Self digest、CAS/repository version、clock、trace、claim/fence、attempt和current config按各表排除。Persisted mismatch不覆盖、不rehash-on-read、不从current truth重建，也不继续replay、publish、resume、seal或external finalize。

Digest failure分三层：malformed carrier归`ProtocolError`；startup support归`DigestProfileSupportError`并映射invalid configuration；accepted/persisted material归唯一`ApplicationError` owner的`SuppliedDigestProfileUnsupported`、`SuppliedDigestMismatch`、`DigestMaterialEncodingFailed`、`PersistedDigestProfileUnreadable`和`PersistedDigestMismatch`。Safe context只允许finite kind/stage和可选profile，不得携带expected/actual digest、bytes、key、body、locator、credential或provider error。

Profile rollout固定为`introduce-reader -> switch-write -> retirement-pending -> retired`。Existing rows始终保留原profile/value；retirement必须在一个可审计shared cut内证明所有digest owner零引用，且backup/replay窗口不再需要reader。业务`RetentionMarker::Released`不授予technical cleanup或profile retirement。

Golden corpus、property、error和migration tests按12 kind、48 request、8 durable family、4 external phase做totality；当前均为planned/not-created或planned/not-run，不构成实现证据、run、验收或signoff。
```

Step 19还必须回引§§7.10~7.21的exact material表、§7.25的错误条件、§7.26的migration state和§7.32 affected-use，不能从冻结Step13/14或旧formal`03`恢复短形状。

## 9. 待确认事项

| 项目 | 当前状态 | 处理批次 | 是否阻塞 F1 |
|---|---|---|---|
| 每个 Command / Query / Consumer / Job 的 exact field order | resolved_in_W2 | W2 | 否；已完成48入口totality audit |
| stored/outbox/plan/item/outcome/report/effect exact material | resolved_in_W2 | W2 | 否；已固定non-recursive字段、排序和排除项 |
| exact string escape examples 与 cross-language golden bytes | resolved_in_W3_design | W3 §7.27 | 否；grammar seeds已固定，production corpus仍planned/not_created |
| `ApplicationError` digest-specific variant 命名和 safe detail | resolved_in_W3_design | W3 §7.25；owner仍为`application::errors` | 否；五个variant已回灌E批唯一owner |
| `DigestMaterialKind` 是否需要增加独立 `external_effect_intent` kind | resolved_keep_in_W2 | W2 | 否；intent semantic tuple与token source-material主语不同，intent digest只是derived secondary carrier |
| profile support 的runtime assembly / exact config key | affected_pending | Step 14 / `04` | 否；semantic support contract已闭合，key/source precedence后置 |
| old profile physical retention / migration audit | affected_pending | Step 07/11/14/18 | 否；本Step已固定zero-reference/shared-cut/no-rehash规则，真实scan不得伪造 |
| 真实实现仓 `/home/aris/Projects/quantalithos-observability` | not found | Step 17 / `07` kickoff gate | 否；不阻塞 design |
| 测试是否已执行 | `not_run` | Step 16 / `05` | 否；本文件只写planned tests且不声明evidence |

## 10. 进入下一步条件

`R06.6-F1-W3` 已完成design-only并停审。进入`R06.6-F2`必须满足最后一项，即再次获得用户明确确认：

- [x] 用户已明确确认进入W3，W1/W2前置定义未被越权改写；
- [x] canonicalizer、Step06 A/C/E current owner、主控、flow和project ledger同步为`R06.6-F1-W3_done_waiting_user_before_F2`；
- [x] 本批没有修改正式`03`、Step07~19、任何`04`文件、implementation ledger、boundary skeleton或实现代码；
- [x] `contracts::refs`与`application::digest`没有重复定义digest value type或algorithm owner；
- [x] 16 Command、14 Query、9 Consumer、9 Job均有exact material与planned fixture，合计48；
- [x] 12 material kind、8 durable family、4 external phase均有totality账；Publication未被伪装为intent；
- [x] supplied/persisted error、same-profile verification、candidate admission和四阶段migration已闭合；
- [x] C批`ExportDeliveryToken.material_digest`已与nested`package_digest`拆分；A批old-profile reservation比较已按row profile修正；
- [x] Query no-write、forbidden body、safe telemetry、不反写业务truth、不伪造验收/evidence边界未改变；
- [x] 全部实现artifact为`planned/not_created`，全部测试为`planned/not_run`，没有run id、evidence alias、signoff或实现commit声明；
- [x] 外部上游blocker仍为`none`；`R06-F-AFFECT-UOW-01`继续`open_controlled`且没有被F1误关闭；
- [ ] 用户明确确认后才能写入F2；不得自动进入R06.7、R06.8、Step07或正式回填。

当前恢复点是`R06.6-F1-W3_done_waiting_user_before_F2`。下一步应读取R06.5 H1~H13 record factory、R06.3/R06.4 transition + same-UoW post-state、Step07/09/11冻结的cursor/append顺序，仅为F2设计修复输入。当前不需要提交。
