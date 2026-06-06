# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-06-06

---

## 1. 本步目标

从 `standards/document/全局项目依赖关系与裁剪规则.md` 裁剪 `L1-governance` 的依赖子图,明确本仓向哪些内部仓提供治理事实能力、依赖哪些内部仓的前置能力,以及每条关系属于编译期、运行期还是事件协作依赖。本步不写角色说明、用户故事、功能需求、接口签名、DTO、事件 schema、业务规则、数据归属或实现组织。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Governance 是治理决策与治理控制真相仓 |
| `design-calibration/00_req_step_05_users_roles.md` | Step 5 已完成 | 固定角色与相邻仓区分,避免把 process / work / runtime 等写成角色 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖基线 | 裁剪 `L1-governance` 自己的相关依赖边 |
| 旧 `projects/L1-governance/00-需求文档.md` §10 | 旧接口与依赖 | 提取 artifact、observability、runtime / capability-hub、conversation、work 等依赖线索,剔除接口动作和 SLA |
| 旧 `projects/L1-governance/01-架构设计.md` | 旧架构材料 | 提取 process、work、artifact、runtime、capability-hub、conversation、observability 等协作线索,不继承组件、端口或技术栈 |
| `architecture/仓库拆分方案.md` | 全局仓关系 | 确认 governance 处于 L1 六域服务层,并向 runtime、capability、workspace、archive 等仓提供治理事实或策略输入 |

---

## 3. SOP 问题回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L1-governance` 向相邻仓提供能力级治理事实,包括 Gate / Approval / Decision、Policy 生效与授权、Control 适用 / 复核、AIIA / SoA 治理结论和 Nonconformity 纠正闭环。它不提供相邻仓的正文、执行、UI 或审计存储真相。

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输出 | `L1-process` | Gate / decision 结论和治理暂停 / 恢复所需的裁决事实 | 否 | Process 只能保持等待或降级为未决治理引用,不得补造 governance decision truth |
| 输出 | `L1-work` | 项目生命周期、高风险工作变更和工作对象所需的治理约束与裁决结论 | 否 | Work 高风险路径无法稳定消费治理结论,但 Work truth 不归 governance |
| 输出 | `L1-artifact` | AIIA / SoA / Compliance 相关治理结论、批准状态和引用边界 | 否 | Artifact 正文仍成立,但治理双身份、批准和合规结论无法闭合 |
| 输出 | `L1-conversation` | 可显化的 Gate、Policy、review、decision 和治理追溯事实 | 否 | 对话中治理显化退化,但 conversation truth 不归 governance |
| 输出 | `L2-runtime` / `L2-member-service` | Policy 生效、autonomy 边界和治理授权结论 | 否 | 运行侧只能使用最后已知或缺失策略语境,不得自造 Policy truth |
| 输出 | `L3-capability-hub` | 能力使用约束、工具治理授权和 Policy 适用结论 | 否 | 能力白名单 / 工具策略只能降级为未解析治理约束 |
| 输出 | `L1-workspace` / `L5-console` | 治理事实的只读视图、管理入口和审计查看所需数据来源 | 否 | 聚合视图或后台管理退化,但不能反向定义 governance truth |
| 输出 | `L4-observability` / `L4-archive` | 治理追溯材料、审计材料、归档 / 恢复切片和合规证据线索 | 否 | 观测和归档完整性下降,但不改变 Governance 业务事实 |
| 输出 | `L0-sdk` | 面向产品、生态和外部调用方封装 governance 能力的访问边界 | 否 | 上层接入一致性下降,但治理事实闭环仍应成立 |

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 是 | 治理事实无法获得统一跨仓引用、actor、trace 和错误口径 |
| 输入 / 输出 | `L0-bus` | 跨仓事件协作主干 | 是 | Governance facts 无法稳定被相邻仓消费,也难以消费外部变化 |
| 输入 | `L1-identity` | actor / member / role 引用和成员生命周期边界 | 是 | Gate decision maker、Policy scope、审计 actor 和自动化 actor 引用无法闭合 |
| 输入 | `L1-process` | waiting gate / Activity / process context 等过程语境引用 | Gate 场景是;基础 Policy / Control 否 | 过程触发的 Gate 语境无法稳定回链 |
| 输入 | `L1-work` | Project、ProjectMember、WorkItem、Iteration 等治理对象和风险语境引用 | Work 场景是;基础治理事实否 | 项目和工作对象相关治理结论只能保持缺失引用 |
| 输入 | `L1-artifact` | Artifact、evidence、baseline、AIIA / SoA 正文和版本归属边界 | AIIA / SoA / evidence 场景是 | 治理结论缺少正文 / 证据引用,但 Governance 不补造 artifact body |
| 输入 | `L3-method-library` | AIPolicyDef、method、role、process template 和控制 / 策略定义来源 | Policy / Control 定义场景是 | 策略和控制定义来源无法稳定解析 |
| 输入 | `L1-conversation` | 治理显化和 review / decision context 的对话引用边界 | 否 | 显化回链退化,但 Governance 裁决事实仍应独立成立 |
| 输入 | `L2-runtime` / `L3-capability-hub` | Policy 适用反馈、能力使用结果和违规信号的受控输入 | 否 | 自动化触发和策略反馈场景降级,不得写成运行时执行 truth |
| 输入 | `L4-observability` | audit / metric / alert 等观测材料引用或报告线索 | 否 | 观测触发的 Nonconformity 或复核线索降级,不阻塞基础 governance truth |

### 3.3 这些关系在全局依赖基线中分别是什么边？

全局依赖基线直接给出:

- `L1-governance` 编译期依赖 `L0-core`。
- `L1-governance` 按需运行期消费 process / artifact evidence boundary。
- `L1-governance` 通过 `L0-bus` 发布 Gate / Policy 事件。

结合其他仓的全局行,还可裁剪出 runtime / member-service / capability-hub / workspace / console / archive / sdk 对 Governance 的消费关系,以及 identity / method-library 等作为引用和定义来源的运行期协作关系。本步只裁剪与 `L1-governance` 直接相关的边,不复制全 27 仓矩阵。

### 3.4 哪些依赖是闭环前置？

闭环前置分为基础前置和场景前置。

| 层级 | 前置依赖 | 说明 |
|---|---|---|
| 基础治理事实闭环 | `L0-core`、`L0-bus`、`L1-identity` | 没有共享契约、事件协作和 actor / member / role 引用,Gate / Policy / Control / Nonconformity 等治理事实无法跨仓稳定表达 |
| Gate 场景前置 | `L1-process`、`L1-work`、`L1-artifact` 按触发对象不同进入 | 治理裁决经常来自过程、工作或产物语境,但 Governance 不拥有这些来源 truth |
| Policy / Control 定义前置 | `L3-method-library` | AIPolicyDef、方法角色和定义来源若缺失,Policy / Control 定义解析和版本对齐会降级 |
| 合规正文 / 证据前置 | `L1-artifact` | AIIA / SoA / evidence 正文归 artifact,治理只保存结论和引用 |

`L1-conversation`、`L1-workspace`、`L5-console`、`L2-runtime`、`L3-capability-hub`、`L4-observability`、`L4-archive`、`L0-sdk` 是重要消费方或协作方,但不阻塞 Governance 基础治理事实闭环成立。

### 3.5 哪些依赖失效时会影响当前阶段能力？

`L0-core` 失效会导致治理事实缺少统一 ID、actor、trace、error 和 evidence 口径,直接阻塞当前需求主线。`L0-bus` 失效会导致治理事实无法进入平台事件协作。`L1-identity` 失效会导致决策人、actor、role 和 scope 引用无法闭合。`L1-process`、`L1-work` 或 `L1-artifact` 失效时,对应来源语境只能表现为缺失引用或待解析引用,Governance 不补造相邻仓 truth。`L3-method-library` 失效时,Policy / Control 定义来源和方法角色语境降级。runtime、capability-hub、workspace、console、observability、archive 或 SDK 失效时,消费、执行、显化、观测或归档能力退化,但不能反向改变 Governance 的真相边界。

### 3.6 是否存在需要纳入当前阶段主线的正式外部系统依赖？

当前阶段无需要纳入需求主链的正式外部系统依赖。旧文档中的数据库、Policy DSL 引擎、外部 GRC 套件、审计系统或合规工具都属于后续架构、详细设计、配置设计、非功能或集成阶段的候选输入,不在需求 Step 6 定稿。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §4 | 把各域服务、runtime / capability-hub 写成目标用户 | 使用方与角色混写 | Step 5 已改为角色;本步作为依赖和消费方处理 |
| 旧 `00-需求文档.md` §6 | 功能清单中直接写 Gate 扇出、Policy 下发、artifact 双身份 | 功能、依赖和事件协作混写 | Step 6 只写能力级依赖,功能后移 Step 9 |
| 旧 `00-需求文档.md` §10 | 把 artifact、observability、capability-hub / runtime、conversation、work 和依赖 SLA 写在接口与依赖中 | 依赖、接口、SLA 和实现语义混在一起 | 本步按编译期 / 运行期 / 事件协作裁剪,SLA 后移非功能 |
| 旧 `01-架构设计.md` | 写 policy-distributor、subscriptions、ArtifactSync 等组件 | 组件和适配器属于架构 / 详细设计 | Step 6 只保留仓际能力关系 |
| `domain/governance/README.md` | 大量事件名、RPC、数据库、状态机和订阅表 | 层级过深 | 只提取依赖线索,不继承接口和事件名 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧依赖表 | 保留旧线索,迁移快 | 混合角色、接口、事件、SLA 和实现组件 | 不采用 |
| 方案 B: 按全局依赖规则裁剪 `L1-governance` 子图 | 依赖类型清楚,能防止错误 package dependency | 需要后续 Step 12 再展开接口与事件契约 | 采用 |
| 方案 C: 只写 `L0-core` / `L0-bus` / `L1-identity` 三个强前置 | 文档短 | 无法解释 Gate、Policy、AIIA、SoA、Nonconformity 与相邻仓协作价值 | 不采用 |
| 方案 D: 把所有协作方都写成基础闭环强前置 | 强调治理中枢价值 | 会夸大阻塞关系,让基础治理事实闭环过重 | 不采用 |

### 5.1 待确认问题的方案选择

#### 是否把 runtime / capability-hub 写成 Governance 的运行期上游？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成运行期上游强依赖 | 会误导为 Governance 依赖 runtime 才能形成 Policy truth |
| 方案 B | 写成 Policy 消费方和违规 / 反馈协作方 | 保留协作关系,不让执行 truth 反向定义治理事实 |

推荐方案 B。原因是 runtime / capability-hub 消费 Policy 和 autonomy 约束,也可提供反馈线索,但 Policy truth 属于 Governance。

#### 是否把 artifact 写成基础闭环前置？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 是,所有 Governance 都依赖 artifact | 过重,Gate / Policy / Control 可先成立 |
| 方案 B | 仅 AIIA / SoA / evidence 场景依赖 artifact | 更符合 truth 边界 |

推荐方案 B。原因是 artifact 拥有正文和 evidence body,Governance 拥有治理结论和引用。

#### 是否允许 Governance 编译期依赖 process / work / artifact / method-library？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 允许 | 会破坏 L1 平权真相域,形成循环依赖风险 |
| 方案 B | 禁止,只允许 `L0-core` 编译期依赖 | 保持跨仓边界清楚 |

推荐方案 B。原因是全局基线已明确 L1 域服务通过 shared contracts、运行期边界和事件协作保持解耦。

---

## 6. 结构化中间产物

### 6.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 是 | 治理事实无法获得统一跨仓引用、actor、trace 和错误口径 |
| 输入 / 输出 | `L0-bus` | 跨仓事件协作主干 | 是 | Governance facts 无法稳定被相邻仓消费,也难以消费外部变化 |
| 输入 | `L1-identity` | actor / member / role 引用和成员生命周期边界 | 是 | Gate decision maker、Policy scope、审计 actor 和自动化 actor 引用无法闭合 |
| 输入 / 输出 | `L1-process` | 过程语境引用;消费治理裁决结论 | Gate 场景是 | 过程触发的 Gate 语境和恢复裁决消费能力降级 |
| 输入 / 输出 | `L1-work` | 项目 / 工作对象治理语境;消费 Policy / Gate 结论 | Work 场景是 | 项目和工作对象治理结论缺少稳定来源或消费方 |
| 输入 / 输出 | `L1-artifact` | artifact / evidence / AIIA / SoA 正文归属边界;消费治理批准结论 | AIIA / SoA / evidence 场景是 | 治理结论缺少正文 / evidence 引用,或 artifact 双身份消费退化 |
| 输入 | `L3-method-library` | AIPolicyDef、method、role、process template 和控制 / 策略定义来源 | Policy / Control 定义场景是 | 策略和控制定义来源无法稳定解析 |
| 输出 | `L1-conversation` | 治理事实显化、review / decision context 和追溯引用 | 否 | 对话显化退化,但 Governance 裁决事实仍应独立成立 |
| 输出 / 协作 | `L2-runtime` / `L2-member-service` | Policy 生效、autonomy 边界和治理授权结论;运行反馈线索 | 否 | 执行侧策略消费和反馈降级,不得自造 Policy truth |
| 输出 / 协作 | `L3-capability-hub` | 能力使用约束、工具治理授权和 Policy 适用结论 | 否 | 能力策略消费降级,不得反向拥有 Policy truth |
| 输出 | `L1-workspace` / `L5-console` | 治理事实只读视图、管理入口和审计查看来源 | 否 | 聚合视图或后台管理退化 |
| 输出 | `L4-observability` / `L4-archive` | 治理追溯材料、审计材料、归档 / 恢复切片和合规证据线索 | 否 | 观测和归档完整性下降 |
| 输出 | `L0-sdk` | 面向产品、生态和外部调用方封装 governance 能力 | 否 | 上层接入一致性下降 |

### 6.2 外部系统依赖

当前阶段,`L1-governance` 无需要纳入需求主链的正式外部系统依赖。Policy DSL 引擎、外部 GRC 套件、法律咨询系统、标准原文库、数据库、搜索、审计平台或告警系统都不能在本步定为需求前置。它们后续如需进入主链,必须在架构、详细设计、配置设计、非功能或验收阶段重新裁剪。

### 6.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-governance` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约是治理事实跨仓表达基础 |
| `L0-bus` | `L1-governance` 通过 `L0-bus` 发布 Gate / Policy 事件 | 协作方 | 事件协作 | 是 | 治理事实需要跨仓发布 / 消费能力级变化 |
| `L0-sdk` | `L0-sdk` 封装 L1+ 能力边界 | 被依赖方 | 运行期 | 是 | 上层产品、生态和外部调用方默认经 SDK 消费 Governance 能力 |
| `L1-identity` | identity 提供成员、actor 和角色来源 | 依赖方 | 运行期 | 是 | decision maker、actor、role 和 policy scope 需要身份边界 |
| `L1-process` | 全局基线中 governance 按需消费 process 边界;process 消费 governance decision | 协作方 | 运行期 / 事件协作 | 是 | Gate 与 waiting / resume 语境协作,但 process truth 不归 Governance |
| `L1-work` | Work 消费 governance 能力边界;Governance 引用工作对象语境 | 协作方 | 运行期 / 事件协作 | 是 | 项目和工作高风险变更需要治理约束,Work truth 不归 Governance |
| `L1-artifact` | 全局基线中 governance 按需消费 artifact evidence boundary;artifact 按需消费 governance 引用 | 协作方 | 运行期 / 事件协作 | 是 | AIIA / SoA / evidence 正文归 artifact,治理结论归 Governance |
| `L1-conversation` | conversation 按需消费 governance 能力边界 | 被依赖方 | 运行期 / 事件协作 | 是 | Gate / Policy / review 等治理事实需要显化和追溯 |
| `L3-method-library` | method-library 提供 method / role / AIPolicyDef 等定义来源 | 依赖方 | 运行期 | 是 | Policy / Control 定义来源和角色语境需要稳定引用 |
| `L2-runtime` | runtime 消费 L1/L3 能力并使用 Policy cache | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | runtime 消费 Policy / autonomy 约束,但执行 truth 不归 Governance |
| `L2-member-service` | member-service 订阅身份、项目成员和 policy 事件 | 被依赖方 | 事件协作 | 是 | 成员容器编排需要 Policy / governance 变化输入 |
| `L3-capability-hub` | capability-hub 管理能力注册与治理 | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | 能力使用约束和工具治理授权需要 Governance Policy |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 / 事件协作 | 是 | 治理视图和聚合工作台需要 Governance facts |
| `L4-observability` | 横切观测消费 audit / metrics material | 被依赖方 / 协作方 | 事件协作 / 追溯交接 | 是 | Governance facts 需要被审计和观测消费,但审计存储不归 Governance |
| `L4-archive` | archive 消费 L1 snapshot / export 和合规归档材料 | 被依赖方 | 运行期 / 事件协作 | 是 | Governance facts 需要进入归档 / 恢复和合规包 |
| `L5-console` | console 经 SDK 消费 L1/L2/L3/L4 管理 API | 被依赖方 | 运行期 | 是 | 治理管理入口需要消费 Governance 能力,但 UI 状态不归 Governance |
| `L5-chat` | chat 经 SDK 消费 conversation / workspace / governance | 被依赖方 | 运行期 | 否 | Chat 是产品入口;当前治理需求主链以 conversation / console 显化为主,不直接依赖 Chat |
| `L6-bridges` | bridges 经 SDK / public API 接入内部能力 | 被依赖方 | 运行期 | 否 | 外部平台接入不是 Governance 基础闭环前置 |
| 外部 GRC / 法律系统 | 旧文档候选外部能力 | 非正式外部依赖 | 运行期 | 否 | 超出当前需求主链,不得替代 Governance truth |

### 6.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、actor、trace、error、CloudEvents、metadata、配置和 evidence 契约 | 详细设计 / 实施计划 |
| 事件协作依赖 | `L0-bus` | 发布 / 消费治理事实变化,不在本步表达事件字段 | 架构设计 / 测试方案 |
| 运行期依赖 | `L1-identity`、`L1-process`、`L1-work`、`L1-artifact`、`L3-method-library` | 消费 actor / member / role、过程、工作、产物 / evidence、方法 / AIPolicyDef 等引用或定义边界 | 架构设计 / 详细设计 |
| 运行期输出 | `L0-sdk`、`L1-conversation`、`L1-workspace`、`L5-console` | 向上层或相邻仓提供 Governance 能力访问、显化和只读消费来源 | 用户故事 / 接口与依赖 / 架构设计 |
| 事件协作 / 运行期输出 | `L2-runtime`、`L2-member-service`、`L3-capability-hub` | 提供 Policy、autonomy、capability governance 和反馈协作边界 | 核心能力闭环 / 功能需求 / 架构设计 |
| 追溯 / 归档协作 | `L4-observability`、`L4-archive` | 提供治理事实、审计材料、归档切片和合规包线索 | 非功能 / 测试方案 / 验收标准 |

### 6.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-governance -> L1-process` 编译期依赖 | 会把 process waiting state 和 Governance decision truth 耦合 | 使用共享引用、运行期边界或事件协作 |
| `L1-governance -> L1-work` 编译期依赖 | 会把 Project / WorkItem truth 引入治理仓 | 使用项目 / 工作对象引用、safe summary 或事件协作 |
| `L1-governance -> L1-artifact` 编译期依赖 | 会把 artifact body / evidence body / version truth 引入治理仓 | 使用 artifact / evidence 引用和运行期 / 事件协作 |
| `L1-governance -> L1-conversation` 编译期依赖 | 会让显化和对话可见性反向定义治理事实 | Conversation 运行期 / 事件协作消费 governance facts |
| `L1-governance -> L1-identity` 编译期依赖 | 会把成员生命周期真相耦合进治理仓 | 使用 `L0-core` 共享 actor / member / role ref 和运行期边界 |
| `L1-governance -> L3-method-library` 编译期依赖 | 会把方法定义和 AIPolicyDef source truth 并入治理仓 | 通过定义引用、snapshot 或运行期边界消费 |
| `L1-governance -> L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层,并把执行 truth 混入治理 truth | runtime / member-service 消费 Governance Policy,必要反馈经正式边界输入 |
| `L1-governance -> L3-capability-hub` 编译期依赖 | 会把能力注册和工具适配真相混入 Policy truth | 使用能力引用、Policy 适用结论和正式协作边界 |
| `L1-governance -> L4-observability` 编译期依赖 | 会把审计存储和指标真相混入治理事实 | 通过审计材料、trace / report ref 和事件协作 |
| `L5/L6` 产品或外部平台直接绑定 `L1-governance` 源码 | 会绕过 SDK / public API 和仓际边界 | 经 `L0-sdk` 或正式 service boundary 消费 |

### 6.6 依赖裁剪图

#### 依赖裁剪图: L1-governance

```text
+-----------+  [compile]  +----------------+
| L0-core   +----------->| L1-governance  |
+-----------+            | governance     |
                         | truth          |
                         +-------+--------+
                                 ^
                                 | [event]
                              +--+----+
                              |L0-bus |
                              +--+----+

L1-identity / L1-process / L1-work / L1-artifact / L3-method-library
        | [runtime: refs, safe summaries, definitions, evidence boundaries]
        v
+----------------+
| L1-governance  |
+-------+--------+
        |
        | [runtime/event: governance facts, policy, decisions, traceability]
        v
L1-conversation / L1-workspace / L2-runtime / L2-member-service
L3-capability-hub / L4-observability / L4-archive / L0-sdk / L5-console
```

图示说明:

- 本图只展示 `L1-governance` 相关依赖边,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可在后续实施中进入 package dependency。
- `[runtime]` 和 `[event]` 不得被误写成 Cargo path dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序、事件名或 payload。

### 6.7 本章结论

`L1-governance` 当前阶段的依赖主线是:以 `L0-core` 作为唯一编译期共享契约基线,以 `L0-bus` 作为事件协作主干,以 `L1-identity` 作为 actor / member / role 引用前置,并按场景消费 process、work、artifact 和 method-library 的引用、摘要或定义边界。Governance 向 conversation、workspace、runtime、member-service、capability-hub、observability、archive、SDK 和 console 提供治理事实、Policy、decision、traceability 或只读消费来源,但这些消费方不能反向定义 Governance truth。

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §6。若正式文档篇幅需要压缩,可摘录本文件 §6 的表格,不重复扩写全部分析。

```md
## 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“本仓依赖裁剪表”“本仓依赖类型分类表”“本仓禁止依赖表”和“依赖裁剪图”小节,了解本章如何从全局依赖基线裁剪出 `L1-governance` 的依赖子图。

当前阶段,`L1-governance` 的唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作主干;`L1-identity` 是 actor / member / role 引用强前置。process、work、artifact 和 method-library 按场景提供运行期引用、safe summary、definition 或 evidence boundary。conversation、workspace、runtime、member-service、capability-hub、observability、archive、SDK 和 console 是治理事实、Policy、decision、traceability 或只读视图的消费方 / 协作方。

当前阶段无需要纳入需求主链的正式外部系统依赖。Policy DSL 引擎、外部 GRC 套件、法律咨询系统、标准原文库、数据库、搜索、审计平台或告警系统都不在本章定稿。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | runtime / capability-hub 是否作为运行期强上游 | 写成强上游 | 写成 Policy 消费方和反馈协作方 | 推荐 B。原因是执行 truth 不应反向定义 Policy truth |
| Q-002 | artifact 是否作为基础闭环强前置 | 所有治理能力都依赖 artifact | 仅 AIIA / SoA / evidence 场景依赖 artifact | 推荐 B。原因是 artifact 拥有正文,governance 拥有结论 |
| Q-003 | 是否允许 Governance 编译期依赖 L1/L2/L3/L4 仓 | 允许 | 禁止,只允许 `L0-core` 编译期依赖 | 推荐 B。原因是运行期和事件协作关系不能写成 package dependency |
| Q-004 | 是否纳入外部 GRC / 法律系统 | 当前纳入 | 后续如有产品需求再裁剪 | 推荐 B。原因是当前阶段 Governance 不是外部 GRC 套件 |

当前建议:接受上述推荐后进入 Step 7。

---

## 9. 进入下一步条件

- 已明确 `L1-governance` 的输入依赖、输出能力和闭环前置关系。
- 已从全局依赖基线裁剪出 `L1-governance` 的相关依赖边。
- 已区分编译期、运行期和事件协作依赖。
- 已明确禁止把相邻 L1 / L2 / L3 / L4 仓写成 Cargo path dependency。
- 已说明当前阶段无正式外部系统依赖。
- 未把角色说明、接口名、事件名、用户故事、核心闭环步骤、业务规则、数据归属或实现组织混写进本章。
