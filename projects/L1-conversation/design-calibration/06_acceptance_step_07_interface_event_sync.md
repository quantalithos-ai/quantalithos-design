# L1-conversation 06 验收标准 Step 7: 定义接口、事件与跨仓同步验收

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §7 接口、事件与跨仓同步验收
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 定义接口、事件与跨仓同步验收 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_07_interface_event_sync.md` |

本步定义 Command、Query、Inbound Consumer、Outbound Event、Operations Job 和跨仓接缝如何验收。状态机、事务、幂等和并发副作用留给 Step 8。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §12 | 对外能力接口与外部依赖边界 | 作为接口和依赖类型来源 |
| `01-架构设计.md` §8 | 依赖方向、依赖裁剪和禁止依赖 | 作为跨仓同步裁决来源 |
| `02-概要设计.md` §7 | Command、Query、Inbound / Outbound / Job 骨架 | 作为协议覆盖清单来源 |
| `03-详细设计.md` §7 / §8 / §15 | 协议总表、字段闭环、flow 和接口测试切口 | 作为正式协议名称来源 |
| `05-测试方案.md` §6 / §9 / §13 | P0 用例、suite、EV 和证据路径 | 作为证据来源 |
| `06_acceptance_step_06_data_architecture_redlines.md` | 数据边界和架构红线 | 作为接口失败红线来源 |

## 3. SOP 问题回答

### 3.1 每个 P0 Command / Query 如何验收?

Command 必须证明 route / DTO / metadata / idempotency / actor context 能构造正式 command,并由 application flow 返回 result / receipt / error。Query 必须证明 request、consumer、page、consistency 和 visibility 闭合,且 query 不写 truth。所有 Command / Query 都必须使用 `03-详细设计.md` §7 的正式名称,不得回流旧 Turn / StreamEvents 口径。

### 3.2 每个 P0 Event 如何证明可消费 / 可重放?

Inbound event 必须证明 envelope、event id、source ref、idempotency key 和 payload ref 闭合,duplicate 不重复写 truth,invalid envelope 进入 quarantine,forbidden body 不入库。Outbound event 必须证明只来自已提交 truth、projection state 或 handoff intent,且 payload 是 ref / marker,不含正文。可重放性通过 outbox publish / retry / rerun、consumer duplicate 和 projection stale 证据证明。

### 3.3 每个 P0 Job 如何证明幂等和恢复?

Job 必须有 `job_run_id`、scope、metadata、idempotency key、receipt / report ref 和 failed marker。重跑不得重复生成 truth,partial failure 不得污染成功项,source missing / resolver failure / publisher failure 必须保留 retry、failed、stale、unresolved 或 issue marker。

### 3.4 跨仓同步成功标准是什么?

本轮跨仓同步成功不是“真实下游全部上线”,而是本仓正式接缝可审计: L0-core 编译期契约可用,L0-bus 事件协作可通过 outbox / fake publisher 验证,Identity / Work / Governance / Artifact / Runtime / Bridges 输入只以 ref / safe snapshot / marker 进入,SDK / Chat / Workspace / Observability / Archive 只能授权消费或接收 handoff ref。

### 3.5 下游未就绪时如何验接缝?

下游未就绪时,使用 fake / controlled adapter、fixture replay、contract roundtrip、outbox sink、handoff fake 和 report evidence 验证本仓接缝。未就绪风险进入 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md`,不得把 fake success 宣称为 production-like success。

### 3.6 跨仓验收项分别属于哪些依赖类型?

`L0-core` 是编译期依赖;`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L0-sdk`、`L5-chat`、`L1-workspace`、`L2-runtime`、`L6-bridges` 是运行期或运行期 / 事件协作依赖;`L0-bus`、部分来源仓变化、Observability / Archive handoff 属于事件协作依赖。

### 3.7 每类依赖应使用什么验收证据?

编译期依赖用 package dependency / contract compile / DTO roundtrip / gate results;运行期依赖用 API / adapter / resolver / fake consumer / controlled seam;事件协作依赖用 publish / subscribe / replay / projection / outbox / consumer evidence。不得误要求所有相邻仓源码直接依赖或完整实现。

### 3.8 每个验收项能否回指正式协议字段、状态名和测试证据?

能。本步每个 `AC-SYNC-*` 都必须回指 `03-详细设计.md` §7 协议总表、§8 flow、§15 接口测试切口,以及 `05-测试方案.md` 中的 `TC-CONV-*`、`EV-CONV-*` 和 `reports/runs/<run_id>/evidence-index.md`。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧接口主线容易继承 Turn / StreamEvents / AG-UI | 不继承旧接口主语 |
| `03-详细设计.md` §7 | 已列 10 Command、11 Query、6 Consumer、9 Event、9 Job | 本步转成协议族验收门禁 |
| `01-架构设计.md` §8 | 已区分编译期、运行期、事件协作依赖 | 本步转成跨仓依赖类型表 |
| `05-测试方案.md` §6 | 已有接口相关 TC,但未映射到 06 | 本步建立 AC 到 TC / EV 的追溯 |
| 下游实现状态 | 当前不要求全部真实下游完成 | 本步定义 fake / controlled seam 验收方式 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 接口验收 | 容易泛写“API 可用” | 按 Command / Query / Consumer / Event / Job 协议族裁决 |
| 跨仓依赖 | 容易要求源码直接依赖 | 区分编译期、运行期和事件协作依赖 |
| 下游未就绪 | 容易阻塞 P0 或伪成功 | 用 controlled seam 验接缝,风险进入 acceptance |
| 事件验收 | 只写 publish 成功 | 同时裁决 schema、ref-only payload、retry、rerun 和 replay |
| 证据引用 | 泛写测试报告 | 绑定 TC、EV、gate 和 `reports/runs/<run_id>/evidence-index.md` |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否逐条为 45 个 flow 单独建 AC | 每个 flow 一条 AC | 按协议族建 AC,覆盖清单列出全部协议 | B | 保持可 review,同时不漏协议族 |
| 下游未就绪是否阻塞 P0 | 阻塞 | controlled seam 通过即可 P0,真实下游进风险 | B | Step 2 已限定只验本仓接缝 |
| L0-bus 是否写成 Cargo 依赖 | 是 | 事件协作依赖,用 outbox / publisher / replay 证据 | B | 架构明确 bus 不拥有 Conversation truth |
| 运行期依赖是否要求真实服务 | 要求真实服务 | P0 使用 fake / controlled adapter,真实服务为 P1/P2 | B | 当前 P0 不宣称 production-like |
| 接口失败是否全部一票否决 | 全部 veto | P0 协议、redaction、authorization、truth boundary 失败 veto;P1 下游未就绪可风险接受 | B | 区分本仓 P0 与外部 readiness |

## 7. 结构化中间产物

### 7.1 接口、事件与跨仓同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| AC-SYNC-001 | 10 个 Command API | 运行期入口 | HTTP / service facade -> application flow | Command request 必填字段、metadata、actor、idempotency 闭合;成功返回 result / receipt;失败映射正式 error;必要 outbox / audit intent 可追溯 | Command 缺失;required 字段漂移;缺 idempotency 仍写 truth;失败伪成功;旧 Turn / StreamEvents 名称回流 | `TC-CONV-SPACE-*`;`TC-CONV-FACT-*`;`TC-CONV-MAN-*`;`TC-CONV-HANDOFF-*`;`EV-CONV-TRUTH-001`;`EV-CONV-FACT-001`;`EV-CONV-MAN-001`;`EV-CONV-HANDOFF-001` |
| AC-SYNC-002 | 11 个 Query API | 只读消费边界 | query request -> read model / projection / visibility guard | Query request、consumer、page、consistency 闭合;visibility 生效;stale / failed marker 可见;query no-write | Query 写 truth;未授权读到 hidden fact;stale 当 fresh;search 返回 payload body | `TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`EV-CONV-AUTH-001` |
| AC-SYNC-003 | 6 个 Inbound Event Consumer | 事件协作依赖 | source event fixture / replay -> consumer flow | envelope、event id、source ref、idempotency key、payload ref 闭合;duplicate 不重复 truth;invalid envelope quarantine;forbidden body rejected | duplicate 追加新 truth;invalid envelope 写 truth;source body / platform body 入库;缺 source ref 仍 accepted | `TC-CONV-CONSUMER-*`;`TC-CONV-MAN-*`;`EV-CONV-CONSUMER-001`;`EV-CONV-MAN-001`;`EV-CONV-REDACTION-001` |
| AC-SYNC-004 | 9 个 Outbound Event / Outbox | 事件协作依赖 | committed truth / projection state / handoff intent -> outbox publisher | event 只来自已提交 truth、projection state 或 handoff intent;payload ref / marker-only;event id stable;publish retry / failed 可重跑 | 未提交 truth 发布;event 含正文;publish failure 回滚 truth;rerun 生成 duplicate downstream record | `TC-CONV-OUTBOX-*`;`TC-CONV-HANDOFF-*`;`EV-CONV-OUTBOX-001`;`EV-CONV-HANDOFF-001` |
| AC-SYNC-005 | 9 个 Operations Job | 运行期入口 / 后台承接 | scheduler / CLI / worker -> job flow | job input 含 `job_run_id`、scope、metadata、idempotency;receipt / report ref 可定位;partial failure 有 failed / stale / issue marker;rerun 不改写 truth | job 无 receipt;source missing 伪成功;partial failure 污染成功项;rebuild / consistency 自动修 truth | `TC-CONV-DERIVED-*`;`TC-CONV-CURSOR-001`;`TC-CONV-CONSISTENCY-001`;`TC-CONV-OUTBOX-*`;`EV-CONV-DERIVED-001`;`EV-CONV-OUTBOX-001` |
| AC-SYNC-006 | `L0-core` 共享契约 | 编译期依赖 | Cargo path dependency / contract compile / DTO roundtrip | shared ID、ActorRef、TraceContext、Error、metadata 可编译和 roundtrip;本仓不复制核心共享类型为权威 | 本仓重定义 L0-core shared contract;contract compile 失败;metadata / trace 字段漂移 | `contracts_dto_roundtrip`;`EV-CONV-GATE-001`;`reports/runs/<run_id>/gate-results.md` |
| AC-SYNC-007 | `L0-bus` 事件协作接缝 | 事件协作依赖 | outbox record -> fake / controlled publisher / replay sink | outbox 可读、publish retry / failed / published 可审计;真实 bus 未就绪不阻塞 P0;风险记录清楚 | 要求真实 broker 才能 P0;fake publish 被标 production success;publish failure 取消 truth | `TC-CONV-OUTBOX-*`;`EV-CONV-OUTBOX-001`;`EV-CONV-ACCEPT-001` |
| AC-SYNC-008 | Identity / Work / Governance / Artifact / Runtime / Bridges 输入接缝 | 运行期 / 事件协作依赖 | resolver / event fixture / controlled adapter -> ref / snapshot / marker | actor、project、governance、artifact、runtime result、bridge mapped fact 只以 ref / safe snapshot / marker 进入;unresolved / mismatch / quarantine 可追踪 | 来源正文入库;治理 / 产物 / 成员生命周期由本仓裁决;runtime reasoning body 或 bridge platform body 保存 | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`TC-CONV-REDACTION-001`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001`;`EV-CONV-REDACTION-001` |
| AC-SYNC-009 | SDK / Chat / Workspace / Runtime / Observability / Archive 下游消费与交接 | 运行期 / 事件协作依赖 | authorized query / event / handoff ref / fake consumer | 下游只能消费 authorized read model、event ref、cursor、trace handoff ref、archive package ref;不可反写 truth | 下游未就绪被写成 P0 失败;下游 UI / runtime / archive state 反写 Conversation truth;handoff 泄露正文 | `TC-CONV-QUERY-*`;`TC-CONV-HANDOFF-*`;`TC-CONV-OUTBOX-*`;`EV-CONV-AUTH-001`;`EV-CONV-HANDOFF-001`;`EV-CONV-OUTBOX-001` |
| AC-SYNC-010 | 下游未就绪与 controlled seam | 运行期 / 事件协作依赖 | fake adapter / fixture replay / acceptance risk handoff | fake / controlled seam 有 marker;未就绪真实下游进入 `risk-acceptance.md` 或 `open-issues.md`;不得宣称 production-like | fake success 伪装真实集成通过;未就绪风险未记录;真实下游缺失导致本仓 P0 无法裁决 | `TC-CONV-CONFIG-001`;`TC-CONV-REPORT-001`;`EV-CONV-CONFIG-001`;`EV-CONV-ACCEPT-001` |

### 7.2 协议覆盖清单

| 协议族 | 必须覆盖的正式协议 |
|---|---|
| Command | `CreateConversationSpace`;`CloseConversationSpace`;`UpdateParticipantScope`;`UpdateVisibilityScope`;`AppendConversationFact`;`RetractConversationFact`;`ManifestExternalFact`;`CreateReviewAnchor`;`RequestTraceHandoff`;`RequestArchiveHandoff` |
| Query | `GetConversationReadModel`;`ListConversationFacts`;`GetConversationFact`;`GetConversationChangeCursor`;`PollConversationChanges`;`SearchConversationHistory`;`GetCrossDomainManifestation`;`GetConversationTraceContext`;`GetReviewAnchor`;`GetConversationProjectionState`;`GetExternalReferenceProjection` |
| Inbound Event Consumer | `ConsumeWorkContextChanged`;`ConsumeGovernanceFactCommitted`;`ConsumeArtifactFactCommitted`;`ConsumeRuntimeResultCommitted`;`ConsumeBridgeMappedFactReceived`;`ConsumeIdentityActorChanged` |
| Outbound Event | `ConversationSpaceChangedEvent`;`ConversationScopeChangedEvent`;`ConversationFactAppendedEvent`;`ConversationFactRetractedEvent`;`CrossDomainManifestationChangedEvent`;`ConversationChangeAvailableEvent`;`TraceHandoffRequestedEvent`;`ArchiveHandoffRequestedEvent`;`ConversationProjectionStateChangedEvent` |
| Operations Job | `PublishConversationOutbox`;`RebuildConversationReadModels`;`RebuildConversationSearchIndex`;`MaintainConversationChangeCursors`;`RefreshExternalReferenceSnapshots`;`DeliverTraceHandoff`;`DeliverArchiveHandoff`;`ValidateConversationConsistency`;`CleanupExpiredConversationCursors` |

### 7.3 跨仓依赖类型与验收方式映射表

| 依赖类型 | 关联项目 | 本轮验收方式 | 不得要求 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | package dependency、contract compile、DTO roundtrip、gate results | 不得复制 shared contract 为本仓权威 |
| 事件协作依赖 | `L0-bus`、source event fixtures、outbox sink | publish / retry / replay / duplicate / projection evidence | 不得要求真实 broker 或完整 bus 产品行为作为 P0 |
| 运行期依赖 | `L1-identity`、`L1-work`、`L1-governance`、`L1-artifact` | resolver / controlled adapter / safe snapshot / unresolved marker evidence | 不得保存来源正文或裁决来源 truth |
| 运行期 / 事件协作依赖 | `L2-runtime`、`L6-bridges` | result ref / mapped fact ref / quarantine / forbidden body evidence | 不得保存 reasoning body 或 platform body |
| 运行期消费依赖 | `L0-sdk`、`L5-chat`、`L1-workspace` | authorized query、event ref、cursor、fake consumer evidence | 不得要求下游 UI 完整上线或允许反写 truth |
| 运行期 / 事件协作依赖 | `L4-observability`、`L4-archive` | trace / archive handoff ref、retry / failed、redaction evidence | 不得让本仓拥有全局日志或长期归档正文 |

### 7.4 接口失败对最终结论的影响

| 失败范围 | 最终结论影响 |
|---|---|
| AC-SYNC-001~AC-SYNC-005 任一 P0 协议族缺失或证据缺失 | 不通过 |
| AC-SYNC-002 查询写 truth 或绕过 visibility | 一票否决候选,Step 11 汇总 |
| AC-SYNC-003 / AC-SYNC-004 事件含 forbidden body 或未提交 truth 发布 | 一票否决候选,Step 11 汇总 |
| AC-SYNC-006 编译期契约不可用 | 不通过 |
| AC-SYNC-007~AC-SYNC-010 因真实下游未就绪但 controlled seam 通过 | 可风险接受 |
| AC-SYNC-007~AC-SYNC-010 伪装 production-like 或允许反写 truth | 不通过 / 一票否决候选 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §7 时摘录。

```markdown
## 7. 接口、事件与跨仓同步验收

> 校准来源：
> - `design-calibration/06_acceptance_step_07_interface_event_sync.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_07_interface_event_sync.md` 的“接口、事件与跨仓同步验收表”“协议覆盖清单”“跨仓依赖类型与验收方式映射表”和“接口失败对最终结论的影响”小节，了解 Command、Query、Consumer、Event、Job 和跨仓接缝如何形成验收门禁。

本轮接口、事件与跨仓同步验收以 `AC-SYNC-001~AC-SYNC-010` 为裁决入口。Command、Query、Inbound Consumer、Outbound Event 和 Operations Job 必须使用 `03-详细设计.md` §7 / §8 的正式协议名和 flow。每项验收必须绑定 `TC-CONV-*`、`EV-CONV-*` 和 `reports/runs/<run_id>/evidence-index.md`。

跨仓验收必须区分编译期依赖、运行期依赖和事件协作依赖。`L0-core` 用 package dependency / contract compile 证明；`L0-bus` 用 outbox / publisher / replay 证明；来源仓和下游仓用 resolver、controlled adapter、fake consumer、safe snapshot、marker、handoff ref 和风险接受证明。不得要求下游仓完整实现,也不得把 fake success 宣称为 production-like success。
```

## 9. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续必须继续收口:

- Step 8 将本步 Command / Consumer / Job 的状态、副作用、事务、幂等和并发细化。
- Step 10 将本步引用的 EV、report、redaction 和 evidence path 展开为证据门禁。
- Step 11 将查询写 truth、事件含正文、下游反写和 fake-as-production 汇总为一票否决项。
- Step 13 处理真实下游未就绪和 production-like 未验证的风险接受。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 协议族都有门禁 | 通过 | Command、Query、Consumer、Event、Job 均已覆盖 |
| 跨仓依赖类型清楚 | 通过 | 编译期、运行期、事件协作已区分 |
| 下游未就绪处理清楚 | 通过 | controlled seam + risk acceptance,不伪装 production-like |
| 证据来源可追溯 | 通过 | 每项绑定 TC、EV 和 evidence index |
| 可以进入 Step 8 | 通过 | 下一步定义状态机、事务与一致性验收 |
