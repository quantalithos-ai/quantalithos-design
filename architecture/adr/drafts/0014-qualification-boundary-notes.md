# Qualification 边界与命名草案

> **定位**:本文件**不是正式 ADR**,也**不是现有 identity / method-library / capability-hub 文档的即时变更要求**。它是一次跨仓命名与边界讨论的架构草案,用于后续正式修订文档或起草 ADR。  
>
> **存档理由**:在 `L1-identity` 已进入代码实现准备/进行阶段时,围绕 `CapabilityProfile`、`CapabilityDefinition` 与 SPEM 对齐发生了新的校准。当前结论对三仓边界很重要,但不应直接打断正在基于既有 identity 文档实现代码的 agent。因此先存档为草案:
>
> - 暂不修改 `projects/L1-identity/*`
> - 暂不修改 `projects/L3-method-library/*`
> - 暂不修改 `projects/L3-capability-hub/*`
> - 后续在统一文档修订窗口再决定是否升级为正式 ADR 或并入各仓 `00~03`
>
> **讨论日期**:2026-05-18  
> **参与者**:Aris + codex  
> **上下文**:`标准对齐全景图.md` 中提到 SPEM RoleDefinition / CapabilityDefinition / WorkProductDefinition 作为 GlobalMember role / capability 的定义来源;随后复核 SPEM 发现更严谨的标准名称应使用 `Qualification`。

---

## 一、草案要回答的问题

当前 `L1-identity` 文档中已经有:

```text
CapabilityProfile
  表示某个 GlobalMember 的成员能力画像
```

`L3-method-library` 文档中已经有:

```text
RoleDefinition
TaskDefinition
WorkProductDefinition
ProcessTemplateDef
ViewProfile
AIPolicyDef
```

但在对齐 `architecture/标准对齐全景图.md` 时发现一个问题:

```text
RoleDefinition 的定义来源已经明确在 method-library。
WorkProductDefinition 的定义来源也已经明确在 method-library。
成员能力的定义来源还不够清晰。
```

更具体地说:

```text
identity 里的 CapabilityProfile
  只是成员实际能力画像。

它不是能力/技能/胜任力本身的标准定义。
```

因此需要回答:

```text
1. 是否应该继续使用 CapabilityDefinition 这个名字?
2. 是否应该将 identity 的 CapabilityProfile 改成 CapabilityDefinition?
3. method-library 与 capability-hub 中的 capability 语义如何分工?
4. 严格 SPEM 命名下应该如何命名这些对象?
```

---

## 二、标准复核结论

复核本项目已收录的 SPEM 讨论与规格材料后,更严谨的结论是:

```text
SPEM 中直接用于表达角色或任务所需技能/胜任力的对象更接近 Qualification。
```

它与以下 SPEM 关系对应:

```text
RoleDefinition.providedQualification
TaskDefinition.requiredQualification
```

因此,`CapabilityDefinition` 不应作为严格 SPEM 名称使用。

本草案建议:

```text
放弃 CapabilityDefinition 作为标准对齐名称。
统一使用 Qualification。
```

说明:

```text
Capability Pattern 是 SPEM 中另一个概念,它表示可复用的局部过程模式,
不适合用来表达“成员技能/能力字典”。
```

---

## 三、推荐命名

### 3.1 method-library

```text
L3-method-library
  Qualification
```

含义:

```text
平台认可的技能 / 胜任力 / 能力标准定义。
```

示例:

```text
Qualification: rust-api-development
  name: Rust API 开发
  kind: engineering-skill
  level_model: basic / intermediate / advanced
  evidence_policy: code / test / review evidence required
  lifecycle: published
  version: 1.0.0
  fingerprint: q-rust-api-v1
```

### 3.2 identity

```text
L1-identity
  QualificationProfile
```

含义:

```text
某个 GlobalMember 实际具备哪些 Qualification、等级如何、证据是什么。
```

注意:

```text
按本草案,identity 中不使用 MemberQualificationProfile 这个名字,
而统一使用 QualificationProfile。
```

示例:

```text
QualificationProfile: GM-001
  global_member_id: GM-001
  qualifications:
    - qualification_id: rust-api-development
      qualification_version: 1.0.0
      qualification_fingerprint: q-rust-api-v1
      level: advanced
      confidence: 0.86
      evidence_refs:
        - artifact://code-review/CR-001
        - artifact://test-report/TR-002
```

### 3.3 capability-hub

仓库名保持:

```text
L3-capability-hub
```

但内部对象应使用:

```text
QualificationBinding
CapabilityAccessDecision
```

含义:

```text
QualificationBinding
  说明某个 Qualification 可以由哪些 tool / provider / MCP / A2A 能力支撑。

CapabilityAccessDecision
  说明当前上下文下,这些能力接入是否允许、如何审计、如何计费。
```

说明:

```text
capability-hub 的仓名可以继续使用 capability,
因为它表达的是“能力接入中心”的产品/架构层含义。

但仓内不应再定义另一套 CapabilityDefinition。
```

---

## 四、三仓职责边界

```text
L3-method-library
  负责定义 Qualification 是什么。

L1-identity
  负责记录某个成员实际具备哪些 Qualification。

L3-capability-hub
  负责记录某个 Qualification 如何映射到工具、provider、MCP/A2A 入口,
  以及当前是否允许接入。
```

ASCII 全景图:

```text
                 +----------------------+
                 | L3-method-library    |
                 |                      |
                 | Qualification        |
                 | RoleDefinition       |
                 | TaskDefinition       |
                 | WorkProductDefinition|
                 +----------+-----------+
                            |
                            | definition published / fingerprint_changed
                            |
        +-------------------+-------------------+
        |                                       |
        v                                       v
+----------------------+              +----------------------+
| L1-identity          |              | L3-capability-hub    |
|                      |              |                      |
| QualificationProfile |              | QualificationBinding |
| - member actual skill|              | CapabilityAccess...  |
+----------+-----------+              +----------+-----------+
           |                                     |
           | member qualification summary        | allow / deny / tool view
           v                                     v
+----------------------+              +----------------------+
| work / runtime       |              | runtime / tools      |
| assign suitable work |              | invoke allowed tools |
+----------------------+              +----------------------+
```

---

## 五、三仓两两关系展开

上一节的全景图只说明了三仓的大方向,但真正落地时最容易混淆的是两两之间到底传什么、不传什么。这里把 `L3-method-library`、`L1-identity`、`L3-capability-hub` 的双边关系拆开说明。

### 5.1 `L3-method-library` 与 `L1-identity`

这对关系的核心是:

```text
method-library 定义 Qualification。
identity 消费 Qualification,并记录成员实际具备哪些 Qualification。
```

ASCII:

```text
┌──────────────────────────────┐
│ L3-method-library            │
│                              │
│ Qualification                │
│ - qualification_id           │
│ - name / kind                │
│ - level_model                │
│ - evidence_policy            │
│ - lifecycle / fingerprint    │
└───────────────┬──────────────┘
                │
                │ QualificationSnapshot
                │ qualification.published / retired
                │ qualification.fingerprint_changed
                ▼
┌──────────────────────────────┐
│ L1-identity                  │
│                              │
│ QualificationCatalogEntry    │
│ - local index                │
│ - fingerprint                │
│ - status                     │
│                              │
│ QualificationProfile         │
│ - member_id                  │
│ - qualification_id           │
│ - level / confidence         │
│ - evidence_refs              │
└───────────────┬──────────────┘
                │
                │ source_drift / sync_status
                │ only when local index disagrees
                ▼
┌──────────────────────────────┐
│ L3-method-library            │
│ drift observation input      │
└──────────────────────────────┘
```

关系解释:

- `L3-method-library` 是 `Qualification` 的定义真相源
- `L1-identity` 只建立 `QualificationCatalogEntry` 本地索引
- `L1-identity` 的 `QualificationProfile` 记录成员实际能力画像
- `QualificationProfile.qualifications[].qualification_id` 必须引用 `QualificationCatalogEntry`
- `QualificationCatalogEntry` 由 `QualificationSnapshot` 同步而来
- `identity` 可以上报 `source_drift` 或同步状态,但不能反向改写 `Qualification`

不传递的内容:

```text
method-library 不接收成员实际能力画像。
identity 不保存 Qualification 正文。
identity 不定义新的 Qualification。
identity 不把成员 evidence 正文同步给 method-library。
```

例子:

```text
method-library:
  Qualification = rust-api-development

identity:
  QualificationCatalogEntry = rust-api-development 的本地索引
  QualificationProfile(GM-001):
    rust-api-development = advanced
    evidence_refs = [code-review, test-report]
```

### 5.2 `L3-method-library` 与 `L3-capability-hub`

这对关系的核心是:

```text
method-library 定义 Qualification 是什么。
capability-hub 定义这个 Qualification 如何通过工具、provider、MCP/A2A 入口被接入。
```

ASCII:

```text
┌──────────────────────────────┐
│ L3-method-library            │
│                              │
│ Qualification                │
│ - semantic definition        │
│ - level_model                │
│ - evidence_policy            │
│ - lifecycle / fingerprint    │
└───────────────┬──────────────┘
                │
                │ QualificationSnapshot
                │ lifecycle / fingerprint
                ▼
┌──────────────────────────────┐
│ L3-capability-hub            │
│                              │
│ QualificationBinding         │
│ - qualification_id           │
│ - tool_refs                  │
│ - provider_refs              │
│ - mcp_server_refs            │
│ - a2a_node_refs              │
│ - policy_refs                │
│                              │
│ CapabilityAccessDecision     │
│ - allowed / denied           │
│ - effective_bindings         │
│ - policy_snapshot_ref        │
└───────────────┬──────────────┘
                │
                │ binding_invalid / unsupported
                │ optional drift or health signal
                ▼
┌──────────────────────────────┐
│ L3-method-library            │
│ definition remains unchanged │
└──────────────────────────────┘
```

关系解释:

- `L3-method-library` 决定 `Qualification` 的标准语义
- `L3-capability-hub` 引用 `qualification_id` 建立 `QualificationBinding`
- `QualificationBinding` 说明某项 Qualification 可以由哪些工具、provider、MCP server、A2A node 支撑
- `CapabilityAccessDecision` 说明当前上下文是否允许访问这些能力入口
- `capability-hub` 可以发现某个绑定因 Qualification retired / fingerprint drift 失效,但不能修改 Qualification 定义

不传递的内容:

```text
method-library 不保存 API key / secret / provider runtime。
method-library 不维护 MCP server registry。
capability-hub 不定义 Qualification 语义正文。
capability-hub 不维护 RoleDefinition / TaskDefinition 的方法内容关系。
```

例子:

```text
method-library:
  Qualification = rust-api-development

capability-hub:
  QualificationBinding(rust-api-development):
    tools = [cargo-test, github-mcp]
    providers = [local-rust-toolchain]
    policy_refs = [no-production-db-without-gate]
```

### 5.3 `L1-identity` 与 `L3-capability-hub`

这对关系的核心是:

```text
identity 说明某个成员具备哪些 Qualification。
capability-hub 根据这些 Qualification 和治理规则,给出可访问的工具 / provider 能力视图。
```

ASCII:

```text
┌──────────────────────────────┐
│ L1-identity                  │
│                              │
│ GlobalMember                 │
│ - lifecycle                  │
│ - role refs                  │
│                              │
│ QualificationProfile         │
│ - qualification_id           │
│ - level / confidence         │
│ - evidence_refs              │
└───────────────┬──────────────┘
                │
                │ member qualification summary
                │ member lifecycle / availability
                ▼
┌──────────────────────────────┐
│ L3-capability-hub            │
│                              │
│ CapabilityDecisionInput      │
│ - member ref                 │
│ - qualification refs         │
│ - shared_rules snapshot      │
│ - provider / tool status     │
│                              │
│ CapabilityAccessDecision     │
│ - allowed tools/providers    │
│ - denied reasons             │
└───────────────┬──────────────┘
                │
                │ decision view / denied audit
                ▼
┌──────────────────────────────┐
│ L1-identity                  │
│ optional consumer only       │
└──────────────────────────────┘
```

关系解释:

- `L1-identity` 是成员身份、生命周期和成员能力画像的真相源
- `L3-capability-hub` 消费成员 qualification 摘要作为访问裁决输入之一
- `capability-hub` 不判断成员是否“真实具备”某项 Qualification,它信任 identity 的画像事实
- `capability-hub` 只判断在当前 policy / provider / tool / secret / cost 条件下,是否允许接入相关能力
- `identity` 可以消费 `CapabilityAccessDecision` 的摘要用于展示或审计,但不能把 access decision 写回成成员能力事实

不传递的内容:

```text
identity 不保存 tool/provider binding 细节。
identity 不保存 secret。
identity 不根据工具可用性自动新增 QualificationProfile 条目。
capability-hub 不更新成员 QualificationProfile。
capability-hub 不把一次工具调用成功直接写成永久能力。
```

例子:

```text
identity:
  GM-001 has rust-api-development = advanced

capability-hub:
  对 GM-001 查询 rust-api-development 可用能力:
    allow cargo-test
    allow github-mcp
    deny production-db-migration, reason = requires governance gate
```

### 5.4 三个双边关系的最小规则

```text
method-library -> identity
  Definition source to member qualification index/profile.

method-library -> capability-hub
  Definition source to qualification binding/access metadata.

identity -> capability-hub
  Member actual qualification profile to access decision input.
```

反向只能是状态、漂移、审计或只读消费:

```text
identity -> method-library
  source_drift / sync_status, not member profile truth.

capability-hub -> method-library
  binding_invalid / unsupported signal, not definition mutation.

capability-hub -> identity
  access decision view / denied audit, not qualification profile mutation.
```

最终边界:

```text
Qualification definition truth
  only in L3-method-library

Member qualification truth
  only in L1-identity

Capability access / binding truth
  only in L3-capability-hub
```

---

## 六、与 RoleDefinition 模式的类比

当前 role 设计已经采用:

```text
L3-method-library
  RoleDefinition
    角色权威定义
        |
        | RoleDefinitionSnapshot
        v
L1-identity
  RoleCatalogEntry
    本地运行时索引
        |
        v
  GlobalMember.main_role_id
    成员引用角色
```

Qualification 可以采用类似模式:

```text
L3-method-library
  Qualification
    能力/技能/胜任力权威定义
        |
        | QualificationSnapshot
        v
L1-identity
  QualificationCatalogEntry
    本地运行时索引
        |
        v
  QualificationProfile
    成员实际能力画像
```

其中:

```text
Qualification
  是定义真相。

QualificationCatalogEntry
  是 identity 为运行时校验、查询和 drift 检测建立的本地索引。

QualificationProfile
  是某个成员实际具备哪些 Qualification 的持久画像。
```

---

## 七、为什么不把 CapabilityProfile 改成 Qualification

不建议把 identity 中的成员画像对象直接改成 `Qualification`,因为二者层次不同:

```text
Qualification
  标准定义。
  回答“这种技能/胜任力是什么”。

QualificationProfile
  成员画像。
  回答“这个成员实际具备哪些技能/胜任力”。
```

如果 identity 直接持有 `Qualification`,会导致:

```text
1. identity 变成能力定义真相源
2. method-library 的方法资产边界被绕开
3. 成员实际能力与能力标准定义混层
4. 后续 role / task / qualification 匹配难以做 drift 检测
```

因此:

```text
identity 不应定义 Qualification 正文。
identity 应持有 QualificationProfile,并引用 Qualification。
```

---

## 八、为什么 capability-hub 不拥有 Qualification 定义

`L3-capability-hub` 的职责是能力接入,不是方法资产定义。

它应该关注:

```text
MCP Server Registry
A2A Node Directory
ProviderContract
SecretRef
QualificationBinding
CapabilityAccessDecision
CostRecord
CapabilityAuditEntry
```

它不应该关注:

```text
Qualification 的标准语义正文
RoleDefinition / TaskDefinition 中如何使用 Qualification
Qualification 的方法资产发布治理
```

如果 capability-hub 也拥有 Qualification 定义,会出现:

```text
method-library 一套能力定义
capability-hub 一套能力定义
identity 一套成员能力自由文本
```

最终导致三套能力语义漂移。

正确方式:

```text
capability-hub 只引用 qualification_id,
并维护 QualificationBinding / access decision / provider contract。
```

---

## 九、对象关系建议

### 9.1 L3-method-library

```text
Qualification
  qualification_id
  name
  kind
  level_model
  evidence_policy
  lifecycle
  version
  fingerprint
```

```text
RoleDefinition
  provided_qualifications[]
```

```text
TaskDefinition
  required_qualifications[]
```

### 9.2 L1-identity

```text
QualificationCatalogEntry
  qualification_id
  qualification_name
  qualification_version
  source_ref
  fingerprint
  status
  updated_at
```

```text
QualificationProfile
  qualification_profile_id
  global_member_id
  qualifications[]
    qualification_id
    qualification_version
    qualification_fingerprint
    level
    confidence
    evidence_refs[]
  version
  updated_at
```

### 9.3 L3-capability-hub

```text
QualificationBinding
  qualification_id
  tool_refs[]
  provider_refs[]
  mcp_server_refs[]
  a2a_node_refs[]
  policy_refs[]
  cost_profile_ref
```

```text
CapabilityAccessDecision
  decision_id
  qualification_id
  context
  allowed
  denied_reason
  effective_bindings[]
  policy_snapshot_ref
```

---

## 十、需要后续正式修订的地方

如果本草案后续升级为正式决策,需要分批修订:

### 10.1 `L3-method-library`

- 在 MethodContent 体系中补入 `Qualification`
- 将 `RoleDefinition` 的能力字段统一为 `provided_qualifications`
- 将 `TaskDefinition` 的能力字段统一为 `required_qualifications`
- 补 `QualificationSnapshot`、publish / retire / fingerprint_changed 事件

### 10.2 `L1-identity`

- 将 `CapabilityProfile` 改名为 `QualificationProfile`
- 视需要新增 `QualificationCatalogEntry`
- 将 `UpdateCapabilityProfile` 改名为 `UpdateQualificationProfile`
- 将 `identity.member.capability_updated` 改名或兼容为 `identity.member.qualification_profile_updated`
- 保留兼容层或迁移说明,避免影响已启动实现

### 10.3 `L3-capability-hub`

- 仓名保持不变
- 内部对象使用 `QualificationBinding`
- 明确 `MCP Registry ≠ ToolDefinition ≠ Qualification`
- 明确 `CapabilityAccessDecision` 只是接入裁决,不是 runtime execution truth

### 10.4 `architecture/标准对齐全景图.md`

将 identity 对齐行中的:

```text
CapabilityDefinition
```

修正为:

```text
Qualification
```

或写成:

```text
Qualification(SPEM 中表达 skill / competency 的对象;本项目避免使用 CapabilityDefinition 作为标准名)
```

---

## 十一、当前不立即修改正式文档的原因

当前已有 agent 正在基于 `L1-identity` 文档进行实现。

如果立刻把 `CapabilityProfile` 全量改名为 `QualificationProfile`,会带来:

```text
1. 实施输入突然变化
2. 当前代码实现与设计文档不一致
3. 需要同步修改测试方案、验收标准、实施计划
4. 可能扩大变更面,干扰第一批实现闭环
```

因此当前采取:

```text
先沉淀草案,
不打断实现,
后续择机统一修订。
```

---

## 十二、当前建议

短期:

```text
继续允许 identity 实现沿用 CapabilityProfile,
但不要新增 CapabilityDefinition 到 identity。
```

中期:

```text
在 method-library 文档修订时补入 Qualification。
```

长期:

```text
将 identity 的 CapabilityProfile 收敛为 QualificationProfile,
并通过 QualificationCatalogEntry / QualificationSnapshot 与 method-library 对齐。
```

---

## 十三、结论

本草案的结论可以压缩为:

```text
严格 SPEM 命名下,不要使用 CapabilityDefinition 作为标准对象名,
应使用 Qualification。

method-library 拥有 Qualification 定义真相。
identity 拥有 QualificationProfile 成员画像。
capability-hub 仓名不变,但内部使用 QualificationBinding 表达工具 / provider / MCP / A2A 接入绑定。
```
