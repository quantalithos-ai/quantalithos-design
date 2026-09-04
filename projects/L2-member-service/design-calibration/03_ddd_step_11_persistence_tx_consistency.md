# Step 11：持久化、事务与一致性契约

> 状态：completed / pass_with_upstream_blockers
> 目标文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02
> 参考：`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_09_function_flows.md`、`设计真相源闭环与可落码性标准.md`

## 1. 本步目标

本步明确本仓哪些对象必须持久化、由哪个 store 拥有、在什么 UoW 中提交、如何处理 expected revision、幂等、append-only history、material、outbox、projection 和 local/external 一致性。设计只描述逻辑 contract，不定义 SQL/DDL、数据库产品、分片或部署参数。

## 2. 输入与 SOP 问题回答

| 问题 | 结论 |
|---|---|
| 哪些记录是 source truth？ | CMP-MS-01~06 的 domain objects 及其显式 policy/decision/state；由对应 truth repository 写入。 |
| 哪些记录是派生/维护？ | `HostFactMaterial`、`HostHandoffRecord`、`HostHistoryEntry`、`HostOutboxRecord`、`HostProjectionState`、stored result；不得反写 source truth。 |
| 一个 accepted command 如何提交？ | truth、history/material、outbox、projection stale marker、stored result 和 idempotency completion 在同一 local UoW 中提交。 |
| 如何避免并发覆盖？ | mutation 前读取 `Versioned<T>`，写入携带 expected `HostRevision`；冲突返回 `Conflict`，不自动 merge。 |
| 外部副作用何时发生？ | local attempt/outbox committed 后由 Job/adapter 触发；external result 另经 feedback/consumer 更新。 |
| cursor 是否已闭合？ | `HostChangeCursor`、`CommittedChangeCursor` 的 exact type 与上游命名仍 pending；本步不创建第三种 cursor 或替代类型。 |

## 3. 逻辑 persistence owner

| 逻辑 store | owning file | 保存内容 | 写入者 | 一致性要求 |
|---|---|---|---|---|
| control store | `infra/src/persistence/control_store.rs` | intent、orchestration decision | application control use case | expected revision + same-UoW history/material |
| qualification store | `qualification_store.rs` | qualification、assembly、readiness | qualification/assembly use case | same host/generation；immutable replacement chain |
| progression store | `progression_store.rs` | host、attempt、association/current pointer | generation/action/feedback service | single-active + effect-key matching |
| session store | `session_store.rs` | registration、endpoint、Host Session | registration/session service | target/generation uniqueness + expected revision |
| health store | `health_store.rs` | signal、assessment、failure、recovery | consumer/health/recovery service | signal append-only；record replacement by revision |
| closure store | `closure_store.rs` | closure、cleanup | close/cleanup service | causality + same-key cleanup attempt |
| reconciliation store | `reconciliation_store.rs` | residual finding、case | reconciliation service/job | append/transition with expected revision |
| material/history store | `material_store.rs`、`history_store.rs` | safe material、handoff、history | accepted local flow/feedback | immutable material; append-only history |
| outbox store | `outbox_store.rs` | payload snapshot、publication marker | accepted flow/publish job | payload immutable; marker expected revision |
| projection store | `projection_store.rs` | projection state and freshness | projection job | derived only; source never rewritten |
| idempotency/result store | `idempotency_store.rs`、`result_store.rs` | reservation、stored result/receipt/report | application facade/job | duplicate replay exact surface |

禁止由一个 generic `host_store` 通过动态字段承载所有对象；physical co-location 可以由 infra 选择，但 logical owner、revision 和 semantic status 仍按上表分离。

## 4. UoW 与原子写集

### 4.1 accepted truth command write-set

```text
begin UoW
  reserve idempotency
  read required records with expected revisions
  save changed domain truth
  assign HostChangeCursor (after truth staged)
  append HostHistoryEntry (if applicable)
  save HostFactMaterial / HostHandoffRecord (if applicable)
  append HostOutboxRecord from stored payload snapshot (if applicable)
  mark affected HostProjectionState stale
  save StoredHostOperationResult
  complete idempotency reservation
commit
```

任一 save、cursor assignment、history/material/outbox/projection/result 或 idempotency completion 失败，整个 UoW rollback；不得留下“truth 已提交但 result/receipt 丢失”的不可回放状态。

### 4.2 reference/feedback marker write-set

外部 source change、action feedback、cleanup feedback、handoff feedback 只写其允许的 snapshot/attempt/handoff/gap，并在同一 UoW 中分配 `CommittedChangeCursor`、mark projection stale、保存 receipt。它们不创建 `HostChangeCursor` truth change，不写新的 formal intent/decision。

### 4.3 Query read-set

Query 可以使用 read-only transaction 或一致性快照读取 source/projection/history；不得调用 write UoW、reserve、mark stale、refresh resolver、append trace/outbox 或 repair。

## 5. expected revision、current pointer 与 replacement

| 场景 | 读取 | 写入条件 | 冲突处理 |
|---|---|---|---|
| 更新当前 decision | `get_current_decision` -> `Versioned` | expected decision revision + subject scope | return `Conflict/Superseded` |
| 建立新 generation | current host + pointer version | single-active current pointer expected revision | loser held/conflict |
| 更新 action attempt | attempt by ref/effect key | expected attempt revision + same generation | late/duplicate matching |
| 替换 registration/session | current + replacement plan | old/new/current/history same UoW | no partial replacement |
| 更新 health/recovery | current assessment/failure | expected record revision + basis refs | create replacement, do not overwrite history |
| cleanup/reconciliation | attempt/finding/case | expected revision + same-key fence | hold/gap, no key rotation |
| outbox marker | pending outbox with payload | expected marker revision | retry read; no payload mutation |
| projection state | stale projection state | expected projection revision | rebuild later; source unaffected |

`HostRevision` 表示 local persisted object revision，不能用 generation、source version、timestamp、cursor 或 broker offset 替换。

## 6. cursor 与 commit visibility

| 项目 | `HostChangeCursor` | `CommittedChangeCursor` |
|---|---|---|
| 语义 | accepted Host Truth change boundary | reference/material marker boundary |
| 分配时机 | truth save 已 stage 后 | snapshot/marker save 已 stage 后 |
| 可见时机 | UoW commit 后 | UoW commit 后 |
| rollback | 不得泄漏 | 不得泄漏 |
| 可生成内容 | truth change/outbox subject | stale marker/receipt relation |
| forbidden substitute | page cursor、history id、CAS/version、generation、timestamp | source version、message id、digest、timestamp |

exact type 的 owner、序列化和跨仓兼容性待 Core/Bus/SDK/兄弟合同闭合；本步不新增 alias、转换或第三类 cursor。

## 7. outbox、一致性与 publication

1. accepted command 在同一 UoW 保存 immutable `HostFactMaterial` 和 `HostOutboxRecord`；payload snapshot 与 source cursor 绑定。
2. publisher job 只读取 `list_pending_with_payload` 返回的 snapshot；不回查 current truth 组装新 payload。
3. submission marker 更新可独立短事务，但必须 expected revision；失败保留 pending/unknown/gap。
4. target feedback 通过 handoff key 更新 `delivered/observed/accepted` 独立层；任一层缺失不推导下一层。
5. publication adapter 不回滚已提交 Host Truth；可用性降级只影响 outbox/handoff/read surface。

## 8. projection 与 history 一致性

| 机制 | 规则 |
|---|---|
| stale marker | source/reference change 与 affected view refs 同 UoW 记录；不能 ad hoc 拼 view ref |
| rebuild | Job 从 committed material/history/source read 构造 projection；成功后保存 fresh cursor/state |
| rebuild failure | projection 保持 stale/degraded/unavailable；不修改 source truth |
| history | 每个 accepted local transition append immutable entry；replacement 通过 relation 表达，不删除旧 entry |
| safe view | application mapper 从 authorized projection/source 组装；physical projection row 不是 public DTO |

## 9. 一致性级别与故障处置

| 交互 | 需要的本地保证 | 可接受的非一致性 |
|---|---|---|
| command -> local truth | atomic commit + expected revision | 无；失败整体 rollback |
| command -> outbox | same-UoW append | publisher delivery 可延迟/unknown |
| source change -> qualification marker | atomic marker + receipt | projection 可 stale |
| action dispatch -> feedback | attempt committed before call | external feedback late/unknown |
| close -> cleanup | closure/invalidation + attempt atomic | cleanup owner反馈可 pending |
| projection rebuild | derived atomic replacement | read surface degraded/unavailable |
| duplicate replay | durable reservation + stored result | result store unavailable -> blocked, 不重跑 |

## 10. 回填草稿、风险与 Gate

正式 03 §10 只装配 store owner、UoW 写集、expected revision、cursor separation、outbox/projection/history 规则；不写 DDL 或产品选型。

| 检查项 | 结果 |
|---|---|
| logical store owner 唯一 | pass |
| accepted/consumer/query write-set 分离 | pass |
| expected revision / rollback / replacement | pass_with_upstream_blockers |
| outbox snapshot 与 projection non-source | pass |
| cursor exact type | pending / blocked |
| 正式 03 写入 | forbidden until Step 19 |

```text
step_11_status = completed
step_11_gate = pass_with_upstream_blockers
next_allowed_step = Step 12 errors_recovery
formal_03_write_allowed = false_until_step_19
```
