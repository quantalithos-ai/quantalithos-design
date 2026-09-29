# Step 13. 整理正式实施计划文档

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13；回填位置：正式 `07-实施计划.md` 全文。
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。
> 本产物先于正式文档创建并现已完成；只控制正式装配和静态审计，不实现代码、不执行测试/验收、不创建目标实现仓或提交。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 13：整理正式实施计划文档 |
| 输入 | Step 1～12 中间产物；正式 `00～06`；实施计划 SOP/书写规范；代码实施台账规范；L1-workspace/L1-governance 粒度样本 |
| 输出 | 正式 `07-实施计划.md`、本文件、`implementation_execution_ledger.md`、16 个 boundary skeleton、装配审计结果 |
| 当前状态 | `completed / formal_stop_review` |
| 当前实施事实 | `not_entered / blocked / not_ready_for_acceptance`；0/16 boundary；无目标仓核验、baseline、commit、run、artifact、report、EV、verdict、signoff 或 readiness |
| 写入范围 | 仅 `projects/L4-archive/` |
| 下一动作 | `wait_for_user_review_and_explicit_implementation_authorization` |

### 1.1 Step 内计划完成记录

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP 问题回答 | done | §3 |
| 当前材料/旧文档诊断 | done | §4 |
| 改动前后对比 | done | §4.1 |
| 设计取舍 | done | §5 |
| 结构化中间产物 | done | §6～§7 |
| 复杂度判断与回填草稿 | done | §5.1、§8.1；正式 `07-实施计划.md` |
| 自检与进入下一步条件 | done | §8～§10 |

## 2. 本步输入与读取确认

| 输入 | 装配用途 | 核验结论 |
|---|---|---|
| Step 1～4 | 输入、范围、前置、实施对象和交付面 | 已完成；目标仓/baseline absence、六 role、固定设计分母和 source-authority 可直接转译 |
| Step 5～6 | 8 Phase、16 boundary、任务/批次/scope/Gate/闭环复核 | 已完成；最终 boundary ID 集合唯一，PH-05 已稳定拆成 contracts/execution 两项 |
| Step 7～8 | TC/EV/AC/VETO、raw/report、配置/profile/依赖/fake | 已完成；所有实际 Gate 仍为 pending/blocked，不能把计划映射写成通过事实 |
| Step 9～10 | 12 Spike、15 风险、18 blocker、9 问题、暂停/回退/变更 | 已完成；owner、截止 Gate、禁止 workaround 和恢复规则完整 |
| Step 11～12 | 提交/评审/交付纪律、future completion 与 16-row closure | 已完成；planned title 不等实际 commit，实施完成不等正式 06 verdict |
| 正式 `00～06` | 唯一项目内正式真相源 | 均为 `formal / stop_review`；分母一致 |
| 实施计划与台账规范 | 13 章结构、逐章来源、planned skeleton 值域 | 已读取；禁止空表、旧教程搬运和虚构事实 |
| L1-workspace/L1-governance 样本 | 粒度、阶段、台账和装配审计样式 | 仅借结构；不复制 workspace/governance 领域主语 |

## 3. SOP 问题回答

| 问题 | 回答与装配取舍 |
|---|---|
| 是否覆盖书写规范章节主链 | 是。正式文档严格使用 §1～§13 固定章节，不增删或改序。 |
| 每章是否来自已确认中间产物 | 是。§1～§12 一一映射 Step 1～12，§13 映射本 Step；每章开头放具体来源和延伸阅读。 |
| Phase、boundary、门禁编号是否一致 | 固定 8 Phase、16 个最终 boundary；测试分母为 18 CUT/102 TC/13 suites/5 gates/14 scripts/19 EV；验收分母继承正式 06。 |
| 上游/测试/验收引用是否准确 | 只引用正式 `00～06`、适用 calibration 和已读标准；不把 historical material 当正式依据。 |
| 是否复制详细设计全文 | 否。正式 07 只承载实施顺序、任务/批次、scope、门禁和回读入口；对象字段、完整 DTO/port/state/test case 留在 `03/05/06`。 |
| 每个 boundary 是否有开工前闭环 | 是。正式 §6/§12 和 16 个 skeleton 均保留字段/DTO/state/ref/UoW/effect/evidence/phase boundary 复核入口。 |
| 是否有交付实现前总体审计 | 是。正式 §3/§12 固定按 16 boundary 对 `03/05/06/07` 的 immutable-baseline 审计；当前只标 mapped/blocked。 |
| 是否存在空表/占位内容 | 不保留未解释的 `<placeholder>`；未来事实统一写明 `pending`、`blocked`、`waiting`、`absent` 或 `0` 及原因。 |

## 4. 当前材料诊断与污染隔离

| 问题 | 风险 | Step 13 处理 |
|---|---|---|
| 本项目此前无正式 07 | 无可审查实施主链 | 只从 Step 1～12 整体新建，不拼接旧 README |
| 旧 README/draft 含 provider、期限、性能等历史假设 | 未授权选择可能进入任务或完成条件 | 正式 §1/§13 仅登记 historical material，不继承固定值 |
| Step 6 信息量大 | 过度压缩会丢失可落码粒度，原样复制又会变成重复真相源 | 正式 §6 保留 16 个 boundary 的动作、批次、scope、检查与阻塞；字段细节回指 03/Step 6 |
| planned 标题/路径可能被误读为事实 | 产生伪 commit/repo/evidence | 全文和 ledger 明确 `planned`；actual 字段统一 `pending/absent` |
| formal positive 大量 blocked | 可能删除 required lane 或用 fake 代替 | requiredness 保留；local/controlled/formal 证明层和 blocker 并列 |
| `L1-workspace` 名称与 commit scope `workspace` 易混淆 | projection 被冒充 canonical truth | source matrix 固定 `Auxiliary`；commit scope 只表示目标仓工程 workspace |

### 4.1 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式实施计划 | 不存在 | 13 个连续正式主章，逐章引用 Step 1～13 | full-restart 要求从已确认中间产物整体装配 |
| 实施恢复入口 | 只有设计讨论台账 | 项目 implementation ledger + 16 个 boundary skeleton | 满足 planned boundary 预创建与单一 current identity 规则 |
| Phase/boundary | 分散于 Step 5/6 | 正式 8 Phase/16 boundary 与 ledger/skeleton 同集合 | 防止实现阶段重排、漏项或临场补台账 |
| 配置域 | 正式 04 中定义 | 正式 07 承接 12 域/55 key，`test_deterministic` 明确属于 12 域之一 | 防止测试装配域被误计成第 13 域 |
| 事实姿态 | 只有未来计划 | 正式设计完成，但实现仍 `not_entered / blocked`、0/16 | 防止把 skeleton、planned title 或设计审计冒充执行事实 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 复制 L1-workspace 正式 07 后替换名词 | 快 | 会复制领域主语、错误数量和依赖 | 禁止 |
| 将 Step 1～12 原文顺序拼接 | 信息完整 | 正式文档会保留讨论语气、重复和实现教程 | 不采用 |
| 逐章转译，保留可执行表并回指详细契约 | 章节清楚、可落码、避免第二真相源 | 需要跨章分母审计 | 采用 |
| 所有 skeleton 标 planned | 表面统一 | 掩盖明确的 repo/formal seam/local blocker | 不采用；按真实前置标 planned/blocked/waiting |
| 在 skeleton 填预计 hash/run/证据 | 看似完整 | 伪造执行事实 | 禁止；actual 字段保持 pending/absent |

### 5.1 复杂度判断与写入批次

正式 07 同时承接 13 章、8 Phase、16 boundary、18 个 blocker/pending、固定测试/验收分母和两级实施台账，属于复杂长文档。装配按章节和 boundary 分批完成；16 个 skeleton 独立成文件，项目级实施状态单独放入 `implementation_execution_ledger.md`，避免用一张总表压缩可落码性或在正式正文复制完整详细设计。

## 6. 结构化中间产物：正式章节来源映射

| 正式章节 | 唯一主要 calibration 来源 | 必须保留的结论 |
|---|---|---|
| §1 与上游关系 | `07_implementation_plan_step_01_input_boundary.md` | 正式输入、historical、依赖/owner 边界、持续 blocker |
| §2 目标与范围 | `07_implementation_plan_step_02_scope.md` | P0/P1/P2、required formal seam、非范围 |
| §3 前置与阅读 | `07_implementation_plan_step_03_prerequisites_reading.md` | 目标仓、阅读矩阵、依赖分类、ledger、记忆种子 |
| §4 对象与交付 | `07_implementation_plan_step_04_objects_deliverables.md` | 六 role、固定分母、source-authority、测试/证据交付面 |
| §5 阶段顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | 8 Phase 依赖图、可验证增量、全阶段红线 |
| §6 任务/boundary | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 16 boundary、动作/批次/scope/check/Gate/经验复核 |
| §7 测试验收 | `07_implementation_plan_step_07_test_acceptance_gates.md` | raw-first、8 Phase/16 boundary 映射、失败与 review |
| §8 配置依赖 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 12 域/55 key、6 profile、关系分类、fake 上限 |
| §9 Spike/风险 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 12 Spike、15 风险、18 blocker、9 问题和截止 Gate |
| §10 控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | 暂停、回退、补偿、对账、新 baseline 和 16 项恢复 |
| §11 提交交付 | `07_implementation_plan_step_11_commit_review_delivery.md` | 16 planned title/body、英文实现仓、fixed footer、Gate |
| §12 完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | future completion、16-row audit、证据和当前 0/16 |
| §13 参考 | 本文件 | 来源索引、标准、stop-review 与事实边界 |

## 7. Planned ledger 与 skeleton 装配规则

| 产物 | 最小内容 | 当前允许值 | 禁止值/事实 |
|---|---|---|---|
| project implementation ledger | 恢复点、8 Phase、16 boundary 索引、共同 Gate、blocker、启动条件 | `planned/blocked/waiting`；Gate `pending/blocked` | implement/pass/complete/commit/handoff/readiness |
| boundary skeleton | required reads、allowed/forbidden scope、checks、Gate matrix、planned title、blockers | status=`planned/blocked/waiting`；Gate=`pending/blocked` | actual baseline/hash/message/run/artifact/report/EV/verdict |
| implementation repo | 只记录 planned target path 和 `not_created_or_verified` | waiting/blocked | 把路径存在性写成已核验 |
| design baseline | `pending_immutable_baseline` | pending | working tree、日期或虚构 hash |

16 个 skeleton 的文件名必须与最终 boundary ID 完全一致；不得保留任何未加最终后缀的历史 boundary 名称。

## 8. 装配审计计划

| 审计项 | 通过条件 | 当前结果 |
|---|---|---|
| 正式结构 | 13/13 连续主章；每章 1 个具体来源块和延伸阅读 | 通过（静态审计） |
| Phase / boundary | 8/8 Phase、16/16 最终 ID；formal/skeleton/ledger 集合相等 | 通过（静态审计） |
| 固定分母 | 6/26/8/7/30/32/18/8；12/55；18/102/26；13/5/14/19；06 分母一致 | 通过（静态审计） |
| 可落码性 | 16 项均有任务、批次、scope、checks、闭环与阻塞姿态 | 通过（设计层；实际 Gate 仍 pending/blocked） |
| 所有权 | workspace Auxiliary；无 owner truth/direct DB/governance decision 越权 | 通过（设计层） |
| 依赖 | compile/runtime/event/ref/adapter/fake 分离；仅 Core 是待核验 compile candidate | 通过（设计层；Core 仍待实际核验） |
| side effect | Query no-write；intent-before-effect；ACK/Committed/CommitUnknown 分离；no outbound | 通过（设计层；外部正向 lane 仍 blocked） |
| 事实边界 | actual baseline/commit/run/artifact/report/EV/verdict/signoff/readiness 均无实例 | 通过（均为 absent/0） |
| Markdown / diff | 本地链接、围栏、表格、尾空白、`git diff --check` 无错误 | 通过（静态审计） |

### 8.1 回填草稿与正式装配

| 正式范围 | 回填结论 |
|---|---|
| §1～§4 | 固定上游/owner/source authority、P0/P1/P2、实施前置阅读和六 role/交付面 |
| §5～§8 | 固定 8 Phase、16 boundary、测试验收门禁、12 配置域/55 key 与依赖/fake 上限 |
| §9～§12 | 固定 Spike/blocker、暂停/回退/变更、提交/评审纪律和 future completion/0-of-16 事实姿态 |
| §13 | 固定来源索引、标准、设计完成上限和 `formal / stop_review` 门禁 |

上述草稿已完整装配进正式 `07-实施计划.md`；正式正文没有新增 Step 1～12 未确认的对象、协议、状态、配置、TC、AC、EV 或执行事实。

## 9. 当前待确认、上游影响与完成上限

`AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` 全部保持开放。Step 13 不关闭、不降级、不风险接受任何一项；没有新增需要跨仓修改的 owning-project blocker。

本 Step 完成上限是：正式 07、项目级 planned ledger 和 16 个 skeleton 通过设计仓静态审计并进入 `formal / stop_review`。它不允许创建目标实现仓、固定 baseline、激活 boundary、实现、测试、提交或送验。

## 10. 自检与进入下一步条件

装配和静态总审计已通过，本 Step 回填为 `completed / formal_stop_review`，并同步：

```text
formal_07_status = formal / stop_review
implementation_plan_current_step = 13_completed_formal_stop_review
implementation_plan_next_allowed_action = wait_for_user_review_and_explicit_implementation_authorization
formal_07_write_allowed = false_except_review_fixes
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

静态审计已完成；正式 `07` 进入 `formal / stop_review`。除审查修复外不得继续写入，也不得自动进入实现。
