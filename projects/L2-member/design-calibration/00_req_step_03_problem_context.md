# L2-member 00 需求 Step 3: 背景与问题定义

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 3 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 背景与问题定义 |
| 输出文件 | `design-calibration/00_req_step_03_problem_context.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.3:背景短文 + 问题表 + 二分表;不写方案 / 目标) |
| 已读取前序输入 | yes(Step 1 污染审计;Step 2 边界声明) |
| 当前模式 | full-restart |
| 进入条件 | Step 2 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| SOP 问题回答 | done | 四项回答 | pass |
| 诊断(旧背景章) | done | 差异表 | pass |
| 设计取舍 | done | 取舍表 | pass |
| 结构化产物 | done | 背景短文 + 问题表 + 二分表 | pass |
| 回填草稿 | done | 第 3 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- Step 2 边界声明与判定口径。
- L2-runtime 00 §3(其问题定义方式与"无测量 authority 不给数字"口径)。
- 旧 00 §2(historical,审计用)。

## 3. SOP 问题回答

1. 当前业务背景是什么?

   回答: `L2-runtime` 与 `L2-tools` 已完成正式 `00~07` 并停审,受控运行循环与工具行动契约的 truth 边界已收束;全局规则的 Layer 3 并行窗口(member / member-service / member-images)随之开启。Runtime 正式链把 member 列为 Entry consumers / 下游消费边界,并把协议接入、宿主生命周期和产品入口排除在自身之外,但 member 侧尚无按当前上游收束的需求真相;旧 member 文档基于已废弃的 authority 链,不能直接作为基线。

2. 当前的主要痛点或机会点是什么?

   回答: 三类缺口——(a) 成员交互边界缺 owner:入站筛选结论、受控投递决定、出站发布决定没有当前需求真相,Runtime、宿主或 bus 适配层都可能各自补一套;(b) 容器内双进程与宿主分界尚未双向闭口:Runtime 已锁定其一侧,member-service 已校准到 Step 9 但正式 00 与字段合同未闭口,member 侧必须明确执行主语及注册 / 会话 / 健康 owner;(c) 旧材料污染:旧 member-specific CloudEvents / AG-UI / UDS / launch_token / P95 等若未经 Core 与当前合同核验即继承,会把私有事件细节、载体与指标重新写成事实。

3. 这些问题能否量化?

   回答: 不能。当前没有可信实现、workload 或测量 authority,旧 P95/SLA 数字全部废弃;本章以可核查的 owner 缺口、契约缺口和后果为依据。

4. 哪些是业务问题,哪些是技术问题?

   回答: 见 §7 二分表。

## 4. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §2.2 | "痛点"= 设计文档未成文、验收未固化等文档进度问题 | 文档进度不是需求层问题;重写为 owner / 契约缺口。 |
| 旧 00 §2.3 | 以 README P95 数字作"量化依据" | 无测量 authority,伪量化;废弃。 |
| 旧 00 §2.4 | 技术问题直接列六子模块 + launch_token + UDS | 把方案要素当问题;重写为边界与语义收束问题。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以 owner / 契约缺口定义问题(采用) | 可核查、不依赖伪数字、与 Runtime 00 口径一致 | 缺直观数值 | 采用 |
| 继承旧痛点表并补充 | 省事 | 继承伪量化与方案化问题 | 不采用 |

## 6. 结构化中间产物

### 6.1 业务背景(候选正文)

Quantalithos 的 AI 成员以容器内运行态实例参与协作。`L2-runtime` 与 `L2-tools` 已完成正式设计链,分别收束了受控运行循环和工具行动契约,并把协议接入面、宿主生命周期和成员对外交互排除在各自边界外。Layer 3 并行窗口由此开启,平台需要把"成员容器内的对外交互边界"独立收束为 `L2-member` 的仓级需求,为 Runtime 提供受控的入站语境与出站承接,为宿主与下游提供可解释的在场语义与安全摘要。

### 6.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 成员交互边界缺少单一需求真相 | 入站筛选结论、受控投递决定、出站发布决定尚无按当前上游收束的 owner;旧文档只有管道式模块清单 | Runtime、宿主或 bus 适配层可能各自定义筛选与发布语义,形成多真相;注入类风险的预筛与审计断链 |
| 容器内 member↔runtime 分界只有单侧收束 | Runtime 正式链已锁定 entry 合同与边界红线,member 侧对应的投递、承接、背压语义未成文;`Q-L2R-001` 开放 | 容器内交互靠隐式约定推进;出站的 outcome→发布→delivery→accepted 四层可能被压平 |
| 执行主语、兄弟合同与历史输入尚未分层稳定 | ADR / Work 已支持项目型 `ProjectMemberRef` + `GlobalMemberRef`;member-service Step 9 已通过并停审,member-images Step 1~8 已通过且 Step 9 进行中,两者正式 00 均未停审;非项目型主语仍开放。旧材料又混合了 Core 已承接的 CloudEvents / W3C 与无当前 authority 的私有事件细节、载体和指标 | 项目型路径可按双锚成文;宿主字段、打包边界和非项目型路径只能 pending / fail closed;共享标准经 Core 承接,其余逐项 historical / pending |

### 6.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对"AI 成员如何安全、可解释、可审计地接入协作体系"的正式需求收束,导致成员在场、听、说三类行为无法被宿主、下游和审查者稳定理解与追溯。 |
| 技术问题 | presence / 入站筛选 / 受控投递 / 出站发布 / 摘要与能力出口的 owner 边界,与 Runtime entry、bus 传递、governance 裁决、identity 锚点、宿主编排之间的消费与失败语义,若不在需求层先讲清,后续设计与实现会在容器内外反复串线,并让旧协议假设回流。 |

## 7. 回填草稿

按 6.1~6.3 结构回填第 3 章。

## 8. 待确认事项

- 无新增;`L2M-UP-001~008` 按各自影响范围继续挂起。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 未把方案 / 目标 / 功能名写进问题 | pass |
| 无伪量化;不可量化处已写表现与后果 | pass |
| 问题 1~3 个且均可核查 | pass |
| 业务 / 技术问题已二分 | pass |
| Step 4 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_04_goals_non_goals
formal_document_write_allowed = false
```
