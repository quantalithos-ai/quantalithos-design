# L2-runtime 01 架构 Step 3: 职责边界

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 4 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | `01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md`、`00-需求文档.md`、架构职责边界 SOP / 书写规范、上游正式职责章节 |
| 目标 | 收稳 Runtime 的做 / 不做 / 易混淆职责和边界红线 |
| 允许 | 以职责归属说明 Runtime 负责的运行语义和不负责的外部 truth |
| 禁止 | 重画系统上下文图、划分限界上下文、展开数据所有权矩阵、协议接口、容器部署或实现机制 |
| 用户门禁 | 用户明确同意进入 Step 3；本 Step 完成后立即停审，不自动进入 Step 4 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 职责问题回答与范围收束 | done | Step 3 SOP 问题回答 | pass |
| 旧 Runtime 职责污染诊断 | done | historical_material 差异表 | pass |
| 做 / 不做职责表 | done | `RDO-L2R-001~026` | pass |
| 易混淆职责表 | done | `RDO-L2R-022~026` | pass |
| 边界红线 | done | `RBR-L2R-001~014` | pass |
| 上游 owner 对照与依赖裁剪 | done | owner / consumer / handoff 口径 | pass |
| 复杂度与可落码性判断 | done | 责任决策缺口和后续输入门禁 | pass |
| 回填草稿与自检 | done_stop_review | 第 4 章候选与确认门禁 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓具体做什么？ | Runtime 负责一次受控运行的连续语义：受控 run 与 goal / plan 工作态、context / memory mediation、provider-neutral model decision、Tool / sub-agent action orchestration、checkpoint / resume / reflection / recovery、local outcome 和 safe handoff attempt / gap。 |
| 这个仓具体不做什么？ | Runtime 不拥有工具执行、能力注册和 adapter descriptor、method / role / process 定义正文、Governance approval / policy truth、Sandbox isolation execution、Observability backend、Artifact / Evidence 正文、provider secret / physical route / quota / cost、member-service / image / marketplace / product lifecycle。 |
| 哪些能力看起来相关但必须属于其他仓？ | Tools 的 canonical execution / normalized outcome 属 `L2-tools`；capability identity / registry / exposure 属 `L3-capability-hub`；定义正文属 `L3-method-library`；正式裁决属 `L1-governance`；隔离执行属 `L4-sandbox`；观察投影属 `L4-observability`；制品和证据正文属 `L1-artifact`。 |
| 哪些行为绝不能隐式发生？ | 不得把 action choice 当作 executed / approved / isolated；不得把 snapshot / candidate / summary 当 source truth；不得以下游 delivery / observed / accepted 覆盖 local outcome；不得在 unknown side effect、commit unknown 或迟到反馈时盲重试、重复副作用或逆写历史；不得保存 forbidden body、secret 或 hidden reasoning。 |
| 哪些边界若不写清最容易串线？ | Runtime orchestration 与 Tools execution、logical model selection 与 provider route、goal / plan working state 与 Work / Process / Artifact truth、sub-agent delegation 与 member / container lifecycle、checkpoint / recovery 与外部 truth repair、local handoff attempt 与 Bus delivery / Observability observed。 |

## 3. 上游 owner 对照

| 上游 / 相邻 owner | 该 owner 正式拥有 | Runtime 可做的职责 | Runtime 不得做的职责 |
|---|---|---|---|
| `L2-tools` | Tool identity / definition、canonical invocation、normalized outcome / error、Tool-domain audit | 选择是否发起 Tool action，提交合同内的编排意图，消费安全 outcome ref / summary，决定是否纳入当前 run | 不执行工具、不复制 ToolDefinition / normalized outcome、不解释 capture 为 Tool outcome、不接管 Tool audit |
| `L3-capability-hub` | capability identity、registry、adapter descriptor、formal exposure、变化影响 | 读取能力候选、identity / exposure ref 或安全摘要，基于可验证输入形成逻辑 decision | 不建 registry / allowlist，不保存 descriptor / provider truth，不把 visibility 当 authorization |
| `L3-method-library` | method / role / process 定义及正式版本语义 | 消费 definition ref / safe view，将定义约束纳入 context / plan working state | 不保存 method body / source，不定义运行实例，不把过程正文写入 checkpoint |
| `L1-governance` | Decision、Approval / responsibility、Policy effective、shared rules、Control truth | 请求或消费适用的正式结论，缺失 / 冲突 / stale / unknown 时拒绝或等待 | 不维护 local policy cache / allowlist，不生成 approval，不将执行状态升级为治理裁决 |
| `L4-sandbox` | isolation execution、environment / run、capture、failure、cleanup、隔离 handoff | 判断 action 是否需要隔离，提交正式 sandbox handoff，消费安全 failure / capture ref 并保持未知语义 | 不 host fallback，不创建 / 清理隔离环境，不伪造 receipt / execution success，不拥有 capture body |
| `L4-observability` | observation / audit projection、safe signal、observed truth、retention marker | 生成可交接的 body-free material eligibility、local attempt / gap 和 correlation | 不写观察 backend，不把 observed 当 local outcome，不维护 retention / projection truth |
| `L1-artifact` | Artifact / Evidence / report / lineage / baseline truth | 消费 goal / plan / output / evidence refs 或安全摘要，形成 handoff relation | 不保存正文、版本、血缘或正式验收 verdict，不把 Runtime outcome 变成 Artifact fact |
| `L0-core` / `L0-bus` / `L0-sdk` | Core shared contract authority；Bus event carrier；SDK downstream client boundary | 使用 Core 类别，交接已提交 safe fact，暴露下游可消费 seam | 不本地 shadow Core；不管理 Bus delivery truth；不反向依赖 SDK package |

## 4. 历史职责污染诊断

| 历史口径 | 职责层问题 | 当前处置 |
|---|---|---|
| “Runtime 是 member 容器内的大脑进程” | 把逻辑运行 owner 绑定到 member host，隐含接管 member-service 生命周期和宿主部署。 | `historical_material`；Runtime 只承担逻辑 run / decision / recovery 语义，部署关系后续单独校准。 |
| “LLM loop / prompt composer / memory / tool invoker / checkpoint / sub-agent”作为固定做什么清单 | 把旧模块和技术载体直接当职责，未区分 Tool / provider / memory 外部 truth。 | 以五能力闭环重新表述职责；保留 context / memory mediation、action orchestration、checkpoint / recovery 等语义，不继承模块实现。 |
| Policy Cache 与 capability-hub 直连 | 把治理生效事实和能力目录事实误并为 Runtime 内部职责。 | 降级为消费正式结果 / ref 的协调职责；不得本地缓存成 truth。 |
| Tool Invoker 负责 schema、policy、guardrails 和执行 | 将 action choice、authorization、Tool contract 和 execution 混为一个组件职责。 | 分层为 Runtime action choice；Tools contract / outcome；Governance decision；Sandbox execution；缺口 fail closed。 |
| ExecutionPlan / WorkItem promote / Process backflow | 将 Work / Process / Artifact 正文和正式业务状态吸进 Runtime。 | 仅承接 goal / plan working state 和外部 refs；正式业务状态继续由相邻 owner 保有。 |
| ReasoningTrace 完整正文持久化并供 Observability 查询 | 把 hidden reasoning、provider raw body 和观测后端误归 Runtime 职责。 | 仅保留安全 decision summary、reason category、source / correlation 和可交接 safe material。 |
| member IPC、SDK compile、同容器双进程 | 在职责尚未稳定时用通信 / 部署安排定义 owner。 | `historical_material`；入口、部署和通信分别后移到 Step 4 / 6 / 9。 |

## 5. 结构化中间产物

### 5.1 职责边界表

| 职责 ID | 职责项 | 类型 | 说明 |
|---|---|---|---|
| `RDO-L2R-001` | Controlled run 与 loop 运行语义承载 | 做 | Runtime 必须对一次运行当前为何继续、等待、暂停、取消、完成、失败或 unknown 负责。 |
| `RDO-L2R-002` | Goal / plan working state 与推进决定承载 | 做 | Runtime 解释运行中的目标分解和计划推进，但不拥有外部正式业务计划正文。 |
| `RDO-L2R-003` | Context composition 与 source mediation 承载 | 做 | Runtime 负责本次决策采用哪些可验证来源、如何裁剪和如何表达缺口。 |
| `RDO-L2R-004` | Working memory 与检索 / 候选使用语义承载 | 做 | Runtime 负责短期工作语境及外部记忆候选的使用判断，不拥有 durable body。 |
| `RDO-L2R-005` | Provider-neutral model intent / logical selection 承载 | 做 | Runtime 负责逻辑模型意图和选择决定，不负责物理 provider control。 |
| `RDO-L2R-006` | Model turn disposition 与安全决策摘要承载 | 做 | Runtime 区分结果、拒绝、超时、不可用和 unknown，并只保留安全可关联摘要。 |
| `RDO-L2R-007` | Action choice 与 action incorporation 承载 | 做 | Runtime 负责 no-action、wait、Tool、sub-agent、reject 等选择及结果是否足以推进的判断。 |
| `RDO-L2R-008` | Tool invocation / sub-agent delegation orchestration 承载 | 做 | Runtime 负责正式 seam 上的编排、scope / budget 和父子结果关联，不执行外部动作。 |
| `RDO-L2R-009` | Checkpoint / stable point / resume 语义承载 | 做 | Runtime 负责可恢复边界和最小恢复语境，不保存 forbidden body。 |
| `RDO-L2R-010` | Reflection / recovery 新决定承载 | 做 | Runtime 基于已提交历史形成新决定，不原地修复外部 truth 或抹除历史。 |
| `RDO-L2R-011` | Runtime local outcome 承载 | 做 | Runtime 是本地运行结果和终态语义的唯一 owner，外部 accepted 不替代它。 |
| `RDO-L2R-012` | Safe handoff eligibility、submission attempt / gap 承载 | 做 | Runtime 负责能否交接、是否尝试及本地缺口，不声明 delivery / observed / acceptance。 |
| `RDO-L2R-013` | Tools execution、ToolDefinition、normalized outcome / Tool audit truth | 不做 | 这些职责由 `L2-tools` 拥有，Runtime 只消费正式合同和安全结果。 |
| `RDO-L2R-014` | Capability identity、registry、descriptor、formal exposure truth | 不做 | 这些职责由 `L3-capability-hub` 拥有，Runtime 不复制目录或 adapter truth。 |
| `RDO-L2R-015` | Method / Role / Process definition body 与正式业务过程 truth | 不做 | 定义和正式过程属于 `L3-method-library` 及相应业务 owner。 |
| `RDO-L2R-016` | Governance Decision、Approval、Policy effective、authorization truth | 不做 | 治理正式裁决由 `L1-governance` 拥有，Runtime 只能消费结果。 |
| `RDO-L2R-017` | Sandbox environment / run / capture / cleanup / isolation truth | 不做 | 隔离执行由 `L4-sandbox` 拥有，Runtime 只能提交和消费受控 seam。 |
| `RDO-L2R-018` | Observability backend、observed projection、retention truth | 不做 | 观察与审计投影由 `L4-observability` 拥有，Runtime 只交接安全材料。 |
| `RDO-L2R-019` | Artifact / Evidence / report 正文、lineage 和正式验收 verdict | 不做 | 制品、证据和验收正文不属于 Runtime truth。 |
| `RDO-L2R-020` | Provider secret / route / quota / cost / billing / failover control | 不做 | Runtime 只拥有 provider-neutral decision，物理控制属于外部 adapter / provider owner。 |
| `RDO-L2R-021` | Member-service、member-images、marketplace、产品入口和 UI 生命周期 | 不做 | 宿主、构建、生态和入口不因 Runtime 编排而转移职责。 |
| `RDO-L2R-022` | Tool action choice 与 Tool execution | 易混淆职责 | Runtime 选择和编排 action，`L2-tools` 承载工具合同与结果，二者不得合并。 |
| `RDO-L2R-023` | Model logical selection 与 provider physical routing | 易混淆职责 | Runtime 的 selection 不等于 route / secret / quota / cost 或 provider failover。 |
| `RDO-L2R-024` | Goal / plan working state 与 Work / Process / Artifact truth | 易混淆职责 | Runtime 可维护运行工作态，但不能生成正式业务计划、工作项或制品正文。 |
| `RDO-L2R-025` | Sub-agent delegation 与 member / container / image lifecycle | 易混淆职责 | Runtime 只拥有父子运行关联、scope、budget 和 incorporation，不拥有宿主生命周期。 |
| `RDO-L2R-026` | Local handoff attempt 与 delivery / observed / downstream acceptance | 易混淆职责 | Runtime 的准备 / 尝试 / gap 不等于 Bus 已送达、Observability 已观察或下游已接受。 |

### 5.2 做 / 不做 / 易混淆清单

| 类型 | 清单 |
|---|---|
| 做 | controlled run；goal / plan working state；context / memory mediation；working memory；provider-neutral model intent / selection；turn disposition；action choice；Tool / sub-agent orchestration；checkpoint / resume；reflection / recovery；Runtime local outcome；safe handoff eligibility、attempt / gap。 |
| 不做 | Tools execution / Tool truth；capability registry / descriptor；method body；Governance approval / policy truth；Sandbox isolation truth；Observability backend / observed truth；Artifact / Evidence body；provider control；member host / image / marketplace / product lifecycle。 |
| 易混淆职责 | action choice vs execution；logical selection vs physical route；working plan vs Work / Process / Artifact truth；delegation vs host lifecycle；checkpoint / recovery vs external repair；handoff attempt vs delivery / observed / acceptance。 |

### 5.3 边界红线清单

| 红线 ID | 红线 | 违反时的边界后果 |
|---|---|---|
| `RBR-L2R-001` | 不得让入口、member host、Tools、下游产品或 SDK 成为第二个 Runtime run / outcome truth owner。 | 运行状态、恢复位置和终态语义分叉。 |
| `RBR-L2R-002` | 不得因 Runtime 编排而接管 Tools、Hub、Method、Governance、Sandbox、Observability 或 Artifact 的正式 truth。 | consumer / coordinator 关系被错误升级为 owner 关系。 |
| `RBR-L2R-003` | 不得把 action choice 写成工具已执行、治理已批准、Sandbox 已隔离或下游已接受。 | 受理、授权、执行、观察和接受状态被压平。 |
| `RBR-L2R-004` | 不得把 provider-neutral model selection 写成 physical route、secret、quota、cost 或 billing 决定。 | Runtime 越过 provider / security / finance owner。 |
| `RBR-L2R-005` | 不得把 goal / plan working state 写成 Work、Process、Method、Artifact 或 ImplementationPlan 正式正文。 | 运行工作态反向成为业务 truth。 |
| `RBR-L2R-006` | 不得让 sub-agent delegation 隐式创建、控制或拥有成员、容器、镜像或 Sandbox 生命周期。 | 运行编排侵入宿主与隔离职责。 |
| `RBR-L2R-007` | 不得在缺失、冲突、stale 或 unknown 的 Governance / capability / Tools / Sandbox 前置下 host fallback 或自我授权。 | 正向路径 fail-open，越过正式 owner。 |
| `RBR-L2R-008` | 不得在 commit unknown、side-effect unknown、late、duplicate 或 out-of-order feedback 下盲重试、重复副作用或逆写历史。 | 产生不可归责的重复行为或历史污染。 |
| `RBR-L2R-009` | 不得将 external delivery、receipt、observed、report、summary 或 acceptance 反写 Runtime local outcome。 | 外部交接失败会错误改变本地事实。 |
| `RBR-L2R-010` | 不得把 method / policy / tool / sandbox / artifact / evidence / durable memory 正文、secret 或 hidden reasoning 保存于 Runtime truth、checkpoint 或 handoff。 | forbidden body 泄漏并复制相邻正文真相。 |
| `RBR-L2R-011` | 不得把 Observability backend、Bus delivery 主干、SDK client 或产品入口写成 Runtime 编译期职责。 | 依赖方向倒置并形成 sibling package 耦合。 |
| `RBR-L2R-012` | 不得从字符串、display text、私有索引或未验证 summary 猜测 source owner、scope、authorization 或 capability identity。 | source anchoring 失效，运行决定不可解释。 |
| `RBR-L2R-013` | 不得以 fake、目录、静态设计或旧文档伪造 Tools / Sandbox / model / memory / Observability readiness。 | pending seam 被错误标记为正向实现事实。 |
| `RBR-L2R-014` | 不得用旧的“大脑进程”、固定模块、Policy Cache、ExecutionPlan、ReasoningTrace 或性能指标重新定义当前职责。 | full-restart 边界被历史材料打穿。 |

## 6. 设计取舍与责任决策

| 取舍 | 当前口径 | 代价 / 保护 |
|---|---|---|
| 以“运行语义”而不是“进程 / 模块”定义 Runtime 职责 | 当前职责只绑定 run、decision、action、recovery 和 handoff 语义；进程、容器和语言留到后续 Step。 | 牺牲早期部署确定性，换取逻辑 owner 不随部署改变。 |
| 以协调责任承接相邻执行结果 | Runtime 负责选择、提交、等待和 incorporation，不承担 Tools / Sandbox / provider 的执行细节。 | 需要显式区分多个状态和 pending seam，保护 owner separation。 |
| 以 working state 承接 goal / plan | Runtime 只维护运行中的工作态和推进决定，不复制正式 Work / Process / Artifact 正文。 | 运行内计划视图可能不具备业务正式性，但避免跨仓反向写真相。 |
| 以安全摘要 / ref 承接外部事实 | Runtime 只消费最小、可关联、带来源的材料，不保存外部正文。 | 调查时可能只能看到缺口或摘要，换取 body-free 和最小暴露。 |
| 以 local attempt / gap 承接交接 | 当前不把 delivery、observed、accepted 纳入 Runtime 责任；正向 route 未闭口时保持 pending / blocked。 | 不能声称端到端交付 ready，但本地 outcome 不被外部失败污染。 |

## 7. 复杂度与可落码性判断

### 7.1 复杂度来源

| 复杂度来源 | 责任表现 | 后续设计输入 |
|---|---|---|
| 多个正式 truth owner | 一个 Runtime run 同时消费定义、治理、能力、工具、隔离、制品和观测材料。 | Step 4 必须清楚画出输入 / 输出面；后续每条边都标明 owner、consumer 和 handoff。 |
| 编排与执行分离 | Runtime 选择行动但不执行行动，结果还需区分 accepted / executed / outcome / observed。 | Step 7~9 必须保持依赖类型、交互语义和失败分层，不得把 adapter 当 package。 |
| 运行工作态与正式业务态并存 | goal / plan working state 需要连续推进，但 Work / Process / Artifact 仍是外部正式 truth。 | Step 5 / 8 必须分别收敛限界上下文与 truth / snapshot / ref。 |
| 父子运行边界 | sub-agent 需要 scope / budget / context isolation，却不能拥有 host lifecycle。 | Step 5 / 6 / 9 必须保持逻辑 delegation 与部署 / 执行边界分离。 |
| 本地真相与交接状态分离 | handoff attempt / gap 既要可追溯，又不能声明 delivery / observed / accepted。 | Step 4 / 8 / 9 需要保留单向交接和独立失败。 |

### 7.2 可落码最小条件

```text
每一项 Runtime 职责必须具备:
  owner = Runtime 或明确外部 owner
  consumer = 可识别的运行语境或下游 seam
  source = typed ref / safe snapshot / 本地历史
  failure = reject / wait / blocked / unavailable / gap / fail-closed
  correlation = 可回链 run / turn / decision / action / handoff

当前仍未闭口:
  Tools -> Sandbox mapping、model adapter、durable memory、event route、Core runtime schema
```

以上条件仅说明职责要能落到后续架构和实现边界，不定义字段、协议、事务、handler、repository 或实施状态。

## 8. 正反例审计

| 主题 | 可接受表达 | 不可接受表达 | 原因 |
|---|---|---|---|
| 做 | “承载 Runtime local outcome” | “提供查询 outcome API” | 前者是职责归属，后者是接口 / 功能层。 |
| 不做 | “不拥有 Sandbox execution truth” | “通过 Sandbox adapter 执行命令” | 后者进入交互和实现方案，且越过 Sandbox owner。 |
| 易混淆 | “logical model selection 与 physical route 分层” | “Runtime 使用某 provider 并负责 failover” | 后者吞并 provider control。 |
| 红线 | “delivery / observed 不反写 local outcome” | “Bus ack 后标记 Runtime completed” | 后者把外部交付替代本地 truth。 |
| 旧材料 | “大脑进程、Policy Cache、ReasoningTrace 为 historical material” | “保留旧模块名作为当前职责” | 旧模块名会把部署、治理和隐藏推理重新引入主线。 |

## 9. 回填草稿

### 9.1 正式第 4 章“职责边界”候选

正式正文应引用本文件并回填 `RDO-L2R-001~026` 的职责边界表，按 `做 / 不做 / 易混淆职责` 三类呈现；同时回填 `RBR-L2R-001~014` 的边界红线。职责说明只保留归属判断，不新增上下文图、数据矩阵、接口、容器或实现机制。

### 9.2 与前两章的承接

第 2 章的架构目标通过 `RDO-L2R-001~012` 落为 Runtime 的正式责任；第 3 章的 owner separation、fail-closed、unknown fence、body-free、local truth first 和 pending preservation 通过 `RBR-L2R-001~014` 作为职责红线持续约束。Step 3 不新增未在 Step 1 / 2 或上游正式职责文档中出现的 owner。

## 10. 待确认与 blocker

| 项目 | 状态 | 本 Step 处理 |
|---|---|---|
| `L2-tools` 到 Sandbox 的正向 mapping / receipt / feedback | pending / blocker | Runtime 只保留编排和 handoff seam，不声明执行职责或 ready。 |
| model provider adapter owner / route / secret / quota / cost | pending / blocker | Runtime 只保留 logical selection 职责，不接管物理控制。 |
| durable episodic / semantic memory owner | pending / blocker | Runtime 只拥有 working / mediation / candidate 语义，不拥有长期正文。 |
| Runtime-specific Core / Bus / Observability contracts | pending / blocker | 当前只固定职责类别和 owner，不本地伪造 schema / route。 |
| `L3-method-library/03-详细设计.md` 未提交改动 | current workspace dirty | 只引用当前正式内容，不声称 immutable baseline。 |

## 11. 自检与门禁

| 检查 | 结果 |
|---|---|
| 已回答做什么、不做什么、易混淆职责和隐式行为红线 | pass |
| 正式职责类型仅使用做 / 不做 / 易混淆职责 | pass |
| 未把系统上下文、子域、容器、数据矩阵、接口或实现机制混入职责表 | pass |
| `L2-tools`、Hub、Method、Governance、Sandbox、Observability、Artifact、Core / Bus / SDK owner 边界已对照 | pass |
| 旧“大脑进程”、Policy Cache、Tool Invoker、ExecutionPlan、ReasoningTrace 已降级为 historical_material | pass |
| `L2R-UP-001~008` 继续保持 pending / blocked / fail-closed | pass |
| 未伪造 execution、delivery、observed、acceptance、evidence、readiness 或签署 | pass |
| Step 4 文件未创建，正式 `01-架构设计.md` 未修改 | pass |

```text
gate_status = pass
document_status = done_stop_review_step_03
next_allowed_action = await_user_confirmation_for_01_arch_step_03
formal_document_write_allowed = false
future_step_files_allowed = false_until_user_confirmation
next_formal_document_allowed = false_until_step_16
commit_required = false
```
