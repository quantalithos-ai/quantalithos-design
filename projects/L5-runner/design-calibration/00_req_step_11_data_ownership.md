# 00 需求 Step 11 · 数据需求与数据归属

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_10_business_rules.md`
> 回填章节：正式 `00` §11 数据需求与数据归属
> 数据类别：真相数据、快照数据、引用数据、禁止保存正文。

## 1. 本步目标与边界

说明 Runner 在需求层拥有哪些端侧局部真相、哪些只是来源快照、哪些仅是外部引用，以及哪些正文绝不能进入 Runner 生命周期。数据分类不等于数据库设计，不定义字段、索引、缓存实现、序列化或存储后端。

## 2. 数据归属总表

| 数据范围 | 数据类型 | 归属结论 | 生命周期口径 | 支撑功能/规则 |
|---|---|---|---|---|
| 用户显式 Release/version 选择、选择来源、选择世代、失效姿态 | 真相数据（Runner-owned local truth） | Runner 拥有本地选择意图和其生命周期，但不拥有 Release/Artifact version truth。 | 用户改变选择、source 失效或 session/scope 失效时产生新世代/invalidated，不静默覆盖已发请求。 | `FR-RUN-001~002`; `BR-RUN-001~005` |
| 本地运行请求、控制意图、请求关联、reconcile posture | 真相数据（Runner-owned local truth） | Runner 拥有“用户想做什么”和本地请求展示状态；实际执行/控制结果归 Runtime/Sandbox。 | 从意图创建到 confirmed/rejected/unknown/reconcile；未知不得自动归结。 | `FR-RUN-005~007`; `BR-RUN-009~013` |
| 下载任务进度、传输失败、cache 绑定、quarantine/保护/淘汰姿态 | 真相数据（Runner-owned local truth） | Runner 拥有本地取得过程和材料保护状态，不拥有 locator、manifest 或 Release 内容 authority。 | 下载可暂停/恢复/失败；cache 受 active run/lease/handoff/retention 保护。 | `FR-RUN-003/009`; `BR-RUN-006~008/014` |
| 本地完整性检查结果、验证时间/关联、兼容性判断姿态 | 真相数据（Runner-owned local truth） | Runner 拥有本地“这份已取得材料是否通过既定验证”的记录；算法/签名 authority 由上游 policy/ref 提供。 | source digest/policy 改变或材料变化时失效并重新验证。 | `FR-RUN-004`; `BR-RUN-006~008` |
| 本地资源 probe、端口/路径冲突视图、连接和恢复姿态 | 真相数据（Runner-owned local observation） | Runner 拥有当前端侧观察；不拥有全局 scheduler、host capacity、Sandbox allocation 或 lease truth。 | 随平台/网络/进程变化短暂有效，需标注观察时间和 freshness。 | `FR-RUN-008~010`; `BR-RUN-015~018` |
| 本地 cursor、generation、断线/重启恢复标记、orphan 提醒 | 真相数据（Runner-owned local recovery state） | Runner 拥有本地恢复进度和保护标记；不推进 Bus/Runtime/Sandbox owner cursor。 | 可重建、可失效；无法与 owner status 对账时保持 unknown/manual review。 | `FR-RUN-009~010`; `BR-RUN-017~018` |
| Release/Artifact version/baseline 摘要、Governance approval/decision applicability、revoke/expiry/visibility | 快照数据 | 来源 owner 的正式事实不归 Runner；Runner 只保留为当前请求所需的安全摘要和版本绑定。 | source version/digest/freshness 改变或撤销时失效；不能作为永久授权缓存。 | `FR-RUN-002/004`; `BR-RUN-003~004` |
| Sandbox request/boundary/lease/execution/cleanup 状态、Runtime status/result | 快照数据 | Runner 只保留可见的安全状态摘要；Sandbox/Runtime owner 拥有正式 truth。 | 按 source ref/version/lease epoch 更新；ACK、PID 或本地状态不能升级为 owner truth。 | `FR-RUN-005~010`; `BR-RUN-009~018` |
| Output preview、失败分类、诊断摘要、handoff receipt/readiness | 快照数据 | Runner 拥有展示组合和本地关联，不拥有 raw output、Observability material、report 或 verdict。 | 可 stale/partial/restricted/blocked；source 失效时遮蔽或降级。 | `FR-RUN-011~013`; `BR-RUN-019~023` |
| `ReleaseRef`、`ArtifactVersionRef`、`BaselineRef`、`GovernanceDecisionRef`、`SandboxRequestRef`、`BoundaryRef`、`LeaseRef`、`RuntimeRunRef`、`OutputRef`、`DiagnosticRef`、`HandoffRef`、`ArchiveRef` | 引用数据 | 只保存指向 owner 事实、状态或交接的安全引用；引用不转移 ownership。 | 随 source 生命周期建立、变化、失效或撤销；不得以引用存在推断对象可见或成功。 | 全部跨域功能 |
| Actor/session/project context ref、平台 capability ref、source cursor/version/digest ref | 引用数据 | 只保存请求语境和来源绑定；Identity/Work/SDK/owner 拥有正式生命周期。 | scope/session/version 改变时必须重新验证或失效。 | `FR-RUN-001/002/010`; `BR-RUN-001/017/024` |
| Release 正文、Artifact 包完整正文（除短期受保护的本地运行材料边界外）、manifest/签名密钥正文、Governance policy/approval 正文 | 禁止保存正文 | Runner 不拥有这些上游正文或秘密；短期运行材料只能按正式安全/清理边界受保护，不成为 Runner truth。 | 不进入普通本地诊断、日志、cache metadata、UI state 或 handoff 正文。 | `BR-RUN-004/007/020/022/025` |
| Runtime loop/context/memory、Sandbox raw stdout/stderr/capture、Observability audit/evidence/report body、Archive bundle、Project/ProjectMember/WorkItem 正文 | 禁止保存正文 | 这些正文及生命周期属于对应 owner；Runner 只能接收允许的摘要/ref。 | 不进入 Runner-owned local truth；source 不可见时 fail-closed。 | `BR-RUN-020~022/025` |
| token、secret、credential、private key、locator credential、签名私钥 | 禁止保存正文 | 不得进入 Runner 文档示例、日志、telemetry、preview、诊断或普通持久化。 | 只按正式 SDK/平台安全边界短暂使用，Runner 不拥有生命周期。 | 安全边界全覆盖 |

## 3. 数据类型口径

| 数据类型 | Runner 使用口径 |
|---|---|
| 真相数据 | 仅指 Runner-owned 的本地选择、意图、下载/验证过程、资源观察和恢复姿态；这些数据不能改变上游 truth。 |
| 快照数据 | 来自 Artifact/Governance/Runtime/Sandbox/Observability/Archive 的安全摘要、状态、结果或 handoff view；必须保留来源、版本/freshness 和限制。 |
| 引用数据 | 指向 source、scope、lease、结果、诊断或交接的安全 ref；不复制正文，不转移 authority。 |
| 禁止保存正文 | 上游业务正文、运行正文、证据正文、归档包、秘密和未裁剪日志；不得通过缓存、preview、telemetry 或 handoff 绕过。 |

## 4. 数据与功能/规则映射

| 数据范围 | 支撑功能需求 | 支撑业务规则 | 所属能力节点 |
|---|---|---|---|
| 选择/authority 快照与引用 | `FR-RUN-001~002` | `BR-RUN-001~005` | `CP-RUN-01` |
| 下载/cache/完整性本地真相 | `FR-RUN-003~004` | `BR-RUN-006~008` | `CP-RUN-02` |
| 请求/生命周期/控制引用 | `FR-RUN-005~007` | `BR-RUN-009~013` | `CP-RUN-03` |
| 资源/清理/恢复本地状态与 owner 快照 | `FR-RUN-008~010` | `BR-RUN-014~018`、`BR-RUN-024` | `CP-RUN-04` |
| 预览/诊断/handoff 快照与引用 | `FR-RUN-011~013` | `BR-RUN-019~023`、`BR-RUN-025` | `CP-RUN-05` |

## 5. 生命周期与保护结论

- Runner-owned 数据可因用户选择、连接、source freshness、lease 或本地 generation 变化而失效，但失效不会回写上游 owner。
- 快照必须区分 current/stale/partial/restricted/unavailable；快照存在不等于当前授权或运行成功。
- 引用可以用于追溯和重新查询，但引用存在不等于正文可见、版本有效、运行完成或证据成立。
- 受保护的本地运行材料只在正式 cleanup/retention/lease 语义允许时淘汰；不能以磁盘压力或用户快捷操作绕过 guard。

## 6. 取舍与回填草稿

正式 §11 将按四类数据表述 Runner-owned local truth、上游快照、safe refs 和禁止正文，并附功能/规则映射。不会出现数据库表、字段类型、索引、缓存产品或序列化协议。

## 7. 自检与进入下一步门禁

- [x] 四类数据均有明确归属和生命周期口径。
- [x] 已区分 Runner 本地 truth 与上游正式 truth。
- [x] 已明确 raw body、secret、evidence/report/archive/runtime 正文禁止入仓。
- [x] 每类数据都能回指功能、规则和能力节点。
- [x] 未滑入表结构、字段、索引或实现存储。

`Step 11 gate_status = pass`；下一步允许进入 `Step 12 接口与依赖`。
