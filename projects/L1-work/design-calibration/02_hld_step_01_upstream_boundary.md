# Step 1. 确认上游输入边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 1
> 回填章节: `02-概要设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

确认当前概要设计依赖的需求结论和架构结论已经收敛到足以支撑“代码主体框架、主要组成部分、对象骨架、接口骨架、关键处理流与状态机”展开的程度,并识别哪些上游边界会直接影响当前概要设计的范围与深度。

本步只确认概要设计可承接什么,不重新讨论需求目标、架构边界、代码主体框架、对象轮廓、接口骨架、处理流或状态机。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `00-需求文档.md` | 已按新版需求 SOP 重建 | 提供本仓定位、核心能力闭环、角色、功能需求、数据归属、接口依赖、非功能与验收边界 |
| `01-架构设计.md` | 已按新版架构 SOP 重建 | 提供系统边界、职责边界、限界上下文、容器 / 部署、依赖方向、数据所有权、通信方式、技术机制和演进约束 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_16_traceability_matrix.md` | 已完成 | 用于追溯需求结论来源 |
| `design-calibration/01_arch_step_01_requirement_baseline.md` ~ `01_arch_step_16_formal_document_assembly.md` | 已完成 | 用于追溯架构结论来源 |
| `projects/L0-core/00~07` | 已完成深度校准 | 共享 ID、ActorRef、TraceContext、metadata、error、evidence、配置和报告口径 |
| `projects/L0-bus/00~07` | 已完成深度校准 | 事件协作、订阅、投递、重放、死信、tap 与证据口径 |
| `projects/L0-sdk/00~07` | 已完成深度校准 | 默认 client / integration access 与 SDK consumer 边界 |
| `projects/L1-identity/00~07` | 已完成深度校准 | GlobalMember、actor、role、成员生命周期和 ProjectMember 引用来源 |
| `projects/L1-conversation/00~07` | 已完成深度校准 | conversation context、formalize / promote 来源、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00~07` | 已完成深度校准 | role、task、work product、process template、view profile 等定义来源 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为旧概要设计问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论？

当前概要设计要承接以下需求结论:

- `L1-work` 是项目工作事实真相仓,不是身份真相仓、对话真相仓、方法定义仓、流程执行引擎、治理决策仓、产物正文仓、运行时执行仓或 workspace 聚合视图仓。
- 核心能力闭环是:项目主语能够作为正式工作对象成立 -> 项目内成员承担关系能够成立 -> 正式工作全集能够被组织并区分执行步骤 -> 当前承诺子集能够从正式工作全集中成立 -> 项目工作事实能够被持续消费和追溯。
- 本仓拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、工作依赖 / 阻塞关系、Iteration、promote 结果与来源引用关系、工作事实审计 / 追溯记录。
- ProjectMember 是项目内承担事实,不接管 GlobalMember、actor、role 或成员生命周期。
- WorkItem / child WorkItem 是协作级正式工作,不等同于个人 checklist、PlanItem、tool step、runtime step 或 chat suggestion。
- ImplementationPlan、PlanItem、runtime step、conversation suggestion 只有通过显式 formalize / promote 边界后,才可成为 Work 正式结果或来源引用。
- 派生视图、看板、任务摘要、对账、维护报告和 workspace 聚合结果只能从 Work truth 派生,不得成为第二真相。
- Work 对外只保存相邻仓的引用、摘要、快照或派生投影,不吸收 identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability 或 archive 正文。

### 3.2 当前概要设计要承接哪些架构结论？

当前概要设计要承接以下架构结论:

- `L1-work` 的架构主线是一个独立的项目工作事实真相核心,而不是把 Project、WorkItem、Iteration 拆成多个独立 truth center。
- 内部语义结构包括:项目工作事实真相核心、项目主语上下文、项目成员承担上下文、正式工作全集上下文、工作拆分与升级边界上下文、工作依赖与阻塞上下文、Iteration 承诺子集上下文、项目工作事实消费与追溯上下文、派生消费辅助上下文、本地索引 / 投影 / 引用层。
- 正式运行承载包括 Work 同步入口、Work 异步输入消费、Work 后台维护与派生、Work 真相存储承载、派生视图 / 对账承载、事件协作 / 追溯交接边界。
- `L0-core` 是唯一编译期依赖;`L0-bus`、`L1-identity`、`L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L1-workspace`、`L0-sdk`、`L4-observability`、`L4-archive` 等通过运行期、引用、快照或事件协作边界处理。
- 核心 truth 写路径需要强一致成立、失败、拒绝或挂起;派生视图、外部快照、引用解析、变化传播、对账、观测和归档交接可最终一致。
- formalize / promote 是架构级边界机制,用于防止 conversation suggestion、ImplementationPlan step、runtime plan item 或 artifact 来源直接污染正式工作全集。
- 技术选择层已经明确不锁定 PostgreSQL、递归 CTE、物化视图、outbox、缓存、Graph-first、完整 ES / CQRS、P95 或容量数字。

### 3.3 哪些结论已经足够稳定,可以直接作为概要设计输入？

足够稳定、可以直接作为概要设计输入的结论包括:

- 仓定位、职责边界、非目标和边界红线。
- 核心能力闭环和核心 / 外围增强 / 边界外能力分层。
- 上下游关系和跨仓依赖裁剪。
- 项目工作事实真相核心、支撑上下文、本地索引 / 投影 / 引用层的语义结构。
- Work 同步入口、异步输入、后台维护、真相承载、派生承载和事件 / 追溯交接边界的运行承载角色。
- truth / snapshot / reference / derived read model 的数据归属口径。
- 同步 / 异步 / 后台承接的通信方式。
- formalize / promote 边界、外部引用不可解析、派生过期、待刷新、待重建、待交接等降级口径。
- 风险和待确认事项中对旧实现草案、旧性能数字、具体数据库 / 消息 / 缓存 / 调度产品、完整 ES / CQRS、Graph-first 的挂起口径。

### 3.4 哪些结论虽然相关,但仍未收稳,因此当前不能直接往下展开？

以下结论仍未收稳,当前不能作为已定概要设计输入直接展开:

- 正式 API、event、DTO、protocol 名称和字段。
- Project、ProjectMember、Backlog、WorkItem、child WorkItem、Dependency、Blocker、Iteration、promote result、trace record 的完整字段和函数签名。
- Project、WorkItem、child WorkItem、Iteration、dependency / blocker、formalize / promote 的详细状态集合和状态迁移规则。
- formalize / promote 的输入对象、拒绝原因、来源追溯、结果引用和幂等返回口径。
- 复杂依赖图、循环检测、自动解除阻塞、自动 spillover、跨项目依赖和容量规划的实现算法。
- 外部引用 / 快照生命周期、归档交接、观测回链、报告证据和 archive package schema。
- 完整 ES / CQRS、Graph-first、数据库产品、搜索产品、消息队列、缓存、调度、部署拓扑和配置项全集。
- 量化吞吐、延迟、项目数量、工作项数量、重建窗口和报表 SLA。

### 3.5 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里？

以下边界直接决定概要设计当前不该越界:

- 不重新定义需求目标、用户故事、验收标准和上游仓定位。
- 不重新定义系统上下文、子域划分、数据所有权原则、关键技术机制和方案取舍。
- 不展开完整 Rust 字段、完整函数实现、DDL、协议 schema、配置 JSON、部署参数或运维脚本。
- 不让 Identity、Conversation、Method Library、Process、Governance、Artifact、Runtime、Workspace、Observability 或 Archive 正文进入 Work truth。
- 不让 ImplementationPlan 正文、PlanItem 执行推进、runtime step 或 chat suggestion 直接成为正式 WorkItem。
- 不让派生视图、看板、任务摘要、对账、维护报告或 workspace 聚合结果反写真相。
- 不把配置设计、测试方案、验收标准和实施计划提前写进概要设计。

---

## 4. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 以“先用人话理解本仓”“背景与问题定义”“目标与非目标”开头 | 更像需求文档复述和新人解释,不是概要设计的代码主体骨架入口 | Step 1 只保留可承接上游关系,正式概要设计后续按新版 14 章主链重建 |
| 将 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、ImplementationPlan 作为教学叙事逐段展开 | 对象候选和业务解释混写,没有先从代码主体框架和组件边界收口 | 后续 Step 4~6 重新筛选代码主体、主要组成部分和关键对象 |
| 旧文档大量解释 promote、ImplementationPlan、planning timing 和 done 判定 | 这些线索有价值,但混在概要主线里会提前进入详细设计或相邻仓边界 | 后续 Step 7~10 分别判断接口、流程、状态和异常边界 |
| 旧文档包含旧模板、旧背景、旧 ADR 关联、读码导航和实现候选 | 与新版需求 / 架构校准来源不一致 | 后续正式概要设计只保留可追溯来源,不继承旧文档结构 |
| 旧文档缺少每章校准来源 | 不满足最新正式文档可追溯规则 | Step 14 正式文档重建时逐章补齐具体 `design-calibration` 来源 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 上游承接 | 主要承接旧 `01-架构设计.md`、旧 README 和旧领域草案线索 | 承接新版 `00-需求文档.md`、新版 `01-架构设计.md` 和对应中间产物 |
| 概要主线 | Project / Backlog / WorkItem / Iteration / ImplementationPlan 的解释性叙事 | 项目工作事实真相仓的代码主体框架、主要组成部分、关键对象、接口、处理流和状态机 |
| 上游边界 | 需求、架构、概要和实现候选混写 | Step 1 只确认可承接输入,Step 2 再收设计目标与范围 |
| 未收稳内容 | 容易被写成概要设计结论 | 先列为暂不进入范围,后续 Step 再逐项筛选 |
| 正式文档生成方式 | 在旧结构上补写 | Step 14 删除旧文件后按新文件标准重建 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `02-概要设计.md` 并局部替换术语 | 改动小 | 旧主线会持续把概要设计拉回需求解释、对象教学和实现候选混写 | 不采用 |
| 方案 B: 先确认上游输入边界,再逐 Step 重建概要设计 | 符合 SOP,能防止旧结构回流 | 需要逐步形成 14 个中间产物 | 采用 |
| 方案 C: 直接删除旧 `02-概要设计.md` 并一次性写新版全文 | 看起来推进快 | 跳过中间产物门禁,容易漏掉代码主体、对象、接口、状态机和详细设计承接 | 不采用 |
| 方案 D: 现在直接进入代码主体框架映射 | 快速下沉到实现结构 | 未先确认本次设计目标、范围和约束,容易越界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、核心能力闭环、角色、功能需求、数据归属、接口依赖、非功能与验收红线 | 转译为代码主体框架、主要组成部分、对象候选、接口骨架、处理流、状态机和详细设计承接清单 |
| `01-架构设计.md` | 职责边界、系统上下文、限界上下文、容器 / 部署、依赖方向、数据所有权、一致性、通信方式、技术机制、风险和演进 | 转译为可实现结构骨架,不重写架构判断 |
| `00_req_step_01` ~ `00_req_step_16` | 需求形成过程和每章校准来源 | 为正式概要设计提供可追溯需求入口 |
| `01_arch_step_01` ~ `01_arch_step_16` | 架构形成过程和每章校准来源 | 为正式概要设计提供可追溯架构入口 |
| `projects/L0-core/00~07` | 共享契约、actor、trace、metadata、error、evidence、配置和报告口径 | 后续对象 / 接口 / 流程中引用 L0 基础类型,不重新定义 |
| `projects/L0-bus/00~07` | 事件协作、订阅、投递、重放、死信、tap 和报告证据口径 | 后续事件 / 变化感知 / 追溯交接骨架中引用 bus 能力边界 |
| `projects/L0-sdk/00~07` | 默认 client / integration access 和 SDK consumer 边界 | 后续 API / 接口骨架中说明 SDK consumer 接入关系 |
| `projects/L1-identity/00~07` | GlobalMember、actor、role、成员生命周期和 ProjectMember 引用来源 | 后续对象和接口骨架中引用 actor / member 来源,不定义 identity truth |
| `projects/L1-conversation/00~07` | conversation context、formalize / promote 来源、trace / handoff 和授权查询来源 | 后续 promote / trace / 工作事实消费骨架中引用 conversation 来源边界 |
| `projects/L3-method-library/00~07` | role、task、work product、process template、view profile 等定义来源 | 后续对象、接口和派生视图中引用定义来源,不定义 method truth |
| 旧 `02-概要设计.md` | 旧对象、流程、状态和解释线索 | 仅作为问题诊断和候选线索,不作为正式概要主链 |

### 7.2 本文不再回答

- 不再回答 `L1-work` 是否是项目工作事实真相仓。
- 不再回答 Identity、Conversation、Method Library、Process、Governance、Artifact、Runtime、Workspace、Observability、Archive 是否拥有 Work truth。
- 不再回答系统上下文、职责边界、依赖方向、数据所有权和关键技术机制。
- 不再回答需求目标、用户故事、功能需求、非功能需求和验收红线。
- 不再回答具体数据库、搜索、队列、缓存、调度、完整 ES / CQRS、Graph-first 和量化容量指标。
- 不再回答 ImplementationPlan、PlanItem、runtime step、chat suggestion 是否可以绕过 formalize / promote 进入 Work truth。

### 7.3 本文必须回答

- `L1-work` 的代码主体框架如何从架构语义结构映射到可实现骨架。
- 主要组成部分有哪些,每个组成部分承担什么职责、不承担什么职责、包含哪些代码主体 / 模块候选。
- 从主要组成部分中能发现哪些对象候选,哪些对象会在第 6 章正式成立。
- 关键对象的对象类型、所属部分、主要责任、关键字段骨架、成员函数骨架、工厂函数骨架和禁止事项是什么。
- API / 接口骨架如何按 Command / Query / Event / Operations Job 或相邻边界分类。
- 关键处理流 / 重要函数数据流如何连接入口、application service、domain 对象、repository / port、event / projection / audit。
- 状态集合和状态流转如何表达 Project、ProjectMember、WorkItem、child WorkItem、dependency / blocker、Iteration、formalize / promote 和派生维护。
- 异常与边界场景如何覆盖成员不可承担、引用不可解析、来源不可接受、依赖循环、阻塞依据不足、Iteration 候选不合法、派生延迟、交接失败、重复请求和边界违规。
- 配置影响只识别哪些主要部分受配置影响、哪些边界禁止配置化、哪些配置细节交给详细设计。
- 详细设计需要继续展开哪些对象、接口、处理流、状态机、配置契约和测试切口。

### 7.4 暂不进入范围

| 暂不进入范围 | 原因 | 后续落点 |
|---|---|---|
| 完整 Rust struct / enum / value object 字段全集 | 属于详细设计实现契约 | `03-详细设计.md` |
| 完整函数签名、伪代码和调用链 | 概要设计只写骨架和关键参数类型 | `03-详细设计.md` |
| DTO / JSON / proto / CloudEvent schema | 属于详细设计接口契约 | `03-详细设计.md` |
| DDL、索引、事务、repository 函数 | 属于持久化详细设计 | `03-详细设计.md` |
| 配置 JSON 示例和配置项逐项说明 | 属于配置设计 / 详细设计配置契约 | `04-配置设计.md` / `03-详细设计.md` |
| 测试用例、验收门禁和实施 commit boundary | 属于测试、验收、实施计划 | `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md` |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §1 “与上游文档的关系声明”引用本文件 §7.1 的上游关系映射表,生成正式文档时从该节摘录。
- §2 “本次设计目标与范围”可承接本文件 §7.2、§7.3 和 §7.4,但需要在 Step 2 正式收口。
- §3 “约束条件”可承接本文件中识别出的边界和暂不进入范围,但需要在 Step 3 正式收口。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否沿用旧 `02-概要设计.md` 主线 | A. 沿用;B. 只作为诊断输入,正式文档重建;C. 在旧文档上局部替换 | B | 新版需求和架构已经重建,旧主线会造成需求解释、对象教学和实现候选混写 | 已确认采用 B |
| 是否在 Step 1 直接拆代码主体框架 | A. 是;B. 否,Step 1 只确认上游输入边界 | B | SOP 要求 Step 1 不提前展开代码主体、对象、接口和流程 | 已确认采用 B |
| Project / Backlog / WorkItem / Iteration 是否直接成为正式概要第一层结构 | A. 直接进入;B. 作为对象候选,后续 Step 重新筛选;C. 完全删除 | B | 它们是核心对象候选,但不能替代代码主体框架和组件边界 | 已确认采用 B |
| ImplementationPlan 是否作为 Work truth 主对象 | A. 是;B. 否,只承接 promote 结果和来源引用;C. 完全删除 | B | 需求和架构均已明确 Work 不拥有 ImplementationPlan 正文或执行推进 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 2 的待确认事项。具体本次概要设计目标、范围和设计深度将在 Step 2 独立收敛。

---

## 10. 进入下一步条件

- 已明确概要设计当前承接哪些需求结论。
- 已明确概要设计当前承接哪些架构结论。
- 已明确哪些上游结论稳定、哪些仍不能直接展开。
- 已明确本文不再回答什么、必须回答什么。
- 未提前展开代码主体框架、接口骨架、对象轮廓、处理流或状态机。
- 可以进入 Step 2“明确本仓设计目标与当前范围”。
