# MetaGPT 竞品分析

> GitHub: https://github.com/geekan/MetaGPT (⭐ 50k+)
> 论文: MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework (arxiv 2308.00352)
> 对我们的价值：最相似的开源系统，角色分工 + SOP 流转 + 结构化产物

---

## 一、概述

MetaGPT 自称"First AI Software Company"，核心思想是**用 SOP（标准操作流程）约束多 Agent 协作**。

```
MetaGPT 的核心流程：

用户需求
    │
    ▼
Product Manager → 生成 PRD
    │
    ▼
Architect → 生成系统设计、API 设计、数据模型
    │
    ▼
Project Manager → 生成任务列表
    │
    ▼
Engineer → 实现代码
    │
    ▼
QA Engineer → 编写测试
    │
    ▼
产出：完整的代码项目
```

## 二、核心设计

### 2.1 角色定义

```python
# MetaGPT 的角色定义
class ProductManager(Role):
    name = "Alice"
    profile = "Product Manager"
    goal = "Efficiently create a successful product"
    constraints = "Use the same language as the user"
    actions = [WritePRD]

class Architect(Role):
    name = "Bob"
    profile = "Architect"
    goal = "Design a concise, usable, complete software system"
    actions = [WriteDesign]
```

与我们的对比：
```
MetaGPT Role                    我们的 RoleDefinition
─────────────────────────────────────────────────────
name                            role_name
profile                         identity
goal                            identity 的一部分
constraints                     constraints
actions                         tools + workflows
─                               shared_rules（MetaGPT 没有）
─                               permissions（MetaGPT 没有）
─                               output_schema（MetaGPT 没有）
```

### 2.2 SOP 流转

```python
# MetaGPT 的 SOP 是硬编码在代码里的
class SoftwareCompany(Team):
    def __init__(self):
        self.hire([
            ProductManager(),
            Architect(),
            ProjectManager(),
            Engineer(),
            QAEngineer(),
        ])
        # SOP 顺序硬编码
        # PM → Architect → PM(task) → Engineer → QA
```

与我们的对比：
```
MetaGPT：SOP 硬编码在 Python 代码里
  → 改流程要改代码
  → 不能按项目类型选择不同流程
  → 不能动态裁剪

我们：ProcessDefinition（YAML nodes + edges）
  → 改流程只改 YAML
  → 不同项目类型用不同 Pipeline Template
  → TL 可以提议裁剪
```

### 2.3 结构化产物传递

```python
# MetaGPT 的核心创新：Agent 之间传递结构化产物，不是自由文本
class WritePRD(Action):
    async def run(self, requirements):
        # 产出结构化 PRD（不是自由文本）
        prd = await self._aask(PROMPT_TEMPLATE.format(requirements))
        return Document(content=prd, instruct_content=PRDDocument)
```

MetaGPT 的关键洞察：**Agent 之间传递结构化文档（PRD、设计文档、任务列表），而不是自由对话。** 这大幅减少了信息丢失。

与我们的对比：
```
MetaGPT：结构化文档传递（Document 对象）
我们：output_schema + submit_step_result（JSON Schema 强制格式）

本质相同，但我们的实现更标准化（用 LLM function calling 保证格式）
```

## 三、MetaGPT 的局限性（我们的差异化）

```
┌──────────────────────┬──────────────────┬──────────────────────┐
│ 维度                 │ MetaGPT          │ Quantalithos AI      │
├──────────────────────┼──────────────────┼──────────────────────┤
│ 交互方式             │ CLI（命令行）     │ 可视化群聊（飞书式）  │
│ 流程定义             │ 硬编码 Python     │ BPMN YAML 配置       │
│ 人在回路             │ 无门禁机制        │ 5 级自主性门禁        │
│ 项目持久化           │ 无（一次性执行）  │ 快照 + 持久执行       │
│ 流程可视化           │ 无               │ Pipeline 进度 + 看板  │
│ 多项目管理           │ 不支持           │ 支持                  │
│ 工单管理             │ 无               │ 完整工单系统          │
│ 产物管理             │ 文件输出         │ 版本化 + 搜索         │
│ 工作区同步           │ 无               │ quantalithos-sync     │
│ 外部 Agent 接入      │ 不支持           │ A2A 协议（Phase 3）   │
│ 工具生态             │ 内置工具         │ MCP 兼容（Phase 2）   │
│ 企业级               │ 不支持           │ 多租户 + 审计         │
└──────────────────────┴──────────────────┴──────────────────────┘
```

## 四、可借鉴的设计

```
1. 结构化产物传递
   MetaGPT 的核心创新，我们已经通过 output_schema 实现了

2. 角色的 Action 定义
   MetaGPT 每个角色有明确的 Action 列表（WritePRD、WriteDesign）
   我们的 tools + workflows 更灵活，但可以参考 Action 的粒度

3. 共享消息池（SharedMessage）
   MetaGPT 所有 Agent 共享一个消息池，每个 Agent 按 profile 过滤
   我们的 session（collaboration 模式）类似，但更精细（moderator 控制）

4. 代码审查机制
   MetaGPT 的 Engineer 生成代码后，QA 自动审查
   我们的两阶段审查（TL 代码审查 + QA 测试）更完善
```

## 五、参考

- GitHub：https://github.com/geekan/MetaGPT
- 论文：https://arxiv.org/html/2308.00352v6
- 文档：https://docs.deepwisdom.ai/
