# Step 9. 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 9 | pass。用户已确认 Step 8 `数据所有权与一致性策略`,可进入 Step 9。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_04_system_context.md`、`01_arch_step_06_container_deployment.md`、`01_arch_step_07_dependency_direction.md` 和 `01_arch_step_08_data_ownership_consistency.md`。 |
| 是否已读取架构 SOP Step 9 与书写规范 §4.10 | pass。已读取关键交互、通信方式、失败降级、边界约束、按架构单元交互方式、停审和跨交互边界审计要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` §12 接口依赖、§13 非功能、§14 验收和 §15 风险。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_09_interactions_communication.md` 和 `projects/L1-governance/design-calibration/01_arch_step_09_interactions_communication.md` 的组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §6.3 / §7 / §8 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_09_interactions_communication.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 在正式边界上的关键交互场景分别适合同步请求 / 响应、异步事件 / 回调,还是后台任务 / 延后承接;并说明这些通信方式如何保护 Step 8 已收敛的 execution isolation truth、强一致 / 最终一致 / 引用有效性 / cleanup guard / redline containment 口径。

本步只回答通信方式类别和边界理由,不写 API 路径、接口名、事件名、callback 名、topic 名、DTO、schema、协议选型、时序图、队列产品、重试实现、transaction、outbox、publisher / consumer、handler、adapter 或内部处理步骤。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 承接正式上下文对象、输入 / 输出面、`L0-bus`、isolation backend、material / observability consumer 和依赖失效降级口径。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 和材料 / 观测 / 事件交接边界。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 承接核心语义、编排承接、外部能力接缝、本地影子 / 派生辅助、技术承载和跨仓依赖裁剪口径。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 承接正式真相、快照 / 投影、引用、明确不拥有正文、一致性和失败处理口径。 |
| `projects/L4-sandbox/00-需求文档.md` §12 | 当前正式需求基线 | 提供需求层能力接口类型、外部依赖边界、事件输出和后台任务接口。 |
| `projects/L4-sandbox/00-需求文档.md` §13 / §14 / §15 | 当前正式需求基线 | 校验安全零容忍、可用性、幂等、可观测、验收否决和风险是否被通信方式承接。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §6.3 / §7 / §8 | historical material | 诊断旧 RPC / SDK、allowlist lookup、observability event、audit emitter、backlog / replay 和 backend fallback 是否污染本步。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧审计事件、目录、后端和 runner/runtime 共享接口线索是否被误写成通信方式定稿。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 4 / 6 / 7 / 8、正式 00、SOP Step 9 和书写规范 §4.10 | done | 本文件 §1、§3 |
| 回答同步、异步、后台、正式边界、依赖失效降级和协议细节风险问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中 RPC / SDK / event / allowlist / audit / fallback 污染点 | done | 本文件 §6 |
| 选择同步收口关键裁定、异步传播已成立事实与外部结果、后台承接长时执行 / 派生 / cleanup / reaper | done | 本文件 §8 |
| 输出关键交互场景表、通信方式判断表、按架构单元交互方式表、示意图、停审和跨交互审计 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 9 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 哪些交互适合同步能力边界?

需要即时判断 sandbox 正式语义是否成立、是否拒绝、是否 pending 或是否不可处理的交互适合同步请求 / 响应类交互。同步边界不等于“所有执行工作都在调用栈内完成”,而是要求调用方得到明确的受理、裁定、读取或控制结果,不得把未成立的事实伪装成成功。

| 同步交互 | 判断 |
|---|---|
| 受控执行请求受理与责任链绑定 | 必须即时判断是否形成正式受控执行语境、execution environment identity 和责任链绑定。 |
| 执行环境身份 / 归责 / 状态读取 | 必须即时返回可见结果、不可见、stale、unavailable 或明确失败。 |
| 隔离环境建立与边界限制施加裁定 | 必须即时判断能否建立 coherent boundary、限制是否可落实、是否拒绝或 pending。 |
| policy 语境承接与策略内执行裁定 | 必须即时判断给定 policy / authorization 是否足以继续、等待、拒绝或 fail-closed。 |
| 高风险边界扩张处置 | 必须即时判断授权是否可解释、是否允许扩张或保守拒绝。 |
| 控制意图受理与正式控制结果判断 | deny、kill、timeout、replay、cleanup 等控制意图必须即时得到受理、拒绝、pending 或已收束口径。 |
| 执行结果 / 候选材料 / failure / cleanup / redline 读取 | 查询类交互必须即时判断可见性、交接状态、capture-failure、cleanup guard 或 containment 状态。 |

### 5.2 哪些交互适合异步事件?

已经成立的 sandbox truth 向外传播、外部协作结果送达、下游 handoff 状态回送、观测消费和安全调查状态送达适合异步事件 / 回调类交互。这些场景的重点是事实传播、外部结果送达或消费感知,不要求在原始同步请求边界内完成所有下游消费,也不允许下游消费失败反向取消已经成立的 sandbox truth。

| 异步交互 | 判断 |
|---|---|
| 执行状态与观测材料输出 | 已成立的 start / finish / capture-failure / usage / audit / trace / metric material 向 bus / observability 传播。 |
| failure / control / cleanup / redline 材料输出 | 已成立的失败分类、控制动作、cleanup guard、reaper 和 redline containment 材料向下游传播。 |
| artifact / runtime / runner / observability handoff 状态回送 | 下游接收、pending、failed、retryable 或安全交接状态送达 sandbox 边界。 |
| 外部安全交接 / 调查开放状态送达 | investigation 或安全交接状态作为摘要 / 引用进入 cleanup guard 与 redline 判断。 |
| 调用方或 policy / capability 语境变化线索送达 | 只作为摘要失效、上下文变更或后续裁定输入线索,不得直接改写核心 truth。 |

### 5.3 哪些交互适合后台任务或补偿路径?

实际执行生命周期推进、长时执行收束、capture 完成、材料交接准备、lease 巡检、orphan 发现、cleanup guard、reaper、redline containment 维护、backend capability 摘要刷新、派生材料和趋势分析适合后台任务 / 延后承接类交互。后台任务可以延迟、挂起、重建或重试,但只能推动已受理的执行生命周期、维护派生材料、刷新摘要、完成交接或收束非 happy path,不得创建第二套正式执行语义。

| 后台 / 延后承接交互 | 判断 |
|---|---|
| 受控执行承接与执行生命周期推进 | 同步受理后,实际运行、长时等待、完成和收束可由后台承接,但状态必须回写同一 sandbox truth。 |
| capture / material handoff 准备 | 结果、候选材料和 observability material 的整理、分层和交接准备可延后承接。 |
| lease expiry / orphan environment 巡检 | 租约到期、孤儿环境检测和保守回收必须由后台维护闭环承接。 |
| cleanup guard / reaper | cleanup 前置判断、材料保留、安全交接和 reaper 收束适合后台维护,不得绕过 guard。 |
| redline containment 维护 | 安全红线后的保守 containment、调查交接和持续阻断可延后承接,不得解除安全收束。 |
| backend capability / workspace 摘要刷新 | 后端能力和 workspace source 摘要可后台刷新,不得替代正式边界裁定。 |
| inspect / preview / trend / 对账 | 派生调查、预览、趋势和对账可后台维护,不得反写真相。 |

### 5.4 哪些交互必须经过总线或正式边界,不能直接穿透?

identity / work / tools / runtime / member-service / runner 请求来源、policy / authorization 来源、isolation backend、artifact / observability / runtime / runner handoff、bus 协作、security investigation 和 operator / UI 显化都必须经过正式同步入口、异步输入消费、外部能力接缝、材料 / 观测 / 事件交接边界或后台维护边界。

调用方不能直接写 sandbox truth store;policy 来源不能直接改写策略执行裁定事实;backend 不能直接声明 coherent boundary 成立;artifact / observability / runtime / runner 不能直接反写 capture / failure / cleanup truth;UI / SDK / console / runner 不能直接生成 control fact;bus event 不能替代 truth / material 状态承载。

### 5.5 关键依赖失效时,本仓如何降级或挂起?

| 依赖 / 场景失效 | 降级 / 挂起口径 |
|---|---|
| 同步受理或裁定失败 | 明确失败、拒绝、pending 或保持原状态,不得返回伪成功。 |
| identity / work / calling context refs 不可解析 | 拒绝受理、挂起等待补充语境或返回 unresolved,不得匿名执行。 |
| policy / authorization 来源缺失、冲突、不可解析或不支持 | fail-closed,形成保守拒绝或 pending,不得 permissive fallback。 |
| backend capability 不足、过期或不支持必需限制 | 拒绝、等待或保守失败,不得宿主直跑、弱隔离或 silent degrade。 |
| isolation backend 执行中断或无法回收 | 形成稳定失败分类、control fact 或 containment,不得让环境托管外继续运行。 |
| artifact / runtime / runner / observability handoff 失败 | 保留 pending、failed、retryable 或 handoff-pending,不得宣布下游 truth。 |
| `L0-bus` 或 observability 消费不可用 | 本仓 truth 不丢失;协作传播标记失败或延后,不得伪装为已传播。 |
| capture 失败或材料不完整 | 形成 capture-failure truth,保留已知材料语境和失败分类,不得伪造完整结果。 |
| cleanup guard 不满足 | 阻断 cleanup 或进入保守 pending,不得先删材料再补交接。 |
| investigation / safety handoff 不可解释 | 保持 containment 或 pending investigation,不得解除 redline 收束。 |
| 后台派生、inspect、preview、trend 失败 | 返回 stale、rebuilding、failed 或 unavailable,不得反写核心 truth。 |

### 5.6 哪些通信口径若不先写清,后续最容易误入协议细节?

最容易误入协议细节的口径是:

1. 把受控执行请求受理写成 RPC / SDK 方法目录,而不是同步 truth 裁定边界。
2. 把隔离环境建立写成 Docker / gVisor / daemon / shim 调用链,而不是边界可落实性裁定。
3. 把 policy 裁定写成 allowlist lookup 或 capability-hub 查询,而不是给定 policy 下的 fail-closed 裁定。
4. 把执行生命周期推进写成同步调用栈完成,从而伪装长时执行已经完成。
5. 把 audit / observability 写成事件名目录,而不是已成立 material 的异步传播。
6. 把 handoff ack / failed / retryable 写成下游 truth,而不是 sandbox 交接状态。
7. 把 cleanup / reaper 写成运维补偿脚本,而不是正式后台维护与 guard 边界。
8. 把 inspect / preview / trend 写成验收证据或 truth 写源,而不是派生辅助。

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 核心职责 | 写审计事件 `SandboxInvoked / SandboxExited / SandboxEscapeDetected`。 | 事件名提前定稿,且容易把事件流当 truth store。 | 改为 observability material 和 failure / control / redline material 的异步传播。 |
| 关键依赖 | 写 runner 复用 sandbox、tools 调用 sandbox。 | 有效方向,但未区分同步受理、长时执行承接和异步材料传播。 | 按同步受理 / 后台执行 / 异步传播拆分。 |
| 目录结构 | 写 `rpc/`、`audit/`、`backends/`。 | 代码目录和协议位置不是通信方式结论。 | 不继承。 |
| 安全基线 | 写默认无出网和资源限制。 | 主题相关,但通信方式必须表达裁定与失败口径,不能只写机制。 | 放入同步 policy / boundary 裁定和后台 cleanup / reaper 边界。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| `runtime -> sandbox` 写 RPC | 直接进入协议 / 调用形态,没有区分受理、执行生命周期、查询、控制和材料交接。 | 改为受控执行请求受理、执行承接、状态读取和 handoff 的正式交互场景。 |
| `runner -> sandbox` 写同一 RPC / SDK | SDK 和协议形态提前定稿,且 runner 不应形成第二套 sandbox 语义。 | 改为执行消费方共享同一通信语义,不锁定协议外形。 |
| `sandbox -> capability-hub` 查询 allowlist | 固定 policy 来源和 allowlist 机制,容易把 policy truth 写入 sandbox。 | 改为 policy / authorization 来源边界的同步裁定输入和 fail-closed 口径。 |
| `sandbox -> observability` 写事件 | 只写通信标签,没有区分 observability material fact、handoff fact 和观测存储禁区。 | 改为已成立 material 的异步传播,失败不改变 sandbox truth。 |
| `audit emitter 不阻塞主执行路径` | 方向部分有效,但会让审计失败不影响追溯要求。 | 改为观测消费失败不回滚 truth,但必须保留 material 与 handoff failed / retryable 状态。 |
| `audit 事件发送失败 -> backlog / replay` | 滑入 outbox / backlog / replay 实现。 | 本步只保留 failed / retryable / pending 架构口径。 |
| `backend 初始化失败 -> fallback 下一个后端` | fallback 规则提前固化,可能导致弱隔离或 silent degrade。 | 改为后端能力不满足时拒绝、等待或保守失败,不得宿主直跑。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 通信主语 | RPC、SDK、allowlist 查询、observability 事件。 | 正式交互场景与通信方式类别。 | 架构层先判断边界语义,协议和中间件后移。 |
| 同步边界 | runtime / runner 调用 sandbox。 | 受理、身份绑定、边界裁定、policy 裁定、控制意图、读取查询即时收口。 | 防止调用方补造第二套入口或伪同步成功。 |
| 实际执行 | 隐含在同步调用或 orchestrator。 | 同步受理后由受控执行承接和后台生命周期推进。 | 支持长时执行、timeout、capture 和 control,不把运行时序写成协议。 |
| 异步边界 | audit event。 | 已成立 execution / material / failure / control / cleanup / redline facts 的传播和 handoff 状态送达。 | 观测和事件协作不替代 truth。 |
| 后台承接 | backlog / replay / fallback。 | lease / orphan / cleanup guard / reaper / redline / capture / handoff / derived material。 | 后台任务服务正式 truth 和 guard,不成为技术补偿脚本。 |
| 失败口径 | 技术重试、fallback 或不阻塞主路径。 | explicit failure、pending、unresolved、failed、retryable、containment 和 fail-closed。 | 对齐 Step 8 一致性和验收否决项。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有 sandbox 执行都同步完成 | 调用方心智简单。 | 长时执行、timeout、capture、handoff、cleanup 和 redline 无法表达,也容易伪同步成功。 | 不采用。 |
| 方案 B: 所有 sandbox 交互都异步化 | 解耦程度高。 | 受理、身份、边界、policy 和控制裁定缺少即时成立 / 拒绝口径。 | 不采用。 |
| 方案 C: 同步收口受理 / 裁定 / 读取 / 控制意图,后台承接执行生命周期和 cleanup / reaper,异步传播已成立事实与 handoff 状态 | 对齐 Step 6 运行单元和 Step 8 一致性策略。 | 后续概要 / 详细设计必须清楚标注状态边界。 | 采用。 |
| 方案 D: 先锁定 RPC / SDK / event / queue / adapter,再反推交互方式 | 实施想象直接。 | 技术选择会反向决定边界语义,违反 Step 9 约束。 | 不采用。 |
| 方案 E: 让 observability / bus / artifact handoff 参与 sandbox truth 成立 | 消费链看似完整。 | 会形成第二 truth 或下游阻塞核心执行边界。 | 不采用。 |
| 方案 F: 让 backend fallback 作为通信失败补偿主策略 | 可提升可用性。 | 可能 silent degrade 或让后端产品反向定义边界。 | 不采用;后端不满足时 fail closed。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 受控执行请求是否可以先同步返回成功,后台再补身份 / policy / boundary | A. 可以;B. 不可以,同步边界必须明确成立、拒绝或 pending | B | 执行开始前必须形成正式语境、责任链、边界和 policy 裁定。 | 本步采用 B。 |
| 长时执行是否必须一直占用同步边界 | A. 必须;B. 不必须,同步受理后可后台承接生命周期 | B | 支持 timeout、control、capture、handoff 和 cleanup,同时避免伪同步完成。 | 本步采用 B。 |
| observability / audit 失败是否可忽略 | A. 可忽略;B. 不回滚 truth,但必须保留 material 和 handoff failed / retryable | B | 审计追溯不能丢失,但观测消费不定义 sandbox truth。 | 本步采用 B。 |
| policy 来源不可用时是否允许 permissive fallback | A. 允许;B. 不允许,fail-closed 或 pending | B | 高风险执行必须在给定 policy / authorization 语境内继续。 | 本步采用 B。 |
| backend 不支持某限制时是否可 fallback 到较弱后端 | A. 可以;B. 只能在同等边界可落实且经正式裁定时选择,否则拒绝或保守失败 | B | 防止 silent degrade、宿主直跑和 test-only 升格。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.0 结论摘要

| 结论类型 | 结论 |
|---|---|
| 关键交互结论 | 本仓关键交互围绕受理 / 身份 / 边界 / policy / capture / handoff / failure / control / cleanup / redline 展开,并必须经过正式同步入口、异步输入消费、后台维护或材料 / 观测 / 事件交接边界。 |
| 通信方式结论 | 同步请求 / 响应用于即时裁定和读取;异步事件 / 回调用于已成立事实传播、外部结果送达和 handoff 状态回送;后台任务 / 延后承接用于实际执行生命周期、capture、cleanup、reaper、redline、摘要刷新和派生材料。 |
| 失败降级结论 | 通信未达成目的时只能返回或保留 rejected、pending、unresolved、stale、failed、retryable、handoff-pending 或 containment;不得伪造成功、不得 silent degrade、不得 cleanup 先删证据。 |
| 边界约束结论 | 调用方、policy 来源、backend、artifact、observability、bus、investigation 和 UI 均不得直接穿透写核心 truth;协议、事件名、DTO、topic、outbox 和重试机制后移。 |

### 9.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 受控执行请求受理与责任链绑定 | 执行消费 / 语境策略输入边界 ↔ Sandbox 同步入口 | 判断请求是否可正式进入 sandbox 主线,并绑定 execution environment identity 与责任链。 | 这是 sandbox truth 入口,必须即时收口成立、拒绝或 pending。 |
| 执行环境身份 / 归责 / 状态读取 | 调用方 / 调查 / 观测消费边界 ↔ Sandbox 同步入口 | 读取执行环境身份、归责语境、当前状态、失败分类和交接状态。 | 查询必须即时判断可见性、stale / unavailable 和 truth 回指,但不得改变 truth。 |
| 隔离环境建立与边界限制裁定 | Sandbox 同步入口 / 受控执行承接 ↔ isolation backend 承载边界 | 判断正式隔离环境是否可建立,resource / filesystem / network / process 限制是否可落实。 | 建立裁定必须保护 coherent boundary,不能由后端产品反向定义。 |
| policy 语境承接与策略内执行裁定 | policy 来源接缝 ↔ Sandbox 同步入口 / 受控执行承接 | 判断给定 launch / isolation policy 和 authorization 是否允许继续执行或必须 fail-closed。 | sandbox 拥有执行裁定事实,不拥有 policy definition truth。 |
| 高风险边界扩张处置 | policy 来源 / 调用方控制边界 ↔ Sandbox 同步入口 | 判断网络、文件系统、进程权限或资源扩张是否可被授权、拒绝或保守收束。 | 高风险动作必须同步裁定,不得由调用方或 backend 默认放行。 |
| 受控执行生命周期推进 | Sandbox 同步入口 ↔ Sandbox 受控执行承接 / truth 状态承载 / isolation backend | 承接已受理执行的运行、等待、完成、超时、中断和收束。 | 实际执行可延后承接,但必须回到同一 sandbox truth。 |
| 执行结果与候选材料读取 / 引用 | 调用方 / artifact / runtime / runner 消费边界 ↔ Sandbox 同步入口 | 稳定读取执行结果、候选材料引用、capture 状态和 capture-failure。 | 读取不宣布 artifact truth,也不补造完整 capture。 |
| 结果 / 候选 / 观测材料交接 | Sandbox material 边界 ↔ artifact / runtime / runner / observability / bus 交接边界 | 将 captured output、candidate material、usage / audit / observability material 显式交接给下游。 | 交接事实归 sandbox,下游 truth 仍归下游。 |
| 执行状态与观测材料传播 | Sandbox truth / material 状态承载 ↔ `L0-bus` / observability 消费边界 | 传播已成立的执行状态、capture、usage、audit、trace、metric 和 failure material。 | 传播失败不能回滚 sandbox truth,但必须显式保留交接状态。 |
| 失败分类与控制动作收束 | 调用方控制边界 / 异步控制输入 ↔ Sandbox 同步入口 / 异步控制消费 / truth 状态承载 | 承接 deny、kill、timeout、replay、cleanup 等控制意图和失败分类收束。 | 控制动作必须保持单一正式含义,重复信号幂等。 |
| handoff ack / failed / 安全交接状态送达 | artifact / runtime / runner / observability / investigation 边界 ↔ Sandbox 异步控制与交接消费 | 将下游接收、失败、pending、retryable、调查开放或安全交接状态送回 sandbox。 | 下游状态只能影响 handoff / cleanup guard / containment,不得反写真相。 |
| lease / orphan / reaper 后台维护 | Sandbox truth 状态承载 / isolation backend ↔ Sandbox 后台维护与清理单元 | 巡检租约、发现孤儿环境、保守回收并形成 reaper 收束事实。 | 这是正式后台维护,不是 SRE 私有脚本。 |
| cleanup guard 与材料保留判断 | Sandbox material / investigation / handoff 状态 ↔ Sandbox 后台维护与清理单元 | 判断 cleanup 是否可放行、阻断或 pending。 | cleanup 必须受材料保留和安全交接约束,不得先删证据。 |
| redline containment 与调查交接 | Sandbox failure / redline truth ↔ security investigation / observability / artifact 交接边界 | 承接安全红线的保守 containment、材料交接和调查状态。 | redline 不得只作为 advisory 事件,也不得因下游延迟解除收束。 |
| backend capability / workspace 摘要刷新 | backend / workspace source 边界 ↔ 本地影子 / 后台维护边界 | 维护承载能力和 workspace source 摘要,供后续边界裁定读取。 | 摘要可 stale / pending,不得替代正式边界裁定。 |
| inspect / preview / trend 派生维护 | Sandbox truth / material 边界 ↔ 本地影子 / 派生辅助边界 | 维护调查预览、输出预览、承载比较、容量趋势和对账材料。 | 派生材料可延迟、重建或失败,不得成为验收签署或 truth 写源。 |

### 9.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 受控执行请求受理与责任链绑定 | 同步请求 / 响应类交互 | 不宜先异步接收再伪装为已受理成功 | 返回 accepted、rejected、pending、unresolved 或明确失败 | 受理和责任链是 execution isolation truth 入口。 |
| 执行环境身份 / 归责 / 状态读取 | 同步请求 / 响应类交互 | 不宜用异步推送替代正式读取判断 | 返回可见结果、不可见、stale、unavailable 或明确失败 | 读取边界必须即时执行可见性和一致性口径。 |
| 隔离环境建立与边界限制裁定 | 同步请求 / 响应类交互 + 后台执行承接 | 不宜由 backend fallback 或弱路径替代裁定 | 限制不可落实时拒绝、等待或保守失败 | 建立裁定需要即时保护 coherent boundary。 |
| policy 语境承接与策略内执行裁定 | 同步请求 / 响应类交互 | 不宜由 allowlist cache、backend 或调用方默认值决定 | policy 缺失、冲突、不可解析或不支持时 fail-closed | sandbox 拥有裁定事实,policy truth 外部拥有。 |
| 高风险边界扩张处置 | 同步请求 / 响应类交互 | 不宜走后台补授权或异步默认放行 | 授权不可解释时拒绝扩张或 containment | 高风险边界必须先裁定再执行。 |
| 受控执行生命周期推进 | 后台任务 / 延后承接类交互 | 不宜要求所有执行都在同步边界完成;也不宜脱离 truth 状态承载 | 运行失败形成 failure fact、control fact 或 containment | 实际执行可能长时运行,但状态必须归入同一 truth。 |
| 执行结果与候选材料读取 / 引用 | 同步请求 / 响应类交互 | 不宜用下游 artifact / runner 状态替代 sandbox 读取 | 返回结果、pending、capture-failure、unavailable 或不可见 | 读取 capture truth,不宣布下游 truth。 |
| 结果 / 候选 / 观测材料交接 | 异步事件 / 回调类交互 + 后台任务 / 延后承接 | 不宜作为核心执行成功的同步前置 | 保留 pending、failed、retryable 或 handoff-pending | 下游消费可延迟,但交接状态必须显式。 |
| 执行状态与观测材料传播 | 异步事件 / 回调类交互 | 不宜用事件传播成功定义 sandbox truth | 传播失败保留 failed / retryable / pending,不得丢失本仓 material | 事实已成立后传播,观测不反写真相。 |
| 失败分类与控制动作收束 | 同步请求 / 响应类交互 + 异步事件 / 回调类交互 | 不宜让重复 control signal 形成多套正式语义 | 重复信号幂等;冲突信号挂起对账或拒绝 | 控制意图可同步受理,状态变化可异步传播。 |
| handoff ack / failed / 安全交接状态送达 | 异步事件 / 回调类交互 | 不宜要求 sandbox 同步轮询作为唯一主路径 | 保持未送达、pending、failed、retryable 或 unresolved | 这是外部结果送达,只能影响交接 / guard 语义。 |
| lease / orphan / reaper 后台维护 | 后台任务 / 延后承接类交互 | 不宜依赖调用方同步触发或 SRE 私有补偿 | 保守回收、containment、failed 或 pending | lease / orphan 是 sandbox 生命周期维护责任。 |
| cleanup guard 与材料保留判断 | 后台任务 / 延后承接类交互 + 同步读取 / 控制裁定 | 不宜无 guard 直接删除,也不宜伪装同步成功 | guard 不满足时 blocked / pending;满足后才允许 cleanup | cleanup 先删证据是明确否决项。 |
| redline containment 与调查交接 | 异步事件 / 回调类交互 + 后台任务 / 延后承接 | 不宜只作为审计事件或 UI 提示 | investigation 不闭合时保持 containment / pending | redline 必须形成保守收束和调查交接。 |
| backend capability / workspace 摘要刷新 | 后台任务 / 延后承接类交互 | 不宜作为同步执行成功的隐式副作用 | 摘要 stale / unavailable 时后续裁定拒绝、等待或保守失败 | 摘要用于判断,不拥有后端 truth。 |
| inspect / preview / trend 派生维护 | 后台任务 / 延后承接类交互 | 不宜阻塞核心执行或作为 truth 写入路径 | 返回 stale、rebuilding、failed 或 unavailable | 派生辅助可延迟,不得反写核心。 |

### 9.3 按架构单元组织的交互方式表

| 架构单元 | 同步交互 | 异步交互 | 后台 / 延后承接 | 失败降级口径 | 停审结果 |
|---|---|---|---|---|---|
| `Sandbox 核心语义角色` | 只接受已由编排收束后的受理、身份、边界、policy、capture、failure、control、cleanup 和 redline 判断。 | 不直接订阅外部事件。 | 不直接运行后台维护。 | 输入不闭合时拒绝、pending 或保持原状态。 | pass |
| `Sandbox 编排 / 承接角色` | 承接受控执行请求、查询、policy / boundary 裁定、控制意图和同步读取。 | 承接 handoff 状态、control signal、安全交接和外部结果送达。 | 发起长时执行承接、capture 收束、handoff 准备和维护触发。 | rejected / pending / unresolved / failed / unavailable,不得补造 truth。 | pass |
| `外部能力接缝角色` | 暴露正式入口、读取和控制边界,不让外部直接写核心。 | 接收或输出正式变化感知、material、handoff 和 investigation 状态。 | 提供延后交接、摘要刷新和恢复边界。 | 外部不可用只影响语境、消费或交接,不改 sandbox truth。 | pass |
| `本地影子 / 派生辅助角色` | 可支持只读查询和辅助判断,不得作为核心写入主路径。 | 可消费已成立 truth 变化和外部状态线索。 | 维护 backend capability 摘要、inspect、preview、trend、对账和派生材料。 | stale / rebuilding / failed / unavailable,不得反写真相。 | pass |
| `技术承载角色` | 支撑同步边界的正式状态承载和 isolation backend 裁定,不决定业务语义。 | 支撑事件协作、观测和材料交接边界,不承载外部 truth 正文。 | 支撑执行生命周期、lease、orphan、cleanup、reaper、redline 和派生维护。 | 技术失败只能暴露失败、挂起或 containment,不得 silent degrade。 | pass |

### 9.4 简化交互示意图

```text
+------------------------------+       +------------------------------+
| 执行消费 / 语境策略输入边界    |       | 控制 / 事件 / 安全交接边界    |
| tools / runtime / member/run  |       | bus / handoff / investigation |
+--------------+---------------+       +--------------+---------------+
               | [sync request / response]             |
               v                                       | [async event / callback]
+--------------+---------------+       +--------------+---------------+
| Sandbox 同步入口              |       | Sandbox 异步控制与交接消费    |
+--------------+---------------+       +--------------+---------------+
               |                                      |
               +------------------+-------------------+
                                  |
                                  v
                       +----------+-----------+
                       | Sandbox truth /      |
                       | material state       |
                       +----+-------------+---+
                            |             |
              [background]  |             | [async event / callback]
                            v             v
              +-------------+------+   +--+----------------+
              | 受控执行 / cleanup |   | 材料 / 观测 /    |
              | reaper / redline   |   | 事件交接边界     |
              +--------------------+   +-------------------+
```

图示说明:

- 同步请求 / 响应用于受理、身份、边界、policy、控制意图和读取的即时裁定,不是具体协议。
- 异步事件 / 回调用于已成立事实传播、handoff 状态回送和外部结果送达,不是事件目录。
- 后台任务 / 延后承接用于实际执行生命周期、capture、cleanup、reaper、redline、摘要刷新和派生维护,不得反写真相。
- 图不表达 API 路径、事件名、处理顺序、技术产品、队列、topic、outbox 或运行部署拓扑。

### 9.5 交互方式停审记录

| 交互场景 | 是否匹配数据所有权 | 是否经过正式边界 | 是否未下沉协议 schema | 停审结果 |
|---|---|---|---|---|
| 受控执行请求受理与责任链绑定 | pass | pass | pass | pass |
| 执行环境身份 / 归责 / 状态读取 | pass | pass | pass | pass |
| 隔离环境建立与边界限制裁定 | pass | pass | pass | pass |
| policy 语境承接与策略内执行裁定 | pass | pass | pass | pass |
| 高风险边界扩张处置 | pass | pass | pass | pass |
| 受控执行生命周期推进 | pass | pass | pass | pass |
| 执行结果与候选材料读取 / 引用 | pass | pass | pass | pass |
| 结果 / 候选 / 观测材料交接 | pass | pass | pass | pass |
| 执行状态与观测材料传播 | pass | pass | pass | pass |
| 失败分类与控制动作收束 | pass | pass | pass | pass |
| handoff ack / failed / 安全交接状态送达 | pass | pass | pass | pass |
| lease / orphan / reaper 后台维护 | pass | pass | pass | pass |
| cleanup guard 与材料保留判断 | pass | pass | pass | pass |
| redline containment 与调查交接 | pass | pass | pass | pass |
| backend capability / workspace 摘要刷新 | pass | pass | pass | pass |
| inspect / preview / trend 派生维护 | pass | pass | pass | pass |

### 9.6 跨交互边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | pass | 受理、裁定、读取和控制意图走同步;已成立事实传播和外部结果送达走异步;执行生命周期和维护走后台承接。 |
| 是否存在直接穿透边界 | pass | 调用方、policy、backend、artifact、observability、bus、investigation 和 UI 均必须经过正式边界。 |
| 是否存在协议细节下沉 | pass | 未写 API、event name、topic、DTO、schema、handler、outbox、queue、RPC、SDK 或技术产品。 |
| 是否存在失败降级缺口 | pass | 已给出 rejected、pending、unresolved、stale、failed、retryable、handoff-pending、containment 和 fail-closed 口径。 |
| 是否存在伪同步完成 | pass | 长时执行、capture、handoff、cleanup、reaper 和 redline 均未写成同步成功后后台补 truth。 |
| 是否存在派生反写真相 | pass | inspect、preview、trend、backend comparison 和对账只能派生或辅助。 |
| 是否存在下游消费反写核心 | pass | artifact、runtime、runner、observability 和 investigation 状态只能影响 handoff / guard / containment,不能反写核心 truth。 |
| 是否存在 backend silent degrade | pass | 后端能力不满足时拒绝、等待或保守失败,未写 fallback 补偿为默认主路径。 |
| 是否存在 cleanup 先删证据风险 | pass | cleanup guard 与安全交接进入后台维护交互,未写无保护删除。 |
| 是否存在后续详细设计承接风险 | pass | 本步保留通信类别和边界理由,具体协议、schema、port、adapter、事件目录和重试机制后续收敛。 |

### 9.7 边界说明

`L4-sandbox` 的通信方式按 execution isolation truth 是否需要即时裁定来选择:受理、身份、边界、policy、读取和控制意图必须同步收口;已成立执行事实、材料、failure、control、cleanup 和 redline 的传播以及外部 handoff / investigation 结果送达适合异步承接;实际执行生命周期、capture、lease、orphan、cleanup guard、reaper、redline 维护、摘要刷新和派生材料适合后台延后承接。同步返回成功只能表示该同步边界内的正式 sandbox 判断已经成立,不能代替长时执行完成、下游 artifact / observability / runtime / runner 消费完成或 cleanup 放行。异步和后台失败只能表现为未送达、待交接、未解析、旧视图、failed、retryable、pending 或 containment,不能回滚已经成立的 sandbox truth,也不能补造尚未成立的 truth。

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 10. 关键交互与通信方式

> 校准来源:
> - `design-calibration/01_arch_step_09_interactions_communication.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键交互场景表”“通信方式判断表”“按架构单元组织的交互方式表”“简化交互示意图”和“跨交互边界审计表”小节,了解本章如何先确认关键交互场景,再推导通信方式。

### 10.1 关键交互场景表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §9.1。

### 10.2 通信方式判断表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §9.2。

### 10.3 按架构单元组织的交互方式表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §9.3。

### 10.4 简化交互示意图

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §9.4。

### 10.5 边界说明

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §9.7。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 10 的待确认事项。下列事项进入后续 Step,不得在 Step 9 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH-009-001 | 受控执行同步入口后续映射为哪些 command / query / API / SDK 外形 | 后续 `02/03` 收敛。 |
| Q-SBX-ARCH-009-002 | 执行生命周期、capture、control、handoff 和 cleanup 的状态机与事件目录 | 后续 `02/03/05` 收敛。 |
| Q-SBX-ARCH-009-003 | `L0-bus`、observability、artifact、runtime、runner 的具体交接协议和 ack 语义 | 后续 `03/04/05/06` 收敛。 |
| Q-SBX-ARCH-009-004 | isolation backend 调用、capability 摘要刷新和 workspace source 校验的具体技术机制 | 后续 Step 10、`03/04/07` 收敛。 |
| Q-SBX-ARCH-009-005 | inspect / preview / trend / replay 是否进入当前实施范围以及对应交互面 | 后续 Step 13、`07` 收敛。 |

---

## 12. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确关键交互场景及其正式边界位置 | pass | §9.1 已覆盖受理、身份、边界、policy、执行、capture、handoff、failure、control、cleanup、redline、派生和摘要刷新。 |
| 是否明确每类场景适合采用的通信方式 | pass | §9.2 已区分同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接。 |
| 是否明确不宜采用的方式和失败处理口径 | pass | §9.2 已逐场景说明不宜方式和失败处理。 |
| 是否按架构单元完成交互方式停审 | pass | §9.3 / §9.5 已逐项通过。 |
| 是否完成跨交互边界审计 | pass | §9.6 未发现同步 / 异步冲突、直接穿透边界、协议细节下沉或失败降级缺口。 |
| 是否避免接口目录、事件目录、时序图、技术选型或失败机制实现 | pass | 未写 API、event name、topic、DTO、schema、handler、outbox、queue、RPC、SDK 或重试实现。 |
| 是否保持正式 `01-架构设计.md` 不变 | pass | 本步只创建中间产物并更新 flow / 台账。 |
| 是否允许进入 Step 10 | pass_wait_review | 当前关键交互与通信方式足以支撑关键技术选型讨论;需等待用户确认。 |

当前 Step 9 `关键交互与通信方式` 已完成。下一步必须等待用户确认后进入 Step 10 `关键技术选型`,并只创建 / 改写 `design-calibration/01_arch_step_10_technology_choices.md`。
