# Step 13. 整理正式实施计划文档

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13  
> 书写规范：`standards/document/实施计划书写规范.md` §5.13、§6、§7  
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §3.3～§3.4.7  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md` §三、§五、§六  
> 回填范围：正式 `projects/L5-runner/07-实施计划.md` §1～§13  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与装配事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration → formal assembly |
| `current_step` | `Step 13` |
| `current_module` | `formal_assembly_traceability_boundary_skeletons` |
| `status` | `completed / formal_stop_review_required` |
| `gate_status` | `completed / pass / cross_audited` |
| `gate_reason` | 正式 07 已按 13 章主链 full-restart 装配并通过来源、编号、范围、事实边界和历史材料隔离审计；implementation ledger 与 18 个 planned boundary skeleton 已创建，全部保持 planned/blocked/waiting。 |
| `next_allowed_action` | `wait_user_confirmation_for_implementation_handoff` |
| `formal_07_write_allowed` | `completed_for_step_13_only` |
| `implementation_ledger_allowed` | `completed_for_step_13_only` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |

本 Step 的“装配完成”只表示正式实施计划和计划台账已写入设计仓。它不表示目标实现仓存在，不表示任何 boundary 已开始，不表示设计 blocker 已关闭，也不表示任何测试、验收、风险接受、签署或 readiness 已发生。

## 2. 本步输入、输出与装配约束

### 2.1 必读输入

| 输入 | 用途 | 装配限制 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | §1 输入边界、权威顺序、历史材料隔离 | 不把校准过程写成正式正文 |
| `07_implementation_plan_step_02_scope.md` | §2 P0/P1/P2、范围与非范围 | 不扩写需求或技术选择 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | §3 前置条件、阶段阅读、永久记忆和 blocker | 不把候选命令写成已验证工具链 |
| `07_implementation_plan_step_04_deliverables.md` | §4 逻辑对象、交付物、非交付物、依赖分类 | 不把 planned 落点写成文件事实 |
| `07_implementation_plan_step_05_phases_dependencies.md` | §5 六 phase、依赖、功能增量、停审 | 不重排或增加 phase |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | §6 任务、批次、18 boundary、提交关系 | 不按文件拆提交，不丢 high-risk redline |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | §7 12 suite、18 CUT、108 TC、18 slot、GATE/AC/AR/TX/NFA/VETO | planned 分母不变成执行结果 |
| `07_implementation_plan_step_08_config_environment_dependencies.md` | §8 41 config、四 profile、环境/依赖准备 | 不写具体 backend/平台事实 |
| `07_implementation_plan_step_09_spikes_risks_open_questions.md` | §9 Spike、风险、OQ、回写和重开 | 不清除 blocker 或伪造 risk acceptance |
| `07_implementation_plan_step_10_rollback_change_control.md` | §10 pause/rollback/change/resume、failure lineage | 不删除失败材料或创建 run |
| `07_implementation_plan_step_11_commit_review_delivery.md` | §11 commit/review/handoff/artifact 纪律 | 不填写 commit hash、reviewer 或 handoff 结果 |
| `07_implementation_plan_step_12_completion_criteria.md` | §12 完成语义、证据链、未完成项、闭环审计 | 不把 implementation complete 当 acceptance verdict |
| 正式 `00`～`06`、相应 calibration flow、上游专项正式文档/台账 | 权威事实、编号、owner 和 blocker 交叉核验 | 冲突必须停装配并回写 owning source |
| `实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`设计文档讨论中间产物规范.md`、`代码实施台账与门禁规范.md` | 章节、追溯、时序和台账格式 | 项目计划不得放宽通用门禁 |

### 2.2 本步输出

1. 正式 `projects/L5-runner/07-实施计划.md`，严格使用 §1～§13 主链。
2. 正式实施计划评审清单、跨章节一致性审计和剩余 blocker/待确认声明。
3. `design-calibration/implementation_execution_ledger.md`，只记录计划级实现恢复点和 blocker，不填写真实实现事实。
4. `design-calibration/implementation-boundaries/commit-ph-01-a.md` ～ `commit-ph-06-b.md` 共 18 个 planned skeleton。
5. flow 与项目级台账更新到 `formal_stop_review_required`，明确下一步是用户确认，不是自动实现。

### 2.3 Full-restart 与事实约束

- 若正式 `07-实施计划.md` 已存在，装配前先核验目标、保留用户改动边界，再删除并按本 Step 来源重建；不得在旧正文上局部改名或继承旧技术口径。
- 正式正文只写收口结论、执行规则和可审查表格；SOP 原问题、历史污染诊断、方案取舍和逐 Step 过程留在 calibration。
- 每个正式章节开头必须列出具体 `design-calibration/07_implementation_plan_step_*.md` 来源及延伸阅读小节；不得只写“详见 calibration”。
- 不写 Rust/Tauri/Docker/gVisor/Firecracker、package/crate、源码路径、命令版本、baseline、commit hash、run_id、digest、artifact、report、evidence、verdict、signoff 或 readiness 的虚构实例。
- planned boundary skeleton 可以包含 allowed/forbidden scope、required reads 和 gate 规则，但不得标 `pass`、不得写真实 commit/run/evidence。
- 仅修改 `projects/L5-runner/`；不修改其他项目正式文档，不实现代码，不运行项目测试，不提交 commit。

## 3. SOP 问题回答

| SOP 问题 | Runner 装配回答 |
|---|---|
| 正式文档是否覆盖书写规范主链？ | 是，正式正文按 §1 与上游文档的关系声明、§2 范围、§3 前置与阅读、§4 对象/交付物、§5 phase、§6 任务/boundary、§7 测试/验收、§8 配置/环境/依赖、§9 Spike/风险/OQ、§10 回退/暂停/变更、§11 提交/评审/交付、§12 完成判定、§13 参考依次装配。 |
| 每章是否来自已确认中间产物？ | 是。来源矩阵逐章绑定 Step 1～12；正式正文不得新增未出现在上游正式文档、前序 Step 或用户确认中的结论。 |
| 阶段、任务、门禁编号是否一致？ | 采用六 phase、18 `commit-ph-*`、GATE-01～12、18 CUT/108 planned TC/12 suite/18 slot 及正式 AC/AR/TX/NFA/VETO 编号；装配前运行文本交叉审计，发现冲突暂停。 |
| 上游、测试和验收引用是否准确？ | 每个章节和关键矩阵回指具体正式文档/Step；专项上游只提供 Runner-facing seam 和 blocker，不被实施计划代替。 |
| 是否复制详细设计？ | 不复制字段、struct/enum/trait/API/DDL/伪代码；只写实施顺序、交付边界、门禁和闭环复核入口。 |
| 每个 phase/boundary 是否有开工前复核？ | 是。正式 §6/§7/§12 共同要求字段/DTO/ref、状态、port/adapter/UoW、配置、测试/证据和 phase boundary 在开工、提交和交付前复核。 |
| 是否包含交付实现前可落码闭环审计和永久记忆入口？ | 是。§3 阶段阅读/记忆种子摘要、§6 boundary 复核和 §12 交付前审计都引用 Step 3/6/12；实现 agent 只能在 authority 到达后按正式规范生成项目记忆。 |
| 是否有未解释的占位？ | 正式正文可以使用未来路径模板和 `planned / blocked / waiting / not_created` 状态，但必须说明它们不是实例；不得留下 `<...>`、`TBD` 或空表冒充完成。 |
| 装配后下一步是什么？ | 正式 07 停审，等待用户确认是否移交实现；即使用户确认，也仍需先按 implementation ledger 的 `read_docs`/`open_boundary` 门禁，不能自动写代码或执行测试。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 正式 07 尚不存在，Step 1～12 只在 calibration | 读者无法获得单一实施计划入口 | 按 13 章 full-restart 装配，并保留逐章来源 |
| 18 boundary、测试分母、验收分母分散在多个 Step | 可能发生编号漂移或漏映射 | 建立章节来源/编号/phase/boundary 交叉审计 |
| implementation ledger 规则要求移交前预创建 skeleton | 过早创建会伪造实施事实，过晚创建会阻断移交 | 仅在本 Step 正式装配完成后一次性创建，全部 planned/blocked/waiting |
| 旧 README/draft/技术选择可能污染正文 | 会把 Rust/Tauri/Docker 等历史假定带入实施计划 | 只作 historical_material 扫描；正式正文只承接当前 truth source |
| 设计 blocker 与“装配通过”容易混淆 | 文档完成可能被误读为可运行 | 顶部事实声明、§8/§9/§12 和台账重复固定 blocker 与 not_created |

## 5. 改动前后对比

| 项 | 装配前 | 装配后 | 目的 |
|---|---|---|---|
| 正式入口 | 文件缺失，只有校准文件 | 单一 13 章正式实施计划 | 便于后续实施者按章节执行 |
| 追溯 | Step 文件独立存在 | 每章都有具体来源和延伸阅读 | 保持真相源闭环 |
| 编号 | 分布在 03/05/06/07 calibration | phase/boundary/gate/TC/slot/AC 等交叉一致 | 防止实施期 mapping 漂移 |
| 台账 | 无 implementation ledger/skeleton | 项目级 ledger + 18 planned skeleton | 满足移交前可恢复性，同时不伪造执行事实 |
| 状态 | 文档级 calibration_in_progress | formal stop review；实施仍 blocked/not_started | 明确用户确认是下一门禁 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接把 1～12 文件拼接成正式 07 | 快 | 把诊断/取舍/过程噪声带入正文，重复详细设计 | 不采用 |
| 沿用 README/旧 07 的技术和目录 | 似乎具体 | 未获 authority，违反 full-restart 和历史隔离 | 不采用 |
| 只装配正式 07，不创建 implementation ledger | 文件少 | 无法按规范移交和恢复 boundary | 不采用 |
| 先创建 ledger/skeleton，再装配正式 07 | 可提前规划 | Step 13 输入未审计时可能伪造实施事实 | 不采用 |
| 正式 07 与 planned ledger/skeleton 在 Step 13 同一事务式批次创建 | 来源、正文、台账和 skeleton 可一起审计；状态明确为 planned/blocked/waiting | 一次装配文件较多，需要严格写入顺序和审计 | 采用 |
| 把实施完成写成最终验收通过 | 结论简单 | 越过 06 authority、VETO 和 GRC | 不采用 |

## 7. 结构化中间产物

### 7.1 正式章节—校准来源矩阵

| 正式章节 | 主要校准来源 | 必须保留的正式结论 | 禁止带入 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1；`00`～`06` 正式输入边界 | 权威顺序、历史材料隔离、Runner truth boundary、持续 blocker、当前事实 | 过程性讨论、旧技术选择 |
| §2 实施目标与范围 | Step 2 | P0 `CP/FR/BR/NFA/AC/AR/TX/VETO` 分母、P1/P2/future、非范围 | 新需求、性能硬阈值、owner truth |
| §3 实施前置条件与阅读清单 | Step 3 | 全局规范、00～06、专项上游、阶段阅读矩阵、启动/记忆/依赖门禁 | 未核验的命令、语言、目录和版本 |
| §4 实施对象与交付物清单 | Step 4 | 逻辑模块/对象/协议/配置/测试/证据/台账交付面、跨仓依赖和非交付物 | 完整详细设计 schema、物理文件事实 |
| §5 实施阶段与依赖顺序 | Step 5 | `PH-01`～`PH-06`、依赖图、输入/输出/不包含、phase gate 和停审 | 并行执行承诺、部署拓扑 |
| §6 阶段任务拆分、编写顺序与提交边界 | Step 6 | 统一编写顺序、18 boundary、批次、allowed/forbidden、开工闭环和 commit 时机 | 按文件拆提交、真实 commit/hash、代码实现 |
| §7 测试与验收门禁嵌入 | Step 7 | suite/CUT/TC/slot 分母、GATE、AC/AR/TX/NFA/VETO mapping、report/evidence 纪律 | planned 当 pass、静态 EV、实际 run |
| §8 配置、环境与外部依赖准备 | Step 8 | 41 配置、四 profile、环境层级、依赖分类、fake/controlled/disabled 和 fail-closed | 未获 authority 的 backend/平台/endpoint |
| §9 Spike、风险与待确认事项 | Step 9 | Spike 输出、风险分类、OQ owner/截止点、回写/重开和禁止 workaround | 虚构执行结果、risk acceptance/signoff |
| §10 回退、暂停与变更控制 | Step 10 | pause/rollback/change/resume、失败材料、new run lineage、gate failure 和恢复审计 | 破坏性回退、删除失败证据、跨 run 拼接 |
| §11 提交、评审与交付纪律 | Step 11 | 一 boundary 一提交、message/body/footer、Gate、review 分离、handoff/artifact/report | 目标仓规则已确认、实际 commit/hash/reviewer |
| §12 实施完成判定 | Step 12 | implementation_complete/conditional_handoff/incomplete/blocked、完成矩阵、交付证据、闭环审计和 06/07 分离 | “基本完成”、最终 verdict/readiness |
| §13 参考 | Step 13 + 实际读取材料 | 真实引用、版本/路径、事实边界和校准入口 | 未读文档堆砌、历史材料当 authority |

### 7.2 正式章节的最小来源块

正式每章均使用以下来源块变体，路径按上表替换：

```md
> 校准来源：
> - `design-calibration/07_implementation_plan_step_<nn>_<topic>.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节。
```

若一章合并多个 Step，必须逐项列出所有来源文件；不得用目录、对话记录或“前文”替代路径。

### 7.3 Full-restart 装配顺序与检查点

```text
[Step 13 开工确认 / 读取台账]
        |
        v
[检查 Step 1~12、正式 00~06、规范和历史污染]
        |
        v
[删除/隔离旧 07（若存在）并写入 13 章正式正文]
        |
        v
[正文来源、编号、范围、状态和 blocker 交叉审计]
        |
        v
[创建 implementation_execution_ledger.md]
        |
        v
[创建 18 个 implementation-boundaries/<boundary>.md planned skeleton]
        |
        v
[ledger/flow/formal 07 三层状态回写]
        |
        v
[git diff --check 与只读审计]
        |
        v
[formal_stop_review_required，等待用户确认]
```

装配中任何来源冲突、编号漂移、未经授权的技术结论、占位符或事实污染都会停止流程；不得用正文覆盖缺口。implementation ledger/skeleton 只有在正式正文来源和跨章节审计通过后才创建。

### 7.4 正式文档评审清单

| 检查项 | 判定标准 | 当前结果 |
|---|---|---|
| 上游引用 | 00/01/02/03/04/05/06 和专项上游均有明确用途及 blocker 限制 | `pass / planned` |
| 校准来源 | §1～§13 每章有具体 calibration 路径和延伸阅读 | `pass / planned` |
| 主链完整 | 13 章名称、顺序和回填范围符合书写规范 | `pass / planned` |
| 范围与分母 | P0、P1/P2、future、conditional、blocked 不混淆 | `pass / planned` |
| phase/boundary | 六 phase、18 boundary、任务/批次/提交关系一致 | `pass / planned` |
| 测试/验收 | 18 CUT、108 TC、12 suite、18 slot、GATE/AC/AR/TX/NFA/VETO 可反查 | `pass / planned` |
| 配置/依赖 | 41 项、四 profile、依赖分类和 fail-closed posture一致 | `pass / planned` |
| 证据纪律 | same-run、digest、redaction、dependency、link、pairing、cleanup 和 report review 均有规则 | `pass / planned` |
| 设计闭环 | §6/§12 具备交付前字段/DTO/state/ref/port/config/evidence/phase 审计 | `pass / planned` |
| 技术中立 | 未继承 Rust/Tauri/Docker/gVisor/Firecracker 或未授权路径/命令 | `pass / planned` |
| 事实诚实 | 未填写 baseline、commit、run、artifact、report、evidence、verdict、signoff、readiness | `pass / planned` |
| 台账时序 | implementation ledger/skeleton 只在 Step 13 创建，未来状态不写 pass | `pass / planned` |
| 空占位 | 无 `<...>`、`TBD`、空表；模板路径均有语义说明 | `pass / planned` |
| 写入范围 | 仅 `projects/L5-runner/`，无跨项目正式文档修改 | `pass / planned` |

### 7.5 18 planned boundary skeleton 创建矩阵

| Boundary | Skeleton 所需最小章节 | 初始 `status` | 初始 `gate_status` | 初始 `next_allowed_action` | blocker |
|---|---|---|---|---|---|
| `commit-ph-01-a` | Header、Required Reads、Allowed/Forbidden Scope、Gate Matrix、Commit/Handoff Record | `planned` | `blocked` | `wait_design` | `RUN-DDD-001~003` |
| `commit-ph-01-b` | 同上；增加 config/path/redaction/pairing checks | `planned` | `blocked` | `wait_design` | `RUN-DDD-002/003`、`RUN-OPS-002` |
| `commit-ph-02-a` | 同上；context/selection/generation tests | `planned` | `blocked` | `wait_design` | `RUN-UP-001/002` |
| `commit-ph-02-b` | 同上；material/integrity/UoW tests | `planned` | `blocked` | `wait_design` | `RUN-UP-001/002/008`、`RUN-DDD-003` |
| `commit-ph-02-c` | 同上；adapter availability/query no-write checks | `planned` | `blocked` | `wait_design` | `RUN-UP-001/002/008` |
| `commit-ph-03-a` | 同上；run/control/resource/guard state checks | `planned` | `blocked` | `wait_design` | `RUN-UP-003/004/007` |
| `commit-ph-03-b` | 同上；effect/UoW/Unknown/idempotency checks | `planned` | `blocked` | `wait_design` | `RUN-UP-003/004`、`RUN-DDD-003` |
| `commit-ph-03-c` | 同上；RecoveryCase/no-replay/recovery checks | `planned` | `blocked` | `wait_design` | `RUN-UP-003/004/007` |
| `commit-ph-03-d` | 同上；service/entry/query no-write checks | `planned` | `blocked` | `wait_design` | `RUN-DDD-003`、`RUN-UP-003/004` |
| `commit-ph-04-a` | 同上；presentation/redaction/forbidden corpus checks | `planned` | `blocked` | `wait_design` | `RUN-UP-005` |
| `commit-ph-04-b` | 同上；diagnosis/handoff/link/pairing checks | `planned` | `blocked` | `wait_design` | `RUN-UP-005/006` |
| `commit-ph-04-c` | 同上；projection identity/no-write checks | `planned` | `blocked` | `wait_design` | `RUN-DDD-003`、`RUN-UP-004/005` |
| `commit-ph-05-a` | 同上；header-first/no-payload/no-ACK/event-zero checks | `planned` | `blocked` | `wait_design` | `RUN-UP-008` |
| `commit-ph-05-b` | 同上；Job DTO/report/idempotency checks | `planned` | `blocked` | `wait_design` | `RUN-DDD-003`、`RUN-UP-008` |
| `commit-ph-05-c` | 同上；claim/checkpoint/no-repair/no-replay checks | `planned` | `blocked` | `wait_design` | `RUN-DDD-003`、`RUN-OPS-002` |
| `commit-ph-05-d` | 同上；report/index/redaction/link/pairing checks | `planned` | `blocked` | `wait_design` | `RUN-OPS-002`、`RUN-DOC-003` |
| `commit-ph-06-a` | 同上；baseline/preflight/selected seam checks | `planned` | `blocked` | `wait_design` | `RUN-UP-001~008`、`RUN-OPS-001~002` |
| `commit-ph-06-b` | 同上；evidence/VETO/handoff/independent review checks | `planned` | `blocked` | `wait_design` | `RUN-OPS-001~002`、`RUN-DOC-003` |

这些 skeleton 只提供未来恢复入口，不能被解读为当前实现授权。项目级 implementation ledger 只把第一个 boundary 标为 future current candidate，实际 `current_boundary` 在目标仓和 design baseline 到达前保持 `none / not_activated`；未来其余 boundary 必须为 `planned / wait_until_current`。

### 7.6 implementation ledger 初始合同

`implementation_execution_ledger.md` 初始内容必须声明：

| 字段 | 初始值/口径 |
|---|---|
| `project` | `L5-runner` |
| `design_repo` | `/home/aris/Projects/quantalithos-design` |
| `implementation_repo` | `/home/aris/Projects/quantalithos-runner`（计划路径，不证明存在） |
| `current_design_baseline` | `not_created / pending authority` |
| `current_boundary` | `none / not_activated` |
| `gate_status` | `blocked` |
| `gate_reason` | 目标实现仓、技术 authority、上游 positive seam、baseline、环境和工具链未闭合 |
| `next_allowed_action` | `wait_design`（仅在用户确认移交且前置 authority 到达后，才可转为 `read_docs`） |
| `current_recovery_point` | `pre_implementation / Step 13 formal stop review` |
| `commit/run/artifact/report/evidence` | `not_created` |
| `verdict/signoff/readiness` | `none / not_asserted` |

项目级台账必须有 boundary 汇总表、open blocker 表、恢复顺序和“不允许实现者自行补 schema/port/state/config/evidence”的回流规则。它不是代码 TODO，也不能记录虚构 hash 或测试结果。

### 7.7 参考章节候选清单（只列本 Step 实际读取）

| 类别 | 引用 |
|---|---|
| 本项目正式输入 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` |
| 本项目校准来源 | `design-calibration/07_implementation_plan_calibration_flow.md`、`07_implementation_plan_step_01_input_boundary.md`～`07_implementation_plan_step_12_completion_criteria.md` |
| 通用 SOP/规范 | `standards/document/实施计划讨论流程_SOP.md`、`standards/document/实施计划书写规范.md`、`standards/document/设计文档讨论中间产物规范.md`、`standards/document/设计文档编写通则.md`、`standards/document/设计真相源闭环与可落码性标准.md`、`standards/document/代码实施台账与门禁规范.md` |
| 全局与专项上游 | `standards/global/全局项目依赖关系与裁剪规则.md`；L0-sdk、L1-artifact、L1-work、L1-governance、L1-workspace、L2-runtime、L4-sandbox、L4-observability、L4-archive 的当前正式文档和必要台账（具体路径在 §1/§3 按实际读取列出） |
| 历史材料 | README、`draft/`、旧正式 07（仅污染扫描，不提供 authority） |

## 8. 回填草稿与装配后停审口径

正式 07 的正文装配规则：

1. 顶部明确 `formal_stop_review_required`、实施未开始和所有 blocker；正文不填实际结果。
2. §1～§12 按第 7.1 来源矩阵回填，每章保留最小来源块和延伸阅读。
3. §13 只列实际读取的规范、正式输入、校准来源和历史材料限制。
4. 正式正文使用阶段/任务/门禁/证据/交付语言，不复制 03 的字段契约或 05/06 的全部测试/验收真相源。
5. implementation ledger 与 18 skeleton 在正文和台账中都明确 `planned / blocked / waiting`，不生成实现事实。
6. 装配后立即停止 07 审查；后续只有用户明确确认后，才可讨论实现移交。

## 9. 持续 blocker、待确认和装配后重开触发

| ID/组 | 装配影响 | 正式正文处理 | 装配后重开入口 |
|---|---|---|---|
| `RUN-DDD-001~003` | 无目标仓、技术/物理/持久化 authority | §3/§8/§9/§12 写 `blocked`，不写路径/命令/实现事实 | 实现仓/ADR/工具 authority 到达后重开 Step 3/8/9、PH-01 |
| `RUN-UP-001~008` | 正向 Artifact/Governance/Sandbox/Runtime/Obs/Archive/platform/SDK seam 未闭合 | §4/§5/§8/§9 保留 conditional adapter/negative/blocked | owner public contract 到达后回写 03/04/05/06，再重审受影响 boundary |
| `RUN-OPS-001~002` | 真实 integration/GRC/SLO/retention/review 未闭合 | §7/§9/§12 保持 `blocked/not_run`，不设无来源阈值 | target baseline/environment/review authority 到达后重开 PH-06 |
| `RUN-DOC-003` | 正式 07、implementation ledger、planned skeleton 的文件缺口已在本 Step 关闭；实现事实仍未建立 | 保留 `resolved_for_file_creation; implementation still blocked`，不关闭实现/环境 blocker | 用户确认移交且前置 authority 到达后，按 ledger 先 `read_docs` |
| 正式 00～06 变更 | 可能使 scope、对象、状态、TC/AC/VETO 或 mapping 失效 | 不直接改正文；先回写 owning doc，再重做受影响 Step | Step 10/12/13 targeted/full re-review |

## 10. 进入 Step 13/正式停审条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 1～12 中间产物存在且各自通过自审 | `pass` | 每个 Step 有独立状态、来源、结构化产物、回填和下一步门禁 |
| 正式章节—校准来源矩阵完整 | `pass` | §7.1 13/13 |
| 13 章主链、编号和 phase/boundary 交叉审计完成 | `pass` | 装配前后执行文本审计；无未解释占位 |
| 正文不复制详细设计、不继承旧技术 | `pass` | §2.3、§7.4 |
| implementation ledger/skeleton 时序和状态明确 | `pass` | §7.5～§7.6；创建后仍 planned/blocked/waiting |
| 当前 blocker、not_created 和无 verdict 事实保真 | `pass` | §1、§8、§9 |
| `git diff --check -- projects/L5-runner` | `pass` | 装配后执行 |
| 正式 07 装配门禁 | `completed / formal_stop_review_required` | 本 Step 完成；等待用户确认，不自动移交实现 |

## 11. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否按 SOP 先校准再装配 | `pass` | Step 1～12 已独立落盘，本 Step 只做来源收口和装配 |
| 是否覆盖书写规范 13 章主链 | `pass` | §7.1 逐章映射 |
| 是否保留每章具体 calibration 来源 | `pass` | 正式章节统一来源块，多个来源逐条列出 |
| 是否完成 phase/boundary/gate/分母交叉审计 | `pass` | 六 phase、18 boundary、GATE/TC/suite/slot/AC 等均纳入 |
| 是否按 full-restart 处理旧正式 07 | `pass` | 不继承旧正文；若存在先隔离再重建 |
| 是否避免写入实现事实 | `pass` | baseline、commit、run、artifact/report/evidence、verdict/signoff/readiness 全部保持未创建 |
| 是否按规范创建 implementation ledger 和 skeleton | `pass` | 仅 Step 13 创建；全部保持 planned/blocked/waiting |
| 是否仍有未解决 blocker 被错误关闭 | `pass` | `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*` 持续开放 |
| 是否需要提交 commit | `pass` | `commit_required=false`，不提交 |

## 12. Step 结论与最终状态

```text
current_document = 07-实施计划.md
current_step = 13
current_module = formal_assembly_traceability_boundary_skeletons
gate_status = completed / pass / formal_stop_review_required
gate_reason = 正式 07 已按 13 章主链 full-restart 装配；每章均有具体 calibration 来源，phase/boundary/gate/测试验收分母通过交叉审计，implementation ledger 与 18 个 planned boundary skeleton 已建立并保持 planned/blocked/waiting。当前仍无实现仓、技术 authority、baseline、commit、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。
next_allowed_action = wait_user_confirmation_for_implementation_handoff
formal_07_write_allowed = completed_for_step_13_only
implementation_ledger_allowed = completed_for_step_13_only
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
