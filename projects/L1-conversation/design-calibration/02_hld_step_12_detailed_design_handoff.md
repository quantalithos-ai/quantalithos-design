# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

把 Step 4 ~ Step 11 已经收稳的代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响显式列为 `03-详细设计.md` 的输入,防止详细设计重新发明主语、暗改对象边界、改名接口或新增未讨论过的状态。

本步只写概要设计向详细设计交付的稳定输入和继续展开方向。本步不写开发任务、排期、测试用例全集、代码实现指令或未经讨论的新对象 / 新接口 / 新流程 / 新状态。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体框架和实现分层边界 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 8 个主要组成部分、职责和边界 |
| `02_hld_step_06_key_objects.md` | 已完成 | 提供 30 个关键对象、字段骨架、状态集合和函数骨架 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Event 和 Operations Job 骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供关键处理流和对象 / 接口对应关系 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态定义、允许 / 禁止迁移和状态传播关系 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供异常与边界场景口径 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响、禁止配置化边界和详细设计配置契约方向 |

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳，详细设计不能重新发明？

已收稳的代码主体框架包括:

- 业务主要组成部分:Conversation truth core、Space / scope management、Collaborative fact append、Authorized consumption、Cross-domain manifestation、History trace / review、Derived consumption support、Local reference / snapshot / projection support。
- 实现分层:Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Outbox and Handoff。
- Application services:ConversationSpaceCommandService、ParticipantScopeCommandService、VisibilityScopeCommandService、ConversationFactAppendService、ConversationManifestationService、AuthorizedConversationQueryService、ConversationTraceReviewService、ConversationDerivedMaintenanceService。
- Operations jobs:PublishConversationOutbox、RebuildConversationReadModels、RebuildConversationSearchIndex、MaintainConversationChangeCursors、RefreshExternalReferenceSnapshots、DeliverTraceHandoff、DeliverArchiveHandoff、ValidateConversationConsistency、CleanupExpiredConversationCursors。

详细设计可以继续定义 module layout、crate / package、trait、struct、transaction 和 adapter,但不能把业务主语改回旧 `Turn` / `StreamEvents` / AG-UI 主线,也不能让 Chat、Workspace、Runtime、Bridges 或来源仓反向定义 Conversation truth。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入？

已成为详细设计输入的内容包括:

- 30 个关键对象:Step 6 已完成独立定义,包括 truth / state、policy / invariant、projection / read model、reference / snapshot、audit / history / handoff 对象。
- 5 类接口:Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job。
- 4 类通用处理流和 25 个独立处理流:10 个 Command、6 个重点 Query、6 个 Consumer、9 个 Operations Job。
- 15 组状态机:truth、space、participant scope、visibility scope、scope change、fact、receipt、manifestation、reference、projection、cursor、outbox、trace retention、trace handoff、archive handoff。
- 异常口径:写入拒绝 / 隔离、跨仓引用异常、派生读取异常、传播 / 交接异常。
- 配置口径:配置只影响运行装配、adapter、store、job 和 external seam,不得绕过 domain invariant、状态机红线、审计链、事务一致性或安全门禁。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容？

详细设计应继续展开:

- 完整 Rust struct / enum / value object / trait / service / port / repository contract。
- 对象字段全集、字段类型细化、构造规则、成员函数签名和返回类型。
- Command / Query / Event / Job DTO、协议 schema、metadata、幂等键、分页、一致性标记和错误映射。
- Application service 编排、事务边界、unit of work、repository 调用、outbox 写入、并发控制和幂等记录。
- Projection、reference refresh、search、cursor、outbox publish、handoff 和 consistency validation 的实现契约。
- 异常类型、错误码、retry / failed / suppressed / stale / unresolved marker 的实现口径。
- 配置实现契约:RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ConfigError、runtime builder 注入关系。
- 测试矩阵、fixture、状态迁移断言、异常断言、契约测试和验收 evidence 口径。

### 3.4 如果详细设计发现主语需要变更，应回退到哪里修正？

如果详细设计发现需要新增或变更主要组成部分、对象、接口、处理流、状态机、异常口径或配置红线,不能在详细设计中暗改。应按影响范围回退:

- 改主要组成部分或职责边界:回到 Step 5。
- 改对象、字段责任、状态集合或函数骨架主语:回到 Step 6。
- 改 Command / Query / Consumer / Event / Job 名称或输入输出主语:回到 Step 7。
- 改处理流主干、事务内外边界或对象协作:回到 Step 8。
- 改状态集合、允许迁移、禁止迁移或状态传播:回到 Step 9。
- 改异常对状态或处理流的影响:回到 Step 10。
- 改配置影响或禁止配置化边界:回到 Step 11。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约？

详细设计必须承接 Step 11 的配置影响方向:

- Runtime config 边界、loader、validator、error boundary 和 runtime builder 注入。
- inbound adapters、event consumers、repositories、projection stores、outbox publisher、external resolver、bus adapter、trace / archive handoff adapter 的 config contract。
- operations jobs 的 batch / retry / timeout / profile 类配置入口。
- 配置校验失败如何影响启动、adapter 可用性、job 可用性和 degraded marker。
- domain object / policy 不直接读取配置的实现约束。

字段清单、默认值、JSON 示例、环境变量名、密钥名称、部署挂载和 profile 示例继续交给 `04-配置说明`。

### 3.6 哪些未闭环内容不能写入承接清单，而应进入风险与待确认事项？

以下内容不能作为已收稳承接项写入本清单:

- 尚未确认的新对象、新接口、新状态或新处理流。
- 仍需要用户选择的方案分歧。
- 详细设计过程中可能暴露的跨仓契约冲突。
- 依赖上游仓实现状态、实际 adapter 能力或产品选择才能定稿的内容。

这些内容应进入 Step 13 设计风险与待确认事项,而不是伪装成已交付输入。

---

## 4. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| `L1-conversation` 定位为独立 Conversation truth center | 完整领域边界、crate / module 组织、与 Chat / Workspace / Runtime / Bridges / 来源仓的依赖裁剪 |
| 实现分层:Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Outbox and Handoff | Rust module layout、service trait、port trait、repository trait、adapter 装配和依赖注入 |
| `Conversation truth core` | truth aggregate / repository / outbox store / unit of work / transaction boundary / consistency invariant |
| `Space / scope management` | space、participant scope、visibility scope 的完整对象契约、并发版本、scope change history 和权限判断 |
| `Collaborative fact append` | fact append command handler、source ref validation、append receipt、fact history、幂等和撤回实现 |
| `Authorized consumption` | query service、read model、cursor、search result、visibility filtering、fallback 和分页一致性 |
| `Cross-domain manifestation` | external ref、snapshot resolver、manifestation command、digest 校验、unresolved / stale / invalid 处理 |
| `History trace / review` | trace context、review anchor、trace handoff、archive handoff、payload redaction 和 retention 规则 |
| `Derived consumption support` | projection rebuild、search index rebuild、cursor maintenance、consistency validation、projection state implementation |
| `Local reference / snapshot / projection support` | external reference projection、snapshot store、reference refresh job、source resolver adapter 和 degraded view |
| `ConversationTruthState`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`CrossDomainManifestation`、`ConversationProjectionState`、`ReferenceResolutionState` | 完整 enum / struct / value object 定义、字段全集、构造函数、成员函数签名、返回类型和状态迁移 guard |
| `ConversationTruthPolicy`、`VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy`、`TraceRetentionPolicy` | policy 输入输出、规则参数、错误类型、测试断言和不可配置化红线实现 |
| `ConversationReadModel`、`ConversationChangeCursor`、`SearchIndexProjection`、`ChangeCursorProjection`、`ExternalReferenceProjection` | projection schema、read contract、stale / failed / invalidated marker、fallback 和 rebuild 触发 |
| `FactSourceRef`、`ExternalFactRef`、`ExternalFactSnapshot` | reference identity、source version、digest、safe display summary、body exclusion 校验和 resolver contract |
| `ScopeChangeRecord`、`FactAppendReceipt`、`ConversationOutboxRecord`、`ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord` | audit / history / handoff record 完整字段、构造函数、状态函数、evidence ref 和持久化契约 |
| Command API:10 个 P0 Command | DTO schema、handler 签名、metadata、幂等、transaction、domain 调用、outbox 写入、错误映射 |
| Query API:11 个 Query | query DTO、分页、一致性标记、visibility filtering、projection fallback、read-only transaction |
| Inbound Event Consumer:6 个来源事件 consumer | event envelope、idempotency、source version、deferred / duplicate / stale / unresolved 处理 |
| Outbound Event:9 个本仓事件 | event DTO、payload ref、visibility / redaction、outbox publisher contract、bus envelope 映射 |
| Operations Job:9 个后台维护 / 交接 job | job input、JobMetadata、JobRunId、batch、retry、failed marker、run evidence 和调度边界 |
| 通用 Command 写路径 | intake、metadata、idempotency、application service、domain mutation、repository、outbox 同事务写入 |
| 通用授权 Query 读路径 | ActorContext / ConsumerContext、read model / projection、visibility filtering、stale / unresolved marker |
| 通用 Inbound Event Consumer 处理流 | event envelope、source idempotency、reference / snapshot / candidate 更新和 forbidden body 排除 |
| 通用 Operations Job 处理流 | committed truth 输入、projection / handoff / evidence 更新、失败 marker 和禁止业务 fact 创建 |
| Space / scope command 处理流 | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope` 的事务、历史和 outbox |
| Fact command 处理流 | `AppendConversationFact`、`RetractConversationFact` 的 source validation、receipt、trace 和 projection stale |
| Manifestation command 处理流 | `ManifestExternalFact` 的 external ref、snapshot、manifestation、fact 转换和 unresolved / invalid 处理 |
| Trace / review command 处理流 | `CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff` 的 trace / handoff record 实现 |
| Authorized query 处理流 | read model、cursor、search、trace、external reference projection 的 query contract 和 fallback |
| Inbound consumer 处理流 | work、governance、artifact、runtime、bridge、identity event 的本地状态影响和 idempotency |
| Operations job 处理流 | outbox publish、read/search rebuild、cursor maintenance、reference refresh、handoff、validation、cleanup 实现 |
| 15 组状态机 | enum 定义、状态转换函数、允许 / 禁止迁移 guard、状态传播和测试矩阵 |
| 异常与边界场景表 | error type、error mapping、rejected / deferred / quarantined / stale / failed / suppressed marker 和测试断言 |
| 配置影响轮廓 | RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ConfigError、runtime builder 注入 |
| 禁止配置化边界 | validator / runtime builder / policy guard 中的不可配置化检查和配置错误处理 |

---

## 5. 详细设计继续展开方向说明

### 5.1 对象契约继续展开

详细设计应把 Step 6 的对象骨架展开为可落码契约:

- 每个 struct / enum / value object 的完整字段、字段类型、字段作用和不变量。
- 每个状态 enum 的枚举值注释、允许迁移函数和禁止迁移判断。
- 每个成员函数、工厂函数、policy 函数的完整 Rust 签名、参数类型、返回类型和错误类型。
- 每个对象的持久化身份、引用身份、版本 / sequence / digest / timestamp 处理口径。

### 5.2 接口与协议继续展开

详细设计应把 Step 7 的接口骨架展开为协议与应用层契约:

- Command / Query / Event / Job DTO 字段全集、metadata、幂等键、分页和一致性标记。
- handler / service / port trait 的函数签名和返回类型。
- inbound event envelope、outbound event payload ref、bus envelope 映射和 redaction 规则。
- Query 的 visibility filtering、projection freshness marker 和 fallback result contract。

### 5.3 处理流与事务继续展开

详细设计应把 Step 8 的处理流展开为可实现编排:

- application service 的加载顺序、domain 调用顺序、repository 调用和 unit of work 边界。
- truth、history、trace、outbox 同事务写入的精确边界。
- projection、reference refresh、outbox publish、handoff 和 consistency validation 的异步 / 后台边界。
- duplicate、conflict、deferred、retry pending、failed、suppressed 等 marker 的持久化和返回口径。

### 5.4 状态机与异常继续展开

详细设计应把 Step 9 / Step 10 展开为状态矩阵和异常矩阵:

- 每个状态 enum 的正式集合、迁移函数和 guard。
- 每个 Command / Consumer / Job 对状态的触发关系。
- 禁止迁移对应的错误类型、测试断言和审计证据。
- `Quarantined`、`Unresolved`、`Invalid`、`Failed`、`Suppressed`、`Invalidated` 等异常状态的进入条件和恢复边界。

### 5.5 配置实现契约继续展开

详细设计应把 Step 11 展开为配置实现契约:

- Runtime config 边界、loader / validator / runtime builder 分层。
- adapter、repository、projection store、outbox publisher、handoff port、operations job 的 config contract。
- 配置校验失败对启动、adapter 可用性、job 可用性和 degraded marker 的影响。
- 确保 domain object / policy 不直接读取配置。

---

## 6. 概要设计回退规则说明

如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计修正,而不是在详细设计中暗改。

具体回退规则:

| 详细设计发现的问题 | 应回退位置 | 不允许的做法 |
|---|---|---|
| 需要新增 / 删除主要组成部分 | Step 5 | 在详细设计中直接新增业务模块 |
| 需要新增关键对象或改变对象归属 | Step 6 | 在对象实现契约中临时发明 struct / enum |
| 需要改接口名称、输入输出主语或接口类别 | Step 7 | 在 protocol / handler 中自行改名或拆分 |
| 需要改变处理流主干或事务内外边界 | Step 8 | 在 service 编排中暗改写路径或后台边界 |
| 需要新增状态、删除状态或改变迁移方向 | Step 9 | 在 enum / state function 中自行扩展状态机 |
| 需要改变异常对状态或处理流的影响 | Step 10 | 在 error handling 中自行把异常改成成功 / retry / ignore |
| 需要让配置影响新的边界或放开禁配红线 | Step 11 | 在 RuntimeConfig 中加入绕过边界的开关 |
| 需要新增尚未讨论的跨仓依赖 | Step 1 / Step 3 / 架构设计 | 在详细设计中直接引入新编译依赖或新 truth owner |

---

## 7. 当前文档问题诊断与修正结果

| 诊断项 | 修正前风险 | 本步修正 |
|---|---|---|
| 概要设计到详细设计输入不显式 | 详细设计可能重新发明对象、接口或状态 | 用承接清单表固定已收稳输入 |
| 详细设计职责容易过宽 | 可能把配置、测试、实施或新方案讨论混入详细设计 | 明确详细设计只继续展开字段、协议、函数、事务、异常和测试契约 |
| 主语变更缺少回退规则 | 详细设计可能暗改概要结论 | 单列回退规则表 |
| 配置影响可能被遗漏 | 详细设计可能临时补 RuntimeConfig 字段 | 将 Step 11 配置影响纳入承接清单 |
| 未闭环内容可能被当作已收稳 | 风险和待确认项被伪装成设计输入 | 明确未闭环内容进入 Step 13 |

---

## 8. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否使用详细设计承接清单表 | 通过 | §4 使用规范要求的两列表 |
| 是否只写 Step 4 ~ Step 11 已收稳结论 | 通过 | 未新增未经讨论的新对象、新接口、新流程或新状态 |
| 是否明确详细设计继续展开方向 | 通过 | §5 覆盖对象、接口、处理流、状态机、异常和配置 |
| 是否明确回退规则 | 通过 | §6 明确主语变更必须回退概要设计 |
| 是否避免开发任务和排期 | 通过 | 未写实施任务、排期或代码实现指令 |
| 是否避免测试用例全集 | 通过 | 只说明测试矩阵和断言方向,未展开测试用例全集 |

---

## 9. 回填草稿

正式 `02-概要设计.md` §12 可以按以下结构回填:

```text
## 12. 详细设计承接清单

### 12.1 详细设计承接清单表
摘录 `design-calibration/02_hld_step_12_detailed_design_handoff.md` §4。

### 12.2 详细设计继续展开方向
摘录 `design-calibration/02_hld_step_12_detailed_design_handoff.md` §5。

### 12.3 概要设计回退规则
摘录 `design-calibration/02_hld_step_12_detailed_design_handoff.md` §6。
```

回填时必须在 §12 开头列出本章引用来源:

- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`
- `design-calibration/02_hld_step_11_configuration_impact.md`
- `design-calibration/02_hld_step_12_detailed_design_handoff.md`

---

## 10. 待确认事项

当前 Step 12 无阻塞性待确认事项。

后续 Step 13 需要继续确认:

- 哪些跨仓契约、adapter 能力、配置落地或详细设计展开风险仍未闭环。
- 哪些内容不能作为已收稳输入,必须作为设计风险或待确认事项写入正式概要设计。
- 是否存在需要在 Step 14 正式文档整理前回补 Step 4 ~ Step 12 的缺口。

---

## 11. 进入下一步条件

Step 12 已满足进入 Step 13 的条件:

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计应继续展开哪些字段、协议、函数、事务、异常、配置和测试契约。
- 已明确发现主语变更时必须回退概要设计。
- 未新增未经讨论的新对象、新接口、新流程或新状态。
