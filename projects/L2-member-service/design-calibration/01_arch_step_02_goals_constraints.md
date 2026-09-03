# 01 架构校准 Step 2：明确架构目标与约束

> 状态：completed / pass
> 日期：2026-08-22
> 前序门禁：Step 1 completed / pass
> 本步目的：把稳定需求转译成架构必须确保成立的目标、不可变约束、阶段取舍和非目标

## 1. Step 内计划

- [x] 读取 flow、项目台账和 Step 1。
- [x] 从 RB-MS-001~008 逐项推导结构目标。
- [x] 区分不可变约束、当前可接受取舍和架构非目标。
- [x] 诊断旧 01 中目标、技术方案、指标和实施内容的混层。
- [x] 给出无伪量化时仍可审查的判断口径。
- [x] 形成正式 §2 / §3 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 本仓架构必须确保什么成立

1. 宿主控制面和宿主真相必须是独立且唯一的，不由业务域、容器内进程、Runtime 或承载后端代管。
2. 项目型执行主语、宿主意图、编排决定、宿主实例和世代之间必须形成连续可追溯关系。
3. 装配结果必须按来源分层，只有全部 required qualification 可验证时 host readiness 才可成立。
4. 注册、endpoint 和 host session 必须具有唯一活动关联，同时不取得 Member 主体 truth 或 Runtime run truth。
5. 健康、失败、恢复、终止、清理和对账必须保留宿主侧事实连续性，不能用外部副作用状态覆盖本地历史。
6. 所有 sibling 与基础设施必须通过正式边界接入，核心语义不能绑定其源码、产品模型或私有状态。
7. 正向合同缺失时，架构仍应能够给出明确 blocked / unknown / fail-closed 结论，而不是制造默认路径。

### 2.2 哪些约束不可变

- 当前主语范围、truth ownership、四语义层和 forbidden-body 边界不可变。
- 运行期 sibling 不得成为 package dependency，adapter / fake 不得取得 authority。
- 任何 required 前置缺失、陈旧、冲突或未知都不得通过 host fallback 绕过。
- 当前活动宿主、注册和 host session 不得因重复、并发、迟到或 unknown 分叉。
- local truth、attempt、gap 和外部完成状态不得混写。
- 未经正式需求重开，不得加入非项目型宿主或 policy 传递能力。

### 2.3 当前阶段可接受哪些取舍

| 取舍 | 当前接受原因 | 保护条件 |
|---|---|---|
| 正向 sibling 合同尚未闭口 | owner 与失败边界已经足够推导架构结构 | 受影响路径保持 blocked / waiting，不写字段、协议或 readiness。 |
| 容器、数据库、消息、RPC 产品未选 | 产品不应反向定义宿主 truth | 先固定 ports、责任层、数据和交互语义，产品后移。 |
| 部署拆分与容量数字未定 | 当前没有 workload、环境和 measurement authority | 只固定逻辑运行承载角色和判断口径，不写伪指标。 |
| 高级容量、预热、forensic 和聚合视图后移 | 不影响 C-MS-1~5 的 owner 与闭环 | 外围增强不得成为核心前置或写源。 |
| SDK 精确 target 后移 | 全局 compile 基线已知，但具体 target 未闭口 | 不让 SDK runtime client 或 server facade 进入 host truth。 |

### 2.4 哪些事项不是当前架构目标

- 不设计 Runtime 的 LLM loop、goal / plan、memory / checkpoint、tool / sub-agent orchestration 或 run recovery。
- 不设计 Member 容器内身份卡、presence、入站过滤、attention、交互和本地 IPC 实现。
- 不设计镜像内容、构建、签名、BOM、provenance evidence 或 Role -> image 映射。
- 不设计逐动作 Tool execution、Capability registry、外部 MCP / A2A / API truth。
- 不设计 Sandbox backend、policy、enforcement、capture、cleanup truth 或逐动作 caller。
- 不设计 Governance approval / policy truth、Identity / Work 等 L1 领域状态机。
- 不设计 Observability backend、Archive / Artifact 正文、外部 evidence / report / verdict。
- 不选定容器平台、数据库、消息系统、RPC、语言、框架、部署参数或性能数字。
- 不把非项目型宿主作为未来默认项；它需要正式重开需求。

### 2.5 目标如何被判断

当前不具备量化性能目标 authority，因此架构目标采用结构性可审查口径：owner 是否唯一、required qualification 是否显式、状态是否可区分、依赖类型是否正确、外部正文是否被排除、重复 / unknown 是否不分叉、外部失败是否不反写本地 truth。数值性能、容量和健康窗口必须等待 04~06 的正式来源与证据，不得反向补进本步。

## 3. 当前材料诊断

| 材料问题 | 诊断 | 处理 |
|---|---|---|
| 旧 01 把“高可用、低延迟、可扩展”当目标 | 没有 workload、判定口径或边界来源 | 删除空泛口号，改为可审查的 owner、失败和一致性目标。 |
| 旧 01 把 Rust / PostgreSQL / Kubernetes 当约束 | 实现选择冒充架构前提 | 全部后移，不进入目标与约束。 |
| 旧 01 把 API、部署和容量数字混入目标 | 章节职责混层且无 authority | 删除；接口、配置、测试和实施在后续文档独立收敛。 |
| draft 把 ports / adapter 与具体模块名称并列 | 架构责任层和概要模块混层 | 本步只保留边界机制，具体架构单元由 Step 5 收敛。 |
| policy 传递作为候选增强出现 | 无当前 FR，owner 未闭口 | 从目标与演进主线排除，只留风险 / 待确认。 |

## 4. 取舍推导

主取舍不是“选择哪个技术产品”，而是“先锁定独立 host truth 与边界机制，再允许具体承载演进”。该路径增加 typed ref、资格判断、adapter、状态分层、幂等、对账和 handoff gap 的结构成本，但换来 owner 可归责、failure 可解释和 sibling 可独立演进。任何试图通过共享数据库、直接源码依赖、后端资源状态或单一同步链减少结构成本的路径，都会破坏 Step 1 的硬约束。

## 5. 结构化中间产物

### 5.1 架构目标

| 目标 ID | 架构目标 | 成立判断 |
|---|---|---|
| `AG-MS-001` | 建立唯一宿主控制面与 host truth center | 宿主决定、实例、会话、健康和收束事实只有本仓可写。 |
| `AG-MS-002` | 保证项目型主语到宿主世代的可追溯连续性 | 每个决定和实例均能回指正式意图、ProjectMemberRef 与 GlobalMemberRef。 |
| `AG-MS-003` | 建立 owner-safe 装配与 fail-closed readiness | 分项来源、状态和缺口可区分；partial / unknown 不能成为 ready。 |
| `AG-MS-004` | 建立唯一注册、endpoint 与 host session 关联 | 同一宿主语境没有竞争活动关联，历史替换与失效可追溯。 |
| `AG-MS-005` | 建立分层健康与宿主侧恢复闭环 | host / session / backend / unknown 可区分，新实例不改写旧历史。 |
| `AG-MS-006` | 建立 local-first 清理、对账与事实交接 | 本地结论、外部尝试、gap 和外部完成状态不混写。 |
| `AG-MS-007` | 建立可替换的外部 seam 与单向依赖 | sibling、Bus、Sandbox 和后端只能经 runtime / event / ref / adapter 接入。 |
| `AG-MS-008` | 建立可审查、可演进且证据诚实的架构基线 | pending / fake / unknown 持续显式，后续产品与规模演进不改 owner。 |

### 5.2 不可变约束

| 约束 | 架构含义 |
|---|---|
| HC-MS-001 / 四语义层分离 | 内部语义结构、交互和数据表都必须能指出所属层。 |
| HC-MS-002 / 项目型双锚 | 非项目型意图在架构入口即 fail closed，不能以 GlobalMemberRef 代替执行主语。 |
| HC-MS-003 / owner separation | 本仓内部不得出现相邻仓正文模型或状态机。 |
| HC-MS-004 / fail closed | required seam 必须有资格和 unknown 状态，不能设计隐式 fallback。 |
| HC-MS-005 / forbidden body | 存储承载和 safe view 都不得吸收正文与 secret。 |
| HC-MS-006 / single-active + history | 活动关联唯一，替换以新事实和世代完成，不覆盖历史。 |
| HC-MS-007 / local-first | 外部传播和观测只影响 gap / summary，不改变本地结论。 |
| HC-MS-008 / dependency typing | compile 与 runtime / event / ref / adapter / fake 的后续落点不同。 |
| HC-MS-009 / no historical authority | 无当前来源的技术、协议、指标和拓扑不得进入正式 01。 |

### 5.3 当前阶段取舍

| 取舍结论 | 换来 | 付出 |
|---|---|---|
| 开放合同保持 placeholder 而不脑补 | 正确边界可先稳定 | 正向集成与 readiness 持续 blocked。 |
| 机制级架构而非产品级架构 | 后端与协议可替换 | 后续概要 / 详细仍需补合同和实现选择。 |
| 核心 truth 同步收口、外围传播延后 | 本地结论明确且不被外围拖垮 | 需要 gap、stale、reconciliation 和追溯语义。 |
| 外围增强后移 | C-MS-1~5 不被优化能力绑架 | 容量、预热和丰富视图当前不构成能力承诺。 |

### 5.4 架构非目标

| 非目标类别 | 明确排除 |
|---|---|
| 相邻领域 truth | Runtime、Member、Images、Tools、Capability、Sandbox、Governance、Observability、Identity、Work、Artifact / Archive。 |
| 外部系统 truth | 容器平台、registry、外部 MCP / A2A / API、credential / secret。 |
| 实现设计 | 对象字段、数据库表、API / event schema、代码目录、函数、重试算法、部署参数。 |
| 当前范围外 | 非项目型宿主、policy 传递、完整容量调度、warm pool、forensic backend、产品 UI。 |

## 6. 回填草稿

- 正式 §2 以 AG-MS-001~008 表达业务驱动力和架构必须成立的结果。
- 正式 §3 分为不可变约束、当前阶段取舍和架构非目标，不写产品、协议或数值。
- 正式 §11 / §12 后续只能选择服务这些目标与约束的机制和路径。
- 正式 §14 必须区分“当前可接受 deferred”与“永远不可接受的 owner / fail-open 债务”。

## 7. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 目标是否是结构结果而非功能重写 | pass | 目标聚焦 owner、边界、连续性、一致性与证据诚实。 |
| 不可变约束是否可直接约束后续架构 | pass | 每项均能限制上下文、依赖、数据或交互。 |
| 取舍是否说明得到与付出 | pass | 未闭合同、产品后移、local-first 和外围后移均有代价。 |
| 非目标是否覆盖所有易串线 owner | pass | Runtime / Member / Images / Sandbox / L1 / 基础设施等均明确排除。 |
| 是否提前定义容器、子域、协议或产品 | pass | 未形成 Step 5~10 的具体结论。 |
| 是否允许创建 Step 3 | pass | 目标与约束已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_03
formal_01_write_allowed = false
```
