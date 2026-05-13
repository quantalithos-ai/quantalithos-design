# ADR-0008:Activity.completion_policy 配置化 + WorkItem 状态独立

> Status: **Accepted**  
> Date: 2026-05-09  
> Deciders: Aris  
> Consulted: `domain/process/README.md` §2.4 + §十一.3 / `domain/work/README.md` §2.4 + §4.3 / `domain/governance/README.md` §2.1.2 / `product/六域模型.md` §5.6  
> Informed: process 仓 / work 仓 / governance 仓 / method-library 仓  

---

## 1. 背景

Activity(来自 BPMN 2.0 流程模型)和 WorkItem(来自 Scrum/Kanban 业务模型)**来自不同国际标准,本就是两套状态机**:

- **Activity 状态机**(BPMN 2.0):scheduled → in_progress → waiting_gate ↔ in_progress → completed
- **WorkItem 状态机**(Scrum):todo → in_progress → in_review / blocked → done

两者通过 `Activity.related_workitems` 弱绑定(`六域模型.md` §5.6),**但没有明确"一方状态变更时另一方怎么办"的规则**。实际场景里这会导致边界模糊:

### 1.1 典型冲突场景

一个 Activity(如"代码实施阶段")关联 3 个 WorkItem:
- WorkItem-1 `done`
- WorkItem-2 卡在 `in_review`
- WorkItem-3 `blocked`

Activity 的 Runtime 认为自己"该做的都做了"想 complete。此时:
- **若强制对齐**:Activity 必须等 3 个都 done 才能 complete → 流程被业务细节卡住
- **若完全独立**:Activity completed 了但业务还没完,项目进度看板误导
- **若硬编码某种策略**:所有模板一刀切,失去 BPMN 的灵活性

### 1.2 既往讨论

在 `domain/process/README.md` §2.4 中,Activity 状态机仅描述流程侧语义,未回答"completed 时 related_workitems 如何处理";在 `domain/work/README.md` §4.3 仅一行"若 Activity 关联 WorkItem,检查是否可转 done",机制不完整。

需要一个正式决策锁定两者关系,并给过程模板作者留出配置空间。

---

## 2. 决策

**采用"配置化 + 独立状态机 + AutoAction 默认禁止 + 复用已有 Gate kind"组合方案**:

### 2.1 两套状态机严格独立

- **WorkItem 是业务事实的唯一真相**:项目完成的判据、看板展示、验收依据,**全部以 WorkItem 为准**
- **Activity.state=completed 不等于 related_workitems 全部 done**:Activity completed 仅表示"流程规定的 Runtime 执行动作已完成"
- **项目完成判据**:所有 WorkItem 状态达到 done / cancelled,与 Instance 是否 completed 分开判断

### 2.2 ActivityDef 新增 completion_policy 字段

在 ProcessTemplate 的 ActivityDef(method-library 里 SPEM Method Content 定义的一部分)加一个字段:

```
ActivityDef {
    activity_id:             String,
    name:                    String,
    kind:                    BPMNActivityKind,
    assignable_roles:        Vec<RoleRef>,
    inputs:                  Vec<ArtifactInputSpec>,
    outputs:                 Vec<ArtifactOutputSpec>,
    timeout:                 Option<Duration>,
    retry_policy:            RetryPolicy,
    on_gate_trigger:         Option<GateRequirementRef>,
    completion_policy:       CompletionPolicy,         // ← 新增
}
```

### 2.3 CompletionPolicy 四种策略

```
CompletionPolicy = oneof {
    // 策略 A:纯流程节点,与 WorkItem 无关(默认)
    auto_complete {},

    // 策略 B:强制等 WorkItem 全部 done 才能 complete Activity
    enforce_workitems_done {
        on_incomplete:   BlockBehavior,         // block / wait
        wait_timeout:    Option<Duration>,
        on_timeout:      enum { raise_gate / fail_activity },
    },

    // 策略 C:Activity 想 complete 时必起 Gate 让人决策
    raise_gate {
        gate_kind:       GateKind,              // 必须是已有 kind(见 2.5)
        evidence:        EvidenceRequirementSpec,
        decision_maker:  DecisionMakerSpec,
        autonomy_level:  AutonomyLevel,
    },

    // 策略 D:先尝试 AutoAction,处理不了再起 Gate
    try_auto_then_gate {
        auto_actions:          Vec<AutoActionSpec>,     // 见 2.4
        required_autonomy_level: AutonomyLevel,         // 至少需要的授权级别
        on_unhandled:          GateRequirementSpec,     // 兜底 Gate
    },
}
```
### 2.4 AutoAction 类型与授权机制

```
AutoActionSpec = oneof {
    // 把未完成的 WorkItem 延迟到下一迭代
    defer_to_next_iteration {
        apply_to_state:   Vec<WorkItemState>,         // 如 ["blocked", "in_review"]
    },

    // 降低 WorkItem 优先级
    reduce_priority {
        apply_to_state:   Vec<WorkItemState>,
        target_priority:  Priority,
    },

    // 拆分未完成的 WorkItem 为新任务
    split_off_incomplete {
        apply_to_state:   Vec<WorkItemState>,
        new_workitem_kind: WorkItemKind,
    },

    // 把 WorkItem 标记为 spillover(Scrum 术语:溢出到下迭代)
    mark_as_spillover {
        apply_to_state:   Vec<WorkItemState>,
    },
}
```

**授权规则(关键安全约束)**:

- **AutoAction 默认禁止**,即使 ActivityDef 里声明了 `try_auto_then_gate` 也不自动执行
- **启用必须由 Policy 明示授权**,复用 governance 已有的 `autonomy_level` 机制(`domain/governance/README.md` INV-5)
- 运行时检查:当前 Project × 当前 ActivityDef 的有效 autonomy_level 必须 ≥ `required_autonomy_level`;否则 **AutoAction 静默退化为 raise_gate**(走 `on_unhandled`)
- 每次 AutoAction 执行必须发 `process.activity.auto_action_executed` 事件,audit_trail 留痕(三红线第 1 条:可审计性)

### 2.5 Gate kind 复用(不新增 stage-exit)

原曾考虑新增 `stage-exit` 专用 kind 处理 Activity-WorkItem 不一致,**本 ADR 否决该方案**。改用已有 kind:

| 使用场景 | 复用 kind | 来源 |
|---|---|---|
| 质量维度评估(NFR / 25010 未达标 / 代码评审未通过)| `quality-gate` | `governance` §2.1.2 |
| 多个可选路径需要人类选择(如延迟 vs 拆分)| `design-choice` | `governance` §2.1.2 |
| 阶段到发布边界的最终人类确认 | `release-confirm` | `governance` §2.1.2 |

**理由**:
- `quality-gate` 语义已覆盖"未达验收标准"这一最常见场景
- `design-choice` 天然适合"有多个处理候选"的决策结构
- 保持 10 种用户可见 kind 的稳定,避免 kind 膨胀(YAGNI)
- Gate 的"六段完整性"不依赖 kind 差异,差别在 metadata 上承载

### 2.6 运行时流程

```
[Activity Runtime 完成主任务,请求 CompleteActivity]
    │
    ▼
process 引擎读 ActivityDef.completion_policy
    │
    ├─ auto_complete        → 直接 state=completed,推进下一 Activity
    │
    ├─ enforce_workitems_done
    │    └─ 查 related_workitems
    │       ├─ 全 done → state=completed
    │       └─ 有未 done → state 保留 in_progress,等 work.workitem.state_changed
    │                         事件驱动重新判定;超时按 on_timeout 处理
    │
    ├─ raise_gate
    │    └─ 必起 Gate(复用已有 kind),Activity.state=waiting_gate
    │       等 governance.gate.decided 再恢复
    │
    └─ try_auto_then_gate
         ├─ 查 Policy 的有效 autonomy_level
         ├─ 级别足够 → 执行 auto_actions(每步留痕)
         │             执行后再查 related_workitems:
         │             ├─ 全部处理干净 → state=completed
         │             └─ 仍有处理不了的 → 起 on_unhandled Gate
         └─ 级别不足 → 直接起 on_unhandled Gate(退化)
```
---

## 3. 理由

### 3.1 为什么两套状态机严格独立

- **标准分层**:Activity 来自 BPMN 2.0(流程引擎语义),WorkItem 来自 Scrum/Kanban(业务实务),强行同步等于让 BPMN 引擎去理解 Scrum 术语,破坏标准对齐
- **现实类比**:真实工单系统里,"开发阶段结束"不等于"所有工单关闭" —— 把流程节点当业务真相是常见的"技术驱动误用"
- **可裁剪性**(三红线第 3 条):不同组织对 Activity 和 WorkItem 的关系预期不同,硬编码一种关系就等于反裁剪

### 3.2 为什么 WorkItem 是业务真相而非 Activity

- 看板展示的是 WorkItem,用户问"Bug 修了没"查的是 WorkItem
- 项目验收的依据是 WorkItem 完成度,不是 Activity 执行完毕
- Activity 可能被模板作者拆得很细(10 个小步骤)或很粗(1 个大阶段),粒度不稳定,不能作为进度真相
- WorkItem 的状态机更少(7 态 vs Activity 近 10 态),粒度更贴近业务语言

### 3.3 为什么配置化而非硬编码

- **BPMN 模板家族有 8 种**(瀑布/V 模型/迭代/敏捷/...),不同家族对"Activity 完成"的含义不同
- 瀑布模型倾向 `enforce_workitems_done`,敏捷模型倾向 `auto_complete`(迭代边界处理 spillover)
- 硬编码等于绑死一种方法论,违反 SPEM Method Library 的可插拔精神

### 3.4 为什么 AutoAction 默认禁止

- **三红线第 1 条**(可审计性):任何自动动作必须留痕且可审计
- **Research 安全原则**:自动绕过决策点是高风险动作,默认偏向保守
- **产品叙事§3.5**:关键节点强制人类,默认不允许 AI 自动处置未完成 WorkItem
- 默认禁止使"启用成本高"但"误用成本低";反过来会很危险

### 3.5 为什么复用已有 Gate kind

- 保持 governance 10 种用户可见 kind 的稳定语义,避免因技术实现细节膨胀业务术语
- Gate 的价值在六段完整性而非 kind 种类,新增 kind 不带来新能力
- 新 kind 会触发下游(Console / Chat / 审批列表)的 UI 适配成本
- `quality-gate` / `design-choice` 语义已覆盖绝大多数场景;特殊元数据通过 DecisionRequest.context_summary 和 candidate_options.metadata 承载

---

## 4. 后果

### 4.1 正面

- **两域解耦**:process 域不需要理解 WorkItem 业务语义,work 域不需要监听 Activity 状态机
- **模板作者掌握策略**:不同家族的 Template 可以用不同 completion_policy,method-library 的弹性兑现
- **安全默认**:AutoAction 不会意外自动处置业务,符合保守治理原则
- **Gate kind 稳定**:governance 的 10 种用户可见 kind 保持不变

### 4.2 负面

- **ActivityDef 字段变复杂**:多了一个 enum + 内嵌结构,method-library 编辑器需要支持
- **Policy 配置成本**:要用 try_auto_then_gate 必须先配 autonomy_level Policy,门槛偏高(但这是安全换来的)
- **策略默认值歧义**:完全不配 completion_policy 时的默认值需要明确(本 ADR 定为 auto_complete)

### 4.3 风险缓解

- **method-library 提供 completion_policy 预设模板**(如"敏捷默认"/"瀑布严格"/"审批型"),降低填表成本
- **Policy 编辑器提供"允许自动处置"的一键开关**,但把执行风险显式提示给用户
- **默认 auto_complete 选择保守语义**:不自动处置 WorkItem,不卡 Activity;"不一致"作为可见状态交给看板展示,由用户自行决定如何处理
---

## 5. 约束与边界

### 本 ADR 锁定

- Activity 和 WorkItem 状态机**独立**,不做字段级同步
- 项目完成判据以 WorkItem 为准
- ActivityDef 新增 `completion_policy` 字段(四种策略)
- AutoAction 默认禁止,启用必须 Policy + autonomy_level ≥ 阈值
- **不新增 Gate kind**:stage-exit 不引入,复用 quality-gate / design-choice / release-confirm
- 运行时 AutoAction 每步发事件,留痕
- 完全不配 completion_policy 时默认 `auto_complete`

### 本 ADR 不锁定

- **AutoActionSpec 的具体实现细节**:如 `split_off_incomplete` 生成的新 WorkItem kind 由 Policy 决定,本 ADR 仅给接口
- **AutoAction 超时 / 重试**:由 ActivityDef.retry_policy 承载
- **Policy 的 autonomy_level 配置模板**:由 governance 和 method-library 协作出预设,非本 ADR 范畴
- **method-library 的 Editor UI**:如何可视化 completion_policy 是 UI 层决策
- **看板层面 Activity / WorkItem 不一致的展示**:由 Console / Chat 决定呈现形式(见 ADR-0009 ViewProfile)

---

## 6. 标准对齐

- **BPMN 2.0**:Activity 状态机纯 BPMN 语义,不被 Scrum 状态污染
- **SPEM 2.0**:completion_policy 作为 ActivityDef 的 Method Content 字段,在 method-library 定义,process 域索引执行 —— 符合 Definition / Use 分离
- **Scrum / Kanban**:WorkItem 状态机独立,spillover / defer 这些术语原生支持
- **ISO 42001**:AutoAction 执行必经 autonomy_level 授权,对应 A.6 Operation + 可解释性要求
- **ISO 24748-2**:Tailoring 机制体现 —— 不同 Profile 可对同一 Template 的 ActivityDef 配置不同 completion_policy
- **架构红线**:
  - 可审计性:AutoAction 发事件 + audit_trail
  - 可追溯性:trace_id 贯穿 Activity / WorkItem / Gate
  - 可裁剪性:completion_policy 是模板作者的配置点

---

## 7. 后续行动

1. **本 ADR 接受后**:
   - `domain/process/README.md` §2.4 `ActivityDef` 字段表加 `completion_policy`;§2.4.3 Activity 状态机说明补"completed 含义不等于 WorkItem done";§2.4.3 新增不变量(覆盖 try_auto_then_gate 的 autonomy_level 校验)
   - `domain/work/README.md` §2.4 WorkItem "项目完成判据" 明确为"全部 done/cancelled 且不依赖 Activity";§4.3 订阅表里 `process.activity.completed` 的"检查是否可转 done"改为说明"work 域不强同步,按 WorkItem 自己状态机推进"
   - `domain/governance/README.md` §2.1.2 注明"不新增 stage-exit kind,相关场景走 quality-gate / design-choice";AutoAction 执行事件纳入 audit_trail 约定

2. **短期(段 3)**:
   - method-library 仓提供 `completion_policy` 的三套预设(敏捷默认 / 瀑布严格 / 审批型)
   - process 仓实现四种策略的引擎分支 + AutoAction 事件 + 退化逻辑
   - governance 仓补 `quality-gate` 处理 Activity-WorkItem 不一致的六段预填模板

3. **中期**:
   - 观察实际使用模式,判断 AutoAction 类型是否需要扩展(如 `assign_to_backlog`)
   - 看板展示不一致状态的 UX 设计(ViewProfile 消费)

4. **长期**:
   - 若出现 AutoAction 滥用案例,考虑引入组织级审计回放机制

---

## 8. 参考

- `domain/process/README.md` §2.4 Activity + §十一.3 与 governance / work 协作
- `domain/work/README.md` §2.4 WorkItem + §4.3 事件订阅
- `domain/governance/README.md` §2.1 Gate 聚合 + §2.3 Policy + INV-5(autonomy_level=5 必须 Policy 授权)
- `product/六域模型.md` §5.6 弱绑定 + §2.3 八条原则
- `product/最终目的.md` §3.5 关键节点强制人类
- `methodology/standards-discussion/BPMN-2.0.md`(Activity 状态机)
- `methodology/standards-discussion/SPEM-2.0.md`(Method Content / Definition vs Use)
- `methodology/standards-discussion/ISO-24748-2.md`(Tailoring 机制)
- Research:自主性 5 级授权 + 14 种失败模式中与"越权自动处置"相关的几项
- 相关 ADR:ADR-0007 Checkpoint 持久化(Activity 完成的一致性事务)
