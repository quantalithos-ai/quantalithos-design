# L2-member-images 03 详细设计 Step 19：正式文档装配与历史污染审计

> 创建日期：2026-09-01  
> 当前状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19  
> 书写约束：`standards/document/详细设计书写规范.md` §3.3、§4.5、§5.1~§5.18  
> 回填目标：`projects/L2-member-images/03-详细设计.md`  
> 授权边界：用户已明确确认 Step 19；本 Step 只装配并审计正式 03。不得进入 04、实现、测试执行、实施台账、planned boundary skeleton 或 commit。

## 0. 开工确认与三层门禁

| 门禁层 | 当前结论 | 本 Step 允许的动作 | 明确禁止 |
|---|---|---|---|
| 项目级台账 | `03 / Step 19 / formal_document_assembly` 已完成并停审 | 已创建本 Step 中间产物、执行旧正式 03 historical pollution audit，并从前置已完成 Step 重建正式 03 | 04~07、实现仓、implementation ledger、planned boundary skeleton、测试或 commit。 |
| 文档级 flow | `completed_stop_review` | 正式 03 已按 18 章主链装配、完成自检和停审回写 | 将 Step 19 完成误读为自动获准进入 04。 |
| Step 级 | 前置 Step 已完成；Step 19 已完成 | 保留已收稳的本仓契约、所有 blocker / pending 与 fail-closed 上限 | 新增对象、字段、协议、状态、产品、证据、readiness 或外部正向合同。 |

## 1. 本步目标

本 Step 将 Step 1~18 的已完成校准结论重建为正式 `03-详细设计.md`。正式正文是实现契约的入口、模块主轴、索引和跨 Step 边界声明；字段级对象、port、DTO、逐接口 flow、逐状态机矩阵及其缺口仍以具体 Step 中间产物为唯一细节来源。

若正式摘要与校准来源不一致，必须回到相应 Step 修正，不得由实现者、配置、fake 或下游文档自行补设。正式 03 不生成实现事实、测试事实、Artifact / digest / provenance 成功事实、consumer confirmation、发布结果或 readiness。

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 本仓当前正式基线 | 承接 owner、范围、五 capability、七技术模块、依赖分类与概要骨架。 |
| `03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_18_risks_open_questions.md` | 已完成校准输入 | 提供每个正式章节的唯一收敛来源与未关闭项。 |
| `详细设计讨论流程_SOP.md` Step 19 | 已读取 | 固定 18 章主链、装配问题与完成条件。 |
| `详细设计书写规范.md` | 已读取 | 固定来源块、模块主轴、索引边界与闭环检查。 |
| `L1-governance` Step 19 / 正式 03 | 只作格式与装配粒度参考 | 参考“正式入口 + calibration 回指”的组织法；不继承治理对象、outbox、publisher、产品或成功合同。 |
| 旧 `03-详细设计.md` | `historical_material`，本 Step 可读 | 仅执行下文污染审计；不是新正文输入。 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 正式文档是否按书写规范章节主链组织？ | 是。重建版采用第 1~18 章主链；每章给出可定位的 calibration 来源和延伸阅读。 |
| 第 5 章是否以模块为主轴？ | 是。以 `contracts / domain / application / infra / api / worker / jobs` 七技术模块展开；五 capability 只作为跨模块业务责任轴。 |
| 对象、trait、协议、flow、状态机是否可回指？ | 是。第 5~10 章提供模块、对象/port/API 索引、28 条 logical surface、flow 与状态族索引；字段和函数级定义分别回指 Step 6~11。 |
| 字段、DTO、状态与 phase boundary 是否已复核？ | 本仓设计层预复核已在 Step 17 完成，但 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 与 `PF-UNAVAILABLE-RECOVERY` 必须保持 blocker；未来 07 仍须对每个实际 boundary 重做审计。 |
| 其他实现者能否只凭本文直接猜补代码？ | 不能猜补。本文和指定 Step 来源共同构成设计入口；任何未闭合字段、write/replay/recovery 或 owner 合同必须暂停并回写设计。 |
| 是否混入下游文档职责？ | 不混入。只保留配置绑定点、测试切口与实施前置输入；不写配置全集、测试执行、验收、phase、commit、报告或运维流程。 |

## 4. 历史材料污染审计

旧正式 `03-详细设计.md` 已在本 Step 读取，结论如下。其内容不被迁入新版正文；每个仍有价值的方向都必须已由重建版 00~02 或 Step 1~18 重新收稳后才可在本次装配出现。

| 旧材料模式 | 发现的污染或冲突 | 新版处置 |
|---|---|---|
| 旧对象主线 | 以 `MemberImage`、`ImagePersona`、`ImageToolset`、`InstantiateTicket` 等旧对象替代当前 DefinitionAssembly / BuildCandidate / Qualification / SupplyEntry / ReferenceDerived 分层。 | 不继承。第 5 章只使用 Step 6 已定义对象及其模块归属。 |
| 传输与外部接口 | 写入 RPC / HTTP、MQ topic、`member_image.*` 事件、直接 member/runtime/UI 消费与 route 语义。 | 不继承。当前仅有 in-process logical surface；外部 route/topic/schema 未绑定，outbound inventory 严格为零。 |
| publisher/outbox | 预设 publisher、发布事件、delivery、重试与跨仓成功消费。 | 不继承。`ImageOutboundEventInventory::NoneAuthorized` 固定；`MI-UP-009` 仍为 future / absent authority。 |
| 正向外部事实 | 把 role/capability、Artifact、consumer、container、runtime bootstrap、activation 或 confirmation 写为当前已成立。 | 不继承。所有 external lane 仅能以 typed ref、safe conclusion、gap、blocked、unknown、unavailable 或 marker 表达。 |
| 状态与历史 | 以 Draft/Published/Retired 等单一镜像生命周期串联 build、qualification、supply 与 runtime。 | 不继承。第 9 章采用 Step 10 的局部、正交状态机，任何 staged local state 均不等 global readiness。 |
| 物理存储和产品 | 预设 DB 表、消息产品、registry / storage、digest、seed body 或 live workspace/memory。 | 不继承。logical store 和 product-neutral port 可保留；产品、DDL、body、digest 成功与 live state 均不装配。 |
| 旧定量与角色清单 | 固定 Role 数、工具清单、产品、性能、实例化结果或验收叙述。 | 不继承。仅承接 ADR 的一 Role 一镜像、pinned、禁 `latest` 等已核验方向，不自造数量与结果。 |

## 5. 正式装配策略

| 正式章节 | 主要校准来源 | 装配方式 |
|---|---|---|
| 1~4 | Step 1~4 | 汇总上游、范围、实现约束与 planned workspace 布局。 |
| 5~6 | Step 5~7 | 以七模块为主轴，给出收口摘要与全局索引；字段级对象和 port 签名回指 Step 6~7。 |
| 7~8 | Step 8~9 | 固定 10 Command、10 Query、2 marker-only inbound、6 Job、0 outbound 的库存与逐 flow 回指。 |
| 9~15 | Step 10~16 | 汇总状态、store/UoW、错误、并发、配置、观测和测试切口，不将 planned seam 写成已执行事实。 |
| 16 | Step 17 | 交接未来 07 的审计输入；不创建下游文档。 |
| 17 | Step 18 | 汇总风险与待确认项，不将其改写为正向合同。 |
| 18 | Step 19 | 记录正式装配、历史污染审计与停审结论。 |

## 6. 完成审计

| 检查项 | 结论 |
|---|---|
| 正式 03 的项目级、文档级、Step 级写入授权 | `pass`：写入仅发生在已获授权的 Step 19；正式 03 随即停审。 |
| 18 章主链、来源块与延伸阅读块 | `pass`：静态计数均为 18；每章都有可定位的 calibration 来源。 |
| 逻辑协议库存 | `pass_with_explicit_blockers`：10 Command、10 Query、2 marker-only inbound、6 Job、0 outbound，共 28 条 non-outbound logical surface；库存不等可写或可运行。 |
| fail-closed 与 static/live 边界 | `pass_with_explicit_blockers`：Command/Job 在 `DDD-S9-B01/B02` 前 zero-effect，Query no-write，inbound `accepted_input=false`，模板/seed/build input 与 runtime live state 未混写。 |
| 旧正式 03 已被隔离为 historical audit | `pass`：见 §4；旧对象、传输、publisher/outbox、物理产品和正向外部事实均未被作为新正文合同继承。 |
| 本仓 blocker / owner pending 会被保留 | `pass_with_explicit_blockers`：`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009` 与 `Q-MI-001~004` 未被弱化或关闭。 |
| 下游 04~07 或实现材料不会被提前创建 | `pass`：未创建 04 flow、implementation ledger、planned boundary skeleton、实现仓或测试/证据材料。 |
| 格式与修改范围 | `pass`：正式文档 Markdown 的双空格尾随换行已清理；本 Step 只涉及本项目正式 03 与其 calibration/ledger 同步。 |

## 7. 完成动作、自检与污染复核

1. 已由 `apply_patch` 分批重建正式 `03-详细设计.md` 的 18 章正文；没有创建代码、Cargo、配置、测试、实施或证据材料。
2. 已逐章复核来源、术语、协议库存、zero-outbound、static/live 边界和 blocker；第 18 章仅直接回指本 Step，字段级材料仍由各正式章节自己的来源块定位，未使用省略范围替代来源。
3. 已复核历史污染候选词：它们仅在明确的隔离/禁止/审计语境中出现，没有成为对象、port、外部协议、发布或运行态的正向合同。
4. 已同步本 Step、03 flow 和项目执行台账为 `completed_stop_review`；本次只完成设计文档静态审计，未执行实现或测试。

## 8. 停审结论与当前门禁

结论：正式 `03-详细设计.md` 已完成 full-restart 装配并立即停审。设计入口可供后续按来源复核，但它不解除任何 blocker，也不授权 04、实现、测试或提交。只有用户再次明确确认，才可先读取 04 对应 SOP 与书写规范并创建 04 的 calibration flow。

```text
step_status = completed_stop_review
formal_03_assembly = completed
formal_03_self_check = passed_with_explicit_blockers
historical_pollution_audit = passed
formal_03_write_allowed = false_after_stop_review
old_formal_03_read_allowed = false_except_authorized_historical_audit_reopen
next_allowed_action = wait_for_user_explicit_confirmation_to_enter_04
next_document_allowed = false_pending_user_confirmation
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```
