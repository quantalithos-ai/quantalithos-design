# L2-member-images 02 概要 Step 10: 异常与边界场景轮廓

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 10 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 11 文件；不展开错误码、retry 参数、补偿脚本或运维流程

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 8 关键处理流、Step 9 局部状态机、Step 3 fail-closed / history / pending 约束、正式 00 / 01 风险边界 |
| 规范 | 已读取概要设计 SOP Step 10 与书写规范 §4.10 |
| 本步目标 | 点名会改变主要组成部分、接口、对象、处理流、状态或跨仓边界的关键异常，并固定概要级处置归属 |
| 本步禁止 | 普通参数校验大全、完整错误码、重试 / 补偿实现、运维操作、把待确认事项混入异常表 |

## 1. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Role / mapping source missing、stale、conflict | `ReferenceDerived` + `DefinitionAssembly` | 形成 `ExternalReferenceSnapshot` / `ContractGap`；受影响 definition / revision lane blocked，不 fallback 或 hardcode mapping。 |
| 必要 component / extras / base pin 缺失 | `DefinitionAssembly` 的 `AssemblyCompletenessGuard` | `AssemblyBaseline` 保持 incomplete，不能创建 buildable revision；已成立旧 revision 不被覆盖。 |
| member component shape / compatibility 未闭口 | `DefinitionAssembly` + `ReferenceDerived` | MI-UP-002 保持 pending；装配 positive lane blocked，不自造 compatibility report。 |
| seed template owner / placement 不可验证 | `DefinitionAssembly` | 只记录 owner-neutral ref / placement gap；不把 semantic body 或 live state 放入 baseline。 |
| static input 包含 secret、live memory、checkpoint、workspace live content | `DefinitionAssembly` boundary guard | 拒绝该 baseline / snapshot；不得通过配置或默认值绕过。 |
| mutable selector、`latest`、guessed version 出现在必要输入或 entry | `AssemblyCompletenessGuard` / `EntryPinGuard` | 立即 fail closed；不得把 mutable ref 转换为 immutable identity。 |
| duplicate / replayed definition、intent 或 command | 对应 Application Service + idempotency guard | 返回既有语境或显式 conflict；不创建第二份 truth。具体 key / storage 留 03。 |
| unknown event source、event family 或 envelope | `BuildCandidate` conditional Event Consumer | `rejected` / `unavailable`；arrival 不产生 BuildIntent，unknown event 不进入 candidate。 |
| builder / registry handoff timeout 或 adapter unavailable | `BuildCandidate` | Attempt 保持 `handoff_pending` / `unknown` / `blocked`；不推断成功、不生成 digest / candidate。 |
| external side effect 已发生但 commit / outcome unknown | `BuildCandidate` | Attempt 进入 `unknown`，等待 resolution 或新语境恢复；禁止盲重试到 success。 |
| output ref 无法证明与 input snapshot / attempt 关联 | `CandidateFormationGuard` | 不形成 `CandidateImage`，记录 failed / blocked / unknown 及 trace。 |
| digest / provenance 不完整或冲突 | `Qualification` | `ProvenanceBinding` incomplete / conflict；Eligibility 不得 positive。 |
| applicable gate 缺失、失败、冲突或 unknown | `Qualification` | `GateEvaluation` 保持 pending / failed / blocked / unknown；不默认 pass，Q-MI-004 不被关闭。 |
| Artifact handoff schema / ref 条件未闭口 | `Qualification` + `ReferenceDerived` | `ArtifactHandoffRecord` 为 pending / gap；不定义 ArtifactVersion / lineage / formal ref。 |
| eligible candidate 缺 immutable entry ref | `SupplyEntry` | 不提交 availability；返回 blocked / unavailable，保留 eligibility history。 |
| availability transition 与当前 history 冲突 | `SupplyEntry` 的 transition guard | 拒绝新 transition，旧 availability 不变；恢复走新 transition / supersede。 |
| rollback target 不可验证或已 retired | `SupplyEntry` | 记录 rejected / blocked transition，不复活旧 entry、不删除历史。 |
| Member Service exact manifest / variant / confirmation contract 缺失 | `SupplyEntry` + `ConsumerHandoffGap` | MI-UP-001 保持 open / unavailable；只提供 neutral pinned-entry direction，不声明 launch / health / confirmation。 |
| consumer / container observed state 回传为失败 | `SupplyEntry` boundary | 只记录 consumer gap / external conclusion；不反写本地 image availability，除非正式 owner contract 明确新的本地 decision 输入。 |
| late / duplicate / out-of-order external outcome | `BuildCandidate` / `ReferenceDerived` | 先按 attempt / correlation / causation 关联；只能 ignored / linked / new decision input，不覆盖较新 truth。 |
| projection lag、rebuild failure 或 read view unavailable | `ReferenceDerived` | `ProjectionFreshness` 标 stale / rebuilding / unavailable；查询显式返回 freshness，不从 projection 回填核心。 |
| Artifact / consumer reconciliation 发现新 gap | `ReferenceDerived` + 对应阶段 | 追加 `ContractGap` / handoff record，冻结受影响新 lane；不删除已成立 eligibility / availability。 |
| future hardened base、restricted variant、multi-arch 或 outbound event 被提前请求 | Scope boundary | 记录 future / conditional，不创建 current active object、接口、状态或 readiness。 |

## 2. 异常影响图（跨阶段失败隔离）

```text
External source / adapter / owner gap
              │
              v
     +----------------------+
     | ReferenceDerived      |
     | snapshot / gap        |
     +----------+-----------+
                │ blocks only affected new lane
                v
     +----------------------+       +----------------------+
     | Definition / Build   | ----> | Qualification /      |
     | pending / blocked    |       | Supply pending       |
     +----------------------+       +----------+-----------+
                                                │
                                                v
                                     +----------------------+
                                     | Entry / consumer gap |
                                     | no launch assertion   |
                                     +----------------------+

Existing committed truth / history remains readable and is not overwritten.
```

关键说明：

- 外部故障只冻结受影响的新 decision lane；不会把已成立的 revision、candidate、eligibility 或 availability 历史抹除。
- `ContractGap`、`blocked`、`unknown`、`unavailable` 是正式结果类别，不是暂时日志标签。
- 图不表达错误码、重试参数、补偿步骤或外部运维操作。

## 3. 异常归属与恢复边界

| 异常类别 | 责任部分 | 允许的概要级恢复 | 禁止的恢复 |
|---|---|---|---|
| 来源不可用 / stale | `ReferenceDerived` + 受影响核心部分 | refresh、new snapshot、new decision context | latest、copied body、cached default 直接转 positive |
| 本地 invariant 不完整 | 对应 domain guard | 保留 failed / blocked，补齐后新 revision / attempt / evaluation / transition | partial candidate / eligibility / available |
| 外部 side effect unknown | `BuildCandidate` | resolution 或显式新 attempt 语境 | 无证据推断 success、盲重试 |
| gate / Artifact / consumer gap | `Qualification` / `SupplyEntry` | 新 owner ref / safe conclusion 到达后形成新判断 | 自造 ref、confirmation、launch 或 readiness |
| projection / read model 故障 | `ReferenceDerived` | 从正式 truth rebuild，表达 freshness | projection 反写核心、把 stale 隐藏成空或 ready |
| 历史冲突 / late result | 对应阶段 history owner | 追加 linked fact / supersede / new context | 原地覆盖较新 truth |

## 4. 异常与状态 / 接口反查

| 异常 | 影响接口 | 影响状态 | 关键对象 |
|---|---|---|---|
| missing pin / mapping | `CaptureAssemblyBaseline`、`ProposeVariantRevision` | `baseline.incomplete` / `definition.blocked`、`revision.invalid` | `AssemblyBaseline`、`MappingSourceSnapshot`、`AssemblyCompletenessGuard`、`PinIntegrityGuard` |
| unknown build result | `RecordBuildOutcome`、`ReconcileBuildAttempts` | attempt.unknown、candidate.unknown | `BuildAttempt`、`BuildOutcomeConclusion`、`CandidateImage` |
| gate unknown | `EvaluateCandidateEligibility` | `gate.unknown` / `gate.blocked`、`eligibility.blocked` | `GateEvaluation`、`EligibilityDecision`、`ApplicableGateGuard` |
| Artifact contract gap | `RecordArtifactHandoff`、reconcile job | `artifact_handoff.gap`、`contract_gap.open` | `ArtifactHandoffRecord`、`ContractGap` |
| consumer ref unavailable | `ResolveInstantiableEntry` | `supply.unavailable`、`consumer_handoff.open` | `InstantiableEntry`、`ConsumerHandoffGap` |
| projection stale | read queries、`RebuildImageDerivedViews` | projection.stale / rebuilding / unavailable | `ProjectionFreshness`、`ImageDerivedReadModel` |

## 5. 不在本步展开的内容

- 错误码 / message / protocol mapping、数据库约束、retry / timeout / backoff、幂等 key 算法、补偿脚本和运维 runbook 留给 03 / 05 / 07。
- 具体 builder、registry、scanner、signer、Artifact、Member Service 产品行为不在本仓定义。
- 设计风险和待确认事项在 Step 13 独立收纳；本表只保留会改变主线理解的异常处理口径。

## 6. 完成审计与下一步门禁

| 检查项 | 结果 |
|---|---|
| 关键异常会落到明确主要部分 / guard | `pass` |
| 异常对接口、流、状态或跨仓边界的影响已说明 | `pass` |
| fail-closed、history-preserving、lane isolation 已覆盖 | `pass` |
| 未写错误码、retry 参数、补偿脚本或运维步骤 | `pass` |
| 未把风险 / 待确认事项混入异常表 | `pass` |
| 未读取旧正式 02、未创建 Step 11 文件 | `pass` |

正式第 10 章回填异常表与必要影响图；Step 11 只识别配置影响，不把异常细节写成配置项。

`gate_status = pass_stop_review`。Step 10 足以支撑 Step 11；下一动作是读取 Step 10 与 Step 11 规范并创建 `02_hld_step_11_configuration_impact.md`。
