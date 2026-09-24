# Step 3. 收稳约束条件

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 3 / 收稳约束条件 |
| 状态 | `completed` |
| 当前模块 | `constraints:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 已提炼能直接约束后续代码主体、对象、接口、处理流、状态、异常和配置判断的硬边界；未混入产品选型、实现参数或泛化工程口号。 |
| next_allowed_action | `read_and_start_step_04` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 按项目台账、02 flow、Step 2 恢复当前门禁。
- [x] 读取概要 SOP Step 3 与书写规范 §4.3。
- [x] 回读正式 00 §10～13、正式 01 §8～13 及 ADR 红线。
- [x] 回答五个 SOP 问题，区分结构约束、实现细节和泛化口号。
- [x] 独立形成约束表和后续 Step 门禁，再扫描旧 02/README/draft 污染。
- [x] 完成回填草稿、自检并同步 flow / 项目台账。

### 1.2 写入前检查

- 项目级：用户已授权连续完成 02 并进入 03 Step 4；当前仍须先完成 02 Step 3。
- 文档级：Step 1～2 已通过；Step 3 是当前唯一可写的概要 Step。
- Step 级：不命名最终组成部分、对象、接口或状态全集，只给其必须满足的判断规则。
- 真实性：`RUN-UP-001~008` 仍为 `blocked/pending`，约束不能把缺失合同变成可用能力。
- 图示：书写规范禁止本章画图，本步只使用表格。

## 2. 本步输入

| 输入 | 提供的约束来源 |
|---|---|
| Step 1 | Owner 边界、required seam、本文必须/不再回答及 blocker 上限。 |
| Step 2 | 可实现结构目标、非范围、概要深度及下游归属。 |
| 正式 00 §10～13 | 显式版本、authority、材料资格、多轴结果、保护、no-write、redaction、依赖与 NFR 红线。 |
| 正式 01 §8～13、§17 | 依赖方向、数据归属、一致性、通信、技术机制、取舍、横切约束及 ADR。 |
| 全局依赖规则 | Layer 5、SDK-first、编译期/运行期/事件协作边界。 |
| 旧 02、README、draft | 后置污染扫描，不提供当前约束来源。 |

## 3. SOP 问题回答

### 3.1 哪些约束直接影响对象、接口、流程或状态机

1. Runner local truth 与 owner truth 必须分层；对象必须标注所有权和来源。
2. 所有副作用必须绑定显式 immutable Release/version、scope 和 selection generation；隐式版本永不进入接口或流程。
3. Authority、取得、完整性、平台资格、请求、boundary、execution、control、cleanup、diagnostic 与 handoff 必须分轴；状态不得用一个 `success` 压平。
4. 跨域只经 SDK/公开 API/adapter；入口、核心、技术承载不能直接依赖 sibling 私有实现、内部表、topic 或事务。
5. Query、刷新、重连、渲染和投影重建必须 no-write；事件只提示/承接 owner 事实，后台任务不得修复上游 truth。
6. unknown/stale/conflict/reconcile-required 时冻结危险副作用；重试或恢复不能自动重放未知写操作。
7. active lease/capture/handoff/retention/orphan 保护未解除时不得淘汰或删除材料。
8. preview/diagnostic/handoff 必须 redaction-first、body-bounded、带 source/freshness；本地记录不是正式 evidence。
9. local probe 与 owner allocation/lease/cleanup 必须并列呈现，任何单侧观察都不能升级为全局资源结论。
10. 上游 exact contract 未闭合时，只允许 required seam、blocked adapter 和负向/fail-closed 流程进入设计。

### 3.2 约束来源如何区分

- 正式 00 提供行为红线：显式选择、不可本地补 authority、材料验证、`accepted != running`、保护、恢复和证据边界。
- 正式 01 提供结构红线：分层依赖、所有权、同步/异步/后台路径、最小本地状态、技术可替换和 ADR。
- 全局规则提供跨仓红线：Layer 5 只能通过 L0-sdk/公开 seam 协作，运行期与事件关系不得误写成源码依赖。
- Step 2 提供深度红线：本轮只到可实现骨架，完整 schema/DDL/实现/配置/测试/实施不得前移。

### 3.3 最容易串仓或越层的边界

- 把 Release selection/cache metadata 写成 Artifact/Release truth。
- 把 authority posture 写成本地 approval 判定。
- 把 RunnerRun、ACK、PID、端口或 socket 写成 Runtime/Sandbox running truth。
- 把 local resource probe 写成 allocation、lease 或 cleanup truth。
- 把 stdout/stderr 摘录或本地 telemetry 写成 Observability evidence/audit。
- 把 refresh/reconnect/reconcile 写成自动 replay 或上游 repair。
- 把逻辑页面直接连接 SDK、数据库或 Sandbox backend，绕过共同应用门禁。
- 把 required port 名称写成上游已实现的 exact client/API。
- 把概要字段骨架扩展成完整 schema、源码目录、配置清单或测试断言。

### 3.4 哪些只是泛化原则，不进入约束表

“代码清晰”“高内聚低耦合”“高性能”“高可用”“易测试”“用户友好”等无法直接裁决结构的口号不进入。具体语言、框架、数据库、协议、后端产品、目录、线程/进程数、重试次数、超时、容量和 P95/P99 也不进入；它们需要各自的 authority、ADR、配置或测试依据。

### 3.5 约束如何指导后续章节

每条保留约束至少用于裁决一个后续 Step：Step 4 的分层与依赖；Step 5 的组成部分 ownership；Step 6 的对象类型与字段禁区；Step 7 的接口分类/公开 seam；Step 8 的副作用与恢复；Step 9 的状态来源；Step 10 的失败保护；Step 11 的不可配置化边界；Step 12～13 的详细设计交接和 blocker。

## 4. 当前文档问题诊断

| 历史倾向 | 风险 | 本轮处置 |
|---|---|---|
| 旧 02 把 queue/retry/replay/kill 当产品动作 | 控制入口可能成为未知副作用自动重放或侵占 Runtime/Sandbox | 只保留正式 intent、owner result、unknown freeze 和 reconcile 约束。 |
| 旧 02 把 output/evidence preview 混写 | 本地摘录可能被误作正式审计材料 | 强制 safe reference、redaction、bounded body 和非 evidence 标识。 |
| README 声称共享 Sandbox 实现 | 形成私有编译依赖与 backend 锁定 | 明确只能经公开 Sandbox seam；backend 始终留在 owner 内。 |
| README 固定 Tauri/Rust/Docker 及性能数值 | 技术和数字会反向定义代码主体 | 仅保留载体可替换、无来源数字不得进入设计。 |
| draft 候选对象/port 看似完整 | required port 容易被误读为已存在合同 | 后续所有 port 必须标 owner、required capability、blocker 和 readiness 上限。 |

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 以旧产品动作和技术栈暗示约束 | 以 ownership、source、side effect、保护和证据边界裁决结构。 |
| RunnerRun 可承载含混 run success | 强制多轴状态和 owner attribution，禁止万能状态。 |
| refresh/retry/replay 语义不清 | 读取 no-write；未知写操作冻结；恢复先 query/reconcile。 |
| 本地资源与 Sandbox 资源易混 | local observation 与 owner allocation/lease/cleanup 双视图。 |
| required interface 与可用 adapter 易混 | 所需合同、真实合同、实现 readiness 三者分离。 |
| 配置和技术可能绕过安全门禁 | truth owner、显式版本、authority、完整性、unknown、cleanup guard 和 redaction 不可配置化。 |

## 6. 设计取舍

| 方案 | 判断 | 结论 |
|---|---|---|
| 复制正式 01 的全部约束 | 内容完整但不能直接指导概要结构，且重复上游 | 不采用。 |
| 沿用旧 02 的技术/容量约束 | 夹带无来源产品与数字 | 不采用。 |
| 按后续 Step 可裁决性筛选硬约束 | 能形成可检查门禁且不越层 | 采用。 |
| 因 exact contract blocked 而完全不设计接口边界 | 会令 03 无法识别所需 seam | 不采用；设计 required seam，但保持 adapter blocked。 |

## 7. 结构化中间产物

### 7.1 约束条件表

| 约束 | 说明 |
|---|---|
| Runner local truth 与 owner truth 分离 | 选择/generation、意图、下载/cache、验证姿态、local probe、cursor 和展示归 Runner；Release/approval/execution/boundary/lease/cleanup/evidence/archive 只以 safe ref/snapshot/status 进入。对象、接口和状态必须标 ownership/source。 |
| 显式 immutable selection 是所有副作用前提 | 取得、请求、控制和清理必须绑定 Release/version、scope、generation 与 source binding；禁止 `latest`、默认分支、目录最新文件或静默沿用旧选择。 |
| Authority 与材料资格不得本地补齐 | 只有可验证且 current 的 owner authority，加上与同一 source/version/digest 绑定的完整性和平台资格，才能形成本地 qualified posture；角色、历史成功、cache、ACK 或 HTTP 200 不得放行。 |
| 传输、验证、cache 晋级与保护分离 | 下载完成不等完整性通过；材料先进入 incomplete/quarantine，验证通过且 authority 重验后才可 qualified；保护存在时不得淘汰。 |
| 生命周期必须多轴且来源可追溯 | selection、authority、download、integrity、request、boundary、execution、control、cleanup、diagnostic、handoff、connectivity 分开建模；`accepted != running`，邻轴不得推导正式成功。 |
| RunnerRun 不得成为 execution truth | 本地运行记录只承载选择、意图、关联、观察和展示；running、terminal、result、boundary、lease 与 cleanup 必须回指 Sandbox/Runtime owner status/ref。 |
| 所有跨域协作经正式公开 seam | 外部访问只经 L0-sdk 或 owner 公开 API/adapter；禁止 sibling 源码、内部存储/事务、Bus 私有 topic/group 和 Sandbox 私有 backend。required port 不证明 exact surface 已存在。 |
| 入口不得绕过应用与核心门禁 | GUI、CLI、SDK/产品入口和后台任务共享同一选择、资格、幂等、状态与保护规则；入口不得直连外部 client、本地存储或平台副作用。 |
| Query/refresh/render/reconnect 必须 no-write | 读取路径只能读取、组合、裁剪或重建本地 view；不得批准、启动、停止、清理、修复上游 truth、推进 owner cursor 或重放副作用。 |
| 同步、异步与后台职责分离 | 同步路径承接验证、查询和意图受理；异步路径承接正式 owner 事实/变化信号；后台路径承接取得、验证、投影和对账。任何路径都不能凭 delivery 或 job success 创造 owner 成功。 |
| Unknown/stale/conflict 时冻结危险副作用 | 超时、断线、session/source/generation/lease 不匹配或事件缺口时，控制、清理和可能重复的写操作进入 reconcile/manual-review；不得自动 replay。 |
| Local probe 与 owner resource truth 双视图 | 端口、路径、磁盘、进程和平台能力是短时本地观察；allocation、boundary、lease、cleanup 属于 owner。冲突或无法对齐时必须 blocked/unknown，不得静默抢占。 |
| 材料保护优先于释放便利 | active lease、capture、handoff、retention 或 orphan 保护未明确解除时，cache、运行目录和诊断材料不得删除；cleanup intent、accepted、confirmed 与 released 分开。 |
| 预览和诊断最小暴露 | Preview/diagnostic/handoff 只能使用 redacted、bounded、body-free 或允许摘要，并保留 source/freshness/visibility；secret/raw body/外部正文禁止进入持久本地 truth。 |
| 本地日志和 handoff receipt 非正式证据 | 本地 telemetry 只支持诊断；handoff accepted/delivered 只表示交接姿态，不能成为 evidence/report/verdict/signoff、运行成功或审计完成。 |
| 外部不可见与不完整必须显式 | restricted/partial/stale/blocked/unavailable 不能以空集合、默认 allow、旧快照或 generic unknown DTO 掩盖；状态和页面必须展示来源限制。 |
| Blocked contract 只允许负向闭环 | `RUN-UP-001~008` 未关闭时可定义 required port、输入输出语义上限、blocked/unknown 分支和本地测试 seam；不得定义真实方法/schema、锁 transport/算法或宣称正向 readiness。 |
| 技术载体不得反向定义核心 | UI 壳、语言、进程模型、数据库、协议和 Sandbox backend 可替换；核心语义不得依赖 Tauri/Electron/Docker/gVisor/Firecracker 或平台 API。 |
| 配置不得穿透安全与 ownership | 配置不得启用 implicit latest、跳过 authority/integrity、把 unknown 变 success、解除 cleanup guard、关闭必要 redaction/source attribution 或改写 truth owner/依赖方向。 |
| 数量和性能结论必须有 authority | 无 workload/测试 authority 时，不在对象、流程、状态或配置中写固定并发、容量、超时、重试和 P95/P99；只保留 bounded/progress/backpressure 等结构性要求。 |
| 概要设计停在可实现骨架 | 可点名主语、关键字段/参数类型、接口类别、流程阶段和状态方向；完整 schema、签名、DDL、源码路径、配置 key、测试断言和实施 boundary 留给后续文档。 |

### 7.2 后续章节门禁

| Step | 主要门禁 |
|---:|---|
| 4 | 业务语义轴与实现分层轴正交；核心不依赖入口、SDK client、平台或存储产品。 |
| 5 | 每个组成部分有 capability 和 ownership；不把 owner truth、UI 页或 backend 产品当组成部分。 |
| 6 | 对象标明 local truth/snapshot/ref/observation/view；字段不复制禁止正文。 |
| 7 | 接口区分 Command/Query/Consumer/Event/Job/port；required 与 available 分开。 |
| 8 | 每个副作用有前置、幂等/冲突、owner result 和 unknown/reconcile 出口。 |
| 9 | 多轴状态、来源和禁止推导明确；不存在万能 `success`。 |
| 10 | 失效、撤销、漂移、断线、冲突、保护和不可见均有保守边界。 |
| 11 | 配置只影响承载/策略参数，不改变安全与 ownership。 |
| 12～13 | 详细设计承接与 blocker 明确，不把未决项写成 readiness。 |

## 8. 回填草稿

正式 §3 使用 §7.1 的约束表，按 ownership、资格、多轴状态、跨域接缝、恢复保护、证据和实现深度分组压缩；不得删除会影响 Step 4～13 的红线。§7.2 只留在 calibration 作为后续自检入口。

## 9. 待确认事项

- `RUN-UP-001~008` 原样保留，仅限制正向 adapter 与 exact contract。
- 技术载体、资源数字、性能预算和平台 profile 没有 authority，本步不作选择。
- 本步不新增阻塞 Step 4 的问题；若 Step 4 无法在不锁产品的前提下形成双轴框架，应回退本步检查约束是否过度或不足。

## 10. 进入下一步条件

- [x] 每条约束均能裁决至少一个后续概要结构问题。
- [x] 已覆盖 ownership、版本/资格、多轴状态、依赖、读写、恢复、保护、redaction、证据和 blocker。
- [x] 未复制上游全文，未写泛化口号、产品选型、实现参数或配置细节。
- [x] 未修改正式 02，未创建未来 Step 文件，未实现或执行测试。

结论：`gate_status=pass`，允许进入 Step 4“代码主体框架映射”。
