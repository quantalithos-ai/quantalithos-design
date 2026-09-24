# 00 需求 Step 13 · 非功能需求

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`、`00_req_step_10_business_rules.md`、`00_req_step_11_data_ownership.md`、`00_req_step_12_interfaces_dependencies.md`
> 回填章节：正式 `00` §13 非功能需求
> 类别：性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性。

## 1. 本步目标与数字处理口径

本步定义 Runner 核心能力成立时的质量底线和判断口径。旧材料中的冷启动 `<30s`、热启动 `<5s`、并发 `≥10`、启停成功率 `99.9%` 没有当前权威来源，保留为 `historical_candidate / pending_nfr`，不进入正式目标值；后续架构、配置、测试和验收阶段如获得 authority，再单独量化。

## 2. 能力级非功能要求

| 能力节点 | 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|---|
| `CP-RUN-01` | 安全 | 运行选择必须基于可信 actor/context 和用户显式 immutable version，不得由 `latest`、缓存或隐藏默认值补齐。 | 负向审查中不存在无显式选择的可运行路径；unknown/NotVisible fail-closed。 |
| `CP-RUN-01` | 审计/可追溯 | 选择和 authority 检查必须可回指 source refs、选择世代和当前有效性。 | 每个可运行请求都能解释“选了什么、依据什么、何时失效”；不要求无来源的时间数字。 |
| `CP-RUN-02` | 性能 | 下载、cache 和完整性检查的进度/状态不能让用户失去对主流程的理解。 | 关键阶段必须持续显示可解释进度或明确 blocked/unavailable；具体延迟阈值后置。 |
| `CP-RUN-02` | 可用性 | 下载失败、断线或校验失败时，用户仍能安全重试/等待/重新选择，而不进入未验证运行。 | 失败材料保持 quarantine/invalid；核心安全门禁不因外围服务降级而关闭。 |
| `CP-RUN-02` | 幂等/一致性 | 同一 source ref/version/digest 的重复取得和验证不得产生相互矛盾的资格语义。 | 同一输入在无 source 变化时只产生一致的 passed/failed/unknown 解释；不以重复请求覆盖历史失败。 |
| `CP-RUN-03` | 可用性 | Sandbox/Runtime 正式边界短暂不可用时，Runner 必须保留安全请求状态和可解释恢复入口。 | 不可用只导致 pending/blocked/unavailable，不把本地状态升级为 running/success。 |
| `CP-RUN-03` | 安全 | `accepted`、`running`、`terminal`、`cleanup` 必须保持语义隔离，Runner 不越过 owner 资格。 | 负向验收中 ACK、PID、端口或 toast 推导成功的次数为 0。 |
| `CP-RUN-03` | 幂等/一致性 | 启动、停止、取消等副作用意图在重复提交、版本漂移或 lease 变化时不得产生隐式重复动作。 | unknown/pending 时默认冻结自动重放；每次可确认变化都能回指同一请求关联和 source posture。 |
| `CP-RUN-04` | 可用性 | 端口/资源冲突、断线、休眠、重启和 lease 丢失不会使用户失去安全的下一步。 | 至少提供 conflict/unknown/manual-review/reconcile 之一及影响范围；不能保证任意平台都支持全部能力。 |
| `CP-RUN-04` | 安全 | active lease、capture、handoff、retention 或 orphan 保护存在时不得删除或释放受保护材料。 | cleanup guard 未确认时危险动作被阻止；不得以磁盘压力绕过。 |
| `CP-RUN-04` | 审计/可追溯 | 清理、恢复和资源冲突关键变化必须保留来源、时间语境和保护理由的安全关联。 | 可以解释资源为什么仍受保护、哪个状态未知、下一步由谁/哪个 owner 处理。 |
| `CP-RUN-05` | 性能 | 输出预览和诊断首屏不应因等待完整日志或报告而阻塞用户理解。 | 有安全摘要即可先展示 partial/stale；不以未授权的全量拉取换取体验。 |
| `CP-RUN-05` | 安全 | preview、diagnostic、handoff 均 redaction-first、body-bounded，不暴露 secret/raw body。 | 安全材料检查中无凭据、签名私钥、完整 stdout/stderr、evidence body 泄漏。 |
| `CP-RUN-05` | 审计/可追溯 | 预览、诊断和 handoff 必须能回指 source refs、freshness、redaction/visibility 姿态。 | handoff receipt/delivery 不被解释为最终 verdict/signoff；本地日志不能作为正式证据。 |

## 3. 全局非功能要求

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | Runner 不应因本地状态编排、渲染或重复查询成为安全运行主链的主要瓶颈。 | 后续测试需分别测量选择、取得/验证、状态渲染和恢复；当前不固定 P95/P99 或启动秒数。 |
| 可用性 | 上游外围能力（Archive、可选下游展示、批量预取）失效时，核心选择/验证/受控请求边界仍保持安全；关键 owner 缺失时明确 blocked。 | 不以 fail-open 保持“看起来可用”；核心功能只能在正式前置满足时开放。 |
| 安全 | Runner 不得越权拥有 Artifact、Governance、Runtime、Sandbox、Observability、Archive truth、私有实现或敏感正文。 | 依赖/数据/负向验收均能证明 owner 单一；禁止源码路径、内部表、`latest`、绕过 SDK。 |
| 审计/可追溯 | 用户选择、authority、取得/验证、请求、控制、清理、恢复、预览和 handoff 的关键变化必须可解释、可回指。 | 每个关键本地状态保留安全 source/correlation/ref；正式 evidence/report/verdict 仍由 owner 提供。 |
| 幂等/一致性 | 本地 generation、source version/digest、lease epoch 和请求关联冲突时必须停止副作用；Query/刷新/重连不写上游 truth。 | 负向场景中没有 LWW/盲重放/自动猜测成功；未知显式保留。 |
| 可观测性 | Runner 本地错误、连接、资源和恢复异常应可被安全诊断，但不把 telemetry 当业务审计。 | telemetry redaction/retention 由后续配置和 Observability 合同承接；不得含 secret/raw body。 |

## 4. 适用性与后置量化

六类质量要求均适用于 Runner，但量化程度不同：安全、边界、审计和一致性可在需求阶段形成明确负向判断；性能、平台可用性、资源容量和恢复时限必须等待目标平台、SDK/Sandbox 合同、测试环境和权威 workload 后再定。任何后置数字不能反向削弱 `BR-RUN-001~025`。

## 5. 取舍与回填草稿

正式 §13 将按能力级与全局两层回填质量要求，并单列历史数字不继承说明。不会写 Redis、数据库、监控平台、重试算法、加密实现、具体 SLO 仪表盘或测试脚本。

## 6. 自检与进入下一步门禁

- [x] 六类非功能类别均已检查并给出要求与判断口径。
- [x] 能力级要求已映射到五个核心能力节点，全局约束未硬塞进单节点。
- [x] 无来源数字保持 pending，不伪造阈值。
- [x] 安全、审计、幂等和可观测性边界未滑入实现方案。

`Step 13 gate_status = pass`；下一步允许进入 `Step 14 验收标准`。
