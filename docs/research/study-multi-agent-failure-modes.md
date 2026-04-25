# 多 Agent 失败模式与错误级联

> 论文：Why Do Multi-Agent LLM Systems Fail? (arxiv 2503.13657)
> 论文：Modeling and Mitigating Error Cascades (arxiv 2603.04474)
> 对我们的价值：14 种失败模式作为架构设计 checklist

---

## 一、14 种失败模式

7 个框架、200+ 任务、6 名专家标注，归为 3 大类：

### 类别 A：规格与系统设计失败

```
1. 任务定义不清（Underspecified Task）
   Agent 不知道具体要做什么
   
   我们的防御：
   ✅ NodeAssignment.action 是自然语言任务描述
   ✅ output_schema 明确定义输出格式
   ✅ input_refs 提供输入上下文
   ⚠️ 需要确保 action 足够具体，不能只写"实现功能"

2. 角色边界模糊（Ambiguous Role Boundaries）
   两个 Agent 都认为某件事是自己的职责，或都认为不是
   
   我们的防御：
   ✅ RoleDefinition.constraints 明确"不做什么"
   ✅ 角色的 tools 列表限制了能力边界
   ⚠️ 需要在角色定义中加入"职责边界说明"

3. 工具能力不匹配（Tool Capability Mismatch）
   Agent 需要的工具没有被提供，或提供的工具不适合任务
   
   我们的防御：
   ✅ 角色级 tools + 节点级 allowed_tools 两层控制
   ⚠️ 需要在 NodeAssignment 下发前校验：Agent 的 tools 是否覆盖任务需求

4. 系统 prompt 冲突（Instruction Conflicts）
   系统级指令和用户级指令矛盾
   
   我们的防御：
   ✅ 三层 prompt 组装有优先级
   ⚠️ 需要确保 shared_rules 硬约束不被项目级 prompt 覆盖
   参考：arxiv 2509.23188
```

### 类别 B：Agent 间协调失败

```
5. 信息丢失（Information Loss）
   Agent A 的产出传递给 Agent B 时，关键信息丢失
   
   我们的防御：
   ✅ output_schema 结构化输出，不是自由文本
   ✅ NodeResult.output 是 JSON，字段明确
   ⚠️ 需要确保 output_schema 覆盖所有下游需要的字段

6. 冲突决策（Conflicting Decisions）
   Agent A 决定用方案 X，Agent B 决定用方案 Y，互相矛盾
   
   我们的防御：
   ✅ TL 统一做技术决策（阶段 2）
   ✅ 设计评审（session）达成共识
   ⚠️ 阶段 3 并行开发时，两个开发 Agent 可能做出冲突的设计决策
   → 需要 TL 在代码审查时检测冲突

7. 死锁（Deadlock）
   Agent A 等待 Agent B 的输出，Agent B 等待 Agent A 的输出
   
   我们的防御：
   ✅ DAG 依赖图调度，不允许循环依赖
   ✅ flow daemon 检测死锁（所有任务都 blocked）
   ⚠️ ask_teammate 可能导致死锁（A 问 B，B 问 A）
   → 需要 ask_teammate 加超时机制

8. 过度协作（Over-Collaboration）
   Agent 之间过多的来回沟通，浪费 token，不推进任务
   
   我们的防御：
   ✅ session 有 moderator 控制讨论节奏
   ✅ think→act 循环有 max_rounds 限制
   ⚠️ ask_teammate 没有次数限制
   → 需要加 ask_teammate 调用次数上限

9. 责任推诿（Responsibility Diffusion）
   出了问题没有 Agent 承担责任，互相推诿
   
   我们的防御：
   ✅ 每个 NodeAssignment 明确指定 agent_id
   ✅ NodeResult 记录谁提交的
   ⚠️ 需要在 NodeResult 中记录推理链（为什么这么做）
   参考：arxiv 2510.07614
```

### 类别 C：任务验证与终止失败

```
10. 过早宣称完成（Premature Completion）
    Agent 说"我做完了"但实际没做完
    
    我们的防御：
    ✅ submit_step_result 的 output_schema 强制要求必填字段
    ✅ verification-before-completion（跑测试证明完成）
    ⚠️ output_schema 只校验格式，不校验内容质量
    → 需要代码审查（TL）和测试（QA）双重验证

11. 无法检测错误（Undetected Errors）
    Agent 产出有错误但没有被发现
    
    我们的防御：
    ✅ 代码审查（TL 审查）
    ✅ 测试（QA 测试）
    ✅ 集成测试（阶段 4）
    ⚠️ 需要引入"怀疑机制"（见下方错误级联部分）

12. 无限循环（Infinite Loop）
    Agent 陷入重复操作，不终止
    
    我们的防御：
    ✅ max_think_act_rounds = 20
    ✅ AgentWorkflowEngine 有步骤超时
    ⚠️ 工作流级别的循环（on_fail → 回到前面的节点）可能无限循环
    → 需要加最大重试次数

13. 幻觉产出（Hallucinated Output）
    Agent 产出看起来合理但实际是编造的
    
    我们的防御：
    ✅ verification-before-completion（用实际运行结果证明）
    ✅ 代码审查（TL 检查代码是否真的实现了功能）
    ⚠️ PRD 和设计文档的幻觉更难检测
    → 需要用户在门禁审批时仔细审阅

14. 格式不兼容（Format Incompatibility）
    Agent A 的输出格式和 Agent B 期望的输入格式不匹配
    
    我们的防御：
    ✅ output_schema 统一定义输出格式
    ✅ submit_step_result 通过 function calling 保证格式
    ✅ 下游 Agent 通过 input_refs 获取上游产出
```

## 二、错误级联（Error Cascades）

```
核心发现（arxiv 2603.04474）：

  TL 写 PRD 时有一个小错误（遗漏了标签唯一约束）
    │
    ▼
  开发 Agent 读 PRD → 没有质疑 → 实现时也没加唯一约束
    │
    ▼
  测试 Agent 按 PRD 写测试 → 测试用例也没覆盖唯一约束
    │
    ▼
  代码审查 → TL 自己写的 PRD，自己审查代码 → 没发现问题
    │
    ▼
  集成测试通过 → 上线后用户创建了重复标签 → BUG

  错误在流水线中"固化"并逐步放大
  后续 Agent 倾向于信任前序 Agent 的输出
```

### 怀疑机制设计

```
在以下环节注入"怀疑提示"：

1. 代码审查 prompt：
   "你正在审查 {developer} 的代码。
    注意：前序产出（PRD、设计文档）可能有遗漏或错误。
    请独立验证代码是否满足实际需求，不要只对照 PRD 检查。
    特别关注：边界条件、唯一约束、并发安全、错误处理。"

2. 测试 prompt：
   "你正在为 {task} 编写测试。
    注意：实现代码可能有 BUG，PRD 可能有遗漏。
    请从用户视角独立设计测试用例，不要只按 PRD 的验收标准写。
    特别关注：边界值、异常输入、并发场景、安全漏洞。"

3. 阶段交接校验：
   每个阶段的入口节点加入"前序产物校验"步骤：
   "请审阅前一阶段的产出，检查是否有遗漏或不一致。
    如果发现问题，通过 ask_teammate 向 TL 确认。"
```

## 三、设计 Checklist

每次设计新功能或修改架构时，逐一检查：

- [ ] 1. 任务定义是否足够具体？（action + output_schema + input_refs）
- [ ] 2. 角色边界是否清晰？（constraints + tools 限制）
- [ ] 3. 工具是否匹配任务需求？（allowed_tools 覆盖度）
- [ ] 4. prompt 优先级是否正确？（shared_rules > role > context）
- [ ] 5. 结构化输出是否覆盖下游需求？（output_schema 字段完整性）
- [ ] 6. 并行 Agent 是否可能冲突？（TL 审查时检测）
- [ ] 7. 是否有死锁风险？（DAG 无环 + ask_teammate 超时）
- [ ] 8. 协作是否有次数限制？（ask_teammate 上限 + session 轮次）
- [ ] 9. 每个操作是否有责任归属？（NodeResult 记录 agent_id + 推理链）
- [ ] 10. 完成条件是否可验证？（测试通过 + 审查通过，不只是格式正确）
- [ ] 11. 是否有独立的错误检测？（不依赖前序 Agent 的判断）
- [ ] 12. 循环是否有退出条件？（max_rounds + max_retries）
- [ ] 13. 产出是否有实际运行证据？（verification-before-completion）
- [ ] 14. 输出格式是否与下游兼容？（output_schema + function calling）

## 四、参考

- 失败模式分类：https://arxiv.org/abs/2503.13657
- 错误级联：https://arxiv.org/abs/2603.04474
- 指令冲突：https://arxiv.org/abs/2509.23188
- 可追溯性：https://arxiv.org/html/2510.07614
