# LLM 路由与成本优化

> 论文：xRouter (arxiv 2510.08439), Adaptive LLM Routing (arxiv 2508.21141)
> 对我们的价值：runtime LLM 调用层支持动态模型选择

---

## 一、问题

```
当前设计：所有 LLM 调用都用同一个模型（如 gpt-4）

实际情况：
  代码审查（复杂推理）→ 需要最强模型（Claude Opus / GPT-4）
  状态更新（简单回复）→ 弱模型就够（Claude Haiku / GPT-4o-mini）
  文件读取决策（判断读哪个文件）→ 中等模型
  
  如果全部用最强模型：
    成本 = 每次 $0.03 × 每任务 20 轮 × 5 个任务 = $3/项目
  
  如果按需选择：
    强模型 5 次 × $0.03 = $0.15
    中模型 10 次 × $0.01 = $0.10
    弱模型 85 次 × $0.001 = $0.085
    总计 = $0.335/项目（节省 89%）
```

## 二、路由策略

### 2.1 基于规则的路由（Phase 1）

```python
# llm/router.py

class LLMRouter:
    def select_model(self, context: dict) -> str:
        """根据上下文选择模型"""
        
        # 代码审查 → 强模型
        if context.get("node_type") == "code_review":
            return "claude-sonnet-4-20250514"
        
        # 技术方案设计 → 强模型
        if context.get("node_type") == "tech_design":
            return "claude-sonnet-4-20250514"
        
        # 简单工具调用决策 → 弱模型
        if context.get("round") > 5 and context.get("last_action") == "tool_call":
            return "claude-haiku"
        
        # 默认 → 中等模型
        return "claude-sonnet-4-20250514"
```

### 2.2 基于 RL 的路由（Phase 3，参考 xRouter）

```
xRouter 的思路：
  训练一个小模型（路由器），输入是任务描述，
  输出是"用哪个模型"的决策。
  
  路由器通过强化学习训练：
    奖励 = 任务完成质量 - 成本
    → 自动学会"简单任务用弱模型，复杂任务用强模型"
```

## 三、runtime 集成

```python
# llm/client.py

class LLMClient:
    def __init__(self, router: LLMRouter):
        self.router = router
        self.clients = {
            "claude-opus": AnthropicClient(model="claude-opus-4-20250514"),
            "claude-sonnet": AnthropicClient(model="claude-sonnet-4-20250514"),
            "claude-haiku": AnthropicClient(model="claude-haiku"),
            "gpt-4": OpenAIClient(model="gpt-4"),
            "gpt-4o-mini": OpenAIClient(model="gpt-4o-mini"),
        }
    
    async def chat(self, request: LLMRequest, context: dict) -> LLMResponse:
        # 路由器选择模型
        model = self.router.select_model(context)
        
        # 用选中的模型调用
        client = self.clients[model]
        response = await client.chat(request)
        
        # 记录选择（用于后续优化路由器）
        logger.info("llm_routing",
            selected_model=model,
            node_type=context.get("node_type"),
            round=context.get("round"),
            tokens=response.usage.total_tokens,
        )
        
        return response
```

## 四、配置

```yaml
# config/runtime.yaml

llm:
  router:
    strategy: rule_based           # rule_based | adaptive (Phase 3)
    
  models:
    strong:
      provider: anthropic
      model: claude-sonnet-4-20250514
      use_for: [code_review, tech_design, prd_writing]
      
    medium:
      provider: anthropic
      model: claude-sonnet-4-20250514
      use_for: [implement, testing, default]
      
    weak:
      provider: anthropic
      model: claude-haiku
      use_for: [status_update, simple_tool_decision]
```

## 五、Phase 分期

| Phase | 范围 |
|-------|------|
| Phase 1 | 固定模型（配置文件指定） |
| Phase 2 | 基于规则的路由（按节点类型选择） |
| Phase 3 | 基于 RL 的自适应路由（xRouter） |

## 六、参考

- xRouter：https://arxiv.org/html/2510.08439
- Adaptive Routing：https://arxiv.org/html/2508.21141v1
