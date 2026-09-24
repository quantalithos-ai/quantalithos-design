# Step 5. 定义功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节：`06-验收标准.md` §5 功能验收门禁
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 5 |
| current_module | `function_gate:ac_run_001_to_011_item_closure` |
| gate_status | `pass_for_step_06` |
| acceptance_items | 11 个 `AC-RUN-*`，设计层逐项停审完成 |
| actual_item_results | 0；全部 `not_evaluated` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 6 |

## 2. 本步目标与输入

本步把 11 条正式需求 AC 转为未来可执行的功能裁决小循环。每项都必须闭环：需求/设计 → TC → planned slot/runtime EV → fixed report → 通过/失败 → tier/总体影响。本步不运行用例，不生成 EV，也不把设计层“停审通过”写成交付 item pass。

| 输入 | 用途 |
|---|---|
| 00 §7、§9～§14、§16 | 五能力、FR/BR、11 AC 与禁止条件 |
| 03 §5～§12、§14～§15 | 正式对象、协议/flow/state、UoW/恢复、观测与测试切口 |
| 05 §5～§6 | AC→TC family、逐 TC、协议入口覆盖 |
| 05 §9、§12 | suite/gate 与 T0～T4 分层 |
| 05 §13 | 18 slot、runtime EV alias、fixed report 与证据资格 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能通过/失败条件是什么？ | 见 §6；11 项均有字段/state/call/write/owner/evidence 可判定条件，禁止“功能基本可用”。 |
| 证据来自哪里？ | 仅来自对应 TC 在同一 fixed run 的合格 runtime EV item、evidence detail/index、producer suite report 和 raw artifact/check；planned slot 不是 evidence。 |
| P1/P2 如何处理？ | `FR-RUN-014~016` 不进入 11 项当前 P0 分母；正式进入时必须先回写 00～05 并新建 AC/TC/slot。 |
| 哪些失败总体不通过？ | 任一 target-tier required `AC-RUN-*` failed，或 required positive blocked/not-run，均不能总体通过；命中 Step 11 VETO 时必不通过。 |
| 下层通过是否等于产品通过？ | 否。item 与最终 verdict 必须携带 `acceptance_target_tier`；T1 pass 只证明语义安全，不能升级成 T2/T3/T4。 |
| 是否有孤儿/重复证据？ | 以 05 §13 slot 主目录反查：18 slot 均至少被一个 AC 消费；secondary AC 关联保留；同一 slot 只一个主归属，不重复计覆盖。 |

## 4. 当前文档问题诊断与裁决取舍

| 问题 | 本步处理 |
|---|---|
| 旧 06 使用 10 条旧功能 UI 门禁 | 全部删除；以 `AC-RUN-001~011` 为稳定 ID |
| “证据见 API/DB/报告”不可追踪 | 每项列精确 TC family、EV alias 和 fixed report pattern |
| 语义 fake 通过易冒充产品 success | 每项按 target tier 裁决；T1/T2 不能升级 T3/T4 |
| §5 追溯摘要未列出全部 secondary slot | 以 §13 canonical slot→AC 目录为准，完整保留 secondary 关联 |
| 当前无实例却需要“结论”列 | item contract 完成；actual result 固定 `not_evaluated`，不填 pass |

## 5. 共同裁决与证据规则

### 5.1 Item result

| Item result | 含义 | 对 target-tier verdict |
|---|---|---|
| `not_evaluated` | 尚无有效验收实例或未完成 review | 不得生成 verdict；当前全部为此状态 |
| `passed` | target tier 要求的 semantic/negative/positive 与 evidence 完整 | 可进入汇总，不单独推出总体通过 |
| `failed` | 任一 required assertion/check 失败 | 总体不能通过；按缺陷/VETO 处理 |
| `blocked` | target tier required prerequisite/positive/evidence 缺失 | 总体不能通过；不得压成 not-applicable/pass |
| `not_applicable` | 仅 optional/conditional facet 被 baseline 有权排除且安全 disabled/blocked 已证明 | 不贡献 positive；排除理由与 authority 必须留档 |

### 5.2 Target-tier 规则

| Target tier | 功能门禁上限 |
|---|---|
| `T1-SEMANTIC-P0` | 11 AC 的 Runner-owned semantic、negative、zero-unsafe-effect 可裁决；owner/platform positive 不在该 tier，不可声明 integration/product |
| `T2-CONTROLLED-INTEGRATION` | T1 全部必需；baseline 选中的 slot 必须有正式 contract 和真实 positive/negative/Unavailable/Unknown/recovery evidence |
| `T3-PRODUCT-REHEARSAL` | T1 + 核心 Artifact/Governance/Sandbox/Runtime/Observability/platform/SDK 链在 approved environment 的正向闭环全部必需 |
| `T4-RELEASE/ACCEPTANCE` | T1～T3 适用门禁、release checks、VETO、风险与签署全部必需；仍不自动表示 production readiness |

共同 fixed report 入口为 `reports/runs/<run_id>/evidence-index.md`；每个列出的 EV 还必须有 `reports/runs/<run_id>/evidence/<evidence_id>.md`，并回指同 run producer suite 与 `artifacts/test/<run_id>/...`。当前 runtime EV instance 数量为 0。

## 6. 功能验收门禁与闭环

| ID / 优先级 | 正式设计与 TC | 必需 runtime EV alias | 通过条件（按 target tier） | 失败条件与裁决 |
|---|---|---|---|---|
| `AC-RUN-001` P0 | 03 §6～§9 C01/C02、Selection；`TC-RUN-CTX-001~006`、`CON-001~006`、`ENT-001~005` | `EV-RUN-CTX-001`、`EV-RUN-CON-010`、`EV-RUN-ENT-013` | trusted actor/scope/platform + exact immutable refs/generation；source/validity 可见；`latest/default/mutable` 拒绝且 authority/material/run call=0；T2+ selected authority positive 必须真实 | 缺 context/ref、隐式 selector、stale generation overwrite、entry scope/route coercion；required item failed/blocked→不能通过，隐式选择为 VETO 候选 |
| `AC-RUN-002` P0 | 03 C01/C02、authority/readiness/config；`TC-RUN-CTX-001~006`、`CFG-001~006` | `EV-RUN-CTX-001`、`EV-RUN-CFG-016` | unavailable/revoked/expired/conflict 保留 Blocked/Stale/Invalidated 与 source/freshness；角色/cache/history/profile 不补 authority；T2+ selected Governance/Artifact authority 有真实 positive | 本地批准、空值/历史成功补齐、profile 放行或失效后继续；required failure→不能通过/VETO 候选 |
| `AC-RUN-003` P0 | 03 C03～C06/J01/Q04、Acquisition；`TC-RUN-MAT-001~007`、`JOB-001~008` | `EV-RUN-MAT-002`、`EV-RUN-JOB-015` | progress/pause/resume/failure/complete 可区分；transfer Complete 与 verification/qualification 分轴；失败/ambiguous 不 promote、不进 Sandbox；T2+ source positive 真实 | Complete 冒充 Verified/Qualified、失败材料请求运行、terminal reopen/auto resume、Job report 压缩 Blocked/Unknown；失败→不能通过 |
| `AC-RUN-004` P0 | 03 J01/C07、Integrity/Cache/Config；`TC-RUN-MAT-001~007`、`CFG-001~006` | `EV-RUN-MAT-002`、`EV-RUN-CFG-016` | manifest/digest/signature/platform/authority freshness 与 exact cache binding 均有效才 Qualified；任一缺失/漂移/不匹配 fail-closed；T2/T3 positive 需 formal verifier/source | skip verify、rename/redeclare material、stale/revoked 仍 Qualified、silent fallback/half facade；失败→不能通过/VETO 候选 |
| `AC-RUN-005` P0 | 03 C07/C08、Run/Control/Idempotency/Entry；`TC-RUN-REQ-001~006`、`CTL-001~005`、`IDM-001~006`、`ENT-001~005`、`BND-001~006` | `EV-RUN-REQ-003`、`EV-RUN-CTL-004`、`EV-RUN-IDM-011`、`EV-RUN-ENT-013`、`EV-RUN-BND-018` | request/intent 区分 Draft/Submitting/Accepted/Rejected/Unknown；Accepted/receipt≠Running；external unknown→RecoveryCase/no resend；duplicate exact replay/zero second effect；T2+ selected Sandbox positive 真实 | ACK/PID/port/toast 当 Running、unqualified material dispatch、duplicate second effect、Unknown replay/resend；失败→不能通过/VETO 候选 |
| `AC-RUN-006` P0 | 03 C08/Q06/J03、Control/Owner Projection/Query；`TC-RUN-CTL-001~005`、`OWN-001~005`、`QRY-001~006`、`BND-001~006` | `EV-RUN-CTL-004`、`EV-RUN-OWN-005`、`EV-RUN-QRY-009`、`EV-RUN-BND-018` | owner lifecycle/status/result 必须带 source/freshness/visibility/ref；local intent 与 owner projection 并列；control Accepted/Confirmed 与 execution/cleanup 分离；T2+ Runtime/Sandbox readback positive 真实 | 无 owner ref 推导 Running/terminal/Confirmed、stale projection 当 current、本地修 owner truth；失败→不能通过/VETO 候选 |
| `AC-RUN-007` P0 | 03 C07/C09/Q07、Resource/Guard；`TC-RUN-RES-001~006` | `EV-RUN-RES-006` | observation/request/allocation/lease 分离；source/freshness 与 conflict 可见；unknown/unsupported typed blocked；T2+ platform/Sandbox slot positive 真实 | 静默换端口/抢占/覆盖 owner allocation，以 probe/PID/port 推断资格；失败→不能通过/VETO 候选 |
| `AC-RUN-008` P0 | 03 C09/J02、Protection/Cleanup；`TC-RUN-RES-001~006`、`JOB-001~008`、`BND-001~006` | `EV-RUN-RES-006`、`EV-RUN-JOB-015`、`EV-RUN-BND-018` | cleanup intent/Accepted/Confirmed/Cleaned/Released/Evicted 分离；lease/capture/handoff/retention/orphan guard 完整且 current 才可释放；unknown 保持 protected | guard 缺失/陈旧/冲突仍 delete/evict，ACK/local receipt 当 Cleaned，candidate 当 Evicted；失败→不能通过/VETO |
| `AC-RUN-009` P0 | 03 C07～C10/J03/Q08、Recovery/UoW/IDM；`TC-RUN-REC-001~006`、`QRY-001~006`、`IDM-001~006`、`UOW-001~006`、`JOB-001~008` | `EV-RUN-REC-007`、`EV-RUN-QRY-009`、`EV-RUN-IDM-011`、`EV-RUN-UOW-012`、`EV-RUN-JOB-015` | disconnect/sleep/restart/expiry/commit unknown 冻结副作用；重验 context/authority/owner basis；Querying→Reconciled/Conflict/ManualReview 仅凭 formal read；no replay/reclaim/resume | cursor/cache/page/Online 推断完成，Unknown 自动重发，missing result 当前态重建，claim/checkpoint 自动接管；失败→不能通过/VETO |
| `AC-RUN-010` P0 | 03 C11/J04/Q09～Q11、Preview/Diagnosis/Handoff/Obs；`TC-RUN-PRE-001~006`、`QRY-001~006`、`JOB-001~008`、`OBS-001~006`、`BND-001~006` | `EV-RUN-PRE-008`、`EV-RUN-QRY-009`、`EV-RUN-JOB-015`、`EV-RUN-OBS-017`、`EV-RUN-BND-018` | preview/diagnosis/handoff bounded、redacted、source/freshness/visibility/truncation 保真；restricted/partial/stale/blocked 明示；receipt/local report≠evidence；T2+ formal source/handoff positive 真实 | raw secret/body/path/URL/PID/port/stack 可见、空结果掩盖限制、redaction failure fallback、receipt 升级 evidence/verdict/signoff；失败→不能通过/VETO |
| `AC-RUN-011` P0 | 01/03 依赖与全部入口；`TC-RUN-CON-001~006`、`IDM-001~006`、`UOW-001~006`、`ENT-001~005`、`CNS-001~006`、`JOB-001~008`、`CFG-001~006`、`OBS-001~006`、`BND-001~006` | `EV-RUN-CON-010`、`EV-RUN-IDM-011`、`EV-RUN-UOW-012`、`EV-RUN-ENT-013`、`EV-RUN-CNS-014`、`EV-RUN-JOB-015`、`EV-RUN-CFG-016`、`EV-RUN-OBS-017`、`EV-RUN-BND-018` | 只经 SDK/API/public adapter；owner writes=0；Query reserve/save/refresh/dispatch=0；Consumer payload read/parse/hash/store/ACK=0；Job owner repair=0；outbound event=0；T2+ exact SDK/public versions fixed | sibling private source/backend/DB/bus/topic、SDK bypass、Query write、Consumer positive shortcut、Job repair、event/outbox、配置绕 truth；失败→不能通过/VETO |

每个 item 的主要 report 均是列出 EV 的 detail 文件与 `evidence-index.md`；还必须读取其 producer suite report、`gate-results.md` 及 redaction/dependency/link/pairing reports。只引用 evidence index 而不核对 raw/report pair 不构成通过。

## 7. 逐项停审记录

| 验收项 | 设计来源 | TC/EV 固定 | 通过/失败可判定 | tier 不升级 | 设计停审 | Actual result |
|---|---:|---:|---:|---:|---:|---|
| `AC-RUN-001` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-002` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-003` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-004` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-005` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-006` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-007` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-008` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-009` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-010` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AC-RUN-011` | pass | pass | pass | pass | pass | `not_evaluated` |

“设计停审 pass”只表示本 Step 的裁决合同完整，不表示任何实际 item passed。

## 8. 跨功能门禁裁决审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| 11 AC 是否全部有门禁 | pass | 无孤儿 AC |
| 18 slot 是否均被 AC 消费 | pass | slot 001～018 全覆盖；secondary 关联不重复计主归属 |
| 108 TC 是否被裁剪 | pass | 通过 18 family/slot 保持完整分母；正式运行必须展开逐 TC |
| 状态/协议名是否正式 | pass | 仅用 03/05 正式名称；旧 RunnerRun/Trigger* 为 0 |
| positive blocked 是否冒充 pass | pass | target tier + slot manifest 强制分离 |
| P1/P2 是否污染 P0 | pass | `FR-RUN-014~016` 不进入当前分母 |
| evidence path 是否固定 | pass | same-run index/detail/suite/raw/check/digest |
| 当前是否伪造 result | pass | 11/11 均 `not_evaluated` |

## 9. 回填草稿

正式 §5 应保留共同 item/tier/evidence 规则与 11 项闭环表。每项 actual result 当前不得填写。未来 acceptance handoff 必须为每项记录 target-tier applicability、完整 EV instance/digest、未执行/blocked 范围和 item result；单项通过不能推出总体 verdict。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| actual target tier 与 enabled slots | required positive 分母 | Step 3 baseline instance 固定 |
| future AC 是否扩充外围 FR | 功能分母 | 先回写 00～05，再重开本 Step |
| exact SDK/owner positive contract | T2/T3 evidence | 保持 `RUN-UP-*` blocked |

## 11. 进入下一步条件

- [x] 11 个 P0 功能 item 均有设计、TC、EV/report、通过、失败和裁决影响。
- [x] 每项完成设计层停审，actual result 保持 `not_evaluated`。
- [x] target tier 与 conditional positive 不升级规则明确。
- [x] 跨功能审计无内部 unresolved 冲突。
- [x] 允许进入 Step 6；正式 06 仍禁止写入。
