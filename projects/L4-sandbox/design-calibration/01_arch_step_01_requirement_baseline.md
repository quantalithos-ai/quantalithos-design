# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 01 | pass。用户已确认正式 `00-需求文档.md`,可启动 `01-架构设计.md` full-restart。 |
| 是否已读取架构 SOP 与书写规范 | pass。已读取 `架构设计讨论流程_SOP.md` Step 1 和 `架构设计书写规范.md` §4.1 / §4.3 / §4.16。 |
| 是否已读取当前需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 和 `00_requirements_calibration_flow.md`。 |
| 是否已读取旧材料 | pass。已读取旧 `README.md` 和旧 `01-架构设计.md`,仅作为 historical material。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_architecture_calibration_flow.md` 和本 Step 文件。 |

---

## 2. 本步目标

确认 `L4-sandbox` 当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求会直接影响系统边界、职责边界、数据所有权、依赖方向和一致性策略。本步只提炼架构约束力结论,不重写需求文档全文,不定义容器、部署拓扑、模块、协议、状态机、数据库、对象 schema、技术栈、配置 key、测试用例或实施 commit boundary。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-sandbox/design-calibration/project_execution_ledger.md` | 当前项目级台账 | 确认 `00` 已完成且用户已确认可进入 `01`。 |
| `projects/L4-sandbox/design-calibration/00_requirements_calibration_flow.md` | 需求 flow 已完成待审 | 确认 `00` Step 1~17 已按 full-restart 完成。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 作为架构设计直接需求基线。 |
| `00_req_step_02_position_boundary.md` | 已完成 | 提炼本仓定位、非职责边界和旧材料排除口径。 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提炼依赖裁剪、唯一编译期依赖和禁止依赖。 |
| `00_req_step_07_core_capability_loop.md` | 已完成 | 固定 `C-SBX-1~5` 核心能力闭环。 |
| `00_req_step_09_functional_requirements.md` | 已完成 | 提炼 `FR-SBX-001~018` 和外围增强边界。 |
| `00_req_step_10_business_rules_boundaries.md` | 已完成 | 提炼 `BR-SBX-001~033` 中会打穿架构边界的硬规则。 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提炼 execution isolation truth、快照、引用和禁止保存正文。 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提炼能力接口类型和外部依赖边界。 |
| `00_req_step_13_non_functional_requirements.md` | 已完成 | 提炼零容忍安全红线、可用性、审计和候选性能目标处理口径。 |
| `00_req_step_14_acceptance_criteria.md` | 已完成 | 提炼 `AC-SBX-001~041` 与 `VF-SBX-001~010`。 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 识别后续架构待确认项和一旦发生即阻塞项。 |
| `00_req_step_16_traceability_matrix.md` | 已完成 | 检查故事、功能、规则、数据、接口、NFR、验收和否决项追溯闭环。 |
| `projects/L4-sandbox/README.md` | 旧材料 | 只用于旧定位、后端、事件、目录和性能线索审计。 |
| `projects/L4-sandbox/01-架构设计.md` | 旧 Draft | 只用于旧架构口径污染诊断。 |
| `standards/document/架构设计讨论流程_SOP.md` | 已读取 | 约束 Step 1 输出和进入下一步门禁。 |
| `standards/document/架构设计书写规范.md` | 已读取 | 约束正式回填章节粒度和追溯表结构。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、需求 flow、正式 00、架构 SOP / 规范和通用标准 | done | 本文件 §1、§3 |
| 从新版需求基线提炼对架构有约束力的结论 | done | 本文件 §5、§9.1 |
| 诊断旧 README / 旧 `01-架构设计.md` 中不能继承的口径 | done | 本文件 §6 |
| 明确 full-restart 的设计取舍 | done | 本文件 §8 |
| 形成架构需求基线、硬约束和未关闭风险 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 1 自检并更新 flow / 项目台账 | done | 本文件 §11;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 当前架构设计依赖哪些需求结论?

| 编号 | 需求结论 | 对架构的约束 |
|---|---|---|
| ARB-SBX-001 | `L4-sandbox` 是平台运行隔离基础仓,不是工具、runtime、member、artifact、observability 或 policy truth 仓。 | 架构必须围绕 execution isolation truth 组织,不得把相邻仓的业务真相、运行主线、工具语义或观测存储纳入本仓核心上下文。 |
| ARB-SBX-002 | 核心能力闭环固定为 `C-SBX-1~5`:语境识别、隔离边界、策略内执行、输出观测捕获、失败清理红线收束。 | 架构目标、职责、上下文、数据所有权、交互和横切关注点必须逐项承接这五个能力节点。 |
| ARB-SBX-003 | `FR-SBX-001~018` 是当前核心功能需求,`FR-SBX-E01~E06` 是外围增强。 | 架构主线必须先覆盖核心闭环,多后端优化、inspect / replay、趋势分析、多宿主调度不能成为当前核心架构前置。 |
| ARB-SBX-004 | `BR-SBX-001~033` 已把正式受理、隔离边界、policy fail-closed、capture / handoff、failure / cleanup / redline 约束成规则。 | 架构必须把这些规则转成职责红线、依赖方向、数据边界和失败语义,不得只停留在抽象安全原则。 |
| ARB-SBX-005 | 本仓只拥有 execution isolation truth。 | 数据所有权必须围绕正式受理、环境身份、边界限制、策略裁定、capture、handoff、失败分类、control、lease / orphan、cleanup guard 和 redline investigation 展开。 |
| ARB-SBX-006 | identity / work / runner / runtime / tool / policy definition / artifact / observability / operator 正文不得进入 sandbox truth。 | 架构必须明确 ref / summary / material boundary,禁止复制外部正文或把下游消费状态反写为 sandbox 真相。 |
| ARB-SBX-007 | `L0-core` 是唯一编译期依赖;其他内部仓、policy 来源、isolation backend 和 `L0-bus` 都不能直接落为 package dependency。 | 架构依赖方向必须裁剪编译期、运行期和事件协作边界,后续实现计划不能越过依赖规则。 |
| ARB-SBX-008 | isolation backend 是运行承载,不得反向定义正式需求边界。 | 架构可以在后续 Step 讨论承载抽象和后端能力摘要,但不能从 Docker / gVisor / Firecracker 反推本仓职责。 |
| ARB-SBX-009 | policy 来源由 governance / capability / tools 等外部真相源给定,sandbox 只执行给定 launch / isolation policy 并 fail closed。 | 架构必须区分 policy execution 与 policy definition / approval / allowlist truth。 |
| ARB-SBX-010 | 输出、候选材料和 observability material 必须分层交接,不能静默升级为 artifact truth、baseline truth、evidence truth 或 observability store truth。 | 架构必须有 capture / handoff / cleanup guard 边界,并保护下游真相源。 |
| ARB-SBX-011 | 非 happy path 必须稳定分类并保守收束,包括 timeout、deny、backend failure、capture failure、orphan、lease expiry、cleanup、reaper 和 redline。 | 架构必须把失败分类、控制动作、租约、reaper、清理前置 guard 和安全红线作为一等边界,不能只画 happy path。 |
| ARB-SBX-012 | 零容忍红线包括宿主直跑、边界 silent degrade、policy permissive fallback、外部正文越权入仓、cleanup 先删证据、托管外孤儿继续运行和追溯缺口。 | 架构约束和后续验收追溯必须保留这些 VF 级红线。 |

### 5.2 这些需求结论里哪些已经稳定?

| 稳定结论 | 判断 |
|---|---|
| 仓定位 | 稳定。`L4-sandbox` 是运行隔离基础,不是业务域 truth 或后端产品本体。 |
| 核心能力闭环 | 稳定。`C-SBX-1~5` 已由故事、功能、规则、数据、接口、NFR、验收和追溯承接。 |
| 核心功能范围 | 稳定。`FR-SBX-001~018` 是当前核心主线,外围增强显式降级为非前置。 |
| 非职责边界 | 稳定。tools semantic execution、runtime loop、member lifecycle、artifact truth、observability store 和 policy definition truth 均不归 sandbox。 |
| 数据归属主线 | 稳定。execution isolation truth 属于 sandbox,外部正文禁止入仓。 |
| 依赖裁剪 | 稳定。`L0-core` 唯一编译期依赖;其余均为运行期、事件协作、引用或材料交接。 |
| 零容忍安全红线 | 稳定。`VF-SBX-001~010` 已覆盖核心闭环断裂、边界打穿、真相污染和追溯断裂。 |

### 5.3 哪些需求结论仍然待确认?

当前没有阻塞架构 Step 2 的需求缺口。下列事项属于后续架构、概要、详细、配置、测试、验收或实施阶段的细化问题:

| 待确认事项 | 当前架构处理口径 |
|---|---|
| 正式架构基线纳入哪些隔离承载,以及各承载的允许环境边界 | Step 1 不固定 Docker / gVisor / Firecracker / local_process;后续 Step 6 / Step 10 / Step 12 判断。 |
| policy / authorization 来源在 tools、runtime、member-service、runner 场景下的具体接缝矩阵 | Step 1 只承认“给定 policy + fail closed”;后续系统上下文、交互和详细设计闭口。 |
| 网络放行粒度如何表达 | Step 1 不固定 domain / IP / port;后续架构、配置和测试阶段按 policy 边界推导。 |
| capture / handoff 与 artifact、observability、runtime、runner 的 ack / pending / failed 形态 | Step 1 保留显式 handoff fact 和 cleanup guard 原则;后续交互、详细设计和配置闭口。 |
| Runner、runtime、member-service 等消费方是否使用同构协议还是只保持同构语义 | 当前先固定统一语义;后续 Step 9 和详细设计判断协议形态。 |
| inspect / replay / operator control 是否进入当前阶段主线 | 当前仍按外围增强处理;后续 Step 13 / Step 14 判断是否进入演进路线或风险表。 |
| 长时会话、大体积输出、多宿主 / 多集群调度和容量趋势是否进入当前实施边界 | 当前不作为核心前置;后续架构演进、测试和实施计划判断。 |
| 候选性能目标是否升级为正式目标 | 旧 `<1s`、`<2s`、`<500ms`、`<5ms` 仍是候选目标;后续测试方案 / 验收标准再决定。 |
| 具体数据库、对象存储、审计物理存储、外部 GRC 或 secrets 系统是否进入正式架构 / 配置基线 | 当前不纳入 Step 1 结论;后续技术选型、配置和实施计划裁剪。 |

### 5.4 哪些需求会直接影响架构边界?

| 需求 | 影响的架构边界 |
|---|---|
| Sandbox 只拥有 execution isolation truth | 必须形成独立 sandbox truth boundary,并把业务 truth、运行 truth、工具 truth、观测 store 和 policy truth 排除在外。 |
| 真实执行必须先经正式受理和责任链绑定 | 架构入口不能是“任意命令执行 API”;必须先有 execution environment identity 和责任语境边界。 |
| 隔离边界必须 coherent 且可落实 | 架构不能把 resource / filesystem / network / process 分散成互不一致的调用方参数;后端不支持时必须拒绝或保守收束。 |
| 给定 policy 内执行且 fail closed | policy 来源边界、执行裁定边界和 deny / escalation 边界必须分清。 |
| capture / handoff 分层交接 | capture truth、candidate material、observability material 和下游 artifact / observability truth 必须分层。 |
| failure / cleanup / redline 为核心闭环一部分 | 架构必须覆盖非 happy path,不能只设计 execute success 主链。 |
| 外围增强不阻塞核心闭环 | 多后端优化、inspect、preview、趋势、调度等必须可后置或降级。 |

### 5.5 哪些需求会直接影响数据所有权?

| 数据类别 | 架构影响 |
|---|---|
| 真相数据 | 正式受理、执行环境身份、责任链、隔离环境建立、有效限制、策略裁定、结果捕获、候选材料、usage / audit / observability material、handoff、capture-failure、失败分类、control、lease / orphan、cleanup guard、redline investigation 必须有 sandbox truth 承载。 |
| 快照数据 | 调用方上下文摘要、backend capability 摘要、policy applicability / authorization 摘要、下游安全交接 / 调查开放状态摘要只能服务判断,不得形成独立真相。 |
| 引用数据 | identity、work、runner、tool、runtime、policy、approval、capability、backend carrier、workspace、artifact、observability、investigation 等只能以 typed ref / safe ref 进入。 |
| 禁止保存正文 | actor / member / project / work / runner / runtime / tool semantic / policy DSL / approval workflow / formal artifact / observability store / operator UI / host lifecycle 等正文不得进入 sandbox truth 生命周期。 |

### 5.6 哪些需求会直接影响依赖方向或一致性策略?

| 需求 | 影响 |
|---|---|
| `L0-core` 唯一编译期依赖 | 架构层和后续实施计划必须避免直接依赖 tools、runtime、member-service、identity、work、artifact、observability、capability-hub 或 backend 产品包。 |
| `L0-bus` 是事件协作主干而非业务 truth 来源 | sandbox 事件只能交接状态、审计和材料信号,不能携带或替代外部 truth 正文。 |
| 相邻仓只运行期消费或提供 refs / summaries / materials | 架构需要明确 adapter、resolver、handoff、publisher / subscriber 边界。 |
| policy 缺失、冲突、不支持时 fail closed | 一致性策略必须允许 pending / deny / rejected / failed,禁止 permissive fallback。 |
| 下游消费延迟不能伪造成功 | capture truth 和 handoff state 必须分开,下游不可用时不反写成功。 |
| 重复控制信号和重复执行语境不能生成第二语义 | 架构必须保留幂等和单一正式语义原则,但 Step 1 不定义算法。 |

---

## 6. 历史材料诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 仓使命 | 写“至少 Docker + gVisor 两种隔离后端”。 | 新版需求只要求抽象 isolation backend 和限制落实,不把具体后端设为需求硬前提。 | 记录为后端候选线索;后续 Step 10 再讨论。 |
| 核心职责 | 写默认无出网、白名单必须 Policy 授权、固定审计事件。 | 主题方向仍相关,但事件名、白名单形态和 Policy 来源未按新版边界裁剪。 | 只继承 fail-closed 和 policy 前提的需求语义,不继承旧名称。 |
| 关键依赖 | 写 `quantalithos-sdk`、capability-hub、Docker / gVisor / Firecracker / runc 等。 | 与当前 `L0-core` 唯一编译期依赖和 policy truth 外部拥有口径不完全一致。 | 后续 Step 7 按全局依赖规则重裁剪。 |
| 目录结构 | 预设 `backends/`, `api/`, `limits/`, `audit/`, `rpc/`。 | 属于实现目录和模块组织,不能作为架构 Step 1 结论。 | 作为 historical material,不得进入当前基线。 |
| 性能目标 | 写 Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、白名单检查 `<5ms`。 | 新版需求已降为候选目标,不是当前正式硬指标。 | 后续测试 / 验收再判断是否升级。 |
| 安全基线 | 写 non-root、seccomp、AppArmor、cap drop、网络 drop all。 | 这些是可能的实现 / 配置技术手段,但 Step 1 不能提前定技术选型。 | 后续 Step 10 / Step 12 / 04 配置再收口。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档元信息 | 日期 2026-05-11,状态 Draft,项目定位为“统一 SandboxService + Docker / gVisor / future Firecracker backend”。 | 与当前 full-restart 和新版 `00` 不一致,且过早固定后端 / 接口抽象。 | Step 16 重建正式文档时清理。 |
| §1 成功标准 | 固定 Docker / gVisor 启动、未授权出网拦截率、Runner 与 Runtime 共用接口。 | 性能数字和“共用接口 100%”缺新版需求追溯;统一语义不等于必须同一接口外形。 | 不继承为当前架构目标。 |
| §2 约束条件 | 写至少 Docker + gVisor、SandboxInvoked / Exited、资源硬约束、Runner 与 Member 共用接口。 | 后端、事件名、接口形态和旧 SB 编号都未经当前架构 SOP 重新推导。 | 只保留为历史线索。 |
| §3 架构风格 | 直接选择统一 SandboxService + backend adapters + Policy-aware network gate。 | Step 1 不能提前决定架构风格、port / adapter 或 policy gate 技术组织。 | 后续 Step 10 / Step 11 重新讨论。 |
| §4 系统上下文 | capability-hub 被画成 allowlist 来源,Docker/gVisor 作为固定上下文。 | 当前需求只说 policy 来源和 isolation backend,不指定 capability-hub 或具体后端为唯一上下文。 | 后续 Step 4 重画上下文。 |
| §5 限界上下文 | Sandbox API、Backends、Limits、Audit 等直接映射成上下文和核心对象。 | 容易把实现模块当限界上下文,并遗漏 capture / handoff / cleanup / redline。 | 后续 Step 5 重新划分。 |
| §6~§8 容器、依赖、数据 | 预设 orchestrator、backend adapter、PolicyViewProvider、AuditPublisher 和 allowlist snapshot。 | 多个对象和端口缺新版需求追溯,且可能吞并 policy / observability 边界。 | 不继承;后续按 Step 顺序重建。 |
| §9~§11 技术选型和横切 | 固定 Docker + gVisor、deny-by-default、统一 SandboxService、seccomp / AppArmor 等。 | 旧技术选型早于当前职责边界、上下文、数据和依赖裁剪。 | 后续 Step 10~12 重新收敛。 |
| §12~§14 演进、上线、监控 | 写灰度、回滚、阈值和监控告警。 | 这些属于后续演进、测试、验收或实施计划,且指标未按新版 NFR 复核。 | 不作为 Step 1 架构基线。 |
| §15 追溯矩阵 | 使用旧 `US-001~004` 和旧验收场景。 | 与新版 `US-SBX-*` / `FR-SBX-*` / `AC-SBX-*` / `VF-SBX-*` 编号体系不一致。 | Step 15 / 16 使用新版追溯体系重建。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构输入 | 旧 README、旧 `01`、旧 SB 条目和旧架构选择混合。 | 新版正式 `00-需求文档.md` 为直接需求基线。 | 避免旧后端、接口、事件、性能和目录残留。 |
| 架构主线 | SandboxService、Docker/gVisor、allowlist、audit event、backend adapter。 | execution isolation truth、`C-SBX-1~5`、依赖裁剪、数据分层和红线闭环。 | 保持需求到架构的推导关系。 |
| policy 边界 | capability-hub / allowlist 被写成固定来源。 | 外部 policy / authorization 来源给定,sandbox 只执行并 fail closed。 | 防止 sandbox 反向拥有 policy truth。 |
| 输出与观测 | audit / observability 偏日志事件表达。 | capture、candidate material、observability material、handoff fact 和 cleanup guard 分层。 | 防止输出或观测材料静默升级为下游 truth。 |
| failure / cleanup | 旧文档主要写 timeout、fallback、escape_detected。 | 非 happy path 包含 failure classification、control、lease、orphan、reaper、redline investigation。 | 新版需求把失败清理红线作为核心闭环节点。 |
| 技术指标 | 旧数字直接写成功标准和性能预算。 | 旧数字降为候选目标或历史线索。 | 当前需求未把旧 benchmark 作为正式硬指标。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接修补旧 `01-架构设计.md` | 快,能保留已有文字。 | 旧后端、接口、事件、性能、capability-hub 和实现模块残留风险高。 | 不采用。 |
| 方案 B: 按架构 SOP 生成 Step 1~16 中间产物后重建正式 `01` | 可追溯,能逐步消除旧口径,与新版 `00` 对齐。 | 需要逐 Step 审查。 | 采用。 |
| 方案 C: 在 Step 1 直接确定 Docker/gVisor、SandboxService、backend adapter 和 audit event | 看似能快速进入实现。 | 越过目标、职责、上下文、数据、依赖和技术取舍 Step,会把旧候选项写成架构事实。 | 不采用。 |
| 方案 D: 因承载组合、policy 来源、网络粒度和 handoff ack 未定而阻塞 Step 2 | 极保守。 | 这些是后续架构 / 详细 / 配置 / 测试职责,会让 Step 1 过度承担后续设计。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| RB-SBX-001 | `L4-sandbox` 是运行隔离基础仓,只拥有 execution isolation truth。 | 架构围绕受理、身份、边界、策略、capture、handoff、failure、cleanup 和 redline 组织。 |
| RB-SBX-002 | `C-SBX-1~5` 是核心能力闭环。 | Step 2~15 必须逐项承接语境、隔离、策略、捕获交接、失败清理红线。 |
| RB-SBX-003 | `FR-SBX-001~018` 是核心功能,`FR-SBX-E01~E06` 是外围增强。 | 架构主线先保证核心闭环;多后端优化、inspect / replay、趋势、调度只能作为可演进能力。 |
| RB-SBX-004 | tools、runtime、member-service、identity、work、artifact、observability、policy 来源均有明确非职责边界。 | 后续职责边界和系统上下文必须把这些 truth owner 排除在 sandbox 外。 |
| RB-SBX-005 | `L0-core` 是唯一编译期依赖。 | 依赖方向必须按编译期 / 运行期 / 事件协作裁剪,不把运行消费关系写进 package dependency。 |
| RB-SBX-006 | capture / handoff、observability material 和下游 truth 必须分层。 | 后续数据所有权和交互必须区分 sandbox capture truth 与 artifact / observability truth。 |
| RB-SBX-007 | failure classification、cleanup guard、lease / orphan / reaper 和 redline containment 是核心闭环。 | 后续架构不能只设计 happy path;必须把非 happy path 作为一等架构边界。 |
| RB-SBX-008 | 旧后端、旧事件、旧性能目标和旧目录结构不再是当前基线。 | 后续技术选型和配置可重审这些线索,但不得直接继承。 |

### 9.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| HC-SBX-001 | 不得把宿主直跑、调用方本地执行、旁路执行或匿名执行宣称为正式 sandbox 受控执行。 | §3 约束条件;§4 职责边界;§5 系统上下文 |
| HC-SBX-002 | 不得让 resource / filesystem / network / process 任一必需限制 silent degrade、部分忽略或未验证即继续执行。 | §3 约束条件;§7 容器 / 部署架构;§13 横切关注点 |
| HC-SBX-003 | 不得在 policy 缺失、冲突、不支持、不可解析或未授权高风险动作场景下 permissive fallback。 | §3 约束条件;§10 关键交互;§13 横切关注点 |
| HC-SBX-004 | 不得由 sandbox 生成或拥有 allowlist truth、approval truth、policy definition truth、capability truth 或 policy DSL truth。 | §4 职责边界;§8 依赖方向;§9 数据所有权 |
| HC-SBX-005 | 不得保存 identity / work / tool semantic / runtime recover / formal artifact / observability store / operator UI 等外部正文或外部 truth 正文。 | §9 数据所有权;§13 横切关注点 |
| HC-SBX-006 | 不得把输出、候选材料或 observability material 静默提升为 formal artifact truth、baseline truth、evidence truth 或 observability store truth。 | §9 数据所有权;§10 关键交互 |
| HC-SBX-007 | cleanup / reaper 不得在审计、回放、调查或安全交接所需材料未安全交接前先删除 capture / audit / investigation material。 | §9 数据所有权;§10 关键交互;§13 横切关注点 |
| HC-SBX-008 | 租约到期、孤儿环境或 redline 事件不得在托管恢复路径之外继续运行或脱离受控收束。 | §10 关键交互;§13 横切关注点 |
| HC-SBX-009 | 同一正式执行、同一 policy 语境或同一控制信号不得在不同调用方、不同承载或不同下游处出现第二套正式语义。 | §8 依赖方向;§9 数据所有权;§10 关键交互 |
| HC-SBX-010 | `L0-core` 之外的相邻仓、SDK、backend 产品或 policy 来源不得被写成当前仓编译期依赖。 | §8 依赖方向 |
| HC-SBX-011 | Docker/gVisor/Firecracker/local_process、SandboxService、旧事件名和旧性能数字不得在 Step 1 直接升格为架构事实。 | §3 约束条件;§11 关键技术选型;§12 备选方案 |

### 9.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 2 |
|---|---|---|
| 隔离承载组合、后端能力摘要和允许环境边界未定。 | 后续架构容器 / 部署、技术选型和配置职责。 | 否 |
| policy / authorization 来源矩阵未定。 | 后续系统上下文、交互通信和详细设计职责。 | 否 |
| 网络放行粒度未定。 | 后续架构、配置和测试职责。 | 否 |
| capture / handoff ack、pending、failed 和 cleanup guard 的协议形态未定。 | 后续关键交互、详细设计和配置职责。 | 否 |
| Runner / runtime / member-service / tools 的同构协议或同构语义边界未定。 | 后续系统上下文和交互通信职责。 | 否 |
| inspect / replay / operator control、长时会话、大体积输出、多宿主 / 多集群调度是否进入当前实施主线未定。 | 后续演进路线、风险和实施计划职责。 | 否 |
| 旧启动 / 销毁 / 白名单开销候选指标是否升级未定。 | 后续测试方案和验收标准职责。 | 否 |
| 正式 `04-配置设计.md` 和 `07-实施计划.md` 缺失。 | 后续文档链职责;进入对应文档时创建。 | 否 |
| 后续设计若让后端、调用方或下游消费方形成第二套 execution / policy / capture / cleanup truth。 | 一旦发生即阻塞。 | 不阻塞 Step 2,但必须作为硬约束。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、历史材料诊断和设计取舍。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“历史材料诊断”“结构化中间产物”和“回填草稿”小节,了解本章如何从新版需求基线排除旧后端、旧接口和旧性能口径。

本文首先承接 `projects/L4-sandbox/00-需求文档.md` 已收稳的需求基线,再向上追溯项目清单、全局仓级定位、依赖裁剪规则和相邻仓边界。本文不重新定义需求、业务规则、数据归属或验收标准,只把这些结论转译为系统结构、职责边界、依赖方向、数据所有权、一致性策略、技术取舍和演进约束。

旧 `README.md` 和旧 `01-架构设计.md` 中的 Docker/gVisor 硬绑定、future Firecracker、统一 SandboxService、capability-hub allowlist 来源、SandboxInvoked / SandboxExited / EscapeDetected 事件名、local_process、旧性能目标和旧目录结构只作为历史输入,不作为新版架构真相源直接继承。
```

```md
## 3. 约束条件

本章应摘录:

- `design-calibration/01_arch_step_01_requirement_baseline.md` §9.1 需求基线结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §9.2 架构硬约束结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §9.3 未关闭需求风险结论。
```

```md
## 16. 需求追溯矩阵

本章应在 Step 15 形成正式矩阵时承接:

- `C-SBX-1~5` 到架构职责、上下文、数据、交互、横切和演进章节的映射。
- `FR-SBX-001~018` 到架构单元和关键交互的映射。
- `BR-SBX-001~033`、`AC-SBX-001~041`、`VF-SBX-001~010` 到架构硬约束和一票否决红线的映射。
- Step 1 保留的未关闭风险不得在追溯矩阵中被误写成已闭合架构结论。
```

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只承接新版 `00-需求文档.md` | pass | 旧 README / 旧 `01` 只用于诊断,未作为架构真相源。 |
| 是否明确架构前提 | pass | §9.1 已输出需求基线结论。 |
| 是否明确硬约束 | pass | §9.2 已输出架构硬约束结论。 |
| 是否明确未关闭风险 | pass | §9.3 已输出不阻塞 Step 2 的风险和后续阻塞项。 |
| 是否覆盖用户强调的重点边界 | pass | 已覆盖 execution environment identity、resource limits、FS / network / process boundary、launch policy、artifact capture、observability hooks、failure classification、cleanup / lease / reaper 和 security redlines。 |
| 是否提前写容器、数据库、协议、schema、状态机、配置 key、测试用例或技术栈 | pass | 本步只做需求基线提炼和历史诊断。 |
| 是否提前创建未来 Step 文件 | pass | 只创建本 Step 文件和 flow。 |
| 是否允许进入 Step 2 | pass_wait_review | 当前需求基线足以支撑架构目标与约束讨论;需用户确认后进入 Step 2。 |

当前 Step 1 `确认需求基线` 已完成。下一步必须等待用户确认后进入 Step 2 `明确架构目标与约束`,并只创建 / 改写 `design-calibration/01_arch_step_02_goals_constraints.md`。
