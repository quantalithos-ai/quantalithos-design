# L4-sandbox 00 需求 Step 1: 与上游文档的关系声明

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认从头开始;旧 L4-sandbox 正式文档和前序 calibration 粗稿只作 historical_material / invalidated_material。
> 回填位置: `00-需求文档.md` 第 1 章“与上游文档的关系声明”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md`;`需求文档书写规范.md` |
| 已读取项目输入 | yes:`projects/L4-sandbox/README.md`;旧 `00/01/02/03/05/06`;当前 `design-calibration` 粗稿 |
| 已读取上游参考 | yes:`projects/L2-tools/00~06`;`projects/L2-runtime/00~06`;`projects/L2-member-service/00~06`;`projects/L1-identity/00~07`;`projects/L1-work/00~07` |
| 已读取全局输入 | yes:`projects/README.md`;`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md`;`product/六域模型.md`;`standards/子项目遵循规范清单.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_2 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要和读取边界 | pass | 进入来源分层思考。 |
| 模块 1 权威来源分层:先思考 | done | 问题回答、诊断、取舍 | pass | 写入来源分层表。 |
| 模块 1 权威来源分层:再写入 | done | 来源分层表 | pass | 进入上游参考收束。 |
| 模块 2 上游边界参考:先思考 | done | L2/L1 上游接缝判断 | pass | 写入上游主题表。 |
| 模块 2 上游边界参考:再写入 | done | 上游参考摘要和禁止反向拥有清单 | pass | 进入文档链路收束。 |
| 模块 3 文档链路收束:先思考 | done | 00 到 01~07 的承接判断 | pass | 写入链路说明。 |
| 模块 3 文档链路收束:再写入 | done | 文档链路说明表 | pass | 进入历史材料差异审计。 |
| 模块 4 旧材料差异审计:先思考 | done | 旧正式文档、README、粗稿冲突判断 | pass | 写入 historical / invalidated material 表。 |
| 模块 4 旧材料差异审计:再写入 | done | 历史材料处理结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 1 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表和下一步门禁 | pass_wait_review | wait_user_confirm_step_2 |

---

## 2. 必读文档摘要

| 文档 | 读取结论 | 对 Step 1 的影响 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | Step 1 只处理“与上游文档的关系声明”;每个 Step 必须独立产出中间产物;Step 7 以后以能力节点小循环推进。 | 本文件只回答来源和承接关系,不提前写本仓定位、能力、功能、数据或接口。 |
| `standards/document/需求文档书写规范.md` | 正式第 1 章应说明本文承接哪些上游、承接主题、为什么不是重新定义主题、在当前仓承担什么细化作用。 | 回填草稿必须是来源声明,不是边界声明或功能清单。 |
| `standards/document/设计文档讨论中间产物规范.md` | full-restart 需从 Step 1 重启;旧文件不得小修补;未来 Step 文件不得提前批量落盘;三层台账必须同步。 | 删除无效 Step 2~4 粗稿;重建项目台账、flow 和 Step 1。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 继续任务必须从项目台账、flow 和当前 Step 文件恢复;实现边界内类型、状态、artifact、evidence、phase 必须有真相源。 | Step 1 不能生成 schema、port、state、evidence 或 implementation boundary;只建立后续闭环输入。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期依赖 `L0-core`;运行期依赖容器 / k8s / isolation backend;按需发布 sandbox 事件;不拥有业务真相。 | 作为全局依赖来源;具体依赖裁剪留到 Step 6 / Step 12。 |
| `projects/README.md` | L4-sandbox 是 27 仓中的 L4 基础设施层项目,属于架构反推型 / 基础设施契约型需求来源。 | Step 1 应说明需求来自架构边界、横切基础设施和下游共同需要,不是单一产品故事直推。 |
| `architecture/仓库拆分方案.md` | L4-sandbox 的作用是代码执行隔离;能力线索包括 Docker/gVisor 加固、资源限额、文件系统快照和回滚。 | 可作为仓级存在来源;具体后端、快照、回滚能力不得在 Step 1 固化。 |
| `architecture/标准对齐全景图.md` | `quantalithos-sandbox` 对齐沙箱逃逸防御、ISO 25010 Security Resistance、ISO 42001 A.6 Operation 阶段隔离。 | 可作为安全与标准主题输入;具体 NFR、红线和验收后置到 Step 10/13/14。 |
| `product/六域模型.md` | L4 基础设施是六域之外的横切基础设施;`quantalithos-sandbox` 承载执行隔离。 | 说明 sandbox 不是业务域 truth,而是横切执行隔离基础。 |
| `standards/子项目遵循规范清单.md` | 旧规范列出 SB1~SB5:后端、默认无出网、事件与资源、硬限制、Runner/Member 共用接口。 | 只作历史 / 主题线索;不得在 Step 1 固化具体后端和事件名。 |
| 旧 L4-sandbox `README/00/01/02/03/05/06` | 旧材料含执行隔离、资源限制、默认无出网、审计、cleanup 等有价值线索,但混入目录、实现、对象、接口、测试、验收和性能数字。 | 全部标为 historical_material;只在后续对应 Step 差异审计。 |
| 前序 `00_req_step_02/03/04` 粗稿 | 这些文件在用户确认“从头开始”后失效,且已经越过 Step 1 停审。 | 作为 invalidated_material 删除,不得作为后续输入。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本文承接哪些上游文档? | 承接 `projects/README.md` 的 L4 基础设施仓定位,`architecture/仓库拆分方案.md` 的代码执行隔离来源,`architecture/标准对齐全景图.md` 的沙箱逃逸 / Security / Operation 隔离标准线索,`product/六域模型.md` 的横切基础设施定位,`全局项目依赖关系与裁剪规则.md` 的依赖方向,以及 L2-tools / L2-runtime / L2-member-service / L1-identity / L1-work 的上游接缝参考。 |
| 承接的是上游哪一部分主题? | 承接“运行隔离基础”主题:受控执行环境来源、隔离边界、资源限制、执行准入、输出/候选制品捕获、观测接缝、失败与清理语义、安全红线的需求来源。 |
| 本文为什么不是重新定义该主题? | 上游文档已经确认 L4-sandbox 的存在、层级、依赖方向和安全主题;本需求文档只把这些来源收束为 L4-sandbox 仓级需求讨论入口,不重新定义工具语义、runtime 主循环、成员宿主、身份、工作事实、制品或观测真相。 |
| 本文在当前仓里承担什么细化作用? | 本文后续 Step 将把运行隔离基础细化为需求层的边界、问题、目标、用户/角色、依赖、核心能力、故事、功能、规则、数据归属、接口、NFR、验收、风险和追溯矩阵,再驱动 `01~07`。 |

---

## 4. 模块思考记录

### 4.1 模块 1 权威来源分层:先思考

Step 1 需要解决“当前需求文档从哪里来”,不是解决“sandbox 具体做什么”。因此来源必须分层,否则旧 README 的技术栈、旧 00 的功能表、旧 02/03 的对象和流程会提前变成需求结论。

| 层级 | 判定 | 使用方式 |
|---|---|---|
| 权威来源 | 能确认项目存在、层级、基础设施属性、仓级来源和全局依赖方向的正式文档。 | 可进入正式第 1 章来源映射。 |
| 流程约束 | 规定 full-restart、Step 纪律、正式章节、依赖裁剪和可落码性门禁的标准。 | 可进入方法声明,不产生需求能力。 |
| 主题输入 | 标准对齐、产品横切、旧规范强制项等提供主题线索的文档。 | 后续 Step 使用,本 Step 不固化能力或指标。 |
| 上游边界参考 | L2/L1 上游项目中与 sandbox 接缝相关的正式文档。 | 用于避免反向拥有上游 truth,具体边界留 Step 2/6/12。 |
| historical_material | L4-sandbox 旧 README 和旧正式文档。 | 只在独立结论形成后做差异审计。 |
| invalidated_material | 前序粗稿 Step 2~4。 | 删除,不得作为当前流程输入。 |

取舍:

| 取舍项 | 当前决定 | 原因 |
|---|---|---|
| 是否继承旧 `00-需求文档.md` 的来源声明 | 不继承,按新版 SOP 重写。 | 旧文档结构与当前 16 章规范不一致,且混入功能和实现。 |
| 是否把 Docker/gVisor/Firecracker 写进 Step 1 结论 | 不写成需求结论,只记录为历史 / 架构主题线索。 | 具体后端属于架构、配置、详细设计和后续 NFR/验收裁定。 |
| 是否把 SB1~SB5 写成当前需求目标 | 不在 Step 1 写目标。 | 目标与非目标属于 Step 4;本 Step 只说明来源。 |
| 是否现在写正式 `00-需求文档.md` 第 1 章 | 不写。 | 正式正文回填在 Step 17 统一进行,或至少需对应 Step 门禁打开。 |

### 4.2 模块 2 上游边界参考:先思考

上游参考不是为了复制上游模型,而是为了明确 L4-sandbox 不能反向拥有上游 truth。

- `L2-tools` 需要 sandbox 承载 governed / restricted / dangerous tool 的隔离执行,但 ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry 和工具失败分流归 tools。
- `L2-runtime` 会调度 tools / member-service / sandbox 等执行能力,但 ExecutionInstance、step progression、feedback、recover、checkpoint、结果回流归 runtime。
- `L2-member-service` 会绑定 sandbox 环境并管理宿主,但 MemberExecutionHost、session、worker、health、SandboxBinding 装配结果、host failure 和 callback material 归 member-service。
- `L1-identity` 提供 GlobalMember / actor 身份锚点,但 sandbox 不保存身份正文、不管理生命周期、不接管角色能力身份 truth。
- `L1-work` 提供 Project / ProjectMember / WorkItem / ImplementationPlan / promote 等工作事实引用,但 sandbox 不拥有项目事实、工作项、执行计划正文或正式工作全集。

这些上游材料对 Step 1 的作用是“说明本文承接的是执行隔离基础,不是相邻仓 truth”。具体边界表、依赖裁剪图和接口依赖要留到 Step 2 / Step 6 / Step 12。

### 4.3 模块 3 文档链路收束:先思考

新版 `00-需求文档.md` 是 L4-sandbox 的需求真相源入口。它承接架构、标准、全局依赖和上游接缝参考,把这些输入在需求层转为可审查、可追溯、后续可落码的需求链。后续 `01~07` 只能从新版 `00` 继续推导;旧 `01/02/03/05/06` 不得反推当前需求。

文档链路必须保持:

```text
上游来源 / 历史材料
  -> 00 Step 1~16 中间产物
  -> 00 Step 17 正式整理
  -> 01 架构
  -> 02 概要
  -> 03 详细
  -> 04 配置
  -> 05 测试
  -> 06 验收
  -> 07 实施计划 + implementation ledger + boundary skeleton
```

### 4.4 模块 4 旧材料差异审计:先思考

旧 L4-sandbox README 和正式文档可以提示主题,但不能成为当前基线。

| 旧材料表现 | 风险 | 当前处理 |
|---|---|---|
| README 直接写技术栈、目录结构、后端清单和性能目标。 | 会把架构/实施细节提前写入需求来源。 | 标为 historical_material;只保留“执行隔离”主题线索。 |
| 旧 `00` 使用旧 13 节结构,直接写 `SandboxService trait`、功能编号、数据实体、接口依赖、性能阈值和验收。 | Step 1~16 被跳过,功能/接口/测试混层。 | 标为 historical_material;后续逐 Step 重新审计。 |
| 旧 `01/02/03` 已写架构选型、概要主线、对象、目录、流程和持久化。 | 设计反推需求,造成旧模型锁死新版需求。 | 后续对应文档重启时审计,当前不继承。 |
| 旧 `05/06` 已写测试方案、验收门禁和证据词。 | 可能被误认为真实 evidence 或验收签署。 | 后续 05/06 重启时审计;当前不伪造测试结果。 |
| 前序 Step 2~4 粗稿已经生成。 | 与用户最新“从头开始”冲突,且未来 Step 不应提前落盘。 | 已删除;作为 invalidated_material 记录。 |

---

## 5. 结构化中间产物

### 5.1 来源分层表

| 分层 | 文档 | Step 1 使用结论 | 限制 |
|---|---|---|---|
| 权威来源 | `projects/README.md` | L4-sandbox 是正式 L4 基础设施项目,属于架构反推型 / 基础设施契约型需求来源。 | 不从项目清单推出能力、对象、接口或实现方案。 |
| 权威来源 | `architecture/仓库拆分方案.md` | L4-sandbox 承接“代码执行隔离 / 执行隔离”这一横切基础设施职责。 | 不在 Step 1 固化 Docker/gVisor/Firecracker、快照、回滚等方案。 |
| 权威来源 | `standards/document/全局项目依赖关系与裁剪规则.md` | L4-sandbox 编译期依赖 `L0-core`,运行期依赖 isolation backend,按需发布 sandbox 事件,不拥有业务真相。 | 具体依赖裁剪留到 Step 6 / Step 12。 |
| 主题输入 | `architecture/标准对齐全景图.md` | 提供沙箱逃逸防御、Security Resistance、Operation 隔离等标准线索。 | 具体 NFR、安全红线和验收后置。 |
| 主题输入 | `product/六域模型.md` | 提供六域之外横切执行隔离的产品体系线索。 | 不把 sandbox 写成业务域 truth。 |
| 主题输入 | `standards/子项目遵循规范清单.md` | SB1~SB5 提供旧强制项线索:隔离后端、默认无出网、执行事件、资源限制、Runner/Member 共用。 | 旧强制项需后续按当前 SOP 重审,不得在 Step 1 直接继承。 |
| 流程约束 | `设计文档编写通则.md` | 正式正文只承载收口结论,中间产物承载诊断和取舍。 | Step 1 不写正式正文。 |
| 流程约束 | `设计文档讨论中间产物规范.md` | 三层台账、严格 Step、full-restart、未来 Step 不预生成。 | 删除粗稿 Step 2~4;等待用户确认再继续。 |
| 流程约束 | `设计真相源闭环与可落码性标准.md` | 后续 schema、state、event、artifact、evidence、phase boundary 必须闭合真相源。 | Step 1 不生成落码契约。 |
| 流程约束 | `需求文档讨论流程_SOP.md` / `需求文档书写规范.md` | Step 1 只回答上游关系声明,正式第 1 章只写来源和收束说明。 | 不提前写 Step 2 边界或 Step 7 能力。 |
| historical_material | 旧 L4-sandbox `README/00/01/02/03/05/06` | 提供旧主题线索和差异审计输入。 | 不继承旧结构、旧编号、实现目录、测试结果或验收签署。 |

### 5.2 上游边界参考表

| 上游参考 | 本 Step 承接的主题 | 禁止反向拥有的 truth | 后续落点 |
|---|---|---|---|
| `projects/L2-tools/00~06` | 危险 / restricted / governed tool 需要 sandbox 隔离和限制;tools 需要可对账的执行失败和审计材料。 | ToolDefinition、ToolContract、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry、工具结果/失败分流。 | Step 2 非职责;Step 6 使用方与依赖;Step 12 接口与依赖。 |
| `projects/L2-runtime/00~06` | runtime 会调度 tools / member-service / sandbox,并消费执行反馈与结果材料。 | ExecutionInstance、CurrentStep、agent loop、checkpoint/recover、runtime feedback、结果回流到 artifact/process/work/conversation 的 runtime truth。 | Step 2 非职责;Step 7 能力边界;Step 12 接口与依赖。 |
| `projects/L2-member-service/00~06` | member-service 需要 sandbox bind 完成后才能执行受限动作;host failure 与 business failure 分层。 | MemberExecutionHost、session、worker、health、SandboxBinding 装配结果、host failure、callback material。 | Step 2 非职责;Step 6 使用方;Step 10 规则边界。 |
| `projects/L1-identity/00~07` | sandbox 可消费 actor/member identity anchor 作为执行环境身份语境。 | GlobalMember truth、actor lifecycle、role/capability identity truth、identity 正文。 | Step 6 依赖;Step 11 引用数据归属。 |
| `projects/L1-work/00~07` | sandbox 可消费 project/work/context refs 作为执行上下文引用。 | Project、ProjectMember、WorkItem、Iteration、ImplementationPlan / PlanItem 正文、promote truth。 | Step 6 依赖;Step 11 引用数据归属。 |

### 5.3 文档链路说明

| 链路 | 当前收束结论 | 后续使用限制 |
|---|---|---|
| 上游架构 / 标准 / 下游接缝 -> 新版 00 | 新版 00 只承接运行隔离基础的需求语义来源。 | 不把上游仓的对象、状态或实现机制复制为 sandbox 功能。 |
| 新版 00 -> 新版 01 | 01 必须以后续完成的 00 边界、依赖、NFR 和红线为架构输入。 | 旧 01 只作 historical_material。 |
| 新版 00 -> 新版 02 | 02 必须以后续完成的 00 核心能力、功能、数据和接口边界为概要输入。 | 旧 02 五段主线需重新校准。 |
| 新版 00~02 -> 新版 03 | 03 才能定义对象、flow、状态、port、schema、持久化和目录。 | 00 Step 1 不预设代码目录或 DTO。 |
| 新版 00~03 -> 新版 04 | 04 当前缺失,后续由配置相关需求、架构和详细设计推导。 | 当前不发明配置 key。 |
| 新版 00~04 -> 新版 05/06 | 测试与验收从 00 的追溯、NFR、验收和红线承接。 | 当前不生成真实 evidence、run_id 或签署结论。 |
| 新版 00~06 -> 新版 07 | 实施计划必须在 00~06 闭合后形成 phase / commit boundary。 | 当前不生成 implementation ledger 或 boundary skeleton。 |

### 5.4 历史材料处理结论

| 材料 | 可保留为线索 | 不继承内容 | 后续落点 |
|---|---|---|---|
| `README.md` | 代码执行隔离、资源限制、默认无出网、审计事件、Runner/Member 共享。 | Rust/Go 选择、目录树、Docker/gVisor/Firecracker 直接承诺、性能目标。 | Step 2/4/7/10/13/14 审计。 |
| 旧 `00-需求文档.md` | 背景、目标、用户故事、功能、数据、接口、验收的候选主题。 | 旧 13 节结构、F-001~F-010、SandboxService trait、实体表、API/接口、性能阈值、验收结果。 | Step 2~16 逐步重审。 |
| 旧 `01-架构设计.md` | 后端、边界、上下文等架构候选。 | 任何架构决策、上下文图、技术选型作为当前需求结论。 | 01 full-restart 审计。 |
| 旧 `02-概要设计.md` | 执行请求/会话、隔离资源、命令桥接、输出审计、失败控制五段主线的候选。 | 主要组成、对象轮廓、主流程作为当前需求闭环。 | Step 7 后重新抽象;02 full-restart 审计。 |
| 旧 `03-详细设计.md` | 对象、状态、流程、目录、持久化、测试切口候选。 | Rust struct、文件布局、repository、flow、DTO、状态机。 | 03 full-restart 审计。 |
| 旧 `05/06` | 测试与验收候选主题。 | 真实测试结果、evidence、run_id、验收签署、pass 结论。 | 05/06 full-restart 审计。 |
| 前序 Step 2~4 粗稿 | 无。 | 全部删除,不得引用。 | 用户确认后按 SOP 重建。 |

---

## 6. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 1 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“历史材料处理结论”和“回填草稿”小节，了解本章结论如何从上游来源、上游边界参考和旧材料审计中收束而来。

`L4-sandbox` 的需求来源属于架构反推型 / 基础设施契约型。本文承接 `projects/README.md` 对 L4 基础设施层的项目划分，承接 `architecture/仓库拆分方案.md` 中“代码执行隔离 / 执行隔离”的仓级来源，承接 `architecture/标准对齐全景图.md` 对沙箱逃逸防御、ISO 25010 Security Resistance 和 ISO 42001 A.6 Operation 隔离的标准线索，并遵循 `standards/document/全局项目依赖关系与裁剪规则.md` 中 L4-sandbox 不拥有业务真相、运行期依赖 isolation backend、按需发布 sandbox 事件的依赖方向。

本文不是重新定义工具、runtime、member-service、identity、work、artifact、observability 或 governance。`L2-tools` 拥有工具定义、策略、调用请求、结构化结果和工具审计;`L2-runtime` 拥有运行主线、步骤推进、反馈、checkpoint / recover 和结果回流;`L2-member-service` 拥有成员宿主、会话、worker、health、SandboxBinding 装配结果和 callback material;`L1-identity` 拥有 GlobalMember / actor 身份真相;`L1-work` 拥有 Project、ProjectMember、WorkItem 和正式工作事实。`L4-sandbox` 后续需求只在这些来源之上收束运行隔离基础的仓级需求。

旧 `projects/L4-sandbox/README.md`、旧 `00/01/02/03/05/06` 和此前生成的 calibration 粗稿不作为当前需求基线。旧材料只作为 historical material 或 invalidated material,用于后续逐 Step 差异审计;不得直接继承旧功能编号、接口名、对象表、后端选择、性能阈值、测试证据或验收结论。
```

---

## 7. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只处理上游关系声明 | pass | 未写 Step 2 边界表、Step 7 能力节点或 Step 9 功能需求。 |
| 是否区分权威来源、主题输入、上游参考和历史材料 | pass | 见 §5.1~§5.4。 |
| 是否审计旧正式文档和粗稿冲突 | pass | 旧正式文档标为 historical_material;前序粗稿 Step 2~4 已删除。 |
| 是否避免把相邻仓 truth 写入 sandbox | pass | 上游边界参考表列明禁止反向拥有内容。 |
| 是否未伪造实现 commit、run_id、evidence 或验收签署 | pass | 当前没有创建任何实现/验收证据。 |
| 是否允许进入 Step 2 | pass_wait_review | 技术上 Step 1 已完成;按用户要求等待审查确认后再进入 Step 2。 |

next_allowed_action: `wait_user_confirm_step_2`
