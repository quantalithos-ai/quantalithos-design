# Step 12. 定义实施完成判定

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 12
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §12

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | completion_criteria |
| next_allowed_action | Step 13 formal_document_assembly |
| implementation_status | not_started |

## 本步输入

Step 2 范围、Step 4 交付物、Step 7 门禁矩阵、Step 9 风险/OQ、正式 06 §12~§14 的放行规则和 evidence 约束。

## SOP 问题回答

只有 24 boundary 全部按当前 baseline 完成、P0 gate 真实通过、P0 AC（AC-MS-001~017、AC-MS-022~039）与 9 VF 有可追溯真实证据，且 AC-MS-018~021 按 P1/P2 范围规则形成可审计的 future / residual / not-applicable 结论，S 级缺陷为零、redaction/dependency/report audit 通过、raw/report/handoff 完整且设计闭环无 blocker 时，才可在未来宣称实施完成或送验。P1/P2 可作为有 owner 的 residual，但不能掩盖 P0/VETO 失败。当前没有代码、commit、run、artifact、report、evidence、verdict、signoff 或 readiness，因此本轮完成判定只能是“计划设计完成，实施未开始”。

## 当前文档问题诊断

“基本完成”“测试数量足够”“有脚本”都不是完成判定；必须把代码、门禁、证据、VETO、设计闭环和交接材料同时纳入，并区分 implementation complete 与 acceptance passed。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| 完成 | 模糊状态 | 明确 P0、VETO、evidence、review 条件 |
| residual | 与 blocker 混写 | blocker / residual / future 分层 |
| 证据 | 可手写 | 必须真实 raw→report→index |
| 当前结论 | 容易误报 ready | not_started / no verdict |

## 设计取舍

- 将“实施计划完成”和“实现完成”“验收通过”分成三层，避免设计文档越权。
- 采用“不完成 / 有条件完成 / 可送验”三类 future 结论，但当前固定为 not_started。
- 设计闭环 blocker（尤其 exact contracts、cursor、存储、观测）不能延期为“已完成”。

## 结构化中间产物

### 实施完成判定表（future）

| 判定项 | 标准 | 证据 | 当前结论 |
|---|---|---|---|
| 范围覆盖 | C-MS-1~5、P0 AC、7 模块与协议分母均落地 | commit/boundary ledger | not_started |
| 24 boundary | 每项 Design/Scope/Build/Test/Commit/Handoff 完成 | boundary ledgers | not_started |
| P0 gates | 05 定义的阻断 suite 全通过 | fixed run artifacts/reports | not_started |
| AC/VF | P0 AC（AC-MS-001~017、AC-MS-022~039）与 9 VF 有真实证据；AC-MS-018~021 有 P1/P2 范围结论；无 VETO | evidence index + checklist | not_started |
| 设计闭环 | 字段/DTO/状态/Port/phase 无 blocker | design-closure audit | blocked by upstream contracts |
| 证据完整 | raw/report/index/digest/redaction/pairing 完整 | fixed run | not_generated |
| 交接 | handoff/open issues/review 已审查 | reports/acceptance/* | not_generated |
| P1/P2 边界 | AC-MS-018~021 不阻断 P0，且不反写核心 truth | selected-run / residual record | future |

### 闭环项完成标准

| 闭环项 | 必须证明 | 当前 |
|---|---|---|
| 字段 / DTO | 无临时补设字段，source/validation 唯一 | planned / upstream pending |
| 状态 | code/test/acceptance 使用正式状态名 | planned |
| transaction | UoW、revision、idempotency、sidecar 顺序一致 | planned / durable pending |
| projection | committed source、cursor、stale/rebuild/no-write 闭合 | planned / cursor pending |
| evidence | fixed run 生成，非静态表 | not_generated |
| phase boundary | 无 successor 泄漏 | pass-designed |

### 交付实现前闭环审计

| Phase / boundary | 复核范围 | 当前适用项 | 结论 |
|---|---|---|---|
| PH-01 / 01-a..c | 03 §3~§4、04 §3~§9、05 §9、07 §3 | naming、dependency、config、artifact root | blocked by target repo/Core baseline |
| PH-02 / 02-a..c | 03 §6~§12、05 command/state、06 function gates | field/DTO/state/UoW/idempotency | pass-designed；exact mapper/storage pending |
| PH-03 / 03-a..c | 03 host/registration/session、06 AC-MS-003/011/012 | generation/ref/session | blocked by Member/Runtime contracts |
| PH-04 / 04-a..c | 03 health/recovery/error/observability | signal/state/unknown/recovery | blocked by health authority/backend |
| PH-05 / 05-a..c | 03 closure/reconcile、06 AC-MS-015/016 | cleanup/finding/case/no-repair | blocked by Sandbox feedback |
| PH-06 / 06-a..c | 03 material/query/cursor、05 evidence | immutable/material/projection/no-write | blocked by cursor/Core/Bus exact |
| PH-07 / 07-a..c | 03 consumer/job/handoff、06 AC-MS-017 | receipt/layer/key/no-repair | blocked by Core/Bus feedback |
| PH-08 / 08-a..c | 05 evidence/report、06 VETO/hand-off | raw/report/audit | blocked until real run |

### 未完成项处理表

| 状态 | 处理 |
|---|---|
| blocker | 不得进入 successor；回写 owning source 或等待 owner |
| residual | 写入 open-issues/risk-acceptance，必须有 owner、理由、期限/触发 |
| future | 不计 P0，进入后续 ADR/selected-run |
| not_evaluable | 重新生成固定 run 和 evidence，不得给 verdict |

### 当前设计期结论

`07-实施计划.md` 的设计与台账骨架可完成；实现状态为 `not_started`，目标仓 absent，当前 boundary `commit-01-a` 为 `blocked / wait_design`。没有任何实际 commit、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 回填草稿

正式 §12 应区分计划、实现、验收三个层级，列出 P0/VF/VETO/evidence/设计闭环完成条件和未完成项处理；当前只给设计期状态，不给实现或验收结论。

## 待确认事项

- 真实实现完成时的 release owner、AC/VF reviewer 和风险接受人。
- S/A/B/R 缺陷阈值与项目正式 06 的最终审查结果。

## 进入下一步条件

完成判定、闭环审计、证据要求和未完成处理已固定，允许进入 Step 13 正式文档装配。
