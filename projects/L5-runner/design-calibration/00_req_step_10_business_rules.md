# 00 需求 Step 10 · 业务规则与边界约束

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_07_core_capability_loop.md`、`00_req_step_09_functional_requirements.md`
> 回填章节：正式 `00` §10 业务规则与边界约束
> 规则类型：不变量、禁止行为、显式变化、边界约束；按需补充治理与审计约束。

## 1. 本步目标与约束

本步把 Runner 的核心能力和功能收束为需求层硬规则，保护版本 authority、完整性、Sandbox/Runtime 分层、资源清理、诊断和跨域真相边界。规则不写字段校验、接口协议、事务、存储或实现算法。

## 2. 业务规则表

| 规则 ID | 类型 | 条件 | 结果 | 约束对象 | 支撑功能 |
|---|---|---|---|---|---|
| `BR-RUN-001` | 不变量 | 一次运行请求存在时 | 必须绑定一个用户显式选择的 immutable Release/version ref、scope 和选择世代。 | 运行选择 | `FR-RUN-001~002` |
| `BR-RUN-002` | 禁止行为 | 用户未选择明确版本，或只提供 `latest`/默认分支/目录最新文件 | 不得进入下载、验证或 Sandbox 请求。 | 版本选择 | `FR-RUN-002~003` |
| `BR-RUN-003` | 不变量 | authority chain 包含 Artifact/Release、baseline（如适用）和 Governance applicability | 每一环都必须可验证、未撤销、未过期、无 scope 冲突；否则运行资格不得成立。 | authority 资格 | `FR-RUN-002`、`FR-RUN-004` |
| `BR-RUN-004` | 禁止行为 | 本地 cache、用户角色、历史成功、Sandbox ACK 或 HTTP 传输成功存在 | 不得据此推断 approved/baselined 或当前可运行。 | authority/cache | `FR-RUN-002~004` |
| `BR-RUN-005` | 显式变化 | 用户改变 Release/version 选择或 source authority 失效 | 必须产生可区分的新选择世代或 invalidated 姿态，不能静默改写已发出的请求。 | 选择与请求关联 | `FR-RUN-001~002` |
| `BR-RUN-006` | 不变量 | 下载材料尚未通过正式 manifest/digest/signature 和平台兼容性验证 | 材料只能保持 incomplete/quarantine/invalid/pending，不得作为运行输入。 | 下载/完整性 | `FR-RUN-003~004` |
| `BR-RUN-007` | 禁止行为 | 下载中断、digest/signature 不匹配、manifest 缺失或 authority stale/revoked/expired | 不得通过重命名、重新声明或修改材料把状态变为 verified/approved。 | cache/integrity | `FR-RUN-003~004` |
| `BR-RUN-008` | 不变量 | cache entry 被标记 verified | 必须仍绑定同一 immutable source ref/version/digest，且 source authority 在启动前再次有效。 | cache/资格 | `FR-RUN-003~004` |
| `BR-RUN-009` | 显式变化 | Runner 提交正式 Sandbox 请求 | 必须显式记录用户意图、请求关联和 owner receipt 姿态；`accepted` 只表示接收。 | Sandbox request | `FR-RUN-005` |
| `BR-RUN-010` | 禁止行为 | 仅有 `accepted`、本地进程存活、PID、端口开放或 UI toast | 不得显示或记录为 `running`、`terminal success` 或 Sandbox execution success。 | 生命周期展示 | `FR-RUN-005~007` |
| `BR-RUN-011` | 不变量 | Runner 展示 `running` 或 terminal result | 必须有正式 Runtime/Sandbox owner status/result ref；本地观察只能作为辅助信息。 | 运行状态 | `FR-RUN-006~007` |
| `BR-RUN-012` | 禁止行为 | 运行控制返回 pending/unknown，或连接在副作用期间中断 | 不得自动重放 start/stop/cancel/cleanup，不得以重连或进程消失猜测结果。 | 控制/恢复 | `FR-RUN-007`、`FR-RUN-010` |
| `BR-RUN-013` | 显式变化 | 用户发起 stop/cancel/cleanup | 必须区分意图已提交、owner 已接受、控制结果已确认和资源已清理。 | 控制/清理 | `FR-RUN-007`、`FR-RUN-009` |
| `BR-RUN-014` | 不变量 | 存在 active lease、capture、handoff、retention 或 orphan 保护 | 受保护的运行目录、cache entry 和输出材料不得被本地淘汰或删除。 | 资源/材料 | `FR-RUN-009` |
| `BR-RUN-015` | 禁止行为 | 仅凭本地端口 probe、socket 关闭、PID 消失或目录可删除 | 不得推断全局资源已释放、Sandbox cleanup 已完成或运行已终止。 | 资源/清理 | `FR-RUN-008~009` |
| `BR-RUN-016` | 边界约束 | 本地 probe 与正式 Sandbox allocation/lease 结论不一致 | 以 owner 正式 allocation/lease 为运行资格依据，并向用户显示冲突。 | 资源冲突 | `FR-RUN-008~009` |
| `BR-RUN-017` | 不变量 | 网络断线、休眠、应用重启或 session 过期发生 | 先冻结危险副作用，再重新验证 actor/context/source authority 和 owner status。 | 恢复 | `FR-RUN-010` |
| `BR-RUN-018` | 禁止行为 | 仅凭本地 cursor、缓存状态、上次 UI 页面或重连成功 | 不得关闭 unknown、reconcile_required、orphan 或 cleanup protection。 | 恢复/状态 | `FR-RUN-009~010` |
| `BR-RUN-019` | 显式变化 | 输出或诊断需要展示给用户或交给 Observability | 必须经过 redaction、范围裁剪并保留 source ref/freshness；交接状态独立表达。 | 预览/诊断 | `FR-RUN-011~013` |
| `BR-RUN-020` | 禁止行为 | 本地 stdout/stderr、截图、telemetry、handoff ACK 或 preview 存在 | 不得将其解释为 Artifact 正文、正式 evidence、report、verdict 或 signoff。 | 诊断/证据 | `FR-RUN-011~013` |
| `BR-RUN-021` | 边界约束 | source 不可见、摘要不完整、handoff blocked 或诊断不可用 | 必须显示 restricted/partial/blocked/unavailable，不得用空结果或乐观状态掩盖缺失。 | 可见性/降级 | `FR-RUN-011~013` |
| `BR-RUN-022` | 治理约束 | Runner 接收 Governance/Artifact/Sandbox/Observability 结果 | 只能消费正式 owner 结论，不得本地修改 Release、批准版本、执行 policy 或修复 source truth。 | 跨域协作 | `FR-RUN-002/005/013` |
| `BR-RUN-023` | 审计约束 | 选择、下载验证、控制、清理、恢复或 handoff 状态发生关键变化 | 必须保留可回指的安全关联、来源和状态变化信息；本地记录不能冒充正式审计。 | 追溯 | 全部核心功能 |
| `BR-RUN-024` | 不变量 | 同一 local version、source digest 或 lease epoch 已失效/不匹配 | 写入或副作用必须停止并返回 stale/conflict/unknown/reconcile posture。 | 一致性 | `FR-RUN-004~010` |
| `BR-RUN-025` | 禁止行为 | Runner 试图直接调用 Sandbox 私有 backend、绕过 SDK 或共享数据库事务 | 请求必须被架构/安全边界拒绝；正式协作只能经公开 SDK/API/adapter。 | 依赖边界 | 全部跨域功能 |

## 3. 规则与功能需求映射

| 规则范围 | 支撑功能 | 能力节点 | 保护重点 |
|---|---|---|---|
| `BR-RUN-001~005` | `FR-RUN-001~002` | `CP-RUN-01` | 显式选择、authority 适用性和选择世代。 |
| `BR-RUN-006~008` | `FR-RUN-003~004` | `CP-RUN-02` | 下载/验证/cache 不能替代 Release truth。 |
| `BR-RUN-009~013` | `FR-RUN-005~007` | `CP-RUN-03` | accepted、running、terminal 和控制结果分层。 |
| `BR-RUN-014~018` | `FR-RUN-008~010` | `CP-RUN-04` | 资源、lease、cleanup、orphan 和恢复安全。 |
| `BR-RUN-019~025` | `FR-RUN-011~013` | `CP-RUN-05` | redaction、诊断/handoff、审计与 owner 边界。 |

## 4. 规则冲突与优先级

当本地体验便利与安全/owner 规则冲突时，优先级为：正式 authority/visibility/lease/cleanup 结论 > 本地完整性/状态保护 > 用户快捷操作 > 体验优化。任何 unknown、冲突或不可验证姿态均按 fail-closed 处理；不得用外围增强、历史缓存或 fake 关闭硬规则。

## 5. 取舍与回填草稿

采用 25 条可追溯需求规则，覆盖五个能力节点；不把 Rust/HTTP/数据库/校验函数写入规则。正式 §10 将回填规则表、映射表和优先级短文，具体协议与状态迁移后置到 `01~03`。

## 6. 自检与进入下一步门禁

- [x] 规则类型覆盖不变量、禁止行为、显式变化和边界/治理/审计约束。
- [x] 每条规则都能回指功能需求和能力节点。
- [x] 已明确 `latest`、ACK、PID、cache、日志和私有 backend 的禁止语义。
- [x] 未写实现层校验、字段、事务或接口协议。

`Step 10 gate_status = pass`；下一步允许进入 `Step 11 数据需求与数据归属`。
