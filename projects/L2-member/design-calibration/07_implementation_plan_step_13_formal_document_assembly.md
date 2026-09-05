# Step 13. 整理正式实施计划文档

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13。
>
> 回填目标：`projects/L2-member/07-实施计划.md`。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`。只参考章节来源映射、装配原则、审计清单与停审结构；不继承 Governance 的领域对象、阶段、门禁、证据或实现结论。
>
> 事实边界：本 Step 负责把 Step 1～12 的设计结论装配为正式实施计划，并在正式文档完成后创建 future planned implementation ledgers。当前目标实现仓不存在，未发生代码、构建、测试、artifact、report、evidence、commit、verdict、signoff 或 readiness；planned skeleton 不等于实现授权。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13：整理正式实施计划文档 |
| 执行模式 | `full-restart + single-agent-serial`；用户已授权连续完成 07 Step 2～13 |
| Step 开工确认 | 已读取项目级台账、07 flow、Step 1～12、07 SOP / 书写规范、实施台账规范、真相源闭环标准、`projects/README.md` 与 L1-governance 同粒度 Step 13 |
| 本步模块骨架 | `source-mapping`、`formal-assembly`、`ledger-skeleton-creation`、`static-audit-and-stop-review` |
| 当前状态 | `completed / pass_with_upstream_and_design_blockers / stop_review` |
| 输出文件 | 本文件；正式 `projects/L2-member/07-实施计划.md`；`design-calibration/implementation_execution_ledger.md`；18 个 `implementation-boundaries/<boundary_id>.md` planned skeleton |
| 允许写入 | 仅 `projects/L2-member/` 下设计文档与校准材料；可创建 planned ledger / skeleton，不可写实现代码 |
| 事实结论 | 正式 07 是 future implementation contract，当前实施状态仍 `not_started / implementation_incomplete` |
| 停审方式 | 正式 07、项目实施台账和 18 个 skeleton 已完成静态审计；本 Step 立即停审，等待后续独立实现授权 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| Step 1 输入边界 | 已完成 | 装配 §1 的权威顺序、历史隔离和事实等级 | 不把 dirty HEAD 写成 immutable baseline |
| Step 2 范围 | 已完成 | 装配 §2 的 P0 / P1 / P2、非范围和 24 candidate 红线 | 不扩大 P0 或改变 owner |
| Step 3 前置条件 | 已完成 | 装配 §3 的阅读矩阵、仓/命名检查、永久记忆和恢复协议 | 不提前创建 implementation ledger |
| Step 4 对象 / 交付物 | 已完成 | 装配 §4 的七 crate、能力纵切和交付/非交付清单 | 不复制详细设计 schema |
| Step 5 phase / 依赖 | 已完成 | 装配 §5 的 PH-01～PH-08 DAG、输入/输出和 phase gate | 不把 phase 改成文件清单 |
| Step 6 task / batch / boundary | 已完成 | 装配 §6 的任务顺序、批次、18 boundary 和设计者复核 | 不新增或合并 boundary |
| Step 7 test / acceptance gate | 已完成 | 装配 §7 的 test、AC/VF、artifact/report 和失败处理 | 不运行测试或生成证据 |
| Step 8 config / environment | 已完成 | 装配 §8 的 profile、slot、依赖分类和不可用处理 | 不创建配置、外部 adapter 或环境 |
| Step 9 Spike / risk / OQ | 已完成 | 装配 §9 的 Spike、blocker、期限和 residual | 不关闭待确认项 |
| Step 10 rollback / pause / change | 已完成 | 装配 §10 的暂停、回退、变更和恢复规则 | 不执行 destructive rollback |
| Step 11 commit / review / delivery | 已完成 | 装配 §11 的 message、scope、Commit/Handoff Gate 和 user-change protection | 不记录真实 commit / review |
| Step 12 completion criteria | 已完成 | 装配 §12 的完成、条件完成、不完成和 closure audit | 不填写当前 completion claim |
| 正式 `00~06` | 已存在 | 作为实施基线引用和来源索引 | 正式文档优先于 calibration；冲突必须回写 |
| `代码实施台账与门禁规范.md` | 已读取 | Step 13 后创建项目级台账和全部 planned skeleton | 所有未来 gate 初始不得 `pass` |

## 3. SOP 问题回答

| # | 问题 | 本项目回答 |
|---:|---|---|
| 1 | 正式 07 是否覆盖书写规范主链 | 覆盖 13 个章节：上游关系、目标范围、前置阅读、对象/交付物、phase、任务/提交、测试/验收、配置/依赖、Spike/风险、暂停/变更、提交/评审/交付、完成判定、参考。 |
| 2 | 每章是否有可追溯来源 | 是。每章正文前列出具体 `design-calibration/07_implementation_plan_step_*.md`，并说明延伸阅读小节；正式文档不只引用目录。 |
| 3 | phase、task、boundary 编号是否一致 | 沿用 PH-01～PH-08、`IMPL-*`、`BATCH-*`、`commit-01-a`～`commit-08-b` 和 Step 7 gate 命名；装配不重编号。 |
| 4 | 正式文档是否复制详细设计 | 不复制 object、DTO、Port、DDL、函数或状态矩阵全文；只保留实施所需的能力分母、来源入口、顺序、边界和门禁。 |
| 5 | 每个 boundary 是否有可落码复核 | §6 保留通用字段/DTO/state/ref/validation/idempotency/projection/artifact/phase 复核，且列出设计者责任和 blocker 处理；execution-time 必须再次核验。 |
| 6 | 正式 07 是否承接 implementation ledger 规则 | 是。§3、§6、§11、§12 明确项目级台账、boundary 台账、唯一 current、future `planned / wait_until_current` 和 Commit/Handoff Gate；Step 13 后实际创建 skeleton。 |
| 7 | 是否会把 planning posture 写成执行结果 | 不会。正式 07 仅定义 future contract；项目级 ledger 与 skeleton 只记录 `planned`、`blocked`、`waiting` 姿态和 activation condition，不填写执行期结果。 |
| 8 | 24 candidate 是否会进入实现计划事件设施 | 不会。正式 §2、§4、§6、§7、§8、§9、§11、§12 重申 `L2M-UP-005` 关闭前 zero-configuration / non-materialization；任何 event/publisher/outbox/route/topic/retry/DLQ 物化都属 blocker。 |
| 9 | 当前是否可以宣称实现完成 | 不可以。正式 07 只定义 future `implementation_complete_and_ready_for_acceptance` 条件；当前目标仓、baseline、真实 gate、run、报告和 closure 仍缺失。 |
| 10 | planned skeleton 如何避免伪造实现 | skeleton 只写 boundary identity、planned scope、required reads、planning gate posture、activation condition、blocked reason、`status=planned` 和 `next_allowed_action=wait_until_current`；不写执行期字段或结果。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 正式 `07` 尚不存在（Step 开工时） | 没有可移交的实施合同 | 实现者无法按统一章节恢复 | 已依 Step 1～12 来源映射创建 13 章正式文档 |
| Step 6 / 7 内容较重 | 全量复制会重复详细设计且难审查 | 正式文档失去实施层主线 | 只装配执行摘要，细节回指 calibration |
| implementation ledger 未创建（Step 开工时） | 实现恢复入口缺失 | 后续可能绕过 gate 或误用聊天状态 | 已在正式 07 审计通过后一次性创建项目级 ledger 和 18 个 skeleton |
| current / future boundary 可能混淆 | 文件存在可能被误解为可实现 | 越过 activation / Design Gate | 项目级只激活一个 current；本轮全部 future skeleton 为 planned / wait_until_current |
| 当前 dirty workspace 与历史材料并存 | 可能误把 HEAD 或旧 README 当基线 | 污染 implementation handoff | §1、§3、§9、§12 固定 immutable baseline 前置条件和历史隔离 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 正式实施计划 | 缺失 | 13 章、来源可追溯、future 事实等级明确 | 满足 07 移交入口要求 |
| 阶段主线 | 分散在 Step 5/6 | PH-01～PH-08 纵切 DAG、18 boundary 和门禁集中呈现 | 支持按能力增量实施 |
| 实施台账 | 只有创建规则 | 创建项目级台账和全部 boundary planned skeleton | 支持可恢复、可阻断的 future handoff |
| 完成判定 | 分散在 Step 7/9/11/12 | §12 统一 completion / conditional / not-complete | 禁止“基本完成”与静态通过 |
| 证据与交付 | 只有路径约定 | §7、§11、§12 固定 raw→report→index→review | 保持 provenance 和人工裁决边界 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 直接把 Step 文件拼接成正式 07 | 不采用 | 会把问题回答、诊断和过程性内容混入正式正文，并重复详细设计。 |
| 只写一页 phase 摘要 | 不采用 | 缺少 boundary、门禁、回退、证据和完成判定，无法交给实现者。 |
| 正式正文承载收口结论，校准材料承载推导和审计 | 采用 | 兼顾可执行性、可读性和追溯性。 |
| 先创建空 implementation ledger，再补正式 07 | 不采用 | 台账缺少正式 boundary inventory，容易制造伪授权。 |
| 正式 07 与全部 planned skeleton 在同一 Step 13 审计后创建 | 采用 | 保证 skeleton 只来自已收稳的 Boundary Gate Matrix。 |
| 将当前 blocker 改成风险接受以便“完成” | 不采用 | target repo、设计闭环、P0 truth 和 evidence blocker不可风险接受。 |

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 主要 calibration 来源 | 辅助正式来源 |
|---|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` | `00~06`、Step 3 |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` | `00`、`01`、`03`、`06` |
| §3 实施前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | `04`、`05`、`06`、Rust/目录/台账规范 |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_objects_deliverables.md` | `03` §3～§15、`04`、`05`、`06` |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | Step 2/4、`03` CP01～CP07 |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | `03`、`05`、`06`、Step 10/11 |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_test_acceptance_gates.md` | `05`、`06` |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | `03` §3/§13、`04` |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | Step 2/8/10、`06` 风险接受 |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | `03`、`04`、`05`、`06`、台账规范 |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | Step 6/7/10、`projects/README.md` §8.2 |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | `06` §11～§14 |
| §13 参考 | 本文件与 `07` 各章节来源映射 | 已实际读取的 standards / project sources |

### 7.2 正式装配原则

| 原则 | 装配要求 |
|---|---|
| authority | 正式 `00~06` 是 active implementation input；calibration 解释决策；历史 README / 旧文档只作污染审计。 |
| traceability | 每章开头列具体来源文件，并给出延伸阅读小节；禁止“详见 calibration”式泛引用。 |
| scope | 只承接 member-local、negative、blocked-aware P0；外部 positive、物理产品、transport、部署和 P2 性能后置。 |
| denominator | 保留 7 crate、34 object、10 Command、16 Query、14 Consumer、5 Job、28 state、24 candidate 的实施分母，但不复制 schema。 |
| evidence | 只定义 future raw artifact、report、evidence index、acceptance draft和 review 关系；不生成实例。 |
| facts | `planned / blocked / waiting` 仅表示设计期姿态；不得升格为 delivered、observed、healthy或任何执行结论。 |
| ledger | 正式 07 的 Boundary Gate Matrix 已收稳；已创建项目级 implementation ledger 和 18 个 boundary skeleton。 |
| user changes | 当前 design workspace 的其他改动不纳入本项目 scope，不使用 destructive reset / checkout 清理。 |

### 7.3 正式文档结构草案

```text
metadata and fact boundary
  -> §1 upstream / authority
  -> §2 objective / P0-P2 scope
  -> §3 prerequisites / reading / ledgers
  -> §4 implementation objects / deliverables
  -> §5 PH-01~PH-08 dependency DAG
  -> §6 tasks / batches / 18 boundaries / closure review
  -> §7 test / acceptance / evidence gates
  -> §8 config / environment / dependency preparation
  -> §9 spikes / risks / open questions
  -> §10 pause / rollback / change control
  -> §11 commit / review / handoff discipline
  -> §12 completion / residual / send-to-acceptance criteria
  -> §13 references
```

### 7.4 Planned ledger / skeleton creation contract

| 产物 | 创建时机 | 初始状态 | 必须包含 | 明确禁止 |
|---|---|---|---|---|
| `implementation_execution_ledger.md` | 正式 07 §6 Boundary Gate Matrix 审计通过后 | 唯一 current `commit-01-a / blocked / wait_design` | baseline 未固定说明、repo 缺失、boundary 汇总、open blockers、next action | 执行期字段、结果或完成声明 |
| `implementation-boundaries/<id>.md` | 同一时点一次性预创建 18 个 | current: `blocked / wait_design`；future: `planned / wait_until_current` | required reads、allowed/forbidden scope、planning gate posture、activation condition、planned title | 任一 gate `pass`、真实 touched files、执行期字段、结果或完成声明 |

### 7.5 Step 13 静态审计清单

| 审计项 | 通过条件 | 当前结论 |
|---|---|---|
| 章节完整性 | 正式 07 有 13 个主章节和文档元信息 | `pass_for_design` |
| 来源完整性 | §1～§13 均列具体 calibration source | `pass_for_design` |
| 阶段一致性 | PH-01～PH-08 与 Step 5 一致 | `pass_for_design` |
| boundary 一致性 | 18 个 `commit-01-a`～`commit-08-b` 与 Step 6/7 一致 | `pass_for_design` |
| gate 一致性 | phase / boundary gate、AC/VF、artifact/report 和失败处理均有摘要 | `pass_for_design` |
| scope 红线 | 24 candidate non-materialization、Query no-write、external truth外置均保留 | `pass_for_design` |
| completion 边界 | §12 不把实施完成写成验收 verdict / signoff / readiness | `pass_for_design` |
| 台账预创建 | 项目级一 current、18 skeleton future wait_until_current、无 pass | `pass_for_design` |
| skeleton 姿态收紧 | 18 skeleton 均采用 planning gate posture；仅 01-a 为 `blocked / wait_design`，其余为 `planned / waiting / wait_until_current`，无执行期字段 | `pass_for_design` |
| blocker 真实性 | `L2M-UP-001~008`、`L2M-DDD-001~007`、scope gap、dirty baseline、target repo缺失继续开放 | `pass_with_blockers` |
| 当前实施事实 | 无代码、commit、run、artifact、report、evidence或验收结果被伪造 | `pass_for_design` |

## 8. 回填草稿

正式 `07-实施计划.md` 已按本文件 §7.1 的映射分批创建，正文保留收口结论。其文档元信息为 `Draft / 07_completed_stop_review`，实施状态为 `not_started / implementation_incomplete`，目标实现仓当前不存在，design baseline 为 `not_fixed_until_handoff`。§3、§6、§11 和 §12 已共同定义 implementation ledger、Boundary Gate Matrix、Commit Gate、Handoff Gate、用户改动保护和设计缺口回写；Step 13 审计后已创建一个项目级 ledger 与 18 个 planned boundary skeleton。

正式正文必须说明：PH-01～PH-08 是能力纵切，18 个 boundary 是 future commit 粒度；统一 `contracts → domain → application → infra → api/worker/jobs → targeted checks` 顺序；P0 只实现 local / negative / blocked-aware 语义；P1/P2 与 owner exact contract、physical durability、production SLO、真实 selected-run 和部署后置。24 个 outbound semantic candidates 在 `L2M-UP-005` 关闭前只做 dependency/non-materialization 检查。

正式 §12 只能在真实实现、测试、报告和审查完成后由执行期台账判定 `implementation_complete_and_ready_for_acceptance` 或条件完成；本轮不填写任何实际结论。最终验收仍由 `06-验收标准.md` 和获授权验收角色裁决。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 | 最迟点 |
|---|---|---|---|
| target implementation repo 创建授权与路径 | PH-01 activation、全部 implementation | 保持 `L2M-DDD-001`，不在设计仓创建 | PH-01 / `commit-01-a` 前 |
| immutable design baseline manifest | Design Gate、ledger 和 handoff | 当前 dirty planning baseline；移交前固定 | 实现移交前 |
| Core API / MSRV / export compatibility | workspace compile | 仅保留 planned candidate，不能建 shadow type | `commit-01-a` 前 |
| physical Store / UoW realization | durable / crash / performance claims | `L2M-DDD-002`；只规划 logical / fake | 首个 durable claim 前 |
| scope successor、Consumer receipt、CP04～CP07 helper/version | affected boundary 1:1 落码 | `wait_design`，回写 owning source | 受影响 boundary 前 |
| host / image / Runtime / credential / screening / subject contracts | P1 selected lane | owner closure 后另行 qualification | selected run 前 |
| fixed run、report generator、reviewer与 risk acceptor | PH-08 evidence / handoff | `<run_id>` 和角色保持 future variable | PH-08 执行前 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 1～12 输入齐全且来源映射完成 | `pass_for_design` | 每章均有具体 calibration source。 |
| 正式 07 结构和事实边界收稳 | `pass_for_design` | 13 章、P0/P1/P2、PH、boundary、gate、证据和完成规则均有入口。 |
| planned ledger / skeleton 规则收稳 | `pass_for_design` | 只允许 planned / blocked / waiting，不伪造执行事实。 |
| target repo / baseline / UP / DDD blocker | `blocked` | 阻塞实现移交与 qualification，不阻塞设计文档装配。 |
| 正式 07 可创建 | `completed` | 正式 `07-实施计划.md` 已创建并完成静态审计。 |
| implementation ledger / boundary skeleton 可创建 | `completed` | 项目级 ledger 与 18 个 skeleton 已创建；均保持 planned / blocked / waiting，不含 gate pass。 |
| Step 13 停审 | `required` | 未获新的实现授权前，不创建实现仓、不写代码、不运行测试、不生成真实证据、不提交 commit。 |

## 11. Step 13 完成与停审记录

本 Step 已完成正式 `07-实施计划.md` 的 13 章装配、项目级 `implementation_execution_ledger.md` 和 `commit-01-a` 至 `commit-08-b` 共 18 个 planned boundary skeleton。静态审计确认：PH-01～PH-08、28 个 `IMPL-*`、29 个 `BATCH-*`、18 个 boundary、`GATE-01~10`、24 candidate non-materialization与 current/future boundary状态相互一致。

该结论仅表示设计期装配与台账预创建完成：`commit-01-a` 仍是唯一 current identity，且为 `blocked / wait_design`；其他 17 个均为 `planned / waiting / wait_until_current`；18 份 skeleton 已收紧为 planning gate posture，未保留执行期 gate、commit、运行、测试、产物、报告、证据、裁决、签署或 readiness 字段。目标实现仓不存在、immutable baseline未固定，且 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-005`、workload / SLO及真实执行授权继续开放。

本 Step 现停审。未经新的明确实现授权，不创建实现仓、不写代码、不运行测试、不生成 artifact / report / evidence、不提交 commit，也不把设计期静态审计写成实现、验收、verdict、signoff或 readiness。
