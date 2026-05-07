# Superpowers 技能参考

> 来源：/home/aris/OpenSource/superpowers  
> Superpowers 是一套用 Markdown 编码的软件开发工作流，通过 SKILL.md 约束 AI Agent 的行为。  
> 本文档记录其全部 14 个技能，供 AI 公司协作平台设计参考。

---

## 一、技能总览（按工作流顺序）

### 入口/元技能

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 使用超能力 | **using-superpowers** | 总开关——规定所有对话开始前必须先查找并加载技能 |

### 设计与规划阶段

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 头脑风暴 | **brainstorming** | 任何编码前必须先澄清意图和设计，**HARD-GATE**：用户批准设计前禁止写代码 |
| 编写计划 | **writing-plans** | 将设计拆成可执行的小步骤计划，假设执行者零上下文，包含文件路径、命令、验证方式 |

### 环境准备

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 使用 Git Worktree | **using-git-worktrees** | 创建隔离的工作目录做并行分支开发，避免互相干扰 |

### 执行阶段（二选一）

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 子代理驱动开发 | **subagent-driven-development** | 每个任务派一个子 Agent 实现 → 两阶段审查（规格合规 + 代码质量），**推荐路径** |
| 执行计划 | **executing-plans** | 在单独会话中按 Todo 逐步执行计划，适合没有子 Agent 能力的平台 |

### 工程实践（按需穿插）

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 测试驱动开发 | **test-driven-development** | 严格红-绿-重构：先写失败测试，再写生产代码 |
| 系统化调试 | **systematic-debugging** | 四阶段调试流程：先找根因再动手，禁止凭症状盲目打补丁 |
| 并行派发代理 | **dispatching-parallel-agents** | 当任务彼此独立时，拆成多个子 Agent 并行推进 |

### 代码审查

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 请求代码审查 | **requesting-code-review** | 完成功能后派发 code-reviewer 子代理做审查 |
| 接收代码审查 | **receiving-code-review** | 收到审查意见后，先理解验证再修改，禁止空洞附和 |

### 收尾阶段

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 完成前验证 | **verification-before-completion** | 宣称"完成"之前必须跑验证命令，用输出作为证据 |
| 完成开发分支 | **finishing-a-development-branch** | 测试通过后决定如何合并：merge / PR / 清理等 |

### 技能开发

| 技能 | 英文名 | 用途 |
|------|--------|------|
| 编写技能 | **writing-skills** | 用 TDD 方式创建新技能：写 SKILL.md → 子代理压测 → 验证遵守 |

---

## 二、完整工作流串联

```
using-superpowers（加载技能系统）
  → brainstorming（头脑风暴，设计确认）
    → writing-plans（拆步骤写计划）
      → using-git-worktrees（创建隔离工作区）
        → subagent-driven-development 或 executing-plans（执行）
            穿插: test-driven-development（TDD）
            穿插: systematic-debugging（调试）
            穿插: dispatching-parallel-agents（并行）
          → requesting-code-review（请求审查）
            → receiving-code-review（处理审查意见）
              → verification-before-completion（完成前验证）
                → finishing-a-development-branch（合并收尾）
```

---

## 三、关键设计模式

### 1. 硬门禁 (HARD-GATE)

brainstorming 技能中明确规定：**在用户批准设计之前，禁止进入任何实现类操作。**

### 2. 编排者/工人分离

- 主会话（编排者）保留完整协调上下文
- 子 Agent（工人）只拿到裁剪后的任务描述
- 子 Agent 不继承主会话历史，由编排者在 prompt 中粘贴完整任务文本

### 3. 子 Agent 返回结构化状态

| 状态 | 含义 | 后续动作 |
|------|------|----------|
| `DONE` | 完成 | 进入下一步 |
| `DONE_WITH_CONCERNS` | 完成但有顾虑 | 编排者评估是否需要处理 |
| `NEEDS_CONTEXT` | 缺少信息 | 编排者补充上下文后重试 |
| `BLOCKED` | 被阻断 | 升级到用户处理 |

### 4. 两阶段质量门 (subagent-driven-development)

每个任务完成后经过两轮审查：
1. **规格合规审查**：实现是否符合计划/需求
2. **代码质量审查**：代码风格、可维护性、测试覆盖

### 5. 显式并行边界

- 仅当问题域独立且无共享状态时使用 dispatching-parallel-agents
- 计划实施路径上刻意序列化实现子 Agent，防止仓库冲突

### 6. 完成前必须验证

verification-before-completion 要求：**无新鲜证据不宣称成功**。必须跑验证命令并用输出作为证据。

---

## 四、与 AI 团队 6 阶段流程的映射及覆盖状态

| AI 团队阶段 | 对应的 Superpowers 技能 | 状态 | 借鉴要点 |
|-------------|-------------------------|------|----------|
| 阶段 1：需求理解 | brainstorming | ✅ 已实现 | HARD-GATE、一次一问、团队头脑风暴、模糊需求扩展 |
| 阶段 2：设计与规划 | writing-plans | ✅ 已实现 | 自包含工单模板，零上下文可执行，含文件路径和验证命令 |
| 阶段 2（DevOps 并行） | using-git-worktrees | ✅ 已实现 | 分支策略：main→dev→task/*，每任务独立分支 |
| 阶段 3：迭代开发 | subagent-driven-development | ✅ 已实现 | 任务级流水线，两维度代码审查（规格合规+代码质量） |
| 阶段 3（开发方式） | test-driven-development | ✅ 已实现 | TDD 红-绿-重构循环，默认强制，可通过工单配置关闭 |
| 阶段 3（调试方式） | systematic-debugging | ✅ 已实现 | 结构化 BUG_REPORT + 四步调试 + NEEDS_CONTEXT 状态 |
| 阶段 3（并行） | dispatching-parallel-agents | ✅ 已实现 | 动态实例化多个开发并行，独立分支隔离 |
| 阶段 3（代码审查） | requesting-code-review | ✅ 已实现 | 精简上下文审查，按 blocker/major/suggestion 分级 |
| 阶段 3（处理审查） | receiving-code-review | ✅ 已实现 | 先理解验证再修改，禁止空洞附和 |
| 阶段 3（完成校验） | verification-before-completion | ✅ 已实现 | 无新鲜证据不宣称成功，系统强制校验证据字段 |
| 阶段 4.5：分支收尾 | finishing-a-development-branch | ✅ 已实现 | dev→main 合并请求、冲突处理、分支清理 |
| 降级路径 | executing-plans | ✅ 已覆盖 | 单 Agent 时按工单串行执行，由任务规模裁剪覆盖 |
| 元技能 | using-superpowers | ✅ 已实现 | 阶段规则定义，prompt 自动注入 |
| 角色模板开发 | writing-skills | ⏳ 暂缓 | 待系统成熟后补充角色模板的创建和验证流程 |

**覆盖率：14 项中 13 项已实现/已覆盖，1 项暂缓（writing-skills）。**
