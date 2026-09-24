# L5-runner 项目设计讨论执行台账

> 创建日期：2026-09-16
> 当前模式：`full-restart + single-agent-serial`
> 当前任务：用户已授权完成全部 `06-验收标准.md`，并进一步授权“完成全部 07”；06 已按 Step 1～15 装配并停审，07 已按 Step 1～13 装配并进入正式停审。
> 实施状态：`not_started`；不实现代码、不执行测试、不提交 commit。
> 历史材料：README、旧 `00/01/02/03/05/06` 仅作 `historical_material` 与冲突扫描输入。

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 | formal_assembly_traceability_boundary_skeletons | completed / pass / formal_stop_review_required | Step 1～13 已独立落盘并自检；正式 07、implementation ledger 和 18 个 planned boundary skeleton 已建立并通过装配审计；实现、环境、baseline、authority 与真实证据仍未建立，等待用户确认是否进入实现移交讨论。 | wait_user_confirmation_for_implementation_handoff | `design-calibration/07_implementation_plan_calibration_flow.md`；`design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | formal_stop_review | Step 17 | 已完成并作为 01 输入 | `RUN-UP-001~008` |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | formal_stop_review | Step 16 | 用户已明确授权进入 02；01 保持只读基线 | `RUN-UP-001~008` |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | formal_stop_review | Step 14 completed | 用户已预授权进入 03；02 保持只读基线 | `RUN-UP-001~008` |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | completed_with_upstream_blockers | Step 19 stop_review_required | 新版正式 03 已完成 full-restart 装配；已作为 04 输入，保持只读基线 | `RUN-UP-001~008` + `RUN-DDD-001~003` + `RUN-DOC-002~003` + `RUN-OPS-001~002` |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | completed_with_upstream_blockers | Step 15 stop_review_required | 正式 04 已 full-restart 装配并通过最终审计；`RUN-DOC-001` 关闭；已作为 05 输入，保持只读基线 | `RUN-UP-001~008` + `RUN-DDD-001~003` + `RUN-DOC-002~003` + `RUN-OPS-001~002` |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | completed_with_upstream_blockers | Step 15 formal_stop_review_required | 正式 05 已 full-restart 装配并通过最终审计；`RUN-DOC-002` 只关闭“新版正式 05 缺失”部分；等待用户 review，不进入 06 | `RUN-UP-001~008` + `RUN-DDD-001~003` + `RUN-DOC-002~003` + `RUN-OPS-001~002`；真实执行 blocked/not_run |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | formal_stop_review_required | Step 15 completed / pass | 正式 06 已 full-restart；按用户“完成全部 07”授权进入下一文档；06 保持只读 | `RUN-UP-001~008` + `RUN-DDD-001~003` + `RUN-DOC-003` + `RUN-OPS-001~002`；实际验收 not_entered |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | formal_stop_review_required | Step 13 completed / formal_stop_review_required | Step 1～13 已独立落盘并自检；正式 07、implementation ledger 和 18 个 planned boundary skeleton 已建立并通过装配审计；实现、环境、baseline、authority 与真实证据仍未建立，等待用户确认是否进入实现移交讨论 | `RUN-DDD-001~003` + `RUN-UP-001~008` + `RUN-OPS-001~002` + `OQ-RUN-016`；`RUN-DOC-003` 文件缺口已关闭但实现仍 blocked |

## 3. 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 写入范围 | active | 只修改 `projects/L5-runner/` 内设计文档、calibration 和台账。 |
| 单 agent 串行 | active | 当前 agent 独立完成；禁止 sub-agent、worker、team 或并行代理。 |
| full-restart | active | 正式文档先删除旧文件再重建；旧材料不自动继承。 |
| 文档顺序 | active | 严格 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`。 |
| Step 顺序 | active | 05 严格 Step 1→15；每 Step 独立文件、独立门禁和 flow 更新。本轮用户已授权完成全部 05，Step 15 后停审。 |
| 不伪造事实 | active | 不伪造实现仓、baseline、commit、run_id、测试、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 不提交 | active | 用户未要求 commit；`commit_required=false`。 |

## 4. 当前上游 blocker / pending

| ID | 内容 | 需求阶段影响 | 当前处理 |
|---|---|---|---|
| `RUN-UP-001` | Artifact 缺完整可下载 Release consumption object、locator/transport、integrity manifest、digest/signature、revoke/expire 合同。 | 不能锁具体下载 API、算法、协议或声称可用。 | 需求只定义显式选择、下载/验证能力与 fail-closed 边界。 |
| `RUN-UP-002` | Governance 未闭合 version/baseline 与 approval/decision 的 authority chain、scope、expiry/revoke/conflict。 | Runner 不能本地判定 approved。 | 未验证即 `pending/blocked`，不得下载或启动。 |
| `RUN-UP-003` | Sandbox Runner-facing DTO、幂等、active lease、断线恢复、orphan/reaper、cleanup handoff 未逐项闭口。 | 正向运行与清理集成仍 blocked。 | 保留 `accepted ≠ running`、guard/lease/cleanup 需求红线。 |
| `RUN-UP-004` | Runtime 端侧安全 read surface、状态/结果引用和恢复语义未形成 Runner 专用合同。 | 不可定义具体 Runtime control 或 outcome 读取协议。 | 只保留正式只读/结果消费边界。 |
| `RUN-UP-005` | Observability 的 safe diagnostic DTO、handoff、visibility/freshness/retention seam 未闭合。 | 不可宣称本地诊断成为 evidence/report。 | 只定义安全摘要和 handoff 需求。 |
| `RUN-UP-006` | Archive 正向消费/恢复与 Runner 协作协议未闭合。 | Archive 不进入启动、运行或清理成功判定。 | 仅保留未来安全引用边界。 |
| `RUN-UP-007` | 跨平台 host resource/port probe、Sandbox allocation 与 cleanup 责任边界未统一。 | 不能固定平台实现或资源数值。 | 需求定义冲突可见、fail-closed 和责任分离。 |
| `RUN-UP-008` | L0-sdk 精确 client version、错误/redaction/trace surface 待核验。 | 不能写具体 SDK 方法或 ready 结论。 | 坚持 SDK-first，exact surface 后置。 |
| `RUN-DDD-001` | 目标实现仓 `/home/aris/Projects/quantalithos-runner` 不存在。 | 无现存 manifest、源码、测试、baseline 或目录偏离可核验。 | 不创建、不伪造；Step 4 只记录计划仓名与阻塞。 |
| `RUN-DDD-002` | 实现语言、runtime、GUI/CLI shell、进程与 packaging 未有正式 authority。 | 无法选择 package/crate/binary 或文件扩展名。 | 不继承 README/旧 03 的 Rust/Tauri；保持 blocked/pending。 |
| `RUN-DDD-003` | 本地 state store、cache/file atomicity、locking/migration/corruption 技术未定。 | 无法定义真实 persistence 目录/schema/backend。 | 只保留 required guarantees，不锁产品。 |
| `RUN-DOC-002` | 新版正式 06 已重建；原“新版正式 05 缺失”部分已关闭。 | 关闭仅代表正式 06 文件存在；不代表 evidence/verdict/signoff/readiness。 | 进入 formal stop review；保持 06 只读。 |
| `RUN-DOC-003` | 正式 07、implementation ledger 与 planned boundary skeleton 的文件缺口已在 07 Step 13 关闭；实现事实、环境和 authority 仍未建立。 | 不能安排真实实现 task、commit 或 readiness。 | 保留 `resolved_for_file_creation; implementation still blocked`；等待用户确认移交且前置 authority 到达。 |
| `OQ-RUN-016` | boundary review、evidence review、risk/disposition owner 尚未确认。 | 不能自行完成独立评审、风险处置或 handoff。 | 保持 `waiting`；等待用户指定或确认相应 owner。 |
| `RUN-OPS-001` | production telemetry、SLO 与 capacity authority 未闭合。 | 不能把测量候选升级为 hard NFR 或 production verdict。 | 05 仅保留 measurement/exploratory 合同；不得写无来源阈值。 |
| `RUN-OPS-002` | 真实跨仓 integration 环境与 GRC 流程未闭合。 | T2～T4、产品/发布测试与 release evidence 不可执行或宣称通过。 | 保持 `blocked/not_run`；semantic fake 不得冒充真实集成或发布证据。 |

## 5. 授权记录

| 日期 | 用户指令 | 授权范围 | 不授权 |
|---|---|---|---|
| 2026-09-16 | “读完 在写” | 完成只读核验并写 draft | 正式 00~07 未自动解锁 |
| 2026-09-16 | “现在开始完成全部 00” | 建立 calibration/ledger，完成 00 Step 1~17、重建正式 00 并停审 | 进入 01、代码、测试、跨项目写入、commit |
| 2026-09-16 | “完成全部 01” | 读取架构 SOP 与上游当前架构，完成 01 Step 1~16、重建正式 01 并停审 | 进入 02、代码、测试、跨项目写入、commit |
| 2026-09-18 | “继续” | 在 01 正式停审后进入 02，建立概要 calibration flow，按 Step 1~14 完成 02 后再次停审 | 进入 03、代码、测试、跨项目写入、commit |
| 2026-09-19 | “现在继续完成到 03 的 step4 完成后” | 连续完成 02 Step 3~14、正式 02；随后建立 03 calibration flow 并完成 Step 1~4 后停审 | 03 Step 5、04~07、代码、测试、跨项目写入、commit |
| 2026-09-19 | “接下来额 03的 step5-step10 请参考 projects/L1-governance 的粒度和框架” | 在保留 Step 4 physical layout blocked 的前提下，按 L1-governance 的 capability → object → port/adapter → protocol → flow → state 递进框架，串行完成 Runner Step 5～10；Step 10 后停审 | 03 Step 11+、正式 03 装配、implementation ledger/boundary skeleton、代码、测试、跨项目写入、commit |
| 2026-09-21 | “完成全部03” | 继续完成 Runner 03 Step 11～19，逐步生成中间产物并在 Step 19 重建正式 `03-详细设计.md`，保留所有上游/物理 blockers；Step 19 后停审 | 04～07、代码、测试、implementation ledger/boundary skeleton、commit |
| 2026-09-22 | “现在完成全部 04” | 建立 04 配置 calibration flow，按 Step 1～15 串行完成配置控制面、分类、来源、profile、配置项、敏感处理、加载、生效、变更、失效、下游承接、迁移和正式装配；Step 15 后停审 | 05～07、代码、测试、implementation ledger/boundary skeleton、commit |
| 2026-09-22 | “完成全部 05” | 建立 05 测试 calibration flow，按 Step 1～15 串行完成输入、范围、切口、分层、追溯、用例、数据、环境、自动化、专项、缺陷、进出、证据、回归和正式装配；Step 15 后停审 | 06～07、代码、测试执行、implementation ledger/boundary skeleton、commit |
| 2026-09-22 | “完成全部06” | 建立 06 验收 calibration flow，按 Step 1～15 串行完成输入、范围、基线、进出、功能、红线、接口、状态一致性、NFR、证据、VETO、缺陷、风险、结论签署和正式装配；Step 15 后停审 | 07、代码、测试执行、implementation ledger/boundary skeleton、commit |
| 2026-09-23 | “完成全部 07” | 在 06 按既有授权完成 Step 7～15 并正式停审后，进入 07，读取实施计划 SOP/规范，完成全部 calibration 与正式 `07-实施计划.md`；正式 07 完成时创建 implementation ledger 和全部 planned boundary skeleton，保持 planned/blocked/waiting | 代码实现、测试执行、伪造实现仓/baseline/commit/run_id/artifact/report/evidence/verdict/signoff/readiness、commit |

## 6. 当前门禁

```text
current_document = 07-实施计划.md
current_step = 13
current_module = formal_assembly_traceability_boundary_skeletons
gate_status = completed / pass / formal_stop_review_required
gate_reason = 正式 07 已按 13 章主链 full-restart 装配；每章均有具体 calibration 来源，phase/boundary/gate/测试验收分母通过交叉审计，implementation ledger 与 18 个 planned boundary skeleton 已建立并保持 planned/blocked/waiting。当前仍无实现仓、技术 authority、baseline、commit、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。
formal_status = formal_stop_review_required
technology_decision_status = blocked_pending_authority
acceptance_lifecycle = not_entered
actual_verdict = none
next_allowed_action = wait_user_confirmation_for_implementation_handoff
formal_00_write_allowed = completed
formal_01_write_allowed = completed
formal_02_write_allowed = completed
formal_03_write_allowed = completed
formal_04_write_allowed = completed_formal_stop_review
formal_05_write_allowed = completed
formal_06_write_allowed = completed_read_only
formal_07_write_allowed = completed_for_step_13_only
implementation_ledger_allowed = completed_for_step_13_only
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
physical_layout_gate = blocked
logic_contract_authorization = step_05_to_19
config_design_authorization = step_01_to_15
test_plan_authorization = step_01_to_15
acceptance_design_authorization = completed_step_01_to_15
implementation_plan_authorization = user_authorized_2026-09-23
current_document_flow = design-calibration/07_implementation_plan_calibration_flow.md
current_step_file = design-calibration/07_implementation_plan_step_13_formal_document_assembly.md
```

## 7. Step 10 最小回写记录

| 修正 ID | 文件 | 最小回写 | 目的 |
|---|---|---|---|
| `RUN-S6-FIX-013` | `design-calibration/03_ddd_step_06_object_contracts.md` | `RunnerJobDisposition` 增加 `Blocked`；`RunnerOperationsJobResult` 增加 `blocked(...)` factory | 保持已有 Blocked job report 的 domain/result 映射无损且穷尽 |
| `RUN-S8-FIX-006` | `design-calibration/03_ddd_step_08_protocol_contracts.md` | `RunnerProtocolJobDisposition` 增加 `Blocked` | 与 Step 6 的 job disposition、public protocol surface 和 Step 9 terminal mapping 对齐 |
| `RUN-S9-FIX-001` | `design-calibration/03_ddd_step_09_function_flows.md` | 固定 Job report `Blocked -> Blocked` terminal mapping，禁止压成 `Partial/Failed` | 防止可信 Blocked 被改写为其他语义，也不把 entry Completed 升级为业务成功 |

05 Step 1～15 与正式 `05-测试方案.md` 已完成并作为只读验收输入。06 Step 1～15 已完成，正式 06 已 full-restart 装配并停审；07 Step 1～13 与正式 `07-实施计划.md` 已完成并进入正式停审。`RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-OPS-001~002`、`OQ-RUN-016` 持续开放；`RUN-DOC-003` 仅关闭文件缺口，implementation 仍 blocked；实际验收为 `not_entered`，无 verdict。当前不实现代码、不执行项目测试、不提交 commit；implementation ledger/boundary skeleton 已创建但保持 planned/blocked/waiting，后续仅待用户确认实现移交讨论。
