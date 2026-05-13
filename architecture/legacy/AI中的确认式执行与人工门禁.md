# AI中的确认式执行与人工门禁

> ⚠️ **状态:2026-05-08 被 A 方案吸收**  
>
> 本文讨论的"确认式执行"与"人工门禁"两个概念,在 A 方案下升级为治理域的一等对象:
>
> - **门禁 Gate** → 治理域聚合根,含 trigger / decision_request / candidate_options / evidence_requirement / resolution / audit_trail 六段
> - **确认式执行** → Runtime Tool Invoker 的前置 policy check + Member 的 attention 过滤
>
> 权威文档:`product/六域模型.md`(待写)§治理域 + `methodology/standards-discussion/ISO-42001.md`
>
> 本文保留仅作历史讨论来源,不作权威引用。

---

## 一、问题背景(Phase 1 遗留,已过时)

像 Cursor 这类 IDE 在执行“写文档、改代码、写文件”这类动作时，通常不会让 AI 直接无条件落盘，而是先把修改内容以 diff、草稿或 proposal 的形式展示给用户，再由用户手动确认是否应用。

这种机制的核心不是“多点一次按钮”，而是把 AI 的能力限制在“提出建议”和“生成候选修改”层，把最终执行权保留给用户。

一句话概括：

> AI 负责提议，人负责授权。

---

## 二、这种逻辑在 AI 中最常见的术语

### 1. Human-in-the-Loop（HITL）

这是最常见、最标准的说法。

含义：
- AI 不能独立完成整个动作链
- 在关键动作发生前，必须有人参与确认
- 人是流程中的必要决策点

像“AI 先生成修改草案，用户确认后才真正写入文件”，就是典型的 Human-in-the-Loop。

### 2. Approval Gate / Human Approval Gate

如果更强调“必须确认才能继续”，通常会叫：
- `Approval Gate`
- `Human Approval Gate`

含义：
- 某个动作不是自动执行
- 而是需要经过一个人工批准门禁

这是一种很典型的流程化表达方式。

### 3. Gated Autonomy

在 Agent 设计中，也经常用这个词。

含义：
- AI 具备一定自主能力
- 但这种自主能力不是完全开放的
- 高风险或高副作用动作必须经过 gate 控制

例如：
- 阅读代码、分析文档可以自动进行
- 但写文件、删文件、执行命令、发消息等动作需要人工确认

### 4. Mixed-Initiative Interaction

这是更偏人机协作研究领域的术语。

含义：
- 不是人单向指挥 AI
- 也不是 AI 完全自主行动
- 而是人和 AI 都可以发起动作，但关键节点需要协同决策

像“AI 主动提出修改，用户决定是否应用”，就很符合 mixed-initiative 的特点。

---

## 三、如果把它看成一种设计模式

可以把它概括成：

> 受控自治（Gated Autonomy） + 人在回路（Human-in-the-Loop） + 批准门禁（Approval Gate）

如果用更产品化的语言，也可以叫：
- 确认式执行
- 批准后执行
- 人工门禁式 Agent
- 半自动 / 监督式 Agent

它的核心结构不是：

```text
plan -> act -> write -> continue
```

而是：

```text
plan -> propose -> human approve -> apply -> continue
```

这里多出来的关键步骤是：
- `propose`
- `approve`

这正是它和完全自动 Agent 的本质区别。

---

## 四、这种设计为什么常见

### 1. 控制副作用

AI 可以自动分析、理解、生成草稿，但一旦真正“写入文件”，就会对外部世界产生副作用。

因此系统通常会做一层动作分级：
- 无副作用动作：可自动执行
- 有副作用动作：需人工确认

### 2. 保留用户主权

在 IDE 里，代码库和文档本质上属于用户。

因此比较合理的原则是：
- AI 是协作者
- 用户是最终授权者

### 3. 降低误改风险

即使 AI 很强，也可能：
- 理解偏差
- 修改范围过大
- 改到不希望修改的文件
- 产出不符合预期的表达风格

因此“先展示 proposal，再确认 apply”是一种风险隔离机制。

### 4. 建立可审计交互链路

这类系统通常会自然形成一条清晰链路：
- proposal
- review
- approval
- apply

这样每一步都更容易追踪和回放。

---

## 五、在 AI 协作系统中的分层理解

这种逻辑通常同时存在于三层。

### 1. 交互层

表现为：
- diff preview
- apply / reject
- confirm dialog
- approve before run

### 2. 运行时控制层

表现为：
- tool call 需要 approval
- write / delete / execute 被定义为 gated action
- 不同动作有不同 permission level

### 3. 流程层

表现为：
- AI 提出变更
- 用户确认是否允许执行
- runtime 负责真正应用
- 再返回执行结果

---

## 六、放到当前 AI 协作平台框架中的映射

如果把这类 IDE 的逻辑映射到当前讨论中的框架，可以理解为：

> 对“写文件”这种高副作用动作，加了一个 human approval gate。

可以映射成：
- `agent`：提出修改草案
- `runtime`：生成 diff / 待确认动作 / gate
- `user`：审批者
- `gate`：`apply_change_gate`
- `approval`：用户确认是否应用
- `apply`：runtime 真正执行写入

也就是说，这种模式完全可以落到你们已经在讨论的：
- gate
- approval
- runtime
- agent
- fallback

这套框架之中。

---

## 七、一个更清晰的结构图

```text
+---------+
|  Agent  |
|---------|
| 生成修改草案 |
+----+----+
     |
     v
+----------------+
| Runtime        |
|----------------|
| 生成 proposal   |
| 打开 approval gate |
+--------+-------+
         |
         v
+----------------+
| User           |
|----------------|
| approve / reject |
+--------+-------+
         |
         v
+----------------+
| Runtime        |
|----------------|
| apply / discard |
| 记录审计结果    |
+----------------+
```

---

## 八、最简结论

如果只保留一句话，最准确的表达是：

> “像 Cursor 这种 IDE 里，AI 提建议、真正写入前需要用户手动确认”的逻辑，最标准的术语是 `Human-in-the-Loop`；如果强调它是流程控制点，也可以叫 `Approval Gate`；如果强调它限制 AI 自主权，则可以叫 `Gated Autonomy`。

如果只保留一个最推荐的术语，优先推荐：

- `Human-in-the-Loop (HITL)`

如果要放到系统设计语境里，推荐组合表达为：

- `Human-in-the-Loop + Approval Gate + Gated Autonomy`
