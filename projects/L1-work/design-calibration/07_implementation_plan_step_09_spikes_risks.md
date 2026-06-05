# L1-work 07 实施计划 Step 9: Spike、风险与待确认事项

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §9 Spike、风险与待确认事项
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义 Spike、风险与待确认事项 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_09_spikes_risks.md` |

本步把 Step 1~Step 8、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md` 中已经暴露的不确定性整理为 Spike、风险、待确认事项和 blocker 判定规则。本步不新增 P0 范围、不改变 phase / commit boundary、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承目标实现仓未创建、core baseline 固定、design commit 固定和 sibling readiness 风险 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承阅读、永久记忆、git、工具、目录、依赖和证据路径前置风险 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 22 个 commit boundary 和每个 boundary 的设计闭环开工复核 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 gate、artifact、report、redaction、no-write、VETO 和失败处理口径 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承 P0 compile blocker、fake seam、profile、configured ref 和 P1/P2 production 风险 |
| `03-详细设计.md` §17 | 已完成 | 提取目标仓未确认、P0 协议面后续候选和真实 durable / runtime / observability 风险 |
| `04-配置设计.md` §14 | 已完成 | 提取 production-like、secret provider、config center、advanced search、clock / id、report root 等配置风险 |
| `05-测试方案.md` §14 | 已完成 | 提取回归触发、残余风险、不允许进入残余风险的项目 |
| `06-验收标准.md` §12~§13 | 已完成 | 提取 S / A / B / C 缺陷、风险接受边界和不得风险接受项 |
| `standards/document/实施计划讨论流程_SOP.md` Step 9 | 已读取 | 约束 Spike 表、风险表、待确认事项表、截止点和 blocker 分类 |

校准来源:

- `design-calibration/03_ddd_step_18_risks_open_questions.md`
- `design-calibration/04_config_step_14_risks_open_questions.md`
- `design-calibration/05_test_plan_step_14_regression_risks.md`
- `design-calibration/06_acceptance_step_12_defect_retest_release.md`
- `design-calibration/06_acceptance_step_13_risk_acceptance.md`
- `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做 Spike | 需要 Spike 的不是 P0 业务对象本身,而是 core dependency 兼容、report / artifact dry-run、redaction scanner 覆盖、query no-write digest guard、operations replay 最小 bundle、configured adapter fake marker 和 release evidence pack dry-run。 |
| 2. 哪些风险会阻塞某个阶段 | `core-contracts` 缺失或 drift 会阻塞 PH-01;正式设计字段 / DTO / 状态缺口会阻塞对应 boundary;redaction、query no-write、duplicate truth、fake-as-production、evidence index 缺失和 VETO 失败会阻塞对应阶段或 PH-09。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁 | design commit 固定、core commit 固定、目标仓初始化、profile / report root 是否需要 runtime config、P1/P2 production dependencies、secret provider、config center、retention 和 advanced search 都有截止点;未确认前不得扩大 P0。 |
| 4. 每个 Spike 的输出是什么 | 每个 Spike 必须输出可审查 artifact、report draft、fixture shape、check rule 或 design回写结论,不能只输出口头判断。 |
| 5. 每个风险的处理方式和截止点是什么 | 风险表逐项绑定 PH / commit boundary 和截止点。P0 blocker 在截止点前未解除则暂停;P1/P2 风险进入后续专项或风险接受,不得污染 P0。 |
| 6. 哪些风险需要回写上游设计 | 字段 / DTO / 状态 / config field / runtime dependency / acceptance gate 需要新增或改变时必须回写 `03/04/05/06/07`;生产化产品选择不回写 P0,进入 P1/P2 专项。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 风险散落在多个文档 | `03/04/05/06` 各有风险和待确认项 | 实施时可能漏掉阶段截止点 | 本步统一编号并绑定 PH / commit boundary |
| Spike 和实现任务容易混淆 | PH-01 已含 workspace / config skeleton | Spike 若没有输出会变成长期探索 | 本步要求每个 Spike 有产物和截止点 |
| P1/P2 风险可能污染 P0 | production adapter、secret provider、config center 都未定义 | 实施者可能提前补字段或产品依赖 | 本步明确不进入 P0,启用需回写设计 |
| blocker 与 residual risk 边界不清 | `05/06` 强调 S / VETO 不得风险接受 | 若不嵌入实施计划,失败可能被误放行 | 本步将不得接受项写成 blocker 规则 |
| 设计缺口处理需要贯穿所有 phase | Step 6 已定义开工复核 | 仍可能在实现侧自行补 schema | 本步把设计缺口列为跨阶段 blocker 触发器 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| Spike | 未集中定义 | 形成有输出、有截止点的 Spike 表 | 防止无边界探索 |
| 风险 | 分散在 Step 1 / 8 / 03 / 04 / 05 / 06 | 形成稳定风险编号、影响阶段和处理口径 | 实施阶段可追踪 |
| 待确认事项 | 有些只在上游风险表出现 | 形成 owner / 截止点 / 未确认前处理 | 不允许长期悬空 |
| blocker | 只在门禁文档中隐含 | 明确当前无阻塞 Step 10 的 blocker,但有实施阶段 blocker 触发器 | 防止误判可开工范围 |
| 回写规则 | Step 6 有设计闭环复核 | 本步补上回写触发和回写目标文档 | 便于 agent 回报缺口 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有不确定项都列为 blocker | 最保守 | P1/P2 production 风险会阻塞 P0 | 不采用 |
| 把所有不确定项都列为 residual risk | 推进快 | P0 红线可能被风险接受 | 不采用 |
| 按 P0 / selected / P1-P2 分级 | 可推进且不放松红线 | 需要明确截止点 | 采用 |
| Spike 覆盖完整生产 adapter | 提前发现生产风险 | 超出 P0 且会膨胀 | 不采用 |
| Spike 只验证边界和证据可行性 | 小而可审查 | 不能证明生产化 | 采用 |

## 7. 结构化中间产物

### 7.1 分类规则

| 分类 | 定义 | 处理 |
|---|---|---|
| Spike | 需要小范围验证才能降低实现返工的不确定性 | 必须有输出、截止点和不进入生产化承诺 |
| P0 risk | 可能影响当前 P0 phase / commit boundary 的风险 | 绑定阶段、提交边界和门禁;到期未解则暂停 |
| P1/P2 risk | 不影响 P0 主线,但影响后续 production-like / operations / product enhancement | 不阻塞 P0;移交后续专项或风险接受 |
| Open item | 需要责任方确认,但当前有明确未确认前处理方式 | 绑定截止点;不得写成“后续确认” |
| Blocker | 已经阻止当前 phase / boundary 继续的事实 | 暂停当前 boundary,补设计 / 环境 / 门禁后恢复 |

### 7.2 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| `SP-WORK-001` | spike | 验证 `core-contracts` 本地 path dependency 与 Rust workspace skeleton 可编译 | PH-01 | dependency compile artifact、core commit 记录、non-core dependency check 规则 | `commit-01-a` 提交前 |
| `SP-WORK-002` | spike | 验证 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` dry-run 输出和 no `latest` check | PH-01 / PH-09 | path check artifact、minimal report draft、script help 输出 | `commit-01-b` 提交前 |
| `SP-WORK-003` | spike | 验证 redaction scanner 能覆盖 config、log、artifact、report、event dump 和 fixture dump 的 forbidden output | PH-04 / PH-08 / PH-09 | redaction fixture set、scan report、failure example | `commit-04-a` 开工前 |
| `SP-WORK-004` | spike | 验证 query / projection / report no-write 的 before / after state digest 断言方式 | PH-07 / PH-08 | no-write assertion helper、state digest artifact、failure example | `commit-07-b` 开工前 |
| `SP-WORK-005` | spike | 验证 operations-replay 最小 sanitized bundle、baseline digest 和 rerun report shape | PH-08 / PH-09 | replay bundle fixture shape、baseline mismatch report、rerun receipt sample | `commit-08-d` 开工前 |
| `SP-WORK-006` | spike | 验证 configured adapter 与 fake adapter 的 marker、ref validation 和 fake-as-production reject | PH-03 / PH-08 / PH-09 | fake marker check、configured missing-ref failure artifact、selected seam report | `commit-03-b` 开工前 |
| `SP-WORK-007` | spike | 验证 release evidence pack 能从 suite artifact 生成 evidence index、gate results、redaction report 和 veto checklist 初稿 | PH-09 | release-evidence-pack dry-run、missing EV failure example、review checklist | `commit-09-a` 开工前 |

### 7.3 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| `R-WORK-001` | P0 risk | 目标实现仓 `/home/aris/Projects/quantalithos-work` 当前未创建 | PH-01 | PH-01 初始化目标仓、workspace、git config 和 crate skeleton | `commit-01-a` 提交前 |
| `R-WORK-002` | P0 risk | `core-contracts` baseline 需要在实现交接和 PH-01 固定 | PH-01 | 记录 core path 和 commit;Cargo 只写本地 path dependency | `commit-01-a` 提交前 |
| `R-WORK-003` | P0 risk | design repo 当前仍是未提交工作树,实现交接前必须固定 design commit | PH-01 / handoff | Step 13 完成正式 `07` 后提交 design baseline,给实现 agent 固定 hash | 进入真实实现前 |
| `R-WORK-004` | P0 risk | 实现中可能发现字段、DTO、状态、config 或 flow 真相源缺口 | 全阶段 | 当前 boundary 暂停,回写 `03/04/05/06/07`,不得自行补第二真相 | 每个 commit boundary 开工复核时 |
| `R-WORK-005` | P0 risk | 非 core sibling repo 被误写为 Cargo dependency | PH-01 起 | dependency check;只允许 `core-contracts` path dependency | 每次 `Cargo.toml` 变更前 |
| `R-WORK-006` | P0 risk | fake adapter 被误认为 configured / production success | PH-03 / PH-08 / PH-09 | fake marker、configured ref validation、fake-as-production reject gate | 首个 configured seam 前 |
| `R-WORK-007` | P0 risk | raw secret、raw payload、source body 或外部正文进入 truth、event、log、artifact 或 report | PH-04 / PH-08 / PH-09 | redaction scan、forbidden body guard、fixture dump scan | PH-04 起每个相关 boundary |
| `R-WORK-008` | P0 risk | query、projection、reconciliation 或 report 反写真相 | PH-07 / PH-08 | no-write digest assertion、repository write counter、state before / after report | `commit-07-b` 起 |
| `R-WORK-009` | P0 risk | duplicate、dedup、version conflict 或 commit unknown 产生重复 truth | PH-02 / PH-04 / PH-06 / PH-08 | idempotency / dedup tests、single-winner selected、commit unknown guard | 对应 service / consumer boundary |
| `R-WORK-010` | P0 risk | evidence index、gate results、redaction report、veto checklist 或 fixed path 缺失 | PH-09 | release-evidence-pack gate、path check、review checklist | `commit-09-a` 提交前 |
| `R-WORK-011` | P0 risk | P0 performance 被误用旧 `100ms / 300ms` 候选数字硬裁决 | PH-09 | 只做样本观察报告;硬阈值以正式 config / NFR 门禁为准 | PH-09 release summary 前 |
| `R-WORK-012` | P1/P2 risk | durable store、real broker、real search、real trace / archive adapter 未定义 | PH-08 / operations | P0 使用 in-memory / fake / selected seam;生产化前补专项设计和运维 | P1/P2 专项启动前 |
| `R-WORK-013` | P1/P2 risk | secret provider / KMS / Vault 未定义 | PH-08 / operations | P0 只允许 ref-only sensitive;真实 provider 进入安全运维专项 | P1/P2 secret 专项启动前 |
| `R-WORK-014` | P1/P2 risk | config center、admin override、hot reload 和 last-known-good 未定义 | PH-01 / operations | P0 启用即 unsupported / fail-fast;不得作为 P0 能力声明 | P1/P2 config 专项启动前 |
| `R-WORK-015` | P1/P2 risk | report / artifact 保留周期、访问控制和长期归档未定义 | PH-09 / operations | P0 只固定路径和 evidence index;保留策略移交后续运维 | `09-部署与运维手册` 前 |
| `R-WORK-016` | P1/P2 risk | advanced search backend 和高级看板产品能力未定义 | PH-07 | P0 `advanced_search_enabled=false`;缺 backend 时 fail-fast | 后续查询增强专项前 |
| `R-WORK-017` | P0 risk | 实现 agent 未读取编码规范、提交规范、目录规范和永久记忆种子 | 全阶段 | Step 3 阅读门禁和永久记忆种子;提交前检查 | 每个 boundary 开工前 |

### 7.4 待确认事项表

| 编号 | 类型 | 待确认事项 | 影响阶段 | 未确认前处理方式 | 截止点 |
|---|---|---|---|---|---|
| `O-WORK-001` | open item | Step 13 完成后正式 `07-实施计划.md` 的 design commit hash | 实现交接 | 不进入真实实现交接;继续 Step 10~13 文档流程 | 真实实现前 |
| `O-WORK-002` | open item | `core-contracts` 最终 baseline commit | PH-01 | 先按本地 path dependency 规划;提交实现前记录 hash | `commit-01-a` 提交前 |
| `O-WORK-003` | open item | 目标实现仓创建时是否已有远端 / 保护分支策略 | PH-01 | 本地初始化不阻塞;远端策略进入 Step 11 / handoff | PH-01 提交前 |
| `O-WORK-004` | open item | report / artifact retention、清理和访问控制 | PH-09 / operations | P0 只固定 run path;长期策略交给后续运维 | `09-部署与运维手册` 前 |
| `O-WORK-005` | open item | production-like durable store / broker / endpoint 产品选择 | P1/P2 | P0 不实现真实产品 adapter | P1/P2 专项启动前 |
| `O-WORK-006` | open item | secret provider / KMS / Vault 产品选择和权限模型 | P1/P2 | P0 只实现 ref-only sensitive 和 raw material reject | P1/P2 security 专项启动前 |
| `O-WORK-007` | open item | config center / admin override / hot reload 是否进入未来范围 | P1/P2 | P0 视为 unsupported | P1/P2 config 专项启动前 |
| `O-WORK-008` | open item | clock / id generator 是否需要显式 runtime config | PH-01 / PH-02 | 当前由 runtime builder 装配;需要字段时先回写 `03/04` | 需要新增字段前 |
| `O-WORK-009` | open item | report / artifact root 是否需要显式 runtime config | PH-01 / PH-09 | 当前由 gate / report args 承接;需要 runtime 字段时先回写 `03/04` | 需要新增字段前 |
| `O-WORK-010` | open item | advanced search backend 是否进入后续实现 | PH-07 / P1 | P0 默认 disabled,缺 backend fail-fast | 后续增强专项前 |

### 7.5 当前 Blocker 判定

| Blocker | 当前是否存在 | 说明 | 处理 |
|---|---|---|---|
| 阻塞继续 Step 10 的文档 blocker | 否 | `00~06` 已足以继续编制 `07` | 可进入 Step 10 |
| 阻塞真实实现交接的 blocker | 是,预期性 | 正式 `07-实施计划.md` 尚未在 Step 13 生成,design commit 尚未固定 | Step 13 后提交设计基线再交接 |
| 阻塞 PH-01 的环境 blocker | 当前未发现 | `core-contracts` 本地路径存在;目标实现仓不存在但由 PH-01 创建 | PH-01 开工前复查 |
| 阻塞各 commit boundary 的设计缺口 | 当前未知 | 需在每个 boundary 开工前按 Step 6 复核 | 发现即暂停并回写设计 |

### 7.6 上游回写触发矩阵

| 触发 | 回写目标 | 不允许的临时处理 |
|---|---|---|
| DTO / ref / state / result / receipt 只有名字没有字段级 schema | `03-详细设计.md` 和对应 `03_ddd_*` | 在实现仓造 placeholder |
| flow 使用的字段与 protocol schema 不一致 | `03-详细设计.md` Step 8 / Step 9 对应章节 | 选一边直接落码 |
| 状态矩阵、domain method 和测试断言不一致 | `03-详细设计.md` Step 6 / Step 10 和 `05/06` | 改测试绕过状态 |
| 新增 `WorkRuntimeConfig` 字段或改变默认 / 来源 / 校验 | `03-详细设计.md` §13 和 `04-配置设计.md` | 在 config loader 里私自加字段 |
| P0 需要真实外部产品依赖 | `00/01/03/04/05/06/07` 视影响范围重校准 | 把产品 adapter 写进 P0 |
| 验收项、VETO 或 evidence gate 需要改变 | `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | 在 release report 中自行降级 |
| report / artifact path 需要 runtime 化 | `03/04/05/07` | 让脚本和 runtime 各用一套路径 |

### 7.7 阶段风险门禁矩阵

| 阶段 | 主要风险 | 阶段前必须确认 | 失败时处理 |
|---|---|---|---|
| PH-01 | 目标仓、core dependency、profile / path skeleton | `R-WORK-001/002/005`;`SP-WORK-001/002` | 暂停或创建目标仓;core 缺失不绕过 |
| PH-02 | UoW、idempotency、duplicate truth | `R-WORK-004/009`;CORE design closure | 设计缺口回写;duplicate 失败阻断 |
| PH-03 | identity fake / configured ref 边界 | `R-WORK-006`;`SP-WORK-006` | missing ref fail-fast;不得 fake success |
| PH-04 | external body、promote review、version conflict | `R-WORK-007/009`;`SP-WORK-003` | redaction / multi-winner 失败阻断 |
| PH-05 | evidence body、cycle / terminal guard | `R-WORK-004/007` | evidence 缺失 reject;body 命中阻断 |
| PH-06 | process boundary、single-winner | `R-WORK-009` | process truth write 或 conflict 失败阻断 |
| PH-07 | authorized query、projection no-write、advanced search disabled | `R-WORK-008/016`;`SP-WORK-004` | no-write / unauthorized leak 阻断 |
| PH-08 | consumer dedup、outbox retry、handoff、replay | `R-WORK-006/007/009/012/013`;`SP-WORK-005` | silent success、truth repair、raw body 阻断 |
| PH-09 | evidence pack、VETO、release redline、risk acceptance | `R-WORK-010/011/015`;`SP-WORK-007` | VETO / missing EV / redaction failed 不得接受 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §9。

````markdown
## 9. Spike、风险与待确认事项

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“待确认事项表”“当前 Blocker 判定”“上游回写触发矩阵”和“阶段风险门禁矩阵”小节,了解本轮哪些事项必须在 phase / commit boundary 前关闭,哪些只作为 P1/P2 风险移交。

当前没有阻塞继续编制实施计划的文档 blocker。真实实现交接前必须完成正式 `07-实施计划.md`、固定 design commit,并在 PH-01 固定 `core-contracts` baseline。

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| `SP-WORK-001` | spike | 验证 `core-contracts` 本地 path dependency 与 workspace skeleton 可编译 | PH-01 | 输出 dependency compile artifact 和 core commit 记录 | `commit-01-a` 前 |
| `SP-WORK-002` | spike | 验证 artifact / report / acceptance path dry-run 和 no `latest` check | PH-01 / PH-09 | 输出 path check artifact 和 minimal report draft | `commit-01-b` 前 |
| `SP-WORK-003` | spike | 验证 redaction scanner 覆盖 config、log、artifact、report 和 dump | PH-04 / PH-08 / PH-09 | 输出 scan report 和 failure example | `commit-04-a` 前 |
| `SP-WORK-004` | spike | 验证 query / projection / report no-write state digest 断言 | PH-07 / PH-08 | 输出 no-write helper 和 digest artifact | `commit-07-b` 前 |
| `SP-WORK-005` | spike | 验证 operations-replay sanitized bundle 与 baseline digest | PH-08 / PH-09 | 输出 replay bundle shape 和 mismatch report | `commit-08-d` 前 |
| `SP-WORK-006` | spike | 验证 configured adapter 与 fake adapter 的 marker 和 missing-ref failure | PH-03 / PH-08 / PH-09 | 输出 fake marker check 和 configured failure artifact | `commit-03-b` 前 |
| `SP-WORK-007` | spike | 验证 release evidence pack dry-run | PH-09 | 输出 evidence index、gate results、redaction report 和 veto checklist 初稿 | `commit-09-a` 前 |

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| `R-WORK-001` | P0 risk | 目标实现仓当前未创建 | PH-01 | PH-01 创建并初始化 | `commit-01-a` 前 |
| `R-WORK-002` | P0 risk | `core-contracts` baseline 需要固定 | PH-01 | 记录 path 和 commit,只使用本地 path dependency | `commit-01-a` 前 |
| `R-WORK-003` | P0 risk | design commit 需要固定后才能交接实现 | PH-01 / handoff | Step 13 后提交 design baseline | 真实实现前 |
| `R-WORK-004` | P0 risk | 发现字段 / DTO / 状态 / config / flow 缺口 | 全阶段 | 暂停并回写上游设计 | 每个 boundary 开工前 |
| `R-WORK-005` | P0 risk | 非 core sibling repo 误入 Cargo dependency | PH-01 起 | dependency check | 每次 Cargo 变更前 |
| `R-WORK-006` | P0 risk | fake adapter 伪装 configured / production success | PH-03 / PH-08 / PH-09 | fake marker 和 configured ref validation | 首个 configured seam 前 |
| `R-WORK-007` | P0 risk | forbidden output 或外部正文进入 truth / event / artifact / report | PH-04 / PH-08 / PH-09 | redaction scan 和 body guard | 相关 boundary |
| `R-WORK-008` | P0 risk | query / projection / report 反写真相 | PH-07 / PH-08 | no-write digest assertion | `commit-07-b` 起 |
| `R-WORK-009` | P0 risk | duplicate / dedup / version conflict 产生重复 truth | PH-02 / PH-04 / PH-06 / PH-08 | idempotency、dedup、single-winner tests | 对应 boundary |
| `R-WORK-010` | P0 risk | evidence pack 或 fixed path 不完整 | PH-09 | release-evidence-pack gate | `commit-09-a` 前 |
| `R-WORK-011` | P0 risk | 旧性能数字被误作 P0 硬阈值 | PH-09 | 只做观察报告,不作硬裁决 | release summary 前 |
| `R-WORK-012`~`R-WORK-016` | P1/P2 risk | production adapter、secret provider、config center、retention、advanced search 等未定义 | P1/P2 | 移交后续专项,不得进入 P0 | 专项启动前 |

任一 `VETO-WORK-*` failed、S 级缺陷、影响 P0 gate / release gate / P0 evidence 的 A 级缺陷、redaction failed、重复 truth、`latest` 证据路径、configured adapter fake fallback success 或 P0 evidence 缺失,不得进入风险接受。
````

## 9. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续必须继续收口:

- Step 10 把本步 blocker / risk / unavailable 规则转成暂停、回退、变更控制和恢复流程。
- Step 11 把 design commit 固定、实现仓 commit 规范、当前 boundary 暂存纪律和 dependency check 写入提交评审规则。
- Step 12 把 Spike 关闭、P0 risk 关闭、P1/P2 risk 移交、VETO 通过和 evidence pack 完整写入完成判定。
- Step 13 装配正式 `07-实施计划.md` 后,才能固定 design commit 并交给实现 agent。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 风险、Spike 和待确认事项均已分类 | 已满足 |
| 会阻塞实施的事项已明确为 blocker 或 blocker 触发器 | 已满足 |
| 每个 Spike 都有明确输出和截止点 | 已满足 |
| 每个风险都绑定阶段、处理方式和截止点 | 已满足 |
| 需要回写上游设计的触发条件已列出 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

用户审核确认后,可以进入 Step 10: 定义回退、暂停与变更控制。
