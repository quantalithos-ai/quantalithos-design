# L2-member-images 02 概要 Step 9: 状态定义与状态流转

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 9 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 10 文件；不定义状态列、错误码、补偿脚本或实现状态机代码

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 6 对象状态集合、Step 7 状态触发接口、Step 8 关键处理流、Step 3 staged decision / history / fail-closed 约束 |
| 规范 | 已读取概要设计 SOP Step 9 与书写规范 §4.9 |
| 本步目标 | 收稳五条局部状态轴、状态含义、核心迁移、禁止迁移和向 projection / 下游传播的边界 |
| 本步禁止 | 单一跨 owner ready 生命周期、UI 状态、数据库 enum、错误码全集、补偿实现、未定义新状态对象 |

## 1. 状态模型判断

本仓存在局部状态机，但不存在一个覆盖 definition、build、qualification、availability、Artifact、consumer、container 的总状态机。每条状态轴只由所属主要组成部分的对象拥有；跨部分传播只通过已提交事实、ref、gap 或只读 projection，不把下游状态写回上游 truth。

## 2. 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `definition.draft` | family / variant 语义已登记，来源或 baseline 尚未完整 | 否 | 只能等待补齐或被拒绝，不启动 build |
| `definition.resolved` | mapping snapshot、必要 pin 与静态 placement 可验证 | 受限 | 可形成 baseline / revision，不代表 candidate |
| `definition.blocked` | source stale / conflict / missing 或 static-live 越界 | 否 | 受影响新 revision lane fail closed |
| `definition.superseded` | 新 definition / revision 替代旧语境 | 否（旧语境） | 历史可读，不能作为新 build 输入 |
| `baseline.incomplete` | 必要 pin、placement 或 source validity 缺失 | 否 | 不能形成 buildable revision；缺口只冻结受影响新 lane |
| `baseline.complete` | 当前必要静态输入均可验证且 immutable | 受限 | 可供 revision guard 判断，不代表 build 或 candidate |
| `baseline.conflict` | 来源或版本彼此冲突 | 否 | fail closed；既有 baseline / revision 历史不覆盖 |
| `baseline.superseded` | 新 baseline 替代旧输入语境 | 否（旧语境） | 旧快照可追溯，不作为新 positive 输入 |
| `revision.proposed` | revision 候选已形成，尚未通过完整性 guard | 否 | 只能等待验证或被标记 invalid |
| `revision.buildable` | revision 通过必要 completeness / pin guard | 是（进入 intent 判断） | 只表示可请求构建，不代表构建成功 |
| `revision.invalid` | revision 的来源、pin 或 derivation 冲突 | 否 | 不创建 BuildIntent；恢复走新 revision |
| `revision.superseded` | 新 revision 替代旧 revision | 否（旧语境） | 旧 revision 保留历史，不作为新 intent 输入 |
| `intent.accepted` | build trigger 与 buildable revision 通过本地 guard | 是（进入 attempt） | 不等于 external work 已完成 |
| `intent.pending` | 等待 verified source 或 contract | 否 | 只能通过新判断恢复 |
| `intent.blocked` | 当前输入 / seam 不可验证 | 否 | 不产生 candidate |
| `intent.cancelled` | 外部副作用前明确终结意图 | 否 | 保留原因与 history |
| `snapshot.complete` | attempt 所需输入与 source identity 齐全且 immutable | 受限 | 可建立 attempt，不代表 external handoff 成功 |
| `snapshot.incomplete` | 缺少必要静态输入 | 否 | 不交接外部构建；恢复走新 snapshot / intent |
| `snapshot.invalid` | snapshot 与 revision、baseline 或 source identity 冲突 | 否 | 不允许 attempt 进入正向 lane |
| `attempt.created` | 本地 attempt 已建立 | 受限 | 需 immutable snapshot / handoff |
| `attempt.handoff_pending` | 等待 external adapter 接受或确认 | 否 | 不把 acceptance 当成功 |
| `attempt.outcome_pending` | side effect 已发生，结果未确定 | 否 | 不得普通 retry 或 success |
| `attempt.succeeded` | 获得可验证 safe outcome | 受限 | 仍须 candidate formation guard |
| `attempt.failed` | 明确失败结论 | 否 | 可在新语境产生新 attempt |
| `attempt.unknown` | side effect / commit / result 无法判定 | 否 | 等待 resolution 或显式恢复策略 |
| `candidate.formed` | candidate formation guard 成立 | 是（进入 qualification） | 不等于 eligibility / availability |
| `candidate.rejected` | output / outcome 不满足 candidate guard | 否 | 保留 attempt / reason |
| `candidate.blocked` | contract / source gap 阻断判断 | 否 | 受影响 lane 保持 gap |
| `candidate.unknown` | candidate 归属或外部结果无法判定 | 否 | 不推导资格 |
| `provenance.complete` | candidate 的 input、execution、output 来源链可验证 | 受限 | 可供 gate / eligibility 判断，不代表 gate 通过 |
| `provenance.incomplete` | 来源链缺少必要部分 | 否 | eligibility 保持 pending / blocked |
| `provenance.conflict` | digest、input、execution 关系冲突 | 否 | fail closed；需新 binding 语境 |
| `gate.pending` | applicable gate 尚未完整收集 | 否 | 等待 safe conclusion，不默认通过 |
| `gate.passed` | 当前 applicable gate 均有可验证 positive conclusion | 受限 | 仅作为 eligibility 输入，不代表 availability |
| `gate.failed` | 至少一项 applicable gate 明确失败 | 否 | 不形成 eligible decision |
| `gate.blocked` | gate authority / evidence 无法判定 | 否 | Q-MI-004 未闭口时保持 blocked |
| `gate.unknown` | 外部 gate 结果无法确认 | 否 | 不得转换为 passed |
| `eligibility.pending` | provenance / applicable gate 未完成 | 否 | 等待 safe conclusion |
| `eligibility.eligible` | provenance 完整且 applicable gates 正向成立 | 是（进入 supply 判断） | 只表示 image eligibility |
| `eligibility.ineligible` | 明确不满足资格 | 否 | 不形成 available entry |
| `eligibility.blocked` | authority / evidence seam 不可验证 | 否 | Artifact handoff 与 eligibility 分域 |
| `transition.proposed` | availability transition 候选已形成 | 否 | 仍需 eligibility、pin 与 history guard |
| `transition.committed` | 本地 availability 变化成立 | 受限 | 不表示 consumer / container 完成 |
| `transition.rejected` | transition 不满足前置或与 history 冲突 | 否 | 原 availability 不变；恢复走新 transition |
| `transition.superseded` | 新 transition 替代旧语境 | 否（旧语境） | 旧 transition history 保留 |
| `supply.unavailable` | 当前没有可验证 pinned entry | 否 | 可由新 eligible candidate / transition 恢复 |
| `supply.available` | 本地 availability 与 immutable entry 成立 | 是（可供下游查询） | 不表示 launch / health / confirmation |
| `supply.superseded` | 新 entry 替代旧 entry | 否（旧 entry） | 旧 entry history 保留 |
| `supply.retired` | entry 被明确退出供给 | 否 | 不删除 digest / provenance / history |
| `artifact_handoff.pending` | Artifact 交接尚未得出 safe conclusion | 否（受影响 lane） | 当前只能等待或形成 gap |
| `artifact_handoff.gap` | Artifact contract、schema 或 ref 条件不可验证 | 否（受影响 lane） | MI-UP-007 未闭口时保持 gap |
| `artifact_handoff.accepted` | 正式 owner-side handoff contract 已闭口并可验证 | 受限 | 当前 MI-UP-007 未闭口时不假设此状态 |
| `consumer_handoff.open` | Member Service contract / ref / confirmation 缺口存在 | 否（受影响 lane） | 只能返回 gap / unavailable |
| `consumer_handoff.resolved` | 正式 consumer contract 与 confirmation 可验证 | 受限 | 当前 MI-UP-001 未闭口时不假设此状态；不等于 container started |
| `consumer_handoff.stale` | 旧 consumer gap 语境已过期 | 否 | 必须形成新 handoff 判断 |
| `contract_gap.open` | 外部 exact contract 缺口已识别 | 否（受影响 lane） | 等待正式 owner / contract 输入 |
| `contract_gap.blocked` | 受影响 positive lane 明确不可推进 | 否 | 不生成 readiness 或 fallback |
| `contract_gap.resolved` | 正式 authority 与 resolution ref 已验证 | 受限 | 当前 pending 项不得假设此状态 |
| `contract_gap.expired` | 旧 gap 语境不再适用于新判断 | 否 | 需新 gap / decision context |
| `reference.valid` | external ref / snapshot 可供指定判断消费 | 受限 | validity 取决于 use context，不创建 domain truth |
| `reference.stale` | 可解释历史但不能支持新 positive decision | 否 | 触发 refresh / new decision |
| `reference.conflict` | source / identity 冲突 | 否 | fail closed |
| `reference.unavailable` | 无法读取 / 验证 | 否 | 只冻结受影响 lane |
| `projection.fresh` | derived view 已追至 truth watermark | 是（读侧） | 只读；不表示业务 ready |
| `projection.stale` | view 可读但滞后 | 受限 | 输出 freshness，不能隐瞒 gap |
| `projection.rebuilding` | 正在从 truth 重建 | 否（该 view） | 可返回 rebuilding |
| `projection.unavailable` | view 当前不可读 | 否（该 view） | 不反写正式 truth |

## 3. 按主要组成部分组织的状态归属表

| 主要组成部分 | 状态对象 / 状态轴 | 触发接口 / 处理流 | 向外传播 |
|---|---|---|---|
| `DefinitionAssembly` | `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | definition commands、baseline / revision flow、reference refresh | buildable revision 或 definition gap |
| `BuildCandidate` | `BuildIntent`、`BuildAttempt`、`CandidateImage` | request / nightly、verified event、record outcome | candidate、failure、unknown、attempt history |
| `Qualification` | `GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord` | qualification / Artifact handoff flow、reevaluation job | eligibility 或 qualification / Artifact gap |
| `SupplyEntry` | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | publish / transition / rollback / resolve flow | pinned entry、availability history、consumer gap |
| `ReferenceDerived` | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness`、`ImageDerivedReadModel` | refresh / rebuild / reconcile jobs、read queries | safe view、freshness、gap、trace |

## 4. 状态流转图

```text
definition.draft
      | bind valid mapping / complete pins
      v
definition.resolved
      | propose + validate revision
      v
revision.buildable
      | request intent / nightly
      v
intent.accepted
      | create immutable snapshot / attempt
      v
attempt.created
      | external handoff
      v
attempt.handoff_pending
      | verified outcome
      v
attempt.succeeded
      | candidate guard
      v
candidate.formed
      | provenance + applicable gate evaluation
      v
eligibility.eligible
      | availability transition with immutable entry
      v
supply.available
      | publish / replace / rollback / retire
      v
supply.superseded / supply.retired
```

关键说明：

- 任一阶段都可能转入 pending、blocked、failed、unknown、rejected 或 unavailable；图只展示正向骨架，不代表每次运行必经全链。
- `eligibility.eligible` 不自动生成 `supply.available`；需要独立 entry pin / transition guard。
- `supply.available` 不传播为 container health、launch 或 consumer confirmation；这些是边界外状态。
- 恢复通过新 revision / attempt / evaluation / transition 进入，不回退覆盖旧状态。

## 5. 允许的核心迁移

- `definition.draft -> definition.resolved`：来源、必要 pin、静态 placement 均可验证。
- `definition.resolved -> definition.blocked`：新发现 stale / conflict / missing，且不覆盖既有历史。
- `definition.resolved -> definition.superseded`：新 definition / revision 已正式替代。
- `baseline.incomplete / baseline.conflict -> revision.invalid`：baseline 不满足必要静态输入或存在冲突时，revision 不得进入 buildable。
- `revision.proposed -> revision.buildable`：完整性与 pin guard 均通过；只允许创建 BuildIntent。
- `revision.proposed -> revision.invalid`：来源、pin 或 derivation 冲突；恢复必须形成新 revision。
- `revision.buildable -> intent.accepted`：本地 build request / nightly guard 通过。
- `intent.accepted -> snapshot.complete -> attempt.created`：immutable input snapshot 成立后才可建立 attempt。
- `attempt.created -> attempt.handoff_pending`：受控 external handoff 已记录。
- `attempt.handoff_pending -> attempt.outcome_pending`：side effect 已发生但结果未完全判定。
- `attempt.outcome_pending -> attempt.succeeded / attempt.failed / attempt.unknown`：收到可验证 outcome、明确失败或未知结论。
- `attempt.succeeded -> candidate.formed`：candidate formation guard 通过。
- `candidate.formed -> provenance.complete / provenance.incomplete / provenance.conflict`：先建立并验证来源链，再进入 gate 判断。
- `provenance.complete -> gate.pending`：开启 applicable gate evaluation。
- `gate.pending -> gate.passed / gate.failed / gate.blocked / gate.unknown`：safe gate conclusion 完成或保守失败。
- `candidate.formed -> eligibility.pending`：在 provenance / gate 判断开始时开启 eligibility 语境。
- `eligibility.pending -> eligibility.eligible / eligibility.ineligible / eligibility.blocked`：safe provenance / gate conclusion 完成或保守失败。
- `eligibility.eligible -> transition.proposed -> transition.committed -> supply.available`：entry pin、availability transition 与本地 history guard 通过。
- `supply.available -> supply.superseded / supply.retired`：新 entry 替换或明确退役。
- `artifact_handoff.pending -> artifact_handoff.gap / artifact_handoff.accepted`：缺口显式化，或在正式 Artifact contract 闭口后获得接受结论；当前不假设正向迁移。
- `consumer_handoff.open -> consumer_handoff.resolved / consumer_handoff.stale`：正式 consumer contract / confirmation 可验证，或旧 gap 语境过期；当前不假设 resolved。
- `contract_gap.open / contract_gap.blocked -> contract_gap.resolved / contract_gap.expired`：只有正式 resolution ref 才能关闭；否则只能使旧语境过期。
- `reference.valid -> reference.stale / reference.conflict / reference.unavailable`：refresh 发现来源变化或不可用。
- `projection.fresh -> projection.stale / projection.rebuilding / projection.unavailable`：watermark 落后、重建或读侧故障。

## 6. 禁止的核心迁移

- `attempt.unknown -> candidate.formed`：未知副作用不得推断成功。
- `attempt.unknown -> attempt.succeeded`：无新 safe outcome 不得正向迁移。
- `candidate.formed -> supply.available`：不得跳过 provenance / eligibility / entry guard。
- `eligibility.blocked -> eligibility.eligible`：缺 authority / evidence / contract 时不得 fail open。
- `gate.unknown -> gate.passed`：没有新的可验证 safe conclusion 不得正向迁移。
- `supply.unavailable -> supply.available`：不得使用 `latest`、猜版本、registry presence 或 consumer ACK 绕过 guard。
- `supply.retired -> supply.available`：必须由新 entry / 新 transition 形成，不复活旧历史。
- `reference.stale / conflict / unavailable -> positive decision`：必须先产生新可验证 snapshot / conclusion。
- `projection.* -> definition / candidate / eligibility / availability`：projection 不得反写 truth。
- 任一旧 revision / attempt / evaluation / transition 原地改写为新结论：恢复必须 append / supersede。
- `supply.available -> consumer.confirmed`：本仓不拥有 consumer / container confirmation 状态。

## 7. 状态传播关系图

```text
Local stage transition
  │
  ├─> append local history / trace
  │       (same owner truth)
  │
  ├─> refresh derived projection
  │       -> fresh / stale / rebuilding / unavailable
  │
  ├─> expose pinned entry or ContractGap
  │       -> Member Service consumes / blocks independently
  │
  └─> conditional external handoff / future event seam
          -> no current outbound event authority
```

关键说明：

- local transition 先在本仓成立，projection / handoff / consumer 传播失败不回滚已提交 truth。
- `ContractGap` 只冻结受影响的新 lane；既有可追溯 history 不被删除。
- 当前无 outbound event，因此传播关系不生成 delivery / observed / readiness 事实。

## 8. 状态归属停审记录

| 主要组成部分 | 结果 | 说明 |
|---|---|---|
| `DefinitionAssembly` | `pass` | definition / baseline / revision 轴独立，未混入 build 状态。 |
| `BuildCandidate` | `pass` | intent / attempt / candidate 与 unknown / failed 分开。 |
| `Qualification` | `pass` | provenance / gate / eligibility / Artifact handoff 分域。 |
| `SupplyEntry` | `pass` | availability / entry / consumer gap 分域。 |
| `ReferenceDerived` | `pass` | ref validity / projection freshness 不成为核心 truth。 |

## 9. 跨状态一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 每个状态有 Step 7 触发接口或 Step 8 流 | `pass` | 见 §3、Step 7 / 8 对应表。 |
| 同名 / 近义状态未跨 owner 混用 | `pass` | `eligible`、`available`、`resolved`、`fresh` 各有明确语境。 |
| 允许 / 禁止迁移完整 | `pass` | 包含正向、fail-closed、unknown、history 与 projection 红线。 |
| 状态传播边界清楚 | `pass` | local truth、projection、handoff、consumer 分开。 |
| 未新增隐式 ready 状态 | `pass` | 无总 lifecycle。 |
| 未写数据库状态列或实现代码 | `pass` | 仅表达语义迁移。 |

## 10. 回填草稿与下一步门禁

正式第 9 章回填状态定义表、归属表、状态流转图、允许 / 禁止迁移和传播图；不回填本文件的问题诊断。Step 10 将只补关键异常对这些状态和流程的影响，不新增主线状态。

`gate_status = pass_stop_review`。Step 9 足以支撑 Step 10；下一动作是读取 Step 9 与 Step 10 规范并创建 `02_hld_step_10_exceptions_boundaries.md`。
