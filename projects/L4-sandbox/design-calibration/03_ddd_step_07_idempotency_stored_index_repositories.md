# Step 7 S7-02D Idempotency / Stored Result / Necessary Index Repository 中间产物

> 本文件是 `03-详细设计.md` 的 Step 7 中间产物，不是正式详细设计正文。
> 当前只校准 application-owned idempotency reservation、typed stored public surface 和必要 bounded selector/index。
> 本文件不生成实现代码、数据库 DDL、migration、compile/test/run/evidence、验收签署或 commit 事实。

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| target | `L4-sandbox` |
| current document | `03-详细设计.md` |
| current step | Step 7 regression / `7R-02D` |
| current task | `S7-02D` idempotency / stored result / necessary bounded index |
| batch status | `completed_wait_user_review` |
| current write batch | `S7-02D-B6 completed`：B1~B5 closure、正式回填草稿与恢复源同步已完成 |
| required stop | 当前停在 `S7-02D completed_wait_user_review`；用户确认前不得进入 `S7-03A` |
| next gate | `S7-G02`，仅在 `7R-02A~D` 全部完成后由用户审查 |
| formal document write | `0`；本批不修改正式 `03~07` |
| implementation | `CB-SBX-01A blocked / wait_design` |
| commit | 不需要；未经用户明确要求不得提交 |

本批启动依据是用户已确认消费 `S7-02C` 停审门。开始前已按恢复顺序读取项目台账、`03` calibration flow、
Step 7 control、repository/facade current EOF overlay、Step 6 current object contract、`S7H-09`、`S7-02C` deferred
boundary、详细设计 SOP 与书写规范。`S7-G02`、Step 8、正式 `03~07` 装配和 implementation 继续冻结。

## 2. 内部执行计划

| batch | 状态 | 内容 | 完成条件 |
|---|---|---|---|
| `S7-02D-B1` | `completed` | 状态、输入、SOP 回答、冲突登记、粒度裁决、exact unique claim 与 reservation 基础 | persisted identity、binding selector、observation 与 persisted state 分离；旧 channel key 失效 |
| `S7-02D-B2` | `completed` | idempotency repository exact trait、error enum、read/write snapshot 与 race 语义 | reserve/get/complete/fail 方法、typed errors、UoW/Version 对称 |
| `S7-02D-B3` | `completed` | 三类 typed surface store 与 stored carrier save/get | 三类frozen source、carrier create/get、typed save/get、统一validator和no-rerun矩阵闭合 |
| `S7-02D-B4` | `completed` | fresh/duplicate/conflict/in-flight/failed/commit-unknown 算法 | no-rerun、no-second-id、whole-group inspection 与错误映射闭合 |
| `S7-02D-B5` | `completed` | necessary bounded selector/index、42/29/13 join、fake/durable parity、negative inventory | 42/42 callable、29/29 fresh、Query 0/13、bounded-only、parity 差集为 0 |
| `S7-02D-B6` | `completed` | closure audit、正式回填草稿、恢复源同步 | `REF-001` 已按 B1~B5 current authority判定 resolved；状态转为 `completed_wait_user_review` |

B1/B2与B3-1只建立后续 exact trait 的输入基础，不提前宣称typed store、stored replay或commit-unknown已闭合。
每完成一个内部 batch，必须立即更新本表和 `/tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md`。

## 3. 输入效力与裁决顺序

### 3.1 Current authority

| 输入 | 效力 | 本批消费方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts_application_infra_entry.md` §§9.2~9.5、§11 | current canonical | 消费 call context、record、stored carrier、error detail、entry/result/receipt/report relation；不得反向改 schema。 |
| `03_ddd_step_06_object_contracts_shared_types.md` §12.8 | current canonical | record status 只允许 `Reserved/Completed/Failed`；stored status 只允许 `Completed/Rejected/Failed`。 |
| `03_ddd_step_06_object_contracts_handoff_assembly.md` `S7H-09` | current handoff | 要求 reserve/complete/fail、typed save/get 对称和 duplicate replay only。 |
| `03_ddd_step_07_repositories_uow_indexes.md` §§7~11、§18、§21、§25、EOF overlay | current repository foundation | 复用 UoW 三分、core `Version`、typed allocator、idempotency root primitive、whole-group inspection。 |
| `03_ddd_step_07_immutable_audit_relay_repositories.md` §§12、15 | current predecessor | 消费 stored relation deferred 边界、audit/relay relation、body-free/no-rerun 和 `REF-001` 状态。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` §§47、50、52、EOF overlay | current facade owner | 复用 42 callable、29 fresh reservation owner、Query 0/13 与 duplicate zero-side-effect。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | process authority | trait 必须有 exact 参数/返回/error，读写面、UoW、Version、幂等与停审可追溯。 |
| `standards/document/详细设计书写规范.md` | output authority | 主流程达到 1:1 可实现；普通审查/诊断/交付保持 L2/L3。 |

### 3.2 Historical material

旧正式 `03-详细设计.md`、旧 Step 11/13、README 或早期 Step 7 中出现下列口径时只作为差异证据：

| ID | historical material / conflict | current ruling |
|---|---|---|
| `S7-02D-H01` | unique key 为 `(operation_name, channel, idempotency_key)`。 | 失效。persisted exact identity 固定为 `operation_name + idempotency_key + request_digest`；channel 只做 reservation 前入口合法性校验。 |
| `S7-02D-H02` | duplicate/conflict/in-flight/unavailable 是 idempotency persisted status。 | 失效。它们是瞬时 observation 或 error；persisted status 只有 3 项。 |
| `S7-02D-H03` | `AlreadyExists` 可直接映射 duplicate。 | 失效。只有完整 binding、digest、status、stored linkage 与 typed surface 都证明等价时才可返回 duplicate。 |
| `S7-02D-H04` | completed record 缺 stored result 时重跑 operation 或从 current truth 重建 result。 | 安全禁止。返回 `DuplicateMissingResult` 或 integrity error，business read/write/external call 均为 0。 |
| `S7-02D-H05` | generic `save_result/get_result`、`SandboxOpaqueRef` 或 DTO body 持久化即可完成 replay。 | 失效。stored carrier 保存 closed kind + typed surface identity；完整 surface store 按三类对称，DTO schema仍归 Step 8。 |
| `S7-02D-H06` | result `Unavailable` 可保存为空洞 row，待后续重算。 | 失效。stored row没有 `Unavailable` status；只有已冻结完整 surface 才能形成 `Completed/Rejected/Failed`。 |
| `S7-02D-H07` | `find_latest_result`、按时间 winner、全表 scan 可用于 duplicate/recovery。 | 失效。只允许 exact identity、exact ref 和明确 bounded selector；timestamp不参与 winner。 |
| `S7-02D-H08` | Query 可复用 reservation/index 写入或在 missing 时补 stored relation。 | 失效。13 Query 的 idempotency read/write、identity/cursor allocation、write UoW、audit/relay与external call均为 0/13。 |

这些 historical material 不作为兼容要求，也不得通过 alias、fallback 或 adapter 私有方法继续生效。

## 4. L1 / L2 / L3 粒度裁决

| surface | 等级 | 必须写入 | 停止点 |
|---|---|---|---|
| fresh unique claim、并发 winner、duplicate/conflict/in-flight/failed | L1 | exact key、trait I/O、error、UoW/visibility、race loser 与 no-rerun | 不把 winner、retry 或状态解释留给 adapter。 |
| stored result create/get、completion linkage、wrong-kind/missing/corrupt | L1 | 三类 typed surface、exact ref/kind/status、same-UoW、完整性错误 | 不保存 DTO body，不设计 Step 8 public schema。 |
| commit unknown 与 whole-group inspection | L1 | frozen identity/ref、三分结果、禁止二次 external call/identity、conservative mapping | 不伪造 success，不展开物理恢复服务。 |
| necessary selector/index | L1/L2 | exact uniqueness、conflict lookup、bounded committed inspection、stable order/scope | 不设计通用搜索、运维控制台、retention DDL或全量查询系统。 |
| ordinary diagnostic、审查、fake test hint、交付记录 | L2/L3 | owner、safe default、升级条件、Gate 和禁止伪造 | 不逐错误写完整 flow，不生成真实测试/evidence。 |

本批将幂等与 replay 视为 Sandbox 主流程一致性边界。它们虽包含 failure handling，但会决定是否重复启动隔离环境、
重复执行工具/进程、重复发布/交付或重复 cleanup，因此不能降为异常处理摘要。

## 5. SOP 问题回答

| SOP 问题 | 本批回答 |
|---|---|
| 哪些模块定义 / 实现 port | `application` 是 idempotency、stored carrier、typed surface store 与 selector/index trait 唯一 owner；`infra` 提供 durable/fake adapter；api/worker/jobs 只能经 facade 消费 observation。 |
| 承接哪些 Step 6 能力 | `SandboxServiceCallContext::matches_duplicate_identity`、`SandboxIdempotencyRecord::{reserve,mark_completed,mark_failed}`、`SandboxStoredOperationResult::{try_new,validate_for_*}` 和 application error mapping。 |
| reservation 读取什么 | 入口先校验 selector/channel/actor/trace/digest/key；repository persisted identity只读取 operation、key、digest，且不保存 channel、actor、trace。 |
| duplicate 如何形成 | exact identity 命中 `Completed` record，exact stored ref 可读，stored operation/kind/status/surface relation全部通过；随后读取 matching typed full surface并 replay。 |
| conflict 如何形成 | 同一 `(operation_name, idempotency_key)` binding 已存在，但 persisted request digest 与当前 digest 不同；不覆盖 winner，不创建第二 record。 |
| in-flight / failed-terminal 如何形成 | exact identity 命中 `Reserved` 返回 `InFlight`；命中 `Failed` 返回 `FailedTerminal`；两者都不进入 business body。 |
| complete/fail 的 Version 与 UoW | 从 exact committed record read 取得 core `Version`；`mark_completed` 与 stored carrier/full surface在同一允许的 write group stage，`mark_failed`不得链接 stored ref。 |
| repository read 面是否闭合 | Batch 1 识别出 existing write-UoW-only read 与 duplicate read-only requirement 的内部冲突；B2 必须固定 committed read snapshot / write snapshot exact signatures，未闭口前不宣称完成。 |
| public surface schema是否本批定义 | 否。Step 6只固定 application/entry carrier和三类 closed kind；Step 8拥有 DTO schema。本批只定义 typed surface-store I/O 与 surface identity mapping obligation。 |
| Query 是否参与 | 不参与。Query没有 reservation、stored replay或 result-store surface，不能借 diagnostic/index接口写入或修复。 |

## 6. 改动前后与关键取舍

### 6.1 改动前后

| 维度 | historical / 未闭口 | S7-02D current direction |
|---|---|---|
| identity | channel-based key或只按record ref create | exact persisted triple + operation/key binding selector；channel在入口拒绝 |
| persisted state | duplicate/conflict混入status | 3-state record + 3-state stored；observation独立 |
| reserve race | `AlreadyExists -> Duplicate` | atomic claim返回 fresh/existing finite result；existing继续完整校验 |
| stored result | generic ref/placeholder或DTO body | immutable carrier + closed kind + result-store generated typed surface ref +完整typed surface store |
| duplicate | 读取current truth重建 | exact stored carrier和full surface replay；zero business/external write |
| failure | failed后复用same key或保存Unavailable | terminal failed不可复用；新key或人工恢复；Unavailable不持久化 |
| recovery | latest/time/scan猜测 | exact refs + bounded whole-group inspection；indeterminate保持失败/人工处理 |
| read transaction | 读取一律混用write UoW | B2区分 committed read snapshot 与 write snapshot，不给duplicate写能力 |

### 6.2 设计取舍

1. Persisted exact identity 与 conflict binding 分层。三元组决定 exact duplicate；二元组只用于定位同 operation/key 的唯一 winner并检测 digest 冲突，不成为第二条 operation identity。
2. Repository 返回 observation，不持久化 observation。`Reserved/Duplicate/InFlight/Conflict/FailedTerminal` 是调用结果；row仍只保存 canonical record status。
3. Atomic reserve 必须由 repository constraint 决定 winner。application 不执行 `find -> if absent -> create` 的竞态组合，也不使用 clock、random sleep或last-write-wins。
4. Stored carrier 与 full surface 分层。`SandboxStoredOperationResult` 保存 body-free relation；完整 command result、consumer receipt、job report由typed surface store冻结，Step 8再定义其 public DTO schema。
5. Ordinary retention/cleanup保持 L2。可以定义按正式 retention cutoff 和 bounded selection读取 terminal records，但不能删除 in-flight、missing-result、commit-unknown 或 integrity-blocked relation；本批不写物理清理算法。

## 7. Exact identity 与 conflict binding foundation

### 7.1 Persisted exact identity

```rust
/// 一次 Sandbox write-capable operation 的完整 persisted idempotency identity。
///
/// 字段均来自已验证 `SandboxServiceCallContext`；本类型不保存 channel、actor、trace、
/// request body、clock、retry count或generated ref。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct SandboxIdempotencyIdentity {
    /// 由 closed selector 映射的稳定 operation name。
    operation_name: OperationName,
    /// entry 提供并经 core checked type验证的幂等 key。
    idempotency_key: IdempotencyKey,
    /// entry 对 canonical request冻结的 body-free fingerprint。
    request_digest: RequestPayloadFingerprint,
}

impl SandboxIdempotencyIdentity {
    /// 从 write-capable call context构造exact identity；Query返回key forbidden。
    pub fn try_from_context(
        context: &SandboxServiceCallContext,
    ) -> Result<Self, ApplicationError>;

    /// 返回规范 operation name。
    pub fn operation_name(&self) -> &OperationName;

    /// 返回 core idempotency key。
    pub fn idempotency_key(&self) -> &IdempotencyKey;

    /// 返回 frozen request digest。
    pub fn request_digest(&self) -> &RequestPayloadFingerprint;

    /// 判断 record 是否逐字段匹配本 exact identity；不比较channel或时间。
    pub fn matches_record(&self, record: &SandboxIdempotencyRecord) -> bool;
}
```

`try_from_context` 固定执行 `requires_idempotency()` -> key存在 -> operation/key/digest复制。它不重新规范化或序列化
request，不读取 protocol body，也不调用 identity allocator。持久化唯一约束的语义必须等价于以下字段顺序：

```text
(operation_name, idempotency_key, request_digest)
```

字段顺序只固定 canonical comparison/constraint 语义，不要求具体数据库列顺序。adapter不得加入 channel、actor、trace、
reserved_at，也不得删除 digest后把 same-key/different-request 混成 duplicate。

### 7.2 Operation/key conflict binding selector

```rust
/// 只用于定位同一 operation/key 的唯一 reservation binding并检测digest冲突。
///
/// 本 selector不是第二个 persisted operation identity，不可用于replay成功判定。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct SandboxIdempotencyBindingKey {
    /// 与 exact identity 相同的规范 operation name。
    operation_name: OperationName,
    /// 与 exact identity 相同的 core idempotency key。
    idempotency_key: IdempotencyKey,
}

impl SandboxIdempotencyBindingKey {
    /// 从 exact identity投影唯一conflict lookup key。
    pub fn from_identity(identity: &SandboxIdempotencyIdentity) -> Self;

    /// 返回规范 operation name。
    pub fn operation_name(&self) -> &OperationName;

    /// 返回 core idempotency key。
    pub fn idempotency_key(&self) -> &IdempotencyKey;
}
```

实现必须保证一个 `SandboxIdempotencyBindingKey` 最多绑定一个 current idempotency record。该 binding 指向的 record
仍保存完整三元 identity。若 binding存在但 digest不同，结果只能是 `IdempotencyConflict`；不能创建第二条 record、改写
原 digest或把 digest纳入另一个 channel namespace。若未来 persistence 选择以二元 binding作为唯一约束、三元组作为行内
checked identity，也必须保持同一语义；本设计不规定物理索引名称或数据库产品。

### 7.3 Identity 来源与禁止项

| field / ref | 唯一来源 | duplicate / race loser | 禁止替代 |
|---|---|---|---|
| operation_name | Step 6 closed selector mapping | 复制 existing record值并逐字段校验 | route、topic、binary、Debug文本 |
| idempotency_key | checked entry metadata/envelope/job input | 原 key不变 | request id、trace id、job run id、retry count |
| request_digest | entry canonicalization | 与 existing record比较；不重新计算 | current truth、stored body、adapter response、clock |
| idempotency_ref | winner reservation path的 exact allocator | loser丢弃未持久化 candidate，不替换winner | key/digest hash、opaque ref、timestamp |
| stored_result_ref | fresh finalization identity bundle | duplicate复用record linkage；不分配第二ref | command/result ref、surface resource ref、trace |
| surface resource_ref | typed result store成功冻结完整surface后生成 | duplicate原样读取 | application allocator、operation/time派生 |

候选 ref 可以在 atomic reserve 调用前由唯一 reservation kernel分配，但只有 claim winner 的 record可以持久化并成为
current identity。并发 loser不得将未持久化候选 ref写入 audit、error、result、index或后续 recovery key；它只消费 repository
返回的 existing winner observation。这不改变“duplicate zero new durable identity”的规则。

## 8. Reservation finite observation foundation

### 8.1 Repository-level atomic claim result

```rust
/// atomic unique claim的有限结果；不是 persisted status。
#[derive(Debug, Eq, PartialEq)]
pub enum SandboxIdempotencyClaim {
    /// candidate record取得唯一 binding ownership并已在当前UoW stage。
    FreshReserved {
        /// 新 Reserved record；commit confirmed后才成为可执行ownership。
        record: SandboxIdempotencyRecord,
    },
    /// 同 operation/key 已有 committed 或同一原子constraint可见的winner。
    Existing {
        /// existing winner的完整 checked record与同snapshot core Version。
        record: Versioned<SandboxIdempotencyRecord>,
    },
}
```

`FreshReserved` 只表示 reservation row/unique binding 已 stage，不表示 commit confirmed，更不表示 business operation
已经执行。application 必须先提交 reservation UoW并取得 confirmed receipt，随后才能进入 business read、business identity
allocation或 external call。`Existing` 也不等于 duplicate；application必须按下节矩阵继续判断 digest、status和stored relation。

### 8.2 Existing record observation matrix

| binding / digest / status | application observation | allowed next action | forbidden action |
|---|---|---|---|
| no binding; candidate wins and reservation commit confirmed | `Reserved(record)` | 进入一次 fresh business flow | commit前执行business/external call |
| same binding + same digest + `Reserved` | `InFlight(idempotency_ref)` | 返回typed retryable/in-flight surface | 二次create、等待锁后接管、执行mutation |
| same binding + same digest + `Completed` + exact stored carrier/full surface valid | `Duplicate(stored_result)` | replay matching typed surface | 读取current truth重建、生成新ref/time |
| same binding + same digest + `Completed` + linkage/surface missing/wrong/invisible/corrupt | application error `DuplicateMissingResult` 或 integrity | fail closed / manual reconciliation | 重跑operation、把row改回Reserved |
| same binding + same digest + `Failed` | `FailedTerminal(idempotency_ref)` | 要求新key或人工恢复 | same key复用、自动转Reserved/Completed |
| same binding + different digest | `Conflict(IdempotencyConflict)` | caller修正key/request；保留原winner | 覆盖digest、创建第二record、按channel分叉 |
| binding / row cardinality > 1 或 key/row不一致 | integrity error | fail closed / reconciliation | 任取latest、删除“多余”row、报告duplicate |

operation不同意味着不同 `SandboxIdempotencyBindingKey`，不是同一 binding 的 digest conflict。若产品希望跨 operation
全局禁止复用 key，必须重开上游 identity contract；当前不能由 adapter 私加全局 key uniqueness。channel不同但 operation/key/
digest相同仍命中同一 persisted identity；非法 channel必须在调用 `try_from_context` 前由 Step 6 factory拒绝。

### 8.3 Persisted state 与 observation 分离

| persisted owner | allowed variants | observation / error that must not be persisted |
|---|---|---|
| `SandboxIdempotencyRecordStatus` | `Reserved`;`Completed`;`Failed` | `Duplicate`;`InFlight`;`Conflict`;`Unavailable`;`CommitUnknown` |
| `SandboxStoredOperationResultStatus` | `Completed`;`Rejected`;`Failed` | `Unavailable`;`Missing`;`WrongKind`;`Corrupt`;`Replayed` |
| `SandboxIdempotencyObservation` | transient enum，调用完成后不持久化 | 不得增加record row/status列与其同名 |

Repository adapter只能重建 Step 6 canonical object，不能把 unique constraint、lock state、driver retry或 result-store
availability编码为业务 status。`Unavailable`必须作为 typed port error；commit unknown必须作为 UoW终结结果；两者都不能生成
可 replay row。

## 9. Batch 1 内部缺口与后续门禁

| ID | 当前状态 | 缺口 | B2/B3 必须给出的闭口 |
|---|---|---|---|
| `S7-02D-INT-01` | `open_in_batch` | existing idempotency primitive所有 read都接收 write `SandboxUnitOfWork`，但 duplicate/recovery要求零 write UoW。 | 定义 committed read snapshot / write snapshot exact boundary；duplicate无法获得save/cursor/commit能力。 |
| `S7-02D-INT-02` | `open_in_batch` | `create_idempotency_record` 与 atomic unique claim关系只有文字约束，尚无 exact trait method/error。 | 定义 atomic claim method、candidate/winner返回、constraint conflict与stage/commit三分。 |
| `S7-02D-INT-03` | `open_in_batch` | stored carrier get/create和三类完整surface store的对称面尚未定义。 | 定义 carrier exact repository + Command/Consumer/Job typed store；missing/wrong-kind不可重跑。 |
| `S7-02D-INT-04` | `open_in_batch` | completion/failure的 same-UoW、Version和commit-unknown inspection尚未逐分支固定。 | 定义 complete/fail finalizer、whole-group relation与 exact inspection结果。 |
| `S7-02D-INT-05` | `open_in_batch` | retention/maintenance所需最小 bounded selector尚未裁剪。 | 只保留正式selection、stable bounded page、terminal-safe规则；无latest/all scan。 |

这些是 `S7-02D` 内部设计项，不是新 L1/L2 上游 blocker。任一未关闭时不得把 `S7-02D` 标为 completed，也不得进入
`S7-G02`、Step 8、正式文档装配或 implementation。

## 10. Batch 1 状态

Batch 1 已固定 exact identity、conflict binding、finite claim与 persisted/observation 分离，完成本批计划项；完整
`S7-02D` 仍为 `in_progress`。下一唯一动作是读取本文件 §§7~9、Step 7 UoW/Version exact contract、Step 6 record
accessor缺口与当前 repository primitive，写入 Batch 2 的 repository exact trait、error和read/write snapshot boundary。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_task = S7-02D idempotency / stored result / bounded index
completed_internal_batch = S7-02D-B1
next_internal_batch = S7-02D-B2 repository exact trait and read/write snapshot
batch_status = in_progress
gate_status = content_in_progress
persisted_identity = operation_name + idempotency_key + request_digest
conflict_binding = operation_name + idempotency_key
channel_in_identity = no
record_status = Reserved|Completed|Failed
stored_status = Completed|Rejected|Failed
internal_open_items = 5
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-1C-R` borrowed JobReport store write

> 本节因历史状态锚点命中文件中段，只保留完整typed-store推导；只有物理EOF同批activation显式采纳后才是current
> authority。它消费Step 6 Jobs owner与Step 7 facade borrowed finalizer
> activation。前部§§20.2~20.3、§28、§30、§39中fresh write构造owned maintenance draft、store接收owned payload并返回完整
> owned frozen surface的口径，在冲突处降为`historical_material`。duplicate committed read contract保持不变。

### 75. 诊断与边界

仅把finalizer input改为borrow仍不闭合：historical
`SandboxMaintenanceJobReportSurfaceDraft { batches: Vec<_> }`和
`save_job_report_surface(...) -> SandboxStoredJobReportSurface`会在application/store边界再次要求第二个owned完整chain。
current修复必须同时满足：

- fresh write逐batch/逐item完整stage，不能只存count/ref摘要；
- write path不clone/rebuild完整`Vec<Batch>`；
- committed duplicate read仍能rehydrate完整owned frozen surface；
- Maintenance与Reconciliation仍共用一个JobReport store method，不新增stored kind或第七个typed method；
- staged返回值不是commit evidence、report DTO或持久化第四对象。

### 76. Borrowed write union与staged receipt

```rust
/// JobReport fresh save使用的application-owned调用期source闭集。
#[derive(Debug)]
pub enum SandboxJobReportWriteSource<'a> {
    /// 九个paged maintenance Job；完整batch chain只借用caller owner。
    Maintenance(SandboxMaintenanceJobReportWriteSource<'a>),
    /// reconciliation既有完整committed envelope；不压成maintenance batch。
    Reconciliation(&'a SandboxReconciliationStoredJobReport),
}

impl<'a> SandboxJobReportWriteSource<'a> {
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn operation_name(&self) -> OperationName;
    pub fn expected_stored_status(&self) -> SandboxStoredOperationResultStatus;
    pub fn recorded_at(&self) -> &Timestamp;
    pub fn validate_shape(&self) -> ApplicationResult<()>;
}

/// typed store在同一UoW完成stage后返回的body-free candidate receipt。
///
/// 它不是commit receipt、stored surface或public report；只有UoW commit confirmed后才能用于fresh completion witness。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxStagedJobReportSurface {
    surface_ref: SandboxStoredResultSurfaceRef,
    stored_result_ref: SandboxStoredOperationResultRef,
    operation_name: OperationName,
    job_kind: SandboxJobKind,
    original_job_run_id: JobRunId,
    original_report_status: SandboxJobReportStatus,
    expected_stored_status: SandboxStoredOperationResultStatus,
    recorded_at: Timestamp,
}

impl SandboxStagedJobReportSurface {
    /// infra adapter只能通过checked fields构造body-free staged receipt。
    pub fn try_new(
        surface_ref: SandboxStoredResultSurfaceRef,
        stored_result_ref: SandboxStoredOperationResultRef,
        operation_name: OperationName,
        job_kind: SandboxJobKind,
        original_job_run_id: JobRunId,
        original_report_status: SandboxJobReportStatus,
        expected_stored_status: SandboxStoredOperationResultStatus,
        recorded_at: Timestamp,
    ) -> Result<Self, SandboxJobReportSurfaceStoreError>;

    /// 与write source逐字段重验；不读取repository或current truth。
    pub fn validate_source(
        &self,
        source: &SandboxJobReportWriteSource<'_>,
    ) -> ApplicationResult<()>;

    /// 与同一UoW将要stage的generic carrier重验kind/ref/operation/status/time全等。
    pub fn validate_carrier(
        &self,
        source: &SandboxJobReportWriteSource<'_>,
        carrier: &SandboxStoredOperationResult,
    ) -> ApplicationResult<()>;

    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn operation_name(&self) -> &OperationName;
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn expected_stored_status(&self) -> SandboxStoredOperationResultStatus;
    pub fn recorded_at(&self) -> &Timestamp;
}
```

`SandboxMaintenanceJobReportWriteSource<'a>`的exact字段与facade §40.10一致；所有字段private，通过read-only accessor暴露给
infra mapper。`SandboxJobReportWriteSource::Reconciliation`只接受已通过canonical envelope validator的对象。两分支都不
实现`Serialize/Deserialize/Clone-to-owned payload`，不得转为generic JSON或`Cow::Owned`。

staged receipt不含batch、item、selection、finding或relay正文。它只回显typed store已经按source stage的identity/status/time
关系，application必须调用`validate_source`。`try_new`要求surface kind=`JobReport`、operation与job kind canonical mapping
一致、status不为`DuplicateReplayed`、stored status与original status矩阵一致、refs非空。它不能单独证明commit。

### 77. Store exact signature

```rust
pub trait SandboxJobReportSurfaceStore: Send + Sync {
    /// 在同一UoW中逐字段stage完整JobReport source；borrow不得逃逸。
    async fn save_job_report_surface<'a>(
        &'a self,
        source: &'a SandboxJobReportWriteSource<'a>,
        uow: &'a mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxStagedJobReportSurface, SandboxJobReportSurfaceStoreError>;

    /// committed read按exact relation重建完整owned JobReport surface；duplicate只走本方法。
    async fn get_job_report_surface_with_version(
        &self,
        surface_ref: &SandboxStoredResultSurfaceRef,
        stored_result_ref: &SandboxStoredOperationResultRef,
        operation_name: &OperationName,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<Versioned<SandboxStoredJobReportSurface>, SandboxJobReportSurfaceStoreError>;
}
```

等价`BoxFuture<'a, ...>`展开允许，语义与facade §40.9相同：future不为`'static`，store不得spawn/detach、缓存source pointer、
把borrow放进UoW对象或在return后读取。adapter在future内可以把每个字段编码为persistence-owned row/value并stage；这是正常
持久化，不等于在内存中构造第二个完整`Vec<SandboxMaintenanceBatchOutcome>`。禁止先`to_vec()`再调用旧owned mapper。

Maintenance save固定执行：source validator -> canonical batch ordinal -> input/next token -> item ordinal -> target/result/reason/
trace完整字段stage -> report header/status/time stage -> 返回body-free receipt。Reconciliation save按既有exact report/finding/
audit/optional relay bundle stage。两分支使用同一surface ref，insert-if-absent；partial stage只有随整个UoW commit才可见。

### 78. Fresh finalization与read-side ownership

```text
borrowed FinalizeSandboxJobReportInput
  -> SandboxJobReportWriteSource::Maintenance(borrowed source)
  -> save_job_report_surface(&source, uow)
  -> SandboxStagedJobReportSurface (body-free, not committed)
  -> validate_source
  -> construct/stage generic SandboxStoredOperationResult
  -> mark/stage idempotency completion
  -> atomic commit confirmed
  -> construct SandboxFinalizedJobReport from source + committed carrier/outcome/time
```

`SandboxStoredJobReportSurface`与owned `SandboxMaintenanceJobReportSurfaceDraft`现在只由
`get_job_report_surface_with_version`的persistence rehydration构造，供duplicate/read/Step 8 mapper使用。fresh finalizer不要求
store把刚stage的完整rows重新拼成owned surface；其完整性由source validator、adapter row cardinality/order contract、body-free
receipt equality、same-UoW commit和后续committed-read validator共同闭合。

read-side owned draft的唯一current constructor为：

```rust
impl SandboxMaintenanceJobReportSurfaceDraft {
    /// 从committed snapshot读取的完整header、selection和ordered batch rows重建owned frozen payload。
    pub(crate) fn try_rehydrate(
        stored_result_ref: SandboxStoredOperationResultRef,
        job_kind: SandboxJobKind,
        original_job_run_id: JobRunId,
        trace_context: SandboxTraceContext,
        selection: SandboxStoredMaintenanceJobSelection,
        initial_page_request: SandboxJobPageRequest,
        batches: Vec<SandboxMaintenanceBatchOutcome>,
        original_report_status: SandboxJobReportStatus,
        final_outcome: SandboxReplaySurfaceOutcome,
        started_at: Timestamp,
        finished_at: Timestamp,
    ) -> ApplicationResult<Self>;
}
```

该constructor复用完整shape validator，拒绝`DuplicateReplayed`、wrong job/selection/token chain/status/time；只允许typed store
committed-read mapper调用。fresh finalizer不可见也不得调用它。fresh path在构造generic carrier后必须依次调用
`staged.validate_source(&source)`和`staged.validate_carrier(&source, &carrier)`；historical
`validate_stored_surface_relation(loaded_owned_surface, carrier, Fresh)`不再适用于Maintenance fresh write，但继续用于committed
duplicate read与其它仍返回owned candidate的surface branch。

fake adapter必须逐batch/逐item复制到其模拟持久化owned rows，以模拟真实存储，而不是保存borrow或只保存receipt；这是storage
materialization，不是caller chain clone。durable/fake都必须在committed read中重建相同owned surface。本文只记录parity义务，
不声称测试已执行。

### 79. Static ownership audit

| audit | expected | current result |
|---|---:|---:|
| JobReport typed store methods | `2` | `2`：save/get，typed总数仍`6/6` |
| JobReport write-source variants | `2` | `Maintenance/Reconciliation = 2/2` |
| fresh save returned full owned surface | `0` | `0`；只返回body-free staged receipt |
| committed read returned full owned surface | `1` | `1` |
| caller complete-chain clone/rebuild | `0 / 0` | `0 / 0` |
| persisted batch/item cardinality | source exact cardinality | required；禁止counts-only |
| staged receipt treated as commit evidence | `0` | `0` |
| stored kind/public DTO/application callable delta | `0 / 0 / 0` | `0 / 0 / 0` |
| new L1/L2 blocker | `0` | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R typed store borrowed write foundation drafted
artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
artifact_content_status = drafted_pending_eof_activation
artifact_review_status = not_current_until_eof_activation
current_authority = historical_position_foundation_only
typed_surface_method = 6/6
job_report_save_output = SandboxStagedJobReportSurface
job_report_committed_read_output = Versioned<SandboxStoredJobReportSurface>
fresh_owned_complete_batch_chain_in_application = 0
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = reaudit_worker_and_nine_paged_jobs_terminal_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Draft: `S7-02D-B6` closure complete

> 本节因 patch 锚点命中文件前部而保留为 non-authoritative closure draft。本文物理 EOF 的同名 B6 authority
> 显式采纳本文 §§71~74 后才决定恢复点；本节不能覆盖后续 B1~B5 current contract。

B6 只完成 closure、正式回填草稿和恢复源同步。它没有新增 application callable、repository method、stored kind、
selector、DTO、状态、外部 port、测试结果或实现事实。`REF-001` 的 Step 7 repository/consistency 子条件已关闭，但
`7R-03~07`仍需按各自 owner 完成，故 `S7-G02`、Step 8、正式 `03~07` 和 implementation 继续冻结。

| closure item | current result |
|---|---|
| internal design items | `S7-02D-INT-01~05 = 5/5 closed` |
| idempotency repository | `5/5 exact methods` |
| stored carrier / typed surface | `2/2 + 6/6`; `Command/Consumer/Job = 3/3` |
| whole-group inspection | modes `3/3`; results `3/3`; no-rerun and no-second-identity `0` |
| bounded maintenance | selector `9/9`; reader `9/9`; parity obligation `14/14` (not executed) |
| callable and write join | application `42/42`; fresh reservation `29/29`; Query maintenance/write `0/13` |
| current identity path | named refs/core `Version` positive gap `0`; generic external target `0`; public decode/restart path `0` |
| upstream blocker | new L1/L2 upstream blocker `0`; `REF-001 = resolved_in_7r_02d` |
| runtime facts | code/compile/test/run/evidence/acceptance/commit `not_started` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_task = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
internal_items = 5/5_closed
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
stored_surface_kind = 3/3
whole_group_mode = 3/3
whole_group_result = 3/3
maintenance_selector = 9/9
maintenance_reader = 9/9
parity_obligation = 14/14_not_executed
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
ref_blocker = resolved_in_7r_02d
remaining_step_7_internal_blockers = 4/6_open_with_owner
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Activation Draft: `7R-06C-1C-R` borrowed JobReport store write

> 本节因恢复块锚点命中文件中段，只保留activation draft，不改变current authority。只有文件物理EOF的同批activation
> 才能采纳文件前部
> `Historical-Position Foundation: 7R-06C-1C-R borrowed JobReport store write`的§§75~79，并覆盖B3/B6中与fresh
> JobReport ownership冲突的owned write/return口径；committed duplicate read、其余typed stores和B6 selector/index结论不变。

Current store contract固定为：

1. `SandboxJobReportWriteSource<'a>`是`Maintenance(borrowed source) | Reconciliation(&envelope)`两分闭集；不接受owned
   generic payload、JSON或Jobs accumulator。
2. `save_job_report_surface<'a>(&'a self, &'a source, &'a mut uow)`在future内逐batch/逐item完整stage，返回body-free
   `SandboxStagedJobReportSurface`，不返回或构造第二个完整owned surface。
3. staged receipt逐字段回显surface/stored/operation/job/run/status/time relation，但不是commit evidence；application必须先
   `validate_source`，再同UoW stage generic carrier与idempotency completion。
4. `get_job_report_surface_with_version`保持返回完整owned `Versioned<SandboxStoredJobReportSurface>`；owned maintenance draft
   只在committed read/rehydration形成，不在fresh write形成。
5. durable/fake都必须持久化完整selection/batch/item/token/reason/trace字段并在read侧同义rehydrate；fake不能只存receipt。
6. typed store method总数仍为`6/6`，stored kind仍为`3/3`，没有新增public DTO、application callable或repository method数量。

| closure | result |
|---|---:|
| fresh caller-owned complete chain | `1` |
| application/store second owned complete chain | `0` |
| fresh save full-data persistence | required |
| fresh save return | body-free staged receipt |
| committed read return | full owned frozen surface |
| typed method count | `6/6` unchanged |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R typed store borrowed write activation drafted
artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
artifact_content_status = drafted_pending_physical_eof_activation
artifact_review_status = not_current_until_physical_eof_activation
current_authority = historical_position_activation_draft_only
typed_surface_method = 6/6
job_report_save_output = SandboxStagedJobReportSurface
job_report_committed_read_output = Versioned<SandboxStoredJobReportSurface>
fresh_owned_complete_batch_chain_in_application = 0
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = reaudit_worker_and_nine_paged_jobs_terminal_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## 71. `S7-02D-B6` Closure 输入、问题回答与裁决方法

本批只消费 B1~B5 已写入的 current authority，不新增第 43 个 application callable、第四类 stored surface、
第十类 maintenance selector、repository writer、DTO、状态或外部 port。closure 检查按以下顺序执行：

```text
Step 6 canonical object / named ref / core Version
  -> B1 exact identity and conflict binding
  -> B2 committed-read / write-UoW and atomic claim
  -> B3 carrier + three typed frozen surfaces
  -> B4 fresh / replay / failure / unknown whole-group
  -> B5 nine bounded readers and facade join
  -> repository / facade / control current EOF overlays
```

### 71.1 SOP 问题回答

| closure问题 | B6结论 |
|---|---|
| 每个持久化identity是否有唯一owner和来源 | 是。operation identity为`operation_name + idempotency_key + request_digest`；binding只定位同operation/key winner；durable refs只由fresh winner路径的typed allocator/store生成。 |
| duplicate是否能只读重放 | 是。committed snapshot只暴露read能力；record、carrier和matching typed surface逐层exact读取、统一校验；任一缺口fail closed且business/external/write为0。 |
| fresh写组是否可原子解释 | 是。reservation-only先独立commit；completion把record、carrier、matching full surface及必要same-UoW关系作为冻结whole group；terminal failure不伪造stored surface。 |
| commit/rollback unknown是否会被猜成成功或缺失 | 否。三种inspection mode只返回`FullyCommitted | FullyAbsent | Indeterminate`；`NotCommitted`、`StatusUnknown`与rollback unknown不互换。 |
| maintenance index是否接管truth | 否。九个reader只给candidate；action前必须exact owner、core `Version`、relation与domain eligibility重验，reader没有write/external/repair/delete能力。 |
| Query或reconciliation是否借用paged index | 否。Query maintenance/write为`0/13`；reconciliation paged reader为`0/1`，继续使用explicit scope。 |
| `REF-001`能否关闭 | 能。`7R-02A~D` current positive path只使用Step 6 named refs与core `Version`；opaque ref、旧version wrapper、generic external target和第二durable identity均只存在于historical/forbidden材料。 |
| 是否需要在本批扩写测试、审计或交付 | 否。只保留fake/durable parity义务与静态检查结果；没有运行测试、run_id、evidence、验收或实现事实。 |

### 71.2 Historical material 与 current positive path 分类

全文件文本扫描会命中 `SandboxOpaqueRef`、旧version wrapper、`find_latest`、generic target和旧恢复状态，因为这些名称被保留在
historical diagnosis、negative inventory或被后置 current overlay 覆盖的恢复轨迹中。B6 不删除该审计轨迹，也不把“全文件
零命中”伪装成门禁；它按用途分类：

| 命中类别 | 是否允许 | current裁决 |
|---|---|---|
| historical material / conflict example | 允许保留 | 不可被current callable、trait、constructor、facade或恢复点引用为正向路径。 |
| forbidden / negative inventory | 允许保留 | 明确计数为0或明确禁止，供实现和后续审计使用。 |
| 被物理EOF current override覆盖的旧状态块 | 允许保留 | 只作为执行轨迹；恢复必须读取各文件最后一个override。 |
| current Rust contract / positive mapping / next action | 不允许旧口径 | B6审计未发现旧opaque ref、旧`SandboxRepositoryVersion`、generic external target、decode/restart token或latest/all-scan正向消费者。 |

## 72. B1~B5 L1 / L2 Closure Matrix

### 72.1 L1 主流程一致性

| closure surface | required authority | observed current closure | unresolved |
|---|---|---|---:|
| exact identity / conflict | B1 §§7~8 | persisted triple、二元binding、3-state record、finite claim observation | 0 |
| read / write capability | B2 §§11~15 | committed read snapshot与write UoW分离；5/5 idempotency method；core `Version` CAS | 0 |
| stored replay | B3 §§17~50 | carrier `2/2`、typed store `6/6`、Command/Consumer/Job `3/3`、统一validator和no-rerun | 0 |
| fresh reservation owner | facade current §52 + B4 | 10 Command + 9 Consumer + 10 Job = `29/29`；Query `0/13` | 0 |
| existing classification | B4 §§52~54 | conflict/in-flight/completed/failed `4/4`，duplicate exact replay不重跑 | 0 |
| completion / failure | B4 §§54~55 | replayable completion与terminal failure `2/2`；second durable identity `0` | 0 |
| unknown inspection | B4 §§56~58 | mode `3/3`、result `3/3`、inspection write/identity/cursor/clock/external均0 | 0 |
| callable join | facade + B5 §70 | Command `10/10`、Query `13/13`、Consumer `9/9`、Job `10/10`，总计`42/42` | 0 |

### 72.2 L2 必要 maintenance 保障契约

| closure surface | current result | safe default / stop point | unresolved |
|---|---|---|---:|
| selector / reader | existing selector `9/9`、exact read-only method `9/9` | unknown/integrity不是empty；不提供generic read | 0 |
| snapshot / cursor | immutable generation、selector/family/limit/last-key binding | expired/unavailable typed failure；不从current index补页 | 0 |
| target identity | 九类typed stable identity；capability为backend source + requirement ref | status/time/current summary不参与identity | 0 |
| owner recheck | index candidate后exact reload + `Version` + domain guard | race可Skip；integrity contradiction整页fail | 0 |
| retention | terminal whole-group eligibility与active snapshot/replay/security hold红线 | 无delete/purge/TTL/DDL/scheduler算法 | 0 |
| fake/durable parity | 14/14 contract dimensions | 是后续`7R-05`义务，不声称已测试 | 0 |
| Query / reconciliation隔离 | Query index/write `0/13`；reconciliation reader `0/1` | 不把运维index变成产品query或repair truth | 0 |

### 72.3 Internal item 与 `REF-001` 裁决

| item | final status | closure evidence |
|---|---|---|
| `S7-02D-INT-01` | closed | committed read snapshot与write UoW capability分离。 |
| `S7-02D-INT-02` | closed | atomic claim、candidate/winner与finite repository error闭合。 |
| `S7-02D-INT-03` | closed | carrier和三类typed surface save/get对称，integrity缺口no-rerun。 |
| `S7-02D-INT-04` | closed | fresh/duplicate/failure/commit-unknown whole-group和exact inspection闭合。 |
| `S7-02D-INT-05` | closed | 九个bounded selector/reader、snapshot cursor、retention redline与parity闭合。 |
| `SBX-DDD-GRANULARITY-STEP7-REF-001` | resolved_in_7r_02d | `7R-02A~D` named ref/core `Version`、repository/stored/index正向差集均为0；transient carrier不生成第二identity。 |

`REF-001`关闭的是 Step 7 repository/consistency 内部缺口，不表示整个 Step 7完成。`DISPATCH-001`、`OUTCOME-001`、
`READ-001`和`ENTRY-001`仍按既定owner等待`7R-03~06`；Step 8继续被Step 7 regression阻塞。

## 73. 正式 `03` 回填草稿

以下内容是 Step 19 正式装配输入，不在本批直接写入 `03-详细设计.md`：

1. `application`拥有exact idempotency identity、atomic claim、committed read snapshot、write UoW、stored carrier与三类typed
   frozen surface store；`infra`只实现port，不改变winner、status、relation或错误语义。
2. 29个write-capable callable只在fresh reservation committed后进入业务体。duplicate必须从exact completed record、carrier和
   matching typed surface重放；missing、wrong-kind、invisible、corrupt或partial relation均fail closed，禁止重跑或从current truth重建。
3. completion、terminal failure与commit-unknown分别使用冻结whole-group plan；unknown只返回
   `FullyCommitted | FullyAbsent | Indeterminate`并采取保守映射，不二次调用外部系统或生成durable identity。
4. 九个maintenance Job各使用一个exact bounded reader。selection snapshot不可变、cursor绑定selector/family/limit/generation，
   index hit只给candidate，action前必须exact owner、core `Version`与domain eligibility重验。
5. retention只定义terminal-safe whole-group红线，不定义物理删除、TTL、DDL或scheduler。13个Query不消费maintenance index且保持
   zero-write；reconciliation继续使用explicit scope。

正式装配时必须引用本文 §§71~74，并同时引用 B1~B5 的exact Rust-facing章节；不得只复制上述五条摘要后省略签名、错误和矩阵。

## 74. 自检、待确认事项与进入下一批条件

| check | B6 result |
|---|---|
| B1~B5 internal item | `5/5 closed` |
| idempotency repository / carrier / typed store | `5/5 + 2/2 + 6/6` |
| typed stored surface | `3/3` |
| whole-group mode / result | `3/3 + 3/3` |
| selector / reader / parity | `9/9 + 9/9 + 14/14` |
| callable / fresh / Query write | `42/42 + 29/29 + 0/13` |
| named ref / core Version current positive gap | `0` |
| new L1/L2 upstream blocker | `0` |
| real implementation/test/evidence/acceptance fact | `0` |

待确认事项只有内容门禁：用户审查 `7R-02A~D` repository/consistency产物。确认后下一合法内容任务是
`S7-03A identity/reference/policy/capability resolver`；不得直接进入 Step 8、正式 `03` 装配或implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_task = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
internal_items = 5/5_closed
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
stored_surface_kind = 3/3
whole_group_mode = 3/3
whole_group_result = 3/3
maintenance_selector = 9/9
maintenance_reader = 9/9
parity_obligation = 14/14_not_executed
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
ref_blocker = resolved_in_7r_02d
remaining_step_7_internal_blockers = 4/6_open_with_owner
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_03a
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Foundation: `S7-02D-B5` corrected selector/index draft

> 本节因 patch 锚点命中文件前部而保留为 non-authoritative foundation，不是物理 EOF，也不改变恢复状态。
> 只有本文物理 EOF 的 `S7-02D-B5` current authority逐条显式采纳后，本节的common page、selector、lease target和
> first-materialization carrier才生效。本节不修改正式 `03~07`，不表示代码、compile、test、run、evidence、验收或
> commit 已发生。

### 61. B5 边界、冲突关闭与不扩张裁决

| 项 | current 结论 |
|---|---|
| consumed predecessor | B4 的 29/29 reservation、duplicate/unknown zero-rerun、one committed snapshot和exact owner reload。 |
| targeted internal gap | `S7-02D-INT-05`：九个 maintenance Job 的必要 bounded selector/index、stable page、retention redline和fake/durable parity。 |
| selector authority | permit 冻结 exact selector identity、首次 trusted cutoff和initial page limit；repository从一个 snapshot-bound immutable index逐页返回target。 |
| target authority | index item只是候选和exact reload key；不拥有状态迁移、external call、release、cleanup、repair或success判断。 |
| public surface | public DTO、public callable、business status、write repository、delete/purge API均新增0；Step 8仍拥有wire schema。 |
| Query scope | 13个Query消费本节maintenance index为`0/13`；Query正式read port仍归`7R-04A`。 |
| reconciliation scope | `RunSandboxReconciliation`继续消费Step 6完整explicit scope，不进入第十个paged reader。 |
| out of scope | tools semantic execution、runtime agent loop、member lifecycle orchestration、通用搜索、运维控制台、DDL、TTL数值与物理清理算法。 |

此前 facade 把泛型 `S` 同时解释为“完整target vector”和“repository分页selector”，两者不能共同实现。current 关系固定为：

```text
validated job selector fields
  -> freeze selector identity + one trusted selection cutoff
  -> open or resume one immutable committed selection snapshot
  -> read one stable bounded target page
  -> reload each exact owner in a current committed snapshot
  -> re-evaluate domain eligibility and safety guards
  -> process or safely skip the item
```

permit 不再冻结全量target vector。空第一页只表示该 selector/snapshot 的formal empty；它不表示`all`、repository
unavailable或selector invalid。后续页不得刷新selector fields、page limit或selection cutoff，也不得在原snapshot不可继续时
静默打开新snapshot。`CursorSnapshotUnavailable`只能终止当前reserved invocation并交typed recovery；不能“从当前位置附近”
继续。

### 62. Common snapshot-bound paging contract

#### 62.1 Cursor、page request和closed target identity

```rust
/// application-local maintenance selection cursor；只由 matching infra codec签发和消费。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxRepositoryCursor(String);

impl SandboxRepositoryCursor {
    /// 只允许 infra codec 从校验后的non-empty opaque token构造。
    pub(crate) fn try_from_encoded(
        value: String,
    ) -> Result<Self, SandboxSelectionReadError>;

    /// 只允许matching codec读取opaque token；application不解析payload。
    pub(crate) fn encoded(&self) -> &str;
}

/// 一页maintenance selection的application-local request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxSelectionPageRequest {
    /// 首页为None；续页必须来自上一页的matching cursor。
    cursor: Option<SandboxRepositoryCursor>,
    /// 经job config与全局protocol ceiling共同验证的正上限。
    limit: NonZeroU32,
}

impl SandboxSelectionPageRequest {
    /// 校验limit ceiling和cursor shape；不读clock、truth或repository。
    pub fn try_new(
        cursor: Option<SandboxRepositoryCursor>,
        limit: NonZeroU32,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub fn cursor(&self) -> Option<&SandboxRepositoryCursor>;
    pub fn limit(&self) -> NonZeroU32;
}

/// 九类target可返回的closed stable identity；只用于page内去重和order验证。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxSelectionTargetIdentity {
    EventRelay(SandboxEventRelayRecordRef),
    ReferenceState(ReferenceResolutionStateRef),
    BackendCapability {
        backend_kind: ExternalSourceKind,
        backend_resource_ref: ResourceRef,
        requirement_ref: BoundaryRequirementSetRef,
    },
    MaterialHandoff(HandoffFactRef),
    Lease(LeaseRecordRef),
    CleanupGuard(CleanupGuardRef),
    Redline(RedlineContainmentRef),
    Projection(SandboxReadProjectionRef),
    Derived(DerivedInspectPreviewTrendStateRef),
}

mod selection_target_sealed {
    pub trait Sealed {}
}

/// 只允许本文件登记的九类immutable target实现，防止generic page虚假声称可去重。
pub trait SandboxSelectionTarget: selection_target_sealed::Sealed {
    /// 返回不会读取body、status、Version或clock的stable identity。
    fn stable_identity(&self) -> SandboxSelectionTargetIdentity;
}

/// 一个formal selector在同一committed selection snapshot上返回的稳定有界页。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxSelectionPage<T: SandboxSelectionTarget> {
    /// 已按reader canonical order排序的ordered-unique immutable targets。
    items: Vec<T>,
    /// matching snapshot仍有后续项时存在；不得由last item或count自行计算。
    next_cursor: Option<SandboxRepositoryCursor>,
}

impl<T: SandboxSelectionTarget> SandboxSelectionPage<T> {
    /// 校验size、stable identity严格递增和empty/continuation relation。
    pub fn try_new(
        items: Vec<T>,
        next_cursor: Option<SandboxRepositoryCursor>,
        limit: NonZeroU32,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub fn items(&self) -> &[T];
    pub fn next_cursor(&self) -> Option<&SandboxRepositoryCursor>;
    pub fn is_terminal(&self) -> bool;
}
```

`SandboxSelectionPage::try_new` 必须先checked转换`limit -> usize`，再验证`items.len() <= limit`；逐项调用
`stable_identity()`，要求严格递增，因此同时关闭duplicate和non-canonical order。空页必须`next_cursor=None`；非空页允许
terminal。constructor不排序、不去重、不修复adapter输出。若一个reader的业务target含多个subtarget，例如handoff group，
page identity仍是aggregate `HandoffFactRef`，组内target由carrier自己的ordered-unique规则校验。

#### 62.2 Cursor logical payload、replay与PageToken codec

cursor 的logical payload至少绑定：

| bound field | exact source | mismatch | forbidden substitute |
|---|---|---|---|
| reader family | 九个exact trait method的closed discriminator | `CursorSelectorMismatch` | trait名字符串、route、binary、topic |
| selector fingerprint | selector全部canonical fields，排除page request | `CursorSelectorMismatch` | idempotency digest、Debug文本、config ref文本 |
| committed snapshot generation | 首页打开的immutable selection generation | `CursorSnapshotUnavailable` | core `Version`、truth/reference cursor、clock |
| last stable order key | matching reader的closed tuple | `CursorCorrupt` | row offset、last object body、timestamp only |
| page limit | 首页validated positive limit | `CursorLimitMismatch` | continuation override、config hot reload |

同一selector/cursor在snapshot保留期内必须可重复读取并返回逐字段相同的page；cursor不是一次性状态，也不因一次成功读取被
删除。该规则允许response丢失后的read-only重取，但不授权重复执行items；normal path的move-only permit仍禁止并发页推进。
adapter可采用signed opaque encoding，但不能暴露raw database key、SQL offset、table/partition name、tenant secret或object
body。snapshot已不可恢复时必须返回typed error，不能重开新snapshot或从last key在current store近似续读。

repository cursor到Step 6 batch `PageToken` 的转换只允许通过application facade的matching encoder：

```rust
pub trait SandboxMaintenancePageTokenCodec: Send + Sync {
    /// 将repository continuation编码为body-free core PageToken；不得改变cursor binding。
    fn encode(
        &self,
        job_kind: SandboxJobKind,
        cursor: &SandboxRepositoryCursor,
    ) -> Result<PageToken, SandboxSelectionReadError>;
}
```

codec无repository、clock、identity allocator或write能力。current normal path没有合法 `decode` consumer：九个 paged Job
的 Start 明确拒绝 initial public token，Continue 线性 move permit 内部的 repository cursor；duplicate在读取 cursor 前直接
replay stored report。保留 `decode` 会制造第二条 restart/resume authority，因此 current port仅有 `encode`。`PageToken`只保存
到 `SandboxMaintenanceBatchOutcome` / report chain，供审计完整保留 input/next relation；它不是repository key、恢复授权、
public initial continuation或下一次 invocation input。`SandboxRepositoryCursor`不进入public DTO、domain truth、idempotency
identity或stored result body。Step 8只可机械输出已编码token，不能解析、重签或回送为新 Start cursor。

#### 62.3 Finite read error

```rust
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxSelectionReadError {
    InvalidLimit,
    CursorCorrupt,
    CursorSelectorMismatch,
    CursorLimitMismatch,
    CursorSnapshotUnavailable,
    IndexIntegrityViolation,
    Unavailable,
}
```

`CursorSnapshotUnavailable | Unavailable`可由上层作为operation-level retryable dependency failure映射，但同一reserved
invocation不得重开selector。`IndexIntegrityViolation` fail closed并进入reconciliation/quarantine；不能跳坏row继续返回
success page。错误不携带SQL、driver、path、raw cursor、host或object body。

### 63. Nine frozen selector identities and target carriers

#### 63.1 Selector fields and common constructor rules

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PublishSandboxEventRelaySelection {
    context_ref: ControlledExecutionContextRef,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefreshSandboxReferenceStatesSelection {
    context_ref: ControlledExecutionContextRef,
    source_kind_filter: Vec<ExternalSourceKind>,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefreshBackendCapabilitySummariesSelection {
    context_ref: ControlledExecutionContextRef,
    backend_filter: Vec<ExternalSourceRef>,
    requirement_filter: Vec<BoundaryRequirementSetRef>,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetryPendingMaterialHandoffsSelection {
    context_ref: ControlledExecutionContextRef,
    target_kind_filter: Vec<HandoffTargetKind>,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RunLeaseOrphanReaperSelection {
    context_ref: ControlledExecutionContextRef,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvaluatePendingCleanupGuardsSelection {
    context_ref: ControlledExecutionContextRef,
    include_blocked: bool,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaintainRedlineContainmentHandoffsSelection {
    context_ref: ControlledExecutionContextRef,
    selection_cutoff: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RebuildSandboxReadProjectionsSelection {
    context_ref: ControlledExecutionContextRef,
    explicit_projection_refs: Vec<SandboxReadProjectionRef>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaintainDerivedInspectPreviewTrendSelection {
    context_ref: ControlledExecutionContextRef,
    supported_kinds: Vec<DerivedMaterialKind>,
}
```

每个struct必须有独立`try_new`和只读getter；不得用generic selector、macro-only public API或`SandboxOpaqueRef`代替。共同规则：

1. `context_ref` required且不从first target反推。
2. 时间敏感的前七类selector在`Start`前只读一次trusted clock并冻结`selection_cutoff`；continuation不再读selection clock。
3. enum/ref filter按其derived `Ord`要求strictly increasing；constructor拒绝duplicate和non-canonical order，不自动排序。
4. empty `source_kind_filter`、`backend_filter`、`requirement_filter`、`target_kind_filter`表示“在已验证context/registered
   job scope内不再收窄该维度”，不表示跨context/global all。empty `supported_kinds`无效；只允许ordered-unique
   `Inspect | Preview | Trend`，拒绝`BackendComparison | Reconciliation`。
5. projection selector必须至少有一个explicit projection ref。若未来重新启用registered projection scope，Step 8必须先定义
   typed scope carrier和expansion port；当前不得复活historical opaque scope或“empty => scan stale”。
6. backend filter若非空，每项必须为`ExternalSourceKind::IsolationBackend`；identity按`source_kind + resource_ref`，
   source version/digest是expected observation，不参与stable identity，但续页selector必须逐字段不变。
7. `include_blocked=false`只排除已知`Blocked` candidate；它不把unknown/evidence gap变成Allowed。该bool来自validated job
   input，不由repository、config default或fake私有状态补值。

#### 63.2 Selection-time proof carriers

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReferenceRefreshTarget {
    reference_state_ref: ReferenceResolutionStateRef,
    expected_source: ExternalSourceRef,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LeaseReaperSelectionBasis {
    /// index命中owner已提交的exact marker。
    CommittedMarker(ReaperEligibilityMarker),
    /// Active/Expiring lease按可验证physical cutoff列进入候选；不是domain marker。
    WindowCutoff {
        expected_starts_at: Timestamp,
        expected_duration_millis: NonZeroU64,
        expected_renewal_deadline_offset_millis: Option<NonZeroU64>,
    },
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LeaseReaperTarget {
    lease_ref: LeaseRecordRef,
    selection_basis: LeaseReaperSelectionBasis,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionTargetRegistrationProof {
    projection_ref: SandboxReadProjectionRef,
    context_ref: ControlledExecutionContextRef,
    source_audit_trace_ref: SandboxAuditTraceRef,
    registered_at: Timestamp,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProjectionMaintenancePosition {
    RegisteredFirst(ProjectionTargetRegistrationProof),
    Existing {
        stale_markers: SandboxProjectionStaleMarkerSet,
    },
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionMaintenanceTarget {
    projection_ref: SandboxReadProjectionRef,
    context_ref: ControlledExecutionContextRef,
    position: ProjectionMaintenancePosition,
    source_audit_trace_ref: SandboxAuditTraceRef,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DerivedMaintenancePosition {
    RegisteredFirst {
        never_materialized: DerivedNeverMaterializedProof,
    },
    Existing {
        rebuild_marker: DerivedRebuildMarker,
    },
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DerivedMaintenanceTarget {
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    context_ref: ControlledExecutionContextRef,
    derived_kind: DerivedMaterialKind,
    source_refs: DerivedSourceRefSet,
    position: DerivedMaintenancePosition,
    source_audit_trace_ref: SandboxAuditTraceRef,
}
```

上述类型均提供字段同名getter和checked constructor，并实现sealed `SandboxSelectionTarget`。关键关系：

- `ReferenceRefreshTarget`直接携带resolver所需`ExternalSourceRef`；service/fake不得从state ref反查bundle、扫描sibling或解析ref。
- `LeaseReaperSelectionBasis::WindowCutoff`允许尚无marker的Active lease进入候选，但只复制可由loaded `LeaseWindow`逐字段
  重验的index值。它不等于`ReaperEligibilityMarker`，也不授权orphan/release。若loaded lease已有marker，必须使用
  `CommittedMarker`并逐字段相等；index同时声称两种互斥basis为integrity error。
- `ProjectionTargetRegistrationProof`只证明stable target在formal registry登记，不证明projection row absent。first writer仍在
  write UoW中重验exact projection/current-materialization key absent；`get NotFound`不是first proof。
- projection `Existing`要求non-empty matching stale marker set；Fresh/no-marker target不得仅因定时扫描被选中。
- derived first branch直接复用`DerivedNeverMaterializedProof`，替代historical bool；proof的context/state/kind与target全等。
  existing branch要求matching non-Fresh owner与marker。`None`、empty source、status-only row或fake private map都不是first proof。
- projection/derived的`source_audit_trace_ref`必须等于registration/marker/proof或formal source index已有linkage；constructor不生成
  audit identity，也不把audit存在解释为eligibility。

---

## Historical-Position Draft: `S7-02D-B5` selector/index contract

> 本节因 patch 定位命中文件中段而保留为 non-authoritative draft。其 carrier / cursor / target 定义只有在本文物理 EOF 的
> `S7-02D-B5` current authority 显式采纳后才生效；不得单独据此恢复状态或实现。前述 B1~B4 继续分别拥有 exact identity、
> stored surface 和 whole-group algorithm。本节不表示正式文档、代码、compile、test、run、evidence、验收或 commit 已发生。

### D61. B5 开工门禁、问题诊断与裁决

| 项 | current 结论 |
|---|---|
| consumed predecessor | B4 的 29/29 reservation kernel、duplicate/unknown zero-side-effect、committed snapshot 和 exact owner load。 |
| closed gap | `S7-02D-INT-05`：必要 maintenance selector/index、稳定有界页、retention terminal-safe 规则和 fake/durable parity。 |
| current level | selector/index 本体为 L2；relay attempt、lease/orphan、cleanup、redline 等候选若错误扩大可导致安全误判，相关 deny-set 按 L1。 |
| public surface | 0 个 public DTO / protocol selector / public callable；本批只定义 application-local read port 和 carrier。 |
| query scope | 不定义 13 个 Query 的正式 read port；它们仍由 `7R-04A` 拥有。本批只证明 Query 不消费 maintenance index。 |
| reconciliation scope | `RunSandboxReconciliation` 继续消费完整 explicit scope，不进入第十个 paged reader。 |
| retention scope | 只定义 terminal whole-group 候选和保留红线，不定义 delete/purge/tombstone method、DDL、TTL 数值或 cleanup command。 |

历史设计存在两项不能同时成立的口径：一方面 `SandboxJobInvocationPermit<S>` 把 `S` 描述为一次 invocation 的完整 target
集合；另一方面 facade 又要求 selection reader 按 token 从 repository 返回每页 target。若两者都保留，implementation
必须自行选择“由 entry 传全量 targets”或“由 repository 重算 eligible targets”，形成两个真相源。current 裁决固定为：

```text
freeze exact selector identity and selection cutoff once
  -> open one committed selection snapshot
  -> read immutable target pages from that snapshot
  -> carry snapshot-bound cursor to the next page
  -> reload each exact owner and re-evaluate domain eligibility
```

`selector identity` 只限定 context、explicit filter / scope 和首次 trusted cutoff；`target page` 才保存当前页 exact targets。
permit 冻结 selector，不冻结全量 target vector。空第一页表示在该 snapshot/selector 下 formal empty，不表示 `all`；后续页
不得重开 snapshot 或刷新 cutoff。旧 `SandboxMaintenanceSelectionRepository` 返回 mutable objects / `Versioned<T>`、旧
`SandboxReferenceRefreshScope::StaleOrDegraded`、`find_latest_*`、无 scope 的 list 和 adapter private scan 全部登记为
`historical_material`，不得实现 compatibility wrapper。

### D62. Stable bounded selection foundation

#### D62.1 Snapshot-bound repository cursor

```rust
/// application-local maintenance selection cursor；只能由 selection adapter 签发和消费。
///
/// cursor 绑定 selector fingerprint、committed snapshot generation、last stable key 和 page limit；
/// 它不进入 public DTO、domain truth、stored result 或 idempotency identity。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxRepositoryCursor(String);

impl SandboxRepositoryCursor {
    /// 只允许 infra cursor codec 从经过完整校验的 non-empty token 构造。
    pub(crate) fn try_from_encoded(value: String) -> Result<Self, SandboxSelectionReadError>;

    /// 只允许 matching selection adapter 读取 opaque token；application 不解析字段。
    pub(crate) fn encoded(&self) -> &str;
}

/// 一页 maintenance selection 的 application-local request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxSelectionPageRequest {
    /// 首次读取为 None；续页必须原样使用上一页返回的 cursor。
    cursor: Option<SandboxRepositoryCursor>,
    /// 由 validated job-run config 与 protocol ceiling 共同限制的正上限。
    limit: NonZeroU32,
}

impl SandboxSelectionPageRequest {
    /// 校验 limit ceiling 和 cursor shape；不读取 clock、truth 或 repository。
    pub fn try_new(
        cursor: Option<SandboxRepositoryCursor>,
        limit: NonZeroU32,
    ) -> Result<Self, SandboxSelectionReadError>;

    /// 返回 optional snapshot-bound cursor。
    pub fn cursor(&self) -> Option<&SandboxRepositoryCursor>;

    /// 返回本页最大 target 数。
    pub fn limit(&self) -> NonZeroU32;
}

/// 一个 formal selector 在同一 committed snapshot 上返回的稳定有界页。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxSelectionPage<T> {
    /// 按 selector canonical order 返回的 ordered-unique immutable targets。
    items: Vec<T>,
    /// matching snapshot 中仍有后续项时存在；不得从最后 item 或 count 计算。
    next_cursor: Option<SandboxRepositoryCursor>,
}

impl<T> SandboxSelectionPage<T> {
    /// 校验 items 不超过 limit、identity 唯一，以及 empty/continuation 关系。
    pub fn try_new(
        items: Vec<T>,
        next_cursor: Option<SandboxRepositoryCursor>,
        limit: NonZeroU32,
    ) -> Result<Self, SandboxSelectionReadError>;

    /// 返回稳定顺序的本页 targets。
    pub fn items(&self) -> &[T];

    /// 返回 matching committed snapshot 的 continuation。
    pub fn next_cursor(&self) -> Option<&SandboxRepositoryCursor>;

    /// 判断该页是否已明确耗尽 selector。
    pub fn is_terminal(&self) -> bool;
}
```

cursor 的 logical payload 至少绑定以下五项，但 application 不读取其编码字段：

| bound field | exact source | mismatch behavior | forbidden substitute |
|---|---|---|---|
| selection family | 当前 9 个 exact reader method | `CursorSelectorMismatch` | trait name string、route、job binary |
| selector fingerprint | canonical selector fields，排除 page request | `CursorSelectorMismatch` | request digest、idempotency key、Debug text |
| committed snapshot generation | adapter 首页打开的 immutable read generation | `CursorSnapshotUnavailable` | `Version`、truth/reference cursor、clock |
| last stable order key | current index 的 closed tuple | `CursorCorrupt` | row offset、last returned object body、timestamp only |
| page limit | 首次 validated limit | `CursorLimitMismatch` | 下一页 caller override、config hot reload |

同一 cursor 只能被同一 reader、同一 selector、同一 limit 消费一次 logical continuation。adapter 可以采用 signed/opaque
encoding，但不得把 raw database key、SQL offset、table name、tenant secret 或 object body暴露给 application。cursor 不要求
持久化为独立 row；若 snapshot 已过期或不可恢复，返回 typed unavailable，不能切到新 snapshot 后继续“近似下一页”。

#### D62.2 Common finite read errors

```rust
/// bounded selection reader 的有限失败；不携带 driver、SQL、path 或 raw token。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxSelectionReadError {
    /// page limit 为零或超过 validated ceiling。
    InvalidLimit,
    /// cursor 不是由 matching adapter 签发的完整 opaque token。
    CursorCorrupt,
    /// cursor 绑定了另一 selection family 或 selector fingerprint。
    CursorSelectorMismatch,
    /// continuation 更改了首次 page limit。
    CursorLimitMismatch,
    /// 原 committed snapshot generation 已不可继续读取。
    CursorSnapshotUnavailable,
    /// index entry 与 canonical owner identity / relation 不一致。
    IndexIntegrityViolation,
    /// committed selection store 当前不可用。
    Unavailable,
}
```

`CursorSnapshotUnavailable | Unavailable` 是可重试的 operation-level error，但不得在同一 reserved invocation 内重新打开
selector；上层只能按 Step 9/12 的显式恢复规则处理。`IndexIntegrityViolation` fail closed 并进入 reconciliation/quarantine，
不能跳过坏 entry 后继续返回 success page。fake/durable adapter 必须逐 variant 对称，不得让 fake 接受任意字符串 cursor。

### D63. Exact selector identities and immutable target carriers

所有 selector 都是 application-local、checked、immutable carrier。它们必须实现稳定 field equality，但不实现 public
serialization；Step 8 只映射 selector 所需 explicit fields，不能把 cursor 或 repository status 暴露为 caller authority。
时间敏感 selector 的 `selection_cutoff` 只在 `Start` 之前从 trusted clock 冻结一次，续页不读取新 clock。

| reader family | frozen selector identity | page item / direct load key | index candidate condition | load-after-selection recheck |
|---|---|---|---|---|
| relay publish | context + selection cutoff | `SandboxEventRelayRecordRef` | `Pending`，或无 active attempt 且 retry window在 cutoff前到达的 `Retryable` | rehydrate record/payload/source/key；`evaluate_attempt_eligibility(cutoff)`；terminal/active/integrity entry拒绝 |
| reference refresh | context + explicit source-kind filter + cutoff | `ReferenceRefreshTarget { state_ref, expected_source }` | status为 `Stale | Unresolved | Unavailable`，或 formal recheck marker在 cutoff前 | exact get + Version；loaded binding全字段等于 expected source；resolver直接消费 source，不反查 private map |
| capability refresh | context + explicit backend/requirement scope + cutoff | `BackendCapabilityRefreshTarget` | current summary缺失，或 `requires_refresh_at_age` 在 cutoff成立 | load requirement/current summary exact relation；重新计算 checked age；`Unsupported`不得因 scan 变 refresh |
| handoff retry | context + explicit target-kind filter + cutoff | `PendingMaterialHandoffGroup` | handoff含 `Pending` target，或 retry-not-before在 cutoff前到达的 `Retryable` target | load aggregate + Version；target plan/progress exact match；active attempt、Delivered/Failed target不得调用 external port |
| lease/orphan reaper | context + cutoff | `LeaseReaperTarget { lease_ref, expected_marker }` | existing marker为 Expiring/Expired/LifecycleConflict，或可验证 expiry index边界在 cutoff前 | exact lease/handle/marker relation；clock给 checked elapsed；domain `position_at_elapsed` / marker transition重新判定 |
| cleanup guard | context + cutoff | `CleanupGuardRef` | `PendingEvidence | PendingInvestigation | Blocked | Allowed` 且 formal evidence/recheck marker要求评估 | load full evidence/redline/handoff/release basis；`Allowed`不是 release 或 completed；unknown保持 blocked |
| redline handoff | context + cutoff | `RedlineContainmentRef` | `Detected | Contained | HandoffPending` 且 preservation/investigation relation要求推进 | load complete containment/preservation/investigation relation；`Released | Terminal`永不进入 page |
| projection rebuild | context + explicit projection scope | `ProjectionMaintenanceTarget` | formal target registry + stale marker，或 registered first-materialization target | load source index与complete redline coverage；first branch必须有 formal registry proof；`NotFound`不是 first proof |
| derived maintenance | context + explicit kind/scope | `DerivedMaintenanceTarget` | formal target registry + stale/failure/unavailable marker，或 registered first-materialization target | exact state/source-set/materialization index；reuse `DerivedNeverMaterializedProof`；不从 empty/NotFound/private map造 first |

以下 carrier 对历史 selection 作最小补强；它们不是新的 domain truth：

```rust
/// reference refresh 的直接 resolver/load key；防止 state ref 命中后再扫描 source bundle。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReferenceRefreshTarget {
    /// 长期 state identity。
    reference_state_ref: ReferenceResolutionStateRef,
    /// selection snapshot 中的 exact external source observation。
    expected_source: ExternalSourceRef,
}

impl ReferenceRefreshTarget {
    /// 校验 state/source identity non-empty；不把 source version/digest从 ref文本解析。
    pub fn try_new(
        reference_state_ref: ReferenceResolutionStateRef,
        expected_source: ExternalSourceRef,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn reference_state_ref(&self) -> &ReferenceResolutionStateRef;
    pub fn expected_source(&self) -> &ExternalSourceRef;
}

/// lease reaper 的 selection-time marker snapshot；命中不表示可释放。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LeaseReaperTarget {
    lease_ref: LeaseRecordRef,
    expected_marker: ReaperEligibilityMarker,
}

impl LeaseReaperTarget {
    pub fn try_new(
        lease_ref: LeaseRecordRef,
        expected_marker: ReaperEligibilityMarker,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    pub fn expected_marker(&self) -> &ReaperEligibilityMarker;
}

/// projection maintenance 的 registered target；first/existing由 writer在UoW内最终裁决。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionMaintenanceTarget {
    projection_ref: SandboxReadProjectionRef,
    context_ref: ControlledExecutionContextRef,
    first_materialization_registered: bool,
    source_audit_trace_ref: SandboxAuditTraceRef,
}

impl ProjectionMaintenanceTarget {
    /// bool只复制 formal registry 的 exact zero/current relation，不接受caller bool。
    pub(crate) fn try_from_committed_registry(
        projection_ref: SandboxReadProjectionRef,
        context_ref: ControlledExecutionContextRef,
        first_materialization_registered: bool,
        source_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn projection_ref(&self) -> &SandboxReadProjectionRef;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn is_registered_first_materialization(&self) -> bool;
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// derived maintenance 的 registered target；source set直接进入 formal source reader。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DerivedMaintenanceTarget {
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    context_ref: ControlledExecutionContextRef,
    derived_kind: DerivedMaterialKind,
    source_refs: DerivedSourceRefSet,
    first_materialization_registered: bool,
    source_audit_trace_ref: SandboxAuditTraceRef,
}

impl DerivedMaintenanceTarget {
    pub(crate) fn try_from_committed_registry(
        derived_state_ref: DerivedInspectPreviewTrendStateRef,
        context_ref: ControlledExecutionContextRef,
        derived_kind: DerivedMaterialKind,
        source_refs: DerivedSourceRefSet,
        first_materialization_registered: bool,
        source_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn derived_state_ref(&self) -> &DerivedInspectPreviewTrendStateRef;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn derived_kind(&self) -> DerivedMaterialKind;
    pub fn source_refs(&self) -> &DerivedSourceRefSet;
    pub fn is_registered_first_materialization(&self) -> bool;
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}
```

`first_materialization_registered` 不单独证明 absence。projection writer仍须在同一 write UoW 原子检查 exact current key；
derived first branch还须消费 existing `DerivedInspectPreviewTrendAbsenceProof` / `DerivedNeverMaterializedProof` 等正式 index
proof。任何 registry/current/materialization cardinality不一致均为 `IndexIntegrityViolation`，不得选择 latest row或自动补 identity。

## 11. B2 Committed read snapshot 与 write transaction boundary

### 11.1 统一 committed snapshot view

现有 Step 7 repository 草稿把 exact read 参数写成 `&mut dyn SandboxUnitOfWork`，而 Query、duplicate replay和
commit-unknown inspection又要求零 write UoW。current contract将读取能力从写能力中分离：write UoW持有一个
committed snapshot view，但 read-only调用只能持有后者。

```rust
/// 一个已打开、只读、同一 committed generation 的 repository snapshot。
///
/// 本 trait不暴露stage、cursor allocation、commit或rollback；Query、duplicate和inspection只能持有本类型。
pub trait SandboxCommittedReadSnapshot: Send {
    /// 返回application-local snapshot correlation；不得作为durable ref、cursor或page token。
    fn snapshot_ref(&self) -> &SandboxReadSnapshotRef;
}

/// application-local committed read snapshot identity；只用于同一调用内防止跨snapshot拼接。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxReadSnapshotRef(String);

impl SandboxReadSnapshotRef {
    /// 从infra生成的non-empty local token构造snapshot ref。
    pub fn try_new(value: String) -> ApplicationResult<Self>;

    /// 返回只读local token；不得被持久化或解析业务语义。
    pub fn as_str(&self) -> &str;
}

/// 打开与关闭公平 committed read snapshot；close没有commit语义。
pub trait SandboxCommittedReadManager: Send + Sync {
    /// 打开一个只读 committed snapshot。
    async fn open(
        &self,
    ) -> Result<Box<dyn SandboxCommittedReadSnapshot>, SandboxReadSnapshotError>;

    /// 关闭只读snapshot并消费handle；失败不改变任何业务truth。
    async fn close(
        &self,
        snapshot: Box<dyn SandboxCommittedReadSnapshot>,
    ) -> Result<(), SandboxReadSnapshotCloseError>;
}

/// write transaction在同一committed base snapshot上增加stage/cursor能力。
pub trait SandboxUnitOfWork: SandboxCommittedReadSnapshot + Send {
    /// 返回本事务的application-local identity；不得作为durable recovery key。
    fn transaction_ref(&self) -> &SandboxTransactionRef;

    /// 在完整truth write set已stage后分配唯一truth boundary cursor。
    fn assign_truth_cursor(
        &mut self,
    ) -> Result<SandboxTruthCursor, SandboxUnitOfWorkUsageError>;

    /// 在完整reference write set已stage后分配唯一reference cursor。
    fn assign_reference_cursor(
        &mut self,
    ) -> Result<SandboxReferenceCursor, SandboxUnitOfWorkUsageError>;

    /// 返回已分配但尚未必committed的truth cursor。
    fn assigned_truth_cursor(&self) -> Option<SandboxTruthCursor>;

    /// 返回已分配但尚未必committed的reference cursor。
    fn assigned_reference_cursor(&self) -> Option<SandboxReferenceCursor>;
}
```

`SandboxCommittedReadSnapshot` 是 Step 7 application-local helper，不进入 Step 6 object registry、Step 8 DTO或
public protocol。repository read method统一接受 `&mut dyn SandboxCommittedReadSnapshot`；write UoW因继承该trait，可在
同一transaction base snapshot中调用相同read method。此前 current 分件中所有“read-only UoW”表述都解释为本类型，
而不是开启一个最终靠rollback关闭的write transaction。

### 11.2 Read snapshot errors

```rust
/// 打开公平committed snapshot的有限失败；不携带driver、path或raw cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReadSnapshotError {
    /// committed reader暂不可用；没有业务读取或写入发生。
    Unavailable { reason: SandboxReason },
    /// runtime binding无法提供同一generation的公平snapshot。
    InvalidBinding { reason: SandboxReason },
}

/// 关闭只读snapshot的有限失败；不得被解释为任何write commit unknown。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReadSnapshotCloseError {
    /// reader资源关闭失败；业务读取结果仍不得改写为写入成功。
    Failed {
        snapshot_ref: SandboxReadSnapshotRef,
        reason: SandboxReason,
    },
}
```

Query与普通 read mapper可按其 surface规则将 `Unavailable`映射为degraded/unavailable；duplicate replay中打开或关闭
snapshot失败必须保守映射 `PortUnavailable`或`Internal`，不能重跑 operation。snapshot close失败不产生
`SandboxCommitUnknown`，因为没有 staged write；它只触发有限诊断/一致性处理。

## 12. B2 Idempotency persistence carriers

### 12.1 Reservation candidate

为了保持 Step 6 record private fields、checked factory与 application -> infra 依赖方向，application在调用 repository前
先形成完整 candidate record。candidate只允许在唯一 reservation kernel内构造，不对entry公开。

```rust
/// atomic reservation提交给repository的完整checked candidate；不含channel或第二套status。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxIdempotencyReservationCandidate {
    /// 完整三元 persisted identity。
    identity: SandboxIdempotencyIdentity,
    /// application allocator预生成且只允许winner持久化的record identity。
    idempotency_ref: SandboxIdempotencyRecordRef,
    /// Step 6 checked factory形成的Reserved record。
    record: SandboxIdempotencyRecord,
}

impl SandboxIdempotencyReservationCandidate {
    /// 从exact identity、candidate ref、checked call context和trusted clock构造candidate。
    pub fn try_new(
        identity: SandboxIdempotencyIdentity,
        idempotency_ref: SandboxIdempotencyRecordRef,
        context: &SandboxServiceCallContext,
        reserved_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// 返回完整persisted identity。
    pub fn identity(&self) -> &SandboxIdempotencyIdentity;

    /// 返回candidate record identity。
    pub fn idempotency_ref(&self) -> &SandboxIdempotencyRecordRef;

    /// 返回checked Reserved record；repository只能序列化该对象，不得重建字段。
    pub fn record(&self) -> &SandboxIdempotencyRecord;
}
```

`try_new` 必须调用 `SandboxIdempotencyRecord::reserve(idempotency_ref.clone(), context, reserved_at)`，再证明record与
`identity` exact match。这里需要 Step 6 object提供最小只读 accessor：

```rust
impl SandboxIdempotencyRecord {
    /// 返回record的named repository identity。
    pub fn idempotency_ref(&self) -> &SandboxIdempotencyRecordRef;

    /// 返回persisted lifecycle status。
    pub fn record_status(&self) -> SandboxIdempotencyRecordStatus;

    /// 返回Completed时的exact stored linkage。
    pub fn stored_result_ref(&self) -> Option<&SandboxStoredOperationResultRef>;

    /// 返回reservation clock time。
    pub fn reserved_at(&self) -> &Timestamp;

    /// 返回terminal clock time。
    pub fn terminal_at(&self) -> Option<&Timestamp>;
}
```

这些 accessor是 Step 6 current object的可落码补充，不新增字段、状态或转换，也不允许调用方修改private state。
operation/digest/key继续由 `SandboxIdempotencyIdentity::matches_record` 通过 record-owned checked comparison完成；
不得为infra开放raw key/digest序列化旁路。

### 12.2 Exact persisted bundle

```rust
/// idempotency repository从同一committed snapshot重建的完整checked bundle。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxIdempotencyPersistenceBundle {
    /// 完整三元 persisted identity；必须与record逐字段一致。
    identity: SandboxIdempotencyIdentity,
    /// operation/key唯一binding；必须等于identity投影。
    binding_key: SandboxIdempotencyBindingKey,
    /// Step 6 checked record和同snapshot core Version。
    record: Versioned<SandboxIdempotencyRecord>,
}

impl SandboxIdempotencyPersistenceBundle {
    /// 仅供repository adapter在row/binding/record全部通过checked relation后构造。
    pub fn try_from_committed(
        identity: SandboxIdempotencyIdentity,
        binding_key: SandboxIdempotencyBindingKey,
        record: Versioned<SandboxIdempotencyRecord>,
    ) -> Result<Self, SandboxIdempotencyRepositoryError>;

    /// 返回完整identity。
    pub fn identity(&self) -> &SandboxIdempotencyIdentity;

    /// 返回conflict lookup binding。
    pub fn binding_key(&self) -> &SandboxIdempotencyBindingKey;

    /// 返回record与Version。
    pub fn record(&self) -> &Versioned<SandboxIdempotencyRecord>;

    /// 移交完整bundle字段，不允许丢失Version或binding。
    pub fn into_parts(
        self,
    ) -> (
        SandboxIdempotencyIdentity,
        SandboxIdempotencyBindingKey,
        Versioned<SandboxIdempotencyRecord>,
    );
}
```

adapter读取 durable row后必须先使用 Step 6 checked `Deserialize`重建record，再构造identity/binding并调用
`try_from_committed`。row/binding/ref/status/time/linkage任一不一致返回 `IntegrityViolation`；禁止返回半bundle、
`Option`字段缺口或“best effort” record。

## 13. B2 Idempotency repository exact trait

### 13.1 Exact methods

```rust
/// application-owned idempotency persistence port；infra只实现，不拥有状态解释。
pub trait SandboxIdempotencyRecordRepository: Send + Sync {
    /// 按exact record ref读取完整checked persistence bundle与core Version。
    async fn get_idempotency_by_ref(
        &self,
        idempotency_ref: &SandboxIdempotencyRecordRef,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<SandboxIdempotencyPersistenceBundle, SandboxIdempotencyRepositoryError>;

    /// 按operation/key唯一binding读取winner；Absent只表示当前snapshot没有binding。
    async fn find_idempotency_by_binding(
        &self,
        binding_key: &SandboxIdempotencyBindingKey,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<SandboxIdempotencyBindingLookup, SandboxIdempotencyRepositoryError>;

    /// 在当前write UoW内原子stage exact identity/binding/Reserved record。
    /// candidate ref只能在FreshReserved分支成为durable identity。
    async fn claim_idempotency_reservation(
        &self,
        candidate: &SandboxIdempotencyReservationCandidate,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxIdempotencyClaim, SandboxIdempotencyRepositoryError>;

    /// CAS stage由Step 6 mark_completed形成的完整Completed record。
    /// matching stored carrier与full surface必须已在同一UoW stage。
    async fn save_idempotency_completion(
        &self,
        record: &SandboxIdempotencyRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxIdempotencyRepositoryError>;

    /// CAS stage由Step 6 mark_failed形成的完整Failed record；stored linkage必须为空。
    async fn save_idempotency_failure(
        &self,
        record: &SandboxIdempotencyRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxIdempotencyRepositoryError>;
}

/// operation/key binding的有限committed lookup；不是reservation结果。
#[derive(Debug, Eq, PartialEq)]
pub enum SandboxIdempotencyBindingLookup {
    /// 当前committed snapshot没有binding；不单独授权create。
    Absent,
    /// 找到唯一完整winner bundle。
    Existing(SandboxIdempotencyPersistenceBundle),
}
```

`claim_idempotency_reservation` 是 `create_idempotency_record` primitive与unique binding constraint的唯一正式封装。
application service不得再直接调用 historical `create_idempotency_record`；infra实现可内部复用相同stage primitive，但不能
同时公开两条正向create路径。`find_idempotency_by_binding(Absent)` 只用于无争用快路径与诊断，application仍必须调用
atomic claim；绝不能执行 `find Absent -> create_idempotency_record`。

### 13.2 Repository error owner

```rust
/// idempotency exact read、unique claim、CAS completion/failure的有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxIdempotencyRepositoryError {
    /// exact record ref在当前committed snapshot不存在。
    NotFound {
        idempotency_ref: SandboxIdempotencyRecordRef,
    },
    /// expected core Version与current record generation不一致。
    VersionConflict {
        idempotency_ref: SandboxIdempotencyRecordRef,
    },
    /// store/read snapshot/transaction暂不可用；不表示binding或record不存在。
    Unavailable { reason: SandboxReason },
    /// row、binding、identity、record、status、time或linkage违反current contract。
    IntegrityViolation { reason: SandboxReason },
    /// claim发现同一binding存在多个winner或constraint无法给出唯一winner。
    AmbiguousBinding { reason: SandboxReason },
    /// completion未与matching stored carrier/full surface同组stage，或failure携带stored linkage。
    TerminalGroupMismatch { reason: SandboxReason },
}
```

本 error不包含 `AlreadyExists`、`Duplicate`、`Conflict`、`InFlight` 或 `FailedTerminal`。atomic claim的合法竞争结果通过
`SandboxIdempotencyClaim::Existing`返回；只有无法给出唯一checked winner时才是 `AmbiguousBinding`。application mapping：

| repository error | application mapping | retry / safety |
|---|---|---|
| `NotFound` | duplicate/completion path为 `InternalInvariantViolation`；显式exact inspection按whole-group规则处理 | 不自动create或重跑 |
| `VersionConflict` | `ApplicationErrorDetail::VersionConflict` | 丢弃旧record/Version；完整重读，但不重复external side effect |
| `Unavailable` | `ApplicationErrorDetail::PortUnavailable` | 条件变化后由上层新调用决定；当前调用不得success |
| `IntegrityViolation`;`AmbiguousBinding`;`TerminalGroupMismatch` | `ApplicationErrorDetail::InternalInvariantViolation`，missing stored linkage例外映射duplicate missing | fail closed / reconciliation；不得默认winner |

### 13.3 Method semantics and write pairing

| method | snapshot / transaction | success | forbidden |
|---|---|---|---|
| `get_idempotency_by_ref` | committed read snapshot或write UoW base snapshot | exact checked bundle | row-only、缺binding、构造默认Version |
| `find_idempotency_by_binding` | committed read snapshot | `Absent | Existing` | latest、按channel、全表scan、digest过滤后隐藏冲突 |
| `claim_idempotency_reservation` | write UoW；transaction-scoped unique claim | `FreshReserved | Existing` | find-then-create、candidate覆盖winner、返回stage success为executing |
| `save_idempotency_completion` | write UoW + expected Version | stage Completed且exact stored linkage同组 | partial status update、先complete后补stored、wrong operation/kind |
| `save_idempotency_failure` | write UoW + expected Version | stage Failed且stored linkage为空 | 保存Unavailable、Failed转Completed、保留candidate result ref |

`claim_idempotency_reservation` 的 `Existing` bundle必须来自当前transaction可证明的唯一 committed/constraint winner，
不能是另一个尚未提交且随后可能rollback的 speculative row。若底层store无法在当前isolation/constraint语义下给出稳定
winner，应等待constraint结算或返回 `Unavailable/AmbiguousBinding`，不得让两个caller都收到 `FreshReserved`。

## 14. B2 Reservation race 与 visibility algorithm

### 14.1 Stable duplicate preflight

```text
validate checked call context
build SandboxIdempotencyIdentity + SandboxIdempotencyBindingKey
open SandboxCommittedReadSnapshot
find_idempotency_by_binding(binding)
  Existing -> close snapshot -> classify exact existing record;zero allocation/write
  Absent   -> close snapshot -> continue fresh claim path
  error    -> close snapshot -> return typed error;zero allocation/write
```

该preflight确保常规duplicate、in-flight、failed-terminal和明显digest conflict均不会预生成candidate ref。`Absent`不是
fresh ownership证明；它只授权进入atomic claim path。

### 14.2 Atomic fresh claim

```text
read trusted reserved_at
allocate one SandboxIdempotencyRecordRef candidate
build checked SandboxIdempotencyReservationCandidate
begin write UoW
claim_idempotency_reservation(candidate, uow)
  FreshReserved -> commit reservation-only UoW
      Confirmed    -> return Reserved;business body may start
      NotCommitted -> discard candidate;restart from committed preflight only if caller policy allows
      StatusUnknown-> freeze candidate identity;exact reservation inspection;no business body
  Existing -> rollback/close zero-stage UoW -> classify existing winner;discard candidate
  error -> rollback when legal -> typed error;discard candidate unless commit status unknown
```

只有 reservation-only UoW commit confirmed后，fresh caller才拥有一次 execution permission。这样确保在任何 business
source read、business identity allocation、隔离环境建立、进程启动、工具调用、capture、handoff、cleanup或publisher外呼前，
幂等winner已成为 committed recovery point。

### 14.3 Race loser and candidate identity

并发 race loser可能在 atomic claim前短暂持有一个未持久化 candidate ref，但必须满足：

1. candidate仅存在于 reservation kernel stack，不进入 application outcome、audit、trace、relay、stored surface或error reason。
2. `claim Existing` 后立即丢弃candidate；existing winner的ref是唯一后续 identity。
3. rollback confirmed后candidate不可被exact lookup发现；fake/durable都必须保持不可见。
4. claim/commit unknown时candidate不得丢弃或换新，只能作为 exact inspection输入；inspection前不重新分配。
5. candidate collision或relation mismatch返回 typed identity/integrity error，不尝试第二个ref以“提高成功率”。

因此“duplicate zero new identity”精确解释为 zero new **durable / externally observable** identity；stable duplicate预检也实现
zero allocator call。只有真正并发的 claim loser允许产生不可见candidate，这是原子唯一claim在无store-generated named ref
前提下的实现必要成本，不能泄漏为第二条truth。

### 14.4 Existing classification after claim/preflight

application对 `Existing` 只执行以下纯读取分类：

```text
bundle.binding == requested binding
  -> bundle.identity.request_digest == requested digest ?
       no  -> IdempotencyConflict
       yes -> record.status
                Reserved  -> InFlight
                Failed    -> FailedTerminal
                Completed -> B3 typed stored carrier/full surface lookup
```

classification不读取actor、trace、channel、current truth、clock或external state。它不调用 record transition、save、audit、relay、
identity allocator或result writer。`Completed`直到B3证明完整typed surface前都不能返回duplicate success。

## 15. B2 Completion / failure write contract

### 15.1 Completion prerequisites

`save_idempotency_completion` 只能在以下条件全部成立后调用：

1. 使用 committed read取得 exact `SandboxIdempotencyPersistenceBundle` 与 core `Version`。
2. record status是 `Reserved`，identity与当前 call context完全匹配。
3. operation-specific full public surface已由B3 typed store在同一UoW stage，并返回exact surface ref。
4. `SandboxStoredOperationResult` 已以同一operation、matching kind/status/surface ref在同一UoW stage。
5. application调用 `record.mark_completed(&stored_result, terminal_at)` 成功，linkage exactly-one。
6. 完整business truth/audit/relay/marker group已按所属flow声明；required member缺失时不能提交。

Repository只检查持久化group relation，不调用 `mark_completed`，也不读取public DTO body。completion stage成功仍不是
commit confirmed；commit unknown必须进入B4 whole-group inspection。

### 15.2 Failure prerequisites

`save_idempotency_failure` 只服务已经取得 committed reservation ownership、但 operation在形成可 replay full surface前终止且
当前错误策略要求terminal failed的路径。application先调用 `record.mark_failed(terminal_at)`，repository重验：

| check | required | forbidden |
|---|---|---|
| prior status | `Reserved` | `Completed/Failed`再次transition |
| stored linkage | `None` | candidate/partial surface ref |
| terminal time | `Some(>= reserved_at)` | local default、早于reserved time |
| UoW group | failure record + required safety audit/recovery marker | 假装保存完整failed public surface |
| public result | 当前没有stored row时返回application error/failed entry policy | 以后same key自动重跑 |

如果 operation已经形成完整可 replay `Failed` public surface，应走 completion路径：创建 stored carrier status `Failed`，然后
record进入 `Completed` 并链接该surface。record status `Failed`只表示“未形成完整replay surface的terminal failure”，不是
所有业务失败的统一状态。

### 15.3 B2 closed / remaining boundary

B2关闭 `S7-02D-INT-01` 和 `S7-02D-INT-02`：read/write snapshot已分离，atomic claim、exact methods、typed errors、race
winner与Version/UoW pairing已定义。B3仍必须定义 stored carrier/full surface repository并证明三个kind的save/get对称；
在此之前 `Completed` duplicate仍不可返回success。

```text
completed_internal_batch = S7-02D-B2
closed_internal_items = S7-02D-INT-01,S7-02D-INT-02
remaining_internal_items = S7-02D-INT-03,S7-02D-INT-04,S7-02D-INT-05
read_snapshot = SandboxCommittedReadSnapshot
write_transaction = SandboxUnitOfWork extends committed read snapshot
idempotency_repository_methods = 5
stable_duplicate_allocator_call = 0
query_idempotency_repository_call = 0/13
next_internal_batch = S7-02D-B3 typed stored carrier and three surface stores
batch_status = in_progress
gate_status = content_in_progress
new_l1_l2_blocker = 0
commit_required = no
```

## 16. B3 Batch 1 Owner、历史冲突与构造顺序

### 16.1 Current owner与文件边界

三类完整replay surface都是Step 7 application-local、application-owned、transport-neutral persistence carrier。它们不新增
Step 6 named truth/status owner，不是Step 8 DTO，也不是worker/jobs
entry carrier；实现只能落在Step 4已规划的`crates/application/src/services.rs`。generic
`SandboxStoredOperationResult`继续由`crates/application/src/idempotency.rs`拥有。不得新增`result_store.rs`、
`stored_surfaces.rs`、`common.rs`或在`api/worker/jobs/infra`复制同名对象。

| family | canonical owner | persist / replay | forbidden dependency |
|---|---|---|---|
| pre-store outcome body与三类surface draft/frozen object | `application::services` | typed surface store持久化完整application source | Step 8 DTO、worker receipt、jobs accumulator、infra row/SDK type |
| generic stored carrier / exact operation linkage | `application::idempotency` | immutable body-free relation | DTO body、typed surface payload副本、current truth reconstruction |
| surface store trait与error | `application` existing port/repository owner | B3 Batch 2定义 | entry handler、route/topic、generic blob API |
| durable / deterministic fake adapter | `infra` | 实现同一typed trait | 弱化kind/status/integrity校验、fake-only success |

### 16.2 Historical-position conflict裁决

| ID | historical wording | current B3裁决 |
|---|---|---|
| `S7-02D-H07` | reconciliation旧分件写成generic `SandboxStoredOperationResult`“保存本完整envelope”。 | 失效。generic carrier只保存operation/kind/status/surface identity；`SandboxReconciliationStoredJobReport`作为`JobReport` typed surface payload保存，不产生第四种stored kind。 |
| `S7-02D-H08` | worker `SandboxConsumerReceipt`可直接作为application surface store参数。 | 失效。application不得依赖worker；surface draft从validated source event、consumer selector、trace和fresh outcome parts构造。 |
| `S7-02D-H09` | jobs `SandboxJobReportAccumulator`可作为stored report truth。 | 失效。application不得依赖jobs；九个paged job只消费`FinalizeSandboxJobReportInput`移交的selection和完整`SandboxMaintenanceBatchOutcome`，reconciliation消费既有application envelope。 |
| `S7-02D-H10` | historical Step 8 DTO字段可直接成为current persistence schema。 | 失效。旧DTO只作historical field-source线索；B3先固定application frozen source，Step 8回归后机械映射，不反向拥有surface。 |

该冲突是L4-sandbox内部current-source归一，不是新的L1/L2上游blocker。`SandboxStoredResultKind`仍严格只有
`CommandResult | ConsumerReceipt | JobReport`。

### 16.3 Fresh construction order与循环消解

`SandboxServiceOutcome`要求携带已经形成的generic stored carrier，因此完整surface不能以最终
`SandboxServiceOutcome`作为fresh构造输入。唯一合法顺序固定为：

```text
validated operation-specific truth / side-effect / reason parts
  -> SandboxReplaySurfaceOutcome
  -> operation-specific surface draft carrying preallocated stored_result_ref
  -> typed store freezes full surface and generates SandboxStoredResultSurfaceRef
  -> SandboxStoredOperationResult::try_new(... exact surface ref ...)
  -> surface.validate_carrier(stored carrier)
  -> SandboxReplaySurfaceOutcome::into_service_outcome(stored carrier)
  -> entry-specific API disposition / worker receipt / jobs exit mapping
```

duplicate路径不构造draft，不分配stored/surface identity，不重组outcome parts。它只能按completed record的exact
`stored_result_ref`读取generic carrier，再按carrier的surface ref读取matching frozen surface并交Step 8机械映射。

## 17. B3 Shared Replay Surface Outcome

### 17.1 DTO-neutral original outcome body

```rust
/// 完整public surface在保存generic carrier前冻结的原始application outcome body。
///
/// 本对象不含surface identity、stored carrier、DTO、route或transport disposition；它保存fresh调用形成的
/// truth、side effect和safe reason原始集合，供typed surface replay与最终service outcome装配。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReplaySurfaceOutcome {
    /// fresh调用的原始application outcome；不允许NoWrite或DuplicateReplayed。
    outcome_status: ServiceOutcomeStatus,
    /// 当前operation已在其业务UoW stage的完整truth identity集合。
    truth_refs: SandboxTruthRefSet,
    /// 当前operation形成的完整、ordered side-effect identity集合。
    side_effect_refs: SandboxSideEffectRefSet,
    /// 与原始outcome shape一致的完整safe reason集合。
    reasons: SandboxReasonSet,
}

impl SandboxReplaySurfaceOutcome {
    /// 从fresh operation已经验证的结果parts构造可冻结body。
    pub fn try_new(
        outcome_status: ServiceOutcomeStatus,
        truth_refs: SandboxTruthRefSet,
        side_effect_refs: SandboxSideEffectRefSet,
        reasons: SandboxReasonSet,
    ) -> ApplicationResult<Self>;

    /// 按Step 6 service outcome矩阵重验truth/side-effect/reason shape。
    pub fn validate_shape(&self) -> ApplicationResult<()>;

    /// 返回该original outcome要求的generic stored status。
    pub fn expected_stored_status(&self) -> SandboxStoredOperationResultStatus;

    /// 返回原始application outcome status。
    pub fn outcome_status(&self) -> ServiceOutcomeStatus;
    /// 返回完整truth refs。
    pub fn truth_refs(&self) -> &SandboxTruthRefSet;
    /// 返回完整side-effect refs。
    pub fn side_effect_refs(&self) -> &SandboxSideEffectRefSet;
    /// 返回完整safe reasons。
    pub fn reasons(&self) -> &SandboxReasonSet;

    /// 在matching generic carrier已形成后，调用唯一status-specific factory装配最终service outcome。
    pub fn into_service_outcome(
        self,
        stored_result: SandboxStoredOperationResult,
    ) -> ApplicationResult<SandboxServiceOutcome>;
}
```

| original outcome | stored status | truth / side-effect / reason rule |
|---|---|---|
| `Accepted` | `Completed` | truth non-empty；reasons empty；side effects按flow exact集合 |
| `Rejected` | `Rejected` | truth empty；side effects empty或audit-only；reasons non-empty |
| `Degraded` | `Completed` | truth可空；side effects closed；reasons non-empty |
| `NoChange` | `Completed` | truth empty；side effects empty或audit-only；reasons按operation可空/non-empty |
| `Failed` | `Failed` | truth empty；side effects empty或audit-only；reasons non-empty |
| `NoWrite` | forbidden | Query不进入stored replay surface |
| `DuplicateReplayed` | forbidden | duplicate读取既有surface，不保存第二份original body |

`into_service_outcome`必须先校验carrier status等于`expected_stored_status()`，再调用Step 6对应
`accepted/rejected/degraded/no_change/failed` factory。它不能调用`duplicate_replayed`，也不能丢弃原truth、side-effect或
reason后重新读取current truth补齐。

## 18. B3 Command Result Surface

### 18.1 Draft与frozen object

```rust
/// 一个fresh Command在typed result store冻结前的完整application source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxCommandResultSurfaceDraft {
    /// 本operation预先分配的唯一generic stored carrier identity。
    stored_result_ref: SandboxStoredOperationResultRef,
    /// 编译期固定的closed command selector。
    command_kind: SandboxCommandKind,
    /// 从fresh call context冻结的原始trace；duplicate不得替换为当前请求trace。
    trace_context: SandboxTraceContext,
    /// fresh command原始public status；不得保存DuplicateReplayed overlay。
    original_result_status: SandboxCommandResultStatus,
    /// 完整original application outcome body。
    outcome: SandboxReplaySurfaceOutcome,
}

/// typed store已冻结、可被duplicate exact replay的完整Command source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxStoredCommandResultSurface {
    /// result store生成且kind固定为CommandResult的surface identity。
    surface_ref: SandboxStoredResultSurfaceRef,
    /// 完整pre-store command source；字段不得在保存后改写。
    draft: SandboxCommandResultSurfaceDraft,
    /// typed surface与generic carrier共同使用的正式记录时间。
    recorded_at: Timestamp,
}

impl SandboxCommandResultSurfaceDraft {
    /// 从fixed command context与完整fresh outcome parts构造surface draft。
    pub fn try_new(
        context: &SandboxServiceCallContext,
        stored_result_ref: SandboxStoredOperationResultRef,
        command_kind: SandboxCommandKind,
        original_result_status: SandboxCommandResultStatus,
        outcome: SandboxReplaySurfaceOutcome,
    ) -> ApplicationResult<Self>;

    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn command_kind(&self) -> SandboxCommandKind;
    pub fn trace_context(&self) -> &SandboxTraceContext;
    pub fn original_result_status(&self) -> SandboxCommandResultStatus;
    pub fn outcome(&self) -> &SandboxReplaySurfaceOutcome;
    pub fn operation_name(&self) -> OperationName;
}

impl SandboxStoredCommandResultSurface {
    /// persistence adapter读取row后用checked draft重建完整frozen surface。
    pub fn try_rehydrate(
        surface_ref: SandboxStoredResultSurfaceRef,
        draft: SandboxCommandResultSurfaceDraft,
        recorded_at: Timestamp,
    ) -> ApplicationResult<Self>;

    /// 校验generic carrier与surface的stored ref、operation、kind、status、surface ref和time完全一致。
    pub fn validate_carrier(
        &self,
        stored_result: &SandboxStoredOperationResult,
    ) -> ApplicationResult<()>;

    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn command_kind(&self) -> SandboxCommandKind;
    pub fn original_result_status(&self) -> SandboxCommandResultStatus;
    pub fn outcome(&self) -> &SandboxReplaySurfaceOutcome;
    pub fn recorded_at(&self) -> &Timestamp;
}
```

### 18.2 Command status relation

| original command status | required original outcome | required stored status | forbidden |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | empty truth、caller bool success |
| `Rejected` | `Rejected` | `Rejected` | success truth、rejection body丢失 |
| `Pending` | `NoChange` | `Completed` | 持久化in-flight、把Pending当Reserved |
| `Degraded` | `Degraded` | `Completed` | 把unknown改成degraded success |
| `Failed` | `Failed` | `Failed` | 保存raw adapter cause、伪造success ref |
| `DuplicateReplayed` | forbidden in draft | existing carrier原status | 创建第二surface或覆盖original status |

`try_new`先校验context operation与`command_kind` canonical mapping相等，再校验上表和outcome shape。Step 8只能从
`command_kind + trace_context + original_result_status + outcome`机械构造command DTO；primary/affected/audit/relay字段必须从typed
truth/side-effect/reason集合穷尽提取，不能从generic carrier、route或current repository重新推导。

## 19. B3 Consumer Receipt Surface

### 19.1 Application-owned draft与frozen object

```rust
/// 一个fresh inbound Consumer在typed result store冻结前的完整application source。
///
/// 本对象不依赖worker-owned `SandboxConsumerReceipt`；worker只在application返回后做entry-local映射。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxConsumerReceiptSurfaceDraft {
    /// 本operation预先分配的唯一generic stored carrier identity。
    stored_result_ref: SandboxStoredOperationResultRef,
    /// validated inbound envelope提供的原始source event identity。
    source_event_ref: ResourceRef,
    /// 编译期固定的closed consumer selector。
    consumer_kind: SandboxConsumerKind,
    /// 从validated envelope / call context冻结的原始trace。
    trace_context: SandboxTraceContext,
    /// fresh consumer原始receipt status；不得保存Duplicate overlay。
    original_receipt_status: SandboxConsumerReceiptStatus,
    /// 完整original application outcome body。
    outcome: SandboxReplaySurfaceOutcome,
}

/// typed store已冻结、可被duplicate exact replay的完整Consumer receipt source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxStoredConsumerReceiptSurface {
    /// result store生成且kind固定为ConsumerReceipt的surface identity。
    surface_ref: SandboxStoredResultSurfaceRef,
    /// 完整pre-store receipt source；字段不得在保存后改写。
    draft: SandboxConsumerReceiptSurfaceDraft,
    /// typed surface与generic carrier共同使用的正式记录时间。
    recorded_at: Timestamp,
}

impl SandboxConsumerReceiptSurfaceDraft {
    /// 从fixed consumer context、validated envelope identity与完整fresh outcome构造surface draft。
    pub fn try_new(
        context: &SandboxServiceCallContext,
        stored_result_ref: SandboxStoredOperationResultRef,
        source_event_ref: ResourceRef,
        consumer_kind: SandboxConsumerKind,
        trace_context: SandboxTraceContext,
        original_receipt_status: SandboxConsumerReceiptStatus,
        outcome: SandboxReplaySurfaceOutcome,
    ) -> ApplicationResult<Self>;

    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn source_event_ref(&self) -> &ResourceRef;
    pub fn consumer_kind(&self) -> SandboxConsumerKind;
    pub fn trace_context(&self) -> &SandboxTraceContext;
    pub fn original_receipt_status(&self) -> SandboxConsumerReceiptStatus;
    pub fn outcome(&self) -> &SandboxReplaySurfaceOutcome;
    pub fn operation_name(&self) -> OperationName;
}

impl SandboxStoredConsumerReceiptSurface {
    /// persistence adapter读取row后用checked draft重建完整frozen receipt。
    pub fn try_rehydrate(
        surface_ref: SandboxStoredResultSurfaceRef,
        draft: SandboxConsumerReceiptSurfaceDraft,
        recorded_at: Timestamp,
    ) -> ApplicationResult<Self>;

    /// 校验generic carrier与surface的stored ref、operation、kind、status、surface ref和time完全一致。
    pub fn validate_carrier(
        &self,
        stored_result: &SandboxStoredOperationResult,
    ) -> ApplicationResult<()>;

    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn source_event_ref(&self) -> &ResourceRef;
    pub fn consumer_kind(&self) -> SandboxConsumerKind;
    pub fn trace_context(&self) -> &SandboxTraceContext;
    pub fn original_receipt_status(&self) -> SandboxConsumerReceiptStatus;
    pub fn outcome(&self) -> &SandboxReplaySurfaceOutcome;
    pub fn recorded_at(&self) -> &Timestamp;
}
```

### 19.2 Consumer status relation

| original receipt status | required original outcome | required stored status | entry meaning |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | mutation/required truth完成，可ack |
| `Delayed` | `NoChange | Degraded` | `Completed` | 保存完整延迟原因，不伪造success |
| `Rejected` | `Rejected` | `Rejected` | 安全拒绝surface可replay |
| `Failed` | `Failed` | `Failed` | caller-safe failed receipt可replay |
| `Quarantined` | `Rejected | NoChange` | `Rejected | Completed`同序匹配 | 保存quarantine/no-change原始语义 |
| `NoOp` | `NoChange` | `Completed` | 合法消费但没有本地变化 |
| `Duplicate` | forbidden in draft | existing carrier原status | 只作为本次worker overlay，不覆盖original receipt |

`try_new`固定执行：source event ref non-empty -> context channel为`Consumer` -> context operation与
`consumer_kind` canonical mapping相等 -> `trace_context == context.trace_context()` -> outcome shape -> 上表status relation。
它不读取worker receipt、不解析topic、不从source event文本推导consumer kind，也不保存transport delivery body。

Step 8 mapper必须从frozen surface逐字段构造public receipt；duplicate时只把本次调用处置overlay为`Duplicate`，原
`source_event_ref`、selector、trace、truth/side-effect/reason和recorded time保持不变。worker构造
`SandboxConsumerReceipt`时不得从current truth补 affected refs，或从当前envelope替换原trace。

## 20. B3 Job Report Surface

### 20.1 Nine-job selection snapshot

```rust
/// 九个paged maintenance Job在完整report中保存的typed selection闭集。
///
/// 每个variant直接复用application-owned immutable selection，不保存route、binary、generic scope digest或all/latest。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxStoredMaintenanceJobSelection {
    PublishSandboxEventRelay(PublishSandboxEventRelaySelection),
    RefreshSandboxReferenceStates(RefreshSandboxReferenceStatesSelection),
    RefreshBackendCapabilitySummaries(RefreshBackendCapabilitySummariesSelection),
    RetryPendingMaterialHandoffs(RetryPendingMaterialHandoffsSelection),
    RunLeaseOrphanReaper(RunLeaseOrphanReaperSelection),
    EvaluatePendingCleanupGuards(EvaluatePendingCleanupGuardsSelection),
    MaintainRedlineContainmentHandoffs(MaintainRedlineContainmentHandoffsSelection),
    RebuildSandboxReadProjections(RebuildSandboxReadProjectionsSelection),
    MaintainDerivedInspectPreviewTrend(MaintainDerivedInspectPreviewTrendSelection),
}

impl SandboxStoredMaintenanceJobSelection {
    /// 返回variant唯一对应的closed job selector。
    pub fn job_kind(&self) -> SandboxJobKind;
    /// 判断selection是否由caller显式给出空target集合；empty不表示all。
    pub fn is_explicit_empty(&self) -> bool;
}
```

本enum没有`RunSandboxReconciliation` variant。reconciliation拥有独立完整scope/digest/report/finding bundle，若把它压入
paged selection会丢失same-snapshot proof并错误进入generic finalizer。

### 20.2 Maintenance report draft

```rust
/// 九个paged maintenance Job在typed store冻结前的完整application report source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxMaintenanceJobReportSurfaceDraft {
    /// 本operation预先分配的唯一generic stored carrier identity。
    stored_result_ref: SandboxStoredOperationResultRef,
    /// 与selection/finalizable permit完全一致的closed job selector。
    job_kind: SandboxJobKind,
    /// 原始job invocation identity；duplicate不得生成新的original run id。
    original_job_run_id: JobRunId,
    /// 原job call context冻结的trace identity。
    trace_context: SandboxTraceContext,
    /// 首次permit冻结的完整typed selection。
    selection: SandboxStoredMaintenanceJobSelection,
    /// 首次调用的bounded page request；用于重验完整token chain起点。
    initial_page_request: SandboxJobPageRequest,
    /// jobs accumulator原样move回application的全部batch/item outcome。
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    /// 从完整items机械派生的fresh report status；不得为DuplicateReplayed。
    original_report_status: SandboxJobReportStatus,
    /// 从report status和完整items机械形成的final application outcome body。
    final_outcome: SandboxReplaySurfaceOutcome,
    /// 原job invocation开始时间。
    started_at: Timestamp,
    /// report/stored relation在finalization UoW使用的完成时间。
    finished_at: Timestamp,
}

impl SandboxMaintenanceJobReportSurfaceDraft {
    /// 消费已验证且exhausted的finalizer input，保留全部selection/batch/item字段。
    pub fn try_from_finalizer_input(
        stored_result_ref: SandboxStoredOperationResultRef,
        input: FinalizeSandboxJobReportInput,
        finished_at: Timestamp,
    ) -> ApplicationResult<Self>;

    /// 重验selection、page chain、global target uniqueness、item shape、status和reason聚合。
    pub fn validate_shape(&self) -> ApplicationResult<()>;

    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn trace_context(&self) -> &SandboxTraceContext;
    pub fn selection(&self) -> &SandboxStoredMaintenanceJobSelection;
    pub fn initial_page_request(&self) -> &SandboxJobPageRequest;
    pub fn batches(&self) -> &[SandboxMaintenanceBatchOutcome];
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn final_outcome(&self) -> &SandboxReplaySurfaceOutcome;
    pub fn started_at(&self) -> &Timestamp;
    pub fn finished_at(&self) -> &Timestamp;
    /// checked遍历全部batch items；不读取或保存第二个counter truth。
    pub fn processed_count(&self) -> ApplicationResult<u64>;
    pub fn operation_name(&self) -> OperationName;
}
```

`try_from_finalizer_input`唯一允许从`SandboxFinalizableJobPermit`的九个variant投影selection snapshot。它必须消费
`FinalizeSandboxJobReportInput::into_parts()`，不能接收jobs-owned accumulator，也不能由caller分别传job kind、status、
selection或batches。constructor重验finalizer input的全部六项门禁，并额外要求`finished_at >= started_at`。

| report status | final outcome status | stored status | reason source |
|---|---|---|---|
| `Succeeded` | `NoChange` | `Completed` | empty |
| `PartialFailed` | `Degraded` | `Completed` | failed/degraded items稳定ordered聚合，non-empty |
| `Failed` | `Failed` | `Failed` | 全部failed items稳定ordered聚合，non-empty |
| `Skipped` | `NoChange` | `Completed` | items原样聚合；explicit empty可为空 |
| `Degraded` | `Degraded` | `Completed` | degraded items稳定ordered聚合，non-empty |
| `DuplicateReplayed` | forbidden | existing carrier原status | 不重建fresh draft |

`final_outcome.truth_refs`与`side_effect_refs`必须为空，因为各item业务truth已在前序UoW提交；完整item result refs仍保存在
`batches`，不能再次放入finalizer outcome并谎称当前UoW正在提交它们。

### 20.3 JobReport payload闭集与frozen object

```rust
/// JobReport typed surface在result store中保存的两种完整application payload。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxJobReportSurfacePayload {
    /// 九个paged maintenance Job的完整selection与batch/item chain。
    Maintenance(SandboxMaintenanceJobReportSurfaceDraft),
    /// RunSandboxReconciliation既有完整stored envelope；不是第四种stored result kind。
    Reconciliation(SandboxReconciliationStoredJobReport),
}

/// typed store已冻结、可被duplicate exact replay的完整JobReport source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxStoredJobReportSurface {
    /// result store生成且kind固定为JobReport的surface identity。
    surface_ref: SandboxStoredResultSurfaceRef,
    /// 完整typed payload；variant由job kind唯一决定。
    payload: SandboxJobReportSurfacePayload,
    /// typed surface与generic carrier共同使用的正式记录时间。
    recorded_at: Timestamp,
}

impl SandboxJobReportSurfacePayload {
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn expected_stored_status(&self) -> SandboxStoredOperationResultStatus;
    pub fn operation_name(&self) -> OperationName;
}

impl SandboxStoredJobReportSurface {
    /// persistence adapter读取typed payload后重建frozen JobReport surface。
    pub fn try_rehydrate(
        surface_ref: SandboxStoredResultSurfaceRef,
        payload: SandboxJobReportSurfacePayload,
        recorded_at: Timestamp,
    ) -> ApplicationResult<Self>;

    /// 校验generic carrier与surface的stored ref、operation、kind、status、surface ref和time完全一致。
    pub fn validate_carrier(
        &self,
        stored_result: &SandboxStoredOperationResult,
    ) -> ApplicationResult<()>;

    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;
    pub fn payload(&self) -> &SandboxJobReportSurfacePayload;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn recorded_at(&self) -> &Timestamp;
}
```

### 20.4 Reconciliation payload relation

`Reconciliation` variant只接受已经通过
`SandboxReconciliationStoredJobReport::try_from_committed_group/rehydrate`的existing application envelope，并固定：

| relation | required |
|---|---|
| job kind | exactly `RunSandboxReconciliation` |
| original status | `Succeeded | Degraded | Failed`；不允许`PartialFailed/Skipped/DuplicateReplayed` |
| stored status | `Succeeded -> Completed`;`Degraded -> Completed`;`Failed -> Failed` |
| recorded time | outer `recorded_at == envelope.finished_at()`且`finished_at >= started_at` |
| exact report | envelope引用的report、finding stream、audit、truth cursor、scope digest全部可在同一committed snapshot重建 |
| optional relay | finding refs非空时matching relay exactly one；为空时必须None |

typed store不能只验证envelope row。get/replay必须沿exact refs读取matching immutable report persistence bundle和optional
relay，调用既有rehydration后才返回`SandboxStoredJobReportSurface`。missing、multiple、wrong report、wrong relay、tombstoned、
不可见或字段不等都属于B3 integrity failure；不得读取current reconciliation binding、latest report或重新运行对账。

### 20.5 Three-kind loaded union

```rust
/// application duplicate kernel完成typed lookup后持有的三类完整frozen surface闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxLoadedReplaySurface {
    Command(SandboxStoredCommandResultSurface),
    Consumer(SandboxStoredConsumerReceiptSurface),
    Job(SandboxStoredJobReportSurface),
}

impl SandboxLoadedReplaySurface {
    pub fn kind(&self) -> SandboxStoredResultKind;
    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;
    /// 对matching generic carrier执行variant-specific完整性校验。
    pub fn validate_carrier(
        &self,
        stored_result: &SandboxStoredOperationResult,
    ) -> ApplicationResult<()>;
}
```

该union是application-local lookup output，不持久化第四个tag，不进入Step 8 wire schema。entry mapper只能在application
已经按operation selector验证variant后消费它；不得根据route/topic/binary或`ResourceRef`文本选择variant。

## 21. B3 Batch 1 Field-source与No-rerun Matrix

| surface | complete source | duplicate overlay | missing / wrong / corrupt behavior |
|---|---|---|---|
| CommandResult | fixed command selector、original trace/status、完整truth/side-effect/reason set | 本次status可渲染`DuplicateReplayed`，原status与所有refs不变 | `DuplicateMissingResult`/integrity；不得重跑command或读current truth重建 |
| ConsumerReceipt | original source event、consumer selector、trace/status、完整outcome set | 本次receipt可overlay `Duplicate`，原receipt status与event/trace不变 | 不ack为success、不重投consumer mutation、不用current envelope替换字段 |
| JobReport/Maintenance | original run、trace、typed selection、initial request、完整batch/item/token chain、times | 本次report可overlay `DuplicateReplayed`，原run/status/times/items不变 | 不重新selection、不调用item、不得从counts/current index重组 |
| JobReport/Reconciliation | existing exact envelope + matching report/finding/audit/optional relay bundle | 只返回原report source；原report可已是historical | 不读current binding、不重算finding/payload、不运行reconciliation |

所有surface都禁止保存raw command/event/job body、stdout/stderr、path/URL、secret、provider response、SQL/SDK error或
tools semantic execution/runtime agent loop/member lifecycle payload。审计、异常、测试和交付只在本批登记必要ref/reason与
fail-closed行为，不扩写平台级流程。

## 22. B3 Batch 1状态与下一门禁

B3 Batch 1已固定三类application-owned frozen source、fresh构造顺序、Command/Consumer/Job完整字段、reconciliation
specialization和loaded union。它尚未关闭`S7-02D-INT-03`：下一批仍需定义generic carrier repository与三类typed store的
exact save/get trait、return/error和same-UoW visibility。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_task = S7-02D-B3 typed stored carrier and full surface stores
completed_internal_sub_batch = S7-02D-B3-1 owner/schema/factory/accessor
current_internal_sub_batch = none
next_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
next_allowed_action = write_s7_02d_b3_batch_2
stored_result_kind = CommandResult|ConsumerReceipt|JobReport
job_report_payload = Maintenance|Reconciliation
application_depends_on_worker_jobs = no
step8_dto_owned_here = no
closed_internal_items = S7-02D-INT-01,S7-02D-INT-02
remaining_internal_items = S7-02D-INT-03,S7-02D-INT-04,S7-02D-INT-05
batch_status = in_progress
gate_status = content_in_progress
new_l1_l2_blocker = 0
commit_required = no
```

---

## EOF Current Recovery Overlay: `S7-02D-B3-2` typed store exact traits and errors

本节位于物理 EOF，覆盖前述 B3-1 状态块。B3-2 只定义 application persistence port 的 exact I/O、有限错误和可见性
语义；它不声明 fresh/duplicate whole-group 算法已经完成，也不进入 Step 8 DTO 或正式 `03~07`。

### 23. B3-2 owner、文件边界与方法计数

| contract | application owner | planned file | infra responsibility | method count |
|---|---|---|---|---:|
| generic stored carrier | application idempotency / replay kernel | `crates/application/src/ports.rs` | fake/durable carrier row adapter | `create/get = 2` |
| CommandResult typed surface | application replay surface owner | `crates/application/src/ports.rs` | Command surface relation adapter | `save/get = 2` |
| ConsumerReceipt typed surface | application replay surface owner | `crates/application/src/ports.rs` | Consumer surface relation adapter | `save/get = 2` |
| JobReport typed surface | application replay surface owner | `crates/application/src/ports.rs` | Maintenance/Reconciliation relation adapter | `save/get = 2` |

`repositories.rs` 不在 Step 4 planned tree 中。本批将全部 port 放回既有 `ports.rs`，不新增 module、crate、repository
root 或 public callable。`infra` 可以拆分内部 adapter 文件，但不得把 persistence trait owner 移出 application，也不得让
worker-owned `SandboxConsumerReceipt` 或 jobs-owned `SandboxJobReportAccumulator` 成为 application repository 参数。

### 24. B3-2 共同输入与可见性术语

三类 typed store 的 fresh 输入仍分别使用 B3-1 的 `SandboxCommandResultSurfaceDraft`、
`SandboxConsumerReceiptSurfaceDraft` 和 `SandboxJobReportSurfacePayload`。本批不新增一个可被 entry 或 DTO 消费的
generic surface input；generic carrier 只在 typed surface 已形成后由 application 构造。

本批固定以下两个读取能力：

| name | allowed handle | visibility | writes / allocation |
|---|---|---|---|
| committed read | `&mut dyn SandboxCommittedReadSnapshot` | 只读取已提交 snapshot | 0 write、0 identity、0 cursor、0 external call |
| same-UoW stage/read | `&mut dyn SandboxUnitOfWork` | 可读取该 UoW 的一致 base snapshot和本 UoW 自己的 staged relation；stage在commit前不可向其它 snapshot可见 | 只有具名 create/save 方法可写；不自动分配 identity/cursor |

`SandboxUnitOfWork` 继承 `SandboxCommittedReadSnapshot` 的 application-local read view。repository method 的 stage
成功只表示当前 UoW 已接受完整 write set；只有 `SandboxUnitOfWorkManager::commit` 返回 confirmed receipt 后，caller
才能把 carrier/surface 作为 committed replay 事实对外返回。`NotCommitted`、`StatusUnknown` 和 rollback failure 由既有
UoW contract 处理，不能被本批 repository error 映射成 `NotFound` 或 duplicate success。

每个 typed `get` 都返回 `Versioned<T>`，以证明 payload 和 core `Version` 来自同一 committed snapshot。这个 `Version`
只用于 whole-group inspection / relation proof，不表示 frozen surface 可以被更新；typed surface 没有 `save` 之外的
update、patch、delete 或 latest API。

### 25. Generic carrier repository exact contract

```rust
/// application-owned body-free stored carrier persistence port。
/// 完整结果正文永远由三个 typed surface store 保存；本 trait只保存 relation carrier。
pub trait SandboxStoredOperationResultRepository: Send + Sync {
    /// 从一个已提交 snapshot按 exact stored result ref读取完整 carrier与同代Version。
    async fn get_stored_operation_result_with_version(
        &self,
        stored_result_ref: &SandboxStoredOperationResultRef,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<Versioned<SandboxStoredOperationResult>, SandboxStoredOperationResultRepositoryError>;

    /// 在同一 write UoW 中 insert-if-absent stage carrier。
    /// 返回单位值；stage success不表示commit confirmed。
    async fn create_stored_operation_result(
        &self,
        carrier: &SandboxStoredOperationResult,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxStoredOperationResultRepositoryError>;
}
```

#### 25.1 Carrier repository error

```rust
/// generic carrier 的有限 persistence error；不携带body、SQL、path或driver cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxStoredOperationResultRepositoryError {
    /// exact carrier ref在committed snapshot中不存在。
    NotFound {
        stored_result_ref: SandboxStoredOperationResultRef,
    },
    /// 试图用同一stored ref创建不同carrier，或同一carrier被重复create。
    AlreadyExists {
        stored_result_ref: SandboxStoredOperationResultRef,
    },
    /// carrier row、typed ref、operation、kind、status、surface ref或recorded time不一致。
    IntegrityViolation {
        reason: SandboxReason,
    },
    /// store或当前snapshot/UoW暂不可用。
    Unavailable {
        reason: SandboxReason,
    },
}
```

`AlreadyExists` 不等于 duplicate：carrier repository 只返回持久化冲突，application 必须再用 exact existing carrier 和
typed surface 完成等价性证明。carrier `get` 不返回 `Option`，不接受 latest/all/operation scan，也不从 idempotency record
或 current truth 重建 carrier。carrier `create` 不提供 `save`、`upsert`、`delete` 或 generic body API。

#### 25.2 Carrier method semantics

| method | input proof | success | exact failure | forbidden |
|---|---|---|---|---|
| `get_stored_operation_result_with_version` | non-empty typed ref + committed snapshot | 完整 carrier与同代Version | `NotFound` / `Unavailable` / `IntegrityViolation` | row partial、默认status、latest winner、current truth rebuild |
| `create_stored_operation_result` | carrier由B3-3 validator证明且typed surface在同一UoW已stage | carrier已在当前UoW stage | `AlreadyExists` / `Unavailable` / `IntegrityViolation` | 先写carrier再补surface、从carrier创建surface、返回commit success |

### 26. CommandResult typed surface store

```rust
/// CommandResult 完整 frozen surface 的 application port。
pub trait SandboxCommandResultSurfaceStore: Send + Sync {
    /// 在同一UoW中冻结完整 command surface，并返回 result-store generated surface ref。
    async fn save_command_result_surface(
        &self,
        draft: &SandboxCommandResultSurfaceDraft,
        recorded_at: Timestamp,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxStoredCommandResultSurface, SandboxCommandResultSurfaceStoreError>;

    /// 在 committed snapshot中按 carrier relation读取并完整rehydrate command surface。
    async fn get_command_result_surface_with_version(
        &self,
        surface_ref: &SandboxStoredResultSurfaceRef,
        stored_result_ref: &SandboxStoredOperationResultRef,
        operation_name: &OperationName,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<Versioned<SandboxStoredCommandResultSurface>, SandboxCommandResultSurfaceStoreError>;
}
```

#### 26.1 Command store error

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxCommandResultSurfaceStoreError {
    /// exact surface ref或其完整payload不可见。
    NotFound {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// 同一 surface ref已存在且candidate不等，或同一draft被重复stage。
    AlreadyExists {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// surface kind、command selector、operation、carrier ref、status、time或payload relation不一致。
    IntegrityViolation {
        reason: SandboxReason,
    },
    /// surface store或snapshot/UoW不可用。
    Unavailable {
        reason: SandboxReason,
    },
    /// requested kind不是CommandResult，或请求的operation不是command canonical operation。
    WrongKind {
        expected: SandboxStoredResultKind,
        actual: SandboxStoredResultKind,
    },
}
```

`save_command_result_surface` 的成功返回是已经冻结并通过 checked rehydrate 的 application surface；它不表示 UoW 已提交。
实现必须在同一 UoW stage typed payload、surface identity relation和后续 generic carrier create；若 adapter采用 carrier
先stage，仍需在同一UoW完成完整 pair validation后才允许返回。`recorded_at` 只能来自 trusted clock 或当前 operation
已验证的 finalization time，不能由 surface ref、trace或wall-clock winner规则派生。

`get_command_result_surface_with_version` 必须同时按 `surface_ref`、`stored_result_ref` 和 `operation_name` 做 exact
relation check。三个参数不是可选过滤器，也不允许只按 surface ref 返回“最相近”payload。找不到任一 relation返回
`NotFound`；kind错误返回 `WrongKind`；row/payload/correlation/time不一致返回 `IntegrityViolation`。

### 27. ConsumerReceipt typed surface store

```rust
/// ConsumerReceipt 完整 frozen surface 的 application port。
pub trait SandboxConsumerReceiptSurfaceStore: Send + Sync {
    /// 在同一UoW中冻结完整 consumer receipt surface。
    async fn save_consumer_receipt_surface(
        &self,
        draft: &SandboxConsumerReceiptSurfaceDraft,
        recorded_at: Timestamp,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxStoredConsumerReceiptSurface, SandboxConsumerReceiptSurfaceStoreError>;

    /// 在 committed snapshot中按 exact carrier relation读取完整 receipt surface。
    async fn get_consumer_receipt_surface_with_version(
        &self,
        surface_ref: &SandboxStoredResultSurfaceRef,
        stored_result_ref: &SandboxStoredOperationResultRef,
        operation_name: &OperationName,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<Versioned<SandboxStoredConsumerReceiptSurface>, SandboxConsumerReceiptSurfaceStoreError>;
}
```

#### 27.1 Consumer store error

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxConsumerReceiptSurfaceStoreError {
    /// exact surface或完整receipt payload在snapshot不可见。
    NotFound {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// surface ref已存在但candidate不等，或重复insert无法证明等价。
    AlreadyExists {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// source event、consumer selector、trace、outcome、time或carrier relation损坏。
    IntegrityViolation {
        reason: SandboxReason,
    },
    /// store或snapshot/UoW不可用。
    Unavailable {
        reason: SandboxReason,
    },
    /// requested kind不是ConsumerReceipt或operation selector不匹配。
    WrongKind {
        expected: SandboxStoredResultKind,
        actual: SandboxStoredResultKind,
    },
}
```

consumer store 不保存 transport delivery envelope、topic、ack token、raw event body 或 worker receipt object。save 成功
只表示 typed surface 已 stage；get 必须用 committed snapshot 读取原始 source event ref、consumer kind、original status、
trace 和完整 outcome，并交 `SandboxStoredConsumerReceiptSurface::validate_carrier`，不能以当前 delivery envelope 替换。

### 28. JobReport typed surface store

```rust
/// JobReport 完整 frozen surface 的 application port。
/// Maintenance 与 Reconciliation 共用 JobReport kind，但payload保持typed闭集。
pub trait SandboxJobReportSurfaceStore: Send + Sync {
    /// 在同一UoW中冻结完整 maintenance/reconciliation report surface。
    async fn save_job_report_surface(
        &self,
        payload: &SandboxJobReportSurfacePayload,
        recorded_at: Timestamp,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxStoredJobReportSurface, SandboxJobReportSurfaceStoreError>;

    /// 在 committed snapshot中按 exact carrier relation读取完整 job report surface。
    async fn get_job_report_surface_with_version(
        &self,
        surface_ref: &SandboxStoredResultSurfaceRef,
        stored_result_ref: &SandboxStoredOperationResultRef,
        operation_name: &OperationName,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<Versioned<SandboxStoredJobReportSurface>, SandboxJobReportSurfaceStoreError>;
}
```

#### 28.1 JobReport store error

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxJobReportSurfaceStoreError {
    /// exact surface、maintenance payload或reconciliation bundle不可见。
    NotFound {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// surface ref重复且candidate不等，或重复insert无法证明同一完整report。
    AlreadyExists {
        surface_ref: SandboxStoredResultSurfaceRef,
    },
    /// selection、batch/item chain、report/finding/audit/cursor/relay或time relation损坏。
    IntegrityViolation {
        reason: SandboxReason,
    },
    /// store或snapshot/UoW不可用。
    Unavailable {
        reason: SandboxReason,
    },
    /// requested kind不是JobReport，或payload与operation/job kind不匹配。
    WrongKind {
        expected: SandboxStoredResultKind,
        actual: SandboxStoredResultKind,
    },
}
```

`save_job_report_surface` 的 `payload` 必须是 B3-1 closed `Maintenance | Reconciliation` union；不得接受 generic JSON、
counts-only report、worker accumulator 或 jobs-owned report。`recorded_at` 必须等于 payload 的 canonical finish time：
Maintenance 使用 report draft `finished_at`，Reconciliation 使用 stored envelope `finished_at`。`surface_ref` 必须是
kind=`JobReport` 的 result-store identity，不能由 `JobRunId`、report ref、scope digest或时间派生。

对于 `Reconciliation`，save 必须在同一 UoW 验证 exact report/finding/audit/optional relay bundle；对于 `Maintenance`，save
必须验证 selection、完整 page/token chain、每个 batch/item 与机械 report status。两者均返回完整 frozen surface，不能只返回
surface ref或processed count。

### 29. 三类 typed store 的共同 method/error 矩阵

| typed method | read/write handle | success return | `NotFound` | `AlreadyExists` | `WrongKind` | `IntegrityViolation` | `Unavailable` |
|---|---|---|---|---|---|---|---|
| `save_command_result_surface` | same-UoW write | complete `SandboxStoredCommandResultSurface` | n/a | ref candidate collision | draft kind由factory保证 | draft/row/carrier relation invalid | store/UoW unavailable |
| `get_command_result_surface_with_version` | committed snapshot | `Versioned` complete Command surface | exact relation absent/invisible | n/a | non-Command carrier kind | field/payload/time mismatch | snapshot/store unavailable |
| `save_consumer_receipt_surface` | same-UoW write | complete `SandboxStoredConsumerReceiptSurface` | n/a | ref candidate collision | draft kind由factory保证 | source/selector/trace/outcome relation invalid | store/UoW unavailable |
| `get_consumer_receipt_surface_with_version` | committed snapshot | `Versioned` complete Consumer surface | exact relation absent/invisible | n/a | non-Consumer carrier kind | field/payload/time mismatch | snapshot/store unavailable |
| `save_job_report_surface` | same-UoW write | complete frozen Job surface | n/a | ref candidate collision | payload kind不匹配 | selection/batch/report/finding/relay relation invalid | store/UoW unavailable |
| `get_job_report_surface_with_version` | committed snapshot | `Versioned` complete Job surface | exact relation absent/invisible | n/a | non-Job carrier kind | full report/envelope relation invalid | snapshot/store unavailable |

typed `save` 不把 `NotFound` 解释为 first materialization，因为 surface ref 已由本次 operation 的 checked identity计划确定；
它只允许 insert-if-absent。typed `get` 的 `NotFound` 也不授权 save、重跑或 current-truth rebuild。任何 `WrongKind` 或
`IntegrityViolation` 都是 duplicate/recovery 的 fail-closed 输入，不是空结果。三类 error enum 必须保持同名五类
variant 语义；adapter 不得添加 driver-specific variant。

### 30. B3-2 same-UoW write order与duplicate read order

#### 30.1 Fresh write order

```text
validated operation-specific outcome parts
  -> operation-specific draft/payload (B3-1)
  -> typed save_*_surface(draft/payload, recorded_at, uow)
  -> construct SandboxStoredOperationResult from returned surface_ref/status/time
  -> create_stored_operation_result(carrier, uow)
  -> mark_completed + save_idempotency_completion in the same allowed UoW group
  -> commit
  -> only after confirmed receipt map SandboxServiceOutcome
```

typed save 的 returned surface 是本 UoW 的 frozen candidate，不是 committed evidence；carrier create、typed surface和
idempotency completion必须一起进入 whole-group inspection plan。任何 typed save、carrier create 或 completion stage 失败都
不允许返回 fresh success。surface identity由 result store 产生，application 不根据时间、operation、job run、truth ref或
scope digest派生第二 identity。

#### 30.2 Duplicate read order

```text
completed idempotency record
  -> open SandboxCommittedReadSnapshot
  -> get_stored_operation_result_with_version(exact stored_result_ref, snapshot)
  -> validate carrier against requested operation and expected kind
  -> variant-specific get_*_surface_with_version(exact surface_ref, stored_ref, operation_name, snapshot)
  -> SandboxLoadedReplaySurface::validate_carrier
  -> close snapshot
  -> mechanical entry mapping with Duplicate overlay
```

duplicate read全程 zero write、zero identity/cursor allocation、zero external call。carrier或surface `get` 返回的 `Version`
只用于证明同一 snapshot generation，不得触发 CAS 或 save。关闭 snapshot 失败不改变已读取的 original surface，也不把
duplicate 变成 fresh；按既有 read snapshot error mapping 返回保守 internal/port error。不得在 carrier missing、wrong kind、
surface missing或relation corrupt时跳到另一个 typed store尝试猜测。

### 31. B3-2 Fake / durable parity与文件责任

| dimension | durable adapter | deterministic fake adapter |
|---|---|---|
| carrier identity | exact `SandboxStoredOperationResultRef`主键和operation/kind/status/surface relation | 同一 typed key equality；不降格为字符串或单一body map |
| surface identity | result-store生成的 `SandboxStoredResultSurfaceRef` 与 kind强校验 | 使用同样 kind/ref relation；不由测试fixture自动补ref |
| staged visibility | 同一 UoW 内可按明确规则读自身stage；其它 snapshot commit前不可见 | transaction-local stage；不能每次save立即改共享map |
| atomicity | surface + carrier + idempotency completion按application group整体提交 | 可注入任一stage/commit失败并确保无partial visible group |
| read snapshot | exact carrier和完整typed payload来自同一 committed generation | 冻结同一 snapshot，后续fake mutation不能改变已打开读视图 |
| wrong kind | 返回对应 typed `WrongKind` | 同一variant和字段，不允许fake-only success |
| missing/corrupt | `NotFound` / `IntegrityViolation` / `Unavailable`按本批有限集合映射 | 使用相同命名错误；不得把缺失映射为空surface |
| commit result | repository stage不伪造 `Confirmed`，由UoW manager给出三分结果 | 可分别模拟 confirmed/not committed/unknown；application仍保守处理unknown |
| body boundary | 不暴露raw DTO/body、SQL、path、provider response | 不因内存存储而扩大surface或绕过rehydration |

Step 4 文件责任回写如下：`crates/application/src/ports.rs` 承载上述八个 method 与四个 error family 的 trait；
`crates/application/src/idempotency.rs` 承载三类 surface 的 relation validator 与 fresh/duplicate orchestration；
`crates/infra/src/idempotency_store.rs` 承载 carrier adapter及typed surface adapter。`crates/infra/src/reference_stores.rs`
不得接管 stored surface。Step 8 只消费 returned frozen surface，不拥有 persistence trait。

### 32. B3-2 完成审计与下一批

| audit | expected | B3-2 result |
|---|---:|---:|
| generic carrier method | `create/get = 2` | `2/2` exact，body-free，same-UoW/committed split |
| typed surface method | `Command 2 + Consumer 2 + Job 2` | `6/6` exact，三类对称 |
| error family | carrier 1 + typed 3 | `4/4` finite，均无raw cause/body |
| read handle | committed snapshot | `6/6` get使用committed snapshot并返回同代Versioned surface |
| write handle | SandboxUnitOfWork | `4/4`：generic carrier create 1 + 三类 typed surface save 3，均使用same-UoW stage |
| application owner | `ports.rs` / `idempotency.rs` | `2/2`落在Step 4 planned module |
| worker/jobs dependency | `0` | `0` |
| generic body/latest/upsert API | `0` | `0` |

本批关闭 B3-2 的内容门禁，但不关闭 `S7-02D-B3` 或 `S7-02D`。下一合法内部任务是
`S7-02D-B3-3 operation/kind/status/stored-ref/surface-ref/time cross-validation`；B3-3 必须把 fresh save 和 duplicate
get 统一到同一个 variant-specific validator，并在完成后再进入 B3-4 的 missing/wrong-kind/invisible/corrupt no-rerun
矩阵。`S7-02D-INT-03` 继续 open，直到 B3-4 完成。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_task = S7-02D-B3 typed stored carrier and full surface stores
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
current_internal_batch = S7-02D-B3 in_progress
next_internal_sub_batch = S7-02D-B3-3 cross-validation
next_allowed_action = write_s7_02d_b3_batch_3
stored_result_kind = CommandResult|ConsumerReceipt|JobReport
job_report_payload = Maintenance|Reconciliation
surface_store_methods = carrier_2 + typed_6
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---
## EOF Current Recovery Overlay: `S7-02D-B3-3` cross-validation in progress

本节是 B3-3 的当前中间产物。B3-2 已经闭合 persistence port；本批只闭合 typed frozen surface 与 generic carrier
之间的 operation、kind、status、ref 和 time 交叉校验。它不新增 public callable、stored kind、DTO、repository
module 或实现事实。

### 33. B3-3 开工门禁、问题回答与范围

| 项 | 当前结论 |
|---|---|
| current sub-batch | `S7-02D-B3-3`，`in_progress` |
| upstream consumed | B3-1 frozen surface schema/factory/accessor；B3-2 carrier/typed-store exact save/get/error |
| required L1 closure | fresh typed save 与 duplicate typed get 使用同一 application-owned variant-specific validator |
| validator owner | `crates/application/src/idempotency.rs` 的 private orchestration/helper；不新增 public API |
| persistence owner | `crates/application/src/ports.rs` trait；`crates/infra/src/idempotency_store.rs` adapter |
| downstream freeze | B3-4、S7-G02、Step 8、正式 `03~07` 和 implementation 继续冻结 |
| new upstream blocker | `0`；现有 `REF-001` 继续等待本批及 B3-4 |
| commit | `no` |

本批 SOP 问题回答如下：

| SOP 问题 | B3-3 当前回答 |
|---|---|
| 哪个对象承接交叉校验 | 现有 `SandboxLoadedReplaySurface` 做三类 surface 的闭集分派；现有三种 `validate_carrier` 做 variant-specific field check；新的共同 helper 只编排统一输入、顺序和 fresh/duplicate mode。 |
| fresh 与 duplicate 如何共用 | fresh typed save 生成并 rehydrate candidate 后，将 candidate 包装为 `SandboxLoadedReplaySurface`，与刚构造的 carrier 一起调用共同 helper；duplicate exact get 读取同样两者后调用同一 helper。 |
| operation 从哪里来 | fresh 从已验证 closed selector 到 `OperationName` 的 canonical mapping；duplicate 从当前请求的 closed selector mapping；不从 stored carrier、route、topic 或 ref 文本反向推导。 |
| kind 从哪里来 | 当前 variant 的 compile-time expected kind；carrier/surface 的 actual kind 只能被校验，不能反向选择 typed store。 |
| status 从哪里来 | surface 原始 status 与 `SandboxReplaySurfaceOutcome` 的显式关系表；carrier stored status由该关系机械得到。当前 duplicate overlay不进入 frozen surface。 |
| ref 从哪里来 | fresh generic `stored_result_ref`由 reservation kernel、`surface_ref`由 typed result store；duplicate 两者都从 exact persisted relation读取；不分配第二 identity。 |
| 时间从哪里来 | fresh `recorded_at`来自当前 operation 的 trusted finalization clock；JobReport 的 `started_at`来自原始 job permit/run context，`finished_at`来自 finalization clock；duplicate只读取并比较已保存值。 |
| 失败如何处理 | 任一 operation/kind/status/ref/time mismatch 都 fail closed；不切换 typed store、不扫描 latest、不读取 current truth、不重跑业务。 |

本批非范围：

- 不新增 `SandboxStoredResultKind` variant，不新增第四种 JobReport payload。
- 不把 `started_at` 强行加入 CommandResult 或 ConsumerReceipt schema；这两类当前 canonical surface 没有该字段。
- 不把 `recorded_at` 当作 idempotency identity、Version 或 retry winner；它只证明 frozen surface 的 finalization 时间。
- 不定义 B3-4 的完整 missing/wrong-kind/invisible/corrupt recovery 矩阵；本批只定义这些输入进入 validator 后的保守出口。
- 不生成测试结果、compile/run/evidence、commit 或验收签署。

### 34. 统一 validator 的 application-local exact contract

B3-3 不增加新的 public type。为使实现者不能把 fresh 与 duplicate 写成两套逻辑，`idempotency.rs` 内部必须有一个
private mode carrier 和一个 private helper。它们只在 application crate 内可见，不持久化、不序列化、不进入 Step 8
或 entry adapter。

```rust
/// fresh 与 duplicate 共用的校验模式；只携带校验所需的可信来源，不携带raw body。
enum SandboxStoredSurfaceValidationMode<'a> {
    /// typed surface刚由本次operation冻结，尚未对外返回fresh success。
    Fresh {
        /// closed selector映射出的唯一canonical operation。
        expected_operation: &'a OperationName,
        /// 当前variant要求的stored surface kind。
        expected_kind: SandboxStoredResultKind,
        /// reservation kernel为本次operation保留的exact carrier identity。
        expected_stored_result_ref: &'a SandboxStoredOperationResultRef,
        /// 本次finalization唯一读取的trusted clock值；JobReport即finished_at。
        finalization_at: &'a Timestamp,
    },
    /// duplicate已从同一committed snapshot读出carrier和typed surface。
    Duplicate {
        /// 当前请求closed selector映射出的canonical operation。
        expected_operation: &'a OperationName,
        /// 当前请求要求的stored surface kind。
        expected_kind: SandboxStoredResultKind,
    },
}

/// application-owned unified relation validator；不得被entry、infra或jobs直接调用。
fn validate_stored_surface_relation(
    surface: &SandboxLoadedReplaySurface,
    carrier: &SandboxStoredOperationResult,
    mode: SandboxStoredSurfaceValidationMode<'_>,
) -> ApplicationResult<()>;
```

该 helper 的输入/输出约束固定如下：

| 输入 | 唯一来源 | helper 行为 |
|---|---|---|
| `surface` | fresh typed save 的 checked rehydrate，或 duplicate exact typed get | 先按 `Command/Consumer/Job` 显式 match，再执行对应 surface validator；不接受 generic body。 |
| `carrier` | fresh 由已返回的 surface ref/status/time 构造，或 duplicate exact carrier get | 检查 carrier 自身已通过 `validate_state_shape()`，再检查与 surface 的双向 relation。 |
| `expected_operation` | closed selector -> core `OperationName` canonical mapping | 与 carrier operation、surface operation 和 variant selector逐一比较；不接受 caller string。 |
| `expected_kind` | variant fixed mapping：CommandResult / ConsumerReceipt / JobReport | 与 carrier kind、surface ref kind 和 union variant逐一比较；不根据actual kind选择分支。 |
| `expected_stored_result_ref` | 仅 Fresh reservation identity | Fresh必须与carrier、surface draft/frozen ref相等；Duplicate不得传入，也不得分配。 |
| `finalization_at` | 仅 Fresh trusted clock | Fresh要求与surface/carrier `recorded_at`相等；Duplicate不读取当前clock。 |
| return | existing `ApplicationResult<()>` | 只返回成功或既有 `ApplicationErrorDetail`；不返回新result、new ref、status猜测或partial surface。 |

helper 的固定执行顺序是：

```text
validate carrier state shape
  -> explicit expected operation/kind check
  -> explicit union variant check
  -> variant-specific surface.validate_carrier(carrier)
  -> operation/kind/status relation check
  -> stored_result_ref/surface_ref exact equality check
  -> recorded_at and applicable started_at/finished_at check
  -> return () only after every check passes
```

顺序不是优化提示，而是实现契约。任何早期检查失败都必须立即返回，禁止继续读取另一种 surface、重新加载 current
truth 或把错误降为 `DuplicateReplayed`。

### 35. 既有错误映射与 fail-closed 规则

B3-3 复用 Step 6 已有 `ApplicationErrorDetail`，不新增一个只为本批服务的错误 enum。实现者必须按下表映射，且
不得把 `Display`、raw adapter cause、operation 字符串或 surface body 写入错误。

| 校验失败 | application detail | fresh 行为 | duplicate 行为 |
|---|---|---|---|
| carrier 自身状态/非空 invariant失败 | `StoredResultStatusSurfaceMismatch` 或 `StoredResultSurfaceRefEmpty` | typed candidate不作为成功返回；whole group不提交 | `StoredResultUnavailable`；不重跑 |
| expected kind与carrier/surface kind不一致 | `StoredResultKindMismatch` | 拒绝 candidate；不猜测其它 store | `StoredResultUnavailable`；不切换其它 typed store |
| selector operation与carrier/surface operation不一致 | `StoredResultOperationMismatch` 或 `InvalidOperationMapping` | 不创建 completion linkage | `StoredResultUnavailable`；不按actual operation replay |
| original status与outcome status不匹配 | `OutcomeShapeInvalid` 或既有 command/report relation detail | 不创建 carrier/completion success | `StoredResultUnavailable`；不重建 outcome |
| carrier ref与surface stored ref不一致 | `StoredResultStatusSurfaceMismatch`；若是checked构造器无法解释的内部矛盾则 `InternalInvariantViolation` | whole group fail closed | `StoredResultUnavailable` |
| carrier surface ref与loaded surface ref不一致 | `StoredResultStatusSurfaceMismatch`；不再映射为operation mismatch | whole group fail closed | `StoredResultUnavailable` |
| recorded/finished/start时间来源或顺序不一致 | Command/Consumer 使用 `StoredResultStatusSurfaceMismatch`；Maintenance 使用 `MaintenanceBatchShapeInvalid`；Reconciliation 使用 `StoredResultStatusSurfaceMismatch` | 不提交 | `StoredResultUnavailable` |
| duplicate exact relation missing/invisible/corrupt | `StoredResultUnavailable` | 不适用 | 映射 `DuplicateMissingResult`，业务/external/identity分配均为0 |

typed store 自身返回的 `WrongKind`、`IntegrityViolation`、`NotFound` 和 `Unavailable` 不得被 application 转成空
surface；它们只能进入上表的保守错误映射。`AlreadyExists` 仍只是 persistence collision，不是 duplicate；只有
共同 validator 对 existing full pair 证明成功后，调用方才可形成 duplicate replay。

统一 helper 的成功后置条件：

1. `carrier.validate_state_shape()` 已通过，且 `carrier.is_replayable()` 为真。
2. `carrier.operation_name == expected_operation`，`carrier.result_kind == expected_kind`。
3. `carrier.surface_ref.kind == expected_kind`，且 surface 的 `surface_ref`、`stored_result_ref` 与 carrier 完全相等。
4. variant-specific original status、outcome status 和 carrier `result_status` 命中同一显式矩阵。
5. Fresh 的 `recorded_at == finalization_at`；Duplicate 的 persisted carrier/surface 时间完全相等，并且不使用当前时间。
6. 只有上述条件全部成立，fresh 才能继续 carrier/completion stage，duplicate 才能进入机械 replay mapping。

---

## EOF Current Authoritative Overlay: `S7-02D-B3-3` completed, `B3-4` next

> 本节位于物理 EOF，是本文件对 `S7-02D-B3-3` 的唯一 current authority（2026-07-27）。前述 §§33~35 保留为
> B3-3 的写作和审计轨迹；若其错误映射、字段遗漏或状态叙述与本节冲突，以本节为准。
> 本节仍是设计中间产物，不是正式 `03-详细设计.md`，不表示 Rust compile、test、run、evidence、验收或 commit 已发生。

### 36. B3-3 关闭范围与 canonical error 修正

本批只关闭五类 relation 的共同校验：

```text
operation_name
  + result_kind / surface_ref.kind
  + original status / outcome status / stored status
  + stored_result_ref / surface_ref relation
  + recorded_at and applicable job time relation
```

`CommandResult`、`ConsumerReceipt` 和 `JobReport` 都必须经过同一个 private application helper；helper 内部按
`SandboxLoadedReplaySurface` 的三个 variant 显式分派，不能由 adapter、entry、worker 或 jobs 复制一份关系逻辑。
`JobReport` 的 payload 仍只有 `Maintenance | Reconciliation`，二者都对应 `SandboxStoredResultKind::JobReport`。

本节同时修正前一版 §35 的两个问题：

1. `ApplicationErrorDetail` 只能使用 Step 6 §9.5 已存在的 canonical variant。不得引用未在 Step 6 定义的
   `StoredResultUnavailable` 之外的新 relation 名称，也不得新增本批专用 error enum。
2. carrier 与 surface ref 的 mismatch 不是 operation mismatch。`operation` 只描述 closed selector 与 canonical
   `OperationName` 的关系；stored-ref / surface-ref 关系错误使用 `StoredResultStatusSurfaceMismatch`，无法由
   checked object 解释的 adapter / row 矛盾才使用 `InternalInvariantViolation`。

B3-3 的 canonical application detail 允许集合如下，具体分支只能从此集合选择：

| failure family | canonical `ApplicationErrorDetail` | 使用边界 |
|---|---|---|
| selector 无法映射 operation | `InvalidOperationMapping` | closed selector 到 `OperationName` 的静态映射本身缺项或出现重复 owner。 |
| completed record 没有 stored linkage | `StoredResultLinkMissing` | idempotency record 已是 `Completed`，但 `stored_result_ref` 不是 exactly-one。 |
| surface identity 为空 | `StoredResultSurfaceRefEmpty` | checked surface ref 或其 `ResourceRef` 为空；不把空值变成 `NotFound`。 |
| kind 不一致 | `StoredResultKindMismatch` | expected kind、carrier kind、surface-ref kind 或 loaded union variant 任一不等。 |
| status / surface relation 不一致 | `StoredResultStatusSurfaceMismatch` | carrier status、surface original status、outcome status、stored status、stored-ref / surface-ref relation或时间字段矛盾。 |
| operation 不一致 | `StoredResultOperationMismatch` | canonical expected operation 与 carrier / payload / surface operation 不等；不用于 ref mismatch。 |
| typed surface lookup 缺失、不可见或无法安全重建 | `StoredResultUnavailable` | application 对 duplicate exact lookup 的保守内部结果；public mapper 才可映射为 `DuplicateMissingResult`。 |
| application outcome shape 不一致 | `OutcomeShapeInvalid` | Command/Consumer 的 `SandboxReplaySurfaceOutcome` 或其 status relation不满足 canonical matrix。 |
| maintenance item / batch shape 不一致 | `MaintenanceItemShapeInvalid` / `MaintenanceBatchShapeInvalid` | 只用于 JobReport/Maintenance 的 item、page token、selection、时间和聚合错误。 |
| 已无更窄安全类别的持久化矛盾 | `InternalInvariantViolation` | adapter 返回的完整 row/bundle 无法解释，或 impossible branch 穿透 checked constructor。 |
| port / snapshot / UoW 当前不可用 | `PortUnavailable` | typed store / snapshot / UoW 明确 unavailable；不伪造成 missing 或 duplicate。 |

`NotFound`、`WrongKind`、`IntegrityViolation`、`Unavailable` 是 Step 7 typed store 的 adapter error，不是
`ApplicationErrorDetail`。它们先保持在 port 边界；application 只按本表和 B3-4 的完整 recovery matrix 做穷尽映射。
`AlreadyExists` 仍不是 duplicate：只有 existing carrier 和 complete typed surface 通过本节 validator 后，才允许形成
duplicate observation。

### 37. 三类 frozen surface 的逐字段 operation / kind / status / ref / time 矩阵

#### 37.1 CommandResult

| relation field | canonical source | exact check | mismatch detail | fresh / duplicate rule |
|---|---|---|---|---|
| `operation_name` | `SandboxCommandKind` 经 Step 6 §9.2 closed selector mapping | `draft.operation_name() == expected_operation == carrier.operation_name()` | mapping缺失用 `InvalidOperationMapping`；值不等用 `StoredResultOperationMismatch` | fresh 从 checked command selector取得；duplicate 从当前 checked selector取得，绝不从 stored carrier反推 selector。 |
| `result_kind` | variant固定为 `CommandResult` | `carrier.result_kind() == CommandResult` | `StoredResultKindMismatch` | actual kind不授权改走 Consumer / Job store。 |
| `surface_ref.kind` | typed result store 返回的 `SandboxStoredResultSurfaceRef` | `surface_ref.kind() == CommandResult` | `StoredResultKindMismatch`；空 identity先用 `StoredResultSurfaceRefEmpty` | fresh 由 result store生成；duplicate 只读 exact ref。 |
| original status | `SandboxCommandResultSurfaceDraft.original_result_status()` | 只允许 `Accepted/Rejected/Pending/Degraded/Failed`；`DuplicateReplayed`禁止进入 draft | `StoredResultStatusSurfaceMismatch` | duplicate overlay只在 entry output产生，不改写 frozen original status。 |
| outcome status | `SandboxReplaySurfaceOutcome.outcome_status()` | 命中 `Accepted->Accepted`、`Rejected->Rejected`、`Pending->NoChange`、`Degraded->Degraded`、`Failed->Failed` | `OutcomeShapeInvalid` | outcome body来自当前 fresh operation；duplicate不得重组 body。 |
| stored status | outcome 显式映射 | `Accepted/Pending/Degraded/NoChange -> Completed`，`Rejected -> Rejected`，`Failed -> Failed` | `StoredResultStatusSurfaceMismatch` | carrier 与 typed surface必须相同；不持久化 `DuplicateReplayed`。 |
| `stored_result_ref` | reservation kernel 的 `SandboxStoredOperationResultRef` | draft、frozen surface、carrier、completed idempotency record四者 exactly equal | `StoredResultLinkMissing`（record缺link）；其它关系矛盾用 `StoredResultStatusSurfaceMismatch` | fresh 只使用 reservation 阶段分配的一份；duplicate 零分配。 |
| `surface_ref` | Command typed store 的 result-store identity | frozen surface ref == carrier.surface_ref；kind固定 | `StoredResultSurfaceRefEmpty` / `StoredResultStatusSurfaceMismatch` | surface ref不能由 operation、time、truth ref或 digest派生。 |
| `recorded_at` | finalization UoW 的 trusted clock | surface.recorded_at == carrier.recorded_at == completion.terminal_at；且不早于 reservation | `StoredResultStatusSurfaceMismatch` | fresh 同一 finalization time只读取一次；duplicate不读当前 clock。 |
| outcome refs / reasons | Step 6 checked outcome | outcome shape与original status完全匹配，refs不从 current truth补齐 | `OutcomeShapeInvalid` 或对应 ref-set detail | duplicate 逐字段重放，不能只重放 status。 |

Command 的完整 status 子矩阵：

| `SandboxCommandResultStatus` | `ServiceOutcomeStatus` | `SandboxStoredOperationResultStatus` | required shape |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | truth refs non-empty；reasons empty。 |
| `Rejected` | `Rejected` | `Rejected` | truth refs empty；reasons non-empty；side effects仅允许 flow声明的 audit-only。 |
| `Pending` | `NoChange` | `Completed` | 不保存 in-flight；保留 pending/no-change reason语义。 |
| `Degraded` | `Degraded` | `Completed` | reasons non-empty；不得把 unknown 或 raw adapter failure改成 accepted。 |
| `Failed` | `Failed` | `Failed` | reasons non-empty；不保存 raw cause。 |
| `DuplicateReplayed` | forbidden in frozen source | existing carrier status | 仅由 duplicate entry overlay生成。 |

#### 37.2 ConsumerReceipt

| relation field | canonical source | exact check | mismatch detail | fresh / duplicate rule |
|---|---|---|---|---|
| `operation_name` | `SandboxConsumerKind` 经 closed mapping | draft.operation_name == expected == carrier.operation_name | `InvalidOperationMapping` / `StoredResultOperationMismatch` | 不从 topic、route或 source event text推导。 |
| `result_kind` | variant固定为 `ConsumerReceipt` | carrier.result_kind == ConsumerReceipt | `StoredResultKindMismatch` | 不因 worker receipt 类型切换 store。 |
| `surface_ref.kind` | Consumer typed store生成 | kind == ConsumerReceipt，identity non-empty | `StoredResultSurfaceRefEmpty` / `StoredResultKindMismatch` | fresh 一次生成；duplicate exact read。 |
| source event ref | validated inbound envelope | frozen source_event_ref non-empty且与原始 envelope identity相等 | `OutcomeShapeInvalid`；若 row relation无法解释则 `InternalInvariantViolation` | duplicate不能用当前 delivery envelope替换。 |
| original receipt status | `SandboxConsumerReceiptSurfaceDraft.original_receipt_status()` | `Duplicate`禁止进入 fresh draft；其它六个 status必须命中分支矩阵 | `StoredResultStatusSurfaceMismatch` | duplicate overlay可为 `Duplicate`，不覆盖原 status。 |
| outcome status | application consumer outcome | `Accepted->Accepted`、`Delayed->NoChange/Degraded`、`Rejected->Rejected`、`Failed->Failed`、`Quarantined->Rejected/NoChange`、`NoOp->NoChange` | `OutcomeShapeInvalid` | `Delayed` / `Quarantined`的两分支由已验证 outcome决定，不由 caller bool选择。 |
| stored status | outcome映射 | `Accepted/Delayed/Quarantined(NoChange)/NoOp -> Completed`；`Rejected/Quarantined(Rejected) -> Rejected`；`Failed -> Failed` | `StoredResultStatusSurfaceMismatch` | no ack / retry side effect由 entry 根据 frozen status决定。 |
| `stored_result_ref` | reservation kernel | draft、surface、carrier、record linkage exactly equal | `StoredResultLinkMissing` / `StoredResultStatusSurfaceMismatch` | 不重新消费、不分配第二 ref。 |
| `surface_ref` | Consumer result store | surface ref与carrier相等且kind正确 | `StoredResultSurfaceRefEmpty` / `StoredResultStatusSurfaceMismatch` | 不用 worker-owned receipt ref替代。 |
| `recorded_at` | finalization UoW trusted clock | surface.recorded_at == carrier.recorded_at == completion.terminal_at；`reserved_at <= terminal_at` | `StoredResultStatusSurfaceMismatch` | duplicate原样返回，不读 current time。 |
| outcome refs / reasons | application outcome | source event、trace、truth/side-effect/reason集合完整且checked | `OutcomeShapeInvalid` / `ReasonSetInvalid` / `SideEffectRefSetInvalid` | 不从 current truth补 affected refs，不保存 raw event body。 |

Consumer 的状态分支必须按以下闭集执行：

| original receipt status | allowed outcome | stored status | forbidden |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | ack before confirmed commit；用当前 envelope重建 receipt。 |
| `Delayed` | `NoChange` 或 `Degraded` | `Completed` | 把 delayed 当 `Accepted`；丢失 safe reason。 |
| `Rejected` | `Rejected` | `Rejected` | 写入 mutation success。 |
| `Failed` | `Failed` | `Failed` | 保存 raw adapter cause或伪造 retry success。 |
| `Quarantined` | `Rejected` 或 `NoChange` | 分别 `Rejected` 或 `Completed` | 无 source proof时降级为 accepted。 |
| `NoOp` | `NoChange` | `Completed` | 把 no-op 当缺失或重新执行。 |
| `Duplicate` | forbidden in fresh source | existing carrier status | 把 duplicate 写进 frozen surface。 |

#### 37.3 JobReport

| relation field | canonical source | exact check | mismatch detail | fresh / duplicate rule |
|---|---|---|---|---|
| `operation_name` | `SandboxJobKind` 经 closed mapping | payload.operation_name == expected == carrier.operation_name | `InvalidOperationMapping` / `StoredResultOperationMismatch` | 不从 binary、route、report ref或 job name 字符串猜测。 |
| `result_kind` | variant固定为 `JobReport` | carrier.result_kind == JobReport | `StoredResultKindMismatch` | Maintenance / Reconciliation不得产生两个 stored kind。 |
| `surface_ref.kind` | Job typed store生成 | kind == JobReport，identity non-empty | `StoredResultSurfaceRefEmpty` / `StoredResultKindMismatch` | result store是唯一 surface identity owner。 |
| payload variant | `SandboxJobReportSurfacePayload` | 只允许 `Maintenance` 或 `Reconciliation`；variant与job kind exact match | `StoredResultKindMismatch` 或 `OutcomeShapeInvalid` | 不接受 generic JSON、counts-only、worker accumulator。 |
| original report status | payload / finalizer checked input | Maintenance允许 `Succeeded/PartialFailed/Failed/Skipped/Degraded`；Reconciliation允许 `Succeeded/Degraded/Failed` | Maintenance 用 `MaintenanceBatchShapeInvalid`；其它用 `OutcomeShapeInvalid` | `DuplicateReplayed`只作为 entry overlay。 |
| final outcome status | finalizer按完整 batch/envelope机械派生 | Maintenance: `Succeeded/Skipped -> NoChange`、`PartialFailed/Degraded -> Degraded`、`Failed -> Failed`；Reconciliation按 envelope canonical mapping | `OutcomeShapeInvalid` / `MaintenanceBatchShapeInvalid` | 不从 counts、current index或 latest truth重组。 |
| stored status | final outcome映射 | `NoChange/Degraded -> Completed`；`Failed -> Failed` | `StoredResultStatusSurfaceMismatch` | carrier与payload必须一致。 |
| `stored_result_ref` | reservation kernel | payload、surface、carrier、completed record linkage exactly equal | `StoredResultLinkMissing` / `StoredResultStatusSurfaceMismatch` | duplicate不生成新的 JobRunId 或 stored ref。 |
| `surface_ref` | Job result store | surface ref与carrier相等，kind为JobReport | `StoredResultSurfaceRefEmpty` / `StoredResultStatusSurfaceMismatch` | 不由 JobRunId、scope digest、report ref或时间派生。 |
| `started_at` | original job permit / run context | 只在 JobReport payload中存在，跨所有 batch保持不变 | `MaintenanceBatchShapeInvalid`（Maintenance）或 `StoredResultStatusSurfaceMismatch`（Reconciliation） | duplicate原样读取，不刷新 start time。 |
| `finished_at` | finalization trusted clock | `finished_at >= started_at` | `MaintenanceBatchShapeInvalid` 或 `StoredResultStatusSurfaceMismatch` | finalizer只读取一次。 |
| `recorded_at` | outer stored surface / carrier | `recorded_at == finished_at == completion.terminal_at`；且 `reserved_at <= terminal_at` | 同上 | duplicate不使用当前 clock。 |
| selection / batch / report refs | Maintenance permit 或 Reconciliation committed envelope | same operation、same snapshot、complete cardinality、stable order、exact lineage | `MaintenanceItemShapeInvalid` / `MaintenanceBatchShapeInvalid` / `InternalInvariantViolation` | 不读取 current binding或重新执行 job。 |

### 38. Maintenance / Reconciliation 分支矩阵

#### 38.1 Maintenance

| branch | input proof | surface / carrier relation | time relation | side effect / no-rerun rule |
|---|---|---|---|---|
| fresh non-empty selection | finalizable permit exhausted；所有 page token、target和item已覆盖且唯一 | `Maintenance` payload；job kind与selection variant一致；stored status按report matrix派生 | `started_at <= finished_at == recorded_at == terminal_at`；`reserved_at <= terminal_at` | finalizer只冻结selection和完整batch chain；item callable不在finalizer重跑。 |
| fresh explicit empty selection | caller明确提供empty selection；恰一terminal empty batch | report status只能由完整empty batch validator形成，通常为 `Skipped`；不得把empty当 all | 同上 | 零 item side effect是合法语义；不得从空集合补一条伪造 target。 |
| `Succeeded` | all item status `Succeeded` | outcome `NoChange`，stored `Completed`，reasons empty | 同上 | report-only finalization不重复拥有前序 truth。 |
| `PartialFailed` | at least one failed and at least one non-failed | outcome `Degraded`，stored `Completed`，reasons non-empty | 同上 | 保留每个 item result/reason；不回滚已提交 item。 |
| `Failed` | all required items failed或finalizer明确 failed | outcome `Failed`，stored `Failed`，reasons non-empty | 同上 | 不把 failed report转成 absent；不自动重跑同一 idempotency identity。 |
| `Skipped` / `Degraded` | batch validator提供完整原因/选择证明 | `Skipped -> NoChange/Completed`；`Degraded -> Degraded/Completed` | 同上 | safe skip/degraded只来自 typed item/batch source，不从 current scan猜测。 |

#### 38.2 Reconciliation

| branch | input proof | surface / carrier relation | time relation | side effect / no-rerun rule |
|---|---|---|---|---|
| fresh existing envelope | `SandboxReconciliationStoredJobReport::try_from_committed_group/rehydrate` 已通过；report/finding/audit/cursor同一 snapshot | payload variant=`Reconciliation`；job kind=`RunSandboxReconciliation`；stored kind=`JobReport` | `started_at <= finished_at == recorded_at == terminal_at`；`reserved_at <= terminal_at` | finalization只保存已有 envelope；不得再次运行 reconciliation或读取 current binding。 |
| `Succeeded` | exact report无 finding，optional relay关系满足 empty rule | outcome `NoChange`，stored `Completed` | 同上 | 不把 report-only 成功升级为新的业务 truth。 |
| `Degraded` | exact report/finding bundle完整但有安全缺口 | outcome `Degraded`，stored `Completed`，reasons non-empty | 同上 | finding / audit / optional relay按原 bundle保存，不修复 truth。 |
| `Failed` | exact envelope明确 failed且 safe reasons完整 | outcome `Failed`，stored `Failed` | 同上 | 不重算 finding，不用 latest report替换。 |
| missing / multiple / wrong report or relay | same-snapshot proof失败 | 不生成 frozen surface；application返回 `StoredResultUnavailable` 或 `InternalInvariantViolation` | 不读取当前时间补齐 | duplicate/recovery进入 B3-4，零 reconciliation execution。 |

Reconciliation 不使用 Maintenance 的 page-token、selection cardinality 或 `processed_count` 规则；Maintenance 也
不得把 Reconciliation envelope 当作一个 generic batch。两条分支唯一共享的是 JobReport kind、stored carrier relation、
trusted finalization time 和 duplicate no-rerun 外壳。

### 39. Fresh exact pseudo-code、UoW 顺序与 commit 前后行为

以下是 application-owned finalization suffix 的 Rust 风格伪代码。`validated_parts`、`draft` 和
`stage_operation_truth` 是所属 Command / Consumer / Job flow 已经闭合的输入或上游步骤，不是本节新增 public callable；
它们的 owner、字段和前置条件仍回指 Step 6 / 本文件 §§16~30。

```rust
async fn finalize_fresh_replay_surface(
    context: &SandboxServiceCallContext,
    reservation: FreshReservationOwnership,
    validated_parts: ValidatedReplayParts,
    stores: &ReplayStores,
    uow_manager: &dyn SandboxUnitOfWorkManager,
    clock: &dyn SandboxClockPort,
) -> ApplicationResult<SandboxServiceOutcome> {
    // reservation 已由唯一 reserve_fresh_operation 取得；不能在这里再次 claim 或分配 ref。
    let mut uow = uow_manager.begin().await.map_err(map_uow_begin)?;
    let finalization_at = clock.now().map_err(map_clock_failure)?;

    // Command/Consumer 的 truth/side-effect group由所属 flow 在此 UoW stage；
    // Maintenance/Reconciliation 只 stage report finalization所拥有的 relation。
    stage_operation_truth(&validated_parts, &mut uow)?;

    let saved_surface = match validated_parts.surface_draft() {
        ReplaySurfaceDraft::Command(draft) => {
            stores.command.save_command_result_surface(
                draft,
                finalization_at.clone(),
                &mut *uow,
            ).await.map_err(map_command_store_error)?
        }
        ReplaySurfaceDraft::Consumer(draft) => {
            stores.consumer.save_consumer_receipt_surface(
                draft,
                finalization_at.clone(),
                &mut *uow,
            ).await.map_err(map_consumer_store_error)?
        }
        ReplaySurfaceDraft::Job(payload) => {
            stores.job.save_job_report_surface(
                payload,
                finalization_at.clone(),
                &mut *uow,
            ).await.map_err(map_job_store_error)?
        }
    };

    let carrier = SandboxStoredOperationResult::try_new(
        reservation.stored_result_ref().clone(),
        context.operation_name().clone(),
        saved_surface.kind(),
        saved_surface.surface_ref().clone(),
        validated_parts.expected_stored_status(),
        finalization_at.clone(),
    )?;

    let loaded = match saved_surface {
        SavedReplaySurface::Command(surface) => SandboxLoadedReplaySurface::Command(surface),
        SavedReplaySurface::Consumer(surface) => SandboxLoadedReplaySurface::Consumer(surface),
        SavedReplaySurface::Job(surface) => SandboxLoadedReplaySurface::Job(surface),
    };

    validate_stored_surface_relation(
        &loaded,
        &carrier,
        SandboxStoredSurfaceValidationMode::Fresh {
            expected_operation: context.operation_name(),
            expected_kind: loaded.kind(),
            expected_stored_result_ref: reservation.stored_result_ref(),
            finalization_at: &finalization_at,
        },
    )?;

    stores.carrier.create_stored_operation_result(&carrier, &mut *uow)
        .await.map_err(map_carrier_store_error)?;

    let mut record = reservation.record().clone();
    let terminal_at = finalization_at.clone();
    record.mark_completed(&carrier, terminal_at.clone())?;
    stores.idempotency.save_idempotency_completion(
        &record,
        reservation.version().clone(),
        &mut *uow,
    ).await.map_err(map_idempotency_error)?;

    match uow_manager.commit(uow).await {
        Ok(confirmed) => {
            // Only this branch can expose the fresh surface as committed.
            assert_commit_relation(&confirmed, &carrier, &terminal_at)?;
            Ok(materialize_fresh_service_outcome(validated_parts, carrier, loaded)?)
        }
        Err(SandboxCommitError::NotCommitted(not_committed)) => {
            map_not_committed(not_committed)
        }
        Err(SandboxCommitError::StatusUnknown(unknown)) => {
            // B3-4 owns exact whole-group inspection. Freeze all identities and do not retry here.
            Err(map_commit_unknown_for_inspection(unknown))
        }
    }
}
```

伪代码中的 `stage_operation_truth`、`materialize_fresh_service_outcome` 和各 `map_*` 仅表示已有 owner 的调用点和
穷尽映射，不允许实现者据此新建 generic service、error或repository API。关键顺序是固定的：

```text
validated operation parts
  -> one fresh reservation identity
  -> one write UoW and one finalization clock read
  -> operation-specific truth / side-effect stage
  -> typed surface save (surface identity generated by store)
  -> SandboxStoredOperationResult::try_new
  -> common relation validator
  -> generic carrier create in same UoW
  -> SandboxIdempotencyRecord::mark_completed
  -> save_idempotency_completion with exact Version
  -> commit
  -> confirmed-only fresh mapping
```

#### 39.1 Commit 前后行为矩阵

| 时点 / 结果 | staged relation可见性 | 对外结果 | identity / external rule | 后续 owner |
|---|---|---|---|---|
| typed save success | 仅当前 UoW 可见 | 不返回 success | 不表示 surface committed；不再分配 surface ref | 当前 finalizer继续 carrier pair。 |
| carrier create / completion stage success | 仅当前 UoW 可见 | 不返回 success | carrier、surface、record必须在同组；不调用 external side effect | 当前 finalizer调用 commit。 |
| `Confirmed(receipt)` | committed | 允许 fresh `Accepted/Rejected/Degraded/NoChange/Failed` mapping | 保留原 stored/idempotency refs；不再补写 success | entry / Step 8 mechanical mapper。 |
| `NotCommitted` | 明确整组不可见 | 返回现有 safe error；不得返回 fresh success | 不重用旧 in-memory outcome；是否可新调用由完整 preflight决定 | application error mapper。 |
| `StatusUnknown` | 可见性未知 | 返回 conservative internal / delayed-safe结果；不得 success | 冻结原 operation、record ref、stored ref、surface ref、transaction ref；不二次 identity、不 external retry | B3-4 exact inspection / recovery owner。 |
| rollback failure / unknown | 可见性未知 | 不宣称 absent、success或rollback confirmed | 不重复提交、不扫描 latest、不用新 key在同一 flow自救 | UoW consistency / recovery owner。 |

`terminal_at` 只在 `mark_completed` 或 `mark_failed` 的合法 transition 中产生；对于 replayable public failed surface，
record 走 `Completed + stored Failed` 路径，因此仍满足 `recorded_at == terminal_at`。对于没有 replayable surface 的
terminal failed record，只有 `reserved_at <= terminal_at`，不得虚构 `recorded_at` 或 stored carrier。

### 40. Duplicate exact pseudo-code 与 zero-side-effect 证明

duplicate 路径只能由 exact identity observation 进入；它不开始 write UoW，也不调用 clock、allocator、业务 repository、
external port、audit/relay writer 或 job item callable。

```rust
async fn replay_existing_operation(
    context: &SandboxServiceCallContext,
    observation: SandboxIdempotencyObservation,
    stores: &ReplayStores,
    read_manager: &dyn SandboxCommittedReadManager,
) -> ApplicationResult<EntryReplaySurface> {
    let SandboxIdempotencyObservation::Duplicate(recorded_carrier) = observation
        else { return Err(invalid_duplicate_observation()) };

    let expected_operation = context.operation_name();
    let expected_kind = expected_kind_for_checked_selector(context)?;
    let stored_result_ref = recorded_carrier.stored_result_ref().clone();

    let mut snapshot = read_manager.open().await.map_err(map_snapshot_open)?;
    let carrier = stores.carrier.get_stored_operation_result_with_version(
        &stored_result_ref,
        &mut *snapshot,
    ).await.map_err(map_carrier_read_error)?;

    // The carrier is checked before choosing the typed store. Actual kind is never a dispatcher.
    carrier.value().validate_state_shape()?;
    if carrier.value().result_kind() != expected_kind {
        return Err(application_error(ApplicationErrorDetail::StoredResultKindMismatch));
    }
    if carrier.value().operation_name() != expected_operation {
        return Err(application_error(ApplicationErrorDetail::StoredResultOperationMismatch));
    }

    let loaded = match expected_kind {
        SandboxStoredResultKind::CommandResult => {
            let surface = stores.command.get_command_result_surface_with_version(
                carrier.value().surface_ref(),
                carrier.value().stored_result_ref(),
                expected_operation,
                &mut *snapshot,
            ).await.map_err(map_command_read_error)?;
            SandboxLoadedReplaySurface::Command(surface.into_value())
        }
        SandboxStoredResultKind::ConsumerReceipt => {
            let surface = stores.consumer.get_consumer_receipt_surface_with_version(
                carrier.value().surface_ref(),
                carrier.value().stored_result_ref(),
                expected_operation,
                &mut *snapshot,
            ).await.map_err(map_consumer_read_error)?;
            SandboxLoadedReplaySurface::Consumer(surface.into_value())
        }
        SandboxStoredResultKind::JobReport => {
            let surface = stores.job.get_job_report_surface_with_version(
                carrier.value().surface_ref(),
                carrier.value().stored_result_ref(),
                expected_operation,
                &mut *snapshot,
            ).await.map_err(map_job_read_error)?;
            SandboxLoadedReplaySurface::Job(surface.into_value())
        }
    };

    validate_stored_surface_relation(
        &loaded,
        carrier.value(),
        SandboxStoredSurfaceValidationMode::Duplicate {
            expected_operation,
            expected_kind,
        },
    )?;

    read_manager.close(snapshot).await.map_err(map_snapshot_close)?;

    // Existing surface is mapped mechanically; Duplicate overlay is transport/entry-local only.
    Ok(materialize_duplicate_entry_surface(loaded, carrier.into_value())?)
}
```

`materialize_duplicate_entry_surface` 只表示现有 entry / Step 8 mapping handoff，不是新增 public callable；它必须把
原始 status、trace、source event、job run、selection、batch、finding、audit、relay和所有 typed refs 原样复制，再按
channel规则只添加本次 duplicate overlay。

#### 40.1 Duplicate zero-side-effect proof

| action surface | duplicate允许行为 | 计数 / 约束 |
|---|---|---:|
| idempotency | 从已有 observation和exact record relation读取 | write `0`；second claim `0` |
| generic carrier | exact `get_stored_operation_result_with_version` | save/create `0` |
| typed surface | 只调用 expected kind 对应的一个 `get_*_with_version` | typed save `0`；其它 typed store read `0` |
| business truth repository | 不读取 current truth来重建结果 | mutation write `0`；repair `0` |
| identity allocator / cursor | 不分配 stored、surface、truth、audit、relay、job或cursor identity | allocation `0` |
| trusted clock | 不读取 current time；使用 persisted `recorded_at` / JobReport times | clock read `0` |
| external port | 不调用 backend、publisher、handoff、capture、process或network | external call `0` |
| worker / jobs主体 | 不重投 event、不执行 item、不重新 selection、不运行 reconciliation | semantic execution `0` |
| audit / relay / observability writer | 不追加、不修复、不发送；只可读取已保存 relation | write `0` |
| output | 机械映射 exact frozen surface，增加 entry-local duplicate overlay | current truth substitution `0` |

因此 duplicate 的唯一允许写入是 entry 层内存中的一次 overlay；该 overlay 不写入 frozen surface、idempotency record、
carrier 或 typed store。任一 carrier/surface 缺失、不可见、wrong-kind、wrong-operation、wrong-ref、wrong-status、
wrong-time或完整性错误都不得跳过 validator，也不得转入 fresh 分支。

### 41. 时间关系与跨对象 closure

时间关系以 trusted `Timestamp` 的可比较语义为准，不使用字符串比较、wall-clock winner或 adapter 自带时间替代：

| object / relation | exact relation | owner / failure |
|---|---|---|
| idempotency reservation | `reserved_at` 由 reservation clock 冻结；Reserved 时 `terminal_at = None` | reservation factory / `StoredResultStatusSurfaceMismatch` only if a persisted bundle violates shape。 |
| terminal failed without replay surface | `reserved_at <= terminal_at`；stored linkage `None`；没有 `recorded_at` | `SandboxIdempotencyRecord::mark_failed`；过早或缺失时间进入 existing transition/invariant detail。 |
| replayable completion | `reserved_at <= terminal_at == recorded_at`；record status `Completed`；stored linkage exactly-one | `mark_completed` + typed surface validator；任何不等为 `StoredResultStatusSurfaceMismatch`。 |
| Command surface | `surface.recorded_at == carrier.recorded_at == terminal_at` | `SandboxStoredCommandResultSurface::validate_carrier` / common helper。 |
| Consumer surface | `surface.recorded_at == carrier.recorded_at == terminal_at` | `SandboxStoredConsumerReceiptSurface::validate_carrier` / common helper。 |
| Maintenance report | `started_at <= finished_at == recorded_at == terminal_at` | `SandboxMaintenanceJobReportSurfaceDraft::validate_shape` + common helper；失败用 `MaintenanceBatchShapeInvalid`。 |
| Reconciliation report | `started_at <= finished_at == recorded_at == terminal_at` | envelope rehydration + common helper；失败用 `StoredResultStatusSurfaceMismatch` 或 `InternalInvariantViolation`。 |
| duplicate | all times are persisted values from one committed snapshot; current `now()` is forbidden | no new time / no second finalization。 |

`finished_at == recorded_at` 是 JobReport 的 outer relation，不意味着每个 item 的完成时间相同；item 内部时间若不是
canonical payload字段，不能由 finalizer补造。`terminal_at` 是 idempotency record 的 lifecycle time，不能被 surface
ref、repository Version、cursor或 job process exit time替代。

### 42. B3-3 unified validator 的静态 closure audit

| audit item | expected | current result |
|---|---:|---:|
| frozen surface variant | 3 | `3/3`：Command / Consumer / Job；无第四种 stored kind。 |
| JobReport payload branch | 2 | `2/2`：Maintenance / Reconciliation；均为 JobReport kind。 |
| variant-specific `validate_carrier` | 3 | `3/3`，由 `SandboxLoadedReplaySurface` 显式 match 调用。 |
| common validator | 1 | `1/1` private `validate_stored_surface_relation`；fresh / duplicate 共用。 |
| operation relation | replayable Command `10/10`、Consumer `9/9`、Job `10/10` | `29/29` current non-Query operations；canonical mapping来自 Step 6，Query仍 `0`。 |
| kind relation | Command / Consumer / Job | `3/3` expected kind、carrier kind、surface-ref kind、union variant均有比较。 |
| Command status branches | 5 fresh + 1 forbidden overlay | `5/5` fresh；`DuplicateReplayed`不入 frozen source。 |
| Consumer status branches | 6 fresh + 1 forbidden overlay | `6/6` fresh；`Duplicate`不入 frozen source。 |
| Maintenance status branches | 5 fresh + 1 forbidden overlay | `5/5` fresh；完整 batch chain required。 |
| Reconciliation status branches | 3 fresh + 1 forbidden overlay | `3/3` fresh；exact envelope required。 |
| stored ref relation | record / draft / surface / carrier | `4/4` equality obligations；missing record linkage单独为 `StoredResultLinkMissing`。 |
| surface ref relation | typed store / frozen surface / carrier | `3/3` equality and kind obligations；不再误映射 operation mismatch。 |
| time relation | reservation / terminal / recorded / job start-finish | `4/4` families；duplicate不读 current clock。 |
| error owner | Step 6 canonical details | `0` new detail；本节只使用既有 detail。 |
| same-UoW fresh group | typed surface + carrier + completion | `3/3` surface families进入同一 allowed UoW group；commit前不对外 success。 |
| duplicate side effects | writes / allocation / clock / external calls | `0/0/0/0`；只允许 committed exact reads和内存 overlay。 |
| worker/jobs dependency | application persistence source依赖 | `0`；不接受 worker receipt或jobs accumulator。 |
| public callable / DTO | B3新增 | `0/0`；Step 8仍冻结。 |

B3-3 完成后仍未关闭的内容：

- `S7-02D-INT-03` 继续 open，等待 B3-4 把 missing、wrong-kind、invisible、corrupt、half-commit 和 adapter error
  逐分支映射为 no-rerun whole-group 结果。
- `S7-02D-INT-04` 继续 open，等待 B3-4 完成 fresh/duplicate/failure/commit-unknown 的完整 application 算法和
  exact inspection。
- `S7-02D-B3-4` 是下一合法内部任务；本节不宣称 `S7-02D`、`S7-G02`、Step 8 或正式 `03~07` 已完成。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_task = S7-02D-B3 typed stored carrier and full surface stores
batch_status = in_progress
completed_internal_sub_batches = S7-02D-B3-1,S7-02D-B3-2,S7-02D-B3-3
completed_internal_sub_batch = S7-02D-B3-3 cross-validation
current_internal_sub_batch = none
next_internal_sub_batch = S7-02D-B3-4 whole-group missing/wrong-kind/invisible/corrupt no-rerun
next_allowed_action = write_s7_02d_b3_batch_4
surface_variant = 3/3
job_report_payload = 2/2 Maintenance|Reconciliation
carrier_method = 2/2
typed_surface_method = 6/6
unified_validator = 1/1 private application helper
operation_join = 29/29 non_Query replayable callables
query_write = 0/13
duplicate_write = 0
duplicate_identity_allocation = 0
duplicate_external_call = 0
new_application_error_detail = 0
new_l1_l2_blocker = 0
ref_blocker = open_wait_s7_02d_b3_4
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Authoritative Overlay: S7-02D-B3-4 completed, INT-03 closed

> 本节位于物理 EOF，是本文件对 S7-02D-B3-4 的唯一 current authority（2026-07-27）。
> 前述 B3-3 及更早章节保留为设计推导轨迹；若其状态或异常映射与本节冲突，以本节为准。
> 本节只完成 stored carrier / typed surface 的完整性和 no-rerun 边界，不宣称 S7-02D-B4 的
> fresh/duplicate whole-group 算法、commit-unknown exact inspection、Step 7 或正式文档已完成。

### 43. B3-4 开工门禁、目标与粒度裁决

| 项 | 当前结论 |
|---|---|
| consumed predecessor | S7-02D-B3-1 frozen surface owner/schema；B3-2 carrier/typed-store exact port；B3-3 unified relation validator。 |
| current sub-batch | S7-02D-B3-4，本节完成后进入用户审查停点。 |
| closed design gap | S7-02D-INT-03：missing、wrong-kind、invisible、corrupt、partial/half-commit 输入的 fail-closed 与 no-rerun 矩阵。 |
| remaining design gap | S7-02D-INT-04：fresh/duplicate/failure/commit-unknown 的完整 application 算法与 exact whole-group inspection，交由 S7-02D-B4。 |
| L1 scope | carrier、typed surface、idempotency linkage、同一 snapshot / UoW、错误映射、不可重跑和安全冻结。 |
| L2 scope | fake/durable error parity、普通 retention/diagnostic 只保留 owner 和安全默认；不设计运维查询系统。 |
| new public callable | 0；不新增 trait、DTO、stored kind、repository module 或 entry mapper。 |
| new application error detail | 0；只使用 Step 6 §9.5 canonical detail。 |
| implementation | CB-SBX-01A blocked / wait_design；不修改目标实现仓。 |
| commit | no。 |

B3-4 的“完整”仅表示每个已定义的 carrier/surface adapter 失败面都有确定的安全处置和下游 owner，
不表示每个异常都展开成独立业务 flow。主体 operation 的语义执行、runtime agent loop、member lifecycle
orchestration、审计平台和交付过程仍在本批范围之外。

### 44. Whole-group 关系定义

B3-4 使用三种关系集合，名称是中间产物中的 application-local 术语，不新增持久化类型：

| group | 必须同时证明的成员 | 可对外暴露的条件 | 任一成员缺失时 |
|---|---|---|---|
| fresh replayable completion | 已确认 reservation 的 idempotency record、完整 typed surface、generic carrier、operation-owned truth/side-effect group、completion linkage | 所有成员在同一 allowed UoW stage，且 commit 返回 confirmed；再由 B3-3 validator 通过 | 当前调用不得返回 fresh success；不补写另一成员，不换 identity。 |
| duplicate exact read | 同一 committed snapshot 中的 completed record、exact carrier、expected-kind typed surface，及 B3-3 relation proof | record、carrier、surface 和 relation 全部可见且校验通过 | 进入 conservative duplicate error；不写、不分配、不重跑。 |
| terminal failure without replay surface | 已拥有 reservation 的 record、合法 failed transition、required safety marker/audit group | failure UoW commit confirmed；stored linkage 保持 none | 不伪造 failed surface；unknown 可见性交给 B4 inspection。 |

“half-commit”定义为上述任一 proper subset 可见，或成员来自不同 committed generation / Version，
例如 record 已 Completed 但 carrier 不存在、carrier 存在但 typed surface 不存在、surface 存在但
record linkage 缺失、JobReport 的 report/finding/audit bundle 不完整。half-commit 不能被解释为
success、duplicate、fully absent 或可修复的普通 cache miss。

以下关系永远不是 whole-group 的替代：

- 用 operation/name、surface ref、JobRunId、digest、timestamp 或 latest row 推导缺失成员。
- 用另一个 typed store 猜测 actual kind。
- 用 current truth、当前 delivery envelope、当前 reconciliation binding 或 jobs accumulator 重建 frozen body。
- 先返回业务 success，再异步补 carrier、surface、record linkage、audit 或 relay。

### 45. Adapter error 到 application disposition 的穷尽矩阵

Typed adapter error 先保持在 port 边界；application 只按调用阶段和是否已有 exact committed
observation 做映射。NotFound、WrongKind、IntegrityViolation 和 Unavailable 不是 public result
status，也不允许转为空 surface。

| 来源 / 阶段 | exact 输入 | fresh/当前写入处置 | duplicate exact-read 处置 | 禁止动作 |
|---|---|---|---|---|
| carrier get | NotFound | 若本次已 confirmed reservation，则视为未完成的 own-group 缺口；不返回 success，交 B4 whole-group decision | StoredResultUnavailable，entry 才能映射 DuplicateMissingResult | latest/all scan、重新 claim、重跑 operation |
| carrier get | IntegrityViolation | 已知 relation 错误用 StoredResultStatusSurfaceMismatch；无法解释的 row 用 InternalInvariantViolation；整组 fail closed | StoredResultUnavailable；不把损坏 row 当作空结果 | 修复 row、改 status、按 actual operation replay |
| carrier get | Unavailable | PortUnavailable；保留原 reservation/identity，交 B4 recovery | PortUnavailable；这不是已证明的 duplicate missing | 把暂不可用伪造成 NotFound 或 DuplicateMissingResult |
| typed get | NotFound | 已 stage 的其它成员不能独立提交；整组 abort/unknown 路由由 B4 决定 | StoredResultUnavailable -> DuplicateMissingResult | 切到其它 typed store、从 current truth 补正文 |
| typed get | WrongKind | fresh candidate 与 expected kind 不符，StoredResultKindMismatch；不提交 | exact lookup 不授权改变 expected kind；映射 StoredResultUnavailable -> DuplicateMissingResult | 以 actual kind 重新分派、修改 carrier kind |
| typed get | IntegrityViolation | 若已知是 status/ref/time/shape 矛盾，使用对应 canonical detail；无法解释则 InternalInvariantViolation | StoredResultUnavailable；不重建 surface | 只返回 status、丢弃 refs/reasons、重跑 JobReport |
| typed get | Unavailable | PortUnavailable；冻结已分配 identity | PortUnavailable；不宣称结果缺失 | retry typed read 后继续业务副作用 |
| typed save | AlreadyExists | 只表示 persistence collision，不等于 duplicate；不申请第二 surface ref；交 B4 exact race/inspection | 不适用于 duplicate read | 把 collision 直接映射为成功或另一个 fresh winner |
| typed/carrier save | IntegrityViolation | draft/carrier relation fail closed；当前 UoW 不得提交 partial group | 不适用于 duplicate read | 由 adapter 放宽校验、保存 placeholder |
| typed/carrier save | Unavailable | PortUnavailable 或既有 UoW terminal result；不返回 fresh success | 不适用于 duplicate read | 以 in-memory candidate 作为 committed replay |
| UoW terminal | NotCommitted | 明确整组不可见时返回既有 safe error；不得在同一调用中重跑 | 不进入 duplicate read | 复用旧 outcome、第二次 commit、第二 identity |
| UoW terminal | StatusUnknown / rollback unknown | 冻结原 operation、record/stored/surface/transaction refs；只交 B4 exact inspection | 不把未知可见性当 missing 或 success | 重读 current truth、修复 index、external retry |

对于 duplicate，只有 exact read 已经完成但 relation 无法安全重建时才使用 StoredResultUnavailable；
snapshot/port 在读取前明确不可用，必须保留 PortUnavailable。这样不会把基础设施 outage 错误伪装成永久
duplicate missing。

### 46. Missing / wrong-kind / invisible / corrupt no-rerun 矩阵

#### 46.1 Record 与 carrier 层

| observation | relation proof | application detail | side effect budget | next owner |
|---|---|---|---|---|
| completed record 的 stored_result_ref = None | completed linkage 不是 exactly-one | StoredResultLinkMissing；duplicate public mapping 为 DuplicateMissingResult | write 0、allocation 0、clock 0、external 0 | duplicate mapper；不进入 fresh |
| completed record 指向 empty ref | checked ref shape 失败 | StoredResultSurfaceRefEmpty 或 StoredResultLinkMissing | 同上 | application error mapper |
| exact carrier 不可见 | committed snapshot 对 exact ref 返回 NotFound | StoredResultUnavailable；fresh own-group 由 B4 判定 | duplicate write/allocation/external 0 | B4 only for unknown fresh visibility |
| carrier 的 operation 不等 | B3-3 operation relation 失败 | StoredResultOperationMismatch（duplicate conservative 为 StoredResultUnavailable） | 不按 actual operation replay | application mapper |
| carrier kind 不等 expected | actual kind 不能授权 dispatcher | StoredResultKindMismatch（duplicate conservative 为 StoredResultUnavailable） | 不读取其它 typed store | application mapper |
| carrier status 无 surface 允许值 | status shape 失败 | StoredResultStatusSurfaceMismatch | 不把 Reserved/unknown 当 Completed | B4/reconciliation |
| carrier surface ref empty 或 kind 错 | ref relation 失败 | StoredResultSurfaceRefEmpty / StoredResultStatusSurfaceMismatch | 不从 operation/ref 派生新 ref | application mapper |

#### 46.2 Typed surface 层

| observation | relation proof | application detail | side effect budget | next owner |
|---|---|---|---|---|
| Command surface exact ref missing/invisible | carrier 存在但 Command payload 不可见 | duplicate StoredResultUnavailable -> DuplicateMissingResult；fresh 不提交 | duplicate 全为 0 | B4 only if write visibility unknown |
| Consumer surface exact ref missing/invisible | source event/ref/outcome 不在同一 snapshot 可见 | 同上；不读取当前 delivery envelope | duplicate 全为 0 | B4 / consumer recovery |
| JobReport surface exact ref missing/invisible | report 或其 required payload 不可见 | 同上；不重新运行 maintenance/reconciliation | duplicate 全为 0 | B4 / job recovery |
| typed store 返回 WrongKind | expected kind 与 store/surface 不符 | fresh StoredResultKindMismatch；duplicate StoredResultUnavailable | 不切换 store | application mapper |
| typed payload relation corrupt | operation/ref/status/time/shape 任一矛盾 | fresh 对应 canonical shape detail；duplicate StoredResultUnavailable | 不修复、不重建 | B4 inspection |
| surface 存在但 carrier 不存在 | surface 不是独立 public truth | StoredResultUnavailable 或 fresh own-group integrity error | 不返回 surface、不创建 carrier 单独补链 | B4 |
| surface 与 carrier 来自不同 Version | same-snapshot proof 失败 | StoredResultStatusSurfaceMismatch / duplicate conservative unavailable | 不使用较新或较旧一方 | B4 |

#### 46.3 JobReport payload 层

| payload branch | required exact members | missing/corrupt result | no-rerun rule |
|---|---|---|---|
| Maintenance | checked job kind、immutable selection snapshot、ordered page/batch chain、每个 item result/ref/reason、report status、started_at <= finished_at == recorded_at | item 错误用 MaintenanceItemShapeInvalid；batch/selection/time 错误用 MaintenanceBatchShapeInvalid；duplicate 映射 DuplicateMissingResult | 不重新选择 target、不读取 current projection、不补 processed count/page token |
| Reconciliation | exact report envelope、finding/audit relation、optional relay relation 的同一 snapshot proof、started_at <= finished_at == recorded_at | 已知 shape 错误用 StoredResultStatusSurfaceMismatch；无法解释的 bundle 用 InternalInvariantViolation；duplicate conservative unavailable | 不重新运行 reconciliation、不用 latest report 替换、不修复 finding/relay |

JobReport 两个 branch 都只产生 SandboxStoredResultKind::JobReport。不能把 Maintenance 的 batch 缺口
降级为普通 JobReport 空报告，也不能把 Reconciliation 的缺口转成 Maintenance selection retry。

### 47. Fresh / duplicate 的停止点与 no-rerun 伪代码

B3-4 不新增 public callable；以下是 application-local error boundary 的伪代码，用于固定每个
adapter 结果的停止位置。完整 fresh/duplicate/failure/commit-unknown orchestration 仍由 B4 书写。

```rust
fn map_duplicate_exact_read_failure(
    failure: DuplicateExactReadFailure,
) -> ApplicationError {
    match failure {
        DuplicateExactReadFailure::CarrierNotFound
        | DuplicateExactReadFailure::SurfaceNotFound
        | DuplicateExactReadFailure::WrongKind
        | DuplicateExactReadFailure::IntegrityViolation
        | DuplicateExactReadFailure::RelationInvisible => {
            application_error(ApplicationErrorDetail::StoredResultUnavailable)
        }
        DuplicateExactReadFailure::PortUnavailable => {
            application_error(ApplicationErrorDetail::PortUnavailable)
        }
    }
}

fn stop_fresh_on_stored_group_failure(
    failure: FreshStoredGroupFailure,
) -> FreshFailureDisposition {
    match failure {
        FreshStoredGroupFailure::DraftShape(detail) => {
            FreshFailureDisposition::AbortWithoutCommit(detail)
        }
        FreshStoredGroupFailure::WrongKind => {
            FreshFailureDisposition::AbortWithoutCommit(
                ApplicationErrorDetail::StoredResultKindMismatch,
            )
        }
        FreshStoredGroupFailure::RelationMismatch(detail) => {
            FreshFailureDisposition::AbortWithoutCommit(detail)
        }
        FreshStoredGroupFailure::PortUnavailable => {
            FreshFailureDisposition::AbortOrTerminalRecovery(
                ApplicationErrorDetail::PortUnavailable,
            )
        }
        FreshStoredGroupFailure::AlreadyExists => {
            FreshFailureDisposition::FreezeForExactInspection,
        }
        FreshStoredGroupFailure::CommitNotConfirmed => {
            FreshFailureDisposition::FreezeForExactInspection,
        }
    }
}
```

上段的 DuplicateExactReadFailure 与 FreshStoredGroupFailure 只是本文件用于表达穷尽
分支的 private conceptual carrier，不得作为新的 public enum、DTO 或 adapter error。实现必须直接
使用既有 typed port error 和 Step 6 ApplicationErrorDetail，不得用字符串匹配填充该伪代码。

duplicate 的实际停止顺序固定为：

```text
exact completed record observation
  -> exact carrier get in one committed snapshot
  -> expected-kind typed surface get in the same snapshot
  -> B3-3 unified validator
  -> mechanical replay mapping
```

其中任一 read/validator 失败都直接返回 error；以下动作全部为 0：

```text
business repository read/write
current truth rebuild
external backend / process / network / publisher call
worker event re-delivery or jobs item execution
identity / cursor / surface-ref allocation
trusted clock read
audit / relay / observability write
second idempotency claim
```

fresh 的停止顺序固定为：

```text
typed surface save failure -> no carrier create -> no completion stage
carrier create failure -> no completion stage -> no success
completion stage failure -> no commit success -> no partial exposure
commit NotCommitted -> no fresh success; caller returns safe failure
commit StatusUnknown -> freeze all exact identities; B4 inspection only
```

如果所属 operation 已经拥有一个 canonical、完整且可 replay 的 Failed surface，则它仍按
B3-3 status matrix 保存；如果只拥有 raw adapter cause 或不完整失败信息，则走 B2 terminal
failure without replay surface，不得制造 placeholder surface。失败策略本身不在本批扩写。

### 48. Half-commit 与可见性裁决

| committed observation | classification | fresh response | duplicate response | repair/retry |
|---|---|---|---|---|
| record Reserved，carrier/surface 均不可见 | 正常 in-flight 或 confirmed rollback 后的 absent，需由 record lifecycle / B4 证明 | 不允许第二次 fresh execution；按 reservation owner 处理 | IdempotencyInFlight，不读取 surface | 不在 duplicate path repair |
| record Completed，carrier absent | half-commit / missing linkage group | 不宣称 success；冻结原 identity | DuplicateMissingResult | 不重跑、不创建 carrier |
| record Completed + carrier，surface absent | half-commit | 不宣称 success；B4 inspection | DuplicateMissingResult | 不创建 placeholder、不重跑 |
| record Completed + surface，carrier absent | orphan surface | 不宣称 success；B4 inspection | DuplicateMissingResult | 不把 surface 提升为 carrier |
| carrier + surface，record 仍 Reserved/Failed | completion linkage 未成立 | 不返回 success；按所属 record transition 处理 | 不返回 duplicate | 不把 record 强行改 Completed |
| 三者均存在但 Version/generation 不一致 | mixed-generation relation | StoredResultStatusSurfaceMismatch 或 B4 unknown | DuplicateMissingResult | 不选择 latest |
| expected kind 与实际 surface kind 不一致 | wrong-kind relation | StoredResultKindMismatch | DuplicateMissingResult | 不切 typed store |
| report bundle 仅有 counts/status，无 required refs | corrupt/incomplete payload | Maintenance*ShapeInvalid / InternalInvariantViolation | DuplicateMissingResult | 不从 counts 反推 item |

只有 B4 的 exact whole-group inspection 能把 StatusUnknown 后的 observation 分类为 complete committed、
fully absent 或 indeterminate。B3-4 不预先把任何 half-commit 归入这三类，也不允许实现者自行扫描或修复。

### 49. Fake / durable parity 与边界审计

| audit item | required | B3-4 result |
|---|---:|---|
| carrier adapter error variants | 4/4：NotFound、AlreadyExists、IntegrityViolation、Unavailable | 4/4，两类 adapter 均保持同名语义。 |
| each typed surface error variants | 5/5：NotFound、AlreadyExists、IntegrityViolation、Unavailable、WrongKind | 15/15 across Command/Consumer/Job。 |
| duplicate missing/wrong/invisible/corrupt branches | 4 类输入 × 3 surface kind + carrier 层 | complete；全部 fail closed，public mapper only DuplicateMissingResult。 |
| fresh staged-write failures | typed save、carrier create、completion stage、pre-commit relation | complete；不得 partial success。 |
| commit terminal distinction | NotCommitted / StatusUnknown | boundary fixed；exact inspection 仍由 B4。 |
| alternate store / latest scan / current truth rebuild | allowed count | 0。 |
| duplicate writes / identity allocation / clock / external calls | allowed count | 0/0/0/0。 |
| new public callable / DTO / stored kind / error detail | allowed count | 0/0/0/0。 |
| worker receipt / jobs accumulator as persistence source | allowed count | 0。 |

Durable adapter 和 deterministic fake 必须都经过同一 application validator，并对缺失、wrong-kind、
corrupt、不可用返回同一类别；fake 不得因为使用内存 map 而自动补 row、跳过 Version、把 stage
直接视为 committed，或把 Unavailable 伪造为成功。

### 50. B3-4 结论、blocker 与恢复点

| item | result |
|---|---|
| S7-02D-INT-03 | closed：stored carrier / three typed surface stores 的 missing、wrong-kind、invisible、corrupt、half-commit 和 adapter failure 已有 exact fail-closed/no-rerun disposition。 |
| S7-02D-INT-04 | open：fresh/duplicate/failure/commit-unknown whole-group algorithm 与 exact inspection 尚未定义。 |
| REF-001 | open，等待 S7-02D-B4 及后续 bounded index closure。 |
| new L1/L2 upstream blocker | 0。 |
| formal 03~07 | 继续 historical_reviewed_revalidation_pending，本批未修改。 |
| implementation | 继续 CB-SBX-01A blocked / wait_design；无代码、compile、test、run、evidence、验收或 commit 事实。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_task = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_sub_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3-1,S7-02D-B3-2,S7-02D-B3-3,S7-02D-B3-4
completed_internal_sub_batch = S7-02D-B3-4 missing/wrong-kind/invisible/corrupt no-rerun
current_internal_batch = none
next_internal_batch = S7-02D-B4 fresh/duplicate/failure/commit-unknown whole-group algorithm
next_allowed_action = wait_user_confirmation_before_s7_02d_b4
stored_result_kind = CommandResult|ConsumerReceipt|JobReport
job_report_payload = Maintenance|Reconciliation
carrier_error_variants = 4/4
typed_surface_error_variants = 15/15
duplicate_write = 0
duplicate_identity_allocation = 0
duplicate_external_call = 0
duplicate_clock_read = 0
new_application_error_detail = 0
new_l1_l2_blocker = 0
ref_blocker = open_wait_s7_02d_b4
S7-02D-INT-03 = closed
S7-02D-INT-04 = open
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Authoritative Overlay: `S7-02D-B4` completed, `S7-02D-B5` next

> 本节位于物理 EOF，是本文件对 `S7-02D-B4` 的唯一 current authority（2026-07-27）。前述 §§43~50 保留为
> B3-4 的设计轨迹；若其 fresh、failure、commit-unknown 或 inspection 叙述与本节冲突，以本节为准。
> 本节仍是 Step 7 中间产物，不是正式 `03-详细设计.md`，不表示代码、compile、test、run、evidence、验收或 commit
> 已发生。

### 51. B4 开工门禁、SOP 回答与术语边界

| 项 | current 结论 |
|---|---|
| consumed predecessor | B3-1 frozen surface schema；B3-2 exact carrier / typed-store port；B3-3 unified relation validator；B3-4 fail-closed/no-rerun matrix。 |
| closed gap | `S7-02D-INT-04`：fresh reservation winner/loser、existing classification、replayable completion、terminal failure、commit/rollback unknown 和 exact whole-group inspection。 |
| current level | L1；这些分支会决定是否执行业务、external side effect、重复 identity 或误报隔离状态。 |
| new public surface | 0；不增加 enum、DTO、trait、repository method、stored kind、error detail 或 recovery API。 |
| private conceptual carriers | 允许在 `application::idempotency` 内以 private plan / mode / disposition 表达算法；不可序列化、不可被 entry / infra / Step 8 引用。 |
| next batch | `S7-02D-B5` 只处理必要 bounded selector/index 与 parity；不回写 B4 的 whole-group 语义。 |
| implementation | `CB-SBX-01A blocked / wait_design`；不修改目标实现仓。 |
| commit | `no`。 |

本批对 SOP 问题的固定回答如下：

| SOP 问题 | B4 current 回答 |
|---|---|
| 谁拥有 fresh winner | 唯一 application reservation kernel；先由 `claim_idempotency_reservation` 原子取得 binding，再由 reservation-only UoW confirmed commit 授予一次 execution permission。 |
| loser 如何处理 | 只消费 repository 返回的 committed existing winner；未持久化 candidate 立即丢弃，不进入 outcome、audit、relay、stored surface 或 recovery key。 |
| duplicate 如何结束 | 同一 committed snapshot 读取 exact record、carrier 和 expected-kind surface，经 B3-3 validator 后机械 replay；不读 current truth、不读 current clock、不写。 |
| completion 谁负责 | 所属 application operation 的 finalization suffix；它只装配已验证 outcome，不执行 tool semantics、runtime loop、member lifecycle 或 external call。 |
| terminal failure 谁负责 | 同一 reservation kernel 的 failure finalizer；只有无法形成完整 replayable surface 时才使用 `save_idempotency_failure`。 |
| unknown 如何判定 | 冻结原 operation、identity、ref、Version、transaction 和 optional-member集合，使用现有 exact get 读取同一 committed snapshot；不新增 generic inspector。 |

B4 使用以下 application-local 概念，但不把它们写成新的 public API：

```text
FrozenGroupPlan         = commit 前冻结的 exact create/update/read targets 与 expected before/after relation
ExistingClassification = requested binding 对 committed record 的有限分类
WholeGroupObservation  = FullyCommitted | FullyAbsent | Indeterminate
RecoveryDisposition    = 当前调用的 conservative application mapping 与后续 owner
```

`WholeGroupObservation` 只是本文件的 private conceptual carrier。它不是 persisted status，也不是对外 error。尤其
`FullyAbsent` 表示一次 exact inspection 证明目标 group 在该 snapshot 中没有形成提交；它不等同于某次 rollback API 返回
`Ok(())`，也不证明 external side effect 没有发生。

### 52. Fresh reservation winner / loser 完整算法

#### 52.1 进入条件与 preflight

所有 29 个 non-Query fresh callable 必须经同一 reservation kernel；Query 仍为 `0/13`。kernel 的输入只来自已检查的
`SandboxServiceCallContext` 与 operation-specific typed input，且顺序固定为：

```text
checked context
  -> requires_idempotency() == true
  -> SandboxIdempotencyIdentity::try_from_context
  -> SandboxIdempotencyBindingKey::from_identity
  -> open committed read snapshot
  -> find_idempotency_by_binding(binding)
```

preflight 的 exact 处置：

| lookup | 后续 | identity / side effect |
|---|---|---|
| `Absent` | 关闭 read snapshot，进入 atomic claim；`Absent` 不授予 execution permission。 | 此前 candidate allocation 为 `0`；不读 clock。 |
| `Existing(bundle)` 且 binding / identity relation 无效 | 返回 `InternalInvariantViolation` 或既有 integrity detail。 | 不读 current truth，不分配 candidate。 |
| `Existing` 且 digest 不同 | `IdempotencyConflict`。 | 不覆盖 winner，不创建第二 binding。 |
| `Existing` 且 digest 相同 | 进入 §53 exact status classification。 | 不分配 candidate，不调用 external port。 |
| snapshot / lookup unavailable | `PortUnavailable`。 | 不把 unavailable 伪装成 `Absent`。 |

preflight 读到的 `Existing` 必须来自一个 committed snapshot；若需要继续 duplicate replay，application 重新打开一个
单独的 committed snapshot并在该 snapshot内读取完整 replay group。不能把 preflight 的 record 与另一次 snapshot 的
carrier / surface 拼成一个“成功”结果。

#### 52.2 Atomic claim 与 reservation-only commit

只有 preflight 为 `Absent` 时才允许执行以下算法：

```text
read one trusted reserved_at
  -> allocate exactly one idempotency_ref candidate
  -> SandboxIdempotencyReservationCandidate::try_new(...)
  -> begin write UoW
  -> claim_idempotency_reservation(candidate, uow)
```

`claim` 返回 `FreshReserved` 时，candidate record 只在当前 UoW stage；application 必须立刻执行 reservation-only
commit，且该 UoW 不得包含 business truth、stored surface、audit、relay、backend、process、network 或 cursor write。

```text
FreshReserved(candidate)
  -> commit(reservation_uow)
       Confirmed(receipt)
         -> create FreshReservationOwnership from candidate + receipt
         -> business read / identity allocation / external-await split may start
       NotCommitted(error)
         -> candidate is definitely absent
         -> discard candidate
         -> return conservative safe error; no same-stack retry
       StatusUnknown(unknown)
         -> freeze reservation-only FrozenGroupPlan
         -> inspect exact reservation group (§56~§57)
```

`Confirmed(receipt)` 是唯一允许进入 business operation 的分支。reservation ownership 必须保留原
`SandboxIdempotencyRecordRef`、persisted identity、binding、reservation generation、`reserved_at` 和 confirmed
transaction receipt；后续 finalization 必须重新 exact-read record 并取得当前 committed `Version`，不得把 candidate 的
临时对象或 reservation-only receipt 当作 completion Version。

`claim` 返回 `Existing(bundle)` 时，不论它是在 preflight 后的竞争窗口中返回，还是由 adapter 在同一 unique constraint
内直接返回，都必须：

1. 不把当前 candidate 当 winner；
2. 在 rollback 可合法执行时关闭 zero-stage UoW；
3. rollback 成功后丢弃 candidate；
4. 对 existing bundle 重新执行 §53 分类；
5. 仅在分类为 valid duplicate 时读取 typed surface；不得因为 claim loser 而执行一次业务。

#### 52.3 Winner / loser identity 规则

| candidate 场景 | durable identity | allowed output |
|---|---|---|
| winner + reservation commit confirmed | candidate `idempotency_ref` 成为唯一 record identity；后续 stored/surface ref按B3顺序各生成一次。 | 允许开始一次 fresh flow。 |
| loser + `Existing` | existing winner 的 record / stored linkage；loser candidate 永不持久化。 | existing classification；不返回 loser ref。 |
| `NotCommitted` | candidate 已证明不可见，可丢弃。 | safe failure；显式新调用才可重新 preflight。 |
| claim / rollback / commit status unknown | candidate 与 transaction ref必须冻结到 inspection结束。 | safe hold 或 inspection结果映射；不得换第二 candidate。 |
| candidate collision / malformed relation | 不尝试分配第二 candidate。 | `InternalInvariantViolation` 或 typed identity error。 |

这里的“zero second identity”包括 durable ref、surface ref、truth ref、cursor、audit / relay ref、run attempt 和
external correlation。只有一个尚未持久化且最终丢弃的 race candidate 可在 claim 前短暂存在；它不能出现在任何可观察结果中。

### 53. Existing record 分类与 duplicate exact replay

#### 53.1 有限 classification

`Existing` 只在当前 checked binding 与 exact identity 已逐字段相等后分类；不比较 channel、actor、trace、current time、
current truth 或 external state：

| persisted record | 必须附加证明 | application observation | 禁止 |
|---|---|---|---|
| `Reserved` | record identity / binding / time shape valid | `IdempotencyInFlight` | 接管 reservation、二次 external call、把等待变成成功。 |
| `Completed` | `stored_result_ref` exactly-one且非空 | 进入 duplicate exact read | 直接把 Completed 当 replay success。 |
| `Failed` | stored linkage必须为 `None`，`terminal_at >= reserved_at` | `IdempotencyFailedTerminal` | same key转回 Reserved、自动重跑、写 placeholder。 |
| binding digest 不等 | binding cardinality exactly-one | `IdempotencyConflict` | 覆盖 digest、按 channel 分叉。 |
| binding 多于一个或 row relation 不可解释 | same snapshot cardinality / checked bundle失败 | `InternalInvariantViolation` 或 reconciliation hold | latest winner、任取一行、删除“多余”记录。 |

`Completed` 但 linkage 缺失、carrier/surface 不可见、kind/status/ref/time 不一致时，classification 不得降级为
`Reserved` 或 `Failed`。duplicate public mapping 固定为 `DuplicateMissingResult`；内部可保留更窄的
`StoredResultLinkMissing`、`StoredResultUnavailable`、`StoredResultKindMismatch` 或 `InternalInvariantViolation` 供
日志与 recovery owner 使用。

#### 53.2 Duplicate exact read 算法

```text
classify Existing as Completed
  -> open one committed read snapshot
  -> get_idempotency_by_ref(exact record ref, snapshot)
  -> recheck binding + exact identity + Completed + stored_result_ref
  -> get_stored_operation_result_with_version(exact stored_result_ref, snapshot)
  -> check expected operation and expected kind
  -> call exactly one expected typed surface get(surface_ref, stored_ref, operation, snapshot)
  -> wrap Command | Consumer | Job surface
  -> validate_stored_surface_relation(... Duplicate ...)
  -> close snapshot
  -> mechanical duplicate overlay at entry/application boundary
```

该路径允许读取 persisted original trace、source event、truth refs、side-effect refs、job selection、item chain、finding、
audit 和 optional relay relation，但只能在同一 committed snapshot中读取；它不读取当前 truth来补字段。关闭 snapshot
失败不把结果改成 fresh，也不触发 retry；按既有 `PortUnavailable` / `InternalInvariantViolation` 保守映射。

duplicate 的 side-effect deny-set：

```text
idempotency save/create/transition       = 0
stored carrier/surface save/create      = 0
business truth read/write for rebuild   = 0
identity / cursor / clock allocation    = 0
external backend/process/network call   = 0
worker redelivery / job item execution  = 0
audit / relay / observability write     = 0
```

entry 只可以在内存中增加 `DuplicateReplayed` disposition；该字段不写入 frozen surface、carrier 或 record，也不覆盖
original status。任何 exact read / validator failure 都立即停止，不切换到其它 kind、不扫描 latest/all、不重跑。

### 54. Replayable completion 与 terminal failure finalizer

#### 54.1 Replayable completion finalizer

适用范围包括 original outcome 为 `Accepted`、`Rejected`、`Pending/NoChange`、`Degraded` 或已经拥有完整 replayable
`Failed` surface 的操作。finalizer 不拥有业务语义；它只接收所属 flow 已经验证的 `ValidatedReplayParts`（private
conceptual carrier），并执行以下 exact 顺序：

```text
confirmed FreshReservationOwnership
  -> begin finalization UoW
  -> exact get idempotency record + current Version
  -> require Reserved + exact identity/binding
  -> read one trusted finalization timestamp
  -> stage operation-owned truth/side-effect/audit/relay/marker members required by flow
  -> build operation-specific typed surface draft/payload
  -> save expected typed surface in same UoW
  -> construct SandboxStoredOperationResult from returned surface ref/status/time
  -> validate_stored_surface_relation(... Fresh ...)
  -> create_stored_operation_result(carrier, same UoW)
  -> record.mark_completed(&carrier, terminal_at)
  -> save_idempotency_completion(record, exact current Version, same UoW)
  -> commit(finalization_uow)
```

约束：

1. surface、carrier、record completion 和 required operation group 必须在同一 allowed UoW group中；stage success不等于
   committed。
2. `recorded_at == terminal_at`；JobReport 还必须满足 `started_at <= finished_at == recorded_at == terminal_at`。
3. typed store 生成 `surface_ref`，reservation kernel提供 `stored_result_ref`；finalizer不得派生或替换任一 identity。
4. `commit(Confirmed)` 后才允许把原始 outcome materialize 为 fresh service result；`DuplicateReplayed`永不进入 frozen
   status。
5. `NotCommitted`、`StatusUnknown` 和 rollback failure 均按 §55 处理；不得以内存 candidate 返回 success。

如果 finalization 前已经有 external side effect，finalizer只能消费其已提交 recovery point与 typed observation；它不能
在持有 UoW期间调用 external port。若 finalization group包含 optional audit/relay member，是否纳入由原 flow 在冻结
`FrozenGroupPlan`前决定；未选中的 optional member不能在 inspection时临时加入。

#### 54.2 Terminal failure without replay surface

当 operation 已持有 confirmed reservation，但只有 raw adapter cause、未完成的 outcome、禁止保存的 body 或不完整 surface，
不得制造 placeholder `Failed` surface。应用必须走以下 terminal failure finalizer：

```text
confirmed FreshReservationOwnership
  -> begin failure UoW
  -> exact get idempotency record + current Version
  -> require Reserved + exact identity/binding + stored_result_ref == None
  -> read one trusted terminal_at
  -> record.mark_failed(terminal_at)
  -> stage required safety audit / recovery marker group
  -> save_idempotency_failure(record, exact current Version, same UoW)
  -> commit(failure_uow)
```

failure finalizer的硬约束：

| 条件 | required | forbidden |
|---|---|---|
| lifecycle | 只允许 `Reserved -> Failed` | `Completed/Failed -> Failed`、接管其它 reservation。 |
| linkage | `stored_result_ref == None` | 写 candidate ref、partial carrier、placeholder surface。 |
| time | `reserved_at <= terminal_at` | local default、current time多次读取、把 adapter time当 trusted time。 |
| side effect | 不调用业务/external port；只保存必要 safety marker/audit | 用 failure finalizer重跑原 operation或修复业务truth。 |
| public result | confirmed commit后可返回既有 failed/rejected policy | 把 terminal failed伪装成 replayable success。 |

后续同一 exact identity 命中 `Failed` 时始终返回 `IdempotencyFailedTerminal`；不得因当前 provider 已恢复而自动再执行。
如果 operation 已形成完整的 typed `Failed` surface，则不得使用本 finalizer，而必须走 §54.1 的 replayable completion 路径，
使 record 为 `Completed` 且 stored status 为 `Failed`。

### 55. UoW 终结结果与 rollback unknown 区分

#### 55.1 `NotCommitted`、`StatusUnknown` 与 rollback 的不可互换语义

| UoW result | 已证明事实 | application 必须做 | 禁止 |
|---|---|---|---|
| `Confirmed(receipt)` | 完整 staged group 已 durable commit，receipt relation匹配原 UoW | reservation-only可授予 ownership；finalization可返回 fresh result；failure可返回terminal policy | commit后补成员、换ref、重读clock。 |
| `NotCommitted(VersionConflict)` | 本次 transaction 的 staged delta 全部不可见 | 映射 `VersionConflict`；丢弃旧 decision / Version | 用旧candidate重试save、重复external side effect。 |
| `NotCommitted(StoreUnavailable)` | staged delta 全部不可见 | 映射 `PortUnavailable`；由显式新调用或 recovery owner决定后续 | 当前栈帧 silent retry。 |
| `NotCommitted(IntegrityRejected)` | staged delta 全部不可见且group未通过constraint | 映射 `InternalInvariantViolation` | 放宽validator、拆组提交。 |
| `StatusUnknown` | 不能证明 commit 或 no-commit | 丢弃内存success，冻结完整 plan，执行 §56 inspection | 返回success、假定rollback、第二 identity。 |
| rollback `Ok(())` | commit尚未开始，已stage delta明确不可见 | 返回导致rollback的原 typed error | 把rollback success当业务success。 |
| rollback `Failed | StatusUnknown` | 不能证明 staged delta不可见 | 冻结实际 staged-member set并执行 §56 inspection | 继续stage、再次commit、宣称absent。 |

`NotCommitted` 不进入 whole-group inspection，因为 adapter 已经证明本次 delta 为零；但 finalization / failure 的
business或external前序事实可能已经在更早的 recovery point提交，因此“本次 delta为零”绝不授权重跑业务。application
只能返回上表错误，并把原 reservation、business identity和external correlation保留给 operation-specific recovery。

`StatusUnknown` 必须保留 `SandboxCommitUnknown.transaction_ref`；transaction ref只做本次诊断关联，不是 repository key。
inspection仍使用预冻结的 typed refs读取 durable truth，不能按 transaction ref扫描数据库。

rollback unknown 与 commit unknown 的差别是：rollback发生在 commit尚未合法开始的错误路径，完整 success group可能从未
stage。因此 rollback inspection 即使观察到已stage candidate，也不能形成 fresh success；它只能证明“attempt delta fully
absent”或暴露 partial/ambiguous visibility。只有完整、commit-eligible plan 的 `StatusUnknown` 才可能通过
`FullyCommitted`恢复原结果。

#### 55.2 Stage failure 与 rollback discipline

typed surface save、carrier create、business member stage、completion/failure CAS任一步在 `commit` 前失败时，application必须：

1. 冻结 full expected group 与当时 actual staged-member set；
2. 不再stage后续成员，不调用 clock / allocator / external port；
3. 调用一次 rollback并消费 UoW；
4. rollback confirmed时返回原 typed error；
5. rollback failed/unknown时进入 inspection，且 `commit_eligible = false`；
6. inspection看到任何 candidate delta可见或 concurrent mixed state时都为 `Indeterminate`，不得返回 success。

claim loser 的 `Existing` 分支按 contract 不stage candidate。若关闭其 zero-stage UoW时 rollback失败，application仍不得
泄漏 loser candidate；只有 exact inspection同时证明 candidate ref不存在、binding仍唯一指向existing winner且snapshot
完整时，才能保留 existing classification，但当前调用仍返回 conservative internal/port error，不返回duplicate success。

### 56. Frozen whole-group inspection plan

#### 56.1 Plan 必须冻结的 exact 成员

`FrozenGroupPlan` 必须在调用 commit 或 rollback 之前形成。它是 private application-local value，不持久化、不进入 DTO，
至少冻结下列信息：

| plan member | exact content | why required |
|---|---|---|
| mode | `ReservationOnly | ReplayableCompletion | TerminalFailure | RollbackAfterStageFailure` | 决定 after/before relation和是否允许 `FullyCommitted`。 |
| operation identity | operation、idempotency identity、binding、record ref、reserved_at | 禁止按route/topic/current context猜测。 |
| transaction correlation | original transaction ref；`commit_eligible` bool | 只做诊断和成功资格判断，不用于store scan。 |
| idempotency before/after | before bundle + Version或binding absent proof；expected Reserved/Completed/Failed record | 判断attempt delta，而非只看status。 |
| stored relation | expected stored ref、kind、surface ref、carrier、typed surface candidate；failure/reservation模式明确为none | exact replay与linkage proof。 |
| mutable targets | 每个 exact key、original object + Version、candidate object | 复用 `7R-02B` per-target matcher。 |
| immutable/append targets | exact fact/audit/relay/marker ref、candidate payload和required cardinality | 不按cursor/count推测提交。 |
| cursor relation | 本 UoW已冻结的truth/reference cursor及拥有它的exact rows | bare cursor不单独证明commit。 |
| optional member set | commit前已选择的完整 optional member集合 | inspection不得临时加入或忽略成员。 |
| actual staged set | rollback路径中真正stage成功的成员集合 | partial visibility不能冒充完整group。 |

plan 不保存 raw request / response / stdout / stderr / filesystem body、provider cause、SQL/path或 transport envelope。若某个
operation的 existing Step 7 port无法按 exact ref读取一个 required group member，则该 operation不能把 commit unknown 设计为
可恢复成功；结果固定 `Indeterminate`，并由后续 owner补读面，不得本批新增 generic inspector。

#### 56.2 Inspection 执行纪律

所有 inspection 使用同一算法：

```text
receive frozen plan
  -> open one SandboxCommittedReadSnapshot
  -> allocate no identity / cursor; read no clock; call no external port
  -> find exact binding and get exact idempotency ref
  -> read every frozen mutable target by its named get_*_with_version
  -> read every frozen immutable/audit/relay/marker target by exact existing get
  -> if replayable completion, get exact carrier and exactly one expected typed surface
  -> validate per-target before/after shape and B3-3 stored relation
  -> close snapshot
  -> classify only after successful close
```

inspection 不使用 write UoW、不stage repair、不执行 `save_*`、不重新claim，也不调用 bounded maintenance index。snapshot
open/read/close任一步 unavailable、integrity failure或无法证明同一 generation，结果直接为 `Indeterminate`。一个 member
失败后实现可以继续读取其余 exact member用于内部诊断，但最终结果不能从 `Indeterminate`升级；不得用后续成功覆盖失败。

#### 56.3 Per-member after / before 判定

| target class | after match | before / absent match | 其它 |
|---|---|---|---|
| create target | exact key存在且对象逐字段等于 frozen candidate；typed key/object relation有效 | exact `NotFound` | same key不同对象、wrong kind、unavailable或corrupt为 `Indeterminate`。 |
| update target | current object逐字段等于 candidate，且current Version不等于 frozen original Version | object等于original且Version等于original Version | NotFound、只匹配object或Version、已继续推进、回退或并发覆盖为 `Indeterminate`。 |
| append/immutable target | exact ref存在且payload、lineage、cursor/cardinality等于candidate | exact ref不存在且owner relation也不存在 | duplicate/multiple/ref-only/payload mismatch为 `Indeterminate`。 |
| idempotency binding | 唯一 binding指向expected after record | 对ReservationOnly为binding absent；其它模式为binding仍指向exact before Reserved record | 多winner、wrong ref/digest/status/time为 `Indeterminate`。 |
| carrier + typed surface | carrier、expected-kind surface、record linkage和B3-3 validator全部通过 | completion模式二者均exact absent；其它模式按plan要求none | proper subset、wrong-kind、wrong-operation、mixed time/generation为 `Indeterminate`。 |

update matcher不能假定 `Version + 1`，也不能接受“candidate相同但Version又前进”为 committed proof；这可能代表另一次
合法/非法更新。create matcher不能把同key不同candidate解释为本次winner。所有 comparison 使用 checked value equality和
typed relation，不比较序列化文本、row count或latest timestamp。

### 57. 三类 unknown inspection 分支

#### 57.1 Reservation-only unknown

reservation-only plan 的 full group只有 unique binding + exact Reserved record；不得包含 business identity、stored ref、
surface、audit/relay或cursor。结果条件：

| observation | exact条件 | current call mapping | 后续 |
|---|---|---|---|
| `FullyCommitted` | binding唯一指向candidate ref；record为exact Reserved identity；stored linkage/terminal_at均none | 返回 `IdempotencyInFlight` / delayed-safe，当前栈帧不开始business body | reservation recovery owner保留该winner；后续同key调用仍不得接管。 |
| `FullyAbsent` | binding absent且candidate record ref exact NotFound | 返回 `InternalInvariantViolation`（原commit unknown已被保守终止） | 一个显式新调用可从preflight重新开始；当前调用不自动retry。 |
| `Indeterminate` | record/binding proper subset、different winner、terminal state、unavailable或corrupt | `InternalInvariantViolation` + consistency hold | manual/reconciliation owner；不删row、不换ref。 |

`FullyCommitted` 不转换为 fresh ownership，是因为原 commit已以 unknown结束且当前调用已经进入恢复边界；在 inspection后直接
执行业务会把恢复器变成第二条 execution入口。显式 operation recovery必须使用该 exact Reserved record和既有前置设计，
不能由 generic idempotency kernel猜测如何恢复外部 side effect。

#### 57.2 Replayable finalization unknown

finalization plan 必须是 `commit_eligible = true` 且冻结完整 operation group。结果条件：

| observation | exact条件 | current call mapping | 禁止 |
|---|---|---|---|
| `FullyCommitted` | 所有create/update/append member匹配after candidate；record为Completed；carrier/surface完整且validator通过 | 从 inspection snapshot取得的 frozen surface恢复 original fresh outcome；不加Duplicate overlay | 读取current truth重建、补成员、再次external call。 |
| `FullyAbsent` | 所有attempted create/append absent；所有update仍为before object+Version；record仍为exact Reserved | `InternalInvariantViolation` / operation-specific safe hold；不得success | 使用内存candidate重试commit、重跑business/external、分配新identity。 |
| `Indeterminate` | 任一member partial/mixed/concurrent/corrupt/unavailable，或snapshot close失败 | `InternalInvariantViolation` + quarantine/reconciliation | 选择多数成员、repair index、将proper subset提升为success。 |

`FullyCommitted` 恢复结果必须来自 exact persisted carrier/surface；即使当前进程仍持有原 `ValidatedReplayParts`，也不能用
内存值替代 durable read。`FullyAbsent` 只证明本次 finalization delta未提交，不证明更早 external side effect未发生；后续
只能由 operation-specific recovery point检查同一 correlation，不得重新调用 provider。

#### 57.3 Terminal failure unknown

failure plan 不包含 stored carrier/surface，且 expected after record只能是 `Failed`：

| observation | exact条件 | current call mapping | 禁止 |
|---|---|---|---|
| `FullyCommitted` | record exact Failed、terminal time合法、linkage none、required safety marker/audit均匹配 | 返回原 safe failure disposition；后续same key为`IdempotencyFailedTerminal` | 创建failed surface、把Failed改Completed。 |
| `FullyAbsent` | record仍为exact before Reserved；failure marker/audit delta均absent | `InternalInvariantViolation` / safety hold | 重新执行业务、宣称terminal failure已记录。 |
| `Indeterminate` | Failed record与marker proper subset、wrong time/linkage、并发终结、unavailable/corrupt | `InternalInvariantViolation` + consistency hold | 补marker、回滚Failed、删除partial relation。 |

若同一 Reserved record在 failure unknown期间被另一合法 owner推进为 Completed，inspection不能把它解释为本次 failure
`FullyCommitted`；这是 concurrent terminal winner，当前 plan结果为 `Indeterminate`，随后只可通过普通 existing exact
classification读取其完整 completed surface。

### 58. Whole-group result 的 conservative application mapping

#### 58.1 Phase-result matrix

| phase | `FullyCommitted` | `FullyAbsent` | `Indeterminate` |
|---|---|---|---|
| reservation-only commit unknown | `IdempotencyInFlight`；不开始业务 | `InternalInvariantViolation`；显式新调用才可preflight | `InternalInvariantViolation` + hold |
| replayable finalization commit unknown | exact persisted original outcome | `InternalInvariantViolation` + operation recovery | `InternalInvariantViolation` + quarantine/reconciliation |
| terminal failure commit unknown | original safe failure disposition | `InternalInvariantViolation` + safety recovery | `InternalInvariantViolation` + consistency hold |
| rollback failed/unknown | 不允许形成success；若全部仍为before则返回原 stage error | 返回原 stage error | `InternalInvariantViolation` |

`FullyAbsent` 在本表中表示 attempted transaction delta fully absent。对于 finalization / failure，pre-existing Reserved record
仍然存在且必须匹配 before state；不能因为record存在就把结果判成 partial。反之，reservation-only plan 的 before state是
binding/record absent，因此 record存在只可能是 committed或indeterminate。

#### 58.2 Existing/public error mapping 保持不变

| internal condition | existing canonical application detail / result | public / entry outcome |
|---|---|---|
| same binding + different digest | `IdempotencyConflict` | public `IdempotencyConflict`；不重试覆盖。 |
| exact identity still Reserved | `IdempotencyInFlight` | existing `VersionConflict` / delayed-safe mapping；entry不接管。 |
| exact identity terminal Failed | `IdempotencyFailedTerminal` | existing conflict/non-retryable mapping；要求新key或formal recovery。 |
| Completed linkage/surface missing/wrong/corrupt | `StoredResultLinkMissing` / `StoredResultUnavailable` / narrower integrity detail | public `DuplicateMissingResult`；永不recompute。 |
| read/store unavailable before a definitive missing observation | `PortUnavailable` | `AdapterUnavailable` / channel-specific delayed-safe；不伪装duplicate missing。 |
| unknown或mixed group | `InternalInvariantViolation` | `Internal` / failed-safe；不暴露raw store细节。 |

本批不新增 public `CommitUnknown`、`RecoveryRequired` 或 `Indeterminate` category。Step 8只能机械映射既有 application/public
surface；operator告警、审计查询和人工恢复流程按L2/L3留给后续，不进入 idempotency 主体 callable。

### 59. Fake / durable parity 与 no-second-identity audit

| parity dimension | durable adapter obligation | deterministic fake obligation |
|---|---|---|
| unique claim | store constraint一次产生winner；Existing稳定可分类 | transaction-local unique binding；不能让两个caller都FreshReserved |
| staged visibility | commit前仅本UoW可见 | stage写入transaction-local map，不直接改共享state |
| commit terminal result | 精确区分Confirmed / NotCommitted / StatusUnknown | 三类可独立注入；不得把unknown自动解析为confirmed |
| rollback | success证明delta不可见；failed/unknown不证明absent | 可注入failed/unknown并保留可检查的before/partial scenario |
| snapshot | 全部exact reads来自同一 committed generation | open时冻结snapshot；后续fake mutation不改变已打开视图 |
| Version | update读取同snapshot Version；不假定数值递增 | 独立opaque generation；不能用整数+1 shortcut影响判定 |
| carrier/surface | exact ref/kind/status/time与完整payload | 不自动补surface、carrier、audit或optional member |
| inspection | read-only、zero allocator/clock/write/external | 相同deny-set；不得因内存可见而修复partial group |

静态设计审计结果：

| audit item | expected | B4 result |
|---|---:|---:|
| fresh callable经唯一 reservation kernel | 29 | `29/29`；Command 10、Consumer 9、Job 10。 |
| Query idempotency/write participation | 0/13 | `0/13`。 |
| existing persisted classification | conflict / in-flight / completed / failed | `4/4` finite，observation不持久化。 |
| finalizer family | replayable completion / terminal failure | `2/2` exact UoW、Version、time与linkage。 |
| unknown inspection mode | reservation / completion / failure | `3/3`；rollback另有non-success约束。 |
| inspection result | FullyCommitted / FullyAbsent / Indeterminate | `3/3` private conceptual result。 |
| inspection writes / identity / cursor / clock / external | allowed count | `0/0/0/0/0`。 |
| duplicate writes / identity / clock / external | allowed count | `0/0/0/0`。 |
| second durable identity after unknown | allowed count | `0`。 |
| business or external rerun after duplicate/unknown | allowed count | `0`。 |
| public callable / DTO / repository method / stored kind / error detail added | allowed count | `0/0/0/0/0`。 |
| fake-only repair / auto-success | allowed count | `0`。 |

上述是设计静态审计，不是测试执行结果。后续 `7R-05` 必须把这些 parity obligation落为 fake/durable contract tests；当前
没有生成 case、run_id、evidence alias或通过结论。

### 60. B4 结论、blocker 与恢复点

| item | current result |
|---|---|
| `S7-02D-B3` | completed：B3-1~B3-4 已固定三类 frozen surface、exact store、统一 validator和 no-rerun matrix。 |
| `S7-02D-B4` | completed：winner/loser、existing、completion、failure、UoW terminal distinction与三类 exact inspection闭合。 |
| `S7-02D-INT-04` | closed。 |
| `S7-02D-INT-05` | open，唯一剩余内容为 B5 necessary bounded selector/index。 |
| `REF-001` | open，等待 B5 bounded index join与B6总closure；本批不提前关闭。 |
| new L1/L2 upstream blocker | `0`。 |
| formal `03~07` | 未修改，继续 `historical_reviewed_revalidation_pending`。 |
| implementation | `CB-SBX-01A blocked / wait_design`；无实现、compile、test、run、evidence或验收事实。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_task = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4
completed_internal_batch = S7-02D-B4 fresh/duplicate/failure/commit-unknown whole-group algorithm
current_internal_batch = none
next_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_allowed_action = wait_user_confirmation_before_s7_02d_b5
whole_group_modes = ReservationOnly|ReplayableCompletion|TerminalFailure
whole_group_results = FullyCommitted|FullyAbsent|Indeterminate
not_committed_is_status_unknown = no
rollback_unknown_is_absent = no
inspection_write = 0
inspection_identity_allocation = 0
inspection_clock_read = 0
inspection_external_call = 0
duplicate_write = 0
duplicate_business_rerun = 0
second_durable_identity = 0
new_public_callable = 0
new_repository_method = 0
new_application_error_detail = 0
new_l1_l2_blocker = 0
ref_blocker = open_wait_s7_02d_b5_b6
S7-02D-INT-03 = closed
S7-02D-INT-04 = closed
S7-02D-INT-05 = open
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Authoritative Overlay: `S7-02D-B5` necessary bounded selector/index closed

> 本节位于本文物理 EOF，是 `S7-02D-B5` 的唯一 current authority（2026-07-27）。本节显式采纳前部
> `Historical-Position Foundation: S7-02D-B5 corrected selector/index draft` 的 §§61~63，但作以下 current 限定：
> common page必须使用sealed `SandboxSelectionTarget`；cursor read可重复且snapshot-bound；lease basis为
> `CommittedMarker | WindowCutoff`；projection/derived first branch使用typed proof而非bool；capability report target使用
> backend source + requirement ref复合identity；PageToken codec只保留encode。中段D61~D63继续
> non-authoritative。本节仍是Step 7中间产物，不是正式文档或实现事实。

### 64. One read-only trait, nine exact reader methods

九个reader由 `application::repositories` 中一个read-only trait拥有。合并在一个trait只是装配便利，不允许generic
`read_page(kind, selector)`、string dispatch、trait-object payload downcast或返回共同opaque target。

```rust
pub trait SandboxMaintenanceSelectionRepository: Send + Sync {
    async fn read_event_relay_page(
        &self,
        selector: &PublishSandboxEventRelaySelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<SandboxEventRelayRecordRef>,
        SandboxSelectionReadError,
    >;

    async fn read_reference_refresh_page(
        &self,
        selector: &RefreshSandboxReferenceStatesSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<ReferenceRefreshTarget>,
        SandboxSelectionReadError,
    >;

    async fn read_backend_capability_refresh_page(
        &self,
        selector: &RefreshBackendCapabilitySummariesSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<BackendCapabilityRefreshTarget>,
        SandboxSelectionReadError,
    >;

    async fn read_material_handoff_retry_page(
        &self,
        selector: &RetryPendingMaterialHandoffsSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<PendingMaterialHandoffGroup>,
        SandboxSelectionReadError,
    >;

    async fn read_lease_reaper_page(
        &self,
        selector: &RunLeaseOrphanReaperSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<LeaseReaperTarget>,
        SandboxSelectionReadError,
    >;

    async fn read_cleanup_guard_maintenance_page(
        &self,
        selector: &EvaluatePendingCleanupGuardsSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<CleanupGuardRef>,
        SandboxSelectionReadError,
    >;

    async fn read_redline_handoff_maintenance_page(
        &self,
        selector: &MaintainRedlineContainmentHandoffsSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<RedlineContainmentRef>,
        SandboxSelectionReadError,
    >;

    async fn read_projection_maintenance_page(
        &self,
        selector: &RebuildSandboxReadProjectionsSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<ProjectionMaintenanceTarget>,
        SandboxSelectionReadError,
    >;

    async fn read_derived_maintenance_page(
        &self,
        selector: &MaintainDerivedInspectPreviewTrendSelection,
        request: &SandboxSelectionPageRequest,
    ) -> Result<
        SandboxSelectionPage<DerivedMaintenanceTarget>,
        SandboxSelectionReadError,
    >;
}
```

所有method均只读取committed selection index，不接受`SandboxUnitOfWork`或`SandboxCommittedReadSnapshot`参数；首页由
adapter打开并绑定immutable selection generation，续页由cursor恢复同一generation。它们不返回mutable object、
`Versioned<T>`、repository row、status view、SQL cursor或raw page token。owner object与Version必须由facade随后通过
既有named exact repository method重新读取。

### 65. Stable order, candidate allow-set, terminal deny-set and reload recheck

#### 65.1 Per-reader executable matrix

| reader | stable index/order key | candidate allow-set at frozen snapshot | terminal / unsafe deny-set | exact reload and recheck before action |
|---|---|---|---|---|
| event relay | `(context_ref, relay_record_ref)` | `Pending`; `Retryable`且无active attempt、retry-not-before在cutoff前 | `Published / DeadLetter / Failed`; any active attempt; malformed payload/source/binding | exact relay + payload pair + attempt relation + `Version`; call `evaluate_attempt_eligibility(cutoff)`; selection hit never starts publish by itself |
| reference refresh | `(context_ref, reference_state_ref)` | loaded-index status snapshot为`Stale / Unresolved / Unavailable`且filter允许 | `Resolved / Invalid`; wrong/multiple source binding; missing tracked state | exact state + `Version`; require `reference_state_ref` and full `ExternalSourceRef` equal target; call `requires_refresh()`; resolver consumes carried source directly |
| backend capability | `(context_ref, backend_kind, backend_resource_ref, requirement_ref)` | current summary absent under registered target, or `Fresh`已到cutoff、`Stale / Unknown` | same-generation `Unsupported`; wrong backend kind; duplicate current binding; absent target registry | exact requirement/backend/current binding and optional summary; recompute checked age against frozen cutoff; call `requires_refresh_at_age`; first/replacement expectation rechecked in write UoW |
| material handoff retry | `(context_ref, handoff_ref)`; group targets内按`(target_kind, source_kind, resource_ref)` | aggregate含selected `Pending`, or `Retryable` target ready at cutoff | all selected `Delivered / Failed`; any selected `Attempting`; `BlockedByCleanupGuard`; plan/progress mismatch | exact handoff + `Version`, complete plan/progress/material owners and active attempts; re-evaluate each selected target; external call only after matching attempt commit |
| lease reaper | `(context_ref, lease_ref)` | marker basis committed; or physical cutoff saysActive/Expiring可能到renewal-close/expiry | `Released`; wrong lineage; duplicate incident; window/index mismatch; marker conflict | exact lease + `Version`, handle/context/identity/boundary/generation and incident relation; compute fresh checked elapsed using current safety clock, call `position_at_elapsed`; marker may be created only by domain transition; never releases |
| cleanup guard | `(context_ref, cleanup_guard_ref)` | `PendingEvidence / PendingInvestigation / Allowed`; plus`Blocked` only if selector saysinclude | `Completed`; missing evidence/redline coverage; active release basis relation that forbids this maintenance branch | exact guard + `Version`, full evidence/investigation/orphan/redline ordered coverage and basis; strict guard re-evaluates; `Allowed` remains permission truth, not release/completion |
| redline handoff | `(context_ref, redline_ref)` | `Contained / HandoffPending`; `Detected` may be selected only for safe skip/diagnostic, never external handoff | `Released / Terminal`; missing containment proof; preservation/investigation mismatch | exact containment + `Version`, strict guard, lineage, preservation/current observation; external investigation only after durable matching preservation; no automatic release |
| projection maintenance | `(context_ref, projection_ref)` | every explicit registered target; existing target requires non-empty stale markers; first target requires registration proof | unregistered target; existing `Fresh` with no marker; `Rebuilding` with active mismatched attempt; registration/current index contradiction | exact existing projection + `Version` or same-UoW first absence; formal source reader returns complete/degraded snapshot with full redline coverage; no old-view source |
| derived maintenance | `(context_ref, derived_kind, derived_state_ref)` | registered first withmatching zero-success proof; existing `Stale / Failed / Unavailable` withmatching marker | `Fresh`; active `Rebuilding`; unsupported kind; source-set/proof/index mismatch | exact state + `Version` or same-UoW first absence, exact source set/materialization index; reuse marker/proof; builder cannot write core truth or createFailureClassification |

stable order只使用closed enum与typed identity，不使用`Timestamp`、physical expiry、status-change time、row offset或
repository `Version`。时间字段只参与candidate过滤与owner reload重验，不决定winner或continuation。任何不能按该tuple严格
排序、同identity重复、index row指向错误context或snapshot内half-commit的
情况都返回`IndexIntegrityViolation`，不得自行排序、选择latest或跳过。

#### 65.2 Selection candidate is not permission

每个item的共同执行纪律：

```text
index candidate
  -> exact owner reload from committed truth
  -> context/lineage/ref relation recheck
  -> current status + marker/attempt/version recheck
  -> domain eligibility/safety guard
  -> optional short pre-call UoW and confirmed recovery point
  -> at most one matching external call
  -> post-call exact reload and guarded transition
```

selection hit不得：创建identity、分配truth/reference cursor、stage write、调用external port、执行release、生成first absence、
改变status、补audit/relay、删除row或把item计为success。reload后不再eligible的正常race形成`Skipped`或既有typed conflict；
known index contradiction形成application integrity error。adapter/fake不能用selection-time status替代owner getter或domain method。

### 66. Index maintenance ownership and no private scan

本批只定义logical index relation，不新增write repository method。index entry必须由拥有相关truth/current binding的既有write
group在同一UoW原子维护，或者由immutable projection/derived target registry的正式owner维护；不能由selection reader、
Query、jobs runner或后台read-repair维护。

| index family | entry identity and copied fields | write/link owner | removal / stale rule |
|---|---|---|---|
| relay eligibility | relay ref、context、status、active-attempt presence、retry fence | relay append / attempt observation same UoW | terminal remains addressable for exact reads but is absent from eligible snapshot |
| reference refresh | state ref、context、full expected external source、canonical status | reference state create/save same UoW | source replacement atomically replaces copied observation;Invalid/Resolved leave eligible set |
| capability target/current | backend source identity、requirement、optional current summary/binding、status/freshness inputs | formal target registry + capability current-binding writer | historical summary never becomes current candidate;Unsupported excluded until generation/requirement key changes |
| handoff retry | handoff ref、context、selected target keys、progress/attempt fences | handoff fact save same UoW | delivered/failed target removed;attempting remains fenced, never selected as new attempt |
| lease reaper | lease ref/context/window physical values/optional marker | lease open/transition same UoW;physical cutoff derivable and rehydratable | Released excluded;window/marker mismatch quarantined;no reader-created marker |
| cleanup maintenance | guard ref/context/status/change fence | cleanup guard create/save same UoW | Completed excluded;Allowed remains candidate only for re-evaluation, not release |
| redline handoff | redline ref/context/status/change fence/preservation presence | redline save same UoW | Released/Terminal excluded;Detected is safe-skip only until owner creates containment proof |
| projection registry | projection ref/context/registration proof/stale marker set | formal target registry + projection create/save same UoW | unregistered target cannot be inferred fromcontext;Fresh/no-marker excluded unless explicitly selected and then safely skipped |
| derived registry | state ref/context/kind/source set/zero-success or rebuild marker | formal derived target/materialization writer same UoW | successful first atomically removes zero-success position;Fresh/Rebuilding excluded |

“同一UoW维护”是logical atomicity要求，不规定table、column、DDL、database trigger或materialized-view产品。若durable adapter
不能把truth与eligibility relation原子暴露，必须返回unavailable/integrity并阻断activation，不能定期全表scan修补。fake也必须
通过相同named transition更新index projection，禁止从shared object map临时filter后声称parity。

### 67. Constructor/getter surface and stable identity mapping

#### 67.1 Nine selector constructors

九个selector的 exact constructor/getter surface固定如下；表中的`cutoff`均必须等于同一invocation的
`SandboxJobRunContext.started_at()`，不是public DTO字段或repository clock：

| selector | checked constructor | required getters |
|---|---|---|
| `PublishSandboxEventRelaySelection` | `try_new(context_ref, cutoff)` | `context_ref(); selection_cutoff()` |
| `RefreshSandboxReferenceStatesSelection` | `try_new(context_ref, source_kind_filter, cutoff)` | `context_ref(); source_kind_filter(); selection_cutoff()` |
| `RefreshBackendCapabilitySummariesSelection` | `try_new(context_ref, backend_filter, requirement_filter, cutoff)` | `context_ref(); backend_filter(); requirement_filter(); selection_cutoff()` |
| `RetryPendingMaterialHandoffsSelection` | `try_new(context_ref, target_kind_filter, cutoff)` | `context_ref(); target_kind_filter(); selection_cutoff()` |
| `RunLeaseOrphanReaperSelection` | `try_new(context_ref, cutoff)` | `context_ref(); selection_cutoff()` |
| `EvaluatePendingCleanupGuardsSelection` | `try_new(context_ref, include_blocked, cutoff)` | `context_ref(); include_blocked(); selection_cutoff()` |
| `MaintainRedlineContainmentHandoffsSelection` | `try_new(context_ref, cutoff)` | `context_ref(); selection_cutoff()` |
| `RebuildSandboxReadProjectionsSelection` | `try_new(context_ref, explicit_projection_refs)` | `context_ref(); explicit_projection_refs()` |
| `MaintainDerivedInspectPreviewTrendSelection` | `try_new(context_ref, supported_kinds)` | `context_ref(); supported_kinds()` |

每个`try_new`返回`ApplicationResult<Self>`并执行§63.1的non-empty、closed kind、strict order、duplicate和scope规则。
这些current selector取代 facade historical selection中保存全量target vector的字段；类型名不变，因此没有新增第十类selection
或同义alias。任何后续需要恢复registered projection scope的设计必须先增加typed scope carrier、scope expansion reader和Step 8
字段来源；当前`SandboxOpaqueRef`路径保持invalidated。

#### 67.2 New or strengthened target constructors

```rust
impl ReferenceRefreshTarget {
    pub fn try_new(
        reference_state_ref: ReferenceResolutionStateRef,
        expected_source: ExternalSourceRef,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn reference_state_ref(&self) -> &ReferenceResolutionStateRef;
    pub fn expected_source(&self) -> &ExternalSourceRef;
}

impl LeaseReaperTarget {
    pub fn try_new(
        lease_ref: LeaseRecordRef,
        selection_basis: LeaseReaperSelectionBasis,
    ) -> Result<Self, SandboxSelectionReadError>;
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    pub fn selection_basis(&self) -> &LeaseReaperSelectionBasis;
}

impl ProjectionTargetRegistrationProof {
    pub(crate) fn try_from_committed_registry(
        projection_ref: SandboxReadProjectionRef,
        context_ref: ControlledExecutionContextRef,
        source_audit_trace_ref: SandboxAuditTraceRef,
        registered_at: Timestamp,
    ) -> Result<Self, SandboxSelectionReadError>;
}

impl ProjectionMaintenanceTarget {
    pub(crate) fn try_registered_first(
        registration: ProjectionTargetRegistrationProof,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub(crate) fn try_existing(
        projection_ref: SandboxReadProjectionRef,
        context_ref: ControlledExecutionContextRef,
        stale_markers: SandboxProjectionStaleMarkerSet,
        source_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub fn projection_ref(&self) -> &SandboxReadProjectionRef;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn position(&self) -> &ProjectionMaintenancePosition;
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}

impl DerivedMaintenanceTarget {
    pub(crate) fn try_registered_first(
        derived_state_ref: DerivedInspectPreviewTrendStateRef,
        context_ref: ControlledExecutionContextRef,
        derived_kind: DerivedMaterialKind,
        source_refs: DerivedSourceRefSet,
        never_materialized: DerivedNeverMaterializedProof,
        source_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub(crate) fn try_existing(
        derived_state_ref: DerivedInspectPreviewTrendStateRef,
        context_ref: ControlledExecutionContextRef,
        derived_kind: DerivedMaterialKind,
        source_refs: DerivedSourceRefSet,
        rebuild_marker: DerivedRebuildMarker,
        source_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxSelectionReadError>;

    pub fn derived_state_ref(&self) -> &DerivedInspectPreviewTrendStateRef;
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn derived_kind(&self) -> DerivedMaterialKind;
    pub fn source_refs(&self) -> &DerivedSourceRefSet;
    pub fn position(&self) -> &DerivedMaintenancePosition;
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}
```

`LeaseReaperTarget::try_new`对`CommittedMarker`要求marker lease ref与target完全相等；对`WindowCutoff`要求duration正值、
renewal offset若存在则严格小于duration，但不执行timestamp arithmetic。adapter必须从已验证physical index复制window fields，
exact reload再与`LeaseWindow`逐字段相等。projection/derived constructor分别关闭context/ref/marker/proof/source/audit关系，
wrong relation统一为`IndexIntegrityViolation`，不选择另一row。

既有`BackendCapabilityRefreshTarget`和`PendingMaterialHandoffGroup`继续使用facade current constructor；B5只要求它们实现sealed
target identity。九类mapping固定为：

| target type | `stable_identity()` |
|---|---|
| `SandboxEventRelayRecordRef` | `EventRelay(ref)` |
| `ReferenceRefreshTarget` | `ReferenceState(reference_state_ref)` |
| `BackendCapabilityRefreshTarget` | `BackendCapability { backend_kind, backend_resource_ref, requirement_ref }`；报告映射为Step 6 current `SandboxMaintenanceTargetRef::BackendCapability { backend_ref, requirement_ref }` |
| `PendingMaterialHandoffGroup` | `MaterialHandoff(handoff_ref)` |
| `LeaseReaperTarget` | `Lease(lease_ref)` |
| `CleanupGuardRef` | `CleanupGuard(ref)` |
| `RedlineContainmentRef` | `Redline(ref)` |
| `ProjectionMaintenanceTarget` | `Projection(projection_ref)` |
| `DerivedMaintenanceTarget` | `Derived(derived_state_ref)` |

### 68. Terminal-safe retention and no-delete redlines

retention是L2 safety contract，不是本批主体存储实现。B5不提供`delete_*`、`purge_*`、`truncate_*`、TTL setter、cleanup
command或repository writer。未来物理清理只有在完整whole-group eligibility同时满足时才可设计：

| required proof before any future physical cleanup | fail-closed rule |
|---|---|
| owner已处于canonical terminal state，且不存在active attempt、Reserved idempotency、commit/rollback unknown或recovery hold | 任一非terminal/unknown relation存在则整组保留 |
| idempotency record、stored carrier、typed surface及其exact replay relation已超过正式retention且不再被支持的duplicate窗口引用 | 不能先删surface或carrier留下Completed record |
| cleanup/redline/lease/orphan/material/audit/relay/security evidence均满足各自更长的正式保留要求 | shorter maintenance index retention不能削弱security/audit retention |
| current binding、target registry、selection snapshot、cursor continuation和reconciliation relation不再引用该entry或owner | active cursor/snapshot存在时不得让后续页指向missing member |
| exact group cardinality完整且无half-commit、quarantine、integrity finding、legal/operator hold | malformed/partial group永不由retention自动“修好” |

eligible index row可以在owner transition后从未来selection snapshot中排除，但这不等于删除owner truth、historical row、audit、
stored result或既有snapshot成员。一个已打开的immutable selection snapshot必须在其正式continuation horizon内保持membership与
page bytes稳定；若基础材料按更高优先级规则不可继续读取，cursor返回`CursorSnapshotUnavailable`，不得用current index补页。

whole-group cleanup若未来进入Step 11/14，必须一次性列出group成员、cross-retention inequality、current/historical binding、
cursor snapshot和commit-unknown fence；本批不选择数值、scheduler、storage engine、DDL、tombstone shape或物理算法。

### 69. Fake/durable parity and negative inventory

#### 69.1 Required parity

| dimension | durable adapter | deterministic fake |
|---|---|---|
| selector validation | consume onlychecked nine selector schemas | run same constructors; no permissive fixture shortcut |
| snapshot opening | first page bindsone committed immutable generation | clone immutable index generation at first read |
| continuation | cursor restores samefamily/selector/limit/generation/last key | cursor codec validates the same logical payload |
| repeat read | same selector/cursor returnsbyte-equivalent logical page while retained | same page without consuming or mutating cursor state |
| stable order | exact §65 typed identity orderbefore page slicing | same comparator; no insertion/hash-map order |
| empty page | empty implies terminal andnext cursor absent | identical; unavailable never becomes empty |
| concurrent mutation | new commits do notenter already-open snapshot | post-open fake mutations invisible to that snapshot |
| integrity | duplicate/wrong relation/halfcommit fails whole page | no private map repair, sorting, dedup or row skipping |
| reference target | returns state ref plusfull expected external source | no state-ref-to-source private reverse map |
| lease target | marker/window basis copiedand later exact-reloaded | no direct current-clock filter that bypasses snapshot basis |
| first materialization | registration/zero-successproof supplied exactly | no `None`,NotFound,bool or empty-map proof |
| page token codec | only opaque encode for batch/report chain；repository cursor validation remains inside reader | fake也只编码reader已验证cursor；不存在public decode/restart shortcut |
| index maintenance | truth/current binding andindex relation atomically visible | transition updates cloned truth/index in one staged commit |
| retention | active snapshot/replay/securitylinks prevent deletion | fake cleanup cannot drop rows still referenced by cursor or stored result |

这些是后续`7R-05` contract-test obligations，不是当前测试结果。未运行fake或durable test，未生成case id、run_id、fixture、
evidence alias或pass/fail事实。

#### 69.2 Negative inventory

```text
generic maintenance read method                  = 0
string/topic/route dispatched reader             = 0
find_latest/list_all/full-table scan              = 0
offset pagination                                = 0
cursor derived from timestamp/version/truth cursor = 0
selection reader write/UoW/delete/repair          = 0
query consumption of maintenance index            = 0/13
reconciliation consumption of paged reader        = 0/1
public DTO/public callable/business status added   = 0/0/0
opaque ref or raw database key in target/cursor    = 0
generic external maintenance target                = 0
public initial page token / codec decode path       = 0/0
fake-only reverse map/default/filter/repair        = 0
retention TTL/DDL/delete API                       = 0/0/0
```

### 70. 42/29/13 join, B5 closure and next gate

| callable family | total | B5 maintenance reader use | idempotency/write relation |
|---|---:|---:|---|
| Command | 10 | `0/10` | fresh reservation保持`10/10`; B5不改callable或stored result |
| Query | 13 | `0/13` | idempotency、write UoW、identity/cursor allocation、external call保持`0/13` |
| Consumer | 9 | `0/9` | fresh reservation保持`9/9`; event owner exact reads不借maintenance index |
| paged Job | 9 | `9/9` exact reader，each method one-to-one | invocation fresh reservation`9/9`且只reserve一次，续页复用permit |
| reconciliation Job | 1 | `0/1`; complete explicit scope | fresh reservation`1/1`;专用atomic materialization/stored replay不变 |
| total | `42/42` | exactly `9` reader bindings | fresh non-Query reservation `29/29`; Query write `0/13` |

静态闭合审计：

| audit item | B5 result |
|---|---|
| selector schema | `9/9`; same existing type names，full-target vector语义为0 |
| exact read-only method | `9/9`; generic/opaque reader为0 |
| stable order / empty / continuation | `9/9`; typed identity、terminal empty、snapshot-bound cursor |
| candidate allow / terminal deny / reload recheck | `9/9`; index hit不授予action |
| reference dispatch key | state ref + full expected source；reverse lookup为0 |
| capability stable/report target | backend source identity + immutable requirement ref；generic external target为0 |
| lease pre-marker selection | closed marker/window basis；required-marker contradiction为0 |
| projection/derived first proof | bool为0；registration/zero-success proof + write-time absence recheck |
| retention | terminal whole-group redline；delete/purge/TTL/DDL为0 |
| parity | 14/14 dimensions有durable/fake同义义务；未声称执行 |
| callable join | `42/42`; fresh `29/29`; Query maintenance/write `0/13` |
| public continuation | invocation initial token与codec decode path均为0；batch/report encode chain保留 |
| new L1/L2 upstream blocker | `0` |

`S7-02D-INT-05`在本批关闭。`REF-001`仍保持open：B5已经补齐named refs/core `Version`后的necessary index join，
但只能由`S7-02D-B6`执行完整B1~B5 repository/facade/control差集审计后判定resolved，不提前关闭。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D
current_task = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
current_internal_batch = none
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
maintenance_selector = 9/9
maintenance_reader = 9/9
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
ref_blocker = open_wait_s7_02d_b6
new_l1_l2_blocker = 0
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Authority: `S7-02D-B6` closure complete, user review pending

> 本节位于本文物理 EOF，是 `S7-02D` 的唯一 current authority（2026-07-27）。它显式采纳本文 §§71~74，
> 并覆盖前置 B5 recovery block；前置章节继续保留推导轨迹，不再单独决定恢复点。

B6 只完成 closure、正式回填草稿和恢复源同步。它没有新增 application callable、repository method、stored kind、
selector、DTO、状态、外部 port、测试结果或实现事实。`REF-001` 的 Step 7 repository/consistency 子条件已关闭，但
`7R-03~07`仍需按各自 owner 完成，故 `S7-G02`、Step 8、正式 `03~07` 和 implementation 继续冻结。

| closure item | current result |
|---|---|
| internal design items | `S7-02D-INT-01~05 = 5/5 closed` |
| exact method sets | idempotency `5/5`; carrier `2/2`; typed surface `6/6`; maintenance reader `9/9` |
| stored / unknown sets | `Command/Consumer/Job = 3/3`; inspection modes/results `3/3 + 3/3` |
| callable and write join | application `42/42`; fresh reservation `29/29`; Query maintenance/write `0/13` |
| current identity path | named refs/core `Version` positive gap `0`; generic external target `0`; public decode/restart path `0` |
| bounded maintenance | selector `9/9`; reader `9/9`; parity obligation `14/14` (not executed) |
| upstream blocker | new L1/L2 upstream blocker `0`; `REF-001 = resolved_in_7r_02d` |
| runtime facts | code/compile/test/run/evidence/acceptance/commit `not_started` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_task = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
internal_items = 5/5_closed
idempotency_repository_method = 5/5
carrier_method = 2/2
typed_surface_method = 6/6
stored_surface_kind = 3/3
whole_group_mode = 3/3
whole_group_result = 3/3
maintenance_selector = 9/9
maintenance_reader = 9/9
parity_obligation = 14/14_not_executed
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
ref_blocker = resolved_in_7r_02d
remaining_step_7_internal_blockers = 4/6_open_with_owner
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Owner Activation: `7R-06C-1C-R` borrowed JobReport store write

> 本节是本文物理EOF的唯一current authority（2026-07-29）。它完整采纳本文
> `Historical-Position Foundation: 7R-06C-1C-R borrowed JobReport store write`的§§75~79；中段同批activation draft只保留
> 定位轨迹。它覆盖B3/B6中与fresh JobReport ownership冲突的owned write/return口径，不改变committed duplicate read、其余
> typed stores或B6 selector/index结论。

Current store contract固定为：

1. `SandboxJobReportWriteSource<'a>`是`Maintenance(borrowed source) | Reconciliation(&envelope)`两分闭集；不接受owned
   generic payload、JSON或Jobs accumulator。
2. `save_job_report_surface<'a>(&'a self, &'a source, &'a mut uow)`在future内逐batch/逐item完整stage，返回body-free
   `SandboxStagedJobReportSurface`，不返回或构造第二个完整owned surface。
3. staged receipt必须依次执行`validate_source`和`validate_carrier`；它不是commit evidence。generic carrier与idempotency
   completion仍须同一UoW提交，commit confirmed后application才可返回fresh completion witness。
4. `get_job_report_surface_with_version`继续返回完整owned `Versioned<SandboxStoredJobReportSurface>`。owned maintenance draft
   只由committed-read mapper调用`SandboxMaintenanceJobReportSurfaceDraft::try_rehydrate`构造。
5. durable/fake都必须保存完整selection/batch/item/token/reason/trace并在read侧同义rehydrate；fake不能只存body-free receipt。
6. typed store method总数仍为`6/6`，stored kind仍为`3/3`；没有新增public DTO、application callable或额外store method。

| closure | result |
|---|---:|
| fresh caller-owned complete chain | `1` |
| application/store second owned complete chain | `0` |
| fresh save full-data persistence | required |
| fresh save return | `SandboxStagedJobReportSurface` |
| committed read return | `Versioned<SandboxStoredJobReportSurface>` |
| owned maintenance constructor scope | committed rehydrate only |
| typed method count | `6/6` unchanged |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R typed store borrowed write activated
artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_reaudit_pending
current_authority = physical_eof_7r_06c_1c_r_borrowed_store_activation
typed_surface_method = 6/6
job_report_save_output = SandboxStagedJobReportSurface
job_report_committed_read_output = Versioned<SandboxStoredJobReportSurface>
fresh_owned_complete_batch_chain_in_application = 0
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = reaudit_worker_and_nine_paged_jobs_terminal_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Amendment: `7R-06C-1C-R` maintenance duplicate loader

> 本节取代上一C-1C-R store activation并成为本文物理EOF的唯一current authority。它补齐paged maintenance duplicate从
> idempotency record到完整typed replay carrier的exact loader；fresh borrowed write契约保持不变。

### 80. Exact duplicate loader

```rust
/// application内部按exact completed relation加载paged Maintenance JobReport。
///
/// 该helper不是SandboxJobService callable、repository trait method或entry API；九个paged facade在Start duplicate分支复用。
pub(crate) async fn load_duplicate_maintenance_job_report(
    expected_job_kind: SandboxJobKind,
    stored_result_ref: &SandboxStoredOperationResultRef,
    stores: &ReplayStores,
    read_manager: &dyn SandboxCommittedReadManager,
) -> ApplicationResult<SandboxReplayedMaintenanceJobReport>;
```

固定算法为：

```text
require expected_job_kind is one of nine paged maintenance kinds
  -> derive expected operation and kind=JobReport from closed mapping
  -> open one committed snapshot
  -> get exact generic carrier by stored_result_ref
  -> validate carrier state/kind/operation/ref relation
  -> get exact typed JobReport surface by
       (carrier.surface_ref, carrier.stored_result_ref, expected operation)
       in the same snapshot
  -> require payload variant=Maintenance and surface.job_kind=expected
  -> validate full selection/batch/item/token/status/time/carrier relation
  -> move owned surface + carrier into
       SandboxReplayedMaintenanceJobReport::try_from_loaded
  -> close snapshot
  -> return typed replay carrier
```

snapshot close失败时不返回replay success。`NotFound/WrongKind/IntegrityViolation/Unavailable`映射到既有
`DuplicateMissingResult`或integrity application error；不得切换到fresh、重跑selection、读取current truth或选择另一个typed
store。trusted clock、identity allocator、write UoW、external port和diagnostic/audit writer调用预算均为`0`。

`SandboxLoadedReplaySurface::Job(surface)`仍服务generic duplicate kernel，但paged Job facade必须穷尽提取Job variant并调用
上述typed constructor；historical `materialize_duplicate_entry_surface(...) -> SandboxServiceOutcome` 对paged Job失效。Command与
Consumer的现有operation-specific replay carrier由其C-1A/C-1B owner继续处理，不在本批扩写。

### 81. Fresh/duplicate store symmetry

| branch | write/read | store result | entry-visible complete source |
|---|---|---|---|
| fresh Maintenance | borrowed full write，same UoW | body-free staged receipt；commit后finalized header | caller唯一batch chain + finalized header |
| duplicate Maintenance | exact committed read | owned full `SandboxStoredJobReportSurface` + carrier | `SandboxReplayedMaintenanceJobReport` |
| fresh Reconciliation | dedicated atomic writer | canonical committed envelope | specialized outcome |
| duplicate Reconciliation | exact committed bundle read | canonical stored envelope | specialized outcome |

| audit | current result |
|---|---:|
| duplicate typed surface reads | `1` exact JobReport store |
| duplicate current truth/business reads | `0` |
| duplicate writes/clock/allocations/external calls | `0/0/0/0` |
| complete typed surface returned to application facade | `1` |
| public DTO/callable/store method delta | `0/0/0` |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R maintenance duplicate loader activated
artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_final_reaudit_complete
current_authority = physical_eof_7r_06c_1c_r_duplicate_loader_amendment
fresh_write_source = borrowed_complete
duplicate_read_source = owned_complete_typed_surface
duplicate_clock_read = 0
new_repository_method = 0
new_application_callable = 0
new_public_dto = 0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_7r_06c_2
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```
