# Step 6. 关键对象

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；恢复思考、逐CP结构化、回填和静态自检 done。
- gate_status=pass；gate_reason=逐CP恢复补审与跨对象审计完成；next_allowed_action=读取Step7输入；formal_fill_allowed=step14_only。
- source_files：Step 5；01 §9；闭环标准；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先共享词汇/筛选，再CP1~7独立小节逐个校准→写卡→自检，最后跨对象与flow/state审计；16对象保留同文件，不创建原计划的七个附录。
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 5；01 §9；闭环标准；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1~5. 从七CP候选池正式化16对象，区分局部聚合、派生投影、immutable引用语境、操作记录。6~11. 每对象按功能补有类型字段、成员/工厂与状态；上游值仅作为经核验输入槽位。12~14. Application service/port/DTO不当领域对象，完整定义留03。15~16. CP逐个停审，最后反查flow/state对象。

## 4. 当前文档问题诊断

只定义WorkspaceView会遗漏source coverage、结果读回和generation；反向把每个标量cursor、请求DTO都建聚合又会制造状态机。关键缺口是read intent不能依赖跨generation位置，source tombstone不能由网络失败构造。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为关键对象，不补上游schema |

## 6. 设计取舍

采用16对象独立卡片、七个CP小节；恢复审查时保留现有完整卡片而不另复制七份附录。状态和值类型在筛选说明解释，owner未闭合值不能由本地factory生成。

恢复审查发现前批一次写入全部对象、缺少逐部分校准依据，且所属部分误写0~6、末尾重复§8~10。因此撤销前批泛化停审记录的完成效力；本次先逐CP审查字段、工厂和状态，再完成跨对象审计。不能将补审描述为原批已遵守逐部分生成。

## 7. 结构化中间产物

### 7.1 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `WorkspacePartition` | CP1 / Truth-State | 正式关键对象 | 稳定局部聚合，显式建立与唯一分区定位 |
| `WorkspaceScope` | CP1 / Reference-Boundary | 正式关键对象 | 正式范围解析值，不拥有scope truth |
| `SourceSlice` | CP2 / Projection-Reference | 正式关键对象 | 安全来源快照与版本语境 |
| `VisibilityBinding` | CP2 / Reference-Boundary | 正式关键对象 | 正式决定适用引用，非授权policy |
| `PartitionProjection` | CP3 / Projection | 正式关键对象 | 同世代已提交读模型 |
| `SourceApplicationRecord` | CP3 / Audit-History | 正式关键对象 | 终局应用与重取结果依据 |
| `SourceCoverage` | CP3 / State | 正式关键对象 | 已证明覆盖、连续性与失效 |
| `InboxItem` | CP4 / Projection | 正式关键对象 | owner明示attention的派生条目 |
| `LocalAttentionState` | CP5 / Truth-State | 正式关键对象 | 显式本地意图与独立版本 |
| `ReadCursor` | CP5 / Truth-Value | 正式关键对象 | 稳定attention身份上的用户意图 |
| `WorkspaceOperationRecord` | CP5 / Audit-History | 正式关键对象 | 局部共享幂等结果；CP1/CP6复用 |
| `RebuildAttempt` | CP6 / State | 正式关键对象 | 显式恢复生命周期与失败原因 |
| `GenerationState` | CP6 / State | 正式关键对象 | 角色与安全校验分轴 |
| `InvalidationRecord` | CP6 / Audit-History | 正式关键对象 | 不可变失效依据及作用范围 |
| `WorkspaceReadView` | CP7 / Read-model | 正式关键对象 | 安全响应值，不持久化 |
| `WorkspacePageCursor` | CP7 / Reference-Boundary | 正式关键对象 | 稳定读取继续语境，不授权 |

排除项：ScopeService、SourceReadService、ProjectionApplyService、InboxProjector、LocalAttentionService、RecoveryService、WorkspaceQueryService 是服务主体，留给 Step7~9；OwnerSourcePort、VisibilityResolverPort、WorkspaceStorePort 等是边界契约；ScopeSelector、请求/响应和事件 envelope 是接口传递类型；均不作为本章领域对象。

### 7.2 模块执行顺序与对象反查

| 顺序 | 组成部分 | 对象 |
|---|---|---|
| 1 | CP1 分区与范围 | `WorkspacePartition`、`WorkspaceScope` |
| 2 | CP2 安全来源消费 | `SourceSlice`、`VisibilityBinding` |
| 3 | CP3 连续投影 | `PartitionProjection`、`SourceApplicationRecord`、`SourceCoverage` |
| 4 | CP4 Inbox 投影 | `InboxItem` |
| 5 | CP5 局部注意力 | `LocalAttentionState`、`ReadCursor`、`WorkspaceOperationRecord` |
| 6 | CP6 失效与重建 | `RebuildAttempt`、`GenerationState`、`InvalidationRecord` |
| 7 | CP7 读取与交接 | `WorkspaceReadView`、`WorkspacePageCursor` |

每个对象的字段均明确类型，函数参数包含类型；owner exact schema、协议编码和持久化列定义仍未锁定。

## CP1 分区与范围

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。分区必须有稳定身份，但scope来自owner，不能由partition id倒推；分区建立和scope解析是两种读写路径。
- 诊断与取舍：保留WorkspaceScope值对象；WorkspacePartition无独立业务生命周期，未物化只是current_generation为空。唯一键是已解析principal/scope，provision必须受正式创建权限决定控制；本地并发版本由store生成。不采用复制外部truth或给纯值对象发明全局状态机。
- 结构化写入前：本部分依据已核对，gate_status=pass；先修本部分，再进入下一CP。

### WorkspacePartition

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 |
| 对象类型 | local aggregate |
| 主要责任 | 绑定principal与正式scope的稳定局部分区身份 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 显式分区建立时由本地ID来源生成 |
| `principal` | `PrincipalRef` | 入口已验证主体 |
| `scope` | `WorkspaceScope` | ScopeResolverPort正式解析 |
| `partition_version` | `PartitionVersion` | store在局部原子提交时赋值；不等于view revision |
| `current_generation` | `OptionalGenerationId` | 初始无投影；CP6切换原子设置 |

#### 状态集合

本对象无独立业务生命周期。current_generation为空表示尚未物化，不是完整空view；非空也不证明fresh/visible。唯一键为正式解析后的principal与scope。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_scope(WorkspaceScope scope)` | 核对同一主体/范围，不能从ID推断membership |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `provision(WorkspacePartitionId id, PrincipalRef principal, WorkspaceScope scope)` | 仅显式Provision入口；service先核验正式创建权限及幂等语境，store赋初始版本，初始generation为空 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| query不能调用provision；不拥有项目/成员生命周期。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### WorkspaceScope

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 |
| 对象类型 | immutable boundary value |
| 主要责任 | 承载Personal/Project分支及owner解析来源 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `kind` | `ScopeKind` | Personal或Project，输入显式选择 |
| `anchor` | `OwnerScopeRef` | Personal由identity、Project由work正式来源 |
| `resolution_ref` | `OwnerResolutionRef` | 解析出处 |
| `principal` | `PrincipalRef` | 必须匹配入口主体 |

#### 状态集合

不可变范围值，无独立状态机。owner解析过期时须重新解析，不在本地迁移membership状态。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(PrincipalRef principal, ScopeSelector selector)` | 校验解析与请求一致 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_resolution(OwnerScopeResolution resolution)` | 只能复制已核验owner值，不解析字符串 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不作为执行主语/认证/授权决定。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP1 分区与范围 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | 分区建立→WorkspacePartition；正式scope解析→WorkspaceScope |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP2 安全来源消费

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。SourceSlice需要内容与来源版本共存，VisibilityBinding不能反过来发allow；两者只是消费绑定。
- 诊断与取舍：采用immutable快照/引用语境而不是授权状态机。OwnerValidityBasis仅声明所需证明类别，001/003关闭前没有构造正向值的权限；from_owner不是任意反序列化白名单。
- 写入前检查：目标为本Step的CP2；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### SourceSlice

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 |
| 对象类型 | safe source snapshot |
| 主要责任 | 一来源在声明范围内的可消费摘要引用集合 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner` | `SourceOwner` | 六L1之一，来源端口绑定 |
| `scope` | `WorkspaceScope` | 已核验目标范围 |
| `items` | `SafeSourceItemSet` | 只含owner许可字段/ref；exact schema受001阻塞 |
| `version_basis` | `SourceVersionBasis` | owner版本、水位与coverage证明，不能本地猜 |
| `visibility` | `VisibilityBinding` | 适用返回对象/版本的正式决定绑定 |

#### 状态集合

不可变来源快照/决定引用，无独立状态机。每次消费须核验当前适用性；本地不迁移owner授权状态。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_matches(WorkspaceScope scope, VisibilityBinding binding)` | 拒绝来源、对象、范围或版本不一致 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_owner(OwnerSafeReadResult result, VisibilityBinding binding)` | 仅在owner正式safe schema、scope/version与当前决定均匹配后转换；001/003未闭合时返回blocked |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不从任意JSON删几字段后宣称安全；不持久化原始owner响应。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### VisibilityBinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 |
| 对象类型 | immutable reference context |
| 主要责任 | 引用owning chain决定及其适用主体/范围/对象版本 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_refs` | `OwnerDecisionRefSet` | resolver给出的各owning chain依据 |
| `principal` | `PrincipalRef` | 决定适用主体 |
| `scope` | `WorkspaceScope` | 决定适用范围 |
| `subject_binding` | `VisibilitySubjectBinding` | 正式source subject/version绑定 |
| `validity_basis` | `OwnerValidityBasis` | owner时效/撤销/并发证明，003未闭合不可伪造 |

#### 状态集合

不可变来源快照/决定引用，无独立状态机。每次消费须核验当前适用性；本地不迁移owner授权状态。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_applicable(SourceSlice slice, OwnerValidityBasis current_basis)` | 验证当前仍适用于输出，不用本地TTL放行 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_resolution(OwnerVisibilityResolution resolution)` | 复制已核验决定，缺失/冲突则拒绝构造允许绑定 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不能自行签发allow，不把缓存绑定当永久权限；无独立授权生命周期。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP2 安全来源消费 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | safe query→SourceSlice；正式决定适用性→VisibilityBinding |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP3 连续投影

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。coverage必须和应用记录同事务；记录既要解释重复，又不能把一次失败永远冻结为无法恢复。
- 诊断与取舍：SourceApplicationRecord保存不可变终局应用结果；Gap/Blocked只属处理返回与coverage诊断，不占据成功去重键。Conflict返回不覆盖既有成功记录。只有Applied/LateIgnored可形成消费终局记录；缺口填齐后相同输入可重新校验。
- 写入前检查：目标为本Step的CP3；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### PartitionProjection

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 |
| 对象类型 | materialized projection |
| 主要责任 | 同分区同世代的已提交安全摘要与Inbox集合 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 既有分区 |
| `generation_id` | `GenerationId` | current或candidate的显式目标 |
| `view_revision` | `ViewRevision` | 本地原子递增版本 |
| `source_slices` | `SourceSliceSet` | CP2安全快照 |
| `inbox_items` | `InboxItemSet` | CP4派生 |
| `coverage` | `SourceCoverageSet` | 逐源完整性记录 |

#### 状态集合

本投影无独立业务生命周期；世代角色由GenerationState承载，完整性由SourceCoverage承载，安全失效独立约束。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply(SourceSlice slice, SourceApplicationRecord application)` | 替换/增量遵循owner合同；与coverage同事务 |
| `assert_generation(GenerationId generation)` | 禁止混世代 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `empty_candidate(WorkspacePartitionId partition, GenerationId generation)` | 仅维护创建空候选，空不代表complete |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| current表示选用世代不代表fresh或visible；不从自身重建。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### SourceApplicationRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 |
| 对象类型 | immutable application record |
| 主要责任 | 记录一次已提交的终局来源消费判定与可重取本地结果 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `application_key` | `SourceApplicationKey` | owner+stream+source identity+partition+generation |
| `input_digest` | `SafeInputDigest` | 同一规范化安全输入；算法留03 |
| `outcome` | `TerminalApplyDisposition` | 仅Applied或LateIgnored；Duplicate读原记录，失败不占成功去重键 |
| `result_ref` | `ApplicationResultRef` | 本地结果与revision/coverage语境 |
| `cursor_basis` | `SourceCursorBasis` | owner允许的前后位置与比较证明 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Applied` | 本地原子结果已提交 |
| `LateIgnored` | 正式证明过时，不覆盖较新值 |

两者为不可变终局结果标签，不互相迁移。Gap/Blocked/Conflict属于ApplyResult返回分类；Gap可由显式输入处理记录coverage诊断，但不能生成成功消费记录。缺口修复后允许同输入重新校验；冲突不得覆盖原成功记录。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `same_input(SafeInputDigest digest)` | 判断同key内容是否一致 |
| `read_result()` | 提供已提交结果定位，不触发写 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(SourceApplicationKey key, SafeInputDigest digest, TerminalApplyResult result)` | 仅Applied/LateIgnored可调用；与投影效果、coverage、cursor和revision同事务；LateIgnored不倒退cursor |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| Duplicate返回既有记录而非新增；Gap/Blocked不写本对象；Conflict不覆盖原记录；不表示bus ack，未知提交先读回结果。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### SourceCoverage

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 |
| 对象类型 | local maintenance state |
| 主要责任 | 逐源记录已证明消费位置、覆盖范围与缺口 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source` | `SourceStreamRef` | owner正式流标识 |
| `applied_cursor` | `OptionalSourceCursor` | 最后可证明已应用位置 |
| `watermark` | `OptionalOwnerWatermark` | owner覆盖证明 |
| `coverage_state` | `CoverageState` | Unknown/Partial/Complete/Gap/Invalidated |
| `gap_ref` | `OptionalGapRef` | 本地缺口原因定位，不含正文 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Unknown` | 尚无覆盖证明 |
| `Partial` | 有部分来源材料 |
| `Complete` | 声明范围被正式证明覆盖 |
| `Gap` | 连续性无法证明 |
| `Invalidated` | 已被显式失效阻断 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `advance(SourceCursorBasis basis, OwnerCoverageProof proof)` | cursor按正式比较/接续推进；Complete另需声明范围的baseline/watermark覆盖证明 |
| `mark_gap(GapRef gap)` | 保留最后安全cursor |
| `invalidate(InvalidationRecord record)` | 仅正式安全失效转Invalidated；DataStale保留覆盖语义，由失效记录表达数据时效影响 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `unknown(SourceStreamRef source)` | 新候选无覆盖证明 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不能以最大offset、时间戳或页为空证明Complete。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP3 连续投影 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | 连续应用→投影/终局记录/coverage三对象；失败返回不占成功键 |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP4 Inbox 投影

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。attention稳定身份保证重复不新增；Present/Withdrawn必须有字段承载，来源app引用不能代替业务attention版本。
- 诊断与取舍：显式加入attention_state字段；Withdrawn只能由正式owner撤回。hide/read/mute留CP5，跨generation item_id稳定而generation_id独立。
- 写入前检查：目标为本Step的CP4；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### InboxItem

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP4 |
| 对象类型 | derived projection |
| 主要责任 | 从owner明示attention派生可引用条目 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `item_id` | `InboxItemId` | partition+owner attention稳定identity派生，规则留03 |
| `source_attention_ref` | `OwnerAttentionRef` | owner显式来源，004未闭合不可生成 |
| `attention_version` | `OwnerAttentionVersion` | 同一attention生命周期与更新次序 |
| `attention_state` | `AttentionState` | Present/Withdrawn；仅按owner明确输入派生 |
| `source_ref` | `OwnerSubjectRef` | 正文仍留owner |
| `generation_id` | `GenerationId` | 投影物化世代 |
| `source_application_ref` | `ApplicationResultRef` | 可追溯本地应用 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Present` | 来源attention当前有效的派生条目 |
| `Withdrawn` | owner明确撤回的派生标记 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_attention(OwnerAttentionInput input)` | 仅按来源正式生命周期更新/撤回 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive(WorkspacePartitionId partition, GenerationId generation, OwnerAttentionInput input, ApplicationResultRef application)` | 来源identity确定后稳定派生 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| hide/mute/read不是本对象业务状态；不自推attention或排序授权。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP4 Inbox 投影 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | owner attention输入→InboxItem；来源撤回与local隐藏分离 |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP5 局部注意力

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。用户显式意图不能从view推断；ReadCursor三值判定不是source状态；全仓操作记录只是复用本地幂等结构。
- 诊断与取舍：保持LocalAttentionState独立版本，无独立生命周期。WorkspaceOperationRecord是CP5定义、供CP1/CP6复用的技术局部记录，不授予CP5其他业务职责。Provision的幂等键在partition尚不存在时以已解析principal/scope定位，后续记录包含分区ref。
- 写入前检查：目标为本Step的CP5；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### LocalAttentionState

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 |
| 对象类型 | local aggregate |
| 主要责任 | principal/scope下的显式局部偏好与注意力意图 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 绑定既有分区 |
| `principal` | `PrincipalRef` | 入口主体与分区一致 |
| `local_revision` | `LocalRevision` | 本地并发版本 |
| `read_cursors` | `ReadCursorSet` | 每个正式attention stream独立的显式读/未读意图；同stream唯一，不跨流比较 |
| `dispositions` | `LocalDispositionSet` | pin/mute/hide只减少或排列可见内容 |
| `preferences` | `WorkspacePreferenceValues` | 仅workspace呈现偏好 |
| `last_opened` | `OptionalOwnerSubjectRef` | 显式记录，不由query更新 |
| `focus` | `OptionalOwnerSubjectRef` | 局部focus，不是runtime上下文 |

#### 状态集合

本对象无独立业务生命周期；显式局部意图按local revision提交，操作记录提交后不可变，二者不受投影generation重建控制。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `change(LocalAttentionChange change, LocalRevision expected)` | 原子改本地意图，冲突保持原值 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `initialize(WorkspacePartitionId partition, PrincipalRef principal)` | 显式provision或首次显式local command建立；query不建立 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 重建不能覆盖；不回写receipt；偏好不能扩大可见性。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### ReadCursor

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 |
| 对象类型 | local intent value |
| 主要责任 | 表达已读边界及显式未读例外，不使用source消费cursor |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `stream` | `AttentionStreamRef` | 分区内attention流 |
| `read_basis` | `OptionalAttentionReadBasis` | 已见稳定attention ref/version语境 |
| `unread_overrides` | `AttentionRefSet` | 显式置未读，不能被普通cursor推进无条件抹去 |
| `intent_revision` | `LocalRevision` | 所属local state提交版本 |

#### 状态集合

本对象无独立业务生命周期；显式局部意图按local revision提交，操作记录提交后不可变，二者不受投影generation重建控制。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply(ReadIntent intent, AttentionIdentityResolution resolution)` | Advance/MarkUnread按已解析目标操作；无法映射保持unknown |
| `classify(InboxItem item)` | Read/Unread/Unknown三值派生，Unknown不猜已读 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `unset(AttentionStreamRef stream)` | 尚无用户读意图 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不是分页cursor或conversation receipt；跨generation仅可按稳定identity映射。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### WorkspaceOperationRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 |
| 对象类型 | immutable operation/result record |
| 主要责任 | CP5定义的共享局部技术记录，供CP1/CP6复用幂等与未知提交核对；不使CP5拥有其业务 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `operation_key` | `WorkspaceOperationKey` | 已解析actor+scope+operation kind+idempotency key；已建分区须匹配其身份，provision不得依赖尚不存在的partition id |
| `request_digest` | `SafeInputDigest` | 规范化局部请求，不含敏感正文 |
| `result` | `StoredWorkspaceResult` | typed局部结果，03闭合变体 |
| `result_ref` | `WorkspaceOperationRef` | GetWorkspaceOperationResult可读回 |
| `partition_ref` | `WorkspacePartitionId` | 成功provision或其他操作提交时绑定的既有分区 |
| `revision_basis` | `LocalCommitBasis` | 相关partition/local/rebuild版本，不混用 |

#### 状态集合

本对象无独立业务生命周期；显式局部意图按local revision提交，操作记录提交后不可变，二者不受投影generation重建控制。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(SafeInputDigest digest)` | 同key异digest冲突 |
| `safe_result(VisibilityBinding binding)` | 读回仍裁剪，旧成功不复活撤销数据 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `committed(WorkspaceOperationKey key, SafeInputDigest digest, StoredWorkspaceResult result)` | 与效果同本地事务保存；从typed result提取partition和revision；系统操作键有独立命名空间 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 幂等重放不重新调用owner写；提交未知时无结果不能伪造success。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP5 局部注意力 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | 显式局部意图→LocalAttentionState/ReadCursor；幂等与结果核对→共享操作记录 |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP6 失效与重建

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。恢复必须明确意图、初始generation、terminal原因和失效依据；原工厂没有所有必需字段的来源。
- 诊断与取舍：request显式接收candidate generation；新增attempt_version与safe failure basis。重试必须新的显式attempt，必要时supersede非终态旧attempt。invalidate工厂接收operation ref；事件触发复用受控系统操作语境，不把owner event id当用户幂等键。GenerationRole只保留Candidate/Current/Retired；安全失效单列GenerationSafetyState与失效引用。Current可同时SafetyBlocked，不能用角色迁移掩盖撤销；DataStale仅影响freshness，不自动造SafetyBlocked。
- 写入前检查：目标为本Step的CP6；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### RebuildAttempt

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 |
| 对象类型 | maintenance aggregate |
| 主要责任 | 表达显式refresh/rebuild意图、候选进展与可追溯结果 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `RebuildAttemptId` | 本地显式维护ID |
| `partition_id` | `WorkspacePartitionId` | 既有或显式建立分区 |
| `mode` | `RecoveryMode` | Refresh或Rebuild |
| `candidate_generation` | `GenerationId` | 只写候选，由受控ID来源分配后传入 |
| `attempt_version` | `AttemptVersion` | store在每次进展原子提交时生成的并发版本 |
| `failure_basis` | `OptionalRecoveryFailureBasis` | blocked/failed时必填安全分类与依据ref；不含原始owner响应 |
| `baseline_basis` | `OptionalOwnerBaselineBasis` | owner枚举与事件接续证明 |
| `status` | `RebuildStatus` | Requested/Baselining/CatchingUp/Validating/Ready/Completed/Blocked/Failed/Superseded |
| `expected_partition_version` | `PartitionVersion` | 切换时检查本地并发语境 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Requested` | 显式接受维护意图 |
| `Baselining` | 读取owner基线 |
| `CatchingUp` | 按正式接续追平 |
| `Validating` | 核对覆盖与安全/并发 |
| `Ready` | 候选可进入cutover，不等于已切换 |
| `Completed` | 本地cutover已提交 |
| `Blocked` | 缺正式证明或安全前提，不能继续 |
| `Failed` | 本地维护失败 |
| `Superseded` | 被明确新attempt取代 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `advance(RecoveryProgress progress, AttemptVersion expected)` | 按明确job与并发版本推进；重试终态必须新建attempt |
| `supersede(RebuildAttemptId replacement, AttemptVersion expected)` | 显式替代非终态旧attempt并阻止旧工作者后续提交 |
| `block(RecoveryBlocker blocker)` | 保留已有安全current，不伪造成功 |
| `complete(CutoverResult result)` | 仅本地原子切换后完成 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `request(RebuildAttemptId id, GenerationId candidate, RecoveryIntent intent, PartitionVersion expected)` | 显式job创建，权限不足不接受 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| Blocked/Failed是本attempt终态；恢复条件改善也须新显式attempt。query不重试；archive/SDK cache不是baseline。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### GenerationState

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 |
| 对象类型 | local generation state |
| 主要责任 | 隔离candidate与current，保护原子切换 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `generation_id` | `GenerationId` | 本地新世代ID |
| `partition_id` | `WorkspacePartitionId` | 所属分区 |
| `role` | `GenerationRole` | Candidate/Current/Retired；仅描述选用角色 |
| `safety_state` | `GenerationSafetyState` | Unverified/Validated/SafetyBlocked；局部检查状态，不是授权truth |
| `invalidation_refs` | `InvalidationRefSet` | 已知安全失效依据；与角色独立，旧allow不得覆盖 |
| `validated_revision` | `OptionalViewRevision` | 校验时的候选版本 |
| `cutover_basis` | `OptionalCutoverBasis` | 旧current、分区版本、候选coverage/安全语境 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Candidate` | 仅维护可见，不对普通query混出 |
| `Current` | 选用世代；freshness/visibility独立判断 |
| `Retired` | 旧世代不可作为当前分页继续 |

| 安全状态 | 作用 |
|---|---|
| Unverified | 尚无可用安全校验语境，不可promote |
| Validated | 曾在指定语境校验；每次输出/cutover仍需现时决定 |
| SafetyBlocked | 有明确安全失效；不因旧事件重放复活 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate(CutoverBasis basis)` | 记录候选一致语境并设Validated；不能清除更新的失效 |
| `invalidate(InvalidationRecord record)` | SafetyBlocked影响所有关联世代；DataStale仅影响数据freshness |
| `promote(CutoverBasis basis)` | 同事务current切换与旧世代retire |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `candidate(WorkspacePartitionId partition, GenerationId id)` | 仅显式恢复分配；初始Candidate+Unverified |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不以Ready或Validated跳过现时授权与并发检查；Retired/SafetyBlocked不原地复活，通过新candidate重新构建。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### InvalidationRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 |
| 对象类型 | immutable safety/maintenance record |
| 主要责任 | 记录正式撤销或显式维护导致的局部失效范围 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `invalidation_id` | `InvalidationId` | 本地操作/输入ID |
| `target` | `ExistingWorkspaceTargetSet` | 正式index枚举的已有分区/源/世代目标 |
| `basis` | `InvalidationBasis` | owner正式撤销/ref或获准局部maintenance原因 |
| `safety_effect` | `InvalidationEffect` | DataStale或SafetyBlocked，不能自行生成owner删除 |
| `operation_ref` | `WorkspaceOperationRef` | 可重取本地维护结果 |

#### 状态集合

不可变失效依据，无独立状态机；受影响coverage/generation另行承载局部效果。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `affects(WorkspacePartitionId partition, GenerationId generation)` | 覆盖全部相关世代，不只current |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(InvalidationId id, ExistingWorkspaceTargetSet targets, InvalidationBasis basis, WorkspaceOperationRef operation)` | 有正式依据的显式输入；事件路径使用受控系统操作命名空间与同事务结果记录 |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 请求读到timeout不能持久化为source deletion；旧allow重放不能盖过新撤销。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP6 失效与重建 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | 显式恢复→attempt/generation；owner或获准维护失效→不可变依据记录 |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

## CP7 读取与交接

#### 本部分恢复校准依据

- 问题/来源：Step5对应capability；01 §9。page cursor存在不等于拥有权限；原响应scope必填与scope失败时fail-closed冲突。
- 诊断与取舍：WorkspaceReadView仅代表可安全构造的view。外层WorkspaceQueryResult区分View与SafeReadFailure，后者没有scope/ref/count/provenance。游标绑定安全决定语境，权限变化要求重读；local revision统一绑定，不以条件可选掩盖排序变化。
- 写入前检查：目标为本Step的CP7；项目/flow/模块门禁pass；依据done；仅修本部分；无正式正文写入。

### WorkspaceReadView

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP7 |
| 对象类型 | read response model |
| 主要责任 | 提供绑定scope的安全内容、来源和多轴可用姿态 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope` | `WorkspaceScope` | 仅正式resolver成功且允许公开时构造；失败走外层SafeReadFailure |
| `read_basis` | `WorkspaceReadBasis` | Materialized包含generation/view/local revision；Transient无durable revision |
| `items` | `SafeWorkspaceItemSet` | 逐项裁剪后才组装 |
| `provenance` | `SafeProvenanceSet` | 同样受权限裁剪 |
| `freshness` | `DataFreshness` | Fresh/Stale/Unknown，source证明 |
| `coverage` | `ReadCoverage` | Complete/Partial/Unknown，不泄露hidden来源 |
| `availability` | `ReadAvailability` | 本view为Available；整体Blocked/Unavailable走外层SafeReadFailure |
| `visibility` | `ReadVisibilityPosture` | 本view只含AllowedSubset；整体FailClosed走安全失败DTO，不携带内容元信息 |
| `next_cursor` | `OptionalWorkspacePageCursor` | 只对稳定物化读语境发放 |

#### 状态集合

不可变读取值，无持久化状态机。每次调用从当前安全语境计算；不能由query更新来源或维护状态。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_no_leak(VisibilityBinding binding)` | 检查内容/计数/ref/provenance同一边界 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `compose(WorkspaceReadInputs inputs, VisibilityBinding binding)` | 纯计算，不保存结果；scope不可解析或安全边界不能证明时不构造view |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 不把请求时聚合伪造成持久revision，不从partial推导完整count。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

### WorkspacePageCursor

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP7 |
| 对象类型 | read continuation value |
| 主要责任 | 绑定稳定物化读取语境的分页继续令牌 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `principal` | `PrincipalRef` | 与当前调用主体严格一致 |
| `partition_id` | `WorkspacePartitionId` | 已存在lookup，不由query创建 |
| `generation_id` | `GenerationId` | 必须仍可按合同服务 |
| `view_revision` | `ViewRevision` | 不混不同投影版本 |
| `local_revision` | `LocalReadBasis` | 统一固定当前overlay版本；不存在overlay时用明确Absent语境，不由query初始化 |
| `query_binding` | `QueryBinding` | filter/order/scope/read kind |
| `visibility_basis` | `VisibilityContextRef` | 当前安全决定适用语境，变化必须重新读取；该引用本身不授予权限 |
| `position` | `StablePagePosition` | 稳定排序tie-break语境，编码留03 |

#### 状态集合

不可变读取值，无持久化状态机。每次调用从当前安全语境计算；不能由query更新来源或维护状态。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate(WorkspaceReadContext context)` | 比较完整绑定并重新获得现时授权，不签发权限 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `next(WorkspaceReadContext context, StablePagePosition position)` | 从当前稳定读取结果纯计算，不持久化cursor |

#### 禁止事项

| 禁止事项 | 理由 |
|---|---|
| 源cursor不是分页；失效返回重新读取，绝不静默切页/世代/主体。 | 维护本对象的owner与读写边界；不得由工厂或调用者绕过。 |

#### CP7 读取与交接 对象恢复补审与回填

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| capability→对象 | pass | 安全读取→WorkspaceReadView；稳定物化继续读取→WorkspacePageCursor |
| 字段/函数来源 | pass | 本地类型骨架成立；owner字段与版本规则待WS-UP闭合 |
| 状态边界 | pass | 不把source cursor、view revision、local revision、generation混同 |
| 越界检查 | pass | 不拥有上游truth、授权、archive或执行状态 |

回填草稿：正式§6逐对象摘录上述基本信息、字段、状态、函数、工厂和禁止事项表；不摘录恢复过程。模块自检pass；owner正向合同仍blocked；允许下一CP校准。

### 7.3 辅助类型与DTO排除登记

| 类别 | 名称/含义 | 不独立为领域对象的理由与承接 |
|---|---|---|
| 本地标识/版本值 | WorkspacePartitionId、GenerationId、RebuildAttemptId、InvalidationId、WorkspaceOperationRef、PartitionVersion、ViewRevision、LocalRevision、AttemptVersion | 字段级身份和比较语境；03定义编码、生成与比较，不新增业务生命周期。 |
| 本地状态enum | CoverageState、TerminalApplyDisposition、AttentionState、RebuildStatus、GenerationRole、GenerationSafetyState | 在所属对象状态表完整列值；Step9定义触发与禁止迁移。 |
| owner输入槽位 | OwnerScopeResolution、OwnerSafeReadResult、OwnerVisibilityResolution、OwnerAttentionInput、OwnerCoverageProof、OwnerBaselineBasis及source/version/decision refs | 仅标识必须由正式owner提供的信息；WS-UP-001~005未闭合前无正向构造来源，不是本地新schema。 |
| 局部意图/读取值 | LocalAttentionChange、ReadIntent、LocalDispositionSet、WorkspacePreferenceValues、LocalReadBasis | 输入或字段类型；LocalReadBasis为Absent或Present(local revision)，不得query补建。 |
| 应用结果DTO | ApplyResult / TerminalApplyResult | 前者含Gap/Blocked/Conflict与重取结果，后者仅Applied/LateIgnored；无独立聚合。 |
| 查询结果DTO | WorkspaceQueryResult / SafeReadFailure | View(WorkspaceReadView)或安全失败；失败只含公开的Blocked/Unavailable及安全错误类别，不携带scope/ref/count/provenance，也不区分隐藏与不存在。 |
| 读取多轴值 | DataFreshness、ReadCoverage、ReadAvailability、ReadVisibilityPosture、WorkspaceReadBasis | response派生值而非持久状态；Transient无durable revision且不发物化分页token。 |
| 输入/并发证据 | SourceApplicationKey、WorkspaceOperationKey、SafeInputDigest、SourceCursorBasis、CutoverBasis、RecoveryFailureBasis | 支撑既有对象的不变量；03给本地构造/规范化契约，owner证据仍受blocker控制。 |

### 7.4 跨对象一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| typed ref与版本分轴 | pass | source/view/generation/local/page各自独立 |
| projection rebuild source | blocked | 必须来自owner baseline+正式接续，不从projection自建 |
| visibility与输出 | pass | binding先于内容/ref/count/provenance，撤销fail-closed |
| local overlay | pass | CP6不覆盖CP5；ReadCursor不能伪造source receipt |
| flow/state反查 | pass | 已列预期承接；Step8/9执行时仍须再审，不预签未来产物 |
| 完整上游schema | blocked | WS-UP-001~008/006-S |

### 7.5 Step 7~9 承接清单

| 契约组 | 必须承接 |
|---|---|
| Scope/visibility port | WorkspaceScope、VisibilityBinding、SourceSlice的正式读取来源 |
| Projection store | PartitionProjection、SourceApplicationRecord、SourceCoverage原子读写 |
| Attention store | LocalAttentionState、ReadCursor、WorkspaceOperationRecord及结果读回 |
| Recovery source/store | RebuildAttempt、GenerationState、InvalidationRecord候选/切换 |
| Read surface | WorkspaceReadView、WorkspacePageCursor的安全组装与失效 |

### 7.6 后置历史差异审计

| 旧材料位置 | 旧口径 | 当前判断 | 理由/回填影响 |
|---|---|---|---|
| draft/03_模块划分与分层.md §3 | WorkspaceProjection、SourceCursorState、UnreadProjection等候选 | 修改/合并 | 现为PartitionProjection、SourceCoverage；unread为ReadCursor派生三值，不增加独立持久聚合。 |
| draft/03_模块划分与分层.md §4.1 | scope verified/revoked、projection current/stale/partial混合状态 | 废弃 | 不造本地授权状态机；角色、coverage、安全、response多轴分离。 |
| draft/02_功能推演.md §1.2 C-WS-5 | 局部体验状态可重算 | 限缩 | 派生显示可重算，用户意图不可被重建重置。 |
| README.md §开头 | 00/01尚未完成 | historical_material | 不用于当前进度判断；本次不改README。 |

## 8. 回填草稿

正式§6依次独立展开上述16对象，各自摘录基本信息、字段、状态、成员、工厂和禁止事项；候选筛选与辅助类型分类作章节入口。CP内恢复依据、停审及后置历史审计留在本文件。

可直接回填的章首结论：本仓关键对象以分区、只读安全来源、连续投影、Inbox、用户局部意图、恢复维护及安全读取为七组来源；16对象分别拥有局部状态、不可变引用或响应值。scope、authorization、source顺序及baseline authority仍由owning domain提供。应用终局记录与失败返回分离，generation角色与安全状态分离。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

Step8/9反查补记：16对象被14入口流程承接；SourceCoverage安全失效与DataStale区分已回填，CP7外层失败DTO不新增领域生命周期。

## 10. 进入下一步条件

恢复补审已按CP1→CP7顺序完成：所属部分、字段来源、工厂必需输入、终局去重、attention状态、Provision幂等、generation安全轴和失败DTO均已修正。禁止事项表、辅助类型排除、16对象唯一性与历史差异已审查。

本Step静态审查pass；可进入Step7接口骨架。Step8/9反查属于未来必要门禁，不代表已执行。所有上游WS-UP仍开放；未运行代码测试，未生成实现或commit。
