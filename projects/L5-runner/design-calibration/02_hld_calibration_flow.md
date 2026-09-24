# L5-runner 02 概要设计校准流程

> 创建日期：2026-09-18
> 当前模式：`full-restart + single-agent-serial`
> 正式文档目标：`projects/L5-runner/02-概要设计.md`
> 直接上游：`projects/L5-runner/00-需求文档.md`、`projects/L5-runner/01-架构设计.md`
> 历史材料：本仓 README、旧 `02/03/05/06` 与 `draft/` 只作 `historical_material` / 后置差异审计输入。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 | `formal_assembly:self_reviewed` | pass | 旧正式 02 已删除并按新版 14 章 full-restart 重建；章节、术语、对象/接口/流程/状态、blocker 与历史污染审计通过。 | `enter_03_step_01_under_existing_user_authorization` | `project_execution_ledger.md`；本 flow；`02_hld_step_14_formal_document_assembly.md`；正式 `02-概要设计.md` |

## 2. 执行纪律

- 只修改 `projects/L5-runner/` 下的正式设计文档、calibration 中间产物和项目台账。
- 当前 agent 独立串行完成；不创建、调用或委派任何 sub-agent、worker、team 或并行代理。
- 严格执行 `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07`；本 flow 只处理 02，完成后立即停审。
- Step 1～13 不修改正式 `02-概要设计.md`；Step 14 才先移除旧文件、再按新版 14 章主链重建。
- 每个 Step 只在到达时创建，保留问题回答、诊断、改动前后、取舍、结构化产物、回填草稿、待确认事项和进入下一步条件。
- Step 5～9 按主要组成部分逐个完成 capability、对象、接口、处理流和状态小循环；每部分停审后再做跨部分闭环审计。
- 正式 02 只承载收口结论；过程、排除理由和冲突扫描保留在 calibration。
- 概要层可以点名正式对象、命令、查询、逻辑页面、port/adapter、字段和函数骨架；不得写完整 schema、DDL、源码目录、实现代码或真实运行参数。
- 所有跨域 exact surface 在 owner 合同未闭合时保持 `planned / blocked / waiting`；fake、ACK、HTTP 200、PID、端口、本地日志或 toast 不证明真实集成或成功。
- 不实现代码、不执行测试、不创建 implementation ledger/boundary skeleton、不提交 commit。

## 3. 总流程计划及状态台账

| Step | 主题 | 主要输入 | 输出文件 | 前序门禁 | 状态 | 当前模块 | gate_status | 完成门禁 / 原因 | next_allowed_action |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | 正式 00/01、专项上游正式设计与必要台账 | `02_hld_step_01_upstream_boundary.md` | 用户授权进入 02 | completed | self_reviewed | pass | 已明确可承接、不可承接、本文不再回答/必须回答及 blocker 影响 | 读取并开始 Step 2 |
| 2 | 设计目标与当前范围 | Step 1、正式 00 §4/9/15、01 §14/15 | `02_hld_step_02_goals_scope.md` | Step 1 pass | completed | self_reviewed | pass | 已明确代码主体、组成部分、入口、对象、接口、流程、状态和下游交接目标；非范围、设计深度及 blocker 限制已收稳 | 读取并开始 Step 3 |
| 3 | 约束条件 | Step 1～2、正式 00 §10～13、01 §8～13 | `02_hld_step_03_constraints.md` | Step 2 pass | completed | self_reviewed | pass | 影响代码主体、对象、接口、流程、状态、异常与配置的硬约束已收稳；未混入实现产品或无来源数字 | 读取并开始 Step 4 |
| 4 | 代码主体框架 | Step 2～3、正式 01 §6～11 | `02_hld_step_04_code_subject_framework.md` | Step 3 pass | completed | self_reviewed | pass | 两张必画图、六个候选组成部分、实现分层、shared boundary 与关键判断已收稳 | 读取并开始 Step 5 |
| 5 | 主要组成部分与边界 | Step 4、正式 00 能力闭环、01 子域/数据/交互 | `02_hld_step_05_components_boundary.md` | Step 4 pass | completed | self_reviewed | pass | 六部分 capability/对象候选/接缝/非职责均停审，跨部分无 unresolved 冲突 | 读取并开始 Step 6 |
| 6 | 关键对象 | Step 5 对象候选池 | `02_hld_step_06_key_objects.md` | Step 5 pass | completed | self_reviewed | pass | 17 对象逐部分正式化；字段/函数/状态/禁止事项与 flow/state 反查无冲突 | 读取并开始 Step 7 |
| 7 | API / 接口骨架 | Step 5～6、上游公开接缝边界 | `02_hld_step_07_api_interface_skeleton.md` | Step 6 pass | completed | self_reviewed | pass | 六部分接口、读写类别、对象承接、metadata/idempotency 与 required-port readiness 已收稳 | 读取并开始 Step 8 |
| 8 | 关键处理流 | Step 5～7 | `02_hld_step_08_processing_flows.md` | Step 7 pass | completed | self_reviewed | pass | 六部分 P0 Command、planned Consumer、一致性 Job、复杂 Query 与事务/unknown 出口已收稳 | 读取并开始 Step 9 |
| 9 | 状态机与状态流转 | Step 6～8 | `02_hld_step_09_state_machine.md` | Step 8 pass | completed | self_reviewed | pass | 多轴状态、owner 投影、允许/禁止迁移、触发与传播已收稳；材料/保护混轴已回填修正 | 读取并开始 Step 10 |
| 10 | 异常与边界场景 | Step 8～9、正式 00 验收红线 | `02_hld_step_10_exceptions_boundaries.md` | Step 9 pass | completed | self_reviewed | pass | 关键异常、crash window、状态出口、保护和安全降级边界已收稳 | 读取并开始 Step 11 |
| 11 | 配置影响轮廓 | Step 4～10、正式 01 横切约束 | `02_hld_step_11_configuration_impact.md` | Step 10 pass | completed | self_reviewed | pass | 配置影响、direct/indirect consumption、禁止配置化边界及 03/04 交接已收稳 | 读取并开始 Step 12 |
| 12 | 详细设计承接清单 | Step 4～11 | `02_hld_step_12_detailed_design_handoff.md` | Step 11 pass | completed | self_reviewed | pass | 模块、17 对象、接口/ports、页面、流程、状态、事务恢复、配置、测试/证据与回退规则已交接 | 读取并开始 Step 13 |
| 13 | 风险与待确认事项 | Step 4～12、blocker 台账 | `02_hld_step_13_risks_open_questions.md` | Step 12 pass | completed | self_reviewed | pass | 风险与待确认已分离，影响/处置/source/挂起口径与 03 限制已收稳 | 读取并开始 Step 14 |
| 14 | 正式文档装配 | Step 1～13、概要书写规范 | `02_hld_step_14_formal_document_assembly.md` | Step 13 pass | completed | self_reviewed | pass | 旧正式 02 已删除并按新版 14 章重建，装配与真实性审计通过，正式停审 | 依据用户预授权进入 03 Step 1 |

## 4. 稳定输入与使用口径

| 输入 | 当前定位 | 本轮使用方式 |
|---|---|---|
| 本仓正式 `00-需求文档.md` | current formal requirement baseline | 提供 `CP-RUN-01~05`、`FR-RUN-001~016`、规则、数据、验收和 blocker；不在 02 重写需求。 |
| 本仓正式 `01-架构设计.md` | current formal architecture baseline | 提供六个语义上下文、运行承载、依赖方向、数据所有权、多轴状态与 ADR；转译为可实现骨架。 |
| `L0-sdk` 当前正式设计 | official access boundary input | 只承接 SDK-first、错误/redaction/trace 与 adapter 隔离；exact client surface 仍受 `RUN-UP-008` 控制。 |
| `L1-artifact` 当前正式设计与项目台账 | Release/Artifact owner input | 只承接 Artifact/version/baseline/integrity owner 边界；不据名称猜 Runner 消费 DTO。 |
| `L1-work`、`L1-workspace` 当前正式设计与必要台账 | project context / safe view inputs | 只承接 context/ref/visibility/no-write；不推断 ProjectMember 或项目状态。 |
| `L1-governance` 当前正式设计 | approval/decision owner input | 只承接 applicable decision/approval 边界；不本地批准或解释 policy 正文。 |
| `L2-runtime` 当前正式设计与项目台账 | execution/outcome owner input | 只承接安全 read/result/recovery 边界；不扩展 Runtime control 或 outcome。 |
| `L4-sandbox` 当前正式设计与项目台账 | isolation/run/lease/cleanup owner input | 只定义 Runner 需要的公开 port；不复用或编译私有 backend。 |
| `L4-observability` 当前正式设计与项目台账 | diagnostic/evidence/handoff owner input | 只承接 bounded/redacted diagnostic 与 handoff；不拥有 evidence/report/verdict。 |
| `L4-archive` 当前正式设计与项目台账 | conditional archive/restore input | 只保留条件性安全引用；不进入启动、running 或 cleanup 成功判断。 |
| 本仓 README、旧 `02/03/05/06`、`draft/` | historical_material | 仅在每 Step 独立判断形成后做污染/遗漏扫描；旧技术、对象名、数字和页面切分不得自动继承。 |

## 5. 持续 blocker / pending

| ID | 当前状态 | 影响的概要面 | 安全处理 |
|---|---|---|---|
| `RUN-UP-001` | blocked | Release consumption、locator、manifest、digest/signature、revoke/expire adapter | 只定义 required port、local posture 和 fail-closed 分支，不锁 API/算法/transport。 |
| `RUN-UP-002` | blocked | authority chain、scope、expiry/revoke/conflict | Runner 只消费可验证结论；不可验证不得取得或启动。 |
| `RUN-UP-003` | blocked | Sandbox request、幂等、boundary、lease、cleanup、reconcile | `accepted != running`；unknown 冻结；不写私有 backend。 |
| `RUN-UP-004` | blocked | Runtime status/result/recovery read surface | 只保留 owner-safe read port 与 unavailable/unknown 分支。 |
| `RUN-UP-005` | blocked | safe diagnostic、handoff/receipt、visibility/freshness/retention | 本地诊断不升级为 evidence/report/verdict/signoff。 |
| `RUN-UP-006` | blocked / peripheral | Archive 引用/恢复消费 | 不进入核心闭环成功判断。 |
| `RUN-UP-007` | blocked | local probe、owner allocation/lease 与 cleanup 责任 | 双视图表达冲突；不固定平台数字或抢占策略。 |
| `RUN-UP-008` | pending | SDK exact client/error/redaction/trace surface | 坚持 SDK-first；名称仅为 Runner required port，不声称真实 client 已存在。 |

## 6. 当前权限与真实性门禁

```text
current_document = 02-概要设计.md
current_step = 14
current_module = formal_assembly:self_reviewed
gate_status = pass
formal_status = formal_stop_review
next_allowed_action = enter_03_step_01_under_existing_user_authorization
formal_00_write_allowed = false
formal_01_write_allowed = false
formal_02_write_allowed = completed
formal_03_write_allowed = false_until_03_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
