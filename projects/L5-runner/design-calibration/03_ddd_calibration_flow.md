# L5-runner 03 详细设计校准流程

> 创建日期：2026-09-19
> 当前模式：`full-restart + single-agent-serial`
> 正式文档目标：`projects/L5-runner/03-详细设计.md`
> 本轮授权：在保留 Step 4 物理布局阻塞的前提下，完成逻辑实现契约 Step 5～18，并在 Step 19 装配正式 `03-详细设计.md`；用户要求 Step 5～19 参考 `projects/L1-governance` 的粒度和框架。Step 19 完成后停审。
> 最终状态：`completed_with_upstream_blockers`；正式 03 已装配完成，当前停在用户 review gate，不进入 04。
> 直接上游：本仓正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
> 历史材料：本仓 README、旧正式 `03/05/06` 与 `draft/` 只作 `historical_material` / 后置冲突扫描输入。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 19 | `formal_document_assembly:full_restart_and_traceability_audit` | stop_review_required | Step 1～18 校准结论已按 full-restart 装配为正式 `03-详细设计.md`；18 章、来源回指、计数和历史冲突扫描完成。保留 `RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-DOC-001~003`、`RUN-OPS-001~002`；`RUN-DDD-004` 已解决为“正式 03 已装配”。 | wait_for_user_review_before_04 | Step 1～19；设计真相源闭环标准；详细设计书写规范；Step 19 装配审计 |

## 2. 执行纪律

- 只修改 `projects/L5-runner/` 下的设计文档、calibration 中间产物和项目台账。
- 当前 agent 独立串行完成；禁止创建、调用或委派 sub-agent、worker、team 或并行代理。
- 严格执行 `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07`；本 flow 只处理 03。
- 本轮严格执行 Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8 → Step 9 → Step 10 → Step 11 → Step 12 → Step 13 → Step 14 → Step 15 → Step 16 → Step 17 → Step 18 → Step 19；每一步到达时才创建对应文件，每步独立自检和更新台账。Step 5～19 只推进设计契约，不解除 Step 4 的物理布局 blocker；Step 19 后停审。
- Step 1～18 不修改正式 `03-详细设计.md`；只有完整完成 Step 19 才允许先删除旧文件并重建。当前用户已授权 Step 11～19，但在 Step 19 前旧正式 03 必须保持不动。
- README、旧正式 03 和 draft 必须在独立判断形成后才用于冲突扫描；Rust、Tauri、Electron、Docker、gVisor、Firecracker、SQLite、进程模型和旧目录不得自动继承。
- 没有真实目标实现仓、正式语言/runtime authority 或可核验 package/crate 时，不得伪造 repo、manifest、crate、package、binary、path dependency 或源码文件。
- `RUN-UP-001~008` 只允许 required seam、blocked/not-ready/unknown 路径和本地负向闭环；不得宣称正向 adapter 或 integration ready。
- 不实现代码、不创建 implementation ledger/boundary skeleton、不执行测试、不生成 baseline/run/artifact/report/evidence/verdict/signoff/readiness、不提交 commit。

## 3. 总流程计划与状态台账

| Step | 主题 | 主要输入 | 输出文件 | 前序门禁 | 状态 | gate_status | 完成门禁 / 当前原因 | next_allowed_action |
|---:|---|---|---|---|---|---|---|---|
| 1 | 确认概要设计输入边界 | 正式 00/01/02，02 §12～§13，详细设计 SOP/规范 | `03_ddd_step_01_hld_input_boundary.md` | 正式 02 已停审；用户授权至 Step 4 | completed | pass | 上游映射、不再回答/必须回答、输入不足风险与回退边界齐全 | 开始 Step 2 |
| 2 | 明确本轮实现范围和非范围 | Step 1，02 §2/§4～§12 | `03_ddd_step_02_implementation_scope.md` | Step 1 pass | completed | pass | 实现目标、覆盖面、非范围、授权边界和 blocker 限制齐全 | 开始 Step 3 |
| 3 | 收稳语言/runtime/仓库约束 | Step 2，编码/目录/依赖规范，真实 sibling repos/manifests | `03_ddd_step_03_language_runtime_repository_constraints.md` | Step 2 pass | completed_with_pending | pass | 确定约束与 blocked 技术决定已分离；无历史继承或依赖误分类 | 进入 Step 4 布局门禁评估 |
| 4 | 收稳实现单元与文件布局 | Step 2/3，02 代码主体，真实目标仓证据 | `03_ddd_step_04_implementation_units_file_layout.md` | Step 3 允许 blocked assessment | completed_blocked_stop_review | blocked | logical units 已映射；physical layout 因 `RUN-DDD-001~003/RUN-UP-008` 无法满足真实路径门禁 | 停审，等待用户与 authority |
| 5 | 定义模块实现契约主轴 | Step 4 | `03_ddd_step_05_module_contracts_axis.md` | 用户明确授权逻辑继续；Step 4 physical layout may remain blocked | completed_logic_blocked | blocked | 七个逻辑模块、依赖方向、业务映射和边界已闭合；物理布局不变 | 开始 Step 6 |
| 6 | 逐模块定义对象实现契约 | Step 5 | `03_ddd_step_06_object_contracts.md` | Step 5 logic pass | completed_with_upstream_blockers | pass_for_logic | 17/17 正式对象、支撑对象、字段/状态闭环和 Step 7～10 反查已完成；未伪造路径/owner schema | 开始 Step 7 |
| 7 | 逐模块定义 Trait/Port/Adapter | Step 5/6 | `03_ddd_step_07_trait_port_adapter_contracts.md` | Step 6 logic pass | completed_with_upstream_blockers | pass_for_logic | 七模块、14 required ports、repositories/facades、跨接缝审计已完成；exact adapter仍blocked | 开始 Step 8 |
| 8 | 定义协议契约 | Step 6/7 | `03_ddd_step_08_protocol_contracts.md` | Step 7 logic pass | completed_with_upstream_blockers | pass_for_step_09_logic | 11/12/4/0/5 协议族和 public DTO/secondary types 已闭合；exact owner schema、consumer positive payload、transport 与物理实现仍 blocked | 读取 Step 9 SOP/规范及 L1-governance Step 9，创建 Step 9 |
| 9 | 定义逐接口函数级处理流 | Step 6～8 | `03_ddd_step_09_function_flows.md` | Step 8 pass_for_step_09_logic | completed_with_upstream_blockers | pass_for_step_10 | 32/32 flow 与 0 outbound residue 完成；跨 flow 事务、状态、幂等、phase、truth-owner 审计通过；保留上游与物理实现 blockers | 读取 Step 10 SOP/规范及 L1-governance Step 10 |
| 10 | 定义状态机与转换矩阵 | Step 6/9 | `03_ddd_step_10_state_matrix.md` | Step 9 pass_for_step_10 | completed_with_upstream_blockers | pass_for_step_11 | Step 10.1～10.6、单机停审、跨状态副作用/forbidden/reserved/truth-owner/命名触发测试切口审计完成；保留 `RUN-UP-001~008`、`RUN-DDD-001~003` | 创建 Step 11 持久化/事务/一致性中间产物 |
| 11 | 定义持久化/事务/一致性 | Step 6～10 | `03_ddd_step_11_persistence_consistency.md` | Step 10 pass_for_step_11 + user authorization | completed_with_upstream_blockers | pass_for_step_12 | logical store、repository、version、UoW、projection/idempotency consistency 完成；physical backend 保持 blocked | 创建 Step 12 错误模型与恢复中间产物 |
| 12 | 定义错误与恢复 | Step 9～11 | `03_ddd_step_12_error_recovery.md` | Step 11 pass_for_step_12 | completed_with_upstream_blockers | pass_for_step_13 | 错误层级、public mapping、异常分支、Unknown/Blocked/Conflict 恢复口径完成；exact SDK/transport mapping 保持 blocked | 创建 Step 13 并发/幂等/重入中间产物 |
| 13 | 定义并发/幂等/重入 | Step 9～12 | `03_ddd_step_13_concurrency_idempotency.md` | Step 12 pass_for_step_13 | completed_with_upstream_blockers | pass_for_step_14 | 并发资源、幂等键/digest、duplicate/in-flight/conflict、commit unknown、重入保护和 future test cuts 完成 | 创建 Step 14 配置引用与外部依赖绑定中间产物 |
| 14 | 定义配置引用与依赖绑定 | Step 3/7/11～13 | `03_ddd_step_14_config_dependencies.md` | Step 13 pass_for_step_14 | completed_with_upstream_blockers | pass_for_step_15 | 配置读取点、adapter/port/fake 绑定、compile/runtime/event 分类、禁止配置化边界完成；exact product/default 留待 04 | 创建 Step 15 可观测性与审计中间产物 |
| 15 | 定义可观测性与审计埋点 | Step 8～14 | `03_ddd_step_15_observability_audit.md` | Step 14 pass_for_step_15 | completed_with_upstream_blockers | pass_for_step_16 | 安全日志、低基数指标、trace、local audit、handoff、redaction/forbidden boundary 完成；backend/SLO 保持 pending | 创建 Step 16 测试切口与最小验证清单 |
| 16 | 定义测试切口 | Step 5～15 | `03_ddd_step_16_test_slices.md` | Step 15 pass_for_step_16 | completed_with_upstream_blockers | pass_for_step_17 | 七模块、32 条 protocol/flow、21 状态主语、持久化/幂等/错误/配置/观测及脚本语义切口已完成；不执行测试、不伪造结果 | 创建 Step 17 实施承接清单 |
| 17 | 收口实施承接 | Step 1～16 | `03_ddd_step_17_implementation_handoff.md` | Step 16 pass_for_step_17 | completed_with_upstream_blockers | pass_for_step_18 | 实施前置阅读、字段/DTO/Query/状态/metadata/幂等/projection/artifact/phase 预复核完成；不定义 phase、commit 或实现仓 | 创建 Step 18 风险与待确认中间产物 |
| 18 | 风险与待确认 | Step 1～17 | `03_ddd_step_18_risks_open_questions.md` | Step 17 pass_for_step_18 | completed_with_upstream_blockers | pass_for_step_19 | 风险按实现、生产/验收、下游文档分层；待确认方和未确认前处理已登记；未新增设计事实 | 创建并完成 Step 19 正式详细设计装配审计 |
| 19 | 正式详细设计装配 | Step 1～18 | `03_ddd_step_19_formal_document_assembly.md` | Step 18 pass_for_step_19 + 用户“完成全部03”授权 | completed_with_upstream_blockers | stop_review_required | 旧正式文件已 full-restart 替换；18 章正文、来源回指、计数和历史冲突扫描完成；物理布局与上游 blockers 保留 | wait_for_user_review_before_04 |

## 4. 当前稳定输入

| 输入 | 当前用途 | 使用上限 |
|---|---|---|
| 正式 `00-需求文档.md` | 提供能力闭环、业务规则、ownership、验收红线和 `RUN-UP-001~008` | 不在 03 重写需求或把验收写成测试通过。 |
| 正式 `01-架构设计.md` | 提供六个语义方向、依赖分层、运行角色、数据所有权、多轴状态与 ADR | 语言、桌面壳、进程、存储和协议仍未选择。 |
| 正式 `02-概要设计.md` | 提供六个组成部分、17 对象、11 Command、12 Query、4 planned Consumer、5 Job、14 required port、处理流/状态/异常/配置轮廓 | 03 只能展开，不得改变主语或新增 outbound event；需要改变时回退 02。 |
| 指定 L0～L4 owner 当前正式设计与必要台账 | 核验 truth owner、公开 seam 和上游成熟度 | 不凭文档名称猜 Runner-facing exact DTO/API/event。 |
| 详细设计 SOP、书写规范、Rust 编码规范、目录组织规范 | 规定 19 Step、实现契约和真实路径门禁 | Rust 规范不构成 Runner 已选择 Rust 的 authority。 |

## 5. 持续 blocker / pending

| ID | 当前状态 | 对 03 的影响 | 未关闭时口径 |
|---|---|---|---|
| `RUN-UP-001` | blocked | Artifact locator/manifest/integrity adapter、材料协议 | 只定义 required semantic seam 和失败路径。 |
| `RUN-UP-002` | blocked | Governance authority chain 与资格门禁 | 不本地批准；不可验证即 blocked。 |
| `RUN-UP-003` | blocked | Sandbox request/control/lease/cleanup/reconcile | accepted≠running；unknown 不重放。 |
| `RUN-UP-004` | blocked | Runtime status/result/recovery safe view | 无正式 ref/view 即 unknown。 |
| `RUN-UP-005` | blocked | diagnostic/handoff/receipt | 本地摘要和 receipt 非 evidence。 |
| `RUN-UP-006` | blocked/peripheral | Archive 安全引用 | 不进入核心成功判断。 |
| `RUN-UP-007` | blocked | 跨平台 resource/allocation/cleanup 责任 | local observation 与 owner truth 分离。 |
| `RUN-UP-008` | pending | SDK exact client/error/redaction/trace surface | SDK-first；exact mapping 不得猜测。 |
| `RUN-DDD-001` | blocked | 目标实现仓 `/home/aris/Projects/quantalithos-runner` 不存在 | 不伪造现有 manifest/source/baseline。 |
| `RUN-DDD-002` | pending | 语言、runtime、GUI/CLI shell、进程模型、存储未有正式 authority | Step 3 重新核验；不得从 README/旧 03 继承。 |

## 6. 当前权限与真实性门禁

```text
current_document = 03-详细设计.md
current_step = 19
current_module = formal_document_assembly:full_restart_and_traceability_audit
gate_status = stop_review_required
formal_status = completed_with_upstream_blockers
technology_decision_status = blocked_pending_authority
next_allowed_action = wait_for_user_review_before_04
formal_03_write_allowed = completed
formal_04_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

logic_contract_authorization = step_05_to_19

Step 10 已经用户明确授权后解除停审；用户随后授权完成全部 03，Step 11～18 已完成，Step 19 已按 full-restart 装配正式 03 并完成来源与历史冲突审计。当前停在 03 review gate；不进入 04，不创建 implementation ledger/boundary skeleton，不实现代码、不执行测试、不提交 commit。
