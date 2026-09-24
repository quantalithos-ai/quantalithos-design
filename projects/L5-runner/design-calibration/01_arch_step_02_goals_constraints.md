# 01 架构 Step 2 · 架构目标与约束

> 状态：`completed`
> 前置：`01_arch_step_01_requirements_baseline.md`、正式 `00`、全局依赖规则
> 回填章节：正式 `01` §2 业务背景与驱动力、§3 约束条件

## 1. 本步目标与输入检查

本步把需求基线转译为结构目标和架构红线，保持目标、不可变约束、当前阶段取舍和非目标四类语义分离。已确认 Step 1 已通过；上游合同仍未闭合的部分只能形成架构条件和 blocker，不能被技术方案补齐。

## 2. 业务驱动力

Runner 的架构难点不是提供一个可启动的本地进程，而是把端侧用户意图与多个上游 truth 严格隔离，同时让用户理解“选择了什么、是否有资格、请求是否被接收、是否真的运行、是否安全清理”。如果架构把本地 cache、PID、Sandbox ACK 或诊断正文当成正式事实，Runner 会变成第二个 Release、Runtime、Sandbox 或 Observability 真相中心。因此架构必须优先承载边界、状态来源、恢复保护和可追溯交接。

## 3. 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载端侧选择与运行意图的独立真相 | 用户选择、请求关联、控制意图和恢复姿态需要独立于上游执行真相，否则无法表达 pending/unknown。 |
| 守住正式 authority 到本地资格的单向承接 | 只有正式 Release/Governance 结果才能形成可取得/可运行资格，本地状态不能反向批准。 |
| 让取得、验证、请求、执行、清理和预览保持多轴语义 | 单一 RunnerRun 状态会掩盖 owner 差异和未知副作用，破坏安全验收。 |
| 支撑跨平台本地观察而不拥有全局资源调度 | 端口、路径、容量和平台能力需要可解释，但不能被本地 probe 伪装成 Sandbox allocation 或 lease truth。 |
| 让恢复路径以保护和对账为中心 | 断线、休眠、重启和 lease 变化必须能冻结副作用并进入 reconcile/manual-review，而非盲目重放。 |
| 以安全摘要连接预览、诊断和正式交接 | 用户需要可理解反馈，但 raw body、secret、evidence 和 verdict 必须留在 owner 边界。 |
| 保持入口形态和外部技术可替换 | GUI、CLI、平台壳、下载 transport 和 Sandbox backend 不应决定核心语义或形成私有依赖。 |

## 4. 不可变约束表

| 约束 | 说明 |
|---|---|
| 不拥有上游 truth | Runner 不定义 Release、approval、execution、boundary、audit 或 archive 的正式生命周期。 |
| 不允许隐式版本 | latest、默认分支、目录排序和历史选择不能成为副作用输入。 |
| 不允许 owner seam 旁路 | 外部能力必须经 L0-sdk 或正式公开 API/adapter；不得源码路径、共享内部存储或私有 backend。 |
| 不把局部观察升级为正式状态 | PID、端口、cache、HTTP 200、ACK、stdout/stderr 只能作为局部观察或提示。 |
| 未知状态保护副作用 | unknown、stale、conflict、reconcile_required 时，危险控制和清理必须挂起。 |
| 保护材料优先于本地便利 | lease/capture/handoff/retention/orphan 保护未解除时不得删除或淘汰。 |
| 诊断最小暴露 | preview、diagnostic、handoff 只允许 redacted、bounded、带来源和 freshness 的安全材料。 |
| 读路径不修复事实 | 查询、刷新、重连和渲染不得暗中触发上游 repair、批准、重放或清理。 |

## 5. 当前阶段可接受取舍

| 取舍 | 当前口径 |
|---|---|
| 精确下载/签名/撤销协议 | 当前只定义 authority/integrity seam 和 fail-closed 语义，等待 RUN-UP-001/002。 |
| 精确 Sandbox/Runtime 控制合同 | 当前只定义 request、lease、lifecycle、cleanup 和 reconcile 边界，等待 RUN-UP-003/004。 |
| 平台资源容量和恢复时限 | 当前保留冲突可见、保护和人工复核口径，不给无来源数字，等待 RUN-UP-007。 |
| Archive 浏览和恢复 | 当前作为外围引用边界，不进入启动、运行或清理主链，等待 RUN-UP-006。 |
| Observability 正式交接 | 当前只承载安全诊断摘要和 handoff posture，等待 RUN-UP-005。 |
| GUI/CLI/桌面框架 | 当前只要求入口形态可替换和共享语义，不锁定框架或进程模型。 |

## 6. 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Release/Artifact 服务架构 | 版本、manifest、digest 和生命周期属于 Artifact owner。 |
| 不设计 Governance 决策架构 | approval、policy、gate 和 revoke 属于 Governance owner。 |
| 不设计 Runtime loop 或 Sandbox backend | 执行和隔离真相属于相邻 owner；Runner 只定义公开接缝。 |
| 不设计 Observability evidence/report pipeline | 本地诊断不拥有正式证据链。 |
| 不设计生产部署、集群调度或公网分享 | 与端侧受控试用入口的架构主线不同。 |
| 不设计数据库表、DTO、API 路径、函数或源码目录 | 这些属于后续概要/详细设计，且必须等待上游合同。 |

## 7. 取舍与历史方案诊断

旧 01 的 shared runner core、Tauri、SandboxService 和固定性能预算把尚未核验的技术载体写成了架构主线。本步保留“入口与核心语义分离、正式 adapter、可替换承载”这些结构判断，删除具体框架、容器 backend、SLA 和性能数值的架构承诺。

## 8. 结构化产物与回填草稿

正式 §2 回填业务驱动力和七条架构目标；正式 §3 回填不可变约束、当前阶段取舍和架构非目标。性能、平台、协议和上游合同继续由 §15 风险与待确认承接，不在目标表中伪造确定值。

## 9. 自检与进入下一步门禁

- [x] 目标写结构性结果，不写功能清单或技术名词。
- [x] 约束、取舍和非目标语义分离。
- [x] 所有未闭合上游合同保持条件性。
- [x] 未进入系统图、子域、容器、数据表或实现层。

Step 2 gate_status = pass；下一步允许进入 Step 3 职责边界。
