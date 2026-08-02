# Step 6 回归 `6R-06`: 全域对象契约闭合审计

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-23
> 状态: `review_confirmed_consumed_by_6r_07`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游控制: `03_ddd_step_06_object_contracts_regression_control.md`
> 当前边界: `6R-06`全域closure audit已获用户确认并由`6R-07`消费；本文件只保留设计文本静态审计结论，不重写canonical object，不表示Step 7已开始或正式`03~07`有效。

---

## 1. 开工确认与恢复点

| 检查项 | 当前结论 |
|---|---|
| 用户是否确认 `6R-05` entry batch 3 | 是。当前这次“同意”只消费 batch 3 审查门禁，并授权进入一个下一批 `6R-06`。 |
| 当前文档 / Step | `03-详细设计.md` / Step 6 regression / `6R-06`。 |
| `6R-01~05` 效力 | 均为已审查 canonical 输入；`6R-05` application、infra、entry 三批均已确认。 |
| 本批允许修改什么 | 本 closure audit、Step 6 regression control、shared registry 的 review overlay、`03` flow、project ledger、implementation ledger。 |
| 本批禁止修改什么 | 已确认对象正文、正式 `03~07`、implementation boundary 状态与 skeleton、实现仓和代码。发现缺口只能登记 exact unresolved，并退回 owner 分件，不能在审计文件另造 schema。 |
| implementation 状态 | `CB-SBX-01A blocked / wait_design`；实现未开始。 |
| 是否发现新 L1 / L2 blocker | 当前没有。historical actor authority 冲突仍是 L4-sandbox Step 8 定向重验项。 |
| 本批完成后动作 | 停在 `6R-06 completed_wait_user_review`；用户确认前不得进入 `6R-07`。 |

当前恢复口径：

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-06
current_batch = 6R-06 full closure audit
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_07
upstream_6R_05 = review_confirmed
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## 2. 审计目标与判定边界

`6R-06` 不再增加对象能力，而是证明 `6R-01~05` 合并后具备唯一、完整、可供 Step 7 消费的
Step 6 truth source。审计必须回答以下问题：

1. 每个 current registry item 是否有唯一 canonical module、section 和 planned file owner。
2. 每个 current object 的 private field 是否有 exact type、正式来源、缺失行为和禁止派生路径。
3. 每个 factory 是否覆盖所有必填字段；系统生成、查表或派生字段是否有唯一正式 owner。
4. 每个 guard 是否有 exact input、output、owned error、snapshot dependency、纯度和 negative cut。
5. 每个 current transition / forward helper 是否有 exact callable、允许前态、结果状态和 owned error。
6. typed ref kind / wrapper、status owner、error owner和跨模块依赖方向是否唯一且无反向依赖。
7. historical Step 7~10 consumer 是否全部有 later rewrite owner，而没有被误当成 current contract。

判定语义：

| result | 含义 | 是否允许关闭 `6R-06` |
|---|---|---:|
| `closed` | exact identifier、owner、section与关系均可定位，差集为零。 | 是 |
| `historical_contained` | 旧声明仍保留用于差异审计，但已明确失效且不会进入 current registry。 | 是 |
| `downstream_revalidation_pending` | Step 7+ consumer 必须改写，但 Step 6 source 已闭合。 | 是 |
| `unresolved` | current owner、字段、factory、guard、transition、ref/status/error或依赖存在空缺/冲突。 | 否 |

`closed` 只表示设计文本静态闭合，不表示 Rust 代码存在、可编译、测试通过、provider 可用、runtime
运行、evidence 已形成或验收通过。

---

## 3. 权威输入与效力

| 输入 | 当前效力 | `6R-06` 使用方式 |
|---|---|---|
| 正式 `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | current reviewed upstream | 只核对 Sandbox 职责、五条能力、安全红线和依赖边界；不反向增加对象。 |
| `03_ddd_step_04_file_layout.md` | reviewed + targeted `refs.rs` writeback | planned crate、file path、Cargo依赖和禁止新增 module 的唯一输入。 |
| `03_ddd_step_05_module_contracts.md` | reviewed unaffected input | 七模块 owner 与允许/禁止依赖的唯一输入。 |
| `03_ddd_step_06_object_contracts_shared_types.md` | reviewed shared truth | 69 个 registry row、52 typed refs、39 shared status owner和error layering入口。 |
| `6R-02` context/boundary 分件 | review confirmed | context、identity、boundary、handle、guard和两个 public view canonical 输入。 |
| `6R-03` policy/run/capture 分件 | review confirmed | policy、run、capture、handoff、guard和view canonical 输入。 |
| `6R-04` failure/cleanup/read 分件 | review confirmed and consumed | failure、control、cleanup、redline、read/projection、audit/relay/report canonical 输入。 |
| `6R-05` application/infra/entry 分件 | review confirmed | non-core stable carrier、adapter outcome与entry error canonical 输入。 |
| 原 Step 7~10 | historical reviewed, revalidation pending | 只扫描 consumer 名称、签名和状态冲突；不得据此反向改写 Step 6。 |
| `/tmp/L4-sandbox_03_step06_step10_granularity_review_and_completion_plan.md` | temporary audit source | 提供 P0/P1 问题与 closure dimensions；长期结论必须落在本文件和三层台账。 |

### 3.1 Historical material 处理规则

- 原 `03_ddd_step_06_object_contracts.md`、各分件明确标记的 historical draft / snapshot、原 Step 7~10
  只能出现在差异与 later rewrite ledger 中。
- historical declaration 与 current declaration同名时，不计算为第二 canonical owner；但若没有显式
  `historical` / `superseded` / `invalid` 标记，则必须记为 duplicate unresolved。
- registry 中的 canonical location 与 owning module具有最终解释权；跨分件展示 contracts-owned
  support schema只说明业务消费关系，不授予 domain 第二 declaration owner。
- 发现 current 缺口时，本文件只记录 blocker和owner，不补造 object、field、method、status或error。

---

## 4. 审计批次与停止规则

| batch | 审计范围 | 当前状态 | 完成门禁 |
|---|---|---|---|
| `6R06-A` | registry、canonical owner、planned path、module dependency | completed | 69/69 row连续唯一；36/36 current owner path命中planned tree；反向依赖0。 |
| `6R06-B` | field source、factory required-field、Rustdoc与serialization | completed | current review unit差集0；必填字段无隐式来源；checked deserialize 3/3。 |
| `6R06-C` | 12类 guard exact contract与安全负向切口 | completed | 12/12 guard的input/output/error/snapshot/purity/negative cut均闭合。 |
| `6R06-D` | transition/helper、status与error join | completed | 20/20 mutable owner、19/19 non-mutable owner、10/10 forward helper与owner error闭合；current幽灵trigger为0。 |
| `6R06-E` | typed ref、跨模块依赖、historical consumer与下游overlay | completed | 52/52 kind/wrapper、39/39 status、4/4 historical consumer与11/11 boundary overlay闭合，越界0。 |
| `6R06-F` | 全文静态复核与本批门禁 | completed | 17/17检查族闭合；contract unresolved为0，8/8恢复源一致，implementation继续冻结。 |

任何 batch 出现 unresolved 时立即停止后续关闭动作，写明 exact identifier、owner和退回位置。
只有 `6R06-A~F` 全部闭合，才允许把本文件标记为 `completed_wait_user_review`；即使通过，也不自动
进入 `6R-07`。

---

## 5. Registry 全域边界

shared registry 的 current row 集合固定如下：

| registry family | expected IDs | expected rows | canonical owner source |
|---|---|---:|---|
| core reuse | `S6T-CORE-001~004` | 4 | `core_contracts` export + shared §7/§8.2 |
| Sandbox shared | `S6T-SH-001~010` | 10 | `crates/contracts/src/refs.rs` / `metadata.rs` + shared §8.2/§9~10 |
| context / boundary | `S6T-02-001~017` | 17 | `6R-02` + shared §8.3 |
| policy / run / capture | `S6T-03-001~012` | 12 | `6R-03` + shared §8.4 |
| failure / cleanup / read | `S6T-04-001~015` | 15 | `6R-04` + shared §8.5 |
| non-core | `S6T-05-001~011` | 11 | `6R-05` + shared §8.6 |
| **total** | six disjoint ID families | **69** | shared registry is the only master index |

协议 DTO、page、event payload和job spec不进入这69行 current Step 6 registry；它们由回归后的 Step 8
逐协议定义。repository / port、handler和adapter callable也不进入对象 registry，由 Step 7定义。
这种 defer 不允许缺失它们必须消费的 Step 6 carrier。

---

## 6. `6R06-A` Registry / owner / dependency 审计

### 6.1 审计方法

1. 从 shared §8.2~§8.6提取 registry ID，按family排序，比较 expected连续区间。
2. 对每行核对 canonical type、category、module、location和current state均非空。
3. 从 `6R-02~05` canonical inventory和正文定位唯一 section；明确标记的 historical snapshot排除。
4. 将 owner path与Step 4 planned tree求差集；不允许 `kinds.rs/status.rs/states.rs/markers.rs` 等未规划路径。
5. 将 owner module与Step 5 dependency matrix对照；contracts public field不得依赖domain-only type，domain不得依赖application/infra/entry。

### 6.2 已复跑的局部分域证据

`6R-04 batch 7` 静态脚本已在当前文件内容上重新执行，结果如下：

| check | expected | actual | unresolved |
|---|---:|---:|---:|
| named review units | 28 | 28 | 0 |
| support families | 13 | 13 | 0 |
| `S6T-04-*` registry | 15 | 15 | 0 |
| shared status owner | 39 | 39 | 0 |
| typed ref kind / wrapper | 52 / 52 | 52 / 52 | 0 |
| reconciliation error owner | 21 | 21 | 0 |
| `6R-04` forward helper | 10 | 10 | 0 |
| planned contracts path | 10 | 10 | 0 |
| source owner | 28 | 28 | 0 |
| Rustdoc / fence | 0 missing | 0 missing | 0 |
| downstream overlay | 11 | 11 | 0 |
| script failures | 0 | 0 | 0 |

该复跑只证明 `6R-04` 分域在 `6R-05` 后没有回归，不替代 `6R-02/03/05` 和跨分域审计，也不表示
代码或测试结果。

### 6.3 全域结果

| audit ID | check | result | exact unresolved / evidence |
|---|---|---|---|
| `6R06-A-001` | 69 registry ID连续、唯一 | closed | `CORE 4 + SH 10 + 02 17 + 03 12 + 04 15 + 05 11 = 69`；missing / duplicate均0。正文后续overlay引用不计master row。 |
| `6R06-A-002` | row六列非空、canonical state非pending | closed | 69/69 row的ID、type、category、module、location、state均非空；current state无`pending/not_started/unresolved`。 |
| `6R06-A-003` | canonical section唯一、historical duplicate contained | closed | `6R-02` 24/24、`6R-03` 24/24、`6R-04` 41/41 review unit及`6R-05`三批owner表均有唯一current section；旧草稿、快照、旧Step 7~10均显式historical / invalidated。 |
| `6R06-A-004` | owner path命中Step 4 planned tree | closed | 五份current分件提取36个Sandbox owner path，36/36命中Step 4目录树或职责表；上游`quantalithos-core/crates/contracts/src/actor.rs`不是L4 owner。 |
| `6R06-A-005` | module owner命中Step 5 dependency matrix | closed | 七模块7/7命中；contracts/domain/application/infra/entry owner均未跨越§9.7允许方向。 |
| `6R06-A-006` | contracts public field反向domain依赖 | closed | 反向依赖0；`6R-03`十组view support carrier已迁至contracts，public view只消费contracts/core type。 |
| `6R06-A-007` | unplanned current module / path | closed | 新增planned path 0；`kinds.rs/status.rs/states.rs/markers.rs`及同名namespace命中0。 |

`36`表示本轮从current Step 6分件提取的Sandbox source owner路径集合，不是Step 4全仓文件总数，也不包含
上游core源文件、未来Step 8协议DTO文件引用或historical invalid path。路径审计同时确认
`worker_runtime.rs`、`jobs/src/lib.rs`、各entry `errors.rs`和`api/routes.rs`均已存在于Step 4树中，不能被实现者
误读为本批新增generic module。

---

## 7. `6R06-B` Field / factory / serialization 审计

### 7.1 Review-unit覆盖口径

| current分域 | review unit / family | 字段来源审计 | factory / callable审计 | 本批结论 |
|---|---:|---|---|---|
| shared / core | 14 registry row + 52 named ref wrapper + shared carrier/kind/status/error | constructor输入、core复用、body-free来源与wrong-kind关系均有owner | shared `try_new` / set validator / conversion rule闭合 | closed |
| context / boundary | 24/24 canonical unit | §22.2五组字段来源覆盖trusted input、body-free adapter、committed relation、clock/id/audit | §22.1逐unit factory/member/error，§22.3状态/transition闭合 | closed |
| policy / run / capture | 24/24 canonical unit | policy snapshot、run lineage、capture/material/handoff与两个view source逐组闭合 | object batch 2~6 + batch 7 audit；guard与aggregate factory无placeholder | closed |
| failure / cleanup / read | 28 named + 13 support = 41/41 | batch 2~6逐object field-source、same-snapshot、cursor、audit/relay/report关系闭合 | 10/10 forward helper及各object exact constructor/transition闭合 | closed |
| application | 8/8 current family | context、idempotency、stored surface、outcome/access/error/maintenance均有authoritative source | 6 context factory、7 outcome factory、maintenance checked carrier；unchecked path 0 | closed |
| infra | 7 object family | 18-slot binding、availability、三类adapter outcome、application port result与error逐字段闭合 | 18/18 adapter kind、2/2 activation、18/18 availability与三组finite outcome converter | closed |
| API / worker / jobs | 13 constructor/accessor family | entry field-source矩阵16/16；actor/channel/selector/status/error来源明确 | 13/13 constructor-validator-accessor/move family；unchecked path 0 | closed |

这里的review unit不是Rust type总数。一个registry row可以拥有多个同一capability family内的support
type；判定条件是每个support type都位于owning canonical section并被该unit的字段/factory/error审计覆盖，
而不是人为给每个embedded enum再造repository identity。

### 7.2 字段来源与必填字段闭合

| 字段来源类别 | current允许来源 | factory必须证明 | missing / invalid行为 | 禁止替代 | result |
|---|---|---|---|---|---|
| trusted caller / entry | 已验证actor、metadata、selector、explicit requirement、typed ref | 非空、kind/channel/authority、closed selector与lineage | owning constructor typed error；不得默认补值 | route/topic/binary name、display role、正文 | closed |
| generated identity | application/entry预生成named ref、core `JobRunId`、repository version owner | exact named kind、identity不碰撞、relation一一对应 | `ContractError`或object-owned relation error | ref字符串拼接、random retry identity、第二outcome ref | closed |
| body-free adapter/resolver | typed external ref、safe summary、finite outcome/observation | source kind、generation、target/attempt、status/reason关系 | pending/fail-closed/typed adapter mapping；不保存raw cause | SDK/HTTP/SQL文本、host/path/topic、secret/body | closed |
| committed owner relation | exact object ref/version/cursor/audit、same-snapshot group | owner status、generation、cardinality、expected version与cursor family | mismatch / missing为owned error或degraded surface，不scan latest | status猜测、latest scan、query repair、count truth | closed |
| clock / elapsed | clock port给出的`Timestamp`及成对checked elapsed | canonical timestamp、单调顺序、activation/source time fence | owned timestamp error；不得重算成fresh bool | system clock读取、字符串时间比较、caller freshness bool | closed |
| validated config/profile | versioned profile/template与18-slot activation/binding | complete coverage、same generation、non-empty marker和hard redline | startup blocked或typed config relation error | weak default、optional required slot、raw config字段 | closed |
| finite derived value | owning object根据typed input穷尽match派生status/kind/reason/count | closed enum coverage、ordered-unique、overflow/cardinality | relation error或explicit rejected/pending decision | wildcard、free text、外部status code、flat counter第二真相 | closed |

所有persisted/public/private必填字段均落入上述七类之一。`Option<T>`只表达canonical absence；它不能被
用作“实现者以后再补”的placeholder。集合空值、缺项、重复、顺序和互斥关系均由owning constructor定义；
factory required-field差集为0。

### 7.3 Construction、serialization与Rustdoc门禁

| audit ID | current check | result | exact evidence / limitation |
|---|---|---|---|
| `6R06-B-001` | private field存在unchecked public struct literal / setter | closed | current carrier均以private field + checked factory/accessor/move表达；unchecked path 0。 |
| `6R06-B-002` | factory覆盖全部必填字段 | closed | 六分域closure表无未分配field；system generated / lookup / derived字段均有唯一owner。 |
| `6R06-B-003` | checked deserialize | closed | application persisted carriers 3/3通过private wire回到唯一validator/constructor，拒绝unknown field。其余domain truth不开放arbitrary aggregate deserialize。 |
| `6R06-B-004` | transient carrier被误持久化/serde | closed | API/worker/jobs、infra outcome、guard decision等均标明transient/embedded；public DTO schema留Step 8，不复制private shape。 |
| `6R06-B-005` | Rustdoc missing | closed | 已确认分域静态审计的type/callable/variant/named/payload field差集均0；本批不把historical-invalid片段当current contract。 |
| `6R06-B-006` | body/raw cause进入field | closed | current domain/view/application/entry raw body slot为0；infra raw cause只限adapter内部受控诊断，不进入stable carrier。 |

`checked deserialize 3/3`不是要求所有object都实现Serde。domain truth、guard、decision与entry transient object
只有在Step 7/8/11明确持久化或协议需要时才可增加wire representation；新增wire shape必须回到其owner factory，
不得让serde绕过private invariant。

---

## 8. `6R06-C` Guard exact contract 审计

### 8.1 Guard inventory与owner

| guard | canonical owner / section | strict / bind entry | typed output | owned error |
|---|---|---|---|---|
| `ExternalBodyExclusionGuard` | `domain::guards`;`6R-02` §13.2 | `try_strict` | `ExternalBodyExclusionDecision` | `ExternalBodyExclusionGuardError` |
| `ControlledExecutionIntakeGuard` | `domain::guards`;`6R-02` §13.4 | `try_new` | `IntakeGuardDecision` | `ControlledExecutionIntakeGuardError` |
| `BoundaryCoherenceGuard` | `domain::guards`;`6R-02` §19.2 | `try_strict` | `BoundaryCoherenceDecision` | `BoundaryCoherenceGuardError` |
| `BackendCapabilityGuard` | `domain::guards`;`6R-02` §19.4 | `bind` | `BackendCapabilityDecision` | `BackendCapabilityGuardError` |
| `PolicyApplicabilityGuard` | `domain::policy_decision`;`6R-03` §11.4 | `bind` | `PolicyApplicabilityDecision` | `PolicyApplicabilityGuardError` |
| `FailClosedPolicyGuard` | `domain::policy_decision`;`6R-03` §12.4 | `bind_strict` | `FailClosedPolicyDecision` | `FailClosedPolicyGuardError` |
| `CaptureCompletenessGuard` | `domain::capture`;`6R-03` §18.2 | `bind` | `CaptureCompletenessDecision` | `CaptureCompletenessGuardError` |
| `HandoffOwnershipGuard` | `domain::handoff`;`6R-03` §21.2 | `bind_capture_source` / `bind_terminal_source` | `HandoffOwnershipDecision` | `HandoffOwnershipGuardError` |
| `ControlConflictGuard` | `crates/domain/src/control.rs`;`6R-04` §12.2 | `strict` / `bind_strict` | `ControlConflictDecision` | `ControlConflictGuardError` |
| `CleanupSafetyGuard` | `crates/domain/src/cleanup.rs`;`6R-04` §14.1 | `strict` | `CleanupSafetyDecision` | `CleanupSafetyGuardError` |
| `RedlineContainmentGuard` | `crates/domain/src/redline.rs`;`6R-04` §14.3 | `strict` / `bind_strict` | containment decision + release decision | `RedlineContainmentGuardError` |
| `DerivedReadOnlyGuard` | `crates/domain/src/projection.rs`;`6R-04` §15.5 | `strict` | checked `Result<(), ...>` | `DerivedReadOnlyGuardError` |

`ExternalBodyExclusionGuard`、`BackendCapabilityGuard`与`PolicyApplicabilityGuard`不是HLD九类guard的alias或
可删除helper。它们分别拥有正文排除、backend exact capability和policy snapshot applicability的独立输入与
失败语义；合并会丢失decision lineage。12类guard均有且只有一个current struct、impl和owned error declaration。

### 8.2 Exact input / snapshot / output矩阵

| guard | exact evaluate input | immutable snapshot / binding | output / expected rejection | purity boundary |
|---|---|---|---|---|
| external body exclusion | context ref + checked forbidden marker set + clock time | 12/12 blocked marker rules + activation time | empty=`Clear`;non-empty=`Rejected`；checked input下evaluate不返回error | 不读正文/repository/resolver；不丢marker |
| controlled intake | pending context + execution/reference resolution + exact exclusion decision + time | required source kinds + exclusion guard ref + activation | `Accepted | PendingResolution | Rejected`；relation damage为error | 不解析/刷新source，不启动boundary/backend |
| boundary coherence | immutable complete requirement + time | canonical 10-kind coverage + activation | `Coherent | Rejected`；缺信息不能成为Pending | 不调用capability/backend/policy，不改requirement |
| backend capability | exact requirement + exact capability + checked age + time | requirement/capability refs + generation + activation | `Supported | Pending | Unsupported`；binding/coverage damage为error | 不refresh、不调用backend、不接受fresh bool |
| policy applicability | exact policy snapshot + checked age + time | snapshot/requirement/boundary/generation/source requirements | `Applicable | Pending | FailClosed` | 不读policy source/repository，不做timestamp arithmetic |
| fail-closed policy | pre-generated decision ref + snapshot + applicability + complete action decisions + time | snapshot/requirement/boundary/handle/generation | accepted/rejected/blocked/pending/fail-closed aggregate | 不接受config fallback，不自行authorization |
| capture completeness | body-free collection candidate + time | completed run/capture/lineage + minimum material requirements + reason catalog | complete/partial/failure decision；candidate damage为error | 不物化material/fact，不读body/repository/adapter |
| handoff ownership | complete target plan + time | capture或terminal source、material keys、run/generation、reason catalog | `Allowed | Rejected`；预期ownership violation保存为Rejected | 不调用handoff adapter，不创建progress，不判断下游truth |
| control conflict | incoming typed intent + exact existing facts + time | strict conflict rules + terminal kinds + activation | Accept/Duplicate/Conflict/TerminalOverride decision | 纯过滤/排序；不创建fact、不触发runtime/cleanup |
| cleanup safety | evidence + optional orphan + complete redline coverage/rows + investigation + time | nine hard rules + reason catalog + activation | Allowed/PendingEvidence/Blocked decision；malformed relation为error | 不release backend，不推进truth，不调用investigation |
| redline containment | checked signal，或HandoffPending containment + exact preservation/observation + time | nine security rules + five investigation requirements + reason catalog | detection decision；`KeepPending | ReleaseCleanupBlock | MakeTerminal` release decision | 不终止run、不load latest、不调用handoff/investigation |
| derived read-only | authorization + source refs + target derived ref + finite kind + time | allowed read kinds + activation | `Ok(())`仅证明no-write资格；violation为typed error | 不开UoW、不改source/state/projection/core truth |

所有guard的`Timestamp`均由application clock显式传入；需要freshness的guard消费与time同一次clock observation
产生的checked elapsed，不在domain解析timestamp。guard中的snapshot是immutable rule/binding或body-free evidence，
不是repository snapshot句柄、配置body或external payload。

### 8.3 Owned error与negative cut矩阵

| guard | owned error覆盖 | mandatory negative cut | forbidden fallback | result |
|---|---|---|---|---|
| external body exclusion | empty/duplicate/incomplete rule coverage | 任一marker非空必须Rejected | debug/local profile降级warning；future variant wildcard allow | closed |
| controlled intake | context/status/ref/source/guard/time mismatch | rejection优先于pending，pending优先于accepted | unknown/default accepted；request内嵌guard body | closed |
| boundary coherence | duplicate/missing kind、coverage、time | 任一跨维hard conflict即Rejected | weak backend或后序policy覆盖requirement冲突 | closed |
| backend capability | ref/generation/coverage/time mismatch | stale/unknown/expired均Pending，unsupported明确拒绝 | host-run、weak backend、caller freshness bool | closed |
| policy applicability | snapshot/source/status/window/time/decision relation | stale/conflicted/unsupported与unavailable gap fail-closed | 旧accepted decision复用、allow-on-missing | closed |
| fail-closed policy | lineage/applicability/action coverage/time/aggregate relation | applicability先决；Denied/Blocked/Pending固定优先级 | caller status、profile bool、`_ => Accepted` | closed |
| capture completeness | run/lineage/candidate/gap/count/time/decision relation | failed/unavailable仍形成body-free formal capture outcome | raw output/body推status、缺material默认complete | closed |
| handoff ownership | source lineage/bound/source identity/decision/time relation | target/selection/source/coverage按固定优先级Rejected | EventRelay/Other target、formal truth/evidence身份进入plan | closed |
| control conflict | target/source/rule/existing/relation/time | Other typed reject；duplicate不得二次effect；terminal不可时间覆盖 | status text、slice顺序、caller bool决定disposition | closed |
| cleanup safety | evidence/coverage/orphan/investigation/rule/time/decision relation | unknown release、active/terminal redline、failed orphan保持blocked | operator flag、accepted investigation替代release proof | closed |
| redline containment | strict set/signal/lineage/preservation/observation/release relation | 合法signal无advisory分支；pending investigation不解除block | severity/config关闭、reason反推kind、latest handoff scan | closed |
| derived read-only | read/write kind、source/target/time relation | core truth write target立即拒绝；只允许Inspect/Preview/Trend | query UoW、config扩write target、guard拒绝转core failure | closed |

Guard全域结论为`12 expected / 12 canonical / 12 exact contract / 0 unresolved`。这只证明设计文本足以让
Step 7定义loader/port和service sequencing；不表示guard代码已实现、规则已运行或negative test已通过。

---

## 9. `6R06-D` Transition / helper / status / error join

### 9.1 Status 主语筛选与计数口径

shared §12 的39个status owner不能机械等同于39个状态机。按current对象正文逐项筛选后分为三类：

| status class | owner count | 判定规则 | Step 10义务 |
|---|---:|---|---|
| mutable lifecycle truth | 20 | 对象保存current status，并有exact mutating method或checked replacement application。 | 为每个owner重写from/to、trigger、proof、field effect和object-owned error。 |
| immutable snapshot / decision / fact | 13 | status由named factory、guard、draft finalization或replacement factory一次定格；旧实例不迁移。 | 列入“非状态机有限状态主语”，不得伪造update/rerun transition。 |
| visible / public / transient surface | 6 | status由committed source、application outcome或entry mapper派生，不拥有domain lifecycle。 | 只写cross-owner mapping和no-write/no-reverse-transition约束。 |
| **total** | **39** | 每个shared enum恰好归入一类。 | 不允许为统一计数合并或新增全局状态机。 |

这三个分类回答的是“enum由什么主体拥有、能否迁移”，不是文件布局分类。`RuntimeConfigStatus`虽然由
infra summary携带，也属于immutable replacement result：`evaluate_disposition(&self)`返回新的
`Result<Self, InfraError>`，不能把旧candidate从`StartupBlocked`改回`Valid`。`SandboxAuditTraceStatus`
同样不是四态mutable lifecycle；current durable row只能是`Linked`，其余三个值只作draft或historical
migration rejection。relay delivery必须由`SandboxEventRelayStatus`独立拥有。

### 9.2 Mutable lifecycle owner join

| # | status owner | canonical factory / initial state | exact mutating surface | exact owner error | result |
|---:|---|---|---|---|---|
| 1 | `ControlledExecutionContext` / `ControlledExecutionIntakeStatus` | `open_pending -> PendingResolution` | `accept`;`mark_unresolved`;`record_partial_resolution`;`resume_resolution`;`reject`;`close` | `ControlledExecutionContextError` | closed |
| 2 | `ExecutionEnvironmentIdentity` / `ExecutionEnvironmentIdentityStatus` | `bind -> Active` | `close`;`invalidate` | `ExecutionEnvironmentIdentityError` | closed |
| 3 | `ReferenceResolutionState` / `ReferenceResolutionStateStatus` | `track_resolved`, `track_non_resolved` | `mark_stale`;`apply_resolution` | `ReferenceResolutionStateError` | closed |
| 4 | `CoherentBoundary` / `CoherentBoundaryStatus` | `require -> Required` | `record_pending_capability`;`record_rejected`;`record_established`;`record_establishment_failed`;`mark_failed`;`mark_released` | `CoherentBoundaryError` | closed |
| 5 | `IsolationEnvironmentHandle` / `IsolationEnvironmentHandleStatus` | `create -> Created` | `activate`;`mark_release_pending`;`mark_released`;`suspect_orphan` | `IsolationEnvironmentHandleError` | closed |
| 6 | `ControlledExecutionRun` / `ControlledExecutionRunStatus` | `prepare -> Preparing` | `mark_running`;`mark_completed`;`mark_failed`;`terminate_by_control`;`terminate_by_redline` | `ControlledExecutionRunError` | closed |
| 7 | `CapturedMaterialRef` / `CapturedMaterialStatus` | `from_candidate -> Captured` | `mark_handoff_pending`;`mark_handoff_failed`;`mark_handoff_accepted`;`mark_retention_blocked` | `CapturedMaterialError` | closed |
| 8 | `ObservabilityMaterial` / `ObservabilityMaterialStatus` | `prepare_from_terminal_run -> Prepared` | `mark_handoff_pending`;`mark_handoff_failed`;`mark_handoff_recorded` | `ObservabilityMaterialError` | closed |
| 9 | `HandoffTargetProgress` / `HandoffTargetProgressStatus` | `pending_for_target -> Pending` | `begin_attempt`;`apply_observation` | `HandoffTargetProgressError` | closed |
| 10 | `HandoffFact` / `HandoffFactStatus` | `open`从全Pending progress派生aggregate | `begin_target_attempt`;`apply_target_observation`;`mark_blocked_by_cleanup_guard`;`clear_cleanup_guard_block` | `HandoffFactError` | closed |
| 11 | `FailureClassification` / `FailureClassificationStatus` | `pending`, `classify`, `from_policy_decision`, `from_capture` | `classify_pending`;`mark_terminal`;`supersede_by_control`;`supersede_by_redline` | `FailureClassificationError` | closed |
| 12 | `ControlFact` / `ControlFactStatus` | `accept`, `duplicate`, `conflict` | `mark_completed`;`mark_failed`;`attach_failure` | `ControlFactError` | closed |
| 13 | `LeaseRecord` / `LeaseRecordStatus` | `open -> Active` | `mark_expiring`;`mark_expired`;`mark_orphan_suspected`;`mark_released` | `LeaseRecordError` | closed |
| 14 | `OrphanRecoveryRecord` / `OrphanRecoveryRecordStatus` | `suspect -> Suspected` | `confirm`;`mark_recovering`;`mark_recovered`;`mark_failed` | `OrphanRecoveryRecordError` | closed |
| 15 | `CleanupGuard` / `CleanupGuardStatus` | `open`从strict decision定格初态 | `apply_decision`;`authorize_release_for`;`record_release_failure`;`settle_release_confirmation` | `CleanupGuardError` | closed |
| 16 | `RedlineContainment` / `RedlineContainmentStatus` | `detect -> Detected` | `mark_contained`;`mark_handoff_pending`;`refresh_preservation_snapshot`;`record_investigation_observation`;`release_cleanup_block`;`mark_terminal` | `RedlineContainmentError` | closed |
| 17 | `SandboxReadProjection` / `SandboxReadProjectionStatus` | `create | create_unavailable` | `mark_stale`;`start_rebuild`;`finish_rebuild`;`mark_degraded`;`mark_unavailable` | `SandboxReadProjectionError` | closed |
| 18 | `DerivedInspectPreviewTrendState` / `DerivedInspectPreviewTrendStatus` | `from_sources | unavailable_from_sources` | `mark_stale`;`start_rebuild`;`finish_rebuild`;`mark_failed`;`mark_unavailable` | `DerivedInspectPreviewTrendStateError` | closed |
| 19 | `SandboxEventRelayRecord` / `SandboxEventRelayStatus` | `SandboxEventRelayDraft::finalize_* -> Pending` | `begin_publish_attempt`;`apply_delivery_observation`;`dead_letter_retry_exhausted`;`record_integrity_failure` | `SandboxEventRelayRecordError` | closed |
| 20 | `SandboxIdempotencyRecord` / `SandboxIdempotencyRecordStatus` | `reserve -> Reserved` | `mark_completed`;`mark_failed` | `ApplicationError` / `SandboxApplicationError` | closed |

`record_partial_resolution`保持`PendingResolution`但更新exact resolution/audit relation，
`refresh_preservation_snapshot`和`record_investigation_observation`保持`HandoffPending`但替换matching
evidence，`begin_publish_attempt`保持`Pending | Retryable`但建立持久化active attempt。这些是有字段副作用的
self-transition/helper，必须进入Step 10/11并发与版本审计，不能因status不变而从callable清单删除。

### 9.3 Immutable snapshot / decision / fact owner join

| # | status owner | exact construction source | immutability / replacement rule | exact owner error | result |
|---:|---|---|---|---|---|
| 1 | `ExecutionContextResolutionStatus` | `resolved`, `partial`, `unresolved`, `conflicted` | 每次评估生成新`ExecutionContextResolutionRef`；无update。 | `ContextResolutionError` | closed |
| 2 | `ContextReferenceResolutionStatus` | `complete`, `stale`, `unavailable`, `invalid` | resolver刷新生成新snapshot；旧snapshot不改。 | `ContextResolutionError` | closed |
| 3 | `BoundaryEstablishmentDecisionStatus` | 五个status-specific decision factory | 一个attempt immutable；retry使用新decision ref。 | `BoundaryEstablishmentDecisionError` | closed |
| 4 | `BackendCapabilitySummaryStatus` | `fresh`, `stale`, `unknown`, `unsupported` | capability refresh生成新summary ref。 | `BackendCapabilitySummaryError` | closed |
| 5 | `PolicyApplicabilityStatus` | 五个snapshot-specific factory | source刷新生成新snapshot；checked age只影响使用资格。 | `PolicyApplicabilitySnapshotError` | closed |
| 6 | `PolicyExecutionDecisionStatus` | `from_guard_decisions` | formal decision immutable；重新裁定使用新decision ref。 | `PolicyExecutionDecisionError` | closed |
| 7 | `HighRiskActionDecisionStatus` | `decide`逐marker机械定格 | action decision immutable，无caller status override。 | `HighRiskActionDecisionError` | closed |
| 8 | `CaptureFactStatus` | `CaptureFact::record`复制completeness decision | capture fact immutable；后续handoff不回写capture status。 | `CaptureFactError` | closed |
| 9 | `SandboxReconciliationReportStatus` | report draft从basis/coverage/finding唯一派生后`finalize_committed` | report immutable；replacement生成新report group。 | `SandboxReconciliationReportError` | closed |
| 10 | `SandboxAuditTraceStatus` | audit draft三个`finalize_*`或checked `rehydrate`固定为`Linked` | durable row append-only；`Recorded/RelayPending/RelayFailed`不允许current rehydrate。 | `SandboxAuditTraceError` | closed |
| 11 | `SandboxStoredOperationResultStatus` | `SandboxStoredOperationResult::try_new`冻结完整surface | 三种完整surface均immutable replay；不存在`Unavailable` row。 | `ApplicationError` / `SandboxApplicationError` | closed |
| 12 | `AdapterAvailabilityStatus` | `AdapterAvailabilityState::try_for_binding` | 每次checker observation形成新state；不授权business allow。 | `InfraError` | closed |
| 13 | `RuntimeConfigStatus` | `from_validated_snapshot`；`evaluate_disposition(&self) -> Self` | replacement factory，不修改旧candidate；LD-24 publication另有owner。 | `InfraError` | closed |

`CapturedMaterialStatus`和`ObservabilityMaterialStatus`不在此表，因为它们有current mutable transition；
`CaptureFactStatus`在此表，因为material/handoff推进不能反向改写capture。`SandboxAuditTraceStatus`的四个
shared variant也不构成四态状态机：current durable invariant严格为`Linked`。

### 9.4 Visible / public / transient status join

| status owner | exact producer | persisted boundary | prohibited reverse effect | result |
|---|---|---|---|---|
| `SandboxExecutionVisibleStatus` | `SandboxExecutionStatusView::from_*_snapshot`从完整committed source按优先级派生 | view可持久化，但status不是core truth | 不得从visible status推进context/boundary/run/capture | closed |
| `VisiblePolicyDecisionStatus` | `PolicyDecisionSummaryView::visible_status`一一映射formal decision | view/read surface | 不得授权policy或launch | closed |
| `SandboxQuerySurfaceStatus` | access-first query reader + view/source assembly | response/cacheable output，不作为truth row | 不得触发refresh/rebuild/repair/UoW | closed |
| `SandboxCommandResultStatus` | Step 8 mapper消费validated application outcome + stored result | 完整stored command surface字段 | `DuplicateReplayed`只回放原surface，不重跑mutation | closed |
| `SandboxConsumerReceiptStatus` | `SandboxConsumerReceipt::from_application_outcome`穷尽关系 | replay需要时保存完整receipt | 不得把receipt当consumer processing state machine | closed |
| `SandboxJobReportStatus` | accumulator `fresh_report_status`或checked duplicate exit factory | 保存完整report后才可replay | 不得从count随意选status，不得生成job runner lifecycle | closed |

`EntryDisposition`不是39个status owner之一，也不持久化。它只由API/worker/jobs checked mapper派生，不能
替代command result、consumer receipt或job report status。

### 9.5 Cross-object forward helper join

| # | exact helper | checked input / output | consuming transition | owned failure | result |
|---:|---|---|---|---|---|
| 1 | `LeaseRecord::supports_orphan_suspicion_for(&IsolationEnvironmentHandleRef) -> bool` | exact handle relation；mismatch安全false | `IsolationEnvironmentHandle::suspect_orphan` | consumer再返回`IsolationEnvironmentHandleError` | closed |
| 2 | `FailureClassification::blocks_boundary_for(&CoherentBoundaryRef, &IsolationEnvironmentHandleRef) -> bool` | exact boundary/handle relation | `CoherentBoundary::mark_failed` | consumer再返回`CoherentBoundaryError` | closed |
| 3 | `CleanupGuard::permits_release_for(context,boundary,handle,lease) -> bool` | exact release target relation | handle进入`ReleasePending` | consumer再返回`IsolationEnvironmentHandleError` | closed |
| 4 | `CleanupGuard::permits_context_closure_for(context,coverage,redlines) -> Result<bool, CleanupGuardError>` | fresh complete redline coverage | context / identity close | `CleanupGuardError` | closed |
| 5 | `LeaseRecord::require_active_for_handle(handle,checked_age) -> Result<NonZeroU64, LeaseRecordError>` | active exact lease + positive remaining window | run prepare/authorize | `LeaseRecordError` | closed |
| 6 | `FailureClassification::require_run_failure_basis(run,context,boundary,handle)` | matching formal failure relation | run `mark_failed` | `FailureClassificationError` | closed |
| 7 | `ControlFact::require_run_termination_basis(run,context,handle)` | matching accepted/terminal control relation | run `terminate_by_control` | `ControlFactError` | closed |
| 8 | `RedlineContainment::require_run_termination_basis(run,context,boundary,handle)` | active-run redline relation | run `terminate_by_redline` | `RedlineContainmentError` | closed |
| 9 | `CleanupGuard::require_handoff_block(handoff,context,run)` | active cleanup block observation | handoff `mark_blocked_by_cleanup_guard` | `CleanupGuardError` | closed |
| 10 | `CleanupGuard::require_handoff_unblocked(handoff,context,run)` | exact no-longer-blocked proof | handoff `clear_cleanup_guard_block` | `CleanupGuardError` | closed |

bool helper只用于关系不匹配时保守拒绝；它们不能替代返回typed basis的五个helper，也不能由caller
比较status重新计算。10/10 helper在`6R-04` owning section有唯一声明，consumer签名在`6R-02/03`可定位。

### 9.6 Historical trigger 与 current callable difference

| historical trigger / error | current事实 | later rewrite owner | disposition |
|---|---|---|---|
| `ControlledExecutionContext::mark_unresolved(reason)` | callable存在，但current exact input为`ExecutionContextResolution + IntakeGuardDecision + audit ref + changed_at` | Step 10逐参数重写 | `historical_contained / signature_rewrite_pending` |
| `HandoffFact::dead_letter(reason)` | current无此aggregate方法；target通过`begin_target_attempt + apply_target_observation`推进，aggregate机械derive且无DeadLetter variant | Step 10 handoff matrix | `historical_contained / ghost_removed` |
| `SandboxReadProjection::rebuild_from_truth(...)` | current无此方法；必须`start_rebuild(attempt)`后`finish_rebuild(completion)` | Step 9 maintenance flow + Step 10 projection matrix | `historical_contained / ghost_removed` |
| `SandboxJobReportAccumulator::finish_report(report_ref)` | current无此方法；accumulator只派生fresh status，`SandboxJobExitDisposition::finish_fresh`消费完整stored outcome/status/time | Step 7 jobs adapter + Step 9 job flow + Step 10 non-state surface | `historical_contained / ghost_removed` |
| `IsolationBackendAdapterOutcome::to_boundary_decision_status()`及同类`to_handoff_status/to_relay_status` | current converter只形成typed application/domain observation；status由owner factory/application method推进 | Step 7/9/10 | `historical_contained / shortcut_removed` |
| `DomainError::InvalidStateTransition` | current object正文只把它列为historical-invalid；所有transition返回object-owned error | Step 10/12 | `historical_contained / generic_error_removed` |

historical Step 10中`DomainError::InvalidStateTransition`仍有133处文本命中。该数字只登记旧consumer的
改写规模，不是current Step 6 error count，也不能靠给current domain增加generic error来消除。current
canonical分件中该名称仅出现在诊断/禁止语句，active callable返回类型命中为0。

### 9.7 Error owner join

| layer / surface | current owner set | join rule | unresolved |
|---|---|---|---:|
| shared construction | `ContractError` | ref/shared carrier shape只在mapper后暴露public kind。 | 0 |
| public category | 16-variant `SandboxPublicErrorKind` | Step 8/12必须穷尽映射，不接受message或wildcard补分类。 | 0 |
| domain/object | 每个§9.2/§9.3 owner的自有error enum | transition/factory/rehydration直接返回owner error；跨对象proof保留typed source。 | 0 |
| application | `SandboxApplicationError` + 16 kind + 41 detail | domain/port/carrier错误一对一映射到detail，不回显raw cause。 | 0 |
| infra | `InfraError` 18 variants | adapter outcome先转typed observation，不能直接写domain status。 | 0 |
| API / worker / jobs | `ApiError` 7、`WorkerError` 12、`JobsError` 17 | entry只消费checked application/carrier结果，禁止跨entry互调。 | 0 |

`6R06-D`结论：39/39 status owner均唯一分类，20/20 mutable owner有current callable和owned error，
19/19 non-mutable owner有exact factory/mapping且无伪transition，10/10 cross-object helper闭合，current
幽灵callable与generic transition error survivor均为0。

---

## 10. `6R06-E` Typed ref / dependency / downstream overlay join

### 10.1 Typed ref family closure

| ref family | kind / wrapper | canonical role | relation rule | result |
|---|---:|---|---|---|
| context / boundary | 15 / 15 | intake truth、guard、requirement、boundary、handle和两个view identity | named wrapper只能接受matching explicit kind；repository不得用generic ref读写。 | closed |
| policy / run / capture | 14 / 14 | snapshot/decision/guard/run/capture/material/handoff/view identity | capture material key不是全局object ref；handoff progress是aggregate内identity。 | closed |
| failure / cleanup / read | 21 / 21 | failure/control/lease/orphan/cleanup/redline/guard/view/reference/projection/report/audit/relay identity | audit/relay/report均保持各自typed owner；不得从status或source字符串拼ref。 | closed |
| application persistence | 2 / 2 | idempotency record与完整stored public surface identity | transient service outcome、entry carrier、adapter outcome不新增`*Ref`。 | closed |
| **total** | **52 / 52** | 与`SandboxObjectRefKind`逐项一一对应。 | missing / duplicate / wrong-kind bypass均0。 | **closed** |

52个named wrapper均通过同一checked macro生成独立Rust type，但不是type alias。每个wrapper只能由
`try_new(SandboxObjectRef)`或checked deserialize接受matching kind；禁止`From<ResourceRef>`、跨wrapper
`From`、ref文本前缀解析和generic repository key。`ExternalSourceRef`、`SafeSummaryRef`、core `ResourceRef`、
`CapturedMaterialRef` composite key、`SandboxReconciliationScopeRef` value carrier与52个object ref角色不同，
不得为了统一接口强制转换。

### 10.2 Module dependency and type-flow join

| source -> consumer | allowed current flow | forbidden reverse / shortcut | result |
|---|---|---|---|
| core -> all modules | actor、metadata、timestamp、resource/version/job identities按upstream contract复用 | L4新增core actor/status/ref kind | closed |
| contracts -> domain/application/infra/entry | shared refs、status、selector、body-free carrier向内层/外层消费 | contracts引用domain/application/infra type | closed |
| domain -> application/infra mapper | domain truth、guard、decision、typed observation/proof | domain引用application/infra/entry；adapter决定domain invariant | closed |
| application -> infra implementation | application port/result/error contract由infra实现和映射 | application依赖infra concrete type；infra绕过application status mapping | closed |
| application/infra -> API/worker/jobs | entry经application service，infra只用于assembly | entry直接调用domain business transition；worker/jobs互调 | closed |
| query/read -> projection/view | access-first读取已提交source并构造view | query写truth、触发repair/backend/tool/runtime/member flow | closed |

七模块owner均命中Step 5 §9.7。current Step 6 planned owner path 36/36命中Step 4，新增未规划module为0；
`contracts -> domain` public-field反向依赖为0。Sandbox职责仍只覆盖execution isolation truth、运行边界、
capture/control/cleanup/audit/relay/read关系，不吸收tools semantic execution、runtime agent loop或member
lifecycle orchestration。

### 10.3 Historical consumer later-owner ledger

| historical consumer | detected conflict class | required next owner | Step 6 authority | current state |
|---|---|---|---|---|
| Step 7 trait / port / adapter | opaque/generic ref、粗粒度callable、outcome status shortcut、row-only mapper | `6R-07` handoff后重写Step 7逐模块exact I/O/error/async/transaction | 69 registry、52 refs、object method、typed proof/outcome | `downstream_revalidation_pending` |
| Step 8 protocol | opaque ref、旧status/public error、actor authority和DTO二级类型漂移 | Step 8按55 logical names逐协议重建schema/mapping/stored replay | contracts ref/status/error/selector及entry checked carrier | `downstream_revalidation_pending` |
| Step 9 flow | helper幽灵调用、调用签名旧化、query write、transaction/order不完整 | Step 9按55接口逐条绑定Step 7 callable和Step 8 DTO | current factory/transition/helper与no-write/no-rollback边界 | `downstream_revalidation_pending` |
| Step 10 state matrix | 旧enum、把snapshot/public surface当状态机、133个generic transition error和幽灵trigger | Step 10先筛主语，再绑定current status/method/error | §9的39-owner分类及exact callable join | `downstream_revalidation_pending` |

这些冲突不能反向恢复旧alias或补ghost helper。`historical_contained`只表示旧文本已隔离并有later owner；
不表示Step 7~10已经重写或通过。

### 10.4 Downstream design overlay

| downstream set | exact revalidation obligation | count / identity | current state |
|---|---|---|---|
| Step 7~10 | exact callable、protocol schema、per-interface flow、state subject/trigger/error串行回归 | 4 steps | blocked_by_previous_regression_step |
| Step 11~18 | persistence/transaction/error/concurrency/config/observability/test/handoff定向影响回查 | 8 steps | downstream_revalidation_pending |
| 正式`03~07` | Step 19重装配后定向重验配置、测试、验收和实施计划 | 5 formal docs | historical_reviewed_revalidation_pending |
| planned boundaries | `02A/02B/03A/03B/09A/09B/10B/11A/11C/12A/12B` | 11 / 11 existing skeletons | downstream_revalidation_pending |
| implementation current | `CB-SBX-01A` | only current identity | blocked / wait_design |

11个planned boundary overlay只记录未来重验面，不改变skeleton的status、scope、Gate或next action。当前没有
实现仓、实现commit、run、evidence alias、测试结果或验收签署；`6R-06`不得创建这些事实。

### 10.5 `6R06-E` difference audit

| audit ID | expected | actual | unresolved |
|---|---:|---:|---:|
| typed ref kind | 52 | 52 unique | 0 |
| typed ref wrapper | 52 | 52 unique, exact kind | 0 |
| status owner classification | 39 | 20 mutable + 13 immutable + 6 surface | 0 |
| module owner baseline | 7 | 7 | 0 |
| current owner path | 36 | 36 planned | 0 |
| historical consumer later-owner | 4 | 4 | 0 |
| affected boundary overlay | 11 | 11 existing identities | 0 |
| Sandbox scope redline | 3 excluded domains | tools semantics / runtime loop / member lifecycle均未进入owner | 0 |

`6R06-E`结论为`closed`。该结论只证明Step 6 source与later rewrite responsibility可定位；Step 7~18、
正式`03~07`和planned implementation boundary仍保持待重验/冻结状态。

---

## 11. `6R06-F` 全文静态复核与恢复源一致性

### 11.1 可重复静态检查边界

本批使用临时检查器`/tmp/audit_l4_sandbox_6r06.pl`读取13个设计输入：五份Step 6 current
canonical分件、Step 4、Step 5、本closure audit、regression control、`03` flow、project ledger、
implementation ledger和historical Step 10。检查器只解析设计文本中的registry row、Rust-like declaration、
section table、planned path、恢复字段与existing boundary skeleton；它不是Rust compiler、test runner、
runtime probe或evidence producer。

检查器中的historical ghost必须按exact owner + callable判断。例如禁止的是
`HandoffFact::dead_letter`，不能误伤合法的`EventPublisherAdapterOutcome::dead_letter` typed outcome
factory。该对象级收紧已通过`perl -c`，并在状态同步前复跑：16/16 substantive检查族全部为0差集，
当时唯一失败是7个恢复源尚未从`in_progress`切换到`completed_wait_user_review`，符合收尾顺序。

### 11.2 最终检查矩阵

| check family | expected | final actual | unresolved |
|---|---:|---:|---:|
| registry master row / non-empty current row | 69 / 69 | 69 / 69 | 0 |
| typed ref kind / named wrapper | 52 / 52 | 52 / 52 | 0 |
| shared status owner /唯一分类 | 39 / 39 | 39 / 39 | 0 |
| exact guard contract | 12 | 12 | 0 |
| current owner path / unplanned split path | 36 / 0 | 36 / 0 | 0 |
| module owner baseline / markdown fence | 7 / 5 files balanced | 7 / 5 | 0 |
| entry error variant set | 41 / 7 / 12 / 17 | 41 / 7 / 12 / 17 | 0 |
| mutable lifecycle owner / forward helper | 20 / 10 | 20 / 10 | 0 |
| historical trigger containment / later owner | 6 / 4 | 6 / 4 | 0 |
| downstream boundary overlay | 11 | 11 existing skeletons | 0 |
| completed-wait-review recovery source | 8 | 8 | 0 |

完成态同步后已对同一13个输入实际复跑：命令退出码为0，最终输出为`audit_failures=0`，17/17检查族
均无unresolved。任何未来对13个输入的修改都会使该结果失去时效，必须重新执行同一检查并由对应
后续Step处理差异，不能把本次文本检查当作永久实现证据。

### 11.3 负向事实复核

| negative fact | final state |
|---|---|
| 新L1/L2 blocker | 0；historical actor authority仍由Step 8回归负责。 |
| Step 7~10 current rewrite | 未开始；只登记later owner。 |
| 正式`03~07`修改 | 0。 |
| implementation boundary status / skeleton修改 | 0；11个overlay不改变planned状态。 |
| Rust compile / lint / unit / integration / provider / runtime test | 未执行，未声明结果。 |
| commit / run_id / evidence alias / acceptance sign-off | 均未创建。 |

---

## 12. `6R-06` 完成门禁与停审恢复点

`6R06-A~F`均已完成，current Step 6 canonical source的registry、field/factory、guard、transition/helper、
typed ref、status/error owner、module dependency与historical consumer差集均为0。因此`6R-06`可以进入
`completed_wait_user_review`。该结论不关闭Step 6：`6R-07`主控回填、唯一canonical链接、Step 7 handoff
和最终自检仍未开始。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-06
current_batch = 6R-06 full closure audit
step_status = reopened_waiting_6R_06_review
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = full_closure_audit_closed_wait_review
next_allowed_action = wait_user_review_before_6R_07
upstream_6R_05 = review_confirmed
registry_rows = 69/69
typed_ref_kind_wrapper = 52/52
shared_status_owner = 39/39
guard_contract = 12/12
mutable_status_owner_callable = 20/20
cross_object_forward_helper = 10/10
historical_consumer_later_owner = 4/4
downstream_boundary_overlay = 11/11
static_audit_unresolved = 0
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

用户确认本批前不得读取并写入`6R-07`产物，不得进入Step 7，不得修改正式`03~07`，不得改变任何
implementation boundary状态或进入实现仓。

上述§12是`6R-06`完成待审时的historical recovery snapshot，现由物理末尾§13覆盖；其17/17检查族、
8/8恢复源和unresolved 0结论继续有效。

## 13. Review confirmation consumed by `6R-07`

用户已确认`6R-06`，`6R-07`已消费本文件的closure结论并完成主控回填、canonical source索引和Step 7
handoff。本文件不因此成为schema owner，也不声明实现、测试或验收事实。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
6R_06_status = review_confirmed_consumed_by_6R_07
6R_06_static_audit_families = 17/17
6R_06_recovery_sources = 8/8
6R_06_static_audit_unresolved = 0
next_allowed_action = wait_user_review_before_step_7_regression
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

当前只允许等待Step 6用户审查；不得从本文件直接进入Step 7、正式`03~07`或实现仓。

上述§13记录`6R-06`被`6R-07`消费时的historical recovery snapshot。Step 6整体已在后续`6R-07`
完成并获用户确认，当前项目恢复点由物理末尾§14覆盖。

## 14. Step 6 review confirmation consumed by `7R-M0`

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
6R_06_status = review_confirmed_consumed_by_6R_07
step_6_status = review_confirmed_consumed_by_7R_M0
6R_06_static_audit_families = 17/17
6R_06_recovery_sources = 8/8
6R_06_static_audit_unresolved = 0
next_allowed_action = wait_user_review_before_7R_01_service_facades
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本文件仍只拥有`6R-06`静态审计事实，不拥有Step 7 callable或实现证据。
