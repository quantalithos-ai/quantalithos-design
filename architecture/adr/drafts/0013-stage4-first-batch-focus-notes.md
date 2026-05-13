# 段 4 第一批内部优先收敛主线草案

> **定位**:本文件**不是正式规则**,也**不是批次顺序的替代**。它是**段 4 第一批真正开始写 `02~09` 时的讨论输入草案**。  
>
> **存档理由**:虽然段 4 的正式批次顺序已经确定为“先按主链分批推进”,但在继续围绕 WorkItem / child WorkItem / ImplementationPlan 讨论时,形成了一个很强的判断:第一批仓真正往 `02~09` 深化时,最值得优先收敛的不是所有主题平均铺开,而是先把“任务拆分模型主线”做实。该判断有价值,但还不足以直接升级为正式规则,因为它需要等第一批仓真正启动时结合实际文档与代码实施成本再验证。因此决定:
>
> - **不**用这条判断覆盖既有的段 4 正式批次顺序
> - 把它保留为**第一批内部优先主题草案**
> - 待真正开始 `L1-identity / L1-conversation / L1-work / L1-process` 的 `02~09` 时,再决定是否转成正式推进原则
>  
> **讨论日期**:2026-05-13  
> **参与者**:Aris + Claude  
> **上下文**:段 4 已确认分批推进顺序 + WorkItem / child WorkItem / ImplementationPlan 主线收口

---

## 一、草案要回答的问题

当前正式记忆里,段 4 的推进顺序已经明确是按主链分批推进:

1. `L1-identity / L1-conversation / L1-work / L1-process`
2. `L1-governance / L1-artifact / L2-runtime / L2-member-service`
3. `L2-member / L2-tools / L2-member-images / L3-method-library / L3-capability-hub`
4. `L4-sandbox / L4-observability / L4-archive`
5. `L5-chat / L5-console`
6. `L5-runner / L5-sync / L5-website / L6-bridges / L6-marketplace`

问题在于:

> **第一批真正进入 `02~09` 时,是否应该把所有主题平均展开,还是先围绕某一条高风险主线优先收敛?**

本草案给出的暂时答案是:

```text
第一批内部,优先围绕
  WorkItem / child WorkItem / ImplementationPlan
这条主线
先把
  artifact → work/process → runtime → test/acceptance
这条链做实。
```

---

## 二、为什么会提出这条草案

### 1. 这条主线跨仓但高度具体

它不是抽象的“全局一致性”口号,而是非常明确的一组对象与边界:
- Backlog / WorkItem / child WorkItem / Iteration 属于 `work`
- Sprint Planning / refinement / review / retro 属于 `process` 节奏节点
- `ImplementationPlan` 是挂在 WorkItem 上的执行型对象/产物
- Runtime 会读取、生成、更新 `ImplementationPlan`,并在必要时 promote 为 child WorkItem
- Chat / Console 会以受控方式展示协作级任务树与执行计划视图

### 2. 这条主线最容易混边界

如果不先收敛,后续写 `02~09` 时极容易反复摇摆:
- 把 Sprint Planning 写成创建 Backlog 的地方
- 把个人执行步骤污染到 Backlog / WorkItem 真相层
- 把 `ImplementationPlan` 写成 child WorkItem
- 把 process / work / artifact / runtime 的真相与节奏边界混在一起

### 3. 它最适合检验新的 04~09 文档体系是否真的有用

这条主线天然要求:
- `04-配置设计` 考虑任务升级阈值、planning/review/gate 相关配置
- `05-测试方案` 覆盖 proposal / accepted / rejected / promote / Iteration entry
- `06-验收标准` 明确 WorkItem 真相与 ImplementationPlan 视图不混淆
- `07-实施计划` 需要按该模型安排实现顺序
- `09-部署与运维手册` 未来要承接 plan / evidence / promote 后的运行与排障语义

因此它是最适合用来验证“新文档体系是否从设计闭环走向交付闭环”的第一条主线。

---

## 三、草案的准确定位

本草案**不是**说:

```text
段 4 第一批正式顺序改为:
artifact → work/process → runtime → test/acceptance
```

这种表达会和已确认的正式批次顺序冲突。

本草案真正表达的是:

```text
段 4 第一批正式顺序仍然是:
  L1-identity / L1-conversation / L1-work / L1-process

但在第一批内部,最值得优先收敛和率先压实的设计主线,
是 WorkItem / child WorkItem / ImplementationPlan 这一组对象与边界,
并且它会自然牵出 artifact、runtime、test/acceptance 的后续衔接。
```

也就是说:
- **批次顺序** 不变
- **批次内部优先主题** 可以有轻重

---

## 四、这条主线若成立,会影响哪些仓

### 第一批直接受影响
- `L1-work`
- `L1-process`

### 第一批讨论中需要引用/冻结边界的仓
- `L1-artifact`
- `L2-runtime`

### 第一批进入 04~09 时需要同步考虑的文档类型
- `04-配置设计.md`
- `05-测试方案.md`
- `06-验收标准.md`

### 后续前台/后台投影层将消费这条主线
- `L5-chat`
- `L5-console`

---

## 五、当前已经形成的最小共识

截至目前,可先视为“已形成,但待正式阶段验证”的最小共识有:

1. `Backlog` 先存在,可以为空池
2. `Sprint Planning` 不创建 Backlog,而是从 Backlog 选择 WorkItem 形成 Iteration 承诺子集
3. `child WorkItem` 是协作级拆分,仍属于 work 域正式工作事实
4. `ImplementationPlan` 不是 child WorkItem,而是挂在 WorkItem 上的执行型对象/产物
5. 默认不把个人执行步骤升级为 WorkItem; 只有进入协作、依赖、排期、验收、风险视野时才 promote 为 child WorkItem
6. Process 负责节奏,Work 负责工作事实,Artifact 负责 execution object/证据承载,Runtime 负责消费和推进执行计划

---

## 六、待正式阶段再决定的问题

以下问题当前先不升格为正式规则,等第一批真正写 `02~09` 时再做最后决策:

1. `ImplementationPlan` 是否正式进入 artifact kind 枚举
2. `PlanItem` 是否需要独立状态机与 planning_status
3. child WorkItem 的 `proposed / accepted / rejected` 是否单独建 planning 维度
4. 第一批是否真的应该优先把 `work/process` 的 02/03 先做深,再拉 `artifact/runtime`
5. 是否需要把这条“第一批内部优先主线”升级成永久记忆中的正式推进规则

---

## 七、当前建议的使用方式

- 现在先把本文件作为**讨论草案**保留在 `architecture/adr/drafts/`
- 后续真正开始第一批 `02~09` 时,拿本文件对照:
  - 这条主线是否仍然是最高优先级
  - 是否需要少量并批 `artifact/runtime`
  - 是否要把草案里的结论转为正式规则或 ADR 输入

---

## 八、结论

本草案的结论可以暂时压缩成一句话:

> **段 4 第一批的正式顺序不变,但在第一批内部,WorkItem / child WorkItem / ImplementationPlan 这条主线很可能是最值得优先做实的高风险主线; 当前先以草案保留,待真正进入 `02~09` 时再正式定稿。**
