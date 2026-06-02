# L1-conversation 06 验收标准 Step 6: 定义数据边界与架构红线验收

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §6 数据边界与架构红线验收
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 定义数据边界与架构红线验收 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_06_data_architecture_redlines.md` |

本步把数据所有权、职责边界、依赖方向和禁止事项转成可检查红线。接口、事件、跨仓同步、状态机、事务和证据门禁分别留给 Step 7~Step 10。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §10 / §11 / §14 | 业务规则、数据归属和一票否决项 | 作为红线主来源 |
| `01-架构设计.md` §4 / §8 / §9 / §12 / §15 | 职责边界、依赖方向、数据所有权和架构风险 | 作为架构红线来源 |
| `02-概要设计.md` §5 / §7 / §10 | 组件边界、API 骨架和异常边界 | 作为红线落点来源 |
| `03-详细设计.md` §6 / §7 / §10 / §14 / §15 | 对象、协议、状态、输出安全和测试切口 | 作为正式字段、错误和证据名称来源 |
| `04-配置设计.md` §4 / §7 / §8 / §11 | 禁止配置化、redaction、secret 和失效模式 | 作为配置绕过红线来源 |
| `05-测试方案.md` §6 / §10 / §11 / §13 | 红线用例、专项、缺陷分级和 EV | 作为证据来源 |

## 3. SOP 问题回答

### 3.1 哪些数据不得由本仓保存?

本仓不得保存 Chat UI 展示状态、Workspace 聚合视图、Bridge 平台正文、Runtime memory / reasoning body / tool call body、Governance decision body、Artifact 正文 / 版本 / 证据链、Identity 成员生命周期正文、Observability 全局日志正文、Archive 长期归档包正文、raw secret、raw token、raw payload。

这些对象如需进入对话视野,只能以 ref、safe snapshot、manifestation、redacted marker、handoff ref 或 failure marker 表达。

### 3.2 哪些下游不得反向改写真相?

`L0-sdk`、`L5-chat`、`L1-workspace`、`L2-runtime`、`L6-bridges`、`L4-observability` 和 `L4-archive` 都只能通过正式 Command、Consumer、Query、Event 或 handoff 接缝协作。它们的 UI 状态、聚合视图、runtime 临时上下文、外部平台生命周期、观测日志或归档包不得反向定义 `ConversationSpace`、scope、fact、manifestation 或 trace truth。

### 3.3 哪些 projection / cache 不得反写真相?

`ConversationReadModel`、`SearchIndexProjection`、`ConversationChangeCursor`、`ExternalReferenceProjection`、snapshot、report 和 diagnostics 都是派生、快照、引用或证据材料。它们可以 stale、failed、rebuild 或 expose marker,但不得追加、覆盖、修复、删除或生成 conversation truth。

### 3.4 哪些 P1 能力不得污染 P0?

真实 DB / broker / resolver / handoff、真实跨仓端到端、Chat / Workspace / Bridges 产品体验、Runtime 推理质量、production-like 运维、config center、hot reload、auto repair、生产级容量数字都不得成为 P0 必填入口、P0 schema 字段、P0 配置开关或 P0 通过条件。它们只能作为 P1 / P2 风险、后续专项或 explicit unsupported / fail-fast。

### 3.5 红线失败时是否一票否决?

是。数据归属漂移、授权视野失效、外部正文入库、source truth 被补造、下游或 projection 反写真相、配置绕过红线、fake-as-production、证据中泄露 forbidden body / secret 都不得风险接受。Step 11 会把这些红线汇总为最终一票否决清单。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧稿红线泛化,未按新版数据归属和依赖方向展开 | 不继承旧红线 |
| `00-需求文档.md` §11 | 已明确 truth、snapshot、ref 和 forbidden body | 本步转成数据类别裁决表 |
| `01-架构设计.md` §9 | 已明确数据所有权与一致性策略 | 本步转成架构红线表 |
| `04-配置设计.md` | 已明确配置不得关闭 visibility、redaction、derived read-only | 本步纳入配置绕过红线 |
| `05-测试方案.md` | 已有 redaction、authorization、source isolation 和 path 用例 | 本步绑定 TC / EV 证据 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 红线主语 | 泛写“不得越界” | 按数据归属、授权、来源真相、下游反写、派生反写、配置和 P1 污染拆分 |
| 数据类别 | 未裁决 truth / snapshot / ref / forbidden | 明确 Conversation truth、快照、引用、禁止正文 |
| 下游影响 | 下游消费和反写边界不清 | 下游只能消费 / 协作,不得定义 Conversation truth |
| projection 口径 | 容易被写成第二 truth | 只读、可重建、最终一致、不得反写 |
| 红线失败影响 | 未统一 | 默认不通过,核心红线进入 Step 11 一票否决 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 外部对象进入方式 | 为展示便利复制正文 | 仅 ref / safe snapshot / manifestation / marker | B | 保护来源仓 truth 和数据归属 |
| 下游消费是否可反向定义 truth | 允许 Chat / Workspace / Runtime 影响核心模型 | 只能经正式接缝,不得反写 | B | Conversation 是独立 truth center |
| projection 失败是否可自动修 truth | 自动修复 | 只暴露 stale / failed / issue marker | B | 派生结构不能成为第二 truth |
| 配置是否可关闭红线 | 允许 emergency override | redaction、visibility、truth ownership 不可配置化 | B | 配置不能暗改架构主线 |
| P1/P2 能力是否阻断 P0 | 默认阻断 | 不污染 P0,进入风险接受或 fail-fast | B | 当前 P0 只裁决本仓主线 |

## 7. 结构化中间产物

### 7.1 数据边界与架构红线表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-RED-001 | Conversation 只拥有本仓 truth 数据 | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、fact history、manifestation record、trace context 为本仓 truth;外部对象仅 ref / snapshot / marker | Chat / Workspace / Runtime / Bridges / Governance / Artifact / Identity / Archive 正文或生命周期真相进入 Conversation truth | `TC-CONV-FACT-004`;`TC-CONV-MAN-*`;`EV-CONV-MAN-001`;`EV-CONV-REDACTION-001` |
| AC-RED-002 | forbidden body 不得进入 truth / log / event / report | runtime reasoning body、bridge platform body、artifact body、source body、raw payload 被拒绝、quarantine 或 redacted marker 化 | 任一 forbidden body 进入 fact、trace、outbox、projection、audit、log、artifact 或 report | `TC-CONV-FACT-004`;`TC-CONV-CONSUMER-003`;`TC-CONV-REDACTION-001`;`EV-CONV-REDACTION-001` |
| AC-RED-003 | raw secret / credential 不得进入配置和证据 | 只允许 `SecretRef`、`CredentialRef`、endpoint ref 和 redacted diagnostic ref | raw secret、raw token、private key、raw credential 出现在 config、log、audit、artifact、report 或 handoff | `TC-CONV-CONFIG-001`;`TC-CONV-REDACTION-001`;`EV-CONV-CONFIG-001`;`EV-CONV-REDACTION-001` |
| AC-RED-004 | 授权视野不可被绕过 | Query、search、cursor、trace read、downstream consumption 均受 participant / visibility scope 约束 | 未授权 actor / consumer 读取隐藏 fact;sealed visibility 被扩张;trace / search 泄露不可见内容 | `TC-CONV-SCOPE-002`;`TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`EV-CONV-AUTH-001` |
| AC-RED-005 | source truth isolation 不得被破坏 | Work / Governance / Artifact / Identity / Runtime / Bridges 只以 source ref、safe snapshot、manifestation 或 unresolved / mismatch marker 进入 | resolver unresolved 时补造来源正文;digest mismatch 覆盖 truth;conversation 生成 governance / artifact / identity 正式结论 | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| AC-RED-006 | 下游消费不得反写 Conversation truth | SDK、Chat、Workspace、Runtime、Bridges、Observability、Archive 只能通过正式接缝消费、发布 intent 或 handoff ref | 下游 UI / projection / runtime context / external platform state 直接覆盖 space、scope、fact、manifestation 或 trace truth | `TC-CONV-QUERY-*`;`TC-CONV-OUTBOX-*`;`EV-CONV-AUTH-001`;`EV-CONV-OUTBOX-001` |
| AC-RED-007 | projection / search / cursor / report 不得反写真相 | read model、search index、cursor、consistency report 只读既有 truth,失败暴露 stale / failed / issue marker | query / projection / report 追加业务 fact、修复 truth、覆盖 scope 或把 stale 当 fresh | `TC-CONV-DERIVED-*`;`TC-CONV-CURSOR-001`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-DERIVED-001` |
| AC-RED-008 | 配置不得绕过架构红线 | config validator 拒绝关闭 visibility、redaction、state machine、idempotency、audit、derived read-only 或 path shape | config 允许 non-strict redaction、raw secret、forbidden body、auto repair truth、hot reload 改 runtime graph | `TC-CONV-CONFIG-001`;`TC-CONV-REPORT-001`;`EV-CONV-CONFIG-001` |
| AC-RED-009 | P1 / P2 能力不得污染 P0 主链 | real DB / broker / resolver / handoff、production-like、config center、auto repair、容量数字只作为风险或 unsupported | P1/P2 能力成为 P0 必填配置、P0 DTO 字段、P0 gate 或 P0 通过条件 | scope review;`TC-CONV-CONFIG-001`;`EV-CONV-CONFIG-001`;`EV-CONV-ACCEPT-001` |
| AC-RED-010 | fake / controlled adapter 不得伪装 production success | fake resolver / publisher / handoff 保留 fake marker、unresolved、retry、failed、quarantine 和 redaction 语义 | fake 被标记为真实生产集成通过;fake failure 被吞掉;controlled seam 缺 fake marker | `TC-CONV-CONFIG-001`;`TC-CONV-MAN-002`;`TC-CONV-HANDOFF-002`;`EV-CONV-CONFIG-001`;`EV-CONV-MAN-001`;`EV-CONV-HANDOFF-001` |

### 7.2 数据类别裁决表

| 数据类别 | 本仓口径 | 允许行为 | 禁止行为 |
|---|---|---|---|
| Conversation truth | space、participant scope、visibility scope、fact history、manifestation record、trace context | 由正式 Command、Consumer 或 Job 按设计规则维护 | 被下游、projection、report、config 或外部正文覆盖 |
| 快照 / 投影 | member / project / governance / artifact display snapshot、read model、search projection、cursor | 服务阅读、降级、检索和变化感知,可 stale / rebuild | 冒充 truth、补造来源正文或反写 fact |
| 引用 / marker | external ref、source ref、handoff ref、archive ref、unresolved / mismatch / failed marker | 表达来源、状态、失败和交接关系 | 引用失败时默认成功或复制正文补齐 |
| 禁止正文 | runtime reasoning body、bridge platform body、artifact body、source body、raw payload、raw secret | 不进入本仓;必要时仅记录 redacted evidence | 写入 truth、snapshot、event、audit、log、report、artifact |

### 7.3 红线失败对最终结论的影响

| 失败范围 | 最终结论影响 |
|---|---|
| AC-RED-001~AC-RED-008 任一失败 | 不通过 |
| AC-RED-002 / AC-RED-003 / AC-RED-004 / AC-RED-005 任一失败 | 一票否决候选,Step 11 汇总 |
| AC-RED-006 / AC-RED-007 已造成 truth 改写 | 一票否决候选,Step 11 汇总 |
| AC-RED-009 仅为 P1/P2 未覆盖且未污染 P0 | 可进入风险接受 |
| AC-RED-009 造成 P1/P2 成为 P0 必填入口 | 不通过 |
| AC-RED-010 造成 fake-as-production | 一票否决候选,Step 11 汇总 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §6 时摘录。

```markdown
## 6. 数据边界与架构红线验收

> 校准来源：
> - `design-calibration/06_acceptance_step_06_data_architecture_redlines.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_06_data_architecture_redlines.md` 的“数据边界与架构红线表”“数据类别裁决表”和“红线失败对最终结论的影响”小节，了解本章如何把数据所有权、架构边界和禁止事项转成验收红线。

L1-conversation 只拥有对话空间、参与范围、可见范围、对话事实历史、对话内跨域显化记录和对话追溯上下文。成员、项目、治理、产物、外部平台、runtime、observability 和 archive 等相邻对象只能以 ref、safe snapshot、manifestation、handoff ref 或 marker 进入本仓。

任何 forbidden body、raw secret、source truth 补造、授权绕过、下游反写、projection 反写、配置绕过红线、fake-as-production 或 P1/P2 污染 P0 主链,均不得判定通过。红线失败默认不通过,核心红线由 Step 11 汇总为一票否决项。
```

## 9. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续必须继续收口:

- Step 7 将这些红线映射到 Command、Query、Event、Consumer、Job 和跨仓接缝验收。
- Step 8 将 append-only、query no-write、projection no-write 和 idempotency 进一步收成状态 / 事务 / 一致性门禁。
- Step 10 将 redaction、artifact、report、EV 和 evidence path 展开为可观测性与证据门禁。
- Step 11 将本步一票否决候选项收成最终 veto checklist。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据边界已覆盖 | 通过 | truth、snapshot、ref、forbidden body 已分类 |
| 架构红线已覆盖 | 通过 | source isolation、downstream no-write、projection no-write、config no-bypass 已裁决 |
| 红线可检查 | 通过 | 每项都有通过条件、失败条件和 TC / EV |
| 失败影响已定义 | 通过 | 不通过、风险接受和一票否决候选已区分 |
| 可以进入 Step 7 | 通过 | 下一步定义接口、事件与跨仓同步验收 |
