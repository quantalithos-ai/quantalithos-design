# governance — 治理域详细设计

> **域定位**:治理域的详细设计文档。回答"关键决策由谁定"。聚合根是 **Gate / Policy / Control / ImpactAssessment / SoADocument / Nonconformity**;Approval 是 Gate 内的实体。
>
> **上游依据**:
> - `product/最终目的.md` §3.5 关键节点强制人类 + §九.3 产品原则"决策必须留痕"
> - `product/六域模型.md` §七 治理域
> - `architecture/仓库拆分方案.md` §4.5 `quantalithos-governance`
> - `architecture/标准对齐全景图.md` §一 + §三.1 / §三.4
> - `architecture/ai-member设计.md` §七 运行时协作时序 / §十一 Q6 Auditor
> - `methodology/standards-discussion/ISO-42001.md` 全套
> - `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` §5.2 Decision Gate + §5.3 Conformance
> - `methodology/standards-discussion/ISO-9001.md` §9-§10 绩效评价 + 改进
> - 14 标准主对齐:**ISO 42001 + ISO 24748-2 + ISO 9001**;次对齐:27001 / 15504 / Research 自主性 5 级
>
> **本文不承载**:Gate 的 UI 渲染(在 Chat)/ AIIA 详细方法论(见 methodology/)/ 审计事件的技术存储(在 observability 仓)/ Policy DSL 的执行引擎(在 capability-hub 消费)。

---

## 一、使命与边界

### 1.1 使命

**把"关键节点强制人类"从产品叙事落到技术机制**。治理域是 Quantalithos 对齐 ISO 42001 AIMS 的技术载体,也是三横切红线(可审计 / 可追溯 / 可裁剪)的主要强制点。

具体职责:
- **Gate 聚合根**:审批 / 决策点的一等对象化,六段式结构
- **Policy 聚合根**:组织级 / 项目级 / Role 级策略下发
- **Control 聚合根**:ISO 42001 附录 A 的 38 控制项落地
- **ImpactAssessment 聚合根**:AIIA(42001 §8.2 / ISO 42005)
- **SoADocument 聚合根**:Statement of Applicability(42001 §6.1.3)
- **Nonconformity 聚合根**:不符合事件 + 纠正措施(9001 §10.1 + 42001 §10.1)
- **Approval 实体**(Gate 内部):多人审批的投票记录

### 1.2 边界(不做的事)

- **不做 Gate 的 UI 渲染** —— 那在 Chat(AG-UI CustomEvent)和 Console
- **不做审计事件的物理存储** —— 那在 observability(append-only + 哈希链)
- **不做 Policy 的 Tool 级执行** —— Policy 规则分发到 L2 Member runtime C6 Policy Cache + capability-hub 消费;本域只管**策略的定义和下发**
- **不做 AIIA 方法论** —— 方法论在 methodology/,本域只管**存储和生命周期**
- **不做 Gate 决策的业务逻辑** —— 如"谁有权批这个 Gate"由 Policy 配置,本域执行 Policy

### 1.3 与其他域的协作全景

```
┌────────────────────────────────────────────────────────────────────┐
│  governance 域(本文)                                               │
│  Gate + Policy + Control + AIIA + SoA + Nonconformity              │
└──┬──────────────┬───────────────┬──────────────┬──────────────┬────┘
   │ 发 Gate 事件  │ 发 Policy 事件 │ 发 AIIA/SoA  │ 发 Nonconf   │ 订阅跨域事件
   ▼              ▼               ▼              ▼              ▼
 conversation    capability-hub   archive        observability  work/process/
 (Gate Turn)    runtime C6       (归档包)        (审计告警)    artifact/identity
 Chat UI         (Policy Cache)
 process
 (Activity 唤醒)
```

---

## 二、聚合根详细设计

### 2.1 Gate 聚合根(核心)

#### 2.1.1 完整字段(六段式)

```
Gate {
    gate_id:                 ULID,

    // 分类
    kind:                    GateKind,        // 10 种(见 §2.1.2)
    project_id:              Option<ProjectId>,  // 组织级 Gate 可空

    // === 段 1:Trigger(触发)===
    trigger:                 Trigger {
        raised_by:           ActorRef,         // member / user / system
        raised_at:           Timestamp,
        trigger_source:      enum {
            activity_waiting_gate,    // process.activity 触发
            policy_require_gate,      // Policy 规则要求
            manual_raise,             // 人工发起
            scheduled,                // 定时触发(如 SoA 年度复评)
            event_driven,             // 其他事件触发
        },
        trigger_reason:      String,           // human-readable
        trigger_event_ref:   Option<EventRef>, // 触发事件引用
    },

    // === 段 2:DecisionRequest(决策请求)===
    decision_request:        DecisionRequest {
        question:            String,           // "是否批准发布 v1.0?"
        context_summary:     String,           // 决策背景
        urgency:             Urgency,          // low / normal / high / critical
        related_artifacts:   Vec<ArtifactRef>,
        related_activities:  Vec<ActivityRef>,
        related_workitems:   Vec<WorkItemRef>,
    },

    // === 段 3:CandidateOptions(候选选项)===
    candidate_options:       Vec<CandidateOption {
        option_id:           String,           // "approve" / "reject" / "request_changes"
        label:               String,
        description:         String,
        consequences:        String,           // "选这个会触发什么"
        metadata:            jsonb,            // 额外语义(如 approve 的 condition)
    }>,

    // === 段 4:EvidenceRequirement(证据要求)===
    evidence_requirement:    EvidenceRequirement {
        required_artifacts:  Vec<ArtifactKind>,  // 需要看到什么 Artifact
        required_reviews:    Vec<ReviewRequirement>,  // 需要哪些评审
        required_checks:     Vec<CheckRef>,    // 需要哪些 Control 实施验证
        minimum_review_count: Option<i32>,      // 至少 N 人评审
    },

    // === 段 5:DecisionMaker + AutonomyLevel ===
    decision_maker:          DecisionMaker {
        maker_type:          enum {
            user,                   // 必须用户决策(最高权威)
            specific_member,        // 特定 Member(如 Tech Lead)
            approval_quorum,        // 多人投票
            policy_auto,            // 由 Policy 自动决策(特定条件 + autonomy_level=5)
            escalation_chain,       // 升级链(优先级 1 失败升级到 2 ...)
        },
        specific_maker:      Option<ActorRef>,
        quorum_config:       Option<QuorumConfig>,
        escalation_config:   Option<EscalationConfig>,
    },
    autonomy_level:          AutonomyLevel,     // 1-5 级(Research 自主性 5 级)
    timeout_policy:          TimeoutPolicy {
        timeout_duration:    Duration,
        on_timeout:          enum { auto_approve / auto_reject / escalate / notify_only },
    },

    // === 段 6:Resolution + AuditTrail ===
    resolution:              Option<Resolution {
        chosen_option_id:    String,
        decided_by:          ActorRef,
        decided_at:          Timestamp,
        decision_rationale:  String,
        conditions:          Vec<Condition>,    // 附带条件
        approvals:           Vec<ApprovalId>,   // 若 quorum,引用 Approval 实体
    }>,
    audit_trail:             Vec<AuditEntry>,   // 所有状态变更 + 决策 + 投票

    // === 运行状态 ===
    state:                   GateState,         // pending / in_review / decided / expired / cancelled
    created_at:              Timestamp,
    decided_at:              Option<Timestamp>,
    expired_at:              Option<Timestamp>,

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
    version:                 u64,
}
```

#### 2.1.2 10 种 kind(`六域模型.md` §7.2.1 对齐)

| kind | 触发时机 | 典型 decision_maker |
|---|---|---|
| `kickoff` | 项目启动 | user |
| `requirements-confirm` | 需求整理完 | user |
| `design-choice` | 多方案待选 | user 或 tech-lead |
| `prototype-approval` | 原型产出后 | user |
| `code-review` | 代码提交后 | tech-lead / peer quorum |
| `release-confirm` | 发布生产前 | user |
| `impact-assessment` | AIIA 前置(强制)| user + auditor |
| `quality-gate` | 某 25010 特性评估 | qa + user |
| `archive-confirm` | 项目归档前 | user |
| `custom` | 组织自定义 | 视情况 |

**隐藏默认 Gate kinds(非十之一,作为治理内部机制)**:
- `member-lifecycle` — 招聘 / Retire / Role 升级
- `baseline-freeze` — Artifact 冻结
- `policy-update` — 组织级 Policy 变更
- `soa-update` — SoA 修订
- `nonconformity-resolution` — 不符合事件的处置
- `role-introduction` — 新 Role 引入
- `marketplace-review` — 资产市场上架(`产品遵循规范清单.md` MK1)
- `breaking-change` — SDK / proto breaking

这些**不在 §2.1.2 用户可见的 10 种里**,但作为治理机制存在。统一归为 `custom` kind + 特殊 metadata 标签。

**关于"Activity 与 WorkItem 不一致"场景的 kind 选择(ADR-0008 锁定)**:

- **不新增 `stage-exit` 之类的专用 kind**。即 Activity 想 complete 但 related_workitems 未全部 done 时,不造新 kind
- 按场景复用已有 kind:
  - 未达质量 / 验收标准 → `quality-gate`
  - 多种处理路径让人选 → `design-choice`
  - 涉及发布边界的最终确认 → `release-confirm`
- Gate 的差异通过 `decision_request.context_summary` + `candidate_options.metadata` 承载,不依赖 kind 分化
- 理由:kind 是用户可见语义,增加一种 kind 会触发 UI / 审计列表 / 搜索过滤 / 培训材料的全线适配成本,收益不抵

#### 2.1.3 六段式强约束

**关键约束**:Gate **必须六段完整**才能 decide(INV)。缺任何一段立即拒绝决策。

原因(对齐 42001 §A.9 Responsible Use):
- **Trigger** 缺失 → 谁发起的?合规上必须有源
- **DecisionRequest** 缺失 → 决策什么?
- **CandidateOptions** 缺失 → 选什么?
- **EvidenceRequirement** 缺失 → 依据什么?
- **DecisionMaker** 缺失 → 谁批?
- **AuditTrail** 缺失 → 过程是否可审计?

这六段是 **42001 AIMS 对"受控决策"的最小元素集** + **24748-2 Decision Gate 概念**的综合落地。

#### 2.1.4 生命周期状态机

```
            [RaiseGate]
                │
                ▼
           ┌────────┐
           │pending │  已创建,等待证据 / 决策方就位
           └───┬────┘
               │ 证据到位 or decision_maker 可见
               ▼
           ┌──────────┐
           │in_review │  可被决策
           └──┬────┬──┘
              │    │
      [decide]│    │[timeout / cancel]
              │    │
              ▼    ▼
         ┌─────────┐ ┌──────────┐
         │ decided │ │ expired  │  或 cancelled
         └─────────┘ └──────────┘
         单向        单向
```

**说明**:
- `pending → in_review` 可以是自动(evidence 自动校验)或人工(发起方确认)
- `in_review → decided` 必须六段完整(INV-4)
- `timeout_policy` 驱动 timeout 行为(auto_approve / auto_reject / escalate / notify_only)
- `cancelled` 由 raised_by 或 Policy 触发(如 Project archived 导致相关 Gate 自动 cancelled)

#### 2.1.5 不变量(INV-1 到 INV-15)

**INV-1** `gate_id` 永不复用
**INV-2** Gate 六段中 Trigger / DecisionRequest / CandidateOptions / EvidenceRequirement / DecisionMaker 五段在 **pending 之后**不可修改(AuditTrail 持续 append)
**INV-3** `candidate_options.length ∈ [2, 10]`(必须给选项,也不能太多)
**INV-4** `state=decided` 必须有 `resolution`,且 resolution.chosen_option_id 在 candidate_options 内
**INV-5** `autonomy_level=5`(AI 全自主)必须有对应 Policy 显式授权(policy_auto + 可追溯的 Policy 引用)
**INV-6** `audit_trail` 只 append,不可修改 / 删除历史条目
**INV-7** `decision_maker.maker_type=user` 时 decided_by 必须是 UserId(不能是 Member)
**INV-8** `quorum_config` 时必须有 Approval 实体记录每个参与者投票
**INV-9** `state=decided` 单向,resolution 一旦设定不可修改(纠正必须发新 Gate + 必要时 Nonconformity)
**INV-10** `timeout_policy.on_timeout=auto_approve` 必须有对应 Policy 明示(否则拒绝 Gate 创建)
**INV-11** `related_artifacts` / `related_activities` 指向的对象必须存在且有效(弱引用,但创建时校验)
**INV-12** `kind=impact-assessment` 的 Gate 必须 autonomy_level ≤ 3(不允许 AI 全自主决策 AIIA)
**INV-13** `kind ∈ {release-confirm, archive-confirm, dissolve-confirm}` 的 Gate 必须 decision_maker.maker_type=user(强制人类介入)
**INV-14** Gate 创建时至少有一个 `candidate_options` 包含 `reject` 语义(不允许"只能 approve"的 Gate)
**INV-15** `state=expired` / `cancelled` 后不可再 decide

#### 2.1.6 操作契约

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `RaiseGate(trigger, request, options, ...)` | 六段完整(前五段),INV-3/5/10/12/13/14 验证 | state=pending | `governance.gate.raised` |
| `AttachEvidence(gate_id, artifact_ref)` | state=pending | related_artifacts += | `governance.gate.evidence_attached` |
| `MoveToReview(gate_id)` | state=pending, 证据满足 evidence_requirement | state=in_review | `governance.gate.moved_to_review` |
| `CastVote(gate_id, approver, vote)` | state=in_review, maker=quorum | 创建 Approval 实体 | `governance.gate.vote_cast` |
| `Decide(gate_id, chosen_option, rationale)` | state=in_review, INV-4/7 | state=decided | `governance.gate.decided` |
| `Expire(gate_id)` | state ∈ {pending, in_review}, 过 timeout | state=expired;执行 on_timeout 策略 | `governance.gate.expired` |
| `Cancel(gate_id, reason)` | state ∈ {pending, in_review} | state=cancelled | `governance.gate.cancelled` |

### 2.2 Approval 实体(Gate 内)

#### 2.2.1 完整字段

```
Approval {
    approval_id:        ULID,
    gate_id:            GateId,
    approver:           ActorRef,          // user / member / system
    vote:               Vote,              // approve / reject / abstain
    rationale:          Option<String>,
    evidence_reviewed:  Vec<ArtifactRef>,  // 该 approver 实际查看的证据(供审计)
    voted_at:           Timestamp,
    trace_id:           TraceId,
}
```

#### 2.2.2 不变量

**INV-16** 同 (gate_id, approver) 不可重复投票(先 cancel 旧投票才能重投)
**INV-17** Approval 一旦投票**不可修改 vote**;可 cancel 后重投
**INV-18** Gate 的 quorum 决策必须所有 required approver 都已投(见 QuorumConfig)

### 2.3 Policy 聚合根

#### 2.3.1 完整字段

```
Policy {
    policy_id:           ULID,

    // 分类与范围
    kind:                PolicyKind,       // tool-whitelist / data-access / release-policy /
                                            //  impact-assessment-required / role-permission /
                                            //  autonomy-config / custom
    scope:               PolicyScope,      // organization / project / role / specific-member
    scope_target:        Option<ScopeTarget>, // scope=project 则是 project_id,scope=role 则是 role_id,etc.

    // 规则
    rules:               Vec<Rule>,        // 具体规则(DSL 或结构化 schema)
    rule_schema_version: String,           // 规则 schema 版本

    // 优先级
    priority:            i32,              // 越大越高;shared_rules 必须最高
    is_shared_rules:     bool,             // 标记组织级硬约束

    // 生命周期
    effective_from:      Timestamp,
    effective_until:     Option<Timestamp>,
    approved_by:         ActorRef,
    related_gate_id:     Option<GateRef>,  // 发布此 Policy 的 Gate

    // 版本与演进
    version:             Semver,
    supersedes:          Option<PolicyId>,
    superseded_by:       Option<PolicyId>,

    lifecycle:           PolicyLifecycle,  // draft / active / superseded / retired

    // 分发
    subscribers_published: Timestamp,     // 最后一次下发时间
    subscribers_applied_at: Map<SubscriberId, Timestamp>,  // 各订阅方应用完成时间

    // 审计
    trace_id:            TraceId,
    audit_log_ref:       AuditLogRef,
}

Rule {
    rule_id:             String,
    condition:           ConditionExpr,    // DSL 表达式
    action:              RuleAction,       // allow / deny / require_gate / notify / escalate
    action_metadata:     jsonb,
}
```

#### 2.3.2 七种 kind

```
tool-whitelist              工具调用白/黑名单
data-access                 数据访问控制
release-policy              发布策略(谁能批 / 条件)
impact-assessment-required  AIIA 强制前置条件
role-permission             Role 级能力与权限
autonomy-config             autonomy_level 配置(哪些 Gate 允许哪些级别)
custom                      组织扩展
```

#### 2.3.3 不变量(INV-19 到 INV-26)

**INV-19** `is_shared_rules=true` 的 Policy 必须 scope=organization
**INV-20** 低 scope(project / role)的 Policy **不能覆盖** is_shared_rules 的规则(Research 指令优先级)
**INV-21** 两条同 scope + 同 target 的 active Policy,conflict 时按 priority 决定;priority 冲突发 `governance.policy.conflict` 审计事件
**INV-22** Policy active 前必须经 governance.Gate(kind=policy-update)批准
**INV-23** superseded 必须有 superseded_by
**INV-24** `lifecycle=retired` 单向
**INV-25** rules 的 condition 表达式必须通过 schema 校验(拒绝非法 DSL)
**INV-26** effective_until 早于 effective_from 的 Policy 被拒绝

#### 2.3.4 Policy 下发链路

```
Policy.active
    │
    ▼
[governance.policy.updated 发布]
    │
    ├──→ L2 runtime C6 Policy Cache(按 scope 过滤,异步刷新)
    │    Cache.refresh(policy_id)
    │    发 `member.policy_cache_refreshed` 事件
    │
    ├──→ capability-hub(白名单 / data-access 相关)
    │    更新 MCP whitelist
    │
    ├──→ work 域(role-permission / tool-whitelist 影响 ProjectMember.tool_scope)
    │    重评所有 active ProjectMember
    │
    └──→ observability(审计 + 指标)

[subscribers_applied_at 更新]
  所有订阅方 ACK 后,governance 更新 applied 时间戳
  若某订阅方超时未 ACK,发 `governance.policy.propagation_lag` 告警
```

### 2.4 Control 聚合根(ISO 42001 A 附录)

#### 2.4.1 完整字段

```
Control {
    control_id:              String,             // 对齐 42001 编号(如 "A.4.2 Data Resources")
    category:                ControlCategory,    // 42001 9 族之一
    display_name:            String,
    description:             String,             // 控制项描述(继承 42001 原文)

    // 适用性
    scope:                   ControlScope,        // organization / project
    scope_target:            Option<ScopeTarget>,
    applicability:           Applicability,       // applicable / not-applicable
    applicability_rationale: String,              // 不适用必须说明理由

    // 实施
    implementation_status:   ImplementationStatus, // not_implemented / partially / implemented / verified
    implementation_notes:    Option<String>,
    evidence_refs:           Vec<ArtifactRef>,     // 实施证据

    // 责任
    owner:                   ActorRef,             // 责任人
    reviewers:               Vec<ActorRef>,

    // 评审周期
    review_cycle:            ReviewCycle,          // 年度 / 项目触发 / 事件触发
    last_reviewed_at:        Option<Timestamp>,
    next_review_due:         Option<Timestamp>,

    // 关联
    related_policies:        Vec<PolicyRef>,       // 实现此 Control 的 Policy
    related_risks:           Vec<RiskId>,          // 缓解的风险
    related_nonconformities: Vec<NonconformityId>, // 历史不符合

    // 生命周期
    lifecycle:               ControlLifecycle,     // draft / active / superseded / retired

    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.4.2 9 族(42001 附录 A)

```
A.2 AI Policies                     AI 相关政策
A.3 Internal Organization           内部组织与责任
A.4 Resources for AI Systems        AI 系统资源(数据 / 工具 / 计算 / 人员)
A.5 Assessing Impacts               AIIA
A.6 AI System Life Cycle            AI 系统生命周期
A.7 Data for AI Systems             数据治理
A.8 Information for Interested Parties  利益相关方信息
A.9 Use of AI Systems               负责任使用
A.10 Third-party and Customer       第三方与客户关系
```

共 **38 控制项**。本域不重复定义每项内容(来自 42001 原文),但要在 SoADocument 声明适用性。

#### 2.4.3 不变量

**INV-27** control_id 遵循 42001 官方编号(如 "A.4.2"),不能自造
**INV-28** `applicability=not-applicable` 必须有 `applicability_rationale`
**INV-29** `implementation_status=verified` 必须有 ≥ 1 个 evidence_refs
**INV-30** `next_review_due` 过期后 30 天内未复评,发 `governance.control.review_overdue` 告警
**INV-31** `lifecycle=retired` 单向

### 2.5 ImpactAssessment 聚合根(AIIA)

#### 2.5.1 完整字段

```
ImpactAssessment {
    aiia_id:                 ULID,
    project_id:              ProjectId,
    scope:                   AIIAScope {
        system_description:  String,                  // 评估的 AI 系统
        intended_use:        String,                  // 预期用途
        foreseeable_misuse:  String,                  // 可预见的误用
        deployment_context:  String,                  // 部署上下文
    },

    // 受影响方
    affected_parties:        Vec<AffectedParty {
        party_type:          enum { individual / group / community / environment },
        description:         String,
        population_estimate: Option<i64>,
    }>,

    // 影响评估(多维)
    impact_dimensions:       Map<ImpactDimension, ImpactEvaluation>,
    //  ImpactDimension: well_being / rights / safety / fairness / environment / economic
    //  ImpactEvaluation: { severity, likelihood, description, evidence_refs }

    // 缓解措施
    mitigation_plan:         Vec<Mitigation {
        mitigation_id:       String,
        description:         String,
        target_dimension:    ImpactDimension,
        responsible_party:   ActorRef,
        status:              enum { planned / in_progress / implemented / verified },
        related_controls:    Vec<ControlRef>,
    }>,

    // 残余风险
    residual_risk:           ResidualRisk {
        overall_rating:      enum { acceptable / requires_attention / unacceptable },
        breakdown_by_dimension: Map<ImpactDimension, RiskRating>,
        justification:       String,
    },

    // 生命周期
    status:                  AIIAStatus,          // draft / in_review / approved / superseded
    conducted_by:            ActorRef,             // Auditor Role
    reviewed_by:             Vec<ActorRef>,
    approved_via_gate:       Option<GateRef>,     // impact-assessment Gate
    approved_at:             Option<Timestamp>,

    // 版本
    version:                 Semver,
    supersedes:              Option<AIIAId>,

    // 双身份(与 Artifact 域)
    artifact_ref:            ArtifactRef,          // 制品域镜像 Artifact(kind=impact-assessment)

    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.5.2 双身份说明

AIIA 同时是:
- **治理活动**(本域聚合根,有状态机、可评审)
- **可审计制品**(artifact 域的 Artifact,kind=impact-assessment,带不变量 INV-10 / INV-14)

**不是复制** —— 同一个数据,两个视角:
- 治理域关注其"评估过程",制品域关注其"证据属性"
- `ImpactAssessment.artifact_ref` 与 `Artifact` 双向一致
- 修改 AIIA 本质是发新 Artifact 版本 + 新 AIIA(AIIA supersede)

#### 2.5.3 不变量(INV-32 到 INV-37)

**INV-32** `aiia_id` 永不复用
**INV-33** `status=approved` 必须 approved_via_gate + approved_at
**INV-34** `residual_risk.overall_rating=unacceptable` 时**不可 approve**(除非 Gate 明确 override + Nonconformity)
**INV-35** project 的 AIIA 覆盖时间必须 ≥ 1 年(到期需重评,对齐 42001 周期)
**INV-36** AIIA approved 后触发 artifact_ref 指向的 Artifact 状态变为 approved
**INV-37** `kind=impact-assessment` 的 Artifact 必须有 governance.ImpactAssessment 镜像(双身份一致)

### 2.6 SoADocument 聚合根

#### 2.6.1 完整字段

```
SoADocument {
    soa_id:                  ULID,
    scope:                   SoAScope,             // organization / project
    scope_target:            Option<ScopeTarget>,

    // 控制项清单
    applicable_controls:     Vec<ApplicableControl {
        control_id:          String,               // 42001 编号
        applicability_rationale: String,
        implementation_summary: String,
        implementation_status: ImplementationStatus,
        evidence_refs:       Vec<ArtifactRef>,
    }>,
    excluded_controls:       Vec<ExcludedControl {
        control_id:          String,
        exclusion_rationale: String,                // 必填,合规关键
    }>,

    // 总体说明
    implementation_summary:  String,
    scope_description:       String,

    // 生命周期
    version:                 Semver,
    approved_by:             ActorRef,
    approved_via_gate:       GateRef,              // soa-update Gate
    approved_at:             Timestamp,
    effective_from:          Timestamp,
    effective_until:         Option<Timestamp>,
    lifecycle:               SoALifecycle,         // draft / active / superseded

    supersedes:              Option<SoAId>,

    // 双身份(artifact 域)
    artifact_ref:            ArtifactRef,          // kind=soa 的 Artifact

    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.6.2 不变量(INV-38 到 INV-42)

**INV-38** `soa_id` 永不复用
**INV-39** `applicable_controls + excluded_controls` 必须**覆盖 42001 附录 A 全部 38 项**(不多不少)
**INV-40** 每个 excluded control 必填 `exclusion_rationale`
**INV-41** SoA 变更必须经 governance.Gate(kind=soa-update)
**INV-42** `artifact_ref` 与 SoA 双身份一致(同 AIIA)

### 2.7 Nonconformity 聚合根

#### 2.7.1 完整字段

```
Nonconformity {
    nonconf_id:              ULID,
    raised_by:               ActorRef,
    raised_at:               Timestamp,
    source:                  NonconfSource,        // control_violation / audit_finding /
                                                    //  gate_override / incident / user_report
    source_ref:              Option<Ref>,          // 指向触发的 Gate / Control / event

    // 描述
    title:                   String,
    description:             String,
    severity:                Severity,             // minor / major / critical

    // 关联
    related_controls:        Vec<ControlRef>,      // 违反的 Control
    related_project_id:      Option<ProjectId>,
    related_aiia_id:         Option<AIIAId>,
    related_artifacts:       Vec<ArtifactRef>,

    // 纠正措施
    corrective_actions:      Vec<CorrectiveAction>,
    root_cause_analysis:     Option<String>,

    // 生命周期
    status:                  NonconfStatus,        // open / investigating / corrective_action_planned /
                                                   //  corrective_action_in_progress / resolved / closed

    // 责任
    owner:                   ActorRef,
    due_date:                Option<Timestamp>,
    resolved_at:             Option<Timestamp>,
    verified_at:             Option<Timestamp>,

    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}

CorrectiveAction {
    action_id:               String,
    description:             String,
    responsible_party:       ActorRef,
    due_date:                Timestamp,
    status:                  enum { planned / in_progress / completed / verified },
    evidence_refs:           Vec<ArtifactRef>,
    related_policy_updates:  Vec<PolicyRef>,       // 若引发 Policy 更新
}
```

#### 2.7.2 不变量(INV-43 到 INV-47)

**INV-43** `severity=critical` 必须 24h 内进入 investigating 状态
**INV-44** `status=resolved` 必须所有 corrective_actions 完成
**INV-45** `status=closed` 必须 verified_at 非空(验证完成)
**INV-46** `source=control_violation` 必须有 related_controls
**INV-47** `severity=critical` 的 Nonconformity 自动触发 governance.Gate(kind=nonconformity-resolution)

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.governance.v1;

service GovernanceService {
    // === Gate 管理 ===
    rpc RaiseGate(RaiseGateRequest) returns (RaiseGateResponse);
    rpc AttachEvidence(AttachEvidenceRequest) returns (AttachEvidenceResponse);
    rpc MoveGateToReview(MoveGateToReviewRequest) returns (MoveGateToReviewResponse);
    rpc CastVote(CastVoteRequest) returns (CastVoteResponse);
    rpc DecideGate(DecideGateRequest) returns (DecideGateResponse);
    rpc ExpireGate(ExpireGateRequest) returns (ExpireGateResponse);
    rpc CancelGate(CancelGateRequest) returns (CancelGateResponse);

    rpc GetGate(GetGateRequest) returns (Gate);
    rpc ListGates(ListGatesRequest) returns (ListGatesResponse);
    rpc QueryGates(QueryGatesRequest) returns (QueryGatesResponse);

    // === Policy 管理 ===
    rpc DraftPolicy(DraftPolicyRequest) returns (DraftPolicyResponse);
    rpc ActivatePolicy(ActivatePolicyRequest) returns (ActivatePolicyResponse);
    rpc SupersedePolicy(SupersedePolicyRequest) returns (SupersedePolicyResponse);
    rpc RetirePolicy(RetirePolicyRequest) returns (RetirePolicyResponse);

    rpc GetPolicy(GetPolicyRequest) returns (Policy);
    rpc ListPolicies(ListPoliciesRequest) returns (ListPoliciesResponse);
    rpc GetApplicablePolicies(GetApplicablePoliciesRequest) returns (GetApplicablePoliciesResponse);
      // 按 (scope, scope_target) 查询当前生效的所有 Policy(Runtime C6 + capability-hub 订阅)

    // === Control 管理 ===
    rpc DeclareControl(DeclareControlRequest) returns (DeclareControlResponse);
    rpc UpdateControlImplementation(UpdateControlImplementationRequest)
        returns (UpdateControlImplementationResponse);
    rpc ReviewControl(ReviewControlRequest) returns (ReviewControlResponse);

    rpc GetControl(GetControlRequest) returns (Control);
    rpc ListControls(ListControlsRequest) returns (ListControlsResponse);

    // === AIIA 管理 ===
    rpc CreateAIIA(CreateAIIARequest) returns (CreateAIIAResponse);
    rpc UpdateAIIA(UpdateAIIARequest) returns (UpdateAIIAResponse);
    rpc SubmitAIIAForReview(SubmitAIIAForReviewRequest) returns (SubmitAIIAForReviewResponse);
    rpc ApproveAIIA(ApproveAIIARequest) returns (ApproveAIIAResponse);
    rpc SupersedeAIIA(SupersedeAIIARequest) returns (SupersedeAIIAResponse);

    rpc GetAIIA(GetAIIARequest) returns (ImpactAssessment);
    rpc ListAIIAs(ListAIIAsRequest) returns (ListAIIAsResponse);

    // === SoA 管理 ===
    rpc DraftSoA(DraftSoARequest) returns (DraftSoAResponse);
    rpc PublishSoA(PublishSoARequest) returns (PublishSoAResponse);
    rpc SupersedeSoA(SupersedeSoARequest) returns (SupersedeSoAResponse);

    rpc GetSoA(GetSoARequest) returns (SoADocument);
    rpc GetActiveSoA(GetActiveSoARequest) returns (SoADocument);

    // === Nonconformity 管理 ===
    rpc RaiseNonconformity(RaiseNonconformityRequest) returns (RaiseNonconformityResponse);
    rpc UpdateNonconformity(UpdateNonconformityRequest) returns (UpdateNonconformityResponse);
    rpc AddCorrectiveAction(AddCorrectiveActionRequest) returns (AddCorrectiveActionResponse);
    rpc VerifyNonconformity(VerifyNonconformityRequest) returns (VerifyNonconformityResponse);
    rpc CloseNonconformity(CloseNonconformityRequest) returns (CloseNonconformityResponse);

    rpc GetNonconformity(GetNonconformityRequest) returns (Nonconformity);
    rpc ListNonconformities(ListNonconformitiesRequest) returns (ListNonconformitiesResponse);

    // === 管理评审(42001 §9.3)===
    rpc ScheduleManagementReview(ScheduleManagementReviewRequest) returns (ScheduleResponse);
    rpc RecordManagementReview(RecordManagementReviewRequest) returns (RecordResponse);
}
```

### 3.2 关键请求示例

#### RaiseGate

```proto
message RaiseGateRequest {
    GateKind kind = 1;
    optional string project_id = 2;
    Trigger trigger = 3;
    DecisionRequest decision_request = 4;
    repeated CandidateOption candidate_options = 5;
    EvidenceRequirement evidence_requirement = 6;
    DecisionMaker decision_maker = 7;
    AutonomyLevel autonomy_level = 8;
    TimeoutPolicy timeout_policy = 9;
    audit.ActorContext actor = 10;
}

message RaiseGateResponse {
    string gate_id = 1;
    GateState state = 2;  // 预期 pending
    google.protobuf.Timestamp created_at = 3;
}
```

#### DecideGate

```proto
message DecideGateRequest {
    string gate_id = 1;
    string chosen_option_id = 2;
    string decision_rationale = 3;
    repeated Condition conditions = 4;
    audit.ActorContext actor = 5;
}

message DecideGateResponse {
    string gate_id = 1;
    Resolution resolution = 2;
    google.protobuf.Timestamp decided_at = 3;
}
```

#### GetApplicablePolicies

供 Runtime C6 Policy Cache 和 capability-hub 订阅使用:

```proto
message GetApplicablePoliciesRequest {
    oneof scope_query {
        string organization_id = 1;
        string project_id = 2;
        string role_id = 3;
        string member_id = 4;            // 给定 Member,返回全部生效的 Policy(含继承)
    }
    repeated PolicyKind filter_kinds = 5;
    optional google.protobuf.Timestamp as_of = 6;  // 时间点查询(审计用)
}

message GetApplicablePoliciesResponse {
    repeated Policy policies = 1;         // 按优先级降序
    google.protobuf.Timestamp resolved_at = 2;
    string policy_fingerprint = 3;        // 所有 policy 的哈希(Runtime 用来判断是否需要刷新)
}
```

### 3.3 权限与认证

- **内部**:mTLS + 白名单服务
- **外部**:OAuth2 + 强 RBAC
- **写操作**几乎都需要审批:
  - `ActivatePolicy` 需要 policy-update Gate
  - `DecideGate(kind=critical)` 需要用户登录态验证(非 Member 自动)
  - `PublishSoA` 需要 soa-update Gate
  - `ApproveAIIA` 需要 impact-assessment Gate
- **读操作**:
  - project 内参与者可读自己项目的 Gate / AIIA
  - 组织级 Policy / SoA / Control 对组织内所有 Member / User 可读(透明)
  - Nonconformity 限 auditor / owner / 相关责任方可读

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Query 类 RPC **不接受 Role 参数**,返回全量字段;按 Role 的字段可见性、脱敏、派生字段由 UI 仓消费 method-library 的 ViewProfile 实现。actor 仅用于鉴权和审计留痕。

### 3.4 常见错误码

- `GATE_NOT_FOUND` / `POLICY_NOT_FOUND` / `CONTROL_NOT_FOUND`
- `INCOMPLETE_SIX_SEGMENTS`(INV-4 违反)
- `INVALID_AUTONOMY_LEVEL`(INV-5 / INV-12 违反)
- `USER_REQUIRED`(INV-13 违反,某些 kind 必须 user 决策)
- `NO_REJECT_OPTION`(INV-14 违反)
- `POLICY_CONFLICTS_WITH_SHARED_RULES`(INV-20)
- `SOA_MUST_COVER_ALL_38_CONTROLS`(INV-39)

---

## 四、事件 schema 细节

### 4.1 事件清单

#### Gate 级

| 事件 | 订阅方 |
|---|---|
| `governance.gate.raised` | conversation(发 gate Turn)/ Chat / Bridges / process(Activity 挂起确认)/ observability |
| `governance.gate.evidence_attached` | conversation / process |
| `governance.gate.moved_to_review` | conversation / Chat |
| `governance.gate.vote_cast` | conversation / observability |
| `governance.gate.decided` | 大量:conversation / process(唤醒 Activity)/ work / artifact / identity / observability / archive |
| `governance.gate.expired` | 同上(按策略可能级联其他动作) |
| `governance.gate.cancelled` | conversation / process / observability |

#### Policy 级

| 事件 | 订阅方 |
|---|---|
| `governance.policy.drafted` | observability |
| `governance.policy.activated` | **大量**:L2 runtime C6 Policy Cache / capability-hub / work / observability |
| `governance.policy.superseded` | 同上 |
| `governance.policy.retired` | 同上 |
| `governance.policy.conflict` | **审计严重**:observability 告警 |
| `governance.policy.propagation_lag` | observability 告警 |

#### Control 级

| 事件 | 订阅方 |
|---|---|
| `governance.control.declared` | SoA(可能需要更新) / observability |
| `governance.control.implementation_updated` | SoA / observability |
| `governance.control.reviewed` | observability |
| `governance.control.review_overdue` | **审计告警** |
| `governance.control.violated` | Nonconformity(可能触发) / observability 告警 |

#### AIIA 级

| 事件 | 订阅方 |
|---|---|
| `governance.aiia.created` | artifact(双身份同步) / observability |
| `governance.aiia.submitted_for_review` | conversation |
| `governance.aiia.approved` | artifact(双身份 approved) / work(project.aiia_attached) / archive |
| `governance.aiia.superseded` | artifact / work |

#### SoA 级

| 事件 | 订阅方 |
|---|---|
| `governance.soa.drafted` | observability |
| `governance.soa.published` | artifact(双身份)/ archive / observability |
| `governance.soa.superseded` | 同上 |

#### Nonconformity 级

| 事件 | 订阅方 |
|---|---|
| `governance.nonconformity.raised` | conversation(Chat 告警)/ observability / 视 severity 触发 Gate |
| `governance.nonconformity.corrective_action_added` | work(可能创建 WorkItem) / observability |
| `governance.nonconformity.resolved` | observability / 相关 Control 可能刷新 |
| `governance.nonconformity.closed` | observability / archive |

### 4.2 核心事件 schema

#### governance.gate.raised

```
type:       governance.gate.raised
subject:    gate_id
severity:   normal|high|critical(按 kind + urgency 决定)

data: {
    gate_id,
    kind,
    project_id,
    trigger_summary,
    decision_request_summary,
    candidate_option_ids,
    evidence_required,        // 简要描述
    decision_maker_type,
    autonomy_level,
    timeout_at,
    trace_id,
}
```

#### governance.gate.decided

```
type:       governance.gate.decided
subject:    gate_id

data: {
    gate_id,
    kind,
    project_id,
    chosen_option_id,
    decided_by,
    decided_at,
    decision_rationale_summary,
    conditions,
    approvals_count,          // 若 quorum
    duration_from_raised,     // 从 raised 到 decided 的时长
    trace_id,
}
```

**关键**:此事件驱动**大量跨域响应**:
- process 唤醒等待 Gate 的 Activity
- work 更新 Project / WorkItem 状态
- artifact 触发 Artifact 的 approved / baselined
- identity 触发 member lifecycle 变化
- conversation 发 decision-kind Turn
- archive 记录合规证据

#### governance.policy.activated

```
subject:    policy_id
data: {
    policy_id,
    kind,
    scope,
    scope_target,
    version,
    previous_policy_id,       // 若是 supersede
    priority,
    is_shared_rules,
    effective_from,
    effective_until,
    fingerprint,              // Policy 哈希,供订阅方判断是否需要全量刷新
}
```

**Runtime C6 Policy Cache 响应**:
- 比较 fingerprint,变化则 GetApplicablePolicies 拉取新全量
- 更新本地 cache
- 发 `member.policy_cache_refreshed` 事件

#### governance.control.violated

```
subject:    control_id
severity:   high|critical

data: {
    control_id,
    violation_description,
    violated_in_project,
    violation_evidence_ref,   // 指向触发事件 / Artifact
    suggested_nonconformity:  bool,  // 是否建议自动创建 Nonconformity
    triggered_by,
}
```

自动触发 `RaiseNonconformity` 若 suggested_nonconformity=true。

#### governance.policy.conflict(审计严重)

```
severity:   critical
data: {
    conflicting_policies:    Vec<PolicyRef>,
    conflict_description,
    affected_scope,
    detected_at,
    auto_resolution:         enum { rejected_lower / both_paused / awaiting_manual },
}
```

冲突必须人工介入,不允许系统默认选一个。

### 4.3 订阅事件(来自其他域)

| 来源 | 事件 | 本域动作 |
|---|---|---|
| process | `process.activity.waiting_gate` | 若 Gate 尚未创建,按 Activity 配置自动 RaiseGate |
| process | `process.activity.auto_action_executed`(ADR-0008) | 审计留痕;AutoAction 触发频率达阈值时,触发 Policy 重评 Gate |
| process | `process.profile.activated` | 记录 Profile 激活的审计;若涉及强制 Gate 调整,刷新 Policy |
| work | `work.project.started` | 检查是否需要强制 AIIA(INV-10 触发 impact-assessment Gate) |
| work | `work.project.context_of_use_updated` | 检查 compliance_profile 变化 → 可能触发 AIIA 重评 |
| work | `work.project.member_tool_scope_updated` | 若 trigger=policy_reevaluation 则合环记录;其他场景审计留痕 |
| artifact | `artifact.reviewed` | 若 Artifact kind 对应某 Gate(如 prototype-approval),检查是否需要发 Gate |
| artifact | `artifact.content_tampered`(严重审计)| 自动 RaiseNonconformity,severity=critical |
| identity | `identity.member.role_changed` | 可能触发 Policy 重评 |
| method-library | `method_library.ai_policy.published` | 同步 AIPolicy 条款为本域 Policy 的引用基础(42001 §5.2) |
| method-library | `method_library.configuration.activated` | 若新 Configuration 涉及本组织的 Policy / Control,重评合规性 |
| method-library | `method_library.content.fingerprint_changed`(涉及 AIPolicyDef)| 对齐本域 Policy 引用的 AIPolicyDef,fingerprint 不匹配告警 |
| L2 member | `member.tool_invoked` 的 Policy denied 场景 | 累积统计,达阈值触发 governance.control.violated |
| observability | 周期触发(每月 1 日) | Control.review_overdue 检查 |

### 4.4 事件幂等

- `governance.gate.raised` 幂等 key:`trigger.trigger_event_ref + kind + project_id`(相同触发不重复 raise)
- `governance.policy.activated` 幂等 key:`policy_id + version`
- 所有订阅方用 event_id LRU 去重

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**理由**:
- 所有聚合根都有强一致性要求(特别是 Gate / Policy / Nonconformity)
- 复杂查询(Policy 按 scope 解析、Control 按 category 查)适合 SQL
- JSONB 存规则 DSL / audit_trail / rules

**审计事件存储**:由 observability 仓承载(append-only + 哈希链),本域只发出事件。

### 5.2 表结构

#### table: `gates`

| 列 | 类型 | 约束 |
|---|---|---|
| gate_id | ULID PK | |
| kind | enum | not null |
| project_id | ULID | nullable FK(软引用) |
| trigger | jsonb | not null |
| decision_request | jsonb | not null |
| candidate_options | jsonb | not null |
| evidence_requirement | jsonb | not null |
| decision_maker | jsonb | not null |
| autonomy_level | int | not null |
| timeout_policy | jsonb | not null |
| resolution | jsonb | nullable |
| audit_trail | jsonb | not null default '[]' |
| state | enum | not null |
| created_at / decided_at / expired_at | timestamptz | |
| trace_id | varchar(64) | not null |
| version | bigint | default 1 |

**索引**:
- `idx_gates_project_state` on (project_id, state)
- `idx_gates_kind_state` on (kind, state)
- `idx_gates_created_at` on (created_at desc)
- `idx_gates_timeout` on (timeout_at) where (state in ('pending','in_review')) -- 扫描即将过期的 Gate

#### table: `approvals`

| 列 | 类型 |
|---|---|
| approval_id | ULID PK |
| gate_id | ULID FK |
| approver_actor_id | varchar(128) |
| vote | enum |
| rationale | text |
| evidence_reviewed | jsonb |
| voted_at | timestamptz |
| trace_id | varchar(64) |

**唯一约束**:`unique (gate_id, approver_actor_id) where vote != 'cancelled'` —— 强制 INV-16

#### table: `policies`

| 列 | 类型 |
|---|---|
| policy_id | ULID PK |
| kind | enum |
| scope | enum |
| scope_target | jsonb |
| rules | jsonb |
| rule_schema_version | varchar(32) |
| priority | int |
| is_shared_rules | bool |
| effective_from / effective_until | timestamptz |
| approved_by | varchar(128) |
| related_gate_id | ULID |
| version | varchar(32) |
| supersedes / superseded_by | ULID |
| lifecycle | enum |
| subscribers_published | timestamptz |
| subscribers_applied_at | jsonb |

**索引**:
- `idx_policies_scope_target` on (scope, scope_target, lifecycle)
- `idx_policies_is_shared` on (is_shared_rules, lifecycle) where is_shared_rules
- `idx_policies_priority` on (scope, priority desc) where lifecycle='active'

#### table: `controls`

| 列 | 类型 |
|---|---|
| control_id | varchar(64) PK(如 "A.4.2") |
| category | enum |
| display_name | varchar(256) |
| description | text |
| scope | enum |
| scope_target | jsonb |
| applicability | enum |
| applicability_rationale | text |
| implementation_status | enum |
| implementation_notes | text |
| evidence_refs | jsonb |
| owner | varchar(128) |
| reviewers | jsonb |
| review_cycle | jsonb |
| last_reviewed_at / next_review_due | timestamptz |
| related_policies | jsonb |
| related_risks | jsonb |
| related_nonconformities | jsonb |
| lifecycle | enum |

**索引**:
- `idx_controls_category_status` on (category, implementation_status)
- `idx_controls_review_due` on (next_review_due) where (lifecycle='active')

#### table: `impact_assessments`

| 列 | 类型 |
|---|---|
| aiia_id | ULID PK |
| project_id | ULID FK |
| scope | jsonb |
| affected_parties | jsonb |
| impact_dimensions | jsonb |
| mitigation_plan | jsonb |
| residual_risk | jsonb |
| status | enum |
| conducted_by | varchar(128) |
| reviewed_by | jsonb |
| approved_via_gate | ULID |
| approved_at | timestamptz |
| version | varchar(32) |
| supersedes | ULID |
| artifact_ref | jsonb |

#### table: `soa_documents`

同 SoA 聚合字段。

#### table: `nonconformities`

| 列 | 类型 |
|---|---|
| nonconf_id | ULID PK |
| raised_by / raised_at | |
| source / source_ref | |
| title / description / severity | |
| related_controls / related_project_id / related_aiia_id / related_artifacts | jsonb |
| corrective_actions | jsonb |
| root_cause_analysis | text |
| status | enum |
| owner / due_date / resolved_at / verified_at | |

**索引**:
- `idx_nonconf_severity_status` on (severity, status)
- `idx_nonconf_due_date` on (due_date) where status not in ('closed')

#### table: `governance_events_outbox`

同其他域 Outbox 模式。

### 5.3 一致性策略

- **Gate 决策**:DecideGate 单事务(state + resolution + audit_trail + Outbox 事件)
- **Policy 激活**:ActivatePolicy + 相关 supersede 单事务
- **AIIA / SoA 与 Artifact 双身份**:
  - 治理域 AIIA / SoA 状态变更 + artifact 域镜像 Artifact 状态变更 通过**事件驱动同步**,不做跨域分布式事务
  - 幂等性保证一致(若 artifact 侧失败,有补偿事件重试)
- **Nonconformity 的 corrective_action**:每个 action 的状态更新单事务

### 5.4 容量假设

- 10w 项目 × 平均 20 Gate/项目 = 200w Gate
- 每年组织级 Policy 变更 20-100 次 × 项目级 100 次/项目 = 1000w Policy 记录(含历史)
- 38 个 Control × 10w 项目 + 组织级 = 400w Control 记录
- AIIA:每 project 每年 1-2 份 = 20w AIIA
- Nonconformity:频率低,百万级

### 5.5 审计日志的专用存储

- governance 域本身的 PG 只存聚合根当前状态 + audit_trail 字段
- **完整事件流** 由 observability 仓承载(append-only + 哈希链)
- **复盘查询**(如 "2025 年 Q3 所有 AIIA 决策")走 observability 仓的审计索引

### 5.6 迁移与演进

- Schema 变更走 migration
- Policy schema version 升级需要 Policy 本身的 migration path(rule_schema_version 字段)
- 跨版本 Policy 共存期间,订阅方需兼容多版本

---

## 六、与其他域的事件订阅链路

### 6.1 事件流全景

```
governance 域 → 其他域
────────────────────
governance.gate.decided           → process(唤醒 Activity)/ work(ProjectMember / WorkItem 状态)/
                                    artifact(Artifact 状态)/ identity(Member 生命周期)/
                                    conversation(decision Turn)/ archive
governance.policy.activated       → L2 runtime / capability-hub / work / observability
governance.aiia.approved          → artifact / work / archive
governance.soa.published          → artifact / archive
governance.nonconformity.raised   → conversation(Chat 告警)/ 相关域(修正流程)
governance.control.violated       → Nonconformity(自动触发)

其他域 → governance 域
────────────────────
process.activity.waiting_gate     → 自动 RaiseGate(若 process 未指定 Gate)
work.project.started              → 检查强制 AIIA
work.project.context_of_use_updated → AIIA 重评
artifact.content_tampered         → 自动 RaiseNonconformity
identity.member.role_changed      → Policy 重评
L2 member.* 审计事件              → Policy 规则监控
```

### 6.2 典型场景 A:Gate 完整生命周期

```
[T0] process.activity.waiting_gate(activity=A)
        │
        │ governance 订阅
        ▼
[T1] governance.RaiseGate(kind=requirements-confirm, trigger_event_ref=...)
     六段自动填充(trigger / request / options / evidence / maker / audit)
     [governance.gate.raised]
        │
        ├──→ conversation:发 gate-kind Turn
        │    [conversation.turn_posted(kind=gate)]
        │
        └──→ process:Activity 已挂起,等待 Gate 决策(state=waiting_gate 不变,Gate 已对应)

[T2] Artifact 满足证据要求(如 requirement_v1 approved)
        │ governance 侦测
        ▼
[T3] governance.MoveGateToReview(gate_id)
     [governance.gate.moved_to_review]
        │
        ├──→ conversation:更新 gate Turn 为"可审批"
        │
        └──→ Chat 用户看到"可审批"按钮

[T4] 用户在 Chat 点 approve
        │
        ▼
[T5] governance.DecideGate(chosen=approve, rationale)
     [governance.gate.decided]
        │
        ├──→ conversation:发 decision-kind Turn
        │
        ├──→ process:Activity 从 waiting_gate 恢复,继续执行
        │    [process.activity.completed]
        │
        ├──→ artifact:Artifact 状态转 approved
        │    [artifact.approved]
        │
        └──→ observability:记录完整决策链
```

### 6.3 典型场景 B:Policy 下发的跨域链路

```
[T0] 组织管理员在 Console 修改"Tool 白名单"Policy
        │
        ▼
[T1] governance.DraftPolicy(kind=tool-whitelist, scope=organization, rules=...)
     [governance.policy.drafted]

[T2] 管理员提交 soa-update 审批(以此为例,其实是 policy-update Gate)
        │
        ▼
[T3] governance.RaiseGate(kind=policy-update)
     [governance.gate.raised]
        │ 用户审批
        ▼
[T4] governance.gate.decided(approve)
        │
        ▼
[T5] governance.ActivatePolicy(policy_id)
     [governance.policy.activated]
        │
        ├──→ L2 runtime 订阅(全部 active Member 容器):
        │    C6 Policy Cache 收到 fingerprint 变化
        │    异步 GetApplicablePolicies 拉取
        │    更新 cache
        │    下次 LLM Loop 循环生效
        │    发 `member.policy_cache_refreshed`
        │
        ├──→ capability-hub 订阅:
        │    更新 MCP whitelist
        │
        ├──→ work 订阅:
        │    重评所有 active ProjectMember.tool_scope
        │    若违反 INV-21 → 发事件 `work.project.member_tool_scope_updated`(附 trigger=policy_reevaluation)
        │
        └──→ observability:分发延迟监控

[T6] 所有订阅方 ACK 后(30 秒内),governance 更新 subscribers_applied_at
     若超时,发 `governance.policy.propagation_lag` 告警
```

### 6.4 典型场景 C:AIIA 全流程

```
[T0] work.project.started(compliance_profile=[EU AI Act, GDPR])
        │
        │ governance 订阅,INV-10 触发
        ▼
[T1] governance.RaiseGate(kind=impact-assessment, auto-create)
     [governance.gate.raised]

[T2] Auditor Role 的 Member 收到 Activity 产出 AIIA 草稿
     governance.CreateAIIA(project_id, scope, affected_parties, ...)
     [governance.aiia.created]
        │
        └──→ artifact:创建镜像 Artifact(kind=impact-assessment, state=initiated)

[T3] AIIA 草稿完成 → SubmitForReview
     [governance.aiia.submitted_for_review]
        │
        └──→ conversation:发通知 Turn

[T4] reviewers 评审通过 → Gate 决策 approve
     governance.gate.decided(kind=impact-assessment)
        │
        ▼
[T5] governance.ApproveAIIA(aiia_id, gate_ref)
     [governance.aiia.approved]
        │
        ├──→ artifact:镜像 Artifact 状态 → approved(双身份同步)
        │
        ├──→ work:Project.aiia_ref 写入
        │    [work.project.aiia_attached]
        │
        └──→ archive:记录为合规证据

(一年后,AIIA 到期)
[T_N] governance 周期扫描(每月 1 日)发现 AIIA 即将到期
        │
        ▼
[T_N+1] 自动创建 impact-assessment Gate(kind=impact-assessment-renewal)
        触发新一轮 AIIA 审查
```

### 6.5 典型场景 D:Nonconformity 处置

```
[T0] L2 member 的 tool_invoked 事件累积检测到 Policy 违反
     governance.control.violated(control=A.4.2 Tooling Resources)
     [governance.control.violated]
        │
        │ governance 订阅(自身)
        ▼
[T1] governance.RaiseNonconformity(source=control_violation, severity=major, ...)
     [governance.nonconformity.raised]
        │
        ├──→ conversation:Chat 红点告警
        │
        └──→ observability:严重审计 + 告警

[T2] Auditor 进入 Nonconformity 详情,分析根因,添加 corrective actions
     governance.UpdateNonconformity(status=investigating)
     governance.AddCorrectiveAction(action=..., due=...)
     [governance.nonconformity.corrective_action_added]
        │
        └──→ work:可能创建对应 WorkItem(kind=task)执行纠正

[T3] corrective actions 逐个完成,governance.UpdateCorrectiveAction(status=completed)
     所有 actions 完成后 status=resolved
     [governance.nonconformity.resolved]

[T4] Auditor 验证纠正效果 → VerifyNonconformity
     [governance.nonconformity.closed]
        │
        ├──→ 相关 Control 的 implementation_status 可能刷新
        │
        └──→ archive:记录完整处置证据
```

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 |
|---|---|
| RaiseGate P95 | < 150ms |
| DecideGate P95 | < 200ms(含 Outbox + 跨域事件) |
| GetApplicablePolicies P95 | < 50ms(高频,Runtime / capability-hub 调用) |
| Policy fingerprint 变化到 Runtime 生效 P95 | < 30s(最终一致) |
| RaiseNonconformity P95 | < 200ms |
| AIIA / SoA 查询 P95 | < 300ms |
| Availability | ≥ 99.95%(治理可用性比其他域要求更高) |

### 7.2 容量假设

- QPS 峰值:Gate 写入 100 / 秒,GetApplicablePolicies 5000 / 秒(高频读)
- 200w Gate / 1000w Policy 记录
- 跨域事件订阅方典型 5-10 个

### 7.3 降级策略

- **Policy 查询高并发**:Runtime C6 本地缓存 + fingerprint 校验,不命中走服务
- **governance 挂**:
  - RaiseGate 失败 → Activity 进 `blocked` 状态,等待恢复
  - DecideGate 失败 → Gate 保持 in_review,不丢决策
  - Policy 查询失败 → Runtime 降级使用最后已知 Policy(带 stale 标记,审计可见)
- **审计事件堆积**:observability 暂时不可用时,本域 Outbox 积压,不阻塞业务写入

### 7.4 监控关键点

- Gate 状态分布(pending / in_review / decided / expired 比例)
- Gate 超时率(expired / decided 比值 高需调整 timeout_policy)
- Policy 分发延迟(subscribers_applied_at 延迟)
- Nonconformity 未关闭数量 / 超期数
- AIIA 到期告警
- Control review_overdue 数

---

## 八、安全与合规对齐

### 8.1 42001 全套对齐

| 章节 | 本域落地 |
|---|---|
| §4 组织环境 | SoA 的 scope_description |
| §5 领导 | AI Policy(method-library)+ 本域 Policy 的 approved_by 体现领导承诺 |
| §6 策划 | AIIA + SoA + Risk Assessment(AIIA 的 impact_dimensions)|
| §7 支持 | Control A.4 Human Resources 的 evidence |
| §8 运行 | AIIA §8.2 + Gate 的全 kind 覆盖运行控制 |
| §9 绩效评价 | Control 定期复评 + 管理评审(ScheduleManagementReview) |
| §10 改进 | Nonconformity 全流程 |
| 附录 A 38 控制项 | Control 聚合根 + SoA 声明 |

### 8.2 24748-2 对齐

- Gate = Decision Gate 一等对象化(§5.2 + §7.2)
- AIIA / SoA / ComplianceDeclaration 对齐 §5.3 Tailoring Record + §5.4 Conformance Claim
- AuditTrail 完整性对齐 §3.4 可追溯

### 8.3 9001 对齐

- PDCA 循环:Policy(Plan)→ Gate / Control 执行(Do)→ Control review / Management Review(Check)→ Nonconformity / Corrective Action(Act)
- §7.5 Documented Information:所有治理活动产出
- §10.1 不符合与纠正措施:Nonconformity 聚合根直接对应

### 8.4 Research 自主性 5 级对齐

```
autonomy_level = 1  操作者 — 用户手动执行,AI 不介入决策
autonomy_level = 2  协作者 — AI 建议,用户决策
autonomy_level = 3  顾问 — AI 推荐答案,用户确认(典型 Gate 场景)
autonomy_level = 4  审批者 — AI 自主决策,用户事后审批
autonomy_level = 5  观察者 — AI 全自主,用户只审计(严格约束)
```

**硬约束**:
- INV-5:autonomy_level=5 必须有 policy_auto 明示授权
- INV-12:impact-assessment Gate 必须 ≤ 3
- INV-13:release / archive / dissolve 必须 user 决策(最高权威)

### 8.5 Research 指令优先级对齐

shared_rules > role > project:
- is_shared_rules=true 的 Policy 优先级必须最高(INV-19)
- 低 scope 不能覆盖 shared_rules(INV-20)
- Runtime C2 Prompt Composer 严格执行分层(ai-member 设计 §4.3)

### 8.6 横切红线

- **可审计性**:audit_trail append-only;observability 完整事件链;所有 Gate / Policy / Nonconformity 变更留痕
- **可追溯性**:Gate → Activity / Artifact / Turn 多源引用;Policy fingerprint 可验证
- **可裁剪性**:Policy scope + priority 机制;Gate candidate_options 完全自定义;Control applicability 可标注不适用

---

## 九、测试策略

### 9.1 单元测试重点

- **Gate 六段式完整性**:缺任一段决策请求被拒(INV-4 / 六段约束)
- **autonomy_level 硬约束**(INV-5 / INV-12 / INV-13)
- **候选选项**必含 reject(INV-14)
- **Policy 优先级**:shared_rules 不被低 scope 覆盖(INV-20)
- **SoA 必须覆盖 38 控制项**(INV-39)
- **AIIA residual_risk=unacceptable 不可 approve**(INV-34)
- 关键聚合覆盖率 ≥ 95%(治理域要求更严)

### 9.2 集成测试重点

- Gate 决策的完整跨域事件链(从 raise 到 6+ 订阅方 ACK)
- Policy 下发的一致性(fingerprint 比对、订阅方应用时间)
- AIIA 双身份(治理 + 制品)的事件同步
- Nonconformity 自动触发场景(content_tampered → raise_nonconf)
- Control.violated 累积检测阈值

### 9.3 E2E 场景

- 场景 A 完整 Gate 生命周期
- 场景 B Policy 下发跨域链路
- 场景 C AIIA 全流程 + 周期复评
- 场景 D Nonconformity 处置 + corrective actions

### 9.4 安全测试

- autonomy_level=5 无 policy_auto 授权被拒
- 低 scope Policy 覆盖 shared_rules 被拒
- 非 user 决策 release/archive 被拒
- Gate 六段缺失被拒
- SoA 未覆盖 38 控制项被拒
- audit_trail 尝试修改失败

### 9.5 性能压测

- 5000 QPS GetApplicablePolicies
- 100 QPS RaiseGate / DecideGate
- 200w Gate 数据集下查询延迟
- Policy fingerprint 变化的分发时效

---

## 十、开放问题

### Q1. Gate kind 扩展机制

**背景**:10 种用户可见 kind + 8 种内部 kind,将来需要扩展。

**候选**:
- A custom kind + metadata 约定(当前方案)
- B 开放 kind 枚举,走 ADR 定义新 kind
- C 混合(核心 kind 硬编码,扩展通过 method-library)

**倾向**:C

**推进**:method-library 设计阶段决策。

### Q2. Policy 规则 DSL 的设计

**背景**:rules 字段使用何种 DSL?

**候选**:
- A 自定义 JSON schema + 表达式语言
- B 借用 OPA / Rego 的 Rego 语言
- C Cedar(AWS 开源)
- D 仅允许 Rust / Python 手写规则函数

**倾向**:B(Rego 成熟,生态好)

**推进**:走独立 ADR,影响 L2 runtime 和 capability-hub 的 Policy 消费实现。

### Q3. AIIA 的自动化程度

**背景**:AIIA 目前由 Auditor Role 手动起草。能否 LLM 辅助?

**候选**:
- A 纯手动(确保 42001 合规)
- B LLM 辅助起草 + 人工审核(AI 生成 + Human Review)
- C 半自动(基于 project 配置 + 历史 AIIA 生成模板)

**倾向**:C 起步,B 作为增强

**推进**:原型阶段 + 42001 审计实践后决策。

### Q4. 多组织 Policy 继承

**背景**:企业租户场景下,集团级 Policy 继承到部门级、项目级。

**候选**:
- A 当前 scope 机制足够(organization / project / role / member 四层)
- B 引入 organization 的层级(集团 / 子公司 / 部门 / 项目)
- C 完全独立 tenant,无继承

**倾向**:A 起步,大企业场景触发 B

**推进**:多租户功能阶段决策。

### Q5. Nonconformity 的自动检测阈值

**背景**:governance.control.violated 的累积检测怎么设定阈值?

**候选**:
- A 固定阈值(如连续 3 次 Policy denied)
- B Policy 自身配置(不同 control 不同阈值)
- C 自适应(统计基线 + 异常检测)

**倾向**:B

**推进**:Policy DSL 定稿后。

### Q6. 管理评审的自动化

**背景**:42001 §9.3 要求定期管理评审。

**候选**:
- A 定期人工(Auditor + 管理层)
- B 系统聚合数据 → 生成评审报告草稿 → 人工定稿
- C 完全数据驱动 + AI 分析(辅助决策)

**倾向**:B

**推进**:Console 设计阶段决策。

### Q7. Gate 决策的回滚机制

**背景**:INV-9 resolution 不可修改。但决策错误怎么办?

**候选**:
- A 只能发新 Gate 纠正(当前)
- B 允许在 72 小时内 cancel 已 decided 的 Gate(带特殊 Gate 类型)
- C 特定 severity 的错误决策触发 Nonconformity + 补偿 Gate

**倾向**:C

**推进**:实际使用阶段基于错误率调。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-governance` 仓 README(段 3)

- §二 聚合根 → src/domain/
- §三 RPC → proto/
- §四 事件 → src/events/
- §五 持久化 → migrations/
- §六 跨域 → src/subscriptions/
- §九 测试 → tests/

### 11.2 与 process 域(待写)

- process.activity.waiting_gate 事件驱动 Gate 自动创建
- Gate 的 kind 与 process.ProcessTemplate.gates_required 对齐
- governance 是 process 的"决策手段",不直接执行过程
- **不为 Activity / WorkItem 不一致新增 kind**(ADR-0008):走已有 `quality-gate` / `design-choice` / `release-confirm`,差别通过 `decision_request.context_summary` + `candidate_options.metadata` 承载
- **AutoAction 授权复用 autonomy_level**(ADR-0008):ActivityDef.completion_policy=try_auto_then_gate 时,运行时以当前 Project × Activity 的有效 autonomy_level 决定 AutoAction 是否执行;级别不足自动退化为 raise_gate;执行必发 `process.activity.auto_action_executed` 事件,本域订阅记审计

### 11.3 与 artifact 域

- AIIA / SoA / ComplianceDeclaration 的双身份(治理 + 制品)
- Gate 决策驱动 Artifact 状态转移(approved / baselined)
- content_tampered 自动触发 Nonconformity

### 11.4 与 L2 runtime

- Policy Cache 的核心消费方
- Tool 调用前置校验 via Policy
- autonomy_level 决定 Runtime 的决策范围

### 11.5 修订纪律

- Gate 六段式的结构修改必须 ADR(影响 42001 对齐)
- Policy scope / priority 机制修改必须 ADR
- AIIA 字段结构修改必须 ADR(影响 42005 对齐)
- Control 对齐 42001 附录 A,编号严格不自造
- Nonconformity 流程修改必须 ADR(影响 9001 §10.1)

---

## 十二、总结

本文把治理域从"一节六域模型叙事 + 一个标准对齐摘要"展开到"可以实现"的程度。关键产出:

1. **六聚合根完整设计**(Gate / Policy / Control / AIIA / SoA / Nonconformity + Gate 内 Approval 实体)
2. **Gate 六段式**作为产品核心差异化的技术载体
3. **47 条不变量**(INV-1 到 INV-47)覆盖全部聚合
4. **ISO 42001 全套**(§4 到 §10 + 附录 A 38 控制项)在本域全面落地
5. **Policy 下发机制**与 L2 runtime / capability-hub 的完整链路
6. **AIIA / SoA 双身份**与 artifact 域的协作模式
7. **Nonconformity 全流程**(9001 §10.1 + 42001 §10.1)
8. **四个典型场景**(Gate / Policy / AIIA / Nonconformity)串联跨域协作
9. **7 个开放问题**涵盖扩展 / DSL / 自动化 / 多租户 / 阈值 / 管理评审 / 回滚

**关键承诺**:

- Gate **六段式完整性硬约束** —— 治理域核心差异化
- **autonomy_level 5 级** 实现 AI 与人类权责分清
- **shared_rules 不可覆盖**(Research 指令优先级)
- **SoA 必须覆盖 38 控制项**(42001 硬要求)
- **AIIA / SoA 双身份** 与 artifact 保持一致
- **Nonconformity 机制** 兜底合规与改进
- **管理评审周期性**(42001 §9.3)

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-1 | gate_id 永不复用 | §2.1.5 |
| INV-2 | Gate 前五段在 pending 后不可修改 | §2.1.5 |
| INV-3 | candidate_options 长度 [2, 10] | §2.1.5 |
| INV-4 | decided 必须有合法 resolution | §2.1.5 |
| INV-5 | autonomy_level=5 必须 policy_auto 授权 | §2.1.5 |
| INV-6 | audit_trail 只 append | §2.1.5 |
| INV-7 | user 决策必须 UserId | §2.1.5 |
| INV-8 | quorum 需 Approval 记录 | §2.1.5 |
| INV-9 | resolution 不可修改 | §2.1.5 |
| INV-10 | auto_approve 需 Policy 明示 | §2.1.5 |
| INV-11 | related refs 创建时校验存在 | §2.1.5 |
| INV-12 | impact-assessment Gate autonomy ≤ 3 | §2.1.5 |
| INV-13 | release/archive/dissolve 必 user 决策 | §2.1.5 |
| INV-14 | 必含 reject 选项 | §2.1.5 |
| INV-15 | expired/cancelled 不可再 decide | §2.1.5 |
| INV-16 | 同 gate + approver 不重复投票 | §2.2.2 |
| INV-17 | Approval vote 不可修改 | §2.2.2 |
| INV-18 | quorum 必须 required 全投 | §2.2.2 |
| INV-19 | is_shared_rules 必须 organization scope | §2.3.3 |
| INV-20 | 低 scope 不覆盖 shared_rules | §2.3.3 |
| INV-21 | 同 scope 冲突按 priority | §2.3.3 |
| INV-22 | Policy active 必经 Gate | §2.3.3 |
| INV-23 | superseded 必有 superseded_by | §2.3.3 |
| INV-24 | retired 单向 | §2.3.3 |
| INV-25 | rules 必过 schema 校验 | §2.3.3 |
| INV-26 | effective_until 不早于 from | §2.3.3 |
| INV-27 | control_id 遵循 42001 编号 | §2.4.3 |
| INV-28 | not-applicable 必须理由 | §2.4.3 |
| INV-29 | verified 必须有 evidence | §2.4.3 |
| INV-30 | review_overdue 30 天告警 | §2.4.3 |
| INV-31 | Control retired 单向 | §2.4.3 |
| INV-32 | aiia_id 永不复用 | §2.5.3 |
| INV-33 | approved 必有 gate + at | §2.5.3 |
| INV-34 | residual_risk=unacceptable 不可 approve | §2.5.3 |
| INV-35 | AIIA 覆盖 ≥ 1 年 | §2.5.3 |
| INV-36 | AIIA approved 同步 artifact | §2.5.3 |
| INV-37 | impact-assessment Artifact 必有 AIIA 镜像 | §2.5.3 |
| INV-38 | soa_id 永不复用 | §2.6.2 |
| INV-39 | SoA 必覆盖 38 控制项 | §2.6.2 |
| INV-40 | 每 excluded 必须理由 | §2.6.2 |
| INV-41 | SoA 变更必 Gate | §2.6.2 |
| INV-42 | SoA artifact 双身份一致 | §2.6.2 |
| INV-43 | critical 24h 内 investigating | §2.7.2 |
| INV-44 | resolved 必所有 actions 完成 | §2.7.2 |
| INV-45 | closed 必须 verified | §2.7.2 |
| INV-46 | control_violation 必关联 Control | §2.7.2 |
| INV-47 | critical Nonconf 触发 resolution Gate | §2.7.2 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | 六聚合根职责清晰(Gate 决策点 / Policy 规则 / Control 合规 / AIIA 评估 / SoA 声明 / Nonconformity 改进) |
| OCP | Gate kind 可扩展;Policy 规则 DSL 可扩展;Control 编号锁定 42001 |
| DIP | L2 runtime / capability-hub 通过事件订阅依赖本域 |
| DRY | AIIA / SoA 双身份不复制数据,共享一份事实 |
| KISS | Gate 六段式看似复杂,但是最小必要集 |
| YAGNI | 暂不做 "Gate 的 workflow 编排"(让 process 决定 Gate 的时机) |
| 不可变优先 | Gate resolution / Policy 历史 / Nonconformity 处置轨迹不可变 |
| 显式优于隐式 | 47 条不变量;autonomy_level 1-5 显式 |
| Fail Fast | 六段缺失立即拒;non-applicable 无理由拒;autonomy 违规拒 |
| 幂等性 | Outbox + 各聚合 version |

---

## 附录 C:订正标记

- [ ] §2.1.2 10 种用户 Gate kind + 8 种内部 Gate kind 的精确边界待 process 域定稿后复核
- [ ] §2.4 Control 对齐 42001 原文的精确 control_id 列表待 PDF 原文入库后复核(42001 §8.4 附录 A 38 项的官方编号)
- [ ] §2.5.2 AIIA 的 impact_dimensions 精确列表待 42005 原文入库后复核
- [ ] §6.3 Policy 下发的 subscribers ACK 协议具体实现待 L2 runtime / capability-hub README 定稿
- [ ] §Q2 Policy DSL 选型待独立 ADR 决策

---

> 本文是 Quantalithos A 方案段 2 的第六件文档。治理域的详细设计以本文为单一真相源。Quantalithos 对齐 ISO 42001 AIMS 的核心技术载体即此文所定义。
