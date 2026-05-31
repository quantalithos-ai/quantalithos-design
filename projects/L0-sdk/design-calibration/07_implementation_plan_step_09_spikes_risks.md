# L0-sdk 07 实施计划 Step 9: Spike、风险与待确认事项

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 9 中间产物。
> 本步前置识别 L0-sdk 实施中可能导致返工、延期、验收失败或上游设计回写的不确定性,并为每项定义处理方式、输出物和截止点。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义 Spike、风险与待确认事项 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §9 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承 `00~06` 已足以制定实施计划、目标实现仓仅有 git shell、Python / TypeScript 工具链待确认的结论 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-07 阶段顺序,用于绑定风险影响阶段 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 commit boundary、代码批次和开工前复核矩阵 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承每阶段测试门禁、验收门禁、VETO 前置规避和证据归档规则 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承配置、环境、path dependency、fake / fixture 和外部依赖边界 |
| `03-详细设计.md` §13~§17 | 已完成 | 提取配置依赖、可观测、测试切口、风险和待确认事项 |
| `05-测试方案.md` | 已完成 | 提取 gate scripts、redaction、artifact、report、缺陷复验和残余风险处理 |
| `06-验收标准.md` | 已完成 | 提取 AC、VETO、风险接受和最终签署口径 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做 Spike | 目标仓 workspace 初始化、core / bus contracts path dependency 编译、Rust / Python / TypeScript 工具链命令、fake / fixture boundary、local package generator / builder、redaction scanner、cross-language smoke、compatibility / deprecated fixture、report link / no-latest check 都需要前置 Spike 或最小验证切片。 |
| 2. 哪些风险会阻塞某个阶段 | 目标仓没有可编译 workspace 会阻塞 PH-01;core / bus contracts 不可编译会阻塞 PH-01~PH-02;Python / TypeScript 工具链不可用会阻塞 PH-04~PH-05;redaction / credential 泄漏会阻塞 PH-03 起所有安全门禁;candidate stable gate 错误会阻塞 PH-04;smoke skipped 当 passed 会阻塞 PH-05;compatibility / migration 缺失会阻塞 PH-06;证据路径、latest 或 VETO 命中会阻塞 PH-07。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁 | 是否复用当前 git shell、Python / TypeScript 具体工具命令、是否提前接 public registry / production endpoint、fake success 是否可支撑 stable、acceptance handoff 是否纯脚本生成、L1/L2/L3/L4 service repo 是否可作为编译期依赖,都会影响提交边界或验收门禁。 |
| 4. 每个 Spike 的输出是什么 | 每个 Spike 必须输出可审查物:compile smoke、toolchain version snapshot、fixture、最小测试、失败样例、layout check、redaction hit / clean 样例、smoke result、report link check 或决策记录。不能只输出口头结论。 |
| 5. 每个风险的处理方式和截止点是什么 | 风险必须绑定 PH 阶段和 commit boundary。P0 / VETO 相关风险不得拖到 PH-07 才首次发现,必须在最早可验证阶段关闭或暂停。 |
| 6. 哪些风险需要回写上游设计 | 如果实际 core / bus contracts、SDK 状态 enum、DTO 字段、config schema、测试用例、验收口径或 evidence 路径与 `03` / `04` / `05` / `06` 冲突,必须暂停实现并回写设计文档后再继续。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 风险散落在 `03`、`05`、`06` 和 Step 8 | 实施者需要跨文档自行识别 | 可能遗漏三语言、redaction、fake marker、candidate stable 或 evidence 路径红线 | 汇总成阶段绑定风险表 |
| 目标仓状态发生变化 | `/home/aris/Projects/quantalithos-sdk` 已存在,但仅有 `.git`、`.codex` 和 `.gitignore` | 继续写“仓不存在”会误导 PH-01 | 收敛为“仓已存在但未初始化 workspace” |
| Python / TypeScript 工具链未实测 | 三语言是 P0,但目标仓 package 结构尚未建立 | 实施时可能把非 Rust 语言后置或降级 | 列为 Spike,不得降级 |
| fake / fixture 容易污染 stable | P0 需要 fake 默认路径,但 stable 不能由 fake-only success 支撑 | 触发 VETO-SDK-004 / 006 / 007 | 明确 fake marker 和 stable gate 风险 |
| 上游回写触发条件未集中 | 实现者可能自行补设字段或选边 | 文档与实现分叉 | 定义必须回写的触发条件 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| Spike | 只知道复杂点存在 | 每个 Spike 有编号、阶段、输出物和截止点 | 可在阶段前验证关键不确定性 |
| 风险 | 分散在设计、测试和验收文档 | 形成阶段风险表 | 实施者知道何时必须停下 |
| 待确认事项 | 容易写成“后续确认” | 每项给出方案、推荐方案、原因和截止点 | 避免长期悬空 |
| 目标仓状态 | 旧口径是“未发现” | 新口径是“已存在但仅有 git shell” | PH-01 动作更准确 |
| 上游回写 | 依赖临场判断 | 定义必须回写的触发条件 | 防止 1:1 实现时擅自补设 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 不单独列 Spike,直接在阶段任务中处理 | 表面简洁 | 高风险点可能到后期才暴露 | 不采用 |
| 把所有不确定性都做成 Spike | 探索充分 | 会拖慢 P0,且可能变成研究项目 | 不采用 |
| 只对会影响阶段门禁、VETO 或提交边界的不确定性设 Spike | 聚焦可验证风险 | 需要明确输出和截止点 | 采用 |
| 目标仓仅有 git shell 时重新删除建仓 | 可以从零开始 | 可能破坏已有仓配置,且不是必要动作 | 不采用 |
| 复用当前 git shell,PH-01 初始化 workspace 和项目级 git config | 保留现有仓位置,责任清楚 | 需要 PH-01 严格检查空仓状态 | 采用 |
| Python / TypeScript 工具链不通时降为 P1 | 短期推进 Rust 快 | 违反三语言 official SDK P0 | 不采用 |
| Python / TypeScript 工具链不通时暂停对应阶段或进入 Spike | 保持 P0 真实边界 | 可能延后 PH-04 / PH-05 | 采用 |
| public registry / production endpoint 提前纳入 P0 | 更接近最终发布 | 扩大范围,引入凭据和外部服务依赖 | 不采用 |
| local candidate + fake / fixture + report evidence 支撑 P0 | 可独立验证 | 需要后续 release / production 专项 | 采用 |

---

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出物 | 截止点 |
|---|---|---|---|---|---|
| SP-SDK-001 | spike | 验证 `/home/aris/Projects/quantalithos-sdk` 当前 git shell 能否直接初始化为目标 workspace,并确认项目级 git config | PH-01 | repo snapshot、workspace init smoke、git config 输出 | `commit-01-a` 前 |
| SP-SDK-002 | spike | 验证 `core-contracts` 和 `bus-contracts` path dependency 的 package name、lib name、version / commit 和最小引用样例 | PH-01 / PH-02 | dependency snapshot、cargo compile smoke、最小 imports 测试 | `commit-01-a` 前 |
| SP-SDK-003 | spike | 固定 Rust / Python / TypeScript 的本地 build / test / smoke 命令,并确认三语言不能降级 | PH-01 / PH-04 / PH-05 | toolchain version snapshot、command matrix、失败处理记录 | `commit-01-b` 前记录,`commit-04-b` 前实跑 |
| SP-SDK-004 | spike | 验证 fake formal API endpoint 与 fake bus boundary 必须带 fake marker,且 fake-only success 不得支撑 production supported / stable | PH-03 / PH-04 | fake fixture、negative tests、boundary violation 样例 | `commit-03-a` 前 |
| SP-SDK-005 | spike | 验证 local package generator / builder 能产出 Rust / Python / TypeScript package artifact metadata 和 layout check 输入 | PH-04 | candidate artifact 样例、layout check 输出、digest / metadata 样例 | `commit-04-b` 前 |
| SP-SDK-006 | spike | 验证 redaction scanner 覆盖 config、logs、artifacts、reports、evidence 和 acceptance handoff 中的 raw body / raw secret / forbidden body | PH-03 / PH-05 / PH-07 | `check_redaction.sh` smoke、hit 样例、clean 样例 | `commit-03-b` 前 smoke,PH-07 前全量 |
| SP-SDK-007 | spike | 验证 cross-language smoke 能比较 Rust / Python / TypeScript 的概念、错误、trace 和 result ref 表达一致性 | PH-05 | smoke fixture、三语言结果对比样例、skipped / failed 样例 | `commit-05-b` 前 |
| SP-SDK-008 | spike | 验证 compatibility / deprecated / migration fixture 能表达 breaking、requires migration、pending removal 和 removed | PH-06 | compatibility fixture、migration ref negative test、deprecated lifecycle test | `commit-06-a` 前 |
| SP-SDK-009 | spike | 验证 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 的证据回链、no-latest 和无 `<project>` 层级检查 | PH-01 / PH-07 | path check、link check、acceptance handoff 样例 | `commit-01-b` 前建骨架,PH-07 前完整 |

### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-SDK-001 | risk | 目标实现仓已存在但仅有 git shell,没有可编译 workspace | PH-01 | PH-01 初始化 workspace、packages、scripts、artifacts、reports 和项目级 git config | `commit-01-a` / `commit-01-b` 前 |
| R-SDK-002 | risk | `core-contracts` / `bus-contracts` 实际 package、lib name、类型或 API 与设计不一致 | PH-01 / PH-02 | 先做 SP-SDK-002;不一致时暂停并回写 `03` 或依赖说明 | `commit-01-a` 前 |
| R-SDK-003 | risk | Python / TypeScript 工具链不可用或命令未固定 | PH-04 / PH-05 | SP-SDK-003;不得降级三语言 P0;不可用则暂停对应阶段或登记 blocker | `commit-04-b` 前 |
| R-SDK-004 | risk | Rust / Python / TypeScript 概念、错误、trace 或 result ref 语义漂移 | PH-02 / PH-05 | concept map + cross-language smoke;漂移必须修复 | `commit-05-b` 前 |
| R-SDK-005 | risk | fake / fixture 成功被误标 production supported 或支撑 stable | PH-03 / PH-04 | fake marker、boundary guard、candidate stable negative tests | `commit-04-a` 前 |
| R-SDK-006 | risk | raw credential、raw request / response body、forbidden body 泄漏到 config、log、artifact、report 或 evidence | PH-03~PH-07 | redaction scanner 前置;命中即 blocker;清理后重跑受影响 suite | `commit-03-b` smoke,PH-07 全量 |
| R-SDK-007 | risk | stale / unknown source 被配置成 fresh,或 SDK 复制 core / bus truth | PH-02 / PH-04 | freshness state tests、contract source tests、query no-write tests | `commit-02-b` 前 |
| R-SDK-008 | risk | candidate stable gate 忽略 freshness、evidence、redaction、compatibility 或 fake-only 标记 | PH-04 / PH-05 / PH-06 | candidate state tests + evidence redaction + compatibility decision gate | `commit-06-a` 前 |
| R-SDK-009 | risk | public registry、production endpoint、real credential provider 或 full service client coverage 被混入 P0 | PH-03~PH-05 | 写入非范围;只做 local candidate、fake / fixture 和 ref-only credential | 每个涉及 boundary / package 的 commit 前 |
| R-SDK-010 | risk | Service / Event boundary、Query 或 projection 反写 SDK truth 或上游 truth | PH-02 / PH-03 / PH-07 | boundary no-write、query no-write、projection rebuild no-truth tests | `commit-07-a` 前 |
| R-SDK-011 | risk | compatibility decision、deprecated record 或 migration ref 缺失仍允许兼容通过 | PH-06 | compatibility / deprecated negative tests;缺 migration ref 必须失败 | `commit-06-a` 前 |
| R-SDK-012 | risk | artifact / report 使用 `latest`、跨 run 拼接、缺 run_id 或带 `<project>` 层级 | PH-01 / PH-07 | path check、link check、fixed run_id、acceptance handoff 审查 | `commit-01-b` 和 PH-07 |
| R-SDK-013 | risk | commit boundary 被按文件 / crate 拆散,或实现仓出现中文源码注释、测试名、commit message | PH-01~PH-07 | 一笔提交对应 §6 boundary;实现仓英文;提交前 review message 文件 | 每笔提交前 |

### 7.3 待确认事项表

| 编号 | 类型 | 待确认事项 | 方案 | 推荐方案 | 影响阶段 | 截止点 |
|---|---|---|---|---|---|---|
| Q-SDK-001 | decision | 当前 `/home/aris/Projects/quantalithos-sdk` 仅有 git shell,是否复用 | A. 删除重建;B. 复用 git shell 并初始化 workspace;C. 暂停实施计划 | 推荐 B,原因是路径正确且无需破坏已有仓配置,PH-01 可补齐骨架 | PH-01 | `commit-01-a` 前 |
| Q-SDK-002 | decision | Python / TypeScript 具体工具命令如何确定 | A. PH-01 记录版本和候选命令,PH-04 / PH-05 前实跑;B. 到 PH-04 再想;C. 降为 P1 | 推荐 A,原因是三语言是 P0,但 package 结构需 PH-04 才能完整实跑 | PH-01 / PH-04 / PH-05 | `commit-01-b` 前记录,`commit-04-b` 前实跑 |
| Q-SDK-003 | decision | 是否提前接 public registry | A. 接 crates.io / PyPI / npm;B. 只做 local candidate;C. 先留空 | 推荐 B,原因是 public registry 需要 release / credential / ops 专项,不属于 P0 | PH-04 / PH-05 | `commit-04-b` 前 |
| Q-SDK-004 | decision | fake / fixture 是否可支撑 stable | A. 可支撑;B. 不可支撑,必须保留 fake marker;C. 视用例而定 | 推荐 B,原因是 fake-only success 支撑 stable 会触发 VETO-SDK-006 / 007 | PH-03 / PH-04 | `commit-04-a` 前 |
| Q-SDK-005 | decision | L1/L2/L3/L4 service repo 是否作为 Cargo path dependency | A. 是;B. 否,只作为运行期依赖 / 人工查阅 / fixture 来源;C. 视仓而定 | 推荐 B,原因是 SDK 不能拥有服务端业务 truth | PH-03 | `commit-03-a` 前 |
| Q-SDK-006 | decision | redaction 命中是否允许风险接受 | A. 允许;B. 不允许,必须修复并重跑;C. 只在非生产允许 | 推荐 B,原因是 raw secret / forbidden body 属于 VETO 候选 | PH-03~PH-07 | 首次命中时 |
| Q-SDK-007 | decision | acceptance handoff 是否纯脚本生成 | A. 纯脚本;B. 脚本生成初稿 + 人或 Agent 审查补充;C. 全人工 | 推荐 B,原因是证据索引可自动生成,但 VETO、风险接受和 open issues 需要责任判断 | PH-07 | `commit-07-b` 前 |
| Q-SDK-008 | decision | 正式文档与 `design-calibration` 冲突时如何处理 | A. 正式文档优先;B. calibration 优先;C. 实施者自行取舍 | 推荐 A,原因是正式文档是实现基线;仍不清楚时暂停回写 | PH-01~PH-07 | 每个 boundary 开工前 |

### 7.4 上游回写触发条件

| 触发条件 | 回写目标 | 当前处理 | 截止点 |
|---|---|---|---|
| `core-contracts` / `bus-contracts` 实际 API、package name、lib name 或版本语义与 `03` 不一致 | `03-详细设计.md`、必要时 `02-概要设计.md` | 暂停 PH-01 / PH-02,回写依赖说明或调整设计 | `commit-01-a` 前 |
| Command / Query / Event / Job DTO 字段无法构造详细设计中的对象、状态或流程 | `03-详细设计.md`、`05-测试方案.md` | 暂停当前 boundary,补齐字段闭环和测试口径 | 对应 commit 前 |
| `PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState` 或 deprecated lifecycle 与测试 / 验收口径冲突 | `03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` | 暂停实现,统一状态真相源 | 对应状态阶段前 |
| JSON 配置无法表达 profile、boundary、credential ref-only、redaction、artifact / report root 或 fail-fast 语义 | `04-配置设计.md`、`03-详细设计.md` §13 | 暂停相关 config 实现,回写配置设计 | PH-01 / PH-03 前 |
| redaction checker 无法覆盖验收要求的 config、artifact、report、evidence 或 handoff 范围 | `05-测试方案.md`、`06-验收标准.md` | 暂停安全门禁通过结论,补测试或验收口径 | PH-03 smoke 或 PH-07 前 |
| public registry、production endpoint 或 real credential provider 被迫进入 P0 默认路径 | `00-需求文档.md`、`01-架构设计.md`、`03-详细设计.md` | 暂停 P0 范围,重新裁剪需求和架构依赖 | PH-04 前 |
| report / artifact 路径规则与 standards 新规则冲突 | `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | 以 standards 为准回写项目文档 | PH-07 前 |

### 7.5 blocker 分类表

| 分类 | 当前是否存在 | 示例 | 处理 |
|---|---|---|---|
| 当前文档 blocker | 否 | 缺少 `00~06` 任一必需文档或正式文档互相冲突 | 当前不存在,可继续 Step 10 |
| 当前实施前置 blocker | 是 | 目标仓仅有 git shell、workspace 未初始化、项目级 git config 未确认 | PH-01 必须先处理 |
| 阶段 blocker | 是 | contracts 不可编译、Python / TypeScript 不可用、redaction 命中、candidate stable gate 失败、VETO 命中 | 阶段内暂停,修复或回写后再继续 |
| 可接受风险 | 是 | public registry 未接、production endpoint 未全覆盖、real credential provider 未接、full service client coverage 未做 | 不阻塞 P0,但 PH-07 需要风险接受或后续专项记录 |
| 不可接受风险 | 是 | 三语言 P0 降级、SDK 复制 core / bus truth、fake-only stable、raw secret 泄漏、证据不可审计 | 不得风险接受,必须修复或判定不通过 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §9。

````markdown
## 9. Spike、风险与待确认事项

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“待确认事项表”“上游回写触发条件”和“blocker 分类表”小节,了解哪些不确定性必须在对应阶段截止点前关闭。

本轮实施当前不存在阻塞制定实施计划的文档 blocker。实施前置 blocker 是目标实现仓 `/home/aris/Projects/quantalithos-sdk` 当前仅有 git shell,PH-01 必须补齐 workspace、packages、scripts、artifacts、reports 和项目级 git config。

正式内容从 `design-calibration/07_implementation_plan_step_09_spikes_risks.md` §7.1~§7.5 摘录。
````

---

## 9. 待确认事项

| 事项 | 当前推荐方案 | 原因 | 影响 |
|---|---|---|---|
| 是否复用当前 SDK git shell | 复用并在 PH-01 初始化 workspace | 路径正确且无需破坏已有仓配置 | PH-01 必须先补齐骨架 |
| Python / TypeScript 工具命令如何确定 | PH-01 记录版本和候选命令,PH-04 / PH-05 前实跑 | 三语言是 P0,但 package 结构需要阶段推进 | 不得降级三语言 |
| public registry 是否进入 P0 | 不进入 | P0 是 local candidate + evidence,registry 属于 release / ops 专项 | PH-04 / PH-05 不接外部 registry |
| fake / fixture 是否支撑 stable | 不支撑,必须保留 fake marker | 避免 VETO-SDK-006 / 007 | PH-03 / PH-04 前置检查 |
| acceptance handoff 是否纯脚本 | 脚本初稿 + 人或 Agent 审查 | VETO、风险接受和 open issues 需要责任判断 | PH-07 必须审查 |

建议方案: 接受以上推荐方案并进入 Step 10。原因是这些方案与 `00~06` 的 P0 三语言 official SDK、local candidate、fake / fixture 边界、redaction、安全门禁和证据可追溯要求保持一致。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| Spike 均有明确输出物和截止点 | 已满足 |
| 风险均绑定影响阶段、处理方式和截止点 | 已满足 |
| 待确认事项均给出方案、推荐方案、原因和截止点 | 已满足 |
| 当前文档 blocker、实施前置 blocker、阶段 blocker、可接受风险和不可接受风险已区分 | 已满足 |
| 上游回写触发条件已明确 | 已满足 |

结论: 可以进入 Step 10,继续定义回退、暂停与变更控制。
