# Deviation 机制讨论笔记(ADR-0012 未来起草的输入)

> **定位**:本文件**不是 ADR**,是**段 3 实施阶段起草 ADR-0012 时的参考笔记**。
>
> **存档理由**:2026-05-10 围绕 Template 刚度分层(ADR-0010)开展了一次深入讨论,推演出 Deviation 机制的 8 个关键决策点(Q1~Q8)。但讨论**过度超前于段 2 目标**(段 2 是设计文档阶段,非代码实施),且**缺乏实际场景验证**。为避免在段 2 锁定未经验证的细节,决定:
>
> - **不**正式写 ADR-0012
> - **ADR-0010 / 0011 保持 Proposed 状态**,不转 Accepted
> - 把讨论结论**完整存档**到本文件,永久保留
> - 待段 3 实施 process 仓时,以本文件为起草 ADR-0012 的输入,**结合实际代码场景**再决定细节是否调整
>
> **讨论日期**:2026-05-10
> **参与者**:Aris + Claude
> **上下文**:ADR-0010(Template 刚度分层 · Proposed)/ ADR-0011(流程嵌套机制 · Proposed)

---

## 一、背景:为什么会开启 Deviation 讨论

### 讨论起点

Aris 问 **"Template 是否是固定的 还是只是范式 指导其他流程的 并不完全按照他们的流程进行"**。

从这个问题推出:Template 应该是范式,不是剧本,允许偏离。

### 推出 ADR-0010

基于"范式 vs 剧本"判断,写了 ADR-0010(Template 刚度分层):
- STRICT 剧本级 —— 偏离要批准
- GUIDED 范式级 —— 偏离要留痕
- ADVISORY 建议级 —— 不追踪

**ADR-0010 的 GUIDED 模式价值依赖"偏离留痕"机制**,但 ADR-0010 只是占位说"留给后续 ADR-00ZZ 具体化"。

### 讨论 Deviation 的原因

**不是为了 Deviation 本身**,而是**让 ADR-0010 的 GUIDED 模式能落地**:

1. ADR-0010 承诺"偏离允许但留痕" —— 需要结构化载体
2. "留痕"必须是一等对象、可审计 —— 就是 Deviation
3. STRICT 下"偏离要走 change-request Gate" —— 需要 Deviation 作为 Gate 的请求载体
4. 嵌套场景(ADR-0011)"SubProcess 内部允许 Deviation"不能是空话

---

## 二、Deviation 是什么(标准来源)

**Deviation = "实际发生的步骤 与 Template 规定的步骤 之间的差异",记录为一等对象**。

最直白的例子:Template 规定 A → B → C,但团队实际跑成 A → C(跳过 B)。这个"跳过 B"就是一次 Deviation。

### 标准来源(不是我们发明的)

| 标准 | 对应概念 |
|---|---|
| **ISO 9001:2015 §8.7** 不合格输出的控制 | `deviation`(偏离过程)+ `nonconformity`(不合格输出) |
| **ISO/IEC/IEEE 24748-2** Tailoring Records | `Reduction` / `Extension` / `Adaptation` 三类裁剪记录,即 Deviation |
| **CMMI** CM / PPQA | `Deviation Approval` 机制 |
| **ISO 42001 §A.6** Operation | AI 运行时偏离预期行为的监控响应 |
| **BPMN 2.0**(间接) | 通过 Compensation / Error Event 处理偏离,但没有"记录层" |
| **GMP / FAA 药品航空业** | 完整的 Deviation Management System,分 Planned / Unplanned + Critical / Major / Minor |

### 对应关系速查

```
我们的 Deviation                对应标准
────────────────────────────    ──────────────────────────
跳过 Activity                    24748-2 Reduction
插入 Activity                    24748-2 Extension
调整 Activity 参数                24748-2 Adaptation
STRICT 下的 change-request       9001 §8.7 / CMMI Deviation Approval
GUIDED 下的留痕                   9001 §9.2(内部审核证据)
严重 Deviation 升级 Nonconformity 9001 §10.2
运行时偏离监控                    42001 §A.6 Operation
```

**结论**:Deviation 是标准概念。我们的工作是**把分散在多个标准里的偏离机制统一到一个数据模型里**。

### 和已有相近概念的区分

| 概念 | 定位 | 何时用 |
|---|---|---|
| **Deviation**(本文) | 执行路径偏离 Template | 每次跳步 / 改顺序 / 绕过规则 |
| **Nonconformity**(governance) | 输出不合格 | Artifact 质量不达标 / Gate 决策违规 |
| **change-request Gate**(待定) | 偏离的"批准动作" | STRICT 下 Deviation 触发 |
| **Tailoring Decision**(process.Profile) | Template 的裁剪规则 | Profile 活化前的静态裁剪 |

**关键区别**:Tailoring 是**静态事前裁剪**(Profile 活化前决定好),Deviation 是**运行时动态偏离**(Instance 跑起来后发生)。

---

## 三、Q1~Q8 讨论结论

### Q1. 什么算"偏离"(DeviationType)

**结论**:初步梳理出 6 种 DeviationType,但**数量不锁定**,实施阶段按需扩展。

```
DeviationType = enum {
    reduction,                  // 跳过 Template 定义的 Activity
    extension,                  // 加入 Template 未定义的 Activity
    adaptation,                 // 调整 Activity 参数 / 输入 / 输出(不跳不加,但改)
    order_swap,                 // 调整 Activity 执行顺序
    completion_policy_bypass,   // 绕过 Activity 的 completion_policy 规则(ADR-0008)
    lifecycle_skip,             // 跳过状态机的中间态(如直接 in_progress → completed,没走 review)
}
```

**边界判据**:
- Template 里有没有预定义这种情况?有 → 按定义走,不算偏离;没有 → 算偏离。
- 对应的:Gateway / timeout / retry 的预定义分支**不是**偏离;completion_policy 的四种策略里 `auto_complete` 的正常行为**不是**偏离。

**待实施阶段验证**:6 种是否够?还是要合并 / 拆分?

---

### Q2. 谁发起 Deviation

**结论**:5 种可能发起方,只有 **3 类** 产生 Deviation 对象。

| 发起方 | 是 Deviation 吗 | 理由 |
|---|---|---|
| **1. AI Member 自发** | ✅ 是,核心场景 | Runtime 偏离 Template 是 Deviation 对象最典型的用途 |
| **2. 用户手动** | ✅ 是 | 用户显式跳步就是偏离 |
| **3. 系统自动**(Gateway / timeout / retry) | ❌ 不是 | Template 预定义分支 |
| **4. 外部事件** | ⚠️ 看情况 | 走 Template 未定义路径 → 是;走 boundary event → 不是 |
| **5. 模板作者修改** | ❌ 不是 | Template 演进,走 supersede 流程 |

### 权限差异(按刚度)

**Type A · AI Member 发起**:
- STRICT → 禁止,必须先 change-request Gate
- GUIDED → 允许,`autonomy_level ≥ 3` + reasoning_trace 写明 + 发 `process.deviation.detected` 事件
- ADVISORY → 不追踪

**Type B · 用户发起**:
- STRICT → 禁止,必须 change-request Gate(admin 也不行)
- GUIDED → 项目 owner / tech-lead 可手动,留 Deviation
- ADVISORY → 随意

**Type C · 外部事件发起**:
- 仅当跨域事件明确宣告"导致流程偏离"才记 Deviation
- initiator 标注为触发事件的来源域

---

### Q3. Deviation 归哪个域

**结论**:**归 process 域**(第 4 个聚合根,与 Template / Profile / Instance 并列)+ 双向跨域协作。

**理由**:
- 语义重心在"执行差异",不在"决策"或"记录"
- 产生位置、关联字段、主要消费方都在 process

### 跨域协作

| 域 | 角色 |
|---|---|
| **process** | 产生 Deviation + 维护生命周期 + 发事件 |
| **governance** | 订阅 `process.deviation.*`,按刚度 + 严重度决定是否起 change-request Gate;严重 Deviation 升级 Nonconformity |
| **observability** | 订阅所有 Deviation 事件,纯记录进审计日志链 |
| **work** | 订阅,若 Deviation 影响 related_workitems 触发 WorkItem 状态变化 |

### 关键跨域字段

```
Deviation {
    ...
    related_gate_id:           Option<GateRef>,           // STRICT 下的 change-request Gate
    escalated_nonconformity_id: Option<NonconformityRef>, // 升级到 governance 的不合格
    ...
}
```

---

### Q4. STRICT 下"批准后才能继续"的流程

**结论**:采用**方案 A · Deviation 对象先行 → Gate 二阶段**。

### 流程

```
[实际偏离发生或 AI/用户请求偏离]
        ↓
[process 创建 Deviation 对象,state=pending]
        ↓
[发 process.deviation.requested 事件]
        ↓
[governance 订阅,自动 RaiseGate(kind=change-request)]
        ↓
[Gate 六段式决策]
        ↓
  ├─ approve → Deviation.state=approved → Activity 允许偏离路径继续
  └─ reject  → Deviation.state=rejected → Activity 回到 Template 原路径
```

### 状态机

```
Deviation.state:
  pending         ← STRICT 下等 Gate
  recorded        ← GUIDED 下直接留痕(见 Q5)
  approved        ← STRICT 下 Gate 批准
  rejected        ← STRICT 下 Gate 拒绝(记录保留)
  resolved        ← Deviation 所引用的 Activity 已完成,状态终结
  invalidated     ← 作废(Q6)
```

### 关键不变量

- `state=pending` 期间,Activity 处于 waiting_gate
- `state=rejected` 时 Deviation 记录**保留不删**(审计用)
- `state` 只能正向转移,回滚必须通过新 Deviation 承接

---

### Q5. GUIDED 下"留痕但不起 Gate"的触发时机

**结论**:**主路径机制 A(主动上报)+ 保底机制 B(引擎扫描)**,不采用机制 C(事后对比)。

### 主路径:主动上报

- AI Runtime 偏离前**必须**调 `process.ReportDeviation`,Runtime SDK 层强制
- 用户在 Console / Chat 点"跳过此步"时 UI 调同一接口
- Deviation.state=recorded(GUIDED 不走 Gate)
- 发 `process.deviation.recorded` 事件

### 保底:引擎扫描

- 每轮 Checkpoint 写入时对比"实际路径 vs Template 预期路径"
- 发现漏报 → 引擎自动创建 `state=detected_unreported` 的 Deviation
- 告警给 project owner(`process.deviation.unreported_detected`)
- **不影响热路径性能**(随 Checkpoint 节奏)

### 不采用机制 C 的理由

- 延迟大,偏离已发生才记录
- 无法捕获"过程中"的偏离
- 严重偏离可能已造成影响再被记录

---

### Q6. Deviation 的"可取消"?

**结论**:**严格不可撤销 + invalidated 机制**。

### 规则

- Deviation 一旦写入**永久保留**,核心字段不可修改
- 新增 `state=invalidated`:标记为无效(不删除、不物理擦除)
- 作废必须有 `invalidated_by` + `invalidated_reason` + 审批证据(`invalidation_gate_id` 或 actor 权限)

### 理由

- 三红线第 1 条:可审计性
- 对齐 9001 §8.7 记录保留
- 对齐 Append-only 审计原则

### UI 默认行为

- 默认筛出 `state=invalidated` 的记录
- 审计视图显示全部,带作废标注

---

### Q7. 跨嵌套的 Deviation

**结论**:**双向引用** + **就近刚度原则**。

### 归属(问题 1)

- Deviation 归**实际发生的 Instance**(子 Instance 的偏离属于子)
- 支持向上聚合查询:

```
Deviation {
    ...
    instance_id:          InstanceId,       // 实际发生的 Instance
    parent_instance_refs: Vec<InstanceId>,  // 向上路径(最后一个是 root)
    root_instance_id:     InstanceId,       // 冗余字段便查询
    root_trace_id:        TraceId,          // 和 ADR-0011 对齐
    ...
}

Instance {
    ...
    child_deviations_summary: {
        direct_count:   i32,        // 本 Instance 直接的 Deviation 数
        nested_count:   i32,        // 含子 Instance 的累计
        critical_count: i32,        // 严重偏离数
        major_count:    i32,
    }
    ...
}
```

### 刚度应用(问题 2)

**就近原则**:
- SubProcess 内部偏离 → 应用**父 Template 刚度**(同 Instance 同 Template)
- CallActivity 子 Instance 内部偏离 → 应用**子 Template 刚度**
- 被 `child_rigidity_override`(ADR-0011)覆盖时按覆盖后的
- CallActivity 触发本身(父 Template 的调用语义偏离)→ 应用父刚度

---

### Q8. Deviation 和 completion_policy 的关系

**结论**:**三种场景明确区分**。

### 场景 1:AutoAction 执行**不是** Deviation

- Template 作者在 `completion_policy=try_auto_then_gate` 里**明确声明了 AutoAction 行为**
- 和 Gateway 的 condition 分支性质相同
- AutoAction 执行发 `process.activity.auto_action_executed` 事件(ADR-0008 INV-42 已有),**不需要额外 Deviation**

### 场景 2:绕过 completion_policy **是** Deviation

- AI Runtime 绕过 completion_policy 直接 complete → Deviation(type=completion_policy_bypass)
- STRICT → change-request Gate
- GUIDED → Deviation recorded + reasoning_trace 写明
- ADVISORY → 不追踪

### 场景 3:Gate 冲突的处理顺序

**change-request Gate 优先于 completion_policy 的 Gate**:

```
STRICT 模式:
  1. process 创建 Deviation(state=pending)
  2. governance 起 change-request Gate(阻塞 Activity)
  3. change-request Gate 决策:
     ├─ approve → 跳过 completion_policy(因为偏离已批准)→ Activity complete
     └─ reject  → 回到 Template 原路径 → 正常触发 completion_policy 的 quality-gate

GUIDED 模式:
  1. Deviation recorded(不起 change-request Gate)
  2. completion_policy 如果是 raise_gate → 正常起 quality-gate
     (GUIDED 下偏离不需要事前批准,但 completion_policy 的业务判据仍要走)
```

**理由**:
- change-request 是"元问题":能不能偏离?
- quality-gate 是"业务问题":质量达标吗?
- 偏离被批准 → completion_policy 本身就被跳过了,quality-gate 不再必起
- 偏离被拒绝 → 回到原路径,quality-gate 正常触发

**关键不变量**:

**INV-DEV-X(占位)** STRICT 模式下,Deviation.state=pending 期间,Activity 的 completion_policy 暂不触发;Deviation 决策后按决策结果决定 completion_policy 是否执行。

---

## 四、讨论中推演出的最小字段集(供参考)

基于 Q1~Q8,推演出的 Deviation 聚合根最小字段如下。**段 3 实施时按实际需要调整**:

```
Deviation {
    // 标识
    deviation_id:               ULID,
    instance_id:                InstanceId,       // 实际发生的 Instance

    // 嵌套(Q7)
    parent_instance_refs:       Vec<InstanceId>,  // 向上路径
    root_instance_id:           InstanceId,
    root_trace_id:              TraceId,

    // 分类(Q1)
    deviation_type:             DeviationType,    // 6 种之一
    severity:                   Severity,         // critical / major / minor(参考 GMP)

    // 关联
    activity_id:                Option<ActivityId>,        // 涉及的 Activity
    template_path:              StepRef,                   // Template 定义的应走路径
    actual_path:                ActualPath,                // 实际跑出来的路径
    related_workitems:          Vec<WorkItemRef>,          // 若影响 WorkItem

    // 发起(Q2)
    initiator_type:             enum { ai_member / user / external_event },
    initiator_ref:              ActorRef,
    rigidity_at_time:           RigidityLevel,             // 发生时的刚度(用于事后审计)

    // 状态机(Q4 / Q6)
    state:                      DeviationState,
    // DeviationState:
    //   pending               ← STRICT 下等 Gate
    //   recorded              ← GUIDED 下主动上报
    //   detected_unreported   ← GUIDED 下引擎扫描发现漏报(Q5)
    //   approved              ← STRICT Gate 批准
    //   rejected              ← STRICT Gate 拒绝
    //   resolved              ← Activity 已完结,状态终态
    //   invalidated           ← 作废(Q6)

    // 决策与跨域(Q3 / Q4)
    related_gate_id:            Option<GateRef>,
    escalated_nonconformity_id: Option<NonconformityRef>,

    // 作废(Q6)
    invalidated_by:             Option<ActorRef>,
    invalidated_reason:         Option<String>,
    invalidation_gate_id:       Option<GateRef>,

    // 偏离原因
    reason:                     String,
    reasoning_trace_ref:        Option<TraceRef>,          // 关联 AI reasoning

    // 审计
    recorded_at:                Timestamp,
    resolved_at:                Option<Timestamp>,
    trace_id:                   TraceId,
    audit_log_ref:              AuditLogRef,
    version:                    u64,
}
```

---

## 五、待段 3 起草 ADR-0012 时的"前置问题"清单

以下问题在段 2 讨论中**未收敛**或**缺乏实际场景验证**,段 3 起草 ADR-0012 时必须回答:

### 5.1 DeviationType 的实际粒度

6 种够用吗?还是实施时遇到的场景会挑战分类?

- 观察点:process 仓第一次跑 GUIDED 模式时,看 Runtime / 用户的实际偏离属于哪几类
- 验证方式:至少跑通 3 个 GUIDED Template(如 agile-scrum / iterative-standard / evolutionary-discovery),统计实际 DeviationType 分布

### 5.2 主动上报机制的 SDK 层实现

Q5 要求"AI Runtime 偏离前必须调 `process.ReportDeviation`,Runtime SDK 层强制"。**具体怎么强制**?

- 候选 A:SDK 拦截所有 Activity 转移调用,检测到偏离自动调用 ReportDeviation
- 候选 B:Runtime 的 ReAct 循环里加"偏离检查"步骤,LLM 必须声明
- 候选 C:两者结合

### 5.3 引擎扫描的算法

Q5 的"保底机制 B"要求引擎在每轮 Checkpoint 对比路径。**具体算法**?

- Template 预期路径的表示:AST? 图? 符号?
- 实际路径的记录:Activity 状态机日志?Checkpoint 链?
- 对比策略:严格匹配?容忍乱序?

### 5.4 跨 Instance 的 Deviation 聚合查询

Q7 的 `child_deviations_summary` 冗余字段如何维护一致性?

- 候选 A:事件驱动,每次子 Instance Deviation 事件父 Instance 异步更新
- 候选 B:查询时计算(昂贵但准确)
- 候选 C:混合(热数据事件同步 + 冷数据查询计算)

### 5.5 Deviation 对 completion_policy 的"暂停"机制

Q8 的 INV-DEV-X 要求"STRICT 下 pending 期间暂停 completion_policy"。**引擎如何实现**?

- 这涉及 Activity 状态机的"嵌套挂起"(本来 waiting_gate,现在又 waiting_deviation_gate)
- Checkpoint 结构可能要扩展

### 5.6 Deviation 事件清单

完整事件列表(起草 ADR 时对齐):

```
process.deviation.requested          (STRICT 下初始请求)
process.deviation.recorded           (GUIDED 下主动上报)
process.deviation.detected_unreported (GUIDED 下引擎扫描)
process.deviation.approved           (Gate 批准)
process.deviation.rejected           (Gate 拒绝)
process.deviation.resolved           (Activity 完结)
process.deviation.invalidated        (作废)
process.deviation.escalated          (升级为 Nonconformity)
```

### 5.7 不变量完整清单

Q1~Q8 讨论出的占位不变量,起草时需系统化为 INV-DEV-1..N:

- INV-DEV-1 Deviation 永不物理删除(Q6)
- INV-DEV-2 核心字段 published 后不可修改
- INV-DEV-3 STRICT 下 Deviation pending 时 Activity 处于 waiting_gate
- INV-DEV-4 STRICT 下 Deviation pending 时 completion_policy 暂停(Q8)
- INV-DEV-5 GUIDED 下 AI Member 发起 Deviation 要求 autonomy_level ≥ 3
- INV-DEV-6 Deviation 归发生 Instance,parent_instance_refs 向上聚合
- INV-DEV-7 Deviation.state 单向转移,作废通过 invalidated 状态而非删除
- INV-DEV-8 跨嵌套 Deviation 严重度向上累计
- ... 等

### 5.8 process README 订正范围

段 3 起草 ADR-0012 并接受后,需要订正:

- `domain/process/README.md` §2 新增 §2.7 Deviation 聚合根(200+ 行)
- `domain/process/README.md` §4 事件清单补 8 个 deviation 事件
- `domain/process/README.md` §5 持久化补 deviations 表
- `domain/governance/README.md` §2.1.2 正式化 change-request kind(或保持 custom + subkind)
- `domain/governance/README.md` §4 订阅 Deviation 事件
- `architecture/proto-draft/process/v1/process_service.proto` 增加 Deviation 相关 message
- `architecture/proto-draft/governance/v1/governance_service.proto` change-request 请求结构
- `ADR-0007` CheckpointState 扩展(Deviation 暂停状态字段)
- `ADR-0010 / ADR-0011` 的相关占位更新为"由 ADR-0012 决策"

**预估订正规模**:300-500 行跨多个文件。

---

## 六、不现在落地的完整理由

### 6.1 段 2 定位

段 2 是"设计文档阶段",不是"代码实施前所有决策都锁定"。ADR-0010 / 0011 以 Proposed 存在完全合法。

### 6.2 Deviation 的正确性需要实际场景验证

Q1~Q8 的推演没办法确信:
- 6 种 DeviationType 覆盖了所有场景吗?
- Q5 的双机制在实际 Runtime 里能不能稳定运行?
- Q8 的 Gate 冲突顺序,在真实流程跑过一次才能验证

**这些判断没有实际案例支撑**。段 2 下笔锁定,段 3 实施时发现不对要改 ADR,成本更高。

### 6.3 现在做会触发大规模连锁订正

ADR-0012 一旦 Accepted,要连带订正 300-500 行跨多个文件。如果未来改 Deviation 设计,这些订正都要再改一遍。

### 6.4 ADR-0010 / 0011 保 Proposed 不影响其他工作

- 段 2 其他设计文档可以继续推进
- 下游仓 README(repo-readmes-draft)可以继续对齐
- 段 3 实施时自然会触发 ADR-0012 起草

---

## 七、段 3 起草 ADR-0012 的推荐流程

当段 3 process 仓实施到"需要 GUIDED 模式支持"时,触发本 ADR 起草。推荐流程:

### 步骤 1:加载本笔记作为输入

- 读 `architecture/adr/drafts/0012-deviation-discussion-notes.md`(本文件)
- 读 `architecture/adr/0010-template-rigidity-levels.md`(Proposed 状态,含 Deviation 占位)
- 读 `architecture/adr/0011-process-nesting.md`(Proposed 状态,含嵌套场景)

### 步骤 2:实际场景核对

在 process 仓找 2-3 个真实 Scenario(如 agile-scrum 的 Sprint Planning 偏离、瀑布的设计评审跳步),看 Q1~Q8 的结论是否合理。

### 步骤 3:对"前置问题清单"逐一回答

§5.1 ~ §5.7 的 7 个问题必须有答案,否则 ADR-0012 不完整。

### 步骤 4:起草 ADR-0012

按本笔记的字段集和状态机为起点,结合实际场景验证后的修正,起草正式 ADR。

### 步骤 5:ADR-0010 / 0011 转 Accepted

ADR-0012 Accepted 后,ADR-0010 / 0011 的 Deviation 占位指向 ADR-0012,状态改 Accepted。

### 步骤 6:配套订正

按 §5.8 清单订正各文档和 proto。

---

## 八、讨论过程的元信息

### 讨论中识别的"过度设计"迹象

回顾 Q1~Q8 推演,8 次中 Aris 实质参与只有 2 次(Q2 的类型 + Q8 要求重发),其他 6 次基本是单向推演 + "同意"。

这提示**推演颗粒度已超过当前决策所需**。段 2 需要的是"方向声明",不是"全部细节锁定"。

### 记录本笔记的价值

1. **不浪费已有推演** —— Q1~Q8 的思考保留,段 3 起草时不用从零开始
2. **避免未经验证的过早锁定** —— 段 2 不写 ADR-0012,留灵活度
3. **建立"讨论笔记 vs 正式 ADR"的区分** —— drafts/ 目录的首次使用,后续类似场景复用此模式

### 本笔记的维护纪律

- 本文件可以增补(段 3 起草 ADR-0012 前有新讨论可追加)
- 一旦 ADR-0012 Accepted,本文件**转归档,不再修改**(留作历史记录)
- 本文件不算"决策文档",不参与 architecture/ 正规索引

---

## 九、参考文献

### 本次讨论涉及的 ADR
- `architecture/adr/0007-checkpoint-persistence-in-process.md`(Checkpoint)
- `architecture/adr/0008-activity-completion-policy.md`(completion_policy)
- `architecture/adr/0010-template-rigidity-levels.md`(刚度分层,Proposed,Deviation 占位)
- `architecture/adr/0011-process-nesting.md`(嵌套机制,Proposed)

### 讨论中涉及的标准
- `methodology/standards-discussion/ISO-9001.md`(§8.7 不合格输出 / §9.2 内部审核 / §10.2 不合格升级)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(Tailoring Records)
- `methodology/standards-discussion/ISO-42001.md`(§A.6 Operation)
- `methodology/standards-discussion/BPMN-2.0.md`(Compensation / Error Event)
- `methodology/standards-discussion/CMMI-DEV.md`(Deviation Approval)

### 讨论中涉及的域文档
- `domain/process/README.md`(§2 聚合根 / §4 事件 / §5 持久化)
- `domain/governance/README.md`(§2.1 Gate kind / §4 事件订阅)
- `domain/method-library/README.md`(§2.5 ProcessTemplateDef)
- `domain/work/README.md`(§4.3 跨域事件订阅)

---

> **状态**:**讨论笔记(非 ADR)**,供段 3 起草 ADR-0012 时参考
> **最后更新**:2026-05-10
> **后续触发条件**:段 3 process 仓实施到"需要 GUIDED 模式支持"时,起草 ADR-0012
