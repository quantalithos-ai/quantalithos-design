# L3-capability-hub 05 测试方案 Step 7: 测试数据设计

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/测试方案书写规范.md` §5.7
> 回填章节: `projects/L3-capability-hub/05-测试方案.md` §7
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> Step 状态: `accepted-designed`
> 当前任务: `T029`
> Safe-text scanner controlled repair: 2026-08-09; adds a shared-registry dummy corpus and cleanup contract without adding a canonical DS or execution fact

---

## 1. 本步目标、输入、输出与边界

### 1.1 本步目标

把 Step 6 的 `189` 条 canonical test case 中每一条唯一 `DR-CH-*` 转译为一条可重复构造、可隔离、可清理且可定位失败参数的 `DS-CH-*` logical data bundle，并收稳以下横切数据合同：

1. fixed Clock、deterministic ID、typed actor/ref、canonical digest vector；
2. 43 object、250 protocol type、83 flow、24 state family、22 transaction、12 binding、12 observability、18 configuration-failure 所需 builder / seed / generated registry；
3. `638 = 239 current + 98 reserved + 301 illegal` 个 `SP-CH-*` identity 的完整消费规则；
4. UoW、repository、external Port、Worker、Outbound、Job、observer 和 configuration 的 deterministic fake/fault script；
5. negative、boundary、concurrency、recovery、body-free、redaction 与 historical pollution corpus 的独立隔离；
6. 每个测试切口的数据停审，以及跨数据污染、清理、替身一致性和人工造数审计。

### 1.2 本步权威输入

| 输入 | 本步消费内容 | 权威结论 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 189 TC、189 DR、83 flows、24 state、638 pairs、22 TX、12 BIND、12 OBS、18 CFG-F | 每条 DR 必须有唯一 DS；不得合并 canonical identity |
| `03-详细设计.md` §§5~15 | exact object/protocol/Port/flow/state/UoW/error/config/observation 名称和 invariant | 数据只能实例化正式契约，不可补 schema 或状态 |
| `03_ddd_step_10_state_matrix.md` | 24 family 的 exact ordered variants、逐 pair classification、callable/guard/effect/error | `SP-CH-*` classification 只能复制，不得由测试实现推断 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | repository keys、version、UoW、stored carrier、cursor/index symmetry | seed 必须保留 owner/version/UoW 边界 |
| `03_ddd_step_13_concurrency_idempotency.md` | digest、winner、commit Unknown、replay 和 Job recovery | 并发/恢复数据不得复用 happy path 隐藏 winner |
| `03_ddd_step_14_config_external_binding.md` | Configured/Fake/Disabled/Missing、Stage 0~7、6 sources、10 routes、8 Jobs | fake 只能表达正式 branch；Missing 不能伪装 Disabled |
| `04-配置设计.md` §§4~13 | strict JSON、source priority、profiles、27 rows、21 env leaves、9 slots、24 failures | config corpus 不发明 key/default/profile/fallback |
| L1-governance / L3-method-library Step 7 | 结构、粒度、停审、隔离和清理参考 | 不复制领域数据、编号、产品环境或实现路径 |

### 1.3 本步输出

| 输出 | 数量 / 口径 |
|---|---|
| canonical logical data bundle | `189` 条 `DS-CH-*`，与 `DR-CH-*` 一一对应 |
| shared deterministic primitive | `12` 类，可复用但不计入 189 canonical DS |
| state pair parameter source | `638` 条 planned `SP-CH-*`，`239/98/301`，unclassified=`0` |
| immutable state formation rows | `ReconciliationReportState` `5` outcomes，独立于 638 mutable/boundary pair 分母 |
| family stop-review | foundation、flow、state、TX、BIND、OBS、CONFIG 共 `7` 组 |
| cross-data audit | identity、coverage、isolation、cleanup、negative separation、fake semantics、sensitive corpus、manual-data dependency |

### 1.4 明确不做

- 不修改 historical formal `05-测试方案.md`；正式文件只在 Step 15 装配。
- 不创建 Rust test、fixture JSON、seed SQL、fake implementation、script、snapshot 或 corpus 文件。
- 不选择 durable product、external provider、real endpoint、credential/TLS material 或 production-like environment。
- 不生成真实 `test_run_ref`、run_id、artifact path、digest、report、evidence alias、pass/fail、coverage 或签署。
- 不把 runtime/tools execution、governance approval、method body/source、marketplace listing、provider route/cost 或 SDK client/cache 造成本地 truth 数据。

## 2. SOP Step 7 九问回答

| SOP 问题 | 结论 | 本文件落实 |
|---|---|---|
| 1. 哪些基础数据必须存在？ | run namespace、fixed Clock、deterministic typed IDs/refs、actor/trace、canonical DTO/object、repository seed、UoW script、Port script、closed config candidate 是基础；每条 TC 再有 owner-specific delta。 | §§5~10 |
| 2. 哪些边界、异常、并发和恢复数据必须构造？ | missing/wrong owner/kind/version、min/max/out-of-bound、forbidden body、duplicate/conflict、commit Unknown、rollback failure、A/B/C fault、Job partial target、strict config fault必须独立。 | §§6、11 |
| 3. 数据如何隔离不同测试运行？ | future run 使用 opaque `test_run_ref` 对应 namespace；再按 `tc_id/scenario_id/owner_ref/operation_key/target_ordinal/config_case` 分区。 | §12.1 |
| 4. 数据如何清理？ | pure builder 无持久清理；fake store drop run namespace；fault/observer/clock reset；isolated corpus delete；future selected durable suite 使用 run-scoped schema/transaction cleanup。 | §12.2 |
| 5. 外部依赖使用什么替身？ | P0 使用 contract-faithful Fake、Controlled script 或 formal Disabled；Stub 只用于单次无状态返回；real-like 只留 Step 8 的 selected P1/P2 候选。 | §13 |
| 6. 每个 P0 数据前置可否稳定构造？ | 可以。189 DR 均映射唯一 DS；每个 DS 由 shared primitive + owner-specific seed/mutation/fault profile组成。 | §§7~10、14 |
| 7. 哪些负向/边界/并发/恢复需要单独数据集？ | 所有会改变断言来源或 effect proof 的 branch 都在所属 DS 内拥有独立 `scenario_id` 和隔离 seed；禁止在 happy seed 原位污染。 | §11 |
| 8. 每个切口是否停审？ | 189 条按 7 family 批次停审，检查 source、constructability、isolation、cleanup、substitute 和 zero-effect。 | §15 |
| 9. 是否有污染、清理缺失、替身不明或人工造数？ | 完成设计审计后均为 0；实现阶段若不能机械生成，必须回开 owning design，不得人工补数。 | §16 |

## 3. 当前材料问题诊断与处置

| 发现 | 风险 | 处置 |
|---|---|---|
| old formal 05 只有旧 `TC-001..012` 和旧业务对象 | 无法覆盖 189 exact cuts，可能把 runtime/provider truth 带回 | `historical_material`；本步不继承其 fixture/data 名称 |
| README 含 execution/provider/cost/approval shorthand | 可能诱导构造越界 positive data | 只进入 negative pollution corpus；T070 再裁决 README |
| Step 10 historical prose 曾写 `304 illegal` | 造成 state denominator 分裂 | `historical_discrepancy_superseded`；唯一有效值为 `301` |
| 真实 durable/backend/provider 未选择 | 无法定义真实 seed/cleanup | 非 P0 blocker；P0 用 contract fake，Step 8 标记 selected-run prerequisite |
| `EventCollaborationStatus` 容易被 seed 成本地 delivery table | 责任泄漏 | 只由 external Port script 返回；local persisted status rows=`0` |
| `ReconciliationReportState` 容易被生成 mutable pair | 伪造状态机 | 仅 5 个 immutable formation outcomes，不进入 638 pair 分母 |
| shared fixture 容易吞并 189 identity | traceability 丢失 | shared primitive 无 canonical DS 身份；每个 DR 仍有自己的 DS manifest |
| raw body/secret 负向样本可能污染日志或报告 | 安全与证据污染 | dummy-only isolated corpus，scanner 输入不得进入 business store/observer fallback |

#### Closed safe-text marker corpus

The scanner corpus is a shared targeted fixture, not a canonical dataset. Its generator must import the same private eight-marker registry and precedence order as the production contracts scanner; duplicating marker strings in a test-only list is invalid. The corpus must contain, at minimum, the empty/trim vectors, eight exact positive categories, case/punctuation/version/slug near-misses, Unicode confusables, split markers, percent/base64/JSON-escaped/PEM-encoded representations without the exact literal, wrapper controls retaining the literal, repeated markers, all 28 unordered category pairs in both text orders, marker-free UTF-8 preservation values, and raw-owner fail-closed probes. Each input is isolated under the existing foundation/forbidden-material scenario namespace, and no input, matched marker, source body, URL, hash, digest, byte length, or diagnostic excerpt may enter a business carrier, error, log, report, artifact, observer fallback, or evidence record. The corpus is deleted after every attempt, including scanner or parser failure; cleanup failure invalidates run hygiene.

未发现无法由正式 DTO、object、Port、state、UoW 或 config contract 构造的 P0 oracle；unresolved upstream blocker=`0`。

## 4. 改动前后与测试数据取舍

### 4.1 改动前后

| 项 | Step 7 前 | Step 7 后 |
|---|---|---|
| data identity | 189 个 `DR-CH-*` 仅为需求占位 | 189 个唯一 `DS-CH-*` logical bundle，可机械双向追溯 |
| state data | 24 TC + 638 pair registry obligation | 每 family DS 消费 exact pair 子集，总计 638；另有 5 immutable formation rows |
| deterministic input | 用例描述提到 deterministic fake | fixed Clock/ID/actor/ref/digest/UoW/Port script contract 固定 |
| negative data | 分散在 case 前置文字 | 独立 scenario identity、mutation source、effect proof 和 cleanup 固定 |
| external data | Configured/Fake/Disabled 仅有 branch 名 | fake/controlled/disabled 的状态与调用语义固定，Missing 不可调用 |
| sensitive corpus | 只有 forbidden assertion | dummy-only、isolated、no-echo、delete-after-scan 合同固定 |
| cleanup | 未定义 | 按 pure/fake/fault/corpus/future-durable 分类固定 |

### 4.2 设计取舍

| 方案 | 优点 | 风险 | 裁决 |
|---|---|---|---|
| 每个 scenario 都独立复制完整 fixture | 最直观 | 189 份漂移且容易失去 canonical parity | 不采用 |
| 少量共享数据集映射多个 DR | 文件短 | DR/DS identity 被吞并，失败不能定位 exact cut | 不采用 |
| 189 logical bundles 组合 typed shared primitives | 保留 identity，又复用稳定构造规则 | 实现需维护 manifest 和 builder registry | 采用 |
| 随机/fuzz 数据作为 P0 主来源 | 可扩大探索 | 不可稳定复现，不能替代 exact boundary | 不采用；property/fuzz 只能在 canonical seed 后扩展 |
| 全量显式手写 638 pair fixture | 直接可见 | 极易抄错，难随 formal matrix 检查 | 不采用 |
| 从 exact ordered variants 机械展开，再复制逐行裁决 | 可审计数量、identity 和 classification | 需要 generated registry gate | 采用；禁止运行时推断分类 |
| external real-like 作为 P0 | 接近产品 | 产品/endpoint/credential 未选，且易伪造事实 | 不采用；Step 8 仅列候选 |

## 5. Canonical data identity 与 manifest contract

### 5.1 一一对应规则

对任意 Step 6 数据需求：

```text
DR-CH-<FAMILY>-<NNN>
  -> DS-CH-<FAMILY>-<NNN>
  -> exactly one TC-CH-* owner
```

flow family 保持 DR 的 exact `FLOW-C/Q/I/O/J` token，因此例如：

```text
TC-CH-CMD-001
  -> DR-CH-FLOW-C-001
  -> DS-CH-FLOW-C-001
```

不得把 `DS-CH-FLOW-C-001` 重命名为 command-alias 形式，也不得让一个 DS 代替两个 DR。shared primitive、builder registry、fault profile 和 corpus registry 没有 canonical DS 身份，不计入 189。

### 5.2 每条 DS manifest 必填字段

| 字段 | 合同 |
|---|---|
| `dataset_id` | 唯一 `DS-CH-*`，按 DR token 机械映射 |
| `data_requirement_id` | 唯一对应 `DR-CH-*` |
| `test_case_id` | 唯一 canonical `TC-CH-*` |
| `source_cut` | Step 6 exact cut，不接受 family-only 引用 |
| `scenario_id` | `<dataset_id>/<positive|negative|boundary|concurrency|recovery>/<stable-token>` |
| `run_namespace` | future opaque test-run namespace；本文不分配真实值 |
| `clock_vector` | fixed instant 序列和允许推进点；不得读 wall clock |
| `id_vector` | typed ID/ref 的 deterministic ordinal，按 owner/kind/domain 分区 |
| `actor_vector` | formal actor/source/channel/trace；禁止 whole actor 输出到 observer corpus |
| `builder_inputs` | exact DTO/object/config fields；不允许 private/unmodeled fields |
| `seed_rows` | owner/key/version/index/cursor/stored carrier 和 UoW membership |
| `mutation_or_fault` | 相对 canonical positive 的单变量 mutation 或 exact phase fault |
| `expected_class` | typed result/error/state/pair classification；不是 pass/fail 结果 |
| `effect_probe` | expected writes/calls/time/ID/history/capture/external effects and zero counts |
| `substitute_profile` | none/fake/controlled/disabled；real-like 不属于 P0 baseline |
| `cleanup_profile` | pure/drop-run/reset-fault/delete-corpus/future-durable-run |
| `sensitivity_class` | safe/body-free/dummy-forbidden；真实 sensitive material 永不允许 |

### 5.3 逻辑 bundle 与实现物边界

`DS-CH-*` 是设计身份，不代表文件、函数、数据库 schema 或已生成数据。未来实现可用一个 parameterized test function 消费多条 DS，也可让一条 DS 组合多个 builder，但报告必须保留 `tc_id + dataset_id + scenario_id + parameter_id`。Step 9/07 才决定 suite/check 与实现 boundary；Step 13 才决定 artifact/report contract。

## 6. Shared deterministic primitives

### 6.1 Primitive registry

| Primitive | 必须提供 | 禁止行为 | Reset / cleanup |
|---|---|---|---|
| `TD-CH-RUN` | opaque run namespace、TC/DS/scenario scope、deterministic ordinal allocator | 真实 run_id、global singleton、跨 case key 复用 | drop namespace |
| `TD-CH-CLOCK` | fixed `T0`、formal monotonic increments、phase-specific timestamps | system now、sleep 推进、observer 驱动时间 | reset to scenario vector |
| `TD-CH-ID` | 每种 formal ID/ref 独立 typed sequence；same-ref/different-ref 显式 | UUID randomness 作为 oracle、raw string 代 typed ref | reset ordinal namespace |
| `TD-CH-ACTOR` | formal actor/source/channel/trace combinations和wrong-actor variants | 真实身份、token、whole actor 泄漏 | pure value reset |
| `TD-CH-CANONICAL` | 四 digest domain 的 canonical bytes、domain separator、included/excluded field vectors | `Debug`/Display/pretty/map iteration/raw body/fallback hash | pure vector |
| `TD-CH-BUILDER` | 43 object + 250 protocol + infra-local config declarations的typed valid baseline和single-field mutation | 绕过 factory/guard、补 private field、口语状态 | pure value / drop run seed |
| `TD-CH-STORE` | 22 repository/110 method contract fake，owner/key/version/index/order/cursor/staged-set可检查 | hidden finder、full-scan fallback、first-row guess、adapter nested UoW | drop run namespace |
| `TD-CH-UOW` | Begin/Stage/Commit Durable|Rejected|Unknown、Rollback success/failure、ordered call journal | bool commit、Unknown 猜成功/失败、rollback 覆盖原错 | reset script and journal |
| `TD-CH-PORT` | 9 external Ports/14 callables exact typed scripts；Configured/Fake/Disabled branch | raw response/body/secret、cross-family fallback、私造 retry | reset slot script |
| `TD-CH-ENTRY` | API barrier、6 Worker source header-first lifecycle、8 Job dispatch和non-cancelling owner | local queue/DLQ/lease/attempt truth、generic Job execute | drain then reset harness |
| `TD-CH-OBSERVER` | 60 log、48 metric、27 span+3 event、20 durable profile capture和Off/Redacted fault sink | business decision/state/retry source、raw material fallback | clear run-scoped capture/fault |
| `TD-CH-CONFIG` | strict UTF-8 JSON bytes、bounded env map、candidate graph、provider/constructor/Stage scripts | real env/secret/path、dynamic source、silent fallback | pure bytes/map + reset providers |

### 6.2 Deterministic value rules

1. `T0/T1/...` 是实现时由 fixed Clock 注入的相对向量；本文不伪造真实 timestamp。
2. ID ordinal 只用于生成 typed value，不以排序巧合替代 formal order/cursor contract。
3. same-value、same-state、same-digest、same-result 必须复用 exact canonical typed value；different case 只改变声明字段。
4. version seed 从 formal repository row 明确给出；cursor 永远不能充当 expected version。
5. canonical digest vector同时包含 semantic permutation、domain/channel crossover、excluded retry/trace metadata和codec failure；不记录未经执行的 digest literal。
6. actor/source mismatch 使用 synthetic safe identity，不使用真实 user/provider credential。
7. every future public test-support declaration仍必须有完整英文 `///`；每个 struct 及字段、enum variant/payload、trait/method/callable均不可遗漏，enum struct-variant field不得写field-level `pub`。

### 6.3 Builder、fixture、seed 与 fault profile 边界

| 构造方式 | 可承载 | 不可承载 |
|---|---|---|
| typed builder | formal object/DTO/state/ref/safe summary；valid baseline与single-field mutation | 未定义字段、绕过 constructor、raw string ref、private marker |
| pure fixture | strict bytes/header/config corpus、dummy forbidden corpus、static manifest graph | 真实 secret/provider body、生产 artifact、evidence/report truth |
| repository seed | exact owner/key/version/current/history/index/cursor/stored result/capture/journal/report | second truth authority、query repair、implicit fallback row |
| generated registry | 250 type members、43 object members、83 flows、638 state pairs、profile inventories | 从实现分支反推设计分类、抽样替代 denominator |
| fault profile | exact Port/UoW/repository/entry/observer/config phase and typed outcome | generic fail flag、日志文本作为恢复 marker、未建模 retry |

## 7. Foundation canonical data bundles: 18/18

本节每一行都是一条 canonical DS。`inventory` 表示由正式 03 的 closed registry 机械生成参数，而不是扫描实现后反推设计；`mutation` 必须从该行 valid baseline 单变量产生。

| Dataset / TC | Canonical builder / seed | 独立 negative / boundary / fault data | 隔离与清理 |
|---|---|---|---|
| `DS-CH-FOUNDATION-001` / `TC-CH-FOUNDATION-001` | 250 public type manifest；每type exact kind、fields、variants、schema/serde requirement与canonical instance | missing/extra/duplicate member；required/unknown/null/coercion/unsupported-schema/forbidden-body mutations | `type_id/case_id`；pure generated values |
| `DS-CH-FOUNDATION-002` / `TC-CH-FOUNDATION-002` | 43 object manifest + 24 state-family valid factory/member values，typed owner/ref/time/version | wrong owner/ref/state、terminal rewrite、same-state delta/no-op和malformed invariant各独立 | `object_id/member/case_id`；pure or drop run seed |
| `DS-CH-FOUNDATION-003` / `TC-CH-FOUNDATION-003` | 83 exact flow manifests，各有formal request、repository rows、Port/UoW ordered success script | 每flow逐个 Port/domain/conflict/duplicate/staged/commit/post-commit fault | `flow_id/scenario_id/operation_key`；drop run + reset scripts |
| `DS-CH-FOUNDATION-004` / `TC-CH-FOUNDATION-004` | one complete Stage 0~7 graph，22/110 fake authority、9 external slots和selected entries | second authority、partial method graph、wrong UoW、each-stage construction/cleanup fault | `assembly_candidate_ref/stage`；dispose prefix + reset providers |
| `DS-CH-FOUNDATION-005` / `TC-CH-FOUNDATION-005` | exact API request/envelope for each protocol family，barrier-open mapping与parked owned invocation | wrong route/body/schema/metadata/mapping；pre-barrier；caller timeout/drop | `request_ref/route/case_id`；await terminal then drop run |
| `DS-CH-FOUNDATION-006` / `TC-CH-FOUNDATION-006` | six source-specific bounded headers/envelopes，valid actor/schema/source和parked Worker lifecycle | header/schema/source/body/barrier faults；Disabled/Missing；stop/drain/join faults | `source_id/message_key`；drain + reset source fake |
| `DS-CH-FOUNDATION-007` / `TC-CH-FOUNDATION-007` | eight exact Job request variants、frozen plans、ordinal targets、typed final response refs | wrong name/schema/input/result variant；deadline、partial target、crash/reentry/shutdown | `job_run_key/target_ordinal`；finish owned run + drop namespace |
| `DS-CH-FOUNDATION-008` / `TC-CH-FOUNDATION-008` | 7-member/15-local-edge exact allowlist graph and public-signature metadata | each reverse/skip-layer/extra/third-party public type edge as isolated graph mutation | `graph_case_id`；pure generated metadata |
| `DS-CH-FOUNDATION-009` / `TC-CH-FOUNDATION-009` | exact compatible sibling `core-contracts` manifest/API candidate | absent/incompatible edge、other sibling import、copied replacement/compat shim | `dependency_case_id`；pure metadata; no sibling state |
| `DS-CH-FOUNDATION-010` / `TC-CH-FOUNDATION-010` | API/Worker/Jobs entry constructor/field/call graph connected only to application facade | inject repository/adapter/capture publisher/direct UoW edge one at a time | `entry/member/case_id`；pure static graph |
| `DS-CH-FOUNDATION-011` / `TC-CH-FOUNDATION-011` | static source corpus with valid English `///` on every public declaration、struct/field、enum variant/payload、trait/method/callable | missing doc、empty/non-English shell、parent-doc-only、undocumented field/variant/method、enum payload field-level `pub` | `declaration_path/finding_kind`；isolated dummy source corpus delete |
| `DS-CH-FOUNDATION-012` / `TC-CH-FOUNDATION-012` | 43-object exact factory/member registry with valid、min/max、owner/bound/version values | missing/wrong owner/kind/bound、min-1/max+1、terminal/no-op/invariant mutation | `object/member/vector_id`；pure or drop object seed |
| `DS-CH-FOUNDATION-013` / `TC-CH-FOUNDATION-013` | seven canonical helper inputs by exact channel/domain/ref and expected stable carrier fields | wrong channel/domain、body-bearing input、field permutation和asymmetric carrier | `helper/domain/vector_id`；pure vectors |
| `DS-CH-FOUNDATION-014` / `TC-CH-FOUNDATION-014` | 250 protocol canonical instances and exact serialized/nonserialized classification | per-type missing/unknown/null/coercion/body/variant/schema mismatch corpus | `protocol_type/vector_id`；pure bytes/values |
| `DS-CH-FOUNDATION-015` / `TC-CH-FOUNDATION-015` | four-domain canonical frames with same-semantic permutations and included/excluded field manifest | domain/channel/business-field changes、retry/trace metadata changes、raw body、codec fault | `digest_domain/vector_id`；pure vectors; no asserted literal digest |
| `DS-CH-FOUNDATION-016` / `TC-CH-FOUNDATION-016` | 27 local/base Port and exact callable/signature/UoW owner registry backed by one fake authority | hidden finder、wrong UoW、non-Send candidate、second authority、generic result | `port/callable/case_id`；drop store + reset call journal |
| `DS-CH-FOUNDATION-017` / `TC-CH-FOUNDATION-017` | 9 external Port/14 callable scripts for each legal Configured/Fake/Disabled row | Missing、wrong family、typed asymmetry、temporary/permanent/invalid response；dummy raw body probe | `slot/callable/binding/case_id`；reset Port script |
| `DS-CH-FOUNDATION-018` / `TC-CH-FOUNDATION-018` | 22 repository/110 method registry with exact success/missing/page/order/key/version/index/cursor rows | CAS/unique/wrong owner/key/index/cursor/version/asymmetry and impossible persisted row | `trait/method/vector_id`；drop run store + reset journal |

Foundation stop-review：18/18 DS均唯一；250/43/83/27/9/14/22/110和Rustdoc targets都有机械参数 identity；negative corpus不与valid baseline共用 mutable seed；不存在实现路径、测试运行或真实 dependency fact。

## 8. Flow canonical data bundles: 83/83

### 8.1 Flow shared construction contract

| Flow family | Shared baseline | 必须独立的数据分支 | Cleanup |
|---|---|---|---|
| Command | canonical request/digest、formal owner rows、expected versions、absent/existing reservation、same-UoW effect set | invalid request、same/different digest、stale/unique、each staged fault、commit NotDurable/Unknown、post-Durable Port fault | drop run UoW/store；reset resolver/Port |
| Query | exact scope/ref/page/cursor read seed + write/call audit spies | hit/missing/empty/not-visible/degraded/corrupt/invalid-cursor；all branches assert writes=0 | drop read seed；reset spies |
| Inbound | bounded header + canonical bytes/digest + actor/source + receipt reservation + resolver script | gate/decode/actor/source/body/no-change/delayed/rejected/quarantined/same- and different-digest duplicate | drop receipt namespace；reset source/resolver |
| Outbound | exact Durable source record + immutable snapshot candidate + capture + external Port script | A each write/commit fault、B five typed outcomes/raw failure、C CAS/race/Unknown；phases never merged | drop source/capture run；reset collaboration |
| Job | exact request/reservation + complete frozen plan + ordinal target seeds + initial/target/final UoW scripts | pre-entry、each target outcome、unsafe terminalization、crash at every boundary、reentry/race/final fault | complete/drain run then drop; reset scripts |

### 8.2 Command data bundles: 26/26

| Dataset / TC | Canonical seed / builder | 独立 mutation / fault data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-FLOW-C-001` / `TC-CH-CMD-001` | valid intake、typed external-source candidate/resolution、absent identity key/review，Created + ReviewFactAttached atomic set | invalid candidate/source；Resolved/Unresolved variants；same/different digest duplicate；each UoW phase fault | `identity_key/operation_key`；drop run + reset resolver/UoW |
| `DS-CH-FLOW-C-002` / `TC-CH-CMD-002` | current exact identity + loaded expected version + body-free correction producing final Active | wrong target、stale/terminal、exact no-op、two-writer loser、intermediate CorrectionPending exposure probe | `identity_ref/version`；drop run + reset race/UoW |
| `DS-CH-FLOW-C-003` / `TC-CH-CMD-003` | nonterminal current identity/version with no blocking contradiction | stale/already Retired/wrong owner/current-registry guard；cascade-delete trap rows | `identity_ref/version`；drop run |
| `DS-CH-FLOW-C-004` / `TC-CH-CMD-004` | exact identity + body-free Recorded review; variants with/without prior current review | raw approval/vote/policy body、wrong identity、terminal review、duplicate/current-index race | `identity_ref/review_ref`；drop run + delete dummy body corpus |
| `DS-CH-FLOW-C-005` / `TC-CH-CMD-005` | Active identity + absent registry current key；canonical registry input | missing/terminal identity、unique winner race、body-bearing registry candidate | `identity_ref/registry_key`；drop run + reset race |
| `DS-CH-FLOW-C-006` / `TC-CH-CMD-006` | current registry/version and every public lifecycle target | complete current/reserved/illegal `SP-CH-REGISTRY_*` subset、stale/terminal/wrong owner | `registry_ref/pair_id`；drop run |
| `DS-CH-FLOW-C-007` / `TC-CH-CMD-007` | current registry + exact old/new visibility basis and affected-material set | exact no-op、wrong source/applicability、terminal、stale；dedup/permutation set vectors | `registry_ref/basis_revision`；drop run |
| `DS-CH-FLOW-C-008` / `TC-CH-CMD-008` | nonterminal current registry/version and preserved linked identity/history | already Retired、wrong owner、active-exposure redline、cascade-retire trap | `registry_ref/version`；drop run |
| `DS-CH-FLOW-C-009` / `TC-CH-CMD-009` | eligible registry + absent descriptor key + typed body-free MCP/A2A/API descriptor refs | missing registry、forbidden provider/body/credential fields、unique race、Accepted/Unresolved resolver outcomes | `registry_ref/descriptor_key`；drop run + reset resolver |
| `DS-CH-FLOW-C-010` / `TC-CH-CMD-010` | current Accepted/Unresolved predecessor + new typed descriptor candidate | wrong predecessor/owner、terminal/stale、same/new ID misuse、unique race、raw provider material | `descriptor_ref/replacement_key`；drop run + reset race |
| `DS-CH-FLOW-C-011` / `TC-CH-CMD-011` | current descriptor + Available/Partial safe risk summary; optional prior current summary | unknown risk、superseded/wrong descriptor、dummy raw assessment/policy/provider body | `descriptor_ref/summary_ref`；drop run + delete dummy corpus |
| `DS-CH-FLOW-C-012` / `TC-CH-CMD-012` | current descriptor + typed secret ref + symmetric resolver result + body-free safe summary | unavailable/ref-kind-subject-digest mismatch、Forbidden、dummy credential/cert/key、Port asymmetry | `descriptor_ref/secret_ref`；drop run + reset resolver + delete corpus |
| `DS-CH-FLOW-C-013` / `TC-CH-CMD-013` | exact identity/review + typed governance ref/state forming final Active/Unresolved relation | missing/invalid review、owner/kind mismatch、Forbidden、dummy approval/vote/policy/workflow body | `identity_ref/governance_ref`；drop run + delete corpus |
| `DS-CH-FLOW-C-014` / `TC-CH-CMD-014` | current allowed seam + exact predecessor ref/state/version + new typed ref | wrong prior/source/owner、terminal/stale、approval mutation、new relation unique race | `seam_ref/replacement_key`；drop run |
| `DS-CH-FLOW-C-015` / `TC-CH-CMD-015` | expirable current seam + safe reason/source version | terminal/wrong owner/stale/illegal source；governance approval revoke trap | `seam_ref/version`；drop run |
| `DS-CH-FLOW-C-016` / `TC-CH-CMD-016` | exact identity + body-free method asset ref/kind/locator and Active/Unresolved resolution | wrong subject/kind、Forbidden、dummy method body/source/version/publication material | `identity_ref/method_asset_ref`；drop run + delete corpus |
| `DS-CH-FLOW-C-017` / `TC-CH-CMD-017` | current Active/Unresolved method relation/version | wrong subject、already Removed/terminal、stale、method deletion/cascade trap | `relation_ref/version`；drop run |
| `DS-CH-FLOW-C-018` / `TC-CH-CMD-018` | mutually symmetric Active identity、eligible registry/descriptor/seam/method/ref states and absent exposure key | remove/partial/terminal/mismatched source prerequisite one at a time；unique race；runtime/SDK/listing fields | `capability_ref/exposure_key`；drop run + reset race |
| `DS-CH-FLOW-C-019` / `TC-CH-CMD-019` | loaded exposure + visibility exact versions/source relation + policy-only applicability delta | exact no-op、wrong source revision/scope、stale、all applicable state pairs、runtime authorization field | `exposure_ref/visibility_ref/pair_id`；drop run |
| `DS-CH-FLOW-C-020` / `TC-CH-CMD-020` | suspendable exposure + matching visibility and loaded versions | illegal/terminal/source mismatch/stale；runtime invocation-cancellation trap | `exposure_ref/visibility_ref`；drop run |
| `DS-CH-FLOW-C-021` / `TC-CH-CMD-021` | retireable exposure + source-symmetric visibility loaded versions | terminal/wrong source/stale；SDK package/client/cache and listing cascade traps | `exposure_ref/visibility_ref`；drop run |
| `DS-CH-FLOW-C-022` / `TC-CH-CMD-022` | exact committed change + trace + subject + body-free impact candidate | missing/wrong trace/source/subject、synthetic observer-derived impact、consumer-feedback/evidence body | `change_ref/trace_ref/impact_key`；drop run + delete corpus |
| `DS-CH-FLOW-C-023` / `TC-CH-CMD-023` | exact trace + optional resolved audit ref + each local-only/accepted/failed/unavailable body-free handoff summary | gap/superseded/wrong audit ref、raw audit/evidence/signoff body、post-Durable handoff fault | `trace_ref/handoff_revision`；drop run + reset Port |
| `DS-CH-FLOW-C-024` / `TC-CH-CMD-024` | registered subject/kind/current canonical reference state; different-state and same-value reason delta | all eight kind policy matrices、same exact no-op、terminal/wrong kind/body、stale version | `subject_ref/kind/state_revision`；drop run + reset resolver |
| `DS-CH-FLOW-C-025` / `TC-CH-CMD-025` | typed body-free external-document candidate/resolver + optional exact descriptor ref | document/schema/guide body、wrong kind/digest/owner、Forbidden、resolver asymmetry、duplicate | `document_ref/operation_key`；drop run + reset resolver + delete corpus |
| `DS-CH-FLOW-C-026` / `TC-CH-CMD-026` | exact closed RuntimeToolsConsumer or SdkConsumer variant + typed resolver outcome | cross-union/kind/scope、Forbidden、runtime execution/result or SDK client/cache/package material | `consumer_ref/union_kind`；drop run + reset resolver + delete corpus |

Command stop-review：26/26 `DS-CH-FLOW-C-*` 各自保留 exact owner/key/version/UoW；same/different digest、stale/unique、forbidden-body、commit Unknown和post-Durable分支均可独立构造；共享 Command script 未合并 canonical DS。

### 8.3 Query data bundles: 33/33

所有 Query DS 都组合 `TD-CH-STORE` 的 read seed 与 write/Clock/ID/resolver/collaboration call spies。`missing` 是正式 absence，`degraded` 是正式 typed material，不得通过额外 read、fallback 或 repair 改写。

| Dataset / TC | Canonical read seed | 独立 branch / corruption data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-FLOW-Q-001` / `TC-CH-QUERY-001` | visible exact identity row with owner/version and matching view semantics | visible missing、NotVisible、degraded、loaded owner/version/state contradiction | `identity_ref/case_id`；drop read seed + reset write spies |
| `DS-CH-FLOW-Q-002` / `TC-CH-QUERY-002` | scope-bound identities in exact order with first/next pages and opaque cursor | empty、NotVisible、degraded、invalid/foreign/tampered cursor、unstable-order trap | `scope_ref/page_case`；drop seed + reset spies |
| `DS-CH-FLOW-Q-003` / `TC-CH-QUERY-003` | visible identity + present/absent review + optional formal exposure semantics | invalid owner/current-index pair、approval-like dummy input、degraded visibility | `identity_ref/review_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-004` / `TC-CH-QUERY-004` | identity-linked current registry and separate retired history row | visible missing、retired-only、owner/current-index mismatch、degraded | `identity_ref/registry_ref`；drop seed |
| `DS-CH-FLOW-Q-005` / `TC-CH-QUERY-005` | scope-bound registry rows with exact order/page continuation | empty、NotVisible、degraded、invalid/foreign cursor、retired inclusion trap | `scope_ref/page_case`；drop seed |
| `DS-CH-FLOW-Q-006` / `TC-CH-QUERY-006` | visible registry + matching basis/exposure/visibility source versions | optional absent、source mismatch、NotVisible、Partial/Unavailable and corrupt owner pair | `registry_ref/source_revision`；drop seed |
| `DS-CH-FLOW-Q-007` / `TC-CH-QUERY-007` | current Accepted and Unresolved descriptor rows, body-free refs only | absent、Replaced/Retired current-index contradiction、dummy provider body and provider-call trap | `descriptor_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-008` / `TC-CH-QUERY-008` | current descriptor + Available/Partial/Unavailable summary variants | absent、Superseded-as-current、wrong owner/ref、dummy raw risk body | `descriptor_ref/summary_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-009` / `TC-CH-QUERY-009` | registered descriptor/secret ref + available/unavailable safe summary | NotVisible、Forbidden、redacted、owner/ref mismatch、dummy secret material | `descriptor_ref/secret_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-010` / `TC-CH-QUERY-010` | capability-bound current Accepted/Unresolved descriptors in exact order | empty、degraded、invalid cursor、wrong capability and terminal inclusion traps | `capability_ref/page_case`；drop seed |
| `DS-CH-FLOW-Q-011` / `TC-CH-QUERY-011` | current/nonterminal governance seam + typed governance ref/state | absent、Expired/Replaced/Forbidden current contradiction、dummy approval body | `identity_ref/seam_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-012` / `TC-CH-QUERY-012` | independent identity/review and governance seam presence matrix | all four present/absent combinations、conflicting approval-like data、owner mismatch | `identity_ref/separation_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-013` / `TC-CH-QUERY-013` | Active/Unresolved/Removed method relation and body-free method ref variants | absent、wrong subject/kind、Forbidden/current-index contradiction、dummy method body | `identity_ref/relation_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-014` / `TC-CH-QUERY-014` | kind-bound relation collection with exact order/page cursor | empty、wrong-kind member、degraded、invalid cursor、cross-owner row | `subject_ref/kind/page_case`；drop seed |
| `DS-CH-FLOW-Q-015` / `TC-CH-QUERY-015` | current exposure plus optional matching visibility for every public state surface | pending/suspended/retired/unavailable、absent、source/version asymmetry | `exposure_ref/state_case`；drop seed |
| `DS-CH-FLOW-Q-016` / `TC-CH-QUERY-016` | exact exposure source version + typed applicability scope and visibility | mismatch、Partial/NotVisible/Unavailable、wrong scope、corrupt source relation | `exposure_ref/scope_case`；drop seed |
| `DS-CH-FLOW-Q-017` / `TC-CH-QUERY-017` | final Ready/Partial controlled view with exact source versions | Stale/Unavailable、absent、rebuild marker、corrupt owner/source; repair-call trap | `consumer_view_ref/freshness_case`；drop seed |
| `DS-CH-FLOW-Q-018` / `TC-CH-QUERY-018` | registered runtime/tools consumer + consumer-bound view/page | unregistered consumer、NotVisible、degraded、wrong consumer/scope、runtime-call trap | `consumer_ref/page_case`；drop seed |
| `DS-CH-FLOW-Q-019` / `TC-CH-QUERY-019` | exact SDK consumer ref + exposure/method dual-subject resolution inputs | NotVisible/degraded、wrong relation/union/source、dummy SDK client/cache/package data | `sdk_consumer_ref/case_id`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-020` / `TC-CH-QUERY-020` | append-only trace revisions with current/historical refs and exact page order | empty、degraded、invalid cursor、gap/current-index asymmetry、rewrite trap | `trace_ref/page_case`；drop seed |
| `DS-CH-FLOW-Q-021` / `TC-CH-QUERY-021` | exact change- or trace-linked impact in Identified/Partial/Delayed/Resolved surfaces | missing、synthetic/log-derived relation、wrong trace/subject、corrupt version | `impact_ref/state_case`；drop seed |
| `DS-CH-FLOW-Q-022` / `TC-CH-QUERY-022` | body-free downstream feedback summary with exact consumer/impact refs | Partial/Unavailable/absent、consumer/ref mismatch、dummy execution/result body | `impact_ref/consumer_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-023` / `TC-CH-QUERY-023` | trace/audit refs and state with optional body-free handoff summary | no handoff、Unavailable/Failed、wrong ref/state、dummy audit/evidence body | `trace_ref/audit_ref`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-024` / `TC-CH-QUERY-024` | freshness-aware directory search projection with exact filter/order/cursor | stale/unavailable/empty、invalid cursor/filter、ranking/listing pollution | `directory_ref/search_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-025` / `TC-CH-QUERY-025` | browse-specific directory page and order distinct from search filter | stale/empty/unavailable、invalid cursor、search-filter reuse trap | `directory_ref/browse_case`；drop seed |
| `DS-CH-FLOW-Q-026` / `TC-CH-QUERY-026` | body-free saved audit export summary in Ready/Partial/Stale/Unavailable surfaces | absent、wrong scope/ref/version、dummy archive/evidence/signoff body | `audit_export_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-027` / `TC-CH-QUERY-027` | read-only ecosystem discovery Ready/Partial/Stale/Unavailable summaries | absent、wrong applicability/source、marketplace listing/ranking/price pollution | `discovery_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-028` / `TC-CH-QUERY-028` | immutable reconciliation reports for five formation outcomes and exact scope/refs | declared missing path、duplicate ID、wrong scope/result ref、corrupt reason/state symmetry | `report_ref/outcome_case`；drop seed |
| `DS-CH-FLOW-Q-029` / `TC-CH-QUERY-029` | eight kind-specific canonical reference rows across all applicable values | wrong kind/subject/digest、terminal resolver trap、body-bearing row、owner/version corruption | `kind/subject_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-030` / `TC-CH-QUERY-030` | registered body-free external document ref in Resolved/Invalid/Forbidden/Unavailable values | wrong document kind/digest/owner、dummy document/schema/guide body | `document_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-031` / `TC-CH-QUERY-031` | exact RuntimeToolsConsumer union refs across resolved/nonresolved/unavailable values | wrong union/kind/subject、Forbidden、dummy execution/tool result/runtime state | `consumer_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-032` / `TC-CH-QUERY-032` | exact SdkConsumer union refs across unresolved/forbidden/unavailable/resolved | cross-union、wrong subject/scope、dummy SDK client/cache/package material | `sdk_consumer_ref/state_case`；drop seed + delete corpus |
| `DS-CH-FLOW-Q-033` / `TC-CH-QUERY-033` | exact ObservabilityAudit ref/state with body-free historical/current safe metadata | unavailable/forbidden/wrong owner/kind、dummy log/span/metric/alert/audit body | `audit_ref/state_case`；drop seed + delete corpus |

Query stop-review：33/33 read datasets包含formal hit/missing/empty/degraded/corrupt branch，page类有stable order和invalid cursor；所有分支绑定write/Clock/ID/resolver/collaboration spy且期望调用为0，未使用Query repair或current-truth reconstruction。

### 8.4 Inbound data bundles: 6/6

| Dataset / TC | Canonical envelope / seed | 独立 mutation / fault data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-FLOW-I-001` / `TC-CH-INBOUND-001` | governance source actor/header/body-free ref+safe summary、matching resolver、absent receipt | unavailable/no-change/wrong actor/body/summary asymmetry/new Forbidden、same/different digest duplicate、UoW faults | `source/message_key/operation_key`；drop receipt/run + reset resolver |
| `DS-CH-FLOW-I-002` / `TC-CH-INBOUND-002` | method asset kind/locator/ref canonical bytes + matching resolver | unavailable/no-change/wrong target/kind/digest、method body/source code、duplicate/conflict | `source/message_key/asset_ref`；drop + reset resolver + delete corpus |
| `DS-CH-FLOW-I-003` / `TC-CH-INBOUND-003` | exact impact revision + registered closed consumer union + body-free feedback | temporary missing/wrong actor、execution payload、no-change、accepted Delayed vs processing Delayed、duplicate | `source/message_key/impact_ref`；drop + reset resolver |
| `DS-CH-FLOW-I-004` / `TC-CH-INBOUND-004` | external capability source candidate/locator + exact resolver state | wrong subject/actor/digest、provider/request/runtime body、digest collision、duplicate | `source/message_key/candidate_ref`；drop + reset resolver + delete corpus |
| `DS-CH-FLOW-I-005` / `TC-CH-INBOUND-005` | typed audit locator/ref/state body-free envelope | unavailable/no-change/wrong actor、raw log/span/metric/alert/audit/evidence body、duplicate | `source/message_key/audit_ref`；drop + reset resolver + delete corpus |
| `DS-CH-FLOW-I-006` / `TC-CH-INBOUND-006` | typed external-document kind/locator/ref body-free envelope | unavailable/no-change/wrong target/digest/actor、document/schema/guide body、duplicate | `source/message_key/document_ref`；drop + reset resolver + delete corpus |

Inbound stop-review：6/6 均有 header-first envelope、canonical digest、source actor、receipt winner和formal resolver script；same/different digest、Delayed/Rejected/Quarantined和body corpus互相隔离，follow-up 只形成正式 marker，不自动执行 Command。

### 8.5 Outbound data bundles: 10/10

每条 Outbound DS 都有三个互不合并的脚本：`A(source UoW)`、`B(post-Durable Port)`、`C(short bind UoW)`。A 的 candidate、immutable bytes、snapshot、capture共享 exact five-tuple；B 只读 official stored snapshot；C 只接受 B 返回的stable intent。

| Dataset / TC | Exact Durable source / snapshot | 独立 A/B/C fault and boundary data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-FLOW-O-001` / `TC-CH-OUTBOUND-001` | exact identity change + body-free `CapabilityIdentityChanged` snapshot/capture | wrong variant/version/body；A each write/commit tri-state；B five statuses/raw fault；C race/Unknown | `source_ref/snapshot_ref/capture_ref`；drop + reset Port/UoW |
| `DS-CH-FLOW-O-002` / `TC-CH-OUTBOUND-002` | exact registry change only + immutable registry event snapshot | reconciliation-report/source mismatch；all A/B/C branches；listing/runtime pollution | same three refs；drop + reset scripts |
| `DS-CH-FLOW-O-003` / `TC-CH-OUTBOUND-003` | exact descriptor change + body-free descriptor snapshot | provider/secret/credential/body candidate；all A/B/C branches and intent asymmetry | same three refs；drop + reset + delete corpus |
| `DS-CH-FLOW-O-004` / `TC-CH-OUTBOUND-004` | exact governance seam relation change snapshot | approval/policy/vote/workflow body；all A/B/C branches | same three refs；drop + reset + delete corpus |
| `DS-CH-FLOW-O-005` / `TC-CH-OUTBOUND-005` | exact method relation change + body-free asset refs | method body/source/version/publication material；all A/B/C branches | same three refs；drop + reset + delete corpus |
| `DS-CH-FLOW-O-006` / `TC-CH-OUTBOUND-006` | exact exposure/visibility change and source revision snapshot | runtime allow/deny/execution、SDK client/cache/package、listing material；all A/B/C | same three refs；drop + reset + delete corpus |
| `DS-CH-FLOW-O-007` / `TC-CH-OUTBOUND-007` | exact controlled-view availability revision snapshot | wrong source/version/current-read rebuild/cache ownership；all A/B/C | same three refs；drop + reset scripts |
| `DS-CH-FLOW-O-008` / `TC-CH-OUTBOUND-008` | exact identified impact revision snapshot | synthetic/log-derived/current-truth impact、evidence body；all A/B/C | same three refs；drop + reset + delete corpus |
| `DS-CH-FLOW-O-009` / `TC-CH-OUTBOUND-009` | exact one-of-four derived material ref/state/version snapshot | controlled-view/wrong variant、listing/ranking/marketplace data；all A/B/C | same three refs + material kind；drop + reset |
| `DS-CH-FLOW-O-010` / `TC-CH-OUTBOUND-010` | exact canonical reference state revision/kind/source snapshot | wrong kind/digest/subject、raw external body、repair trap；all A/B/C | same three refs + reference kind；drop + reset + delete corpus |

Outbound stop-review：10/10 都保留 A/B/C 独立 identity 和 UoW；external `EventCollaborationStatus` 五值来自 Port script，本地状态 seed/row 数固定为0；raw B failure不猜typed status，C race不覆盖winner。

### 8.6 Job data bundles: 8/8

| Dataset / TC | Frozen plan / target seed | 独立 target / crash / recovery data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-FLOW-J-001` / `TC-CH-JOB-001` | frozen registry/snapshot scope、stable ordinal targets、consistent/partial/inconsistent/rebuild-required/failure findings | pre-entry、each target fault、unsafe terminalization、initial/target/final UoW crash、same/different digest replay | `job_run_key/plan_ref/ordinal`；finish/drain then drop |
| `DS-CH-FLOW-J-002` / `TC-CH-JOB-002` | frozen exposure/consumer targets + source versions for Ready/Partial/no-op/missing | target build/save/capture faults、rollback/Unknown、crash/reentry、current-scope drift trap | same keys；drop + reset scripts |
| `DS-CH-FLOW-J-003` / `TC-CH-JOB-003` | frozen truth snapshot and deterministic directory targets/order | Ready/no-op/missing/fault、ranking/listing pollution、each crash/reentry boundary | same keys；drop + reset scripts |
| `DS-CH-FLOW-J-004` / `TC-CH-JOB-004` | frozen trace/scope/ref targets for body-free audit export | Ready/Partial/Unavailable/no-op、raw audit/evidence body、fault/crash and report symmetry | same keys；drop + delete corpus |
| `DS-CH-FLOW-J-005` / `TC-CH-JOB-005` | frozen formal applicability/source targets for discovery summary | Ready/Partial/Unavailable/no-op/failure、marketplace data、fault/crash/reentry | same keys；drop + reset scripts |
| `DS-CH-FLOW-J-006` / `TC-CH-JOB-006` | frozen material scope/versions and Unchanged/mismatch finding vectors | five report formation outcomes、target faults、nested rebuild trap、crash/replay/corrupt report | same keys + report ref；drop + reset scripts |
| `DS-CH-FLOW-J-007` / `TC-CH-JOB-007` | complete frozen 8-kind reference targets with current state/digest/source | Updated/Unchanged/terminal skipped/preclassified failed、resolver asymmetry/fault、body probe、crash | same keys + kind；drop + reset resolver |
| `DS-CH-FLOW-J-008` / `TC-CH-JOB-008` | frozen AwaitingIntent capture/snapshot/official bytes/stable intent targets | same intent/different intent、five external statuses、bind CAS race、A absent trap、commit tri-state/crash/reentry | same keys + capture/intent ref；drop + reset collaboration/UoW |

Job stop-review：8/8 有complete frozen plan、stable ordinal、initial/each-target/final UoW和same result/report ref；unsafe codec/consistency/rollback/Unknown保持target `Planned`，不会用failure fixture伪造terminal outcome；reentry不重扫、不重跑terminal target。

### 8.7 Flow family closure

| Family | DS count | Required exact identity | Stop-review result |
|---|---:|---|---|
| Command | 26 | `DS-CH-FLOW-C-001..026` | closed-designed |
| Query | 33 | `DS-CH-FLOW-Q-001..033` | closed-designed; write/call spies mandatory |
| Inbound | 6 | `DS-CH-FLOW-I-001..006` | closed-designed; receipt/digest/source isolated |
| Outbound | 10 | `DS-CH-FLOW-O-001..010` | closed-designed; A/B/C independent |
| Job | 8 | `DS-CH-FLOW-J-001..008` | closed-designed; frozen plan and UoW recovery preserved |
| **total** | **83** | **83/83 exact flow DS** | **no merged canonical identity** |

## 9. State canonical data bundles and full pair source

### 9.1 `SP-CH-*` generation source contract

`SP-CH-*` 是 planned parameter identity，不是测试结果。future registry generator必须读取本节固定的 ordered variant set，并逐 pair 复制 `03_ddd_step_10_state_matrix.md` 所列 exact裁决。生成规则如下：

```text
for each mutable_or_external_family in S01..S23:
    for each ordered (from_variant, to_variant), where from_variant != to_variant:
        pair_id = SP-CH-<FAMILY>-<FROM>-<TO>
        classification/callable/flow/error/effect/source = exact Step 10 row

for ReferenceResolutionValue:
    pair_id = SP-CH-REFERENCE-<KIND>-<FROM>-<TO>
    applicable variant set is kind-specific

ReconciliationReportState:
    no SP row; generate five formation vectors under DS-CH-STATE-024
```

每条物化 parameter record 必须包含 Step 6 §10.2 的全部字段，并增加：

| 字段 | 数据合同 |
|---|---|
| `dataset_id` | owning `DS-CH-STATE-001..023` |
| `parameter_id` | exact `SP-CH-*`；全局唯一 |
| `owner_seed` | exact owner/ref/version/current-index/UoW或external Port observation seed |
| `trigger_input` | exact callable input；reserved/illegal无current integration route时为guard input |
| `expected_delta` | current row的field/version/time/history/capture/material/call delta |
| `expected_zero_effect` | reserved/illegal row的all-zero probe profile |
| `cleanup_profile` | local owner drop-run；external status reset Port script；无local status row |

禁止事项：

- 不得按 family 抽样、随机挑 pair 或只覆盖每个 variant 一次；
- 不得因 future implementation 缺 callable 而把 `current` 改成 `reserved/illegal`；
- 不得因 domain member 已存在而把 `reserved` 改成 `current`；
- 不得从错误文本、日志、coverage 或实际 pass/fail 反推 classification；
- 不得把 same-state delta/no-op、formation、terminal payload replacement计入638；它们是各 DS 的额外 scenario；
- 不得创建旧 denominator `304 illegal`；registry gate必须拒绝任何非 `301` 值。

### 9.2 Exact family source and arithmetic

| DS / TC / family / exact ordered variants | Normative source | current | reserved | illegal | pair total | Additional data |
|---|---|---:|---:|---:|---:|---|
| `DS-CH-STATE-001` / `TC-CH-STATE-001`;`CapabilityIdentityState`: Candidate, Active, CorrectionPending, Unresolved, Retired | Step 10 §§15/18 | 6 | 4 | 10 | 20 | 3 accepted + 3 rejected formation；review-link delta/no-op；terminal rewrite |
| `DS-CH-STATE-002` / `TC-CH-STATE-002`;`CapabilityAccessReviewFactState`: Draft, Recorded, Superseded, Invalidated | §§16/18 | 2 | 2 | 8 | 12 | Draft transaction-local；replacement/current-index；same duplicate |
| `DS-CH-STATE-003` / `TC-CH-STATE-003`;`RegistryLifecycleState`: Draft, Registered, Undescribed, Ungoverned, VisibilityPending, FormalVisible, Retired | §§17/18 | 17 | 2 | 23 | 42 | direct Registered formation；basis/descriptor/exposure effects；no-op |
| `DS-CH-STATE-004` / `TC-CH-STATE-004`;`AdapterDescriptorState`: Draft, Accepted, Unresolved, Replaced, Retired | §§20/25 | 4 | 5 | 11 | 20 | Draft in-memory formation；replacement；risk/secret attachment delta |
| `DS-CH-STATE-005` / `TC-CH-STATE-005`;`DescriptorRiskConstraintSummaryState`: Available, Partial, Unavailable, Superseded | §§21/25 | 3 | 6 | 3 | 12 | state-specific safe-summary formation；replacement；forbidden body |
| `DS-CH-STATE-006` / `TC-CH-STATE-006`;`SecretHandlingSafeSummaryState`: Available, Stale, Unavailable, Forbidden | §§22/25 | 0 | 9 | 3 | 12 | Available/Unavailable formation；ref symmetry；dummy secret body trap |
| `DS-CH-STATE-007` / `TC-CH-STATE-007`;`GovernanceSeamState`: Pending, Active, Unresolved, Expired, Replaced, Forbidden | §§23/25 | 6 | 11 | 13 | 30 | Pending in-memory formation；expiry/replacement；approval pollution |
| `DS-CH-STATE-008` / `TC-CH-STATE-008`;`CapabilityMethodRelationState`: Pending, Active, Stale, Removed, Unresolved, Forbidden | §§24/25 | 4 | 13 | 13 | 30 | Pending in-memory formation；remove；method body/source pollution |
| `DS-CH-STATE-009` / `TC-CH-STATE-009`;`FormalExposureState`: Draft, Pending, Accepted, Active, Suspended, Unavailable, Retired | §§28/33 | 16 | 0 | 26 | 42 | Draft in-memory；prerequisite recovery/degrade/suspend/retire；no authorization data |
| `DS-CH-STATE-010` / `TC-CH-STATE-010`;`FormalVisibilityState`: NotVisible, Pending, Visible, Unavailable, Retired | §§29/33 | 9 | 4 | 7 | 20 | source-version/applicability；same-state reevaluation；policy-only inputs |
| `DS-CH-STATE-011` / `TC-CH-STATE-011`;`TraceabilityState`: Recorded, Partial, HandoffPending, Superseded | §§30/33 | 2 | 7 | 3 | 12 | formation；HandoffPending same-state next revision；post-commit summary |
| `DS-CH-STATE-012` / `TC-CH-STATE-012`;`CapabilityImpactState`: Identified, Partial, Delayed, Ignored, Resolved | §§31/33 | 0 | 10 | 10 | 20 | Identified formation；all existing-state integration effects remain zero |
| `DS-CH-STATE-013` / `TC-CH-STATE-013`;`DownstreamImpactSummaryState`: Received, Partial, Delayed, Unavailable, Ignored | §§32/33 | 0 | 13 | 7 | 20 | five state-specific factories；new event/new summary；body-free feedback |
| `DS-CH-STATE-014` / `TC-CH-STATE-014`;`ConsumerViewFreshnessState`: Ready, Partial, Stale, Rebuilding, Unavailable | §§36/41 | 12 | 7 | 1 | 20 | Ready/Partial formation；same-state changed/exact-no-op；source versions |
| `DS-CH-STATE-015` / `TC-CH-STATE-015`;`DirectoryProjectionState`: Ready, Stale, Rebuilding, Unavailable | §§37/41 | 6 | 5 | 1 | 12 | Ready formation；refresh/stale/no-op；stable order/facets |
| `DS-CH-STATE-016` / `TC-CH-STATE-016`;`AuditExportState`: Ready, Partial, Unavailable, Stale | §§38/41 | 12 | 0 | 0 | 12 | all final formations；same-state/no-op；body-free resolved-ref subset |
| `DS-CH-STATE-017` / `TC-CH-STATE-017`;`EcosystemDiscoveryState`: Ready, Partial, Unavailable, Stale | §§39/41 | 12 | 0 | 0 | 12 | all final formations；`is_listing_truth=false`；same-state/no-op |
| `DS-CH-STATE-018` / `TC-CH-STATE-018`;`ReferenceResolutionValue`: kind-specific Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden; GovernanceResult adds Expired | §§43~52 | 116 | 0 | 136 | 252 | initial subsets；same-value reason revision/no-op；subject/kind/digest/body guards |
| `DS-CH-STATE-019` / `TC-CH-STATE-019`;`CapabilityEventCaptureState`: Captured, IntentBound | §§55/57 | 1 | 0 | 1 | 2 | formation；same/different intent reentry；five external outcomes orthogonal |
| `DS-CH-STATE-020` / `TC-CH-STATE-020`;`CapabilityIdempotencyState`: Reserved, Completed | §§60/63 | 1 | 0 | 1 | 2 | reserve formation；same/different digest；winner/result symmetry；no persisted Conflict |
| `DS-CH-STATE-021` / `TC-CH-STATE-021`;`CapabilityJobExecutionState`: Planned, Finalized | §§61/63 | 1 | 0 | 1 | 2 | complete plan formation；target progression；all-terminal/final rollback/reentry |
| `DS-CH-STATE-022` / `TC-CH-STATE-022`;`CapabilityJobExecutionTargetOutcome`: Planned, Succeeded(_), Failed(_), Skipped(_) | §§62/63 | 3 | 0 | 9 | 12 | ordinal formation；payload symmetry；race；unsafe failure remains Planned |
| `DS-CH-STATE-023` / `TC-CH-STATE-023`;external `EventCollaborationStatus`: Candidate, PendingDelivery, Delivered, Failed, HandoffUnavailable | §§56/57 | 6 | 0 | 14 | 20 | Port-owned observation/get/list/repair scripts；local persistence count=0 |
| `DS-CH-STATE-024` / `TC-CH-STATE-024`;immutable `ReconciliationReportState`: Completed, Partial, Inconsistent, RebuildRequired, Failed | §§40/41 | n/a | n/a | n/a | 0 | exactly 5 formation vectors；no mutable pair |
| **Total** | **24 families / 111 active variants** | **239** | **98** | **301** | **638** | **plus 5 immutable report formations** |

### 9.3 Reference kind parameter source: 252/252

| Kind token | Exact applicable ordered variants | current | illegal | pair identities |
|---|---|---:|---:|---|
| `EXTERNAL_CAPABILITY_SOURCE` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-EXTERNAL_CAPABILITY_SOURCE-<FROM>-<TO>` = 30 |
| `GOVERNANCE_RESULT` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden, Expired | 18 | 24 | `SP-CH-REFERENCE-GOVERNANCE_RESULT-<FROM>-<TO>` = 42 |
| `METHOD_ASSET` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-METHOD_ASSET-<FROM>-<TO>` = 30 |
| `SECRET` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-SECRET-<FROM>-<TO>` = 30 |
| `EXTERNAL_DOCUMENT` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-EXTERNAL_DOCUMENT-<FROM>-<TO>` = 30 |
| `RUNTIME_TOOLS_CONSUMER` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-RUNTIME_TOOLS_CONSUMER-<FROM>-<TO>` = 30 |
| `SDK_CONSUMER` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-SDK_CONSUMER-<FROM>-<TO>` = 30 |
| `OBSERVABILITY_AUDIT` | Resolved, Unresolved, Stale, Unavailable, Invalid, Forbidden | 14 | 16 | `SP-CH-REFERENCE-OBSERVABILITY_AUDIT-<FROM>-<TO>` = 30 |
| **Total** | **49 kind-applicable mentions / 7 enum variants** | **116** | **136** | **252 unique IDs; reserved=0** |

### 9.4 Owner seed, action, and zero-effect profiles

| Pair class / branch | Required owner data | Action input | Required effect probe |
|---|---|---|---|
| `current` local | exact owner object, typed refs, current index, expected version, Clock vector and declared related rows | exact owner callable or policy path from Step 10 | target fields、version/time/history/capture/material/UoW exact delta；unrelated owners zero |
| `current` external | no local status row；external Port script exposes exact current item/source/intent/reason | exact collaborate/get/list/repair operation | typed external status only；local repository/status/attempt/queue/DLQ writes zero |
| `reserved` | valid current owner value and guard-level input; integration route absent | owner member only if Step 10 names it; otherwise static route/callability probe | route/call count、save、version、Clock、history、trace、capture、material、result、external effect all zero |
| `illegal` | valid current owner value + exact illegal target; terminal rows remain historical | formal member/guard attempt | exact closed typed error；all fields and all probes byte/count unchanged |
| formation accepted | owner-specific exact required/optional fields and initial subset | formal factory | exact initial variant/version/ref/time and first-persistence rule |
| formation rejected | wrong owner/kind/ref/body/initial variant or missing required field | formal factory | typed rejection；ID/Clock/object/repository/UoW/Port all zero |
| same-state delta | state same, at least one formal comparison field changed | exact owner member | exact version+1 and declared field/history/capture delta only |
| same-state no-op | state and all formal comparison fields equal | exact owner member or completed replay | all effects zero and stored replay/no-op surface exact |
| terminal/payload | terminal source or terminal same-variant payload replacement | exact attempted owner member | terminal rejection；new valid fact requires new object/run/relation identity |

### 9.5 Immutable report formation vectors

`DS-CH-STATE-024` owns exactly five data vectors:

| Formation parameter | Finding/reason contract | Result identity | Zero-effect contract |
|---|---|---|---|
| `RF-CH-COMPLETED` | complete inspected sets, no partial/inconsistent/rebuild/failure; `failure_reason=None` | new report ID/version1 + exact scope/truth/material/source-version/job/result refs | no update/supersede/rebuild/core/material write |
| `RF-CH-PARTIAL` | explicit partial finding; `failure_reason=None` | same immutable identity contract | same zero-effect outside append |
| `RF-CH-INCONSISTENT` | explicit inconsistency finding; `failure_reason=None` | same immutable identity contract | same zero-effect outside append |
| `RF-CH-REBUILD_REQUIRED` | explicit rebuild-required finding; `failure_reason=None` | same immutable identity contract | no nested rebuild or repair |
| `RF-CH-FAILED` | exact safe failure reason `Some`; failed factory path | same immutable identity contract | no fabricated inspected result or material mutation |

Declared no-report path uses no `ReconciliationReportState`; a new run creates a new report ID. Replay reads the matching immutable report and may not append a duplicate or mutate outcome.

### 9.6 State arithmetic and generation gates

```text
pair groups = 74 + 104 + 114 + 56 + 252 + 22 + 16 = 638
classification = 239 current + 98 reserved + 301 illegal = 638
unclassified = 0
state datasets = 24
mutable/external pair-owning datasets = 23
immutable formation outcomes = 5
local EventCollaborationStatus rows = 0
```

The future registry gate must fail on duplicate pair ID、missing pair、extra pair、unknown family/kind/variant、same-state row in denominator、wrong source anchor、classification delta、count delta或old `304` value。State stop-review结论：24/24 DS和638/638 pair identities可机械构造；每条都具有owner seed、exact trigger/guard、typed expected class、zero-effect profile与cleanup；无 sampling、无local collaboration state、无mutable report pair。

## 10. Transaction, binding, observability, and configuration data bundles

### 10.1 Transaction data bundles: 22/22

| Dataset / TC | Canonical seed / script | 独立 fault / concurrency / recovery data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-TX-001` / `TC-CH-TX-001` | 22 trait/110 method exact parameter registry；success/missing/page/order/key/version/index/cursor seeds; fake authority A | per-method CAS/unique/wrong key/index/owner/version/asymmetry；selected durable candidate consumes same manifest only when selected | `trait/method/vector_id`；drop run authority + reset journal |
| `DS-CH-TX-002` / `TC-CH-TX-002` | create/update/append/insert-only valid rows with exact absent/present key、expected version and winner | stale/duplicate/unique collision、insert-as-upsert/update-as-create/append-rewrite traps | `owner_ref/key/version`；drop run |
| `DS-CH-TX-003` / `TC-CH-TX-003` | each declared Command/Inbound/Job target atomic set in one staged UoW with before/after visibility observer | omit/duplicate/reorder member、foreign UoW、partial visibility probe | `tx_ref/flow_id/member`；rollback/drop staged and committed run |
| `DS-CH-TX-004` / `TC-CH-TX-004` | exact same-UoW member sequence for every flow family | fail one save/append/capture/result/complete position at a time; rollback succeeds | `tx_ref/fault_ordinal`；rollback + reset script |
| `DS-CH-TX-005` / `TC-CH-TX-005` | known original pre-commit typed failure plus complete owned prefix | one and multiple ordered rollback causes、cleanup-cause permutations | `tx_ref/cause_ordinal`；reset UoW script/journal |
| `DS-CH-TX-006` / `TC-CH-TX-006` | complete staged UoW and stable commit `NotDurable` return | post-return visibility probes、blind replay trap、rollback result variants if formally invoked | `tx_ref/commit_case`；drop run + reset UoW |
| `DS-CH-TX-007` / `TC-CH-TX-007` | complete staged UoW with commit `Unknown` + same tx ref + barrier | resolve Durable、NotDurable、still Unknown；one-missing/log/timeout guess traps | `tx_ref/resolution_case`；resolve then drop + reset |
| `DS-CH-TX-008` / `TC-CH-TX-008` | absent canonical operation key + digest + typed reservation candidate | concurrent absent reserve winners、allocator/Clock call audit、wrong namespace/key normalization | `operation_namespace/idempotency_key`；drop run + reset race |
| `DS-CH-TX-009` / `TC-CH-TX-009` | local candidate or Job plan staged; reserve returns matching Existing Completed or formal Job Reserved with matching stored surface/journal | duplicate branch for each operation family、staged-effect leakage、recursive entry trap | same operation key + `surface_ref`；drop run |
| `DS-CH-TX-010` / `TC-CH-TX-010` | existing Reserved/Completed winner under same normalized key | different channel/operation/domain/business digest one at a time；same-digest control | `operation_key/collision_vector`；drop run |
| `DS-CH-TX-011` / `TC-CH-TX-011` | Completed record linked to valid immutable result/receipt/report control | missing surface、wrong operation/schema/ref/owner/digest、malformed immutable payload | `operation_key/surface_case`；drop isolated corrupt seed |
| `DS-CH-TX-012` / `TC-CH-TX-012` | committed Reserved Command/Inbound record without matching terminal surface | timeout/reentry/current-truth candidate、synthetic result marker traps | `operation_key/orphan_case`；drop corrupt seed |
| `DS-CH-TX-013` / `TC-CH-TX-013` | exact Job Reserved + Planned journal matching key/digest/job/schema/run and complete frozen plan | each ordinal terminal/already terminal、crash point、matching reentry | `job_run_key/plan_ref/ordinal`；finish or drop run |
| `DS-CH-TX-014` / `TC-CH-TX-014` | symmetric Reserved+Planned control | missing journal、wrong key/digest/job/schema/run、incomplete/duplicate ordinal、result linkage asymmetry | `job_run_key/asymmetry_case`；drop corrupt seed |
| `DS-CH-TX-015` / `TC-CH-TX-015` | two writers load same exact owner/version for mutation、material refresh、intent bind and target terminal families | deterministic winner ordering A/B；CAS conflict at each save; loser retry/overwrite trap | `owner_ref/expected_version/race_id`；join writers + drop run |
| `DS-CH-TX-016` / `TC-CH-TX-016` | stable typed affected-ref list collected before mutation with exact owner/source versions | overlapping/dedup/permuted refs、stale/current/missing/asymmetric rows、rescan trap | `source_ref/affected_set_case`；drop run |
| `DS-CH-TX-017` / `TC-CH-TX-017` | exact Outbound source/snapshot/capture A-phase set and official bytes | fail source/snapshot/capture saves、codec/digest、commit Durable/NotDurable/Unknown、crash after each boundary | `source_ref/tx_ref/fault_ordinal`；resolve/rollback then drop |
| `DS-CH-TX-018` / `TC-CH-TX-018` | Phase A already Durable with official snapshot and Captured local state | collaborate/get timeout、five typed outcomes、raw failure、invalid subject/intent/source response | `capture_ref/port_case`；reset collaboration; local source retained until drop |
| `DS-CH-TX-019` / `TC-CH-TX-019` | same stable intent returned for Captured row and two C-phase bind writers | Durable/NotDurable/Unknown short-UoW outcomes、same/different intent race、winner lookup asymmetry | `capture_ref/intent_ref/race_id`；resolve + drop run |
| `DS-CH-TX-020` / `TC-CH-TX-020` | complete Job request/reservation/frozen plan/ordinal targets/report result graph | crash/fault at initial reserve+plan、every target effect+journal、collaboration、final report/finalize/complete boundary | `job_run_key/phase/ordinal`；recover to declared state then drop |
| `DS-CH-TX-021` / `TC-CH-TX-021` | valid owner/current index/order/page cursor and continuation control | corrupt each owner/index/current/order/cursor link; full-scan/sort/first-row/synthetic ref traps | `repository/method/page_case`；drop isolated corrupt seed |
| `DS-CH-TX-022` / `TC-CH-TX-022` | four digest domains with canonical semantic inputs and field-order permutations | channel/domain/business changes、excluded retry metadata、raw body、codec fault、Debug/pretty/fallback hash traps | `digest_domain/vector_id`；pure vectors |

Transaction stop-review：22/22 DS具有exact transaction/key/version/phase identity；commit `Durable/NotDurable/Unknown`、rollback precedence、winner preservation、stored-surface symmetry、A/B/C和Job initial/target/final均有独立脚本。任何 corrupt seed 只存在于所属 run namespace，不进入后续 happy seed。

### 10.2 Binding data bundles: 12/12

| Dataset / TC | Canonical graph / binding seed | 独立 invalid / fault data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-BIND-001` / `TC-CH-BIND-001` | complete immutable typed root/profile/entry + Stage 0~7 component graph | missing/invalid/unknown/conflicting source；fail each stage and reverse cleanup cause combination | `candidate_ref/stage`；dispose complete owned prefix |
| `DS-CH-BIND-002` / `TC-CH-BIND-002` | Local durable authority + parity fake; Deployment durable candidate row without claiming product | Local second/in-memory authority；Deployment fake or required Disabled；fallback/reduced graph | `profile/candidate_ref`；dispose graph + reset authority |
| `DS-CH-BIND-003` / `TC-CH-BIND-003` | each of 9 external slots in every profile-legal Configured/Fake/explicit Disabled row | Missing、wrong family、dangling ref、profile mismatch、Missing-to-Disabled coercion trap | `profile/slot/binding_case`；reset slot provider |
| `DS-CH-BIND-004` / `TC-CH-BIND-004` | 27 local/base Ports and 22/110 repositories bound to logical authority A/UoW | second store、private finder、wrong UoW、missing/extra method、adapter-opened transaction | `authority_ref/port/method`；drop authority graph |
| `DS-CH-BIND-005` / `TC-CH-BIND-005` | 9 external Ports/14 callables with Configured/Fake parity and formal Disabled response | every typed failure/asymmetry、cross-family fallback、generic result、dummy raw response/body/secret | `slot/callable/binding_case`；reset fake + delete corpus |
| `DS-CH-BIND-006` / `TC-CH-BIND-006` | six exact enabled Worker source tasks parked behind barrier + legal Disabled rows | Missing、header/schema/source/body fault、start/stop/drain/join failure、shutdown input | `source_id/lifecycle_case`；drain/join + reset source |
| `DS-CH-BIND-007` / `TC-CH-BIND-007` | ten exact official snapshot/schema/logical-key/source routes | each missing route、wrong schema/source、wildcard/default/dynamic route、body rebuild/current truth remap | `route_id/snapshot_ref`；reset route registry |
| `DS-CH-BIND-008` / `TC-CH-BIND-008` | eight exact Job name/schema/input/result variant dispatch entries | unknown/cross-variant/generic execute/input coercion/result union mismatch/deadline | `job_variant/dispatch_case`；finish owned invocation + reset |
| `DS-CH-BIND-009` / `TC-CH-BIND-009` | phase matrix for temporary/timeout/permanent/codec/consistency/commit Unknown + formal effect proof true/false | attempts-only proof、unproven mutation retry、generic retry、retry bound exhaustion | `callable/phase/failure/effect_proof`；reset call journal |
| `DS-CH-BIND-010` / `TC-CH-BIND-010` | complete startup/shutdown owned-component order and one accepted invocation | partial start、spawn reject、panic/drop/caller cancel、stop/drain/join failures and ordered causes | `lifecycle_ref/fault_ordinal`；drain/dispose + reset |
| `DS-CH-BIND-011` / `TC-CH-BIND-011` | strict serde/raw bounded header/canonical digest valid vectors | unknown/duplicate/oversize/malformed/map-order、BOM/comment/trailing data、raw-body-before-header trap | `codec/header/vector_id`；pure bytes + clear decode spy |
| `DS-CH-BIND-012` / `TC-CH-BIND-012` | exact compatible `core-contracts` path/version/API metadata candidate | absent/incompatible、copied replacement/compat shim、other sibling import、public third-party leak | `dependency_case_id`；pure static/compile input |

Binding stop-review：12/12 DS保留typed root、profile、27 local Ports、9/14 external、6 sources、10 routes、8 Jobs和Stage 0~7 cardinality；Configured/Fake/Disabled语义不互相fallback，Missing没有可调用 object。真实 provider、credential、endpoint和durable backend仍未选择且未伪造。

### 10.3 Observability data bundles: 12/12

观测数据只读取正式 carrier。capture sink 中的 planned records 是 oracle input/output container，不是 evidence artifact，也不证明真实 backend、alert 或 test execution 存在。

| Dataset / TC | Canonical carrier / profile data | 独立 redaction / sink / boundary data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-OBS-001` / `TC-CH-OBS-001` | 60 exact log profile manifests + each owner/event/terminal carrier with closed allowed fields | required missing、optional missing、forbidden/unprojectable/folded fields、undeclared profile/selector | `profile_id/carrier_case`；clear run capture + delete corpus |
| `DS-CH-OBS-002` / `TC-CH-OBS-002` | 48 metric manifests: 34 Counter/12 Histogram/2 Gauge, exact selector/value/unit/label allowlist | success/error and label permutations、dynamic/high-cardinality trace/ref/text/actor/body/digest/secret labels | `metric_profile/vector_id`；clear capture |
| `DS-CH-OBS-003` / `TC-CH-OBS-003` | 27 span lifecycle manifests + 3 fixed event carriers with exact parent/current/historical links | timeout/caller cancellation/sink failure、missing/synthetic/cross-owner link、duplicate terminal | `span_profile/invocation_ref`；await owner terminal + clear sink |
| `DS-CH-OBS-004` / `TC-CH-OBS-004` | 20 durable-profile carriers after exact Durable with owner/ref/version symmetry | request-local、NotDurable、Unknown、wrong owner/ref、missing carrier、duplicate emission | `durable_profile/tx_ref`；clear capture; business seed drop separately |
| `DS-CH-OBS-005` / `TC-CH-OBS-005` | same exact business carrier and call script under Off and controlled Redacted | observer allocation/redactor/sink/fallback call spies; forbidden source candidate | `business_case/mode`；clear observer + drop business run |
| `DS-CH-OBS-006` / `TC-CH-OBS-006` | each required Redacted field with allowed exact safe source | missing、forbidden、unprojectable、wrong owner and partial-emission trap | `profile/required_field/case`；clear capture + delete corpus |
| `DS-CH-OBS-007` / `TC-CH-OBS-007` | optional absent/present fields and complete atomic historical correlation group | every incomplete group permutation、null/placeholder/synthetic ref | `profile/correlation_case`；clear capture |
| `DS-CH-OBS-008` / `TC-CH-OBS-008` | isolated dummy forbidden corpus by material class | whole actor、dummy secret/document/audit inner IDs、serialized/private/external body and no-echo sink probes | `material_class/leak_case`；delete corpus + clear all sinks |
| `DS-CH-OBS-009` / `TC-CH-OBS-009` | 11 exact count-reader carriers: 4 Inbound + 6 Job + conditional audit-ref | zero/min/max、conditional absent/present、private wrapper/list-length/full-ref reconstruction traps | `reader_id/count_vector`；pure carrier + clear capture |
| `DS-CH-OBS-010` / `TC-CH-OBS-010` | one business carrier per observer plane with independently scripted redactor/sink | rejection/failure before/during each plane、fallback available/unavailable、recursive-failure trap | `plane/fault_ordinal`；reset observer faults/capture |
| `DS-CH-OBS-011` / `TC-CH-OBS-011` | one occurrence eligible for exact log/metric/span/durable projections from same formal carrier | remove each plane、permute observer order、fault each plane、plane-to-plane source trap | `occurrence_ref/plane_mask`；clear capture |
| `DS-CH-OBS-012` / `TC-CH-OBS-012` | exact static inventories 60/48/27+3/20 and allowed owner list | synthetic provider-cost/secret/runtime/tools/listing/approval/method-body profiles and hidden generic owner | `inventory_kind/pollution_case`；delete static pollution corpus |

Observability stop-review：12/12 DS各有exact profile/carrier identity；Off/Redacted、required/optional/atomic、four-plane和failure injection均可独立构造。dummy forbidden data不得进入business store、typed error text、fallback或planned evidence；observer结果不得驱动业务状态、事务、retry或验收结论。

### 10.4 Configuration-failure data bundles: 18/18

每条 `CFG-F-*` 保留独立 DS，即使与 binding 共用 `TD-CH-CONFIG/PORT/ENTRY`。valid control 始终是 one complete immutable candidate；invalid candidate 不能修改 active frozen root。

| Dataset / TC | Canonical config candidate | 独立 invalid / failure data | Isolation / cleanup |
|---|---|---|---|
| `DS-CH-CONFIG-001` / `TC-CH-CONFIG-001` | each valid minimal profile/entry candidate with all required artifact/module/leaf/ref rows | remove each required artifact/module/leaf/ref exactly once、wrong required family | `profile/entry/member`；pure candidate + reset providers |
| `DS-CH-CONFIG-002` / `TC-CH-CONFIG-002` | strict UTF-8 JSON bytes passing V0~V1 | BOM/comment/trailing comma/duplicate/unknown/null/coercion/oversize/malformed UTF-8 each isolated bytes vector | `parser_vector`；pure bytes; clear parser spy |
| `DS-CH-CONFIG-003` / `TC-CH-CONFIG-003` | valid JSON + constants + each of 21 bounded content env leaves at declared precedence | invalid/malformed/out-of-range higher-priority override、unknown env、trim/coercion、lower-source fallback trap | `env_leaf/source/vector`；pure map/bytes |
| `DS-CH-CONFIG-004` / `TC-CH-CONFIG-004` | all 27 canonical rows at exact type/default/profile/entry/cross-field-valid values | per item min/max/min-1/max+1/wrong type/case/name/profile/entry/cross-field | `config_row/validation_stage/vector`；pure candidate |
| `DS-CH-CONFIG-005` / `TC-CH-CONFIG-005` | complete acyclic reference graph with exact family and reachable sensitive section | orphan/cycle/wrong family/case collision/unreachable section/dangling ref | `graph_case/ref_edge`；pure candidate; provider spy reset |
| `DS-CH-CONFIG-006` / `TC-CH-CONFIG-006` | every external slot with explicit profile-legal binding row; legal Disabled controls | omit one slot (Missing)、illegal Disabled/profile pair、default Fake/coercion trap | `profile/slot/case`；reset slot constructors |
| `DS-CH-CONFIG-007` / `TC-CH-CONFIG-007` | valid Configured branch plus registered alternatives kept unreachable | fail exact selected provider/constructor at each point；fallback-constructor call spies | `slot/constructor/fault`；dispose prefix + reset providers |
| `DS-CH-CONFIG-008` / `TC-CH-CONFIG-008` | opaque credential/TLS refs and safe fake provider success metadata | unavailable/denied/malformed/expired/revoked/mismatched material; dummy secret/body echo probes | `material_ref/failure_kind`；reset provider + delete corpus |
| `DS-CH-CONFIG-009` / `TC-CH-CONFIG-009` | complete Stage 0~7 ordered owned-prefix plan | fail each stage; every reverse cleanup success/failure combination with original typed failure | `candidate_ref/stage/cleanup_mask`；dispose/reset all owned parts |
| `DS-CH-CONFIG-010` / `TC-CH-CONFIG-010` | complete graph and selected API/Worker/Jobs entry prerequisites parked before barrier | fail each prerequisite before/at barrier、listener/task/facade exposure/accepted request spies | `entry/candidate/fault`；drain/dispose + reset |
| `DS-CH-CONFIG-011` / `TC-CH-CONFIG-011` | exact complete 9-slot/6-source/10-route registry | remove or corrupt each member one at a time; wrong family/schema/ref; wildcard/default/reduced registry | `registry_kind/member/case`；pure candidate + reset harness |
| `DS-CH-CONFIG-012` / `TC-CH-CONFIG-012` | 9-Port/14-callable activated script matrix with phase and effect proof | temporary/timeout/permanent/codec/consistency/Unknown, proof true/false, retry bound, raw provider code/body | `slot/callable/phase/failure/proof`；reset scripts + delete corpus |
| `DS-CH-CONFIG-013` / `TC-CH-CONFIG-013` | valid Query/reference rows for normal Partial/Unavailable/Missing typed branches | malformed persisted owner/ref/state/version/current-index relation；common fallback/repair spies | `query_or_ref/case`；drop isolated seed + reset spies |
| `DS-CH-CONFIG-014` / `TC-CH-CONFIG-014` | exact Worker/Job/Outbound phase scripts and valid control run graph | retryable/permanent/invalid response/commit Unknown/rollback failure at each declared phase | `flow_family/phase/fault`；resolve/drain + reset all scripts |
| `DS-CH-CONFIG-015` / `TC-CH-CONFIG-015` | frozen active root A + independent fresh candidate B with changed artifact/ref/material metadata | B valid/invalid drift、active dependency typed failure、raw source reread/hot reload/LKG/fallback call spies | `active_ref/candidate_ref/drift_case`；dispose B; keep/drop A by run |
| `DS-CH-CONFIG-016` / `TC-CH-CONFIG-016` | same business carrier under Off/Redacted with safe allowed observer source | forbidden field、redactor reject、sink fail each plane、recursive fallback/body echo probes | `mode/plane/fault`；reset observer + delete corpus |
| `DS-CH-CONFIG-017` / `TC-CH-CONFIG-017` | exact static catalog/source/dependency/Port/Worker allowlist | dynamic admin/watch/hot-reload/config-center key/dependency/input attempts | `surface/pollution_case`；delete static corpus; no active root mutation |
| `DS-CH-CONFIG-018` / `TC-CH-CONFIG-018` | previous immutable candidate with compatible digest/profile and valid current opaque material refs | revoked/expired credential/TLS、digest/profile incompatibility、unknown outcome/cutover claim traps | `target_ref/eligibility_case`；dispose candidate; no cutover |

Configuration stop-review：18/18 `CFG-F-*` 均有独立 DS；V0~V6、graph、provider、Stage 0~7、barrier、active-runtime、frozen-root和rollback eligibility均有exact candidate/fault identity。invalid higher source、Missing、Configured failure和drift不发生silent fallback；未使用真实 env value、secret、provider response、artifact path或rollback事实。

### 10.5 Cross-family data arithmetic

| Family | Canonical DS |
|---|---:|
| foundation | 18 |
| flows | 83 |
| states | 24 |
| transaction | 22 |
| binding | 12 |
| observability | 12 |
| configuration failure | 18 |
| **total** | **189** |

## 11. Dedicated negative, boundary, concurrency, and recovery data

### 11.1 Independent scenario classes

下列数据必须在 owning `DS-CH-*` 内分配独立 `scenario_id`、seed namespace和cleanup，不得对已被其他用例消费的 happy-path mutable seed 原位修改。

| Scenario class | Required construction | Must not reuse / infer | Main owners |
|---|---|---|---|
| required-field / strict-codec negative | 从exact valid DTO/config/header bytes单次删除或替换一个正式字段/token | 多字段随机损坏、parser error text作为oracle | FOUNDATION-001/014、BIND-011、CONFIG-002/004 |
| typed-ref asymmetry | valid owner/ref/kind/digest control + exactly one wrong owner/kind/ref/digest | raw string typo、untyped arbitrary ID | Command/Query/Inbound reference and relation DS |
| state pair | exact valid current owner seed + one `SP-CH-*` target/classification | family sample、callable-based classification | STATE-001..023 |
| boundary value | exact min/max plus min-1/max+1 or first/last/empty/next cursor | clamp/default/unstated unlimited value | FOUNDATION-012/014/018、Query pages、CONFIG-003/004 |
| terminal / no-op | terminal historical seed or exact same comparison fields | approximate equality、state name only | Command、State、Job、TX |
| duplicate replay | completed exact digest + matching immutable result/receipt/report | reconstruct result from current truth | Command/Inbound/Job/TX-009..014 |
| collision / winner | same normalized key + different exact digest/domain/channel/operation | random race without known schedule、loser overwrite | TX-008..010/015/019 |
| staged / rollback fault | one exact UoW member ordinal fails; original cause and cleanup causes scripted separately | generic `fail=true`、log text as phase marker | foundation flow、Command、Job、TX-003..007/017/020 |
| commit Unknown | exact tx ref + barrier + controlled resolution Durable/NotDurable/still Unknown | timeout、single missing read or observer output as proof | Command/Outbound/Job/TX-007/017/019/020 |
| outbound phase fault | independent A source UoW、B Port、C bind UoW data | merging phases or rolling back source after B/C | FLOW-O-001..010、TX-017..019 |
| Job recovery | frozen plan + stable ordinal + initial/target/final UoW state at each crash point | rescan/replan/reexecute terminal target | FLOW-J-001..008、TX-013/014/020 |
| config assembly fault | immutable valid candidate + exact source/V-stage/Stage/barrier fault | active-root mutation、silent fallback、real provider fact | BIND-001..010、CONFIG-001..018 |
| observer fault | exact business carrier + independently controlled redactor/sink/plane fault | observer-derived business error/retry/state | OBS-003..011、CONFIG-016 |
| forbidden material | dummy-only isolated material class corpus | real secret/body/token/identity、echoing offending bytes | relation/ref/observer/config negative DS |
| historical pollution | isolated old object/status/responsibility tokens | alias/rename into current positive dataset | FOUNDATION-008..011、OBS-012、CONFIG-017 |

### 11.2 Body-free and sensitive corpus rules

| Material class | Allowed positive data | Negative corpus | Absolute prohibition |
|---|---|---|---|
| credential / secret / TLS | opaque typed ref、safe availability/expiry/revocation metadata from controlled fake | dummy token/password/key/cert-shaped bytes in isolated no-echo corpus | real material、provider response、plaintext fallback、log/report/evidence copy |
| MCP/A2A/API/provider content | typed descriptor/ref/kind/schema/digest/safe summary only | dummy request/response/body-bearing field mutation | raw external body in truth、event snapshot、audit、observer or error text |
| method-library asset | typed asset ref/kind/body-free locator/state | dummy method body/source/publication/version content probe | local ownership or persistence of method body/source |
| governance | typed governance ref/state and local seam/review fact | dummy approval/vote/policy/workflow content probe | approval result/workflow/policy enforcement as Hub truth |
| runtime/tools/SDK | typed consumer ref/scope/state and formal exposure boundary | dummy execution/result/tool call/client/cache/package data | execution、tool result、SDK client/cache/package ownership |
| audit/observability | typed audit ref/state、safe counts/reasons/closed labels | dummy log/span/metric/alert/audit/evidence body | evidence alias/signoff inference、raw telemetry body |
| marketplace | `is_listing_truth=false` read-only discovery control | dummy listing/ranking/price/order/transaction field probe | any positive listing/transaction/fulfillment dataset |

Negative scanner inputs are not expected business errors and must never be reproduced in captured logs, reports, fallback diagnostics or future evidence. Corpus cleanup is mandatory even when the scanner fails.

### 11.3 Deterministic concurrency schedules

| Schedule | Barrier sequence | Expected owner result | Reset rule |
|---|---|---|---|
| `RACE-ABSENT-RESERVE` | A/B read absent -> both park -> A reserve commits -> B reserve observes winner | one Reserved winner; loser returns exact existing/conflict surface | join both writers; drop operation namespace |
| `RACE-SAME-VERSION` | A/B load same version -> A save/commit -> B CAS | A winner; B `OptimisticConflict`; no loser delta | join; verify winner; drop owner namespace |
| `RACE-CURRENT-INDEX` | A/B propose successor/current row -> one unique/index commit -> loser exact winner read | one current row; historical rows as formally declared | join; drop relation namespace |
| `RACE-INTENT-BIND` | A/B read Captured + same/different intent -> A bind -> B CAS/resolve | same exact winner retained; no local delivery state | resolve C UoWs; reset collaboration |
| `RACE-JOB-TARGET` | A/B load same Planned ordinal -> A effect+journal terminal -> B CAS | one terminal cell/effect; B never repeats effect | join; finish/freeze run then drop |
| `RACE-MATERIAL-REFRESH` | collect same affected set -> A updates -> B sees stale version | exact actual winner refs; no rescan or overwrite | join; drop material namespace |

The schedule name is harness metadata only; it is not a public protocol/state/marker. Future implementations may use deterministic barriers or a proven concurrency test harness, but must preserve the exact sequence and owner oracle.

## 12. Data isolation and cleanup

### 12.1 Namespace hierarchy

```text
opaque harness run namespace
  / dataset_id
    / scenario_id
      / parameter_id (type/member/pair/phase/profile/target when applicable)
        / owner key, operation key, source key, job target ordinal, or config candidate ref
```

The opaque run namespace is test infrastructure metadata, not a new Capability Hub public type or persisted domain field. Business objects continue to use only formal typed IDs/refs. A duplicate/collision test may share the exact operation key inside one scenario; unrelated scenarios may not.

### 12.2 Isolation-key matrix

| Data owner | Primary business isolation | Secondary scenario isolation | Cross-run prohibition |
|---|---|---|---|
| object / repository truth | exact typed owner/ref + repository key | dataset/scenario + expected version | shared current index or global fake singleton |
| command / idempotency | operation namespace + canonical idempotency key | digest vector / writer identity | key reuse outside declared duplicate/collision scenario |
| query/page | scope/ref + opaque cursor chain | page/corruption case | cursor from another scope/run accepted |
| inbound | exact source family + message/idempotency key | actor/schema/digest branch | receipt key reuse across source families |
| outbound | source record + snapshot + capture refs | phase A/B/C + intent/race case | external status or intent leaked across captures |
| Job | job name/schema/key + run/plan refs | target ordinal + crash phase | plan/ordinal/result refs reused by another Job run |
| state | owner ref + family/kind + `SP-CH-*` parameter | formation/same-state/terminal case | pair seed shared mutably by another pair |
| config | immutable candidate ref + profile/entry | source/stage/member/fault case | invalid candidate changing active root or shared env map |
| observer | occurrence/carrier ref + profile | plane/mode/redaction/fault case | sink buffer/fault retained for another business case |
| corpus/static graph | corpus/graph case ID | material/finding kind | corpus file or mutation loaded by positive case |

### 12.3 Cleanup matrix

| Data kind | Required cleanup | Cleanup failure handling | Manual cleanup allowed? |
|---|---|---|---|
| pure typed value / canonical vector | none beyond value drop | n/a | no need |
| fake repository/UoW state | drop exact run namespace and clear call journal | cleanup failure is harness failure; do not report case result as valid | no |
| entry/Worker/Job owned invocation | stop intake, drain, await/join one terminal, then drop namespace | preserve original + ordered cleanup causes; no detached invocation | no |
| external Port/resolver/collaboration | reset exact slot/script/call journal | mark harness invalid; do not fallback another binding | no |
| observer capture/fault | clear all plane buffers and fault scripts after business owner terminal | non-recursive safe harness failure only | no |
| invalid config candidate | reverse-dispose complete owned prefix; active root untouched | preserve original assembly + ordered cleanup causes | no |
| dummy forbidden/historical corpus | delete isolated corpus even after scanner/parser failure | cleanup failure invalidates run hygiene | no |
| future selected durable suite | run-scoped schema/transaction/namespace cleanup defined before enabling suite | environment gate blocked until deterministic cleanup exists | no |

### 12.4 Pollution probes

Before and after each future case, the harness must be able to assert applicable zero baselines for: staged rows、current indexes、operation reservations、captured snapshots、external call journals、Worker/Job owned tasks、observer buffers、fault scripts、candidate assembly prefixes and isolated corpus handles. These are harness hygiene assertions, not business evidence or acceptance results.

## 13. Fake, stub, controlled, Disabled, and real-like semantics

### 13.1 Substitute definitions

| Substitute | Allowed semantics | Required fidelity | Forbidden use |
|---|---|---|---|
| `Fake` | deterministic in-process implementation of a formal repository/Port/authority contract | exact typed outcomes、version/unique/order/UoW/phase/body-free rules and call journal | simplified success path that bypasses guards or invents fallback |
| `Controlled` | scripted external/clock/UoW/entry/observer behavior for exact phase and outcome | one explicit script per scenario; unexpected call fails harness | generic mutable fail flag、silent default response |
| `Stub` | pure single-call no-state response where state/concurrency/ordering is irrelevant | exact typed input/output and call count | repository/UoW/current-index/idempotency/Job/collaboration lifecycle |
| `Disabled` | formal explicit binding branch yielding exact existing `NotConfigured`/no-start behavior | constructor exists only where profile row permits; calls/tasks remain zero | alias for Missing、failure fallback、pretend success |
| `Missing` | absent required config row/slot/source/ref | activation/candidate validation rejects before exposure | coercion to Disabled/Fake/default Configured |
| `Configured` | selected constructor/provider branch, using controlled fake in P0 harness when product is unselected | no fallback to Fake/Disabled; exact typed provider/Port failure | claim of real provider/credential/endpoint test |
| `real-like` | future selected P1/P2 contract candidate in Step 8 | same canonical manifest and deterministic cleanup; product prerequisite explicit | P0 prerequisite or proof of production parity before selection |

### 13.2 External-boundary matrix

| Boundary | P0 data substitute | Formal Disabled behavior | Real-like status |
|---|---|---|---|
| 22 repositories / 27 local/base Ports | one contract-faithful fake authority and UoW | not applicable for required local truth | future selected durable contract run only |
| 9 external Ports / 14 callables | per-slot Fake or Controlled Configured script | exact `NotConfigured` only in legal rows | product/endpoint/credential unselected |
| six Worker sources | controlled source harness with bounded header/envelope | source task count=0 | broker/source product unselected |
| ten Outbound routes / collaboration | immutable snapshot route registry + controlled external Port | route/binding behavior only where formally legal | relay/topic/provider product unselected |
| eight Jobs | controlled typed dispatcher/runner + fake stores/Ports | no generic disabled Job inference | scheduler product is not business truth |
| secret/TLS material provider | opaque-ref controlled provider returning safe metadata | fail closed where row permits no integration | real material prohibited in design/P0 |
| observer backends | run-scoped capture sink + controlled faults | Off means no allocation/redaction/sink calls | backend/alert routing unselected |

## 14. Cut-to-data mapping closure

Each range below expands ordinal-for-ordinal; it is a compact index over the explicit per-row recipes in §§7~10, not one aggregate dataset.

| Canonical TC range | Step 6 DR range | Step 7 DS range | Count | Mapping result |
|---|---|---|---:|---|
| `TC-CH-FOUNDATION-001..018` | `DR-CH-FOUNDATION-001..018` | `DS-CH-FOUNDATION-001..018` | 18 | exact ordinal |
| `TC-CH-CMD-001..026` | `DR-CH-FLOW-C-001..026` | `DS-CH-FLOW-C-001..026` | 26 | exact ordinal |
| `TC-CH-QUERY-001..033` | `DR-CH-FLOW-Q-001..033` | `DS-CH-FLOW-Q-001..033` | 33 | exact ordinal |
| `TC-CH-INBOUND-001..006` | `DR-CH-FLOW-I-001..006` | `DS-CH-FLOW-I-001..006` | 6 | exact ordinal |
| `TC-CH-OUTBOUND-001..010` | `DR-CH-FLOW-O-001..010` | `DS-CH-FLOW-O-001..010` | 10 | exact ordinal |
| `TC-CH-JOB-001..008` | `DR-CH-FLOW-J-001..008` | `DS-CH-FLOW-J-001..008` | 8 | exact ordinal |
| `TC-CH-STATE-001..024` | `DR-CH-STATE-001..024` | `DS-CH-STATE-001..024` | 24 | exact ordinal; 001..023 own 638 pairs, 024 owns 5 formations |
| `TC-CH-TX-001..022` | `DR-CH-TX-001..022` | `DS-CH-TX-001..022` | 22 | exact ordinal |
| `TC-CH-BIND-001..012` | `DR-CH-BIND-001..012` | `DS-CH-BIND-001..012` | 12 | exact ordinal |
| `TC-CH-OBS-001..012` | `DR-CH-OBS-001..012` | `DS-CH-OBS-001..012` | 12 | exact ordinal |
| `TC-CH-CONFIG-001..018` | `DR-CH-CONFIG-001..018` | `DS-CH-CONFIG-001..018` | 18 | exact ordinal |
| **Total** | **189 unique DR** | **189 unique DS** | **189** | **missing=0; extra=0; duplicate identity=0** |

Required future manifest check:

```text
step_6_unique_tc = 189
step_6_unique_dr = 189
step_7_unique_tc = 189
step_7_unique_ds = 189
tc_set_difference = 0
replace_prefix(DR, DS)_set_difference = 0
```

## 15. Per-cut and family stop-review

The explicit recipe row for each of the 189 cuts was reviewed against the following five gates: stable construction source、owner/scenario isolation、deterministic cleanup、substitute semantics and negative/zero-effect independence. Family summaries do not waive any row-level gate.

| Family / cut set | Constructability | Isolation / cleanup | Substitute | Exact stop-review conclusion |
|---|---|---|---|---|
| foundation 18 | 250/43/83 and all static/Port/repository inventories generated from formal registries | type/object/member/graph case scoped; pure/drop/reset/delete declared | none or contract fake | 18/18 pass-designed; Rustdoc field/variant/method omissions are explicit data findings |
| flows 83 | exact formal request/owner/ref/version/UoW/Port inputs exist for every flow | operation/source/snapshot/job keys and family cleanup declared | fake/controlled/Disabled only where formal | 83/83 pass-designed; Query no-write、Inbound receipt、Outbound A/B/C、Job recovery intact |
| states 24 | 23 pair-owning families mechanically yield 638 exact rows; one immutable family yields 5 formations | owner/family/kind/pair scoped; local/external cleanup split | external status only controlled Port | 24/24 pass-designed; `239/98/301`, unclassified=0, sample=0 |
| transaction 22 | repository/UoW/winner/surface/race scripts exact | tx/operation/owner/phase/ordinal scoped; resolve/rollback/drop | contract fake + controlled UoW | 22/22 pass-designed; commit tri-state and recovery source preserved |
| binding 12 | complete root/profile/27/9/14/6/10/8/Stage graph exists | candidate/slot/source/route/job scoped; dispose/drain/reset | explicit Fake/Configured/Disabled; Missing rejects | 12/12 pass-designed; no product fact or fallback |
| observability 12 | all 60/48/27+3/20 profiles have formal carrier vectors | occurrence/profile/plane scoped; clear/delete mandatory | controlled capture/redactor/sink | 12/12 pass-designed; no business/evidence inference |
| configuration 18 | strict bytes/env/catalog/graph/provider/stage/barrier/runtime/eligibility candidates exact | candidate/source/member/stage scoped; active root frozen | controlled providers; no real material | 18/18 pass-designed; each CFG-F retains independent DS |

## 16. Cross-data isolation, cleanup, and source audit

### 16.1 Audit table

| Audit item | Designed result | Gap / correction |
|---|---|---|
| canonical DR-to-DS identity | 189 expected / 189 found; missing=0; extra=0 | non-canonical command-alias example removed before closure |
| TC coverage | Step 6 and Step 7 unique TC sets both 189; difference=0 | state rows explicitly carry all 24 TC owners |
| state pair coverage | 638=`239+98+301`; 7 group arithmetic closed; 252 reference rows exact | old 304 is superseded and rejected by gate |
| immutable report | 5 formation vectors; mutable pairs=0 | no change |
| data pollution | mutable seed cannot cross scenario/run; corrupt/pollution corpus isolated | no unresolved pollution path |
| cleanup completeness | every data kind maps to pure/drop/reset/drain/dispose/delete/future-durable-run | manual cleanup count=0 |
| negative independence | codec/ref/state/body/race/UoW/config/observer negatives have own scenario identity | no happy-seed in-place mutation |
| fake consistency | Fake/Controlled/Stub/Disabled/Missing/Configured semantics fixed | real-like remains future selected prerequisite |
| sensitive material | positive body-free/ref-only; negative dummy-only/no-echo/delete | real sensitive input count=0 |
| external ownership | EventCollaborationStatus local rows=0; governance/method/runtime/tools/SDK/marketplace responsibilities not merged | no owner leakage |
| artificial data dependency | every P0 input comes from typed builder/fixture/seed/generated registry/fault profile | manual temporary data count=0 |
| implementation/evidence truthfulness | no test file/run/artifact/evidence alias/result/signoff created or claimed | execution status remains `not_executed` |

### 16.2 Fixture duplication and source-gap audit

Shared primitives remove only mechanical duplication. Owner-specific valid fields、state classification、repository keys、flow phases、config stages and zero-effect probes remain in the owning DS. If future implementation cannot construct a dataset without private field injection、raw string ref、state bypass、hidden finder、current-truth repair or generic body, that is an upstream verifiability gap and must reopen the exact owning 03/04 section; the test fixture may not supplement the contract.

Current source-gap result: `0 blocking / 0 unresolved`。The unselected durable/provider/environment products affect Step 8 selected-run planning, not P0 logical data constructability.

## 17. Upstream impact determination

| Finding | Reopen 00~04? | Disposition |
|---|---|---|
| all 189 DR have deterministic DS recipes | no | downstream test-data refinement only |
| full 638 pair source can be generated from active Step 10 | no | preserve active `239/98/301` authority |
| real durable/provider/endpoint cleanup cannot yet be named | no | Step 8 prerequisite/risk; contract fake remains P0 |
| no local EventCollaborationStatus persistence needed | no | confirms existing owner boundary |
| no mutable ReconciliationReportState pair needed | no | confirms immutable formation contract |
| future builder needs complete English Rustdoc including every struct field | no | existing implementation handoff/static gate retained |

Unresolved upstream blocker: `none`。

## 18. Formal `05-测试方案.md` §7 fill draft

Formal §7 should assemble the following without copying historical fixture names or claiming data exists:

1. `189` canonical logical datasets with strict `DR-CH-* -> DS-CH-*` one-to-one identity and exact TC owner.
2. Twelve shared deterministic primitive classes for run scope、Clock、typed IDs/actors/refs、canonical digest、typed builders、repository/UoW/Port/entry/observer/config scripts.
3. Foundation 18、flow 83、state 24、transaction 22、binding 12、observability 12 and configuration 18 recipe indexes from §§7~10.
4. The complete generated state source: 24 families/111 variants, `638=239 current+98 reserved+301 illegal`, 252 kind-specific reference rows, unclassified=0, plus five immutable report formations.
5. Dedicated negative/boundary/concurrency/recovery data, including commit Unknown、Outbound A/B/C、Job frozen plan/ordinal/UoW recovery、strict config and dummy forbidden corpus.
6. Isolation hierarchy, cleanup matrix, Fake/Controlled/Stub/Disabled/Missing/Configured semantics and cross-data audit.
7. Truthfulness statement: logical datasets and future scripts are designed only; no fixture path、run、artifact、evidence alias、result or signoff exists.

Formal §7 may keep the per-row recipe tables in this calibration artifact and include the full canonical index/ranges, but must not reduce the content to total counts without a direct link to the exact DS row and state generation contract.

## 19. Pending decisions and Step 8 entry gate

### 19.1 Non-blocking downstream decisions

| Decision | Owner / Step | Current rule |
|---|---|---|
| future test-support module/file/function names | Step 9 / formal 07 | not selected; must preserve DS manifest and Rustdoc contract |
| exact local/CI/integration environment placement | Step 8 | derive from layer/data/config/dependency constraints |
| selected durable repository product and cleanup mechanism | Step 8/07 prerequisite | not P0; cannot claim parity before selected run |
| real-like external Port/provider/source/route products | Step 8/07 prerequisite | unselected; P0 remains controlled contract fake |
| report/artifact path and evidence schema | Step 9/13 | not assigned in Step 7 |

### 19.2 Completion gate

| Gate | Result |
|---|---|
| dataset table, builder/fixture/seed/fault rules present | pass-designed |
| 189 TC/DR/DS one-to-one and mechanically audited | pass-designed; set difference=0 |
| every P0 cut has stable data precondition | pass-designed; 189/189 |
| negative/boundary/concurrency/recovery data independent | pass-designed |
| 638 state pairs fully consumed; no sampling | pass-designed; 239/98/301, unclassified=0 |
| each cut/family stop-review completed | pass-designed; 7/7 families |
| isolation/cleanup/fake/manual-data cross audit clean | pass-designed; unresolved=0 |
| sensitive/body-free responsibility redlines preserved | pass |
| no formal 05 modification or implementation/evidence fabrication | pass |
| unresolved upstream blocker | none |
| Step 8 may start | yes; read Step 8 SOP/writing standard, formal 03/04 binding/config and this data contract |

```text
document = 05-测试方案.md
step = 7
status = 05_step_07_completed_continuous_execution
canonical_datasets = 189
dr_ds_set_difference = 0
state_pair_source = 638:239/98/301
immutable_report_formations = 5
manual_data_dependencies = 0
test_execution_claimed = false
real_evidence_created = false
unresolved_upstream_blocker = none
next_allowed_action = enter_05_step_08_environment_config
commit_required = no
```
