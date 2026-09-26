# L5-sync 架构 Step 12 · 横切关注点

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 12 |
| 输入 | Step 2 目标/约束、Step 7 依赖、Step 8 数据、Step 9 交互、Step 10 技术机制 |
| 回填章节 | 正式 01 §13 |
| 下一步 | Step 13：演进路线 |

## 2. Step 内计划

- [x] 按本仓适用性检查安全、可观测性、韧性/可用性、性能、配置、审计/追溯。
- [x] 为每项写出架构约束和判断口径，不写具体监控脚本、密钥存放或压测结果。
- [x] 按五个架构单元建立适用表。
- [x] 审计模板化空话、漏项、与数据/通信语义冲突和证据越界。
- [x] 完成各横切项停审。

## 3. 本步输入

| 输入 | 关键承接 |
|---|---|
| Step 2 | fail-closed、非覆盖、owner seam、非目标 |
| Step 7 | ports/adapters、无私有依赖、SDK/Git/fs 边界 |
| Step 8 | forbidden body、local strong/external eventual、一致性分层 |
| Step 9 | sync owner call、后台 probe、分层结果 |
| Step 10~11 | redaction-first、受控本地桥和技术取舍 |

## 4. SOP 问题回答

### 4.1 安全边界如何处理？

所有变更前必须具备 principal/project/version/source/target/operation 和 owner eligibility；unknown/revoked/archived/dissolved/conflicting 时 fail-closed。Git/fs 只执行白名单观察、锁、路径保护和原子应用；不保存 credential/secret/raw body，不允许任意命令、自动 push 或绕过 Review Gate。

### 4.2 可观测性覆盖哪些正式对象和链路？

覆盖 session/correlation、source binding、owner check、Git/fs observation、materialization attempt、cursor/checkpoint/conflict/recovery、handoff attempt/transport/probe/decision ref 和 archive posture。Telemetry/diagnostic 只记录 bounded/redacted metadata，不作为业务成功、Review accepted 或 readiness 证明。

### 4.3 可用性和韧性守住什么底线？

网络、owner、Git/fs、metadata、comparator 和 handoff 不可用时，系统必须可显示 blocked/pending/unknown/manual-action，并能恢复到最近安全 checkpoint；不能以牺牲 provenance、覆盖用户修改或盲重放外部副作用换取表面成功。

### 4.4 性能预算如何表达？

当前不量化固定 SLA。架构判断口径是：status/query 不应隐式做长时 materialization；长时 source apply 必须有可解释进度和 checkpoint；诊断不能隐藏阻塞；具体仓规模、网络、LFS/浅克隆和延迟阈值由后续 workload/测试合同确定。

### 4.5 配置如何管理？

配置必须分为用户显式选择、受控本地策略、owner endpoint/SDK profile、Git/filesystem adapter capability 和诊断/redaction policy；来源、范围、敏感性、默认值和变更审计后续明确。不得把 credential、token、私钥或未审查 endpoint 写入普通 metadata，也不得让配置放宽安全门禁。

### 4.6 审计与可追溯性如何保证？

每个关键 local transition 和外部交互都要能关联 operation/source/correlation/provenance；冲突、恢复、重绑、handoff、probe 和用户决定形成新的可回链 local record。审计记录只证明本地动作与引用，不伪造正式 evidence/report/verdict/signoff。

## 5. 当前文档问题诊断

| 历史横切内容 | 问题 | 当前处理 |
|---|---|---|
| 固定成功率、metadata 覆盖率、SLA 数字 | 无 workload 依据，可能伪造事实 | 改为判断口径，数字后置 |
| “observability 不可用不影响同步” | 过于绝对，可能遗漏审计/安全依赖 | 区分核心 local transition 与诊断/telemetry 降级 |
| endpoint/LFS/log verbosity 作为普通配置 | 可能放宽边界或泄露敏感信息 | 配置按 owner/capability/sensitivity 分类 |
| repair/rebind 作为无条件自动修复 | 可能删除/伪造 provenance | 只定义受控、可见、人工或 owner 参与的恢复姿态 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 用监控指标代替架构约束 | 不采用 | telemetry 不能替代 ownership、safety 或 decision。 |
| B. 以安全/韧性/审计判断口径约束横切 | 采用 | 能在没有实现和测试结果时保持可审查性。 |
| C. 先锁固定 SLA 和大仓策略 | 不采用 | 上游支持矩阵和 workload 尚未闭合。 |

## 7. 结构化中间产物

### 7.1 横切约束表

| 横切类别 | 适用原因 | 正式约束 | 判断口径 |
|---|---|---|---|
| 安全/权限 | Sync 执行本地与外部副作用 | explicit context、owner checks、fail-closed、no arbitrary command/secret/body | unknown 时无危险副作用；每个 mutation 可回链 |
| 可观测性 | 需要解释长时/失败/unknown/审计路径 | bounded/redacted correlation、分层 result | telemetry 不改变业务成功或 decision |
| 可用性/韧性 | 网络、owner、Git/fs、metadata 都可能失效 | checkpoint、resume、probe、manual action | 可恢复到安全点；失败不覆盖/不盲重放 |
| 性能/进度 | source apply 可能长时且影响体验 | status/query 不隐式长任务；apply 有进度/阶段语义 | 具体阈值由 workload/测试后定；无数字即不称作 SLA |
| 配置 | endpoint、scope、adapter、redaction 影响边界 | 来源/范围/敏感性/审计分层；配置不放宽 gate | 任何配置变更可解释；secret 不入普通 metadata |
| 审计/追溯 | handoff、冲突、重绑和恢复需责任链 | operation/source/correlation/provenance 贯穿 | 只能证明 local action/ref，不生成正式 verdict |

### 7.2 按架构单元组织的适用表

| 单元 | 安全 | 观测 | 韧性 | 性能/进度 | 配置/审计 |
|---|---|---|---|---|---|
| Selection & Access | owner check/fail-closed | 记录资格检查引用 | stale/pending | 查询不隐式刷新 | principal/project/action provenance |
| Working Copy & Metadata | path/secret/integrity guard | binding/generation/lock diagnostics | atomic local state/checkpoint | metadata 操作可解释 | schema/config migration audit pending |
| Source Materialization | source eligibility/dirty guard | source/cursor/mapping/applied trace | pause/resume/gap handling | incremental progress, no fixed SLA | source/version/provenance audit |
| Conflict & Recovery | no auto resolve/replay | conflict/checkpoint/probe refs | manual action and safe resume | 不隐藏等待 | user decision/recovery history |
| Review Handoff & Provenance | no bypass Gate/no raw body | transport/probe/decision separation | unknown probe/manual | handoff stage visible | candidate freeze and provenance audit |

### 7.3 不适用/不进入本章的横切项

不在本章锁定具体密码学算法、数据库/缓存产品、指标名称与阈值、日志平台、密钥管理脚本、Git LFS 实现、GUI 可用性、详细配置文件格式或测试自动化命令；这些内容属于后续文档或上游合同。

### 7.4 横切停审与跨约束审计

| 审计项 | 结果 |
|---|---|
| 模板化空话 | 无；每项均指向 Sync 边界或本地单元 |
| 安全与通信冲突 | 无；所有副作用仍经 gate/prepare/probe |
| 可观测与 truth 冲突 | 无；telemetry/diagnostic 不决定 success |
| 配置边界遗漏 | 已覆盖 scope、endpoint、adapter、redaction、secret 禁止 |
| 数据/通信一致性 | 与 Step 8/9 一致；外部 eventual 不改变 local strong transition |
| 证据越界 | 无；不生成 evidence/verdict/signoff/readiness |

## 8. 回填草稿

正式 §13 回填横切约束表、按单元适用表和判断口径；不写监控命令、配置文件或测试结果。

## 9. 待确认事项

- 性能阈值、进度颗粒度和大仓 workload：`SYNC-UP-009` 及后续测试输入。
- metadata/secret/endpoint 配置 schema：`SYNC-UP-006`。
- Git/filesystem path protection 细节：`SYNC-UP-010`。
- observability/audit transport：只保留能力边界，具体合同由 `L4-observability`/SDK 提供。

## 10. 自检与进入下一步条件

- [x] 横切项均有本仓适用原因和可审查判断口径。
- [x] 未把通用实现清单或固定数字伪装为架构约束。
- [x] 五个单元逐项停审，跨约束无冲突。
- [x] 安全、观测、韧性、性能、配置和审计覆盖完整。

`gate_status = pass_with_upstream_blockers`；可进入 Step 13。
