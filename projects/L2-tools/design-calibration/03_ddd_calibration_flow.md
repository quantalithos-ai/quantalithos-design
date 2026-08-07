# L2-tools 03 详细设计全量重启校准流程

> 创建日期: 2026-08-05
> 状态: completed / pass; stop review
> 当前模式: full-restart / single-agent-serial
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 当前直接基线: 已完成的正式 `00-需求文档.md`、`01-架构设计.md` 与 `02-概要设计.md`
> 历史材料口径: 旧 README 与旧正式 `03/05/06` 只用于后置差异和污染审计，不提供当前语言、布局、对象、协议、状态、存储或实现事实。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 5~9 粒度再校准 | `granularity_recalibration:R-9` | `completed / pass` | R-9 已完成 37 条 flow 的 exact callable、UoW/phase、state/effect、error/replay 和 cross-flow fence 审计。 | 已通过 Step 9；进入 Step 10 状态主语筛选和六状态族矩阵。 | `03_ddd_step_09_function_flow_recalibration_annex.md`;全部 Step 9 flow annexes。 |
| Step 10 | `state_matrix:six_state_families` | `completed / pass` | 六个状态族已分别完成 enum、合法/非法转换、前置条件、副作用、phase 与测试回指；跨状态审计通过。 | 创建 `03_ddd_step_11_persistence_transaction_consistency.md`，先闭合七个 Store 与两阶段 UoW。 | `03_ddd_step_10_state_matrix.md`;六个 `03_ddd_step_10_*_state_annex.md`;Step 7 stores/foundation;Step 9 flow annexes。 |
| Step 11 | `persistence_transaction_consistency:seven_stores_and_uow` | `completed / pass` | 七个 logical Store、IdempotencyStore、semantic key/version、UoW 边界、事务排序、projection/reference/status 隔离、失败恢复与 cross-store invariants 已闭合。 | 已通过 Step 11；进入 Step 12 错误模型与恢复。 | `03_ddd_step_11_persistence_transaction_consistency.md`;Step 7 stores/foundation;Step 9 flow annexes;Step 10 state annexes。 |
| Step 12 | `error_recovery:typed_taxonomy_and_flow_mapping` | `completed / pass` | domain/application/port/protocol/job 错误、37 flow 映射、retry/manual/unknown、dead-letter 与 consistency defect catalog 已闭合。 | 已通过 Step 12；进入 Step 13 并发与幂等。 | `03_ddd_step_12_error_recovery.md`;Step 8 protocol carriers;Step 9 flow annexes;Step 11 persistence matrix。 |
| Step 13 | `concurrency_idempotency:key_digest_replay_and_reentry` | `completed / pass` | scoped key/digest、mutable CAS、semantic uniqueness、Command/Consumer/Continuation/Job replay、unknown/late material 与 test cuts 已闭合。 | 创建 `03_ddd_step_14_config_external_binding.md`，先收敛 typed config candidates、builder binding、dependency class 和不可配置化红线。 | `03_ddd_step_13_concurrency_idempotency.md`;Step 3 constraints;Step 7 ports/adapters;Step 8 metadata;Step 11/12。 |
| Step 14 | `config_external_binding:typed_candidates_and_builder_seams` | `completed / pass` | typed config candidate、infra-only validated runtime surface、seven Store/UoW/technical bindings、seven blocked-aware external Port seams、dependency classification、fallback 和 25 条不可配置化红线已闭合。 | 已通过 Step 14；创建 `03_ddd_step_15_observability_audit.md`，继续定义 body-free logs、metrics、trace 与 ToolAudit 埋点。 | `03_ddd_step_14_config_external_binding.md`;Step 8 protocols;Step 9 flows;Step 11~13;正式 02 §11。 |
| Step 15 | `observability_audit:body_free_telemetry_and_tool_audit` | `completed / pass` | 日志、低基数指标、TraceContext/span、`ToolAuditEntry` 原子 pair、change/assessment/gap/attempt/receipt/report 事实形成点、external status/handoff 分层、37-flow 观测回指和 forbidden-field/redaction 规则已闭合；未新增 Observability Store 或 external readiness claim。 | 已通过 Step 15；Step 16 已完成，创建 `03_ddd_step_17_implementation_handoff.md`；正式 03 仍 write-closed。 | `03_ddd_step_15_observability_audit.md`;Step 6 outcome/shared carriers;Step 7 ports/UoW;Step 8 protocols;Step 9 flows;Step 11~14。 |
| Step 16 | `test_cuts:module_protocol_state_consistency_and_observability` | `completed / pass` | 七模块、37 条 public flow、六状态族、事务/CAS/幂等/并发、错误恢复、配置/builder、观测/redaction 均有 implementation-addressable 正向与异常最小切口；未声明代码、脚本或测试结果。 | 创建 `03_ddd_step_17_implementation_handoff.md`；正式 03 仍 write-closed。 | `03_ddd_step_16_test_cuts.md`;Step 5~15。 |
| Step 19 | `formal_document_assembly:18_chapter_rebuild_and_chain_audit` | `completed / pass; stop review` | 正式 03 已整体重建；18 章、来源、对象、协议、flow、state、Store/UoW、error、replay、redaction、07 boundary input 和 blocker 全链审计通过；无新增 blocker。 | 停审并等待用户 review；未经用户确认不进入 04。 | `03_ddd_step_19_formal_document_assembly.md`;`03_ddd_step_18_risks_open_questions.md`;Step 1~18。 |

## 2. 执行纪律

- 本流程只负责 `L2-tools` 的 `03-详细设计.md` full-restart；只设计文档，不实现代码，不进入 04。
- 每次恢复先读 `project_execution_ledger.md`，再读本 flow、当前 Step 与全部已完成前序 Step。
- Step 1~19 严格串行；每个 Step 先读标准和上游、回答 SOP 问题、诊断旧材料、形成取舍，再写结构化中间产物。
- Step 6~10 必须分别按模块、协议族、接口和状态机做小循环停审，再做跨模块闭环审计；不得退回全仓摘要总表。
- 正式 `03-详细设计.md` 只允许在 Step 19 依据 Step 1~18 已停审结论整体重建；旧正式 03 不作增量底稿。
- 当前实现目标仓 `/home/aris/Projects/quantalithos-tools` 不存在；文件布局只可写计划创建契约，不得声称已扫描源码、Cargo、分支或 git identity。
- Rust 与英文源码 / 英文 rustdoc 由当前编码和目录标准承接；具体 framework、transport、database、broker、scheduler、search、observability backend 不得从旧 03 恢复。
- 只有 `quantalithos-core/crates/contracts` 是当前可检索的 compile dependency candidate；Tools-specific shared type 不存在时必须保持 `L2T-UP-008` blocked，不复制或假造 Core 类型。
- Hub、Authorization、Sandbox、Runtime 为 runtime seam；Bus、Observability 为 event collaboration；SDK 为 future consumer。不得写成 sibling Cargo dependency。
- `L2T-UP-001~009` 必须持续开放。03 可闭口 L2 自有 schema、negative path、blocked port 和 fail-closed 行为，但不能伪造外部 owner、provider、mapping、receipt、route、client 或 readiness。
- 禁止伪造实现 commit、run_id、测试结果、真实 evidence alias、验收签署、发布或 implementation readiness。
- 用户已授权连续完成全部 03；Step 内门禁通过后可串行进入下一 Step。正式 03 完成后必须停审，不进入 04。
- 当前无 commit 授权，不提交。

## 3. 权威输入与效力

| 输入 | 效力 | 用途 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | current formal | 仓定位、功能 / 规则 / 数据 / 接口 / NFR / 验收与开放风险。 |
| `projects/L2-tools/01-架构设计.md` | current formal | Owner、A/S/P 单元、R/T/D 承载、依赖、数据、交互和技术中立边界。 |
| `projects/L2-tools/02-概要设计.md` | direct formal input | 六组成部分、41 对象、接口 `13/11/5/4/4`、流、状态、异常、配置轮廓与 03 承接。 |
| `projects/L2-tools/design-calibration/02_hld_step_12_detailed_design_handoff.md` | explanatory current | 03 必须形成的 exact contract、blocked boundary 与回退条件。 |
| `standards/document/详细设计讨论流程_SOP.md` | process standard | 固定 Step 1~19、模块 / 协议 / flow / state 小循环及门禁。 |
| `standards/document/详细设计书写规范.md` | result standard | 正式 18 章、对象 / trait / protocol / flow / state / persistence 粒度。 |
| `standards/document/设计文档讨论中间产物规范.md` | artifact standard | 三层台账、Step 产物、full-restart、写入批次与恢复门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | implementability standard | 字段、DTO、Query view、public type、state、phase、side effect 与测试闭环。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | dependency standard | compile / runtime / event 三类依赖和本仓裁剪。 |
| `standards/coding/rust.md` | coding standard | Rust 语言、英文源码 / 注释 / rustdoc、命名与语言实践。 |
| `standards/document/子项目目录与代码文件组织规范.md` | layout standard | 实现仓、workspace、package、crate、binary、file、scripts / artifacts / reports 组织。 |
| `projects/L3-capability-hub/03-详细设计.md` 等已完成 03 | calibration sample | 七 member 工程骨架、模块主轴和正式装配粒度；不提供 L2 领域事实。 |
| 旧 `projects/L2-tools/03-详细设计.md` | historical_material | 只识别旧 Rust service、RPC / HTTP、PostgreSQL / Redis / NATS、registry / policy / executor 污染。 |

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | 前序依赖 | 核心输出 | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md` | 概要设计输入边界 | `completed` | 正式 02 完成且用户授权 | 上游映射、不再回答 / 必须回答、输入不足风险 | 稳定输入、可本地闭口项与 blocked seam 分层。 |
| 2 | `03_ddd_step_02_scope.md` | 本轮实现范围 / 非范围 | `completed` | Step 1 | 实现契约目标、非范围、phase discipline | 41 对象与全部 public surface 有范围归属。 |
| 3 | `03_ddd_step_03_constraints.md` | 语言 / runtime / 仓约束 | `completed` | Step 2 | Rust / rustdoc / git / repo / dependency constraints | Authority 与未选产品分开，不恢复旧技术假设。 |
| 4 | `03_ddd_step_04_file_layout.md` | 实现单元与文件布局 | `completed` | Step 3 | workspace、七 member、目录树、文件职责 | 计划路径可创建，依赖方向闭合。 |
| 5 | `03_ddd_step_05_module_contracts.md` + R-5 addendum | 模块实现主轴 | `recalibration_completed` | Step 4 | 七模块 implementation card、六组成部分 capability -> callable -> test 回指 | 每模块独立停审；未定义的 entry/store/Port owner 或错误边界不得继续。 |
| 6 | `03_ddd_step_06_object_contracts.md` + R-6 addendum | 逐模块对象实现契约 | `recalibration_completed` | Step 5 | 41 对象和 stable carriers 逐项字段、factory/member、状态、非法分支、来源、协议回指 | 所有 public 二级类型和 flow carrier 有唯一正式定义；不允许临时 helper。 |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` + R-7 addendum | Trait / Port / Adapter | `recalibration_completed` | Step 6 | 每个 seam 的 caller、implementer、exact method、request/result/error、UoW/version/page、fake parity | 每个 flow 只调用已列方法；blocked seam 和 recovery ownership 明确。 |
| 8 | `03_ddd_step_08_protocol_contracts.md` + R-8 addendum | Public protocol | `recalibration_completed` | Step 6~7 | 每个 `13/11/5/4/4` DTO、二级 carrier、version、mapper、error、duplicate/replay | 协议 -> object -> port -> flow 逐项矩阵无空洞。 |
| 9 | `03_ddd_step_09_function_flows.md` + R-9 addendum | 逐接口函数级处理流 | `completed / pass` | Step 6~8 | 每条 flow 的 exact callable、调用图、伪代码、UoW、状态、副作用、错误、重入、测试 | R-9 cross-flow audit 已完成；正式 03 仍 write-closed。 |
| 10 | `03_ddd_step_10_state_matrix.md` + 状态族附录 | 状态机与转换矩阵 | `completed / pass` | Step 6~9 | 状态主语筛选、逐状态机矩阵、非法转换 | 六状态族命名 / 触发 / 测试闭环。 |
| 11 | `03_ddd_step_11_persistence_transaction_consistency.md` | 持久化 / 事务 / 一致性 | `completed / pass` | Step 7~10 | Store / repository / key / version / UoW / projection | Local atomicity 与 external eventual status 分离。 |
| 12 | `03_ddd_step_12_error_recovery.md` | 错误 / 异常 / 恢复 | `completed / pass` | Step 6~11 | Typed errors、mapping、retry ownership、recovery | 37 flow、协议、unknown/blocked、dead-letter 与 consistency defect 已闭合。 |
| 13 | `03_ddd_step_13_concurrency_idempotency.md` | 并发 / 幂等 / 重入 | `completed / pass` | Step 8~12 | Key / digest / replay result / ordering / conflict | Duplicate 与 late material 不分叉 truth。 |
| 14 | `03_ddd_step_14_config_external_binding.md` | 配置引用 / 外部绑定 | `completed / pass` | Step 3~13 | Typed config candidates、builder、dependency binding、Store/UoW/Port fallback、25 config redlines | 配置只影响 infra composition / entries / jobs / projections；25 config redlines 不能被绕过；`L2T-UP-001~009` 仍开放。 |
| 15 | `03_ddd_step_15_observability_audit.md` | 可观测性 / 审计埋点 | `completed / pass; stop review pending user review` | Step 8~14 | Body-free logs / metrics / trace / tool audit cuts、redaction、37-flow closure | Observation 不反写，audit 与 telemetry 分层；`L2T-UP-001~009` unchanged。 |
| 16 | `03_ddd_step_16_test_cuts.md` | 测试切口 / 最小验证 | `completed / pass` | Step 5~15 | 模块、协议、state、transaction、idempotency cuts | 每个关键契约有正 / 负最小入口，不伪造结果。 |
| 17 | `03_ddd_step_17_implementation_handoff.md` | 实施承接 | `completed / pass` | Step 1~16 | 字段 / DTO / Query / state / side effect / phase closure | 通过；不把未闭口项交给实现 agent 选边。 |
| 18 | `03_ddd_step_18_risks_open_questions.md` | 风险与待确认 | `completed / pass` | Step 1~17 | 风险、待确认、blocker、影响、owner、reopen 条件 | 通过；每个未关闭项已有未确认前处理方式。 |
| 18 | `03_ddd_step_18_risks_open_questions.md` | 风险与待确认 | `completed / pass` | Step 1~17 | 设计风险、问题、blocker / reopen 条件 | Open item 有影响、owner、暂停口径。 |
| 19 | `03_ddd_step_19_formal_document_assembly.md` | 正式文档装配 | `completed / pass; stop review` | Step 1~18 | 18 章正式 03、来源索引、全链审计 | 正式 03 已整体重建并通过全链审计；停审等待用户确认进入 04。 |

## 5. 重 Step 小循环主轴

| Step | 小循环单位 | 固定顺序 | 全局收口 |
|---|---|---|---|
| 6 | 工程模块 + 六业务组成部分 | shared vocabulary -> contracts -> 六 domain groups -> application carriers -> infra state -> entries | 字段来源、状态、Step 7 承接。 |
| 7 | module / seam | contracts -> domain policy boundary -> application ports -> infra adapters / stores -> entries | 跨模块 caller / implementer / error / dependency closure。 |
| 8 | protocol family | shared metadata / refs -> Commands -> Queries -> Consumers -> Events -> Jobs -> errors / receipts | DTO construction、Query view、public secondary type closure。 |
| 9 | interface / flow batch | Commands -> Queries -> Consumers -> outbound continuation -> Jobs | Transaction、state、accepted side effect、error / test closure。 |
| 10 | state subject / family | subject screening -> contract -> binding -> invocation -> precondition / handoff -> outcome / audit -> integrity / derived | Naming、trigger、illegal transition、test / acceptance closure。 |

## 6. 开放 blocker 继承

| Blocker | 03 当前允许闭口 | 03 必须保持 blocked |
|---|---|---|
| `L2T-UP-001~002` | Invocation-bound authorization request placeholder、assessment、fail-closed error / negative protocol。 | Owner、source matrix、risk taxonomy、positive decision provider / schema / freshness。 |
| `L2T-UP-003~004` | L2 handoff / source mapping responsibility、local attempt、blocked mapping result、negative tests。 | Concrete Sandbox command / source / receipt / retry / DLQ / cleanup positive path。 |
| `L2T-UP-005~006` | Body-free eligibility、material、route-blocked attempt、unknown observation ref。 | Tools producer / source enum、route、observed result、readiness。 |
| `L2T-UP-007` | Current workspace file / section attribution。 | Frozen commit baseline、immutable upstream assertion。 |
| `L2T-UP-008` | `core-contracts` real package / existing generic types inspection、authority port、missing / conflict error。 | Tools-specific Core package / type / schema / version authority。 |
| `L2T-UP-009` | Server contract、consumer guidance、future client seam。 | Existing SDK tool client / wrapper / compatibility / coverage。 |

## 7. 当前 next_allowed_action

```text
current_document = 03-详细设计.md
document_status = completed / pass; stop review
current_step = Step 19 formal document assembly
current_module = formal_assembly:18_chapter_rebuild_and_chain_audit
gate_status = completed / pass; stop review
gate_reason = formal 03 was rebuilt from historical material and passed the full source/schema/callable/flow/state/store/test/phase-boundary audit; no new upstream blocker was found.
next_allowed_action = wait_for_user_review_before_04
future_step_files_allowed = none until user confirms entry into 04
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
