# L2-tools 07 实施计划 Step 13：正式文档装配

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13
> 书写规范：`standards/document/实施计划书写规范.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 台账规范：`standards/document/代码实施台账与门禁规范.md`
> 目标正式文档：`projects/L2-tools/07-实施计划.md`
> 当前模式：`full-restart / single-agent-serial`

## Step 状态

| field | value |
|---|---|
| step | `Step 13` |
| status | `completed_stop_review` |
| input | Step 1~12 均为 `accepted`；正式 `00~06` 均已装配 |
| formal_07 | `created / structural_audit_passed` |
| implementation_ledger | `created / inventory_audit_passed` |
| boundary_skeletons | `26/26 created / non_empty / structurally_audited` |
| implementation_facts | `none` |
| next_allowed_action | `wait_for_user_review` |

## 本步输入

| 输入 | 状态 | 装配用途 |
|---|---|---|
| Step 1 输入边界 | completed | §1 authority、historical material、blocker 分类和事实边界。 |
| Step 2 目标与范围 | completed | §2 OBJ-01~08、P0、conditional 和 non-scope。 |
| Step 3 前置与阅读 | completed | §3 路径、规范、阶段阅读矩阵、ledger 和 memory seeds。 |
| Step 4 对象与交付物 | completed | §4 七 member、41 对象、37 protocol、配置/测试/证据交付。 |
| Step 5 Phase | completed | §5 PH-01~11、依赖图、增量和停审门禁。 |
| Step 6 Boundary | completed | §6 26 boundary、批次、scope、设计闭环和经验复核。 |
| Step 7 测试/验收 gate | completed | §7 234 TC、suite/check、phase/boundary gate、证据生成顺序。 |
| Step 8 配置/环境/依赖 | completed | §8 profile、V0~V8、B0~B8、仓路径事实和不可用语义。 |
| Step 9 Spike/风险/OQ | completed | §9 六 Spike、十四风险、十 OQ 和 writeback。 |
| Step 10 控制 | completed | §10 十条 pause、八条 rollback、change authority 和恢复。 |
| Step 11 提交/评审/交付 | completed | §11 26 planned title/body group、Commit/Handoff Gate。 |
| Step 12 完成判定 | completed | §12 完成谓词、分母、审计、未完成项和真实性状态。 |

## SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否覆盖标准章节主链？ | 是。正式文档严格使用 §1~§13，不删除前置、boundary、gate、控制、提交或完成章节。 |
| 每章是否来自已确认中间产物？ | 是。§1~§12 分别以 Step 1~12 为直接 calibration source；§13 以本文件为直接来源。 |
| 编号是否稳定？ | 是。保持 `PH-01~11`、26 个 `commit-*`、`SP-L2T-001~006`、`R-L2T-001~014`、`OQ-L2T-001~010`、`PAUSE-L2T-01~10`、`RB-L2T-01~08`。 |
| 是否复制详细设计？ | 否。正式 07 只保留实现索引、scope、顺序和 gate；字段、DTO、Port、状态和 flow 的唯一 authority 仍为正式 03。 |
| 是否嵌入测试/验收？ | 是。保留 234 TC、11 P0 suite、11 check、30 slot、39 AC、13 VF、24 evidence gate 的分母和来源，不复制 case/schema registry。 |
| 是否预创建全部 boundary ledger？ | 是。正式 07 装配后同批创建项目级 ledger 和全部 26 个非空 skeleton。 |
| 当前 boundary 如何初始化？ | `commit-01-a` 是唯一 current，但因目标仓不存在且 immutable baseline 未冻结，初始化为 `blocked / wait_design`；其余均为 `planned / wait_until_current`。 |
| 是否存在空表或执行占位？ | 运行期字段使用明确值 `pending`、`not_created`、`none`，并注明填写条件；不得把模板变量当事实。 |

## 当前材料诊断与装配取舍

| 议题 | 诊断 | 装配取舍 |
|---|---|---|
| Step 13 开始时正式 07 尚不存在 | 无法形成实现移交入口 | 已由本 Step 创建完整正式文档并完成结构审查。 |
| Step 1~12 信息密度高 | 全量复制会形成冗余和第二真相源 | 正式文档保留可执行结论，并逐章链接具体 Step。 |
| Step 6 有 26 个详细边界卡 | 只保留总表会让 agent 再向设计侧索要 scope | 正式 §6 保留 boundary 总表和共享 gate；每个 skeleton 承载 exact scope/batch/check。 |
| 实现仓和 immutable baseline 均缺失 | 不能初始化为 read/write enabled | 唯一 current 明确 blocked；设计交付物完成不等于实现启动。 |
| 上游 positive seam 未闭口 | 不应阻塞 local/negative 计划，也不能伪造 readiness | 保留 `L2T-UP-001~009`，受影响 positive boundary 条件化。 |
| planned path 容易被误读为 evidence | 空目录或静态报告会污染验收 | 所有 skeleton 将 evidence 初始化为 `not_created`，并声明 same-run 派生规则。 |

## 正式章节来源与延伸阅读

| 正式章节 | Calibration source | 延伸阅读 |
|---|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` | 正式 00~06；全局依赖规则。 |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` | 正式 00 §2/§4/§7~§16；01 §4/§8。 |
| §3 实施前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | 正式 03 §3/§4/§16；台账、目录、Rust 与提交门禁标准。 |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_objects_deliverables.md` | 正式 03 §4~§16；05 §6/§9/§13；06 §10。 |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | 正式 03 §16；05 §3~§14。 |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 正式 03 owning sections；本项目 boundary ledgers。 |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_tests_acceptance_gates.md` | 正式 05 §5~§14；06 §3~§14。 |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 正式 04 §3~§14；01 §8；03 §13。 |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 正式 03 §17；04 §14；05 §14；06 §13。 |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | 代码实施台账规范；正式 03~06 owning authority。 |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | `实施计划讨论流程_SOP.md` Step 11、`实施计划书写规范.md` §4.9、`代码实施台账与门禁规范.md` §7.7~§7.8。 |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | 正式 05 §12~§14；06 §3~§14。 |
| §13 参考 | 本文件 | 正式 00~07、Step 1~13 和 governing standards。 |

## 正式文档装配规则

| 规则 | 必须满足 |
|---|---|
| 章节来源 | 每章正文开头列出 Calibration source，并给出具体延伸阅读。 |
| 正式优先 | 实现时正式 00~07 高于 calibration；含糊时读来源，仍含糊则 `wait_design`。 |
| 粒度 | §5 以后保留可实施的 phase、boundary、selector、gate、scope、失败和 handoff 口径。 |
| 单一真相源 | 不在 07 重新定义 03 字段/DTO/Port/状态、04 配置 schema、05 TC schema 或 06 verdict authority。 |
| 事实边界 | planned command/message/path 不得写成已执行；所有 commit/run/artifact/report/evidence/signoff 当前均不存在。 |
| 上游 seam | local/negative/fail-closed 可规划；external positive 只有 owner 闭口、新 baseline 和真实 qualification 后才能激活。 |
| 实施台账 | 项目 ledger 与 26 skeleton 是正式 07 交付物；缺一不得移交。 |

## Implementation Ledger 与 Boundary Skeleton 装配合同

### 项目级状态

```text
implementation_status = not_started
implementation_conclusion = implementation_incomplete
current_boundary = commit-01-a
gate_status = blocked
next_allowed_action = wait_design
design_baseline = not_fixed_until_handoff
implementation_commit = none
test_run = none
evidence_instance = none
acceptance_process = not_entered
overall_verdict = none
accepted_risk_instances = 0
signoff = not_bound
```

### Boundary 全集与初始状态

| group | boundary | initial status | gate_status | next_allowed_action |
|---|---|---|---|---|
| current | `commit-01-a` | `blocked` | `blocked` | `wait_design` |
| future | `commit-01-b`; `commit-02-a/b/c`; `commit-03-a/b`; `commit-04-a/b`; `commit-05-a/b/c`; `commit-06-a/b/c`; `commit-07-a/b/c`; `commit-08-a/b`; `commit-09-a/b`; `commit-10-a/b`; `commit-11-a/b` | `planned` | `pending` | `wait_until_current` |

### 每个 Skeleton 必须存在的内容

| Section | 内容 |
|---|---|
| Boundary Header / Intent | ID、phase、objective、baseline、repo、状态、planned title/body group。 |
| Activation Guard | 唯一 current、predecessor、项目 ledger 和 baseline 条件。 |
| Required Reads | 正式章节、当前 Step、标准、project ledger 和 implementation ledger。 |
| Allowed / Forbidden Scope | 当前 boundary 可触达文件/职责和明确排除项。 |
| Batch Plan | 100~300 行可验证批次、目标和顺序。 |
| Design Closure Gate | field/DTO/Port/state/UoW/replay/config/evidence/phase/Rustdoc。 |
| Required Checks | selector、build/test/static/evidence 方向；planned 不是执行结果。 |
| Gate Matrix | activation/design/scope/worktree/build/test/evidence/commit/handoff。 |
| Commit / Handoff Gate | staged scope、message、checks、真实 hash、not-run、next boundary。 |
| Blockers | current repo/baseline blocker，或 future activation blocker。 |
| Experience Review | boundary-specific 经验适用性、owner redline 和真实性。 |

## 装配后评审清单

| 检查项 | 通过条件 | 当前状态 |
|---|---|---|
| 13 章完整 | 正式文档恰有 §1~§13，且无未解释空章 | `pass (13/13)` |
| 来源完整 | 每章有直接 calibration source 和延伸阅读 | `pass (13/13)` |
| Phase 全集 | `PH-01~PH-11` 唯一且顺序稳定 | `pass (11/11)` |
| Boundary 全集 | 26 个 ID 与 Step 6/7/11 一致 | `pass (26/26)` |
| Ledger 全集 | 1 个项目 ledger + 26 个非空 skeleton | `pass (1+26)` |
| 唯一 current | 仅 `commit-01-a` current/blocked；其他全为 planned | `pass (1 blocked + 25 planned)` |
| Scope 可执行 | 每个 skeleton 有 allowed/forbidden scope、batch 和 checks | `pass (26/26)` |
| 分母一致 | 41/37/234/11/11/30/39/13/24 不漂移 | `pass` |
| 风险全集 | 6 Spike、14 risk、10 OQ、10 pause、8 rollback 均可追溯 | `pass (6/14/10/10/8)` |
| 事实真实 | 无 fake commit/run/result/evidence/verdict/signoff/readiness | `pass` |
| 上游 blocker | `L2T-UP-001~009` 保持开放且只影响相应 positive scope | `pass` |
| 格式 | Markdown 表格/链接/路径可审查，`git diff --check` 通过 | `pass` |

## 剩余风险与待确认事项

| 事项 | 当前处理 |
|---|---|
| 目标实现仓不存在 | 允许完成设计交付，阻塞 `commit-01-a` 激活和任何代码/测试。 |
| immutable design baseline 未冻结 | 项目和 current boundary 保持 `wait_design`，不得从当前 dirty worktree 推导 hash。 |
| external positive owner contract 未闭口 | 保持 `L2T-UP-001~009`，对应 adapter/qualification 为 blocked/conditional。 |
| actual command/file/product 细节 | 由目标仓 preflight 与当前 boundary ledger 记录；不能在设计期伪造。 |
| 真实验收 authority 与签署 | 只由正式 06 的授权流程产生；本 Step 不绑定人名或结论。 |

## 回填与写入顺序

1. 先以本文件的 13 章来源映射创建正式 `07-实施计划.md`。
2. 在正式 §3/§6/§7/§10/§11/§12 固定 ledger 状态机和 boundary handoff。
3. 创建 `implementation_execution_ledger.md`，初始化真实的 pre-implementation blocked 状态。
4. 创建 26 个 boundary skeleton；先 current，再按 Phase 顺序创建 future planned。
5. 回读正式 07、项目 ledger 和所有 skeleton，执行编号、状态、路径、非空与事实边界检查。
6. 更新本文件、07 flow 和 `project_execution_ledger.md` 为 completed stop review。
7. 运行 `git diff --check`；不运行实现测试，不创建 commit。

## 进入完成态条件

- [x] Step 1~12 输入均已完成并逐章映射。
- [x] 13 章装配结构、真实性边界和延伸阅读已固定。
- [x] 26 个 skeleton 的初始状态与必备 section 已固定。
- [x] 正式 `07-实施计划.md` 已装配并通过结构审查。
- [x] 项目 implementation ledger 与 26 个 skeleton 已创建并通过全集审查。
- [x] 三层恢复点已更新，终检通过并停在正式 07 审阅点。
