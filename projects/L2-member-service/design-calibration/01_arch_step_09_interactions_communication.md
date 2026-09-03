# 01 架构校准 Step 9：关键交互与通信方式

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 8 completed / pass
> 本步目的：按关键场景选择同步请求、异步事件 / 回调或后台延后承接，并逐架构单元停审

## 1. Step 内计划

- [x] 读取 flow、台账、Step 4 / 6 / 8 和正式 00 的能力接口分类。
- [x] 先筛选必须在架构层判断通信方式的关键场景。
- [x] 区分即时判断、正式事实 / 结果传播和长时副作用 / 对账。
- [x] 为每个场景说明推荐方式、不宜方式、失败口径和 owner 边界。
- [x] 将 Member / Runtime / Images / Sandbox 开放合同限制带入正向场景。
- [x] 按 A1~A5、S1~S3、P1~P3 完成交互停审。
- [x] 执行同步 / 异步 / 后台冲突和直接穿透审计。
- [x] 形成正式 §10 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 哪些交互适合同步请求 / 响应

- 宿主意图和控制受理：调用方必须即时知道 accepted / rejected / waiting / conflict / unknown。
- 当前状态与 safe view 查询：调用方需要当前可判定结果，同时允许 stale / unavailable。
- 外部资格按需解析：A1 / A2 在形成决定前需要明确 valid / invalid / stale / unknown；exact owner contract 未闭口时返回 blocked。
- Member 注册受理：注册来源必须即时得到接受 / 替换 / 拒绝语义；详细合同仍 waiting。
- Host Session 关联建立：需要即时判断是否能与当前宿主建立关联；Runtime surface 未闭口时 positive blocked。

同步交互只收口本仓即时判断，不承诺宿主已启动、Sandbox 已完成、Runtime 已运行或外围已接收。

### 2.2 哪些交互适合异步事件 / 回调

- Identity / Work 等正式上游变化进入本仓，更新 snapshot freshness 或触发显式再判断。
- Member 存活 / 状态信号、宿主承载反馈和 Sandbox 允许反馈进入本仓。
- 长时宿主动作的外部结果回送进入本仓，形成 local result / unknown，而不维持跨边界同步事务。
- 已提交宿主生命周期材料向 Bus / Observability / 下游传播。
- endpoint / session / host fact 的失效材料向协作方传播，但不替对方修改其 truth。

具体事件 family、callback、source、route 和 receipt 均未闭口，本步只固定交互类别和失败上限。

### 2.3 哪些交互适合后台任务 / 延后承接

- 宿主装配、资产获取、承载动作、required binding 和 readiness 重判。
- 恢复、restart、stop、terminate 与 external side-effect unknown 收束。
- local cleanup / release、residual / orphan / drift reconciliation。
- snapshot / projection 刷新、safe view rebuild 和 handoff gap 重试 / 复核。
- 健康窗口评估和缺失信号判断；具体阈值后移到配置设计。

这些场景不要求在同步入口内完成；入口只能返回已接受、已决定、pending 或 blocked，不能先返回“成功完成”。

### 2.4 哪些交互必须经过正式边界

- Identity / Work / Images / credential qualification 必须经 S1，不能由 A1 / A2 直读外部正文。
- carrier / registry / Sandbox 必须经 S2，不能由 A2 / A4 / A5 直连产品私有模型。
- event / material / read view 必须经 S3，P3 或下游不能直接写 A1~A5。
- Member / Runtime 只能经 A3 的 host-side placeholder seam 协作；本仓不定义对端内部协议或状态机。

## 3. 当前材料诊断与取舍

| 既有表达 | 问题 | 本步取舍 |
|---|---|---|
| 所有生命周期动作同步 RPC 完成 | 把接受、决定和外部副作用压成一个成功 | 即时判断同步，长时推进后台，结果异步回送。 |
| 所有状态变化全事件化 | 主语 / 决定 / 注册等即时拒绝边界不清 | 需要即时权威判断的场景保留同步收口。 |
| Heartbeat 固定 WebSocket / 固定周期 | 协议和配置数字越级 | 只固定异步信号语义与 freshness / missing 判断。 |
| Runtime entry 直接调用 | 对端正式 surface 未闭口 | Host Session 关联保留同步 placeholder，positive blocked。 |
| Sandbox bind / release 同步成功 | 长时隔离动作与 receipt owner 未闭口 | 后台推进 + 正式结果反馈；unknown 不 host fallback。 |
| 发布事件后直接标记 observed | event carrier 与 consumer truth 混写 | 只记录 local attempt / gap，外部状态独立。 |

## 4. 结构化中间产物

### 4.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 宿主意图与控制受理 | 正式入口 -> A1 | 即时形成受理 / 拒绝 / 等待和宿主决定 | 输入出现不触发隐式生命周期，决定不等于动作完成。 |
| 当前宿主安全查询 | 正式入口 -> A1~A5 / P3 | 返回当前 truth、safe view 与 stale / unknown | 查询只读，不隐式修复或触发生命周期。 |
| 外部资格按需解析 | A1 / A2 -> S1 | 为范围、装配和 readiness 获得可判定资格 | 只消费 ref / safe snapshot；合同 pending 时 blocked。 |
| 上游正式变化承接 | Identity / Work 等 -> S1 / P1 | 更新 freshness 并形成重新判断输入 | 变化材料本身不直接改写 A1~A5。 |
| 宿主生命周期副作用推进 | A2 / A4 / A5 -> S2 | 推进承载、装配、恢复、终止和 cleanup 能力请求 | 本仓决定与外部完成分层，结果未知可对账。 |
| 外部能力结果回送 | S2 外部边界 -> A2 / A4 / A5 | 将 carrier / binding / release 允许结果纳入本地判断 | callback / result contract pending，不吸收外部 truth。 |
| Member 注册受理 | Member -> A3 | 建立 / 替换 / 拒绝当前实例的注册关联 | 需求级 owner 分工成立，字段 / IPC / credential waiting。 |
| Host Session 关联建立 | Runtime 协作边界 <-> A3 | 建立宿主与 Runtime 外部对象的关联壳 | Runtime surface blocked；不创建或推进 run。 |
| 宿主存活与状态信号承接 | Member / carrier / Sandbox -> A4 | 形成来源明确、可排序的健康判断输入 | 原始信号不等于健康或业务成功。 |
| 健康、恢复与对账推进 | A4 / A5 内部延后边界 | 评估 missing、unknown、generation fence、residual 和 drift | 阈值 / 调度实现后移，结论必须可追溯。 |
| 宿主事实与材料传播 | S3 -> Bus / Observability / downstream | 传播已提交 body-free host facts 和 safe material | 只拥有 local attempt / gap，不声明外部完成。 |
| 投影刷新与 gap 复核 | S3 / P3 延后边界 | 重建 safe view、刷新状态并复核交接缺口 | 投影和传播失败不反写真相。 |

### 4.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 宿主意图与控制受理 | 同步请求 / 响应类交互 | 不宜以异步接受伪装无即时范围判断 | 返回 rejected / waiting / conflict / unknown，不执行隐式动作 | 需要即时建立本仓权威结论。 |
| 当前宿主安全查询 | 同步请求 / 响应类交互 | 不宜依靠事件回放临时拼当前值 | 返回 safe / stale / unavailable / unknown | 查询不改变 truth。 |
| 外部资格按需解析 | 同步请求 / 响应类交互 | 不宜默认使用旧 snapshot 或后台补齐后先放行 | unresolved / stale / blocked | A1 / A2 的当前决定需要明确资格。 |
| 上游正式变化承接 | 异步事件 / 回调类交互 | 不宜把所有来源变化绑入同步入口 | 保留未消费 / stale，等待正式承接 | 事实传播与当前命令收口分离。 |
| 宿主生命周期副作用推进 | 后台任务 / 延后承接类交互 | 不宜在同步入口宣称外部动作已完成 | pending / partial / timeout / unknown，进入对账 | 外部副作用可能长时且不可盲重放。 |
| 外部能力结果回送 | 异步事件 / 回调类交互 | 不宜维持跨 owner 长事务或主动猜测完成 | 未送达保持 unknown / gap | 只接收正式结果语义，具体合同 pending。 |
| Member 注册受理 | 同步请求 / 响应类交互 | 不宜先返回成功再后台验证实例关联 | rejected / blocked / conflict | 当前活动关联需要即时唯一性判断。 |
| Host Session 关联建立 | 同步请求 / 响应类交互（placeholder） | 不宜以事件到达推断关联已建立 | 合同未闭口为 blocked，不伪造 session | 只固定 host-side 语义，不替 Runtime 定义 surface。 |
| 宿主存活与状态信号承接 | 异步事件 / 回调类交互 | 不宜让来源等待本仓健康判断完成 | 迟到 / 重复 / stale / conflict 显式 | 信号是输入材料，不是健康 truth。 |
| 健康、恢复与对账推进 | 后台任务 / 延后承接类交互 | 不宜每个信号都同步触发不可逆恢复 | hold / unknown / reconciliation | 需要窗口、世代和多来源判断。 |
| 宿主事实与材料传播 | 异步事件 / 回调类交互 | 不宜把外围 receipt 纳入本地提交成功 | local gap / not delivered / not observed | 已提交 truth 先成立，外围最终一致。 |
| 投影刷新与 gap 复核 | 后台任务 / 延后承接类交互 | 不宜阻塞核心写路径或让投影成为同步写源 | stale / unavailable / rebuild pending | P3 可重建且只读。 |

### 4.3 不画简化交互示意图的原因

本步不画简化交互示意图。12 个场景已由“场景表 + 通信方式判断表 + 架构单元表”完整表达，同一场景还可能跨同步接受、后台推进和异步结果三个边界；再画单线图容易被误读为正式运行时序或正向合同已经闭口。正式 §10 也采用表为主，不保留空图占位。

### 4.4 按架构单元组织的交互方式

| 单元 | 同步请求 / 响应 | 异步事件 / 回调 | 后台 / 延后承接 | 失败上限 |
|---|---|---|---|---|
| A1 | 意图 / 控制受理、当前决定查询 | 上游变化只作输入 | 重复 / 冲突复核按需延后 | rejected / waiting / conflict / unknown |
| A2 | 装配条件 / readiness 查询与按需资格 | 外部分项结果回送 | 装配与宿主动作推进 | blocked / partial / timeout / unknown |
| A3 | Member 注册、Host Session placeholder、可用性查询 | 注册 / session 失效材料 | 陈旧关联复核 | waiting / blocked / stale / conflict |
| A4 | 正式恢复 / 终止控制受理、健康查询 | 存活 / backend / binding 信号 | 健康判断、恢复推进 | degraded / unknown / hold |
| A5 | cleanup / reconciliation 控制受理与查询 | external completion / gap 材料 | cleanup、orphan / drift 对账 | residual / gap / unknown |
| S1 | 资格按需解析 | 上游正式变化 | snapshot refresh | unresolved / stale / blocked |
| S2 | 能力可接受性判断 | 外部正式结果回送 | carrier / Sandbox side-effect progression | partial / timeout / unknown |
| S3 | safe view 读取 | fact / material propagation | projection rebuild / gap review | not delivered / not observed / stale |
| P1 | 只由 S1 读取 | 只由 S1 更新来源摘要 | freshness refresh | stale / unresolved |
| P2 | 只由 A2~A5 / S2 读取 | 只由正式承接更新摘要 | reconciliation refresh | stale / conflict / unknown |
| P3 | safe read only | 派生状态传播 | rebuild | stale / unavailable |

## 5. 交互方式逐单元停审

| 单元 | 方式匹配 ownership | 经正式边界 | 未下沉协议 | pending 保留 | 结果 |
|---|---|---|---|---|---|
| A1 | 是 | S1 / entry | 是 | subject / auth owner | pass |
| A2 | 是 | S1 / S2 | 是 | Images / credential / Sandbox | pass |
| A3 | 是 | Member / Runtime placeholder | 是 | MSVC-UP-001 / 002 | pass |
| A4 | 是 | S2 / signal boundary | 是 | threshold / feedback contract | pass |
| A5 | 是 | S2 / S3 | 是 | release / receipt | pass |
| S1 | 是 | source seams | 是 | exact source contracts | pass |
| S2 | 是 | capability seams | 是 | caller / result mapping | pass |
| S3 | 是 | event / material seams | 是 | route / receipt | pass |
| P1 | 是 | S1 only | 是 | freshness | pass |
| P2 | 是 | formal intake only | 是 | exact refs | pass |
| P3 | 是 | S3 only | 是 | consumer contract | pass |

## 6. 跨交互边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 同步 / 异步 / 后台选择是否冲突 | pass | 即时判断、事实 / 结果传播和长时副作用三类语义分离。 |
| 是否存在直接穿透外部 truth | pass | S1 / S2 / S3 承接所有外部边界。 |
| 是否出现协议、schema、route 或时序细节 | pass | 只使用通信类别；具体合同保持 pending。 |
| 同步成功是否伪装后台完成 | pass | 接受 / 决定与外部完成明确分层。 |
| 外围失败是否反写本地 truth | pass | propagation / projection failure 只形成 gap / stale。 |
| sibling 正向合同是否被伪闭口 | pass | Member waiting；Runtime / Images / Sandbox positive blocked。 |

## 7. 回填草稿

- 正式 §10 采用 12 行关键场景表、12 行通信方式判断表和边界说明短文，不画时序图。
- 正式正文保留 Host Session placeholder、外部结果回送 contract pending 和 local / external completion 分层。
- 单元停审与跨交互审计留在 calibration，接口名称、载荷、协议和处理流后移。

## 8. Gate 自检

| 检查项 | 结果 |
|---|---|
| 关键场景是否先于通信方式收敛 | pass |
| 同步 / 异步 / 后台是否有边界理由和失败口径 | pass |
| 11 个架构单元是否逐项停审 | pass |
| 是否无协议细节和直接穿透 | pass |
| 是否保留所有正向 pending / blocker | pass |
| 是否允许创建 Step 10 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_10
formal_01_write_allowed = false
```
