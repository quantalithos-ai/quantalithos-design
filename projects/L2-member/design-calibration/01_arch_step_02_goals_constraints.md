# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.2、§4.3
> 回填位置: 正式 `01-架构设计.md` §2、§3
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1 已通过;本文件通过前未创建 Step 3

## 1. 本步输入

| 输入 | 已确认结论 | 本步使用方式 |
|---|---|---|
| `01_arch_step_01_requirements_baseline.md` | `RB-L2M-001~008`、`HC-L2M-001~010`、开放 seam 与污染审计 pass | 转译为结构目标、不可变约束、取舍和非目标。 |
| 正式 `00-需求文档.md` §4 / §7 / §13 / §14 | G-L2M-001~005、C-L2M-1~5、NFR-L2M-001~016、AC / VF | 保持需求来源和可审查判断口径。 |
| Runtime / Tools / Core / Bus 当前正式边界 | truth owner、entry / handoff、tool action、shared contract、delivery boundary | 防止 member 架构吞并上游或基础设施 truth。 |
| sibling 最新台账 | 两个正式 00 均在 Step 17,尚未停审 | owner 方向可引用,正向合同不锁定。 |
| 旧正式 01 / README 审计 | 技术、协议、指标和 B1~B6 已判 historical | 只作反例,不作为目标来源。 |

本步不确定上下文、容器、层次、通信类别和技术机制;这些分别属于 Step 5~10。

## 2. SOP 问题回答

### 2.1 这个仓在架构层面要确保什么成立

| 目标 ID | 架构目标 | 可审查成立口径 | 需求来源 |
|---|---|---|---|
| `AG-L2M-001` | 成员门面 truth 单一且可归属 | 任一本地 presence、筛选、投递、出站、attempt 或追溯事实都只有 member owner,且关联项目型执行主语。 | G-001 / 004;FR-001~009 |
| `AG-L2M-002` | Runtime 决策边界不被打穿 | member 输入停在 entry seam,输出始于 committed safe material;member 不保存或推导 run / plan / checkpoint / outcome truth。 | G-002 / 003;HC-002 |
| `AG-L2M-003` | 入站筛选、投递与 Runtime 受理可区分 | 筛选四态、member 投递决定和 Runtime 受理结果各有独立来源与失败语义;正文不持久化 / raw 转发。 | FR-004~006;AC-002 / 010 / 011 |
| `AG-L2M-004` | 出站状态分层与本地事实优先成立 | committed outcome、member 决定、attempt、delivery、observed / accepted 不压平;外部失败不回滚本地决定。 | G-003;FR-007 / 008;AC-003 / 013 |
| `AG-L2M-005` | host 协作与本地在场分层成立 | member 只拥有本地在场和请求 / 信号 / 报告尝试;host acceptance / registry / session / health 保持外置。 | G-004;FR-001~003 |
| `AG-L2M-006` | 交互边界最小暴露且可追溯 | 关键本地事实可按关联语境追溯;持久化、出站、追溯、观测和派生面 body-free。 | FR-009 / 010;NFR-007 / 009 / 015 |
| `AG-L2M-007` | 摘要 / 能力出口派生边界成立 | 视图可重建、不反写,来源 stale / unresolved 显式;不复制定义正文或形成 registry。 | G-005;FR-011 / 012 |
| `AG-L2M-008` | 跨仓依赖可裁剪且类型真实 | 只有 Core 可成为 compile dependency;runtime / event / ref / adapter / fake 不混写。 | RB-006;AC-026;VF-007 |
| `AG-L2M-009` | 开放 seam 不产生伪成功 | 未闭口的 host / runtime / policy / route / subject 只能进入 blocked / waiting / degraded / fail-closed,不能生成 readiness。 | RB-008;NFR-004 / 016;VF-008 |

### 2.2 哪些约束不可变

| 约束 ID | 不可变约束 | 破坏后果 |
|---|---|---|
| `AIC-L2M-001` | 项目型实例必须以 ProjectMemberRef 为执行主语并关联 GlobalMemberRef;两者不可替代。 | 主体不可归属或身份 / 工作真相混写,正向路径必须拒绝。 |
| `AIC-L2M-002` | Runtime loop / context / plan / checkpoint / outcome 与 Tools invocation / execution / normalized outcome 不得进入 member truth。 | 形成第二运行 / 工具真相源,架构否决。 |
| `AIC-L2M-003` | host acceptance / registry / session / health、容器启停和镜像 / Sandbox truth 不得进入 member。 | 生命周期和隔离 owner 串仓,架构否决。 |
| `AIC-L2M-004` | Governance policy / decision、Conversation append、Bus delivery、observed / accepted truth 不得由 member 生成或反写。 | 外部 truth 被冒充,架构否决。 |
| `AIC-L2M-005` | 入站正文只允许授权瞬时检查;raw body、隐藏推理、secret、定义正文和完整日志不得成为 member 数据或出站材料。 | 越过最小暴露边界,架构否决。 |
| `AIC-L2M-006` | 筛选规则必须回链正式来源;unknown / stale / conflict 不得 fail open。 | member 自建裁决或不明规则放行,架构否决。 |
| `AIC-L2M-007` | 本地决定与外部状态必须分层;迟到 / 重复 / 乱序反馈不得覆盖或回滚已提交事实。 | truth 分叉或历史改写,架构否决。 |
| `AIC-L2M-008` | 除 Core 外不得引入 sibling package dependency;外部 provider / MCP / A2A / API 不得直连。 | 依赖裁剪失效或 capability adapter 越界,架构否决。 |
| `AIC-L2M-009` | projection / outlet / diagnostic / config explanation 只能派生、可重建、不可反写。 | 派生视图成为第二写源,架构否决。 |
| `AIC-L2M-010` | pending / fake / planned / not_run 不得被表达为集成完成、evidence 或 readiness。 | 设计真相源与证据闭环失真,架构否决。 |

### 2.3 哪些约束是当前阶段可接受的取舍

| 取舍 ID | 当前取舍 | 获得什么 | 牺牲 / 代价 | 退出条件 |
|---|---|---|---|---|
| `AT-L2M-001` | 当前只支持 project-scoped 实例 | 主语唯一、可归属、可 fail closed | 非项目型 / personal 路径不可用 | 正式 owner / ADR 定义第三种执行主语并重开边界。 |
| `AT-L2M-002` | host / Runtime / event / policy seam 保持 transport-neutral 或 blocked-aware | 不本地私造协议,可先完成边界架构 | 正向集成合同暂不能声明可落码闭口 | 对应 L2M-UP 闭口并回开受影响 Step。 |
| `AT-L2M-003` | 不设无 workload / measurement authority 的 P95 / SLA 数字 | 避免历史数字伪装事实 | 暂不能给出容量承诺 | 05 测试方案具备 workload、环境、采样和证据后。 |
| `AT-L2M-004` | 能力出口不作为 C1~C4 前置,允许首批裁剪 | 核心听 / 说 / 追溯不被 Tools / method ref 拖垮 | 初期可承接能力可见性有限 | Step 13 确认阶段范围且上游 ref 合同可用。 |
| `AT-L2M-005` | 派生视图允许最终一致和显式 stale | 核心 truth 提交不依赖投影 | 查询可能暂时滞后 | 投影重建 / freshness 合同在 02 / 03 收敛。 |
| `AT-L2M-006` | 不在 01 固定 retention / archive、载体、语言、进程管理器或存储 | 保持架构与实现证据分层 | 01 不能给出运维 / 实施答案 | 后续 03 / 04 / 07 在 authority 下收敛。 |

### 2.4 哪些目标可以明确判断或量化

当前可以明确判断“是否存在第二 owner”“是否发生 raw body 持久化 / 转发”“是否压平状态”“是否引入非 Core package”“是否让派生视图反写”“是否把 pending 写成 pass”。这些是布尔或枚举型架构判定,无需虚构数字。

当前不能量化吞吐、延迟、SLA、重试次数、heartbeat 周期或资源上限。正式 00 只要求按本地 stage 与外部等待分解性能,并要求派生路径不阻塞核心;任何数值必须后续由 workload 和测量证据建立。

### 2.5 哪些相关事项不是当前架构要解决的问题

| 非目标 ID | 非目标 | Owner / 后续位置 |
|---|---|---|
| `ANG-L2M-001` | LLM 推理、计划、记忆、checkpoint、recovery、outcome 生成 | L2-runtime |
| `ANG-L2M-002` | tool contract、invocation、execution、normalized outcome | L2-tools |
| `ANG-L2M-003` | capability registry 与外部 MCP / A2A / API adapter | L3-capability-hub 等正式 owner |
| `ANG-L2M-004` | 容器启停、注册表、host session、健康裁决、凭据签发 | L2-member-service / credential owner |
| `ANG-L2M-005` | 镜像构建 / manifest truth / compatibility verdict、Sandbox 隔离 truth | L2-member-images / L4-sandbox |
| `ANG-L2M-006` | Governance approval / policy truth、Conversation / Artifact / observed truth | 对应 L1 / L4 owner |
| `ANG-L2M-007` | API path、DTO / event schema、对象字段、数据库表、状态迁移 | 后续 02 / 03 |
| `ANG-L2M-008` | 配置 key / default / secret source / retention 数值 | 后续 04 |
| `ANG-L2M-009` | 测试步骤、workload、evidence、verdict、readiness | 后续 05 / 06;本任务不伪造 |
| `ANG-L2M-010` | 实施任务、代码目录、commit、部署 / 上线 / 回滚执行 | 后续 07 / 实施仓;当前不实现 |

## 3. 架构驱动力

| 驱动力 | 当前问题 | 架构响应 |
|---|---|---|
| 单一 owner | member / Runtime / host / Bus 容易各自定义交互状态 | 以 member 本地交互 truth 为中心,为外部 truth 留正式 seam。 |
| 最小暴露 | 入站注入风险和出站正文泄漏会穿透 Runtime / 下游 | 授权瞬时检查、body-free handoff、forbidden-body veto。 |
| 可归责 | outcome、publish、delivery、accepted 容易压平 | 本地决定与外部反馈分层并通过关联语境追溯。 |
| 可演进 | 兄弟合同、member-specific schema / route 未闭口 | transport-neutral / blocked-aware boundary + dependency inversion。 |
| 可裁剪 | 摘要 / 出口 / 诊断可能拖累核心 | 派生路径与 C1~C4 隔离,可独立降级或裁剪。 |

## 4. 当前文档问题诊断

| 旧表现 | 与目标 / 约束冲突 | 后续处理 |
|---|---|---|
| 用 B1~B6 模块清单替代架构目标 | 未表达 member truth、派生边界与状态分层 | Step 5 重新划分上下文,不继承模块名。 |
| 把 Rust / UDS / gRPC / supervisord / JWT 写成不可变约束 | 无当前 authority,且侵入 host / Runtime 边界 | Step 10 前不选技术;开放项保持 pending。 |
| 以固定 P95 / SLA 表达成功 | 无 workload / measurement authority | 只保留可分解和不阻塞判断口径。 |
| 以 retry / restart 作为通用韧性 | 可能造成盲重放或接管 Runtime / host lifecycle | 后续按 truth 与 owner 定失败语义。 |
| 未覆盖 summary / outlet、forbidden body、attempt / gap | 正式 00 的核心需求无架构承接 | 由 AG-006 / 007 / 009 补齐。 |

## 5. 前后对比与设计取舍

| 维度 | 旧口径 | 当前结论 |
|---|---|---|
| 成功 | 管道跑通 + 固定延迟 | owner、边界、状态分层、body-free 和 fail-closed 成立。 |
| 不可变约束 | 具体技术与载体 | 主语、truth、依赖、数据禁区和证据纪律。 |
| 可变约束 | 协议 / heartbeat 字段可调 | 正向 seam 未闭口;只锁语义上限。 |
| 非目标 | 只排除推理 / tools / 编排 / image | 同时排除 registry、external adapter、Governance / Conversation / Observability truth 和实现细节。 |
| 演进 | 以热更新 / 协议优化为主 | 先解 blocker,再扩派生 / 非项目范围,不扩大 owner。 |

选择 `AG-L2M-001~009 + AIC-L2M-001~010` 作为正式架构目标与约束基线。它们从当前需求推导,可用边界和状态事实审查,且不提前锁定容器、协议或实现。

## 6. 结构化中间产物

- 架构目标: `AG-L2M-001~009`。
- 不可变约束: `AIC-L2M-001~010`。
- 可接受取舍: `AT-L2M-001~006`。
- 架构非目标: `ANG-L2M-001~010`。
- 可判断质量口径: owner 唯一、body-free、状态不压平、依赖分类真实、派生不反写、pending 不伪装。
- 暂不可量化项: latency / throughput / availability / retry / heartbeat / resource 数字。

## 7. 回填草稿

正式 §2 以五类驱动力和 `AG-L2M-001~009` 说明架构必须确保成立的结构结果。正式 §3 分为不可变约束、当前取舍与架构非目标,分别承接 `AIC-L2M-001~010`、`AT-L2M-001~006`、`ANG-L2M-001~010`;开放 seam 必须保留 blocker ID,不得润色为已选协议。

## 8. 门禁自检

| 检查项 | 结果 |
|---|---|
| 是否回答 Step 2 五问 | pass |
| 目标是否写“必须成立什么”而非实现方案 | pass |
| 不可变约束是否保护 owner / truth / dependency / body boundary | pass |
| 取舍是否写明代价和退出条件 | pass |
| 非目标是否有明确 owner / 后续位置 | pass |
| 是否提前写容器、上下文、协议、存储、语言或代码结构 | pass:未提前写 |
| 是否继承无来源数字 | pass:未继承 |
| Step 2 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_03_responsibility_boundary.md`;正式 `01` 仍禁止修改。
