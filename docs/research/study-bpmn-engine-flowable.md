# Flowable / Camunda — BPMN 引擎工程参考

> Flowable: https://www.flowable.com/
> Camunda: https://camunda.com/
> 对我们的价值：quantalithos-flow BPMN 引擎的工程实现参考

---

## 一、概述

Flowable 和 Camunda 是两个最成熟的开源 BPMN 引擎，已在企业级生产环境运行多年。

```
Flowable：
  - Java 实现
  - 支持 BPMN 2.0、CMMN、DMN
  - 已开始支持 AI Agent 编排
  - 文档：https://documentation.flowable.com/latest/ai/ai-orchestration

Camunda：
  - Java 实现（Zeebe 是 Go 实现的分布式版本）
  - 支持 BPMN 2.0、DMN
  - 正在探索 AI 工作流编排
  - Zeebe 的分布式架构对 Phase 2 扩展有参考价值
```

## 二、BPMN 引擎的核心能力

```
我们的 flow 引擎需要实现的能力（参考 Flowable/Camunda）：

1. 流程定义解析
   BPMN XML / JSON → 内存中的流程模型
   我们：YAML → ProcessDefinition（nodes + edges）

2. 流程实例管理
   创建实例、推进节点、暂停、恢复、终止
   我们：ProcessInstance + node_states

3. 节点执行器
   每种节点类型有对应的执行器
   我们：ActivityNode → NodeAssignment
        GatewayNode → 条件路由
        EventNode → 等待事件

4. 表达式引擎
   条件边的表达式求值
   Flowable：UEL（Unified Expression Language）
   我们：简单字符串匹配（Phase 1），表达式引擎（Phase 2）

5. 持久化
   流程实例状态持久化到数据库
   Flowable：关系数据库（多张表）
   我们：Phase 1 文件，Phase 2 数据库

6. 事件系统
   定时器、消息、信号等事件的调度
   Flowable：Job Executor（定时任务调度器）
   我们：Phase 1 不实现，Phase 2 参考

7. 历史记录
   所有操作的审计日志
   Flowable：ACT_HI_* 表（历史表）
   我们：gate_history + workitem_transitions
```

## 三、Flowable 的 AI 编排

```
Flowable 2025 年开始支持 AI Agent 编排：

BPMN 流程中可以嵌入 AI 节点：
  - AI Task：调用 LLM 执行任务
  - AI Decision：用 LLM 做条件判断
  - AI Human Task：LLM 辅助人类决策

与我们的区别：
  Flowable：在传统 BPMN 引擎上加 AI 能力
  我们：从零设计 AI-native 的 BPMN 引擎

  Flowable 的 AI 节点是"在流程中调用 LLM"
  我们的 ActivityNode 是"LLM Agent 执行完整的 think→act 循环"
  → 我们的 Agent 更自主，不只是"调用一次 LLM"
```

## 四、可借鉴的工程实践

### 4.1 流程定义的版本管理

```
Flowable 的做法：
  每次部署流程定义，自动生成版本号
  运行中的实例继续用旧版本
  新实例用新版本
  支持流程迁移（旧版本实例迁移到新版本）

我们应该参考：
  ProcessDefinition 加版本号
  修改流程模板后，已运行的项目不受影响
  新项目用新版本
```

### 4.2 节点执行器的插件化

```
Flowable 的做法：
  每种节点类型注册一个 ActivityBehavior
  新增节点类型只需实现接口 + 注册
  引擎代码不需要修改

我们应该参考：
  FlowNodeVisitor 模式（已在概要设计中）
  新增节点类型实现 visit() 方法 + 注册
  → 和 Flowable 的思路一致
```

### 4.3 表达式引擎

```
Flowable 的做法：
  条件边用 UEL 表达式：${verdict == 'approved'}
  支持变量引用、函数调用、比较运算

我们的 Phase 1：
  简单字符串匹配：condition: "verdict == 'approved'"
  用 Python eval 或简单解析器

Phase 2 可以参考 Flowable 引入更完整的表达式引擎
```

### 4.4 数据库表设计

```
Flowable 的核心表（参考）：

ACT_RE_*  流程定义表（Repository）
  ACT_RE_DEPLOYMENT    部署记录
  ACT_RE_PROCDEF       流程定义

ACT_RU_*  运行时表（Runtime）
  ACT_RU_EXECUTION     流程实例 + 执行路径
  ACT_RU_TASK          当前活跃的用户任务
  ACT_RU_VARIABLE      流程变量
  ACT_RU_EVENT_SUBSCR  事件订阅

ACT_HI_*  历史表（History）
  ACT_HI_PROCINST      流程实例历史
  ACT_HI_ACTINST       节点执行历史
  ACT_HI_TASKINST      任务历史
  ACT_HI_VARINST       变量历史

我们的映射：
  ACT_RE_PROCDEF    → platform.process_templates 表
  ACT_RU_EXECUTION  → flow 内存中的 ProcessInstance
  ACT_RU_TASK       → flow 内存中的当前 NodeAssignment
  ACT_RU_VARIABLE   → ProcessInstance.node_outputs
  ACT_HI_*          → platform.workitem_transitions + gate_history
```

## 五、Phase 分期

| Phase | 参考 Flowable/Camunda 的能力 |
|-------|---------------------------|
| Phase 1 | 流程定义解析、节点执行器、简单条件路由 |
| Phase 2 | 持久化、表达式引擎、版本管理、事件系统 |
| Phase 3 | 分布式执行（参考 Zeebe）、流程迁移 |

## 六、参考

- Flowable 文档：https://documentation.flowable.com/
- Flowable AI：https://documentation.flowable.com/latest/ai/ai-orchestration
- Camunda：https://camunda.com/
- Camunda AI：https://computerweekly.com/blog/CW-Developer-Network/AI-workflows-Camunda-BPMN-as-a-tool-for-creating-orchestrating-AI-workflows
