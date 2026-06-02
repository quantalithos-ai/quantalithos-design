# Step 1. 确认概要设计输入边界

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节: `projects/L1-conversation/03-详细设计.md` §1 与上游文档的关系声明 / §17 风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计书写规范.md` | 新版详细设计 18 章主链、模块实现契约主轴、Rustdoc 注释和图表规则 | 作为正式文档结构与输出约束 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 1~19 讨论流程和门禁 | 作为本轮详细设计校准流程 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 中间产物结构、逐 Step 纪律、正式文档追溯要求 | 作为本文件结构约束 |
| `projects/L1-conversation/00-需求文档.md` | 本仓需求基线 | 确认详细设计不能重新定义的需求边界 |
| `projects/L1-conversation/01-架构设计.md` | 本仓架构基线 | 确认详细设计不能重新定义的系统边界、依赖方向和技术取舍 |
| `projects/L1-conversation/02-概要设计.md` | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和承接清单 | 作为详细设计直接输入 |
| `projects/L1-conversation/03-详细设计.md` | 旧版详细设计草案 | 作为需要重写的旧口径诊断对象 |
| `standards/coding/rust.md` | Rust 编码规范 | Step 3 继续承接,本步只登记为后续输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖方向和本仓依赖裁剪口径 | Step 3 / Step 4 / Step 14 继续承接 |
| `standards/document/子项目目录与代码文件组织规范.md` | 子项目目录、crate / package、binary 和文件组织规则 | Step 4 继续承接 |

已确认结论:

```text
新版 `02-概要设计.md` 已经足以作为详细设计输入。
旧版 `03-详细设计.md` 基于旧 Conversation / Turn / StreamEvents / AG-UI / event-to-turn mapping 口径,不能继续作为正式详细设计主线。
详细设计应从 `02-概要设计.md` §12 的承接清单开始,按新版详细设计 SOP 逐 Step 展开。
```

依赖的前序 Step:

```text
无。Step 1 是本轮详细设计校准的起点。
```

---

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接概要设计中的哪些结论？

当前详细设计直接承接新版 `02-概要设计.md` 中已经收稳的 Conversation truth center 定位、代码主体框架、8 个主要组成部分、30 个关键对象、Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 骨架、关键处理流、15 组状态机、异常边界、配置影响轮廓和详细设计承接清单。

详细设计不重新定义这些主语,只把它们展开为:

- 目标仓实现单元、crate / package / module / file 布局。
- Rust struct / enum / enum variant / value object / trait / public function 的完整实现契约。
- Command / Query / Event / Job DTO、metadata、handler、port、repository、error 和 result contract。
- 函数级处理流、事务边界、幂等、状态转换、异常恢复、配置绑定、审计和测试切口。

### 3.2 概要设计中的代码主体框架是否已经足够稳定？

足够稳定。`02-概要设计.md` §4 已把 `L1-conversation` 收敛为 Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Outbox and Handoff 分层。§5 已收稳 8 个主要组成部分:

- `Conversation truth core`
- `Space / scope management`
- `Collaborative fact append`
- `Authorized consumption`
- `Cross-domain manifestation`
- `History trace / review`
- `Derived consumption support`
- `Local reference / snapshot / projection support`

这些组成部分足以作为详细设计模块实现契约主轴。若后续发现需要新增或删除主要组成部分,必须回退概要设计 Step 5,不能在详细设计中静默新增业务模块。

### 3.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

足够进入详细设计,但仍处于概要骨架深度。当前可以继续展开:

| 概要输入 | 是否足够进入详细设计 | 详细设计继续展开 |
|---|---|---|
| 关键对象轮廓 | 是 | 完整字段、字段类型、字段作用、不变量、构造函数、成员函数签名、返回类型和错误类型 |
| API / 接口骨架 | 是 | DTO schema、handler / service / port trait、metadata、幂等、分页、一致性标记和错误映射 |
| 关键处理流 | 是 | 函数级调用链、repository / port 调用、unit of work、outbox 同事务、异步 job 边界和失败分支 |
| 状态定义与状态流转 | 是 | 状态 enum、variant 注释、允许 / 禁止迁移矩阵、guard 函数和测试断言 |
| 异常与边界场景 | 是 | error enum、协议错误映射、rejected / deferred / quarantined / stale / failed / suppressed marker 和恢复口径 |
| 配置影响轮廓 | 是 | ConversationRuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、StoreConfig、JobConfig 和 runtime builder 注入 |

### 3.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清？

需要在本轮详细设计中补清的内容包括:

- 目标仓目录、Cargo workspace、crate / package / binary / module / file 布局。
- `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`CrossDomainManifestation`、`ConversationTraceContext` 等对象的完整字段和函数。
- `ConversationTruthPolicy`、`VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy`、`TraceRetentionPolicy` 等 policy 的输入输出与错误类型。
- Command / Query / Consumer / Event / Job 的 DTO、handler、metadata、idempotency 和 error mapping。
- truth、scope、fact、manifestation、trace、outbox、projection、cursor、reference、handoff 的持久化和一致性契约。
- 配置、外部 resolver / bus / observability / archive adapter、审计埋点和测试切口。

这些不是概要设计缺口,而是详细设计必须完成的实现级契约。

### 3.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义？

不能在详细设计中重新定义的结论包括:

- `L1-conversation` 是平台对话真相仓 / Conversation truth center。
- Chat UI、Workspace 聚合视图、Runtime 推理过程、Bridges 外部平台协议、Governance 裁决、Artifact 正文、Identity 生命周期、Observability / Archive 全局存储都不属于本仓 truth。
- Conversation 只保存本仓 truth、引用、快照、显化记录、派生状态和追溯 / 交接记录,不得保存来源仓正文、runtime 推理过程、tool 调用、bridge message body 或 secret。
- 查询、订阅、变化感知、派生输出和下游消费必须受 participant scope 与 visibility scope 约束。
- 投影、索引、检索、变化游标、reference refresh、outbox publish、trace handoff 和 archive handoff 都不能反写 Conversation truth。
- `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 的已收稳契约只能被承接,不能在本仓详细设计中重新定义。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档主线 | 仍以 Conversation / Turn / participant、StreamEvents、AG-UI、event-to-turn mapping 为第一层结构 | 与新版 `02-概要设计.md` 的 truth / fact / scope / manifestation / trace / projection 主线冲突 |
| 旧版 §3 / §5 | 按“对话空间与参与者、Turn 事实流、事件转对话、实时推送、检索投影”组织 | 旧模块边界不能直接承接新版 8 个主要组成部分 |
| 旧版对象定义 | `Turn`、`TurnKind`、`TurnPayload`、`StreamEvent`、`EventTurnMapping` 等被写成核心对象 | 新版概要设计已把 Turn / StreamEvents / AG-UI 降级为历史线索或下游协议候选 |
| 旧版处理流 | `PostTurn`、`AppendSystemTurnFromEvent`、`StreamConversationEvents` 是主线 | 新版接口主线已改为 `AppendConversationFact`、`ManifestExternalFact`、authorized query、consumer、outbox 和 handoff job |
| 旧版持久化 | 围绕 `turns`、`conversation_summaries` 等旧表草案 | 与新版 Conversation fact、scope、manifestation、trace、reference、projection、outbox、handoff 状态机不闭合 |
| 当前新版 `02-概要设计.md` | 已收稳详细设计承接清单,但旧 `03` 未同步 | 需要按 SOP 重写详细设计,不是局部修补 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 旧 `02` 和旧 Turn / StreamEvents / AG-UI 口径 | 新 `00/01/02` 需求、架构、概要设计 | 上游已经重建并收稳 |
| 主组织轴 | 按旧功能块和粗略目录组织 | 按模块实现契约组织 | 对齐新版详细设计书写规范 |
| Step 产物 | 无详细设计工作台 | 新建 `03_ddd_calibration_flow.md` 和 Step 中间产物 | 保持可追溯和可 review |
| 正式 `03` 写入方式 | 直接扩写旧文档 | Step 1~18 逐步收敛,Step 19 统一重写 | 避免新旧口径混合 |
| 未决项处理 | 散落或隐含 | 输入不足风险和待确认事项显式收纳 | 防止实现阶段脑补 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A:在旧版 `03` 上局部修补 | 改动少 | 旧主线已经偏离新版 `02`,容易残留 Turn / StreamEvents / AG-UI 旧口径 | 不采用 |
| 方案 B:按新版详细设计 SOP 建工作台,逐 Step 生成中间产物,最后统一重写正式 `03` | 可追溯、可 review、能防止主语漂移 | 需要更多步骤 | 采用 |
| 方案 C:直接一次性重写正式 `03` | 看似快 | 长文档容易遗漏,且违反中间产物门禁 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` §2 / §7 / §9 | `L1-conversation` 是平台对话真相仓,核心闭环包括空间与范围、事实沉淀、授权消费、跨域显化和历史追溯 | 模块边界、对象、接口、处理流和测试切口必须覆盖核心闭环 |
| `00-需求文档.md` §10 / §11 | 对话事实、scope、reference、snapshot、projection、forbidden body 和数据归属规则 | policy、repository、adapter、snapshot store、projection、outbox 和 negative tests |
| `00-需求文档.md` §12 / §13 | 接口依赖、非功能要求、安全与可追溯 | Command / Query / Event / Job DTO、port / adapter、trace、redaction、handoff |
| `01-架构设计.md` §3 / §4 | Conversation truth center 职责边界和边界红线 | 模块布局和对象归属不能重新切分 |
| `01-架构设计.md` §5 / §8 / §9 | 系统上下文、依赖方向、数据所有权和一致性 | crate dependency、runtime dependency、event collaboration、repository、projection、outbox 和 handoff |
| `01-架构设计.md` §10 / §11 / §12 | 通信方式、技术选择和取舍 | handler、consumer、job、port / adapter、config、observability 和 audit 契约 |
| `02-概要设计.md` §4 | 代码主体框架和实现分层 | 实现单元、文件布局和模块依赖图 |
| `02-概要设计.md` §5 | 8 个主要组成部分及职责边界 | 模块实现契约主轴 |
| `02-概要设计.md` §6 | 关键对象轮廓 | 完整 Rust struct / enum / value object 契约 |
| `02-概要设计.md` §7 | API / 接口骨架 | 协议 schema、DTO、handler、错误映射 |
| `02-概要设计.md` §8 | 关键处理流 | 函数级调用链、事务边界、port 调用和失败分支 |
| `02-概要设计.md` §9 | 状态定义与状态流转 | 状态转换矩阵、状态守卫函数和非法迁移错误 |
| `02-概要设计.md` §10 | 异常与边界场景 | error enum、错误映射、恢复口径和 negative tests |
| `02-概要设计.md` §11 | 配置影响轮廓 | runtime config、loader、validator、builder 和 adapter / job config |
| `02-概要设计.md` §12 | 详细设计承接清单 | 本轮详细设计的直接执行门禁 |
| `02-概要设计.md` §13 | 设计风险与待确认事项 | Step 18 集中收纳,不得在前序 Step 写死 |

### 7.2 本文不再回答

- 不重新回答 `L1-conversation` 为什么单独成仓。
- 不重新定义需求目标、用户故事、功能需求、业务规则、验收标准和追溯矩阵。
- 不重新定义系统上下文、限界上下文、依赖方向、数据所有权、通信方式和技术选型。
- 不重新定义 `L0-core` 的共享 ID、ActorRef、TraceContext、Error、metadata、evidence、配置和报告口径。
- 不重新定义 `L0-bus` 的事件发布、订阅、重试、死信、replay、tap 和报告证据口径。
- 不重新定义 `L0-sdk` 的默认 client / integration access 和 SDK consumer 边界。
- 不重新定义 `L1-identity` 的成员、AI member、system actor 和 actor 引用来源。
- 不把 Chat UI、Workspace 聚合、Runtime 推理、Bridges 外部平台协议、Governance 裁决、Artifact 正文、Identity 生命周期、Observability / Archive 全局存储写成 Conversation truth。
- 不在详细设计中改变概要设计已经收稳的对象、接口、处理流和状态机主语。

### 7.3 本文必须回答

- `L1-conversation` 目标仓的实现单元、crate / package / module / file 布局如何组织。
- 每个模块包含哪些对象、trait、adapter、repository、error 和测试切口。
- `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`CrossDomainManifestation`、`ConversationTraceContext`、`ConversationOutboxRecord`、handoff record 等对象如何落成 Rust 契约。
- Command / Query / Consumer / Event / Job 如何落成 DTO、handler、schema、metadata、idempotency 和错误映射。
- 每个关键处理流如何落成函数级调用链、事务边界、repository / port 调用和失败分支。
- 15 组状态机如何落成状态 enum、转换矩阵、状态守卫函数和非法转换错误。
- truth、scope、fact、manifestation、trace、reference、projection、cursor、outbox、handoff 如何持久化并保持一致。
- runtime config、adapter config、job config、policy config 和禁止配置化边界如何实现。
- 可观测性、审计埋点、测试切口和实施计划承接清单如何定义。

### 7.4 输入不足风险清单

| 缺失项 / 未定项 | 影响 | 当前处理 |
|---|---|---|
| 来源仓 resolver / event / snapshot 的字段级契约是否已与相邻仓完全一致 | 影响 external ref、snapshot、来源 event consumer、reference refresh job | 不阻塞 Step 1;Step 6 / Step 7 / Step 8 逐字段对齐,发现冲突回退概要设计 |
| projection / search / cursor 的具体技术产品是否在详细设计阶段确定 | 影响 projection store、query fallback 和 rebuild job | 不阻塞 Step 1;详细设计定义 port / adapter / store contract,不提前选产品 |
| `04-配置说明` 是否独立成文及哪些运行形态需要配置 | 影响 Step 14 配置绑定和后续配置设计 | 不阻塞 Step 1;Step 14 只定义实现契约,配置 JSON 留给 `04-配置说明` |
| consistency validation 是否永远只诊断 | 影响 validation job、diagnostic marker、truth / projection 对账 | 当前只诊断不修复;任何自动修复或修复命令必须回退概要设计 |
| handoff payload 脱敏材料边界细分 | 影响 trace / archive handoff ports 和 payload ref 类型 | 不阻塞 Step 1;Step 6 / Step 7 / Step 15 细分 ref 类型,不得允许 forbidden body |
| actor 展示快照是否由 identity resolver 统一供给 | 影响 participant scope、fact source、external reference projection、identity event consumer | 不阻塞 Step 1;详细设计需与 `L1-identity` 契约核对 |
| 旧 `03-详细设计.md` 与新版 `02` 不一致 | 直接影响正式详细设计可信度 | Step 19 删除旧文件并重建 |

---

## 8. 回填草稿

正式 `03-详细设计.md` §1 “与上游文档的关系声明”应摘录并整理:

- 本文件 §7.1 上游关系映射表。
- 本文件 §7.2 本文不再回答。
- 本文件 §7.3 本文必须回答。

正式 `03-详细设计.md` §17 “风险与待确认事项”应在 Step 18 汇总本文件 §7.4 的输入不足风险,不在 Step 1 直接写成最终风险章。

---

## 9. 待确认事项

- 无阻塞进入 Step 2 的待确认事项。
- 来源仓字段级契约、projection / search / cursor 技术承载、配置说明独立成文、consistency validation 修复边界、handoff payload 脱敏类型和 actor 展示快照来源继续作为后续 Step 输入,不得在 Step 1 写成稳定实现契约。

---

## 10. 进入下一步条件

- [x] 已明确详细设计承接哪些需求、架构和概要设计结论。
- [x] 已确认新版概要设计足以作为详细设计输入。
- [x] 已明确旧 `03-详细设计.md` 只作为问题诊断材料。
- [x] 已识别不阻塞 Step 2 但需要后续收口的输入不足风险。
- [x] 已足以进入 Step 2 “明确本轮实现范围和非范围”。
