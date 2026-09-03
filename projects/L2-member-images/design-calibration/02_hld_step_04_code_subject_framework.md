# L2-member-images 02 概要 Step 4: 代码主体框架映射

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 4 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 5 文件；本文件只定义代码主体骨架，不定义目录、文件、协议、数据库或部署

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 用户授权 | 用户已明确“完成全部的 02”，解除 Step 3 停审并授权连续完成 Step 4~14；本步仍按 Step 顺序执行 |
| 恢复顺序 | 已重读项目 ledger、02 flow、Step 3；已读取概要设计 SOP Step 4 与书写规范 §4.4，并复核正式 00 / 01 与 draft 仅作差异输入 |
| 本步目标 | 将已收稳的 BC / LS / 运行角色映射为语言中立的代码主体框架和实现分层，不把架构语义机械映射为物理模块 |
| 本步禁止 | 读取或继承旧正式 02；写目录 / 文件路径、完整 trait / struct、DDL、协议字段、部署产品、实现调用链或测试事实 |

## 1. Step 状态与问题回答

| 问题 | 回答 |
|---|---|
| 架构模块如何落到主体骨架？ | BC-MI-01~05 分别映射到定义装配、构建候选、资格判断、供给入口和外部引用 / 派生维护五组业务主体；LS-MI-01~04 映射为受控 reference / projection 支撑，不单独成为业务服务。 |
| 哪些属于 Inbound / Operations？ | 同步管理 / 查询入口、nightly job、条件型 inbound event consumer、reference refresh、projection rebuild、handoff reconciliation 属于入口或运维承载；它们不直接形成领域 truth。 |
| 哪些属于 Application Services？ | Definition / baseline coordination、build intent coordination、candidate qualification coordination、availability transition coordination、entry resolve coordination 是用例编排主体。 |
| 哪些属于 Domain Model？ | Image family / variant definition、assembly baseline / revision、build intent / attempt / candidate、provenance / gate evaluation、availability / entry 及历史关系是领域对象与规则主体。 |
| 哪些属于 Ports / Persistence / Projection？ | External reference、builder / registry / evidence、Artifact handoff、consumer supply、Core / Bus seam 是 ports；正式 truth 的保存与历史读取是 persistence port；manifest / trace / gap / catalog 是只读 projection。 |
| 哪些名称必须先点名？ | 五组业务主体、各自 application coordinator、核心 domain 对象族、external seam ports、truth / projection 分离和 conditional event / job 入口必须在本层点名；具体文件与框架不点名。 |
| 哪些内容不应在本步展开？ | 代码目录、crate / package、类或函数完整签名、表结构、协议 payload、队列 / registry 产品和进程拓扑。 |

## 2. 当前文档问题诊断

| 输入现象 | 结构风险 | 本步处理 |
|---|---|---|
| 01 已同时列 BC、LS、运行角色和六类 seam | 直接照抄会把语义边界误写为 service / database | 以五组业务主体承接 BC，以 reference / projection 支撑 LS，另用实现层说明如何安放 |
| draft 按九个功能部分展开 | 可作为能力线索，但容易把 truth core、阶段职责和入口重复计数 | 当前只先形成主体框架；Step 5 再决定主要组成部分，不在本步锁九部分 |
| pending seam 需要可见 | 若只列 happy path，03 无法展开 blocked / gap | 每个外部 seam 只获得 port / adapter / gap 语义，不获得 exact positive schema |
| 同步、后台、事件入口并存 | 可能被压成一个 pipeline | 入口层、application 层和 domain 层分开，accepted 不等于 completed |

## 3. 架构模块到代码主体映射图

```text
+======================================================================+
|                         L2-member-images                             |
+======================================================================+
| BC-MI-01 Definition / Assembly                                      |
|   +-- DefinitionAssemblyCoordinator                                 |
|   +-- ImageVariantDefinition / AssemblyBaseline domain subjects     |
|   +-- MappingSnapshot / ComponentPin / SeedRef boundary subjects     |
|                                                                      |
| BC-MI-02 Build Intent / Candidate                                   |
|   +-- BuildIntentCoordinator                                         |
|   +-- BuildIntent / BuildAttempt / CandidateImage domain subjects    |
|   +-- BuilderPort / RegistryPort / BuildOutcomeAdapter               |
|                                                                      |
| BC-MI-03 Provenance / Eligibility                                   |
|   +-- QualificationCoordinator                                       |
|   +-- ProvenanceBinding / GateEvaluation / EligibilityDecision        |
|   +-- EvidenceConclusionPort / ArtifactHandoffPort                  |
|                                                                      |
| BC-MI-04 Supply / Instantiable Entry                                |
|   +-- AvailabilityCoordinator                                        |
|   +-- AvailabilityTransition / InstantiableEntry / HandoffGap        |
|   +-- MemberServiceSupplyPort / EntryProjection                      |
|                                                                      |
| BC-MI-05 External Reference / Derived Maintenance                   |
|   +-- ReferenceIntakeCoordinator                                     |
|   +-- ReferenceSnapshot / ContractGap / TraceRecord                  |
|   +-- ProjectionRebuilder / HandoffReconciler / read-only views      |
+======================================================================+
```

关键说明：

- 图中的五组主体对应已收稳的 BC 语义，不代表必须拆成五个 package、service、process 或部署单元。
- `LS-MI-01~04` 被安放为 Reference / Projection 支撑主体，不拥有 BC-MI-01~04 的 positive truth。
- `BuilderPort`、`EvidenceConclusionPort`、`MemberServiceSupplyPort` 等名称是 inward seam 骨架，不是对端已确认的协议或源码依赖。
- `ImageVariantDefinition` 等对象只在本步点名主语；字段、状态、函数留给 Step 6，接口和流留给 Step 7 / 8。

## 4. 实现分层视图

```text
+------------------------------+
| 外部调用 / 条件型事件 / 运维任务 |
+---------------+--------------+
                |
                v
+------------------------------+
| Inbound / Operations         |
| 管理入口、查询入口、Job、     |
| conditional event consumer    |
+---------------+--------------+
                v
+------------------------------+
| Application Services         |
| 用例编排、边界校验、幂等语境、 |
| domain / port 协调            |
+---------------+--------------+
                v
+------------------------------+
| Domain Model / Policies      |
| definition、revision、intent、|
| candidate、eligibility、      |
| availability 与 history      |
+---------------+--------------+
          |                    |
          v                    v
+----------------------+  +-------------------------+
| Ports / External     |  | Persistence / Truth     |
| Seams                |  | Store / History         |
| ref、adapter、event  |  | 只承载本仓正式 truth    |
+----------+-----------+  +------------+------------+
           |                           |
           +-------------+-------------+
                         v
              +-------------------------+
              | Projection / Derived    |
              | catalog、manifest、trace |
              | gap、maintenance view   |
              +-------------------------+
```

关键说明：

- Inbound / Operations 只接受请求、事件或已持久化事实并调用 application；不直接写 domain truth。
- Application Services 负责用例边界与协调；domain model 负责不变量和阶段性判断，不直接读取配置、外部正文或产品 SDK。
- Ports / External Seams 将外部 ref、snapshot、safe conclusion 和 adapter outcome 转为本仓可判定输入；Persistence 不能反向改变 owner。
- Projection / Derived 只读、可滞后、可重建；物理同置不改变写入权限。
- 图不表达具体语言、目录、事务算法、部署 topology 或完整调用链。

## 5. 业务主要组成部分与实现分层关系

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 由镜像定义 / 装配、构建 / 候选、资格 / provenance、供给 / 入口、外部引用 / 派生维护五条语义责任线组成；它们回答“本仓做什么”。 |
| 实现分层 | Inbound、Operations、Application、Domain、Ports、Persistence、Projection 等是代码组织责任，回答“主体如何协作与安放”。 |
| 二者关系 | 一个业务部分可跨多个实现层；一个实现层可承接多个业务部分。两者不一对一，也不因此推导 service、crate、database 或 process 数量。 |
| 向内依赖 | Domain 不依赖 external DTO / SDK / storage 产品；Application 通过 inward port 协调；Projection 不成为第二写源。 |
| Pending 处理 | exact seam 未闭口时仍可有 port、adapter boundary 和 blocked result，但不得把对端 schema 或 positive success 写成主体契约。 |

## 6. 关键判断

### 6.1 业务主语与实现层不可混用

`BC-MI-01~05` 是语义责任边界，`Inbound / Application / Domain / Ports / Persistence / Projection` 是实现安放方式。若把二者混用，就会把架构上下文直接变成物理服务，或把某个 repository / adapter 误当成业务能力 owner；后续 Step 5~9 必须沿两条正交轴分别展开。

### 6.2 本步采用的主体边界

| 主体族 | 本步承接 | 后续重点 |
|---|---|---|
| Definition / Assembly | BC-MI-01、LS-MI-01/02 | 组成部分、baseline / revision 对象、输入完整性 |
| Build / Candidate | BC-MI-02、LS-MI-03 | intent / attempt / candidate、external outcome 与 local decision 分离 |
| Qualification | BC-MI-03、LS-MI-03/04 | digest / provenance、applicable gate、eligibility 与 Artifact gap |
| Supply / Entry | BC-MI-04、LS-MI-04 | availability history、pinned entry、consumer gap |
| Reference / Derived | BC-MI-05、LS-MI-01~04 | ref validity、gap、trace、projection freshness，不创建 positive truth |

## 7. 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 直接按 BC / LS 建同名 service | 不采用 | 机械映射物理承载，违反 HLC-MI-002 |
| 直接按 CI 步骤建 build / scan / push 模块 | 不采用 | 过程步骤不能承载 definition、history、eligibility 和 owner 边界 |
| 采用五组业务主体 + 正交实现分层 | 采用 | 覆盖正式架构主线，同时为同置或未来拆分保留空间 |
| 因 pending seam 不建任何边界主体 | 不采用 | 会丢失 blocked / gap / unavailable 的可落码语义 |

## 8. 回填草稿

正式第 4 章应回填两张图、业务主体与实现层关系表和关键判断；不回填本文件的问题诊断、设计取舍和停审过程。图中的主体名称必须与 Step 5~9、正式 02 后续章节保持一致。

## 9. Step 5 前置检查

| 检查项 | 结果 |
|---|---|
| 已有架构模块到代码主体的映射 | `pass` |
| 已有实现分层视图 | `pass` |
| 已区分业务主要组成部分与实现分层 | `pass` |
| 两张 ASCII 图符合 `text` 代码块要求 | `pass` |
| 未写目录、文件、完整类型、协议、数据库或部署 | `pass` |
| 未读取旧正式 02，未创建 Step 5 文件 | `pass` |

`gate_status = pass_stop_review`。Step 4 足以支撑 Step 5 主要组成部分与职责边界；下一动作是读取 Step 4 与规范后创建 Step 5，不能跳到 Step 6 或正式 02。
