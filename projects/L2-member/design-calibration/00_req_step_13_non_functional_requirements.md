# L2-member 00 需求 Step 13: 非功能需求

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 13 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 非功能需求 |
| 输出文件 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.13:六类最小枚举;要求写判断句;判断口径不留空;不写实现手段) |
| 已读取前序输入 | yes(Step 7 节点、Step 10 规则、Step 11 数据、Step 12 接口) |
| 当前模式 | full-restart |
| 进入条件 | Step 12 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 六类适用性判断 | done | 适用表 | pass |
| 能力级 / 全局 NFR 划分 | done | NFR 表 | pass |
| 历史指标审计 | done | 审计表 | pass |
| 回填草稿 | done | 第 13 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- Step 7 节点;Step 10 BR(安全 / 审计红线);Step 12 IB / DB(边界与失效)。
- L2-runtime 00 §13("性能只定测量维度不填数字"口径)。
- 旧 00 §7 / §11(P95 与百分比,historical 审计)。

## 3. 历史指标审计

| 旧指标 | 处置 |
|---|---|
| subscribe→filter P95 < 20ms;publish→bus P95 < 50ms;heartbeat < 5ms | 无 workload / 测量 authority;废弃。对应维度改为可判断口径(NFR-001/002)。 |
| 外网监听端口 = 0 | 旧数字与工具口径不继承;保留"不暴露通用外部监听面、不任意外呼"的安全语义,但不得把 Bus、宿主、Runtime 正式 seam 误判为禁止网络。 |
| invalid token rejection 100% | 语义并入 fail-closed 入场(NFR-006);百分比废弃。 |
| bus 99.95% / member-service 99.9% SLA | 外部 SLA 不是本仓需求;废弃,改为依赖失效行为口径(NFR-004/005)。 |

## 4. 六类适用性判断

| 类别 | 适用性 | 说明 |
|---|---|---|
| 性能 | 适用(弱) | member 在入站 / 出站主链上,不应成为不可解释瓶颈;当前无数值 authority。 |
| 可用性 | 强适用 | 多个依赖(宿主 / Runtime / bus / policy 来源)可独立失效,降级语义是本仓核心。 |
| 安全 | 强适用 | 项目型执行主语与启动语境 fail closed、授权瞬时正文检查、forbidden persistence / raw forwarding、无通用外部监听与任意外呼。 |
| 审计 / 可追溯 | 强适用 | C4 是核心节点;三条横切红线之一。 |
| 幂等 / 一致性 | 强适用 | duplicate / late / unknown 在入站与出站两侧都存在。 |
| 可观测性 | 适用 | 本地状态可判断;observed truth 外置。 |

## 5. 结构化中间产物(非功能需求表)

| ID | 类别 | 要求 | 判断口径 / 目标值 | 挂载 |
|---|---|---|---|---|
| `NFR-L2M-001` | 性能 | 入站筛选与投递决定的本地处理不应成为入站主链的不可解释瓶颈,且不因摘要 / 统计 / 出口视图等派生路径无限放大。 | 固定 workload / dependency profile 下可分解本地筛选、投递等待、外部等待各阶段;当前无数值目标,不伪造延迟数字。 | C2;全局 |
| `NFR-L2M-002` | 性能 | 出站承接、材料准备与发布尝试的本地处理可与外部 delivery 等待区分测量。 | 按 stage / dependency / outcome 分解报告,不用总延迟掩盖外部依赖;无数值目标。 | C3 |
| `NFR-L2M-003` | 性能 | 追溯记录与观测材料的形成不得成为核心交互提交的同步前置放大点。 | 核心决定提交不以观测 route ready 为前提;材料形成可后置 / 批量。 | C4 |
| `NFR-L2M-004` | 可用性 | 宿主、Runtime、bus、policy 来源任一短暂不可用时,受影响能力保持 waiting / degraded / blocked 可判别,本地历史与决定记录不丢失、不被覆盖。 | 注入 unavailable / timeout / late 情形检查状态可判别且历史保留;恢复后交互语境可继续。 | 全局;C1~C3 |
| `NFR-L2M-005` | 可用性 | 派生能力(摘要、能力出口、统计、历史浏览)失效时,核心在场 / 入站 / 出站 / 追溯不得整体失效。 | 外围与 C5 派生路径可独立降级或排除,核心四节点语义仍成立。 | C5;外围 |
| `NFR-L2M-006` | 安全 | 项目执行主语、身份关联、启动语境、订阅来源、筛选规则来源或出站材料任一不可验证时 fail closed / 保守处置;不得默认放行、自建 allowlist、以 GlobalMember 代替执行主语或降级入场。 | negative fixture 检查:unverifiable / conflict / unsupported subject → 拒绝 / 降级 / 阻断,无 fail-open 路径。 | C1、C2 |
| `NFR-L2M-007` | 安全 | 入站正文只可在正式授权范围内瞬时受控检查,不得持久化为 member truth或透明转发 raw body;运行结果正文、隐藏推理、secret、定义正文不得进入 member 记录、出站材料或观测材料。 | forbidden persistence / raw forwarding / redaction / body-free 检查覆盖检查面、记录面、投递面、发布面、观测面。 | 全局 |
| `NFR-L2M-008` | 安全 | member 不得暴露通用外部网络监听面或任意直连 provider / MCP / A2A / API;正式 Bus、宿主、Runtime event / runtime seam 必须可与违规外联区分。 | 边界检查能区分允许 seam 与通用监听 / 任意外呼;违规即阻塞。 | C1~C3 |
| `NFR-L2M-009` | 审计 / 可追溯 | 在场变化、订阅决定、筛选结论、投递决定、出站决定、发布尝试可按同一关联语境追溯,且每条结论有来源 / 目的 / 结果分类。 | 任一交互事实可回链其规则来源、上游 ref 与结果分类;不要求保存正文。 | C4;全局 |
| `NFR-L2M-010` | 审计 / 可追溯 | 本地决定、发布尝试、delivery、observed、下游 accepted 分层可追溯;外部状态不改写本地历史。 | 故障注入后本地记录保持,外部状态独立标注。 | C3、C4 |
| `NFR-L2M-011` | 幂等 / 一致性 | 重复入站事实、重复投递触发、重复发布尝试、重复反馈不产生 truth 分叉或重复不可逆副作用。 | 相同关联语境的重复输入可判定;unknown 不自动重放。 | C2、C3 |
| `NFR-L2M-012` | 幂等 / 一致性 | 迟到 / 乱序的运行侧受理结果、delivery 反馈或规则快照不覆盖新决定或既有记录,只形成新关联事实。 | late / duplicate / out-of-order fixture 检查读写分层。 | C2、C3 |
| `NFR-L2M-013` | 幂等 / 一致性 | 同一项目型成员实例的本地在场语义保持唯一并锚定同一 `ProjectMemberRef` / `GlobalMemberRef` 关联;宿主 acceptance / session / health 视角与本地记录冲突时可判别,不静默合并或互相覆盖。 | subject / presence / host-view 冲突显式呈现为 conflict / unknown,不由 member 自动裁决宿主 truth。 | C1 |
| `NFR-L2M-014` | 可观测性 | 在场状态、筛选处置分布、投递 / 发布失败、依赖缺口、降级状态形成低敏低基数可判断材料。 | 不以观测后端 ready 为前提;本地 attempt / gap 可判断。 | C4;全局 |
| `NFR-L2M-015` | 可观测性 / 安全 | 观测材料不泄漏正文、隐藏推理、secret 或高基数用户内容。 | redaction-before-serialization / body-free / cardinality 检查。 | C4 |
| `NFR-L2M-016` | 全局 | 依赖边界、fake / controlled seam 与真实 readiness 区分;planned / blocked / not_run 不得写成 pass。 | 设计、测试、验收、实施台账逐项检查;违规即阻塞。 | 全局 |

## 6. 回填草稿

按 §4 适用性说明 + §5 NFR 表回填第 13 章;开头声明:当前优先锁定安全、可追溯、幂等、一致性与失效分层;性能只定义测量维度,不填无来源数字。

## 7. 待确认事项

- 预算 / 限额类(如筛选队列、投递并发)语义留给 03 / 04;需求层不定数字。

## 8. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 六类逐项判断且不适用处有说明 | pass(六类全适用,弱适用已标) |
| 判断口径无留空、无实现手段 | pass |
| 每项挂载节点或全局 | pass |
| 无旧数字回流 | pass |
| Step 14 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_14_acceptance_criteria
formal_document_write_allowed = false
```
