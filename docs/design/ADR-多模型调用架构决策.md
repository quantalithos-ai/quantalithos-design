# Agent 调用其他模型 — 方案对比分析

> 场景：当前 Agent（如 Claude）需要调用其他模型完成特定任务（画图/翻译/视觉分析等）

---

## 业界做法总结

| 框架 | 模式 | 做法 |
|------|------|------|
| OpenAI Agents SDK | Handoff | Agent A 将控制权完全交给 Agent B（不同模型），B 完成后返回 |
| LangGraph | Tool Node | 将"调用另一个模型"封装为图中的一个节点，主 Agent 不感知 |
| CrewAI | Tool 封装 | 将 DALL-E/Replicate 封装为 Tool，Agent 通过 function calling 调用 |
| AG2 (AutoGen) | Task Delegation | Agent 通过 tool calling 委托子任务给另一个 Agent（可以是不同模型） |
| Anthropic Sub-Agent | 独立上下文 | 主 Agent 精确构造子 Agent 的上下文，子 Agent 用不同模型独立执行 |
| WorkOS | Model Router | 根据任务类型自动路由到最适合的模型（调用者无感知） |

---

## 四种方案对比

### 方案 A：Tool 封装（CrewAI 模式）

```
Agent（Claude）
    │
    │ function calling
    │
    │ act: generate_image(prompt="架构图...", model="dall-e-3")
    │
    ▼
ToolExecutor 执行 generate_image 工具
    │
    │ 内部调用 OpenAI Images API
    │
    ▼
返回 ToolResult { output: "图片已保存到 /workspace/arch.png" }
```

**实现方式：** 将"调用其他模型"封装为普通工具（ToolDefinition），Agent 通过 function calling 调用。

**优点：**
- 最简单 — 复用现有的工具机制，不需要新架构
- Agent 有控制权 — Agent 决定何时调用、传什么 prompt
- 结果可追溯 — 工具调用记录在 ExecutionTrace 中
- 渐进式 — 按需添加新工具（generate_image / translate / analyze_image）

**缺点：**
- Agent 需要知道有哪些模型可用（工具列表膨胀）
- 每个模型能力需要单独封装为工具（维护成本）
- 复杂任务（如"画一张图然后分析它"）需要多轮工具调用

**适用场景：** 简单的单次调用（生成一张图、翻译一段文字）

---

### 方案 B：Sub-Agent 委托（Anthropic/OpenAI 模式）

```
主 Agent（Claude，TL 角色）
    │
    │ act: delegate_task(
    │   task="生成系统架构图",
    │   model="dall-e-3",
    │   context="项目是博客系统，包含前后端分离..."
    │ )
    │
    ▼
runtime 创建临时 Sub-Agent
    │
    │ 独立上下文（不共享主 Agent 的对话历史）
    │ 使用指定模型（dall-e-3）
    │ 执行单一任务
    │
    ▼
Sub-Agent 完成 → 结果返回给主 Agent
    │
    ▼
主 Agent 继续（拿到图片路径，插入 PRD）
```

**实现方式：** 新增 `delegate_task` 工具，runtime 内部创建临时 Sub-Agent（不同模型、独立上下文）。

**优点：**
- 上下文隔离 — Sub-Agent 只看到必要信息，不膨胀主 Agent 对话
- 模型灵活 — 每个子任务可以用最适合的模型
- 复杂任务 — Sub-Agent 可以多轮执行（如"画图 → 自检 → 修改"）
- 符合 Anthropic 最佳实践

**缺点：**
- 实现复杂 — 需要管理 Sub-Agent 生命周期
- 延迟高 — 创建 Sub-Agent + 多轮执行 + 返回
- 成本高 — 每个 Sub-Agent 都有独立的 token 消耗
- 错误处理复杂 — Sub-Agent 失败时主 Agent 如何恢复？

**适用场景：** 复杂的多步任务（生成设计稿 → 评审 → 修改 → 确认）

---

### 方案 C：Model Router（WorkOS/MoMA 模式）

```
Agent（不感知具体模型）
    │
    │ 正常的 think→act 循环
    │ LLM 调用请求
    │
    ▼
LLMClient（内部 Router）
    │
    │ 根据任务类型自动选择模型：
    │   文字推理 → Claude
    │   图像生成 → DALL-E
    │   代码补全 → Codex
    │   翻译 → DeepL API
    │
    ▼
返回结果（Agent 不知道用了哪个模型）
```

**实现方式：** 在 LLMClient 内部增加路由逻辑，根据请求内容自动选择模型。

**优点：**
- Agent 无感知 — 不需要改 Agent 的工具列表或行为
- 自动优化 — 系统自动选择最优模型（成本/质量/速度平衡）
- 统一接口 — 所有模型调用走同一个 LLMClient

**缺点：**
- 路由准确性 — 如何判断"这个请求应该用图像模型"？
- 不适合显式调用 — Agent 想"我要画一张图"时，Router 可能不知道
- 黑盒 — Agent 不知道用了什么模型，调试困难
- 只适合同类任务的模型切换（如 Claude vs GPT），不适合跨模态

**适用场景：** 同类模型间的智能切换（成本优化、负载均衡）

---

### 方案 D：Skill 插件（Phase 3 扩展）

```
Agent（Claude，TL 角色）
    │
    │ 角色定义中安装了 "image_generation" skill
    │
    │ act: 使用 skill 中预定义的工作流
    │
    ▼
Skill = 预封装的"模型 + prompt 模板 + 后处理"
    │
    │ image_generation skill 内部：
    │   1. 用 Claude 生成图片描述（优化 prompt）
    │   2. 调用 DALL-E 生成图片
    │   3. 用 Claude Vision 检查图片质量
    │   4. 不合格则重新生成
    │
    ▼
返回最终结果
```

**实现方式：** 将"调用其他模型"封装为 Skill（ProcessDefinition），Skill 内部编排多个模型的调用。

**优点：**
- 可复用 — Skill 可以发布到 marketplace，其他项目直接安装
- 质量保证 — Skill 内部可以有自检/重试逻辑
- 声明式 — 用 YAML 定义 Skill 的步骤，不需要写代码
- 与现有架构完美对齐 — Skill 就是一种 ProcessDefinition

**缺点：**
- 实现最复杂 — 需要 Skill 引擎（Phase 3）
- 灵活性低 — 预定义的 Skill 可能不覆盖所有场景
- 前期投入大 — 需要设计 Skill 格式、执行引擎、marketplace 集成

**适用场景：** 标准化的复杂多模型任务（设计稿生成、多语言文档、代码审查+修复）

---

## 推荐方案

| Phase | 方案 | 理由 |
|-------|------|------|
| Phase 1 | **不实现** | Phase 1 只用 Claude，不需要多模型 |
| Phase 2 | **方案 A（Tool 封装）** | 最简单，复用现有工具机制，按需添加 |
| Phase 3 | **方案 A + B 组合** | 简单任务用 Tool，复杂任务用 Sub-Agent 委托 |
| Phase 4 | **方案 D（Skill）** | 标准化后发布到 marketplace |

**Phase 2 具体实现（方案 A）：**

```python
# 新增工具（注册到 ToolRegistry）

GENERATE_IMAGE = ToolDefinition(
    name="generate_image",
    description="调用图像生成模型创建图片",
    parameters={...},
    handler=image_generation_handler,
)

ANALYZE_IMAGE = ToolDefinition(
    name="analyze_image", 
    description="调用视觉模型分析图片内容",
    parameters={...},
    handler=image_analysis_handler,
)

TRANSLATE = ToolDefinition(
    name="translate",
    description="调用翻译模型翻译文本",
    parameters={...},
    handler=translation_handler,
)
```

**Phase 3 追加（方案 B）：**

```python
DELEGATE_TASK = ToolDefinition(
    name="delegate_task",
    description="委托复杂任务给专门的 Sub-Agent（可指定模型）",
    parameters={
        "task": "任务描述",
        "model": "目标模型（可选，不指定则自动选择）",
        "context": "提供给 Sub-Agent 的上下文",
        "max_rounds": "最大执行轮次",
    },
    handler=delegate_task_handler,
)
```

---

## 与现有架构的关系

```
不需要新增子项目。

方案 A（Tool 封装）：
  修改 runtime 的 ToolRegistry，新增几个工具定义即可。
  工具 handler 内部调用各模型的 API。

方案 B（Sub-Agent）：
  修改 runtime 的 AgentExecutor，支持创建临时 Sub-Agent。
  Sub-Agent 复用现有的 LLMClient（只是 model 参数不同）。

方案 C（Router）：
  修改 runtime 的 LLMClient.resolve_model()，增加路由逻辑。
  已有的三层覆盖机制（role_override > project_default > system_default）
  可以扩展为四层：task_type_override > role_override > ...

方案 D（Skill）：
  复用现有的 ProcessDefinition + BPMNEngine。
  Skill = process_type="skill" 的 ProcessDefinition。
  已在 platform 的 ProcessTemplate 中预留了 skill 类型。
```
