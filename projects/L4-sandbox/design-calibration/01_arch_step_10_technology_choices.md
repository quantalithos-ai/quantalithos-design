# Step 10. 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 回填章节: `01-架构设计.md` §11 关键技术选型
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 10 | pass。用户已确认 Step 9 `关键交互与通信方式`,可进入 Step 10。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_06_container_deployment.md`、`01_arch_step_07_dependency_direction.md`、`01_arch_step_08_data_ownership_consistency.md` 和 `01_arch_step_09_interactions_communication.md`。 |
| 是否已读取架构 SOP Step 10 与书写规范 §4.11 | pass。已读取关键技术机制、采用理由、代价 / 约束、不采用口径和禁写范围。 |
| 是否已读取通用标准 | pass。已读取设计文档编写通则、中间产物规范、真相源闭环与可落码性标准、全局项目依赖关系与裁剪规则。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 §12 接口依赖、§13 非功能、§14 验收和 §15 风险。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_10_technology_choices.md` 和 `projects/L1-governance/design-calibration/01_arch_step_10_technology_choices.md` 的机制级组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §9 / §11 / §12 / §14 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_10_technology_choices.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 当前架构主线中哪些技术机制、架构手段或治理手段已经上升为架构层决定,并分别说明它们解决什么结构性问题、为什么当前值得采用、会带来什么代价 / 约束,以及为什么它们不是局部实现细节。

本步不写技术栈清单、产品名定稿、框架名、数据库产品、消息产品、对象存储、日志 / trace 后端、secrets 系统、具体 isolation backend 组合、API / RPC / SDK 形态、event / topic / outbox / retry 机制、DTO / schema、状态机、配置 key、部署参数、P95 / SLA 硬指标、测试用例或 commit boundary。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 承接受控执行隔离事实、coherent boundary、fail-closed、capture / handoff、cleanup / redline 和统一语义目标。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 和材料交接边界。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 承接核心语义、编排 / 承接、外部接缝、本地影子 / 派生辅助、技术承载和跨仓依赖裁剪。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 承接 execution isolation truth、快照 / 投影、引用、禁止正文和一致性口径。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 承接同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接三类通信方式和失败语义。 |
| `projects/L4-sandbox/00-需求文档.md` §12~§15 | 当前正式需求基线 | 校验接口依赖、NFR、验收、一票否决、风险和待确认项是否被机制级选型承接。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断 Docker + gVisor、Rust、RPC、audit events、seccomp / AppArmor、旧性能目标是否污染本步。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §9 / §11 / §12 / §14 | historical material | 诊断旧 `统一 SandboxService`、backend adapters、deny-by-default network gate、backend fallback、allowlist、audit sink、P95 和上线策略是否可继承。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 2 / 6 / 7 / 8 / 9、正式 00、SOP Step 10 和书写规范 §4.11 | done | 本文件 §1、§3 |
| 读取旧 README / 旧 `01` 技术选型段和 L1 同类 Step 10 示例 | done | 本文件 §3、§6 |
| 回答当前采用机制、解决问题、为什么不用其他方案、代价和暂不引入口径 | done | 本文件 §5 |
| 诊断旧技术清单、后端产品、协议、事件、fallback、安全手段和指标污染 | done | 本文件 §6 |
| 输出关键技术机制表、当前不采用口径表、按架构单元选型停审、简化对照表和技术边界说明 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 10 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 当前采用哪些关键架构机制?

当前正式采用的是机制级架构选择,不是产品或实现清单:

1. 通过正式承接边界隔离外部执行请求与 Sandbox 核心语义。
2. 采用 execution environment identity 与责任链绑定机制。
3. 采用统一边界限制语义与 coherent boundary 裁定机制。
4. 采用抽象 isolation backend 承载契约与能力摘要裁定机制。
5. 采用给定 launch / isolation policy 下的执行裁定与 fail-closed 机制。
6. 采用 execution isolation truth / external ref / body-free summary / derived material separation。
7. 采用核心强一致 + 外围最终一致 + 引用有效性 + guard / containment 优先的一致性机制。
8. 采用同步受理 / 裁定 / 读取、异步事实传播 / 外部结果送达、后台执行生命周期 / cleanup / reaper 分离机制。
9. 采用 capture fact、candidate material 和 handoff fact 分层交接机制。
10. 采用稳定 failure classification 与 control fact 收束机制。
11. 采用 lease / orphan / cleanup guard / reaper 正式后台维护机制。
12. 采用 redline containment 与 investigation handoff 机制。
13. 采用幂等、顺序保护、correlation / traceability / audit backref 机制。
14. 采用只读本地影子 / 派生辅助机制承接 backend capability、workspace source、inspect、preview、trend 和对账。
15. 具体语言、后端产品、协议、数据库、消息、对象存储、安全配置项、outbox、worker 和性能数字暂不作为架构硬选型。

### 5.2 每个机制解决什么问题?

这些机制分别解决外部调用方直接打穿 sandbox 核心、真实执行缺少归责身份、resource / filesystem / network / process 边界在后端或调用方处 silent degrade、policy 来源被 sandbox 反向拥有、下游 artifact / observability / runtime / runner 反写真相、长时执行被伪同步完成、capture 与 handoff 混为下游 truth、timeout / deny / kill / cleanup / orphan / redline 无法统一分类、cleanup 先删证据、孤儿环境托管外继续运行、重复 control / handoff / bus 信号产生第二套正式语义、inspect / preview / trend 反写真相,以及旧技术假设污染新版架构等结构性问题。

### 5.3 为什么不用其他方案?

不采用“直接定稿 Docker + gVisor / Firecracker / local_process 产品组合”,因为后端产品不能反向定义 coherent boundary,且 `local_process` 或弱隔离路径误升格会直接违反宿主直跑红线。

不采用“统一 SandboxService RPC / SDK 作为当前架构选型”,因为 Step 9 已经只收敛通信方式类别,协议和 SDK 外形应留到后续概要 / 详细设计。

不采用“capability-hub allowlist lookup / policy DSL 作为 sandbox 技术主线”,因为 sandbox 只执行给定 policy / authorization,不拥有 allowlist、approval、capability 或 policy definition truth。

不采用“audit event / observability sink / bus event 作为 truth store”,因为 observability 和 bus 只能消费或传播已成立 material,不能替代 truth / material 状态承载。

不采用“backend fallback 作为可用性主策略”,因为 fallback 若不能证明同等边界可落实,会形成 silent degrade、弱隔离或宿主直跑。

不采用“seccomp / AppArmor / cap drop / profile / network drop-all 等具体安全配置项作为本步硬选型”,因为这些是重要候选手段,但配置与后端细节应在后续技术 / 配置 / 测试 / 实施阶段按正式后端组合闭口。

### 5.4 每个选型带来什么代价或新风险?

这些机制共同带来的代价是:边界层更多、状态表达更严格、同步裁定不能伪成功、后台维护必须成为正式主线、capture / handoff / cleanup / redline 状态需要显式表达、外部引用和摘要需要 stale / unresolved / pending / unavailable 口径、下游消费失败不能由观测或事件流兜底、后续概要 / 详细设计需要把机制落到对象、状态、port、协议和测试切口。

它们降低了宿主直跑、边界静默放宽、policy truth 反向入仓、下游 truth 污染、证据先删和多套执行语义的风险,但提高了设计和实现对状态、幂等、追溯、后台维护和安全交接的闭环要求。

### 5.5 哪些选型是当前阶段必要的,哪些暂不引入?

| 类别 | 当前口径 |
|---|---|
| 当前阶段必要 | 正式承接边界、execution environment identity、统一边界限制语义、抽象 backend 承载契约、policy fail-closed、truth / ref / summary / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、capture / handoff 分层、failure / control 分类、cleanup guard / reaper、redline containment、幂等顺序保护、traceability / handoff backref、只读派生辅助。 |
| 当前阶段暂不硬化 | Rust / 框架 / crate 组织、Docker / gVisor / Firecracker / k8s / local_process 组合、RPC / SDK / API 外形、event / topic / outbox / backlog / retry、数据库 / 对象存储 / 缓存 / OTel / secrets / GRC 产品、seccomp / AppArmor / cap drop profile 细节、网络 allowlist 粒度、旧 P95 / SLA / 容量数字、上线灰度和回滚策略。 |

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 / 关键依赖 | 写至少 Docker + gVisor,并列 containerd、Firecracker、runc。 | 把后端产品组合提前当成架构硬选型。 | 改为抽象 isolation backend 承载契约 + capability summary + fail-closed 裁定机制。 |
| 技术栈 | 写 Rust。 | 语言栈是实现约束候选,不是本步机制级选型。 | 暂不作为架构硬选型;后续 `03/07` 结合代码仓边界闭口。 |
| 核心职责 | 写默认无出网、白名单出网必须 Policy 授权。 | 安全方向有效,但 allowlist 粒度和 policy 来源不能由 sandbox 拥有。 | 改为给定 policy 下的执行裁定与高风险边界 fail-closed 机制。 |
| 审计事件 | 写 `SandboxInvoked / SandboxExited / SandboxEscapeDetected`。 | 事件名和事件目录提前定稿,且容易把事件流当 truth。 | 改为 material fact、handoff fact 和 observability / bus 交接机制。 |
| 目录结构 | 写 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 代码目录和接口外形不是架构机制。 | 不继承。 |
| 安全基线 | 写 seccomp、AppArmor、只读挂载、cap drop、drop all。 | 可作为后续配置 / 测试候选,但需要随正式后端组合闭口。 | 本步只保留 boundary 可落实性裁定和 security redline 机制。 |
| 性能目标 | 写启动 / 销毁 / 出网检查时延。 | 缺当前负载模型和验证依据。 | 保留为候选 SLO,不作为本步硬选型。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| `统一 SandboxService + Docker/gVisor adapters + Policy-aware network gate` | 同时混入协议外形、后端产品、adapter 组织和 policy 实现。 | 拆为正式承接边界、抽象 backend 承载契约、policy fail-closed 和边界裁定机制。 |
| Docker + gVisor 双后端 | 直接硬化产品组合,且没有说明同等边界、能力摘要和失败口径。 | 不继承为当前硬选型;后续技术 / 配置 / 实施再裁剪。 |
| deny-by-default 网络策略 | 方向有效,但旧文档把 allowlist lookup 和 policy 来源固定化。 | 改为给定 policy 下高风险边界扩张裁定和 fail-closed。 |
| runtime / runner 同一 RPC / SDK | 协议和 SDK 外形早于后续设计。 | 本步只保留统一 sandbox 语义和同步 / 异步 / 后台分离机制。 |
| observability audit sink / backlog / replay | 滑入事件实现、outbox / backlog / replay 机制。 | 本步只保留 material handoff、failed / retryable / pending 和追溯 backref 机制。 |
| backend 初始化失败 fallback 下一个后端 | 可能导致弱隔离或 silent degrade。 | 改为能力不满足时拒绝、等待或保守失败;只有同等边界可落实时后续才可讨论选择。 |
| seccomp / AppArmor / cap drop / profile | 配置层和后端层细节提前进入架构选型。 | 后移 `04-配置设计.md`、`05-测试方案.md`、`07-实施计划.md`。 |
| 旧 P95 / SLA / 灰度 / 回滚策略 | 缺当前验证依据,且属于测试 / 验收 / 实施阶段。 | 不继承为 Step 10 硬选型。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 选型主语 | Rust、Docker、gVisor、SandboxService、RPC、SDK、allowlist、audit event、backend fallback、seccomp / AppArmor、P95。 | 架构层技术机制 / 架构手段。 | Step 10 只锁影响边界、一致性和交互主链的机制。 |
| 后端承载 | 固定 Docker + gVisor,Firecracker 未来,local_process 测试。 | 抽象 isolation backend 承载契约 + capability summary + coherent boundary 裁定。 | 后端产品不能定义 sandbox truth,弱路径不能升格。 |
| 策略执行 | policy-aware network gate / allowlist lookup。 | 给定 launch / isolation policy 下执行裁定 + fail-closed。 | policy truth 外部拥有,sandbox 只拥有裁定事实。 |
| 通信 / 接口 | 统一 SandboxService RPC / SDK。 | 同步 / 异步 / 后台三类承接机制,协议后置。 | 防止接口外形反向约束架构语义。 |
| 观测审计 | audit sink、事件名、backlog / replay。 | material fact、handoff fact、traceability / audit backref。 | 观测和事件协作不替代 truth。 |
| 失败 / 清理 | backend fallback、可选 replay / cleanup。 | failure / control 分类、lease / orphan / cleanup guard / reaper、redline containment。 | 非 happy path 是核心主线,不是运维补偿。 |
| 指标 / 配置 | 旧 P95、SLA、安全配置项直接进入架构。 | 候选 SLO 和配置候选后置。 | 当前缺正式负载模型和后端产品闭口。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接继承旧 Docker + gVisor、统一 SandboxService、deny-by-default、audit events 和 P95 | 实施想象直接。 | 过早锁定产品、协议、事件、配置和指标,且 fallback / local_process 风险会污染核心红线。 | 不采用。 |
| 方案 B: 以架构机制说明解决的问题、采用理由和代价 | 能承接 Step 2 / 6 / 7 / 8 / 9 已收敛的职责、依赖、数据和通信边界。 | 后续 `02/03/04/07` 还需要继续落到对象、port、配置和实施边界。 | 采用。 |
| 方案 C: 当前强制完整后端产品组合、安全配置 profile、事件 outbox 和观测平台 | 看似安全完整。 | 当前缺产品级输入和代码仓约束,会显著提高 P0 复杂度并提前决定实现。 | 不采用。 |
| 方案 D: 不写关键技术机制,全部留给详细设计 | 避免过早承诺。 | 后续设计缺少机制级红线,实现 agent 会反复要求补 boundary。 | 不采用。 |
| 方案 E: 允许后端 fallback 提升可用性 | 表面提高可用性。 | fallback 若未证明同等边界,会直接导致 silent degrade。 | 不采用为默认机制;后续只能在同等边界可落实时作为受控选择讨论。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否当前锁定 Docker / gVisor / Firecracker / k8s / local_process 组合 | A. 直接锁定;B. 不锁产品,只锁抽象 backend 承载契约和能力裁定机制 | B | 当前真正的架构决定是不能 silent degrade,不是某产品组合。 | 本步采用 B。 |
| 是否当前锁定 RPC / SDK / API 外形 | A. 锁定统一 SandboxService RPC / SDK;B. 不锁协议,只锁同步 / 异步 / 后台承接机制 | B | 协议外形属于后续概要 / 详细设计,不能反推 Step 9 通信语义。 | 本步采用 B。 |
| 是否当前把 allowlist lookup / policy DSL 当成 sandbox 机制 | A. 是;B. 否,只锁给定 policy 下的执行裁定和 fail-closed | B | sandbox 不拥有 policy definition、approval、allowlist 或 capability truth。 | 本步采用 B。 |
| 是否当前锁定事件 outbox / backlog / replay | A. 锁定;B. 不锁,只确认 material handoff、failed / retryable / pending 和追溯 backref | B | 事件实现机制后移,本步只确认交接与追溯语义。 | 本步采用 B。 |
| 是否继承旧 P95 / SLA / 容量数字作为架构硬约束 | A. 继承;B. 不继承,作为候选 SLO / 测试输入 | B | 当前缺正式负载模型、后端组合和验证证据。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式承接边界隔离外部执行请求与 Sandbox 核心语义 | 防止 tools、runtime、member-service、runner、UI、SDK 或脚本直接打穿 execution isolation truth。 | Step 7 已确认核心语义必须被编排 / 接缝保护;Step 9 已确认受理、读取和控制意图必须经过正式同步边界。 | 增加承接层判断、拒绝 / pending 语义和测试覆盖成本。 | 该机制决定外部请求如何进入核心,属于架构层结构性决定。 |
| execution environment identity 与责任链绑定机制 | 防止真实执行匿名化,或由调用方各自拼接归责语境。 | 受控执行必须能回指 actor / member / work / runner / tool / runtime refs,但正文 truth 不归 sandbox。 | 需要引用解析、缺失 / stale / unresolved 状态和拒绝口径。 | 该机制影响受理、归责、追溯、审计和失败分类,不是局部字段设计。 |
| 统一边界限制语义与 coherent boundary 裁定机制 | 防止 resource、filesystem、network、process 或 workspace 限制因后端差异而 silent degrade。 | 正式需求和 Step 8 都把有效边界限制事实列为 sandbox truth;任一必需限制不可落实必须拒绝或保守失败。 | 需要后续详细设计定义边界描述、能力校验和失败分类;实现复杂度高于直接调用后端。 | 该机制保护隔离边界事实,后端产品只能服从裁定。 |
| 抽象 isolation backend 承载契约与能力摘要裁定机制 | 防止 Docker / gVisor / Firecracker / k8s / local_process 等产品反向定义 sandbox 边界。 | Step 6 已确认 backend 是基础设施承载边界;Step 7 已确认后端产品不能进入核心语义层。 | 需要维护 backend capability summary、不可用 / 过期 / 不支持语义和后续配置闭口。 | 这是架构层对基础设施依赖的治理机制,不是具体 adapter 设计。 |
| 给定 launch / isolation policy 下的执行裁定与 fail-closed 机制 | 防止 sandbox 生成 allowlist、approval、capability 或 policy definition truth。 | 需求 §14 / VF 对 policy 缺失、冲突、不支持或越权继续执行设为一票否决。 | 需要明确 policy 输入摘要、不可解析处理和高风险边界扩张拒绝口径。 | 该机制保护 policy 来源边界和安全红线。 |
| execution isolation truth / external ref / body-free summary / derived material separation | 防止身份、工作、工具、runtime、artifact、observability、policy 和 backend 正文进入 sandbox。 | Step 8 已将数据归属分为正式真相、快照 / 投影、引用和明确不拥有正文。 | 需要持续处理 stale、missing、invalid、unresolved、derived failed 等状态。 | 该机制影响数据所有权、对象建模和后续 query / handoff 设计。 |
| 核心强一致 + 外围最终一致 + 引用有效性 + guard / containment 优先机制 | 防止受理、身份、边界、policy、capture、cleanup 和 redline 出现半成立状态,同时避免下游消费阻塞核心 truth。 | Step 8 已确认核心 truth 内部强一致,外部摘要 / 投影 / handoff 最终一致。 | 增加状态解释、延迟显化、对账和测试矩阵成本。 | 该机制定义哪些关系必须同步成立,哪些可延迟收敛。 |
| 同步 / 异步 / 后台三类路径分离机制 | 防止长时执行伪同步完成,也防止后台任务隐式创建第二套正式语义。 | Step 9 已确认同步用于受理 / 裁定 / 读取 / 控制意图,异步用于事实传播 / 外部结果送达,后台用于执行生命周期和维护。 | 需要后续设计清楚表达状态承接、handoff 和后台失败语义。 | 该机制改变关键交互主链,属于架构层通信结构。 |
| capture fact、candidate material 和 handoff fact 分层交接机制 | 防止 captured output、candidate material、usage / audit / trace / metric 被静默升级为 artifact truth 或 observability store truth。 | 需求和 Step 8 均要求 sandbox 拥有 capture / handoff fact,下游正式 truth 仍归下游。 | 需要 material lifecycle、handoff pending / failed / retryable 和 cleanup guard 共同闭合。 | 该机制保护输出、制品、观测和清理边界。 |
| 稳定 failure classification 与 control fact 收束机制 | 防止 timeout、resource exceeded、backend failure、policy deny、capture failure、orphan、redline、kill、cleanup 等被调用方各自解释。 | 非 happy path 是 `C-SBX-5` 核心闭环;同一 control 信号不得出现第二套正式语义。 | 需要统一分类、冲突 control 处理、重复信号幂等和下游可见性。 | 该机制影响安全、审计、运行维护和测试验收。 |
| lease / orphan / cleanup guard / reaper 正式后台维护机制 | 防止环境托管外继续运行,或 cleanup 在材料安全交接前先删证据。 | cleanup 先删证据、orphan 托管外运行均是一票否决;Step 6 已将后台维护与清理列为正式运行单元。 | 增加后台维护、保守 pending、调查交接和资源回收复杂度。 | 该机制把清理和 reaper 从 SRE 私有脚本提升为正式架构主线。 |
| redline containment 与 investigation handoff 机制 | 防止 sandbox escape / redline 只作为 advisory event 或 UI 提示。 | 安全红线必须形成保守收束、材料保留和调查交接,不得因下游延迟解除 containment。 | 需要安全事件状态、材料保留、外部调查引用和解除条件后续闭口。 | 该机制支撑安全零容忍和事故追溯。 |
| 幂等、顺序保护、correlation / traceability / audit backref 机制 | 防止重复执行请求、重复 control、乱序 handoff、bus 重放或下游 ack 产生冲突 truth。 | 需求 §13 / §14 要求同一执行、同一 policy 语境和同一 control 信号只有一种正式含义,关键链路可回链。 | 需要稳定业务身份、correlation、重复识别、顺序依据和 backref 维护。 | 该机制跨越入口、事件协作、handoff 和后台维护。 |
| 只读本地影子 / 派生辅助机制 | 防止 backend capability、workspace source、inspect、preview、trend 和对账反写核心 truth。 | Step 7 / Step 8 已确认本地影子和派生辅助只能读取 / 派生,可 stale / rebuilding / failed。 | 增加派生视图重建、stale 解释和查询降级成本。 | 该机制支持外围增强,同时保护核心闭环不被分析视图污染。 |
| 产品 / 语言 / 框架 / 指标硬选型延后机制 | 防止旧 Draft 的 Rust、Docker/gVisor、RPC/SDK、outbox、seccomp/AppArmor、P95 等未经当前边界论证进入正式架构。 | 当前架构已能固定机制级红线,但产品级输入、代码仓约束、负载模型和部署约束尚未闭口。 | 后续必须在 `02/03/04/05/06/07` 继续补齐产品、配置、测试和实施选择。 | 该机制是设计治理手段,用于保护真相源闭环。 |

### 9.2 当前不采用口径表

| 不采用口径 | 不采用原因 | 正确落点 |
|---|---|---|
| Docker + gVisor 作为当前架构硬选型 | 产品组合不能替代 boundary 可落实性裁定;当前缺正式后端能力矩阵和配置边界。 | Step 11 备选方案;`04-配置设计.md`;`07-实施计划.md` |
| Firecracker 作为当前核心必选 | 属于强隔离变体 / 外围增强,当前核心闭环不以前置引入为通过条件。 | Step 13 演进路线;`07-实施计划.md` |
| `local_process` / 宿主直跑作为正式后端 | 会破坏宿主直跑零容忍红线;即使测试需要也不能升格为正式执行路径。 | 测试 fixture 或受限 fake 边界;不得进入生产语义 |
| 统一 SandboxService RPC / SDK 作为本步选型 | 协议外形和 SDK surface 属于后续概要 / 详细设计,不是 Step 10 机制结论。 | `02-概要设计.md`;`03-详细设计.md` |
| capability-hub allowlist lookup 作为固定 policy 来源 | 会让单一来源和 allowlist 机制反向定义 sandbox policy 执行。 | policy source 接缝矩阵;`03-详细设计.md`;`04-配置设计.md` |
| policy DSL / approval workflow / capability registry 入 sandbox | 会把外部 policy truth 转移到 sandbox。 | `L1-governance` / `L3-capability-hub` / `L2-tools` 边界 |
| observability audit sink / raw audit store 作为 truth | 观测存储不能替代 sandbox truth / material 状态承载。 | observability material handoff;`L4-observability` |
| event name / topic / outbox / backlog / replay 作为当前硬选型 | 这是事件协作实现机制,本步只确认 handoff / failed / retryable / pending 和追溯 backref。 | `03-详细设计.md`;`05-测试方案.md`;`07-实施计划.md` |
| backend fallback 作为默认可用性机制 | fallback 若未证明同等边界可落实,会形成 silent degrade。 | Step 11 备选方案;后续配置 / 实施中的受控选择 |
| seccomp / AppArmor / cap drop / mount profile 作为本步硬选型 | 是重要候选安全手段,但必须随正式后端和配置边界闭口。 | `04-配置设计.md`;`05-测试方案.md`;`07-实施计划.md` |
| 具体数据库 / 对象存储 / 缓存 / OTel / secrets / GRC 产品 | 产品选择属于实现承载,不能反向定义 execution isolation truth。 | `03-详细设计.md`;`04-配置设计.md`;`07-实施计划.md` |
| 旧 P95 / SLA / 容量数字作为本步硬指标 | 当前缺正式负载模型、基准环境和验证依据。 | `05-测试方案.md`;`06-验收标准.md`;容量验证 |
| 除 `L0-core` 外的编译期仓依赖 | 会破坏全局依赖裁剪和 sandbox 基础设施边界。 | 运行期边界、事件协作、材料交接或 SDK 访问包装 |

### 9.3 按架构单元组织的选型停审表

| 架构单元 | 进入本步的机制 | 禁止硬化的内容 | 停审结果 |
|---|---|---|---|
| `Sandbox 核心语义角色` | execution environment identity、coherent boundary、policy execution decision、capture / failure / cleanup / redline truth、一致性机制 | 后端产品 API、policy DSL、artifact truth、observability store、event topic、数据库产品 | pass |
| `Sandbox 编排 / 承接角色` | 正式承接边界、同步 / 异步 / 后台分离、幂等顺序、control / handoff 收束 | RPC / SDK 外形、handler / service 组织、outbox / retry 实现 | pass |
| `外部能力接缝角色` | body-free ref / summary、policy input、handoff backref、material handoff、runtime / artifact / observability 边界 | 单一 policy 来源、allowlist 正文、下游 truth 反写、SDK 私有状态 | pass |
| `本地影子 / 派生辅助角色` | backend capability summary、workspace source summary、inspect / preview / trend / reconciliation 只读派生 | 派生反写真相、趋势分析定义 boundary、预览成为验收签署来源 | pass |
| `技术承载角色` | truth / material 状态承载、abstract backend contract、background maintenance support、traceability support | Docker/gVisor/Firecracker 产品定稿、DB / queue / OTel 产品定稿、seccomp/AppArmor 配置定稿 | pass |

### 9.4 简化对照表

| 当前采用 | 当前不采用 |
|---|---|
| 抽象 isolation backend 承载契约与能力裁定 | 当前硬化 Docker + gVisor / Firecracker / k8s / local_process 产品组合 |
| 给定 policy 下执行裁定与 fail-closed | sandbox 拥有 allowlist / policy DSL / approval / capability truth |
| material fact / handoff fact / backref | observability audit sink 或 bus event 作为 sandbox truth |
| cleanup guard / reaper / redline containment | SRE 私有脚本、调用方 cleanup 或 advisory-only redline |
| 同步 / 异步 / 后台分离 | 统一同步调用栈完成所有执行、capture、handoff 和 cleanup |
| 幂等顺序保护和唯一正式 control 语义 | 重复 signal / replay / retry 生成第二套 execution truth |
| 产品和指标后置闭口 | 旧 P95 / SLA / 灰度 / 回滚直接进入架构硬选型 |

### 9.5 技术边界说明

本章采用的是机制级技术选型,不是产品清单或实现方案。`L4-sandbox` 当前必须被显式固定的是 execution isolation truth 如何不被调用方、后端产品、policy 来源、artifact、observability、event bus、operator UI 或派生视图污染,因此正式承接边界、执行环境身份、统一边界裁定、抽象 backend 承载契约、policy fail-closed、数据分层、一致性机制、通信路径分离、capture / handoff、failure / cleanup / redline、幂等追溯和只读派生都进入架构主线。具体 Docker / gVisor / Firecracker / k8s、RPC / SDK、数据库、消息、对象存储、OTel、seccomp / AppArmor、outbox、配置项、P95 和灰度回滚只有在不反向改变这些机制的前提下,才可以在后续概要 / 详细设计、配置设计、测试方案、验收标准和实施计划中继续选择。若后续技术实现与本章机制冲突,应以本章机制为架构真相源。

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 11. 关键技术选型

> 校准来源:
> - `design-calibration/01_arch_step_10_technology_choices.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键技术机制表”“当前不采用口径表”“按架构单元组织的选型停审表”“简化对照表”和“技术边界说明”小节,了解本章如何从前序架构边界推导机制级技术选型。

### 11.1 关键技术机制表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §9.1。

### 11.2 当前不采用口径表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §9.2。

### 11.3 按架构单元组织的选型停审表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §9.3。

### 11.4 技术边界说明

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §9.5。
```

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体 isolation backend 产品组合写成当前架构硬选型 | A. 直接锁定;B. 只锁抽象承载契约和能力裁定机制 | B | 当前核心是 coherent boundary 不可 silent degrade,产品组合需后续配置和实施输入。 | 本步采用 B。 |
| 是否把统一 RPC / SDK / SandboxService 外形写成当前硬选型 | A. 直接锁定;B. 只锁通信路径分离和统一语义 | B | 协议和 SDK surface 后续收敛,不能在 Step 10 反推 Step 9。 | 本步采用 B。 |
| 是否允许 backend fallback 作为默认机制 | A. 允许;B. 不允许默认 fallback,只能后续在同等边界可落实时讨论 | B | 防止弱隔离和 silent degrade。 | 本步采用 B。 |
| 是否锁定 seccomp / AppArmor / cap drop 等安全配置项 | A. 当前锁定;B. 后续随正式后端配置闭口 | B | 配置项必须绑定后端能力和测试验收,本步只锁边界机制。 | 本步采用 B。 |
| 是否继承旧 P95 / SLA / 容量数字 | A. 继承;B. 作为候选 SLO / 测试输入 | B | 当前缺正式负载模型和验证证据。 | 本步采用 B。 |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 11 的待确认事项。具体后端产品组合、网络粒度、security profile、RPC / SDK / API 外形、event / outbox / retry、数据库 / 对象存储 / 观测后端、配置 key、P95 / SLA / 容量数字和实施 boundary 留到后续 Step 11、`02/03/04/05/06/07` 继续收敛。

---

## 12. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确当前进入架构主线的关键技术机制 | pass | §9.1 已覆盖承接边界、identity、boundary、backend contract、policy、数据分层、一致性、通信路径、capture / handoff、failure / control、cleanup / redline、幂等追溯和派生辅助。 |
| 是否说明每项机制解决的问题、采用理由和代价 / 约束 | pass | §9.1 固定结构表逐项说明。 |
| 是否说明哪些内容当前不采用 | pass | §9.2 已列出产品、协议、policy 来源、事件实现、安全配置、指标和编译期依赖禁区。 |
| 是否按架构单元完成技术选型停审 | pass | §9.3 已按五类架构单元检查。 |
| 是否避免技术栈清单、产品横向对比、实现机制或部署环境细节 | pass | 未把 Docker/gVisor/Firecracker、RPC/SDK、DB、queue、OTel、seccomp/AppArmor、outbox 或 P95 写成当前硬选型。 |
| 是否保持正式 `01-架构设计.md` 不变 | pass | 本步只创建中间产物并更新 flow / 台账。 |
| 是否允许进入 Step 11 | pass_wait_review | 当前关键技术机制足以支撑备选方案与取舍讨论;需等待用户确认。 |

当前 Step 10 `关键技术选型` 已完成。下一步必须等待用户确认后进入 Step 11 `备选方案与取舍`,并只创建 / 改写 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`。
