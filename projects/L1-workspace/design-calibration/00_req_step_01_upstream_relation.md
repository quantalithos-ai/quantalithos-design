# L1-workspace 00 需求 Step 1：与上游文档的关系声明

> 状态：`done / pass`  
> 模式：`full-restart`  
> 回填位置：正式 `00-需求文档.md` §1

## 0. 开工确认

| 项目 | 记录 |
|---|---|
| 已读取 | 六份强制标准、全局依赖规则、L0/L1/L2 指定正式文档、L4-archive 下游材料、workspace README 与 draft、ADR-0015 草案。 |
| 正式文档写入 | `not_allowed_before_step_17` |
| 历史材料 | 仅作差异审计输入。 |

## 1. Step 内计划

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化 | 回填 | 自检 |
|---|---|---|---|---|---|---|
| 权威输入分层 | done | done | done | done | done | pass |
| 文档链路收束 | done | done | done | done | done | pass |
| 历史材料审计 | done | done | done | done | done | pass |

## 2. 来源分层

| 层级 | 输入 | 处理口径 |
|---|---|---|
| normative authority | 六份标准与全局依赖规则 | 决定流程、章节、依赖分类和门禁。 |
| direct upstream | `L0-core`、`L0-bus`、`L0-sdk`、六个 L1 truth domain、`L2-runtime`、`L2-tools`、三个 member 项目 | 只承接已停审正式文档中与 workspace 相关的主题和 owner 边界。 |
| architecture/product context | `architecture/仓库拆分方案.md`、`architecture/adr/drafts/0015-member-workspace-view.md` | 架构/产品线索；ADR 草案不具正式 authority。 |
| downstream reference | `L4-archive` | 只作为后续消费者和边界参考，不反向定义 workspace truth。 |
| confirmed discussion input | `draft/01~03` | 用户已确认的预推演；本 Step 重新复核后使用。 |
| historical_material | workspace README、ADR 草案中的未确认对象/事件、旧技术与 UI 说法 | 只做污染审计，不直接继承。 |

## 3. SOP 问题回答与收束

本文承接全局依赖层级、L0 shared contract/event 主干、各 L1 owning domain 的正式事实边界，以及产品/架构中关于 Personal/Project workspace view 的主题线索。本文不重新定义 identity、conversation、work、process、governance、artifact 或 bus 的事实，只把“跨域只读视图与 workspace 局部状态”收束为本仓的需求入口。新版 00 的作用是把这些上游主题转为 workspace 自己的边界、能力、规则、数据、接口和验收基线，驱动后续 01~07。

## 4. 历史审计

| 历史材料 | 处理 |
|---|---|
| README 的 PersonalWorkspace/ProjectWorkspace/Inbox/ReadCursor | 作为候选主题保留，必须经后续 Step 复核。 |
| ADR-0015 的 UX 叙事和事件名 | 只作讨论线索；不视为正式 query/event contract。 |
| 旧技术栈、缓存、性能、协议和 UI 结论 | 不进入当前需求。 |
| `L2-member-images` workspace seed | 与 live workspace projection 分离，不承接。 |

## 5. 回填草稿

正式 §1 仅保留来源映射表和 2~3 句收束说明；不提前写本仓边界、依赖、能力、功能或接口。

## 6. 门禁

```text
gate_status = pass
next_allowed_action = create_step_02_position_boundary
formal_document_write_allowed = false
```
