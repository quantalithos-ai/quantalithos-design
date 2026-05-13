# ADR-0011:流程嵌套机制 —— SubProcess vs CallActivity 边界 + 父子 Instance 生命周期

> Status: **Proposed**  
> Date: 2026-05-10  
> Deciders: Aris(待确认)  
> Consulted: `domain/process/README.md` §2.1 / §2.4 / §2.5 / §十 Q2 / ADR-0007 / ADR-0008 / ADR-0010 / `methodology/standards-discussion/BPMN-2.0.md`  
> Informed: process 仓 / method-library 仓 / governance 仓 / observability 仓  

---

## 1. 背景

现实运转中,大流程里嵌套小流程是常态:

- 装修项目里"每次选材"(5 步重复 N 次)
- 旅行里"每顿饭决定去哪吃"(临时触发)
- 开发项目里"每次代码评审"(标准流程,跨项目复用)
- 合规项目里"每次变更审批"(独立决策,有自己的 Gate 和归档)

这些场景共享一个特征:**子流程有自己的步骤、自己的产出、自己的生命周期**,但要**挂接到父流程**的某个时刻。

BPMN 2.0 原生支持嵌套,ActivityDef.kind 里我们已经声明了两种:

- `sub-process` —— 内联子流程(同 Instance 内展开)
- `call-activity` —— 调用独立流程(创建子 Instance)

但 process README §十 Q2 指出:**两者什么时候用、父子生命周期如何同步,本项目还没定**。这是一个影响面巨大的开放问题,涉及:

1. **嵌套时何用 SubProcess 何用 CallActivity**
2. **父 Instance cancel / pause 时子如何传播**
3. **子 Instance 失败对父的影响**
4. **Checkpoint 恢复时父子顺序**
5. **跨 Instance 的 trace_id / 审计链路**
6. **多层嵌套深度限制(防止栈溢出)**

本 ADR 一次性锁定这些问题的方向。

## 2. 决策

### 2.1 SubProcess vs CallActivity 边界

**锁定**:

| 维度 | SubProcess(内联) | CallActivity(调用独立) |
|---|---|---|
| 是否新起 Instance | ❌ 否,同父 Instance | ✅ 是,独立子 Instance |
| 子流程定义位置 | 父 Template 内联 | 独立 Template(method-library) |
| 跨项目复用 | ❌ 不能 | ✅ 可以 |
| 自己的 Gate / Artifact 命名空间 | ❌ 共用父 | ✅ 独立 |
| 父 cancel 的传播 | 自动传播(同 Instance) | 按策略决定(见 §2.3) |
| Checkpoint 范围 | 同父 Checkpoint 内 | 独立 Checkpoint 链 |

**使用原则**:

- **用 SubProcess**:子流程**紧耦合父流程**、**不单独复用**、**父子生命周期一致**
  - 例:瀑布的"详细设计"大阶段内部细分为"数据库设计 / 接口设计 / UI 设计"子步骤
  - 例:Sprint Planning 大 Activity 内部的"挑 WorkItem / 估算 / 建依赖"三步

- **用 CallActivity**:子流程**可独立存在**、**跨项目复用**、**生命周期可与父独立**
  - 例:"代码评审流程"(任何项目的任何 Activity 里都可触发)
  - 例:"变更审批流程"(有自己的 Gate / Artifact,独立归档)
  - 例:"事故响应流程"(可被多个项目并发触发)

### 2.2 嵌套深度限制

```
MAX_NESTING_DEPTH = 5
```

- 从根 Instance 到最深子 Instance 的层数不超过 5
- 包含 SubProcess 和 CallActivity 混合嵌套
- 超过立即拒绝(INV,见 §2.7)

**理由**:5 层覆盖现实绝大多数场景(项目 → 阶段 → 子阶段 → 标准流程 → 子步骤),过深说明建模有问题。

### 2.3 父子生命周期传播

#### 2.3.1 父 → 子传播规则

| 父事件 | SubProcess 子 | CallActivity 子 |
|---|---|---|
| 父 `start` | 自动触发子开始 | 按 SequenceFlow 触发(正常) |
| 父 `pause` | 子同步 pause | **按 CallPolicy 决定**(见下) |
| 父 `resume` | 子同步 resume | 按 CallPolicy 决定 |
| 父 `cancel` | 子同步 cancel | **按 CallPolicy 决定** |
| 父 `complete` | 正常逻辑(子已完成) | 子独立运行 |
| 父 `fail` | 子同步 fail | 按 CallPolicy 决定 |

#### 2.3.2 CallActivity 的 CallPolicy

CallActivity 在 ActivityDef 里声明:

```
CallActivityDef {
    called_template_ref: TemplateRef,      // 指向独立 Template
    call_policy:         CallPolicy,       // 父子关系策略
    inputs_mapping:      Vec<InputMapping>, // 父变量 → 子变量
    outputs_mapping:     Vec<OutputMapping>, // 子产出 → 父变量
}

CallPolicy = oneof {
    // 策略 A:synchronous_bound(默认,紧耦合)
    // 父等子完成后才推进;父 cancel 级联子 cancel
    synchronous_bound {
        on_parent_cancel:  CascadeCancel,   // 立即 cancel 子
        on_parent_pause:   CascadePause,    // 暂停子
    },

    // 策略 B:synchronous_detached(松耦合)
    // 父等子完成;但父 cancel 时,子继续跑完
    synchronous_detached {
        on_parent_cancel:  LetChildFinish,  // 子继续跑完
        on_parent_pause:   PauseParentOnly, // 父暂停,子继续
    },

    // 策略 C:fire_and_forget(触发即忘)
    // 父触发子后立即推进下一步,不等子完成
    fire_and_forget {
        child_result_policy: enum {
            ignore,              // 不关心子结果
            notify_only,         // 子完成后发通知,但不影响父
            trigger_follow_up,   // 子完成后触发父的另一 Activity
        },
    },
}
```

默认 `synchronous_bound`,这是最符合直觉的"父等子"语义。

#### 2.3.3 子 → 父传播规则

| 子事件 | SubProcess(自动) | CallActivity(按 CallPolicy) |
|---|---|---|
| 子 `complete` | 父 Activity 完成,推进 | synchronous_* → 父推进;fire_and_forget → 按 child_result_policy |
| 子 `fail` | 父 Activity fail,按 retry_policy | synchronous_* → 按父的 retry_policy 决定重试;fire_and_forget → 按 child_result_policy |
| 子 `cancel`(子自己取消) | 父 Activity 视为 cancelled | synchronous_* → 父 Activity fail 或 skip;fire_and_forget → 按 child_result_policy |

### 2.4 Checkpoint 恢复顺序

父 Instance 崩溃恢复时:

```
恢复顺序:
  1. 读父 Instance 最新 Checkpoint
  2. 找出所有"活跃"子关系:
     - SubProcess:在父 Checkpoint 的 active_tokens 里
     - CallActivity:在父 Checkpoint 的 active_call_activities 里
  3. 按 CallPolicy 决定子恢复策略:
     synchronous_* → 必须恢复子 Instance
     fire_and_forget → 不管子状态,父继续
  4. 恢复子 Instance 时,递归应用相同逻辑(深度优先)
  5. 等所有子 Instance 恢复就位,父才进 running 状态
```

**Checkpoint 内容扩展**(ADR-0007 的 `CheckpointState` 增加):

```
CheckpointState {
    ...(现有)
    active_sub_processes:   Vec<SubProcessFrame>,       // SubProcess 展开栈
    active_call_activities: Vec<CallActivityRecord>,    // 活跃的 CallActivity 及其子 Instance 引用
    nesting_depth:          i32,
}

CallActivityRecord {
    call_activity_id:   ActivityId,
    child_instance_id:  InstanceId,
    call_policy:        CallPolicy,
    started_at:         Timestamp,
    last_sync_at:       Timestamp,   // 最近一次父子状态同步
}
```

### 2.5 trace_id 关联

- **SubProcess**:同父 Instance,**同一个 trace_id 贯穿**
- **CallActivity**:子 Instance 自己新生成 trace_id,**但记录 `parent_trace_id`**,observability 可通过 parent_trace_id 反向关联整个调用树

```
Instance {
    ...(现有)
    parent_instance_id:  Option<InstanceId>,   // 父 Instance(CallActivity 触发时)
    parent_call_activity_id: Option<ActivityId>, // 触发本 Instance 的父 CallActivity
    parent_trace_id:     Option<TraceId>,       // 父的 trace_id
    root_trace_id:       TraceId,               // 根 Instance 的 trace_id(跨层统一)
}
```

观测链路:

```
observability:
  query by root_trace_id
  → 返回整棵调用树:根 Instance + 所有 CallActivity 触发的子 Instance
  (SubProcess 已在同 trace_id 内,自然包括)
```
### 2.6 SubProcess 的内联展开

SubProcess 是**父 Template 内部定义**的子流程,展开后等于在父 activity_graph 里嵌入一组 Activity。

```
ProcessTemplateDef.activity_graph {
    activities: [
        ...,
        ActivityDef {
            kind: sub-process,
            sub_process_definition: SubProcessDef {
                inner_activities: Vec<ActivityDef>,         // 递归结构
                inner_sequence_flows: Vec<SequenceFlowDef>,
                inner_gateways: Vec<GatewayDef>,
                inner_events: Vec<EventDef>,
                inner_entry_node: String,                   // 展开后的入口
                inner_exit_node: String,                    // 展开后的出口
            },
        },
        ...,
    ],
}
```

**展开时机**:Profile 活化时,SubProcess 展平到 `effective_activity_graph`,给 Instance 运行时看到的是展开后的扁平图。

**运行语义**:
- SubProcess 本身是一个 Activity,有自己的 state(scheduled / in_progress / completed)
- SubProcess in_progress 时,内部 inner_activities 开始执行
- 所有 inner_activities 完成 → SubProcess complete
- 内部 Gate 触发 → 挂起的是 SubProcess Activity 的 waiting_gate 状态,但实际 Gate 记录里带内部 Activity 引用

**Deviation 的语义(GUIDED 模式)**:
- 如果 Template 刚度=GUIDED(ADR-0010),SubProcess 内部允许 Deviation,记录时标注 "in sub-process X"
- Deviation 机制本身由 ADR-0012 决策(段 3 起草,讨论笔记见 `architecture/adr/drafts/0012-deviation-discussion-notes.md`)

### 2.7 新增不变量

在 `domain/process/README.md` §2.4.3 的 INV-31..44 之后,追加:

**INV-45(ADR-0011)** 嵌套深度:任何 Instance 的 `nesting_depth ≤ 5`。超过立即拒绝创建。

**INV-46(ADR-0011)** SubProcess 的 inner_activity_id 必须在父 Template 内全局唯一(与展平后的所有 Activity ID 不冲突)

**INV-47(ADR-0011)** CallActivity 指向的 called_template_ref **必须是已 published 的 ProcessTemplateDef**,且 fingerprint 与当前 method-library 一致

**INV-48(ADR-0011)** CallActivity 触发的子 Instance 必须写 parent_instance_id + parent_trace_id + root_trace_id

**INV-49(ADR-0011)** synchronous_bound 的 CallActivity,父 cancel 时必须级联 cancel 所有活跃子 Instance;级联失败必须记录并告警,父不能自行进 cancelled 状态

**INV-50(ADR-0011)** fire_and_forget 的 CallActivity,其子 Instance 的生命周期完全独立;父 archive 时子 Instance 若仍 active,子 Instance 单独归档而非跟随父

**INV-51(ADR-0011)** CallActivity 的 inputs_mapping / outputs_mapping 必须双向类型兼容(校验由 method-library Publish Gate 执行)

**INV-52(ADR-0011)** 嵌套场景的 Checkpoint 恢复,父必须等所有 `synchronous_*` 子 Instance 就位才能从 resuming 进入 running;等待超时(默认 5 分钟)则父进入 fail 并报告哪个子未就位

### 2.8 与 ADR-0008 completion_policy 的关系

CallActivity 的 synchronous_bound 策略下,**子 Instance 的 completion** 作为父 Activity 的 completion 触发器。此时 ADR-0008 的 completion_policy 在父层仍然适用:

```
父 CallActivity:
  子 Instance 完成 → 触发父 CallActivity 的 complete 请求
  → 按父 CallActivity.completion_policy 处理 related_workitems
  → 按策略或推进或挂起
```

即 completion_policy 和 CallPolicy 是正交维度:
- CallPolicy 管**子 Instance 与父 Activity 的关系**
- completion_policy 管**父 Activity 与 related_workitems 的关系**

### 2.9 与 ADR-0010 Template 刚度的关系

子 Instance 的刚度**默认继承调用它的 Template 的刚度**,但可以在 CallActivity 声明里覆盖:

```
CallActivityDef {
    ...
    child_rigidity_override: Option<RigidityLevel>,
    // 不设置:子 Instance 用自己 Template 的默认刚度
    // 设置 STRICT:即使子 Template 是 GUIDED,本次调用强制严格
}
```

**理由**:同一 Template 在合规项目里要 STRICT,在日常项目里要 GUIDED。调用方决定比 Template 自身定死更灵活。

## 3. 理由

### 3.1 为什么区分 SubProcess 和 CallActivity

BPMN 2.0 原生有这个区分,**背后是"复用" vs "内聚"的经典权衡**:

- 复用 → 独立 Template + CallActivity
- 内聚 → 同 Template 内 SubProcess

如果只留一种,场景覆盖度下降:
- 只留 SubProcess → 跨 Template 无法复用小流程(如代码评审)
- 只留 CallActivity → 简单的"展开一组步骤"也要新建 Template,过重

两种都要保留,但**职责分工必须清楚**,否则用户会乱用。

### 3.2 为什么 CallPolicy 三种

三种对应现实世界的三种调用模式:

- synchronous_bound = "我让你做这事,做完告诉我,我等着"(紧耦合默认)
- synchronous_detached = "我让你做,但你自己能处理的不用报告"(松耦合)
- fire_and_forget = "我触发了一个任务,你慢慢做,我不等"(异步)

少于三种会丢语义;多于三种过度设计。

### 3.3 为什么嵌套深度 ≤ 5

经验值:
- 1 层:根项目
- 2 层:根 → 阶段
- 3 层:根 → 阶段 → 子流程
- 4 层:根 → 阶段 → 标准流程 → 子步骤
- 5 层:极端复杂项目的保底

超过 5 层说明建模有问题(Template 没好好拆),**硬限制促使模板作者反思**。类似 Linux 的进程嵌套也有类似限制。

### 3.4 为什么 fire_and_forget 的子独立归档

fire_and_forget 语义上就是"分家",父对子的生命周期不负责。如果父 archive 时强制归档 active 子,违反其"独立"语义。但**治理上子 Instance 不能无主**,所以要求子单独归档(INV-50)。

### 3.5 为什么 child_rigidity_override 在调用方

已在 §2.9 解释。核心:Template 是方法资产,可复用;刚度是**使用场景决定**的,不是 Template 固有属性。调用方有权覆盖。

## 4. 后果

### 4.1 正面

- **嵌套机制闭环**:process Q2 的开放问题解决,模板作者知道什么时候用哪种
- **跨项目复用 Template**:CallActivity 让"代码评审"、"变更审批"等小流程能一次定义全组织用
- **现实嵌套场景覆盖**:装修、旅行、开发项目的 N 层嵌套都能建模
- **审计链完整**:root_trace_id + parent_trace_id 让 observability 能反查整个调用树
- **和已有 ADR 对齐**:不破坏 ADR-0007(Checkpoint)/ ADR-0008(completion_policy)/ ADR-0010(刚度)的任何锁定

### 4.2 负面

- **process 引擎复杂度上升**:要处理父子 Instance 同步、级联 cancel、Checkpoint 深度优先恢复
- **Checkpoint 结构扩展**:active_call_activities 字段增加存储和序列化成本
- **CallPolicy 三种组合 × Checkpoint × 刚度 × completion_policy = 测试矩阵爆炸**:需要专门的集成测试策略
- **method-library 校验负担**:Publish 时要校验 inputs/outputs 类型兼容、fingerprint 链、无循环调用

### 4.3 风险缓解

- **默认 synchronous_bound**:最直觉的语义作为默认,用户不用理解三种也能用基本功能
- **循环调用检测**:method-library Publish Gate 强制 Template 调用图无环(独立于本 ADR,但必须实施)
- **Checkpoint 测试套件**:专门的"嵌套恢复"测试场景,覆盖父子同步 / 异步崩溃
- **5 层限制可配置**:组织 Policy 可降低(如强制 ≤ 3),不能升高(防止滥用)
---

## 5. 约束与边界

### 本 ADR 锁定

- SubProcess(内联)vs CallActivity(调用独立)的使用原则
- CallActivity 的三种 CallPolicy:synchronous_bound / synchronous_detached / fire_and_forget
- 默认 CallPolicy 为 synchronous_bound
- 嵌套深度限制 ≤ 5(MAX_NESTING_DEPTH)
- 父 → 子 / 子 → 父 的生命周期传播规则(按 CallPolicy 决定)
- Checkpoint 恢复顺序:父等同步子就位才能 running
- trace_id 关联:SubProcess 同根 trace;CallActivity 新生成 trace + 记 parent_trace_id + root_trace_id
- 子 Instance 刚度可由调用方覆盖(child_rigidity_override)
- 新增 INV-45..52(嵌套场景的硬约束)
- 循环调用在 method-library Publish Gate 拦截

### 本 ADR 不锁定

- **CallPolicy 的具体超时参数默认值**(如 synchronous_bound 等子超时多久父 fail):留给 process 实施阶段
- **inputs_mapping / outputs_mapping 的 DSL 细节**:方法库表达式 DSL(ADR-0009 Q1)一并处理
- **跨租户调用**:企业版场景,本 ADR 暂不覆盖
- **嵌套场景的 UI 呈现**(父子时间线、回溯):UI 仓决策
- **异步触发子 Instance 的优先级调度**:Member Runtime 设计决策
- **本 ADR 处于 Proposed 状态**:待 Aris 确认

### 与已有 ADR 的关系

- **ADR-0007 Checkpoint**:CheckpointState 扩展字段(active_sub_processes / active_call_activities / nesting_depth);恢复策略扩展为深度优先;本 ADR 不否决 ADR-0007 主体决策
- **ADR-0008 completion_policy**:正交,父 CallActivity 的 completion_policy 仍适用;子 Instance 完成作为父 complete 的触发器
- **ADR-0009 ViewProfile**:可派生 "嵌套深度" / "活跃子 Instance 数"等字段;不冲突
- **ADR-0010 Template 刚度**:正交,子 Instance 的刚度可继承或覆盖;嵌套场景刚度与深度独立

## 6. 标准对齐

- **BPMN 2.0**:SubProcess / CallActivity 是 BPMN 原生概念,本 ADR 的边界划分对齐 BPMN 标准语义
- **ISO 24748-2 Tailoring**:子流程 Template 的独立性 + 调用方覆盖,体现 Tailoring 机制的完整性
- **ISO 42001 §A.6 Operation**:嵌套流程的审计链完整,符合运行期治理要求
- **ISO 42001 §A.8 Monitoring**:root_trace_id / parent_trace_id 让跨层观测可实现
- **ISO 9001 §4.4**:过程嵌套的控制点(Gate / Milestone)按 CallPolicy 显式约束
- **Temporal / Research**:CallActivity 的 fire_and_forget 对齐 Temporal 的 "Child Workflow Detached" 模式
- **SPEM 2.0 Method Plugin**:CallActivity 指向的独立 Template 天然适合作为 Plugin 资产分发
- **架构红线**:
  - **可审计性**:嵌套调用全链路留痕,parent_trace_id 反查
  - **可追溯性**:子 Instance 独立审计但能串回父
  - **可裁剪性**:CallPolicy / child_rigidity_override 双层裁剪维度

## 7. 后续行动

### 本 ADR 接受后(Accepted)

1. **process README §2.1 ProcessTemplate** 字段补 SubProcessDef / CallActivityDef
2. **process README §2.3 ProcessInstance** 字段补 parent_instance_id / parent_trace_id / root_trace_id
3. **process README §2.4.3** 补 INV-45..52
4. **process README §十 Q2** 标注 "已由 ADR-0011 决策"
5. **ADR-0007 CheckpointState** 追加字段(active_sub_processes / active_call_activities / nesting_depth)
6. **method-library README §2.5** ProcessTemplateDef 扩展字段
7. **proto-draft/process** 补 CallActivityDef / CallPolicy / SubProcessDef message

### 短期

1. process 仓实现嵌套执行引擎(SubProcess 展开 + CallActivity 子 Instance 管理)
2. Checkpoint 深度优先恢复实现
3. method-library Publish Gate 增加循环调用检测逻辑
4. observability 实现 root_trace_id 的调用树查询 API

### 中期

1. 测试嵌套场景的 E2E(装修样例、代码评审样例、事故响应样例)
2. 观察实际使用,判断 MAX_NESTING_DEPTH=5 是否过紧
3. UI 仓(console / chat)实现嵌套可视化(父子时间线)

### 长期

1. 评估跨租户调用支持(企业版)
2. 评估 Template 调用 DAG 的可视化 / 血缘图
3. fire_and_forget 的"广播触发"(一次触发 N 个子)

## 8. 参考

- `domain/process/README.md` §2.1 / §2.3 / §2.4 / §十 Q2
- `domain/method-library/README.md` §2.5 ProcessTemplateDef
- `methodology/standards-discussion/BPMN-2.0.md`(SubProcess / CallActivity 原生语义)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(Tailoring 机制)
- ADR-0007(Checkpoint 持久化 —— 本 ADR 扩展其结构)
- ADR-0008(completion_policy —— 本 ADR 说明其与 CallPolicy 正交)
- ADR-0010(Template 刚度 —— 本 ADR 说明其与 CallPolicy 正交)

## 9. 讨论留痕

**为什么产生这个 ADR**:用户在讨论"大流程嵌套小流程是否存在"时,举了装修 / 旅行 / 做饭等例子,揭示现实运转的**常态就是嵌套**。process Q2 的开放问题因此升级为必须决策。

**关键转折点**:
- 初期:process README 只在 ActivityDef.kind 列了 sub-process / call-activity 两个值,没定语义
- 用户明确"大流程包含小流程是常态" → 意识到嵌套机制是必答题
- 推演多种生命周期同步方案后,选定 "CallPolicy 三种 + 默认 synchronous_bound"

**本 ADR 选择的立场**:
- 不推翻 BPMN 2.0 原生语义,对齐标准
- 在标准基础上**显式声明父子关系类型**(CallPolicy),消除模糊
- 嵌套深度硬限制,防止滥用
- Checkpoint 结构扩展而非重写,兼容 ADR-0007

**未收敛的争议**(留给后续):
- 5 层是否过紧?暂保守,按实际使用看
- fire_and_forget 的子 Instance 是否可以"重新挂回父"?暂不允许,保持简单
- 跨租户调用的权限边界?企业版问题,暂不处理

---

> 本 ADR 处于 Proposed 状态。建议在 Aris 本人确认方向后转 Accepted,再启动配套文档订正和 proto 扩展。
