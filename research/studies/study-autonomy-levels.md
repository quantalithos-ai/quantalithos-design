# 自主性分级与动态门禁

> 论文：Levels of Autonomy for AI Agents (arxiv 2506.12469), Agent-Gated Shared Autonomy (AGSA)
> 对我们的价值：门禁机制从 2 级精细化为 5 级

---

## 一、5 级自主性模型

```
Level 1: 操作者（Operator）
  Agent 只执行用户明确指定的操作
  用户："把第 42 行改成 xxx"
  Agent：改了
  → 零自主性，纯执行

Level 2: 协作者（Collaborator）
  Agent 提出建议，用户确认后执行
  Agent："建议加唯一索引，要执行吗？"
  用户："好的"
  Agent：执行
  → 低自主性，每步确认

Level 3: 顾问（Consultant）
  Agent 自主执行，完成后通知用户，用户可以干预
  Agent：自动加了唯一索引
  通知用户："我加了唯一索引，如果不合适请告诉我"
  → 中自主性，事后审查

Level 4: 审批者（Approver）
  Agent 自主执行大部分工作，关键节点等待用户审批
  Agent：完成了整个标签系统
  等待用户："请审批 PRD / 请验收功能"
  → 高自主性，关键点审批

Level 5: 观察者（Observer）
  Agent 完全自主执行，用户只观察
  Agent：从需求到发布全部自动完成
  用户：看看进度就行
  → 完全自主
```

## 二、与我们当前门禁的映射

```
当前设计只有 2 级：

  hard gate = Level 4（审批者）
    Agent 做完后必须等用户确认

  soft gate = Level 5（观察者）
    默认自动通过，用户可以配置为需要确认

缺失的 3 级：

  Level 1（操作者）：用户逐步指导 Agent
    → 适合：用户对 AI 不信任的初期阶段

  Level 2（协作者）：Agent 每步都问用户
    → 适合：高风险操作（数据库迁移、生产部署）

  Level 3（顾问）：Agent 自主执行，完成后通知
    → 适合：日常开发任务（写代码、跑测试）
    → 当前设计里没有这个级别！
```

## 三、精细化门禁设计

```yaml
# Pipeline Template 中的门禁配置

stages:
  - id: requirement
    gate_config:
      autonomy_level: 4              # 审批者：必须用户确认 PRD
      gate_type: hard

  - id: design
    gate_config:
      autonomy_level: 3              # 顾问：自动通过，通知用户
      gate_type: soft
      notify: true                   # 完成后通知用户

  - id: development
    gate_config:
      autonomy_level: 5              # 观察者：完全自动
      gate_type: none

  - id: acceptance
    gate_config:
      autonomy_level: 4              # 审批者：必须用户验收
      gate_type: hard

# 节点级也可以配置
nodes:
  - id: database_migration
    gate_config:
      autonomy_level: 2              # 协作者：每步确认
      gate_type: hard
      reason: "数据库迁移是高风险操作"
```

## 四、动态门禁（AGSA，Phase 3）

```
当前：门禁位置是预定义的（Pipeline Template 里写死）

AGSA 的思路：Agent 自己决定何时请求人类帮助

例：
  Agent 在实现标签系统时遇到不确定性：
  "标签名是否需要支持中文？PRD 里没说明。"
  
  Agent 的置信度：0.3（低）
  → 自动触发门禁："请确认标签名是否支持中文"
  
  如果置信度是 0.9（高）：
  → 不触发门禁，自己决定

实现方式：
  Agent 的工具列表中加入 request_human_input 工具
  Agent 根据自身判断决定是否调用
  → 不是预设的固定门禁，而是 Agent 主动请求
```

## 五、Phase 分期

| Phase | 范围 |
|-------|------|
| Phase 1 | 2 级（hard/soft），固定位置 |
| Phase 2 | 5 级自主性，节点级配置 |
| Phase 3 | 动态门禁（Agent 主动请求） |

## 六、参考

- 自主性分级：https://arxiv.org/html/2506.12469v1
- AGSA：https://openreview.net/forum?id=LfekK1E0QE
