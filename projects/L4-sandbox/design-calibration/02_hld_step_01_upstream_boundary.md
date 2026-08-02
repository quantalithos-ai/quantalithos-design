# Step 1. 确认上游输入边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 1
> 回填章节: `02-概要设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 只确认 `02-概要设计.md` 可承接哪些上游结论,不展开代码主体、关键对象、接口、处理流或状态机。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 `02` | 是。用户在正式 `01` 完成后回复“同意”,允许启动 `02-概要设计.md` full-restart。 |
| 项目级台账是否允许进入 `02` | 是。台账原先停在 `01` Step 16 审查点,用户确认后可进入 `02`。 |
| 文档级 flow 是否已创建 | 是。已创建 `02_hld_calibration_flow.md`,并记录当前 Step 1。 |
| 是否已读取概要 SOP Step 1 | 是。Step 1 只确认上游输入边界,不收口本次设计目标和范围。 |
| 是否已读取概要书写规范 §4.1 | 是。正式 §1 必须输出上游关系映射表、本文不再回答、本文必须回答。 |
| 是否发现阻塞 Step 1 的上游 blocker | 否。旧 `02` 存在污染风险,但已作为 historical material 隔离;`04/07` 缺失属于下游缺口,不阻塞 Step 1。 |

---

## 2. 本步目标

确认当前概要设计依赖的需求结论和架构结论已经收敛到足以支撑“代码主体框架、主要组成部分、对象骨架、接口骨架、关键处理流与状态机”展开的程度,并识别哪些上游边界会直接影响当前概要设计的范围与深度。

本步只确认概要设计可承接什么,不重新讨论需求目标、架构边界、代码主体框架、对象轮廓、接口骨架、处理流或状态机。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 已按新版需求 SOP 重建并已用于 `01` | 提供仓定位、核心能力闭环、角色、功能需求、业务规则、数据归属、接口依赖、NFR、验收和一票否决红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 已按新版架构 SOP 重建,用户已确认可进入 `02` | 提供职责边界、系统上下文、限界上下文、运行承载、依赖方向、数据所有权、一致性、交互方式、机制级选型、风险和 ADR 候选。 |
| `design-calibration/00_req_step_01_*` ~ `00_req_step_17_*` | 已完成 | 用于追溯需求结论来源,不替代正式 `00`。 |
| `design-calibration/01_arch_step_01_*` ~ `01_arch_step_16_*` | 已完成 | 用于追溯架构结论来源,不替代正式 `01`。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 1 | 约束本 Step 的问题、输出和禁止提前展开内容。 |
| `standards/document/概要设计书写规范.md` | 已读取 §3 / §4.1 | 约束正式 `02` 14 章结构和 §1 上游关系声明格式。 |
| `standards/document/设计文档编写通则.md` | 已读取 | 约束概要 / 详细分工、正式正文只承载收口结论和三层门禁。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 约束 flow / Step / 台账、恢复顺序、逐 Step 落盘和旧材料重建纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束后续设计必须形成唯一真相源和可落码闭环;当前 Step 不提前落 schema。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 确认 `L4-sandbox` 唯一编译期依赖 `L0-core`,其他关系按运行期 / 事件 / handoff 裁剪。 |
| 旧 `projects/L4-sandbox/README.md` | historical_material | 作为旧后端、事件、目录、安全 profile 和性能目标污染诊断输入。 |
| 旧 `projects/L4-sandbox/02-概要设计.md` | historical_material | 作为旧概要主线、旧对象词和旧结构问题诊断输入。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`01` flow、`01` Step 16、正式 `00/01`、概要 SOP / 书写规范和通用标准。 | done | 确认当前可启动 `02` Step 1。 |
| 2 | 读取旧 README 和旧 `02`,仅做 historical material 诊断。 | done | 记录旧主线不能直接继承。 |
| 3 | 回答 SOP Step 1 五个问题。 | done | 形成可承接 / 不可承接上游边界。 |
| 4 | 输出上游关系映射表、本文不再回答、本文必须回答和暂不进入范围。 | done | 满足正式 §1 回填输入要求。 |
| 5 | 创建 / 更新 `02_hld_calibration_flow.md` 和项目台账。 | done | Step 1 后停审,不创建 Step 2 文件。 |
| 6 | 自检没有修改正式 `02-概要设计.md`,没有提前展开代码主体 / 对象 / 接口 / flow / 状态。 | done | 进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 当前概要设计要承接哪些需求结论?

当前概要设计必须承接以下需求结论:

- `L4-sandbox` 是平台运行隔离基础仓,负责把需要受控执行的代码、工具、构建、测试或 Runner 应用放入可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。
- `L4-sandbox` 不拥有工具语义执行、runtime agent loop / execution truth、member host lifecycle / orchestration、identity truth、work truth、artifact truth、observability store、governance / capability policy decision 或后端产品 truth。
- 核心能力闭环是 C-SBX-1~5:受控执行语境识别与约束、隔离环境边界建立与限制施加、给定策略内执行与 fail-closed、输出与观测材料安全捕获和分层交接、失败租约清理与安全红线保守收束。
- 功能需求 FR-SBX-001~018 已围绕正式受理、执行环境身份、跨调用方入口、正式隔离环境、统一边界、限制可落实性、policy 承接、高风险动作阻断、policy 缺失冲突保守拒绝、capture、handoff、failure、redline、control、lease / orphan / reaper 收束建立。
- 外围增强 FR-SBX-E01~E06 可作为候选输入,但不得改变核心闭环:风险分层承载、高级 replay / inspect、输出预览、多宿主调度、后端能力比较和容量趋势都不能成为核心 truth 写源。
- 数据归属已经明确:sandbox 只拥有正式受理、执行环境身份、coherent boundary、policy execution decision、capture / handoff、failure / control、cleanup guard、lease / orphan / reaper 和 redline containment 等 execution isolation truth。
- 调用方上下文摘要、backend capability 摘要、policy applicability 摘要、handoff 状态、观测 / 事件协作投影和 inspect / preview / trend 只作为快照、引用、投影或派生材料,不得反写核心 truth。
- 身份 / 工作 / 工具语义 / runtime recover / member host / artifact / observability store / policy DSL / operator UI / backend lifecycle 等正文禁止进入 sandbox truth。
- 验收红线 AC-SBX-001~041 与 VF-SBX-001~010 已把核心闭环断裂、宿主直跑、边界 silent degrade、policy continue、外部正文入仓、material 升格、cleanup 先删证据、orphan / redline 脱管、第二套语义和追溯缺口设为长期边界。

### 5.2 当前概要设计要承接哪些架构结论?

当前概要设计必须承接以下架构结论:

- 架构核心是独立 execution isolation truth,不是普通命令执行器、backend adapter、tools 语义执行、runtime execution truth、member-service 装配 truth、artifact truth、observability store 或 policy definition truth。
- 架构主线是:正式受控执行入口与 execution environment identity -> resource / filesystem / network / process coherent boundary -> given launch / isolation policy execution + fail-closed -> capture fact / candidate material / observability material / handoff fact -> failure classification / control fact / lease / orphan / cleanup guard / reaper -> redline containment / investigation handoff。
- 核心子域已经收稳为五类:正式受控执行语境核心、隔离环境边界核心、策略执行裁定核心、输出捕获与材料交接核心、失败控制与安全收束核心。
- 支撑子域已经收稳为六类:调用方接入语义上下文、后端能力可落实性上下文、policy 来源承接上下文、下游材料消费协调上下文、后台维护与调查协作上下文、外围增强与能力比较上下文。
- 本地索引 / 投影 / 引用层只可持有身份工作引用、调用方入口引用、policy 摘要、backend / workspace 引用、handoff 引用、安全调查摘要、观测事件投影、inspect / preview / trend 派生材料。
- 运行承载已经区分同步入口、异步控制与交接消费、受控执行承接、后台维护与清理、truth / material 状态承载、isolation backend 承载边界、材料 / 观测 / 事件交接边界。
- 依赖方向已经固定:`L0-core` 是唯一编译期依赖;`L0-bus`、identity / work、policy sources、tools、runtime、member-service、runner、artifact、observability 和 isolation backend 只能以运行期、事件协作、refs、snapshot、safe summary、handoff 或基础设施依赖参与。
- 数据所有权与一致性已经固定为 truth / snapshot / reference / forbidden body 分层,核心 truth 强一致,外围 handoff / projection / derived material 最终一致,cleanup guard 和 redline containment 优先。
- 通信方式已经固定为同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接三类路径分离;同步成功不能伪装长时执行、handoff、下游消费、cleanup 或观测消费已完成。
- 机制级技术选择已经收稳,但产品级 Docker / gVisor / Firecracker / k8s、DB、object store、OTel、secrets、GRC、seccomp / AppArmor / cap-drop、SLO 和旧性能数字均未硬化。

### 5.3 哪些结论已经足够稳定,可以直接作为概要设计输入?

足够稳定、可以直接作为概要设计输入的结论包括:

- 仓定位、职责边界、非目标、一票否决红线和 historical material 处理口径。
- C-SBX-1~5 核心能力闭环及其 FR / BR / AC / VF 追溯关系。
- 独立 execution isolation truth 是当前唯一核心真相中心。
- execution environment identity、coherent boundary、policy execution decision、capture fact、handoff fact、failure classification、control fact、cleanup guard、redline containment 等统一语言。
- 核心子域、支撑子域、本地索引 / 投影 / 引用层和运行承载角色。
- 数据分层、外部正文禁止入仓、下游 truth 不迁移、派生不反写、cleanup 不先删证据、redline 不 advisory-only。
- 同步 / 异步 / 后台路径分离,以及下游 ack / failed / pending / retryable 只能影响 handoff / cleanup guard / containment 的边界。
- `L0-core` 唯一编译期依赖和非 core sibling / backend 产品不得进入源码依赖的裁剪结论。
- 后端组合、policy 来源矩阵、handoff ack、大材料治理、failure taxonomy、protocol / state / storage / config / SLO 等未定项的当前保守口径。

### 5.4 哪些结论虽然相关,但仍未收稳,因此当前不能直接往下展开?

以下结论仍未收稳,当前不能作为已定概要设计输入直接展开:

- 正式代码主体框架、主要组成部分命名、各部分能力边界和对象候选池。
- 关键对象清单、对象类型、字段骨架、成员函数骨架、工厂函数骨架和对象不变量。
- Command / Query / Event / Operations Job / external port 的正式名称、参数骨架、返回骨架、错误语义和幂等语义。
- 关键处理流 / 重要函数数据流中的 application service、domain method、repository / port、outbox / handoff / cleanup / reaper 连接方式。
- execution environment、boundary、policy decision、capture、handoff、failure、control、cleanup、redline 的正式状态集合和迁移矩阵。
- backend capability matrix、强隔离 profile、测试 fake / fixture 边界、local_process 禁区和同等边界证明。
- policy / authorization 来源矩阵、网络 / filesystem / process action taxonomy、allowlist 粒度和高风险动作解释材料。
- handoff ack / failed / retryable 协议、material size / retention / storage / safe summary、partial capture 和删除放行口径。
- failure taxonomy、control conflict、lease / orphan / cleanup 状态、redline containment lifecycle 和 investigation handoff。
- DB / object store / cache / OTel / secrets / GRC / message bus / audit store 等产品,以及 API / RPC / SDK / event / outbox / worker 的具体实现形态。
- seccomp / AppArmor / cap drop / mount / network profile、SLO、容量、启动时延、policy 判断开销、capture / cleanup / reaper 阈值。

### 5.5 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里?

以下边界直接决定概要设计当前不该越界:

- 不重新定义需求目标、用户故事、功能需求、业务规则、验收标准、一票否决项和上游仓定位。
- 不重新定义架构职责边界、系统上下文、限界上下文、运行承载、依赖方向、数据所有权、一致性策略、机制级技术选择和备选方案取舍。
- 不把旧 `SandboxExecution`、`SandboxSession`、`SandboxCommand`、`SandboxPolicy`、`SandboxOutput`、`retry / replay`、旧五段主线或旧目录结构直接继承为当前对象 / 模块。
- 不展开完整 Rust struct / enum、完整函数签名、完整伪代码、DDL、repository 函数、协议 schema、event payload、配置 JSON、部署参数、测试用例或实施 commit boundary。
- 不让 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store、policy definition / approval / allowlist / capability truth 混入 sandbox。
- 不把 Docker / gVisor / Firecracker / k8s / local_process、seccomp / AppArmor、cap drop、旧 P95 / SLA 或旧 SB 编号写成当前概要硬事实。
- 不让 inspect、preview、replay、operator control、backend comparison、trend、dashboard 或 query / read surface 变成核心 truth mutation path。
- 不在 Step 1 收口本次设计目标、设计范围、约束条件、代码主体框架或对象 / 接口 / flow / 状态。

---

## 6. 当前文档问题诊断

| 旧材料内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02-概要设计.md` 以“先用人话理解本仓”“新人最容易混淆的几个词”开头 | 更像需求解释和 onboarding 材料,不是当前概要设计的代码主体骨架入口。 | Step 1 只保留其作为历史诊断输入;正式概要后续按新版 14 章主链重建。 |
| 旧 `SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxPolicy` / `SandboxOutput` | 名称接近对象定义,但未从新版 `01` 的 truth / subdomain / data ownership 推导,且夹带 runtime/tools/capability/artifact 混层风险。 | 不直接继承。后续 Step 5~6 从主要组成部分和对象候选池重新筛选正式对象。 |
| 旧“五段主线”:执行请求与会话、隔离资源、命令/provider、输出审计、失败运维控制 | 能提供主题线索,但未覆盖新版 policy fail-closed、handoff 分层、cleanup guard、redline containment 和派生不反写边界。 | 只作为 historical material;后续 Step 4~5 重新映射代码主体和主要组成部分。 |
| 旧问题量化、资源约束和性能目标 | 写入未验证的旧数字和容量假设,与新版 `00/01` 后置 SLO / 测试验收口径冲突。 | 不承接为概要结论;后续 `05/06` 或 ADR / 配置 / 实施前再闭口。 |
| 旧上下文图混入 capability-hub、provider、operator 和 artifact / conversation | 与新版 dependency crop、policy ownership、artifact truth、observability store 边界不一致。 | 后续正式 `02` 只承接新版 `01` 上下文和概要 Step 产物。 |
| 旧 README 固化 Docker + gVisor、SandboxService trait、审计事件、目录结构、安全 profile 和性能目标 | 把产品、代码目录、事件名和指标写成事实,超出当前概要 Step 1 输入边界。 | 记录为 historical material;后续各 Step 独立审计,不得直接继承。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 上游承接 | 旧 `02` 主要承接旧 `01`、旧 README 和历史对象词。 | 当前只承接新版 `00-需求文档.md`、新版 `01-架构设计.md` 和已完成 calibration。 |
| 概要主线 | “新人理解 + 旧对象词 + 五段执行隔离叙事”。 | 后续将按代码主体框架、主要组成部分、对象、接口、处理流、状态、异常、配置影响和详细设计承接清单推进。 |
| 上游边界 | 需求、架构、概要和详细设计候选混写。 | Step 1 只确认上游输入边界;Step 2 再收设计目标与范围;Step 4 以后才逐步下沉。 |
| 历史技术假设 | Docker/gVisor、local_process、SandboxService、旧事件和旧性能目标容易回流。 | 全部标记为 historical material 或待确认,不得成为当前已定结论。 |
| 正式文档生成方式 | 旧 Draft 结构和元信息。 | Step 14 才按新版概要书写规范整体重建,每章写具体校准来源。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 沿用旧 `02-概要设计.md` 并局部替换术语 | 改动小。 | 旧对象词、旧后端、旧指标和旧结构会持续污染新版主线。 | 不采用。 |
| 直接删除旧 `02` 并一次性写新版全文 | 看起来推进快。 | 跳过 Step 1~13 中间产物和用户停审,违反 SOP。 | 不采用。 |
| Step 1 先确认上游输入边界,再逐 Step 重建 | 符合 SOP,能阻断旧材料回流。 | 需要逐步形成 14 个中间产物。 | 采用。 |
| 在 Step 1 直接定义对象和接口 | 能显得更可落码。 | 违反 Step 1 只确认输入边界;对象 / 接口必须来自 Step 5~7。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 仓定位、C-SBX-1~5、US / FR / BR / AC / VF、数据归属、接口依赖、NFR 和红线。 | 转译为代码主体框架、主要组成部分、对象候选、接口骨架、处理流、状态机、异常边界、配置影响和详细设计承接清单。 |
| `projects/L4-sandbox/01-架构设计.md` | execution isolation truth、职责边界、系统上下文、核心 / 支撑子域、运行承载、依赖方向、数据所有权、一致性、交互方式、机制级选型、风险和 ADR 候选。 | 转译为可实现结构骨架,不重写架构判断,不硬化产品或 schema。 |
| `design-calibration/00_req_step_01_*` ~ `00_req_step_17_*` | 需求形成过程、旧材料处理和正式 `00` 每章来源。 | 为正式 `02` 提供需求追溯入口,不替代正式 `00`。 |
| `design-calibration/01_arch_step_01_*` ~ `01_arch_step_16_*` | 架构形成过程、旧材料处理、架构决定停审和正式 `01` 每章来源。 | 为正式 `02` 提供架构追溯入口,不替代正式 `01`。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 编译期依赖、isolation backend 运行期依赖、sandbox events 事件协作和非 core sibling 裁剪规则。 | 后续代码主体、接口、flow 和实施承接必须保持依赖类型清晰。 |
| `projects/L2-tools/00~06` | governed / restricted tool 需要 sandbox 隔离执行和失败 / 材料反馈。 | 后续接口与 flow 只承接调用和反馈边界,不拥有 ToolPolicy / ToolInvocationResult。 |
| `projects/L2-runtime/00~06` | runtime 调度 sandbox 并消费 feedback / material。 | 后续接口与 flow 只承接 execution consumer 边界,不拥有 ExecutionInstance / recover truth。 |
| `projects/L2-member-service/00~06` | member host 受限动作需要 sandbox bind / execute / release 语境。 | 后续接口与 flow 只承接宿主协作材料,不拥有 MemberExecutionHost / SandboxBinding 装配 truth。 |
| `projects/L1-identity/00~07` | actor / member identity anchor 和责任链身份语境。 | 后续对象和接口只引用 identity anchor / safe summary,不保存身份正文。 |
| `projects/L1-work/00~07` | project / work / context refs 和工作责任语境。 | 后续对象和接口只引用 work refs / safe summary,不保存 Project / WorkItem / ImplementationPlan 正文。 |
| 旧 `projects/L4-sandbox/README.md` | 旧后端、旧事件、旧目录、安全 profile 和旧性能目标线索。 | 仅作为 historical material 和污染风险输入,不作为正式概要主链。 |
| 旧 `projects/L4-sandbox/02-概要设计.md` | 旧对象词、旧五段主线、旧说明性叙事和旧约束线索。 | 仅作为问题诊断和候选线索,不作为正式概要主链。 |

### 9.2 本文不再回答

- 不再回答 `L4-sandbox` 是否是运行隔离基础仓。
- 不再回答 sandbox 是否拥有 tools semantic execution、runtime execution truth、member host lifecycle、identity truth、work truth、artifact truth、observability store 或 policy definition truth。
- 不再回答 C-SBX-1~5 核心能力闭环是否成立为需求主轴。
- 不再回答 execution isolation truth、execution environment identity、coherent boundary、policy fail-closed、capture / handoff 分层、failure / cleanup / redline 一等事实是否是架构主线。
- 不再回答 `L0-core` 是否为唯一编译期依赖,也不再把非 core sibling 或后端产品写成源码依赖。
- 不再回答外部正文、formal artifact truth、observability store、policy DSL、backend lifecycle、operator UI 或 investigation lifecycle 是否可进入 sandbox truth。
- 不再回答宿主直跑、旁路执行、anonymous execution、boundary silent degrade、policy 缺失继续执行、cleanup 先删证据、redline advisory-only 是否允许。
- 不再回答旧 Docker/gVisor/Firecracker、SandboxService、旧审计事件、旧目录结构、旧性能数字和旧 SB 编号是否可直接继承;结论是不能直接继承。

### 9.3 本文必须回答

- `L4-sandbox` 的代码主体框架如何从 execution isolation truth、核心子域、支撑子域和运行承载角色映射到可实现骨架。
- 主要组成部分有哪些,每个组成部分承担什么 capability、职责和边界,以及不承担哪些相邻仓 / 下游 / 后端 truth。
- 从主要组成部分中能发现哪些对象候选,哪些对象会在第 6 章正式成立,哪些只是 ref、summary、policy input、handoff record、projection 或详细设计载体。
- 关键对象的对象类型、所属部分、主要责任、关键字段骨架、成员函数骨架、工厂函数骨架和禁止事项是什么。
- API / 接口骨架如何按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、backend / handoff port 等类别表达,并保持 `L0-core` 之外不引入编译期依赖。
- 关键处理流 / 重要函数数据流如何连接受理、identity、boundary、policy、execute、capture、handoff、failure、control、cleanup、reaper 和 redline 主线。
- 状态集合和状态流转如何表达 execution environment、boundary establishment、policy decision、capture / handoff、failure / control、lease / orphan / cleanup、redline containment 和派生读取语义。
- 异常与边界场景如何覆盖身份 / 工作 refs 不可解析、backend capability 不足、policy 缺失 / 冲突、边界不可落实、capture failure、handoff failure、control conflict、cleanup guard 阻断、orphan、redline 和派生不可用。
- 配置影响只识别哪些主要组成部分受配置影响、哪些边界禁止配置化、哪些配置细节交给 `03/04`。
- 详细设计需要继续展开哪些对象、接口、flow、状态、配置契约、测试切口和下游阻塞项。

### 9.4 暂不进入范围

| 暂不进入范围 | 原因 | 后续落点 |
|---|---|---|
| 完整 Rust struct / enum / value object 字段全集 | 属于详细设计实现契约。 | `03-详细设计.md` |
| 完整函数签名、伪代码和调用链 | 概要设计只写骨架和关键参数类型。 | `03-详细设计.md` |
| DTO / JSON / proto / CloudEvent schema、API path、RPC / SDK 方法 | 属于详细设计接口契约或 SDK / API 设计。 | `03-详细设计.md`;后续 SDK / API 文档 |
| DDL、索引、事务、repository 函数、store / object layout | 属于持久化详细设计。 | `03-详细设计.md` |
| Docker / gVisor / Firecracker / k8s / local_process 正式组合 | 当前是产品和承载候选,不能反向定义概要结构。 | `04-配置设计.md`;`05-测试方案.md`;`07-实施计划.md`;ADR |
| seccomp / AppArmor / cap drop / mount / network profile 具体清单 | 需后端组合、配置和测试证据共同闭口。 | `04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| material retention、safe summary、partial capture、handoff ack 协议全集 | 概要 Step 1 只确认上游缺口和保守口径。 | `02` 后续 Step;`03`;`04`;`05`;`06` |
| 测试用例、验收门禁、evidence alias、run_id 和签署结论 | 属于测试 / 验收阶段,不能伪造。 | `05-测试方案.md`;`06-验收标准.md` |
| phase、commit boundary、implementation ledger 和 boundary skeleton | 属于实施计划阶段。 | `07-实施计划.md` |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §1 “与上游文档的关系声明”引用本文件 §9.1 的上游关系映射表,生成正式文档时从该节摘录并压缩为正式正文。
- §2 “本次设计目标与范围”可承接本文件 §9.2、§9.3 和 §9.4,但必须在 Step 2 独立收口。
- §3 “约束条件”可承接本文件中识别出的边界和暂不进入范围,但必须在 Step 3 独立收口。
- 不在本 Step 写完整正式章节,后续 Step 14 从 Step 1~13 结构化中间产物摘录并装配正式 `02`。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否沿用旧 `02-概要设计.md` 主线 | A. 沿用;B. 只作为诊断输入,正式文档重建;C. 在旧文档上局部替换 | B | 新版 `00/01` 已重建,旧主线会造成需求解释、旧对象词、旧后端和旧指标混写。 | 已确认采用 B |
| 是否在 Step 1 直接拆代码主体框架 | A. 是;B. 否,Step 1 只确认上游输入边界 | B | SOP 要求 Step 1 不提前展开代码主体、对象、接口、flow 或状态。 | 已确认采用 B |
| 旧 SandboxExecution / Session / Command / Policy / Output 是否直接成为正式对象 | A. 直接继承;B. 作为候选线索后续重新筛选;C. 完全删除 | B | 它们可能有主题价值,但必须从新版主要组成部分和对象候选池重新推导。 | 已确认采用 B |
| Docker / gVisor / Firecracker / local_process 是否作为当前概要硬前提 | A. 是;B. 否,只作为后续候选;C. 完全删除 | B | 新版 `01` 已明确产品级后端不反向定义 coherent boundary。 | 已确认采用 B |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 2 的待确认事项。具体本次概要设计目标、范围和设计深度将在 Step 2 独立收敛。

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确概要设计当前承接哪些需求结论 | pass |
| 已明确概要设计当前承接哪些架构结论 | pass |
| 已明确哪些上游结论稳定、哪些仍不能直接展开 | pass |
| 已明确本文不再回答什么、必须回答什么 | pass |
| 已记录旧 README / 旧 `02` 为 historical material | pass |
| 未提前展开代码主体框架 | pass |
| 未提前展开接口骨架、对象轮廓、处理流或状态机 | pass |
| 未修改正式 `02-概要设计.md` | pass |
| 未创建 Step 2 或后续 Step 文件 | pass |

当前进入下一步条件: 等待用户审查 Step 1;用户确认后才允许进入 Step 2 `明确本仓设计目标与当前范围`。
