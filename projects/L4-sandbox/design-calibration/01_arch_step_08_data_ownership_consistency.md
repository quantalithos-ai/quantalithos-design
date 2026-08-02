# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 8 | pass。用户已确认 Step 7 `依赖方向与层间约束`,可进入 Step 8。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md`、`01_arch_step_05_bounded_context_subdomains.md`、`01_arch_step_06_container_deployment.md` 和 `01_arch_step_07_dependency_direction.md`。 |
| 是否已读取架构 SOP Step 8 与书写规范 §4.9 | pass。已读取数据所有权结论、数据分类结论、一致性口径、补偿 / 约束、按架构单元数据所有权、停审和跨数据边界审计要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的 §11 数据归属、§12 接口依赖、§13 非功能、§14 验收和 §15 风险。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_08_data_ownership_consistency.md` 和 `projects/L1-governance/design-calibration/01_arch_step_08_data_ownership_consistency.md` 的组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §8 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_08_data_ownership_consistency.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 在架构层拥有哪些正式数据真相,哪些只是快照 / 投影,哪些只是外部引用关系,哪些正文或正式真相必须明确排除在本仓之外;并在这些归属判断成立的前提下,说明核心 truth 内部、truth 到外部快照 / 引用、capture / handoff、cleanup / reaper 和 redline containment 等关系应采用什么一致性口径。

本步只写架构层数据归属与一致性策略,不写数据库表、字段、DDL、缓存策略、outbox、事务机制、事件 schema、重试脚本、repository / service / adapter、状态机细节、后端配置或代码对象模型。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 承接 sandbox 做 / 不做、易混淆职责和安全红线,判断哪些数据不得由调用方、后端、policy 来源或下游消费方反写。 |
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 承接正式上下文对象、输入 / 输出面、抽象 isolation backend、material / observability consumer 和依赖失效降级口径。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成并经用户确认 | 承接五个核心子域、六个支撑上下文和本地影子层,用于按架构语义单元判断 truth / snapshot / reference / forbidden body。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 和交接边界。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 承接核心语义、编排承接、外部接缝、本地影子 / 派生辅助和技术承载五类依赖角色。 |
| `projects/L4-sandbox/00-需求文档.md` §11 | 当前正式需求基线 | 提供 execution isolation truth、快照、引用和禁止正文的需求层数据归属基线。 |
| `projects/L4-sandbox/00-需求文档.md` §12~§15 | 当前正式需求基线 | 校验接口依赖、NFR、验收否决和风险是否被本步一致性口径承接。 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提供按 `C-SBX-1~5` 组织的数据归属详细来源和旧数据污染诊断。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §8 | historical material | 诊断旧 `SandboxExecution metadata`、`allowlist snapshot`、`audit events` 和补偿机制是否污染 Step 8。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧后端、allowlist、audit event、目录和性能线索是否被误写成数据 truth。 |
| `L1-artifact` / `L1-governance` Step 8 示例 | 已参考 | 只参考“先归属、再一致性、按架构单元停审、跨数据审计”的粒度。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 3~7、正式 00、SOP Step 8 和书写规范 §4.9 | done | 本文件 §1、§3 |
| 回答正式真相、快照 / 投影、引用、明确不拥有正文、强一致、最终一致、失败约束和易串仓边界问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中数据归属、一致性和补偿机制污染点 | done | 本文件 §6 |
| 选择按 execution isolation truth 主线推导数据归属,不沿用旧 metadata / allowlist / audit event 三项矩阵 | done | 本文件 §8 |
| 输出数据归属表、一致性策略表、按架构单元数据所有权表、关系图、停审记录和跨数据边界审计 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 8 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 哪些数据由本仓拥有正式真相?

`L4-sandbox` 只拥有 execution isolation truth。它拥有的是正式受控执行语境、隔离环境边界、给定 policy 下的执行裁定、执行输出与材料捕获、失败控制、cleanup / lease / reaper 和 redline containment 相关事实,不是 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store、policy definition truth 或 isolation backend 产品 truth。

| 正式真相数据 | 判断 |
|---|---|
| 正式受控执行请求语境 | 由 sandbox 拥有正式受理、拒绝和请求归责的隔离执行语境真相。 |
| 执行环境身份与责任链绑定事实 | 由 sandbox 拥有 execution environment identity 与 actor / member / work / runner 来源责任链绑定后的隔离环境归责事实。 |
| 受理 / 拒绝归责记录 | 由 sandbox 拥有请求进入或拒绝进入 sandbox 主线的归责记录。 |
| 隔离环境建立事实 | 由 sandbox 拥有正式隔离环境是否建立、何时建立、如何收束的事实。 |
| 有效边界限制事实 | 由 sandbox 拥有 resource、filesystem、network、process 和 workspace boundary 是否有效落实的事实。 |
| 限制落实校验 / 建立拒绝事实 | 由 sandbox 拥有后端能力不足、限制不可验证或边界无法 coherent 建立时的拒绝事实。 |
| 策略执行裁定事实 | 由 sandbox 拥有给定 launch / isolation policy 下继续、拒绝、等待或阻断的执行裁定事实。 |
| 策略缺失 / 冲突 / 不支持保守拒绝事实 | 由 sandbox 拥有 policy 缺失、冲突、不可解析、不支持或不可落实时的 fail-closed 事实。 |
| 高风险边界扩张处置事实 | 由 sandbox 拥有网络放行、文件系统扩张、进程权限扩张等高风险边界动作的处置事实。 |
| 执行结果捕获事实 | 由 sandbox 拥有 stdout / stderr、完成状态、退出语境和结果捕获是否成功的事实。 |
| 输出与候选材料事实 | 由 sandbox 拥有执行产生的输出和候选材料在 sandbox 范围内被安全收口的事实。 |
| usage / audit / observability material 事实 | 由 sandbox 拥有本仓产生并交接的 usage、audit、trace、metric、failure 和 redline material 事实。 |
| 结果 / 候选 / 观测交接事实 | 由 sandbox 拥有将结果、候选材料和观测材料显式交接给 artifact、runtime、runner、observability 或 bus 的交接事实。 |
| capture-failure 事实 | 由 sandbox 拥有结果或材料捕获失败、部分捕获失败和捕获后收束失败的事实。 |
| 稳定失败分类事实 | 由 sandbox 拥有 timeout、resource exceeded、backend failure、policy deny、capture failure、orphan 和 redline 等隔离层稳定失败分类事实。 |
| deny / kill / timeout / replay / cleanup / reaper 控制事实 | 由 sandbox 拥有隔离层控制动作正式发生、被拒绝、被收束或被归责的事实。 |
| lease / orphan / recovery 收束事实 | 由 sandbox 拥有 lease expiry、orphan environment、隔离层 recovery / containment 收束事实。 |
| cleanup guard 事实 | 由 sandbox 拥有 cleanup 前材料保留、安全交接和删除放行 / 阻断判断事实。 |
| redline containment / investigation 事实 | 由 sandbox 拥有安全红线识别、保守收束、调查交接和托管外运行阻断事实。 |

### 5.2 哪些数据只是快照 / 投影?

快照 / 投影只服务稳定判断、追溯、展示、交接、排障、趋势和对账,不得形成独立 sandbox truth,也不得反写上游或下游正式真相。

| 快照 / 投影数据 | 上游或来源 |
|---|---|
| 调用方上下文摘要 | `L1-identity`、`L1-work`、`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner` 等调用方或语境来源。 |
| backend carrier capability 摘要 | isolation backend、host、cluster、workspace source 或承载能力来源。 |
| policy applicability / authorization 摘要 | `L1-governance`、`L3-capability-hub`、`L2-tools` 或其他 policy / authorization 来源。 |
| 下游安全交接 / 调查开放状态摘要 | artifact、observability、runtime、runner、investigation 或安全交接来源。 |
| 观测 / 事件协作投影 | sandbox truth 和 `L0-bus` / observability 消费边界派生。 |
| inspect / preview / trend 派生材料 | sandbox truth、capture material、handoff 状态和 backend capability 摘要派生。 |

### 5.3 哪些数据只是引用关系?

引用关系只保存对外部对象、外部正文、外部材料或下游交接对象的稳定回链,不保存外部正文,也不承担外部生命周期。

| 引用关系数据 | 外部对象 |
|---|---|
| identity / work / runner / tool / runtime request refs | actor、member、project、work、runner run、tool invocation、runtime execution request。 |
| backend carrier / workspace source refs | backend carrier、host / cluster、workspace source、material source。 |
| policy / approval / capability refs | policy、authorization、approval、capability、tool policy 来源。 |
| artifact / runtime / runner / observability handoff refs | artifact handoff、runtime result handoff、runner handoff、observability material handoff。 |
| runtime / artifact / observability / investigation refs | runtime recover / investigation 外部对象、artifact retention / evidence 外部对象、observability trace / audit 外部对象、investigation case 外部对象。 |
| bus / trace / correlation refs | `L0-bus` 协作回链、trace context、correlation context。 |

### 5.4 哪些正文 / 真相本仓明确不拥有?

`L4-sandbox` 明确不拥有相邻仓正文、运行层业务正文、policy 定义正文、下游制品正文、观测存储正文、宿主生命周期正文、调查工单正文和产品入口正文。即便这些正文参与执行判断、归责、交接或排障,也只能以引用、摘要、safe summary、material fact 或 handoff fact 进入。

| 明确不拥有的正文 / 真相 | 原因 |
|---|---|
| actor / member / project / work / runner / runtime / tool semantic 正文 | identity、work、runner、runtime 和 tool semantic truth 不属于 sandbox。 |
| ToolDefinition、ToolPolicy、ToolInvocationResult、ToolAuditEntry 正文 | tools semantic execution 和工具结果 truth 属于 `L2-tools`。 |
| ExecutionInstance、agent loop、step progression、checkpoint / recover 正文 | runtime agent loop 和 recover truth 属于 `L2-runtime`。 |
| SandboxBinding、MemberExecutionHost、host lifecycle 和 member host binding 正文 | member lifecycle orchestration 和宿主装配 truth 属于 `L2-member-service`。 |
| 宿主文件系统正文、host / cluster lifecycle 正文、backend 产品状态正文 | isolation backend 和基础设施生命周期不属于 sandbox truth。 |
| allowlist 正文、policy DSL 正文、approval workflow 正文、capability registry 正文 | policy definition、approval 和 capability truth 属于外部治理 / 能力来源。 |
| Artifact 正式正文、baseline / evidence 正文、artifact retention 正文 | formal artifact、baseline、evidence 和 retention truth 属于 `L1-artifact` / archive 边界。 |
| observability store 正文、raw audit store 正文、trace / metric / alert store 正文 | 物理观测存储 truth 属于 `L4-observability`。 |
| conversation / UI 展示正文、operator console / replay UI 正文 | 产品入口和操作界面私有状态不属于 sandbox。 |
| investigation case lifecycle 正文和外部安全工单正文 | sandbox 可保留 redline containment / investigation 事实和 refs,但不拥有外部调查生命周期正文。 |

### 5.5 哪些关系必须强一致?

强一致只用于 sandbox 正式真相内部关系,以及正式真相形成时必须同时成立的关键边界判断。受理、身份、边界、policy、capture、failure、control、cleanup guard 和 redline 不能被写成半成立状态。

| 强一致关系 | 原因 |
|---|---|
| 正式受控执行请求语境与执行环境身份 / 责任链绑定 | 真实执行开始前必须能归责到正式 sandbox environment identity。 |
| 正式受理 / 拒绝与归责记录 | 入口语义不能在调用方和 sandbox 之间形成两套判断。 |
| 隔离环境建立事实与有效边界限制事实 | 真实执行必须在已建立且边界 coherent 的隔离环境内发生。 |
| 限制落实校验与建立拒绝事实 | 必需边界不可落实时必须显式拒绝,不得 silent degrade。 |
| 策略执行裁定事实与给定 policy / authorization 摘要的适用判断 | sandbox 可以拥有裁定事实,但裁定必须能回到给定策略语境。 |
| 策略缺失 / 冲突 / 不支持与保守拒绝事实 | policy 不完备时不得继续执行或补造 permissive default。 |
| 执行结果捕获事实与输出 / 候选材料事实 | 捕获结果必须说明哪些材料已进入 sandbox capture 语境。 |
| 结果 / 候选 / 观测交接事实与 capture material | 交接只能围绕已被 sandbox 捕获或明确 capture-failure 的材料成立。 |
| 稳定失败分类事实与 control fact | 失败分类和 deny / kill / timeout / cleanup / reaper 控制事实必须围绕同一受控执行语境解释。 |
| cleanup guard 与材料保留 / 安全交接判断 | cleanup 不能先于关键材料安全交接或调查放行而删除证据。 |
| lease / orphan / reaper 与 isolation environment lifecycle | 孤儿环境和租约到期必须进入受控收束,不能托管外继续运行。 |
| redline containment 与 investigation handoff | 安全红线必须形成保守收束和可追溯调查交接,不得静默扩散。 |

### 5.6 哪些关系可以最终一致?

最终一致用于外部快照刷新、下游显化、观测消费、事件协作、只读投影、inspect / preview / trend 和下游 handoff 状态传播。这些关系可以延迟、重建、挂起或显示 stale,但不能反向改变 sandbox truth。

| 最终一致关系 | 原因 |
|---|---|
| 外部 truth 到 sandbox 本地摘要 | 调用方、backend、policy 和调查状态摘要可能滞后,只能服务判断,不能替代外部 truth。 |
| sandbox truth 到 observability / bus 投影 | 事件协作和观测消费可延迟,但 observability store / bus 不能替代 sandbox truth store。 |
| sandbox truth 到 artifact / runtime / runner handoff 显化 | 下游消费失败只影响交接状态或消费体验,不改变 capture truth。 |
| capture material 到 preview / inspect / trend | 预览、调查辅助和趋势分析可延迟或重建,不得成为正式 capture 或 failure truth。 |
| cleanup / redline 材料到外部 investigation / observability 消费 | 下游安全调查和观测可异步消费,但 sandbox 必须保留本仓 guard 和 containment fact。 |
| 后端能力比较、容量趋势和多宿主调度派生材料 | 外围增强可基于 truth 派生,不得定义正式隔离边界或后端 product truth。 |

### 5.7 失败时靠什么口径约束、补偿或挂起?

| 失败类型 | 架构层处理口径 |
|---|---|
| sandbox 主真相内部强一致失败 | 明确失败或保持原状态,不得写成部分完成或成功。 |
| 正式执行语境缺失或引用不可归责 | 拒绝受理或挂起等待补充语境,不得匿名执行或由调用方补造第二入口。 |
| backend capability 摘要缺失、过期或与请求边界不匹配 | 显式拒绝、等待或保守失败,不得降级到弱隔离或宿主直跑。 |
| policy 来源缺失、冲突、不可解析或不支持 | fail-closed,形成保守拒绝事实,不得 permissive fallback。 |
| 外部引用目标不存在或不可解析 | 标记 missing / invalid / unresolved,挂起相关收束或拒绝,不得保存正文补齐。 |
| 下游 handoff 延迟或失败 | 保留 pending / failed / retryable handoff 事实,不得把 material 静默升级为下游 truth。 |
| observability / bus 消费失败 | 保留本仓 material 和交接失败语义,不得接管 observability store 或丢失核心追溯。 |
| capture failure | 形成 capture-failure truth,保留已知材料语境和失败分类,不得伪造完整 capture。 |
| cleanup guard 不满足 | 阻断 cleanup 或进入保守 pending,不得先删证据再补交接。 |
| lease / orphan / reaper 失败 | 形成稳定失败分类和保守收束事实,不得让环境在托管恢复路径之外继续运行。 |
| redline containment / investigation 交接不完整 | 进入保守 containment 或 pending investigation,不得解除安全收束。 |
| 重复 control signal、重复 handoff 或乱序事件协作 | 保持同一正式控制含义、幂等收束或挂起对账,不得生成第二套正式语义。 |

### 5.8 哪些数据边界如果不写清,后续最容易串仓?

最容易串仓的数据边界是:

1. execution environment identity 与 actor / member / work / runner / runtime 正文。
2. sandbox request truth 与 ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun。
3. coherent boundary truth 与 Docker/gVisor/Firecracker/k8s/local_process、host lifecycle、workspace 正文。
4. policy execution decision 与 allowlist、policy DSL、approval workflow、capability registry、ToolPolicy。
5. captured output / candidate material 与 formal artifact、baseline、evidence、retention truth。
6. usage / audit / observability material 与 observability audit ledger、trace store、metric store。
7. failure / control fact 与 runtime recover、runner retry、operator replay UI。
8. cleanup guard 与 artifact retention、external investigation case lifecycle、SRE 私有清理脚本。
9. inspect / preview / trend / backend comparison 与 sandbox 核心 truth。
10. bus event / observability projection 与 sandbox truth / material 状态承载。

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 / 关键依赖 | 写 Docker、gVisor、Firecracker、containerd、runc 等后端线索。 | 后端产品能力或生命周期容易被误写成 sandbox 数据 truth。 | 只保留 `backend carrier capability 摘要` 和 `backend carrier / workspace source refs`;后端产品 truth 明确不拥有。 |
| 核心职责 | 写默认无出网、白名单必须 Policy 授权、审计事件。 | allowlist 正文和 audit event 容易替代 policy execution truth 与 material fact。 | policy 定义只作摘要 / 引用;usage / audit / observability material 由 sandbox 拥有事实,不拥有观测存储正文。 |
| 目录结构 | 写 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 源码目录不是数据归属或一致性策略。 | 不继承。 |
| 性能 / 安全线索 | 写启动时延、销毁时延、seccomp、AppArmor、cap drop。 | 候选指标和配置机制不属于 Step 8 数据所有权。 | 后续 Step 10、04、05、06 或 07 再判断。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| `SandboxExecution metadata` 强一致 | 名称偏实现对象和 metadata,无法覆盖受理、身份、边界、policy、capture、failure、cleanup 和 redline 全 truth。 | 改为 execution isolation truth 数据族,按正式真相数据逐项说明。 |
| `allowlist snapshot` 由 capability-hub 到 sandbox view 最终一致 | 把 policy 来源固定为 allowlist / capability-hub,并可能把外部 policy truth 写成本仓 view。 | 改为 policy applicability / authorization 摘要和 policy / approval / capability refs;缺失或冲突 fail-closed。 |
| `audit events` 最终一致 | 把 event 名称和 observability 消费当作数据所有权主语。 | 改为 usage / audit / observability material 事实、handoff fact 和 observability store 禁区。 |
| `audit 事件发送失败 -> backlog / replay` | 滑入补偿实现和事件机制。 | 本步只写 pending / failed / retryable handoff 口径,不写 outbox、topic、重试或 replay 实现。 |
| `backend 初始化失败 -> fallback 下一个后端(若策略允许)` | fallback 规则提前固化,且易允许弱边界 silent degrade。 | 改为 backend capability 不满足时显式拒绝、等待或保守失败;不得弱隔离降级。 |
| `policy lookup 失败 -> deny by default` | 方向正确但只覆盖 lookup,未覆盖 policy 缺失、冲突、不支持和不可落实。 | 扩展为 policy fail-closed 数据 truth 和一致性口径。 |

### 6.3 上游 / 下游边界诊断

| 易混对象 | 串仓风险 | 本步防线 |
|---|---|---|
| `L2-tools` | ToolPolicy、ToolInvocationResult 或 tool semantic output 反写 sandbox capture / policy truth。 | tool 只作为 request refs、policy refs 或 downstream consumer;tool semantic 正文禁止保存。 |
| `L2-runtime` | ExecutionInstance、agent loop、recover 和 step progression 变成 sandbox failure truth。 | sandbox 只拥有隔离层 failure / control fact;runtime recover 正文禁止保存。 |
| `L2-member-service` | SandboxBinding、host lifecycle 或 member host binding 变成 sandbox environment identity truth。 | sandbox 拥有执行环境身份与责任链绑定事实,不拥有 member host binding 正文。 |
| `L1-identity` / `L1-work` | actor、member、project、work 正文进入 sandbox intake truth。 | 只允许上下文摘要和 refs。 |
| `L1-artifact` | captured output 或 candidate material 静默升级为 formal artifact / evidence truth。 | sandbox 拥有 capture / material / handoff fact,不拥有 formal artifact 正文。 |
| `L4-observability` | audit ledger、metric、trace store 替代 sandbox truth store。 | sandbox 拥有 observability material fact,不拥有 observability store 正文。 |
| policy / capability 来源 | allowlist、policy DSL、approval workflow 进入 sandbox truth。 | sandbox 只拥有给定 policy 下的执行裁定和保守拒绝事实。 |
| isolation backend | 后端产品能力、host lifecycle 或 workspace 正文定义 coherent boundary。 | backend capability 只作摘要;正式边界限制事实由 sandbox 拥有,后端不能反写。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | `SandboxExecution metadata`、`allowlist snapshot`、`audit events`。 | 正式受控执行语境、执行环境身份、隔离边界、policy 裁定、capture / handoff、failure / control、cleanup / redline truth。 | 覆盖 `C-SBX-1~5`,避免旧对象名和事件名过窄。 |
| policy 数据 | capability-hub allowlist view 最终一致。 | sandbox 只拥有给定 policy 的执行裁定和 fail-closed 事实;policy 正文只作摘要 / 引用或禁止保存。 | 防止 policy definition truth 入仓。 |
| 后端数据 | backend capability flags 或 fallback 逻辑。 | backend capability 摘要和 carrier / workspace refs 只服务判断;coherent boundary truth 由 sandbox 拥有。 | 防止后端产品反向定义隔离语义。 |
| capture / audit 数据 | audit event 作为主要输出数据。 | capture fact、candidate material fact、observability material fact 和 handoff fact 分层。 | 防止 observability store 或事件流替代 sandbox material truth。 |
| cleanup / redline 数据 | 旧文档只在补偿机制和风险中散落。 | control fact、lease / orphan 收束、cleanup guard 和 redline containment / investigation 明确为正式真相。 | cleanup / reaper 是 sandbox 核心非 happy path,不能落入运维脚本。 |
| 一致性策略 | 强一致 / 最终一致 + 少量补偿机制。 | 核心 truth 强一致,快照 / 投影最终一致,引用有效性一致,边界约束一致,control 幂等一致。 | 从数据归属推导一致性,不写具体事务或重试实现。 |
| 派生材料 | 旧材料缺 inspect / preview / trend 边界。 | inspect / preview / trend 明确为派生材料,不得反写真相或成为验收伪来源。 | 支撑外围增强但不污染核心闭环。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `SandboxExecution metadata / allowlist snapshot / audit events` 三项矩阵 | 表短,接近旧文档。 | 无法覆盖身份、边界、policy、capture、failure、cleanup、redline 和外部正文禁区。 | 不采用。 |
| 方案 B: 以 execution isolation truth 为中心,按四类数据归属 + 一致性口径重建 | 对齐正式 `00` 和 Step 5~7,能支撑后续概要 / 详细设计。 | 表格较长,后续仍需下沉对象和状态。 | 采用。 |
| 方案 C: 把所有 sandbox 相关数据都强一致 | 语义最硬。 | 外部摘要、投影、handoff 和观测消费会过度耦合。 | 不采用。 |
| 方案 D: 把所有跨边界关系都最终一致 | 起步简单。 | 会破坏入口、身份、边界、policy、capture、cleanup 和 redline 主 truth。 | 不采用。 |
| 方案 E: 把 observability / bus / audit event 作为追溯 truth source | 看起来利于排障。 | 观测和事件协作会替代 sandbox truth / material 状态承载。 | 不采用。 |
| 方案 F: 把 backend capability flags 和 fallback 作为一致性核心 | 贴近后端实现。 | 后端产品会反向定义 coherent boundary,也会引入 silent degrade 风险。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 allowlist / policy DSL 写成 sandbox truth | A. 写入;B. 只保留 policy 摘要 / 引用,sandbox 只拥有执行裁定事实 | B | sandbox 执行给定 policy,不拥有 policy definition 或 approval truth。 | 本步采用 B。 |
| backend capability 是否可决定 sandbox truth | A. 可以;B. 只能作为摘要,coherent boundary truth 由 sandbox 拥有 | B | 后端能力影响能否建立边界,但不能定义隔离语义。 | 本步采用 B。 |
| observability material 是否等同 observability store truth | A. 等同;B. 不等同,sandbox 只拥有 material fact 和 handoff fact | B | 观测存储和查询 truth 属于 `L4-observability`。 | 本步采用 B。 |
| cleanup / reaper 是否可作为运维私有补偿 | A. 可以;B. 不可以,必须拥有 sandbox control truth 和 cleanup guard truth | B | cleanup 先删证据是一票否决,必须进入 sandbox 正式 truth。 | 本步采用 B。 |
| inspect / preview / trend 是否形成新 truth | A. 形成;B. 只作派生材料,不得反写真相 | B | 外围增强不能成为核心闭环前置或验收伪来源。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.0 结论摘要

| 结论类型 | 结论 |
|---|---|
| 数据所有权结论 | `L4-sandbox` 只拥有 execution isolation truth:正式受控执行语境、执行环境身份、coherent boundary、policy execution decision、capture / handoff、failure / control、cleanup guard、lease / orphan / reaper 和 redline containment。 |
| 数据分类结论 | 本仓数据按正式真相数据、快照 / 投影数据、引用关系数据、明确不拥有的正文 / 真相四类定稿;本地存在的 summary、projection、ref、handoff pointer 和 inspect material 不等于拥有外部正式真相。 |
| 一致性口径结论 | 核心 truth 内部采用强一致;外部摘要和派生消费采用最终一致;外部 refs 采用引用有效性一致;重复 control / handoff / event collaboration 采用幂等一致;cleanup / redline 采用 guard / containment 优先的一致性口径。 |
| 补偿 / 约束结论 | 一致性暂时不成立时只能显式失败、pending、stale、unresolved、failed、retryable、refusal 或 containment;不得伪造成功 truth、不得用外部正文补齐、不得 silent degrade、不得 cleanup 先删证据。 |

### 9.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 正式受控执行请求语境 | 正式真相数据 | 由 sandbox 拥有正式受理、拒绝和归责的执行隔离请求语境。 | 不等于 ToolInvocation、ExecutionInstance、RunnerRun 或调用方私有请求正文。 |
| 执行环境身份与责任链绑定事实 | 正式真相数据 | 由 sandbox 拥有 execution environment identity 与责任链绑定后的归责事实。 | 不拥有 actor、member、project、work 或 member host binding 正文。 |
| 受理 / 拒绝归责记录 | 正式真相数据 | 由 sandbox 拥有请求进入、拒绝进入或等待补充语境的归责记录。 | 调用方不能补造第二套正式入口语义。 |
| 隔离环境建立事实 | 正式真相数据 | 由 sandbox 拥有正式隔离环境建立、终止和回收事实。 | 不等于 Docker/gVisor/Firecracker/k8s/local_process 等后端产品生命周期。 |
| 有效边界限制事实 | 正式真相数据 | 由 sandbox 拥有 resource、filesystem、network、process 和 workspace boundary 的有效限制事实。 | 后端支持能力不能反向改写 coherent boundary 语义。 |
| 限制落实校验 / 建立拒绝事实 | 正式真相数据 | 由 sandbox 拥有限制不可落实、不可验证、后端不支持或建立失败时的拒绝事实。 | 不得通过弱隔离、宿主直跑或 silent degrade 补齐。 |
| 策略执行裁定事实 | 正式真相数据 | 由 sandbox 拥有给定 launch / isolation policy 下继续、等待、拒绝或阻断的执行裁定事实。 | 不拥有 policy definition、approval 或 capability truth。 |
| 策略缺失 / 冲突 / 不支持保守拒绝事实 | 正式真相数据 | 由 sandbox 拥有 policy 缺失、冲突、不可解析、不支持或不可落实时的 fail-closed 事实。 | 不得使用 permissive fallback 或调用方默认放行。 |
| 高风险边界扩张处置事实 | 正式真相数据 | 由 sandbox 拥有网络、文件系统、进程权限或资源扩张等高风险动作的处置事实。 | 扩张依据来自外部授权摘要 / 引用,但处置事实归 sandbox。 |
| 执行结果捕获事实 | 正式真相数据 | 由 sandbox 拥有执行结果、退出语境、完成状态和捕获是否成功的事实。 | 不等于 runtime result truth 或 tool semantic result truth。 |
| 输出与候选材料事实 | 正式真相数据 | 由 sandbox 拥有输出和候选材料在 sandbox 范围内被安全收口的事实。 | 不静默升级为 formal artifact、baseline、evidence 或 retention truth。 |
| usage / audit / observability material 事实 | 正式真相数据 | 由 sandbox 拥有本仓产生并用于交接的 usage、audit、trace、metric、failure 和 redline material 事实。 | 不拥有 observability store、raw audit store、trace store 或 metric store 正文。 |
| 结果 / 候选 / 观测交接事实 | 正式真相数据 | 由 sandbox 拥有材料向 artifact、runtime、runner、observability 或 bus 显式交接的事实。 | handoff 事实不代表下游已形成正式 truth。 |
| capture-failure 事实 | 正式真相数据 | 由 sandbox 拥有输出、候选材料或观测材料 capture 失败和收束失败事实。 | 不得伪造完整 capture 或让下游补造 sandbox truth。 |
| 稳定失败分类事实 | 正式真相数据 | 由 sandbox 拥有 timeout、deny、resource exceeded、backend failure、capture failure、orphan、redline 等分类事实。 | 不等于 runtime business failure 或 runner retry state。 |
| deny / kill / timeout / replay / cleanup / reaper 控制事实 | 正式真相数据 | 由 sandbox 拥有隔离层控制动作正式发生、被拒绝、被收束或被归责的事实。 | operator UI 或调用方控制面不能替代该控制 truth。 |
| lease / orphan / recovery 收束事实 | 正式真相数据 | 由 sandbox 拥有租约到期、孤儿环境和隔离层 recovery / containment 的收束事实。 | 不拥有 runtime recover 正文或 member host lifecycle。 |
| cleanup guard 事实 | 正式真相数据 | 由 sandbox 拥有 cleanup 前材料保留、安全交接和删除放行 / 阻断判断事实。 | artifact retention 或 investigation lifecycle 不归 sandbox,但 guard fact 必须由 sandbox 拥有。 |
| redline containment / investigation 事实 | 正式真相数据 | 由 sandbox 拥有安全红线识别、保守收束、调查交接和托管外运行阻断事实。 | 不拥有外部调查工单正文或 operator replay UI 正文。 |
| 调用方上下文摘要 | 快照 / 投影数据 | sandbox 可为稳定 intake 保留 actor / member / work / runner / tool / runtime 来源摘要。 | 上游正式真相仍归对应仓;摘要过期不得补造上游 truth。 |
| backend carrier capability 摘要 | 快照 / 投影数据 | sandbox 可为边界可落实性判断保留承载能力摘要。 | 后端产品、host、cluster 和 workspace source 正文不归 sandbox。 |
| policy applicability / authorization 摘要 | 快照 / 投影数据 | sandbox 可为 policy 执行裁定保留适用性、授权和约束摘要。 | allowlist、policy DSL、approval workflow 和 capability registry 正文不归 sandbox。 |
| 下游安全交接 / 调查开放状态摘要 | 快照 / 投影数据 | sandbox 可为 cleanup guard、reaper 和 redline 收束保留下游交接或调查开放状态摘要。 | 下游安全交接 truth、artifact retention truth 和 investigation lifecycle 不归 sandbox。 |
| 观测 / 事件协作投影 | 快照 / 投影数据 | 由 sandbox truth 派生,服务观测消费、事件协作、状态显化和对账。 | 可延迟、可重建、可失败,不得反写 sandbox truth。 |
| inspect / preview / trend 派生材料 | 快照 / 投影数据 | 由 sandbox truth 和 capture / handoff material 派生,服务调查、预览、能力比较和趋势分析。 | 不得成为核心 truth、验收签署来源或 policy / backend truth。 |
| identity / work / runner / tool / runtime request refs | 引用关系数据 | sandbox 只保存对调用方、身份、工作和运行请求来源的引用关系。 | 引用存在不代表拥有外部正文或生命周期。 |
| backend carrier / workspace source refs | 引用关系数据 | sandbox 只保存对承载、workspace source 或材料来源的引用关系。 | 不保存宿主文件系统正文、host lifecycle 或 workspace 正文。 |
| policy / approval / capability refs | 引用关系数据 | sandbox 只保存对 policy、authorization、approval、capability 或 tool policy 来源的引用关系。 | 不保存 policy DSL、allowlist、approval workflow 或 capability registry 正文。 |
| artifact / runtime / runner / observability handoff refs | 引用关系数据 | sandbox 只保存对下游材料交接对象的引用关系。 | 引用不代表下游已接受或形成下游正式 truth。 |
| runtime / artifact / observability / investigation refs | 引用关系数据 | sandbox 只保存对 runtime recover、artifact retention、observability record 或 investigation case 外部对象的引用关系。 | 不接管这些外部对象正文或生命周期。 |
| bus / trace / correlation refs | 引用关系数据 | sandbox 只保存跨边界协作、追溯和关联所需引用。 | 不拥有 bus event store 或 trace storage truth。 |
| actor / member / project / work / runner / runtime / tool semantic 正文 | 明确不拥有的正文 / 真相 | 这些正文和主真相由 identity、work、runner、runtime 或 tools 拥有。 | 若进入本仓会打穿 execution identity 与调用方 truth 边界。 |
| ToolDefinition / ToolPolicy / ToolInvocationResult / ToolAuditEntry 正文 | 明确不拥有的正文 / 真相 | tools semantic execution 和工具结果 truth 不归 sandbox。 | sandbox 只提供隔离层事实和材料。 |
| ExecutionInstance / agent loop / checkpoint / recover 正文 | 明确不拥有的正文 / 真相 | runtime execution 和 recover truth 不归 sandbox。 | sandbox failure fact 不推进 runtime business recovery。 |
| SandboxBinding / MemberExecutionHost / host lifecycle / member host binding 正文 | 明确不拥有的正文 / 真相 | member-service 和宿主装配 truth 不归 sandbox。 | sandbox 可提供隔离环境和材料,不拥有成员生命周期。 |
| 宿主文件系统正文、host / cluster lifecycle 正文、backend 产品状态正文 | 明确不拥有的正文 / 真相 | 基础设施和后端产品生命周期不归 sandbox。 | backend 只能通过 capability 摘要和 refs 参与判断。 |
| allowlist 正文、policy DSL 正文、approval workflow 正文、capability registry 正文 | 明确不拥有的正文 / 真相 | policy、approval 和 capability definition truth 不归 sandbox。 | sandbox 只拥有给定 policy 下的执行裁定。 |
| Artifact 正式正文、baseline / evidence 正文、artifact retention 正文 | 明确不拥有的正文 / 真相 | formal artifact、evidence、baseline 和 retention truth 不归 sandbox。 | capture material 不自动成为 artifact truth。 |
| observability store、raw audit store、trace / metric / alert store 正文 | 明确不拥有的正文 / 真相 | 物理观测存储 truth 不归 sandbox。 | sandbox 只拥有 material fact 和 handoff fact。 |
| conversation / UI 展示正文、operator console / replay UI 正文 | 明确不拥有的正文 / 真相 | 产品入口和操作界面私有状态不归 sandbox。 | UI 不能成为 sandbox control truth。 |
| investigation case lifecycle 正文和外部安全工单正文 | 明确不拥有的正文 / 真相 | 外部调查生命周期不归 sandbox。 | sandbox 只拥有 redline containment / investigation fact 和 refs。 |

### 9.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 正式受控执行请求语境与执行环境身份 / 责任链绑定 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 身份、责任链或引用不可解释时拒绝受理或挂起,不得匿名执行 | 真实执行必须先有可归责的 sandbox environment identity。 |
| 受理 / 拒绝归责记录与调用方请求来源 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 强一致 + 边界约束一致 | 来源缺失或冲突时明确拒绝或 pending,不得由调用方补造第二入口 | 统一入口是防止跨调用方双真相的前提。 |
| 隔离环境建立事实与有效边界限制事实 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 边界不完整、不 coherent 或不可验证时不得形成正式 established | 防止宿主直跑、弱隔离或 silent degrade。 |
| 有效边界限制事实与 backend capability 摘要 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 强一致 + 快照有效性约束 | backend 摘要缺失、过期或不支持必需限制时拒绝、等待或保守失败 | backend 影响可落实性,但不拥有边界 truth。 |
| 限制落实校验与建立拒绝事实 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 校验未完成或失败时形成拒绝 / pending,不得继续执行 | 建立失败是正式结果,不是可忽略警告。 |
| 策略执行裁定事实与 policy / authorization 摘要 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 强一致 + 引用有效性一致 | policy 缺失、冲突、不可解析或不支持时 fail-closed | sandbox 拥有裁定事实,policy truth 仍由外部拥有。 |
| 高风险边界扩张处置事实与授权引用 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 强一致 + 边界约束一致 | 授权不可解释时拒绝扩张或保守收束 | 高风险动作不能由后端能力或调用方默认放行。 |
| 执行结果捕获事实与输出 / 候选材料事实 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 捕获缺口必须形成 capture-failure,不得伪造完整 capture | capture 是材料分层交接的前提。 |
| usage / audit / observability material 事实与受控执行语境 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 缺少来源语境时不得形成正式 material fact | 观测材料必须能回到同一 sandbox execution context。 |
| 结果 / 候选 / 观测交接事实与 handoff refs | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 + 最终一致 | 下游未确认或引用不可解析时保持 pending / failed / retryable,不得宣布下游 truth | sandbox 只拥有交接事实,不拥有 artifact / observability / runtime truth。 |
| capture-failure 事实与下游消费 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 强一致 + 最终一致 | 下游消费失败或延迟时保留 failure / handoff 状态,不得补造成功结果 | capture 失败必须显式暴露。 |
| 稳定失败分类事实与 control fact | 正式真相数据 ↔ 正式真相数据 | 强一致 | 分类或控制事实不闭合时不得写成 completed success | 失败和控制动作必须围绕同一执行语境可解释。 |
| 重复 deny / kill / timeout / replay / cleanup / reaper 信号 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 幂等一致 | 重复信号返回同一正式控制含义或忽略;冲突信号挂起对账 | 防止同一控制动作出现第二套正式语义。 |
| lease / orphan / recovery 收束事实与 isolation environment lifecycle | 正式真相数据 ↔ 正式真相数据 / 快照 / 投影数据 | 强一致 + 保守收束一致 | lease 或 orphan 状态不可解释时进入保守 containment,不得托管外继续运行 | reaper 是受控执行生命周期的一部分。 |
| cleanup guard 与 capture / audit / investigation material | 正式真相数据 ↔ 正式真相数据 / 快照 / 投影数据 / 引用关系数据 | guard 一致 + 强一致 | 材料未安全交接或调查未放行时阻断 cleanup 或 pending | cleanup 先删证据是一票否决。 |
| redline containment / investigation 与安全交接引用 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 强一致 + 引用有效性一致 | 调查引用或安全交接不可解释时保持 containment,不得解除红线收束 | redline 不能因下游延迟而静默扩散。 |
| 外部 truth 到 sandbox 本地摘要 | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 | 最终一致 + 边界约束一致 | 标记 stale / unresolved / pending,不得复制正文补齐 | 快照只服务判断和解释。 |
| 外部对象引用有效性 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 保持 missing / invalid / unresolved,挂起相关收束或拒绝 | 引用成立不等于正文归属转移。 |
| sandbox truth 到 observability / bus 投影 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 | 投影失败暴露 unavailable / failed / retryable,不得改变 sandbox truth | 观测和事件协作是消费面,不是 truth source。 |
| sandbox truth 到 inspect / preview / trend 派生材料 | 正式真相数据 ↔ 快照 / 投影数据 | 只读一致 + 最终一致 | 派生失败只影响辅助视图,不得推进核心状态 | 外围增强可滞后、可重建、可关闭。 |
| 明确不拥有正文被请求写入 sandbox | 明确不拥有的正文 / 真相 ↔ 正式真相数据 | 边界约束一致 | 拒绝、挂起或转换为引用 / 摘要 / safe summary,不得保存正文 | 防止 identity / work / tool / runtime / artifact / observability 等正文入仓。 |

### 9.3 按架构单元组织的数据所有权表

| 架构单元 | 拥有 truth | 只持有 snapshot / projection | 只持有 reference | forbidden body / forbidden write | 停审结果 |
|---|---|---|---|---|---|
| `Sandbox 核心语义角色` | 正式受控执行请求语境;执行环境身份与责任链绑定事实;隔离环境建立事实;有效边界限制事实;策略执行裁定事实;capture / handoff fact;failure / control / cleanup / redline fact | 不直接拥有外部摘要,只消费已收束摘要 | 必要 request / policy / handoff / investigation refs 的语义占位 | 外部正文、policy definition、artifact truth、observability store、backend product truth | pass |
| `Sandbox 编排 / 承接角色` | 不独立拥有新 truth,只推动核心语义形成正式变化和归责记录 | 调用方上下文摘要、backend capability 摘要、policy applicability 摘要、下游交接状态摘要 | identity / work / runner / tool / runtime refs;backend / workspace refs;policy refs;handoff refs | 绕过核心直接写 truth;把外部正文写入状态承载;调用方补造成功 | pass |
| `外部能力接缝角色` | 不拥有 sandbox core truth,只表达边界转换和 handoff 事实的接缝责任 | 外部 safe summary、stale / pending / unresolved 状态、handoff status summary | 外部对象、外部正文、bus / trace / correlation 和下游 handoff refs | 直接改变核心语义;把运行期依赖写成源码依赖;把外部正文入仓 | pass |
| `本地影子 / 派生辅助角色` | 不拥有业务 truth | 观测 / 事件协作投影、inspect / preview / trend、后端能力比较、容量趋势、对账视图 | 下游消费、观测、调查、追溯和派生来源 refs | 派生结果反写核心;preview 成为 artifact truth;trend 定义 backend truth | pass |
| `技术承载角色` | 不定义业务 truth,只承载正式 truth / material / refs | 存储、索引、运行支撑或能力摘要的承载材料 | isolation backend、material source、event / trace handoff、storage backend refs | 数据库、事件流、后端产品、日志平台或缓存定义业务语义 | pass |

### 9.4 简化关系示意图

```text
+====================================================================+
|                       L4-sandbox 数据边界                           |
|                                                                    |
|   +-----------------------------+                                  |
|   | 正式真相数据                |                                  |
|   | context / identity          |                                  |
|   | boundary / policy           |                                  |
|   | capture / failure / cleanup |                                  |
|   +--------------+--------------+                                  |
|                  | 派生 / 交接                                      |
|                  v                                                  |
|   +--------------+--------------+       +-------------------------+ |
|   | 快照 / 投影数据             |       | 引用关系数据            | |
|   | summaries / projections     |       | refs / handoff links    | |
|   | inspect / preview / trend   |       | trace / correlation     | |
|   +--------------+--------------+       +------------+------------+ |
|                  | 不反写                            | 只引用        |
+==================+===================================+=============+
                   |                                   |
                   v                                   v
       明确不拥有的外部正文 / 外部主真相
       identity / work / tools / runtime / member-service
       policy definitions / backend lifecycle / artifact
       observability store / UI / investigation lifecycle
```

图示说明:

- `正式真相数据` 是 `L4-sandbox` 唯一可以主张拥有的 execution isolation truth。
- `快照 / 投影数据` 和 `引用关系数据` 可以本地存在,但不能反写核心 truth 或吸收外部正文。
- `明确不拥有的外部正文 / 外部主真相` 只能通过引用、摘要、safe summary、material fact 或 handoff fact 参与。
- 该图不表达存储设计、同步流程、事件流、对象模型、事务边界或后端产品选择。

### 9.5 数据所有权停审记录

| 架构单元 | truth 是否唯一 | projection / cache 是否禁止反写 | external body 是否禁止保存 | 一致性口径是否清楚 | 停审结果 |
|---|---|---|---|---|---|
| `Sandbox 核心语义角色` | pass | pass | pass | pass | pass |
| `Sandbox 编排 / 承接角色` | pass | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass | pass |
| `本地影子 / 派生辅助角色` | pass | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass | pass |

### 9.6 跨数据边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在双真相 | pass | execution context、identity、boundary、policy decision、capture、failure、cleanup 和 redline truth 均由 sandbox 拥有;调用方、后端和下游只通过正式边界参与。 |
| 是否存在投影反写真相 | pass | 观测 / 事件投影、inspect、preview、trend、backend comparison 和 dashboard 类材料均不得反写核心 truth。 |
| 是否存在引用正文入仓 | pass | identity / work / tool / runtime / member / policy / backend / artifact / observability / UI / investigation 正文均明确不拥有。 |
| 是否存在强一致 / 最终一致误用 | pass | 核心 truth 内部强一致;外部摘要、投影、下游显化和观测消费最终一致;外部 refs 使用引用有效性一致。 |
| 是否存在失败补偿口径冲突 | pass | 失败时按 explicit failure、pending、stale、unresolved、failed、retryable、refusal 或 containment 处理,不伪造 success truth。 |
| 是否存在 cleanup 先删证据风险 | pass | cleanup guard 与材料保留 / 安全交接强约束,未把 cleanup 写成无保护后台补偿。 |
| 是否存在 policy truth 入仓风险 | pass | allowlist / policy DSL / approval workflow / capability registry 均为外部正文或引用,本仓只拥有执行裁定和保守拒绝事实。 |
| 是否存在 backend 产品反写真相风险 | pass | backend 只通过 capability 摘要和 carrier refs 参与;边界 truth 仍由 sandbox 拥有。 |
| 是否存在观测存储替代 truth store 风险 | pass | observability material fact 和 handoff fact 归 sandbox;observability store 正文不归 sandbox。 |
| 是否存在旧技术机制污染 | pass | 旧 metadata / allowlist / audit events / backlog / replay / backend fallback 未作为本步正式机制继承。 |
| 是否存在后续详细设计承接风险 | pass | 本步未写字段、表、schema、event payload、outbox、事务、repository、adapter、配置 key 或后端参数。 |

### 9.7 数据边界说明

`L4-sandbox` 的数据所有权边界是“拥有 execution isolation truth,本地保留判断和消费辅助,引用外部对象和材料,明确排除外部正文与相邻仓主真相”。正式受控执行语境、执行环境身份、coherent boundary、policy execution decision、capture / handoff、failure / control、cleanup guard、lease / orphan / reaper 和 redline containment 属于 sandbox;identity、work、tools、runtime、member-service、policy definition、backend lifecycle、artifact、observability、UI 和 investigation 正文不属于 sandbox。快照、投影、事件协作、inspect、preview、trend 和 handoff 状态可以提升消费、解释、交接和排障能力,但它们的延迟、失效或重建不能改变正式 sandbox truth。后续设计如果需要写字段、表、事件、补偿、索引、后端配置或状态机,必须从本章归属和一致性口径继续下沉,不能反向修改本章边界。

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据归属表”“一致性策略表”“按架构单元组织的数据所有权表”“简化关系示意图”和“跨数据边界审计表”小节,了解本章如何先确认数据归属,再推导一致性策略。

### 9.1 数据归属表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §9.1。

### 9.2 一致性策略表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §9.2。

### 9.3 按架构单元组织的数据所有权表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §9.3。

### 9.4 简化关系示意图

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §9.4。

### 9.5 数据边界说明

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §9.7。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 9 的待确认事项。下列事项进入后续 Step,不得在 Step 8 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH-008-001 | 具体 execution state、failure state、control state 和 cleanup guard state 的对象结构与状态迁移 | 后续 `02/03` 收敛。 |
| Q-SBX-ARCH-008-002 | policy / authorization 来源在不同调用方场景下的接缝矩阵、有效期和冲突表达 | 后续 Step 9、`02/03/04` 收敛。 |
| Q-SBX-ARCH-008-003 | isolation backend 能力摘要的具体来源、刷新、验证和后端产品组合 | 后续 Step 10、`04/07` 收敛。 |
| Q-SBX-ARCH-008-004 | artifact、runtime、runner、observability 和 bus handoff 的交互方式、ack 语义和失败表达 | 后续 Step 9、`03/05/06` 收敛。 |
| Q-SBX-ARCH-008-005 | inspect / preview / replay / trend 是否进入当前实施范围以及如何证明不反写核心 truth | 后续 Step 13、`07` 收敛。 |

---

## 12. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确正式真相数据、快照 / 投影数据、引用关系数据和明确不拥有正文 | pass | §9.1 已按四类数据归属列出。 |
| 是否说明每类数据为什么属于当前归属边界 | pass | §9.1 / §9.7 已给出归属和边界说明。 |
| 是否明确不同数据关系的一致性口径 | pass | §9.2 已区分强一致、最终一致、引用有效性、幂等一致、guard 一致和边界约束一致。 |
| 是否明确一致性暂时不成立时的架构层处理原则 | pass | §5.7 / §9.2 已给出 explicit failure、pending、stale、unresolved、failed、retryable、refusal 和 containment 口径。 |
| 是否按架构单元完成数据所有权停审 | pass | §9.3 / §9.5 已逐项通过。 |
| 是否完成跨数据边界审计 | pass | §9.6 未发现双真相、投影反写、引用正文入仓或一致性冲突。 |
| 是否避免数据库、缓存 / 投影 / outbox、事务、协议或代码模型细节 | pass | 未写字段、表、DDL、event payload、repository、adapter、事务脚本、重试实现、配置 key 或后端参数。 |
| 是否保持正式 `01-架构设计.md` 不变 | pass | 本步只创建中间产物并更新 flow / 台账。 |
| 是否允许进入 Step 9 | pass_wait_review | 当前数据所有权与一致性策略足以支撑关键交互与通信方式讨论;需等待用户确认。 |

当前 Step 8 `数据所有权与一致性策略` 已完成。下一步必须等待用户确认后进入 Step 9 `关键交互与通信方式`,并只创建 / 改写 `design-calibration/01_arch_step_09_interactions_communication.md`。
