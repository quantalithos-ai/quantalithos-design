# Step 1. 确认实施输入边界

> 项目：`L2-member`
>
> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
>
> 回填位置：未来正式 `07-实施计划.md` §1「与上游文档的关系声明」
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_01_input_boundary.md`。只参考输入、风险和门禁结构，不继承其项目事实。
>
> 状态：`completed / pass_with_explicit_blockers / stop_review`
>
> 事实边界：本 Step 仅判定是否可以制定实施计划；不授权创建实现仓、写代码、运行测试、生成 evidence、形成 verdict / signoff / readiness 或提交 commit。

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 1：确认实施输入边界 |
| 前序门禁 | 正式 `06-验收标准.md` 已完成并停审；用户最新“继续”授权进入 `07` 的 Step 1。 |
| 本步目标 | 确认 `00~06`、实施计划标准和当前外部边界是否足以制定未来实施路径，并将缺口分为计划可继续、实现 blocked 与执行期 pending。 |
| 输出文件 | `projects/L2-member/design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| 正式正文 | `formal_07_write_allowed = false_until_step_13`；本 Step 不创建正式 `07-实施计划.md`。 |
| implementation ledger | `implementation_ledger_write_allowed = false_until_step_13`；本 Step 不创建 `implementation_execution_ledger.md` 或 boundary skeleton。 |
| 实现 / 提交 | `implementation_repo_write_allowed = false`；不创建 `/home/aris/Projects/quantalithos-member`，不写代码、不运行测试、不提交。 |
| 停审方式 | 本 Step 完成后立即停审；须由用户新确认后才能创建 Step 2。 |

## 2. 本步输入

### 2.1 项目正式输入

| 输入 | 当前状态 | 本 Step 用途 | 风险 / 使用上限 |
|---|---|---|---|
| `projects/L2-member/00-需求文档.md` | current formal；`Draft / formal-00-complete / review-pending` | 固定项目定位、能力、P0 边界、owner、非目标、AC / VF 方向 | 不用实施便利性改写需求。 |
| `projects/L2-member/01-架构设计.md` | formal 01 complete / stop review | 固定 BC01～BC07、依赖分类、truth owner、local-truth-first 和架构红线 | 不重选通信、容器、transport 或外部 owner。 |
| `projects/L2-member/02-概要设计.md` | formal 02 stop review | 固定 CP01～CP07、主要组成部分、对象 / 接口 / flow / state 骨架 | 不在实施计划新增主体或把 CP 当 package。 |
| `projects/L2-member/03-详细设计.md` | completed / pass with blockers / stop review | 直接实施契约入口：七模块、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态、logical Store / UoW / replay / error / configuration / observability | 可用于拆 phase / boundary；字段级内容仍必须回读对应 `03_ddd_step_*`，且 `L2M-DDD-*` / scope gap 不可被实施端补造。 |
| `projects/L2-member/04-配置设计.md` | completed / stop review | 固定 member-local composition、validated ref、profile、fail-closed、fake / blocked posture和外部 binding 限制 | 不把 logical configuration 当作实际部署或可用 adapter。 |
| `projects/L2-member/05-测试方案.md` | completed / pass with blockers / stop review | 固定 planned TC / EV candidate、suite、环境、数据、自动化和 evidence 路径 | planned TC / EV 不是已执行测试或真实证据。 |
| `projects/L2-member/06-验收标准.md` | completed / pass with blockers / stop review | 固定 AC / VF、P0 gate、risk / veto、artifact / report pair 和裁决纪律 | 没有固定 run、真实 evidence 或当前 verdict。 |
| `03_ddd_step_17_implementation_handoff.md` | completed / pass with blockers | 提供 07 的字段、DTO、Port、flow、state、Store、测试切口、phase 预复核和 blocker 回指索引 | 不替代正式 03；不能当 implementation start signal。 |
| `03_ddd_step_19_formal_document_assembly.md` | completed | 证明正式 03 已按 calibration 链装配 | 不解除 DDD 或上游 blocker。 |

### 2.2 过程、落码与专项输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| `实施计划讨论流程_SOP.md` | 已读取 | 固定 Step 1～13、输入问题、停审和正式装配次序 | 不产生项目实施结论。 |
| `实施计划书写规范.md` | 已读取 | 固定 13 章、phase / task / gate / commit boundary、阅读矩阵与事实边界 | 不复制 DDD schema 到 07。 |
| `代码实施台账与门禁规范.md` | 已读取 | 固定 Step 13 后的项目级 ledger、boundary ledger 和 planned skeleton 预创建要求 | 本 Step 不提前写 ledger / skeleton，且 future status 只能 planned / blocked / waiting。 |
| `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md` | 已读取 | 固定三层恢复、事实等级、1:1 落码回流和 compile / runtime / event / ref / adapter / fake 分类 | 不替代任何 owner contract。 |
| `projects/L2-runtime/00~07`、`projects/L2-tools/00~07` | 当前正式 / 可引用上游 | 固定 Runtime loop / context / plan / outcome 与 Tools action contract 的外置边界 | member 仅规划 ref / safe material / local attempt / blocked seam。 |
| `projects/L0-core`、`L0-bus`、`L0-sdk` 当前材料 | 当前 foundation 输入 | 固定 shared primitive、event collaboration、SDK boundary | 仅 Core 是 planned compile candidate；Bus / SDK 不得伪装为 package dependency。 |
| `projects/L1-work`、`L1-identity`、`L1-governance`、`L1-conversation`、`L1-artifact` 当前材料 | current truth input / granularity reference | 固定项目主语、identity anchor、policy、conversation / artifact truth 外置 | 只消费 typed ref / safe result / body-free material。 |
| `projects/L2-member-service`、`projects/L2-member-images` 当前正式或明确可引用材料 | sibling read-only input | 固定 host lifecycle、pinned image supply 的 owner 方向 | exact IPC、credential、release、manifest、compatibility、handoff 与 readiness 仍 pending。 |

### 2.3 历史材料隔离

| 材料 | 定位 | 本 Step 处理 |
|---|---|---|
| 旧 README、旧正式 `00/01/02/03/05/06` | `historical_material` | 只作污染审计，不作为当前实施基线。 |
| CloudEvents / W3C Trace Context 的旧 member 描述 | historical candidate | 只有经当前 Core authority 可承接的 shared envelope 类别可以被引用；member-specific schema / route 不继承。 |
| AG-UI、UDS、launch token、fixed port、supervisord、旧 P95 和旧 route / topic | historical / unverified | 不进入当前 phase、task、boundary、配置或测试 gate。 |

## 3. SOP 问题回答

1. **当前仓是否已经具备完整的 `00 / 01 / 02 / 03 / 05 / 06` 文档？**

   是。`00` 至 `06` 均存在，且 `04-配置设计.md` 已生成。`07-实施计划.md` 尚不存在，正是本轮 Step 1～13 的目标。现有正式文档处于设计完成 / 停审或待审阅状态，足以作为规划输入，但不等于已形成可复现的实现移交基线。

2. **哪些上游文档版本是本轮实施计划的基线？**

   本轮使用当前工作区下的新版正式 `00~06` 及其明确列出的 calibration 来源。当前设计仓 `HEAD` 为 `3b4e1a1`，但 `projects/L2-member/` 存在未提交 / 未跟踪的当前设计材料；因此本轮基线是 `current dirty workspace planning baseline`，而不是 immutable commit、tree digest 或 implementation baseline。正式移交实现前必须重新固定完整 source manifest / baseline。

3. **详细设计是否已经足以支持 1:1 实现？**

   `03` 及其 Step 17 提供足够的模块、对象、Port、协议、flow、状态、logical persistence、configuration 与 test-cut 输入，可进入实施 phase 和 boundary 的规划讨论。它不表示所有 lane 现在都能直接开工：每个未来 boundary 必须逐项复核字段 / factory、DTO / carrier、state helper、Port / Store / UoW、test / acceptance mapping 与 phase dependency；`L2M-DDD-002~007`、`scope_supersede_gap` 和所有外部 owner seam 必须保留 blocked / wait_design。

4. **测试方案和验收标准是否足以定义阶段门禁？**

   是，作为 planned gate input。`05` 已定义 planned test cut、TC、EV candidate、suite、配置 / 环境、artifact / report 结构；`06` 已定义 P0 AC / VF、VETO、风险接受和最终裁决的前置条件。它们没有产生真实 run、artifact / report pair、evidence instance、verdict、signoff 或 readiness，故 07 只能安排未来门禁和输出路径，不能填写结果。

5. **是否存在上游文档之间的冲突？**

   当前 `00~06` 的 canonical member-local 主线可用于实施规划；本步未发现要求立即回写 `00~06` 的新冲突。已知的非可忽略缺口是：dirty baseline、目标实现仓缺失、物理 Store / UoW 产品未选、DDD helper / receipt / version gap、以及 host / image / Runtime / Core / Bus / credential / policy / subject 的 exact contract 未闭合。历史 CloudEvents、AG-UI、UDS、launch token 等与当前 transport-neutral / Core-owned authority 不一致，已隔离而非继承。

6. **详细设计是否已经完成字段、DTO、状态和 phase boundary 复核？**

   字段 / DTO / state 的设计级预复核入口已由 `03_ddd_step_17_implementation_handoff.md` 固定，且正式 03 已装配；但 phase / commit boundary 尚未由 07 定义，故 boundary-level closure 和经验复核尚未完成。Step 5～6 必须在不补写 schema 的前提下完成该复核；若任何必需项不可 1:1 回指，必须回写 owning design Step 并重审。

7. **测试方案和验收标准是否使用详细设计的正式字段、状态、接口和证据名称？**

   当前 `05` / `06` 已以七模块、10 / 16 / 14 / 24 / 5 协议分母、28 个状态主语和 `TC-L2M-*` / `EV-CAND-L2M-*` 作为设计级名称入口，并明确 24 个 candidate 不得物化。Step 7 仍须将每个 phase / boundary 映射到准确 test / acceptance gate，避免把 planned candidate、blocked lane 或 fake 当作通过事实。

8. **哪些缺口阻塞实施计划，哪些缺口可以记录为风险继续推进？**

   没有缺口阻塞 Step 2 的实施计划讨论。目标实现仓、immutable design baseline、physical Store / UoW、required helper / receipt / version 和所有 exact external owner contract 阻塞受影响 boundary 的实现或正向 qualification；真实 run / evidence / verdict / signoff / readiness 与 workload / SLO authority 属于执行期 pending。它们都必须在后续 phase / boundary 计划中显式标识，不能被降格为普通待办。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `projects/L2-member/07-实施计划.md` | 尚不存在 | 没有 phase、commit boundary、gate 或实施交接入口 | 新建 flow 与 Step 1；正式 07 留到 Step 13。 |
| `design-calibration/07_*` | 先前不存在实施计划校准链 | 无法恢复 07 的逐 Step 推理与停审点 | 新建 07 flow 和本 Step 文件。 |
| design baseline | 当前工作区有 L2-member 正式文档修改和 `04` / calibration 未跟踪内容 | 实现 agent 无法仅凭 HEAD 复现本轮输入 | 作为 implementation / handoff blocker；后续须固定完整 baseline。 |
| target implementation repo | `/home/aris/Projects/quantalithos-member` 不存在 | 无代码、build、test、implementation ledger 执行位置 | 记录 `L2M-DDD-001`；不创建仓。 |
| physical persistence | 仅有 logical Store / UoW / CAS / replay 语义，物理产品未选 | durable、crash、performance、operations lane 不可开工 | 记录 `L2M-DDD-002`；不得在 07 选择 DB / ORM / migration。 |
| DDD targeted gaps | `L2M-DDD-003~007` 与 `scope_supersede_gap` | 影响 Consumer receipt、CP04～CP07 helper / version、scope successor | 受影响 boundary 只能 blocked / wait_design；不可写 local workaround。 |
| external seams | `L2M-UP-001~008`、`L2M-UP-005` 下 24 candidate 未闭合 | host、image、Runtime、event、credential、policy、subject 正向 lane 无法 qualification | 规划 member-local / negative / blocked-aware lane；24 candidate 不安排 Event 实现。 |
| evidence / performance | 无 run、evidence，且 workload / SLO authority 未定 | 不能给出执行、性能或 readiness 结论 | 留给 Step 7 / 9 / 12 的未来 gate / spike；不填虚构结果。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施计划恢复入口 | 无 07 flow、无 Step 1 中间产物 | 新建可恢复的 flow 和输入边界记录 | 遵守逐 Step、三层台账和停审纪律。 |
| 输入边界 | `00~06`、规范和上游材料分散，容易把旧材料或 sibling 细节误作合同 | 输入按 formal / calibration / normative / upstream / sibling / historical 分层 | 防止污染、越权或依赖分类漂移。 |
| 实施许可 | 可误将正式 03/05/06 完成解读为可写代码 | 明确“可继续规划”与“不可实现 / 不可移交”分离 | 不把设计完成、planned test 或 dirty workspace 伪装为实施许可。 |
| blocker 处理 | 多类缺口散见 `03~06` | 分为 planning 可继续、implementation blocked、execution-time pending | 使后续 phase / boundary 能正确安排暂停和回流。 |
| implementation ledger | 可误提前按模板创建 | 明确 Step 13、formal boundary inventory 收稳后才创建 | 遵守 planned boundary 预创建规则，但不提前产生虚假 status。 |

## 6. 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| 直接依据 current `00~06` 生成完整正式 07 | 快速得到计划文档 | 跳过 Step、无法逐 boundary 做闭环审计、可能把 blocker 混入任务 | 不采用。 |
| 先建 flow 与 Step 1，逐 Step 停审 | 输入、风险和未来阶段可追溯；可在 phase 前发现设计缺口 | 需要多次讨论 | 采用。 |
| 因 dirty baseline / repo 缺失停止所有 07 讨论 | 最早强制交付洁净度 | 不必要地阻断设计阶段，且无法形成 fix / handoff 路径 | 不采用；标为实现移交 blocker。 |
| 忽略 dirty baseline / repo 缺失 | 讨论推进最快 | 会将不可复现基线、未存在仓和设计缺口转嫁给实现端 | 不采用。 |
| 为 external seam 预建 adapter、event、route 或 fake success | 表面上可形成完整 tasks | 越过 owner，破坏 fail-closed、事件非物化和事实等级 | 不采用；仅规划 local / blocked-aware lane。 |

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 / 材料 | 版本 / 路径 | 本计划如何使用 | 状态 | 当前风险 |
|---|---|---|---|---|
| `00-需求文档.md` | `projects/L2-member/00-需求文档.md` | 需求、能力、非目标、AC / VF 与 owner 红线 | 可用 | review-pending，不改变本 Step 的 planning input 效力。 |
| `01-架构设计.md` | `projects/L2-member/01-架构设计.md` | BC、dependency cut、truth boundary、architecture gate | 可用 | exact external seam 仍 pending。 |
| `02-概要设计.md` | `projects/L2-member/02-概要设计.md` | CP01～CP07、主要组件和 flow / state 骨架 | 可用 | 不得误拆为 physical package / process。 |
| `03-详细设计.md` | `projects/L2-member/03-详细设计.md` | boundary 的 direct implementation contract 与 calibration 索引 | 可用，但 conditional | DDD gaps、physical persistence 和 immutable baseline 未闭合。 |
| `04-配置设计.md` | `projects/L2-member/04-配置设计.md` | environment / adapter / validation / fail-closed preparation | 可用 | logical configuration 不等实际 environment / adapter readiness。 |
| `05-测试方案.md` | `projects/L2-member/05-测试方案.md` | future test cut、suite、TC / EV candidate、report / artifact path | 可用 | 无 implementation、run 或真实 evidence。 |
| `06-验收标准.md` | `projects/L2-member/06-验收标准.md` | future P0 gate、VF / VETO、risk / decision rules | 可用 | 无送验 baseline、verdict 或 signoff。 |
| `03` Step 17 / 19 | `design-calibration/03_ddd_step_17_implementation_handoff.md`;`03_ddd_step_19_formal_document_assembly.md` | boundary read / closure checklist 与正式 03 装配追溯 | 可用 | Step 6 仍需逐 boundary 复核。 |
| 07 SOP / writing / ledger standards | `standards/document/*` | process、formal structure、planned ledger / skeleton discipline | 可用 | 不能替代项目真相源。 |

### 7.2 缺失输入与风险分类表

| 缺失 / 风险 | 分类 | 阻塞范围 | 当前处理 |
|---|---|---|---|
| `07-实施计划.md` 尚不存在 | 当前任务目标 | 阻塞正式实施交接，不阻塞 Step 1～12 讨论 | 严格按 Step 1～13 生成。 |
| current design baseline 未固定 | implementation / handoff blocker | 所有实现 boundary 的 Design Gate | Step 3 / 11 / 12 定义固定 source manifest 与交接门禁；本 Step 不提交。 |
| `/home/aris/Projects/quantalithos-member` 不存在 | `L2M-DDD-001` implementation blocker | 所有代码、build、test、执行台账活动 | 只规划 future prerequisite；不创建目录。 |
| physical Store / UoW / durability 未选 | `L2M-DDD-002` design / implementation blocker | durable、crash、performance、operations boundary | 不选产品；回写或 future authorized design decision。 |
| Consumer receipt / CP04～CP07 helper / version、scope successor 缺口 | `L2M-DDD-003~007` / `scope_supersede_gap` | affected positive boundary | 受影响项 planned as blocked / wait_design；不以 fake / Store save 绕过。 |
| host、image、Runtime、Core / Bus、credential、screening、subject exact contract 未闭合 | `L2M-UP-001~008` / `UP-005` | external positive implementation / qualification | 仅 local / negative / blocked-aware phase；不建 adapter truth。 |
| 24 outbound semantic candidate 无 schema / route | `L2M-UP-005` | event / publisher / outbox / delivery boundary | 固定 non-materialization / zero configuration；不列入 Event implementation。 |
| real run / artifact / report / evidence / verdict / signoff / readiness 缺失 | execution-time pending | test / acceptance execution和交付裁决 | Step 7 / 12 只规划产生条件与 gate，不填写实例。 |
| workload / performance / SLO authority 缺失 | execution-time pending | non-functional qualification | Step 9 形成 spike / owner / trigger；不发明数字。 |

### 7.3 闭环复核预判表

| 闭环复核项 | 来源 | 当前状态 | 阻塞范围 | Step 7 后续处理 |
|---|---|---|---|---|
| 范围 / owner / dependency classification | `00~02`、全局依赖规则 | 预复核可用 | 具体 boundary 依赖待定义 | Step 5 / 6 显式绑定 phase 与 dependency cut。 |
| 字段 / factory | `03`、Step 6 object contracts、Step 17 | 可索引，非全量开工许可 | `L2M-DDD-003~007` 与 scope gap | Step 6 对每个 boundary 列 exact source，未闭合则 wait_design。 |
| DTO / Command / Query / Consumer / Job carrier | `03` Step 8、Step 17 | 10 / 16 / 14 / 5 有设计入口；24 candidate blocked | Consumer receipt、external schemas / routes | Step 6 不把 24 candidate 当 Event，并逐 boundary 审核构造链。 |
| state / transition | `03` Step 10、`05`、`06` | 28 状态主语有正式名称 | reserved helper / successor gap | Step 6 只计划现有 legal helper；缺口回写。 |
| Store / UoW / replay / idempotency | `03` Step 7 / 11 / 13 | logical semantics可索引 | physical product / durability 未选 | Step 6 / 8 分别标 physical choice 为 blocker，fake 不升级。 |
| configuration / external bindings | `03` Step 14、`04` | member-local composition 可规划 | exact adapter / credential / image / host / Runtime seam | Step 8 保持 opaque ref / safe result / unavailable posture。 |
| test / acceptance / evidence | `05`、`06` | planned gate 可用 | execution evidence 未生成 | Step 7 / 12 定义 gate，不填写 pass。 |
| phase / commit boundary | `03` Step 17 | 未定义 | 阻塞 boundary-level landability audit和实现移交 | Step 5 / 6 才能收敛。 |

### 7.4 是否允许进入下一阶段

| 判定项 | 结论 | 理由 |
|---|---|---|
| 是否允许进入 Step 2 | `pass_to_step_02` | 当前 `00~06` 和必须标准可作为实施计划输入，且缺口已分类。 |
| 是否允许实现 | `false` | 07 未完成、baseline 未固定、目标实现仓不存在、boundary closure 未完成，且 blocker 开放。 |
| 是否允许创建正式完整 07 | `false_until_step_13` | Step 1～12 必须各自完成，Step 13 才能装配。 |
| 是否允许写 implementation ledger / boundary skeleton | `false_until_step_13` | 尚无正式 phase / commit boundary inventory；提前创建会伪造可执行边界。 |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“SOP 问题回答”“实施输入边界表”“缺失输入与风险分类表”和“闭环复核预判表”小节，了解正式实施计划的输入边界和实施许可为何分离。

未来正式 `07-实施计划.md` §1 应表达：

本实施计划承接 `L2-member` 当前工作区中的正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 与 `06-验收标准.md`。`03` 是模块、字段、Port、协议、flow、状态、logical Store / UoW 与实施承接的直接入口；`05` 是 planned 测试切口、suite、TC / EV candidate 与 report / artifact 路径入口；`06` 是未来验收 gate、VETO、风险接受和裁决条件入口。实施计划只安排这些既有结论按可验证顺序落地，不重写需求、架构、schema、transport、IPC、Store 产品、测试用例或验收结果。

当前工作区是设计级 planning baseline，而非 immutable implementation baseline：`HEAD` 为 `3b4e1a1`，但 L2-member 现有正式 / calibration 材料尚未全部纳入一个可复现基线。目标实现仓 `/home/aris/Projects/quantalithos-member` 不存在；`L2M-DDD-002~007`、`scope_supersede_gap`、`L2M-UP-001~008` 与 `L2M-UP-005` 下的 24 个 semantic candidate 均未闭合。因此本计划可以继续收敛 phase 与 boundary，但不得把它解释为实现许可。正式实现移交前必须固定完整设计基线，并对每个 boundary 复核字段、DTO / carrier、state、Port、Store / UoW、test / acceptance gate 与外部 seam；不可闭合项必须 `blocked / wait_design`，不能由实现端自行补 schema、helper、adapter、event、route 或外部成功事实。

旧 README 和旧正式链中的 CloudEvents、AG-UI、UDS、launch token、固定端口、supervisord、旧 route / topic 和旧性能数字仅作历史污染审计，不能进入当前 implementation plan。`L0-core` 是唯一 planned compile candidate；其余 host、Runtime、Tools、Bus、SDK、image、identity、governance、conversation、artifact 和 observability 关系必须保持 runtime / event / ref / adapter / fake 分类。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 如何将当前 L2-member 工作区固定为完整、immutable design baseline | 影响任何 boundary 的 Design Gate 与实现可复现性 | implementation / handoff blocker；后续 Step 3 / 11 / 12 收口，不在本 Step 提交。 |
| 目标实现仓何时、由何项授权创建 | 影响所有实现活动 | `L2M-DDD-001`；仅记录 future prerequisite，不创建。 |
| physical Store / UoW / durability 的 owner 与产品决策 | 影响 durable / crash / performance lane | `L2M-DDD-002`；不在实施计划越权选择。 |
| `L2M-DDD-003~007` 与 `scope_supersede_gap` 是否先回写 03，或在 07 标为 blocked boundary | 影响 phase / commit 拆分和实现移交范围 | Step 5 / 6 逐 boundary 评估；不得弱化为普通风险。 |
| `L2M-UP-001~008` 的 owner / exact contract closure 计划 | 影响 positive host、image、Runtime、credential、policy、subject qualification | Step 8 / 9 记录 external dependency / spike / trigger；不代替 owner。 |
| workload、environment 和 SLO authority | 影响 non-functional gate | Step 9 明确 spike / owner / evidence trigger；不填阈值。 |
| future phase 和 commit boundary 的粒度 | 影响 landability audit、planned ledger inventory和回退边界 | Step 5 / 6 依 SOP 独立收敛。 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| `00~06` 输入已明确 | 通过 | 每份文档、直接 calibration 和用途已登记。 |
| 历史材料已隔离 | 通过 | 旧 README / 旧正式链只作污染审计。 |
| 缺失 / 冲突已分类 | 通过 | 分为 planning 可继续、implementation blocked、execution-time pending。 |
| 不直接生成正式 07 | 通过 | 正式装配保留至 Step 13。 |
| 不提前创建 implementation ledger / skeleton | 通过 | 仅 Step 13、formal boundary inventory 收稳后创建 planned 版本。 |
| 可进入 Step 2 | 条件通过 | 等待用户明确确认；Step 2 只讨论实施目标、范围和非范围。 |
