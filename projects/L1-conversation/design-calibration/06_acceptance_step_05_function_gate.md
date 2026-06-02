# L1-conversation 06 验收标准 Step 5: 定义功能验收门禁

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §5 功能验收门禁
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 定义功能验收门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_05_function_gate.md` |

本步把 `FR-CONV-001~008` 和主要处理流转成可裁决功能验收门禁。数据边界、架构红线、接口同步、事务一致性、非功能和证据门禁分别留给 Step 6~Step 10,本步不提前合并。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §7 / §9 / §14 | 核心能力闭环、`FR-CONV-001~008` 和需求验收方向 | 作为功能门禁主来源 |
| `02-概要设计.md` §7 / §8 | Command、Query、Consumer、Job 骨架和处理流概要 | 作为功能场景分组来源 |
| `03-详细设计.md` §7 / §8 | 正式协议、处理流、状态副作用和对象契约 | 作为通过 / 失败条件正式名称来源 |
| `05-测试方案.md` §5 / §6 / §13 | TC、EV、suite、report 和 evidence path | 作为证据来源 |
| `06_acceptance_step_02_scope.md` | P0 / P1 / P2 范围和功能边界 | 限定功能门禁裁决范围 |
| `06_acceptance_step_04_entry_exit.md` | 进入 / 退出和三值结论口径 | 作为功能失败对最终结论影响来源 |

## 3. SOP 问题回答

### 3.1 每个 P0 功能的通过条件是什么?

`FR-CONV-001~005` 必须全部通过,才能判定 Conversation truth center 的核心闭环成立。通过条件必须同时覆盖: space / participant scope / visibility scope 可建立和维护;conversation fact 可 append / retract 且有 receipt、trace、outbox;authorized query 只返回可见事实且 query no-write;cross-domain manifestation 只保存 ref / safe snapshot / marker;review anchor、trace handoff 和 archive handoff 可追溯且不保存正文。

### 3.2 每个 P0 功能的失败条件是什么?

任一核心功能出现以下情况即失败: 正式对象或状态缺失;非法状态迁移成功;缺幂等键仍写入 truth;重复 / 冲突输入形成互相矛盾事实;query 写 truth;未授权 consumer 读到隐藏事实;cross-domain manifestation 补造来源 truth;trace / archive handoff 保存正文或失败时回滚 fact truth。

### 3.3 证据来自哪些测试用例或报告?

证据来自 `TC-CONV-*` 和 `EV-CONV-*`,统一经 `reports/runs/<run_id>/evidence-index.md` 追溯。功能门禁不直接引用 raw log,但可要求对应 EV 页面存在于 `reports/runs/<run_id>/evidence/EV-CONV-*.md`,并由 `EV-CONV-GATE-001` 汇总 suite 状态。

### 3.4 哪些 P1 功能只做后置边界验收?

真实 DB / broker / resolver / handoff 产品行为、真实跨仓端到端、Chat UI / Workspace / Bridges 体验、Runtime 推理质量、production-like 运维、生产级容量数字不作为本步 P0 功能通过条件。它们必须进入 Step 13 风险接受或后续专项。

`FR-CONV-006~008` 属于外围增强能力,本步只裁决它们的 P0 最小切口: derived read-only、authorized refs-only search、cursor no regression、outbox / change awareness 不重复、不改写 truth。完整产品体验不在本轮 P0 功能门禁内。

### 3.5 哪些功能失败会导致总体不通过?

`AC-FUNC-001~005` 任一失败直接导致总体不通过。`AC-FUNC-006~008` 如果失败表现为 query / projection 反写真相、授权绕过、cursor 倒退、outbox duplicate、证据无法追溯或 fake-as-production,也导致总体不通过；如果只是 P1/P2 外围体验不足且 P0 truth 不受影响,只能进入有条件通过风险接受。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧功能主线容易回到 Turn、StreamEvents、UI 消息和旧 projection | 不继承旧主线 |
| `00-需求文档.md` §9 | 已定义 `FR-CONV-001~008`,但尚未形成可裁决 AC | 本步转成 `AC-FUNC-001~008` |
| `03-详细设计.md` | 已有正式协议和 flow,但验收门禁尚未按功能分组 | 本步抽取功能级通过 / 失败条件 |
| `05-测试方案.md` | 已有 TC / EV,但 `06` 尚未映射 | 本步建立功能 AC 到 TC / EV 的映射 |
| `FR-CONV-006~008` | 外围增强容易被误写成完整产品体验 | 本步只裁决 P0 最小切口和不破坏 truth 的边界 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 功能验收主语 | 旧 conversation / turn / stream 可用 | Conversation truth center 八组功能门禁 |
| 功能 ID | 需求 FR 未转成 AC | `AC-FUNC-001~008` 稳定编号 |
| 通过条件 | 容易写“功能可用” | 每项写正式对象、状态、flow 或副作用 |
| 失败条件 | 旧稿缺少可判定失败 | 每项写导致不通过的具体条件 |
| 证据来源 | 泛写测试报告 | 绑定 TC、EV 和 `reports/runs/<run_id>/evidence-index.md` |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| `FR-CONV-006~008` 是否等同核心闭环 | 全部当 P0 核心 | 区分外围增强与 P0 最小切口 | B | 需求和测试方案已区分核心闭环与外围增强 |
| 功能门禁是否合并数据红线 | 本步直接写红线全集 | 本步只写功能门禁,红线留 Step 6 / Step 11 | B | SOP 要求逐 Step 独立裁决 |
| AC 编号是否带项目名前缀 | 使用 `AC-CONV-FUNC-*` | 使用标准 `AC-FUNC-*` | B | 书写规范和已完成仓库采用 `AC-FUNC-001` 格式 |
| 是否把真实外部服务作为 P0 功能 | 是 | 否,只验 controlled seam 和本仓语义 | B | 当前 P0 不依赖真实生产集成 |
| P0-supporting 失败如何处理 | 一律不通过 | 判断是否破坏 P0 truth / 授权 / 证据,否则风险接受 | B | 避免外围体验不足污染核心 P0,同时保留红线 |

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-FUNC-001 | 对话空间与参与范围能力 | P0 | `CreateConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope` 可形成 `ConversationSpace`、`ParticipantScope`、`VisibilityScope`;合法更新生成 scope change 与 outbox;非法迁移被拒绝 | space / scope 缺失;sealed visibility 扩张成功;关闭后重开成功;无 audit / outbox 证据 | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*`;`EV-CONV-TRUTH-001` |
| AC-FUNC-002 | 协作事实追加沉淀能力 | P0 | `AppendConversationFact` 和 `RetractConversationFact` 形成 append-only fact history、receipt、trace context 和 outbox;重复同 digest 返回已有结果;冲突被拒绝 | fact 被覆盖或散落;缺幂等键仍写入;同 key 不同 digest 不冲突;撤回抹除 trace | `TC-CONV-FACT-*`;`TC-CONV-TX-001`;`EV-CONV-FACT-001` |
| AC-FUNC-003 | 授权视野消费能力 | P0 | `GetConversationReadModel`、`ListConversationFacts`、`GetConversationFact`、`PollConversationChanges` 只返回 visibility 允许的 fact / marker;query 不写 truth | 未授权读到隐藏 fact;query 追加或修写真相;stale / failed projection 被当 fresh | `TC-CONV-QUERY-*`;`EV-CONV-AUTH-001` |
| AC-FUNC-004 | 跨域事实引用显化能力 | P0 | `ManifestExternalFact` 和 inbound consumers 只以 ref、safe snapshot、manifestation、unresolved 或 mismatch marker 承接外部事实;不补造来源 truth | 来源不可解析仍生成来源正文;digest mismatch 覆盖旧 truth;inbound invalid envelope 写 truth | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| AC-FUNC-005 | 对话历史追溯与复盘能力 | P0 | `CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff`、handoff jobs 可生成 trace / review / archive ref,失败进入 retry / failed 且不回滚 fact truth | review anchor 不可追溯;handoff 保存正文;handoff 失败回滚 fact;archive success 保存 package body | `TC-CONV-TRACE-001`;`TC-CONV-HANDOFF-*`;`EV-CONV-HANDOFF-001` |
| AC-FUNC-006 | 对话索引 / 投影维护能力 | P0-supporting | `RebuildConversationReadModels`、`RebuildConversationSearchIndex`、`ValidateConversationConsistency` 只从既有 truth 重建派生结果;失败暴露 stale / failed / issue marker | rebuild 生成新业务 fact;consistency job 自动修写真相;failed marker 缺失导致 query 误判 | `TC-CONV-DERIVED-*`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-DERIVED-001` |
| AC-FUNC-007 | 长历史检索与定位能力 | P0-supporting | `SearchConversationHistory` 只返回授权 refs / fragments;`MaintainConversationChangeCursors` 保证 cursor 前进且不倒退;不可恢复 cursor 明确失败 | search 返回 payload body;未授权结果可见;cursor sequence regression;invalid cursor 被静默接受 | `TC-CONV-SEARCH-001`;`TC-CONV-CURSOR-001`;`EV-CONV-AUTH-001`;`EV-CONV-DERIVED-001` |
| AC-FUNC-008 | 对话变化及时感知能力 | P0 | `ConversationChangeAvailableEvent`、`PublishConversationOutbox`、`PollConversationChanges` 可让消费方基于 ref / marker 感知变化;publish retry / rerun 不重复 | outbox publish 生成 duplicate;publish failure 改写 truth;change event 含正文;poll 触发隐式 fact write | `TC-CONV-OUTBOX-*`;`TC-CONV-QUERY-004`;`EV-CONV-OUTBOX-001`;`EV-CONV-AUTH-001` |

所有功能门禁的正式裁决必须同时引用 `reports/runs/<run_id>/evidence-index.md` 和 `EV-CONV-GATE-001`。如果对应 EV 页面缺失,该 AC 不得判定为通过。

### 7.2 功能门禁到需求追溯表

| 功能门禁 | 需求来源 | 设计契约来源 | 测试用例 | EV |
|---|---|---|---|---|
| AC-FUNC-001 | `FR-CONV-001` | `CreateConversationSpace`;`UpdateParticipantScope`;`UpdateVisibilityScope` | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*` | `EV-CONV-TRUTH-001` |
| AC-FUNC-002 | `FR-CONV-002` | `AppendConversationFact`;`RetractConversationFact` | `TC-CONV-FACT-*`;`TC-CONV-TX-001` | `EV-CONV-FACT-001` |
| AC-FUNC-003 | `FR-CONV-003` | `GetConversationReadModel`;`ListConversationFacts`;`PollConversationChanges` | `TC-CONV-QUERY-*` | `EV-CONV-AUTH-001` |
| AC-FUNC-004 | `FR-CONV-004` | `ManifestExternalFact`;inbound consumers | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*` | `EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| AC-FUNC-005 | `FR-CONV-005` | `CreateReviewAnchor`;`RequestTraceHandoff`;`RequestArchiveHandoff` | `TC-CONV-TRACE-001`;`TC-CONV-HANDOFF-*` | `EV-CONV-HANDOFF-001` |
| AC-FUNC-006 | `FR-CONV-006` | `RebuildConversationReadModels`;`RebuildConversationSearchIndex`;`ValidateConversationConsistency` | `TC-CONV-DERIVED-*`;`TC-CONV-CONSISTENCY-001` | `EV-CONV-DERIVED-001` |
| AC-FUNC-007 | `FR-CONV-007` | `SearchConversationHistory`;`MaintainConversationChangeCursors` | `TC-CONV-SEARCH-001`;`TC-CONV-CURSOR-001` | `EV-CONV-AUTH-001`;`EV-CONV-DERIVED-001` |
| AC-FUNC-008 | `FR-CONV-008` | `PublishConversationOutbox`;`PollConversationChanges`;outbound events | `TC-CONV-OUTBOX-*`;`TC-CONV-QUERY-004` | `EV-CONV-OUTBOX-001`;`EV-CONV-AUTH-001` |

### 7.3 P1 / P2 后置边界表

| 能力 | 本轮功能裁决 | 后续处理 |
|---|---|---|
| 真实 DB / broker / resolver / handoff | 不作为 P0 功能通过条件 | Step 13 风险接受或后续 integration-like / staging-like 专项 |
| Chat UI / Workspace 展示体验 | 只裁决 authorized query / event / cursor consumption boundary | 下游仓验收 |
| Bridges 外部平台体验 | 只裁决 mapped fact ref-only input 和 platform body forbidden | `L6-bridges` 验收 |
| Runtime 推理质量 | 只裁决 result committed ref-only consumer | `L2-runtime` / tools 验收 |
| 长历史全文体验和生产容量 | 本轮不锁定量化阈值 | Step 9 / Step 13 记录为风险或后续专项 |

### 7.4 功能失败对最终结论的影响

| 失败范围 | 最终结论影响 |
|---|---|
| AC-FUNC-001~AC-FUNC-005 任一失败 | 不通过 |
| AC-FUNC-006~AC-FUNC-008 破坏 truth、authorization、derived read-only、outbox idempotency 或 evidence path | 不通过 |
| AC-FUNC-006~AC-FUNC-008 仅外围体验不足,且 P0 truth / authorization / evidence 不受影响 | 可进入有条件通过,但必须在 Step 13 风险接受 |
| 对应 TC 或 EV 缺失 | 不得判定为通过或有条件通过 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §5 时摘录。

```markdown
## 5. 功能验收门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_05_function_gate.md` 的“功能验收门禁表”“功能门禁到需求追溯表”“P1 / P2 后置边界表”和“功能失败对最终结论的影响”小节，了解 `FR-CONV-001~008` 如何转换为可裁决功能 AC。

本轮功能验收以 `AC-FUNC-001~AC-FUNC-008` 为裁决入口,对应 `FR-CONV-001~FR-CONV-008`。`AC-FUNC-001~AC-FUNC-005` 是 Conversation truth center 核心闭环,任一失败即不通过。`AC-FUNC-006~AC-FUNC-008` 是外围增强与变化感知的最小切口,如果破坏 truth、authorization、derived read-only、outbox idempotency 或 evidence path,同样不通过；如果仅为 P1/P2 外围体验不足,必须进入风险接受。

每个功能门禁必须绑定正式设计契约、TC、EV 和 `reports/runs/<run_id>/evidence-index.md`。不得只写“功能可用”或“测试通过”。
```

## 9. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续必须继续收口:

- Step 6 将本步提到的 truth、authorization、source isolation 和 forbidden body 转成数据边界与架构红线。
- Step 7 将 Command、Query、Event、Consumer、Job 和跨仓同步接口展开为接口 / 事件验收。
- Step 8 将状态机、事务、幂等和一致性失败条件展开为独立门禁。
- Step 10 将 EV、report、redaction 和 evidence path 展开为证据门禁。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 核心功能都有 AC | 通过 | `AC-FUNC-001~005` 覆盖核心闭环 |
| 外围增强最小切口已裁决 | 通过 | `AC-FUNC-006~008` 覆盖 derived、search、cursor、outbox |
| 通过 / 失败条件可判定 | 通过 | 每项都有具体状态、接口、副作用或失败条件 |
| 证据来源可追溯 | 通过 | 每项绑定 TC、EV 和 evidence index |
| 可以进入 Step 6 | 通过 | 下一步定义数据边界与架构红线验收 |
