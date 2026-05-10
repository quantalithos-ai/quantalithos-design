# Event Catalog — Quantalithos 事件契约主表

> **文档定位**:Quantalithos 所有跨域事件的**单一真相源**(Single Source of Truth)。任何域新增、修改、弃用事件**必须先更新本表**,再在各域 README 里同步。
>
> **适用范围**:六个 L1 域(identity / conversation / work / process / governance / artifact)+ L3 方法能力域(method-library / capability-hub)+ L2 Member 运行层(future)+ L4 横切(archive / observability tap)。
>
> **不承载**:具体字段 schema(归各域 README §4.2)/ bus 机制(归 bus-draft 主文)/ proto 生成(归 proto-draft)。本表只承载"**事件存在 + 发布方 + 订阅方 + 幂等 + 严重度 + 保留期**"。
>
> **维护纪律**:
> - 新增事件必须先在本表登记,再在域 README §4.1 事件清单同步
> - 命名漂移 / 臆造事件(只在某域 README 里出现但源域未声明)**禁止**
> - 本表的完整性由 bus-draft §6 订阅契约引用保证
> - 版本:2026-05-10 首版(对齐七域 README + ADR-0008 / 0009 / 0010 / 0011 现状)

---

## 一、命名约定

### 1.1 事件名格式

```
{domain}.{aggregate}.{verb}
```

- `domain` ∈ {identity / conversation / work / process / governance / artifact / method_library / capability_hub / archive / observability}
- `aggregate` 是该域内的聚合根或子实体
- `verb` 是过去式(已发生)或状态名(.state_changed)

### 1.2 命名反例

- ❌ `member.hired`(缺 domain)
- ❌ `identity.member.hire`(用主动态)
- ❌ `identity.MemberHired`(大小写错)
- ❌ `identity.role.updated_and_retired`(用"和"连接多动作,应拆两个)

### 1.3 命名漂移检查

本表建立后,任何与本表不一致的事件名视为 drift,必须纠正:
- 示例 1(已修):`governance.profile.activated` → 正确为 `process.profile.activated`(活化 Profile 的是 process 域)
- 示例 2(已修):`work.project.member_tool_scope_reevaluated` → 正确为 `work.project.member_tool_scope_updated`,语义靠 event data 里的 `trigger=policy_reevaluation` 表达,不靠独立事件

---

## 二、严重度规范

### 2.1 四级 severity

```
severity = enum {
    info,      // 例行事件(MemberActivated / TurnPosted)
    notice,    // 值得留意但非问题(Gate raised / Policy activated)
    warning,   // 需关注(template.source_drift / deviation.detected)
    critical,  // 立即告警(content_tampered / invariant_violation)
}
```

### 2.2 severity 默认值规则

- `*.created / *.updated / *.state_changed` → info
- `*.raised / *.activated / *.published` → notice
- `*.source_drift / *.fingerprint_changed` → warning
- `*.tampered / *.invariant_violation_attempted / *.unauthorized_access_attempt` → critical
- 模板 / Profile / Instance 的 `*.superseded / *.deprecated / *.retired` → notice
- Nonconformity 根据 severity 字段本身决定(critical / major / minor / info)

---

## 三、幂等 key 规范

### 3.1 通用规则

所有事件必须声明幂等 key,订阅方用 event_id 去重的基础上,幂等 key 提供**业务级幂等保护**(防止同一业务事实被重复处理)。

### 3.2 默认幂等 key 公式

| 事件模式 | 幂等 key |
|---|---|
| 聚合根生命周期状态转移 | `{aggregate_id}_{previous_state}_{new_state}` |
| 聚合根字段变更 | `{aggregate_id}_{version}` |
| 关系新增 | `{from_id}_{to_id}_{relation_kind}` |
| 批准 / 决策 / Gate 结果 | `{gate_id}` |
| 周期 / 定时事件 | `{aggregate_id}_{period_id}` |
| 跨域触发事件 | `{trigger_event_ref}_{target_domain}` |

### 3.3 覆盖机制

各域 README §4.4 可声明特定事件的幂等 key 覆盖默认;如无声明,按 §3.2 默认规则。

---

## 四、保留期规范

### 4.1 默认保留期

| 事件类型 | 默认保留期 | 说明 |
|---|---|---|
| 业务流(process / work / conversation 的常规)| 90 天 | 在线可查,过期 archived |
| 审计流(identity.audit.* / governance.* / artifact.content_tampered)| 7 年 | 合规要求(9001 + 42001)|
| 治理决策(gate.decided / policy.activated)| 7 年 | 决策证据 |
| 方法库变更(method_library.*)| 3 年 | 资产版本历史 |
| 生命周期尾部(*.deprecated / *.retired / *.superseded)| 7 年 | 历史追溯 |

### 4.2 组织级覆盖

governance.Policy 可按 type 细化保留期(见 bus-draft Q2);租户级更长保留由企业版触发。

---

## 五、事件分域清单

> 格式:每域一个子节,含总数 / 事件表 / 域内备注。
>
> 表头:事件 | 订阅方 | severity | 保留期 | 备注
>
> 订阅方若为 **(隐式)** 表示仅 observability tap + archive 归档,无业务域显式订阅(可审计,合法)。

### 5.1 identity 域(17 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `identity.member.hired` | work / conversation / member-service | info | 7y | 新员工入职,member-service 准备容器 |
| `identity.member.activated` | member-service / work | info | 90d | |
| `identity.member.paused` | work / conversation / member-service / process | info | 90d | 所有 active 订阅按规则 pause |
| `identity.member.retired` | work / conversation / member-service / process / artifact | info | 7y | retired 单向,审计重要 |
| `identity.member.tombstoned` | (隐式)| notice | 7y | GDPR 硬删除,仅审计 |
| `identity.member.role_changed` | work / member-service / governance | info | 7y | governance 可能触发 Policy 重评 |
| `identity.member.profile_updated` | (隐式)| info | 90d | |
| `identity.member.capability_updated` | (隐式)| info | 90d | |
| `identity.member.career_entry_added` | (隐式)| info | 7y | 审计生涯 |
| `identity.role.defined` | method-library | info | 3y | |
| `identity.role.published` | method-library / member-images | notice | 3y | 预构建镜像 |
| `identity.role.deprecated` | method-library / work | notice | 3y | |
| `identity.role.retired` | method-library / work | notice | 7y | **ADR-0009 相关**,method-library 检查 RoleDefinition 是否可 retire |
| `identity.role.updated` | work / member-service | info | 3y | Role 字段变更 |
| `identity.role.catalog_updated` | process / work / member-service | notice | 3y | **新增**:批量 Role 索引刷新事件(由 method_library.role_definition.published 触发) |
| `identity.role.source_drift` | governance | warning | 7y | 与 method-library 不一致告警 |
| `identity.audit.*` | observability(审计链)| critical | 7y | 四个 audit 事件:invariant_violation / rate_limit / suspicious / unauthorized |

### 5.2 conversation 域(6 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `conversation.group.created` | (隐式)| info | 90d | |
| `conversation.group.archived` | (隐式)| notice | 7y | |
| `conversation.turn.posted` | (隐式,UI 流订阅)| info | 90d | UI 仓订阅,不在 L1 间传递 |
| `conversation.participant.added` | (隐式)| info | 90d | |
| `conversation.participant.removed` | (隐式)| info | 90d | |
| `conversation.reasoning_trace.attached` | observability | info | 7y | 42001 可解释性 |

**备注**:conversation 域大部分事件是**对 UI 层**的(chat / console 通过 StreamEvents 订阅),不在 L1 域之间传递。`conversation.*` 不是 L1 六域间主要事件源。

### 5.3 work 域(30 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `work.project.created` | conversation / governance / observability | info | 7y | conversation 建 group |
| `work.project.started` | process / governance | notice | 7y | process 起 Instance;governance 检 AIIA |
| `work.project.paused` | process / member-service / conversation | info | 90d | |
| `work.project.resumed` | process / member-service | info | 90d | |
| `work.project.archived` | conversation / identity / process / archive | notice | 7y | |
| `work.project.restored` | process / member-service | info | 90d | |
| `work.project.dissolved` | conversation / identity / archive | critical | 7y | GDPR 场景,严重事件 |
| `work.project.context_of_use_updated` | governance / process | notice | 7y | compliance_profile 变更可能触发 AIIA |
| `work.project.aiia_attached` | governance / archive | notice | 7y | |
| `work.project.member_assigned` | identity / conversation / member-service | info | 7y | |
| `work.project.member_activated` | member-service | info | 90d | |
| `work.project.member_paused` | member-service / conversation | info | 90d | |
| `work.project.member_resumed` | member-service | info | 90d | |
| `work.project.member_retired_from_project` | identity / conversation / member-service | info | 7y | |
| `work.project.member_archived` | (隐式)| info | 7y | |
| `work.project.member_tool_scope_updated` | governance / member-service / L2 runtime | notice | 7y | **data.trigger 标识原因**(manual / policy_reevaluation / role_change)|
| `work.project.member_policy_overrides_updated` | governance / L2 runtime | notice | 7y | |
| `work.workitem.created` | (隐式 + UI 流)| info | 90d | |
| `work.workitem.assigned` | member-service / conversation | info | 90d | |
| `work.workitem.state_changed` | artifact / conversation / member-service | info | 90d | |
| `work.workitem.artifact_attached` | artifact | info | 90d | |
| `work.workitem.blocker_set` | (隐式)| notice | 90d | |
| `work.workitem.blocker_cleared` | (隐式)| info | 90d | |
| `work.workitem.priority_changed` | (隐式)| info | 90d | |
| `work.workitem.dependency_added` | (隐式)| info | 90d | |
| `work.backlog.refined` | (隐式)| info | 90d | |
| `work.iteration.planned` | conversation / observability | notice | 7y | Sprint Planning 结果 |
| `work.iteration.started` | conversation | info | 90d | |
| `work.iteration.closed` | conversation / observability | notice | 7y | Sprint Review 完成,含 retrospective_notes |
| `work.iteration.retrospective_recorded` | observability | info | 7y | |

### 5.4 process 域(22 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `process.template.published` | (隐式)| info | 3y | Template 执行索引已同步 |
| `process.template.deprecated` | (隐式)| notice | 3y | |
| `process.template.source_drift` | governance | warning | 7y | method-library 内容与索引不一致 |
| `process.template.synced_from_method_library` | observability | info | 90d | |
| `process.profile.drafted` | (隐式)| info | 90d | |
| `process.profile.tailoring_decision_added` | observability | info | 7y | 24748-2 Tailoring Record |
| `process.profile.activated` | work / conversation | notice | 7y | **ADR-0013/0011**:Profile 激活后才能 start instance |
| `process.profile.superseded` | work | notice | 3y | |
| `process.instance.created` | work / observability | info | 7y | |
| `process.instance.started` | conversation / work | notice | 7y | |
| `process.instance.paused` | member-service | info | 90d | |
| `process.instance.resumed` | member-service | info | 90d | |
| `process.instance.completed` | work / archive | notice | 7y | |
| `process.instance.failed` | governance / member-service | warning | 7y | 可能触发 Nonconformity |
| `process.instance.cancelled` | member-service / archive | notice | 7y | |
| `process.instance.checkpoint_saved` | observability | info | 90d | ADR-0007 |
| `process.instance.recovered_from_checkpoint` | observability | notice | 7y | |
| `process.activity.scheduled` | member-service / work | info | 90d | |
| `process.activity.started` | conversation | info | 90d | |
| `process.activity.completed` | work / artifact | info | 90d | **ADR-0008**:work 不强同步 WorkItem |
| `process.activity.failed` | governance | warning | 7y | |
| `process.activity.waiting_gate` | governance / conversation | notice | 7y | governance 自动 RaiseGate |
| `process.activity.resumed_from_gate` | (隐式)| info | 90d | |
| `process.activity.skipped` | (隐式)| info | 90d | Gateway 路由 |
| `process.activity.artifact_produced` | artifact / work | info | 90d | |
| `process.activity.auto_action_executed` | governance / work | notice | 7y | **ADR-0008**:AutoAction 留痕必须 |
| `process.stage.entered` | conversation / observability | info | 90d | |
| `process.stage.exited` | observability | info | 90d | |

### 5.5 governance 域(27 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `governance.gate.raised` | conversation / identity / process / work / method-library | notice | 7y | Gate 六段完整 |
| `governance.gate.moved_to_review` | (隐式)| info | 90d | |
| `governance.gate.evidence_attached` | (隐式)| info | 7y | |
| `governance.gate.vote_cast` | (隐式)| info | 7y | 多人决策留痕 |
| `governance.gate.decided` | **所有 L1 + method-library** | notice | 7y | 决策证据核心 |
| `governance.gate.expired` | process | warning | 7y | 超时 |
| `governance.gate.cancelled` | process | notice | 7y | |
| `governance.policy.drafted` | (隐式)| info | 90d | |
| `governance.policy.activated` | L2 runtime / capability-hub / process / work / method-library | notice | 7y | 规则下发 |
| `governance.policy.updated` | process / work / L2 runtime | notice | 7y | |
| `governance.policy.superseded` | L2 runtime / capability-hub | notice | 7y | |
| `governance.policy.retired` | L2 runtime / capability-hub | notice | 7y | |
| `governance.policy.propagation_lag` | observability | warning | 7y | 下发延迟告警 |
| `governance.policy.conflict` | observability | critical | 7y | 规则冲突告警 |
| `governance.control.declared` | observability | info | 7y | |
| `governance.control.implementation_updated` | (隐式)| info | 90d | |
| `governance.control.reviewed` | (隐式)| info | 7y | |
| `governance.control.review_overdue` | observability | warning | 7y | 审计告警 |
| `governance.control.violated` | observability / governance(nonconformity 自动触发)| critical | 7y | |
| `governance.nonconformity.raised` | observability | warning | 7y | |
| `governance.nonconformity.corrective_action_added` | observability | info | 7y | |
| `governance.nonconformity.resolved` | observability | notice | 7y | |
| `governance.nonconformity.closed` | observability | notice | 7y | |
| `governance.aiia.created` | artifact | info | 7y | 双身份,artifact 同步 |
| `governance.aiia.submitted_for_review` | conversation | notice | 7y | |
| `governance.aiia.approved` | artifact / work / archive | notice | 7y | |
| `governance.aiia.superseded` | artifact / work | notice | 7y | |
| `governance.soa.drafted` | (隐式)| info | 90d | |
| `governance.soa.published` | artifact / archive | notice | 7y | |
| `governance.soa.superseded` | artifact | notice | 7y | |

### 5.6 artifact 域(16 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `artifact.created` | (隐式)| info | 7y | |
| `artifact.content_updated` | (隐式)| info | 90d | |
| `artifact.reviewed` | governance | info | 7y | |
| `artifact.approved` | work / process / governance / identity | notice | 7y | 推进下游 |
| `artifact.baselined` | work / archive | notice | 7y | |
| `artifact.published` | archive / observability | notice | 7y | |
| `artifact.superseded` | (隐式)| notice | 7y | |
| `artifact.archived` | archive | notice | 7y | |
| `artifact.relation_added` | observability | info | 7y | 血缘图 |
| `artifact.quality_tags_updated` | observability | info | 7y | 25010 质量 |
| `baseline.created` | work | notice | 7y | |
| `baseline.superseded` | work / archive | notice | 7y | |
| `artifact.content_tampered` | governance / observability | critical | 7y | 严重审计 |
| `artifact.bias_evaluation_attached` | governance | info | 7y | Dataset 特化 |
| `artifact.work_product_kind.added` | method-library | notice | 7y | **新增**:受控词表新增,method-library 同步 |
| `artifact.work_product_kind.retired` | method-library | notice | 7y | **新增** |

### 5.7 method-library 域(17 事件)

| 事件 | 订阅方 | severity | 保留期 | 备注 |
|---|---|---|---|---|
| `method_library.content.drafted` | (隐式)| info | 90d | |
| `method_library.content.submitted_for_review` | governance | info | 90d | 可能触发 publish Gate |
| `method_library.content.published` | (按 kind 分发,见下)| notice | 3y | 父事件 |
| `method_library.content.deprecated` | (按 kind)| notice | 3y | |
| `method_library.content.retired` | (按 kind)| notice | 7y | |
| `method_library.content.superseded` | (按 kind)| notice | 3y | |
| `method_library.content.fingerprint_changed` | **所有持索引下游**(identity / process / artifact / governance)| warning | 7y | drift 防护核心 |
| `method_library.role_definition.published` | identity / member-images | notice | 3y | **ADR-0009** 同步 |
| `method_library.role_definition.capabilities_changed` | identity | warning | 3y | 重评存量 Member |
| `method_library.task_definition.published` | observability | info | 3y | |
| `method_library.work_product_definition.published` | artifact | notice | 3y | WorkProductKind 白名单 |
| `method_library.process_template.published` | process | notice | 3y | Template 索引同步 |
| `method_library.view_profile.published` | console / chat / mobile / marketplace / conversation / work | notice | 3y | **ADR-0009** UI 缓存失效 |
| `method_library.view_profile.deprecated` | console / chat / mobile / conversation | notice | 3y | UI 切降级 Profile |
| `method_library.view_profile.retired` | console / chat / mobile | notice | 7y | |
| `method_library.ai_policy.published` | governance / artifact | notice | 3y | 42001 §5.2 |
| `method_library.plugin.published` | marketplace | notice | 3y | |
| `method_library.plugin.deprecated` | marketplace / 下游订阅方 | notice | 3y | |
| `method_library.configuration.activated` | **所有 L1 + UI 仓** | notice | 3y | 组织方法集切换 |
| `method_library.configuration.superseded` | (隐式)| notice | 3y | |

---

## 六、跨域事件流要点(速查)

### 6.1 Gate decided 的全域扇出

`governance.gate.decided` 是**扇出最广的事件**,几乎所有 L1 域都订阅:

```
governance.gate.decided
    ├─→ process(kind=profile-activate / 唤醒 Activity waiting_gate)
    ├─→ work(kind=kickoff / archive-confirm)
    ├─→ identity(kind=member-lifecycle)
    ├─→ artifact(kind=baseline / release / archive)
    ├─→ method-library(kind=custom subkind=method-content-publish / plugin-publish)
    ├─→ conversation(在 related group 发决策 Turn)
    └─→ observability(审计链)
```

消费方按 `gate_kind` + `metadata` 路由。

### 6.2 method_library.content.fingerprint_changed 的 drift 传播

```
method_library.content.fingerprint_changed
    │
    ├─ 若 kind=RoleDefinition → identity 对比 spec_source.fingerprint → 不匹配发 identity.role.source_drift
    ├─ 若 kind=ProcessTemplateDef → process 对比 template 索引 → 不匹配发 process.template.source_drift
    ├─ 若 kind=WorkProductDefinition → artifact 对比
    ├─ 若 kind=AIPolicyDef → governance 对比
    └─ 若 kind=ViewProfile → UI 仓清缓存
```

### 6.3 生命周期级联

```
work.project.dissolved (GDPR 级,critical)
    └─→ conversation.group.archived(级联 + INV-7 24h 内必须完成)
    └─→ identity(所有 career_entry status=abandoned)
    └─→ archive(启动最终归档流程)
    └─→ member-service(所有相关容器 GracefulShutdown)
```

### 6.4 Gate 自动触发链

```
process.activity.waiting_gate(Runtime 调 TransitionToWaitGate)
    ↓
governance 订阅,自动 RaiseGate(按 ActivityDef.on_gate_trigger 规则)
    ↓
governance.gate.raised
    ↓
conversation 订阅,在 related group 发 gate-kind Turn
    ↓
用户 / Member 决策 → governance.DecideGate
    ↓
governance.gate.decided
    ↓
process 订阅,ResumeFromWaitGate → Activity 继续
```

---

## 七、维护纪律(Governance of This Catalog)

### 7.1 新增事件的流程

当某域需要新增一个事件时:

1. **先查本表**是否已有类似事件(避免重复造轮子)
2. **在本表对应域节 §5.X 追加事件行**(含订阅方、severity、保留期、备注)
3. **在域 README §4.1 事件清单同步登记**(字段 schema 落 §4.2)
4. **如有下游订阅,在下游域 README §4.3 订阅表同步登记**(双向对齐)
5. **提交时本表和各域 README 的变更放同一 commit**(避免 drift)

### 7.2 修改事件的流程

- 改**事件名**:视为 breaking change,必须经 breaking-change Gate(42001 §A.10);记录 supersede 关系
- 改**订阅方列表**:本表 + 下游域 §4.3 + bus-draft §6 三处同步
- 改 **severity / 保留期**:本表单点修改,通知 observability 和 archive 调整索引
- 改**字段 schema**:本表不承载字段 schema,去各域 README §4.2 修

### 7.3 废弃事件的流程

1. 标记为 `deprecated`(本表加 **(deprecated, since YYYY-MM)** 标注)
2. 保留至少 3 个月过渡期(下游订阅方迁移)
3. 迁移期结束后标记 `retired`,bus 拒绝新发布,已持久化的保留
4. 相关 drift 检测机制正常运作(不因废弃停)

### 7.4 drift 检测

定期运行 `scripts/event-consistency-check.py`(将来提供)对比:

- 域 README §4.1 声明的事件 vs 本表登记
- 域 README §4.3 订阅表 vs 本表的订阅方列
- bus-draft §6 订阅规则 vs 本表

任何不一致**立即告警**,阻塞 CI 通过。

### 7.5 与 proto / bus-draft 的引用链

```
event-catalog.md(本表,唯一真相)
    ↓ 引用
bus-draft/README.md §6 订阅契约(跨域规则)
    ↓ 生成
proto-draft/common/v1/events.proto(CloudEvent 包络)
    ↓ 派生
各域 proto/{domain}/v1/{domain}_events.proto(事件 type + schema)
    ↓ 编译
三语言 SDK binding(Rust / Python / TypeScript)
```

破坏这条链的任何改动**必须经 breaking-change Gate**。

---

## 八、事件数统计

| 域 | 事件数 | 备注 |
|---|---|---|
| identity | 17 | 含 4 个 audit 特殊事件 |
| conversation | 6 | 大部分事件走 UI 流,不在 L1 间 |
| work | 30 | 含 Project / ProjectMember / WorkItem / Iteration 四聚合 |
| process | 28 | 含 Template / Profile / Instance / Activity / Stage / Checkpoint |
| governance | 30 | 七聚合 + Policy 扩展 |
| artifact | 16 | 含 Baseline 子族 + work_product_kind |
| method-library | 20 | 含 Content / Plugin / Configuration + 按 kind 分发 |
| **总计** | **147** | 比初次扫描(125)多出 **22 个**(新增 5 + 完善标注) |

### 8.1 本表与 Step 1 矩阵差异的说明

Step 1 事件一致性矩阵扫出 125 个事件,本表登记 147 个,差异来源:

- **新增(+5)**:artifact.work_product_kind.added / .retired(补幽灵)/ identity.role.catalog_updated(补幽灵)/ identity.role.defined / .published / .deprecated / .retired(Role 生命周期族细化)
- **纠正(-2)**:原 `governance.profile.activated` 改为 `process.profile.activated`(漂移);原 `work.project.member_tool_scope_reevaluated` 合并到 `work.project.member_tool_scope_updated`(漂移)
- **补全(+14)**:identity.audit.* / conversation.*(原矩阵未全扫)/ artifact.content_updated 等

### 8.2 后续演进预期

段 3 实施阶段可能新增事件族:

- **ActivityDeviation 族**(ADR-0012,预计 8 个):`process.deviation.requested / recorded / detected_unreported / approved / rejected / resolved / invalidated / escalated`
- **change-request Gate kind**(ADR-0012):实际复用 `governance.gate.*`,不新增事件
- **capability-hub 域**(L3,未来):`capability_hub.tool.registered / retired / quota_exceeded / denied` 等
- **archive / observability 横切域**:归档完成 / 审计链异常等

预计段 3 末本表会扩到 **170-180 个事件**。

---

## 九、参考

- `architecture/bus-draft/README.md`(bus 机制与订阅契约)
- `architecture/proto-draft/common/v1/events.proto`(CloudEvent 1.0 包络)
- `product/六域模型.md` §2.2 跨域通信规则
- 七域 README §4 事件章节
- 相关 ADR:0008(completion_policy)/ 0009(ViewProfile)/ 0010(Template 刚度)/ 0011(流程嵌套)
- Step 1 扫描脚本:`/tmp/qtl-bus/extract.py`(生成矩阵)

---

> **版本历史**
>
> - 2026-05-10 首版:基于七域 README + 4 份 ADR + bus-draft,修正 5 个命名漂移,补齐下游订阅表,登记 147 个事件
> - 下次更新:段 3 起草 ADR-0012(Deviation)时
