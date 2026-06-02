# L1-conversation 06 验收标准 Step 8: 定义状态机、事务与一致性验收

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §8 状态机、事务与一致性验收
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义状态机、事务与一致性验收 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_08_state_tx_consistency.md` |

本步定义状态机、事务、幂等、并发和一致性如何验收。非功能指标、审计证据、一票否决、风险接受和最终签署分别留给 Step 9~Step 14。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `03-详细设计.md` §9 | 状态机总览、正式 enum variant、状态传播图和非法转换规则 | 作为状态验收真相源 |
| `03-详细设计.md` §10 | 数据所有权、事务边界和一致性策略 | 作为事务与一致性验收真相源 |
| `03-详细设计.md` §12 | 并发资源、幂等键和重入保护 | 作为幂等与并发验收真相源 |
| `03_ddd_step_10_state_matrix.md` | 状态集合、状态转换矩阵和非法转换处理表 | 作为状态覆盖清单来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | repository、UnitOfWork、sequence、outbox 和 projection 一致性规则 | 作为事务原子性来源 |
| `03_ddd_step_13_concurrency_idempotency.md` | 并发场景、幂等键和重入保护表 | 作为重复调用与重跑裁决来源 |
| `05-测试方案.md` §6 / §9 / §13 | P0 用例、专项场景、EV 和 report 路径 | 作为证据来源 |
| `06_acceptance_step_07_interface_event_sync.md` | P0 协议族、事件协作和下游接缝 | 作为状态和副作用承接来源 |

## 3. SOP 问题回答

### 3.1 哪些合法状态迁移必须通过?

必须覆盖五类合法迁移: space / scope 建立和关闭、fact append / retract、manifestation / reference refresh、projection / cursor 推进、outbox / trace / archive handoff 推进。验收只接受 `03-详细设计.md` §9 和 `03_ddd_step_10_state_matrix.md` 中的正式状态名,例如 `ConversationTruthState::Open`、`ConversationFactState::Accepted`、`ProjectionFreshnessState::Failed`、`ConversationOutboxPublicationState::RetryPending`、`TraceHandoffState::HandedOff` 和 `ArchiveHandoffState::Archived`。

### 3.2 哪些非法迁移必须拒绝?

必须拒绝 `Closed -> Open`、sealed visibility 扩张、terminal fact 反向修改、duplicate path 生成新 fact、projection / query 反写真相、cursor source position 倒退、outbox terminal state 再次发布、handoff terminal state 被外部 job 改写等非法迁移。拒绝结果必须是正式 domain / application / repository error,且不得写入 truth、outbox 或伪成功 evidence。

### 3.3 哪些事务必须原子提交?

Command 和 inbound consumer 写 truth 时,`idempotency reserve -> business write -> trace / receipt / handoff -> outbox enqueue -> idempotency complete` 必须在同一 UnitOfWork 中闭合。space / scope、append / retract fact、manifestation、handoff command、inbound consumer 均属于这一类。outbox publish、projection rebuild、cursor maintenance、handoff delivery 使用短事务推进派生或交接状态,不得把外部 publish / handoff 调用包进 truth 写事务。

### 3.4 哪些幂等和并发行为必须成立?

Command 同 key 同 digest 返回 existing result,同 key 不同 digest 返回 `IdempotencyError::Conflict`。Query 不写幂等记录。Inbound consumer 用 event id + source ref + idempotency key 去重。Outbound publish 用 outbox record id + event id 去重。Job 用 job run id + idempotency key 返回 existing receipt。同一 space append sequence、outbox sequence 和 projection source position 必须单调,并发冲突必须通过锁、version 或唯一约束暴露。

### 3.5 失败时如何判定不通过?

凡是应该原子提交的事务出现部分提交、query / projection 改写 truth、失败外部 publish / handoff 回滚已提交 truth、重复调用生成新 truth、sequence 倒退、状态非法迁移成功、fake recovery 自动修 truth,均判定不通过。允许的失败形态是 rollback、retry marker、failed / stale / unresolved marker、quarantine、diagnostic report 或 existing receipt。

### 3.6 是否存在旧状态名、口语状态名或后续 phase 状态被写入本轮验收?

正式验收不得使用旧 `Turn` / `StreamEvents` / `AG-UI` 主语,也不得用 lower-case、口语状态或泛化状态替代正式 enum variant。若测试报告中出现 `completed`、`running`、`dispatched`、`stuck` 这类非正式状态描述,必须在 evidence 中映射回正式状态;无法映射时按状态证据不合格处理。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧文档未按新状态机和事务矩阵建立 AC | 不继承旧状态和旧验收主语 |
| `03-详细设计.md` §9 | 已有 15 组状态机,但不是验收项格式 | 本步归并为状态族验收门禁 |
| `03-详细设计.md` §10 | 事务表清楚,但未说明失败如何影响验收结论 | 本步补原子提交和失败裁决 |
| `03-详细设计.md` §12 | 幂等 / 并发规则已成表,但未绑定 AC | 本步转成 `AC-IDEM-*` 和 `AC-CONS-*` |
| `05-测试方案.md` | TC 已覆盖状态和事务,但需回填到 06 | 本步绑定 TC、EV 和 evidence index |
| Step 7 产物 | 已定义接口和事件族,但未展开状态副作用 | 本步承接 Command / Query / Consumer / Event / Job 的副作用门禁 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 状态验收 | 只知道详细设计有状态机 | 按状态族定义合法 / 非法迁移 AC |
| 事务验收 | 分散在处理流和事务表中 | 归并为 command / consumer / job / query 原子性门禁 |
| 幂等验收 | 用例中有 duplicate / conflict | 独立为 command、consumer、outbox、job 幂等门禁 |
| 一致性验收 | 只写 sequence、source position 规则 | 明确单调、不可倒退、失败 marker 和 no auto repair |
| 状态命名 | 可能继承旧草案或口语状态 | 只接受正式 enum variant 和可追溯 evidence |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 15 组状态机是否逐个建立 AC | 每个状态机一条 AC | 按业务状态族建立 AC,再用覆盖清单防漏 | B | 验收表可读,同时保留完整覆盖 |
| Query 是否需要幂等记录 | 需要写 query idempotency | Query 只读,不写幂等状态 | B | 与 `03` §12 对齐,避免 query 推进 truth |
| 外部 publish / handoff 失败是否回滚 truth | 回滚 truth | truth 已提交,outbox / handoff 状态进入 retry / failed | B | outbox 与 handoff 是传播和交接状态,不是 truth 成立条件 |
| Projection rebuild 失败是否修 truth | 自动修复 truth | 只写 `Failed` / stale / issue marker | B | projection 是派生层,不得反写业务事实 |
| 口语状态是否可作为验收结论 | 可以接受 | 必须映射到正式 enum variant | B | 后续实现必须 1:1 落码,状态名漂移会阻塞开发 |

## 7. 结构化中间产物

### 7.1 状态机、事务与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-STATE-001 | truth / space / scope 状态机 | `ConversationTruthState`、`ConversationSpaceLifecycleState`、`ParticipantScopeState`、`VisibilityScopeState`、`ScopeChangeState` 的合法创建、收紧、关闭和 supersede 迁移通过;非法 reopen、sealed 扩张、projection 改 truth 被拒绝 | `Closed -> Open` 成功;sealed visibility 被打开;scope 更新未标记 projection stale;旧状态名写入证据 | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*`;`EV-CONV-TRUTH-001` |
| AC-STATE-002 | fact / manifestation / reference 状态机 | fact append / retract、duplicate receipt、manifested / unresolved / stale / invalid reference 均按正式状态推进;source truth isolation 成立 | duplicate 生成新 fact;retract 抹除 trace;unresolved 时补造来源 truth;digest mismatch 覆盖旧 truth | `TC-CONV-FACT-*`;`TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-FACT-001`;`EV-CONV-MAN-001` |
| AC-STATE-003 | projection / cursor 状态机 | projection 可进入 `Fresh` / `Stale` / `Rebuilding` / `Failed` / `Disabled`;cursor 只前进,expired / invalidated 不可续读;query 暴露 marker | rebuild failure 被写成 fresh;cursor 倒退;expired cursor 继续 poll;query 触发 rebuild 或修 truth | `TC-CONV-QUERY-*`;`TC-CONV-DERIVED-*`;`TC-CONV-CURSOR-001`;`EV-CONV-AUTH-001`;`EV-CONV-DERIVED-001` |
| AC-STATE-004 | outbox / trace / archive handoff 状态机 | outbox 从 `Pending` / `RetryPending` 推进到 `Published` / `Failed` / `Suppressed`;trace / archive handoff 从 `Pending` / `RetryPending` 推进到 `HandedOff` / `Archived` / `Failed` / `Cancelled`;truth 不回滚 | terminal state 被再次推进;publish failure 回滚 truth;handoff failed 后改 fact;archive success 保存 package body | `TC-CONV-OUTBOX-*`;`TC-CONV-HANDOFF-*`;`EV-CONV-OUTBOX-001`;`EV-CONV-HANDOFF-001` |
| AC-STATE-005 | 正式状态命名 | 所有验收报告、测试断言和 evidence 使用 `03` §9 / Step 10 的正式 enum variant,非正式状态必须映射后才能入 evidence | 使用旧 `Turn` / `StreamEvents` 主语;lower-case 或口语状态无法映射;后续 phase 状态被写成本轮通过条件 | `domain_state_transitions`;`reports/runs/<run_id>/evidence-index.md`;`gate-results.md` |
| AC-TX-001 | command / consumer truth 事务原子性 | space / scope、append / retract、manifestation、handoff command 和 inbound consumer 在同一 UnitOfWork 内完成 idempotency、business write、trace / receipt、outbox 和 complete | 事务部分提交;outbox enqueue 失败后 truth 仍存在;idempotency complete 失败但 business write 保留 | `TC-CONV-TX-001`;`TC-CONV-FACT-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-FACT-001`;`EV-CONV-CONSUMER-001` |
| AC-TX-002 | job 短事务与外部副作用边界 | outbox publish、projection rebuild、cursor maintenance、handoff delivery 按 record / space / consumer 短事务推进状态;外部调用不包入 truth 写事务 | 长事务包住外部 publish / handoff;job partial failure 污染成功项;rerun 重复外部副作用 | `TC-CONV-OUTBOX-*`;`TC-CONV-DERIVED-*`;`TC-CONV-HANDOFF-*`;`EV-CONV-OUTBOX-001`;`EV-CONV-DERIVED-001`;`EV-CONV-HANDOFF-001` |
| AC-TX-003 | Query no-write | 11 个 Query API 只读 truth / projection / visibility,可返回 stale / failed / unresolved / expired marker,不得写 truth、cursor truth、projection 或 idempotency state | query 写 idempotency record;query 推进 cursor;query rebuild projection;query 修复 missing read model | `TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-AUTH-001` |
| AC-CONS-001 | sequence 与 source position 单调 | 同一 space fact append sequence 唯一递增;outbox sequence 单调;projection source position 和 cursor position 只前进;gap 写 stale marker | fact sequence 重复或倒退;outbox gap 被忽略;projection source position regression;cursor 继续消费无效 position | `TC-CONV-FACT-001`;`TC-CONV-CURSOR-001`;`TC-CONV-DERIVED-*`;`EV-CONV-FACT-001`;`EV-CONV-DERIVED-001` |
| AC-IDEM-001 | command 幂等 duplicate / conflict | 10 个 Command 缺幂等键拒绝;同 key 同 digest 返回 existing result / receipt;同 key 不同 digest 返回 conflict,不写新 truth | 缺 key 仍写 truth;duplicate 追加新 fact / outbox;conflict 被 accepted;result ref 丢失 | `TC-CONV-SPACE-002`;`TC-CONV-FACT-002`;`TC-CONV-FACT-003`;`EV-CONV-TRUTH-001`;`EV-CONV-FACT-001` |
| AC-IDEM-002 | event / outbox / job 幂等和重跑 | inbound duplicate skip;outbox rerun 使用 stable event id;job rerun 返回 existing receipt 或重扫未完成目标;external success + state write failure 可补状态 | duplicate event 写新 truth;publish rerun 生成重复 downstream record;job rerun 重复交接;state write failure 无法恢复 | `TC-CONV-CONSUMER-*`;`TC-CONV-OUTBOX-003`;`TC-CONV-HANDOFF-*`;`EV-CONV-CONSUMER-001`;`EV-CONV-OUTBOX-001`;`EV-CONV-HANDOFF-001` |
| AC-CONS-002 | 失败恢复一致性 | publish / handoff / resolver / projection / consistency validation 失败只写 retry、failed、unresolved、stale 或 issue marker;不回滚已提交 truth,不自动 repair truth | 外部失败回滚 fact;resolver 失败补造 source body;consistency validation 自动修 truth;projection failed 被隐藏 | `TC-CONV-MAN-002`;`TC-CONV-MAN-003`;`TC-CONV-DERIVED-002`;`TC-CONV-CONSISTENCY-001`;`TC-CONV-HANDOFF-002`;`EV-CONV-MAN-001`;`EV-CONV-DERIVED-001`;`EV-CONV-HANDOFF-001` |

### 7.2 状态族覆盖清单

| 状态族 | 必须覆盖的正式状态机 | 最小合法迁移证据 | 最小非法迁移证据 |
|---|---|---|---|
| Truth / scope | `ConversationTruthState`;`ConversationSpaceLifecycleState`;`ParticipantScopeState`;`VisibilityScopeState`;`ScopeChangeState` | create active space、收紧 visibility、close space | closed reopen、sealed expand、projection 写 truth |
| Fact / receipt | `ConversationFactState`;`FactAppendResult` | accepted append、duplicate receipt、retracted fact | duplicate new fact、terminal fact 再修改 |
| Manifestation / reference | `ManifestationState`;`ReferenceResolutionState` | manifested + fresh snapshot、unresolved marker、digest mismatch evidence | unresolved 补 source truth、invalid reference accepted |
| Projection / cursor | `ProjectionFreshnessState`;`ConversationChangeCursorState` | fresh / stale / failed marker、cursor advance | source position regression、expired cursor resume |
| Outbox / handoff | `ConversationOutboxPublicationState`;`TraceRetentionState`;`TraceHandoffState`;`ArchiveHandoffState` | published、retry / failed、handed off、archived | terminal state 再推进、failure rollback truth |

### 7.3 事务与一致性裁决图

```text
[Command / Consumer]
  | reserve idempotency
  | write truth / trace / receipt
  | enqueue outbox
  | complete idempotency
  v
[Committed Truth + Pending Outbox]
  | publish / rebuild / handoff by short job transaction
  v
[Published / Retry / Failed / Stale / Handoff Evidence]

[Query]
  | read authorized view and markers
  v
[No Truth Write]
```

关键说明:

- Command / Consumer 的 truth、outbox 和 idempotency complete 是同一事务裁决点。
- 外部 publish / handoff 与 projection rebuild 是提交后的恢复和传播流程,不能反向决定 truth 是否成立。
- Query 只能暴露 marker,不得因为读取触发修复、重建或 cursor 推进。
- 所有 sequence 和 source position 的方向只能前进,不得用重跑覆盖倒退。

### 7.4 失败对最终结论的影响

| 失败范围 | 最终结论影响 |
|---|---|
| AC-STATE-001~AC-STATE-004 任一 P0 状态合法路径缺失 | 不通过 |
| AC-STATE-005 状态命名无法映射正式 enum | 不通过,并回到详细设计 / 测试方案复核 |
| AC-TX-001 command / consumer 原子性失败 | 一票否决候选,Step 11 汇总 |
| AC-TX-002 job 重跑造成重复外部副作用 | 不通过 |
| AC-TX-003 query 写 truth | 一票否决候选,Step 11 汇总 |
| AC-CONS-001 sequence / source position 倒退 | 不通过 |
| AC-IDEM-001 / AC-IDEM-002 duplicate / conflict 语义失败 | 不通过 |
| AC-CONS-002 failure recovery 自动修 truth 或回滚 truth | 一票否决候选,Step 11 汇总 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §8 时摘录。

```markdown
## 8. 状态机、事务与一致性验收

> 校准来源：
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_08_state_tx_consistency.md` 的“状态机、事务与一致性验收表”“状态族覆盖清单”“事务与一致性裁决图”和“失败对最终结论的影响”小节，了解状态迁移、事务原子性、幂等、并发和失败恢复如何进入验收裁决。

本轮状态机、事务与一致性验收以 `AC-STATE-001~AC-STATE-005`、`AC-TX-001~AC-TX-003`、`AC-CONS-001~AC-CONS-002` 和 `AC-IDEM-001~AC-IDEM-002` 为裁决入口。所有状态名必须使用 `03-详细设计.md` §9 与 `design-calibration/03_ddd_step_10_state_matrix.md` 的正式 enum variant。

Command 和 inbound consumer 写 truth 时,必须在同一 UnitOfWork 中完成 idempotency、business write、trace / receipt、outbox enqueue 和 idempotency complete。Query API 不得写 truth、projection、cursor 或 idempotency state。outbox publish、projection rebuild、cursor maintenance、trace / archive handoff delivery 只能通过短事务推进传播、派生或交接状态,外部失败不得回滚已提交 truth。

同一 command 的重复请求、inbound event replay、outbox publish rerun 和 operations job rerun 必须幂等。fact append sequence、outbox sequence、projection source position 和 cursor position 只能前进。失败恢复只能产生 rollback、retry、failed、stale、unresolved、quarantine、issue marker 或 existing receipt,不得自动修复业务 truth。
```

## 9. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续必须继续收口:

- Step 9 将把性能、安全、可用性、兼容性和恢复性专项门禁与本步的状态 / 事务规则分开裁决。
- Step 10 将把本步引用的 EV、report、audit、trace、redaction 和 evidence path 展开为证据门禁。
- Step 11 将 query 写 truth、partial commit、sequence regression、自动修 truth 和状态非法迁移成功汇总为一票否决项。
- Step 12 将说明状态 / 事务 / 幂等缺陷如何分级、复验和放行。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 合法状态迁移有门禁 | 通过 | 5 个状态族均已覆盖 |
| 非法状态迁移有失败条件 | 通过 | closed reopen、sealed expand、sequence regression、terminal state 等已纳入 |
| 事务原子性可裁决 | 通过 | command / consumer / job / query 边界已区分 |
| 幂等和并发可裁决 | 通过 | command、event、outbox、job 和 sequence 规则已覆盖 |
| 证据来源可追溯 | 通过 | 每项绑定 TC、EV 和 report evidence |
| 可以进入 Step 9 | 通过 | 下一步定义非功能验收门禁 |
