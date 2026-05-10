# artifact — 制品域详细设计

> **域定位**:制品域的详细设计文档。回答"产出什么可审计资产"。聚合根是 **Artifact** 和 **Baseline**;ArtifactRelation 是值对象;DatasetArtifact 是 Artifact 的特化。
>
> **上游依据**:
> - `product/最终目的.md` §3.6 过程可观察 + 横切可审计
> - `product/六域模型.md` §八 制品域
> - `architecture/仓库拆分方案.md` §4.6 `quantalithos-artifact`
> - `architecture/标准对齐全景图.md` §一 `quantalithos-artifact`
> - 14 标准主对齐:**ISO 15288 SoI / ISO 9001 Documented Information / ISO 25010 质量特性 / ISO 24748-2 Baseline**
>
> **本文不承载**:Artifact 内容的实际存储介质(对象存储 / git)/ UI 的 Artifact 预览(Chat / Runner)/ 需求工程方法论(未来 29148 讨论文档)。

---

## 一、使命与边界

### 1.1 使命

**承载 Quantalithos 一切可审计产出**。从需求文档到代码,从测试报告到 AIIA 合规声明,任何"值得持久保留、值得审计追溯"的产物都在本域聚合。

具体职责:
- Artifact 聚合根:16 种 kind 的可审计资产
- Baseline 聚合根:冻结的 Artifact 版本集合(24748-2 语义)
- ArtifactRelation 值对象:7 种血缘关系(derives-from / implements / verifies / validates / replaces / references / contains)
- DatasetArtifact 特化:AI 数据资产(25012 + 42001 A.7)
- 质量标签(25010 特性对齐)

### 1.2 边界(不做的事)

- **不存 Artifact 的实际内容**(content_ref 指向外部存储 / git / 对象存储)
- **不做业务编辑**(编辑在各域的专用编辑器,如代码 IDE / 需求文档工具 / Figma)
- **不做评审决策**(那是 governance.Gate)
- **不做过程编排**(那是 process 域)
- **不做质量度量本身**(度量发生在 observability / runtime,本域只存标签)

### 1.3 与其他域的协作边界

```
┌────────────────────────────────────────────────────────────┐
│  artifact 域(本文)                                         │
│  Artifact + Baseline + DatasetArtifact                     │
└──┬────────────────────┬────────────────────────────┬──────┘
   │ 发事件              │ 发事件                     │ 订阅
   ▼                    ▼                            ▼
 process                governance                   work / governance / conversation
 (Activity produced   (Baseline / Gate 触发        (各种同步)
  artifact)           文件冻结 / 合规声明)
```

---

## 二、聚合根详细设计

### 2.1 Artifact 聚合根

#### 2.1.1 完整字段

```
Artifact {
    artifact_id:            ULID,
    project_id:             Option<ProjectId>,   // 组织级 Artifact 可空

    // 分类
    kind:                   ArtifactKind,        // 16 种(见 §2.1.2)
    title:                  String,
    description:            Option<String>,

    // 内容引用(不存内容)
    content_ref:            ContentRef {
        storage_backend:    enum { git / s3 / inline / external_url },
        uri:                String,
        hash:                String,              // 内容哈希(防篡改)
        size_bytes:          i64,
        mime_type:           Option<String>,
    },
    format:                 ArtifactFormat,      // markdown / pdf / figma / notebook / git-ref / custom

    // 版本与演进
    version:                Semver,
    supersedes:             Option<ArtifactId>,  // 新版替代旧版(形成链)
    superseded_by:          Option<ArtifactId>,  // 反向指针

    // 责任方
    authors:                Vec<ActorRef>,        // ProjectMember / User
    reviewers:              Vec<ActorRef>,
    approved_by:            Option<ActorRef>,    // approved 状态必填
    approved_at:            Option<Timestamp>,
    baselined_at:           Option<Timestamp>,

    // 关联
    produced_in_activity:   Option<ActivityRef>,
    related_workitems:      Vec<WorkItemRef>,
    conversation_refs:      Vec<TurnRef>,        // 诞生于哪些对话

    // 质量标签(25010)
    quality_tags:           Vec<QualityCharacteristic>,     // Top-level 9 个
    quality_subtags:        Vec<QualitySubCharacteristic>,  // 31 个子特性

    // 合规角色
    compliance_role:        ComplianceRole,      // evidence / policy / reference / none

    // 状态
    state:                  ArtifactState,       // initiated / reviewed / approved / baselined / published / superseded / archived

    // 审计
    created_at:             Timestamp,
    modified_at:             Timestamp,
    trace_id:               TraceId,
    audit_log_ref:          AuditLogRef,
    version_number:         u64,                 // 乐观锁
}
```

#### 2.1.2 16 种 kind

```
requirement              需求文档(29148 对齐)
design                   设计文档(含 SDD / LLD / ADR 引用)
adr                      架构决策记录
prototype                原型(可点击 / 纸面 / 代码骨架)
code                     代码(content_ref 是 git ref)
test-plan                测试计划
test-report              测试报告
user-doc                 用户文档(42001 A.8)
release                  发布包(组合其他 Artifact)
lessons-learned          经验教训(Scrum Retro / 9001 改进)
dataset                  数据集(→ DatasetArtifact 特化)
impact-assessment        AIIA(42001 §8.2 / 42005)
soa                      Statement of Applicability(42001 §6.1.3)
compliance-declaration   合规声明(24748-2 + 42001 归档)
operational-log          运营日志(42001 §9.1)
custom                   项目 / 组织扩展(走 ADR 引入具体类型)
```

**新 kind 必须走 ADR**(子项目清单 AR2)。`custom` 仅作为"已有 kind 覆盖不到"的临时出口,连续使用超过 3 个月的 custom 类型应升级为正式 kind。

#### 2.1.3 生命周期状态机

```
              [创建]
                │
                ▼
         ┌────────────┐
         │ initiated  │ 初稿,尚未评审
         └──────┬─────┘
                │ submit_for_review
                ▼
         ┌────────────┐
         │  reviewed  │ 已评审(评审意见记录但未批)
         └──────┬─────┘
                │ approve(经 Gate 批准)
                ▼
         ┌────────────┐
         │  approved  │ 已批准,可被引用 / 成为 baseline 候选
         └──┬──────┬──┘
            │      │
 [baseline] │      │ [publish]
  经 Gate    │      │
            ▼      ▼
   ┌───────────┐ ┌────────────┐
   │ baselined │ │ published  │
   └──┬────────┘ └──────┬─────┘
      │                 │
   [supersede]     [supersede]
      │                 │
      ▼                 ▼
   ┌───────────────┐
   │  superseded   │ 被新版取代,只读
   └───────┬───────┘
           │ 可选 archive(长期归档)
           ▼
   ┌───────────────┐
   │   archived    │ 归档不可查主表,审计仍可查
   └───────────────┘
```

**关键状态说明**:

| 状态 | 含义 | 可做操作 |
|---|---|---|
| `initiated` | 初稿 | 修改内容 / 送审 / 作者增删 |
| `reviewed` | 已评审 | 修改内容(再 review)/ 批准 / 退回 |
| `approved` | 已批准 | **内容不可改** / 可被引用 / 可作为 baseline 候选 / 可 publish / 可 supersede |
| `baselined` | 冻结基线 | 只读 / 只能被 supersede |
| `published` | 对外发布 | 同 baselined,但多一个 external_uri 导出记录 |
| `superseded` | 被新版替代 | 只读 / 仍可查 |
| `archived` | 归档不主查 | 仅审计可查(观测层接管) |

#### 2.1.4 不变量(INV-1 到 INV-15)

**INV-1** `artifact_id` 永不复用
**INV-2** Artifact 内容(content_ref)**在 approved 后不可修改**(修改发新版本)
**INV-3** `state=approved` 时 `approved_by` 和 `approved_at` 必填
**INV-4** `state=baselined` 只能由 approved 经 Gate 转入
**INV-5** `state=superseded` 必须有 `superseded_by` 指向后继
**INV-6** `supersedes` 和 `superseded_by` 形成 DAG,**不允许环**
**INV-7** `archived` / `superseded` 后**不可回归** approved
**INV-8** `kind=release` 必须通过 `contains` 关系引用其他 Artifact
**INV-9** `kind=dataset` 必须扩展为 DatasetArtifact(§2.4)
**INV-10** `kind=soa` 或 `kind=compliance-declaration` 必须 `project_id != null`
**INV-11** `kind=adr` 的 Artifact version 只能 1.0.0(ADR 不发新版,只能 supersede)
**INV-12** `kind=operational-log` 不经过 reviewed → approved 路径,直接 initiated → approved(机器生成)
**INV-13** `quality_tags` 非空当 `kind ∈ {requirement, design, code, test-plan, test-report, release}`
**INV-14** 删除物理禁止(42001 / 9001 保留);只能 archived,archived 后 content_ref 可迁冷存但 metadata 保留
**INV-15** `content_ref.hash` 必须与实际存储的内容一致(定期验证,不一致发 tampered 严重事件)

#### 2.1.5 操作契约

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `CreateArtifact(kind, title, content_ref, ...)` | 按 kind 满足 INV | 创建,state=initiated | `artifact.created` |
| `UpdateContent(artifact_id, new_content_ref)` | state=initiated or reviewed | content 更新,hash 重算 | `artifact.content_updated` |
| `SubmitForReview(artifact_id)` | state=initiated | state=reviewed | `artifact.reviewed` |
| `Approve(artifact_id, approver)` | state=reviewed, Gate 批准 | state=approved | `artifact.approved` |
| `Baseline(artifact_id)` | state=approved, Gate 批准 | state=baselined | `artifact.baselined` |
| `Publish(artifact_id, external_uri)` | state ∈ {approved, baselined} | state=published | `artifact.published` |
| `Supersede(old_id, new_id)` | old state ∈ {approved, baselined, published} | old state=superseded, supersedes/superseded_by 互指 | `artifact.superseded` |
| `Archive(artifact_id)` | state ∈ {superseded, published} 且无活跃引用 | state=archived | `artifact.archived` |
| `AddRelation(from, to, kind)` | 两 Artifact 都存在,kind 有效 | 新增 ArtifactRelation | `artifact.relation_added` |
| `SetQualityTags(artifact_id, tags)` | state ∈ {initiated, reviewed} | tags 更新 | `artifact.quality_tags_updated` |

### 2.2 ArtifactRelation 值对象

#### 2.2.1 七种关系

```
ArtifactRelation {
    from_artifact_id,
    to_artifact_id,
    relation_kind:   enum {
        derives_from,   // 设计源自需求 / 代码源自设计
        implements,     // 代码实现设计
        verifies,       // 测试验证代码(V&V 的 V verification)
        validates,      // UAT 确认需求被满足(V&V 的 V validation)
        replaces,       // 与 supersede 相关:新版替代旧版(硬关联)
        references,     // 软引用(看过 / 借鉴 / 引文)
        contains,       // Release 包含多个 Artifact
    },
    metadata:        jsonb,   // 按 kind 可扩展(如 verifies 带 coverage_percent)
    created_at,
    created_by,
    trace_id,
}
```

#### 2.2.2 关系使用示例

- **需求→设计**:design1 `derives_from` requirement1
- **设计→代码**:code1 `implements` design1
- **代码→测试**:test_report1 `verifies` code1
- **需求→验收**:test_report2 `validates` requirement1
- **版本演进**:artifact_v2 `replaces` artifact_v1(+ supersede 字段联动)
- **Release 组合**:release1 `contains` {code1, user_doc1, test_report1}

#### 2.2.3 血缘图的不变量

**INV-16** `derives_from` / `implements` / `verifies` / `validates` 不能跨项目(project_id 必须相同或其中一方是组织级)
**INV-17** `replaces` 和 `supersede` 字段**严格一一对应**(可通过关系派生,也可反查)
**INV-18** `contains` 关系的 from 必须 kind=release
**INV-19** 血缘图整体是 DAG(每种 relation_kind 单独看也必须是 DAG)

### 2.3 Baseline 聚合根

#### 2.3.1 完整字段

```
Baseline {
    baseline_id:        ULID,
    project_id:         ProjectId,              // 归属项目(必填)
    baseline_kind:      BaselineKind,           // requirements / design / product / release
    name:               String,                 // 如 "V1.0 Requirements Baseline"
    description:        Option<String>,

    // 成员
    member_artifact_refs: Vec<PinnedArtifactRef>,  // 每个 pin 到特定版本

    // 冻结信息
    frozen_at:          Timestamp,
    frozen_by:          ActorRef,
    related_gate_id:    GateRef,                // 触发冻结的 Gate

    // 生命周期
    lifecycle:          BaselineLifecycle,       // active / superseded / archived

    // 演进
    supersedes:         Option<BaselineId>,
    superseded_by:      Option<BaselineId>,

    // 审计
    trace_id:           TraceId,
    audit_log_ref:      AuditLogRef,
}

PinnedArtifactRef {
    artifact_id,
    version,            // 锁死的版本号
    pin_at_hash,        // 锁死的内容 hash
    role_in_baseline:   Option<String>,   // 如 "Primary Requirement" / "Supporting Evidence"
}
```

#### 2.3.2 四种 baseline_kind

- `requirements` — 需求基线(24748-2 Requirements Baseline)
- `design` — 设计基线
- `product` — 发布前整体基线(涵盖需求 / 设计 / 测试 / 文档)
- `release` — 发布版本的 Artifact 组合

#### 2.3.3 不变量(INV-20 到 INV-24)

**INV-20** `baseline_id` 永不复用
**INV-21** `member_artifact_refs` 一旦冻结不可增删(要调整必须发新 Baseline + supersede)
**INV-22** 引用的 Artifact 版本必须 **approved 或 baselined** 状态
**INV-23** `lifecycle=superseded` 必须有 `superseded_by`
**INV-24** Baseline 不能循环 supersede(DAG)

### 2.4 DatasetArtifact 特化

#### 2.4.1 相对 Artifact 的扩展字段

```
DatasetArtifact(inherits Artifact, kind=dataset)
extra {
    // 数据来源(42001 A.7)
    data_provenance:    DataProvenance {
        source_type:    enum { manual / scraped / synthesized / licensed },
        source_uri:     Option<String>,
        collection_method:   String,
        collection_period:   DateRange,
        consent_evidence_refs:  Vec<ArtifactRef>,   // 若涉及 PII
    },

    // 许可
    data_license:       String,                     // 如 "CC-BY-4.0" / "proprietary"

    // 质量(25012 对齐)
    data_quality_score:     Option<Score>,
    quality_dimensions:     Map<Dimension, Score>,  // 准确性 / 完整性 / 一致性 / 时效性 / ...

    // 偏见评估
    bias_evaluation:    Option<BiasEvaluationRef>,  // 指向另一 Artifact(kind=test-report)

    // 隐私
    privacy_category:   enum { public / pseudonymized / sensitive_pii / regulated },
    retention_policy:   RetentionPolicy,
}
```

#### 2.4.2 特化不变量

**INV-25** `privacy_category=sensitive_pii` 或 `regulated` 必须有 `consent_evidence_refs`
**INV-26** `retention_policy` 过期后自动触发 archive(但不物理删,除非合规明确要求)
**INV-27** 用于训练 AI 的 Dataset 必须有 `bias_evaluation`(AI 伦理基线)

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.artifact.v1;

service ArtifactService {
    // === Artifact 管理 ===
    rpc CreateArtifact(CreateArtifactRequest) returns (CreateArtifactResponse);
    rpc UpdateContent(UpdateContentRequest) returns (UpdateContentResponse);
    rpc SubmitForReview(SubmitForReviewRequest) returns (SubmitForReviewResponse);
    rpc Approve(ApproveRequest) returns (ApproveResponse);
    rpc Baseline(BaselineRequest) returns (BaselineResponse);
    rpc Publish(PublishRequest) returns (PublishResponse);
    rpc Supersede(SupersedeRequest) returns (SupersedeResponse);
    rpc Archive(ArchiveRequest) returns (ArchiveResponse);

    rpc SetQualityTags(SetQualityTagsRequest) returns (SetQualityTagsResponse);
    rpc AddRelation(AddRelationRequest) returns (AddRelationResponse);

    rpc GetArtifact(GetArtifactRequest) returns (Artifact);
    rpc ListArtifacts(ListArtifactsRequest) returns (ListArtifactsResponse);
    rpc QueryArtifacts(QueryArtifactsRequest) returns (QueryArtifactsResponse);

    rpc GetLineage(GetLineageRequest) returns (LineageGraph);   // 血缘图查询

    // === Baseline 管理 ===
    rpc CreateBaseline(CreateBaselineRequest) returns (CreateBaselineResponse);
    rpc SupersedeBaseline(SupersedeBaselineRequest) returns (SupersedeBaselineResponse);
    rpc GetBaseline(GetBaselineRequest) returns (Baseline);
    rpc ListBaselines(ListBaselinesRequest) returns (ListBaselinesResponse);

    // === Dataset 特化 ===
    rpc CreateDatasetArtifact(CreateDatasetArtifactRequest) returns (CreateDatasetArtifactResponse);
    rpc UpdateDataProvenance(UpdateDataProvenanceRequest) returns (UpdateDataProvenanceResponse);
    rpc AttachBiasEvaluation(AttachBiasEvaluationRequest) returns (AttachBiasEvaluationResponse);
}
```

### 3.2 GetLineage —— 血缘查询

```proto
message GetLineageRequest {
    string root_artifact_id = 1;
    int32 depth = 2;                // 查询深度上限
    repeated string relation_kinds = 3;  // 过滤特定关系
    Direction direction = 4;        // upstream(上游,谁衍生出我)/ downstream(下游,我衍生出谁)/ both
}

message LineageGraph {
    repeated Artifact nodes = 1;
    repeated ArtifactRelation edges = 2;
    bool truncated = 3;             // 若结果超过 size 限制
}
```

血缘查询对齐**三红线可追溯性** —— 从任意 Artifact 反向查到源头的能力是合规基线。

### 3.3 权限与认证

- **内部**:mTLS + 白名单服务
- **外部**:OAuth2
- 读权限:project 成员全量可读;非成员按 visibility + Policy
- 写权限:
  - `CreateArtifact` / `UpdateContent` 要求是 authors 之一
  - `Approve` 要求是 reviewers 之一或经 Gate 批准
  - `Baseline` 必须经 Gate(governance.Gate.kind=baseline-confirm)
  - `Publish` 必须经 Gate(release 场景)
  - `Archive` 必须经 Gate(合规意义大)

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Query 类 RPC **不接受 Role 参数**,返回已鉴权对象的全量字段(包括 content / metadata / lineage)。按 Role 的字段可见性(例如对 non-author 隐藏 draft 注释)、脱敏(如 dataset 样例脱敏)、派生字段(如 risk_label)由 UI 仓消费 method-library 的 ViewProfile 完成。actor 仅用于鉴权(能否读取整个 Artifact)和审计留痕。

### 3.4 常见错误码

- `ARTIFACT_NOT_FOUND` / `BASELINE_NOT_FOUND`
- `INVALID_STATE_TRANSITION` / `APPROVED_CONTENT_IMMUTABLE`
- `LINEAGE_CYCLE`(违反 INV-6 / INV-19 / INV-24)
- `MISSING_QUALITY_TAGS`(违反 INV-13)
- `MISSING_CONSENT_EVIDENCE`(违反 INV-25)
- `CONTENT_HASH_MISMATCH`(违反 INV-15,审计严重)

---

## 四、事件 schema 细节

### 4.1 事件清单

| 事件 | 用途 |
|---|---|
| `artifact.created` | 新 Artifact |
| `artifact.content_updated` | 内容更新(approved 前) |
| `artifact.reviewed` | 送审完成 |
| `artifact.approved` | 批准 |
| `artifact.baselined` | 冻结基线 |
| `artifact.published` | 对外发布 |
| `artifact.superseded` | 被新版替代 |
| `artifact.archived` | 归档 |
| `artifact.relation_added` | 血缘关系新增 |
| `artifact.quality_tags_updated` | 质量标签变化 |
| `baseline.created` | 新 Baseline |
| `baseline.superseded` | Baseline 换代 |
| `artifact.content_tampered` | **严重审计**:hash 不匹配 |
| `artifact.bias_evaluation_attached` | Dataset 特化事件 |
| `artifact.work_product_kind.added` | WorkProductKind 白名单新增(method-library 订阅,见下) |
| `artifact.work_product_kind.retired` | WorkProductKind 白名单移除 |

**关于 `artifact.work_product_kind.*` 事件族**(对齐 method-library 域 §4.3):

- artifact 域维护 `ArtifactKind` 的受控词表(16 种 + custom,§2.1.2)
- 组织级可新增自定义 WorkProductKind,需经 ADR(AR2 清单)
- 新增 / 移除时发本事件,method-library 订阅以同步允许的 WorkProductDefinition 引用范围
- subject = kind_name,data 含 rationale / approved_gate_id / scope(global / organization)

### 4.2 核心事件 schema

#### artifact.approved

```
type:       artifact.approved
subject:    artifact_id

data: {
    artifact_id,
    kind,
    project_id,
    version,
    previous_state,       // reviewed
    new_state,            // approved
    approved_by,
    related_gate_id,      // 若经 Gate 批准
    content_hash,         // 审计关键
    authors,
    reviewers,
}
```

#### artifact.baselined

```
data: {
    artifact_id,
    baseline_id,          // 若此次 baseline 创建了新 Baseline 聚合
    project_id,
    version,
    related_gate_id,
    frozen_by,
}
```

#### artifact.relation_added

```
data: {
    from_artifact_id,
    to_artifact_id,
    relation_kind,         // derives_from / implements / verifies / validates / replaces / references / contains
    metadata_summary,     // 前 200 字符
    created_by,
}
```

#### artifact.content_tampered(严重审计)

```
subject:    artifact_id
severity:   critical

data: {
    artifact_id,
    expected_hash,
    actual_hash,
    detected_at,
    detection_method:     enum { scheduled_check / access_check / explicit_verify },
    storage_backend,
}
```

此事件**必须进审计链 + 触发告警 + 暂停 Artifact 使用**,直到人工调查。

### 4.3 事件的 content 策略

和 conversation 类似,事件**不带完整 content**(Artifact 可能是 MB 级文档或 git 大 PR),只带:
- `content_ref` 引用
- `content_hash`
- `content_summary`(title + 前 200 字符)

订阅方需要完整内容时通过 `GetArtifact` 查询。

### 4.4 订阅事件

| 订阅 | 来源域 | 动作 |
|---|---|---|
| `process.activity.artifact_produced` | process | 创建 Artifact(作者 = Activity 的 assignee) |
| `governance.gate.decided(kind=baseline)` | governance | 触发 Baseline 创建 |
| `governance.gate.decided(kind=release)` | governance | 触发 Publish + Release Baseline |
| `governance.gate.decided(kind=archive)` | governance | 触发 Archive |
| `work.workitem.state_changed(done)` | work | 检查对应 Artifact 是否应 approved |
| `identity.member.retired` | identity | 不改 Artifact 历史,但 authors / reviewers 引用标记 "历史成员" |
| `method_library.work_product_definition.published` | method-library | 同步 WorkProductKind 白名单可接受的 WorkProductDefinition 引用;若含新 kind 触发 `artifact.work_product_kind.added` |
| `method_library.content.fingerprint_changed`(涉及 WorkProductDefinition)| method-library | 对齐受此 Definition 约束的 Artifact,fingerprint 不匹配告警 |
| `method_library.ai_policy.published` | method-library | 若 AIPolicy 涉及 Artifact 的保留期 / 脱敏规则,刷新相关 Artifact 的治理标注 |

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**内容存储**(分层):
- 代码 → Git 服务器(GitLab / Gitea / GitHub)
- 文档(markdown / pdf)→ S3 / MinIO
- 图片 / 原型 → S3
- Inline(非常小且不会改)→ PG text 列(< 64 KB)

**向量索引**:用于 QueryArtifacts 的语义检索(可选,挂外部向量库)。

### 5.2 表结构

#### table: `artifacts`

| 列 | 类型 | 约束 |
|---|---|---|
| artifact_id | ULID (PK) | |
| project_id | ULID | nullable FK |
| kind | enum | not null |
| title | varchar(512) | not null |
| description | text | |
| content_ref | jsonb | not null(含 uri / hash / size) |
| format | varchar(64) | not null |
| version | varchar(32) | not null |
| supersedes | ULID | nullable FK self |
| superseded_by | ULID | nullable FK self |
| authors | jsonb | default '[]' |
| reviewers | jsonb | default '[]' |
| approved_by | varchar(128) | nullable |
| approved_at | timestamptz | nullable |
| baselined_at | timestamptz | nullable |
| produced_in_activity | ULID | nullable |
| related_workitems | jsonb | default '[]' |
| conversation_refs | jsonb | default '[]' |
| quality_tags | jsonb | default '[]' |
| quality_subtags | jsonb | default '[]' |
| compliance_role | enum | not null default 'none' |
| state | enum | not null |
| created_at / modified_at | timestamptz | not null |
| trace_id | varchar(64) | not null |
| version_number | bigint | default 1(乐观锁) |

**索引**:
- `idx_artifacts_project_kind_state` on (project_id, kind, state)
- `idx_artifacts_produced_activity` on (produced_in_activity) where produced_in_activity is not null
- `idx_artifacts_quality_tags` gin on (quality_tags)
- `idx_artifacts_title_trgm` gin on (title gin_trgm_ops)

#### table: `artifact_relations`

| 列 | 类型 |
|---|---|
| relation_id | ULID PK |
| from_artifact_id | ULID FK |
| to_artifact_id | ULID FK |
| relation_kind | enum |
| metadata | jsonb |
| created_at | timestamptz |
| created_by | varchar(128) |
| trace_id | varchar(64) |

**索引**:
- `idx_ar_from_kind` on (from_artifact_id, relation_kind)
- `idx_ar_to_kind` on (to_artifact_id, relation_kind)

**DAG 约束**:每次 AddRelation 做 cycle check(递归 CTE)。

#### table: `baselines`

| 列 | 类型 |
|---|---|
| baseline_id | ULID PK |
| project_id | ULID FK |
| baseline_kind | enum |
| name | varchar(256) |
| description | text |
| member_artifact_refs | jsonb |
| frozen_at | timestamptz |
| frozen_by | varchar(128) |
| related_gate_id | ULID |
| lifecycle | enum |
| supersedes | ULID FK self |
| superseded_by | ULID FK self |

#### table: `dataset_artifacts`(Artifact 特化扩展)

一对一继承 artifacts,额外列:

| 列 | 类型 |
|---|---|
| artifact_id | ULID PK FK → artifacts |
| data_provenance | jsonb |
| data_license | varchar(64) |
| data_quality_score | numeric |
| quality_dimensions | jsonb |
| bias_evaluation_ref | ULID(指向另一 Artifact) |
| privacy_category | enum |
| retention_policy | jsonb |

#### table: `artifact_events_outbox`

同 identity / conversation,不赘述。

### 5.3 内容哈希校验机制

- 每次 Artifact **approve** 时重算 hash,写入 `content_ref.hash`
- **定期扫描**(每日):对 baselined / published 的 Artifact 抽样核对 hash
- **访问时校验**:关键操作(如 Release 生成)前强制校验
- 不一致发 `artifact.content_tampered` 严重事件

### 5.4 一致性策略

- 单 Artifact 的写入单事务
- AddRelation 跨两 Artifact,用行级锁(FOR UPDATE)避免竞争
- Baseline 创建时对所有 member_artifact_ref 加锁,防止并发 supersede

### 5.5 容量估算

- 每项目年均 100-500 Artifact
- 10w 项目 → 1000w-5000w Artifact
- Relation 约为 Artifact 数的 2-3 倍
- PG 单节点可承载;未来可按 project_id 分片

---

## 六、与其他域的事件订阅链路

### 6.1 事件流

```
artifact 域 → 其他域
───────────────────
artifact.created               → work(若 related_workitems 存在,提示 workitem 关联)
artifact.approved              → work(检查 workitem 是否可 done)/ conversation(可选发 artifact-kind Turn)
artifact.baselined             → work(写入 Project.baseline_ids)/ governance(归入合规证据)
artifact.published             → archive(归档准备)
artifact.superseded            → governance(合规 Policy 可能需要审查新版)
artifact.archived              → observability(迁移事件到冷存审计)
artifact.content_tampered      → governance(必须触发 Nonconformity)/ observability(严重告警)

其他域 → artifact 域
───────────────────
process.activity.artifact_produced  → CreateArtifact
governance.gate.decided(baseline)   → Baseline
governance.gate.decided(release)    → Publish + Release Baseline
governance.gate.decided(archive)    → Archive
work.workitem.state_changed(done)   → 检查对应 Artifact 是否 approved
```

### 6.2 典型场景

#### 场景 A:需求 → 设计 → 代码 → 测试的完整血缘

```
requirement_v1(由 Tech Lead 起草,Gate 批准)
  [artifact.created] [artifact.approved]
    │
    ▼
design_v1 derives_from requirement_v1
  [artifact.created] [artifact.relation_added]
  [artifact.approved]
    │
    ▼
code_v1 implements design_v1
  [artifact.created] [artifact.relation_added]
    │
    ▼
test_report_v1 verifies code_v1
  [artifact.created] [artifact.relation_added]
    │
    ▼
test_report_v2 validates requirement_v1
  [artifact.relation_added]
    │
    ▼
Release baseline = [requirement_v1, design_v1, code_v1, test_report_v1, test_report_v2]
  [baseline.created(kind=release)]
  [artifact.baselined] × N
```

#### 场景 B:需求变更引发的 supersede 链

```
requirement_v1(baselined)
    │
    │ 用户提出变更请求
    │ Gate 批准
    ▼
create requirement_v2(derives_from requirement_v1)
Supersede(old=v1, new=v2)
  [artifact.superseded(v1)]
  [artifact.relation_added(replaces)]
    │
    ▼
下游 design / code / test 按需更新(引用 v2)
新 Release baseline 发布
```

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 |
|---|---|
| Artifact 写入 P95 | < 200ms(不含内容上传) |
| GetArtifact P95 | < 100ms |
| GetLineage(深度 5)P95 | < 500ms |
| SearchArtifacts P95 | < 800ms |
| Availability | ≥ 99.9% |
| hash 校验延迟(每次 approve) | < 50ms(小 Artifact) |

### 7.2 容量假设

- 年 5000w 条 Artifact(10w 项目 × 500)
- Relation 1.5 亿条
- 内容实际大小:代码走 Git 不在 PG;文档 PG 或 S3;数据集走 S3 为主
- 血缘查询深度典型 3-7 跳

### 7.3 降级策略

- Git 后端不可用:CreateArtifact(kind=code)降级为 "pending content"(content_ref.status=pending_upload)
- S3 不可用:同上,文档 / Dataset 写入延迟
- 全文 / 向量检索失败:降级到基础字段过滤

### 7.4 监控关键点

- 各 kind 的创建 QPS
- hash 校验失败率(应为 0,非 0 立即告警)
- baseline_ref 中 Artifact 的状态异常(理论上 baselined pin 永不回退)
- DAG 环检测触发次数

---

## 八、安全与合规对齐

### 8.1 42001 控制项对齐

| 控制族 | 项 | 本域落地 |
|---|---|---|
| A.5 评估影响 | AIIA | kind=impact-assessment 是一等 Artifact |
| A.6 AI 生命周期 | Documentation | user-doc / design / adr 系列 |
| A.7 Data for AI | Data Provenance / Quality / Privacy | DatasetArtifact 全套字段 |
| A.8 Information Provision | 用户文档 | kind=user-doc |
| A.10 第三方治理 | 供应商产物 | references 关系可追溯外部来源 |

### 8.2 24748-2 对齐

- Baseline 聚合根 = 24748-2 Baseline 直接落地
- supersedes 链对齐 24748-2 的变更管理
- Tailored Conformance 声明用 kind=compliance-declaration

### 8.3 15288 对齐

- Artifact 作为 SoI 的 System Element
- ArtifactRelation 的 `contains` 映射 15288 的 system decomposition

### 8.4 25010 对齐

- quality_tags 使用 9 特性枚举
- quality_subtags 使用 31 子特性枚举
- NFR 作为 Artifact(kind=requirement + quality_tags 完整)落地

### 8.5 9001 对齐

- § 7.5 Documented Information:所有 Artifact 就是记录
- § 8.5 制品生命周期控制:状态机严格
- § 10.2 改进:lessons-learned kind 专门承载

### 8.6 横切红线

- **可审计性**:INV-14(不可物理删除)+ hash 校验机制
- **可追溯性**:血缘图 + `GetLineage` RPC + trace_id 贯穿
- **可裁剪性**:quality_tags 可扩展;custom kind 作为过渡出口

---

## 九、测试策略

### 9.1 单元测试重点

- **状态机**:所有合法 / 非法转移(覆盖 INV-7 等)
- **16 种 kind 的 INV-8 到 INV-13**
- **血缘 DAG 约束**(尝试添加成环关系必须拒)
- **hash 校验**在 approve / baseline / 定期检查三处触发
- **DatasetArtifact 的 INV-25 到 INV-27**

### 9.2 集成测试重点

- 需求→设计→代码→测试 完整血缘链的生成与查询
- supersede 链在并发下的一致性
- Baseline 冻结后成员 Artifact 不允许再修改(状态锁)
- 事件 Outbox 的幂等

### 9.3 E2E 场景

- 完整项目生命周期:立项 → 需求 → 设计 → 代码 → 测试 → Release baseline → 发布 → 某需求变更 → supersede 链
- tampered 事件模拟(篡改 S3 文件 hash 应被检测出)

### 9.4 安全测试

- 非 authors 无权 UpdateContent
- approved Artifact 的 UpdateContent 被拒
- archive 后的 Artifact 不可通过 GetArtifact 返回(只走 archive 专用接口)
- hash 不一致的 approve 立即拒绝并告警

---

## 十、开放问题

### Q1. Artifact 内容存储的统一抽象

**背景**:code 走 Git、文档走 S3、数据走 S3 + 向量库,多后端管理复杂。

**候选**:
- A 维持多后端,content_ref.storage_backend 区分
- B 封装统一 ContentStore 抽象(ObjectRef 统一 URI)
- C 所有文件走 Git LFS 类方案(含大 Dataset)

**倾向**:B(渐进实现,内部先抽象)

**推进**:段 3 原型阶段;可能走独立 ADR。

### Q2. Artifact 的"物理删除"是否永远禁止

**背景**:INV-14 禁止物理删除。但 GDPR 等法规要求数据主体"被遗忘权"。

**候选**:
- A 永远不删(纯 archive,违反 GDPR 的场景需外部补措施)
- B 合规触发的"替换为墓碑"(保留 metadata + audit,内容清空)
- C 允许 project-level 合规删除,审计日志保留永远

**倾向**:B

**推进**:合规讨论 + ADR。

### Q3. 血缘查询的性能策略

**背景**:DAG 查询深度大时很慢,PG CTE 可能无法满足。

**候选**:
- A 在 PG 用 递归 CTE(当前方案)
- B 在 Neo4j 等图库做血缘索引
- C 异步缓存血缘图(全量血缘快照,按项目)

**倾向**:A 起步,C 作为优化

**推进**:性能压测触发。

### Q4. 质量标签的自动化推断

**背景**:quality_tags 要求作者手动打,实际使用可能敷衍。

**候选**:
- A 纯手动
- B 按 kind 预填 default tags + 必改制
- C LLM 辅助推断(审计 trace 注明"AI 建议")

**倾向**:B + C 组合

**推进**:原型阶段。

### Q5. DatasetArtifact 的版本化策略

**背景**:数据集可能 TB 级,版本化成本高。

**候选**:
- A 每次变更发新 Artifact(Dataset v1 → v2)
- B 增量快照(记 delta)
- C 外部版本化(DVC / LakeFS 等),Quantalithos 只存引用

**倾向**:C

**推进**:Dataset 重度使用时决策。

### Q6. Artifact 的"跨项目复用"

**背景**:某需求文档或方法模板可能多项目复用。

**候选**:
- A 禁止跨项目(每次拷贝新 Artifact)
- B 允许跨项目,用 references 关系链接,但 project_id 锁定最初项目
- C 全局 Artifact 池(project_id=null + 多项目引用)

**倾向**:C 对于组织级资产;项目级用 B

**推进**:Marketplace 阶段。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-artifact` 仓 README(段 3)

- §二 聚合根 → src/domain/
- §三 RPC → proto/
- §四 事件 → src/events/
- §五 持久化 → migrations/
- §九 测试 → tests/

### 11.2 与 governance 域

- Gate 决策触发本域状态转移(approve / baseline / publish / archive)
- AIIA / SoA / compliance-declaration 作为特殊 Artifact.kind,双身份(治理 + 制品)

### 11.3 与 process 域

- ActivityArtifact 产生关系由 process 发事件驱动创建
- Baseline 与 Stage 边界对齐(24748-2 阶段出口冻结 Baseline)

### 11.4 与 work 域

- related_workitems 对应 WorkItem 的产出
- Baseline ID 写入 Project.baseline_ids(六域模型 §5.2.1)

### 11.5 修订纪律

- kind 新增(含从 custom 升级)必须 ADR
- INV 修改必须 ADR
- 血缘关系类型新增必须 ADR
- 持久化 schema 变更走 migration

---

## 十二、总结

本文把制品域从"一节六域模型叙事"展开到"可以实现"的程度。关键产出:

1. **Artifact / Baseline / DatasetArtifact / ArtifactRelation 完整设计**
2. **16 种 kind + 7 状态 + 7 种血缘关系**的强约束
3. **27 条不变量**(INV-1 到 INV-27),特别强调**不可物理删 + hash 校验 + 血缘 DAG**
4. **内容多后端存储**(Git / S3 / PG inline / 外部),content_ref 抽象
5. **PG 表结构 + 血缘查询 + 分区策略**
6. **6 个开放问题**覆盖性能 / 合规 / 复用等前沿点

**关键承诺**:

- Artifact 不可变更内容(approved 后)+ 不可物理删除
- 16 种 kind 硬枚举,新 kind 走 ADR
- Baseline 是聚合根(24748-2 语义)
- Artifact 血缘 DAG 强约束
- DatasetArtifact 特化对齐 42001 A.7 数据治理
- hash 校验机制防篡改(对齐红线 1)

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-1 | artifact_id 永不复用 | §2.1.4 |
| INV-2 | approved 后内容不可修改 | §2.1.4 |
| INV-3 | approved 必须 approved_by + approved_at | §2.1.4 |
| INV-4 | baselined 只能从 approved 经 Gate 转入 | §2.1.4 |
| INV-5 | superseded 必须有 superseded_by | §2.1.4 |
| INV-6 | supersede 链 DAG | §2.1.4 |
| INV-7 | archived / superseded 不可回 approved | §2.1.4 |
| INV-8 | release 必须用 contains 引用 Artifact | §2.1.4 |
| INV-9 | dataset kind 必须 DatasetArtifact 特化 | §2.1.4 |
| INV-10 | soa / compliance-declaration 必填 project_id | §2.1.4 |
| INV-11 | adr 版本只能 1.0.0 | §2.1.4 |
| INV-12 | operational-log 跳过 reviewed 直接 approved | §2.1.4 |
| INV-13 | 关键 kind 必填 quality_tags | §2.1.4 |
| INV-14 | 禁止物理删除 | §2.1.4 |
| INV-15 | content_ref.hash 必须匹配实际内容 | §2.1.4 |
| INV-16 | 血缘关系原则上同项目 | §2.2.3 |
| INV-17 | replaces 与 supersede 字段一一对应 | §2.2.3 |
| INV-18 | contains 关系 from 必须 kind=release | §2.2.3 |
| INV-19 | 血缘图每种关系 kind 独立看都是 DAG | §2.2.3 |
| INV-20 | baseline_id 永不复用 | §2.3.3 |
| INV-21 | Baseline 成员冻结不可增删 | §2.3.3 |
| INV-22 | Baseline 成员必须 approved / baselined | §2.3.3 |
| INV-23 | Baseline superseded 必有 superseded_by | §2.3.3 |
| INV-24 | Baseline supersede 链 DAG | §2.3.3 |
| INV-25 | sensitive_pii 必须 consent_evidence | §2.4.2 |
| INV-26 | retention_policy 过期触发 archive | §2.4.2 |
| INV-27 | AI 训练 Dataset 必须 bias_evaluation | §2.4.2 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | 只管"可审计产出",不管内容编辑 / 过程编排 / 评审决策 |
| OCP | kind 枚举可扩展(走 ADR);relation_kind 可扩展 |
| DRY | DatasetArtifact 继承 Artifact,不重复字段 |
| YAGNI | 不预设"多方协作编辑"(那是外部工具的事) |
| 不可变优先 | approved 后 content 不可变;删除禁止 |
| 显式优于隐式 | 27 条不变量 + 状态机 + 血缘 DAG |
| Fail Fast | hash 不匹配立即告警 + 停用 |
| 幂等性 | Outbox event_id + Artifact version_number |

---

## 附录 C:订正标记

- [ ] §2.1.2 16 种 kind 的精确描述待每个 kind 的详细规范定稿
- [ ] §2.1.5 Approve 操作的 Gate 类型映射待 governance 域定稿
- [ ] §5.1 内容存储的 Git / S3 / 向量库选型待部署架构决策
- [ ] §6.1 `artifact.content_tampered` 的告警路径待 observability 设计
- [ ] §10.Q2 物理删除的 GDPR 场景走独立 ADR

---

> 本文是 Quantalithos A 方案段 2 的第四件文档。制品域的详细设计以本文为单一真相源。
