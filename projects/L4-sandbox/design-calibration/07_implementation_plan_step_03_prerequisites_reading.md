# L4-sandbox 实施计划 Step 3 收稳前置条件与阅读清单

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 回填章节: `07-实施计划.md` §3 实施前置条件与阅读清单
> 创建日期: 2026-07-16
> 状态: completed_reviewed_passed_to_step_4
> 本Step口径: 固定实现者开工前的阅读、规范、仓库、git、工具链、依赖、命名、台账、永久记忆、测试脚本和报告路径门禁。本Step不拆phase或commit boundary,不选择具体隔离产品,不创建正式`07`、implementation ledger、planned boundary skeleton、实现仓或任何执行事实。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 2 / pending_user_review`;用户已明确同意Step 2范围闭集并放行Step 3,随后确认本Step并放行Step 4。 | passed_to_step_4 |
| 文档级flow | Step 2已完成并获确认;本Step完成停审后已获用户确认。 | passed_to_step_4 |
| Step级输入 | Step 1已固定输入边界,Step 2已固定`MDR-SBX-P0`、P0-C / P0-Q和非范围;本Step已读取SOP、书写 /台账 /可落码性 /目录 /依赖 /Rust规范及正式`00~06`相关章节。 | passed_for_prerequisite_design |
| 正式文档写入 | 本Step只形成§3回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_3 |
| 实施台账实例 | boundary ID尚未由Step 5 / 6形成;项目级implementation ledger和全部planned skeleton只能由Step 13同步创建。 | forbidden_until_step_13 |
| 下游Step | Step 4已由用户放行;Step 5~13仍无本轮用户放行。 | step_4_only |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 3 `收稳前置条件与阅读清单`
current_module = `implementation_prerequisites_reading_reviewed`
gate_status = passed_to_step_4
next_allowed_action = 由`07_implementation_plan_step_04_objects_deliverables.md`承接
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 可审查产物 /完成门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、flow和Step 2状态。 | done | 用户确认与唯一下一动作可追溯 |
| 2 | 读取Step 3标准、正式上游和L1-governance / artifact粒度参考。 | done | 32个SOP问题均有输入来源 |
| 3 | 核验目标仓、sibling、工具链、git和planned脚本现实状态。 | done | 实际存在 /缺失与planned事实分离 |
| 4 | 形成阅读清单、关注面阅读矩阵和冲突处理规则。 | done | 后续Step 5 / 6可机械绑定phase / boundary |
| 5 | 形成台账入口、Gate Matrix模板和planned skeleton门禁。 | done | 不提前伪造boundary ID或gate pass |
| 6 | 形成永久记忆种子、生成门禁和各类前置检查表。 | done | 只机械投影规则 /索引,不复制设计truth |
| 7 | 输出回填草稿、blocker、自检和下一步条件。 | done | 停在Step 3待审 |

---

## 2. 本步目标、输入与现实核验

### 2.1 本步必须收稳的内容

1. 实现者在任何代码、配置、脚本或测试改动前必须读取什么,以及如何证明读取结果影响了当前实现判断。
2. Rust、源码语言、提交、git、目录 / package / crate / binary和依赖裁剪规则如何成为开工门禁。
3. 在尚无phase / boundary ID时如何形成阅读包,并保证Step 5 / 6后逐boundary实例化而不伪造ID。
4. implementation ledger、Boundary Gate Matrix、planned skeleton和可选scratch ledger的唯一入口与创建时机。
5. 17个planned脚本、fixed-run artifact / report路径、PROFILE-05 candidate与外部环境如何分层为交付物或受影响boundary前置。
6. 永久记忆如何只从`MEM-SBX-*`机械投影,并在design baseline变化时刷新。

### 2.2 输入表

| 输入 | 当前定位 | 本Step用途 |
|---|---|---|
| Step 1输入边界 | completed_reviewed | 权威顺序、historical material、目标仓 / baseline /依赖 /移交blocker |
| Step 2范围闭集 | completed_reviewed | `MDR-SBX-P0`、P0-C / P0-Q、PROFILE-05 mandatory、P1 / P2和相邻仓非范围 |
| 正式`00/01/02` | reviewed design baseline | 核心能力、truth owner、架构红线、代码主体与非职责 |
| 正式`03`及Step 4~17校准产物 | direct implementation contract | Rust约束、七crate、对象 / port、55协议、flow、状态、事务、错误、幂等、配置、观测、测试切口和handoff |
| 正式`04`及Step 3 /5~14校准产物 | direct config contract | source / generation、PROFILE-01~07、I001~I101、adapter / material / activation与failure门禁 |
| 正式`05`及Step 6~14校准产物 | direct test contract | 254 TC、16 suite、7 gate、17脚本、fixed-run schema、21 ESLOT和回归 /证据规则 |
| 正式`06`及Step 3~14校准产物 | direct acceptance contract | baseline、entry / exit、功能 /协议 /状态 / NFR / evidence / VETO / defect / risk / final decision门禁 |
| Step 3对应标准 | normative | 阅读矩阵、永久记忆、台账、Gate Matrix、目录命名、依赖和工具前置格式 |
| L1-governance / artifact Step 3 | granularity reference | 参考表格密度和门禁完整性,不继承领域语义、状态或boundary |
| `README.md` | historical_material | 仅用于排除Docker / gVisor硬选型、旧SDK依赖、旧事件和旧成功口径 |

### 2.3 现实核验表

| 核验项 | 2026-07-16磁盘事实 | 本Step判定 |
|---|---|---|
| design HEAD | `edf2f8ca20cad08fbab76aa26cd74f50fb2e54f6` | 只是当前旧HEAD;新版L4-sandbox工作区未形成新design baseline |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox`不存在 | 阻塞首个实现boundary,不阻塞Step 3 / 4设计讨论 |
| 唯一编译期sibling | `/home/aris/Projects/quantalithos-core/crates/contracts`存在;package=`core-contracts`,lib=`core_contracts` | 可作为planned local path dependency;移交前仍须固定真实commit |
| core当前commit /工作区 | `ef0d24941fe6e00c24d423ac330347e6e1acb2da`;核验时`git status --porcelain`为空 | 仅记录核验事实;不伪装成未来实现固定baseline |
| core工具链现实基线 | workspace edition=`2024`,rust-version=`1.93` | 不能直接写成目标仓已落盘值;目标仓bootstrap前由设计owner固定兼容值 |
| 本机Rust工具 | rustc / cargo `1.93.0`,rustfmt `1.8.0-stable`,clippy `0.1.93`可调用 | 满足计划讨论的工具可用性核验;不等于目标仓build通过 |
| 相邻实现仓 | tools / runtime / member-service均不存在 | P0-C用formal port / fake / controlled seam;不得造Cargo依赖或联合E2E事实 |
| 目标仓git配置 | 因目标仓不存在而无法核验 | 首个实现boundary开工前必须项目级设置并回读验证 |
| 17个planned脚本 | 目标仓不存在,因此均不存在 | 全部属于本轮实现交付;当前不得写implemented / executed |
| PROFILE-05前置 | candidate、capability / template、provider适用项、SBX-ENV-05和qualification packet均未形成 | P0-Q受影响boundary前blocker;不得由fake、PROFILE-06或低profile替代 |
| 正式`07` /实施台账 | 正式`07`、Step 4、implementation ledger和planned skeleton均不存在 | 保持SOP顺序;本Step只固定规则与模板 |
| runtime事实 | 无implementation commit、`run_id`、runtime EV、结果、risk acceptance或signoff | 不得由任何设计表静态补齐 |

---

## 3. SOP 32项问题回答

| # | SOP问题 | 本Step回答 /落点 |
|---:|---|---|
| 1 | 实施者必须先读哪些文档,分别理解什么 | 正式`00~07`是实现基线,标准是执行约束,校准产物只按当前boundary补读。完整清单见§7.1。 |
| 2 | 当前语言和编码规范 | 目标语言为Rust,规范路径为`standards/coding/rust.md`;目标edition / rust-version尚未作为目标仓事实落盘。 |
| 3 | Rust规范是否明确 | 是。Rust标识符、module、type、function、variable、rustdoc、普通注释和测试名默认英文;公共API按规范写rustdoc。 |
| 4 | 是否读提交规范和历史提交 | 是。目标仓存在后先读正式`07` §11、实施计划书写规范和目标仓近期合格提交;无历史时不得从design仓旧提交风格推断实现仓格式。 |
| 5 | 项目级git配置 | 目标仓本地设置`quantalithos-labs <quantalithos.ai@gmail.com>`,不得使用`--global`;命令与判定见§7.7。 |
| 6 | 必须启动 /确认哪些服务和依赖 | P0-C开工不要求真实DB / bus / backend产品;必须确认目标仓、Rust工具、`core-contracts`。P0-Q另须candidate和dedicated environment。 |
| 7 | 每个phase / boundary读哪些正式章节 | 先应用§7.2关注面阅读矩阵;Step 5 / 6形成真实ID后逐行实例化为实际phase / boundary矩阵。 |
| 8 | 哪些校准产物影响实现判断 | `03` Step 4~17为直接落码解释源,`04` Step 3 /5~14、`05` Step 6~14、`06` Step 3~14按配置、测试、验收关注面补读。 |
| 9 | 正式与校准冲突如何处理 | 正式`00~07`优先;不清楚时读对应校准;仍不闭合或两者冲突则`wait_design`,不得自行选边或补schema。 |
| 10 | 是否依赖本地sibling | 仅`quantalithos-core/crates/contracts`是编译期依赖;其他仓存在与否都不能进入Cargo path dependency。 |
| 11 | local path还是private git | 当前planned方式是`core-contracts = { path = "../quantalithos-core/crates/contracts" }`;private git tag / rev需后续正式策略,当前不假定具备。 |
| 12 | 目标实现仓路径 | 固定为`/home/aris/Projects/quantalithos-sandbox`;当前不存在,不得在design仓或其他目录落实现。 |
| 13 | workspace / package / crate / binary是否一致 | planned映射已由正式`03`固定,见§7.8;目标仓创建后必须机械核验。edition / rust-version另行由bootstrap门禁固定。 |
| 14 | 架构层级是否可泄漏代码名 | 不可。实现仓package / crate / module / file / type / function / route / binary不得出现`L0~L6`或`l0_~l6_`导航前缀。 |
| 15 | 是否需要四类scripts目录 | `scripts/gates`,`scripts/reports`,`scripts/checks`为本轮必需;`scripts/dev`仅在有本地辅助交付时创建,且不能成为formal evidence入口。 |
| 16 | 是否需要artifact / report目录 | 需要`artifacts/test/<run_id>`,`reports/runs/<run_id>`,`reports/acceptance`,`reports/review`;当前只定义路径契约。 |
| 17 | 哪些脚本属于本轮交付 | 正式`05`的5 gate +3 report +9 check共17个,逐项见§7.10。 |
| 18 | 脚本参数要求 | gate / report / check必须显式接收或从固定context校验`run_id`,`artifact_root`,`config_profile`;不得从路径 / suite / commit猜测。exact CLI由Step 6 / 7逐boundary固定。 |
| 19 | 是否禁止project子层和`latest` | 是。禁止`artifacts/test/sandbox/<run_id>`,`reports/sandbox`以及任何formal `latest`;诊断重跑使用新run ID并保留parent。 |
| 20 | 哪些规则进入永久记忆 | 只允许§7.5的`MEM-SBX-*`:规范、目标仓、设计 /范围、依赖、资格真实性、台账、提交、证据路径、闭环审计和经验沉淀。 |
| 21 | 项目级实施台账路径 | `projects/L4-sandbox/design-calibration/implementation_execution_ledger.md`;Step 13创建,实现agent每次恢复先读。 |
| 22 | boundary台账如何命名 /生成 | `implementation-boundaries/<boundary_id>.md`;Step 6定义真实ID和内容,Step 13一次性预创建全部skeleton。 |
| 23 | 是否需要scratch台账 | 需要实现期本地`.codex/implementation_ledger.md`用于短期恢复,默认不作为正式交付或design truth;目标仓首boundary创建。 |
| 24 | 修改代码前哪些Gate必须pass | activation / Design / Scope / Worktree Gate必须有证据为`pass`;不适用项只能显式`not_applicable`,未来planned boundary不得激活。 |
| 25 | Commit Gate检查什么 | staged文件仅限allowed scope、用户无关改动未stage、英文message合规、cached diff无whitespace、required build / test / evidence checks真实通过。 |
| 26 | Handoff Gate回写什么 | 真实commit hash / message、已跑gate、未跑测试及原因、remaining blocker、next boundary、design baseline和未触碰用户改动。 |
| 27 | 永久记忆是否复制设计truth | 否。不得复制字段schema、DTO表、状态矩阵、业务规则或TC全文;只保留规则与正式章节索引。 |
| 28 | 记忆字段是否完整 | 是。每条具有稳定ID、scope、category、固定文本、规范来源、文档 /章节、刷新、失效、冲突和禁止改写。 |
| 29 | 技术栈规范是否来自阅读清单 | 是。当前Rust规范来自§7.1;Shell专用规范缺失已登记为脚本boundary前置,不得在记忆中自创。 |
| 30 | owner临时约束如何处理 | “逐Step停审”和“未经要求不commit”是本轮design任务临时规则,不进入未来实现永久记忆;实现期临时约束须有失效条件后才可入表。 |
| 31 | 是否包含交付实现前闭环审计 | 是。`MEM-SBX-010`要求每次实现移交 / design baseline变化后按phase / boundary审计正式`03/05/06/07`。 |
| 32 | 是否包含设计修复后经验沉淀 | 是。`MEM-SBX-011`要求判断项目归属、提交合并口径和可复用经验,需要时补标准 / SOP /项目记忆并给具体正反例。 |

---

## 4. 当前材料问题诊断

| 问题ID | 当前问题 | 风险 | 本Step处理 |
|---|---|---|---|
| PRQ-SBX-001 | 正式`07`尚无集中阅读和开工前置 | 实现者按README或个人习惯开工 | 建立正式 /校准 /规范分层阅读清单 |
| PRQ-SBX-002 | phase / boundary尚未定义 | 现在硬造ID会越过Step 5 / 6,只列全局文件又不可执行 | 建立关注面阅读包;Step 5 / 6后强制实例化真实ID |
| PRQ-SBX-003 | 目标仓不存在,edition / rust-version未固定 | 实现agent可能在错误目录建仓或自行复制core配置 | 固定路径与命名;精确版本由设计owner在bootstrap boundary前关闭 |
| PRQ-SBX-004 | README硬写Docker / gVisor和旧依赖 | 产品和旧SDK可能回流为前置事实 | README只作historical material;candidate产品保持ADR /前置选择 |
| PRQ-SBX-005 | `04`把PROFILE-05列为配置P1,`05/06/07`列为P0-Q | 若误当同一优先级轴会把candidate路径后移 | 采用`05`已审查解释:配置引入成熟度与核心测试 /验收门禁是不同轴;实施范围按P0-Q mandatory |
| PRQ-SBX-006 | implementation ledger尚无入口实例 | 实现恢复和boundary授权可能临场补写 | 固定三类路径、状态和创建时机;Step 13一次性建全skeleton |
| PRQ-SBX-007 | 17个Shell入口已有正式契约但无Shell编码规范 | 脚本boundary可能自行形成风格 /安全规则 | 登记`open_before_script_boundary`;Step 6 / 7前绑定正式规范或审查后的项目级规则 |
| PRQ-SBX-008 | adjacent tools / runtime / member-service仓不存在 | 可能把缺仓误写成Cargo依赖或删除seam范围 | P0-C使用fake / controlled seam,真实联合E2E保持P1 conditional |
| PRQ-SBX-009 | candidate / provider / dedicated lab未选择 | P0-Q无法执行且可能被fake替代 | 列为受影响boundary blocker;0 launch,不得删减总体P0 |
| PRQ-SBX-010 | permanent memory容易自由总结 | 临时对话或设计正文变成第二真相源 | 只允许`MEM-SBX-*`逐字机械投影 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 实施价值 |
|---|---|---|---|
| 阅读入口 | 正式文档、标准和校准产物分散 | 分为全局必读 +关注面阅读包 +未来ID实例化 | 当前boundary只读必要真相源 |
| 现实前置 | 缺口散见`03/05/06` | 目标仓、core、工具、candidate、脚本逐项定性 | planned不冒充ready |
| 仓库 /命名 | planned layout存在但无统一开工检查 | 路径、七crate、package / crate / binary和层级泄漏可机械核验 | bootstrap不靠临场命名 |
| 台账 | 只有标准规定,项目无入口规则 | 固定项目 / boundary / scratch入口与创建时机 | Step 13可一次性装配 |
| 记忆 | agent可能自由总结 | 固定`MEM-SBX-*`、刷新和冲突处理 | 不复制设计truth |
| 脚本 /证据 | 17个planned入口与路径散落 | 参数、目录、输入输出和缺规范风险集中 | 自动化与功能实现同步规划 |
| P0-Q | candidate缺失容易被归P1延期 | 配置成熟度轴与核心验收轴分离,P0-Q仍mandatory | fake不替代真实隔离 |

---

## 6. 设计取舍

| 取舍 | 方案A | 方案B | 结论 |
|---|---|---|---|
| 校准阅读 | 开工前全读整个`design-calibration` | 正式文档全局必读,校准按当前关注面 / boundary补读 | 采用B,降低噪声且保留可追溯判断 |
| 尚无boundary ID时的矩阵 | 现在虚构`commit-*` | 先定义稳定阅读包和匹配规则,Step 6实例化真实ID | 采用B,不越过Step 5 / 6 |
| 目标仓创建 | 现在由设计任务创建 | 在Step 5 / 6明确bootstrap boundary,实现前按Gate创建 | 采用B,遵守只做设计文档 |
| edition / rust-version | 直接复制core当前值并写成Sandbox事实 | 记录core现实基线,由设计owner在bootstrap boundary前固定目标值 | 采用B,避免伪造未落盘事实 |
| sibling协作 | 缺仓则新增Cargo dependency /复制DTO | 除core外统一port / adapter / event / handoff / fake | 采用B,保持依赖裁剪 |
| permanent memory | agent自由总结全文 | 只从种子表逐字投影 | 采用B,避免第二真相源 |
| Shell规范缺失 | 本Step临时发明通用Shell规则 | 登记受影响boundary blocker,由正式规范或项目级审查规则关闭 | 采用B,不越权写编码标准 |
| PROFILE-05 | 因`04`配置P1而移出本轮 | 保留配置成熟度解释,实施 /测试 /验收仍作为P0-Q mandatory | 采用B,符合已审查`05/06`和Step 2 |

---

## 7. 结构化中间产物

### 7.1 全局阅读清单

| 文档 /规范 | 路径 | 阅读目的 | 未读风险 | 可审查确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L4-sandbox/00-需求文档.md` | 理解C-SBX-1~5、FR-SBX-001~018、BR / AC / VF、P0 / P1 / P2和非目标 | 缩成command smoke或混入外围增强 | boundary ledger列出承接的C / FR / VF及明确非范围 |
| 架构设计 | `projects/L4-sandbox/01-架构设计.md` | 理解execution isolation truth、coherent boundary、依赖 /数据owner和安全红线 | 出现第二truth、host bypass或错误依赖 | Design Gate记录owner、允许依赖和至少一个禁止行为 |
| 概要设计 | `projects/L4-sandbox/02-概要设计.md` | 理解六个主要部分、代码主体、对象 /接口骨架和关键flow | 按文件堆任务或把六部分误拆六crate | boundary说明所属业务纵切和不承担职责 |
| 详细设计 | `projects/L4-sandbox/03-详细设计.md` | 获取七模块、对象、port、55协议、flow、30 owner machines /31 canonical enum entries /39 shared declarations、事务、38 error、幂等、配置 /观测 /测试切口正式契约 | 实现自行补schema、mapper、状态或UoW | Required Reads写exact章节 /对象 /协议 /状态 /flow ID |
| 配置设计 | `projects/L4-sandbox/04-配置设计.md` | 获取PROFILE、I001~I101、source、generation、adapter / material binding和hard guard | 使用非法default、fake fallback或partial generation | config boundary列profile、item / domain、失败策略和generation检查 |
| 测试方案 | `projects/L4-sandbox/05-测试方案.md` | 获取254 TC、suite、gate、17脚本、环境、schema、ESLOT和证据路径 | 测试后补、Blocked吞并或静态造证据 | Test / Evidence Gate列TC / suite / gate / script / output |
| 验收标准 | `projects/L4-sandbox/06-验收标准.md` | 获取P0-C / P0-Q、ASCP、VETO、entry / exit、evidence和裁决边界 | 把实现完成误写验收通过或绕VETO | boundary列适用ASCP / VETO与当前证明上限 |
| 实施计划 | future `projects/L4-sandbox/07-实施计划.md` | 获取phase、boundary、allowed scope、required checks、暂停 /提交 /handoff门禁 | 跨boundary实现或自行安排提交 | 当前boundary必须存在于正式Boundary Gate Matrix |
| 当前实施校准链 | `design-calibration/07_implementation_plan_step_01_input_boundary.md`至当前已审查Step | 理解实施输入、范围和前置取舍 | 从旧README恢复产品 /路线 | 只读当前boundary适用Step并记录判断,不全量复制 |
| Rust编码规范 | `standards/coding/rust.md` | 约束Rust命名、源码英文、rustdoc、格式和实践 | 代码风格 /公共API文档返工 | boundary记录规范路径;Build Gate运行fmt / clippy或解释适用性 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 约束目标仓、workspace、package / crate / binary、scripts、artifacts和reports | 目录和证据路径漂移 | bootstrap / script boundary执行§7.8~§7.11机械检查 |
| 依赖裁剪规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 区分compile / runtime / event依赖 | 非core sibling进入Cargo | dependency check和Cargo graph证明仅core compile |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 检查字段、DTO、ref、metadata、state、UoW、projection、artifact、evidence和经验项 | 实现者替设计补口 | 每个boundary由设计者给出适用项`通过 /不适用 /blocker` |
| 实施计划SOP /书写规范 | `standards/document/实施计划讨论流程_SOP.md`;`standards/document/实施计划书写规范.md` | 约束phase / boundary、阅读、测试、提交和完成判定 | 跳Step、按文件拆phase或门禁不完整 | 正式`07`及boundary ledger引用对应章节 |
| 代码实施台账规范 | `standards/document/代码实施台账与门禁规范.md` | 约束实施状态、gate值域、blocker回流、Commit / Handoff Gate | 聊天摘要代替可恢复状态 | 项目 / boundary ledger schema和状态值机械检查 |
| 项目总约定 | `projects/README.md` §1.1 / §8.2 | 约束design / implementation仓分离、代码命名和提交语言 | 在design仓落码或使用错误commit格式 | repo root / staged scope / message检查 |
| historical README | `projects/L4-sandbox/README.md` | 只识别旧Docker / gVisor、SDK、旧事件和旧性能叙事不得回流 | 把historical材料当当前前置 | Design Gate明确`historical_material_only`,不得作实现来源 |

全局阅读不等于要求每次重读全部正文。首次项目开工建立索引;每个boundary只重读§7.2匹配的正式章节和校准产物,并在design baseline变化时刷新受影响行。

### 7.2 实施关注面阅读矩阵输入

当前尚无合法phase / commit boundary ID。下表使用稳定`READ-SBX-*`阅读包定义匹配规则;Step 5 / 6必须把每个真实phase / boundary绑定至少一个阅读包,补齐exact章节、对象 /协议 /TC / gate ID和开工证据。未完成实例化的boundary不能通过Design Gate。

| 阅读包 | 未来phase / boundary匹配条件 | 必读正式章节 | 必读校准产物 | 影响的实现判断 | 开工门禁 |
|---|---|---|---|---|---|
| READ-SBX-BOOT | 创建仓、workspace、crate、基础依赖、CI /目录壳 | `03`§3~§5 / §16;`05`§15.3~§15.5;future `07`§3 / §6 | `03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md`;`03_ddd_step_05_module_contracts.md`;`03_ddd_step_17_implementation_handoff.md` | target path、edition / rust-version、member / package / crate / binary、Cargo方向、scripts / report目录 | 目标版本由design owner固定;路径 /命名 /core ref均可机械核验;非core compile dependency=0 |
| READ-SBX-CONTRACT | public refs、metadata、Command / Query / Consumer / Event / Job、view / receipt / error | `03`§5~§7 / §15;`05`§3~§6;`06`§7 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_16_test_cuts.md`;`05_test_plan_step_06_cases.md`;`06_acceptance_step_07_interfaces_events_sync.md` | shared carrier、二级类型、字段来源、public surface、55协议闭集 | exact protocol和source map可定位;不得从route / marker / typed_refs顺序猜字段 |
| READ-SBX-DOMAIN | truth object、guard、状态、failure / control、lease / cleanup / redline | `03`§6 / §8~§12 / §15;`05`§6 / §10;`06`§5 / §8 / §11 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | owner enum、合法 /禁止迁移、typed failure、guard、duplicate / race | exact owner state、transition、error和negative TC均已绑定 |
| READ-SBX-APPLICATION | service、port / repository、UoW、idempotency、stored result / receipt / report | `03`§5~§12;`05`§3~§6;`06`§7~§8 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md` | transaction start / order、typed save/get、expected version、no second side effect | field / DTO / UoW / replay闭环审计无blocker |
| READ-SBX-INFRA-CONFIG | repository / adapter / fake、config loader、runtime builder、external binding、sensitive material | `03`§10 / §13;`04`§3~§11;`05`§7~§10;`06`§6 / §9 | `03_ddd_step_14_config_external_binding.md`;`04_config_step_03_control_plane.md`;`04_config_step_05_sources_priority_conflicts.md`;`04_config_step_07_config_items.md`;`04_config_step_08_sensitive_secrets.md`;`04_config_step_09_loading_validation_activation.md` | source priority、complete generation、availability、fake parity、material no-output、fail-fast / closed | exact profile / domain / item / adapter refs与negative config TC可定位 |
| READ-SBX-ENTRY-SEAM | API handler、inbound / relay / fulfillment worker、job runner和跨仓接缝 | `03`§5 / §7~§8 / §13;`04`§6~§7;`05`§3 / §8;`06`§7 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`04_config_step_06_environment_profiles_matrix.md`;`05_test_plan_step_08_environment_config.md` | entry只装配application、trusted source、receipt、relay no-rollback、job no-repair | entry没有直写truth /直访backend;seam缺失按formal status处理 |
| READ-SBX-CANDIDATE | PROFILE-05 concrete backend、capability、launch / inspect / capture / terminate / release与13 CONF | `04`§6~§9 / §12~§14;`05`§2 / §8~§13;`06`§2~§4 / §9~§11 | `04_config_step_06_environment_profiles_matrix.md`;`04_config_step_08_sensitive_secrets.md`;`05_test_plan_step_06_cases_config_security_qualification.md`;`05_test_plan_step_08_environment_config.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_03_baseline.md` | immutable candidate / profile / generation / environment / material identity、0 weak fallback、cleanup disposition | candidate ADR / manifest、SBX-ENV-05和适用material前置完整;否则`blocked`且0 launch |
| READ-SBX-SAFETY | timeout / kill / control、lease、orphan、cleanup / reaper、redline / investigation | `03`§6~§12 / §14~§15;`04`§7~§11;`05`§6 / §10~§12;`06`§5 / §9 / §11~§13 | `03_ddd_step_10_state_matrix.md`;`03_ddd_step_12_error_recovery.md`;`04_config_step_11_failure_degradation.md`;`05_test_plan_step_06_cases_errors_recovery.md`;`06_acceptance_step_11_veto.md`;`06_acceptance_step_12_defects_retest_release.md` | guard-first、no force-clean、containment、investigation / handoff、resource disposition | destructive action前置、VETO和negative TC全部明确;缺guard默认blocked |
| READ-SBX-READ | Query、projection、derived marker、comparison、rebuild和reconciliation | `03`§6~§10 / §15;`04`§6~§7 / §11;`05`§3~§6 / §10;`06`§7~§9 | `03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`05_test_plan_step_06_cases_commands_queries.md` | query no-write、visibility / degraded、index、rebuild不反写、job no repair、P0 minimal与P2 rich边界 | selector / index / source / no-write test闭合;rich preview / analytics不得混入 |
| READ-SBX-AUTOMATION | test harness、fixture、suite / gate、17脚本、schema、evidence / report / acceptance draft | `03`§15;`05`§6~§14;`06`§3~§4 / §9~§14 | `03_ddd_step_16_test_cuts.md`;`05_test_plan_step_07_test_data.md`;`05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_evidence.md`;`05_test_plan_step_13_evidence_schemas.md`;`06_acceptance_step_10_observability_evidence.md` | 254 TC分母、16 suite、7 gate、17 scripts、九schema、21 slot、raw / report pairing、maturity | Shell规范前置已关闭;输入 /输出 /failure /status /digest明确;不生成静态EV或结论 |
| READ-SBX-HANDOFF | phase / boundary完成、提交、跨agent恢复、最终实现移交 | future `07`§3 / §6~§7 / §11~§12;`06`§4 / §12~§14 | current Step 3;future Step 6 / 7 / 10~12;`06_acceptance_step_14_final_decision_signoff.md` | ledger状态、Commit / Handoff Gate、未跑测试、blocker、next boundary、证明上限 | 实际hash / checks只能执行后回写;所有planned skeleton存在且仅一个current |

实例化规则:

1. Step 5按可验证增量定义phase后,为每个phase选择阅读包并补phase级正式章节。
2. Step 6为每个commit boundary写exact `required_reads`,不得只写`READ-SBX-*`名称。
3. 一个boundary跨多个关注面时必须绑定多个阅读包;不能用“全读03 /05 /06”吞并精确判断。
4. 正式章节未给出可落码答案时读对应校准产物;仍不闭合立即`wait_design`。
5. design baseline变化后,只刷新受影响阅读包和boundary,并按正式`05/06`触发回归 / evidence失效。

### 7.3 权威顺序与冲突处理

```text
current formal 00~07
  -> current boundary exact sections and identifiers
  -> corresponding design-calibration explanation
  -> normative standards for execution discipline
  -> unresolved or contradictory
  -> gate_status = blocked; next_allowed_action = wait_design
```

特殊解释:

- `04`把PROFILE-05标为配置引入成熟度P1,`05/06`把其candidate conformance列为核心P0-Q;这是两个不同分类轴。实施scope必须按已确认Step 2把concrete candidate binding与13 CONF作为P0 mandatory,同时保持配置profile当前`unqualified`。
- README中的Docker / gVisor、SDK依赖、旧事件和旧性能数字不得覆盖产品中立正式链。
- 标准只定义闭环判断口径,不能证明当前boundary已闭环;必须由设计者逐boundary给出证据。

### 7.4 实施台账入口表

| 台账 | 唯一路径 | 创建时机 | 读取 /更新时机 | 当前状态与缺失处理 |
|---|---|---|---|---|
| 项目级implementation ledger | `projects/L4-sandbox/design-calibration/implementation_execution_ledger.md` | Step 13与正式`07`同步创建 | 每次继续 /换agent / baseline变化 /进入boundary /提交 /handoff前 | 当前合法缺失;Step 13后缺失则不得移交或改代码 |
| boundary ledger | `projects/L4-sandbox/design-calibration/implementation-boundaries/<boundary_id>.md` | Step 13按Step 6 Boundary Gate Matrix一次性预创建全部 | 当前boundary修改前、跑gate前、提交前、handoff前 | 当前合法缺失;正式移交时缺任一planned skeleton即阻断 |
| implementation scratch | `/home/aris/Projects/quantalithos-sandbox/.codex/implementation_ledger.md` | 目标仓创建后的首个active boundary | 每次本地恢复、记录touched files / commands /用户无关改动 | 当前因目标仓缺失而不存在;实现期必须创建,默认不作为正式交付 |

项目级ledger必须固定`project`,`design_repo`,`implementation_repo`,`current_design_baseline`,`current_boundary`,`gate_status`,`gate_reason`,`next_allowed_action`,`current_recovery_point`,`last_updated_by`,`last_updated_at`,并维护Boundary Ledger与Open Blockers。boundary ledger必须包含Header、Required Reads、Allowed / Forbidden Scope、Gate Matrix、Commit Record、blocker与handoff记录。

### 7.5 Boundary Gate Matrix模板与预创建门禁

本表是Step 6的实例化模板,不是当前真实boundary清单:

| Commit boundary | Activation Gate | Design Gate | Scope Gate | Worktree Gate | Build Gate | Test Gate | Evidence Gate | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|---|---|---|
| `<future-boundary-id>` | current only;future=`planned / wait_until_current` | baseline + exact reads + closure / experience review | allowed / forbidden files and behavior | initial status + user changes protected | exact fmt / check / build | exact TC / targeted / affected suite | exact raw / report / check or reasoned N/A | staged scope + English message + cached diff | real hash + gates + blockers + next boundary |

| 预创建检查 | 通过标准 | 失败处理 |
|---|---|---|
| ID来源 | 全部boundary ID只来自已审查Step 6,不由ledger临时生成 | 回Step 6,不得创建临时ID |
| 全量skeleton | Boundary Gate Matrix每行都有同名ledger文件 | 暂停Step 13 /实现移交,一次性补齐 |
| 当前唯一 | 项目级ledger仅一个`current_boundary`,初始动作=`read_docs` | 修正授权状态后再移交 |
| 未来不授权 | 其他boundary均`status=planned`,`next_allowed_action=wait_until_current` | 改回planned,不得预填pass |
| 内容完整 | 每件含required reads、allowed / forbidden scope、required checks、Commit / Handoff Gate planned口径 | 补齐后再移交 |
| 无伪事实 | commit hash、command result、run / EV、gate pass均为空或pending | 删除伪事实并重新审计 |

代码修改前最低要求为Activation、Design、Scope与Worktree Gate有真实证据并为`pass`;Build / Test / Evidence随后按boundary计划推进。`not_applicable`必须说明原因,不能替代未执行。

### 7.6 Agent启动与永久记忆种子表

永久记忆只允许逐字投影下表`必须写入的记忆文本`,不保存字段 / DTO /状态 /TC正文。当前只设计种子,不执行外部记忆写入。

| 记忆ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-SBX-001 | project / phase / commit-boundary | 必读规范 | 开始任何代码、配置、脚本或测试改动前,必须读取当前boundary在`07-实施计划.md` §3阅读矩阵中绑定的正式章节、校准产物、技术栈规范、目录规范和台账规范;不得自行猜测或用README替代。 | `07`§3阅读清单 | future`07-实施计划.md` | §3 | 首次开工 / boundary切换 /规范路径变化 | until superseded | 正式文档优先;暂停并刷新记忆 | 是 |
| MEM-SBX-002 | project | 目标仓与命名 | Sandbox实现只能位于`/home/aris/Projects/quantalithos-sandbox`,使用`crates/contracts/domain/application/infra/api/worker/jobs`及正式`03`定义的package / crate / binary命名;设计仓层级`L4`不得进入代码名。 | `07`§3;目录组织规范 | future`07`;正式`03` | §3;`03`§4 | 首次开工 / layout或命名变化 | until superseded | 路径 /命名偏离时暂停并回报design owner | 是 |
| MEM-SBX-003 | project / phase | 技术栈 | 当前Rust boundary开工前必须从`07-实施计划.md` §3阅读清单读取`standards/coding/rust.md`;源码标识符、module、type、function、variable、rustdoc、普通注释和测试名默认英文。 | `07`§3阅读清单 | future`07`;Rust规范 | §3 | 首次Rust改动 /技术栈或规范路径变化 | until superseded | 正式阅读清单优先;缺脚本语言规范时阻塞对应boundary | 是 |
| MEM-SBX-004 | project / commit-boundary | 设计边界 | 实现不得自行补字段、DTO二级类型、selector / source map、port、状态、UoW、version / cursor、projection、配置default、evidence schema或phase boundary;无法按正式设计1:1落码时必须将gate设为blocked并`wait_design`。 | 可落码性标准;`07`§3 / §6 | future`07` | §3 / §6 | 每个boundary开工 / design blocker出现 | until superseded | 暂停实现并回写owner设计Step | 是 |
| MEM-SBX-005 | project / phase / commit-boundary | 依赖纪律 | 唯一允许的编译期sibling dependency是`core-contracts = { path = "../quantalithos-core/crates/contracts" }`;tools、runtime、member-service、bus及其他仓只能通过port、adapter、event、handoff、safe ref或fake协作。 | `03`§3;依赖裁剪规则;`07`§3 | 正式`03`;future`07` | `03`§3;`07`§3 | Cargo变更 / seam boundary开工 / core baseline变化 | until superseded | 非core compile dependency立即阻断并修正 | 是 |
| MEM-SBX-006 | project / candidate boundary | P0-Q真实性 | PROFILE-05 concrete candidate binding和13条CONF属于总体P0-Q mandatory;candidate、capability / template、environment或适用material identity缺失时必须Blocked且0 launch,不得由fake、controlled seam、PROFILE-06或静态报告替代。 | `05`§2 / §8~§13;`06`§2~§4;`07`§2 / §3 | 正式`05/06`;future`07` | 对应章节 | candidate / profile / qualification baseline变化 | until superseded | 身份缺失或错配时停止probe并保留Blocked | 是 |
| MEM-SBX-007 | project / safety boundary | 安全边界 | Query必须no-write,relay / handoff失败不得回滚source truth,job不得修core truth,cleanup / release必须先通过handoff / evidence / investigation / lease / redline guard,任何raw body / secret不得进入truth、audit、log或report。 | 正式`01/03/04/05/06`;`07`§3 | future`07` | §3及boundary reads | safety / persistence / evidence boundary开工 | until superseded | 任一违反立即阻断并按VETO / design owner处理 | 是 |
| MEM-SBX-008 | project / commit-boundary | 实施台账 | 每次继续、换agent、进入新boundary、准备提交或design baseline变化后,必须先读项目级implementation ledger和当前boundary ledger;缺当前台账、缺任一planned skeleton或当前boundary未激活时不得改代码。 | `07`§3;代码实施台账规范 | future`07` | §3 / §6 | 每次恢复 / boundary切换 / baseline变化 | until superseded | 以设计仓正式台账为准;暂停并补齐 | 是 |
| MEM-SBX-009 | project / commit-boundary | 工作区与提交 | 提交前只暂存当前boundary允许文件,保护用户已有改动,运行required checks和cached diff检查,使用英文`type(scope): subject`及正式body / footer规则;只有Commit Gate通过后才能记录真实commit hash。 | `07`§3 / §11;实施计划书写规范 | future`07` | §3 / §11 | 每次提交前 | until superseded | 暂停提交并重新核对staged scope / message / checks | 是 |
| MEM-SBX-010 | project / phase / commit-boundary | 证据与闭环审计 | 正式raw只写`artifacts/test/<run_id>`,报告只写`reports/runs/<run_id>`,`reports/acceptance`和`reports/review`,不得使用project子层或`latest`;实现移交或design baseline变化前必须按phase / boundary审计正式`03/05/06/07`,未通过先回写设计并固定新baseline。 | `05`§9 / §13;`06`§10;`07`§3 / §12;可落码性标准 | 正式`05/06`;future`07` | 对应章节 | gate / report变化 /移交 / baseline变化 | until superseded | 证据路径或闭环失败时失效相关结果并暂停移交 | 是 |
| MEM-SBX-011 | project / commit-boundary | 设计修复与经验沉淀 | 修复设计文档后必须先判断改动与上一提交是否同一项目以决定新增提交或合并,再显式检查是否产生可复用经验;需要时同步更新标准 / SOP /项目记忆并添加至少一个具体正反例,不需要时明确记录无新增经验,最后形成遇阻agent可继续的交接。 | 不适用 | future`07` | §3 / §10 / §11 | 每次设计修复后 /提交前 | until superseded | 先完成经验检查;未经用户要求不得据此自动提交 | 是 |

### 7.7 Agent永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | 正式`07` §3装配全部`MEM-SBX-001~011`或经审查的superseding版本 | 不生成永久记忆,暂停实现 |
| 只写固定文本 | 每条逐字来自`必须写入的记忆文本`,不合并 /概括 /扩写 | 删除自由总结并重新投影 |
| 来源完整 | ID、scope、category、规范来源、文档 /章节、刷新、失效和冲突均非空 | 不写入缺字段条目 |
| 技术栈来自清单 | Rust来自§7.1;未来Shell /其他语言须先补正式规范来源 | 暂停对应boundary,不得自创规范 |
| 不复制设计truth | 无字段schema、DTO表、状态矩阵、业务规则、TC全文、真实blocker细节 | 删除正文,改为正式章节索引 |
| P0-Q真实性 | 包含MEM-SBX-006且未把Blocked /0 launch弱化 | 停止candidate boundary并修正记忆 |
| 台账恢复 | 包含MEM-SBX-008且全部planned skeleton已由Step 13创建 | 不移交实现 |
| 闭环审计 | 包含MEM-SBX-010,并在移交 / baseline变化时有逐boundary审计 | `wait_design`,不得以标准存在替代项目审计 |
| 经验沉淀 | 包含MEM-SBX-011且提交动作仍受用户授权 | 补经验检查;不得自动commit / amend |
| 临时规则隔离 | 本轮“逐Step停审 /不commit”未混入实现长期记忆 | 删除临时规则;实现期另有临时规则须列失效条件 |

禁止从聊天、历史commit、README、旧正式文档或整份详细设计自由生成额外永久规则。design baseline变化时,先对照种子表逐条判断受影响ID,保留稳定ID并刷新文本或以新ID supersede;不得静默改写。

### 7.8 Git、编码规范与工具链前置检查

目标仓创建后执行项目级配置,不得使用`--global`:

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

| 检查项 | 命令 /来源 | 通过标准 | 当前事实 | 失败处理 |
|---|---|---|---|---|
| repo root | `git rev-parse --show-toplevel` | `/home/aris/Projects/quantalithos-sandbox` | 目标仓不存在,未执行 | 暂停,不得在design仓落码 |
| local git name | `git config --local user.name` | `quantalithos-labs` | 未执行 | 在目标仓设置并回读 |
| local git email | `git config --local user.email` | `quantalithos.ai@gmail.com` | 未执行 | 在目标仓设置并回读 |
| Rust规范 | §7.1;`standards/coding/rust.md` | 当前Rust boundary能定位规范并遵守源码英文 | 规范存在 | 缺失或冲突则暂停boundary |
| target edition / rust-version | root `Cargo.toml`;design baseline | 由bootstrap boundary正式固定且与core-contracts兼容 | 目标值尚未固定 /落盘;core现实为2024 /1.93 | Step 6前置或DesignReopen,不得实现者自行决定 |
| compiler / Cargo | `rustc --version`;`cargo --version` | 满足已固定target baseline | 本机均为1.93.0 | 不兼容则阻塞build boundary |
| format / lint | `cargo fmt --all -- --check`;`cargo clippy ...` | boundary指定命令通过 | rustfmt / clippy可调用;目标仓未运行 | 未运行保持pending,失败只在scope内修复 |
| Bash基础 | `bash --version`;script shebang | exact script runtime由boundary固定 | `/usr/bin/bash`存在 | 缺失则阻塞script boundary |
| Shell规范 / lint | §7.1规范路径;`shellcheck --version` | 正式规则来源与required lint已固定 | 专用规范和shellcheck均缺失 | `open_before_script_boundary`;不得把缺失写N/A |
| JSON / digest工具 | `jq`;`sha256sum`;RFC 8785实现选择 | writer可按正式schema canonicalize / digest | jq / sha256sum存在;RFC 8785实现未选 | automation boundary前固定库 /工具并做fixture测试 |
| worktree | `git status --short` | 初始状态已记录且用户改动已分类 | 目标仓不存在 | 建仓 /恢复后先记录,禁用destructive处理 |
| commit history | `git log -5 --oneline` | 阅读目标仓近期合格英文提交;无历史则引用正式规范 | 目标仓无历史 | 不得借用design仓旧commit格式替代 |

实现仓commit标题固定英文`type(scope): subject`;body第一段描述boundary,再按子功能分组列关键文件与目的,footer前保留真实空行。exact scope和planned message由Step 6 / 11逐boundary定义;本Step不预造commit message或hash。

### 7.9 代码仓目录与命名前置检查

| 检查项 | 正式要求 | 检查方式 | 当前状态 | 失败处理 |
|---|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-sandbox` | 目录和repo root | absent | 由未来bootstrap boundary创建;此前禁止落码 |
| workspace members | `crates/contracts`,`domain`,`application`,`infra`,`api`,`worker`,`jobs` | root Cargo members exact set | pending | 命名 /成员偏离即暂停 |
| Cargo packages | `sandbox-contracts`,`sandbox-domain`,`sandbox-application`,`sandbox-infra`,`sandbox-api`,`sandbox-worker`,`sandbox-jobs` | 各`Cargo.toml [package].name` | pending | 回正式`03`核验,不得自改 |
| library crates | `sandbox_contracts`,`sandbox_domain`,`sandbox_application`,`sandbox_infra`,`sandbox_api`,`sandbox_worker`,`sandbox_jobs` | `[lib].name` /编译crate名 | pending | 暂停并修正 |
| API binary | `sandbox-api` | `[[bin]].name` / path | pending | 暂停并修正 |
| worker binaries | `sandbox-control-worker`,`sandbox-fulfillment-worker` | worker manifest / `src/bin` | pending | 暂停并修正 |
| job binaries | `publish_sandbox_event_relay`,`refresh_sandbox_references`,`refresh_backend_capabilities`,`retry_material_handoffs`,`run_lease_orphan_reaper`,`evaluate_cleanup_guards`,`maintain_redline_handoffs`,`rebuild_sandbox_projections`,`maintain_derived_inspect_preview_trend`,`run_sandbox_reconciliation` | jobs manifest / `src/bin` | pending | exact job / binary映射不一致则`wait_design` |
| 架构层级泄漏 | package / crate / module / file / type / function / route / binary无`L0~L6`,`l0_~l6_`导航前缀 | manifest + source path搜索 | pending | 停止提交并修正 |
| 模糊文件名 | 不新增无责任语义的`service.rs`,`manager.rs`,`helper.rs`,`utils.rs`,`common.rs` | changed path review | pending | 按正式owner职责命名 |
| scripts目录 | `scripts/gates`,`scripts/reports`,`scripts/checks`;`scripts/dev`仅辅助 | path / executable / owner检查 | absent with target repo | 按交付boundary创建,报告脚本不得放`reports/` |
| artifact / report目录 | `artifacts/test/<run_id>`,`reports/runs/<run_id>`,`reports/acceptance`,`reports/review` | config / scripts / report audit | absent with target repo | 修正路径;不得预建静态Pass文件 |

### 7.10 本地多仓依赖前置检查

| 依赖 /协作方 | 类型 | 本地路径 /现实 | 允许协作方式 | 开工检查 | 不存在 /不就绪处理 |
|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | compile | repo与crate存在;核验commit=`ef0d24941fe6e00c24d423ac330347e6e1acb2da` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | manifest、commit、worktree、API compatibility | 缺失或未固定则阻塞首个Cargo boundary |
| `quantalithos-bus` | runtime / event | repo存在,但不是compile dependency | publisher / consumer adapter、event envelope、fake | formal port / binding / fake与schema | 不阻塞P0-C;真实bus组合归PROFILE-06 / P1 |
| identity / work / governance / policy owner | runtime / event |部分repo存在;产品组合不是当前前置 | body-free ref / summary、resolver / event / controlled fake | no body、freshness、failure mapping | P0-C保持formal seam;真实组合P1 |
| tools | runtime caller | repo不存在 | formal Command / Query / safe refs / outcome seam | 不实现tool semantics,不复制Tool truth | 不阻塞P0-C;联合真实调用P1 |
| runtime | runtime caller | repo不存在 | runtime context ref、run / control / capture feedback seam | 不推进agent loop / recovery | 不阻塞P0-C;联合真实loop P1 |
| member-service | runtime orchestrator | repo不存在 | member / host safe ref与Sandbox outcome | 不拥有host / session / worker lifecycle | 不阻塞P0-C;联合orchestration P1 |
| artifact / archive | handoff | artifact实现仓未作为当前编译依赖核验 | candidate material ref、handoff adapter / receipt、controlled fake | receipt不升格Artifact / evidence truth | P0-C用fake;真实target P1 |
| observability | runtime handoff | 实现仓未作为当前编译依赖核验 | safe hook / material ref / backpressure adapter | telemetry不替代formal audit | P0-C safe local / fake;真实sink P1 |
| isolation candidate | external runtime | 产品 /repo /provider未选 | `IsolationBackendPort` concrete adapter + immutable manifest | READ-SBX-CANDIDATE全部前置 | 阻塞P0-Q boundary,0 launch;不能fallback host / fake |

依赖检查必须同时检查Cargo metadata / dependency graph和代码import,不能只看目录是否存在。任何外部仓的存在也不自动授权compile dependency。

### 7.11 测试脚本与报告工具前置检查

| Planned脚本 | 类别 | 必需输入 /责任 | 固定输出 /失败语义 | 当前状态 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | gate / suite / run / artifact root / profile / MAIN role适用 | raw context / suite;nonzero保留首个failure / infra | planned_not_created |
| `scripts/gates/run_operations_gate.sh` | gate | SBX-ENV-04 / PROFILE-04 simulation identity | OPS source raw;缺replay / cleanup disposition阻断 | planned_not_created |
| `scripts/gates/run_backend_conformance_gate.sh` | gate | immutable candidate / capability / template / ENV / material manifest | P0Q raw;identity缺失Blocked且0 launch | planned_not_created |
| `scripts/gates/run_release_gate.sh` | gate | 按MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q顺序的四源identity / digest | release aggregation;缺源 /错序 / mismatch阻断 | planned_not_created |
| `scripts/gates/run_selected_real_like_gate.sh` | gate | 显式PROFILE-06 selected composition | P1 raw;未激活 /未qualified为NotRunConditional | planned_not_created |
| `scripts/reports/generate_reports.sh` | report | fixed raw、schema、stage / run selector | `reports/runs/<run_id>`;缺raw / schema错nonzero | planned_not_created |
| `scripts/reports/generate_gate_results.sh` | report | fixed-run raw / check / suite status | `gate-results.md`;原样保留Failed / Blocked / conditional | planned_not_created |
| `scripts/reports/generate_acceptance_handoff.sh` | report | fixed RELEASE及四源报告 / digest | acceptance四draft;不得写pass / risk accepted /签署 | planned_not_created |
| `scripts/checks/check_redaction.sh` | check | artifact / report roots和deny marker | check JSON + safe finding;不回显正文 | planned_not_created |
| `scripts/checks/check_dependency_boundary.sh` | check | Cargo metadata / graph / source imports | 非core sibling compile依赖阻断 | planned_not_created |
| `scripts/checks/check_tc_coverage.sh` | check | expected TC manifest与case / suite raw | 254主归属,P0缺失 /重复 /换义阻断 | planned_not_created |
| `scripts/checks/check_protocol_inventory.sh` | check | formal protocol manifest与implementation / TC | 55 /55及family;缺失 /错族阻断 | planned_not_created |
| `scripts/checks/check_artifact_report_pairing.sh` | check | suite raw / logs / human report / digest | 任一pair缺失阻断 | planned_not_created |
| `scripts/checks/check_no_static_evidence.sh` | check | raw / report / evidence / acceptance roots | 禁止静态EV / pass和无raw draft | planned_not_created |
| `scripts/checks/check_qualification_identity.sh` | check | candidate / profile / generation / ENV / material identity | identity连续;缺失Blocked,错配Failed | planned_not_created |
| `scripts/checks/check_blocked_propagation.sh` | check | suite / gate / report / evidence status chain | Blocked不可变skip / pass / N/A | planned_not_created |
| `scripts/checks/check_cleanup_disposition.sh` | check | qualification / safety raw、guard、teardown / containment | 缺处置、guard bypass、teardown failure阻断 | planned_not_created |

共同参数 /上下文门禁:

- 所有正式入口显式接收或验证`run_id`,`artifact_root`,`config_profile`;按职责另含`report_root`,`gate`,`suite`,`environment`,`release_source_role`,`source_run_refs`。
- 五个gate writer必须写`run_intent`,`run_scope`,`trigger_refs[]`,`change_refs[]`;不得从路径、suite名或commit message猜测。
- raw root固定`artifacts/test/<run_id>`,human report固定`reports/runs/<run_id>`,acceptance / review使用固定平铺入口;禁止project子层和`latest`。
- 每次suite无论Passed / Failed / Blocked / NotRunConditional / InfraFailed都必须保留`report.json`与redacted stdout / stderr pair。
- RFC 8785 canonicalization和`sha256:<64 lowercase hex>`必须由经选择的库 /工具和fixture验证;当前未选择实现,不得用`jq` / `sha256sum`存在性宣称已闭合。
- Script boundary开工前必须关闭Shell规范 / lint前置;当前`bash`存在,专用Shell规范和`shellcheck`缺失。

### 7.12 Profile /环境与开工资格矩阵

| Profile /环境 | 本轮地位 | 开工前置 | 允许证明 | 不允许证明 /失败处置 |
|---|---|---|---|---|
| PROFILE-01 / ENV-01 | P0-C | loader / fake registry / fixed clock-id按正式配置可构造 | local contract / non-executing guard | 不证明真实执行;real launch必须reject |
| PROFILE-02 / ENV-02 | P0-C | deterministic fixture、run identity、suite / schema | contract / domain / UoW / idempotency / config | 不证明backend隔离 |
| PROFILE-03 / ENV-03 | P0-C | controlled resolver / event / handoff / sink binding | seam和failure mapping | 不证明真实boundary |
| PROFILE-04 / ENV-04 | P0-C | simulated handle / state / report / guard fixture | safety / replay / cleanup语义 | 不证明真实资源已处置 |
| PROFILE-05 / ENV-05 | P0-Q mandatory | concrete candidate、capability / template、generation、dedicated environment、capture / release、适用provider / material、13 CONF harness | 固定packet的四维隔离 / lifecycle候选证据 | 任一缺失Blocked且0 launch;不能fallback |
| PROFILE-06 / ENV-06 | P1 conditional | PROFILE-05资格 + durable / bus / resolver / handoff / scheduler / sink composition | fixed real-like composition | 未激活为NotRunConditional,不补P0 |
| PROFILE-07 / ENV-07 | P2 inactive | 先DesignReopen正式`00~07`并完成production前置 | 当前无 | 任何active / ready / production claim均阻断 |

`04`中的配置成熟度P1标签不改变PROFILE-05在本轮实施 /测试 /验收中的P0-Q mandatory地位;它只说明真实binding当前尚未qualified和不能由配置表激活。

### 7.13 前置项分类与关闭位置

| 前置ID | 前置项 | 当前状态 | 阻塞范围 | 最迟关闭位置 /关闭证据 |
|---|---|---|---|---|
| PRE-SBX-001 | 可复现design baseline | open_before_handoff | 全部实现boundary授权 | Step 13 /实现移交前记录用户确认后的真实design commit;本Step不commit |
| PRE-SBX-002 | 目标实现仓与项目级git config | open_before_first_boundary | 首个bootstrap /代码改动 | Step 5 / 6指定创建boundary;真实repo root和local git config回读 |
| PRE-SBX-003 | target edition / rust-version | open_before_bootstrap_boundary | root Cargo和全部crate | Step 6前由design owner固定与core兼容值;目标manifest落盘后Build Gate验证 |
| PRE-SBX-004 | core-contracts固定revision / worktree | open_before_first_cargo_boundary | 所有Cargo boundary | 移交时记录真实core commit / clean-or-declared worktree / API compatibility |
| PRE-SBX-005 | phase / boundary与逐项闭环审计 | open_before_handoff | 所有实现boundary | Step 5 / 6定义;Step 12 /13按正式`03/05/06/07`审计无未解blocker |
| PRE-SBX-006 | implementation ledger与planned skeleton | open_before_handoff | 实现agent开工 | Step 13创建项目ledger和全部boundary skeleton;仅一个current |
| PRE-SBX-007 | Shell编码 / lint规则 | open_before_script_boundary | 17个`.sh`脚本及相关CI | Step 6 / 7绑定正式Shell规范或经审查项目级规则,并决定shellcheck安装 /等价检查 |
| PRE-SBX-008 | RFC 8785 canonical JSON实现 | open_before_schema_writer_boundary | machine schema / digest writer和check | Step 6 / 7选择库 /工具;fixture验证canonical bytes和self-digest排除规则 |
| PRE-SBX-009 | concrete candidate backend与ADR | open_before_p0q_boundary | P0-Q binding / 13 CONF | Step 3登记、Step 8细化;真实ADR / capability / lifecycle / capture / release契约 |
| PRE-SBX-010 | SBX-ENV-05 / provider / material identity | open_before_p0q_execution | 需要真实binding / material的CONF | Step 8定义准备;执行前immutable qualification manifest与0-launch validation |
| PRE-SBX-011 | adjacent真实联合环境 | conditional_p1 | PROFILE-06 / joint E2E | 只有正式激活claim后关闭;未激活保持NotRunConditional,不阻塞P0-C / P0-Q |
| PRE-SBX-012 | retention物理TTL /介质 | condition_guard_only | 法规 /合同 / release evidence boundary适用 | 当前不得发明天数;先遵守`05/06`condition guard,硬要求出现时由`07/09`固定carrier / runbook / authority |
| PRE-SBX-013 | PROFILE-07 / production前置 | inactive_design_reopen | 任一production / capacity / DR claim | 先回写正式`00~07`;当前没有关闭路径或授权 |

当前没有阻塞Step 4“抽取实施对象与交付物”讨论的上游设计blocker。上述open项必须在各自最迟位置关闭;不能因为Step 3已完成就把它们标为ready。

---

## 8. 复杂度与分批判断

本Step包含32项SOP回答、11个阅读包、11条永久记忆、17个脚本及多类前置门禁,已按“问题 /取舍”“阅读 /台账”“记忆”“环境 /工具 /依赖”分批写入一个主件。当前不需要拆分登记分件,因为所有表共同回答正式§3的唯一主题,且没有逐phase / boundary实例。Step 5 / 6若阅读矩阵实例化过长,必须按phase / boundary分件,不得压回本Step泛化。

---

## 9. 正式章节回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“现实核验表”“全局阅读清单”“实施关注面阅读矩阵输入”“实施台账入口表”“Agent启动与永久记忆种子表”“测试脚本与报告工具前置检查”和“前置项分类与关闭位置”,了解哪些条件当前只是planned、如何绑定未来boundary及何时必须暂停。

正式`07-实施计划.md` §3应收口为:

实施者开始任何代码、配置、脚本或测试改动前,必须先从项目级implementation ledger和当前boundary ledger恢复状态,再按当前boundary绑定的`READ-SBX-*`阅读包读取正式`00~07` exact章节、对应校准产物和规范。正式文档是实现基线;正式结论不清楚时读取校准来源,仍不闭合或冲突时必须`wait_design`,不得由实现端补字段、DTO、port、状态、UoW、配置、evidence或boundary。

目标实现仓固定为`/home/aris/Projects/quantalithos-sandbox`,实现代码不得写入design仓。workspace采用正式`03`定义的`contracts/domain/application/infra/api/worker/jobs`七crate及`sandbox-<role>` / `sandbox_<role>`命名,代码名不得泄漏`L4`。当前目标仓不存在,edition / rust-version尚未成为目标仓落盘事实;bootstrap boundary前必须由design owner固定兼容值。目标仓项目级git user固定为`quantalithos-labs <quantalithos.ai@gmail.com>`,实现仓commit使用英文`type(scope): subject`及正式body / footer规则。

当前唯一允许的编译期sibling dependency是`core-contracts = { path = "../quantalithos-core/crates/contracts" }`;tools、runtime、member-service、bus和其他仓只能通过port、adapter、event、handoff、safe ref或fake协作。P0-C可在formal fake / controlled seam下推进,但PROFILE-05 concrete candidate binding和13条CONF属于P0-Q mandatory;candidate / environment /适用material identity缺失时只能Blocked且0 launch。

实现agent的项目永久记忆只能逐字投影`MEM-SBX-001~011`,不得自由总结或复制详细设计truth。每次继续、换agent、boundary切换、提交前或design baseline变化后,必须刷新正式台账和受影响记忆。Step 6定义真实Boundary Gate Matrix后,Step 13必须与正式`07`同步创建项目级implementation ledger和全部planned boundary skeleton;未来boundary保持`planned / wait_until_current`。

测试与验收工具必须按正式`05`实现5个gate、3个report和9个check入口,使用`artifacts/test/<run_id>`,`reports/runs/<run_id>`,`reports/acceptance`和`reports/review`,禁止project子层、`latest`、静态EV或静态通过。Shell规范 / lint与RFC 8785实现仍是受影响automation boundary前置,不得预填通过。

---

## 10. 待确认事项与blocker

| 项目 | 类型 | 是否阻塞Step 4 | 当前处理 | 后续owner /位置 |
|---|---|---:|---|---|
| 目标仓由独立准备还是首个bootstrap boundary创建 | planning decision | 否 | 只固定目标路径和门禁 | Step 5确定phase;Step 6确定boundary |
| target edition / rust-version exact值 | affected-boundary blocker | 否 | 不复制core为已落盘事实 | Step 6 bootstrap boundary前design owner关闭 |
| Shell脚本规范、shellcheck或等价lint | affected-boundary blocker | 否 | 保持open,不发明通用规则 | Step 6 / 7 automation owner关闭 |
| RFC 8785实现库 /工具 | affected-boundary blocker | 否 | 保持产品 /库中立,要求fixture验证 | Step 6 / 7 schema writer boundary关闭 |
| concrete isolation candidate / ADR | P0-Q blocker | 否 | P0 mandatory但产品中立 | Step 8准备;P0-Q boundary前architecture / security owner关闭 |
| provider / principal / material identity适用范围 | conditional P0-Q blocker | 否 | 只阻塞需要真实material的资格项,不扩大无关范围 | Step 8按CONF逐项判定 |
| adjacent真实联合E2E | P1 conditional | 否 | 未激活NotRunConditional | Step 8 / 9及未来claim owner |
| retention TTL / physical media | conditional downstream blocker | 否 | 只承接condition-based guard,不发明天数 | Step 8 / 9和future`09` |
| implementation ledger / boundary ID | handoff blocker | 否 | 当前只固定入口 /模板 | Step 5 /6设计,Step 13创建 |

未发现需要回写正式`00~06`才能进入Step 4的上游设计blocker。PROFILE-05配置成熟度P1与测试 /验收P0-Q已由正式`05`解释为不同轴,不是当前冲突。README仍为historical material。

---

## 11. 自检与停审

| 自检项 | 结果 |
|---|---|
| 是否回答SOP 32项问题 | 通过,32 /32 |
| 是否形成阅读清单和可实例化矩阵 | 通过,全局清单 +11个`READ-SBX-*`包 |
| 是否按实际boundary组织而非伪造ID | 通过;真实ID留Step 6,并固定实例化门禁 |
| 是否固定三类implementation ledger入口 | 通过;未提前创建实例 |
| 是否固定Boundary Gate Matrix和全部planned skeleton规则 | 通过;只给模板和Step 13创建时点 |
| 是否形成永久记忆种子与生成门禁 | 通过,11条;不复制设计truth |
| 是否核验git / Rust /目标仓 / sibling现实 | 通过;存在、缺失与planned分离 |
| 是否覆盖七crate / package / crate / binary命名 | 通过 |
| 是否覆盖17个planned脚本与fixed-run路径 | 通过,5 +3 +9;均未伪造实现 |
| 是否保持P0-C / P0-Q与P1 / P2边界 | 通过;PROFILE-05仍P0-Q mandatory |
| 是否保持tools / runtime / member / Artifact / Observability / Policy非职责 | 通过 |
| 是否处理Shell规范和canonical JSON缺口 | 通过;列为受影响boundary前置,未自行发明 |
| 是否创建正式`07`、Step 4、implementation ledger或skeleton | 否 |
| 是否伪造commit、run、EV、测试结果、验收结论或签署 | 否 |

本Step完成后已停审并经用户确认。后续只允许由`07_implementation_plan_step_04_objects_deliverables.md`承接;仍不得写正式`07`,不得创建implementation ledger、`implementation-boundaries/`或目标实现仓。

---

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 前置阅读和权威顺序明确 | passed | 正式优先、校准解释、冲突`wait_design` |
| 未来phase / boundary阅读实例化规则明确 | passed | 11个阅读包,Step 5 /6必须补真实ID |
| 仓库 / git / Rust /命名前置明确 | passed_with_affected_boundary_open_items | 目标仓 /版本尚未形成,关闭位置已登记 |
| sibling与外部依赖边界明确 | passed | 仅core compile;其余seam / fake / conditional |
| 台账 / Gate Matrix / planned skeleton责任明确 | passed_for_step_6_and_13 | Step 6定义,Step 13创建 |
| 永久记忆种子完整 | passed | 11条规则可机械投影 |
| 脚本 /报告 /证据前置明确 | passed_with_script_blocker | 17脚本完整;Shell规范和RFC 8785实现待affected boundary关闭 |
| 无阻塞Step 4的上游设计冲突 | passed | open项均有最迟关闭位置 |
| 用户确认Step 3 | passed | 用户已明确“继续”,Step 4获放行 |

```text
step_3_result = completed_reviewed_passed_to_step_4
reading_packages = 11
memory_seeds = 11
planned_scripts = 17
implementation_ledger_paths_defined = yes
boundary_ids_defined = no_wait_until_step_6
allow_step_4_discussion = yes
allow_formal_07_assembly = no
allow_implementation_handoff = no
commit_required = no
```
