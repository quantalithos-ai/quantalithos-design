# L2-member-images 架构设计校准流程

> 依据: `standards/document/架构设计讨论流程_SOP.md`、`standards/document/架构设计书写规范.md`、`standards/document/设计文档讨论中间产物规范.md`
> 设计模式: `full-restart`;旧正式 `01-架构设计.md` 仅作 Step 16 historical pollution audit 输入
> 执行顺序: Step 1 -> Step 16 严格串行;前一步通过前不得创建下一步文件
> 当前授权: 用户已明确同意完成全部正式 01;正式 01 完成后必须 `stop_review`,不得进入 02
> 最近更新: 2026-08-23;Step 16 与正式 01 全量审计通过,当前 `stop_review`

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `01-架构设计.md` | Step 16 | `formal_01_stop_review` | stop_review | 旧正式 01 已只读审计并从空 18 章骨架重建;18 章来源、图表、编号、owner、六类 seam、pending 与污染审计通过 | 等待用户明确确认;不得进入 02、修改后续正式文档或提交 commit | `../01-架构设计.md`;`01_arch_step_16_formal_document_assembly.md`;`project_execution_ledger.md` |

## 2. 执行纪律

- 本 flow 只规划 Step 1~16;未到达 Step 的文件不得提前创建、替换或清空。
- 每个 Step 必须独立完成十段结构:Step 状态与内计划、本步输入、SOP 问题回答、当前材料问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项、进入下一步条件。
- 每个 Step 必须至少记录一个未采用方案;架构图必须包含图类型、图标题、ASCII 正文和图后说明。
- 架构单元是语义责任边界,不是代码模块、服务、进程、数据库、crate 或部署产品。
- `compile/runtime/event/ref/adapter/fake` 必须逐关系分类;镜像消费或物理装配不自动形成源码依赖。
- `MI-UP-001~009`、`Q-MI-001~004` 未经正式 owner 来源关闭前持续为 pending / blocker;不得润色为 readiness。
- 不记录或伪造实现仓、commit、run、digest、report、evidence、测试结果、verdict、signoff 或真实 readiness。
- Step 15 形成独立结论前不读取旧正式 01;Step 16 才将其作为 historical pollution audit 输入。
- Step 16 必须先删除旧正式 01,再从空的 18 章骨架分批重建;通过全量审计后切换为 `stop_review`。

## 3. 公共必读与读取状态

| 输入 | 用途 | 状态 / 口径 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 正式设计文档通则 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、十段结构、串行与 full-restart | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | owner、状态、证据、依赖与落码边界 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 跨仓方向和六类 seam | read |
| `standards/document/架构设计讨论流程_SOP.md` | Step 1~16 门禁 | read |
| `standards/document/架构设计书写规范.md` | 正式 18 章结构 | read |
| `projects/L2-member-images/00-需求文档.md` | 本仓唯一需求基线 | read / approved baseline |
| `architecture/adr/0005-member-image-per-role.md` | 一 Role 一镜像、nightly、mapping owner、pin | read / accepted ADR |
| `projects/L2-runtime/00~07` | runtime 边界与未来 component ref | read / formal stop-review baseline |
| `projects/L2-tools/00~07` | tools 边界与未来 component / extras ref | read / formal stop-review baseline |
| `projects/L3-method-library/00~07` | RoleDefinition 与 Role -> variant owner | read / exact consumer seam pending |
| `projects/L1-artifact/00~07` | Artifact truth 与正式消费引用边界 | read / image handoff pending |
| `projects/L4-sandbox/00~07` | sandbox 排除边界 | read / hardened base future-only |
| `projects/L0-core/` 当前正式文档与台账 | shared contract authority | read / image-specific schema pending |
| `projects/L2-member/` 当前正式文档与台账 | member component 供给边界 | read / architecture 未停审,pending |
| `projects/L2-member-service/` 当前正式文档与台账 | pinned entry 消费方向 | read / requirement closed,exact contract pending |
| `projects/L1-governance/` | 责任分层与实施粒度参考 | read / pattern reference only |
| 本仓 `draft/` | 已讨论候选线索 | read / non-normative |
| 本仓旧 README、旧正式 `01` | 污染审计 | read / historical_audited_not_authoritative;旧正式 01 已删除并重建 |

## 4. Step 总任务表

| Step | 主题 | 必要输入 | 输出文件 | 完成门禁 | 状态 |
|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 00、accepted ADR、owner 输入 | `01_arch_step_01_requirement_baseline.md` | 需求进入项、排除项、pending 和架构问题可追溯 | completed |
| 2 | 明确架构目标与约束 | Step 1 | `01_arch_step_02_goals_constraints.md` | 目标、硬约束、阶段取舍、非目标分层 | completed |
| 3 | 职责边界 | Step 1~2 | `01_arch_step_03_responsibility_boundary.md` | own / consume / coordinate / forbid 及越界红线明确 | completed |
| 4 | 系统边界与上下文 | Step 3、全局依赖基线 | `01_arch_step_04_system_context.md` | 系统上下文图、交互对象、关系类型和失效上限明确 | completed |
| 5 | 限界上下文与子域划分 | Step 3~4 | `01_arch_step_05_bounded_context_subdomains.md` | 内部语义单元、子域类型、依赖和排除项收敛 | completed |
| 6 | 容器 / 部署架构 | Step 4~5 | `01_arch_step_06_container_deployment.md` | 逻辑边界与部署假设分离;不预设产品或常驻服务 | completed |
| 7 | 依赖方向与层间约束 | Step 4~6、全局裁剪规则 | `01_arch_step_07_dependency_direction.md` | 六类关系、Core compile 白名单与禁止依赖收敛 | completed |
| 8 | 数据所有权与一致性 | Step 3、5、7 | `01_arch_step_08_data_ownership_consistency.md` | truth / snapshot / ref / outcome / forbidden body 与一致性明确 | completed |
| 9 | 关键交互与通信方式 | Step 4、7、8 | `01_arch_step_09_interactions_communication.md` | 五条主交互、同步 / 异步 / ref / adapter 与失败语义明确 | completed |
| 10 | 关键技术选型 | Step 5~9 | `01_arch_step_10_technology_choices.md` | 只锁架构机制类别;产品、协议和实现保持 deferred | completed |
| 11 | 备选方案与取舍 | Step 2~10 | `01_arch_step_11_alternatives_tradeoffs.md` | 主要替代方案及拒绝理由可追溯 | completed |
| 12 | 横切关注点 | Step 5~11 | `01_arch_step_12_cross_cutting_concerns.md` | 安全、可靠、审计、可观测、兼容和运维边界完整 | completed |
| 13 | 演进路线 | Step 10~12、open register | `01_arch_step_13_evolution_path.md` | current / conditional / future 路线和进入条件明确 | completed |
| 14 | 风险与待确认事项 | Step 1~13 | `01_arch_step_14_risks_open_questions.md` | 风险、owner、影响、保守默认和关闭证据明确 | completed |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | ADR 决策、架构单元、需求和风险无孤儿 | completed |
| 16 | 整理正式文档 | Step 1~15、旧 01 historical material | `01_arch_step_16_formal_document_assembly.md`;`../01-架构设计.md` | 18 章空骨架重建、来源和全量静态审计通过 | completed / stop_review |

## 5. 当前 blocker / pending 注册表

| ID | Owner / authority 缺口 | 架构影响 | 保守处理 |
|---|---|---|---|
| `MI-UP-001` | `L2-member-service` exact manifest / variant / ref / confirmation contract | 阻塞 positive instantiation handoff | 仅固定消费方向与 local entry 语义 |
| `MI-UP-002` | `L2-member` component shape / compatibility | 阻塞 member component 正向兼容结论 | 只接受未来 pinned release ref |
| `MI-UP-003` | `L3-method-library` exact consumer / query / snapshot surface | 阻塞 mapping 正向解析合同 | 只固定 mapping owner 和 fail-closed |
| `MI-UP-004` | Core image-specific shared schema | 阻塞 compile contract 白名单扩展 | 仅允许正式 Core shared contract |
| `MI-UP-005` | 入站 build event family / schema | 阻塞 event-trigger positive readiness | nightly 保留;事件入口 pending |
| `MI-UP-006` | policy / memory / workspace seed template owner 与 exact seam | 阻塞 seed 正向绑定 / placement 合同 | 只承接 pinned template ref / placement;正文与 exact contract 外置 |
| `MI-UP-007` | Artifact image candidate handoff 条件 / schema | 阻塞正式 Artifact ref 正向签发声明 | eligibility 与 handoff 分层 |
| `MI-UP-008` | hardened base 正式供给合同 | 阻塞 hardened base current scope | future-only |
| `MI-UP-009` | outbound build / publish event authority | 阻塞任何出站事件能力 | 当前不定义 event output |
| `Q-MI-001` | restricted / 收缩 variant 范围与 governance authority | 影响收缩 variant 是否进入正式范围 | conditional;不改变 Role / governance truth |
| `Q-MI-002` | multi-architecture scope | 影响平台维度 | conditional |
| `Q-MI-003` | builder / registry / evidence backend 产品绑定 | 影响 adapter 具体载体 | 保持 adapter-neutral;产品选择后移 04 |
| `Q-MI-004` | BOM / scan / signature 等 applicable gate inventory | 影响具体 evidence kind | 只保留 authority-driven gate 机制 |

## 6. 当前 next_allowed_action

正式 01 与 Step 16 已完成并切换为 `stop_review`。当前只允许等待用户明确确认;未经再次确认不得创建 02 flow / Step、修改正式 `02-概要设计.md` 或继续任何后续正式文档。
