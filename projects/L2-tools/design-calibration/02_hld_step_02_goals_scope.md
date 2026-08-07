# L2-tools 02 概要 Step 2: 明确本仓设计目标与当前范围

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 仅依据 Step 1 已确认的当前正式 00/01 和相邻 owner 边界，收敛概要层结构目标、非范围与设计深度；不拆对象、接口或实现。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 明确本仓设计目标与当前范围 |
| 输出文件 | `design-calibration/02_hld_step_02_goals_scope.md` |
| 已读取项目级台账 / flow | yes |
| 已读取前序 Step | yes: `02_hld_step_01_upstream_boundary.md` |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 2；概要书写规范 §2 / §4.2 |
| 已读取正式输入 | yes: 当前正式 00/01 的目标、非目标、核心单元、数据 / 接口 / 风险边界 |
| 旧材料处理 | 旧 02 只作后置范围污染审计 |
| 进入条件 | pass |
| next_allowed_action | Step 2 完成后进入 Step 3，不修改正式 02。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 前序结论复核 | done | Step 1 稳定输入 / blocked seam 摘要 | pass | 进入目标思考。 |
| 设计目标：先思考 | done | 结构目标判定 | pass | 写入设计目标表。 |
| 设计目标：再写入 | done | 设计目标表 | pass | 进入非范围思考。 |
| 非范围：先思考 | done | 上游 / 下游 / 相邻 owner 分类 | pass | 写入非范围表。 |
| 非范围：再写入 | done | 非范围表 | pass | 进入深度思考。 |
| 设计深度：先思考 | done | 概要与详细设计分界 | pass | 写入深度口径。 |
| 设计深度：再写入 | done | 当前阶段设计深度 | pass | 进入历史差异审计。 |
| historical material 差异审计 | done | 旧范围污染表 | pass | 形成回填草稿。 |
| 自检与停审 | done | Step 2 门禁 | pass | 进入 Step 3。 |

## 2. 本步输入

| 输入 | 已收稳内容 | 本步使用方式 |
|---|---|---|
| Step 1 | 当前正式 00/01 是唯一直接基线；九项 blocker 只限制正向合同深度；旧 02 不可继承。 | 目标和范围不得超出 `本文必须回答`，也不得靠 blocker 猜测扩大。 |
| 正式 00 §4 / §7 / §9~§15 | 五节点闭环、17 项核心能力、6 项外围能力、规则、数据、接口、NFR 和风险。 | 确认结构覆盖面，不把 FR 逐项复制为设计目标。 |
| 正式 01 §3~§10 / §13~§15 | `A/S/P`、`R/T/D`、依赖、数据、交互和开放 seam。 | 确认概要需要转译的架构主语，不重新做架构方案比较。 |
| 概要 SOP / 规范 Step 2 | 只回答“收什么、不收什么、停在哪里”。 | 目标写结构轮廓；非范围写归属；不提前产生代码主体答案。 |
| 旧正式 02 | 需求 / 架构重述、policy truth、executor、固定接口 / 指标 / 上线策略。 | 只识别范围污染和越层风险。 |

## 3. SOP 问题回答

### 3.1 本次概要设计最主要要把哪些结构讲清

- 把 `A1~A5/S1~S3/P1~P6` 和 `R1~R3/T1/T2/D1` 转译为可被详细设计继续展开的代码主体框架，而不是简单复制架构单元名或旧目录。
- 形成稳定的主要组成部分，确保 identity / definition / evolution、Binding、invocation / admission、precondition / handoff、outcome / audit / safe handoff、reference / derived consumption 都有独立且不串权的承载位置。
- 从每个组成部分的 capability 和数据 owner 发现关键对象，使对象能够承接本地 truth、外部 typed ref / snapshot、状态、审计和缺口，同时阻止 forbidden body 入仓。
- 按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 blocked boundary port 收稳接口主语，让 Runtime、Hub、authorization、Sandbox、Bus / Observability 和 future SDK 不再各自发明工具语义。
- 用关键处理流和状态族说明正式变化怎样经过入口、application service、domain object、port / truth store / derived store，怎样形成拒绝、等待、终态、gap 和 degradation，而不画成跨 owner 伪事务。
- 明确异常、配置影响、开放 blocker 与详细设计承接，使 03 可以继续写字段、函数、DTO、port、事务和错误契约，而无需重新发明主要结构。

### 3.2 设计应停在什么深度才足以支撑详细设计

本轮应停在“可实现代码主体骨架”深度：

- 可以正式点名主要代码主体、关键对象、Command / Query / Consumer / Event / Job / Port、处理流和状态名。
- 关键对象必须有独立轮廓、概要级字段类型、状态、成员函数 / 工厂函数骨架和禁止事项；函数参数必须使用 `TypeName param_name`。
- 接口必须说明输入 / 输出对象骨架、读写性质、处理责任和边界；处理流必须能回到接口、对象与状态。
- 可以说明 domain、application、inbound / operations、port、persistence / projection / event collaboration 的关系，但不指定目录、语言框架或完整 trait。
- 不写完整 schema、完整字段全集、完整函数签名 / 返回类型、实现代码、DDL、SQL、协议 path、topic、retry 参数、配置 key 或部署脚本。
- 对开放上游合同只定义 L2 自有 boundary port、typed ref、消费判断、blocked / gap 语义和 03 承接，不写对方未提供的正向 schema。

### 3.3 哪些内容属于本次概要设计范围

| 范围面 | 本轮必须覆盖 | 完成判据 |
|---|---|---|
| 代码主体框架 | 架构单元、运行角色与存储角色到实现分层的映射。 | 每个架构主语有代码主体承接，且业务组成部分不与实现层混称。 |
| 主要组成部分 | 核心合同、Binding、调用、前置交接、outcome / audit、维护 / 派生的职责与接缝。 | Step 5~9 可按同一组成部分顺序完成小循环。 |
| 关键对象 | Truth、relation、invocation、assessment、handoff、outcome、audit、typed ref、gap、projection。 | 每个对象回指 capability，无孤儿 / 组合大对象 / 外部正文对象。 |
| 接口骨架 | 正式写、只读、外部变化消费、已提交事实传播、维护任务和开放 port。 | 读写边界与 owner 明确，未闭口 seam 标为 blocked。 |
| 处理流 | 合同建立 / 演进、Binding、invocation、前置、handoff、source consumption、outcome、safe material、维护。 | P0 与改写本地状态的外部输入均有独立流。 |
| 状态机 | 合同、Binding、admission、precondition、handoff attempt、outcome、reference / derived 状态。 | 状态归属、触发入口、允许 / 禁止迁移和传播完整。 |
| 异常 / 配置 | 会改变主线理解的 failure / boundary 与配置影响 / 禁止配置化边界。 | 不写错误码大全或配置项清单，仍能指导 03/04。 |
| 详细设计承接 | 对象、接口、流程、状态、port、存储、配置、测试切口和 blocked boundary。 | 03 不需重新定义概要主语；变更主语必须回退 02。 |

### 3.4 哪些相关内容当前不进入概要设计范围

1. 上游文档职责：需求目标、用户故事、功能 / 规则 / 验收重写；系统上下文、子域、部署、依赖、技术机制和方案取舍重写。
2. 详细设计职责：完整 domain / application / port / adapter 类型、DTO / event schema、字段全集、完整函数签名、repository、事务、幂等、错误码、算法、DDL / 索引。
3. 配置设计职责：配置 key、默认值、格式样例、环境变量、secret 名、加载 / 合并 / 热更新和部署挂载。
4. 测试 / 验收 / 实施职责：测试矩阵、运行命令、证据路径、通过结果、验收签署、commit boundary、排期、灰度、回滚、上线和 runbook。
5. 相邻 owner 职责：Runtime orchestration / recovery；Hub registry / exposure；authorization decision；Sandbox execution lifecycle；Bus delivery；Observability store；SDK client；external registry / provider control。
6. 产品 / 库存职责：具体 builtin、MCP / A2A / API 工具实现、marketplace listing、Role extras、member-images、provider billing 和工具健康平台。
7. 未闭口正向事实：authorization taxonomy / schema、Sandbox mapping / receipt / cleanup、Observability route、Core Tools-specific package、SDK client、量化指标和 readiness。

### 3.5 哪些内容应留给详细设计而不应在本章提前展开

- 每个关键对象的完整字段、值对象内部结构、不变量实现、序列化和存储映射。
- Command / Query / Event / Job 的完整 DTO、错误返回、actor / metadata / idempotency 细节和协议承载。
- Application service、domain method、repository / port / adapter 的完整签名、事务边界和并发 / 重放策略。
- Canonical invocation 到真实 carrier 的映射、Sandbox source 到 outcome 的具体转换、authorization / event route 的具体 contract；若上游仍未闭口则保持 blocked boundary。
- 配置实现契约、测试切口与真实 evidence、验收判据以及 implementation ledger / boundary skeleton。

## 4. 当前文档问题诊断

| 旧 02 倾向 | 问题 | 本轮范围处理 |
|---|---|---|
| 以“新人理解”、背景、目标和全局位置为主要篇幅 | 退回需求 / 架构摘要，未提供代码主体骨架。 | 正式 02 仅用 §1~3 承接边界，§4 起进入可实现结构。 |
| 把 `ToolPolicy / ToolScope`、governed 分类列为本仓核心 | 将 execution requirement 与 effective authorization 混同。 | 只把 L2 自有 requirement / consumer assessment 纳入；decision truth 排除。 |
| 把 Tool Registry / inventory / builtin / MCP / member-service 当概要范围 | 混入产品库存、external registry、client / host 实现。 | 明确为相邻或边界外职责。 |
| 把 `InvokeTool`、executor、host callback 作为主线 | L2 会接管 Runtime / Sandbox 执行。 | 范围止于 canonical semantics、conditional handoff、source consumption 和 outcome。 |
| 固定 retry taxonomy、SLA、事件、接口、函数链 | 未经当前上游推导且越入 03/05。 | 02 仅设计骨架；具体 taxonomy / schema / 数值后移。 |
| 上线策略、灰度、回滚、监控指标作为概要章节 | 越入 07 / 运维且伪造 readiness。 | 全部排除，Step 13 只保留设计风险。 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 概要目标 | 解释工具仓与列举能力 / 技术方案 | 建立足以进入 03 的代码主体、对象、接口、流和状态骨架 |
| 核心范围 | definition / request / local policy / executor / result / audit 混线 | 五节点核心 + 演进 / 维护 / 受控影子，严格保持外部 owner |
| 设计深度 | 需求、架构、函数链、指标、上线混写 | 可命名代码主语与概要类型，不写完整 contract / implementation |
| 开放 seam | 通过旧字段和接口假定 ready | 仅建立 blocked boundary、保守状态与后续承接 |
| 外围能力 | 容易成为核心前置 | 只读 / 可重建 / 可延后，不能写 truth |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 按 17 项 FR 逐项组织概要 | 需求覆盖直观 | 会把 02 写成需求文档续篇，主体重复且无法形成对象 / 流闭环 | 不采用 |
| B. 按 `A1~P6` 一一映射为代码模块 | 架构追溯简单 | 架构语义单元不等于代码主体，会造成过度碎片和影子层实体化 | 不采用 |
| C. 以稳定业务组成部分为主轴，跨实现层展开对象 / 接口 / 流 / 状态 | 同时保护架构边界和落码性 | 需要 Step 4/5 再验证组成部分 | 采用 |
| D. 等九项 blocker 全部关闭再做 02 | 避免任何开放接口 | 会让 L2 自有逻辑主体长期停滞 | 不采用；未闭口处采用 blocked port |
| E. 把 schema、技术栈、配置、测试和实施一次写完 | 表面完整 | 跨越 03~07，且会伪造外部合同 / 事实 | 不采用 |

## 7. 结构化中间产物

### 7.1 设计目标表

| 设计目标 | 说明 | 验证方式 |
|---|---|---|
| 建立架构到代码主体的稳定映射 | 将 `A/S/P`、`R/T/D` 和依赖角色转译为业务主体与实现分层，防止详细设计重造边界。 | Step 4 的两幅图和关系表覆盖所有架构主语，且不锁定目录 / 框架。 |
| 建立主要组成部分及 capability 主轴 | 让核心合同、Binding、调用、前置交接、outcome / audit 与维护 / 派生各有稳定承载。 | Step 5 每部分都有职责、非职责、capability、候选对象与接缝，并通过停审。 |
| 建立关键对象与数据 owner 轮廓 | 使 truth、typed ref / snapshot、decision fact、gap 与 derived material 可被独立实现且不复制外部正文。 | Step 6 每个对象独立成节，字段有类型、函数参数有类型，无孤儿对象。 |
| 建立统一接口与边界 port 骨架 | 让 caller / carrier 围绕同一 contract，开放上游 seam 不再由实现者猜测。 | Step 7 分类完整；每个接口回指对象 / capability；blocked port 显式。 |
| 建立关键处理流和状态闭环 | 固定核心写路径、外部事实消费、no-execution、outcome、handoff、维护 / 派生的结构顺序和状态触发。 | Step 8/9 的接口、对象、流程、状态互相可反查，无跨 owner 伪事务。 |
| 建立异常与配置边界 | 使 fail-closed、source gap、handoff degradation、forbidden body 和不可配置化红线在详细设计前可判断。 | Step 10/11 能指导 03/04，且没有错误码大全、key / 默认值或绕过开关。 |
| 建立完整的 03 承接边界 | 将稳定主语与仍 blocked 的协议、schema、mapping、route 分开交给详细设计。 | Step 12 不新增前文主语，逐项说明 03 展开内容和回退规则。 |

### 7.2 非范围表

| 非范围 | 不进入原因 |
|---|---|
| 需求目标、故事、功能、规则、依赖与验收重写 | 已由正式 00 收稳；02 只承接其结构影响。 |
| 系统上下文、子域、容器、依赖、数据 owner、技术机制与取舍重写 | 已由正式 01 收稳；02 不重开架构决策。 |
| 完整对象 / DTO / Event / Job schema 与完整函数 / trait / repository 契约 | 属于 03；02 只写概要级字段和函数骨架。 |
| DDL、索引、事务、并发、幂等、retry / replay、协议 path / topic 与算法 | 属于 03 或相邻 owner 合同，不在概要层定稿。 |
| 配置 key、默认值、格式、环境变量、secret 名和加载 / 部署机制 | 属于 03/04；02 只识别配置影响类型和不可配置化边界。 |
| 测试用例、真实 run / evidence、验收签署、实施 boundary、排期、灰度、回滚和上线 | 分属 05/06/07 或真实实施 / 运维，且当前无事实来源。 |
| Runtime plan / loop / orchestration / recovery / checkpoint | 属于 `L2-runtime`，不是工具合同主体。 |
| Capability / provider registry、exposure / applicability truth | 属于 Hub / external owner；本仓只有 body-free Binding。 |
| Effective authorization / approval / policy / taxonomy truth | 属于未解析的正式 authority；本仓只消费可验证结果。 |
| Sandbox environment / run / capture / failure / receipt / cleanup / recovery | 属于 `L4-sandbox`；本仓只做条件 handoff 和 source semantic consumption。 |
| Bus delivery / retry / DLQ / replay 与 Observability store / projection / retention | 属于相应 owner；本仓只拥有 safe material 与 local attempt / gap。 |
| SDK client、多语言 wrapper、具体 builtin / MCP / A2A / API 工具、inventory、marketplace | 属于客户端、适配、库存或产品分发边界。 |
| Raw request / prompt / capture / provider response、secret、credential、evidence body | 属于 forbidden body，任何后续文档都不得纳入。 |
| 未闭口 authority / mapping / receipt / route / shared type / SDK / measurement 的正向细节 | 受 `L2T-UP-001~009` 阻塞；只能保留 blocked boundary 和保守语义。 |

### 7.3 当前阶段设计深度口径

```text
本轮 02 收敛到“可实现代码主体骨架”。

必须明确:
- 架构模块到代码主体映射与实现分层
- 主要组成部分、capability、职责、非职责和接缝
- 每个关键对象的字段类型、状态、成员 / 工厂函数骨架和禁止事项
- Command / Query / Consumer / Event / Job / blocked port 的输入输出与读写边界
- P0 和关键外部事实 / Job 的处理流
- 正式状态、允许 / 禁止迁移与状态传播
- 异常、配置影响、详细设计承接、风险与待确认

不得提前展开:
- 完整 schema、完整签名、实现代码、DDL / SQL、事务和算法
- 协议 path / topic、配置 key / 默认值、部署与运维步骤
- 测试结果、真实 evidence、验收签署、实施 commit / readiness
- 任何上游未提供的 owner、mapping、receipt、route、shared package 或 client
```

## 8. 回填草稿

以下内容供 Step 14 装配正式 §2，当前不修改正式 02。

```md
## 2. 本次设计目标与范围

> 校准来源:
> - `design-calibration/02_hld_step_02_goals_scope.md`
>
> 延伸阅读:
> - 建议继续阅读该中间产物的“SOP 问题回答”“设计取舍”和“当前文档问题诊断”，了解结构目标、非范围与深度如何收敛。

### 2.1 设计目标

<摘录 §7.1>

### 2.2 非范围

<摘录 §7.2>

### 2.3 当前阶段设计深度

<摘录 §7.3>
```

## 9. 待确认事项

| 待确认项 | 备选 | 采用结论 | 理由 | 状态 |
|---|---|---|---|---|
| 是否按 FR 逐项组织正式 02 | A 是；B 以稳定结构主语组织并保留追溯 | B | 02 必须形成可实现结构而非需求续篇 | confirmed |
| 是否把 `A/S/P` 一一变成模块 | A 是；B 先由 Step 4/5 转译 / 合并为业务组成部分 | B | 架构语义单元不等于代码模块 | confirmed |
| 是否等待 blocker 全部关闭 | A 等待；B 继续 L2 自有逻辑并显式 blocked seam | B | 开放外部合同不阻塞本地结构闭合 | confirmed |
| 是否在 02 固定完整 contract / config / test / implementation | A 固定；B 按文档职责后移 | B | 防止跨层和伪造事实 | confirmed |

本 Step 不新增 blocker；`L2T-UP-001~009` 的限制已进入非范围和设计深度。

## 10. 进入下一步条件

- [x] 已明确七项概要结构目标及验证方式。
- [x] 已按上游、下游、相邻 owner、forbidden body 和 blocked fact 明确非范围。
- [x] 已明确“可实现代码主体骨架”的允许 / 禁止深度。
- [x] 未提前命名正式组成部分、对象、接口、流程或状态结论。
- [x] 旧 02 的 policy / executor / registry / 指标 / 上线范围未被继承。
- [x] 可以进入 Step 3“收稳约束条件”。
