# L4-sandbox 00 需求 Step 2: 本仓定位与边界

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 1,允许进入 Step 2;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 2 章“本仓定位与边界”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `design-calibration/00_req_step_01_upstream_relation.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 前置确认 | pass:用户在 Step 1 停审后回复“同意”,允许进入 Step 2 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`design-calibration/00_req_step_01_upstream_relation.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 2;`需求文档书写规范.md` §4.2 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取定位输入 | yes:`projects/README.md`;`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md`;`product/六域模型.md`;`standards/子项目遵循规范清单.md` |
| 已读取相邻边界输入 | yes:`projects/L2-tools/00~06`;`projects/L2-runtime/00~06`;`projects/L2-member-service/00~06`;`projects/L1-identity/00~07`;`projects/L1-work/00~07`;并抽查 `L1-artifact` / `L1-governance` Step 2 粒度 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_3 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1、SOP、书写规范和相邻边界输入摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 一句话定义、单独成仓原因、本仓不是什么、混淆对象的直接回答 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 上游边界、历史材料、旧正式文档和相邻仓冲突诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 定位措辞、非职责范围、边界对象和单独成仓原因取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 边界声明表、边界对象候选、混淆解释候选和后续 Step 保护线 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录 / 是否生成依赖类中间产物判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 2 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 2 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 3。 |

---

## 2. 必读摘要

| 文档 | Step 2 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 2 | 本步目标是建立本仓正确心智;输出一句话定义、非职责、边界对象和单独成仓原因。 | 不进入背景、目标、依赖、核心能力、故事、功能、规则、数据、接口、NFR 或验收。 |
| `需求文档书写规范.md` §4.2 | 正式第 2 章必须固定为一张边界声明表和一段 2~4 句短文字;边界对象只列对象,不解释依赖。 | 中间产物可以记录诊断和取舍,但回填草稿必须保持仓级短表达。 |
| `00_req_step_01_upstream_relation.md` | L4-sandbox 是架构反推型 / 基础设施契约型需求来源,承接运行隔离基础主题;旧 README 和旧正式文档只作 historical_material。 | Step 2 只从 Step 1 来源中收束定位,不得继承旧技术栈、后端清单、性能目标或对象模型。 |
| `全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期依赖 `L0-core`,运行期依赖容器 / k8s / isolation backend,按需发布 sandbox 事件,不拥有业务真相。 | 这证明本仓是基础设施边界仓;具体依赖裁剪留到 Step 6 / Step 12。 |
| `architecture/仓库拆分方案.md` | `L4-sandbox` 的仓级作用是代码执行隔离,服务 Member 跑代码的安全环境;Docker/gVisor/Firecracker 等是历史架构线索。 | 一句话定义可使用“运行隔离基础 / 受控执行环境”,但不固化隔离后端。 |
| `architecture/标准对齐全景图.md` | sandbox 对齐沙箱逃逸防御、Security Resistance 和 AI System Operation 阶段隔离。 | Step 2 可把安全隔离作为定位底色,但安全红线和指标后置到 Step 10/13/14。 |
| `product/六域模型.md` | `quantalithos-sandbox` 位于六域之外的横切基础设施,承担执行隔离。 | 本仓不是任何业务域 truth,也不是执行主脑或工具语义层。 |
| `standards/子项目遵循规范清单.md` | 旧 SB1~SB5 给出隔离后端、默认无出网、事件、资源限制、Runner/Member 共用接口等线索。 | 只作为 historical / topic input;Step 2 不写事件名、接口名或后端承诺。 |
| `L2-tools` 参考文档 | tools 拥有 ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry;sandbox 只提供 restricted / governed 执行的隔离边界。 | 本仓非职责必须排除工具语义、工具策略 truth、工具结果归一化和工具审计 truth。 |
| `L2-runtime` 参考文档 | runtime 拥有 ExecutionInstance、CurrentStep、执行推进、反馈、recover/checkpoint、结果回流;sandbox 是被调度的执行能力层。 | 本仓非职责必须排除 agent loop、execution truth、step progression、recover 主线和业务结果回流。 |
| `L2-member-service` 参考文档 | member-service 拥有 MemberExecutionHost、session、worker、health、SandboxBinding 装配结果和 callback material;SandboxBinding 不等于 sandbox truth。 | 本仓非职责必须排除成员宿主生命周期、宿主绑定结果 truth、host failure truth 和 callback material truth。 |
| `L1-identity` / `L1-work` 参考文档 | identity 拥有 actor/member identity truth;work 拥有 Project、ProjectMember、WorkItem、Iteration、ImplementationPlan 等工作事实。 | sandbox 可消费身份 / 工作引用,但不能重定义身份、成员生命周期、工作事实或实施计划正文。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本仓一句话定义是什么? | `L4-sandbox` 是平台运行隔离基础仓,负责把需要受控执行的代码、工具、构建、测试或 Runner 应用放入可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 |
| 为什么它需要单独成仓? | 运行隔离同时横跨 execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、artifact/output capture、observability hook、failure classification、lease/cleanup/reaper 和 security redlines;这些边界若散落在 tools、runtime、member-service 或 runner 中,会产生策略漂移、绕过风险和多套隔离语义。 |
| 本仓不是什么? | 它不是工具语义执行仓、runtime agent loop / execution truth 仓、member host lifecycle / orchestration 仓、identity truth 仓、work truth 仓、artifact truth 仓、observability store、governance / capability policy decision 仓或容器平台产品本体。 |
| 最容易与哪些相邻仓或概念混淆? | 最易与 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work`、`L1-artifact`、`L4-observability`、governance / capability policy、`L5-runner` 和具体容器 / k8s / isolation backend 混淆;也易把 execution environment identity、SandboxBinding、ToolPolicy、ExecutionInstance、artifact output 和 telemetry store 写成 sandbox 内部 truth。 |

---

## 4. 当前材料诊断

### 4.1 上游定位诊断

Step 1 已确认本仓需求来源不是用户故事直接推导,而是架构反推型 / 基础设施契约型。Step 2 因此不能用“跑工具”“跑 runtime”“管理成员容器”作为本仓定义,而应以“运行隔离基础”收束。这个定位需要足够窄:它只说明本仓负责隔离执行环境的 truth 和边界;也需要足够完整:它不能只写“容器执行器”,否则 Step 5 以后会漏掉身份、资源、文件系统、网络、进程、策略执行、捕获、观测、失败和清理等后续必需主题。

### 4.2 相邻仓混淆诊断

| 相邻对象 | 容易混淆点 | Step 2 诊断 |
|---|---|---|
| 仓:`L2-tools` | restricted / governed tool 需要 sandbox,容易把 ToolPolicy、ToolInvocationResult 或 ToolAuditEntry 放进 sandbox。 | tools 拥有工具语义、调用请求、策略和工具结果; sandbox 只提供隔离执行环境和边界反馈材料。 |
| 仓:`L2-runtime` | runtime 调度 sandbox,容易把 ExecutionInstance、step progression、recover/checkpoint 写进 sandbox。 | runtime 拥有执行主线 truth; sandbox 只承接被要求隔离运行的执行单元并返回隔离层结果材料。 |
| 仓:`L2-member-service` | member-service 绑定 sandbox,容易把 SandboxBinding 或宿主生命周期等同于 sandbox truth。 | member-service 拥有宿主、session、worker、health 和 bind 结果; sandbox 拥有隔离环境自身的建立、限制、捕获、失败和清理边界。 |
| 仓:`L1-identity` | sandbox 需要 actor/member ref,容易重建 actor identity 或 capability identity。 | identity 拥有成员 / actor 真相; sandbox 只能消费身份锚点作为执行环境语境。 |
| 仓:`L1-work` | sandbox 执行会关联项目、工作项、计划或 runner 上下文,容易持有工作事实正文。 | work 拥有项目、成员、工作项、迭代和实施计划 truth; sandbox 只能消费上下文引用。 |
| 仓:`L1-artifact` | sandbox 捕获输出和候选制品,容易把 artifact 正文、版本、baseline 或 evidence truth 写入 sandbox。 | artifact 拥有正式制品 truth; sandbox 只形成执行输出 / 候选材料 / 捕获材料,不决定正式 artifact truth。 |
| 仓:`L4-observability` | sandbox 会产生 trace、metric、audit hook,容易成为观测存储。 | observability 拥有观测存储和查询; sandbox 只发出可观测材料或 hook。 |
| 概念:governance / capability policy | sandbox 执行需要 allow/deny 语境,容易让 sandbox 决定策略。 | governance / capability / tools 持有策略决策或能力定义; sandbox 只执行已给定 launch/isolation policy 并 fail closed。 |
| 仓:`L5-runner` | Runner 应用可能由 sandbox 承载,容易让 sandbox 管 runner 产品语义。 | runner 是消费方 / 调用方; sandbox 不拥有 runner 工作流、UI、CLI 或一键运行产品语义。 |
| 概念:container / k8s / isolation backend | 旧文档写 Docker/gVisor/Firecracker,容易把后端产品当成本仓定义。 | 具体后端是运行期依赖 / 架构与配置选择; Step 2 只定义隔离基础仓,不定义产品选型。 |

### 4.3 旧材料诊断

| 旧材料 | 可吸收线索 | 必须排除的旧内容 | 当前处理 |
|---|---|---|---|
| `README.md` | 代码执行隔离、资源限制、默认无出网、审计、Runner/Member 共用线索。 | Rust/Go 技术栈、目录树、Docker/gVisor/Firecracker 直接承诺、性能目标和接口形态。 | 作为 historical_material 审计输入,不作为 Step 2 结论来源。 |
| 旧 `00-需求文档.md` | 背景和目标中出现的隔离执行、资源、文件、网络、审计、清理等主题。 | 旧 13 节结构、SandboxService trait、F 编号、数据实体、接口依赖、性能阈值和验收。 | 只保留主题线索,不继承旧定位句或旧功能编号。 |
| 旧 `01/02/03` | “受控执行隔离层”“统一执行壳”以及执行 / 资源 / 命令 / 输出 / 失败五段线索。 | 组件、对象、流程、状态、目录、持久化和后端选型。 | 可作为后续 Step 7 或设计阶段审计候选,不在 Step 2 固化。 |
| 旧 `05/06` | 测试和验收中与隔离、安全、清理、资源有关的候选主题。 | 真实测试结果、evidence alias、run_id、验收签署和 pass 结论。 | 不进入当前 Step 2 定位。 |
| 前序粗稿 Step 2~4 | 无。 | 用户确认“从头开始”后全部失效。 | 已删除,不得引用。 |

---

## 5. 设计取舍

### 5.1 一句话定义取舍

| 候选 | 优点 | 问题 | 决策 |
|---|---|---|---|
| `代码执行隔离仓` | 贴近架构拆分方案和旧规范使命。 | 太窄,容易漏掉工具、构建、测试、runner 应用等受控执行场景,也无法表达捕获、观测、失败和清理。 | 不采用为最终定义,只保留为来源短语。 |
| `容器 / 沙箱执行器` | 易理解为实际运行环境。 | 容易把具体后端产品和 execute API 变成本仓全部职责。 | 不采用。 |
| `受控执行隔离层` | 继承旧概要设计中的强表达,能提示受控执行。 | “层”不如“仓”明确,且缺少执行环境身份、资源、捕获、观测、失败和清理语义。 | 可作为解释性词汇,不作为最终一句话定义。 |
| `平台运行隔离基础仓` | 能表达基础设施属性,并把执行环境 identity、limits、FS/network/process boundary、launch policy、capture、observability hook、failure、cleanup 和 redlines 后续纳入同一边界。 | 句子需要控制长度,避免变成 Step 7 能力清单。 | 采用,但只在一句话中列仓级职责主题,不展开能力闭环。 |

### 5.2 非职责取舍

| 非职责候选 | 是否纳入 Step 2 | 理由 |
|---|---|---|
| 工具语义执行 / ToolPolicy / ToolInvocationResult / ToolAuditEntry | 纳入 | 这是与 `L2-tools` 最直接的串线风险。 |
| runtime agent loop / ExecutionInstance / checkpoint / recover / result backflow | 纳入 | 这是与 `L2-runtime` 的核心 truth 分界。 |
| member host lifecycle / SandboxBinding / host health / callback material | 纳入 | 这是与 `L2-member-service` 的核心 truth 分界。 |
| identity truth / work truth | 纳入 | sandbox 需要引用上下文,但不能拥有上游业务 truth。 |
| artifact truth / observability store | 纳入 | sandbox 会捕获材料并发出观测 hook,但不能成为制品或观测真相仓。 |
| governance / capability policy decision | 纳入 | sandbox 必须执行已给定策略并 fail closed,但不产生治理决策 truth。 |
| 容器平台产品本体 | 纳入 | 防止把 Docker/k8s/gVisor/Firecracker 后端选择写成需求定位。 |
| 配置、测试、验收、实施计划 | 不纳入正式非职责句 | 它们属于文档阶段边界,不属于本仓业务边界对象。 |

### 5.3 边界对象取舍

| 对象类型 | 纳入对象 | 当前理由 | 后续落点 |
|---|---|---|---|
| 仓 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L1-identity`;`L1-work`;`L1-artifact`;`L4-observability`;`L5-runner` | 都会与 sandbox 有执行、身份、结果、观测或调用接缝,且容易混入 truth。 | Step 6 / Step 12 再裁剪依赖和接口。 |
| 概念 | governance / capability policy decision;execution environment identity;SandboxBinding;ToolPolicy;ExecutionInstance;artifact output / candidate material;telemetry / audit store | 这些概念是最常见的跨仓语义混淆点。 | Step 10/11/12/13/14 逐步展开规则、数据、接口、NFR 和验收。 |
| 层 / 后端 | container / k8s / isolation backend | 这是运行期依赖或架构配置对象,不是 sandbox 的需求定义本体。 | Step 6 作为运行期依赖;Step 01/04 再定架构与配置。 |

### 5.4 单独成仓原因取舍

单独成仓理由不能写成“为了代码复用”或“为了技术选型独立”。真正的成仓理由是隔离边界具备跨调用方、跨执行类型、跨风险等级的一致性要求:同一平台内 tools、runtime、member-service、runner 和后续能力层都会要求受控执行,但它们不应各自实现一套资源限制、文件系统 / 网络 / 进程边界、策略执行、捕获、失败分类和清理逻辑。若隔离逻辑散落,最直接的后果是策略漂移、绕过风险、失败语义不一致、清理泄漏以及审计材料不可对账。

---

## 6. 结构化中间产物

### 6.1 Step 2 边界声明结论

| 字段 | 结论 | 来源 |
|---|---|---|
| 一句话定义 | `L4-sandbox` 是平台运行隔离基础仓,负责把需要受控执行的代码、工具、构建、测试或 Runner 应用放入可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 | SOP 问题回答;上游定位诊断;一句话定义取舍。 |
| 本仓不是什么 | `L4-sandbox` 不是工具语义执行仓、runtime agent loop / execution truth 仓、member host lifecycle / orchestration 仓、identity truth 仓、work truth 仓、artifact truth 仓、observability store、governance / capability policy decision 仓或容器平台产品本体。 | 非职责取舍;相邻仓混淆诊断。 |
| 边界对象列表 | 仓:`L2-tools`;仓:`L2-runtime`;仓:`L2-member-service`;仓:`L1-identity`;仓:`L1-work`;仓:`L1-artifact`;仓:`L4-observability`;仓:`L5-runner`;概念:governance / capability policy decision;概念:execution environment identity;概念:SandboxBinding;概念:ToolPolicy;概念:ExecutionInstance;概念:artifact output / candidate material;概念:telemetry / audit store;后端:container / k8s / isolation backend。 | 边界对象取舍;相邻仓混淆诊断。 |
| 单独成仓原因 | `L4-sandbox` 必须单独成仓,因为运行隔离需要在多调用方之间统一执行环境身份、资源限制、文件系统 / 网络 / 进程边界、启动策略执行、输出捕获、观测钩子、失败分类、租约清理和安全红线,避免这些规则散落在 tools、runtime、member-service 或 runner 中造成策略漂移和绕过风险。 | 单独成仓原因取舍。 |

### 6.2 边界对象解释候选

此表只为中间产物审查提供解释,不直接进入正式第 2 章的边界声明表;正式表中的“边界对象列表”只列对象。

| 边界对象 | 保留原因 | 不在 Step 2 展开的内容 |
|---|---|---|
| `L2-tools` | 防止 tools semantic execution、ToolPolicy、ToolInvocationResult、ToolAuditEntry 被写入 sandbox。 | 工具定义、策略表、工具调用接口和结果 schema。 |
| `L2-runtime` | 防止 ExecutionInstance、CurrentStep、agent loop、recover/checkpoint、结果回流被写入 sandbox。 | 执行状态机、调度流程和回流接口。 |
| `L2-member-service` | 防止 MemberExecutionHost、SandboxBinding、host health、callback material 与 sandbox truth 混层。 | 宿主生命周期、bind contract 和 callback 协议。 |
| `L1-identity` / `L1-work` | 防止 sandbox 反向定义 actor/member/project/work/plan truth。 | 身份模型、工作模型和 ImplementationPlan 结构。 |
| `L1-artifact` | 防止 capture 的输出 / 候选材料被误当正式 Artifact truth、baseline 或 evidence。 | Artifact 数据归属、版本、血缘、baseline 和 evidence 证据口径。 |
| `L4-observability` | 防止 sandbox 成为 telemetry / audit / metric 存储。 | trace schema、metric store、audit 查询和 retention。 |
| governance / capability policy decision | 防止 sandbox 自行做治理决策或能力授权。 | policy DSL、decision object、approval flow 和 capability catalog。 |
| container / k8s / isolation backend | 防止把后端产品当成需求定位。 | 后端选型、配置 key、调度实现和部署拓扑。 |

### 6.3 后续 Step 保护线

| 后续 Step | Step 2 必须提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 3 背景与问题定义 | 背景只能围绕运行隔离缺位、边界漂移、策略绕过和清理不可对账等问题展开。 | 不写目标、能力、功能或解决方案。 |
| Step 4 目标与非目标 | 目标必须回指运行隔离基础仓定位;非目标必须继续保护 tools/runtime/member/identity/work/artifact/observability/governance 边界。 | 不写接口、数据模型或后端选型。 |
| Step 5 用户与角色 | 用户 / 角色需区分调用方、维护者、安全审查者和系统消费者。 | 不把角色等同于实现组件。 |
| Step 6 使用方与依赖 | 依赖裁剪必须基于本 Step 的边界对象做运行期 / 编译期 / 事件 / 禁止依赖分类。 | 不把相邻仓 truth 并入 sandbox。 |
| Step 7 以后 | 核心能力闭环可从 identity、limits、filesystem/network/process boundary、launch policy、capture、observability hook、failure、cleanup 和 redlines 收束。 | Step 2 不直接生成能力节点、功能编号、规则表、数据矩阵或接口清单。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | Step 2 只做仓级定位与边界声明,不需要拆出依赖类、对象类或接口类附录。 |
| 是否生成依赖类中间产物 | no | 虽然讨论到相邻仓,但正式依赖裁剪属于 Step 6 / Step 12;当前只列边界对象。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 2 的上游冲突;旧材料冲突均已作为 historical_material 处理。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 2 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“当前材料诊断”小节，了解本章边界如何从上游来源、相邻仓边界和旧材料审计中收束而来。

| 字段 | 结论 |
|---|---|
| 一句话定义 | `L4-sandbox` 是平台运行隔离基础仓,负责把需要受控执行的代码、工具、构建、测试或 Runner 应用放入可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 |
| 本仓不是什么 | `L4-sandbox` 不是工具语义执行仓、runtime agent loop / execution truth 仓、member host lifecycle / orchestration 仓、identity truth 仓、work truth 仓、artifact truth 仓、observability store、governance / capability policy decision 仓或容器平台产品本体。 |
| 边界对象列表 | 仓:`L2-tools`;仓:`L2-runtime`;仓:`L2-member-service`;仓:`L1-identity`;仓:`L1-work`;仓:`L1-artifact`;仓:`L4-observability`;仓:`L5-runner`;概念:governance / capability policy decision;概念:execution environment identity;概念:SandboxBinding;概念:ToolPolicy;概念:ExecutionInstance;概念:artifact output / candidate material;概念:telemetry / audit store;后端:container / k8s / isolation backend。 |
| 单独成仓原因 | `L4-sandbox` 必须单独成仓,因为运行隔离需要在多调用方之间统一执行环境身份、资源限制、文件系统 / 网络 / 进程边界、启动策略执行、输出捕获、观测钩子、失败分类、租约清理和安全红线,避免这些规则散落在 tools、runtime、member-service 或 runner 中造成策略漂移和绕过风险。 |

`L4-sandbox` 单独存在是为了让隔离执行环境的身份、限制、捕获、失败和清理语义在平台内保持统一,而不是让每个调用方各自实现一套沙箱。它最容易与 `L2-tools` 的工具语义、`L2-runtime` 的执行主线、`L2-member-service` 的宿主绑定、`L1-artifact` 的制品真相和 `L4-observability` 的观测存储混淆。上述边界必须分开,否则策略决策、执行事实、宿主状态、候选输出和审计材料会被错误地写成 sandbox truth,最终形成绕过风险和多真相。
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答一句话定义 | pass | 已收束为“平台运行隔离基础仓”。 |
| 是否说明单独成仓原因 | pass | 已围绕跨调用方统一隔离边界、防止策略漂移和绕过风险收束。 |
| 是否明确本仓不是什么 | pass | 已排除 tools、runtime、member-service、identity、work、artifact、observability、governance / capability 和后端产品职责。 |
| 是否指出至少 2 个最易混淆边界 | pass | 已列 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-artifact`、`L4-observability` 等边界对象。 |
| 是否未展开使用方与依赖 | pass | 只列边界对象;依赖裁剪留到 Step 6 / Step 12。 |
| 是否未展开核心能力闭环 | pass | 未生成能力节点或能力流程;只在保护线中提示后续方向。 |
| 是否未展开功能、规则、数据、接口、NFR 或验收 | pass | 未写功能编号、规则表、数据矩阵、接口清单、指标或验收项。 |
| 是否未写实现路径 | pass | 未固化 Docker/gVisor/Firecracker/k8s 等后端选型、配置 key、代码目录或 schema。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前只写设计中间产物,无实现证据。 |
| 是否允许进入 Step 3 | pass_wait_review | 技术上 Step 2 已完成;按用户要求等待审查确认后再进入 Step 3。 |

next_allowed_action: `wait_user_confirm_step_3`
