# OpenClaw / Superpowers 调研

> Markdown 编码的软件开发工作流，通过 SKILL.md 约束 AI Agent 行为
> 对我们的价值：Skill 系统设计、Agent 行为约束方式、代码审查流程

---

## 一、定位

Superpowers（OpenClaw）是一套用 Markdown 编码的软件开发工作流。不是框架，是一组 SKILL.md 文件，通过注入 system prompt 约束 AI Agent（如 Claude Code、Cursor）的行为。

与其他框架的本质区别：
- LangGraph / CrewAI / AutoGen：代码级框架，控制 Agent 的执行流程
- Superpowers：prompt 级约束，不控制执行流程，靠 LLM 自觉遵守

## 二、核心概念

### 2.1 Skill（技能）

每个 Skill 是一个 SKILL.md 文件，定义 Agent 在特定场景下的行为规范。

```markdown
# SKILL.md: test-driven-development

## 触发条件
当用户要求实现功能时，必须按 TDD 方式执行。

## 步骤
1. 读工单，理解要做什么
2. 写一个失败的单元测试
3. 跑测试，确认失败（红色）
4. 写最少的代码让测试通过
5. 跑测试，确认通过（绿色）
6. 重构代码
7. 跑验证命令，确认全部通过
8. 提交代码 + 测试

## 硬规则
- 不允许在没有失败测试的情况下写生产代码
- 不允许跳过步骤 3（确认红色）
- 不允许在步骤 8 之前宣称完成
```

### 2.2 14 个技能的完整工作流

```
using-superpowers（加载技能系统）
  → brainstorming（头脑风暴，设计确认）
    → writing-plans（拆步骤写计划）
      → using-git-worktrees（创建隔离工作目录）
        → subagent-driven-development（子 Agent 实现）
          或 executing-plans（按 Todo 逐步执行）
            → test-driven-development（TDD 循环）
            → systematic-debugging（系统化调试）
            → dispatching-parallel-agents（并行派发）
              → requesting-code-review（请求审查）
                → receiving-code-review（接收审查）
                  → verification-before-completion（完成前验证）
                    → finishing-a-development-branch（收尾）
```

### 2.3 子 Agent 驱动开发

```markdown
# SKILL.md: subagent-driven-development

## 流程
1. 读取计划中的所有任务
2. 对每个任务：
   a. 派发一个子 Agent
   b. 子 Agent 独立实现（在 worktree 中）
   c. 子 Agent 完成后，进行两阶段审查：
      - 规格合规审查（是否按计划实现）
      - 代码质量审查（代码是否合格）
3. 审查通过 → 合并
4. 审查不通过 → 子 Agent 修改后重新审查

## 子 Agent 的上下文
- 只给子 Agent 当前任务的信息
- 不给完整的项目上下文（减少干扰）
- 明确的输入（文件路径、命令）和输出（验证方式）
```

### 2.4 行为约束方式

Superpowers 的约束全部是 prompt 级的：

```
硬门禁（HARD-GATE）：
  "用户批准设计前禁止写代码"
  → 写在 SKILL.md 里，靠 LLM 自觉遵守
  → 没有代码级拦截

完成前验证：
  "宣称完成之前必须跑验证命令，用输出作为证据"
  → 写在 SKILL.md 里
  → LLM 可能伪造"已验证"

禁止行为：
  "禁止凭症状盲目打补丁"
  → 写在 SKILL.md 里
  → LLM 可能违反
```

## 三、对我们项目的启示

### 3.1 Skill 的内容可以作为我们的共享规则

```
Superpowers 的 SKILL.md：
  Markdown 文件，注入 system prompt
  靠 LLM 自觉遵守

我们的 shared_rules：
  YAML 文件，content 字段注入 prompt，schema 字段做硬校验

启示：
  Superpowers 的 SKILL.md 内容可以直接迁移到我们的 shared_rules.content
  但我们额外有 schema 做硬校验（Superpowers 没有）
  
  例：TDD 规范
  Superpowers：SKILL.md 里写步骤，靠 LLM 自觉
  我们：content 里写步骤（prompt 约束）+ AgentWorkflowEngine 强制步骤顺序
```

### 3.2 子 Agent 驱动开发的模式值得借鉴

```
Superpowers 的做法：
  1. 主 Agent 读取计划
  2. 对每个任务派发子 Agent
  3. 子 Agent 独立实现
  4. 两阶段审查（规格 + 质量）
  5. 通过 → 合并

映射到我们的设计：
  1. flow 读取任务列表
  2. 对每个任务下发 NodeAssignment
  3. Agent 独立执行（think→act 循环）
  4. code_review 节点（TL 审查）
  5. 通过 → 推进到 testing

区别：
  Superpowers：主 Agent 自己派发子 Agent（prompt 驱动）
  我们：flow 调度 Agent（系统驱动）
  → 我们的方式更可控
```

### 3.3 "只给子 Agent 当前任务的信息"

```
Superpowers 的关键设计：
  子 Agent 不继承父 Agent 的完整上下文
  只给它需要的信息：
  - 当前任务描述
  - 相关文件路径
  - 验证命令
  - 完成标准

这和 Anthropic Agent SDK 的 Sub-Agent 思路一致。

映射到我们的设计：
  NodeAssignment.action = 当前任务描述
  NodeAssignment.input_refs = 相关文件/工单引用
  output_schema = 完成标准
  → 我们已经在做同样的事
```

### 3.4 两阶段审查值得借鉴

```
Superpowers 的审查：
  阶段 1：规格合规（是否按计划实现了要求的功能）
  阶段 2：代码质量（代码是否合格、可维护）

我们当前的 code_review 只有一个节点。
可以考虑拆成两个：
  - spec_review：TL 检查是否符合任务卡要求
  - quality_review：TL 检查代码质量

或者在 review_workflow（Agent 级工作流）里定义两个步骤。
```

## 四、参考

- GitHub：https://github.com/superpowers-ai/superpowers
- 技能参考：docs/design/superpowers技能参考.md（已有）
