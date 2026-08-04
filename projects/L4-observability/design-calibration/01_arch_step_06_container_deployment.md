# L4-observability 01-架构设计 Step 06 · 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 回填章节: `01-架构设计.md` §7 容器 / 部署架构
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 07

---

## 1. 本步目标

说明 `L4-observability` 在运行时由哪些正式承载单元组成,这些单元如何承接同步入口、异步观察材料、后台维护、观察面真相承载、派生投影 / 报告交接承载和外部运行时对接边界。

本步只表达运行承载角色与部署关系,不写源码目录、代码模块、handler / repository / service 分层、API 路径、事件名、DTO、schema 字段、数据库表、索引、缓存策略、协议选择、部署脚本、基础设施产品或技术选型理由。本步尤其不把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等旧 schema 名称作为容器或部署结论;这些对象线索若后续成立,应在概要 / 详细设计中闭口。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 05 已完成,用户已确认进入 Step 06 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~05 pass,Step 06 blocked by user confirmation | 确认本轮只允许推进 Step 06。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | Step 01 已完成 | 承接 observation truth、依赖裁剪、数据归属和历史材料降级结论。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | Step 02 已完成 | 承接 redaction / correlation、audit projection、read-only handoff、retention / no-write 和产品中立目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 承接做 / 不做 / 易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 04 已完成 | 承接正式外部上下文对象、输入 / 输出面和降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | Step 05 已完成 | 承接核心子域、支撑上下文、本地索引 / 投影 / 引用层和跨上下文审计。 |
| `projects/L4-observability/00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15 | 正式需求基线已完成 | 校验核心能力、功能需求、规则、数据归属、接口边界、NFR、验收和风险。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 6 | 已读取 | 控制本步只回答运行承载、入口、后台、存储 / 基础设施承载和外部运行边界。 |
| `standards/document/架构设计书写规范.md` §4.7 | 已读取 | 控制容器 / 部署架构图、运行单元说明表和部署说明写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_06_container_deployment.md` | 已读取 | 参考运行承载角色、图、运行单元表、部署 / 通信结论组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_06_container_deployment.md` | 已读取 | 参考 truth carrier、derived carrier、外部正文 / 交接边界的表达粒度。 |
| 旧 `design-calibration/01_arch_step_06_container_deployment.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承其中 schema 字段、产品栈或 `next_step_or_formal_assembly` 门禁。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧容器、旧产品栈、旧性能指标和旧部署假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 01~05、架构 SOP Step 6 和书写规范 4.7 | done | 本文件 §2 |
| 回答正式运行单元、同步入口、异步 / 后台、存储 / 基础设施、外部运行边界和不入图对象 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 06 中 schema / 产品 / 实现污染点 | done | 本文件 §5 |
| 选择按运行承载角色组织,不按 schema、代码层、产品栈或子域图组织 | done | 本文件 §7 |
| 输出容器 / 部署架构图、运行单元表、部署关系、通信关系和运行边界红线 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 06 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓在运行时有哪些正式容器或运行单元?

`L4-observability` 的正式运行承载单元包括:

- `Observability 同步入口单元`
- `Observability 异步观察材料消费单元`
- `Observability 后台维护与交接派生单元`
- `Observability 观察面真相承载`
- `Observability 派生投影 / 报告交接承载`
- `观察材料来源 / 事件协作边界`
- `只读消费 / 诊断 / 报告交接边界`
- `留存归档 / 外部审计消费边界`

这些是运行承载角色,不是源码模块、进程名、crate 名、服务名、接口名、事件名、数据库产品、APM 产品、dashboard 产品或部署 workload。后续概要 / 详细设计可以再把这些角色映射到实际应用进程、worker、adapter、repository、store、scheduler 或具体部署形态。

### 4.2 同步入口在哪里?

同步入口位于 `Observability 同步入口单元`。它承接来自 SDK、console、source owner、runtime / sandbox、report / acceptance handoff systems 和管理 / 审计入口的只读查询、诊断查看、报告交接读取、受控材料提交、留存状态查看和管理触发。

本步只确认存在正式同步入口关系,不定义 API、路由、RPC、SDK 方法、command、query、鉴权函数、分页规则、错误 schema 或交互时序。同步入口不得绕过 redaction、correlation、body-free evidence linkage、no-write guard 和真实性提示边界,也不得向 source owner 发出业务修复、执行控制或治理裁决命令。

### 4.3 异步消费者或后台任务在哪里?

异步观察材料由 `Observability 异步观察材料消费单元` 承接。它消费来自 `L0-bus`、source owner、identity、governance、artifact、runtime、sandbox 和外部观察材料来源的 tap / audit material、source observation material、安全引用、摘要、缺口线索或运行信号,并把这些输入收束为本仓可处理的观察材料入口语境。

后台维护、派生投影、rollup、诊断摘要、gap scan、projection rebuild、report handoff material、evidence index input、retention marker 维护、active reference protection 和 no-write violation 解释由 `Observability 后台维护与交接派生单元` 承接。它只能从本仓 observation truth 派生查询、诊断、报告和外围消费材料,不能修复、删除、覆盖或反写 source truth。

### 4.4 数据库 / 缓存 / 总线如何接入?

本步不选择具体数据库、缓存、消息后端、搜索后端、时序存储、对象存储、APM、OTel、Prometheus、Grafana、TimescaleDB、GRC、alert sink、report 系统或协议。架构层只确认:

- `Observability 观察面真相承载` 是本仓正式 observation material、safety decision、correlation context、audit projection、body-free evidence linkage、report handoff fact、retention marker、active reference protection、rebuild / replay fact 和 no-write violation 的必要承载。
- `Observability 派生投影 / 报告交接承载` 承载从 observation truth 派生的查询视图、rollup、诊断摘要、外围消费摘要、报告交接材料、evidence index input 和 external audit / GRC 导出准备材料。
- `观察材料来源 / 事件协作边界` 是本仓与 `L0-bus`、source owner、runtime / sandbox 和相邻 truth owner 形成运行材料入口的正式外部边界,不代表本仓拥有 bus 主干或 source truth。
- 缓存、搜索、时序库、对象存储、dashboard、alert 或外部 APM 不是本步确认的核心运行承载;若后续引入,只能作为派生辅助、产品中立适配或外围消费能力,不得成为 truth source。

### 4.5 哪些运行单元必须分开部署,哪些可以同部署?

架构上必须区分同步入口、异步观察材料消费、后台维护交接、观察面真相承载、派生投影 / 报告交接承载和外部运行边界。P0 可以把 `Observability 同步入口单元`、`Observability 异步观察材料消费单元` 和 `Observability 后台维护与交接派生单元` 同部署在一个服务进程或同一运行环境中,但逻辑运行职责必须分清。

随着吞吐、隔离、安全审查、重放、重建、报告交接、留存扫描、外部审计导出或外围消费压力增加,异步观察材料消费和后台维护交接可以拆分为独立 worker。`Observability 观察面真相承载` 与 `Observability 派生投影 / 报告交接承载` 即使物理同库,架构语义也必须分开;派生承载可重建、可延迟、可降级,不得成为第二 truth。

### 4.6 哪些通信关系是正式主路径?

正式主路径包括:

- `观察材料来源 / 事件协作边界` 进入 `Observability 异步观察材料消费单元`。
- `只读消费 / 诊断 / 报告交接边界` 进入 `Observability 同步入口单元`。
- 同步入口和异步观察材料消费共同推进 `Observability 观察面真相承载`,但只推进本仓 observation truth。
- `Observability 后台维护与交接派生单元` 从 `Observability 观察面真相承载` 派生查询、诊断、rollup、gap scan、report handoff、evidence index input 和 retention / no-write 解释材料。
- 后台维护与交接派生写入或刷新 `Observability 派生投影 / 报告交接承载`。
- 后台维护与交接派生通过 `只读消费 / 诊断 / 报告交接边界` 和 `留存归档 / 外部审计消费边界` 输出交接材料、安全摘要、缺口和真实性提示。

本步只表达运行关系,不表达具体协议、事件主题、接口名称、事务边界、订阅机制、调度机制、canonicalization 算法、hash 算法、存储布局或时序细节。

### 4.7 哪些对象虽然相关,但不应进入本章主图?

| 相关对象 | 不进入主图的原因 | 后续处理 |
|---|---|---|
| `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称 | 这是概要 / 详细设计对象线索,不是运行承载角色。 | 后续数据所有权、概要和详细设计闭口。 |
| `handler`、`service`、`domain`、`repository`、`adapter`、`worker`、`module` | 这是实现分层或代码组织,不是架构层容器 / 部署承载。 | 后续概要 / 详细设计映射。 |
| OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM、GRC、alert sink | 这是产品 / 基础设施候选,不是当前 truth source 或运行承载结论。 | 后续 Step 10、配置设计、测试和实施计划判断。 |
| 具体 topic、event、API、DTO、table、index、TTL、consumer group、outbox | 这是协议、数据和实现细节,不属于 Step 06。 | 后续关键交互、概要、详细和配置闭口。 |
| final verdict、真实 `run_id`、真实 evidence alias、验收签署 | 这是真实测试与验收阶段产物,设计文档不得伪造。 | 后续真实测试 / 验收根据证据产生。 |

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_06_container_deployment.md` 把 log / metric / trace / audit schema 和字段写成结构化中间产物 | Step 06 应表达运行承载角色,不应提前定义 schema 字段或对象形态。 | 全部降级为 historical material,本步按同步入口、异步消费、后台维护、truth carrier、derived carrier 和外部边界重写。 |
| 旧 Step 06 `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 06 后应等待 Step 07 确认。 | 改为 `wait_user_confirmation_before_step_07`。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存和 hash chain 写得像部署主结构 | 具名产品、指标和容量想象不是 Step 06 运行承载结论。 | 只作为 historical material;产品选型、容量、NFR 和配置后移。 |
| 旧正式 `01-架构设计.md` 混写容器、技术栈、存储、schema 和性能指标 | 未经本轮 Step 01~06 停审,且会把产品栈和字段提前硬化。 | Step 16 前不得继承旧正式正文。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在。 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁。 |
| 新版 Step 05 内部上下文较多 | 如果逐个上下文都画成运行容器,图会退化为子域图或实现模块图。 | 主图收缩为运行承载角色,子域语义由 Step 05 保持。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图的主语 | schema 字段、旧产品和泛观测能力 | `L4-observability` 正式运行承载 | 容器 / 部署图应表达运行承接角色。 |
| 同步入口 | 未清晰区分,容易混入查询 / report / schema | `Observability 同步入口单元` | 承接只读查询、诊断、交接和受控管理入口,不写协议。 |
| 异步输入 | 旧内容直接落到 log / metric / trace 对象 | `Observability 异步观察材料消费单元` | 先表达运行材料入口,对象和字段后移。 |
| 后台处理 | 旧内容偏 hash chain、retention days、report 字段 | `Observability 后台维护与交接派生单元` | 统一承接 projection rebuild、gap scan、rollup、report handoff、retention 和 no-write 解释。 |
| 存储承载 | TimescaleDB / 对象存储 / 旧冷存口径 | 观察面真相承载 + 派生投影 / 报告交接承载 | 分清 truth 与 derived / handoff,技术产品后移。 |
| 外部协作 | APM / dashboard / bus / report 混入主结构 | 材料来源 / 事件协作、只读消费 / 交接、留存归档 / 外部审计边界 | 不重画系统上下文,只保留运行时对接身份。 |
| 部署口径 | 旧内容隐含产品和指标前置 | P0 可同部署但逻辑边界分离,后续可拆 worker | 兼顾起步实现和后续隔离 / 扩缩。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 API / application / domain / repository / db 代码层画容器 | 开发者熟悉。 | 这是实现分层,不是运行承载图。 | 不采用。 |
| 方案 B: 按同步入口、异步观察材料消费、后台维护交接、观察面真相承载、派生交接承载和外部运行边界画图 | 符合运行承载粒度,能保护 observation truth 与派生 / 外部边界。 | 后续需要在概要 / 详细设计再映射到代码结构。 | 采用。 |
| 方案 C: 按 Step 05 的核心子域 / 支撑上下文逐个画成容器 | 与语义结构一一对应。 | 会把 4.6 子域图误写成 4.7 运行承载图,并造成过多对象。 | 不采用。 |
| 方案 D: 直接沿用 OTel / Prometheus / Grafana / TimescaleDB / 对象存储部署图 | 接近旧 README 的实现想象。 | 提前定死产品、部署和存储,并让外部产品像 truth source。 | 不采用。 |
| 方案 E: 强制同步入口、异步消费和后台维护从 P0 起独立部署 | 隔离清晰。 | P0 复杂度过高,且不是架构必须条件。 | 不采用。 |
| 方案 F: 把 report handoff、external audit、alert、dashboard 画成核心写入口 | 能突出外围消费。 | 会让派生消费面被误读为 observation truth 写源。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| P0 是否强制同步入口、异步消费和后台维护独立部署 | A. 全部独立部署;B. P0 可同部署但逻辑分离;C. 全部合并为不可拆单元 | B | 降低起步复杂度,保留后续拆分、扩缩、隔离和恢复边界。 |
| 是否在 Step 06 选定具体数据库、时序库、对象存储、消息后端、搜索后端和缓存 | A. 直接选定;B. 只保留正式承载角色;C. 完全不画存储承载 | B | Step 06 应表达承载角色,具体产品和机制属于技术选型、配置或详细设计。 |
| 外部 APM / OTel / Prometheus / Grafana 是否进入主图 | A. 作为内部容器进入;B. 作为产品中立候选不进入主图;C. 当前固定一个产品族 | B | Step 04 / Step 05 已确认外部产品不作为 truth source。 |
| report handoff 和 evidence index input 是否作为 truth 承载 | A. 作为 source truth;B. 作为本仓交接事实和派生承载;C. 后续再决定是否拥有 | B | 本仓拥有交接事实和真实性提示,但不拥有 final verdict、真实 run 或 evidence body。 |
| retention marker 是否单独形成运行存储承载 | A. 单独承载;B. 归入观察面真相承载,由后台维护交接单元维护;C. 归 archive 拥有 | B | retention marker 是本仓 truth,但 Step 06 不需要拆出单独存储产品或运行容器。 |
| `L0-bus` 是否成为本仓内部容器 | A. 是;B. 否,只作为观察材料来源 / 事件协作边界;C. 由实现决定 | B | 本仓不拥有 bus publish / subscribe / ack / retry / replay 主干。 |

---

## 8. 结构化中间产物

### 8.1 容器 / 部署架构图

```text
+----------------------------------+      +----------------------------------+
| 观察材料来源 / 事件协作边界       |      | 只读消费 / 诊断 / 报告交接边界   |
| bus / source / runtime / sandbox |      | sdk / console / report handoff   |
+----------------+-----------------+      +----------------+-----------------+
                 | 消费                                   | 入口
                 v                                        v

        +================================================================+
        |                L4-observability 正式运行承载                   |
        |                                                                |
        |  +----------------------------+   +---------------------------+ |
        |  | Observability 异步观察材料 |   | Observability 同步入口     | |
        |  | 消费单元 async intake      |   | sync entry                 | |
        |  +-------------+--------------+   +-------------+-------------+ |
        |                | 处理                          | 处理           |
        |                v                               v                |
        |  +-------------+-------------------------------+-------------+ |
        |  |              Observability 观察面真相承载                 | |
        |  | observation / audit / handoff / retention truth            | |
        |  +-------------+-------------------------------+-------------+ |
        |                | 处理 / 承载                                    |
        |                v                                                |
        |  +-------------+--------------+   +---------------------------+ |
        |  | Observability 后台维护与   |-->| 派生投影 / 报告交接承载    | |
        |  | 交接派生 maintenance       |   | derived / handoff carrier  | |
        |  +-------------+--------------+   +---------------------------+ |
        |                | 依赖 / 输出                                    |
        +================+================================================+
                         |
                         v
              +----------+----------------------+
              | 留存归档 / 外部审计消费边界    |
              | archive / external audit / GRC |
              +---------------------------------+
```

该图表达 `L4-observability` 的正式运行承载结构,不表达源码目录、接口协议、事件名、数据库表、技术产品、部署参数或子域结构。

图示说明:

- `Observability 异步观察材料消费单元` 和 `Observability 同步入口单元` 是运行入口差异,不是两套 observation truth。
- `Observability 观察面真相承载` 是 observation material、audit projection、body-free evidence linkage、report handoff fact、retention marker 和 no-write violation 的正式承载。
- `Observability 后台维护与交接派生单元` 只从观察面真相派生查询视图、诊断摘要、rollup、gap scan、report handoff、evidence index input 和外部消费材料。
- `派生投影 / 报告交接承载` 可重建、可延迟、可降级,不得成为 source truth、execution truth、governance truth 或 evidence body store。
- 外部边界只作为运行时入口、消费或交接边界出现,不重画系统上下文。

### 8.2 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 观察材料来源 / 事件协作边界 | 运行时对接的正式外部边界 | 承接 `L0-bus`、source owner、identity、governance、artifact、runtime、sandbox 和产品中立观察来源提供的 tap / audit material、source observation material、安全引用、摘要和缺口线索。 | 通过消费关系进入异步观察材料消费单元。 | 它只作为外部运行边界出现,不代表本仓拥有 bus 主干、source truth、execution truth 或 evidence body。 |
| 只读消费 / 诊断 / 报告交接边界 | 运行时对接的正式外部边界 | 承接 SDK、console、source owner、runtime / sandbox、report / acceptance handoff systems 和管理 / 审计入口对安全观察面、诊断摘要和交接材料的正式消费。 | 通过入口关系进入同步入口单元,或消费派生 / 交接承载。 | 它是只读消费边界,不得绕过 no-write guard 或生成 final verdict、真实 run、真实 evidence alias、signoff。 |
| Observability 同步入口单元 | 同步入口单元 | 承接只读查询、诊断查看、报告交接读取、受控材料提交、留存状态查看和管理触发。 | 处理后读取或推进观察面真相承载,并读取派生投影 / 报告交接承载形成响应。 | 不在本章定义 API、RPC、command、query、handler、鉴权或错误细节。 |
| Observability 异步观察材料消费单元 | 异步消费单元 | 承接观察材料、审计材料、安全信号、source ref、actor / subject ref、evidence ref、runtime / sandbox 来源摘要和事件协作输入。 | 消费外部观察材料来源和事件协作边界,处理后推进观察面真相承载。 | 不直接接管来源仓正文,不绕过 redaction、correlation、body-free 和 source truth 边界。 |
| Observability 后台维护与交接派生单元 | 后台处理单元 | 承接派生视图、rollup、诊断摘要、gap scan、projection rebuild、replay 解释、report handoff、evidence index input、retention marker 维护、active reference protection、external audit / GRC 导出准备和 no-write violation 解释。 | 从观察面真相承载派生结果,写入派生投影 / 报告交接承载,并向外部消费边界输出交接材料。 | 不生成 source truth、execution truth、governance decision、artifact lineage、final verdict 或真实 evidence。 |
| Observability 观察面真相承载 | 正式存储承载 | 承载 observation material 准入事实、安全处置语境、correlation context、safe signal、audit projection、body-free evidence linkage、report handoff fact、authenticity hint、retention marker、active reference protection、rebuild / replay fact 和 no-write violation。 | 被同步入口、异步消费和后台维护共同依赖。 | 这是本仓正式观察面真相承载,不写具体数据库、表结构、时序库、对象存储或产品。 |
| 派生投影 / 报告交接承载 | 正式存储承载 | 承载查询视图、rollup、诊断摘要、外围消费摘要、报告交接材料、evidence index input、external audit / GRC 导出准备、留存 / 重建影响摘要和缺口说明等派生辅助结果。 | 由后台维护与交接派生单元生成和维护,由同步入口或外部交接边界消费。 | 可重建、可延迟、可降级,不得成为第二 observation truth 或外部 source truth。 |
| 留存归档 / 外部审计消费边界 | 运行时对接的正式外部边界 | 承接 `L4-archive`、report / acceptance handoff systems、external audit / GRC 和长期分析对留存、归档准备、审计导出和交接材料的消费。 | 接收后台维护与交接派生输出,也可通过只读入口消费派生材料。 | 它表达外部消费和交接边界,不代表本仓拥有 archive package、recovery body、外部审计结论或 GRC truth。 |

### 8.3 部署关系结论

| 关系 | 结论 |
|---|---|
| 同步入口、异步观察材料消费和后台维护交接 | P0 可同部署,但逻辑运行职责必须分离;后续可按吞吐、隔离、恢复、重放、重建、报告交接、留存扫描或外部审计导出压力拆分 worker。 |
| 观察面真相承载与派生投影 / 报告交接承载 | 即使物理同库,架构语义也必须区分;派生承载可重建、可延迟、可降级,不能成为 truth source。 |
| 观察材料来源 / 事件协作边界 | 必须作为运行时对接边界表达,但不得作为本仓内部 bus、source owner 或 execution truth 容器。 |
| 只读消费 / 诊断 / 报告交接边界 | 是外部入口和消费边界,不意味着本仓生成最终验收结论、真实 evidence 或 source write。 |
| 留存归档 / 外部审计消费边界 | 是归档准备、报告交接、外部审计和 GRC 消费边界,不意味着本仓拥有 archive package、GRC truth 或 final signoff。 |
| 缓存、搜索后端、时序库、对象存储、消息产品、APM、dashboard、alert、GRC、hash 算法 | 不进入本步定稿,后续由技术选型、配置设计、详细设计、测试方案或实施计划闭口。 |

### 8.4 通信方式结论

| 运行关系 | 当前架构口径 |
|---|---|
| 观察材料来源 / 事件协作边界到异步观察材料消费 | 只确认存在正式消费关系,不在本步选择 topic、event schema、consumer group、tap、relay、callback 或 outbox 机制。 |
| 只读消费 / 诊断 / 报告交接边界到同步入口 | 只确认存在正式入口关系,不在本步选择 HTTP、gRPC、SDK facade、console action、query language 或 report API。 |
| 同步入口 / 异步消费到观察面真相承载 | 只确认运行处理会推进本仓 observation truth,不写事务、表结构、repository、幂等策略或一致性细节。 |
| 观察面真相承载到后台维护与交接派生 | 只确认派生维护必须从本仓 observation truth 出发,不写调度、批处理、增量策略、索引实现或缓存策略。 |
| 后台维护与交接派生到派生投影 / 报告交接承载 | 只确认派生结果、报告交接材料、诊断摘要、rollup、gap 和外部消费摘要可以被生成和维护,不得反写 source truth。 |
| 后台维护与交接派生到留存归档 / 外部审计消费边界 | 只确认存在留存、归档准备、外部审计和 GRC 消费交接,不写归档包格式、GRC 产品协议、真实 evidence alias 或验收签署。 |

### 8.5 运行边界红线

| 红线 | 结论 |
|---|---|
| 不把源码结构当容器 | `domain`、`application`、`repository`、`handler`、`adapter`、`module`、`crate` 不进入 Step 06 图。 |
| 不把 schema 对象当运行承载 | log、metric、trace、audit、evidence、handoff、retention 的对象名和字段不进入本步定稿。 |
| 不把外部产品当 truth source | OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、alert sink 只能作为后续候选能力。 |
| 不把 bus 当本仓内部容器 | `L0-bus` 是观察材料来源 / 事件协作边界,不把 publish / subscribe / ack / retry / dead-letter / replay 主干迁入本仓。 |
| 不把 source owner 写成本仓容器 | Identity、Governance、Artifact、runtime、sandbox、archive 的 truth 只通过安全引用、摘要、缺口或交接边界协作。 |
| 不把派生读侧当写源 | 查询视图、rollup、诊断摘要、dashboard、alert、report、GRC 导出和长期分析只能从 observation truth 派生。 |
| 不把 report handoff 当真实验收证据 | report handoff 只交接材料线索、脱敏状态、缺口和真实性提示,不生成真实 run、evidence alias、final verdict 或 signoff。 |
| 不把 retention / rebuild 当 source repair | 留存、重放、重建和 gap scan 只作用于本仓观察面和派生投影,不得修复、删除、覆盖或反写 source truth。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 7. 容器 / 部署架构

> 校准来源:
> - `design-calibration/01_arch_step_06_container_deployment.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“运行边界红线”小节,了解本章如何从系统上下文和子域划分收敛出运行承载视图。

### 7.1 容器 / 部署架构图

摘录 `design-calibration/01_arch_step_06_container_deployment.md` §8.1。

### 7.2 运行单元说明表

摘录 `design-calibration/01_arch_step_06_container_deployment.md` §8.2。

### 7.3 部署关系结论

摘录 `design-calibration/01_arch_step_06_container_deployment.md` §8.3。

### 7.4 通信方式结论

摘录 `design-calibration/01_arch_step_06_container_deployment.md` §8.4。

### 7.5 运行边界红线

摘录 `design-calibration/01_arch_step_06_container_deployment.md` §8.5。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 07 的待确认事项。下列事项进入后续 Step,不得在 Step 06 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-006-001` | 同步入口、异步观察材料消费和后台维护交接最终是否拆成独立进程 / worker | 后续概要、详细设计和实施计划根据复杂度闭口;当前只要求逻辑边界分离。 |
| `Q-OBS-ARCH-006-002` | 观察面真相承载和派生投影 / 报告交接承载使用何种数据库、时序库、对象存储、搜索、缓存或产品 | 后续 Step 10、配置、详细设计和测试收敛;当前只固定承载角色。 |
| `Q-OBS-ARCH-006-003` | 观察材料来源 / 事件协作边界的具体 topic、event、tap、consumer、ack、retry、replay 和 dead-letter 机制 | 后续依赖方向、关键交互、详细设计和测试收敛;当前不拥有 bus 主干。 |
| `Q-OBS-ARCH-006-004` | report handoff、evidence index input、authenticity hint 和 external audit / GRC 导出的正式格式 | 后续关键交互、详细设计、测试、验收和实施计划收敛;当前只固定运行交接边界。 |
| `Q-OBS-ARCH-006-005` | retention marker、active reference protection、archive eligibility、legal hold 和 cleanup 的具体配置项 | 后续数据所有权、横切关注点、配置、测试和验收收敛;当前只固定承载和 no-write 边界。 |
| `Q-OBS-ARCH-006-006` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM、GRC 或 alert sink 是否进入正式技术主线 | 后续 Step 10、配置和测试阶段收敛;当前只作为产品中立候选能力。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓正式运行承载单元 | pass | §8.1 / §8.2 已明确同步入口、异步消费、后台维护、truth carrier、derived carrier 和外部运行边界。 |
| 是否明确入口、处理 / 消费、承载 / 依赖等运行关系 | pass | §8.1 图和 §8.4 通信方式结论已收束运行关系,未写协议或事件名。 |
| 是否说明必要外部运行时对接边界且未喧宾夺主 | pass | 外部边界只作为材料来源、只读消费、报告交接、留存归档和审计消费边界出现。 |
| 是否避免重写系统上下文或子域结构 | pass | 本步未重画 Step 04 系统上下文和 Step 05 子域图,只表达运行承载角色。 |
| 是否避免写入源码结构、协议对象、schema 字段、数据库表或部署参数 | pass | 未写 handler、repository、API、DTO、topic、table、index、实例数、资源参数或脚本。 |
| 是否把产品栈或外部 APM 写成 truth source | pass | OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC 和 alert sink 仍为后续候选。 |
| 是否保持 report handoff 和 evidence authenticity 的真实性边界 | pass | 未生成真实 run、evidence alias、final verdict、signoff 或测试结果。 |
| 是否保持 no-write 边界 | pass | 查询、诊断、维护、重建、报告交接和外部导出均不得反写 source truth。 |
| gate_status | pass | 当前 Step 06 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_07 | 必须等待用户确认后才允许进入 Step 07 `依赖方向与层间约束`。 |

当前 Step 06 `容器 / 部署架构` 已完成。下一步必须等待用户确认后进入 Step 07 `依赖方向与层间约束`,并只创建 / 改写 `design-calibration/01_arch_step_07_dependency_direction.md`。
