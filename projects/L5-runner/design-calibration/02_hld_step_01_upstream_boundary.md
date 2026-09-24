# Step 1. 确认上游输入边界

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 1 / 确认上游输入边界 |
| 状态 | `completed` |
| 当前模块 | `upstream_boundary:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 正式 00/01、专项上游当前正式设计、必要台账和概要规范已复核；可承接结论与 exact-contract blocker 已分离。 |
| next_allowed_action | `read_and_start_step_02` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 先读取项目级执行台账，确认 01 已在 `formal_stop_review` 且用户已授权进入 02。
- [x] 读取概要设计 SOP、书写规范及中间产物门禁，确认 14 Step / 14 章主链。
- [x] 复核本仓正式 00/01 及其 blocker、ownership、多轴状态和技术未决项。
- [x] 复核指定专项上游当前正式设计及必要项目台账，不以旧 README 或名称相似推断 exact contract。
- [x] 回答 SOP 问题、诊断旧 02 污染、完成取舍和结构化映射。
- [x] 完成回填草稿、自检并同步 flow / 项目台账。

### 1.2 Step 开工与写入前检查

- 项目级门禁：用户在 01 停审后发出“继续”，已授权进入 02；未授权 03 或实现。
- 文档级门禁：本 flow 已建立；Step 1 是当前唯一可写 Step。
- Step 级门禁：本步只确认输入边界，不展开对象、API、流程或状态。
- 历史材料门禁：旧 02、README 与 draft 后置读取，只用于冲突扫描。
- 真实性门禁：所有上游缺口保持 `blocked/pending`；静态阅读不等于合同已实现或集成可用。

## 2. 本步输入

| 输入 | 使用范围 |
|---|---|
| `projects/L5-runner/00-需求文档.md` | 定位、能力闭环、FR/BR、数据归属、验收和 `RUN-UP-001~008`。 |
| `projects/L5-runner/01-架构设计.md` | 六个语义上下文、运行单元、依赖、所有权、一致性、交互、横切和 ADR。 |
| 概要 SOP / 书写规范 / 中间产物规范 | 本步问题、正式 §1 输出结构、三层门禁和 full-restart 纪律。 |
| 全局依赖规则 §4.1 | Layer 5 并行窗口和单仓 `00->07` 串行纪律。 |
| 指定上游 `L0-sdk`、`L1-artifact/work/governance/workspace`、`L2-runtime`、`L4-sandbox/observability/archive` 当前正式设计 | 核验 owner、公开边界、no-write、状态和证据上限。 |
| 有项目级台账的专项上游台账 | 核验文档/实现状态，避免把正式设计误写成已实现。 |

## 3. SOP 问题回答

### 3.1 当前概要设计承接哪些需求结论

1. Runner 是端侧运行入口，核心闭环是可信语境与显式选择、authority/取得/完整性、受控请求与生命周期、资源/清理/恢复、预览/诊断/handoff。
2. 每次运行必须绑定 immutable Release/version、scope 和 selection generation；禁止 `latest`、默认分支和目录最新文件。
3. Runner 拥有本地选择、取得/cache/验证姿态、请求与控制意图、本地资源观察、展示/恢复/诊断姿态；不拥有任何上游 truth。
4. `accepted`、boundary、running、terminal、control result、cleanup 和 handoff 是独立来源/状态，不能压成单一成功。
5. unknown/stale/conflict/reconcile_required 时冻结危险副作用；活动 lease/capture/handoff/retention/orphan 保护未解除时不得删除材料。
6. 预览和诊断必须 redaction-first、body-bounded、带 source/freshness；本地日志和 handoff ACK 不是正式证据。

### 3.2 当前概要设计承接哪些架构结论

1. 业务语义沿“选择与资格、取得与材料资格、运行意图与生命周期、资源清理恢复、输出诊断、端侧入口展示”展开。
2. 实现依赖必须保持入口 -> 应用编排 -> 核心语义，并通过正式外部 seam / 技术承载满足需求；核心不依赖 UI、SDK client、平台 API、存储产品或 Sandbox 私有实现。
3. 外部 owner status/ref/snapshot 与 Runner local truth 分离；local probe 与 owner allocation/lease/cleanup 分离。
4. 同步资格/意图、异步 owner 事实和后台本地工作是三类不同处理路径。
5. 技术产品、语言、桌面壳、进程模型、数据库、协议和性能数字均未定稿。

### 3.3 哪些结论足够稳定

- 所有权、非职责、SDK-first、显式版本、fail-closed、query no-write、unknown 不自动重放、材料保护、redaction/evidence 边界足够稳定。
- 六个语义组成方向、多轴状态原则、同步/异步/后台分工、端侧逻辑页面和 required port 类别足以进入概要骨架。
- 这些稳定性只支持 Runner 本地结构和 required seam 设计，不支持声明真实正向集成可用。

### 3.4 哪些结论仍未收稳

- Artifact locator/manifest/integrity、Governance authority、Sandbox request/lease/cleanup/reconcile、Runtime safe read、Observability diagnostic/handoff、Archive ref、资源责任和 SDK exact surface 均未闭合。
- 因此本轮不得锁定真实 client 方法、DTO/schema、event family、transport、算法、后端产品、平台数值或正向 readiness。
- 上述缺口不会被旧 02 的 `runtime/sandbox/artifact/observability/capability-hub` 叙事、draft 对象名或 fake adapter 补齐。

### 3.5 哪些边界决定当前不该展开到哪里

- 不重开需求/架构 ownership 和技术取舍。
- 不写完整字段全集、函数签名、序列化 schema、HTTP/RPC/topic、DDL、代码目录、实现任务、配置 key 或测试结果。
- 不把逻辑页面绑定到 Tauri/Electron/Web，不把隔离绑定到 Docker/gVisor/Firecracker。
- 不创建 implementation ledger、boundary skeleton、baseline、commit、run_id、artifact、report、evidence、verdict、signoff 或 readiness。

## 4. 当前文档问题诊断

| 问题 | 影响 | 本轮处置 |
|---|---|---|
| 旧 02 使用“运行承载体验”叙事，却把 queue/retry/replay/capability-hub 等未核验职责写入主线 | 容易侵占 Runtime/Sandbox/Capability owner 并弱化显式 Release 入口 | 不继承章节或对象；从正式 00/01 重新推导。 |
| 旧 02 只有 7 章，缺新版对象、接口、处理流、状态、配置和承接链 | 无法支撑详细设计 | Step 1～14 full-restart 重建。 |
| 旧 02 含 `99.9%`、`<200ms`、`<1s` 等无 authority 数字 | 会伪造 NFR 基线 | 作为污染项排除，量化留待 workload/test authority。 |
| 旧 02 把 ACK、queue、output/evidence preview 与运行/证据语义混近 | 可能误验收 accepted、preview 或本地日志 | 多轴状态和证据边界作为硬门禁。 |
| draft 已有十个模块、对象名和 port 名 | 有助于遗漏扫描，但未经 02 Step 推导 | 只在独立判断后做差异审计，不自动继承模块数量或命名。 |
| 上游正式文档成熟度不完全一致 | 文档存在不等于 exact API 可检索或实现完成 | 只承接稳定 ownership；exact surface 继续 blocker。 |

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 02 直接以旧页面体验和相邻系统名组织 | 先以正式 00/01 的六个语义方向和 ownership 作为输入。 |
| 上游名称被当作现成集成面 | 名称只说明 owner；Runner required port 与真实 adapter 可用性分开。 |
| `success`、ACK、运行状态和清理容易混写 | 后续必须使用独立状态主语及 source attribution。 |
| 历史技术和数字可直接进入正文 | 仅作历史冲突扫描；没有当前 authority 就不进入结论。 |
| 缺 calibration flow 和 Step 产物 | 本 flow 和 Step 1 已建立，后续严格串行。 |

## 6. 设计取舍

1. 采用正式 00/01 作为唯一直接基线；专项上游用于校验 owner/seam，不替代本仓基线。
2. 采用“本地可设计、正向 adapter 受 blocker 控制”的分层：先收稳本地对象、命令、页面、状态与 fail-closed 行为，同时明确哪些 adapter 只能 planned/blocked。
3. 不采用旧 02 的 queue-first、control-button-first 或 capability-hub 主线；Runner 主线从显式 immutable Release 选择开始。
4. 不采用单一 `RunnerRun.status` 表达所有阶段；后续对象和状态章节必须分轴。
5. 不把逻辑页面等同技术 UI 框架；页面是产品入口契约，具体载体留给 03/07 重新核验。

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 本仓正式 `00-需求文档.md` | `CP-RUN-01~05`、显式版本、authority/取得/运行/清理/恢复/诊断要求、所有权和验收红线 | 六个主要组成部分、逻辑页面/入口、关键对象、接口、流程、状态和测试切口骨架 |
| 本仓正式 `01-架构设计.md` | 六个语义上下文、运行承载、依赖分层、local truth 与 owner snapshot/ref 分离、多轴状态和 ADR | 代码主体框架、实现分层、port/adapter 边界与一致性结构 |
| 全局依赖规则 | Layer 5 并行窗口、SDK-first、compile/runtime/event/ref/adapter 分类 | 本仓依赖裁剪和不可旁路边界 |
| `L0-sdk` 当前正式设计 | 官方跨域访问、错误/redaction/trace 和 adapter 隔离 | Runner required SDK ports；exact client 名称/版本保持 `RUN-UP-008` |
| `L1-artifact` / `L1-governance` 当前正式设计 | Release/Artifact/version/baseline/integrity 与 Decision/Approval ownership | selection/authority/material qualification 的 reference/posture 对象和 blocked adapters |
| `L1-work` / `L1-workspace` 当前正式设计 | Project/context truth 与跨域 no-write safe view | RunnerContext 的安全 ref/visibility 输入；不拥有项目状态 |
| `L2-runtime` 当前正式设计 | execution/outcome/recovery ownership | owner-safe run snapshot port；RunnerRun 不成为执行 truth |
| `L4-sandbox` 当前正式设计 | boundary/policy/run/capture/lease/cleanup ownership | Sandbox required port、request/control/cleanup intent 与 `accepted != running` 流程 |
| `L4-observability` 当前正式设计 | observation/audit/evidence/diagnostic/handoff ownership | bounded/redacted preview、diagnosis 与 handoff intent/receipt 边界 |
| `L4-archive` 当前正式设计 | archive/restore ownership | 条件性 Archive ref 浏览，不进入核心运行或清理判断 |

### 7.2 本文不再回答

- Runner 为什么存在、服务哪些用户，以及需求是否成立。
- Release/Artifact、Governance、Project/Work、Runtime、Sandbox、Observability、Archive 的 truth owner。
- 系统上下文、依赖方向、数据所有权、架构方案和技术产品取舍。
- 上游 exact DTO/API/event/schema 的具体定义，及任何实现/测试/readiness 事实。

### 7.3 本文必须回答

- 六个业务语义方向如何映射成代码主体与实现分层。
- 逻辑页面、CLI/SDK 入口和后台 job 如何共用同一 application/domain 门禁。
- 哪些 Runner-owned 对象与 owner reference/projection 必须正式点名。
- Command、Query、Inbound Consumer、Operations Job 和 required port 如何分类。
- 显式选择、下载/cache/验证、Sandbox 请求、启停/清理、资源冲突、预览/诊断/handoff、断线恢复的关键流程。
- 多轴状态、资源与清理一致性、配置影响、测试切口和证据边界如何交给详细设计。

### 7.4 当前可承接上限

`RUN-UP-001~008` 不阻止本轮形成本地结构骨架、required seam、blocked/unknown/fail-closed 路径和详细设计承接清单；它们阻止声明真实 adapter 已可实现、正向集成已通过或具体协议已闭合。正式 02 完成后仍不等于实现许可。

## 8. 回填草稿

正式 §1 将使用 §7.1 的上游关系映射表，并摘录 §7.2/§7.3 的“不再回答 / 必须回答”清单。正式正文不复制阅读过程、旧材料诊断或上游台账状态细节；这些保留在本文件。

## 9. 待确认事项

| 项目 | 当前口径 |
|---|---|
| 上游 exact contract | `RUN-UP-001~008` 原样保留；后续只设计 required port 和安全失败。 |
| 页面载体 | 只定义逻辑页面/入口，不选择 Tauri/Electron/Web/CLI-only。 |
| 本地存储与进程模型 | 只定义 storage/worker 责任，不选择 SQLite、单进程、多进程或 daemon。 |
| 事件接入 | 只有正式 SDK/event seam 闭合后才启用；否则以显式 refresh/query/reconcile 保守承接。 |

## 10. 进入下一步条件

- [x] 已明确承接的需求和架构结论。
- [x] 已明确稳定输入与未收稳 exact contract。
- [x] 已明确本文不再回答和必须回答的问题。
- [x] 未提前展开代码主体、对象字段、API、处理流或状态机。
- [x] 历史材料只作后置污染审计。
- [x] 静态自检不冒充上游签署、实现或测试。

结论：`gate_status=pass`，允许串行进入 Step 2；正式 02 仍不可写。
