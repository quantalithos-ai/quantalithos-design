# Step 14. 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 14 | pass。用户已确认 Step 13 `演进路线`,可进入 Step 14。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `project_execution_ledger.md`、`01_architecture_calibration_flow.md` 和 `01_arch_step_13_evolution_path.md`,并抽查 Step 8~12 的数据、交互、技术取舍、备选方案和横切约束。 |
| 是否已读取架构 SOP Step 14 与书写规范 §4.15 | pass。已读取风险 / 待确认事项拆分、风险表、待确认事项表、当前处理口径和禁止写法要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 §14 一票否决和 §15 风险与待确认事项。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_14_risks_open_questions.md` 和 `projects/L1-governance/design-calibration/01_arch_step_14_risks_open_questions.md` 的组织方式,不复制其结论。 |
| 是否已读取上游参考 | pass。已按需抽查 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity` 和 `L1-work` 中与 policy / result、runtime recover、member host binding、identity / work refs 相关边界。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_14_risks_open_questions.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

显式收纳 `L4-sandbox` 架构校准后仍未关闭、且会影响后续概要设计 / 详细设计 / 配置设计 / 测试验收 / 实施计划判断的正式风险和待确认事项。

本步不写任务 backlog、TODO 清单、实施动作、最终解决方案、API / RPC / SDK 形态、event / outbox / retry、状态机、数据库、对象存储、OTel、secrets、后端产品、安全 profile、配置 key、部署脚本、测试用例或 implementation boundary。前序已收稳的 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、外部正文排除和依赖裁剪结论不在本步重新打开。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成并经用户确认 | 提供需求基线、硬约束、一票否决和旧材料污染输入。 |
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 提供做 / 不做、易混淆职责和边界红线。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 提供 `L0-core` 唯一编译期依赖、运行期协作和禁止依赖口径。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 提供 execution isolation truth、snapshot / ref / derived / forbidden body 和一致性口径。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 提供同步 / 异步 / 后台边界、handoff、cleanup guard、redline 和失败降级语义。 |
| `01_arch_step_10_technology_choices.md` | 已完成并经用户确认 | 提供机制级选型和后端产品、协议、profile、指标后置口径。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成并经用户确认 | 提供当前主线方案、替代路径、不采用方案和路径级取舍。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成并经用户确认 | 提供安全、审计、观测、韧性、性能和配置横切约束。 |
| `01_arch_step_13_evolution_path.md` | 已完成并经用户确认 | 提供可接受债务、不可接受债务、后续演进项和触发条件。 |
| `projects/L4-sandbox/00-需求文档.md` §14 / §15 | 当前正式需求基线 | 校验一票否决、需求层风险和待确认事项是否被架构层承接。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断 Docker/gVisor/Firecracker、allowlist、seccomp/AppArmor、旧指标和后端线索是否回流。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` | historical material | 诊断旧 SandboxService、Backends、Limits、Policy Gate、Audit、local_process、fallback 和旧阶段路线是否回流。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 13、SOP Step 14 和书写规范 §4.15 | done | 本文件 §1、§3 |
| 读取正式 00 风险 / 一票否决、旧 README / 旧 `01` 风险段和 L1 同类 Step 14 示例 | done | 本文件 §3、§6 |
| 抽查 Step 8~12 的数据、交互、技术取舍、备选方案和横切约束 | done | 本文件 §5、§9 |
| 回答未关闭风险、影响层、待确认事项、前文成立性和阻塞判断问题 | done | 本文件 §5 |
| 输出风险表、待确认事项表和当前处理口径说明 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 14 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 当前还有哪些尚未关闭的架构风险?

当前尚未关闭的正式风险不是“后续文档还没写”,而是后续概要、详细、配置、测试或实现阶段可能重新打穿 `L4-sandbox` 主线边界的问题:

| 风险 | 当前判断 |
|---|---|
| tools / runtime / member-service / runner / 人工脚本形成第二套正式 sandbox 语义 | 会破坏跨调用方统一受理、policy、capture、failure、control、cleanup 和 redline 口径。 |
| Docker / gVisor / Firecracker / k8s / local_process / host-run 等后端或弱路径反向定义正式边界 | 会让产品能力、测试路径或 fallback 替代 coherent boundary。 |
| resource / filesystem / network / process 任一必需边界 silent degrade | 会让正式隔离环境事实失效,并直接命中一票否决。 |
| sandbox 反向拥有 policy definition、approval、allowlist 或 capability truth | 会吞并治理 / 能力来源,使 fail-closed 退化为本地默认值。 |
| captured output、candidate material 或 observability material 静默升级为 Artifact / evidence / observability store truth | 会打穿 capture / handoff 分层和下游真相边界。 |
| cleanup / reaper / redline guard 被弱化 | 会导致先删证据、孤儿环境托管外继续运行或 redline 变成 advisory-only。 |
| 外部正文为排障、性能、观测、展示或 replay 便利进入 sandbox truth | 会污染 execution isolation truth ownership。 |
| event、audit、observability 或 bus 被写成 truth store | 会让传播、消费或物理观测平台替代 sandbox truth / material 状态承载。 |
| 同步成功被误写成长时执行、handoff、下游消费、cleanup 或观测消费全部完成 | 会制造核心强一致与外围最终一致之间的伪闭环。 |
| 除 `L0-core` 外的 sibling repo 成为编译期业务依赖 | 会破坏全局依赖裁剪和 L4 仓边界。 |
| 配置改变 truth、边界、policy、handoff、cleanup、redline、fallback 或 retention 语义 | 会让配置层暗改架构主线。 |
| 旧 Docker/gVisor/Firecracker、allowlist、seccomp/AppArmor、cap drop、旧 P95 / SLA 和旧阶段路线回流为硬事实 | 会让旧 Draft 或产品设施压过已确认主线。 |
| 后续 Agent 因 API、状态、schema、storage、config、product 或 boundary 未定而自行补真相源 | 会在设计链闭口前制造实现级第二真相。 |

### 5.2 这些风险会影响哪一层架构结构?

| 风险类型 | 影响范围 |
|---|---|
| 第二套正式 sandbox 语义 | 职责边界、系统上下文、关键交互、数据所有权、验收否决 |
| 后端 / 弱路径反向定义边界 | 容器 / 部署架构、技术选型、横切安全、配置设计、测试验收 |
| boundary silent degrade | 隔离环境建立、resource / filesystem / network / process 边界、一致性、NFR 和一票否决 |
| policy truth 被 sandbox 吞并 | 依赖方向、数据归属、关键交互、安全横切和配置治理 |
| capture / handoff 分层被打穿 | 数据所有权、关键交互、artifact / observability 协作、cleanup guard |
| cleanup / redline guard 弱化 | 后台维护、失败分类、审计追溯、安全调查和验收否决 |
| 外部正文入仓 | 数据所有权、职责边界、追溯、派生读取和排障场景 |
| event / observability / bus 变 truth store | 通信方式、技术选型、可观测性、事件协作和恢复口径 |
| 同步成功伪闭环 | 通信方式、一致性分层、handoff、cleanup、下游消费和验收证据 |
| 编译期依赖越界 | 依赖方向、代码组织、实施边界和全局仓级裁剪 |
| 配置越界 | 横切关注点、配置设计、部署运行和安全变更审查 |
| 旧口径回流 | 架构目标、技术机制、备选方案、演进路线、测试验收 |
| 后续私补设计真相 | 概要设计、详细设计、配置设计、测试方案和实施计划 |

### 5.3 当前还有哪些待确认事项?

当前待确认事项主要缺后续正式文档或运行证据输入。它们不推翻 Step 1~13 已收稳主线,但会影响后续能否 1:1 落码、配置和验收:

1. 具体 isolation backend 组合、允许环境边界和正式 / 测试承载边界如何定义。
2. backend capability matrix、同等边界证明和强隔离变体如何表达。
3. policy / authorization 来源矩阵、网络 / 文件系统 / 进程动作 taxonomy 和高风险动作分类如何闭口。
4. 网络放行粒度、allowlist 粒度和未授权 / 不支持 / 冲突策略的外部解释材料如何承接。
5. artifact、observability、runtime、runner 和 investigation handoff ack / failed / retryable 协议如何表达。
6. captured output、candidate material、observability material 的大小、保留、存储、摘要和 cleanup guard 语义如何闭口。
7. failure taxonomy、control conflict、lease / orphan / cleanup 状态、redline containment lifecycle 和 investigation handoff 如何细化。
8. inspect、preview、replay、operator control、backend comparison、trend 和 read surface 的只读派生身份如何定义。
9. API / RPC / SDK / port / DTO / event / outbox / retry / worker 等协议和运行机制如何落到后续设计。
10. DB、object store、cache、OTel、secrets、GRC、message bus、audit store 等产品是否进入正式配置和实施基线。
11. seccomp / AppArmor / cap drop / mount / network profile 如何随正式后端和环境边界闭口。
12. SLO、容量、启动时延、policy 判断开销、capture / cleanup / reaper 阈值如何由正式负载模型硬化。
13. 缺失的正式 `04-配置设计.md` 与 `07-实施计划.md` 如何在后续文档链中补齐,其中 `07` 必须同步创建 implementation ledger 和 planned boundary skeleton。

### 5.4 哪些待确认项会影响前文结论是否成立?

上述待确认事项不会改变前文已收稳的结论:`L4-sandbox` 只拥有 execution isolation truth,真实执行必须经正式受理和 coherent boundary,policy 必须 fail-closed,capture / handoff 必须分层,cleanup guard 和 redline containment 必须成立,外部正文不入仓,非 `L0-core` sibling 不进入编译期依赖。它们会影响后续设计如何表达对象、状态、协议、事件、配置、后端 profile、测试门禁、容量指标和实施 boundary。如果后续细化选择让后端产品、调用方、policy 来源、下游 artifact / observability、bus event、配置或派生读取反向定义核心 truth,对应待确认事项就会转化为阻塞风险。

### 5.5 哪些风险是当前阶段可接受的,哪些会阻塞后续推进?

当前可带约束推进的风险包括:旧产品设施和旧性能数字回流风险、完整后端产品组合未定、API / schema / storage / config / event 未定、seccomp / AppArmor profile 未定、SLO 未量化和外围 read surface 范围未定。这些不阻塞 Step 15 / Step 16,但必须在后续对应文档正式闭合,不能由实现阶段私补。

会阻塞后续推进的是:正式入口被绕过、宿主直跑或弱隔离被称为正式 sandbox、必需边界 silent degrade、policy 不完备仍继续、sandbox 保存外部正文或外部 truth、candidate / observability material 升格为下游 truth、cleanup 先删证据、orphan / redline 脱管、跨调用方形成第二套正式语义、关键链路不可追溯、非 `L0-core` sibling 编译期依赖、配置暗改核心边界。

---

## 6. 当前文档问题诊断

| 旧 / 前序内容 | 问题 | 本轮处理 |
|---|---|---|
| 正式 00 已列需求层风险和待确认事项 | 需要转成架构层影响范围、处理口径和阻塞性。 | 作为本步主要输入,映射到职责、数据、交互、技术、横切和演进结构。 |
| Step 13 已列可接受债务和不可接受债务 | 需要区分哪些只是后续演进,哪些是正式风险。 | 不把所有债务自动写成风险;只保留会影响主线判断的未关闭问题。 |
| 旧 README / 旧 `01` 写 Docker/gVisor、Firecracker、local_process、seccomp/AppArmor、cap drop | 容易把后端、测试路径和 profile 写成当前架构硬事实。 | 写成旧口径回流风险和后续待确认事项,不作为当前定论。 |
| 旧 `SandboxService`、RPC / SDK、audit event、allowlist lookup、backend fallback | 协议、事件、policy 来源和 fallback 会反向定义 sandbox truth。 | 写成风险或待确认事项,当前只固定统一语义和保守边界。 |
| API、状态机、schema、存储、配置 key 和产品选择未定 | 容易诱导后续 Agent 自行补设计真相。 | 写成有条件阻塞风险和待确认事项,进入后续正式文档闭口。 |
| 前序 Step 的 Q 表和风险段 | 大部分已经被后续步骤吸收。 | 本步只保留仍影响后续架构 / 设计成立的问题。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 分散在需求风险、硬约束、横切约束、演进债务和旧材料诊断中。 | 汇总成正式架构风险表,并给出阻塞判断。 | 对齐书写规范 §4.15。 |
| 待确认事项 | 容易混入 TODO、方案愿望、已收敛 Q 表或实现细节。 | 只保留缺确认且会影响后续主线判断的问题。 | 防止制造伪不确定或提前下沉。 |
| 阻塞判断 | 可接受债务、后续演进和一票否决可能混淆。 | 明确阻塞 / 不阻塞 / 有条件阻塞。 | 支撑后续概要、详细、配置、测试和实施审查。 |
| 当前处理口径 | 容易写解决方案、产品选择或实施动作。 | 只写架构层约束、暂存或挂起方式。 | 不越过 Step 14 职责。 |
| 旧口径处理 | 旧后端、allowlist、event、profile 和旧指标可能继续污染主线。 | 统一按 historical material 暂存,不得高于 Step 1~13 结论。 | 防止旧 Draft 回流。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 汇总全部前序 Q 表 | 信息最多。 | 大量问题已被后续 Step 吸收,会制造伪未定。 | 不采用。 |
| 方案 B: 拆分正式风险和待确认事项,并给出阻塞判断 | 可审查,能支撑后续概要 / 详细 / 配置 / 测试 / 实施。 | 文档较长,需要严格避免写解决方案。 | 采用。 |
| 方案 C: 把 API / 状态机 / schema / 产品未定全部写成阻塞风险 | 看似保守。 | 会让架构文档承担概要 / 详细 / 配置职责。 | 不采用。 |
| 方案 D: 不保留待确认事项 | 文档更干净。 | 会诱导后续 Agent 自行脑补接口、状态、配置、产品或 evidence。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把风险与待确认事项拆成两张表 | A. 拆开;B. 合并为问题清单;C. 写成任务 backlog | A | 符合书写规范 §4.15,能区分已知风险和缺失确认。 | 本步采用 A。 |
| API / 状态机 / schema / storage / config 未定是否阻塞 Step 15 / Step 16 | A. 阻塞;B. 不阻塞架构收尾,但阻塞对应设计或实现私补 | B | 架构层不能下沉详细设计,但后续不得绕过正式设计闭口。 | 本步采用 B。 |
| 后端产品、profile 和 SLO 未定是否是阻塞风险 | A. 产品未定本身阻塞;B. 产品未定挂起,产品回流为 truth 才阻塞 | B | 保护抽象 boundary 和实现层分工。 | 本步采用 B。 |
| 是否把旧 Docker/gVisor/Firecracker/local_process/allowlist/旧指标列为风险 | A. 列为非阻塞回流风险;B. 删除;C. 重新纳入主线 | A | 这是本轮重校准要防止的问题,但保持 historical material 身份时不阻塞。 | 本步采用 A。 |
| 是否把宿主直跑、silent degrade、policy continue、material 升格、cleanup 先删证据、redline 脱管列为阻塞风险 | A. 列为阻塞;B. 列为不阻塞;C. 写成待确认 | A | 这些会直接破坏一票否决和架构硬约束。 | 本步采用 A。 |

---

## 9. 结构化中间产物

### 9.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| tools / runtime / member-service / runner / 人工脚本形成第二套正式 sandbox 语义风险 | 职责边界;系统上下文;关键交互;数据所有权;验收否决 | 当前按统一正式入口、统一 execution environment identity、统一 policy / capture / failure / control / cleanup / redline 语义处理;调用方只能经正式边界消费或协作。 | 阻塞 | 一旦发生,同一执行会出现多套受理、结果、控制或清理真相。 |
| 后端产品、低隔离测试路径、`local_process`、host-run 或 fallback 反向定义正式隔离边界风险 | 容器 / 部署;技术选型;横切安全;配置设计;测试验收 | 当前按抽象 isolation backend contract、backend capability summary 和 coherent boundary 裁定处理;弱路径不得升级为正式 sandbox。 | 阻塞 | 产品能力或测试便利不能替代 resource / filesystem / network / process 边界。 |
| resource / filesystem / network / process 任一必需边界 silent degrade 风险 | 隔离环境建立;有效限制;一致性;NFR;一票否决 | 当前按无法落实、无法验证或不支持即拒绝、等待或保守失败处理。 | 阻塞 | 该风险直接命中 VF-SBX-003。 |
| sandbox 反向拥有 policy definition、approval、allowlist 或 capability truth 风险 | 依赖方向;数据归属;关键交互;安全横切;配置治理 | 当前按只消费给定 policy / authorization 并形成执行裁定 fact 处理;policy truth 外部拥有。 | 阻塞 | 一旦发生会吞并治理 / 能力来源,破坏 fail-closed。 |
| captured output、candidate material 或 observability material 静默升级为 Artifact / evidence / observability store truth 风险 | 数据所有权;capture / handoff;artifact / observability 协作;cleanup guard | 当前按 capture fact、candidate material、observability material 和 handoff fact 分层处理;下游 truth 由下游正式确认。 | 阻塞 | 一旦发生会打穿材料分层和下游真相边界。 |
| cleanup / reaper / redline guard 被弱化风险 | 后台维护;失败分类;审计追溯;安全调查;验收否决 | 当前按 cleanup guard、材料安全交接、orphan recovery、reaper 和 redline containment 优先处理。 | 阻塞 | cleanup 先删证据、orphan 托管外运行或 redline advisory-only 均不可接受。 |
| 外部正文为排障、性能、观测、展示或 replay 便利进入 sandbox truth 风险 | 数据所有权;职责边界;追溯;派生读取;排障场景 | 当前按 refs、safe summary、snapshot、handoff refs 和 material fact 承接,外部正文禁止入仓。 | 阻塞 | 一旦发生会污染 execution isolation truth ownership。 |
| event、audit、observability 或 bus 被写成 truth store 风险 | 通信方式;技术选型;可观测性;事件协作;恢复口径 | 当前按 truth / material 状态由 sandbox 承载,事件和观测只消费、传播或显化已成立 material。 | 阻塞 | 传播成功或观测消费不能替代本仓 truth。 |
| 同步成功伪装长时执行、handoff、下游消费、cleanup 或观测消费已完成风险 | 通信方式;一致性分层;handoff;cleanup;下游验收 | 当前同步只证明同步边界内受理、裁定、读取或控制意图成立;生命周期、交接和清理可后台 / 异步收束。 | 阻塞 | 该风险会制造伪一致,使失败、pending 和 retryable 状态不可解释。 |
| 除 `L0-core` 外的 sibling repo 成为编译期业务依赖风险 | 依赖方向;代码组织;实施边界;全局仓级裁剪 | 当前只允许非 core sibling 通过运行期接缝、事件、refs、snapshot、safe summary 或 handoff 协作。 | 阻塞 | 一旦发生会破坏全局依赖裁剪。 |
| 配置改变 truth、边界、policy、handoff、cleanup、redline、fallback 或 retention 语义风险 | 横切关注点;配置设计;部署运行;安全变更审查 | 当前按配置不得越界处理;配置只能在已确认架构边界内选择运行行为。 | 阻塞 | 配置层不能暗改架构主线。 |
| 旧 Docker/gVisor/Firecracker、allowlist、seccomp/AppArmor、cap drop、旧 P95 / SLA 和旧阶段路线回流为硬事实风险 | 架构目标;技术机制;备选方案;演进路线;测试验收 | 当前只作为 historical material 和后续候选输入暂存,不得高于 Step 1~13 已收稳结论。 | 不阻塞 | 风险已识别,只要不回流为 truth source、产品前置或硬指标,可带约束推进。 |
| 后续 Agent 因 API、状态、schema、storage、config、product 或 boundary 未定而自行补真相源风险 | 概要设计;详细设计;配置设计;测试方案;实施计划 | 当前明确这些内容进入后续对应正式文档,不得在实现中临时造字段、状态、协议、配置、evidence 或产品口径。 | 有条件阻塞 | 如果对应设计仍未闭合就进入实现,该风险会阻塞落码。 |

### 9.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| 具体 isolation backend 组合、允许环境边界和正式 / 测试承载边界如何定义 | 容器 / 部署;技术选型;配置设计;测试验收;实施计划 | 缺正式后端组合、环境边界、测试 fake / fixture 边界和生产禁区确认 | 当前按抽象 backend contract 和 capability summary 挂起,不锁 Docker / gVisor / Firecracker / k8s / local_process | 不影响当前主线成立,但影响配置、测试和实施闭口。 |
| backend capability matrix、同等边界证明和强隔离变体如何表达 | 后端承载;安全边界;capacity;ADR | 缺能力矩阵、同等边界证明、强隔离 profile 触发条件和不可用处理口径 | 当前按能力不足即拒绝、等待或保守失败挂起 | 后续不得用 fallback 绕过边界。 |
| policy / authorization 来源矩阵和边界动作 taxonomy 如何闭口 | 依赖方向;关键交互;安全横切;配置设计 | 缺 policy source、approval、capability、tool policy、network / filesystem / process action taxonomy | 当前按给定 policy / authorization + fail-closed 挂起 | 该事项影响接口和配置,不迁移 policy truth。 |
| 网络放行粒度、allowlist 粒度和高风险动作解释材料如何定义 | 网络边界;policy 裁定;测试方案;验收标准 | 缺 domain / IP / port / protocol 粒度、例外语境、unsupported / conflict 解释材料 | 当前按 deny-by-default 与 formal authorization 挂起 | 粒度未定不允许默认放行。 |
| artifact、observability、runtime、runner 和 investigation handoff ack / failed / retryable 协议如何表达 | capture / handoff;下游协作;事件;恢复;测试验收 | 缺 ack 协议、失败状态、retryable 语义、回链验证和下游回送边界 | 当前按显式 handoff fact、pending / failed / retryable 和 cleanup guard 挂起 | 交接协议未定不允许 material 升格为下游 truth。 |
| captured output、candidate material、observability material 的大小、保留、存储、摘要和 cleanup guard 语义如何闭口 | 数据所有权;材料治理;配置设计;容量;cleanup | 缺 material size、retention、storage、safe summary、partial capture 和删除放行口径 | 当前按 capture fact / material fact / handoff fact 分层挂起 | 影响大材料和清理实现,不改变分层边界。 |
| failure taxonomy、control conflict、lease / orphan / cleanup 状态、redline containment lifecycle 和 investigation handoff 如何细化 | 失败分类;后台维护;redline;安全调查;验收 | 缺状态集、冲突规则、containment 解除条件、investigation 接缝和审计回放口径 | 当前按 stable failure / control / cleanup guard / containment fact 挂起 | 后续不能把安全收束退化为事件提示或脚本。 |
| inspect、preview、replay、operator control、backend comparison、trend 和 read surface 的只读派生身份如何定义 | 派生读取;排障;安全审查;容量治理;runner / console | 缺派生 identity、stale / rebuilding / failed / unavailable 状态、访问边界和对账恢复口径 | 当前按只读派生、不反写核心、不作为核心通过前提挂起 | 该事项影响体验和排障,不改变核心 truth。 |
| API / RPC / SDK / port / DTO / event / outbox / retry / worker 等协议和运行机制如何落到后续设计 | 概要设计;详细设计;测试方案;实施计划 | 缺正式端口、消息、错误语义、幂等、顺序、重试和 worker 责任边界 | 当前只固定同步 / 异步 / 后台通信语义挂起 | 架构收尾不写协议 schema,但实现前必须闭口。 |
| DB、object store、cache、OTel、secrets、GRC、message bus、audit store 等产品是否进入正式配置和实施基线 | 技术承载;配置设计;容量;实施计划 | 缺产品级输入、运行约束、容量模型、存储职责和安全审查 | 当前只固定承载角色和边界不可反写挂起 | 产品选择不得推翻依赖、数据和交互边界。 |
| seccomp / AppArmor / cap drop / mount / network profile 如何随正式后端和环境边界闭口 | 安全 profile;配置设计;测试方案;验收标准 | 缺 profile 矩阵、默认值、例外、验证方法和后端适配口径 | 当前只固定限制不可 silent degrade 和 fail-closed 挂起 | 具体 profile 后移不等于可弱化边界。 |
| SLO、容量、启动时延、policy 判断开销、capture / cleanup / reaper 阈值如何由正式负载模型硬化 | 横切性能;测试方案;验收标准;容量评估 | 缺负载模型、测量方法、阈值来源和验收数据 | 当前只保留结构性性能预算,旧数字不作为硬指标挂起 | 不能继承旧 P95 / SLA 或随意补数。 |
| 缺失的正式 `04-配置设计.md` 与 `07-实施计划.md` 如何补齐 | 配置设计;实施计划;项目台账;后续门禁 | 缺正式配置文档、实施计划、implementation ledger 和 planned boundary skeleton | 当前作为文档链缺口挂起,不反向影响当前架构结论 | 进入 04 / 07 前必须按对应 SOP 闭口。 |

### 9.3 当前处理口径说明短文

本章把已经明确会打穿 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、外部正文排除或依赖裁剪的问题写成风险,把仍缺后续文档、运行证据或产品输入的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终修复方案;待确认事项只说明缺什么确认和当前如何挂起,不预支概要、详细、配置或实施结论。可接受债务和后续演进项本身不是风险,但如果后续实现用它们绕过正式入口、边界、policy、材料分层、cleanup、redline、依赖或追溯,就会转化为阻塞问题。任何不确定项都不得为了形成完整叙事而回填成前文确定结论。

---

## 10. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §15 “风险与待确认事项”直接摘录并整理本文件 §9.1、§9.2 和 §9.3。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项处理建议

### 11.1 本 Step 未确认事项

本步不新增阻塞 Step 15 的待确认事项。§9.2 所列内容均作为后续概要设计、详细设计、配置设计、测试方案、验收标准和实施计划需要继续确认的架构输入。

### 11.2 后续阻塞转换规则

| 事项 | 当前状态 | 转为阻塞的条件 |
|---|---|---|
| 后端组合 / profile / SLO 未定 | 不阻塞 Step 15 / Step 16 | 若后续实现绕过 `04/05/06/07` 直接落产品、profile 或指标,转为阻塞。 |
| API / state / schema / event / storage 未定 | 不阻塞 Step 15 / Step 16 | 若进入实现前 `02/03` 未闭口且实现私补,转为阻塞。 |
| handoff ack / cleanup guard 细节未定 | 不阻塞 Step 15 / Step 16 | 若后续允许 cleanup 先删证据或 material 升格为下游 truth,转为阻塞。 |
| read surface / inspect / replay 范围未定 | 不阻塞 Step 15 / Step 16 | 若派生能力反写核心 truth 或成为核心验收来源,转为阻塞。 |
| `04` / `07` 正式文档缺失 | 不阻塞当前架构 Step 14 | 进入对应文档阶段前必须创建;完成 `07` 时必须同步 ledger 和 planned boundary skeleton。 |

---

## 12. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 已明确拆分正式风险与待确认事项 | pass。见 §9.1 和 §9.2。 |
| 已说明每项风险的影响范围、当前处理口径和阻塞性 | pass。§9.1 覆盖阻塞 / 不阻塞 / 有条件阻塞判断。 |
| 已说明每项待确认事项的影响范围、缺失确认和当前挂起口径 | pass。§9.2 逐项列明。 |
| 未把任务 backlog、TODO、最终解决方案、已定结论或普通愿望写成风险 / 待确认事项 | pass。 |
| 未提前写 API、schema、数据库、配置 key、测试步骤、后端产品或 implementation boundary | pass。 |
| 未把旧 README / 旧 `01` 作为新版架构真相源继承 | pass。旧材料只进入 historical material / 回流风险。 |
| 是否允许进入 Step 15 | 本步完成后需等待用户审查确认;确认后才能进入 Step 15 `ADR 与需求追溯`。 |
