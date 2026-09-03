# 01 架构校准 Step 5：限界上下文与子域划分

> 状态：completed / pass
> 日期：2026-08-22
> 前序门禁：Step 4 completed / pass
> 本步目的：按语义与生命周期划分核心子域、支撑子域和本地影子结构，并逐单元停审

## 1. Step 内计划

- [x] 读取 flow、台账、Step 3~4 和 draft 分层候选。
- [x] 按 C-MS-1~5 分别回答语义中心、生命周期、职责与非职责。
- [x] 判断外部资格、承载 / 隔离、事实交接为何属于支撑子域。
- [x] 区分本地 snapshot / reference / projection，不把影子结构升格为核心。
- [x] 为每个架构单元定义统一语言与禁止混用词。
- [x] 逐单元完成职责、非职责、影子边界和停审。
- [x] 绘制上下文关系图并执行跨上下文语义审计。
- [x] 形成正式 §6 回填草稿和 gate 自检。

## 2. SOP 问题回答与划分取舍

### 2.1 本仓有哪些内部语义上下文

五个核心子域一一承接 C-MS-1~5：宿主意图与编排决定、宿主装配与就绪、注册与 Host Session、宿主健康与恢复、生命周期收束与对账。三个支撑子域分别承接外部资格输入、宿主承载 / 隔离能力、事实交接 / 只读消费。三类本地影子结构分别服务资格判断、外部运行关联和安全消费，不拥有外部 truth。

### 2.2 为什么采用五个核心子域，而不是 draft 的三个

draft 将装配、实例、注册和会话合在“宿主实例与会话核心”，又将健康、恢复、清理、对账合在另一个核心。该切法会让 readiness 与 registration、health decision 与 cleanup completion 共用模糊生命周期，后续概要设计容易产生单一“大宿主状态机”。本步按 C-MS-1~5 分开，是因为五组语义分别回答不同问题、拥有不同强一致边界和失败上限；它们仍围绕同一个 host truth center 协作，不形成五个仓或五套宿主 truth。

### 2.3 哪些是核心、支撑与本地影子

- 核心子域：直接拥有正式宿主决定、实例侧结论、注册 / session、健康 / 恢复或收束 / 对账 truth，缺失任一都会使本仓核心闭环不成立。
- 支撑子域：承接外部 owner 输入、基础设施能力和外围材料消费，使核心可运行但不生成第二份核心 truth。
- 本地索引 / 投影 / 引用：保留消费时点 snapshot、typed ref、外部完成摘要或 safe view，只为稳定消费、对账与查询服务。

### 2.4 为什么不能混成一个上下文

意图决定不等于宿主动作完成，装配 ready 不等于注册成功，注册 / session 可用不等于 host 健康，host 恢复决定不等于 Runtime checkpoint 恢复，local cleanup attempt 不等于外部 cleanup completion。将这些语义混为一个上下文会把不同 owner、不同一致性和不同失败状态压成单一状态。支撑与影子结构若并入核心，还会让外部 snapshot、adapter 状态或投影成为第二写源。

## 3. 当前材料诊断

| 候选内容 | 诊断 | 本步结论 |
|---|---|---|
| draft 的 3 核心 + 4 支撑 | 方向正确，但两个核心粒度过粗，且“装配与解析”可能暗示直接解析 Role / image | 重划为 5 核心 + 3 支撑；使用“外部资格承接”，禁止 Role 解析。 |
| “Host truth core”作为额外总核心 | 容易变成凌驾五节点的超级上下文或代码模块 | host truth center 是跨上下文共同边界，不单列第六核心。 |
| Policy effective snapshot | 当前无 FR，owner 未闭口 | 不建立 policy 专项影子上下文；未来正式纳入时重开 Step 5。 |
| outbox / repository / cache | 实现结构，不是语义上下文 | 从本步排除；只保留事实交接、snapshot / projection 语义。 |
| Orchestrator adapter 作为核心 | 基础设施产品能力会反向定义 host truth | 归入支撑子域，核心只消费中立反馈。 |
| trace / audit 作为独立核心 | 追溯是核心事实的横切属性，不是独立业务 truth | 不设 trace 核心；在 Step 12 作为横切约束。 |

## 4. 结构化中间产物

### 4.1 子域 / 上下文划分表

| ID | 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|---|
| `A1` | 宿主意图与编排决定核心 | 核心子域 | 承载项目型宿主意图、范围结论和宿主侧编排决定语义。 | 为 A2 / A4 / A5 提供已提交决定，不代表外部动作已完成。 |
| `A2` | 宿主装配与就绪核心 | 核心子域 | 承载宿主实例世代、装配条件、分项结果和 host readiness 语义。 | 消费 A1 决定与 S1 / S2 资格反馈，为 A3 提供可注册前提。 |
| `A3` | 注册与 Host Session 核心 | 核心子域 | 承载注册接受、活动 endpoint、host session 壳及替换 / 失效语义。 | 依附 A2 宿主实例，为 A4 / A5 提供当前接入关联。 |
| `A4` | 宿主健康与恢复核心 | 核心子域 | 承载 host / session / backend / unknown 健康与宿主侧恢复 / 终止决定。 | 消费 A2 / A3 当前事实，不读取 Runtime checkpoint 内容。 |
| `A5` | 生命周期收束与对账核心 | 核心子域 | 承载关联失效、local cleanup / release、residual、orphan、drift 和 reconciliation 语义。 | 消费 A1~A4 已提交事实，经 S2 收束外部能力，经 S3 交接材料。 |
| `S1` | 外部资格承接上下文 | 支撑子域 | 将 Identity、Work、Images 和 credential owner 的 ref / safe snapshot 收束为可判定资格。 | 支撑 A1 / A2，不拥有外部正文，不建立 Role -> image 解析。 |
| `S2` | 宿主承载与隔离交接上下文 | 支撑子域 | 将宿主基础设施和 Sandbox 能力映射为中立的 host-side 请求与反馈语义。 | 支撑 A2 / A4 / A5，不拥有 backend 或 isolation truth。 |
| `S3` | 事实交接与只读消费上下文 | 支撑子域 | 从已提交宿主事实形成 body-free material、safe view 和本地 handoff attempt / gap。 | 只读消费 A1~A5，不反写核心，不拥有 delivery / observed / accepted。 |
| `P1` | 外部资格影子层 | 本地索引 / 投影 / 引用 | 保存执行主语、身份锚、pinned supply、credential 与资格 freshness 的安全影子。 | 只服务 S1 判断；external truth 不因本地存在而转移。 |
| `P2` | 外部运行关联影子层 | 本地索引 / 投影 / 引用 | 保存 Member / Runtime / Sandbox / carrier refs、允许信号摘要和外部完成摘要。 | 服务 A2~A5 / S2；正文、run 和 isolation truth 均外置。 |
| `P3` | 宿主安全消费投影层 | 本地索引 / 投影 / 引用 | 保存可重建的 host safe view、消费索引和交接状态投影。 | 由 S3 从核心派生，只读、可迟滞、不可成为写源。 |

### 4.2 上下文关系图

```text
+----------------------+   +----------------------+   +----------------------+
| A1 意图与决定核心     |-->| A2 装配与就绪核心    |-->| A3 注册与会话核心     |
+----------------------+   +----------+-----------+   +----------+-----------+
                                   |                          |
                                   v                          v
                        +----------+-----------+   +----------+-----------+
                        | A4 健康与恢复核心     |-->| A5 收束与对账核心     |
                        +----------+-----------+   +----------+-----------+
                                   ^                          |
                  +----------------+--------------------------+
                  |                支撑子域层                  |
        +---------+--------+   +---+----------------+   +-----+------------+
        | S1 外部资格承接   |   | S2 承载与隔离交接  |   | S3 事实交接消费  |
        +---------+--------+   +----------+---------+   +---------+--------+
                  |                       |                       |
                  v                       v                       v
        +---------+--------+   +----------+---------+   +---------+--------+
        | P1 资格影子层     |   | P2 运行关联影子层   |   | P3 安全消费投影  |
        +------------------+   +--------------------+   +------------------+
```

图后说明：
- A1~A5 表达五组宿主核心语义的成立依赖，不表示运行调用顺序或五个独立服务。
- S1~S3 围绕核心提供外部资格、能力交接和安全消费，不生成第二份 host truth。
- P1~P3 只表示本地 snapshot / reference / projection 的语义位置，不表达缓存、表、对象或代码模块。
- policy 传递因无当前 FR 未进入任何上下文；其未来纳入必须重开需求与本 Step。

### 4.3 统一语言

| 术语 | 本仓唯一含义 | 禁止混用 |
|---|---|---|
| 宿主意图 | 请求本仓判断是否应改变项目型宿主的正式输入语境 | 不等于 Work 分配事实或容器动作。 |
| 编排决定 | 本仓已提交的 launch / restart / stop / terminate / hold 等宿主侧决定 | 不等于外部动作完成。 |
| 宿主实例 | 本仓拥有身份与世代关系的逻辑执行宿主 | 不等于 Pod、container、VM 或 backend resource。 |
| 装配结果 | 本仓对每项外部资格 / 承载反馈形成的 host-side 结论 | 不等于外部 owner truth。 |
| Host readiness | 所有 required 宿主装配前置共同可验证的本仓结论 | 不等于 Runtime ready、Member healthy 或业务成功。 |
| 注册接受 | 本仓对宿主内来源与当前实例关联的接受 / 拒绝结论 | 不等于 Member 发送请求成功。 |
| Host session | 宿主与外部运行协作对象之间的关联壳及可用性 | 不等于 Runtime run / checkpoint。 |
| 宿主健康 | host / session / backend / unknown 分层判断 | 不等于业务结果、Runtime outcome 或 observed truth。 |
| 恢复决定 | 本仓对宿主实例采取 recover / restart / terminate / hold 的决定 | 不等于 Runtime 内容恢复。 |
| Local cleanup | 本仓的关联失效、release / cleanup 决定、attempt、gap 与 residual | 不等于 Sandbox / backend cleanup completed。 |
| Handoff gap | 本仓已尝试但未能证明外部完成的交接缺口 | 不等于 delivery failure 已被修复或下游拒绝。 |

## 5. 架构单元逐项停审

| 单元 | 职责清楚 | 非职责清楚 | 分类正确 | 影子边界清楚 | 待确认保留 | 结果 |
|---|---|---|---|---|---|---|
| A1 | 是 | 不拥有 Work / Identity / authorization truth | 核心 | 只消费 P1 | 非项目型 fail closed | pass |
| A2 | 是 | 不拥有 Images / credential / Sandbox / backend truth | 核心 | 只消费 P1 / P2 | supply / credential / binding pending | pass |
| A3 | 是 | 不拥有 Member 主体或 Runtime run | 核心 | 只消费 P2 | Member / Runtime contract pending | pass |
| A4 | 是 | 不拥有 Runtime recovery、observed 或 backend truth | 核心 | 只消费 P2 | health threshold deferred | pass |
| A5 | 是 | 不拥有 external cleanup / delivery truth | 核心 | 只消费 P2、输出到 S3 | release / receipt pending | pass |
| S1 | 是 | 不解析 Role / image，不签发 credential | 支撑 | 维护 P1 | owner contracts pending | pass |
| S2 | 是 | 不拥有 isolation / carrier product truth | 支撑 | 维护 P2 | host binding / backend qualification pending | pass |
| S3 | 是 | 不拥有 Bus / Observability / downstream truth | 支撑 | 维护 P3 | route / receipt pending | pass |
| P1 | 是 | 不保存外部正文 | 本地影子 | snapshot / ref only | freshness schema pending | pass |
| P2 | 是 | 不保存 signal / run / capture / resource 正文 | 本地影子 | snapshot / ref only | exact refs pending | pass |
| P3 | 是 | 不反写核心 | 本地影子 | projection only | consumer contract pending | pass |

## 6. 跨上下文语义边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 核心职责是否重叠 | pass | 五核心分别拥有决定、装配、注册 / session、健康 / 恢复、收束 / 对账。 |
| 支撑子域是否生成第二 truth | pass | S1~S3 只承接、映射或派生。 |
| 本地影子是否被写成核心 | pass | P1~P3 均明确 snapshot / ref / projection only。 |
| 统一语言是否冲突 | pass | readiness、session、health、cleanup、handoff 均与外部 owner 术语分层。 |
| 四语义层是否可定位 | pass | control plane 在 A1 / A4，host truth 贯穿 A2~A5，runtime session 只在 A3 壳，execution handoff 经 S2。 |
| 是否误写实现结构 | pass | 未出现目录、handler、repository、表、接口或产品部署。 |
| pending 是否保留 | pass | sibling、Sandbox、credential、Core / SDK、backend 与 consumer 合同均未伪关闭。 |

## 7. 回填草稿

- 正式 §6 采用 11 行划分表、上下文关系图和统一语言表。
- 正式正文保留“五核心不是五服务”的说明，避免概要设计机械映射部署单元。
- 逐单元停审和跨上下文审计留在本校准文件，不复制进正式正文。

## 8. Gate 自检

| 检查项 | 结果 |
|---|---|
| 核心 / 支撑 / 本地影子分类是否完整 | pass |
| 每个上下文是否有职责、非职责和统一语言边界 | pass |
| 每个单元是否独立停审 | pass |
| 跨上下文是否无 unresolved 职责或 truth 冲突 | pass |
| 是否未把实现模块或部署单元写成上下文 | pass |
| 是否允许创建 Step 6 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_06
formal_01_write_allowed = false
```
