# L2-runtime 02 概要 Step 1: 确认上游输入边界

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 1 章；为第 2、3 章提供前置输入

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | 正式 `00-需求文档.md`、用户已确认的正式 `01-架构设计.md`、概要设计 SOP / 书写规范、项目 blocker 台账及专项上游正式链 |
| 目标 | 确认哪些需求 / 架构结论足以向代码主体、对象、接口、处理流和状态机下沉，哪些只能保持 seam / blocker |
| 禁止 | 重定义需求 / 架构；提前创建代码主体、对象、字段、接口、处理流、状态机；使用旧 02 的 ExecutionInstance / promote / WorkItem 主线 |
| 用户门禁 | 用户明确确认开始 02；本 Step 完成后停审，不自动进入 Step 2 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 需求输入确认 | done | 五能力、核心 FR / BR / NFR、数据 / 接口边界 | pass |
| 架构输入确认 | done | 八架构单元、依赖 / data / interaction / cross-cutting 约束 | pass |
| 专项上游 seam 核验 | done | owner / consumer / pending / fail-closed 映射 | pass |
| 历史概要污染诊断 | done | 旧 ExecutionInstance / WorkItem / promote / 技术栈降级 | pass |
| 上游关系映射 | done | 正式来源 -> 稳定结论 -> 概要展开方向 | pass |
| 不再回答 / 必须回答清单 | done | Step 1 固定输出 | pass |
| 回填草稿与门禁 | done_stop_review | 第 1 章候选；等待 Step 2 确认 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前概要设计要承接哪些需求结论？ | 承接五能力 `C-L2R-1~5`、核心功能 `FR-L2R-001~020`、规则 `BR-L2R-001~044`、接口能力 `IF-L2R-001~015`、NFR `NFR-L2R-001~019`、本地 truth / external snapshot / ref / candidate / forbidden body 数据边界及 `L2R-UP-001~008`。 |
| 当前概要设计要承接哪些架构结论？ | 承接五核心语境、Entry / External Truth Views / Safe Runtime Views，逻辑运行承载角色，只有 Core 可 compile 的依赖裁剪，数据所有权与一致性，sync / async / background 交互分层，12 项机制 / ADR 和 fail-closed / unknown / local-truth-first 横切红线。 |
| 哪些已经足够稳定？ | Runtime-owned run / goal-plan / context-working-memory / model decision / action-delegation / checkpoint-recovery / local outcome / handoff attempt 的语义 owner 已稳定；外部 owner 及 forbidden body 边界、状态分层、依赖类型和失败姿态也足够稳定，可作为后续概要对象 / seam / flow / state 的来源。 |
| 哪些仍未收稳，不能直接展开？ | Tools-Sandbox mapping、receipt / feedback、model adapter owner / route、durable memory owner、Runtime-specific Core / Bus / Observability schema、event / safe material source / route、checkpoint persistence / transaction / commit-unknown 物理合同和下游 member / product entry 仍 pending；只能设计 local boundary、port / adapter seam、blocked / gap，不得写正向 schema 或 ready 接口。 |
| 哪些边界决定概要不该展开到哪里？ | 不得展开相邻仓 truth / body / provider control / tools execution / sandbox lifecycle / observed backend / artifact evidence；不得写完整 schema、DDL、函数实现、目录 / 文件布局、部署参数、固定语言 / 框架、测试结果、验收或实现状态。 |

## 3. 上游输入稳定性判定

### 3.1 可直接承接的需求输入

| 需求输入 | 稳定结论 | 概要设计允许继续展开 |
|---|---|---|
| `C-L2R-1` / `FR-L2R-001~004` | Runtime 拥有 controlled run、goal / plan working state、显式 status / disposition | 代码主体职责候选、run / goal-plan 对象候选、entry / control / query seam、运行状态机和受理 / 推进流。 |
| `C-L2R-2` / `FR-L2R-005~008` | Runtime 拥有 composition / working memory / retrieval mediation；durable body 外置 | context / working memory / source-use / candidate 对象候选，resolver / memory port seam，composition / degradation flow。 |
| `C-L2R-3` / `FR-L2R-009~012` | Runtime 拥有 provider-neutral intent / selection / disposition / safe summary | model decision 对象候选、neutral adapter port、turn correlation flow 与 unavailable / late state。 |
| `C-L2R-4` / `FR-L2R-013~016` | Runtime 拥有 action choice、orchestration、delegation、incorporation；执行 truth 外置 | action / delegation 对象候选、precondition / Tools / child seam、action lifecycle 与 unknown fence flow。 |
| `C-L2R-5` / `FR-L2R-017~020` | Runtime 拥有 stable checkpoint、recovery / reflection decision、local outcome、attempt / gap | checkpoint / recovery / outcome / handoff 对象候选、resume / feedback / event seam、恢复与交接状态流。 |
| `BR-L2R-001~044` | source anchoring、owner separation、正文禁止、late / duplicate / unknown、fail closed、local truth first | 后续对象 invariant、接口拒绝 / gap、处理流 guard、状态禁止迁移和异常边界。 |
| `NFR-L2R-001~019` | bounded、可恢复、最小暴露、幂等 / ordering、可追溯、readiness 分层 | 概要层 budget / correlation / redaction / state guard / port failure 轮廓；不写无证据数字。 |

### 3.2 可直接承接的架构输入

| 架构输入 | 稳定结论 | 概要设计允许继续展开 |
|---|---|---|
| 五核心语境 | Run & Goal-Plan、Context & Memory、Model Decision、Action & Delegation、Checkpoint / Recovery / Handoff | Step 4 / 5 映射为主要组成部分与代码主体候选；不是固定 crate / directory。 |
| 三个支撑 / 视图语境 | Runtime Entry & Control、External Truth Views、Safe Runtime Views | inbound、resolver / ref view、projection / handoff boundary 候选。 |
| 运行承载角色 | Entry、Progression、Recovery / Background、Feedback、State Truth Carrier | 允许映射 application service / inbound / port / persistence responsibility；不声明进程 / 容器。 |
| 依赖方向 | 只有 `L0-core` 是 compile 候选；其他为 runtime / event / ref / adapter / fake | 后续 port / adapter / event / ref 骨架按 seam 分类；不引入 sibling package。 |
| 数据归属 | Runtime truth、external snapshot / projection、ref / candidate、forbidden body 分层 | 对象候选必须标 truth 类型；字段骨架不得吸收外部正文。 |
| 一致性 / 恢复 | immutable history、stable point、unknown fence、local truth first | state / flow / repository-port 轮廓必须保留版本 / correlation / gap 语义；物理事务未定。 |
| 通信方式 | 同步即时判断、异步事实送达、后台 continuation 分离 | 接口分类可展开为 Command / Query / Inbound Event / Outbound Event / Job 骨架；协议形态未定。 |
| 横切 / ADR | fail-closed、bounded、idempotency / ordering / correlation、body-free projection | 后续每个主要部分逐项承接 invariant / failure / redaction / trace 轮廓。 |

## 4. 尚未收稳的输入与概要挂起边界

| ID / 主题 | 当前状态 | 本概要可做 | 本概要不得做 | 阻塞范围 |
|---|---|---|---|---|
| `L2R-UP-001` Tools-Sandbox mapping / receipt / feedback / cleanup | open_upstream_contract | 命名 Runtime-owned action intent、submission attempt、gap、outcome incorporation seam | 定义 Sandbox run / receipt / cleanup schema，声明 execution success | 正向 Tool / Sandbox interface contract、positive flow |
| `L2R-UP-002` safe material producer / source / route / observed | open_integration_boundary | 定义 local material eligibility、submission attempt / gap、body-free projection | 声明 delivered / observed、固定 producer / route / topic | outbound event / observation 正向 schema |
| `L2R-UP-003` Core tools schema / SDK client candidate | upstream_contract_candidate | 仅引用 Core category / typed ref；SDK 作为下游 consumer | 本地 shadow Core type；反向依赖 SDK package | shared contract 定稿 |
| `L2R-UP-004` model adapter owner / physical route | owner_contract_pending | 定义 provider-neutral intent / result disposition port | provider endpoint、secret、quota / cost、failover schema | positive model adapter |
| `L2R-UP-005` durable memory owner | owner_boundary_pending | 定义 retrieval request / ref / candidate / availability port | durable body、index、retention / deletion、committed write | durable memory positive seam |
| `L2R-UP-006` Runtime-specific Core / Bus / Observability contracts | schema_and_route_pending | 定义 Runtime-local semantic candidates和 contract candidate 标记 | 冒充 Core / Bus / Observability authority，固定正式 event schema | public protocol / event route |
| `L2R-UP-007` Sandbox / Observability implementation readiness | implementation_readiness_absent | 设计 deterministic fake / adapter parity 和 blocked branch | 把 fake、目录或文档写成 real qualification | configuration activation、test / acceptance evidence |
| `L2R-UP-008` Method Library `03` 未提交输入 | uncommitted_upstream_input | 使用 current workspace formal content 的 ref / safe view 边界 | 声称 commit、hash 或 immutable baseline | 详细设计 immutable source 声明 |
| Checkpoint physical persistence | design_pending | 定义 stable checkpoint / repository port responsibility / commit-unknown state | 固定 DB、UoW、transaction / atomicity 实现或宣称 recovery ready | persistence / recovery qualification |
| Member / Product entry | downstream_boundary_pending | 定义 capability-level inbound command / query boundary | 固定产品 API、member container lifecycle 或 UI state | downstream public surface |

## 5. 专项上游 owner / consumer 传递

| 上游 / 相邻 owner | 已确认 owner truth | Runtime 概要 consumer / handoff 边界 | 不能进入 Runtime 对象候选池 |
|---|---|---|---|
| `L2-tools` | ToolDefinition、canonical invocation、normalized outcome / error、Tool audit | Action intent / result ref / incorporation port | Tool executor、ToolDefinition body、Tool audit record truth |
| `L3-capability-hub` | capability identity、registry、descriptor、formal exposure | capability ref / safe snapshot resolver | registry entry、adapter descriptor truth、external adapter registry |
| `L3-method-library` | method / role / process definition / version truth | definition ref / safe view | Method body、Role body、Process body |
| `L1-governance` | Decision、Approval、Policy effective、Control truth | formal result ref / precondition evaluator input | local allowlist、approval / policy aggregate truth |
| `L4-sandbox` | environment / run / capture / failure / cleanup / isolation truth | isolation requirement / submission / safe result ref seam | SandboxRun、Capture body、cleanup state truth |
| `L4-observability` | observed / audit projection、backend、retention | body-free material / correlation / submission gap | observed record / retention / backend projection truth |
| `L1-artifact` | Artifact / Evidence / report / lineage / verdict | typed ref / candidate / safe summary handoff | Artifact / Evidence / report body、acceptance verdict |
| `L0-core` | shared contract authority | compile candidate type categories | Runtime shadow shared types |
| `L0-bus` | event carrier / delivery collaboration | committed Runtime fact handoff / feedback ref | delivery receipt / broker / DLQ truth |
| `L0-sdk`、Member / Products | downstream wrapper / entry / consumer | Runtime inbound / safe query / outcome surface candidate | SDK implementation、member / product lifecycle state |

## 6. 历史概要设计污染诊断

| 旧 `02-概要设计.md` 口径 | 当前问题 | Step 1 处置 |
|---|---|---|
| Runtime 是“正式执行主脑仓”并以 `ExecutionInstance` 为唯一主真相 | 将 Work / Process / Artifact / member 的旧执行语义吸收到 Runtime，偏离当前 controlled-run / goal-plan / context / model / action / recovery 主线 | 全部 `historical_material`；不能作为对象输入，Step 5 / 6 必须从当前五核心语境重新发现主体。 |
| `ImplementationPlan -> current step -> promote child WorkItem` 是核心流程 | 复制 Artifact / Work / Process 的正式正文与协作升级语义，当前需求 / 架构未确认该主线 | 不进入范围；只保留 typed ref 与 runtime working plan，具体 downstream handoff pending。 |
| `process/work/conversation/member-service` 作为主要正向上下游 | 当前全局顺序与已确认上下文改为 Tools / Hub / Method / Governance / Sandbox / Artifact / Bus / Observability 和下游 consumer seam | 旧依赖图作污染审计，不作为接口 / flow 输入。 |
| 固定 ExecutionStep / PromoteRequest / ExecutionFeedback / ExecutionInstance 状态 | 对象、状态和协议在当前架构前提前定型，且可能串入外部 truth | 后续对象候选重新推导；任何同名候选都必须从当前 capability / owner 重新证明。 |
| 旧 Python / framework / member container / protocol 假设 | 无当前 authority，且语言仍未选择 | 不能作为 Step 4 code skeleton 或实现分层输入。 |
| 固定指标、测试结果或 readiness | 无 workload / implementation / evidence authority | 明确排除，不进入概要设计。 |

## 7. 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` | 五能力、核心 FR / BR、数据归属、能力级接口、NFR、验收否决和 `L2R-UP-001~008` | capability 到代码主体 / 对象 / interface / flow / state 的概要骨架与 blocker 分支。 |
| `projects/L2-runtime/01-架构设计.md` | 八架构单元、运行承载角色、依赖方向、data / consistency、interaction、mechanism、cross-cutting、evolution / ADR | 架构单元到主要组成部分和实现分层映射；Runtime-owned truth、ports、views、flows、states 的可实现轮廓。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局顺序与 compile / runtime / event 依赖裁剪 | 代码主体 / port / adapter / event 骨架的合法依赖分类。 |
| `projects/L2-tools/00~07` | Tool 行动合同、normalized outcome 与开放 Sandbox / Observability seam | Tools consumer port、action submission / feedback incorporation 的 local outline；positive contract 保持 blocked。 |
| Capability Hub / Method Library / Governance / Artifact 正式链 | capability / definition / decision / artifact owner truth | typed ref / safe snapshot / resolver / precondition / handoff boundary 轮廓。 |
| Sandbox / Observability 正式链 | isolation execution / observed truth 与开放正向接口 | adapter / event / fake seam、gap / unavailable / unknown 的负向轮廓。 |
| `L0-core` / `L0-bus` / `L0-sdk` 正式链 | Core contract authority、Bus carrier、SDK downstream boundary | Core compile candidate、Runtime event semantic candidate、下游 command / query surface；不固化未闭口 schema。 |
| `projects/L1-governance` / `projects/L1-artifact` 概要 / 详细设计 | owner / ref / projection / port / event 粒度参考 | 只参考可落码粒度，不复制它们的业务对象、协议或实现状态。 |

## 8. 本文不再回答

- 不再回答 Runtime 为什么存在、五能力是否属于 Runtime、系统上下文、限界上下文和方案路径。
- 不再回答 Tools、Hub、Method、Governance、Sandbox、Observability、Artifact、provider、durable memory、member / product 的 owner 归属。
- 不再决定只有 Core 可 compile、其他关系按 runtime / event / ref / adapter / fake seam 的依赖原则。
- 不再讨论 Runtime truth、external snapshot / projection、typed ref / candidate 和 forbidden body 的数据所有权。
- 不再讨论 immutable history、stable point、unknown fence、local-truth-first、fail-closed 和 body-free 是否成立。
- 不再用旧 ExecutionInstance / WorkItem / ImplementationPlan / promote 主线重定义当前需求或架构。
- 不在 02 中选择完整实现语言 / 框架 / DB / queue / protocol，除非后续 Step 从正式约束得到足够 authority；当前语言仍未选择。

## 9. 本文必须回答

- 八个架构语境如何映射为可由详细设计继续展开的业务主要组成部分与实现分层。
- 每个主要组成部分承担哪些 capability、包含哪些代码主体候选、与其他部分通过什么 local seam 协作。
- 哪些 Runtime-owned truth / state / policy / projection / reference / audit / history 候选需要成为关键对象，字段和函数骨架到什么程度。
- 哪些 Command / Query / Inbound Event / Outbound Event / Operations Job / port / adapter seam 需要形成概要接口骨架，并如何标记 contract candidate / pending。
- controlled run、context composition、model turn、Tool / sub-agent action、feedback incorporation、checkpoint / recovery 和 local outcome / handoff 的关键处理流轮廓。
- run、decision、action、child、checkpoint、recovery、projection / handoff 等状态集合、合法迁移、禁止迁移和 late / duplicate / unknown 传播。
- 异常、边界、配置影响和 fail-closed / degraded / gap 如何进入对象、接口、flow 和 state，而不变成外部 truth 或实现事实。
- 哪些内容必须交给 `03-详细设计.md`，以及在上游 seam 未闭口时详细设计必须保留哪些 blocker / 回退门禁。

## 10. 改动前后对比

| 维度 | 旧概要历史口径 | 当前 Step 1 输入边界 |
|---|---|---|
| 核心主语 | ExecutionInstance / current step / promote | controlled run + goal-plan / context-memory / model / action-delegation / checkpoint-recovery-handoff |
| 上下游 | Work / Process / Conversation / member-service 主链 | Tools / Hub / Method / Governance / Sandbox / Artifact / Bus / Observability + downstream consumers |
| 执行关系 | Runtime 似乎拥有正式执行与协作升级 | Runtime 拥有 choice / orchestration / incorporation，不拥有 Tools / Sandbox / Work truth |
| 数据 | 旧固定对象与状态 | 先按 truth / snapshot / ref / candidate / forbidden body 判断候选 |
| 技术 | 隐含 Python / member container / protocol | 语言、框架、部署、协议均未选择，不作为输入 |
| readiness | 历史正文近似正向设计事实 | `L2R-UP-001~008` 明确限制正向对象 / interface / flow / config / test / acceptance |

## 11. 设计取舍与复杂度判断

采用“稳定 semantic boundary 作为概要输入，开放 owner contract 作为 port / adapter / blocked seam”的下沉方式，而不采用“等全部上游正向合同闭口后再做 02”或“由 Runtime 先本地补 schema”两种极端。前者会无必要阻塞 local Runtime truth / state / flow 的设计，后者会形成 shadow authority 并伪造 readiness。

概要 Step 4~9 预计属于重 Step：八个架构语境需要重新裁剪为业务主要组成部分，且对象 / interface / flow / state 数量较多。后续必须遵循主要组成部分小循环；必要时仅在当前 Step 到达后创建按部分附录，正式 02 只汇总，不能提前批量生成附录或用一张全仓大表压平所有主语。

## 12. 正式回填草稿

正式第 1 章应使用第 7 节上游关系映射表，并回填第 8、9 节的“本文不再回答 / 必须回答”清单。正式正文只说明已确认需求 / 架构如何继续向代码主体、对象、接口、处理流和状态下沉；第 4~6 节的诊断、开放项细节和取舍继续留在 calibration。第 2 章的目标与范围必须等待 Step 2 收口，第 3 章的硬约束必须等待 Step 3 收口。

## 13. 待确认与 blocker

| 项目 | 状态 | 本 Step 处理 |
|---|---|---|
| `L2R-UP-001~008` | pending / blocked / fail-closed | 逐项限制正向对象 / interface / flow / schema / readiness，不阻塞 local semantic outline。 |
| Checkpoint physical persistence / transaction | design_pending | 后续只允许 repository port / stable-point / commit-unknown 轮廓，详细实现后置。 |
| Member / Product entry | downstream_boundary_pending | 只允许 capability-level inbound / query candidate，不固定产品 API。 |
| 实现语言 / 框架 | not_selected | 不能从旧 Python / Rust、Core Rust 或 SDK 多语言反推 Runtime 语言。 |
| `L3-method-library/03-详细设计.md` | current_workspace_uncommitted | 只消费 current formal content，不声称 immutable source。 |

## 14. 自检与门禁

| 检查 | 结果 |
|---|---|
| 已明确承接哪些需求与架构结论 | pass |
| 已区分稳定输入与 pending / blocked seam | pass |
| 已形成上游关系映射表 | pass |
| 已形成“本文不再回答 / 必须回答”清单 | pass |
| 未展开代码主体、对象字段、接口、流程或状态机 | pass |
| 旧 ExecutionInstance / WorkItem / promote 主线仅作 historical_material | pass |
| 未选择语言 / 框架或伪造 schema / readiness | pass |
| 正式旧 `02-概要设计.md` 未修改，Step 2 文件未创建 | pass |

```text
gate_status = pass
document_status = done_stop_review_step_01
next_allowed_action = await_user_confirmation_for_02_hld_step_01
formal_02_write_allowed = false
future_step_files_allowed = false_until_user_confirmation
next_formal_document_allowed = false_until_step_14
commit_required = false
```
