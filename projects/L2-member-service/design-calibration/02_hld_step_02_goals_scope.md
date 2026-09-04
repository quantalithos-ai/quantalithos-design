# 02 概要校准 Step 2：明确设计目标与范围

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 1 completed / pass
> 本步目的：固定本轮概要设计应收稳的结构、设计深度和明确非范围，避免借概要设计扩大需求或预支详细实现

## 1. Step 内计划

- [x] 读取 Step 1 的 stable input、pending ceiling 与“必须回答”清单。
- [x] 回答概要设计目标、范围、非范围和深度五个 SOP 问题。
- [x] 诊断旧 02 将功能执行、架构重述和实现选择混入概要范围的问题。
- [x] 确认 C-MS-1~5 与必要 S / P 支撑是本轮主线。
- [x] 对外围增强、开放合同、产品与数值作显式范围裁剪。
- [x] 形成正式第 2 章回填草稿与 Gate 自检。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `02_hld_step_01_upstream_boundary.md` | 约束本轮只能消费 stable input，并保持 `MSVC-UP-001~008` positive ceiling |
| 正式 00 §4、§7、§9~14 | 提供目标、C-MS-1~5、核心 / 外围能力、接口能力面和验收红线 |
| 正式 01 §2~15 | 提供 Host Truth Center、A / S / P、三运行角色、机制与演进边界 |
| 概要 SOP / 书写规范 Step 2 | 规定目标表、非范围表、设计深度口径，且本章禁止画图 |

## 3. SOP 问题回答

### 3.1 本次概要设计最主要要把哪些结构说清

1. 把 A1~A5、S1~S3、P1~P3 转译为业务主要组成部分和可进入详细设计的代码主体框架。
2. 为意图、资格、实例世代、装配 / readiness、注册 / Host Session、健康 / 处置、收束 / 对账、safe material / projection 建立关键对象轮廓。
3. 按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、External Port 分开接口骨架，并标记 exact contract placeholder。
4. 收稳同步受理、后台副作用推进、异步反馈、查询、对账、投影与发布等关键处理流。
5. 收稳多个并行状态主语及其 generation / freshness / local-external outcome 传播，禁止压成一个宿主总状态。
6. 明确影响主线的异常、配置影响、详细设计承接点和 blocker，不产生实现或 readiness 事实。

### 3.2 这一轮应停在什么深度

- 可以点名正式业务组成部分、application service / domain object / policy / projection / port / job 主语。
- 关键对象按独立对象卡片提供概要字段类型、状态集合、成员函数与工厂函数参数类型。
- 接口只固定类别、名称、输入 / 输出对象骨架、读写性质、归属、local result 和 pending ceiling。
- 处理流只固定参与对象、关键判断、提交边界、外部调用顺序和失败分支，不写完整调用链或伪代码实现。
- 状态只固定状态族、允许 / 禁止迁移和传播关系，不写持久化 schema、锁实现或完整错误码。
- 配置只识别受影响面与禁止配置化边界，不写 key、默认值、环境变量、secret 位置或 JSON。
- 所有 exact 双侧协议、产品选择、实现布局、测试、验收和实施内容后移到相应正式文档。

### 3.3 哪些内容属于本次概要范围

| 范围 | 承接内容 | 当前输出上限 |
|---|---|---|
| C-MS-1 意图与执行主语 | 双锚、来源、scope、受理 / 冲突 / no-action、编排决定 | 本地对象 / Command / Query / 状态与写路径 |
| C-MS-2 装配与就绪 | 外部资格、实例 generation、装配分项、Host Readiness、carrier / binding local outcome | 本地 qualification / assembly 骨架；对端 positive blocked |
| C-MS-3 注册与 Host Session | registration acceptance、endpoint、唯一活动 Host Session、replacement / invalidation | host-side skeleton；Member / Runtime exact contract waiting |
| C-MS-4 健康与恢复 | host / session / backend / unknown、恢复 / 重启 / 停止 / 终止 / hold 决定 | 状态、信号消费、处置与 generation fence 骨架 |
| C-MS-5 收束与事实交接 | local cleanup / release、residual、orphan / drift、reconciliation、safe material / gap | local-first 对象、Job、Event 和状态传播 |
| S1 / P1 必要支撑 | Identity / Work / Images / credential ref、safe snapshot、freshness、qualification | 不拥有来源正文或 lifecycle |
| S2 / P2 必要支撑 | carrier / registry / Member / Runtime / Sandbox association 与安全 outcome | product-neutral port；exact contract placeholder |
| S3 / P3 必要支撑 | body-free material、local handoff、safe current view、freshness / rebuild | 核心安全消费面，不扩张为观测 backend |
| 横切机制 | idempotency、correlation、generation、single-active、local-first、audit / history | 概要级 guard 和传播规则 |

### 3.4 哪些相关内容当前不进入概要范围

| 非范围 | 原因 / owner | 留给哪一层 |
|---|---|---|
| 需求目标、用户故事、owner、子域和架构取舍重开 | 已由正式 00 / 01 收稳 | 只有新 authority 才回退 00 / 01 |
| Runtime run / turn / goal / plan / memory / checkpoint / action / outcome | `L2-runtime` truth | Runtime 正式设计 |
| Member 主体、presence、attention、IPC 内部和 report body | `L2-member` truth | sibling 正式 02 / 03 |
| Images 内容、build、BOM、provenance evidence、Role -> image 映射 | `L2-member-images` / Method Library | sibling / upstream 正式设计 |
| Tool execution、ToolInvocation、capability registry、MCP / A2A / API truth | Tools / Capability owner | 相邻仓正式设计 |
| Sandbox isolation、policy enforcement、capture、cleanup / backend truth | `L4-sandbox` | Sandbox 正式设计 |
| Governance approval / policy truth、Observability / Artifact / Archive / L1 truth | 各正式 owner | 相邻仓正式设计 |
| `MSVC-UP-001~008` exact DTO / IPC / schema / receipt / route / credential | 双侧 owner 尚未闭口 | E1 合同闭口后回校验 02 / 03 |
| policy 传递和非项目型宿主 | 无当前 FR / 主语 authority | 重开正式 00 / 01 后再进入 |
| 容量 / 放置建议、资产预热、forensic 材料、跨实例聚合视图 `E01~E04` 的独立主线 | 外围增强，不是 C-MS-1~5 成立前置 | 后续正式需求触发或 03 的 optional cut；当前只保留扩展边界 |
| 语言、框架、crate / module / file、完整 trait / struct、repository / transaction / DDL | 详细实现层 | `03-详细设计.md` |
| 容器 / 编排、registry、RPC、event、database、cache、observability 产品 | 缺 product authority | `03/04/07` 与必要 ADR |
| 配置 key / default / numeric threshold / secret source | 配置设计层 | `04-配置设计.md` |
| 测试矩阵、运行结果、evidence、verdict、SLA / capacity 数字 | 无执行与 measurement authority | `05/06` |
| 实施任务、目标仓、commit boundary、部署 / 回滚步骤 | 实施层 | `07-实施计划.md` |

### 3.5 哪些内容留给详细设计

- 业务组成部分到 crate / module / file、service / trait / repository / adapter 的准确映射。
- 对象完整字段、enum、value object、error、不变量、factory / method 返回类型和 serialization。
- Command / Query / Event / Job 的 request / response / envelope / receipt / error / version / compatibility 契约。
- Unit of Work、事务边界、持久化、outbox、CAS / expected version、幂等存储和并发控制。
- 外部 port 的 exact 调用顺序、timeout / commit-unknown、unknown effect reconciliation 和 fake parity。
- 完整状态转换矩阵、错误映射、恢复动作、测试切口和 runtime wiring。

## 4. 当前材料问题诊断

| 当前 / 旧材料问题 | 对范围的影响 | 本步修复 |
|---|---|---|
| 旧 02 把 Runtime action 与工具实际执行写进主线 | 使概要范围越过本仓 owner | 从范围中排除，只保留 Host Session / handoff seam |
| 旧 02 把 capability mount 当本地 truth | 使资格摘要升级为 capability truth | 改为 S1 / P1 ref、snapshot、qualification |
| 旧 02 同时写业务目标、系统上下文、组件、产品和数字 | 混淆 00 / 01 / 02 / 04~06 层次 | 02 只收可实现结构骨架 |
| draft 九模块是未复核候选 | 容易机械继承早期分层 | Step 4 / 5 从 A / S / P 和 C-MS 重新推导 |
| 上游合同 pending | 容易以“为了可落码”为由补 schema | 允许 placeholder port，禁止 positive contract |
| 外围增强与核心 safe view 有重叠 | 容易让容量 / forensic 变成核心前置 | 只保留 IB-MS-015 的当前宿主安全读取；E01~E04 不独立展开 |

## 5. 改动前后对比与设计取舍

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 概要目标 | 解释“宿主如何执行动作” | 交付 Host Truth 可实现结构骨架 |
| 核心范围 | host + action + capability + sandbox 混合 | C-MS-1~5 + 必要 S / P 支撑 |
| 外部合同 | 倾向按假想正向协议展开 | host-side placeholder + fail-closed outcome |
| 外围增强 | 与核心并列 | 保留扩展边界，不进入独立对象 / API / flow / state 分母 |
| 设计深度 | 混入产品、数字和实现 | 对象 / 接口 / flow / 状态骨架，细节后移 |

取舍说明：本轮优先保证核心闭环和 owner 可落码，而不是追求“所有需求候选都有同等展开深度”。外围增强继续保留追溯和回开入口，但不得扩大当前实现分母。

## 6. 结构化设计目标

| 目标 ID | 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|---|
| `HLD-MS-001` | 收稳代码主体双轴框架 | 区分业务主要组成部分与 Inbound / Application / Domain / Ports / Persistence 等实现分层 | 可继续决定 module / service / port / adapter / entry 布局 |
| `HLD-MS-002` | 收稳核心组成部分与边界 | 每个组成部分有 capability、候选对象、非职责和接缝 | 可按组成部分建立模块实现契约 |
| `HLD-MS-003` | 正式化关键对象轮廓 | truth / policy / reference / projection / audit 对象均可回指 capability | 可补完整字段、enum、方法、不变量与存储契约 |
| `HLD-MS-004` | 收稳接口分类与骨架 | Command / Query / Consumer / Event / Job / Port 分开，placeholder 显式 | 可展开 DTO、envelope、error、idempotency 与 authorization |
| `HLD-MS-005` | 收稳关键处理流 | 覆盖五节点写路径、状态写入 consumer、关键 job、query 和 publication | 可展开 application service、UoW、repository、port 与 side-effect ordering |
| `HLD-MS-006` | 收稳并行状态与传播 | 主语、generation、freshness、local / external outcome 可区分 | 可展开状态矩阵、guard、并发和恢复测试 |
| `HLD-MS-007` | 收稳异常与配置影响 | fail-closed、unknown、gap、residual、forbidden body 和配置红线有落点 | 可展开 error taxonomy、validator、runtime builder 与配置 schema |
| `HLD-MS-008` | 收稳详细设计承接与 blocker | stable input、继续展开、回退规则、owner / ceiling 可追溯 | 03 不需重新发明主语，也不能静默补上游合同 |

## 7. 当前阶段设计深度口径

```text
formal HLD depth
  = named business components
  + named code subjects and implementation layers
  + per-object field/type and function-parameter skeletons
  + classified interface skeletons
  + key local transaction / side-effect flow boundaries
  + state families, allowed / forbidden transitions and propagation
  + exception, configuration-impact and detailed-design handoff boundaries

formal HLD depth
  != exact cross-owner contract
  != full schema / signature / DDL / code path
  != product / topology / numeric configuration
  != implementation / test / evidence / readiness
```

## 8. 正式第 2 章回填草稿

```md
## 2. 本次设计目标与范围

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 将 A1~A5、S1~S3、P1~P3 转译为业务组成与实现分层双轴 | module / service / port / adapter / entry 边界 |
| 收稳主要组成部分 | 围绕 C-MS-1~5 及必要资格、承载、交接和投影支撑形成 capability 闭环 | 组成部分级实现契约 |
| 正式化关键对象 | 为 truth、state、policy、reference、projection、audit / history 提供概要字段与函数骨架 | 完整对象、enum、不变量和存储契约 |
| 收稳接口、流程和状态 | 分类 Command / Query / Consumer / Event / Job / Port，连接关键流程与并行状态 | DTO、事务、错误、幂等、状态矩阵和测试切口 |
| 收稳异常、配置影响与承接 | 固定 fail-closed、unknown、gap、禁止配置化和回退规则 | 03 / 04 可继续展开且不补造上游 truth |

| 非范围 | 留给哪一层 |
|---|---|
| 相邻 owner 的 Runtime / Member / Images / Tools / Sandbox / Governance / Observability / L1 truth | 相邻仓正式设计 |
| `MSVC-UP-001~008` exact 双侧合同 | owner 正式合同闭口后回校验 02 / 03 |
| policy 传递、非项目型宿主、E01~E04 外围增强独立主线 | 正式需求触发后重开范围 |
| 完整对象 / 协议 / 持久化 / 事务 / 文件布局 | 03 |
| 配置 key / default / secret / 数字 | 04 |
| 测试、验收、evidence 与实施 | 05~07 |

当前设计停在“可进入详细设计的结构骨架”：对象字段有概要类型，函数参数有类型，接口 / flow / 状态可追溯；不写完整签名、schema、DDL、代码路径、产品、数字或完成证据。
```

## 9. 待确认事项

- 无阻塞 Step 3 的范围问题。
- `MSVC-UP-001~008` 不进入“非范围后即消失”，而是贯穿相关对象 / 接口 / flow / state 的 blocker 标记。
- E01~E04 保持正式需求中的外围增强身份；本轮不独立展开不等于删除需求，未来纳入须校验核心非前置与 owner 不反转。

## 10. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 结构目标清楚 | pass | HLD-MS-001~008 覆盖代码主体、组成、对象、接口、流程、状态和承接 |
| 当前范围与 stable input 一致 | pass | 只展开 C-MS-1~5 与必要 S / P 支撑 |
| 非范围有明确归属 | pass | sibling、03~07、需求重开边界均已点名 |
| 概要深度明确 | pass | 允许字段 / 参数类型，禁止完整 schema / 实现 / 产品 / 证据 |
| 外围增强未挤入核心分母 | pass | E01~E04 保留扩展边界但不独立展开 |
| pending 未被范围文字伪关闭 | pass | `MSVC-UP-001~008` 必须贯穿后续 Step |
| 足以进入 Step 3 | pass | 可据此筛选直接影响结构的硬约束 |

```text
step_02_status = completed
step_02_gate = pass
formal_02_write_allowed = false
next_allowed_step = Step 3 structural_constraints
```
