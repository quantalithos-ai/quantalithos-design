# L2-member 00 需求 Step 4: 目标与非目标

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 4 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 目标与非目标 |
| 输出文件 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.4:目标表 + 非目标表;目标写状态 / 边界 / 能力,不写功能名与口号) |
| 已读取前序输入 | yes(Step 2 边界、Step 3 问题;draft 02 §3 非目标候选) |
| 当前模式 | full-restart |
| 进入条件 | Step 3 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| SOP 问题回答 | done | 四项回答 | pass |
| 诊断(旧目标章) | done | 差异表 | pass |
| 设计取舍 | done | 取舍表 | pass |
| 结构化产物 | done | 目标表 + 非目标表 + 范围收束 | pass |
| 回填草稿 | done | 第 4 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- Step 2 边界声明、Step 3 三类问题。
- draft 02 §3 非目标候选(11 项)。
- L2-runtime 00 §4(目标 / 非目标写法样板)。

## 3. SOP 问题回答

1. 本次需求结束后,应成立哪些状态、边界或能力?

   回答: 五个方向——成员交互边界真相成立;入站筛选与受控投递语义成立;出站承接与发布分层成立;在场语义与宿主协作边界成立;摘要与能力出口的派生边界成立。逐项见 §6 目标表。

2. 这些目标如何被验证?

   回答: 每个目标给出"完成方向"判断口径(结构成立性判断),不用数字;正式验收合同由 Step 14 承接。

3. 哪些事项虽然相关,但明确不纳入当前范围?

   回答: 见 §6 非目标表(11 项,每项有 owner 或后移原因)。

4. 哪些事情必须交给相邻仓或后续阶段处理?

   回答: 运行决策链归 Runtime;工具与能力真相归 Tools / Hub;宿主编排与健康裁决归 member-service;协议 / 载体 / 技术栈 / 数值指标后移 01~05 并以证据为前提。

## 4. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §3.1 | 目标 = "六子模块可运行" + 三个 P95 数字 + UDS/token 百分比 | 功能名 + 伪量化混作目标;全部废弃,重写为状态 / 边界成立目标。 |
| 旧 00 §3.2 | 非目标仅 4 项 | 覆盖不足;按 Step 2 排除清单扩到 11 项并逐项标 owner。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 目标按"能力边界成立"表达,验证写判断口径(采用) | 可验证、无伪数字、与上游写法一致 | 不直观 | 采用 |
| 保留旧数字目标 | 直观 | 无测量 authority,违反真相源标准 | 不采用 |

## 6. 结构化中间产物

### 6.1 目标表

| ID | 目标 | 完成方向(验证方式) |
|---|---|---|
| `G-L2M-001` | 成员交互边界真相成立 | 一个运行态成员实例的在场、入站筛选结论、投递决定、出站决定与发布尝试均有 member 单一 owner,可解释、可追溯;后续章节不再出现第二 owner。 |
| `G-L2M-002` | 入站筛选与受控投递语义成立 | 订阅范围、筛选结论(通过 / 降级 / 阻断 / 待定)与向 Runtime 的投递决定可区分;规则来源回链正式 owner,unknown 保守处置,不自建 allowlist。 |
| `G-L2M-003` | 出站承接与发布分层成立 | Runtime committed outcome、member 出站决定、发布尝试 / gap、delivery、下游 accepted 五层可区分;外部失败不回滚本地决定,不声明 delivered / observed / accepted。 |
| `G-L2M-004` | 在场语义、执行主语与宿主协作边界成立 | 项目型实例以 `ProjectMemberRef` 为执行主语并关联 `GlobalMemberRef`;starting / ready / degraded / draining / terminated / unknown 可区分;member 只拥有注册请求 / 存活信号 / 状态报告与本地尝试,宿主拥有接受 / registry / session / 健康判定;凭据或主语不可验证时 fail closed。 |
| `G-L2M-005` | 摘要与能力出口的派生边界成立 | 成员可见摘要与能力出口只从本地已提交事实和上游 ref / safe view 派生,body-free、可重建、不反写任何 truth。 |

### 6.2 非目标表

| ID | 非目标 | 不做原因 / Owner |
|---|---|---|
| `NG-L2M-001` | LLM 推理、goal / plan、context composition、memory、checkpoint / recovery | `L2-runtime` |
| `NG-L2M-002` | Tool execution、ToolDefinition、normalized outcome truth | `L2-tools` |
| `NG-L2M-003` | Capability registry、外部 MCP / A2A / API adapter、外呼 | `L3-capability-hub` 及 Runtime→Tools 链 |
| `NG-L2M-004` | 容器启停、注册表 truth、健康裁决、policy 下发通道 | `L2-member-service` |
| `NG-L2M-005` | 镜像构建与装配 | `L2-member-images` |
| `NG-L2M-006` | 隔离执行 truth | `L4-sandbox` |
| `NG-L2M-007` | approval / policy truth、本地 allowlist 裁决 | `L1-governance` |
| `NG-L2M-008` | 对话真相、消息展示 | `L1-conversation` / `L5-chat` |
| `NG-L2M-009` | observability backend / observed truth | `L4-observability` |
| `NG-L2M-010` | 身份生命周期、凭据签发 | `L1-identity` / 宿主凭据 owner(`L2M-UP-006`) |
| `NG-L2M-011` | 固定语言、框架、IPC 载体、事件协议、进程管理器、SLA 数字 | 无当前 authority;后移 01~05 并以证据为前提 |

### 6.3 范围收束

本轮只把 `L2-member` 收束为容器内成员门面真相仓:它拥有在场、入站筛选与投递、出站决定与发布、摘要与能力出口的交互边界语义,通过正式 seam 消费 Runtime / work / identity / governance / tools 输入;它不拥有运行决策、工具执行、编排、裁决、对话、观测或身份生命周期。所有正向 seam 在对应 blocker(`L2M-UP-001~008`)闭口前只能是 pending / blocked / waiting / degraded / fail-closed。

## 7. 回填草稿

按 6.1~6.3 回填第 4 章。

## 8. 待确认事项

- 能力出口(G-L2M-005 后半)是否可整体后置为外围增强,在 Step 7 能力分层时定夺。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每个目标可验证且非功能名 / 口号 / 方案 | pass |
| 每个非目标有 owner 或后移原因 | pass |
| 与 Step 2 边界一致 | pass |
| 无伪数字 | pass |
| Step 5 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_05_users_roles
formal_document_write_allowed = false
```
