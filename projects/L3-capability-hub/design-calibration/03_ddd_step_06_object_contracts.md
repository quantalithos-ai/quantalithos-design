# L3-capability-hub 03 详细设计 Step 6: 逐模块定义对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §5 模块实现契约中的对象实现契约;§6 全局对象索引
> 创建日期: 2026-07-10
> 当前模式: full-restart
> 状态: completed_with_step_13_controlled_reopen_and_authorized_dependency_assumption
> Safe-text scanner controlled repair: 2026-08-09; existing `CapabilitySafeText` receives one private closed eight-marker registry, exact byte-matching/precedence and raw-owner fail-closed contract; no public type, field, callable, Port, object, state, protocol, flow or denominator change
> Step 13 并发 / 幂等回开修正: 2026-07-18;closed operation identity改为channel-aware struct，normalized idempotency key改为Command / InboundEvent / OperationsJob closed enum，四类digest收紧为private `[u8; 32]` carrier；不可达`CapabilityIdempotencyState::Conflict`、`CapabilityIdempotencyConflictReason`、`conflict_reason`与`mark_conflict(...)`删除。43个HLD objects + 7个application helpers不变；Step 8 protocol文件250个public struct / enum不变，Step 6 application-support inventory单独删除1个type；所有新增struct field、enum variant / payload与callable均有英文`///`
> Step 8 回开修正: 2026-07-10;已为所有直接返回 append-only change record 的 mutation 补齐 application 生成的 record id、actor / trace / reason 和确定 change kind;对象 owner、字段、Port 和正式文档边界未改变
> Step 8 batch 8.5 回开修正: 2026-07-12;异步传播的 post-commit / pre-intent 崩溃窗口触发 durable-capture 门禁,新增 application-owned immutable event payload snapshot 与 versioned capture record。二者是技术一致性对象,不新增 capability truth、broker topic、delivery attempt 或外部投递状态 owner
> Step 9 batch 9.2 回开澄清: 2026-07-13;`CapabilityRegistryEntry::bind_descriptor(...)`原子绑定accepted descriptor并把non-retired registry推进或保持`VisibilityPending`,只形成一条解释最终revision的`DescriptorBound`record,不再由application猜测是否追加第二条`LifecycleChanged`record
> Step 9 batch 9.2 candidate-mapping回开: 2026-07-13;现有`ReferenceLocatorSummary`补secret / governance / method三个body-free one-way constructor,使resolver candidate可由对应safe carrier精确构造；无新结构体、字段、enum、variant、trait或Port
> Step 9 batch 9.3 回开修正: 2026-07-13;trace handoff补单次revision的`request_handoff(...)`,canonical reference reason补四类material stale bridge,`ReferenceLocatorSummary`补source / document / runtime-tools / SDK四个body-free constructor；无新结构体、字段、enum、variant、trait或Port
> Step 9 batch 9.5 回开修正: 2026-07-13;现有`DerivedMaterialSourceVersionSet`补双subject Query decision所需的consuming `try_union(...)`,按左后右稳定合并并显式拒绝同subject不同version；无新结构体、字段、enum、variant、trait或Port
> Step 9 batch 9.6 回开修正: 2026-07-13;删除无法在single impact Query中完整分页的`DownstreamImpactSummaryRefSet`,现有`DirectorySearchFacetSet`补pure `contains_all(...)`；43个HLD objects / 6个application technical helpers不变,新增callable有英文Rustdoc
> Step 9 batch 9.8 回开修正: 2026-07-14;现有`ReferenceLocatorSummary`补audit material kind + locator的body-free one-way constructor；existing `CapabilityOperationContext`补Inbound-only source family / public source event / source-provided key,使request digest、receipt identity与local source-feedback ref均可从worker合法传入application；无新结构体、enum、variant、trait或Port,新增字段/callable变更均有英文Rustdoc
> Step 9 batch 9.11 pre-entry 回开修正: 2026-07-15;为关闭multi-target Job在target commit后、final report commit前崩溃的恢复缺口,新增application-owned `CapabilityJobExecutionRecord` typed journal及Rustdoc-complete support types；其factory同时接收initial typed `run_issues`,使scope planning在未形成完整target plan时也能原子留下可恢复的Retryable / Failed空计划。43个HLD objects不变,application technical helper由6增至7；不新增execution id、scheduler / lease / attempt状态或business truth
> Step 9 batch 9.11 audit-export回开修正: 2026-07-15;existing `ObservabilityAuditRefSet`补stable factory / iterator,existing `AuditFriendlyExportSummary`补exact preparation match与same-trace/scope refresh callable,使既有stale / partial / unavailable export可由Job合法重建且typed result严格复制saved ref set；无新struct、field、enum、variant、trait、Port或protocol
> Step 9 batch 9.11 planned-target回开修正: 2026-07-15;existing Job target-plan enum新增1个Rustdoc-complete `PreclassifiedFailure` variant及1个payload field,使完整multi-target planning可保留已知missing/inapplicable target identity并在zero-effect UoW终态化,不再把per-target failure降成run issue或丢弃其他合法target；无新type、struct field、trait、Port或protocol
> Step 9 batch 9.11 ecosystem回开修正: 2026-07-15;existing `EcosystemDiscovery` plan struct variant新增Rustdoc-complete final state / reason payload,使target reentry不重扫optional source即可稳定形成Ready / Partial / Unavailable或Unchanged；无新type、trait、Port或protocol
> Step 9 batch 9.12 collaboration-plan回开修正: 2026-07-15;existing Job `EventCapture` target-plan variant新增Rustdoc-complete exact source与existing-intent payload,使journal-only success assembly可区分Captured绑定后的successor revision与已IntentBound原revision并纯校验source / intent对称；无新type、struct field、trait、Port或protocol
> Step 10 batch 10.0 governance-seam状态回开修正: 2026-07-15;补齐Step 8/9 replacement flow已实际使用但本Step遗漏的`GovernanceSeamState::Replaced` terminal variant及英文Rustdoc,同步variant contract、relation member和状态闭环审计；无新struct、field、object、callable、trait、Port或protocol
> Step 10 batch 10.1 identity / registry状态回开修正: 2026-07-16;existing identity factory显式接收`CapabilityIdentityPolicy`并固定external source canonical state到`Active / Candidate / Unresolved / rejection`的穷尽映射；registry `Draft`固定为current boundary reserved,并补齐descriptor unresolved flow实际需要的`Ungoverned / FormalVisible -> Undescribed`以及exposure flow实际需要的`Registered -> FormalVisible`方向。无新struct、field、enum、variant、object、callable、trait、Port或protocol
> Step 10 batch 10.2 descriptor / safe-summary状态回开修正: 2026-07-16;existing descriptor replacement与attachment callable固定persisted current source为`Accepted / Unresolved`,补齐actual replacement flow需要的`Unresolved -> Replaced`;descriptor retirement source收紧为`Draft / Accepted / Unresolved`,明确`Replaced`与`Retired`均不可再退役;existing risk-summary factory固定known risk -> `Available`、`Unknown` -> `Partial`、forbidden marker -> rejection,并收紧reserved degradation member为actual state delta。无新struct、field、enum、variant、object、callable、trait、Port或protocol
> Step 10 batch 10.3 exposure / trace状态回开修正: 2026-07-16;existing `FormalApplicabilityScope`由不可判定safe text改为typed consumer set并补exact membership callable；formal exposure / visibility policy、factory与reevaluation补active identity、完整local prerequisite和scope / basis输入,移除caller target authority并固定先降级后派生顺序；suspend / retire补current visibility source-version symmetry；trace handoff / supersede离开Partial时清除gap。无新HLD object、state enum、variant、field、trait、Port或protocol
> Step 10 batch 10.4 controlled-view / derived-material状态回开修正: 2026-07-16;existing `DescriptorConsumerSummary`由不可判定opaque safe text改为body-free summary + typed partial-kind set,使view factory / refresh、no-op与Partial query surface共用同一确定输入；consumer-view / directory `refresh / rebuilding / unavailable` source guards与current Job直接保存final state的边界已收紧。无新public type、HLD object、application helper、state enum / variant、protocol、flow、trait或Port
> Step 12 batch 12.1 exact-error回开修正: 2026-07-17;为消除`ConsumerViewPartialKindSet`允许empty却只能调用generic non-empty factory的冲突,existing `CapabilityTypedSet<T>`新增crate-visible duplicate-only helper；`ReferenceCandidate::body_free(...)`及前四类仅组装validated typed value的reference `register(...)`均无合法失败分支,因此收紧为infallible constructor并同步Step 9调用。无新object、field、enum、variant、protocol、flow、trait或Port；新增helper有英文Rustdoc
> Step 12 batch 12.3 issue-ref回开修正: 2026-07-17;existing `CapabilityOpaqueId`新增唯一crate-visible audited-static constructor,仅供Step 8 `CapabilityProtocolValidationIssueRef::from_code(...)`把closed `CapabilityIssueCode`映射为固定非空版本化literal；不接受runtime string、raw error/body hash、随机值、adapter code或message substring。无新type、field、enum、variant、object、protocol、flow、trait或Port；新增callable有英文Rustdoc
> Step 12 batch 12.4 Query-degraded回开修正: 2026-07-17;existing `CapabilityReadDegradedReason`由不可判定safe text改为private closed `CapabilityQueryDegradedKind`,并补唯一typed constructor / accessor / public marker mapper；resolver-level degraded surface不再解析文本或使用fake-private分类。无新type、field、enum、variant、object、protocol、flow、trait或Port；新增callable及private field均有英文Rustdoc
> Step 12 batch 12.6 Job safe-terminalization回开澄清: 2026-07-18;existing Job journal invariant把normal absent / typed inapplicable prerequisite与loaded owner/version/union/state-id/sidecar asymmetry严格分开；前者在exact target + closed issue + typed impact + zero-effect证明后可用existing `PreclassifiedFailure`,后者固定`ConsistencyDefect`并保持`Planned`。无新type、field、enum、variant、object、callable、protocol、flow、trait或Port；既有struct / field注释未遗漏
> 本轮口径: 以 Step 5 的七个实现模块为主轴,先闭口 `contracts` shared carrier,再按 8 个业务对象组展开 `domain` 对象,随后闭口 `application` 稳定 helper 并显式裁决 `infra/api/worker/jobs` 对象是否后移。本 Step 不定义 repository / port / adapter trait exact 签名,不定义 Command / Query / Event / Job DTO schema,不写函数级 flow、完整状态迁移矩阵、DDL、配置 key、测试结果、run_id、evidence alias、验收签署、implementation ledger 或 planned boundary skeleton。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 6 `逐模块定义对象实现契约` |
| 用户确认 | 用户已回复“继续”,允许从 Step 5 进入 Step 6 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 直接前序 | `design-calibration/03_ddd_step_05_module_contracts.md` |
| 概要输入 | 正式 `02-概要设计.md` §5 / §6 / §8 / §9 / §12;`02_hld_step_06_key_objects.md`;`02_hld_step_08_processing_flows.md`;`02_hld_step_09_state_machine.md` |
| 编码输入 | `03_ddd_step_03_constraints.md`;Rust code block 的 identifier、rustdoc、error explanation 使用英文,设计正文使用中文 |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md`;`projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` |
| 旧材料处理 | 旧 `03-详细设计.md` 对象、字段、service、repository、DTO 和 state 仅作 historical material / pollution audit |

---

## 1. Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.0` | 开工、输入、SOP 回答、批次计划、模块顺序、非 core 决策、字段来源规则 | completed | 是 | completed | `6.1` |
| `6.1` | `contracts` shared carrier、public marker、state / kind / ref family | completed | 是 | completed | `6.2` |
| `6.2` | `domain` 能力身份、接入语境、registry 对象组 | completed | 是 | completed | `6.3` |
| `6.3` | `domain` descriptor、governance seam、method relation 对象组 | completed | 是 | completed | `6.4` |
| `6.4` | `domain` formal exposure、consumer view、trace / impact 对象组 | completed | 是 | completed | `6.5` |
| `6.5` | `domain` derived material、reference support 对象组 | completed | 是 | completed | `6.6` |
| `6.6` | `application` helper、非 core defer 结论、跨模块审计、Step 7 handoff、回填草稿、停审 | completed | 是 | completed_wait_user_review | `6.7` |
| `6.7` | Step 8 batch `8.5` 回开:durable event capture / immutable payload snapshot technical object | completed | 是 | completed_with_step_8_reopen | Step 7 repository reopen |
| `6.8` | Step 9 batch `9.2` 回开:`bind_descriptor`与registry lifecycle / history对称性 | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.2` |
| `6.9` | Step 9 batch `9.2` 回开:`ReferenceLocatorSummary`三类safe carrier one-way mapping | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.2` |
| `6.10` | Step 9 batch `9.3` 回开:single-revision handoff、reference material reason、四类safe locator mapping与visibility source-version clarification | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.3` |
| `6.11` | Step 9 batch `9.5` 回开:双subject Query visibility source-version union | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.5` |
| `6.12` | Step 9 batch `9.6` 回开:删除无界downstream-summary ref set并补directory facet exact-membership callable | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.6` |
| `6.13` | Step 9 batch `9.8` 回开:audit locator one-way mapping与Inbound context authority retention | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.8` |
| `6.14` | Step 9 batch `9.11` pre-entry回开:typed Job execution journal、initial run issues与empty-plan distinction | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` pre-entry gate |
| `6.15` | Step 9 batch `9.11`回开:audit export exact no-op / rebuild callable与stable ref-set读取 | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `6.16` | Step 9 batch `9.11`回开:multi-target planning中的preclassified failed-target承载 | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `6.17` | Step 9 batch `9.11`回开:ecosystem target final state/reason freeze | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `6.18` | Step 9 batch `9.12`回开:event-capture target exact source / prior-intent freeze与success revision symmetry | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.12` |
| `6.19` | Step 10 batch `10.0`回开:governance seam replacement terminal state闭环 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.0` |
| `6.20` | Step 10 batch `10.1`回开:identity initial mapping、registry Draft reachability、descriptor degradation与exposure FormalVisible方向闭环 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.1` |
| `6.21` | Step 10 batch `10.2`回开:descriptor persisted-current replacement / attachment guard与risk-summary deterministic formation闭环 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.2` |
| `6.22` | Step 10 batch `10.3`回开:typed applicability、exposure / visibility policy与trace revision invariant闭环 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.3` |
| `6.23` | Step 10 batch `10.4`回开:structured consumer partial input与view / directory final rebuild guard闭环 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.4` |
| `6.24` | Step 12 batch `12.1`回开:typed-set empty例外与5个constructor error reachability闭环 | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.1` |
| `6.25` | Step 12 batch `12.3`回开:deterministic issue-ref唯一audited-static primitive入口 | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.3` |
| `6.26` | Step 12 batch `12.4`回开:read-visibility degraded reason closed kind与唯一public marker mapper | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.4` |
| `6.27` | Step 12 batch `12.6`回开:Job normal target failure与loaded consistency defect safe-terminalization分界 | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.6` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | read | 确认项目级恢复点允许进入 `03` Step 6。 |
| `design-calibration/03_ddd_calibration_flow.md` | read | 确认文档级恢复点、Step 6 文件名和正式文档后置装配规则。 |
| `design-calibration/03_ddd_step_05_module_contracts.md` | completed | 提供七个模块 owner、依赖方向、对象归属门禁和 Step 6 对象组承接清单。 |
| `design-calibration/03_ddd_step_03_constraints.md` | completed | 提供 Rust 源码英文、rustdoc、公开 enum variant 注释和 `core-contracts` 依赖边界。 |
| 正式 `02-概要设计.md` §6 | active formal baseline | 提供 43 个关键对象及 8 个业务对象组 owner。 |
| `design-calibration/02_hld_step_06_key_objects.md` | completed | 提供每个对象的字段骨架、状态线索、成员函数、工厂函数和禁止事项。 |
| `design-calibration/02_hld_step_08_processing_flows.md` | completed | 提供对象能力、函数参数来源、Command / Query / Consumer / Job 的使用方向。 |
| `design-calibration/02_hld_step_09_state_machine.md` | completed | 提供 8 组状态族、允许 / 禁止迁移和状态 owner。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | completed | 提供对象、字段、状态、幂等、stored result、port、protocol 和 transaction 的后续承接边界。 |
| `core-contracts` 实际源码 | read | 已确认存在 `ActorContext`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`JobRunId`、`Timestamp`、`TraceId`、`Version`;本 Step 不伪造不存在的 core API。 |
| 详细设计 SOP Step 6 / 书写规范 §5.5 | read | 约束逐模块 capability -> object -> field / function / state 链路、非 core 决策、字段来源审计和 Step 7 handoff。 |

---

## 3. SOP 问题回答

### 3.1 是否先收敛 shared vocabulary / typed ref / public marker?

是。`contracts` 先收敛:

- `core-contracts` 直接复用类型:actor、metadata、idempotency、job run、timestamp、trace、version。
- capability-hub 自有 typed id / ref、safe text、reason、scope、set wrapper。
- 8 个对象组会重复使用的 state / kind / change kind。
- `application` 幂等和 stored result 会使用的 operation / digest / result ref carrier。

禁止把这些 carrier 放进 `domain` 后再让 public DTO 反向依赖 `domain`。

### 3.2 Step 6 如何从模块 capability 推导对象?

每个对象组执行固定链路:

```text
模块职责
  -> 业务 capability / flow 输入输出
  -> truth / relation / policy / view / record / ref 对象
  -> 对象能力
  -> 完整字段、factory、member function、state enum、不变量
  -> Step 7 repository / resolver / publisher / handoff 承接
```

43 个概要对象全部能回指 Step 5 capability 和 Step 8 flow。本 Step 不新增 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、runtime execution、tools execution、marketplace listing、governance approval、method body、secret body 或 observability store 对象。

### 3.3 reference state 如何避免重复 truth?

`ExternalCapabilitySourceRef`、`GovernanceResultRef`、`MethodAssetRef`、`SecretRef`、`ExternalDocumentRef`、`RuntimeToolsConsumerRef`、`SdkExposureConsumerRef`、`ObservabilityAuditRef` 均以自身 typed ref 表达引用身份,解析状态统一由 `ReferenceResolutionState` 承载。

Step 9 中的 `GovernanceResultRefState`、`MethodAssetRefState`、`ConsumerRefState` 等名称视为特定 reference kind 的允许状态子集,不再各自持久化第二份状态。Step 10 必须把每个 kind 允许的 `ReferenceResolutionValue` 子集写入迁移矩阵。

### 3.4 non-core 模块哪些对象当前闭口?

- `application`:正式闭口 operation context、idempotency record、stored result shell、read visibility decision。它们是 transaction / duplicate replay / query no-write 的唯一稳定 carrier。
- `infra`:不在本 Step 固定 runtime config、builder、store adapter state exact schema;字段取决于 Step 7 port、Step 11 persistence 和 Step 14 config binding。保留强制 reopen 条件。
- `api`:不新增 canonical object;request / response DTO 归 Step 8 `contracts`,handler 只做 mapping。
- `worker`:不新增 loop state canonical object;consumer disposition / event collaboration public marker 先在 `contracts` 收口,exact envelope / receipt 归 Step 8,重入归 Step 13。
- `jobs`:不新增 runner registry canonical object;job disposition marker 先在 `contracts` 收口,exact job input / report 归 Step 8,runner binding 归 Step 14 / 15。

### 3.5 本 Step 与 Step 7+ 的边界是什么?

本 Step 写完整对象字段、factory / member signature、state enum 和 invariant。以下内容后移:

- repository / resolver / publisher / handoff / UnitOfWork trait exact 函数:Step 7。
- Command / Query / Event / Job / View / Receipt DTO exact schema:Step 8。
- 逐接口编排、事务顺序、error mapping:Step 9 / 11 / 12。
- 完整状态迁移矩阵:Step 10。
- concurrency / idempotency algorithm:Step 13;但所需 object carrier 本 Step 先闭口。
- runtime config / external product binding:Step 14。

---

## 4. 模块执行顺序与 capability 承接

### 4.1 模块执行顺序表

| 顺序 | 模块 / 对象组 | 模块职责 | 输入来源 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `contracts` shared carrier | 闭口 typed id / ref、safe carrier、state / kind / change kind、operation marker | Step 5 owner;HLD 43 对象字段;Step 8 / 9 | domain 字段不再依赖未定义类型,public surface 不反依赖 domain |
| 2 | `domain::identity` + `domain::registry` | 闭口 identity / review / source / history 和 registry / lifecycle / visibility / history | HLD §6.1~6.9;identity / registry flows and states | identity / registry truth、字段来源、状态和 history 可落码 |
| 3 | `domain::descriptor` + `domain::governance_method` | 闭口 descriptor / risk / secret safe summary、governance seam、method body-free relation | HLD §6.10~6.23;descriptor / relation flows and states | forbidden body、relation owner、change records 可落码 |
| 4 | `domain::exposure` + `domain::trace_impact` | 闭口 formal exposure / visibility / consumer view、trace / impact / downstream summary | HLD §6.24~6.32;exposure / impact flows and states | truth / projection 分层与 no-rollback 约束可落码 |
| 5 | `domain::derived_material` + `domain::reference_resolution` | 闭口 projection / export / discovery / report、reference state / policy / refs | HLD §6.33~6.43;maintenance / reference flows and states | 派生 no-write、ref no-body、resolution failure surface 可落码 |
| 6 | `application` helpers | 闭口 operation context、idempotency、stored result、read visibility decision | Generic flows;Step 5 application owner;Step 13 handoff | 后续不临时发明幂等 / stored result carrier |
| 7 | 非 core 决策与全局审计 | 记录 defer / reopen、字段来源、状态 owner、Step 7 接缝 | 当前 Step 全文 | 无悬空字段、重复状态或未命名 handoff |

### 4.2 模块 capability / 功能清单

| 模块 / 对象组 | capability / 功能 | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|---|
| `contracts` | 提供跨模块稳定 carrier | core metadata、domain-specific primitive | typed id / ref / state / kind / reason / marker | 只定义类型,不创建 truth | shared carrier family | Step 8 protocol |
| identity / registry | 建立、审查、更正、退役 identity;注册、维护、退出 registry | intake、actor、source ref、visibility basis | identity / review / registry truth 和 append-only change | 改变 identity / registry lifecycle | §8 对象 | Step 7 repository;Step 10 state |
| descriptor / relation | 建立 descriptor、safe summary、seam、method relation | registry、review、external refs、allowed summaries | descriptor / relation truth 和 change records | forbidden body guard、relation state | §9 对象 | Step 7 resolver / repository |
| exposure / impact | 建立 formal exposure、派生 consumer view、记录 trace / impact | registry、descriptor、seam、method relation、change refs | exposure truth、view、trace / impact facts | view stale;handoff pending;truth no rollback | §10 对象 | Step 7 projection / handoff |
| derived / reference | rebuild / export / discovery / reconcile;记录 external ref resolution | source truth refs、reference candidate | projection / summary / report / resolution state | 只改派生或 ref state,不改 core truth | §11 对象 | Step 7 store / resolver |
| `application` | 统一 command / query / event / job 上下文,幂等 reservation,duplicate replay,读取可见性判断 | core metadata、request digest、result ref | application-local stable carrier | transaction / replay / no-write guard | §12 对象 | Step 7 / 9 / 11 / 13 |

---

## 5. 非 core 模块对象闭口决策

| 模块 | 当前 Step 6 是否闭口 | 需要闭口的对象组 | defer / reopen 理由 | 后续承接 |
|---|---|---|---|---|
| `application` | 是 | `CapabilityOperationContext`;`CapabilityIdempotencyRecord`;`StoredCapabilityOperationResult`;`CapabilityReadVisibilityDecision` 及必要 shared carrier | 幂等、stored result、query no-write / visibility 是 application 唯一稳定 carrier | Step 7 / 9 / 11 / 13 |
| `infra` | 否,强 reopen watchpoint | runtime config、runtime builder state、store / resolver / publisher / handoff adapter state | exact shape 依赖 Step 7 port、Step 11 store、Step 14 config;若后续需要持久化或跨 adapter 传递唯一状态,必须回开 Step 6 | Step 7 / 11 / 14 |
| `api` | 否 | command / query entry local helper | public carrier 归 `contracts`,operation context 归 `application`;handler local type 不构成 canonical object | Step 8 / 12 |
| `worker` | 否,保留 disposition marker | consumer loop / publisher loop local state | public consumer / publication disposition 由 `contracts` marker 承接;loop runtime 归 Step 13 / 14 | Step 8 / 13 / 14 |
| `jobs` | 否,保留 disposition marker | job runner registry / local args / report assembler | public job input / report 归 Step 8;application operation context 与 disposition 已闭口;runner runtime 归 Step 14 / 15 | Step 8 / 14 / 15 |

---

## 6. 字段来源与对象写作门禁

### 6.1 字段来源分类

| 来源类别 | 允许出现位置 | 典型字段 | 禁止事项 |
|---|---|---|---|
| `core_metadata_copy` | truth / record / application helper | actor、trace、timestamp、version、idempotency key | 不得重新生成 inbound trace / actor |
| `system_generated` | object id、record id、result id | `*_id` | 不得用 URL、topic、provider 名或 sibling id 伪装 |
| `command_input_copy` | truth / relation / fact | scope、reason、summary、typed ref | 必须经过 domain policy,不得复制 forbidden body |
| `resolver_safe_copy` | external ref / safe summary / resolution state | locator summary、allowed summary、resolution reason | 不得保存 external body / secret / method body |
| `same_tx_constructed` | truth-to-record / truth-to-trace linkage | change record ref、trace ref、event candidate source ref | 必须来自同一 application transaction 计划 |
| `accepted_truth_copy` | projection / view / report / history | source truth ref、state snapshot、display summary | 派生对象不得成为写回来源 |
| `derived_only` | view / projection / report / decision | freshness、finding、visibility decision | 不得提升为 core truth |

### 6.2 统一对象约束

- aggregate、relation、fact、projection、report 和 mutable reference state 使用 `Version` 支撑 Step 7 expected-version / Step 11 optimistic concurrency。
- mutable truth 使用 `created_at` / `updated_at`;append-only record 使用 `recorded_at`;projection / summary 使用 `built_at` 或 `refreshed_at`;引用解析使用 `last_checked_at`。
- policy object 不读取配置和 repository;其 field 只能是编译期稳定 scope / allowed / forbidden set。
- record 只追加,不得修改原 truth;projection / view / report 只读可重建,不得反写。
- 所有公开 Rust type、field、enum variant 和 function 的 code block rustdoc 使用英文。
- 本 Step 使用 `DomainError` / `ApplicationError` 作为稳定返回类型名称;exact variant 在 Step 12 闭口。

### 6.3 对象 owner 总览

| 模块文件 | 对象类别 | 本 Step owner |
|---|---|---|
| `contracts/src/refs.rs` | typed id / ref / locator / scope / reason | capability-hub public shared carrier |
| `contracts/src/metadata.rs` | state / kind / change kind / operation marker | capability-hub public marker;core metadata 直接复用 `core-contracts` |
| `domain/src/identity.rs` | identity / review / source / history | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` |
| `domain/src/registry.rs` | registry / lifecycle / visibility / history | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` |
| `domain/src/descriptor.rs` | descriptor / risk / secret safe summary / history | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` |
| `domain/src/governance_method.rs` | governance seam / method relation / refs / policies / history | §9.2 对象组 |
| `domain/src/exposure.rs` | exposure / visibility / consumer view / policy / history | §10.1 对象组 |
| `domain/src/trace_impact.rs` | trace / impact fact / downstream summary | §10.2 对象组 |
| `domain/src/derived_material.rs` | projection / export / discovery / reconciliation / policy | §11.1 对象组 |
| `domain/src/reference_resolution.rs` | canonical resolution state / policy / external refs | §11.2 对象组 |
| `application/src/idempotency.rs` | operation context / reservation / stored result | §12.1 对象组 |
| `application/src/query_service.rs` | read visibility decision | §12.2 对象组 |

---

## 7. `contracts` shared carrier 对象契约

### 7.1 `core-contracts` 直接复用边界

| 类型 | 实际来源 | 本仓用途 | 本仓禁止重新定义 |
|---|---|---|---|
| `ActorContext` | `core_contracts::actor` | truth / relation / record 的可信 actor 语境 | 禁止本地建立第二 actor schema |
| `CommandMetadata` | `core_contracts::metadata` | command application context | 禁止本地复制 request / trace / idempotency 字段 |
| `QueryMetadata` | `core_contracts::metadata` | query application context | 禁止 query 私建 write metadata |
| `IdempotencyKey` | `core_contracts::metadata` | command / job 原始幂等键 | application 只允许归一化 wrapper,不得替代 core key |
| `JobRunId` | `core_contracts::metadata` | operations job run identity | 不得用作 business truth id 或 result id |
| `Timestamp` | `core_contracts::metadata` | created / updated / recorded / checked / built time | 不得用裸 `String` 表示时间 |
| `TraceId` | `core_contracts::metadata` | change / trace / result 关联 | 不得在 application 重新生成 inbound trace |
| `Version` | `core_contracts::metadata` | mutable object optimistic version | 不得用 projection version 代替 truth version |

`core-contracts` 当前实际源码已验证存在这些公开类型。若实现前 core API 改名,Step 17 / `07` 必须更新 import mapping;当前不把假定的 extension method 写成已存在事实。

### 7.2 opaque carrier pattern

capability-hub 自有 primitive 采用以下固定形态。代码块表达落码模式,后续表格列出的每个 named type 都必须生成独立 Rust newtype,不得用 type alias 降低类型隔离。

```rust
/// Opaque non-empty identifier owned by capability-hub contracts.
pub struct CapabilityOpaqueId(String);

/// Opaque non-empty safe text guarded by the closed forbidden-body marker contract.
pub struct CapabilitySafeText(String);

/// Ordered and duplicate-free collection of typed values.
pub struct CapabilityTypedSet<T>(Vec<T>);

/// Version-aware typed reference used across module boundaries.
pub struct VersionedRef<I> {
    /// Stable target identifier.
    pub id: I,
    /// Target version when the caller requires an exact snapshot.
    pub version: Option<Version>,
}
```

| pattern | factory / member contract | invariant |
|---|---|---|
| `CapabilityOpaqueId` | `pub fn new(value: impl Into<String>) -> Result<Self, ContractValueError>`;`pub fn as_str(&self) -> &str`;`pub(crate) fn from_audited_static(value: &'static str) -> Self` | runtime value仍经trim后非空校验；crate-visible static入口只接受本仓代码中逐项审计的非空literal,当前唯一调用者是protocol issue-ref mapper；不得解析内部格式推导业务含义 |
| `CapabilitySafeText` | `pub fn new(value: impl Into<String>) -> Result<Self, ContractValueError>`;`pub fn as_str(&self) -> &str`;`pub(crate) fn copy_validated(&self) -> Self` | 先按 Rust Unicode `trim()` 做一次边界 trim；非空后通过 contracts-owned closed marker scanner；保留 trimmed UTF-8 bytes 原样；crate-visible copy 只供同crate closed carrier mapper 无损复制；不得把该 primitive 宣称为任意自然语言的语义 DLP |
| `CapabilityTypedSet<T>` | `pub fn try_from_values(values: Vec<T>) -> Result<Self, ContractValueError>`;`pub(crate) fn try_from_possibly_empty_values(values: Vec<T>) -> Result<Self, ContractValueError>`;`pub fn iter(&self) -> impl Iterator<Item = &T>` | public factory保持输入稳定顺序、拒绝重复且不得为空；crate-visible helper只供明确允许empty的specialized wrapper并仍拒绝重复；不得降级为无序裸列表 |
| `VersionedRef<I>` | `pub fn current(id: I) -> Self`;`pub fn exact(id: I, version: Version) -> Self` | `version == None` 表示读取当前版本,不表示 expected version 已满足 |

`ContractValueError` 只是 stable error type name;exact variant 由 Step 12 定义。

#### 7.2.1 Closed forbidden-body marker scanner

`CapabilitySafeText` 的 forbidden-body scanner 是 `contracts` 私有、固定且无配置的 structural guard。它不是自然语言语义 DLP，也不承诺识别没有显式 marker 的任意外部正文。实现必须遵守以下唯一算法：

1. `CapabilitySafeText::new` 将输入转换为合法 Rust UTF-8 `String`，只调用一次 Rust `str::trim()`；该操作使用 Rust Unicode whitespace 语义，不做第二次 trim。
2. 若 trimmed value 为空，立即返回 `ContractValueError::EmptySafeText`；空值优先于 scanner，且不得读取或保存正文。
3. scanner 对 trimmed value 的 UTF-8 bytes 做一次线性扫描，按下表对完整 ASCII byte literal 做 `contains` 匹配。marker 可以出现在任意 byte 位置，包括紧邻其他字符；不要求 token boundary，也不识别转义形式。
4. 匹配大小写敏感；只接受下表列出的 ASCII literal。扫描全部八类后，若命中多个类别，按表中既有 `ForbiddenExternalBody` variant 声明顺序返回最早类别，而不是按正文中的位置、长度或重复次数裁决。
5. 没有命中时保留 trimmed value 的原始 UTF-8 bytes，不做 Unicode normalization、case-fold、percent-decoding、base64-decoding、JSON/PEM parsing、lossy replacement、长度型校验、截断或hash。任意有限长度的合法 `String` 均由该 primitive 接受；协议/transport 的长度限制属于其 owner 的独立合同。

| marker slug | exact ASCII marker literal | `ForbiddenExternalBody` result / precedence rank |
|---|---|---:|
| `external-capability-source` | `[[capability-hub:forbidden-body:v1:external-capability-source]]` | `ExternalCapabilitySourceBody` / 1 |
| `governance` | `[[capability-hub:forbidden-body:v1:governance]]` | `GovernanceBody` / 2 |
| `method` | `[[capability-hub:forbidden-body:v1:method]]` | `MethodBody` / 3 |
| `secret` | `[[capability-hub:forbidden-body:v1:secret]]` | `SecretBody` / 4 |
| `external-document` | `[[capability-hub:forbidden-body:v1:external-document]]` | `ExternalDocumentBody` / 5 |
| `runtime-execution-payload` | `[[capability-hub:forbidden-body:v1:runtime-execution-payload]]` | `RuntimeExecutionPayload` / 6 |
| `sdk-client` | `[[capability-hub:forbidden-body:v1:sdk-client]]` | `SdkClientBody` / 7 |
| `observability` | `[[capability-hub:forbidden-body:v1:observability]]` | `ObservabilityBody` / 8 |

Repeated occurrences of one marker return the same typed category. Near-miss punctuation, a changed version/slug, case changes, Unicode confusables, percent/base64/JSON-escaped/PEM-encoded forms that no longer contain the exact literal, and markers split across non-contiguous bytes do not match. A JSON string, PEM-like envelope, or any other wrapper that still contains the exact marker bytes does match because wrapper semantics are not parsed. The registry and its precedence are private contracts constants; configuration cannot disable, remove, reorder, or extend them, and the production scanner and dummy corpus must consume the same registry.

Any typed source, Port, decoder, or mapper that owns raw external body input must reject or classify that input fail-closed before constructing `CapabilitySafeText`; it must never use a successful no-marker result as permission to downgrade raw body to safe text. `ContractValueError::ForbiddenBody` carries only the typed category. No scanner branch, error, report, log, or cleanup record may echo the input, matched marker, URL, digest, hash, length, or diagnostic excerpt.

`CapabilityOpaqueId`的audited-static例外只关闭closed issue code到opaque ref之间本可证明infallible的构造路径。它不是通用绕过校验入口:

```rust
impl CapabilityOpaqueId {
    /// Creates an opaque identifier from one compile-time audited non-empty literal.
    pub(crate) fn from_audited_static(value: &'static str) -> Self;
}
```

```rust
impl CapabilitySafeText {
    /// Copies this validated body-free value without changing its bytes or meaning.
    pub(crate) fn copy_validated(&self) -> Self;
}
```

- `value`只能来自`CapabilityIssueCode::literal()`的穷尽`match`;不得接收request、config、environment、database、adapter、error-chain或format输出。
- 51个当前literal必须逐项非空、ASCII、互异且带固定`v1`namespace；任一literal修改均是protocol compatibility change,不能由实现者现场生成。
- implementation不得把该callable改成`pub`,不得增加`from_unchecked(String)`、hash-based fallback或`unwrap / expect`构造路径。
- 普通opaque id、typed id、cursor、surface ref与collaboration ref继续只调用fallible `CapabilityOpaqueId::new(...)`;本例外不能扩散。

`CapabilityTypedSet<T>`的empty例外必须通过下列crate-visible helper显式进入；其他wrapper不得绕过public non-empty factory:

```rust
impl<T: Eq> CapabilityTypedSet<T> {
    /// Creates a stable duplicate-free typed collection that may be empty.
    pub(crate) fn try_from_possibly_empty_values(
        values: Vec<T>,
    ) -> Result<Self, ContractValueError>;
}
```

该helper当前唯一允许调用者是`ConsumerViewPartialKindSet::try_from_values(...)`。它允许empty表达complete consumer summary,但仍以`ContractValueError::DuplicateTypedSetValue`拒绝重复；所有声明为non-empty的typed set继续调用`CapabilityTypedSet::try_from_values(...)`。

### 7.3 typed id family

下列类型全部使用 `CapabilityOpaqueId` pattern,分别生成独立 newtype 和英文 rustdoc。

| typed id | Rustdoc 语义 | 生成来源 |
|---|---|---|
| `CapabilityIdentityId` | Stable identifier of a capability identity. | identity create path 的 id generator |
| `CapabilityAccessReviewFactId` | Stable identifier of an access review fact. | review fact create path |
| `ExternalCapabilitySourceRefId` | Stable identifier of an external capability source reference. | source ref registration |
| `CapabilityIdentityChangeRecordId` | Stable identifier of an identity change record. | same transaction as identity change |
| `CapabilityRegistryEntryId` | Stable identifier of a capability registry entry. | registry registration |
| `RegistryChangeRecordId` | Stable identifier of a registry change record. | same transaction as registry change |
| `AdapterDescriptorId` | Stable identifier of an adapter descriptor. | descriptor create path |
| `DescriptorRiskConstraintSummaryId` | Stable identifier of a descriptor risk summary. | risk summary record path |
| `SecretRefId` | Stable identifier of a body-free secret reference. | secret ref registration |
| `SecretHandlingSafeSummaryId` | Stable identifier of a secret handling safe summary. | safe summary create path |
| `DescriptorChangeRecordId` | Stable identifier of a descriptor change record. | same transaction as descriptor change |
| `GovernanceSeamRelationId` | Stable identifier of a governance seam relation. | seam create path |
| `GovernanceResultRefId` | Stable identifier of a governance result reference. | governance ref registration |
| `CapabilityMethodBodyFreeRelationId` | Stable identifier of a body-free capability-method relation. | method relation create path |
| `MethodAssetRefId` | Stable identifier of a method asset reference. | method ref registration |
| `GovernanceSeamChangeRecordId` | Stable identifier of a governance seam change record. | same transaction as seam change |
| `MethodRelationChangeRecordId` | Stable identifier of a method relation change record. | same transaction as relation change |
| `FormalExposureBoundaryId` | Stable identifier of a formal exposure boundary. | exposure create path |
| `FormalVisibilityApplicabilityId` | Stable identifier of a visibility and applicability fact. | visibility derivation path |
| `ControlledConsumerViewId` | Stable identifier of a controlled consumer view. | view build path |
| `CapabilityExposureChangeRecordId` | Stable identifier of an exposure change record. | same transaction as exposure change |
| `CapabilityAccessTraceabilityRecordId` | Stable identifier of an access traceability record. | trace record path |
| `CapabilityChangeImpactFactId` | Stable identifier of a capability impact fact. | impact command path |
| `DownstreamConsumptionImpactSummaryId` | Stable identifier of a downstream impact summary. | inbound summary path |
| `DirectorySearchBrowseProjectionId` | Stable identifier of a directory projection item. | projection build path |
| `AuditFriendlyExportSummaryId` | Stable identifier of an audit-friendly export summary. | export preparation path |
| `ReadOnlyEcosystemDiscoverySummaryId` | Stable identifier of an ecosystem discovery summary. | discovery rebuild path |
| `CapabilityReconciliationReportId` | Stable identifier of a reconciliation report. | reconciliation run path |
| `ReferenceResolutionStateId` | Stable identifier of a canonical reference resolution state. | reference state record path |
| `ExternalDocumentRefId` | Stable identifier of an external document reference. | document ref registration |
| `RuntimeToolsConsumerRefId` | Stable identifier of a runtime or tools consumer reference. | consumer ref registration |
| `SdkExposureConsumerRefId` | Stable identifier of an SDK exposure consumer reference. | SDK consumer ref registration |
| `ObservabilityAuditRefId` | Stable identifier of an observability or audit reference. | audit ref registration |
| `CapabilityApplicationResultId` | Stable identifier of an application result surface. | application result store |
| `CapabilityEventPayloadSnapshotId` | Stable identifier of an immutable outbound event payload snapshot. | same transaction as event-source commit |
| `CapabilityEventCaptureId` | Stable identifier of a durable outbound event capture record. | same transaction as event-source commit |

### 7.4 versioned ref family

| named ref | exact Rust shape | 使用位置 | 禁止事项 |
|---|---|---|---|
| `CapabilityIdentityRef` | `VersionedRef<CapabilityIdentityId>` | registry、descriptor、seam、method relation command input | 不得用 source URL 替代 |
| `CapabilityAccessReviewFactRef` | `VersionedRef<CapabilityAccessReviewFactId>` | identity / descriptor / seam source link | 不得解释为 governance approval |
| `CapabilityRegistryEntryRef` | `VersionedRef<CapabilityRegistryEntryId>` | descriptor / exposure / projection source | 不得解释为 runtime allowlist |
| `AdapterDescriptorRef` | `VersionedRef<AdapterDescriptorId>` | registry / exposure / view source | 不得携带 provider runtime body |
| `GovernanceSeamRelationRef` | `VersionedRef<GovernanceSeamRelationId>` | exposure source | 不得携带 governance body |
| `CapabilityMethodRelationRef` | `VersionedRef<CapabilityMethodBodyFreeRelationId>` | exposure source | 不得携带 method body |
| `FormalExposureBoundaryRef` | `VersionedRef<FormalExposureBoundaryId>` | visibility、view、discovery source | consumer 不得反写 |
| `ControlledConsumerViewRef` | `VersionedRef<ControlledConsumerViewId>` | query / freshness / impact | 不得作为 exposure truth |
| `CapabilityAccessTraceabilityRecordRef` | `VersionedRef<CapabilityAccessTraceabilityRecordId>` | export / handoff source | 不得作为 audit body |
| `CapabilityReconciliationReportRef` | `VersionedRef<CapabilityReconciliationReportId>` | job / query result linkage | 不得作为 truth repair command |
| `CapabilityEventCaptureRef` | `VersionedRef<CapabilityEventCaptureId>` | post-commit collaboration / repair | 不得作为 capability truth 或 external intent ref |

### 7.5 polymorphic ref carrier

```rust
/// Identifies a capability access truth subject without carrying its body.
pub enum CapabilityTraceSubjectRef {
    /// Capability identity subject.
    Identity(
        /// Capability identity evaluated by the read resolver.
        CapabilityIdentityId,
    ),
    /// Registry entry subject.
    RegistryEntry(CapabilityRegistryEntryId),
    /// Adapter descriptor subject.
    AdapterDescriptor(AdapterDescriptorId),
    /// Governance seam relation subject.
    GovernanceSeam(GovernanceSeamRelationId),
    /// Capability-method relation subject.
    MethodRelation(CapabilityMethodBodyFreeRelationId),
    /// Formal exposure boundary subject.
    FormalExposure(FormalExposureBoundaryId),
}

/// References an append-only change record without carrying the record body.
pub enum CapabilityChangeRecordRef {
    /// Identity change record reference.
    Identity(CapabilityIdentityChangeRecordId),
    /// Registry change record reference.
    Registry(RegistryChangeRecordId),
    /// Descriptor change record reference.
    Descriptor(DescriptorChangeRecordId),
    /// Governance seam change record reference.
    GovernanceSeam(GovernanceSeamChangeRecordId),
    /// Method relation change record reference.
    MethodRelation(MethodRelationChangeRecordId),
    /// Exposure change record reference.
    Exposure(CapabilityExposureChangeRecordId),
}

/// Identifies an allowed downstream consumer boundary.
pub enum CapabilityConsumerRef {
    /// Runtime or tools consumer boundary.
    RuntimeTools(RuntimeToolsConsumerRefId),
    /// SDK exposure consumer boundary.
    Sdk(SdkExposureConsumerRefId),
    /// Read-only ecosystem consumer boundary.
    Ecosystem(EcosystemContextRef),
}

/// Identifies the body-free reference whose resolution state is tracked.
pub enum ReferenceSubjectRef {
    /// External capability source reference.
    ExternalCapabilitySource(ExternalCapabilitySourceRefId),
    /// Governance result reference.
    GovernanceResult(GovernanceResultRefId),
    /// Method asset reference.
    MethodAsset(MethodAssetRefId),
    /// Secret provider reference.
    Secret(SecretRefId),
    /// External document reference.
    ExternalDocument(ExternalDocumentRefId),
    /// Runtime or tools consumer reference.
    RuntimeToolsConsumer(RuntimeToolsConsumerRefId),
    /// SDK exposure consumer reference.
    SdkConsumer(SdkExposureConsumerRefId),
    /// Observability or audit reference.
    ObservabilityAudit(ObservabilityAuditRefId),
}
```

| enum | variant source | invariant |
|---|---|---|
| `CapabilityTraceSubjectRef` | 对应 truth / relation 已存在的 typed id | 不允许 projection、job run、provider 或 marketplace listing 成为 core trace subject |
| `CapabilityChangeRecordRef` | same-tx append-only record id | 只能指向六类正式 change record,不能指向 DB changelog |
| `CapabilityConsumerRef` | 已注册且允许的 consumer ref | 不携带 runtime state、SDK client state 或 marketplace truth |
| `ReferenceSubjectRef` | 已登记的八类 body-free reference id | 不携带外部正文;是 `ReferenceResolutionState` 唯一 subject union |

### 7.6 safe text / scope / set carrier family

下列类型使用 `CapabilitySafeText` 或 `CapabilityTypedSet<T>` pattern;每个类型保持独立 newtype。

| 类型组 | named types | representation | 语义 / 红线 |
|---|---|---|---|
| identity | `CapabilityIdentityKey`;`AccessReviewContext`;`AccessRiskSummary`;`IdentityCorrectionReason`;`IdentityChangeReason` | safe text | identity key 是稳定业务锚点;reason / review 不含外部正文 |
| source / locator | `ExternalLocatorSummary`;`ExternalSourceInput`;`ExternalDocumentLocatorSummary`;`MethodLibraryLocator`;`AuditMaterialLocatorSummary` | safe text | 只保存 locator summary;不保存 document / method / audit body |
| registry | `RegistryVisibilityBasis`;`VisibilityContext`;`RegistryLifecycleReason`;`RegistryRetirementReason` | safe text | 不包含 runtime availability、allowlist 或 marketplace state |
| descriptor | `ConnectionBoundarySummary`;`CapabilityConstraintSummary`;`SecretUsageScopeSummary`;`SecretHandlingBoundarySummary`;`SafeSummaryInput`;`DescriptorChangeReason` | safe text | 任何内容必须通过 forbidden-body scan |
| governance / method | `GovernanceResultScopeSummary`;`GovernanceSafeSummary`;`CapabilityMethodRelationScope`;`MethodRelationChangeReason`;`MethodRelationRemovalReason` | safe text | 不含 approval / Policy / shared_rules / method body |
| exposure | `FormalVisibilityBasisSummary`;`ExposureRetirementReason`;`FormalVisibilityPendingReason` | safe text | 不含 runtime decision 或 SDK client behavior；`FormalApplicabilityScope`已在§7.10.3改为typed consumer set,不得再按文本解析 |
| consumer view | `DescriptorConsumerSummary` | structured body-free summary + typed partial-kind set | safe summary不含descriptor / secret / method body；Partial只能由closed typed kind决定,不得解析summary文本 |
| trace / impact | `TraceabilityReason`;`CapabilityImpactScope`;`ConsumptionImpactObservationSummary`;`ConsumerFeedbackInput` | safe text | 不含 execution payload、tool result、cost 或 raw audit data |
| derived | `CapabilityDirectoryDisplaySummary`;`AuditAllowedSummary`;`CapabilityDiscoverabilitySummary`;`ReconciliationFindingSummary` | safe text | 只读派生内容,不得被用作 truth command input |
| reference | `ReferenceResolutionReason`;`ReferenceFailureReason`;`ReferenceStaleReason`;`ForbiddenBodyReason`;`ConsumerUnavailableReason`;`AuditMaterialUnavailableReason` | safe text | failure 必须显式,不得静默转成 resolved |
| typed set | `TraceabilityHandoffRefSet`;`DirectorySearchFacetSet`;`AccessTruthRefSet`;`ReferenceKindSet`;`CapabilitySourceTypeSet`;`FormalExposureTruthInputSet`;`ConsumerViewPartialKindSet` | `CapabilityTypedSet<T>` | ordered + unique;成员必须是 typed ref / enum,不得用裸字符串列表 |

专用safe reason到append-only record / generic lifecycle member所需`ChangeReason`的转换必须是显式contracts能力,不能由application读取debug text或重新解析字符串:

| source reason newtype | exact bridge | invariant |
|---|---|---|
| `IdentityCorrectionReason`;`IdentityChangeReason` | `pub fn to_change_reason(&self) -> ChangeReason` | 复制同一已验证safe-text value;不得改变identity语义 |
| `RegistryLifecycleReason`;`RegistryRetirementReason` | `pub fn to_change_reason(&self) -> ChangeReason` | 复制同一已验证safe-text value;不得加入runtime / listing reason |
| `DescriptorChangeReason` | `pub fn to_change_reason(&self) -> ChangeReason` | 复制body-free value;不得把scanner detail或secret material带入record |
| `MethodRelationChangeReason`;`MethodRelationRemovalReason` | `pub fn to_change_reason(&self) -> ChangeReason` | 复制body-free value;不得包含method body |
| `ExposureRetirementReason`;`FormalVisibilityPendingReason` | `pub fn to_change_reason(&self) -> ChangeReason` | 复制server-side safe reason;不得包含consumer / runtime decision |

bridge对borrowed newtype执行validated value copy,不接受fallback string、不修改source、不附加prefix / suffix,也不把不同reason type相互转换。domain member需要专用reason时仍接收原类型;只有其generic `ChangeReason`参数或change-record factory使用bridge结果。

`ChangeReason`作为六类change record都已持有的body-free统一原因,还必须提供以下pure bridge。它们只复制同一个已验证`CapabilitySafeText`,不得读取`Debug / Display`、change-kind字符串、repository row或adapter error来重新构造原因。

| exact public signature | required English Rustdoc | invariant / use |
|---|---|---|
| `pub fn copy_validated(&self) -> ChangeReason` | `Copies this validated change explanation without changing its meaning.` | 同一accepted operation需把同一reason传给多个consume-by-value domain callable时使用；不要求或猜测`Clone` |
| `pub fn to_traceability_reason(&self) -> TraceabilityReason` | `Copies this validated change explanation into a traceability reason.` | 同一subject的一组change形成trace时使用;不附加record id / event name |
| `pub fn to_consumer_view_stale_reason(&self) -> ChangeReason` | `Copies this validated change explanation for a controlled-view stale transition.` | `ControlledConsumerView::mark_stale`;返回独立validated value,不依赖`Clone`猜测 |
| `pub fn to_derived_material_stale_reason(&self) -> DerivedMaterialStaleReason` | `Copies this validated change explanation into a directory-material stale reason.` | `DirectorySearchBrowseProjection::mark_stale` |
| `pub fn to_audit_export_gap_reason(&self) -> AuditExportGapReason` | `Copies this validated change explanation into an audit-export stale reason.` | `AuditFriendlyExportSummary::mark_stale`;不形成evidence / sign-off |
| `pub fn to_discovery_unavailable_reason(&self) -> DiscoveryUnavailableReason` | `Copies this validated change explanation into an ecosystem-discovery stale reason.` | `ReadOnlyEcosystemDiscoverySummary::mark_stale`;不形成listing truth |
| `pub fn access_review_fact_recorded() -> Self` | `Returns the fixed body-free reason used when a recorded access-review fact is attached.` | 只供`RecordCapabilityAccessReviewFact`;compile-time固定safe value,不得携带review / governance body |

这些bridge不增加新的reason truth owner。Command有caller reason时,trace与material stale reason必须从terminal accepted change record的`change_reason`转换;没有caller reason的review attachment只允许使用`access_review_fact_recorded()`。application不得自行拼接“stale because ...”或把多个change reason连接成字符串。

Canonical reference-state变化没有六类core change record,因此其affected material reason唯一来自accepted final `ReferenceResolutionState.resolution_reason`。`ReferenceResolutionReason`必须提供以下pure bridge,并只复制同一个validated safe-text value:

| exact public signature | required English Rustdoc | invariant / use |
|---|---|---|
| `pub fn to_consumer_view_stale_reason(&self) -> ChangeReason` | `Copies this validated reference-resolution explanation for a controlled-view stale transition.` | reference-aware controlled-view stale path；不得读取locator或resolver error |
| `pub fn to_derived_material_stale_reason(&self) -> DerivedMaterialStaleReason` | `Copies this validated reference-resolution explanation into a directory-material stale reason.` | reference-aware directory stale path |
| `pub fn to_audit_export_gap_reason(&self) -> AuditExportGapReason` | `Copies this validated reference-resolution explanation into an audit-export stale reason.` | reference-aware audit-export stale path；不形成evidence |
| `pub fn to_discovery_unavailable_reason(&self) -> DiscoveryUnavailableReason` | `Copies this validated reference-resolution explanation into an ecosystem-discovery stale reason.` | reference-aware ecosystem stale path；不形成listing truth |

`MarkForbidden`也必须先由`ReferenceResolutionState::mark_forbidden(...)`形成final body-free `resolution_reason`,再使用上述bridge；application不得从`ForbiddenBodyReason`、命中的正文、adapter error或enum display文本另造material reason。

### 7.7 marker carrier

```rust
/// Proves that access review remains separate from governance approval.
pub enum AccessGovernanceSeparationMarker {
    /// Review and governance responsibilities are explicitly separated.
    Separated,
    /// The submitted material violates the responsibility boundary.
    BoundaryViolation,
}

/// Marks whether a summary may cross the formal exposure boundary.
pub enum ExposureSafetyMarker {
    /// The summary may be included in an allowed consumer surface.
    ConsumerSafe,
    /// The summary requires redaction before consumer exposure.
    RedactionRequired,
    /// The summary must not be exposed.
    Forbidden,
}

/// Marks a sensitive boundary without carrying sensitive material.
pub enum SensitiveBoundaryMarker {
    /// No sensitive body is represented by the summary.
    BodyFree,
    /// The summary references sensitive material through a typed reference.
    ReferenceOnly,
    /// The candidate contains forbidden sensitive body material.
    ForbiddenBody,
}
```

| marker | valid source | invalid use |
|---|---|---|
| `AccessGovernanceSeparationMarker` | access review policy evaluation | 不能代替 governance result |
| `ExposureSafetyMarker` | descriptor / secret safe summary policy evaluation | 不能表示 runtime authorization |
| `SensitiveBoundaryMarker` | forbidden-body scanner + domain policy | 不能保存 secret category body |

### 7.8 identity / registry / descriptor / relation state enum

```rust
/// Lifecycle state of a capability identity.
pub enum CapabilityIdentityState {
    /// The intake context exists but identity closure is incomplete.
    Candidate,
    /// The stable identity is available to downstream capability-hub truth.
    Active,
    /// A merge, split, or correction is awaiting formal closure.
    CorrectionPending,
    /// The identity is retained only for history and traceability.
    Retired,
    /// Source or identity evidence is insufficient for a stable identity.
    Unresolved,
}

/// Lifecycle state of an access review fact.
pub enum CapabilityAccessReviewFactState {
    /// The review fact is incomplete and cannot be referenced as current fact.
    Draft,
    /// The review fact is current and remains separate from governance approval.
    Recorded,
    /// A newer review fact replaced this fact.
    Superseded,
    /// The review fact was invalidated because its source or boundary is invalid.
    Invalidated,
}

/// Lifecycle state of a capability registry entry.
pub enum RegistryLifecycleState {
    /// A registry draft exists but is not formally registered.
    Draft,
    /// The identity is formally registered but not necessarily visible.
    Registered,
    /// The entry lacks an accepted adapter descriptor.
    Undescribed,
    /// The entry lacks a usable governance seam.
    Ungoverned,
    /// Formal visibility prerequisites require evaluation or refresh.
    VisibilityPending,
    /// The entry satisfies capability-hub formal visibility prerequisites.
    FormalVisible,
    /// The entry is retained only for history and traceability.
    Retired,
}

/// Lifecycle state of an adapter descriptor.
pub enum AdapterDescriptorState {
    /// The descriptor exists but has not passed boundary validation.
    Draft,
    /// The descriptor is the current accepted access description.
    Accepted,
    /// Required source, document, or reference material is unresolved.
    Unresolved,
    /// A newer descriptor replaced this descriptor.
    Replaced,
    /// The descriptor is no longer current.
    Retired,
}

/// Availability state of a descriptor risk and constraint summary.
pub enum DescriptorRiskConstraintSummaryState {
    /// The summary is safe and complete enough for its allowed consumers.
    Available,
    /// The summary is safe but incomplete.
    Partial,
    /// The summary cannot currently be provided.
    Unavailable,
    /// A newer summary replaced this summary.
    Superseded,
}

/// Availability state of a secret handling safe summary.
pub enum SecretHandlingSafeSummaryState {
    /// The body-free summary is available to allowed consumers.
    Available,
    /// The summary may be outdated and requires refresh.
    Stale,
    /// The summary cannot currently be provided.
    Unavailable,
    /// The candidate summary must not cross the boundary.
    Forbidden,
}

/// Lifecycle state of a governance seam relation.
pub enum GovernanceSeamState {
    /// The relation is waiting for a usable governance reference.
    Pending,
    /// The body-free relation is current and usable by exposure evaluation.
    Active,
    /// The governance reference cannot be resolved.
    Unresolved,
    /// The referenced governance result or allowed summary is expired.
    Expired,
    /// A distinct active relation replaced this relation, which remains historical.
    Replaced,
    /// The candidate relation violates the governance body boundary.
    Forbidden,
}

/// Lifecycle state of a body-free capability-method relation.
pub enum CapabilityMethodRelationState {
    /// The relation is waiting for a usable method asset reference.
    Pending,
    /// The body-free relation is current.
    Active,
    /// The method reference may be outdated.
    Stale,
    /// The relation was explicitly removed and remains historical.
    Removed,
    /// The method reference cannot be resolved.
    Unresolved,
    /// The candidate relation contains forbidden method body material.
    Forbidden,
}
```

#### 7.8.1 enum variant contract table

| enum / variant | Rustdoc 语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| `CapabilityIdentityState::Candidate` | Intake exists but identity closure is incomplete. | create from intake when canonical source is stale;reserved recovery from unresolved | active through existing callable but no current flow;unresolved reserved without callable;retired |
| `CapabilityIdentityState::Active` | Stable identity is usable by downstream truth. | create from resolved source;candidate or unresolved after policy pass through reserved activation;correction completed | correction_pending;retired |
| `CapabilityIdentityState::CorrectionPending` | Formal correction is open. | active correction request | active;retired |
| `CapabilityIdentityState::Retired` | Historical terminal identity. | explicit retirement | terminal |
| `CapabilityIdentityState::Unresolved` | Identity evidence is insufficient. | create from unresolved / unavailable source;candidate degradation reserved | candidate reserved without callable;active through existing callable but no current flow;retired |
| `CapabilityAccessReviewFactState::Draft` | Review is incomplete. | review factory;transaction-local in current flows | recorded;invalidated reserved without current flow |
| `CapabilityAccessReviewFactState::Recorded` | Review fact is current. | formal record action | superseded;invalidated reserved without current flow |
| `CapabilityAccessReviewFactState::Superseded` | Newer fact replaced this fact. | replacement | terminal |
| `CapabilityAccessReviewFactState::Invalidated` | Fact is invalid. | invalidation | terminal |
| `RegistryLifecycleState::Draft` | Registry draft is not formal. | reserved future draft factory;current `register(...)` never forms it | registered;retired,均为`reserved_not_callable_in_current_boundary` |
| `RegistryLifecycleState::Registered` | Entry is formally registered. | current `register(...)` factory;reserved draft registration | undescribed;ungoverned;visibility_pending;formal_visible only through exposure service;retired |
| `RegistryLifecycleState::Undescribed` | Descriptor prerequisite is missing. | registered / pending evaluation | visibility_pending;retired |
| `RegistryLifecycleState::Ungoverned` | Governance prerequisite is missing. | registered / pending evaluation | undescribed when descriptor establishment proves unresolved;visibility_pending;retired |
| `RegistryLifecycleState::VisibilityPending` | Visibility prerequisites require evaluation. | registered or formal_visible prerequisite change | formal_visible;undescribed;ungoverned;retired |
| `RegistryLifecycleState::FormalVisible` | Formal registry visibility prerequisites hold. | visibility evaluation | undescribed when descriptor establishment proves unresolved;visibility_pending;retired |
| `RegistryLifecycleState::Retired` | Historical terminal entry. | explicit retirement | terminal |
| `AdapterDescriptorState::Draft` | Descriptor awaits validation. | descriptor factory | accepted;unresolved;retired |
| `AdapterDescriptorState::Accepted` | Current accepted descriptor. | policy pass | replaced;unresolved;retired |
| `AdapterDescriptorState::Unresolved` | Required reference is unresolved. | draft / accepted ref failure | accepted;replaced;retired |
| `AdapterDescriptorState::Replaced` | New descriptor replaced this one. | replacement | terminal |
| `AdapterDescriptorState::Retired` | Descriptor is historical. | explicit retirement | terminal |
| `DescriptorRiskConstraintSummaryState::Available` | Safe summary is usable. | `derive(...)` with known risk and non-forbidden marker;future refresh | partial;unavailable;superseded |
| `DescriptorRiskConstraintSummaryState::Partial` | Safe summary is incomplete. | `derive(...)` with `Unknown`;reserved degradation | available reserved without callable;unavailable;superseded |
| `DescriptorRiskConstraintSummaryState::Unavailable` | Safe summary cannot be served. | reserved source loss / policy failure | available reserved without callable;partial;superseded |
| `DescriptorRiskConstraintSummaryState::Superseded` | Newer summary replaced this one. | replacement | terminal |
| `SecretHandlingSafeSummaryState::Available` | Body-free summary is usable. | safe-summary policy pass | stale;unavailable;forbidden |
| `SecretHandlingSafeSummaryState::Stale` | Summary requires refresh. | source change | available;unavailable;forbidden |
| `SecretHandlingSafeSummaryState::Unavailable` | Summary cannot be served. | source unavailable | available;stale;forbidden |
| `SecretHandlingSafeSummaryState::Forbidden` | Candidate summary violates boundary. | forbidden-body detection | terminal for current candidate |
| `GovernanceSeamState::Pending` | Seam awaits reference closure. | seam factory;refresh reopen | active;unresolved;replaced;forbidden |
| `GovernanceSeamState::Active` | Body-free seam is current. | policy pass | expired;unresolved;replaced;forbidden |
| `GovernanceSeamState::Unresolved` | Governance ref is unresolved. | resolution failure | pending;active;replaced;forbidden |
| `GovernanceSeamState::Expired` | Governance ref or summary expired. | expiry detection | pending;active;unresolved;replaced;forbidden |
| `GovernanceSeamState::Replaced` | A distinct active seam replaced this relation. | successful replacement after the new seam is active | terminal |
| `GovernanceSeamState::Forbidden` | Candidate contains forbidden governance body. | boundary violation | terminal for current candidate |
| `CapabilityMethodRelationState::Pending` | Relation awaits method ref closure. | relation factory;refresh reopen | active;unresolved;forbidden;removed |
| `CapabilityMethodRelationState::Active` | Body-free method relation is current. | policy pass | stale;unresolved;removed;forbidden |
| `CapabilityMethodRelationState::Stale` | Method ref may be outdated. | source change | pending;active;unresolved;removed;forbidden |
| `CapabilityMethodRelationState::Removed` | Relation was explicitly removed. | removal | terminal |
| `CapabilityMethodRelationState::Unresolved` | Method ref cannot be resolved. | resolution failure | pending;active;removed;forbidden |
| `CapabilityMethodRelationState::Forbidden` | Candidate contains method body. | boundary violation | terminal for current candidate |

### 7.9 exposure / trace / derived / reference state enum

```rust
/// Lifecycle state of a formal exposure boundary.
pub enum FormalExposureState {
    /// Exposure prerequisites are being assembled.
    Draft,
    /// One or more formal prerequisites are incomplete.
    Pending,
    /// The formal exposure truth was accepted.
    Accepted,
    /// The exposure is currently consumable through the server boundary.
    Active,
    /// The exposure is temporarily suspended.
    Suspended,
    /// A required reference or safe summary is unavailable.
    Unavailable,
    /// The exposure is retained only for history.
    Retired,
}

/// Formal visibility state derived from an exposure boundary.
pub enum FormalVisibilityState {
    /// Formal visibility prerequisites are not satisfied.
    NotVisible,
    /// Formal visibility evaluation is waiting for prerequisites.
    Pending,
    /// The capability is visible through the formal server boundary.
    Visible,
    /// A required prerequisite is unavailable.
    Unavailable,
    /// The visibility fact is historical.
    Retired,
}

/// Freshness state of a controlled consumer view.
pub enum ConsumerViewFreshnessState {
    /// The view matches its accepted source truth version.
    Ready,
    /// The view is behind one or more source truth versions.
    Stale,
    /// The view is currently being rebuilt by a maintenance flow.
    Rebuilding,
    /// The view cannot currently be served.
    Unavailable,
    /// The view contains only an allowed subset of its source summary.
    Partial,
}

/// Lifecycle state of an access traceability record.
pub enum TraceabilityState {
    /// The traceability record is complete for its declared source set.
    Recorded,
    /// One or more declared sources are unavailable.
    Partial,
    /// An external audit or observability handoff is pending.
    HandoffPending,
    /// A newer traceability record replaced this record.
    Superseded,
}

/// Resolution state of a capability change impact fact.
pub enum CapabilityImpactState {
    /// The affected consumer or material scope was identified.
    Identified,
    /// Only part of the impact scope is known.
    Partial,
    /// Downstream impact acknowledgement is delayed.
    Delayed,
    /// The consumer explicitly requires no action for this impact.
    Ignored,
    /// Impact explanation and required derived work are complete.
    Resolved,
}

/// Availability state of a downstream impact summary.
pub enum DownstreamImpactSummaryState {
    /// A body-free downstream summary was received.
    Received,
    /// The downstream summary is incomplete.
    Partial,
    /// The downstream summary is delayed.
    Delayed,
    /// The downstream summary cannot currently be obtained.
    Unavailable,
    /// The downstream consumer explicitly requires no action.
    Ignored,
}

/// Freshness state of a directory search and browse projection.
pub enum DirectoryProjectionState {
    /// The projection is readable and matches its source versions.
    Ready,
    /// The projection is behind source truth.
    Stale,
    /// The projection is being rebuilt.
    Rebuilding,
    /// The projection cannot currently be served.
    Unavailable,
}

/// Availability state of an audit-friendly export summary.
pub enum AuditExportState {
    /// The export summary is ready for an allowed handoff.
    Ready,
    /// Only part of the allowed export summary is available.
    Partial,
    /// The export summary cannot currently be provided.
    Unavailable,
    /// The export summary is behind source truth.
    Stale,
}

/// Availability state of a read-only ecosystem discovery summary.
pub enum EcosystemDiscoveryState {
    /// The read-only discovery summary is available.
    Ready,
    /// Only part of the allowed discovery summary is available.
    Partial,
    /// The discovery summary is behind source truth.
    Stale,
    /// The discovery summary cannot currently be served.
    Unavailable,
}

/// Outcome state of a capability reconciliation report.
pub enum ReconciliationReportState {
    /// Reconciliation completed for the declared scope.
    Completed,
    /// Reconciliation completed for only part of the declared scope.
    Partial,
    /// Reconciliation found derived material inconsistency.
    Inconsistent,
    /// One or more derived materials require rebuilding.
    RebuildRequired,
    /// Reconciliation failed without changing core truth.
    Failed,
}

/// Canonical resolution value shared by all body-free external references.
pub enum ReferenceResolutionValue {
    /// The reference can be resolved without importing external body material.
    Resolved,
    /// The reference cannot currently be resolved.
    Unresolved,
    /// The reference may no longer identify the current external fact.
    Stale,
    /// The reference is structurally invalid for its declared kind.
    Invalid,
    /// The external reference boundary is temporarily unavailable.
    Unavailable,
    /// The candidate reference or summary contains forbidden body material.
    Forbidden,
    /// The referenced external result has expired.
    Expired,
}

/// Delivery state of a body-free capability access collaboration candidate.
pub enum EventCollaborationStatus {
    /// A committed fact or material change formed a collaboration candidate.
    Candidate,
    /// The candidate is waiting for publisher or handoff delivery.
    PendingDelivery,
    /// Delivery completed for the declared collaboration target.
    Delivered,
    /// Delivery failed without rolling back committed truth.
    Failed,
    /// The external handoff boundary is unavailable.
    HandoffUnavailable,
}
```

#### 7.9.1 state transition summary

| state family | 初始 / 形成状态 | 关键允许迁移 | 终态 / 特殊状态 | 禁止事项 |
|---|---|---|---|---|
| `FormalExposureState` | transaction-local draft | draft -> pending / accepted;pending / unavailable -> accepted;unavailable -> pending;accepted / suspended -> active;accepted / active / suspended -> unavailable;active -> suspended;persisted non-retired -> retired | retired terminal | target由exact member guard控制；consumer view、runtime cache、SDK client不得触发 active |
| `FormalVisibilityState` | policy-derived not_visible / pending / visible | current flow在pending / visible / unavailable间reevaluate或mark pending;suspend visible -> unavailable;retire同步terminal | retired terminal | target只由`FormalExposurePolicy`;不得替代governance approval或runtime allow/deny |
| `ConsumerViewFreshnessState` | current factory直接ready / partial；rebuilding / unavailable reserved | current refresh从任一loaded state直接到ready / partial；any non-stale -> stale on newer truth；stale / unavailable / partial -> rebuilding与non-unavailable -> unavailable reserved | unavailable / partial are degraded,not truth terminal | Query不得触发rebuild；current Job不保存Rebuilding；already-stale不重复增version |
| `TraceabilityState` | recorded or partial | current flow recorded / partial -> handoff_pending,并允许handoff_pending同态新revision；其他partial / recorded / supersede member方向reserved | superseded historical | 离开partial清gap;handoff failure不回滚source truth |
| `CapabilityImpactState` | identified | identified -> partial / delayed / ignored / resolved;partial / delayed -> ignored / resolved | resolved / ignored | downstream summary 不改 source truth |
| `DownstreamImpactSummaryState` | received / partial / delayed / unavailable / ignored | replacement creates a new summary;current summary 不原地改写 body | append-only summary snapshot | 不保存 downstream execution state |
| `DirectoryProjectionState` | current factory only ready；rebuilding / unavailable reserved | current refresh从任一loaded state直接到ready；any non-stale -> stale on newer truth；stale / unavailable -> rebuilding与non-unavailable -> unavailable reserved | unavailable degraded | current Job不保存Rebuilding；不反写registry；already-stale不重复增version |
| `AuditExportState` | first persisted ready / partial / unavailable；stale只由propagation形成 | current Job从任一loaded state形成final ready / partial / unavailable；any non-stale -> stale on newer truth | unavailable degraded；无terminal | complete match Unchanged；不形成验收 evidence；already-stale不重复增version |
| `EcosystemDiscoveryState` | first persisted ready / partial / unavailable；stale只由propagation形成 | current Job从任一loaded state形成final ready / partial / unavailable；any non-stale -> stale on newer truth | unavailable degraded；无terminal | complete match Unchanged；不形成 marketplace listing truth；already-stale不重复增version |
| `ReconciliationReportState` | 每个new report一次形成completed / partial / inconsistent / rebuild_required / failed | 无in-place迁移；new run创建new report id并重新选择一个final outcome | immutable append-only outcome | report不修core truth、不自动rebuild；不得把inconsistent -> rebuild_required写成同一report transition |
| `ReferenceResolutionValue` | 任一显式结果 | resolved -> stale / unresolved / unavailable / expired;stale / unresolved / unavailable / expired -> resolved;invalid / forbidden 只能由新 ref 形成 resolved | forbidden / invalid 对当前 candidate terminal | 不可解析时不得补造 truth |
| `EventCollaborationStatus` | candidate | candidate -> pending_delivery;pending_delivery -> delivered / failed / handoff_unavailable;failed / handoff_unavailable -> pending_delivery | delivered current terminal | failed 不回滚 committed truth |

### 7.10 kind / change kind enum

```rust
/// Supported external capability source families.
pub enum ExternalCapabilitySourceKind {
    /// Model Context Protocol capability source.
    Mcp,
    /// Agent-to-Agent capability source.
    A2a,
    /// External API capability source.
    ExternalApi,
}

/// Supported adapter descriptor families.
pub enum AdapterDescriptorKind {
    /// Descriptor for an MCP capability boundary.
    Mcp,
    /// Descriptor for an A2A capability boundary.
    A2a,
    /// Descriptor for an external API capability boundary.
    ExternalApi,
}

/// Coarse risk classification used only by descriptor summaries.
pub enum DescriptorRiskLevel {
    /// No elevated risk was identified in the allowed summary.
    Low,
    /// The allowed summary identifies moderate handling constraints.
    Medium,
    /// The allowed summary identifies elevated handling constraints.
    High,
    /// The allowed summary identifies a boundary-critical risk.
    Critical,
    /// The available body-free material is insufficient to classify risk.
    Unknown,
}

/// External reference categories owned by capability-hub resolution state.
pub enum ReferenceKind {
    /// External capability source reference.
    ExternalCapabilitySource,
    /// Governance result reference.
    GovernanceResult,
    /// Method asset reference.
    MethodAsset,
    /// Secret provider reference.
    Secret,
    /// External document reference.
    ExternalDocument,
    /// Runtime or tools consumer reference.
    RuntimeToolsConsumer,
    /// SDK exposure consumer reference.
    SdkConsumer,
    /// Observability or audit reference.
    ObservabilityAudit,
}

/// Derived material categories maintained or inspected without changing core truth.
pub enum DerivedMaterialKind {
    /// Controlled consumer view material.
    ControlledConsumerView,
    /// Directory search and browse projection.
    DirectoryProjection,
    /// Audit-friendly export summary.
    AuditExport,
    /// Read-only ecosystem discovery summary.
    EcosystemDiscovery,
    /// Immutable reconciliation report inspected as derived material evidence.
    ReconciliationReport,
}
```

下列 change kind 也必须定义为 public enum;variant 是 Step 8 event candidate、Step 9 flow 和 Step 10 matrix 的稳定来源。

```rust
/// Classifies a capability identity change.
pub enum CapabilityIdentityChangeKind {
    /// A new capability identity was created.
    Created,
    /// A candidate or unresolved identity became active.
    Activated,
    /// A formal correction was requested for an active identity.
    CorrectionRequested,
    /// Identity attributes were corrected without changing ownership.
    Corrected,
    /// Multiple identities were merged through the formal correction flow.
    Merged,
    /// One identity was split through the formal correction flow.
    Split,
    /// A recorded access-review fact became the identity's current review link.
    ReviewFactAttached,
    /// The identity was retired.
    Retired,
    /// The identity was marked unresolved because its source is insufficient.
    MarkedUnresolved,
}

/// Classifies a capability registry change.
pub enum RegistryChangeKind {
    /// An active identity was registered.
    Registered,
    /// An accepted adapter descriptor was bound to the registry entry.
    DescriptorBound,
    /// The registry lifecycle state changed.
    LifecycleChanged,
    /// The formal visibility basis changed.
    VisibilityBasisChanged,
    /// The registry entry was retired.
    Retired,
}

/// Classifies an adapter descriptor change without carrying descriptor body.
pub enum DescriptorChangeKind {
    /// A descriptor was created.
    Created,
    /// A draft or unresolved descriptor passed the boundary policy.
    Accepted,
    /// A required body-free source or document reference is unresolved.
    MarkedUnresolved,
    /// A descriptor was replaced by a new descriptor.
    Replaced,
    /// The risk and constraint summary changed.
    RiskSummaryChanged,
    /// The body-free secret reference changed.
    SecretReferenceChanged,
    /// The secret handling safe summary changed.
    SafeSummaryChanged,
    /// The descriptor was retired.
    Retired,
}

/// Classifies a governance seam relation change.
pub enum GovernanceSeamChangeKind {
    /// A governance result reference was attached.
    Attached,
    /// An unresolved or expired seam became active again.
    Reactivated,
    /// The relation was replaced by a new relation.
    Replaced,
    /// The governance reference became unresolved.
    MarkedUnresolved,
    /// The governance result or allowed summary expired.
    Expired,
    /// The candidate relation violated the governance boundary.
    MarkedForbidden,
}

/// Classifies a body-free capability-method relation change.
pub enum MethodRelationChangeKind {
    /// A body-free method relation was attached.
    Attached,
    /// A stale or unresolved body-free relation became active again.
    Reactivated,
    /// The relation was explicitly removed.
    Removed,
    /// The method asset reference became stale.
    MarkedStale,
    /// The method asset reference became unresolved.
    MarkedUnresolved,
    /// The candidate relation contained forbidden method body material.
    MarkedForbidden,
}

/// Classifies a formal exposure or controlled-view change.
pub enum ExposureChangeKind {
    /// A formal exposure boundary was created.
    Created,
    /// Formal prerequisites are incomplete and require later reevaluation.
    MarkedPending,
    /// Pending or unavailable prerequisites became accepted again.
    PrerequisitesAccepted,
    /// The formal exposure became active.
    Activated,
    /// The formal visibility or applicability fact changed for this exposure.
    VisibilityApplicabilityChanged,
    /// The formal exposure was suspended.
    Suspended,
    /// A required exposure prerequisite became unavailable.
    MarkedUnavailable,
    /// The formal exposure was retired.
    Retired,
    /// A controlled consumer view was marked stale.
    ConsumerViewMarkedStale,
}
```

| enum | variants | variant 语义边界 |
|---|---|---|
| `CapabilityIdentityChangeKind` | `Created`;`Activated`;`CorrectionRequested`;`Corrected`;`Merged`;`Split`;`ReviewFactAttached`;`Retired`;`MarkedUnresolved` | 只表达 identity truth及其current review link变化,不含review/source body |
| `RegistryChangeKind` | `Registered`;`DescriptorBound`;`LifecycleChanged`;`VisibilityBasisChanged`;`Retired` | 不表达 runtime / marketplace state |
| `DescriptorChangeKind` | `Created`;`Accepted`;`MarkedUnresolved`;`Replaced`;`RiskSummaryChanged`;`SecretReferenceChanged`;`SafeSummaryChanged`;`Retired` | 不包含 secret 或 provider body diff |
| `GovernanceSeamChangeKind` | `Attached`;`Reactivated`;`Replaced`;`MarkedUnresolved`;`Expired`;`MarkedForbidden` | 不携带 governance result body |
| `MethodRelationChangeKind` | `Attached`;`Reactivated`;`Removed`;`MarkedStale`;`MarkedUnresolved`;`MarkedForbidden` | 不携带 method body diff |
| `ExposureChangeKind` | `Created`;`MarkedPending`;`PrerequisitesAccepted`;`Activated`;`VisibilityApplicabilityChanged`;`Suspended`;`MarkedUnavailable`;`Retired`;`ConsumerViewMarkedStale` | visibility变化允许previous / next exposure state相同;不表达runtime authorization |

### 7.10.1 policy set、candidate marker 与 external lightweight ref 闭口

以下 lightweight carrier 补齐 §8~§10 已使用的字段类型。safe text / external lightweight ref 仍遵守 §7.2 的非空、body-free 和不可从内部字符串推导业务结论约束。

```rust
/// Body-free explanation shared by domain transitions and change records.
pub struct ChangeReason(CapabilitySafeText);

/// Body-free pointer to an externally managed secret provider boundary.
pub struct ExternalSecretProviderRef(CapabilitySafeText);

/// Body-free pointer to the external owner of a governance result.
pub struct GovernanceSourceRef(CapabilitySafeText);

/// Body-free pointer to an ecosystem discovery consumer context.
pub struct EcosystemContextRef(CapabilitySafeText);

/// Body-free method-library asset classification copied from a resolved reference.
pub struct MethodAssetKindSummary(CapabilitySafeText);
```

| carrier | 形成来源 | 禁止事项 |
|---|---|---|
| `ChangeReason` | validated command reason 或 deterministic system reason | 不携带 request / response、external body、stack trace 或 database diff |
| `ExternalSecretProviderRef` | secret resolver registration input | 不得包含 credential、secret path token、secret value 或解密材料 |
| `GovernanceSourceRef` | governance resolver registration input | 不得包含 approval、Policy、shared_rules 或 workflow body |
| `EcosystemContextRef` | read-only ecosystem consumer registration | 不得表示 marketplace listing、transaction、pricing 或 fulfillment truth |
| `MethodAssetKindSummary` | method-library body-free reference summary | 不得复制 method asset body、version body 或 source code |

```rust
/// Source categories that must never define capability identity truth.
pub enum ForbiddenIdentitySource {
    /// A URL without a registered typed source reference.
    UrlOnly,
    /// Runtime configuration or runtime provider state.
    RuntimeConfiguration,
    /// SDK client or SDK-side cache state.
    SdkCache,
    /// Marketplace listing or marketplace transaction state.
    MarketplaceListing,
}

/// Sources that must never define formal registry visibility.
pub enum ForbiddenVisibilitySource {
    /// Runtime consumer cache state.
    RuntimeCache,
    /// Runtime or tools allowlist state.
    RuntimeAllowlist,
    /// Search or browse projection state.
    SearchProjection,
    /// Marketplace listing state.
    MarketplaceListing,
    /// External provider health state.
    ProviderHealth,
}

/// Descriptor fields that are outside the capability-hub truth boundary.
pub enum ForbiddenDescriptorField {
    /// Secret value, token, password, key, or ciphertext body.
    SecretBody,
    /// Runtime quota or rate-limit implementation state.
    RuntimeQuota,
    /// Runtime route or provider selection state.
    RuntimeRoute,
    /// Cost, billing, or settlement material.
    CostMaterial,
    /// Runtime failover or retry implementation state.
    RuntimeFailover,
    /// Provider availability or invocation state.
    ProviderRuntimeState,
    /// Invocation request, response, or tool result payload.
    InvocationPayload,
}

/// Body-free descriptor summary categories allowed by capability-hub.
pub enum DescriptorSummaryKind {
    /// Connection boundary summary.
    ConnectionBoundary,
    /// Risk and constraint summary.
    RiskConstraint,
    /// Secret handling safe summary.
    SecretHandling,
}

/// External governance reference categories accepted by the seam.
pub enum GovernanceRefKind {
    /// Reference to a governance result.
    GovernanceResult,
    /// Reference to a policy evaluation result without policy body.
    PolicyResult,
}

/// Governance body categories forbidden in capability-hub.
pub enum ForbiddenGovernanceBody {
    /// Governance approval or vote body.
    Approval,
    /// Policy definition or effective policy body.
    Policy,
    /// Shared rules definition body.
    SharedRules,
    /// Governance workflow or task body.
    Workflow,
}

/// Body-free method relation summary categories allowed by capability-hub.
pub enum MethodRelationSummaryKind {
    /// Method asset kind summary.
    AssetKind,
    /// Method-library locator summary.
    Locator,
    /// Capability-method applicability scope summary.
    RelationScope,
}

/// Method-library body categories forbidden in capability-hub.
pub enum ForbiddenMethodBody {
    /// Method content body.
    MethodContent,
    /// Task definition body.
    TaskDefinition,
    /// AI policy definition body.
    AiPolicyDefinition,
    /// Process template definition body.
    ProcessTemplateDefinition,
    /// Method asset version body.
    MethodVersionBody,
}

/// Consumer-side or peripheral sources forbidden from defining formal exposure.
pub enum ForbiddenExposureSource {
    /// Controlled consumer view material.
    ControlledConsumerView,
    /// SDK client or package state.
    SdkClient,
    /// Runtime or tools cache state.
    RuntimeCache,
    /// Search or browse projection state.
    SearchProjection,
    /// Marketplace listing state.
    MarketplaceListing,
}
```

| enum | 稳定 variant 来源 | 允许用途 | 禁止用途 |
|---|---|---|---|
| `ForbiddenIdentitySource` | identity owner red line | `CapabilityIdentityPolicy` compile-time deny set | runtime config 放宽 |
| `ForbiddenVisibilitySource` | registry visibility red line | `RegistryVisibilityPolicy` compile-time deny set | runtime / marketplace 状态决定 formal visibility |
| `ForbiddenDescriptorField` | descriptor ownership boundary | descriptor candidate shape check | 保存被拒绝字段正文 |
| `DescriptorSummaryKind` | 当前三类 body-free descriptor summary | descriptor allowed set | 当作 provider contract field list |
| `GovernanceRefKind` | governance result / policy result 两类 ref | governance seam ref classification | 当作 governance result body |
| `ForbiddenGovernanceBody` | governance truth owner boundary | seam forbidden-body marker | 保存 approval / policy material |
| `MethodRelationSummaryKind` | method ref / locator / relation scope | method relation allowed set | 扩展为 method body schema |
| `ForbiddenMethodBody` | method-library asset owner boundary | method relation candidate rejection | 保存 method content / definition body |
| `ForbiddenExposureSource` | formal exposure truth owner boundary | exposure policy deny set | consumer / runtime / marketplace 反写真相 |

```rust
/// Compile-time deny set for capability identity source ownership.
pub struct ForbiddenIdentitySourceSet(CapabilityTypedSet<ForbiddenIdentitySource>);

/// Compile-time deny set for registry visibility ownership.
pub struct ForbiddenVisibilitySourceSet(CapabilityTypedSet<ForbiddenVisibilitySource>);

/// Compile-time deny set for adapter descriptor fields.
pub struct ForbiddenDescriptorFieldSet(CapabilityTypedSet<ForbiddenDescriptorField>);

/// Compile-time allow set for body-free descriptor summaries.
pub struct DescriptorSummaryKindSet(CapabilityTypedSet<DescriptorSummaryKind>);

/// Compile-time allow set for governance seam reference kinds.
pub struct GovernanceRefKindSet(CapabilityTypedSet<GovernanceRefKind>);

/// Compile-time deny set for governance body categories.
pub struct ForbiddenGovernanceBodySet(CapabilityTypedSet<ForbiddenGovernanceBody>);

/// Compile-time allow set for body-free method relation summaries.
pub struct MethodRelationSummaryKindSet(CapabilityTypedSet<MethodRelationSummaryKind>);

/// Compile-time deny set for method-library body categories.
pub struct ForbiddenMethodBodySet(CapabilityTypedSet<ForbiddenMethodBody>);

/// Compile-time deny set for formal exposure truth sources.
pub struct ForbiddenExposureSourceSet(CapabilityTypedSet<ForbiddenExposureSource>);

/// Marker-only classification of a submitted descriptor shape.
pub enum DescriptorShapeCandidate {
    /// The candidate contains only allowed body-free summaries.
    BodyFree,
    /// The candidate contains one or more forbidden descriptor fields.
    ContainsForbiddenField(ForbiddenDescriptorField),
}

/// Marker-only classification used to reject method body material.
pub enum MethodBodyCandidate {
    /// The candidate contains only a body-free typed reference and summary.
    BodyFreeReference,
    /// The candidate contains a forbidden method-library body category.
    ContainsMethodBody(ForbiddenMethodBody),
}
```

`DescriptorShapeCandidate` 与 `MethodBodyCandidate` 只保存分类 marker,不得保存被拒绝正文。带载荷 variant 的载荷分别是 forbidden field / body category enum,用于产生稳定 boundary error,不是外部 material。

### 7.10.2 formal prerequisite 与 consumer-view source marker 闭口

```rust
/// Formal truth prerequisites that may participate in visibility or exposure checks.
pub enum FormalExposureTruthInput {
    /// Active capability identity prerequisite.
    ActiveIdentity,
    /// Non-retired registry entry prerequisite.
    RegisteredEntry,
    /// Accepted adapter descriptor prerequisite.
    AcceptedDescriptor,
    /// Active governance seam prerequisite.
    ActiveGovernanceSeam,
    /// Active body-free method relation when declared by the exposure scope.
    ActiveMethodRelationWhenDeclared,
    /// Accepted formal exposure prerequisite for visibility derivation.
    AcceptedFormalExposure,
}

/// Compile-time set of formal visibility and exposure prerequisites.
pub struct FormalExposureTruthInputSet(CapabilityTypedSet<FormalExposureTruthInput>);

/// Source changes that make a controlled consumer view stale.
pub enum ConsumerViewStaleMarker {
    /// Formal exposure version changed.
    ExposureVersionChanged,
    /// Adapter descriptor version changed.
    DescriptorVersionChanged,
    /// Governance seam version changed.
    GovernanceSeamVersionChanged,
    /// Method relation version changed.
    MethodRelationVersionChanged,
    /// Canonical reference resolution state changed.
    ReferenceResolutionChanged,
}

/// Allowed partial-view categories that never hide forbidden body material.
pub enum ConsumerViewPartialKind {
    /// Optional risk and constraint summary is unavailable.
    OptionalRiskSummaryUnavailable,
    /// Optional secret handling safe summary is unavailable.
    OptionalSecretSafeSummaryUnavailable,
    /// Optional method relation summary is unavailable.
    OptionalMethodSummaryUnavailable,
}

/// Version marker for one accepted source used by a controlled or derived view.
pub enum SourceVersionMarker {
    /// Registry entry version.
    RegistryEntry(CapabilityRegistryEntryId, Version),
    /// Adapter descriptor version.
    AdapterDescriptor(AdapterDescriptorId, Version),
    /// Governance seam relation version.
    GovernanceSeam(GovernanceSeamRelationId, Version),
    /// Capability-method relation version.
    MethodRelation(CapabilityMethodBodyFreeRelationId, Version),
    /// Formal exposure version.
    FormalExposure(FormalExposureBoundaryId, Version),
    /// Canonical external reference resolution state version.
    ReferenceResolution(ReferenceResolutionStateId, Version),
    /// Access traceability record revision.
    TraceabilityRecord(CapabilityAccessTraceabilityRecordId, Version),
    /// Controlled consumer view version.
    ControlledConsumerView(ControlledConsumerViewId, Version),
    /// Directory projection version.
    DirectoryProjection(DirectorySearchBrowseProjectionId, Version),
    /// Audit-friendly export summary version.
    AuditExport(AuditFriendlyExportSummaryId, Version),
    /// Read-only ecosystem discovery summary version.
    EcosystemDiscovery(ReadOnlyEcosystemDiscoverySummaryId, Version),
}

/// Compile-time set of source changes that stale a controlled consumer view.
pub struct ConsumerViewStaleMarkerSet(CapabilityTypedSet<ConsumerViewStaleMarker>);

/// Stable set of partial-view categories used by a summary or policy.
pub struct ConsumerViewPartialKindSet(
    /// Duplicate-free partial categories in their stable declared order.
    CapabilityTypedSet<ConsumerViewPartialKind>,
);

impl ConsumerViewPartialKindSet {
    /// Creates a stable, possibly empty partial-kind set and rejects duplicates.
    pub fn try_from_values(
        values: Vec<ConsumerViewPartialKind>,
    ) -> Result<Self, ContractValueError>;

    /// Returns the fixed partial categories allowed by the capability-hub boundary.
    pub fn capability_hub_default() -> Self;

    /// Iterates over partial categories in their stable declared order.
    pub fn iter(&self) -> impl Iterator<Item = &ConsumerViewPartialKind>;

    /// Returns whether this set contains the exact typed partial category.
    pub fn contains(&self, kind: &ConsumerViewPartialKind) -> bool;

    /// Returns whether this set contains no partial category.
    pub fn is_empty(&self) -> bool;

    /// Returns whether every category in this set is allowed by another set.
    pub fn is_subset_of(&self, allowed: &ConsumerViewPartialKindSet) -> bool;
}

/// Consumer-safe descriptor summary with explicit optional-source gaps.
pub struct DescriptorConsumerSummary {
    /// Body-free descriptor surface safe for the declared consumer boundary.
    safe_summary: CapabilitySafeText,
    /// Stable optional summary categories omitted from this consumer surface.
    partial_kinds: ConsumerViewPartialKindSet,
}

impl DescriptorConsumerSummary {
    /// Creates a body-free summary and its duplicate-free typed partial categories.
    pub fn try_new(
        safe_summary: CapabilitySafeText,
        partial_kinds: Vec<ConsumerViewPartialKind>,
    ) -> Result<Self, ContractValueError>;

    /// Returns the validated body-free descriptor surface.
    pub fn safe_summary(&self) -> &CapabilitySafeText;

    /// Returns the stable typed optional-source gaps represented by this summary.
    pub fn partial_kinds(&self) -> &ConsumerViewPartialKindSet;

    /// Returns whether no optional consumer-safe summary category is omitted.
    pub fn is_complete(&self) -> bool;
}

/// Exact accepted source versions used to build one controlled consumer view.
pub struct ConsumerViewSourceVersionSet(CapabilityTypedSet<SourceVersionMarker>);
```

| 类型 | factory / member contract | 不变量 |
|---|---|---|
| `FormalExposureTruthInputSet` | `pub fn capability_hub_default() -> Self`;`pub fn contains(&self, input: &FormalExposureTruthInput) -> bool` | 默认集合不可由 runtime config 删除 prerequisite |
| `ConsumerViewStaleMarkerSet` | `pub fn capability_hub_default() -> Self`;`pub fn contains(&self, marker: &ConsumerViewStaleMarker) -> bool` | 覆盖 exposure / descriptor / seam / method / canonical reference 变化 |
| `ConsumerViewPartialKindSet` | `try_from_values`通过`CapabilityTypedSet::try_from_possibly_empty_values`;`capability_hub_default`;`iter`;`contains`;`is_empty`;`is_subset_of` | ordered + duplicate-free；实例summary允许empty表示complete,policy default为non-empty allow set；forbidden body、required exposure、required governance seam缺失不得降级为Partial |
| `DescriptorConsumerSummary` | `try_new`;`safe_summary`;`partial_kinds`;`is_complete` | 不解析safe text选状态；empty partial set -> Ready,non-empty allowed subset -> Partial；duplicate / disallowed kind拒绝 |
| `ConsumerViewSourceVersionSet` | `pub fn try_from_markers(markers: Vec<SourceVersionMarker>) -> Result<Self, ContractValueError>`;`pub fn differs_from(&self, current: &Self) -> bool` | ordered + unique by source subject;只允许 registry、descriptor、seam、optional method、exposure、reference marker,且至少包含 registry、descriptor、seam、exposure |

### 7.10.3 trace / impact / derived material carrier 闭口

下列 named ref 继续采用 §7.2 `VersionedRef<I>` pattern。它们是 object / repository / protocol 后续共享的 body-free pointer,不等于被引用对象正文。

| named ref | exact Rust shape | 使用位置 | 禁止事项 |
|---|---|---|---|
| `CapabilityChangeImpactFactRef` | `VersionedRef<CapabilityChangeImpactFactId>` | impact query / handoff / report | 不保存 downstream feedback body |
| `DownstreamConsumptionImpactSummaryRef` | `VersionedRef<DownstreamConsumptionImpactSummaryId>` | impact fact source | 不替代 consumer ref |
| `DirectorySearchBrowseProjectionRef` | `VersionedRef<DirectorySearchBrowseProjectionId>` | reconciliation / query | 不作为 registry truth |
| `AuditFriendlyExportSummaryRef` | `VersionedRef<AuditFriendlyExportSummaryId>` | reconciliation / handoff | 不作为验收 evidence alias |
| `ReadOnlyEcosystemDiscoverySummaryRef` | `VersionedRef<ReadOnlyEcosystemDiscoverySummaryId>` | reconciliation / ecosystem query | 不作为 marketplace listing truth |
| `ReferenceResolutionStateRef` | `VersionedRef<ReferenceResolutionStateId>` | resolver / reference refresh / trace | 不复制 reference owner body |

```rust
/// Body-free reason explaining an incomplete traceability record.
pub struct TraceabilityGapReason(CapabilitySafeText);

/// Body-free reason explaining delayed downstream impact awareness.
pub struct ImpactDelayReason(CapabilitySafeText);

/// Body-free reason explaining an incomplete consumer feedback summary.
pub struct ConsumptionFeedbackGapReason(CapabilitySafeText);

/// Body-free impact summary prepared for a downstream handoff.
pub struct CapabilityImpactHandoffSummary(CapabilitySafeText);

/// Body-free reason explaining why derived material is stale.
pub struct DerivedMaterialStaleReason(CapabilitySafeText);

/// Body-free scope of an audit-friendly export summary.
pub struct AuditExportScope(CapabilitySafeText);

/// Body-free reason explaining an incomplete audit export summary.
pub struct AuditExportGapReason(CapabilitySafeText);

/// Body-free reason explaining unavailable ecosystem discovery material.
pub struct DiscoveryUnavailableReason(CapabilitySafeText);

/// Body-free scope inspected by one reconciliation run.
pub struct CapabilityReconciliationScope(CapabilitySafeText);

/// Body-free reason explaining a failed reconciliation report.
pub struct ReconciliationFailureReason(CapabilitySafeText);

/// One validated search or browse facet value.
pub struct DirectorySearchFacet(CapabilitySafeText);
```

| safe carrier | 来源 | 禁止事项 |
|---|---|---|
| trace / impact reason 与 handoff summary | command / consumer safe input、canonical state comparison、deterministic policy reason | 不保存 execution payload、tool result、cost、raw trace、raw audit 或 external error body |
| derived stale / gap / failure reason | source version comparison、projection builder、reconciliation result | 不把 retry / schedule / adapter stack trace 写入 domain material |
| export / reconciliation scope | validated operations input | 不携带 actor authorization token 或 evidence alias |
| `DirectorySearchFacet` | accepted descriptor / registry / exposure 的可展示 safe summary | 不保存完整索引 schema、query plan 或 ranking state |

```rust
/// Identifies one derived material or immutable reconciliation report without carrying its body.
pub enum DerivedMaterialRef {
    /// Controlled consumer view material.
    ControlledConsumerView(ControlledConsumerViewId),
    /// Directory search and browse projection material.
    DirectoryProjection(DirectorySearchBrowseProjectionId),
    /// Audit-friendly export summary material.
    AuditExport(AuditFriendlyExportSummaryId),
    /// Read-only ecosystem discovery summary material.
    EcosystemDiscovery(ReadOnlyEcosystemDiscoverySummaryId),
    /// Immutable reconciliation report material.
    ReconciliationReport(CapabilityReconciliationReportId),
}

/// Ordered set of change record references covered by a traceability record.
pub struct CapabilityChangeRecordRefSet(CapabilityTypedSet<CapabilityChangeRecordRef>);

/// Ordered set of exact capability identity revisions related by a correction.
pub struct CapabilityIdentityRefSet(CapabilityTypedSet<CapabilityIdentityRef>);

/// Ordered set of observability or audit handoff reference identifiers.
pub struct TraceabilityHandoffRefSet(CapabilityTypedSet<ObservabilityAuditRefId>);

/// Ordered non-empty set of typed consumer boundaries eligible for one formal exposure.
pub struct FormalApplicabilityScope(
    /// Stable duplicate-free consumer references evaluated by exact typed equality.
    CapabilityTypedSet<CapabilityConsumerRef>,
);

impl FormalApplicabilityScope {
    /// Creates a stable non-empty applicability scope from duplicate-free typed consumers.
    pub fn try_from_values(
        values: Vec<CapabilityConsumerRef>,
    ) -> Result<Self, ContractValueError>;

    /// Iterates over eligible consumers in their stable declared order.
    pub fn iter(&self) -> impl Iterator<Item = &CapabilityConsumerRef>;

    /// Returns whether the exact typed consumer belongs to this applicability scope.
    pub fn contains(&self, consumer: &CapabilityConsumerRef) -> bool;
}

/// Ordered set of downstream consumer references affected by a change.
pub struct CapabilityConsumerRefSet(CapabilityTypedSet<CapabilityConsumerRef>);

/// Ordered set of directory search and browse facets.
pub struct DirectorySearchFacetSet(CapabilityTypedSet<DirectorySearchFacet>);

impl DirectorySearchFacetSet {
    /// Returns whether this projection facet set contains every requested facet.
    pub fn contains_all(&self, required: &DirectorySearchFacetSet) -> bool;
}

/// Ordered set of core access truth subjects inspected by maintenance.
pub struct AccessTruthRefSet(CapabilityTypedSet<CapabilityTraceSubjectRef>);

/// Ordered set of derived materials or immutable reports inspected by maintenance.
pub struct DerivedMaterialRefSet(CapabilityTypedSet<DerivedMaterialRef>);

/// Ordered set of observability or audit references attached to an export.
pub struct ObservabilityAuditRefSet(CapabilityTypedSet<ObservabilityAuditRefId>);

impl ObservabilityAuditRefSet {
    /// Creates a non-empty stable duplicate-free observability or audit reference set.
    pub fn try_from_values(
        values: Vec<ObservabilityAuditRefId>,
    ) -> Result<Self, ContractValueError>;

    /// Iterates over observability or audit references in their stable stored order.
    pub fn iter(&self) -> impl Iterator<Item = &ObservabilityAuditRefId>;
}

/// Exact accepted source versions used to build one derived material.
pub struct DerivedMaterialSourceVersionSet(CapabilityTypedSet<SourceVersionMarker>);

impl DerivedMaterialSourceVersionSet {
    /// Unions two read-decision source sets while preserving left-then-right order.
    pub fn try_union(
        self,
        other: DerivedMaterialSourceVersionSet,
    ) -> Result<DerivedMaterialSourceVersionSet, ContractValueError>;
}

/// External capability source kinds accepted by identity policy.
pub struct CapabilitySourceTypeSet(CapabilityTypedSet<ExternalCapabilitySourceKind>);
```

| enum / variant | Rustdoc 语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| `DerivedMaterialRef::ControlledConsumerView` | Controlled consumer view material. | existing view id | 不适用 |
| `DerivedMaterialRef::DirectoryProjection` | Directory projection material. | existing projection id | 不适用 |
| `DerivedMaterialRef::AuditExport` | Audit export summary material. | existing export id | 不适用 |
| `DerivedMaterialRef::EcosystemDiscovery` | Ecosystem discovery summary material. | existing discovery id | 不适用 |
| `DerivedMaterialRef::ReconciliationReport` | Reconciliation report material. | existing report id | 不适用 |

所有 set factory 均采用 `try_from_values(Vec<T>)`,保持稳定顺序并拒绝重复。只有`ConsumerViewPartialKindSet`通过§7.2 crate-visible helper允许empty；`CapabilityChangeRecordRefSet`、`CapabilityIdentityRefSet`、`FormalApplicabilityScope`、`CapabilityConsumerRefSet` 和 `AccessTruthRefSet` 必须非空;`TraceabilityHandoffRefSet` / `ObservabilityAuditRefSet` 尚无 handoff 时由对象字段使用 `Option<...>`,不得用空 set 表示“尚未形成”。

`FormalApplicabilityScope`只能按`CapabilityConsumerRef`的closed variant与typed payload做exact membership；`RuntimeTools / Sdk`成员由application在Command中通过existing external-reference + canonical-state repositories验证为registered current boundary,`Ecosystem`成员保持validated body-free context。Domain与application均不得读取`Debug / Display / as_str`、分隔符、prefix或safe summary来推断scope membership。该representation替换旧safe-text carrier,不新增第二份consumer owner或runtime allowlist。

`DirectorySearchFacetSet::contains_all`只比较已验证typed facet membership,不暴露private `CapabilityTypedSet` / vector、不改变stable order、不解释search text、ranking或adapter query plan。Search / browse Query用它验证returned projection至少包含全部requested facets；query-text matching仍是repository adapter conformance,不得由application解析display summary猜测。

`ObservabilityAuditRefSet::try_from_values`复用`CapabilityTypedSet`的non-empty、stable-order与duplicate rejection规则；无attachment时对象字段继续使用`None`,不得构造empty set。`iter`只借用stable stored ids供Job typed result与exact preparation comparison复制,不暴露inner vector、不读取audit body且不允许mutation。

`DerivedMaterialSourceVersionSet::try_union`只供同一Query组合多个正式read decision。它先保留`self`的全部stable order,再追加`other`中尚未出现的source subject；同一subject + 同一version去重,同一subject + 不同version返回既有`ContractValueError`,由application边界映射为consistency `ApplicationError`。方法消费两个输入,不暴露private set、不开write UoW、不重新读取repository、不按timestamp/cursor猜version,也不得用于合并不同时间点的write prerequisite。

### 7.10.4 derived policy 与 external reference carrier 闭口

```rust
/// Derived material categories guarded by one policy instance.
pub enum DerivedMaterialPolicyScope {
    /// Controlled consumer view material.
    ControlledConsumerView,
    /// Directory search and browse projection material.
    DirectoryProjection,
    /// Audit-friendly export summary material.
    AuditExport,
    /// Read-only ecosystem discovery summary material.
    EcosystemDiscovery,
    /// Reconciliation report material.
    ReconciliationReport,
    /// All capability-hub derived material categories.
    All,
}

/// Formal truth source categories allowed to build derived material.
pub enum DerivedMaterialTruthSource {
    /// Capability identity truth.
    CapabilityIdentity,
    /// Capability registry truth.
    RegistryEntry,
    /// Adapter descriptor truth and safe summaries.
    AdapterDescriptor,
    /// Body-free governance seam relation.
    GovernanceSeam,
    /// Body-free capability-method relation.
    MethodRelation,
    /// Formal exposure truth.
    FormalExposure,
    /// Access traceability record.
    TraceabilityRecord,
}

/// Core truth targets that derived material must never mutate.
pub enum ForbiddenDerivedWriteTarget {
    /// Capability identity truth.
    CapabilityIdentity,
    /// Capability registry truth.
    RegistryEntry,
    /// Adapter descriptor truth.
    AdapterDescriptor,
    /// Governance seam relation truth.
    GovernanceSeam,
    /// Capability-method relation truth.
    MethodRelation,
    /// Formal exposure truth.
    FormalExposure,
}

/// Formal truth source requirements for derived material construction.
pub struct DerivedMaterialTruthSourceSet(
    CapabilityTypedSet<DerivedMaterialTruthSource>,
);

/// Compile-time deny set for derived-material write targets.
pub struct ForbiddenDerivedWriteTargetSet(
    CapabilityTypedSet<ForbiddenDerivedWriteTarget>,
);
```

| enum | variant 使用规则 | 允许来源 | 允许去向 |
|---|---|---|---|
| `DerivedMaterialPolicyScope` | policy instance 的稳定适用范围;`All` 仅用于默认总 guard | compile-time policy factory | 不适用 |
| `DerivedMaterialTruthSource` | 只列本仓正式 truth / body-free relation / trace source | derived builder source declaration | 不适用 |
| `ForbiddenDerivedWriteTarget` | 列出所有不得被 projection / summary / report 改写的核心 owner | compile-time default policy | 不适用 |

```rust
/// Body-free external document category.
pub enum ExternalDocumentKind {
    /// Protocol or interoperability specification.
    ProtocolSpecification,
    /// Capability access or integration guide.
    AccessGuide,
    /// External schema reference without schema body.
    SchemaReference,
    /// Other explicitly registered body-free document reference.
    Other,
}

/// Runtime or tools consumer boundary category.
pub enum RuntimeToolsConsumerKind {
    /// Runtime capability consumer boundary.
    Runtime,
    /// Tools capability consumer boundary.
    Tools,
}

/// Observability or audit material category referenced by capability-hub.
pub enum AuditMaterialKind {
    /// Distributed trace reference.
    Trace,
    /// Audit record reference.
    AuditRecord,
    /// Body-free metric summary reference.
    MetricSummary,
    /// Alert or incident reference.
    AlertReference,
}

/// Body-free scope accepted by a runtime or tools consumer boundary.
pub struct CapabilityConsumerScope(CapabilitySafeText);

/// Body-free locator of a runtime or tools consumer boundary.
pub struct RuntimeToolsConsumerLocator(CapabilitySafeText);

/// Body-free summary of an SDK server exposure surface.
pub struct SdkSurfaceSummary(CapabilitySafeText);

/// Body-free SDK exposure applicability scope.
pub struct SdkExposureScope(CapabilitySafeText);

/// Body-free locator of an SDK server-consumer boundary.
pub struct SdkConsumerLocator(CapabilitySafeText);
```

`ExternalDocumentKind`、`RuntimeToolsConsumerKind` 与 `AuditMaterialKind` 均是分类 enum,不是状态机;variant 由 validated registration input 形成,`允许去向` 均为不适用。`Other` 仍必须通过 `ReferenceResolutionPolicy`,不能作为复制外部正文的逃生口。

### 7.10.5 reference policy candidate carrier 闭口

```rust
/// Body-free locator summary accepted by the generic reference policy.
pub struct ReferenceLocatorSummary(CapabilitySafeText);

/// Stable digest of a body-free reference candidate.
pub struct ReferenceCandidateDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

/// Reference kinds guarded by one resolution policy instance.
pub struct ReferenceKindSet(CapabilityTypedSet<ReferenceKind>);

/// Stable reference-policy scope without external material.
pub enum ReferenceResolutionPolicyScope {
    /// References supporting capability identity, descriptor, governance, and method relations.
    AccessTruthSupport,
    /// Runtime, tools, SDK, and ecosystem consumer boundary references.
    ConsumerBoundary,
    /// Observability, audit, and external document handoff references.
    AuditAndDocumentHandoff,
    /// All reference kinds registered by capability-hub.
    AllCapabilityReferences,
}

/// External body categories forbidden from capability-hub references.
pub enum ForbiddenExternalBody {
    /// External MCP, A2A, or API source body.
    ExternalCapabilitySourceBody,
    /// Governance result, policy, approval, or workflow body.
    GovernanceBody,
    /// Method asset, definition, or version body.
    MethodBody,
    /// Secret value, ciphertext, token, or key material.
    SecretBody,
    /// External document or schema body.
    ExternalDocumentBody,
    /// Runtime invocation request, response, or tool result.
    RuntimeExecutionPayload,
    /// SDK client, package, binding, or cache body.
    SdkClientBody,
    /// Raw log, trace, metric, alert, or audit store body.
    ObservabilityBody,
}

/// Compile-time deny set for external body categories.
pub struct ForbiddenExternalBodySet(CapabilityTypedSet<ForbiddenExternalBody>);

/// Marker-only input used to validate a body-free external reference candidate.
pub struct ReferenceCandidate {
    /// Declared external reference category.
    pub reference_kind: ReferenceKind,
    /// Body-free external locator summary.
    pub locator_summary: ReferenceLocatorSummary,
    /// Stable digest of the body-free candidate fields.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Sensitive boundary classification from the inbound scanner.
    pub boundary_marker: SensitiveBoundaryMarker,
}
```

`ReferenceLocatorSummary`只做validated safe carrier之间的one-way copy,不解析、拼接或归一化external body。以下public constructor必须携带对应英文Rustdoc:

```rust
impl ReferenceLocatorSummary {
    /// Copies a body-free external capability source locator into a generic reference locator summary.
    pub fn from_external_source(locator: &ExternalLocatorSummary) -> Self;

    /// Copies a body-free secret provider reference into a generic reference locator summary.
    pub fn from_secret_reference(provider_ref: &ExternalSecretProviderRef) -> Self;

    /// Copies body-free governance source and scope values into a generic reference locator summary.
    pub fn from_governance_result(
        source: &GovernanceSourceRef,
        scope: &GovernanceResultScopeSummary,
    ) -> Self;

    /// Copies a body-free method-library locator into a generic reference locator summary.
    pub fn from_method_asset(locator: &MethodLibraryLocator) -> Self;

    /// Copies a body-free external document locator into a generic reference locator summary.
    pub fn from_external_document(locator: &ExternalDocumentLocatorSummary) -> Self;

    /// Copies a body-free runtime or tools consumer locator into a generic reference locator summary.
    pub fn from_runtime_tools_consumer(locator: &RuntimeToolsConsumerLocator) -> Self;

    /// Copies a body-free SDK consumer locator into a generic reference locator summary.
    pub fn from_sdk_consumer(locator: &SdkConsumerLocator) -> Self;

    /// Copies a body-free observability or audit kind and locator into a generic reference locator summary.
    pub fn from_observability_audit(
        kind: &AuditMaterialKind,
        locator: &AuditMaterialLocatorSummary,
    ) -> Self;
}
```

八条constructor复制的canonical safe value必须与各自`ReferenceCandidateDigest`输入字段对称。governance与observability/audit constructor使用typed length-delimited composition,不得使用enum display/debug文本或无分隔字符串连接；其他constructor只复制其typed locator / provider safe value。Step 13已闭合exact codec、private contracts field writer和8个Rustdoc-complete candidate field-byte encoder；application只做domain separation + SHA-256。它们不得接收source / document body、secret value、approval / Policy body、method body、runtime payload、SDK client/package body、raw observability/audit material或resolver response。

```rust
impl ReferenceCandidateDigest {
    /// Builds a canonical digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}
```

The eight contracts-owned public candidate encoders named byStep 13 §9 return`Result<Vec<u8>, ContractValueError>`and haveEnglish`///`。They encode exact typed fields while private inners are legally visible,neverexternal body、`Debug / Display`ortransport serialization。

| 类型 | factory / member contract | 不变量 |
|---|---|---|
| `ReferenceResolutionPolicyScope` | `pub fn capability_hub_default() -> Self` | 默认 `AllCapabilityReferences`;具体 kind allowlist 由 `ReferenceKindSet` 独立表达,配置不得扩展未定义 kind |
| `ForbiddenExternalBodySet` | `pub fn capability_hub_default() -> Self`;`pub fn contains(&self, body: &ForbiddenExternalBody) -> bool` | 默认包含全部 variant;配置不得删除 |
| `ReferenceLocatorSummary` | `from_external_source`;`from_secret_reference`;`from_governance_result`;`from_method_asset`;`from_external_document`;`from_runtime_tools_consumer`;`from_sdk_consumer`;`from_observability_audit` | 只从对应body-free safe carrier做typed one-way copy;governance与audit多字段映射使用typed length-delimited composition;不得读取或拼接external body |
| `ReferenceCandidate` | `pub fn body_free(kind: ReferenceKind, locator: ReferenceLocatorSummary, digest: ReferenceCandidateDigest) -> Self` | 三个输入都已是validated closed / body-free value,constructor固定`boundary_marker=SensitiveBoundaryMarker::BodyFree`且无合法失败分支；forbidden material必须在safe carrier形成前拒绝,不得构造candidate或注册ref |

`ForbiddenExternalBody` 是分类 enum,所有 variant 的允许来源均为 boundary scanner / policy classification,允许去向均为不适用;任何 variant 命中都只能形成 explicit rejection 或 `ReferenceResolutionValue::Forbidden`,不能保存正文。

### 7.10.6 application operation / digest / result / disposition carrier 闭口

```rust
/// Classifies the application entry channel protected by orchestration rules.
pub enum CapabilityOperationChannel {
    /// Synchronous command that may change capability-hub truth.
    Command,
    /// Read-only query that must never reserve idempotency.
    Query,
    /// Inbound event consumer operation.
    InboundEvent,
    /// One-shot or scheduled operations job.
    OperationsJob,
}

/// Stable application operation name selected from one closed public protocol inventory.
pub struct CapabilityOperationName {
    /// Entry channel that owns this operation name.
    channel: CapabilityOperationChannel,
    /// Validated route-neutral operation name copied by a closed protocol mapper.
    value: CapabilitySafeText,
}

/// Operation-namespaced key for one idempotent capability-hub write entry.
pub enum CapabilityOperationIdempotencyKey {
    /// Client-supplied key under one closed command operation.
    Command {
        /// Closed command operation namespace.
        operation_name: CapabilityOperationName,
        /// Core command idempotency key copied without parsing its value.
        raw_key: IdempotencyKey,
    },
    /// Source-owned event identity under one closed inbound consumer.
    InboundEvent {
        /// Closed inbound-consumer operation namespace.
        operation_name: CapabilityOperationName,
        /// Declared source family validated by the worker header gate.
        source_family: CapabilityInboundSourceFamily,
        /// Public source-owned event identity copied from the validated envelope.
        source_event_ref: CapabilitySourceEventRef,
    },
    /// Runner-supplied key under one closed operations-job operation.
    OperationsJob {
        /// Closed operations-job namespace.
        operation_name: CapabilityOperationName,
        /// Core job idempotency key copied without parsing its value.
        raw_key: IdempotencyKey,
    },
}

/// Canonical digest of stable business input fields.
pub struct CapabilityRequestDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

/// Stable body-free reference to an inbound source event.
pub struct CapabilityInboundEventRef(CapabilitySafeText);

/// Stable reference to a stored application result surface.
pub struct CapabilityApplicationResultRef {
    /// Operation that produced the result.
    pub operation_name: CapabilityOperationName,
    /// Stable locally generated result identifier.
    pub result_id: CapabilityApplicationResultId,
}

/// Opaque pointer to the serialized public result surface.
pub struct CapabilityStoredResultSurfaceRef(CapabilityOpaqueId);

/// Digest of the serialized public result surface used for integrity checks.
pub struct CapabilityStoredResultDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

/// Opaque schema reference for one schema-versioned outbound event envelope.
pub struct CapabilityEventSchemaRef(
    /// Validated event-name and schema-version identity.
    pub CapabilityOpaqueId,
);

/// Integrity digest of one complete serialized outbound event envelope.
pub struct CapabilityEventCandidateDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

impl CapabilityOperationName {
    /// Maps one closed command name to its stable application operation name.
    pub fn from_command_name(name: &CapabilityCommandName) -> Option<Self>;

    /// Maps one closed query name to its stable application operation name.
    pub fn from_query_name(name: &CapabilityQueryName) -> Option<Self>;

    /// Maps one closed inbound-consumer name to its stable application operation name.
    pub fn from_inbound_consumer_name(
        name: &CapabilityInboundConsumerName,
    ) -> Option<Self>;

    /// Maps one closed operations-job name to its stable application operation name.
    pub fn from_job_name(name: &CapabilityJobName) -> Option<Self>;

    /// Returns the closed entry channel that owns this operation.
    pub fn channel(&self) -> &CapabilityOperationChannel;

    /// Returns the validated route-neutral operation name.
    pub fn as_str(&self) -> &str;
}

impl CapabilityOperationIdempotencyKey {
    /// Builds a command key after validating the closed command operation mapping.
    pub fn for_command(
        operation_name: CapabilityOperationName,
        raw_key: IdempotencyKey,
    ) -> Option<Self>;

    /// Builds an inbound key from one validated consumer, source family, and public event identity.
    pub fn for_inbound_event(
        operation_name: CapabilityOperationName,
        source_family: CapabilityInboundSourceFamily,
        source_event_ref: CapabilitySourceEventRef,
    ) -> Option<Self>;

    /// Builds an operations-job key after validating the closed job operation mapping.
    pub fn for_job(
        operation_name: CapabilityOperationName,
        raw_key: IdempotencyKey,
    ) -> Option<Self>;

    /// Returns the operation namespace embedded in this normalized key.
    pub fn operation_name(&self) -> &CapabilityOperationName;
}

impl CapabilityRequestDigest {
    /// Builds a canonical request digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}

impl CapabilityStoredResultDigest {
    /// Builds a stored-result integrity digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}

impl CapabilityEventCandidateDigest {
    /// Builds an outbound-event integrity digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}

/// Opaque collaboration intent reference owned by the external event boundary.
pub struct CapabilityEventCollaborationIntentRef(
    /// Stable external intent identifier returned for one event candidate.
    pub CapabilityOpaqueId,
);

/// Immutable committed source from which one outbound event payload is formed.
pub enum CapabilityEventCaptureSourceRef {
    /// One append-only capability access change record.
    Change(
        /// Exact committed change-record reference.
        CapabilityChangeRecordRef,
    ),
    /// One exact capability access traceability revision.
    Traceability(
        /// Exact committed traceability revision reference.
        CapabilityAccessTraceabilityRecordRef,
    ),
    /// One exact capability change-impact fact revision.
    Impact(
        /// Exact committed impact-fact revision reference.
        CapabilityChangeImpactFactRef,
    ),
    /// One exact rebuildable derived-material revision.
    DerivedMaterial {
        /// Stable derived-material identity.
        material_ref: DerivedMaterialRef,
        /// Exact committed material version.
        version: Version,
    },
    /// One exact canonical reference-resolution revision.
    ReferenceResolution(
        /// Exact committed reference-resolution revision reference.
        ReferenceResolutionStateRef,
    ),
}

/// Local technical lifecycle of one durable outbound event capture.
pub enum CapabilityEventCaptureState {
    /// The source and immutable payload snapshot are committed without a bound external intent.
    Captured,
    /// A stable external collaboration intent is bound to the committed capture.
    IntentBound,
}

/// Technical lifecycle of one application idempotency reservation.
pub enum CapabilityIdempotencyState {
    /// Key and stable request digest are reserved but no result is complete.
    Reserved,
    /// The operation completed and points to a stored result surface.
    Completed,
}

/// Categories of replayable stored application result surfaces.
pub enum StoredCapabilityResultKind {
    /// Accepted command result surface.
    CommandResult,
    /// Rejected command result surface.
    CommandRejection,
    /// Inbound event consumer receipt surface.
    ConsumerReceipt,
    /// Operations job report surface.
    JobReport,
}

/// Read visibility result returned by the application query boundary.
pub enum CapabilityReadVisibilityMarker {
    /// The requested read subject is visible to the caller.
    Visible,
    /// The requested read subject is intentionally not visible.
    NotVisible,
    /// A body-free degraded surface may be returned.
    Degraded,
}

/// Closed application reason explaining one degraded read surface.
pub struct CapabilityReadDegradedReason(
    /// Public degraded category selected by the authoritative read resolver.
    CapabilityQueryDegradedKind,
);

impl CapabilityReadDegradedReason {
    /// Creates a degraded reason from one closed public-safe category.
    pub fn from_kind(kind: CapabilityQueryDegradedKind) -> Self;

    /// Borrows the closed public-safe degraded category.
    pub fn as_kind(&self) -> &CapabilityQueryDegradedKind;

    /// Consumes this reason into one kind/ref-symmetric public degraded marker.
    pub fn into_public_marker(self) -> CapabilityQueryDegradedMarker;
}
```

| enum / state | 初始 / 来源 | 允许去向 | 禁止事项 |
|---|---|---|---|
| `CapabilityOperationChannel` | entry normalization | 不适用 | query 不得被归一化成 write channel |
| `CapabilityIdempotencyState::Reserved` | idempotency reserve | completed | query 不得创建;不得回到 reserved；Command / Inbound committed orphan是consistency defect，Job必须有matching Planned journal |
| `CapabilityIdempotencyState::Completed` | stored result 已持久化并关联 | terminal | result 缺失时不得伪装 completed |
| `StoredCapabilityResultKind` | Step 8 command / consumer / job public surface | 不适用 | query result 不持久化为 replay surface |
| `CapabilityReadVisibilityMarker` | formal visibility + consumer applicability + freshness evaluation | 不适用 | 不替代 runtime authorization 或 governance approval |
| `CapabilityEventCaptureState::Captured` | source truth / material / reference revision同一UoW内保存snapshot与capture | `IntentBound` | 不表示已发布、pending delivery或failed |
| `CapabilityEventCaptureState::IntentBound` | external collaboration返回stable intent后由local UoW绑定 | terminal for local binding | 不复制external delivery state;不得换绑不同intent |

```rust
/// Body-free subject that may be evaluated by an application query service.
pub enum CapabilityReadSubjectRef {
    /// Capability identity read subject.
    Identity(CapabilityIdentityId),
    /// Capability access-review fact read subject.
    AccessReviewFact(
        /// Access-review fact evaluated by the read resolver.
        CapabilityAccessReviewFactId,
    ),
    /// Capability registry entry read subject.
    RegistryEntry(
        /// Registry entry evaluated by the read resolver.
        CapabilityRegistryEntryId,
    ),
    /// Adapter descriptor read subject.
    AdapterDescriptor(
        /// Adapter descriptor evaluated by the read resolver.
        AdapterDescriptorId,
    ),
    /// Descriptor risk-summary read subject.
    DescriptorRiskSummary(
        /// Descriptor risk summary evaluated by the read resolver.
        DescriptorRiskConstraintSummaryId,
    ),
    /// Secret handling safe-summary read subject.
    SecretHandlingSafeSummary(
        /// Secret handling safe summary evaluated by the read resolver.
        SecretHandlingSafeSummaryId,
    ),
    /// Governance seam relation read subject.
    GovernanceSeam(
        /// Governance seam relation evaluated by the read resolver.
        GovernanceSeamRelationId,
    ),
    /// Capability-method relation read subject.
    MethodRelation(
        /// Capability-method relation evaluated by the read resolver.
        CapabilityMethodBodyFreeRelationId,
    ),
    /// Formal exposure read subject.
    FormalExposure(
        /// Formal exposure evaluated by the read resolver.
        FormalExposureBoundaryId,
    ),
    /// Formal visibility applicability read subject.
    FormalVisibility(
        /// Formal visibility fact evaluated by the read resolver.
        FormalVisibilityApplicabilityId,
    ),
    /// Controlled consumer view read subject.
    ConsumerView(
        /// Controlled consumer view evaluated by the read resolver.
        ControlledConsumerViewId,
    ),
    /// Capability access traceability read subject.
    Traceability(
        /// Traceability record evaluated by the read resolver.
        CapabilityAccessTraceabilityRecordId,
    ),
    /// Immutable access change-record read subject.
    ChangeRecord(
        /// Typed immutable change record evaluated by the read resolver.
        CapabilityChangeRecordRef,
    ),
    /// Capability change-impact fact read subject.
    ImpactFact(
        /// Impact fact evaluated by the read resolver.
        CapabilityChangeImpactFactId,
    ),
    /// Downstream impact-summary read subject.
    DownstreamImpactSummary(
        /// Downstream impact summary evaluated by the read resolver.
        DownstreamConsumptionImpactSummaryId,
    ),
    /// Directory projection read subject.
    DirectoryProjection(
        /// Directory projection evaluated by the read resolver.
        DirectorySearchBrowseProjectionId,
    ),
    /// Audit export summary read subject.
    AuditExport(
        /// Audit export summary evaluated by the read resolver.
        AuditFriendlyExportSummaryId,
    ),
    /// Ecosystem discovery summary read subject.
    EcosystemDiscovery(
        /// Ecosystem discovery summary evaluated by the read resolver.
        ReadOnlyEcosystemDiscoverySummaryId,
    ),
    /// Reconciliation report read subject.
    ReconciliationReport(
        /// Reconciliation report evaluated by the read resolver.
        CapabilityReconciliationReportId,
    ),
    /// Canonical reference-resolution state read subject.
    ReferenceResolution(
        /// Canonical reference-resolution state evaluated by the read resolver.
        ReferenceResolutionStateId,
    ),
    /// Body-free external reference read subject.
    ExternalReference(
        /// External reference subject evaluated by the read resolver.
        ReferenceSubjectRef,
    ),
    /// Page-level subject for capability identity searches,including empty pages.
    IdentityCollection,
    /// Page-level subject for capability registry listings,including empty pages.
    RegistryCollection,
    /// Page-level descriptor history for one capability identity.
    DescriptorCollection(
        /// Capability identity that owns the descriptor history scope.
        CapabilityIdentityId,
    ),
    /// Page-level relation history for one capability identity.
    RelationCollection(
        /// Capability identity that owns the relation history scope.
        CapabilityIdentityId,
    ),
    /// Page-level controlled views for one registered consumer boundary.
    ConsumerViewCollection(
        /// Consumer boundary that owns the controlled-view page.
        CapabilityConsumerRef,
    ),
    /// Page-level traceability history for one access truth subject.
    TraceabilityCollection(
        /// Access truth subject whose trace revisions are listed.
        CapabilityTraceSubjectRef,
    ),
    /// Page-level downstream impact-summary query subject.
    DownstreamSummaryCollection,
    /// Page-level directory search subject independent of returned items.
    DirectorySearchCollection,
    /// Page-level directory browse subject independent of returned items.
    DirectoryBrowseCollection,
    /// Page-level audit-export scope subject independent of returned items.
    AuditExportCollection,
    /// Page-level reconciliation-report scope subject independent of returned items.
    ReconciliationReportCollection,
}

/// Command completion classification used by result mapping.
pub enum CapabilityCommandDisposition {
    /// Command mutation and stored result completed.
    Accepted,
    /// Command was rejected without committing a mutation.
    Rejected,
    /// Existing stored result must be replayed.
    DuplicateReplay,
    /// Idempotency key conflicted with a different stable request.
    Conflict,
}

/// Inbound event completion classification used by receipt mapping.
pub enum CapabilityInboundDisposition {
    /// Event was accepted by the declared application flow.
    Accepted,
    /// Event was already processed and its stored receipt is replayed.
    Duplicate,
    /// Event is valid but processing is delayed by an unavailable dependency.
    Delayed,
    /// Event is valid but requires no new local canonical revision.
    Ignored,
    /// Event was rejected by a stable boundary rule.
    Rejected,
    /// Event schema or contract version is unsupported.
    Unsupported,
    /// Event is quarantined because safe processing is impossible.
    Quarantined,
}

/// Operations job completion classification used by report mapping.
pub enum CapabilityJobDisposition {
    /// The declared job scope completed.
    Completed,
    /// Only part of the declared job scope completed.
    PartiallyCompleted,
    /// The job failed without changing core truth through repair shortcuts.
    Failed,
    /// The job may be retried through the declared retry boundary.
    Retryable,
}

/// Disposition stored alongside a replayable application result surface.
pub enum StoredCapabilityResultDisposition {
    /// Command result or rejection disposition.
    Command(CapabilityCommandDisposition),
    /// Inbound consumer receipt disposition.
    InboundEvent(CapabilityInboundDisposition),
    /// Operations job report disposition.
    OperationsJob(CapabilityJobDisposition),
}
```

`CapabilityReadSubjectRef` 的 variant 均由已存在 typed id 形成,只用于 query visibility / result mapping,不得调用 domain mutation。三类 disposition 与 `StoredCapabilityResultDisposition` 都是 application / protocol marker,不是 domain lifecycle state;带载荷 variant 只承载对应 channel 的 disposition enum,不承载 result body。exact response / receipt / report schema 留给 Step 8。

### 7.11 `contracts` module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 43 个对象字段使用的 id / ref / state / kind 是否有 owner | pass | 具体 safe text newtype 采用 §7.6 pattern;不得退化为裸 `String` |
| public carrier 是否反向依赖 domain | pass | 所有 shared carrier 在 `contracts`;domain 只消费 |
| reference state 是否重复持久化 | pass | 统一 `ReferenceResolutionState` + `ReferenceResolutionValue`;per-kind 只在 Step 10 约束允许子集 |
| enum variant 是否有英文 rustdoc | pass | code block 全部逐 variant 注释;change kind 实现时按表格语义补同等 rustdoc |
| forbidden body 是否可通过 carrier 绕过 | pass | safe text / typed ref / marker 三层约束;Step 7 resolver 和 Step 8 DTO 继续承接 |

---

## 8. `domain::identity` 与 `domain::registry` 对象契约

### 8.1 capability / 功能到对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立稳定 identity | validated identity key、source ref、actor、time | candidate / active identity | 写 identity truth + change record | `CapabilityIdentity`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` | Step 7 identity repository;Step 10 lifecycle |
| 记录 access review fact | identity id、body-free review / risk summary、actor | recorded review fact | append / supersede / invalidate fact | `CapabilityAccessReviewFact` | Step 7 fact repository;Step 8 command |
| 更正 / 合并 / 拆分 / 退役 identity | current identity、expected version、change kind / reason | changed identity + record | mutation only through formal command | `CapabilityIdentity`;`CapabilityIdentityPolicy`;`CapabilityIdentityChangeRecord` | Step 9 flow;Step 11 transaction |
| 注册 / 维护 / 退出 registry | active identity、visibility basis、actor | registry entry + record | lifecycle transition | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | Step 7 registry repository;Step 10 matrix |

| 对象 | 对象类别 | 承接能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|
| `CapabilityIdentity` | aggregate | stable identity lifecycle | provider runtime、URL identity、consumer rewrite |
| `CapabilityAccessReviewFact` | fact | access review and separation fact | governance approval、runtime decision |
| `CapabilityIdentityPolicy` | policy | identity source / mutation guard | policy engine、runtime lookup |
| `ExternalCapabilitySourceRef` | reference | external source identity and locator boundary | source body、provider availability |
| `CapabilityIdentityChangeRecord` | append-only record | identity change explanation | event payload、DB changelog |
| `CapabilityRegistryEntry` | aggregate | registry lifecycle / visibility basis | allowlist、marketplace listing、search truth |
| `RegistryLifecycleState` | state enum | registry state semantics | execution state、governance truth |
| `RegistryVisibilityPolicy` | policy | formal registry visibility prerequisites | runtime authorization |
| `RegistryChangeRecord` | append-only record | registry change explanation | projection body、database audit log |

### 8.2 `CapabilityIdentity`

```rust
/// Stable identity anchor for one externally sourced capability.
pub struct CapabilityIdentity {
    /// Capability-hub owned identity identifier.
    pub capability_identity_id: CapabilityIdentityId,
    /// Stable business key used to detect the same capability identity.
    pub identity_key: CapabilityIdentityKey,
    /// Body-free reference to the external source.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Current identity lifecycle state.
    pub identity_state: CapabilityIdentityState,
    /// Current access review fact when one has been recorded.
    pub review_fact_ref: Option<CapabilityAccessReviewFactRef>,
    /// Optimistic version of the identity truth.
    pub version: Version,
    /// Time when the identity truth was created.
    pub created_at: Timestamp,
    /// Time when the identity truth was last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `capability_identity_id` | `CapabilityIdentityId` | identity primary key | `system_generated`;不得来自 URL / provider name |
| `identity_key` | `CapabilityIdentityKey` | stable identity business key | validated command input;policy 通过后复制 |
| `source_ref_id` | `ExternalCapabilitySourceRefId` | external source owner ref | existing body-free ref;对应 resolution state 不得 forbidden |
| `identity_state` | `CapabilityIdentityState` | identity lifecycle | factory = candidate / active;仅正式 member function 迁移 |
| `review_fact_ref` | `Option<CapabilityAccessReviewFactRef>` | current review linkage | recorded fact same identity;不能表示 governance result |
| `version` | `Version` | optimistic concurrency | create = 1;每次 truth mutation +1 |
| `created_at` / `updated_at` | `Timestamp` | truth time | application clock;update 不得早于 create |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, change_record_id: CapabilityIdentityChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityIdentityChangeRecord, DomainError>` | candidate / unresolved 闭口为 active | application生成record id、trusted actor、safe reason、operation trace、clock time | change record | 只允许 candidate / unresolved -> active;record kind=`Activated`;version +1 |
| `pub fn request_correction(&mut self, change_record_id: CapabilityIdentityChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityIdentityChangeRecord, DomainError>` | 打开正式更正 | application生成record id、actor、非空 reason、operation trace、time | change record | 只允许 active -> correction_pending;record kind=`CorrectionRequested` |
| `pub fn complete_correction(&mut self, change_record_id: CapabilityIdentityChangeRecordId, actor: &ActorContext, new_key: CapabilityIdentityKey, kind: CapabilityIdentityChangeKind, related_identity_refs: Option<CapabilityIdentityRefSet>, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityIdentityChangeRecord, DomainError>` | 完成 corrected / merged / split | application生成record id、actor、新key、限定change kind、optional exact related revisions、reason、operation trace、time | change record | 只允许correction_pending -> active;`Corrected`要求None,`Merged / Split`要求non-empty且排除self;只改target identity |
| `pub fn attach_review_fact(&mut self, change_record_id: CapabilityIdentityChangeRecordId, review_fact: &CapabilityAccessReviewFact, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<CapabilityIdentityChangeRecord, DomainError>` | 更新 current review ref并形成history | application生成record id、same identity recorded fact、deterministic或command safe reason、operation metadata | identity change record | fact必须recorded;record kind=`ReviewFactAttached`;previous / next identity state相同;version +1;不改governance seam |
| `pub fn can_bind_descriptor(&self, descriptor: &AdapterDescriptor) -> bool` | 判断 descriptor identity / registry 链是否一致 | descriptor ref | `bool` | 纯判断,不检查 provider runtime |
| `pub fn retire(&mut self, change_record_id: CapabilityIdentityChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityIdentityChangeRecord, DomainError>` | 退役 identity | application生成record id、actor、reason、operation trace、time | change record | non-retired -> retired;不可恢复 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_from_intake(id: CapabilityIdentityId, identity_key: CapabilityIdentityKey, source_ref: &ExternalCapabilitySourceRef, resolution: &ReferenceResolutionState, policy: &CapabilityIdentityPolicy, now: Timestamp) -> Result<Self, DomainError>` | 从已校验 intake fields 创建 identity | id、key、source ref、canonical resolution、identity policy、time | `Result<CapabilityIdentity, DomainError>` | 必须调用`policy.validate_new_identity(...)`取得唯一initial state：`Resolved -> Active`;`Stale -> Candidate`;`Unresolved / Unavailable -> Unresolved`;`Invalid / Forbidden / Expired`拒绝；version = 1 |

不变量与禁止事项:

- `retired` 不得迁回 active。
- consumer view、runtime、tools、SDK、search、marketplace 都不能调用 mutation member。
- identity 不保存 external endpoint body、provider runtime 或 invocation state。

### 8.3 `CapabilityAccessReviewFact`

```rust
/// Body-free access review fact kept separate from governance approval.
pub struct CapabilityAccessReviewFact {
    /// Stable review fact identifier.
    pub review_fact_id: CapabilityAccessReviewFactId,
    /// Reviewed capability identity.
    pub capability_identity_id: CapabilityIdentityId,
    /// Body-free access review context.
    pub review_context: AccessReviewContext,
    /// Body-free access risk summary.
    pub risk_summary: AccessRiskSummary,
    /// Explicit separation between access review and governance approval.
    pub separation_marker: AccessGovernanceSeparationMarker,
    /// Current review fact state.
    pub state: CapabilityAccessReviewFactState,
    /// Actor that recorded the current fact version.
    pub recorded_by: ActorContext,
    /// Optimistic version of the fact.
    pub version: Version,
    /// Time when the fact was first recorded.
    pub recorded_at: Timestamp,
    /// Time when the fact state last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `review_fact_id` | `CapabilityAccessReviewFactId` | fact identity | system generated |
| `capability_identity_id` | `CapabilityIdentityId` | reviewed subject | existing non-retired identity |
| `review_context` | `AccessReviewContext` | review context | validated body-free command input |
| `risk_summary` | `AccessRiskSummary` | identity-level risk explanation | safe text;不等于 descriptor risk 或 governance result |
| `separation_marker` | `AccessGovernanceSeparationMarker` | responsibility boundary | policy evaluation;recorded 要求 Separated |
| `state` | `CapabilityAccessReviewFactState` | fact lifecycle | draft -> recorded / invalidated;recorded -> superseded / invalidated |
| `recorded_by` | `ActorContext` | actor attribution | command actor;不由 domain 生成 |
| `version` | `Version` | optimistic version | create = 1;state change +1 |
| `recorded_at` / `updated_at` | `Timestamp` | record times | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record(&mut self, now: Timestamp) -> Result<(), DomainError>` | draft -> recorded | clock time | result | 只允许 separation_marker = Separated |
| `pub fn supersede(&mut self, replacement_id: CapabilityAccessReviewFactId, now: Timestamp) -> Result<(), DomainError>` | 旧 fact 标为 superseded | replacement id、time | result | replacement id 不得等于 self id |
| `pub fn invalidate(&mut self, actor: &ActorContext, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 作废 draft / recorded fact | actor、reason、time | result | 不回滚 governance truth |
| `pub fn separates_from_governance(&self) -> bool` | 检查职责分离 | 无 | `bool` | 纯判断 |
| `pub fn summarize_for_descriptor(&self) -> Result<AccessRiskSummary, DomainError>` | 提供 descriptor 可用摘要 | 无 | safe summary | 仅 recorded fact;不含 review body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn draft(id: CapabilityAccessReviewFactId, identity_id: CapabilityIdentityId, context: AccessReviewContext, risk_summary: AccessRiskSummary, marker: AccessGovernanceSeparationMarker, actor: ActorContext, now: Timestamp) -> Result<Self, DomainError>` | 构造 review draft | 完整必填字段 | `Result<CapabilityAccessReviewFact, DomainError>` | RecordCapabilityAccessReviewFact flow |

不变量与禁止事项:

- `recorded` fact 必须保持 `Separated`。
- 不保存 approval、Policy、shared_rules 或 runtime allow / deny。
- superseded / invalidated fact 只供历史读取。

### 8.4 `CapabilityIdentityPolicy`

```rust
/// Guards creation and mutation of capability identities.
pub struct CapabilityIdentityPolicy {
    /// Capability source kinds allowed to participate in identity creation.
    pub allowed_source_types: CapabilitySourceTypeSet,
    /// Source categories that must never define identity truth.
    pub forbidden_identity_sources: ForbiddenIdentitySourceSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `allowed_source_types` | `CapabilitySourceTypeSet` | allowed source kinds | compile-time domain rule;至少含 MCP / A2A / external API |
| `forbidden_identity_sources` | `ForbiddenIdentitySourceSet` | blocked identity sources | compile-time rule;URL-only、runtime config、SDK cache、marketplace listing |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_new_identity(&self, identity_key: &CapabilityIdentityKey, source_ref: &ExternalCapabilitySourceRef, resolution: &ReferenceResolutionState) -> Result<CapabilityIdentityState, DomainError>` | 校验 identity 建立 | key、source ref、canonical state | initial state | 先验证source kind allowlist、`source_ref.resolution_state_id`与state id、subject / `ExternalCapabilitySource` kind对称；然后穷尽映射`Resolved -> Active`,`Stale -> Candidate`,`Unresolved / Unavailable -> Unresolved`;`Invalid / Forbidden / Expired`拒绝 |
| `pub fn validate_correction(&self, identity: &CapabilityIdentity, kind: &CapabilityIdentityChangeKind, related_identities: &[CapabilityIdentity], reason: &ChangeReason) -> Result<(), DomainError>` | 校验更正、合并、拆分 | current identity、kind、从exact refs加载的related identities、reason | result | retired拒绝;kind必须correction family;Corrected无related,Merged / Split至少一项且全部非retired / 非self |
| `pub fn reject_consumer_rewrite(&self, consumer_ref: &CapabilityConsumerRef) -> Result<(), DomainError>` | 明确消费面不可写 | consumer ref | boundary error | 始终返回 boundary violation;无 mutation |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_capability_hub() -> Self` | 构造不可配置化默认 policy | 无 | policy | domain service construction |

不变量与禁止事项:

- policy 只判断,不保存 identity 或访问 repository。
- allowed / forbidden set 不由 runtime config 放宽。
- 不能从 consumer、execution、SDK 或 marketplace 私有状态推导 identity。

### 8.5 `ExternalCapabilitySourceRef`

```rust
/// Body-free reference to an external MCP, A2A, or API capability source.
pub struct ExternalCapabilitySourceRef {
    /// Stable local reference identifier.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Declared external capability source family.
    pub source_kind: ExternalCapabilitySourceKind,
    /// Body-free locator summary.
    pub external_locator: ExternalLocatorSummary,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical resolution state owned by the reference subsystem.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref_id` | `ExternalCapabilitySourceRefId` | local reference id | system generated |
| `source_kind` | `ExternalCapabilitySourceKind` | MCP / A2A / API classification | validated input;不能用 provider runtime kind |
| `external_locator` | `ExternalLocatorSummary` | body-free locator | resolver-safe input;不得含 request / response body |
| `candidate_digest` | `ReferenceCandidateDigest` | candidate duplicate / replacement key | application canonical digest;只覆盖kind + body-free locator,不得包含source body |
| `resolution_state_id` | `ReferenceResolutionStateId` | canonical resolution link | same reference subject;不复制第二份 state value |
| `version` | `Version` | optimistic version | registration / locator change +1 |
| `created_at` / `updated_at` | `Timestamp` | lifecycle time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | 形成 canonical resolution subject | 无 | external source variant | 纯转换 |
| `pub fn supports_descriptor(&self, descriptor: &AdapterDescriptor) -> bool` | 检查 descriptor source / registry 链 | descriptor | bool | 纯判断;不检查 runtime availability |
| `pub fn replace_locator(&mut self, locator: ExternalLocatorSummary, candidate_digest: ReferenceCandidateDigest, resolution_state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free locator / digest / state link | new locator、canonical digest、new state id、time | result | digest必须与kind + locator对称;version +1;旧 locator 不保存在当前 truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: ExternalCapabilitySourceRefId, kind: ExternalCapabilitySourceKind, locator: ExternalLocatorSummary, candidate_digest: ReferenceCandidateDigest, resolution_state_id: ReferenceResolutionStateId, now: Timestamp) -> Self` | 注册 source ref | 已由application / resolver对称校验的完整body-free字段、canonical digest、state id、time | reference | intake / external source consumer；纯组装,无domain失败分支 |

不变量与禁止事项:

- resolution value 只从 `ReferenceResolutionState` 读取。
- 不保存协议正文、production payload、provider health 或 invocation result。

### 8.6 `CapabilityIdentityChangeRecord`

```rust
/// Append-only explanation of one capability identity change.
pub struct CapabilityIdentityChangeRecord {
    /// Stable change record identifier.
    pub change_record_id: CapabilityIdentityChangeRecordId,
    /// Changed capability identity.
    pub capability_identity_id: CapabilityIdentityId,
    /// Identity change classification.
    pub change_kind: CapabilityIdentityChangeKind,
    /// State before the change.
    pub previous_state: Option<CapabilityIdentityState>,
    /// State after the change.
    pub next_state: CapabilityIdentityState,
    /// Exact related identity revisions for merge or split correction evidence.
    pub related_identity_refs: Option<CapabilityIdentityRefSet>,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `change_record_id` | `CapabilityIdentityChangeRecordId` | append-only identity | same transaction system id |
| `capability_identity_id` | `CapabilityIdentityId` | changed subject | current identity id |
| `change_kind` | `CapabilityIdentityChangeKind` | semantic change type | exact member function input / create |
| `previous_state` / `next_state` | `Option<CapabilityIdentityState>` / `CapabilityIdentityState` | transition snapshot | copied before / after mutation;create has None previous |
| `related_identity_refs` | `Option<CapabilityIdentityRefSet>` | merge / split relation evidence | `Merged / Split`必须Some non-empty;其他kind必须None;exact refs不得含self |
| `change_reason` | `ChangeReason` | human / system explanation | command input or deterministic system reason |
| `actor_context` | `ActorContext` | attribution | operation context actor |
| `trace_id` | `TraceId` | cross-record trace | operation context trace |
| `recorded_at` | `Timestamp` | append time | same application clock value as truth update |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn explains_identity(&self, identity: &CapabilityIdentity) -> bool` | 检查 subject / next state 是否匹配 | identity | bool | 纯判断 |
| `pub fn can_rebuild_read_model(&self) -> bool` | 判断记录是否属于已闭口 change kind | 无 | bool | forbidden / invalid body 不影响 record body-free |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: CapabilityIdentityChangeRecordId, identity_id: CapabilityIdentityId, kind: CapabilityIdentityChangeKind, previous: Option<CapabilityIdentityState>, next: CapabilityIdentityState, related_identity_refs: Option<CapabilityIdentityRefSet>, reason: ChangeReason, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 append-only record | 完整transition metadata + optional merge / split evidence | record | identity transaction;kind与related refs必须对称 |

不变量与禁止事项:

- 创建后不可 mutation;replacement 通过新 record。
- 不携带 source body、event payload 或 database diff。
- transition 必须能被 Step 10 matrix 接受。
- related identity refs只证明target correction与哪些exact identity revisions有关,不自动更改、退役或建立canonical redirect；若未来需要redirect truth,必须回开概要对象设计,不得从history记录反推。

### 8.7 `CapabilityRegistryEntry`

```rust
/// Registry truth for one stable capability identity.
pub struct CapabilityRegistryEntry {
    /// Stable registry entry identifier.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Stable capability identity registered by this entry.
    pub capability_identity_id: CapabilityIdentityId,
    /// Current registry lifecycle state.
    pub lifecycle_state: RegistryLifecycleState,
    /// Explanation for the current lifecycle state.
    pub lifecycle_reason: ChangeReason,
    /// Time when the current lifecycle state became effective.
    pub lifecycle_effective_at: Timestamp,
    /// Body-free basis used for registry visibility evaluation.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Current descriptor reference when one is accepted.
    pub descriptor_ref: Option<AdapterDescriptorRef>,
    /// Optimistic version of the registry truth.
    pub version: Version,
    /// Time when the registry entry was created.
    pub created_at: Timestamp,
    /// Time when the registry entry last changed.
    pub updated_at: Timestamp,
}
```

`RegistryLifecycleState` 在概要中曾表现为带 `state_reason / effective_at` 的对象骨架。详细设计将它收口为单一 enum,reason 和 effective time 移到 `CapabilityRegistryEntry`;这样避免 self-wrapping state object,同时保持状态来源完整。

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `registry_entry_id` | `CapabilityRegistryEntryId` | registry truth id | system generated |
| `capability_identity_id` | `CapabilityIdentityId` | stable identity anchor | active identity only |
| `lifecycle_state` | `RegistryLifecycleState` | current registry state | member transition only |
| `lifecycle_reason` | `ChangeReason` | state reason | command or deterministic prerequisite reason |
| `lifecycle_effective_at` | `Timestamp` | state effective time | same clock as transition |
| `visibility_basis` | `RegistryVisibilityBasis` | body-free visibility basis | policy-safe input;不是 governance approval |
| `descriptor_ref` | `Option<AdapterDescriptorRef>` | current descriptor link | accepted descriptor for same entry |
| `version` | `Version` | optimistic version | create = 1;mutation +1 |
| `created_at` / `updated_at` | `Timestamp` | truth time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn bind_descriptor(&mut self, change_record_id: RegistryChangeRecordId, descriptor: &AdapterDescriptor, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<RegistryChangeRecord, DomainError>` | 原子绑定 accepted descriptor并重开正式可见性前置判断 | application生成record id、same entry descriptor、safe reason、actor、trace、time | record | descriptor必须accepted且entry非retired；同一次mutation设置`descriptor_ref`、`lifecycle_state = VisibilityPending`、`lifecycle_reason`、`lifecycle_effective_at`与`updated_at`；record kind=`DescriptorBound`,previous为调用前state,next固定`VisibilityPending`;version只+1 |
| `pub fn transition_lifecycle(&mut self, change_record_id: RegistryChangeRecordId, target: RegistryLifecycleState, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<RegistryChangeRecord, DomainError>` | 执行 registry transition | application生成record id、target、reason、actor、trace、time | record | Step 10 matrix guard;version +1 |
| `pub fn apply_visibility_basis(&mut self, change_record_id: RegistryChangeRecordId, basis: RegistryVisibilityBasis, policy: &RegistryVisibilityPolicy, context: &VisibilityContext, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<RegistryChangeRecord, DomainError>` | 更新visibility basis并重新打开正式前置判断 | application生成record id、basis、policy、context、safe reason、metadata | record | policy只校验body-free basis/context;non-retired entry更新后进入`VisibilityPending`;不得直接形成`FormalVisible` |
| `pub fn retire(&mut self, change_record_id: RegistryChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<RegistryChangeRecord, DomainError>` | 退出 registry | application生成record id、actor、reason、trace、time | record | -> retired;identity history 保留 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: CapabilityRegistryEntryId, change_record_id: RegistryChangeRecordId, identity: &CapabilityIdentity, basis: RegistryVisibilityBasis, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<(Self, RegistryChangeRecord), DomainError>` | active identity 注册 | application生成entry / record id、identity、basis、safe reason、metadata | entry + created record | RegisterCapabilityInRegistry |

不变量与禁止事项:

- 只能绑定 active identity;retired identity 不得注册。
- `bind_descriptor(...)`是descriptor link与registry `VisibilityPending` reopening的唯一原子入口。application不得在其后为同一次descriptor绑定再调用`transition_lifecycle(..., VisibilityPending)`；即使调用前已是`VisibilityPending`,descriptor ref实际变化仍形成一条previous / next均为`VisibilityPending`的`DescriptorBound`record并只增加一次version。
- registry state 不由 search、runtime cache、allowlist 或 marketplace listing 决定。
- reconciliation report 不可调用 truth mutation member。

### 8.8 `RegistryLifecycleState`

`RegistryLifecycleState` 的完整 enum 与 variant rustdoc 见 §7.8。本对象的实现能力通过 enum `impl` 闭口:

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn allows_descriptor_update(&self) -> bool` | 判断 descriptor 是否可更新 | 无 | bool | retired 返回 false |
| `pub fn allows_formal_exposure_evaluation(&self) -> bool` | 判断能否进入 exposure 前置评估 | 无 | bool | registered / visibility_pending / formal_visible 可评估;draft / retired 不可 |
| `pub fn is_terminal(&self) -> bool` | 判断终态 | 无 | bool | 仅 retired 为 true |
| `pub fn can_transition_to(&self, target: &RegistryLifecycleState) -> bool` | Step 10 matrix guard 的对象入口 | target state | bool | current方向为`Registered -> Undescribed / Ungoverned / VisibilityPending / FormalVisible / Retired`;`Undescribed -> VisibilityPending / Retired`;`Ungoverned -> Undescribed / VisibilityPending / Retired`;`VisibilityPending -> Undescribed / Ungoverned / FormalVisible / Retired`;`FormalVisible -> Undescribed / VisibilityPending / Retired`;same-state false；`Draft`方向reserved；`Retired`全部false；application authority仍限制FormalVisible只有exposure service可请求 |

不变量与禁止事项:

- enum 不携带 reason / time;这些属于 registry entry 当前 state context。
- `FormalVisible` 不等于 runtime allow、provider availability 或 marketplace listing。

### 8.9 `RegistryVisibilityPolicy`

```rust
/// Guards registry visibility without creating governance or runtime decisions.
pub struct RegistryVisibilityPolicy {
    /// Formal truth prerequisites required by registry visibility evaluation.
    pub required_preconditions: FormalExposureTruthInputSet,
    /// Sources that must never define registry visibility.
    pub forbidden_visibility_sources: ForbiddenVisibilitySourceSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_preconditions` | `FormalExposureTruthInputSet` | identity / descriptor / seam / relation / exposure prerequisites | compile-time policy set;不读取配置 |
| `forbidden_visibility_sources` | `ForbiddenVisibilitySourceSet` | blocked sources | runtime cache、allowlist、search、marketplace、provider health |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_visibility_basis(&self, entry: &CapabilityRegistryEntry, basis: &RegistryVisibilityBasis, context: &VisibilityContext) -> Result<(), DomainError>` | 校验registry visibility输入边界 | entry、body-free basis/context | result | pure;不得根据caller context声称formal prerequisites已成立 |
| `pub fn validate_transition(&self, current: &RegistryLifecycleState, target: &RegistryLifecycleState) -> Result<(), DomainError>` | 检查 visibility transition | current / target | result | 不允许 draft / undescribed / ungoverned -> formal_visible |
| `pub fn reject_marketplace_rewrite(&self, marketplace_ref: &EcosystemContextRef) -> Result<(), DomainError>` | 拒绝 listing 反写 | ecosystem ref | boundary error | 始终不产生 visible truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_policy() -> Self` | 构造不可配置化默认 policy | 无 | policy | registry service construction |

不变量与禁止事项:

- policy 只判断,不拥有 registry truth 或 governance truth。
- config 不得移除 required prerequisite 或允许 forbidden source。
- `FormalVisible`只能由`exposure_service`加载exact descriptor、governance seam、optional method relation、formal exposure和visibility fact并通过`FormalExposurePolicy`后调用`transition_lifecycle`;registry command中的caller `VisibilityContext`不是formal truth source。

### 8.10 `RegistryChangeRecord`

```rust
/// Append-only explanation of one capability registry change.
pub struct RegistryChangeRecord {
    /// Stable registry change record identifier.
    pub registry_change_record_id: RegistryChangeRecordId,
    /// Changed registry entry.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Registry change classification.
    pub change_kind: RegistryChangeKind,
    /// Lifecycle state before the change.
    pub previous_state: Option<RegistryLifecycleState>,
    /// Lifecycle state after the change.
    pub next_state: RegistryLifecycleState,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `registry_change_record_id` | `RegistryChangeRecordId` | append-only id | same transaction system id |
| `registry_entry_id` | `CapabilityRegistryEntryId` | changed subject | current entry id |
| `change_kind` | `RegistryChangeKind` | semantic change | exact registry member / factory source |
| `previous_state` / `next_state` | state snapshot | transition explanation | copied before / after;register previous None |
| `change_reason` | `ChangeReason` | explanation | command / policy-derived reason |
| `actor_context` | `ActorContext` | attribution | operation actor |
| `trace_id` | `TraceId` | trace link | operation trace |
| `recorded_at` | `Timestamp` | append time | same clock as truth mutation |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn explains_entry(&self, entry: &CapabilityRegistryEntry) -> bool` | 检查 subject / next state | entry | bool | 纯判断；`DescriptorBound`以next=`VisibilityPending`解释同一次原子绑定后的最终entry revision |
| `pub fn can_feed_reconciliation(&self) -> bool` | 判断能否作为 derived reconciliation source | 无 | bool | true for all valid body-free change kinds |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: RegistryChangeRecordId, entry_id: CapabilityRegistryEntryId, kind: RegistryChangeKind, previous: Option<RegistryLifecycleState>, next: RegistryLifecycleState, reason: ChangeReason, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 registry change record | complete transition metadata | record | same registry transaction |

不变量与禁止事项:

- append-only;不保存 search projection 或 database diff。
- reconciliation 只能读取 record,不能修改 record 或 registry truth。

### 8.11 identity / registry object capability map

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | state | 字段来源 |
|---|---|---|---|---|---|---|
| `CapabilityIdentity` | establish / correct / retire | id、key、source、state、review、version、time | `create_from_intake` | activate / correction / attach review / retire | `CapabilityIdentityState` | system + command + ref + core metadata |
| `CapabilityAccessReviewFact` | record / supersede / invalidate | id、identity、context、risk、marker、state、actor、version、time | `draft` | record / supersede / invalidate | `CapabilityAccessReviewFactState` | command + policy + core metadata |
| `ExternalCapabilitySourceRef` | register / replace locator | id、kind、locator、candidate digest、resolution state id、version、time | `register` | subject_ref / replace_locator | canonical reference state | resolver-safe copy + application canonical digest |
| `CapabilityIdentityChangeRecord` | explain identity change | record id、subject、kind、states、reason、actor、trace、time | `append` | explain / rebuild eligibility | append-only | same-tx constructed |
| `CapabilityRegistryEntry` | register / bind descriptor / transition / retire | id、identity、state context、basis、descriptor、version、time | `register` | bind / transition / visibility / retire | `RegistryLifecycleState` | accepted truth + command + core metadata |
| `RegistryVisibilityPolicy` | evaluate / guard | required / forbidden sets | `default_policy` | evaluate / validate / reject | stateless policy | compile-time invariant |
| `RegistryChangeRecord` | explain registry change | record id、entry、kind、states、reason、actor、trace、time | `append` | explain / reconcile source | append-only | same-tx constructed |

### 8.12 identity / registry module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否有对象承接 | pass | establish / review / correction / retirement / register / visibility / history 全部有 owner |
| 字段来源是否闭合 | pass | id、actor、trace、time、version、ref、reason、state source 均已点名 |
| 状态是否闭合 | pass | enum 在 §7.8;registry reason / effective time 已合理移到 aggregate |
| 边界是否越权 | pass | 未引入 provider runtime、approval、allowlist、listing、search truth |
| Step 7 接缝 | pending_handoff | identity / review / source-ref / history / registry repositories;source resolver;UoW |

---

## 9. `domain::descriptor` 与 `domain::governance_method` 对象契约

### 9.1 capability / 功能到对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立 / 替换 descriptor | registry、source ref、body-free boundary summary | descriptor truth + change record | draft / accepted / unresolved / replaced / retired | `AdapterDescriptor`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` | descriptor repository;document resolver |
| 记录 risk / constraint summary | descriptor、recorded review fact | safe summary | available / partial / unavailable / superseded | `DescriptorRiskConstraintSummary` | summary repository;exposure query |
| 登记 secret ref / safe summary | external secret ref、allowed safe input | body-free ref + safe summary | canonical ref state;safe summary freshness | `SecretRef`;`SecretHandlingSafeSummary` | secret resolver;safe summary store |
| 建立 governance seam | identity、governance result ref、allowed summary | relation truth + record | pending / active / unresolved / expired / forbidden | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`GovernanceSeamChangeRecord` | governance resolver / repository |
| 建立 body-free method relation | identity、method asset ref、relation scope | relation truth + record | pending / active / stale / removed / unresolved / forbidden | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`MethodRelationChangeRecord` | method resolver / repository |

### 9.2 `AdapterDescriptor`

```rust
/// Accepted body-free description of how a registered capability is accessed.
pub struct AdapterDescriptor {
    /// Stable adapter descriptor identifier.
    pub adapter_descriptor_id: AdapterDescriptorId,
    /// Registry entry described by this descriptor.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// External source reference supporting the descriptor.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Declared descriptor family.
    pub descriptor_kind: AdapterDescriptorKind,
    /// Body-free connection boundary summary.
    pub connection_boundary_summary: ConnectionBoundarySummary,
    /// Current risk and constraint summary when available.
    pub risk_summary_id: Option<DescriptorRiskConstraintSummaryId>,
    /// Current body-free secret reference when required.
    pub secret_ref_id: Option<SecretRefId>,
    /// Current descriptor lifecycle state.
    pub state: AdapterDescriptorState,
    /// Optimistic version of the descriptor truth.
    pub version: Version,
    /// Time when the descriptor was created.
    pub created_at: Timestamp,
    /// Time when the descriptor last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `adapter_descriptor_id` | `AdapterDescriptorId` | descriptor truth id | system generated |
| `registry_entry_id` | `CapabilityRegistryEntryId` | described entry | existing non-retired registry entry |
| `source_ref_id` | `ExternalCapabilitySourceRefId` | external source link | same capability chain;canonical state non-forbidden |
| `descriptor_kind` | `AdapterDescriptorKind` | MCP / A2A / API family | validated command input;must match source kind |
| `connection_boundary_summary` | `ConnectionBoundarySummary` | body-free access boundary | command safe input;forbidden-body scan |
| `risk_summary_id` | optional summary id | current risk summary | same descriptor;superseded summary 不可 current |
| `secret_ref_id` | optional secret ref id | credential boundary ref | body-free ref only;不读取 value |
| `state` | `AdapterDescriptorState` | descriptor lifecycle | member transition only |
| `version` | `Version` | optimistic version | create = 1;truth mutation +1 |
| `created_at` / `updated_at` | `Timestamp` | truth time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn accept(&mut self, change_record_id: DescriptorChangeRecordId, policy: &DescriptorBoundaryPolicy, source: &ExternalCapabilitySourceRef, resolution: &ReferenceResolutionState, reason: ChangeReason, marker: SensitiveBoundaryMarker, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | draft / unresolved -> accepted | application生成record id、policy、source、state、safe reason、scanner marker、metadata | change record | record kind=`Created` when previous draft,otherwise `Accepted`;kind/source match;body-free;version +1 |
| `pub fn mark_unresolved(&mut self, change_record_id: DescriptorChangeRecordId, reason: ChangeReason, marker: SensitiveBoundaryMarker, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | source或supporting document当前不可解析 | application生成record id、body-free reason、scanner marker、metadata | change record | draft / accepted -> unresolved;record kind=`MarkedUnresolved`;不保存resolver body;version +1 |
| `pub fn attach_risk_summary(&mut self, change_record_id: DescriptorChangeRecordId, summary: &DescriptorRiskConstraintSummary, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | 设置 current risk summary | application生成record id、same descriptor summary、safe reason、metadata;record marker复制summary marker | record | persisted descriptor只允许`Accepted / Unresolved`;summary non-superseded且id必须形成actual replacement;descriptor lifecycle保持不变,version +1 |
| `pub fn attach_secret_ref(&mut self, change_record_id: DescriptorChangeRecordId, secret_ref: &SecretRef, resolution: &ReferenceResolutionState, reason: ChangeReason, marker: SensitiveBoundaryMarker, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | 关联 secret ref | application生成record id、ref、canonical state、safe reason、scanner marker、metadata | record | persisted descriptor只允许`Accepted / Unresolved`且current secret ref必须为空;state forbidden拒绝;不读取secret body；lifecycle保持不变,version +1 |
| `pub fn replace_with(&mut self, change_record_id: DescriptorChangeRecordId, replacement_id: AdapterDescriptorId, actor: &ActorContext, reason: ChangeReason, marker: SensitiveBoundaryMarker, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | 当前 descriptor -> replaced | application生成record id、new descriptor id、actor、reason、safe marker、trace、time | record | 只允许persisted current `Accepted / Unresolved -> Replaced`;replacement id different;current becomes terminal |
| `pub fn retire(&mut self, change_record_id: DescriptorChangeRecordId, actor: &ActorContext, reason: ChangeReason, marker: SensitiveBoundaryMarker, trace_id: TraceId, now: Timestamp) -> Result<DescriptorChangeRecord, DomainError>` | descriptor 退役 | application生成record id、actor、reason、safe marker、trace、time | record | 只允许`Draft / Accepted / Unresolved -> Retired`;`Replaced / Retired`拒绝且不修改字段 / version / time |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn draft_for_entry(id: AdapterDescriptorId, entry: &CapabilityRegistryEntry, source: &ExternalCapabilitySourceRef, kind: AdapterDescriptorKind, boundary: ConnectionBoundarySummary, now: Timestamp) -> Result<Self, DomainError>` | 创建 descriptor draft | id、entry、source、kind、safe boundary、time | descriptor | EstablishAdapterDescriptor |

不变量与禁止事项:

- descriptor 不保存 endpoint request / response schema、quota、route、cost、failover、retry、provider availability 或 secret body。
- replaced / retired 不得恢复 accepted。
- `risk_summary_id` / `secret_ref_id` 只能指向相同 capability chain。

### 9.3 `DescriptorRiskConstraintSummary`

```rust
/// Body-free risk and constraint summary associated with an adapter descriptor.
pub struct DescriptorRiskConstraintSummary {
    /// Stable summary identifier.
    pub summary_id: DescriptorRiskConstraintSummaryId,
    /// Descriptor summarized by this object.
    pub adapter_descriptor_id: AdapterDescriptorId,
    /// Coarse risk classification.
    pub risk_level: DescriptorRiskLevel,
    /// Body-free access constraint summary.
    pub constraint_summary: CapabilityConstraintSummary,
    /// Sensitive body boundary classification.
    pub sensitive_boundary_marker: SensitiveBoundaryMarker,
    /// Current summary availability state.
    pub state: DescriptorRiskConstraintSummaryState,
    /// Optimistic version of the summary.
    pub version: Version,
    /// Time when the summary was created.
    pub created_at: Timestamp,
    /// Time when the summary last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `summary_id` | `DescriptorRiskConstraintSummaryId` | summary id | system generated |
| `adapter_descriptor_id` | `AdapterDescriptorId` | summary owner | existing draft / accepted descriptor |
| `risk_level` | `DescriptorRiskLevel` | coarse risk | review + descriptor safe derivation;unknown when insufficient |
| `constraint_summary` | `CapabilityConstraintSummary` | body-free constraints | safe derivation;不生成 Policy truth |
| `sensitive_boundary_marker` | `SensitiveBoundaryMarker` | sensitive boundary | policy scanner result;ForbiddenBody 不能 available |
| `state` | summary state | availability | member transition only |
| `version` | `Version` | optimistic version | create = 1;state change +1 |
| `created_at` / `updated_at` | `Timestamp` | summary time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_safe_for_consumer_view(&self) -> bool` | 检查 consumer exposure | 无 | bool | available + non-forbidden marker only |
| `pub fn requires_governance_attention(&self) -> bool` | 判断需治理接缝解释 | 无 | bool | high / critical / unknown 或 non-available |
| `pub fn mark_partial(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 标记 partial | reason、time | result | 只允许`Available / Unavailable -> Partial`;same-state与Superseded拒绝;version +1 |
| `pub fn mark_unavailable(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 标记 unavailable | reason、time | result | 只允许`Available / Partial -> Unavailable`;same-state与Superseded拒绝,不得转成Low risk;version +1 |
| `pub fn supersede(&mut self, replacement_id: DescriptorRiskConstraintSummaryId, now: Timestamp) -> Result<(), DomainError>` | 旧 summary terminal | replacement、time | result | 只允许`Available / Partial / Unavailable -> Superseded`;replacement different |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn derive(id: DescriptorRiskConstraintSummaryId, descriptor: &AdapterDescriptor, review: &CapabilityAccessReviewFact, risk_level: DescriptorRiskLevel, constraints: CapabilityConstraintSummary, marker: SensitiveBoundaryMarker, now: Timestamp) -> Result<Self, DomainError>` | 从 descriptor + recorded review 构造 | persisted `Accepted / Unresolved` descriptor、current `Recorded / Separated` review、complete safe fields | summary | `Low / Medium / High / Critical` + `BodyFree / ReferenceOnly`形成`Available`;`Unknown` + non-forbidden marker形成`Partial`;`ForbiddenBody`或owner / review不对称拒绝且不创建；create version=1 |

不变量与禁止事项:

- `Unknown`永远形成`Partial`,不得形成`Available`或伪装低风险；safe constraint仍必须非空。
- 不保存 approval、secret、protocol body 或 provider runtime data。

### 9.4 `SecretRef`

```rust
/// Body-free reference to an externally managed secret.
pub struct SecretRef {
    /// Stable local secret reference identifier.
    pub secret_ref_id: SecretRefId,
    /// Body-free reference to the external secret provider.
    pub secret_provider_ref: ExternalSecretProviderRef,
    /// Allowed usage scope summary.
    pub secret_usage_scope: SecretUsageScopeSummary,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `secret_ref_id` | `SecretRefId` | local ref id | system generated |
| `secret_provider_ref` | `ExternalSecretProviderRef` | external provider pointer | resolver-safe input;不得包含 secret path credentials |
| `secret_usage_scope` | `SecretUsageScopeSummary` | body-free usage boundary | command safe input |
| `candidate_digest` | `ReferenceCandidateDigest` | candidate duplicate / replacement key | application canonical digest;只覆盖provider ref + safe usage scope,不得包含secret material |
| `resolution_state_id` | `ReferenceResolutionStateId` | canonical state link | subject must be this secret ref |
| `version` | `Version` | optimistic version | registration change +1 |
| `created_at` / `updated_at` | `Timestamp` | reference time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical reference subject | 无 | secret variant | pure conversion |
| `pub fn allows_available_safe_summary(&self, state: &ReferenceResolutionState) -> bool` | 判断能否构造available safe summary | canonical state | bool | resolved only;never reads value |
| `pub fn allows_unavailable_safe_summary(&self, state: &ReferenceResolutionState) -> bool` | 判断能否保留body-free unavailable summary | canonical state | bool | unresolved / stale / unavailable only;invalid / forbidden拒绝 |
| `pub fn replace_provider_ref(&mut self, provider_ref: ExternalSecretProviderRef, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free provider ref / digest / state link | safe provider ref、canonical digest、state id、time | result | existing usage scope保持不变;digest必须与new provider + stored scope对称;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: SecretRefId, provider_ref: ExternalSecretProviderRef, usage_scope: SecretUsageScopeSummary, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Self` | 注册 secret ref | 已由application / resolver对称校验的complete body-free fields、canonical digest、state id、time | ref | AttachDescriptorSecretReference；纯组装,无domain失败分支 |

不变量与禁止事项:

- struct 不得增加 secret value、token、password、private key、ciphertext 或 decryption material 字段。
- 本对象不实现 KMS / Vault lifecycle、rotation 或 access policy。

### 9.5 `SecretHandlingSafeSummary`

```rust
/// Consumer-safe description of secret handling without secret material.
pub struct SecretHandlingSafeSummary {
    /// Stable safe summary identifier.
    pub safe_summary_id: SecretHandlingSafeSummaryId,
    /// Secret reference described by this summary.
    pub secret_ref_id: SecretRefId,
    /// Body-free secret handling boundary.
    pub handling_boundary: SecretHandlingBoundarySummary,
    /// Exposure classification of the safe summary.
    pub exposure_safety_marker: ExposureSafetyMarker,
    /// Current safe summary state.
    pub state: SecretHandlingSafeSummaryState,
    /// Optimistic version of the summary.
    pub version: Version,
    /// Time when the summary was created.
    pub created_at: Timestamp,
    /// Time when the summary was last refreshed.
    pub refreshed_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `safe_summary_id` | `SecretHandlingSafeSummaryId` | summary id | system generated |
| `secret_ref_id` | `SecretRefId` | reference owner | existing secret ref |
| `handling_boundary` | `SecretHandlingBoundarySummary` | allowed handling description | safe input + scanner;no secret material |
| `exposure_safety_marker` | `ExposureSafetyMarker` | consumer exposure gate | policy output |
| `state` | safe summary state | availability / freshness | member transition only |
| `version` | `Version` | optimistic version | create = 1;refresh / state change +1 |
| `created_at` / `refreshed_at` | `Timestamp` | build / refresh time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_displayable_to_consumer(&self) -> bool` | consumer-safe 判断 | 无 | bool | available + ConsumerSafe only |
| `pub fn mark_stale(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 标记 stale | reason、time | result | available -> stale;version +1 |
| `pub fn mark_unavailable(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 标记 unavailable | reason、time | result | 只允许`Available / Stale -> Unavailable`;same-state与Forbidden拒绝;version +1 |
| `pub fn forbid(&mut self, reason: ForbiddenBodyReason, now: Timestamp) -> Result<(), DomainError>` | 阻断当前 summary | reason、time | result | 只允许`Available / Stale / Unavailable -> Forbidden`;marker -> Forbidden;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(id: SecretHandlingSafeSummaryId, secret_ref: &SecretRef, state: &ReferenceResolutionState, boundary: SecretHandlingBoundarySummary, marker: ExposureSafetyMarker, now: Timestamp) -> Result<Self, DomainError>` | 创建safe summary | ref、canonical state、safe fields | summary | resolved + non-forbidden marker -> `Available`;unresolved / stale / unavailable -> `Unavailable`;invalid / forbidden state或Forbidden marker拒绝且不保存body |

不变量与禁止事项:

- only body-free safe text;禁止 secret body / encrypted body / key id that grants access。
- forbidden summary 对当前 candidate terminal;修复必须新建 safe summary。

### 9.6 `DescriptorBoundaryPolicy`

```rust
/// Guards adapter descriptors and secret summaries against provider-runtime shape.
pub struct DescriptorBoundaryPolicy {
    /// Descriptor fields that must never enter capability-hub truth.
    pub forbidden_descriptor_fields: ForbiddenDescriptorFieldSet,
    /// Body-free summary categories allowed in a descriptor.
    pub allowed_summary_kinds: DescriptorSummaryKindSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `forbidden_descriptor_fields` | `ForbiddenDescriptorFieldSet` | forbidden field taxonomy | compile-time rule:secret body / quota / route / cost / failover / runtime state / payload |
| `allowed_summary_kinds` | `DescriptorSummaryKindSet` | allowed safe summary taxonomy | compile-time rule |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_descriptor(&self, descriptor: &AdapterDescriptor) -> Result<(), DomainError>` | descriptor shape guard | descriptor | result | pure validation |
| `pub fn assert_secret_reference_allowed(&self, secret_ref: &SecretRef, summary: Option<&SecretHandlingSafeSummary>) -> Result<(), DomainError>` | secret boundary guard | ref + optional safe summary | result | never resolves body |
| `pub fn reject_provider_contract_shape(&self, candidate: &DescriptorShapeCandidate) -> Result<(), DomainError>` | explicit old-shape rejection | candidate shape summary | boundary error | pure validation |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_adapter_descriptor() -> Self` | 构造不可配置化 descriptor policy | 无 | policy | descriptor service construction |

不变量与禁止事项:

- policy 不读取配置或 external provider。
- forbidden set 不能被 `04` 配置放宽。

### 9.7 `DescriptorChangeRecord`

```rust
/// Append-only explanation of one adapter descriptor change.
pub struct DescriptorChangeRecord {
    /// Stable descriptor change record identifier.
    pub descriptor_change_record_id: DescriptorChangeRecordId,
    /// Changed adapter descriptor.
    pub adapter_descriptor_id: AdapterDescriptorId,
    /// Descriptor change classification.
    pub change_kind: DescriptorChangeKind,
    /// Descriptor state before the change.
    pub previous_state: Option<AdapterDescriptorState>,
    /// Descriptor state after the change.
    pub next_state: AdapterDescriptorState,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Sensitive boundary classification at change time.
    pub boundary_marker: SensitiveBoundaryMarker,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段组 | 来源 / 约束 |
|---|---|
| id / subject / kind | same descriptor transaction;system id + exact member change kind |
| previous / next state | copied before / after mutation;create previous None |
| reason / boundary marker | command or deterministic policy reason;must remain body-free |
| actor / trace / time | application operation context + same clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn explains_descriptor(&self, descriptor: &AdapterDescriptor) -> bool` | subject / next state match | descriptor | bool | pure |
| `pub fn is_sensitive_change(&self) -> bool` | secret ref / safe summary change detection | 无 | bool | kind-based;does not expose body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: DescriptorChangeRecordId, descriptor_id: AdapterDescriptorId, kind: DescriptorChangeKind, previous: Option<AdapterDescriptorState>, next: AdapterDescriptorState, reason: ChangeReason, marker: SensitiveBoundaryMarker, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 change record | complete body-free metadata | record | descriptor transaction |

不变量与禁止事项:

- append-only;不记录 secret diff、provider response 或 runtime audit。
- `boundary_marker == ForbiddenBody` 的 candidate 不得保存 forbidden body,只保存 marker / reason。

### 9.8 `GovernanceSeamRelation`

```rust
/// Body-free relation between a capability identity and an external governance result.
pub struct GovernanceSeamRelation {
    /// Stable governance seam relation identifier.
    pub governance_seam_relation_id: GovernanceSeamRelationId,
    /// Capability side of the relation.
    pub capability_identity_id: CapabilityIdentityId,
    /// Governance result reference side of the relation.
    pub governance_result_ref_id: GovernanceResultRefId,
    /// Current governance seam lifecycle state.
    pub seam_state: GovernanceSeamState,
    /// Allowed body-free governance summary.
    pub allowed_safe_summary: GovernanceSafeSummary,
    /// Optimistic version of the relation truth.
    pub version: Version,
    /// Time when the relation was created.
    pub created_at: Timestamp,
    /// Time when the relation last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `governance_seam_relation_id` | `GovernanceSeamRelationId` | relation truth id | system generated |
| `capability_identity_id` | `CapabilityIdentityId` | capability relation endpoint | active identity |
| `governance_result_ref_id` | `GovernanceResultRefId` | governance endpoint | registered body-free ref |
| `seam_state` | `GovernanceSeamState` | relation lifecycle | canonical ref state + policy drive transition |
| `allowed_safe_summary` | `GovernanceSafeSummary` | body-free governance explanation | resolver-safe copy;no approval / Policy body |
| `version` | `Version` | optimistic version | create = 1;mutation +1 |
| `created_at` / `updated_at` | `Timestamp` | truth time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, change_record_id: GovernanceSeamChangeRecordId, governance_ref: &GovernanceResultRef, resolution: &ReferenceResolutionState, policy: &GovernanceSeamPolicy, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<GovernanceSeamChangeRecord, DomainError>` | pending / unresolved / expired -> active | application生成record id、ref、canonical state、policy、safe reason、metadata | record | pending uses `Attached`;unresolved / expired use `Reactivated`;resolved + boundary pass;version +1 |
| `pub fn mark_unresolved(&mut self, change_record_id: GovernanceSeamChangeRecordId, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<GovernanceSeamChangeRecord, DomainError>` | 标记 unresolved | application生成record id、metadata | record | active / pending / expired -> unresolved |
| `pub fn mark_expired(&mut self, change_record_id: GovernanceSeamChangeRecordId, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<GovernanceSeamChangeRecord, DomainError>` | 标记 expired | application生成record id、metadata | record | active -> expired |
| `pub fn forbid(&mut self, change_record_id: GovernanceSeamChangeRecordId, reason: ForbiddenBodyReason, change_reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<GovernanceSeamChangeRecord, DomainError>` | 阻断越界 candidate | application生成record id、typed forbidden reason、body-free record reason、metadata | record | 只允许pending / active / unresolved / expired -> forbidden；no body saved；replaced / forbidden拒绝 |
| `pub fn replace_with(&mut self, change_record_id: GovernanceSeamChangeRecordId, replacement_id: GovernanceSeamRelationId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<GovernanceSeamChangeRecord, DomainError>` | 当前 seam 被替换 | application生成record id、new relation id、metadata | record | 只允许pending / active / unresolved / expired；replacement id必须different且replacement separate object已独立闭合为active；old relation进入`Replaced`、version +1并成为historical terminal；forbidden / replaced拒绝 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(id: GovernanceSeamRelationId, identity: &CapabilityIdentity, governance_ref: &GovernanceResultRef, summary: GovernanceSafeSummary, now: Timestamp) -> Result<Self, DomainError>` | 创建 pending relation | id、active identity、ref、safe summary、time | relation | AttachGovernanceSeamRelation |

不变量与禁止事项:

- relation 不拥有 approval、Policy effective fact、shared_rules 或 runtime decision。
- inbound governance event 只能更新 ref state / command intent,不能直接调用 relation mutation。
- `Replaced` relation不得重新active、expire、unresolve、forbid或再次replace；重新关联必须创建另一条独立relation。

### 9.9 `GovernanceResultRef`

```rust
/// Body-free reference to an external governance or policy result.
pub struct GovernanceResultRef {
    /// Stable local governance result reference identifier.
    pub governance_result_ref_id: GovernanceResultRefId,
    /// Body-free classification of the referenced governance result.
    pub governance_ref_kind: GovernanceRefKind,
    /// Body-free governance source reference.
    pub governance_source: GovernanceSourceRef,
    /// Body-free result scope summary.
    pub result_scope_summary: GovernanceResultScopeSummary,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `governance_result_ref_id` | `GovernanceResultRefId` | local ref id | system generated |
| `governance_ref_kind` | `GovernanceRefKind` | governance result / policy result 分类 | validated registration input;必须在 `GovernanceSeamPolicy.required_ref_kinds` 中 |
| `governance_source` | `GovernanceSourceRef` | external governance pointer | resolver-safe input;no source body |
| `result_scope_summary` | `GovernanceResultScopeSummary` | allowed scope summary | no approval / policy body |
| `candidate_digest` | `ReferenceCandidateDigest` | candidate duplicate / replacement key | application canonical digest;只覆盖kind + source + scope,不得包含approval / Policy body |
| `resolution_state_id` | `ReferenceResolutionStateId` | canonical resolution link | subject = this ref;allowed values include expired |
| `version` / times | `Version`;`Timestamp` | registration concurrency / time | application clock;mutation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical subject | 无 | governance variant | pure |
| `pub fn supports_seam(&self, relation: &GovernanceSeamRelation, state: &ReferenceResolutionState) -> bool` | relation support check | relation + canonical state | bool | same ref id + resolved |
| `pub fn replace_scope(&mut self, scope: GovernanceResultScopeSummary, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free scope / digest / state link | safe scope、canonical digest、state id、time | result | governance kind / source保持不变;digest必须与stored kind / source + new scope对称;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: GovernanceResultRefId, kind: GovernanceRefKind, source: GovernanceSourceRef, scope: GovernanceResultScopeSummary, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Self` | 注册 governance ref | 已由application / resolver对称校验的id、body-free kind / source / scope、canonical digest、state id、time | ref | governance command / consumer；纯组装,无domain失败分支 |

不变量与禁止事项:

- 本仓不能创建 governance result,只能注册 ref。
- 不保存 approval / Policy / shared_rules body 或 governance workflow state。

### 9.10 `GovernanceSeamPolicy`

```rust
/// Guards governance seam relations against governance truth ownership violations.
pub struct GovernanceSeamPolicy {
    /// Governance reference kinds allowed by the seam.
    pub required_ref_kinds: GovernanceRefKindSet,
    /// Governance body categories forbidden in capability-hub.
    pub forbidden_governance_bodies: ForbiddenGovernanceBodySet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_ref_kinds` | `GovernanceRefKindSet` | allowed governance result / policy result ref kinds | compile-time invariant |
| `forbidden_governance_bodies` | `ForbiddenGovernanceBodySet` | blocked governance body categories | approval / Policy / shared_rules / workflow body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_relation(&self, relation: &GovernanceSeamRelation, governance_ref: &GovernanceResultRef, state: &ReferenceResolutionState) -> Result<(), DomainError>` | seam boundary validation | relation、ref、canonical state | result | pure;active requires resolved |
| `pub fn reject_access_review_as_approval(&self, review: &CapabilityAccessReviewFact) -> Result<(), DomainError>` | 拒绝把access review作为governance approval输入 | review fact被调用方显式提交到approval endpoint时使用 | boundary error | 对任何review均拒绝；这是负向边界guard,不是seam attach成功验证器 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_governance_seam() -> Self` | 构造不可配置化 policy | 无 | policy | governance relation service |

不变量与禁止事项:

- policy 只判断,不调用 governance system 或修改 relation。
- config 不得允许 governance body 进入 safe summary。

### 9.11 `CapabilityMethodBodyFreeRelation`

```rust
/// Body-free relation between a capability identity and a method asset.
pub struct CapabilityMethodBodyFreeRelation {
    /// Stable method relation identifier.
    pub method_relation_id: CapabilityMethodBodyFreeRelationId,
    /// Capability side of the relation.
    pub capability_identity_id: CapabilityIdentityId,
    /// Method asset reference side of the relation.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Body-free relation applicability summary.
    pub relation_scope: CapabilityMethodRelationScope,
    /// Current relation lifecycle state.
    pub relation_state: CapabilityMethodRelationState,
    /// Optimistic version of the relation truth.
    pub version: Version,
    /// Time when the relation was created.
    pub created_at: Timestamp,
    /// Time when the relation last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `method_relation_id` | relation id | truth identity | system generated |
| `capability_identity_id` | identity id | capability endpoint | active identity |
| `method_asset_ref_id` | method ref id | method endpoint | registered body-free ref |
| `relation_scope` | `CapabilityMethodRelationScope` | body-free applicability | command safe input;no method body |
| `relation_state` | state enum | lifecycle | canonical ref state + policy |
| `version` / times | `Version`;`Timestamp` | concurrency / truth time | create = 1;mutation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, change_record_id: MethodRelationChangeRecordId, method_ref: &MethodAssetRef, resolution: &ReferenceResolutionState, policy: &MethodRelationBoundaryPolicy, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<MethodRelationChangeRecord, DomainError>` | pending / stale / unresolved -> active | application生成record id、ref、state、policy、safe reason、metadata | record | pending uses `Attached`;stale / unresolved use `Reactivated`;body-free + resolved;version +1 |
| `pub fn mark_stale(&mut self, change_record_id: MethodRelationChangeRecordId, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<MethodRelationChangeRecord, DomainError>` | active -> stale | application生成record id、metadata | record | no method body |
| `pub fn mark_unresolved(&mut self, change_record_id: MethodRelationChangeRecordId, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<MethodRelationChangeRecord, DomainError>` | pending / active / stale -> unresolved | application生成record id、metadata | record | version +1 |
| `pub fn remove(&mut self, change_record_id: MethodRelationChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<MethodRelationChangeRecord, DomainError>` | 显式移除 | application生成record id、metadata | record | -> removed terminal |
| `pub fn forbid(&mut self, change_record_id: MethodRelationChangeRecordId, reason: ForbiddenBodyReason, change_reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<MethodRelationChangeRecord, DomainError>` | 阻断 body candidate | application生成record id、typed forbidden reason、body-free record reason、metadata | record | -> forbidden;no body saved |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(id: CapabilityMethodBodyFreeRelationId, identity: &CapabilityIdentity, method_ref: &MethodAssetRef, scope: CapabilityMethodRelationScope, now: Timestamp) -> Result<Self, DomainError>` | 创建 pending relation | id、identity、ref、scope、time | relation | AttachCapabilityMethodRelation |

不变量与禁止事项:

- 不保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或 method version body。
- removed 不得原地恢复;重新关联必须创建新 relation。

### 9.12 `MethodAssetRef`

```rust
/// Body-free reference to a method-library asset.
pub struct MethodAssetRef {
    /// Stable local method asset reference identifier.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Body-free method asset classification.
    pub method_asset_kind: MethodAssetKindSummary,
    /// Body-free method-library locator.
    pub method_library_locator: MethodLibraryLocator,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `method_asset_ref_id` | `MethodAssetRefId` | local ref id | system generated |
| `method_asset_kind` | `MethodAssetKindSummary` | body-free kind | resolver-safe copy;not body schema |
| `method_library_locator` | `MethodLibraryLocator` | external locator | body-free;not source dependency path |
| `candidate_digest` | `ReferenceCandidateDigest` | candidate duplicate / replacement key | application canonical digest;只覆盖asset kind + locator,不得包含method body / version body |
| `resolution_state_id` | state id | canonical resolution link | subject = this method ref |
| `version` / times | version / timestamp | registration concurrency / time | application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical subject | 无 | method variant | pure |
| `pub fn supports_relation(&self, relation: &CapabilityMethodBodyFreeRelation, state: &ReferenceResolutionState) -> bool` | relation support check | relation + state | bool | same id + resolved |
| `pub fn replace_locator(&mut self, locator: MethodLibraryLocator, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 locator / digest / state link | safe locator、canonical digest、state id、time | result | digest必须与asset kind + locator对称;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: MethodAssetRefId, kind: MethodAssetKindSummary, locator: MethodLibraryLocator, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Self` | 注册 method ref | 已由application / resolver对称校验的complete body-free fields、canonical digest、state id、time | ref | method command / consumer；纯组装,无domain失败分支 |

不变量与禁止事项:

- 不形成对 method-library 源码的 Cargo dependency。
- 不保存 method asset body / version lifecycle body。

### 9.13 `MethodRelationBoundaryPolicy`

```rust
/// Guards capability-method relations against method body ownership violations.
pub struct MethodRelationBoundaryPolicy {
    /// Body-free relation summary categories allowed by capability-hub.
    pub allowed_relation_summaries: MethodRelationSummaryKindSet,
    /// Method body categories forbidden in capability-hub.
    pub forbidden_method_bodies: ForbiddenMethodBodySet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `allowed_relation_summaries` | `MethodRelationSummaryKindSet` | allowed summary categories | compile-time invariant |
| `forbidden_method_bodies` | `ForbiddenMethodBodySet` | blocked body categories | method content / definition / version body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_relation(&self, relation: &CapabilityMethodBodyFreeRelation, method_ref: &MethodAssetRef, state: &ReferenceResolutionState) -> Result<(), DomainError>` | body-free relation validation | relation、ref、state | result | pure;active requires resolved |
| `pub fn reject_method_body(&self, body_candidate: &MethodBodyCandidate) -> Result<(), DomainError>` | explicit forbidden body rejection | candidate classification | boundary error | no body retained |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_method_relation() -> Self` | 构造不可配置化 policy | 无 | policy | relation service |

不变量与禁止事项:

- policy 不读取 method body 或 method lifecycle。
- config 不得增加 allowed body category。

### 9.14 `GovernanceSeamChangeRecord`

```rust
/// Append-only explanation of one governance seam relation change.
pub struct GovernanceSeamChangeRecord {
    /// Stable seam change record identifier.
    pub seam_change_record_id: GovernanceSeamChangeRecordId,
    /// Changed governance seam relation.
    pub governance_seam_relation_id: GovernanceSeamRelationId,
    /// Seam change classification.
    pub change_kind: GovernanceSeamChangeKind,
    /// Seam state before the change.
    pub previous_state: Option<GovernanceSeamState>,
    /// Seam state after the change.
    pub next_state: GovernanceSeamState,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段组 | 来源 / 约束 |
|---|---|
| id / subject / kind | system id + exact seam member action |
| previous / next | copied before / after;create previous None |
| reason | safe command / resolver reason;no governance body |
| actor / trace / time | application operation context + same clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn explains_relation(&self, relation: &GovernanceSeamRelation) -> bool` | subject / next state match | relation | bool | pure |
| `pub fn requires_exposure_recheck(&self) -> bool` | exposure stale trigger decision | 无 | bool | true for all state-changing kinds except no-op forbidden duplicate |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: GovernanceSeamChangeRecordId, relation_id: GovernanceSeamRelationId, kind: GovernanceSeamChangeKind, previous: Option<GovernanceSeamState>, next: GovernanceSeamState, reason: ChangeReason, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 seam record | complete body-free metadata | record | seam transaction |

不变量与禁止事项:

- append-only;不携带 approval / Policy body 或 event payload。

### 9.15 `MethodRelationChangeRecord`

```rust
/// Append-only explanation of one capability-method relation change.
pub struct MethodRelationChangeRecord {
    /// Stable method relation change record identifier.
    pub method_relation_change_record_id: MethodRelationChangeRecordId,
    /// Changed capability-method relation.
    pub method_relation_id: CapabilityMethodBodyFreeRelationId,
    /// Method relation change classification.
    pub change_kind: MethodRelationChangeKind,
    /// Relation state before the change.
    pub previous_state: Option<CapabilityMethodRelationState>,
    /// Relation state after the change.
    pub next_state: CapabilityMethodRelationState,
    /// Referenced method asset at change time.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段组 | 来源 / 约束 |
|---|---|
| id / relation / method ref | same relation transaction;body-free typed ids |
| kind / previous / next | exact member action + state snapshot |
| reason / actor / trace / time | safe reason + operation context + same clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn explains_relation(&self, relation: &CapabilityMethodBodyFreeRelation) -> bool` | subject / next state match | relation | bool | pure |
| `pub fn requires_consumer_view_refresh(&self) -> bool` | view stale trigger decision | 无 | bool | attached / removed / stale / unresolved / forbidden = true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: MethodRelationChangeRecordId, relation_id: CapabilityMethodBodyFreeRelationId, kind: MethodRelationChangeKind, previous: Option<CapabilityMethodRelationState>, next: CapabilityMethodRelationState, method_ref_id: MethodAssetRefId, reason: ChangeReason, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 relation record | complete body-free metadata | record | method relation transaction |

不变量与禁止事项:

- append-only;不携带 method body diff 或 method-library history body。

### 9.16 descriptor / relation object capability map

| 对象组 | 完整字段来源 | state owner | member / factory closure | Step 7 handoff |
|---|---|---|---|---|
| descriptor truth | registry + source ref + safe command + system/core metadata | `AdapterDescriptorState` | draft / accept / attach summary / attach ref / replace / retire | descriptor + summary + change repositories |
| secret boundary | resolver-safe ref + safe summary + canonical resolution | `ReferenceResolutionState`;`SecretHandlingSafeSummaryState` | register / safe build / stale / unavailable / forbid | secret resolver + safe summary store |
| governance seam | active identity + governance ref + allowed summary + metadata | `GovernanceSeamState`;canonical reference state | create / activate / unresolved / expired / forbid / replace | governance resolver + relation repository |
| method relation | active identity + method ref + scope + metadata | `CapabilityMethodRelationState`;canonical reference state | create / activate / stale / unresolved / remove / forbid | method resolver + relation repository |
| history | same-tx subject / state / kind / reason / actor / trace / time | append-only | append / explain / stale trigger | append repositories + UoW |

### 9.17 descriptor / relation module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否有对象承接 | pass | descriptor、risk、secret ref/safe summary、seam、method relation、refs、policies、records 全部有 owner |
| 字段来源是否闭合 | pass | external input 仅 safe text / typed ref;mutable truth 补 version/time;records 补 actor/trace/time |
| reference state 是否重复 | pass | 所有 ref 只保存 `resolution_state_id`;canonical value 后续 §11.2 |
| forbidden body 是否可穿透 | pass | descriptor/governance/method/secret 四组 policy + marker + safe carrier 闭口 |
| Step 7 接缝 | pending_handoff | descriptor / summary / safe summary / relation / record repositories;source / governance / method / secret resolvers;UoW |

---

## 10. `domain::exposure` 与 `domain::trace_impact` 对象契约

### 10.1 capability / 功能到对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立 / 激活 / 挂起 / 退役 formal exposure | registry、descriptor、seam、optional method relation、actor | exposure truth + change record | draft / pending / accepted / active / suspended / unavailable / retired | `FormalExposureBoundary`;`FormalExposurePolicy`;`CapabilityExposureChangeRecord` | exposure repository;UoW |
| 派生 formal visibility / applicability | accepted exposure + prerequisite summary | visibility fact | not_visible / pending / visible / unavailable / retired | `FormalVisibilityApplicability`;`FormalExposurePolicy` | visibility repository / query |
| 构建 / stale / rebuild consumer view | exposure、descriptor safe summary、consumer ref、source versions | controlled snapshot | ready / stale / rebuilding / unavailable / partial | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy` | projection store / refresh job |
| 记录 access trace | truth change refs、trace subject、handoff refs | append-oriented trace record | recorded / partial / handoff_pending / superseded | `CapabilityAccessTraceabilityRecord` | trace repository / handoff port |
| 记录 change impact / downstream summary | trace record、consumer ref、body-free feedback | impact fact + summary | identified / partial / delayed / ignored / resolved | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | impact repository / consumer receipt |

### 10.2 `FormalExposureBoundary`

```rust
/// Server-owned formal exposure truth for a registered capability.
pub struct FormalExposureBoundary {
    /// Stable formal exposure identifier.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Registry entry exposed by this boundary.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Accepted descriptor snapshot reference used by this boundary.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Active governance seam snapshot reference used by this boundary.
    pub governance_seam_ref: GovernanceSeamRelationRef,
    /// Optional active body-free method relation snapshot reference.
    pub method_relation_ref: Option<CapabilityMethodRelationRef>,
    /// Current formal exposure lifecycle state.
    pub exposure_state: FormalExposureState,
    /// Optimistic version of the exposure truth.
    pub version: Version,
    /// Time when the exposure was created.
    pub created_at: Timestamp,
    /// Time when the exposure last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `formal_exposure_id` | `FormalExposureBoundaryId` | exposure truth id | system generated |
| `registry_entry_id` | registry id | exposed capability | non-retired entry |
| `descriptor_ref` | exact / current descriptor ref | accepted description snapshot | accepted descriptor for same entry |
| `governance_seam_ref` | seam ref | governance prerequisite snapshot | active seam for same identity |
| `method_relation_ref` | optional method relation ref | body-free method prerequisite | active relation only;optional by declared exposure scope |
| `exposure_state` | `FormalExposureState` | lifecycle | member transition only |
| `version` / times | version / timestamp | concurrency / truth time | create = 1;mutation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_pending(&mut self, change_record_id: CapabilityExposureChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | 正式前置不完整时进入pending | application生成record id、deterministic body-free prerequisite reason、metadata | record | 只允许`Draft / Unavailable -> Pending`;record kind=`MarkedPending`;same-state拒绝且version +1 |
| `pub fn accept(&mut self, change_record_id: CapabilityExposureChangeRecordId, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>, policy: &FormalExposurePolicy, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | draft / pending / unavailable -> accepted | application生成record id、active identity、all local prerequisites、policy、safe reason、metadata | record | 只允许`Draft / Pending / Unavailable -> Accepted`;draft uses `Created`;pending / unavailable use `PrerequisitesAccepted`;exact owner chain + `policy.validate_exposure(...)` pass;version +1 |
| `pub fn activate(&mut self, change_record_id: CapabilityExposureChangeRecordId, visibility: &FormalVisibilityApplicability, reason: ChangeReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | accepted / suspended -> active | application生成record id、visible applicability、safe reason、metadata | record | 只允许`Accepted / Suspended -> Active`;visibility必须same exposure、`Visible`且`source_exposure_version == self.version`;version +1 |
| `pub fn suspend(&mut self, change_record_id: CapabilityExposureChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | active -> suspended | application生成record id、metadata | record | no consumer-triggered suspension |
| `pub fn mark_unavailable(&mut self, change_record_id: CapabilityExposureChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | 已接受或挂起的exposure前置不再完整时进入unavailable | application生成record id、metadata | record | 只允许`Accepted / Active / Suspended -> Unavailable`;source truth refs retained;same-state拒绝;version +1 |
| `pub fn retire(&mut self, change_record_id: CapabilityExposureChangeRecordId, actor: &ActorContext, reason: ChangeReason, trace_id: TraceId, now: Timestamp) -> Result<CapabilityExposureChangeRecord, DomainError>` | persisted current exposure -> retired | application生成record id、metadata | record | 只允许`Pending / Accepted / Active / Suspended / Unavailable -> Retired`;transaction-local Draft与Retired拒绝;terminal;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn draft(id: FormalExposureBoundaryId, entry: &CapabilityRegistryEntry, descriptor_ref: AdapterDescriptorRef, seam_ref: GovernanceSeamRelationRef, method_ref: Option<CapabilityMethodRelationRef>, now: Timestamp) -> Result<Self, DomainError>` | 创建 exposure draft | owner chain refs + time | exposure | EstablishFormalExposureBoundary |

不变量与禁止事项:

- consumer view、runtime / tools consumer、SDK client、query、search 都不得调用 exposure mutation。
- active 需要 accepted / suspended exposure + 同subject、同source version的visible applicability;不等于 runtime allow / deny。
- `Draft`只存在于establish transaction内存阶段,当前flow不会单独持久化；失败直接回滚,不得为了保留失败候选调用`retire(...)`。
- retired 不得原地恢复。

### 10.3 `FormalVisibilityApplicability`

```rust
/// Server-side visibility and applicability fact derived from formal exposure truth.
pub struct FormalVisibilityApplicability {
    /// Stable visibility and applicability fact identifier.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Formal exposure evaluated by this fact.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Current formal visibility state.
    pub visibility_state: FormalVisibilityState,
    /// Ordered typed server applicability scope.
    pub applicability_scope: FormalApplicabilityScope,
    /// Body-free basis summary used by the evaluation.
    pub basis_summary: FormalVisibilityBasisSummary,
    /// Source exposure version evaluated by this fact.
    pub source_exposure_version: Version,
    /// Optimistic version of this fact.
    pub version: Version,
    /// Time when the fact was created.
    pub created_at: Timestamp,
    /// Time when the fact was last evaluated.
    pub evaluated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / exposure id | typed ids | fact identity / owner | system + existing exposure |
| `visibility_state` | state enum | formal visibility | policy output;never runtime decision |
| `applicability_scope` | typed non-empty scope | server consumption scope | validated exact `CapabilityConsumerRef` set;不得解析safe text或替代runtime allowlist |
| `basis_summary` | safe summary | prerequisite explanation | registry / descriptor / seam / relation body-free summary |
| `source_exposure_version` | `Version` | derivation marker | copied from exposure.version |
| `version` / times | version / timestamp | fact concurrency / evaluation time | create = 1;reevaluation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn reevaluate(&mut self, exposure: &FormalExposureBoundary, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>, scope: FormalApplicabilityScope, basis: FormalVisibilityBasisSummary, policy: &FormalExposurePolicy, now: Timestamp) -> Result<(), DomainError>` | 由完整local prerequisite重新派生visibility / applicability fact | final current exposure、active identity、entry、descriptor、seam、optional method、new typed scope、basis、policy、time | result | self必须non-retired且same exposure；target只由policy派生,caller不能传enum；scope / basis / source version更新;version +1 |
| `pub fn is_consumable_by(&self, consumer: &CapabilityConsumerRef) -> bool` | consumer applicability check | typed consumer | bool | `visibility_state == Visible && applicability_scope.contains(consumer)`;exact typed equality,no external lookup / text parsing |
| `pub fn mark_pending(&mut self, reason: FormalVisibilityPendingReason, exposure_version: Version, now: Timestamp) -> Result<(), DomainError>` | 标记 pending | safe reason、final source version、time | result | `NotVisible / Pending / Visible / Unavailable -> Pending`;Pending same-state仍是显式reason/source revision;Retired拒绝;version +1 |
| `pub fn mark_unavailable(&mut self, reason: ChangeReason, exposure_version: Version, now: Timestamp) -> Result<(), DomainError>` | exposure暂停时阻断可见性 | safe reason、final suspended exposure version、time | result | 只允许`Visible -> Unavailable`;source version更新;version +1 |
| `pub fn retire(&mut self, reason: ExposureRetirementReason, exposure_version: Version, now: Timestamp) -> Result<(), DomainError>` | exposure退役时同步退役visibility fact | safe retirement reason、retired exposure version、time | result | `NotVisible / Pending / Visible / Unavailable -> Retired`;Retired拒绝;terminal;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn derive(id: FormalVisibilityApplicabilityId, exposure: &FormalExposureBoundary, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>, scope: FormalApplicabilityScope, basis: FormalVisibilityBasisSummary, policy: &FormalExposurePolicy, now: Timestamp) -> Result<Self, DomainError>` | 从final normalized exposure与完整local prerequisite派生fact | id、exposure、active identity、entry、descriptor、seam、optional method、typed scope、basis、policy、time | fact | policy派生initial target；Retired exposure拒绝；create version=1 |

不变量与禁止事项:

- visible 不表示 SDK package 已发布或 runtime invocation 被授权。
- source exposure version 变化后旧 fact 必须 pending / stale-equivalent,不能继续作为 current visible basis。
- `derive / reevaluate`不得接收caller-selected `FormalVisibilityState`;只有`FormalExposurePolicy::derive_visibility_state(...)`可返回target。`Visible`只允许在local prerequisites complete且exposure已先归一为`Accepted / Active / Suspended`时形成。
- `UpdateFormalVisibilityApplicability`在`reevaluate`或`mark_pending`后,application必须在同一UoW调用`CapabilityExposureChangeRecord::append(...)`,使用`ExposureChangeKind::VisibilityApplicabilityChanged`；record的previous / next exposure state均复制当前`FormalExposureBoundary.exposure_state`,不得伪造exposure lifecycle transition。
- `SuspendFormalExposureBoundary`必须先验证current visibility为`Visible`且source version等于pre-suspend exposure version,再在exposure suspend后同一UoW调用visibility `mark_unavailable`;`RetireFormalExposureBoundary`也先验证pre-retire source-version symmetry,再同一UoW调用visibility `retire`。不存在current / symmetric visibility fact是consistency rejection,不得临时新建或只改exposure后返回伪造visibility state。

### 10.4 `FormalExposurePolicy`

```rust
/// Guards formal exposure against consumer-side and runtime-side truth injection.
pub struct FormalExposurePolicy {
    /// Formal truth inputs required by an accepted exposure.
    pub required_truth_inputs: FormalExposureTruthInputSet,
    /// Sources forbidden from creating formal exposure truth.
    pub forbidden_exposure_sources: ForbiddenExposureSourceSet,
}
```

`prerequisites_are_complete(...)`是application在任何visibility target派生前唯一允许的local prerequisite readiness callable；public declaration必须保留以下英文Rustdoc:

```rust
impl FormalExposurePolicy {
    /// Returns whether the exact local formal-exposure prerequisites are complete.
    pub fn prerequisites_are_complete(
        &self,
        exposure: &FormalExposureBoundary,
        identity: &CapabilityIdentity,
        entry: &CapabilityRegistryEntry,
        descriptor: &AdapterDescriptor,
        seam: &GovernanceSeamRelation,
        method_relation: Option<&CapabilityMethodBodyFreeRelation>,
    ) -> Result<bool, DomainError>;
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_truth_inputs` | typed set | registry / descriptor / seam / optional relation requirements | compile-time invariant |
| `forbidden_exposure_sources` | typed set | consumer view / SDK / runtime cache / search / listing | compile-time invariant |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn prerequisites_are_complete(&self, exposure: &FormalExposureBoundary, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>) -> Result<bool, DomainError>` | 分类local formal prerequisites是否完整 | exact exposure owner chain、identity、entry、descriptor、seam、optional method | bool | pure；owner / exact-ref / forbidden / terminal contradiction返回error；合法但non-active / unresolved / unavailable prerequisite返回false |
| `pub fn validate_exposure(&self, exposure: &FormalExposureBoundary, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>) -> Result<(), DomainError>` | accepted exposure prerequisite / ownership validation | complete local truth inputs | result | pure；只在`prerequisites_are_complete(...) == true`时通过 |
| `pub fn derive_visibility_state(&self, exposure: &FormalExposureBoundary, identity: &CapabilityIdentity, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, seam: &GovernanceSeamRelation, method_relation: Option<&CapabilityMethodBodyFreeRelation>, scope: &FormalApplicabilityScope, basis: &FormalVisibilityBasisSummary) -> Result<FormalVisibilityState, DomainError>` | visibility state decision | normalized exposure +完整local prerequisite + typed scope + safe basis | state | pure；caller不能传target；按下方closed mapping返回 |
| `pub fn reject_consumer_view_rewrite(&self, view: &ControlledConsumerView) -> Result<(), DomainError>` | explicit no-rewrite guard | view | boundary error | pure |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_formal_exposure() -> Self` | 构造不可配置化 policy | 无 | policy | exposure service |

不变量与禁止事项:

- policy 不读取 runtime authorization、SDK client cache 或 marketplace listing。
- config 不得绕过 descriptor / seam / relation prerequisite。
- `prerequisites_are_complete(...)`要求identity=`Active`、entry non-retired且owner id对称、descriptor exact ref=`Accepted`、seam exact ref=`Active`、declared method exact ref存在且=`Active`;合法degraded state返回false,owner / ref / terminal / forbidden contradiction返回error。Application仍必须在调用前通过existing external-reference + canonical-state repositories验证所有prerequisite-held ref和typed scope中的RuntimeTools / SDK ref；policy不读取repository。
- `derive_visibility_state(...)`的closed mapping为:`Draft -> NotVisible`;incomplete `Pending -> Pending`;incomplete `Unavailable -> Unavailable`;complete `Accepted / Active / Suspended -> Visible`;`Retired -> Retired`只供pure classification。complete `Pending / Unavailable`必须先由exposure `accept(...)`归一,而incomplete `Accepted / Active / Suspended`必须先`mark_unavailable(...)`;顺序不满足返回invariant error,不得让visibility派生暗中修exposure。

### 10.5 `ControlledConsumerView`

```rust
/// Body-free controlled snapshot derived for one downstream consumer boundary.
pub struct ControlledConsumerView {
    /// Stable controlled consumer view identifier.
    pub consumer_view_id: ControlledConsumerViewId,
    /// Formal exposure source of this view.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Allowed consumer boundary for this view.
    pub consumer_ref: CapabilityConsumerRef,
    /// Consumer-safe descriptor summary and its typed optional-source gaps.
    pub descriptor_summary: DescriptorConsumerSummary,
    /// Versions of source truth used to build this view.
    pub source_versions: ConsumerViewSourceVersionSet,
    /// Current view freshness state.
    pub freshness_state: ConsumerViewFreshnessState,
    /// Optimistic version of the view material.
    pub version: Version,
    /// Time when the view was first built.
    pub created_at: Timestamp,
    /// Time when the view was last refreshed.
    pub refreshed_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `consumer_view_id` | view id | material identity | system generated |
| `formal_exposure_id` | exposure id | truth owner source | accepted / active exposure |
| `consumer_ref` | typed consumer union | view audience | registered body-free ref;no execution state |
| `descriptor_summary` | structured safe summary | consumer-facing descriptor surface + typed optional gaps | accepted descriptor + risk / secret / optional method safety redaction；partial kinds只能来自§7.10.2 closed enum |
| `source_versions` | `ConsumerViewSourceVersionSet` | freshness comparison marker | exposure / descriptor / seam / relation / reference versions copied at build |
| `freshness_state` | state enum | material freshness | member transition only |
| `version` / times | version / timestamp | material concurrency / build time | build = 1;refresh / state mutation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn refresh_from_exposure(&mut self, exposure: &FormalExposureBoundary, descriptor_summary: DescriptorConsumerSummary, source_versions: ConsumerViewSourceVersionSet, policy: &ConsumerViewFreshnessPolicy, now: Timestamp) -> Result<(), DomainError>` | rebuild snapshot | truth + structured safe summary + version set + policy | result | 接受任一existing freshness state；exact owner / source / allowed-partial guard；替换summary / versions；`is_complete=true -> Ready`,否则`Partial`;version +1 |
| `pub fn mark_stale(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | 任一non-stale current state -> stale | reason、time | result | source truth unchanged;ready / partial / rebuilding / unavailable均可被newer truth失效;version +1;already-stale由application跳过 |
| `pub fn mark_rebuilding(&mut self, now: Timestamp) -> Result<(), DomainError>` | maintenance-owned persisted rebuild marker | time | result | 只允许`Stale / Unavailable / Partial -> Rebuilding`;Ready与same-state拒绝；Query不可调用；version +1；current Job不调用 |
| `pub fn mark_unavailable(&mut self, reason: ChangeReason, now: Timestamp) -> Result<(), DomainError>` | degraded view | reason、time | result | 只允许`Ready / Stale / Rebuilding / Partial -> Unavailable`;same-state拒绝；exposure truth unchanged；version +1；current Job不调用 |
| `pub fn is_safe_for_consumer(&self, consumer: &CapabilityConsumerRef) -> bool` | audience / state check | typed consumer | bool | exact consumer match + ready / allowed partial |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn build(id: ControlledConsumerViewId, exposure: &FormalExposureBoundary, consumer: CapabilityConsumerRef, descriptor_summary: DescriptorConsumerSummary, source_versions: ConsumerViewSourceVersionSet, policy: &ConsumerViewFreshnessPolicy, now: Timestamp) -> Result<Self, DomainError>` | 初次构建 view | complete required source / audience / structured safe summary | view | policy先验证typed partial subset；empty partial set形成Ready,non-empty allowed subset形成Partial；build version=1 |

不变量与禁止事项:

- view 只由 maintenance command / job 写;Query 只读。
- `DescriptorConsumerSummary.partial_kinds`是Ready / Partial target的唯一typed选择输入；不得解析`safe_summary`、enum display/debug、raw resolver error或optional source文本。Stale / Rebuilding / Unavailable保留同一snapshot summary,后续refresh整体替换。
- current `RefreshControlledConsumerView`直接从loaded state调用`refresh_from_exposure`并只保存final Ready / Partial revision；`mark_rebuilding / mark_unavailable`保留给未来显式maintenance flow,当前83-flow调用数必须为0。
- 不保存 provider runtime、secret body、invocation payload、SDK client cache。
- view 不得调用 exposure / registry / identity mutation。

### 10.6 `ConsumerViewFreshnessPolicy`

```rust
/// Guards freshness and partial availability of controlled consumer views.
pub struct ConsumerViewFreshnessPolicy {
    /// Source changes that mark a controlled consumer view stale.
    pub stale_marker_rules: ConsumerViewStaleMarkerSet,
    /// Partial view categories allowed by the server boundary.
    pub allowed_partial_kinds: ConsumerViewPartialKindSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `stale_marker_rules` | typed set | source version / state changes that stale view | compile-time invariant |
| `allowed_partial_kinds` | typed set | partial response categories | compile-time invariant;never includes forbidden body omission as silent success |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate_freshness(&self, view: &ControlledConsumerView, current_versions: &ConsumerViewSourceVersionSet) -> ConsumerViewFreshnessState` | compare version markers | view + current sources | state | pure;version mismatch -> stale |
| `pub fn validate_rebuild_source(&self, exposure: &FormalExposureBoundary, descriptor_summary: &DescriptorConsumerSummary) -> Result<(), DomainError>` | rebuild source guard | source truth + structured safe summary | result | pure；required exposure合法且`descriptor_summary.partial_kinds().is_subset_of(&allowed_partial_kinds)`；不得解析safe text |
| `pub fn allows_partial(&self, partial_kind: &ConsumerViewPartialKind) -> bool` | partial policy check | typed kind | bool | pure |
| `pub fn reject_truth_rewrite(&self, view: &ControlledConsumerView) -> Result<(), DomainError>` | explicit no-write guard | view | boundary error | pure |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_consumer_view() -> Self` | 构造不可配置化 freshness policy | 无 | policy | view service |

不变量与禁止事项:

- freshness policy 只判断 view,不 mutation exposure。
- retry / schedule / cache TTL 不属于本对象。

### 10.7 `CapabilityExposureChangeRecord`

```rust
/// Append-only explanation of one formal exposure or controlled-view change.
pub struct CapabilityExposureChangeRecord {
    /// Stable exposure change record identifier.
    pub exposure_change_record_id: CapabilityExposureChangeRecordId,
    /// Formal exposure affected by the change.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Exposure change classification.
    pub change_kind: ExposureChangeKind,
    /// Exposure state before the change.
    pub previous_state: Option<FormalExposureState>,
    /// Exposure state after the change.
    pub next_state: FormalExposureState,
    /// Body-free change explanation.
    pub change_reason: ChangeReason,
    /// Actor responsible for the change.
    pub actor_context: ActorContext,
    /// Distributed trace associated with the change.
    pub trace_id: TraceId,
    /// Time when the record was appended.
    pub recorded_at: Timestamp,
}
```

| 字段组 | 来源 / 约束 |
|---|---|
| id / subject / kind | same exposure transaction;system id + exact member action |
| previous / next state | copied before / after;view stale kind may keep same exposure state |
| reason / actor / trace / time | safe reason + operation context + same clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_consumer_view_refresh(&self) -> bool` | stale / rebuild trigger decision | 无 | bool | created / activated / visibility applicability changed / suspended / unavailable / retired = true |
| `pub fn feeds_change_impact_fact(&self) -> bool` | impact candidate decision | 无 | bool | all valid kinds = true |
| `pub fn explains_exposure(&self, exposure: &FormalExposureBoundary) -> bool` | subject / next-state check | exposure | bool | view stale kind checks subject only |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(id: CapabilityExposureChangeRecordId, exposure_id: FormalExposureBoundaryId, kind: ExposureChangeKind, previous: Option<FormalExposureState>, next: FormalExposureState, reason: ChangeReason, actor: ActorContext, trace_id: TraceId, recorded_at: Timestamp) -> Result<Self, DomainError>` | 构造 exposure record | complete body-free metadata | record | exposure / view stale transaction |

不变量与禁止事项:

- append-only;不携带 runtime availability 或 SDK client state。
- event payload 从 record ref 派生,不把 record 本身当 event DTO。

### 10.8 `CapabilityAccessTraceabilityRecord`

```rust
/// Versioned traceability record linking one access truth subject to body-free change records.
pub struct CapabilityAccessTraceabilityRecord {
    /// Stable traceability record identifier.
    pub traceability_record_id: CapabilityAccessTraceabilityRecordId,
    /// Capability access truth subject explained by this record.
    pub trace_subject: CapabilityTraceSubjectRef,
    /// Non-empty body-free change record references covered by this record.
    pub source_change_refs: CapabilityChangeRecordRefSet,
    /// Body-free reason for creating or revising the traceability record.
    pub trace_reason: TraceabilityReason,
    /// External audit or observability handoff references when present.
    pub handoff_refs: Option<TraceabilityHandoffRefSet>,
    /// Current traceability lifecycle state.
    pub traceability_state: TraceabilityState,
    /// Explicit gap reason when the record is partial.
    pub gap_reason: Option<TraceabilityGapReason>,
    /// Newer record revision that supersedes this revision when known.
    pub superseded_by: Option<CapabilityAccessTraceabilityRecordRef>,
    /// Actor responsible for the current record revision.
    pub actor_context: ActorContext,
    /// Distributed trace linking the source change and handoff.
    pub trace_id: TraceId,
    /// Optimistic version of the current record revision.
    pub version: Version,
    /// Time when the first record revision was created.
    pub recorded_at: Timestamp,
    /// Time when the current record revision was appended.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `traceability_record_id` | typed id | trace anchor | system generated;不得使用 `TraceId` 替代 |
| `trace_subject` | polymorphic truth subject ref | 被解释主语 | 从 source change record 对应 truth id 构造 |
| `source_change_refs` | non-empty typed set | 变化来源 | same transaction / committed change record refs;不得引用 DB changelog |
| `trace_reason` | safe text | 形成原因 | command reason 或 deterministic trace rule |
| `handoff_refs` | optional typed set | 外部审计 / 观测交接 refs | `ObservabilityAuditRefId`;尚未交接时为 `None` |
| `traceability_state` | state enum | trace 完整性 / handoff 状态 | member transition only |
| `gap_reason` | optional safe reason | partial 原因 | state = partial 时必须 `Some`;其他状态必须 `None` |
| `superseded_by` | optional versioned ref | newer revision | state = superseded 时必须 `Some`;不得 self-reference |
| actor / trace / version / times | core metadata | attribution / concurrency / history | operation context + application clock;每次 revision version +1 |

`request_handoff(...)`是`RecordTraceabilityHandoffSummary`唯一允许的compound member callable；其public declaration必须保留以下英文Rustdoc：

```rust
impl CapabilityAccessTraceabilityRecord {
    /// Records one local handoff-request revision and optionally attaches one resolved audit reference.
    pub fn request_handoff(
        &mut self,
        audit_ref: Option<(&ObservabilityAuditRef, &ReferenceResolutionState)>,
        reason: TraceabilityReason,
        actor: &ActorContext,
        trace_id: TraceId,
        now: Timestamp,
    ) -> Result<(), DomainError>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn covers_change(&self, change_ref: &CapabilityChangeRecordRef) -> bool` | 判断是否覆盖指定 change record | body-free change ref | bool | pure set membership |
| `pub fn request_handoff(&mut self, audit_ref: Option<(&ObservabilityAuditRef, &ReferenceResolutionState)>, reason: TraceabilityReason, actor: &ActorContext, trace_id: TraceId, now: Timestamp) -> Result<(), DomainError>` | 形成一个local handoff-request revision并可选关联resolved audit ref | optional exact ref/state pair、caller safe reason、operation metadata | result | only Recorded / Partial / HandoffPending;validates optional subject/state;sets optional ref + reason + `HandoffPending` + actor/trace/time atomically;clears `gap_reason / superseded_by`;version exactly +1 |
| `pub fn attach_handoff_ref(&mut self, audit_ref: &ObservabilityAuditRef, resolution: &ReferenceResolutionState, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 关联可解析 external audit ref | audit ref、canonical state、actor、time | result | recorded / partial / handoff_pending only;去重;version +1 |
| `pub fn mark_handoff_pending(&mut self, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记 handoff 尚未闭合 | actor、time | result | Recorded / Partial / HandoffPending -> HandoffPending;clears `gap_reason / superseded_by`;version +1 |
| `pub fn mark_partial(&mut self, reason: TraceabilityGapReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 显式记录 trace gap | safe reason、actor、time | result | Recorded / Partial / HandoffPending -> Partial;sets required gap,clears `superseded_by`;version +1 |
| `pub fn mark_recorded(&mut self, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | gap / handoff closure 后恢复 complete | actor、time | result | Partial / HandoffPending -> Recorded;clears `gap_reason / superseded_by`;version +1 |
| `pub fn supersede(&mut self, replacement: CapabilityAccessTraceabilityRecordRef, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 旧 trace revision 进入 historical terminal | replacement ref、actor、time | result | Recorded / Partial / HandoffPending -> Superseded;replacement id / version必须different;sets `superseded_by`,clears `gap_reason`;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn record_for_changes(id: CapabilityAccessTraceabilityRecordId, subject: CapabilityTraceSubjectRef, changes: CapabilityChangeRecordRefSet, reason: TraceabilityReason, initial_gap: Option<TraceabilityGapReason>, actor: ActorContext, trace_id: TraceId, now: Timestamp) -> Result<Self, DomainError>` | 为一组已提交 access truth change 建立 trace | id、subject、non-empty change refs、reason、optional gap、metadata | trace record | same transaction trace append / post-commit trace append |

不变量与禁止事项:

- `source_change_refs` 中每个 ref 必须解释同一 `trace_subject`;Step 7 repository / Step 9 flow 必须在 append 前加载并验证。
- 对象方法只产生“下一 revision”的内存态。Step 11 持久化必须 append revision,不得覆盖历史 revision;读取 current state 取最高 accepted `Version`。
- `gap_reason`与state必须exact对称:仅`Partial`允许且要求`Some`;`Recorded / HandoffPending / Superseded`必须为`None`。`superseded_by`仅`Superseded`允许且要求`Some`;所有non-terminal state必须为`None`。每个离开Partial或进入Superseded的member都必须先清理互斥字段,非法调用保持全部字段 / version / time不变。
- `RecordTraceabilityHandoffSummary`只能调用一次`request_handoff(...)`形成一个next revision；不得组合`attach_handoff_ref(...) + mark_handoff_pending(...)`造成一个repository append跨越两个object version。后两者保留给后续各自只有一个语义变化的正式flow,不得被当前Command串联。
- `handoff_pending` / partial 不回滚 identity、registry、descriptor、relation 或 exposure truth。
- 不保存 raw log、span、metric、alert、audit record、event payload 或 execution payload。

### 10.9 `CapabilityChangeImpactFact`

```rust
/// Versioned body-free fact describing downstream impact of one access truth change.
pub struct CapabilityChangeImpactFact {
    /// Stable impact fact identifier.
    pub impact_fact_id: CapabilityChangeImpactFactId,
    /// Traceability record from which this fact was derived.
    pub traceability_record_ref: CapabilityAccessTraceabilityRecordRef,
    /// Changed access truth subject.
    pub change_subject: CapabilityTraceSubjectRef,
    /// Body-free impact scope.
    pub impact_scope: CapabilityImpactScope,
    /// Downstream consumer boundaries affected by the change.
    pub affected_consumers: CapabilityConsumerRefSet,
    /// Current impact resolution state.
    pub impact_state: CapabilityImpactState,
    /// Body-free reason for partial, delayed, ignored, or resolved state.
    pub state_reason: Option<ChangeReason>,
    /// Actor responsible for the current fact revision.
    pub recorded_by: ActorContext,
    /// Distributed trace linking the source change and impact handoff.
    pub trace_id: TraceId,
    /// Optimistic version of the impact fact.
    pub version: Version,
    /// Time when the impact fact was created.
    pub created_at: Timestamp,
    /// Time when the impact fact last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / traceability ref / subject | typed id / ref | impact identity 与来源 | system id + exact trace revision;subject 必须等于 trace subject |
| `impact_scope` | safe scope | 受影响面摘要 | accepted truth + consumer relation derivation;不含 payload |
| `affected_consumers` | non-empty consumer ref set | 影响对象 | formal exposure / controlled view handoff boundary;不含 runtime state |
| `impact_state` / `state_reason` | state + optional safe reason | impact 闭环进度 | identified 不要求 reason;partial / delayed / ignored / resolved 必须 reason |
| actor / trace / version / times | core metadata | attribution / concurrency / history | trace operation metadata + application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn affects_consumer(&self, consumer_ref: &CapabilityConsumerRef) -> bool` | 判断 consumer 是否在影响范围 | typed consumer ref | bool | pure membership |
| `pub fn mark_partial(&mut self, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记影响仅部分可知 | safe reason、actor、time | result | identified / delayed -> partial;version +1 |
| `pub fn mark_delayed(&mut self, reason: ImpactDelayReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记下游感知延迟 | safe delay reason、actor、time | result | identified / partial -> delayed;version +1 |
| `pub fn mark_ignored(&mut self, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记 consumer 无需动作 | safe reason、actor、time | result | 只能在正式 consumer feedback 表达 ignored 后进入;version +1 |
| `pub fn resolve(&mut self, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记必要解释 / 派生工作完成 | safe reason、actor、time | result | identified / partial / delayed -> resolved;version +1 |
| `pub fn summarize_for_handoff(&self) -> Result<CapabilityImpactHandoffSummary, DomainError>` | 形成 body-free handoff summary | 无 | safe summary | 不读取 downstream execution body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn derive_from_traceability(id: CapabilityChangeImpactFactId, traceability: &CapabilityAccessTraceabilityRecord, impact_scope: CapabilityImpactScope, affected_consumers: CapabilityConsumerRefSet, actor: ActorContext, now: Timestamp) -> Result<Self, DomainError>` | 从 current trace revision 派生 impact fact | id、trace、scope、non-empty consumer set、actor、time | impact fact | RecordCapabilityChangeImpact |

不变量与禁止事项:

- impact fact 解释变化,不拥有 source truth,也不允许调用 source truth mutation。
- summary到impact的关系唯一保存在`DownstreamConsumptionImpactSummary.impact_fact_ref`;需要完整读取某个impact的summary时,必须调用分页`GetDownstreamConsumptionImpactSummary { impact_fact_ref, page, ... }`,不得在单体impact view中嵌入无界ref集合、只取任意第一页或在fact内维护第二份可变ref列表。
- downstream delayed / unavailable / failed 只能改变 impact / handoff surface,不得回滚已提交 access truth。
- `ignored` 必须来自明确 consumer feedback,不能由 timeout 猜测。
- 不保存 execution result、tool result、runtime authorization、SDK client state、cost 或 billing material。

Batch `9.6` controlled reopen `CH-DDD-S9-IMPACT-SUMMARY-PAGE-001`:Step 9函数流检查发现,原`CapabilityChangeImpactView.consumer_impact_summary_refs`没有public page输入,却依赖分页repository读取,无法同时保证完整集合与有限响应。当前契约删除只服务该字段的`DownstreamImpactSummaryRefSet`;完整summary读取继续由既有分页Query拥有。这不新增HLD object、state、truth owner或application technical helper。

### 10.10 `DownstreamConsumptionImpactSummary`

```rust
/// Versioned body-free summary of downstream consumption impact feedback.
pub struct DownstreamConsumptionImpactSummary {
    /// Stable downstream impact summary identifier.
    pub impact_summary_id: DownstreamConsumptionImpactSummaryId,
    /// Exact capability impact fact answered by this downstream feedback.
    pub impact_fact_ref: CapabilityChangeImpactFactRef,
    /// Consumer boundary that produced the summary.
    pub consumer_ref: CapabilityConsumerRef,
    /// Body-free source event reference used for deduplication and traceability.
    pub source_feedback_ref: CapabilityInboundEventRef,
    /// Allowed downstream impact observation when the feedback carries one.
    pub impact_observation: Option<ConsumptionImpactObservationSummary>,
    /// Current feedback availability state.
    pub feedback_state: DownstreamImpactSummaryState,
    /// Explicit gap reason when feedback is partial.
    pub gap_reason: Option<ConsumptionFeedbackGapReason>,
    /// Explicit safe reason for delayed, unavailable, or ignored feedback.
    pub state_reason: Option<ChangeReason>,
    /// Actor or system identity that accepted the feedback.
    pub accepted_by: ActorContext,
    /// Distributed trace propagated from the inbound boundary.
    pub trace_id: TraceId,
    /// Optimistic version of the safe summary.
    pub version: Version,
    /// Time when the feedback summary was first accepted.
    pub observed_at: Timestamp,
    /// Time when the safe summary state last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `impact_summary_id` | typed id | summary identity | system generated;不得使用 source event id 替代 |
| `impact_fact_ref` | exact versioned ref | 被反馈的本仓impact fact | payload exact ref + loaded fact验证;consumer必须在fact affected set中 |
| `consumer_ref` | consumer union | 反馈边界 | registered runtime/tools、SDK 或 ecosystem ref |
| `source_feedback_ref` | body-free inbound ref | 去重 / 追溯来源 | Step 8 envelope mapping;不保存 event body |
| `impact_observation` | optional safe summary | 下游观察 | received / partial必须`Some`;delayed可选;unavailable / ignored必须`None`;不得含execution body |
| `feedback_state` | state enum | received / partial / delayed / unavailable / ignored | factory / member transition only |
| `gap_reason` | optional safe reason | partial 原因 | partial 必须 `Some`;其余 state 必须 `None` |
| `state_reason` | optional safe reason | delayed / unavailable / ignored原因 | 这三类state必须`Some`;received / partial必须`None`;不得保存raw error |
| actor / trace / version / times | core metadata | attribution / concurrency / history | operation context + application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_ref(&self) -> DownstreamConsumptionImpactSummaryRef` | 形成 exact summary ref | 无 | versioned ref | current id + exact version |
| `pub fn is_actionable_for_impact(&self) -> bool` | 判断能否支撑 impact fact | 无 | bool | received / partial / delayed / ignored 可解释;unavailable 不可 |
| `pub fn belongs_to(&self, consumer_ref: &CapabilityConsumerRef) -> bool` | consumer ownership check | typed consumer | bool | pure equality |
| `pub fn mark_partial(&mut self, observation: ConsumptionImpactObservationSummary, reason: ConsumptionFeedbackGapReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记反馈不完整 | safe observation / gap、actor、time | result | non-ignored -> partial;observation / gap必填,state reason清空;version +1 |
| `pub fn mark_delayed(&mut self, observation: Option<ConsumptionImpactObservationSummary>, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记反馈延迟 | optional safe observation、safe reason、actor、time | result | received / partial / unavailable -> delayed;gap清空,state reason必填;version +1 |
| `pub fn mark_unavailable(&mut self, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记 consumer feedback unavailable | safe reason、actor、time | result | non-ignored -> unavailable;observation / gap清空,state reason必填;version +1 |
| `pub fn mark_ignored(&mut self, reason: ChangeReason, actor: &ActorContext, now: Timestamp) -> Result<(), DomainError>` | 记录 consumer 明确无需动作 | explicit feedback reason、actor、time | result | -> ignored;observation / gap清空,state reason必填;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_consumer_feedback(id: DownstreamConsumptionImpactSummaryId, impact: &CapabilityChangeImpactFact, consumer_ref: CapabilityConsumerRef, source_feedback_ref: CapabilityInboundEventRef, observation: ConsumptionImpactObservationSummary, accepted_by: ActorContext, trace_id: TraceId, now: Timestamp) -> Result<Self, DomainError>` | 从已验证 body-free feedback 建立 received summary | id、exact impact / consumer、source ref、safe observation、metadata | summary | RecordDownstreamConsumptionImpact |
| `pub fn from_reported_state(id: DownstreamConsumptionImpactSummaryId, impact: &CapabilityChangeImpactFact, consumer_ref: CapabilityConsumerRef, source_feedback_ref: CapabilityInboundEventRef, state: DownstreamImpactSummaryState, observation: Option<ConsumptionImpactObservationSummary>, gap_reason: Option<ConsumptionFeedbackGapReason>, state_reason: Option<ChangeReason>, accepted_by: ActorContext, trace_id: TraceId, now: Timestamp) -> Result<Self, DomainError>` | 从closed consumer feedback variant直接建立exact summary state | id、exact impact / consumer / source、state-specific observation / reason、metadata | summary | inbound downstream consumer |

不变量与禁止事项:

- summary 只承接 downstream 对变化影响的安全反馈,不拥有 downstream execution truth。
- duplicate `source_feedback_ref` 必须 replay 已存 summary / receipt,不得创建第二份语义不同 summary;Step 13 闭合算法。
- unavailable / delayed 不允许被解释为 consumer ignored。
- `from_reported_state`拒绝`Received`（必须用`from_consumer_feedback`）；`Partial`要求observation + gap且无state reason；`Delayed`要求state reason、observation可选且无gap；`Unavailable / Ignored`要求state reason且observation / gap均为空。不得用空safe text占位。
- 两个factory都要求`impact.affects_consumer(consumer_ref)`且复制`impact.as_ref()`；exact impact ref / version不匹配时reject,不得只按consumer或source event保存孤立summary。
- 不保存 runtime state、SDK client state、invocation payload、tool result、raw error 或 provider response。

### 10.11 exposure / trace object capability map

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `FormalExposureBoundary` | formal exposure truth | aggregate / truth | accept、activate、suspend、unavailable、retire | runtime authorization / marketplace listing |
| `FormalVisibilityApplicability` | formal visibility / applicability | derived domain fact | derive、reevaluate、consumer scope check | SDK package publication / runtime allow-deny |
| `FormalExposurePolicy` | exposure prerequisite guard | policy | truth chain validation、visibility derivation | repository / config / runtime lookup |
| `ControlledConsumerView` | downstream body-free snapshot | versioned view | build、refresh、stale、rebuilding、unavailable | exposure mutation / execution cache truth |
| `ConsumerViewFreshnessPolicy` | view freshness guard | policy | source version comparison、partial policy | retry schedule / truth mutation |
| `CapabilityExposureChangeRecord` | exposure change explanation | append-only record | refresh / impact trigger classification | event DTO / runtime availability log |
| `CapabilityAccessTraceabilityRecord` | connect access truth changes | versioned append-revision trace | coverage、gap、handoff、supersede | observability store / source truth owner |
| `CapabilityChangeImpactFact` | explain downstream impact | versioned domain fact | affected consumer、summary attach、resolve / ignore | source truth rollback / runtime payload |
| `DownstreamConsumptionImpactSummary` | body-free downstream feedback | versioned safe summary | received / partial / delayed / unavailable / ignored | downstream execution truth |

### 10.12 exposure / trace module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| formal exposure、visibility、view、trace、impact 功能是否全部有对象承接 | pass | 9 个对象分别承担 truth、policy、view、record、fact、summary;未新增 runtime decision object |
| trace / impact 字段来源是否闭合 | pass | change refs、consumer refs、safe summary refs、actor / trace / time 均有正式来源;无 raw body 字段 |
| append-only 与成员 mutation 是否冲突 | pass with explicit persistence rule | change record 完全 immutable;trace revision / impact / summary 是 versioned current object,Step 11 必须追加 revision,不得覆盖历史版本 |
| downstream failure 是否会回滚 truth | pass | 只迁移 impact / summary / handoff surface;不调用 identity / registry / descriptor / relation / exposure mutation |
| Step 7 承接是否命名 | pass | exposure / visibility / view / trace / impact / downstream summary repository,projection store,consumer feedback lookup,handoff port |

---

## 11. `domain::derived_material` 与 `domain::reference_resolution` 对象契约

### 11.1 capability / 功能到对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 构建 / stale / rebuild directory search / browse material | registry、descriptor、formal exposure、source versions | read-only projection | ready / stale / rebuilding / unavailable | `DirectorySearchBrowseProjection`;`DerivedMaterialPolicy` | projection repository / query |
| 形成 audit-friendly export | traceability record、allowed scope、optional audit refs | body-free export summary | ready / partial / unavailable / stale | `AuditFriendlyExportSummary`;`DerivedMaterialPolicy` | export repository / handoff port |
| 构建 read-only ecosystem discovery | formal exposure、ecosystem context、safe summary | read-only discovery material | ready / partial / stale / unavailable | `ReadOnlyEcosystemDiscoverySummary`;`DerivedMaterialPolicy` | discovery repository / query |
| 对账 truth 与派生材料 | truth refs、derived refs、source versions、job run | append-only report | completed / partial / inconsistent / rebuild_required / failed | `CapabilityReconciliationReport`;`DerivedMaterialPolicy` | reconciliation repository / job |
| 维护 canonical external ref resolution | typed reference subject、candidate summary、actor / trace | versioned resolution truth | resolved / unresolved / stale / invalid / unavailable / forbidden / expired | `ReferenceResolutionState`;`ReferenceResolutionPolicy` | resolution repository / resolver |
| 注册 external document / consumer / SDK / audit refs | body-free kind / locator / scope / state id | versioned reference object | 只链接 canonical state | `ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` | reference repository / resolver |

### 11.2 `DirectorySearchBrowseProjection`

```rust
/// Rebuildable read-only projection for capability directory search and browse.
pub struct DirectorySearchBrowseProjection {
    /// Stable projection identifier.
    pub projection_id: DirectorySearchBrowseProjectionId,
    /// Exact registry entry snapshot used by the projection.
    pub source_registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact adapter descriptor snapshot used by the projection.
    pub source_descriptor_ref: AdapterDescriptorRef,
    /// Exact formal exposure snapshot used by the projection.
    pub source_exposure_ref: FormalExposureBoundaryRef,
    /// Body-free directory display summary.
    pub display_summary: CapabilityDirectoryDisplaySummary,
    /// Validated search and browse facets.
    pub filter_facets: DirectorySearchFacetSet,
    /// Exact accepted source versions used by the build.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current projection freshness state.
    pub freshness_state: DirectoryProjectionState,
    /// Explicit stale or unavailable reason when degraded.
    pub state_reason: Option<DerivedMaterialStaleReason>,
    /// Optimistic version of the projection material.
    pub version: Version,
    /// Time when the projection was first built.
    pub created_at: Timestamp,
    /// Time when the projection was last refreshed or restated.
    pub refreshed_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / three source refs | typed id / exact refs | projection identity / source chain | system id + loaded non-retired entry、accepted descriptor、accepted / active exposure exact version |
| `display_summary` | safe summary | directory display | accepted truth redaction;不作为 registry command input |
| `filter_facets` | non-empty typed set | search / browse dimensions | accepted descriptor / registry safe fields;不包含 query plan |
| `source_versions` | source marker set | rebuild / stale comparison | 必须与 three source refs version 对称;可包含 canonical reference markers |
| `freshness_state` / `state_reason` | state + optional reason | material availability | stale / unavailable 必须 reason;ready / rebuilding 不保存 stale reason |
| version / times | core metadata | concurrency / material time | build = 1;state / refresh +1;application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn refresh_from_access_truth(&mut self, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, exposure: &FormalExposureBoundary, display_summary: CapabilityDirectoryDisplaySummary, facets: DirectorySearchFacetSet, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<(), DomainError>` | 从 current accepted truth rebuild | truth chain、safe display / facets、markers、policy、time | result | 接受任一existing projection state；exact owner chain；替换source refs / material / markers,state -> Ready,reason -> None,version +1 |
| `pub fn mark_stale(&mut self, reason: DerivedMaterialStaleReason, now: Timestamp) -> Result<(), DomainError>` | 任一non-stale current state -> stale | safe reason、time | result | source truth unchanged;ready / rebuilding / unavailable均可被newer truth失效;version +1;already-stale由application跳过 |
| `pub fn mark_rebuilding(&mut self, now: Timestamp) -> Result<(), DomainError>` | stale / unavailable -> rebuilding | time | result | maintenance only;query 不可调用;version +1 |
| `pub fn mark_unavailable(&mut self, reason: DerivedMaterialStaleReason, now: Timestamp) -> Result<(), DomainError>` | non-unavailable -> unavailable | safe reason、time | result | 只允许`Ready / Stale / Rebuilding -> Unavailable`;same-state拒绝；core truth unchanged;version +1；current Job不调用 |
| `pub fn matches_sources(&self, current: &DerivedMaterialSourceVersionSet) -> bool` | freshness comparison | current marker set | bool | pure exact comparison |
| `pub fn is_read_only(&self) -> bool` | 显式 read-only guard | 无 | bool | 始终 true;不授予 mutation capability |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn build_from_access_truth(id: DirectorySearchBrowseProjectionId, entry: &CapabilityRegistryEntry, descriptor: &AdapterDescriptor, exposure: &FormalExposureBoundary, display_summary: CapabilityDirectoryDisplaySummary, facets: DirectorySearchFacetSet, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<Self, DomainError>` | 初次构建 ready projection | complete truth chain、safe material、markers、policy、time | projection | RebuildCapabilityDirectoryProjection |

不变量与禁止事项:

- projection 只允许 exact accepted truth copy / deterministic safe derivation,不得从 marketplace listing、runtime cache 或 SDK cache 构造。
- current `RebuildDirectorySearchBrowseProjection`不保存中间`Rebuilding`或失败`Unavailable` revision；它对changed existing material直接调用`refresh_from_access_truth`并只保存final Ready。`mark_rebuilding / mark_unavailable`是existing reserved domain surface,必须等待未来显式flow调用。
- stale / unavailable 不改变 registry / descriptor / exposure state。
- 不保存完整 search index schema、index engine state、ranking model、query plan 或 marketplace metadata。

### 11.3 `AuditFriendlyExportSummary`

```rust
/// Rebuildable body-free summary prepared for an allowed audit handoff.
pub struct AuditFriendlyExportSummary {
    /// Stable export summary identifier.
    pub export_summary_id: AuditFriendlyExportSummaryId,
    /// Exact traceability record revision summarized by the export.
    pub traceability_record_ref: CapabilityAccessTraceabilityRecordRef,
    /// Body-free export scope.
    pub export_scope: AuditExportScope,
    /// Redacted summary allowed to cross the audit boundary.
    pub allowed_summary: AuditAllowedSummary,
    /// External observability or audit references when attached.
    pub observability_refs: Option<ObservabilityAuditRefSet>,
    /// Exact source versions used by the export build.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current export material state.
    pub export_state: AuditExportState,
    /// Explicit gap or stale reason when degraded.
    pub state_reason: Option<AuditExportGapReason>,
    /// Optimistic version of the export material.
    pub version: Version,
    /// Time when the export was first built.
    pub created_at: Timestamp,
    /// Time when the export was last rebuilt or restated.
    pub refreshed_at: Timestamp,
}

impl AuditFriendlyExportSummary {
    /// Returns whether this export already matches one complete planned preparation outcome.
    pub fn matches_preparation(
        &self,
        traceability: &CapabilityAccessTraceabilityRecord,
        export_scope: &AuditExportScope,
        allowed_summary: &AuditAllowedSummary,
        resolved_observability_ref_ids: &[ObservabilityAuditRefId],
        source_versions: &DerivedMaterialSourceVersionSet,
        expected_state: &AuditExportState,
        expected_reason: Option<&AuditExportGapReason>,
    ) -> bool;

    /// Rebuilds this export for the same exact trace and scope before validated references are reattached.
    pub fn refresh_from_traceability(
        &mut self,
        traceability: &CapabilityAccessTraceabilityRecord,
        export_scope: AuditExportScope,
        allowed_summary: AuditAllowedSummary,
        source_versions: DerivedMaterialSourceVersionSet,
        policy: &DerivedMaterialPolicy,
        now: Timestamp,
    ) -> Result<(), DomainError>;
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / traceability ref | typed id / exact ref | export identity / trace source | system id + current trace revision |
| `export_scope` | safe scope | handoff 范围 | validated command / job input;不得含 authorization token |
| `allowed_summary` | safe redacted summary | audit-friendly content | trace / change refs + safe reasons only;forbidden-body scanner pass |
| `observability_refs` | optional typed set | external handoff anchors | existing `ObservabilityAuditRefId`;无 external ref 时 `None` |
| `source_versions` | source marker set | freshness | 至少包含 exact traceability revision marker |
| state / reason | state + optional safe reason | ready / partial / unavailable / stale | partial / unavailable / stale 必须 reason;ready reason = None |
| version / times | core metadata | concurrency / material time | build = 1;rebuild / state +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn redact_for_audit_boundary(&self) -> Result<AuditAllowedSummary, DomainError>` | 返回已验证 export safe surface | 无 | safe summary | pure;不读取 external audit body |
| `pub fn matches_preparation(&self, traceability: &CapabilityAccessTraceabilityRecord, export_scope: &AuditExportScope, allowed_summary: &AuditAllowedSummary, resolved_observability_ref_ids: &[ObservabilityAuditRefId], source_versions: &DerivedMaterialSourceVersionSet, expected_state: &AuditExportState, expected_reason: Option<&AuditExportGapReason>) -> bool` | 判断当前export是否与完整frozen preparation outcome对称 | exact trace、scope、safe summary、stable resolved audit ids、source versions、final state/reason | bool | pure;全部safe字段、stable saved-ref order与state/reason必须相等；Ready要求reason None,Partial/Unavailable要求matching reason；不读取external body |
| `pub fn refresh_from_traceability(&mut self, traceability: &CapabilityAccessTraceabilityRecord, export_scope: AuditExportScope, allowed_summary: AuditAllowedSummary, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<(), DomainError>` | 在同一exact trace revision / scope identity上重建既有export基础内容 | exact trace、scope、safe summary、markers、policy、time | result | exact trace/scope guard；替换safe summary / markers、清空旧observability refs、state -> ready、reason -> None、version +1；后续refs只能经`attach_observability_ref`重附 |
| `pub fn attach_observability_ref(&mut self, audit_ref: &ObservabilityAuditRef, resolution: &ReferenceResolutionState, now: Timestamp) -> Result<(), DomainError>` | 关联 resolved audit ref | audit ref、state、time | result | exact subject + resolved;去重;version +1 |
| `pub fn references_observability(&self, audit_ref_id: &ObservabilityAuditRefId) -> bool` | handoff ref membership | audit ref id | bool | pure |
| `pub fn mark_partial(&mut self, reason: AuditExportGapReason, now: Timestamp) -> Result<(), DomainError>` | 标记 only partial allowed summary | safe gap、time | result | -> partial;version +1 |
| `pub fn mark_stale(&mut self, reason: AuditExportGapReason, now: Timestamp) -> Result<(), DomainError>` | source revision 变化 | safe reason、time | result | 任一non-stale current state -> stale;version +1;already-stale由application跳过 |
| `pub fn mark_unavailable(&mut self, reason: AuditExportGapReason, now: Timestamp) -> Result<(), DomainError>` | export unavailable | safe reason、time | result | source truth unchanged;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn build_from_traceability(id: AuditFriendlyExportSummaryId, traceability: &CapabilityAccessTraceabilityRecord, export_scope: AuditExportScope, allowed_summary: AuditAllowedSummary, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<Self, DomainError>` | 从 current trace revision 构建 ready export | id、trace、scope、safe summary、markers、policy、time | export summary | PrepareAuditFriendlyCapabilityExport |

不变量与禁止事项:

- export 不拥有 audit store,也不保存 raw audit log、span、metric、alert 或 external GRC body。
- existing export只允许在同一exact trace revision与同一`AuditExportScope` identity上调用`refresh_from_traceability`;wrong pair必须作为target consistency failure,不得把existing id改绑到另一trace / scope。
- Job在调用refresh前必须用`matches_preparation`完成完整no-op判断。比较的是本次exact canonical-state plans得出的resolved ref子集、期望final state / reason,不是request全部ids。若任一safe field、stable saved-ref order、source marker或availability不对称,refresh先清空旧attachment,再按frozen plan顺序通过`attach_observability_ref`重附并执行至多一个final degraded transition；不得只追加新ref而保留请求已删除的旧ref。
- `allowed_summary` 不得成为 formal acceptance evidence、真实 evidence alias 或验收签署。
- handoff failure 只能改变 export / trace handoff surface,不得回滚 source truth。

### 11.4 `ReadOnlyEcosystemDiscoverySummary`

```rust
/// Rebuildable read-only capability discovery summary for an ecosystem boundary.
pub struct ReadOnlyEcosystemDiscoverySummary {
    /// Stable ecosystem discovery summary identifier.
    pub ecosystem_summary_id: ReadOnlyEcosystemDiscoverySummaryId,
    /// Exact formal exposure snapshot used by this summary.
    pub formal_exposure_ref: FormalExposureBoundaryRef,
    /// Body-free ecosystem consumer context.
    pub ecosystem_context_ref: EcosystemContextRef,
    /// Body-free discoverability summary.
    pub discoverability_summary: CapabilityDiscoverabilitySummary,
    /// Exact source versions used by the build.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current discovery material state.
    pub freshness_state: EcosystemDiscoveryState,
    /// Explicit degraded reason when partial, stale, or unavailable.
    pub state_reason: Option<DiscoveryUnavailableReason>,
    /// Optimistic version of the discovery material.
    pub version: Version,
    /// Time when the discovery summary was first built.
    pub created_at: Timestamp,
    /// Time when the discovery summary was last rebuilt or restated.
    pub refreshed_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / exposure ref | typed id / exact ref | material identity / truth source | system id + accepted / active formal exposure exact version |
| `ecosystem_context_ref` | body-free external ref | audience context | registered read-only consumer context;不是 listing id |
| `discoverability_summary` | safe summary | capability discovery surface | accepted exposure + descriptor safe summary derivation |
| `source_versions` | source marker set | freshness | 至少包含 formal exposure marker;可包含 descriptor / reference marker |
| state / reason | state + optional safe reason | ready / partial / stale / unavailable | degraded state 必须 reason;ready reason = None |
| version / times | core metadata | concurrency / material time | build = 1;rebuild / state +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn refresh_from_exposure(&mut self, exposure: &FormalExposureBoundary, summary: CapabilityDiscoverabilitySummary, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<(), DomainError>` | 从 current exposure rebuild | exposure、safe summary、markers、policy、time | result | same exposure id;state -> ready;version +1 |
| `pub fn mark_partial(&mut self, reason: DiscoveryUnavailableReason, now: Timestamp) -> Result<(), DomainError>` | optional context 不完整 | safe reason、time | result | ready / stale -> partial;version +1 |
| `pub fn mark_stale(&mut self, reason: DiscoveryUnavailableReason, now: Timestamp) -> Result<(), DomainError>` | source version 变化 | safe reason、time | result | 任一non-stale current state -> stale;version +1;already-stale由application跳过 |
| `pub fn mark_unavailable(&mut self, reason: DiscoveryUnavailableReason, now: Timestamp) -> Result<(), DomainError>` | discovery material unavailable | safe reason、time | result | core truth unchanged;version +1 |
| `pub fn is_listing_truth(&self) -> bool` | 显式 marketplace boundary guard | 无 | bool | 始终 false |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn build_read_only_summary(id: ReadOnlyEcosystemDiscoverySummaryId, exposure: &FormalExposureBoundary, ecosystem_context_ref: EcosystemContextRef, summary: CapabilityDiscoverabilitySummary, source_versions: DerivedMaterialSourceVersionSet, policy: &DerivedMaterialPolicy, now: Timestamp) -> Result<Self, DomainError>` | 构建 ready read-only discovery material | id、exposure、context ref、safe summary、markers、policy、time | discovery summary | RebuildReadOnlyEcosystemDiscovery |

不变量与禁止事项:

- discovery 只读、可重建且非核心前置;unavailable 不阻塞 identity / registry / descriptor / exposure truth。
- 不形成 marketplace listing、catalog ownership、transaction、pricing、settlement 或 fulfillment truth。
- ecosystem consumer 不得借此对象调用 exposure / registry mutation。

### 11.5 `CapabilityReconciliationReport`

```rust
/// Append-only report comparing accepted access truth with rebuildable derived material.
pub struct CapabilityReconciliationReport {
    /// Stable reconciliation report identifier.
    pub reconciliation_report_id: CapabilityReconciliationReportId,
    /// Body-free scope inspected by the run.
    pub reconciliation_scope: CapabilityReconciliationScope,
    /// Non-empty accepted truth subjects inspected by the run.
    pub source_truth_refs: AccessTruthRefSet,
    /// Non-empty derived material references inspected by the run.
    pub inspected_material_refs: DerivedMaterialRefSet,
    /// Exact source and material versions compared by the run.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Body-free reconciliation findings.
    pub finding_summary: ReconciliationFindingSummary,
    /// Final report outcome state.
    pub report_state: ReconciliationReportState,
    /// Explicit failure reason when report generation failed.
    pub failure_reason: Option<ReconciliationFailureReason>,
    /// Core job run identifier that produced the report.
    pub job_run_id: JobRunId,
    /// Actor or system identity responsible for the run.
    pub generated_by: ActorContext,
    /// Distributed trace associated with the run.
    pub trace_id: TraceId,
    /// Immutable report version, initialized to one.
    pub version: Version,
    /// Time when the report was generated.
    pub generated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / scope | typed id / safe scope | report identity / inspected range | system id + validated job input |
| truth / material refs | non-empty typed sets | 对账两侧 | repository scan result;不得包含 external body 或 runtime cache |
| `source_versions` | source marker set | exact comparison basis | 与 inspected refs 一一可解释;不是 lock token |
| `finding_summary` | safe summary | mismatch / freshness finding | deterministic comparison + redaction;不保存 row diff |
| `report_state` / `failure_reason` | final outcome | completed / partial / inconsistent / rebuild_required / failed | failed 必须 reason;其他 state reason = None |
| job / actor / trace / version / time | core metadata | run attribution | operation context;version 固定 1;application clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn identifies_stale_material(&self) -> bool` | 判断 finding 是否要求关注 stale material | 无 | bool | state = inconsistent / rebuild_required 或 safe finding marker |
| `pub fn requires_rebuild(&self) -> bool` | 判断是否应调度 derived rebuild | 无 | bool | 仅 rebuild_required 返回 true;不直接调度 |
| `pub fn does_not_change_truth(&self) -> bool` | 显式 no-truth-write guard | 无 | bool | 始终 true |
| `pub fn references_material(&self, material_ref: &DerivedMaterialRef) -> bool` | 判断 material 是否被本报告检查 | typed material ref | bool | pure membership |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_findings(id: CapabilityReconciliationReportId, scope: CapabilityReconciliationScope, truth_refs: AccessTruthRefSet, material_refs: DerivedMaterialRefSet, source_versions: DerivedMaterialSourceVersionSet, findings: ReconciliationFindingSummary, state: ReconciliationReportState, job_run_id: JobRunId, actor: ActorContext, trace_id: TraceId, now: Timestamp) -> Result<Self, DomainError>` | 构造 completed / partial / inconsistent / rebuild_required final report | complete inspected sets、findings、non-failed state、metadata | report | ReconcileCapabilityAccessTruthAndDerivedMaterial |
| `pub fn failed(id: CapabilityReconciliationReportId, scope: CapabilityReconciliationScope, truth_refs: AccessTruthRefSet, material_refs: DerivedMaterialRefSet, source_versions: DerivedMaterialSourceVersionSet, findings: ReconciliationFindingSummary, reason: ReconciliationFailureReason, job_run_id: JobRunId, actor: ActorContext, trace_id: TraceId, now: Timestamp) -> Result<Self, DomainError>` | 构造 visible failed report | complete inspected basis、safe failure、metadata | failed report | reconciliation failed surface |

不变量与禁止事项:

- report 创建后 immutable;新 run 必须创建新 report id,不得覆盖或把 failed 改成 completed。
- report 只指出不一致 / rebuild need,不能创建 identity / registry entry、修正 descriptor / relation / exposure 或调用 rebuild。
- `job_run_id`、`trace_id`、report id 三者语义独立,不得互相替代。
- 不伪造 run result、测试结果、evidence alias 或验收签署。

### 11.6 `DerivedMaterialPolicy`

```rust
/// Guards rebuildable materials against writing capability access truth.
pub struct DerivedMaterialPolicy {
    /// Derived material categories covered by this policy.
    pub policy_scope: DerivedMaterialPolicyScope,
    /// Formal truth sources allowed for material construction.
    pub truth_source_requirements: DerivedMaterialTruthSourceSet,
    /// Core truth targets that derived materials must never mutate.
    pub forbidden_write_targets: ForbiddenDerivedWriteTargetSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `policy_scope` | finite enum | policy 适用 material | compile-time factory;默认 `All` |
| `truth_source_requirements` | typed set | allowed source taxonomy | compile-time invariant;只含正式 truth / trace source |
| `forbidden_write_targets` | typed set | no-write truth owner | compile-time invariant;覆盖 identity / registry / descriptor / seam / relation / exposure |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_directory_projection(&self, projection: &DirectorySearchBrowseProjection) -> Result<(), DomainError>` | 校验 directory source refs / markers / read-only boundary | projection | result | pure |
| `pub fn validate_export(&self, export_summary: &AuditFriendlyExportSummary) -> Result<(), DomainError>` | 校验 export source / redaction / no-evidence boundary | export summary | result | pure;不读取 audit body |
| `pub fn validate_discovery(&self, discovery: &ReadOnlyEcosystemDiscoverySummary) -> Result<(), DomainError>` | 校验 discovery source / marketplace boundary | discovery summary | result | pure |
| `pub fn validate_reconciliation(&self, report: &CapabilityReconciliationReport) -> Result<(), DomainError>` | 校验 inspected refs / final report no-write | report | result | pure;不执行 repair |
| `pub fn reject_truth_mutation(&self, material_ref: &DerivedMaterialRef, target: &ForbiddenDerivedWriteTarget) -> Result<(), DomainError>` | 显式拒绝 derived-to-truth write | material ref、target owner | boundary error | 始终不 mutation truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_derived_material() -> Self` | 构造不可配置化默认 policy | 无 | policy | projection / export / discovery / reconciliation services |

不变量与禁止事项:

- policy 是 pure guard,不保存 material、访问 repository、读取配置或调度 job。
- `04` 配置不得减少 truth source requirement 或 forbidden write target。
- search / export / discovery / reconciliation 都是外围增强,不得变成 formal access truth 成立前置。

### 11.7 `ReferenceResolutionState`

```rust
/// Canonical versioned resolution truth for one body-free external reference.
pub struct ReferenceResolutionState {
    /// Stable canonical resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Exact external reference subject tracked by this state.
    pub reference_subject: ReferenceSubjectRef,
    /// Declared reference category, consistent with the subject variant.
    pub reference_kind: ReferenceKind,
    /// Current canonical resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Body-free explanation of the current value.
    pub resolution_reason: ReferenceResolutionReason,
    /// Actor or system identity responsible for the latest check.
    pub checked_by: ActorContext,
    /// Distributed trace associated with the latest check.
    pub trace_id: TraceId,
    /// Optimistic version of the canonical state.
    pub version: Version,
    /// Time when the canonical state was first created.
    pub created_at: Timestamp,
    /// Time when the reference was last checked.
    pub last_checked_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `resolution_state_id` | typed id | canonical state identity | system generated;一个 reference subject 只能有一个 current state id |
| `reference_subject` | eight-kind subject union | state owner | registered local ref id;不得使用 locator 字符串替代 |
| `reference_kind` | finite enum | resolver / policy routing | 必须与 subject variant 一一对应 |
| `resolution_value` | canonical state enum | resolved / unresolved / stale / invalid / unavailable / forbidden / expired | resolver safe result + policy transition |
| `resolution_reason` | safe reason | 显式状态解释 | resolver-safe / policy reason;不得含 external error body |
| actor / trace / version / times | core metadata | attribution / concurrency / check time | operation context + application clock;每次 accepted transition version +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_subject(&self, subject: &ReferenceSubjectRef, kind: &ReferenceKind) -> bool` | 检查 state owner / kind | subject、kind | bool | pure exact match |
| `pub fn is_resolved(&self) -> bool` | resolved check | 无 | bool | only `Resolved` = true |
| `pub fn is_blocking_formal_exposure(&self) -> bool` | exposure prerequisite block check | 无 | bool | unresolved / stale / invalid / unavailable / forbidden / expired = true |
| `pub fn is_safe_for_read_model(&self) -> bool` | 判断 state 是否可进入只读 material | 无 | bool | resolved = true;stale 仅可形成 explicit stale / partial surface |
| `pub fn transition(&mut self, target: ReferenceResolutionValue, reason: ReferenceResolutionReason, actor: ActorContext, trace_id: TraceId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<(), DomainError>` | 接受 resolver / policy 的显式状态变化或same-value safe-reason re-observation | target、safe reason、metadata、policy、time | result | different value requires subject-kind + Step 10 transition pass;same value is allowed only whenreason differs;value + reason both equal is no-op rejection;accepted revision version +1;terminal candidate cannot recover |
| `pub fn mark_forbidden(&mut self, reason: ForbiddenBodyReason, actor: ActorContext, trace_id: TraceId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<(), DomainError>` | marker-only forbidden transition | safe reason、metadata、policy、time | result | current candidate -> forbidden;不保存 body;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_initial_resolution(id: ReferenceResolutionStateId, subject: ReferenceSubjectRef, kind: ReferenceKind, value: ReferenceResolutionValue, reason: ReferenceResolutionReason, actor: ActorContext, trace_id: TraceId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 从application已校验的resolver observation字段建立任一合法初始canonical state | state id、subject / kind / value / safe reason、metadata、policy | state | source / governance / method / document / audit registration consumer / command |
| `pub fn resolved(id: ReferenceResolutionStateId, subject: ReferenceSubjectRef, kind: ReferenceKind, reason: ReferenceResolutionReason, actor: ActorContext, trace_id: TraceId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 建立 resolved canonical state | complete owner / reason / metadata | state | successful ref registration / refresh |
| `pub fn unresolved(id: ReferenceResolutionStateId, subject: ReferenceSubjectRef, kind: ReferenceKind, reason: ReferenceFailureReason, actor: ActorContext, trace_id: TraceId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 建立 explicit unresolved canonical state | complete owner / failure / metadata | state | unresolved ref registration / refresh |

不变量与禁止事项:

- per-ref object 不保存第二份 `ReferenceResolutionValue`;只保存本对象 id。
- `invalid` / `forbidden` 对当前 candidate terminal;修复必须注册新 ref 或按 Step 10 明确 replacement path,不得原地伪装 resolved。
- non-terminal state的same-value re-observation只有在validated body-free `resolution_reason`实际变化时才可调用`transition`;它更新reason / checked_by / trace / last_checked_at并形成一个version +1 revision。value与reason均相同不得更新时间或生成capture。
- unresolved / unavailable 不得补造外部 truth,stale 不得当作 current resolved。
- 本对象不保存 resolver response、HTTP error、external document、governance body、method body、secret body 或 runtime payload。
- `from_initial_resolution`必须先验证subject-kind与kind-specific initial subset；application负责验证Step 7 observation的subject / kind / candidate digest后逐字段传入,domain不得依赖application-local observation type。`Forbidden`不经该factory保存candidate body,必须走marker-only forbidden路径。`Invalid`是否可作为initial terminal state由Step 10逐kind矩阵闭合。

### 11.8 `ReferenceResolutionPolicy`

```rust
/// Guards external references against body copying and silent resolution failure.
pub struct ReferenceResolutionPolicy {
    /// Stable policy scope.
    pub policy_scope: ReferenceResolutionPolicyScope,
    /// External reference categories allowed by the policy.
    pub allowed_reference_kinds: ReferenceKindSet,
    /// External body categories forbidden in capability-hub.
    pub forbidden_bodies: ForbiddenExternalBodySet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `policy_scope` | finite scope enum | policy 实例用途 | compile-time default;不由 request 选择 |
| `allowed_reference_kinds` | typed enum set | 允许注册 / refresh 的 8 类 ref | compile-time invariant;与 `ReferenceSubjectRef` variants 对称 |
| `forbidden_bodies` | typed deny set | external body red line | compile-time invariant;包含 §7.10.5 全部 variant |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_candidate(&self, candidate: &ReferenceCandidate) -> Result<(), DomainError>` | 校验 kind、body-free locator、digest、boundary marker | candidate | result | pure;ForbiddenBody 拒绝 |
| `pub fn validate_subject_kind(&self, subject: &ReferenceSubjectRef, kind: &ReferenceKind) -> Result<(), DomainError>` | 校验 union variant 与 kind 一一对应 | subject、kind | result | pure |
| `pub fn validate_transition(&self, subject: &ReferenceSubjectRef, kind: &ReferenceKind, current: &ReferenceResolutionValue, target: &ReferenceResolutionValue) -> Result<(), DomainError>` | 校验 kind-specific state subset / transition | owner、kind、current、target | result | pure;exact matrix Step 10 闭合 |
| `pub fn require_explicit_failure(&self, state: &ReferenceResolutionState) -> Result<(), DomainError>` | 禁止 unresolved / unavailable 被映射为 success | canonical state | result | non-resolved 必须保留 explicit marker |
| `pub fn reject_external_body(&self, body_kind: &ForbiddenExternalBody) -> Result<(), DomainError>` | 明确拒绝 external body category | body category marker | boundary error | 不接收 body value |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_for_capability_references() -> Self` | 构造不可配置化默认 policy | 无 | policy | reference registration / refresh / resolver services |

不变量与禁止事项:

- policy 是 pure guard,不调用 resolver、repository 或 sibling repo,也不修改 canonical state。
- string path / URL 只能进入 body-free locator carrier,不能绕过 typed local ref / state id。
- config 不得新增 reference kind、删除 forbidden body 或把 failure 映射为 resolved。

### 11.9 `ExternalDocumentRef`

```rust
/// Versioned body-free reference to an external protocol, schema, or access document.
pub struct ExternalDocumentRef {
    /// Stable local external document reference identifier.
    pub external_document_ref_id: ExternalDocumentRefId,
    /// Body-free external document category.
    pub document_kind: ExternalDocumentKind,
    /// Body-free external document locator summary.
    pub document_locator: ExternalDocumentLocatorSummary,
    /// Descriptor explicitly supported by this reference when applicable.
    pub supported_descriptor_id: Option<AdapterDescriptorId>,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / kind / locator | typed id / enum / safe locator | local ref identity / external pointer | system id + validated input;locator 不含 document body |
| `supported_descriptor_id` | optional descriptor id | descriptor support relation | command input + loaded descriptor;无绑定时 `None` |
| `candidate_digest` | body-free digest | candidate integrity | application canonical digest;不得包含 document body |
| `resolution_state_id` | canonical state id | resolution truth link | subject = this document ref;本对象不复制 state value |
| version / times | core metadata | registration concurrency / time | register = 1;locator / binding change +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical resolution subject | 无 | external document variant | pure conversion |
| `pub fn supports_descriptor(&self, descriptor: &AdapterDescriptor, state: &ReferenceResolutionState) -> bool` | 判断 ref 是否可支撑 descriptor 解释 | descriptor、canonical state | bool | bound descriptor match + state subject match + resolved |
| `pub fn bind_supported_descriptor(&mut self, descriptor: &AdapterDescriptor, state: &ReferenceResolutionState, now: Timestamp) -> Result<(), DomainError>` | 将预注册文档ref绑定到新建descriptor | accepted descriptor、与本ref匹配的resolved canonical state、time | result | 当前binding必须为`None`或同descriptor;首次绑定version +1;不得读取document body |
| `pub fn rebind_supported_descriptor(&mut self, current: &AdapterDescriptor, replacement: &AdapterDescriptor, state: &ReferenceResolutionState, now: Timestamp) -> Result<(), DomainError>` | descriptor replacement时换绑文档ref | 当前已绑定descriptor、same registry chain replacement、canonical state、time | result | stored binding必须等于current id;current必须replaced且replacement accepted;version +1 |
| `pub fn replace_locator(&mut self, locator: ExternalDocumentLocatorSummary, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free locator / digest / state link | safe locator、digest、state id、time | result | version +1;不得保存旧 body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: ExternalDocumentRefId, kind: ExternalDocumentKind, locator: ExternalDocumentLocatorSummary, supported_descriptor_id: Option<AdapterDescriptorId>, candidate: &ReferenceCandidate, state_id: ReferenceResolutionStateId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 注册 external document ref | complete body-free fields、candidate、state id、policy、time | document ref | RegisterExternalDocumentReference |

不变量与禁止事项:

- factory 要求 candidate kind = external document、boundary marker 非 forbidden、candidate digest 与 safe fields 对称。
- document可先以`supported_descriptor_id=None`注册,再由`EstablishAdapterDescriptor`在descriptor accepted后调用`bind_supported_descriptor`;replacement flow只能通过`rebind_supported_descriptor`在同一registry chain换绑,不得把unrelated document ref附到新descriptor。
- 不保存 protocol、schema、guide 或任意 external document body。
- 文档 ref stale / unavailable 只改变 canonical state,不得直接修改 descriptor truth。

### 11.10 `RuntimeToolsConsumerRef`

```rust
/// Versioned body-free reference to a runtime or tools consumer boundary.
pub struct RuntimeToolsConsumerRef {
    /// Stable local runtime or tools consumer reference identifier.
    pub runtime_tools_consumer_ref_id: RuntimeToolsConsumerRefId,
    /// Runtime or tools consumer category.
    pub consumer_kind: RuntimeToolsConsumerKind,
    /// Body-free locator of the consumer boundary.
    pub consumer_locator: RuntimeToolsConsumerLocator,
    /// Body-free capability consumption scope.
    pub consumer_scope: CapabilityConsumerScope,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / kind / locator | typed id / enum / safe locator | local consumer ref / external boundary | system id + validated registration;不含 runtime endpoint credential |
| `consumer_scope` | safe scope | 可消费 capability 范围 | validated body-free input;不是 runtime authorization policy |
| `candidate_digest` | body-free digest | candidate integrity | application canonical digest |
| `resolution_state_id` | canonical state id | resolution link | subject = this runtime/tools ref;无 local state copy |
| version / times | core metadata | registration concurrency / time | register = 1;safe locator / scope change +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical resolution subject | 无 | runtime/tools consumer variant | pure conversion |
| `pub fn as_consumer_ref(&self) -> CapabilityConsumerRef` | controlled view audience ref | 无 | runtime/tools consumer variant | pure conversion |
| `pub fn can_consume_view(&self, view: &ControlledConsumerView, state: &ReferenceResolutionState) -> bool` | 判断 ref 是否可消费给定 view | view、canonical state | bool | exact audience + state subject match + resolved + view safe state |
| `pub fn replace_boundary(&mut self, locator: RuntimeToolsConsumerLocator, scope: CapabilityConsumerScope, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free consumer boundary | safe locator / scope、digest、state id、time | result | version +1;不触碰 exposure truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: RuntimeToolsConsumerRefId, kind: RuntimeToolsConsumerKind, locator: RuntimeToolsConsumerLocator, scope: CapabilityConsumerScope, candidate: &ReferenceCandidate, state_id: ReferenceResolutionStateId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 注册 runtime / tools consumer ref | complete body-free fields、candidate、state id、policy、time | consumer ref | RegisterRuntimeToolsConsumerReference |

不变量与禁止事项:

- ref 只说明 consumer boundary / scope,不表示 runtime invocation 已获授权或 provider 当前可用。
- 不保存 invocation request / response、tool result、runtime cache、allowlist、quota、route、cost 或 retry state。
- consumer ref / feedback failure 不得反写 formal exposure。

### 11.11 `SdkExposureConsumerRef`

```rust
/// Versioned body-free reference to an SDK consumer of the server exposure boundary.
pub struct SdkExposureConsumerRef {
    /// Stable local SDK consumer reference identifier.
    pub sdk_consumer_ref_id: SdkExposureConsumerRefId,
    /// Body-free locator of the SDK server-consumer boundary.
    pub sdk_consumer_locator: SdkConsumerLocator,
    /// Body-free summary of the SDK-facing server surface.
    pub sdk_surface_summary: SdkSurfaceSummary,
    /// Body-free formal exposure scope available to the SDK boundary.
    pub exposure_scope: SdkExposureScope,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / locator | typed id / safe locator | local SDK ref / server consumer boundary | system id + validated input;不指向 SDK package internals |
| `sdk_surface_summary` / `exposure_scope` | safe summaries | 服务端可消费面 / scope | accepted formal exposure derivation + registration input;不含 client code |
| `candidate_digest` | body-free digest | candidate integrity | application canonical digest |
| `resolution_state_id` | canonical state id | resolution link | subject = this SDK ref;无 local state copy |
| version / times | core metadata | registration concurrency / time | register = 1;safe boundary change +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical resolution subject | 无 | SDK consumer variant | pure conversion |
| `pub fn as_consumer_ref(&self) -> CapabilityConsumerRef` | controlled view audience ref | 无 | SDK consumer variant | pure conversion |
| `pub fn supports_formal_exposure(&self, exposure: &FormalExposureBoundary, state: &ReferenceResolutionState) -> bool` | 判断 ref 是否可支撑 server-side exposure handoff | exposure、canonical state | bool | resolved + scope match;不检查 SDK package publication |
| `pub fn replace_boundary(&mut self, locator: SdkConsumerLocator, surface: SdkSurfaceSummary, scope: SdkExposureScope, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free SDK boundary | safe fields、digest、state id、time | result | version +1;不触碰 exposure truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: SdkExposureConsumerRefId, locator: SdkConsumerLocator, surface: SdkSurfaceSummary, scope: SdkExposureScope, candidate: &ReferenceCandidate, state_id: ReferenceResolutionStateId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 注册 SDK server-consumer ref | complete body-free fields、candidate、state id、policy、time | SDK consumer ref | RegisterSdkExposureConsumerReference |

不变量与禁止事项:

- 本对象只描述 capability-hub 服务端 exposure boundary,不拥有 SDK client、binding、package、cache 或 release state。
- SDK ref unavailable 不改变 formal exposure truth,只影响 SDK consumer view / handoff surface。
- 不让 SDK client 或 SDK cache 反写 registry / exposure。

### 11.12 `ObservabilityAuditRef`

```rust
/// Versioned body-free reference to external observability or audit material.
pub struct ObservabilityAuditRef {
    /// Stable local observability or audit reference identifier.
    pub observability_audit_ref_id: ObservabilityAuditRefId,
    /// External audit material category.
    pub audit_material_kind: AuditMaterialKind,
    /// Body-free external audit material locator summary.
    pub audit_locator: AuditMaterialLocatorSummary,
    /// Digest of the validated body-free registration candidate.
    pub candidate_digest: ReferenceCandidateDigest,
    /// Canonical reference resolution state identifier.
    pub resolution_state_id: ReferenceResolutionStateId,
    /// Optimistic version of the reference registration.
    pub version: Version,
    /// Time when the reference was registered.
    pub created_at: Timestamp,
    /// Time when the reference registration last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| id / kind / locator | typed id / enum / safe locator | local audit ref / external material pointer | system id + validated input;locator 不含 raw material |
| `candidate_digest` | body-free digest | candidate integrity | application canonical digest |
| `resolution_state_id` | canonical state id | resolution link | subject = this audit ref;无 local state copy |
| version / times | core metadata | registration concurrency / time | register = 1;locator / kind change +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn subject_ref(&self) -> ReferenceSubjectRef` | canonical resolution subject | 无 | observability / audit variant | pure conversion |
| `pub fn supports_traceability(&self, traceability: &CapabilityAccessTraceabilityRecord, state: &ReferenceResolutionState) -> bool` | 判断 ref 是否可支撑 trace handoff | trace record、canonical state | bool | state subject match + resolved + trace non-superseded |
| `pub fn replace_locator(&mut self, kind: AuditMaterialKind, locator: AuditMaterialLocatorSummary, candidate_digest: ReferenceCandidateDigest, state_id: ReferenceResolutionStateId, now: Timestamp) -> Result<(), DomainError>` | 更新 body-free audit pointer | kind、safe locator、digest、state id、time | result | version +1;不保存 external material |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn register(id: ObservabilityAuditRefId, kind: AuditMaterialKind, locator: AuditMaterialLocatorSummary, candidate: &ReferenceCandidate, state_id: ReferenceResolutionStateId, policy: &ReferenceResolutionPolicy, now: Timestamp) -> Result<Self, DomainError>` | 注册 observability / audit ref | complete body-free fields、candidate、state id、policy、time | audit ref | RegisterObservabilityAuditReference |

不变量与禁止事项:

- 不保存 raw log、span、trace body、metric series、alert body、audit store body 或 external GRC body。
- ref 只支撑 trace / export handoff,不成为 formal acceptance evidence、evidence alias 或验收签署。
- observability unavailable 不回滚 access truth 或 impact fact。

### 11.13 derived / reference object capability map

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `DirectorySearchBrowseProjection` | directory search / browse material | versioned projection | build、refresh、stale、rebuilding、unavailable | registry mutation / search engine runtime |
| `AuditFriendlyExportSummary` | audit-safe export | versioned export material | redaction、audit ref attach、partial / stale | audit store / evidence signing |
| `ReadOnlyEcosystemDiscoverySummary` | ecosystem discovery | versioned read model | build、refresh、partial / stale / unavailable | marketplace listing / transaction truth |
| `CapabilityReconciliationReport` | truth-material comparison | immutable report | findings、rebuild need、material membership | truth repair / job scheduler |
| `DerivedMaterialPolicy` | no-write / source guard | policy | projection / export / discovery / report validation | repository / rebuild execution |
| `ReferenceResolutionState` | canonical ref state | versioned support truth | subject-kind match、explicit transition、read / exposure check | external truth body |
| `ReferenceResolutionPolicy` | ref body / failure guard | policy | candidate / kind / transition validation | resolver / repository call |
| `ExternalDocumentRef` | external document pointer | versioned ref | descriptor support、locator replacement | document / schema body |
| `RuntimeToolsConsumerRef` | runtime / tools consumer pointer | versioned ref | view audience / scope | runtime execution / tool result |
| `SdkExposureConsumerRef` | SDK server consumer pointer | versioned ref | exposure support / scope | SDK client / package / cache |
| `ObservabilityAuditRef` | external audit pointer | versioned ref | trace / export handoff | observability / audit store body |

### 11.14 derived / reference module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 5 个 derived objects 是否只读可重建 | pass | projection / export / discovery versioned;report immutable;policy pure guard |
| 8 类 external ref 是否统一 canonical state | pass | 既有 source / secret / governance / method refs 与本节 4 refs 均只存 `resolution_state_id` |
| reference state / kind 是否重复 | pass with Step 10 handoff | 仅 `ReferenceResolutionValue` 持久化;per-kind subset / transition 留给 Step 10 exact matrix |
| external body 是否可能通过 candidate / locator / digest 绕过 | pass | candidate marker + safe locator + forbidden-body set;digest 不得包含 body |
| SDK / runtime / marketplace / governance owner 是否越界 | pass | 仅 consumer / ref / discovery seam;未定义 execution、SDK client、listing 或 approval truth |
| Step 7 承接是否命名 | pass | projection / export / discovery / report repositories,reference state / ref repositories,resolver,safe-summary provider,handoff port |

---

## 12. `application` stable helper 对象契约

### 12.1 capability / 功能到对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 归一化 command / query / event / job metadata | core metadata、operation name、event ref / job run | validated operation context | query no-write / write idempotency requirement | `CapabilityOperationContext` | entry normalization / service call |
| reserve / complete idempotency and classify duplicate conflict | context、stable request digest、stored result ref | versioned reservation or zero-write conflict response | reserved -> completed; mismatch preserves winner | `CapabilityIdempotencyRecord` | idempotency repository / UoW / Step 13 race classifier |
| 保存 duplicate replay result shell | application result ref、public surface ref / digest、trace | immutable stored-result metadata | command / rejection / receipt / job report | `StoredCapabilityOperationResult` | result repository / Step 8 surface |
| 判断 query 可见 / degraded / not-visible | read subject、actor、formal marker、degraded reason | explicit read decision | no write / no idempotency | `CapabilityReadVisibilityDecision` | query service / response mapping |
| 冻结 outbound event 完整 envelope | committed-source planned ref、Step 8 schema、serialized envelope、digest、trace | immutable payload snapshot | 与 source mutation / material save / reference save 同一 UoW | `CapabilityEventPayloadSnapshot` | event capture repository / Step 8 mapper |
| 关闭 post-commit / pre-intent 崩溃窗口 | source ref、payload snapshot、external intent result | versioned local capture | captured -> intent_bound | `CapabilityEventCaptureRecord` | event capture repository / collaboration repair |
| 关闭 multi-target Job 的 post-target / pre-report 崩溃窗口 | normalized idempotency key、closed Job identity、完整稳定typed target plan、target outcome | versioned Job execution journal | execution planned -> finalized；target planned -> succeeded / failed / skipped | `CapabilityJobExecutionRecord` | Job execution repository / Step 8 report assembly / Step 9 reentry |

### 12.2 `CapabilityOperationContext`

```rust
/// Carries validated core metadata for one capability-hub application operation.
pub struct CapabilityOperationContext {
    /// Entry channel for the operation.
    pub channel: CapabilityOperationChannel,
    /// Stable operation name used by idempotency and stored-result replay.
    pub operation_name: CapabilityOperationName,
    /// Trusted actor context propagated from the entry boundary.
    pub actor_context: ActorContext,
    /// Distributed trace propagated through records, reports, and handoffs.
    pub trace_id: TraceId,
    /// Command metadata when the channel is command.
    pub command_metadata: Option<CommandMetadata>,
    /// Query metadata when the channel is query.
    pub query_metadata: Option<QueryMetadata>,
    /// Body-free source event reference when the channel is inbound event.
    pub source_event_ref: Option<CapabilityInboundEventRef>,
    /// Declared upstream family when the channel is an inbound event.
    pub inbound_source_family: Option<CapabilityInboundSourceFamily>,
    /// Public upstream event identity retained for the inbound receipt.
    pub inbound_protocol_source_event_ref: Option<CapabilitySourceEventRef>,
    /// Source-provided idempotency assertion included only in an inbound request digest.
    pub inbound_source_idempotency_key: Option<IdempotencyKey>,
    /// Core job run identifier when the channel is operations job.
    pub job_run_id: Option<JobRunId>,
    /// Normalized idempotency key for command, event, and job channels.
    pub idempotency_key: Option<CapabilityOperationIdempotencyKey>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `channel` / `operation_name` | enum / safe name | operation identity | entry mapper + Step 8 protocol name;不得自由拼接别名 |
| `actor_context` / `trace_id` | core metadata | attribution / trace propagation | trusted entry metadata;application 不重新认证或生成 inbound trace |
| `command_metadata` | optional core metadata | command request context | command 必须 `Some`;其他 channel 必须 `None` |
| `query_metadata` | optional core metadata | query request context | query 必须 `Some`;其他 channel 必须 `None` |
| `source_event_ref` | optional body-free ref | inbound event source | inbound event 必须 `Some`;其他 channel 必须 `None` |
| `inbound_source_family` | optional closed protocol enum | inbound source isolation / digest authority | inbound event必须`Some`且与operation唯一映射对称;其他channel必须`None` |
| `inbound_protocol_source_event_ref` | optional public body-free ref | receipt source identity / digest authority | inbound event必须`Some`;与`source_event_ref`来自同一validated envelope的one-way mapping;其他channel必须`None` |
| `inbound_source_idempotency_key` | optional source assertion | duplicate consistency digest input | inbound event必须`Some`;不得替代由operation + family + source event派生的application key;其他channel必须`None` |
| `job_run_id` | optional core id | operations run identity | job 必须 `Some`;其他 channel 必须 `None`;不得替代 business / result id |
| `idempotency_key` | optional normalized core key | mutation / consumer / job duplicate protection | command / event / job 必须 `Some`;query 必须 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断是否必须 reserve | 无 | bool | command / event / job = true;query = false |
| `pub fn assert_query_no_write(&self) -> Result<(), ApplicationError>` | 校验 query context 无 write metadata | 无 | result | query 有 idempotency / event / job / command metadata 即 error;不写状态 |
| `pub fn assert_write_metadata_complete(&self) -> Result<(), ApplicationError>` | 校验 command / event / job metadata 对称 | 无 | result | channel-specific required field 缺失或多余即 error |
| `pub fn idempotency_key(&self) -> Result<&CapabilityOperationIdempotencyKey, ApplicationError>` | 返回 write-channel key | 无 | borrowed key | query 返回 error;不生成 fallback key |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_command(operation_name: CapabilityOperationName, actor: ActorContext, metadata: CommandMetadata, trace_id: TraceId, idempotency_key: CapabilityOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 command context | operation、trusted actor、core metadata、trace、normalized key | context | API command entry -> application service |
| `pub fn from_query(operation_name: CapabilityOperationName, actor: ActorContext, metadata: QueryMetadata, trace_id: TraceId) -> Result<Self, ApplicationError>` | 构造 query context | operation、trusted actor、query metadata、trace | context | API query entry -> query service |
| `pub fn from_inbound_event(operation_name: CapabilityOperationName, actor: ActorContext, source_family: CapabilityInboundSourceFamily, protocol_source_event_ref: CapabilitySourceEventRef, source_event_ref: CapabilityInboundEventRef, source_idempotency_key: IdempotencyKey, trace_id: TraceId, idempotency_key: CapabilityOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 inbound event context | operation、system actor、validated source family、public + local source refs、source assertion、trace、dedup-derived application key | context | worker consumer -> application consumer service |
| `pub fn from_job(operation_name: CapabilityOperationName, actor: ActorContext, job_run_id: JobRunId, trace_id: TraceId, idempotency_key: CapabilityOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 operations job context | operation、operator/system actor、run id、trace、run key | context | jobs runner -> maintenance service |

不变量与禁止事项:

- factory 必须执行 channel-option 对称校验;Inbound要求四个source metadata字段与application key全部存在且source family匹配closed operation,其他channel要求四个Inbound字段全部为`None`;不得先构造非法 context 再由 service 猜测修正。
- `inbound_protocol_source_event_ref`与`source_event_ref`必须由worker从同一validated envelope做正式one-way mapping；application用前者回填public receipt和request digest,用后者写本地`source_feedback_ref`,不得互相解析或从topic / payload重建。
- `inbound_source_idempotency_key`只进入request digest；`idempotency_key`仍是由closed operation + source family + public source event确定性形成的application reservation key。同一source event改变source-provided key必须命中同一reservation并形成digest conflict。
- `trace_id` 与 metadata / envelope / job input 的一致性由 Step 8 mapper 校验;本对象只接受已校验值。
- query context 不得 reserve idempotency、append change / trace record、mark stale、rebuild 或调用 write UoW。
- context 不保存 request / event / job payload,也不保存 authorization token、secret 或 external body。

### 12.3 `CapabilityIdempotencyRecord`

```rust
/// Versioned technical reservation for one idempotent capability-hub operation.
pub struct CapabilityIdempotencyRecord {
    /// Normalized idempotency key reserved by the operation.
    pub idempotency_key: CapabilityOperationIdempotencyKey,
    /// Entry channel protected by the reservation.
    pub channel: CapabilityOperationChannel,
    /// Stable operation name protected by the reservation.
    pub operation_name: CapabilityOperationName,
    /// Canonical digest of stable business input fields.
    pub request_digest: CapabilityRequestDigest,
    /// Stored result reference after successful completion.
    pub result_ref: Option<CapabilityApplicationResultRef>,
    /// Current reservation lifecycle state.
    pub state: CapabilityIdempotencyState,
    /// Trace that first reserved the key.
    pub reservation_trace_id: TraceId,
    /// Optimistic version of the reservation.
    pub version: Version,
    /// Time when the key was first reserved.
    pub reserved_at: Timestamp,
    /// Time when the reservation last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| key / channel / operation | normalized key + enums | reservation identity | `CapabilityOperationContext`;query forbidden |
| `request_digest` | canonical digest | duplicate equivalence | application digest calculator;只含 stable business input |
| `result_ref` | optional result pointer | duplicate replay | completed 必须 `Some`;reserved 必须 `None` |
| `state` | technical state | reserve / completion lifecycle | only`Reserved / Completed`;same-key mismatch iszero-write`ApplicationError::IdempotencyConflict`,notpersisted state |
| trace / version / times | core metadata | first reservation attribution / concurrency | context trace + application clock;mutation +1 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches(&self, channel: &CapabilityOperationChannel, operation_name: &CapabilityOperationName, request_digest: &CapabilityRequestDigest) -> bool` | 判断 duplicate 是否为同一 stable request | channel、operation、digest | bool | pure;不读取 current truth |
| `pub fn completed_result_ref(&self) -> Result<&CapabilityApplicationResultRef, ApplicationError>` | 获取 duplicate replay pointer | 无 | borrowed result ref | only completed + Some;missing 是 invariant error |
| `pub fn complete(&mut self, result_ref: CapabilityApplicationResultRef, now: Timestamp) -> Result<(), ApplicationError>` | reservation -> completed | stored result ref、time | result | 只允许 reserved;operation 必须匹配;version +1 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(context: &CapabilityOperationContext, request_digest: CapabilityRequestDigest, now: Timestamp) -> Result<Self, ApplicationError>` | 从 validated write context 建立 reservation | context、stable digest、time | reserved record | IdempotencyRepository absent-key path |

不变量与禁止事项:

- request digest 不得包含 request id、trace id、timestamp、random id、generated truth id、job cursor 或 runtime-only field;exact canonicalization、domain separation、SHA-256 carrier和contracts-owned field encoding由Step 13闭合。
- completed record 遇到 same key / different digest 时保持原记录不变,由 application 返回 conflict disposition;不得覆盖原 result ref。
- reserved mismatch、atomic reserve loser和different Job run同样保持winning record/version/time不变；不得保存conflict row或泄漏winner result body。
- duplicate same digest 必须读取 stored result replay,不得重跑 domain mutation、consumer effect 或 job scan。
- idempotency record 是 application technical state,不是 capability truth 或 event receipt DTO。

### 12.4 `StoredCapabilityOperationResult`

```rust
/// Immutable metadata shell for one replayable public application result surface.
pub struct StoredCapabilityOperationResult {
    /// Stable result reference used by idempotency completion and replay.
    pub result_ref: CapabilityApplicationResultRef,
    /// Public result surface category.
    pub result_kind: StoredCapabilityResultKind,
    /// Original channel-specific result disposition.
    pub disposition: StoredCapabilityResultDisposition,
    /// Opaque pointer to the serialized Step 8 public result surface.
    pub surface_ref: CapabilityStoredResultSurfaceRef,
    /// Integrity digest of the serialized public result surface.
    pub surface_digest: CapabilityStoredResultDigest,
    /// Distributed trace captured when the result was produced.
    pub trace_id: TraceId,
    /// Time when the immutable result shell and surface were stored.
    pub stored_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `result_ref` | operation + result id | replay identity | application id generator + current operation name;不得使用 truth / trace / job id 替代 |
| `result_kind` | finite enum | surface category | command result / rejection、consumer receipt、job report;query excluded |
| `disposition` | channel-tagged disposition | original completion outcome | kind / channel pairing validation;duplicate replay 不创建新 shell |
| `surface_ref` | opaque local pointer | serialized Step 8 DTO surface | result store output;不得指向 truth body、external body 或 current projection by convention |
| `surface_digest` | safe digest | replay integrity | canonical serialized surface digest;算法 Step 13 闭合 |
| trace / time | core metadata | result attribution | operation context trace + same UoW clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_ref(&self, result_ref: &CapabilityApplicationResultRef) -> bool` | result identity check | result ref | bool | pure |
| `pub fn validates_surface(&self, digest: &CapabilityStoredResultDigest) -> bool` | stored surface integrity check | recomputed digest | bool | pure exact digest comparison |
| `pub fn is_command_rejection(&self) -> bool` | rejection surface check | 无 | bool | kind = command rejection |
| `pub fn is_consumer_receipt(&self) -> bool` | receipt surface check | 无 | bool | kind = consumer receipt |
| `pub fn is_job_report(&self) -> bool` | job report surface check | 无 | bool | kind = job report |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_surface(result_ref: CapabilityApplicationResultRef, result_kind: StoredCapabilityResultKind, disposition: StoredCapabilityResultDisposition, surface_ref: CapabilityStoredResultSurfaceRef, surface_digest: CapabilityStoredResultDigest, trace_id: TraceId, stored_at: Timestamp) -> Result<Self, ApplicationError>` | 构造 immutable stored result shell | complete result metadata / pointer / digest | stored result | command result / rejection、consumer receipt、job report store path |

kind / disposition 配对规则:

| `result_kind` | 允许 disposition | 禁止配对 |
|---|---|---|
| `CommandResult` | `Command(Accepted)` | rejected / conflict / duplicate replay;event / job disposition |
| `CommandRejection` | `Command(Rejected)` 或 `Command(Conflict)` | accepted / duplicate replay;event / job disposition |
| `ConsumerReceipt` | `InboundEvent(Accepted / Delayed / Ignored / Rejected / Unsupported / Quarantined)` | duplicate;command / job disposition |
| `JobReport` | `OperationsJob(Completed / PartiallyCompleted / Failed / Retryable)` | command / event disposition |

不变量与禁止事项:

- object 与 referenced serialized surface 必须在 idempotency completion 所在 UoW 的 declared ordering 中持久化;exact transaction Step 11 闭合。
- duplicate command / event / job 只读取原 shell + original surface;response mapper 可标记 replay,但不得创建新的 result id 或重算 current-state response。
- stored surface 不保存 secret、method body、governance body、runtime payload、raw audit material 或 fake evidence。
- missing / digest mismatch 是 explicit invariant / persistence failure,不得 fallback 重跑 mutation。

### 12.5 `CapabilityReadVisibilityDecision`

```rust
/// Ephemeral application decision for visible, not-visible, or degraded query output.
pub struct CapabilityReadVisibilityDecision {
    /// Body-free query subject evaluated by the application service.
    pub read_subject_ref: CapabilityReadSubjectRef,
    /// Trusted actor context for the read evaluation.
    pub actor_context: ActorContext,
    /// Explicit read visibility result.
    pub visibility: CapabilityReadVisibilityMarker,
    /// Body-free degraded reason when a degraded surface is allowed.
    pub degraded_reason: Option<CapabilityReadDegradedReason>,
    /// Exact source versions used by the visibility and freshness evaluation.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Time when the ephemeral read decision was evaluated.
    pub evaluated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `read_subject_ref` | read subject union | query target | validated query input + loaded typed id |
| `actor_context` | core actor | visibility audience | operation context;不持久化为 authorization truth |
| `visibility` | explicit marker | visible / not-visible / degraded | formal visibility、consumer applicability、read-model freshness evaluation |
| `degraded_reason` | optional closed reason | degraded explanation | degraded 必须 `Some`;visible / not-visible 必须 `None`;inner kind只可来自read resolver的typed policy / persisted-state mapping,不得来自safe-text解析 |
| `source_versions` | source marker set | decision basis | exact loaded truth / view / projection / report versions;不作为 lock token |
| `evaluated_at` | timestamp | decision time | application clock;decision ephemeral |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_serve_full_surface(&self) -> bool` | 判断能否返回 full allowed surface | 无 | bool | visible only |
| `pub fn can_serve_degraded_surface(&self) -> bool` | 判断能否返回 explicit degraded surface | 无 | bool | degraded + reason present |
| `pub fn is_not_visible(&self) -> bool` | not-visible check | 无 | bool | marker comparison |
| `pub fn assert_query_no_write(&self, context: &CapabilityOperationContext) -> Result<(), ApplicationError>` | 强制 decision 仅用于 query | operation context | result | query channel + no idempotency;无 mutation |
| `CapabilityReadDegradedReason::from_kind(kind) -> Self` | 构造closed degraded reason | authoritative typed kind | reason | 不接收string、issue ref、raw error或adapter code |
| `CapabilityReadDegradedReason::as_kind(&self) -> &CapabilityQueryDegradedKind` | 读取typed kind供freshness mapping | 无 | borrowed kind | 只读,不暴露private field |
| `CapabilityReadDegradedReason::into_public_marker(self) -> CapabilityQueryDegradedMarker` | 形成kind/ref同源public marker | self | marker | `issue_ref=CapabilityProtocolValidationIssueRef::from_code(kind.issue_code())`;不得接受caller-supplied ref |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_marker(read_subject_ref: CapabilityReadSubjectRef, actor: ActorContext, visibility: CapabilityReadVisibilityMarker, degraded_reason: Option<CapabilityReadDegradedReason>, source_versions: DerivedMaterialSourceVersionSet, evaluated_at: Timestamp) -> Result<Self, ApplicationError>` | 从 formal visibility / freshness marker 构造 read decision | subject、actor、marker、optional reason、source versions、time | decision | capability directory / exposure / view / trace / report query service |

不变量与禁止事项:

- decision 是 request-local application value,不持久化为 capability truth、governance approval 或 runtime authorization。
- not-visible 必须返回 explicit protocol surface,不得伪装 not-found / visible;exact status mapping Step 8 / 12 闭合。
- degraded 只允许返回 Step 8 明确定义的 body-free partial surface,不得静默省略 forbidden / required data。
- degraded reason是closed `CapabilityQueryDegradedKind`,不是诊断文本。`into_public_marker`必须先复制kind对应code再形成deterministic ref,保证`kind`与`issue_ref`来自同一match arm；freshness由Step 8 / 12的8-arm closed table映射。
- query service 不得借 visibility evaluation mark stale、rebuild、refresh ref、append trace 或写 idempotency。

### 12.6 `CapabilityEventPayloadSnapshot`

```rust
/// Immutable local snapshot of one complete schema-versioned outbound event envelope.
pub struct CapabilityEventPayloadSnapshot {
    /// Stable local payload snapshot identifier.
    pub payload_snapshot_id: CapabilityEventPayloadSnapshotId,
    /// Exact committed source represented by the serialized event envelope.
    pub source_ref: CapabilityEventCaptureSourceRef,
    /// Closed event schema and version selected by the Step 8 mapper.
    pub schema_ref: CapabilityEventSchemaRef,
    /// Integrity digest of the complete serialized event envelope.
    pub candidate_digest: CapabilityEventCandidateDigest,
    /// Complete serialized Step 8 outbound event envelope.
    pub serialized_envelope: Vec<u8>,
    /// Distributed trace copied from the source operation or committed source.
    pub trace_id: TraceId,
    /// Time when the immutable envelope was formed inside the local transaction.
    pub captured_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `payload_snapshot_id` | typed id | immutable snapshot identity | `IdGeneratorPort`;不得使用source id、trace或digest替代 |
| `source_ref` | exact source union | event semantic authority | same-UoW change / trace / impact / derived / reference revision;versioned source必须exact |
| `schema_ref` | opaque schema ref | event name + schema version identity | Step 8 closed mapper;adapter不得改写 |
| `candidate_digest` | safe digest | duplicate / collision integrity | application从complete serialized envelope统一计算 |
| `serialized_envelope` | bytes | repair / collaboration唯一payload来源 | complete Step 8 envelope;non-empty;不得只存payload fragment |
| `trace_id` | core trace | source / collaboration trace continuity | source operation or committed source;不得由publisher重生 |
| `captured_at` | timestamp | local candidate formation time | same application clock value used by envelope `occurred_at` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validates_digest(&self, digest: &CapabilityEventCandidateDigest) -> bool` | 校验完整serialized envelope完整性 | recomputed canonical digest | bool | pure exact equality |
| `pub fn matches_source(&self, source_ref: &CapabilityEventCaptureSourceRef) -> bool` | 校验snapshot与capture来源一致 | exact source | bool | pure exact equality |
| `pub fn as_serialized_envelope(&self) -> &[u8]` | 提供只读完整envelope bytes | 无 | borrowed bytes | 不允许mutation / partial extraction |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn freeze(id: CapabilityEventPayloadSnapshotId, source_ref: CapabilityEventCaptureSourceRef, schema_ref: CapabilityEventSchemaRef, candidate_digest: CapabilityEventCandidateDigest, serialized_envelope: Vec<u8>, trace_id: TraceId, captured_at: Timestamp) -> Result<Self, ApplicationError>` | 冻结完整outbound envelope | generated id、exact source、closed schema、canonical digest、non-empty bytes、source trace / time | immutable snapshot | accepted truth / material / reference local UoW |

不变量与禁止事项:

- snapshot 必须与其 source mutation、material save或reference-state save进入同一local UoW;transaction rollback同时撤销二者。已存在的immutable source补发只能通过后续明确backfill设计,不得由publisher临时从current truth重建。
- `Change`本身append-only;`Traceability / Impact / ReferenceResolution` ref必须带`Some(version)`;`DerivedMaterial`显式携带positive exact version。current ref或缺失version必须拒绝。
- bytes覆盖完整`CapabilityOutboundEventEnvelope<T>`,包括event name、schema version、source ref、occurred time、trace、routing key和payload;不得只保存payload后在worker补header。
- snapshot 创建后不可update / delete-and-replace。schema演进或source新revision必须创建新snapshot和capture。
- snapshot不保存physical topic、consumer group、endpoint、credential、retry count、attempt log、external response或delivery status。

### 12.7 `CapabilityEventCaptureRecord`

```rust
/// Versioned local record that makes one outbound event candidate recoverable after commit.
pub struct CapabilityEventCaptureRecord {
    /// Stable local capture identifier.
    pub capture_id: CapabilityEventCaptureId,
    /// Exact committed source represented by this capture.
    pub source_ref: CapabilityEventCaptureSourceRef,
    /// Immutable payload snapshot frozen for the source and event schema.
    pub payload_snapshot_id: CapabilityEventPayloadSnapshotId,
    /// Closed schema identity copied from the immutable payload snapshot.
    pub schema_ref: CapabilityEventSchemaRef,
    /// Canonical candidate digest copied from the immutable payload snapshot.
    pub candidate_digest: CapabilityEventCandidateDigest,
    /// Current local capture lifecycle.
    pub capture_state: CapabilityEventCaptureState,
    /// Stable external collaboration intent after successful binding.
    pub collaboration_intent_ref: Option<CapabilityEventCollaborationIntentRef>,
    /// Optimistic version of the local capture record.
    pub version: Version,
    /// Time when the source and payload snapshot were captured locally.
    pub captured_at: Timestamp,
    /// Time when the local capture record last changed.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `capture_id` | typed id | durable recovery identity | `IdGeneratorPort`;不得用external intent替代 |
| `source_ref` / `payload_snapshot_id` | exact source + snapshot id | local recovery join | copied from validated snapshot;同一source + schema只能有一个canonical capture |
| `schema_ref` / `candidate_digest` | schema + digest | collision / snapshot symmetry | copied from snapshot,不得由repository或worker重算 |
| `capture_state` / `collaboration_intent_ref` | local state + optional external ref | pre-intent gap closure | Captured -> None;IntentBound -> Some;不保存external delivery status |
| `version` / times | optimistic version + clock | bind concurrency / attribution | create version 1;intent bind +1;same clock on initial capture |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_ready_for_collaboration(&self) -> bool` | 判断capture是否尚未绑定intent | 无 | bool | only Captured + None |
| `pub fn bound_intent_ref(&self) -> Result<&CapabilityEventCollaborationIntentRef, ApplicationError>` | 取得已绑定external intent | 无 | borrowed intent ref | only IntentBound + Some |
| `pub fn validates_snapshot(&self, snapshot: &CapabilityEventPayloadSnapshot) -> bool` | 校验source / id / schema / digest四元组对称 | immutable snapshot | bool | pure;不解析bytes |
| `pub fn bind_intent(&mut self, intent_ref: CapabilityEventCollaborationIntentRef, now: Timestamp) -> Result<(), ApplicationError>` | 绑定stable external intent | typed intent、clock | result | Captured -> IntentBound;version +1;同intent duplicate no-op或由Step 13明确;不同intent conflict |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(id: CapabilityEventCaptureId, snapshot: &CapabilityEventPayloadSnapshot) -> Result<Self, ApplicationError>` | 从已冻结snapshot建立durable capture | generated capture id、validated immutable snapshot | Captured record | same local UoW as snapshot and source commit |

不变量与禁止事项:

- capture是application technical consistency record,不是capability truth、domain event、outbox business aggregate或external delivery truth。
- 唯一允许的local transition是`Captured -> IntentBound`;external `Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable`仍由`CapabilityAccessEventCollaborationPort`读取,不得复制到本对象。
- source、snapshot、schema和digest一经capture不得修改。若external call成功后local bind前崩溃,repair使用同一snapshot / digest重调idempotent collaboration并绑定同一stable intent。
- `IntentBound`后不得换绑另一个intent。external retry只对原intent调用port `repair`,不创建新capture或新snapshot。
- 本对象不保存topic、payload副本、attempt、schedule、retry counter、transport error、external body、实现run、测试结果、evidence alias或验收签署。

### 12.8 `CapabilityJobExecutionRecord`

本对象是batch `9.11` pre-entry hard gate触发的application technical journal。它只持久化一个已接受Job的完整稳定planning outcome、逐target终态结果和final result linkage；planning outcome可以是完整typed target plan,也可以是“完整planning尚未形成”的typed Failed / Retryable空计划。它不拥有capability business truth,也不是runner、scheduler、queue、worker、lease、attempt或retry subsystem。

```rust
/// Minimal local lifecycle of one recoverable operations-job execution journal.
pub enum CapabilityJobExecutionState {
    /// A durable planning outcome exists and zero or more targets may remain planned.
    Planned,
    /// Every target is terminal and the typed stored response is committed atomically.
    Finalized,
}

/// Positive one-based stable position of one target in a job execution plan.
pub struct CapabilityJobExecutionTargetOrdinal(
    /// Positive one-based ordinal preserved by processing and report assembly.
    u32,
);

/// Exact body-free observability or audit reference plan used by one export target.
pub struct CapabilityJobExecutionAuditReferencePlan {
    /// Local observability or audit reference identifier selected by the request.
    pub audit_ref_id: ObservabilityAuditRefId,
    /// Exact local reference-object version frozen during planning.
    pub reference_version: Version,
    /// Exact canonical resolution-state revision frozen during planning.
    pub resolution_state_ref: ReferenceResolutionStateRef,
}

/// Complete typed target plan frozen before any target effect may start.
pub enum CapabilityJobExecutionTargetPlan {
    /// One registry-centered reconciliation report target.
    RegistryReconciliation {
        /// Preallocated local report identifier used by the target and its public target reference.
        report_id: CapabilityReconciliationReportId,
        /// Body-free reconciliation scope copied from the validated request.
        reconciliation_scope: CapabilityReconciliationScope,
        /// Complete stable committed-truth subjects inspected by this target.
        source_truth_refs: AccessTruthRefSet,
        /// Complete stable derived-material subjects inspected by this target.
        inspected_material_refs: DerivedMaterialRefSet,
        /// Exact source and material versions frozen for comparison.
        source_versions: DerivedMaterialSourceVersionSet,
        /// Body-free reconciliation findings frozen from the exact comparison basis.
        finding_summary: ReconciliationFindingSummary,
        /// Final domain report state selected from the frozen findings.
        report_state: ReconciliationReportState,
        /// Stable failure reason required only when the selected report state is failed.
        failure_reason: Option<ReconciliationFailureReason>,
    },
    /// One controlled consumer-view refresh target.
    ControlledView {
        /// Existing or preallocated local controlled-view identifier.
        consumer_view_id: ControlledConsumerViewId,
        /// Exact existing controlled-view revision,orNone when the identifier was preallocated for creation.
        existing_consumer_view_ref: Option<ControlledConsumerViewRef>,
        /// Exact formal-exposure revision that remains read-only to the target.
        exposure_ref: FormalExposureBoundaryRef,
        /// Registered consumer boundary represented by the target view.
        consumer_ref: CapabilityConsumerRef,
        /// Final body-free descriptor summary and typed partial categories frozen from the exact accepted source chain.
        descriptor_summary: DescriptorConsumerSummary,
        /// Exact accepted source versions frozen during target planning.
        source_versions: ConsumerViewSourceVersionSet,
    },
    /// One directory search and browse projection rebuild target.
    DirectoryProjection {
        /// Existing or preallocated local directory-projection identifier.
        projection_id: DirectorySearchBrowseProjectionId,
        /// Exact existing projection revision,orNone when the identifier was preallocated for creation.
        existing_projection_ref: Option<DirectorySearchBrowseProjectionRef>,
        /// Exact registry, descriptor, and exposure source chain.
        source: CapabilityDirectoryProjectionSource,
        /// Body-free directory display summary frozen from the exact source chain.
        display_summary: CapabilityDirectoryDisplaySummary,
        /// Stable typed search and browse facets frozen from the exact source chain.
        filter_facets: DirectorySearchFacetSet,
        /// Exact source versions frozen during target planning.
        source_versions: DerivedMaterialSourceVersionSet,
    },
    /// One audit-friendly export preparation target.
    AuditExport {
        /// Existing or preallocated local audit-export identifier.
        export_id: AuditFriendlyExportSummaryId,
        /// Exact existing export revision,orNone when the identifier was preallocated for creation.
        existing_export_ref: Option<AuditFriendlyExportSummaryRef>,
        /// Exact traceability revision summarized by the target.
        traceability_ref: CapabilityAccessTraceabilityRecordRef,
        /// Body-free export scope copied from the validated request.
        export_scope: AuditExportScope,
        /// Final body-free audit summary frozen from the exact trace revision.
        allowed_summary: AuditAllowedSummary,
        /// Stable duplicate-free exact observability or audit reference plans.
        observability_refs: Vec<CapabilityJobExecutionAuditReferencePlan>,
        /// Exact source versions frozen during target planning.
        source_versions: DerivedMaterialSourceVersionSet,
    },
    /// One read-only ecosystem discovery rebuild target.
    EcosystemDiscovery {
        /// Existing or preallocated local ecosystem-discovery identifier.
        discovery_id: ReadOnlyEcosystemDiscoverySummaryId,
        /// Exact existing discovery revision,orNone when the identifier was preallocated for creation.
        existing_discovery_ref: Option<ReadOnlyEcosystemDiscoverySummaryRef>,
        /// Exact formal-exposure revision used by the target.
        exposure_ref: FormalExposureBoundaryRef,
        /// Body-free ecosystem context represented by the target.
        ecosystem_context_ref: EcosystemContextRef,
        /// Final body-free discoverability summary frozen from the exact accepted source chain.
        discoverability_summary: CapabilityDiscoverabilitySummary,
        /// Exact source versions frozen during target planning.
        source_versions: DerivedMaterialSourceVersionSet,
        /// Final discovery availability state selected from the frozen safe source basis.
        expected_state: EcosystemDiscoveryState,
        /// Explicit safe reason required only for a planned partial or unavailable outcome.
        state_reason: Option<DiscoveryUnavailableReason>,
    },
    /// One broad derived-material reconciliation report target.
    DerivedReconciliation {
        /// Preallocated local report identifier used by the target and its public target reference.
        report_id: CapabilityReconciliationReportId,
        /// Body-free reconciliation scope copied from the validated request.
        reconciliation_scope: CapabilityReconciliationScope,
        /// Complete stable committed-truth subjects inspected by this target.
        source_truth_refs: AccessTruthRefSet,
        /// Complete stable derived-material subjects inspected by this target.
        inspected_material_refs: DerivedMaterialRefSet,
        /// Exact source and material versions frozen for comparison.
        source_versions: DerivedMaterialSourceVersionSet,
        /// Body-free reconciliation findings frozen from the exact comparison basis.
        finding_summary: ReconciliationFindingSummary,
        /// Final domain report state selected from the frozen findings.
        report_state: ReconciliationReportState,
        /// Stable failure reason required only when the selected report state is failed.
        failure_reason: Option<ReconciliationFailureReason>,
    },
    /// One target whose stable failure was fully classified before any target effect started.
    PreclassifiedFailure {
        /// Public-safe target failure persisted for zero-effect terminalization in ordinal order.
        failure: CapabilityJobExecutionTargetFailure,
    },
    /// One canonical external-reference resolution refresh target.
    ReferenceResolution {
        /// Body-free local reference subject selected during planning.
        reference_subject: ReferenceSubjectRef,
        /// Closed reference kind that selects the matching resolver family.
        reference_kind: ReferenceKind,
        /// Exact local reference-object version frozen during planning.
        reference_version: Version,
        /// Exact existing canonical resolution-state revision.
        resolution_state_ref: ReferenceResolutionStateRef,
    },
    /// One durable local event-capture recovery target.
    EventCapture {
        /// Exact local capture revision and immutable snapshot join selected during planning.
        capture_ref: CapabilityEventCaptureRef,
        /// Exact immutable event source frozen from the official capture and snapshot join.
        source_ref: CapabilityEventCaptureSourceRef,
        /// Stable intent already bound at planning time,orNone when collaboration must form and bind one.
        existing_intent_ref: Option<CapabilityEventCollaborationIntentRef>,
    },
    /// One external event-collaboration intent repair target.
    CollaborationIntent {
        /// Stable external collaboration intent selected during planning.
        intent_ref: CapabilityEventCollaborationIntentRef,
        /// Exact immutable event source acknowledged by the intent.
        source_ref: CapabilityEventCaptureSourceRef,
    },
}

/// Typed successful outcome persisted with the matching target business effect.
pub enum CapabilityJobExecutionSuccess {
    /// Persisted reconciliation report view for either reconciliation job.
    Reconciliation(
        /// Exact body-free view copied from the committed reconciliation report.
        CapabilityReconciliationJobReportView,
    ),
    /// Successfully processed controlled consumer-view item.
    ControlledView(
        /// Exact typed item used by the controlled-view Job response.
        CapabilityControlledViewRefreshItem,
    ),
    /// Successfully processed directory projection item.
    DirectoryProjection(
        /// Exact typed item used by the directory-projection Job response.
        CapabilityDirectoryProjectionRebuildItem,
    ),
    /// Successfully processed audit export item.
    AuditExport(
        /// Exact typed item used by the audit-export Job response.
        CapabilityAuditExportPreparationItem,
    ),
    /// Successfully processed ecosystem discovery item.
    EcosystemDiscovery(
        /// Exact typed item used by the ecosystem-discovery Job response.
        CapabilityEcosystemDiscoveryRebuildItem,
    ),
    /// Successfully inspected canonical reference-resolution item.
    ReferenceResolution(
        /// Exact typed item used by the reference-refresh Job response.
        CapabilityReferenceResolutionRefreshItem,
    ),
    /// Successfully inspected or repaired event-collaboration item.
    EventCollaboration(
        /// Exact typed item used by the event-collaboration repair Job response.
        CapabilityEventCollaborationRepairItem,
    ),
}

/// Technical effect of one redacted issue on final operations-job disposition.
pub enum CapabilityJobExecutionIssueImpact {
    /// The issue is reportable but does not by itself block successful completion.
    Advisory,
    /// The issue is a stable failure for this accepted execution plan.
    StableFailure,
    /// A temporary prerequisite prevented a stable outcome and permits only a new-run retry.
    RetryablePrerequisite,
}

/// Target failure with the durable impact required for final disposition reconstruction.
pub struct CapabilityJobExecutionTargetFailure {
    /// Existing public-safe target and redacted issue mapped to the failed-target vector.
    issue: CapabilityJobTargetIssue,
    /// Stable or retryable impact;Advisory is invalid for a failed target.
    impact: CapabilityJobExecutionIssueImpact,
}

/// Request or run-level issue kept separate from target failures and skips.
pub struct CapabilityJobExecutionRunIssue {
    /// Existing redacted issue reference mapped to the public response issue set.
    issue_ref: CapabilityProtocolValidationIssueRef,
    /// Advisory,stable-failure,or retryable effect on final disposition.
    impact: CapabilityJobExecutionIssueImpact,
}

/// Durable lifecycle outcome of one planned operations-job target.
pub enum CapabilityJobExecutionTargetOutcome {
    /// The frozen target has not committed any target-local business effect.
    Planned,
    /// The target effect and exact typed successful outcome committed atomically.
    Succeeded(
        /// Exact typed successful outcome matching the frozen target plan.
        CapabilityJobExecutionSuccess,
    ),
    /// The target committed no business effect and has one stable terminal failure issue.
    Failed(
        /// Public-safe failure and durable final-disposition impact.
        CapabilityJobExecutionTargetFailure,
    ),
    /// A stable boundary rule intentionally skipped the target without a business effect.
    Skipped(
        /// Public-safe target and redacted issue copied into the final skipped-target vector.
        CapabilityJobTargetIssue,
    ),
}

/// One immutable plan entry with a monotonic durable terminal outcome.
pub struct CapabilityJobExecutionTarget {
    /// Stable one-based order used by processing and report assembly.
    pub ordinal: CapabilityJobExecutionTargetOrdinal,
    /// Public-safe target identity used by failed and skipped report entries.
    pub target_ref: CapabilityJobTargetRef,
    /// Complete typed execution plan frozen before target processing starts.
    pub plan: CapabilityJobExecutionTargetPlan,
    /// Current durable target outcome.
    pub outcome: CapabilityJobExecutionTargetOutcome,
}

/// Versioned application journal for one idempotency-owned operations-job execution.
pub struct CapabilityJobExecutionRecord {
    /// Normalized idempotency key that uniquely owns this journal.
    pub idempotency_key: CapabilityOperationIdempotencyKey,
    /// Closed application operation protected by the matching reservation.
    pub operation_name: CapabilityOperationName,
    /// Closed public Job name mapped from the application operation.
    pub job_name: CapabilityJobName,
    /// Exact accepted request and response schema version.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Core run identity copied from the accepted Job metadata.
    pub run_id: JobRunId,
    /// Trusted actor captured when the stable target plan was created.
    pub actor_context: ActorContext,
    /// Original distributed trace captured when the stable target plan was created.
    pub trace_id: TraceId,
    /// Canonical stable request digest shared with the idempotency reservation.
    pub request_digest: CapabilityRequestDigest,
    /// Current minimal execution-journal lifecycle.
    pub execution_state: CapabilityJobExecutionState,
    /// Complete target plan in stable one-based order;valid zero-target scans and planning failures may be empty.
    pub targets: Vec<CapabilityJobExecutionTarget>,
    /// Stable redacted request or run-level issues kept outside target failures.
    pub run_issues: Vec<CapabilityJobExecutionRunIssue>,
    /// Stored result linked atomically when this journal is finalized.
    pub final_result_ref: Option<CapabilityApplicationResultRef>,
    /// Optimistic version of the journal record.
    pub version: Version,
    /// Time when the complete planning outcome and reservation became durable.
    pub planned_at: Timestamp,
    /// Time when the journal last changed.
    pub updated_at: Timestamp,
    /// Time when the typed result became atomically visible.
    pub finalized_at: Option<Timestamp>,
}

impl CapabilityJobExecutionTargetOrdinal {
    /// Creates a stable target ordinal from a positive one-based integer.
    pub fn try_from_one_based(value: u32) -> Result<Self, ContractValueError>;

    /// Returns the positive one-based target position.
    pub fn get(&self) -> u32;
}

impl CapabilityJobExecutionTargetPlan {
    /// Returns whether this typed plan is symmetric with the declared public-safe target reference.
    pub fn matches_target_ref(&self, target_ref: &CapabilityJobTargetRef) -> bool;
}

impl CapabilityJobExecutionSuccess {
    /// Returns whether this successful outcome is symmetric with the frozen typed target plan.
    pub fn matches_plan(&self, plan: &CapabilityJobExecutionTargetPlan) -> bool;
}

impl CapabilityJobExecutionTargetFailure {
    /// Creates a failed-target outcome with a stable or retryable impact.
    pub fn try_new(
        issue: CapabilityJobTargetIssue,
        impact: CapabilityJobExecutionIssueImpact,
    ) -> Result<Self, ApplicationError>;

    /// Returns the public-safe failed-target issue.
    pub fn issue(&self) -> &CapabilityJobTargetIssue;

    /// Returns the durable issue impact used by final disposition assembly.
    pub fn impact(&self) -> &CapabilityJobExecutionIssueImpact;
}

impl CapabilityJobExecutionRunIssue {
    /// Creates one redacted run-level issue with its durable disposition impact.
    pub fn new(
        issue_ref: CapabilityProtocolValidationIssueRef,
        impact: CapabilityJobExecutionIssueImpact,
    ) -> Self;

    /// Returns the redacted issue reference mapped to the public response.
    pub fn issue_ref(&self) -> &CapabilityProtocolValidationIssueRef;

    /// Returns the durable issue impact used by final disposition assembly.
    pub fn impact(&self) -> &CapabilityJobExecutionIssueImpact;
}

impl CapabilityJobExecutionTarget {
    /// Creates one planned target after validating ordinal, target-reference, and plan symmetry.
    pub fn planned(
        ordinal: CapabilityJobExecutionTargetOrdinal,
        target_ref: CapabilityJobTargetRef,
        plan: CapabilityJobExecutionTargetPlan,
    ) -> Result<Self, ApplicationError>;

    /// Returns whether this target has no committed terminal outcome.
    pub fn is_planned(&self) -> bool;

    /// Returns whether this target outcome is immutable and terminal.
    pub fn is_terminal(&self) -> bool;
}

impl CapabilityJobExecutionRecord {
    /// Creates a recoverable journal from one validated Job context, stable target plan, and initial run issues.
    pub fn plan(
        context: &CapabilityOperationContext,
        job_name: CapabilityJobName,
        schema_version: CapabilityProtocolSchemaVersion,
        request_digest: CapabilityRequestDigest,
        targets: Vec<CapabilityJobExecutionTarget>,
        run_issues: Vec<CapabilityJobExecutionRunIssue>,
        now: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// Returns whether a reentered request exactly matches this journal identity and digest.
    pub fn matches_request(
        &self,
        context: &CapabilityOperationContext,
        job_name: &CapabilityJobName,
        schema_version: &CapabilityProtocolSchemaVersion,
        request_digest: &CapabilityRequestDigest,
    ) -> bool;

    /// Returns the first planned target in stable ordinal order.
    pub fn next_planned_target(&self) -> Option<&CapabilityJobExecutionTarget>;

    /// Records one plan-symmetric successful outcome as an immutable terminal target result.
    pub fn record_succeeded(
        &mut self,
        ordinal: CapabilityJobExecutionTargetOrdinal,
        success: CapabilityJobExecutionSuccess,
        now: Timestamp,
    ) -> Result<(), ApplicationError>;

    /// Records one target-symmetric failure after the target business-effect transaction rolled back.
    pub fn record_failed(
        &mut self,
        ordinal: CapabilityJobExecutionTargetOrdinal,
        failure: CapabilityJobExecutionTargetFailure,
        now: Timestamp,
    ) -> Result<(), ApplicationError>;

    /// Records one target-symmetric stable skip without a target business effect.
    pub fn record_skipped(
        &mut self,
        ordinal: CapabilityJobExecutionTargetOrdinal,
        issue: CapabilityJobTargetIssue,
        now: Timestamp,
    ) -> Result<(), ApplicationError>;

    /// Appends one duplicate-free redacted request or run-level issue.
    pub fn record_run_issue(
        &mut self,
        issue: CapabilityJobExecutionRunIssue,
        now: Timestamp,
    ) -> Result<(), ApplicationError>;

    /// Finalizes an all-terminal journal with the exact stored Job result reference.
    pub fn finalize(
        &mut self,
        result_ref: CapabilityApplicationResultRef,
        now: Timestamp,
    ) -> Result<(), ApplicationError>;
}
```

Plan / target / success symmetry:

| plan variant | required `target_ref` | allowed success | no-current-truth rule |
|---|---|---|---|
| registry / derived reconciliation | `DerivedMaterial::ReconciliationReport(report_id)` | `Reconciliation` with the same exact report id | use frozen truth / material refs、source versions、findings / state / reason;never `find_by_job_run` |
| controlled view | `ControlledView(exposure_ref,consumer_ref)` | `ControlledView` with the planned view id / exposure / consumer | exact-load exposure / optional existing view；use frozen descriptor summary / versions；do not rescan audience / current summary |
| directory projection | `DerivedMaterial::DirectoryProjection(projection_id)` | `DirectoryProjection` with the same id and exact source chain | exact-load source chain / optional existing projection；use frozen display / facets / versions；no current source replacement |
| audit export | `TraceabilityRecord(traceability_ref)` | `AuditExport` with the planned export id / trace ref | exact-load trace / optional export / each audit ref+state；use frozen allowed summary；no current audit lookup |
| ecosystem discovery | `EcosystemDiscovery(exposure_ref,context_ref)` | `EcosystemDiscovery` with the planned id / source pair andexpected state | exact-load exposure / optional discovery；use frozen discoverability summary / versions / final state/reason；no current summary or marketplace lookup |
| preclassified failure | exact `failure.issue().target_ref` | none;`Succeeded` is always rejected | call only`record_failed` in an independent zero-business-effect UoW;no source reload、resolver、factory、id generation orcapture |
| reference resolution | `Reference(reference_subject)` | `ReferenceResolution` with the same subject / planned state id；`Unchanged`requires the exact planned state ref,while`Updated`requires the same state id at exactly one successor version | exact reference version + state ref;no initial-state repair、current-state replacement ormulti-version jump |
| event capture | `EventCapture(capture_ref)` | `EventCollaboration` with the same capture id / frozen source；`existing_intent_ref=None` requires one immediate successor capture revision bound to the outcome intent,while`Some(intent)` requires the unchanged exact capture revision andsame intent | official immutable snapshot only；no mapper/source reload orsecond bind |
| collaboration intent | `CollaborationIntent(intent_ref)` | `EventCollaboration` with the same intent / source | external exact-intent read / repair only |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn try_from_one_based(value: u32) -> Result<CapabilityJobExecutionTargetOrdinal, ContractValueError>` | 构造positive ordinal | one-based integer | ordinal | zero拒绝;不接受adapter cursor |
| `pub fn get(&self) -> u32` | 读取one-based ordinal | 无 | positive integer | pure;不暴露可变载荷 |
| `pub fn matches_target_ref(&self, target_ref: &CapabilityJobTargetRef) -> bool` | 校验plan / public target identity对称 | typed target ref | bool | pure;不得解析opaque ref |
| `pub fn matches_plan(&self, plan: &CapabilityJobExecutionTargetPlan) -> bool` | 校验success / plan variant及exact refs对称 | frozen plan | bool | pure;不读取repository |
| `pub fn try_new(issue: CapabilityJobTargetIssue, impact: CapabilityJobExecutionIssueImpact) -> Result<CapabilityJobExecutionTargetFailure, ApplicationError>` | 构造target failure | existing public issue、stable/retryable impact | failure | `Advisory`拒绝;target ref仍由record method校验 |
| `pub fn issue(&self) -> &CapabilityJobTargetIssue`;`pub fn impact(&self) -> &CapabilityJobExecutionIssueImpact` | 读取failure映射数据 | 无 | borrowed values | pure;不暴露mutable field |
| `pub fn new(issue_ref: CapabilityProtocolValidationIssueRef, impact: CapabilityJobExecutionIssueImpact) -> CapabilityJobExecutionRunIssue` | 构造run issue | redacted ref、typed impact | run issue | ref/impact同存;不解析opaque ref |
| `pub fn issue_ref(&self) -> &CapabilityProtocolValidationIssueRef`;`pub fn impact(&self) -> &CapabilityJobExecutionIssueImpact` | 读取run issue映射数据 | 无 | borrowed values | pure;不暴露mutable field |
| `pub fn planned(ordinal: CapabilityJobExecutionTargetOrdinal, target_ref: CapabilityJobTargetRef, plan: CapabilityJobExecutionTargetPlan) -> Result<CapabilityJobExecutionTarget, ApplicationError>` | 构造单个planned target | positive ordinal、public target、typed plan | target | outcome固定Planned;plan / ref mismatch拒绝 |
| `pub fn is_planned(&self) -> bool`;`pub fn is_terminal(&self) -> bool` | target outcome guard | 无 | bool | pure;terminal包括Succeeded / Failed / Skipped |
| `pub fn plan(context: &CapabilityOperationContext, job_name: CapabilityJobName, schema_version: CapabilityProtocolSchemaVersion, request_digest: CapabilityRequestDigest, targets: Vec<CapabilityJobExecutionTarget>, run_issues: Vec<CapabilityJobExecutionRunIssue>, now: Timestamp) -> Result<Self, ApplicationError>` | 构造完整stable target journal | validated Job context、closed identity、digest、complete contiguous plan、stable duplicate-free initial run issues、clock | planned record | execution = Planned;version = 1;valid empty scan或typed planning-failure empty plan均合法;final result / finalized time = None |
| `pub fn matches_request(&self, context: &CapabilityOperationContext, job_name: &CapabilityJobName, schema_version: &CapabilityProtocolSchemaVersion, request_digest: &CapabilityRequestDigest) -> bool` | 校验reserved reentry identity | current request identity | bool | exact key / operation / job / schema / run / digest equality;不比较new trace替代original trace |
| `pub fn next_planned_target(&self) -> Option<&CapabilityJobExecutionTarget>` | 按ordinal选择唯一next target | 无 | first planned target | pure;不跳过更小ordinal、不扫描repository |
| `pub fn record_succeeded(&mut self, ordinal: CapabilityJobExecutionTargetOrdinal, success: CapabilityJobExecutionSuccess, now: Timestamp) -> Result<(), ApplicationError>` | target Planned -> Succeeded | exact ordinal、plan-matching typed success、clock | result | terminal outcome immutable;version +1 |
| `pub fn record_failed(&mut self, ordinal: CapabilityJobExecutionTargetOrdinal, failure: CapabilityJobExecutionTargetFailure, now: Timestamp) -> Result<(), ApplicationError>` | target Planned -> Failed | exact ordinal、matching target ref / redacted issue、stable/retryable impact、clock | result | no committed target effect may be omitted;version +1 |
| `pub fn record_skipped(&mut self, ordinal: CapabilityJobExecutionTargetOrdinal, issue: CapabilityJobTargetIssue, now: Timestamp) -> Result<(), ApplicationError>` | target Planned -> Skipped | exact ordinal、matching target ref / stable boundary issue、clock | result | unchanged success不得伪装skip;version +1 |
| `pub fn record_run_issue(&mut self, issue: CapabilityJobExecutionRunIssue, now: Timestamp) -> Result<(), ApplicationError>` | 持久化非target issue及disposition impact | redacted stable issue、clock | result | stable duplicate-free ref order;不得保存raw error或只留内存 |
| `pub fn finalize(&mut self, result_ref: CapabilityApplicationResultRef, now: Timestamp) -> Result<(), ApplicationError>` | execution Planned -> Finalized | exact current operation result ref、clock | result | all targets terminal;result ref Some;version +1;只允许一次 |

不变量与禁止事项:

- normalized `CapabilityOperationIdempotencyKey`是journal唯一owner key。不得新增execution id、用`JobRunId`作repository key或扩展`IdGeneratorPort`。
- initial UoW必须原子提交`CapabilityIdempotencyRecord::Reserved`与完整journal。若`N > 0`,ordinal严格为`1..=N`且target ref duplicate-free；合法scan可形成`N = 0`且`run_issues`为空的空plan。plan一旦create不得append、delete、replace或reorder。
- `plan(...)`必须把planning阶段已形成的safe request / run issue作为initial `run_issues`一起校验和持久化。issue ref按planning发现顺序稳定、duplicate-free,impact不得从opaque ref或error text推导。initial issue不是target outcome,也不得在commit后只留request-local accumulator。
- initial run issue只能接收Step 8既有protocol / policy mapping已经形成的typed `CapabilityProtocolValidationIssueRef`;其exact error variant与ref构造规则继续由Step 12闭合。journal factory不生成opaque id,本次回开不扩展`IdGeneratorPort`。若底层scan / repository / serializer错误没有合法typed redacted ref,它不能被降格为run issue,必须按unsafe planning failure回滚且不留下reservation / journal。
- 若broad scan / scope expansion在完整target plan形成前遇到可安全分类的稳定失败或临时前置失败,必须丢弃任何未闭合prefix candidate,以`targets = []`和至少一个`StableFailure`或`RetryablePrerequisite` run issue形成planning-failure journal,再与reservation同一initial UoW提交。无法形成safe typed issue的wiring / invariant / serialization错误回滚initial UoW,不得留下reservation或伪造空计划。
- `targets = []`且`run_issues = []`只表示合法完整扫描没有target；它可装配为`Completed`。planning failure不得编码成该形态；`targets = []`加`StableFailure` / `RetryablePrerequisite`分别装配为`Failed` / `Retryable`,从而重入无需重新扫描或猜测planning结果。
- target plan必须在任何target effect前完成scope expansion、exact source freezing和deterministic body-free output derivation。`All*` / scan scope不得在reentry时重新展开；existing material使用`Some(exact ref)`,creation使用`None + preallocated id`,二者必须id对称。Planned exact source在协议允许的正常缺失分支中可在zero-effect证明后形成该target终态failure；任何已加载source/material的owner、id、version、union、state-id、mandatory sidecar或source-chain不对称均为`ConsistencyDefect`,target保持`Planned`。两者都不得改用current source或重新推导summary / findings。
- 完整scope expansion中若某个stable target identity已成立,但其normal missing或typed policy inapplicable prerequisite可在任何effect前形成existing typed redacted issue,该ordinal必须使用`PreclassifiedFailure { failure }`,保留其他合法targets并按原stable order进入journal。Loaded owner/version/pair defect不属于该variant。`PreclassifiedFailure`不得降成run issue、不得填fake summary/source ref、不得在initial create时直接标Failed；执行loop遇到它时不读取source、不生成id、不调用factory / resolver / capture,只在独立zero-effect UoW调用`record_failed(...)`与journal `save(...)`。
- `EcosystemDiscovery.expected_state`只允许`Ready / Partial / Unavailable`;`Stale`是source change propagation状态,不是rebuild final outcome。Ready要求`state_reason=None`,Partial / Unavailable要求`Some`safe reason。Reason必须由planning已加载的typed change / canonical-resolution reason bridge或deterministic body-free source classification形成,不得从raw error、marketplace、runtime state或enum display拼接。
- `targets=[] + run issue`只用于完整target identity集合尚未形成的scope/page级planning failure或合法complete zero-target scan。已经形成exact target identity的stable per-item failure不得抹成empty-plan run issue。
- per-target successful UoW必须原子提交该target的material / report / reference / capture binding effect、matching outbound snapshot / capture和`Succeeded` outcome。若target effect rollback,terminal failure只能在rollback后由无business effect的target-outcome UoW记录。
- `Succeeded / Failed / Skipped`均为immutable terminal outcome。没有`Running`、lease、attempt、retry count、worker owner、heartbeat或scheduler state；`Planned`只表示尚无target effect与terminal outcome被提交。
- no-op target使用typed success item的`CapabilityJobItemChange::Unchanged`。`Skipped`只用于有stable boundary issue的未执行target,两者不得互换。
- `run_issues`只保存request / run-level safe issue及其technical impact；target failure / skip只保存在matching target outcome。Opaque issue ref本身不得被解析来猜impact。final response两个层级与`Completed / PartiallyCompleted / Failed / Retryable`必须从journal typed outcome / impact读取,不得混用private counter或error list。
- final-report UoW必须原子提交variant-bound typed Job response、stored shell / surface、journal `Finalized + final_result_ref`和idempotency `Completed + same result_ref`。任一写失败则journal保持`Planned`,已提交target outcome仍可重入读取。
- journal不保存request body、serialized response、payload snapshot副本、external body、runtime execution、tools execution、marketplace listing、governance approval、method body、secret、raw audit、real evidence、test result或acceptance signature。

### 12.9 application object capability map

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `CapabilityOperationContext` | entry metadata normalization | application value object | channel-specific factory、metadata completeness、query no-write | authentication / payload storage / UoW execution |
| `CapabilityIdempotencyRecord` | reserve / complete + zero-write request-match observation | versioned technical state | stable digest match、completed result ref link | persisted conflict state、conflict field/member、domain truth / duplicate result recomputation |
| `StoredCapabilityOperationResult` | duplicate replay shell | immutable application record | kind / disposition pairing、surface integrity | DTO schema / current-state recomputation |
| `CapabilityReadVisibilityDecision` | query visibility / degradation | ephemeral application value | visible / not-visible / degraded guard | runtime authorization / truth mutation |
| `CapabilityEventPayloadSnapshot` | complete outbound envelope freeze | immutable application technical record | source / schema / digest / bytes integrity | business truth、current-truth rebuild、delivery status |
| `CapabilityEventCaptureRecord` | post-commit recovery / intent binding | versioned application technical record | snapshot symmetry、captured -> intent_bound | external delivery truth、topic / retry / attempt owner |
| `CapabilityJobExecutionRecord` | multi-target Job post-target / pre-report recovery | versioned application technical journal | frozen typed plan、terminal target outcome、final result linkage | execution engine、scheduler / lease / attempt、business truth或report-by-run reconstruction |

### 12.10 application module stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| application unique stable helper 是否正式闭口 | pass after Step 9 batch 9.11 pre-entry reopen | context、idempotency、stored result、read decision、event snapshot / capture、Job execution journal均有exact fields / factories / invariants |
| core metadata 是否复用 | pass | `ActorContext`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey` wrapper、`JobRunId`、`Timestamp`、`TraceId`、`Version` 均复用 verified core type |
| duplicate replay 是否可能重算 current truth | blocked by contract | completed record -> stored result ref -> immutable surface;missing / digest mismatch explicit failure |
| query 是否可能误入 write path | blocked by contract | context / read decision 双重 no-write guard;query 无 idempotency key |
| post-commit / pre-intent event丢失窗口 | closed by contract after Step 8 reopen | source + immutable snapshot + capture同一UoW;captured scan可恢复;external delivery state不复制 |
| post-target / pre-report Job恢复窗口 | closed by contract after Step 9 batch 9.11 pre-entry reopen | reservation + complete plan / initial run issues initial UoW、effect + terminal outcome per-target UoW、typed report + finalized + completed final UoW |
| Step 7 承接是否命名 | pass after Step 9 batch 9.11 pre-entry reopen | idempotency、stored-result、event-capture、Job execution repositories、UoW、clock / existing id generator、entry normalization / service ports |

---

## 13. 非 core 模块最终 defer / reopen 结论

| 模块 | Step 6 最终结论 | 当前已闭口 carrier | 明确 defer 内容 | 强制 reopen 条件 | 后续承接 |
|---|---|---|---|---|---|
| `application` | closed after Step 9 batch 9.11 pre-entry reopen | §12 七个 helper + §7 operation / digest / result / disposition / event-capture carrier | service object、repository / resolver / publisher / handoff / UoW trait exact fields | 后续若需要新的唯一 stable operation / replay / capture / Job execution carrier | Step 7 / 8 / 9 / 11 / 13 |
| `infra` | deferred with watchpoint | 只消费 contracts / domain / application object | runtime config、builder、repository / resolver / publisher / handoff adapter state | Step 7 / 11 / 14 需要跨 adapter / persistence-visible 唯一 state 或 exact runtime availability carrier | Step 7 / 11 / 14 |
| `api` | deferred | operation context + Step 8 public DTO marker | handler local mapping helper、route / RPC assembly state | Step 8 出现不能落在 contracts DTO / application context 的 public or persisted entry carrier | Step 8 / 12 |
| `worker` | deferred | inbound context、stored receipt disposition、event capture ref / collaboration marker | consumer / publisher / projection loop local runtime state | Step 8 / 13 / 14 出现现有capture无法承接的唯一loop state | Step 8 / 13 / 14 |
| `jobs` | deferred | job context、stored job disposition、reconciliation report、application Job execution journal | runner registry、local args、scheduler / worker runtime state | Step 8 / 14 / 15 出现 public / persisted runner state 或现有 report / journal 无法承接的唯一 helper | Step 8 / 14 / 15 |

defer 不是允许后续 Step 临时发明 object。任一 reopen 条件触发时,必须回开 Step 6、补对象字段 / factory / state / owner 并重新执行字段与状态审计,再继续后续 Step。

---

## 14. 跨模块对象能力与字段来源闭环审计

### 14.1 逐对象能力到字段 / factory / member / state 映射

| 对象 | 对象能力 | 必需字段组 | factory / 构造入口 | 关键 member capability | state owner / 初始语义 |
|---|---|---|---|---|---|
| `CapabilityIdentity` | identity truth 建立 / 更正 / 退役 / current review link维护 | id、identity key、source ref、state、review ref、version / times | `create_from_intake(..., policy, ...)` | activate、begin / complete correction、attach review fact、retire | `CapabilityIdentityState`;resolved source -> active,stale -> candidate,unresolved / unavailable -> unresolved |
| `CapabilityAccessReviewFact` | body-free access review fact | id、identity id、review / risk summary、separation marker、actor、version / times | `draft` | record、supersede、invalidate、summarize | `CapabilityAccessReviewFactState::Draft` |
| `CapabilityIdentityPolicy` | identity source / correction guard | allowed source set、forbidden source set | default factory | validate new / correction、reject consumer rewrite | stateless policy |
| `ExternalCapabilitySourceRef` | MCP / A2A / API source pointer | id、kind、locator、candidate digest、resolution state id、version / times | `register` | subject ref、descriptor support、replace locator | canonical state owned by `ReferenceResolutionState` |
| `CapabilityIdentityChangeRecord` | identity change explanation | record id、subject、kind、previous / next、reason、actor / trace / time | `append` | explains identity、read-model trigger | immutable record |
| `CapabilityRegistryEntry` | registry lifecycle truth | id、identity id、visibility basis、state context、version / times | `register` | lifecycle transition、visibility basis update、retire | current factory=`RegistryLifecycleState::Registered`;`Draft` reserved且当前不可达 |
| `RegistryLifecycleState` | registry lifecycle enum behavior | enum variant | entry factory / transition | allows descriptor / exposure、terminal check | enum owns canonical registry state value |
| `RegistryVisibilityPolicy` | formal visibility prerequisite guard | required prerequisite set、forbidden source set | default factory | evaluate / validate transition、reject marketplace rewrite | stateless policy |
| `RegistryChangeRecord` | registry change explanation | record id、entry id、kind、previous / next、reason、actor / trace / time | `append` | explains entry、reconciliation trigger | immutable record |
| `AdapterDescriptor` | body-free adapter access truth | id、entry / source refs、kind、boundary summary、optional summaries、state、version / times | `draft_for_entry` | accept、attach summaries / secret ref、replace、retire | `AdapterDescriptorState::Draft` |
| `DescriptorRiskConstraintSummary` | body-free risk / constraint material | id、descriptor id、risk / constraint / marker、state、version / times | `derive` | safety check、partial / unavailable / supersede | `DescriptorRiskConstraintSummaryState` |
| `SecretRef` | external secret pointer | id、provider ref、usage scope、candidate digest、resolution state id、version / times | `register` | subject ref、safe-summary guard、replace provider ref | canonical state externalized |
| `SecretHandlingSafeSummary` | secret handling safe material | id、secret ref id、boundary、exposure marker、state、version / times | `create` | display guard、stale / unavailable / forbid | `SecretHandlingSafeSummaryState` |
| `DescriptorBoundaryPolicy` | provider-contract / forbidden field guard | forbidden field set、allowed summary set | default factory | validate descriptor / secret ref、reject old shape | stateless policy |
| `DescriptorChangeRecord` | descriptor change explanation | record id、descriptor id、kind、previous / next、reason / marker、actor / trace / time | `append` | explains descriptor、sensitive-change check | immutable record |
| `GovernanceSeamRelation` | capability-governance ref relation | relation id、identity id、governance ref id、safe summary、state、version / times | `create` | activate、unresolved / expired / forbidden、replace | `GovernanceSeamState::Pending` |
| `GovernanceResultRef` | governance / policy result pointer | id、ref kind、source、scope、candidate digest、resolution state id、version / times | `register` | subject ref、seam support、replace scope | canonical state externalized |
| `GovernanceSeamPolicy` | governance ownership / body guard | allowed ref kind set、forbidden body set | default factory | validate relation、reject review-as-approval | stateless policy |
| `CapabilityMethodBodyFreeRelation` | capability-method ref relation | relation id、identity / method ref ids、scope、state、version / times | `create` | activate、stale / unresolved / forbidden、remove | `CapabilityMethodRelationState::Pending` |
| `MethodAssetRef` | method-library asset pointer | id、asset kind、locator、candidate digest、resolution state id、version / times | `register` | subject ref、relation support、replace locator | canonical state externalized |
| `MethodRelationBoundaryPolicy` | method body ownership guard | allowed summary set、forbidden body set | default factory | validate relation、reject body marker | stateless policy |
| `GovernanceSeamChangeRecord` | seam change explanation | record id、relation id、kind、previous / next、reason、actor / trace / time | `append` | explains relation、exposure recheck trigger | immutable record |
| `MethodRelationChangeRecord` | method relation change explanation | record id、relation id、kind、previous / next、reason、actor / trace / time | `append` | explains relation、exposure recheck trigger | immutable record |
| `FormalExposureBoundary` | formal exposure truth | id、entry / descriptor / seam / optional method refs、state、version / times | `draft` | accept、activate、suspend、unavailable、retire | `FormalExposureState::Draft` |
| `FormalVisibilityApplicability` | formal visibility / applicability fact | id、exposure id、state、scope、basis、source version、version / times | `derive` | reevaluate、consumer scope check、pending | `FormalVisibilityState` |
| `FormalExposurePolicy` | formal prerequisite / source guard | required truth set、forbidden source set | default factory | validate exposure、derive visibility、reject view rewrite | stateless policy |
| `ControlledConsumerView` | body-free consumer snapshot | id、exposure id、consumer ref、descriptor summary、source versions、freshness、version / times | `build` | refresh、stale / rebuilding / unavailable、audience check | `ConsumerViewFreshnessState` |
| `ConsumerViewFreshnessPolicy` | view source / partial guard | stale marker set、partial kind set | default factory | freshness comparison、source validation、partial check | stateless policy |
| `CapabilityExposureChangeRecord` | exposure / view change explanation | record id、exposure id、kind、previous / next、reason、actor / trace / time | `append` | view-refresh / impact trigger | immutable record |
| `CapabilityAccessTraceabilityRecord` | change-to-trace linkage | id、subject、change ref set、reason、handoff / gap / supersede、metadata / version | `record_for_changes` | coverage、handoff、partial / recorded / supersede | `TraceabilityState`;versioned append revision |
| `CapabilityChangeImpactFact` | downstream impact explanation | id、trace ref、subject / scope、consumer refs、state、metadata / version | `derive_from_traceability` | affected consumer check、partial / delayed / ignored / resolved、handoff summary | `CapabilityImpactState::Identified / Partial` |
| `DownstreamConsumptionImpactSummary` | body-free consumer feedback | id、exact impact / consumer / source refs、optional observation、state / gap / state reason、metadata / version | `from_consumer_feedback` / `from_reported_state` | actionable / owner / impact membership check、partial / delayed / unavailable / ignored | `DownstreamImpactSummaryState` |
| `DirectorySearchBrowseProjection` | directory read model | id、exact truth refs、display / facets、source versions、state、version / times | `build_from_access_truth` | refresh、stale / rebuilding / unavailable、source match | `DirectoryProjectionState::Ready` |
| `AuditFriendlyExportSummary` | audit-safe export material | id、trace ref、scope / summary / audit refs、source versions、state、version / times | `build_from_traceability` | redaction、attach audit ref、partial / stale / unavailable | `AuditExportState::Ready` |
| `ReadOnlyEcosystemDiscoverySummary` | ecosystem discovery read model | id、exposure ref、context ref、summary、source versions、state、version / times | `build_read_only_summary` | refresh、partial / stale / unavailable、listing guard | `EcosystemDiscoveryState::Ready` |
| `CapabilityReconciliationReport` | truth-material comparison report | id、scope、truth / material refs、versions / findings、final state、job metadata | `from_findings` / `failed` | stale / rebuild / material checks、no-truth-write | immutable `ReconciliationReportState` outcome |
| `DerivedMaterialPolicy` | derived source / no-write guard | scope、truth source set、forbidden target set | default factory | validate four material groups、reject truth mutation | stateless policy |
| `ReferenceResolutionState` | canonical ref resolution truth | id、subject / kind、value / reason、actor / trace、version / times | `from_initial_resolution` / `resolved` / `unresolved` | subject check、exposure / read guard、transition / forbid | `ReferenceResolutionValue` |
| `ReferenceResolutionPolicy` | reference body / transition guard | scope、allowed kind set、forbidden body set | default factory | validate candidate / subject / transition、explicit failure | stateless policy |
| `ExternalDocumentRef` | external document pointer | id、kind / locator、optional descriptor、digest、state id、version / times | `register` | subject ref、descriptor support、replace locator | canonical state externalized |
| `RuntimeToolsConsumerRef` | runtime / tools consumer pointer | id、kind / locator / scope、digest、state id、version / times | `register` | subject / consumer ref、view check、replace boundary | canonical state externalized |
| `SdkExposureConsumerRef` | SDK server-consumer pointer | id、locator / surface / scope、digest、state id、version / times | `register` | subject / consumer ref、exposure check、replace boundary | canonical state externalized |
| `ObservabilityAuditRef` | observability / audit pointer | id、kind / locator、digest、state id、version / times | `register` | subject ref、trace support、replace locator | canonical state externalized |
| `CapabilityOperationContext` | entry metadata normalization | channel / operation、actor / trace、channel-specific option fields | four channel factories | idempotency requirement、metadata / no-write checks | immutable application value |
| `CapabilityIdempotencyRecord` | duplicate reservation / result pointer | key、channel / operation、digest、optional completed result、state、trace / version / times | `reserve` | match、complete、completed result lookup；mismatch由service零写分类 | `CapabilityIdempotencyState::Reserved` |
| `StoredCapabilityOperationResult` | immutable replay shell | result ref / kind / disposition、surface ref / digest、trace / time | `from_surface` | ref / digest / kind checks | immutable result record |
| `CapabilityReadVisibilityDecision` | query visible / degraded / not-visible | subject、actor、marker / reason、source versions、time | `from_marker` | serve checks、query no-write | ephemeral visibility marker |
| `CapabilityEventPayloadSnapshot` | freeze complete outbound envelope | snapshot id、exact source、schema / digest、serialized envelope、trace / time | `freeze` | digest / source validation、read-only bytes | immutable technical record |
| `CapabilityEventCaptureRecord` | recover post-commit event collaboration | capture id、source / snapshot、schema / digest、state / intent、version / times | `capture` | snapshot symmetry、intent bind / lookup | `CapabilityEventCaptureState::Captured` |

### 14.2 高复用字段来源审计

| 高复用字段 / carrier | 唯一正式来源 | 允许复制位置 | 禁止来源 / 暂停条件 |
|---|---|---|---|
| typed business / record id | application `IdGeneratorPort` result;exact port Step 7 | object factory、same-tx record / result ref | URL、locator、trace id、job run id、provider id、marketplace id |
| `ActorContext` | trusted API / worker / job entry metadata | truth mutation、record、trace、report、operation context | domain 自造 actor、external payload body、anonymous fallback |
| `TraceId` | inbound core metadata / event / job input | same operation truth / record / impact / result / report | domain / repository 重新生成、business id 替代 |
| `Timestamp` | application `ClockPort` | create / update / append / check / build / store time | client arbitrary time 直接当 authoritative、字符串时间 |
| `Version` | object factory = one;accepted mutation / append revision +1 | truth、relation、fact、view / material、ref、idempotency | source cursor、job run、projection version 替代 truth version |
| `ReferenceResolutionStateId` | canonical state factory / repository | each external ref current state link | per-ref duplicate resolution value、string status |
| `SourceVersionMarker` / set | exact loaded object id + version | controlled view、derived material、read decision、reconciliation | current time、cursor、cache generation 猜测 source version |
| change / trace / impact / material / reference ref | same UoW committed object / append record / exact revision | trace、impact、export、event payload snapshot / capture | DB changelog、log line、current truth、external event body |
| safe summary / reason / scope | validated command / resolver safe copy / deterministic derivation | domain summary、record、view / report、reference candidate | secret、method / governance / document body、runtime payload、raw error |
| request / surface digest | application canonicalizer | idempotency / stored result / reference candidate integrity | volatile metadata、random id、current time、raw body leakage |
| stored result ref / surface ref | application id generator + result repository | idempotency completed record / duplicate replay | current truth reconstruction、projection pointer convention、external URL |

### 14.3 对象组字段来源审计

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| `contracts` shared carrier | typed ids / refs、state / kind、safe carrier、operation marker | core metadata reuse、opaque id、safe text、typed set、finite enum / marker owner 已闭口 | Step 8 serialization / protocol shape、Step 12 exact error variants | public DTO 需要 domain-only / undefined secondary type,或 named carrier 无 representation |
| identity / registry truth | `CapabilityIdentity`;`CapabilityRegistryEntry` | system id、validated command input、resolved source ref、accepted identity、actor / trace / clock | repositories、expected version、UoW、state matrix | identity / visibility 需要 runtime / SDK / marketplace 私有状态或无来源 basis |
| descriptor / relation truth | `AdapterDescriptor`;seam / method relation | accepted registry / identity、body-free refs / summaries、policy marker、metadata | repositories、resolver / safe summary port、state matrix | 需要 provider contract、approval / policy body、method body、secret body |
| exposure / trace / impact | exposure、view、trace、impact、downstream summary | exact truth refs、source versions、change refs、consumer refs、safe feedback、metadata | repositories / projection store / handoff / consumer lookup、transaction ordering | downstream failure 被要求回滚 truth,或 trace / impact 需 raw payload / audit body |
| derived material | directory / export / discovery / report | accepted truth / trace refs、safe summaries、source markers、job metadata | material stores、scan / replace semantics、query view、job protocol | projection / report 被要求创造 / 修正 truth,或 evidence alias 被当字段 |
| canonical reference support | resolution state + 8 类 refs | typed local ref、safe locator / scope / digest、canonical state id、resolver-safe reason | reference repositories、resolver / scanner port、kind-specific state matrix | ref 需要 external body / SDK client / runtime payload,或第二份 resolution value |
| application helper | context / idempotency / stored result / read decision / event snapshot / capture / Job execution journal | trusted core metadata、stable digest、application id、stored surface pointer、exact source、complete envelope bytes、frozen target plan / outcome | idempotency / result / event-capture / Job-execution repositories、UoW、DTO mapping、duplicate / reentry algorithm | duplicate path重算result、query进入write、event从current truth重建、Job按run反查或重扫scope |
| deferred non-core seam | `infra/api/worker/jobs` | 当前只闭合“无 canonical object”与 reopen 条件 | Step 7 / 8 / 11 / 13 / 14 / 15 exact runtime / entry seam | 后续需要唯一 public / persisted carrier 却试图局部私补 object |

字段审计结论:当前所有 object field type 均由 `core-contracts`、§7 shared carrier、所属 domain object 或 §12 application helper 正式拥有。`DomainError`、`ApplicationError`、`ContractValueError` 仅作为公开返回类型名称保留,exact enum variant 按 Step 12 闭口;它们不是未定义 object field。

---

## 15. 状态闭环审计

### 15.1 状态主语、初始语义与 Step 10 承接

| 状态族 | 状态主语 | 初始 / 形成状态 | 关键允许迁移 | 终态 / 特殊状态 | 后续 Step 闭合位置 |
|---|---|---|---|---|---|
| identity truth | `CapabilityIdentity` / `CapabilityIdentityState` | `Resolved -> Active`;`Stale -> Candidate`;`Unresolved / Unavailable -> Unresolved`;invalid / forbidden / expired拒绝 | current correction=`active -> correction_pending -> active`;candidate / unresolved -> active只有callable但无current flow；persisted non-retired -> retired | retired terminal;correction_pending current transaction-local | Step 9 identity flows;Step 10 identity matrix |
| access review fact | `CapabilityAccessReviewFact` | draft transaction-local in current flows | current draft -> recorded;current old recorded -> superseded；draft / recorded -> invalidated仅existing callable且无current flow | superseded / invalidated terminal | Step 9 review flow;Step 10 fact matrix |
| registry truth | `CapabilityRegistryEntry` / `RegistryLifecycleState` | current factory直接形成registered；draft只作reserved概要态 | registered -> undescribed / ungoverned / visibility_pending;ungoverned -> undescribed when descriptor unresolved;registered / pending -> formal_visible only through exposure service;current -> retired | retired terminal;formal_visible 非 runtime allow | Step 9 registry / descriptor / exposure flows;Step 10 registry matrix |
| descriptor truth | `AdapterDescriptor` | transaction-local draft -> accepted / unresolved | current formation=`draft -> accepted / unresolved`;persisted current `accepted / unresolved -> replaced`;accepted -> unresolved、unresolved -> accepted及`draft / accepted / unresolved -> retired`有callable但无current flow；attachments只允许persisted accepted / unresolved same-state mutation | replaced / retired terminal;draft不单独持久化；`replaced -> retired`非法 | Step 9 descriptor flow;Step 10 descriptor matrix |
| descriptor risk summary | `DescriptorRiskConstraintSummary` | known risk + non-forbidden marker -> available；Unknown + non-forbidden marker -> partial；ForbiddenBody拒绝 | current old available / partial / unavailable -> superseded by new summary；partial / unavailable recovery to available无callable；degradation callable无current flow | superseded terminal;unavailable current factory不可达 | Step 9 safe-summary flow;Step 10 summary matrix |
| secret handling safe summary | `SecretHandlingSafeSummary` | resolved + non-forbidden marker -> available；recoverable unresolved / stale / unavailable -> unavailable；invalid / forbidden拒绝 | existing summary stale / unavailable / forbidden members与recovery方向均无current flow；new candidate通过new factory形成available / unavailable | forbidden terminal for candidate;current flow不持久化Forbidden | Step 9 safe-summary flow;Step 10 summary matrix |
| governance seam relation | `GovernanceSeamRelation` | pending | pending / unresolved / expired -> active;active -> expired / unresolved / forbidden;pending / active / unresolved / expired -> replaced only after a distinct replacement is active | replaced historical terminal;forbidden terminal for candidate;replacement creates new relation | Step 9 seam flow;Step 10 seam matrix |
| method relation | `CapabilityMethodBodyFreeRelation` | pending | pending / stale / unresolved -> active;active -> stale / unresolved / removed / forbidden | removed terminal;forbidden terminal for candidate | Step 9 method flow;Step 10 method matrix |
| formal exposure truth | `FormalExposureBoundary` | draft | draft -> pending / accepted;accepted -> active / unavailable / retired;active -> suspended / unavailable / retired;suspended -> active / retired | retired terminal | Step 9 exposure flow;Step 10 exposure matrix |
| formal visibility fact | `FormalVisibilityApplicability` | not_visible / pending | not_visible -> pending -> visible;visible -> pending / unavailable / retired | retired historical | Step 9 visibility flow;Step 10 visibility matrix |
| controlled consumer view | `ControlledConsumerView` | current factory直接形成ready / partial；rebuilding / unavailable只有reserved member可形成 | current refresh从任一loaded state直接形成ready / partial；任一non-stale可由actual propagation进入stale；stale / unavailable / partial -> rebuilding及non-unavailable -> unavailable均reserved | rebuilding不由current Job持久化；unavailable degraded；非truth terminal | Step 9 refresh / stale flows;Step 10 view matrix |
| access traceability | `CapabilityAccessTraceabilityRecord` latest revision | recorded / partial | recorded / partial -> handoff_pending;partial / handoff_pending -> recorded;current -> superseded | superseded historical;每次变化 append revision | Step 9 trace flow;Step 10 trace matrix;Step 11 append-revision storage |
| change impact fact | `CapabilityChangeImpactFact` | identified / partial | identified -> partial / delayed / ignored / resolved;partial / delayed -> ignored / resolved | ignored / resolved terminal for current impact scope | Step 9 impact flow;Step 10 impact matrix |
| downstream impact summary | `DownstreamConsumptionImpactSummary` | received / partial / delayed / unavailable / ignored由closed factory输入形成 | received / partial / unavailable -> delayed / partial / unavailable / ignored | ignored explicit consumer outcome;versioned safe summary | Step 9 consumer flow;Step 10 feedback matrix |
| directory projection | `DirectorySearchBrowseProjection` | current factory只形成ready；rebuilding / unavailable只有reserved member可形成 | current refresh从任一loaded state直接形成ready；任一non-stale可由actual propagation进入stale；stale / unavailable -> rebuilding及non-unavailable -> unavailable均reserved | rebuilding不由current Job持久化；unavailable degraded | Step 9 rebuild / stale flows;Step 10 projection matrix |
| audit export material | `AuditFriendlyExportSummary` | first persisted ready / partial / unavailable aftercompound factory sequence | current Job从任一loaded state形成final ready / partial / unavailable；任一non-stale可由actual propagation进入stale；same final state actual mismatch形成revision,complete match Unchanged | unavailable degraded；无terminal；transient Ready不单独保存 | Step 9 export / stale flow;Step 10 export matrix |
| ecosystem discovery material | `ReadOnlyEcosystemDiscoverySummary` | first persisted ready / partial / unavailable aftercompound factory sequence | current Job从任一loaded state形成final ready / partial / unavailable；任一non-stale可由actual propagation进入stale；same final state actual mismatch形成revision,complete match Unchanged | unavailable degraded；无terminal；transient Ready不单独保存 | Step 9 discovery / stale flow;Step 10 discovery matrix |
| reconciliation report | `CapabilityReconciliationReport` | one final completed / partial / inconsistent / rebuild_required / failed outcome | no in-place transition;new run creates new report | immutable append-only outcome | Step 9 job flow;Step 10 confirms non-state-machine classification;Step 11 report store |
| canonical reference resolution | `ReferenceResolutionState` | resolver observation中的合法initial value由factory形成 | resolved -> stale / unresolved / unavailable / expired;recoverable non-resolved -> resolved;kind-specific subset | invalid / forbidden terminal for candidate | Step 9 ref refresh;Step 10 per-kind matrix |
| event capture | `CapabilityEventPayloadSnapshot` + `CapabilityEventCaptureRecord` | immutable snapshot + captured | captured -> intent_bound | intent_bound local terminal;不复制external delivery state | Step 8 schema mapping;Step 9 capture / collaborate flow;Step 10 local matrix;Step 11 / 13 durability |
| Job execution journal | `CapabilityJobExecutionRecord` + per-target outcome | complete stable plan + all targets planned | target planned -> succeeded / failed / skipped；execution planned -> finalized only after all target terminal | target terminal immutable；execution finalized terminal；无running / lease / attempt | Step 8 report assembly；Step 9 Job reentry；Step 10 technical matrix；Step 11 / 13 durability / concurrency |
| event collaboration | outbound event candidate / `EventCollaborationStatus` | candidate | candidate -> pending_delivery -> delivered / failed / handoff_unavailable;failed / unavailable -> pending_delivery | delivered terminal for candidate | Step 8 event schema;Step 9 publish flow;Step 10 delivery matrix |
| idempotency reservation | `CapabilityIdempotencyRecord` | reserved | reserved -> completed | completed terminal;same-key mismatch / race preserves original withoutstate mutation | Step 9 generic write / consumer / job flow;Step 10 technical matrix;Step 13 algorithm |
| read visibility | `CapabilityReadVisibilityDecision` | visible / not_visible / degraded final marker | no transition;per-request reevaluation | ephemeral decision | Step 8 query surface;Step 9 query flow;Step 12 mapping |
| entry disposition | command / inbound / job disposition carrier | final outcome marker | no domain transition | stored-result / response marker only | Step 8 protocol;Step 9 flow;Step 12 mapping |
| deferred runtime / entry local state | `infra/api/worker/jobs` | 当前无 canonical state subject | 不得在后续 Step 自发升格 | 若需 public / persisted state 必须回开 Step 6 | Step 7 / 8 / 11 / 14 / 15 watchpoint |

### 15.2 reference kind 允许状态子集门禁

| `ReferenceKind` | Step 6 允许状态语义 | Step 10 必须精确闭合 | 禁止合并的外围状态 |
|---|---|---|---|
| external capability source | resolved / unresolved / stale / invalid / unavailable / forbidden | locator replace、resolver recovery、invalid / forbidden replacement path | provider health、invocation success、runtime route |
| governance result | resolved / unresolved / stale / invalid / unavailable / forbidden / expired | expiry / recovery、forbidden candidate terminal | approval workflow、Policy lifecycle、shared_rules state |
| method asset | resolved / unresolved / stale / invalid / unavailable / forbidden | stale / recovery、body candidate terminal | method asset lifecycle / publication state |
| secret | resolved / unresolved / stale / invalid / unavailable / forbidden | safe-summary refresh relation、forbidden candidate terminal | KMS / Vault lifecycle、rotation、secret access result |
| external document | resolved / unresolved / stale / invalid / unavailable / forbidden | stale / unavailable recovery、replacement | document publication / content version truth |
| runtime / tools consumer | resolved / unresolved / stale / invalid / unavailable / forbidden | consumer boundary recovery、replacement | runtime execution / tool result / provider availability |
| SDK consumer | resolved / unresolved / stale / invalid / unavailable / forbidden | SDK boundary recovery、replacement | SDK package / binding / client cache state |
| observability / audit | resolved / unresolved / stale / invalid / unavailable / forbidden | handoff ref recovery、replacement | log / trace / metric / alert lifecycle |

### 15.3 跨状态传播审计

| source state change | 允许传播结果 | 禁止传播结果 |
|---|---|---|
| identity retired / corrected | registry / descriptor / relation prerequisite recheck、trace / impact candidate | 自动创建新 identity / registry、修改 external source truth |
| descriptor / seam / method relation changed | exposure pending / unavailable recheck、consumer view stale、trace / impact | runtime allow-deny、provider route、SDK client mutation |
| exposure suspended / unavailable / retired | visibility re-evaluation、view stale / unavailable、derived rebuild candidate、impact | governance approval 回滚、registry identity 删除 |
| canonical ref stale / unresolved / unavailable | owning relation / summary / exposure / derived surface explicit degraded transition | 补造 resolved truth、静默继续 current visible |
| consumer feedback delayed / unavailable | downstream summary / impact delayed / partial、handoff repair | core truth rollback、exposure suspension by consumer alone |
| derived material stale / failed | query degraded / not-visible as policy declares、rebuild job candidate | truth repair、创建新 business conclusion |
| committed event source + captured snapshot | post-commit collaboration、captured scan repair、stable external intent bind | worker / adapter回查current truth重建envelope、capture状态伪装external delivered / failed |
| event / handoff failed | delivery marker / report / retry candidate | 回滚 committed truth、伪造 delivered / evidence |

状态审计结论:状态主语按 truth、relation、safe summary、view / material、reference、application technical carrier 分离。Step 10 必须逐状态机闭合 exact guard / source / target,不得新增“全局 capability state machine”或把外围 runtime / marketplace / SDK / governance 状态并入。

---

## 16. Step 7 Trait / Port / Adapter 承接清单

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| identity / review repositories | identity、review fact、identity change record | get / save with expected version、append change、history read;保持 owner / state | identity mutation 无 current version / same-tx record surface |
| registry repositories | registry entry、registry change record | get / save、identity lookup、append change、visibility candidate lookup | registry lifecycle / visibility flow 被迫绕过 version / history |
| descriptor / safe-summary repositories | descriptor、risk summary、secret ref / safe summary、descriptor record | versioned get / save、current summary lookup、append record;不返回 secret body | descriptor factory / attachment 无 formal persistence surface |
| governance / method repositories | seam / governance ref、method relation / asset ref、两类 change record | versioned relation / ref store、append history、lookup by identity | exposure prerequisite 无 exact relation / reference load surface |
| formal exposure / visibility repositories | exposure、visibility fact、exposure change record | versioned get / save、lookup current prerequisite chain、append record | exposure / visibility transition 无 formal owner store |
| controlled view / projection stores | consumer view、directory projection、audit export、ecosystem discovery | get / replace / mark stale / find affected by source ref;no truth write | refresh / query 无 exact source-to-material lookup |
| trace / impact repositories | trace append revisions、impact fact、downstream summary | append revision / current read、versioned fact / summary save、lookup by change / consumer | impact / handoff 无 body-free durable anchor |
| reconciliation report repository | immutable reconciliation report | append / get / list by scope / job run;禁止 report mutation / truth repair | job outcome 无正式 report surface |
| canonical reference repositories | resolution state + 8 类 ref | ref get / save、state get / save expected version、lookup state by subject、subject uniqueness | resolver refresh 会复制 per-ref state 或无法校验 owner |
| external resolver / scanner ports | reference candidate、safe locator / digest、resolution input | 只返回 body-free resolution / safe summary / marker;不返回 external body | domain factory 被迫读取 HTTP / SDK / sibling body |
| consumer feedback port / lookup | consumer ref、downstream safe summary | resolve registered consumer、load stored feedback summary / receipt | impact fact 无法校验 consumer / summary ownership |
| idempotency repository | operation context、idempotency record、request digest | reserve absent key、get、save expected version、Reserved -> Completed only;conflict is zero-write winner classification | duplicate / conflict algorithm 无唯一 durable owner |
| Job execution repository | normalized idempotency key、complete typed target plan、terminal outcomes、final result link | exact get、atomic create、optimistic save；durable / fake同语义；无list / scan | interrupted reserved Job无法区分已提交 / 未提交target并会重复revision / capture |
| stored-result repository | stored result shell、surface ref / digest | save shell + public surface、get exact ref、missing / digest mismatch explicit error | duplicate replay 被迫重算 current truth |
| UnitOfWork | truth、change record、trace / impact、stored result、event payload snapshot / capture | 明确 transaction handle / commit boundary;source与snapshot / capture必须same-UoW,exact ordering Step 11继续闭合 | post-commit / pre-intent崩溃导致event永久不可恢复 |
| clock / id generator ports | all system ids、timestamps | typed id generation / authoritative time;不得生成 external id | factory required field 由实现临时拼接 |
| event capture / collaboration ports | exact source、immutable snapshot / capture、external collaboration status | same-UoW capture、post-commit collaborate / bind、failed no rollback | current-truth rebuild、隐藏payload、未捕获commit gap |
| audit / observability handoff port | trace / export / audit refs | handoff safe summary / refs only、pending / unavailable explicit | 实现复制 raw audit body 或伪造 evidence |
| application service boundaries | §12 context / idempotency / result / read decision / event capture / Job execution journal | service callable surface 使用 exact helper;不得再造平行 carrier | api / worker / jobs metadata、replay与reserved reentry语义分叉 |
| remaining non-core reopen gate | §13 defer table | 逐 adapter / entry 审核是否出现唯一 stable carrier;触发则回开 Step 6 | trait / adapter 内私藏 public / persisted runtime state |

Step 7 不得修改本 Step 的 object owner、field type、canonical reference state 或 application replay semantics。若 trait 签名无法只使用本文件对象、`core-contracts` 或 Step 7 自身 error / page helper 闭合,必须先判断是否触发 Step 6 reopen。

---

## 17. 当前正式文档问题诊断、前后对比与 historical material 审计

### 17.1 旧正式 `03-详细设计.md` 的对象层问题诊断

| 旧问题 | 对象层后果 | 本 Step 处理 |
|---|---|---|
| 以 `ProviderContract` 聚合 provider、secret、route、quota、cost、failover | 一个对象跨 capability access truth、secret owner、runtime provider、billing 多个边界 | 不继承;拆为 `AdapterDescriptor`、risk / constraint summary、`SecretRef`、safe summary、external ref state |
| 以 `CapabilityDecision` / allow-deny 表达 capability 可用性 | 混写 governance approval、formal exposure、runtime enforcement | 不继承;分为 governance seam ref relation、formal exposure / visibility、controlled view;不定义 runtime decision |
| `QueryCapabilities` 同时承担 truth read、runtime cache、SDK view | query 可反向决定 truth / cache / visibility | 不继承;query 使用 read decision + controlled / derived read material,并强制 no-write |
| `CostRecord` / provider cost / quota 进入 capability 对象 | 本仓变成 billing / provider runtime owner | 完全排除;未建立 cost id、state、record、repository candidate |
| KMS / Vault / secret store lifecycle 进入 descriptor | secret body / rotation / access policy owner 漂移 | 只保留 body-free `SecretRef` + safe summary + canonical resolution state |
| governance Policy / approval / shared_rules body 进入 relation | seam relation 复制上游 governance truth | 只保存 typed ref、ref kind、safe summary、canonical state id;policy 显式拒绝 body |
| method body / version lifecycle 进入 capability relation | capability-hub 复制 method-library asset truth | 只保存 `MethodAssetRef`、asset kind / locator summary、relation scope |
| runtime / tools execution gateway、provider health / route / retry | capability-hub 承担执行编排 | 完全排除;只保留 consumer ref、view、impact / feedback seam |
| marketplace listing / metadata 被当 capability registry 输出 | registry / exposure 被外围 listing 反写 | 只保留 read-only ecosystem discovery;`is_listing_truth()` 恒 false |
| concrete broker outbox relay / retry 被写成既成实现 | 未经 port / persistence / config 讨论即固定 mechanism | 当前只闭口product-neutral immutable payload snapshot + capture record;不定义broker relay、topic、attempt或retry参数,失败不回滚 truth |
| 幂等 / stored result / query visibility 没有唯一 helper owner | 后续 handler / worker / job 会各自发明 carrier | §12 正式闭口 context、idempotency、stored result、read decision |

### 17.2 改动前后对比

| 主题 | 旧对象口径 | 当前 Step 6 口径 | 可落码改善 |
|---|---|---|---|
| capability identity | URL / provider / contract 字段隐式拼接 | typed identity + source ref + review fact + policy + change record | identity factory、state、field source、history 一一闭合 |
| registry | 能力列表 / 查询缓存式记录 | registry truth + lifecycle + visibility basis / policy + record | truth 与 search projection 分层 |
| adapter integration | provider contract 大对象 | descriptor + risk summary + secret ref / safe summary + boundary policy | forbidden body / runtime field 可在 domain 层拒绝 |
| governance / method | 复制 approval / policy / method body | body-free relation + typed external ref + canonical state | owner seam 明确且可测试 |
| exposure | allow / deny / provider availability | formal exposure truth + visibility fact + consumer view | 不再把 runtime decision 伪装成 server truth |
| trace / impact | audit / cost / runtime log 混合 | change refs -> trace revision -> impact fact -> safe consumer summary | downstream failure no rollback,且无 raw body |
| read / derived | query 现查现拼 current truth | versioned view / projection / export / discovery + immutable report | freshness / stale / rebuild 来源可追溯 |
| reference state | 每类 ref 私建 string status | one canonical `ReferenceResolutionState` + kind-specific Step 10 subset | 消除双份 state / silent fallback |
| application metadata | entry 各自处理 actor / trace / idempotency | one operation context + reservation + stored result + read decision | duplicate replay / query no-write 有唯一 carrier |
| non-core runtime | 提前固定 config / loop / builder object | 明确 defer + reopen condition | 后续可前进,但禁止临时私补 canonical object |

### 17.3 historical material 隔离表

| historical material | 当前分类 | 是否进入当前对象基线 | 当前替代 / 处理依据 |
|---|---|---|---|
| 项目旧 README 中 provider / cost / runtime / marketplace 叙述 | `historical_material` | 否 | 新版正式 `00/01/02` + 本 Step owner / boundary |
| 旧 `00~02` 的 provider contract、decision、cost、KMS、query 主线 | `superseded_historical_material` | 否 | 已由前序 full-restart 正式文档替代 |
| 旧正式 `03-详细设计.md` 的对象 / service / repository / DTO / state | `historical_material_for_pollution_audit` | 否 | 只用于 §17.1 差异诊断;不得正向复制 |
| 旧 `05/06` 的测试结果式 / Given-When-Then / 验收签署式表述 | `historical_material` | 否 | 当前不写测试结果、evidence alias 或签署;后续按新 `03/05/06` 流程重建 |
| restart 前本项目 calibration 版本 | `superseded_calibration_material` | 否 | 项目 ledger 当前 active baseline /逐 Step 停审策略 |
| concrete outbox table / relay / retry 产品线索 | `deferred_mechanism_clue` | 否 | Step 7 / 11 / 13 / 14 先闭口 port、persistence、retry、config |

### 17.4 上游 blocker 结论

| 检查项 | 结论 | 说明 |
|---|---|---|
| 新版正式 `00/01/02` 是否足以闭口 43 个对象 | pass | object owner、主要字段、flow / state 来源均可回指 active baseline |
| method-library / governance / SDK / runtime 边界是否要求复制上游 truth | no | 全部通过 typed ref / safe summary / consumer boundary 承接 |
| `core-contracts` 实际类型是否存在 | pass | 已验证本 Step 使用的 8 个 core 类型;未伪造 extension API |
| 旧 README / 正式文档是否形成当前 blocker | no | 冲突已隔离为 historical material,不再作为 truth source |
| 是否需要回退修改正式 `02-概要设计.md` | no | `GovernanceResultRef` ref kind 等属于详细设计必要字段细化,未改变对象主语 / owner /系统边界 |

当前未发现阻塞 Step 6 收口或 Step 7 开工的上游 blocker。

---

## 18. 关键设计取舍

| 取舍 | 采用方案 | 未采用方案 | 原因 / 后续约束 |
|---|---|---|---|
| shared carrier owner | public id / ref / state / kind / marker 归 `contracts` | domain-only 类型泄漏到 DTO | 防止 Step 8 public surface 反向依赖 domain implementation |
| reference state | one canonical state object + per-ref state id | 每类 ref 保存自己的 resolution enum | 消除重复 truth;Step 10 定义 kind-specific subset |
| external ref content | typed local ref + safe locator / scope / digest | 保存 external body / raw resolver response | 遵守 governance / method / secret / SDK / runtime / audit owner 边界 |
| change history | core change record immutable;trace / impact / summary 采用 versioned append revision | 覆盖旧 history row 或让所有对象都 immutable 无 current state | 同时满足状态操作与可追溯持久化;Step 11 禁止 history overwrite |
| downstream impact | body-free summary ref + no-rollback | downstream unavailable 回滚 exposure / registry | committed access truth 与外围消费失败分离 |
| derived material | exact source versions + rebuildable no-write policy | projection / report 修正 truth | freshness 可判断,维护不创造业务结论 |
| query visibility | explicit visible / not-visible / degraded decision | bool / not-found / silent partial | 保留 visibility 与 degraded 语义,并强制 query no-write |
| duplicate handling | reservation -> stored immutable result replay | same request 重新执行 / 从 current truth 重算 response | 保证幂等结果稳定;Step 11 / 13 继续闭合 transaction / algorithm |
| application helper timing | Step 6先闭口4个基础helper,batch `8.5`增补snapshot / capture,batch `9.11` pre-entry再增补Job execution journal | 推到infra / worker私藏payload、用current truth补发或在Job service私藏progress | 避免metadata / replay分叉并分别关闭post-commit / pre-intent与post-target / pre-report崩溃窗口 |
| event durability | source + complete envelope snapshot + capture同一local UoW,commit后调用external collaboration并绑定intent | transient-only post-commit call或把broker relay产品写死 | 上游要求异步变化持续可感知且失败可识别;同时保持external delivery状态owner不变 |
| non-core object timing | `infra/api/worker/jobs` 显式 defer + reopen gate | 当前猜写 runtime config / loop state 或永久忽略 | exact shape 依赖后续 port / protocol / persistence / config,但不得绕过 Step 6 |
| error detail | 本 Step 固定 error type name,variant Step 12 闭口 | 当前猜写完整 taxonomy | object signature 可稳定,同时不抢写 error mapping / recovery 讨论 |

---

## 19. 正式 `03-详细设计.md` §5 / §6 回填草稿

本节仅供 Step 19 正式装配使用,本轮不修改正式 `03-详细设计.md`。Step 7~18 若对 trait、protocol、flow、state matrix、persistence、error、idempotency、config、observability 或 test cut 增加更精确约束,Step 19 必须同步更新正式 §5 / §6,不得让本 Step 摘录与后续结论分叉。

### 19.1 正式 §5 模块内对象契约装配映射

| 正式章节草案 | Step 6 摘录来源 | 当前可回填内容 | 后续 Step 补充内容 |
|---|---|---|---|
| §5.1 `contracts` module | §7 | core reuse、typed id / ref、safe carrier、state / kind / marker、operation / disposition carrier | Step 7 无 trait;Step 8 protocol / view schema;Step 12 contract error |
| §5.2 `domain` module:identity / registry | §8 | capability mapping、9 个对象 card、fields / factories / members / invariants | Step 7 repositories;Step 10 matrix;Step 12 domain error;Step 16 tests |
| §5.2 `domain` module:descriptor / governance_method | §9 | 14 个 descriptor / relation / ref / policy / record card | resolver / repositories、flow / matrix、error / tests |
| §5.2 `domain` module:exposure / trace_impact | §10 | 9 个 exposure / view / trace / impact card | projection / handoff ports、flow / matrix、append persistence / tests |
| §5.2 `domain` module:derived_material / reference_resolution | §11 | 11 个 material / canonical state / ref / policy card | stores / resolver、job / query flow、matrix / persistence / tests |
| §5.3 `application` module | §12 | operation context、idempotency、stored result、read decision、event payload snapshot / capture、Job execution journal | services / ports / UoW、protocol mapping、flow / persistence / error / idempotency tests |
| §5.4 `infra` module | §13 defer row | no canonical object + reopen condition | Step 7 adapter、Step 11 store、Step 14 config / runtime builder |
| §5.5 `api` module | §13 defer row | no canonical object + reopen condition | Step 8 handler DTO mapping、Step 12 error mapping |
| §5.6 `worker` module | §13 defer row | public marker / context owner + no local canonical object | Step 8 envelope / receipt、Step 13 reentry、Step 14 runtime |
| §5.7 `jobs` module | §13 defer row | job context / disposition / report owner + no runner object | Step 8 job I/O、Step 14 binding、Step 15 report / observability |
| §5.8 chapter closure | §14~§16 | field source、state owner、non-core closure、Step 7 handoff summary | Step 19 merge later-step closure summaries |

正式 §5 每个模块仍必须保持书写规范固定结构:职责、文件映射、capability / object、object contract、trait / port / adapter、关键函数、error、test cut。本 Step 只提供其中 object contract 和 chapter closure 部分,不得在 Step 19 因篇幅删成对象名摘要。

### 19.2 正式 §5 第 5 章收口摘要草稿

| 收口主题 | 正式文案草稿 | 后续承接 |
|---|---|---|
| shared vocabulary / typed ref / public marker | capability-hub public carrier 统一归 `contracts`;core actor / metadata / idempotency / job run / timestamp / trace / version 直接复用 `core-contracts`;domain 不向 protocol 泄漏私有 carrier | Step 8 serialization / protocol surface |
| 43 个概要对象 | 全部保持 HLD owner 并获得 typed fields、factory / member capability、state / invariant;未新增 provider / cost / runtime / marketplace / approval / method body truth | Step 7 repositories / resolver / handoff;Step 9 / 10 flow / state |
| canonical reference | 8 类 ref 只存 typed body-free data + canonical `candidate_digest` + `resolution_state_id`;`ReferenceResolutionState` 是 resolution value 唯一 owner | Step 7 reference repository / resolver;Step 10 per-kind matrix |
| application helper | operation context、idempotency record、stored result shell、read visibility decision、immutable event payload snapshot / capture和Job execution journal已正式闭口,api / worker / jobs不得定义平行carrier | Step 7 / 8 / 9 / 11 / 13 |
| non-core object decision | `infra/api/worker/jobs`不拥有新增canonical object;durable event carrier与Job execution journal均归application technical owner | Step 7 / 8 / 11 / 14 / 15 |
| field source closure | ids、metadata、safe summaries、source versions、change / result refs 均有唯一正式来源;error type variant 是 Step 12 明确后续项 | Step 7+ 不得私补 field source |
| state closure | truth、relation、safe summary、view / material、reference、application technical state 分离;无全局 capability state machine | Step 10 exact matrix;Step 11 history / version storage |
| Step 7 handoff | repositories、stores、resolver / scanner、consumer lookup、idempotency / result、UoW、clock / id、publisher / handoff 均已逐项命名 | Step 7 |

### 19.3 正式 §6 全局对象索引草稿

| owner / 对象组 | 全局对象索引条目 | 数量 | 正式索引说明 |
|---|---|---:|---|
| `domain::identity` | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` | 5 | identity truth / review / policy / source ref / history |
| `domain::registry` | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | 4 | registry truth / state / visibility guard / history |
| `domain::descriptor` | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` | 6 | descriptor / safe summary / secret ref / policy / history |
| `domain::governance_method` | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` | 8 | governance seam / method body-free relation / refs / policy / history |
| `domain::exposure` | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`CapabilityExposureChangeRecord` | 6 | formal exposure / visibility / view / policy / history |
| `domain::trace_impact` | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | 3 | trace / impact / safe downstream feedback |
| `domain::derived_material` | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy` | 5 | rebuildable projection / summary / report / no-write guard |
| `domain::reference_resolution` | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` | 6 | canonical state / policy / remaining external refs |
| `application` | `CapabilityOperationContext`;`CapabilityIdempotencyRecord`;`StoredCapabilityOperationResult`;`CapabilityReadVisibilityDecision`;`CapabilityEventPayloadSnapshot`;`CapabilityEventCaptureRecord`;`CapabilityJobExecutionRecord` | 7 | stable operation / replay / read / durable event-capture / Job-reentry helper |
| `contracts` | §7 typed id / ref、safe carrier、state / kind / marker、operation / disposition family | shared family | §6 索引按 type family 展开,不得把 carrier 计入 43 个 HLD domain object |
| `infra/api/worker/jobs` | none at current Step 6 | 0 | 保留 defer / reopen note,不得留空白误解为遗漏 |

HLD关键对象合计`5 + 4 + 6 + 8 + 6 + 3 + 5 + 6 = 43`;application stable technical helper在batch `8.5`回开后为6,在batch `9.11` pre-entry回开后为7。新增Job execution journal不改变HLD业务对象数量、owner或系统边界。Step 19正式索引必须保持该计数和owner,除非后续Step再次触发正式Step 6 reopen。

### 19.4 正式装配禁止事项

- 不把 §7 shared carrier 全部压缩成“若干 DTO 类型”;必须保留 core reuse、typed ref、canonical state 与 disposition owner。
- 不把 43 个 object card 合并成一个总表;正式 §5 必须按 module / submodule 展开 fields、members、factories、invariants。
- 不把 Step 7+ 尚未讨论的 trait、DTO、flow、state matrix、persistence、error、config、test result 写成本 Step 已定结论。
- 不从旧正式 `03` 补回 provider / cost / runtime / marketplace / approval / method / secret body 内容。
- 不把 implementation commit、run_id、evidence alias、验收签署、implementation ledger 或 boundary skeleton 写入正式 `03`。

---

## 20. 待确认事项与后续 watchpoint

### 20.1 Step 6 已关闭事项

| 事项 | 关闭结论 |
|---|---|
| 43 个 HLD object owner / fields / factories / members / states | 已闭口,无 missing object |
| shared id / ref / safe / state / kind / operation carrier | 已闭口,无未归属 field carrier |
| canonical reference state | 已确定 one-state-owner + per-ref state id |
| application unique helper | 已闭口7个object;event snapshot / capture由batch `8.5`新增,Job execution journal由batch `9.11` pre-entry新增；不得后推到infra / worker / jobs临时补造 |
| non-core object decision | 已显式 defer 并给出 reopen condition |
| field source / state owner / Step 7 handoff | 已完成跨模块审计 |

### 20.2 后续 Step 必须闭合但不阻塞 Step 7 的 watchpoint

| Watchpoint ID | 事项 | 当前结论 | 强制后续动作 / 回开条件 |
|---|---|---|---|
| `CH-DDD-S6-WATCH-001` | `infra/api/worker/jobs` 是否出现唯一 public / persisted runtime / entry carrier | 当前 evidence 不需要新增 canonical object | Step 7 / 8 / 11 / 14 / 15 一旦需要,先回开 Step 6 |
| `CH-DDD-S6-WATCH-002` | 8 类 ref 的 allowed state subset / transition | canonical value / owner 已闭口 | Step 10 逐 kind 写 exact matrix;若需要第二 state owner,必须回开 Step 6 并拒绝 duplication |
| `CH-DDD-S6-WATCH-003` | trace / impact / downstream summary append-revision storage | object version / history rule 已闭口 | Step 11 定义 append revision schema / current lookup;若 store 只能 overwrite,暂停实现并修设计 |
| `CH-DDD-S6-WATCH-004` | stored result + idempotency completion transaction | object / result ref / digest 已闭口 | Step 7 定义 ports,Step 11 ordering,Step 13 duplicate / missing / conflict algorithm |
| `CH-DDD-S6-WATCH-005` | exact error taxonomy | stable `DomainError` / `ApplicationError` / `ContractValueError` name 已闭口 | Step 12 定义 variants / mapping / retry;不得由 adapter 私建平行 error owner |
| `CH-DDD-S6-WATCH-006` | event collaboration post-commit / pre-intent durability | batch `8.5`已证明transient-only call无法识别或修复commit后崩溃窗口;已新增immutable payload snapshot + versioned capture | Step 7补repository / UoW seam;Step 8映射schema;Step 9 / 11 / 13闭合flow、事务顺序与重入 |
| `CH-DDD-S9-JOB-TX-001` | multi-target Job post-target / pre-report durability | batch `9.11` pre-entry已证明request-local accumulator无法恢复已提交target；已新增idempotency-key-owned typed execution journal | Step 7补exact repository；Step 8补八类response装配；Step 9闭合reentry；Step 10 / 11 / 13继续闭合状态、物理事务与并发 |

### 20.3 本 Step 不应抢写事项

- repository / resolver / publisher / handoff / UoW exact trait methods:Step 7。
- Command / Query / Event / Job / View / Receipt / Report exact DTO:Step 8。
- application service call order / transaction order / error branches:Step 9 / 11 / 12。
- exact state transition matrix:Step 10。
- DDL / index / serialization migration:Step 11。
- digest canonicalization、duplicate / reentry / retry algorithm:Step 13。
- runtime config / product binding / runner assembly:Step 14。
- observability field / audit handoff invocation:Step 15。
- test cases / test result / evidence / acceptance:Step 16 和后续 `05/06`。

当前没有需要用户在 Step 6 内额外裁决的 blocker;上述 watchpoint 均有明确后续 owner 和回开条件。

### 20.4 Step 8 触发的最小回开修正

Step 8 batch `8.2` 执行 DTO -> object factory / member 构造闭环时发现:六类 truth mutation member 直接返回 append-only change record,但旧签名没有完整接收对应 record id;identity mutation 还缺少 trace来源,部分 mutation缺少record reason / sensitive marker,且change-kind enum不能穷尽既有member动作。若保持旧签名,实现者只能在domain内生成id、伪造trace/reason,或让application二次重建record,均违反IdGenerator / operation-context唯一来源和same-tx record闭环。

同批逐Command反查还发现:public DTO使用identity / registry / descriptor / method / exposure专用safe reason newtype,而部分既有domain member和append-only record接收generic `ChangeReason`;若没有正式bridge,application只能读取debug / display文本或自行拼接字符串。§7.6因此补充`to_change_reason(&self) -> ChangeReason`,限定为同一validated safe-text value的无损复制。

本次已完成以下最小修正:

| 修正面 | 修正内容 | 未改变内容 |
|---|---|---|
| identity mutation | `activate/request_correction/complete_correction/retire` 注入 `CapabilityIdentityChangeRecordId`、`TraceId`和body-free reason;补`Activated/CorrectionRequested` kind | identity字段 / state owner / repository不变 |
| registry mutation | register / bind / lifecycle / visibility / retire注入`RegistryChangeRecordId`和缺失reason;补`DescriptorBound` kind | registry owner / visibility policy / Port不变 |
| descriptor mutation | accept / attach / replace / retire注入`DescriptorChangeRecordId`、reason和required marker;补`Accepted` kind | forbidden-body边界、summary / ref对象不变 |
| governance / method relation mutation | 每个返回record的member注入对应record id和完整record reason;补`Reactivated` kind | relation owner、external body-free seam和repository不变 |
| exposure mutation | accept / activate / suspend / unavailable / retire注入`CapabilityExposureChangeRecordId`和缺失reason;补`PrerequisitesAccepted` kind | exposure truth / visibility / consumer边界不变 |
| review-link / visibility history | `attach_review_fact`注入record id / reason / actor / trace并返回`ReviewFactAttached` identity record;visibility reevaluate / pending在application同一UoW append `VisibilityApplicabilityChanged` exposure record | review / visibility对象、repository、UoW、external边界不变 |
| descriptor supporting document relation | `ExternalDocumentRef`补`bind_supported_descriptor` / `rebind_supported_descriptor`,允许预注册body-free document ref在descriptor accepted后绑定或在same registry chain replacement时换绑 | document body边界、descriptor字段、canonical reference state和repository owner不变 |
| identity merge / split relation evidence | 新增`CapabilityIdentityRefSet`;`complete_correction`、identity policy和change-record factory显式接收related identities / refs;只保存target correction的append-only relation evidence | 不新增canonical redirect truth,不隐式改写related identities,identity repository / change repository owner不变 |
| visibility applicability mutation inputs | `reevaluate`补`FormalApplicabilityScope`;visibility补`mark_unavailable` / `retire`,供exposure suspend / retire同一UoW同步推进 | 状态owner、visibility repository和Step 10完整矩阵边界不变 |
| descriptor / secret unresolved surface | descriptor补`MarkedUnresolved`与`mark_unresolved`;secret safe summary factory固定resolved=`Available`、recoverable non-resolved=`Unavailable`、invalid/forbidden reject | descriptor / secret对象owner、resolver和safe-summary repository不变 |
| registry formal-visible authority | visibility basis member只校验输入并推进`VisibilityPending`;`FormalVisible`限定由加载完整formal truth的exposure service调用registry transition | registry / exposure对象和repository owner不变 |
| formal exposure pending callable | exposure补`MarkedPending`与`mark_pending`,承接概要状态机要求的前置不完整accepted local surface | exposure对象、change repository、状态owner和Step 10完整矩阵边界不变 |
| typed safe reason bridge | identity / registry / descriptor / method / exposure专用reason newtype补`to_change_reason(&self) -> ChangeReason`,供既有generic member / record参数无损承接 | reason字段、类型owner、domain语义、repository和Port不变 |
| Query read subject closure | `CapabilityReadSubjectRef`补review / summary / relation / visibility / trace / impact / reference单对象与11类page-level collection主语,使empty page也有正式visibility subject | 不新增truth / persisted object;resolver / scope来源由Step 7只读Port闭合 |
| Inbound reference initial-state construction | `ReferenceResolutionState`补`from_initial_resolution`,由application验证resolver observation后逐字段传入并执行domain policy gate | reference字段、state owner、repository和resolver Port不变;domain不依赖application type |
| Downstream feedback state construction | summary补exact`impact_fact_ref`,observation改为state-gated optional,补`state_reason`与`from_reported_state`,使归属及Partial / Delayed / Unavailable / Ignored均可从closed payload 1:1构造 | summary owner、state enum、impact repository和no-execution-body边界不变 |
| Reference candidate digest symmetry | `ExternalCapabilitySourceRef`、`SecretRef`、`GovernanceResultRef`、`MethodAssetRef`补canonical `candidate_digest`,并将digest纳入register / replace签名;8类ref均可由对象自身字段支撑Step 7 `find_by_candidate_digest` | ref owner、canonical resolution state、resolver / repository owner和external body-free边界不变 |
| Inbound audit candidate locator mapping | existing `ReferenceLocatorSummary`补带英文Rustdoc的`from_observability_audit(kind, locator)`,以typed length-delimited composition复制body-free audit kind + locator | 不读取raw audit material、不使用enum display/debug文本、不新增object / field / enum / trait / Port |
| Inbound context authority retention | existing `CapabilityOperationContext`补带英文Rustdoc的Inbound-only source family、public source-event ref和source-provided idempotency key；`from_inbound_event`显式接收public/local双ref与两类key | 不把payload/envelope整体存入context、不让source key替代application key、不新增object / trait / Port |

修正后,所有直接返回六类change record的member均可从Step 7 `IdGeneratorPort`、Step 6 `CapabilityOperationContext`和application clock获得完整输入,并将record交给既有`CapabilityChangeRecordRepository` append；visibility fact mutation也有确定same-UoW history factory；专用reason到generic record reason也有唯一无损入口。batch `8.4`追加的initial reference / downstream feedback / candidate-digest修正同样不新增对象、状态owner或持久化owner,并复用既有reference / impact repositories。8类ref现在都以持久化canonical digest支撑Step 7 duplicate / replacement guard,adapter无需重算或扫描locator。Step 9必须使用本节修正后的exact signatures、reason bridge、initial factory、digest字段和visibility history规则,不得读取修正前口径。

### 20.5 Step 8 batch `8.5` 触发的 durable event capture 回开修正

batch `8.5` 在逐个证明10类Outbound Event的committed-source mapping时发现:旧口径只允许local commit后把transient candidate直接交给external collaboration port。若进程在local commit成功后、external intent建立前崩溃,本仓既没有durable candidate / payload snapshot,也没有可扫描的pending source-to-event relation；`RepairCapabilityAccessEventCollaboration`只能读取已经存在的external intent,因此无法识别或修复该窗口。这与正式需求`FR-CH-016`的持续变化感知、`NFR-CH-019`的协作失败可识别以及架构“异步失败保留待传播 / failed语义”冲突。

本次按§13与Step 7既有强制reopen gate完成以下最小修正:

| 修正面 | 新增 / 修正内容 | 明确未引入 |
|---|---|---|
| shared ids / refs | 新增`CapabilityEventPayloadSnapshotId`、`CapabilityEventCaptureId`、`CapabilityEventCaptureRef` | 不复用truth id、TraceId、JobRunId或external intent id |
| exact source union | 新增`CapabilityEventCaptureSourceRef`,覆盖change / trace / impact / derived exact revision / reference exact revision | 不允许current truth、reconciliation finding或database changelog作为source |
| immutable snapshot | 新增`CapabilityEventPayloadSnapshot`,冻结完整Step 8 envelope、schema ref、digest、trace和capture time | 不保存topic、attempt、retry、external response或owner body |
| versioned capture | 新增`CapabilityEventCaptureRecord`,只表达`Captured -> IntentBound`及stable external intent link | 不复制pending / delivered / failed / unavailable external delivery state |
| same-UoW rule | source commit或material / reference revision save与snapshot + capture必须同一local UoW | 不把external call伪装成本地transaction side effect |
| crash recovery | `Captured`可被repository扫描,使用stored complete envelope重调idempotent external collaboration并绑定stable intent | 不从current truth重建payload,不让worker / adapter查owner repository |

该修正新增2个application technical consistency object,但不新增capability business truth、HLD业务对象、外部协作状态owner或具体broker机制。`CapabilityEventPayloadSnapshot`不是旧版业务outbox message；`CapabilityEventCaptureRecord`也不是topic-bound relay item。Step 7必须提供snapshot / capture atomic save、exact load、captured scan和intent bind repository surface；Step 8必须让10类event mapper输出完整envelope并从stored snapshot形成external candidate；Step 9 / 11 / 13分别闭合调用顺序、transaction / uniqueness和duplicate / crash reentry。

### 20.6 Step 9 batch `9.1` 触发的 trace / affected-material 回开修正

Step 9逐函数反查发现两个无法交给实现者猜测的缺口:

1. `CapabilityAccessTraceabilityRecord::record_for_changes`需要`TraceabilityReason`,但identity / registry Command只稳定形成change record中的`ChangeReason`;旧契约没有合法typed bridge。
2. 正式`02-概要设计.md` §9.5要求core truth变化标记受影响consumer view、directory、audit export和ecosystem discovery stale,Step 8 accepted effect也只允许列出“实际已标stale”的material ref;旧对象状态却不能覆盖rebuilding / unavailable期间发生的新truth变化,且不同material reason类型没有确定转换来源。

本次以`CH-DDD-S9-AFFECTED-MATERIAL-001`最小回开,没有新增object、field、enum variant、state owner或Port:

| 修正面 | 当前exact contract | 不得实现为 |
|---|---|---|
| trace reason | terminal accepted change record的`change_reason.to_traceability_reason()`;同subject多条change使用terminal record reason | event name / record id字符串、Debug / Display、adapter error |
| review attachment reason | `ChangeReason::access_review_fact_recorded()`是唯一compile-time fixed body-free reason | review context / risk summary / governance body拼接 |
| controlled-view stale reason | terminal record的`change_reason.to_consumer_view_stale_reason()` | 从view summary、consumer或runtime state构造 |
| directory / export / discovery stale reason | terminal record的三个typed bridge逐类构造 | 一个generic string helper或跨type unsafe cast |
| stale transition | any non-stale current material revision可因newer truth进入stale;already-stale no-op | stale重复增version、跳过rebuilding / unavailable导致旧build覆盖新truth |
| reconciliation report | immutable report只可被扫描 / 对账,不接受`mark_stale` | 把report id加入Command `affected_material_refs`或原地更新report |

multi-change Command还必须区分trace coverage与event eligibility:

- 同一subject的全部ordered change refs都进入一条`record_for_changes` trace revision。
- 一次repository `save`只持久化最终truth revision。只有`record.explains_*(&final_truth)`成立、且该record的`next_state`与最终revision对称时,该record才可作为outbound capture source。
- `CorrectCapabilityIdentity`的`CorrectionRequested`记录解释事务内中间`CorrectionPending`,但最终只保存`Active` identity revision;因此该record仅进入trace,不得形成`CapabilityIdentityChanged` capture。terminal `Corrected / Merged / Split`记录形成唯一identity capture。
- `EstablishCapabilityAccessContext`的`Created`与`ReviewFactAttached`记录都与最终identity state对称,可各自形成独立capture;event uniqueness仍由`(change source,schema)`保证。
- application不得为中间状态执行第二次identity save,也不得用未从`Loaded<T>`取得的expected version保存中间revision。

Rustdoc审计:本回开没有新增struct / enum / field / variant;新增的7个public `ChangeReason`方法均在§7.6逐项给出英文`///`文案。结构体及既有字段Rustdoc保持完整。

### 20.7 Step 9 batch `9.3` 触发的 exposure / handoff / reference 回开修正

Batch `9.3`在Exposure、Trace / Impact与Reference Command逐函数反查中发现五类不能交给实现者猜测的缺口:

1. exposure service要求registry推进或保持目标状态,但`transition_lifecycle(...)`是actual transition member；目标状态已相同时若仍save / append会伪造registry revision。
2. visible applicability先支撑exposure activation,但activation增加exposure version；若直接保存pre-activation visibility,其`source_exposure_version`与final exposure version不对称。
3. `attach_handoff_ref(...)`后再`mark_handoff_pending(...)`会使一个待append对象内存version连续增加两次,且caller `trace_reason` / operation `trace_id`没有进入next revision。
4. reference state变化要求失效已识别material,但canonical reason没有到四类material reason的typed bridge。
5. source / document / runtime-tools / SDK candidate只有私有safe locator newtype,没有到generic `ReferenceLocatorSummary`的正式one-way mapping。

本次最小修正如下:

| 修正面 | exact contract | 未改变内容 |
|---|---|---|
| registry actual delta | exposure service只在`registry.lifecycle_state != target`时调用`transition_lifecycle(...)`;same target只返回loaded actual state,不save、不生成id / record / trace / capture | registry对象 / state / repository不变 |
| exposure / visibility source version | visible判定先在Accepted exposure上形成；activate后必须在内存中再次`visibility.reevaluate(...)`,只保存final visibility,使`source_exposure_version == final exposure.version` | 不新增状态 / field / method；中间visibility不持久化 |
| trace handoff single revision | 新增`request_handoff(...)`,optional audit attachment、caller reason、actor / trace、pending state和time一次完成,version只+1 | trace字段 / repository / Port / public DTO不变 |
| reference material reason | `ReferenceResolutionReason`新增四个有英文Rustdoc的safe bridge | 不新增reason owner或字符串转换helper |
| candidate locator mapping | `ReferenceLocatorSummary`新增source / document / runtime-tools / SDK四个有英文Rustdoc的constructor | 不新增struct、field、enum、variant、trait或Port |

Post-commit audit handoff只承诺“local request revision committed + external attempt requested”,不承诺receipt或external acceptance。Command提交后无论typed outcome或调用失败,stored accepted result保持不变且trace保持`HandoffPending`;调用方若需重试,必须先取得该result中的exact current trace ref,再用新幂等键发起新的Command。Same-key duplicate只回放stored local result,不得重复handoff。Step 10继续闭合pending / recorded状态矩阵,Step 12 / 15继续闭合post-commit operational failure分类与可观察性；当前不得伪造repair Job、receipt、evidence alias或验收签署。

Rustdoc审计:本回开没有新增public struct、struct field、enum或variant。新增9个public callable均在上述契约中给出英文`///`:4个locator constructor、4个reference reason bridge、1个trace handoff member。结构体及字段注释未遗漏。

### 20.8 Step 9 batch `9.5` 触发的双subject Query source-version回开修正

`GetSdkExposureBoundary`必须在任何body read前分别取得SDK external-reference subject与formal-exposure subject的read visibility decision。共享`CapabilityQuerySurface`只有一个`source_versions`,而旧契约没有合法合并两个private ordered set的public callable；若不回开,实现只能丢弃一侧basis、访问private inner set或发明application helper。

最小修正是在现有`DerivedMaterialSourceVersionSet`增加consuming `try_union(self,other)`。SDK decision固定为left,exposure decision固定为right；同subject同version只保留left位置,同subject不同version返回`ContractValueError`,再由application映射为consistency error。该方法是pure contract helper,不增加business object、field、state、repository、resolver或Port,也不改变single-subject Query直接复制decision source set的规则。

Rustdoc审计:本回开没有新增struct、field、enum、variant、trait或Port。新增public `try_union(...)`已在§7.10.3 code block中提供英文`///`注释；结构体和字段注释未遗漏。

### 20.9 Step 9 batch `9.6` 触发的impact分页与directory facet回开修正

Single impact Query没有page输入,无法通过分页repository构造完整`consumer_impact_summary_refs`。当前删除只服务该字段的`DownstreamImpactSummaryRefSet`;完整downstream summary读取由既有paged Query使用exact optional impact filter承接。该删除不减少43个HLD object,也不改变impact truth owner或summary repository owner。

Directory Search / Browse需要验证adapter返回projection包含全部requested facets,但`DirectorySearchFacetSet`是private newtype。现有set增加pure `contains_all(&self,required)`；不暴露inner vector、不解析query text、不引入ranking或marketplace语义。

Rustdoc审计:本回开没有新增public struct、field、enum、variant、trait或Port。新增public `contains_all(...)`已在§7.10.3 code block中提供英文`///`注释；删除的set没有留下public field或callable引用,结构体与字段注释未遗漏。

### 20.10 Step 9 batch `9.11` pre-entry 触发的 Job execution journal 回开修正

`CH-DDD-S9-JOB-TX-001`审计证明,既有`reservation UoW -> per-target UoW* -> final-report UoW`只有事务分段,没有跨分段恢复真相源。进程若在target business effect / outbound capture已commit后、request-local report accumulator更新或final report commit前崩溃,同key reserved reentry无法合法判断该target是否已经成功,只能重复target、按run反查report或从current truth猜测结果。三种做法都会破坏exact partial detail并可能重复revision / capture。

本次最小受控回开:

| 修正面 | exact contract | 未引入 |
|---|---|---|
| owner identity | `CapabilityOperationIdempotencyKey`是execution journal唯一key | 无execution id、无新增IdGenerator method、`JobRunId`不作repository key |
| complete planning outcome | initial UoW提交前展开closed scope并冻结完整、duplicate-free、ordinal `1..=N`的typed targets；合法scan可为空；scan未闭合时丢弃prefix target并形成typed Failed / Retryable空计划 | 无generic progress blob、无request body副本、无reentry rescan、无把planning failure伪装为Completed空计划 |
| initial run issue | factory接收stable duplicate-free typed redacted ref + explicit impact；只允许既有protocol / policy mapper产物 | 无新增issue id generator、无raw error / stack / external body、无从opaque ref猜impact |
| target outcome | `Planned -> Succeeded / Failed / Skipped`;success复用Step 8七类item / report view | 无Running、lease、attempt、retry count、worker owner或scheduler state |
| transaction join | success target effect / snapshot / capture与terminal success同UoW；rollback后failure outcome独立无effect UoW | 无whole-run UoW、无private adapter checkpoint |
| final linkage | all-terminal后typed response + shell / surface + execution Finalized + idempotency Completed使用same result ref同一final UoW | 无report-by-run reconstruction、无current truth mapper rerun |
| audit / reference exact plan | audit target冻结trace ref、audit subject version、canonical state ref；reference target冻结subject / kind / version / state ref | 无locator / body反查、无current ref / state替代、无reentry broad scan |

对象保持product-neutral并归`application`,不是第44个HLD business object。它保存的plan是执行一个已接受Operations Job所需的exact body-free source refs / parameters,不拥有identity、registry、descriptor、seam、method、exposure、runtime execution、marketplace、governance approval或external delivery truth。Reconciliation target预分配existing report id,其来源仍是既有`IdGeneratorPort::new_reconciliation_report_id`;controlled view / material target同样使用既有typed id generator method,因此没有新增execution-id capability。

Rustdoc审计:新增的5个public enum、5个public struct、1个public newtype及其全部field、variant和variant payload均有英文`///`。7组`impl`中的全部public constructor / guard / transition方法也有英文`///`；ordinal inner field保持private并只通过positive constructor建立。结构体、字段、variant payload和callable注释未遗漏。

### 20.11 Step 9 batch `9.11` 触发的 audit export rebuild callable 回开修正

`PrepareAuditFriendlyExportSummary`逐函数反查发现,existing export只有initial factory、append-only audit-ref attachment和degraded transition,却没有把同一trace / scope下的`Stale / Partial / Unavailable`对象重建为`Ready`的合法member。若直接复用factory会覆盖existing id / version,若只调用`attach_observability_ref`又无法移除旧ref、替换summary / source markers或恢复Ready；同时typed Job item要求`observability_ref_ids`与saved optional set严格相等,但named wrapper没有显式stable iterator。

本次以`CH-DDD-S9-AUDIT-EXPORT-REBUILD-001`最小回开:

| 修正面 | exact contract | 未改变内容 |
|---|---|---|
| complete no-op check | `matches_preparation(...)`一次比较exact trace / scope、safe summary、stable resolved audit ids、source versions及期望final state/reason；Ready / Partial / Unavailable均可合法Unchanged | 不读取repository、raw audit body或error text |
| existing rebuild | `refresh_from_traceability(...)`只允许same trace / scope,替换safe summary / markers、清空old refs并恢复Ready；随后逐个调用existing `attach_observability_ref(...)` | 不新增state、field、repository method或upsert语义 |
| stable result refs | `ObservabilityAuditRefSet::iter()`按saved order只读复制typed ids；无refs继续用`None` | 不暴露inner vector、不形成evidence alias / sign-off |

Rustdoc审计:本回开未新增struct、field、enum、variant、trait或Port。新增4个public callable均在§7.10.3 / §11.3 code block或函数表提供英文`///`语义；结构体、字段与既有variant注释未遗漏。

### 20.12 Step 9 batch `9.11` 触发的 preclassified failed-target 回开修正

Material Job scope可以同时包含合法target与在planning阶段已确认normal missing / typed inapplicable的target。旧journal plan variant只接受完整success-capable frozen input；若为失败target伪造summary / source ref会越过domain guard,若把它降成run issue则丢失`CapabilityJobTargetRef`并把partial completion错误变成whole-run failure。Loaded owner/version/union/state-id/sidecar不对称从不属于该业务失败集合,必须返回`ConsistencyDefect`。

`CH-DDD-S9-JOB-PLANNED-FAILURE-001`以existing enum最小闭合:`CapabilityJobExecutionTargetPlan::PreclassifiedFailure { failure }`复用既有`CapabilityJobExecutionTargetFailure`。variant和payload均有英文`///`;`matches_target_ref`只接受`failure.issue().target_ref`对称,`CapabilityJobExecutionSuccess::matches_plan`始终拒绝该variant。Initial journal仍要求所有target outcome为`Planned`;execution loop按ordinal在zero-business-effect UoW调用existing`record_failed`,因此terminal immutability、expected version和reentry source均不改变。

除上述1个enum variant及其1个payload field外,本回开没有新增struct、struct field、trait、Port、protocol、scheduler state、attempt或private checkpoint。43 HLD objects + 7 application helpers、36 Ports、83 protocols保持不变。

### 20.13 Step 9 batch `9.11` 触发的 ecosystem final-outcome freeze 回开修正

`ReadOnlyEcosystemDiscoverySummary` factory / refresh先形成Ready,再可通过member进入Partial / Unavailable。旧execution plan只冻结summary与source versions,没有冻结最终state / reason；target reentry若重新读取optional source决定降级会破坏no-rescan,若一律Ready又会隐藏显式degraded语义。

本次在existing `EcosystemDiscovery` struct variant中新增`expected_state`与`state_reason`两个private payload fields,均有英文`///`。Planning基于exact exposure、source-version-symmetric formal visibility、accepted consumer-safe descriptor/relation/reference basis一次选定Ready / Partial / Unavailable。Target只exact-load计划中的exposure / optional material,以frozen summary / versions重建,再按frozen state执行零或一次degraded member。`CapabilityJobExecutionSuccess::matches_plan`同时校验item state；不新增object、state variant、trait、Port或protocol。

### 20.14 Step 9 batch `9.12` 触发的 collaboration capture-plan symmetry 回开修正

`RepairCapabilityAccessEventCollaboration`的local capture target在planning时可能是`Captured + None`或`IntentBound + Some(intent)`。旧`EventCapture { capture_ref }`plan只冻结原capture revision；前者成功绑定后必然保存同id的successor revision,而后者必须保留原exact revision。若assembler只要求item capture ref等于plan ref,前者合法success会被拒绝；若只比较id,后者又可能隐藏非法二次bind。旧plan也没有exact source,final journal-only assembly无法校验typed item source而不回读capture。

本次在existing `EventCapture` struct variant中新增两个private payload fields:

| field | exact contract | Rustdoc / boundary |
|---|---|---|
| `source_ref` | planning从official capture + immutable snapshot对称join冻结；target outcome、external outcome及typed item必须同source | 英文`///`完整；不新增public protocol field |
| `existing_intent_ref` | `None`表示target必须从Captured形成并绑定一个stable intent；`Some(intent)`表示target只读existing intent且不得再次bind | 英文`///`完整；不复制external delivery state |

`CapabilityJobExecutionSuccess::matches_plan`因此固定两条pure规则:`None`只接受same capture id、exactly one successor version、same source与outcome intent；`Some(intent)`只接受exact unchanged capture ref、same source与same intent。该比较不读repository、不解析opaque ref、不读取serialized envelope。除两个variant payload fields外,没有新增type、struct field、enum variant、trait、Port或protocol；43 HLD objects + 7 application helpers、36 Ports、83 protocols保持不变。

### 20.15 Step 10 batch `10.0` 触发的 governance seam replacement state 回开修正

Step 10对Step 6 enum、Step 8 protocol和Step 9 actual flow做逐状态符号核对时发现:`ReplaceGovernanceSeamRelation`已经要求replacement relation先独立进入`Active`,随后调用old relation的existing `replace_with(...)`并保存old `Replaced` revision；Step 9还显式以`GovernanceSeamState::Replaced`拒绝再次替换。但原`GovernanceSeamState`只有`Pending / Active / Unresolved / Expired / Forbidden`,导致existing callable没有合法next enum value。`GovernanceSeamChangeKind::Replaced`只能解释变化类型,不能代替relation current state。该冲突登记为`CH-DDD-S10-GOVERNANCE-SEAM-REPLACED-001`,不能留给实现者选择change kind或私有字符串充当状态。

本次最小受控回开固定以下exact contract:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| enum variant | existing `GovernanceSeamState`新增`Replaced`,英文Rustdoc明确“distinct active relation已替换本relation,本relation只保留historical” | 不新增state enum、object、field或owner |
| callable guard | existing `replace_with(...)`只允许`Pending / Active / Unresolved / Expired -> Replaced`;replacement id必须different,且application flow必须先证明distinct replacement relation已经`Active` | 不让domain object读取repository或接受replacement object；Step 9继续承担loaded guard与事务编排 |
| terminal rule | `Replaced`不可activate、mark unresolved、mark expired、forbid或再次replace | 不把`Forbidden`改成replacement成功状态,不允许旧relation原地恢复 |
| history symmetry | returned existing `GovernanceSeamChangeRecord`固定`change_kind=Replaced`,`previous_state=old current`,`next_state=Replaced`,并与saved old relation revision对称 | 不新增change kind、trace、capture、repository或protocol |
| downstream synchronization | Step 8/9已使用上述exact语义,无需文本回写；Step 10后续seam矩阵必须绑定existing `replace_with(...)`及Step 9 `command_replace_governance_seam_relation_flow` | 不改83 protocols / 83 flows,不伪造实现或测试结果 |

Rustdoc审计:本回开只新增一个public enum variant；`Replaced`已在§7.8 code block提供英文`///`,并在§7.8.1、§9.8、§15.1同步语义。没有新增struct、struct field、variant payload、callable、trait或Port；43 HLD objects + 7 application technical helpers、36 Ports、83 protocols保持不变。

### 20.16 Step 10 batch `10.1` 触发的 identity initial mapping 与 registry reachability 回开修正

Step 10逐行绑定identity / registry状态与Step 9 actual flow时发现两个会迫使实现者猜测的契约缺口,统一登记为`CH-DDD-S10-IDENTITY-REGISTRY-CALLABLE-001`:

1. `CapabilityIdentity::create_from_intake(...)`承诺可形成`Candidate / Active / Unresolved`,但旧签名没有policy参数,且旧说明没有穷尽`ReferenceResolutionValue`到initial identity state的映射。相同non-resolved canonical state可能被不同实现任意落成`Candidate`或`Unresolved`。
2. registry概要方向保留`Draft -> Registered`,但current `register(...)`与Step 9实际直接形成`Registered`;同时descriptor unresolved flow会从任一非`Undescribed`、非retired registry进入`Undescribed`,其中包含`Ungoverned / FormalVisible`,而exposure建立flow可在complete prerequisites下从`Registered`直接进入`FormalVisible`;旧`can_transition_to(...)`摘要遗漏这三个actual方向。

本次最小受控回开固定以下exact contract:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| identity factory policy input | existing `create_from_intake(...)`增加existing `&CapabilityIdentityPolicy`;factory必须调用`validate_new_identity(...)`,不得在object内另建规则 | 不新增callable、policy、field、state、object或repository |
| identity initial mapping | exact source ref / state owner对称且source kind允许后,`Resolved -> Active`,`Stale -> Candidate`,`Unresolved / Unavailable -> Unresolved`;`Invalid / Forbidden / Expired`拒绝并不形成identity | 不把candidate discovery snapshot当identity；不创建自动recovery flow |
| identity recovery direction | existing `activate(...)`仍允许`Candidate / Unresolved -> Active`,但current 83-flow boundary没有调用者,因此Step 10标`reserved_not_callable_in_current_boundary` | 不新增Command、Consumer或Job；reference refresh不得自动改identity truth |
| registry factory reachability | current `register(...)`直接形成`Registered`与factory-returned record；`Draft`只保留为概要reserved state,当前没有factory / flow / persistence path | 不删除enum variant、不回写正式`02`、不伪造draft save |
| registry descriptor-degradation direction | `can_transition_to(...)`补齐`Ungoverned / FormalVisible -> Undescribed`;该方向由`command_establish_adapter_descriptor_flow`的unresolved branch证明为actual,也可由既有public lifecycle route在target allowlist与policy双guard通过后调用；already`Undescribed`为application no-op | 不允许`Undescribed -> FormalVisible`;不改变exposure-service-only FormalVisible authority |
| registry formal-visible direction | `can_transition_to(...)`补齐`Registered -> FormalVisible`,只允许exposure service在final exposure=`Active`、final visibility=`Visible`且source version对称时请求；public lifecycle target allowlist仍拒绝FormalVisible | 不允许Draft / Undescribed / Ungoverned绕过前置,不赋予registry Command / Query / runtime authority |
| registry current matrix | 其余current方向按Step 10 matrix固定；same-state false,`Retired`无出向,`Draft`出向均reserved | 不新增state、change kind、trace、capture、Port或protocol |

同步结果:Step 8 `EstablishCapabilityAccessContext`卡补policy factory与initial mapping,Step 9 identity pseudocode补exact policy参数并同步state / test说明；Step 8 / 9 registry注册说明明确`Draft`不形成,descriptor unresolved effect明确actual source subset。正式`02`仍表达候选、草稿和概要方向,详细设计只是裁剪current callable reachability,未改变业务能力或owner,因此无需回改正式`02`。

Rustdoc / 结构注释审计:本回开没有新增public struct、struct field、enum、variant、variant payload、callable、trait或Port；只收紧existing callable signature与guard说明。所有既有结构体 / 字段 / enum variant英文`///`保持完整,无结构体注释遗漏。43 HLD objects + 7 application technical helpers、36 Ports、83 protocols / flows保持不变。

### 20.17 Step 10 batch `10.2` 触发的 descriptor current reachability 与 risk-summary formation 回开修正

Step 10逐行绑定descriptor / safe-summary状态与Step 9 actual flow时发现三处会迫使实现者自行选择的旧契约歧义,统一登记为`CH-DDD-S10-DESCRIPTOR-SUMMARY-REACHABILITY-001`:

1. `ReplaceAdapterDescriptor`只拒绝old `Replaced / Retired`,因此actual current old descriptor可以是`Accepted / Unresolved`;但旧§7.8.1 variant表只列`Accepted -> Replaced`,且`replace_with(...)`没有穷尽source guard。相同flow可能被实现为允许transaction-local Draft replacement、拒绝合法Unresolved replacement或让terminal state穿透。
2. `DescriptorRiskConstraintSummary::derive(...)`返回四态enum之一,但旧契约没有把closed `DescriptorRiskLevel`与scanner marker穷尽映射到factory state；Step 9只写“new derived state”。实现者可能把`Unknown`伪装为Available、把合法known risk任意降为Unavailable,或持久化ForbiddenBody candidate。
3. `AdapterDescriptor::retire(...)`旧说明写成`non-retired -> retired`,但`Replaced`在同一variant contract中已经是terminal。若按字面实现会错误放行`Replaced -> Retired`,破坏replacement history的终态语义；retirement本身又没有current protocol,不能用不存在的flow消解该歧义。

本次最小受控回开固定:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| descriptor persisted-current guard | risk / secret attachment与replacement只接受persisted current `Accepted / Unresolved`;`Draft`只在establish / replacement同一UoW内进入Accepted / Unresolved后保存 | 不新增状态、Command、repository或public target |
| descriptor replacement | existing `replace_with(...)`只允许`Accepted / Unresolved -> Replaced`;Step 9 current-by-entry guard与new replacement先Accepted规则不变 | 不允许Draft / Replaced / Retired作为old source,不允许unresolved new replacement |
| descriptor retirement | existing `retire(...)`只允许`Draft / Accepted / Unresolved -> Retired`;`Replaced / Retired`在guard前即稳定拒绝且零字段 / version / time变化 | retirement仍无current protocol / flow；不把reserved callable伪造成actual capability,不允许terminal-to-terminal改写history |
| risk factory mapping | existing `derive(...)`在owner、Recorded / Separated review、safe constraint和marker通过后,`Low / Medium / High / Critical -> Available`,`Unknown -> Partial`;`ForbiddenBody`拒绝且不创建 | 不新增risk level、state、field、factory或policy；Unavailable不伪造成factory成功 |
| risk existing transitions | old current `Available / Partial / Unavailable -> Superseded`由existing replacement flow可达；mark partial / unavailable与reverse recovery均无current protocol,继续reserved | 不新增refresh / degrade Command或Job truth repair |
| secret summary boundary | factory仍只形成Available / Unavailable；Forbidden candidate拒绝；existing stale / unavailable / forbid与recovery方向无current protocol | 不新增secret refresh、KMS / Vault或secret body owner |

同步结果:Step 8 descriptor / risk / secret Command卡与Step 9三条exact flow同步replacement / attachment / mapping；retirement只收紧Step 6 callable与Step 10 reserved / terminal矩阵,不新增或修改Step 8 / 9 current flow。83 protocol和83 flow名称、DTO、Port、UoW与side-effect cardinality不变。正式`02`只给概要候选方向并明确详细设计继续展开,因此不回改正式`02`。

Rustdoc / 结构注释审计:本回开没有新增public struct、struct field、enum、variant、variant payload、callable、trait或Port；existing public声明的英文`///`保持完整。43 HLD objects + 7 application technical helpers、36 Ports、83 protocols / flows保持不变。

### 20.18 Step 10 batch `10.3` 触发的 exposure / visibility applicability 与 trace revision 回开修正

Step 10逐pair绑定formal exposure、formal visibility与traceability state时发现两组不能留给实现端猜测的契约冲突:

1. `CH-DDD-S10-EXPOSURE-VISIBILITY-APPLICABILITY-001`:旧`FormalApplicabilityScope`是不可解析业务语义的safe-text newtype,但`is_consumable_by(...)`要求deterministic membership；visibility policy又缺active identity、descriptor / seam / optional method、scope / basis输入,`derive / reevaluate`仍允许application先传target。Step 9因此可能在incomplete `Accepted / Active / Suspended`未先降级时形成`Visible`,也无法证明suspend / retire读取的是source-version-symmetric current visibility。
2. `CH-DDD-S10-TRACE-REVISION-INVARIANT-001`:trace字段契约规定只有`Partial`允许`gap_reason=Some`,但`request_handoff / mark_handoff_pending / supersede`从Partial离开时未声明清gap。不同实现可能保存`HandoffPending / Superseded + gap_reason=Some`的不合法revision。

本次受控回开固定:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| applicability representation | existing named `FormalApplicabilityScope`由safe-text inner改为non-empty ordered `CapabilityTypedSet<CapabilityConsumerRef>`；factory拒绝duplicate / empty,`contains`只做typed equality | 不新增type、consumer owner、runtime allowlist或SDK client state；不得解析文本 |
| structure / callable Rustdoc | reworked tuple inner field、`try_from_values / iter / contains`均有英文`///`;旧safe-text `new / as_str`不再属于该type | 无未注释struct、field、variant或public callable |
| prerequisite authority | existing exposure policy新增pure `prerequisites_are_complete(...)`,并让`validate_exposure / derive_visibility_state`接收active identity与完整local owner chain；derive另接typed scope + safe basis | 不读repository / runtime / listing；external ref + canonical-state pair仍由application使用existing repositories验证 |
| target authority | existing visibility `derive / reevaluate`移除target参数并接收完整policy inputs；policy closed mapping唯一产生NotVisible / Pending / Visible / Unavailable / Retired classification | 不新增state、factory、Command或private service helper |
| exposure normalization | complete Pending / Unavailable先`accept`;incomplete Accepted / Active / Suspended先`mark_unavailable`;只有normalized Accepted / Suspended + symmetric Visible fact可`activate` | 不允许visibility暗改exposure；不把consumer / runtime信号当prerequisite |
| suspend / retire symmetry | mutation前current visibility必须same exposure且source version等于pre-mutation exposure；suspend另要求Visible；mutation后visibility source version复制final exposure version | 不允许临时补fact或partial commit |
| trace mutually-exclusive fields | request / pending / recorded / supersede member逐一清理`gap_reason / superseded_by`;非法调用零mutation | 不删除handoff refs或source refs,不把post-commit handoff结果写回truth |

Public declaration delta按replacement surface计算:`FormalApplicabilityScope`退出2个safe-text methods并进入3个typed-set methods,policy新增1个read-only readiness callable,净增2个public callable；没有新增public type、HLD object、application helper、state enum / variant、protocol、flow、trait或Port。43 HLD objects + 7 application helpers、36 Ports、83 protocols / flows保持不变。

### 20.19 Step 10 batch `10.4` 触发的 controlled-view partial input 与 derived rebuild guard 回开修正

Step 10逐pair核对consumer view / directory状态形成路径时发现一项状态输入缺口和一项current / reserved边界冲突,统一登记为`CH-DDD-S10-CONSUMER-VIEW-PARTIAL-REBUILD-GUARD-001`:

1. `ControlledConsumerView::{build,refresh_from_exposure}`声明会形成`Ready / Partial`,`ConsumerViewFreshnessPolicy`也要求按`ConsumerViewPartialKind`验证；但旧`DescriptorConsumerSummary`只是opaque safe text,Job plan没有其他typed partial input。实现只能解析safe text、把任意optional failure降级为Partial,或永远只形成Ready。
2. §15旧摘要把consumer / directory rebuild描述成持久化`Rebuilding`再恢复,但两条current Step 9 Job都直接在loaded object上refresh并只保存final revision；`mark_rebuilding / mark_unavailable`没有current caller,而旧object member又未完整写明source guard。实现可能私自增加中间save / capture,改变Job transaction与reentry语义。

本次受控回开固定:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| partial input representation | existing named `DescriptorConsumerSummary`由opaque safe-text newtype改为private `safe_summary: CapabilitySafeText` + `partial_kinds: ConsumerViewPartialKindSet`；partial set稳定、duplicate-free且可empty | 不新增public type / object / owner；不保存descriptor、secret、method或resolver body |
| deterministic view target | Job planning从exact optional risk / secret / method safe-source结果构造closed partial kinds；factory / refresh只以`is_complete`及policy allowed-set校验选择Ready / Partial | 不解析safe text、enum display/debug或raw error；required / forbidden source仍是failed target |
| consumer member guards | refresh接受任一existing state并直接形成Ready / Partial；`mark_rebuilding`只允许Stale / Unavailable / Partial；`mark_unavailable`只允许Ready / Stale / Rebuilding / Partial；same-state拒绝 | current Job只调用build / refresh,不保存Rebuilding / Unavailable；actual source propagation仍只把non-stale标Stale |
| directory member guards | refresh接受任一existing state并直接形成Ready；`mark_rebuilding`只允许Stale / Unavailable；`mark_unavailable`只允许Ready / Stale / Rebuilding；same-state拒绝 | current Job只保存Ready；不新增failure-state write、search-index state或marketplace state |
| Query / event / replay | Query继续复制existing `descriptor_summary`,因此typed partial kinds随view body可见；availability event仍只宣布freshness / source versions；Job journal既有summary field冻结完整structured value | 不新增DTO field、event schema field、protocol、stored result variant、Port或flow |
| structure / callable Rustdoc | reworked `DescriptorConsumerSummary`两个private fields、`ConsumerViewPartialKindSet`private inner field及全部public factory / accessor / set methods均有英文`///` | `ControlledConsumerView`、policy、directory struct及全部既有fields的英文`///`保持完整,无结构体注释遗漏 |

Public declaration delta按replacement surface计算:`DescriptorConsumerSummary`退出opaque `new / as_str`,进入`try_new / safe_summary / partial_kinds / is_complete`;existing partial set在`capability_hub_default / contains`外补`try_from_values / iter / is_empty / is_subset_of`,净增6个public callable。Existing carrier representation由一个opaque inner改为2个有英文Rustdoc的private fields；没有新增public type、HLD object、application helper、state enum / variant、DTO field、trait或Port；43 HLD objects + 7 application helpers、36 Ports、83 protocols / flows保持不变。

### 20.20 Step 12 batch `12.1` 触发的 exact error 可达性回开修正

Step 12为`ContractValueError`与`DomainError`建立closed variant时,逐一反查所有fallible callable,发现三项会迫使实现者制造不可达错误分支的局部冲突,统一登记为`CH-DDD-S12-ERROR-REACHABILITY-001`:

1. generic `CapabilityTypedSet::try_from_values(...)`声明empty必拒绝,但`ConsumerViewPartialKindSet::try_from_values(...)`明确需要empty表达complete summary,旧契约没有合法构造路径。
2. `ReferenceCandidate::body_free(...)`的三个输入已经分别是closed `ReferenceKind`、validated body-free locator和validated digest,constructor又固定`SensitiveBoundaryMarker::BodyFree`,却返回`Result`;不存在可映射的`ContractValueError`触发条件。
3. `ExternalCapabilitySourceRef`、`SecretRef`、`GovernanceResultRef`和`MethodAssetRef`的`register(...)`只组装已由application / resolver完成subject / kind / digest / body-free校验的typed fields并固定version / time,但仍返回`Result`;domain既不拥有Step 13 digest codec,也没有额外policy输入可形成合法失败。

本次受控回开固定:

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| possibly-empty typed set | `CapabilityTypedSet<T>`新增crate-visible `try_from_possibly_empty_values(...)`;只拒绝duplicate,当前唯一调用者是`ConsumerViewPartialKindSet::try_from_values(...)` | public generic factory仍拒绝empty；其他non-empty set、字段和representation不变 |
| candidate construction | `ReferenceCandidate::body_free(...) -> Self`;固定BodyFree marker | forbidden body仍必须在safe carrier / scanner边界拒绝；policy validation和candidate digest guard不变 |
| first-four reference formation | 四个`register(...) -> Self`;只复制已验证typed fields并形成version 1 | resolver、candidate digest collision、subject / kind / digest symmetry、canonical state formation仍由Step 9 application flow先完成；replace callable仍fallible |
| Step 9 synchronization | 24处candidate constructor与8处上述register实际调用表达式移除`?`；流程图箭头、签名注释和inventory文字不计调用点 | 83个flow、branch、transaction、effect cardinality、protocol和Port不变 |
| Rustdoc | 新crate-visible helper带英文`///`;既有public constructor语义由表格完整说明 | 无新struct、field、enum、variant或variant payload |

该修正不把digest算法移入domain。`ReferenceCandidateDigest`的canonical field set仍由Step 9固定,exact codec由Step 13闭合,binding由Step 14承接。Domain只保存或比较传入的typed digest；不得解析digest、重算codec或从locator推断其正确性。

Public declaration delta为existing generic type新增1个crate-visible helper、5个existing constructor从`Result<..., Error>`收紧为infallible return；无新public type、HLD object、application helper、state enum / variant、protocol、flow、trait、Port或repository。43 HLD objects + 7 application helpers、36 Ports、22 repository traits / 110 methods、83 protocols / flows和Step 10的642 pair baseline保持不变。

### 20.21 Step 12 batch `12.3` 触发的 deterministic issue-ref 构造回开修正

Step 12反查Step 8 `CapabilityProtocolValidationIssueRef(CapabilityOpaqueId)`时发现,旧carrier只有公开tuple field,没有合法semantic constructor。若不回开,实现者只能在每个mapper重复调用fallible `CapabilityOpaqueId::new(...)`再`unwrap / expect`,允许任意runtime string直接包装,或扩展`IdGeneratorPort`制造随机issue ref；三者都破坏closed code、stored replay和body-free redaction门禁。该缺口登记为`CH-DDD-S12-ISSUE-REF-CONSTRUCTION-001`并在本批受控关闭。

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| primitive入口 | existing `CapabilityOpaqueId`新增`pub(crate) fn from_audited_static(&'static str) -> Self` | public `new / as_str`及non-empty invariant不变；无runtime unchecked constructor |
| 唯一调用者 | 只允许Step 8 `CapabilityProtocolValidationIssueRef::from_code(...)`在`CapabilityIssueCode::literal()`之后调用 | 其他typed id、cursor、surface、result、capture、intent和external ref不得调用 |
| 输入证明 | literal来自51-arm closed enum exhaustive match；均为compile-time fixed、ASCII、non-empty、unique、`v1`namespaced值 | 不使用raw body/error、subject id、port、timestamp、random、hash、HTTP/SQL/SDK code或message |
| failure surface | construction infallible,因此不会为audited literal制造不可达`ContractValueError`或panic branch | unknown serialized literal仍由Step 8 exact `from_literal(...) -> Option<Code>`拒绝；不进入该helper |
| compatibility | existing literal immutable；新增/替换literal必须先回开protocol/error compatibility审查 | 不提前定义transport status、schema negotiation或Step 13 digest算法 |
| Rustdoc | crate-visible callable有英文`///`;existing struct及private inner field注释保持完整 | 无结构体、字段、enum、variant或payload注释遗漏 |

Public declaration delta为existing primitive新增1个crate-visible callable,不是public API count增加。无新type、field、enum、variant、HLD object、application helper、protocol、flow、trait、Port或repository；43 HLD objects + 7 application helpers、36 Ports、22 repository traits / 110 methods、83 protocols / flows与642 state-pair baseline保持不变。

### 20.22 Step 12 batch `12.4` 触发的 Query degraded typed-source 回开修正

Step 12逐协议反查33条Query时发现,existing `CapabilityReadVisibilityResolution`在resolver-level `Degraded`分支只携带`CapabilityReadDegradedReason(CapabilitySafeText)`,而Step 8 public surface要求closed `CapabilityQueryDegradedKind + deterministic issue_ref`。全局真相源标准明确禁止service / fake从reason text、repository error或adapter-private enum推导degraded kind。该缺口登记为`CH-DDD-S12-QUERY-DEGRADED-SOURCE-001`并在本批受控关闭。

| 修正面 | exact contract | 明确未改变 |
|---|---|---|
| reason representation | existing `CapabilityReadDegradedReason`的private inner由`CapabilitySafeText`替换为`CapabilityQueryDegradedKind` | named type、owner、`CapabilityReadVisibilityDecision.degraded_reason`字段及optional语义不变 |
| construction | `from_kind(kind)`是唯一public constructor；resolver / fake只能从formal typed policy或persisted state选择8个closed kind之一 | 不接收free text、raw error、HTTP/SQL/SDK code、opaque ref或adapter-private category |
| public mapping | `into_public_marker()`固定`kind`与`CapabilityProtocolValidationIssueRef::from_code(kind.issue_code())`同源形成 | 不新增response field、generic error envelope或第二issue taxonomy |
| freshness mapping | Query service先通过`as_kind()`执行Step 8 / 12的8-armclosed mapping,再consume reason形成marker | 不从timestamp、repository error、reason text或first item推断freshness |
| dependency direction | application reason合法复用contracts-owned public kind / marker；`contracts`不反向依赖application | 七crate依赖方向不变,无循环依赖 |
| Rustdoc / structure | reworked private inner field与3个public callable均有英文`///` | existing decision struct、fields、enum / variants Rustdoc保持完整,无结构体注释遗漏 |

Public declaration delta按replacement surface计算:existing reason不再暴露safe-text constructor / accessor,进入3个typed callables；没有新增public type、struct field、enum、variant、variant payload、HLD object、application helper、protocol、flow、trait、Port或repository。`43 + 7 + 36 + 83`与Step 8 protocol文件250个public struct / enum基线保持不变；Step 13后续仅从Step 6 application-support inventory删除`CapabilityIdempotencyConflictReason`。

### 20.23 Step 12 batch `12.6` 触发的 Job safe-terminalization 回开澄清

Step 12逐Job反查发现,existing journal invariant和部分planning prose把normal missing / typed inapplicable与loaded owner/version/pair defect写在同一`PreclassifiedFailure`集合中。前者可由closed protocol reason表达并证明zero business effect；后者说明已经加载的durable relation不可能成立,必须保留`ApplicationError::ConsistencyDefect`和`Planned`恢复点。该歧义归入`CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001`并在本批受控关闭。

| 澄清面 | exact contract | 明确未改变 |
|---|---|---|
| normal target failure | exact target/run identity、existing closed issue、typed `StableFailure / RetryablePrerequisite` impact与zero-effect / confirmed rollback同时成立后,existing `PreclassifiedFailure / record_failed / record_skipped`可用 | plan/outcome enum、target ref和failure payload不变 |
| loaded defect | owner、id、version、union、state-id、mandatory sidecar、source chain、capture/snapshot、journal/result任一不对称 -> exact `ConsistencyDefect`;target stays`Planned` | 不新增consistency state、repair variant或fallback callable |
| optimistic failure | onlyconfirmed rollback + exact journal reload stillshowingthe sameordinal`Planned` may record existing `OptimisticConflict + RetryablePrerequisite` | Step 13仍拥有race/retry algorithm；无retry counter/lease |
| terminalization authority | `CapabilityJobExecutionRecord`只执行caller已提供的typed failure/issue andmatching target-ref guards；它不从raw error、opaque issue ref或loaded defect自行分类 | existing methods/signatures andversion transitions不变 |
| Rustdoc / structure | no declaration delta；all existing journal/support struct、field、enum、variant、payload andcallable English `///` remain complete | 无结构体、字段、enum、variant、callable注释遗漏 |

本次只收紧existing prose invariant,没有新增或删除type、field、enum、variant、object、callable、protocol、flow、trait、Port或repository。`43 HLD objects + 7 application helpers + 36 Ports + 83 protocols / flows`及Step 10 `642` pair baseline均不变。

---

## 21. Step 6 自检与停审记录

### 21.1 SOP / 书写规范自检

| 检查项 | 结果 | 证据 / 说明 |
|---|---|---|
| 先建立骨架、批次表、模块顺序 | pass | §1、§4 |
| 先收敛 shared vocabulary / typed ref / marker | pass | §7;core reuse + domain-specific carrier |
| 逐模块 capability -> object -> field / function / state | pass | §8~§12 object card + §14.1 全量反查 |
| 每个 HLD object 独立小节 | pass | 43 个 object 全部独立 card;`RegistryLifecycleState` 独立 enum behavior card |
| field type / source、function full signature、factory completeness | pass | 每 card 字段表 / member / factory;§14 source audit |
| enum variant Rustdoc | pass | Rust code block 每个 enum variant 均有 `///` 英文注释;state transition summary / audit 已写 |
| Step 8 durable-capture reopen Rustdoc | pass | 2个id、1个versioned ref、source union、state enum、2个technical struct及全部field / variant / payload field均有英文`///` |
| Step 9 Job journal reopen Rustdoc | pass | 5个enum、5个struct、1个newtype、7组impl及全部field / variant / payload / callable均有英文`///`；enum struct variant field均未写`pub` |
| Step 9 audit-export rebuild reopen Rustdoc | pass | existing set / object新增4个public callable均有英文`///`；无新struct / field / enum / variant |
| Step 9 preclassified failed-target reopen Rustdoc | pass | existing target-plan enum新增1个variant及1个payload field,二者均有英文`///`;无enum struct variant field写`pub` |
| Step 9 ecosystem outcome-freeze reopen Rustdoc | pass | existing struct variant新增2个private payload fields,均有英文`///`;无field-level `pub`或新type |
| Step 9 collaboration capture-plan reopen Rustdoc | pass | existing `EventCapture` struct variant新增`source_ref` / `existing_intent_ref`两个private payload fields,均有英文`///`;无field-level `pub`或新type |
| Step 10 governance seam replacement reopen Rustdoc | pass | existing `GovernanceSeamState`新增`Replaced` variant并有英文`///`;无struct / field / payload / callable / trait / Port新增 |
| Step 10 identity / registry callable reopen Rustdoc | pass | existing identity factory signature与registry guard语义收紧；无新struct / field / enum / variant / payload / callable / trait / Port,既有结构体与字段英文`///`保持完整 |
| Step 10 descriptor / safe-summary reachability reopen Rustdoc | pass | existing descriptor / risk / secret callable guard与factory mapping收紧；无新struct / field / enum / variant / payload / callable / trait / Port,既有英文`///`保持完整 |
| Step 10 exposure / trace reopen Rustdoc | pass | reworked `FormalApplicabilityScope`及其private inner field、3个public set methods均有英文`///`;policy readiness callable有英文契约；无struct / field / variant注释遗漏 |
| Step 10 controlled-view / derived guard reopen Rustdoc | pass | reworked `DescriptorConsumerSummary`两个private fields、partial-set inner field及10个public methods均有英文`///`;consumer / directory existing struct fields继续完整 |
| Step 12 error reachability reopen Rustdoc | pass | `CapabilityTypedSet<T>`新增crate-visible helper有英文`///`;5个existing constructor收紧为infallible return,无新struct / field / enum / variant / payload |
| Step 12 deterministic issue-ref reopen Rustdoc | pass | `CapabilityOpaqueId::from_audited_static(...)`有英文`///`;existing tuple inner field与全部public constructors/accessors仍有完整注释 |
| Step 12 Query degraded-source reopen Rustdoc | pass | `CapabilityReadDegradedReason` reworked private inner field与`from_kind / as_kind / into_public_marker`三个callable均有英文`///`;无新type / struct field / enum / variant / payload |
| Step 12 Job safe-terminalization reopen Rustdoc | pass | onlyprose invariant clarification；`CapabilityJobExecutionRecord`及support struct / field / enum / variant / payload / callable declarations unchanged andall English`///`remain complete |
| non-core close / defer / reopen | pass | §5 + §13 |
| object group field-source audit | pass | §14.2~§14.3 |
| state closure audit | pass | §15;reference kind subset 单独审计 |
| Step 7 handoff list | pass after Step 9 batch 9.11 pre-entry reopen | §16;repository / resolver / store / event capture / Job execution / UoW / publisher / handoff 等逐项命名 |
| historical material / before-after / design decisions | pass | §17~§18 |
| formal §5 / §6 backfill draft | pass | §19;正式文档仍未写入 |
| pending / next condition | pass | §20~§21 |

### 21.2 范围与真实性自检

| 检查项 | 结果 |
|---|---|
| 未实现代码、未修改 source repo | pass |
| 未修改正式 `03-详细设计.md` | pass |
| 未定义 runtime execution、tools execution、marketplace listing、governance approval、method body、secret body truth | pass |
| 未伪造 commit、run_id、测试结果、evidence alias 或验收签署 | pass |
| 未创建 implementation ledger / planned boundary skeleton | pass;仅 `07-实施计划.md` 完成时允许创建 |
| 未提交 commit | pass;当前不需要提交 |

### 21.3 完成结论与停审

```text
step_status = completed_with_step_12_batch_12_6_reopen
completed_document = 03-详细设计.md
completed_step = Step 6 逐模块定义对象实现契约 + controlled reopens through Step 12 batch 12.6
formal_document_written = false
upstream_blocker = none
next_allowed_action = defer_to_project_execution_ledger_current_gate
commit_required = false
```

当前恢复纪律:

- Step 7 event-capture repository、snapshot / capture ID source及same-UoW / fake parity已完成既有回开；batch `9.11` pre-entry要求新增Job execution repository并由Step 7本轮受控回开承接。
- Step 9 batches `9.2 / 9.3 / 9.5 / 9.6 / 9.11-pre-entry / 9.11 / 9.12`对象回开均已闭合；Step 10 batches `10.0~10.4`的governance seam、identity / registry、descriptor / summary、exposure / visibility applicability、trace invariant与consumer-view typed partial / derived rebuild guard回开也已闭合；Step 12 batches `12.1 / 12.3 / 12.4 / 12.6`的error reachability、deterministic issue-ref primitive入口、Query degraded typed source与Job safe-terminalization分界均已闭合。`CapabilityReadDegradedReason` private inner field及3个callable、`CapabilityJobExecutionRecord`及全部support type / field / variant / payload / callable英文Rustdoc已审计完整,audit export rebuild与`EventCapture` source / prior-intent plan symmetry保持闭合。
- 当前文档/批次恢复点只读取`project_execution_ledger.md`与`03_ddd_calibration_flow.md`,不得从本Step历史回开顺序越过项目级评审门。
- Step 11 / 13继续承接physical transaction ordering / isolation与concurrent reentry / collision,但不得删除本Step已固定的journal recovery source或把未讨论细节伪装成已实现。

本Step全部受控回开修正已完成并作为active object baseline；正式`03-详细设计.md`仍不修改。
