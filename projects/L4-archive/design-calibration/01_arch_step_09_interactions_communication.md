# 01 架构 Step 9：关键交互与通信方式

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 9。

### Step 内计划

- [x] 读取系统上下文、运行承载和 Step 8 所有权/一致性。
- [x] 回答同步、异步、后台、handoff、失败降级与补偿路径。
- [x] 诊断旧材料中同步调用、事件事实和恢复写入混层。
- [x] 按 U1~U6 逐单元停审通信方式。
- [x] 输出场景表、判断表与跨交互审计。

## 2. 问题回答、历史诊断与取舍

同步边界用于必须即时判定的 admission、read/verify 和 restore request validation；异步事件/回调用于已成立事实或外部结果送达；后台任务承接 capture、closure、verification、storage/lifecycle、material/handoff 和 reconcile。所有 owner truth 获取必须经正式 runtime query/export/ref，事件不能替代权威材料；所有恢复必须经 receiver handoff，不能穿透数据库。

旧材料用 “work event → bundle worker → restore event → active” 表达主线，把事件到达当授权、把任务开始当结果、把 `project.restored` 当 Archive 输出。当前通信方式服从 owner 与一致性边界；事件只是触发/反馈，业务状态由 owner 自己形成。

取舍：采用“同步受理/读取 + 后台长任务 + 异步触发/反馈 + owner receiver handoff”；不采用全同步跨域闭环、纯事件快照或 Archive 直写。

## 3. U1~U6 逐单元交互停审

| 单元 | 同步交互 | 异步事件/回调 | 后台/补偿 | 失败降级 | 停审 |
|---|---|---|---|---|---|
| U1 | request admission、job/read status | 正式触发提示可进入 | 作业调度与取消/终止承接 | rejected/blocked；重复按幂等语境判断 | pass |
| U2 | 按需 owner export/query 可返回明确结果 | source changed 仅提示重采 | per-source capture/reconcile | partial/stale/missing/conflicting；不用替代源 | pass_with AR-UP-001/006/007/008 |
| U3 | manifest/closure 只读验证 | Bundle local fact 可向下游传播（若合同闭合） | assembly/closure evaluation | incomplete/overfull/invalid，不 sealed | pass |
| U4 | 明确 verify 请求可返回已知结果 | external verification feedback | digest/signature/compatibility assessment | unknown/unsupported/integrity-failed | pass_with AR-UP-004 |
| U5 | location/lifecycle status 查询 | decision/storage feedback | placement/migration/retrieval/action reconcile | held/blocked/unavailable/commit-unknown | pass_with AR-UP-003/005 |
| U6 | restore admission/plan/read | receiver feedback 或 owner facts | materialization/handoff/probe/retry/compensation | per-item partial/conflicting/commit-unknown | pass_with AR-UP-002/009 |

逐项检查：所有方式与 Step 8 owner/一致性一致；没有 API 路径、事件名、DTO、topic 或 retry 次数。

## 4. 结构化中间产物

### 4.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 归档请求受理 | operation entrance ↔ U1 | 即时判断范围、依据与幂等语境能否进入作业 | accepted 只是本仓受理，不是业务批准。 |
| 逐源材料获取 | U2 ↔ canonical owner/provider | 获取有 authority、version/fence/coverage 的 material/ref | 事件或 projection 不能替代 owner 结果。 |
| Bundle closure/verification read | consumer ↔ U3/U4/U5 read composition | 读取声明、来源、覆盖、完整性、兼容和承载姿态 | 查询只读且不隐式回源写入。 |
| 外部完整性与存储处理 | U4/U5 ↔ external capability | 获得处理/验证/commit/retrieval 反馈 | 请求送达不等于最终结果。 |
| 治理生命周期动作 | U5 ↔ decision provider/storage | 在正式 decision 下执行允许动作并记录反馈 | Archive 不解释或创建 decision。 |
| 恢复申请与计划 | operation entrance ↔ U6 | 即时判断目标、依据、包与兼容前置并形成计划姿态 | 计划不改变 owner truth。 |
| owner-specific handoff | U6 ↔ restore receiver | 交付最小材料/ref 并获取逐项 outcome | handoff 不等于 owner committed/restored。 |
| 未知外部副作用核对 | U5/U6 ↔ external capability/receiver | 判定既有意图是否提交，再决定 retry/compensation | commit-unknown 禁止盲重放。 |

### 4.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 归档请求受理 | 同步请求 / 响应 | 不宜用事件到达代表 accepted | rejected/blocked，不创建伪作业成功 | 需要即时给出本仓 admission 结果。 |
| 逐源材料获取 | 后台任务 / 延后承接；正式 runtime query/export | 不宜全同步锁住所有 owner 或只消费事件 payload | 每 source 独立 partial/stale/missing/conflicting | 长时异构来源必须局部推进。 |
| Bundle closure/verification read | 同步请求 / 响应 | 不宜查询触发维护或外部写 | 返回 stale/partial/blocked/unknown | 只读结果必须即时可解释。 |
| 外部完整性与存储处理 | 后台任务 + 异步结果反馈 | 不宜把调用返回/发送成功视为 commit | pending/unavailable/commit-unknown | 外部副作用与本地状态须显式收敛。 |
| 治理生命周期动作 | 后台任务；decision 可由 runtime/ref/event 进入 | 不宜本地 scheduler 自行推断 policy | held/blocked/conflicting/unknown | 动作必须绑定正式决定。 |
| 恢复申请与计划 | 同步请求 / 响应 | 不宜直接启动跨域写入并等待全局完成 | rejected/blocked/unsupported/conflicting | 即时只收口计划资格。 |
| owner-specific handoff | 后台任务 + receiver runtime/adapter + feedback | 不宜共享库、全同步跨 owner 事务 | per-item pending/partial/commit-unknown | 每个 owner 自主提交。 |
| 未知外部副作用核对 | 后台任务 / 延后承接 | 不宜盲 retry 或 last-write-wins | probe 不支持则 compensation-required/manual | 保护幂等和外部副作用唯一性。 |

### 4.3 交互边界说明

事件协作用于传递触发、已成立事实或反馈，不承担 authority query、Bundle content 或 owner business commit。后台任务允许长时收敛和局部重试，但任何阶段都必须保存独立状态，不能用 job completed 压平 source/item failure。同步查询只读取已承载的 Archive 状态，不回源修补或改变它。实际 transport、API、event schema、receiver protocol 和重试算法留给后续设计且受 blocker 约束。

不画简化交互示意图：运行承载图已说明同步/后台/异步位置，两张主表已明确场景→方式；再画图会容易被误读为时序。

## 5. 跨交互审计、回填与门禁

同步/异步冲突、边界穿透、事件替代 authority、协议下沉、依赖失效与 commit-unknown 均已检查，无内部 unresolved 冲突。正式 §10 承接两张表和边界说明。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 10 关键技术选型`。
