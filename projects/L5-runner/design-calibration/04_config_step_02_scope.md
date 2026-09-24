# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节：`04-配置设计.md` §2
> 输入：`04_config_step_01_upstream_boundary.md`、正式 `00/01/02/03`、03 Step 14
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与内计划

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 2 |
| current_module | `scope:goal_range_and_non_range` |
| gate_status | `pass_for_step_03` |
| gate_reason | P0/P1/P2 配置口径、范围/非范围、下游去向和 03 影响均已闭合；无待回写项。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_03_control_plane.md` |

### 1.1 Step 内计划

| 项目 | 状态 | 产物/门禁 |
|---|---|---|
| 定义配置设计目标 | done | 目标表 |
| 划分 P0/P1/P2 | done | 分层口径 |
| 定义范围与非范围去向 | done | 范围表 |
| 记录残余风险和 03 影响 | done | 影响判定 |
| 自检并开放 Step 3 | done | `pass_for_step_03` |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| P0 必须定义什么？ | 能使 Runner 以安全、可解释、可审计的方式装配本地 logical store/cache、binding registry、safe redaction、有限 page/body/batch/read/job policy、clock/id/digest 和 entry/worker/operations readiness marker 的配置语义；未证明的外部能力保持 blocked。 |
| P1/P2 包括什么？ | P1 是真实 SDK/owner adapter、durable store/cache、平台资源 provider、diagnostic/handoff sink、真实 telemetry 和受控 secret ref 的接入姿态；P2 是 remote config/admin override、hot reload、跨平台量化容量/性能、区域/租户扩展和产品化运维策略。当前只定义触发器和 seam。 |
| 哪些交给部署/运维？ | 文件挂载、环境变量实际命名、secret provider/KMS/Vault 操作、证书安装、endpoint provisioning、进程/容器编排、告警面板、runbook、值班处置和发布命令。 |
| 哪些交给 05/06/07？ | 05 负责测试用例/fixture/CI/证据；06 负责验收裁决/VETO/evidence；07 负责 phase、commit、implementation ledger、boundary skeleton 和实施门禁。 |
| 哪些配置不应进入范围？ | 任何会改变 truth owner、exact version/generation、state transition、Query no-write、idempotency、redaction、RecoveryCase/no-replay、依赖方向或 owner contract 的开关。 |

## 3. 当前文档问题诊断、对比与取舍

| 议题 | 候选/历史口径 | 收口后 | 理由 |
|---|---|---|---|
| 是否走无配置路径 | 直接写“无配置” | 不是无配置项目；完整执行 Step 1～15 | 03 已有多处配置读取和 builder 绑定 |
| P0 规模 | 把所有 endpoint、产品、阈值列入 | 只定义 semantic assembly、safe refs、有限 policy 和负向姿态 | 上游/物理 authority 未闭合 |
| 默认值 | 继承 README/旧文档数字 | 仅使用安全且已确认的布尔/空集合；其他值 required/blocked/authority-pending | 防伪造默认和隐式放行 |
| 配置与部署 | 把挂载、命令、凭据写入 04 | 只定义来源角色、优先级和校验；具体操作留 07/09 | 保持文档边界 |
| 配置与能力 | `enabled=true` 即 ready | configured/enabled/ready 三层分离 | 配置不能授予外部能力 |

## 4. 结构化中间产物

### 4.1 配置设计目标

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 安全装配 | 从明确来源构造 validated immutable snapshot，失败时 fail-fast/blocked | 05 的 malformed/missing/forbidden config cases |
| 依赖隔离 | 以 semantic/opaque binding ref 连接 SDK、owner、平台、store/cache、redaction seam | 07 的 adapter binding 和 blocker gate |
| 多轴不变量保护 | 配置不得把 transfer/verified/qualified、accepted/running、confirmed/cleaned 或 delivered/evidence 合并 | 06 的配置 VETO 输入 |
| 可解释降级 | 外部依赖不可用时显示 blocked/unknown/degraded，不 silent fallback | 05/06 的 negative matrix |
| 可审计变更 | 配置版本、来源、校验和变更只记录安全摘要，不记录 secret/body | 07/09 的变更/回滚承接 |
| 跨平台可移植 | 只表达 capability/limit/adapter posture，不绑定 OS/platform command | 05 的 profile matrix、07 的技术选型门禁 |

### 4.2 P0/P1/P2 口径

| 等级 | 本轮配置语义 | 当前是否展开字段全集 |
|---|---|---|
| P0 | local composition、profile identity、store/cache/projection/idempotency binding、外部 adapter availability、safe limits、redaction/telemetry posture、entry/worker/operations policy、deterministic test profile | 是，但不锁具体产品/path/endpoint/数字 |
| P1 | real-like/staging owner SDK、durable store/cache、platform resource provider、diagnostic/handoff/telemetry backend、controlled secret refs | 只定义 binding seam、requiredness 和 blocked 处理 |
| P2 | remote/admin config、hot reload、multi-region/tenant、capacity/SLO/retention optimization、platform-specific tuning | 只写未来触发条件 |

### 4.3 范围与非范围

| 当前范围 | 交付物 |
|---|---|
| 配置来源、优先级、profile 和环境矩阵 | §3～§6 的 semantic control plane |
| 配置域、项、类型、默认/必填、敏感级别、失败策略 | §4、§7、§8 |
| 加载、parse/type/cross-field validation、builder 注入、生效 | §9 |
| 变更、审计、回滚、失效、降级和下游承接 | §10～§12 |
| 迁移、废弃、演进触发和风险 | §13～§14 |

| 非范围 | 去向 |
|---|---|
| 需求/架构/详细设计对象、trait、DTO、flow、state、error 变更 | 回写 00/01/02/03；04 不静默新增 |
| 真实 endpoint、transport、SDK client/version、secret provider、数据库/cache backend、路径和平台命令 | 上游 authority、技术 ADR、07/09 |
| 部署挂载、证书安装、进程编排、告警阈值、runbook | 09 部署与运维手册（当前未生成） |
| 测试用例、fixture、CI job、执行结果、报告/evidence | 05/06；当前不执行 |
| phase、commit、implementation ledger/boundary skeleton、代码任务 | 07；当前禁止创建 |

### 4.4 设计影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0/P1/P2 分层只组织已有绑定和未来 seam | 否 | 范围/优先级 | 不适用 | 无回写 |
| 具体 P0 配置项若需要新增 struct 字段、builder 参数、Port 或 DTO | 是 | 代码契约 | 对应 03 Step 4/7/14 | 未发生；正式配置不得自行新增 |
| 部署/运维实际来源和命令 | 否（文档边界） | operational detail | 不适用 | 留给 09/07 |

## 5. 回填草稿（未来正式 §2）

本配置设计的目标是将 03 已确认的 Runner 配置读取点转化为可审查、可测试、可回滚且 fail-closed 的控制面。P0 覆盖逻辑装配、binding、有限 policy、redaction 和 deterministic test posture；P1/P2 只保留接缝和触发条件。本文不重新定义 03 的代码契约，不选择实现技术、部署产品、真实 endpoint、secret provider 或测试/验收结果。

## 6. 待确认事项与进入下一步条件

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| exact workload/平台数值 | limit/default/SLO | 使用 required/authority-pending；不继承历史数字 |
| real-like endpoint/secret/backend | P1 positive profile | opaque ref + blocked/unavailable；不声明 ready |
| remote config/hot reload | P2 evolution | 禁止进入 P0；未来重开 03/04 Step 3/9/10/13 |

| 进入 Step 3 条件 | 结论 |
|---|---|
| 目标、范围、非范围已闭合 | pass |
| P0/P1/P2 口径清楚 | pass |
| 下游去向明确 | pass |
| 无 `待回写` 或 `阻塞待确认` | pass |

Step 2 完成，允许进入 Step 3；正式 04 仍不可写。
