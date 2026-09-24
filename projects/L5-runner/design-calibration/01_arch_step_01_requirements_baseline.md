# 01 架构 Step 1 · 确认需求基线

> 状态：`completed`
> 前置：正式 `projects/L5-runner/00-需求文档.md`、上游当前架构文档、全局依赖规则
> 回填章节：正式 `01` §2 业务背景与驱动力、§3 约束条件、§16 需求追溯矩阵

## 1. 本步目标

把正式需求中的外部行为、边界、数据归属、依赖和非功能约束提炼为可支撑架构推导的基线，区分已稳定前提与仍会阻塞架构闭口的上游合同。本文不重新编写需求，也不提前决定容器、技术栈、协议或代码结构。

## 2. 本步输入与需求基线

| 来源 | 已确认的架构相关结论 | 架构影响 |
|---|---|---|
| `00-需求文档.md` §2/§4 | Runner 是端侧已授权 Release/version 的运行入口；不拥有 Artifact、Governance、Runtime、Sandbox、Observability、Archive truth。 | 架构中心必须是本地意图/视图与正式 owner seam 的隔离。 |
| §7 核心能力闭环 | `CP-RUN-01`→`CP-RUN-05` 依次覆盖选择、资格、受控请求、资源/恢复、预览/诊断。 | 架构必须支持多轴状态和阶段性 blocked/unknown。 |
| §9/§10 | `FR-RUN-001~016`、`BR-RUN-001~025` 要求显式 immutable version、authority 校验、完整性、受控 Sandbox、清理保护、redaction 和 no-write query。 | 依赖方向、数据和通信不能绕过 owner 或把 ACK 当成功。 |
| §11 | Runner-owned local truth、上游 snapshot、safe ref、禁止正文四类数据边界。 | 本地持久化只承载选择/意图/保护/恢复姿态，不承载上游正文。 |
| §12/§13 | SDK-first；查询 no-write；变更表达意图；性能、平台、容量、恢复数字后置。 | 架构只固化能力级 seam 和判断口径，不锁协议、数字或框架。 |
| §14~§16 | 验收必须 fail-closed；风险与追溯保持 owner blocker；无实现事实。 | 架构结论必须可回指验收和 blocker，不得宣称 ready。 |

## 3. 架构硬约束

| ID | 硬约束 | 保护对象 |
|---|---|---|
| `AB-RUN-001` | 每个副作用请求都绑定显式 immutable Release/version、scope、selection generation 和可信 actor/context。 | 版本选择与请求语义 |
| `AB-RUN-002` | Artifact/Release 与 Governance authority 只能通过正式 owner seam 消费；Runner 不本地批准、修改或冻结。 | Release/Governance truth |
| `AB-RUN-003` | 未验证的 locator/manifest/digest/signature、平台资格或 stale authority 不得成为 Sandbox 输入。 | 取得与完整性门禁 |
| `AB-RUN-004` | Sandbox accepted、Runtime running、terminal、cleanup 必须分轴表达；本地 PID/端口/cache 不升级 owner truth。 | 执行与清理真相 |
| `AB-RUN-005` | unknown/pending/reconcile_required 冻结危险副作用；禁止盲目重放。 | 幂等与恢复安全 |
| `AB-RUN-006` | active lease、capture、handoff、retention、orphan 保护未解除时不得淘汰材料。 | 资源与清理保护 |
| `AB-RUN-007` | preview/diagnostic/handoff 必须 redaction-first、body-bounded、可回指来源；不生成正式 evidence/report/verdict。 | 敏感信息和审计边界 |
| `AB-RUN-008` | 跨域访问只经 L0-sdk 或正式公开 API/adapter，不复用 Sandbox 私有实现，不共享内部存储。 | 依赖和封装边界 |

## 4. 当前稳定与未稳定结论

| 状态 | 结论 |
|---|---|
| 稳定 | Runner 本地拥有选择、运行/控制意图、取得/验证姿态、资源观察、恢复姿态和安全展示组合。 |
| 稳定 | 上游 owner truth 只以安全 snapshot/ref/status 被消费；查询不写上游 truth。 |
| 稳定 | `latest`、默认版本、ACK、PID、端口、stdout/stderr、cache 不能构成正式成功。 |
| 未稳定 | Artifact locator/manifest/integrity/revoke/expire consumption contract（`RUN-UP-001`）。 |
| 未稳定 | Governance authority chain、scope、expiry/revoke/conflict（`RUN-UP-002`）。 |
| 未稳定 | Sandbox request、lease、orphan、cleanup、recovery contract（`RUN-UP-003`）。 |
| 未稳定 | Runtime safe read surface（`RUN-UP-004`）。 |
| 未稳定 | Observability diagnostic/handoff/retention seam（`RUN-UP-005`）。 |
| 未稳定 | Archive 正向消费与恢复引用（`RUN-UP-006`）、平台资源责任（`RUN-UP-007`）、SDK exact surface（`RUN-UP-008`）。 |

## 5. 历史材料污染诊断

旧 `01` 把 Tauri/Electron、Docker/本机进程、Rust shared core、SandboxService、固定冷/热启动数字、并发数字、SLA、`ReleaseOption`/`LocalRunSession`/`SandboxExecutionView` 以及 ADR-0008/0009 写成了当前架构事实。这些内容没有在本轮正式 `00` 和当前上游合同中闭合，统一降级为 `historical_material` 或 `pending_candidate`；它们不能直接进入新的架构边界、选型、NFR 或 ADR。

## 6. 结构化中间产物：架构基线卡

| 维度 | 当前基线 |
|---|---|
| 架构主语 | 端侧 Runner 产品入口与其本地运行体验边界。 |
| 核心架构问题 | 如何把显式、可验证、不可变的 Release 选择安全交给正式 Sandbox/Runtime seam，并保留清理、恢复、预览和诊断语义。 |
| 本仓正式 truth | 选择/世代、意图/关联、取得与验证姿态、资源观察、恢复和展示组合。 |
| 外部 truth | Release、Governance、Project/Work、Runtime、Sandbox、Observability、Archive。 |
| 允许的降级 | blocked、pending、unknown、stale、restricted、partial、manual-review、reconcile_required。 |
| 禁止的架构推断 | 由 latest/cache/ACK/PID/端口/HTTP 200/日志推断 authority、running、cleanup、evidence 或 signoff。 |
| 量化处理 | 历史性能、并发、成功率和 SLA 不进入当前架构目标；等待 authority/workload。 |

## 7. 回填草稿

正式 §2 将说明 Runner 架构需要承载可信选择、正式 owner seam、多轴运行生命周期和本地安全体验；正式 §3 将写入八条不可变边界、上游 blocker 的架构影响、当前可接受收缩和架构非目标；正式 §16 将把 `CP-RUN-01~05`、`FR-RUN-001~016`、`BR-RUN-001~025` 与后续架构单元、ADR、验收入口连接起来。

## 8. 自检与进入下一步门禁

- [x] 需求基线来自正式 `00`，未重写需求全文。
- [x] 已区分稳定结论、上游 blocker 和历史污染。
- [x] 架构硬约束可回指需求规则和 owner 边界。
- [x] 未提前决定容器、协议、框架、数据库或代码模块。

`Step 1 gate_status = pass`；下一步允许进入 `Step 2 架构目标与约束`。
