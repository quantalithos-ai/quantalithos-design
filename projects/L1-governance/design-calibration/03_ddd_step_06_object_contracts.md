# Step 6. 逐模块定义对象实现契约

### 1. Step 状态

- 状态:[x] 已完成;可进入 Step 7 Trait / Port / Adapter 契约
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节:`03-详细设计.md` §5 模块实现契约中的对象实现契约 / §6 全局对象索引

### 2. 本步目标

在 Step 5 已固定的 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块主轴下,把概要设计 Step 6 点名的关键对象提升为可 1:1 落码的 Rust 对象契约。

本 Step 最终必须给出:

- 每个对象独立小节。
- Rust struct / enum / value object / service code block。
- 字段表、成员函数表、工厂函数表。
- enum 变体表,包含 Rustdoc 注释、作用、允许来源和允许去向。
- 不变量、禁止事项和字段来源闭环。

本 Step 按“内容详尽、批次受控”的方式写入。每个批次最多约 300 行,但 300 行只限制单次写入规模,不限制章节、小节或主题的最终长度。若某个对象组需要更多内容,必须拆成多个批次继续写完,不得为了控制行数而压缩字段、状态、函数、来源、约束、正反例或闭环说明。

### 3. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块主轴、依赖方向、对象归属门禁 | 确认对象落到 `contracts` / `domain` / `application` / `infra` / entry module |
| `02_hld_step_06_key_objects.md` | 关键对象主表、对象分布和反查清单 | 作为 Step 6 对象清单来源 |
| `02_hld_step_06_key_objects_truth_context_decision.md` | context / decision / approval 对象骨架 | 作为 domain truth 第一批对象来源 |
| `02_hld_step_06_key_objects_truth_policy_compliance.md` | policy / compliance / corrective / reference state 对象骨架 | 作为 domain truth 第二批对象来源 |
| `02_hld_step_06_key_objects_policies.md` | policy / guard 对象骨架 | 作为 domain policy 对象来源 |
| `02_hld_step_06_key_objects_projections.md` | projection / read model / report 对象骨架 | 作为 contracts view 与 domain projection state 来源 |
| `02_hld_step_06_key_objects_references_audit.md` | reference / snapshot / audit / history / outbox 对象骨架 | 作为 contracts ref 与 domain trace / outbox 来源 |
| `02_hld_step_09_state_machine.md` | 状态集合、状态含义和允许迁移 | 固定状态 enum 变体和迁移方向 |
| `03_ddd_step_03_constraints.md` | Rust 2024、源码英文、rustdoc、依赖约束 | Rust code block 中 doc comment 使用英文 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、状态、DTO / Domain 闭环标准 | 检查对象字段来源和 public DTO 归属 |

### 4. 分批写入计划

| 批次 | 写入内容 | 目标章节 | 状态 |
|---|---|---|---|
| 6.0 | Step 6 框架、输入、对象归属总览、写入模板和门禁 | §1~§9 | [x] 已完成 |
| 6.1-1 | 重启 `contracts` shared type:写入纪律、分组计划、identity / context / input / gate / decision 基础 id/ref | §10.1~§10.3 | [x] 已完成 |
| 6.1-2 | `contracts` approval / responsibility shared id/ref/object card | §10.4 | [x] 已完成 |
| 6.1-3 | `contracts` governed subject / source / evidence / external snapshot and context shared refs | §10.5~§10.6 | [x] 已完成 |
| 6.1-4 | `contracts` policy / shared rules / conflict shared id/ref | §10.7 | [x] 已完成 |
| 6.1-5 | `contracts` control / compliance / nonconformity shared id/ref | §10.8 | [x] 已完成 |
| 6.1-6 | `contracts` projection / reconciliation / trace / audit / outbox / history id/ref | §10.9 | [x] 已完成 |
| 6.1-7a | `contracts` context / input / gate / decision / responsibility state enum | §10.10 | [x] 已完成 |
| 6.1-7b | `contracts` policy / shared rules / conflict state enum | §10.11 | [x] 已完成 |
| 6.1-7c | `contracts` control / compliance / control coverage state enum | §10.12 | [x] 已完成 |
| 6.1-7d | `contracts` nonconformity corrective state enum | §10.13 | [x] 已完成 |
| 6.1-7e | `contracts` derived / reference / outbox state enum | §10.14 | [x] 已完成 |
| 6.1-7f | `contracts` reconciliation report state、kind / change kind、reference marker helper | §10.15 | [x] 已完成 |
| 6.1-7g | `contracts` reference state、truth snapshot/change、reconciliation input helper | §10.16 | [x] 已完成 |
| 6.1-7h | `contracts` handoff / export marker and job report helper | §10.17 | [x] 已完成 |
| 6.1-7i | `contracts` public query/view helper and remaining report helper | §10.18 | [x] 已完成 |
| 6.1-7j | `contracts` shared type final audit and unresolved item table | §10.19 | [x] 已完成 |
| 6.2-1 | `domain` context / input object contracts,并补齐 context / input transition reason shared type | §10.3 / §11.1~§11.3 | [x] 已完成 |
| 6.2-2 | `domain` Gate / GovernanceDecision object contracts,并补齐 gate / decision transition reason shared type | §10.3 / §11.4~§11.5 | [x] 已完成 |
| 6.2-3 | `domain` approval / responsibility object contracts | §11.6~§11.8 | [x] 已完成 |
| 6.3-1 | `domain` policy fact / shared rules object contracts | §12.1~§12.3 | [x] 已完成 |
| 6.3-2 | `domain` policy conflict object contract | §12.4 | [x] 已完成 |
| 6.3-3 | `domain` control applicability object contract | §12.5 | [x] 已完成 |
| 6.3-4 | `domain` control review object contract | §12.6 | [x] 已完成 |
| 6.3-5 | `domain` AIIA conclusion object contract | §12.7 | [x] 已完成 |
| 6.3-6 | `domain` SoA conclusion object contract | §12.8 | [x] 已完成 |
| 6.3-7 | `domain` nonconformity record object contract | §12.9 | [x] 已完成 |
| 6.3-8 | `domain` corrective action object contract | §12.10 | [x] 已完成 |
| 6.3-9 | `domain` verification result object contract | §12.11 | [x] 已完成 |
| 6.4-1 | `domain` derived governance view state object contract | §13.1 | [x] 已完成 |
| 6.4-2 | `domain` external snapshot / mirror object contracts | §13.2 | [x] 已完成 |
| 6.4-3 | `domain` trace / audit record object contracts | §13.3 | [x] 已完成 |
| 6.4-4 | `domain` outbox record object contract | §13.4 | [x] 已完成 |
| 6.4-5a | `domain` decision / responsibility history record object contracts | §13.5 | [x] 已完成 |
| 6.4-5b | `domain` policy / control history record object contracts | §13.5 | [x] 已完成 |
| 6.4-5c | `domain` compliance / nonconformity history record object contracts | §13.5 | [x] 已完成 |
| 6.4-6 | `contracts` / `domain` handoff / export support object contract | §13.6 | [x] 已完成 |
| 6.5-1 | `domain` policy / guard 通用契约、`GovernanceTruthPolicy`、`GovernanceContextPolicy` | §14.1~§14.3 | [x] 已完成 |
| 6.5-2 | `domain` `DecisionPolicy` / `ApprovalResponsibilityPolicy` object contracts | §14.4~§14.5 | [x] 已完成 |
| 6.5-3 | `domain` `PolicyConflictPolicy` / `SharedRulesPolicy` / `PolicyScopePolicy` object contracts | §14.6~§14.8 | [x] 已完成 |
| 6.5-4 | `domain` `ControlApplicabilityPolicy` / `ComplianceConclusionPolicy` object contracts | §14.9~§14.10 | [x] 已完成 |
| 6.5-5 | `domain` `NonconformityClosurePolicy` / `ReadVisibilityPolicy` object contracts | §14.11~§14.12 | [x] 已完成 |
| 6.5-6 | `domain` `DerivedGovernanceViewPolicy` object contract | §14.13 | [x] 已完成 |
| 6.6-1 | `contracts` `GovernanceDashboardView` / `DecisionSummaryView` object contracts | §15.1~§15.2 | [x] 已完成 |
| 6.6-2 | `contracts` `PolicyEffectiveView` / `ControlCoverageView` object contracts | §15.3~§15.4 | [x] 已完成 |
| 6.6-3 | `contracts` `NonconformityStatusView` / `GovernanceReconciliationReport` object contracts | §15.5~§15.6 | [x] 已完成 |
| 6.6-4 | `application` service facade / operation context / idempotency / stored result / visibility decision helper object contracts | §15.7 | [x] 已完成 |
| 6.6-5 | `application` job report assembly helper object contract | §15.8 | [x] 已完成 |
| 6.7-1 | `infra` runtime config / runtime builder / adapter availability object contracts | §16.1 | [x] 已完成 |
| 6.7-2 | `infra` store / publisher / resolver / handoff adapter state object contracts | §16.2 | [x] 已完成 |
| 6.7-3 | `api` command / query entry object contracts | §16.3 | [x] 已完成 |
| 6.7-4 | `worker` inbound consumer / outbox loop / projection loop entry object contracts | §16.4 | [x] 已完成 |
| 6.7-5 | `jobs` operations job entry object contracts | §16.5 | [x] 已完成 |
| 6.8-1 | 字段闭环表:高复用字段来源审计 | §17.1 | [x] 已完成 |
| 6.8-2 | 字段闭环表:对象组字段来源审计 | §17.2 | [x] 已完成 |
| 6.8-3 | 状态闭环表 | §17.3 | [x] 已完成 |
| 6.8-4 | 回填草稿 | §18 | [x] 已完成 |
| 6.8-5 | 待确认事项 | §19 | [x] 已完成 |
| 6.8-6 | 进入 Step 7 条件 | §20 | [x] 已完成 |

### 5. SOP 问题回答框架

1. 每个模块中需要定义哪些 struct / enum / value object / service?

   回答框架:按 §6 对象归属总览分配。后续批次逐模块填充正式对象契约。

2. 每个对象的主要责任和不变量是什么?

   回答框架:每个对象小节必须包含“主要责任”“不变量”“禁止事项”。对象不得吸收相邻仓正文,projection / report / export 不得反写真相。

3. 每个字段的类型、作用和约束是什么?

   回答框架:每个对象字段必须在字段表中写明类型、作用、约束、来源。必填字段必须可回指 request / metadata / context / repository / port / snapshot / system generated source。

4. 每个成员函数的完整签名、参数类型、返回类型和副作用是什么?

   回答框架:domain object transition method 必须写完整签名和状态副作用。repository / port trait 函数不在本 Step 展开,留给 Step 7。

5. 哪些函数是工厂函数或静态函数?

   回答框架:每个 truth object 必须至少定义一个 factory 或说明由 application / repository 重建。factory 入参必须覆盖对象必填字段或说明系统生成来源。

6. 哪些状态 enum 需要写变体、允许来源和允许去向?

   回答框架:凡出现在 `02_hld_step_09_state_machine.md` 的状态组,都必须在本 Step 定义 enum code block 和变体表。状态名必须与 Step 9 一致。

7. 每个 enum variant 的 Rustdoc 注释是什么?带载荷 variant 的载荷类型承载什么语义?

   回答框架:每个 enum variant 必须有英文 Rustdoc。带载荷 variant 必须说明载荷对象的业务语义和字段来源。

### 6. 对象归属总览

| 模块 | 对象类别 | 本 Step 需要闭合的对象组 |
|---|---|---|
| `contracts` | typed id / ref / reason / marker / state enum | governance context、input、gate、decision、approval、policy、control、compliance、nonconformity、projection、reference、trace、audit、outbox、history 相关 id / ref / reason / marker / public state |
| `contracts` | public view / report helper | `GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`GovernanceReconciliationReport` |
| `domain` | truth / state object | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult` |
| `domain` | reference / snapshot / projection state | `DerivedGovernanceViewState`、`ReferenceResolutionState`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` |
| `domain` | trace / audit / outbox / history | `GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、`DecisionRecord`、`ResponsibilityTraceRecord`、`PolicyChangeRecord`、`ControlChangeRecord`、`ComplianceConclusionRecord`、`NonconformityChangeRecord` |
| `domain` | policy / guard | `GovernanceTruthPolicy`、`GovernanceContextPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy`、`DerivedGovernanceViewPolicy` |
| `application` | service helper / application value object | service facade、idempotency record、stored result ref、visibility decision、job report assembly helper |
| `infra` | runtime / adapter state | runtime config、runtime builder、in-memory stores、adapter state holders |
| `api` / `worker` / `jobs` | entry object | command handlers、query handlers、inbound consumers、outbox worker、operations job runners |

### 7. 写入模板

后续每个对象小节使用以下模板。字段和函数不得只写类型名,必须同时写来源、约束和副作用。

````md
##### `<TypeName>`

```rust
/// <English object summary and invariant.>
pub struct TypeName {
    /// <English field meaning and boundary.>
    pub field_name: FieldType,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|

| 不变量 / 禁止事项 | 说明 |
|---|---|
````

状态 enum 使用以下模板:

````md
```rust
/// <English enum boundary summary.>
pub enum StateName {
    /// <English variant business meaning.>
    Variant,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
````

### 8. 写入门禁

- Rust code block 中 doc comment 使用英文,正文表格说明使用中文。
- 每个 public struct、enum、field、variant、function 必须可被实现者逐项转写。
- 所有 public DTO / view / event / job 可能引用的 ref、state、reason、marker 必须归 `contracts` 或 `core-contracts`,不得引用 domain-only 类型。
- domain truth 必填字段必须有来源。来源可以是 command / metadata / system generated id / repository lookup / resolver snapshot / formal derivation。
- append-only history / trace / outbox record 的 id 来源、factory 入参和构造时机必须闭合。
- projection、report、external GRC export、handoff 和 reconciliation 只能消费或派生,不得反写 core truth。
- query、consumer、job 不能创建或修正核心 Governance truth。
- 如果某对象字段、状态或函数无法从已提交 HLD / architecture / requirements 中闭合,本 Step 必须标为待确认,不得自行补 schema。
- 单批最多约 300 行是写入节奏约束,不是内容详略约束。对象卡片、状态表和字段闭环必须写到可落码;写不完时继续下一批,不得删减必要内容。

### 9. 当前批次结论

- Step 6 已按“详尽内容、多批写入”的口径重启。
- 当前已完成 Step 6.1-1:`contracts` shared type 写入纪律、分组计划、external ref 基础 newtype、context / input / gate / decision 基础 id/ref。
- 当前已完成 Step 6.1-2:approval responsibility、approver requirement、responsibility chain、vote、threshold、delegation rule 和 responsibility reason shared type。
- 当前已完成 Step 6.1-3:governed subject、governance source、evidence summary、external snapshot 和 process / work / runtime context shared refs。
- 当前已完成 Step 6.1-4:policy effective fact、shared rules、policy conflict、governance scope、priority、effective-at 和 policy reason shared type。
- 当前已完成 Step 6.1-5:control applicability、control review、AIIA / SoA conclusion、nonconformity、corrective action、verification 和相关 reason / severity shared type。
- 当前已完成 Step 6.1-6:derived view、reconciliation report、trace、audit、outbox 和 history record shared type。
- 当前已完成 Step 6.1-7a:context / input / gate / decision / approval responsibility / responsibility chain / decision summary state enum。
- 当前已完成 Step 6.1-7b:policy effective、shared rule set 和 policy conflict state enum。
- 当前已完成 Step 6.1-7c:control applicability、control review、compliance conclusion 和 control coverage state enum。
- 当前已完成 Step 6.1-7d:nonconformity、corrective action 和 verification state enum。
- 当前已完成 Step 6.1-7e:derived view freshness、reference resolution 和 outbox publication state enum。
- 当前已完成 Step 6.1-7f:reconciliation report state、kind / change kind、reference marker helper。
- 当前已完成 Step 6.1-7g:reference resolution state、truth snapshot / change 和 reconciliation input helper。
- 当前已完成 Step 6.1-7h:handoff / export marker and job report helper。
- 当前已完成 Step 6.1-7i:public query / view helper and remaining report helper。
- 当前已完成 Step 6.1-7j:shared type final audit and unresolved item table。
- 当前已完成 Step 6.2-1:domain `GovernanceContext` / `GovernanceInput` object contracts,并补齐 context / input transition reason shared type。
- 当前已完成 Step 6.2-2:domain `Gate` / `GovernanceDecision` object contracts,并补齐 gate / decision transition reason shared type。
- 当前已完成 Step 6.2-3:domain `ApprovalResponsibility` / `ApproverRequirement` / `ResponsibilityChain` object contracts。
- 当前已完成 Step 6.3-1:domain `PolicyEffectiveFact` / `SharedRuleSet` object contracts。
- 当前已完成 Step 6.3-2:domain `PolicyConflictRecord` object contract。
- 当前已完成 Step 6.3-3:domain `ControlApplicability` object contract。
- 当前已完成 Step 6.3-4:domain `ControlReview` object contract。
- 当前已完成 Step 6.3-5:domain `AIIAConclusion` object contract。
- 当前已完成 Step 6.3-6:domain `SoAConclusion` object contract。
- 当前已完成 Step 6.3-7:domain `NonconformityRecord` object contract。
- 当前已完成 Step 6.3-8:domain `CorrectiveAction` object contract。
- 当前已完成 Step 6.3-9:domain `VerificationResult` object contract。
- 当前已完成 Step 6.4-1:domain `DerivedGovernanceViewState` object contract。
- 当前已完成 Step 6.4-2:domain external snapshot / mirror object contracts。
- 当前已完成 Step 6.4-3:domain `GovernanceTraceRecord` / `GovernanceAuditTrail` object contracts。
- 当前已完成 Step 6.4-4:domain `GovernanceOutboxRecord` object contract。
- 当前已完成 Step 6.4-5a:domain `DecisionRecord` / `ResponsibilityTraceRecord` object contracts。
- 当前已完成 Step 6.4-5b:domain `PolicyChangeRecord` / `ControlChangeRecord` object contracts。
- 当前已完成 Step 6.4-5c:domain `ComplianceConclusionRecord` / `NonconformityChangeRecord` object contracts。
- 当前已完成 Step 6.4-6:`contracts` / `domain` `GovernanceHandoffMarker` behavior contract。
- 当前已完成 Step 6.5-1:domain policy / guard 通用契约、`GovernanceTruthPolicy`、`GovernanceContextPolicy` object contracts。
- 当前已完成 Step 6.5-2:domain `DecisionPolicy` / `ApprovalResponsibilityPolicy` object contracts。
- 当前已完成 Step 6.5-3:domain `PolicyConflictPolicy` / `SharedRulesPolicy` / `PolicyScopePolicy` object contracts。
- 当前已完成 Step 6.5-4:domain `ControlApplicabilityPolicy` / `ComplianceConclusionPolicy` object contracts。
- 当前已完成 Step 6.5-5:domain `NonconformityClosurePolicy` / `ReadVisibilityPolicy` object contracts。
- 当前已完成 Step 6.5-6:domain `DerivedGovernanceViewPolicy` object contract。Step 6 policy / guard object contracts 已收尾。
- 当前已完成 Step 6.6-1:`contracts` `GovernanceDashboardView` / `DecisionSummaryView` object contracts。
- 当前已完成 Step 6.6-2:`contracts` `PolicyEffectiveView` / `ControlCoverageView` object contracts。
- 当前已完成 Step 6.6-3:`contracts` `NonconformityStatusView` / `GovernanceReconciliationReport` object contracts。public view / report object contracts 已收尾。
- 当前已完成 Step 6.6-4:`application` service facade / operation context / idempotency / stored result / visibility decision helper object contracts。
- 当前已完成 Step 6.6-5:`application` job report assembly helper object contract。application helper object contracts 已收尾。
- 当前已完成 Step 6.7-1:`infra` runtime config / runtime builder / adapter availability object contracts。
- 当前已完成 Step 6.7-2:`infra` store / publisher / resolver / handoff adapter state object contracts。infra object contracts 已收尾。
- 当前已完成 Step 6.7-3:`api` command / query entry object contracts。api object contracts 已收尾。
- 当前已完成 Step 6.7-4:`worker` inbound consumer / outbox loop / projection loop entry object contracts。worker object contracts 已收尾。
- 当前已完成 Step 6.7-5:`jobs` operations job entry object contracts。infra / api / worker / jobs entry object contracts 已收尾。
- 当前已完成 Step 6.8-1:字段闭环表第一批,覆盖高复用字段来源审计。
- 当前已完成 Step 6.8-2:字段闭环表第二批,覆盖对象组字段来源审计。
- 当前已完成 Step 6.8-3:状态闭环表,覆盖 domain truth、read/projection、reference/outbox、application、infra、api、worker 和 jobs 状态族。
- 当前已完成 Step 6.8-4:回填草稿,给 Step 19 装配正式 `03-详细设计.md` 提供章节映射和摘录边界。
- 当前已完成 Step 6.8-5:待确认事项,区分 Step 6 已关闭事项与后续 Step 必须闭合事项。
- 当前已完成 Step 6.8-6:进入下一步条件。
- Step 6 已完成。下一步可以启动 Step 7 Trait / Port / Adapter 契约,但不得跳过 §20 门禁输入。

### 10. `contracts` shared type 契约

#### 10.1 shared type 写入纪律

`contracts::refs` 承载所有会穿过 public protocol surface 的轻量类型:typed id、typed ref、reason、kind、state、marker、cursor 和 helper set。`domain` 可以复用 `contracts` 类型,但 `contracts` 不得引用 `domain` 对象。凡 Command / Query / Event / Job / public view 需要引用的二级类型,不得留在 `domain` 私有模块。

| 判断问题 | 必须采用的口径 |
|---|---|
| 类型是否出现在 public DTO、event、job、view、trace 或 report 中 | 放入 `contracts::refs` 或 `core-contracts`,不得放入 `domain` |
| 类型是否只为 domain 内部算法服务 | 留在 `domain`,不得进入 public DTO |
| 类型是否保存相邻仓或外部系统正文 | 禁止;只能保存 typed ref、version、digest、safe summary ref 或 resolution state |
| reason / kind 是否已有稳定有限变体 | 有稳定变体时定义 enum;没有稳定变体时定义非空 newtype |
| state enum 是否已经在 HLD Step 9 出现 | 必须在 Step 6.1 后续批次定义 enum 和变体表 |
| 是否需要把 300 行写入限制用于删减内容 | 禁止;写不完则继续下一批 |

| 类型类别 | Rust 形态 | 归属 | 本 Step 必须闭合的内容 |
|---|---|---|---|
| opaque id | `pub struct XxxId(pub String);` | `contracts::refs` | 生成来源、非空约束、是否可由 repository load 重建 |
| ref object | `pub struct XxxRef { ... }` | `contracts::refs` | 字段、引用对象、禁止保存正文、构造来源 |
| reason | `pub struct XxxReason(pub String);` 或 enum | `contracts::refs` | 是否有限变体、正文含义、禁止空字符串 |
| kind | enum 或 newtype | `contracts::refs` | 分类来源、是否可扩展、是否影响状态机 |
| state enum | `pub enum XxxState { ... }` | `contracts::refs` | Rustdoc、业务含义、允许来源、允许去向 |
| helper set | `pub struct XxxRefSet(pub Vec<XxxRef>);` | `contracts::refs` | ordered unique 语义、去重依据、空集合是否允许 |

| 正例 | 反例 |
|---|---|
| `GovernanceDecisionRef { decision_id }` 只引用正式裁决 truth | `GovernanceDecisionRef { decision_body: String }` 把裁决正文塞进 ref |
| `GovernanceSourceRef` 保存 source kind、external ref、version、digest | `GovernanceSourceRef(String)` 用裸字符串暗含来源类型 |
| `PolicySuspendReason(pub String)` 在无正式变体表时先作为非空 reason | 实现侧自造 `enum PolicySuspendReason { Risk, Cost }` |
| `ReferenceResolutionState` 放在 contracts 供 query / job / snapshot 共用 | 把 `ReferenceResolutionState` 放在 domain 后又让 DTO 引用 |

#### 10.2 Step 6.1 shared type 分组计划

本节会跨多个批次写完。每个批次只限制单次写入行数,不限制主题最终长度。若某组对象卡片未达到字段、来源、禁止事项闭合,不得标记该主题完成。

| 分组 | 内容 | 当前状态 |
|---|---|---|
| `6.1-1` | shared type 写入纪律;context / input / gate / decision 基础 id/ref;external ref 基础 newtype | [x] 已完成 |
| `6.1-2` | approval responsibility、approver requirement、responsibility chain、vote / threshold / delegation shared type | [x] 已完成 |
| `6.1-3` | governed subject、governance source、evidence summary、actor / method / process / work / runtime snapshot ref | [x] 已完成 |
| `6.1-4` | policy effective fact、shared rule set、policy conflict、governance scope shared type | [x] 已完成 |
| `6.1-5` | control applicability、control review、AIIA / SoA conclusion、nonconformity、corrective action、verification shared type | [x] 已完成 |
| `6.1-6` | derived view、reconciliation report、trace、audit、outbox、history shared type | [x] 已完成 |
| `6.1-7a` | context / input / gate / decision / approval responsibility / responsibility chain / decision summary state enum | [x] 已完成 |
| `6.1-7b` | policy effective、shared rule set、policy conflict state enum | [x] 已完成 |
| `6.1-7c` | control applicability、control review、compliance conclusion、control coverage state enum | [x] 已完成 |
| `6.1-7d` | nonconformity、corrective action、verification state enum | [x] 已完成 |
| `6.1-7e` | derived view freshness、reference resolution、outbox publication state enum | [x] 已完成 |
| `6.1-7f` | reconciliation report state、kind / change kind、reference marker helper | [x] 已完成 |
| `6.1-7g` | reference resolution state、truth snapshot / change、reconciliation input helper | [x] 已完成 |
| `6.1-7h` | handoff / export marker and job report helper | [x] 已完成 |
| `6.1-7i` | public query / view helper and remaining report helper | [x] 已完成 |
| `6.1-7j` | shared type final audit and unresolved item table | [x] 已完成 |

#### 10.3 `6.1-1` context / input / gate / decision 基础 shared type

##### `ExternalSourceRef`

```rust
/// Points to a stable external object without owning the external body.
pub struct ExternalSourceRef(pub String);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `String` | 外部对象稳定引用的 opaque string | 来源于相邻仓正式 typed ref、event source ref 或 adapter mapping;不得为空;不得要求实现解析内部结构 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存正文 | 不保存 process、work、artifact、conversation、runtime、observability、archive、method-library 或 external GRC body |
| 不替代 typed ref | 详细设计后续可把它细化为 sibling typed ref;当前不能降级为任意 URL / note |
| 不表达版本 | 版本必须使用 `ExternalSourceVersionRef` |

##### `ExternalSourceVersionRef`

```rust
/// Points to the source-side version of an external object.
pub struct ExternalSourceVersionRef(pub String);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `String` | 外部来源版本引用 | 来源于 event envelope、resolver snapshot 或 source adapter;不得用本地更新时间伪造 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 只表达来源版本 | 不能用于 Governance truth version 或 optimistic lock version |
| 允许缺失 | 当来源系统没有版本时,上层 ref 使用 `Option<ExternalSourceVersionRef>` 并携带 degraded / unresolved surface |

##### `SourceDigest`

```rust
/// Carries a digest for summary identity or integrity checks.
pub struct SourceDigest(pub String);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `String` | 来源摘要或 safe summary 的校验值 | 来源于 resolver、consumer envelope 或 adapter summary;不得保存摘要正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不作为正文载体 | digest 只验证 summary identity 或 integrity |
| 不定义算法 | hash 算法和格式留给 Step 14 / adapter binding;本类型只承载 opaque digest |

##### context / input / gate / decision ids

```rust
/// Identifies a Governance context.
pub struct GovernanceContextId(pub String);

/// Identifies a Governance input.
pub struct GovernanceInputId(pub String);

/// Identifies a Governance gate.
pub struct GateId(pub String);

/// Identifies a formal Governance decision.
pub struct GovernanceDecisionId(pub String);
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `GovernanceContextId` | `GovernanceContext` 主键 | create context command 由 application id generator 提供;repository load 可重建 | 不得从 subject / source 拼接 |
| `GovernanceInputId` | `GovernanceInput` 主键 | submit input command 由 application id generator 提供;repository load 可重建 | 不得从 input kind 或 source 拼接 |
| `GateId` | `Gate` 主键 | open gate command 由 application id generator 提供;repository load 可重建 | 不等同 L1-process waiting gate id |
| `GovernanceDecisionId` | `GovernanceDecision` 主键 | record decision command 由 application id generator 提供;repository load 可重建 | 不等同 evidence、report、runtime cache 或 UI id |

| 通用不变量 / 禁止事项 | 说明 |
|---|---|
| 非空 | 所有 id newtype 的字符串值必须非空 |
| opaque | 业务逻辑不得解析 id 字符串结构 |
| 稳定 | id 一旦持久化不得因状态变化、projection rebuild 或 outbound publish 改变 |

##### context / input / gate / decision refs

```rust
/// References a Governance context.
pub struct GovernanceContextRef {
    /// Stable Governance context id.
    pub context_id: GovernanceContextId,
}

/// References a Governance input.
pub struct GovernanceInputRef {
    /// Stable Governance input id.
    pub input_id: GovernanceInputId,
}

/// References a Governance gate.
pub struct GateRef {
    /// Stable Governance gate id.
    pub gate_id: GateId,
}

/// References a formal Governance decision.
pub struct GovernanceDecisionRef {
    /// Stable Governance decision id.
    pub decision_id: GovernanceDecisionId,
}
```

| 类型 | 字段 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `GovernanceContextRef` | `context_id` | 在 command、query、event、trace 中引用 context truth | 只能由已生成或已持久化的 `GovernanceContextId` 构造 |
| `GovernanceInputRef` | `input_id` | 引用 input truth 或 input history subject | 只能由已生成或已持久化的 `GovernanceInputId` 构造 |
| `GateRef` | `gate_id` | 引用 Governance Gate truth | 不得指向 process waiting gate、conversation card 或 UI pending item |
| `GovernanceDecisionRef` | `decision_id` | 引用正式 Governance Decision truth | 不得指向 report、runtime cache、approval vote 或 evidence record |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 不拥有对象 | ref 只携带稳定 identity,不携带 truth body、projection body 或 external body |
| ref 可跨层传递 | public DTO、domain truth、event、view 和 trace 可共同使用这些 ref |
| ref 不表达可见性 | 可见性由 query visibility marker / policy 决定,不得通过空 ref 或伪造 ref 表达 |

##### `GovernanceDecisionOutcomeRef`

```rust
/// References the outcome payload or summary of a formal Governance decision.
pub struct GovernanceDecisionOutcomeRef(pub String);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `String` | 指向 decision outcome payload 或 outcome summary | 来源于 `RecordGovernanceDecision` 的正式 outcome intent 或 persisted decision summary;不得为空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存完整 outcome body | Step 8 必须定义正式 outcome DTO;本 ref 不承载正文 |
| 不替代 decision state | Approved / Rejected / Waived 仍由 `GovernanceDecisionState` 表达 |
| 不替代 evidence | 裁决依据使用 `EvidenceSummaryRef`,不得塞入 outcome ref |

##### context / input transition reasons

HLD 在 `GovernanceContext.invalidate(...)`、`GovernanceContext.close(...)` 和 `GovernanceInput.reject(...)` 的 domain 签名中已经使用以下 reason 类型。它们会穿过 command DTO、trace、history 或 query surface,因此归入 `contracts::refs`,不得留在 domain-only 模块。

```rust
/// Explains why a Governance context becomes invalid.
pub struct GovernanceContextInvalidReason(pub String);

/// Explains why a Governance context is closed.
pub struct GovernanceContextCloseReason(pub String);

/// Explains why a Governance input is rejected.
pub struct GovernanceInputRejectReason(pub String);

/// Explains why a Governance gate expires.
pub struct GateExpireReason(pub String);

/// Explains why a Governance gate is cancelled.
pub struct GateCancelReason(pub String);

/// Explains why a Governance decision is revoked.
pub struct GovernanceRevokeReason(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceContextInvalidReason` | 记录 context 从 `Draft` / `Ready` / `PendingReference` 进入 `Invalid` 的原因 | 来源于 command intent、policy guard 或 reference invalid surface;非空;不得保存外部正文 |
| `GovernanceContextCloseReason` | 记录 context 从 `Ready` / `PendingReference` 进入 `Closed` 的原因 | 来源于 explicit close command、subject lifecycle end 或 superseded governance scope;非空 |
| `GovernanceInputRejectReason` | 记录 input 从 `Received` 进入 `Rejected` 的原因 | 来源于 `UpdateGovernanceInputState` command 或 context policy;非空;不得保存 source body |
| `GateExpireReason` | 记录 gate 从 `Open` / `PendingDecision` 进入 `Expired` 的原因 | 来源于 timeout policy、source lifecycle 或 explicit operations surface;非空 |
| `GateCancelReason` | 记录 gate 从 `Open` / `PendingDecision` 进入 `Cancelled` 的原因 | 来源于 cancel command、superseded context 或 no-longer-applicable policy guard;非空 |
| `GovernanceRevokeReason` | 记录 finalized decision 被撤销的原因 | 来源于 revoke command、audit correction、invalid basis 或 superseding governance truth;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 不自造 enum | HLD 未给有限变体表,当前采用非空 newtype |
| reason 不替代错误模型 | command validation / policy denied / not visible 仍由 Step 12 error surface 定义 |
| reason 不保存正文 | 需要依据时引用 `EvidenceSummaryRef`、`GovernanceSourceRef` 或 trace ref |

#### 10.4 approval / responsibility shared type

##### approval / responsibility ids

```rust
/// Identifies an approval responsibility.
pub struct ApprovalResponsibilityId(pub String);

/// Identifies an approver requirement.
pub struct ApproverRequirementId(pub String);

/// Identifies a responsibility chain.
pub struct ResponsibilityChainId(pub String);
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `ApprovalResponsibilityId` | `ApprovalResponsibility` 主键 | assign / require responsibility flow 由 application id generator 提供;repository load 可重建 | 不得从 actor id、role id 或 context id 拼接 |
| `ApproverRequirementId` | `ApproverRequirement` 身份 | policy / shared rules evaluation 或 command intent 生成;repository load 可重建 | 不得用 role ref 直接替代 requirement identity |
| `ResponsibilityChainId` | `ResponsibilityChain` 主键 | start responsibility chain flow 由 application id generator 提供;repository load 可重建 | 不得从 context id 或 responsibility id 集合拼接 |

| 通用不变量 / 禁止事项 | 说明 |
|---|---|
| 非空 opaque id | 字符串必须非空,业务逻辑不得解析结构 |
| 不拥有 identity truth | id 只属于 Governance 责任事实,不代表 actor、member、role 或 capability 生命周期 |
| 不代表裁决结论 | responsibility / chain id 只能定位责任事实,不能表达 Decision approved / rejected |

##### approval / responsibility refs

```rust
/// References an approval responsibility.
pub struct ApprovalResponsibilityRef {
    /// Stable approval responsibility id.
    pub responsibility_id: ApprovalResponsibilityId,
}

/// References an approver requirement.
pub struct ApproverRequirementRef {
    /// Stable approver requirement id.
    pub requirement_id: ApproverRequirementId,
}

/// References a responsibility chain.
pub struct ResponsibilityChainRef {
    /// Stable responsibility chain id.
    pub chain_id: ResponsibilityChainId,
}

/// Carries an ordered set of approval responsibility refs.
pub struct ApprovalResponsibilityRefSet(pub Vec<ApprovalResponsibilityRef>);
```

| 类型 | 字段 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `ApprovalResponsibilityRef` | `responsibility_id` | Gate、责任链、query、event 和 trace 中引用责任 truth | 只能由已生成或已持久化 `ApprovalResponsibilityId` 构造 |
| `ApproverRequirementRef` | `requirement_id` | responsibility、policy result 和 command result 中引用审批要求 | requirement body 留在 domain `ApproverRequirement`;ref 不携带角色 / 能力集合正文 |
| `ResponsibilityChainRef` | `chain_id` | decision policy、query、event 和 trace 中引用责任链 | `Satisfied` 只表示可裁决,不得被 ref 本身表达 |
| `ApprovalResponsibilityRefSet` | `0` | 责任链中的责任引用集合 | ordered unique;去重依据为 `ApprovalResponsibilityId`;空集合只允许在 chain 初始化前的 builder / validation 场景 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 不承载 actor 能力正文 | actor、role、capability 摘要由 `ActorCapabilitySnapshot` / snapshot ref 承载 |
| ref 不表达投票结果 | 投票由 `GovernanceVote` 和 `ApprovalResponsibilityState::Voted` 表达 |
| ref set 不负责排序策略 | 排序规则由 domain `ResponsibilityChain` 或 Step 11 persistence ordering 定义 |

##### `GovernanceVote`

```rust
/// Captures an approval vote made within a Governance responsibility.
pub enum GovernanceVote {
    /// Approves the governed decision path.
    Approve,

    /// Rejects the governed decision path.
    Reject,

    /// Abstains without satisfying an approval threshold.
    Abstain,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Approve` | `Approves the governed decision path.` | 表达责任人赞成该治理路径 | `RecordApprovalVote` command | 可使 responsibility 进入 `Voted`;不得自动形成 Decision |
| `Reject` | `Rejects the governed decision path.` | 表达责任人反对该治理路径 | `RecordApprovalVote` command | 可使 responsibility 进入 `Voted`;不得自动形成 Decision |
| `Abstain` | `Abstains without satisfying an approval threshold.` | 表达弃权或无法作出赞成 / 反对 | `RecordApprovalVote` command | 可记录为责任 trace;不满足 approval threshold |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 投票不是裁决 | `GovernanceVote::Approve` 不等于 `GovernanceDecisionState::Approved` |
| 投票必须有 actor 语境 | 具体 actor_ref 由 command context / responsibility truth 承载,不塞入 vote enum |
| 投票不保存依据正文 | optional evidence 使用 `EvidenceSummaryRef` |

##### `ApprovalThreshold`

```rust
/// Defines how many approval votes are required for a responsibility chain.
pub enum ApprovalThreshold {
    /// Requires one approving responsibility.
    SingleApprover,

    /// Requires all assigned responsibilities to approve.
    Unanimous,

    /// Requires at least the given number of approvals.
    AtLeast(u32),
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `SingleApprover` | `Requires one approving responsibility.` | 一个有效 approval vote 即满足要求 | policy evaluation、command intent、shared rule default | domain `ApproverRequirement` 计算 responsibility chain |
| `Unanimous` | `Requires all assigned responsibilities to approve.` | 所有已分配责任均需通过 | policy evaluation、shared rules | domain `ApproverRequirement` 计算 responsibility chain |
| `AtLeast(u32)` | `Requires at least the given number of approvals.` | 至少 N 个 approval vote | policy evaluation、command intent | N 必须大于 0;不得超过责任集合规模而不产生 blocked surface |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 阈值不降低 shared rules | command intent 不能用更低阈值覆盖组织级 hard rule |
| 阈值只表达数量语义 | role / capability 要求由 `ApproverRequirement` 字段承载 |
| 阈值不是状态 | 是否已满足由 `ResponsibilityChainState` 表达 |

##### `DelegationRule`

```rust
/// Defines whether a Governance responsibility may be delegated.
pub enum DelegationRule {
    /// Delegation is not allowed.
    NotAllowed,

    /// Delegation is allowed only to actors matching the same requirement.
    SameRequirementOnly,

    /// Delegation is allowed to an explicitly provided actor.
    ExplicitDelegate(ActorRef),
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `NotAllowed` | `Delegation is not allowed.` | 责任不得委托 | shared rules、policy fact、command intent | `delegate_to` 必须拒绝 |
| `SameRequirementOnly` | `Delegation is allowed only to actors matching the same requirement.` | 只能委托给满足相同 requirement 的 actor | shared rules、policy fact | 通过 actor capability snapshot 校验 |
| `ExplicitDelegate(ActorRef)` | `Delegation is allowed to an explicitly provided actor.` | 只能委托给指定 actor | command intent 或 policy evaluation | 目标 actor 仍需经过 visibility / capability guard |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 委托不改变 identity truth | `ActorRef` 来自 `core-contracts`;本仓不改 actor / member lifecycle |
| 委托不得削弱审批要求 | delegate 仍需满足 requirement 或 explicit policy rule |
| 委托不形成裁决 | 委托只改变 responsibility state / trace,不改变 decision state |

##### approval / responsibility reasons

```rust
/// Explains why an approval responsibility is delegated.
pub struct DelegationReason(pub String);

/// Explains why an approval responsibility is released.
pub struct ResponsibilityReleaseReason(pub String);

/// Explains why a responsibility chain is escalated.
pub struct EscalationReason(pub String);

/// Explains why a responsibility chain is blocked.
pub struct ResponsibilityBlockReason(pub String);

/// Explains why a responsibility chain is closed.
pub struct ResponsibilityCloseReason(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `DelegationReason` | 记录委托原因 | 来源于 `DelegateApprovalResponsibility` command;非空;不得保存 conversation body |
| `ResponsibilityReleaseReason` | 记录责任释放原因 | 来源于 release command 或 policy guard failure;非空 |
| `EscalationReason` | 记录责任链升级原因 | 来源于 chain guard、timeout 或 explicit command;非空 |
| `ResponsibilityBlockReason` | 记录责任链阻塞原因 | 来源于 actor capability missing、threshold impossible、policy conflict 等 formal surface;非空 |
| `ResponsibilityCloseReason` | 记录责任链关闭原因 | 来源于 completed decision、cancelled gate、superseded context 或 explicit close flow;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 不自造 enum | HLD 尚未给出有限变体表,因此本批采用非空 newtype |
| reason 不保存证据正文 | 需要依据时使用 `EvidenceSummaryRef` |
| reason 不替代错误类型 | command validation / policy failure 的错误枚举留给 Step 12 |

#### 10.5 governed subject / source / evidence shared refs

##### `GovernedSubjectRef`

```rust
/// References the external object governed by a Governance context.
pub struct GovernedSubjectRef {
    /// Kind of governed subject.
    pub subject_kind: GovernedSubjectKind,
    /// Stable external subject reference.
    pub external_ref: ExternalSourceRef,
    /// Optional digest for the subject safe summary.
    pub subject_digest: Option<SourceDigest>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `subject_kind` | `GovernedSubjectKind` | 标识被治理对象类别 | 来源于 command intent、consumer envelope 或 resolver summary;variant 表后续在 kind 批次定义 |
| `external_ref` | `ExternalSourceRef` | 指向来源仓稳定对象 | 必填;不得为空;不得保存来源正文 |
| `subject_digest` | `Option<SourceDigest>` | 被治理对象 safe summary digest | 来自 resolver / source event;缺失时 query / command 必须可表达 degraded 或 pending reference |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_process_subject(&self) -> bool` | 判断是否为 process 相关对象 | 无 | `bool` | 纯判断;不能读取 process truth |
| `pub fn is_work_subject(&self) -> bool` | 判断是否为 work 相关对象 | 无 | `bool` | 纯判断;不能读取 work truth |
| `pub fn same_subject(&self, other: &GovernedSubjectRef) -> bool` | 判断是否同一被治理对象 | other subject ref | `bool` | 比较 kind + external ref;digest 不参与 identity |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_external(subject_kind: GovernedSubjectKind, external_ref: ExternalSourceRef) -> Result<Self, ContractError>` | 从外部 typed ref 形成被治理对象引用 | subject kind、external ref | `Result<GovernedSubjectRef, ContractError>` | `CreateGovernanceContext`、consumer snapshot |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不拥有外部 truth | 生命周期仍由 process、work、artifact、runtime、capability 或组织边界拥有 |
| 不保存正文 | 不保存 subject title、description、artifact body、runtime log、conversation text 或 external GRC body |
| digest 不作为身份 | digest 只校验摘要;同一 subject 的 digest 可随来源版本变化 |

##### `GovernanceSourceRef`

```rust
/// References an external source that triggered or supports Governance processing.
pub struct GovernanceSourceRef {
    /// Kind of Governance source.
    pub source_kind: GovernanceSourceKind,
    /// Stable external source reference.
    pub external_ref: ExternalSourceRef,
    /// Optional source-side version reference.
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    /// Optional digest for the source safe summary.
    pub source_digest: Option<SourceDigest>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_kind` | `GovernanceSourceKind` | 标识治理输入来源类别 | 来源于 command request、event envelope、resolver summary;variant 表后续在 kind 批次定义 |
| `external_ref` | `ExternalSourceRef` | 外部来源稳定引用 | 必填;不得保存来源正文 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 来源版本 | 来自 source event / resolver;不得用本地更新时间替代 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要校验 | 来自 safe summary;缺失时不得声称 summary verified |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_evidence_source(&self) -> bool` | 判断是否为 evidence / artifact 来源 | 无 | `bool` | 纯判断;不能读取 artifact truth |
| `pub fn is_runtime_signal(&self) -> bool` | 判断是否为 runtime / capability 信号 | 无 | `bool` | 纯判断;不能读取 runtime log |
| `pub fn same_source(&self, other: &GovernanceSourceRef) -> bool` | 判断是否同源 | other source ref | `bool` | 比较 source kind + external ref;version / digest 不参与 identity |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_external(source_kind: GovernanceSourceKind, external_ref: ExternalSourceRef) -> Result<Self, ContractError>` | 从外部来源形成治理来源引用 | source kind、external ref | `Result<GovernanceSourceRef, ContractError>` | `SubmitGovernanceInput`、consumer pending input marker |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source 不是 Governance truth | 来源引用必须经 `GovernanceInput` 收束后才可能触发正式治理流程 |
| 不保存来源正文 | 不保存 message、artifact、evidence、runtime log、audit note、GRC record 或 conversation body |
| 版本和 digest 不可伪造 | 缺失时使用 `None` 和 pending / degraded surface,不得用本地值补造 |

##### `EvidenceSummaryRef`

```rust
/// References a verified or pending external evidence summary.
pub struct EvidenceSummaryRef {
    /// Kind of external evidence summary.
    pub evidence_kind: EvidenceKind,
    /// Stable external evidence reference.
    pub external_ref: ExternalSourceRef,
    /// Verification state of the evidence summary.
    pub verified_state: EvidenceVerifiedState,
    /// Optional digest for the evidence summary.
    pub summary_digest: Option<SourceDigest>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `evidence_kind` | `EvidenceKind` | 依据类别 | 来源于 artifact / evidence resolver 或 command intent;variant 表后续在 kind 批次定义 |
| `external_ref` | `ExternalSourceRef` | 外部依据引用 | 必填;不得保存 evidence / artifact body |
| `verified_state` | `EvidenceVerifiedState` | 依据摘要是否已验证 | 来源于 resolver / consumer;state enum 后续在 state 批次定义 |
| `summary_digest` | `Option<SourceDigest>` | 摘要校验 | verified path 必须有 digest;pending / unavailable path 可为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_acceptable_for_decision(&self) -> bool` | 判断是否可作为 Governance decision basis | 无 | `bool` | 只读判断;要求 verified state 满足正式依据口径 |
| `pub fn is_acceptable_for_compliance(&self) -> bool` | 判断是否可作为 control / AIIA / SoA 依据 | 无 | `bool` | 只读判断;不读取 artifact body |
| `pub fn is_verified(&self) -> bool` | 判断摘要是否已验证 | 无 | `bool` | 只读判断 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_verified(evidence_kind: EvidenceKind, external_ref: ExternalSourceRef, summary_digest: SourceDigest) -> Result<Self, ContractError>` | 从已验证依据形成引用 | evidence kind、external ref、digest | `Result<EvidenceSummaryRef, ContractError>` | decision approval、control review、corrective verification |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body | 只保存引用、验证状态和 digest |
| 不替代 artifact truth | evidence 生命周期、artifact body、baseline package 仍归 artifact / archive 边界 |
| verified 必须可追溯 | `Verified` 语义必须能回到 resolver / source event / artifact summary,不得由 command 随意设置 |

#### 10.6 external snapshot / context shared refs

本小节固定 external mirror support 在 `contracts` 层可被 command / query / event / job / view 共同引用的 body-free shape。完整 domain 行为后续可在 `domain::reference_snapshot` 中包装这些 shared value object,但 public DTO 不得引用 domain-only snapshot。

##### external mirror primitive refs

```rust
/// Carries a local opaque reference to an external capability.
pub struct CapabilityRef(pub ExternalSourceRef);

/// Carries an ordered set of external capability refs.
pub struct CapabilityRefSet(pub Vec<CapabilityRef>);

/// Carries an ordered set of actor role refs from core or identity boundary.
pub struct RoleRefSet(pub Vec<RoleRef>);

/// References a method-library policy definition without owning its body.
pub struct MethodPolicyRef(pub ExternalSourceRef);

/// References a source-side method policy version.
pub struct MethodPolicyVersionRef(pub ExternalSourceVersionRef);

/// References a method-library control definition without owning its body.
pub struct MethodControlRef(pub ExternalSourceRef);

/// References a source-side method control version.
pub struct MethodControlVersionRef(pub ExternalSourceVersionRef);

/// References a safe summary stored or owned outside Governance.
pub struct SafeSummaryRef(pub ExternalSourceRef);

/// References a process instance in the process boundary.
pub struct ProcessInstanceRef(pub ExternalSourceRef);

/// References an activity in the process boundary.
pub struct ActivityRef(pub ExternalSourceRef);

/// References a waiting gate in the process boundary.
pub struct WaitingGateRef(pub ExternalSourceRef);

/// References a project in the work boundary.
pub struct ProjectRef(pub ExternalSourceRef);

/// References formal work in the work boundary.
pub struct FormalWorkRef(pub ExternalSourceRef);

/// References an iteration in the work boundary.
pub struct IterationRef(pub ExternalSourceRef);

/// Captures the source-side time at which a runtime signal was observed.
pub struct RuntimeSignalCapturedAt(pub Timestamp);
```

| 类型 | 作用 | 来源 / 约束 |
|---|---|---|
| `CapabilityRef` / `CapabilityRefSet` | 表达能力引用和集合 | 来源于 capability-hub / runtime / identity 摘要;ordered unique;不得保存 capability definition body |
| `RoleRefSet` | 表达 actor 当前角色引用集合 | `RoleRef` 来自 `core-contracts` 或 identity event boundary;ordered unique;不得解释为平台授权 |
| `MethodPolicyRef` / `MethodPolicyVersionRef` | 指向 method-library Policy 定义和版本 | 来源于 method event / resolver;不引入 method-library crate |
| `MethodControlRef` / `MethodControlVersionRef` | 指向 control definition 和版本 | 来源于 method event / resolver;不保存 standard / control body |
| `SafeSummaryRef` | 指向外部 safe summary | 只指向摘要位置或摘要 identity;正文归来源仓或 archive |
| `ProcessInstanceRef` / `ActivityRef` / `WaitingGateRef` | 指向 process 语境 | 来源于 process event / resolver;不保存 process truth |
| `ProjectRef` / `FormalWorkRef` / `IterationRef` | 指向 work 语境 | 来源于 work event / resolver;不保存 project / work truth |
| `RuntimeSignalCapturedAt` | 表达 runtime signal 来源侧捕获时间 | 值由 source event / resolver 提供;不得用本地 refresh 时间替代 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不形成 sibling compile dependency | 除 `core-contracts` 外,上述 ref 均是本仓 contracts 的 opaque mirror |
| 不保存外部正文 | 不保存 identity、method、process、work、runtime 或 capability body |
| 不解释外部生命周期 | resolved / stale / invalid 由 `ReferenceResolutionState` 表达 |

##### `ActorCapabilitySnapshot`

```rust
/// Carries a body-free actor capability summary for Governance responsibility checks.
pub struct ActorCapabilitySnapshot {
    /// Actor represented by this snapshot.
    pub actor_ref: ActorRef,
    /// Role refs visible to Governance.
    pub role_refs: RoleRefSet,
    /// Capability refs visible to Governance.
    pub capability_refs: CapabilityRefSet,
    /// Local resolution state for the snapshot source.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `actor_ref` | `ActorRef` | 被摘要的 actor | 来源于 identity / capability event 或 resolver;不保存 actor profile |
| `role_refs` | `RoleRefSet` | 当前可见角色集合 | ordered unique;只能用于 governance responsibility 判断 |
| `capability_refs` | `CapabilityRefSet` | 当前可承担能力集合 | ordered unique;不保存 capability definition |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 | 来源于 consumer / refresh job;state 变体后续在 state 批次闭合 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn has_role(&self, role_ref: RoleRef) -> bool` | 判断摘要是否含某角色 | role_ref 来自 core / identity ref | `bool` | 纯判断;不做平台授权 |
| `pub fn supports_capabilities(&self, required: &CapabilityRefSet) -> bool` | 判断是否覆盖能力集合 | required 为审批要求中的能力 refs | `bool` | 纯判断;不读取 capability truth |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记快照过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `snapshot_state.mark_stale(reason, checked_at)`;不修改 identity truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_identity(actor_ref: ActorRef, role_refs: RoleRefSet, capability_refs: CapabilityRefSet, snapshot_state: ReferenceResolutionState) -> Result<Self, ContractError>` | 从 identity / capability 摘要形成快照 | actor、role set、capability set、resolution state | `Result<ActorCapabilitySnapshot, ContractError>` | identity consumer、external snapshot refresh;`snapshot_state.reference_ref` 必须指向 identity / capability source |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不成为 identity truth | 不保存成员生命周期、认证凭据、profile body 或平台授权规则 |
| 不直接接收 `ApproverRequirement` | contracts 不依赖 domain;`ApproverRequirement::matches(snapshot)` 在 domain 批次闭合 |

##### `MethodPolicySnapshot`

```rust
/// Carries a body-free method policy definition snapshot for Governance policy facts.
pub struct MethodPolicySnapshot {
    /// Method-library policy definition ref.
    pub policy_ref: MethodPolicyRef,
    /// Source-side policy definition version.
    pub policy_version_ref: MethodPolicyVersionRef,
    /// Governance scope marker declared by the body-free policy summary.
    pub scope_ref: GovernanceScopeRef,
    /// Safe summary ref for the policy definition.
    pub summary_ref: SafeSummaryRef,
    /// Local resolution state for the snapshot source.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `policy_ref` | `MethodPolicyRef` | method-library Policy 定义引用 | 来源于 method event / resolver;不得保存 AIPolicyDef body |
| `policy_version_ref` | `MethodPolicyVersionRef` | 来源版本 | 必填;不得用本地更新版本替代 |
| `scope_ref` | `GovernanceScopeRef` | body-free policy summary 声明的适用治理范围 | 来源于 method event / resolver safe summary 的 scope marker;不得解析 AIPolicyDef body 或外部 scope 字符串 |
| `summary_ref` | `SafeSummaryRef` | safe summary 引用 | 必填;summary body 不进入 Governance contracts |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析状态 | consumer / refresh job 写入;query 必须可见 stale / unavailable |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_scope(&self, scope_ref: GovernanceScopeRef) -> bool` | 判断摘要是否可用于 scope | scope_ref 为治理范围 ref | `bool` | 只比较 `self.scope_ref.same_scope(&scope_ref)`;不读取 policy body、不解析 summary body、不做 scope 继承判断 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记快照过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `snapshot_state.mark_stale(reason, checked_at)`;不修改 `PolicyEffectiveFact` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_method_library(policy_ref: MethodPolicyRef, policy_version_ref: MethodPolicyVersionRef, scope_ref: GovernanceScopeRef, summary_ref: SafeSummaryRef, snapshot_state: ReferenceResolutionState) -> Result<Self, ContractError>` | 从 method-library 摘要形成快照 | ref、version、scope marker、safe summary、resolution state | `Result<MethodPolicySnapshot, ContractError>` | method consumer、policy activation precheck;`snapshot_state.source_version_ref` 必须与 `policy_version_ref` 对齐;`scope_ref` 必须来自 body-free safe summary / resolver |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 AIPolicyDef 正文 | 只保存 ref、version、scope ref、safe summary ref 和 resolution state |
| 不形成 Policy truth | 生效事实由 `PolicyEffectiveFact` 在 domain 批次定义 |
| scope 只做同一性判断 | `matches_scope(...)` 只判断快照 scope 与请求 scope 是否同一;跨 scope 继承、覆盖和可比较关系必须交给 `PolicyScopePolicy` / Step 7 读取面 |

##### `MethodControlSnapshot`

```rust
/// Carries a body-free method control definition snapshot for compliance checks.
pub struct MethodControlSnapshot {
    /// Method-library control definition ref.
    pub control_ref: MethodControlRef,
    /// Source-side control definition version.
    pub control_version_ref: MethodControlVersionRef,
    /// Safe summary ref for the control definition.
    pub summary_ref: SafeSummaryRef,
    /// Local resolution state for the snapshot source.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `control_ref` | `MethodControlRef` | 控制定义引用 | 来源于 method event / resolver;不得保存标准或控制正文 |
| `control_version_ref` | `MethodControlVersionRef` | 来源版本 | 必填;用于判断 stale / refresh |
| `summary_ref` | `SafeSummaryRef` | 控制 safe summary 引用 | 必填;summary body 不进入 contracts |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析状态 | consumer / refresh job 写入 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_subject(&self, subject_ref: &GovernedSubjectRef) -> bool` | 判断控制摘要是否可能适用于 subject | subject ref 为被治理对象 | `bool` | 粗粒度判断;完整 context policy 在 domain 批次闭合 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记快照过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `snapshot_state.mark_stale(reason, checked_at)`;不修改 control applicability truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_method_library(control_ref: MethodControlRef, control_version_ref: MethodControlVersionRef, summary_ref: SafeSummaryRef, snapshot_state: ReferenceResolutionState) -> Result<Self, ContractError>` | 从 method-library 摘要形成快照 | ref、version、safe summary、resolution state | `Result<MethodControlSnapshot, ContractError>` | method control consumer、control assessment precheck;`snapshot_state.source_version_ref` 必须与 `control_version_ref` 对齐 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 ControlDefinition 正文 | 只保存 ref、version、summary ref 和 resolution state |
| 不替代 ControlApplicability | 适用 / 排除结论由 Governance truth 表达 |

##### `ProcessGovernanceContextRef`

```rust
/// References process-side context that may require Governance handling.
pub struct ProcessGovernanceContextRef {
    /// Process instance ref.
    pub process_ref: ProcessInstanceRef,
    /// Optional process activity ref.
    pub activity_ref: Option<ActivityRef>,
    /// Optional process waiting gate ref.
    pub waiting_gate_ref: Option<WaitingGateRef>,
    /// Local resolution state for the process context.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `process_ref` | `ProcessInstanceRef` | 过程实例引用 | 必填;来源于 process event / resolver |
| `activity_ref` | `Option<ActivityRef>` | 关联活动 | 仅 activity / waiting / recovery 语境存在时填写 |
| `waiting_gate_ref` | `Option<WaitingGateRef>` | process waiting gate 引用 | 只有 process 侧正式 waiting gate 需要 governance decision 时填写 |
| `snapshot_state` | `ReferenceResolutionState` | process 语境解析状态 | 不可用或过期时 query / consumer 必须可见 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_decision(&self) -> bool` | 判断是否显式关联 waiting gate | 无 | `bool` | 基于 `waiting_gate_ref.is_some()`;不读取 process truth |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记 process 语境过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `snapshot_state.mark_stale(reason, checked_at)`;不修改 process truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_process(process_ref: ProcessInstanceRef, activity_ref: Option<ActivityRef>, waiting_gate_ref: Option<WaitingGateRef>, snapshot_state: ReferenceResolutionState) -> Result<Self, ContractError>` | 从 process 引用形成治理上下文引用 | process、optional activity、optional waiting gate、resolution state | `Result<ProcessGovernanceContextRef, ContractError>` | process consumer、context creation helper |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不拥有 process truth | 不保存 ProcessInstance、Activity、checkpoint、recovery 或 waiting body |
| 不替代 waiting gate | waiting gate 的生命周期和 resume 语义仍归 L1-process |

##### `WorkGovernanceContextRef`

```rust
/// References work-side context that may require Governance handling.
pub struct WorkGovernanceContextRef {
    /// Project ref.
    pub project_ref: ProjectRef,
    /// Optional formal work ref.
    pub work_ref: Option<FormalWorkRef>,
    /// Optional iteration ref.
    pub iteration_ref: Option<IterationRef>,
    /// Local resolution state for the work context.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `project_ref` | `ProjectRef` | 项目引用 | 必填;来源于 work event / resolver |
| `work_ref` | `Option<FormalWorkRef>` | 正式工作引用 | 工作级治理语境存在时填写 |
| `iteration_ref` | `Option<IterationRef>` | 迭代引用 | 迭代 / 承诺范围治理语境存在时填写 |
| `snapshot_state` | `ReferenceResolutionState` | work 语境解析状态 | stale / unavailable 必须可被 query / job 报告 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_policy_check(&self) -> bool` | 判断是否需要 policy / shared rules 判断 | 无 | `bool` | project/work/iteration ref 只作为线索;不读取 work truth |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记 work 语境过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `snapshot_state.mark_stale(reason, checked_at)`;不修改 project / work truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_work(project_ref: ProjectRef, work_ref: Option<FormalWorkRef>, iteration_ref: Option<IterationRef>, snapshot_state: ReferenceResolutionState) -> Result<Self, ContractError>` | 从 work 引用形成治理上下文引用 | project、optional formal work、optional iteration、resolution state | `Result<WorkGovernanceContextRef, ContractError>` | work consumer、nonconformity / corrective context |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不拥有 Work truth | 不保存 Project、WorkItem、Iteration、Dependency 或 Blocker body |
| blocker 不是 nonconformity | blocker 只能成为 source/context;正式不符合由 `NonconformityRecord` 表达 |

##### `RuntimeSignalRef`

```rust
/// References a runtime or capability signal without owning execution logs.
pub struct RuntimeSignalRef {
    /// Kind of runtime signal.
    pub signal_kind: RuntimeSignalKind,
    /// Stable external runtime signal ref.
    pub external_ref: ExternalSourceRef,
    /// Local resolution state for the signal source.
    pub signal_state: ReferenceResolutionState,
    /// Source-side captured time.
    pub captured_at: RuntimeSignalCapturedAt,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `signal_kind` | `RuntimeSignalKind` | 信号类别 | 来源于 runtime / capability event;variant 后续在 kind 批次闭合 |
| `external_ref` | `ExternalSourceRef` | 外部信号引用 | 必填;不得保存 execution log |
| `signal_state` | `ReferenceResolutionState` | 信号解析状态 | consumer / refresh job 写入 |
| `captured_at` | `RuntimeSignalCapturedAt` | 来源侧捕获时间 | 来自 source event / resolver;不得用本地消费时间替代 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_governance_input(&self) -> bool` | 判断信号是否应进入 GovernanceInput | 无 | `bool` | 基于 formal `RuntimeSignalKind`;不读取 runtime logs |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记信号过期 | reason、检查时间 | `Result<(), ContractError>` | 调用 `signal_state.mark_stale(reason, checked_at)`;不修改 Policy truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_runtime(signal_kind: RuntimeSignalKind, external_ref: ExternalSourceRef, signal_state: ReferenceResolutionState, captured_at: RuntimeSignalCapturedAt) -> Result<Self, ContractError>` | 从 runtime / capability 信号形成引用 | kind、external ref、resolution state、captured time | `Result<RuntimeSignalRef, ContractError>` | runtime consumer、pending governance input marker |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 runtime log | 只保存引用、状态和捕获时间 |
| 不反向定义 Policy truth | runtime feedback 只能作为治理输入或 stale / nonconformity 线索 |

#### 10.7 policy / shared rules / conflict shared refs

本节只固定 `contracts::refs` 中会被 command / query / event / job / view 共用的 policy、shared rules、conflict、scope 和 reason 类型。`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord` 的 truth 字段和 transition method 留到 domain 对象批次;`PolicyEffectiveState`、`SharedRuleSetState`、`PolicyConflictState` 留到 state enum 批次。

##### policy / shared rules / conflict ids

```rust
/// Identifies a Governance-owned effective policy fact.
pub struct PolicyEffectiveFactId(pub String);

/// Identifies a Governance-owned shared rule set.
pub struct SharedRuleSetId(pub String);

/// Identifies a shared rule entry inside a Governance shared rule set.
pub struct SharedRuleId(pub String);

/// Identifies a Governance policy conflict record.
pub struct PolicyConflictId(pub String);
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `PolicyEffectiveFactId` | `PolicyEffectiveFact` 主键 | activate / propose policy flow 由 application id generator 提供;repository load 可重建 | 不得从 method policy ref、scope 或 version 拼接 |
| `SharedRuleSetId` | `SharedRuleSet` 主键 | draft / update shared rules flow 由 application id generator 提供;repository load 可重建 | 不得从 organization / scope ref 直接替代 |
| `SharedRuleId` | shared rule entry 身份 | update shared rules flow 由 application id generator 或正式 rule change intent 提供 | 不得保存 rule body 或 standard body |
| `PolicyConflictId` | `PolicyConflictRecord` 主键 | conflict detection flow 由 application id generator 提供;repository load 可重建 | 不得从 conflicting policy ids 排序拼接 |

| 通用不变量 / 禁止事项 | 说明 |
|---|---|
| 非空 opaque id | 字符串必须非空,业务逻辑不得解析内部结构 |
| 不代表外部定义 | method-library AIPolicyDef / ControlDefinition identity 使用对应 external ref |
| 不表达当前状态 | state 由 `PolicyEffectiveState`、`SharedRuleSetState`、`PolicyConflictState` 表达 |

##### policy / shared rules / conflict refs

```rust
/// References a Governance-owned effective policy fact.
pub struct PolicyEffectiveFactRef {
    /// Stable policy fact id.
    pub policy_fact_id: PolicyEffectiveFactId,
}

/// Carries an ordered set of effective policy fact refs.
pub struct PolicyEffectiveFactRefSet(pub Vec<PolicyEffectiveFactRef>);

/// References a Governance-owned shared rule set.
pub struct SharedRuleSetRef {
    /// Stable shared rule set id.
    pub rule_set_id: SharedRuleSetId,
}

/// References a shared rule entry without owning the rule body.
pub struct SharedRuleRef {
    /// Stable shared rule id.
    pub rule_id: SharedRuleId,
}

/// Carries an ordered set of shared rule refs.
pub struct SharedRuleRefSet(pub Vec<SharedRuleRef>);

/// References a Governance policy conflict record.
pub struct PolicyConflictRef {
    /// Stable policy conflict id.
    pub conflict_id: PolicyConflictId,
}

/// Carries an ordered set of policy conflict refs.
pub struct PolicyConflictRefSet(pub Vec<PolicyConflictRef>);
```

| 类型 | 字段 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `PolicyEffectiveFactRef` | `policy_fact_id` | command result、event、view、trace 中引用生效 Policy truth | 只能由已生成或已持久化 `PolicyEffectiveFactId` 构造 |
| `PolicyEffectiveFactRefSet` | `0` | conflict detection、policy view、guard input 中承载 policy 集合 | ordered unique;去重依据为 `PolicyEffectiveFactId`;空集合只允许在 no-policy view / precheck |
| `SharedRuleSetRef` | `rule_set_id` | policy guard、event、view 中引用 shared rules truth | 不携带 rule body 或 organization config body |
| `SharedRuleRef` | `rule_id` | 引用 shared rule entry | 不携带标准正文、policy definition body 或 override 表达式 |
| `SharedRuleRefSet` | `0` | shared rules 集合内 rule entry refs | ordered unique;去重依据为 `SharedRuleId` |
| `PolicyConflictRef` | `conflict_id` | command result、query、event、history 中引用 conflict record | 不替代冲突状态或处理依据 |
| `PolicyConflictRefSet` | `0` | policy effective view 和 reconciliation report 中引用冲突集合 | ordered unique;空集合表示当前视图无已知冲突 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn contains_policy(&self, policy_ref: &PolicyEffectiveFactRef) -> bool` | 判断 policy set 是否包含指定 policy | policy_ref 为待查 ref | `bool` | 纯判断;不读取 policy truth |
| `pub fn contains_rule(&self, rule_ref: &SharedRuleRef) -> bool` | 判断 rule set 是否包含指定 rule | rule_ref 为待查 ref | `bool` | 纯判断;不读取 rule body |
| `pub fn contains_conflict(&self, conflict_ref: &PolicyConflictRef) -> bool` | 判断 conflict set 是否包含指定冲突 | conflict_ref 为待查 ref | `bool` | 纯判断;不读取 conflict record |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 不保存定义正文 | AIPolicyDef、standard、control、rule expression 或 runtime cache body 不进入 ref |
| ref set 不负责冲突判断 | 冲突检测由 domain `PolicyConflictPolicy` 完成 |
| shared rule ref 不允许低 scope override | 是否可覆盖由 domain `SharedRulesPolicy` / `PolicyScopePolicy` 判断 |

##### `GovernanceScopeRef`

```rust
/// References the scope in which Governance facts apply.
pub struct GovernanceScopeRef {
    /// Stable external or Governance scope reference.
    pub scope_ref: ExternalSourceRef,
    /// Optional digest for the scope safe summary.
    pub scope_digest: Option<SourceDigest>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope_ref` | `ExternalSourceRef` | 生效范围引用 | 来源于 command intent、context subject、resolver summary 或 upstream scope event;不得为空 |
| `scope_digest` | `Option<SourceDigest>` | scope safe summary digest | resolver / event 提供;缺失时不得声称 scope summary verified |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn same_scope(&self, other: &GovernanceScopeRef) -> bool` | 判断是否同一治理范围 | other scope ref | `bool` | 比较 `scope_ref`;digest 不参与 identity |
| `pub fn has_verified_summary(&self) -> bool` | 判断是否带摘要校验 | 无 | `bool` | 纯判断;不解析外部 scope body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_external(scope_ref: ExternalSourceRef) -> Result<Self, ContractError>` | 从外部 scope ref 形成治理范围引用 | external scope ref | `Result<GovernanceScopeRef, ContractError>` | activate policy、draft shared rules、dashboard query |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不自造 scope kind | HLD 尚未给出稳定 kind 变体,本批不定义 `GovernanceScopeKind` |
| 不表达继承关系 | parent / child / inheritance allowed 留给 `PolicyScopePolicy` 和 Step 7 repository / resolver |
| 不保存 scope 正文 | 不保存 organization、project、work、runtime、external GRC 或 method body |

##### `PolicyPriority`

```rust
/// Defines policy precedence within a comparable Governance scope.
pub struct PolicyPriority(pub u32);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `u32` | 冲突和覆盖判断优先级 | 来源于 policy activation intent、method summary 或 shared rule default;数值越大优先级越高;同级冲突必须进入 conflict record |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn outranks(&self, other: PolicyPriority) -> bool` | 判断是否高于另一优先级 | other priority | `bool` | 只做数值比较;shared rules 可阻断 override |
| `pub fn same_priority(&self, other: PolicyPriority) -> bool` | 判断是否同级 | other priority | `bool` | 同级不自动解决冲突 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| priority 不绕过 shared rules | 高 priority 仍不得削弱 active shared rules |
| priority 不跨不可比较 scope | 跨 scope 优先级比较必须先由 `PolicyScopePolicy` 判定 |

##### `GovernanceEffectiveAt`

```rust
/// Carries the effective time used by Governance policy and scope guards.
pub struct GovernanceEffectiveAt(pub Timestamp);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `Timestamp` | policy / shared rules 生效判断时间 | 来源于 command metadata、clock port 或 source summary;不得由 query 临时生成 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 state | 当前是否 Effective / Active 仍由状态 enum 表达 |
| 不表达版本 | 来源版本使用 `ExternalSourceVersionRef` 或 method snapshot version |

##### policy / shared rules / conflict reasons

```rust
/// Explains why an effective policy fact is suspended.
pub struct PolicySuspendReason(pub String);

/// Explains why an effective policy fact is retired.
pub struct PolicyRetireReason(pub String);

/// Explains why a shared rule or shared rule set changes.
pub struct SharedRuleReason(pub String);

/// Explains why a Governance decision or policy conflict is waived.
pub struct GovernanceWaiveReason(pub String);

/// Explains why a detected policy conflict is invalidated.
pub struct PolicyConflictInvalidReason(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `PolicySuspendReason` | 记录 Policy 暂停原因 | 来源于 `UpdatePolicyEffectiveFactState`;非空;不得保存 AIPolicyDef body |
| `PolicyRetireReason` | 记录 Policy 退役原因 | 来源于 retire command、superseded method definition 或 governance decision;非空 |
| `SharedRuleReason` | 记录 shared rule 增删、弃用或退役原因 | 来源于 `UpdateSharedRuleSet`;非空;不得保存标准正文 |
| `GovernanceWaiveReason` | 记录 decision / conflict 豁免原因 | 来源于正式 command intent 或 decision basis;非空;需要依据时使用 `EvidenceSummaryRef` / `GovernanceDecisionRef` |
| `PolicyConflictInvalidReason` | 记录冲突不成立原因 | 来源于 conflict re-evaluation、policy retired / superseded 或 scope mismatch;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 不自造 enum | HLD 尚未给出有限变体表,本批采用非空 newtype |
| reason 不保存正文 | 不保存 method policy、standard、conversation、runtime 或 GRC body |
| reason 不替代状态迁移 | 是否 Suspended / Retired / Waived / Invalid 由正式 state transition 表达 |

#### 10.8 control / compliance / nonconformity shared refs

本节固定 control applicability、control review、AIIA / SoA conclusion、nonconformity、corrective action 和 verification 在 public protocol surface 中使用的 typed id / ref / reason。状态 enum 仍按 Step 9 状态矩阵在后续 state 批次统一写 Rustdoc 和迁移表。

##### compliance boundary refs

```rust
/// References an artifact-owned evidence or assessment body without owning it.
pub struct ArtifactRef(pub ExternalSourceRef);

/// References a derived control coverage summary without owning the summary body.
pub struct ControlCoverageRef(pub ExternalSourceRef);

/// References a confirmed nonconformity cause without owning its body.
pub struct NonconformityCauseRef(pub ExternalSourceRef);
```

| 类型 | 作用 | 来源 / 约束 |
|---|---|---|
| `ArtifactRef` | 指向 AIIA / SoA / evidence / baseline 正文来源 | 来源于 artifact event、resolver 或 command intent;不得保存 artifact body |
| `ControlCoverageRef` | 指向控制覆盖摘要 | 来源于 control coverage projection / artifact summary;不得由 report 反写 control truth |
| `NonconformityCauseRef` | 指向已确认原因摘要或外部原因依据 | 来源于 command intent、evidence summary 或 analysis result ref;不得保存原因正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不形成 artifact compile dependency | 通过 opaque ref / resolver / event 协作 |
| 不保存正文 | AIIA、SoA、baseline、evidence、coverage report、cause analysis body 均不进入本仓 contracts |

##### control / compliance ids

```rust
/// Identifies a control applicability fact.
pub struct ControlApplicabilityId(pub String);

/// Identifies a control review.
pub struct ControlReviewId(pub String);

/// Identifies an AIIA Governance conclusion.
pub struct AIIAConclusionId(pub String);

/// Identifies a SoA Governance conclusion.
pub struct SoAConclusionId(pub String);
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `ControlApplicabilityId` | `ControlApplicability` 主键 | assess control flow 由 application id generator 提供;repository load 可重建 | 不得从 control ref + context ref 拼接 |
| `ControlReviewId` | `ControlReview` 主键 | plan / record review flow 由 application id generator 提供;repository load 可重建 | 不得从 reviewer 或 evidence ref 拼接 |
| `AIIAConclusionId` | `AIIAConclusion` 主键 | submit AIIA conclusion flow 由 application id generator 提供;repository load 可重建 | 不等同 artifact id |
| `SoAConclusionId` | `SoAConclusion` 主键 | submit SoA conclusion flow 由 application id generator 提供;repository load 可重建 | 不等同 control coverage id |

##### control / compliance refs

```rust
/// References a control applicability fact.
pub struct ControlApplicabilityRef {
    /// Stable control applicability id.
    pub applicability_id: ControlApplicabilityId,
}

/// References a control review.
pub struct ControlReviewRef {
    /// Stable control review id.
    pub review_id: ControlReviewId,
}

/// References an AIIA Governance conclusion.
pub struct AIIAConclusionRef {
    /// Stable AIIA conclusion id.
    pub aiia_conclusion_id: AIIAConclusionId,
}

/// References a SoA Governance conclusion.
pub struct SoAConclusionRef {
    /// Stable SoA conclusion id.
    pub soa_conclusion_id: SoAConclusionId,
}

/// References either supported compliance conclusion kind.
pub enum ComplianceConclusionRef {
    /// References an AI impact assessment conclusion.
    AIIA(AIIAConclusionRef),

    /// References a Statement of Applicability conclusion.
    SoA(SoAConclusionRef),
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ControlApplicabilityRef` | command result、view、trace、review 中引用 control applicability truth | 只由已持久化 applicability id 构造 |
| `ControlReviewRef` | command result、view、trace 中引用 review truth | 不携带 evidence body 或 reviewer profile |
| `AIIAConclusionRef` / `SoAConclusionRef` | 引用对应 compliance conclusion truth | 不携带 artifact body、review body 或 approval decision body |
| `ComplianceConclusionRef` | 为 approve / query / event 提供可区分的 union ref | 仅允许 `AIIA` 和 `SoA`;新增 conclusion kind 必须先回设计补 variant |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| conclusion ref 不保存正文 | AIIA / SoA 正文归 artifact / archive |
| union ref 必须显式分支 | 不得用裸字符串让实现侧猜 AIIA 或 SoA |

##### nonconformity / corrective ids and refs

```rust
/// Identifies a Governance nonconformity record.
pub struct NonconformityId(pub String);

/// Identifies a corrective action.
pub struct CorrectiveActionId(pub String);

/// Identifies a verification result.
pub struct VerificationResultId(pub String);

/// References a Governance nonconformity record.
pub struct NonconformityRef {
    /// Stable nonconformity id.
    pub nonconformity_id: NonconformityId,
}

/// References a corrective action.
pub struct CorrectiveActionRef {
    /// Stable corrective action id.
    pub action_id: CorrectiveActionId,
}

/// References a verification result.
pub struct VerificationResultRef {
    /// Stable verification result id.
    pub verification_id: VerificationResultId,
}
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `NonconformityId` / `NonconformityRef` | 不符合 truth identity / ref | raise nonconformity flow 由 application id generator 提供;repository load 可重建 | 不得使用 work blocker、bug、alert 或 incident id 替代 |
| `CorrectiveActionId` / `CorrectiveActionRef` | 纠正动作 identity / ref | plan corrective action flow 由 application id generator 提供 | 不等同 WorkItem;work 协作使用 `WorkGovernanceContextRef` |
| `VerificationResultId` / `VerificationResultRef` | 复验结果 identity / ref | verify nonconformity flow 由 application id generator 提供 | 不等同 evidence id;必须保留 verifier / state truth |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不符合不是普通任务 | ref 不得指向 bug、blocker、alert、runtime failure 或 work item |
| verification ref 不单独关闭不符合 | close 必须由 `NonconformityRecord` transition 判断 |

##### control / corrective reasons and severity

```rust
/// Explains why a control is not applicable or excluded.
pub struct ControlExcludeReason(pub String);

/// Explains why a control review failed.
pub struct ControlFailureReason(pub String);

/// Explains why a Governance decision or compliance conclusion is rejected.
pub struct GovernanceRejectReason(pub String);

/// Carries the severity of a nonconformity without fixing variants yet.
pub struct NonconformitySeverity(pub String);

/// Explains why a nonconformity is reopened.
pub struct NonconformityReopenReason(pub String);

/// Explains why a nonconformity signal is rejected.
pub struct NonconformityRejectReason(pub String);

/// Explains why a corrective action is cancelled.
pub struct CorrectiveActionCancelReason(pub String);

/// Explains why a corrective action failed.
pub struct CorrectiveActionFailureReason(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ControlExcludeReason` | 控制不适用 / 排除原因 | 来源于 `AssessControlApplicability`;非空;需要依据时引用 `EvidenceSummaryRef` |
| `ControlFailureReason` | 控制复核失败原因 | 来源于 `RecordControlReview`;非空;不得保存 evidence body |
| `GovernanceRejectReason` | decision / compliance conclusion 拒绝原因 | 来源于 formal command intent;非空;拒绝依据使用 `EvidenceSummaryRef` / `GovernanceDecisionRef` |
| `NonconformitySeverity` | 不符合严重度 | HLD 未给有限变体,本批采用非空 newtype;后续若需求固定等级再改 enum |
| `NonconformityReopenReason` | 重开不符合原因 | 来源于 reopen command / failed verification;非空 |
| `NonconformityRejectReason` | 拒绝不符合线索原因 | 来源于 reject command / policy guard;非空 |
| `CorrectiveActionCancelReason` | 取消纠正动作原因 | 来源于 cancel corrective action flow;非空 |
| `CorrectiveActionFailureReason` | 纠正动作失败原因 | 来源于 fail corrective action flow;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 不保存正文 | 不保存 artifact、work、alert、runtime log、conversation 或 evidence body |
| severity 不决定状态迁移 | 高严重度处置规则由 `NonconformityClosurePolicy` 和 Step 9 / Step 10 闭合 |
| corrective action 不替代 work | Work 协作引用只能辅助执行,不能把 WorkItem 当 Governance corrective truth |

#### 10.9 projection / reconciliation / trace / audit / outbox / history shared refs

本节固定可跨 command result、query view、event、job report、trace 和 audit surface 传递的派生、追溯、outbox 和 history shared type。具体 view DTO 字段、event payload、job report、outbox publisher 和 repository version 口径后续分别在 Step 8、Step 9、Step 11 和 Step 13 闭合。

##### projection / read model ids and refs

```rust
/// Identifies a derived Governance view.
pub struct DerivedGovernanceViewId(pub String);

/// References a derived Governance view.
pub struct DerivedGovernanceViewRef {
    /// Stable derived view id.
    pub view_id: DerivedGovernanceViewId,
}

/// References a decision summary view.
pub struct DecisionSummaryViewRef {
    /// Underlying derived view ref.
    pub view_ref: DerivedGovernanceViewRef,
}

/// References a policy effective view.
pub struct PolicyEffectiveViewRef {
    /// Underlying derived view ref.
    pub view_ref: DerivedGovernanceViewRef,
}

/// References a control coverage view.
pub struct ControlCoverageViewRef {
    /// Underlying derived view ref.
    pub view_ref: DerivedGovernanceViewRef,
}

/// References a nonconformity status view.
pub struct NonconformityStatusViewRef {
    /// Underlying derived view ref.
    pub view_ref: DerivedGovernanceViewRef,
}

/// Captures the committed Governance truth cursor used by projections.
pub struct GovernanceTruthCursor(pub String);
```

| 类型 | 作用 | 生成 / 来源 | 禁止事项 |
|---|---|---|---|
| `DerivedGovernanceViewId` / `DerivedGovernanceViewRef` | projection state、query view 和 stale marker 的统一 identity | projection builder / repository 按正式 scope / subject / view kind 生成;load 可重建 | 不得临时拼接 ad hoc view id |
| `DecisionSummaryViewRef` | Gate / Decision 摘要视图引用 | decision projection build path | 不替代 `GovernanceDecisionRef` |
| `PolicyEffectiveViewRef` | policy effective view 引用 | policy projection build path | 不决定 policy 生效 |
| `ControlCoverageViewRef` | control coverage view 引用 | control coverage projection build path | 不批准 SoA |
| `NonconformityStatusViewRef` | nonconformity status view 引用 | nonconformity projection build path | 不关闭 nonconformity |
| `GovernanceTruthCursor` | committed truth / trace 位置 | command accepted path 由 Step 7 `GovernanceUnitOfWork.assign_truth_change_cursor()` 在 truth save 已进入同一 UoW 后分配;query/projection/job path 可来自 committed truth scan、trace cursor 或 projection source cursor | 不作为 optimistic version;不得由 page cursor、version、timestamp、id generator、trace id 或 hard-coded string 推导 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| view ref 不保存 view body | 只保存 identity,view DTO 在 `contracts::views` 定义 |
| projection 不反写真相 | stale / fresh / failed 只影响读取和维护 |
| cursor 不解释业务语义 | cursor 是 opaque position,不得解析成时间或 id |

##### reconciliation report refs

```rust
/// Identifies a Governance reconciliation report.
pub struct GovernanceReconciliationReportId(pub String);

/// References a Governance reconciliation report.
pub struct GovernanceReconciliationReportRef {
    /// Stable report id.
    pub report_id: GovernanceReconciliationReportId,
}

/// Identifies a reconciliation finding.
pub struct GovernanceReconciliationFindingId(pub String);

/// References a reconciliation finding.
pub struct GovernanceReconciliationFindingRef {
    /// Stable finding id.
    pub finding_id: GovernanceReconciliationFindingId,
}

/// Carries an ordered set of reconciliation finding refs.
pub struct GovernanceReconciliationFindingRefSet(pub Vec<GovernanceReconciliationFindingRef>);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceReconciliationReportRef` | query / job report 中引用对账报告 | 只由已生成或已持久化 report id 构造 |
| `GovernanceReconciliationFindingRef` | 引用对账发现 | 不保存完整 finding body;body 留给 report DTO / persistence |
| `GovernanceReconciliationFindingRefSet` | 对账报告中的发现集合 | ordered unique;空集合表示无发现 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| report 不修复 truth | 对账报告只暴露问题或维护建议 |
| finding 不成为 external GRC truth | external GRC 只能消费导出材料 |

##### trace / audit / outbox refs

```rust
/// Identifies a Governance trace record.
pub struct GovernanceTraceId(pub String);

/// References a Governance trace record.
pub struct GovernanceTraceRecordRef {
    /// Stable trace id.
    pub trace_id: GovernanceTraceId,
}

/// Carries an ordered set of Governance trace record refs.
pub struct GovernanceTraceRecordRefSet(pub Vec<GovernanceTraceRecordRef>);

/// References the subject of a Governance trace.
pub struct GovernanceTraceSubjectRef(pub ExternalSourceRef);

/// Identifies a Governance audit trail.
pub struct GovernanceAuditTrailId(pub String);

/// References a Governance audit trail.
pub struct GovernanceAuditTrailRef {
    /// Stable audit trail id.
    pub audit_trail_id: GovernanceAuditTrailId,
}

/// References the subject of a Governance audit trail.
pub struct GovernanceAuditSubjectRef(pub ExternalSourceRef);

/// Identifies a Governance outbox record.
pub struct GovernanceOutboxId(pub String);

/// References a Governance outbox record.
pub struct GovernanceOutboxRef {
    /// Stable outbox id.
    pub outbox_id: GovernanceOutboxId,
}

/// References the subject that caused an outbox event.
pub struct GovernanceOutboxSubjectRef(pub ExternalSourceRef);

/// References a successful publication attempt.
pub struct OutboxPublicationRef(pub ExternalSourceRef);
```

| 类型 | 作用 | 生成 / 来源 | 禁止事项 |
|---|---|---|---|
| `GovernanceTraceId` / `GovernanceTraceRecordRef` | trace record identity / ref | command / consumer / job success path 由 application id generator 提供 | 不等同 observability log id |
| `GovernanceTraceRecordRefSet` | audit trail 中关联 trace refs | ordered unique;去重依据 `GovernanceTraceId` | 不保存 trace body |
| `GovernanceTraceSubjectRef` | 被追溯对象 | accepted truth path 来源于 Step 7 `GovernanceTruthChangeSubjectMapper` 生成的 canonical subject key;consumer / job marker 使用正式 marker subject | 不保存外部正文;不得拼 `ExternalSourceRef` 字符串 |
| `GovernanceAuditTrailId` / `GovernanceAuditTrailRef` | audit trail identity / ref | start audit trail flow 或 repository load | 不替代 observability ledger |
| `GovernanceAuditSubjectRef` | audit 对象 | accepted truth path 与 trace / outbox 使用同一个 canonical subject key,由 Step 7 `GovernanceTruthChangeSubjectMapper` 返回 | 不表达当前业务状态;不得由 audit repository 另行推导 |
| `GovernanceOutboxId` / `GovernanceOutboxRef` | outbox record identity / ref | outbox enqueue 由 application id generator 提供 | 不等同 outbound event id |
| `GovernanceOutboxSubjectRef` | outbox 对应变化对象 | 由正式 truth change 映射;command flow 必须通过 Step 7 `GovernanceTruthChangeSubjectMapper` 从对应 truth 的 `to_ref()` 或 branch-specific ref 转换 | 不保存 event payload body;不得拼 `ExternalSourceRef` 字符串 |
| `OutboxPublicationRef` | 发布成功回执引用 | publisher / bus adapter 返回 | 不改变 Governance truth 是否成立 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| trace / audit 不保存外部正文 | artifact、conversation、runtime、observability、archive body 都只通过 ref / handoff 表达 |
| accepted subject key 同源 | command accepted path 的 trace subject、audit subject 和 outbox subject 必须包装同一个 canonical `ExternalSourceRef`;context/input/gate/decision 等 flow 不得各自生成不同 subject |
| outbox 不决定 truth | 只传播已成立 truth 或正式维护状态 |
| publication ref 不是 source version | 只表示发布动作结果,不替代 event schema version |

##### history record ids

```rust
/// Identifies a decision history record.
pub struct DecisionRecordId(pub String);

/// References a decision history record.
pub struct DecisionRecordRef {
    /// Stable decision record id.
    pub record_id: DecisionRecordId,
}

/// Identifies a responsibility trace record.
pub struct ResponsibilityTraceRecordId(pub String);

/// References a responsibility trace record.
pub struct ResponsibilityTraceRecordRef {
    /// Stable responsibility trace record id.
    pub record_id: ResponsibilityTraceRecordId,
}

/// Identifies a policy change record.
pub struct PolicyChangeRecordId(pub String);

/// References a policy change record.
pub struct PolicyChangeRecordRef {
    /// Stable policy change record id.
    pub record_id: PolicyChangeRecordId,
}

/// Identifies a control change record.
pub struct ControlChangeRecordId(pub String);

/// References a control change record.
pub struct ControlChangeRecordRef {
    /// Stable control change record id.
    pub record_id: ControlChangeRecordId,
}

/// Identifies a compliance conclusion change record.
pub struct ComplianceConclusionRecordId(pub String);

/// References a compliance conclusion change record.
pub struct ComplianceConclusionRecordRef {
    /// Stable compliance conclusion record id.
    pub record_id: ComplianceConclusionRecordId,
}

/// Identifies a nonconformity change record.
pub struct NonconformityChangeRecordId(pub String);

/// References a nonconformity change record.
pub struct NonconformityChangeRecordRef {
    /// Stable nonconformity change record id.
    pub record_id: NonconformityChangeRecordId,
}
```

| 类型 | 作用 | 生成 / 重建来源 | 禁止事项 |
|---|---|---|---|
| `DecisionRecordId` | 裁决历史记录身份 | decision change flow 由 application id generator 提供 | 不得原地覆盖旧 decision |
| `DecisionRecordRef` | command result、trace、audit 和 query 中引用 decision history | 只由已持久化 record id 构造 | 不保存 decision body |
| `ResponsibilityTraceRecordId` | 责任变化记录身份 | responsibility change flow 由 application id generator 提供 | 不保存 identity body |
| `ResponsibilityTraceRecordRef` | 引用 responsibility history / audit item | 只由已持久化 record id 构造 | 不保存 actor profile 或 capability body |
| `PolicyChangeRecordId` | Policy / shared rules 变化记录身份 | policy change flow 由 application id generator 提供 | 不保存 method policy body |
| `PolicyChangeRecordRef` | 引用 policy / shared rules history item | 只由已持久化 record id 构造 | 不保存 policy definition body |
| `ControlChangeRecordId` | control applicability / review 变化记录身份 | control change flow 由 application id generator 提供 | 不保存 control definition body |
| `ControlChangeRecordRef` | 引用 control history item | 只由已持久化 record id 构造 | 不替代 `ControlReviewRef` |
| `ComplianceConclusionRecordId` | AIIA / SoA 结论变化记录身份 | compliance conclusion change flow 由 application id generator 提供 | 不保存 AIIA / SoA body |
| `ComplianceConclusionRecordRef` | 引用 conclusion history item | 只由已持久化 record id 构造 | 不保存 artifact / archive body |
| `NonconformityChangeRecordId` | 不符合闭环变化记录身份 | nonconformity change flow 由 application id generator 提供 | 不替代 current nonconformity state |
| `NonconformityChangeRecordRef` | 引用 nonconformity corrective history item | 只由已持久化 record id 构造 | 不替代 WorkItem 或 verification result |

##### outbox / trace / projection reasons

```rust
/// Explains why an outbox publication failed.
pub struct OutboxFailureReason(pub String);

/// Explains why an outbox record was dead-lettered.
pub struct OutboxDeadLetterReason(pub String);

/// Explains why a derived view rebuild failed.
pub struct DerivedViewFailureReason(pub String);

/// References the latest derived view failure.
pub struct DerivedViewFailureRef(pub String);

/// References a trace handoff target without owning target storage.
pub struct TraceHandoffTargetRef(pub ExternalSourceRef);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `OutboxFailureReason` | 发布失败原因 | 来源于 publisher / bus adapter;非空;不得保存 payload body |
| `OutboxDeadLetterReason` | 不可恢复发布失败原因 | 来源于 retry policy / publisher fatal error;非空 |
| `DerivedViewFailureReason` | projection rebuild 失败原因 | 来源于 rebuild job / projection repository;非空 |
| `DerivedViewFailureRef` | 最近失败引用 | 来源于 persisted failure marker 或 job report item;不保存完整错误栈 |
| `TraceHandoffTargetRef` | observability / archive / external GRC 等交接目标 | 来源于 job input / config binding;不保存目标系统正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| failure reason 不替代错误模型 | Step 12 仍需定义正式 error / recovery surface |
| handoff target 不拥有外部系统 | 交接 port 负责运行期写入,contracts 只保存目标 ref |
| projection failure 不反写真相 | failed 只影响 query degraded / operations surface |

#### 10.10 context / decision / responsibility state enum

本节先闭合 context、input、gate、decision、approval responsibility、responsibility chain 和 decision summary 相关 state enum。所有状态必须与 HLD Step 9 状态矩阵同名;domain transition method 后续在 §11 按对象写完整签名。

##### `GovernanceContextState`

```rust
/// Describes whether a Governance context can enter formal decision handling.
pub enum GovernanceContextState {
    /// The context exists but is not ready for a formal Governance decision.
    Draft,

    /// The subject, source, actor, and required references are ready.
    Ready,

    /// The context waits for external references or evidence summaries.
    PendingReference,

    /// The context is invalid or no longer applicable.
    Invalid,

    /// The context is closed and no longer accepts new decisions.
    Closed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `The context exists but is not ready for a formal Governance decision.` | 初始语境,裁决条件未闭合 | `GovernanceContext::from_subject(...)` | `Ready`、`PendingReference`、`Invalid` |
| `Ready` | `The subject, source, actor, and required references are ready.` | 可进入 Gate / Decision / Control 主线 | `mark_ready`、reference resolved | `PendingReference`、`Invalid`、`Closed` |
| `PendingReference` | `The context waits for external references or evidence summaries.` | 外部引用或证据摘要未解析 | `mark_pending_reference`、reference unavailable | `Ready`、`Invalid`、`Closed` |
| `Invalid` | `The context is invalid or no longer applicable.` | 语境不合法或不再适用 | `invalidate` | 终态 |
| `Closed` | `The context is closed and no longer accepts new decisions.` | 语境结束 | `close` | 终态 |

##### `GovernanceInputState`

```rust
/// Describes how an external Governance input has been accepted or rejected.
pub enum GovernanceInputState {
    /// The input was received but not yet evaluated.
    Received,

    /// The input was accepted as a formal Governance handling signal.
    Accepted,

    /// The input was rejected as not actionable for Governance.
    Rejected,

    /// The input waits for evidence or external reference resolution.
    PendingEvidence,

    /// The input was superseded by a later input.
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Received` | `The input was received but not yet evaluated.` | 输入初始接收状态 | `GovernanceInput::receive(...)` | `Accepted`、`Rejected`、`PendingEvidence`、`Superseded` |
| `Accepted` | `The input was accepted as a formal Governance handling signal.` | 输入可作为正式治理线索 | `accept`、evidence resolved | `PendingEvidence`、`Superseded` |
| `Rejected` | `The input was rejected as not actionable for Governance.` | 输入不具备治理意义 | `reject` | 终态 |
| `PendingEvidence` | `The input waits for evidence or external reference resolution.` | 等待依据或引用解析 | `wait_for_evidence` | `Accepted`、`Superseded` |
| `Superseded` | `The input was superseded by a later input.` | 被后续输入替代 | `supersede` | 终态 |

##### `GateState`

```rust
/// Describes the lifecycle of a Governance decision gate.
pub enum GateState {
    /// The gate is open but no formal decision has been requested yet.
    Open,

    /// The gate waits for a formal Governance decision.
    PendingDecision,

    /// The gate is bound to a formal Governance decision.
    Decided,

    /// The gate expired before a formal decision completed.
    Expired,

    /// The gate was cancelled before a formal decision completed.
    Cancelled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `The gate is open but no formal decision has been requested yet.` | Gate 初始打开状态 | `Gate::open(...)` | `PendingDecision`、`Expired`、`Cancelled` |
| `PendingDecision` | `The gate waits for a formal Governance decision.` | 已绑定责任或要求,等待裁决 | `request_decision` | `Decided`、`Expired`、`Cancelled` |
| `Decided` | `The gate is bound to a formal Governance decision.` | 已绑定正式 `GovernanceDecisionRef` | `attach_decision` | 终态 |
| `Expired` | `The gate expired before a formal decision completed.` | Gate 超时或不再有效 | `expire` | 终态 |
| `Cancelled` | `The gate was cancelled before a formal decision completed.` | Gate 被显式取消 | `cancel` | 终态 |

##### `GovernanceDecisionState`

```rust
/// Describes the lifecycle of a formal Governance decision.
pub enum GovernanceDecisionState {
    /// The decision has been proposed but has no final outcome.
    Proposed,

    /// The decision formally approves the governed path.
    Approved,

    /// The decision formally rejects the governed path.
    Rejected,

    /// The decision formally waives the governed requirement.
    Waived,

    /// The decision was replaced by a later decision.
    Superseded,

    /// The decision was revoked after being finalized.
    Revoked,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Proposed` | `The decision has been proposed but has no final outcome.` | 待裁决对象已创建 | `GovernanceDecision::propose(...)` | `Approved`、`Rejected`、`Waived` |
| `Approved` | `The decision formally approves the governed path.` | 正式批准 | `approve` | `Superseded`、`Revoked` |
| `Rejected` | `The decision formally rejects the governed path.` | 正式拒绝 | `reject` | `Superseded`、`Revoked` |
| `Waived` | `The decision formally waives the governed requirement.` | 正式豁免 | `waive` | `Superseded`、`Revoked` |
| `Superseded` | `The decision was replaced by a later decision.` | 被后续裁决替代 | `supersede` | 终态 |
| `Revoked` | `The decision was revoked after being finalized.` | 已撤销 | `revoke` | 终态 |

##### `ApprovalResponsibilityState`

```rust
/// Describes the lifecycle of an approval responsibility.
pub enum ApprovalResponsibilityState {
    /// A responsibility is required but not yet assigned.
    Required,

    /// The responsibility is assigned to an actor.
    Assigned,

    /// The assigned actor accepted the responsibility.
    Accepted,

    /// The responsibility recorded a vote or approval action.
    Voted,

    /// The responsibility was delegated to another actor.
    Delegated,

    /// The responsibility was released and is no longer active.
    Released,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Required` | `A responsibility is required but not yet assigned.` | 要求已生成但未分配 | `ApprovalResponsibility::require(...)` | `Assigned`、`Released` |
| `Assigned` | `The responsibility is assigned to an actor.` | 已分配给 actor | `assign` | `Accepted`、`Voted`、`Delegated`、`Released` |
| `Accepted` | `The assigned actor accepted the responsibility.` | actor 接受责任 | `accept` | `Voted`、`Delegated`、`Released` |
| `Voted` | `The responsibility recorded a vote or approval action.` | 已记录投票或审批动作 | `record_vote` | `Released` |
| `Delegated` | `The responsibility was delegated to another actor.` | 已委托给替代 actor | `delegate_to` | `Released` |
| `Released` | `The responsibility was released and is no longer active.` | 责任已释放 | `release` | 终态 |

##### `ResponsibilityChainState`

```rust
/// Describes whether a responsibility chain can support a Governance decision.
pub enum ResponsibilityChainState {
    /// The chain is open and waiting for responsibilities to be satisfied.
    Open,

    /// The chain satisfied the formal decision requirement.
    Satisfied,

    /// The chain was escalated for additional handling.
    Escalated,

    /// The chain cannot satisfy the formal decision requirement.
    Blocked,

    /// The chain is closed.
    Closed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `The chain is open and waiting for responsibilities to be satisfied.` | 责任链待满足 | `ResponsibilityChain::start_for_context(...)` | `Satisfied`、`Escalated`、`Blocked` |
| `Satisfied` | `The chain satisfied the formal decision requirement.` | 责任链满足裁决要求 | `mark_satisfied` | `Closed` |
| `Escalated` | `The chain was escalated for additional handling.` | 责任链升级处理 | `escalate` | `Blocked`、`Closed` |
| `Blocked` | `The chain cannot satisfy the formal decision requirement.` | 责任链无法满足 | `block` | `Closed` |
| `Closed` | `The chain is closed.` | 责任链结束 | `close` | 终态 |

##### `DecisionSummaryState`

```rust
/// Describes whether a decision summary view can be read as a current summary.
pub enum DecisionSummaryState {
    /// The summary can be returned to authorized readers.
    Readable,

    /// The summary is stale and must expose freshness metadata.
    Stale,

    /// The summary is hidden from the current reader.
    NotVisible,

    /// The summary cannot be assembled from available sources.
    Unavailable,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Readable` | `The summary can be returned to authorized readers.` | view 可被授权读取 | projection build / query assembly | `Stale`、`NotVisible`、`Unavailable` |
| `Stale` | `The summary is stale and must expose freshness metadata.` | view 过期但可带 freshness surface 返回 | source cursor 落后、projection stale marker | `Readable`、`Unavailable` |
| `NotVisible` | `The summary is hidden from the current reader.` | 当前 actor 不可见 | read visibility policy | query-scoped surface,不持久化为 truth |
| `Unavailable` | `The summary cannot be assembled from available sources.` | view 缺失或维护失败 | projection missing / failed | `Readable`、`Stale` |

#### 10.11 policy / shared rules / conflict state enum

本节闭合 policy effective fact、shared rule set 和 policy conflict record 的 state enum。状态名和迁移方向对齐 HLD Step 9;domain 对象方法和不变量后续在 §12 写完整签名。

##### `PolicyEffectiveState`

```rust
/// Describes the lifecycle of a Governance-owned effective policy fact.
pub enum PolicyEffectiveState {
    /// The policy fact is proposed but not yet effective.
    Proposed,

    /// The policy fact is effective in its Governance scope.
    Effective,

    /// The policy fact is temporarily suspended.
    Suspended,

    /// The policy fact was replaced by a later policy fact.
    Superseded,

    /// The policy fact is retired and no longer applies.
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Proposed` | `The policy fact is proposed but not yet effective.` | policy 生效事实待批准或待激活 | `PolicyEffectiveFact::propose(...)` | `Effective`、`Superseded`、`Retired` |
| `Effective` | `The policy fact is effective in its Governance scope.` | policy 在 scope 内正式生效 | `activate` | `Suspended`、`Superseded`、`Retired` |
| `Suspended` | `The policy fact is temporarily suspended.` | 暂停生效 | `suspend` | `Effective`、`Superseded`、`Retired` |
| `Superseded` | `The policy fact was replaced by a later policy fact.` | 被后续 policy fact 替代 | `supersede` | 终态 |
| `Retired` | `The policy fact is retired and no longer applies.` | 退役不再适用 | `retire` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| runtime cache 不形成状态 | runtime / capability 命中结果不能让 policy 进入 `Effective` |
| suspended 不可静默消费 | query / event 必须显式暴露暂停状态 |

##### `SharedRuleSetState`

```rust
/// Describes the lifecycle of a Governance shared rule set.
pub enum SharedRuleSetState {
    /// The shared rule set is drafted and not yet active.
    Draft,

    /// The shared rule set is active as a hard Governance constraint.
    Active,

    /// The shared rule set is deprecated but still traceable.
    Deprecated,

    /// The shared rule set is retired and no longer applies.
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `The shared rule set is drafted and not yet active.` | shared rules 草稿 | `SharedRuleSet::draft(...)` | `Active`、`Retired` |
| `Active` | `The shared rule set is active as a hard Governance constraint.` | 组织级硬约束生效 | `activate` | `Deprecated`、`Retired` |
| `Deprecated` | `The shared rule set is deprecated but still traceable.` | 部分规则或集合被弃用,等待替代或退役 | `deprecate_rule` | `Retired` |
| `Retired` | `The shared rule set is retired and no longer applies.` | 规则集合退役 | `retire` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| active 不可被低 scope 覆盖 | low-scope policy / config 不能削弱 `Active` shared rules |
| deprecated 必须可见 | query / trace 必须显式暴露弃用状态,不能伪装 active |

##### `PolicyConflictState`

```rust
/// Describes how a detected Governance policy conflict is handled.
pub enum PolicyConflictState {
    /// A policy conflict was detected and needs handling.
    Detected,

    /// The conflict waits for a formal Governance decision.
    PendingDecision,

    /// The conflict was resolved using formal Governance basis.
    Resolved,

    /// The conflict was formally waived and remains traceable.
    Waived,

    /// The conflict record was invalidated as not applicable.
    Invalid,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Detected` | `A policy conflict was detected and needs handling.` | 冲突已发现,尚未处理 | `PolicyConflictRecord::detect(...)` | `PendingDecision`、`Resolved`、`Waived`、`Invalid` |
| `PendingDecision` | `The conflict waits for a formal Governance decision.` | 冲突等待正式裁决 | `mark_pending_decision` | `Resolved`、`Waived`、`Invalid` |
| `Resolved` | `The conflict was resolved using formal Governance basis.` | 冲突已基于正式依据解决 | `resolve` | 终态 |
| `Waived` | `The conflict was formally waived and remains traceable.` | 冲突被正式豁免 | `waive` | 终态 |
| `Invalid` | `The conflict record was invalidated as not applicable.` | 冲突记录不成立 | `invalidate` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| waived 必须可追溯 | `Waived` 必须有 formal reason / decision / evidence basis |
| conflict 不修改 policy truth | 解决冲突不等于改写 `PolicyEffectiveFact` 或 `SharedRuleSet` |

#### 10.12 control / compliance state enum

本节闭合 control applicability、control review、AIIA / SoA compliance conclusion 和 control coverage view 的 state enum。AIIA 与 SoA 共用 `ComplianceConclusionState`;具体结论对象字段和 transition method 留到 domain 批次。

##### `ControlApplicabilityState`

```rust
/// Describes whether a method control applies to a Governance context.
pub enum ControlApplicabilityState {
    /// The control applicability is waiting for assessment.
    PendingAssessment,

    /// The control applies to the Governance context.
    Applicable,

    /// The control does not apply to the Governance context.
    NotApplicable,

    /// The control is excluded with formal basis.
    Excluded,

    /// The applicability fact was replaced by a later assessment.
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `PendingAssessment` | `The control applicability is waiting for assessment.` | 控制适用性待评估 | `ControlApplicability::assess(...)` | `Applicable`、`NotApplicable`、`Excluded` |
| `Applicable` | `The control applies to the Governance context.` | 控制适用 | `mark_applicable` | `Superseded` |
| `NotApplicable` | `The control does not apply to the Governance context.` | 控制不适用 | `mark_not_applicable` | `Superseded` |
| `Excluded` | `The control is excluded with formal basis.` | 控制被有依据排除 | `exclude` | `Superseded` |
| `Superseded` | `The applicability fact was replaced by a later assessment.` | 被后续适用性判断替代 | `supersede` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| applicable / excluded 必须有依据 | `Applicable` 和 `Excluded` 路径必须能回到 `EvidenceSummaryRef` |
| coverage view 不反写状态 | `ControlCoverageView` 不能把 applicability 改成适用或排除 |

##### `ControlReviewState`

```rust
/// Describes the lifecycle of a Governance control review.
pub enum ControlReviewState {
    /// The control review is planned.
    Planned,

    /// The control review is in progress.
    InReview,

    /// The control review passed with evidence.
    Passed,

    /// The control review failed with evidence.
    Failed,

    /// The control review was formally waived.
    Waived,

    /// The control review was replaced by a later review.
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Planned` | `The control review is planned.` | 复核已计划 | `ControlReview::plan(...)` | `InReview`、`Superseded` |
| `InReview` | `The control review is in progress.` | 复核进行中 | `start` | `Passed`、`Failed`、`Waived`、`Superseded` |
| `Passed` | `The control review passed with evidence.` | 复核通过 | `pass` | 终态 |
| `Failed` | `The control review failed with evidence.` | 复核失败,可能触发不符合线索 | `fail` | 终态 |
| `Waived` | `The control review was formally waived.` | 复核被正式豁免 | `waive` | 终态 |
| `Superseded` | `The control review was replaced by a later review.` | 被后续复核替代 | superseding review | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| failed 不自动创建 nonconformity | `Failed` 只能成为输入线索,不能直接生成或关闭不符合 |
| waived 必须引用正式裁决 | `Waived` 必须回链 `GovernanceDecisionRef` 或正式 decision basis |

##### `ComplianceConclusionState`

```rust
/// Describes the lifecycle of an AIIA or SoA Governance conclusion.
pub enum ComplianceConclusionState {
    /// The compliance conclusion is drafted.
    Drafted,

    /// The compliance conclusion is under Governance review.
    InReview,

    /// The compliance conclusion was formally approved.
    Approved,

    /// The compliance conclusion was formally rejected.
    Rejected,

    /// The compliance conclusion was replaced by a later conclusion.
    Superseded,

    /// The compliance conclusion was revoked after finalization.
    Revoked,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Drafted` | `The compliance conclusion is drafted.` | AIIA / SoA 结论草稿 | `AIIAConclusion::from_artifact(...)`、`SoAConclusion::from_artifact(...)` | `InReview`、`Superseded` |
| `InReview` | `The compliance conclusion is under Governance review.` | 结论进入治理评审 | `submit_for_review` | `Approved`、`Rejected`、`Superseded` |
| `Approved` | `The compliance conclusion was formally approved.` | 结论被正式批准 | `approve` | `Superseded`、`Revoked` |
| `Rejected` | `The compliance conclusion was formally rejected.` | 结论被正式拒绝 | `reject` | `Superseded`、`Revoked` |
| `Superseded` | `The compliance conclusion was replaced by a later conclusion.` | 被新结论替代 | `supersede` | 终态 |
| `Revoked` | `The compliance conclusion was revoked after finalization.` | 结论撤销 | `revoke` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| approved 不保存正文 | AIIA / SoA 正文仍归 artifact / archive |
| SoA approve 必须覆盖 control coverage | `SoAConclusion` 批准路径必须回链 `ControlCoverageRef` |

##### `ControlCoverageState`

```rust
/// Describes the read-model coverage status for controls in a Governance context.
pub enum ControlCoverageState {
    /// All required control coverage is complete.
    Complete,

    /// A control coverage gap was detected.
    GapDetected,

    /// The coverage waits for evidence or external reference resolution.
    PendingEvidence,

    /// The coverage view is stale and must expose freshness metadata.
    Stale,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Complete` | `All required control coverage is complete.` | 覆盖完整 | `ControlCoverageView::from_control_truth(...)` | `GapDetected`、`PendingEvidence`、`Stale` |
| `GapDetected` | `A control coverage gap was detected.` | 存在覆盖缺口 | projection build / reconciliation | `Complete`、`PendingEvidence`、`Stale` |
| `PendingEvidence` | `The coverage waits for evidence or external reference resolution.` | 等待证据或引用解析 | evidence missing / reference pending | `Complete`、`GapDetected`、`Stale` |
| `Stale` | `The coverage view is stale and must expose freshness metadata.` | 覆盖视图过期 | source cursor lag / projection stale | `Complete`、`GapDetected`、`PendingEvidence` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| coverage state 是 read-model state | 不替代 `ControlApplicabilityState`、`ControlReviewState` 或 `ComplianceConclusionState` |
| stale 必须显式暴露 | query 不得把 stale coverage 当 fresh coverage 输出 |

#### 10.13 nonconformity corrective state enum

本节闭合不符合纠正闭环的三类 state enum:`NonconformityState`、`CorrectiveActionState` 和 `VerificationState`。状态名与 HLD Step 9 §5.5、§6.5、§7.3 保持一致。`VerificationState` 是复验结果的结论状态,不是可独立迁移的 long-lived aggregate state。

##### `NonconformityState`

```rust
/// Describes the lifecycle of a formal Governance nonconformity.
pub enum NonconformityState {
    /// The nonconformity has been raised as a formal Governance record.
    Raised,

    /// The nonconformity cause has been confirmed.
    CauseConfirmed,

    /// Corrective action is being executed for the nonconformity.
    Correcting,

    /// The nonconformity waits for verification.
    ReadyForVerification,

    /// The nonconformity was closed after passed verification.
    Closed,

    /// A closed nonconformity was reopened for corrective handling.
    Reopened,

    /// The nonconformity signal was rejected as not valid.
    Rejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Raised` | `The nonconformity has been raised as a formal Governance record.` | 不符合已正式提出 | `NonconformityRecord::raise(...)` | `CauseConfirmed`、`Rejected` |
| `CauseConfirmed` | `The nonconformity cause has been confirmed.` | 原因已确认,可规划纠正 | `confirm_cause` | `Correcting` |
| `Correcting` | `Corrective action is being executed for the nonconformity.` | 正在纠正 | `start_correction` from `CauseConfirmed` / `Reopened` | `ReadyForVerification` |
| `ReadyForVerification` | `The nonconformity waits for verification.` | 等待复验 | `mark_ready_for_verification` | `Closed` with passed verification; failed / inconclusive verification 不得进入 `Closed` |
| `Closed` | `The nonconformity was closed after passed verification.` | 复验通过后关闭 | `close` with `VerificationState::Passed` | `Reopened` |
| `Reopened` | `A closed nonconformity was reopened for corrective handling.` | 已关闭不符合被重开 | `reopen` | `Correcting` |
| `Rejected` | `The nonconformity signal was rejected as not valid.` | 线索不成立 | `reject` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `Closed` 必须基于 passed verification | `CorrectiveActionState::Completed` 不能自动关闭不符合 |
| `Rejected` 不等同删除记录 | rejected nonconformity 仍保留可审查 trace / history |
| 失败复验不能关闭 | `VerificationState::Failed` / `Inconclusive` 必须回到纠正或补 evidence,不能推动 `Closed` |
| 外部缺陷不替代状态 | bug、blocker、alert、runtime incident 只能作为来源线索,不能直接写入 `NonconformityState` |

##### `CorrectiveActionState`

```rust
/// Describes the lifecycle of a corrective action for a nonconformity.
pub enum CorrectiveActionState {
    /// The corrective action is planned but not started.
    Planned,

    /// The corrective action is being executed.
    InProgress,

    /// The corrective action completed with supporting evidence.
    Completed,

    /// The corrective action was cancelled before completion.
    Cancelled,

    /// The corrective action failed and needs replanning or escalation.
    Failed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Planned` | `The corrective action is planned but not started.` | 纠正动作已计划 | `CorrectiveAction::plan(...)` | `InProgress`、`Cancelled`、`Failed` |
| `InProgress` | `The corrective action is being executed.` | 纠正执行中 | `start` | `Completed`、`Cancelled`、`Failed` |
| `Completed` | `The corrective action completed with supporting evidence.` | 纠正动作完成,等待复验判断 | `complete` with `EvidenceSummaryRef` | 终态;不自动改变 `NonconformityState` |
| `Cancelled` | `The corrective action was cancelled before completion.` | 纠正动作取消 | `cancel` from `Planned` / `InProgress` | 终态 |
| `Failed` | `The corrective action failed and needs replanning or escalation.` | 纠正动作失败 | `fail` from `Planned` / `InProgress` | 终态;后续需重新规划或升级 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| completed 不等于 closed | 完成纠正动作只说明执行完成,关闭必须由 `NonconformityRecord::close(...)` 基于 passed verification 执行 |
| work_ref 只是协作引用 | `CorrectiveAction` 可以引用 Work 协作上下文,但不能把 WorkItem 状态当成本对象状态 |
| cancelled / failed 必须带 reason | 取消和失败路径必须记录正式 reason,不得静默终止 |

##### `VerificationState`

```rust
/// Describes the conclusion of a nonconformity verification result.
pub enum VerificationState {
    /// Verification passed and can support closing the nonconformity.
    Passed,

    /// Verification failed and requires corrective rework.
    Failed,

    /// Verification could not reach a reliable conclusion.
    Inconclusive,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Passed` | `Verification passed and can support closing the nonconformity.` | 复验通过,可作为关闭依据 | `VerificationResult::from_evidence(...)` | 被 `NonconformityRecord::close(...)` 消费 |
| `Failed` | `Verification failed and requires corrective rework.` | 复验失败,需要重新纠正 | `VerificationResult::from_evidence(...)` | 不能进入 `Closed`;后续回到纠正或升级 |
| `Inconclusive` | `Verification could not reach a reliable conclusion.` | 复验无法确认 | `VerificationResult::from_evidence(...)` | 不能进入 `Closed`;后续补 evidence 或重新复核 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| verification result 不独立迁移 | `VerificationState` 是结果结论,不是 aggregate lifecycle |
| evidence body 不进入 state | 复验依据只通过 `EvidenceSummaryRef` 引用 |
| failed / inconclusive 不关闭 | 失败或无法确认只能推动 rework / evidence 补齐,不得作为关闭依据 |

#### 10.14 derived / reference / outbox state enum

本节闭合 projection freshness、external reference resolution 和 outbox publication 三类维护状态。这些状态可以影响 query degraded surface、maintenance job report 和 publication retry,但不能反写 Governance core truth。

##### `DerivedGovernanceViewFreshnessState`

```rust
/// Describes whether a derived Governance view is current and usable.
pub enum DerivedGovernanceViewFreshnessState {
    /// The view has caught up with its source cursor.
    Fresh,

    /// The view is behind Governance truth or a local snapshot.
    Stale,

    /// The view is currently being rebuilt.
    Rebuilding,

    /// The last view maintenance attempt failed.
    Failed,

    /// The view is not available for serving.
    Unavailable,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | `The view has caught up with its source cursor.` | 视图已追上来源 cursor | `DerivedGovernanceViewState::for_view(...)`、`mark_fresh` | `Stale` |
| `Stale` | `The view is behind Governance truth or a local snapshot.` | 视图落后于 truth 或 snapshot | `mark_stale` from `Fresh`、core truth / snapshot changed | `Rebuilding`、`Failed` |
| `Rebuilding` | `The view is currently being rebuilt.` | 视图重建中 | `start_rebuild` from `Stale` / `Failed` | `Fresh`、`Failed` |
| `Failed` | `The last view maintenance attempt failed.` | 视图维护失败 | `mark_failed` from `Stale` / `Rebuilding` | `Rebuilding` |
| `Unavailable` | `The view is not available for serving.` | 视图不可用 | projection source / storage unavailable path | `Rebuilding` after maintenance retry starts |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| freshness 不反写真相 | projection freshness 只能影响 read surface 和 maintenance job,不能修改 core truth |
| stale / failed 必须显式暴露 | query 不能把 `Stale` / `Failed` / `Unavailable` 伪装成 fresh view |
| rebuilding 需要 fallback 口径 | query 若返回 rebuilding 视图,必须在 Step 8 / Step 9 定义 fallback 或 degraded marker |

##### `ReferenceResolutionKind`

```rust
/// Describes the local resolution status of an external Governance reference.
pub enum ReferenceResolutionKind {
    /// The reference was resolved to a source version.
    Resolved,

    /// The reference could not be resolved yet.
    Unresolved,

    /// The resolved source version is stale.
    Stale,

    /// The reference is invalid.
    Invalid,

    /// The source is temporarily unavailable.
    Unavailable,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Resolved` | `The reference was resolved to a source version.` | 外部引用已解析到版本 | `mark_resolved` from `Unresolved` / `Stale` / `Unavailable` | `Stale`、`Invalid`、`Unavailable` |
| `Unresolved` | `The reference could not be resolved yet.` | 未能解析 | `ReferenceResolutionState::for_reference(...)`、`mark_unresolved` | `Resolved`、`Invalid`、`Unavailable` |
| `Stale` | `The resolved source version is stale.` | 来源版本过期 | `mark_stale` from `Resolved` | `Resolved`、`Invalid`、`Unavailable` |
| `Invalid` | `The reference is invalid.` | 引用无效 | `mark_invalid` from `Unresolved` / `Resolved` / `Stale` | 终态;若需要恢复必须新建或显式替代 reference state |
| `Unavailable` | `The source is temporarily unavailable.` | 来源暂不可用 | `mark_unavailable` from `Unresolved` / `Resolved` / `Stale` | `Resolved` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| resolved 不拥有外部 truth | `Resolved` 只说明本地引用解析到 source version,不替代外部对象状态 |
| 非 resolved 不可作为已解析输入 | `Unresolved` / `Stale` / `Invalid` / `Unavailable` 只能触发 pending、refresh 或 degraded |
| 不保存外部正文 | reference state 只能保存 ref、version、checked-at 和 failure reason |

##### `OutboxPublicationState`

```rust
/// Describes publication state for a Governance outbox record.
pub enum OutboxPublicationState {
    /// The outbox record is waiting to be published.
    Pending,

    /// The outbox record was successfully published.
    Published,

    /// Publication failed but may be retried.
    Failed,

    /// Publication failed permanently and requires operator handling.
    DeadLettered,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The outbox record is waiting to be published.` | 已成立 truth 待传播 | `GovernanceOutboxRecord::from_truth_change(...)`、retry scheduled from `Failed` | `Published`、`Failed`、`DeadLettered` |
| `Published` | `The outbox record was successfully published.` | 已成功发布 | `mark_published` | 终态 |
| `Failed` | `Publication failed but may be retried.` | 发布失败,可重试 | `mark_failed` from `Pending` | `Pending`、`DeadLettered` |
| `DeadLettered` | `Publication failed permanently and requires operator handling.` | 不可恢复发布失败 | `mark_dead_lettered` from `Pending` / `Failed` | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| outbox 不决定 truth 成立 | outbox 只传播已成立 truth,发布失败不能回滚 core truth |
| retry 必须保留失败可见性 | `Failed -> Pending` 不能清除历史失败记录,job report / audit 必须可见 |
| dead letter 需要人工或运维处置 | `DeadLettered` 不得自动重新发布,除非后续 Step 12 / Step 13 定义正式恢复路径 |

#### 10.15 reconciliation / kind / reference marker shared type

本节闭合前述 shared object 已经引用、但尚未定义的轻量状态、kind、change kind 和 reference marker。除 `ReconciliationReportState`、`EvidenceVerifiedState` 这类已有稳定变体的状态外,kind / change kind 均采用非空 newtype。当前 HLD 没有给这些 kind 的有限变体表,因此详细设计不得由实现侧自造 enum variants。

##### `ReconciliationReportState`

```rust
/// Describes the lifecycle of a Governance reconciliation report.
pub enum ReconciliationReportState {
    /// The reconciliation report was generated.
    Generated,

    /// The reconciliation run failed before a valid report was produced.
    Failed,

    /// The report was replaced by a later reconciliation report.
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Generated` | `The reconciliation report was generated.` | 对账报告已生成 | `GovernanceReconciliationReport::from_reconciliation(...)` | `Superseded` |
| `Failed` | `The reconciliation run failed before a valid report was produced.` | 对账失败,需要 job report / operations surface | reconciliation job failure | `Superseded` by later generated or failed report |
| `Superseded` | `The report was replaced by a later reconciliation report.` | 被后续报告替代 | later reconciliation report for same scope / cursor | 终态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| report 不修复 truth | `Generated` 只表达对账结果已形成,不能修改 Governance truth |
| failed 不能伪装空报告 | `Failed` 必须带 job / failure surface,不得返回空 finding set 冒充成功 |
| superseded 必须可追溯 | 被替代报告仍保留 ref、scope、cursor 和 finding refs |

##### public kind newtypes

```rust
/// Classifies an incoming Governance input.
pub struct GovernanceInputKind(pub String);

/// Classifies a Governance decision gate.
pub struct GateKind(pub String);

/// Classifies a formal Governance decision.
pub struct GovernanceDecisionKind(pub String);

/// Classifies the external object governed by Governance.
pub struct GovernedSubjectKind(pub String);

/// Classifies the source that triggered or supports Governance handling.
pub struct GovernanceSourceKind(pub String);

/// Classifies an external evidence summary.
pub struct EvidenceKind(pub String);

/// Classifies a runtime or capability signal.
pub struct RuntimeSignalKind(pub String);

/// Classifies a Governance trace record.
pub struct GovernanceTraceKind(pub String);

/// Classifies a Governance outbox event.
pub struct GovernanceOutboxEventKind(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceInputKind` | 区分外部触发、周期复核、风险信号或相邻仓请求等输入类别 | 来源于 command / consumer;非空;有限变体表未闭合前不得改 enum |
| `GateKind` | 区分需要正式裁决的 gate 类别 | 来源于 `OpenGate` / context policy;非空 |
| `GovernanceDecisionKind` | 区分批准、拒绝、豁免等业务裁决类别的业务分类 | 来源于 decision command intent;不替代 `GovernanceDecisionState` |
| `GovernedSubjectKind` | 区分 process、work、artifact、runtime、capability、organization scope 等被治理对象类别 | 来源于 source resolver / command intent;不保存 subject body |
| `GovernanceSourceKind` | 区分 evidence、runtime signal、process waiting、work trigger、periodic review 等来源类别 | 来源于 source event / resolver;不保存 source body |
| `EvidenceKind` | 区分 artifact、baseline、archive、external evidence summary 等依据类别 | 来源于 artifact / evidence resolver;不替代 verified state |
| `RuntimeSignalKind` | 区分 runtime feedback、capability risk、autonomy signal 等运行信号类别 | 来源于 runtime / capability event;不保存 execution log |
| `GovernanceTraceKind` | 区分 truth change、consumer receipt、report、handoff 等追溯类别 | 来源于 trace factory input;不改变被追溯对象状态 |
| `GovernanceOutboxEventKind` | 区分 Governance outbound event payload 类别 | 来源于 `GovernanceTruthChange` 映射;不替代 event schema version |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| kind 必须非空 | 空字符串不是合法分类 |
| kind 不承载正文 | kind 只分类,不得塞入 source text、policy body、evidence body 或 event payload |
| 无变体表时使用 newtype | 若后续需要固定 enum variants,必须先回设计补正式变体表和迁移 / 兼容口径 |

##### history change kind newtypes

```rust
/// Classifies a decision history change.
pub struct DecisionChangeKind(pub String);

/// Classifies an approval responsibility history change.
pub struct ResponsibilityChangeKind(pub String);

/// Classifies a policy or shared-rule history change.
pub struct PolicyChangeKind(pub String);

/// Classifies a control history change.
pub struct ControlChangeKind(pub String);

/// Classifies a compliance conclusion history change.
pub struct ComplianceConclusionChangeKind(pub String);

/// Classifies a nonconformity history change.
pub struct NonconformityChangeKind(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `DecisionChangeKind` | decision record 变化类别 | 来源于 decision transition;非空;不替代 `GovernanceDecisionState` |
| `ResponsibilityChangeKind` | responsibility trace 变化类别 | 来源于 responsibility transition;非空 |
| `PolicyChangeKind` | policy / shared rules history 变化类别 | 来源于 policy fact / shared rule set / conflict transition;非空 |
| `ControlChangeKind` | control applicability / review history 变化类别 | 来源于 control transition;非空 |
| `ComplianceConclusionChangeKind` | AIIA / SoA conclusion history 变化类别 | 来源于 conclusion transition;非空 |
| `NonconformityChangeKind` | nonconformity corrective history 变化类别 | 来源于 nonconformity / corrective / verification transition;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| change kind 不替代 state | 当前状态仍以 truth object state enum 为准 |
| history 不修改 truth | change record 只追溯已发生变化 |
| 不自造有限变体 | HLD 未给正式变体表前,实现只能校验非空和来源闭环 |

##### reference marker helpers

```rust
/// Describes whether an evidence summary was verified by its source boundary.
pub enum EvidenceVerifiedState {
    /// The evidence summary was verified by the source boundary.
    Verified,

    /// The evidence summary is pending verification.
    Pending,

    /// The evidence summary could not be verified.
    Failed,
}

/// References any external object tracked by the Governance reference resolver.
pub struct ExternalGovernanceReferenceRef(pub ExternalSourceRef);

/// Captures when an external reference was checked by Governance.
pub struct ReferenceCheckedAt(pub Timestamp);

/// Explains why an external reference could not be resolved.
pub struct ReferenceResolutionFailureReason(pub String);

/// Explains why an external reference or snapshot became stale.
pub struct ReferenceStaleReason(pub String);

/// Explains why an external reference is invalid.
pub struct ReferenceInvalidReason(pub String);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `EvidenceVerifiedState` | evidence summary 的验证状态 | `Verified` 来源于 artifact / evidence resolver;`Pending` 用于等待验证;`Failed` 用于不可验证 |
| `ExternalGovernanceReferenceRef` | reference resolver 统一跟踪的外部引用 | 包装 `ExternalSourceRef`;不保存外部正文 |
| `ReferenceCheckedAt` | 最近检查时间 | 来源于 refresh / consumer 执行时钟;不替代 source version |
| `ReferenceResolutionFailureReason` | 无法解析原因 | 来源于 resolver / adapter;非空 |
| `ReferenceStaleReason` | 过期原因 | 来源于 source version moved、consumer event 或 refresh policy;非空 |
| `ReferenceInvalidReason` | 无效原因 | 来源于 resolver / validation / source deletion signal;非空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| evidence verification 不替代 evidence truth | 只表达本地摘要可用性,不拥有 artifact / evidence 生命周期 |
| checked-at 不作为 source version | 版本仍由 `ExternalSourceVersionRef` 表达 |
| reference reason 不保存正文 | 只保存短原因或 code-like string,不得保存 external body / log |

#### 10.16 reference state / truth snapshot / reconciliation input helper

本节闭合前面 shared refs、policy guard 和 projection factory 已引用的 helper type。它们位于 `contracts::refs` 或 `contracts::reports` 的 shared surface,可被 domain policy、query view、job report 和 reconciliation flow 使用,但不得包含完整 domain object body。

##### `ReferenceResolutionState`

```rust
/// Tracks local resolution state for an external Governance reference.
pub struct ReferenceResolutionState {
    /// External reference tracked by the resolver.
    pub reference_ref: ExternalGovernanceReferenceRef,
    /// Current local resolution status.
    pub resolution_state: ReferenceResolutionKind,
    /// Source-side version reached by the latest successful resolution.
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    /// Time when Governance last checked this reference.
    pub checked_at: ReferenceCheckedAt,
    /// Latest resolution failure reason, when resolution is not healthy.
    pub failure_reason: Option<ReferenceResolutionFailureReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reference_ref` | `ExternalGovernanceReferenceRef` | 被解析引用 | 来源于 source ref、snapshot ref 或 refresh input;不保存外部正文 |
| `resolution_state` | `ReferenceResolutionKind` | 当前解析状态 | 只能使用 §10.14 定义的状态 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 成功解析到的来源版本 | `Resolved` 必须有值;其他状态可保留上次版本或为空 |
| `checked_at` | `ReferenceCheckedAt` | 最近检查时间 | 来源于 ClockPort / consumer metadata;不替代 source version |
| `failure_reason` | `Option<ReferenceResolutionFailureReason>` | 最近失败原因 | `Unresolved` / `Invalid` / `Unavailable` 通常必须有值;不得保存外部 log body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_resolved(&self) -> bool` | 判断是否可作为已解析引用使用 | 无 | `bool` | 只读判断;要求 `resolution_state == Resolved` 且有 `source_version_ref` |
| `pub fn is_unhealthy(&self) -> bool` | 判断是否需要 degraded / refresh surface | 无 | `bool` | 对 `Unresolved`、`Stale`、`Invalid`、`Unavailable` 返回 true |
| `pub fn mark_resolved(&mut self, version: ExternalSourceVersionRef, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记解析成功 | source version、检查时间 | `Result<(), ContractError>` | 设置 `Resolved`,清空 failure reason |
| `pub fn mark_unresolved(&mut self, reason: ReferenceResolutionFailureReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记暂未解析 | failure reason、检查时间 | `Result<(), ContractError>` | 设置 `Unresolved`,保留或清空 source version 由 Step 11 persistence 口径闭合 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记来源版本过期 | stale reason、检查时间 | `Result<(), ContractError>` | 设置 `Stale`,不改外部 truth |
| `pub fn mark_invalid(&mut self, reason: ReferenceInvalidReason, checked_at: ReferenceCheckedAt) -> Result<(), ContractError>` | 标记引用无效 | invalid reason、检查时间 | `Result<(), ContractError>` | 设置 `Invalid`,不删除引用 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_reference(reference_ref: ExternalGovernanceReferenceRef, checked_at: ReferenceCheckedAt) -> Result<Self, ContractError>` | 为外部引用建立解析状态 | reference、初次检查时间 | `Result<ReferenceResolutionState, ContractError>` | consumer pending state、refresh job input |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不拥有外部 truth | 只表达 Governance 本地解析状态 |
| 不保存外部正文 | 不保存 process、work、artifact、method、runtime、observability、archive 或 external GRC body |
| unhealthy 必须可见 | query / job / reconciliation 不得把 unresolved / stale / unavailable 当成 resolved |

##### truth summary helper sets

```rust
/// Carries an ordered set of control applicability refs.
pub struct ControlApplicabilityRefSet(pub Vec<ControlApplicabilityRef>);

/// Carries an ordered set of nonconformity refs.
pub struct NonconformityRefSet(pub Vec<NonconformityRef>);

/// Carries an ordered set of compliance conclusion refs.
pub struct ComplianceConclusionRefSet(pub Vec<ComplianceConclusionRef>);

/// Carries an ordered set of outbox refs.
pub struct GovernanceOutboxRefSet(pub Vec<GovernanceOutboxRef>);

/// Carries an ordered set of derived Governance view refs.
pub struct DerivedGovernanceViewRefSet(pub Vec<DerivedGovernanceViewRef>);

/// References a Governance report without owning the report body.
pub struct GovernanceReportRef(pub ExternalSourceRef);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ControlApplicabilityRefSet` | control coverage view / control truth snapshot 的控制事实集合 | ordered unique;去重依据 `ControlApplicabilityId`;空集合表示未覆盖 |
| `NonconformityRefSet` | dashboard / reconciliation / report 中的不符合集合 | ordered unique;去重依据 `NonconformityId`;空集合表示当前 scope 无已知不符合 |
| `ComplianceConclusionRefSet` | AIIA / SoA 结论集合 | ordered unique;union branch + id 共同去重 |
| `GovernanceOutboxRefSet` | reconciliation / operations report 中引用 outbox 记录集合 | ordered unique;去重依据 `GovernanceOutboxId` |
| `DerivedGovernanceViewRefSet` | reconciliation / projection job 中引用派生视图集合 | ordered unique;去重依据 `DerivedGovernanceViewId`;空集合表示本次未检查视图 |
| `GovernanceReportRef` | derived view policy 校验报告来源 | 只引用 report identity 或 storage ref;不保存 report body |

##### truth snapshot and change helpers

```rust
/// Provides a body-free summary of Governance truth for policy and projection.
pub struct GovernanceTruthSnapshot {
    /// Scope covered by this snapshot.
    pub scope_ref: GovernanceScopeRef,
    /// Source cursor represented by this snapshot.
    pub source_cursor: GovernanceTruthCursor,
    /// Policy facts visible in the snapshot.
    pub policy_refs: PolicyEffectiveFactRefSet,
    /// Control applicability facts visible in the snapshot.
    pub control_refs: ControlApplicabilityRefSet,
    /// Compliance conclusions visible in the snapshot.
    pub conclusion_refs: ComplianceConclusionRefSet,
    /// Nonconformity records visible in the snapshot.
    pub nonconformity_refs: NonconformityRefSet,
}

/// Describes an accepted Governance truth change without embedding object bodies.
pub struct GovernanceTruthChange {
    /// Subject changed by the accepted command.
    pub subject_ref: GovernanceOutboxSubjectRef,
    /// Event kind produced for propagation.
    pub event_kind: GovernanceOutboxEventKind,
    /// Cursor after the accepted change.
    pub source_cursor: GovernanceTruthCursor,
}

/// Input used to build a reconciliation report.
pub struct GovernanceReconciliationInput {
    /// Scope being reconciled.
    pub scope_ref: GovernanceScopeRef,
    /// Cursor used as reconciliation source.
    pub source_cursor: GovernanceTruthCursor,
    /// Derived views inspected by reconciliation.
    pub view_refs: DerivedGovernanceViewRefSet,
    /// Outbox records inspected by reconciliation.
    pub outbox_refs: GovernanceOutboxRefSet,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceTruthSnapshot` | policy guard、dashboard projection 和 reconciliation 的 body-free truth 摘要 | 由 repository / query assembler 从 committed truth refs 构造;不得包含 domain object body |
| `GovernanceTruthChange` | outbox、trace、stale marker 的统一 accepted-change helper | 由 command service 在 truth save 成功进入同一 UoW 后,先用 Step 7 `GovernanceTruthChangeSubjectMapper` 映射 accepted subject refs,再调用 Step 7 `assign_truth_change_cursor()` 取得 accepted boundary cursor,最后用 `subject_refs.outbox_subject_ref` / event kind / cursor 构造;不得用于未提交变化;不携带 trace ref,避免 trace record factory 循环依赖 |
| `GovernanceReconciliationInput` | reconciliation report factory 输入 | 由 reconciliation job 从 snapshot / projection / outbox refs 构造;不修复 truth |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| snapshot 不是 read model body | 只含 ref set、scope 和 cursor,不保存 policy/control/nonconformity 正文 |
| truth change 必须来自已成立变化 | validation failure、policy denial、query、consumer pending marker 不得伪造 `GovernanceTruthChange` |
| source cursor 必须来自 accepted UoW | command path 的 `source_cursor` 只能来自同一 UoW 的 `assign_truth_change_cursor()`;一个 command 同时改变多个 truth subject 时,所有 formal `GovernanceTruthChange` 复用同一个 accepted boundary cursor |
| reconciliation input 只读 | 对账输入不得携带“修复动作”或直接修改 repository 的指令 |

#### 10.17 handoff / export marker and job report helper

本节闭合 operations job、trace handoff、archive handoff 和 external GRC export preparation 共享的 marker / report helper。HLD 已明确 handoff / export 只能保存 marker、receipt、package ref、target ref 和 failed refs,不得保存 observability ledger、archive package 或 external GRC record body。

##### handoff / export marker refs

```rust
/// Identifies a Governance handoff marker.
pub struct GovernanceHandoffMarkerId(pub String);

/// References a Governance handoff marker.
pub struct GovernanceHandoffMarkerRef {
    /// Stable handoff marker id.
    pub marker_id: GovernanceHandoffMarkerId,
}

/// References a prepared package outside Governance.
pub struct HandoffPackageRef(pub ExternalSourceRef);

/// References a handoff or export receipt outside Governance.
pub struct HandoffReceiptRef(pub ExternalSourceRef);

/// Explains why handoff or export preparation failed.
pub struct HandoffFailureReason(pub String);

/// Carries an ordered set of handoff marker refs.
pub struct GovernanceHandoffMarkerRefSet(pub Vec<GovernanceHandoffMarkerRef>);

/// Carries an ordered set of Governance report refs.
pub struct GovernanceReportRefSet(pub Vec<GovernanceReportRef>);

/// Carries an ordered set of external Governance reference refs.
pub struct ExternalGovernanceReferenceRefSet(pub Vec<ExternalGovernanceReferenceRef>);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceHandoffMarkerId` / `GovernanceHandoffMarkerRef` | trace / archive / external GRC handoff marker identity | handoff job 由 application id generator 提供;repository load 可重建 |
| `HandoffPackageRef` | archive package、observability bundle 或 external export package 引用 | 来源于 handoff / export port;不保存 package body |
| `HandoffReceiptRef` | 目标系统返回的接收回执 | 来源于 handoff / export port;不替代目标系统 truth |
| `HandoffFailureReason` | 交接或导出失败原因 | 来源于 handoff / export adapter;非空;不得保存外部错误正文或 package body |
| `GovernanceHandoffMarkerRefSet` | job report 中成功或失败 marker 集合 | ordered unique;去重依据 `GovernanceHandoffMarkerId` |
| `GovernanceReportRefSet` | job report 中的 report 引用集合 | ordered unique;去重依据 report ref |
| `ExternalGovernanceReferenceRefSet` | job report 中失败外部引用集合 | ordered unique;去重依据 `ExternalSourceRef` |

##### `GovernanceHandoffState`

```rust
/// Describes preparation and delivery state for a Governance handoff marker.
pub enum GovernanceHandoffState {
    /// The handoff package or export material was prepared.
    Prepared,

    /// The handoff package or export material was delivered to the target.
    Delivered,

    /// Handoff or export preparation failed.
    Failed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Prepared` | `The handoff package or export material was prepared.` | 已准备 package / export material | handoff / export port success before delivery | `Delivered`、`Failed` |
| `Delivered` | `The handoff package or export material was delivered to the target.` | 已交付目标系统 | delivery receipt from handoff / export port | 终态 |
| `Failed` | `Handoff or export preparation failed.` | 准备或交付失败 | adapter failure / validation failure | 可由后续新 marker 或 retry job 替代,本 marker 不原地变成功 |

##### `GovernanceHandoffMarker`

```rust
/// Records handoff or export preparation without owning external material.
pub struct GovernanceHandoffMarker {
    /// Stable marker ref.
    pub marker_ref: GovernanceHandoffMarkerRef,
    /// Source trace records included by the handoff.
    pub trace_refs: GovernanceTraceRecordRefSet,
    /// Handoff or export target.
    pub target_ref: TraceHandoffTargetRef,
    /// Current marker state.
    pub handoff_state: GovernanceHandoffState,
    /// Prepared package ref when material exists.
    pub package_ref: Option<HandoffPackageRef>,
    /// Delivery receipt when target accepted the handoff.
    pub receipt_ref: Option<HandoffReceiptRef>,
    /// Failure reason when preparation or delivery failed.
    pub failure_reason: Option<HandoffFailureReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `marker_ref` | `GovernanceHandoffMarkerRef` | marker identity | application id generator / repository load |
| `trace_refs` | `GovernanceTraceRecordRefSet` | 被交接的 trace refs | ordered unique;不保存 trace body |
| `target_ref` | `TraceHandoffTargetRef` | observability / archive / external GRC 目标 | 来源于 job input / config binding |
| `handoff_state` | `GovernanceHandoffState` | marker 状态 | 只能使用本节状态 |
| `package_ref` | `Option<HandoffPackageRef>` | 已准备材料引用 | `Prepared` / `Delivered` 通常必须有值 |
| `receipt_ref` | `Option<HandoffReceiptRef>` | 目标系统回执 | `Delivered` 必须有值 |
| `failure_reason` | `Option<HandoffFailureReason>` | 失败原因 | `Failed` 必须有值 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| marker 不保存外部正文 | 不保存 observability ledger、archive package、external GRC document 或 export body |
| marker 不反写真相 | handoff / export 成败不改变 Governance decision、policy、control、nonconformity truth |
| failed marker 可审查 | 失败必须进入 job report / operations surface,不得静默吞掉 |

##### job report helpers

```rust
/// Identifies an operations job run.
pub struct GovernanceJobRunId(pub String);

/// Carries a job idempotency key.
pub struct GovernanceJobIdempotencyKey(pub String);

/// Describes the high-level result of a Governance operations job.
pub enum GovernanceJobReportState {
    /// The job completed all requested work.
    Completed,

    /// The job completed part of the requested work.
    PartiallyCompleted,

    /// The job failed before producing the requested result.
    Failed,
}

/// Summarizes a Governance operations job result.
pub struct GovernanceJobReport {
    /// Job run id.
    pub run_id: GovernanceJobRunId,
    /// Idempotency key for duplicate replay.
    pub idempotency_key: GovernanceJobIdempotencyKey,
    /// Final report state.
    pub report_state: GovernanceJobReportState,
    /// Governance reports produced by the job.
    pub report_refs: GovernanceReportRefSet,
    /// Handoff markers produced by the job.
    pub handoff_marker_refs: GovernanceHandoffMarkerRefSet,
    /// Failed external references, when the job processes references.
    pub failed_reference_refs: ExternalGovernanceReferenceRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `run_id` | `GovernanceJobRunId` | job run identity | job metadata;非空 |
| `idempotency_key` | `GovernanceJobIdempotencyKey` | duplicate replay key | job input metadata;非空 |
| `report_state` | `GovernanceJobReportState` | job 结果状态 | completed / partial / failed |
| `report_refs` | `GovernanceReportRefSet` | 对账 / rebuild / export report 引用 | ordered unique;不保存 report body |
| `handoff_marker_refs` | `GovernanceHandoffMarkerRefSet` | handoff / export marker 集合 | ordered unique |
| `failed_reference_refs` | `ExternalGovernanceReferenceRefSet` | refresh / handoff / export 失败引用 | ordered unique;不得保存外部正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| job report 不修复 truth | report 只记录维护结果,不能批准、关闭、回滚或修复 core truth |
| duplicate replay 需要 stored report | Step 13 必须定义 stored job report surface 或明确替代 replay 口径 |
| failed refs 必须 body-free | 失败项只保存 ref / marker / reason,不得保存外部材料正文 |

#### 10.18 public query / view helper and remaining report helper

本节闭合 query response、public view、page 和 report view 可复用的 helper type。完整 `GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView` 和 `GovernanceReconciliationReportView` 对象卡片仍在 §15 展开;本节只固定 shared marker 和 page surface。

##### query read subject and markers

```rust
/// References a subject that can be checked by Governance read visibility policy.
pub struct GovernanceReadSubjectRef(pub ExternalSourceRef);

/// Explains why a Governance read response is not visible.
pub struct GovernanceVisibilityReason(pub String);

/// Explains why a Governance read response is degraded.
pub struct GovernanceDegradedReason(pub String);

/// Carries the visibility surface for a Governance query response.
pub struct GovernanceVisibilityMarker {
    /// Whether the requested subject is visible to the current actor.
    pub is_visible: bool,
    /// Optional reason when the response is not visible or redacted.
    pub reason: Option<GovernanceVisibilityReason>,
}

/// Carries freshness information for a Governance query response.
pub struct GovernanceFreshnessMarker {
    /// View freshness state observed by the query path.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Source cursor used to assemble the response.
    pub source_cursor: Option<GovernanceTruthCursor>,
}

/// Carries degraded response information without repairing state.
pub struct GovernanceDegradedMarker {
    /// Whether the response is degraded.
    pub is_degraded: bool,
    /// Optional degraded reason.
    pub reason: Option<GovernanceDegradedReason>,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceReadSubjectRef` | `ReadVisibilityPolicy.evaluate_* -> GovernanceVisibilityMarker` 的 subject 输入 | 由 query request、view ref、truth ref 或 trace subject 映射;不保存正文 |
| `GovernanceVisibilityReason` | not visible / redacted 原因 | 非空;不得泄露被隐藏对象正文或敏感存在性细节 |
| `GovernanceDegradedReason` | stale / failed / unavailable / missing trace 等降级原因 | 非空;来源于 projection、reference、trace 或 config surface |
| `GovernanceVisibilityMarker` | query response 的可见性表面 | not visible 时 view body 必须为空或按 Step 8/10 定义 redacted |
| `GovernanceFreshnessMarker` | query response 的 freshness 表面 | stale / failed / unavailable 必须显式暴露 |
| `GovernanceDegradedMarker` | query response 的 degraded 表面 | degraded 不能触发 refresh / rebuild / repair |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| marker 不写状态 | query marker 只描述读取结果,不得更新 projection、reference 或 truth |
| not visible 不泄露正文 | not visible surface 不得携带受保护 body、summary 或 evidence |
| degraded 不自动修复 | query 返回 degraded 不能启动 rebuild、refresh 或 handoff |

##### page and search helpers

```rust
/// Carries a page cursor for Governance query pagination.
pub struct GovernancePageCursor(pub String);

/// Carries page request information for Governance queries.
pub struct GovernancePageRequest {
    /// Opaque page cursor.
    pub cursor: Option<GovernancePageCursor>,
    /// Maximum number of items requested.
    pub limit: u32,
}

/// Carries page response information for Governance queries.
pub struct GovernancePageInfo {
    /// Cursor for the next page, when more data is available.
    pub next_cursor: Option<GovernancePageCursor>,
    /// Whether more data is available after this page.
    pub has_more: bool,
}

/// Classifies Governance facts returned by search.
pub struct GovernanceFactKind(pub String);

/// References a Governance fact search result without owning the fact body.
pub struct GovernanceFactSearchResultRef(pub ExternalSourceRef);
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernancePageCursor` | query page cursor | opaque;不得解析为时间、id 或 offset |
| `GovernancePageRequest` | query request page helper | `limit` 必须受 config / service guard 限制;cursor 由上一页返回 |
| `GovernancePageInfo` | query response page helper | next cursor 由 repository / projection read path 返回 |
| `GovernanceFactKind` | search result 分类 | HLD 未给有限变体,采用非空 newtype |
| `GovernanceFactSearchResultRef` | search item body-free ref | 只指向 truth / view / trace / report ref,不保存正文 |

##### view status helpers

```rust
/// Carries the public status of a nonconformity status view.
pub struct NonconformityStatusViewState(pub String);

/// Common metadata attached to public Governance views.
pub struct GovernanceViewSurface {
    /// Visibility marker for the current actor.
    pub visibility: GovernanceVisibilityMarker,
    /// Freshness marker for projection-backed responses.
    pub freshness: Option<GovernanceFreshnessMarker>,
    /// Degraded marker for partial or fallback responses.
    pub degraded: Option<GovernanceDegradedMarker>,
}

/// Public report view helper for reconciliation report responses.
pub struct GovernanceReconciliationReportViewRef {
    /// Report ref returned by the query.
    pub report_ref: GovernanceReconciliationReportRef,
    /// Shared view surface.
    pub surface: GovernanceViewSurface,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `NonconformityStatusViewState` | nonconformity status view 摘要状态 | HLD 未给有限变体,采用非空 newtype;不得替代 `NonconformityState` |
| `GovernanceViewSurface` | public view response 统一 marker | 由 query assembler 组装;只读;不写状态 |
| `GovernanceReconciliationReportViewRef` | reconciliation report query response 的轻量 view ref | 不保存 report body;完整 view DTO 留给 §15 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| view helper 不替代 view DTO | 本节只放共用 marker;完整字段在 §15 写 |
| status view state 不关闭不符合 | nonconformity 当前状态仍以 `NonconformityRecord` 为准 |
| search result ref 不保存正文 | search view 只能返回 ref、kind、surface 和后续 DTO 明确允许的 summary |

#### 10.19 shared type final audit and unresolved item table

本节对 Step 6.1 的 `contracts::refs` shared type 做收口审计。结论是:public DTO / view / event / job / report 可能引用的二级 typed id、typed ref、state、reason、marker、cursor 和 helper set 已具备可落码入口;仍未展开的内容属于下游 Step 的正式职责,不得由实现侧在 Step 6.1 私自补齐。

##### 已闭合 shared type 分组

| 分组 | 已闭合内容 | 进入后续 Step 的用法 |
|---|---|---|
| identity / context / input / gate / decision | `GovernanceContextId/Ref`、`GovernanceInputId/Ref`、`GateId/Ref`、`GovernanceDecisionId/Ref`、`GovernanceDecisionOutcomeRef` | Step 6.2 domain truth 字段、Step 8 command / result DTO、Step 9 flow subject |
| approval / responsibility | approval responsibility、approver requirement、responsibility chain、vote、threshold、delegation 和责任 reason | Step 6.2 approval object、Step 8 approval command、Step 10 responsibility state matrix |
| governed subject / source / evidence | `GovernedSubjectRef`、`GovernanceSourceRef`、`EvidenceSummaryRef`、actor / method / process / work / runtime snapshot refs | Step 7 resolver port、Step 8 external consumer DTO、Step 15 trace / audit surface |
| policy / shared rules / conflict | policy fact、shared rule set、policy conflict、scope、priority、effective-at 和 policy reason | Step 6.3 policy truth、Step 6.5 policy guard、Step 9 policy evaluation flow |
| control / compliance / nonconformity | control applicability / review、AIIA / SoA conclusion、nonconformity、corrective action、verification 和 reason / severity | Step 6.3 compliance truth、Step 8 compliance command / query、Step 10 closure state matrix |
| projection / reconciliation / trace / audit / outbox / history | derived view、reconciliation report、trace record、audit trail、outbox record、history record refs | Step 7 repository port、Step 8 event / job DTO、Step 11 persistence schema |
| public state enum | context、input、gate、decision、responsibility、policy、control、nonconformity、derived view、reference、outbox、report state | Step 10 state matrix source;implementation 不得另起状态名 |
| marker / page / report helper | visibility、freshness、degraded、page、search、handoff、job report helper | Step 8 query / job response surface、Step 13 duplicate replay、Step 15 observability report |

##### 不在 Step 6.1 自行闭合的事项

| 事项 | 当前口径 | 后续闭合位置 | 禁止事项 |
|---|---|---|---|
| `SourceDigest` 算法和格式 | 本 Step 只定义 opaque digest newtype | Step 14 adapter / config binding,必要时 Step 11 persistence | 不得在实现侧硬编码 hash 算法作为设计事实 |
| `GovernanceDecisionOutcomeRef` 完整 outcome DTO | 本 Step 只给 body-free ref | Step 8 protocol result / event payload | 不得把 outcome 正文塞入 ref |
| governance scope finite variants | HLD 未给稳定 `GovernanceScopeKind` 变体,当前使用 `GovernanceScopeRef` | Step 8 request DTO 或 Step 10 若补状态矩阵 | 不得自造 Project / Workspace / Global 等 enum |
| kind / reason 无稳定变体 | `GovernanceInputKind`、`GateKind`、`GovernanceDecisionKind`、`GovernedSubjectKind`、`GovernanceSourceKind`、`EvidenceKind`、`RuntimeSignalKind`、`GovernanceTraceKind`、`GovernanceOutboxEventKind`、`GovernanceFactKind`、history change kind 均采用非空 newtype | 若后续正式需求给出有限集合,在对应 Step 回写 enum 和迁移表 | 不得把实现偏好的分类固化成 enum |
| `NonconformityStatusViewState` | 仅为 public view 摘要状态 newtype | §15 full view DTO | 不得替代 `NonconformityState` 或驱动关闭流程 |
| `ReferenceResolutionState.mark_unresolved` 版本处理 | 本 Step 固定状态载体,不决定 retain / clear source version | Step 11 persistence / concurrency | 不得在 domain object 中私自清空或保留版本作为默认规则 |
| `DerivedGovernanceViewFreshnessState::Rebuilding` query fallback | 本 Step 只定义状态 | Step 8 query response、Step 9 query flow、Step 10 state matrix | 不得让 query 自动 rebuild 或修复 projection |
| `OutboxPublicationState::DeadLettered` recovery path | 本 Step 只定义终态 / 失败状态 | Step 12 error recovery、Step 13 retry / idempotency | 不得在 publisher 中无设计依据地重投 dead letter |
| stored job report duplicate replay | 本 Step 定义 `GovernanceJobReport` DTO helper | Step 13 idempotency result surface | 不得只靠重新运行 job 伪装 stored replay |
| full public view DTO | 本 Step 只定义 helper marker / refs | §15 contracts view / report helper object cards | 不得用 `GovernanceViewSurface` 代替具体 view body |
| event payload / command result payload | 本 Step 只提供 shared ref / state / marker 类型 | Step 8 protocol contracts | 不得在 Step 6.1 自行补 event schema |
| repository / port / optimistic version | 本 Step 不定义 trait | Step 7 ports、Step 11 persistence / transaction | 不得从 object helper 推导临时 repository 接口 |

##### 进入 6.2 的条件

| 条件 | 结论 |
|---|---|
| domain truth 可以引用 shared typed id/ref/state/reason | 已满足;Step 6.2 可直接使用 §10 shared types |
| public DTO 的二级类型不依赖 domain-only 对象 | 已满足;Step 8 后续只应引用 `contracts::refs` 或 core-contracts |
| 无稳定变体的 kind / reason 已避免自造 enum | 已满足;当前均为非空 newtype 或 opaque ref |
| 下游 Step 职责未被 Step 6.1 抢写 | 已满足;port、protocol、persistence、idempotency、full view body 均留给对应 Step |
| Step 6.2 是否可以开始 | 可以。下一批从 `GovernanceContext`、`GovernanceInput` domain object card 开始 |

### 11. `domain` context / decision / approval 对象契约

#### 11.1 domain object 写入边界

本节开始写入 `domain` truth / state object。domain object 可以引用 §10 的 `contracts::refs` shared type 和 core-contracts 的 actor / time / version 类型,但不得引用 API DTO、repository trait、adapter state 或 public view body。

| 规则 | 说明 |
|---|---|
| id 来源 | domain factory 必须显式接收 application id generator 已生成的 id;domain 不自行生成 id |
| actor 来源 | transition method 的 `ActorRef` 来自 command actor context;domain 可更新当前责任 actor 或交给 trace/history 记录,不得修改 identity truth |
| reason 来源 | transition reason 来自 command intent、policy guard 或 reference surface;无有限变体时使用 §10 newtype |
| history / trace | 本节只定义 object state 副作用;append history、trace、audit、outbox 由后续 trace / outbox object 和 Step 9 flow 串联 |
| 错误类型 | 函数签名暂用 `DomainError`;具体 variant、错误恢复和 API 映射留给 Step 12 |

#### 11.2 `GovernanceContext`

```rust
/// Owns the local Governance context truth for a governed subject and source.
pub struct GovernanceContext {
    /// Stable context id generated by the application layer.
    pub context_id: GovernanceContextId,
    /// Actor that created or most recently transitioned the context.
    pub actor_ref: ActorRef,
    /// External subject governed by this context.
    pub subject_ref: GovernedSubjectRef,
    /// Current readiness state of the context.
    pub context_state: GovernanceContextState,
    /// External source that triggered or supports the context.
    pub source_ref: GovernanceSourceRef,
    /// Pending external reference state when the context waits for resolution.
    pub pending_reference_state: Option<ReferenceResolutionState>,
    /// Reason captured when the context is invalidated.
    pub invalid_reason: Option<GovernanceContextInvalidReason>,
    /// Reason captured when the context is closed.
    pub close_reason: Option<GovernanceContextCloseReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_id` | `GovernanceContextId` | context truth 主键 | `CreateGovernanceContext` flow 从 application id generator 取得;repository load 可重建 |
| `actor_ref` | `ActorRef` | 创建或最近一次状态迁移 actor | command actor context;本仓不修改 actor identity truth |
| `subject_ref` | `GovernedSubjectRef` | 被治理对象引用 | command / consumer / resolver 提供;不得保存外部 subject body |
| `context_state` | `GovernanceContextState` | context readiness state | 初始为 `Draft`;只能按 Step 9 允许迁移更新 |
| `source_ref` | `GovernanceSourceRef` | 触发来源或依据来源引用 | command request、event envelope 或 resolver summary;不得保存来源正文 |
| `pending_reference_state` | `Option<ReferenceResolutionState>` | `PendingReference` 时保留未解析引用状态 | `mark_pending_reference(...)` 写入;`mark_ready(...)` 清空 |
| `invalid_reason` | `Option<GovernanceContextInvalidReason>` | `Invalid` 终态原因 | `invalidate(...)` 写入;其他状态必须为空 |
| `close_reason` | `Option<GovernanceContextCloseReason>` | `Closed` 终态原因 | `close(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceContextRef` | 生成 context ref | 无 | `GovernanceContextRef` | 纯函数;只复制 `context_id` |
| `pub fn is_ready_for_decision(&self) -> bool` | 判断是否可进入 Gate / Decision / Control / Compliance 主线 | 无 | `bool` | 只有 `Ready` 返回 true |
| `pub fn mark_ready(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 标记 context 已具备可裁决条件 | transition actor | `Result<(), DomainError>` | 允许 `Draft` / `PendingReference -> Ready`;更新 `actor_ref`;清空 pending / terminal reason |
| `pub fn mark_pending_reference(&mut self, reference_state: ReferenceResolutionState) -> Result<(), DomainError>` | 因外部引用未解析进入等待 | unresolved / stale / unavailable reference state | `Result<(), DomainError>` | 允许 `Draft` / `Ready -> PendingReference`;写入 `pending_reference_state` |
| `pub fn invalidate(&mut self, reason: GovernanceContextInvalidReason, actor: ActorRef) -> Result<(), DomainError>` | 标记 context 不再合法 | invalid reason、transition actor | `Result<(), DomainError>` | 允许 `Draft` / `Ready` / `PendingReference -> Invalid`;写入 `invalid_reason`;终态不可再迁移 |
| `pub fn close(&mut self, reason: GovernanceContextCloseReason, actor: ActorRef) -> Result<(), DomainError>` | 关闭不再需要的 context | close reason、transition actor | `Result<(), DomainError>` | 允许 `Ready` / `PendingReference -> Closed`;写入 `close_reason`;终态不可再接收新裁决 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_subject(context_id: GovernanceContextId, subject_ref: GovernedSubjectRef, source_ref: GovernanceSourceRef, actor: ActorRef) -> Result<Self, DomainError>` | 从被治理对象和来源引用创建 context | application generated id、subject、source、actor | `Result<GovernanceContext, DomainError>` | `CreateGovernanceContext`;初始 state 必须是 `Draft` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| Ready 是主线前置 | Gate、Decision、Control、Compliance、Nonconformity 主 command 必须要求 context `Ready` |
| PendingReference 不可绕过 | `PendingReference` 不得直接进入正式裁决;必须先通过 refresh / evidence 补齐后 `mark_ready` |
| Invalid / Closed 为终态 | 终态 context 不得重新打开;需要新语境时创建新 `GovernanceContext` |
| 不拥有外部 truth | 只保存 `subject_ref` / `source_ref` / reference state,不复制 process、work、artifact、runtime 或 GRC 正文 |
| reason 与 trace 分工 | object 保存当前终态 reason;完整 actor / time / command trace 由 trace/history object 记录 |

#### 11.3 `GovernanceInput`

```rust
/// Owns the local Governance input truth before it becomes formal decision work.
pub struct GovernanceInput {
    /// Stable input id generated by the application layer.
    pub input_id: GovernanceInputId,
    /// Actor that received or most recently transitioned this input.
    pub actor_ref: ActorRef,
    /// Context that owns this input.
    pub context_ref: GovernanceContextRef,
    /// Kind of input received by Governance.
    pub input_kind: GovernanceInputKind,
    /// Current input readiness state.
    pub input_state: GovernanceInputState,
    /// Source that produced the input.
    pub source_ref: GovernanceSourceRef,
    /// Evidence summary required before the input can be accepted.
    pub pending_evidence_ref: Option<EvidenceSummaryRef>,
    /// Reason captured when the input is rejected.
    pub reject_reason: Option<GovernanceInputRejectReason>,
    /// Later input that superseded this input.
    pub superseded_by: Option<GovernanceInputRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `input_id` | `GovernanceInputId` | input truth 主键 | `SubmitGovernanceInput` flow 从 application id generator 取得;repository load 可重建 |
| `actor_ref` | `ActorRef` | 接收或最近一次状态迁移 actor surface | command actor context / operation context;本仓不修改 actor identity truth;完整 command trace 仍由 trace/history 记录 |
| `context_ref` | `GovernanceContextRef` | 所属 governance context | request 指定或从 loaded context 派生;必须指向已存在 context |
| `input_kind` | `GovernanceInputKind` | 输入类别 | HLD 未给有限变体,使用 non-empty newtype;来源于 command intent / consumer marker |
| `input_state` | `GovernanceInputState` | input readiness state | 初始为 `Received`;只能按 Step 9 允许迁移更新 |
| `source_ref` | `GovernanceSourceRef` | 输入来源引用 | command request、event envelope 或 resolver summary;不得保存 source body |
| `pending_evidence_ref` | `Option<EvidenceSummaryRef>` | 等待补齐的依据摘要引用 | `wait_for_evidence(...)` 写入;`accept(...)` 清空 |
| `reject_reason` | `Option<GovernanceInputRejectReason>` | `Rejected` 终态原因 | `reject(...)` 写入;其他状态必须为空 |
| `superseded_by` | `Option<GovernanceInputRef>` | 替代本输入的后续 input | `supersede(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceInputRef` | 生成 input ref | 无 | `GovernanceInputRef` | 纯函数;只复制 `input_id` |
| `pub fn is_accepted(&self) -> bool` | 判断输入是否可作为正式治理处理线索 | 无 | `bool` | 只有 `Accepted` 返回 true;不自动创建 Gate / Decision |
| `pub fn accept(&mut self, context: &GovernanceContext, actor: ActorRef) -> Result<(), DomainError>` | 接受输入进入正式治理处理 | loaded context、transition actor | `Result<(), DomainError>` | 允许 `Received` / `PendingEvidence -> Accepted`;要求 `context.to_ref() == self.context_ref` 且 context `Ready`;更新 `actor_ref`;清空 pending evidence |
| `pub fn reject(&mut self, reason: GovernanceInputRejectReason, actor: ActorRef) -> Result<(), DomainError>` | 拒绝不具备治理意义的输入 | reject reason、transition actor | `Result<(), DomainError>` | 允许 `Received -> Rejected`;更新 `actor_ref`;写入 `reject_reason`;终态不可再接受 |
| `pub fn wait_for_evidence(&mut self, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 因依据未闭合进入等待 | pending evidence summary ref、transition actor | `Result<(), DomainError>` | 允许 `Received` / `Accepted -> PendingEvidence`;更新 `actor_ref`;写入 `pending_evidence_ref` |
| `pub fn supersede(&mut self, next_input_ref: GovernanceInputRef, actor: ActorRef) -> Result<(), DomainError>` | 被后续输入替代 | next input ref、transition actor | `Result<(), DomainError>` | 允许 `Received` / `Accepted` / `PendingEvidence -> Superseded`;更新 `actor_ref`;`next_input_ref` 不得等于自身 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn receive(input_id: GovernanceInputId, input_kind: GovernanceInputKind, source_ref: GovernanceSourceRef, context_ref: GovernanceContextRef, actor: ActorRef) -> Result<Self, DomainError>` | 从正式来源引用接收 input | application generated id、kind、source、context ref、receive actor | `Result<GovernanceInput, DomainError>` | `SubmitGovernanceInput`;初始 state 必须是 `Received`;写入 `actor_ref` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| input 不等于 decision | `Accepted` 只说明输入成立,不得自动生成 `Gate`、`GovernanceDecision` 或 approval |
| input 必须绑定 context | accept 时必须验证 loaded context ref 与 input context ref 一致,且 context 为 `Ready` |
| actor surface 必须来自 command context | `actor_ref` 只记录接收或最近一次 input transition actor;不得保存 actor profile 正文;完整 actor/time/command trace 由 trace/history 记录 |
| PendingEvidence 必须有依据 ref | `PendingEvidence` 状态必须保存 `pending_evidence_ref`;accepted 后必须清空 |
| Rejected / Superseded 为终态 | rejected / superseded input 不得再进入 accepted 或 pending evidence |
| 不保存 source / evidence body | input 只能保存 source ref、evidence summary ref 和 state,不得保存外部正文 |

#### 11.4 `Gate`

```rust
/// Owns a Governance decision gate for a ready context.
pub struct Gate {
    /// Stable gate id generated by the application layer.
    pub gate_id: GateId,
    /// Governance context that owns the gate.
    pub context_ref: GovernanceContextRef,
    /// Business kind of the gate.
    pub gate_kind: GateKind,
    /// Current gate lifecycle state.
    pub gate_state: GateState,
    /// Responsibility required before a formal decision can be attached.
    pub required_responsibility_ref: Option<ApprovalResponsibilityRef>,
    /// Decision attached to this gate after formal decision recording.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Reason captured when the gate expires.
    pub expire_reason: Option<GateExpireReason>,
    /// Reason captured when the gate is cancelled.
    pub cancel_reason: Option<GateCancelReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gate_id` | `GateId` | gate truth 主键 | `OpenGovernanceGate` flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属 governance context | 从 loaded `GovernanceContext` 派生;context 必须 `Ready` |
| `gate_kind` | `GateKind` | Gate 业务类别 | HLD 未给有限变体,使用 non-empty newtype;来源于 command intent |
| `gate_state` | `GateState` | gate lifecycle state | 初始为 `Open`;只能按 Step 9 允许迁移更新 |
| `required_responsibility_ref` | `Option<ApprovalResponsibilityRef>` | 进入 pending decision 所需责任 | 03-b/03-c responsibility binding path 写入;commit-03-a 只需保留字段和 `None` 初始值;不保存 responsibility body |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 已附加的正式 decision | `attach_decision(...)` 写入;`Decided` 必须有值 |
| `expire_reason` | `Option<GateExpireReason>` | `Expired` 终态原因 | `expire(...)` 写入;其他状态必须为空 |
| `cancel_reason` | `Option<GateCancelReason>` | `Cancelled` 终态原因 | `cancel(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GateRef` | 生成 gate ref | 无 | `GateRef` | 纯函数;只复制 `gate_id` |
| `pub fn is_waiting_for_decision(&self) -> bool` | 判断 gate 是否处于待裁决状态 | 无 | `bool` | 只有 `PendingDecision` 返回 true |
| `pub fn request_decision_by_ref(&mut self, responsibility_ref: ApprovalResponsibilityRef, responsibility_context_ref: GovernanceContextRef, actor: ActorRef) -> Result<(), DomainError>` | 进入待裁决状态并绑定责任 ref | responsibility ref、responsibility context ref、transition actor | `Result<(), DomainError>` | 允许 `Open -> PendingDecision`;要求 `responsibility_context_ref == self.context_ref`;写入 `required_responsibility_ref`;不读取 `ApprovalResponsibility` body |
| `pub fn attach_decision(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 关联正式裁决并关闭等待 | loaded decision、transition actor | `Result<(), DomainError>` | 允许 `PendingDecision -> Decided`;要求 decision gate ref 等于 self ref;写入 `decision_ref` |
| `pub fn expire(&mut self, reason: GateExpireReason) -> Result<(), DomainError>` | 标记 Gate 过期 | expire reason | `Result<(), DomainError>` | 允许 `Open` / `PendingDecision -> Expired`;写入 `expire_reason`;终态不可再裁决 |
| `pub fn cancel(&mut self, reason: GateCancelReason, actor: ActorRef) -> Result<(), DomainError>` | 取消不再适用的 Gate | cancel reason、transition actor | `Result<(), DomainError>` | 允许 `Open` / `PendingDecision -> Cancelled`;写入 `cancel_reason`;终态不可再裁决 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gate_id: GateId, context: &GovernanceContext, gate_kind: GateKind, actor: ActorRef) -> Result<Self, DomainError>` | 从 ready context 打开 gate | application generated id、loaded context、kind、actor | `Result<Gate, DomainError>` | `OpenGovernanceGate`;初始 state 必须是 `Open` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 只能从 ready context 打开 | context 非 `Ready` 时不得创建 Gate |
| Gate 不等同 process waiting gate | process waiting 只能引用 `GateRef` / `GovernanceDecisionRef`,不能替代 Gate truth |
| Decided 必须有 decision ref | `Decided` 状态没有 `decision_ref` 属于非法重建 |
| Expired / Cancelled 为终态 | 终态 gate 不得 attach decision;需要新裁决入口时创建新 Gate |
| 不由 UI 显化替代 | conversation card、dashboard item 或 external ticket 不能形成 Gate truth |
| commit-03-a 不依赖 approval object | commit-03-a 只能实现 Gate 本地状态和 ref-only transition;`ApprovalResponsibility` / `ResponsibilityChain` 的创建、加载和策略校验从 commit-03-b/03-c 开始 |

#### 11.5 `GovernanceDecision`

```rust
/// Owns a formal Governance decision and its current lifecycle state.
pub struct GovernanceDecision {
    /// Stable decision id generated by the application layer.
    pub decision_id: GovernanceDecisionId,
    /// Gate that this decision belongs to.
    pub gate_ref: GateRef,
    /// Business kind of the decision.
    pub decision_kind: GovernanceDecisionKind,
    /// Current decision lifecycle state.
    pub decision_state: GovernanceDecisionState,
    /// Outcome reference for approved, rejected, or waived decisions.
    pub outcome_ref: GovernanceDecisionOutcomeRef,
    /// Evidence basis used by the latest finalized outcome.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Reason captured when the decision is rejected.
    pub reject_reason: Option<GovernanceRejectReason>,
    /// Reason captured when the decision is waived.
    pub waive_reason: Option<GovernanceWaiveReason>,
    /// Later decision that superseded this decision.
    pub superseded_by: Option<GovernanceDecisionRef>,
    /// Reason captured when the decision is revoked.
    pub revoke_reason: Option<GovernanceRevokeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `decision_id` | `GovernanceDecisionId` | decision truth 主键 | `RecordGovernanceDecision` flow 从 application id generator 取得;repository load 可重建 |
| `gate_ref` | `GateRef` | 对应 Gate | 从 loaded gate 派生;gate 必须 `PendingDecision` 或后续 Step 9 明确允许 proposal timing |
| `decision_kind` | `GovernanceDecisionKind` | 裁决业务类别 | HLD 未给有限变体,使用 non-empty newtype;来源于 command intent |
| `decision_state` | `GovernanceDecisionState` | decision lifecycle state | 初始为 `Proposed`;只能按 Step 9 允许迁移更新 |
| `outcome_ref` | `GovernanceDecisionOutcomeRef` | 裁决结果引用 | 来源于 command outcome intent 或 persisted outcome summary;不保存 outcome body |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 批准 / 拒绝 / 豁免依据 | `approve(...)` 必填写入;reject / waive 可按 command basis 写入,完整 DTO 由 Step 8 闭合 |
| `reject_reason` | `Option<GovernanceRejectReason>` | `Rejected` 终态原因 | `reject(...)` 写入;其他状态必须为空 |
| `waive_reason` | `Option<GovernanceWaiveReason>` | `Waived` 终态原因 | `waive(...)` 写入;其他状态必须为空 |
| `superseded_by` | `Option<GovernanceDecisionRef>` | 替代本裁决的后续 decision | `supersede(...)` 写入;其他状态必须为空 |
| `revoke_reason` | `Option<GovernanceRevokeReason>` | `Revoked` 终态原因 | `revoke(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceDecisionRef` | 生成 decision ref | 无 | `GovernanceDecisionRef` | 纯函数;只复制 `decision_id` |
| `pub fn is_finalized(&self) -> bool` | 判断 decision 是否已有正式 outcome | 无 | `bool` | `Approved` / `Rejected` / `Waived` 返回 true |
| `pub fn approve(&mut self, basis_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 基于依据形成批准结论 | evidence basis、transition actor | `Result<(), DomainError>` | 允许 `Proposed -> Approved`;写入 `basis_ref`;不得创建 downstream work |
| `pub fn reject(&mut self, reason: GovernanceRejectReason, basis_ref: Option<EvidenceSummaryRef>, actor: ActorRef) -> Result<(), DomainError>` | 形成拒绝结论 | reject reason、optional evidence basis、transition actor | `Result<(), DomainError>` | 允许 `Proposed -> Rejected`;写入 `reject_reason`;若 `basis_ref` 为 `Some` 则写入 decision `basis_ref`;不得删除 Gate |
| `pub fn waive(&mut self, reason: GovernanceWaiveReason, basis_ref: Option<EvidenceSummaryRef>, actor: ActorRef) -> Result<(), DomainError>` | 形成可追溯豁免结论 | waive reason、optional evidence basis、transition actor | `Result<(), DomainError>` | 允许 `Proposed -> Waived`;写入 `waive_reason`;若 `basis_ref` 为 `Some` 则写入 decision `basis_ref`;豁免必须可追溯 |
| `pub fn supersede(&mut self, next_decision_ref: GovernanceDecisionRef, actor: ActorRef) -> Result<(), DomainError>` | 被后续裁决替代 | next decision ref、transition actor | `Result<(), DomainError>` | 允许 `Approved` / `Rejected` / `Waived -> Superseded`;next ref 不得等于自身 |
| `pub fn revoke(&mut self, reason: GovernanceRevokeReason, actor: ActorRef) -> Result<(), DomainError>` | 撤销错误或不再适用的裁决 | revoke reason、transition actor | `Result<(), DomainError>` | 允许 `Approved` / `Rejected` / `Waived -> Revoked`;写入 `revoke_reason` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn propose(decision_id: GovernanceDecisionId, gate: &Gate, decision_kind: GovernanceDecisionKind, outcome_ref: GovernanceDecisionOutcomeRef, actor: ActorRef) -> Result<Self, DomainError>` | 从 gate 形成待裁决对象 | application generated id、loaded gate、kind、outcome ref、actor | `Result<GovernanceDecision, DomainError>` | `RecordGovernanceDecision`;初始 state 必须是 `Proposed` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| decision 不能原地改写历史 | 纠错必须通过 `supersede` 或 `revoke`,并由 `DecisionRecord` 记录 |
| proposed 不是结果 | `Proposed` 不能被下游当作批准、拒绝或豁免事实 |
| finalized 后只能 supersede / revoke | `Approved` / `Rejected` / `Waived` 不得回到 `Proposed` 或切换到另一 final outcome |
| outcome ref 不保存正文 | 完整 outcome DTO 属于 Step 8;decision truth 只保存 `GovernanceDecisionOutcomeRef` |
| vote 不等于 decision | `GovernanceVote::Approve` 只满足责任条件,不自动形成 `GovernanceDecisionState::Approved` |

#### 11.6 `ApprovalResponsibility`

```rust
/// Owns one Governance approval responsibility within a context.
pub struct ApprovalResponsibility {
    /// Stable responsibility id generated by the application layer.
    pub responsibility_id: ApprovalResponsibilityId,
    /// Governance context that owns the responsibility.
    pub context_ref: GovernanceContextRef,
    /// Actor currently assigned to the responsibility.
    pub actor_ref: Option<ActorRef>,
    /// Requirement this responsibility must satisfy.
    pub requirement_ref: ApproverRequirementRef,
    /// Current responsibility lifecycle state.
    pub responsibility_state: ApprovalResponsibilityState,
    /// Vote recorded by the assigned actor.
    pub vote: Option<GovernanceVote>,
    /// Actor delegated to when the responsibility is delegated.
    pub delegate_ref: Option<ActorRef>,
    /// Reason captured when the responsibility is delegated.
    pub delegation_reason: Option<DelegationReason>,
    /// Reason captured when the responsibility is released.
    pub release_reason: Option<ResponsibilityReleaseReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `responsibility_id` | `ApprovalResponsibilityId` | responsibility truth 主键 | assign / require flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属 governance context | 从 loaded `GovernanceContext` 派生;context 必须 `Ready` |
| `actor_ref` | `Option<ActorRef>` | 当前承担责任的 actor | `Required` 必须为 `None`;`assign(...)` 后为 `Some(snapshot.actor_ref)` |
| `requirement_ref` | `ApproverRequirementRef` | 审批要求引用 | 从 loaded `ApproverRequirement` 派生;不复制 role / capability body |
| `responsibility_state` | `ApprovalResponsibilityState` | responsibility lifecycle state | 初始为 `Required`;只能按 Step 9 允许迁移更新 |
| `vote` | `Option<GovernanceVote>` | 已记录投票 | `record_vote(...)` 写入;`Voted` 必须有值 |
| `delegate_ref` | `Option<ActorRef>` | 被委托 actor | `delegate_to(...)` 写入;`Delegated` 必须有值 |
| `delegation_reason` | `Option<DelegationReason>` | 委托原因 | `delegate_to(...)` 写入;其他状态必须为空 |
| `release_reason` | `Option<ResponsibilityReleaseReason>` | 释放原因 | `release(...)` 写入;`Released` 必须有值 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ApprovalResponsibilityRef` | 生成 responsibility ref | 无 | `ApprovalResponsibilityRef` | 纯函数;只复制 `responsibility_id` |
| `pub fn is_voted_approve(&self) -> bool` | 判断是否记录 approve vote | 无 | `bool` | 只有 `Voted` 且 vote 为 approve 返回 true |
| `pub fn assign(&mut self, snapshot: ActorCapabilitySnapshot, assigned_by: ActorRef) -> Result<(), DomainError>` | 绑定可承担 actor | capability snapshot、分配 actor | `Result<(), DomainError>` | 允许 `Required -> Assigned`;要求 snapshot resolved 且满足 requirement 的校验由 policy / service 完成;写入 `actor_ref` |
| `pub fn accept(&mut self, actor: ActorRef) -> Result<(), DomainError>` | actor 接受责任 | actor | `Result<(), DomainError>` | 允许 `Assigned -> Accepted`;actor 必须等于 `actor_ref` |
| `pub fn record_vote(&mut self, vote: GovernanceVote, actor: ActorRef) -> Result<(), DomainError>` | 记录审批或投票结果 | vote、actor | `Result<(), DomainError>` | 允许 `Assigned` / `Accepted -> Voted`;actor 必须等于 `actor_ref`;写入 `vote` |
| `pub fn delegate_to(&mut self, delegate_ref: ActorRef, reason: DelegationReason, actor: ActorRef) -> Result<(), DomainError>` | 委托给替代 actor | delegate、reason、actor | `Result<(), DomainError>` | 允许 `Assigned` / `Accepted -> Delegated`;actor 必须等于 `actor_ref`;写入 delegate 和 reason |
| `pub fn release(&mut self, reason: ResponsibilityReleaseReason, actor: ActorRef) -> Result<(), DomainError>` | 释放责任 | release reason、actor | `Result<(), DomainError>` | 允许 `Required` / `Assigned` / `Accepted` / `Delegated -> Released`;写入 release reason |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn require(responsibility_id: ApprovalResponsibilityId, context: &GovernanceContext, requirement: &ApproverRequirement) -> Result<Self, DomainError>` | 从 governance context 和 approver requirement 创建责任 | application generated id、loaded context、loaded requirement | `Result<ApprovalResponsibility, DomainError>` | `AssignApprovalResponsibility`;初始 state 必须是 `Required` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| Required 尚未绑定 actor | HLD 骨架的 `actor_ref` 在可落码契约中收口为 `Option<ActorRef>`,防止 factory 无 actor 来源 |
| vote 不形成 decision | `GovernanceVote::Approve` 不等于 `GovernanceDecisionState::Approved` |
| 本仓不拥有 identity truth | actor、role、capability 只通过 ref / snapshot 判断,不保存 profile / credential / platform auth |
| 委托不得绕过 requirement | delegation rule 和 capability 校验由 policy / service 先行完成,domain 只执行已获准迁移 |
| Released 为终态 | 释放后的 responsibility 不得重新 assign、vote 或 delegate |

#### 11.7 `ApproverRequirement`

```rust
/// Describes the role, capability, threshold, and delegation requirement for Governance approval.
pub struct ApproverRequirement {
    /// Stable requirement id generated by the application layer.
    pub requirement_id: ApproverRequirementId,
    /// Optional role required to approve.
    pub required_role_ref: Option<RoleRef>,
    /// Capabilities required to approve.
    pub required_capability_refs: CapabilityRefSet,
    /// Approval threshold required by the policy or command.
    pub approval_threshold: ApprovalThreshold,
    /// Delegation rule for responsibilities created from this requirement.
    pub delegation_rule: DelegationRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `requirement_id` | `ApproverRequirementId` | requirement identity | policy / shared rules evaluation 或 command intent 从 application id generator 取得 |
| `required_role_ref` | `Option<RoleRef>` | 所需角色 | 来源于 identity / policy summary ref;不保存 role definition body |
| `required_capability_refs` | `CapabilityRefSet` | 所需能力集合 | ordered unique;来源于 capability / policy summary;不保存 capability definition |
| `approval_threshold` | `ApprovalThreshold` | 满足裁决前置所需投票数量 | 来源于 policy fact、shared rules 或 command intent;不得削弱 hard rule |
| `delegation_rule` | `DelegationRule` | 委托规则 | 来源于 policy fact、shared rules 或 explicit command intent |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ApproverRequirementRef` | 生成 requirement ref | 无 | `ApproverRequirementRef` | 纯函数;只复制 `requirement_id` |
| `pub fn matches(&self, snapshot: &ActorCapabilitySnapshot) -> bool` | 判断 actor snapshot 是否满足要求 | actor capability snapshot | `bool` | 只读判断;需要 snapshot resolved;不读取 identity truth |
| `pub fn allows_delegation(&self, delegate_ref: ActorRef) -> bool` | 判断是否允许委托给目标 actor | delegate actor ref | `bool` | 只解释 `DelegationRule`;capability 仍需 policy / service 校验 |
| `pub fn requires_human_review(&self) -> bool` | 判断是否必须人工裁决 | 无 | `bool` | 根据 role / capability / threshold / delegation rule 纯计算 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_policy(requirement_id: ApproverRequirementId, policy_fact: &PolicyEffectiveFact, context: &GovernanceContext) -> Result<Self, DomainError>` | 从已生效 policy 和 governance context 形成审批要求 | application generated id、effective policy fact、context | `Result<ApproverRequirement, DomainError>` | policy-driven decision / gate flow;`PolicyEffectiveFact` 字段在 §12 闭合 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| requirement 不表达生命周期 | 生命周期由 responsibility / chain state 表达;requirement 自身是 value object |
| 不保存 role / capability body | 只保存 `RoleRef` / `CapabilityRefSet` |
| 不降低 shared rules | command intent 不得用更宽松 requirement 覆盖组织级规则 |
| threshold 必须可计算 | `AtLeast(n)` 的 n 必须大于 0;超过 responsibility 数量时应导致 chain blocked surface |

#### 11.8 `ResponsibilityChain`

```rust
/// Owns a set of Governance approval responsibilities for one context.
pub struct ResponsibilityChain {
    /// Stable chain id generated by the application layer.
    pub chain_id: ResponsibilityChainId,
    /// Governance context that owns the chain.
    pub context_ref: GovernanceContextRef,
    /// Ordered responsibility refs in the chain.
    pub responsibility_refs: ApprovalResponsibilityRefSet,
    /// Current chain lifecycle state.
    pub chain_state: ResponsibilityChainState,
    /// Reason captured when the chain is escalated.
    pub escalation_reason: Option<EscalationReason>,
    /// Reason captured when the chain is blocked.
    pub block_reason: Option<ResponsibilityBlockReason>,
    /// Reason captured when the chain is closed.
    pub close_reason: Option<ResponsibilityCloseReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `chain_id` | `ResponsibilityChainId` | chain truth 主键 | start chain flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属 governance context | 从 loaded context 派生;context 必须 `Ready` |
| `responsibility_refs` | `ApprovalResponsibilityRefSet` | 链上 responsibility refs | ordered unique;由 `append(...)` 写入;不得保存 responsibility body |
| `chain_state` | `ResponsibilityChainState` | chain lifecycle state | 初始为 `Open`;只能按 Step 9 允许迁移更新 |
| `escalation_reason` | `Option<EscalationReason>` | `Escalated` 原因 | `escalate(...)` 写入;其他状态必须为空 |
| `block_reason` | `Option<ResponsibilityBlockReason>` | `Blocked` 原因 | `block(...)` 写入;其他状态必须为空 |
| `close_reason` | `Option<ResponsibilityCloseReason>` | `Closed` 原因 | `close(...)` 写入;`Closed` 必须有值 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ResponsibilityChainRef` | 生成 chain ref | 无 | `ResponsibilityChainRef` | 纯函数;只复制 `chain_id` |
| `pub fn append(&mut self, responsibility: &ApprovalResponsibility) -> Result<(), DomainError>` | 加入新的责任节点 | loaded responsibility | `Result<(), DomainError>` | 只允许 `Open`;要求 responsibility context 与 chain context 一致;按 responsibility id 去重 |
| `pub fn mark_satisfied(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 标记责任链已满足裁决要求 | transition actor | `Result<(), DomainError>` | 允许 `Open -> Satisfied`;不自动形成 decision |
| `pub fn escalate(&mut self, reason: EscalationReason, actor: ActorRef) -> Result<(), DomainError>` | 升级责任链 | reason、actor | `Result<(), DomainError>` | 允许 `Open -> Escalated`;写入 escalation reason |
| `pub fn block(&mut self, reason: ResponsibilityBlockReason) -> Result<(), DomainError>` | 标记责任链无法满足 | block reason | `Result<(), DomainError>` | 允许 `Open` / `Escalated -> Blocked`;写入 block reason |
| `pub fn close(&mut self, reason: ResponsibilityCloseReason, actor: ActorRef) -> Result<(), DomainError>` | 关闭责任链 | close reason、actor | `Result<(), DomainError>` | 允许 `Satisfied` / `Blocked` / `Escalated -> Closed`;写入 close reason |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start_for_context(chain_id: ResponsibilityChainId, context: &GovernanceContext, requirement: &ApproverRequirement) -> Result<Self, DomainError>` | 为 governance context 建立初始责任链 | application generated id、loaded context、initial requirement | `Result<ResponsibilityChain, DomainError>` | approval coordination flow;初始 state 必须是 `Open`;初始 responsibility 由 service 另行创建并 append |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| chain 不替代 decision | `Satisfied` 只说明责任条件满足,不自动批准或拒绝 |
| chain 不拥有 responsibility body | 只保存 ordered refs;truth body 由 `ApprovalResponsibility` repository 读取 |
| Open 才能 append | closed / blocked / satisfied / escalated 后是否新增责任必须通过新 chain 或后续设计明确 |
| Blocked 必须可解释 | blocked reason 必须指向 capability missing、threshold impossible、policy conflict 等 formal surface |
| 不接管 identity 生命周期 | actor / role / capability 生命周期仍归 identity / capability boundary |

### 12. `domain` policy / compliance / corrective 对象契约

#### 12.1 policy / compliance object 写入边界

本节写入 policy、shared rules、conflict、control、compliance、nonconformity、corrective 和 verification 相关 domain truth。`PolicyEffectiveFact` 是 Governance-owned effective fact,不是 method-library policy definition body;`SharedRuleSet` 是 Governance-owned hard constraint set,不是 organization standard body。

| 规则 | 说明 |
|---|---|
| external definition | method policy / control definition 只能通过 snapshot/ref/digest 进入,不得保存正文 |
| scope / priority | scope、priority、shared rules 只表达 Governance 决策边界,不接管 organization / project / method truth |
| conflict handling | conflict record 记录冲突和处理结论,不得直接改写 policy fact 或 shared rules |
| actor / reason | actor 来自 command context;reason 来自 command intent、policy guard 或 conflict detection surface |
| error type | 对象方法继续使用 `DomainError`;具体 variant、API 映射和恢复口径留给 Step 12 |

#### 12.2 `PolicyEffectiveFact`

```rust
/// Owns a Governance effective policy fact derived from a method policy snapshot.
pub struct PolicyEffectiveFact {
    /// Stable policy fact id generated by the application layer.
    pub policy_fact_id: PolicyEffectiveFactId,
    /// Method-library policy definition reference.
    pub policy_definition_ref: MethodPolicyRef,
    /// Method policy snapshot used to derive this fact.
    pub policy_snapshot_ref: MethodPolicySnapshot,
    /// Governance scope where the policy fact applies.
    pub scope_ref: GovernanceScopeRef,
    /// Policy precedence inside comparable scopes.
    pub priority: PolicyPriority,
    /// Current lifecycle state of the policy fact.
    pub policy_state: PolicyEffectiveState,
    /// Later policy fact that superseded this fact.
    pub superseded_by: Option<PolicyEffectiveFactRef>,
    /// Reason captured when the policy fact is suspended.
    pub suspend_reason: Option<PolicySuspendReason>,
    /// Reason captured when the policy fact is retired.
    pub retire_reason: Option<PolicyRetireReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `policy_fact_id` | `PolicyEffectiveFactId` | policy fact truth 主键 | activate / propose flow 从 application id generator 取得;repository load 可重建 |
| `policy_definition_ref` | `MethodPolicyRef` | 来源 method policy 定义引用 | 从 `MethodPolicySnapshot.policy_ref` 派生;不得保存 AIPolicyDef body |
| `policy_snapshot_ref` | `MethodPolicySnapshot` | 生效所依据的 body-free snapshot | `propose(...)` / `activate(...)` 接收;必须是 resolved / acceptable snapshot |
| `scope_ref` | `GovernanceScopeRef` | policy 生效范围 | command intent、context subject 或 resolver summary;不得保存 scope body |
| `priority` | `PolicyPriority` | 冲突 / 覆盖判断优先级 | command intent、method summary 或 shared rule default;不得绕过 shared rules |
| `policy_state` | `PolicyEffectiveState` | policy fact lifecycle state | 初始为 `Proposed`;只能按 Step 9 允许迁移更新 |
| `superseded_by` | `Option<PolicyEffectiveFactRef>` | 后续替代事实 | `supersede(...)` 写入;其他状态必须为空 |
| `suspend_reason` | `Option<PolicySuspendReason>` | `Suspended` 原因 | `suspend(...)` 写入;重新 activate 后清空 |
| `retire_reason` | `Option<PolicyRetireReason>` | `Retired` 终态原因 | `retire(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> PolicyEffectiveFactRef` | 生成 policy fact ref | 无 | `PolicyEffectiveFactRef` | 纯函数;只复制 `policy_fact_id` |
| `pub fn is_effective(&self) -> bool` | 判断 policy fact 是否可被 guard 消费 | 无 | `bool` | 只有 `Effective` 返回 true |
| `pub fn activate(&mut self, snapshot: MethodPolicySnapshot, actor: ActorRef) -> Result<(), DomainError>` | 基于定义快照生效或恢复 Policy | resolved method policy snapshot、actor | `Result<(), DomainError>` | 允许 `Proposed -> Effective` 和 `Suspended -> Effective`;要求 `snapshot.matches_scope(self.scope_ref)`;更新 `policy_snapshot_ref`;清空 suspend reason |
| `pub fn suspend(&mut self, reason: PolicySuspendReason, actor: ActorRef) -> Result<(), DomainError>` | 暂停 policy 生效 | suspend reason、actor | `Result<(), DomainError>` | 允许 `Effective -> Suspended`;写入 `suspend_reason` |
| `pub fn supersede(&mut self, next_ref: PolicyEffectiveFactRef, actor: ActorRef) -> Result<(), DomainError>` | 被新版本或新事实替代 | next policy fact ref、actor | `Result<(), DomainError>` | 允许 `Proposed` / `Effective` / `Suspended -> Superseded`;next ref 不得等于自身 |
| `pub fn retire(&mut self, reason: PolicyRetireReason, actor: ActorRef) -> Result<(), DomainError>` | 退役不再适用的 policy fact | retire reason、actor | `Result<(), DomainError>` | 允许 `Proposed` / `Effective` / `Suspended -> Retired`;写入 retire reason |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn propose(policy_fact_id: PolicyEffectiveFactId, snapshot: MethodPolicySnapshot, scope_ref: GovernanceScopeRef, priority: PolicyPriority, actor: ActorRef) -> Result<Self, DomainError>` | 从 method policy snapshot 和 scope 形成待生效事实 | application generated id、snapshot、scope、priority、actor | `Result<PolicyEffectiveFact, DomainError>` | `ActivatePolicyEffectiveFact`;要求 `snapshot.matches_scope(scope_ref)`;初始 state 必须是 `Proposed` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 AIPolicyDef 正文 | `policy_snapshot_ref` 只能是 body-free snapshot / safe summary boundary |
| Effective 必须有可追溯 snapshot | `Effective` 状态必须能回到 `MethodPolicySnapshot.policy_ref`、version 和 summary ref |
| Suspended 不可静默消费 | guard / query / event 必须显式暴露 `Suspended`,不能当作 `Effective` |
| Superseded / Retired 为终态 | 终态 policy fact 不得重新 activate |
| priority 不绕过 shared rules | 高优先级 policy 仍必须通过 `SharedRulesPolicy` / `PolicyScopePolicy` |

#### 12.3 `SharedRuleSet`

```rust
/// Owns Governance shared rules that cannot be weakened by lower scopes.
pub struct SharedRuleSet {
    /// Stable shared rule set id generated by the application layer.
    pub rule_set_id: SharedRuleSetId,
    /// Scope where the shared rules apply.
    pub scope_ref: GovernanceScopeRef,
    /// Ordered refs of rules included in this set.
    pub rule_refs: SharedRuleRefSet,
    /// Current lifecycle state of the rule set.
    pub rule_set_state: SharedRuleSetState,
    /// Rule refs deprecated from the active set.
    pub deprecated_rule_refs: SharedRuleRefSet,
    /// Reason captured for the latest deprecation or set-level retire.
    pub rule_reason: Option<SharedRuleReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `rule_set_id` | `SharedRuleSetId` | shared rule set 主键 | draft / update shared rules flow 从 application id generator 取得;repository load 可重建 |
| `scope_ref` | `GovernanceScopeRef` | 规则适用范围 | command intent、organization scope summary 或 resolver summary;不得保存 scope body |
| `rule_refs` | `SharedRuleRefSet` | 集合内规则引用 | ordered unique;`add_rule(...)` 写入;不得保存 standard / policy / rule body |
| `rule_set_state` | `SharedRuleSetState` | rule set lifecycle state | 初始为 `Draft`;只能按 Step 9 允许迁移更新 |
| `deprecated_rule_refs` | `SharedRuleRefSet` | 已弃用规则引用 | `deprecate_rule(...)` 写入;ordered unique |
| `rule_reason` | `Option<SharedRuleReason>` | 弃用或退役原因 | `deprecate_rule(...)` / `retire(...)` 写入;其他状态可为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> SharedRuleSetRef` | 生成 shared rule set ref | 无 | `SharedRuleSetRef` | 纯函数;只复制 `rule_set_id` |
| `pub fn is_active(&self) -> bool` | 判断 shared rules 是否生效 | 无 | `bool` | `Active` 返回 true;`Deprecated` 必须带 query surface |
| `pub fn activate(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 生效 shared rules | actor | `Result<(), DomainError>` | 允许 `Draft -> Active`;规则集合必须满足 service / policy 校验 |
| `pub fn add_rule(&mut self, rule_ref: SharedRuleRef, actor: ActorRef) -> Result<(), DomainError>` | 加入组织级规则引用 | rule ref、actor | `Result<(), DomainError>` | 允许 `Draft` / `Active`;按 `SharedRuleId` 去重;不保存 rule body |
| `pub fn deprecate_rule(&mut self, rule_ref: SharedRuleRef, reason: SharedRuleReason, actor: ActorRef) -> Result<(), DomainError>` | 弃用单条规则 | rule ref、reason、actor | `Result<(), DomainError>` | 允许 `Active -> Deprecated`;rule 必须已存在;写入 deprecated set 和 reason |
| `pub fn retire(&mut self, reason: SharedRuleReason, actor: ActorRef) -> Result<(), DomainError>` | 退役规则集合 | retire reason、actor | `Result<(), DomainError>` | 允许 `Draft` / `Active` / `Deprecated -> Retired`;写入 reason |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn draft(rule_set_id: SharedRuleSetId, scope_ref: GovernanceScopeRef, actor: ActorRef) -> Result<Self, DomainError>` | 为 scope 建立 shared rules 草稿 | application generated id、scope、actor | `Result<SharedRuleSet, DomainError>` | `UpdateSharedRuleSet`;初始 state 必须是 `Draft`;rule sets 初始为空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| Active shared rules 是硬约束 | low-scope policy / config / runtime cache 不得削弱 active shared rules |
| rule ref 不保存正文 | 标准正文、policy body、rule expression 和 external GRC body 均不得进入本对象 |
| Deprecated 必须可见 | query / trace 必须显式暴露弃用状态,不得伪装为 active 或 retired |
| Retired 为终态 | retired rule set 不得重新 activate 或 add rule |
| empty draft 允许 | draft 可以为空;activate 前是否允许空集合由 service / policy 在 Step 9 / Step 12 口径闭合 |

#### 12.4 `PolicyConflictRecord`

```rust
/// Records a Governance policy conflict and its formal handling result.
pub struct PolicyConflictRecord {
    /// Stable policy conflict id generated by the application layer.
    pub conflict_id: PolicyConflictId,
    /// Policies that participate in the detected conflict.
    pub conflicting_policy_refs: PolicyEffectiveFactRefSet,
    /// Governance scope where the conflict was detected.
    pub scope_ref: GovernanceScopeRef,
    /// Shared rule set involved in the conflict, when applicable.
    pub shared_rule_set_ref: Option<SharedRuleSetRef>,
    /// Current handling state of the conflict.
    pub conflict_state: PolicyConflictState,
    /// Formal decision used to resolve or waive the conflict.
    pub resolution_ref: Option<GovernanceDecisionRef>,
    /// Gate that requires the conflict to be handled, when pending decision.
    pub pending_gate_ref: Option<GateRef>,
    /// Reason captured when the conflict is waived.
    pub waive_reason: Option<GovernanceWaiveReason>,
    /// Reason captured when the conflict is invalidated.
    pub invalid_reason: Option<PolicyConflictInvalidReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `conflict_id` | `PolicyConflictId` | conflict record truth 主键 | conflict detection flow 从 application id generator 取得;repository load 可重建 |
| `conflicting_policy_refs` | `PolicyEffectiveFactRefSet` | 发生冲突的 policy fact 集合 | `detect(...)` 写入;必须至少包含两个 policy 或一个 policy 与 shared rules 的正式冲突 surface |
| `scope_ref` | `GovernanceScopeRef` | 冲突发生范围 | 来源于 policy scope、context subject 或 resolver summary;不得保存 scope body |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 涉及的 shared rules | 仅在冲突触及组织级 hard rule 时写入;不保存 rule body |
| `conflict_state` | `PolicyConflictState` | 冲突处理状态 | 初始为 `Detected`;只能按 Step 9 允许迁移更新 |
| `resolution_ref` | `Option<GovernanceDecisionRef>` | 解决或豁免依据 | `resolve(...)` / `waive(...)` 写入;必须指向正式 Governance decision |
| `pending_gate_ref` | `Option<GateRef>` | 进入正式裁决的 gate | `mark_pending_decision(...)` 写入;非 pending 状态可为空 |
| `waive_reason` | `Option<GovernanceWaiveReason>` | 豁免原因 | `waive(...)` 写入;`Waived` 必须有 reason 和 formal basis |
| `invalid_reason` | `Option<PolicyConflictInvalidReason>` | 冲突不成立原因 | `invalidate(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> PolicyConflictRef` | 生成 conflict ref | 无 | `PolicyConflictRef` | 纯函数;只复制 `conflict_id` |
| `pub fn is_terminal(&self) -> bool` | 判断 conflict 是否终态 | 无 | `bool` | `Resolved` / `Waived` / `Invalid` 返回 true |
| `pub fn requires_decision(&self) -> bool` | 判断是否需要正式裁决 | 无 | `bool` | `PendingDecision` 返回 true;不读取 gate truth |
| `pub fn mark_pending_decision(&mut self, gate: &Gate, actor: ActorRef) -> Result<(), DomainError>` | 将冲突转入待裁决 | loaded gate、actor | `Result<(), DomainError>` | 允许 `Detected -> PendingDecision`;写入 `pending_gate_ref` |
| `pub fn resolve(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 基于正式决策解决冲突 | loaded decision、actor | `Result<(), DomainError>` | 允许 `Detected` / `PendingDecision -> Resolved`;写入 `resolution_ref`;清空 pending gate |
| `pub fn waive(&mut self, decision: &GovernanceDecision, reason: GovernanceWaiveReason, actor: ActorRef) -> Result<(), DomainError>` | 基于正式依据豁免冲突 | loaded decision、waive reason、actor | `Result<(), DomainError>` | 允许 `Detected` / `PendingDecision -> Waived`;写入 `resolution_ref` 和 `waive_reason` |
| `pub fn invalidate(&mut self, reason: PolicyConflictInvalidReason, actor: ActorRef) -> Result<(), DomainError>` | 标记冲突记录不成立 | invalid reason、actor | `Result<(), DomainError>` | 允许 `Detected` / `PendingDecision -> Invalid`;写入 `invalid_reason`;清空 pending gate |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn detect(conflict_id: PolicyConflictId, conflicting_policy_refs: PolicyEffectiveFactRefSet, scope_ref: GovernanceScopeRef, shared_rule_set_ref: Option<SharedRuleSetRef>, actor: ActorRef) -> Result<Self, DomainError>` | 从 policy 集合和 scope 建立冲突记录 | application generated id、conflicting policy refs、scope、optional shared rule set、actor | `Result<PolicyConflictRecord, DomainError>` | `ActivatePolicyEffectiveFact` / `UpdateSharedRuleSet` / conflict scan;初始 state 必须是 `Detected` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不修改 policy truth | resolve / waive / invalidate 只改 conflict record,不得改写 `PolicyEffectiveFact` 或 `SharedRuleSet` |
| waive 必须可追溯 | `Waived` 必须同时有 formal decision 和 reason,不得由 runtime cache、configuration 或 external GRC 直接跳过 |
| shared rules 不可被静默削弱 | 触及 active shared rules 的冲突必须显式记录或进入 pending decision |
| terminal 不可重开 | `Resolved` / `Waived` / `Invalid` 为终态;若后续 policy 再变更,必须新建 conflict record |
| 不保存 policy / rule body | 对象只保存 policy refs、shared rule set ref、decision ref 和 reason;不得保存 method policy、standard 或 rule expression body |
| empty conflict set 非法 | conflict record 必须有可解释的冲突参与方;空集合不得进入 repository |

#### 12.5 `ControlApplicability`

```rust
/// Owns the Governance applicability fact for a method control in one context.
pub struct ControlApplicability {
    /// Stable control applicability id generated by the application layer.
    pub applicability_id: ControlApplicabilityId,
    /// Method-library control definition reference.
    pub control_ref: MethodControlRef,
    /// Method control snapshot used to assess applicability.
    pub control_snapshot_ref: MethodControlSnapshot,
    /// Governance context where the control is assessed.
    pub context_ref: GovernanceContextRef,
    /// Current applicability state.
    pub applicability_state: ControlApplicabilityState,
    /// Evidence used for applicable or excluded conclusions.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Reason captured for not-applicable or excluded conclusions.
    pub control_reason: Option<ControlExcludeReason>,
    /// Later applicability fact that superseded this fact.
    pub superseded_by: Option<ControlApplicabilityRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `applicability_id` | `ControlApplicabilityId` | control applicability truth 主键 | assess control flow 从 application id generator 取得;repository load 可重建 |
| `control_ref` | `MethodControlRef` | method-library control 定义引用 | 从 `MethodControlSnapshot.control_ref` 派生;不得保存 ControlDefinition / standard body |
| `control_snapshot_ref` | `MethodControlSnapshot` | 适用性判断所依据的 body-free snapshot | `assess(...)` 接收;必须是 resolved / acceptable snapshot |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 | 从 loaded `GovernanceContext` 派生;context 必须处于可评估状态 |
| `applicability_state` | `ControlApplicabilityState` | 适用性 lifecycle state | 初始为 `PendingAssessment`;只能按 Step 9 允许迁移更新 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 适用或排除依据 | `mark_applicable(...)` / `exclude(...)` 写入;`Applicable` / `Excluded` 必须非空 |
| `control_reason` | `Option<ControlExcludeReason>` | 不适用或排除原因 | `mark_not_applicable(...)` / `exclude(...)` 写入;其他状态可为空 |
| `superseded_by` | `Option<ControlApplicabilityRef>` | 后续替代适用性事实 | `supersede(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ControlApplicabilityRef` | 生成 applicability ref | 无 | `ControlApplicabilityRef` | 纯函数;只复制 `applicability_id` |
| `pub fn is_assessed(&self) -> bool` | 判断是否已有适用性结论 | 无 | `bool` | `Applicable` / `NotApplicable` / `Excluded` 返回 true |
| `pub fn is_applicable(&self) -> bool` | 判断控制是否适用 | 无 | `bool` | 只有 `Applicable` 返回 true |
| `pub fn mark_applicable(&mut self, basis_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 标记控制适用 | evidence basis、actor | `Result<(), DomainError>` | 允许 `PendingAssessment -> Applicable`;写入 `basis_ref`;清空 `control_reason` |
| `pub fn mark_not_applicable(&mut self, reason: ControlExcludeReason, actor: ActorRef) -> Result<(), DomainError>` | 标记控制不适用 | reason、actor | `Result<(), DomainError>` | 允许 `PendingAssessment -> NotApplicable`;写入 `control_reason`;`basis_ref` 保持空 |
| `pub fn exclude(&mut self, reason: ControlExcludeReason, basis_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 基于依据排除控制 | reason、evidence basis、actor | `Result<(), DomainError>` | 允许 `PendingAssessment -> Excluded`;写入 reason 和 basis |
| `pub fn supersede(&mut self, next_ref: ControlApplicabilityRef, actor: ActorRef) -> Result<(), DomainError>` | 被后续适用性判断替代 | next applicability ref、actor | `Result<(), DomainError>` | 允许 `Applicable` / `NotApplicable` / `Excluded -> Superseded`;next ref 不得等于自身 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn assess(applicability_id: ControlApplicabilityId, context: &GovernanceContext, control_snapshot: MethodControlSnapshot, actor: ActorRef) -> Result<Self, DomainError>` | 为治理语境创建控制适用性评估 | application generated id、loaded context、method control snapshot、actor | `Result<ControlApplicability, DomainError>` | `AssessControlApplicability`;初始 state 必须是 `PendingAssessment` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 ControlDefinition 正文 | 只保存 `MethodControlRef`、`MethodControlSnapshot`、evidence summary ref 和 reason |
| Applicable 必须有依据 | `Applicable` 状态必须能回到 verified / acceptable `EvidenceSummaryRef` |
| Excluded 必须有依据和原因 | `Excluded` 状态必须同时保存 `basis_ref` 与 `control_reason` |
| NotApplicable 不等于 Excluded | `NotApplicable` 只说明控制不适用;`Excluded` 表示有依据排除,两者不得混用 |
| Superseded 为终态 | 被替代的适用性事实不得重新评估;重新评估必须新建 applicability record |
| report 不反写真相 | coverage view、dashboard、report 只能读取本对象,不得写回 applicability state |
| consumer 不直接创建 truth | inbound consumer 只能写 snapshot / reference / stale marker,不得创建 `ControlApplicability` |

#### 12.6 `ControlReview`

```rust
/// Owns a Governance review result for one applicable method control.
pub struct ControlReview {
    /// Stable control review id generated by the application layer.
    pub review_id: ControlReviewId,
    /// Control applicability fact being reviewed.
    pub applicability_ref: ControlApplicabilityRef,
    /// Current review lifecycle state.
    pub review_state: ControlReviewState,
    /// Actor responsible for performing the review.
    pub reviewer_ref: ActorRef,
    /// Evidence used to pass or fail the review.
    pub evidence_ref: Option<EvidenceSummaryRef>,
    /// Reason captured when the review fails.
    pub failure_reason: Option<ControlFailureReason>,
    /// Formal decision used to waive the review.
    pub waiver_decision_ref: Option<GovernanceDecisionRef>,
    /// Later control review that superseded this review.
    pub superseded_by: Option<ControlReviewRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `review_id` | `ControlReviewId` | control review truth 主键 | plan / record review flow 从 application id generator 取得;repository load 可重建 |
| `applicability_ref` | `ControlApplicabilityRef` | 被复核的适用性事实 | 从 loaded `ControlApplicability` 派生;该 applicability 必须是 `Applicable` |
| `review_state` | `ControlReviewState` | 复核 lifecycle state | 初始为 `Planned`;只能按 Step 9 允许迁移更新 |
| `reviewer_ref` | `ActorRef` | 复核责任 actor | command intent、responsibility assignment 或 application service 传入;不保存 actor profile |
| `evidence_ref` | `Option<EvidenceSummaryRef>` | 复核通过 / 失败依据 | `pass(...)` / `fail(...)` 写入;必须是 verified / acceptable evidence summary |
| `failure_reason` | `Option<ControlFailureReason>` | 复核失败原因 | `fail(...)` 写入;其他状态必须为空 |
| `waiver_decision_ref` | `Option<GovernanceDecisionRef>` | 豁免复核的正式裁决 | `waive(...)` 写入;`Waived` 必须非空 |
| `superseded_by` | `Option<ControlReviewRef>` | 后续替代复核 | `supersede(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ControlReviewRef` | 生成 review ref | 无 | `ControlReviewRef` | 纯函数;只复制 `review_id` |
| `pub fn is_terminal(&self) -> bool` | 判断复核是否终态 | 无 | `bool` | `Passed` / `Failed` / `Waived` / `Superseded` 返回 true |
| `pub fn requires_follow_up(&self) -> bool` | 判断是否可能触发后续不符合处理 | 无 | `bool` | 只有 `Failed` 返回 true;不自动创建 nonconformity |
| `pub fn start(&mut self, reviewer_ref: ActorRef) -> Result<(), DomainError>` | 开始复核 | reviewer actor | `Result<(), DomainError>` | 允许 `Planned -> InReview`;可更新实际 reviewer |
| `pub fn pass(&mut self, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 基于依据通过复核 | evidence summary、actor | `Result<(), DomainError>` | 允许 `InReview -> Passed`;写入 `evidence_ref`;清空 failure / waiver 字段 |
| `pub fn fail(&mut self, reason: ControlFailureReason, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 记录复核失败 | failure reason、evidence summary、actor | `Result<(), DomainError>` | 允许 `InReview -> Failed`;写入 reason 和 evidence;不创建 nonconformity |
| `pub fn waive(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 基于正式裁决豁免复核 | loaded decision、actor | `Result<(), DomainError>` | 允许 `InReview -> Waived`;写入 `waiver_decision_ref`;不得使用配置或 runtime 直接豁免 |
| `pub fn supersede(&mut self, next_ref: ControlReviewRef, actor: ActorRef) -> Result<(), DomainError>` | 被后续复核替代 | next review ref、actor | `Result<(), DomainError>` | 允许 `Planned` / `InReview -> Superseded`;next ref 不得等于自身 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn plan(review_id: ControlReviewId, applicability: &ControlApplicability, reviewer_ref: ActorRef) -> Result<Self, DomainError>` | 为适用控制创建复核 | application generated id、applicable control fact、reviewer actor | `Result<ControlReview, DomainError>` | `RecordControlReview` / review planning;初始 state 必须是 `Planned` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 只复核 applicable control | `plan(...)` 必须拒绝非 `Applicable` 的 `ControlApplicability` |
| 不保存 evidence body | 只保存 `EvidenceSummaryRef`;artifact / evidence 正文归来源仓 |
| Failed 不自动创建不符合 | failed review 只能作为 nonconformity flow 的输入线索,不能自动创建或关闭 `NonconformityRecord` |
| Waived 必须引用正式裁决 | `Waived` 必须保存 `GovernanceDecisionRef`,不得由 runtime cache、configuration 或 external GRC 直接豁免 |
| terminal 不可重开 | `Passed` / `Failed` / `Waived` / `Superseded` 为终态;后续复核必须新建 review |
| reviewer 不接管 identity truth | `ActorRef` 只引用 actor,不保存 profile、role lifecycle 或 authorization rule |

#### 12.7 `AIIAConclusion`

```rust
/// Owns the Governance conclusion for an AI impact assessment artifact.
pub struct AIIAConclusion {
    /// Stable AIIA conclusion id generated by the application layer.
    pub aiia_conclusion_id: AIIAConclusionId,
    /// Governance context covered by the AIIA conclusion.
    pub context_ref: GovernanceContextRef,
    /// Artifact-owned AIIA body reference.
    pub artifact_ref: ArtifactRef,
    /// Current compliance conclusion lifecycle state.
    pub conclusion_state: ComplianceConclusionState,
    /// Evidence used to submit the conclusion for Governance review.
    pub review_evidence_ref: Option<EvidenceSummaryRef>,
    /// Formal Governance decision used for approval or rejection.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Reason captured when the conclusion is rejected.
    pub reject_reason: Option<GovernanceRejectReason>,
    /// Later AIIA conclusion that superseded this conclusion.
    pub superseded_by: Option<AIIAConclusionRef>,
    /// Formal Governance decision used to revoke a finalized conclusion.
    pub revocation_decision_ref: Option<GovernanceDecisionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `aiia_conclusion_id` | `AIIAConclusionId` | AIIA conclusion truth 主键 | submit AIIA conclusion flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 | 从 loaded `GovernanceContext` 派生;context 必须可接收 compliance conclusion |
| `artifact_ref` | `ArtifactRef` | AIIA 正文来源引用 | 来源于 artifact / archive boundary;只保存 ref,不保存正文 |
| `conclusion_state` | `ComplianceConclusionState` | 结论 lifecycle state | 初始为 `Drafted`;只能按 Step 9 允许迁移更新 |
| `review_evidence_ref` | `Option<EvidenceSummaryRef>` | 提交评审依据 | `submit_for_review(...)` 写入;`InReview` / finalized path 必须保留 |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 批准或拒绝依据 | `approve(...)` / `reject(...)` 写入;字段名采用中性 detailed contract,覆盖 HLD 中 approval / rejection basis 语义 |
| `reject_reason` | `Option<GovernanceRejectReason>` | 拒绝原因 | `reject(...)` 写入;其他状态必须为空 |
| `superseded_by` | `Option<AIIAConclusionRef>` | 后续替代结论 | `supersede(...)` 写入;其他状态必须为空 |
| `revocation_decision_ref` | `Option<GovernanceDecisionRef>` | 撤销依据 | `revoke(...)` 写入;`Revoked` 必须非空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> AIIAConclusionRef` | 生成 AIIA conclusion ref | 无 | `AIIAConclusionRef` | 纯函数;只复制 `aiia_conclusion_id` |
| `pub fn to_compliance_ref(&self) -> ComplianceConclusionRef` | 生成 union compliance conclusion ref | 无 | `ComplianceConclusionRef` | 纯函数;返回 `ComplianceConclusionRef::AIIA(self.to_ref())` |
| `pub fn is_finalized(&self) -> bool` | 判断结论是否已完成正式裁决 | 无 | `bool` | `Approved` / `Rejected` 返回 true |
| `pub fn submit_for_review(&mut self, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 提交治理评审 | evidence summary、actor | `Result<(), DomainError>` | 允许 `Drafted -> InReview`;写入 `review_evidence_ref` |
| `pub fn approve(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 基于正式裁决批准结论 | loaded decision、actor | `Result<(), DomainError>` | 允许 `InReview -> Approved`;写入 `decision_ref`;清空 reject reason |
| `pub fn reject(&mut self, decision: &GovernanceDecision, reason: GovernanceRejectReason, actor: ActorRef) -> Result<(), DomainError>` | 基于正式裁决拒绝结论 | loaded decision、reject reason、actor | `Result<(), DomainError>` | 允许 `InReview -> Rejected`;写入 `decision_ref` 和 reject reason |
| `pub fn supersede(&mut self, next_ref: AIIAConclusionRef, actor: ActorRef) -> Result<(), DomainError>` | 被新 AIIA 结论替代 | next conclusion ref、actor | `Result<(), DomainError>` | 允许 `Drafted` / `InReview` / `Approved` / `Rejected -> Superseded`;next ref 不得等于自身 |
| `pub fn revoke(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 撤销 finalized AIIA 结论 | loaded revocation decision、actor | `Result<(), DomainError>` | 允许 `Approved` / `Rejected -> Revoked`;写入 `revocation_decision_ref`;保留原 `decision_ref` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_artifact(aiia_conclusion_id: AIIAConclusionId, context: &GovernanceContext, artifact_ref: ArtifactRef, actor: ActorRef) -> Result<Self, DomainError>` | 从 artifact 正文引用形成 AIIA 治理结论 | application generated id、loaded context、artifact ref、actor | `Result<AIIAConclusion, DomainError>` | `SubmitAIIAConclusion`;初始 state 必须是 `Drafted` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 AIIA 正文 | `artifact_ref` 只指向 artifact / archive-owned body;本对象只保存结论状态、引用、摘要和 decision basis |
| 自动草拟不等于批准 | `from_artifact(...)` 只能生成 `Drafted`;任何自动建议不得越过 `InReview` 和 formal decision |
| review evidence 必须可追溯 | `InReview`、`Approved`、`Rejected`、`Superseded`、`Revoked` 路径必须保留 `review_evidence_ref` |
| Approved / Rejected 必须有正式裁决 | finalized path 必须写入 `decision_ref`,不得由 artifact 版本变更、runtime cache 或外部 GRC 直接推出 |
| Revoked 不覆盖原裁决 | `revoke(...)` 只能写 `revocation_decision_ref`,不得清空或覆盖原 `decision_ref` |
| Superseded / Revoked 为终态 | 终态结论不得重新 submit / approve / reject;新版本必须新建 conclusion |
| SoA 控制覆盖不在本对象 | AIIA 不保存 `ControlCoverageRef`;SoA coverage 约束留给 `SoAConclusion` |
| consumer 不直接创建 truth | inbound consumer 只能写 artifact snapshot / reference / stale marker,不得创建 `AIIAConclusion` |

#### 12.8 `SoAConclusion`

```rust
/// Owns the Governance conclusion for a Statement of Applicability artifact.
pub struct SoAConclusion {
    /// Stable SoA conclusion id generated by the application layer.
    pub soa_conclusion_id: SoAConclusionId,
    /// Governance context covered by the SoA conclusion.
    pub context_ref: GovernanceContextRef,
    /// Artifact-owned SoA body reference.
    pub artifact_ref: ArtifactRef,
    /// Control coverage summary used by the SoA conclusion.
    pub control_coverage_ref: Option<ControlCoverageRef>,
    /// Current compliance conclusion lifecycle state.
    pub conclusion_state: ComplianceConclusionState,
    /// Evidence used to submit the conclusion for Governance review.
    pub review_evidence_ref: Option<EvidenceSummaryRef>,
    /// Formal Governance decision used for approval or rejection.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Reason captured when the conclusion is rejected.
    pub reject_reason: Option<GovernanceRejectReason>,
    /// Later SoA conclusion that superseded this conclusion.
    pub superseded_by: Option<SoAConclusionRef>,
    /// Formal Governance decision used to revoke a finalized conclusion.
    pub revocation_decision_ref: Option<GovernanceDecisionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `soa_conclusion_id` | `SoAConclusionId` | SoA conclusion truth 主键 | submit SoA conclusion flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 | 从 loaded `GovernanceContext` 派生;context 必须可接收 compliance conclusion |
| `artifact_ref` | `ArtifactRef` | SoA 正文来源引用 | 来源于 artifact / archive boundary;只保存 ref,不保存正文 |
| `control_coverage_ref` | `Option<ControlCoverageRef>` | 控制覆盖摘要引用 | `attach_control_coverage(...)` 写入;submit / approve path 必须非空 |
| `conclusion_state` | `ComplianceConclusionState` | 结论 lifecycle state | 初始为 `Drafted`;只能按 Step 9 允许迁移更新 |
| `review_evidence_ref` | `Option<EvidenceSummaryRef>` | 提交评审依据 | `submit_for_review(...)` 写入;`InReview` / finalized path 必须保留 |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 批准或拒绝依据 | `approve(...)` / `reject(...)` 写入;覆盖 approval / rejection basis 语义 |
| `reject_reason` | `Option<GovernanceRejectReason>` | 拒绝原因 | `reject(...)` 写入;其他状态必须为空 |
| `superseded_by` | `Option<SoAConclusionRef>` | 后续替代结论 | `supersede(...)` 写入;其他状态必须为空 |
| `revocation_decision_ref` | `Option<GovernanceDecisionRef>` | 撤销依据 | `revoke(...)` 写入;`Revoked` 必须非空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> SoAConclusionRef` | 生成 SoA conclusion ref | 无 | `SoAConclusionRef` | 纯函数;只复制 `soa_conclusion_id` |
| `pub fn to_compliance_ref(&self) -> ComplianceConclusionRef` | 生成 union compliance conclusion ref | 无 | `ComplianceConclusionRef` | 纯函数;返回 `ComplianceConclusionRef::SoA(self.to_ref())` |
| `pub fn is_finalized(&self) -> bool` | 判断结论是否已完成正式裁决 | 无 | `bool` | `Approved` / `Rejected` 返回 true |
| `pub fn has_control_coverage(&self) -> bool` | 判断是否已绑定控制覆盖摘要 | 无 | `bool` | `control_coverage_ref.is_some()` |
| `pub fn attach_control_coverage(&mut self, coverage_ref: ControlCoverageRef, actor: ActorRef) -> Result<(), DomainError>` | 绑定控制覆盖摘要 | coverage summary ref、actor | `Result<(), DomainError>` | 允许 `Drafted`;写入 `control_coverage_ref`;不读取 coverage body |
| `pub fn submit_for_review(&mut self, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 提交治理评审 | evidence summary、actor | `Result<(), DomainError>` | 允许 `Drafted -> InReview`;要求已有 `control_coverage_ref`;写入 `review_evidence_ref` |
| `pub fn approve(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 基于正式裁决批准结论 | loaded decision、actor | `Result<(), DomainError>` | 允许 `InReview -> Approved`;要求已有 coverage;写入 `decision_ref`;清空 reject reason |
| `pub fn reject(&mut self, decision: &GovernanceDecision, reason: GovernanceRejectReason, actor: ActorRef) -> Result<(), DomainError>` | 基于正式裁决拒绝结论 | loaded decision、reject reason、actor | `Result<(), DomainError>` | 允许 `InReview -> Rejected`;写入 `decision_ref` 和 reject reason |
| `pub fn supersede(&mut self, next_ref: SoAConclusionRef, actor: ActorRef) -> Result<(), DomainError>` | 被新 SoA 结论替代 | next conclusion ref、actor | `Result<(), DomainError>` | 允许 `Drafted` / `InReview` / `Approved` / `Rejected -> Superseded`;next ref 不得等于自身 |
| `pub fn revoke(&mut self, decision: &GovernanceDecision, actor: ActorRef) -> Result<(), DomainError>` | 撤销 finalized SoA 结论 | loaded revocation decision、actor | `Result<(), DomainError>` | 允许 `Approved` / `Rejected -> Revoked`;写入 `revocation_decision_ref`;保留原 `decision_ref` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_artifact(soa_conclusion_id: SoAConclusionId, context: &GovernanceContext, artifact_ref: ArtifactRef, actor: ActorRef) -> Result<Self, DomainError>` | 从 artifact 正文引用形成 SoA 治理结论 | application generated id、loaded context、artifact ref、actor | `Result<SoAConclusion, DomainError>` | `SubmitSoAConclusion`;初始 state 必须是 `Drafted`;coverage 可随后绑定 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 SoA 正文 | `artifact_ref` 只指向 artifact / archive-owned body;本对象只保存结论状态、引用、摘要和 decision basis |
| 控制覆盖必须闭合 | `submit_for_review(...)` 与 `approve(...)` 必须要求 `control_coverage_ref` 存在 |
| coverage ref 不反写真相 | `ControlCoverageRef` 只引用 coverage summary;不得由 SoA conclusion 改写 control applicability / review |
| Approved / Rejected 必须有正式裁决 | finalized path 必须写入 `decision_ref`,不得由 artifact 版本变更、runtime cache 或外部 GRC 直接推出 |
| Revoked 不覆盖原裁决 | `revoke(...)` 只能写 `revocation_decision_ref`,不得清空或覆盖原 `decision_ref` |
| Superseded / Revoked 为终态 | 终态结论不得重新 submit / approve / reject;新版本必须新建 conclusion |
| AIIA 风险结论不在本对象 | SoA 不保存 AIIA 专属评估正文或风险说明;跨结论关联留给 query / trace / policy |
| consumer 不直接创建 truth | inbound consumer 只能写 artifact snapshot / reference / stale marker,不得创建 `SoAConclusion` |

#### 12.9 `NonconformityRecord`

```rust
/// Owns a formal Governance nonconformity and its corrective closure state.
pub struct NonconformityRecord {
    /// Stable nonconformity id generated by the application layer.
    pub nonconformity_id: NonconformityId,
    /// Governance context where the nonconformity was raised.
    pub context_ref: GovernanceContextRef,
    /// Severity captured for prioritization and closure policy.
    pub severity: NonconformitySeverity,
    /// Current corrective lifecycle state.
    pub record_state: NonconformityState,
    /// Actor responsible for corrective ownership.
    pub owner_ref: ActorRef,
    /// Source signal or formal input that raised the nonconformity.
    pub source_ref: GovernanceSourceRef,
    /// Confirmed cause for the nonconformity.
    pub cause_ref: Option<NonconformityCauseRef>,
    /// Corrective action currently driving the correction.
    pub active_action_ref: Option<CorrectiveActionRef>,
    /// Verification result used to close the nonconformity.
    pub closure_verification_ref: Option<VerificationResultRef>,
    /// Reason captured when a closed nonconformity is reopened.
    pub reopen_reason: Option<NonconformityReopenReason>,
    /// Reason captured when the nonconformity signal is rejected.
    pub reject_reason: Option<NonconformityRejectReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `nonconformity_id` | `NonconformityId` | nonconformity truth 主键 | raise nonconformity flow 从 application id generator 取得;repository load 可重建 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 | 从 loaded `GovernanceContext` 派生;context 必须 `Ready` |
| `severity` | `NonconformitySeverity` | 严重度 | command intent、control failure surface 或 evidence summary;非空 newtype,不驱动状态迁移 |
| `record_state` | `NonconformityState` | 不符合闭环状态 | 初始为 `Raised`;只能按 Step 9 允许迁移更新 |
| `owner_ref` | `ActorRef` | 处置责任 actor | command actor、责任分派或 service assignment;不保存 actor profile |
| `source_ref` | `GovernanceSourceRef` | 来源线索 | 可以来自 control review failed、artifact evidence、observability alert、work blocker 等正式 source ref;不得等同 source truth |
| `cause_ref` | `Option<NonconformityCauseRef>` | 已确认原因 | `confirm_cause(...)` 写入;`CauseConfirmed` 及后续纠正路径必须非空 |
| `active_action_ref` | `Option<CorrectiveActionRef>` | 当前纠正动作 | `start_correction(...)` 写入;不保存 WorkItem truth |
| `closure_verification_ref` | `Option<VerificationResultRef>` | 关闭依据 | `close(...)` 写入;`Closed` 必须指向 passed verification result |
| `reopen_reason` | `Option<NonconformityReopenReason>` | 重开原因 | `reopen(...)` 写入;其他状态可为空 |
| `reject_reason` | `Option<NonconformityRejectReason>` | 拒绝原因 | `reject(...)` 写入;`Rejected` 必须非空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> NonconformityRef` | 生成 nonconformity ref | 无 | `NonconformityRef` | 纯函数;只复制 `nonconformity_id` |
| `pub fn is_open(&self) -> bool` | 判断不符合是否仍需处理 | 无 | `bool` | `Closed` / `Rejected` 返回 false;其余返回 true |
| `pub fn can_start_correction(&self) -> bool` | 判断是否可进入纠正 | 无 | `bool` | `CauseConfirmed` / `Reopened` 返回 true |
| `pub fn confirm_cause(&mut self, cause_ref: NonconformityCauseRef, actor: ActorRef) -> Result<(), DomainError>` | 确认不符合原因 | cause ref、actor | `Result<(), DomainError>` | 允许 `Raised -> CauseConfirmed`;写入 `cause_ref` |
| `pub fn start_correction(&mut self, action: &CorrectiveAction, actor: ActorRef) -> Result<(), DomainError>` | 进入纠正处理 | loaded corrective action、actor | `Result<(), DomainError>` | 允许 `CauseConfirmed` / `Reopened -> Correcting`;写入 `active_action_ref`;action 必须属于本记录 |
| `pub fn mark_ready_for_verification(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 标记等待复验 | actor | `Result<(), DomainError>` | 允许 `Correcting -> ReadyForVerification`;不得自动关闭 |
| `pub fn close(&mut self, result: &VerificationResult, actor: ActorRef) -> Result<(), DomainError>` | 基于复验结果关闭 | loaded verification result、actor | `Result<(), DomainError>` | 允许 `ReadyForVerification -> Closed`;result 必须属于本记录且 state 为 `Passed`;写入 `closure_verification_ref` |
| `pub fn reopen(&mut self, reason: NonconformityReopenReason, actor: ActorRef) -> Result<(), DomainError>` | 重开已关闭不符合 | reopen reason、actor | `Result<(), DomainError>` | 允许 `Closed -> Reopened`;写入 `reopen_reason`;不清空历史 verification ref |
| `pub fn reject(&mut self, reason: NonconformityRejectReason, actor: ActorRef) -> Result<(), DomainError>` | 拒绝不成立线索 | reject reason、actor | `Result<(), DomainError>` | 允许 `Raised -> Rejected`;写入 `reject_reason` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn raise(nonconformity_id: NonconformityId, context: &GovernanceContext, severity: NonconformitySeverity, source_ref: GovernanceSourceRef, owner_ref: ActorRef, actor: ActorRef) -> Result<Self, DomainError>` | 从正式治理语境提出不符合 | application generated id、loaded context、severity、source ref、owner actor、raising actor | `Result<NonconformityRecord, DomainError>` | `RaiseNonconformity`;初始 state 必须是 `Raised` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不等同 bug / blocker / alert | 外部缺陷、work blocker、runtime failure、observability alert 只能作为 `source_ref`,不能替代 `NonconformityRecord` |
| 关闭必须基于 passed verification | `CorrectiveActionState::Completed`、`VerificationState::Failed` 或 `Inconclusive` 都不能推动 `Closed` |
| corrective action 不自动关闭 | `active_action_ref` 只表示纠正执行中;关闭仍必须由 `close(...)` 消费 passed `VerificationResult` |
| Reopened 保留历史 | `reopen(...)` 不清空 `closure_verification_ref`;历史由 trace / history 继续可追溯 |
| Rejected 不删除记录 | rejected signal 仍保留 source、reason、trace 和 audit surface |
| severity 不驱动迁移 | 严重度影响 policy / priority / SLA,不得绕过原因确认、纠正和复验闭环 |
| consumer 不直接创建 truth | inbound consumer 只能写 source snapshot / pending input / stale marker,不得创建 `NonconformityRecord` |

#### 12.10 `CorrectiveAction`

```rust
/// Owns one corrective action planned for a formal nonconformity.
pub struct CorrectiveAction {
    /// Stable corrective action id generated by the application layer.
    pub action_id: CorrectiveActionId,
    /// Nonconformity record that owns this action.
    pub nonconformity_ref: NonconformityRef,
    /// Actor responsible for executing the corrective action.
    pub owner_ref: ActorRef,
    /// Current corrective action lifecycle state.
    pub action_state: CorrectiveActionState,
    /// Optional work-side collaboration context for execution tracking.
    pub work_ref: Option<WorkGovernanceContextRef>,
    /// Evidence used to mark the action completed.
    pub completion_evidence_ref: Option<EvidenceSummaryRef>,
    /// Reason captured when the action is cancelled.
    pub cancel_reason: Option<CorrectiveActionCancelReason>,
    /// Reason captured when the action fails.
    pub failure_reason: Option<CorrectiveActionFailureReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `action_id` | `CorrectiveActionId` | corrective action truth 主键 | plan corrective action flow 从 application id generator 取得;repository load 可重建 |
| `nonconformity_ref` | `NonconformityRef` | 所属不符合 | 从 loaded `NonconformityRecord` 派生;record 必须允许 correction |
| `owner_ref` | `ActorRef` | 纠正责任 actor | command intent、responsibility assignment 或 service policy 传入;不保存 actor profile |
| `action_state` | `CorrectiveActionState` | 纠正动作 lifecycle state | 初始为 `Planned`;只能按 Step 9 允许迁移更新 |
| `work_ref` | `Option<WorkGovernanceContextRef>` | 可选工作协作引用 | `plan(...)` 写入;只引用 Work context,不保存 WorkItem truth |
| `completion_evidence_ref` | `Option<EvidenceSummaryRef>` | 完成依据 | `complete(...)` 写入;`Completed` 必须非空 |
| `cancel_reason` | `Option<CorrectiveActionCancelReason>` | 取消原因 | `cancel(...)` 写入;其他状态必须为空 |
| `failure_reason` | `Option<CorrectiveActionFailureReason>` | 失败原因 | `fail(...)` 写入;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> CorrectiveActionRef` | 生成 corrective action ref | 无 | `CorrectiveActionRef` | 纯函数;只复制 `action_id` |
| `pub fn relates_to(&self, nonconformity_ref: &NonconformityRef) -> bool` | 判断是否属于指定不符合 | nonconformity ref | `bool` | 纯判断;供 `NonconformityRecord::start_correction(...)` 校验 |
| `pub fn is_terminal(&self) -> bool` | 判断纠正动作是否终态 | 无 | `bool` | `Completed` / `Cancelled` / `Failed` 返回 true |
| `pub fn start(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 开始纠正动作 | actor | `Result<(), DomainError>` | 允许 `Planned -> InProgress` |
| `pub fn complete(&mut self, evidence_ref: EvidenceSummaryRef, actor: ActorRef) -> Result<(), DomainError>` | 基于依据完成纠正 | evidence summary、actor | `Result<(), DomainError>` | 允许 `InProgress -> Completed`;写入 `completion_evidence_ref`;不关闭 nonconformity |
| `pub fn cancel(&mut self, reason: CorrectiveActionCancelReason, actor: ActorRef) -> Result<(), DomainError>` | 取消纠正动作 | cancel reason、actor | `Result<(), DomainError>` | 允许 `Planned` / `InProgress -> Cancelled`;写入 `cancel_reason` |
| `pub fn fail(&mut self, reason: CorrectiveActionFailureReason, actor: ActorRef) -> Result<(), DomainError>` | 标记纠正失败 | failure reason、actor | `Result<(), DomainError>` | 允许 `Planned` / `InProgress -> Failed`;写入 `failure_reason` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn plan(action_id: CorrectiveActionId, record: &NonconformityRecord, owner_ref: ActorRef, work_ref: Option<WorkGovernanceContextRef>, actor: ActorRef) -> Result<Self, DomainError>` | 为不符合记录规划纠正动作 | application generated id、loaded nonconformity、owner actor、optional work collaboration ref、planning actor | `Result<CorrectiveAction, DomainError>` | `PlanCorrectiveAction`;初始 state 必须是 `Planned`;record 必须 `can_start_correction()` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 WorkItem | `work_ref` 只用于协作追踪,不得把 WorkItem 状态当作 `CorrectiveActionState` |
| 不保存执行正文 | 不保存 work description、conversation、runtime log、artifact body 或 evidence body |
| Completed 不关闭不符合 | `complete(...)` 只完成动作;`NonconformityRecord::close(...)` 仍必须基于 passed `VerificationResult` |
| Cancelled / Failed 为终态 | 取消或失败后不得重新 start / complete;需要重新规划时新建 corrective action |
| terminal reason 必须可见 | `Cancelled` 必须有 `cancel_reason`;`Failed` 必须有 `failure_reason` |
| action 必须归属单一 nonconformity | 同一个 `CorrectiveAction` 不得跨多个 nonconformity record 复用 |

#### 12.11 `VerificationResult`

```rust
/// Captures a nonconformity verification conclusion with evidence.
pub struct VerificationResult {
    /// Stable verification result id generated by the application layer.
    pub verification_id: VerificationResultId,
    /// Nonconformity record being verified.
    pub nonconformity_ref: NonconformityRef,
    /// Verification conclusion state.
    pub verification_state: VerificationState,
    /// Evidence used for the verification conclusion.
    pub evidence_ref: EvidenceSummaryRef,
    /// Actor who performed the verification.
    pub verifier_ref: ActorRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `verification_id` | `VerificationResultId` | verification result identity | verify nonconformity flow 从 application id generator 取得;repository load 可重建 |
| `nonconformity_ref` | `NonconformityRef` | 被复验的不符合记录 | 从 loaded `NonconformityRecord` 派生;必须处于 `ReadyForVerification` 或正式允许复验的重试口径 |
| `verification_state` | `VerificationState` | 复验结论状态 | 只能是 `Passed` / `Failed` / `Inconclusive`;由 verifier 基于 evidence summary 给出 |
| `evidence_ref` | `EvidenceSummaryRef` | 复验所依据的证据摘要引用 | 来自 artifact / evidence resolver 的 safe summary ref;不得保存 evidence body |
| `verifier_ref` | `ActorRef` | 执行复验的 actor | command actor、delegated verifier 或 service policy 确认的 actor;不保存 actor profile |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> VerificationResultRef` | 生成 verification result ref | 无 | `VerificationResultRef` | 纯函数;只复制 `verification_id` |
| `pub fn is_passed(&self) -> bool` | 判断复验是否通过 | 无 | `bool` | 仅 `VerificationState::Passed` 返回 true |
| `pub fn requires_rework(&self) -> bool` | 判断是否需要重新纠正 | 无 | `bool` | `Failed` 返回 true;`Inconclusive` 表示证据不足或无法确认,不得自动等同 corrective rework |
| `pub fn is_inconclusive(&self) -> bool` | 判断复验是否无法给出结论 | 无 | `bool` | 仅 `Inconclusive` 返回 true;供 application flow 决定补证或重试 |
| `pub fn relates_to(&self, nonconformity_ref: &NonconformityRef) -> bool` | 判断结果是否属于指定不符合 | nonconformity ref | `bool` | 纯判断;供 `NonconformityRecord::close(...)` 校验归属 |
| `pub fn can_close_nonconformity(&self) -> bool` | 判断是否可作为关闭依据 | 无 | `bool` | 等价于 `is_passed()`;为 closure policy / domain test 提供明确断言 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_evidence(verification_id: VerificationResultId, nonconformity: &NonconformityRecord, evidence_ref: EvidenceSummaryRef, verifier_ref: ActorRef, state: VerificationState) -> Result<Self, DomainError>` | 从复验证据创建结果 | application generated id、loaded nonconformity、evidence summary ref、verifier actor、verification state | `Result<VerificationResult, DomainError>` | `VerifyNonconformity`;record 必须可复验;object 创建后不可再变更结论 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body | `evidence_ref` 只能指向 safe summary;证据正文、artifact body、conversation、runtime log 不进入本对象 |
| 不独立关闭不符合 | `VerificationResult` 只表达结论;关闭由 `NonconformityRecord::close(...)` 消费 passed result 执行 |
| 只有 Passed 可关闭 | `Failed` / `Inconclusive` 都不能作为 `Closed` 依据;必须进入重新纠正、补证或重试复验 flow |
| immutable result | 创建后不得修改 `verification_state`、`evidence_ref` 或 `verifier_ref`;错误结论必须新建 result 并由 trace 串联 |
| result 必须归属单一 nonconformity | 同一个 `VerificationResult` 不得跨多个 `NonconformityRecord` 复用 |
| verifier 不成为 truth owner | `verifier_ref` 只记录执行复验 actor;不替代 owner / responsibility truth |
| id 来源必须显式 | HLD factory 未列出 id 入参,但 object 必填 `verification_id`;为满足 id 闭环,正式落码 factory 必须接收 application generated id |

### 13. `domain` reference / projection / trace / outbox / history 对象契约

本节承接 §10.9、§10.14、§10.16 已闭合的 shared ref、state enum 和 helper。`DerivedGovernanceViewState` 属于 domain / projection state,用于维护只读派生视图的新鲜度和 rebuild 状态。`ReferenceResolutionState` 已在 §10.16 作为 `contracts::refs` shared helper 闭合,因为 query、job report、snapshot DTO 都会直接引用它;本节不再定义第二套 domain-only `ReferenceResolutionState`。

#### 13.1 `DerivedGovernanceViewState`

```rust
/// Tracks freshness and rebuild status for a derived Governance view.
pub struct DerivedGovernanceViewState {
    /// Derived view being maintained.
    pub view_ref: DerivedGovernanceViewRef,
    /// Current freshness state of the view.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Latest Governance truth cursor represented or targeted by this view.
    pub source_cursor: GovernanceTruthCursor,
    /// Latest projection maintenance failure reference, when any.
    pub last_failure_ref: Option<DerivedViewFailureRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | 被维护的派生视图 | 由 projection repository / builder 按正式 scope、subject 和 view kind 生成;不得临时拼接 ad hoc view id |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | projection freshness / rebuild state | 初始为 `Fresh`;只能按 §10.14 / Step 9 状态矩阵迁移 |
| `source_cursor` | `GovernanceTruthCursor` | 当前 view 已覆盖或正在追赶的 truth cursor | factory、`mark_stale(...)`、`start_rebuild(...)`、`mark_fresh(...)` 传入;不作为 optimistic version |
| `last_failure_ref` | `Option<DerivedViewFailureRef>` | 最近一次维护失败引用 | `mark_failed(...)` 写入;`mark_fresh(...)` 清空;不保存错误栈或 adapter log |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> DerivedGovernanceViewRef` | 生成 view state ref | 无 | `DerivedGovernanceViewRef` | 纯函数;复制 `view_ref` |
| `pub fn is_stale(&self) -> bool` | 判断是否需要 rebuild | 无 | `bool` | `Stale` / `Failed` / `Unavailable` 返回 true;`Rebuilding` 表示已在维护中 |
| `pub fn is_readable_without_degraded_marker(&self) -> bool` | 判断 query 是否可直接作为 fresh 输出 | 无 | `bool` | 仅 `Fresh` 返回 true;其他状态必须由 query response 暴露 freshness / degraded surface |
| `pub fn mark_stale(&mut self, cursor: GovernanceTruthCursor) -> Result<(), DomainError>` | 标记 view 落后于 truth / snapshot | new source cursor | `Result<(), DomainError>` | 允许 `Fresh -> Stale`;更新 `source_cursor`;不清空 `last_failure_ref` |
| `pub fn start_rebuild(&mut self, cursor: GovernanceTruthCursor) -> Result<(), DomainError>` | 标记 rebuild 开始 | target source cursor | `Result<(), DomainError>` | 允许 `Stale` / `Failed` / `Unavailable -> Rebuilding`;更新 `source_cursor` |
| `pub fn mark_fresh(&mut self, cursor: GovernanceTruthCursor) -> Result<(), DomainError>` | 标记 rebuild 成功并追上 cursor | rebuilt source cursor | `Result<(), DomainError>` | 允许 `Rebuilding -> Fresh`;更新 `source_cursor`;清空 `last_failure_ref` |
| `pub fn mark_failed(&mut self, failure_ref: DerivedViewFailureRef) -> Result<(), DomainError>` | 记录维护失败 | persisted failure ref 或 job report item ref | `Result<(), DomainError>` | 允许 `Stale` / `Rebuilding -> Failed`;写入 `last_failure_ref` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_view(view_ref: DerivedGovernanceViewRef, source_cursor: GovernanceTruthCursor) -> Result<Self, DomainError>` | 为派生视图建立 freshness state | stable view ref、当前 source cursor | `Result<DerivedGovernanceViewState, DomainError>` | projection repository 首次注册 view state;初始 state 为 `Fresh`,failure ref 为空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不反写真相 | freshness state 只能影响 query degraded surface、projection maintenance 和 job report,不得修改 Governance core truth |
| 不替代 public view DTO | 本对象只保存 view state;`GovernanceDashboardView`、`PolicyEffectiveView`、`ControlCoverageView` 等 view body 留给 §15 / Step 8 |
| 不保存 projection body | 不保存 dashboard、policy list、control list、nonconformity list 或 search result body |
| 失败原因不内联 | `last_failure_ref` 指向 failure marker / job report item;错误详情、adapter log、stack trace 不进入本对象 |
| query no-write | Query 只能读取本对象并返回 freshness / degraded marker,不得调用 `mark_stale`、`start_rebuild` 或 `mark_fresh` 修复状态 |
| rebuild 不修复 truth | `mark_fresh(...)` 只说明 projection 已追上 cursor,不表示 truth 被修复或重新批准 |
| HLD factory 补入 cursor | HLD 写 `for_view(view_ref)`,但对象必填 `source_cursor`;为满足字段来源闭环,正式落码 factory 必须接收 `GovernanceTruthCursor` |
| HLD failure reason 映射为 ref | HLD 写 `mark_failed(DerivedViewFailureReason)`,但对象字段是 `last_failure_ref`;正式落码用已持久化 `DerivedViewFailureRef`,failure reason 由 failure marker / job report 承载 |

#### 13.2 external snapshot / mirror object contracts

`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef` 和 `RuntimeSignalRef` 已在 §10.5~§10.6 定义为 `contracts` shared value object,不是 domain-only truth。原因是这些对象会穿过 command precheck、query degraded surface、consumer receipt、job report、policy guard 和 view DTO。`domain` 对象直接复用这些 shared type,不得在 `domain::reference` 中再定义字段相同但状态或 factory 不同的 mirror struct。

| shared object | domain 使用位置 | 写入 owner | 读取 / 消费方 | 不变量 |
|---|---|---|---|---|
| `ActorCapabilitySnapshot` | `ApprovalResponsibility::assign(...)`、`ApproverRequirement::matches(...)`、`ApprovalResponsibilityPolicy` | identity / capability consumer 或 refresh job | responsibility command、approval query、reconciliation | 不保存 identity body;不直接授权平台动作 |
| `MethodPolicySnapshot` | `PolicyEffectiveFact::propose(...)`、`activate(...)`、policy guard | method policy consumer 或 refresh job | policy command、policy effective view、reconciliation | 不保存 AIPolicyDef body;不形成 Policy truth |
| `MethodControlSnapshot` | `ControlApplicability::assess(...)`、control / compliance policy | method control consumer 或 refresh job | control command、coverage view、reconciliation | 不保存 standard / control body;不替代 applicability truth |
| `EvidenceSummaryRef` | decision basis、control review、AIIA / SoA review、corrective completion、verification | artifact / evidence resolver 或 consumer | domain command / policy / trace / query | 不保存 evidence body;verified 语义必须有 digest/source |
| `ProcessGovernanceContextRef` | governance context input、waiting decision source、trace subject helper | process consumer / resolver | context command、decision command、query / trace | 不拥有 process truth;不替代 waiting gate |
| `WorkGovernanceContextRef` | corrective action work collaboration、work-driven governance input | work consumer / resolver | nonconformity / corrective command、policy query | 不拥有 Work truth;blocker 不等同 nonconformity |
| `RuntimeSignalRef` | pending governance input、runtime risk source、trace source helper | runtime / capability consumer | input command、policy guard、query degraded surface | 不保存 runtime log;不反向定义 Policy truth |

| 正式落码口径 | 说明 |
|---|---|
| shared type 单一来源 | Rust 实现应放在 `contracts::refs` 或等价 shared module;`domain` 通过 import 复用 |
| state 由 `ReferenceResolutionState` 承载 | resolved / unresolved / stale / invalid / unavailable 不在各 snapshot 里重复定义 enum |
| stale 需要 checked_at | `mark_stale(...)` 必须接收 `ReferenceCheckedAt`,最终调用 embedded `ReferenceResolutionState.mark_stale(...)` |
| factory 必须接收 resolution state | snapshot / context / signal factory 必须接收已构造 `ReferenceResolutionState`,不得在对象内部自行生成 checked time 或 reference state |
| body-free | 所有 external mirror 只保存 ref、version、summary ref、digest、kind、captured_at 和 resolution state;不得保存 sibling 仓正文 |
| consumer 不写 core truth | external consumer 只能 upsert snapshot / reference state / stale marker / receipt,不得直接创建 `GovernanceDecision`、`PolicyEffectiveFact`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion` 或 `NonconformityRecord` |
| query no-write | query 可以读取 snapshot state 并返回 degraded / freshness / visibility marker,不得刷新 snapshot 或修复 stale state |
| duplicate replay | consumer duplicate 必须返回已存 receipt / marker refs,不得根据当前 snapshot 重新计算结果 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `from_identity(...)`、`from_method_library(...)`、`from_process(...)`、`from_work(...)`、`from_runtime(...)` 增加 `ReferenceResolutionState` 入参 | HLD 字段要求保存 `snapshot_state` / `signal_state`;factory 必须覆盖必填字段 |
| `ProcessGovernanceContextRef::from_process(...)` 增加 `waiting_gate_ref` 入参 | HLD 字段包含 optional waiting gate;factory 必须允许 process waiting 语境闭合 |
| `WorkGovernanceContextRef::from_work(...)` 增加 `iteration_ref` 入参 | HLD 字段包含 optional iteration;factory 必须允许 iteration governance context 闭合 |
| 所有 `mark_stale(reason)` 收口为 `mark_stale(reason, checked_at)` | embedded `ReferenceResolutionState.mark_stale(...)` 需要 `ReferenceCheckedAt`;不得由 object 自行读取 clock |
| `EvidenceSummaryRef` 不进入 §13 domain mirror | 它是 contracts reference object,且已在 §10.5 完整闭合;domain 只消费它 |

#### 13.3 trace / audit record object contracts

`GovernanceTraceRecord` 和 `GovernanceAuditTrail` 是 append-only trace / audit surface,用于连接 accepted Governance truth change、consumer marker、job report、handoff 和 query trace。它们不表达当前业务状态,也不保存相邻仓正文。分布式 trace 关联使用 L0-core 已正式提供的 `TraceId`,本 Step 只引用,不得在 Governance 重新定义额外 trace context wrapper 或等价字段。

##### `GovernanceTraceRecord`

```rust
/// Records trace metadata for an accepted Governance change or marker.
pub struct GovernanceTraceRecord {
    /// Stable trace record id generated by the application layer.
    pub trace_id: GovernanceTraceId,
    /// Subject represented by this trace record.
    pub subject_ref: GovernanceTraceSubjectRef,
    /// Trace category used by query, audit, and handoff flows.
    pub trace_kind: GovernanceTraceKind,
    /// Core distributed trace id propagated from command, event, or job metadata.
    pub core_trace_id: TraceId,
    /// Source cursor reached by the accepted change when available.
    pub source_cursor: Option<GovernanceTruthCursor>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `trace_id` | `GovernanceTraceId` | trace record identity | application id generator 生成;domain 不自行生成 |
| `subject_ref` | `GovernanceTraceSubjectRef` | 被追溯对象 | accepted truth path 从 Step 7 mapper 返回的 `trace_subject_ref` 取得,且必须与 `GovernanceTruthChange.subject_ref` 包装同一个 canonical key;consumer marker / job / handoff 使用正式 marker subject;不保存正文 |
| `trace_kind` | `GovernanceTraceKind` | 追溯类别 | 非空 newtype;由 factory input 或 flow 常量提供;不驱动业务状态 |
| `core_trace_id` | `TraceId` | L0-core distributed trace 关联 | 来自 `CommandMetadata.request.trace_id`、`QueryMetadata.request.trace_id`、event envelope traceparent 或 job metadata;不得本仓重新定义额外 trace context wrapper |
| `source_cursor` | `Option<GovernanceTruthCursor>` | accepted change 后的 cursor | truth change path 必须为 `Some(change.source_cursor)`;consumer / job marker 若无 truth cursor 可为 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceTraceRecordRef` | 生成 trace ref | 无 | `GovernanceTraceRecordRef` | 纯函数;复制 `trace_id` |
| `pub fn relates_to(&self, subject_ref: &GovernanceTraceSubjectRef) -> bool` | 判断是否属于指定 subject | trace subject | `bool` | 纯判断;不读取 subject truth |
| `pub fn requires_archive(&self) -> bool` | 判断是否需要归档交接 | 无 | `bool` | 依据 `trace_kind` / policy marker 判断;不调用 archive port |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth_change(trace_id: GovernanceTraceId, change: &GovernanceTruthChange, trace_subject_ref: GovernanceTraceSubjectRef, trace_kind: GovernanceTraceKind, core_trace_id: TraceId) -> Result<Self, DomainError>` | 从已成立 truth change 构造 trace | application generated id、accepted truth change、same-key trace subject、trace kind、core trace id | `Result<GovernanceTraceRecord, DomainError>` | command accepted path;`trace_subject_ref` 必须来自同一 Step 7 mapper result,并与 `change.subject_ref` 包装同一个 canonical key;`source_cursor = Some(change.source_cursor)` |
| `pub fn from_marker(trace_id: GovernanceTraceId, subject_ref: GovernanceTraceSubjectRef, trace_kind: GovernanceTraceKind, core_trace_id: TraceId, source_cursor: Option<GovernanceTruthCursor>) -> Result<Self, DomainError>` | 从 consumer / job marker 构造 trace | generated id、formal marker subject、kind、core trace id、optional cursor | `Result<GovernanceTraceRecord, DomainError>` | consumer accepted marker、rebuild / refresh / reconciliation job marker |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 truth 当前状态 | 当前业务状态仍由 `GovernanceContext`、`Gate`、`GovernanceDecision` 等 truth object 表达 |
| 不保存外部正文 | artifact、conversation、runtime log、observability body、archive package body 不进入 trace |
| id 来源必须显式 | HLD factory 未列出 trace id;正式落码必须接收 application generated `GovernanceTraceId` |
| truth change 不携带 trace ref | `GovernanceTruthChange` 不再包含 `trace_ref`;否则 `GovernanceTraceRecord::from_truth_change(...)` 会循环依赖 |
| query no-write | trace query 只读取 trace record,不得创建 missing trace 或修复 audit trail |
| handoff 不改变 trace | HLD 提到 `prepare_handoff(target_ref)`,但本 Step 尚未闭合 handoff intent / record 输入;正式 handoff prepare method 延后到 handoff marker / job contract 批次,不得在 trace record 中临时新增未定义 `TraceHandoffIntent` |

##### `GovernanceAuditTrail`

```rust
/// Aggregates trace record refs for one Governance audit subject.
pub struct GovernanceAuditTrail {
    /// Stable audit trail id generated by the application layer.
    pub audit_trail_id: GovernanceAuditTrailId,
    /// Subject covered by this audit trail.
    pub subject_ref: GovernanceAuditSubjectRef,
    /// Ordered trace records linked to the subject.
    pub record_refs: GovernanceTraceRecordRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `audit_trail_id` | `GovernanceAuditTrailId` | audit trail identity | 首次 `start_for_subject(...)` 时由 application id generator 提供;更新既有 audit trail 时必须通过 `GovernanceAuditHistoryRepository.get_audit_trail_by_subject_with_version(subject_ref)` 按 `subject_ref` 唯一键读取既有 `audit_trail_id` 和 version;不得从 `GovernanceAuditSubjectRef` 派生或拼接 |
| `subject_ref` | `GovernanceAuditSubjectRef` | 审计对象 | command accepted path 从 Step 7 mapper 返回的 `audit_subject_ref` 取得,且与 trace / outbox subject 包装同一个 canonical key;report / job marker subject 必须有对应正式 mapper | 不表达当前状态 |
| `record_refs` | `GovernanceTraceRecordRefSet` | 关联 trace refs | ordered unique;append-only;只保存 ref,不保存 trace body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceAuditTrailRef` | 生成 audit trail ref | 无 | `GovernanceAuditTrailRef` | 纯函数;复制 `audit_trail_id` |
| `pub fn append(&mut self, record: &GovernanceTraceRecord) -> Result<(), DomainError>` | 追加 trace ref | loaded trace record | `Result<(), DomainError>` | record subject 必须与本 audit subject 使用同一个 canonical key;按 trace id 去重;保持原有顺序 |
| `pub fn has_gap(&self) -> bool` | 判断审计链是否存在缺口 | 无 | `bool` | Step 11 persistence / Step 12 error recovery 负责定义 gap marker 来源;本函数只读现有 marker / ordering |
| `pub fn covers_subject(&self, subject_ref: &GovernanceAuditSubjectRef) -> bool` | 判断是否覆盖指定审计对象 | audit subject | `bool` | 纯判断 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start_for_subject(audit_trail_id: GovernanceAuditTrailId, subject_ref: GovernanceAuditSubjectRef) -> Result<Self, DomainError>` | 为对象建立审计链 | application generated id、audit subject | `Result<GovernanceAuditTrail, DomainError>` | 仅在 `get_audit_trail_by_subject_with_version(subject_ref)` 返回 `None` 时用于首次创建;`record_refs` 初始为空 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 truth repository | audit trail 只追溯已发生记录,不表达当前业务状态 |
| 不成为 observability ledger | 物理日志、span、metric、external observability ledger 归 L4-observability 或 adapter |
| 不保存 trace body | audit trail 只保存 trace refs;trace 详情由 `GovernanceTraceRecord` 读取 |
| append-only | 不删除、不重排已有 `record_refs`;更正必须追加新 trace / audit marker |
| gap 不由 query 修复 | `has_gap()` 暴露缺口,修复 / rebuild 口径留给 Step 11 / Step 12 / job flow |

#### 13.4 `GovernanceOutboxRecord`

`GovernanceOutboxRecord` 是 command accepted transaction 内生成的传播记录。它表达“某个已成立 Governance truth change 需要被 outbound event / handoff / downstream consumer 看到”,但不决定 truth 是否成立,也不保存 sibling 仓正文。Publisher 只允许基于已持久化 outbox source 发布,并且只能更新 publication state。

##### `GovernanceOutboxRecord`

```rust
/// Records an accepted Governance truth change waiting for outbound publication.
pub struct GovernanceOutboxRecord {
    /// Stable outbox id generated by the application layer.
    pub outbox_id: GovernanceOutboxId,
    /// Event kind derived from the accepted truth change.
    pub event_kind: GovernanceOutboxEventKind,
    /// Subject changed by the accepted truth change.
    pub subject_ref: GovernanceOutboxSubjectRef,
    /// Current publication lifecycle state.
    pub publication_state: OutboxPublicationState,
    /// Source cursor after the accepted truth change.
    pub source_cursor: GovernanceTruthCursor,
    /// Trace record created in the same accepted transaction.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Publication receipt captured after a successful publish.
    pub publication_ref: Option<OutboxPublicationRef>,
    /// Latest retryable publication failure reason.
    pub last_failure_reason: Option<OutboxFailureReason>,
    /// Permanent dead-letter reason when publication can no longer retry.
    pub dead_letter_reason: Option<OutboxDeadLetterReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `outbox_id` | `GovernanceOutboxId` | outbox record identity | command accepted path 从 application id generator 取得;domain 不自行生成 |
| `event_kind` | `GovernanceOutboxEventKind` | outbound event / propagation kind | 从 accepted `GovernanceTruthChange.event_kind` 复制;非空;不替代 event schema version |
| `subject_ref` | `GovernanceOutboxSubjectRef` | 变化对象 | 从 accepted `GovernanceTruthChange.subject_ref` 复制;不保存 subject body |
| `publication_state` | `OutboxPublicationState` | 发布 lifecycle state | 初始为 `Pending`;只能按 §10.14 和 Step 9 / Step 10 允许迁移更新 |
| `source_cursor` | `GovernanceTruthCursor` | truth change 提交后的 source position | 从 accepted `GovernanceTruthChange.source_cursor` 复制;用于 publisher / reconciliation / trace 对齐,不作为 optimistic version |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted transaction 的 trace 记录 | application 先构造并保存 `GovernanceTraceRecord`,再把 ref 传入 outbox factory;不由 outbox 反向生成 trace |
| `publication_ref` | `Option<OutboxPublicationRef>` | 发布成功回执 | `mark_published(...)` 写入;`Published` 必须为 `Some`;其他状态必须为 `None` |
| `last_failure_reason` | `Option<OutboxFailureReason>` | 最近一次可重试失败原因 | `mark_failed(...)` 写入;`retry(...)` 保留;`Published` 后可继续保留为历史可见上下文,当前状态仍以 `publication_state` 为准 |
| `dead_letter_reason` | `Option<OutboxDeadLetterReason>` | 不可恢复失败原因 | `mark_dead_lettered(...)` 写入;仅 `DeadLettered` 可为 `Some` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceOutboxRef` | 生成 outbox ref | 无 | `GovernanceOutboxRef` | 纯函数;复制 `outbox_id` |
| `pub fn is_pending(&self) -> bool` | 判断是否等待发布 | 无 | `bool` | 仅 `Pending` 返回 true |
| `pub fn is_terminal(&self) -> bool` | 判断发布生命周期是否终态 | 无 | `bool` | `Published` / `DeadLettered` 返回 true |
| `pub fn can_retry(&self) -> bool` | 判断是否可重新进入待发布 | 无 | `bool` | 仅 `Failed` 返回 true;`DeadLettered` 不可自动重试 |
| `pub fn mark_published(&mut self, publication_ref: OutboxPublicationRef) -> Result<(), DomainError>` | 标记发布成功 | publisher / bus adapter 返回的 publication ref | `Result<(), DomainError>` | 允许 `Pending -> Published`;写入 `publication_ref`;不得改变 truth / trace / source cursor |
| `pub fn mark_failed(&mut self, reason: OutboxFailureReason) -> Result<(), DomainError>` | 记录可重试发布失败 | publisher / bus adapter failure reason | `Result<(), DomainError>` | 允许 `Pending -> Failed`;写入 `last_failure_reason`;不回滚 accepted truth |
| `pub fn retry(&mut self) -> Result<(), DomainError>` | 将失败记录重新放回待发布 | 无 | `Result<(), DomainError>` | 允许 `Failed -> Pending`;保留 `last_failure_reason` 供 operations visibility |
| `pub fn mark_dead_lettered(&mut self, reason: OutboxDeadLetterReason) -> Result<(), DomainError>` | 标记不可恢复发布失败 | retry policy / fatal publisher reason | `Result<(), DomainError>` | 允许 `Pending` / `Failed -> DeadLettered`;写入 `dead_letter_reason`;终态 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth_change(outbox_id: GovernanceOutboxId, change: &GovernanceTruthChange, trace_ref: GovernanceTraceRecordRef) -> Result<Self, DomainError>` | 从已成立 truth change 构造 outbox | application generated id、accepted truth change、同事务 trace ref | `Result<GovernanceOutboxRecord, DomainError>` | command accepted path;初始 `publication_state = Pending`;publication / failure / dead-letter 字段为空 |

| 状态迁移 | 触发 | 必须写入 | 禁止副作用 |
|---|---|---|---|
| `Pending -> Published` | publisher success | `publication_ref` | 不重算 event payload;不修改 truth、trace、audit 或 projection |
| `Pending -> Failed` | retryable publisher failure | `last_failure_reason` | 不回滚 truth;不删除 outbox |
| `Failed -> Pending` | retry scheduled | 保留 `last_failure_reason` | 不清除历史失败可见性;不改变 `source_cursor` |
| `Pending / Failed -> DeadLettered` | unrecoverable publish failure | `dead_letter_reason` | 不自动重新发布;不改变 accepted truth |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 只从 accepted truth change 构造 | validation failure、policy denial、query、consumer pending marker 不得伪造 `GovernanceOutboxRecord` |
| outbox 不决定 truth 成立 | truth 已经在同一 command accepted transaction 中成立;发布失败不能撤销 decision、policy、control、conclusion 或 nonconformity truth |
| 不保存 sibling body | 不保存 method policy body、control definition body、artifact evidence body、process/work truth、conversation、runtime log 或 external GRC body |
| 不保存完整 event payload 字段 | HLD 明确详细 event schema 留给详细设计;Step 8 必须定义 outbound payload / envelope / snapshot 口径后,Step 11 再闭合持久化形态 |
| publisher 不重算 truth | publish job 不得按 current truth 重新构造 payload;必须从 outbox id 关联的已持久化 event source / payload snapshot 发布 |
| trace ref 不反向生成 | outbox 只引用已经创建的 `GovernanceTraceRecordRef`;不得在 `from_truth_change(...)` 内部生成 trace id 或 trace record |
| source cursor opaque | `source_cursor` 只用于排序、对齐和追溯,不得解析成业务状态或 optimistic version |
| terminal state 不可修改 | `Published` / `DeadLettered` 后不得再次 `mark_failed`、`retry` 或 `mark_published` |
| query no-write | operations / query 只能读取 outbox state,不得在读取路径修复 publish state |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `from_truth_change(...)` 增加 `GovernanceOutboxId` 入参 | HLD factory 未列出 id,但 object 必填 `outbox_id`;正式落码必须由 application id generator 提供 |
| `from_truth_change(...)` 增加 `GovernanceTraceRecordRef` 入参 | accepted path 必须能把 truth、trace、audit、outbox 串联;同时避免 `GovernanceTruthChange` 携带 trace ref 造成循环依赖 |
| 增加 `source_cursor` 字段 | `GovernanceTruthChange` 已正式承载 cursor;outbox publication、reconciliation 和 trace 对齐需要固定提交位置 |
| 增加 publication / failure / dead-letter marker 字段 | HLD 方法要求记录 published / failed / dead-letter 结果;这些结果必须有持久化字段承载,不能只靠 state enum |
| 不在本批新增 payload body 字段 | HLD 禁止保存 event payload 全字段;payload DTO、snapshot ref / sidecar 或 envelope 存储口径必须在 Step 8 / Step 11 闭合 |

#### 13.5 history record object contracts

History record 是 accepted truth transition 的 append-only 追溯对象。它们不表达当前状态,不反写 truth,不保存外部正文,也不替代 `GovernanceTraceRecord`。Command flow 在 truth transition 成功后、同一 transaction 内追加 history record,并通过 trace / audit / outbox / stale marker 串联后续可见性。

本节分批写入六类 history record。6.4-5a 已闭合 Gate / Decision 与 Approval / Responsibility 主线:`DecisionRecord`、`ResponsibilityTraceRecord`。6.4-5b 已闭合 Policy / Shared Rules / Conflict 与 Control / Review 主线:`PolicyChangeRecord`、`ControlChangeRecord`。6.4-5c 继续闭合 Compliance Conclusion 与 Nonconformity Corrective 主线:`ComplianceConclusionRecord`、`NonconformityChangeRecord`。由于 change kind 当前按 HLD 只能收口为非空 newtype,任何“是否终态”“是否进入 audit”“是否触发不符合”“是否归档交接”“是否追溯交接”的判断不得靠解析字符串,必须由 record 字段、truth state 或 policy guard 明确承载。

##### `DecisionRecord`

```rust
/// Records one append-only change for a formal Governance decision.
pub struct DecisionRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: DecisionRecordId,
    /// Decision affected by this history record.
    pub decision_ref: GovernanceDecisionRef,
    /// Change category produced by the decision transition.
    pub change_kind: DecisionChangeKind,
    /// Decision state after the accepted transition.
    pub resulting_state: GovernanceDecisionState,
    /// Evidence basis associated with the change when available.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Actor who performed or accepted the change.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `DecisionRecordId` | decision history identity | decision change flow 从 application id generator 取得;domain 不自行生成 |
| `decision_ref` | `GovernanceDecisionRef` | 被追溯的 decision | 从 loaded / transitioned `GovernanceDecision.to_ref()` 取得;不保存 decision body |
| `change_kind` | `DecisionChangeKind` | 变化类别 | 来源于 decision transition / command flow;非空 newtype;不替代 `GovernanceDecisionState` |
| `resulting_state` | `GovernanceDecisionState` | 变化完成后的 decision state | 从 transitioned `GovernanceDecision.decision_state` 复制;用于 `is_terminal_change()` 可落码 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 | approve / compliance basis 等路径可为 `Some`;propose / supersede / revoke 可按 command basis 为空或另由 reason 字段在 truth object 承载 |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context 或 accepted service actor;不保存 actor profile |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory;history 不生成 trace |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> DecisionRecordRef` | 生成 history ref | 无 | `DecisionRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to(&self, decision_ref: &GovernanceDecisionRef) -> bool` | 判断是否属于指定 decision | decision ref | `bool` | 纯判断;不读取 decision repository |
| `pub fn is_terminal_change(&self) -> bool` | 判断是否导致 terminal decision state | 无 | `bool` | 依据 `resulting_state` 判断 `Superseded` / `Revoked`;不解析 `change_kind` 字符串 |
| `pub fn has_basis(&self) -> bool` | 判断是否携带 evidence basis | 无 | `bool` | 纯判断;不读取 evidence body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_decision_change(record_id: DecisionRecordId, decision: &GovernanceDecision, change_kind: DecisionChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef) -> Result<Self, DomainError>` | 从 accepted decision transition 构造 history | generated id、transitioned decision、change kind、actor、trace ref | `Result<DecisionRecord, DomainError>` | `RecordGovernanceDecision` / supersede / revoke path;`resulting_state` 从 decision 复制;`basis_ref` 从 decision basis 复制 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `DecisionRecord`;纠错必须追加新 record 和 trace |
| 不修改 Decision | record 只追溯变化;当前 truth 仍以 `GovernanceDecision` 为准 |
| 不保存 outcome body | `GovernanceDecisionOutcomeRef` 和完整 event / result payload 留给 decision truth / Step 8 |
| 不保存 evidence body | `basis_ref` 只引用 evidence summary;正文归 artifact / evidence boundary |
| 不解析 change kind | HLD 未给 `DecisionChangeKind` 变体表;终态判断必须使用 `resulting_state` |
| trace ref 显式传入 | history factory 不生成 trace id;避免 trace / history 循环依赖 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `DecisionRecordId` | object 必填 `record_id`;id 必须由 application generator 提供 |
| factory 增加 `GovernanceTraceRecordRef` | accepted transaction 需要把 truth / history / trace 串联;history 不自行生成 trace |
| 增加 `resulting_state` 字段 | `is_terminal_change()` 不能解析 `DecisionChangeKind(pub String)`;必须有正式 state 来源 |
| 增加 `actor_ref` 字段 | HLD factory 入参已有 actor,但字段表未列出;追溯对象必须保存执行 actor ref |

##### `ResponsibilityTraceRecord`

```rust
/// Records one append-only change for an approval responsibility.
pub struct ResponsibilityTraceRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: ResponsibilityTraceRecordId,
    /// Responsibility affected by this history record.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Change category produced by the responsibility transition.
    pub change_kind: ResponsibilityChangeKind,
    /// Responsibility state after the accepted transition.
    pub resulting_state: ApprovalResponsibilityState,
    /// Actor who performed, received, voted, delegated, or released the responsibility.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Whether this change must be linked into the audit trail.
    pub audit_required: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `ResponsibilityTraceRecordId` | responsibility history identity | responsibility change flow 从 application id generator 取得;domain 不自行生成 |
| `responsibility_ref` | `ApprovalResponsibilityRef` | 被追溯的 responsibility | 从 loaded / transitioned `ApprovalResponsibility.to_ref()` 取得;不保存 responsibility body |
| `change_kind` | `ResponsibilityChangeKind` | 责任变化类别 | 来源于 responsibility transition / command flow;非空 newtype;`OpenGovernanceGateFlow` requirement path 使用 `responsibility-required` 或 `responsibility-assigned` |
| `resulting_state` | `ApprovalResponsibilityState` | 变化完成后的 responsibility state | 从 transitioned `ApprovalResponsibility.responsibility_state` 复制;不解析 change kind |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context、assigned actor、delegate actor 或 accepted service actor;不保存 identity body |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory |
| `audit_required` | `bool` | 是否必须进入 audit trail | 由 responsibility flow / policy guard 明确传入;不得由实现解析 `change_kind` 字符串决定 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ResponsibilityTraceRecordRef` | 生成 history ref | 无 | `ResponsibilityTraceRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to(&self, responsibility_ref: &ApprovalResponsibilityRef) -> bool` | 判断是否属于指定 responsibility | responsibility ref | `bool` | 纯判断;不读取 responsibility repository |
| `pub fn requires_audit(&self) -> bool` | 判断是否需要进入 audit trail | 无 | `bool` | 返回 `audit_required`;不解析 `change_kind` |
| `pub fn is_released(&self) -> bool` | 判断是否导致 released state | 无 | `bool` | 依据 `resulting_state == Released`;不读取当前 responsibility |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_responsibility_change(record_id: ResponsibilityTraceRecordId, responsibility: &ApprovalResponsibility, change_kind: ResponsibilityChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, audit_required: bool) -> Result<Self, DomainError>` | 从 accepted responsibility transition 构造 history | generated id、transitioned responsibility、change kind、actor、trace ref、audit flag | `Result<ResponsibilityTraceRecord, DomainError>` | `OpenGovernanceGateFlow` requirement path、assign / accept / vote / delegate / release path;`resulting_state` 从 responsibility 复制 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `ResponsibilityTraceRecord`;纠错必须追加新 record |
| 不替代 responsibility 当前状态 | 当前责任状态仍以 `ApprovalResponsibility` 为准 |
| 不保存 identity body | `actor_ref` 只保存 actor ref;profile、role、capability 和 credential 归 identity boundary |
| audit flag 来源显式 | `requires_audit()` 不得由实现自造 change kind 分类;必须使用 factory 入参或后续正式 policy 结果 |
| trace ref 显式传入 | history factory 不生成 trace id,也不创建 audit trail |
| vote 不等同 decision | responsibility vote / release history 不能被当作 `GovernanceDecisionState::Approved` |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `ResponsibilityTraceRecordId` | object 必填 `record_id`;id 必须由 application generator 提供 |
| factory 增加 `GovernanceTraceRecordRef` | accepted transaction 需要统一串联 trace / history / audit |
| 增加 `resulting_state` 字段 | state 可落码,且避免解析 `ResponsibilityChangeKind(pub String)` |
| 增加 `audit_required` 字段 | HLD 要求 `requires_audit()`,但没有 change kind 变体表;必须由正式输入承载判断结果 |

##### `PolicyChangeRecord`

```rust
/// Records one append-only change for policy, shared rules, or policy conflict handling.
pub struct PolicyChangeRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: PolicyChangeRecordId,
    /// Policies affected by this history record.
    pub policy_refs: PolicyEffectiveFactRefSet,
    /// Shared rule set affected by this history record, when any.
    pub shared_rule_set_ref: Option<SharedRuleSetRef>,
    /// Policy conflict affected by this history record, when any.
    pub conflict_ref: Option<PolicyConflictRef>,
    /// Change category produced by the policy-side transition.
    pub change_kind: PolicyChangeKind,
    /// Policy fact state after the accepted transition when a policy fact changed.
    pub resulting_policy_state: Option<PolicyEffectiveState>,
    /// Shared rule set state after the accepted transition when shared rules changed.
    pub resulting_rule_set_state: Option<SharedRuleSetState>,
    /// Policy conflict state after the accepted transition when a conflict changed.
    pub resulting_conflict_state: Option<PolicyConflictState>,
    /// Actor who performed or accepted the change.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `PolicyChangeRecordId` | policy history identity | policy / shared rules / conflict change flow 从 application id generator 取得;domain 不自行生成 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | 被追溯的 policy fact refs | policy change path 包含一个 ref;conflict path 从 `PolicyConflictRecord.conflicting_policy_refs` 复制;ordered unique |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 被追溯的 shared rule set | shared rules path 或 shared-rule conflict path 写入;不保存 rule body |
| `conflict_ref` | `Option<PolicyConflictRef>` | 被追溯的 policy conflict | conflict handling path 写入;不保存 conflict body |
| `change_kind` | `PolicyChangeKind` | policy-side 变化类别 | 来源于 policy fact、shared rule set 或 conflict transition;非空 newtype |
| `resulting_policy_state` | `Option<PolicyEffectiveState>` | policy fact 变化后的 state | `from_policy_change(...)` 从 transitioned policy fact 复制;其他路径为空 |
| `resulting_rule_set_state` | `Option<SharedRuleSetState>` | shared rules 变化后的 state | `from_shared_rules_change(...)` 从 transitioned rule set 复制;其他路径为空 |
| `resulting_conflict_state` | `Option<PolicyConflictState>` | conflict 变化后的 state | `from_conflict_change(...)` 从 transitioned conflict record 复制;其他路径为空 |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context 或 accepted service actor;不保存 actor profile |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> PolicyChangeRecordRef` | 生成 history ref | 无 | `PolicyChangeRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to_policy(&self, policy_ref: &PolicyEffectiveFactRef) -> bool` | 判断是否影响指定 policy fact | policy ref | `bool` | 纯判断;在 `policy_refs` 中按 id 匹配 |
| `pub fn relates_to_shared_rules(&self, rule_set_ref: &SharedRuleSetRef) -> bool` | 判断是否影响指定 shared rules | shared rule set ref | `bool` | 纯判断;不读取 rule set repository |
| `pub fn relates_to_conflict(&self, conflict_ref: &PolicyConflictRef) -> bool` | 判断是否影响指定 conflict | conflict ref | `bool` | 纯判断;不读取 conflict repository |
| `pub fn has_subject(&self) -> bool` | 判断记录是否至少有一个追溯主体 | 无 | `bool` | policy refs 非空、shared rule set 存在或 conflict 存在时返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_policy_change(record_id: PolicyChangeRecordId, policy_fact: &PolicyEffectiveFact, change_kind: PolicyChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef) -> Result<Self, DomainError>` | 从 accepted policy fact transition 构造 history | generated id、transitioned policy fact、change kind、actor、trace ref | `Result<PolicyChangeRecord, DomainError>` | activate / suspend / supersede / retire policy fact path;policy refs 包含一个 ref |
| `pub fn from_shared_rules_change(record_id: PolicyChangeRecordId, rule_set: &SharedRuleSet, change_kind: PolicyChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef) -> Result<Self, DomainError>` | 从 accepted shared rule set transition 构造 history | generated id、transitioned shared rule set、change kind、actor、trace ref | `Result<PolicyChangeRecord, DomainError>` | draft / activate / add rule / deprecate / retire shared rules path |
| `pub fn from_conflict_change(record_id: PolicyChangeRecordId, conflict: &PolicyConflictRecord, change_kind: PolicyChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef) -> Result<Self, DomainError>` | 从 accepted policy conflict transition 构造 history | generated id、transitioned conflict record、change kind、actor、trace ref | `Result<PolicyChangeRecord, DomainError>` | detect / pending decision / resolve / waive / invalidate conflict path |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `PolicyChangeRecord`;纠错必须追加新 record |
| 不修改 policy truth | record 只追溯变化;当前 truth 仍以 `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord` 为准 |
| 不保存 policy / rule body | method policy definition、shared rule expression、standard body 和 external GRC body 不进入 history |
| 至少一个主体 | `policy_refs`、`shared_rule_set_ref`、`conflict_ref` 不得同时为空 |
| 不解析 change kind | HLD 未给 `PolicyChangeKind` 变体表;状态判断必须使用 resulting state 字段 |
| trace ref 显式传入 | history factory 不生成 trace id,也不创建 outbox |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `policy_ref: Option<PolicyEffectiveFactRef>` 收口为 `policy_refs: PolicyEffectiveFactRefSet` | conflict handling 可能涉及多个 policy fact;set 仍覆盖单 policy path |
| 增加 `conflict_ref` | HLD 责任包含冲突处理;不能把 conflict identity 塞进 `PolicyChangeKind(pub String)` |
| 增加 resulting state 字段 | change kind 无正式变体表,必须保存变化后的 truth state 以支持查询 / 测试断言 |
| 增加 shared rules / conflict factory | HLD 只列 `from_policy_change(...)`,但字段和责任已经覆盖 shared rules / conflict;factory 必须覆盖所有正式主体 |
| 增加 `actor_ref` / `trace_ref` | accepted history 必须保存 actor ref 并串联 trace;不保存 actor body |

##### `ControlChangeRecord`

```rust
/// Records one append-only change for control applicability or control review.
pub struct ControlChangeRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: ControlChangeRecordId,
    /// Control applicability fact affected by this history record.
    pub control_ref: ControlApplicabilityRef,
    /// Control review affected by this history record, when any.
    pub review_ref: Option<ControlReviewRef>,
    /// Change category produced by the control-side transition.
    pub change_kind: ControlChangeKind,
    /// Applicability state after the accepted transition when applicability changed.
    pub resulting_applicability_state: Option<ControlApplicabilityState>,
    /// Review state after the accepted transition when review changed.
    pub resulting_review_state: Option<ControlReviewState>,
    /// Evidence basis associated with the change when available.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Actor who performed or accepted the change.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Whether this change may require a nonconformity flow.
    pub nonconformity_required: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `ControlChangeRecordId` | control history identity | control applicability / review flow 从 application id generator 取得;domain 不自行生成 |
| `control_ref` | `ControlApplicabilityRef` | 被追溯的 applicability fact | applicability path 从 `ControlApplicability.to_ref()` 取得;review path 从 `ControlReview.applicability_ref` 取得 |
| `review_ref` | `Option<ControlReviewRef>` | 被追溯的 review | review transition path 写入;applicability-only path 为空 |
| `change_kind` | `ControlChangeKind` | control-side 变化类别 | 来源于 applicability / review transition;非空 newtype |
| `resulting_applicability_state` | `Option<ControlApplicabilityState>` | applicability 变化后的 state | `from_control_change(...)` 从 transitioned applicability 复制;review path 为空 |
| `resulting_review_state` | `Option<ControlReviewState>` | review 变化后的 state | `from_review_change(...)` 从 transitioned review 复制;applicability path 为空 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 | applicability path 从 `basis_ref` 复制;review path 从 `evidence_ref` 复制;不保存 evidence body |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context、reviewer actor 或 accepted service actor;不保存 actor profile |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory |
| `nonconformity_required` | `bool` | 是否可能触发不符合处理 | 由 control flow / compliance policy 明确传入;不得由实现解析 `change_kind` 字符串决定 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ControlChangeRecordRef` | 生成 history ref | 无 | `ControlChangeRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to(&self, control_ref: &ControlApplicabilityRef) -> bool` | 判断是否属于指定 applicability fact | control applicability ref | `bool` | 纯判断;不读取 control repository |
| `pub fn relates_to_review(&self, review_ref: &ControlReviewRef) -> bool` | 判断是否属于指定 review | control review ref | `bool` | 纯判断;无 review ref 时返回 false |
| `pub fn requires_nonconformity(&self) -> bool` | 判断是否可能触发不符合 | 无 | `bool` | 返回 `nonconformity_required`;不解析 `change_kind` |
| `pub fn has_basis(&self) -> bool` | 判断是否携带 evidence basis | 无 | `bool` | 纯判断;不读取 evidence body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_control_change(record_id: ControlChangeRecordId, applicability: &ControlApplicability, change_kind: ControlChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, nonconformity_required: bool) -> Result<Self, DomainError>` | 从 accepted applicability transition 构造 history | generated id、transitioned applicability、change kind、actor、trace ref、nonconformity flag | `Result<ControlChangeRecord, DomainError>` | assess / mark applicable / not applicable / exclude / supersede path |
| `pub fn from_review_change(record_id: ControlChangeRecordId, review: &ControlReview, change_kind: ControlChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, nonconformity_required: bool) -> Result<Self, DomainError>` | 从 accepted control review transition 构造 history | generated id、transitioned review、change kind、actor、trace ref、nonconformity flag | `Result<ControlChangeRecord, DomainError>` | plan / start / pass / fail / waive / supersede review path |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `ControlChangeRecord`;纠错必须追加新 record |
| 不替代 ControlReview | review truth 仍由 `ControlReview` 表达;history 只追溯变化 |
| 不保存 control definition body | method control definition、standard body、evidence body 和 review notes 不进入 history |
| failure 不自动创建 nonconformity | `requires_nonconformity()` 只暴露后续 flow 需要;创建不符合必须走 `NonconformityRecord` command flow |
| nonconformity flag 来源显式 | HLD 未给 `ControlChangeKind` 变体表;不得靠字符串匹配 fail / violation |
| trace ref 显式传入 | history factory 不生成 trace id,也不创建 audit trail |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `ControlChangeRecordId` | object 必填 `record_id`;id 必须由 application generator 提供 |
| 增加 `review_ref` / `from_review_change(...)` | HLD 责任包含 review 变化,而 `ControlReview` 是独立 truth;history 必须能定位 review |
| 增加 resulting state 字段 | change kind 无正式变体表,必须保存变化后的 applicability / review state |
| 增加 `nonconformity_required` 字段 | HLD 要求 `requires_nonconformity()`,但没有 kind 变体;必须由正式输入承载判断结果 |
| 增加 `actor_ref` / `trace_ref` | accepted history 必须保存 actor ref 并串联 trace;不保存 actor body |

##### `ComplianceConclusionRecord`

```rust
/// Records one append-only change for an AIIA or SoA Governance conclusion.
pub struct ComplianceConclusionRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: ComplianceConclusionRecordId,
    /// Compliance conclusion affected by this history record.
    pub conclusion_ref: ComplianceConclusionRef,
    /// Change category produced by the conclusion transition.
    pub change_kind: ComplianceConclusionChangeKind,
    /// Conclusion state after the accepted transition.
    pub resulting_state: ComplianceConclusionState,
    /// Evidence basis associated with the change when available.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Formal decision associated with approval, rejection, or revocation.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Actor who performed or accepted the change.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Whether this change must be prepared for archive handoff.
    pub archive_required: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `ComplianceConclusionRecordId` | compliance conclusion history identity | AIIA / SoA conclusion flow 从 application id generator 取得;domain 不自行生成 |
| `conclusion_ref` | `ComplianceConclusionRef` | 被追溯的 AIIA / SoA conclusion | 从 transitioned `AIIAConclusion.to_compliance_ref()` 或 `SoAConclusion.to_compliance_ref()` 取得 |
| `change_kind` | `ComplianceConclusionChangeKind` | conclusion 变化类别 | 来源于 conclusion transition;非空 newtype |
| `resulting_state` | `ComplianceConclusionState` | 变化完成后的 conclusion state | 从 transitioned conclusion 复制;不解析 change kind |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 | 从 conclusion `review_evidence_ref` 或 command evidence basis 复制;不保存 evidence body |
| `decision_ref` | `Option<GovernanceDecisionRef>` | approval / rejection / revocation 关联裁决 | 从 conclusion `decision_ref` 或 `revocation_decision_ref` 复制;draft / submit path 可为空 |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context 或 accepted service actor;不保存 actor profile |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory |
| `archive_required` | `bool` | 是否必须进入归档交接准备 | 由 conclusion flow / archive policy 明确传入;不得由实现解析 `change_kind` 字符串决定 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ComplianceConclusionRecordRef` | 生成 history ref | 无 | `ComplianceConclusionRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to(&self, conclusion_ref: &ComplianceConclusionRef) -> bool` | 判断是否属于指定 conclusion | compliance conclusion union ref | `bool` | 纯判断;union branch 和 id 必须同时匹配 |
| `pub fn requires_archive(&self) -> bool` | 判断是否需要归档交接 | 无 | `bool` | 返回 `archive_required`;不解析 `change_kind` |
| `pub fn has_decision_basis(&self) -> bool` | 判断是否携带正式裁决 | 无 | `bool` | `decision_ref.is_some()`;不读取 decision repository |
| `pub fn is_finalized_change(&self) -> bool` | 判断是否导致 finalized conclusion | 无 | `bool` | 依据 `resulting_state` 判断 `Approved` / `Rejected`;不解析 `change_kind` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_aiia_change(record_id: ComplianceConclusionRecordId, conclusion: &AIIAConclusion, change_kind: ComplianceConclusionChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, archive_required: bool) -> Result<Self, DomainError>` | 从 accepted AIIA conclusion transition 构造 history | generated id、transitioned AIIA conclusion、change kind、actor、trace ref、archive flag | `Result<ComplianceConclusionRecord, DomainError>` | submit / approve / reject / supersede / revoke AIIA path |
| `pub fn from_soa_change(record_id: ComplianceConclusionRecordId, conclusion: &SoAConclusion, change_kind: ComplianceConclusionChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, archive_required: bool) -> Result<Self, DomainError>` | 从 accepted SoA conclusion transition 构造 history | generated id、transitioned SoA conclusion、change kind、actor、trace ref、archive flag | `Result<ComplianceConclusionRecord, DomainError>` | submit / approve / reject / supersede / revoke SoA path |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `ComplianceConclusionRecord`;纠错必须追加新 record |
| 不替代 conclusion 当前状态 | 当前结论状态仍以 `AIIAConclusion` / `SoAConclusion` 为准 |
| 不保存 AIIA / SoA 正文 | artifact body、archive package、evidence body 和 review notes 不进入 history |
| archive flag 来源显式 | `requires_archive()` 不得由实现自造 change kind 分类;必须使用 factory 入参或正式 archive policy 结果 |
| decision basis 不内联 | record 只保存 `GovernanceDecisionRef`;decision body / outcome payload 留给 decision truth / Step 8 |
| trace ref 显式传入 | history factory 不生成 trace id,也不创建 archive handoff marker |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `ComplianceConclusionRecordId` | object 必填 `record_id`;id 必须由 application generator 提供 |
| 拆分 `from_aiia_change(...)` / `from_soa_change(...)` | conclusion union ref 需要从具体 truth object 生成,并复制各自字段 |
| 增加 `resulting_state` 字段 | change kind 无正式变体表,必须保存变化后的 conclusion state |
| 增加 `decision_ref` 字段 | approval / rejection / revocation 需要可追溯 formal decision,不能只放入 change kind |
| 增加 `archive_required` 字段 | HLD 要求 `requires_archive()`,但没有 kind 变体;必须由正式输入承载判断结果 |
| 增加 `actor_ref` / `trace_ref` | accepted history 必须保存 actor ref 并串联 trace;不保存 actor body |

##### `NonconformityChangeRecord`

```rust
/// Records one append-only change for a nonconformity corrective loop.
pub struct NonconformityChangeRecord {
    /// Stable history record id generated by the application layer.
    pub record_id: NonconformityChangeRecordId,
    /// Nonconformity affected by this history record.
    pub nonconformity_ref: NonconformityRef,
    /// Corrective action affected by this history record, when any.
    pub corrective_action_ref: Option<CorrectiveActionRef>,
    /// Verification result affected by this history record, when any.
    pub verification_ref: Option<VerificationResultRef>,
    /// Change category produced by the corrective-loop transition.
    pub change_kind: NonconformityChangeKind,
    /// Nonconformity state after the accepted transition when the record changed.
    pub resulting_nonconformity_state: Option<NonconformityState>,
    /// Corrective action state after the accepted transition when the action changed.
    pub resulting_action_state: Option<CorrectiveActionState>,
    /// Verification conclusion state when a verification result was recorded.
    pub resulting_verification_state: Option<VerificationState>,
    /// Evidence basis associated with the change when available.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Actor who performed or accepted the change.
    pub actor_ref: ActorRef,
    /// Trace record created for the same accepted change.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Whether this change closes the nonconformity loop.
    pub closure_change: bool,
    /// Whether this change must be included in trace handoff.
    pub trace_handoff_required: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `NonconformityChangeRecordId` | nonconformity history identity | nonconformity / corrective / verification flow 从 application id generator 取得;domain 不自行生成 |
| `nonconformity_ref` | `NonconformityRef` | 被追溯的不符合 | nonconformity path 从 `NonconformityRecord.to_ref()` 取得;action / verification path 从归属 ref 取得 |
| `corrective_action_ref` | `Option<CorrectiveActionRef>` | 被追溯的 corrective action | corrective action transition path 写入;其他路径为空 |
| `verification_ref` | `Option<VerificationResultRef>` | 被追溯的 verification result | verification path 写入;其他路径为空 |
| `change_kind` | `NonconformityChangeKind` | 不符合闭环变化类别 | 来源于 nonconformity / corrective / verification transition;非空 newtype |
| `resulting_nonconformity_state` | `Option<NonconformityState>` | nonconformity 变化后的 state | `from_nonconformity_change(...)` 从 transitioned record 复制;其他路径为空 |
| `resulting_action_state` | `Option<CorrectiveActionState>` | corrective action 变化后的 state | `from_corrective_action_change(...)` 从 transitioned action 复制;其他路径为空 |
| `resulting_verification_state` | `Option<VerificationState>` | verification result 结论 state | `from_verification_change(...)` 从 verification result 复制;其他路径为空 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 | action completion / verification path 从 evidence ref 复制;raise / cause / reopen / reject 可为空或由 source / reason 在 truth object 承载 |
| `actor_ref` | `ActorRef` | 执行动作 actor | 来自 command actor context、owner、verifier 或 accepted service actor;不保存 actor profile |
| `trace_ref` | `GovernanceTraceRecordRef` | 同一 accepted change 的 trace | application 先创建 trace record,再传入 history factory |
| `closure_change` | `bool` | 是否为关闭变化 | nonconformity close path 传入 true;不得由实现解析 `change_kind` |
| `trace_handoff_required` | `bool` | 是否需要 trace handoff | 由 nonconformity flow / handoff policy 明确传入;不得由实现解析 `change_kind` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> NonconformityChangeRecordRef` | 生成 history ref | 无 | `NonconformityChangeRecordRef` | 纯函数;复制 `record_id` |
| `pub fn relates_to(&self, nonconformity_ref: &NonconformityRef) -> bool` | 判断是否属于指定不符合 | nonconformity ref | `bool` | 纯判断;不读取 repository |
| `pub fn relates_to_action(&self, action_ref: &CorrectiveActionRef) -> bool` | 判断是否属于指定 corrective action | corrective action ref | `bool` | 纯判断;无 action ref 时返回 false |
| `pub fn relates_to_verification(&self, verification_ref: &VerificationResultRef) -> bool` | 判断是否属于指定 verification result | verification result ref | `bool` | 纯判断;无 verification ref 时返回 false |
| `pub fn is_closure_change(&self) -> bool` | 判断是否为关闭变化 | 无 | `bool` | 返回 `closure_change`;不解析 `change_kind` |
| `pub fn requires_trace(&self) -> bool` | 判断是否需要 trace handoff | 无 | `bool` | 返回 `trace_handoff_required`;不解析 `change_kind` |
| `pub fn has_evidence_basis(&self) -> bool` | 判断是否携带 evidence basis | 无 | `bool` | 纯判断;不读取 evidence body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_nonconformity_change(record_id: NonconformityChangeRecordId, record: &NonconformityRecord, change_kind: NonconformityChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, closure_change: bool, trace_handoff_required: bool) -> Result<Self, DomainError>` | 从 accepted nonconformity transition 构造 history | generated id、transitioned nonconformity、change kind、actor、trace ref、closure flag、handoff flag | `Result<NonconformityChangeRecord, DomainError>` | raise / confirm cause / start correction / ready / close / reopen / reject path |
| `pub fn from_corrective_action_change(record_id: NonconformityChangeRecordId, action: &CorrectiveAction, change_kind: NonconformityChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, trace_handoff_required: bool) -> Result<Self, DomainError>` | 从 accepted corrective action transition 构造 history | generated id、transitioned action、change kind、actor、trace ref、handoff flag | `Result<NonconformityChangeRecord, DomainError>` | plan / start / complete / cancel / fail corrective action path |
| `pub fn from_verification_change(record_id: NonconformityChangeRecordId, result: &VerificationResult, change_kind: NonconformityChangeKind, actor_ref: ActorRef, trace_ref: GovernanceTraceRecordRef, trace_handoff_required: bool) -> Result<Self, DomainError>` | 从 accepted verification result 构造 history | generated id、verification result、change kind、actor、trace ref、handoff flag | `Result<NonconformityChangeRecord, DomainError>` | verify nonconformity path;closure 仍由 subsequent nonconformity close record 承载 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改旧 `NonconformityChangeRecord`;纠错必须追加新 record |
| 不替代 nonconformity truth | 当前闭环状态仍以 `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` 为准 |
| 不保存外部正文 | bug、work blocker、runtime log、evidence body、work body、conversation 和 artifact body 不进入 history |
| closure flag 来源显式 | `is_closure_change()` 不得由实现自造 change kind 分类;必须使用 factory 入参 |
| trace handoff flag 来源显式 | `requires_trace()` 不得由实现解析字符串或 hard-code severity;必须由 flow / policy 传入 |
| verification 不直接关闭 | verification result record 不表示 closure;关闭必须另有 `NonconformityRecord::close(...)` transition 和 history |
| action 不替代 nonconformity | corrective action 完成或失败只记录 action state;不自动修改 nonconformity closure |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `NonconformityChangeRecordId` | object 必填 `record_id`;id 必须由 application generator 提供 |
| 增加 corrective / verification refs 与 factories | HLD 责任覆盖纠正、复验和关闭;这些对象是独立 truth,history 必须可定位 |
| 增加 resulting state 字段 | change kind 无正式变体表,必须保存变化后的 truth state |
| 增加 `closure_change` 字段 | HLD 要求 `is_closure_change()`,但没有 kind 变体;必须由正式输入承载判断结果 |
| 增加 `trace_handoff_required` 字段 | HLD 要求 `requires_trace()`,但没有 handoff 判断 schema;必须由 flow / policy 传入 |
| 增加 `actor_ref` / `trace_ref` | accepted history 必须保存 actor ref 并串联 trace;不保存 actor body |

#### 13.6 handoff / export support object contracts

Handoff / export 是 operations job 维护面,不是 Governance core truth。§10.17 已把 `GovernanceHandoffMarker` 定义为 `contracts` shared helper,因为 job report、handoff job response、operations query 和 duplicate replay 都可能引用 marker body 或 marker ref。本节不再创建第二套 domain-only marker struct,只固定该 shared object 的 factory、transition method 和不变量,供 handoff / export service 1:1 落码。

| 对象 | type owner | 行为 owner | 原因 |
|---|---|---|---|
| `GovernanceHandoffMarker` | `contracts::refs` 或等价 shared module | handoff / export application service 执行 transition,domain policy 只校验 allowed source | marker 会进入 job report / operations surface,不得引用 domain-only 类型 |
| `GovernanceHandoffState` | `contracts::refs` | handoff / export job 根据 port result 更新 | 状态需要被 job report 和 query 暴露 |
| `HandoffPackageRef` / `HandoffReceiptRef` / `HandoffFailureReason` | `contracts::refs` | handoff / export adapter 提供 | 只保存 external ref / reason,不保存外部正文 |

##### `GovernanceHandoffMarker` behavior

```rust
impl GovernanceHandoffMarker {
    /// Creates a prepared marker for a body-free handoff package.
    pub fn prepared(
        marker_ref: GovernanceHandoffMarkerRef,
        trace_refs: GovernanceTraceRecordRefSet,
        target_ref: TraceHandoffTargetRef,
        package_ref: HandoffPackageRef,
    ) -> Result<Self, ContractError>;

    /// Creates a failed marker when preparation did not produce a usable package.
    pub fn failed(
        marker_ref: GovernanceHandoffMarkerRef,
        trace_refs: GovernanceTraceRecordRefSet,
        target_ref: TraceHandoffTargetRef,
        reason: HandoffFailureReason,
    ) -> Result<Self, ContractError>;

    /// Returns the stable marker ref.
    pub fn to_ref(&self) -> GovernanceHandoffMarkerRef;

    /// Returns true when the marker covers the trace record.
    pub fn includes_trace(&self, trace_ref: &GovernanceTraceRecordRef) -> bool;

    /// Returns true when the marker can still be delivered.
    pub fn can_deliver(&self) -> bool;

    /// Returns true when the marker reached a terminal handoff state.
    pub fn is_terminal(&self) -> bool;

    /// Records a successful target receipt.
    pub fn mark_delivered(&mut self, receipt_ref: HandoffReceiptRef) -> Result<(), ContractError>;

    /// Records a preparation or delivery failure.
    pub fn mark_failed(&mut self, reason: HandoffFailureReason) -> Result<(), ContractError>;
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `marker_ref` | `GovernanceHandoffMarkerRef` | marker identity | handoff / export job 从 application id generator 取得;load 时可重建;不得临时拼接 |
| `trace_refs` | `GovernanceTraceRecordRefSet` | 被交接的 trace refs | 从 loaded `GovernanceTraceRecord`、`GovernanceAuditTrail` 或 history `trace_ref` 收集;ordered unique;本批要求非空 |
| `target_ref` | `TraceHandoffTargetRef` | handoff / export target | 来源于 job input 或 config binding;不保存目标系统正文 |
| `handoff_state` | `GovernanceHandoffState` | marker lifecycle state | `prepared(...)` 初始为 `Prepared`;`failed(...)` 初始为 `Failed`;只能按本节迁移 |
| `package_ref` | `Option<HandoffPackageRef>` | 准备好的 body-free package ref | `Prepared` / `Delivered` 必须为 `Some`;prepare failure 可为 `None`;不保存 package body |
| `receipt_ref` | `Option<HandoffReceiptRef>` | 目标系统接收回执 | `Delivered` 必须为 `Some`;其他状态必须为 `None` |
| `failure_reason` | `Option<HandoffFailureReason>` | 失败原因 | `Failed` 必须为 `Some`;其他状态必须为 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceHandoffMarkerRef` | 生成 marker ref | 无 | `GovernanceHandoffMarkerRef` | 纯函数;复制 `marker_ref` |
| `pub fn includes_trace(&self, trace_ref: &GovernanceTraceRecordRef) -> bool` | 判断 marker 是否覆盖某 trace | trace record ref | `bool` | 纯判断;不读取 trace repository |
| `pub fn can_deliver(&self) -> bool` | 判断是否可交付目标 | 无 | `bool` | 仅 `Prepared` 且 `package_ref.is_some()` 返回 true |
| `pub fn is_terminal(&self) -> bool` | 判断 marker 是否终态 | 无 | `bool` | `Delivered` / `Failed` 返回 true;`Prepared` 返回 false |
| `pub fn mark_delivered(&mut self, receipt_ref: HandoffReceiptRef) -> Result<(), ContractError>` | 记录目标接收回执 | adapter receipt ref | `Result<(), ContractError>` | 允许 `Prepared -> Delivered`;写入 `receipt_ref`;不得改变 `trace_refs`、`target_ref` 或 `package_ref` |
| `pub fn mark_failed(&mut self, reason: HandoffFailureReason) -> Result<(), ContractError>` | 记录准备或交付失败 | adapter / validation failure reason | `Result<(), ContractError>` | 允许 `Prepared -> Failed`;写入 `failure_reason`;不得清空已有 `package_ref` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepared(marker_ref: GovernanceHandoffMarkerRef, trace_refs: GovernanceTraceRecordRefSet, target_ref: TraceHandoffTargetRef, package_ref: HandoffPackageRef) -> Result<Self, ContractError>` | 创建已准备 package 的 marker | generated marker ref、trace ref set、target、package ref | `Result<GovernanceHandoffMarker, ContractError>` | handoff / export port 成功准备 package 后保存 marker |
| `pub fn failed(marker_ref: GovernanceHandoffMarkerRef, trace_refs: GovernanceTraceRecordRefSet, target_ref: TraceHandoffTargetRef, reason: HandoffFailureReason) -> Result<Self, ContractError>` | 创建准备失败 marker | generated marker ref、trace ref set、target、failure reason | `Result<GovernanceHandoffMarker, ContractError>` | port 或 validation 在 package 形成前失败;初始 state 为 `Failed` |

| 状态迁移 | 触发 | 必须写入 | 禁止副作用 |
|---|---|---|---|
| factory -> `Prepared` | package prepared | `package_ref` | 不写 external package body;不改变 trace / audit / truth |
| factory -> `Failed` | preparation failed before package usable | `failure_reason` | 不创建空 package body;不修复 truth |
| `Prepared -> Delivered` | target accepts package | `receipt_ref` | 不修改 trace_refs、package_ref、target_ref |
| `Prepared -> Failed` | delivery failure or late validation failure | `failure_reason` | 不删除 package_ref;不自动 retry |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| marker 不保存外部正文 | observability ledger、archive package、external GRC document、export body 和 adapter error body 都不得进入 marker |
| marker 不反写真相 | handoff / export 成败不改变 `GovernanceDecision`、policy、control、conclusion、nonconformity、trace 或 outbox truth |
| retry 创建新 marker | `Failed` marker 不得原地变回 `Prepared` 或 `Delivered`;retry job 必须创建新 marker 并由 job report 关联 |
| trace refs 必须稳定 | `trace_refs` 创建后不可增删重排;新增 trace 需要新 handoff marker |
| target 不可变 | target 来自 job input / config binding;marker 创建后不得改目标 |
| failed marker 必须可审查 | failure reason 必须进入 marker 和 job report;不得静默吞掉失败 |
| query no-write | operations query 可以读取 marker,不得补创建 receipt、package 或 failure |
| outbox optional marker 不在对象内触发 | HLD flow 提到 optional outbox;是否 enqueue event 由 Step 8 / Step 9 application flow 闭合,marker method 不写 outbox |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `GovernanceTraceRecord::prepare_handoff(target_ref)` 不在 trace record 内实现 | HLD 未给 `TraceHandoffIntent` schema;本批改为 handoff job 从 loaded trace refs 创建 marker,避免 trace object 生成未定义对象 |
| factory 接收 `GovernanceHandoffMarkerRef` 而非裸 id | §10.17 marker 字段是 `marker_ref`;id 仍由 application id generator 产生后包装为 ref |
| `Failed` 作为 terminal marker | Step 9 状态机说明 failed marker 由后续新 marker 或 retry job 替代,不得原地改成功 |
| behavior 使用 `ContractError` | type owner 在 `contracts`;若实现选择 domain wrapper,可在边界映射为 `DomainError`,但 shared type 不得依赖 domain crate |
| report / duplicate replay 不在本对象实现 | `GovernanceJobReport` 是 job result surface;存储、duplicate replay 和 idempotency 留给 Step 13 |

### 14. `domain` policy / guard 对象契约

Policy / guard object 只表达已加载对象之间的领域判断,不拥有 repository、adapter、config、clock、id generator 或 external resolver。它们可以被 application service 在 command / query / consumer / job flow 中调用,但不能自行读取外部 truth、不能写任何 Governance truth、不能追加 trace / history / outbox,也不能把 denied path 伪装成 accepted truth change。

#### 14.1 policy / guard 通用落码边界

| 规则 | 说明 |
|---|---|
| 纯判断 | policy method 只检查入参和自身 snapshot 字段,成功返回 `Ok(())`,失败返回 `DomainError`;不得修改入参对象 |
| 无 repository | Step 7 repository / resolver port 负责加载 snapshot、truth summary、actor capability、visibility input;policy 不发起读取 |
| 无副作用 | policy 不 append history、trace、audit、outbox、stale marker、job report 或 handoff marker |
| 已加载输入 | 所有对象、snapshot、ref set、cursor、actor 均由 application flow 传入;policy 不从 ref 反查 body |
| no body | policy 只能消费 §10 / §11~§13 的 ref、safe summary、snapshot state 和 truth object;不得保存或返回外部正文 |
| 错误模型 | 本 Step 用 `DomainError`;具体 variant、error code、retry / pending / not visible 映射留给 Step 12 |

| HLD 名称 | 本 Step 收口 | 原因 |
|---|---|---|
| `GovernancePolicyScope` | 使用已闭合的 `GovernanceScopeRef` | HLD 未给 finite scope schema;§10.7 已闭合 `GovernanceScopeRef` |
| `ExternalContextSummary` | 使用 `GovernanceSourceRef`、external snapshot refs、`GovernanceTruthSnapshot` 的 ref-only 约束 | `ExternalContextSummary` 未在 shared type 中闭合;不得新增悬空 DTO |
| `assert_subject_visible(...)` | 在 `GovernanceContextPolicy` 中只做 context / subject / actor structural guard;完整 read visibility 留给 `ReadVisibilityPolicy` | Query visibility marker 和 not visible surface 已在 §10.18 预留,后续 policy 单独展开 |

#### 14.2 `GovernanceTruthPolicy`

```rust
/// Guards Governance truth changes against ownership and body-boundary violations.
pub struct GovernanceTruthPolicy {
    /// Scope covered by the policy decision.
    pub scope_ref: GovernanceScopeRef,
    /// Body-free snapshot of committed Governance truth.
    pub truth_snapshot: GovernanceTruthSnapshot,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope_ref` | `GovernanceScopeRef` | 当前判断范围 | 从 `truth_snapshot.scope_ref` 复制;不得由实现解析 subject / source 字符串得出 |
| `truth_snapshot` | `GovernanceTruthSnapshot` | committed Governance truth 摘要 | application / repository 从已提交 truth refs 构造;只含 ref sets、scope 和 cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_truth_change_allowed(&self, change: &GovernanceTruthChange, actor: ActorRef) -> Result<(), DomainError>` | 校验 accepted truth change 可落在本 scope | accepted change helper、command actor | `Result<(), DomainError>` | 只读判断;要求 change cursor 不早于 snapshot cursor 的正式口径留给 Step 11;不得创建 outbox / trace |
| `pub fn assert_no_external_body_source(&self, source_ref: &GovernanceSourceRef) -> Result<(), DomainError>` | 校验外部来源只以 ref / version / digest 进入 | source ref | `Result<(), DomainError>` | 只检查 `GovernanceSourceRef` 形态;不读取 source body |
| `pub fn assert_no_derived_writeback(&self, view_ref: &DerivedGovernanceViewRef) -> Result<(), DomainError>` | 校验派生视图不得反写 core truth | derived view ref | `Result<(), DomainError>` | 只允许作为 guard;具体 stale / rebuild 写入由 projection flow 处理 |
| `pub fn covers_scope(&self, scope_ref: &GovernanceScopeRef) -> bool` | 判断 policy snapshot 是否覆盖 scope | scope ref | `bool` | 纯判断;比较 stable scope identity |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_snapshot(truth_snapshot: GovernanceTruthSnapshot) -> Result<Self, DomainError>` | 从 body-free truth snapshot 构造 guard | committed truth snapshot | `Result<GovernanceTruthPolicy, DomainError>` | command accepted precheck、projection / reconciliation guard;`scope_ref` 从 snapshot 复制 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代对象状态机 | `GovernanceContext`、`Gate`、`GovernanceDecision`、policy fact、control、nonconformity 等对象仍由自身 transition method 修改状态 |
| 不允许 derived writeback | view、report、reconciliation finding、job report 不能通过本 policy 反写 core truth |
| 不保存 sibling body | process / work / artifact / runtime / method / external GRC 正文不得进入 policy 字段或错误信息 |
| 不生成 accepted change | `GovernanceTruthChange` 必须由 application 在 domain transition 成功后构造,policy 不能为 rejected path 伪造 change |
| scope 不能扩大 | `scope_ref` 必须来自 snapshot,不能因配置或 command actor 扩大治理范围 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `policy_scope: GovernancePolicyScope` 改为 `scope_ref: GovernanceScopeRef` | 本 Step 已闭合 stable scope ref,未闭合 finite policy scope enum |
| `assert_no_external_body(ExternalContextSummary)` 改为 `assert_no_external_body_source(GovernanceSourceRef)` | `ExternalContextSummary` 未定义;source ref 已承载 ref / version / digest 且明确 no body |
| `assert_truth_change_allowed` 接收 borrowed change | guard 不拥有 accepted change;后续 trace/outbox factory 继续消费同一 change |

#### 14.3 `GovernanceContextPolicy`

```rust
/// Guards Governance context and input readiness before decision work starts.
pub struct GovernanceContextPolicy {
    /// Context checked by this policy.
    pub context_ref: GovernanceContextRef,
    /// Latest known reference state for the context source or governed subject.
    pub reference_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_ref` | `GovernanceContextRef` | 被判断治理语境 | 从 loaded `GovernanceContext.to_ref()` 复制;不得从 source ref 临时拼接 |
| `reference_state` | `ReferenceResolutionState` | 语境相关外部引用解析状态 | 由 resolver / reference repository 传入;policy 不自行刷新 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_context_ready(&self, context: &GovernanceContext) -> Result<(), DomainError>` | 校验 context 可进入 Gate / Decision / Control / Compliance 主线 | loaded context | `Result<(), DomainError>` | 要求 `context.to_ref() == self.context_ref`、context `Ready`、`reference_state.is_resolved()`;不修改 context |
| `pub fn assert_subject_visible_for_actor(&self, subject_ref: &GovernedSubjectRef, actor: ActorRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<(), DomainError>` | 校验 actor 对 context subject 的结构性可触达条件 | subject、actor、可选 actor capability snapshot | `Result<(), DomainError>` | 只做 loaded snapshot / subject matching guard;完整 query visibility 由 `ReadVisibilityPolicy` 闭合 |
| `pub fn assert_input_acceptable(&self, input: &GovernanceInput, context: &GovernanceContext) -> Result<(), DomainError>` | 校验 input 可以进入正式治理处理 | loaded input、loaded context | `Result<(), DomainError>` | 要求 input 属于 context、context ready、input 非 rejected / superseded;不调用 `input.accept(...)` |
| `pub fn assert_no_external_body_source(&self, source_ref: &GovernanceSourceRef) -> Result<(), DomainError>` | 校验输入来源只以 ref / version / digest 进入 | source ref | `Result<(), DomainError>` | 不读取 source body;digest 缺失只能由后续 flow 映射 pending / degraded |
| `pub fn requires_reference_refresh(&self) -> bool` | 判断 context 是否需要先刷新引用 | 无 | `bool` | 对 unresolved / stale / unavailable 返回 true;query / command 是否 pending 留给 Step 9 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_context(context: &GovernanceContext, reference_state: ReferenceResolutionState) -> Result<Self, DomainError>` | 从 loaded context 和 reference state 构造 guard | context、reference state | `Result<GovernanceContextPolicy, DomainError>` | create / submit / open gate / assess control 前置校验 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| policy 不推进 context | `assert_context_ready(...)` 失败时不能调用 `mark_ready`、`mark_pending_reference` 或 `invalidate` |
| pending reference 不可绕过 | `reference_state` 非 resolved 时,正式裁决主线必须停在 pending / refresh / degraded surface |
| input accepted 不自动开 gate | `assert_input_acceptable(...)` 只检查条件,不创建 `Gate` 或 `GovernanceDecision` |
| subject visibility 不泄露正文 | denied path 只能返回 `DomainError`;不得携带 subject summary、source body 或 evidence body |
| actor snapshot 不替代 identity truth | `ActorCapabilitySnapshot` 只作为已加载摘要参与判断,不写 identity / capability truth |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `assert_subject_visible(GovernedSubjectRef, ActorRef)` 增加可选 `ActorCapabilitySnapshot` | domain policy 不能自行读取 actor 能力;完整能力摘要必须由 application 传入 |
| `for_context(GovernanceContext)` 增加 `ReferenceResolutionState` 入参 | HLD 字段表要求保存 reference state,且 policy 不允许自行解析外部引用 |
| `assert_no_external_body(GovernanceSourceRef)` 命名为 `assert_no_external_body_source` | 与 `GovernanceTruthPolicy` 对齐,明确检查的是 source ref 形态而非未定义 summary DTO |

#### 14.4 `DecisionPolicy`

Commit boundary: `DecisionPolicy` 不是 commit-03-a 的落码对象。commit-03-a 只实现 Gate / GovernanceDecision contracts 与本地 state transition；`DecisionPolicy` 从 commit-03-c 开始随责任链 service flow 落码。`SharedRuleSet` body 的 active/evaluation 校验不属于 PH-03,统一由 PH-04 `SharedRulesPolicy` 闭合；PH-03 `DecisionPolicy` 只携带并校验 shared rule set ref 没有被绕过。

```rust
/// Guards formal Governance decisions before they can be attached to a gate.
pub struct DecisionPolicy {
    /// Gate being decided.
    pub gate_ref: GateRef,
    /// Responsibility chain used as the decision authority.
    pub responsibility_chain_ref: ResponsibilityChainRef,
    /// Shared rule set that must not be violated, when one applies.
    pub shared_rule_set_ref: Option<SharedRuleSetRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gate_ref` | `GateRef` | 被裁决 Gate | 从 loaded `Gate.to_ref()` 复制;不得指向 process waiting gate |
| `responsibility_chain_ref` | `ResponsibilityChainRef` | 裁决责任链 | 从 loaded `ResponsibilityChain.to_ref()` 复制;chain 必须属于 gate context |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 适用 shared rules | application flow 基于 scope / context 传入;policy 不自行查找 shared rules |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_can_decide(&self, gate: &Gate, chain: &ResponsibilityChain, actor: ActorRef) -> Result<(), DomainError>` | 校验 Gate 和责任链允许进入正式裁决 | loaded gate、loaded chain、command actor | `Result<(), DomainError>` | 要求 gate / chain ref 匹配 policy 字段、gate `PendingDecision`、chain `Satisfied`;不 attach decision |
| `pub fn assert_basis_sufficient(&self, basis_ref: &EvidenceSummaryRef) -> Result<(), DomainError>` | 校验裁决依据可作为 decision basis | evidence summary ref | `Result<(), DomainError>` | 要求 basis 可被 `EvidenceSummaryRef::is_acceptable_for_decision()` 接受;不读取 evidence body |
| `pub fn assert_shared_rule_ref_preserved(&self, applied_shared_rule_set_ref: Option<&SharedRuleSetRef>) -> Result<(), DomainError>` | 校验适用 shared rule set ref 没有被绕过 | flow 已确定的 optional shared rule set ref | `Result<(), DomainError>` | 若 `self.shared_rule_set_ref` 为 `Some`,必须传入同 ref;不加载 `SharedRuleSet`;active/evaluation 留给 PH-04 `SharedRulesPolicy` |
| `pub fn assert_supersede_allowed(&self, current: &GovernanceDecision, next: &GovernanceDecision) -> Result<(), DomainError>` | 校验后续裁决可以替代既有裁决 | current decision、next decision | `Result<(), DomainError>` | 要求二者同 gate、current finalized、next proposed / same gate;不调用 `current.supersede(...)` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_gate(gate: &Gate, chain: &ResponsibilityChain, shared_rule_set_ref: Option<SharedRuleSetRef>) -> Result<Self, DomainError>` | 从 Gate、责任链和可选 shared rules 构造裁决 guard | loaded gate、loaded responsibility chain、optional shared rule set ref | `Result<DecisionPolicy, DomainError>` | `RecordGovernanceDecision` / supersede decision 前置校验 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不允许无责任裁决 | gate 进入正式 decision 前必须有 satisfied responsibility chain 或 Step 9 明确的 reserved exception |
| vote 不等于 decision | approval vote 只满足 chain,不能替代 `GovernanceDecision` |
| process waiting 不替代 decision | process waiting gate 只能消费正式 `GovernanceDecisionRef`,不能成为 decision truth |
| shared rules 不可绕过 | PH-03 必须保留适用 `shared_rule_set_ref` 且不得以配置关闭;`SharedRuleSet` body 的 active/evaluation 校验由 PH-04 `SharedRulesPolicy` 执行 |
| policy 不写 gate / decision | 本 policy 不调用 `Gate::attach_decision`、`GovernanceDecision::approve`、history、trace 或 outbox |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `for_gate(Gate, ResponsibilityChain)` 增加 `shared_rule_set_ref` 入参 | struct 字段包含 optional shared rules;factory 必须覆盖字段来源 |
| `assert_shared_rule_ref_preserved(...)` 不接收 `SharedRuleSet` body | 避免 PH-03 越界依赖 PH-04 shared rules object;active/evaluation 统一归 `SharedRulesPolicy` |
| `assert_supersede_allowed(...)` 只判断不迁移 | 真正 supersede 由 `GovernanceDecision::supersede(...)` 和 Step 9 transaction 编排执行 |

#### 14.5 `ApprovalResponsibilityPolicy`

```rust
/// Guards assignment, voting, delegation, and satisfaction for approval responsibility.
pub struct ApprovalResponsibilityPolicy {
    /// Responsibility checked by this policy.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Actor capability snapshot used for the check.
    pub actor_snapshot: ActorCapabilitySnapshot,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `responsibility_ref` | `ApprovalResponsibilityRef` | 被判断责任 | 从 loaded `ApprovalResponsibility.to_ref()` 复制;不得从 actor 或 requirement 拼接 |
| `actor_snapshot` | `ActorCapabilitySnapshot` | actor 可承担摘要 | identity / capability consumer 或 refresh job 写入;必须 body-free 且 resolved 才可用于 assign / vote guard |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_can_assign(&self, responsibility: &ApprovalResponsibility, requirement: &ApproverRequirement) -> Result<(), DomainError>` | 校验 actor snapshot 可以承担责任 | loaded responsibility、loaded requirement | `Result<(), DomainError>` | 要求 responsibility ref 匹配、state 为 `Required`、snapshot resolved、requirement matches snapshot;不调用 assign |
| `pub fn assert_can_vote(&self, responsibility: &ApprovalResponsibility, actor: ActorRef) -> Result<(), DomainError>` | 校验 actor 可以对责任投票 | loaded responsibility、command actor | `Result<(), DomainError>` | 要求 actor 等于 snapshot actor 和 responsibility actor;责任处于可投票状态;不写 vote |
| `pub fn assert_can_delegate(&self, responsibility: &ApprovalResponsibility, delegate_snapshot: &ActorCapabilitySnapshot, requirement: &ApproverRequirement) -> Result<(), DomainError>` | 校验责任可委托给目标 actor | loaded responsibility、delegate snapshot、requirement | `Result<(), DomainError>` | 要求责任 ref 匹配、delegate snapshot resolved、delegation rule 允许且 delegate 满足 requirement |
| `pub fn assert_chain_satisfied(&self, chain: &ResponsibilityChain, responsibilities: &[ApprovalResponsibility], requirement: &ApproverRequirement) -> Result<(), DomainError>` | 校验责任链已满足裁决要求 | loaded chain、loaded responsibilities、requirement | `Result<(), DomainError>` | application 已加载 chain refs 对应责任;policy 按 threshold / votes 只读判断;不调用 `chain.mark_satisfied(...)` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_snapshot(responsibility: &ApprovalResponsibility, actor_snapshot: ActorCapabilitySnapshot) -> Result<Self, DomainError>` | 从 loaded responsibility 和 actor capability snapshot 构造 guard | responsibility、actor snapshot | `Result<ApprovalResponsibilityPolicy, DomainError>` | assign / vote / delegate / chain satisfaction 前置校验 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不修改 identity truth | policy 只消费 actor / role / capability summary,不保存 profile、credential、platform auth 或 capability body |
| 不绕过 shared rules | delegation、替代或 threshold 降低不得削弱 shared rules;跨规则冲突留给 `SharedRulesPolicy` / `PolicyConflictPolicy` |
| 不写 responsibility | policy 不调用 `assign`、`record_vote`、`delegate_to`、`release` 或 `mark_satisfied` |
| unresolved snapshot 不可用于批准 | snapshot 非 resolved 时只能 pending / degraded / refresh,不得假设 actor 可承担 |
| chain satisfied 不等于 decision | chain 满足后仍必须由 `DecisionPolicy` 和 `GovernanceDecision` 形成正式裁决 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `assert_can_assign(requirement, snapshot)` 增加 responsibility 入参 | policy 字段包含 responsibility ref,必须校验正在处理的责任与 policy 匹配 |
| `assert_can_delegate(responsibility, delegate_ref)` 改为接收 `delegate_snapshot` 和 requirement | 只靠 `ActorRef` 无法验证能力;policy 不允许自行读取 identity / capability |
| `assert_chain_satisfied(chain)` 增加 loaded responsibilities 和 requirement | chain 只保存 refs;policy 不能从 repository 反查责任 body |

#### 14.6 `PolicyConflictPolicy`

```rust
/// Guards policy priority, scope comparability, and conflict handling.
pub struct PolicyConflictPolicy {
    /// Scope in which policy conflicts are evaluated.
    pub scope_ref: GovernanceScopeRef,
    /// Policies participating in conflict evaluation.
    pub policy_refs: PolicyEffectiveFactRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope_ref` | `GovernanceScopeRef` | 被判断范围 | command intent、context subject 或 resolver summary 传入;不得解析 external ref 字符串 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | 参与判断的 policy fact refs | 从 loaded policy facts 映射;ordered unique;policy 不自行读取 repository |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn detect_conflicts(&self, policies: &[PolicyEffectiveFact], shared_rules: Option<&SharedRuleSet>) -> Result<PolicyEffectiveFactRefSet, DomainError>` | 发现冲突候选 policy refs | loaded policy facts、optional shared rules | `Result<PolicyEffectiveFactRefSet, DomainError>` | 只读判断;返回候选 refs;不创建 `PolicyConflictRecord` |
| `pub fn assert_override_allowed(&self, higher: &PolicyEffectiveFact, lower: &PolicyEffectiveFact, scope_policy: &PolicyScopePolicy, shared_rules: Option<&SharedRulesPolicy>) -> Result<(), DomainError>` | 校验 higher policy 是否可覆盖 lower policy | higher / lower loaded policy、scope guard、optional shared rules guard | `Result<(), DomainError>` | 要求 scope 可比较、higher priority outranks lower、未削弱 active shared rules |
| `pub fn assert_resolution_required(&self, conflict: &PolicyConflictRecord) -> Result<(), DomainError>` | 判断 conflict 是否必须进入正式处理 | loaded conflict record | `Result<(), DomainError>` | 对 `Detected` / `PendingDecision` 返回需要处理的 guard result;不调用 transition |
| `pub fn covers_policy_set(&self, policies: &[PolicyEffectiveFact]) -> bool` | 判断 loaded policies 是否覆盖 `policy_refs` | loaded policies | `bool` | 纯判断;按 `PolicyEffectiveFactRef` 去重匹配 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_scope(scope_ref: GovernanceScopeRef, policy_refs: PolicyEffectiveFactRefSet) -> Result<Self, DomainError>` | 从 scope 和 policy refs 构造冲突 guard | scope、policy ref set | `Result<PolicyConflictPolicy, DomainError>` | activate policy、update shared rules、conflict scan 前置判断 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不创建 conflict record | `detect_conflicts(...)` 只返回候选 refs;创建 `PolicyConflictRecord::detect(...)` 由 application flow 执行 |
| 不修改 policy truth | override guard 不能调用 `PolicyEffectiveFact::supersede`、`suspend` 或 `retire` |
| 不让低 scope 覆盖高 scope | scope comparability 必须由 `PolicyScopePolicy` 判断,不得只比较 priority 数字 |
| runtime cache 不处理冲突 | runtime / config / projection 只能提供输入或 degraded surface,冲突 truth 归 `PolicyConflictRecord` |
| shared rules 优先 | high priority policy 也不得削弱 active shared rules |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `detect_conflicts(PolicyEffectiveFactRefSet)` 改为接收 loaded policies 并返回候选 refs | 只靠 refs 无法比较 scope / priority / state;policy 不能自行查仓库 |
| `assert_override_allowed(...)` 增加 scope / shared rules guard | priority 不能跨不可比较 scope,也不能绕过 shared rules |
| `assert_resolution_required(...)` 返回 guard result 而非 bool | 与本 Step policy method 统一为 `Result<(), DomainError>` |

#### 14.7 `SharedRulesPolicy`

```rust
/// Guards active shared rules from lower-scope overrides and unsafe decisions.
pub struct SharedRulesPolicy {
    /// Shared rule set being enforced.
    pub rule_set_ref: SharedRuleSetRef,
    /// Scope where the rules are evaluated.
    pub scope_ref: GovernanceScopeRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `rule_set_ref` | `SharedRuleSetRef` | 被判断规则集合 | 从 loaded `SharedRuleSet.to_ref()` 复制;不保存 rule body |
| `scope_ref` | `GovernanceScopeRef` | 当前治理范围 | 从 loaded rule set 或 application-selected scope 传入;不得由配置扩大 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_rule_satisfied(&self, rule_set: &SharedRuleSet, rule_ref: &SharedRuleRef, context: &GovernanceContext) -> Result<(), DomainError>` | 校验单条 shared rule 对 context 未被违反 | loaded rule set、rule ref、loaded context | `Result<(), DomainError>` | 要求 rule set ref 匹配、rule active、context ready;具体 rule expression 不在本仓保存 |
| `pub fn assert_no_lower_scope_override(&self, policy_fact: &PolicyEffectiveFact, scope_policy: &PolicyScopePolicy) -> Result<(), DomainError>` | 校验低 scope policy 没有覆盖 shared rules | loaded policy fact、scope guard | `Result<(), DomainError>` | 要求 policy scope 不低于或不冲突于 shared rule scope;不修改 policy |
| `pub fn requires_manual_decision_for_conflict(&self, conflict: &PolicyConflictRecord) -> bool` | 判断 shared-rule 相关冲突是否必须人工裁决 | loaded conflict record | `bool` | 只读判断;触及 active shared rules 且未 resolved / waived 时返回 true |
| `pub fn covers_rule_set(&self, rule_set: &SharedRuleSet) -> bool` | 判断 loaded rule set 是否匹配本 policy | loaded rule set | `bool` | 纯判断;比较 `SharedRuleSetRef` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_rule_set(rule_set: &SharedRuleSet) -> Result<Self, DomainError>` | 从 loaded shared rules 构造 guard | loaded rule set | `Result<SharedRulesPolicy, DomainError>` | decision policy、policy activation、conflict detection 前置校验 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不被配置关闭 | active shared rules 不能由 runtime config、project config 或 external GRC flag 绕过 |
| 不保存标准正文 | rule refs 只引用标准 / rule entry;rule expression / standard body 不进入 policy |
| 不创建 manual decision | `requires_manual_decision_for_conflict(...)` 只判断,不打开 Gate 或创建 Decision |
| 不写 shared rule state | policy 不调用 `activate`、`deprecate_rule` 或 `retire` |
| deprecated / retired 不可当 active | 非 active rule set 不能作为 hard constraint 静默使用 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| HLD 中以 shared-rule violation 为入参的 manual decision 判断改为 `requires_manual_decision_for_conflict(PolicyConflictRecord)` | shared-rule violation helper 未闭合 schema;conflict record 已是正式 truth surface |
| `assert_rule_satisfied(...)` 增加 loaded rule set 入参 | policy 不允许 repository lookup;rule body 不进入本仓 |
| `assert_no_lower_scope_override(...)` 增加 `PolicyScopePolicy` 入参 | 低 / 高 scope 判断需要正式 scope guard,不能解析字符串 |

#### 14.8 `PolicyScopePolicy`

```rust
/// Guards policy scope matching, inheritance, and effective time semantics.
pub struct PolicyScopePolicy {
    /// Scope checked by this policy.
    pub scope_ref: GovernanceScopeRef,
    /// Governed subject checked against the scope.
    pub subject_ref: GovernedSubjectRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope_ref` | `GovernanceScopeRef` | 被判断 scope | 来源于 command intent、context subject 或 resolver summary;不得保存 scope body |
| `subject_ref` | `GovernedSubjectRef` | 被治理对象 | 从 loaded context、request 或 resolver summary 传入;不保存 subject body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_scope_matches_subject(&self, scope_ref: &GovernanceScopeRef, subject_ref: &GovernedSubjectRef) -> Result<(), DomainError>` | 校验 scope 与 subject 匹配 | scope、subject | `Result<(), DomainError>` | 要求入参与 policy 字段一致或被正式 scope relation 允许;不读取 subject body |
| `pub fn assert_scope_inheritance_allowed(&self, parent_scope_ref: &GovernanceScopeRef, child_scope_ref: &GovernanceScopeRef) -> Result<(), DomainError>` | 校验 scope 继承允许 | parent scope、child scope | `Result<(), DomainError>` | 只使用已传入 refs;完整 parent/child relation 读取面留给 Step 7 |
| `pub fn assert_effective_at(&self, effective_at: GovernanceEffectiveAt) -> Result<(), DomainError>` | 校验 policy / shared rules 生效时间语义 | effective time | `Result<(), DomainError>` | 要求时间来自 command metadata、clock port 或 source summary;不读取 clock |
| `pub fn scopes_are_comparable(&self, left: &GovernanceScopeRef, right: &GovernanceScopeRef) -> bool` | 判断两个 scope 是否可比较 priority | left / right scope | `bool` | 相同 scope 返回 true;跨 scope 是否可比由 Step 7 relation input 支撑 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_subject(subject_ref: GovernedSubjectRef, scope_ref: GovernanceScopeRef) -> Result<Self, DomainError>` | 从 subject 和 scope 构造 scope guard | governed subject、scope | `Result<PolicyScopePolicy, DomainError>` | activate policy、draft shared rules、decision / compliance guard |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不把 project config 当 policy truth | project / org config 只能作为候选输入,正式 scope guard 仍基于 `GovernanceScopeRef` 和 loaded relation |
| 不跨越 subject 边界 | scope 不得扩大到无关 subject、project、runtime 或 external GRC object |
| 不自造 scope kind | HLD 未给 finite `GovernanceScopeKind`;实现不得私自固定 Project / Workspace / Global enum |
| 不读取 clock | effective time 由 application 传入;policy 不调用 clock port |
| inheritance 需要正式读取面 | 若 Step 9 flow 需要跨 scope inheritance,Step 7 必须提供 scope relation / resolver port |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `for_subject(GovernedSubjectRef)` 增加 `scope_ref` 入参 | struct 字段要求 `scope_ref`;factory 必须覆盖字段来源 |
| `assert_scope_inheritance_allowed(...)` 只判断传入 refs | scope relation 读取不是 Step 6 对象职责,留给 Step 7 port |
| `assert_effective_at(...)` 不生成当前时间 | policy 不拥有 clock;application flow 传入正式 effective time |

#### 14.9 `ControlApplicabilityPolicy`

```rust
/// Guards method control applicability, review requirements, and body-free control snapshots.
pub struct ControlApplicabilityPolicy {
    /// Method-library control being assessed.
    pub control_ref: MethodControlRef,
    /// Governance context where the control is assessed.
    pub context_ref: GovernanceContextRef,
    /// Body-free control snapshot used as assessment input.
    pub control_snapshot: MethodControlSnapshot,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `control_ref` | `MethodControlRef` | 被判断的 method control | 必须与 `control_snapshot.control_ref` 一致;不得由 command 裸字符串拼接 |
| `context_ref` | `GovernanceContextRef` | 适用性判断所属治理语境 | 从 loaded `GovernanceContext.to_ref()` 派生;context 必须可评估 |
| `control_snapshot` | `MethodControlSnapshot` | 控制定义安全摘要 | 来源于 method control resolver / consumer snapshot;必须 body-free 且 resolution state acceptable |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_can_assess(&self, context: &GovernanceContext, snapshot: &MethodControlSnapshot) -> Result<(), DomainError>` | 校验控制可进入适用性评估 | loaded context、loaded method control snapshot | `Result<(), DomainError>` | 要求 context ref / control ref 匹配、context ready、snapshot acceptable;不创建 `ControlApplicability` |
| `pub fn assert_applicability_basis(&self, basis_ref: &EvidenceSummaryRef) -> Result<(), DomainError>` | 校验适用 / 排除依据可用 | evidence summary ref | `Result<(), DomainError>` | 要求 basis 可作为 compliance / control evidence;不读取 evidence body |
| `pub fn assert_review_required(&self, applicability: &ControlApplicability) -> Result<(), DomainError>` | 判断 applicability 是否需要进入复核 | loaded applicability fact | `Result<(), DomainError>` | `Applicable` path 要求后续 review planning;`NotApplicable` / `Excluded` 不自动创建 review |
| `pub fn assert_review_allowed(&self, applicability: &ControlApplicability, reviewer_ref: &ActorRef) -> Result<(), DomainError>` | 校验可为适用控制安排复核 | loaded applicability、reviewer actor ref | `Result<(), DomainError>` | 只允许 `Applicable`;actor 能力读取和授权留给 Step 7/9 service |
| `pub fn assert_no_definition_body(&self, snapshot: &MethodControlSnapshot) -> Result<(), DomainError>` | 校验 method control snapshot 没有携带控制正文 | method control snapshot | `Result<(), DomainError>` | 只允许 safe summary / digest / version ref;不保存 standard body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_control(context: &GovernanceContext, snapshot: MethodControlSnapshot) -> Result<Self, DomainError>` | 从 loaded context 和 control snapshot 构造 guard | context、method control snapshot | `Result<ControlApplicabilityPolicy, DomainError>` | `AssessControlApplicability`、`RecordControlReview`、coverage rebuild precheck |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 ControlDefinition 正文 | guard 只能保存 `MethodControlRef`、`GovernanceContextRef` 和 body-free `MethodControlSnapshot` |
| 不创建 applicability truth | `assert_can_assess(...)` 只判断;`ControlApplicability::assess(...)` 由 application flow 调用 |
| 不创建 review truth | `assert_review_required(...)` 只表达 guard result;`ControlReview::plan(...)` 由 review flow 调用 |
| report 不反写适用事实 | coverage view、dashboard、report 只能消费 applicability / review truth,不得触发 mark applicable / exclude |
| evidence body 不进入 guard | `EvidenceSummaryRef` 只引用 verified / acceptable evidence summary;artifact body 归 artifact / archive |
| snapshot stale 不静默通过 | unresolved / stale / incompatible method control snapshot 必须返回 domain error 或 degraded precheck,不得当作 active control |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `control_snapshot` 保留为 `MethodControlSnapshot`,不改成 control definition body | shared snapshot 已在 §10.6 闭合;本仓不得保存 standard / method body |
| `assert_can_assess(...)` 接收 loaded context / snapshot | guard 不读取 repository;context readiness 和 snapshot state 必须由入参承载 |
| `assert_review_required(...)` 不直接创建 review | review truth 有独立 id、state 和 factory,不能由 policy guard 隐式生成 |
| `assert_review_allowed(...)` 不判断 actor capability body | actor capability snapshot / authorization 读取面留给 Step 7/9,Step 6 只固定 guard 输入边界 |

#### 14.10 `ComplianceConclusionPolicy`

```rust
/// Guards AIIA and SoA conclusion readiness, coverage, evidence, and approval basis.
pub struct ComplianceConclusionPolicy {
    /// Governance context where the conclusion is evaluated.
    pub context_ref: GovernanceContextRef,
    /// Evidence summary used for review or decision basis when available.
    pub evidence_ref: Option<EvidenceSummaryRef>,
    /// Control coverage summary used by SoA conclusions when available.
    pub control_coverage_ref: Option<ControlCoverageRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_ref` | `GovernanceContextRef` | 被评审结论所属治理语境 | 从 loaded context 或 conclusion `context_ref` 派生;不得跨 context 混用 |
| `evidence_ref` | `Option<EvidenceSummaryRef>` | 结论评审 / 批准依据 | 来自 command basis、artifact evidence resolver 或 conclusion `review_evidence_ref`;只保存 summary ref |
| `control_coverage_ref` | `Option<ControlCoverageRef>` | SoA 控制覆盖摘要 | 仅 SoA path 必须存在;AIIA path 不要求 coverage |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_aiia_review_ready(&self, conclusion: &AIIAConclusion) -> Result<(), DomainError>` | 校验 AIIA conclusion 可提交 / 处于评审路径 | loaded AIIA conclusion | `Result<(), DomainError>` | 要求 context 匹配、artifact ref 存在、draft / in-review path 合法;不读取 artifact body |
| `pub fn assert_soa_control_coverage(&self, conclusion: &SoAConclusion, coverage_ref: &ControlCoverageRef) -> Result<(), DomainError>` | 校验 SoA conclusion 覆盖摘要闭合 | loaded SoA conclusion、coverage ref | `Result<(), DomainError>` | 要求 coverage ref 与 policy / conclusion 匹配;submit / approve path 必须有 coverage |
| `pub fn assert_review_evidence(&self, evidence_ref: &EvidenceSummaryRef) -> Result<(), DomainError>` | 校验结论评审依据可用 | evidence summary ref | `Result<(), DomainError>` | evidence 必须 acceptable for compliance;不保存或解析 evidence body |
| `pub fn assert_approval_decision(&self, decision: &GovernanceDecision) -> Result<(), DomainError>` | 校验批准 / 拒绝裁决有效 | loaded governance decision | `Result<(), DomainError>` | decision 必须 finalized、context / subject 可匹配;不创建 decision |
| `pub fn assert_no_artifact_body(&self, artifact_ref: &ArtifactRef) -> Result<(), DomainError>` | 校验 AIIA / SoA 正文未进入本对象 | artifact ref | `Result<(), DomainError>` | 只允许 external artifact ref;archive body 归 artifact / archive boundary |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_context(context: &GovernanceContext, evidence_ref: Option<EvidenceSummaryRef>, control_coverage_ref: Option<ControlCoverageRef>) -> Result<Self, DomainError>` | 从 context 和已解析 summary refs 构造 conclusion guard | loaded context、optional evidence、optional coverage | `Result<ComplianceConclusionPolicy, DomainError>` | `SubmitAIIAConclusion`、`SubmitSoAConclusion`、approve / reject / revoke precheck |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不自动批准草稿 | guard 不能把 `Drafted` 直接视为 `Approved`;formal decision 仍由 `GovernanceDecision` truth 承载 |
| 不保存 AIIA / SoA 正文 | artifact body、archive package、review notes 不进入 policy 或 conclusion truth |
| SoA coverage 必须显式闭合 | SoA submit / approve path 必须能回到 `ControlCoverageRef`;不得从 report title 或 dashboard 状态推断 |
| AIIA 不要求 control coverage | AIIA risk / impact conclusion 不保存 `ControlCoverageRef`;跨结论关联留给 query / trace / policy flow |
| decision 不替代 evidence | approved / rejected decision 必须是正式 `GovernanceDecision`;evidence summary 只能作为依据,不能冒充 decision |
| revoked 不覆盖原裁决 | revoke guard 只能校验 revocation decision,不得清空原 approval / rejection decision ref |
| consumer 不直接创建 conclusion truth | artifact / method / evidence consumer 只能写 snapshot、reference state 或 stale marker,不得创建 AIIA / SoA conclusion |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `assert_approval_decision(...)` 接收 loaded `GovernanceDecision` | 只靠 decision ref 无法判断 finalized / context;policy 不自行查仓库 |
| `assert_soa_control_coverage(...)` 明确只约束 SoA | AIIA conclusion object 没有 coverage 字段;不能把 SoA 约束套到 AIIA |
| `assert_no_artifact_body(...)` 接收 `ArtifactRef` | 本仓只保留 artifact 引用;正文归 artifact / archive boundary |
| factory 增加 optional evidence / coverage refs | struct 字段必须有明确来源;缺失时由具体 AIIA / SoA path 的 guard method 判断是否合法 |

#### 14.11 `NonconformityClosurePolicy`

```rust
/// Guards formal nonconformity corrective closure, verification, and reopen rules.
pub struct NonconformityClosurePolicy {
    /// Nonconformity record being guarded.
    pub nonconformity_ref: NonconformityRef,
    /// Severity captured on the guarded record.
    pub severity: NonconformitySeverity,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `nonconformity_ref` | `NonconformityRef` | 被判断的不符合记录 | 从 loaded `NonconformityRecord.to_ref()` 派生;不得使用 bug / alert / work blocker id 替代 |
| `severity` | `NonconformitySeverity` | 严重度上下文 | 从 loaded record 复制;只影响 policy / priority / SLA,不绕过状态闭环 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_can_confirm_cause(&self, record: &NonconformityRecord, cause_ref: &NonconformityCauseRef) -> Result<(), DomainError>` | 校验不符合可确认原因 | loaded record、cause ref | `Result<(), DomainError>` | 要求 record 匹配 policy、状态为 `Raised`、cause ref 非正文引用;不写 `cause_ref` |
| `pub fn assert_can_start_correction(&self, record: &NonconformityRecord, action: &CorrectiveAction) -> Result<(), DomainError>` | 校验可开始纠正 | loaded record、loaded corrective action | `Result<(), DomainError>` | 要求 record 可纠正、action 归属本 record、action 非终态;不启动 action |
| `pub fn assert_can_enter_verification(&self, record: &NonconformityRecord, action: &CorrectiveAction) -> Result<(), DomainError>` | 校验可进入等待复验 | loaded record、loaded corrective action | `Result<(), DomainError>` | 要求 record 正在纠正、action 已完成且归属本 record;不创建 verification result |
| `pub fn assert_can_close(&self, record: &NonconformityRecord, result: &VerificationResult) -> Result<(), DomainError>` | 校验不符合可关闭 | loaded record、loaded verification result | `Result<(), DomainError>` | 要求 record `ReadyForVerification`、result 归属本 record 且 `Passed`;不直接关闭 |
| `pub fn assert_can_reopen(&self, record: &NonconformityRecord, reason: &NonconformityReopenReason) -> Result<(), DomainError>` | 校验已关闭不符合可重开 | loaded record、reopen reason | `Result<(), DomainError>` | 只允许 `Closed`;reason 必须非空;不清空原 verification ref |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_record(record: &NonconformityRecord) -> Result<Self, DomainError>` | 从 loaded nonconformity record 构造 closure guard | loaded record | `Result<NonconformityClosurePolicy, DomainError>` | raise / confirm cause / correction / verification / close / reopen precheck |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不允许无复验关闭 | `Closed` 必须由 passed `VerificationResult` 支撑,不得只凭 corrective action completed |
| Failed / Inconclusive 不能关闭 | 失败或无法确认的复验只能进入补证、重新纠正或重新复验 flow |
| 不把外部线索当闭环 | bug、alert、incident、work blocker 只能作为 `GovernanceSourceRef`,不能替代 `NonconformityRecord` |
| 不创建 corrective action | policy 只判断 action 是否可消费;`CorrectiveAction::plan(...)` / `start(...)` 由 flow 调用 |
| 不创建 verification result | policy 只判断 result 是否可关闭;`VerificationResult::from_evidence(...)` 由 verify flow 调用 |
| severity 不跳过闭环 | 高严重度可影响优先级,但不得绕过 cause、correction、verification 和 close |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 `assert_can_enter_verification(...)` | HLD 责任包含“进入复验”,且 `NonconformityRecord` 有 `ReadyForVerification` 状态 |
| `assert_can_close(...)` 要求 loaded `VerificationResult` | 只靠 result ref 无法判断 `Passed` 和归属;policy 不自行查仓库 |
| `assert_can_start_correction(...)` 要求 loaded `CorrectiveAction` | action 归属和终态必须由对象字段判断,不能解析 Work ref |

#### 14.12 `ReadVisibilityPolicy`

```rust
/// Guards Governance read visibility and produces explicit not-visible markers.
pub struct ReadVisibilityPolicy {
    /// Actor performing the read.
    pub actor_ref: ActorRef,
    /// Scope requested by the read.
    pub scope_ref: GovernanceScopeRef,
    /// Optional governed subject requested by the read.
    pub subject_ref: Option<GovernedSubjectRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `actor_ref` | `ActorRef` | 读取 actor | 来源于 query actor context;不保存 actor profile |
| `scope_ref` | `GovernanceScopeRef` | 查询范围 | 来源于 query request、view ref 或 resolver summary;不得解析裸字符串扩大范围 |
| `subject_ref` | `Option<GovernedSubjectRef>` | 被查询对象 | subject query 必须为 `Some`;scope-only dashboard / report query 可为 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate_read_subject(&self, read_subject_ref: &GovernanceReadSubjectRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 生成当前 actor 对 read subject 的可见性 marker | read subject、optional loaded actor capability snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | denied 返回 `is_visible = false` marker; malformed input 才返回 error;不读取 repository |
| `pub fn evaluate_can_read_decision(&self, decision_ref: &GovernanceDecisionRef, read_subject_ref: &GovernanceReadSubjectRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 判断 decision ref 是否可读 | decision ref、mapped read subject、actor snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | 不加载 decision;具体 ref->subject 映射由 Step 7/8 query port 提供 |
| `pub fn evaluate_can_read_policy(&self, policy_ref: &PolicyEffectiveFactRef, read_subject_ref: &GovernanceReadSubjectRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 判断 policy fact 是否可读 | policy ref、mapped read subject、actor snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | 不泄露 policy body;denied 用 marker 承载 |
| `pub fn evaluate_can_read_compliance(&self, conclusion_ref: &ComplianceConclusionRef, read_subject_ref: &GovernanceReadSubjectRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 判断 AIIA / SoA conclusion 是否可读 | compliance conclusion ref、mapped read subject、actor snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | 不输出 artifact body;union ref branch 必须保持显式 |
| `pub fn evaluate_can_read_trace(&self, trace: &GovernanceTraceRecord, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 判断 trace record 是否可读 | loaded trace record、actor snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | trace denied 不返回 trace body;query 不创建 missing trace |
| `pub fn assert_no_external_body_leak(&self, read_subject_ref: &GovernanceReadSubjectRef) -> Result<(), DomainError>` | 校验 query response 只输出 Governance fact / summary | read subject | `Result<(), DomainError>` | external artifact、process、work、runtime 正文不得通过 governance query 泄露 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_actor(actor_ref: ActorRef, scope_ref: GovernanceScopeRef, subject_ref: Option<GovernedSubjectRef>) -> Result<Self, DomainError>` | 从 actor、scope 和 optional subject 构造 visibility guard | actor、scope、subject | `Result<ReadVisibilityPolicy, DomainError>` | dashboard、decision query、policy query、compliance query、trace query precheck |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| denied 不是普通异常 | authorization denied 必须能形成 `GovernanceVisibilityMarker`,让 query 返回 not visible / redacted surface |
| 不绕过授权查询 | 所有 public query、trace query、report query 都必须先经 visibility guard |
| 不泄露外部正文 | visible 也只能输出 Governance fact / summary;artifact / work / process / runtime body 仍归来源仓 |
| not visible 不泄露存在性细节 | denied marker 的 reason 不得包含受保护对象标题、正文、摘要或敏感 external id |
| query no-write | visibility 判断不得 mark stale、refresh snapshot、append trace 或修复 projection |
| capability 必须显式传入 | policy 不读取 identity / capability repository;缺失或 stale snapshot 应产生 not-visible / degraded 口径 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `assert_can_read_*` 改为 `evaluate_can_read_* -> GovernanceVisibilityMarker` | query denied 需要正式 marker surface,不能只有 `Result<()>` 或 error |
| read method 增加 `GovernanceReadSubjectRef` | 只靠 truth ref 无法判断 subject / scope;映射由 Step 7/8 query port 明确 |
| trace read 接收 loaded `GovernanceTraceRecord` | trace subject 在 record 内;policy 不自行查 trace repository |
| 增加 `actor_snapshot` optional 入参 | actor capability 必须由 application 加载后传入;policy 不直接读取 identity |

#### 14.13 `DerivedGovernanceViewPolicy`

```rust
/// Guards derived view maintenance so projections remain read-only and rebuildable.
pub struct DerivedGovernanceViewPolicy {
    /// Derived view being maintained.
    pub view_ref: DerivedGovernanceViewRef,
    /// Source cursor that the view is expected to represent or rebuild from.
    pub source_cursor: GovernanceTruthCursor,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | 被维护的派生视图 | 从 projection repository / builder 的 stable view ref 传入;不得临时拼接 ad hoc view id |
| `source_cursor` | `GovernanceTruthCursor` | 派生来源位置 | 来源于 committed truth cursor、projection state 或 rebuild input;不作为 optimistic version |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_rebuild_source(&self, state: &DerivedGovernanceViewState, target_cursor: &GovernanceTruthCursor) -> Result<(), DomainError>` | 校验 view 可从指定 truth cursor 重建 | loaded view state、target cursor | `Result<(), DomainError>` | 要求 view ref 匹配、target cursor 不早于 policy cursor 的正式排序口径留给 Step 11;不调用 rebuild |
| `pub fn assert_no_truth_write(&self, view_ref: &DerivedGovernanceViewRef) -> Result<(), DomainError>` | 校验派生视图维护不会反写 core truth | derived view ref | `Result<(), DomainError>` | 只允许 projection state / view body 写入;不得创建或修改 Governance truth |
| `pub fn assert_report_derived_from_truth(&self, report_ref: &GovernanceReportRef, source_cursor: &GovernanceTruthCursor) -> Result<(), DomainError>` | 校验报告来源于 truth / projection cursor | report ref、source cursor | `Result<(), DomainError>` | report ref 只指向 report identity / storage ref;不保存 report body |
| `pub fn assert_failure_degrades_only(&self, state: &DerivedGovernanceViewState) -> Result<(), DomainError>` | 校验 projection 失败只影响消费可见性 | loaded view state | `Result<(), DomainError>` | `Failed` / `Unavailable` 只能导致 degraded / freshness marker,不得阻塞 accepted truth |
| `pub fn covers_view(&self, view_ref: &DerivedGovernanceViewRef) -> bool` | 判断 policy 是否覆盖某 view | derived view ref | `bool` | 纯判断;比较 stable view identity |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_view(view_ref: DerivedGovernanceViewRef, source_cursor: GovernanceTruthCursor) -> Result<Self, DomainError>` | 从 view ref 和来源 cursor 构造 derived view guard | stable view ref、source cursor | `Result<DerivedGovernanceViewPolicy, DomainError>` | projection rebuild、reconciliation report、query freshness precheck |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不生成业务事实 | projection maintenance 只能更新 `DerivedGovernanceViewState` 或 view body,不得创建 decision / policy / control / nonconformity truth |
| 不阻塞 core truth 成立 | derived view stale / failed / unavailable 只影响 query freshness / degraded surface,不得回滚 accepted command |
| 不反写真相 | view、report、dashboard、search index 不能调用 truth aggregate transition |
| 不保存 report body | `GovernanceReportRef` 只引用 report identity / storage ref;report body、archive package 和 external export body 不进入 policy |
| cursor 不当 version | `GovernanceTruthCursor` 用于 source alignment,不得作为 optimistic version 或 lock token |
| query no-write | query 只能读取 view state 和 marker,不得在 visibility / freshness check 中执行 rebuild 或 mark fresh |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `assert_rebuild_source(...)` 增加 loaded `DerivedGovernanceViewState` 入参 | 只靠 cursor 无法校验 view ref、freshness state 和当前 source cursor |
| `assert_report_derived_from_truth(...)` 增加 `source_cursor` 入参 | report 是否来源于 truth / projection 需要固定 cursor 来源,不能解析 report ref |
| 增加 `assert_failure_degrades_only(...)` | HLD 禁止派生失败阻塞核心 truth;本方法把失败影响限制到 degraded / freshness surface |
| factory 保留 `source_cursor` 入参 | object 字段必填 source cursor;Step 6 不允许从 view ref 或当前时间推导 |

### 15. `contracts` view / report helper 与 `application` object 契约

本节继续展开完整 public view / report DTO 和 application helper object。§10.18 已经闭合 query marker、page helper、`GovernanceViewSurface` 与轻量 view refs;本节不得重复定义 marker。所有 view / report 都属于 `contracts` public surface:只能保存 body-free refs、summary state、surface marker 和 source cursor,不得保存 sibling 仓正文或反写 domain truth。

#### 15.1 `GovernanceDashboardView`

```rust
/// Public Governance dashboard assembled from body-free truth summaries.
pub struct GovernanceDashboardView {
    /// Stable derived view identity.
    pub view_ref: DerivedGovernanceViewRef,
    /// Governance scope covered by the dashboard.
    pub scope_ref: GovernanceScopeRef,
    /// Source cursor represented by the dashboard.
    pub source_cursor: GovernanceTruthCursor,
    /// Freshness state observed for this view.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Shared visibility, freshness, and degraded response surface.
    pub surface: GovernanceViewSurface,
    /// Policy facts summarized by the dashboard.
    pub policy_refs: PolicyEffectiveFactRefSet,
    /// Control applicability facts summarized by the dashboard.
    pub control_refs: ControlApplicabilityRefSet,
    /// Compliance conclusions summarized by the dashboard.
    pub conclusion_refs: ComplianceConclusionRefSet,
    /// Nonconformity records summarized by the dashboard.
    pub nonconformity_refs: NonconformityRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | dashboard view identity | projection builder / repository 生成;不得临时拼接 |
| `scope_ref` | `GovernanceScopeRef` | dashboard 范围 | 必须来自 `GovernanceTruthSnapshot.scope_ref` 或 query scope resolver |
| `source_cursor` | `GovernanceTruthCursor` | view 代表的 truth cursor | 从 snapshot / projection state 复制;不作为 optimistic version |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | projection freshness | 从 `DerivedGovernanceViewState` 或 query assembler 传入;不得默认为 fresh |
| `surface` | `GovernanceViewSurface` | public query marker | query assembler 基于 visibility / freshness / degraded 结果组装;只读 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | dashboard 展示的 policy fact refs | 从 `GovernanceTruthSnapshot.policy_refs` 复制;不保存 policy body |
| `control_refs` | `ControlApplicabilityRefSet` | dashboard 展示的 control applicability refs | 从 snapshot 复制;不保存 control definition 或 review body |
| `conclusion_refs` | `ComplianceConclusionRefSet` | dashboard 展示的 AIIA / SoA conclusion refs | 从 snapshot 复制;不保存 artifact body |
| `nonconformity_refs` | `NonconformityRefSet` | dashboard 展示的不符合 refs | 从 snapshot 复制;不保存 corrective action / evidence body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_stale(&self) -> bool` | 判断 dashboard 是否需要 rebuild / degraded surface | 无 | `bool` | `freshness_state != Fresh` 返回 true;不触发 rebuild |
| `pub fn covers_scope(&self, scope_ref: &GovernanceScopeRef) -> bool` | 判断 dashboard 是否覆盖指定 scope | scope ref | `bool` | 比较 stable scope identity;不读取 repository |
| `pub fn is_visible(&self) -> bool` | 判断 dashboard body 是否可返回给当前 actor | 无 | `bool` | 读取 `surface.visibility.is_visible`;不执行 authorization |
| `pub fn truth_ref_count(&self) -> usize` | 返回 dashboard 汇总 ref 数 | 无 | `usize` | 纯计算;policy/control/conclusion/nonconformity refs 合计 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth(view_ref: DerivedGovernanceViewRef, snapshot: GovernanceTruthSnapshot, surface: GovernanceViewSurface, freshness_state: DerivedGovernanceViewFreshnessState) -> Result<Self, ContractError>` | 从 body-free truth snapshot 构造 dashboard | stable view ref、truth snapshot、view surface、freshness state | `Result<GovernanceDashboardView, ContractError>` | dashboard projection build / query assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不作为 truth source | dashboard 只能消费 `GovernanceTruthSnapshot`,不得创建或修改 governance truth |
| 不绕过 visibility | `surface.visibility.is_visible == false` 时 Step 8/9 query 必须返回空 body 或 redacted body |
| 不保存正文 | 不保存 policy definition、control definition、artifact、evidence、work、process 或 runtime body |
| 不自造 decision list | 本批未定义 `GovernanceDecisionRefSet`;decision / gate 摘要由 `DecisionSummaryView` 与 query port 提供 |
| stale 必须显式暴露 | stale / failed / unavailable 不能伪装成 fresh dashboard |
| ref set 可为空 | 空 policy/control/conclusion/nonconformity set 表示当前 scope 无已知项目,不是缺失错误 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `view_ref` 和 `surface` 入参 | HLD factory 未覆盖 view identity 和 public query marker 字段 |
| dashboard 增加 ref sets | HLD 说“汇总治理事实状态”,需要可落码的 body-free summary carrier;复用已闭合 `GovernanceTruthSnapshot` refs |
| 不新增 decision / gate set 字段 | 当前 Step 6 未闭合对应 set type;避免私自补 public schema |

#### 15.2 `DecisionSummaryView`

```rust
/// Public read model summarizing one Gate and Governance decision.
pub struct DecisionSummaryView {
    /// Stable decision summary view identity.
    pub view_ref: DecisionSummaryViewRef,
    /// Decision represented by this summary.
    pub decision_ref: GovernanceDecisionRef,
    /// Gate represented by this summary.
    pub gate_ref: GateRef,
    /// Current summary readability state.
    pub summary_state: DecisionSummaryState,
    /// Shared visibility, freshness, and degraded response surface.
    pub surface: GovernanceViewSurface,
    /// Source cursor used to assemble the summary.
    pub source_cursor: GovernanceTruthCursor,
    /// Optional evidence basis visible through the summary.
    pub basis_ref: Option<EvidenceSummaryRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `DecisionSummaryViewRef` | decision summary view identity | projection builder / repository 生成;不替代 `GovernanceDecisionRef` |
| `decision_ref` | `GovernanceDecisionRef` | 对应正式裁决 | 从 loaded `GovernanceDecision.to_ref()` 复制;不得指向 vote / report / runtime cache |
| `gate_ref` | `GateRef` | 对应 Gate | 从 loaded `Gate.to_ref()` 或 decision `gate_ref` 复制;不得指向 process waiting gate |
| `summary_state` | `DecisionSummaryState` | 摘要可读性状态 | projection/query assembler 计算;`NotVisible` 只作为 query-scoped surface |
| `surface` | `GovernanceViewSurface` | public query marker | visibility / freshness / degraded marker;不写状态 |
| `source_cursor` | `GovernanceTruthCursor` | 组装摘要的 truth cursor | 来源于 accepted truth cursor、trace cursor 或 projection state |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 可见依据摘要 | 从 decision `basis_ref` 复制;只保存 evidence summary ref |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_decision(&self, decision_ref: &GovernanceDecisionRef) -> bool` | 判断是否属于指定 decision | decision ref | `bool` | 纯判断;比较 decision id |
| `pub fn matches_gate(&self, gate_ref: &GateRef) -> bool` | 判断是否属于指定 gate | gate ref | `bool` | 纯判断;比较 gate id |
| `pub fn is_visible_to(&self, policy: &ReadVisibilityPolicy, read_subject_ref: &GovernanceReadSubjectRef, actor_snapshot: Option<&ActorCapabilitySnapshot>) -> Result<GovernanceVisibilityMarker, DomainError>` | 判断 summary 是否可输出给 actor | visibility policy、mapped read subject、optional actor snapshot | `Result<GovernanceVisibilityMarker, DomainError>` | 调用 visibility guard;不改变 `summary_state` |
| `pub fn is_stale(&self) -> bool` | 判断 summary 是否过期 | 无 | `bool` | `summary_state == Stale` 或 surface freshness 非 fresh 时返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_decision(view_ref: DecisionSummaryViewRef, decision: &GovernanceDecision, gate: &Gate, surface: GovernanceViewSurface, source_cursor: GovernanceTruthCursor) -> Result<Self, ContractError>` | 从已成立 decision 和 gate 构造摘要 | stable view ref、loaded decision、loaded gate、view surface、source cursor | `Result<DecisionSummaryView, ContractError>` | decision projection build / query assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 Decision truth | decision 当前状态仍以 `GovernanceDecision` 为准 |
| 不保存 evidence body | 只允许 `EvidenceSummaryRef`;artifact / evidence body 不进入 view |
| 不替代 Gate truth | gate 当前状态仍以 `Gate` 为准;view 只保存 gate ref |
| NotVisible 不持久化为 truth | `summary_state = NotVisible` 是 query scoped surface,不得写回 decision 或 gate |
| 不生成 downstream work | summary 可供消费,但不能创建 work、process signal、artifact 或 outbox |
| stale 需要 surface | stale / unavailable summary 必须通过 `GovernanceViewSurface` 暴露 freshness / degraded marker |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `view_ref`、`surface`、`source_cursor` 入参 | view 字段必填,不能从 decision / gate 隐式推导 |
| `is_visible_to(...)` 返回 `GovernanceVisibilityMarker` | 与 `ReadVisibilityPolicy` 收口一致,denied 不是普通错误 |
| 增加 `basis_ref` | HLD 禁止 evidence body,但 summary 需要可追溯依据引用;只保存 body-free ref |

#### 15.3 `PolicyEffectiveView`

```rust
/// Public read model showing effective policies and conflicts for one Governance scope.
pub struct PolicyEffectiveView {
    /// Stable policy effective view identity.
    pub view_ref: PolicyEffectiveViewRef,
    /// Governance scope covered by this view.
    pub scope_ref: GovernanceScopeRef,
    /// Policy facts included in this view.
    pub policy_refs: PolicyEffectiveFactRefSet,
    /// Policy conflict records included in this view.
    pub conflict_refs: PolicyConflictRefSet,
    /// Freshness state observed for this view.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Shared visibility, freshness, and degraded response surface.
    pub surface: GovernanceViewSurface,
    /// Source cursor used to assemble this view.
    pub source_cursor: GovernanceTruthCursor,
    /// Shared rule set considered by this view, when available.
    pub shared_rule_set_ref: Option<SharedRuleSetRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `PolicyEffectiveViewRef` | policy effective view identity | projection builder / repository 生成;不替代 policy truth |
| `scope_ref` | `GovernanceScopeRef` | policy 生效范围 | 从 `GovernanceTruthSnapshot.scope_ref` 或 query scope resolver 传入 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | 已纳入视图的 policy fact refs | 从 `GovernanceTruthSnapshot.policy_refs` 或 policy projection source 复制;不保存 policy body |
| `conflict_refs` | `PolicyConflictRefSet` | 相关 policy conflict refs | 从 conflict projection source 复制;空集合表示无已知冲突 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | projection freshness | 从 view state / query assembler 传入;不得默认为 fresh |
| `surface` | `GovernanceViewSurface` | public query marker | visibility / freshness / degraded marker;不写状态 |
| `source_cursor` | `GovernanceTruthCursor` | 组装视图的 truth cursor | 来源于 snapshot、projection state 或 accepted truth cursor |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 视图涉及的 shared rule set | 仅当 projection source 能明确时填写;不保存 rule body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn contains_policy(&self, policy_ref: &PolicyEffectiveFactRef) -> bool` | 判断视图是否包含指定 policy fact | policy ref | `bool` | 纯判断;按 policy fact id 匹配 |
| `pub fn has_unresolved_conflict(&self) -> bool` | 判断是否存在未解决冲突 | 无 | `bool` | `conflict_refs` 非空时返回 true;具体 conflict state 由 query / repository load 展开 |
| `pub fn covers_scope(&self, scope_ref: &GovernanceScopeRef) -> bool` | 判断是否覆盖指定 scope | scope ref | `bool` | 比较 stable scope identity |
| `pub fn is_stale(&self) -> bool` | 判断 view 是否过期或不可 fresh 使用 | 无 | `bool` | `freshness_state != Fresh` 或 surface freshness 非 fresh 时返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_policy_truth(view_ref: PolicyEffectiveViewRef, snapshot: GovernanceTruthSnapshot, conflict_refs: PolicyConflictRefSet, surface: GovernanceViewSurface, freshness_state: DerivedGovernanceViewFreshnessState, shared_rule_set_ref: Option<SharedRuleSetRef>) -> Result<Self, ContractError>` | 从 body-free policy truth 摘要构造 view | stable view ref、truth snapshot、conflict refs、surface、freshness、optional shared rule set | `Result<PolicyEffectiveView, ContractError>` | policy projection build / policy query assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不决定 Policy 生效 | 生效事实仍以 `PolicyEffectiveFact` 当前状态为准 |
| 不执行 Policy | Runtime / capability 只消费 view 结果,不能把 view 当 policy engine |
| 不保存 policy / rule body | policy definition、shared rule expression、organization config body 不进入 view |
| conflict refs 不等于 resolved state | `PolicyConflictRefSet` 只引用冲突;是否 resolved 由 conflict truth 或 query expansion 判断 |
| stale 必须显式暴露 | stale / failed / unavailable 不能伪装成 fresh policy view |
| shared rules optional 不代表无规则 | `None` 只表示本 view 未携带 shared rule set ref;不代表 shared rules 不适用 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `PolicyTruthSnapshot` 改为 `GovernanceTruthSnapshot` | Step 6 已闭合通用 body-free truth snapshot,未闭合单独 policy snapshot DTO |
| factory 增加 `view_ref`、`surface`、`freshness_state` | view 字段必填且 query surface 必须显式承载 |
| `has_unresolved_conflict()` 不加载 conflict body | contracts view 不能读取 repository;详细状态由 query flow 展开 |

#### 15.4 `ControlCoverageView`

```rust
/// Public read model showing control applicability, review, and compliance coverage.
pub struct ControlCoverageView {
    /// Stable control coverage view identity.
    pub view_ref: ControlCoverageViewRef,
    /// Governance context covered by this view.
    pub context_ref: GovernanceContextRef,
    /// Control applicability facts included in coverage.
    pub control_refs: ControlApplicabilityRefSet,
    /// Compliance conclusions related to this coverage.
    pub conclusion_refs: ComplianceConclusionRefSet,
    /// Current coverage status.
    pub coverage_state: ControlCoverageState,
    /// Freshness state observed for this view.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Shared visibility, freshness, and degraded response surface.
    pub surface: GovernanceViewSurface,
    /// Source cursor used to assemble this view.
    pub source_cursor: GovernanceTruthCursor,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `ControlCoverageViewRef` | control coverage view identity | projection builder / repository 生成;不替代 SoA 或 control truth |
| `context_ref` | `GovernanceContextRef` | 被覆盖治理语境 | 从 loaded context、query request 或 projection source 传入 |
| `control_refs` | `ControlApplicabilityRefSet` | 控制适用事实集合 | 从 `GovernanceTruthSnapshot.control_refs` 或 control projection source 复制 |
| `conclusion_refs` | `ComplianceConclusionRefSet` | AIIA / SoA 结论集合 | 从 `GovernanceTruthSnapshot.conclusion_refs` 或 compliance projection source 复制 |
| `coverage_state` | `ControlCoverageState` | 覆盖摘要状态 | projection / query assembler 计算;不得写回 `ControlApplicability` |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | projection freshness | 从 view state / query assembler 传入 |
| `surface` | `GovernanceViewSurface` | public query marker | visibility / freshness / degraded marker;不写状态 |
| `source_cursor` | `GovernanceTruthCursor` | 组装视图的 truth cursor | 来源于 snapshot、projection state 或 accepted truth cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn has_gap(&self) -> bool` | 判断是否存在覆盖缺口 | 无 | `bool` | `coverage_state == GapDetected` 返回 true |
| `pub fn requires_review(&self) -> bool` | 判断是否需要补证 / 复核 | 无 | `bool` | `GapDetected` / `PendingEvidence` / stale degraded path 返回 true |
| `pub fn covers_context(&self, context_ref: &GovernanceContextRef) -> bool` | 判断是否覆盖指定 context | context ref | `bool` | 比较 stable context identity |
| `pub fn is_stale(&self) -> bool` | 判断 coverage view 是否过期 | 无 | `bool` | `freshness_state != Fresh` 或 `coverage_state == Stale` 返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_control_truth(view_ref: ControlCoverageViewRef, context_ref: GovernanceContextRef, snapshot: GovernanceTruthSnapshot, coverage_state: ControlCoverageState, surface: GovernanceViewSurface, freshness_state: DerivedGovernanceViewFreshnessState) -> Result<Self, ContractError>` | 从 body-free control / compliance truth 摘要构造 coverage view | stable view ref、context ref、truth snapshot、coverage state、surface、freshness | `Result<ControlCoverageView, ContractError>` | control coverage projection build / coverage query assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不替代 SoA 结论 | coverage view 只摘要覆盖情况;SoA 批准仍以 `SoAConclusion` 和 formal decision 为准 |
| 不反写 control truth | view 不能把 applicability 改成 applicable / excluded,也不能创建 review |
| 不保存 standard / control body | 只保存 control applicability refs、summary state 和 surface marker |
| conclusion refs 不批准合规 | `ComplianceConclusionRefSet` 只引用 AIIA / SoA conclusion,不表达批准动作 |
| PendingEvidence 必须显式 | 缺证据或 reference pending 不能被当成 complete coverage |
| stale 需要 surface | stale / failed / unavailable 必须通过 freshness / degraded marker 暴露 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| `ControlTruthSnapshot` 改为 `GovernanceTruthSnapshot` | Step 6 已闭合通用 truth snapshot,未闭合单独 control snapshot DTO |
| 增加 `conclusion_refs` | coverage HLD 涉及 AIIA / SoA 覆盖;必须用 body-free ref 承载 conclusion 关联 |
| factory 增加 `view_ref`、`coverage_state`、`surface`、`freshness_state` | view 字段必填,且 coverage / query marker 不能隐式推导 |

#### 15.5 `NonconformityStatusView`

```rust
/// Public read model summarizing one Governance nonconformity closure status.
pub struct NonconformityStatusView {
    /// Stable nonconformity status view identity.
    pub view_ref: NonconformityStatusViewRef,
    /// Nonconformity represented by this view.
    pub nonconformity_ref: NonconformityRef,
    /// Current public status summary.
    pub status_state: NonconformityStatusViewState,
    /// Freshness state observed for this view.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Shared visibility, freshness, and degraded response surface.
    pub surface: GovernanceViewSurface,
    /// Source cursor used to assemble this view.
    pub source_cursor: GovernanceTruthCursor,
    /// Active corrective action when the nonconformity is being corrected.
    pub active_action_ref: Option<CorrectiveActionRef>,
    /// Verification result used for closure when available.
    pub verification_ref: Option<VerificationResultRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `NonconformityStatusViewRef` | nonconformity status view identity | projection builder / repository 生成;不替代 nonconformity truth |
| `nonconformity_ref` | `NonconformityRef` | 对应正式不符合记录 | 从 loaded `NonconformityRecord.to_ref()` 复制;不得使用 bug / alert / work blocker id |
| `status_state` | `NonconformityStatusViewState` | public 摘要状态 | projection / query assembler 计算;不得替代 `NonconformityState` |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | projection freshness | 从 view state / query assembler 传入 |
| `surface` | `GovernanceViewSurface` | public query marker | visibility / freshness / degraded marker;不写状态 |
| `source_cursor` | `GovernanceTruthCursor` | 组装视图的 truth cursor | 来源于 projection state、trace cursor 或 accepted truth cursor |
| `active_action_ref` | `Option<CorrectiveActionRef>` | 当前纠正动作引用 | 从 nonconformity truth 的 `active_action_ref` 或 action projection source 复制;不保存 Work truth |
| `verification_ref` | `Option<VerificationResultRef>` | 关闭或复验结果引用 | 从 nonconformity truth 的 `closure_verification_ref` 或 verification projection source 复制 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_open(&self) -> bool` | 判断不符合是否仍未闭环 | 无 | `bool` | 基于 `status_state` / `verification_ref` 的 public summary 判断;不读取 truth repository |
| `pub fn requires_action(&self) -> bool` | 判断是否需要纠正动作或复验动作 | 无 | `bool` | open 且无 active action / verification pending 时可返回 true;不创建 action |
| `pub fn matches(&self, nonconformity_ref: &NonconformityRef) -> bool` | 判断是否属于指定不符合 | nonconformity ref | `bool` | 纯判断;比较 stable nonconformity id |
| `pub fn is_stale(&self) -> bool` | 判断 status view 是否过期 | 无 | `bool` | `freshness_state != Fresh` 或 surface freshness 非 fresh 时返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_nonconformity(view_ref: NonconformityStatusViewRef, record: &NonconformityRecord, status_state: NonconformityStatusViewState, surface: GovernanceViewSurface, freshness_state: DerivedGovernanceViewFreshnessState, source_cursor: GovernanceTruthCursor) -> Result<Self, ContractError>` | 从 loaded nonconformity truth 构造 status view | stable view ref、loaded nonconformity、status summary、surface、freshness、cursor | `Result<NonconformityStatusView, ContractError>` | nonconformity projection build / query assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不关闭不符合 | view 不能调用 `NonconformityRecord::close(...)`;关闭必须由 domain truth transition 执行 |
| 不替代 corrective action | `active_action_ref` 只读展示纠正动作引用,不表达 WorkItem 或 action 当前 body |
| status state 不替代 truth state | `NonconformityStatusViewState` 是 public summary newtype,不得驱动 closure flow |
| 不保存 evidence / work body | verification evidence、corrective work、artifact body 和 runtime log 不进入 view |
| stale 需要 surface | stale / failed / unavailable 必须通过 freshness / degraded marker 暴露 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `view_ref`、`status_state`、`surface`、`freshness_state`、`source_cursor` | view 字段必填且 query marker 不能隐式推导 |
| 增加 `active_action_ref` / `verification_ref` | HLD 责任包含纠正和复验摘要;必须用 body-free refs 承载 |
| `is_open()` 不读取 repository | contracts view 只能基于自身字段判断;truth 展开由 query flow 负责 |

#### 15.6 `GovernanceReconciliationReport`

```rust
/// Public report describing reconciliation results for Governance truth and projections.
pub struct GovernanceReconciliationReport {
    /// Stable reconciliation report identity.
    pub report_id: GovernanceReconciliationReportId,
    /// Governance scope covered by reconciliation.
    pub scope_ref: GovernanceScopeRef,
    /// Source cursor used by reconciliation.
    pub source_cursor: GovernanceTruthCursor,
    /// Reconciliation findings included in this report.
    pub finding_refs: GovernanceReconciliationFindingRefSet,
    /// Current reconciliation report state.
    pub report_state: ReconciliationReportState,
    /// Shared visibility, freshness, and degraded response surface when returned by query.
    pub surface: GovernanceViewSurface,
    /// Derived views inspected by reconciliation.
    pub view_refs: DerivedGovernanceViewRefSet,
    /// Outbox records inspected by reconciliation.
    pub outbox_refs: GovernanceOutboxRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `report_id` | `GovernanceReconciliationReportId` | 对账报告身份 | reconciliation job / report repository 生成;不得使用 job run id 替代 |
| `scope_ref` | `GovernanceScopeRef` | 对账范围 | 从 `GovernanceReconciliationInput.scope_ref` 复制 |
| `source_cursor` | `GovernanceTruthCursor` | 对账来源位置 | 从 reconciliation input 复制;不作为 optimistic version |
| `finding_refs` | `GovernanceReconciliationFindingRefSet` | 对账发现集合 | reconciliation job 产生或保存 finding 后传入;空集合表示无发现 |
| `report_state` | `ReconciliationReportState` | 报告状态 | `Generated` / `Failed` / `Superseded`;不得表达 truth state |
| `surface` | `GovernanceViewSurface` | query 返回时的 public marker | query assembler 传入;report creation path 不因 surface 改 truth |
| `view_refs` | `DerivedGovernanceViewRefSet` | 被检查的派生视图 | 从 `GovernanceReconciliationInput.view_refs` 复制;ordered unique |
| `outbox_refs` | `GovernanceOutboxRefSet` | 被检查的 outbox 记录 | 从 input 复制;不保存 event payload body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GovernanceReconciliationReportRef` | 生成 report ref | 无 | `GovernanceReconciliationReportRef` | 纯函数;复制 `report_id` |
| `pub fn has_blocking_findings(&self) -> bool` | 判断是否存在阻塞发现 | 无 | `bool` | `finding_refs` 非空时可返回 true;finding severity 展开由 Step 9/16 query 或 report detail 负责 |
| `pub fn covers_scope(&self, scope_ref: &GovernanceScopeRef) -> bool` | 判断是否覆盖指定 scope | scope ref | `bool` | 比较 stable scope identity |
| `pub fn requires_rebuild(&self) -> bool` | 判断是否提示 projection rebuild | 无 | `bool` | findings 或 inspected failed views 可触发 true;不启动 rebuild |
| `pub fn is_generated(&self) -> bool` | 判断报告是否成功生成 | 无 | `bool` | `report_state == Generated` 返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_reconciliation(report_id: GovernanceReconciliationReportId, input: GovernanceReconciliationInput, finding_refs: GovernanceReconciliationFindingRefSet, surface: GovernanceViewSurface) -> Result<Self, ContractError>` | 从对账输入和 findings 构造报告 | generated report id、reconciliation input、finding refs、query surface | `Result<GovernanceReconciliationReport, ContractError>` | reconciliation job report creation / query assembly |
| `pub fn failed(report_id: GovernanceReconciliationReportId, input: GovernanceReconciliationInput, finding_refs: GovernanceReconciliationFindingRefSet, surface: GovernanceViewSurface) -> Result<Self, ContractError>` | 构造失败报告 surface | generated report id、input、failure findings、surface | `Result<GovernanceReconciliationReport, ContractError>` | reconciliation job failed before valid generated report |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不直接修复 truth | report 只暴露问题和维护线索,不得修改 decision / policy / control / nonconformity truth |
| 不成为 external GRC truth | external GRC 只能消费或导出 report ref / package,不能把 report 当治理事实 |
| finding refs 不保存正文 | finding body / adapter log / external payload 不进入 report object |
| rebuild 是提示不是动作 | `requires_rebuild()` 不调用 projection repository 或 job runner |
| failed report 必须可见 | failed reconciliation 仍应进入 operations / query surface,不得静默丢弃 |
| cursor 不当 version | `source_cursor` 只用于对账对齐,不得作为 lock token |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| factory 增加 `report_id` 和 `surface` 入参 | object 字段必填;query surface 必须显式承载 |
| report 保存 `view_refs` / `outbox_refs` | reconciliation input 已闭合这些 inspected refs;报告需要可追溯检查范围 |
| `has_blocking_findings()` 不解析 finding body | 本 Step 只有 finding ref set;finding severity / detail 留给 Step 8/9/16 |

#### 15.7 `application` service facade / operation helper object contracts

本节开始闭合 `application` helper object。这里的对象只定义 service facade 和应用层 value object 的字段、状态、工厂和不变量;repository / port trait 签名、UoW 事务顺序、完整 command / consumer / job result DTO 仍由 Step 7、Step 8、Step 11、Step 13 展开。本节不得把 helper 伪装成 domain truth,也不得让 stored result ref 代替真实 result surface 读取闭环。

##### application-local operation shared helpers

```rust
/// Classifies the application entry channel protected by orchestration rules.
pub enum GovernanceOperationChannel {
    /// Synchronous command that may write Governance truth.
    Command,
    /// Read-only query that must not reserve idempotency.
    Query,
    /// Inbound event consumer that may update snapshots, receipts, and stale markers.
    InboundEvent,
    /// Operations job that may maintain outbox, projections, references, reports, or handoff markers.
    OperationsJob,
}

/// Names a Governance application operation without carrying payload.
pub struct GovernanceOperationName(pub String);

/// Normalized idempotency key used by command, event, and job application flows.
pub struct GovernanceOperationIdempotencyKey(pub String);

/// Canonical digest of the stable request, event, or job input payload.
pub struct GovernanceRequestDigest(pub String);

/// Stable id generated for an application result surface.
pub struct GovernanceApplicationResultId(pub String);

/// References a stored result surface for duplicate replay.
pub struct GovernanceApplicationResultRef {
    /// Operation that produced the result.
    pub operation_name: GovernanceOperationName,
    /// Stable stored result id.
    pub result_id: GovernanceApplicationResultId,
}

/// Explains why an idempotency reservation became conflicted.
pub struct GovernanceIdempotencyConflictReason(pub String);

/// Current technical state of an idempotency reservation.
pub enum GovernanceIdempotencyState {
    /// The operation key and digest were reserved but no result is stored yet.
    Reserved,
    /// The operation completed and points to a stored result surface.
    Completed,
    /// The same key was reused with a different operation or digest.
    Conflict,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceOperationChannel` | 区分 command / query / consumer / job 的应用入口 | query 必须只读且不得进入 idempotency reservation;command / event / job 可进入幂等 |
| `GovernanceOperationName` | 幂等和 stored result 的 operation identity | 非空;取值必须与 Step 8 DTO / Step 9 flow 名称一致 |
| `GovernanceOperationIdempotencyKey` | application 归一化后的幂等 key | command 来源于 `CommandMetadata` idempotency key;event 来源于 event dedup key;job 来源于 `GovernanceJobIdempotencyKey`;query 不使用 |
| `GovernanceRequestDigest` | canonical payload digest | 只覆盖稳定业务输入;不得包含 request id、requested_at、trace id、随机 id 或当前时间 |
| `GovernanceApplicationResultId` | stored result identity | application id generator 生成;不得使用 truth id、trace id、job run id 替代 |
| `GovernanceApplicationResultRef` | duplicate replay 的 result 指针 | 必须能在 Step 13 继续闭合到 command result / consumer receipt / job report stored surface |
| `GovernanceIdempotencyConflictReason` | key 重用冲突说明 | 非空;不得携带 request body、event body 或外部正文 |
| `GovernanceIdempotencyState` | idempotency reservation state | `Completed` / `Conflict` 不得回到 `Reserved` |

##### `GovernanceApplicationFacade`

```rust
/// Groups application services for API, worker, job, and infra runtime assembly.
pub struct GovernanceApplicationFacade<C, D, A, P, L, N, Q, S, M, O, H, E> {
    /// Context and input command service.
    pub context_service: C,
    /// Gate and decision command service.
    pub decision_service: D,
    /// Approval and responsibility service.
    pub approval_service: A,
    /// Policy and shared rules service.
    pub policy_service: P,
    /// Control and compliance conclusion service.
    pub control_compliance_service: L,
    /// Nonconformity corrective loop service.
    pub nonconformity_service: N,
    /// Authorized query service.
    pub query_service: Q,
    /// Inbound consumer orchestration service.
    pub consumer_service: S,
    /// Derived maintenance and reconciliation service.
    pub maintenance_service: M,
    /// Outbox publication service.
    pub outbox_service: O,
    /// Trace and archive handoff service.
    pub handoff_service: H,
    /// External GRC export preparation service.
    pub external_grc_service: E,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_service` | `C` | context / input command 编排 | runtime builder 注入;不保存 infra concrete adapter |
| `decision_service` | `D` | gate / decision command 编排 | runtime builder 注入;不得绕过 `DecisionPolicy` |
| `approval_service` | `A` | approval / vote / delegation 编排 | runtime builder 注入;不得修改 identity truth |
| `policy_service` | `P` | policy fact / shared rules / conflict 编排 | runtime builder 注入;不保存 method body |
| `control_compliance_service` | `L` | control、AIIA、SoA 编排 | runtime builder 注入;不保存 artifact body |
| `nonconformity_service` | `N` | nonconformity corrective loop 编排 | runtime builder 注入;不得把 Work truth 当 corrective truth |
| `query_service` | `Q` | authorized query 只读编排 | runtime builder 注入;query no-write |
| `consumer_service` | `S` | inbound event dedup / snapshot / stale marker 编排 | runtime builder 注入;不得创建 core truth |
| `maintenance_service` | `M` | rebuild / refresh / reconciliation 编排 | runtime builder 注入;不修复 business truth |
| `outbox_service` | `O` | outbox publish / retry 编排 | runtime builder 注入;不直接投递未持久化 truth |
| `handoff_service` | `H` | trace / archive handoff 编排 | runtime builder 注入;只写 handoff marker / report |
| `external_grc_service` | `E` | external GRC export preparation | runtime builder 注入;不创建 external GRC truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(context_service: C, decision_service: D, approval_service: A, policy_service: P, control_compliance_service: L, nonconformity_service: N, query_service: Q, consumer_service: S, maintenance_service: M, outbox_service: O, handoff_service: H, external_grc_service: E) -> Self` | 组装 application service facade | runtime builder 已构造的 service objects | `GovernanceApplicationFacade<C, D, A, P, L, N, Q, S, M, O, H, E>` | infra runtime assembly、api / worker / jobs wiring |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| facade 不拥有依赖 trait | repository / port / UoW 字段留在具体 service 与 Step 7,facade 只聚合 service object |
| 不直接执行业务逻辑 | handler / runner 调用具体 service;facade 不跳过 application flow |
| 不进入 contracts | facade 是 application module object,不得出现在 public DTO |

##### `GovernanceOperationContext`

```rust
/// Carries validated application execution metadata for one operation.
pub struct GovernanceOperationContext {
    /// Entry channel for this operation.
    pub channel: GovernanceOperationChannel,
    /// Operation name used for idempotency and result replay.
    pub operation_name: GovernanceOperationName,
    /// Trusted actor context from the inbound boundary.
    pub actor: ActorContext,
    /// Core distributed trace id propagated through trace, outbox, and reports.
    pub core_trace_id: TraceId,
    /// Command metadata when the channel is command.
    pub command_metadata: Option<CommandMetadata>,
    /// Query metadata when the channel is query.
    pub query_metadata: Option<QueryMetadata>,
    /// Operations job run id when the channel is job.
    pub job_run_id: Option<GovernanceJobRunId>,
    /// Normalized idempotency key for write, event, or job channels.
    pub idempotency_key: Option<GovernanceOperationIdempotencyKey>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `channel` | `GovernanceOperationChannel` | 当前入口类型 | command / query / event / job flow 显式传入 |
| `operation_name` | `GovernanceOperationName` | operation identity | 与 Step 8 DTO / Step 9 flow 名称一致 |
| `actor` | `ActorContext` | 可信 actor 上下文 | API / worker / job runner 注入;application 不做登录认证 |
| `core_trace_id` | `TraceId` | trace / outbox / report 传播 | 来自 metadata / event envelope / job metadata;command 来源为 `CommandMetadata.request.trace_id` |
| `command_metadata` | `Option<CommandMetadata>` | command metadata | `channel == Command` 必须为 `Some`;其他 channel 必须为 `None` |
| `query_metadata` | `Option<QueryMetadata>` | query metadata | `channel == Query` 必须为 `Some`;query 不写 idempotency |
| `job_run_id` | `Option<GovernanceJobRunId>` | job run identity | `channel == OperationsJob` 必须为 `Some`;不得替代 result id |
| `idempotency_key` | `Option<GovernanceOperationIdempotencyKey>` | 幂等保护 key | command / event / job 必须为 `Some`;query 必须为 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断该 operation 是否必须 reserve idempotency | 无 | `bool` | command / inbound event / operations job 返回 true;query 返回 false |
| `pub fn assert_query_no_write(&self) -> Result<(), ApplicationError>` | 校验 query 只读上下文 | 无 | `Result<(), ApplicationError>` | query 有 idempotency key、job run 或 command metadata 时返回 error;不写状态 |
| `pub fn assert_write_metadata_complete(&self) -> Result<(), ApplicationError>` | 校验 write/event/job metadata 闭合 | 无 | `Result<(), ApplicationError>` | command / event / job 缺 actor、trace 或 idempotency 时返回 error |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_command(operation_name: GovernanceOperationName, actor: ActorContext, metadata: CommandMetadata, core_trace_id: TraceId, idempotency_key: GovernanceOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 command operation context | operation、actor、command metadata、core trace id、key | `Result<GovernanceOperationContext, ApplicationError>` | command service 入站校验后;`core_trace_id` 必须等于 `metadata.request.trace_id` |
| `pub fn from_query(operation_name: GovernanceOperationName, actor: ActorContext, metadata: QueryMetadata, core_trace_id: TraceId) -> Result<Self, ApplicationError>` | 构造 query operation context | operation、actor、query metadata、core trace id | `Result<GovernanceOperationContext, ApplicationError>` | authorized query service;`core_trace_id` 必须等于 `metadata.request.trace_id` |
| `pub fn from_job(operation_name: GovernanceOperationName, actor: ActorContext, run_id: GovernanceJobRunId, core_trace_id: TraceId, idempotency_key: GovernanceOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 job operation context | operation、operator/system actor、run id、core trace id、key | `Result<GovernanceOperationContext, ApplicationError>` | operations job runner |

##### `GovernanceIdempotencyRecord`

```rust
/// Stores technical idempotency reservation state for an application operation.
pub struct GovernanceIdempotencyRecord {
    /// Idempotency key reserved for the operation.
    pub idempotency_key: GovernanceOperationIdempotencyKey,
    /// Entry channel protected by this record.
    pub channel: GovernanceOperationChannel,
    /// Operation name protected by this record.
    pub operation_name: GovernanceOperationName,
    /// Canonical stable input digest.
    pub request_digest: GovernanceRequestDigest,
    /// Stored result ref once completed.
    pub result_ref: Option<GovernanceApplicationResultRef>,
    /// Current reservation state.
    pub state: GovernanceIdempotencyState,
    /// Conflict reason when key reuse is detected.
    pub conflict_reason: Option<GovernanceIdempotencyConflictReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `idempotency_key` | `GovernanceOperationIdempotencyKey` | reserved key | 从 `GovernanceOperationContext.idempotency_key` 复制;非空 |
| `channel` | `GovernanceOperationChannel` | protected entry channel | query 不得创建 record |
| `operation_name` | `GovernanceOperationName` | protected operation | 与 result ref operation 必须一致 |
| `request_digest` | `GovernanceRequestDigest` | stable input digest | application canonical digest calculator 生成;Step 13 定义算法 |
| `result_ref` | `Option<GovernanceApplicationResultRef>` | completed result pointer | `Completed` 必须为 `Some`;`Reserved` / `Conflict` 必须为 `None` |
| `state` | `GovernanceIdempotencyState` | reservation state | 只允许 `Reserved -> Completed` 或 `Reserved -> Conflict` |
| `conflict_reason` | `Option<GovernanceIdempotencyConflictReason>` | key conflict reason | `Conflict` 必须为 `Some`;不得保存 payload body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches(&self, channel: &GovernanceOperationChannel, operation_name: &GovernanceOperationName, request_digest: &GovernanceRequestDigest) -> bool` | 判断 duplicate 是否同一请求 | channel、operation、digest | `bool` | 纯判断;不读取 stored result |
| `pub fn complete(&mut self, result_ref: GovernanceApplicationResultRef) -> Result<(), ApplicationError>` | 完成 reservation | stored result ref | `Result<(), ApplicationError>` | 只允许 `Reserved -> Completed`;要求 result operation 匹配 |
| `pub fn mark_conflict(&mut self, reason: GovernanceIdempotencyConflictReason) -> Result<(), ApplicationError>` | 标记 key 重用冲突 | conflict reason | `Result<(), ApplicationError>` | 只允许 `Reserved -> Conflict`;清空 result ref |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(context: &GovernanceOperationContext, request_digest: GovernanceRequestDigest) -> Result<Self, ApplicationError>` | 从 operation context 建立 idempotency reservation | validated context、stable digest | `Result<GovernanceIdempotencyRecord, ApplicationError>` | IdempotencyRepository 新 key reserve path |

##### `StoredGovernanceOperationResult`

```rust
/// Classifies the stored surface reachable from an application result ref.
pub enum GovernanceStoredResultKind {
    /// Stored command result DTO surface.
    CommandResult,
    /// Stored inbound consumer receipt surface.
    ConsumerReceipt,
    /// Stored operations job report surface.
    JobReport,
}

/// Points to the serialized result surface without duplicating the DTO schema here.
pub struct GovernanceStoredResultSurfaceRef(pub ExternalSourceRef);

/// Metadata shell for a stored Governance result surface.
pub struct StoredGovernanceOperationResult {
    /// Stable application result ref.
    pub result_ref: GovernanceApplicationResultRef,
    /// Stored result category.
    pub result_kind: GovernanceStoredResultKind,
    /// Stored public result surface reference.
    pub surface_ref: GovernanceStoredResultSurfaceRef,
    /// Core distributed trace id captured when the result was produced.
    pub core_trace_id: TraceId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `result_ref` | `GovernanceApplicationResultRef` | result identity | application id generator + operation name;duplicate replay 使用同一 ref |
| `result_kind` | `GovernanceStoredResultKind` | result surface 分类 | command / consumer / job 三类;query 不存 result |
| `surface_ref` | `GovernanceStoredResultSurfaceRef` | serialized result surface ref | 指向 result store 中的 DTO surface;完整 DTO schema 留给 Step 8 / 13 |
| `core_trace_id` | `TraceId` | result trace 关联 | 来自 `GovernanceOperationContext.core_trace_id`;不得重新生成 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_ref(&self, result_ref: &GovernanceApplicationResultRef) -> bool` | 判断是否为指定 stored result | result ref | `bool` | 纯判断;不读取 result body |
| `pub fn is_job_report(&self) -> bool` | 判断是否为 job report surface | 无 | `bool` | `result_kind == JobReport` 返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_surface(result_ref: GovernanceApplicationResultRef, result_kind: GovernanceStoredResultKind, surface_ref: GovernanceStoredResultSurfaceRef, core_trace_id: TraceId) -> Result<Self, ApplicationError>` | 建立 stored result shell | result ref、kind、surface ref、core trace id | `Result<StoredGovernanceOperationResult, ApplicationError>` | command accepted result、consumer receipt、job report save path |

##### `GovernanceReadVisibilityDecision`

```rust
/// Application-local visibility decision produced for a read subject.
pub struct GovernanceReadVisibilityDecision {
    /// Read subject evaluated by the query service.
    pub read_subject_ref: GovernanceReadSubjectRef,
    /// Actor that requested the read.
    pub actor_ref: ActorRef,
    /// Visibility marker returned to the public query surface.
    pub visibility: GovernanceVisibilityMarker,
    /// Optional degraded marker discovered while assembling the response.
    pub degraded: Option<GovernanceDegradedMarker>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `read_subject_ref` | `GovernanceReadSubjectRef` | 被评估读取对象 | query request / view ref / truth ref 映射;不保存正文 |
| `actor_ref` | `ActorRef` | 读取 actor | 从 `ActorContext` 派生;不保存 actor profile |
| `visibility` | `GovernanceVisibilityMarker` | public not-visible / visible marker | 来自 `ReadVisibilityPolicy.evaluate_*`;denied 不映射为普通 error |
| `degraded` | `Option<GovernanceDegradedMarker>` | degraded response marker | 来源于 stale / unavailable projection、reference、trace;不触发修复 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_visible(&self) -> bool` | 判断 view body 是否可返回 | 无 | `bool` | 读取 marker;不执行授权 |
| `pub fn response_surface(&self, freshness: Option<GovernanceFreshnessMarker>) -> GovernanceViewSurface` | 组装 public view surface | optional freshness marker | `GovernanceViewSurface` | 纯组装;不写 projection / reference |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_marker(read_subject_ref: GovernanceReadSubjectRef, actor_ref: ActorRef, visibility: GovernanceVisibilityMarker, degraded: Option<GovernanceDegradedMarker>) -> Result<Self, ApplicationError>` | 从 domain visibility marker 构造 application decision | read subject、actor、visibility、optional degraded | `Result<GovernanceReadVisibilityDecision, ApplicationError>` | AuthorizedGovernanceQueryService response assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| application helper 不反写真相 | 本节所有对象不得创建、修改或删除 Governance domain truth |
| duplicate replay 不重跑 domain transition | `GovernanceApplicationResultRef` duplicate path 必须读取 stored surface;不得重新执行 command / job |
| query no-write | `GovernanceOperationContext::Query` 与 `GovernanceReadVisibilityDecision` 不得 reserve idempotency、append trace、mark stale 或 rebuild |
| stored result shell 不等于读取闭环 | 本节只给 result shell;Step 7/13 必须继续定义 save / get repository 和 missing result error |
| no body leak | digest、conflict reason、surface ref、visibility reason 不得保存 command body、event body、artifact body、work / process / method / runtime body |
| service facade 不隐藏 port | 具体 repository / port trait 仍必须在 Step 7 暴露,不得通过 facade 字段绕过正式 port contract |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 新增 `GovernanceOperationChannel` | command / query / event / job 的 idempotency、read-only 和 result surface 规则不同,需要可落码分支 |
| 新增 `GovernanceApplicationResultRef` / `StoredGovernanceOperationResult` shell | duplicate replay 不能只保存 key;必须至少有 result ref 和 stored surface 归属 |
| `GovernanceOperationContext` 显式区分 command / query / job metadata | query 不允许携带 write idempotency;job run id 不得替代 result id |
| `GovernanceReadVisibilityDecision` 用 marker 而非 `Result<()>` | query denied 必须返回 not-visible surface,不能丢失 visibility marker |
| repository / port 签名未在本节展开 | Step 6 只定义 object;Step 7 / 11 / 13 收口 trait、persistence、transaction 和 duplicate read path |

#### 15.8 `GovernanceJobReportAssembly`

`GovernanceJobReportAssembly` 是 `application` 层的 operations job report accumulator。它把 outbox publish、projection rebuild、reference refresh、reconciliation、trace handoff、archive handoff 和 external GRC export 的结果统一聚合成 §10.17 已定义的 `GovernanceJobReport`。它不运行 job、不读取 repository、不保存 report,也不替代 Step 7/13 必须定义的 stored job report result surface。

```rust
/// Collects operations job refs before producing a GovernanceJobReport.
pub struct GovernanceJobReportAssembly {
    /// Job run id from the operation context.
    pub run_id: GovernanceJobRunId,
    /// Job idempotency key used for duplicate replay.
    pub idempotency_key: GovernanceJobIdempotencyKey,
    /// Operation name for the job flow.
    pub operation_name: GovernanceOperationName,
    /// Outbox records scanned or changed by an outbox job.
    pub outbox_refs: GovernanceOutboxRefSet,
    /// Derived views rebuilt, marked stale, or inspected by maintenance jobs.
    pub view_refs: DerivedGovernanceViewRefSet,
    /// Reports produced by reconciliation, rebuild, archive, or export jobs.
    pub report_refs: GovernanceReportRefSet,
    /// Handoff or export markers produced by handoff/export jobs.
    pub handoff_marker_refs: GovernanceHandoffMarkerRefSet,
    /// External references successfully refreshed or inspected.
    pub refreshed_reference_refs: ExternalGovernanceReferenceRefSet,
    /// External references or reference-like inputs that failed.
    pub failed_reference_refs: ExternalGovernanceReferenceRefSet,
    /// Number of items scanned by the job.
    pub scanned_count: u64,
    /// Number of items changed or produced by the job.
    pub changed_count: u64,
    /// Number of items that failed without rolling back accepted work.
    pub failed_count: u64,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `run_id` | `GovernanceJobRunId` | job run identity | 来自 `GovernanceOperationContext.job_run_id`;非空 |
| `idempotency_key` | `GovernanceJobIdempotencyKey` | duplicate replay key | 来自 job metadata;必须与 stored result reservation 同源 |
| `operation_name` | `GovernanceOperationName` | job operation identity | 必须是 Step 8/9 中正式 job 名称之一 |
| `outbox_refs` | `GovernanceOutboxRefSet` | outbox publish / retry 处理对象 | 来源于 outbox service scan / marker;只保存 ref |
| `view_refs` | `DerivedGovernanceViewRefSet` | rebuild / stale / reconciliation 涉及视图 | 来源于 projection service;不得临时拼 view id |
| `report_refs` | `GovernanceReportRefSet` | job 产生的 report refs | reconciliation / archive / export report save 后传入;不保存 report body |
| `handoff_marker_refs` | `GovernanceHandoffMarkerRefSet` | handoff / export marker refs | handoff/export marker save 后传入 |
| `refreshed_reference_refs` | `ExternalGovernanceReferenceRefSet` | 成功 refresh / inspect 的外部引用 | refresh service / resolver 成功后传入;不保存外部正文 |
| `failed_reference_refs` | `ExternalGovernanceReferenceRefSet` | 失败引用集合 | adapter / resolver / validation failure 映射为 body-free ref |
| `scanned_count` | `u64` | 扫描数量 | service 逐批累计;不能由 ref set 长度隐式推导 |
| `changed_count` | `u64` | 成功改变 / 产出数量 | publish success、view replace、snapshot refresh、report/marker produced 后累计 |
| `failed_count` | `u64` | 失败数量 | 单项失败累计;job fatal failure 至少为 1 或由 Step 8 report detail 定义 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_outbox(&mut self, outbox_refs: GovernanceOutboxRefSet, scanned_count: u64, changed_count: u64, failed_count: u64) -> Result<(), ApplicationError>` | 记录 outbox publish / retry 结果 | outbox refs、counters | `Result<(), ApplicationError>` | 累加 refs 与 counters;不调用 publisher |
| `pub fn record_views(&mut self, view_refs: DerivedGovernanceViewRefSet, changed_count: u64) -> Result<(), ApplicationError>` | 记录 projection rebuild / stale 视图 | view refs、changed count | `Result<(), ApplicationError>` | 累加 view refs;不写 projection store |
| `pub fn record_references(&mut self, refreshed_refs: ExternalGovernanceReferenceRefSet, failed_refs: ExternalGovernanceReferenceRefSet) -> Result<(), ApplicationError>` | 记录 external reference refresh 结果 | refreshed refs、failed refs | `Result<(), ApplicationError>` | 成功/失败 refs 分开累计;不读取 external body |
| `pub fn record_report(&mut self, report_ref: GovernanceReportRef) -> Result<(), ApplicationError>` | 记录生成的 report ref | report ref | `Result<(), ApplicationError>` | 追加到 `report_refs`;不保存 report body |
| `pub fn record_handoff_marker(&mut self, marker_ref: GovernanceHandoffMarkerRef) -> Result<(), ApplicationError>` | 记录 handoff / export marker | marker ref | `Result<(), ApplicationError>` | 追加 marker ref;不调用 handoff port |
| `pub fn finish(self, report_state: GovernanceJobReportState) -> Result<GovernanceJobReport, ApplicationError>` | 生成 public job report | final report state | `Result<GovernanceJobReport, ApplicationError>` | 只组装 `GovernanceJobReport`;不保存 stored result |
| `pub fn finish_from_counts(self) -> Result<GovernanceJobReport, ApplicationError>` | 按 counters 推导 completed / partial / failed report | 无 | `Result<GovernanceJobReport, ApplicationError>` | `failed_count == 0 -> Completed`;`changed_count > 0 && failed_count > 0 -> PartiallyCompleted`;否则 `Failed` |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(context: &GovernanceOperationContext, idempotency_key: GovernanceJobIdempotencyKey) -> Result<Self, ApplicationError>` | 从 job operation context 建立 report accumulator | validated job context、job idempotency key | `Result<GovernanceJobReportAssembly, ApplicationError>` | `PublishGovernanceOutbox`、`RebuildGovernanceProjections`、`RefreshExternalContextSnapshots`、`RunGovernanceReconciliation`、handoff / export jobs |
| `pub fn replayed(stored_result: &StoredGovernanceOperationResult) -> Result<GovernanceApplicationResultRef, ApplicationError>` | 为 duplicate job replay 验证 stored job report surface | stored result shell | `Result<GovernanceApplicationResultRef, ApplicationError>` | duplicate path;要求 `stored_result.result_kind == JobReport` |

| job flow | 必须记录的 assembly refs / counters | 禁止事项 |
|---|---|---|
| `PublishGovernanceOutbox` | `outbox_refs`、`scanned_count`、`changed_count`、`failed_count` | 不按 current truth 重构 payload;不回滚 accepted truth |
| `RebuildGovernanceProjections` | `view_refs`、`changed_count`、optional `report_refs` | 不把 projection 结果反写为 truth |
| `RefreshExternalContextSnapshots` | `refreshed_reference_refs`、`failed_reference_refs`、counters | 不保存 identity / method / artifact / process / work / runtime body |
| `RunGovernanceReconciliation` | `report_refs`、`view_refs`、optional failed refs | 不直接修复 drift |
| `PrepareGovernanceTraceHandoff` | `handoff_marker_refs`、`report_refs`、failed refs | 不保存 observability ledger body |
| `PrepareGovernanceArchiveHandoff` | `handoff_marker_refs`、`report_refs`、failed refs | 不保存 archive package body |
| `PrepareExternalGrcExport` | `handoff_marker_refs` 或 export marker refs、`report_refs`、failed refs | 不创建 external GRC truth |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| accumulator 不是 repository | save / get / optimistic version / transaction order 留给 Step 7/11/13 |
| duplicate replay 必须读 stored surface | `replayed(...)` 只验证 shell;真实 `JobResultRepository.get_report(...)` 必须在 Step 13 闭合 |
| failed refs body-free | 失败项只能是 external reference / marker / report ref,不得保存 adapter response body |
| counters 不替代 refs | counters 用于 report state 与运营摘要;refs 仍需保存以支持审查 |
| partial success 不回滚已成功项 | 单项失败只进入 failed refs / failed_count,不得回滚已发布 outbox、已重建 view 或已保存 marker |
| job report 不修复 truth | `finish(...)` 只返回 `GovernanceJobReport`,不得调用 domain transition、repository save 或 publisher |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 accumulator object | HLD 只写“Job report”;实现需要统一 assembly surface 防止每个 job 自造 report shape |
| `finish_from_counts()` 明确状态推导 | 防止实现侧自行决定 partial / failed 条件 |
| duplicate replay 返回 `GovernanceApplicationResultRef` | stored report 读取链路在 Step 13 闭合;Step 6 不提前定义 repository trait |
| failed handoff / export 进入 failed refs | 当前 `GovernanceJobReport` 只有 failed reference set;若 Step 8 扩展 report item type,必须保持 body-free |

### 16. `infra` / `api` / `worker` / `jobs` object 契约

本节定义运行承载、adapter state 和入口对象。`infra` 可以依赖 `application` port trait 并实现 repository / adapter,但本 Step 只定义 infra object 的字段、状态和不变量;trait 函数签名留给 Step 7,持久化和事务留给 Step 11,配置 key / env var / 默认值留给 Step 14 与 `04-配置说明`。`api` / `worker` / `jobs` entry object 后续分批写入。

#### 16.1 `infra` runtime config / builder / adapter availability object contracts

本批闭合 runtime config、runtime builder state 和 adapter availability marker。它们只表达“哪些已校验 config ref、store ref、adapter ref 被装配”,不表达产品参数、密钥、URL、topic、retry 数字、cron 或具体 DB / queue / cache / object store。配置不得改变 domain invariant、状态机、truth 归属、visibility、idempotency 或同一提交边界。

##### infra-local runtime refs and states

```rust
/// References one validated Governance infra configuration document.
pub struct GovernanceInfraConfigRef(pub String);

/// References a runtime profile selected by deployment.
pub struct GovernanceRuntimeProfileRef(pub String);

/// References a configured store adapter without exposing product details.
pub struct GovernanceStoreConfigRef(pub String);

/// References a configured external or internal adapter.
pub struct GovernanceAdapterConfigRef(pub String);

/// Ordered unique adapter config refs.
pub struct GovernanceAdapterConfigRefSet(pub Vec<GovernanceAdapterConfigRef>);

/// Ordered unique handoff / export target refs from validated config.
pub struct TraceHandoffTargetRefSet(pub Vec<TraceHandoffTargetRef>);

/// References a redacted config validation issue.
pub struct GovernanceConfigValidationIssueRef(pub String);

/// Ordered unique config validation issue refs.
pub struct GovernanceConfigValidationIssueRefSet(pub Vec<GovernanceConfigValidationIssueRef>);

/// Runtime adapter slot owned by infra.
pub enum GovernanceInfraAdapterSlot {
    /// Truth repository implementation slot.
    TruthRepository,
    /// Projection and read model store slot.
    ProjectionStore,
    /// External reference and snapshot store slot.
    ReferenceStore,
    /// Governance outbox store slot.
    OutboxStore,
    /// Idempotency and stored result store slot.
    IdempotencyStore,
    /// External source resolver slot.
    SourceResolver,
    /// Outbound event publisher slot.
    EventPublisher,
    /// Observability or archive handoff adapter slot.
    HandoffAdapter,
    /// External GRC export adapter slot.
    ExternalGrcAdapter,
    /// Clock adapter slot.
    ClockAdapter,
    /// Id generator adapter slot.
    IdGeneratorAdapter,
}

/// Current runtime availability of one adapter slot.
pub enum GovernanceAdapterAvailabilityState {
    /// Adapter is configured and can be used.
    Enabled,
    /// Adapter is intentionally disabled by validated config.
    DisabledByConfig,
    /// Adapter can be used but responses must be surfaced as degraded when relevant.
    Degraded,
    /// Adapter is configured but currently unavailable.
    Unavailable,
}

/// Runtime builder lifecycle state.
pub enum GovernanceRuntimeBuildState {
    /// Builder has not started validation.
    NotStarted,
    /// Builder is validating config refs and adapter slots.
    ValidatingConfig,
    /// Builder is assembling stores, adapters, and services.
    Assembling,
    /// Runtime has been assembled successfully.
    Ready,
    /// Runtime assembly failed before a usable facade was produced.
    Failed,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceInfraConfigRef` | 已校验 infra config identity | runtime loader 生成或配置仓引用;不得包含 config body |
| `GovernanceRuntimeProfileRef` | deployment profile identity | profile 名称 / ref;不得携带 secrets |
| `GovernanceStoreConfigRef` | store adapter config identity | truth / projection / reference / outbox / idempotency store 选择 |
| `GovernanceAdapterConfigRef` | resolver / publisher / handoff / GRC / clock adapter config identity | 只保存 ref;不保存 URL、token、topic |
| `GovernanceAdapterConfigRefSet` | adapter refs 集合 | ordered unique;用于 resolver / publisher / external GRC / clock / id generator adapter |
| `TraceHandoffTargetRefSet` | handoff / export target refs 集合 | ordered unique;来自 `handoff.traceTargets[]`、`handoff.archiveTargets[]` 或 `externalGrc.targetRef`;不得当作 adapter config refs |
| `GovernanceConfigValidationIssueRef` | redacted config validation issue | 不保存 secret、raw config 或产品错误 body |
| `GovernanceInfraAdapterSlot` | infra slot 分类 | 只表达本仓 runtime 装配槽位;不作为业务 routing |
| `GovernanceAdapterAvailabilityState` | adapter 可用性 | 只影响 startup / degraded / delayed / disabled surface,不得改变 domain invariant |
| `GovernanceRuntimeBuildState` | runtime builder 生命周期 | `Ready` 之前不得暴露 usable facade;`Failed` 不得 fallback 到半装配 runtime |

##### `GovernanceRuntimeConfig`

```rust
/// Body-free validated runtime configuration selected for infra assembly.
pub struct GovernanceRuntimeConfig {
    /// Runtime profile selected by deployment.
    pub profile_ref: GovernanceRuntimeProfileRef,
    /// Validated infra config ref.
    pub config_ref: GovernanceInfraConfigRef,
    /// Truth repository store config.
    pub truth_store_ref: GovernanceStoreConfigRef,
    /// Projection store config.
    pub projection_store_ref: GovernanceStoreConfigRef,
    /// External reference store config.
    pub reference_store_ref: GovernanceStoreConfigRef,
    /// Outbox store config.
    pub outbox_store_ref: GovernanceStoreConfigRef,
    /// Idempotency and stored result store config.
    pub idempotency_store_ref: GovernanceStoreConfigRef,
    /// External source resolver adapter configs.
    pub source_resolver_refs: GovernanceAdapterConfigRefSet,
    /// Outbound event publisher adapter config.
    pub publisher_ref: GovernanceAdapterConfigRef,
    /// Trace handoff targets from validated config.
    pub trace_handoff_target_refs: TraceHandoffTargetRefSet,
    /// Archive handoff targets from validated config.
    pub archive_handoff_target_refs: TraceHandoffTargetRefSet,
    /// Optional external GRC export adapter config.
    pub external_grc_adapter_ref: Option<GovernanceAdapterConfigRef>,
    /// Optional external GRC export target.
    pub external_grc_target_ref: Option<TraceHandoffTargetRef>,
    /// Clock adapter config.
    pub clock_adapter_ref: GovernanceAdapterConfigRef,
    /// Id generator adapter config.
    pub id_generator_ref: GovernanceAdapterConfigRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `profile_ref` | `GovernanceRuntimeProfileRef` | 运行 profile | 部署选择;不得改变业务不变量 |
| `config_ref` | `GovernanceInfraConfigRef` | 已校验配置引用 | config loader / validator 输出 |
| `truth_store_ref` | `GovernanceStoreConfigRef` | truth repository 承载选择 | 只影响 adapter,不得改变 truth 成立边界 |
| `projection_store_ref` | `GovernanceStoreConfigRef` | projection / read model 承载 | 只影响 read model / rebuild |
| `reference_store_ref` | `GovernanceStoreConfigRef` | external snapshot / reference state 承载 | 不拥有外部 truth |
| `outbox_store_ref` | `GovernanceStoreConfigRef` | outbox record 承载 | publish failure 不回滚 truth |
| `idempotency_store_ref` | `GovernanceStoreConfigRef` | idempotency / stored result 承载 | 必须支持 duplicate result surface 读取闭环 |
| `source_resolver_refs` | `GovernanceAdapterConfigRefSet` | identity / method / process / work / artifact / runtime / conversation / observability resolver refs | 不保存 sibling body |
| `publisher_ref` | `GovernanceAdapterConfigRef` | outbound publisher config | 不保存 topic / credentials;Step 14 绑定 |
| `trace_handoff_target_refs` | `TraceHandoffTargetRefSet` | trace handoff 目标集合 | 直接来自 `handoff.traceTargets[]`;不保存 target secret、URL 或 package body |
| `archive_handoff_target_refs` | `TraceHandoffTargetRefSet` | archive handoff 目标集合 | 直接来自 `handoff.archiveTargets[]`;不保存 archive target secret 或 package body |
| `external_grc_adapter_ref` | `Option<GovernanceAdapterConfigRef>` | external GRC export adapter | `None` 表示 export disabled,不影响 core truth |
| `external_grc_target_ref` | `Option<TraceHandoffTargetRef>` | external GRC export target | 直接来自 `externalGrc.targetRef`;enabled 时必须存在;不得当作 adapter ref |
| `clock_adapter_ref` | `GovernanceAdapterConfigRef` | clock adapter | 直接来自 `clockId.clockAdapterRef`;不允许 domain 自行读 clock |
| `id_generator_ref` | `GovernanceAdapterConfigRef` | id generator adapter | 直接来自 `clockId.idGeneratorRef`;不允许 handler/domain 自行拼 id |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_invariant_safe(&self) -> Result<(), InfraError>` | 校验配置不会改变 domain invariant | 无 | `Result<(), InfraError>` | 不读取外部系统;只检查 ref presence / forbidden combination |
| `pub fn external_grc_enabled(&self) -> bool` | 判断 external GRC export 是否启用 | 无 | `bool` | `external_grc_adapter_ref.is_some() && external_grc_target_ref.is_some()`;不验证目标可用性 |
| `pub fn all_adapter_refs(&self) -> GovernanceAdapterConfigRefSet` | 汇总 adapter refs | 无 | `GovernanceAdapterConfigRefSet` | 纯组装;不展开 config body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_validated_refs(profile_ref: GovernanceRuntimeProfileRef, config_ref: GovernanceInfraConfigRef, truth_store_ref: GovernanceStoreConfigRef, projection_store_ref: GovernanceStoreConfigRef, reference_store_ref: GovernanceStoreConfigRef, outbox_store_ref: GovernanceStoreConfigRef, idempotency_store_ref: GovernanceStoreConfigRef, source_resolver_refs: GovernanceAdapterConfigRefSet, publisher_ref: GovernanceAdapterConfigRef, trace_handoff_target_refs: TraceHandoffTargetRefSet, archive_handoff_target_refs: TraceHandoffTargetRefSet, external_grc_adapter_ref: Option<GovernanceAdapterConfigRef>, external_grc_target_ref: Option<TraceHandoffTargetRef>, clock_adapter_ref: GovernanceAdapterConfigRef, id_generator_ref: GovernanceAdapterConfigRef) -> Result<Self, InfraError>` | 从已校验 config refs 构造 runtime config | validated refs;target refs 保留原配置来源 | `Result<GovernanceRuntimeConfig, InfraError>` | runtime builder 启动前 |

##### `GovernanceAdapterAvailabilityMarker`

```rust
/// Records startup or runtime availability for one infra adapter slot.
pub struct GovernanceAdapterAvailabilityMarker {
    /// Adapter slot being described.
    pub adapter_slot: GovernanceInfraAdapterSlot,
    /// Config ref for the concrete adapter.
    pub adapter_config_ref: GovernanceAdapterConfigRef,
    /// Current availability state.
    pub availability_state: GovernanceAdapterAvailabilityState,
    /// Redacted validation or availability issue when present.
    pub issue_ref: Option<GovernanceConfigValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `adapter_slot` | `GovernanceInfraAdapterSlot` | adapter 槽位 | 来自 runtime builder assembly plan |
| `adapter_config_ref` | `GovernanceAdapterConfigRef` | 具体 adapter config ref | 不保存 raw config |
| `availability_state` | `GovernanceAdapterAvailabilityState` | 可用性状态 | startup validation / health probe / adapter factory 结果 |
| `issue_ref` | `Option<GovernanceConfigValidationIssueRef>` | redacted issue | `Degraded` / `Unavailable` 通常必须存在;不得保存 secret |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_usable(&self) -> bool` | 判断 adapter 是否可被 runtime 注入 | 无 | `bool` | `Enabled` / `Degraded` 返回 true;不调用 adapter |
| `pub fn requires_degraded_surface(&self) -> bool` | 判断调用结果是否应暴露 degraded | 无 | `bool` | `Degraded` / `Unavailable` 返回 true |
| `pub fn mark_degraded(&mut self, issue_ref: GovernanceConfigValidationIssueRef) -> Result<(), InfraError>` | 标记 adapter 降级 | redacted issue ref | `Result<(), InfraError>` | 写 availability marker,不改 application service |
| `pub fn mark_unavailable(&mut self, issue_ref: GovernanceConfigValidationIssueRef) -> Result<(), InfraError>` | 标记 adapter 不可用 | redacted issue ref | `Result<(), InfraError>` | 写 availability marker,不改 domain truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn enabled(adapter_slot: GovernanceInfraAdapterSlot, adapter_config_ref: GovernanceAdapterConfigRef) -> Result<Self, InfraError>` | 建立可用 marker | slot、adapter config ref | `Result<GovernanceAdapterAvailabilityMarker, InfraError>` | adapter factory success |
| `pub fn disabled_by_config(adapter_slot: GovernanceInfraAdapterSlot, adapter_config_ref: GovernanceAdapterConfigRef, issue_ref: Option<GovernanceConfigValidationIssueRef>) -> Result<Self, InfraError>` | 建立禁用 marker | slot、adapter config ref、optional issue | `Result<GovernanceAdapterAvailabilityMarker, InfraError>` | optional external GRC / handoff adapter disabled |

##### `GovernanceRuntimeBuilderState`

```rust
/// Tracks infra runtime assembly before exposing application services.
pub struct GovernanceRuntimeBuilderState {
    /// Runtime profile being built.
    pub profile_ref: GovernanceRuntimeProfileRef,
    /// Config ref being validated.
    pub config_ref: GovernanceInfraConfigRef,
    /// Current builder lifecycle.
    pub build_state: GovernanceRuntimeBuildState,
    /// Adapter availability markers observed during assembly.
    pub adapter_markers: Vec<GovernanceAdapterAvailabilityMarker>,
    /// Redacted validation issues observed during assembly.
    pub issue_refs: GovernanceConfigValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `profile_ref` | `GovernanceRuntimeProfileRef` | runtime profile | 从 `GovernanceRuntimeConfig.profile_ref` 复制 |
| `config_ref` | `GovernanceInfraConfigRef` | config identity | 从 `GovernanceRuntimeConfig.config_ref` 复制 |
| `build_state` | `GovernanceRuntimeBuildState` | builder lifecycle | 只允许 `NotStarted -> ValidatingConfig -> Assembling -> Ready` 或 `Failed` |
| `adapter_markers` | `Vec<GovernanceAdapterAvailabilityMarker>` | adapter availability 集合 | 按 slot + config ref 去重;不保存 adapter instance |
| `issue_refs` | `GovernanceConfigValidationIssueRefSet` | validation issues | redacted;不保存 raw config / secret |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn start_validation(&mut self) -> Result<(), InfraError>` | 进入 config validation | 无 | `Result<(), InfraError>` | 允许 `NotStarted -> ValidatingConfig` |
| `pub fn start_assembly(&mut self) -> Result<(), InfraError>` | 进入 adapter assembly | 无 | `Result<(), InfraError>` | 允许 `ValidatingConfig -> Assembling`;必须无 blocking issue |
| `pub fn record_adapter(&mut self, marker: GovernanceAdapterAvailabilityMarker) -> Result<(), InfraError>` | 记录 adapter availability | adapter marker | `Result<(), InfraError>` | 不保存 adapter instance;slot + config ref 唯一 |
| `pub fn mark_ready(&mut self) -> Result<(), InfraError>` | 标记 runtime ready | 无 | `Result<(), InfraError>` | 允许 `Assembling -> Ready`;blocking slot 不可 unavailable |
| `pub fn mark_failed(&mut self, issue_ref: GovernanceConfigValidationIssueRef) -> Result<(), InfraError>` | 标记 runtime assembly failed | redacted issue ref | `Result<(), InfraError>` | 任意非 Ready 状态可进入 `Failed` |
| `pub fn can_expose_facade(&self) -> bool` | 判断是否可暴露 application facade | 无 | `bool` | 仅 `Ready` 返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_config(config: &GovernanceRuntimeConfig) -> Result<Self, InfraError>` | 从 runtime config 建立 builder state | validated runtime config | `Result<GovernanceRuntimeBuilderState, InfraError>` | runtime builder start |

##### `GovernanceInfraStoreRegistryState`

```rust
/// Records which store configs are registered for runtime assembly.
pub struct GovernanceInfraStoreRegistryState {
    /// Truth store config.
    pub truth_store_ref: GovernanceStoreConfigRef,
    /// Projection store config.
    pub projection_store_ref: GovernanceStoreConfigRef,
    /// Reference store config.
    pub reference_store_ref: GovernanceStoreConfigRef,
    /// Outbox store config.
    pub outbox_store_ref: GovernanceStoreConfigRef,
    /// Idempotency and stored result store config.
    pub idempotency_store_ref: GovernanceStoreConfigRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `truth_store_ref` | `GovernanceStoreConfigRef` | truth repository store | 只标识 adapter config;不保存 truth body |
| `projection_store_ref` | `GovernanceStoreConfigRef` | view / report store | 只标识 adapter config;不保存 view body |
| `reference_store_ref` | `GovernanceStoreConfigRef` | external reference state store | 不保存 external body |
| `outbox_store_ref` | `GovernanceStoreConfigRef` | outbox record store | 不发布 event |
| `idempotency_store_ref` | `GovernanceStoreConfigRef` | idempotency / stored result store | 必须与 duplicate replay surface 同源 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_runtime_config(config: &GovernanceRuntimeConfig) -> Result<Self, InfraError>` | 从 runtime config 提取 store registry | runtime config | `Result<GovernanceInfraStoreRegistryState, InfraError>` | 纯组装;不创建 store instance |
| `pub fn assert_store_refs_distinct_when_required(&self) -> Result<(), InfraError>` | 校验 store ref 组合不违反边界 | 无 | `Result<(), InfraError>` | 可允许同一 durable backend,但不得把 outbox / idempotency 混成无法区分的 logical store |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| config 不改变业务规则 | runtime config 不得改变 Decision、Policy、Control、Nonconformity 状态机或 guard |
| raw config 不进对象 | 本批对象只保存 ref、slot、state、issue ref,不得保存 secret、URL、topic、cron、retry 数字 |
| adapter availability 不反写真相 | degraded / unavailable 只能影响 startup、delayed、degraded surface 或 job report,不得改 core truth |
| builder Ready 前不可暴露 facade | 半装配 runtime 不得让 API / worker / jobs 接收请求 |
| store registry 不替代 port trait | 具体 repository / store trait 和 constructor 签名留给 Step 7 / Step 11 |
| external GRC disabled 不影响 truth | `external_grc_adapter_ref = None` 只关闭 export,不得阻止 command accepted path |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 body-free config refs | HLD 不展开 config key / env / product params;实现仍需要稳定字段承载已校验 config identity |
| 增加 adapter slot / availability marker | HLD 要求 adapter disabled / degraded / unavailable 可审计,不能只在日志里表达 |
| runtime builder state 不保存 adapter instance | Step 6 定义对象契约,不固定具体 DI 容器或 constructor |
| store registry 只保存 logical store refs | 防止实现侧把具体 DB / cache / queue 产品参数固化进详细设计 |

#### 16.2 `infra` store / publisher / resolver / handoff adapter state object contracts

本节闭合 infra adapter state,用于 fake / durable adapter 的可落码状态载体。它们实现 application port 的背后承载,但不定义 port trait 签名。所有 state object 只能保存 refs、cursor、availability marker 和 redacted issue refs,不得保存外部正文、adapter response body、secret、URL、topic 或产品专有参数。

##### infra adapter state shared helpers

```rust
/// References an infra adapter state record.
pub struct GovernanceInfraAdapterStateRef(pub String);

/// References a redacted adapter failure record.
pub struct GovernanceAdapterFailureRef(pub String);

/// Ordered unique redacted adapter failure refs.
pub struct GovernanceAdapterFailureRefSet(pub Vec<GovernanceAdapterFailureRef>);

/// Groups source resolver families without importing sibling repos.
pub enum GovernanceSourceResolverFamily {
    /// Identity, actor, role, and capability resolver family.
    Identity,
    /// Method policy and control definition resolver family.
    Method,
    /// Process context resolver family.
    Process,
    /// Work context resolver family.
    Work,
    /// Artifact and evidence resolver family.
    Artifact,
    /// Runtime and capability signal resolver family.
    Runtime,
    /// Conversation context resolver family.
    Conversation,
    /// Observability signal resolver family.
    Observability,
}

/// Classifies an infra store state without binding a concrete product.
pub enum GovernanceInfraStoreKind {
    /// Truth repository store.
    Truth,
    /// Projection and read model store.
    Projection,
    /// External reference and snapshot store.
    Reference,
    /// Outbox store.
    Outbox,
    /// Idempotency and stored result store.
    Idempotency,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceInfraAdapterStateRef` | adapter state identity | infra factory / test fake 生成;不进入 public DTO |
| `GovernanceAdapterFailureRef` | redacted adapter failure identity | adapter error mapping 生成;不保存 raw response / stack trace |
| `GovernanceAdapterFailureRefSet` | adapter failure refs 集合 | ordered unique;用于 operations report / degraded marker |
| `GovernanceSourceResolverFamily` | resolver family 分类 | 只表达 sibling boundary;不引入 sibling crate |
| `GovernanceInfraStoreKind` | logical store 分类 | 不绑定 DB / cache / queue / search 产品 |

##### `GovernanceInfraStoreState`

```rust
/// Tracks logical infra store state for fake and durable adapters.
pub struct GovernanceInfraStoreState {
    /// Stable infra adapter state ref.
    pub state_ref: GovernanceInfraAdapterStateRef,
    /// Logical store kind.
    pub store_kind: GovernanceInfraStoreKind,
    /// Store config ref selected by runtime config.
    pub store_config_ref: GovernanceStoreConfigRef,
    /// Availability marker for this store.
    pub availability: GovernanceAdapterAvailabilityMarker,
    /// Last committed Governance truth cursor observed by this store.
    pub last_truth_cursor: Option<GovernanceTruthCursor>,
    /// Last redacted failures emitted by this store.
    pub failure_refs: GovernanceAdapterFailureRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_ref` | `GovernanceInfraAdapterStateRef` | store state identity | infra factory / fake runtime 生成 |
| `store_kind` | `GovernanceInfraStoreKind` | logical store 分类 | truth / projection / reference / outbox / idempotency |
| `store_config_ref` | `GovernanceStoreConfigRef` | store config identity | 从 `GovernanceRuntimeConfig` 或 registry 复制 |
| `availability` | `GovernanceAdapterAvailabilityMarker` | store 可用性 | slot 必须与 store kind 匹配 |
| `last_truth_cursor` | `Option<GovernanceTruthCursor>` | store 已观察 cursor | store load / save / rebuild 后更新;不得作为 optimistic version |
| `failure_refs` | `GovernanceAdapterFailureRefSet` | redacted store failures | 不保存 SQL、HTTP、stack trace 或 raw error body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_cursor(&mut self, cursor: GovernanceTruthCursor) -> Result<(), InfraError>` | 记录 store 已追踪 cursor | truth cursor | `Result<(), InfraError>` | 只更新 marker;不保存 truth body |
| `pub fn record_failure(&mut self, failure_ref: GovernanceAdapterFailureRef) -> Result<(), InfraError>` | 记录 redacted failure | failure ref | `Result<(), InfraError>` | 追加 failure ref;不改变 domain truth |
| `pub fn is_usable(&self) -> bool` | 判断 store 是否可注入 | 无 | `bool` | 委托 availability marker;不探测 store |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_registry(state_ref: GovernanceInfraAdapterStateRef, store_kind: GovernanceInfraStoreKind, store_config_ref: GovernanceStoreConfigRef, availability: GovernanceAdapterAvailabilityMarker) -> Result<Self, InfraError>` | 从 store registry 建立 store state | state ref、kind、config ref、availability | `Result<GovernanceInfraStoreState, InfraError>` | runtime builder store assembly |

##### `GovernanceSourceResolverAdapterState`

```rust
/// Tracks resolver adapter state without storing sibling domain bodies.
pub struct GovernanceSourceResolverAdapterState {
    /// Stable infra adapter state ref.
    pub state_ref: GovernanceInfraAdapterStateRef,
    /// Resolver family represented by this adapter.
    pub resolver_family: GovernanceSourceResolverFamily,
    /// Config ref for this resolver adapter.
    pub adapter_config_ref: GovernanceAdapterConfigRef,
    /// Availability marker for this resolver.
    pub availability: GovernanceAdapterAvailabilityMarker,
    /// References successfully resolved by this adapter.
    pub resolved_reference_refs: ExternalGovernanceReferenceRefSet,
    /// References that failed resolution.
    pub failed_reference_refs: ExternalGovernanceReferenceRefSet,
    /// Redacted adapter failures.
    pub failure_refs: GovernanceAdapterFailureRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_ref` | `GovernanceInfraAdapterStateRef` | resolver state identity | infra factory / fake runtime 生成 |
| `resolver_family` | `GovernanceSourceResolverFamily` | resolver family | identity / method / process / work / artifact / runtime / conversation / observability |
| `adapter_config_ref` | `GovernanceAdapterConfigRef` | resolver config ref | 不保存 endpoint / credential |
| `availability` | `GovernanceAdapterAvailabilityMarker` | resolver 可用性 | degraded / unavailable 必须能映射 query / job degraded surface |
| `resolved_reference_refs` | `ExternalGovernanceReferenceRefSet` | 成功解析引用 | 只保存 external reference refs;不保存 body |
| `failed_reference_refs` | `ExternalGovernanceReferenceRefSet` | 失败引用 | 进入 refresh job report / degraded marker |
| `failure_refs` | `GovernanceAdapterFailureRefSet` | redacted failures | 不保存 sibling error body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_resolved(&mut self, reference_ref: ExternalGovernanceReferenceRef) -> Result<(), InfraError>` | 记录解析成功 | external reference ref | `Result<(), InfraError>` | 不保存 resolved body;去重追加 |
| `pub fn record_unresolved(&mut self, reference_ref: ExternalGovernanceReferenceRef, failure_ref: GovernanceAdapterFailureRef) -> Result<(), InfraError>` | 记录解析失败 | reference ref、failure ref | `Result<(), InfraError>` | 追加 failed ref / failure ref;不写 reference state |
| `pub fn requires_degraded_surface(&self) -> bool` | 判断 resolver 是否需要 degraded surface | 无 | `bool` | availability degraded/unavailable 或 failure refs 非空 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_family(state_ref: GovernanceInfraAdapterStateRef, resolver_family: GovernanceSourceResolverFamily, adapter_config_ref: GovernanceAdapterConfigRef, availability: GovernanceAdapterAvailabilityMarker) -> Result<Self, InfraError>` | 建立 resolver adapter state | state ref、family、config ref、availability | `Result<GovernanceSourceResolverAdapterState, InfraError>` | source resolver runtime assembly |

##### `GovernancePublisherAdapterState`

```rust
/// Tracks outbound publisher adapter state without exposing bus details.
pub struct GovernancePublisherAdapterState {
    /// Stable infra adapter state ref.
    pub state_ref: GovernanceInfraAdapterStateRef,
    /// Publisher config ref.
    pub adapter_config_ref: GovernanceAdapterConfigRef,
    /// Availability marker for publisher.
    pub availability: GovernanceAdapterAvailabilityMarker,
    /// Outbox records successfully published by this adapter.
    pub published_outbox_refs: GovernanceOutboxRefSet,
    /// Outbox records that failed publication.
    pub failed_outbox_refs: GovernanceOutboxRefSet,
    /// Redacted publisher failures.
    pub failure_refs: GovernanceAdapterFailureRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_ref` | `GovernanceInfraAdapterStateRef` | publisher state identity | infra factory / fake runtime 生成 |
| `adapter_config_ref` | `GovernanceAdapterConfigRef` | publisher config ref | 不保存 topic、route、credential 或 bus product |
| `availability` | `GovernanceAdapterAvailabilityMarker` | publisher 可用性 | unavailable 只影响 publish job report,不回滚 truth |
| `published_outbox_refs` | `GovernanceOutboxRefSet` | 已发布 outbox refs | publisher success marker;不保存 payload body |
| `failed_outbox_refs` | `GovernanceOutboxRefSet` | 发布失败 outbox refs | publisher failure marker;进入 job report |
| `failure_refs` | `GovernanceAdapterFailureRefSet` | redacted failures | 不保存 bus response body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_published(&mut self, outbox_ref: GovernanceOutboxRef) -> Result<(), InfraError>` | 记录 publish success | outbox ref | `Result<(), InfraError>` | 不保存 event payload;不修改 outbox record |
| `pub fn record_failed(&mut self, outbox_ref: GovernanceOutboxRef, failure_ref: GovernanceAdapterFailureRef) -> Result<(), InfraError>` | 记录 publish failure | outbox ref、failure ref | `Result<(), InfraError>` | 不回滚 truth;追加 failed refs |
| `pub fn can_publish(&self) -> bool` | 判断 publisher 是否可调用 | 无 | `bool` | availability usable 才返回 true |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_publisher(state_ref: GovernanceInfraAdapterStateRef, adapter_config_ref: GovernanceAdapterConfigRef, availability: GovernanceAdapterAvailabilityMarker) -> Result<Self, InfraError>` | 建立 publisher adapter state | state ref、config ref、availability | `Result<GovernancePublisherAdapterState, InfraError>` | outbox publisher runtime assembly |

##### `GovernanceHandoffAdapterState`

```rust
/// Tracks handoff or external GRC adapter state without storing external material.
pub struct GovernanceHandoffAdapterState {
    /// Stable infra adapter state ref.
    pub state_ref: GovernanceInfraAdapterStateRef,
    /// Adapter slot represented by this handoff adapter.
    pub adapter_slot: GovernanceInfraAdapterSlot,
    /// Adapter config ref.
    pub adapter_config_ref: GovernanceAdapterConfigRef,
    /// Availability marker for handoff/export adapter.
    pub availability: GovernanceAdapterAvailabilityMarker,
    /// Target refs handled by this adapter.
    pub target_refs: Vec<TraceHandoffTargetRef>,
    /// Handoff markers produced by this adapter.
    pub marker_refs: GovernanceHandoffMarkerRefSet,
    /// Redacted handoff failures.
    pub failure_refs: GovernanceAdapterFailureRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_ref` | `GovernanceInfraAdapterStateRef` | handoff adapter state identity | infra factory / fake runtime 生成 |
| `adapter_slot` | `GovernanceInfraAdapterSlot` | handoff / external GRC slot | 只能是 `HandoffAdapter` 或 `ExternalGrcAdapter` |
| `adapter_config_ref` | `GovernanceAdapterConfigRef` | adapter config ref | 不保存 target URL、secret 或 export product |
| `availability` | `GovernanceAdapterAvailabilityMarker` | adapter 可用性 | disabled external GRC 不影响 core truth |
| `target_refs` | `Vec<TraceHandoffTargetRef>` | 已处理目标 refs | ordered unique;不保存 target body |
| `marker_refs` | `GovernanceHandoffMarkerRefSet` | produced marker refs | 成功/失败 marker 都可进入集合 |
| `failure_refs` | `GovernanceAdapterFailureRefSet` | redacted handoff failures | 不保存 package body、receipt body 或 external error body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_marker(&mut self, target_ref: TraceHandoffTargetRef, marker_ref: GovernanceHandoffMarkerRef) -> Result<(), InfraError>` | 记录 handoff / export marker | target ref、marker ref | `Result<(), InfraError>` | 只追加 refs;不保存 package body |
| `pub fn record_failure(&mut self, target_ref: TraceHandoffTargetRef, failure_ref: GovernanceAdapterFailureRef) -> Result<(), InfraError>` | 记录 handoff / export adapter failure | target ref、failure ref | `Result<(), InfraError>` | 不创建 external truth;进入 job report |
| `pub fn can_prepare(&self) -> bool` | 判断 adapter 是否可准备 handoff/export | 无 | `bool` | disabled / unavailable 返回 false |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_handoff(state_ref: GovernanceInfraAdapterStateRef, adapter_slot: GovernanceInfraAdapterSlot, adapter_config_ref: GovernanceAdapterConfigRef, availability: GovernanceAdapterAvailabilityMarker) -> Result<Self, InfraError>` | 建立 handoff/export adapter state | state ref、slot、config ref、availability | `Result<GovernanceHandoffAdapterState, InfraError>` | trace handoff、archive handoff、external GRC export adapter assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| adapter state 不保存正文 | resolver / publisher / handoff state 只保存 refs、availability、failure refs |
| state 不替代 application port | Step 7 必须定义正式 trait;本节不能反推出隐藏方法 |
| failure ref 必须 redacted | adapter failure 不得包含 secret、raw payload、SQL、HTTP body、stack trace |
| publisher failure 不回滚 truth | outbox publish failure 只进入 outbox marker / job report |
| resolver failure 不写 core truth | resolver unavailable 只能更新 snapshot / reference state 或 degraded surface,不得创建 decision / policy / control truth |
| handoff/export 不创建外部 truth | external GRC、archive、observability 只能消费 refs / packages / receipts |
| fake 与 durable 共用 state shape | test fake 可使用同一 state object,避免 fake-only schema |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 adapter state refs | fake / durable adapter 需要稳定状态身份,但不能暴露产品参数 |
| resolver family 使用 enum | 来源族稳定且有限,可用于测试和 degraded branch;不引入 sibling crate |
| publisher state 只记录 outbox refs | payload snapshot 属于 `GovernanceOutboxRecord` / Step 8 event surface,adapter state 不重复保存 |
| handoff state 同时覆盖 external GRC | external GRC export 是 handoff/export 变体,但仍不得创建 external truth |

#### 16.3 `api` command / query entry object contracts

`api` 模块只负责同步 Command / Query intake:解析 `contracts` DTO、校验 actor / metadata / idempotency / query metadata、构造 `GovernanceOperationContext`、调用 application service facade、映射 protocol / application error。`api` 不直接调用 domain object,不直接访问 repository / adapter,不保存 request body,也不定义 Step 8 的完整 DTO schema。

##### api-local entry helpers

```rust
/// References one API route or RPC entry without exposing transport details.
pub struct GovernanceApiRouteRef(pub String);

/// References a redacted API validation issue.
pub struct GovernanceApiValidationIssueRef(pub String);

/// Ordered unique API validation issue refs.
pub struct GovernanceApiValidationIssueRefSet(pub Vec<GovernanceApiValidationIssueRef>);

/// Classifies a synchronous Governance API entry.
pub enum GovernanceApiEntryKind {
    /// Synchronous command entry.
    Command,
    /// Synchronous query entry.
    Query,
}

/// Names a command DTO without defining its Step 8 body here.
pub struct GovernanceCommandDtoName(pub String);

/// Names a query DTO without defining its Step 8 body here.
pub struct GovernanceQueryDtoName(pub String);

/// Classifies handler completion before transport mapping.
pub enum GovernanceApiHandlerDisposition {
    /// Handler accepted the request and returned an application result surface.
    Accepted,
    /// Handler rejected the request before application execution.
    Rejected,
    /// Handler returned a not-visible query surface.
    NotVisible,
    /// Handler returned a degraded query surface.
    Degraded,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceApiRouteRef` | route / RPC entry identity | transport-neutral;不保存 path pattern、host 或 auth secret |
| `GovernanceApiValidationIssueRef` | redacted validation issue | handler validation 生成;不得保存 request body |
| `GovernanceApiEntryKind` | command / query entry 分类 | command 可写;query 必须只读 |
| `GovernanceCommandDtoName` | command DTO 名称 | 必须与 Step 8 command DTO 名称一致;不定义字段 |
| `GovernanceQueryDtoName` | query DTO 名称 | 必须与 Step 8 query DTO 名称一致;不定义字段 |
| `GovernanceApiHandlerDisposition` | handler completion 分类 | 只用于 API error/result mapping;不表达 domain state |

##### `GovernanceApiCommandEntry`

```rust
/// API command entry state before invoking application services.
pub struct GovernanceApiCommandEntry {
    /// Route or RPC entry identity.
    pub route_ref: GovernanceApiRouteRef,
    /// Command DTO name.
    pub command_name: GovernanceCommandDtoName,
    /// Operation name mapped to the application layer.
    pub operation_name: GovernanceOperationName,
    /// Trusted actor context from inbound boundary.
    pub actor: ActorContext,
    /// Core command metadata.
    pub metadata: CommandMetadata,
    /// Normalized idempotency key.
    pub idempotency_key: GovernanceOperationIdempotencyKey,
    /// Core distributed trace id extracted from metadata.
    pub core_trace_id: TraceId,
    /// Redacted validation issues observed before application execution.
    pub validation_issue_refs: GovernanceApiValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `route_ref` | `GovernanceApiRouteRef` | command route identity | route registry / handler assembly 传入 |
| `command_name` | `GovernanceCommandDtoName` | command DTO 名称 | Step 8 正式 DTO 名称;不保存 DTO body |
| `operation_name` | `GovernanceOperationName` | application operation identity | 与 command flow 一致 |
| `actor` | `ActorContext` | trusted actor context | gateway / inbound boundary 注入;api 不做登录认证 |
| `metadata` | `CommandMetadata` | command metadata | 必须含 request / idempotency / trace 语义 |
| `idempotency_key` | `GovernanceOperationIdempotencyKey` | normalized command key | 从 `CommandMetadata` idempotency key 派生;缺失则 rejected |
| `core_trace_id` | `TraceId` | core trace id | 从 `metadata.request.trace_id` 派生;不得重新生成 |
| `validation_issue_refs` | `GovernanceApiValidationIssueRefSet` | redacted validation issues | rejected 前可写;accepted 必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self) -> Result<GovernanceOperationContext, ApiError>` | 构造 application command context | 无 | `Result<GovernanceOperationContext, ApiError>` | 调用 `GovernanceOperationContext::from_command(...)`;不调用 service |
| `pub fn assert_metadata_complete(&self) -> Result<(), ApiError>` | 校验 actor / metadata / idempotency / trace 完整 | 无 | `Result<(), ApiError>` | 缺失则 rejected;不得进入 application |
| `pub fn reject(&mut self, issue_ref: GovernanceApiValidationIssueRef) -> Result<GovernanceApiHandlerResult, ApiError>` | 构造 pre-application rejected result | redacted issue ref | `Result<GovernanceApiHandlerResult, ApiError>` | 追加 issue;不调用 application |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_inbound(route_ref: GovernanceApiRouteRef, command_name: GovernanceCommandDtoName, operation_name: GovernanceOperationName, actor: ActorContext, metadata: CommandMetadata, idempotency_key: GovernanceOperationIdempotencyKey, core_trace_id: TraceId) -> Result<Self, ApiError>` | 从已解析 inbound command 构造 entry | route、DTO name、operation、actor、metadata、key、core trace id | `Result<GovernanceApiCommandEntry, ApiError>` | command handler validation 后;`core_trace_id` 必须等于 `metadata.request.trace_id` |

##### `GovernanceApiQueryEntry`

```rust
/// API query entry state before invoking authorized query services.
pub struct GovernanceApiQueryEntry {
    /// Route or RPC entry identity.
    pub route_ref: GovernanceApiRouteRef,
    /// Query DTO name.
    pub query_name: GovernanceQueryDtoName,
    /// Operation name mapped to the application layer.
    pub operation_name: GovernanceOperationName,
    /// Trusted actor context from inbound boundary.
    pub actor: ActorContext,
    /// Core query metadata.
    pub metadata: QueryMetadata,
    /// Core distributed trace id extracted from metadata.
    pub core_trace_id: TraceId,
    /// Optional requested page helper.
    pub page_request: Option<GovernancePageRequest>,
    /// Redacted validation issues observed before application execution.
    pub validation_issue_refs: GovernanceApiValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `route_ref` | `GovernanceApiRouteRef` | query route identity | route registry / handler assembly 传入 |
| `query_name` | `GovernanceQueryDtoName` | query DTO 名称 | Step 8 正式 DTO 名称;不保存 DTO body |
| `operation_name` | `GovernanceOperationName` | application query operation | 与 query flow 一致 |
| `actor` | `ActorContext` | trusted actor context | 必填;缺失不进入 query service |
| `metadata` | `QueryMetadata` | query metadata | 必填;用于 page / consistency / trace |
| `core_trace_id` | `TraceId` | core trace id | 从 `metadata.request.trace_id` 派生;query 不追加 trace record |
| `page_request` | `Option<GovernancePageRequest>` | optional page helper | 从 query DTO / metadata 映射;limit guard 留给 Step 8 / 14 |
| `validation_issue_refs` | `GovernanceApiValidationIssueRefSet` | validation issues | accepted query 必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self) -> Result<GovernanceOperationContext, ApiError>` | 构造 application query context | 无 | `Result<GovernanceOperationContext, ApiError>` | 调用 `GovernanceOperationContext::from_query(...)`;query no-write |
| `pub fn assert_query_metadata_complete(&self) -> Result<(), ApiError>` | 校验 actor / query metadata / trace 完整 | 无 | `Result<(), ApiError>` | 缺失则 rejected |
| `pub fn assert_no_idempotency_key(&self) -> Result<(), ApiError>` | 校验 query 未携带 write idempotency | 无 | `Result<(), ApiError>` | query 带 command idempotency key 时 rejected |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_inbound(route_ref: GovernanceApiRouteRef, query_name: GovernanceQueryDtoName, operation_name: GovernanceOperationName, actor: ActorContext, metadata: QueryMetadata, core_trace_id: TraceId, page_request: Option<GovernancePageRequest>) -> Result<Self, ApiError>` | 从已解析 inbound query 构造 entry | route、DTO name、operation、actor、metadata、core trace id、page | `Result<GovernanceApiQueryEntry, ApiError>` | query handler validation 后;`core_trace_id` 必须等于 `metadata.request.trace_id` |

##### `GovernanceApiHandlerResult`

```rust
/// Transport-neutral API handler result before final response mapping.
pub struct GovernanceApiHandlerResult {
    /// Entry kind that produced this result.
    pub entry_kind: GovernanceApiEntryKind,
    /// Route that handled the request.
    pub route_ref: GovernanceApiRouteRef,
    /// Handler disposition.
    pub disposition: GovernanceApiHandlerDisposition,
    /// Application result ref when a command was accepted.
    pub application_result_ref: Option<GovernanceApplicationResultRef>,
    /// Visibility marker when a query returns not-visible or visible surface.
    pub visibility: Option<GovernanceVisibilityMarker>,
    /// Degraded marker when a query response is degraded.
    pub degraded: Option<GovernanceDegradedMarker>,
    /// Redacted validation issues for rejected requests.
    pub validation_issue_refs: GovernanceApiValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_kind` | `GovernanceApiEntryKind` | command / query | 来自 entry object |
| `route_ref` | `GovernanceApiRouteRef` | handler route | 来自 entry object |
| `disposition` | `GovernanceApiHandlerDisposition` | handler result 分类 | accepted / rejected / not visible / degraded |
| `application_result_ref` | `Option<GovernanceApplicationResultRef>` | accepted command result ref | command accepted path 可为 `Some`;query 通常为 `None` |
| `visibility` | `Option<GovernanceVisibilityMarker>` | query visibility marker | query response surface 传入;command 不使用 |
| `degraded` | `Option<GovernanceDegradedMarker>` | query degraded marker | stale / unavailable / partial response 时存在 |
| `validation_issue_refs` | `GovernanceApiValidationIssueRefSet` | pre-application rejected issues | accepted path 必须为空;不保存 request body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_rejected(&self) -> bool` | 判断 handler 是否拒绝请求 | 无 | `bool` | `disposition == Rejected` |
| `pub fn is_query_surface(&self) -> bool` | 判断是否为 query surface | 无 | `bool` | `entry_kind == Query` |
| `pub fn assert_no_body_leak(&self) -> Result<(), ApiError>` | 校验 handler result 不携带 raw body | 无 | `Result<(), ApiError>` | 只检查 refs / markers;不访问 transport response |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn accepted_command(route_ref: GovernanceApiRouteRef, result_ref: GovernanceApplicationResultRef) -> Result<Self, ApiError>` | 构造 accepted command result shell | route、application result ref | `Result<GovernanceApiHandlerResult, ApiError>` | command handler accepted path |
| `pub fn rejected(entry_kind: GovernanceApiEntryKind, route_ref: GovernanceApiRouteRef, issue_refs: GovernanceApiValidationIssueRefSet) -> Result<Self, ApiError>` | 构造 rejected handler result | entry kind、route、issues | `Result<GovernanceApiHandlerResult, ApiError>` | validation failure / missing metadata |
| `pub fn query_surface(route_ref: GovernanceApiRouteRef, visibility: GovernanceVisibilityMarker, degraded: Option<GovernanceDegradedMarker>) -> Result<Self, ApiError>` | 构造 query surface result shell | route、visibility、optional degraded | `Result<GovernanceApiHandlerResult, ApiError>` | query handler response assembly |

##### `GovernanceApiRouteRegistryState`

```rust
/// Records the transport-neutral API routes registered for Governance.
pub struct GovernanceApiRouteRegistryState {
    /// Command routes registered by API assembly.
    pub command_routes: Vec<GovernanceApiRouteRef>,
    /// Query routes registered by API assembly.
    pub query_routes: Vec<GovernanceApiRouteRef>,
    /// Redacted registration issues.
    pub validation_issue_refs: GovernanceApiValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `command_routes` | `Vec<GovernanceApiRouteRef>` | command route refs | ordered unique;不保存 transport path body |
| `query_routes` | `Vec<GovernanceApiRouteRef>` | query route refs | ordered unique |
| `validation_issue_refs` | `GovernanceApiValidationIssueRefSet` | route assembly issues | redacted;不得保存 config body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn register_command(&mut self, route_ref: GovernanceApiRouteRef) -> Result<(), ApiError>` | 注册 command route | route ref | `Result<(), ApiError>` | 追加 route ref;不绑定 handler implementation |
| `pub fn register_query(&mut self, route_ref: GovernanceApiRouteRef) -> Result<(), ApiError>` | 注册 query route | route ref | `Result<(), ApiError>` | 追加 route ref |
| `pub fn has_route(&self, route_ref: &GovernanceApiRouteRef) -> bool` | 判断 route 是否存在 | route ref | `bool` | 纯判断 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn empty() -> Self` | 建立空 route registry | 无 | `GovernanceApiRouteRegistryState` | API runtime assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| API 不直接调用 domain | handler 只能调用 application service / facade |
| API 不访问 repository / adapter | repository / adapter 只能经 application / infra runtime 注入 |
| Command 缺 metadata 不进入 application | actor、command metadata、idempotency key、trace 缺失必须 rejected |
| Query no-write | query entry 不允许 idempotency reserve、truth write、projection write、trace append、outbox append |
| not visible 是 surface | query denied 必须通过 `GovernanceVisibilityMarker` 返回,不能只抛普通 error |
| handler result 不保存 body | result shell 只保存 refs、markers 和 issue refs;完整 response DTO 留给 Step 8 |
| route registry 不等于 transport config | path、method、host、auth、CORS、rate limit 等留给 API implementation / config |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 transport-neutral route ref | Step 6 不绑定 HTTP / RPC 产品,但 handler 需要稳定 route identity |
| command/query DTO 只保存 name | 完整 DTO schema 属于 Step 8,本 Step 不能提前定义字段 body |
| handler result 使用 `GovernanceApplicationResultRef` | command accepted duplicate replay 与 stored result surface 已在 §15.7 收口 |
| query result 使用 visibility / degraded marker | 与 §10.18 / §14.12 / §15.7 的 not-visible surface 保持一致 |

#### 16.4 `worker` inbound consumer / outbox loop / projection loop entry object contracts

`worker` 模块负责异步入口:inbound event consumer、outbox publisher loop、projection invalidation / maintenance trigger。Worker 只能调用 application service,不得绕过 application 写 repository,不得把 inbound event 直接变成 Decision / Policy / Control / Compliance / Nonconformity truth,也不得在 outbox publish failure 时回滚 accepted truth。本节只定义 worker entry object;event envelope DTO、dedup repository、consumer flow 和 publish flow 留给 Step 8 / Step 9 / Step 13。

##### worker-local entry helpers

```rust
/// References one worker entry or loop.
pub struct GovernanceWorkerEntryRef(pub String);

/// References a redacted worker validation issue.
pub struct GovernanceWorkerValidationIssueRef(pub String);

/// Ordered unique worker validation issue refs.
pub struct GovernanceWorkerValidationIssueRefSet(pub Vec<GovernanceWorkerValidationIssueRef>);

/// References a source event without embedding its payload.
pub struct GovernanceSourceEventRef(pub ExternalSourceRef);

/// References an inbound event dedup key.
pub struct GovernanceEventDedupKey(pub String);

/// References an inbound event schema version.
pub struct GovernanceEventSchemaVersion(pub String);

/// Classifies inbound source events by owning upstream boundary.
pub enum GovernanceInboundEventSourceFamily {
    /// Identity capability or actor source.
    Identity,
    /// Process governance context source.
    Process,
    /// Work governance context source.
    Work,
    /// Artifact and evidence source.
    Artifact,
    /// Method policy or control source.
    Method,
    /// Runtime or capability signal source.
    Runtime,
    /// Conversation context source.
    Conversation,
    /// Observability alert or audit source.
    Observability,
}

/// Worker entry lifecycle.
pub enum GovernanceWorkerEntryState {
    /// Entry is registered but not running.
    Registered,
    /// Entry is currently polling or consuming.
    Running,
    /// Entry is delayed due to unavailable source or backoff.
    Delayed,
    /// Entry is stopped by validated runtime config.
    Stopped,
    /// Entry failed and needs operator attention.
    Failed,
}

/// Result of handling one inbound worker item.
pub enum GovernanceWorkerDisposition {
    /// Item was accepted by application service.
    Accepted,
    /// Item was already handled by dedup logic.
    Duplicate,
    /// Item is delayed for retry or source availability.
    Delayed,
    /// Item was rejected before application service.
    Rejected,
    /// Item cannot be processed because the schema version is unsupported.
    UnsupportedVersion,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceWorkerEntryRef` | worker entry / loop identity | worker runtime assembly 生成;不进入 public protocol |
| `GovernanceWorkerValidationIssueRef` | redacted worker issue | 不保存 event payload、adapter response 或 stack trace |
| `GovernanceSourceEventRef` | upstream event identity | 来源 envelope 的 source event id / ref;不保存 event body |
| `GovernanceEventDedupKey` | inbound event dedup key | 从 event metadata / envelope 派生;Step 13 定义 repository |
| `GovernanceEventSchemaVersion` | event schema version | Step 8 定义 envelope 字段;unsupported 必须有处置 |
| `GovernanceInboundEventSourceFamily` | upstream source family | 稳定有限来源;不引入 sibling crate |
| `GovernanceWorkerEntryState` | worker loop lifecycle | config / runtime 控制;不得改变业务 truth |
| `GovernanceWorkerDisposition` | item handling disposition | consumer receipt / job report / operations surface 使用 |

##### `GovernanceInboundConsumerEntry`

```rust
/// Worker entry for one inbound event consumer.
pub struct GovernanceInboundConsumerEntry {
    /// Worker entry identity.
    pub entry_ref: GovernanceWorkerEntryRef,
    /// Source family consumed by this entry.
    pub source_family: GovernanceInboundEventSourceFamily,
    /// Source event ref from the envelope.
    pub source_event_ref: GovernanceSourceEventRef,
    /// External source ref represented by the event.
    pub source_ref: ExternalGovernanceReferenceRef,
    /// Event schema version observed at the worker boundary.
    pub schema_version: GovernanceEventSchemaVersion,
    /// Dedup key observed at the worker boundary.
    pub dedup_key: GovernanceEventDedupKey,
    /// Core distributed trace id propagated from the envelope.
    pub core_trace_id: TraceId,
    /// Worker entry state.
    pub entry_state: GovernanceWorkerEntryState,
    /// Redacted validation issues before application execution.
    pub validation_issue_refs: GovernanceWorkerValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceWorkerEntryRef` | consumer entry identity | worker runtime assembly |
| `source_family` | `GovernanceInboundEventSourceFamily` | upstream family | identity / process / work / artifact / method / runtime / conversation / observability |
| `source_event_ref` | `GovernanceSourceEventRef` | source event identity | envelope metadata;不保存 payload |
| `source_ref` | `ExternalGovernanceReferenceRef` | event subject ref | envelope / payload summary 映射;不保存 external body |
| `schema_version` | `GovernanceEventSchemaVersion` | event schema version | unsupported 时 disposition 为 `UnsupportedVersion` |
| `dedup_key` | `GovernanceEventDedupKey` | event dedup key | 缺失时 rejected,不得写 snapshot |
| `core_trace_id` | `TraceId` | event trace | 从 envelope traceparent / metadata 复制 |
| `entry_state` | `GovernanceWorkerEntryState` | worker entry lifecycle | stopped / failed 不消费事件 |
| `validation_issue_refs` | `GovernanceWorkerValidationIssueRefSet` | validation issues | rejected / unsupported 时可存在;accepted 必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self, operation_name: GovernanceOperationName, actor: ActorContext) -> Result<GovernanceOperationContext, WorkerError>` | 构造 inbound event application context | operation name、system/worker actor | `Result<GovernanceOperationContext, WorkerError>` | channel 为 `InboundEvent`;不调用 service |
| `pub fn assert_envelope_complete(&self) -> Result<(), WorkerError>` | 校验 event envelope 必填面 | 无 | `Result<(), WorkerError>` | 缺 source event / source ref / schema / dedup / trace 时 rejected |
| `pub fn unsupported_version(&mut self, issue_ref: GovernanceWorkerValidationIssueRef) -> Result<GovernanceWorkerItemResult, WorkerError>` | 构造 unsupported version disposition | redacted issue ref | `Result<GovernanceWorkerItemResult, WorkerError>` | 不调用 application;不写 snapshot |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_envelope(entry_ref: GovernanceWorkerEntryRef, source_family: GovernanceInboundEventSourceFamily, source_event_ref: GovernanceSourceEventRef, source_ref: ExternalGovernanceReferenceRef, schema_version: GovernanceEventSchemaVersion, dedup_key: GovernanceEventDedupKey, core_trace_id: TraceId) -> Result<Self, WorkerError>` | 从已解析 event envelope 构造 consumer entry | entry ref、source family、event ref、source ref、schema、dedup、core trace id | `Result<GovernanceInboundConsumerEntry, WorkerError>` | inbound consumer boundary |

##### `GovernanceOutboxPublisherLoopEntry`

```rust
/// Worker loop entry for publishing Governance outbox records.
pub struct GovernanceOutboxPublisherLoopEntry {
    /// Worker entry identity.
    pub entry_ref: GovernanceWorkerEntryRef,
    /// Publisher adapter state used by the loop.
    pub publisher_state_ref: GovernanceInfraAdapterStateRef,
    /// Worker entry state.
    pub entry_state: GovernanceWorkerEntryState,
    /// Last outbox refs scanned by this loop.
    pub scanned_outbox_refs: GovernanceOutboxRefSet,
    /// Last outbox refs published by this loop.
    pub published_outbox_refs: GovernanceOutboxRefSet,
    /// Last outbox refs failed by this loop.
    pub failed_outbox_refs: GovernanceOutboxRefSet,
    /// Redacted worker validation or adapter issues.
    pub validation_issue_refs: GovernanceWorkerValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceWorkerEntryRef` | outbox loop identity | worker runtime assembly |
| `publisher_state_ref` | `GovernanceInfraAdapterStateRef` | publisher adapter state ref | 指向 `GovernancePublisherAdapterState`;不保存 bus config |
| `entry_state` | `GovernanceWorkerEntryState` | loop lifecycle | delayed / failed 不回滚 truth |
| `scanned_outbox_refs` | `GovernanceOutboxRefSet` | scanned refs | loop scan result;不保存 payload |
| `published_outbox_refs` | `GovernanceOutboxRefSet` | publish success refs | publisher success marker |
| `failed_outbox_refs` | `GovernanceOutboxRefSet` | publish failure refs | publisher failure marker |
| `validation_issue_refs` | `GovernanceWorkerValidationIssueRefSet` | loop issues | redacted;不保存 publisher error body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_scan(&mut self, outbox_refs: GovernanceOutboxRefSet) -> Result<(), WorkerError>` | 记录 pending scan refs | outbox refs | `Result<(), WorkerError>` | 不加载 payload body |
| `pub fn record_published(&mut self, outbox_ref: GovernanceOutboxRef) -> Result<(), WorkerError>` | 记录 publish success | outbox ref | `Result<(), WorkerError>` | 不修改 outbox state;application service 负责 marker |
| `pub fn record_failed(&mut self, outbox_ref: GovernanceOutboxRef, issue_ref: GovernanceWorkerValidationIssueRef) -> Result<(), WorkerError>` | 记录 publish failure | outbox ref、issue ref | `Result<(), WorkerError>` | 不回滚 accepted truth |
| `pub fn delay(&mut self, issue_ref: GovernanceWorkerValidationIssueRef) -> Result<(), WorkerError>` | 标记 loop delayed | redacted issue ref | `Result<(), WorkerError>` | 设置 `Delayed`;不丢弃 scanned refs |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(entry_ref: GovernanceWorkerEntryRef, publisher_state_ref: GovernanceInfraAdapterStateRef) -> Result<Self, WorkerError>` | 建立 outbox publisher loop entry | entry ref、publisher state ref | `Result<GovernanceOutboxPublisherLoopEntry, WorkerError>` | worker runtime assembly |

##### `GovernanceProjectionWorkerEntry`

```rust
/// Worker entry that triggers projection invalidation or maintenance.
pub struct GovernanceProjectionWorkerEntry {
    /// Worker entry identity.
    pub entry_ref: GovernanceWorkerEntryRef,
    /// Projection store state used by the entry.
    pub projection_store_state_ref: GovernanceInfraAdapterStateRef,
    /// Worker entry state.
    pub entry_state: GovernanceWorkerEntryState,
    /// Views affected by the trigger.
    pub affected_view_refs: DerivedGovernanceViewRefSet,
    /// Source cursor observed by the trigger.
    pub source_cursor: Option<GovernanceTruthCursor>,
    /// Redacted worker issues.
    pub validation_issue_refs: GovernanceWorkerValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceWorkerEntryRef` | projection worker identity | worker runtime assembly |
| `projection_store_state_ref` | `GovernanceInfraAdapterStateRef` | projection store adapter state | 指向 projection store state;不保存 view body |
| `entry_state` | `GovernanceWorkerEntryState` | worker lifecycle | delayed / failed 不修复 truth |
| `affected_view_refs` | `DerivedGovernanceViewRefSet` | affected views | 必须来自正式 projection identity / application affected view mapping |
| `source_cursor` | `Option<GovernanceTruthCursor>` | trigger source cursor | cursor 不作为 optimistic version |
| `validation_issue_refs` | `GovernanceWorkerValidationIssueRefSet` | redacted issues | 不保存 view body / adapter error body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_affected_views(&mut self, view_refs: DerivedGovernanceViewRefSet, source_cursor: Option<GovernanceTruthCursor>) -> Result<(), WorkerError>` | 记录受影响 projection refs | view refs、optional cursor | `Result<(), WorkerError>` | 不 mark stale;application service 负责 |
| `pub fn mark_delayed(&mut self, issue_ref: GovernanceWorkerValidationIssueRef) -> Result<(), WorkerError>` | 标记 projection trigger delayed | issue ref | `Result<(), WorkerError>` | 不执行 rebuild |
| `pub fn can_trigger(&self) -> bool` | 判断是否可触发 application maintenance | 无 | `bool` | `Running` / `Registered` 可触发 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_projection_store(entry_ref: GovernanceWorkerEntryRef, projection_store_state_ref: GovernanceInfraAdapterStateRef) -> Result<Self, WorkerError>` | 建立 projection worker entry | entry ref、projection store state ref | `Result<GovernanceProjectionWorkerEntry, WorkerError>` | projection invalidation / maintenance worker assembly |

##### `GovernanceWorkerItemResult`

```rust
/// Worker-level disposition for one consumed or published item.
pub struct GovernanceWorkerItemResult {
    /// Worker entry that produced the result.
    pub entry_ref: GovernanceWorkerEntryRef,
    /// Final disposition.
    pub disposition: GovernanceWorkerDisposition,
    /// Source event when the result comes from an inbound event.
    pub source_event_ref: Option<GovernanceSourceEventRef>,
    /// Outbox record when the result comes from outbox publish.
    pub outbox_ref: Option<GovernanceOutboxRef>,
    /// Application result ref when application service accepted the item.
    pub application_result_ref: Option<GovernanceApplicationResultRef>,
    /// Redacted worker issues.
    pub validation_issue_refs: GovernanceWorkerValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceWorkerEntryRef` | worker entry identity | consumer / publisher / projection entry |
| `disposition` | `GovernanceWorkerDisposition` | item result | accepted / duplicate / delayed / rejected / unsupported version |
| `source_event_ref` | `Option<GovernanceSourceEventRef>` | inbound event ref | inbound consumer path 为 `Some` |
| `outbox_ref` | `Option<GovernanceOutboxRef>` | outbox ref | publisher path 为 `Some` |
| `application_result_ref` | `Option<GovernanceApplicationResultRef>` | accepted application result | accepted path 可为 `Some`;duplicate 可指向 stored result |
| `validation_issue_refs` | `GovernanceWorkerValidationIssueRefSet` | redacted issues | rejected / delayed / unsupported 必须说明 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_terminal_for_item(&self) -> bool` | 判断本 item 是否无需立即重试 | 无 | `bool` | accepted / duplicate / rejected / unsupported 返回 true;delayed 返回 false |
| `pub fn is_duplicate(&self) -> bool` | 判断是否 duplicate | 无 | `bool` | disposition duplicate |
| `pub fn assert_no_payload_body(&self) -> Result<(), WorkerError>` | 校验 result 不携带 payload body | 无 | `Result<(), WorkerError>` | 只保存 refs / issues |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn accepted(entry_ref: GovernanceWorkerEntryRef, source_event_ref: Option<GovernanceSourceEventRef>, outbox_ref: Option<GovernanceOutboxRef>, result_ref: GovernanceApplicationResultRef) -> Result<Self, WorkerError>` | 构造 accepted item result | entry、optional event、optional outbox、result ref | `Result<GovernanceWorkerItemResult, WorkerError>` | consumer / publisher accepted path |
| `pub fn duplicate(entry_ref: GovernanceWorkerEntryRef, source_event_ref: GovernanceSourceEventRef, result_ref: Option<GovernanceApplicationResultRef>) -> Result<Self, WorkerError>` | 构造 duplicate event result | entry、event ref、optional stored result ref | `Result<GovernanceWorkerItemResult, WorkerError>` | event dedup duplicate path |
| `pub fn rejected(entry_ref: GovernanceWorkerEntryRef, source_event_ref: Option<GovernanceSourceEventRef>, issue_refs: GovernanceWorkerValidationIssueRefSet) -> Result<Self, WorkerError>` | 构造 rejected item result | entry、optional event、issues | `Result<GovernanceWorkerItemResult, WorkerError>` | body forbidden / missing metadata |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| worker 不绕过 application | inbound consumer、outbox publisher、projection worker 都必须调用 application service |
| consumer 不创建 core truth | inbound event 只能写 snapshot、reference state、pending marker、stale marker 或 receipt |
| unsupported version 不猜 schema | unsupported event version 必须返回 `UnsupportedVersion`,不得尝试解析 payload |
| forbidden body 不进入 state | event / adapter body 不得进入 worker entry 或 result |
| outbox failure 不回滚 truth | publisher failure 只进入 outbox marker / worker result / job report |
| projection worker 不修复 truth | projection trigger 只能 mark stale / trigger maintenance,不得修改 domain truth |
| duplicate 不重放 transition | duplicate consumer item 必须走 stored result / receipt surface,不得重跑 application transition |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 新增 worker item result | HLD 只写 receipt / duplicate surface;实现需要 transport-neutral worker item disposition |
| event schema version 是 worker helper | Step 8 会定义 envelope 字段;Step 6 只固定 worker entry 必须承载该值 |
| projection affected views 只保存 refs | affected view mapping 必须由 Step 7/9 正式定义,worker 不能临时拼 projection identity |
| outbox loop entry 不保存 payload | publisher 只读 outbox payload snapshot;worker state 不复制 payload |

#### 16.5 `jobs` operations job entry object contracts

`jobs` 模块负责显式运行 operations job:publish outbox、rebuild projections、refresh external context snapshots、run reconciliation、prepare trace handoff、prepare archive handoff 和 prepare external GRC export。Job runner 只能调用 application service 和 infra runtime 注入的 facade,不得把 job 当业务 command,不得直接修复 Governance truth,不得绕过 stored job report duplicate replay。本节只定义 job entry object;完整 job request DTO、repository读取面、page / batch / retry / cursor 规则和 duplicate result store 留给 Step 8 / 9 / 13 / 14。

##### jobs-local entry helpers

```rust
/// References one operations job entry.
pub struct GovernanceJobEntryRef(pub String);

/// References a redacted job validation issue.
pub struct GovernanceJobValidationIssueRef(pub String);

/// Ordered unique job validation issue refs.
pub struct GovernanceJobValidationIssueRefSet(pub Vec<GovernanceJobValidationIssueRef>);

/// Classifies Governance operations jobs.
pub enum GovernanceOperationsJobKind {
    /// Publish pending Governance outbox records.
    PublishGovernanceOutbox,
    /// Rebuild Governance projections from committed truth.
    RebuildGovernanceProjections,
    /// Refresh external context snapshots and reference states.
    RefreshExternalContextSnapshots,
    /// Run Governance reconciliation.
    RunGovernanceReconciliation,
    /// Prepare Governance trace handoff.
    PrepareGovernanceTraceHandoff,
    /// Prepare Governance archive handoff.
    PrepareGovernanceArchiveHandoff,
    /// Prepare external GRC export.
    PrepareExternalGrcExport,
}

/// Runtime lifecycle for one job entry.
pub enum GovernanceJobEntryState {
    /// Job entry is registered but not running.
    Registered,
    /// Job entry is currently running.
    Running,
    /// Job entry is delayed by config, dependency, or backoff.
    Delayed,
    /// Job entry completed its current run.
    Completed,
    /// Job entry failed its current run.
    Failed,
}

/// Job run disposition before transport or scheduler mapping.
pub enum GovernanceJobRunDisposition {
    /// Job completed all requested work.
    Completed,
    /// Job completed part of the requested work.
    PartiallyCompleted,
    /// Job failed before producing requested output.
    Failed,
    /// Job duplicate returned stored report surface.
    DuplicateReplayed,
    /// Job was rejected before application execution.
    Rejected,
}
```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `GovernanceJobEntryRef` | job entry identity | jobs runtime assembly 生成;不进入 public protocol |
| `GovernanceJobValidationIssueRef` | redacted job issue | 不保存 job payload、config body、adapter response 或 stack trace |
| `GovernanceOperationsJobKind` | operations job 分类 | 7 个 HLD job 固定;不得新增隐式 repair job |
| `GovernanceJobEntryState` | job entry lifecycle | scheduler / runner 本地状态;不表达 domain truth |
| `GovernanceJobRunDisposition` | job run disposition | duplicate replay 与 rejected 都不得重跑 job body |

##### `GovernanceOperationsJobEntry`

```rust
/// Jobs entry state for one Governance operations job run.
pub struct GovernanceOperationsJobEntry {
    /// Job entry identity.
    pub entry_ref: GovernanceJobEntryRef,
    /// Operations job kind.
    pub job_kind: GovernanceOperationsJobKind,
    /// Application operation name.
    pub operation_name: GovernanceOperationName,
    /// Job run id.
    pub run_id: GovernanceJobRunId,
    /// Job idempotency key.
    pub idempotency_key: GovernanceJobIdempotencyKey,
    /// Operator or system actor context.
    pub actor: ActorContext,
    /// Core distributed trace id propagated into reports and markers.
    pub core_trace_id: TraceId,
    /// Governance scope when the job is scope-bound.
    pub scope_ref: Option<GovernanceScopeRef>,
    /// Page request when the job scans paged input.
    pub page_request: Option<GovernancePageRequest>,
    /// Current job entry state.
    pub entry_state: GovernanceJobEntryState,
    /// Redacted validation issues before application execution.
    pub validation_issue_refs: GovernanceJobValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceJobEntryRef` | job entry identity | jobs runtime assembly |
| `job_kind` | `GovernanceOperationsJobKind` | job 分类 | 必须为本节 7 个正式 job 之一 |
| `operation_name` | `GovernanceOperationName` | application operation | 与 Step 8/9 job 名称一致 |
| `run_id` | `GovernanceJobRunId` | job run identity | job metadata;不得替代 result id |
| `idempotency_key` | `GovernanceJobIdempotencyKey` | duplicate replay key | job metadata;缺失则 rejected |
| `actor` | `ActorContext` | system / operator actor | jobs runner 注入;不做登录认证 |
| `core_trace_id` | `TraceId` | trace/report correlation | job metadata / runner context |
| `scope_ref` | `Option<GovernanceScopeRef>` | scope-bound job 范围 | rebuild / refresh / reconciliation / export 可为 `Some`;publish outbox 可为 `None` |
| `page_request` | `Option<GovernancePageRequest>` | paged scan helper | publish / refresh / rebuild scan 使用;limit 规则留给 Step 14 |
| `entry_state` | `GovernanceJobEntryState` | runner lifecycle | running/delayed/completed/failed |
| `validation_issue_refs` | `GovernanceJobValidationIssueRefSet` | redacted issues | rejected / delayed / failed 时可存在 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self) -> Result<GovernanceOperationContext, JobError>` | 构造 application job context | 无 | `Result<GovernanceOperationContext, JobError>` | 调用 `GovernanceOperationContext::from_job(...)`;不运行 job |
| `pub fn start_report_assembly(&self) -> Result<GovernanceJobReportAssembly, JobError>` | 建立 job report accumulator | 无 | `Result<GovernanceJobReportAssembly, JobError>` | 调用 `GovernanceJobReportAssembly::start(...)`;不保存 report |
| `pub fn mark_running(&mut self) -> Result<(), JobError>` | 标记 job running | 无 | `Result<(), JobError>` | 允许 `Registered` / `Delayed -> Running` |
| `pub fn mark_delayed(&mut self, issue_ref: GovernanceJobValidationIssueRef) -> Result<(), JobError>` | 标记 job delayed | redacted issue ref | `Result<(), JobError>` | 不执行 job body;追加 issue |
| `pub fn mark_failed(&mut self, issue_ref: GovernanceJobValidationIssueRef) -> Result<(), JobError>` | 标记 job failed | redacted issue ref | `Result<(), JobError>` | 不修复 truth;追加 issue |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_metadata(entry_ref: GovernanceJobEntryRef, job_kind: GovernanceOperationsJobKind, operation_name: GovernanceOperationName, run_id: GovernanceJobRunId, idempotency_key: GovernanceJobIdempotencyKey, actor: ActorContext, core_trace_id: TraceId, scope_ref: Option<GovernanceScopeRef>, page_request: Option<GovernancePageRequest>) -> Result<Self, JobError>` | 从 job metadata 和 runner input 构造 entry | entry、kind、operation、run、key、actor、core trace id、optional scope/page | `Result<GovernanceOperationsJobEntry, JobError>` | jobs runner validation 后 |

##### `GovernanceOperationsJobRunResult`

```rust
/// Result shell produced by an operations job runner.
pub struct GovernanceOperationsJobRunResult {
    /// Job entry that produced this result.
    pub entry_ref: GovernanceJobEntryRef,
    /// Job kind that ran.
    pub job_kind: GovernanceOperationsJobKind,
    /// Job run id.
    pub run_id: GovernanceJobRunId,
    /// Final disposition.
    pub disposition: GovernanceJobRunDisposition,
    /// Application result ref for stored job report replay.
    pub application_result_ref: Option<GovernanceApplicationResultRef>,
    /// Public job report when a fresh run produced one.
    pub report: Option<GovernanceJobReport>,
    /// Redacted validation or runtime issues.
    pub validation_issue_refs: GovernanceJobValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` | `GovernanceJobEntryRef` | job entry identity | copied from entry |
| `job_kind` | `GovernanceOperationsJobKind` | job kind | copied from entry |
| `run_id` | `GovernanceJobRunId` | run id | copied from entry |
| `disposition` | `GovernanceJobRunDisposition` | run result | completed / partial / failed / duplicate / rejected |
| `application_result_ref` | `Option<GovernanceApplicationResultRef>` | stored result ref | duplicate replay and accepted run use this ref when saved |
| `report` | `Option<GovernanceJobReport>` | public job report | fresh run can return report;duplicate may return stored report in Step 13 path |
| `validation_issue_refs` | `GovernanceJobValidationIssueRefSet` | redacted issues | rejected / failed path |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_duplicate_replay(&self) -> bool` | 判断是否 duplicate replay | 无 | `bool` | `disposition == DuplicateReplayed` |
| `pub fn requires_stored_report(&self) -> bool` | 判断是否必须存在 stored report | 无 | `bool` | duplicate replay 返回 true |
| `pub fn assert_no_truth_repair(&self) -> Result<(), JobError>` | 校验 result 不表达 truth repair | 无 | `Result<(), JobError>` | 只检查 report / refs / issues |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn completed(entry: &GovernanceOperationsJobEntry, result_ref: GovernanceApplicationResultRef, report: GovernanceJobReport) -> Result<Self, JobError>` | 构造完成 job result | entry、stored result ref、report | `Result<GovernanceOperationsJobRunResult, JobError>` | fresh job success / partial success |
| `pub fn duplicate_replayed(entry: &GovernanceOperationsJobEntry, result_ref: GovernanceApplicationResultRef) -> Result<Self, JobError>` | 构造 duplicate replay result | entry、stored result ref | `Result<GovernanceOperationsJobRunResult, JobError>` | idempotency duplicate path |
| `pub fn rejected(entry: &GovernanceOperationsJobEntry, issue_refs: GovernanceJobValidationIssueRefSet) -> Result<Self, JobError>` | 构造 rejected job result | entry、issues | `Result<GovernanceOperationsJobRunResult, JobError>` | missing metadata / disabled job / invalid scope |

##### `GovernanceJobRunnerRegistryState`

```rust
/// Tracks registered operations job runners.
pub struct GovernanceJobRunnerRegistryState {
    /// Registered job entries.
    pub job_entries: Vec<GovernanceJobEntryRef>,
    /// Operations job kinds enabled in this runtime.
    pub enabled_job_kinds: Vec<GovernanceOperationsJobKind>,
    /// Redacted registration issues.
    pub validation_issue_refs: GovernanceJobValidationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `job_entries` | `Vec<GovernanceJobEntryRef>` | registered job entries | ordered unique |
| `enabled_job_kinds` | `Vec<GovernanceOperationsJobKind>` | enabled job kinds | config controls schedule / availability,not domain invariant |
| `validation_issue_refs` | `GovernanceJobValidationIssueRefSet` | registration issues | redacted;不保存 config body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn register(&mut self, entry_ref: GovernanceJobEntryRef, job_kind: GovernanceOperationsJobKind) -> Result<(), JobError>` | 注册 job runner entry | entry ref、job kind | `Result<(), JobError>` | 不创建 schedule;只记录 registry state |
| `pub fn is_enabled(&self, job_kind: &GovernanceOperationsJobKind) -> bool` | 判断 job kind 是否启用 | job kind | `bool` | disabled job rejected before application |
| `pub fn record_issue(&mut self, issue_ref: GovernanceJobValidationIssueRef) -> Result<(), JobError>` | 记录 registry issue | issue ref | `Result<(), JobError>` | redacted issue;不保存 config body |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn empty() -> Self` | 建立空 job runner registry | 无 | `GovernanceJobRunnerRegistryState` | jobs runtime assembly |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| job 不是业务 command | job 只能维护 outbox、projection、snapshot、reconciliation、handoff、export |
| job 不修复 core truth | drift、stale、failed 只能进入 report / marker / degraded surface |
| duplicate 必须 stored report | duplicate job 不得重新扫描 current truth 临时生成 report |
| disabled job 不进入 application | disabled / invalid config 在 jobs layer rejected |
| job result 不保存正文 | result shell 只保存 report、refs、issues,不得保存 external body或adapter body |
| page / batch 不在本节硬编码 | limit、retry、schedule、parallelism 留给 Step 14 和实施配置 |
| runner 不访问 repository | runner 只调用 application service;repository / adapter 由 application/infra runtime承接 |

| 与 HLD 骨架的收口差异 | 原因 |
|---|---|
| 增加 `GovernanceOperationsJobKind` enum | HLD 已固定 7 个 job,可稳定落为 finite enum |
| job entry 只用 optional scope / page | 各 job 的完整 input DTO 留给 Step 8,本 Step 不抢写 job schema |
| job result 同时有 report 和 result ref | fresh run 需要 report surface,duplicate replay 需要 stored result ref |
| registry state 不表达 schedule | schedule / cron / batch / retry 属于 config和runner实现,不进入 Step 6 object |

### 17. 字段闭环表

字段闭环表用于审计 Step 6 对象字段是否具备 1:1 落码来源。它不替代 Step 7 trait / port、Step 8 protocol DTO、Step 11 persistence、Step 13 idempotency 或 Step 14 config;若字段来源依赖这些后续 Step,本表必须明确“后续 Step 闭合位置”和“实现侧不得自行推导”。

#### 17.1 高复用字段来源审计

| 字段 / 字段族 | 出现对象组 | 正式类型 / 归属 | 允许来源 | 后续闭合位置 | 禁止推导 / 禁止事项 |
|---|---|---|---|---|---|
| `*_id` | domain truth、trace、audit、outbox、history、report、handoff、result、job entry | `contracts::refs` opaque id 或本节 module-local id | application / infra / runner id generator;repository load 可重建 | Step 7 `IdGeneratorPort`;Step 11 persistence | domain object、adapter state、handler 不得自行拼接 id |
| `*_ref` | public DTO、domain relation、view、report、job result | `contracts::refs` typed ref 或 module-local entry ref | 已创建对象 `to_ref()`、request ref、repository load、event envelope、job input | Step 8 DTO / Step 9 flow / Step 11 persistence | 不得用裸字符串、title、route path、external body 替代 typed ref |
| `*_ref_set` | dashboard、projection、report、job assembly、adapter state | `contracts::refs` helper set | repository / projection / flow 返回的 ordered unique refs | Step 7 list/read port;Step 9 affected views helper | 不得临时拼 projection identity;空集合语义必须保持“无已知项”而非 missing |
| `actor` / `actor_ref` | command entry、domain transition、policy、operation context、job entry | `ActorContext` / `ActorRef` from core-contracts | trusted inbound boundary、job runner system/operator actor、command metadata mapping | Step 8 metadata;Step 9 flow | Governance 不做登录认证;不得保存 actor profile 或 identity body |
| `CommandMetadata` | API command entry、operation context | core-contracts metadata | inbound command DTO / gateway-injected metadata | Step 8 command protocol | 不得在 Governance 重新定义 metadata 字段 |
| `QueryMetadata` | API query entry、operation context | core-contracts metadata | inbound query DTO / gateway-injected metadata | Step 8 query protocol | query 不得携带 write idempotency 或触发写事务 |
| `TraceId` / `core_trace_id` | trace record、outbox record、operation context、API/worker/job entry、stored result | core-contracts `TraceId` | `CommandMetadata.request.trace_id`、`QueryMetadata.request.trace_id`、event envelope traceparent、job metadata | Step 8 metadata / event / job protocol | Governance 不得定义额外 trace context wrapper;不得重新生成替代 upstream trace;不得保存 external trace body |
| `GovernanceOperationName` | operation context、idempotency、stored result、job entry | application helper | Step 8 DTO / Step 9 flow 名称映射 | Step 8 / Step 9 | 不得用 handler path、topic、cron 名称替代 operation identity |
| `GovernanceOperationIdempotencyKey` | command、event、job application context | application helper | command metadata key、event dedup key、job idempotency key | Step 8 / Step 13 | query 不使用;缺失不得进入 write/event/job flow |
| `GovernanceRequestDigest` | idempotency record | application helper | canonical stable payload digest calculator | Step 13 | 不得包含 request id、requested_at、trace id、random id 或 current time |
| `GovernanceApplicationResultRef` | idempotency record、stored result、API/worker/job result | application helper | application id generator + operation name;stored result save path | Step 7 result repository;Step 13 duplicate replay | duplicate 不得重跑 domain transition / job scan |
| `StoredGovernanceOperationResult.surface_ref` | stored result shell | application helper wrapping `ExternalSourceRef` | command result store / consumer receipt store / job report store | Step 7 / Step 13 | shell 不等于读取闭环;必须定义 save/get/missing result behavior |
| `source_cursor` | truth snapshot/change、view state、trace、outbox、dashboard、report、projection worker | `GovernanceTruthCursor` | command accepted path: Step 7 `GovernanceUnitOfWork.assign_truth_change_cursor()` after truth save in same UoW;read/job path: committed truth scan、trace cursor、projection state、job input | Step 7 UoW helper/read ports;Step 11 cursor ordering | cursor 不得当 optimistic version、page cursor、timestamp、idempotency digest 或 lock token |
| `expected_version` / version 字段 | 本 Step 不在 object 中新增 optimistic version | Step 11 storage version / core version | request expected_version 或 repository get_with_version | Step 11 / Step 13 | 不得从 cursor、updated_at、ref string 推导 optimistic version |
| `SourceDigest` / summary digest | evidence / source / snapshot helpers | `SourceDigest` shared newtype | upstream safe summary / resolver digest | Step 8 / Step 14 | 不得私自固定 hash 算法;不得保存 source body |
| `ReferenceResolutionState` | snapshots、context refs、runtime signal、refresh/report surface | `contracts::refs` shared helper | consumer / refresh job / resolver outcome | Step 7 reference repository;Step 9 refresh flow;Step 11 persistence | stale/unresolved/unavailable 不得被 query 自动修复 |
| `GovernanceVisibilityMarker` | view surface、read policy、API/query result、visibility decision | `contracts::refs` shared marker | `ReadVisibilityPolicy.evaluate_*` / query assembler | Step 8 query response;Step 9 query flow | denied 不得只抛普通 error;not visible 不得泄露 body |
| `GovernanceFreshnessMarker` | query/view surface | `contracts::refs` shared marker | projection state / query assembler | Step 8 query response;Step 9 query flow | freshness 不得触发 query 写 rebuild |
| `GovernanceDegradedMarker` | query/view/API result/visibility decision | `contracts::refs` shared marker | projection/reference/trace/adapter availability | Step 8 query response;Step 12 error recovery | degraded 不得静默吞掉,也不得改 truth |
| `GovernanceOutboxRef` / `event_kind` / `subject_ref` | outbox record、publisher state、job report | `contracts::refs` + domain outbox object | accepted `GovernanceTruthChange` + same transaction trace | Step 8 outbound event;Step 9 command flow;Step 11 persistence | outbox 不得从 current truth 重新构造 payload |
| `payload_snapshot_ref` 等 outbox payload surface | 尚未在 Step 6 object 中展开 | Step 8 event payload / Step 11 outbox persistence | accepted transaction 内保存的 event payload snapshot | Step 8 / Step 11 | publisher 不得绕过 stored snapshot 回查 current truth 临时造 payload |
| `GovernanceJobRunId` | job report、operation context、job entry/result | contracts job helper | job metadata / runner input | Step 8 jobs DTO | run id 不得替代 application result id |
| `GovernanceJobIdempotencyKey` | job report、job assembly、job entry | contracts job helper | job metadata | Step 8 jobs DTO / Step 13 | duplicate job 不得重新运行扫描生成新 report |
| `GovernanceJobReport` | job report assembly、job run result | contracts helper | `GovernanceJobReportAssembly.finish(...)` 或 stored report load | Step 8 job response;Step 13 stored report | report 不得修复 truth 或保存 external body |
| `GovernanceHandoffMarkerRef` / `HandoffPackageRef` / `HandoffReceiptRef` | handoff marker、handoff adapter state、job report | contracts helper | handoff/export adapter result | Step 8 jobs / Step 9 handoff flow | package / receipt body 不进入 Governance |
| `GovernanceInfraConfigRef` / `GovernanceAdapterConfigRef` / `GovernanceStoreConfigRef` | infra runtime config、builder、adapter state | infra-local helper | config loader / validator output | Step 14 config binding | 不得保存 raw config、secret、URL、topic、cron、retry 数字 |
| `GovernanceAdapterAvailabilityMarker` | infra builder、store/resolver/publisher/handoff state | infra object | adapter factory / health / config validation | Step 14 / Step 12 | unavailable/degraded 不得改变 domain invariant |
| `GovernanceApiValidationIssueRef` / `GovernanceWorkerValidationIssueRef` / `GovernanceJobValidationIssueRef` | api/worker/jobs result | entry-local helper | pre-application validation / redacted error mapping | Step 12 error model / Step 16 tests | 不得保存 request body、payload body、stack trace、secret |
| `GovernancePageRequest` | query entry、job entry | contracts query helper | QueryMetadata / request DTO / job input | Step 8 / Step 14 | page limit 不得硬编码在 Step 6;query/job 不得用 page cursor 当 version |
| `GovernanceScopeRef` | policy、dashboard、report、job entry | contracts shared ref | request / context subject / resolver summary / truth snapshot | Step 7 scope relation / Step 8 DTO | 不得自造 Project / Workspace / Global scope enum |

| 审计结论 | 说明 |
|---|---|
| 高复用字段均有归属和来源 | Step 6 对象中反复出现的 id/ref/actor/metadata/trace/cursor/marker/result/config 字段已明确来源 |
| 仍需后续 Step 闭合读取面 | port、repository、protocol DTO、persistence schema、idempotency replay 和 config 细节仍归 Step 7/8/11/13/14 |
| 实现侧不得补 schema | 若 Step 7+ 未给出读取面、version 来源或 result surface,实现必须回报设计缺口 |

#### 17.2 对象组字段来源审计

本节按对象组审计 Step 6 已定义对象的字段来源。审计粒度不是逐字段重复对象卡片,而是确认每组对象是否具备稳定的创建输入、读取来源、派生边界和后续 Step 闭合点。若后续 Step 未补齐本表标出的 port、DTO、persistence、idempotency 或 config 读取面,实现侧必须暂停回报,不得在代码里临时新增字段或接口。

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| `contracts` shared refs / states / markers | typed id/ref、state enum、reason、marker、cursor、helper set | 所有 public surface 可引用的二级类型已落入 `contracts::refs`;opaque id/ref 只表达 identity,enum 只表达有限状态或原因,helper set 只表达 ordered unique refs | Step 8 DTO body、Step 10 状态矩阵、Step 12 error/reason 映射、Step 16 fixture | public DTO 或 domain 字段引用了未在 `contracts` / core-contracts 闭合的类型;enum variant 缺 Rustdoc、来源或去向 |
| Governance context / input truth | `GovernanceContext`、`GovernanceInput` | `context_id`、`input_id` 来自 id generator;subject/source/evidence refs 来自 command 或 resolver summary;state/reason 来自 transition method;actor/trace 来自 metadata | Step 7 resolver / repository 读取面;Step 8 intake command DTO;Step 9 context/input accepted flow;Step 11 version 与 persistence | flow 需要 external body、work/process正文、actor profile正文或未定义 source summary 才能构造 truth |
| gate / decision truth | `Gate`、`GovernanceDecision` | gate/decision id/ref 来自 id generator;context/input/ref relation 来自已提交 truth;state/outcome/reason 来自 domain transition;decision trace 来自 accepted flow | Step 7 active gate / requirement / decision repository;Step 8 decide / reopen / override command;Step 9 decision flow;Step 10 gate/decision state matrix | 无法从 request + repository load 定位 gate/decision;decision outcome、gate requirement 或 visibility reason 未闭合 |
| approval / responsibility truth | `ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain` | responsibility/requirement/chain id 来自 id generator;approver refs、threshold、vote refs、delegation rule refs 来自 command、policy snapshot 或 resolver summary;state 来自 vote / assignment transition | Step 7 approver expansion、actor capability、delegation and vote repository;Step 8 approval command;Step 9 approval flow;Step 13 duplicate vote guard | 需要从 actor name、team body、external org body 推导 approver refs;threshold 或 delegation rule 没有正式 schema |
| policy / shared rule / conflict truth | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord` | policy fact/rule/conflict id 来自 id generator;scope、priority、effective-at、source refs 来自 policy intake/resolver;conflict state/reason 来自 policy guard | Step 7 policy source resolver、scope relation、effective fact repository;Step 8 policy import / evaluate DTO;Step 9 policy evaluation flow;Step 10 conflict matrix | 需要保存 policy 正文或临时解析 external GRC rule body;scope 继承、priority 或 conflict resolution 无读取面 |
| control / compliance truth | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion` | control/review/conclusion id 来自 id generator;control/source/evidence refs 来自 command或resolver;state/conclusion/reason 来自 compliance policy;actor/trace 来自 flow metadata | Step 7 evidence summary、control catalog summary、review repository;Step 8 assessment command;Step 9 compliance flow;Step 10 conclusion matrix | 需要读取 ISO/control正文、evidence body 或 GRC adapter body 才能判断 state;review conclusion enum 未闭合 |
| nonconformity / corrective truth | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` | nc/action/verification id 来自 id generator;severity/reason/source/evidence refs 来自 accepted command/resolver;closure state 来自 `NonconformityClosurePolicy` | Step 7 nc/action repository、evidence resolver、assignee/capability port;Step 8 corrective command;Step 9 closure / verification flow;Step 10 nc/action state matrix | verification 需要 evidence body;closure reason、failure reason、assignee responsibility 或 due date source 未闭合 |
| projection / reference local state | `DerivedGovernanceViewState`、external snapshot / mirror、reference state helpers | view/ref/snapshot identity 来自 typed ref;freshness/degraded/visibility from projection/reference policy;source_cursor from committed truth cursor;reference state from consumer/refresh outcome | Step 7 projection repository、affected view lookup、reference snapshot repository;Step 9 query/consumer/refresh flow;Step 11 projection identity and stale persistence | affected views 无正式读取面;reference refresh 成功/失败缺 version 来源;query 试图直接修复 stale/unresolved state |
| trace / audit / history | `GovernanceTraceRecord`、`GovernanceAuditTrail`、history record group | trace/audit/history id 来自 id generator;accepted subject refs 来自 Step 7 canonical mapper;change/source_cursor/actor/core_trace_id 来自 accepted truth transition;history kind 来自 finite change enum | Step 7 trace/audit repository;Step 8 trace/query DTO;Step 9 append timing;Step 11 append-only persistence | trace record factory 缺 id、subject 或 core_trace_id;consumer marker 没有正式 trace subject;history kind 未定义;trace/audit/outbox subject key 不同源 |
| outbox / outbound publication | `GovernanceOutboxRecord`、publisher adapter state、outbox loop entry | outbox id 来自 id generator;event kind/subject/truth change/trace/visibility 来自 accepted transaction;publication state 来自 publisher result | Step 8 outbound event envelope/payload;Step 9 outbox append/publish flow;Step 11 payload snapshot persistence;Step 13 retry/idempotency | outbox record 无法回查 payload snapshot;publisher 从 current truth 现查现造 payload;expected version 无来源 |
| public view / report DTO | dashboard、decision summary、policy effective、control coverage、nc status、reconciliation report | view/report ref、surface marker、freshness/degraded/visibility/source_cursor 来自 projection/query assembly;body 字段只使用 refs、summaries、state markers | Step 8 query response DTO;Step 9 query assembly;Step 11 projection storage;Step 16 query fixture | view/report 需要 domain-only type、external body、policy/control正文;NotVisible 缺 marker surface |
| application helper objects | facade、operation context、idempotency record、stored result、visibility decision、job report assembly | operation name/key/digest/result ref 来自 command/event/job metadata and canonical digest;visibility decision 来自 read policy;stored result shell only stores surface refs | Step 7 result/idempotency repository;Step 8 command/event/job metadata;Step 13 duplicate replay;Step 12 error mapping | duplicate path 无 stored result 读取面;digest 算法字段不稳定;visibility denied 只能抛 error 无 marker |
| infra / api / worker / jobs entry objects | runtime config/builder/store/adapter state、API entry、worker entry、job entry/result | entry id/ref 来自 route/topic/job metadata;config refs 来自 config loader;availability marker from adapter health;validation issue refs from redacted validation | Step 8 protocol/job DTO;Step 12 error/redaction;Step 14 config binding;Step 15 telemetry;Step 16 automation tests | entry object 保存 raw config、secret、request body、payload body;worker/job 直接访问 repository 绕过 application service |

| 审计结论 | 说明 |
|---|---|
| 对象组字段来源可分层承接 | Step 6 已把 identity、state、reason、marker、cursor、trace、result、config ref 等字段放到可落码归属中 |
| 后续 Step 不是可选细化 | 上表中 Step 7/8/9/10/11/13/14 标出的读取面、协议体、状态矩阵、持久化和幂等 replay 都是正式闭口的一部分 |
| blocker 条件已提前显式化 | 任何对象组只要需要 external body、domain-only DTO、临时 view identity、无来源 version、无 stored result surface 或无 trace subject,实现必须暂停 |

#### 17.3 状态闭环表

本节审计 Step 6 已定义的状态类型是否具备有限变体、创建入口、迁移 owner、终态语义和后续 Step 10 矩阵承接点。状态闭环表不替代 Step 10;它只说明 Step 6 对象契约已经给出的状态来源和实现侧不能自行扩展的边界。若 Step 10 未覆盖本表状态迁移,实现侧不得凭对象方法名推断额外迁移。

| 状态类型 | 所属对象 / surface | 初始或来源状态 | 非终态 / 可变状态 | 终态或 query-scoped 状态 | 迁移 owner | Step 10 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|---|---|---|
| `GovernanceContextState` | `GovernanceContext` | `Draft` from `from_subject(...)` | `Draft`、`Ready`、`PendingReference` | `Invalid`、`Closed` | domain transition + application flow | Draft/Ready/PendingReference 到 terminal 的 allowed transition and reason | context 进入主线前无法证明 `Ready`;PendingReference 无正式 resolver / evidence 来源 |
| `GovernanceInputState` | `GovernanceInput` | `Received` from `receive(...)` | `Received`、`Accepted`、`PendingEvidence` | `Rejected`、`Superseded` | domain transition + intake flow | evidence pending、accept、reject、supersede matrix | Accepted 被实现成自动创建 decision/gate;PendingEvidence 没有 evidence summary ref |
| `GateState` | `Gate` | `Open` from `open(...)` | `Open`、`PendingDecision` | `Decided`、`Expired`、`Cancelled` | domain transition + decision flow | Open->PendingDecision->Decided and expiration/cancel paths | Decided 缺 `decision_ref`;PendingDecision 无 responsibility / requirement 读取面 |
| `GovernanceDecisionState` | `GovernanceDecision` | `Proposed` from `propose(...)` | `Proposed`、finalized states before supersede/revoke | `Superseded`、`Revoked`;finalized outcome states are stable but may be superseded/revoked | domain transition + formal decision flow | Proposed outcome, supersede, revoke and basis requirements | Approved/Rejected/Waived 缺 outcome/basis/reason;revoke/supersede 无正式 reason |
| `ApprovalResponsibilityState` | `ApprovalResponsibility` | `Required` from `require(...)` | `Required`、`Assigned`、`Accepted`、`Voted`、`Delegated` | `Released` | domain transition + approval flow | assignment、vote、delegate、release and duplicate vote guard | actor capability、delegation rule、threshold 或 vote source 缺正式读取面 |
| `ResponsibilityChainState` | `ResponsibilityChain` | `Open` from `start_for_context(...)` | `Open`、`Satisfied`、`Escalated`、`Blocked` | `Closed` | domain transition + approval / escalation flow | chain satisfaction、block、escalate、close conditions | chain satisfied 需要临时扫描 actor body 或 ad hoc threshold |
| `PolicyEffectiveState` | `PolicyEffectiveFact` | `Proposed` from `propose(...)` | `Proposed`、`Effective`、`Suspended` | `Superseded`、`Retired` | domain transition + policy flow | activation, suspension, replacement and retirement reasons | Effective 由 runtime cache 产生;policy snapshot/source version 无正式来源 |
| `SharedRuleSetState` | `SharedRuleSet` | `Draft` from `draft(...)` | `Draft`、`Active`、`Deprecated` | `Retired` | domain transition + shared rules flow | activate/deprecate/retire and low-scope override prohibition | Active shared rules 被 config 或 lower scope 静默削弱 |
| `PolicyConflictState` | `PolicyConflictRecord` | `Detected` from `detect(...)` | `Detected`、`PendingDecision` | `Resolved`、`Waived`、`Invalid` | domain transition + conflict handling flow | conflict detection, pending decision, resolve/waive/invalid with formal basis | Waived 无 formal decision;conflict handling 直接改写 policy truth |
| `ControlApplicabilityState` | `ControlApplicability` | `PendingAssessment` from `assess(...)` | `PendingAssessment`;assessed states can be superseded | `Superseded`;`Applicable` / `NotApplicable` / `Excluded` are stable assessment conclusions | domain transition + control assessment flow | applicable/not-applicable/excluded/supersede and evidence/reason requirements | Applicable/Excluded 缺 evidence basis;NotApplicable 与 Excluded 混用 |
| `ControlReviewState` | `ControlReview` | `Planned` from `plan(...)` | `Planned`、`InReview` | `Passed`、`Failed`、`Waived`、`Superseded` | domain transition + review flow | review start, pass/fail/waive/supersede and waiver basis | Failed 自动创建 nonconformity;Waived 缺 decision ref |
| `ComplianceConclusionState` | `AIIAConclusion` / `SoAConclusion` | `Drafted` | `Drafted`、`InReview`;finalized states can be superseded/revoked | `Superseded`、`Revoked`;`Approved` / `Rejected` are stable conclusion outcomes | domain transition + compliance conclusion flow | submit/approve/reject/supersede/revoke and SoA coverage rule | Approved 保存 artifact正文;SoA approve 缺 `ControlCoverageRef` |
| `NonconformityState` | `NonconformityRecord` | `Raised` from `raise(...)` | `Raised`、`CauseConfirmed`、`Correcting`、`ReadyForVerification`、`Closed` before reopen | `Rejected`;`Closed` can reopen by explicit transition | domain transition + corrective loop flow | raise/cause/correct/verify/close/reopen/reject with verification gate | Closed 未基于 `VerificationState::Passed`;external defect state 直接覆盖 nc state |
| `CorrectiveActionState` | `CorrectiveAction` | `Planned` from `plan(...)` | `Planned`、`InProgress` | `Completed`、`Cancelled`、`Failed` | domain transition + corrective action flow | start/complete/cancel/fail and reason/evidence requirements | Completed 被当作 nonconformity closed;WorkItem state 替代 corrective state |
| `VerificationState` | `VerificationResult` | `Passed` / `Failed` / `Inconclusive` from verification evidence | 不独立迁移 | result conclusion;`Passed` may support nc close | verification result factory + nc closure policy | close allowed only for Passed;failed/inconclusive rework path | Failed/Inconclusive 被用作关闭依据;verification 需要 evidence body |
| `DerivedGovernanceViewFreshnessState` | `DerivedGovernanceViewState` | `Fresh` from successful build or initialized current view | `Fresh`、`Stale`、`Rebuilding`、`Failed`、`Unavailable` | maintenance state,not core truth terminal | projection repository + maintenance job | mark stale/rebuilding/fresh/failed/unavailable and fallback query behavior | query 隐式修复 stale;affected view identity 无正式来源 |
| `ReferenceResolutionKind` | `ReferenceResolutionState` | `Unresolved` from first tracking or current resolver outcome | `Resolved`、`Unresolved`、`Stale`、`Unavailable` | `Invalid` unless formally replaced | reference resolver / consumer / refresh job | resolved/stale/unavailable/invalid transitions and version retention | expected version、source version 或 failure reason 无正式读取面 |
| `OutboxPublicationState` | `GovernanceOutboxRecord` | `Pending` from accepted truth change | `Pending`、`Failed` | `Published`、`DeadLettered` | outbox publisher flow | publish/fail/retry/dead-letter and expected version requirements | publisher 从 current truth 造 payload;retry/mark state 缺 version |
| `ReconciliationReportState` | `GovernanceReconciliationReport` | `Generated` or `Failed` from reconciliation job outcome | `Generated` may be superseded | `Failed`、`Superseded` | reconciliation job / report assembly | report generation/failure/supersede and no-repair rule | report 直接修复 truth/projection/outbox;failed report 保存外部正文 |
| `EvidenceVerifiedState` | evidence summary helper | external evidence verification surface | verification marker only | helper state,not governance truth terminal | evidence resolver / compliance flow | acceptable evidence states per command/query use | evidence verification state 被当成本仓 artifact truth |
| `GovernanceHandoffState` | `GovernanceHandoffMarker` | `Prepared` or `Failed` from handoff adapter | `Prepared` | `Delivered`、`Failed` | handoff/export job + adapter result | prepare/deliver/fail and package/receipt/failure field requirements | failed handoff 静默丢弃;package/receipt body 进入 Governance |
| `GovernanceJobReportState` | `GovernanceJobReport` | `Completed` / `PartiallyCompleted` / `Failed` from job assembly | report final summary state | report final summary state | job report assembly | item counts, failed refs, duplicate replay report surface | duplicate job 重跑扫描;failed refs 类型覆盖不了 job subject |
| `GovernanceIdempotencyState` | `GovernanceIdempotencyRecord` | `Reserved` from reserve | `Reserved` | `Completed`、`Conflict` | idempotency repository + application service | reserve/complete/conflict and stored result lookup | duplicate path 无 stored result;digest 包含 volatile fields |
| `GovernanceAdapterAvailabilityState` | infra adapter marker | config / health result | `Enabled`、`DisabledByConfig`、`Degraded`、`Unavailable` | runtime availability marker,not domain terminal | infra builder / adapter health | config binding, degraded propagation, unavailable error mapping | availability 改变 domain invariant;raw config/secret 被保存 |
| `GovernanceRuntimeBuildState` | `GovernanceRuntimeBuilderState` | `NotStarted` | `NotStarted`、`ValidatingConfig`、`Assembling` | `Ready`、`Failed` | infra runtime builder | build lifecycle and redacted validation issue propagation | builder state 保存 adapter instance body 或 secret |
| `GovernanceApiHandlerDisposition` | API handler result | handler pre/post application outcome | `Accepted`、`Rejected`、`NotVisible`、`Degraded` | entry result disposition,not persisted truth | API handler | transport mapping, redacted error, not-visible/degraded response | NotVisible 只抛 error 无 marker;request body 进入 issue |
| `GovernanceWorkerEntryState` | worker entry | `Registered` | `Registered`、`Running`、`Delayed`、`Stopped`、`Failed` | runtime entry state,not governance truth | worker runtime | source availability/backoff/stop/fail mapping | worker 直接写 repository 或修复 core truth |
| `GovernanceWorkerDisposition` | worker item result | item handling result | `Accepted`、`Duplicate`、`Delayed`、`Rejected`、`UnsupportedVersion` | item result disposition | worker + application consumer | dedup, unsupported version, retry/dead-letter behavior | unsupported version 被 accepted;duplicate 重放缺 stored receipt |
| `GovernanceJobEntryState` | jobs entry | `Registered` | `Registered`、`Running`、`Delayed`、`Completed`、`Failed` | runtime entry state,not governance truth | jobs runner | schedule/backoff/run completion/fail mapping | job entry state 被当成 job report or business truth |
| `GovernanceJobRunDisposition` | job run result | runner outcome | `Completed`、`PartiallyCompleted`、`Failed`、`DuplicateReplayed`、`Rejected` | run result disposition | jobs runner + application operation | duplicate replay, rejected metadata, partial failure report | duplicate replay 无 stored report;Rejected 仍进入 application mutation |

| 状态闭环结论 | 说明 |
|---|---|
| domain truth 状态已有创建入口和 owner | 关键 truth object 的初始状态、终态和迁移 owner 已在 Step 6 对象函数中出现,Step 10 需要逐项矩阵化 |
| read / maintenance 状态不得反写真相 | view freshness、reference resolution、outbox publication、handoff、job/report 状态只影响 read surface、maintenance、publication 和 operations report |
| entry disposition 不等于 domain state | API / worker / jobs 的 disposition 只用于入口结果、transport mapping 或 runtime lifecycle,不得进入 Governance core truth |
| Step 10 是正式最终闭口 | 本节仅是状态审计;若 Step 10 状态矩阵与本节冲突,必须先修 Step 10/Step 19,不能让实现侧选边 |

### 18. 回填草稿

本节不是正式 `03-详细设计.md` 的直接写入,而是 Step 19 装配时的回填草稿和摘录边界。正式文档必须引用本 Step 中间产物,并保持对象契约、字段表、函数签名、状态表、闭环审计与后续 Step 的一致性。若 Step 7~18 对 port、protocol、flow、state matrix、persistence、error、idempotency、config、observability 或 test cut 做出更精确约束,Step 19 必须回到本节映射修正文案,不得让正式 `03` 与中间产物分叉。

#### 18.1 正式 `03` 建议回填章节映射

| 正式章节 | 回填来源 | 回填内容 | 装配注意 |
|---|---|---|---|
| §5 模块实现契约 / contracts | §10、§15.1~§15.6、§17 | shared id/ref/state/reason/marker、public view/report object contracts、字段和状态闭环 | public DTO 只能引用 `contracts` / core-contracts;不得引用 domain-only object |
| §5 模块实现契约 / domain | §11~§14、§17 | context/input/gate/decision/approval/policy/control/nonconformity/projection/reference/trace/outbox/history/policy guard object contracts | domain object 不引用 repository、API DTO、adapter state 或 public view body |
| §5 模块实现契约 / application | §15.7~§15.8、§17 | application facade、operation context、idempotency、stored result、read visibility decision、job report assembly | 只描述 helper object 和 service assembly surface;Step 7 才定义 trait / port |
| §5 模块实现契约 / infra | §16.1~§16.2、§17 | runtime config ref、builder state、adapter availability、store/publisher/resolver/handoff adapter state | 不写 raw config、secret、topic、URL、retry 数字或 adapter instance body |
| §5 模块实现契约 / api | §16.3、§17 | command/query entry、handler result、route registry object contract | 保持 transport-neutral;HTTP/RPC path、auth、serialization 细节留给 Step 8 / Step 14 |
| §5 模块实现契约 / worker | §16.4、§17 | inbound consumer、outbox publisher loop、projection worker entry and item result | worker 只调用 application service;不直接访问 repository 或 domain transition |
| §5 模块实现契约 / jobs | §16.5、§17 | operations job entry、run result、runner registry object contract | job 只维护 outbox/projection/reference/reconciliation/handoff/export,不修复 core truth |
| §6 全局对象索引 | §6、§10~§16 | 七模块对象清单、对象归属、主要职责和引用关系 | 索引必须覆盖 Step 6 所有对象;不得只列 HLD 主表对象 |
| §7 字段与状态闭环索引 | §17.1~§17.3 | 高复用字段来源、对象组字段来源、状态闭环 | 若正式 `03` 篇幅受控,可摘要本节,但必须保留 blocker 条件和后续 Step 闭合点 |

#### 18.2 正式 `03` 可摘录摘要

| 摘录主题 | 可进入正式文档的摘要口径 | 不应进入正式文档的内容 |
|---|---|---|
| 对象定义粒度 | 每个 public struct / enum / helper 必须能被实现者按字段、函数、状态转写 | 不复制旧 `GovernanceRequest / Exception / RiskAcceptance` 教学主线 |
| 数据归属 | Governance 只拥有本仓 context、gate、decision、policy fact、control applicability、compliance conclusion、nonconformity、trace、outbox、projection 和 maintenance state | 不保存 process/work/artifact/runtime/observability/archive/external GRC 正文 |
| ref / snapshot / marker | 跨仓引用必须使用 body-free typed ref、safe summary、snapshot ref、cursor、digest、visibility/freshness/degraded marker | 不使用裸字符串、title、route path、external body、domain-only DTO |
| domain transition | domain object 只做状态迁移和 invariant 校验;id、time、trace、history、outbox、repository transaction 由 application/infra/flow 串联 | domain 自行生成 id、访问 repository、发布事件或写 projection |
| view / report / projection | public view/report 只读取 truth / projection / snapshot,并显式暴露 visibility、freshness、degraded 和 source cursor | query 触发 rebuild、report 修复 truth、projection 反写 core object |
| idempotency / result | command/event/job 需要 operation name、idempotency key、stable digest、application result ref 和 stored result surface | query 进入 write idempotency;duplicate path 重跑 domain transition 或 job scan |
| outbox / handoff | outbox、handoff、export 只保存 payload snapshot ref、package/receipt ref、marker 和 report refs | publisher 现查 current truth 造 payload;handoff 保存外部 package body |

#### 18.3 Step 19 装配规则

| 规则 | 说明 |
|---|---|
| 先装配索引,再装配对象卡片 | 正式 `03` 应先给七模块对象索引,再按模块展开核心对象卡片,降低实现侧查找成本 |
| 保留字段来源 | 正式摘要可以压缩解释性文字,但字段表中的类型、作用、约束 / 来源不得删除 |
| 保留函数签名 | public factory / transition / helper method 签名必须按本 Step 保留,后续 Step 若改签名必须回写本 Step 或在 Step 19 标明替代来源 |
| 保留状态 variant | state enum 变体、Rustdoc、允许来源和允许去向必须能回指 §10 与 §17.3 |
| 保留禁止事项 | 每个对象组的“不拥有外部 truth”“不保存正文”“不反写真相”“不直接访问 repository”等红线必须进入正式文档 |
| 标注后续闭合点 | port、DTO、flow、state matrix、persistence、idempotency、config 等未在 Step 6 闭合的项必须标注由 Step 7+ 闭合 |
| 不提前写正式文档 | 在 Step 19 之前不得直接修改 `projects/L1-governance/03-详细设计.md` |

#### 18.4 与后续 Step 的承接清单

| 后续 Step | 必须承接的 Step 6 内容 | 承接失败时的设计风险 |
|---|---|---|
| Step 7 Trait / Port / Adapter | id generator、repository get/list/save/append、resolver、publisher、handoff、projection affected view、stored result / idempotency port | 字段来源存在,但读取面或写入面无法 1:1 落码 |
| Step 8 Protocol | command/query/event/job DTO 引用的 typed refs、metadata、visibility/freshness/degraded marker、result/report surface | public DTO 引用未闭合类型或 domain-only type |
| Step 9 Function Flow | object factory / transition 调用顺序、trace/history/outbox/stale marker 构造时机 | record 字段在调用时机上拿不到,或 domain 返回值与 flow 冲突 |
| Step 10 State Matrix | §10 state enum 与 §17.3 状态闭环 | 状态迁移靠实现猜测,终态/可重开状态不一致 |
| Step 11 Persistence | identity、version、cursor、payload snapshot、append-only trace/history/outbox、projection state | optimistic version、payload lookup 或 append-only ordering 无来源 |
| Step 12 Error / Recovery | validation issue ref、reason、degraded/unavailable/not-visible surface、dead-letter and retry behavior | error 只能抛普通异常,无法映射 formal marker |
| Step 13 Concurrency / Idempotency | operation key/digest/result ref、stored result surface、duplicate replay、job report replay | duplicate 重跑 mutation 或找不到 stored result |
| Step 14 Config / External Binding | config refs、adapter availability、source resolver、handoff target、topic/schema version | raw config 或 secret 进入对象;adapter availability 无正式来源 |
| Step 15 Observability / Audit | core trace id、audit trail、history record、handoff marker、redacted issue refs | trace subject 或 audit source 无闭口 |
| Step 16 Test Cuts | object factory tests、state transition tests、field closure tests、no external body tests | 实现测试只覆盖 happy path,无法暴露闭环缺口 |

### 19. 待确认事项

本节列出 Step 6 完成时仍需跟踪的事项。这里的“待确认”不是说 Step 6 对象契约无法继续,而是说明哪些点必须在后续 Step 中正式闭合。若后续 Step 没有给出字段、读取面、协议体、流程、状态矩阵或持久化来源,实现侧必须暂停并回报设计缺口。

#### 19.1 Step 6 内已关闭事项

| 事项 | 关闭结论 | 关闭位置 |
|---|---|---|
| public DTO 二级类型归属 | public view/report/event/job 可能引用的 typed id/ref/state/reason/marker 已归入 `contracts` 或 core-contracts | §10、§15、§17 |
| domain truth 与 external truth 边界 | domain object 只保存 body-free ref、snapshot ref、summary ref、cursor、digest、marker,不保存相邻仓正文 | §11~§14、§17 |
| state enum 有限变体 | HLD 已给稳定状态的 enum 均已写 Rustdoc、作用、允许来源、允许去向 | §10.10~§10.18、§17.3 |
| object factory id 来源 | domain / trace / audit / outbox / history / marker / result / job object 均要求 application / runner id generator 显式传入 | §11~§17 |
| read visibility marker 口径 | `ReadVisibilityPolicy` 和 query/view surface 必须返回 visibility marker,不能只抛普通 denied error | §14.12、§15、§17 |
| projection/report 不反写真相 | view/report/reconciliation/export/handoff/job report 均明确只能派生或报告,不得修改 core truth | §13~§17 |
| worker/jobs 不绕过 application | entry object 只能调用 application service,不得直接访问 domain/repository | §16.4~§16.5、§17 |

#### 19.2 后续 Step 必须闭合事项

| 编号 | 待闭合事项 | 需要闭合的 Step | Step 6 已提供的输入 | 若不闭合的实现 blocker |
|---|---|---|---|---|
| GVN-S6-OPEN-001 | `IdGeneratorPort` 必须覆盖所有 Step 6 object id,包括 context/input/gate/decision/responsibility/policy/control/nonconformity/trace/audit/outbox/history/handoff/result/job marker | Step 7 | 所有 `*_id` 字段和 factory 入参 | domain 或 handler 只能拼接 id,违反 id 来源闭环 |
| GVN-S6-OPEN-002 | repository 读取面必须返回构造 transition 所需对象与 version,尤其 active gate、responsibility chain、policy facts、control reviews、nonconformity/corrective、projection/reference/outbox/result | Step 7 / Step 11 | 对象字段表和 §17 字段来源 | expected_version、state transition、record append 或 duplicate replay 无正式来源 |
| GVN-S6-OPEN-003 | resolver port 必须只返回 body-free summary / snapshot / source version / digest,并覆盖 process/work/artifact/runtime/observability/archive/external GRC 引用 | Step 7 / Step 14 | `GovernanceSourceRef`、`ExternalGovernanceReferenceRef`、snapshot helpers | flow 需要 external body 才能评估,违反数据归属 |
| GVN-S6-OPEN-004 | command/query/event/job DTO 必须引用 Step 6 shared types,并补齐 metadata、idempotency key、visibility/freshness/degraded marker、job report/result surface | Step 8 | §10 shared types、§15 view/report、§16 entry object | public protocol 引用未定义类型或 domain-only object |
| GVN-S6-OPEN-005 | function flow 必须给出 object factory / transition / trace / history / outbox / stale marker 的调用顺序和事务边界 | Step 9 / Step 11 | domain methods、record factories、outbox object | record 要求字段在调用时机不可得,或 domain 返回值与 flow 冲突 |
| GVN-S6-OPEN-006 | state matrix 必须逐项覆盖 §17.3 状态迁移、终态、可重开状态和 forbidden transition | Step 10 | §10 enum variant、§17.3 状态闭环 | 实现只能从函数名猜迁移,终态语义不一致 |
| GVN-S6-OPEN-007 | outbox payload snapshot 和 publisher lookup 必须正式闭合,包括 event kind、subject、truth change、core trace id、visibility marker、payload snapshot ref、expected version | Step 8 / Step 9 / Step 11 / Step 13 | `GovernanceOutboxRecord`、outbox state、字段闭环 | publisher 现查 current truth 造 payload,或 mark_published 无 version |
| GVN-S6-OPEN-008 | affected derived view lookup 必须正式闭合,覆盖 command accepted、external consumer、reference refresh、policy/control/nonconformity changes | Step 7 / Step 9 / Step 11 | `DerivedGovernanceViewState`、freshness state、view refs | 实现临时拼 view identity 或漏 mark stale |
| GVN-S6-OPEN-009 | stored result surface 必须正式闭合 command result、consumer receipt、job report 的 save/get/missing behavior | Step 7 / Step 8 / Step 13 | `GovernanceIdempotencyRecord`、`StoredGovernanceOperationResult`、job run result | duplicate replay 找不到 result,只能重跑 mutation/job scan |
| GVN-S6-OPEN-010 | visibility denied、degraded、unavailable、unsupported version、dead-letter、retry 的 error/recovery 映射必须正式闭合 | Step 12 / Step 13 / Step 16 | markers、entry dispositions、outbox/job states | error 只能是普通异常,无法构造 NotVisible/degraded/dead-letter surface |
| GVN-S6-OPEN-011 | config binding 必须定义 config refs 与 adapter slots 的来源、校验和 redaction,但不得把 raw config/secret 写进 object | Step 14 | infra config refs、availability marker、builder state | infra object 保存 secret / URL / topic / cron / retry 数字 |
| GVN-S6-OPEN-012 | observability/audit 必须定义 trace subject、audit source、history kind、handoff target、redacted issue refs 的正式映射 | Step 15 | trace/audit/history/handoff object | consumer marker 或 job report 无 trace subject / audit source |
| GVN-S6-OPEN-013 | test cut 必须覆盖 object factory、state transition、field closure、no-external-body、idempotency duplicate、projection stale、outbox publish、visibility denied | Step 16 | Step 6 object and state closure | 实现只测 happy path,无法发现设计闭口缺失 |

#### 19.3 不应在 Step 6 继续展开的事项

| 事项 | 不继续展开原因 | 应由哪个 Step 处理 |
|---|---|---|
| repository trait 具体签名 | Step 6 只定义 object;trait / port 属于 Step 7 | Step 7 |
| command/query/event/job DTO 完整 body | Step 6 只提供 shared type 和 entry object;protocol 属于 Step 8 | Step 8 |
| function-level transaction ordering | Step 6 只定义 transition method 和 record factory;flow 属于 Step 9 | Step 9 |
| exact persistence schema / optimistic version shape | Step 6 只要求 version 有正式来源;schema 属于 Step 11 | Step 11 |
| error enum / API status / retry policy | Step 6 只固定 marker/reason/disposition;错误恢复属于 Step 12/13 | Step 12 / Step 13 |
| config key、topic name、cron、batch、retry 数字 | Step 6 只使用 config ref 和 availability marker;配置绑定属于 Step 14 | Step 14 |
| telemetry event names / metrics labels | Step 6 只固定 trace/audit/handoff object;可观测性属于 Step 15 | Step 15 |
| test case id and fixture matrix | Step 6 只提出测试切口要求;测试矩阵属于 Step 16 | Step 16 |

#### 19.4 当前无 Step 6 阻塞项

| 结论 | 说明 |
|---|---|
| Step 6 对象契约可收尾 | 当前没有必须在 Step 6 内继续补 schema 的对象、字段或状态 |
| 剩余问题均是后续 Step 正式职责 | §19.2 的事项需要被 Step 7~16 逐项承接,不能在 Step 6 抢写 |
| 可以准备进入 Step 7 | 只要 §20 进入条件检查通过,即可启动 trait / port / adapter 契约讨论 |

### 20. 进入下一步条件

本节是 Step 6 到 Step 7 的门禁。Step 7 可以开始的前提不是“对象名字已经列出”,而是 Step 6 已经把对象归属、字段、函数、状态、字段来源和禁止事项收束到后续 trait / port 能承接的粒度。

#### 20.1 Step 6 完成检查

| 检查项 | 结论 | 依据 |
|---|---|---|
| 七模块对象归属已覆盖 | 通过 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 对象均已按 §10~§16 展开 |
| shared public type 已闭合 | 通过 | id/ref/state/reason/marker/cursor/helper set 已在 §10 收敛 |
| domain truth object 已闭合 | 通过 | context/input/gate/decision/responsibility/policy/control/compliance/nonconformity/corrective/projection/reference/trace/outbox/history object 已在 §11~§14 展开 |
| public view/report object 已闭合 | 通过 | dashboard、decision summary、policy effective、control coverage、nonconformity status、reconciliation report 已在 §15 展开 |
| application helper object 已闭合 | 通过 | facade、operation context、idempotency、stored result、visibility decision、job report assembly 已在 §15.7~§15.8 展开 |
| infra/api/worker/jobs entry object 已闭合 | 通过 | runtime config/build/store/adapter、API entry、worker entry、job entry/result 已在 §16 展开 |
| 字段来源审计已完成 | 通过 | 高复用字段和对象组字段来源已在 §17.1~§17.2 审计 |
| 状态闭环审计已完成 | 通过 | domain/read/maintenance/application/entry 状态族已在 §17.3 审计 |
| 待确认事项已分类 | 通过 | Step 6 已关闭事项、后续 Step 必须闭合事项和不应抢写事项已在 §19 分类 |
| 正式 `03-详细设计.md` 未提前修改 | 通过 | Step 19 前只维护 calibration 中间产物 |

#### 20.2 Step 7 必须承接的输入

| Step 7 契约组 | 必须读取的 Step 6 内容 | Step 7 输出要求 |
|---|---|---|
| `IdGeneratorPort` | §17.1 `*_id` 字段族、§19.2 `GVN-S6-OPEN-001` | 覆盖所有 object factory 需要的 generated id,不得遗漏 trace/outbox/history/handoff/result/job marker |
| truth repository ports | §11~§13 domain object 字段和 transition method | 定义 get/list/save/append、versioned read、expected_version、transaction participation |
| resolver ports | source/ref/snapshot helper、`ReferenceResolutionState`、external snapshot / mirror object | 只返回 body-free summary、snapshot ref、source version、digest、resolution state |
| projection ports | `DerivedGovernanceViewState`、public view/report、affected view blocker | 定义 projection identity、mark_stale、replace/read view、affected views lookup |
| trace/audit/history ports | `GovernanceTraceRecord`、`GovernanceAuditTrail`、history record group | 定义 append-only write、subject lookup、trace cursor 和 audit source 读取面 |
| outbox ports | `GovernanceOutboxRecord`、outbox state、payload snapshot blocker | 定义 append、list pending、mark published/failed/dead-letter、payload snapshot lookup and version source |
| idempotency/result ports | `GovernanceIdempotencyRecord`、`StoredGovernanceOperationResult`、job run result | 定义 reserve/complete/conflict、stored command/consumer/job result save/get/missing behavior |
| handoff/export ports | `GovernanceHandoffMarker`、handoff package/receipt refs、job report refs | 定义 prepare/deliver/export result、failure refs、marker persistence boundary |
| config/availability ports | infra config refs、adapter availability state、runtime builder state | 定义 validated config ref source、adapter slot availability、redacted validation issue surface |

#### 20.3 Step 7 启动红线

| 红线 | 说明 |
|---|---|
| 不得在 Step 7 改写 Step 6 对象字段 | 若 port 需要对象没有的字段,先回 Step 6/Step 19 修对象契约,不能在 port 中隐式补字段 |
| 不得让 repository 返回 external body | Step 7 port 只能返回本仓 truth、typed refs、safe summaries、snapshot refs、source versions 和 markers |
| 不得用 cursor 替代 optimistic version | cursor 表示 truth/projection ordering;version 读取面必须由 Step 7 / Step 11 明确 |
| 不得用 list/search 临时拼 projection identity | affected views 必须有正式读取面或正式 helper mapping |
| 不得让 API/worker/jobs 直接依赖 repository | entry modules 只依赖 application service / facade,repository and adapter ports 由 application / infra runtime 承接 |
| 不得把 duplicate replay 写成重新执行 | duplicate command/event/job 必须走 stored result / receipt / report surface |

#### 20.4 进入 Step 7 结论

| 结论 | 说明 |
|---|---|
| Step 6 可以关闭 | 当前对象实现契约已达到可由 Step 7 承接 trait / port / adapter 的粒度 |
| Step 7 可以启动 | 下一份中间产物应创建 `03_ddd_step_07_trait_port_adapter_contracts.md` |
| 后续实现仍需等待 Step 7+ | Step 6 只闭合 object;没有 Step 7 ports、Step 8 protocol、Step 9 flow、Step 11 persistence 和 Step 13 idempotency 时,实现侧仍不能 1:1 落码 |
