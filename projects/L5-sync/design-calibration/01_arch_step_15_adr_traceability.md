# L5-sync 架构 Step 15 · ADR 与需求追溯

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 15 |
| 输入 | Step 1~14 已停审结论、正式 00 的 CP/FR/BR/AC/VETO |
| 回填章节 | 正式 01 §16、§17 |
| 下一步 | Step 16：整理正式文档 |

## 2. Step 内计划

- [x] 识别值得长期保留的关键架构决定，不把普通实现选择塞入 ADR。
- [x] 为每个决定关联需求、约束、风险、取舍和已停审架构单元。
- [x] 将 CP/FR/BR/AC/VETO 映射到正式架构章节与决定。
- [x] 逐 ADR 候选停审；审计孤儿决定、孤儿核心需求和新增未确认结论。
- [x] 保留“候选/待建立”状态，不伪造 accepted ADR。

## 3. 本步输入

| 输入 | 追溯用途 |
|---|---|
| 正式 00 §7~§16 | CP-SYNC、FR-SYNC、BR-SYNC、AC-SYNC、VETO-SYNC 与风险 |
| Step 3/5 | 职责与五个架构单元 |
| Step 7~12 | 依赖、数据、通信、技术、取舍、横切 |
| Step 14 | 风险与待确认，确保 ADR 不关闭 blocker |

## 4. SOP 问题回答

### 4.1 哪些决定需要 ADR？

值得长期保留的决定包括：本地受控桥定位；五上下文与 local/external truth 分离；ports/adapters 和 SDK-only owner access；source/working-copy 分离及 non-overwrite；prepare/call/probe/finalize；handoff/transport/decision 分层；provenance/redaction/forbidden-body 边界。它们会长期影响多个后续模块、接口和测试红线。

### 4.2 哪些不需要 ADR？

Rust/Tauri、具体 Git library/command、metadata 文件布局、LFS/浅克隆、CLI parser、进度 UI、具体日志字段、性能阈值尚未确认或属于实现选择，不应在当前 ADR 索引中伪装为正式决定。

### 4.3 是否存在无需求来源的架构设计？

没有。每个决定均回指 00 的能力、规则、数据归属、NFR 或 veto，并关联 Step 3~14 的停审结论。Ports/adapters 是实现边界机制，但其来源是 BR-SYNC-020/023 和 owner/可替换约束，不是凭空引入。

### 4.4 是否存在未被架构承接的核心需求？

`CP-SYNC-01~06`、`FR-SYNC-001~015`、`BR-SYNC-001~025`、`AC-SYNC-001~020`、`VETO-SYNC-001~005` 均已进入职责、上下文、数据、交互、横切、演进或风险。外围 `FR-SYNC-013~015` 只作为演进/姿态边界承接，没有被错误提升为当前核心。

## 5. 当前文档问题诊断

| 历史 ADR/追溯 | 问题 | 当前处理 |
|---|---|---|
| 旧 01 引用 ADR-0008/0009 | 与当前 Sync 决策关系弱，且可能误称 accepted | 移除为当前 ADR 依据；只列本轮候选决定 |
| 旧追溯仅映射 US-001~005 | 与新版 CP/FR/BR/AC/VETO 编号不一致 | 全量按正式 00 当前编号映射 |
| 旧矩阵把概要/验收“预留”混入架构 | 可能伪造下游完成情况 | 只映射需求→架构章节/决定/风险 |
| ADR 索引可能被误解为已评审 | 当前没有新 ADR 文件或 verdict | 状态统一为 `candidate / not established` |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 为每项技术选择创建 ADR 编号 | 不采用 | 会把未确认实现选择变成长期决定。 |
| B. 只列跨单元、跨文档、长期边界决定候选 | 采用 | 保持索引可审查且不伪造正式 ADR。 |
| C. 不建立追溯矩阵 | 不采用 | 后续概要/详细设计无法证明承接核心需求和 veto。 |

## 7. 结构化中间产物

### 7.1 ADR 候选索引

| 候选 ID | 架构决定 | 来源 | 关联单元 | 状态 |
|---|---|---|---|---|
| `ADR-SYNC-C01` | L5-sync 采用本地受控桥，不成为平台 truth/VCS/远程全能同步服务 | `CP-SYNC-01~06`、`BR-SYNC-021`、`BR-SYNC-023`、Step 11 | 全局/五单元 | candidate / not established |
| `ADR-SYNC-C02` | 外部 owner truth 只以 SDK formal seam + ref/snapshot 进入 | `BR-SYNC-003`、`BR-SYNC-004`、`BR-SYNC-019`、`BR-SYNC-023`、Step 7~8 | Selection、References | candidate |
| `ADR-SYNC-C03` | source 与 working copy 分离，dirty/path unknown 时禁止 apply | `FR-SYNC-003~007`、`BR-SYNC-005`、`BR-SYNC-006`、`BR-SYNC-010~012`、`BR-SYNC-020`、`VETO-SYNC-001`、`VETO-SYNC-005` | Working Copy、Materialization、Recovery | candidate |
| `ADR-SYNC-C04` | 使用 local transition/checkpoint/cursor/provenance 解释恢复，不用 Git commit 代替 | `FR-SYNC-004`、`FR-SYNC-005`、`FR-SYNC-008`、`FR-SYNC-012`、`BR-SYNC-007`、`BR-SYNC-008`、`BR-SYNC-011`、`BR-SYNC-014`、`BR-SYNC-018`、`BR-SYNC-021` | Working Copy、Recovery | candidate |
| `ADR-SYNC-C05` | 外部副作用采用 prepare→call→probe/finalize，unknown 不盲重放 | `FR-SYNC-008~010`、`BR-SYNC-013~015`、`VETO-SYNC-001` | Recovery、Handoff | candidate |
| `ADR-SYNC-C06` | handoff attempt/transport ACK/probe/Review decision 分层 | `FR-SYNC-009`、`FR-SYNC-010`、`BR-SYNC-015`、`BR-SYNC-016`、`BR-SYNC-022`、`VETO-SYNC-002` | Handoff | candidate |
| `ADR-SYNC-C07` | Git/fs adapter 仅白名单 observation/lock/path protection/atomic apply | `BR-SYNC-006`、`BR-SYNC-012`、`BR-SYNC-020`、`AC-SYNC-011`、`AC-SYNC-012` | Working Copy、Materialization | candidate |
| `ADR-SYNC-C08` | redaction-first、forbidden body、provenance non-fabrication 为全仓边界 | `BR-SYNC-007`、`BR-SYNC-018`、`BR-SYNC-019`、`BR-SYNC-022`、`VETO-SYNC-004` | 全单元 | candidate |

### 7.2 需求追溯矩阵

| 需求范围 | 架构承接 | 正式章节 | ADR 候选/风险 |
|---|---|---|---|
| `CP-SYNC-01` / `FR-SYNC-001~002` | Selection & Access、explicit context、owner fail-closed | §4~§6、§8~§10、§13 | `ADR-SYNC-C02`；`AR-SYNC-001`、`AR-SYNC-003` |
| `CP-SYNC-02` / `FR-SYNC-003~004` | working-copy binding、controlled metadata、source refs | §4、§6、§9、§11 | `ADR-SYNC-C03`、`ADR-SYNC-C04`、`ADR-SYNC-C08`；`AR-SYNC-002`、`AR-SYNC-006` |
| `CP-SYNC-03` / `FR-SYNC-005~006` | read-only status、source/workcopy split、safe materialization | §7~§11、§13 | `ADR-SYNC-C03`、`ADR-SYNC-C07`；`AR-SYNC-002`、`AR-SYNC-007`、`AR-SYNC-008`、`AR-SYNC-010` |
| `CP-SYNC-04` / `FR-SYNC-007~008` | conflict/checkpoint/recovery/probe/manual decision | §6、§9~§13 | `ADR-SYNC-C03`、`ADR-SYNC-C04`、`ADR-SYNC-C05`；`AR-SYNC-005`、`AR-SYNC-008`、`AR-SYNC-010` |
| `CP-SYNC-05` / `FR-SYNC-009~010` | frozen candidate、handoff attempt/transport/probe/decision separation | §6、§9~§13 | `ADR-SYNC-C05`、`ADR-SYNC-C06`、`ADR-SYNC-C08`；`AR-SYNC-004`、`AR-SYNC-005` |
| `CP-SYNC-06` / `FR-SYNC-011~012` | posture invalidation、bounded diagnostic/provenance | §5、§9~§15 | `ADR-SYNC-C02`、`ADR-SYNC-C08`；`AR-SYNC-003`、`AR-SYNC-006` |
| `FR-SYNC-013~015` | multi-source/archive/compare 仅作为外围演进，逐项门禁不放宽 | §3、§12、§14~§15 | `ADR-SYNC-C01`、`ADR-SYNC-C02`；`AR-SYNC-002`、`AR-SYNC-009` |
| `BR-SYNC-001~005` | explicit context、owner checks、binding invariants | §3~§10 | `ADR-SYNC-C02`、`ADR-SYNC-C03` |
| `BR-SYNC-006~014` | no overwrite/auto merge、query no-write、cursor/conflict/recovery/idempotency | §3~§13 | `ADR-SYNC-C03`、`ADR-SYNC-C04`、`ADR-SYNC-C05`、`ADR-SYNC-C07` |
| `BR-SYNC-015~018` | handoff/decision/provenance boundaries | §4、§9~§13 | `ADR-SYNC-C05`、`ADR-SYNC-C06`、`ADR-SYNC-C08` |
| `BR-SYNC-019~025` | forbidden body、adapter whitelist、local-state semantics、no private seam、historical candidates pending | §3~§15 | `ADR-SYNC-C01`、`ADR-SYNC-C02`、`ADR-SYNC-C07`、`ADR-SYNC-C08` |
| `AC-SYNC-001~014` | capability/owner/data boundary architecture | §4~§10、§16 | `ADR-SYNC-C01~C08` |
| `AC-SYNC-015~020` | progress/availability/security/audit/idempotency/observability | §13~§15 | `ADR-SYNC-C04`、`ADR-SYNC-C05`、`ADR-SYNC-C08`；`AR-SYNC-001~010` |
| `VETO-SYNC-001~005` | non-overwrite/no auto push、no ACK elevation/no truth ownership/no provenance damage/fail-closed | §3~§13、§16 | `ADR-SYNC-C01~C08` |

### 7.3 ADR 决定停审记录

| 候选 | 值得长期保留 | 有需求/风险/取舍来源 | 未新增未确认结论 | 结论 |
|---|---|---|---|---|
| `ADR-SYNC-C01` | 是 | 是 | 是 | pass as candidate |
| `ADR-SYNC-C02` | 是 | 是 | 是 | pass as candidate, surface blocked |
| `ADR-SYNC-C03` | 是 | 是 | 是 | pass as candidate, comparator/path blocked |
| `ADR-SYNC-C04` | 是 | 是 | 是 | pass as candidate, schema blocked |
| `ADR-SYNC-C05` | 是 | 是 | 是 | pass as candidate, probe contract blocked |
| `ADR-SYNC-C06` | 是 | 是 | 是 | pass as candidate, governance contract blocked |
| `ADR-SYNC-C07` | 是 | 是 | 是 | pass as candidate, adapter details blocked |
| `ADR-SYNC-C08` | 是 | 是 | 是 | pass as candidate |

### 7.4 漏项检查表

| 检查 | 结果 |
|---|---|
| 孤儿核心能力 | 无；`CP-SYNC-01~06` 全部承接 |
| 孤儿功能需求 | 无；`FR-SYNC-001~015` 全部承接，外围未升格 |
| 孤儿业务规则/veto | 无；`BR-SYNC-001~025`、`VETO-SYNC-001~005` 均有章节与候选决定 |
| 无需求来源的架构决定 | 无 |
| 普通实现选择误入 ADR | 无；Rust/Tauri/LFS/浅克隆/schema/library 均未入索引 |
| blocker 被 ADR 关闭 | 无；`ADR-SYNC-C02~C07` 明确保留对应 blocker |

### 7.5 跨 ADR / 需求追溯审计

五个架构单元均至少关联一个长期决定和一个需求主轴；数据/依赖/通信/横切结论与 ADR 候选没有冲突。候选状态不等于 accepted/approved/signoff，也不表示已创建 ADR 文件。

## 8. 回填草稿

正式 §16 回填需求追溯矩阵与漏项边界；§17 回填 ADR 候选索引和状态说明。正式正文不得把候选写成 accepted ADR，也不引用旧 ADR-0008/0009 作为本轮决策证明。

## 9. 待确认事项

- 是否为候选建立正式 ADR 文件不在本轮授权范围内；需后续明确流程与评审。
- `SYNC-UP-001~010` 必须继续显示在 §15，不能因追溯完整而被视为 resolved。

## 10. 自检与进入下一步条件

- [x] 每个 ADR 候选回指已停审单元、需求/约束/风险和取舍。
- [x] 核心需求与 veto 无孤儿项。
- [x] 普通实现选择未误入 ADR。
- [x] 没有通过矩阵新增前文未确认结论或伪造正式 ADR 状态。

`gate_status = pass_with_upstream_blockers`；可进入 Step 16 正式装配。
