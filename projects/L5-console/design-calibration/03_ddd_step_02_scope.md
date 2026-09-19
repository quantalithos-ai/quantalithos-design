## Step 2. 明确本轮实现范围和非范围

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节：`详细设计书写规范` §5.2 本次详细设计目标与范围
- 当前模块：`scope`
- Step 门禁：`pass / self_reviewed`

#### 1.1 Step 内计划

- [x] 读取输入和前序结论：已读取 Step 1、正式 `02` §2/4～12、`00/01` 范围边界和当前用户授权。
- [x] SOP 问题回答：已逐项回答本步五个问题。
- [x] 当前材料 / 旧文档诊断：已检查旧 `03` 的服务端/持久化/组件范围扩张和本仓 draft 的候选能力混层。
- [x] 设计取舍：已比较全量工作台服务、仅安全客户端骨架和按主题直接实现三种范围方案。
- [x] 结构化中间产物：已形成实现契约目标表、非范围表、模块覆盖矩阵和交付边界图。
- [x] 复杂度判断 / 是否拆模块或附录：五个主要组成部分可在同一范围表收口；八类主题以 owner-specific seam 记录，不拆成独立实现项目。
- [x] 回填草稿：已形成正式 §2 可直接采用的目标/非范围草稿；正式 03 仍不可写。
- [x] 自检与进入下一步条件：已通过 Step / 文档 / 项目级自检；允许进入 Step 3。

### 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 直接承接白名单、禁止新增主语、输入缺口和安全上限 | 约束本步范围只能下沉实现契约，不重开上游。 |
| `02-概要设计.md` §2 | HLD-CON-01～06、当前详细设计深度与非范围 | 定义本轮详细设计的交付目标和深度上限。 |
| `02-概要设计.md` §4～5 | 五个主要组成部分、代码主体和职责边界 | 作为模块覆盖矩阵的唯一主轴。 |
| `02-概要设计.md` §6～9 | 对象、接口、九组流、客户端状态机 | 判断哪些实现契约必须被本轮设计覆盖，哪些需留给后续 Step。 |
| `02-概要设计.md` §10～12 | 异常/配置影响、03 承接清单和回退规则 | 约束错误、配置、实施与回退内容不越层。 |
| `00-需求文档.md`、`01-架构设计.md` | C-CON-1～6、无 owner truth、SDK-only、无 DB/BFF/worker/projection | 确认实现范围的安全和架构边界。 |
| 用户授权 | 本轮做到 Step 4 后停止，不进入 Step 5 | 确认本轮只形成实现布局前置材料，不生成模块对象/port 契约。 |

依赖的前序 Step：

```text
Step 1 已通过；本步不创建实现仓或正式 03，不提前讨论 Step 5 之后的完整对象/协议契约。
```

### 3. SOP 问题回答

#### 3.1 本轮详细设计必须覆盖哪些模块？

本轮详细设计的实现范围覆盖浏览器 Console 客户端的五个主要组成部分及其跨层支撑：

| 实现范围 | 必须承接的 `02` 主语 | 设计深度 |
|---|---|---|
| 访问语境与导航 | `AccessContext`、`NavigationState`、`DisclosureGuard` | planned entry、语境呈现、导航选择、披露收紧 seam；不实现认证/授权。 |
| 来源保真视图 | `OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet`、`QueryNoWriteGuard` | owner-safe query mapper、来源多轴、过滤/分页/下钻的客户端契约边界。 |
| 受控意图与结果 | `DraftIntent`、`RequestPresentation`、`ResultReference`、`CompletionGuard`、`UnknownReplayGuard` | 本地草稿/请求经历、owner command 委托、正式回查和 unknown 上限。 |
| 管理主题组织 | `TopicVisibility`、`TopicActivationState`、`TopicViewModel`、`OwnerActivationGuard`、`SafeLinkReference` | 八类主题的独立 owner seam、视图/入口门控和安全链接边界。 |
| 韧性与可访问交互 | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`DiagnosticContext` | 局部降级、显式恢复、焦点/播报和最小诊断接缝。 |
| 跨层支撑 | browser entry/session shell、application orchestration、state carrier、SDK/owner adapters | 模块和文件布局、依赖方向、后续契约输入；不生成新的业务部分。 |

#### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机？

本轮只定义“需要在后续 Step 继续闭口”的实现契约集合，不提前写完整 schema：

- 对象：上述五部分中的客户端 state、safe view、reference、guard 和 recovery/a11y 主语；Step 5/6 再逐模块闭合字段、函数、状态和不变量。
- 接口：`ResolveAccessContext`、`GetNavigationVisibility`、`QueryOwnerView`、`GetSourceStatus`、`GetSafeLink`、`GetRequestPresentation`、`ReconcileRequestResult`、`GetTopicActivation`、`SubmitControlledIntent` 等 `02` 已列出的 Query/Command seam；Step 7/8 再闭合 typed adapter/protocol。
- 事件：仅保留条件化 `ConsumeSdkInvalidationHint` seam；是否激活取决于正式 SDK event contract，不把它扩成私有 bus consumer。
- Job：Console 不拥有 Operations Job；requery/revalidate/reconcile 由显式 Query/Recovery action 触发，owner 长时工作留在 owner。
- 状态机：只承接客户端语境、导航、请求经历、主题姿态、降级和 a11y 状态；不定义 owner 业务生命周期或统一 readiness 状态机。具体 transition matrix 留给 Step 10。

#### 3.3 哪些能力属于 P1 / 后续阶段，不应在本轮展开？

以下能力在本轮不展开为实现契约：

1. 八类主题的正向 owner command、完整编辑/发布/归档/恢复/sandbox 执行面：待 `CON-Q-034`、`CON-Q-039～043` 和正式 activation 合同。
2. 跨会话/跨设备草稿、偏好和离线连续性：待 `CON-Q-044`，本轮只保留 interaction truth 上限。
3. 统一比较、批量操作、导出、报告/证据材料化和未停审 L5/L6 深链：待正式 owner/link/ref 合同与后续文档。
4. 性能/可用率/兼容矩阵和诊断 envelope 的量化闭口：待 `CON-Q-045～046` 和 05/06 authority。
5. 任何后台 worker、projection rebuild、outbox、业务数据库、BFF 或跨 owner 事务：架构明确不属于 Console。

这些是“当前不做”的设计边界，不是排期或实现任务清单。

#### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册？

| 内容 | 归属文档 | 本轮处理 |
|---|---|---|
| 完整测试策略、测试数据、覆盖率、浏览器组合验证、运行证据 | `05-测试方案.md` | 只保留未来测试切口的输入边界，不创建测试或结果。 |
| 验收场景、evidence、report、signoff、readiness | `06-验收标准.md` | 不写验收通过结论；只承接行为上限。 |
| 实施 phase、commit boundary、implementation ledger、baseline | `07-实施计划.md` | 不创建实施台账或目标仓；不伪造实现状态。 |
| 配置键、默认值、环境变量、secret、加载发布策略 | `04-配置设计.md` | 本轮只识别配置影响类别，具体填写留给 04。 |
| 部署拓扑、告警阈值、故障 runbook、运维处置 | 运维/部署文档（如适用） | 不进入 Console 详细设计范围。 |
| owner domain truth、Policy/Gate、audit/evidence/report、sandbox enforcement | 相应 L0～L4 owner | 只消费安全结果/ref，不在本仓实现。 |

#### 3.5 实现者拿到本文后，应能完成哪些代码范围？

在完整 `03`（未来 Step 19 装配）完成且 owner 合同满足后，实现者应能：

- 创建 planned TypeScript 浏览器客户端的 package/module 边界和 browser entry；
- 实现五个主要部分的客户端 state carrier、view model、guard、application orchestration 和 SDK/owner adapter seam；
- 按正式合同映射 owner-safe Query、受控 Command、结果回查和可选失效提示；
- 保持 source/freshness/coverage/availability/consistency、多层请求结果和 fail-closed/unknown 语义；
- 为局部降级、恢复、键盘/读屏等价路径和安全诊断预留可测试接缝。

本步完成后尚不能开始这些实现，因为 Step 3/4 尚需收口语言/runtime、依赖和文件布局，Step 5～17 尚未授权。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧正式 `03-详细设计.md` §1～§5 | 把 Console 当成持有 `ConsoleWorkspace`、面板、摘要和偏好的服务端工作台，范围扩展到 repo/projection/publisher | 实现范围越过客户端边界，无法保证 owner truth 单一。 |
| 旧正式 §6～§15 | 提前定义 Rust struct、数据库写模型、API、事件、错误码、指标和测试结果 | 把详细设计范围与实现事实、测试方案和验收混在一起。 |
| 本仓 `draft/03_模块划分与分层.md` | 以候选“产品模块”混合 presentation components、controlled state、test seams 和 owner 业务入口 | 可作为讨论线索，但不能直接成为实现单元或 package。 |
| `02` 当前正式文档 | 已明确五个主要组成部分和详细设计承接清单，但未给出实现仓/文件级范围 | 需要本步先锁定“覆盖什么”和“明确不覆盖什么”，再进入技术与布局。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围主语 | 旧工作台服务、写模型、projection、publisher、统一摘要 | 五个客户端主要组成部分 + SDK/owner adapter seam | 与 `02` 主语和架构边界一致。 |
| 主题处理 | 可能把八类主题写成 Console 业务模块 | 主题仅作为 owner-partitioned view/activation seam | 防止复制成员、Workspace、治理、能力等 truth。 |
| 运行单元 | 隐含 API、repository、projection、后台流程 | browser client entry + bounded client state；无 server worker/job | 架构明确无 BFF/worker/业务 DB。 |
| 结果语义 | “动作成功/摘要完成”可由 UI/transport 产生 | request presentation 与 owner formal result/ref 分离 | 防止伪终态和 unknown 重放。 |
| 下游交付 | 把测试、配置、验收、排期混入详细设计 | 只定义实现契约目标，分别留给 04/05/06/07 | 保持文档职责边界。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A：按旧文档做完整 Console 工作台服务 | 表面覆盖面大，能快速列对象和页面 | 引入 owner truth、DB、projection、worker 和统一 readiness，违反架构 | 不采用。 |
| B：按五个主要组成部分定义浏览器客户端实现契约范围 | 与 `02`、架构和 C-CON-1～6 一致，能支持渐进 owner activation | 需要后续逐项闭合 adapter 和状态 carrier，部分主题暂时只能 read-only/blocked | 采用。 |
| C：每个 owner 主题独立实现一套完整业务模块 | 单主题边界直观 | 会复制 owner 规则并造成八套不一致的状态/权限语义 | 不采用。 |
| D：本轮只做页面/组件清单，不定义 adapter/state seam | 产出轻量 | 无法承接详细设计的可落码目标，也会把关键边界留给实现者猜测 | 不采用。 |

### 7. 结构化中间产物

#### 7.1 实现契约目标表

| 目标 | 覆盖模块 | 实现者应获得的契约结果 | 本轮上限 |
|---|---|---|---|
| 客户端启动和语境安全 | access/navigation | browser entry、session shell、context/disclosure seam | 不实现认证/授权、credential 或 scope truth。 |
| owner-safe 视图 | owner views | query adapter seam、view model、来源多轴和安全 ref | 不定义 owner DTO、raw body、跨域 projection。 |
| 受控意图完成语义 | intent/result | draft carrier、command/reconciliation adapter、formal result mapper | 不实现 owner 校验、幂等、终态或后台 job。 |
| 主题入口和能力激活 | topic composition | owner-specific query/command seams、visibility/activation gate、safe link | exact surface 未闭口时仅 pending/blocked/read-only/partial。 |
| 降级、恢复和 a11y | recovery/accessibility | local state、recovery action seam、focus/announcement/diagnostic seam | 不改变权限、业务状态、audit/evidence 或 readiness。 |
| 事实/边界审计 | 全部模块 | negative-boundary contracts、redaction 和可追溯来源 | 不生成运行 evidence 或 verdict。 |

#### 7.2 五个主要组成部分覆盖矩阵

| 组成部分 | 必须覆盖的实现面 | 当前不覆盖的实现面 | 进入后续 Step 的门槛 |
|---|---|---|---|
| 访问语境与导航 | entry、context view、navigation state、disclosure guard | identity provider、credential、scope hierarchy、授权决定 | `CON-Q-035/036` 的正式 ref/reason/撤销语义。 |
| 来源保真视图 | owner query mapper、snapshot/view、filter/page、safe link、no-write guard | DB、repository、owner projection、统一 health/readiness | `CON-Q-034/037` 的 exact query/safe-field/多轴合同。 |
| 受控意图与结果 | draft、review、command adapter、receipt/result presentation、reconcile trigger | owner transaction、idempotency authority、终态推进、重试队列 | `CON-Q-034/038` 的 command/result/reconciliation 合同。 |
| 管理主题组织 | 八类 topic registry/view/activation、owner-local degradation | 主题领域对象、跨 owner 原子性、固定控制项/指标 | `CON-Q-039～043/047` 的 owner/link activation。 |
| 韧性与可访问交互 | degradation/recovery/a11y/diagnostic seam、局部隔离 | global health、audit/evidence/report、运维 runbook | `CON-Q-045/046` 的 authority 和支持矩阵。 |

#### 7.3 详细设计交付上限图

```text
┌────────────────────────────────────────────────────┐
│ 本轮 03 设计范围                                   │
│ browser entry · client state · view model           │
│ guard · SDK/owner adapter seam · recovery/a11y      │
└──────────────────────────┬─────────────────────────┘
                           │ 只能消费正式 safe result/ref
                           ▼
┌────────────────────────────────────────────────────┐
│ 外部 owner / L0-sdk 正式边界                       │
│ identity · work/process/workspace · governance     │
│ artifact · method · capability · observability     │
│ archive · sandbox                                  │
└────────────────────────────────────────────────────┘

明确不在本轮：owner truth、DB、BFF、worker、projection、outbox、
private bus、跨域事务、完整测试/验收/配置/实施证据。
```

关键说明：

- 图表达客户端详细设计边界与外部正式 owner 边界的消费关系。
- 图不表达具体 SDK 方法、HTTP、组件、路由、存储或实现顺序。
- 最容易误解的边界是“能在页面显示”不等于“Console 拥有该对象或可推进其状态”。

#### 7.4 未来 03 章节承接表（仅范围，不代表已完成）

| 未来章节 | 本轮定义的范围输入 | 仍需后续 Step 闭口 |
|---|---|---|
| §1 | 上游承接与禁止重定义 | 由 Step 1 已完成。 |
| §2 | 五个客户端实现契约目标和非范围 | 由本步完成。 |
| §3 | TypeScript/ESM、runtime、依赖和安全约束 | Step 3。 |
| §4 | planned package/module/browser file layout | Step 4。 |
| §5～§9 | 模块对象、port、协议、函数流、状态 | Step 5～10。 |
| §10～§15 | state carrier consistency、错误、并发、配置、诊断、测试切口 | Step 11～16。 |
| §16～§18 | 实施承接、风险、参考 | Step 17～19。 |

### 8. 回填草稿

以下内容是未来正式 `03-详细设计.md` §2 的回填草稿；本轮不写入正式文件。

本次详细设计面向计划中的 TypeScript 浏览器 Console 客户端，目标是把 `02-概要设计.md` 已收稳的五个主要组成部分展开为可实现的模块、文件、view model、state carrier、guard、SDK/owner adapter、函数流、状态、错误恢复、配置绑定、诊断和测试切口。设计只拥有会话壳、导航、筛选/布局、表单草稿、请求经历、受控客户端状态和安全呈现；所有成员、项目、流程、治理、制品、Workspace、方法、能力、观测、归档和 Sandbox truth 仍由正式 owner 持有。

本轮覆盖：访问语境与导航、owner-safe 查询和来源多轴视图、草稿/受控意图/正式结果回查、八类主题的 owner 分区入口、局部降级/恢复/a11y/最小诊断，以及这些能力的 TypeScript 模块和 SDK adapter 边界。完整对象字段、port 方法、协议 schema、函数级流、状态转换、state carrier 介质、错误映射、配置键、测试切口和实施承接将在后续授权 Step 逐项闭口。

本轮不覆盖：owner domain truth、Policy/Gate 决策、数据库、repository、BFF、worker、outbox、owner projection/cursor/rebuild、私有 bus、跨 owner 原子事务、完整测试/验收/配置/实施文档、未停审 L5/L6 私有状态，以及未有正式 authority 的 framework、bundler、cache/TTL、性能和兼容数字。

### 9. 待确认事项

- `CON-Q-034～047` 仍按 Step 1 记录为 `open/pending`，并分别阻塞精确 adapter、主题 activation、reconciliation、量化/兼容和 link/ref。
- 本轮的“模块”指 planned client feature/责任边界，不预先等同 framework component、router、store、package 或服务端模块；Step 3/4 需进一步收口。
- P0 与 P1 的正式划分尚未由独立 authority 完整闭口；本步仅依据 `02` 的核心闭环和 pending 主题设置设计上限。
- 目标实现仓不存在，故本轮交付“设计范围”不代表代码可立即创建或已存在。

### 10. 进入下一步条件

- [x] 五个主要组成部分、跨层支撑和八类主题的实现覆盖范围已明确。
- [x] 本轮必须定义的契约类别与不适用的 Event/Job 已区分。
- [x] 后续文档（04/05/06/07）与 owner 的责任边界已列明，没有把排期或测试结果混入 03 范围。
- [x] 详细设计交付上限、pending 门槛和不可新增主语规则可判定。
- [x] 未创建实现仓、未修改正式 `03-详细设计.md`、未实现代码、未运行测试、未提交 commit。
- [x] Step / 文档 / 项目级门禁均通过；下一步允许进入 Step 3“收稳编码规范、语言/runtime、仓库约束”。
