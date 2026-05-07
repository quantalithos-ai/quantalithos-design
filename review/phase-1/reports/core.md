# core 代码审查报告

| 元信息 | 内容 |
|--------|------|
| 审查者 | Claude |
| 审查日期 | 2026-05-04 |
| 代码版本 | `9b9271f` |
| 对照设计版本 | projects/quantalithos-core/design/详细设计.md 最后更新 2026-05-01 |
| 语言 | Python |
| 源文件数 | 47 |
| 源代码行数 | 6,067 |
| commits | 4 |
| 编写 AI | Claude |
| 编码阶段 | 阶段 1-4 |

---

## 审查结果摘要

| 维度 | 检查项数 | 通过 | Critical | Major | Minor |
|------|---------|------|----------|-------|-------|
| A 设计一致性 | 6 | 5 | 0 | 1 | 0 |
| B 代码质量与安全 | 10 | 9 | 0 | 0 | 1 |
| C 协议一致性 | 8 | 5 | 2 | 1 | 0 |
| **合计** | **24** | **19** | **2** | **2** | **1** |

---

## A 设计一致性

| # | 检查项 | 结果 | 说明 |
|---|--------|------|------|
| A-1 | 目录结构与详细设计 §一 一致 | ✅ | bpmn/ protocol/ models/ sandbox/ errors/ 均存在 |
| A-2 | 数据模型字段与详细设计 §二 一致 | ✅ | FlowMessage/NodeResult/Payload 字段与设计一致 |
| A-3 | API 路由/函数签名与详细设计一致 | ✅ | core 是纯库，无 API 路由；函数签名与设计一致 |
| A-4 | 错误类型与详细设计一致 | ✅ | CoreError/InvalidFlowMessage/InvalidCondition 等均存在 |
| A-5 | 设计模式使用与规范一致 | ✅ | Strategy（NodeStrategy）+ Template Method（BPMNEngine）符合设计 |
| A-6 | 无设计中未定义的模块或字段 | ⚠️ Major | 见问题 #1 |

---

## B 代码质量与安全

| # | 检查项 | 结果 | 说明 |
|---|--------|------|------|
| B-1 | 错误处理规范（无 bare except） | ✅ | grep 未发现 bare except 或 except Exception + pass |
| B-2 | 无硬编码密钥 | ✅ | core 是纯库，无密钥相关代码 |
| B-3 | 无 SQL 拼接 | ✅ | core 无数据库操作 |
| B-4 | API 入参有校验 | ✅ | Pydantic BaseModel 自动校验 |
| B-5 | 敏感信息不入日志 | ✅ | core 无日志输出 |
| B-6 | struct/class 有文档注释 | ✅ | 所有 class 有 docstring |
| B-7 | 函数有前置条件和返回值说明 | ✅ | 关键函数有 Args/Returns/Raises 文档 |
| B-8 | 关键步骤注释说明"为什么" | ✅ | BPMNEngine 遍历逻辑有意图注释 |
| B-9 | 依赖在设计选型范围内 | ✅ | 唯一依赖 pydantic，符合设计 |
| B-10 | 依赖版本锁定文件已提交 | 💡 Minor | 见问题 #5 |

---

## C 协议一致性（轮次 1 核心审查项）

| # | 检查项 | 结果 | 说明 |
|---|--------|------|------|
| C-1 | FlowMessage 字段在 core/flow/runtime 三方一致 | ✅ | 三方均通过 `from quantalithos_core import FlowMessage` 导入，字段一致 |
| C-2 | FlowMessageType 枚举值三方一致 | ✅ | 7 个枚举值（agent_create/destroy/suspend/resume/node_execute/node_cancel/chat_message）三方一致 |
| C-3 | NodeExecutePayload 字段一致 | ✅ | flow 构造 8 个字段，runtime 通过 parse_payload() 解析，字段完全对齐 |
| C-4 | ChatMessagePayload 字段一致 | ✅ | sender_id/content/mentions/reply_to 四字段三方一致 |
| C-5 | NodeResult 字段一致 | ✅ | message_id/agent_id/result_type/output/reason/reasoning_trace 六字段一致 |
| C-6 | NodeCancelPayload / AgentDestroyPayload 未从公共 API 导出 | 🔴 Critical | 见问题 #2 |
| C-7 | platform 缺少 flow 调用的 API 路由 | 🔴 Critical | 见问题 #3 |
| C-8 | gate 路由配置缺少 sandbox/flow upstream | ⚠️ Major | 见问题 #4 |

---

## 问题清单

| # | 维度 | 级别 | 文件 | 行号 | 问题描述 | 修复建议 | 状态 |
|---|------|------|------|------|---------|---------|------|
| 1 | A-6 | Major | protocol/\_\_init\_\_.py | 3-20 | `NodeCancelPayload` 和 `AgentDestroyPayload` 在 `payloads.py` 中定义，但未从 `protocol/__init__.py` 和顶层 `__init__.py` 导出。flow 和 runtime 通过内部路径 `from quantalithos_core.protocol.payloads import ...` 绕过公共 API，违反封装原则 | 在 `protocol/__init__.py` 和顶层 `__init__.py` 中添加 `NodeCancelPayload` 和 `AgentDestroyPayload` 的导出；flow/runtime 改为从公共 API 导入 | 待修复 |
| 2 | C-6 | Critical | protocol/\_\_init\_\_.py | 3-20 | 同问题 #1。当前 flow 的 `agent_lifecycle.py:12` 使用 `from quantalithos_core.protocol.payloads import AgentDestroyPayload`，runtime 的 `main_loop.py:20` 使用 `from quantalithos_core.protocol.payloads import ChatMessagePayload, NodeCancelPayload`。如果 core 重构内部路径，这些导入会断裂 | 同问题 #1 的修复建议 | 待修复 |
| 3 | C-7 | Critical | (跨项目) | — | flow 的 `platform_client.py:197` 调用 `GET /api/workitems/{workitem_id}`，但 platform 路由表中**没有** `GET /api/workitems/:id` 路由。platform 只有 `/api/workitems/:id/transition`、`/comments`、`/dependencies`、`/history` 等子路由。同样，flow 的 `platform_client.py:150` 调用 `GET /api/events`，platform 也没有此路由 | platform 需要新增：① `GET /api/workitems/:id` 路由（返回单个工单详情）② `GET /api/events` 路由（返回事件列表，支持 since_event_id 和 project_id 过滤） | 待修复 |
| 4 | C-8 | Major | (跨项目) | — | gate 的 `gate.yaml` 路由配置中 upstream 只有 `platform` 和 `runtime`，缺少 `sandbox` 和 `flow`。如果未来需要通过 gate 访问 sandbox API 或 flow 状态查询，需要补充 | 在 gate.yaml 中添加 sandbox 和 flow 的 upstream 配置和路由规则。当前 flow 是 daemon 无 HTTP 端口，可暂不配置；sandbox 应配置 `/api/sandbox` 前缀 | 待修复 |
| 5 | B-10 | Minor | (项目根目录) | — | core 项目未发现 `requirements.txt` 或 `poetry.lock` 等依赖锁定文件（pyproject.toml 中的依赖声明不等于版本锁定） | 生成并提交 `requirements.txt`（`pip freeze > requirements.txt`）或使用 poetry.lock | 待修复 |

---

## 审查结论

- [ ] 通过（无 Critical / Major）
- [x] **不通过（存在 2 个 Critical 问题）**
- [ ] 有条件通过（无 Critical，Major 已记录修复计划）

### Critical 问题摘要

1. **#2 协议导出不完整**：`NodeCancelPayload` 和 `AgentDestroyPayload` 未从公共 API 导出，flow/runtime 绕过封装直接导入内部模块。修复简单（加两行 import），但不修复则 core 重构时会断裂。

2. **#3 platform 缺少 flow 依赖的 API 路由**：flow 调用 `GET /api/workitems/:id` 和 `GET /api/events`，但 platform 没有这两个路由。**这会导致联调时 flow 无法获取工单详情和事件列表，直接阻塞核心链路。**

### 修复优先级

| 优先级 | 问题 | 修复方 | 预计工作量 |
|--------|------|--------|-----------|
| 立即 | #3 platform 缺少路由 | platform | 新增 2 个 handler + 路由注册，约 2 小时 |
| 立即 | #2 协议导出不完整 | core | 修改 2 个 `__init__.py`，约 10 分钟 |
| 尽快 | #1 封装违规 | flow + runtime | 修改 import 路径，约 10 分钟 |
| 尽快 | #4 gate 缺少 upstream | infra | 修改 gate.yaml，约 10 分钟 |
| 延后 | #5 依赖锁定 | core | 生成 requirements.txt，约 5 分钟 |

**审查者签字：** Claude

**日期：** 2026-05-04
