# L2-member 05 测试方案校准流程

> 目标正式文档：`projects/L2-member/05-测试方案.md`
> 适用 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 适用书写规范：`standards/document/测试方案书写规范.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_calibration_flow.md`
> 创建日期：2026-09-03
> 执行模式：`full-restart + single-agent-serial`
> 当前状态：Step 1～15 已按用户“继续完成全部 05”授权完成；正式 `05-测试方案.md` 已装配并停审，等待用户确认后才能进入 `06`。

## 1. 文档级恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|
| `05-测试方案.md` | Step 15：整理正式测试方案文档已完成 | `formal-document-assembly` | `completed / pass_with_upstream_and_design_blockers / stop_review` | 15 章正文已按 Step 1～14 装配；来源、编号、历史污染、phase、依赖和非伪造静态审计完成。 | 等待用户审查；未经新确认不得创建 `06-验收标准.md` Step 1 | `project_execution_ledger.md`;`05_test_plan_step_01_input_boundary.md`~`15_formal_document_assembly.md`;`测试方案书写规范.md` |

## 2. 本轮目标

按测试方案 SOP，将当前正式 `00/01/02/03/04` 已收稳的需求、架构、概要、详细设计和配置输入转译为可执行、可追溯、可留证的测试方案。正式 `05-测试方案.md` 只能在 Step 15 由 Step 1～14 中间产物装配生成。

本轮坚持以下顺序：

```text
输入边界
  -> 测试目标 / 范围
  -> 测试对象 / 切口
  -> 分层策略
  -> 追溯矩阵
  -> 场景 / 用例
  -> 数据
  -> 环境 / 配置
  -> 自动化门禁
  -> 专项验证
  -> 缺陷 / 进出准则
  -> 证据归档
  -> 回归 / 残余风险
  -> 正式 05 装配
```

## 3. 权威输入与效力

| 输入 | 权威级别 | 本轮用途 | 限制 |
|---|---|---|---|
| `standards/document/测试方案讨论流程_SOP.md` | normative authority | 决定 Step 1～15 顺序、问题、输出和停审门禁 | 不产生项目业务结论 |
| `standards/document/测试方案书写规范.md` | normative authority | 决定正式 15 章结构、编号、artifact / report / evidence 路径和闭环要求 | 不替代上游设计契约 |
| `standards/document/设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md` | normative authority | 决定 full-restart、三层台账、先思考后写入、事实等级和可落码审计 | 不补项目 schema |
| `standards/document/全局项目依赖关系与裁剪规则.md` | normative authority | 决定 compile / runtime / event / ref / adapter / fake 分类及 sibling 只读纪律 | 不决定具体测试产品 |
| `projects/L2-member/00-需求文档.md` | current formal requirement | FR / BR / NFR、能力闭环、数据归属、AC / VF 和非目标 | 不由测试方案重定义 |
| `projects/L2-member/01-架构设计.md` | current formal architecture | owner、BC01～BC07、依赖方向、通信 / 一致性与架构红线 | 不由测试方案重新选架构 |
| `projects/L2-member/02-概要设计.md` | current formal HLD | CP01～CP07、对象 / API 骨架、处理流、状态和异常轮廓 | 不由测试方案新增主要组成部分 |
| `projects/L2-member/03-详细设计.md` | current formal DDD | 模块、对象、协议、函数流、状态、事务、错误、幂等、配置、观测和 planned test cut | 受 `L2M-DDD-*` / scope gap 约束 |
| `projects/L2-member/design-calibration/03_ddd_step_16_test_cuts.md` | direct calibration input | 最小测试切口、协议分母、状态 / 一致性 / redaction cut | 只提供 planned cut，不表示执行结果 |
| `projects/L2-member/04-配置设计.md` | current formal configuration | profile、source priority、校验、生效、敏感 / redaction、失效、fake / blocked parity 和下游承接 | 不把配置结论扩展为测试结果 |
| `projects/L2-member/design-calibration/04_config_step_12_downstream_handoff.md` | direct calibration input | 05 应承接的配置测试面和 blocker 传递方式 | 只提供 planned input |
| `projects/L2-member/05-测试方案.md` | historical material | 识别旧测试对象、状态、路径和编号污染 | 不得继承正文、编号或执行结论 |
| `projects/L2-member/06-验收标准.md` | historical / direction input | 识别未来验收需要消费的证据方向 | 不作为当前 AC / verdict authority；`00` AC / VF 为当前需求方向 |
| `projects/L2-runtime/00~07`、`projects/L2-tools/00~07` | current upstream | Runtime loop / context / plan / outcome 与 Tools action / safe-view owner boundary | 只测 member 接缝，不测对方内部 truth |
| `projects/L0-core`、`projects/L0-bus`、`projects/L0-sdk` | current foundation | shared primitive / event collaboration / SDK boundary | 仅 Core 为 compile candidate；Bus / SDK 不成为 package dependency |
| `projects/L1-work`、`projects/L1-identity`、`projects/L1-governance`、`projects/L1-conversation`、`projects/L1-artifact` | current truth input / granularity reference | project subject、identity anchor、policy effective、body-free conversation / artifact boundary | 不吸收 foreign truth；`L1-governance` 仅作粒度参考 |
| `projects/L2-member-service`、`projects/L2-member-images` | sibling current / explicitly citable material | host collaboration 与 image supply 的 owner 方向 | exact contract / release / credential / compatibility / readiness 保持 pending |

## 4. Step 总流程与门禁

| Step | 主题 | 中间产物 | 当前状态 | 进入条件 | 完成条件 |
|---:|---|---|---|---|---|
| 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | `[x] completed / stop_review` | 用户确认进入 05；04 已停审 | 输入映射、不可回答问题、测试必须回答问题、历史隔离和 blocker 影响已记录 |
| 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | `[x] completed / stop_review` | Step 1 stop_review + 用户确认 | P0/P1/P2、范围 / 非范围和一票否决关联收稳 |
| 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | `[x] completed / stop_review` | Step 2 pass + 本轮用户授权 | P0 对象、切口、设计来源和切口停审完成 |
| 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | `[x] completed / stop_review` | Step 3 pass | 分层图和分层表覆盖全部 P0 切口 |
| 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | `[x] completed / stop_review` | Step 4 pass | P0 需求 / 规则双向追溯无空洞或显式进入风险 |
| 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | `[x] completed / stop_review` | Step 5 pass | P0 用例有前置、断言、负向、边界、phase 和证据候选 |
| 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | `[x] completed / stop_review` | Step 6 pass | fixture / builder / seed、隔离和清理可重复 |
| 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | `[x] completed / stop_review` | Step 7 pass | local / CI / integration-like / operations-replay 与依赖类型可定位 |
| 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | `[x] completed / stop_review` | Step 8 pass | suite、script、阻断级别、artifact / report 映射完整 |
| 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | `[x] completed / stop_review` | Step 9 pass | 性能、安全、一致性、恢复、观测和审计验证方式有来源 |
| 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | `[x] completed / stop_review` | Step 10 pass | S/A/B 分级、复验和证据要求可判定 |
| 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | `[x] completed / stop_review` | Step 11 pass | 进入 / 退出条件无模糊谓词 |
| 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | `[x] completed / stop_review` | Step 12 pass | EV、artifact、report、redaction 和 AC 引用闭环 |
| 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | `[x] completed / stop_review` | Step 13 pass | 变更触发、未覆盖风险和接受人 / 待确认项明确 |
| 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | `[x] completed / stop_review` | Step 1～14 完成且用户授权装配 | 固定 15 章、来源入口、静态审计和停审完成 |

## 5. 固定执行纪律

- 每个 Step 独立生成中间产物；每个 Step 完成后停审，未经用户确认不得创建下一 Step 文件。
- 正式 `05-测试方案.md` 已在 Step 15 按 full-restart 重建；旧文件只作 historical / pollution audit。
- 每个 P0 测试切口完成后单独停审；所有切口完成后做跨切口、命名、phase、证据和依赖审计。
- 所有测试对象、字段、状态、协议、错误和证据候选必须回指正式 `00~04` 或明确校准文件；测试方案不得补实现契约。
- `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 和 `L2M-UP-005` 下 24 个 outbound semantic candidates 保持 blocker / blocked-aware 语义。
- `Blocked` / `Waiting` / `Unknown` / `Stale` / `Gap` / `NotAvailable` 只能作为安全测试预期；不得被写成 external success、evidence、verdict 或 readiness。
- 原始机器证据、报告、验收交接和脚本路径已在 Step 13 规划；本轮仍不创建 artifacts、reports、scripts 或执行记录。
- 只修改 `projects/L2-member/`；不实现代码、不修改 sibling、不运行测试或验收、不提交 commit。

## 6. 持续 blocker 与测试姿态

| blocker | 影响测试设计的范围 | 当前测试姿态 |
|---|---|---|
| `L2M-UP-001` | host request / signal / report、acceptance / session / health exact contract | member-local formation、拒绝和 unavailable 可设计；positive host qualification blocked |
| `L2M-UP-002` | pinned component release、entry、manifest / compatibility | ref / availability / blocked cut 可设计；release / assembly qualification blocked |
| `L2M-UP-003` | member inbound 到 Runtime formal trigger mapping | controlled delivery、拒绝、waiting / blocked cut 可设计；positive Runtime admission blocked |
| `L2M-UP-004` | Runtime safe handoff source family 与 outbound / observation route | source gate、body-free、attempt / gap negative cut 可设计；positive handoff blocked |
| `L2M-UP-005` | member-specific Core / Bus schema、route、24 candidate | zero-materialization / blocked boundary cut；不得测试 Event publisher / outbox / delivery |
| `L2M-UP-006` | credential / identity anchor exact contract | missing / unverifiable / conflict fail-closed cut；positive credential proof blocked |
| `L2M-UP-007` | screening taxonomy / policy safe result | unknown / stale / conflict conservative cut；positive taxonomy qualification blocked |
| `L2M-UP-008` | non-project / personal execution subject | project double-anchor cut；non-project extension remains rejected / future |
| `L2M-DDD-001~007` | target repo、physical Store、receipt、CP04~CP07 helper / version | logical / fake / negative cuts may be designed；affected positive execution or durability claims blocked |
| `scope_supersede_gap` | `ReplaceSubscriptionScope` successor helper | invalid / blocked lane only；不得用 Store save 模拟 transition |

## 7. 当前 next_allowed_action

```text
current_document = 05-测试方案.md
current_step = Step_15_formal_document_assembly_completed_stop_review
current_module = formal-document-assembly
gate_status = completed / pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = wait_for_user_confirmation_before_entering_06
formal_05_write_allowed = completed
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 8. Step 2 completion and stop-review update (2026-09-03)

用户以“继续”确认进入 Step 2。已按测试方案 SOP Step 2、书写规范 §5.2 与 `L1-governance` 同粒度材料，完成测试目标、P0/P1/P2 优先级、范围 / 非范围、下游接缝边界、残余风险和一票否决关联收敛。P0 以 member-local truth、fail-closed、安全暴露、状态 / 一致性、配置和观测最小契约为核心，并保留 `03` 的 10 / 16 / 14 / 24 / 5 分母与 28 个状态主语；P1 仅在 owner contract / product authority 闭合后验证 real-like 接缝；P2 只保留外围增强、生产容量和深度集成。所有 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 及 `L2M-UP-005` 下 24 个 candidate blocker 保持开放。未发现需回写 `00~04` 的新契约；未创建测试对象 / 用例 / 数据 / 环境 / CI / evidence，也未运行测试。

```text
step_02 = completed
gate_status = pass_with_explicit_blockers / stop_review
next_allowed_action = wait_for_user_confirmation_before_create_step_03_test_objects_cuts
formal_05_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
