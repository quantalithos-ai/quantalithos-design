# identity — 身份域详细设计

> **域定位**:身份域的详细设计文档。回答"员工是谁"。聚合根是 **GlobalMember** 和 **Role**;Capability 作为值对象嵌套使用。
>
> **上游依据**:
> - `product/最终目的.md` §3.2 员工是有身份的个体
> - `product/六域模型.md` §三 身份域(概念定义)
> - `architecture/仓库拆分方案.md` §4.1 `quantalithos-identity`
> - `architecture/标准对齐全景图.md` §一 `quantalithos-identity` 对齐
> - `architecture/ai-member设计.md` §六 双层 Member 模型
> - ADR-0003(Rust + PG + axum 技术栈)
> - ADR-0004(GlobalMember 在 identity,ProjectMember 在 work)
> - 14 标准中主对齐:**SPEM 2.0 + ISO 42001 + ISO 9001**;次对齐:CMMI / Scrum 三角色
>
> **本文不承载**:ProjectMember 的详细设计(在 `domain/work/README.md`)/ Role 的 Method Content 内容(在 `method-library` 仓)/ 容器编排(在 `member-service`)。

---

## 一、使命与边界

### 1.1 使命

**管理"有身份的 AI 员工"的持久档案**。

具体职责:
- GlobalMember 聚合根:员工档案的 CRUD + 生命周期状态机
- Role 聚合根:角色原型的注册 + 与 method-library 的索引同步
- Capability 值对象:能力画像的组装与校验
- career_history:员工的参与经历按 append-only 方式积累
- semantic_memory_ref:员工语义记忆的外部句柄(不存向量,只存引用)
- 身份事件的对外发布(供 work / member-service / conversation 等订阅)

### 1.2 边界(不做的事)

- **不持有 ProjectMember** —— 那是工作域的内部实体(ADR-0004)
- **不做容器编排** —— 那是 L2 member-service
- **不存 Role 的完整定义** —— 内容在 method-library(SPEM Method Content),本域只存**索引 + 生命周期元数据**
- **不存 Semantic Memory 向量** —— 只存外部句柄(URI)
- **不做能力评估** —— Capability 是声明性的,不做技能等级推断
- **不做对话 / 过程 / 治理** —— 那些各归其域

### 1.3 与其他域的协作边界

```
┌─────────────────────────────────────────────────────────┐
│  identity 域(本文)                                      │
│  GlobalMember + Role + Capability                        │
└─────────┬────────────────────┬──────────────────────────┘
          │ 发布事件           │
          ▼                    ▼
  ┌──────────────┐    ┌──────────────────────────────────┐
  │ work 域      │    │ L2 member-service                │
  │ 订阅 Member  │    │ 订阅 Role + Member 事件           │
  │ 事件 → 更新   │    │ 根据 role.image_variant 启容器    │
  │ ProjectMember│    │                                  │
  └──────────────┘    └──────────────────────────────────┘
          ▲
          │ 发布事件
          │
  ┌───────┴──────────────────────────────────────────────┐
  │ method-library(L3)                                    │
  │ 作为 Role 定义的权威源                                  │
  │ 本域只存 spec_source 引用                               │
  └──────────────────────────────────────────────────────┘
```

---

## 二、聚合根详细设计

### 2.1 GlobalMember 聚合根

#### 2.1.1 完整字段

```
GlobalMember {
    // 标识与展示(稳定)
    member_id:                 ULID,                 // 全局唯一,永不变,不复用
    name:                      String,               // 显示名,可变,允许重复
    avatar:                    Option<String>,       // URI,可变
    profile:                   String,               // 自由文本简介

    // 职业与能力(可变但严格控制)
    role_id:                   RoleId,               // 主职业,引用 Role 聚合根
    secondary_roles:           Vec<RoleId>,          // 兼任(可为空)
    capability_profile:        CapabilityProfile,    // 结构化能力画像(见 §2.3)

    // 记忆引用(不存内容)
    semantic_memory_ref:       MemoryRef,            // 外部向量库句柄
    episodic_memory_refs:      Vec<EpisodicMemoryRef>, // Per-ProjectMember 的 episodic 引用(见 Q1)

    // 生涯(append-only)
    career_history:            Vec<CareerEntry>,     // 参与过的项目 + 成就 + 教训

    // 生命周期
    hired_at:                  Timestamp,
    current_lifecycle:         LifecycleState,       // hired / active / paused / retired / tombstoned
    last_state_transition_at:  Timestamp,

    // 审计元数据
    created_by:                ActorRef,             // 招聘发起方(通常是 assistant-member 或用户)
    audit_log_ref:             AuditLogRef,          // 指向 observability 审计事件链
    version:                   u64,                  // 乐观锁版本号
}
```

#### 2.1.2 生命周期状态机

```
       [Role 存在 + 招聘请求]
              │
              ▼
     ┌─────────────┐
     │    hired    │  档案已建,尚未激活,不能接 ProjectMember
     └──────┬──────┘
            │ activate (经招聘 Gate 批准)
            ▼
     ┌─────────────┐
     │   active    │  可被分配到项目
     └──┬───────┬──┘
        │       │
[pause] │       │ [retire]
        │       │
        ▼       ▼
  ┌──────────┐ ┌─────────────┐
  │  paused  │ │   retired   │
  └──┬───────┘ └──────┬──────┘
     │ reactivate     │
     │                │ tombstone(通常 ≥ 12 个月)
     ▼                ▼
  回 active     ┌───────────────┐
                │  tombstoned   │ 档案进入冷存
                └───────────────┘
```

#### 2.1.3 不变量(硬约束,违反立即拒绝操作)

**INV-1** `member_id` 一旦分配永不复用(即使 tombstoned 后)
**INV-2** `tombstoned` 状态单向,不能通过任何操作复活
**INV-3** 同一 `role_id` 下允许多个 GlobalMember(像公司多个后端)
**INV-4** `career_history` 严格 append,不允许修改或删除历史条目
**INV-5** `role_id` 和 `secondary_roles` 指向的 Role **必须存在且非 retired**
**INV-6** 状态转移必须按状态机定义,越级转移立即拒绝(例如 hired → retired 非法,必须 hired → active → retired)
**INV-7** `hired` 状态的 GlobalMember 不能出现在任何 ProjectMember.global_member_id 引用中
**INV-8** `retired` 后,已有 ProjectMember 的 lifecycle 最晚在 24 小时内被动同步为 retired_from_project(work 域订阅事件后执行)
**INV-9** `tombstoned` 的 GlobalMember,其 `semantic_memory_ref` 必须已迁移到冷存(由 archive 域协作)
**INV-10** `capability_profile` 的修改必须带 Capability 的证据引用(见 §2.3.3)

#### 2.1.4 操作契约(对外 RPC 视角)

| 操作 | 前置 | 后置 | 发布事件 |
|---|---|---|---|
| `hire(name, role_id, profile, ...)` | Role 存在且非 retired | 创建 GlobalMember,state=hired | `identity.member.hired` |
| `activate(member_id)` | state=hired or paused,有有效招聘 Gate 决策 | state=active | `identity.member.activated` |
| `pause(member_id, reason)` | state=active | state=paused | `identity.member.paused` |
| `retire(member_id, reason)` | state ∈ {active, paused} | state=retired | `identity.member.retired` |
| `tombstone(member_id)` | state=retired, 已过 12 个月 | state=tombstoned, semantic_memory 迁冷 | `identity.member.tombstoned` |
| `update_profile(member_id, ...)` | state ≠ tombstoned | name/avatar/profile 更新 | `identity.member.profile_updated` |
| `change_role(member_id, new_role_id)` | state ∈ {active, paused},new_role 存在 | role_id 更新;触发相关容器重启 | `identity.member.role_changed` |
| `update_capabilities(member_id, delta, evidence)` | state ∈ {active, paused} | capability_profile 更新,evidence 存 observability | `identity.member.capability_updated` |
| `append_career_entry(member_id, entry)` | state ≠ tombstoned | career_history append | `identity.member.career_entry_added` |

#### 2.1.5 CareerEntry 结构

```
CareerEntry {
    entry_id:         ULID,
    project_id:       ProjectId,                 // 参与的项目
    project_member_id: ProjectMemberId,          // 对应的 ProjectMember
    role_in_project:  RoleId,                    // 该项目中扮演的角色
    status:           CareerEntryStatus,         // in_progress / completed / abandoned
    joined_at:        Timestamp,
    left_at:          Option<Timestamp>,
    achievements:     Vec<ArtifactRef>,          // 产出的关键 Artifact
    lessons_learned:  Vec<LessonRef>,            // 经验教训(指向 artifact.kind=lessons-learned)
    feedback_refs:    Vec<FeedbackRef>,          // 评价(来自其他 Member / 用户)
    trace_id:         TraceId,                   // 整条生涯条目的 trace
}
```

**状态转移**:`in_progress → completed` 或 `in_progress → abandoned`,不可逆。状态转移由 work 域事件驱动(`work.project.archived` / `work.project.member_retired_from_project`)。

### 2.2 Role 聚合根

#### 2.2.1 完整字段

```
Role {
    role_id:                  String,           // kebab-case,如 "backend-dev"
    display_name:             String,           // 展示名,如 "Backend Developer"
    short_description:        String,           // 一句话描述
    lifecycle:                RoleLifecycle,    // defined / published / deprecated / retired

    // 能力与工具
    required_capabilities:    Vec<CapabilityRef>,   // 必须能力
    default_capabilities:     Vec<CapabilityRef>,   // 默认能力(可在 ProjectMember 扩展)
    default_tool_scope:       Vec<ToolRef>,         // 默认工具集
    policy_defaults:          PolicyDefaults,       // 默认策略(可在 ProjectMember override)

    // 运行时
    image_variant:             String,           // 镜像后缀,如 "backend-dev" → ai-member-backend-dev
    supported_image_versions:  VersionRange,     // 兼容的镜像版本范围

    // 方法内容引用
    spec_source:               MethodContentRef, // 指向 method-library 的 SPEM Method Content

    // 版本
    version:                   Semver,           // Role 定义版本
    previous_versions:         Vec<Semver>,      // 兼容的老版本

    // 审计
    published_at:              Timestamp,
    published_by:              ActorRef,
    retired_at:                Option<Timestamp>,
    audit_log_ref:             AuditLogRef,
}
```

#### 2.2.2 生命周期

```
[定义] → defined → publish → published → deprecate → deprecated → retire → retired
         (草稿)   (Gate)    (可用)     (不建议新用)           (不再可用)
```

#### 2.2.3 不变量

**INV-11** `role_id` 一旦发布永不复用
**INV-12** `retired` 状态单向
**INV-13** 有任何 GlobalMember 引用该 Role 时,不允许 retire
**INV-14** `spec_source` 必须指向 method-library 里已发布的 Method Content(版本对应)
**INV-15** `required_capabilities` 必须是 `default_capabilities` 的子集
**INV-16(ADR-0009)** Role 本身不承载"视图策略" —— "某 Role 看某对象时看到什么字段"由 method-library 的 ViewProfile 定义,本域只负责 Role 标识;UI 仓按 (role_id, object_kind) 向 method-library 查 ViewProfile
**INV-17(ADR-0008 镜像)** `spec_source` 指向的 RoleDefinition 中如含 `performing_tasks → TaskDefinition → ActivityDef`,其 `completion_policy` 语义由 method-library / process 域共同保证,本域不复算

#### 2.2.4 初始 Role 集合(9 个)

与 ADR-0005 对齐,初始镜像集合:

```
assistant        → ai-member-assistant
tech-lead        → ai-member-tech-lead
backend-dev      → ai-member-backend-dev
frontend-dev     → ai-member-frontend-dev
qa               → ai-member-qa
ux               → ai-member-ux
devops           → ai-member-devops
auditor          → ai-member-auditor
observer         → ai-member-observer
```

**Role 扩充**不走 API 随意创建,必须经过 Gate(新 Role 引入 Gate,kind=role-introduction)—— 见 `产品遵循规范清单.md` AM5。

### 2.3 Capability 值对象

#### 2.3.1 结构

```
Capability {
    capability_id:     String,          // 如 "python-3.12" / "code-review" / "figma-export"
    kind:              CapabilityKind,  // language / skill / certification / tool-family
    level:             CapabilityLevel, // 1-5 mastery 级别
    evidence_required: bool,            // 是否需要证据
    evidence_refs:     Vec<ArtifactRef>, // 证据(如认证 / 推荐信 / 过往项目)
}

CapabilityProfile {
    capabilities:      Vec<Capability>,
    profile_summary:   String,          // LLM 可读的能力摘要(便于 Runtime 装 prompt)
    last_updated_at:   Timestamp,
    last_updated_by:   ActorRef,
}
```

#### 2.3.2 Capability 的来源

- 由 method-library 定义的标准 Capability 集合(SPEM CapabilityDefinition)
- GlobalMember 声明自己具备的 Capability(受 Role 的 required / default 约束)
- Capability 可随员工成长变更,但必须带证据

#### 2.3.3 证据要求

- **level >= 3** 的 Capability 必须有 evidence_refs
- evidence Artifact 必须是 approved 状态
- Capability 下降(降级)不需要证据,但发降级事件便于审计

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.identity.v1;

import "quantalithos/common/v1/ids.proto";
import "quantalithos/common/v1/audit.proto";

service IdentityService {
    // === GlobalMember 管理 ===
    rpc HireMember(HireMemberRequest) returns (HireMemberResponse);
    rpc ActivateMember(ActivateMemberRequest) returns (ActivateMemberResponse);
    rpc PauseMember(PauseMemberRequest) returns (PauseMemberResponse);
    rpc RetireMember(RetireMemberRequest) returns (RetireMemberResponse);
    rpc TombstoneMember(TombstoneMemberRequest) returns (TombstoneMemberResponse);

    rpc UpdateProfile(UpdateProfileRequest) returns (UpdateProfileResponse);
    rpc ChangeRole(ChangeRoleRequest) returns (ChangeRoleResponse);
    rpc UpdateCapabilities(UpdateCapabilitiesRequest) returns (UpdateCapabilitiesResponse);
    rpc AppendCareerEntry(AppendCareerEntryRequest) returns (AppendCareerEntryResponse);

    rpc GetMember(GetMemberRequest) returns (GlobalMember);
    rpc ListMembers(ListMembersRequest) returns (ListMembersResponse);
    rpc QueryMembers(QueryMembersRequest) returns (QueryMembersResponse);

    // === Role 管理 ===
    rpc DefineRole(DefineRoleRequest) returns (DefineRoleResponse);
    rpc PublishRole(PublishRoleRequest) returns (PublishRoleResponse);
    rpc DeprecateRole(DeprecateRoleRequest) returns (DeprecateRoleResponse);
    rpc RetireRole(RetireRoleRequest) returns (RetireRoleResponse);

    rpc GetRole(GetRoleRequest) returns (Role);
    rpc ListRoles(ListRolesRequest) returns (ListRolesResponse);

    // === Capability 查询 ===
    rpc GetCapability(GetCapabilityRequest) returns (Capability);
    rpc ListCapabilities(ListCapabilitiesRequest) returns (ListCapabilitiesResponse);

    // === 记忆引用管理(不存内容) ===
    rpc UpdateSemanticMemoryRef(UpdateSemanticMemoryRefRequest)
        returns (UpdateSemanticMemoryRefResponse);
    rpc RegisterEpisodicMemoryRef(RegisterEpisodicMemoryRefRequest)
        returns (RegisterEpisodicMemoryRefResponse);
    rpc ListEpisodicMemoryRefs(ListEpisodicMemoryRefsRequest)
        returns (ListEpisodicMemoryRefsResponse);

    // === 内部接口(只被 L2 member-service 调用)===
    rpc ResolveMemberForContainer(ResolveMemberRequest)
        returns (ResolveMemberResponse);
}
```

### 3.2 关键请求/响应示意

**HireMemberRequest**:

```proto
message HireMemberRequest {
    string name = 1;
    string role_id = 2;                       // 引用 Role.role_id
    string profile = 3;
    optional string avatar = 4;
    repeated Capability initial_capabilities = 5;
    optional string created_by = 6;           // Actor(默认 assistant-member-id)
    audit.ActorContext actor = 7;             // 调用上下文 + trace_id
}

message HireMemberResponse {
    string member_id = 1;
    LifecycleState state = 2;                 // 预期 hired
    google.protobuf.Timestamp hired_at = 3;
}
```

**ResolveMemberForContainer**(仅供 member-service 调用,附带服务间 mTLS):

```proto
message ResolveMemberRequest {
    string global_member_id = 1;
    string project_id = 2;                    // 用于查对应 ProjectMember 的 episodic_memory
    audit.ActorContext actor = 3;             // member-service 身份
}

message ResolveMemberResponse {
    Role role = 1;                            // 完整 Role(含 image_variant + tool_scope)
    CapabilityProfile capability_profile = 2;
    MemoryRef semantic_memory_ref = 3;
    optional EpisodicMemoryRef episodic_memory_ref = 4;  // 该 ProjectMember 的 episodic slot
    LifecycleState lifecycle = 5;
}
```

### 3.3 认证与授权

- **内部服务间**:mTLS + 服务身份白名单(member-service / work / governance / console / archive)
- **外部(Chat / SDK)**:OAuth2 + Role 级 RBAC
- **只读查询**(GetMember / ListMembers / QueryMembers)允许 project 内 ProjectMember 自查;其他 Member 的档案根据 Policy 控制
- **招聘 / Retire 等写操作** 必须经 Gate(governance.Gate.kind=member-lifecycle)

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Query 类 RPC **不接受 Role 参数,不按 Role 过滤字段**,返回已鉴权对象的全量字段。按 Role 的字段可见性、脱敏(如 career_history 的敏感项目)、派生字段(如 tenure_label)由 UI 仓消费 method-library 的 ViewProfile 完成。actor 仅用于鉴权和审计留痕。

### 3.4 命名约定与错误处理

- proto 字段名 snake_case;消息名 PascalCase;服务名以 `Service` 结尾
- 错误码用 `quantalithos/common/v1/errors.proto` 的 ErrorCode enum
- 典型错误:`MEMBER_NOT_FOUND` / `ROLE_NOT_FOUND` / `INVALID_STATE_TRANSITION` / `MISSING_EVIDENCE` / `VERSION_CONFLICT`(乐观锁冲突)/ `REQUIRED_CAPABILITIES_NOT_MET`

---

## 四、事件 schema 细节

### 4.1 事件命名与 CloudEvents 包络

所有事件遵循 `六域模型.md` §2.2 规则:
- 命名 `identity.<aggregate>.<verb>` 过去式
- CloudEvents 1.0 包络
- 必带 `traceparent` (W3C TC) + `actor` + `subject`

### 4.2 事件清单 + 字段细节

#### MemberHired

```
type:         identity.member.hired
subject:      member_id(ULID)
source:       service:quantalithos-identity
traceparent:  00-<trace>-<span>-01
actor:        { actor_id, actor_kind: member | user | system }
data: {
    member_id,
    name,
    role_id,
    profile_summary,            // 前 200 字符的 profile,用于 Chat 展示
    capabilities_count,         // 初始能力数量
    hired_by,                   // 招聘发起方(通常 assistant-member 或 user)
    related_gate_id,            // 招聘 Gate 决策引用
}
```

#### MemberActivated / MemberPaused / MemberRetired / MemberTombstoned

```
subject:      member_id
data: {
    member_id,
    previous_state,
    new_state,
    reason,                     // 文本理由
    related_gate_id,            // 若经 Gate 批准,引用 Gate
    triggered_by,
}
```

#### MemberRoleChanged

```
subject:      member_id
data: {
    member_id,
    previous_role_id,
    new_role_id,
    previous_image_variant,
    new_image_variant,          // 供 member-service 判断是否需要重启容器
    reason,
    related_gate_id,
    affects_project_members:    [project_member_id, ...]    // 将受影响的 ProjectMember 清单
}
```

**member-service 订阅该事件**:如果 new_image_variant != previous,对所有相关 ProjectMember 触发容器重启(graceful → 重新拉新镜像 → 从 checkpoint 恢复)。

#### MemberProfileUpdated

```
subject:      member_id
data: {
    member_id,
    updated_fields:     [name | avatar | profile]
    previous_values:    map<field, value>
    new_values:         map<field, value>
    updated_by,
}
```

**幂等 key**:`member_id + version`(版本号递增)

#### MemberCapabilityUpdated

```
subject:      member_id
data: {
    member_id,
    added:      [Capability],
    removed:    [CapabilityRef],
    updated:    [(CapabilityRef, previous_level, new_level)],
    evidence_refs: [ArtifactRef],
    updated_by,
}
```

#### MemberCareerEntryAdded

```
subject:      member_id
data: {
    entry_id,
    member_id,
    project_id,
    project_member_id,
    role_in_project,
    joined_at,
    trace_id,
}
```

#### RoleDefined / RolePublished / RoleDeprecated / RoleRetired

```
subject:      role_id
data: {
    role_id,
    display_name,
    version,
    previous_lifecycle,
    new_lifecycle,
    image_variant,              // published 时必填
    spec_source,                // method-library 引用
    triggered_by,
}
```

### 4.3 审计事件(特殊族)

除业务事件外,还发审计事件(严重性高):

```
identity.audit.suspicious_operation
identity.audit.invariant_violation_attempted
identity.audit.rate_limit_triggered
identity.audit.unauthorized_access_attempt
```

这些事件**不可被过滤**,observability 必须接收并进审计链(对齐三红线 1)。

### 4.4 订阅事件(来自其他域)

identity 域主要**发布事件**,少量**订阅**用于生涯条目联动:

| 订阅事件 | 来源域 | 本域动作 |
|---|---|---|
| `work.project.member_assigned` | work | 在 GlobalMember.career_history 添加 in_progress 条目 |
| `work.project.archived` | work | 相关 career entry status → completed |
| `work.project.member_retired_from_project` | work | 相关 career entry status 设为 completed(若正常)或 abandoned(若异常) |
| `governance.gate.decided(kind=member-lifecycle)` | governance | 若批准,执行对应 lifecycle 转移(activate / retire / tombstone) |
| `artifact.approved(kind=feedback)` | artifact | 若 feedback 指向本 Member,append 到 career entry 的 feedback_refs |
| `archive.memory_migrated_to_cold` | archive | 更新 semantic_memory_ref 到新冷存位置 |

### 4.5 事件消费的幂等保证

所有订阅方(尤其 work / member-service)必须支持**重复投递**。关键做法:

- 消费方持久化最近 10000 个 event_id 的 LRU
- 对状态转移类事件,按 `subject + event_id` 去重
- 对非幂等的 side-effect,必须能通过 version 字段识别是"重放"还是"新事件"

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+(与 ADR-0003 对齐)

**理由**:
- 强一致性需求(员工档案不允许半写)
- 聚合根事务性要求强
- 已有事件表 + 文档表的成熟模式
- 支持 JSONB 存可变结构(capability_profile 等)
- PG 的 advisory lock 支持跨进程协调

**次存储**:
- **对象存储 / S3**:semantic_memory 向量数据的实际载体(本域只存 URI)
- **向量库**(Qdrant 或 pgvector):semantic_memory 的向量索引

### 5.2 表结构(核心)

#### table: `global_members`

| 列 | 类型 | 约束 |
|---|---|---|
| member_id | ULID (PK) | not null, unique |
| name | varchar(256) | not null |
| avatar | text | nullable |
| profile | text | not null, default '' |
| role_id | varchar(128) | not null, FK → roles.role_id |
| secondary_roles | jsonb | default '[]' |
| capability_profile | jsonb | not null |
| semantic_memory_ref | jsonb | not null |
| current_lifecycle | enum | not null |
| hired_at | timestamptz | not null |
| last_state_transition_at | timestamptz | not null |
| created_by | varchar(128) | not null |
| version | bigint | not null, default 1 |
| deleted_at | timestamptz | nullable(仅 tombstone 后标记,不物理删) |

**索引**:
- `idx_global_members_lifecycle` on (current_lifecycle)
- `idx_global_members_role` on (role_id)
- `idx_global_members_name_trgm` on (name gin_trgm_ops) -- 支持模糊搜索

#### table: `career_entries`

| 列 | 类型 | 约束 |
|---|---|---|
| entry_id | ULID (PK) | |
| member_id | ULID | not null, FK → global_members |
| project_id | ULID | not null |
| project_member_id | ULID | not null |
| role_in_project | varchar(128) | not null |
| status | enum | not null |
| joined_at | timestamptz | not null |
| left_at | timestamptz | nullable |
| achievements | jsonb | default '[]' |
| lessons_learned | jsonb | default '[]' |
| feedback_refs | jsonb | default '[]' |
| trace_id | varchar(64) | not null |

**索引**:
- `idx_career_member_project` on (member_id, project_id) unique
- `idx_career_status` on (status)

#### table: `roles`

| 列 | 类型 | 约束 |
|---|---|---|
| role_id | varchar(128) (PK) | unique, kebab-case |
| display_name | varchar(256) | not null |
| short_description | text | |
| lifecycle | enum | not null |
| required_capabilities | jsonb | not null |
| default_capabilities | jsonb | not null |
| default_tool_scope | jsonb | not null |
| policy_defaults | jsonb | not null |
| image_variant | varchar(128) | not null |
| supported_image_versions | varchar(64) | not null |
| spec_source | jsonb | not null |
| version | varchar(32) | not null |
| published_at | timestamptz | nullable |
| retired_at | timestamptz | nullable |

#### table: `identity_events_outbox`

用于 **Outbox 模式**(`架构设计.md` §4.4):

| 列 | 类型 | 约束 |
|---|---|---|
| event_id | ULID (PK) | |
| event_type | varchar(64) | not null(如 `identity.member.hired`) |
| subject | varchar(64) | not null |
| payload | jsonb | not null(CloudEvents 完整包络) |
| trace_id | varchar(64) | not null |
| created_at | timestamptz | not null |
| published_at | timestamptz | nullable |
| published_attempts | int | default 0 |

事件发布流程:业务事务写 outbox → 异步 worker 读 outbox → 发到 bus → 标记 published_at。

### 5.3 一致性策略

- **聚合根内**强一致(单次 RPC 事务完成)
- **Outbox 最终一致**(事件发布可能延迟秒级)
- **跨聚合**通过事件编织(`identity + work` 通过事件同步 career entry)
- **乐观锁**:GlobalMember.version 每次写 +1,并发更新冲突拒绝

### 5.4 迁移策略(本域内 schema 变更)

- schema 变更走 Rust migration 工具(sqlx-cli / refinery)
- **向前兼容**:新字段 nullable + default
- **向后兼容**:字段重命名走"双写 + 双读"两步迁移
- breaking 的 schema 变更必须走 ADR

### 5.5 备份与灾备

- PG 每日全量 + 增量 wal-g
- Semantic memory 对象存储本身有冗余 + 版本化(S3 versioning)
- 跨区域备份由 L4 archive 仓协调(项目归档 + 员工档案归档)

---

## 六、与其他域的事件订阅链路

### 6.1 本域发布、其他域订阅的事件流

```
identity 发布
    │
    ├──→ work            订阅 Member Hired / Activated / Paused / Retired
    │                    用于同步 ProjectMember 的 lifecycle
    │
    ├──→ member-service  订阅 Member * + Role RoleDefined / Published / Retired
    │                    用于容器启停编排 + 镜像选择
    │
    ├──→ conversation    订阅 Member Activated / Paused / Retired
    │                    用于更新 Conversation.participants
    │
    ├──→ governance      订阅 Member RoleChanged / CapabilityUpdated
    │                    可能触发 Policy 重评
    │
    ├──→ archive         订阅 Member Tombstoned
    │                    用于 semantic_memory 冷存归档
    │
    └──→ observability   订阅 Member * + 审计事件(全量)
```

### 6.2 本域订阅的事件流

```
work          → identity(career entry 同步)
governance    → identity(member-lifecycle Gate 决策驱动状态转移)
artifact      → identity(feedback Artifact 挂到 career entry)
archive       → identity(memory 冷存完成后更新 ref)
```

### 6.3 关键跨域协作场景

#### 场景 A:员工招聘 → 首个项目 → 归档

```
时刻 T0: 用户说"再招一个后端工程师"
  Assistant 提议 → 创建 Gate(kind=member-hiring, autonomy=approver)
  [governance.gate.raised]
  [governance.gate.decided(approve)]
    │
    ▼
时刻 T1: identity.HireMember(name="Zhao", role="backend-dev")
  [identity.member.hired] (state=hired)
    │
    ▼
时刻 T2: identity.ActivateMember(member_id=Zhao)
  [identity.member.activated] (state=active)
    │
    ▼
时刻 T3: 用户立项 + 分配 Zhao
  [work.project.member_assigned(global_member_id=Zhao, project=P1)]
    │
    │ identity 订阅
    ▼
时刻 T4: identity.AppendCareerEntry(member=Zhao, entry=...)
  [identity.member.career_entry_added(status=in_progress)]
    │
    ▼
时刻 T5: member-service 订阅 member_assigned
         查 identity.ResolveMemberForContainer
         返回 Role + Capability + Memory ref
         启动容器
    │
    ▼
(项目运行 …… 省略)
    │
    ▼
时刻 TN: work.project.archived
    │
    │ identity 订阅
    ▼
时刻 TN+1: career entry status → completed
  [identity.member.career_entry_added(status=completed)]  (其实是 updated,这里简化)
```

#### 场景 B:Role 升级导致容器重启

```
Role.backend-dev v1.2.0 → v1.3.0(image_variant 不变,tool_scope 扩展)
  [identity.role.updated(v1.3.0)]
    │
    ▼
member-service 订阅
  检查该 Role 下所有活跃 ProjectMember
  按 Policy 滚动重启容器(一次重启一批,保业务连续)
    │
    ▼
[member.offline_requested] x N → [member.offline] x N
[member.online(image=v1.3.0)] x N
```

#### 场景 C:员工 Retire → career entry 收尾

```
identity.RetireMember(member_id=Zhao, reason="long paused")
  [identity.member.retired]
    │
    ├──→ member-service:对所有 Zhao 的活跃容器触发 GracefulShutdown
    │
    ├──→ work:将所有 (Zhao, project) 对应的 ProjectMember 设 retired_from_project
    │    [work.project.member_retired_from_project] x N
    │    │ identity 订阅
    │    ▼
    │    更新对应 career entry.status → completed / abandoned
    │    [identity.member.career_entry_added(updated)]
    │
    ├──→ conversation:把 Zhao 从所有 Conversation.participants 中移除(Turn 历史保留)
    │
    └──→ observability:记录完整审计链
```

---

## 七、性能与可用性目标

### 7.1 业务指标(25010 Reliability 对齐)

| 指标 | 目标 | 度量方式 |
|---|---|---|
| Availability | ≥ 99.9%(30d 滚动) | uptime / total |
| P95 RPC latency(读) | < 50ms | prometheus histogram |
| P95 RPC latency(写) | < 200ms | 同上 |
| 事件发布延迟(Outbox → Bus) | P95 < 5s | created → published 差 |
| MTTR(故障恢复) | < 10 分钟 | 人工 + 告警 + runbook |

### 7.2 容量假设(段 2 设计阶段估算)

假设中等规模 SaaS 部署:

- 10 万个 GlobalMember(多租户累计)
- 每 Member 平均 5 个 career entry → 50 万 entry
- 每月 1000 个 Member 事件写入(招聘 / 激活 / 退休)
- QPS 峰值:读 1000 / 秒,写 50 / 秒

**对 PG**:单节点足够;切分按 tenant_id hash(当引入多租户时)。

### 7.3 降级策略

- **semantic_memory 不可用**:GlobalMember 仍可读,只是无法进 Runtime(member-service 拒绝启容器并发 crashed 事件)
- **method-library 不可达**:Role 的 `spec_source` resolve 失败,identity 用本地缓存返回(显式标记 stale)
- **observability 不可用**:事件仍进 outbox,不阻塞业务写入;outbox 积压有告警

### 7.4 监控关键点

- GlobalMember 活跃数量(按 lifecycle 分)
- Role 使用率(哪些 Role 被高频实例化)
- Outbox 积压深度
- 招聘 → 激活转化时间(从 Hired 到 Activated 的平均时长)
- 状态转移失败率(按状态 pair 分)

---

## 八、安全与合规对齐

### 8.1 ISO 42001 控制项覆盖

| 控制族 | 控制项 | 本域落地 |
|---|---|---|
| A.3 Internal Organization | AI Actor Roles | GlobalMember 即 AI Actor 的持久化载体 |
| A.4 Resources for AI | Human Resources | Capability 能力要求 |
| A.4 | AI System Documentation | Role 的 spec_source 指向 Method Content |
| A.5 Assessing Impacts | AI Impact Assessment | Member 作为 AI Actor 列入 AIIA |
| A.6 AI Life Cycle | AI System Requirements | Role 定义即能力要求 |
| A.6 | Operation & Monitoring | Member 活跃监控 |
| A.6 | Retirement | retire / tombstone 两级状态对齐 42001 退役 |
| A.9 Responsible Use | Objectives for Responsible Use | 招聘 / Retire 必经 Gate |

### 8.2 ISO 9001 对齐

- § 7.1 Resources — Member 是人力资源的 AI 等价物
- § 7.2 Competence — Capability 就是胜任力记录
- § 7.5 Documented Information — GlobalMember + CareerEntry 都是记录型
- § 10.2 持续改进 — lessons_learned 字段归档

### 8.3 ISO 27001 对齐

- 身份信息属于 PII(名字 / 画像 / 过往项目)
- 必须加密(at-rest + in-transit)
- 细粒度 RBAC(谁能看谁的档案)
- 审计日志覆盖所有身份查询(特别是跨组织查询)

### 8.4 三红线对齐

- **可审计性**:所有状态转移 + 字段修改都发事件,append 到 audit chain
- **可追溯性**:trace_id 贯穿;career entry 链条完整
- **可裁剪性**:Role 定义在 method-library(可改);Capability 可扩展;policy_defaults 可 override

### 8.5 隐私与退役

- tombstoned 后的 GlobalMember:
  - name / avatar / profile **匿名化**(替换为 tombstone 占位)
  - career_history 保留(审计需要)
  - capability_profile 保留(模式复用)
  - audit_log_ref 保留(合规需要)
  - semantic_memory 进冷存(archive 仓协调)
- tombstoned 的物理删除仅在监管要求或被 Gate 明确决策时发生,走额外的 `hard_delete_member` 流程(留墓碑记录)

---

## 九、测试策略

### 9.1 测试金字塔

```
               ┌─────────────┐
               │    E2E      │  少量(跨服务集成,含 bus)
               └─────────────┘
           ┌─────────────────┐
           │   Integration   │  中等(DB + Outbox + 事件发布)
           └─────────────────┘
       ┌─────────────────────┐
       │     Unit Tests      │  大量(聚合根 + 状态机 + 不变量)
       └─────────────────────┘
```

### 9.2 单元测试重点

- **状态机**:所有合法转移 + 所有非法转移(逐个验证拒绝)
- **不变量**:每条 INV-1 到 INV-15 有对应拒绝测试
- **Capability 校验**:level >= 3 必须 evidence 的边界
- **Role 引用约束**:INV-5 / INV-13 的逆路径
- 覆盖率目标:**关键聚合 ≥ 90%,整体 ≥ 70%**(子项目清单 R5)

### 9.3 集成测试重点

- Outbox 事件发布的幂等性
- PG advisory lock 的并发正确性
- 乐观锁冲突的回退
- 跨事件的一致性(hire → activate → 断电 → 恢复)

### 9.4 E2E 测试场景

- 完整招聘链路(Gate → Hire → Activate → Assign → Container 启动)
- 员工 retire 链路(Retire → 所有 ProjectMember 同步 → 容器下线 → career entries 完结)
- Role 升级导致容器重启的滚动策略
- 多 ProjectMember 并发写 GlobalMember 的乐观锁冲突处理

### 9.5 性能测试

- 1000 QPS 读 / 50 QPS 写 的 P95 延迟
- Outbox 积压恢复(假设 bus 中断 10 分钟)
- career_entries 累计到 100 万时的查询延迟

### 9.6 安全测试

- RBAC 绕过尝试
- PII 脱敏效果验证
- tombstoned 档案的匿名化完整性
- 审计事件不可篡改(append-only + hash chain)

---

## 十、开放问题与未决定

### Q1. Episodic Memory 的持久化归属(本域 vs 独立)

**背景**:`ai-member设计.md` §4.4 把 Episodic Memory 的 ref 挂在 GlobalMember 上,每个 ProjectMember 一个 slot。此方案倾向 C(identity 扩展),但不确定长期是否适合。

**候选**:
- **A** 新增 L1 第 7 域 `memory`,独立聚合根 MemorySlot
- **B** 由 observability 承载(Memory 事件化 + 快照)
- **C** identity 扩展(当前倾向)
- **D** L3 新增 memory-store 仓(横切能力)

**本文立场**:采用 **C**,但**将 episodic_memory_refs 单独抽为 vector 字段**(而非嵌入 capability_profile),方便未来迁移到 A。

**推进**:本文定稿同时提交 **ADR-0006 Memory 持久化归属**,明示 C 的短期选择 + 长期演进路径。

### Q2. Role 版本升级的影响扩散策略

**背景**:Role 从 v1.2 升到 v1.3(image_variant 不变,tool_scope 扩展)时,所有活跃 ProjectMember 是否必须同步升级?

**候选**:
- **A** 强制滚动升级(所有 ProjectMember 必须同步新版)
- **B** 自愿升级(保留旧版 ProjectMember 直到下次 Activity 或人工触发)
- **C** 混合(minor 升级可选,major 升级强制)

**倾向**:C,但具体版本分界线需要原型后调。

**推进**:留到段 3 原型阶段决策,届时走独立 ADR。

### Q3. tombstone 的延迟期(12 个月是否合理)

**背景**:INV 设 retired → tombstoned 至少 12 个月。12 个月是否足够?

**候选**:
- **A** 固定 12 个月
- **B** 按用户租户的合规要求可配置(3 / 6 / 12 / 24 / 60 个月)
- **C** 永远保留,直到手动 tombstone

**倾向**:B(合规友好)

**推进**:原型阶段 + 合规讨论后定;可能由 governance Policy 下发。

### Q4. Capability 的标准化程度

**背景**:Capability.capability_id 是自由文本?还是从 method-library 的标准集选?

**候选**:
- **A** 严格标准集(只能从 method-library 选,不允许自定义)
- **B** 混合(标准集 + 项目 / 组织级自定义扩展)
- **C** 完全自由

**倾向**:B(和 method-library 的方法资产机制对齐)

**推进**:定义 Capability Schema 时一起决策,走独立 ADR。

### Q5. 同一 name 的唯一性处理

**背景**:按设计允许多个 GlobalMember 同名(INV-3)。UI 展示时如何区分?

**候选**:
- **A** Chat / Console UI 在同名情况下自动附加 member_id 后缀或头像颜色
- **B** 招聘流程提示"已存在同名,是否改名"
- **C** 强制名字唯一(违反 INV-3)

**倾向**:A(接受同名,UI 层处理)

**推进**:UX 设计阶段决策,不走 ADR。

### Q6. Assistant Role 的特殊性

**背景**:每个用户开通时默认招聘一个 Assistant。这是 identity 域的"内置招聘"还是走正常 HireMember?

**候选**:
- **A** Assistant 由系统自动招聘(不走 Gate)
- **B** Assistant 走正常 HireMember(含 Gate),但默认自动批准
- **C** Assistant 作为特殊 Member,lifecycle 与用户账号绑定(非独立生命周期)

**倾向**:B(保持流程一致)

**推进**:Console 设计阶段决策,可能走 ADR。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-identity` 仓 README(段 3)

段 3 每仓 README 是本文的**代码组织视图**:

```
domain/identity/README.md(本文)       ↔    quantalithos-identity 仓(段 3)
───────────────────────────               ─────────────────────────────
§二 聚合根                                 src/domain/       Rust 聚合根代码
§三 RPC 接口                              proto/            proto 文件 + 生成 binding
§四 事件                                  src/events/       事件发布代码
§五 持久化                                migrations/       PG migration
§六 跨域协作                              src/subscriptions/ 事件订阅代码
§七 性能                                  benchmarks/       性能测试
§八 安全                                  src/auth/         认证授权
§九 测试                                  tests/            各层测试
```

### 11.2 本文与 `domain/work/README.md`

两者通过 **双层 Member 模型**紧密联动:

- 本文定义 GlobalMember 聚合根 + career entry
- `domain/work/README.md` 定义 ProjectMember 聚合内实体
- 两者通过事件同步(`work.project.member_assigned` ↔ `identity.member.career_entry_added`)

**写 work/ README 时**必须引用本文的 Member 事件清单和不变量。

### 11.3 本文与 ADR

- **ADR-0003** 技术栈 → 本文 §五.1 PG + Rust 落地
- **ADR-0004** 双层 Member → 本文 §一.2 边界(不持有 ProjectMember)
- **ADR-0006**(本文定稿同提) Memory 归属 → 本文 §十.Q1
- **ADR-0009** ViewProfile 归 method-library → 本文 §2.2.3 INV-16:Role 不承载视图策略;§3.3 RPC 不按 Role 过滤字段
- **ADR-0008** Activity.completion_policy → 本文 §2.2.3 INV-17:Role 引用 TaskDefinition 时,ActivityDef.completion_policy 语义不在本域复算

### 11.4 与 `domain/method-library/README.md`

- Role 的**完整定义**(responsibilities / image_variant / required_capabilities / default_tool_scope 等)在 method-library 的 RoleDefinition
- 本域的 Role 聚合只持有**索引**(role_id / spec_source / version / 生命周期状态)和运行时需要的冗余字段
- 同步路径:`method_library.role_definition.published` / `capabilities_changed` → 本域 Role 索引刷新
- fingerprint 保护:本域 Role 的 spec_source 带 fingerprint 快照,与 method-library 当前值不一致时发 `identity.role.source_drift`
- ViewProfile 匹配:UI 仓按 `(当前 user 的 Role.role_id, 对象 kind)` 向 method-library 的 ResolveViewProfile RPC 查询,本域不参与

### 11.4 修订纪律

- **聚合根字段 / 不变量 / 状态机** 修改必须 ADR
- **事件清单 breaking 变更** 必须 ADR + 订阅方协调
- **RPC 接口 breaking** 走 proto 版本策略(semver + 至少 2 个 minor 过渡)
- **持久化 schema 变更** 走 migration 流程(non-breaking 可直接,breaking 必须 ADR)
- **开放问题的决策** 每个走独立 ADR

---

## 十二、总结

本文把身份域从"六域模型里的一节"展开到"可以写代码"的程度。关键产出:

1. **GlobalMember + Role + Capability 的完整字段 / 状态机 / 不变量(INV-1 到 INV-15)**
2. **RPC 服务草案**(proto 骨架)
3. **事件 schema 清单 + 订阅链路**
4. **PG 表结构 + Outbox 模式**
5. **性能 / 可用性 / 安全 / 测试 目标全面化**
6. **6 个开放问题**,每个有候选 / 倾向 / 推进时机

**关键承诺**:

- 身份域是**双层 Member 模型的"档案层"**,不持 ProjectMember(ADR-0004)
- Role 是 method-library 的**索引**,内容在 method-library(SPEM)
- semantic_memory **只存 ref**,向量在外部(架构可演进)
- **tombstoned** 是严格单向 + 延迟期,对齐 42001 Retirement
- 所有写操作发事件,career_history append-only 对齐三红线

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 所在节 |
|---|---|---|
| INV-1 | member_id 永不复用 | §2.1.3 |
| INV-2 | tombstoned 单向 | §2.1.3 |
| INV-3 | 允许同 role 多 Member | §2.1.3 |
| INV-4 | career_history 严格 append | §2.1.3 |
| INV-5 | role_id / secondary_roles 指向非 retired Role | §2.1.3 |
| INV-6 | 状态转移严格按状态机 | §2.1.3 |
| INV-7 | hired 状态不能出现在 ProjectMember.global_member_id | §2.1.3 |
| INV-8 | retired 后 24h 内 ProjectMember 同步 | §2.1.3 |
| INV-9 | tombstoned semantic_memory 必须已冷存 | §2.1.3 |
| INV-10 | capability 修改必须带证据 | §2.1.3 |
| INV-11 | role_id 永不复用 | §2.2.3 |
| INV-12 | role retired 单向 | §2.2.3 |
| INV-13 | 有 Member 引用不能 retire Role | §2.2.3 |
| INV-14 | spec_source 指向已发布 Method Content | §2.2.3 |
| INV-15 | required_capabilities ⊆ default_capabilities | §2.2.3 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | identity 只管档案,不管运行 / 方法 / 对话 |
| OCP | Role 定义可扩展(新 Role 走 API 定义),不改代码 |
| DRY | Capability 定义集中在 method-library,identity 只引用 |
| YAGNI | 不预先做"Member 间继承关系",保留简单结构 |
| 不可变优先 | career_history append-only;事件不可变 |
| 显式优于隐式 | 15 条不变量显式声明 |
| Fail Fast | 非法状态转移立即拒绝 |
| 幂等性 | 乐观锁 version + Outbox event_id 去重 |

---

## 附录 C:订正标记

- [ ] §2.1.1 `episodic_memory_refs` 字段的精确结构待 ADR-0006 决策
- [ ] §3.1 RPC 方法名的精确 proto 路径待 core 仓 proto 草案落稿
- [ ] §5.2 表结构的具体索引清单待原型阶段压测后调
- [ ] §7.2 容量假设待多租户 scope 确定后复核
- [ ] §8.5 tombstone 后 hard_delete 流程的具体步骤待合规讨论
- [ ] §10.Q1 随 ADR-0006 落稿后一并更新

---

> 本文是 Quantalithos A 方案段 2 的第二件文档。身份域的详细设计以本文为单一真相源。后续 `quantalithos-identity` 仓的代码实现必须与本文一致,变更必须走 ADR。
