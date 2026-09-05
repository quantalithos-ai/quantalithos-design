# Step 3. 收稳前置条件与阅读清单

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 3
> 回填章节：未来 07-实施计划.md §3 实施前置条件与阅读清单
> 粒度参考：projects/L1-governance/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md
> 事实等级：design-planning；本文件不表示实现仓、代码、构建、测试、artifact、report、evidence、verdict、signoff 或 readiness 已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3：收稳前置条件与阅读清单 |
| 当前状态 | completed / pass_with_explicit_blockers / serial_continuation_authorized |
| 输入基线 | Step 1 输入边界；Step 2 P0/P1/P2 范围；正式 00~06；Rust、目录、实施计划、台账和可落码标准 |
| 本步输出 | 阅读清单、阶段前阅读矩阵、永久记忆种子、git / 工具 / 仓库 / 多仓依赖检查表 |
| 正式 07 状态 | 未创建；只能在 Step 13 装配 |
| 实施仓状态 | /home/aris/Projects/quantalithos-member 当前不存在；不创建 |
| 停审方式 | 本步材料已独立落盘；用户已授权连续完成后续 Step，下一动作只能进入 Step 4 |

## 2. 本步输入

| 输入 | 状态 | 本步用途 | 使用上限 |
|---|---|---|---|
| 07 Step 1 | completed | 继承正式输入、历史隔离、baseline 与 blocker 分类 | 不把 planning baseline 升格为 implementation baseline |
| 07 Step 2 | completed | 继承 P0 member-local、negative、blocked-aware 范围和防误入规则 | 不扩大到外部成功或 24 candidate 物化 |
| 正式 00~06 | available | 作为实施规划的需求、架构、概要、详细、配置、测试和验收入口 | 不在本步重写对象、协议、测试或验收 |
| 03 Step 3~17、19 | completed | 读取 Rust、布局、模块、Port、协议、flow、state、persistence、error、config、observability、test-cut 和 handoff 入口 | 仅作索引和前置检查，不替代正式 03 |
| 规范与 SOP | available | 固定阶段、台账、证据、提交和恢复纪律 | 不生成项目业务结论 |
| 本地 sibling 目录 | read-only checked | 确认唯一编译期候选及其他协作关系 | 不修改 sibling，不将运行期关系写成 Cargo 依赖 |

## 3. SOP 问题回答

### 3.1 实施者必须先读哪些文档？

实施者必须按以下顺序恢复，而不是从聊天摘要、旧 README 或旧实现假设开工：

1. 先读项目级实施台账和当前 boundary 台账，确认 design baseline、gate_status、next_allowed_action、用户改动保护和 blocker。
2. 读正式 00~02，恢复需求、owner、数据归属、CP01~CP07 和非范围。
3. 读正式 03 及当前 boundary 相关的 03 calibration，恢复可落码契约；字段、DTO、状态、Port、flow、Store 和错误缺口必须回写 owning Step。
4. 读正式 04~06，恢复配置绑定、测试切口、artifact/report 规则、验收 AC/VF/VETO 和风险接受口径。
5. 读正式 07（完成后）以及当前 boundary 的 07 calibration，恢复 phase、commit、门禁和交付纪律。
6. 读通则、中间产物规范、真相源闭环标准、全局依赖规则、对应 SOP/书写规范、代码实施台账规范、Rust 编码规范和目录组织规范。
7. 按阶段前阅读矩阵补读具体 calibration 文件；不要求一次性阅读整个 calibration 目录。

### 3.2 语言、编码和目录约束是什么？

目标实现形态是 planned Rust 2024 workspace，最低兼容 Core contracts 当前 rust-version 1.93。Rust 标识符、模块名、公开 API 的 rustdoc、普通注释、错误说明和测试��默认使用英文；设计仓正文可以使用中文。实现仓目录、workspace member、Cargo package、Rust library crate 和 binary 规则来自目录组织规范，L2 只出现在设计仓导航，不能泄漏到代码命名。

projects/README.md 仍保留 member-Go 的历史语言建议；该建议与当前架构拆分和 03 Step 3 的 authority audit 不同，已由 L2M-DOC-002 关闭为 planned Rust 结论。若未来出现正式 Go authority、Core binding 或 00/01 回开，必须同时重开本 Step 与 03 Step 3/4，不得并列维护两套实现布局。

### 3.3 是否必须读取提交规范和历史提交？

必须。实现仓提交标题固定为英文 type(scope): subject，body 和文件分组也使用英文；当前 design 文档仓若发生经授权的提交，遵循 projects/README.md 的英文 type、中文 subject/body 和固定 Co-Authored-By 规则。实现者必须在目标实现仓读取项目提交规范及近期合格提交，不能把 design 仓中文提交格式带入实现仓。

项目级 git identity 的要求是：

~~~bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
~~~

这些命令只允许在获授权的目标实现仓项目级配置中执行，不使用 --global；当前设计仓不执行配置修改。

### 3.4 是否需要真实数据库、Bus、Runtime 或宿主才能开始 P0？

不需要真实外部系统才能规划或实现 P0 的 member-local、negative 和 blocked-aware lane。P0 的前置检查只需要确认：

- Core contracts 的目录、package、crate 和最低 Rust 版本可被目标 workspace 引用；
- deterministic Clock、ID、digest、logical Store、UoW、resolver/handoff slot 和 fake parity 的设计闭环已通过；
- external slot 不可用时能返回 Blocked、Waiting、Unknown 或 NotAvailable；
- 测试脚本可以生成固定 run 的 raw artifact/report。

真实 host、Runtime、Bus、image、credential、screening owner、physical Store、observability backend 和 production workload 只在相应 owner 合同闭合后作为 P1 或后续 qualification。当前不得因为环境存在或可模拟就宣称正向成功。

### 3.5 本地多仓依赖如何分类？

当前只允许把 /home/aris/Projects/quantalithos-core/crates/contracts 作为 planned compile candidate，未来 Cargo 形式为：

~~~toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
~~~

L0-bus、L0-sdk、L2-runtime、L2-tools、L2-member-service、L2-member-images、L1-identity、L1-governance、L1-conversation、L1-artifact 及其它仓均不是当前 Cargo path dependency。它们分别通过 runtime Port、event Consumer、typed ref、resolver、handoff、projection 或 test fake 协作。目录存在不等于合同闭合；目录不存在也不能被 fake 伪装为已实现。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 目标实现仓 | /home/aris/Projects/quantalithos-member 不存在 | 无法执行 Cargo、代码、测试或实现台账 | 记录 L2M-DDD-001；所有实现动作等待独立授权 |
| 设计基线 | HEAD 为 3b4e1a1，但 L2-member 正式与 calibration 有未提交/未跟踪材料 | 实现端不能仅凭 HEAD 复现当前结论 | 标为 dirty planning baseline；移交前固定 manifest/tree baseline |
| 语言建议 | projects/README.md 的 member-Go 与 03 的 Rust authority 不一致 | 可能产生双布局或错误 package 命名 | 承接 L2M-DOC-002 的 planned Rust 裁决并设回开条件 |
| 依赖判断 | 本地多个 sibling 目录可能诱导 path dependency | 运行期/事件协作被误写成 compile dependency | 只保留 Core contracts 候选，其他关系逐项分类 |
| calibration 数量 | 03~06 中间产物较多 | 全量阅读成本高且可能漏掉当前边界 | 用阶段/边界阅读矩阵定向读取 |
| 台账与脚本 | implementation ledger、boundary skeleton、脚本和报告尚不存在 | 可能把计划写成执行事实 | 只定义路径和门禁；Step 13 才创建 planned skeleton |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阅读方式 | 依赖分散的 00~06 和对话 | 项目级恢复、正式链、标准、阶段矩阵四层读取 | 防止漏读和历史污染 |
| 技术栈 | README 有 Go 建议，旧材料有多种载体 | planned Rust 2024，来源和重开条件明确 | 保持单一可审计方向 |
| 外部依赖 | sibling 可能被统称为依赖 | compile/runtime/event/ref/adapter/fake/persistence 分开 | 避免 Cargo 边界越权 |
| 实现台账 | 可被误解为现在就能建 | 路径、生成时机和缺失处理已固定，Step 13 才建 | 防止空台账制造实现许可 |
| 永久记忆 | 容易自由总结业务 schema | 只保留机械投影的执行规则和规范索引 | 防止第二真相源 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一次性阅读全部 calibration | 形式上完整 | 成本高，当前 boundary 重点反而不清楚 | 不采用 |
| 按 phase / boundary 定向阅读 | 能把实现判断绑定到来源 | 需要 Step 5/6 继续维护矩阵 | 采用 |
| 目标仓缺失即停止全部 07 | 立即暴露环境问题 | 不必要地阻断规划和 blocker 设计 | 不采用；只阻断实现移交 |
| 把缺失 sibling 用 fake 成功替代 | 可以快速演示 | 破坏 owner truth 和事实等级 | 不采用 |
| 将对象/状态摘要写入永久记忆 | 后续查阅方便 | 形成过期第二 schema | 不采用 |

## 7. 结构化中间产物

### 7.1 实施前置阅读清单

| 文档 / 材料 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 项目级设计台账 | projects/L2-member/design-calibration/project_execution_ledger.md | 恢复文档级状态、授权、blocker 和 next action | 在错误 Step 或错误事实等级上继续 | 记录读取时间和当前恢复点 |
| 正式需求 | projects/L2-member/00-需求文档.md | 恢复 C-L2M、FR、BR、NFR、AC、VF、owner 和非目标 | 范围膨胀或遗漏否决项 | 能回指本 boundary 覆盖的 C/FR/AC |
| 正式架构 | projects/L2-member/01-架构设计.md | 恢复 truth、依赖、通信和外置 owner | 把外部 truth 纳入本仓 | 能说明每个跨仓关系的分类 |
| 正式概要 | projects/L2-member/02-概要设计.md | 恢复 CP01~CP07、主要组件和流程骨架 | 按文件/对象横切实施 | 能说明本 phase 的功能纵切 |
| 正式详细 | projects/L2-member/03-详细设计.md | 读取当前正式字段、Port、协议、flow、state、Store、error 和 test-cut 入口 | 实现端自行补设计 | 能定位对应正式章节和 calibration |
| 正式配置 | projects/L2-member/04-配置设计.md | 恢复 profile、strict validation、secret、slot、rollback | 用配置改变不变量或伪造 Ready | 能说明 raw/validated/binding 三层 |
| 正式测试 | projects/L2-member/05-测试方案.md | 恢复 suite、TC、artifact/report、失败和复验口径 | 最后补测或静态造证据 | 能指出当前 boundary 的 suite 和输出 |
| 正式验收 | projects/L2-member/06-验收标准.md | 恢复 AC、VF、VETO、风险接受和送验条件 | 把 planned 写成 pass | 能指出失败后的结论规则 |
| 正式实施计划 | projects/L2-member/07-实施计划.md | 恢复 phase、boundary、gate、回退、交付纪律 | 越界、跳 phase 或漏台账 | 开工前读取当前版本 |
| 03 校准链 | projects/L2-member/design-calibration/03_ddd_calibration_flow.md 及 Step 1~19 | 追溯 schema/Port/flow/state 的 owning source | 读取旧材料或误解 blocker | 当前 boundary 列出具体 Step 文件 |
| 04~06 校准链 | 对应 design-calibration/04_*、05_*、06_* | 追溯配置、测试、验收和证据决定 | 漏掉下游门禁 | 矩阵按边界列出文件 |
| 规范总链 | standards/document/设计文档编写通则.md；设计文档讨论中间产物规范.md；设计真相源闭环与可落码性标准.md；全局项目依赖关系与裁剪规则.md | 固定真相源、事实等级、依赖裁剪和写入门禁 | 把标准当业务事实或反之 | 开工前签名式 checklist（不产生证据） |
| 需求流程与书写 | standards/document/需求文档讨论流程_SOP.md；需求文档书写规范.md | 理解需求回指和历史隔离 | 反向改写需求 | 文档审查 |
| 01~07 对应流程 | standards/document/架构设计讨论流程_SOP.md；概要设计讨论流程_SOP.md；详细设计讨论流程_SOP.md；配置设计讨论流程_SOP.md；测试方案讨论流程_SOP.md；验收标准讨论流程_SOP.md；实施计划讨论流程_SOP.md | 恢复各层职责和停审方式 | 用 07 替代上游设计 | 章节来源审计 |
| 实施计划书写 | standards/document/实施计划书写规范.md | 固定 13 章、phase、boundary、门禁和来源块 | 正式文档结构不合规 | §13 静态检查 |
| 实施台账规范 | standards/document/代码实施台账与门禁规范.md | 固定项目级、boundary 级和 scratch 台账 schema | 没有 gate evidence 或误授权 | 台账字段检查 |
| Rust 编码 | standards/coding/rust.md | 固定英文源码、rustdoc、命名、格式和安全实践 | 实现仓语言/风格漂移 | 目标仓 lint/审查 |
| 目录组织 | standards/document/子项目目录与代码文件组织规范.md | 固定 repo、workspace、package、crate、script、artifact、report 目录 | 架构层级泄漏到代码 | Cargo metadata / path scan |
| 项目总约束 | projects/README.md §1.1、§2.3、§8 | 读取设计/实现仓边界、运行时能力型写法和提交纪律 | 误继承历史语言或 commit 规则 | 交付前复核 |

### 7.2 阶段实施前阅读矩阵（前置阅读车道）

正式 PH 编号在 Step 5 才冻结；本表先用功能车道表达必须提前读取的材料，Step 5/6 将其映射到具体 phase/boundary。

| 前置车道 | 必读正式章节 | 必读 calibration | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| workspace / local composition | 03 §3~§5、04 §3~§9、05 §8~§9、06 §3~§4 | 03 Step 3/4/5/7/14；04 Step 6/9；05 Step 8/9；06 Step 3/4 | 确认 Rust、七 crate、Core path、profile、script/report root 和 baseline | 目标 repo、Core manifest、命名和设计 baseline 均有可核验记录 |
| CP01 presence / host | 03 §5~§12、05 §3~§7、06 §5~§8 | 03 Step 6/7/8/9/10/11/12/13 | 确认双锚、local admission、presence、attempt、UoW、状态和拒绝路径 | 正向 credential/host seam 未闭合则只启用 local/negative lane |
| CP02 inbound / CP03 Runtime | 03 §5~§13、05 §3~§7、06 §5~§8 | 03 Step 6/7/8/9/10/11/13；05 Step 6/9；06 Step 5/7 | 确认 source/scope/screening、body-free delivery、attempt/reception 和 blocker | source/schema/mapping 未闭合则必须得到 blocked/waiting carrier |
| CP04 outbound / CP05 trace | 03 §5~§15、05 §3~§7/§10/§13、06 §5~§11 | 03 Step 6/7/8/9/10/11/12/13/15；05 Step 9/13；06 Step 7/10/11 | 确认 local material、attempt/gap、trace、redaction、24 candidate non-materialization | 不得存在 publisher/outbox/route 或 external success claim |
| CP06 mirror / CP07 read | 03 §5~§15、04 §7~§12、05 §3/§4/§6/§9/§13、06 §5~§10 | 03 Step 6/7/8/9/10/11/14/15/16；04 Step 7/9/11；05 Step 9/13；06 Step 7/10 | 确认 safe snapshot/resolution、projection、freshness、Query no-write 和证据 | view DTO、rebuild source、stale/gap posture 能回指正式章节 |
| cross-protocol / jobs | 03 §7~§13、05 §6~§13、06 §7~§13 | 03 Step 8/9/11/12/13/16；05 Step 6/9/11/13；06 Step 7/10/12 | 确认 10/16/14/5 分母、typed replay、receipt/report 和 no-source-repair | relation、digest、result kind、report path 与 boundary 一致 |
| release / handoff | 04 §9~§14、05 §9~§14、06 §10~§14、07 §7/§11/§12 | 04 Step 10/11/14；05 Step 9/13/14；06 Step 10/11/14 | 确认固定 run、artifact/report pairing、redaction、VETO 和交接 | 无真实 run 时只能保持 planned/blocked/not_run，不能送验 |

### 7.3 实施台账入口

| 台账 | 路径 | 创建时机 | 每次读取时机 | 缺失处理 |
|---|---|---|---|---|
| 项目级实施台账 | projects/L2-member/design-calibration/implementation_execution_ledger.md | Step 13、Boundary Gate Matrix 收稳后，实施移交前 | 每次继续、恢复、baseline 变化、进入 boundary、提交和 handoff 前 | 先补台账，不改代码 |
| boundary 级台账 | projects/L2-member/design-calibration/implementation-boundaries/<boundary_id>.md | Step 13 一次性预创建全部 planned skeleton | 当前 boundary 开工、修改、跑 gate、提交、handoff 前 | 缺当前台账不得修改代码；缺未来骨架不得移交 |
| 实现仓 scratch 台账 | /home/aris/Projects/quantalithos-member/.codex/implementation_ledger.md | 实现仓授权后，若项目采用 | 本地恢复工作区、touched files、commands 和用户改动 | 可选；不能替代设计仓台账 |

项目级台账只能激活一个 current_boundary。未来 boundary 必须保持 status=planned 或 blocked、next_allowed_action=wait_until_current；不得提前写 pass、commit hash、run_id 或 evidence。

### 7.4 代码仓、命名和工具环境前置检查

| 检查项 | 要求 | 检查方式 | 未满足时处理 |
|---|---|---|---|
| 实现仓路径 | /home/aris/Projects/quantalithos-member | 目录检查 | L2M-DDD-001；暂停实现移交 |
| workspace member | crates/contracts、domain、application、infra、api、worker、jobs | Cargo metadata 和目录检查 | 回到 03 Step 4/07 Step 4 |
| package 名 | member-<role> | Cargo.toml 检查 | 暂停并回写布局 |
| library crate 名 | member_<role> | Cargo.toml [lib] 检查 | 暂停并回写布局 |
| binary | 当前 none planned | 不创建 src/bin 或 process topology | 需新 authority 时重开 Step 4/5 |
| 架构层级泄漏 | 不得出现 L0/L1/L2/l0_/l1_/l2_ 代码命名 | path/package/module scan | 暂停并修正 |
| Rust toolchain | 满足 Rust 2024、Core MSRV 1.93 | rustc --version、cargo --version | 暂停涉及编译的 boundary |
| Cargo path | 仅 Core contracts path candidate | Cargo.toml 与目录检查 | 删除错误 sibling 依赖并回写 |
| git identity | project-local quantalithos-labs / quantalithos.ai@gmail.com | git config 检查 | 不得提交，先修正 |
| script 目录 | scripts/gates、scripts/checks、scripts/reports、scripts/dev（如需要） | 目录和命名检查 | 记录为 PH-01 交付物，不放入 reports |
| evidence 目录 | artifacts/test/<run_id>、reports/runs/<run_id>、reports/acceptance、reports/review | runner dry-run / path check | 缺失则阻断 evidence gate |
| run 引用 | 固定 run_id，禁止 latest | 静态 scan | 阻断 report/evidence |

### 7.5 Agent 启动与永久记忆种子

以下表是唯一可机械投影的永久记忆来源；它只保存执行规则和规范索引，不复制 34 个对象、协议字段、状态矩阵、业务规则或测试全文。

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档/章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|
| MEM-L2M-001 | project | 目标仓 | 任何实现前先核验 /home/aris/Projects/quantalithos-member；目录不存在时不得在 design 仓写代码，必须等待实现授权或回报路径缺口。 | 07 §3、目录组织规范 | 07 §3；目录组织规范 §4 | 首次开工、路径变更 | until superseded | 正式文档优先，暂停并刷新 | 是 |
| MEM-L2M-002 | project | 编译依赖 | 唯一 planned sibling compile candidate 是 Core contracts local path；其它仓只能按 runtime/event/ref/adapter/fake/persistence seam 协作。 | 03 §3、07 §3 | 03 §3；07 §3 | Cargo manifest 或 phase 变化 | until superseded | 暂停并回报 dependency violation | 是 |
| MEM-L2M-003 | project / phase / boundary | 源码规范 | Rust identifier、rustdoc、普通注释和测试名默认使用英文；开始 boundary 前读取 standards/coding/rust.md。 | 03 §3、07 §3 | 03 §3；Rust 规范 | 技术栈或规范路径变化 | until superseded | 正式规范优先 | 是 |
| MEM-L2M-004 | commit-boundary | 设计真相源 | 实现者不得自行补字段、DTO、Port、状态、version、source、mapper、config 或 evidence；无法 1:1 落码时暂停并回写 owning design source。 | 真相源闭环标准 §2/§9 | 07 §3、03 §16 | 每个 boundary 开工 | until superseded | wait_design | 是 |
| MEM-L2M-005 | project / phase | 证据路径 | raw artifact 固定为 artifacts/test/<run_id>，可读报告固定为 reports/runs/<run_id> 与 reports/acceptance；正式引用不得使用 latest。 | 05 §9/§13、07 §3 | 05、07 | gate/report 脚本变化 | until superseded | 修路径并重跑 | 是 |
| MEM-L2M-006 | project / boundary | 交付前审计 | 移交实现或进入新 baseline 前，按 phase/commit boundary 审计正式 03/05/06/07；未通过项先回写设计并固定新 baseline。 | 07 §3/§12、真相源闭环标准 §9 | 07 §3、§12 | 实现移交、baseline 变化 | until superseded | 暂停移交 | 是 |
| MEM-L2M-007 | project | 设计修复经验 | 修复设计文档后先判断是否同一项目，再判断是否产生可复用经验；需要时同步标准/SOP/项目记忆和至少一个示例，并输出交接说明。 | 07 §3、projects/README.md §8.2 | 07 §3；projects/README.md | 每次设计修复 | until superseded | 先完成经验检查再提交 | 是 |
| MEM-L2M-008 | project / boundary | 台账纪律 | 每次继续、恢复、进入 boundary、跑 gate、提交或 handoff 前先读项目级和当前 boundary 台账；gate_status=blocked 时不得继续实现。 | 代码实施台账规范 §3~§7 | 07 §3；台账规范 | 台账 schema 变化 | until superseded | 先补/修台账 | 是 |
| MEM-L2M-009 | project / phase | 事实等级 | fake、planned、blocked、waiting、not_run 或 unknown 不得写成 external accepted、delivered、observed、healthy、evidence、verdict 或 readiness。 | 00/05/06、真相源闭环标准 | 00 §15；05 §13；06 §11/§14 | 新 external seam | until superseded | 保留原 disposition | 是 |
| MEM-L2M-010 | project / boundary | 事件红线 | L2M-UP-005 关闭前，24 个 outbound semantic candidate 只能保持 zero-configuration/non-materialization，不得创建 event、publisher、outbox、route、topic、retry 或 DLQ。 | 03 §7、06 §7 | 03 §7；06 §7 | Core/Bus 合同变化 | until superseded | 回写协议并重审 | 是 |

#### 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | 本表覆盖规范、依赖、设计缺口、台账、证据和经验沉淀 | 不生成永久记忆 |
| 只写表内文本 | 逐字投影，不自由总结 | 删除自由内容并重投影 |
| 来源完整 | 每条有规范路径、来源章节、刷新与冲突处理 | 不写入该条 |
| 不复制 truth | 无字段、DTO、状态、业务规则或测试全文 | 删除并改为索引 |
| 技术栈不漂移 | 路径来自阅读清单，Rust 只在本项目 boundary 明确时使用 | 暂停并补清单 |
| 临时约束隔离 | 当前“不得提交/不得创建实现仓”标为本轮设计执行纪律，不写成长期默认记忆 | 从永久记忆删除 |

## 8. 回填草稿

未来正式 07 §3 应说明：实现者必须先读取当前项目台账、正式 00~06、当前 boundary 对应的 calibration、Rust/目录/实施计划/真相源/台账规范，并按阶段实施前阅读矩阵补读。目标实现仓为 /home/aris/Projects/quantalithos-member，当前不存在；唯一 planned Cargo sibling dependency 为 ../quantalithos-core/crates/contracts。运行期、事件协作、typed ref、adapter、fake 与 persistence 关系不得写成 package dependency。实现前必须核验七个 planned library crate、package/crate 命名、无 binary、项目级 git identity、脚本目录以及 artifacts/test/<run_id> 和 reports/runs/<run_id> 路径。正式 00~07 优先于 calibration；仍有字段、DTO、Port、状态、证据或 phase boundary 不清楚时必须暂停并回写设计。永久记忆只能由本节种子表机械投影，且必须包含交付前 03/05/06/07 审计和设计修复后的经验沉淀检查。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 | 截止/触发 |
|---|---|---|---|
| immutable design baseline | 所有 Design Gate | Step 11/12 定义 manifest/tree/hash 记录 | 实现移交前 |
| 目标实现仓创建授权 | 所有代码、build、test 和 implementation ledger 执行 | 保持 L2M-DDD-001，不创建 | 独立实现授权 |
| Core contracts 真实兼容性 | contracts 依赖的 compile lane | 仅记录检查方式，不宣称兼容 | PH-01 开工前 |
| physical Store/UoW | durable、crash、性能和 operations | 保持 L2M-DDD-002；不选产品 | 受影响 boundary 前 |
| exact host/image/Runtime/Core/Bus/credential/screening/subject contract | P1 positive lane | blocked/waiting；不私补 | owner formal contract 发布 |
| script runner 和 report generator | 真实 evidence | 只规划入口和参数 | PH-08 前 |
| workload / SLO authority | NFR hard conclusion | Step 9 spike，不写数字 | owner/QA/SRE 提供 authority |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 前置阅读清单完整 | 通过 | 正式链、标准、上游和兄弟材料均有用途与风险 |
| 阶段前矩阵可执行 | 通过 | 先按功能车道，Step 5/6 冻结正式 phase/boundary |
| 永久记忆种子可机械投影 | 通过 | 无业务 schema 和临时执行要求 |
| 仓库/命名/工具/依赖检查完整 | 通过 | 目标仓缺失作为 blocker 保留 |
| blocker 未被弱化 | 通过 | L2M-UP-001~008、L2M-DDD-001~007、scope_supersede_gap、L2M-UP-005 仍开放 |
| 可进入 Step 4 | 通过 | 下一步只抽取实施对象与交付物，不定义 phase/commit |
