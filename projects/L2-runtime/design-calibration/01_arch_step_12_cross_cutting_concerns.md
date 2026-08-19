# L2-runtime 01 架构 Step 12: 横切关注点

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 13 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 / 8 / 9 / 10 / 11 已收敛结论 |
| 目标 | 收敛持续作用于多单元 / 多边界的横切约束和判断口径 |
| 禁止 | 安全手册、监控配置、密钥脚本、压测脚本、数值伪造或通用口号 |

## 1. 适用性判断

安全边界、审计与可追溯、可观测性、韧性 / 恢复、性能 / 容量、配置与变更控制全部适用，因为 Runtime 横跨多个外部 owner、长时状态、外部副作用和异步反馈。备份策略、灾备拓扑、加密算法、密钥轮换、告警产品等不在架构层单列，它们只有在后续具体承载与风险证据闭口后才能进入相应设计。

## 2. 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界：正式前置 fail closed | Entry、Model、Action、Delegation、Recovery | principal / scope / capability / Governance / Sandbox 前置不可验证时拒绝、等待或 blocked | 防止匿名 run、自我授权、host fallback 和越权 delegation | 横跨入口、决策、行动和恢复，不是单接口校验。 |
| 安全边界：forbidden body / 最小暴露 | Context、Model、Checkpoint、Views、Handoff | secret、raw body、capture、Artifact / Evidence / memory body、hidden reasoning 不入 truth / handoff | 保护 owner separation、隐私和安全调查边界 | 必须从输入到持久化再到输出持续成立。 |
| 审计与可追溯：source / correlation / causation | 全部核心语境与外部 seam | 关键状态、决定、action、checkpoint、feedback、handoff 能回链 owner / source / purpose / run / turn | 保护复盘、冲突判断和责任归属 | 不等于完整日志或 reasoning trace。 |
| 审计与可追溯：immutable history | Run、Decision、Action、Recovery | 新反馈 / reflection / recovery 形成新事实，不原地抹写历史 | 保护恢复合法性和 unknown fence | 横跨本地状态和外部反馈。 |
| 可观测性：核心状态可见 | run / decision / action / checkpoint / outcome | 必须区分 active / waiting / blocked / unknown / failed / terminal 等正式语义 | 保护运行是否真实成立的可审查性 | 是状态可见性约束，不指定观测产品。 |
| 可观测性：交接 / 外部状态分层可见 | Tool / Sandbox / model / child / Bus / Obs / downstream seam | accepted / executed / outcome / attempt / delivered / observed / accepted 不得压平 | 保护跨 owner 协作诊断 | body-free safe material only。 |
| 韧性 / 恢复：stable point / unknown fence | Checkpoint、外部副作用、resume / retry | 只有可证明 stable point 可恢复；commit / side-effect unknown 禁止盲重试 | 保护重复副作用和历史一致性 | 可用性不能越过正确性。 |
| 韧性 / 恢复：外围失败不污染核心 | projection、handoff、Bus / Obs / downstream | 投影 / 传播 / 消费失败只能 stale / gap / pending / degraded，不回滚 local truth | 保护核心运行独立成立 | 可延后重建，不伪装成功。 |
| 性能 / 容量：bounded context / delegation | Context、memory、model、child | 所有工作集、检索、候选和 delegation 必须有 scope / budget / exhaustion 语义 | 防止无界增长拖垮 run 或越权 | 当前不固定 token / 并发数字。 |
| 性能 / 容量：核心路径不被外围 fan-out 阻塞 | Runtime commit、safe view、handoff | Observability、report、analytics、multiple consumers 不成为核心同步提交前置 | 保护关键路径在规模增长下仍可成立 | 不定义 P95 / QPS。 |
| 配置与变更控制：配置不得改变架构红线 | model / memory / Tools / Sandbox / retry / context / handoff 配置面 | 配置不能绕过 owner、fail-closed、unknown fence、forbidden body、依赖类型或 local truth first | 防止配置层暗改架构 | secret / route / quota / cost truth 不因配置进入 Runtime。 |
| 配置与变更控制：行为变化可追溯 | source precedence、budget、adapter availability、recovery / handoff behavior | 会改变运行决定或失败姿态的配置必须受控、可回链并显式生效 | 保护同一输入语义不静默漂移 | 具体 key / default 后移到 04。 |

## 3. 按架构单元横切适用与停审

| 单元 | 安全 | 追溯 / 观测 | 韧性 | 性能 / 配置 | 停审 |
|---|---|---|---|---|---|
| Run & Goal-Plan | principal / scope / formal trigger | state / progress source visible | invalid transition reject / history immutable | bounded goals / controlled behavior change | pass |
| Context & Memory | forbidden body / source scope | composition / use / gap trace | stale / unavailable degraded | context / retrieval budgets | pass |
| Model Decision | secret / raw reasoning exclusion | selection / disposition correlation | adapter unavailable / late result | candidate / turn budget；route config 不越界 | pass |
| Action & Delegation | formal preconditions / bounded scope | action / child / outcome status visible | unknown fence / no host fallback | delegation / action budgets | pass |
| Checkpoint / Recovery / Handoff | body-free checkpoint / handoff | stable point / recovery / attempt trail | immutable history / local truth first | recovery / handoff config controlled | pass |
| Entry & Control | formal principal / safe output | acceptance / rejection visible | unavailable / reject explicit | entry config 不定义 truth | pass |
| External Truth Views | safe ref / no source write | freshness / owner / gap visible | stale / conflict / missing | refresh / resolution bounded | pass |
| Safe Runtime Views | redaction / no mutation | projection state / gap visible | rebuild / degraded | fan-out / view config 不阻塞 core | pass |

## 4. 跨横切审计

| 审计 | 结论 | 状态 |
|---|---|---|
| 模板化空话 | 每项均有具体作用范围、要求和保护目标。 | pass |
| 适用性缺失 | 八个架构单元逐项检查完成。 | pass |
| 数据 / 通信冲突 | local truth、projection、async / background 口径一致。 | pass |
| 配置越界 | provider control / policy / owner truth 不得由 Runtime 配置定义。 | pass |
| 量化伪造 | 无 workload / evidence authority，未写固定数字。 | pass |
| 观测越界 | safe material 与 observed truth 分离。 | pass |

## 5. 门禁

```text
gate_status = pass
next_allowed_action = create_01_arch_step_13_evolution_path
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_13_start
```
