# L4-sandbox 00 需求 Step 3: 背景与问题定义

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 2,允许进入 Step 3;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 3 章“背景与问题定义”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 背景与问题定义 |
| 输出文件 | `design-calibration/00_req_step_03_problem_context.md` |
| 前置确认 | pass:用户在 Step 2 停审后回复“同意”,允许进入 Step 3 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 3;`需求文档书写规范.md` §4.3 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取背景线索 | yes:`projects/README.md`;`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md`;`product/六域模型.md`;`standards/子项目遵循规范清单.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00/01/02/03/05/06` 的背景、风险、测试和验收线索 |
| 历史材料口径 | 旧材料只作差异审计输入,不继承旧指标、接口、对象、后端、测试结果或验收结论 |
| 禁写范围 | 不写目标、非目标、用户角色、依赖裁剪、核心能力、用户故事、功能、业务规则、数据归属、接口、NFR、测试、验收、schema、port、event payload、配置或实施边界 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_4 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1/2、SOP、书写规范和背景输入摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 业务背景、主要痛点或机会点、量化口径、业务/技术问题分类 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 上游背景、旧材料混层、量化污染和相邻仓问题归属诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 背景主线、问题主线、量化处理和分类取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 业务背景结论、问题现状表、问题分类表和后续 Step 保护线 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录 / 是否生成依赖类中间产物判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 3 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 3 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 4。 |

---

## 2. 必读摘要

| 文档 | Step 3 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 3 | 本步只说明当前业务背景、主要痛点或机会点、能否量化、业务问题与技术问题。 | 不写目标、解决方案、功能、能力、接口、数据、NFR 或验收。 |
| `需求文档书写规范.md` §4.3 | 正式第 3 章使用“业务背景短文字 + 现状与问题表 + 业务问题 vs 技术问题表”。 | 问题一般列 1~3 个;能量化才量化,不能伪造指标来源。 |
| `00_req_step_01_upstream_relation.md` | L4-sandbox 承接运行隔离基础主题,需求来源为架构反推型 / 基础设施契约型;旧材料只作 historical_material。 | Step 3 背景必须来自运行隔离基础的系统空白,不能继承旧功能或实现进度。 |
| `00_req_step_02_position_boundary.md` | 本仓是平台运行隔离基础仓;非职责排除 tools/runtime/member-service/identity/work/artifact/observability/governance 和后端产品本体。 | Step 3 问题必须围绕隔离基础为何需要需求收束,不能重新定义边界。 |
| `projects/README.md` | L4-sandbox 是基础设施契约型仓,需求重点是为什么基础设施仓必须存在、契约职责和下游消费者。 | 背景要强调平台级受控执行空白,不是终端产品功能。 |
| `architecture/仓库拆分方案.md` | L4-sandbox 是代码执行隔离,服务 Member 跑代码的安全环境;Runner 会调用 L4-sandbox。 | 可作为“执行真实动作不能散落在调用方”的背景线索;不固化 Docker/gVisor/Firecracker。 |
| `architecture/标准对齐全景图.md` | sandbox 对齐沙箱逃逸防御、25010 Security Resistance、42001 A.6 Operation 隔离。 | 可说明安全与运行期隔离背景;安全红线和指标后置。 |
| `product/六域模型.md` | L4-sandbox 是六域之外的横切执行隔离基础设施,承接沙箱逃逸防御主题。 | 背景不能写成业务域 truth;问题应围绕横切执行隔离。 |
| `全局项目依赖关系与裁剪规则.md` | L4-sandbox 运行期依赖容器 / k8s / isolation backend,按需发布 sandbox 事件,不拥有业务真相。 | 运行期依赖和事件协作只作背景;依赖裁剪留 Step 6 / Step 12。 |
| 旧 `README.md` | 旧材料写代码执行隔离、资源限制、默认无出网、审计事件、Runner/Member 共用接口和性能目标。 | 可吸收隔离、资源、无出网、审计、复用问题线索;不继承后端、事件名、性能数字和目录。 |
| 旧 `00-需求文档.md` | 旧背景直接写 AI 成员运行代码/工具/Runner,以及默认无出网、白名单、审计;随后滑入目标、功能、NFR、接口。 | 可保留“直接宿主执行不可接受”背景;旧量化和功能项后置。 |
| 旧 `02/05/06` | 旧概要、测试、验收反复强调执行隔离统一性、fs/network/quota、output/evidence、kill/replay/cleanup、未授权访问阻断。 | 只作为问题候选和风险线索;SandboxExecution、对象名、测试 case、验收项不得进入 Step 3 结论。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前业务背景是什么? | Quantalithos 的 AI 成员、工具调用、构建测试和 Runner 应用都会触发真实代码或进程执行;这些执行不能直接散落在 runtime、tools、member-service、runner 或人工脚本中,否则平台无法稳定说明执行在哪个受控环境发生、哪些文件 / 网络 / 进程 / 资源边界生效、输出如何被带回以及失败和清理如何留痕。 |
| 当前的主要痛点或机会点是什么? | 主要痛点不是“缺一个容器后端”或“缺一个执行接口”,而是运行隔离问题层尚未按当前标准收束:执行隔离边界容易在调用方分裂,执行输出与观测 / artifact / runtime 事实容易混层,失败控制和清理若没有统一问题语义会导致审计材料丢失或不可对账。 |
| 这些问题能否量化? | 当前不能可靠量化为真实运行指标。旧 README 和旧正式文档中的启动时延、出网延迟、未授权访问成功率、输出回收率和留痕率等数字或目标只可作为后续 NFR / 测试 / 验收候选,不能在 Step 3 伪装成已验证的问题量化。 |
| 哪些是业务问题,哪些是技术问题? | 业务问题是平台缺少对受控执行安全底线的统一需求语言,使 AI 成员、工具和 Runner 执行真实动作时难以对用户、安全审查和相邻仓解释风险、结果和责任边界。技术问题是 execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、capture、observability hook、failure classification、lease/cleanup/reaper 和 security redlines 若不先在需求问题层收束,后续 01~07 会反复在 tools/runtime/member-service/artifact/observability/governance 之间串线。 |

---

## 4. 当前材料诊断

### 4.1 背景主线诊断

Step 2 已把 L4-sandbox 定位为“平台运行隔离基础仓”。因此 Step 3 的背景不能写成“实现 Docker/gVisor 后端”或“提供 SandboxService 接口”,也不能写成“runtime 需要某个执行功能”。更合规的背景主线是:平台进入 AI 成员、工具、构建测试和 Runner 应用会真实执行代码的阶段后,必须先回答受控执行问题,否则执行面会分裂到多个相邻仓和脚本中。

这个背景有三个来源:

| 来源 | 可用背景线索 | Step 3 处理 |
|---|---|---|
| 架构 / 标准上游 | L4-sandbox 承接代码执行隔离、沙箱逃逸防御、Security Resistance 和 Operation 隔离。 | 写成“运行隔离基础为什么值得讨论”,不写后端或红线指标。 |
| Step 2 边界 | sandbox 提供可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 | 背景围绕这些主题的缺口,不生成能力节点。 |
| 旧材料 | 直接宿主执行不可接受,资源 / 网络 / 输出 / 审计 / cleanup 是高频线索。 | 作为问题表现,不继承旧功能、事件、接口、指标和测试项。 |

### 4.2 旧材料混层诊断

| 旧材料表现 | 可保留线索 | 问题 | 当前处理 |
|---|---|---|---|
| README 把使命、后端、目录、事件、性能目标和安全基线放在同一页。 | 代码执行隔离、资源限制、默认无出网、Runner/Member 复用。 | Docker/gVisor/Firecracker、事件名、目录结构和性能数字过早进入问题层。 | 线索保留,方案和数字后置。 |
| 旧 `00` 的背景写 AI 成员直接执行代码不可接受。 | 直接宿主执行风险是有效背景。 | 紧接着把目标、接口、功能、NFR 和验收写成问题。 | 转译为“执行面安全底线缺统一需求问题”。 |
| 旧 `02` 问题量化写执行隔离统一性、未受控网络/文件访问、输出回收、retry/replay/kill、资源约束。 | 五类问题方向有效。 | 目标值、对象名和控制主线已进入概要 / 验收口径。 | 抽象为 3 个 Step 3 问题,不使用目标值。 |
| 旧 `05/06` 写测试和验收项。 | 高风险边界线索完整。 | 测试 case、验收通过条件和对象名不能反推需求问题。 | 仅作为旧材料污染审计和后续 Step 14/05/06 输入。 |

### 4.3 量化口径诊断

| 旧量化 / 指标 | 当前判断 | 处理口径 |
|---|---|---|
| 沙箱启动 `< 1s(Docker)` / `< 2s(gVisor)` | 来自旧 README,不是本轮确认的真实测量或需求基线。 | 后置到 Step 13 / 14 审查是否作为 NFR / 验收候选。 |
| 容器销毁 `< 500ms`、出网检查 `< 5ms` | 同样属于旧性能目标,且与后端选择绑定。 | 后置到 NFR、测试和配置设计。 |
| 未授权出网 / 路径访问成功率 `0` | 是安全红线候选,但 Step 3 不写验收目标。 | 后置到 Step 10/13/14。 |
| 输出回收率 `100%`、控制留痕率 `100%` | 是验收 / 测试候选,不能作为当前已量化问题。 | 后置到测试和验收。 |
| “风险高”“分散在 runtime / tools / scripts” | 可作为当前表现的文字化描述。 | Step 3 采用“当前表现 + 影响范围 / 后果”表达。 |

### 4.4 相邻仓问题归属诊断

| 相邻对象 | 若 Step 3 写错会怎样 | 当前问题层归属 |
|---|---|---|
| `L2-tools` | 把 ToolPolicy、ToolDefinition、ToolInvocationResult 写成 sandbox 问题。 | 只写“工具执行承载需要隔离边界”,不写工具语义问题。 |
| `L2-runtime` | 把 ExecutionInstance、agent loop、recover/checkpoint 写成 sandbox 问题。 | 只写“runtime 直接宿主执行会破坏隔离”,不写运行主线问题。 |
| `L2-member-service` | 把 host lifecycle、SandboxBinding 和 host failure 写成 sandbox 背景。 | 只写“宿主绑定不能替代隔离执行环境真相”。 |
| `L1-artifact` | 把输出直接写成 artifact truth 问题。 | 只写“输出材料需要安全带回且不丢证据”,正式制品归属后置。 |
| `L4-observability` | 把审计日志存储和指标查询写进 sandbox 问题。 | 只写“观测 hook / 审计材料需要可对账”,不写观测存储。 |
| governance / capability | 把 allow/deny 决策写成 sandbox 问题。 | 只写“launch/isolation policy enforcement 需要承载点”,不写策略决策。 |

---

## 5. 设计取舍

### 5.1 背景表达取舍

| 方案 | 背景表达 | 优点 | 问题 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | AI 成员需要安全执行代码。 | 简洁,贴近旧 `00`。 | 太泛,容易滑向“提供执行功能”。 | 不单独采用。 |
| 方案 B | AI 成员、工具、构建测试和 Runner 应用都会触发真实执行,平台必须先统一受控执行问题。 | 能承接 Step 2 边界,覆盖多个调用方,不写方案。 | 需要问题表继续细化具体表现。 | 采用。 |
| 方案 C | L4-sandbox 要实现 Docker + gVisor + no-egress + audit。 | 贴近旧 README。 | 已经是目标 / 方案 / 验收混合。 | 不采用。 |
| 方案 D | 为满足沙箱逃逸防御和 ISO 42001 Operation 隔离。 | 有标准背景。 | 容易把标准映射变成解决方案。 | 作为背景补充,不作为唯一主线。 |

### 5.2 主要问题取舍

| 候选问题 | 是否采用 | 理由 |
|---|---|---|
| 运行隔离问题层未按新版需求收束 | 采用 | 解释 full-restart 必要性,也防止旧方案直接支配后续设计。 |
| 执行隔离边界容易在 runtime/tools/member-service/runner 中分裂 | 采用 | 这是基础设施独立成仓的核心痛点。 |
| 输出、观测、失败和清理语义容易混层且不可对账 | 采用 | 这是执行隔离不是“能跑命令”的关键原因。 |
| 缺少 Docker/gVisor/Firecracker 后端 | 不采用 | 是架构/配置/实施候选,不是 Step 3 问题定义。 |
| 缺少 SandboxService trait / CreateSession API | 不采用 | 是接口 / 详细设计候选。 |
| 缺少未授权访问成功率 0 的验收 | 不采用 | 是安全规则 / NFR / 验收候选。 |

### 5.3 量化处理取舍

| 方案 | 内容 | 优点 | 问题 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 继承旧启动、销毁、出网检查、成功率和留痕率数字。 | 看起来可量化。 | 数字来源旧、且混入后端和验收目标,会污染 Step 3。 | 不采用。 |
| 方案 B | Step 3 明确当前不能可靠量化,用当前表现和后果表达,把数字后置到 Step 13/14/05/06。 | 符合规范,避免伪造真实运行数据。 | 后续必须在 NFR/验收阶段重新审查旧指标。 | 采用。 |

### 5.4 问题分类取舍

业务问题要表达“平台为什么会被这个问题影响”,不能写成“实现哪些功能”。技术问题要表达“需求收束、设计和实现为什么会被影响”,不能写成 schema、port 或测试项。因此分类采用:

- 业务问题:受控执行安全底线缺统一语言,真实动作难以稳定解释风险、结果和责任边界。
- 技术问题:执行环境身份、资源、FS/network/process、policy enforcement、capture、observability hook、failure、cleanup、redlines 等主题若不先收束,后续文档链会串仓。

---

## 6. 结构化中间产物

### 6.1 业务背景结论

Quantalithos 的 AI 成员、工具调用、构建测试和 Runner 应用都会触发真实代码或进程执行;这些执行一旦散落在 runtime、tools、member-service、runner 或人工脚本中,平台就无法稳定说明执行发生在哪个受控环境、哪些文件 / 网络 / 进程 / 资源边界生效、输出如何被安全带回、失败和清理如何留下可对账材料。当前重新讨论 `L4-sandbox`,是为了先把运行隔离基础的问题层收束干净,避免旧材料中的后端、接口、对象、性能和验收想象直接替代需求问题定义。

### 6.2 现状与问题结论

| 问题编号 | 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|---|
| P-SBX-001 | 运行隔离问题层未按当前需求标准收束 | 旧 README 和旧 `00/02/05/06` 已把背景、后端、接口、对象、测试、验收和性能目标混写;当前正式 `00` 尚未按 Step 1~17 重建。 | 后续 `01~07` 容易继承旧后端、旧对象名、旧接口和旧指标,导致需求、设计、测试和验收链路失真。 |
| P-SBX-002 | 执行隔离边界容易在调用方处分裂 | runtime、tools、member-service、runner 和人工脚本都可能触发真实执行;若各自处理文件、网络、进程、资源和策略落地,同一风险动作会出现多套隔离语义。 | 未受控执行、未授权访问、宿主污染、策略绕过和调用方各自兜底会变成平台级安全与审计风险。 |
| P-SBX-003 | 输出、观测、失败和清理语义容易混层且不可对账 | 旧材料反复出现 stdout/stderr、输出文件、usage、audit、timeout、kill、replay、cleanup 等主题,但也混入 artifact truth、observability store、runtime recover 和验收项。 | 执行结果可能被误当正式制品或运行主真相,cleanup 可能先删证据,失败分类和审计材料无法被相邻仓稳定消费。 |

### 6.3 量化处理结论

| 量化线索 | 当前 Step 3 结论 | 后续落点 |
|---|---|---|
| 沙箱启动、销毁、出网检查延迟 | 不作为当前已确认问题量化。 | Step 13 非功能需求;Step 14 验收标准;后续 05/06。 |
| 未授权访问成功率、输出回收率、控制留痕率 | 不写成 Step 3 目标值或通过条件。 | Step 10 规则边界;Step 13 NFR;Step 14 验收。 |
| 旧“分散在 runtime / tools / scripts”“风险高”表述 | 可作为当前表现,但不等于真实测量。 | Step 3 问题表;后续由测试和验收补证据。 |

### 6.4 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“真实代码、工具、构建测试和 Runner 应用如何受控执行”的统一需求语言,导致用户、安全审查者、AI 成员调用方和相邻仓难以稳定理解执行风险、输出责任、失败后果和清理边界。 |
| 技术问题 | execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、capture、observability hook、failure classification、lease/cleanup/reaper 和 security redlines 若不先在需求问题层讲清,后续架构、概要、详细、配置、测试、验收和实施会在 tools、runtime、member-service、artifact、observability、governance 和 runner 之间反复串线。 |

### 6.5 后续 Step 保护线

| 后续 Step | Step 3 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 4 目标与非目标 | 目标应从 P-SBX-001~003 反推,但不能新增未在问题层出现的方向。 | 本 Step 不写“要实现什么”。 |
| Step 5 用户与角色 | 角色应从真实执行调用方、安全审查、运维和系统消费者推导。 | 本 Step 不写角色矩阵。 |
| Step 6 使用方与依赖 | 依赖裁剪应围绕执行触发方、策略来源、输出消费者和观测消费者展开。 | 本 Step 不写依赖图或接口。 |
| Step 7 以后 | 核心能力闭环可围绕问题中的隔离边界统一、输出/观测/失败/清理可对账收束。 | 本 Step 不写能力节点、功能编号、规则、数据、接口或验收。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | Step 3 只输出背景、问题表和问题分类,不需要拆依赖、对象或接口附录。 |
| 是否生成依赖类中间产物 | no | 提到 runtime/tools/member-service/runner/artifact/observability/governance 只是影响范围,依赖裁剪留 Step 6 / Step 12。 |
| 是否使用旧量化指标 | no | 旧数字不作为当前真实问题量化,后置到 NFR / 验收 / 测试。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 3 的上游冲突;旧材料冲突均已作为 historical_material 处理。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 3 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 3. 背景与问题定义

> 校准来源：
> - `design-calibration/00_req_step_03_problem_context.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从上游背景、相邻仓边界和旧材料审计中收束为当前问题主线。

### 3.1 业务背景

Quantalithos 的 AI 成员、工具调用、构建测试和 Runner 应用都会触发真实代码或进程执行;这些执行一旦散落在 runtime、tools、member-service、runner 或人工脚本中,平台就无法稳定说明执行发生在哪个受控环境、哪些文件 / 网络 / 进程 / 资源边界生效、输出如何被安全带回、失败和清理如何留下可对账材料。当前重新讨论 `L4-sandbox`,是为了先把运行隔离基础的问题层收束干净,避免旧材料中的后端、接口、对象、性能和验收想象直接替代需求问题定义。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 运行隔离问题层未按当前需求标准收束 | 旧 README 和旧 `00/02/05/06` 已把背景、后端、接口、对象、测试、验收和性能目标混写;当前正式 `00` 尚未按 Step 1~17 重建。 | 后续 `01~07` 容易继承旧后端、旧对象名、旧接口和旧指标,导致需求、设计、测试和验收链路失真。 |
| 执行隔离边界容易在调用方处分裂 | runtime、tools、member-service、runner 和人工脚本都可能触发真实执行;若各自处理文件、网络、进程、资源和策略落地,同一风险动作会出现多套隔离语义。 | 未受控执行、未授权访问、宿主污染、策略绕过和调用方各自兜底会变成平台级安全与审计风险。 |
| 输出、观测、失败和清理语义容易混层且不可对账 | 旧材料反复出现 stdout/stderr、输出文件、usage、audit、timeout、kill、replay、cleanup 等主题,但也混入 artifact truth、observability store、runtime recover 和验收项。 | 执行结果可能被误当正式制品或运行主真相,cleanup 可能先删证据,失败分类和审计材料无法被相邻仓稳定消费。 |

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“真实代码、工具、构建测试和 Runner 应用如何受控执行”的统一需求语言,导致用户、安全审查者、AI 成员调用方和相邻仓难以稳定理解执行风险、输出责任、失败后果和清理边界。 |
| 技术问题 | execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、capture、observability hook、failure classification、lease/cleanup/reaper 和 security redlines 若不先在需求问题层讲清,后续架构、概要、详细、配置、测试、验收和实施会在 tools、runtime、member-service、artifact、observability、governance 和 runner 之间反复串线。 |
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否说明当前业务背景 | pass | 已说明 AI 成员、工具、构建测试和 Runner 应用会触发真实执行,需要收束运行隔离问题层。 |
| 是否列出 1~3 个主要问题 | pass | 已列 P-SBX-001~003 三个问题。 |
| 是否处理量化问题 | pass | 明确旧指标不作为 Step 3 真实量化,后置到 NFR / 验收 / 测试。 |
| 是否说明无法量化问题的表现与后果 | pass | 每个问题均有当前表现和影响范围 / 后果。 |
| 是否区分业务问题与技术问题 | pass | 已形成业务问题和技术问题二分表。 |
| 是否未写目标与非目标 | pass | 未写目标、非目标或“本次要达成”的状态。 |
| 是否未写核心能力、用户故事、功能、规则、数据、接口或实现路径 | pass | 未写功能编号、能力节点、schema、port、API、backend、配置或代码目录。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前只写设计中间产物,无实现证据。 |
| 是否允许进入 Step 4 | pass_wait_review | 技术上 Step 3 已完成;按用户要求等待审查确认后再进入 Step 4。 |

next_allowed_action: `wait_user_confirm_step_4`
