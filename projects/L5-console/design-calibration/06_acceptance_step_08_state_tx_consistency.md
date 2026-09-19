# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8  
> 回填章节：`06-验收标准.md` §8 状态机、事务与一致性验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 状态、事务与一致性验收 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 03 §8～§12；正式 05 STATE/CONSISTENCY/INTENT TC；Step 7 协议闭环 |
| 输出文件 | `design-calibration/06_acceptance_step_08_state_tx_consistency.md` |
| 逐项范围 | 11 个状态主语 + formal/local 非事务边界 + 9 类并发/重入 |
| 实际结果 | 全部 `not_evaluated` |
| 下一动作 | 只允许进入 Step 9 |

## 2. 本步计划与目标

本步按状态主语和一致性主题逐项闭环正式状态名、合法/非法迁移、触发 flow、副作用上限、TC/EV/report 与裁决影响。Console 没有数据库事务、UoW、outbox 或 owner idempotency store；因此验收重点是明确 formal/local 非原子、安全恢复和禁止伪造事务保证。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `03` §8 | 当前范围的触发 flow 与调用顺序 |
| `03` §9 | 11 个状态主语、正式 variants 与非法 shortcut |
| `03` §10 | carrier operations、formal/local 非原子与 cleanup |
| `03` §11 | typed error 与 recovery ceiling |
| `03` §12 | single-writer/flight、late drop、cancel/unknown、race |
| `05` STATE/CONSISTENCY/INTENT/CTX/TOPIC | table-driven 和 deterministic scheduler 证据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些合法迁移必须通过？ | 见 §8.1；formal observation 驱动 context/result/activation/source positive，本地驱动 navigation/draft/carrier 且只能保持/收紧 formal-derived state。 |
| 哪些非法迁移必须拒绝？ | route/carrier/cache→verified，role/flag→qualified，toast/2xx→confirmed，unknown replay，terminal revive，action completion→recovered，state load→presentable 等。 |
| 哪些事务必须原子提交？ | 只有单 carrier instance 的 same-scope whole-record replacement 在其局部边界内串行；formal query/command 与 carrier write 明确不原子。 |
| 哪些幂等/并发成立？ | same-scope single writer、semantic action single-flight、late result guard、canonical fan-out、terminal ordering、duplicate invalidation conservative；不声称 owner replay/CAS/cross-tab。 |
| 失败如何判不通过？ | 任一非法提升、lost update（声明范围内）、double submit、unknown replay、old result overwrite、跨 scope write 或非原子补偿/重发均 P0 failure/VETO 候选。 |
| 是否有旧/口语/后续 phase 状态？ | 无；严格使用 03 variants；`presentable/active/emitted` 均不解释为 readiness/confirmed/audit。 |
| 是否回指 state/flow/TC/EV/report？ | 是，见 §8.2。 |
| 是否逐项停审并跨状态审计？ | 是，见 §8.4/§8.5。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 06 无正式状态矩阵 | 逐状态主语建立门禁 |
| workspace/panel state 冒充业务状态 | 删除；仅保留 Console interaction state 与 owner-derived observations |
| 暗示 DB transaction/record compare | 明确无 DB/UoW/outbox；验 formal/local 非原子 |
| accepted/transport/UI success 混同完成 | formal `confirmed/rejected` 才是结果 terminal |
| 无并发/late result/replay 门禁 | 引入 8 CONSISTENCY TC 与 single-flight/late guard |

## 6. 改动前后对比

| 项 | 旧 | 新 |
|---|---|---|
| 状态名 | workspace/panel/action 泛状态 | 03 正式 11 类状态主语 |
| transaction | DB/record 影射 | local whole-record；formal/local 明确非原子 |
| idempotency | 未定义 | 本地 single-flight；owner replay 当前禁止 |
| concurrent result | 未定义 | correlation + late drop + terminal ordering |
| recovery | stale warning | formal-only positive recovery + one-action ceiling |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| accepted 是否 terminal success | 否；与 pending/confirmed/rejected/unknown 分开 |
| local save failure 能否补偿 owner | 否；reload/reconcile，不 resubmit |
| duplicate local operation 是否都幂等 | 只在正式定义的 equal replacement/monotonic invalidation 范围；不泛化 owner idempotency |
| cross-tab/session consistency 是否验收 | 当前不承诺；若 baseline/设计升级需回写 03/04/05 |
| invalidation 是否恢复 current | 否；只收紧，positive recovery 来自新 formal query |
| a11y/diagnostic state 能否改业务 | 否；side path failure/isolation 是 P0 |

## 8. 结构化中间产物

### 8.1 状态与一致性验收表

| Gate ID | 主题 | 通过条件 | 失败条件 | Future 证据 | 裁决影响 |
|---|---|---|---|---|---|
| `ST-CON-001` | context lifecycle | `unresolved→verified/restricted→expired/revoked/conflict/unknown` 由 formal resolve/revalidate/invalidate 驱动；非 current 安全替换 | route/carrier/render/cache 恢复 verified；撤销后仍披露 | `TC-CTX-001～005`,`TC-STATE-005`; UNIT/FLOW/SECURITY | VETO-002；不通过 |
| `ST-CON-002` | qualification/visibility | formal observation 可重算；本地只向 restricted/not-qualified/disabled/unknown/unavailable | role/menu/flag/page/config 产生 qualified/visible | `TC-NAV-001～004`,`TC-STATE-005`,`TC-SEC-004` | VETO-002/005；不通过 |
| `ST-CON-003` | navigation | empty↔guarded selection；context/visibility 收紧→restricted/empty；cleanup 清旧 scope | back/direct URL 恢复旧入口或提升 visibility | `TC-NAV-002～003`,`TC-CTX-002` | P0；可能 VETO-002 |
| `ST-CON-004` | source/ref axes | formal material 可给 positive；本地/invalidation 只向 stale/partial/unavailable/conflict/invalid/unknown 收紧 | timer/cache/DOM/LWW 恢复 fresh/current；五轴压为 health | `TC-VIEW-004～005`,`TC-STATE-005`,`TC-CONSISTENCY-008` | VETO-005/007；不通过 |
| `ST-CON-005` | draft | `editing↔invalid→reviewable→submitted`；非terminal→discarded | submitted/discarded 编辑/复活；reviewable→authorized | `TC-INTENT-003～004`,`TC-STATE-006` | P0；不通过 |
| `ST-CON-006` | request/result | submitted→accepted/pending/confirmed/rejected/unknown；unknown 只 formal reconcile | toast/2xx/cache→terminal；unknown replay；older pending 覆盖 terminal | `TC-INTENT-007～011`,`TC-STATE-006`,`TC-CONSISTENCY-005～007` | VETO-003；不通过 |
| `ST-CON-007` | topic activation | pending→read-only/partial/active/blocked；active 要 capability+mode+six facets+current context | flag/adapter/package/page→active；local recovery active | `TC-VIEW-008`,`TC-TOPIC-012`,`TC-STATE-007` | VETO-005；不通过 |
| `ST-CON-008` | degradation/recovery | non-normal→typed degradation→immutable plan→one action→new observation | stale plan、retry loop、action completion→recovered | `TC-RECOVERY-002～004`,`TC-STATE-007` | P0；VETO-003/006/007 候选 |
| `ST-CON-009` | carrier | exact-scope missing/loaded/replace/invalidate/clear；whole validate；ambiguous→reload | scope migration、partial salvage、CAS/version 假设、load→formal positive | `TC-STATE-001～004/008`,`TC-CONSISTENCY-001/006` | P0/S；不通过 |
| `ST-CON-010` | shell | bootstrapping→presentable/restricted/closed；closed terminal | state load→presentable；closed reopen；host failure 恢复旧 protected view | `TC-CTX-005`,`TC-STATE-008`,`TC-RECOVERY-005` | P0；可能 VETO-002 |
| `ST-CON-011` | a11y/diagnostic | focus/announcement 与 emitted/disabled/failed 保真；同 semantic action；业务不变 | side path 放宽 guard、改 result/activation/recovery 或递归 | `TC-A11Y-001～003`,`TC-DIAG-001～004`,`TC-STATE-008` | VETO-004/005/006 候选 |
| `TX-CON-001` | local whole-record boundary | same-scope single writer、顺序 whole replacement；声明范围无 lost update | partial write、scope leak、定义范围 lost update | `TC-STATE-001～004`,`TC-CONSISTENCY-001`; CONTRACT/INTEGRATION | P0/S |
| `TX-CON-002` | formal/local non-atomic | Query no-write；submit 与 local save 分离；save ambiguous→reload/reconcile；no compensate/resubmit | 把二者当原子、回滚 owner、local failure 导致重复 submit | `TC-INTENT-010～011`,`TC-CONSISTENCY-005～006`,`TC-ARCH-004` | VETO-003；不通过 |
| `CC-CON-001` | late result / scope switch | install 前重检 operation/context/owner/topic refs；旧结果 drop | A 结果写入 B scope | `TC-CTX-004`,`TC-CONSISTENCY-002` | P0/S |
| `CC-CON-002` | partition fan-out | 独立 reads，completion order 不改 canonical output；failure 局部 | completion order 改结果、全局取消/掩盖 | `TC-TOPIC-001～003`,`TC-CONSISTENCY-003`,`TC-SEC-005` | VETO-007 |
| `CC-CON-003` | semantic action single-flight | visual/keyboard/AT 同 action key；submit≤1 | 多通道 double submit | `TC-INTENT-009`,`TC-CONSISTENCY-004` | VETO-003/006 |
| `CC-CON-004` | cancellation/dispatch ambiguity | pre-dispatch cancelled/blocked；possible dispatch→unknown；replay=0 | 不区分 dispatch boundary 或自动重放 | `TC-INTENT-008`,`TC-CONSISTENCY-005` | VETO-003 |
| `CC-CON-005` | result ordering/correlation | older pending 不覆盖 newer terminal；exact request/context/result correlation | LWW/时间戳覆盖正式 terminal | `TC-CONSISTENCY-007` | P0/S |
| `CC-CON-006` | invalidation race | duplicate 等价/更保守；无 order proof→stale/unknown；no LWW elevation | hint 恢复 freshness/current 或写 cursor | `TC-ADAPTER-005～006`,`TC-CONSISTENCY-008` | P0；VETO-001/005 候选 |

### 8.2 状态 / 事务闭环矩阵

共同 report 入口：`reports/runs/<run_id>/evidence-index.md`，raw 回指 `artifacts/test/<run_id>/...`。

| Gate 范围 | 状态/事务契约 | 触发 flow | TC | EV / 主要 suite |
|---|---|---|---|---|
| `ST-CON-001～003/010` | 03 §9 context/visibility/navigation/shell | context switch、visibility、host present | CTX/NAV/STATE | UNIT/FLOW/INTEGRATION/SECURITY/ACCESSIBILITY；module-flow/a11y |
| `ST-CON-004/007` | 03 §9 source/ref/activation | owner view、topic activation/invalidation | VIEW/TOPIC/STATE/CONSISTENCY | UNIT/FLOW/INTEGRATION/SECURITY |
| `ST-CON-005～006` | 03 §9 draft/request/result | discard/submit/reconcile | INTENT/STATE/CONSISTENCY | UNIT/FLOW/CONTRACT/INTEGRATION |
| `ST-CON-008/011` | 03 §9 recovery/a11y/diagnostic | recovery action、focus/announce、emit | RECOVERY/A11Y/DIAG | UNIT/FLOW/INTEGRATION/ACCESSIBILITY/SECURITY |
| `ST-CON-009`,`TX-CON-001` | 03 §10 carrier | load/replace/invalidate/clear | STATE/CONSISTENCY | FLOW/CONTRACT/INTEGRATION |
| `TX-CON-002` | 03 §10 formal/local non-atomic | submit→local save / reconcile | INTENT/CONSISTENCY/ARCH | FLOW/INTEGRATION/ARCH |
| `CC-CON-001～006` | 03 §12 concurrency rules | late query/fan-out/single-flight/cancel/result/invalidation | CTX/TOPIC/INTENT/CONSISTENCY/ADAPTER | FLOW/INTEGRATION/SECURITY |

### 8.3 一致性失败裁决

| 失败 | 级别/裁决 |
|---|---|
| 非 current context 披露/submit、double submit、unknown replay | VETO/S；总体不通过 |
| Query/consumer/diagnostic 写业务或 formal-derived state | VETO/S；总体不通过 |
| terminal revive、old result overwrite、cross-scope installation | S；总体不通过 |
| local save/host/diagnostic failure 被当 owner rollback/success | S 或相应 VETO；不通过 |
| 仅 cross-tab/durable 能力不存在且 baseline 未启用 | residual/not in current scope；不得声称支持 |
| invalidation observed positive 未启用 | disabled safety 可裁决；positive 不评估 |

### 8.4 状态 / 事务逐项停审记录

| 范围 | 数量 | 正式状态名 | Flow/TC/EV/report | 副作用断言 | 设计停审 |
|---|---:|---|---|---|---|
| 状态主语 `ST-CON-*` | 11 | 11/11 | 11/11 | yes | pass |
| local/formal 边界 `TX-CON-*` | 2 | N/A/正式 operations | 2/2 | yes | pass |
| 并发/重入 `CC-CON-*` | 6 | formal phase/correlation | 6/6 | yes | pass |

### 8.5 跨状态一致性门禁审计

| 审计项 | 结论 |
|---|---|
| 旧/口语状态名 | none |
| 后续 phase 提前满足 | none |
| Query/diagnostic/presentation 状态提升 | prohibited |
| 非法转换缺证据 | none in contract |
| formal/local 被伪装为分布式事务 | no |
| owner idempotency/CAS/cross-tab 被发明 | no |
| side effect/zero-write 断言缺失 | none |
| VETO/功能门禁冲突 | none |
| actual evidence | absent；验收仍未进入 |

## 9. 回填草稿

正式 §8 应使用 `ST-CON-001～011`、`TX-CON-001～002`、`CC-CON-001～006` 的裁决表，明确正式状态名、本地只收紧、formal-only positive recovery、Query no-write、formal/local 非原子、single writer/flight、late drop、unknown no replay 和 invalidation conservative。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| owner reconciliation/idempotency exact contract | `CON-Q-038`，positive blocked |
| carrier medium/TTL/migration/cross-tab | `CON-Q-044`，当前不承诺 |
| invalidation order/dedup envelope | `CON-Q-034/038/044`，disabled |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 19 个状态/一致性 gate 逐项闭环 | pass |
| 正式状态名/flow/TC/EV/report/side effect 完整 | pass |
| 跨状态审计无 unresolved 冲突 | pass |
| 允许进入 Step 9 | yes |
| 允许修改正式 06 | no |
