# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填章节: `07-实施计划.md` §9 Spike、风险与待确认事项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义 Spike、风险与待确认事项 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 8 配置环境准备、正式 `03/04/05/06` 风险与 residual、Step 5~7 phase / boundary / gate |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_09_spikes_risks.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块先思考、再写入、再局部停审;全部模块完成后做 blocker / spike / risk / residual / open question 截止点审计 |

## 2. 本步目标

本 Step 将 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 与 Step 8 外部依赖准备中已暴露的不确定性,收敛为实施计划可执行的风险分类、Spike、暂停条件、延期项、残余风险和待确认事项。

本 Step 只回答:

- 哪些事项是 blocker,在对应 phase / commit boundary 前必须闭口。
- 哪些事项需要单独 Spike,Spike 输出是什么,截止点是什么。
- 哪些事项是实施风险,如何处理,何时复核。
- 哪些事项是 deferred 或 residual,为什么不阻断 P0,由谁后续接收。
- 哪些待确认事项会影响提交边界、测试门禁或验收门禁,不能长期悬空。
- 哪些风险需要回写上游 `03/04/05/06/07`,不得由实现侧自行补口。

本 Step 不新增需求、对象、DTO、状态、port、配置项、测试用例、证据 schema、验收项或实现任务。本 Step 也不裁决真实环境是否已经存在,只定义实施时的检查、暂停和闭口规则。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 9 | 当前标准 | 提供 Spike / risk / open question 的问题和表格格式 |
| `实施计划书写规范.md` §5.9 | 当前标准 | 提供风险必须绑定阶段、Spike 必须有输出、待确认事项必须有截止点的要求 |
| `07_implementation_plan_step_08_config_environment.md` | 已完成 | 提供 profile、adapter、external dependency、artifact/report root 的准备和不可用处理 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | 提供 PH-01~PH-08 阶段顺序和 phase 截止点 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 commit-01-a 到 commit-08-c 的 boundary 截止点 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | 提供 GATE-01~12、TC/EV/AC/VETO 和失败处理 |
| `03_ddd_step_18_risks_open_questions.md` | 已完成 | 提供详细设计正式移交、下游复核、目标实现仓、真实产品和旧口径风险 |
| `04_config_step_14_risks_open_questions.md` | 已审核通过 | 提供配置下游承接、runtime config 类型、产品化配置和 future 触发器 |
| `05_test_plan_step_14_regression_risks.md` | 已审核通过 | 提供回归触发、不可风险接受项和 residual |
| `06_acceptance_step_13_risk_acceptance.md` | 已审核通过 | 提供可风险接受 / 不可风险接受、risk acceptance 字段和有条件通过条件 |
| `03-详细设计.md` | Step 19 final self-check 已完成 | 提供正式 implementation contract 风险归属 |
| `04-配置设计.md` | Draft / Step 15 已审核通过 | 提供 P0 配置边界和 future 产品化风险 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 P0 suite、residual 和 evidence 风险 |
| `06-验收标准.md` | 已审核通过 | 提供 VETO、风险接受和最终验收风险边界 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 9 规则与分类口径 | 固定 blocker / spike / risk / deferred / residual / open question 的边界 | SOP Step 9、书写规范 §5.9、Step 8 | 分类规则和禁止事项 | 不把 unresolved blocker 写成 risk/residual |
| M2 上游风险归并 | 从 `03/04/05/06` 抽取仍影响实施的风险 | `03` Step 18、`04` Step 14、`05` Step 14、`06` Step 13 | 风险来源归并表 | 不重复挂起已由 Step 1~8 闭合事项 |
| M3 Blocker 表 | 标出开工或边界前必须闭合的阻断项 | M2、Step 6 boundary、Step 7 gates | blocker 表和闭口方式 | 每个 blocker 必须有影响阶段和截止点 |
| M4 Spike 表 | 标出需要单独探索且有明确输出的事项 | Step 6/8 待确认、风险来源 | Spike 表 | Spike 不得无限探索或混入功能提交 |
| M5 Risk 表 | 标出可推进但需门禁控制的实施风险 | Step 8、`05/06` residual、boundary gates | risk 表 | 风险必须绑定 phase 和处理方式 |
| M6 Deferred / residual 表 | 标出 P1/P2 或非 P0 的延期和残余风险 | `04/05/06` residual | deferred/residual 表 | 不得用 residual 支撑 P0 pass |
| M7 待确认事项表 | 列出影响 boundary / gate / acceptance 的未决事项 | M2~M6 | open question 表 | 每项必须有确认方和截止点 |
| M8 跨风险停审 | 审计分类、截止点、回写规则和进入 Step 10 条件 | M1~M7 | 跨表审计、回填草稿 | 无长期悬空的“后续确认” |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | 分类要服务实施节奏: blocker 阻断开工,Spike 前置探索,risk 带门禁推进,residual 不阻断 P0 | §8.1 | 通过 |
| M2 | `03` 中旧的“正式 03/04/05/06/07 未装配”风险已有后续文档闭口,在当前 Step 9 要降为已处理或实现前二次校验 | §8.2 | 通过 |
| M3 | 真正 blocker 只保留会让当前 phase / boundary 无法 1:1 落码或无证据闭环的事项 | §8.3 | 通过 |
| M4 | Spike 主要围绕实现仓迁移、core path baseline、script/report writer materialization,都必须有明确输出 | §8.4 | 通过 |
| M5 | 风险必须绑定 PH-xx 和 Gate,不能泛写“注意配置 / 依赖 / 证据” | §8.5 | 通过 |
| M6 | P1/P2 endpoint、真实产品、capacity 和 hard SLO 不阻断 P0,但不能伪装成已验证 | §8.6 | 通过 |
| M7 | 待确认事项必须有 owner、截止点和未确认前处理方式 | §8.7 | 通过 |
| M8 | 回写规则必须明确: design 缺口回 `03/04/05/06`,boundary 调整回 `07`,经验沉淀回标准 | §8.8~§8.12 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些技术点需要先做 Spike? | 目标实现仓旧单 crate 到 7-crate workspace 的迁移复杂度、`quantalithos-core` path dependency / shared package baseline、artifact/report writer 是否能严格物化 `05` Step 13 字段、lower-suite run-scoped artifact/report materialization 能力,需要作为 Spike 或开工前探针。 |
| 哪些风险会阻塞某个阶段? | `core` 编译期依赖缺失阻塞 PH-01;正式 port / schema / state / evidence 字段缺口阻塞对应 boundary;config / artifact / report schema 不闭合阻塞 commit-08-a/b;P0 suite raw artifact 或 run report 不能物化阻塞 commit-08-b/c 和最终送验。 |
| 哪些待确认事项会影响提交边界或验收门禁? | workspace 迁移是否超出 commit-01-a、PH-04-b / PH-06-b / PH-07-b/c 是否需要实现期再拆 commit、machine artifact writer 是否已有足够字段、risk acceptance 真实接受人、P1/P2 selected-run 是否某 release 强制,都会影响 boundary 或验收门禁。 |
| 每个 Spike 的输出是什么? | Spike 输出必须是书面结论、patch strategy、dependency report、prototype report writer dry-run、或 design blocker note。不得以“继续观察”作为输出。 |
| 每个风险的处理方式和截止点是什么? | 见 §8.5。每项风险绑定 PH/commit/gate,并给出暂停、回写、使用正式 fake/controlled seam、记录 residual 或复跑门禁的处理方式。 |
| 哪些风险需要回写上游设计? | 任何需要新增 schema、port、state、error、DTO、config key、artifact JSON 字段、evidence ID、AC/VETO、phase / commit boundary 或正式 adapter outcome 的风险,必须回写 `03/04/05/06/07` 对应真相源。实现侧不得私补。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `03` Step 18 | 曾把正式 `04/05/06/07` 未复核列为风险 | 当前 `04/05/06` 已重写/审核到可被 `07` 引用;剩余转为实现前二次校验和 Step 13 装配前一致性检查 |
| `04` Step 14 | future config center、hot reload、secret provider、production refs 可能影响实现 | 分类为 deferred / design-change-required,不阻断 P0 |
| `05` Step 14 | P1 real-like、真实产品、capacity、hard SLO 是 residual | 纳入 residual 表,不得作为 P0 pass evidence |
| `06` Step 13 | 风险接受需要真实接受人和截止时间 | Step 9 只定义待确认;最终签署留 PH-08-c / 验收阶段 |
| Step 6 | 若实现期 boundary 仍过大,需重审 | 列为 implementation granularity risk,由 Step 10/11 控制 |
| Step 8 | external dependency 和 artifact/report roots 已定义,但真实机器状态未知 | 列为开工前检查和 Spike,不在设计仓裁决现实状态 |

## 7. 改动前后对比

| 议题 | Step 9 前 | Step 9 后 | 作用 |
|---|---|---|---|
| 风险来源 | 分散在 `03/04/05/06` | 归并为 blocker / spike / risk / deferred / residual / open question | 实现者知道何时暂停、何时继续 |
| Spike | 未集中列出 | 每项有输出和截止点 | 防止无限探索或混入功能提交 |
| Blocker | 隐含在各 Step 停审规则 | 绑定 PH / commit / gate | 防止实现侧补口 |
| Residual | 分散在测试和验收 | 明确不阻断 P0,但不得证明 P0 pass | 防止 P1/P2 污染 P0 |
| 待确认事项 | 只有局部表 | 统一确认方、截止点和未确认前处理 | 防止长期悬空 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把所有上游风险原样复制 | A. 全量复制;B. 只保留对实施计划仍有效的风险 | 采用 B。`04/05/06` 已形成新版输入,不再把它们未复核当当前 blocker。 |
| 是否把实现仓现实状态写成已确认 | A. 写已存在 / 不存在;B. 写检查与处理规则 | 采用 B。本设计仓不裁决当前机器状态。 |
| boundary 过大是否提前拆成更多 commit | A. 现在改 boundary;B. 作为 Step 10/11 的重审规则 | 采用 B。当前 Step 6 粒度已停审通过,实现中超过阈值再按变更控制重审。 |
| product endpoint 不可用是否阻断 P0 | A. 阻断;B. residual / selected-run unavailable | 采用 B。P0 以 fake / controlled / replay 证明语义。 |
| machine artifact writer 缺口是否由实现补 | A. 实现补字段;B. blocker 回 `05/06/07` | 采用 B。证据 schema 不能由实现侧私补。 |

## 9. 结构化中间产物

### 9.1 分类规则

| 类型 | 判定 | 处理 |
|---|---|---|
| blocker | 当前 phase / boundary 无法 1:1 落码、无法产正式证据、或违反 `03/04/05/06/07` 真相源 | 暂停对应 boundary,回写正式设计或调整 boundary |
| spike | 可以在功能实现前独立探索,且不会改正式契约;输出是结论或最小技术验证 | 单独执行,不得混入功能 commit |
| risk | 可按已定义边界继续推进,但需要门禁、复核或失败处理 | 绑定 phase / gate,按处理方式复核 |
| deferred | P1/P2 或 future 能力,不属于当前 P0 | 不阻断 P0,进入后续 baseline |
| residual | P0 可交付但仍需验收阶段接受或记录的遗留风险 | 不得证明 P0 pass,需 risk acceptance |
| open question | 影响 boundary、gate、acceptance 或后续 design change 的待确认事项 | 指定 owner、截止点和未确认前处理方式 |

### 9.2 风险来源归并表

| 来源 | 原风险 / 待确认 | 当前归并 | 处理 |
|---|---|---|---|
| `03` Step 18 | 正式 `03` 未装配 | 已处理为正式 `03` 当前基线输入 | Step 13 装配正式 `07` 前再做全文一致性检查 |
| `03` Step 18 | `04/05/06/07` 未复核 | 当前 `04/05/06` 已作为新版输入;`07` 正在重建 | 不再作为当前 blocker,转为 Step 13 assembly consistency check |
| `03` Step 18 | 目标实现仓 / core baseline 需二次校验 | Spike / risk | SP-ID-001/002,R-ID-001/002 |
| `03` Step 18 | 真实产品绑定未定 | deferred / residual | D-ID-001,RSD-ID-001 |
| `04` Step 14 | runtime config type / loader API 可能需要正式契约 | blocker if triggered | B-ID-003;未触发则不阻断 |
| `04` Step 14 | config center / hot reload / secret provider | deferred | D-ID-002 |
| `05` Step 14 | artifact/report writer 与 evidence materialization | Spike / blocker if missing | SP-ID-003,B-ID-004 |
| `05` Step 14 | P1 selected-run、capacity、hard SLO | residual / deferred | RSD-ID-002~004 |
| `06` Step 13 | risk acceptance 需要接受人和截止时间 | open question / PH-08-c risk | OQ-ID-005,R-ID-009 |
| Step 6 | boundary 过大或实现期需重拆 | risk | R-ID-006 |
| Step 8 | `latest` / static evidence / fake fallback 风险 | risk / blocker if occurs | R-ID-007,B-ID-005 |

### 9.3 Blocker 表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| B-ID-001 | blocker | `quantalithos-core` shared contracts 本地 path 或 package baseline 缺失,导致唯一编译期依赖无法建立 | PH-01 / commit-01-a | 暂停 workspace/dependency boundary;回 `03/07` 或 core baseline,不得复制上游 type | commit-01-a 开工前 |
| B-ID-002 | blocker | 目标实现仓无法建立设计要求的 7-crate workspace skeleton | PH-01 / commit-01-a | 暂停实现;记录迁移 blocker,回 Step 10 boundary 重审或实现仓准备 | commit-01-a 完成前 |
| B-ID-003 | blocker | 实现期发现需要 `03/04` 未定义的 runtime config type、loader API、adapter constructor、config error 或 port | PH-03 / PH-08-a | 暂停对应 boundary,先回写 `03/04` 并固定新 baseline | 触发 boundary 提交前 |
| B-ID-004 | blocker | `05` raw artifact / report / evidence index 字段、digest 或 writer owner 不足以 1:1 实现 PH-08-b | PH-08 / commit-08-b | 暂停 report writer;回写 `05/06/07`,不得私造 JSON schema | commit-08-b 开工前或实现触发时 |
| B-ID-005 | blocker | 任一 P0 gate 只能通过静态 pass、缺 raw artifact、缺 run report 或使用 `latest` 才能通过 | PH-08 / commit-08-b~c | 暂停 release/evidence closure;修 gate/report/check 设计或实现 | commit-08-b/c 提交前 |
| B-ID-006 | blocker | 任一 boundary 经验复核发现 `03/04/05/06` 缺 formal schema / port / state / evidence 来源 | all PH | 暂停该 boundary;回写设计真相源;更新经验标准如有新教训 | 对应 boundary 开工前 |
| B-ID-007 | blocker | P0 红线命中:VETO、redaction leak、dependency boundary fail、query write、job truth repair、stored replay rerun、config silent fallback | all PH | 不允许风险接受;修复并复跑对应 gate | 对应 gate 失败时 |

### 9.4 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 / 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-ID-001 | spike | 目标实现仓旧单 crate 到 7-crate workspace 的迁移规模探针 | PH-01 | 输出 workspace migration note:现有文件移动策略、需保留用户改动、是否超过 commit-01-a 范围 | commit-01-a 开工前 |
| SP-ID-002 | spike | `quantalithos-core` local path dependency / package / crate name baseline 验证 | PH-01 | 输出 dependency probe report,确认 root `[workspace.dependencies]` 可引用方式 | commit-01-a 开工前 |
| SP-ID-003 | spike | run-scoped artifact/report writer dry-run 可否按 `05` Step 13 字段和 digest 物化 | PH-08 / commit-08-b | 输出 writer dry-run note 或 design blocker note;不得生成正式 pass evidence | commit-08-b 开工前 |
| SP-ID-004 | spike | lower-suite artifact/report materialization 能否覆盖 `contract-domain-fast`、`service-flow-fast`、`operations-replay-core` 等 selected-report-required 场景 | PH-08 / commit-08-b~c | 输出 lower-suite materialization plan and gap list | commit-08-b 完成前 |
| SP-ID-005 | spike | PH-04-b、PH-06-b、PH-07-b/c 实现期是否需要拆更小 commit | PH-04~PH-07 | 输出 boundary granularity note;若超过阈值,按 Step 10 重审 | 对应 boundary 开工前 |

### 9.5 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-ID-001 | risk | 实现仓存在用户未提交改动或旧实现结构,迁移时可能误覆盖 | PH-01+ | 开工前 `git status`;只编辑任务相关文件;不得回滚用户改动 | 每个 boundary 开工前 |
| R-ID-002 | risk | `core` shared contracts baseline 变化导致 dependency boundary 或 type names 漂移 | PH-01~PH-03 | dependency probe + GATE-01;变化时暂停回上游 / design | commit-01-a/03-b |
| R-ID-003 | risk | fake / controlled adapter 为了通过测试默认成功或使用 private map | PH-03~PH-07 | GATE-03/06/07/08 和经验复核;发现即 blocker | 对应 fake / adapter boundary |
| R-ID-004 | risk | config profile、adapter mode、entry-local/job-run-start 被实现混用 | PH-03 / PH-08-a | GATE-09;严格引用 `04`;invalid fail-fast | commit-08-a |
| R-ID-005 | risk | query/job/no-write/no-repair 只能靠 review,缺 write-audit 或 replay evidence | PH-05 / PH-07 | Step 7 GATE-05/08;缺 evidence 则暂停 | commit-05-a~c,commit-07-b |
| R-ID-006 | risk | 高风险 boundary 实现规模超过 review 阈值 | PH-04~PH-07 | 单 BATCH 超 300 行提示拆;超 500 行必须拆;Step 10 boundary 重审 | 对应 boundary 提交前 |
| R-ID-007 | risk | report generator 早于 final evidence 时被误用为验收 pass | PH-08-b~c | 区分 minimal shell、final EV detail、acceptance handoff;GATE-11/12 | commit-08-b/c |
| R-ID-008 | risk | P1/P2 endpoint、selected-run 或 production-like 被误写成 P0 must-pass | PH-08-c | Step 8 residual 口径;release evidence 不引用 P1 as P0 pass | commit-08-c |
| R-ID-009 | risk | risk acceptance 缺真实接受人、责任人或截止点 | PH-08-c / acceptance | `reports/acceptance/risk-acceptance.md` 生成后必须审查补充;缺失不得有条件通过 | final handoff 前 |
| R-ID-010 | risk | 旧 identity 名、旧对象、旧状态或旧配置回流正式 `07` | Step 13 | 旧名扫描;发现回流暂停装配 | Step 13 assembly 前 |

### 9.6 Deferred / Residual 表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| D-ID-001 | deferred | durable DB、bus、archive、metric、secret provider、external product 真实产品选型 | P1/P2 | P0 使用 fake / controlled / disabled / product-neutral refs | 产品选型 baseline |
| D-ID-002 | deferred | config center、admin override、hot reload、online last-known-good、secret rotation provider health | P1/P2 / future | 当前 unsupported;进入范围前回写 `03/04` | future scope decision |
| D-ID-003 | deferred | advanced dashboard、employee homepage、analytics 和复杂组织能力 | P2 | 不进入 P0 release evidence | P2 product milestone |
| RSD-ID-001 | residual | P1 real-like selected-run unavailable | PH-08-c / acceptance | unavailable marker + risk acceptance;不得证明 P0 pass | selected-run baseline |
| RSD-ID-002 | residual | production-like capacity 和 hard SLO 未硬化 | PH-08-c / acceptance | sample/trend only;正式 threshold 后续定义 | performance baseline review |
| RSD-ID-003 | residual | external HR / IdP 深度集成未覆盖 | P2 | P0 不以外部身份定义 identity truth | P2 integration design |
| RSD-ID-004 | residual | full event-sourcing-first 未覆盖 | future architecture | 当前 accepted design 为 truth + trace + replay | architecture reopen trigger |

### 9.7 待确认事项表

| 编号 | 事项 | 影响 | 需要谁确认 | 未确认前处理 | 截止点 |
|---|---|---|---|---|---|
| OQ-ID-001 | 目标实现仓当前旧结构迁移是否超出 commit-01-a | PH-01 粒度和开工策略 | 实施计划维护者 / 实现 agent | 先做 SP-ID-001,不得直接大改 | commit-01-a 开工前 |
| OQ-ID-002 | `quantalithos-core` local package / crate 名是否与 `03` 假设一致 | dependency boundary | core owner / 实现 agent | 先做 SP-ID-002;不复制 shared type | commit-01-a 开工前 |
| OQ-ID-003 | PH-04-b、PH-06-b、PH-07-b/c 是否实现期需进一步拆 commit | review / rollback 粒度 | 实施计划维护者 / 实现 agent | 超阈值按 Step 10 boundary 重审 | 对应 boundary 开工前 |
| OQ-ID-004 | artifact/report writer 字段和 digest 是否足够落码 | PH-08-b evidence | 测试方案维护者 / 实施计划维护者 | 先做 SP-ID-003;缺口回写 `05/06/07` | commit-08-b 开工前 |
| OQ-ID-005 | `reports/acceptance/risk-acceptance.md` 中 residual 的真实接受人 | final acceptance | 验收负责人 / 产品 / 架构 / 测试 owner | 不得用角色待确认支撑有条件通过 | final handoff 前 |
| OQ-ID-006 | P1 selected-run 是否在某个 release 强制 | release scope | 验收负责人 / 产品负责人 | 当前非 P0;强制需回写 `05/06/07` | release scope 决策前 |
| OQ-ID-007 | 实现中出现新 blocker 时是否需要更新经验标准 | 后序任务 / 可落码性标准 | 设计维护者 / 实施计划维护者 | 若标准未覆盖,更新 `设计真相源闭环与可落码性标准.md` | blocker 修复后提交前 |

### 9.8 回写规则

| 触发 | 回写位置 | 处理 |
|---|---|---|
| schema / DTO / state / port / flow / persistence / idempotency 缺口 | `03-详细设计.md` 或对应 `03_ddd_step_*` | 暂停实现,先闭设计真相源 |
| config key / loader / adapter constructor / profile 语义缺口 | `04-配置设计.md` | 暂停相关 config/runtime boundary |
| suite / TC / fixture / raw artifact / report / evidence 字段缺口 | `05-测试方案.md` | 暂停 gate/report/evidence boundary |
| AC / VETO / risk acceptance / final conclusion 缺口 | `06-验收标准.md` | 暂停送验或 acceptance handoff |
| phase / commit boundary / gate mapping 不合适 | `07-实施计划.md` 中间产物与正式文档 | 通过 Step 10 变更控制重审 |
| 新型 1:1 blocker 可沉淀为通用经验 | `standards/document/设计真相源闭环与可落码性标准.md` | 修复后补经验,再继续后续任务 |

### 9.9 Boundary 风险前置矩阵

| Boundary | 主要风险 / Spike | 前置处理 |
|---|---|---|
| commit-01-a | SP-ID-001,SP-ID-002,B-ID-001,B-ID-002,R-ID-001/002 | 开工前 probe workspace/core;dependency boundary clean |
| commit-02-a~c | B-ID-006,R-ID-010 | 只按 `03` contracts/domain/state 落码,旧名扫描 |
| commit-03-a~c | B-ID-003,R-ID-003/004 | fake 只实现正式 port;config surface 不私补 |
| commit-04-a~c | R-ID-006,B-ID-006 | 高风险 command 分批;accepted flow 缺口暂停 |
| commit-05-a~c | R-ID-005,B-ID-006/B-ID-007 | query no-write evidence;visibility/lookup 缺口暂停 |
| commit-06-a~c | R-ID-003/006,B-ID-006 | consumer no-create,receipt replay,outbox material evidence |
| commit-07-a~c | R-ID-005/006,B-ID-006 | job report replay,no truth repair,adapter outcome closure |
| commit-08-a | B-ID-003,R-ID-004 | config-redline;runtime builder 不私补 schema |
| commit-08-b | SP-ID-003/004,B-ID-004/B-ID-005,R-ID-007 | artifact/report writer and report audit closure |
| commit-08-c | R-ID-008/009,RSD-ID-* | release evidence,acceptance handoff,risk acceptance review |

### 9.10 跨风险审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| blocker 是否均绑定 phase / deadline | 通过 | §9.3 每项有影响阶段和截止点 |
| Spike 是否有输出 | 通过 | §9.4 每项给出 report / note / gap list |
| risk 是否绑定阶段 | 通过 | §9.5 均绑定 PH / commit |
| residual 是否未污染 P0 | 通过 | §9.6 明确不得证明 P0 pass |
| open question 是否有截止点 | 通过 | §9.7 均有截止点 |
| 回写路径是否明确 | 通过 | §9.8 |
| 是否存在长期悬空“后续确认” | 未发现 | 所有待确认项都有截止点和未确认前处理 |

## 10. 对上游 / 下游文档的影响判定

| 影响项 | 是否需要回写上游 | 说明 | 下游处理 |
|---|---|---|---|
| 当前 Step 9 风险分类 | 否 | 仅归并已定义风险和实施处理方式 | Step 10 用于暂停 / 变更控制 |
| 实现仓迁移和 core baseline Spike | 否,除非 Spike 发现设计不一致 | 当前只是开工前探针 | Step 10/11 写入开工纪律 |
| artifact/report writer schema blocker | 条件是 | 若 SP-ID-003 发现缺字段,回写 `05/06/07` | PH-08-b 前闭口 |
| 新型 1:1 blocker 经验沉淀 | 条件是 | 若标准未覆盖,需更新可落码性标准 | Step 11 纳入交付纪律 |
| residual / P1/P2 | 否 | 不阻断 P0,但不得作为 P0 evidence | Step 12 / Step 13 装配保留 |

## 11. 回填草稿

> 回填目标: `07-实施计划.md` §9 Spike、风险与待确认事项
> 正式 `07` 在 Step 13 统一装配,本节仅作为草稿。

### 11.1 Spike / 风险总表

正式实施计划应保留以下分类:

- Blocker: `B-ID-001~007`,对应 core path、workspace、config/runtime surface、artifact/report schema、static evidence、boundary 经验复核和 P0 红线。
- Spike: `SP-ID-001~005`,对应 workspace migration、core dependency、artifact/report writer dry-run、lower-suite materialization 和高风险 boundary 粒度探针。
- Risk: `R-ID-001~010`,对应用户未提交改动、dependency drift、fake parity、config 混用、no-write evidence、boundary 过大、report generator 成熟度、P1/P2 污染、risk acceptance 缺接受人和旧口径回流。
- Deferred / residual: `D-ID-001~003`、`RSD-ID-001~004`,不阻断 P0,不得证明 P0 pass。
- Open question: `OQ-ID-001~007`,每项必须有 owner、截止点和未确认前处理。

### 11.2 实施处理原则

- Blocker 未闭口不得进入对应 boundary。
- Spike 必须在截止点前形成可审查输出,不得混入功能提交。
- Risk 可以推进,但必须绑定 gate、report 或 review 处理。
- Deferred / residual 不得写成 P0 已支持能力或 P0 验收证据。
- 待确认事项不得长期悬空;超过截止点仍未确认时转 blocker 或调整 scope。
- 任何实现中出现的 design 1:1 缺口,必须回写正式真相源;若标准未覆盖,完成修复后补充 `设计真相源闭环与可落码性标准.md`。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| SP-ID-001~005 是否在对应 boundary 开工前执行 | 影响 PH-01 / PH-08 开工质量 | Step 10/11 继续纳入开工纪律 |
| R-ID-006 boundary 粒度是否在实现时触发重审 | 影响 commit history 和 review | Step 10 定义变更控制 |
| OQ-ID-005 真实风险接受人 | 影响最终有条件通过 | PH-08-c / 验收阶段必须补齐 |
| OQ-ID-007 新 blocker 经验是否更新标准 | 影响后序任务完整性 | Step 11 写入交付纪律 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 已列出本 Step 必读文档 | 通过 |
| 已先写模块计划 / 模块目录 | 通过 |
| 已按模块记录思考、写入位置和停审结论 | 通过 |
| blocker、spike、risk、deferred、residual、open question 均已分类 | 通过 |
| 每项 Spike 有输出,每项风险绑定阶段,每项待确认事项有截止点 | 通过 |
| 需要回写上游设计的触发条件和路径已明确 | 通过 |
| 可以进入 Step 10 定义回退、暂停与变更控制 | 是 |
