# Step 6. 逐模块定义对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 回填章节: `03-详细设计.md` §5 模块实现契约中的对象实现契约;§6 全局对象索引
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. Step 状态

- 状态: `[x]` 已确认
- 当前目标: 在 Step 5 已固定的 7 个实现模块主轴下,把 `L1-artifact` 的正式对象、公开 carrier、state / kind、policy 和 record 收口到可 1:1 落码的 Rust-facing contract
- 本步不做的事:
  - 不提前定义 repository / port / adapter trait
  - 不提前定义 command / query / event / job DTO
  - 不提前定义事务顺序、DDL、索引、配置项和测试方案
  - 不凭空新增未在 Step 5、HLD handoff 或 Step 7 既有闭口中稳定出现的 helper / runtime 主语

## 2. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md` | 已完成 | 提供模块 owner、依赖方向和对象归属门禁 |
| `projects/L1-artifact/02-概要设计.md` §5 / §6 / §12 | 已读取 | 提供 10 个主要组成部分、关键对象轮廓和详细设计承接清单 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects.md` | 已读取 | 提供 Step 6 对象主表、对象分布和反查清单 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_truth_core.md` | 已读取 | 提供 fact / version / lineage / baseline 主线对象骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_boundary_context.md` | 已读取 | 提供 intake / review / automation / consumption 支撑对象骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_support_states.md` | 已读取 | 提供 derived freshness / external resolution 状态对象骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_policies.md` | 已读取 | 提供 10 个 policy / guard 对象骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_projections.md` | 已读取 | 提供 summary / read surface / preview / report / reconciliation 只读对象骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects_references_audit.md` | 已读取 | 提供 reference、change、trace、handoff、refresh 和 audit record 骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 Step 6 必须给 Step 7~11 的承接输入 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 已读取 | 作为 Step 6 粒度和组织方式参考 |
| `projects/L1-artifact/00-需求文档.md` / `01-架构设计.md` | 已读取 | 提供 truth ownership、外部正文排除、派生只读、handoff 不回滚和配置不可越界等红线 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 约束 carrier schema、字段来源、状态闭环和对象成员参数闭口 |

## 3. 本步目标

在 Step 5 已固定的 7 个实现模块主轴下,把 `L1-artifact` 的 Step 6 从“对象正文已写完”提升为“框架、对象、字段来源、状态语义和 Step 7 承接都可追溯”的中间产物。

本次重写后的 Step 6 必须同时满足:

- `contracts` / `domain` 对象正文仍保持 exact Rust-facing carrier、字段集合、成员函数和禁止事项。
- Step 6 先显式给出批次计划、模块执行顺序和模块 capability / 对象承接关系,再进入对象卡片。
- 非 core 模块是否要在 Step 6 闭口对象,必须给出正式决策,而不是隐式跳过。
- 字段来源闭环、状态闭环和 Step 7 承接点必须在本文件内显式落表,不能只留在作者脑内。

本步仍不做的事:

- 不提前定义 repository / port / adapter trait exact 签名
- 不提前定义 command / query / event / job DTO 完整 schema
- 不提前定义事务顺序、DDL、索引、配置项和测试方案

## 4. 分批写入计划

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.0` | Step 6 框架重写:目标、批次、模块顺序、非 core 模块决策、对象 owner 总览 | 已写入 | 是 | 已确认 | `6.1` |
| `6.1` | `contracts` shared carrier、state / kind、public reference、view / report object | 已写入 | 是 | 已确认 | `6.2` |
| `6.2` | `domain` truth core object | 已写入 | 是 | 已确认 | `6.3` |
| `6.3` | `domain` boundary / context support object | 已写入 | 是 | 已确认 | `6.4` |
| `6.4` | `domain` support state / policy / append-only record | 已写入 | 是 | 已确认 | `6.5` |
| `6.5` | `application` helper object contract: operation context、stored result、idempotency、application error | 已写入 | 是 | 已确认 | `6.6` |
| `6.6` | 非 core 模块剩余 defer 决策、字段来源审计、状态闭环审计、Step 7 承接清单 | 已写入 | 是 | 已确认 | 无 |

## 5. 模块执行顺序与 capability 承接

### 5.1 模块执行顺序表

| 顺序 | 模块 | 模块职责 | 输入来源 | 完成后停审点 |
|---|---|---|---|---|
| 1 | `contracts` | 先闭口 public typed carrier、public state / kind、view / report surface | Step 5 owner、HLD key objects、public protocol boundary | public DTO / event / job / query view 不再依赖 domain-only 二级类型 |
| 2 | `domain` truth core | 闭口 fact / version / lineage / baseline truth 主线 | HLD truth core object skeleton、Step 5 domain ownership | truth object 的字段、factory、transition method、lifecycle state 全部可落码 |
| 3 | `domain` boundary / context support | 闭口 intake / review / responsibility / automation / consumption support 主线 | HLD boundary context object skeleton、Step 5 application-domain seam | support object 不偷走 truth owner,也不漂移成 entry helper |
| 4 | `domain` support state / policy / record | 闭口 derived freshness、external resolution、policy / guard、append-only record | HLD support states、policies、references / audit object skeleton | policy 只判断,record 只追溯,derived state 不反写真相 |
| 5 | `application` helper object 闭口 | 固定 idempotent operation、stored result、entry-to-service context、application error 的 stable carrier | Step 5 module seam、Step 7 exact helper naming、HLD handoff stored result / idempotency requirements | Step 7 不会在 application 层私补 idempotency / result / visibility carrier |
| 6 | 非 core 模块剩余 defer 决策 | 判断 `infra` / `api` / `worker` / `jobs` 是否需要 Step 6 canonical object | Step 5 module seams、现有 object cards、Step 11 config impact | 决策显式化,并给出 reopen 条件 |
| 7 | 跨模块闭环审计与 Step 7 承接 | 汇总字段来源、状态 owner、Step 7 port / repository / resolver 承接点 | 当前 Step 6 全文、Step 12 handoff requirements | Step 7 不会从空白处发明 schema 或 helper |

### 5.2 模块 capability / 功能清单

| 模块 | capability / 功能 | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|---|
| `contracts` | 承载 public carrier / state / kind / report / view surface | HLD public object skeleton、Step 5 protocol exposure | typed ref、reason、kind、state、view、report、cursor、digest | 只定义 public carrier,不创建 truth | `contracts` object | Step 8 protocol、Step 9 read / report flow |
| `domain` truth core | 建立和迁移 fact / version / lineage / baseline truth | accepted truth copy、same-tx constructed ref、system-generated id | truth object、state transition、change basis | 改变 truth lifecycle | `ArtifactFact` 等 truth core object | Step 7 repository、Step 9 write flow、Step 10 state matrix |
| `domain` boundary / context support | 承接 intake / review / responsibility / automation / consumption 边界语义 | command / consumer input copy、resolver snapshot copy | support object、review anchor、assignment、consumable ref | 只支撑 truth,不替代 truth owner | `ArtifactIntakeContext` 等 support object | Step 7 repository / resolver、Step 8 DTO、Step 9 boundary flow |
| `domain` support state / policy / record | 承接 derived freshness、reference resolution、policy guard、append-only trace / audit / handoff / refresh | derived-only、accepted truth copy、resolver snapshot copy | support state、policy object、append-only record | 影响可读性、追溯和维护,不反写真相 | `ArtifactDerivedViewState`、policy、record object | Step 7 repository / append port、Step 9 maintenance flow、Step 10 state matrix |
| `application` | 编排 command / query / consumer / job service,并承载 idempotent operation / stored result / application error / entry-to-service context | Step 6 object、entry metadata、future DTO / port input | service / facade / result orchestration、stored result envelope、idempotency reservation、application error | 编排事务、幂等、读写边界和 duplicate replay | `ArtifactIdempotentOperationContext`、call context family、`StoredArtifactOperationResult`、`ArtifactApplicationError` | Step 7 / Step 8 / Step 9 / Step 11 |
| `infra` | 持久化 truth / read model / mirror / handoff / publisher / runtime | Step 6 object + future port trait | repository adapter、resolver adapter、runtime config / builder | persistence、relay、mirror、handoff prepare | 当前仍未闭口 exact runtime carrier,仅保留 reopen watchpoint | Step 7 / Step 11 / Step 14 |
| `api` / `worker` / `jobs` | 入口解析、调度和结果映射 | DTO / event / job envelope、application facade、application-owned call context | handler / consumer / runner invocation | 不拥有 truth,不定义 canonical business object | 当前 Step 6 不新增 canonical object;稳定 entry carrier、receipt / report surface 和 idempotent context 归一化已由 `application` / `contracts` 吸收 | Step 8 / Step 9 / Step 13 / Step 15 |

### 5.3 非 core 模块对象闭口决策表

| 模块 | 当前 Step 6 是否闭口 | 需要闭口的对象组 | 若 defer 的理由 | 后续承接 Step |
|---|---|---|---|---|
| `application` | 是 | `ArtifactOperationName`、`ArtifactRequestDigest`、`ArtifactApplicationResultRef`、`ArtifactStoredResultSurfaceRef`、`ArtifactIdempotencyRef`、`ArtifactIdempotentOperationContext`、call context family、`ArtifactApplicationError`、stored result / receipt / report envelope family | Step 7 已使用 exact naming;HLD / Step 5 已固定 idempotency、stored result、run report、ApplicationError 是 application seam 的唯一 stable carrier | Step 7 / Step 8 / Step 9 / Step 11 |
| `infra` | 否,但保留强 reopen watchpoint | runtime config / builder / config error / adapter availability helper | Step 5 与 HLD 已稳定 owner 和 injection boundary,但仍明确保留 `RuntimeConfig` 字段全集、`ConfigError` 枚举全集、builder constructor 参数和 adapter config shape 给 Step 11 / 14;Step 7 当前也只消费通用注入语义,尚未依赖 exact helper type | Step 11 / Step 14 |
| `api` | 否 | request mapper / response assembly helper | Step 5 已把 `api` 固定为 request mapping / response mapping / runtime assembly;稳定 entry-to-service carrier 已由 `ArtifactCommandCallContext` / `ArtifactQueryCallContext` 吸收到 `application`,public response carrier 由 `contracts` / stored result family 承接,Step 7 也只消费这些 exact context 和 response surface | Step 8 |
| `worker` | 否 | consumer accumulator / loop state helper | Step 5 已把 `worker` 固定为 inbound consumer / loop / receipt mapping;稳定 inbound carrier 已由 `ArtifactInboundEventCallContext` 和 `ArtifactInboundReceiptEnvelope` 承接,Step 7 也只允许 envelope -> call context 与 receipt -> ack mapping,因此循环与重入主语继续留给 protocol / concurrency 设计 | Step 8 / Step 13 |
| `jobs` | 否 | job runner registry / local loop state helper | Step 5 已把 `jobs` 固定为 one-shot runner / run report mapping;稳定 job carrier 已由 `ArtifactJobCallContext` 与 `ArtifactJobReportEnvelope` 承接,Step 7 也只允许 job input -> call context 与 application result -> run report / exit surface,因此 runner runtime 主语继续留给 Step 14 / Step 15 | Step 8 / Step 11 / Step 15 |

### 5.4 模块内停审记录

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | public secondary type 是否全部停留在 `contracts` | 通过 | 继续要求 Step 8 不得回引 domain-only carrier |
| `domain` truth core | truth object 是否覆盖 fact / version / lineage / baseline 主线 | 通过 | Step 7 仅能补 repository / version / cursor surface,不得改 owner |
| `domain` boundary / context | intake / review / automation / consumption 是否只是支撑语义,未抢 truth owner | 通过 | Step 9 必须保持 support object 不替代 truth |
| `domain` support state / policy / record | policy 是否只判断、record 是否只追加、derived state 是否不反写真相 | 通过 | Step 10 / Step 11 不得把维护状态并入 truth lifecycle |
| `application` helper | idempotency / stored result / application error / call context 是否已找到唯一 owner | 通过 | Step 7 只能继续补 trait / repository callable surface,不得改 helper owner |
| `infra` / `api` / `worker` / `jobs` | defer 是否为显式决策而非遗漏 | 通过,带 reopen 条件 | 如 Step 11 / 14 发现唯一 stable carrier 缺口,必须回开 Step 6 |

## 6. 当前对象闭口规则

### 6.1 本步只正式化已经在 `02` 出现的对象主语

本步只闭口以下对象组:

- `contracts`
  - public typed ref / scope / digest / reason / set wrapper
  - public state / kind / change kind / operation kind
  - public view / report / read surface carrier
- `domain`
  - truth core
  - boundary / context support state
  - policy / guard
  - change / audit / trace / handoff / refresh record

本步当前不新增以下 canonical business object:

- `infra` runtime builder helper
- `api` request mapper helper
- `worker` loop accumulator
- `jobs` report assembly helper

其中 `application` local helper 已在本步闭口;其余运行层 helper 只有在后续 Step 被证明是唯一 stable carrier 时,才允许回开 Step 6 正式闭口;否则继续由 Step 7 / Step 8 / Step 11 以内聚 callable surface 承接。

### 6.2 字段来源分类

| 来源类别 | 允许出现在哪些对象中 | 典型字段 |
|---|---|---|
| `system_generated` | `Id` / `Ref` / record identity / truth cursor | `artifact_fact_ref`、`record_ref`、`truth_cursor` |
| `accepted_truth_copy` | truth object、summary view、change record | `artifact_fact_ref`、`current_version_ref`、`baseline_scope_ref` |
| `resolver_snapshot_copy` | reference object、resolution state、intake context | `external_ref`、`summary_ref`、`captured_snapshot_ref` |
| `command_or_consumer_input_copy` | intake / submission / automation / backref | `source_ref`、`consumer_ref`、`consumption_reason` |
| `same_tx_constructed_ref` | truth-to-truth link、truth-to-record link | `content_context_ref`、`candidate_ref`、`trace_ref` |
| `derived_only` | view / report / freshness state | `summary_state`、`report_state`、`finding_count` |

### 6.3 对象级写作门禁

- 凡会进入 public DTO、event、job、query view 的二级类型,必须归 `artifact_contracts`。
- 凡会决定 Artifact truth 是否成立、如何迁移、如何冻结或如何被追溯的对象,必须归 `artifact_domain`。
- `policy` 只判断,不保存 truth。
- `view / report` 只读、可重建、可 stale,不得反写真相。
- `trace / audit / handoff / refresh` record 只追加,不得替代当前 truth state。
- 如果某字段需要未来 Step 7 trait / repository 才能解析,本步仍必须先把字段 carrier 定死,不能留成“某个 helper 将来再说”。
- 如果后续 Step 需要 `application` / `infra` / `api` / `worker` / `jobs` 中的唯一 stable carrier 才能保证字段来源、visibility、idempotency、stored result、runtime availability 或 entry disposition 闭环,实现必须回开 Step 6,不得在后续 Step 私补 object。

## 7. 对象 owner 总览

| 模块 | 对象类别 | 本 Step 需要闭口的对象组 |
|---|---|---|
| `contracts` | typed carrier / public state / kind / view / report | typed id / ref / scope / summary ref / digest / cursor / reason / set wrapper / state enum / kind enum / change kind enum / view / report |
| `domain` truth core | truth / lifecycle owner | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership` |
| `domain` boundary / context support | intake / review / responsibility / automation / consumption support | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref` |
| `domain` support state / policy / record | derived state / reference resolution / policy / append-only record | `ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、10 个 policy、10 个 record |
| `application` | operation / result / error / context helper | `ArtifactOperationName`、`ArtifactRequestDigest`、`ArtifactApplicationResultRef`、`ArtifactStoredResultSurfaceRef`、`ArtifactIdempotencyRef`、`ArtifactIdempotentOperationContext`、call context family、`ArtifactApplicationError`、stored result / receipt / report envelope family |
| `infra` | persistence / resolver / runtime seam | 本步暂不新增 canonical object;当前只收稳 owner、注入边界和禁止事项,不私补 `RuntimeConfig` / `ConfigError` / builder helper exact schema;仅记录 Step 11 / 14 可能需要 reopen 的 runtime seam |
| `api` / `worker` / `jobs` | entry seam | 本步不新增 canonical object;稳定 entry carrier、receipt / report surface 和 context normalization 已回收到 `application` / `contracts`,仅保留 Step 8 / 13 / 15 的 entry seam |

---

## 8. `contracts` 对象契约

### 8.1 shared carrier 统一规则

#### 8.1.1 opaque carrier pattern

以下 carrier 使用固定 Rust-facing 形态:

```rust
/// Opaque identity owned by artifact contracts.
pub struct OpaqueId(pub String);

/// Stable typed reference carried across protocol surfaces.
pub struct OpaqueRef(pub String);

/// Ordered and unique typed reference set.
pub struct OpaqueRefSet(pub Vec<OpaqueRef>);

/// Non-empty explanatory reason.
pub struct OpaqueReason(pub String);
```

| primitive carrier | formal owner meaning | 允许使用面 | 禁止替代 |
|---|---|---|---|
| `OpaqueId` | module-local stable identity primitive | id generator output、module-local identity wrapper | 不得直接穿过 public DTO 代替已命名 typed ref |
| `OpaqueRef` | body-free typed reference primitive | contracts ref wrapper、query/report linkage、record linkage | 不得携带正文、scope body、runtime state |
| `OpaqueRefSet` | ordered unique reference collection primitive | typed ref set wrapper、query page material、aggregate membership | 不得在实现侧降级为不去重的裸列表 |
| `OpaqueReason` | explanatory reason primitive | transition reason wrapper、reject/suspend/retire reason、error message input | 不得单独承担 state transition 语义 |

| primitive carrier | exact closure | helper expectation | red line |
|---|---|---|---|
| `OpaqueId` | `String` 非空;canonical key 不可依赖解析内部结构 | 只允许被更具体的 typed id / typed ref wrapper 持有或复制 | 不得被 sibling 仓 id、HTTP path、topic 名或 title 伪装 |
| `OpaqueRef` | `String` 非空;只表达稳定 body-free pointer | 允许 `to_ref()`、repository key、record linkage、public body-free field 复制 | 不得被当成 external body locator 或 local truth body |
| `OpaqueRefSet` | 保持插入顺序,并按 ref 值去重 | helper set 只提供 ordered unique 语义,不提供业务排序语义 | 不得把重复 ref、free-form string 或 mixed-owner ref 混入同一个 typed set |
| `OpaqueReason` | `String` 非空;只保存解释文本 | 由具体 reason type、新对象构造器或 error helper 包装 | 不得替代 policy result、state enum 或 typed basis ref |

统一约束:

- `String` 必须非空。
- `*RefSet` 保持插入顺序,并按 ref 值去重。
- `*Reason` 只承载解释语义,不承载状态迁移本身。
- 没有在本步被点名为 finite variant 的 `*Reason`,统一采用非空 newtype。
- `Opaque*` 只是底层 Rust-facing primitive,正式 owner 仍然是上层 typed carrier,实现侧不得绕过 typed 名称直接扩散 `Opaque*`。

#### 8.1.2 当前 boundary 必须存在的 carrier family

| family | exact names | 形态 |
|---|---|---|
| truth core id/ref | `ArtifactFactRef`、`ArtifactContentFactContextRef`、`ArtifactVersionRef`、`ArtifactVersionCandidateRef`、`ArtifactLineageLinkRef`、`ArtifactBaselineRef`、`ArtifactBaselineMembershipRef` | `OpaqueRef` |
| boundary/support id/ref | `ArtifactIntakeContextRef`、`ArtifactSubmissionRef`、`ArtifactReviewAnchorRef`、`ArtifactResponsibilityAssignmentRef`、`AutomationArtifactInputRef`、`ConsumableArtifactReferenceRef`、`ArtifactConsumptionBackrefRef` | `OpaqueRef` |
| derived/reference/report id/ref | `ArtifactDerivedViewStateRef`、`ExternalReferenceResolutionStateRef`、`ArtifactFactSummaryViewRef`、`ArtifactVersionSummaryViewRef`、`ArtifactLineageSummaryViewRef`、`ArtifactBaselineSummaryViewRef`、`ArtifactReviewSummaryViewRef`、`ArtifactReadSurfaceViewRef`、`ArtifactPreviewViewRef`、`ArtifactReportViewRef`、`ArtifactReconciliationReportRef` | `OpaqueRef` |
| audit / trace / handoff / refresh id/ref | `ArtifactFactChangeRecordRef`、`ArtifactVersionChangeRecordRef`、`ArtifactLineageChangeRecordRef`、`ArtifactBaselineChangeRecordRef`、`ArtifactInputResolutionRecordRef`、`ArtifactReviewTraceRecordRef`、`AutomationIntakeAuditRecordRef`、`ArtifactTraceRecordRef`、`ArtifactHandoffRecordRef`、`ExternalMirrorRefreshRecordRef` | `OpaqueRef` |
| external/support refs | `ExternalSourceRef`、`ExternalSourceVersionRef`、`SafeSummaryRef`、`LocalMirrorSnapshotRef`、`ArtifactBaselineScopeRef`、`ArtifactConsumerScopeRef`、`ArtifactReportScopeRef`、`ArtifactReconciliationScopeRef`、`ArtifactHandoffChannelRef`、`ArtifactChangeBasisRef`、`ArtifactLineageBasisRef`、`ArtifactResponsibilityBasisRef` | `OpaqueRef` |
| set wrappers | `ArtifactBaselineMembershipRefSet`、`ArtifactLineageLinkRefSet` | `OpaqueRefSet` |
| cursor / digest | `ArtifactTruthCursor`、`SourceDigest` | non-empty newtype |
| non-finite kind newtype | `ArtifactWorkContextKind`、`ArtifactProcessContextKind`、`ArtifactGovernanceContextKind`、`AutomationSourceKind` | non-empty newtype |

| family | formal owner | 主要使用面 | 禁止替代 |
|---|---|---|---|
| truth core id/ref | truth core object | domain truth、query read model、summary view、change record | 不得用 view ref、trace ref、external ref 替代 truth ref |
| boundary/support id/ref | boundary/support object | application input/result、query read model、record linkage | 不得当 truth anchor 或 event payload body 使用 |
| derived/reference/report id/ref | derived view、reference state、report object | query response、projection rebuild、maintenance report | 不得反向读取成 truth id 语义 |
| audit / trace / handoff / refresh id/ref | append-only record object | operations query、traceability expansion、handoff/report linkage | 不得充当当前状态 owner |
| external/support refs | public ref object、policy input、resolver/refresh path | source mapping、report body-free linkage、policy guard | 不得伪装成 local truth id |
| set wrappers | owning aggregate object | baseline/lineage/read model/query assembly | 不得在实现侧退化成裸 `Vec<String>` |
| cursor / digest | truth/derived/reference support object | projection state、report alignment、integrity hint | cursor 不得替代 optimistic version;digest 不得替代 source ref |
| non-finite kind newtype | matching ref / input / support object | selectors、filters、policy input、query assembly | kind 只能分类,不得直接驱动 lifecycle transition |

carrier family red lines:

- 任何 `*Ref` 一旦已经被点名为 formal carrier,实现侧不得回退成裸 `String`、`OpaqueId`、generic `OpaqueRef` 或 sibling 仓 id。
- `*RefSet`、cursor、digest、kind newtype 虽然轻量,但仍属于 design truth source;Step 7+ 不得私补替代 family。
- truth core、support、derived、record 四类 id/ref 只能横向复制,不能跨 family 解释成别的 owner 语义。

### 8.2 public state / kind / relation carrier

#### 8.2.1 truth anchor and core lifecycle carrier

```rust
/// Canonical truth anchor reference used by review, read and handoff surfaces.
pub enum ArtifactTruthAnchorRef {
    Fact(ArtifactFactRef),
    Version(ArtifactVersionRef),
    Lineage(ArtifactLineageLinkRef),
    Baseline(ArtifactBaselineRef),
}

/// Stable content source classification.
pub enum ArtifactContentSourceKind {
    ManualSubmission,
    ExternalBody,
    WorkOutput,
    ProcessOutput,
    GovernanceEvidence,
    AutomationCandidate,
}

/// Canonical intake classification.
pub enum ArtifactIntakeKind {
    Manual,
    ExternalSync,
    WorkContext,
    ProcessContext,
    GovernanceContext,
    Automation,
}
```

```rust
/// Lifecycle of an artifact fact.
pub enum ArtifactFactState {
    PendingIntake,
    Established,
    Suspended,
    Closed,
}

/// Lifecycle of a content fact context.
pub enum ArtifactContentFactContextState {
    Linked,
    PendingCheck,
    Verified,
    Unavailable,
}

/// Lifecycle of a formal artifact version.
pub enum ArtifactVersionState {
    Candidate,
    Published,
    Superseded,
    Frozen,
    Retired,
}

/// Lifecycle of a version candidate.
pub enum ArtifactVersionCandidateState {
    Open,
    ReadyToPublish,
    Rejected,
    Superseded,
}

/// Semantic kind of a lineage relation.
pub enum ArtifactLineageRelationKind {
    Source,
    Supersedes,
    DependsOn,
    Impacts,
}

/// Lifecycle of a lineage link.
pub enum ArtifactLineageState {
    PendingBasis,
    Established,
    Rejected,
    Retired,
}

/// Lifecycle of a baseline.
pub enum ArtifactBaselineState {
    Candidate,
    Frozen,
    Superseded,
    Retired,
}

/// Lifecycle of a baseline membership.
pub enum ArtifactBaselineMembershipState {
    Selected,
    Frozen,
    Removed,
}
```

| carrier | 作用 | 允许使用方 |
|---|---|---|
| `ArtifactTruthAnchorRef` | 在 review、consumption、trace、handoff 中唯一表达 truth subject | `domain`、`api`、`worker`、`jobs`、public DTO |
| `ArtifactFactState`~`ArtifactBaselineMembershipState` | 作为 truth object、summary view、change record 和后续状态矩阵的唯一状态基线 | `domain` + `contracts` |
| `ArtifactLineageRelationKind` | 作为 lineage truth 和 later flow selector 的唯一关系分类 | `domain` + `contracts` |

truth core carrier red lines:

- `ArtifactTruthAnchorRef` 只承载已成立 truth subject,不得指向 candidate、view、report、trace 或外部对象。
- `ArtifactFactState` 到 `ArtifactBaselineMembershipState` 只能由对应 truth object 成员函数推进,不得由 projection、query、consumer、job 或 record 反向改写。
- `ArtifactLineageRelationKind` 只描述关系语义,不替代 `ArtifactLineageState` 或 basis judgment。

#### 8.2.2 boundary / support lifecycle carrier

```rust
/// Lifecycle of an intake context.
pub enum ArtifactIntakeState {
    Received,
    Resolved,
    PendingReference,
    Rejected,
    Transferred,
}

/// Lifecycle of a submission record.
pub enum ArtifactSubmissionState {
    Received,
    Accepted,
    Rejected,
    Superseded,
}

/// Lifecycle of a review anchor.
pub enum ArtifactReviewState {
    Draft,
    Ready,
    PendingResponsibility,
    Closed,
    Invalid,
}

/// Lifecycle of a responsibility assignment.
pub enum ArtifactResponsibilityAssignmentState {
    Pending,
    Assigned,
    Accepted,
    Released,
    Invalid,
}

/// Lifecycle of an automation input.
pub enum AutomationArtifactInputState {
    Received,
    Accepted,
    PendingReview,
    Rejected,
    Superseded,
}

/// Lifecycle of a consumable reference.
pub enum ConsumableArtifactReferenceState {
    Ready,
    Restricted,
    Stale,
    Unavailable,
}

/// Lifecycle of a consumption backref.
pub enum ArtifactConsumptionBackrefState {
    Recorded,
    Explained,
    Stale,
    Retired,
}
```

```rust
/// Definition source classification.
pub enum ArtifactDefinitionKind {
    ArtifactKind,
    WorkProductDefinition,
    MethodDefinition,
}

/// External reference family used by mirror/resolution logic.
pub enum ArtifactExternalReferenceKind {
    Definition,
    WorkContext,
    ProcessContext,
    GovernanceContext,
    ContentSource,
    AutomationSource,
}

/// Automation candidate classification.
pub enum AutomationArtifactCandidateKind {
    CandidateFact,
    CandidateVersion,
    CandidateLineage,
}

/// Adjacent consumer classification.
pub enum AdjacentConsumerKind {
    Work,
    Process,
    Governance,
    Workspace,
    Conversation,
    Archive,
    Observability,
    Sync,
    Sdk,
}
```

| carrier family | formal owner object | 允许复制到哪里 | 禁止 shortcut |
|---|---|---|---|
| `ArtifactIntakeState` | `ArtifactIntakeContext` | intake result、input resolution record、state matrix | 不能用 external resolution state 或 submission state 代替 intake state |
| `ArtifactSubmissionState` | `ArtifactSubmissionRecord` | query read model、audit/report view | 不能反推 candidate/version/fact truth 已成立 |
| `ArtifactReviewState` | `ArtifactReviewAnchor` | review summary、review trace record、state matrix | 不能被 assignment state 或 read surface state 替代 |
| `ArtifactResponsibilityAssignmentState` | `ArtifactResponsibilityAssignment` | review summary、review trace record | 不能直接等于 review 通过或 truth accepted |
| `AutomationArtifactInputState` | `AutomationArtifactInput` | automation audit、query/read model | 不能直接 establish fact/version/lineage/baseline |
| `ConsumableArtifactReferenceState` | `ConsumableArtifactReference` | read surface、handoff/consumer path | 不能改写 truth lifecycle |
| `ArtifactConsumptionBackrefState` | `ArtifactConsumptionBackref` | traceability query、read surface expansion | 不能替代 `ArtifactTraceState` 或 handoff state |
| `ArtifactDefinitionKind`~`AdjacentConsumerKind` | matching ref / input object | selectors、query filters、application mapper | kind 只分类,不得单独驱动 truth transition |

boundary / support carrier red lines:

- `PendingReference`、`PendingReview`、`Restricted`、`Stale` 这类 state 只能表达 support boundary 观察,不得静默升级为 truth accepted。
- `ArtifactDefinitionKind`、`ArtifactExternalReferenceKind`、`AutomationArtifactCandidateKind`、`AdjacentConsumerKind` 只做分类,不得充当 reason、policy result 或 lifecycle state。
- support state 可以被 query / report / record 复制,但 owner 始终留在对应 support object,不得由 DTO 或 record 反向定义。

#### 8.2.3 derived / read / report lifecycle carrier

```rust
/// Generic lifecycle for summary views.
pub enum ArtifactSummaryViewState {
    Ready,
    Stale,
    Unavailable,
}

/// Public read surface lifecycle.
pub enum ArtifactReadSurfaceState {
    Ready,
    Restricted,
    Stale,
    Unavailable,
}

/// Preview lifecycle.
pub enum ArtifactPreviewState {
    Ready,
    Stale,
    Rebuilding,
    Unavailable,
}

/// Report lifecycle.
pub enum ArtifactReportState {
    Ready,
    Stale,
    Generating,
    Unavailable,
}

/// Derived freshness lifecycle.
pub enum ArtifactDerivedFreshnessState {
    Fresh,
    Stale,
    Rebuilding,
    Unavailable,
    Failed,
}

/// External resolution lifecycle.
pub enum ArtifactExternalResolutionState {
    Pending,
    Resolved,
    Stale,
    Unresolved,
    Waiting,
    Failed,
}

/// Reconciliation lifecycle.
pub enum ArtifactReconciliationState {
    Clean,
    GapDetected,
    Stale,
    Failed,
}

/// Handoff delivery lifecycle.
pub enum ArtifactHandoffState {
    Prepared,
    Delivered,
    Failed,
    Retryable,
}

/// Local mirror refresh lifecycle.
pub enum ArtifactMirrorRefreshState {
    Recorded,
    Refreshed,
    Stale,
    Failed,
}

/// Traceable consumption or handoff operation kind.
pub enum ArtifactTraceOperationKind {
    Read,
    Export,
    ArchiveHandoff,
    ObservabilityHandoff,
    SyncHandoff,
}

/// Derived view family.
pub enum ArtifactDerivedViewKind {
    Preview,
    Report,
    Reconciliation,
    HandoffMaterial,
}

/// Append-only trace state.
pub enum ArtifactTraceState {
    Recorded,
    Explained,
    Failed,
}

/// Latest derived maintenance outcome.
pub enum ArtifactDerivedJobOutcome {
    Succeeded,
    Skipped,
    Failed,
    Retryable,
}

/// Intake audit action category.
pub enum AutomationAuditKind {
    BoundaryChecked,
    RoutedToReview,
    AcceptedToIntake,
    Rejected,
}

/// Intake audit action result.
pub enum AutomationAuditResult {
    Accepted,
    PendingReview,
    Rejected,
    Failed,
}

/// Intake resolution action category.
pub enum ArtifactInputResolutionKind {
    ResolveSource,
    ResolveDefinition,
    ResolveContext,
    BoundaryCheck,
    TransferToTruthWrite,
}

/// Intake resolution outcome.
pub enum ArtifactInputResolutionResult {
    Accepted,
    PendingReference,
    Rejected,
    Deferred,
}

/// Review trace event category.
pub enum ArtifactReviewTraceKind {
    ReviewReady,
    ResponsibilityAssigned,
    ResponsibilityAccepted,
    ReviewClosed,
    ReviewInvalidated,
}
```

| carrier family | formal owner object | 允许复制到哪里 | 禁止 shortcut |
|---|---|---|---|
| `ArtifactSummaryViewState` | summary view object | public DTO、query response、state matrix | 不能替代 truth state |
| `ArtifactReadSurfaceState` | `ArtifactReadSurfaceView` | read surface response、visibility/report output | 不能替代 authorization 或 truth availability source |
| `ArtifactPreviewState` / `ArtifactReportState` | corresponding derived view object | query response、job report | 不能直接触发 rebuild / repair truth |
| `ArtifactDerivedFreshnessState` | `ArtifactDerivedViewState` | preview/report/reconciliation assembly | 不能替代 business lifecycle |
| `ArtifactExternalResolutionState` | `ExternalReferenceResolutionState` | intake policy、refresh record、reference query | unresolved/stale/failed 不能直接写真相 |
| `ArtifactReconciliationState` | `ArtifactReconciliationReport` | report read model、operations query | 只能报告 gap,不能自动修复 |
| `ArtifactHandoffState` / `ArtifactMirrorRefreshState` / `ArtifactTraceState` | corresponding append-only record object | operations query、handoff/trace read path | 只能追加新记录,不得反写旧 record 或 truth |
| `ArtifactTraceOperationKind` / `ArtifactDerivedViewKind` / `ArtifactDerivedJobOutcome` / `AutomationAuditKind` / `AutomationAuditResult` / `ArtifactInputResolutionKind` / `ArtifactInputResolutionResult` / `ArtifactReviewTraceKind` | matching record/state object | record append、query/report surface | kind/result 只解释动作与结果,不得伪装成 truth state |

derived / report carrier red lines:

- `Ready` / `Fresh` 只说明当前 read/projection surface 可用,不说明 truth 最近一次 command 成功。
- `Failed` / `Unavailable` 必须显式可见,不得在 query 或 report 中被伪装成 `Ready`。
- record-side kind/result/state family 只解释 append-only 事件,不能反向成为 truth transition owner。

### 8.3 public reference object contract

#### `ArtifactContentSourceRef`

```rust
/// Stable pointer to an external content source without owning the body.
pub struct ArtifactContentSourceRef {
    pub source_kind: ArtifactContentSourceKind,
    pub external_ref: ExternalSourceRef,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    pub source_digest: Option<SourceDigest>,
}
```

| 字段 | 作用 | 来源 |
|---|---|---|
| `source_kind` | 定义来源类别 | sync / async input + intake normalization |
| `external_ref` | 指向外部稳定位置 | resolver / entry copy |
| `source_version_ref` | 标记外部版本 | resolver snapshot copy |
| `source_digest` | 标记内容完整性线索 | resolver snapshot copy 或 accepted input |

| 成员函数签名 | 作用 |
|---|---|
| `fn same_source(&self, other: &Self) -> bool` | 判断是否指向同一外部来源 |
| `fn is_body_location(&self) -> bool` | 判断该 ref 是否代表正文位置 |

| 禁止事项 | 说明 |
|---|---|
| 不保存正文副本 | 只允许 ref / version / digest |
| 不拥有外部生命周期 | 失效时只能 unresolved / stale / waiting |

#### 8.3.1 external context / adjacent reference 通用落码边界

除 `ArtifactContentSourceRef` 外,其余 external context / adjacent reference 也都属于 `contracts` body-free pointer object。它们只能表达“外部稳定锚点 + 已闭口的轻量 summary / scope / channel 信息”,不能拥有外部 truth、正文或 runtime mutable state。

统一约束:

- 上述对象都不拥有外部 truth。
- 除 `AdjacentConsumerRef.consumer_kind` 外,其余 `*_kind` 当前 boundary 采用非空 newtype 承载,不引入额外未在 `02` 收稳的 finite enum 族。
- `summary_ref` 只指向 safe summary,不指向正文。
- `external_ref` 只能引用正式外部稳定位置,不得退化成临时 URL、cache key、trace id 或日志片段。
- `execution_ref`、`channel_ref`、`consumption_scope_ref` 只表达 body-free linkage,不得替代 truth anchor。

##### `ArtifactDefinitionRef`

```rust
pub struct ArtifactDefinitionRef {
    pub definition_kind: ArtifactDefinitionKind,
    pub external_ref: ExternalSourceRef,
    pub definition_version_ref: Option<ExternalSourceVersionRef>,
    pub summary_ref: Option<SafeSummaryRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `definition_kind` | method-library definition 分类;来自正式 definition resolver / accepted input normalization |
| `external_ref` | 指向 method-library 定义外部锚点 |
| `definition_version_ref` | 仅当外部定义具备稳定 version identity 时为 `Some` |
| `summary_ref` | 仅允许 safe summary,不得指向 definition body |

| helper | 作用 |
|---|---|
| `fn same_definition_source(&self, other: &Self) -> bool` | 判断是否指向同一定义来源 |
| `fn has_version_hint(&self) -> bool` | 判断是否携带 definition version |
| `fn has_safe_summary(&self) -> bool` | 判断是否携带 safe summary |

| 红线 | 说明 |
|---|---|
| 不拥有 definition truth | 正式定义 truth 仍在 method-library |
| 不保存 definition body | 只能引用外部锚点和 safe summary |

##### `ArtifactWorkContextRef`

```rust
pub struct ArtifactWorkContextRef {
    pub work_context_kind: ArtifactWorkContextKind,
    pub external_ref: ExternalSourceRef,
    pub summary_ref: Option<SafeSummaryRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `work_context_kind` | 非空 newtype;由 work context resolver / accepted input normalization 提供 |
| `external_ref` | 指向正式 work context 外部锚点 |
| `summary_ref` | 仅允许 safe summary |

| helper | 作用 |
|---|---|
| `fn same_work_context(&self, other: &Self) -> bool` | 判断是否指向同一 work context |
| `fn has_safe_summary(&self) -> bool` | 判断是否携带 safe summary |

| 红线 | 说明 |
|---|---|
| 不拥有 work truth | 正式 work state 在相邻 work 边界 |
| 不保存 work body | 只能保存外部锚点和安全摘要 |

##### `ArtifactProcessContextRef`

```rust
pub struct ArtifactProcessContextRef {
    pub process_context_kind: ArtifactProcessContextKind,
    pub external_ref: ExternalSourceRef,
    pub summary_ref: Option<SafeSummaryRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `process_context_kind` | 非空 newtype;来自 process context resolver / accepted normalization |
| `external_ref` | 指向正式 process context 外部锚点 |
| `summary_ref` | 仅允许 safe summary |

| helper | 作用 |
|---|---|
| `fn same_process_context(&self, other: &Self) -> bool` | 判断是否指向同一 process context |
| `fn has_safe_summary(&self) -> bool` | 判断是否携带 safe summary |

| 红线 | 说明 |
|---|---|
| 不拥有 process truth | process truth 仍在相邻 process 边界 |
| 不保存 process body | 只能保存外部锚点和安全摘要 |

##### `ArtifactGovernanceContextRef`

```rust
pub struct ArtifactGovernanceContextRef {
    pub governance_context_kind: ArtifactGovernanceContextKind,
    pub external_ref: ExternalSourceRef,
    pub summary_ref: Option<SafeSummaryRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `governance_context_kind` | 非空 newtype;来自 governance context resolver / accepted normalization |
| `external_ref` | 指向正式 governance context 外部锚点 |
| `summary_ref` | 仅允许 safe summary |

| helper | 作用 |
|---|---|
| `fn same_governance_context(&self, other: &Self) -> bool` | 判断是否指向同一 governance context |
| `fn has_safe_summary(&self) -> bool` | 判断是否携带 safe summary |

| 红线 | 说明 |
|---|---|
| 不拥有 governance truth | governance truth 仍在相邻 governance 边界 |
| 不保存 governance body | 只能保存外部锚点和安全摘要 |

##### `AutomationSourceRef`

```rust
pub struct AutomationSourceRef {
    pub automation_kind: AutomationSourceKind,
    pub external_ref: ExternalSourceRef,
    pub execution_ref: Option<OpaqueRef>,
    pub source_digest: Option<SourceDigest>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `automation_kind` | 非空 newtype;表达 runtime / capability / tool 来源分类 |
| `external_ref` | 指向自动化来源锚点 |
| `execution_ref` | 仅当存在稳定 execution identity 时为 `Some`;不得替代 truth id |
| `source_digest` | 仅保存 body-free 完整性线索 |

| helper | 作用 |
|---|---|
| `fn same_execution(&self, other: &Self) -> bool` | 判断是否来自同一次自动化执行 |
| `fn has_digest(&self) -> bool` | 判断是否携带 digest |
| `fn is_runtime_generated(&self) -> bool` | 判断是否属于 runtime / capability / tool 产生来源 |

| 红线 | 说明 |
|---|---|
| 不保存 runtime output body | 只能引用来源锚点、执行锚点和 digest |
| execution ref 不是 truth anchor | 不得用 `execution_ref` 直接建立 fact / version truth |

##### `AdjacentConsumerRef`

```rust
pub struct AdjacentConsumerRef {
    pub consumer_kind: AdjacentConsumerKind,
    pub external_ref: ExternalSourceRef,
    pub consumption_scope_ref: ArtifactConsumerScopeRef,
    pub channel_ref: Option<ArtifactHandoffChannelRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `consumer_kind` | 当前 boundary 唯一允许的 finite enum consumer 分类 |
| `external_ref` | 指向下游 consumer 或 handoff target 外部锚点 |
| `consumption_scope_ref` | 正式消费范围锚点;不得退化成 free-form string |
| `channel_ref` | 仅当当前 consumer 通过正式 handoff channel 消费时为 `Some` |

| helper | 作用 |
|---|---|
| `fn same_consumer(&self, other: &Self) -> bool` | 判断是否指向同一消费方 |
| `fn covers_scope(&self, consumption_scope_ref: &ArtifactConsumerScopeRef) -> bool` | 判断是否覆盖指定消费范围 |
| `fn is_handoff_target(&self) -> bool` | 判断是否具备正式 handoff channel |

| 红线 | 说明 |
|---|---|
| 不替代消费 truth | 正式消费事实仍由 `ConsumableArtifactReference` / `ArtifactConsumptionBackref` / `ArtifactTraceRecord` 表达 |
| 不保存 consumer body | 只能保存外部锚点、scope 和可选 channel |

### 8.4 public view / report carrier

public view / report 全部归 `contracts` public surface。它们只能保存 body-free ref、summary state、derived freshness marker 和 `truth_cursor`,不得接收 `domain` object、external body、policy object、repository handle 或 runtime local state。loaded truth 到 public field 的复制由 Step 7 query assembler / projection builder 承担,本节只闭口 exact carrier、纯 helper 和 red line。

#### 8.4.1 public view / report 通用落码边界

| 规则 | 说明 |
|---|---|
| query no-write | view / report 只表达读取结果,不得在 helper 内 mark stale、refresh snapshot、append trace 或 repair truth |
| body-free only | 只能保存 typed ref、state、cursor、count 和已闭口 marker,不得保存 artifact body、work body、governance body、runtime output 或 external payload |
| cursor opaque | `ArtifactTruthCursor` 只表示该 view / report 覆盖的 truth position,不得当 optimistic version 或业务状态 |
| state not truth | `ArtifactSummaryViewState`、`ArtifactReadSurfaceState`、`ArtifactPreviewState`、`ArtifactReportState`、`ArtifactReconciliationState` 只表达 public readability / maintenance outcome,不得替代 truth lifecycle |
| rebuildable | summary / preview / report 必须可由 committed truth、derived state 和正式 query assembly 重建 |
| contracts no-domain | `contracts` view factory 只接收 typed ref / state / cursor 等字段,不得接收 `ArtifactFact`、`ArtifactVersion`、`ArtifactReviewAnchor` 等 domain object |

#### 8.4.2 summary view object contracts

##### `ArtifactFactSummaryView`

```rust
/// Public summary of one formal Artifact fact.
pub struct ArtifactFactSummaryView {
    pub view_ref: ArtifactFactSummaryViewRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub fact_state: ArtifactFactState,
    pub current_version_ref: Option<ArtifactVersionRef>,
    pub truth_cursor: ArtifactTruthCursor,
    pub summary_state: ArtifactSummaryViewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成;不替代 `ArtifactFactRef` |
| `artifact_fact_ref` | application query assembler 从 loaded fact truth 复制后传入 |
| `fact_state` | 从 `ArtifactFact.fact_state` 复制;不得靠 trace / report / entry hint 推断 |
| `current_version_ref` | 从 `ArtifactFact.current_version_ref` 复制;空值表示尚无正式 current version |
| `truth_cursor` | 来自 committed truth cursor 或 accepted rebuild cursor |
| `summary_state` | 只表达 summary 可读性和 freshness,不得替代 `ArtifactFactState` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactFactSummaryViewRef` | 返回 view ref |
| `fn matches_fact(&self, artifact_fact_ref: &ArtifactFactRef) -> bool` | 判断是否属于指定 fact |
| `fn has_current_version(&self) -> bool` | 判断是否已有 current version |
| `fn is_stale(&self) -> bool` | `summary_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactFactSummaryViewRef, artifact_fact_ref: ArtifactFactRef, fact_state: ArtifactFactState, current_version_ref: Option<ArtifactVersionRef>, truth_cursor: ArtifactTruthCursor, summary_state: ArtifactSummaryViewState) -> Self` | 从已投影字段构造 fact summary |

| 红线 | 说明 |
|---|---|
| 不替代 fact truth | 当前事实状态仍以 `ArtifactFact` 为准 |
| 不保存内容正文 | 只允许 `ArtifactFactRef` 和 `current_version_ref` 等 body-free field |

##### `ArtifactVersionSummaryView`

```rust
/// Public summary of one formal Artifact version.
pub struct ArtifactVersionSummaryView {
    pub view_ref: ArtifactVersionSummaryViewRef,
    pub artifact_version_ref: ArtifactVersionRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub version_state: ArtifactVersionState,
    pub truth_cursor: ArtifactTruthCursor,
    pub summary_state: ArtifactSummaryViewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `artifact_version_ref` / `artifact_fact_ref` | application query assembler 从 loaded version truth 复制 |
| `version_state` | 从 `ArtifactVersion.version_state` 复制;不得从 change record 或 current latest 反推 |
| `truth_cursor` / `summary_state` | 来自 committed truth / rebuild accepted cursor 和 summary read state |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactVersionSummaryViewRef` | 返回 view ref |
| `fn matches_version(&self, artifact_version_ref: &ArtifactVersionRef) -> bool` | 判断是否属于指定 version |
| `fn belongs_to_fact(&self, artifact_fact_ref: &ArtifactFactRef) -> bool` | 判断是否属于指定 fact |
| `fn is_stale(&self) -> bool` | `summary_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactVersionSummaryViewRef, artifact_version_ref: ArtifactVersionRef, artifact_fact_ref: ArtifactFactRef, version_state: ArtifactVersionState, truth_cursor: ArtifactTruthCursor, summary_state: ArtifactSummaryViewState) -> Self` | 从已投影字段构造 version summary |

| 红线 | 说明 |
|---|---|
| 不替代 version truth | 当前 lifecycle 仍以 `ArtifactVersion` 为准 |
| 不把 candidate 当正式版本 | view 只能摘要正式 `ArtifactVersionRef` |

##### `ArtifactLineageSummaryView`

```rust
/// Public summary of formal lineage relations for one Artifact version anchor.
pub struct ArtifactLineageSummaryView {
    pub view_ref: ArtifactLineageSummaryViewRef,
    pub artifact_version_ref: ArtifactVersionRef,
    pub relation_refs: ArtifactLineageLinkRefSet,
    pub truth_cursor: ArtifactTruthCursor,
    pub summary_state: ArtifactSummaryViewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `artifact_version_ref` | lineage query assembler 从 requested / loaded version anchor 复制 |
| `relation_refs` | 从 committed `ArtifactLineageLink` set 投影;ordered unique;不保存 relation body |
| `truth_cursor` / `summary_state` | 来自 lineage projection state 或 accepted rebuild cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactLineageSummaryViewRef` | 返回 view ref |
| `fn covers_version(&self, artifact_version_ref: &ArtifactVersionRef) -> bool` | 判断是否覆盖指定 version |
| `fn relation_count(&self) -> usize` | 返回 relation ref 数量 |
| `fn is_stale(&self) -> bool` | `summary_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactLineageSummaryViewRef, artifact_version_ref: ArtifactVersionRef, relation_refs: ArtifactLineageLinkRefSet, truth_cursor: ArtifactTruthCursor, summary_state: ArtifactSummaryViewState) -> Self` | 从已投影字段构造 lineage summary |

| 红线 | 说明 |
|---|---|
| 不保存 basis body | `relation_refs` 只引用 lineage truth |
| 空集合不是错误 | 空 `relation_refs` 表示当前无已知 formal lineage |

##### `ArtifactBaselineSummaryView`

```rust
/// Public summary of one controlled Artifact baseline.
pub struct ArtifactBaselineSummaryView {
    pub view_ref: ArtifactBaselineSummaryViewRef,
    pub artifact_baseline_ref: ArtifactBaselineRef,
    pub member_count: u32,
    pub truth_cursor: ArtifactTruthCursor,
    pub summary_state: ArtifactSummaryViewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `artifact_baseline_ref` | application query assembler 从 loaded baseline truth 复制 |
| `member_count` | 从 committed `ArtifactBaselineMembership` count 投影;不得运行期扫描 current latest 猜算 |
| `truth_cursor` / `summary_state` | 来自 baseline projection state 或 accepted rebuild cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactBaselineSummaryViewRef` | 返回 view ref |
| `fn matches_baseline(&self, artifact_baseline_ref: &ArtifactBaselineRef) -> bool` | 判断是否属于指定 baseline |
| `fn has_members(&self) -> bool` | `member_count > 0` 时返回 true |
| `fn is_stale(&self) -> bool` | `summary_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactBaselineSummaryViewRef, artifact_baseline_ref: ArtifactBaselineRef, member_count: u32, truth_cursor: ArtifactTruthCursor, summary_state: ArtifactSummaryViewState) -> Self` | 从已投影字段构造 baseline summary |

| 红线 | 说明 |
|---|---|
| 不替代 baseline truth | 当前 lifecycle 仍以 `ArtifactBaseline` 为准 |
| 不动态解析 current version | member count 必须来自正式 membership |

##### `ArtifactReviewSummaryView`

```rust
/// Public summary of one Artifact review anchor and optional responsibility context.
pub struct ArtifactReviewSummaryView {
    pub view_ref: ArtifactReviewSummaryViewRef,
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
    pub truth_cursor: ArtifactTruthCursor,
    pub summary_state: ArtifactSummaryViewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `review_anchor_ref` | application query assembler 从 loaded review anchor 复制 |
| `responsibility_assignment_ref` | 从 loaded review / assignment context 复制;空值表示尚未闭口责任承担 |
| `truth_cursor` / `summary_state` | 来自 review projection state 或 accepted rebuild cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactReviewSummaryViewRef` | 返回 view ref |
| `fn matches_review_anchor(&self, review_anchor_ref: &ArtifactReviewAnchorRef) -> bool` | 判断是否属于指定 review anchor |
| `fn has_assignment(&self) -> bool` | 判断是否存在责任承担锚点 |
| `fn is_stale(&self) -> bool` | `summary_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactReviewSummaryViewRef, review_anchor_ref: ArtifactReviewAnchorRef, responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>, truth_cursor: ArtifactTruthCursor, summary_state: ArtifactSummaryViewState) -> Self` | 从已投影字段构造 review summary |

| 红线 | 说明 |
|---|---|
| 不替代 review / assignment truth | 当前状态仍由 `ArtifactReviewAnchor` 和 `ArtifactResponsibilityAssignment` 表达 |
| 不把 summary 当 review basis | 只读摘要不能反向驱动审核通过 |

#### 8.4.3 derived read / report object contracts

##### `ArtifactReadSurfaceView`

```rust
/// Public read surface assembled from a consumable truth anchor.
pub struct ArtifactReadSurfaceView {
    pub view_ref: ArtifactReadSurfaceViewRef,
    pub consumable_ref: ConsumableArtifactReferenceRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub surface_state: ArtifactReadSurfaceState,
    pub trace_ref: Option<ArtifactTraceRecordRef>,
    pub truth_cursor: ArtifactTruthCursor,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `consumable_ref` | 从 committed `ConsumableArtifactReference` 复制 |
| `truth_anchor_ref` | 从 `ConsumableArtifactReference.truth_anchor_ref` 或等价 accepted query source 复制 |
| `surface_state` | 只表达 ready / restricted / stale / unavailable public read state |
| `trace_ref` | 仅当当前 read surface 已有正式 trace linkage 时为 `Some` |
| `truth_cursor` | 来自 committed truth cursor 或 accepted rebuild cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactReadSurfaceViewRef` | 返回 view ref |
| `fn covers_truth_anchor(&self, truth_anchor_ref: &ArtifactTruthAnchorRef) -> bool` | 判断是否覆盖指定 truth anchor |
| `fn is_restricted(&self) -> bool` | `surface_state == Restricted` 时返回 true |
| `fn has_trace(&self) -> bool` | 判断是否已关联正式 trace |
| `fn from_fields(view_ref: ArtifactReadSurfaceViewRef, consumable_ref: ConsumableArtifactReferenceRef, truth_anchor_ref: ArtifactTruthAnchorRef, surface_state: ArtifactReadSurfaceState, trace_ref: Option<ArtifactTraceRecordRef>, truth_cursor: ArtifactTruthCursor) -> Self` | 从已投影字段构造 read surface |

| 红线 | 说明 |
|---|---|
| 只输出,不回写真相 | view 不能 mark stale、refresh snapshot 或 repair truth |
| restricted 不改变 truth | `Restricted` 只影响当前 read surface |

##### `ArtifactPreviewView`

```rust
/// Read-only preview material for a committed truth anchor.
pub struct ArtifactPreviewView {
    pub view_ref: ArtifactPreviewViewRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub derived_state_ref: ArtifactDerivedViewStateRef,
    pub preview_state: ArtifactPreviewState,
    pub truth_cursor: ArtifactTruthCursor,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `truth_anchor_ref` | 从 committed truth anchor 复制 |
| `derived_state_ref` | 从对应 `ArtifactDerivedViewState` 复制;不得私造 local runtime state ref |
| `preview_state` | 只表达 preview readiness / rebuild outcome |
| `truth_cursor` | 来自 derived rebuild accepted cursor 或 underlying committed truth cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactPreviewViewRef` | 返回 view ref |
| `fn covers_truth_anchor(&self, truth_anchor_ref: &ArtifactTruthAnchorRef) -> bool` | 判断是否覆盖指定 truth anchor |
| `fn is_rebuilding(&self) -> bool` | `preview_state == Rebuilding` 时返回 true |
| `fn is_available(&self) -> bool` | `preview_state == Ready` 时返回 true |
| `fn from_fields(view_ref: ArtifactPreviewViewRef, truth_anchor_ref: ArtifactTruthAnchorRef, derived_state_ref: ArtifactDerivedViewStateRef, preview_state: ArtifactPreviewState, truth_cursor: ArtifactTruthCursor) -> Self` | 从已投影字段构造 preview view |

| 红线 | 说明 |
|---|---|
| preview 不是 truth source | 只能消费 committed truth / derived state |
| rebuilding 只能降级 | 不能借 rebuild 路径修正 truth |

##### `ArtifactReportView`

```rust
/// Read-only report surface assembled from committed truth.
pub struct ArtifactReportView {
    pub view_ref: ArtifactReportViewRef,
    pub report_scope_ref: ArtifactReportScopeRef,
    pub report_state: ArtifactReportState,
    pub truth_cursor: ArtifactTruthCursor,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `view_ref` | projection builder / repository 生成 |
| `report_scope_ref` | 从 accepted report query scope 或 report projection scope 复制 |
| `report_state` | 只表达 ready / stale / generating / unavailable report read state |
| `truth_cursor` | 来自 committed truth cursor 或 accepted report build cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactReportViewRef` | 返回 view ref |
| `fn covers_scope(&self, report_scope_ref: &ArtifactReportScopeRef) -> bool` | 判断是否覆盖指定 report scope |
| `fn is_generating(&self) -> bool` | `report_state == Generating` 时返回 true |
| `fn is_stale(&self) -> bool` | `report_state == Stale` 时返回 true |
| `fn from_fields(view_ref: ArtifactReportViewRef, report_scope_ref: ArtifactReportScopeRef, report_state: ArtifactReportState, truth_cursor: ArtifactTruthCursor) -> Self` | 从已投影字段构造 report view |

| 红线 | 说明 |
|---|---|
| report 只是只读输出 | 不得生成或修改 truth |
| 不保存 report body 之外的 sibling 正文 | 只允许 scope / state / cursor 等 body-free field |

##### `ArtifactReconciliationReport`

```rust
/// Read-only reconciliation report. It never repairs truth by itself.
pub struct ArtifactReconciliationReport {
    pub report_ref: ArtifactReconciliationReportRef,
    pub reconciliation_scope_ref: ArtifactReconciliationScopeRef,
    pub reconciliation_state: ArtifactReconciliationState,
    pub finding_count: u32,
    pub truth_cursor: ArtifactTruthCursor,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `report_ref` | reconciliation job / report repository 生成 |
| `reconciliation_scope_ref` | 从 accepted reconciliation scope 复制 |
| `reconciliation_state` | 只表达 clean / gap / stale / failed report outcome |
| `finding_count` | 从正式 reconciliation finding set 计数投影;`0` 表示无已知 finding |
| `truth_cursor` | 来自 reconciliation input cursor 或 accepted report build cursor |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactReconciliationReportRef` | 返回 report ref |
| `fn covers_scope(&self, reconciliation_scope_ref: &ArtifactReconciliationScopeRef) -> bool` | 判断是否覆盖指定 scope |
| `fn has_findings(&self) -> bool` | `finding_count > 0` 时返回 true |
| `fn requires_follow_up(&self) -> bool` | `reconciliation_state != Clean` 或 `finding_count > 0` 时返回 true |
| `fn from_fields(report_ref: ArtifactReconciliationReportRef, reconciliation_scope_ref: ArtifactReconciliationScopeRef, reconciliation_state: ArtifactReconciliationState, finding_count: u32, truth_cursor: ArtifactTruthCursor) -> Self` | 从已投影字段构造 reconciliation report |

| 红线 | 说明 |
|---|---|
| reconciliation 只能报告 gap | 不能自动 repair truth、projection 或 reference state |
| failed report 仍需可见 | `Failed` 不能被伪装成 clean 或 silently dropped |

---

## 9. `domain` truth core 对象契约

### 9.1 统一 domain error carrier

```rust
/// Canonical domain error owned by artifact domain.
pub struct ArtifactDomainError {
    pub code: ArtifactDomainErrorCode,
    pub subject_ref: Option<ArtifactTruthAnchorRef>,
    pub message: String,
}

/// Minimum domain error family fixed in Step 6.
pub enum ArtifactDomainErrorCode {
    InvalidStateTransition,
    MissingRequiredReference,
    BoundaryViolation,
    PolicyRejected,
    DuplicateTruthAnchor,
}
```

```rust
pub type ArtifactDomainResult<T> = Result<T, ArtifactDomainError>;
```

| 字段 | 约束 / 来源 |
|---|---|
| `code` | 只能使用当前 boundary 已闭口的最小 domain error family |
| `subject_ref` | 仅当错误可明确锚定一个 formal truth subject 时为 `Some`;不得指向 view/ref projection 或外部对象 |
| `message` | 非空 explanatory text;只解释 domain failure,不得携带正文、payload 或 adapter log body |

| error code | owner meaning | 典型触发点 | 禁止误用 |
|---|---|---|---|
| `InvalidStateTransition` | 对象状态迁移非法 | truth/support object transition method | 不得拿来表达 infrastructure failure |
| `MissingRequiredReference` | formal ref / basis / linkage 缺失 | truth establish、lineage/baseline/review binding | 不得把 body unavailable 伪装成 missing ref |
| `BoundaryViolation` | 违反 truth ownership / carrier boundary | external body ingest、candidate-only bypass、query no-write bypass | 不得替代 authorization or HTTP error |
| `PolicyRejected` | policy guard 明确拒绝 | policy object `assert_*` path | 不得代替 state transition validation |
| `DuplicateTruthAnchor` | formal truth 主语重复或冲突 | fact establish / current binding / unique anchor path | 不得作为 optimistic version conflict 替身 |

| helper / factory | 作用 |
|---|---|
| `fn for_subject(code: ArtifactDomainErrorCode, subject_ref: ArtifactTruthAnchorRef, message: String) -> Self` | 构造带 formal truth subject 的 domain error |
| `fn without_subject(code: ArtifactDomainErrorCode, message: String) -> Self` | 构造未绑定单一 truth subject 的 domain error |

domain error red lines:

- Step 6 只固定 domain-owned error carrier 和最小 code family。
- Step 12 再把 domain error 映射到 protocol / application / job error surface。
- 后续 Step 不得把 domain error owner 移到 `contracts` 或 `application`。
- domain error 不得携带 external body、event body、stored-result body、trace body 或 adapter exception stack 作为正式字段。

### 9.2 `ArtifactFact`

```rust
/// Canonical artifact truth anchor owned only by L1-artifact.
pub struct ArtifactFact {
    pub artifact_fact_ref: ArtifactFactRef,
    pub definition_ref: ArtifactDefinitionRef,
    pub content_context_ref: ArtifactContentFactContextRef,
    pub intake_context_ref: ArtifactIntakeContextRef,
    pub fact_state: ArtifactFactState,
    pub current_version_ref: Option<ArtifactVersionRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_fact_ref` | application id generator 生成;不得由 definition / source / digest 派生 |
| `definition_ref` | 来自 accepted intake resolution 或正式 definition resolver 结果;不得引用 definition body |
| `content_context_ref` | 指向 same-tx create 或 repository load 的正式内容语境 |
| `intake_context_ref` | 必须回指正式 `ArtifactIntakeContextRef`;建立 truth 时不得脱离收束语境 |
| `fact_state` | 初始为 `PendingIntake`;只能按成员函数推进 |
| `current_version_ref` | 初始为 `None`;只有 formal publish path 才能写入 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn new_pending(artifact_fact_ref: ArtifactFactRef, definition_ref: ArtifactDefinitionRef, content_context_ref: ArtifactContentFactContextRef, intake_context_ref: ArtifactIntakeContextRef) -> Self` | 建立待成立事实骨架 | generated fact ref、definition ref、content context ref、intake context ref | `Self` | 只建立 pending truth anchor;不自动 establish |
| `fn establish(&mut self) -> ArtifactDomainResult<()>` | `PendingIntake -> Established` | 无 | `ArtifactDomainResult<()>` | 使事实进入正式 truth state;不自动创建 version |
| `fn bind_current_version(&mut self, version_ref: ArtifactVersionRef) -> ArtifactDomainResult<()>` | 绑定当前正式版本 | formal version ref | `ArtifactDomainResult<()>` | 更新 `current_version_ref`;不得绑定 candidate ref 或 stale pointer |
| `fn suspend(&mut self, reason: ArtifactFactSuspendReason) -> ArtifactDomainResult<()>` | 将事实挂起 | suspend reason | `ArtifactDomainResult<()>` | 进入 `Suspended`;不删除已存在 version 追溯 |
| `fn close(&mut self, reason: ArtifactFactCloseReason) -> ArtifactDomainResult<()>` | 关闭不再继续演化的事实 | close reason | `ArtifactDomainResult<()>` | 进入 `Closed`;终态后不得重新 establish |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| truth anchor 唯一 | 同一正式事实不能被相邻仓或派生材料重定义 |
| 不拥有正文生命周期 | `ArtifactFact` 只链接 `ArtifactContentFactContext` |
| `current_version_ref` 可空但不可悬空 | 非空时必须回指正式 `ArtifactVersion` |
| fact 不等于 current version | 当前事实主语和当前正式版本是两个不同层次的 formal anchor |
| suspend / close 不抹除追溯 | history / trace / version linkage 仍由 record 与 version object 保留 |

### 9.3 `ArtifactContentFactContext`

```rust
/// Canonical content fact context that separates truth ownership from external body ownership.
pub struct ArtifactContentFactContext {
    pub content_context_ref: ArtifactContentFactContextRef,
    pub content_source_ref: ArtifactContentSourceRef,
    pub content_state: ArtifactContentFactContextState,
    pub source_digest: Option<SourceDigest>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `content_context_ref` | application id generator 生成 |
| `content_source_ref` | 来自 accepted input / resolver copy;只能保存 body-free source pointer |
| `content_state` | 初始为 `Linked`;只能按成员函数推进 |
| `source_digest` | 仅保存正式完整性线索;没有稳定 digest 时可为空 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_source(content_context_ref: ArtifactContentFactContextRef, content_source_ref: ArtifactContentSourceRef) -> Self` | 从内容来源建立语境 | generated context ref、formal content source ref | `Self` | 建立内容语境;不保存正文 |
| `fn verify_source(&mut self, source_digest: SourceDigest) -> ArtifactDomainResult<()>` | 标记来源已验证 | verified digest | `ArtifactDomainResult<()>` | 进入 `Verified`;写入 `source_digest` |
| `fn mark_pending_check(&mut self, reason: ArtifactContentCheckReason) -> ArtifactDomainResult<()>` | 标记待校验 | pending-check reason | `ArtifactDomainResult<()>` | 进入 `PendingCheck`;不得 silently verify |
| `fn mark_unavailable(&mut self, reason: ArtifactContentUnavailableReason) -> ArtifactDomainResult<()>` | 标记内容不可用 | unavailable reason | `ArtifactDomainResult<()>` | 进入 `Unavailable`;不得继续作为 truth body owner |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存正文副本 | 只能保存 ref / digest |
| 不替代 `ArtifactFact` | 只表达内容事实语境 |
| digest 只做完整性线索 | `source_digest` 不得单独替代 source ref 或 formal version |
| unavailable 不改写 fact truth | 只表示内容边界当前不可用,后续处理留给 policy / maintenance / flow |

### 9.4 `ArtifactVersion`

```rust
/// Formal version anchor linked to an established artifact fact.
pub struct ArtifactVersion {
    pub artifact_version_ref: ArtifactVersionRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub content_context_ref: ArtifactContentFactContextRef,
    pub candidate_ref: Option<ArtifactVersionCandidateRef>,
    pub version_state: ArtifactVersionState,
    pub supersedes_version_ref: Option<ArtifactVersionRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_version_ref` | application id generator 生成 |
| `artifact_fact_ref` | 必须绑定一个 formal `ArtifactFactRef`;不得跨 fact 漂移 |
| `content_context_ref` | 指向该正式版本对应的正式内容语境 |
| `candidate_ref` | publish path 必须为 `Some`;历史重建或导入路径才允许 `None` |
| `version_state` | 初始为 `Candidate`;只能按成员函数推进 |
| `supersedes_version_ref` | 仅当当前版本显式替代 prior version 时为 `Some` |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_candidate(artifact_version_ref: ArtifactVersionRef, artifact_fact_ref: ArtifactFactRef, content_context_ref: ArtifactContentFactContextRef, candidate_ref: ArtifactVersionCandidateRef) -> Self` | 从候选修订生成正式版本骨架 | generated version ref、fact ref、content context ref、candidate ref | `Self` | 建立 formal version object;不自动 publish |
| `fn publish(&mut self) -> ArtifactDomainResult<()>` | 将正式版本推进到 `Published` | 无 | `ArtifactDomainResult<()>` | 进入 `Published`;后续可被 fact 绑定为 current version |
| `fn supersede(&mut self, prior_version_ref: ArtifactVersionRef) -> ArtifactDomainResult<()>` | 标记该版本明确替代另一个版本 | prior formal version ref | `ArtifactDomainResult<()>` | 写入 `supersedes_version_ref`;不得指向自身 |
| `fn freeze(&mut self) -> ArtifactDomainResult<()>` | 标记该版本已进入冻结语境 | 无 | `ArtifactDomainResult<()>` | 进入 `Frozen`;提示 baseline / release-like path 使用 |
| `fn retire(&mut self, reason: ArtifactVersionRetireReason) -> ArtifactDomainResult<()>` | 退出主链 | retire reason | `ArtifactDomainResult<()>` | 进入 `Retired`;终态后不得 publish / freeze |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 版本不能脱离 fact 存在 | `artifact_fact_ref` 必填 |
| 不允许 current latest 替代正式 version | 对外正式锚点永远是 `ArtifactVersionRef` |
| supersede 必须显式 | 不允许无声覆盖 |
| publish 不自动成为 current | 是否绑定为 `ArtifactFact.current_version_ref` 仍需显式调用事实对象更新 |
| frozen / retired 仍保留追溯 | terminal-like state 不得删除 candidate / prior-version linkage |

### 9.5 `ArtifactVersionCandidate`

```rust
/// Candidate revision that may later become a formal version.
pub struct ArtifactVersionCandidate {
    pub artifact_version_candidate_ref: ArtifactVersionCandidateRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub proposed_content_context_ref: ArtifactContentFactContextRef,
    pub candidate_source_ref: ArtifactContentSourceRef,
    pub candidate_state: ArtifactVersionCandidateState,
    pub submission_ref: ArtifactSubmissionRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_version_candidate_ref` | application id generator 生成 |
| `artifact_fact_ref` | 必须指向已存在的 `ArtifactFactRef` |
| `proposed_content_context_ref` | 指向候选修订所依据的正式内容语境 |
| `candidate_source_ref` | 从 accepted submission / intake source 复制;不得保存正文 |
| `candidate_state` | 初始为 `Open`;只能按成员函数推进 |
| `submission_ref` | 必须回指产生该候选修订的正式 `ArtifactSubmissionRef` |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_submission(artifact_version_candidate_ref: ArtifactVersionCandidateRef, artifact_fact_ref: ArtifactFactRef, proposed_content_context_ref: ArtifactContentFactContextRef, candidate_source_ref: ArtifactContentSourceRef, submission_ref: ArtifactSubmissionRef) -> Self` | 从已接受提交建立候选修订 | generated ref、fact ref、content context ref、candidate source ref、submission ref | `Self` | 建立 candidate object;不直接写正式 version |
| `fn mark_ready(&mut self) -> ArtifactDomainResult<()>` | 标记可以正式发布 | 无 | `ArtifactDomainResult<()>` | 进入 `ReadyToPublish`;仍不等于已发布 |
| `fn reject(&mut self, reason: ArtifactVersionRejectReason) -> ArtifactDomainResult<()>` | 拒绝候选修订 | reject reason | `ArtifactDomainResult<()>` | 进入 `Rejected`;终态后不得再 ready |
| `fn supersede_by(&mut self, next_candidate_ref: ArtifactVersionCandidateRef) -> ArtifactDomainResult<()>` | 被新候选替代 | next candidate ref | `ArtifactDomainResult<()>` | 进入 `Superseded`;next ref 不得等于自身 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 候选不等于正式版本 | 只能通过 `ArtifactVersion::from_candidate + publish` 成为 truth |
| 候选存在不改变 current version | 不得隐式覆盖 |
| 候选必须可追溯到提交 | `submission_ref` 不得缺失或伪造 |

### 9.6 `ArtifactLineageLink`

```rust
/// Formal lineage relation between two committed artifact versions.
pub struct ArtifactLineageLink {
    pub artifact_lineage_link_ref: ArtifactLineageLinkRef,
    pub source_version_ref: ArtifactVersionRef,
    pub target_version_ref: ArtifactVersionRef,
    pub relation_kind: ArtifactLineageRelationKind,
    pub lineage_state: ArtifactLineageState,
    pub basis_ref: ArtifactLineageBasisRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_lineage_link_ref` | application id generator 生成 |
| `source_version_ref` / `target_version_ref` | 必须都是 formal `ArtifactVersionRef`;不得指向 candidate 或 view |
| `relation_kind` | 只允许当前 boundary 已闭口的 lineage relation family |
| `lineage_state` | 初始为 `PendingBasis`;只能按成员函数推进 |
| `basis_ref` | 正式 lineage basis carrier;不得退化成 trace 文本或工具输出摘要 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn connect(artifact_lineage_link_ref: ArtifactLineageLinkRef, source_version_ref: ArtifactVersionRef, target_version_ref: ArtifactVersionRef, relation_kind: ArtifactLineageRelationKind, basis_ref: ArtifactLineageBasisRef) -> Self` | 建立血缘关系骨架 | generated ref、source/target version refs、relation kind、basis ref | `Self` | 建立 pending lineage truth |
| `fn establish(&mut self) -> ArtifactDomainResult<()>` | `PendingBasis -> Established` | 无 | `ArtifactDomainResult<()>` | 使关系进入正式有效视图 |
| `fn reject(&mut self, reason: ArtifactLineageRejectReason) -> ArtifactDomainResult<()>` | 拒绝无效关系 | reject reason | `ArtifactDomainResult<()>` | 进入 `Rejected`;不得再 establish |
| `fn retire(&mut self, reason: ArtifactLineageRetireReason) -> ArtifactDomainResult<()>` | 使关系退出当前有效视图 | retire reason | `ArtifactDomainResult<()>` | 进入 `Retired`;不得恢复为 established |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 必须锚定正式版本 | `source_version_ref` 和 `target_version_ref` 不可为空 |
| 不允许 trace / tool output 直升 truth | runtime 线索必须先经正式收束 |
| relation kind 不替代状态 | `relation_kind` 只描述关系语义,不表达当前是否有效 |

### 9.7 `ArtifactBaseline`

```rust
/// Controlled frozen set of formal artifact versions.
pub struct ArtifactBaseline {
    pub artifact_baseline_ref: ArtifactBaselineRef,
    pub baseline_scope_ref: ArtifactBaselineScopeRef,
    pub baseline_state: ArtifactBaselineState,
    pub membership_refs: ArtifactBaselineMembershipRefSet,
    pub freeze_context_ref: ArtifactReviewAnchorRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_baseline_ref` | application id generator 生成 |
| `baseline_scope_ref` | 正式 baseline scope carrier;不得退化成 free-form label |
| `baseline_state` | 初始为 `Candidate`;只能按成员函数推进 |
| `membership_refs` | ordered unique;只允许 formal membership refs |
| `freeze_context_ref` | 必须回指正式 `ArtifactReviewAnchorRef`;不得为空 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_members(artifact_baseline_ref: ArtifactBaselineRef, baseline_scope_ref: ArtifactBaselineScopeRef, membership_refs: ArtifactBaselineMembershipRefSet, freeze_context_ref: ArtifactReviewAnchorRef) -> Self` | 从候选成员集合建立基线 | generated ref、scope ref、membership refs、freeze context ref | `Self` | 建立候选 baseline |
| `fn freeze(&mut self) -> ArtifactDomainResult<()>` | `Candidate -> Frozen` | 无 | `ArtifactDomainResult<()>` | 进入受控冻结状态 |
| `fn supersede(&mut self) -> ArtifactDomainResult<()>` | `Frozen -> Superseded` | 无 | `ArtifactDomainResult<()>` | 退出当前主基线位置 |
| `fn retire(&mut self, reason: ArtifactBaselineRetireReason) -> ArtifactDomainResult<()>` | 退出主链 | retire reason | `ArtifactDomainResult<()>` | 进入 `Retired`;不得再 freeze |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 成员只能是正式版本 | candidate / current latest 均不允许直接入 baseline |
| baseline 不允许动态解析 current version | `membership_refs` 必须显式冻结 |
| freeze context 必须正式化 | `freeze_context_ref` 不得用 report/view/trace ref 代替 |

### 9.8 `ArtifactBaselineMembership`

```rust
/// Membership of a formal version within a controlled baseline.
pub struct ArtifactBaselineMembership {
    pub artifact_baseline_membership_ref: ArtifactBaselineMembershipRef,
    pub artifact_baseline_ref: ArtifactBaselineRef,
    pub artifact_version_ref: ArtifactVersionRef,
    pub membership_state: ArtifactBaselineMembershipState,
    pub membership_reason: ArtifactBaselineMembershipReason,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_baseline_membership_ref` | application id generator 生成 |
| `artifact_baseline_ref` | 必须指向正式 `ArtifactBaselineRef` |
| `artifact_version_ref` | 必须指向 formal `ArtifactVersionRef` |
| `membership_state` | 初始为 `Selected`;只能按成员函数推进 |
| `membership_reason` | 正式成员选择依据;不得用 free-form note 代替 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn select(artifact_baseline_membership_ref: ArtifactBaselineMembershipRef, artifact_baseline_ref: ArtifactBaselineRef, artifact_version_ref: ArtifactVersionRef, membership_reason: ArtifactBaselineMembershipReason) -> Self` | 建立候选成员 | generated ref、baseline ref、version ref、membership reason | `Self` | 建立 baseline membership 选择项 |
| `fn freeze_member(&mut self) -> ArtifactDomainResult<()>` | `Selected -> Frozen` | 无 | `ArtifactDomainResult<()>` | 表示该成员已随 baseline 正式冻结 |
| `fn remove(&mut self, reason: ArtifactBaselineMembershipRemoveReason) -> ArtifactDomainResult<()>` | 冻结前移出 | remove reason | `ArtifactDomainResult<()>` | 进入 `Removed`;冻结后不得再 remove |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| member 只锚定 formal version | 不得用 candidate 或 current latest 替代 `artifact_version_ref` |
| member 不单独表达 baseline truth | 当前 baseline lifecycle 仍由 `ArtifactBaseline` 表达 |
| removed member 不能静默恢复 | 需要重新进入 baseline 时必须创建新 membership |

---

## 10. `domain` boundary / context 支撑对象契约

### 10.1 `ArtifactIntakeContext`

```rust
/// Unified intake convergence context before truth write starts.
pub struct ArtifactIntakeContext {
    pub artifact_intake_context_ref: ArtifactIntakeContextRef,
    pub source_ref: ArtifactContentSourceRef,
    pub intake_kind: ArtifactIntakeKind,
    pub intake_state: ArtifactIntakeState,
    pub body_boundary_state: ArtifactContentFactContextState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_intake_context_ref` | application id generator 生成;不得由 source ref 或 request id 派生 |
| `source_ref` | 来自 accepted entry / consumer envelope / automation acceptance path 的正式内容来源 |
| `intake_kind` | 来自正式 intake normalization;不得退化成 transport route 或 free-form string |
| `intake_state` | 初始为 pre-truth intake state;只能按本对象成员函数推进 |
| `body_boundary_state` | 表达当前内容边界观察结果;只能使用 `ArtifactContentFactContextState` 家族,不得私补新的 runtime state |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_source(artifact_intake_context_ref: ArtifactIntakeContextRef, source_ref: ArtifactContentSourceRef, intake_kind: ArtifactIntakeKind) -> Self` | 从来源建立收束语境 | generated ref、accepted source ref、normalized intake kind | `Self` | 建立 pre-truth intake object;不得直接写 truth |
| `fn resolve_source(&mut self, source_ref: ArtifactContentSourceRef) -> ArtifactDomainResult<()>` | 确认正式来源 | loaded / normalized source ref | `ArtifactDomainResult<()>` | 允许进入 `Resolved`;更新 `source_ref`;不得改变 truth object |
| `fn mark_pending_reference(&mut self, resolution_ref: ExternalReferenceResolutionStateRef) -> ArtifactDomainResult<()>` | 因外部引用未闭口进入等待 | formal external resolution state ref | `ArtifactDomainResult<()>` | 进入 `PendingReference`;不得私存 resolution body |
| `fn reject(&mut self, reason: ArtifactIntakeRejectReason) -> ArtifactDomainResult<()>` | 拒绝越界输入 | reject reason | `ArtifactDomainResult<()>` | 进入 `Rejected`;终态后不得 transfer |
| `fn transfer_to_truth_write(&mut self) -> ArtifactDomainResult<()>` | `Resolved -> Transferred` | 无 | `ArtifactDomainResult<()>` | 只表示可进入 truth write;不直接建立 `ArtifactFact` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| intake 不等于 truth | `Transferred` 只说明可进入 truth write,不等于 fact 已建立 |
| unresolved path 不得硬闯 | `PendingReference` 不能静默进入 truth write |
| 不保存正文 | 只能保存 `ArtifactContentSourceRef` 和 boundary state |
| body boundary 不是 content truth | `body_boundary_state` 只表达 intake 观察,不替代 `ArtifactContentFactContext` |

### 10.2 `ArtifactSubmissionRecord`

```rust
/// Record of a concrete submission attempt under an intake context.
pub struct ArtifactSubmissionRecord {
    pub artifact_submission_ref: ArtifactSubmissionRef,
    pub intake_context_ref: ArtifactIntakeContextRef,
    pub submitter_ref: ActorRef,
    pub submission_state: ArtifactSubmissionState,
    pub submission_source_ref: ArtifactContentSourceRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_submission_ref` | application id generator 生成 |
| `intake_context_ref` | 必须指向已存在的 `ArtifactIntakeContext` |
| `submitter_ref` | 来自 accepted actor context;不得保存 actor profile body |
| `submission_state` | 初始为 `Received`;只能按成员函数推进 |
| `submission_source_ref` | 从本次提交的正式内容来源复制;不得引用 runtime cache key |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn record(artifact_submission_ref: ArtifactSubmissionRef, intake_context_ref: ArtifactIntakeContextRef, submitter_ref: ActorRef, submission_source_ref: ArtifactContentSourceRef) -> Self` | 建立一次提交记录 | generated ref、intake ref、submitter、accepted source ref | `Self` | 建立 append-oriented submission truth |
| `fn accept(&mut self) -> ArtifactDomainResult<()>` | `Received -> Accepted` | 无 | `ArtifactDomainResult<()>` | 接收本次提交;不等于事实已建立 |
| `fn reject(&mut self, reason: ArtifactSubmissionRejectReason) -> ArtifactDomainResult<()>` | `Received -> Rejected` | reject reason | `ArtifactDomainResult<()>` | 拒绝越界或无效提交 |
| `fn supersede(&mut self, next_submission_ref: ArtifactSubmissionRef) -> ArtifactDomainResult<()>` | 被后续提交取代 | next submission ref | `ArtifactDomainResult<()>` | 进入 `Superseded`;next ref 不得等于自身 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| submission 不替代 intake | 当前 intake lifecycle 仍以 `ArtifactIntakeContext` 为准 |
| accepted submission 不等于 version candidate | 后续候选修订仍需显式创建 |
| 一次 submission 只对应一个 intake 主语 | 不得跨 `ArtifactIntakeContextRef` 漂移 |

### 10.3 `ArtifactReviewAnchor`

```rust
/// Formal review anchor attached to one committed truth anchor.
pub struct ArtifactReviewAnchor {
    pub artifact_review_anchor_ref: ArtifactReviewAnchorRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub review_state: ArtifactReviewState,
    pub review_reason: ArtifactReviewReason,
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_review_anchor_ref` | application id generator 生成 |
| `truth_anchor_ref` | 只能指向 committed `ArtifactTruthAnchorRef`;不得指向 candidate 或 view ref |
| `review_state` | 初始为 `Draft`;只能按成员函数推进 |
| `review_reason` | 正式 review reason carrier;不得退化成 free-form log text |
| `responsibility_assignment_ref` | 仅当责任承担已正式绑定时为 `Some` |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_truth_anchor(artifact_review_anchor_ref: ArtifactReviewAnchorRef, truth_anchor_ref: ArtifactTruthAnchorRef, review_reason: ArtifactReviewReason) -> Self` | 从正式 truth 建立审查语境 | generated ref、formal truth anchor、review reason | `Self` | 建立 review 主语;不修改 truth |
| `fn mark_ready(&mut self) -> ArtifactDomainResult<()>` | `Draft -> Ready` | 无 | `ArtifactDomainResult<()>` | 表示 review 可执行 |
| `fn wait_responsibility(&mut self, assignment_ref: ArtifactResponsibilityAssignmentRef) -> ArtifactDomainResult<()>` | 进入 `PendingResponsibility` | formal assignment ref | `ArtifactDomainResult<()>` | 写入 `responsibility_assignment_ref`;不读取 assignment body |
| `fn close(&mut self, reason: ArtifactReviewCloseReason) -> ArtifactDomainResult<()>` | 关闭审查语境 | close reason | `ArtifactDomainResult<()>` | 进入 `Closed`;终态后不得再 ready |
| `fn invalidate(&mut self, reason: ArtifactReviewInvalidReason) -> ArtifactDomainResult<()>` | 标记语境失效 | invalid reason | `ArtifactDomainResult<()>` | 进入 `Invalid`;不得静默 reopen |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| review 只围绕 formal truth | 不得以 preview、report 或 automation output 直接建 review anchor |
| responsibility 只用 ref 连接 | review anchor 不保存 responsibility body |
| invalid / closed 不回写真相 | 只改变 review 语境,不改变 truth lifecycle |

### 10.4 `ArtifactResponsibilityAssignment`

```rust
/// Responsibility context attached to one review anchor.
pub struct ArtifactResponsibilityAssignment {
    pub artifact_responsibility_assignment_ref: ArtifactResponsibilityAssignmentRef,
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    pub responsible_party_ref: ActorRef,
    pub assignment_state: ArtifactResponsibilityAssignmentState,
    pub basis_ref: ArtifactResponsibilityBasisRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_responsibility_assignment_ref` | application id generator 生成 |
| `review_anchor_ref` | 必须指向正式 `ArtifactReviewAnchorRef` |
| `responsible_party_ref` | 来自 formal actor mapping;不得保存 actor body |
| `assignment_state` | 初始为 `Pending`;只能按成员函数推进 |
| `basis_ref` | 正式责任承担依据;不得退化成 free-form comment |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_review_anchor(artifact_responsibility_assignment_ref: ArtifactResponsibilityAssignmentRef, review_anchor_ref: ArtifactReviewAnchorRef, basis_ref: ArtifactResponsibilityBasisRef, responsible_party_ref: ActorRef) -> Self` | 建立责任承担语境 | generated ref、review anchor ref、basis、responsible actor | `Self` | 绑定 review 与责任承担主体 |
| `fn assign(&mut self) -> ArtifactDomainResult<()>` | `Pending -> Assigned` | 无 | `ArtifactDomainResult<()>` | 表示责任已正式指派 |
| `fn accept(&mut self) -> ArtifactDomainResult<()>` | `Assigned -> Accepted` | 无 | `ArtifactDomainResult<()>` | 表示责任方已接受 |
| `fn release(&mut self, reason: ArtifactResponsibilityReleaseReason) -> ArtifactDomainResult<()>` | 释放责任 | release reason | `ArtifactDomainResult<()>` | 进入 `Released`;需要新责任时必须创建或重新绑定 |
| `fn invalidate(&mut self, reason: ArtifactResponsibilityInvalidReason) -> ArtifactDomainResult<()>` | 标记责任语境失效 | invalid reason | `ArtifactDomainResult<()>` | 进入 `Invalid`;不得继续 accept |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| assignment 不等于 review 通过 | `Accepted` 只表示责任承担接受,不等于 review closed |
| basis 必须正式化 | 不得用聊天文本或日志片段替代 `ArtifactResponsibilityBasisRef` |
| 责任对象不修改 review truth | review 当前状态仍由 `ArtifactReviewAnchor` 表达 |

### 10.5 `AutomationArtifactInput`

```rust
/// Automation-produced candidate input that cannot directly become truth.
pub struct AutomationArtifactInput {
    pub automation_artifact_input_ref: AutomationArtifactInputRef,
    pub automation_source_ref: AutomationSourceRef,
    pub candidate_kind: AutomationArtifactCandidateKind,
    pub input_state: AutomationArtifactInputState,
    pub derived_from_ref: ArtifactTruthAnchorRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `automation_artifact_input_ref` | application id generator 生成 |
| `automation_source_ref` | 来自正式自动化来源锚点;不得保存 runtime output body |
| `candidate_kind` | 只允许当前 boundary 已闭口的 automation candidate family |
| `input_state` | 初始为 `Received`;只能按成员函数推进 |
| `derived_from_ref` | 必须回指一个 formal `ArtifactTruthAnchorRef`;不得为空或指向 view/ref projection |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_source(automation_artifact_input_ref: AutomationArtifactInputRef, automation_source_ref: AutomationSourceRef, candidate_kind: AutomationArtifactCandidateKind, derived_from_ref: ArtifactTruthAnchorRef) -> Self` | 建立自动化候选输入 | generated ref、automation source、candidate kind、formal truth anchor | `Self` | 建立 candidate-only automation input |
| `fn accept(&mut self) -> ArtifactDomainResult<()>` | 允许进入正式收束链 | 无 | `ArtifactDomainResult<()>` | 进入 `Accepted`;不直接创建 truth |
| `fn send_to_review(&mut self) -> ArtifactDomainResult<()>` | 推入 review 边界 | 无 | `ArtifactDomainResult<()>` | 进入 `PendingReview`;不绕过 review anchor |
| `fn reject(&mut self, reason: AutomationArtifactRejectReason) -> ArtifactDomainResult<()>` | 拒绝越界输入 | reject reason | `ArtifactDomainResult<()>` | 进入 `Rejected`;终态后不得 accept |
| `fn supersede(&mut self, next_input_ref: AutomationArtifactInputRef) -> ArtifactDomainResult<()>` | 被新输入替代 | next automation input ref | `ArtifactDomainResult<()>` | 进入 `Superseded`;next ref 不得等于自身 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| automation candidate-only | 自动化输入不能直接 establish fact / version / lineage / baseline truth |
| 必须回指 formal 来源 | `derived_from_ref` 不得是 runtime-only output |
| accepted 不等于 truth write | 进入正式收束链后仍需 intake / review / policy 审核 |

### 10.6 `ConsumableArtifactReference`

```rust
/// Stable consumable reference exported from one formal truth anchor.
pub struct ConsumableArtifactReference {
    pub consumable_artifact_reference_ref: ConsumableArtifactReferenceRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub consumer_scope_ref: ArtifactConsumerScopeRef,
    pub reference_state: ConsumableArtifactReferenceState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `consumable_artifact_reference_ref` | application id generator 生成 |
| `truth_anchor_ref` | 只能引用 formal truth anchor |
| `consumer_scope_ref` | 正式消费范围锚点;不得用 free-form scope string 代替 |
| `reference_state` | 初始为 `Ready`;只能按成员函数推进 |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_anchor(consumable_artifact_reference_ref: ConsumableArtifactReferenceRef, truth_anchor_ref: ArtifactTruthAnchorRef, consumer_scope_ref: ArtifactConsumerScopeRef) -> Self` | 从正式 truth 锚点构造消费引用 | generated ref、truth anchor ref、consumer scope ref | `Self` | 建立可消费 formal pointer |
| `fn restrict(&mut self, reason: ArtifactReadRestrictionReason) -> ArtifactDomainResult<()>` | 标记当前不可直接输出 | restriction reason | `ArtifactDomainResult<()>` | 进入 `Restricted`;不改变 truth |
| `fn mark_stale(&mut self, reason: ArtifactStaleReason) -> ArtifactDomainResult<()>` | 标记需要刷新 | stale reason | `ArtifactDomainResult<()>` | 进入 `Stale`;提示 read side 需要降级或刷新 |
| `fn mark_unavailable(&mut self, reason: ArtifactUnavailableReason) -> ArtifactDomainResult<()>` | 标记暂不可用 | unavailable reason | `ArtifactDomainResult<()>` | 进入 `Unavailable`;不得伪装成 ready |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| consumable ref 不是 truth | 只是对 formal truth 的稳定对外引用 |
| restricted / stale / unavailable 不改 truth | 只影响 read/export/handoff 可见性 |
| 不保存消费方正文 | consumer 细节仍由 `AdjacentConsumerRef` / backref / trace 解释 |

### 10.7 `ArtifactConsumptionBackref`

```rust
/// Formal back-reference that explains which truth anchor a consumer used.
pub struct ArtifactConsumptionBackref {
    pub artifact_consumption_backref_ref: ArtifactConsumptionBackrefRef,
    pub consumer_ref: AdjacentConsumerRef,
    pub consumable_ref: ConsumableArtifactReferenceRef,
    pub consumption_reason: ArtifactConsumptionReason,
    pub backref_state: ArtifactConsumptionBackrefState,
    pub trace_ref: Option<ArtifactTraceRecordRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_consumption_backref_ref` | application id generator 生成 |
| `consumer_ref` | 正式消费方锚点;不得退化成 log id 或 transport receipt |
| `consumable_ref` | 必须指向正式 `ConsumableArtifactReferenceRef` |
| `consumption_reason` | 正式消费说明 carrier;不得用 free-form note 替代 |
| `backref_state` | 初始为 `Recorded`;只能按成员函数推进 |
| `trace_ref` | 仅当该消费已被正式 trace record 解释时为 `Some` |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn record(artifact_consumption_backref_ref: ArtifactConsumptionBackrefRef, consumer_ref: AdjacentConsumerRef, consumable_ref: ConsumableArtifactReferenceRef, consumption_reason: ArtifactConsumptionReason) -> Self` | 建立正式消费回指 | generated ref、consumer ref、consumable ref、consumption reason | `Self` | 建立消费解释主语 |
| `fn mark_explained(&mut self, trace_ref: ArtifactTraceRecordRef) -> ArtifactDomainResult<()>` | 关联正式追溯记录 | trace record ref | `ArtifactDomainResult<()>` | 进入 `Explained`;写入 `trace_ref` |
| `fn mark_stale(&mut self, reason: ArtifactStaleReason) -> ArtifactDomainResult<()>` | 标记所依赖 truth 已过期 | stale reason | `ArtifactDomainResult<()>` | 进入 `Stale`;提示 read/handoff 需要刷新解释链 |
| `fn retire(&mut self, reason: ArtifactConsumptionRetireReason) -> ArtifactDomainResult<()>` | 退出当前消费视图 | retire reason | `ArtifactDomainResult<()>` | 进入 `Retired`;不得继续 mark explained |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| backref 只解释消费事实 | 不建立或修复 truth |
| trace ref 必须正式化 | 只能保存 `ArtifactTraceRecordRef`,不得保存 trace body 或日志片段 |
| consumer 与 consumable 不得漂移 | 一个 backref 只能解释一个 consumer 对一个 consumable 的正式消费事实 |

---

## 11. `domain` support state / policy / record 契约

### 11.1 `ArtifactDerivedViewState`

```rust
/// Canonical derived freshness state. It never becomes a truth source.
pub struct ArtifactDerivedViewState {
    pub artifact_derived_view_state_ref: ArtifactDerivedViewStateRef,
    pub derived_view_kind: ArtifactDerivedViewKind,
    pub source_cursor: ArtifactTruthCursor,
    pub freshness_state: ArtifactDerivedFreshnessState,
    pub last_job_outcome: ArtifactDerivedJobOutcome,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_derived_view_state_ref` | application id generator 生成 |
| `derived_view_kind` | 只允许当前 boundary 已闭口的 derived view family |
| `source_cursor` | 表达该派生状态覆盖的 truth position;不得作为 optimistic version |
| `freshness_state` | 初始为 `Fresh`;只能按成员函数推进 |
| `last_job_outcome` | 记录最近一次维护结果;只表达维护 outcome,不替代 freshness |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn for_view(artifact_derived_view_state_ref: ArtifactDerivedViewStateRef, derived_view_kind: ArtifactDerivedViewKind, source_cursor: ArtifactTruthCursor) -> Self` | 为某类派生视图建立 freshness 状态 | generated ref、derived view kind、source cursor | `Self` | 初始化 derived state;不创建 view body |
| `fn mark_stale(&mut self, reason: ArtifactStaleReason) -> ArtifactDomainResult<()>` | 标记过期 | stale reason | `ArtifactDomainResult<()>` | 进入 `Stale`;提示需要 rebuild |
| `fn start_rebuild(&mut self) -> ArtifactDomainResult<()>` | `* -> Rebuilding` | 无 | `ArtifactDomainResult<()>` | 表示维护开始;不直接修 truth |
| `fn mark_rebuilt(&mut self, source_cursor: ArtifactTruthCursor) -> ArtifactDomainResult<()>` | 重建完成并更新 cursor | accepted rebuild cursor | `ArtifactDomainResult<()>` | 进入 `Fresh`;更新 `source_cursor` |
| `fn mark_failed(&mut self, reason: ArtifactDerivedFailureReason) -> ArtifactDomainResult<()>` | 标记维护失败 | failure reason | `ArtifactDomainResult<()>` | 进入 `Failed`;必须保留失败可见性 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| derived state 不是 truth source | 只能描述 projection / preview / report freshness |
| stale / failed 不可伪装成 fresh | query side 必须显式暴露 |
| rebuild 只更新 derived state | 不得借此直接修正 truth object |

### 11.2 `ExternalReferenceResolutionState`

```rust
/// Canonical state for local mirror and external reference resolution.
pub struct ExternalReferenceResolutionState {
    pub external_reference_resolution_state_ref: ExternalReferenceResolutionStateRef,
    pub reference_kind: ArtifactExternalReferenceKind,
    pub external_ref: ExternalSourceRef,
    pub resolution_state: ArtifactExternalResolutionState,
    pub captured_snapshot_ref: Option<LocalMirrorSnapshotRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `external_reference_resolution_state_ref` | application id generator 生成 |
| `reference_kind` | 只允许当前 boundary 已闭口的 external reference family |
| `external_ref` | 指向正式外部稳定位置 |
| `resolution_state` | 初始为 `Pending`;只能按成员函数推进 |
| `captured_snapshot_ref` | 仅当正式 local mirror snapshot 已捕获时为 `Some` |

| 成员函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn from_reference(external_reference_resolution_state_ref: ExternalReferenceResolutionStateRef, reference_kind: ArtifactExternalReferenceKind, external_ref: ExternalSourceRef) -> Self` | 建立解析状态 | generated ref、reference kind、external ref | `Self` | 初始化 pending resolution state |
| `fn mark_resolved(&mut self, captured_snapshot_ref: LocalMirrorSnapshotRef) -> ArtifactDomainResult<()>` | 标记已解析 | formal captured snapshot ref | `ArtifactDomainResult<()>` | 进入 `Resolved`;写入 `captured_snapshot_ref` |
| `fn mark_stale(&mut self, reason: ArtifactReferenceStaleReason) -> ArtifactDomainResult<()>` | 标记镜像需刷新 | stale reason | `ArtifactDomainResult<()>` | 进入 `Stale`;不得伪造 fresh snapshot |
| `fn mark_unresolved(&mut self, reason: ArtifactReferenceUnresolvedReason) -> ArtifactDomainResult<()>` | 标记当前无法解析 | unresolved reason | `ArtifactDomainResult<()>` | 进入 `Unresolved` 或 `Waiting` 路径 |
| `fn mark_failed(&mut self, reason: ArtifactReferenceRefreshFailureReason) -> ArtifactDomainResult<()>` | 标记刷新失败 | failure reason | `ArtifactDomainResult<()>` | 进入 `Failed`;必须保留失败可见性 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| snapshot ref 必须正式化 | 只能保存 `LocalMirrorSnapshotRef`,不得保存外部正文 |
| stale / unresolved / failed 不得直接写真相 | 只能服务 pending / degraded / maintenance 路径 |
| resolution state 不替代 external truth | 只表达本地解析结果,不拥有外部对象 lifecycle |

### 11.3 policy / guard 对象 contract

policy object 全部归 `artifact_domain::policies`。这一组对象负责表达“已加载对象之间的领域判断”,不拥有 repository、resolver、config、clock、id generator 或 transport/runtime state。

统一返回面:

```rust
pub type ArtifactPolicyResult = ArtifactDomainResult<()>;
```

#### 11.3.1 policy / guard 通用落码边界

| 规则 | 说明 |
|---|---|
| 纯判断 | policy method 只检查入参和自身字段,成功返回 `Ok(())`,失败返回 `ArtifactDomainError`;不得修改入参对象 |
| 无 repository | Step 7 repository / resolver / snapshot port 负责加载 truth、view、reference state 和 actor / source context;policy 不自行读取 |
| 无副作用 | policy 不 append history、trace、handoff、refresh、stored result 或 job report |
| no body | policy 只能消费 Step 6 已闭口的 ref、state、kind、truth object、support object 和 body-free snapshot;不得持有外部正文 |
| 不替代状态机 | truth object、support object、derived state 和 record 的状态迁移仍由对象本体成员函数完成 |
| 不改写红线 | 不得通过 configuration、entry hint、runtime state 或 adapter outcome 改变 ownership、query no-write、consumer no-truth-write、job no-truth-repair 或 derived no-writeback |

#### 11.3.2 `ArtifactFactPolicy`

```rust
/// Domain guard for establishing one Artifact fact without violating truth ownership.
pub struct ArtifactFactPolicy {
    pub intake_context_ref: ArtifactIntakeContextRef,
    pub content_resolution_state_ref: ExternalReferenceResolutionStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `intake_context_ref` | `ArtifactIntakeContextRef` | 被判断的 intake 主语 | 从 loaded `ArtifactIntakeContext` 复制;不得从 source ref 或 request id 临时拼接 |
| `content_resolution_state_ref` | `ExternalReferenceResolutionStateRef` | 正文来源解析状态锚点 | 从 loaded `ExternalReferenceResolutionState` 复制;policy 不自行 refresh |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_fact_establishable(&self, intake_context: &ArtifactIntakeContext, content_context: &ArtifactContentFactContext) -> ArtifactPolicyResult` | 校验 intake 和 content context 可以进入正式 truth establish | loaded intake context、loaded content context | `ArtifactPolicyResult` | 要求 intake 已解析且可 transfer、content context 非 unavailable |
| `fn assert_no_external_body_ownership(&self, content_context: &ArtifactContentFactContext) -> ArtifactPolicyResult` | 校验正文只以 source ref / digest 进入 | loaded content context | `ArtifactPolicyResult` | 不允许把 body copy、archive body 或外部 payload 当 truth field |
| `fn assert_no_derived_material_as_truth(&self, source_ref: &ArtifactContentSourceRef) -> ArtifactPolicyResult` | 校验派生材料不会直接升格为事实 truth | body-free source ref | `ArtifactPolicyResult` | derived / preview / report / runtime output 只能先回到正式收束边界 |
| `fn assert_single_truth_anchor(&self, current_fact_ref: Option<&ArtifactFactRef>) -> ArtifactPolicyResult` | 校验当前 intake 不会无声覆盖既有正式 fact | optional existing fact ref | `ArtifactPolicyResult` | duplicate / merge 处理留给 flow,policy 只阻止静默双锚点 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| fact truth 唯一 | 一个正式 truth 锚点不能由多个未解释 intake 静默成立 |
| 正文不入 truth | `ArtifactFact` / `ArtifactContentFactContext` 只保存 ref / digest / state |
| policy 不创建 fact | 具体 `ArtifactFact::new_pending(...)` 和 `establish(...)` 由 application flow 调用 |

#### 11.3.3 `ArtifactVersionPolicy`

```rust
/// Domain guard for publishing, superseding, and retiring formal Artifact versions.
pub struct ArtifactVersionPolicy {
    pub artifact_fact_ref: ArtifactFactRef,
    pub current_version_ref: Option<ArtifactVersionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `artifact_fact_ref` | `ArtifactFactRef` | 被发布版本所属事实 | 从 loaded `ArtifactFact` 或 `ArtifactVersionCandidate` 复制 |
| `current_version_ref` | `Option<ArtifactVersionRef>` | 当前正式版本锚点 | 来自 loaded fact / repository read;`None` 表示首次正式发布 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_publish_allowed(&self, fact: &ArtifactFact, candidate: &ArtifactVersionCandidate) -> ArtifactPolicyResult` | 校验候选修订可以成为正式版本 | loaded fact、loaded candidate | `ArtifactPolicyResult` | 要求 candidate 属于同一 fact 且已 ready |
| `fn assert_supersede_allowed(&self, current_version: &ArtifactVersion, next_version: &ArtifactVersion) -> ArtifactPolicyResult` | 校验后续版本可以替代当前版本 | loaded current version、loaded next version | `ArtifactPolicyResult` | 不允许跨 fact supersede 或对 retired version 无声覆盖 |
| `fn assert_no_silent_overwrite(&self, loaded_current_version: Option<&ArtifactVersion>) -> ArtifactPolicyResult` | 校验 publish path 没有绕过 expected current version 口径 | optional loaded current version | `ArtifactPolicyResult` | current 存在时必须显式承认 supersede / freeze 关系 |
| `fn assert_history_traceable(&self, candidate_ref: Option<&ArtifactVersionCandidateRef>) -> ArtifactPolicyResult` | 校验正式版本有可追溯来源 | optional candidate ref | `ArtifactPolicyResult` | 不允许 current latest、runtime trace 或搜索结果直接充当正式 version 来源 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| version 不脱离 fact 存在 | 所有版本动作都必须锚定同一 `ArtifactFactRef` |
| supersede 必须显式 | 不允许用 list latest、timestamp 或内容相似度代替正式 supersede 关系 |
| policy 不推进状态 | `publish` / `freeze` / `retire` 仍由 `ArtifactVersion` 成员函数完成 |

#### 11.3.4 `ArtifactLineagePolicy`

```rust
/// Domain guard for establishing formal lineage only between committed Artifact versions.
pub struct ArtifactLineagePolicy {
    pub source_version_ref: ArtifactVersionRef,
    pub target_version_ref: ArtifactVersionRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_version_ref` | `ArtifactVersionRef` | 血缘源版本 | 从 loaded source version 复制 |
| `target_version_ref` | `ArtifactVersionRef` | 血缘目标版本 | 从 loaded target version 复制 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_anchor_versions_resolved(&self, source_version: &ArtifactVersion, target_version: &ArtifactVersion) -> ArtifactPolicyResult` | 校验血缘只锚定正式版本 | loaded source / target version | `ArtifactPolicyResult` | candidate、content context 或 view ref 不能替代 formal version |
| `fn assert_relation_basis_sufficient(&self, basis_ref: &ArtifactLineageBasisRef) -> ArtifactPolicyResult` | 校验血缘依据正式闭口 | lineage basis ref | `ArtifactPolicyResult` | basis 只能来自正式 basis carrier,不能来自运行期说明文本 |
| `fn assert_no_runtime_trace_as_truth(&self, basis_ref: &ArtifactLineageBasisRef) -> ArtifactPolicyResult` | 校验 runtime / tool trace 不能直接成为 lineage truth | lineage basis ref | `ArtifactPolicyResult` | trace 只能作为追溯线索,不能直接确立 lineage truth |
| `fn assert_no_current_content_shortcut(&self, source_context_ref: &ArtifactContentFactContextRef, target_context_ref: &ArtifactContentFactContextRef) -> ArtifactPolicyResult` | 校验不通过 current content shortcut 代替版本级关系 | source / target content context ref | `ArtifactPolicyResult` | lineage 必须建立在 formal version,而不是 current body 邻接关系之上 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| lineage 只锚定 formal version | source / target 都必须是 `ArtifactVersionRef` |
| basis 必须可追溯 | lineage reason 不能退化成 free-form string 或未闭口的 external summary |
| policy 不创建 lineage | `ArtifactLineageLink::connect(...)` 和状态迁移由 flow 调用 |

#### 11.3.5 `ArtifactBaselinePolicy`

```rust
/// Domain guard for freezing controlled baselines from explicit formal memberships only.
pub struct ArtifactBaselinePolicy {
    pub baseline_scope_ref: ArtifactBaselineScopeRef,
    pub membership_refs: ArtifactBaselineMembershipRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `baseline_scope_ref` | `ArtifactBaselineScopeRef` | 基线范围 | 从 loaded baseline 或 request scope 复制 |
| `membership_refs` | `ArtifactBaselineMembershipRefSet` | 拟冻结成员集合 | ordered unique;来自 loaded membership objects,不得运行期扫描 current latest 现算 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_only_formal_versions(&self, memberships: &[ArtifactBaselineMembership]) -> ArtifactPolicyResult` | 校验基线成员全部锚定正式版本 | loaded memberships | `ArtifactPolicyResult` | candidate、fact、summary view 不能直接作为 baseline member |
| `fn assert_freeze_context_ready(&self, review_anchor: &ArtifactReviewAnchor) -> ArtifactPolicyResult` | 校验冻结上下文已正式闭口 | loaded review anchor | `ArtifactPolicyResult` | 不能在未 ready review 语境下冻结 baseline |
| `fn assert_no_dynamic_current_resolution(&self, baseline: &ArtifactBaseline) -> ArtifactPolicyResult` | 校验 baseline 不依赖动态 current version 解析 | loaded baseline | `ArtifactPolicyResult` | `membership_refs` 必须显式固定 |
| `fn assert_historical_baseline_preserved(&self, prior_baseline: Option<&ArtifactBaseline>) -> ArtifactPolicyResult` | 校验历史基线不会被后续冻结无声改写 | optional prior baseline | `ArtifactPolicyResult` | supersede / retire 必须显式表达 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| baseline 只冻结 formal version | 不能直接冻结 candidate、trace 或运行期集合 |
| baseline 非动态视图 | 不能以“当前最新版本集合”替代 `membership_refs` |
| policy 不修改 membership | 选择 / 冻结 / 移除成员仍由对象本体完成 |

#### 11.3.6 `ArtifactIntakePolicy`

```rust
/// Domain guard for intake convergence before any Artifact truth write starts.
pub struct ArtifactIntakePolicy {
    pub source_ref: ArtifactContentSourceRef,
    pub resolution_state_ref: ExternalReferenceResolutionStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `ArtifactContentSourceRef` | 输入来源锚点 | 从 request / consumer envelope / resolver summary 复制 |
| `resolution_state_ref` | `ExternalReferenceResolutionStateRef` | 来源解析状态锚点 | 从 loaded resolution state 复制;policy 不自行 refresh |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_source_resolvable(&self, resolution_state: &ExternalReferenceResolutionState) -> ArtifactPolicyResult` | 校验来源已达到可消费解析状态 | loaded resolution state | `ArtifactPolicyResult` | unresolved / failed 只能进入 pending / delayed / degraded path |
| `fn assert_no_external_body_ingest(&self, content_context: &ArtifactContentFactContext) -> ArtifactPolicyResult` | 校验 intake 不会把外部正文纳入 truth | loaded content context | `ArtifactPolicyResult` | 只允许 source ref / digest / state 进入 Step 6 对象 |
| `fn assert_input_minimally_acceptable(&self, intake_context: &ArtifactIntakeContext) -> ArtifactPolicyResult` | 校验 intake 输入达到最小正式门槛 | loaded intake context | `ArtifactPolicyResult` | intake kind、source ref 和 boundary state 必须闭口 |
| `fn assert_ready_for_truth_write(&self, intake_context: &ArtifactIntakeContext, submission: Option<&ArtifactSubmissionRecord>) -> ArtifactPolicyResult` | 校验 intake 可以 transfer 到 truth write | loaded intake context、optional submission | `ArtifactPolicyResult` | submission 缺失或被 reject 时不得进入 truth write |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| intake 不直接建立 truth | 只能判断是否可进入 truth write |
| external body 不入仓 | body ingestion 只能停留在外部来源边界 |
| policy 不转移状态 | `mark_pending_reference` / `transfer_to_truth_write` 仍由对象本体和 flow 完成 |

#### 11.3.7 `ArtifactReviewPolicy`

```rust
/// Domain guard for review and responsibility boundaries around one formal truth anchor.
pub struct ArtifactReviewPolicy {
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 被审查 truth 锚点 | 从 loaded review anchor 复制 |
| `responsibility_assignment_ref` | `Option<ArtifactResponsibilityAssignmentRef>` | 当前责任承担锚点 | 来自 loaded assignment;`None` 表示尚未闭口责任承担 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_review_anchor_resolved(&self, review_anchor: &ArtifactReviewAnchor) -> ArtifactPolicyResult` | 校验 review anchor 已正式锚定 truth | loaded review anchor | `ArtifactPolicyResult` | review anchor 必须回指与 policy 一致的 truth anchor |
| `fn assert_same_truth_anchor(&self, review_anchor: &ArtifactReviewAnchor, consumable_ref: Option<&ConsumableArtifactReference>) -> ArtifactPolicyResult` | 校验审查上下文没有跨 truth 主语漂移 | loaded review anchor、optional consumable ref | `ArtifactPolicyResult` | review / consumption / responsibility 不能跨 anchor 混用 |
| `fn assert_responsibility_explainable(&self, assignment: Option<&ArtifactResponsibilityAssignment>) -> ArtifactPolicyResult` | 校验责任承担语境可以被正式解释 | optional loaded assignment | `ArtifactPolicyResult` | 责任缺失只能走 pending / wait path,不能静默 accepted |
| `fn assert_no_view_state_as_basis(&self, read_surface_ref: Option<&ArtifactReadSurfaceViewRef>) -> ArtifactPolicyResult` | 校验只读 view / surface 不会反向成为 review basis | optional read surface ref | `ArtifactPolicyResult` | view / report 只能辅助读取,不能替代正式 review basis |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| review 不改 truth | review 只能围绕既有 formal truth 展开 |
| responsibility 不等于 acceptance | 责任承担只表达谁负责,不直接等于审核通过 |
| policy 不创建 review / assignment | 具体对象创建与状态推进仍由对象本体和 flow 执行 |

#### 11.3.8 `AutomationBoundaryPolicy`

```rust
/// Domain guard that keeps automation output inside the candidate-only boundary.
pub struct AutomationBoundaryPolicy {
    pub automation_source_ref: AutomationSourceRef,
    pub resolution_state_ref: ExternalReferenceResolutionStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `automation_source_ref` | `AutomationSourceRef` | 自动化来源锚点 | 从 loaded automation input 或 resolver summary 复制 |
| `resolution_state_ref` | `ExternalReferenceResolutionStateRef` | 自动化来源解析状态锚点 | 从 loaded reference state 复制 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_candidate_only(&self, input: &AutomationArtifactInput) -> ArtifactPolicyResult` | 校验自动化输出只停留在候选 / review 边界 | loaded automation input | `ArtifactPolicyResult` | automation path 不得直接 establish fact / version / lineage / baseline |
| `fn assert_no_direct_truth_creation(&self, derived_from_ref: &ArtifactTruthAnchorRef) -> ArtifactPolicyResult` | 校验自动化输入必须解释其 formal 来源 | formal truth anchor ref | `ArtifactPolicyResult` | runtime-only output 不得成为孤立 truth create 入口 |
| `fn assert_source_traceable(&self, resolution_state: &ExternalReferenceResolutionState) -> ArtifactPolicyResult` | 校验自动化来源可追溯 | loaded resolution state | `ArtifactPolicyResult` | unresolved / failed source 只能 pending 或 reject |
| `fn assert_requires_formal_convergence(&self, review_anchor_ref: Option<&ArtifactReviewAnchorRef>) -> ArtifactPolicyResult` | 校验自动化输出需要进入正式 convergence / review | optional review anchor ref | `ArtifactPolicyResult` | 不允许绕过正式收束链 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| automation candidate-only | 自动化输入只能成为 candidate / review input |
| 自动化不直接写真相 | 不得跳过 responsibility、review 或 formal truth anchor |
| policy 不接受输入 | `accept` / `send_to_review` / `reject` 仍由 `AutomationArtifactInput` 执行 |

#### 11.3.9 `ArtifactReadVisibilityPolicy`

```rust
/// Domain guard for public read visibility over one consumable truth anchor.
pub struct ArtifactReadVisibilityPolicy {
    pub consumer_ref: AdjacentConsumerRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `consumer_ref` | `AdjacentConsumerRef` | 消费方锚点 | 从 query / handoff / sync read actor mapping 复制 |
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 当前读取主语 | 从 consumable ref 或 review / report read target 复制 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_visible(&self, consumable_ref: &ConsumableArtifactReference) -> ArtifactPolicyResult` | 校验 consumer 对当前 consumable truth 锚点可见 | loaded consumable ref | `ArtifactPolicyResult` | not visible path 只能走 restricted / unavailable surface |
| `fn assert_can_read_stale_view(&self, derived_state: &ArtifactDerivedViewState) -> ArtifactPolicyResult` | 校验 stale / rebuilding 视图是否仍可降级读取 | loaded derived state | `ArtifactPolicyResult` | stale 只影响可见性 / freshness,不触发写入 |
| `fn assert_backref_required(&self, backref: Option<&ArtifactConsumptionBackref>) -> ArtifactPolicyResult` | 校验当前读取是否必须有正式 consumption backref | optional loaded backref | `ArtifactPolicyResult` | 需要 backref 时不得用日志、trace id 或外部 cache 代替 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query no-write | visibility 判断不得 mark stale、refresh snapshot 或 append trace |
| not visible 不改 truth | denied / restricted 只影响 read surface,不改变 truth 对象 |
| policy 不组装 response | public DTO / restricted / degraded mapping 留给 Step 8 / Step 12 |

#### 11.3.10 `ArtifactTraceabilityPolicy`

```rust
/// Domain guard for back-reference, trace, and handoff traceability completeness.
pub struct ArtifactTraceabilityPolicy {
    pub consumer_ref: AdjacentConsumerRef,
    pub operation_kind: ArtifactTraceOperationKind,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `consumer_ref` | `AdjacentConsumerRef` | 当前消费 / handoff 目标 | 从 loaded backref / trace / handoff intent 复制 |
| `operation_kind` | `ArtifactTraceOperationKind` | 当前追溯动作类别 | 来自 query / handoff / sync / archive / observability flow |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_backref_complete(&self, backref: &ArtifactConsumptionBackref) -> ArtifactPolicyResult` | 校验 backref 已完整解释消费事实 | loaded backref | `ArtifactPolicyResult` | consumer ref、consumable ref 和 reason 必须正式闭口 |
| `fn assert_handoff_traceable(&self, handoff_record: &ArtifactHandoffRecord) -> ArtifactPolicyResult` | 校验 handoff 有可解释追溯锚点 | loaded handoff record | `ArtifactPolicyResult` | handoff failure 不得掩盖 trace 缺口 |
| `fn assert_no_unanchored_consumption(&self, consumable_ref: &ConsumableArtifactReference) -> ArtifactPolicyResult` | 校验消费动作不会脱离 formal truth anchor | loaded consumable ref | `ArtifactPolicyResult` | 下游副本、cache key 或 external id 不能代替 formal consumable anchor |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| trace 不是 truth | traceability 只解释消费 / 交接,不创建或修复 truth |
| backref 必须正式化 | 不允许只靠日志或 transport receipt 表达消费说明 |
| policy 不 append record | trace / handoff / refresh record 追加留给 Step 9 flow |

#### 11.3.11 `ExternalReferenceValidityPolicy`

```rust
/// Domain guard for deciding whether one external reference state is usable for read or write.
pub struct ExternalReferenceValidityPolicy {
    pub external_ref: ExternalSourceRef,
    pub resolution_state_ref: ExternalReferenceResolutionStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `external_ref` | `ExternalSourceRef` | 外部来源锚点 | 从 loaded resolution state 或 request / job scope 复制 |
| `resolution_state_ref` | `ExternalReferenceResolutionStateRef` | 外部引用状态锚点 | 从 loaded state 复制;policy 不自行 refresh |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `fn assert_reference_usable(&self, resolution_state: &ExternalReferenceResolutionState) -> ArtifactPolicyResult` | 校验当前外部引用可作为正式输入使用 | loaded resolution state | `ArtifactPolicyResult` | failed / unresolved 时不得直接写 truth |
| `fn assert_snapshot_not_stale_for_write(&self, resolution_state: &ExternalReferenceResolutionState) -> ArtifactPolicyResult` | 校验写路径不消费 stale snapshot | loaded resolution state | `ArtifactPolicyResult` | stale snapshot 最多只能服务 read / degraded precheck |
| `fn assert_degraded_only_for_read(&self, resolution_state: &ExternalReferenceResolutionState) -> ArtifactPolicyResult` | 校验 degraded 口径只停留在读侧 / 维护侧 | loaded resolution state | `ArtifactPolicyResult` | degraded / unavailable 不得被包装成 truth accepted |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| write path 要求更严 | unresolved / stale / failed external state 不得直接进入 truth write |
| degraded 只服务 read / maintenance | query、preview、report、refresh job 可降级,truth establish / publish 不可静默 accepted |
| policy 不刷新引用 | snapshot capture、mark_resolved / stale / failed 留给 state object 和 flow |

### 11.4 append-only history / audit / trace / handoff / refresh record

#### 11.4.1 统一记录规则

- 所有 record identity 归 `contracts` typed ref family。
- 所有 record 只允许 `factory/create` 和 append,不允许 in-place mutate。
- `trace` / `handoff` / `refresh` failure 不能回滚 truth object。

#### 11.4.2 history change record object contracts

history change record 只解释 accepted truth transition,不替代 truth object 本体。它们统一归 `artifact_domain::records::history`。exact change kind carrier 在本步正式闭口如下:

```rust
pub enum ArtifactFactChangeKind {
    Established,
    Suspended,
    Closed,
}

pub enum ArtifactVersionChangeKind {
    Published,
    Superseded,
    Frozen,
    Retired,
}

pub enum ArtifactLineageChangeKind {
    Established,
    Rejected,
    Retired,
}

pub enum ArtifactBaselineChangeKind {
    Frozen,
    Superseded,
    Retired,
}
```

##### `ArtifactFactChangeRecord`

```rust
pub struct ArtifactFactChangeRecord {
    pub artifact_fact_change_record_ref: ArtifactFactChangeRecordRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub change_kind: ArtifactFactChangeKind,
    pub resulting_state: ArtifactFactState,
    pub actor_ref: ActorRef,
    pub basis_ref: Option<ArtifactChangeBasisRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_fact_change_record_ref` | application id generator 生成;不得由 fact ref 派生 |
| `artifact_fact_ref` | 从 changed `ArtifactFact.artifact_fact_ref` 复制 |
| `change_kind` | 只表达本次 accepted transition 类型 |
| `resulting_state` | 从 changed `ArtifactFact.fact_state` 复制;不得靠 `change_kind` 文本反推 |
| `actor_ref` / `basis_ref` | actor 来自 accepted command / system actor;basis 只引用正式 basis |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactFactChangeRecordRef` | 返回 record ref |
| `fn is_terminal_change(&self) -> bool` | 仅当 `resulting_state = Closed` 返回 true |
| `fn record_change(artifact_fact_change_record_ref: ArtifactFactChangeRecordRef, fact: &ArtifactFact, change_kind: ArtifactFactChangeKind, actor_ref: ActorRef, basis_ref: Option<ArtifactChangeBasisRef>) -> Self` | 从 accepted fact transition 追加 history record |

| 红线 | 说明 |
|---|---|
| 只解释变化 | 当前 truth 仍以 `ArtifactFact` 为准 |
| 不保存正文 | 只能引用 `ArtifactContentFactContextRef` 间接追溯 |

##### `ArtifactVersionChangeRecord`

```rust
pub struct ArtifactVersionChangeRecord {
    pub artifact_version_change_record_ref: ArtifactVersionChangeRecordRef,
    pub artifact_version_ref: ArtifactVersionRef,
    pub change_kind: ArtifactVersionChangeKind,
    pub resulting_state: ArtifactVersionState,
    pub actor_ref: ActorRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_version_change_record_ref` | application id generator 生成 |
| `artifact_version_ref` | 从 changed `ArtifactVersion.artifact_version_ref` 复制 |
| `change_kind` | 只允许 `Published | Superseded | Frozen | Retired` |
| `resulting_state` / `actor_ref` | 分别从 changed version state 与 accepted actor 复制 |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactVersionChangeRecordRef` | 返回 record ref |
| `fn is_terminal_change(&self) -> bool` | `Retired` 返回 true |
| `fn record_change(artifact_version_change_record_ref: ArtifactVersionChangeRecordRef, version: &ArtifactVersion, change_kind: ArtifactVersionChangeKind, actor_ref: ActorRef) -> Self` | 从 accepted version transition 追加 history record |

| 红线 | 说明 |
|---|---|
| 不替代 current version binding | `ArtifactFact.current_version_ref` 仍是唯一正式 current owner |
| 不把 candidate 变成 truth | publish 来源追溯仍看 `ArtifactVersion.candidate_ref` |

##### `ArtifactLineageChangeRecord`

```rust
pub struct ArtifactLineageChangeRecord {
    pub artifact_lineage_change_record_ref: ArtifactLineageChangeRecordRef,
    pub artifact_lineage_link_ref: ArtifactLineageLinkRef,
    pub change_kind: ArtifactLineageChangeKind,
    pub resulting_state: ArtifactLineageState,
    pub basis_ref: ArtifactLineageBasisRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_lineage_change_record_ref` | application id generator 生成 |
| `artifact_lineage_link_ref` | 从 changed `ArtifactLineageLink.artifact_lineage_link_ref` 复制 |
| `change_kind` / `resulting_state` | 与 accepted lineage transition 一一对应 |
| `basis_ref` | 从 changed `ArtifactLineageLink.basis_ref` 复制 |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactLineageChangeRecordRef` | 返回 record ref |
| `fn is_active_relation(&self) -> bool` | 仅当 `resulting_state = Established` 返回 true |
| `fn record_change(artifact_lineage_change_record_ref: ArtifactLineageChangeRecordRef, lineage: &ArtifactLineageLink, change_kind: ArtifactLineageChangeKind) -> Self` | 从 accepted lineage transition 追加 history record |

| 红线 | 说明 |
|---|---|
| 不把 runtime trace 升格为 truth | `basis_ref` 必须已正式闭口 |
| 不替代 link 当前状态 | 当前有效性仍由 `ArtifactLineageLink.lineage_state` 表达 |

##### `ArtifactBaselineChangeRecord`

```rust
pub struct ArtifactBaselineChangeRecord {
    pub artifact_baseline_change_record_ref: ArtifactBaselineChangeRecordRef,
    pub artifact_baseline_ref: ArtifactBaselineRef,
    pub change_kind: ArtifactBaselineChangeKind,
    pub resulting_state: ArtifactBaselineState,
    pub actor_ref: ActorRef,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_baseline_change_record_ref` | application id generator 生成 |
| `artifact_baseline_ref` | 从 changed `ArtifactBaseline.artifact_baseline_ref` 复制 |
| `change_kind` / `resulting_state` | 只表达本次 freeze / supersede / retire 结果 |
| `actor_ref` | accepted actor 或 system actor 复制 |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactBaselineChangeRecordRef` | 返回 record ref |
| `fn is_terminal_change(&self) -> bool` | `Retired` 返回 true |
| `fn record_change(artifact_baseline_change_record_ref: ArtifactBaselineChangeRecordRef, baseline: &ArtifactBaseline, change_kind: ArtifactBaselineChangeKind, actor_ref: ActorRef) -> Self` | 从 accepted baseline transition 追加 history record |

| 红线 | 说明 |
|---|---|
| 不重算 membership | record 只解释 change,不重建 `membership_refs` |
| 不把 current latest 当 baseline | baseline 成员仍只来自正式 membership |

#### 11.4.3 intake / review / automation record object contracts

这组 record 负责解释收束过程,不是 truth object,也不是 public view carrier。它们统一归 `artifact_domain::records::convergence`。

##### `ArtifactInputResolutionRecord`

```rust
pub struct ArtifactInputResolutionRecord {
    pub artifact_input_resolution_record_ref: ArtifactInputResolutionRecordRef,
    pub intake_context_ref: ArtifactIntakeContextRef,
    pub resolution_kind: ArtifactInputResolutionKind,
    pub resolution_result: ArtifactInputResolutionResult,
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_input_resolution_record_ref` | application id generator 生成 |
| `intake_context_ref` | 从 loaded / changed `ArtifactIntakeContext.artifact_intake_context_ref` 复制 |
| `resolution_kind` / `resolution_result` | 只表达本次 resolve / boundary check / transfer outcome |
| `resolution_state_ref` | 仅当当前动作依赖 external reference state 时为 `Some` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactInputResolutionRecordRef` | 返回 record ref |
| `fn requires_follow_up(&self) -> bool` | `PendingReference` 或 `Deferred` 返回 true |
| `fn record_resolution(artifact_input_resolution_record_ref: ArtifactInputResolutionRecordRef, intake_context_ref: ArtifactIntakeContextRef, resolution_kind: ArtifactInputResolutionKind, resolution_result: ArtifactInputResolutionResult, resolution_state_ref: Option<ExternalReferenceResolutionStateRef>) -> Self` | 记录一次 intake 收束动作 |

| 红线 | 说明 |
|---|---|
| 不替代 intake state | 当前 intake lifecycle 仍由 `ArtifactIntakeContext.intake_state` 表达 |
| 不建立 truth | accepted resolution 之后仍需独立 truth write |

##### `ArtifactReviewTraceRecord`

```rust
pub struct ArtifactReviewTraceRecord {
    pub artifact_review_trace_record_ref: ArtifactReviewTraceRecordRef,
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    pub assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
    pub trace_kind: ArtifactReviewTraceKind,
    pub resulting_review_state: ArtifactReviewState,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_review_trace_record_ref` | application id generator 生成 |
| `review_anchor_ref` | 从 changed `ArtifactReviewAnchor.artifact_review_anchor_ref` 复制 |
| `assignment_ref` | 责任承担相关事件时为 `Some`,否则可为 `None` |
| `trace_kind` / `resulting_review_state` | 与 review accepted transition 对齐,禁止靠 trace 文本推断状态 |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactReviewTraceRecordRef` | 返回 record ref |
| `fn mentions_assignment(&self) -> bool` | 判断是否带责任承担锚点 |
| `fn record_trace(artifact_review_trace_record_ref: ArtifactReviewTraceRecordRef, review_anchor: &ArtifactReviewAnchor, assignment_ref: Option<ArtifactResponsibilityAssignmentRef>, trace_kind: ArtifactReviewTraceKind) -> Self` | 记录一次 review / responsibility 追溯事件 |

| 红线 | 说明 |
|---|---|
| 不等于 review acceptance | readiness / close / invalidate 仍看 `ArtifactReviewAnchor.review_state` |
| 不替代 assignment truth | 责任当前状态仍看 `ArtifactResponsibilityAssignment.assignment_state` |

##### `AutomationIntakeAuditRecord`

```rust
pub struct AutomationIntakeAuditRecord {
    pub automation_intake_audit_record_ref: AutomationIntakeAuditRecordRef,
    pub automation_input_ref: AutomationArtifactInputRef,
    pub audit_kind: AutomationAuditKind,
    pub audit_result: AutomationAuditResult,
    pub intake_context_ref: Option<ArtifactIntakeContextRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `automation_intake_audit_record_ref` | application id generator 生成 |
| `automation_input_ref` | 从 loaded / changed `AutomationArtifactInput.automation_artifact_input_ref` 复制 |
| `audit_kind` / `audit_result` | 只解释 boundary check、route、accept、reject 结果 |
| `intake_context_ref` | 仅当自动化输入被正式接入 intake 时为 `Some` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> AutomationIntakeAuditRecordRef` | 返回 record ref |
| `fn entered_intake(&self) -> bool` | `audit_result = Accepted` 且 `intake_context_ref.is_some()` 时返回 true |
| `fn record_audit(automation_intake_audit_record_ref: AutomationIntakeAuditRecordRef, automation_input_ref: AutomationArtifactInputRef, audit_kind: AutomationAuditKind, audit_result: AutomationAuditResult, intake_context_ref: Option<ArtifactIntakeContextRef>) -> Self` | 记录一次 automation boundary audit |

| 红线 | 说明 |
|---|---|
| automation 仍是 candidate-only | audit accepted 不等于 fact / version 已建立 |
| 不替代 `AutomationArtifactInput` | 当前 automation lifecycle 仍由输入对象表达 |

#### 11.4.4 consumer / handoff / refresh record object contracts

这组 record 负责解释消费、交接和外部镜像刷新,统一归 `artifact_domain::records::traceability`。它们只能追溯、告警或留痕,不得回写 truth。

##### `ArtifactTraceRecord`

```rust
pub struct ArtifactTraceRecord {
    pub artifact_trace_record_ref: ArtifactTraceRecordRef,
    pub consumer_ref: AdjacentConsumerRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub operation_kind: ArtifactTraceOperationKind,
    pub trace_state: ArtifactTraceState,
    pub backref_ref: Option<ArtifactConsumptionBackrefRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_trace_record_ref` | application id generator 生成 |
| `consumer_ref` / `truth_anchor_ref` | 来自当前 read / export / handoff accepted path |
| `operation_kind` / `trace_state` | 只表达本次 trace append 的动作和结果 |
| `backref_ref` | 仅当该 trace 已解释到正式 consumption backref 时为 `Some` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactTraceRecordRef` | 返回 record ref |
| `fn is_failure(&self) -> bool` | `trace_state = Failed` 返回 true |
| `fn record_trace(artifact_trace_record_ref: ArtifactTraceRecordRef, consumer_ref: AdjacentConsumerRef, truth_anchor_ref: ArtifactTruthAnchorRef, operation_kind: ArtifactTraceOperationKind, trace_state: ArtifactTraceState, backref_ref: Option<ArtifactConsumptionBackrefRef>) -> Self` | 追加一次消费 / handoff 追溯记录 |

| 红线 | 说明 |
|---|---|
| trace 不是 truth | 不建立、不修复、不替代 `ArtifactFact`~`ArtifactBaseline` |
| query no-write 仍成立 | query 只读 trace record,不得补写 missing trace |

##### `ArtifactHandoffRecord`

```rust
pub struct ArtifactHandoffRecord {
    pub artifact_handoff_record_ref: ArtifactHandoffRecordRef,
    pub consumer_ref: AdjacentConsumerRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub channel_ref: ArtifactHandoffChannelRef,
    pub handoff_state: ArtifactHandoffState,
    pub trace_ref: Option<ArtifactTraceRecordRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `artifact_handoff_record_ref` | application id generator 生成 |
| `consumer_ref` / `truth_anchor_ref` / `channel_ref` | 来自 handoff accepted path 或 maintenance append path |
| `handoff_state` | 只允许 `Prepared | Delivered | Failed | Retryable` |
| `trace_ref` | handoff 已有正式 trace linkage 时为 `Some` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ArtifactHandoffRecordRef` | 返回 record ref |
| `fn is_delivery_success(&self) -> bool` | `handoff_state = Delivered` 返回 true |
| `fn record_handoff(artifact_handoff_record_ref: ArtifactHandoffRecordRef, consumer_ref: AdjacentConsumerRef, truth_anchor_ref: ArtifactTruthAnchorRef, channel_ref: ArtifactHandoffChannelRef, handoff_state: ArtifactHandoffState, trace_ref: Option<ArtifactTraceRecordRef>) -> Self` | 记录一次 handoff append-only outcome |

| 红线 | 说明 |
|---|---|
| handoff failure 不改 truth | 失败只能体现在 record 和后续 operations report |
| 不伪造交接完成 | `Delivered` 必须来自正式 publisher / adapter outcome |

##### `ExternalMirrorRefreshRecord`

```rust
pub struct ExternalMirrorRefreshRecord {
    pub external_mirror_refresh_record_ref: ExternalMirrorRefreshRecordRef,
    pub external_ref: ExternalSourceRef,
    pub reference_kind: ArtifactExternalReferenceKind,
    pub refresh_state: ArtifactMirrorRefreshState,
    pub snapshot_ref: Option<LocalMirrorSnapshotRef>,
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
}
```

| 字段 | 约束 / 来源 |
|---|---|
| `external_mirror_refresh_record_ref` | application id generator 生成 |
| `external_ref` / `reference_kind` | 从 refresh target 或 loaded resolution state 复制 |
| `refresh_state` | 只表达本次 refresh append 结果 |
| `snapshot_ref` | 仅在捕获到正式 local mirror snapshot 时为 `Some` |
| `resolution_state_ref` | 仅当 refresh 同时解释了哪一个 resolution state 时为 `Some` |

| helper / factory | 作用 |
|---|---|
| `fn to_ref(&self) -> ExternalMirrorRefreshRecordRef` | 返回 record ref |
| `fn captured_snapshot(&self) -> bool` | `snapshot_ref.is_some()` 返回 true |
| `fn record_refresh(external_mirror_refresh_record_ref: ExternalMirrorRefreshRecordRef, external_ref: ExternalSourceRef, reference_kind: ArtifactExternalReferenceKind, refresh_state: ArtifactMirrorRefreshState, snapshot_ref: Option<LocalMirrorSnapshotRef>, resolution_state_ref: Option<ExternalReferenceResolutionStateRef>) -> Self` | 记录一次 external mirror refresh outcome |

| 红线 | 说明 |
|---|---|
| 不伪造 snapshot | `snapshot_ref` 只能来自正式 mirror capture |
| 不替代 resolution state | 当前可用性仍由 `ExternalReferenceResolutionState.resolution_state` 表达 |

#### 11.4.5 cross-record red lines

- `ArtifactFactChangeRecord` 到 `ArtifactBaselineChangeRecord` 只解释 accepted truth transition,不决定当前状态。
- `ArtifactInputResolutionRecord`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord` 只解释收束过程,不替代 boundary / context object。
- `ArtifactTraceRecord`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord` 只负责追溯、交接、刷新留痕,不得回滚 truth 或伪造外部快照。
- record query 只读 append-only 结果,不得在读取路径补写 missing record、修复 stale state 或改变 handoff / refresh outcome。

---

## 12. `application` helper 对象契约

`application` local helper 不是 public protocol DTO,也不是 domain truth / policy subject,但它们已经成为 `L1-artifact` 中 idempotent operation、stored result replay、entry-to-service normalized context 和 application error surface 的唯一稳定 owner。Step 7 已经直接依赖 exact naming,因此本步必须在 Step 6 正式闭口。

### 12.1 operation / idempotency / stored-result carrier family

```rust
/// Stable application-local operation name.
pub struct ArtifactOperationName(pub String);

/// Canonical request digest used by idempotency.
pub struct ArtifactRequestDigest(pub String);

/// Stable stored-result reference.
pub struct ArtifactApplicationResultRef(pub String);

/// Stable stored serialized surface reference.
pub struct ArtifactStoredResultSurfaceRef(pub String);

/// Stable application-local idempotency record reference.
pub struct ArtifactIdempotencyRef(pub String);
```

| carrier | 作用 | 约束 / 来源 |
|---|---|---|
| `ArtifactOperationName` | 标识 application operation identity | 非空;只能来自正式 command / consumer / job operation 名称,不得使用 HTTP path、topic、cron 名或 fake string |
| `ArtifactRequestDigest` | 作为 idempotency canonical digest | 由 application factory 统一 canonicalize;不得包含 request id、trace id、timestamp、随机数或 runtime-only 字段 |
| `ArtifactApplicationResultRef` | 标识 stored result identity | `system_generated`;指向已保存 command result / rejection、inbound receipt 或 job report surface |
| `ArtifactStoredResultSurfaceRef` | 标识已序列化 surface | `system_generated`;只指向 body-free stored surface,不得指向 truth body 或外部正文 |
| `ArtifactIdempotencyRef` | 标识 idempotency reservation | `system_generated`;只用于 reserve / complete / conflict path |

统一红线:

- 上述 carrier 全部属于 `application`,不得漂移到 `contracts`、`api`、`worker`、`jobs` 或 `infra` fake private helper。
- 它们服务 duplicate replay / stored result lookup / normalized operation identity,不得作为 domain truth identity。

### 12.2 `ArtifactIdempotentOperationContext`

```rust
/// Minimal application-local idempotent operation context.
pub struct ArtifactIdempotentOperationContext {
    pub operation_name: ArtifactOperationName,
    pub channel_kind: ArtifactOperationChannelKind,
    pub actor_ref: ActorRef,
    pub idempotency_key: IdempotencyKey,
    pub trace_id: TraceId,
}

/// Channel of an idempotent application operation.
pub enum ArtifactOperationChannelKind {
    ApiCommand,
    WorkerConsumer,
    OperationsJob,
}
```

| 字段 | 作用 | 约束 / 来源 |
|---|---|---|
| `operation_name` | application operation identity | 来自 trusted operation naming,不得由 entry handler path / topic / scheduler name 临时拼接 |
| `channel_kind` | 区分 command / consumer / job | 仅允许 `ApiCommand`、`WorkerConsumer`、`OperationsJob`;query 不进入本对象 |
| `actor_ref` | 正式 actor identity | command 来源于 `ActorContext`;consumer 来源于 trusted source mapping;job 来源于 operator / system actor |
| `idempotency_key` | 幂等 key | command 来源于 `CommandMetadata`;consumer 来源于 dedup key;job 来源于 job idempotency key |
| `trace_id` | trace context | 来源于 trusted metadata / envelope / job metadata,不得本地重造 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query 不使用本对象 | query no-write,不得 reserve idempotency |
| entry 不得直接拼装 | `api` / `worker` / `jobs` 只能先构造 call context,再交由 `ArtifactOperationContextFactory` 归一化 |
| duplicate replay 不改字段语义 | duplicate path 必须复用已保存 `operation_name` / key / result surface,不得重算 channel identity |

### 12.3 entry-to-service call context family

```rust
/// Shared command call context assembled by API entry.
pub struct ArtifactCommandCallContext {
    pub actor_context: ActorContext,
    pub metadata: CommandMetadata,
}

/// Shared query call context assembled by API entry.
pub struct ArtifactQueryCallContext {
    pub actor_context: ActorContext,
    pub metadata: QueryMetadata,
}

/// Shared inbound event call context assembled by worker entry.
pub struct ArtifactInboundEventCallContext {
    pub source_event_id: OpaqueRef,
    pub source_ref: ExternalSourceRef,
    pub source_schema_ref: OpaqueRef,
    pub dedup_key: IdempotencyKey,
    pub trace_id: TraceId,
    pub occurred_at: Timestamp,
}

/// Shared operations job call context assembled by jobs entry.
pub struct ArtifactJobCallContext {
    pub operator_ref: ActorRef,
    pub metadata: JobMetadata,
    pub run_id: OpaqueRef,
    pub idempotency_key: IdempotencyKey,
    pub trace_id: TraceId,
}
```

| call context | 作用 | 约束 / 来源 |
|---|---|---|
| `ArtifactCommandCallContext` | API 到 application 的 command 归一化上下文 | 只承载 `ActorContext` + `CommandMetadata`;缺少 actor / metadata / idempotency key 不得进入 truth 写路径 |
| `ArtifactQueryCallContext` | API 到 application 的 query 归一化上下文 | 只承载 `ActorContext` + `QueryMetadata`;不得携带 write idempotency 或 mutation hint |
| `ArtifactInboundEventCallContext` | worker 到 application 的 inbound consumer 归一化上下文 | 来源于 trusted envelope;保存 source event id / ref / schema / dedup / trace / occurred_at;不得保存 payload body |
| `ArtifactJobCallContext` | jobs 到 application 的 maintenance job 归一化上下文 | 来源于 trusted job metadata;保存 operator、run id、idempotency key、trace;不得把 job 变成业务 command |

红线:

- `api` / `worker` / `jobs` 只拥有组装对应 call context 的职责,不得越权读取 repository 或直接组装 stored result / truth mutation。
- call context 是 application-owned carrier,不是 public contracts DTO,也不是 domain truth。

### 12.4 `ArtifactApplicationError`

```rust
/// Application-owned error carrier for port and orchestration failures.
pub struct ArtifactApplicationError {
    pub code: ArtifactApplicationErrorCode,
    pub subject_ref: Option<ArtifactTruthAnchorRef>,
    pub message: String,
}

pub enum ArtifactApplicationErrorCode {
    DomainRejected,
    PersistenceFailed,
    ReferenceUnavailable,
    IdempotencyConflict,
    RelayFailed,
    InvariantViolation,
}

pub type ApplicationError = ArtifactApplicationError;
```

| 字段 / variant | 作用 | 约束 / 来源 |
|---|---|---|
| `code` | application error classification | 只使用固定 enum;Step 12 再扩展 protocol / recovery mapping |
| `subject_ref` | 可选 truth subject | 只能引用已存在 `ArtifactTruthAnchorRef`;缺失时表示错误未锚定到正式 truth |
| `message` | redacted diagnostic text | 只允许 redacted message;不得保存 request body、external body、config body、stack trace 或 adapter raw error |
| `DomainRejected` | domain policy / transition 拒绝 | 来源于 domain error 映射,不是 public rejection code |
| `PersistenceFailed` | repository / UoW / durable write 失败 | 来源于 port failure |
| `ReferenceUnavailable` | resolver / reference refresh 无法提供正式引用 | 来源于 reference / snapshot / mirror outcome |
| `IdempotencyConflict` | same key different digest 或 conflict path | 来源于 idempotency reservation conflict |
| `RelayFailed` | relay / handoff / publisher port 失败 | 只影响 result / marker / report surface,不改变 truth accepted 语义 |
| `InvariantViolation` | application 发现 schema / state / ownership 不变量被破坏 | 用于阻断错误设计实现,不得被 fake 静默吞掉 |

### 12.5 stored result / receipt / report envelope family

```rust
pub struct ArtifactIdempotencyConflictReason(pub String);

pub enum ArtifactIdempotencyReservation {
    Reserved {
        idempotency_ref: ArtifactIdempotencyRef,
    },
    Duplicate {
        result_ref: ArtifactApplicationResultRef,
    },
    Conflict {
        idempotency_ref: ArtifactIdempotencyRef,
        reason: ArtifactIdempotencyConflictReason,
    },
}

pub enum ArtifactCommandRejectionCode {
    PolicyRejected,
    InvalidState,
    MissingRequiredReference,
    VisibilityDenied,
    DuplicateConflict,
}

pub enum ArtifactInboundDisposition {
    Accepted,
    Duplicate,
    Delayed,
    Rejected,
    UnsupportedSchema,
    Quarantined,
}

pub enum ArtifactJobOutcome {
    Completed,
    PartiallyCompleted,
    Failed,
}

pub struct ArtifactCommandResultEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub truth_anchor_ref: Option<ArtifactTruthAnchorRef>,
}

pub struct ArtifactCommandRejectionEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub rejection_code: ArtifactCommandRejectionCode,
}

pub struct ArtifactInboundReceiptEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub disposition: ArtifactInboundDisposition,
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
}

pub struct ArtifactJobReportEnvelope {
    pub result_ref: ArtifactApplicationResultRef,
    pub operation_name: ArtifactOperationName,
    pub surface_ref: ArtifactStoredResultSurfaceRef,
    pub outcome: ArtifactJobOutcome,
    pub changed_refs: Vec<OpaqueRef>,
    pub failed_refs: Vec<OpaqueRef>,
}

pub enum StoredArtifactOperationResult {
    CommandResult(ArtifactCommandResultEnvelope),
    CommandRejection(ArtifactCommandRejectionEnvelope),
    InboundReceipt(ArtifactInboundReceiptEnvelope),
    JobReport(ArtifactJobReportEnvelope),
}
```

| carrier | 作用 | 约束 / 来源 |
|---|---|---|
| `ArtifactIdempotencyConflictReason` | 表达 conflict 解释文本 | 非空、redacted;不得保存 payload body 或 raw error |
| `ArtifactIdempotencyReservation` | 表达 reserve / duplicate / conflict 三分结果 | duplicate 只能携带已保存 `result_ref`;conflict 必须保留正式 `idempotency_ref` |
| `ArtifactCommandRejectionCode` | command rejection business classification | 只服务 stored rejection / protocol mapping,不替代 domain error |
| `ArtifactInboundDisposition` | inbound receipt disposition | 只服务 consumer receipt / worker ack mapping,不进入 core truth state |
| `ArtifactJobOutcome` | maintenance job outcome | 只服务 job report / duplicate replay,不进入 core truth state |
| `ArtifactCommandResultEnvelope` | accepted command stored result | `truth_anchor_ref` 可空但非空时必须回指正式 truth |
| `ArtifactCommandRejectionEnvelope` | rejected command stored result | 只保存 rejection code 和 stored surface,不保存外部正文 |
| `ArtifactInboundReceiptEnvelope` | consumer stored receipt | disposition / resolution / trace 只解释 inbound 结果,不允许重放 mutation |
| `ArtifactJobReportEnvelope` | job stored report | `changed_refs` / `failed_refs` 只保存 body-free refs,不保存下游副本或外部正文 |
| `StoredArtifactOperationResult` | duplicate replay 的统一 envelope owner | variant 只允许上述 4 类 surface,save/get 必须字段对称 |

统一红线:

- duplicate replay 只能返回已保存 envelope,不得从 current truth、current projection、current mirror 或外部 source 重新计算结果。
- receipt / report / rejection / result 全部属于 application-owned replay surface,不是 domain truth,也不允许反写真相。
- `api` / `worker` / `jobs` 只能消费这些 envelope 的 surface,不得定义第二套平行 result / receipt / report business carrier。

---

## 13. 非 core 模块对象闭口结论

| 模块 | 本步结论 | 后续展开位置 |
|---|---|---|
| `application` | 本步已正式闭口 application-owned helper object,包括 operation context、call context family、stored-result replay surface 和 application error | Step 7 / Step 8 / Step 12 / Step 13 |
| `infra` | 当前不新增 canonical object;只声明 repository / resolver / publisher / handoff adapter 将持久化或装配本文件对象 | Step 7 / Step 11 / Step 14 |
| `api` | 当前不新增 canonical object;sync entry 只映射 DTO 到 `application` call context 与 Step 6 shared / truth carrier | Step 8 |
| `worker` | 当前不新增 canonical object;consumer 只映射 inbound source 到 `application` inbound call context 与 Step 6 intake / resolution / trace object | Step 8 / Step 13 |
| `jobs` | 当前不新增 canonical object;job 只映射 runner metadata 到 `application` job call context,并消费 Step 6 derived / report / handoff object | Step 8 / Step 11 / Step 15 |

这一结论里,只有 `application` 已在本步完成 helper object 闭口;其余 non-core seam 仍故意收窄:

- 避免在 `infra` / `api` / `worker` / `jobs` 对象层提前发明 `runtime builder helper`、`entry accumulator`、`runner local state` 等新主语。
- 让 Step 7 / Step 8 / Step 11 先把 trait / protocol / runtime seam 闭口,再决定剩余运行层 helper 的 exact schema。

reopen 规则:

- 如果 Step 7 / Step 8 / Step 11 / Step 14 发现存在唯一 stable carrier 只能落在 `application` / `infra` / `api` / `worker` / `jobs`,则必须回开 Step 6,不得在后续 Step 私补 object。
- `application` 的 reopen 触发点聚焦新增 operation / replay / error / context helper;`infra` / `api` / `worker` / `jobs` 的 reopen 触发点聚焦 runtime availability / config ref、entry disposition、runner local state、job report assembly。
- `infra` 当前 defer 是正式设计结论,不是遗漏:目前仅 owner / injection boundary 已稳定,而 exact config carrier / runtime helper schema 尚未被 Step 7 直接消费,因此不得在本步猜写 `RuntimeConfig` 字段、`ConfigError` variant 或 builder constructor。
- `api` / `worker` / `jobs` 当前 defer 也是正式设计结论,不是遗漏:目前稳定 entry carrier 已被 `Artifact*CallContext`、`ArtifactInboundReceiptEnvelope`、`ArtifactJobReportEnvelope` 和 public response surface 吸收,Step 7 只固定解析 / 调度 / 映射职责,尚未证明需要独立 canonical helper object。

---

## 14. 对象组字段来源审计

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| `contracts` shared carrier | `ArtifactFactRef`、`ArtifactTruthAnchorRef`、`ArtifactReadSurfaceView`、`ArtifactReconciliationReport` | typed ref / reason / state / kind / report 只由 public carrier、accepted truth copy、resolver snapshot copy、derived-only 来源构成 | Step 8 protocol surface、Step 9 read / report flow、Step 11 storage shape | public DTO / event / job / query view 需要 domain-only 二级类型或未闭口 carrier |
| truth core | `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline` | `system_generated`、`accepted_truth_copy`、`same_tx_constructed_ref` 已作为唯一 truth 字段来源类别 | Step 7 repository / versioned read、Step 9 write flow、Step 10 lifecycle matrix | truth object 需要 external body、view state、runtime trace 或无来源 version / basis |
| boundary / context support | `ArtifactIntakeContext`、`ArtifactReviewAnchor`、`AutomationArtifactInput`、`ArtifactConsumptionBackref` | `command_or_consumer_input_copy`、`resolver_snapshot_copy`、`accepted_truth_copy` 已覆盖输入、review、automation、consumption 字段来源 | Step 7 resolver / repository、Step 8 DTO / consumer input、Step 9 boundary flow | support object 需要直接拥有 truth lifecycle、保存外部正文或缺少 canonical truth anchor |
| support state / policy / record | `ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、policy object、append-only records | `derived_only`、`resolver_snapshot_copy`、`accepted_truth_copy` 已覆盖 freshness、resolution、trace、handoff、refresh 字段来源 | Step 7 append / lookup port、Step 9 maintenance flow、Step 10 state matrix | policy 需要保存 truth,record 需要 in-place mutate,或 freshness / resolution 反写 core truth |
| application helper | `ArtifactIdempotentOperationContext`、call context family、`StoredArtifactOperationResult`、`ArtifactApplicationError` | operation / digest / result / idempotency ref 来自 metadata、dedup、job input、system-generated ref 和 redacted result surface | Step 7 idempotency / stored-result port、Step 8 protocol mapping、Step 12 error mapping、Step 13 duplicate replay | duplicate path 试图重算 result;entry 层直接拼 idempotent context;error / receipt / report surface 保存 raw body |
| non-core remaining seam | `infra` / `api` / `worker` / `jobs` deferred object seam | 当前 Step 6 只闭合“不得私补 object”的规则,不闭合 exact helper schema | Step 8 / Step 11 / Step 14 / Step 15 | 后续 Step 需要唯一 stable carrier 却既不在 `contracts` 也不在 `domain` / `application`,并试图在剩余 non-core 模块临时发明 helper |

审计结论:

- 现有 `contracts`、`domain` 与 `application` helper object group 已具备字段来源分类和 owner 边界。
- 当前最大 watchpoint 已收缩为 `infra` / `api` / `worker` / `jobs` 剩余 runtime / entry seam 不能借口实现便利私补 canonical helper。

---

## 15. 状态闭环审计

| 状态族 | 状态主语 | 初始状态 | 关键迁移 | 终态 / 特殊状态 | 后续 Step 闭合位置 |
|---|---|---|---|---|---|
| truth lifecycle | `ArtifactFactState`、`ArtifactVersionState`、`ArtifactLineageState`、`ArtifactBaselineState` | `PendingIntake`、`Candidate`、`PendingBasis`、`Draft` | establish / publish / supersede / freeze / retire | `Closed`、`Retired`、`Frozen` 等 truth 终态 | Step 9 write flow、Step 10 truth state matrix |
| truth-support lifecycle | `ArtifactContentFactContextState`、`ArtifactVersionCandidateState` | `Linked`、`Open` | verify / reject / supersede / publish-ready | `Unavailable`、`Rejected`、`Superseded` | Step 9 write / review flow、Step 10 support matrix |
| boundary / context lifecycle | intake、review、responsibility、automation、consumption 相关 state / kind | 各对象 factory 初始 state | converge / assign / accept / reject / consume | boundary state 可终止但不替代 truth lifecycle | Step 8 DTO / consumer protocol、Step 9 boundary flow、Step 10 matrix |
| derived / read / maintenance lifecycle | `ArtifactDerivedViewState`、`ArtifactExternalResolutionState`、preview / report / reconciliation / handoff / refresh state | fresh / pending / unresolved / queued 等 derived 初始语义 | stale / resolved / failed / handed-off / refreshed | derived degraded / failed 只影响 read / maintenance,不改变 truth | Step 9 maintenance flow、Step 10 derived matrix、Step 11 persistence |
| append-only traceability lifecycle | `ArtifactTraceState`、`ArtifactHandoffState`、`ArtifactMirrorRefreshState`、input / audit / trace kind-result carrier | record factory 建立的 append-only entry | append newer record,不得回写旧 record | failure record 可见、不可伪造成 success | Step 9 append timing、Step 10 state owner review、Step 11 append-only persistence |
| application result / replay lifecycle | `ArtifactIdempotencyReservation`、`ArtifactInboundDisposition`、`ArtifactJobOutcome` | reserve / inbound receive / job report factory | reserve -> duplicate/conflict;accepted / delayed / rejected / duplicate receipt;completed / partial / failed report | 只服务 replay / result surface,不得进入 truth lifecycle | Step 7 idempotency / result port、Step 8 protocol mapping、Step 13 duplicate replay |
| entry / runtime lifecycle | `infra` / `api` / `worker` / `jobs` local runtime state | 当前 Step 6 不闭口剩余 canonical state 主语 | 不允许在 Step 7+ 自发升格为业务 state | 若需要 public / persistence stable state,必须回开 Step 6 | Step 8 / Step 11 / Step 14 / Step 15 |

状态闭环结论:

- `contracts` / `domain` / `application` 已覆盖业务 truth、support、derived、traceability 和 replay/result surface 的正式状态 owner。
- `infra` / `api` / `worker` / `jobs` 的 runtime 状态目前仍是 reopen watchpoint,不能被后续 Step 静默提升为 business state。

---

## 16. Step 7 承接清单与待确认事项

### 16.1 Step 7 承接清单

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| truth repository ports | `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline` 及其 support object | 定义 get / save / list / expected-version / versioned read,且不得改 object owner | truth lifecycle 需要 repository version / load surface,实现侧只能私补 |
| resolver / mirror ports | `ExternalReferenceResolutionState`、external refs、snapshot refs、safe summary refs | 只返回 body-free summary / snapshot / resolution input,不返回 external body | write / read / refresh flow 需要外部正文或临时 resolver helper |
| projection / report / read-model ports | `ArtifactReadSurfaceView`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`、`ArtifactDerivedViewState` | 定义 replace / load / mark stale / lookup affected read surface | Step 9 read / maintenance flow 无法 1:1 构造 public surface |
| append-only record ports | change / trace / handoff / refresh record object | 定义 append-only write、history lookup、record read order | record factory 已有但无正式 append surface,实现会绕写 truth repo |
| idempotency / stored-result ports | `ArtifactIdempotentOperationContext`、`ArtifactIdempotencyReservation`、`StoredArtifactOperationResult`、`ArtifactApplicationResultRef` | 定义 reserve / complete / save / get,并保持 duplicate 只 replay saved surface | duplicate replay、stored result lookup、command rejection / consumer receipt / job report 会被实现侧临时重算 |
| entry context normalization | call context family、`ArtifactOperationContextFactory` | 定义 command / query / inbound / job 的单一归一化来源 | `api` / `worker` / `jobs` 会各自拼 actor / trace / idempotency 语义 |
| publisher / handoff ports | `ArtifactHandoffRecord`、public report / handoff channel carrier | 定义 relay / handoff callable surface,并保持 handoff failure 不改 truth | publisher / handoff 只能从 current truth 现查现造,破坏 Step 6 red line |
| remaining non-core reopen gate | `infra` / `api` / `worker` / `jobs` deferred seam | 验证 `contracts` + `domain` + `application` 是否足够承接 runtime helper;若不够,必须回开 Step 6 | 后续 Step 临时发明 runtime / entry helper |

### 16.2 当前待确认事项

| 编号 | 事项 | 当前结论 | 后续动作 |
|---|---|---|---|
| `ART-S6-WATCH-001` | `infra` 是否最终需要 exact runtime config / builder / config error helper carrier | 当前 evidence 只稳定到 owner、config 分类和 builder 注入边界;HLD 明确保留 `RuntimeConfig` 字段全集、`ConfigError` 枚举全集和 constructor 参数,Step 7 也尚未直接依赖 exact helper type,因此当前继续 defer | Step 11 / Step 14 一旦出现 exact type name、persistence-visible runtime state 或单一 builder helper 需求,立即回开 Step 6 |
| `ART-S6-WATCH-002` | `api` / `worker` / `jobs` local runtime state 是否会被后续 Step 误升格为 business state | 当前 evidence 已稳定到 `ArtifactCommandCallContext` / `ArtifactQueryCallContext` / `ArtifactInboundEventCallContext` / `ArtifactJobCallContext`、`ArtifactInboundReceiptEnvelope`、`ArtifactJobReportEnvelope` 足以承接入口侧业务 carrier;Step 5 / Step 7 也把三类入口限制为解析 / 调度 / 映射,因此当前继续 defer | 若出现 public / persistence visible runtime state、独立 entry disposition object 或无法落在现有 context / receipt / report surface 的单一 helper 需求,回开 Step 6 |

---

## 17. 当前结论与进入 Step 7 条件

当前 Step 6 已闭合以下结论:

- Step 6 的批次计划、模块执行顺序、非 core 模块决策和模块内停审记录已经补齐。
- `contracts` 已成为 `L1-artifact` 所有 public typed carrier、state / kind、view / report 的唯一 owner。
- `domain` 已成为 truth、support state、policy、history / audit / trace / handoff / refresh record 的唯一 owner。
- `application` 已成为 idempotent operation、stored result replay、entry-to-service call context 和 application error surface 的唯一 owner。
- 所有 `02` 中点名的关键对象都已获得 exact Rust-facing carrier、字段集合、成员函数和禁止事项。
- `infra` / `api` / `worker` / `jobs` 当前仍不新增 canonical object,但已经写明 reopen 条件,避免后续 Step 私补 helper。
- 对象组字段来源审计和状态闭环审计已经显式写入本文件,不再只停留在通用口径。

Step 7 必须直接承接本文件:

- repository / resolver / publisher / handoff trait 的参数和返回值只能引用本文件已闭口的对象或 `core-contracts` shared type
- DTO / query view / event / job I/O 的二级类型只能从 `artifact_contracts` 取
- flow / state machine 若引用 object method / policy guard / record factory,必须使用本文件 exact type name
- application layer 已存在 `ArtifactIdempotentOperationContext`、call context family、`StoredArtifactOperationResult` 和 `ArtifactApplicationError`;Step 7 不得再造平行 helper。
- 若 Step 7 发现 `infra` / `api` / `worker` / `jobs` 仍需要唯一 stable carrier 才能闭合 runtime availability、config error、entry disposition 或 runner runtime state,必须回开 Step 6 而不是在 trait / service / adapter 层私补。

进入 Step 7 的条件:

- `contracts` / `domain` 的 exact object owner 已稳定。
- `application` helper object owner 已稳定;其余 non-core 模块对象的 defer 决策已显式记录,并附 reopen 条件。
- 字段来源审计、状态闭环审计和 Step 7 承接清单已完成。
- 当前没有立即阻塞 Step 7 的缺口;只有两条 watchpoint,且它们都要求一旦触发就回开 Step 6。
