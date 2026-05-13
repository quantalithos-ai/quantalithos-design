# ADR-0010:Template 刚度分层 —— 从"剧本引擎"到"范式向导"

> Status: **Proposed**  
> Date: 2026-05-10  
> Deciders: Aris(待确认)  
> Consulted: `domain/process/README.md` §2.1 / §2.4 / `domain/method-library/README.md` §2.5 / `product/六域模型.md` §六 过程域 / ADR-0008 / ADR-0009 / 本仓记忆 `feedback_red_lines.md`(可裁剪性红线)  
> Informed: process 仓 / method-library 仓 / governance 仓 / console 仓 / 所有 L1 域  

---

## 1. 背景

Quantalithos 的 process 域(`domain/process/README.md`)把 ProcessTemplate 设计为 **BPMN 引擎能严格执行的剧本**:Activity 按 graph 严格转移、状态机越级禁、已发布 Template 字段不可变、Profile 一 active 就冻结、Instance 必须绑定冻结的 Profile。这套严格度在三类场景下是合适的:

- 法规强制流程(药品上市、财报披露)
- SOP 流程(医疗器械 / 航天软件)
- ISO 审计场景(证据链要求无偏差)

但 Quantalithos 的定位是**让 AI 员工与人类协作处理现代软件与知识工作**。这类场景的 **主流形态** 不是"剧本",而是"范式":

- 团队用 Scrum,但 Daily 改周会、SM 兼 PO 都常见
- 瀑布项目实际跑起来,常有"小范围并行"打破线性
- 敏捷团队随时根据反馈插入新任务或跳过仪式
- 家庭 / 个人级流程几乎不严格执行规定步骤

现有设计把**剧本级严格度**默认强加到所有 Template 上,导致:

1. **用户体验违反直觉**:团队想"灵活偏离"被引擎直接拒
2. **引擎与现实脱节**:如果严格执行,用户会绕过系统;如果不严格,又失去治理意义
3. **可裁剪性红线被动摇**:Template 写好就不能改,组织想改要走完整 supersede 流程,门槛过高
4. **小流程进不来**:事务流 / 临时协作被迫走 Template 或干脆不走 —— 这是前置讨论"只有大 Template 够不够"的根源之一

本 ADR **不否定** process 域现有设计,**增加一个维度**:让 Template 作者声明刚度,引擎按刚度区分行为。

## 2. 决策

**引入 `RigidityLevel` + `ExecutionMode` 两个字段**到 ProcessTemplateDef,让模板作者显式声明执行语义。BPMN 引擎按这两个字段的组合决定"状态转移、偏离处理、关卡强制"的行为边界。

### 2.1 RigidityLevel 三级

```
RigidityLevel = enum {
    STRICT,         // 剧本级:偏离需走变更 Gate,所有转移引擎强制
    GUIDED,         // 范式级:偏离允许但必须留痕(Deviation),Gate 后可继续
    ADVISORY,       // 建议级:Template 只做指引,Activity 状态不严格追踪
}
```

**三级语义**:

| 级别 | 适用场景 | 偏离如何处理 |
|---|---|---|
| **STRICT** | 合规 / 审计 / SOP / 法规 | 任何偏离都视为错误,必须走 change-request Gate 后才能绕过 |
| **GUIDED** | 日常团队协作 / 敏捷 / 家庭流程 | 偏离允许,必须记录 Deviation + 事后可审计;不一定起 Gate |
| **ADVISORY** | 参考方法 / 最佳实践文档 / 新人培训 | 引擎不追踪 Activity 状态,只在关键 Gate 处暂停 |

### 2.2 ExecutionMode 三档

```
ExecutionMode = enum {
    BPMN_ENFORCED,        // BPMN 引擎按 graph 严格执行(当前默认行为)
    CHECKPOINT_BASED,     // 只在预定 Gate / Milestone 处停下,中间自由
    REFERENCE_ONLY,       // Template 作为文档存在,引擎不执行
}
```

**三档语义**:

| 档位 | 引擎行为 | 适用 |
|---|---|---|
| **BPMN_ENFORCED** | 完整执行 Activity 状态机 + SequenceFlow + Token + Gateway | 剧本级 / 受控流程 |
| **CHECKPOINT_BASED** | 只维护若干 Milestone / Gate,中间 Activity 由 Runtime 自由推进 | 开发流程 / DevOps / 范式级 |
| **REFERENCE_ONLY** | 不创建 Instance,只作为 Template 可查询的文档 | 方法资产 / 培训材料 |

### 2.3 RigidityLevel × ExecutionMode 的合法组合

不是所有组合都合理。下表是合法组合矩阵:

| | BPMN_ENFORCED | CHECKPOINT_BASED | REFERENCE_ONLY |
|---|---|---|---|
| **STRICT** | ✅ 经典剧本 | ⚠️ 不常见(Milestone 内部失去严格性) | ❌ 冲突 |
| **GUIDED** | ⚠️ 过严(允许偏离但 graph 又强执行) | ✅ **推荐默认** | ❌ 冲突 |
| **ADVISORY** | ❌ 冲突 | ⚠️ 弱治理,几乎等于 REFERENCE | ✅ 纯文档 |

⚠️ 标记的组合允许但不推荐,模板作者要显式声明理由,审批时会起提示 Gate。

### 2.4 各 Template 家族的默认刚度

对齐 8 种 24748-2 家族,默认刚度分配:

| 家族 | 默认 RigidityLevel | 默认 ExecutionMode | 理由 |
|---|---|---|---|
| `waterfall-classic` | STRICT | BPMN_ENFORCED | 瀑布本就偏重流程 |
| `v-model` | STRICT | BPMN_ENFORCED | 每层设计必须对应验证,不允许跳 |
| `incremental-release` | GUIDED | CHECKPOINT_BASED | 增量间相对独立,内部可灵活 |
| `evolutionary-discovery` | GUIDED | CHECKPOINT_BASED | 探索性工作天然需要偏离空间 |
| `iterative-standard` | GUIDED | CHECKPOINT_BASED | 迭代边界是 Checkpoint,内部灵活 |
| `spiral-risk-driven` | STRICT | BPMN_ENFORCED | 风险评估点不可绕过 |
| `agile-scrum` | GUIDED | CHECKPOINT_BASED | 四仪式是 Checkpoint,中间 WorkItem 自由流动 |
| `agile-kanban` | GUIDED | CHECKPOINT_BASED | 连续流,无强制节拍 |
| `agile-safe` | GUIDED | CHECKPOINT_BASED | PI Planning / System Demo 是 Checkpoint |
| `devops-continuous` | ADVISORY | CHECKPOINT_BASED | Pipeline 本身是自动化流程,Template 只是文档 |

**组织 / 项目可通过 MethodConfiguration 覆盖默认值**(对应 method-library 的 Variability 机制),但覆盖必须留痕。
### 2.5 BPMN 引擎按刚度区分行为

以下是引擎在不同刚度下的行为差异概述,**具体 INV 调整留给后续独立 ADR** 精化(本 ADR 仅锁定方向):

#### STRICT × BPMN_ENFORCED(当前默认行为)

- Activity 状态转移严格按 graph,越级禁
- Profile active 后 effective_graph 不可修改
- Gate mandatory=true 的不可跳过
- 任何偏离请求都起 `change-request` Gate(新增 kind,由 ADR-0012 锁定)
- 偏离批准后也要记录 `ActivityDeviation`(段 3 实施阶段起草 ADR-0012,参考 `architecture/adr/drafts/0012-deviation-discussion-notes.md`)

#### GUIDED × CHECKPOINT_BASED(推荐默认)

- 引擎只在 **预定 Checkpoint**(Template 标注 `is_checkpoint=true` 的 Activity / Gate)处强制停下
- 非 Checkpoint 的 Activity,引擎记录状态但**允许跳过 / 乱序**
- 跳过 / 乱序必须记 `ActivityDeviation`(反映实际执行路径 vs Template 定义的差异)
- Profile 的 effective_graph 允许**受控修改**(比 STRICT 宽松):
  - 加新 Activity(Extension)→ 需 Template 作者同域签名或 Gate
  - 跳过某 Activity(Reduction)→ 记 Deviation,继续走

#### ADVISORY × REFERENCE_ONLY

- 不创建 ProcessInstance,Template 作为可查询的 Method Content 文档
- WorkItem 由用户自行创建,不自动绑定 Activity
- 不产生 Activity 级事件
- 仅保留 Template 本身的 Marketplace / 版本事件

### 2.6 Checkpoint 标注

在 ActivityDef 和 GateRequirementDef 上加 `is_checkpoint` 字段(CHECKPOINT_BASED 模式用):

```
ActivityDef {
    ...(现有字段)
    is_checkpoint: bool = false,   // 本 Activity 在 CHECKPOINT_BASED 下是否强制节拍
    checkpoint_kind: Option<CheckpointKind>,  // milestone / gate / review / retrospective
}

GateRequirementDef {
    ...(现有字段)
    is_checkpoint: bool = true,    // Gate 默认是 checkpoint,模板作者可显式改 false
}
```

STRICT 模式下 `is_checkpoint` 字段忽略(所有节点都严格)。

### 2.7 ProcessTemplateDef 字段增加

method-library 的 ProcessTemplateDef 聚合(见 `domain/method-library/README.md` §2.5):

```
ProcessTemplateDef : MethodContent {
    ...(现有字段)

    // ADR-0010 新增:刚度声明
    rigidity:        RigidityLevel,       // STRICT / GUIDED / ADVISORY
    execution_mode:  ExecutionMode,       // BPMN_ENFORCED / CHECKPOINT_BASED / REFERENCE_ONLY
    rigidity_rationale: Option<String>,   // 若选非默认组合,须说明
}
```

对应 process 域的 ProcessTemplate(索引副本)也同步这两个字段。

### 2.8 偏离(Deviation)留痕占位

GUIDED / STRICT 模式下,"偏离"是一等事实。本 ADR **只占位**,具体机制由 ADR-0012 决策(段 3 实施阶段起草,讨论笔记见 `architecture/adr/drafts/0012-deviation-discussion-notes.md`,含 Q1~Q8 已推演的初步结论):

```
ActivityDeviation {
    deviation_id:       ULID,
    instance_id:        InstanceId,
    template_path:      StepRef,         // 原 Template 定义的应走路径
    actual_path:        ActualPath,      // 实际跑出来的路径
    rigidity:           RigidityLevel,   // 发生时的刚度(STRICT=违规 / GUIDED=允许)
    reason:             String,
    approved_by:        Option<ActorRef>,
    approved_via_gate:  Option<GateRef>,
    recorded_at:        Timestamp,
}
```

留痕机制的详细字段、事件、持久化、消费方,由 ADR-0012 决策(段 3 起草,笔记已存 `architecture/adr/drafts/0012-deviation-discussion-notes.md`)。

## 3. 理由

### 3.1 为什么不能"一种严格度通吃"

已在背景部分说明。简言之:

- 严格执行 → 违反日常协作直觉,用户绕过系统
- 完全不严格 → 失去治理意义,AI 员工"听说流程"但没约束
- **必须分层**,让模板作者按场景选

### 3.2 为什么从刚度入手而非"新建一个轻量流程概念"

上一轮讨论有候选方案 B "引入 Routine 概念"。对比:

| 方案 | 优点 | 缺点 |
|---|---|---|
| A 在 Template 里加刚度(本 ADR) | 不增概念;ProcessTemplateDef 统一承载 | Template 本身稍复杂 |
| B 新建 Routine 概念 | 语义清晰 | 两套机制维护成本高;方法库资产膨胀 |

本 ADR 选 A。**刚度**是 Template 的**固有属性**,不是新概念,引擎按属性区分行为即可。

### 3.3 为什么 STRICT / GUIDED / ADVISORY 三级

三级的切分参考了现实世界"规则 → 建议"的光谱:

- STRICT:法律 / SOP / ISO 审计
- GUIDED:工程方法 / 家庭决策 / 团队约定
- ADVISORY:最佳实践 / 菜谱 / 新人培训

太细(五级、七级)反而让模板作者选择困难;太粗(二级)无法涵盖"完全不追踪"的文档场景。

### 3.4 为什么 Checkpoint 机制

CHECKPOINT_BASED 是**范式模式的核心实现**。它回答:

- 哪些节点是"必须在这里停下来的"(Checkpoint)
- 其他节点引擎给予多大自由度(非 Checkpoint 允许偏离)

**Gate 天然是 Checkpoint**(人类决策点不可跳),所以 GateRequirementDef 的 `is_checkpoint` 默认 true;Activity 默认不是 Checkpoint,需模板作者显式标。

### 3.5 为什么家族默认值不同

瀑布 / V 模型 / 螺旋 天然偏重流程(STRICT);敏捷 / DevOps 天然偏灵活(GUIDED / ADVISORY)。默认值与家族特性对齐,减少模板作者的选择成本。

### 3.6 为什么不直接允许 Profile 修改 effective_graph

GUIDED 下允许偏离,**但不是允许随意改 Profile**。区别:

- 偏离(Deviation):Instance 运行时,实际执行路径偏离 Template,留痕
- 改 Profile:修改 Template 本身的定义,影响未来所有 Instance

前者是"个案",后者是"规则"。本 ADR 放宽前者,不放宽后者(INV-12 保留)。

## 4. 后果

### 4.1 正面

- **Template 从剧本变成工具**:模板作者按场景选刚度,用户体验符合直觉
- **小流程门槛降低**:GUIDED 模式允许临时偏离,不必为每个小事务造 Template
- **合规场景不打折**:STRICT 模式保留严格执行,ISO 审计不受影响
- **Marketplace 资产分层**:上架 Template 必须标刚度,消费者知道自己在"执行剧本"还是"用范式"
- **对齐 SPEM Variability**:不同刚度本质是不同 Variability 策略,复用 method-library 机制

### 4.2 负面

- **字段变复杂**:ProcessTemplateDef 多了两个字段 + 一个说明,编辑器和 Marketplace UI 要适配
- **引擎行为分支**:BPMN 引擎内部要根据刚度走不同路径,测试矩阵变大
- **Deviation 新概念**:ADR-0012 要在段 3 起草,否则 GUIDED 模式"偏离留痕"只是空话(讨论笔记存 `drafts/0012-deviation-discussion-notes.md`,段 3 时按笔记 + 实际场景验证起草)
- **默认值可能引起争议**:如有组织认为 agile-scrum 就该 STRICT(合规团队的 Scrum),需 MethodConfiguration 覆盖

### 4.3 风险缓解

- **默认 GUIDED + CHECKPOINT_BASED**:新 Template 不写 rigidity 字段时,视为 GUIDED,向后兼容
- **Marketplace Publish Gate 检查**:上架时强制要求 rigidity 显式声明
- **组织 Policy 强制覆盖**:合规组织可用 Policy 把所有 Template 强制 STRICT
- **STRICT 模式行为与当前设计 100% 一致**:现有 Template 标记 STRICT 后行为不变
---

## 5. 约束与边界

### 本 ADR 锁定

- ProcessTemplateDef 增加 `rigidity: RigidityLevel` + `execution_mode: ExecutionMode` + `rigidity_rationale` 字段
- 三级 RigidityLevel 的语义(STRICT / GUIDED / ADVISORY)
- 三档 ExecutionMode 的语义(BPMN_ENFORCED / CHECKPOINT_BASED / REFERENCE_ONLY)
- 合法组合矩阵(见 §2.3)
- 8 种 24748-2 家族的默认刚度分配(见 §2.4)
- ActivityDef / GateRequirementDef 增加 `is_checkpoint` 字段
- 刚度字段不写时的默认语义(GUIDED + CHECKPOINT_BASED)
- STRICT 模式的引擎行为与当前 process 域 INV 一致(向后兼容)

### 本 ADR 不锁定

- **偏离(Deviation)留痕的具体机制**:留给 ADR-0012(段 3 起草,笔记见 drafts/)
- **change-request Gate 的具体语义**:留给 ADR-0012(归入)
- **GUIDED 模式下 Profile 受控修改的具体规则**:留给独立 ADR
- **Checkpoint 类型(milestone / gate / review / retrospective)的 UI 呈现**:UI 仓决策
- **Runtime 对 ADVISORY Template 的交互**:由 L2 Member 设计决策
- **组织 Policy 强制覆盖刚度的 Policy Rule DSL**:governance 域独立 ADR
- **本 ADR 处于 Proposed 状态**:待 Aris 确认 Accepted 后才进入实施

### 与已有 ADR 的关系

- **ADR-0008 `completion_policy`**:四种策略在所有刚度下都适用,但 GUIDED 下允许运行时偏离 completion_policy(留 Deviation);STRICT 下严格执行
- **ADR-0009 ViewProfile**:无直接冲突,但 Template 刚度可以作为 ViewProfile 的 `derived_field`(如"刚度:GUIDED / 当前偏离数:3")
- **ADR-0007 Checkpoint**:Instance 级 Checkpoint 机制不受刚度影响,所有模式都要写 Checkpoint
- **process INV-12** Profile active 后 effective_graph 不可修改:STRICT 保持,GUIDED 改为"允许 Deviation 但不改 effective_graph",ADVISORY 不生成 Profile
- **process INV-23** Activity 状态转移严格按 BPMN:STRICT 保持,GUIDED 下转移可记 Deviation 后继续,ADVISORY 不追踪
- **process Q2** SubProcess vs CallActivity 嵌套:与本 ADR 正交,留给 ADR-0011

## 6. 标准对齐

- **ISO 42001 §A.9 Responsible Use**:刚度声明让"AI 系统的运行边界"显式,可审计
- **ISO 42001 §A.6 Operation**:STRICT 模式对应受控运行;GUIDED 对应辅助运行;ADVISORY 对应推荐运行
- **ISO 24748-2 Tailoring**:刚度作为 Tailoring 维度的一种,显式承载
- **ISO 9001 §4.4**:过程控制根据风险调整严格度(本 ADR 把"严格度"显式为字段)
- **SPEM 2.0 Variability**:刚度本质是 Variability 的一种,通过 MethodConfiguration 可覆盖
- **架构红线**:
  - **可审计性**:STRICT 下 Deviation 触发 Gate + 强留痕;GUIDED 下 Deviation 留痕但不强制 Gate;ADVISORY 不追踪
  - **可追溯性**:所有刚度下 Template 版本 + fingerprint 保留;Instance 知道自己跑的是哪个 Template 哪个刚度
  - **可裁剪性**:组织级 / 项目级 MethodConfiguration 可覆盖刚度,这就是可裁剪性的体现

## 7. 后续行动

### 本 ADR 接受后(Accepted)

1. **method-library README §2.5** 增加 rigidity / execution_mode / is_checkpoint 字段说明和不变量
2. **process README §2.1** 同步(索引副本也含这两字段)
3. **process INV-12 / INV-23 按刚度分支** 的细化(独立 ADR 或 §2.4.3 澄清)
4. **默认家族刚度表** 落到 method-library 仓的初始预设

### 短期(段 3 代码实施前)

1. **ADR-0012 · ActivityDeviation + change-request Gate**(本 ADR 的前置依赖,段 3 起草 —— 讨论笔记见 `architecture/adr/drafts/0012-deviation-discussion-notes.md`,含 Q1~Q8 已推演的结论 + 前置问题清单)
3. **process 引擎按刚度分支的实现规划**
4. **Marketplace Publish Gate 强制 rigidity 显式声明的规则**

### 中期

1. 观察实际使用数据,判断三级是否足够
2. 是否需要引入 **"混合刚度"**(一个 Template 内不同 Activity 不同刚度)—— 目前禁止,未来看需求
3. STRICT → GUIDED → ADVISORY 的**降级路径**(Template 从严到松的版本演进)

### 长期

1. 若 GUIDED 使用远大于 STRICT,考虑把 STRICT 作为"特殊合规扩展"拆成独立 Plugin
2. 评估刚度字段是否能扩展到其他方法资产(如 ViewProfile 的刚度:强制 vs 推荐)

## 8. 参考

- `domain/process/README.md` §2.1 ProcessTemplate + §2.4 Activity
- `domain/process/README.md` §2.4.4 Activity 与 WorkItem 的交互语义(本 ADR 前置澄清)
- `domain/method-library/README.md` §2.5 ProcessTemplateDef
- `product/六域模型.md` §六 过程域
- `methodology/standards-discussion/SPEM-2.0.md`(Variability 机制)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(8 种家族 + Tailoring)
- `methodology/standards-discussion/ISO-42001.md`(A.6 / A.9 运行分级)
- 记忆 `feedback_red_lines.md`(可审计性 / 可追溯性 / 可裁剪性)
- 相关 ADR:
  - ADR-0008(completion_policy,与刚度正交)
  - ADR-0009(ViewProfile,不冲突)
  - ADR-0011(流程嵌套机制,与刚度正交)
  - ADR-0012(Deviation 机制,本 ADR 前置,段 3 起草)

## 9. 讨论留痕(本 ADR 的推演过程)

**为什么产生这个 ADR**:用户在讨论"Template 是固定的还是范式"时,指出现有设计**偏向剧本级严格度**,不匹配日常协作场景。推演出"Template 应该是范式,偏离要留痕"的立场。

**关键转折点**:
- 先推演"只有大 Template 够不够"→ 发现缺轻量流
- 再推演"Template 是不是固定的"→ 发现严格度本身要分层
- 再推演"嵌套 / 依赖 / 两轨"→ 确认两轨独立 + 刚度是正交维度

**本 ADR 选择的立场**:
- 不推翻现有 STRICT 能力(合规场景需要)
- 增加 GUIDED / ADVISORY 覆盖范式 / 文档场景
- 通过 `is_checkpoint` 标注让"必须停的节点"显式
- Deviation 留到配套 ADR,避免本 ADR 过重

**未收敛的争议**(留给后续):
- agile-scrum 的默认刚度是 GUIDED 还是 STRICT?合规敏捷团队有需求
- REFERENCE_ONLY 的 Template 是否允许"无 Instance 的 WorkItem 关联"?
- 刚度是否能运行时改变(Instance 启动后升 / 降)?暂定不允许

---

> 本 ADR 处于 Proposed 状态。**转 Accepted 的前置条件**:(1)Aris 本人确认方向;(2)ADR-0012(Deviation 机制)起草至可实施水平 —— 段 3 代码实施阶段触发,讨论笔记已存 `architecture/adr/drafts/0012-deviation-discussion-notes.md`。
