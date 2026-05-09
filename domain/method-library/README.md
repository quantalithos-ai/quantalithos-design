# method-library — 方法库域详细设计

> **域定位**:方法库域的详细设计文档。回答"按什么方法做"。聚合根是 **MethodContent**(抽象基类)+ 其六个具体子类:**RoleDefinition** / **TaskDefinition** / **WorkProductDefinition** / **ProcessTemplateDef** / **ViewProfile** / **AIPolicyDef**;MethodPlugin 和 MethodConfiguration 作为复用机制的聚合根。
>
> **上游依据**:
> - `product/最终目的.md` §3.5 关键节点强制人类 + §3.6 过程始终可观察
> - `product/六域模型.md` §9.3 方法库横切
> - `architecture/仓库拆分方案.md` §6.2 `quantalithos-method-library`
> - `architecture/标准对齐全景图.md` §二 `quantalithos-method-library`
> - `methodology/standards-discussion/SPEM-2.0.md`(本域的元模型基石)
> - `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(8 种生命周期模型 → ProcessTemplateDef 家族)
> - `methodology/standards-discussion/ISO-IEC-29110.md`(Profile Group 裁剪机制)
> - `methodology/standards-discussion/ISO-42001.md` §5.2(AI Policy 存储)
> - ADR-0005(Role → Image 映射 via RoleDefinition.image_variant)
> - ADR-0008(ActivityDef.completion_policy 作为 ProcessTemplateDef 的组成)
> - ADR-0009(ViewProfile 作为第四类方法资产)
> - 14 标准主对齐:**SPEM 2.0 + 24748-2 + 29110**;次对齐:12207 / CMMI / 42001
>
> **本文不承载**:Method Content 的**运行时执行**(在 process 域 / L2 Runtime)/ Role 的生命周期状态机(在 identity)/ Gate 决策(在 governance,本域只**请求** Gate)/ Marketplace 的商业规则(在 marketplace 仓)。

---

## 一、使命与边界

### 1.1 使命

**承载"按什么方法做"—— Quantalithos 方法资产的单一真相源**。

本域是 **SPEM 2.0 Method Content + ISO 24748-2 生命周期模型家族 + ISO 29110 Profile 裁剪机制 + ISO 42001 §5.2 AI Policy 存储** 四套国际标准的综合落地,并借 ViewProfile(ADR-0009)将"方法资产"概念扩展到视图策略。

具体职责:
- **MethodContent 抽象聚合**:所有方法资产的共同骨架(版本 / 发布 Gate / fingerprint / 分类)
- **六种具体 Method Content 子类**:
  - `RoleDefinition` — SPEM 2.0 RoleDefinition + ADR-0005 image_variant
  - `TaskDefinition` — SPEM 2.0 TaskDefinition(步骤 / 输入输出 / 指导)
  - `WorkProductDefinition` — SPEM 2.0 WorkProductDefinition(制品形态 / 验收标准模板)
  - `ProcessTemplateDef` — SPEM 2.0 Process + 24748-2 生命周期模型 + BPMN Activity 图
  - `ViewProfile`(ADR-0009)— Role 看某对象的字段可见性 / 脱敏 / 派生字段
  - `AIPolicyDef`(42001 §5.2)— 组织级 AI 方针 / 目标 / 原则
- **MethodPlugin 聚合根**:SPEM 2.0 Method Plugin 机制,多个 MethodContent 打包分发
- **MethodConfiguration 聚合根**:SPEM 2.0 Method Configuration,选择 Plugin 子集组装成可用方法集
- **Tailoring 预设**:29110 Profile Group(entry / basic / intermediate / advanced)的模板
- **Publish 流水线**:草稿 → 评审 → 发布 Gate → published,全程留痕
- **fingerprint 管理**:内容哈希签名,下游(process / identity / governance)通过 fingerprint 校验一致性
- **Marketplace 接入点**:对外暴露资产元数据,供 marketplace 上架 / 下架 / 订阅

### 1.2 边界(不做的事)

- **不执行 Method Content** —— 那是 process 域(Template 执行)/ L2 Runtime(Task 执行)/ UI 仓(ViewProfile 消费)
- **不管 Role 的生命周期** —— identity 域持有 GlobalMember.role 引用及状态;本域只管 RoleDefinition 本身的版本
- **不做 Gate 决策** —— 本域发起 publish Gate,governance 决策
- **不做身份认证** —— 编辑权限检查是 identity + governance 的职责
- **不做 Marketplace 定价 / 交易** —— 那是 marketplace 仓
- **不存 Policy 的运行时规则缓存** —— 那是 L2 capability-hub 和 Runtime
- **不直接改 process 域的 ProcessTemplate** —— 发事件,process 订阅后同步索引

### 1.3 与其他域的协作全景

```
┌──────────────────────────────────────────────────────────────────┐
│  method-library 域(本文)                                       │
│  MethodContent(6 子类)+ MethodPlugin + MethodConfiguration     │
└──┬────────────────┬────────────────┬──────────────────┬──────────┘
   │ 发事件          │ 发事件          │ 发事件            │ 被订阅
   ▼                ▼                ▼                   ▼
 process         identity         governance          UI 仓 +
 (Template 索引) (Role 引用)      (Policy 引用)       marketplace
```

### 1.4 与"八条原则"的对应

对齐 `六域模型.md` §2.3 八条原则:
- **A** 六域平权 → 本域不是"主",而是方法资产的单一源
- **B** Definition vs Use 严格分离 → 本域只定义,不执行(核心对齐 SPEM)
- **C** 事件编织 → MethodContent 变更发事件,多域订阅
- **D** 索引/内容分离 → 本域是"内容源",下游持有索引副本
- **F** 过程模板 + 裁剪 + 实例三段式 → 本域承载前两段(Template + Profile Group 预设)
- **H** 可观察性内置 → 每次发布 / 更新 / 弃用都发事件

---

## 二、聚合根详细设计

### 2.1 MethodContent 抽象(所有子类的共同骨架)

> MethodContent 本身不独立存在,它是 6 种具体子类的共同字段抽象。每种子类**是独立聚合根**(有自己的 ID / 生命周期 / 事件),共享下面的骨架。

#### 2.1.1 共同字段

```
MethodContent(abstract) {
    content_id:              ULID,                    // 各子类独立 ID 空间
    kind:                    MethodContentKind,       // role-def / task-def / work-product-def /
                                                      //  process-template / view-profile / ai-policy

    // SPEM 元数据
    name:                    String,                  // "scrum-developer" / "security-review"
    display_name:            String,
    version:                 Semver,
    language:                LanguageCode,            // 多语言支持(zh / en / ...)

    // 分类与检索
    categories:              Vec<CategoryRef>,        // 可打多个分类标签
    tags:                    Vec<String>,
    search_keywords:         Vec<String>,

    // 描述性内容(SPEM ManagedContent)
    description_md:          String,                  // 主描述(markdown)
    purpose:                 String,                  // 使命 / 目的
    guidance:                Vec<GuidanceRef>,        // 指导材料(示例 / 模板 / 检查表)
    examples:                Vec<ExampleRef>,

    // 发布与生命周期
    lifecycle:               MethodContentLifecycle,  // draft / in_review / published /
                                                      //  deprecated / retired
    created_by:              ActorRef,
    created_at:              Timestamp,
    published_at:            Option<Timestamp>,
    deprecated_at:           Option<Timestamp>,
    retired_at:              Option<Timestamp>,
    approved_via_gate:       Option<GateRef>,         // publish Gate 引用

    // 版本链
    supersedes:              Option<ContentId>,
    superseded_by:           Option<ContentId>,

    // 一致性保护
    fingerprint:             String,                  // 内容哈希(SHA-256 of canonical JSON)
    signed_by:               Option<ActorRef>,        // 可选:SPEM MethodPlugin 签名

    // 所属 Plugin(若有)
    plugin_ref:              Option<MethodPluginRef>,

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.1.2 生命周期状态机(共享)

```
       [Create]
           │
           ▼
      ┌─────────┐   ask_review   ┌─────────────┐   pass     ┌──────────┐
      │  draft  │ ─────────────→ │  in_review  │ ─────────→ │published │
      └─────────┘                └─────────────┘            └────┬─────┘
           │                            │                         │
           │                            │ reject(回 draft)       │ deprecate
           │                            ▼                         ▼
           │                       ┌─────────┐               ┌──────────┐
           │                       │  draft  │               │deprecated│
           │                       └─────────┘               └────┬─────┘
           │                                                      │ retire
           │                                                      ▼
           │                                                 ┌────────┐
           │                                                 │retired │
           │                                                 └────────┘
           │ 任意 active 状态下可 cancel
           ▼
      ┌───────────┐
      │ cancelled │
      └───────────┘
```

- `published` 要经 Gate(kind=custom + metadata.gate_subkind=method-content-publish),不得直接从 draft 跳过
- `retired` 之前必须 `deprecated` 至少 30 天(给下游迁移时间,可通过 Policy 调整)
- `cancelled` 只能从 draft / in_review 转入(已发布的只能 deprecate → retire)

#### 2.1.3 MethodContent 共同不变量(INV-ML-1 到 INV-ML-10)

**INV-ML-1** `content_id` 永不复用(同类子类内唯一)
**INV-ML-2** `lifecycle=published` 必须有 `approved_via_gate` 且该 Gate 已 decided=approve
**INV-ML-3** `lifecycle=published` 后 **核心字段不可修改**(name / kind / 结构主体),要改发新版本 + supersede
**INV-ML-4** `fingerprint` 每次字段变更自动重算,变更必发事件(下游检测 drift)
**INV-ML-5** `version` 遵循语义化版本:major 变更 = 破坏性(须 breaking-change Gate);minor = 功能新增;patch = 修复
**INV-ML-6** `superseded_by` 单向,一旦指向不可改
**INV-ML-7** `deprecated → retired` 必须间隔 ≥ 30 天(可 Policy 覆盖)
**INV-ML-8** `language` 设定后不可修改;跨语言通过多版本(同 name 不同 language)承载
**INV-ML-9** `categories` 必须来自组织定义的 Category 词表(受控词表)
**INV-ML-10** `guidance` / `examples` 指向的 Artifact 必须处于 approved 状态或本域内部草稿

---

### 2.2 RoleDefinition 聚合(SPEM 2.0 RoleDefinition)

#### 2.2.1 完整字段

```
RoleDefinition : MethodContent {
    // 继承 MethodContent 全部字段 +

    // SPEM RoleDefinition 核心
    responsibilities:        Vec<Responsibility>,     // 职责清单
    required_capabilities:   Vec<CapabilityRef>,      // 需要的 Capability(→ identity)
    required_skills:         Vec<SkillRequirement>,   // 技能要求
    performing_tasks:        Vec<TaskDefinitionRef>,  // 本 Role 可执行的 Task 清单

    // ADR-0005:镜像变体映射
    image_variant:           ImageVariant {
        base_image:          String,                  // 如 "python-dev:3.11"
        language_preset:     Option<String>,          // 预装语言工具链
        tool_preset:         Vec<ToolRef>,            // 预装工具
        resource_class:      ResourceClass,           // small / medium / large
    },

    // 默认 Policy 绑定
    default_tool_scope:      Vec<ToolRef>,            // 默认可用工具
    default_autonomy_level:  AutonomyLevel,           // 默认自主级别
    default_policy_refs:     Vec<PolicyRef>,          // 关联的默认 Policy

    // 合规属性
    compliance_tags:         Vec<ComplianceTag>,      // 如 ["42001-A.3-Operator", "PII-handler"]

    // UI 展示
    display_icon:            Option<String>,
    display_color:           Option<String>,
}
```

#### 2.2.2 不变量(INV-ML-11 到 INV-ML-15)

**INV-ML-11** `performing_tasks` 指向的 TaskDefinition 必须至少有一个 published(允许引用 draft 但必须有 published 候选)
**INV-ML-12** `image_variant.base_image` 必须在组织的镜像白名单(member-images 仓维护)
**INV-ML-13** `default_autonomy_level` 必须 ≤ 4(全自主 5 级不允许在 Role 层默认;必须项目级显式授权)
**INV-ML-14** `required_capabilities` 变更必须发 `method_library.role_definition.capabilities_changed` 事件,identity 域据此检查存量 GlobalMember
**INV-ML-15** Retire RoleDefinition 前必须检查 identity 没有 active GlobalMember 引用该 Role

### 2.3 TaskDefinition 聚合(SPEM 2.0 TaskDefinition)

#### 2.3.1 完整字段

```
TaskDefinition : MethodContent {
    // 继承 MethodContent +

    // SPEM TaskDefinition 核心
    steps:                   Vec<Step {
        step_id:             String,
        name:                String,
        description_md:      String,
        order:               i32,
    }>,

    inputs:                  Vec<ParameterSpec {
        name:                String,
        work_product_def_ref: WorkProductDefRef,
        optionality:         enum { mandatory / optional },
        cardinality:          enum { one / many },
    }>,
    outputs:                 Vec<ParameterSpec>,      // 同 inputs 结构

    performing_roles:        Vec<RoleDefinitionRef>,  // 由哪些 Role 可执行
    additionally_performed_by: Vec<RoleDefinitionRef>, // 辅助 Role

    // 估算与执行提示
    estimated_effort:        Option<EffortEstimate>,  // 点数 / 小时 / T-shirt
    estimated_duration:      Option<Duration>,
    complexity:              Complexity,              // low / medium / high

    // 方法论关联
    applicable_methodologies: Vec<MethodologyTag>,    // scrum / kanban / xp / ...
}
```

#### 2.3.2 不变量(INV-ML-16 到 INV-ML-18)

**INV-ML-16** `steps` 至少 1 步,按 `order` 递增唯一
**INV-ML-17** `performing_roles` 非空 —— Task 必须至少有一个可执行 Role
**INV-ML-18** `inputs` / `outputs` 指向的 WorkProductDefinition 必须是已 published 或同 Plugin 内的 draft

---

### 2.4 WorkProductDefinition 聚合(SPEM 2.0 WorkProductDefinition)

#### 2.4.1 完整字段

```
WorkProductDefinition : MethodContent {
    // 继承 MethodContent +

    // SPEM WorkProductDefinition 核心
    work_product_kind:       WorkProductKind,         // 对齐 artifact.kind 的白名单
    expected_format:         Format,                  // markdown / pdf / json / code / image / ...
    template_artifact_ref:   Option<ArtifactRef>,     // 模板文件

    // 验收模板(套用到具体 Artifact 时复制)
    acceptance_criteria_template: Vec<AcceptanceCriterion>,
    quality_checks:          Vec<QualityCheckSpec>,   // lint / test / review 检查项

    // 关联
    produced_by_tasks:       Vec<TaskDefinitionRef>,  // 哪些 Task 可产出
    consumed_by_tasks:       Vec<TaskDefinitionRef>,  // 哪些 Task 会消费

    // 合规属性
    baseline_policy:         BaselinePolicyHint,      // baseline / non-baseline / conditional
    retention_hint:          Option<Duration>,        // 建议保留期(artifact 参照)
}
```

#### 2.4.2 不变量(INV-ML-19 到 INV-ML-20)

**INV-ML-19** `work_product_kind` 必须在 artifact 域声明的 WorkProductKind 白名单内(一致性保护)
**INV-ML-20** `acceptance_criteria_template` 至少 1 条,避免"无标准"的 WorkProduct

---

### 2.5 ProcessTemplateDef 聚合(SPEM Process + 24748-2 + BPMN)

#### 2.5.1 完整字段

```
ProcessTemplateDef : MethodContent {
    // 继承 MethodContent +

    // 24748-2 生命周期家族
    family:                  LifecycleFamily,         // 8 种:waterfall / v-model /
                                                      //  incremental / evolutionary /
                                                      //  iterative / spiral /
                                                      //  agile-scrum / agile-kanban /
                                                      //  agile-safe / devops

    // BPMN Process 定义(本域是源;process 域拿去生成执行索引)
    activity_graph:          BPMNActivityGraphDef {
        activities:          Vec<ActivityDef>,        // 含 completion_policy(ADR-0008)
        sequence_flows:      Vec<SequenceFlowDef>,
        gateways:            Vec<GatewayDef>,
        events:              Vec<EventDef>,
    },
    lifecycle_model:         LifecycleModelDef {
        stages:              Vec<StageDef>,
        stage_sequence_mode: StageSequenceMode,
    },

    // Role / Artifact / Gate 契约
    roles_required:          Vec<RoleDefinitionRef>,
    artifacts_required:      Vec<(WorkProductDefRef, StageRef, bool /* optional */)>,
    gates_required:          Vec<GateRequirementDef>,

    // 29110 Profile Group 预设(Tailoring 起点)
    profile_group_presets:   Vec<ProfileGroupPreset {
        group:               ProfileGroup,            // entry / basic / intermediate / advanced
        tailoring_default:   TailoringTemplate,       // 本 Group 默认的裁剪规则
    }>,
}
```

#### 2.5.2 不变量(INV-ML-21 到 INV-ML-26)

**INV-ML-21** `activity_graph` 必须通过 BPMN 2.0 schema 校验(调用 process 域提供的验证器)
**INV-ML-22** `family` 设定后不可修改(要改发新 Template)
**INV-ML-23** `roles_required` / `artifacts_required` 指向的 MethodContent 必须 published 或同 Plugin draft
**INV-ML-24** `gates_required.mandatory=true` 的 Gate 在 29110 Tailoring 时不可被 Reduction 移除
**INV-ML-25** 每个 `ActivityDef` 必须声明 `completion_policy`(ADR-0008 INV,未声明视为 `auto_complete`)
**INV-ML-26** `ActivityDef.completion_policy=raise_gate / try_auto_then_gate` 的 gate_kind 必须来自 governance 已定义的 10 种用户可见 kind(ADR-0008 锁定)

---

### 2.6 ViewProfile 聚合(ADR-0009 新增)

#### 2.6.1 完整字段

```
ViewProfile : MethodContent {
    // 继承 MethodContent +

    // 匹配条件
    applies_to_role:         RoleDefinitionRef,       // 哪个 Role 看的视图
    applies_to_object_kind:  ObjectKind,              // project / workitem / activity /
                                                      //  gate / artifact / member / turn
    scope:                   ProfileScope,            // organization / project / role-specific

    // 字段可见性
    visible_fields:          Vec<FieldSelector>,      // JSONPath 白名单
    hidden_fields:           Vec<FieldSelector>,      // JSONPath 黑名单(优先级高)
    masked_fields:           Vec<MaskRule {
        path:                FieldPath,
        strategy:            MaskStrategy,            // partial / hash / redact / truncate
        mask_char:           Option<String>,
    }>,

    // 派生字段
    derived_fields:          Vec<DerivedField {
        name:                String,
        expression:          DerivationExpr,          // 受限表达式(见 §2.6.3)
        description:         String,
        type_hint:           TypeHint,                // string / number / enum / label
    }>,

    // 看板级展示
    default_grouping:        Option<FieldPath>,
    default_sorting:         Vec<SortRule>,
    default_filters:         Vec<FilterRule>,

    // 降级行为
    fallback_when_unmatched: enum { show_all / deny },  // 生产期必须 deny
}

FieldSelector = String                                 // 如 "project.backlog.items[].priority"
```

#### 2.6.2 不变量(INV-ML-27 到 INV-ML-32)

**INV-ML-27** `visible_fields` 和 `hidden_fields` 同路径冲突时,**hidden 优先**(ADR-0009 INV-V2)
**INV-ML-28** `applies_to_role` 指向的 RoleDefinition 必须 published
**INV-ML-29** `masked_fields` 的 path 必须在对象 schema 中存在(生成期校验)
**INV-ML-30** `derived_fields.expression` 必须通过受限表达式 DSL 校验,不允许执行任意代码
**INV-ML-31** 同一 (applies_to_role, applies_to_object_kind, scope, scope_target) 组合最多一个 active ViewProfile
**INV-ML-32** `fallback_when_unmatched=show_all` 仅允许 `lifecycle=draft` 或开发期组织,生产组织必须 `deny`

#### 2.6.3 派生字段表达式 DSL(受限)

为安全,`derived_fields.expression` 使用受限表达式语言,不允许执行任意代码:

- 允许:字段读取(`$.project.workitems[].state`)、常见聚合(`count` / `sum` / `percent`)、条件(`if / then / else`)、字面量
- 不允许:循环、递归、调用任意函数、外部 IO、时间获取(需用派生字段提供的 `now()`)
- 引擎:沙箱化 JSONLogic / CEL(Google Common Expression Language)等候选之一,本 ADR 暂不锁定,由后续独立 ADR 决策

---

### 2.7 AIPolicyDef 聚合(42001 §5.2)

#### 2.7.1 完整字段

```
AIPolicyDef : MethodContent {
    // 继承 MethodContent +

    // 42001 §5.2 AI 方针
    policy_statements:       Vec<PolicyStatement {
        clause_id:           String,                  // 可引用的条款号
        text_md:             String,                  // 条款正文
        rationale:           String,                  // 依据
        references:          Vec<ReferenceRef>,       // 对应 42001 / ISO 标准条款
    }>,

    // AI 目标(42001 §6.2)
    ai_objectives:           Vec<AIObjective {
        objective_id:        String,
        statement:           String,
        measurable_target:   String,                  // 如 "误判率 < 2%"
        review_cycle:        Duration,                // 如每季度
    }>,

    // 责任链(42001 §5.3 + A.3)
    actor_responsibilities:  Vec<ActorResponsibility {
        actor_kind:          enum { provider / developer / operator / subject },
        responsibilities:    Vec<String>,
    }>,

    // 关联
    enforces_policies:       Vec<PolicyRef>,          // 对应 governance.Policy 的具体规则
    applies_to_roles:        Vec<RoleDefinitionRef>,  // 本方针适用的 Role
}
```

#### 2.7.2 不变量(INV-ML-33 到 INV-ML-35)

**INV-ML-33** `policy_statements` 至少 1 条;每条 clause_id 在本 AIPolicyDef 内唯一
**INV-ML-34** `ai_objectives.measurable_target` 必须可被 observability 的指标引用(字符串需可解析)
**INV-ML-35** `actor_responsibilities` 至少覆盖 provider / operator 两种(42001 最小要求)

### 2.8 MethodPlugin 聚合(SPEM 2.0 Method Plugin)

> MethodPlugin 是**多个 MethodContent 的打包单元**,支持整体发布、依赖声明、Marketplace 分发。一个 Plugin 包含若干 RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef。

#### 2.8.1 完整字段

```
MethodPlugin {
    plugin_id:               ULID,

    // 元数据
    name:                    String,                  // "scrum-standard" / "fintech-compliance"
    display_name:            String,
    version:                 Semver,
    description_md:          String,

    // 内容清单
    contained_contents:      Vec<ContentRef {
        content_id:          ContentId,
        kind:                MethodContentKind,
        version:             Semver,
    }>,

    // 依赖声明
    depends_on_plugins:      Vec<PluginDependency {
        plugin_ref:          MethodPluginRef,
        version_constraint:  SemverRange,             // ">=1.2.0, <2.0.0"
    }>,

    // 发布信息
    publisher:               ActorRef,                // 组织 / user / 外部供应商
    license:                 License,                 // MIT / Apache-2 / proprietary / ...
    marketplace_metadata:    Option<MarketplaceMeta>, // 上架信息

    // 签名与完整性
    plugin_fingerprint:      String,                  // 整个 plugin 的内容哈希
    signature:               Option<PluginSignature>, // 可选:发布者签名

    // 生命周期
    lifecycle:               PluginLifecycle,         // draft / published / deprecated / retired
    published_at:            Option<Timestamp>,
    approved_via_gate:       Option<GateRef>,

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.8.2 不变量(INV-ML-36 到 INV-ML-40)

**INV-ML-36** `plugin_id` 永不复用
**INV-ML-37** Plugin 发布必经 Gate(kind=custom + metadata.gate_subkind=plugin-publish);含"外部供应商"发布的 Plugin 走 marketplace-review Gate
**INV-ML-38** `contained_contents` 中每个 MethodContent 的 `plugin_ref` 必须指回本 plugin_id(双向一致)
**INV-ML-39** 循环依赖禁止:`depends_on_plugins` 必须 DAG
**INV-ML-40** `plugin_fingerprint` 在任一内含 Content 变更时自动重算并发事件

---

### 2.9 MethodConfiguration 聚合(SPEM 2.0 Method Configuration)

> MethodConfiguration 是**组织或项目级的方法集组装**:选哪些 Plugin、哪些 Plugin 里的哪些 Content、是否覆盖某个字段。

#### 2.9.1 完整字段

```
MethodConfiguration {
    configuration_id:        ULID,

    // 所属范围
    scope:                   ConfigurationScope,      // organization / project / role
    scope_target:            Option<ScopeTarget>,

    // 组装
    selected_plugins:        Vec<SelectedPlugin {
        plugin_ref:          MethodPluginRef,
        version_lock:        Semver,                  // 精确锁定版本
        included_contents:   InclusionPolicy,         // all / subset(selected_content_ids)
    }>,

    // 覆盖(Variability,SPEM 核心机制)
    variability_applications: Vec<VariabilityApplication {
        target_content_id:   ContentId,
        override_kind:       OverrideKind,            // replace / extend / contribute
        patch:               JsonPatch,               // 对目标 Content 字段的 patch
        rationale:           String,
    }>,

    // 派生产物
    effective_content_set:   Vec<ContentRef>,         // 应用 Variability 后的最终 Content 集合
    effective_fingerprint:   String,

    // 生命周期
    lifecycle:               ConfigurationLifecycle,  // draft / active / superseded / retired
    effective_from:          Timestamp,
    effective_until:         Option<Timestamp>,
    approved_via_gate:       Option<GateRef>,

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.9.2 不变量(INV-ML-41 到 INV-ML-45)

**INV-ML-41** `selected_plugins.version_lock` 必须是已 published 的版本
**INV-ML-42** Configuration active 后 `selected_plugins` 和 `variability_applications` 不可修改;要改走 supersede
**INV-ML-43** `override_kind=replace` 的 patch 不得移除 `mandatory=true` 的 GateRequirementDef(对齐 29110 Profile 强约束)
**INV-ML-44** 同 `scope + scope_target` 最多一个 active Configuration(unique partial index)
**INV-ML-45** Configuration 编辑涉及跨 Plugin 的依赖冲突(版本不兼容)立即拒绝

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.method_library.v1;

service MethodLibraryService {
    // === MethodContent 通用 CRUD(各子类走子服务或 kind 区分)===
    rpc DraftContent(DraftContentRequest) returns (DraftContentResponse);
    rpc UpdateContent(UpdateContentRequest) returns (UpdateContentResponse);  // draft / in_review 可改
    rpc SubmitForReview(SubmitForReviewRequest) returns (SubmitForReviewResponse);
    rpc PublishContent(PublishContentRequest) returns (PublishContentResponse);
      // 内部:Gate decided 后调用,状态转 published
    rpc DeprecateContent(DeprecateContentRequest) returns (DeprecateContentResponse);
    rpc RetireContent(RetireContentRequest) returns (RetireContentResponse);

    rpc GetContent(GetContentRequest) returns (MethodContent);
    rpc ListContents(ListContentsRequest) returns (ListContentsResponse);
    rpc SearchContents(SearchContentsRequest) returns (SearchContentsResponse);

    // === 子类专用查询(便于下游域)===
    rpc GetRoleDefinition(GetRoleDefinitionRequest) returns (RoleDefinition);
    rpc GetTaskDefinition(GetTaskDefinitionRequest) returns (TaskDefinition);
    rpc GetWorkProductDefinition(GetWorkProductDefinitionRequest)
        returns (WorkProductDefinition);
    rpc GetProcessTemplateDef(GetProcessTemplateDefRequest)
        returns (ProcessTemplateDef);
    rpc GetViewProfile(GetViewProfileRequest) returns (ViewProfile);
    rpc GetAIPolicyDef(GetAIPolicyDefRequest) returns (AIPolicyDef);

    // === ViewProfile 匹配(UI 仓高频调用)===
    rpc ResolveViewProfile(ResolveViewProfileRequest)
        returns (ResolveViewProfileResponse);
      // 按 (role, object_kind, scope, scope_target) 匹配最合适的 active ViewProfile

    // === MethodPlugin ===
    rpc CreatePlugin(CreatePluginRequest) returns (CreatePluginResponse);
    rpc PublishPlugin(PublishPluginRequest) returns (PublishPluginResponse);
    rpc GetPlugin(GetPluginRequest) returns (MethodPlugin);
    rpc ListPluginsForPublisher(ListPluginsForPublisherRequest)
        returns (ListPluginsForPublisherResponse);

    // === MethodConfiguration ===
    rpc DraftConfiguration(DraftConfigurationRequest)
        returns (DraftConfigurationResponse);
    rpc ActivateConfiguration(ActivateConfigurationRequest)
        returns (ActivateConfigurationResponse);
    rpc SupersedeConfiguration(SupersedeConfigurationRequest)
        returns (SupersedeConfigurationResponse);
    rpc GetActiveConfiguration(GetActiveConfigurationRequest)
        returns (MethodConfiguration);
      // 给定 scope + scope_target,返回当前 active Configuration

    // === Fingerprint 校验(下游同步用)===
    rpc VerifyContentFingerprint(VerifyContentFingerprintRequest)
        returns (VerifyContentFingerprintResponse);
    rpc GetContentDigest(GetContentDigestRequest) returns (ContentDigest);
      // 返回 (content_id, version, fingerprint, last_modified),便于增量同步
}
```

### 3.2 关键请求示例

#### ResolveViewProfile(ADR-0009 的 UI 消费入口)

```proto
message ResolveViewProfileRequest {
    string role_id = 1;                           // 当前用户的 Role
    string object_kind = 2;                       // "project" / "workitem" / ...
    optional string scope_target = 3;             // 若 scope=project 则传 project_id
}

message ResolveViewProfileResponse {
    optional ViewProfile profile = 1;             // 匹配到的最合适 Profile
    enum MatchKind { ORG_DEFAULT = 0; ROLE_SCOPED = 1; PROJECT_OVERRIDE = 2; FALLBACK = 3; }
    MatchKind matched_by = 2;
    string fingerprint = 3;                       // 便于客户端缓存
}
```

匹配优先级:`role-specific + project scope` > `role-specific + org scope` > `org default` > fallback。

#### PublishContent(需要 Gate 前置)

```proto
message PublishContentRequest {
    string content_id = 1;
    string approved_gate_id = 2;                  // governance.Gate 引用,必须 decided=approve
    audit.ActorContext actor = 3;
}

message PublishContentResponse {
    string content_id = 1;
    string version = 2;
    string fingerprint = 3;
    google.protobuf.Timestamp published_at = 4;
}
```

### 3.3 权限与认证

- **内部**:mTLS + 白名单服务
- **外部(Console / method-editor UI)**:OAuth2
- **编辑权限**:
  - Draft / Update / SubmitForReview:Role 具备 `method_author` Capability
  - Publish / Deprecate / Retire:必须有对应 Gate 决策证据
  - Marketplace-related Plugin 发布:必须 `marketplace-review` Gate
- **读权限**:
  - Published Content:组织内全可读
  - Draft / in_review:仅作者 + 指定 reviewer 可读
  - 跨组织(Marketplace 上架后):按 License 和可见范围控制

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Search 类 RPC **不接受 Role 参数**,返回全量字段。方法编辑器本身的权限分层由 Role + Policy 控制"能不能编辑",而非"看不看得到字段"。

### 3.4 常见错误码

- `CONTENT_NOT_FOUND` / `PLUGIN_NOT_FOUND` / `CONFIGURATION_NOT_FOUND`
- `PUBLISH_REQUIRES_APPROVED_GATE`(INV-ML-2)
- `CONTENT_PUBLISHED_IS_IMMUTABLE`(INV-ML-3)
- `FINGERPRINT_MISMATCH`(下游同步时)
- `PLUGIN_CYCLIC_DEPENDENCY`(INV-ML-39)
- `CONFIGURATION_REMOVES_MANDATORY_GATE`(INV-ML-43)
- `DERIVED_EXPRESSION_INVALID`(INV-ML-30)
- `VIEW_PROFILE_DUPLICATE_ACTIVE`(INV-ML-31)

---

## 四、事件 schema 细节

### 4.1 事件清单

#### MethodContent 级

| 事件 | 订阅方 |
|---|---|
| `method_library.content.drafted` | observability |
| `method_library.content.submitted_for_review` | governance(可能触发 publish Gate) |
| `method_library.content.published` | 按 kind 分发(见下)/ observability |
| `method_library.content.fingerprint_changed` | **核心 drift 防护**:所有持索引的下游域 |
| `method_library.content.deprecated` | 持索引的下游域(告警) |
| `method_library.content.retired` | 持索引的下游域(拒绝新引用) |
| `method_library.content.superseded` | 持索引的下游域 |

#### 按 kind 分发的 published 子事件

| 事件 | 订阅方 |
|---|---|
| `method_library.role_definition.published` | **identity(Role 索引同步)** / member-images(镜像预构建)/ observability |
| `method_library.role_definition.capabilities_changed`(INV-ML-14) | identity(重评存量 Member) |
| `method_library.task_definition.published` | observability |
| `method_library.work_product_definition.published` | **artifact(WorkProductKind 白名单同步)** / observability |
| `method_library.process_template.published` | **process(Template 索引同步)** / observability |
| `method_library.view_profile.published`(ADR-0009) | **console / chat / mobile(UI 缓存失效)** / marketplace / observability |
| `method_library.view_profile.deprecated / retired` | UI 仓(切换降级 Profile) |
| `method_library.ai_policy.published` | **governance(AIPolicy 条款同步)** / observability |

#### MethodPlugin / MethodConfiguration 级

| 事件 | 订阅方 |
|---|---|
| `method_library.plugin.published` | marketplace / observability |
| `method_library.plugin.deprecated / retired` | marketplace / 持索引的下游域 |
| `method_library.configuration.activated` | **所有 L1 域 + UI 仓(生效方法集同步)** / observability |
| `method_library.configuration.superseded` | 同上 |

### 4.2 核心事件 schema

#### method_library.content.fingerprint_changed(drift 防护核心)

```
type:       method_library.content.fingerprint_changed
subject:    content_id
severity:   warning

data: {
    content_id,
    kind,
    name,
    version,
    old_fingerprint,
    new_fingerprint,
    changed_fields:            Vec<FieldPath>,        // 变更了哪些字段
    change_triggered_by:       ActorRef,
    change_reason:             String,                // "typo fix" / "new requirement" / ...
    affects_downstream:        Vec<DownstreamRef>,    // 预计受影响的下游对象(已索引)
    trace_id,
}
```

下游订阅方(process / identity / artifact / governance)据此:
- **draft / in_review 阶段**:仅记录变更,不告警
- **published 阶段**:核心字段变更 → 立即重算下游索引 + 发 `source_drift` 告警(如 process 的 `process.template.source_drift`)

#### method_library.role_definition.published

```
type:       method_library.role_definition.published
subject:    content_id

data: {
    content_id,
    name,                       // "scrum-developer"
    version,
    fingerprint,
    image_variant:  {base_image, language_preset, tool_preset, resource_class},
    default_tool_scope,
    default_autonomy_level,
    performing_tasks:           Vec<TaskDefRef>,
    approved_via_gate:          GateRef,
    trace_id,
}
```

identity 订阅:更新 Role 索引表,刷新对应 GlobalMember 的快照(但不改 active 状态)。

#### method_library.view_profile.published(ADR-0009 UI 缓存失效)

```
type:       method_library.view_profile.published
subject:    content_id

data: {
    content_id,
    name,
    version,
    fingerprint,
    applies_to_role,
    applies_to_object_kind,
    scope,
    scope_target,
    supersedes:                 Option<ContentId>,
    approved_via_gate:          GateRef,
    trace_id,
}
```

UI 仓订阅:本地缓存失效,按需重新 Resolve;已打开的页面可选择热刷新或下次访问刷新(由 UX 决定)。

#### method_library.configuration.activated(方法集切换)

```
type:       method_library.configuration.activated
subject:    configuration_id

data: {
    configuration_id,
    scope,
    scope_target,
    effective_content_set:      Vec<ContentRef>,
    effective_fingerprint,
    supersedes:                 Option<ConfigurationId>,
    effective_from,
    approved_via_gate:          GateRef,
    trace_id,
}
```

跨域影响面最大,severity=major;所有下游域必须在 24h 内完成同步,否则发 `configuration_drift` 告警。

### 4.3 订阅事件(来自其他域)

| 来源 | 事件 | 本域动作 |
|---|---|---|
| governance | `governance.gate.decided(kind=custom, subkind=method-content-publish)` | 调用 PublishContent 推进 lifecycle |
| governance | `governance.gate.decided(kind=custom, subkind=plugin-publish)` | 推进 Plugin 发布 |
| governance | `governance.gate.decided(kind=marketplace-review)` | 外部 Plugin 上架 |
| governance | `governance.policy.updated`(涉及方法资产时)| 重评 Content / Plugin 合规性 |
| identity | `identity.role.retired` | 检查 RoleDefinition 是否可随 Role 一起 retire |
| artifact | `artifact.work_product_kind.added` | 更新 WorkProductKind 白名单,允许 WorkProductDefinition 引用 |
| observability | 周期(每日)| 扫描 deprecated Content,超过 retention 期自动转 retired |
| marketplace | `marketplace.plugin.subscribed` | 记录订阅关系,Plugin 新版本发布时通知订阅方 |

### 4.4 事件幂等

- `method_library.content.published` 幂等 key:`content_id + version`
- `method_library.content.fingerprint_changed` 幂等 key:`content_id + old_fingerprint + new_fingerprint`
- `method_library.configuration.activated` 幂等 key:`configuration_id + version`
- 所有订阅方用 event_id LRU 去重

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**理由**:
- MethodContent 聚合根字段复杂(大 JSONB),PG 的 JSONB 索引能力够用
- 版本链 + 依赖图是典型关系型结构(supersedes / superseded_by / depends_on_plugins)
- 全文搜索(SearchContents)走 PG tsvector 起步,后期按需上 ES
- 与其他域同栈便于运维

**大资源存储**:
- `template_artifact_ref` / `guidance` / `examples` 指向的实际文件(模板 .md / 图片 / zip)不入 PG,由 artifact 域承载
- 本域只存引用 + fingerprint 校验

### 5.2 表结构

#### table: `method_contents`(所有 MethodContent 子类共用主表)

| 列 | 类型 | 约束 |
|---|---|---|
| content_id | ULID PK | |
| kind | enum | not null(role-def / task-def / ...) |
| name | varchar(256) | not null |
| display_name | varchar(512) | |
| version | varchar(32) | not null |
| language | varchar(16) | not null default 'en' |
| categories | jsonb default '[]' | |
| tags | jsonb default '[]' | |
| search_keywords | jsonb default '[]' | |
| description_md | text | |
| purpose | text | |
| lifecycle | enum | not null |
| created_by | varchar(128) | not null |
| created_at / published_at / deprecated_at / retired_at | timestamptz | |
| approved_via_gate | ULID nullable | |
| supersedes / superseded_by | ULID nullable | |
| fingerprint | varchar(128) | not null |
| plugin_ref | ULID nullable | |
| subclass_payload | jsonb | not null(子类特有字段打包) |
| trace_id | varchar(64) | not null |

**索引**:
- `idx_content_kind_lifecycle` on (kind, lifecycle)
- `idx_content_name_version` on (name, version) unique partial where lifecycle ∈ ('published', 'deprecated')
- `idx_content_fingerprint` on (fingerprint)
- `gin_content_search` on (to_tsvector('simple', name || ' ' || display_name || ' ' || coalesce(description_md,'')))
- `gin_content_categories` on categories
- `gin_content_tags` on tags

**子表**(为常用子类加专用索引和 JSON schema 约束):
- `role_definition_ext`(性能关键字段冗余:image_variant.base_image / default_autonomy_level)
- `view_profile_ext`(applies_to_role / applies_to_object_kind / scope / scope_target)
- `process_template_ext`(family / 覆盖 stages 个数)

#### table: `view_profile_matchers`(ViewProfile 匹配加速)

| 列 | 类型 |
|---|---|
| content_id | ULID FK |
| applies_to_role | varchar(128) |
| applies_to_object_kind | varchar(64) |
| scope | enum |
| scope_target | varchar(128) nullable |
| fingerprint | varchar(128) |
| active | boolean |

**索引**:
- `uniq_viewprofile_active` unique partial on (applies_to_role, applies_to_object_kind, scope, scope_target) where active = true(对应 INV-ML-31)
- `idx_viewprofile_role_kind` on (applies_to_role, applies_to_object_kind)

#### table: `method_plugins`

| 列 | 类型 |
|---|---|
| plugin_id | ULID PK |
| name | varchar(256) |
| version | varchar(32) |
| publisher | varchar(128) |
| license | varchar(64) |
| contained_contents | jsonb default '[]' |
| depends_on_plugins | jsonb default '[]' |
| marketplace_metadata | jsonb nullable |
| plugin_fingerprint | varchar(128) |
| signature | jsonb nullable |
| lifecycle | enum |
| published_at | timestamptz |
| approved_via_gate | ULID nullable |

**索引**:
- `idx_plugin_name_version` on (name, version) unique partial where lifecycle='published'
- `idx_plugin_publisher` on (publisher)

#### table: `method_configurations`

| 列 | 类型 |
|---|---|
| configuration_id | ULID PK |
| scope | enum |
| scope_target | varchar(128) nullable |
| selected_plugins | jsonb |
| variability_applications | jsonb default '[]' |
| effective_content_set | jsonb |
| effective_fingerprint | varchar(128) |
| lifecycle | enum |
| effective_from / effective_until | timestamptz |
| supersedes / superseded_by | ULID nullable |
| approved_via_gate | ULID nullable |

**索引**:
- `uniq_config_active` unique partial on (scope, scope_target) where lifecycle='active'(对应 INV-ML-44)

#### table: `method_library_events_outbox`

同其他域的 Outbox 模式。

### 5.3 一致性策略

- **Content Draft / Update**:单事务写 `method_contents` + `*_ext`(若对应子类有扩展表)+ Outbox
- **Publish**:单事务更新 `lifecycle=published` + 记录 Gate 引用 + Outbox `content.published`
- **Fingerprint 重算**:Update 时 trigger 自动更新;应用层保底重算一遍防 trigger 失配
- **Plugin 级操作**:Plugin publish 时校验所有 contained_contents 的 fingerprint 与当前值一致,不一致立即拒绝
- **Configuration 活化**:单事务"老 configuration 置 superseded + 新 configuration 置 active + 发 activated 事件"

### 5.4 容量估算

- 核心内容量:10w 组织 × 平均 200 个 MethodContent / 组织 = 2000w 条(含历史版本)
- Plugin 量:Marketplace 带动,预估 5w-50w 个 Plugin
- Configuration 量:每组织 ~10 个 Configuration × 版本历史 × 10w 组织 = 百万级
- QPS:
  - GetContent / ResolveViewProfile **读**:峰值 5000 QPS(UI 仓高频消费)
  - 写:< 10 QPS(编辑操作低频)

### 5.5 读优化

- **多级缓存**:
  - L0:进程级 LRU(最热的 ViewProfile / RoleDefinition)
  - L1:Redis 集群(跨进程共享)
  - L2:PG 本体
- **缓存失效**:订阅 `fingerprint_changed` 事件,立即清 L0/L1
- **Resolve ViewProfile 专用索引**:`view_profile_matchers` 表 + unique index,O(1) 查找

### 5.6 迁移策略

- 新增 kind 的 MethodContent(如未来扩 `GuidanceDef`)走增量 migration
- subclass_payload 为 jsonb,schema 演进通过应用层 versioned-schema 管理
- 破坏性变更必经 breaking-change Gate,迁移脚本走独立 migration

---

## 六、与其他域的事件订阅链路

### 6.1 事件流全景

```
method-library → 其他域
──────────────────────────────────────────
method_library.role_definition.published    → identity(Role 索引)/ member-images(镜像预构建)
method_library.task_definition.published    → observability(可用 Task 统计)
method_library.work_product_definition.published → artifact(WorkProductKind 白名单)
method_library.process_template.published   → process(Template 索引同步)
method_library.view_profile.published       → console / chat / mobile(UI 缓存失效)
method_library.ai_policy.published          → governance(AIPolicy 条款同步)
method_library.content.fingerprint_changed  → 所有持索引下游域(drift 防护)
method_library.configuration.activated      → 所有 L1 域 + UI 仓(生效方法集同步)
method_library.plugin.published             → marketplace

其他域 → method-library
──────────────────────────────────────────
governance.gate.decided(method-content-publish)  → PublishContent
governance.gate.decided(plugin-publish)          → PublishPlugin
governance.gate.decided(marketplace-review)      → 外部 Plugin 上架
governance.policy.updated(涉及方法资产)        → 重评合规
identity.role.retired                            → 检查 RoleDefinition 是否可 retire
artifact.work_product_kind.added                 → 更新 WorkProductKind 白名单
marketplace.plugin.subscribed                    → 记订阅关系
```

### 6.2 典型场景 A:新 RoleDefinition 从草稿到 identity 生效

```
[T0] method-library 作者(Role=method-author)创建 RoleDefinition 草稿
     content.lifecycle=draft
     [method_library.content.drafted]
        │
        ▼
[T1] 作者 SubmitForReview
     content.lifecycle=in_review
     [method_library.content.submitted_for_review]
        │
        │ governance 订阅,按规则 RaiseGate(kind=custom, subkind=method-content-publish)
        ▼
[T2] governance 创建 Gate(六段完整,decision_maker=method-steward)
     [governance.gate.raised]
        │
        │ conversation 订阅,推送 Turn 给审阅者
        ▼
[T3] 审阅者在 Console 或 Chat 审批,governance.DecideGate(approve)
     [governance.gate.decided]
        │
        │ method-library 订阅
        ▼
[T4] method-library.PublishContent(content_id, approved_gate_id)
     content.lifecycle=published
     fingerprint 生成
     [method_library.role_definition.published]
        │
        ├──→ identity:更新 Role 索引;发 identity.role.catalog_updated
        │
        ├──→ member-images:按 image_variant 规格预构建镜像(可选,按 ADR-0005)
        │
        └──→ observability:记录发布轨迹

[T5] 下次有 CreateGlobalMember 引用该 Role 时,identity 从自身 Role 索引读快照
     不再每次回 method-library 查(性能)
```

### 6.2 典型场景 B:ViewProfile 发布与 UI 缓存失效

```
[T0] 组织管理员调整"PM 看 Project 时隐藏内部评论"规则
     更新 ViewProfile 草稿 → SubmitForReview
        │
        │ governance.Gate(method-content-publish)→ approve
        ▼
[T1] method-library.PublishContent
     [method_library.view_profile.published]
        │
        ├──→ console / chat / mobile:
        │    - 清 L0 / L1 缓存中该 (role, object_kind) 的旧 Profile
        │    - 广播给在线用户:下次刷新页面生效(或 WebSocket 主动下推)
        │
        └──→ observability:记录发布

[T2] 用户刷新页面,UI 仓 ResolveViewProfile
     拿到新版本,按新规则渲染
     日志记:"render with ViewProfile v1.2.3 (fingerprint: abc...)"
```

### 6.3 典型场景 C:Plugin 跨组织分发(Marketplace)

```
[T0] 外部供应商 A 在自己组织 publish 一个 "fintech-compliance" Plugin
     plugin.lifecycle=published(组织内)
        │
        ▼
[T1] 供应商 A 申请 Marketplace 上架
     governance.RaiseGate(kind=marketplace-review, evidence=plugin_fingerprint + license)
     [governance.gate.raised]
        │
        │ 平台合规团队审核
        ▼
[T2] approve
     method-library.PublishPlugin(带 marketplace 标志)
     [method_library.plugin.published(marketplace=true)]
        │
        │ marketplace 订阅,上架展示
        ▼
[T3] 组织 B 浏览 Marketplace,订阅 "fintech-compliance" Plugin v1.0.0
     marketplace → method-library.SubscribePlugin
     [marketplace.plugin.subscribed(org=B, plugin=fintech-compliance@1.0)]
        │
        ▼
[T4] 组织 B 的管理员创建新 MethodConfiguration,selected_plugins += fintech-compliance
     ActivateConfiguration(scope=organization, target=B)
     [method_library.configuration.activated]
        │
        │ 组织 B 的 L1 域 + UI 仓订阅,生效新方法集
        ▼
[T5] 组织 B 的项目创建时可选用该 Plugin 提供的 ProcessTemplate 等资产
```

### 6.4 典型场景 D:drift 检测与保护

```
[T0] 作者不小心修改了已 published 的 RoleDefinition 内部字段(应被 INV-ML-3 拦截)
     但若绕过应用层直连 DB,trigger 检测到 fingerprint 变化
     [method_library.content.fingerprint_changed] severity=warning
        │
        ├──→ identity:对比自身 Role 索引,发现快照与上游不一致
        │    [identity.role.source_drift] severity=critical
        │    → 冻结该 Role 的新 Member 创建
        │
        └──→ observability:告警,触发 governance 介入

[T1] governance 核查修改来源,决定:
     - 视作事故 → Nonconformity + 强制回滚
     - 视作补丁 → 正式走 supersede 重新发布
```

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 |
|---|---|
| GetContent P95 | < 50ms(缓存命中)/ < 200ms(回 PG) |
| ResolveViewProfile P95 | < 30ms(UI 高频,缓存命中率 > 95%) |
| PublishContent P95 | < 500ms(含 fingerprint 计算 + Outbox) |
| SearchContents P95 | < 300ms(PG 全文搜索) |
| ActivateConfiguration P95 | < 1s(单事务 + 广播) |
| Availability | ≥ 99.95% |

### 7.2 容量假设

- 10w 组织规模
- 2000w MethodContent 版本记录
- ViewProfile 高频查询:5000 QPS 峰值
- 其他内容查询:1000 QPS 峰值

### 7.3 降级策略

- **缓存不可用**:直连 PG,承载降级 QPS(至少 1/5),并限流非关键查询
- **PG 不可用**:UI 仓使用本地上次缓存的 ViewProfile(带陈旧警告)
- **governance 不可达**:Publish / Deprecate / Retire 暂不可操作,但 Draft / Update 可继续

### 7.4 监控关键点

- 缓存命中率 / 淘汰率
- fingerprint_changed 事件频率(高频 = 可能有未授权修改)
- drift 告警次数
- Plugin 订阅数 / 活跃方法集分布
- ResolveViewProfile 的 FALLBACK 命中率(高意味着预设不足)

---

## 八、安全与合规对齐

### 8.1 SPEM 2.0 全面对齐

| SPEM 层 | 本域对应 |
|---|---|
| Core | MethodContent 抽象基类(所有子类的字段基础) |
| Managed Content | description_md / guidance / examples / categories |
| Method Content | RoleDefinition / TaskDefinition / WorkProductDefinition |
| Process Structure | ProcessTemplateDef.activity_graph(含 ActivityDef) |
| Process Behavior | process 域的 ProcessInstance(本域只定义,不执行)|
| Process with Methods | MethodConfiguration 的 variability_applications |
| Method Plugin | MethodPlugin 聚合根 |
| Method Configuration | MethodConfiguration 聚合根 |

**核心承诺**:Definition vs Use 严格分离 —— 本域只有 Definition,所有 Use 在下游执行域。

### 8.2 ISO 24748-2 对齐

- 8 种生命周期模型 → ProcessTemplateDef.family 完全覆盖
- Tailoring 机制 → MethodConfiguration.variability_applications + ProcessTemplateDef.profile_group_presets
- Stage 概念 → LifecycleModelDef.stages 定义时间切片

### 8.3 ISO 29110 对齐

- Profile Group(entry / basic / intermediate / advanced)→ profile_group_presets
- Deployment Package 概念 → MethodPlugin 的分发能力
- Tailoring Record 三种(Reduction / Extension / Adaptation)→ variability_applications.override_kind

### 8.4 ISO 42001 §5.2 对齐

- AI 方针存储 → AIPolicyDef 聚合
- AI 目标声明(§6.2)→ ai_objectives 字段
- 责任链(§5.3 + A.3)→ actor_responsibilities 字段
- AI Policy 的发布与变更通过 Gate 决策 → INV-ML-2

### 8.5 与 ADR 的关系

- **ADR-0005**:RoleDefinition.image_variant 是 Role → Image 映射的单一源
- **ADR-0008**:ActivityDef 的 completion_policy 在 ProcessTemplateDef 里承载;INV-ML-25 / INV-ML-26 保护
- **ADR-0009**:ViewProfile 作为第四类方法资产落在本域,INV-ML-27 到 INV-ML-32 覆盖

### 8.6 横切红线

- **可审计性**:每次 Content 变更 + fingerprint 重算 + Publish Gate + Outbox 全链条留痕
- **可追溯性**:trace_id 贯穿 Content / Plugin / Configuration;下游通过 content_id + fingerprint 反查
- **可裁剪性**:SPEM Variability + 29110 Profile Group 双机制,组织可按需裁剪任何资产

---

## 九、测试策略

### 9.1 单元测试重点

- MethodContent 生命周期状态机所有合法 / 非法转移
- fingerprint 计算幂等性(同内容不同顺序字段 → 同 fingerprint,对齐 canonical JSON)
- ViewProfile 匹配优先级(role-specific > org-default > fallback)
- INV-ML-2 未批 Gate 拒绝 Publish
- INV-ML-3 已 published 修改被拒(应用层 + DB trigger 双重保护)
- INV-ML-27 visible / hidden 冲突 hidden 优先
- INV-ML-31 同匹配键唯一 active ViewProfile
- MethodPlugin 循环依赖检测
- MethodConfiguration active 后字段冻结
- 关键聚合覆盖率 ≥ 90%

### 9.2 集成测试重点

- Content publish → 下游事件到达 → 下游索引更新完整链路
- fingerprint_changed → drift 告警的跨域触发
- ViewProfile 发布 → UI 仓缓存失效 → 下次查询拿到新版本
- Configuration activate → L1 域 + UI 仓同步
- Plugin 跨组织订阅链路

### 9.3 E2E 场景

- 场景 A 新 RoleDefinition 从草稿到 identity 生效
- 场景 B ViewProfile 发布与 UI 缓存失效
- 场景 C Plugin Marketplace 分发
- 场景 D drift 检测与保护

### 9.4 性能压测

- 5000 QPS ResolveViewProfile(缓存命中)
- 1000 QPS GetContent
- 2000w Content 的 PG 查询延迟
- Configuration activate 的广播延迟(目标 < 1s 到 10w 订阅端)

### 9.5 安全测试

- 已 published Content 绕过应用层直连 DB 修改 → trigger 拦截 + drift 告警
- 非授权 Publish → Gate 引用无效 / 过期被拒
- 恶意 Plugin(循环依赖 / 超大 payload / 非法签名)被拒
- 受限表达式 DSL 注入尝试(如 `__import__` 等)被拒

---

## 十、开放问题

### Q1. 派生字段表达式 DSL 的选型

**背景**:ViewProfile.derived_fields.expression 需要安全、表达力够用、对非开发者友好。

**候选**:
- A JSONLogic(轻量,表达力一般)
- B CEL(Google Common Expression Language,表达力强,沙箱成熟)
- C 自定义受限 DSL(完全可控,开发成本高)
- D JMESPath / JSONPath + 有限运算符(纯声明式)

**倾向**:B CEL 起步,若编辑器 UX 差再评估

**推进**:独立 ADR 决策,影响 console 仓渲染实现。

### Q2. MethodContent 的多语言版本策略

**背景**:同一 RoleDefinition 的中英文版本如何关联?

**候选**:
- A 同 name 不同 language(当前方案),各自独立生命周期
- B 一份主语言 + 翻译关联表(主改从动)
- C i18n 字段嵌入(description_md.zh / .en),单条记录多语言

**倾向**:A + 通过 categories 关联(未来若需要 B 再加翻译关联表)

**推进**:第一批用户反馈后决策。

### Q3. Plugin 签名机制

**背景**:第三方 Plugin 进 Marketplace 是否强制数字签名?签名算法?

**候选**:
- A 不强制签名(仅 fingerprint)
- B 强制 Ed25519 签名(供应商私钥 + 平台根证书)
- C Sigstore / cosign 集成

**倾向**:B 起步,C 作为后期企业级能力

**推进**:Marketplace 启动前独立 ADR。

### Q4. MethodConfiguration 的继承

**背景**:集团 → 子公司 → 部门 → 项目 层级继承,是否支持自动继承父级 Configuration?

**候选**:
- A 不继承(当前方案)每级独立配置
- B 线性继承(子级默认继承父级,显式覆盖)
- C 按 variability_applications 的 override_kind 细粒度继承

**倾向**:A 起步,B 为企业版能力

**推进**:企业租户原型阶段。

### Q5. 全文搜索的选型

**背景**:SearchContents 当前走 PG tsvector,组织规模大时可能不够。

**候选**:
- A PG tsvector + GIN(当前方案)
- B ES / OpenSearch
- C Typesense

**倾向**:A 起步,10w 组织规模前不上 ES

**推进**:性能压测达瓶颈时。

### Q6. 受限表达式的时间语义

**背景**:derived_fields 里能否用 "now()" / 相对时间?直接用会导致同一数据不同时刻渲染不同,影响可审计性。

**候选**:
- A 禁止时间语义
- B 允许但必须带时间戳快照(UI 渲染时快照)
- C 允许但缓存到 fingerprint 里

**倾向**:B(UI 渲染带时间戳,日志可追溯)

**推进**:ADR-0009 实施阶段确认。

### Q7. Content retire 的下游强约束

**背景**:retire 一个 RoleDefinition 时,identity 还有 active GlobalMember 引用 — 怎么办?

**候选**:
- A 拒绝 retire(当前 INV-ML-15)
- B 允许 retire,下游必须迁移 Member 到其他 Role(高成本)
- C 允许 retire 但保留"僵尸 Role"状态,只读引用

**倾向**:A,严格不允许

**推进**:企业版需要灵活迁移时再评估。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-method-library` 仓 README(段 3)

- §二 聚合根 → src/domain/
- §三 RPC → proto/
- §四 事件 → src/events/
- §五 持久化 → migrations/
- §六 跨域 → src/subscriptions/
- §九 测试 → tests/
- 表达式 DSL 引擎 → src/expression/(依 Q1 选型)

### 11.2 与 process 域

- method-library 是 Template 内容**源**,process 是执行**索引**
- fingerprint 机制保证一致性(process 检测 drift 时冻结新 Profile)
- ActivityDef 的 completion_policy 在本域定义,process 执行(ADR-0008)

### 11.3 与 identity 域

- RoleDefinition 内容在本域,identity 持有 Role 索引(content_id + fingerprint)
- `method_library.role_definition.published / capabilities_changed` 是 identity 同步依据
- ADR-0005 的 image_variant 在 RoleDefinition,identity 不重复定义

### 11.4 与 governance 域

- AIPolicyDef 作为 42001 §5.2 AI 方针的承载,governance.Policy 作为运行时规则引用
- 所有 MethodContent 的 Publish / Plugin 的 Marketplace 上架都需要 Gate 决策
- ADR-0009 的 ViewProfile 是方法资产,governance 只通过 Policy 强制"必须消费 ViewProfile"

### 11.5 与 UI 仓(console / chat / mobile)

- UI 仓通过 ResolveViewProfile RPC 高频查询
- 订阅 `view_profile.published / deprecated / retired` 做缓存失效
- 派生字段表达式在 UI 仓本地执行(不回本域)

### 11.6 与 artifact 域

- WorkProductDefinition 定义 WorkProductKind 白名单,artifact 据此分类
- template_artifact_ref / guidance / examples 的实际文件在 artifact 域

### 11.7 与 marketplace 仓

- method-library 是方法资产源,marketplace 是分发通道
- `method_library.plugin.published(marketplace=true)` 是上架入口
- 订阅关系通过 `marketplace.plugin.subscribed` 事件回传本域

### 11.8 修订纪律

- MethodContent 抽象字段修改必须 ADR(影响所有子类)
- 新增子类(如未来加 GuidanceDef)必须 ADR
- fingerprint 算法修改必须有迁移方案 ADR
- ViewProfile 的派生字段 DSL 引擎更换必须 ADR
- 29110 Profile Group 语义修改必须 ADR

---

## 十二、总结

本文把方法库域从"一节方法库横切叙事 + 一行 SPEM 对齐"展开到"可以实现"的程度。关键产出:

1. **MethodContent 抽象 + 6 种子类**(RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef)
2. **MethodPlugin + MethodConfiguration** 两个复用聚合
3. **45 条不变量**(INV-ML-1 到 INV-ML-45)覆盖全部聚合
4. **SPEM 2.0 全层对齐**(Core / Managed Content / Method Content / Process / Plugin / Configuration)
5. **ISO 24748-2 + 29110 + 42001 §5.2** 综合落地
6. **fingerprint 机制** 保证跨域一致性,drift 检测联动
7. **ViewProfile + ResolveViewProfile RPC** 作为 ADR-0009 的直接承载
8. **MethodPlugin 的 Marketplace 分发路径** 端到端场景
9. **7 个开放问题**,其中 Q1(表达式 DSL)和 Q3(签名)影响较大,需独立 ADR

**关键承诺**:

- **Definition vs Use 严格分离**(SPEM 2.0 核心),本域只定义,执行全在下游
- **Publish 必经 Gate**(INV-ML-2),所有方法资产变更可审计
- **Published 不可修改**(INV-ML-3),保护下游依赖稳定
- **fingerprint 贯穿下游**,drift 立即告警
- **ViewProfile 消费在 UI 仓**,L1 域不感知 Role 视图差异
- **AutoAction / ViewProfile / AIPolicy 都是方法资产**,而非散落各域的硬编码

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-ML-1 | content_id 永不复用 | §2.1.3 |
| INV-ML-2 | published 必有 approved_via_gate | §2.1.3 |
| INV-ML-3 | published 核心字段不可修改 | §2.1.3 |
| INV-ML-4 | fingerprint 变更必发事件 | §2.1.3 |
| INV-ML-5 | 语义化版本语义 | §2.1.3 |
| INV-ML-6 | superseded_by 单向 | §2.1.3 |
| INV-ML-7 | deprecated→retired 间隔 ≥ 30 天 | §2.1.3 |
| INV-ML-8 | language 设定后不可修改 | §2.1.3 |
| INV-ML-9 | categories 来自受控词表 | §2.1.3 |
| INV-ML-10 | guidance/examples 指向合法 Artifact | §2.1.3 |
| INV-ML-11 | performing_tasks 至少一个 published | §2.2.2 |
| INV-ML-12 | image_variant.base_image 在白名单 | §2.2.2 |
| INV-ML-13 | default_autonomy_level ≤ 4 | §2.2.2 |
| INV-ML-14 | capabilities 变更发事件 | §2.2.2 |
| INV-ML-15 | retire 前无 active Role 引用 | §2.2.2 |
| INV-ML-16 | steps 至少 1 步 order 唯一 | §2.3.2 |
| INV-ML-17 | performing_roles 非空 | §2.3.2 |
| INV-ML-18 | inputs/outputs 指向合法 WorkProductDefinition | §2.3.2 |
| INV-ML-19 | work_product_kind 在 artifact 白名单 | §2.4.2 |
| INV-ML-20 | acceptance_criteria_template 至少 1 条 | §2.4.2 |
| INV-ML-21 | activity_graph 通过 BPMN schema | §2.5.2 |
| INV-ML-22 | family 设定后不可修改 | §2.5.2 |
| INV-ML-23 | roles_required 指向合法 Content | §2.5.2 |
| INV-ML-24 | mandatory Gate 不可被 Reduction 移除 | §2.5.2 |
| INV-ML-25 | 每个 ActivityDef 必须声明 completion_policy | §2.5.2 |
| INV-ML-26 | completion_policy 用已有 Gate kind | §2.5.2 |
| INV-ML-27 | visible/hidden 冲突 hidden 优先 | §2.6.2 |
| INV-ML-28 | applies_to_role 必须 published | §2.6.2 |
| INV-ML-29 | masked path 必须在 schema 存在 | §2.6.2 |
| INV-ML-30 | derived expression 走受限 DSL | §2.6.2 |
| INV-ML-31 | 同匹配键唯一 active ViewProfile | §2.6.2 |
| INV-ML-32 | fallback show_all 仅开发期 | §2.6.2 |
| INV-ML-33 | policy_statements 至少 1 条 | §2.7.2 |
| INV-ML-34 | measurable_target 可被指标引用 | §2.7.2 |
| INV-ML-35 | actor_responsibilities 覆盖 provider+operator | §2.7.2 |
| INV-ML-36 | plugin_id 永不复用 | §2.8.2 |
| INV-ML-37 | Plugin 发布必经 Gate | §2.8.2 |
| INV-ML-38 | contained_contents 双向一致 | §2.8.2 |
| INV-ML-39 | depends_on_plugins DAG | §2.8.2 |
| INV-ML-40 | plugin_fingerprint 自动重算 | §2.8.2 |
| INV-ML-41 | version_lock 必须 published 版本 | §2.9.2 |
| INV-ML-42 | Configuration active 后字段冻结 | §2.9.2 |
| INV-ML-43 | override 不得移除 mandatory Gate | §2.9.2 |
| INV-ML-44 | 同 scope+target 唯一 active Configuration | §2.9.2 |
| INV-ML-45 | 依赖冲突立即拒绝 | §2.9.2 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | MethodContent 6 子类各自职责清晰;Plugin(打包)/ Configuration(组装)分离 |
| OCP | 通过 MethodPlugin + Configuration + Variability 支持扩展而不改本域 |
| DIP | 下游域依赖 fingerprint + 事件,不直接依赖本域 schema 变化 |
| DRY | Method Content 共同字段抽象基类,避免各子类重复定义 |
| KISS | Plugin / Configuration 只做打包和组装,不做运行时执行 |
| YAGNI | 表达式 DSL / Plugin 签名机制暂不锁定,Q1 / Q3 延迟决策 |
| 不可变优先 | published Content / active Configuration 字段冻结 |
| 显式优于隐式 | 45 条不变量显式 |
| Fail Fast | Publish 无 Gate / 依赖循环 / 表达式非法立即拒 |
| 幂等性 | Outbox + fingerprint + Configuration 版本链 |

---

## 附录 C:订正标记

- [ ] §2.6.3 派生字段 DSL 引擎具体选型待 Q1 独立 ADR
- [ ] §2.8 Plugin 签名机制待 Q3 独立 ADR
- [ ] §5.2 全文搜索引擎选型待 Q5(容量达阈值后)
- [ ] §六 跨域事件清单待下游仓对齐反馈
- [ ] §七 性能指标待原型压测后调整

---

> 本文是 Quantalithos 方法库域的单一真相源。SPEM 2.0 + 24748-2 + 29110 + 42001 §5.2 四套标准综合落地。本文定稿后,process / identity / governance / artifact 等域的 README 中与 method-library 相关段落须以本文为准。
