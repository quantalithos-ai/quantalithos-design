# 01 架构 Step 9 · 关键交互与通信方式

> 状态：`completed`
> 前置：`01_arch_step_04_system_context.md`、`01_arch_step_06_runtime_units.md`、`01_arch_step_07_dependency_direction.md`、`01_arch_step_08_data_ownership_consistency.md`
> 回填章节：正式 `01` §10 关键交互与通信方式

## 1. Step 内计划与问题回答

- [x] 读取系统上下文、运行承载、依赖方向和数据所有权输入。
- [x] 识别必须即时判断、适合事实送达及适合延后承接的场景。
- [x] 诊断旧材料中的直接 backend 调用、ACK 升级和自动重放污染。
- [x] 按架构单元收敛同步、异步、后台/补偿和失败降级。
- [x] 形成两张主表、单元停审和跨边界审计。
- [x] 形成正式 §10 回填草稿并通过门禁。

Runner 的同步边界用于用户当下必须得到资格、接收结果或明确失败的判断；异步边界只送达已经由 owner 成立的状态变化或结果；后台边界负责取得、验证、投影刷新、恢复对账和安全交接。三类方式都不能把 Runner 变成外部 truth owner，也不能以 transport 成功、ACK 或本地观察升级状态。

## 2. 历史污染诊断与取舍

旧材料曾把 Docker/gVisor/Firecracker 私有调用、`SandboxService`、本机进程观察、自动 retry/replay 和 stdout/stderr 流当作主交互合同。这会绕过公开 seam，并把接收、运行、清理和证据压成同一通信成功。本轮选择“同步明确意图与即时门禁、异步承接 owner 事实、后台推进可延后本地工作”；不选择私有 backend 穿透、全同步长链或在 unknown 时自动补偿。

## 3. 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 可信语境与显式选择确认 | 端侧入口 ↔ 选择与资格承接 ↔ context/Artifact/Governance 正式接缝 | 确认 actor/scope、immutable version、可见性和 authority posture。 | 选择是 Runner truth；Release 和批准仍由 owner 裁决。 |
| 取得、完整性与平台资格推进 | 取得/恢复承载 ↔ Artifact 正式接缝 ↔ 本地材料/平台边界 | 取得受约束材料并形成 transfer、quarantine、integrity、compatibility 姿态。 | 传输完成不等 qualified；策略和 manifest 不由 Runner 创建。 |
| 正式运行请求提交 | 本地运行意图 ↔ Sandbox/Runtime 正式接缝 | 提交绑定 generation、qualified refs 和用户意图的受控请求。 | 接收结果必须即时可解释，但 `accepted ≠ running`。 |
| 执行与控制状态送达 | Sandbox/Runtime owner ↔ 生命周期展示 | 送达 boundary、lease、running、terminal 和控制结果的 owner 状态。 | 本地 PID、端口、连接或 toast 不补齐 owner 状态。 |
| 端侧资源冲突判断 | 资源/恢复保护 ↔ 平台能力边界 ↔ Sandbox allocation/lease view | 解释本地 probe 与 owner allocation/lease 的冲突及其影响。 | probe 是观察，不是抢占、分配或清理真相。 |
| 停止与清理意图及确认 | 本地运行意图/资源保护 ↔ Sandbox 正式接缝 | 提交 stop/cancel/cleanup 意图并取得接收、确认和释放姿态。 | active protection 未解除时不得将本地删除当清理完成。 |
| 断线、重启与未知副作用对账 | 取得/恢复承载 ↔ owner-safe status/ref ↔ 本地持久状态 | 重验语境、source generation、lease 和未决意图，恢复安全展示。 | unknown 不自动重放，无法确认时进入 manual-review。 |
| 输出预览与失败诊断读取 | 诊断/预览承载 ↔ Runtime/Sandbox/Observability 安全消费面 | 提供带 source/freshness 的 bounded、redacted 用户解释。 | 不取得或常驻 raw body，不生成 evidence/report/verdict。 |
| 安全诊断交接 | 诊断/预览承载 ↔ Observability 正式 handoff 边界 | 交接允许的摘要与 refs，并展示交接姿态。 | receipt 只证明交接状态，不证明 evidence、verdict 或 signoff。 |

## 4. 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 可信语境与显式选择确认 | 同步请求 / 响应类交互 | 不宜用异步推送或旧 cache 代替当前选择与 authority 判断。 | 返回 not-visible、stale、conflict、revoked、expired、blocked 或明确失败。 | 用户副作用前必须获得当前可解释结论。 |
| 取得、完整性与平台资格推进 | 后台任务 / 延后承接类交互；关键 source/authority 判断同步收口 | 不宜让长时传输阻塞入口，也不宜后台默认为 qualified。 | 保持 pending、paused、incomplete、quarantine、invalid 或 blocked。 | 本地长任务可延后，资格门禁仍须显式成立。 |
| 正式运行请求提交 | 同步请求 / 响应类交互 | 不宜先显示 running 再后台补正式请求。 | 返回 not-sent、accepted、pending、rejected、unknown；unknown 冻结重放。 | 同步边界只收口请求是否被正式承接。 |
| 执行与控制状态送达 | 异步事件 / 回调类交互 + 同步只读查询 | 不宜让所有 owner 状态依赖持续同步轮询，也不宜只信事件缓存。 | 显示 stale、unknown、unavailable；必要时经只读查询对账。 | 事实由 owner 成立，事件送达和查询共同服务消费。 |
| 端侧资源冲突判断 | 同步请求 / 响应类交互 | 不宜把 probe 放成无约束后台抢占或替代 lease。 | 返回 conflict、stale、unknown 或 blocked，不静默覆盖。 | 用户提交前需即时理解端侧冲突，但 owner 资格优先。 |
| 停止与清理意图及确认 | 同步请求 / 响应类交互提交意图；异步结果送达 | 不宜将提交 ACK 当控制或清理完成。 | 保持 requested、accepted、protected、pending、unknown 或 blocked。 | 意图接收和最终副作用分属不同边界。 |
| 断线、重启与未知副作用对账 | 后台任务 / 延后承接类交互 + 同步只读查询 | 不宜以重连成功触发自动 replay。 | 冻结副作用，进入 reconcile、manual-review、stale 或 unavailable。 | 对账可延后，但任何新副作用前必须重新收口。 |
| 输出预览与失败诊断读取 | 同步请求 / 响应类交互；派生刷新可后台承接 | 不宜以原始持续流作为 Runner 正式 truth。 | 显示 partial、restricted、stale、blocked 或 unavailable。 | 用户读取需即时且 no-write，派生延迟不得被隐藏。 |
| 安全诊断交接 | 同步提交意图 + 异步结果/回调 + 后台延后承接 | 不宜阻塞运行终态或把 ACK 当正式证据形成。 | 显示 pending、accepted、blocked、failed 或 delivered。 | 交接独立于运行和审计结论，可延后但需可追踪。 |

## 5. 按架构单元的交互方式与停审

| 架构单元 | 同步交互 | 异步交互 | 后台/补偿路径 | 失败降级 | 停审 |
|---|---|---|---|---|---|
| 选择与资格承接 | 语境、选择、authority 当前判断 | revoke/expiry/visibility 等 owner 变化送达 | 资格刷新，不改变 owner | blocked/stale/conflict | 匹配 truth/ref 边界；通过。 |
| 取得与材料资格承接 | locator/manifest 当前资格判断 | source 失效变化送达 | transfer、resume、verify、quarantine | incomplete/invalid/blocked | 无协议下沉；通过。 |
| 本地运行意图与生命周期 | request/control intent 提交与即时接收结果 | execution/control owner 状态送达 | 未决状态对账，不自动重放 | pending/unknown/rejected | accepted 与 running 分离；通过。 |
| 资源、清理与恢复保护 | probe/guard/cleanup intent 判断 | lease/cleanup/protection 变化送达 | reconnect/reconcile/orphan 检查 | protected/conflict/manual-review | 不覆盖 owner；通过。 |
| 输出预览与失败诊断 | 安全 view/diagnostic 查询与 handoff intent | handoff/diagnostic 状态送达 | redacted 派生、延后交接 | partial/restricted/blocked | 不触碰 raw/evidence；通过。 |
| 端侧入口与展示 | 用户查询和明确意图 | 安全状态更新消费 | view refresh | stale/unavailable | 只经编排边界；通过。 |

## 6. 简化交互示意图

#### 同步、异步与后台承接位置图

```text
 +--------------------+     sync intent/judgment     +--------------------+
 | 端侧入口 / Runner  | ----------------------------> | 正式 owner seam     |
 | local intent/view  | <---------------------------- | owner authority     |
 +---------+----------+       explicit result         +---------+----------+
           ^                                                     |
           | async owner fact / result                            |
           +-----------------------------------------------------+
           |
           | local progress / reconciled view
 +---------+----------+
 | 后台取得/恢复/诊断 |
 | no truth overwrite |
 +--------------------+
```

图后说明：

- 同步交互只收口当前意图或必须即时成立的判断，不代表下游执行已完成。
- 异步交互送达 owner 已成立的事实或结果，Runner 保留来源和 freshness。
- 后台承载只推进本地可延后工作、派生和对账，不反写 owner truth，也不盲目重放 unknown。

## 7. 跨交互边界审计

| 审计项 | 结果 |
|---|---|
| 同步/异步选择冲突 | 无；即时资格/意图用同步，owner 事实送达用异步，长时本地工作用后台。 |
| 直接穿透边界 | 无；所有跨域交互经 SDK/正式 API/adapter，禁止私有 backend/topic/storage。 |
| 数据所有权冲突 | 无；交互只传递 intent、safe snapshot/ref/status，不转移 truth。 |
| 协议细节下沉 | 无；未写 API 路径、DTO、schema、topic、重试次数或时序。 |
| 失败降级缺口 | 无；每类交互都保留 pending/blocked/unknown/stale/reconcile 等非成功姿态。 |
| 后续承接风险 | RUN-UP-001~008 继续阻塞 exact surface、幂等、lease、handoff 和平台责任，不在本步补造。 |

## 8. 回填草稿与门禁

正式 §10 回填关键场景表、通信方式表、简化图、单元停审和跨边界审计。具体 API/事件、状态对象、adapter 方法、重试与恢复算法后置，并受上游合同门禁控制。

`Step 9 gate_status = pass`；下一步允许进入 Step 10 关键技术选型。
