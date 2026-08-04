# L4-observability 07-实施计划 Step 13：正式文档装配与实施资产预创建

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.13
> 文档性质：正式装配与实施资产审计的最终设计讨论中间产物。
> 重要边界：本 Step 只重建设计仓文档、实施台账和 planned boundary skeleton，不实现代码，不运行测试，不创建真实 commit/run/evidence/verdict/signoff。

## 1. Step 开工确认

| 项目 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 13 / 正式文档装配与实施资产预创建` |
| mode | `full-restart` |
| status | `completed_current` |
| current module | `formal-assembly-ledger-boundary-skeleton-audit` |
| upstream | current Step 01~12；正式 `00~06`；实施计划 SOP/书写规范；代码实施台账规范；L1-governance/L1-artifact 参考资产 |
| formal `07` before this Step | 旧 historical rough draft，不作为 current truth |
| implementation assets before this Step | 旧 ledger 和 16 个 boundary 文件，全部作为 historical_material |
| design gate | `pass_with_reality_preconditions` |
| new upstream blocker | `none` |
| inherited affected | 12 项保持 `open/controlled/conditional` 等当前状态，不由本 Step 关闭 |
| target reality | `/home/aris/Projects/quantalithos-observability` 不存在；CI/INT/RuntimeLike、runner、真实 run/artifact/report/evidence 不存在 |
| next allowed action | `stop_after_07_completion_wait_user` |
| current commit | 不需要；用户未要求提交 |

## 2. 本步输入与读取记录

| 输入 | 读取结果 | 装配用途 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | current | §1 上游关系、实现 readiness 和历史材料优先级 |
| `07_implementation_plan_step_02_scope.md` | current | §2 P0 范围、非范围和防膨胀规则 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | current | §3 阅读清单、阶段矩阵、永久记忆和前置检查 |
| `07_implementation_plan_step_04_objects_deliverables.md` | current | §4 交付面、crate/protocol/state/test/report/ledger 交付物 |
| `07_implementation_plan_step_05_phases_dependencies.md` | current | §5 八个 phase、依赖图、phase 停审 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | current | §6 16 boundary、代码批次、scope、经验复核、affected 绑定 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | current | §7 gate、suite、TC/DS、artifact/report、review 责任 |
| `07_implementation_plan_step_08_config_environment_dependencies.md` | current | §8 profile/lane/config/依赖/fake/不可用处置 |
| `07_implementation_plan_step_09_spikes_risks_open_questions.md` | current | §9 Spike、风险、affected、open question 和回写触发 |
| `07_implementation_plan_step_10_rollback_pause_change_control.md` | current | §10 pause、rollback、change、failure、recovery |
| `07_implementation_plan_step_11_commit_review_delivery.md` | current | §11 commit、review、handoff、语言和 provenance 纪律 |
| `07_implementation_plan_step_12_completion_criteria.md` | current | §12 四层完成模型、证据判定、未完成项处理 |
| `00~06` current formal | 已读取 | 作为正式实现基线；不得由 `07` 重定义 schema/state/acceptance |
| `实施计划讨论流程_SOP.md`、`实施计划书写规范.md` | 已读取 | 章节主链、来源入口、写入和评审门禁 |
| `代码实施台账与门禁规范.md` | 已读取 | implementation ledger schema、planned skeleton、状态和值域 |
| L1-governance/L1-artifact `07` 和装配/台账资产 | 已读取 | 参考章节密度、ledger 字段、boundary skeleton 粒度；不复制业务 truth |

## 3. SOP 问题回答

### 3.1 正式文档是否覆盖完整章节主链

是。正式文档必须且只能装配以下 13 章：

1. 与上游文档的关系声明
2. 实施目标与范围
3. 实施前置条件与阅读清单
4. 实施对象与交付物清单
5. 实施阶段与依赖顺序
6. 阶段任务拆分、编写顺序与提交边界
7. 测试与验收门禁嵌入
8. 配置、环境与外部依赖准备
9. Spike、风险与待确认事项
10. 回退、暂停与变更控制
11. 提交、评审与交付纪律
12. 实施完成判定
13. 参考

章节编号和主题不在装配时改名；过程性问题回答、历史诊断、取舍和模块停审只留在 calibration 文件。

### 3.2 正式章节如何追溯到 current 中间产物

每章正文开头使用具体 `design-calibration/07_implementation_plan_step_*.md` 路径作为校准来源，并说明延伸阅读小节。正式正文只摘录 current Step 的回填草稿和已确认结构化结论，不从旧正文、README 或聊天摘要补新结论。

### 3.3 正式正文保留什么粒度

正文保留能让实现 agent 直接执行和停下来的信息：P0 范围、8 phase、16 boundary、allowed/forbidden scope、required checks、gate failure、canonical paths、affected 处置、Commit/Handoff Gate 和完成判定。完整 60 protocol 卡、99 TC/82 DS 明细、对象字段和状态矩阵留在上游正式文档及对应 calibration，不在 07 重复定义。

### 3.4 是否存在不应装配的旧内容

存在。旧 `07` 中的旧编号、旧技术产品/存储假设、旧性能数字、旧 evidence/commit 状态、旧 ledger 和旧 boundary 状态均标为 `historical_material`。它们不进入 current 正文；如果 current Step 与旧材料冲突，以 current formal `00~06` 和 current Step 产物为准。

### 3.5 Step 13 是否同时创建实现资产

是。正式 07 装配完成后，必须同时重建：

- `projects/L4-observability/design-calibration/implementation_execution_ledger.md`
- `projects/L4-observability/design-calibration/implementation-boundaries/commit-01-a.md` 至 `commit-08-b.md`

只把 `commit-01-a` 标为项目级 current，且其 gate 仍为 `pending`/`blocked`，因为目标仓尚不存在；其余 15 个 boundary 必须为 `planned`、`next_allowed_action=wait_until_current`，不得标任何 gate 为 `pass`。

## 4. 当前材料问题诊断与历史处置

| 材料 | 诊断 | 当前处置 |
|---|---|---|
| 旧正式 `07-实施计划.md` | 章节不完整或编号/范围/门禁与 current 基线不一致 | 删除旧文件后按 13 章重建 |
| 旧 Step 13 | 把装配结论、历史假设和执行状态混为一体，且没有完整来源映射 | 删除旧文件后按本 Step 重建 |
| 旧 implementation ledger | 顶部恢复点和 current boundary 可能与 current flow 冲突 | 删除旧文件后按台账规范重建 |
| 旧 16 boundary 文件 | 可能出现旧 allowed scope、旧 gate/status、伪 current 或缺少 planned 语义 | 全部删除后按 Step 06/07/10/11/12 重新生成 |
| README | 混合使命、技术栈、性能和未来产品行为 | 只保留为 historical reference，不进入正文结论 |
| 上游 current `03/05/06` | 定义 exact schema、state、test、acceptance 和真实性边界 | 正式文档优先承接，不在 07 新定义 |

## 5. 改动前后对比

| 项 | 旧资产 | current 装配规则 | 结果 |
|---|---|---|---|
| 正式章节 | 约 285 行旧摘要 | 13 章，每章有具体校准来源和可执行收口结论 | 形成完整实施基线 |
| phase | 旧阶段摘要可能使用旧编号 | `PH-01~PH-08` 与 Step 05 一致 | 不改名、不跨 phase |
| boundary | 旧 16 文件可能是历史状态 | `commit-01-a`~`commit-08-b` 从 Step 06 重新映射 | 一 boundary 一台账骨架 |
| gate | 测试、验收和实现状态混写 | `GATE-OBS-01~12`、EVG、VF、Commit/Handoff 分层 | 不以 design pass 代实现 pass |
| evidence | 可能出现静态或旧 run 语义 | same-run raw/report/candidate/review 链 | 当前只写 planned/not_evaluated |
| affected | 可能被摘要吞掉 | 12 项逐 boundary 保留 exact ID、状态和禁止声明 | 不自行关闭 |
| implementation assets | 旧 ledger/边界看似可激活 | current Step 13 新建，唯一 current 为 `commit-01-a` | 防止实现 agent 误入未来 boundary |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 在旧 07 上增量修补 | 不采用 | 会保留旧编号、旧状态和旧 truth，无法证明 current 来源 |
| 只生成正式 07，implementation agent 自行补台账 | 不采用 | 违反 planned boundary 预创建规则，实施推进会失去统一恢复入口 |
| 正文复制全部 03/05/06 明细 | 不采用 | 造成第二真相源和维护漂移；07 只做实施转译 |
| 以 current Step 01~12 装配正文，并同步预创建资产 | 采用 | 来源可追溯、执行边界可落码、未来 boundary 有可恢复骨架 |
| 将目标仓缺失改写为待创建但 ready | 不采用 | 现实 blocker 必须保留，不能把设计完成写成实现准备完成 |

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 唯一 current 校准来源 | 需要保留的实施结论 |
|---|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` | 权威顺序、target reality、历史材料处置、不得私补设计 |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` | P0、五核心闭环、FR/BR/NFR/AC/VF、非范围和防膨胀 |
| §3 实施前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | 读取顺序、阶段矩阵、MEM-OBS 种子、目标仓/依赖/Git/目录检查 |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_objects_deliverables.md` | 七 role crate、协议/state、配置、测试、脚本、报告、台账交付面 |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | phase 图、8 个可验证增量、phase 停审和跨 phase 依赖 |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 编写顺序、批次规则、16 boundary、scope、经验复核和 affected |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_test_acceptance_gates.md` | 12 gate、9 suite、99/82、canonical roots、状态优先级、review 责任 |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 3 profile、6 lane、13-stage、only-core、fake/controlled/disabled 和失败处置 |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 10 Spike、12 风险、12 affected、8 OQ、回写触发 |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | pause、rollback、change、failure matrix、recovery 和失败材料保留 |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | 一 boundary 一 commit、英文实现仓 message、footer、review、handoff |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | 四层完成模型、16 boundary closure、证据路径、未完成项分类 |
| §13 参考 | 本 Step §7.1 及真实读取清单 | 只列真实引用，不堆未读材料 |

### 7.2 正式正文禁止新增项

装配时不得新增以下内容：

- 新 phase、boundary、gate、TC、DS、AC、VF、EVG 或状态名。
- 未在 current `03/04/05/06` 或 Step 01~12 出现的字段、DTO、port、repository、adapter、产品或性能阈值。
- 真实 implementation commit/hash、`run_id`、artifact digest、evidence alias、passed、verdict、signoff 或测试输出。
- 把 12 项 inherited affected 改成已实现、已接受或已关闭的正向结论。

### 7.3 正式章节装配矩阵

| 章节 | 最小正文结构 | 正文状态要求 | 装配自检 |
|---|---|---|---|
| §1 | 上游表、权威顺序、truth/no-write 边界 | current design baseline | 引用 `00~06` 和 Step 01 |
| §2 | P0/P1/P2 表、五闭环、非范围 | planned scope | 所有范围有编号 |
| §3 | 读取清单、阶段矩阵、台账入口、memory seed、前置 | readiness preconditions | target 缺失不写 ready |
| §4 | 交付面表、七 crate、协议/state/test/report/ledger | planned deliverables | 不把文件存在写成完成 |
| §5 | ASCII phase 图、总表、停审规则 | planned phases | 8/8、依赖无后置引用 |
| §6 | 编写顺序、批次、16 boundary 总表、复核规则 | planned boundaries | 16/16、scope/gate/affected 可回链 |
| §7 | gate catalog、suite/lane、phase/boundary matrix、provenance | planned gates | 99/82/9、same-run、no static pass |
| §8 | config/lane/dependency/fake/不可用矩阵 | readiness contract | 3/6/13/only-core 一致 |
| §9 | Spike/risk/OQ/affected 表 | open/controlled | 10/12/8 数量和状态一致 |
| §10 | pause/rollback/change/failure/recovery | control contract | failed material 保留 |
| §11 | commit/review/handoff/message/artifact | discipline contract | 不填真实 commit |
| §12 | 四层完成模型、判定表、证据、未完成 | execution-time criteria | 不填结果/签署 |
| §13 | 来源索引和真实参考 | traceability | 无未读参考 |

### 7.4 实施资产预创建计划

| 资产 | 生成条件 | 初始状态 | 禁止内容 |
|---|---|---|---|
| project implementation ledger | 正式 07 装配完成 | current boundary=`commit-01-a`; `gate_status=blocked`; `next_allowed_action=wait_design` | 不填真实 baseline hash、commit、run、测试结果 |
| `commit-01-a` ledger | 正式 07/Step 13 审计完成 | `status=planned` 或 `blocked`（target repo absent）；不得标 pass | 不写已创建 workspace 或已通过 cargo |
| `commit-01-b`~`commit-08-b` ledgers | 同上 | `status=planned`; `next_allowed_action=wait_until_current` | 不激活、不写 execution evidence |
| boundary gate matrix | 从 Step 06/07/10/11/12 摘录 | 每个 gate=`pending` 或 `not_applicable` with reason | 不静态填 pass |
| blocker register | 从 Step 03/08/09/12 摘录 | target reality 和 inherited affected open | 不把设计 blocker伪造 resolved |

### 7.5 最终装配跨文档审计清单

| 审计项 | 通过条件 | current 结论 |
|---|---|---|
| 章节完整性 | 13 个规定章节全部存在且无占位符 | pass_design_complete |
| 来源追溯 | 每章有具体 current calibration path | pass_design_complete |
| phase/boundary identity | 8 phase、16 boundary 与 Step 05/06 完全一致 | pass_design |
| gate identity | `GATE-OBS-01~12`、`EVG-OBS-001~009`、`VF-OBS-001~010` 不漂移 | pass_design |
| test identity | 99 TC、82 DS、9 suite、6 lane、3 profile、5 checks 不漂移 | pass_design |
| evidence truth | canonical roots、same-run、no latest/static pass | pass_design |
| affected truth | 12 项 exact ID/状态/禁止声明保留 | pass_design |
| target reality | target repo/runner/run/evidence 不被宣称存在 | pass_design |
| implementation assets | ledger + 16 skeleton 全部生成且只有一个 current | pass_design_complete |
| boundary evidence applicability | `commit-01-a`~`commit-07-b` 不负责最终 run-scoped evidence materialization，均以具体原因标 `not_applicable`；`commit-08-a/b` 负责 raw/report 或 acceptance/review input，保持 `pending` | pass_design_complete |
| design/implementation separation | 设计台账不记录代码执行事实；实施台账不反写设计过程 | pass_design_complete |

## 8. 回填草稿

正式 `07-实施计划.md` 应由 §7.1 映射的 13 个章节装配。正文的唯一职责是将 current `00~06` 的设计基线转译为可验证 phase、commit boundary、测试/验收门禁、配置/环境准备、风险控制、提交交付纪律和完成判定。

正式正文开头必须声明：目标实现仓为 `/home/aris/Projects/quantalithos-observability`，当前尚未建立；只有 `core-contracts` 作为编译期 sibling dependency 候选；Observability 只拥有观测/审计投影和本地交付 marker/handoff，不拥有或反写业务 truth；设计阶段不填写 commit、run、artifact、report、evidence alias、verdict 或 signoff。

Step 13 完成时，除正式 07 外，同时提供项目级 implementation ledger 和 16 个 planned boundary skeleton。项目级 ledger 只激活 `commit-01-a`，且因为 target repo 尚不存在，其 Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate 均不得标 `pass`；未来 boundary 保持 `planned / wait_until_current`。

## 9. 待确认事项与 blocker

| 事项 | 当前状态 | 处理 |
|---|---|---|
| target implementation repo | open reality blocker | 由 PH-01/`commit-01-a` 创建或确认；当前不在设计仓实现 |
| CI/INT/RuntimeLike/runner | open reality precondition | 保持 blocked/not_run/not_evaluated；不使用低等级替代 |
| 12 inherited affected | open/controlled/conditional | 按 Step 07 和 boundary ledger 逐项保留；由上游/受影响 owner闭合 |
| actual design baseline hash | not established | 实现移交时固定；台账暂写 `formal-07-assembled-not-committed`，不伪造 hash |
| reviewer/test/acceptance authority | pending | 在真实 handoff 前具名并记录 authority scope |
| new upstream blocker | none | 未发现新的上游冲突 |

## 10. Step 13 自检与进入完成条件

| 检查项 | 结论 |
|---|---|
| Step 01~12 是否均为 current 且可追溯 | pass |
| 13 章来源映射是否完整 | pass |
| 正式正文是否禁止新增 schema/state/gate/result | pass |
| 8 phase / 16 boundary / 12 gate / 99/82/9 identity 是否固定 | pass |
| target reality、affected 和证据真实性是否保留 | pass |
| implementation ledger 与 16 skeleton 预创建规则是否明确 | pass |
| 正式正文装配前是否完成三层台账门禁 | pass_design；项目台账、flow、Step 13 均允许装配 |
| 是否伪造实现 commit/hash/run/artifact/report/evidence/verdict/signoff | no |
| new upstream blocker | none |
| formal 07、implementation ledger、16 boundary skeleton 是否已完成最终审计 | pass_design；正式正文与设计资产已闭合，真实实现前置仍保持受控 |
| gate_status | `pass_with_reality_preconditions` |
| next_allowed_action | `stop_after_07_completion_wait_user` |

## 11. 参考

- `standards/document/实施计划讨论流程_SOP.md` Step 13
- `standards/document/实施计划书写规范.md` §3、§4.10、§5.1~§5.13、§6
- `standards/document/代码实施台账与门禁规范.md` §3~§8、§11~§14
- `standards/document/设计文档讨论中间产物规范.md` §3.3、§3.4.2、§3.4.6、§3.5、§3.6
- `projects/L4-observability/design-calibration/07_implementation_plan_calibration_flow.md`
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/01-架构设计.md`
- `projects/L4-observability/02-概要设计.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md`
- `projects/L4-observability/06-验收标准.md`
- `projects/L1-governance/07-实施计划.md`
- `projects/L1-artifact/07-实施计划.md`
