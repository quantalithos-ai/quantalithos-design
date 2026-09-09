# Step 5. 定义功能验收门禁

## 1. Step 状态

`completed / p0_items_blocked_or_planned`。10 个功能 AC 已逐项停审。

## 2. 功能门禁表

| AC | 需求/设计来源 | 通过条件 | 失败条件 | 测试/证据 | 当前 |
|---|---|---|---|---|---|
| AC-FUNC-001 | FR-WS-001；ScopeService | typed Personal/Project resolution 与 principal/scope 一致 | mismatch、缺决定或泄漏 anchor | SCOPE-001~003 / EV-WS-SCOPE-* | blocked WS-UP-005 |
| AC-FUNC-002 | FR-WS-002；VisibilityBinding | 每项使用 current owner decision 并裁剪 | missing/conflict/revoked 仍展示或泄漏 metadata | VIS-001~003 / EV-WS-VIS-* | blocked WS-UP-003 |
| AC-FUNC-003 | FR-WS-003；六 Query | safe read 带 basis/status，七写=0 | 任意隐式写、refresh、cursor推进或 stale冒fresh | QRY-001~006 / EV-WS-QRY-* | planned/owner blocked |
| AC-FUNC-004 | FR-WS-004；ProjectionApply | event/baseline 分类、幂等、Gap/Unknown 规则成立 | gap terminal、重复二次效果、异 digest覆盖 | SRC/TXN/IDEM / EV-* | blocked WS-UP-002 |
| AC-FUNC-005 | FR-WS-005；Personal view | safe Personal view 可回链 source/visibility/revision | 未授权、不可解释或下游误当完整 | QRY/VIS / EV-* | blocked |
| AC-FUNC-006 | FR-WS-006；Project view | Project scope 与 safe ref/coverage 一致 | 跨主体/项目泄漏或 owner ref 伪造 | SCOPE/VIS/QRY / EV-* | blocked |
| AC-FUNC-007 | FR-WS-007；InboxProjector | 仅明示 attention 生成 stable item/lifecycle | 文本推测、重复 unread、无正式 reopen | INBOX/SRC / EV-* | blocked WS-UP-004 |
| AC-FUNC-008 | FR-WS-008；LocalAttention | local CAS、principal/scope/stream 隔离成立 | cross-scope 写、stale expected 覆盖或写 owner | LOCAL/IDEM/TXN / EV-* | planned/relation blocked |
| AC-FUNC-009 | FR-WS-009；RecoveryService | request/advance/supersede/invalidate 按 phase/generation/basis | unsafe cutover、终态复活、缺 proof 继续 | REC/STATE/TXN / EV-* | blocked WS-UP-001/2、LOCAL-001 |
| AC-FUNC-010 | FR-WS-010；Export | schema v1 safe read-only，provenance/status 可回链 | archive handoff、artifact写、下游 accepted 伪造 | QRY-006/BOUND / EV-* | blocked WS-UP-006 |

## 3. 裁决规则

所有 P0 AC 需真实 evidence；任何失败或 required seam blocked 都不能判“通过”。P1/P2 不得覆盖 P0 缺口。

## 4. 回填草稿与停审

正式 §5 回填此表及 AC→TC/EV/report 规则。10 项均完成逐项审查，无孤儿功能；允许 Step6。
