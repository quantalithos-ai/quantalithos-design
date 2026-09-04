# 06-验收标准校准流程 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 正式文档：`projects/L2-member-service/06-验收标准.md`
> 模式：full-restart。旧 `06-验收标准.md` 已删除，仅在 Step 1 的历史材料审计中引用。

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `06-验收标准.md` |
| 当前阶段 | Step 15 整理正式验收标准文档 |
| 当前状态 | `completed / pass_with_upstream_blockers; stop_review` |
| 生成方式 | 先完成 Step 中间产物，再在 Step 15 按 15 章主链分批装配正式文档 |
| 用户授权 | 2026-09-03 用户明确“同意并完成全部的 06”，授权本轮连续完成 Step 1~15；不授权实现、测试执行或 commit |
| 旧文档处理 | 旧正式 06 仅作 historical_material / 污染审计输入，不继承其主语、编号、结论或证据 |
| 当前 gate_status | `pass_with_upstream_blockers` |
| gate_reason | Step 1~15 已完成；正式 06 已装配，15 章、AC/VF/EV、证据、VETO、缺陷、风险和跨门禁总审计已收口；MSVC-UP-001~008 等上游合同仍 pending / blocked / waiting |
| next_allowed_action | 停审并等待用户明确授权进入 07；不自动创建或装配 `07-实施计划.md` |

## 2. 执行纪律确认

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes：`设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md` |
| 已读取文档类型规范 | yes：`验收标准讨论流程_SOP.md`、`验收标准书写规范.md` |
| 已读取项目输入 | yes：`project_execution_ledger.md`、正式 `00~05`、`03_ddd_step_16_test_cut.md`、旧 `06`、`L1-governance` 06 flow / formal doc / step materials |
| 当前模式 | `full-restart` |
| Step 执行顺序 | `01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15` |
| 单 Step 纪律 | 每个 Step 独立落盘；先问题回答，再诊断、取舍、结构化产物、复杂度判断、回填草稿、自检 |
| 正文纪律 | 正式正文只承载已收口的验收标准；不写过程性诊断、未确认建议、真实结果或 signoff |
| 证据纪律 | 只定义未来 `EV-MS-*`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*` 入口；不生成真实证据 |
| 修改范围 | 仅 `projects/L2-member-service/` |
| 提交纪律 | 不提交 commit |

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|---|
| 1 | 确认验收输入边界 | `00~05`、旧 `06`、SOP / 规范 | `06_acceptance_step_01_input_boundary.md` | 用户已授权进入 06 | `done / pass` | 输入、回答边界、上游 blocker 与历史污染审计可追溯 | 已允许 Step 2 |
| 2 | 明确验收目标与范围 | Step 1、`00` 目标 / 非目标、`05` 范围 | `06_acceptance_step_02_scope.md` | Step 1 pass | `done / pass` | P0/P1/P2、in/out scope 和 VETO 候选可裁决 | 已允许 Step 3 |
| 3 | 固定验收基线 | Step 2、`05` 证据结构、`04` profile | `06_acceptance_step_03_baseline.md` | Step 2 pass | `done / pass` | 版本、环境、数据、run/artifact/report 入口固定且无 `latest` | 已允许 Step 4 |
| 4 | 定义进入条件与退出条件 | Step 3、`05` 退出规则 | `06_acceptance_step_04_entry_exit.md` | Step 3 pass | `done / pass` | 进入、退出、暂停 / 不可裁决条件均可判定 | 已允许 Step 5 |
| 5 | 定义功能验收门禁 | Step 4、`00` AC-MS-001~021、`03` flows、`05` TC/EV | `06_acceptance_step_05_function_gate.md` | Step 4 pass | `done / pass` | P0 功能逐项闭环到设计 / TC / EV / report 并停审 | 已允许 Step 6 |
| 6 | 定义数据边界与架构红线验收 | Step 5、`00` BR / D、`01` owner、`03` boundaries | `06_acceptance_step_06_data_arch_redlines.md` | Step 5 pass | `done / pass` | 每条红线有通过 / 失败 / 证据与 VETO 影响 | 已允许 Step 7 |
| 7 | 定义接口、事件与跨仓同步验收 | Step 6、`03` protocol、`04` binding、`05` seams | `06_acceptance_step_07_interfaces_events_sync.md` | Step 6 pass | `done / pass` | 10/6/5/1/7 入口、依赖类型和 pending 裁决闭合 | 已允许 Step 8 |
| 8 | 定义状态机、事务与一致性验收 | Step 7、`03` state / UoW / idempotency | `06_acceptance_step_08_state_tx_consistency.md` | Step 7 pass | `done / pass` | 状态、事务、Query no-write、Job no-truth-repair、unknown 可判定 | 已允许 Step 9 |
| 9 | 定义非功能验收门禁 | Step 8、`00` NFR、`04` failure、`05`专项 | `06_acceptance_step_09_nonfunctional.md` | Step 8 pass | `done / pass` | 指标来源、P0 结构性门禁和 P1/P2 residual 清楚 | 已允许 Step 10 |
| 10 | 定义可观测性、审计与证据门禁 | Step 9、`03` observability、`05` §13 | `06_acceptance_step_10_observability_evidence.md` | Step 9 pass | `done / pass_with_upstream_blockers` | EV、raw/report pairing、redaction、dependency、report audit 闭合 | 已允许 Step 11 |
| 11 | 定义一票否决项 | Step 10、`00` VF-MS-001~009、红线 | `06_acceptance_step_11_veto.md` | Step 10 pass | `done / pass_with_upstream_blockers` | 每个 VETO 有来源、证据、report 和不可风险接受口径 | 已允许 Step 12 |
| 12 | 定义缺陷分级、复验与放行规则 | Step 11、`05` 缺陷 / 回归 | `06_acceptance_step_12_defects_retest_release.md` | Step 11 pass | `done / pass_with_upstream_blockers` | S/A/B/R 与 VETO、复验、放行一致 | 已允许 Step 13 |
| 13 | 定义风险接受与遗留项 | Step 12、`05` residual / blockers | `06_acceptance_step_13_risk_acceptance.md` | Step 12 pass | `done / pass_with_upstream_blockers` | 每项 residual 有影响、理由、owner、acceptor、deadline / trigger | 已允许 Step 14 |
| 14 | 定义最终结论与签署口径 | Step 13、全部门禁 / 缺陷 | `06_acceptance_step_14_final_decision_signoff.md` | Step 13 pass | `done / pass_with_upstream_blockers` | 仅三值结论，签署含义与风险接受不越权 | 已允许 Step 15 |
| 15 | 整理正式验收标准文档 | Step 1~14、书写规范 | `06_acceptance_step_15_formal_document_assembly.md`、正式 `06-验收标准.md` | Step 14 pass | `completed / pass_with_upstream_blockers` | 15 章主链、来源映射、总审计无断裂；未伪造执行事实 | 完成后停审，等待下一文档授权 |

## 4. 06 专用验收分母与编号口径

| 分母 | 正式数量 / 范围 | 验收承接 |
|---|---:|---|
| 核心能力闭环 | 5：`C-MS-1~5` | `AC-MS-001~005`、`VF-MS-001` |
| 功能与外围能力 | `FR-MS-001~012`、`FR-MS-E01~E04` | `AC-MS-006~021`；外围不阻断 P0 |
| 规则 / 边界 | `BR-MS-001~050` | `AC-MS-022~027`、`VF-MS-002~008` |
| 数据归属 | `D-MS-001~037`、`D-MS-E01~E04` | `AC-MS-028~033`、`VF-MS-003/005/007` |
| 非功能 | `NFR-MS-001~020` | `AC-MS-034~039`、`VF-MS-009` |
| Command | 10 | 协议族主题（内部说明，不新增正式 AC）与 `EV-MS-CMD-*` |
| Query | 6 | 协议族主题（内部说明，不新增正式 AC）与 `EV-MS-QUERY-*` |
| Inbound Consumer | 5 | 协议族主题（内部说明，不新增正式 AC）与 `EV-MS-CONSUMER-*` |
| Material helper | 1：`HostFactMaterialEventCandidate` | 协议族主题（内部说明，不新增正式 AC）与 `EV-MS-MATERIAL-*` |
| Operations Job | 7 | 协议族主题（内部说明，不新增正式 AC）与 `EV-MS-JOB-*` |

## 5. 全局 blocker / 06 当前处理

| Blocker | 当前状态 | 06 允许的裁决 |
|---|---|---|
| `MSVC-UP-001` Runtime entry / host session / handoff | pending / blocked | 只验 host-side boundary、placeholder、unknown 和 fail-closed；不验 Runtime run / turn / checkpoint |
| `MSVC-UP-002` Member launch / register / heartbeat / status | pending / waiting | 只验 safe ref、非法 / 重放 / 迟到拒绝；真实 IPC / credential positive 不宣告通过 |
| `MSVC-UP-003` Images pinned supply contract | pending / blocked | 只验 opaque ref、availability、no Role→image bypass；manifest / digest / verification positive blocked |
| `MSVC-UP-004` Sandbox host bind / release | pending / blocked | 只验 required binding no-fallback 和 local attempt / gap；backend / caller / completion 不伪造 |
| `MSVC-UP-005` policy transfer owner | owner pending | 无当前正向 AC；不新增 policy 输入或本地裁决 |
| `MSVC-UP-006` launch credential owner | owner pending | 只验不保存、不复用、实例绑定和不可证拒绝 |
| `MSVC-UP-007` Core / Bus schema、event、receipt | pending | 只验 topic-neutral / body-free seam；不宣告 route / receipt ready |
| `MSVC-UP-008` SDK target / self-test | pending | 只验依赖分类；不宣告准确 compile target 已通过 |

## 6. 当前总门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 项目级 | `pass`（用户已授权 06） | 05 已完成停审，用户明确授权进入 06 | 按当前 Step 继续 |
| 文档级 | `pass_with_upstream_blockers; stop_review` | Step 1~15 已完成，正式文档和总审计已收口 | 等待用户明确授权进入 07 |
| Step / 模块级 | `pass_with_upstream_blockers; stop_review` | Step 15 已完成；真实验收尚未执行，外部 exact contract 仍 pending | 不创建 07，不实现、不测试、不提交 |

## 7. 禁止动作

- 不实现代码，不运行测试，不生成真实 `run_id`、artifact、report、evidence、verdict、signoff 或 readiness。
- 不把 sibling 尚未停审的内容当作正式真相；跨项目合同继续记录为 pending / blocked / waiting / placeholder。
- 不修改 `projects/L2-member-service/` 之外的任何文件。
- 不提前创建未来 Step 文件；只有进入对应 Step 时才创建或改写。
- 完成正式 `06-验收标准.md` 后立即停审，不自动进入 `07-实施计划.md`。

## 8. 06 完成与停审记录

| 项目 | 记录 |
|---|---|
| 用户授权 | 2026-09-03 用户明确“同意并完成全部的 06”，允许本轮连续完成 Step 1~15；不授权实现、测试执行、真实证据生成、进入 07 或提交 commit。 |
| Step 1~14 | `completed / pass_with_upstream_blockers`；每步均保留问题回答、诊断、取舍、结构化产物、回填草稿、待确认事项和停审门禁。 |
| Step 15 | `completed / pass_with_upstream_blockers`；正式 `06-验收标准.md` 已按规范装配 15 章并完成跨章节总审计。 |
| 验收分母 | `AC-MS-001~039`、`VF-MS-001~009`、5 个核心闭环、10 Command、6 Query、5 Consumer、1 个 `HostFactMaterialEventCandidate`、7 个 Job。 |
| 证据边界 | 仅固定 `05 §13.2` 的 14 个 `EV-MS-*-001`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*` 未来入口；当前无真实 run、artifact、report、evidence、defect、verdict、signoff 或 readiness。 |
| 依赖边界 | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、Member/Images/Runtime/Sandbox mapper、具体 provider / observability / 性能 authority 继续 pending / blocked / waiting。 |
| 一致性审计 | Query no-write、Job no-truth-repair、generation / key fence、immutable material、四层 handoff、redaction、dependency 和 report audit 规则一致；未发现正式文档内部 unresolved 冲突。 |
| 停审结论 | `completed / pass_with_upstream_blockers; stop_review`。本结论只表示正式 06 设计 / 校准合同完成，不表示验收已执行或交付已通过。 |
| 下一步 | 等待用户明确授权进入 `07-实施计划.md`；本轮不创建 07、不生成 implementation ledger 或 boundary skeleton。 |
