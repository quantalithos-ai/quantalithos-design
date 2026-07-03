# Step 6. 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 回填章节: `01-架构设计.md` §7 容器 / 部署架构
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-artifact` 在运行时由哪些正式承载单元组成,这些单元如何承接同步入口、异步输入、后台维护、正式真相存储、派生消费承载、外部正文来源对接和跨仓交接边界。

本步只表达运行承载角色与部署关系,不写源码目录、代码模块、handler / repository / service 分层、API 路径、事件名、DTO、数据库表、索引、缓存策略、协议选择、部署脚本、基础设施产品或技术选型理由。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供正式外部上下文对象、输入面、输出面和降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地索引 / 投影 / 引用层。 |
| `projects/L1-artifact/00-需求文档.md` §7 / §9 / §11 / §12 / §13 / §15 | 已重建 | 提供核心能力闭环、功能需求、数据归属、接口边界、NFR 和待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 6 | 已读取 | 控制本步只回答运行承载、入口、后台、存储、总线和部署关系。 |
| `standards/document/架构设计书写规范.md` §4.7 | 已读取 | 控制图、运行单元表、部署说明和禁区写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §6 | 旧 Draft | 只作为旧容器图、技术栈、存储和通信方式问题诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_06_container_deployment.md` | 已参考 | 只参考“图 + 运行单元表 + 部署 / 通信结论”的组织框架,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 4、Step 5、SOP Step 6 和书写规范 4.7 | done | 本文件 §2 |
| 回答正式运行单元、同步入口、异步 / 后台、存储 / 总线、部署关系和主路径问题 | done | 本文件 §4 |
| 诊断旧 `01-架构设计.md` §6 中代码层、技术栈和基础设施污染点 | done | 本文件 §5 |
| 收敛运行承载图、运行单元表、部署关系和通信关系 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 6 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓运行时有哪些正式容器或运行单元?

`L1-artifact` 的正式运行承载单元包括:

- `Artifact 同步入口单元`
- `Artifact 异步输入消费单元`
- `Artifact 后台维护与派生单元`
- `Artifact 真相存储承载`
- `Artifact 派生消费承载`
- `下游消费 / 管理入口边界`
- `外部语境 / 定义 / 自动化输入边界`
- `外部正文 / 内容来源对接边界`
- `Artifact 事件协作 / 追溯交接边界`

这些是运行承载角色,不是源码模块、进程名、crate 名、服务名、接口名、事件名、数据库产品、内容后端或部署 workload。后续概要 / 详细设计可以再把这些角色映射到实际应用进程、worker、adapter、repository 或具体部署形态。

### 4.2 同步入口在哪里?

同步入口位于 `Artifact 同步入口单元`。它承接来自 SDK、console、sync、work、process、governance、conversation、workspace、archive、observability 和管理入口的同步变更、查询、受控触发和正式消费读取。

本步只确认存在正式同步入口关系,不定义 API、路由、RPC、SDK 方法、command、query、鉴权函数、分页规则或错误 schema。

### 4.3 异步消费者或后台任务在哪里?

异步输入由 `Artifact 异步输入消费单元` 承接,用于消费外部语境、定义来源、自动化产出、相邻仓状态变化和事件协作边界提供的正式输入或可引用摘要。它只能将这些输入收束为 Artifact fact、version、lineage、baseline 或消费回指语境,不能接管外部 truth 正文。

后台维护、派生读侧、搜索 / 浏览材料、预览摘要、投影、报告、对账、重建、完整性候选检查、归档准备、观测解释和同步交接材料由 `Artifact 后台维护与派生单元` 承接。它只能从 Artifact truth 派生消费辅助结果或交接材料,不能创建、覆盖、冻结或改写 Artifact fact、version、lineage、baseline 或 consumption backref truth。

### 4.4 数据库 / 缓存 / 总线如何接入?

本步不选择具体数据库、缓存、消息后端、搜索后端、对象存储、内容存储、hash 算法、内容寻址方式或协议。架构层只确认:

- `Artifact 真相存储承载` 是本仓正式 Artifact fact、version、lineage、baseline 和 consumption backref truth 的必要承载。
- `Artifact 派生消费承载` 承载从 Artifact truth 派生的搜索、预览、投影、报告、对账、归档准备、观测解释和同步交接辅助材料。
- `外部正文 / 内容来源对接边界` 是本仓运行时接触外部正文来源、内容引用或完整性线索的对接边界,不拥有外部正文生命周期。
- `Artifact 事件协作 / 追溯交接边界` 是本仓与跨仓变化协作、observability、archive 和下游消费形成运行交接的正式外部边界。
- 缓存不是本步确认的核心运行承载;若后续引入,只能作为派生辅助或性能优化,不得成为 truth source。

### 4.5 哪些运行单元必须分开部署,哪些可以同部署?

架构上必须区分同步入口、异步输入消费、后台维护派生、真相存储、派生消费承载、外部正文对接和事件交接边界。P0 可以把 `Artifact 同步入口单元`、`Artifact 异步输入消费单元` 和 `Artifact 后台维护与派生单元` 同部署在一个服务进程或同一运行环境中,但它们的职责边界必须清楚。

随着吞吐、隔离、恢复、重建、报告、对账、归档、完整性检查或消费交接压力增加,异步输入消费和后台维护派生可以拆分为独立 worker。`Artifact 真相存储承载` 与 `Artifact 派生消费承载` 即使物理同库,架构语义也必须分开。

### 4.6 哪些通信关系是正式主路径?

正式主路径包括:

- 下游消费 / 管理入口边界进入 Artifact 同步入口单元。
- 外部语境 / 定义 / 自动化输入边界进入 Artifact 同步入口或异步输入消费单元。
- 外部正文 / 内容来源对接边界为同步入口、异步输入或后台维护提供内容引用、来源摘要或完整性线索。
- Artifact 事件协作 / 追溯交接边界进入 Artifact 异步输入消费单元。
- 同步入口和异步输入共同推进 Artifact 真相存储承载。
- 后台维护与派生单元从 Artifact truth 派生消费辅助结果、报告、对账、归档准备、观测解释和同步交接材料。
- 后台维护与派生单元通过 Artifact 事件协作 / 追溯交接边界输出变化感知、追溯材料、维护证据或消费交接材料。

本步只表达运行关系,不表达具体协议、事件主题、接口名称、事务边界、订阅机制、调度机制、hash 算法、内容读取方式或时序细节。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 容器图写 `artifact-api -> application layer -> domain / lineage query / content adapters / hash checker` | 把同步入口、代码分层、语义对象、查询实现、内容适配和后台任务混成一张容器图。 | 改为正式运行承载单元和外部运行边界。 |
| `artifact-domain` 被写成容器 | 这是代码或逻辑层,不是运行承载单元。 | 不在 Step 6 画 domain / application / infra 分层。 |
| `lineage-engine` + `PostgreSQL recursive CTE` | 提前锁定查询实现、数据库能力和技术细节。 | 血缘消费进入 Artifact truth / 派生消费承载,具体查询机制后置。 |
| `content-adapters(Git / S3 / inline / URL)` | 把外部正文来源和技术后端提前写成正式子系统。 | 改为 `外部正文 / 内容来源对接边界`,不拥有外部正文生命周期。 |
| `hash-scan worker` / `hash checker / subscriptions` | 过早锁定后台任务名、完整性机制和订阅方式。 | 改为后台维护与派生单元中的完整性候选检查和事件交接边界。 |
| `PostgreSQL(metadata + relations + baselines)` | 提前选择数据库产品,且把数据表意图写进容器图。 | 改为 `Artifact 真相存储承载`,不写产品、表、索引或分区。 |
| `bus(outbox)` | 把事件协作机制和 outbox 实现提前写死。 | 改为 `Artifact 事件协作 / 追溯交接边界`,不写 topic、payload 或 outbox。 |
| 技术栈表写 Rust、PostgreSQL、Git / S3 / inline / URL | Step 6 不应锁定技术产品、实现语言和部署产品。 | 技术栈后移到技术选型、配置设计或详细设计。 |
| §6.4 数据存储归属混入容器章节 | 数据 ownership 已属于需求和后续数据所有权 / 一致性讨论。 | 本步只表达 truth carrier 与 derived carrier 的运行承载区分。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图的主语 | API / application / domain / PostgreSQL / content adapters / bus | `L1-artifact` 正式运行承载 | 容器图应表达运行承接角色,不是代码分层或基础设施清单。 |
| 同步入口 | `artifact-api` + RPC / HTTP | `Artifact 同步入口单元` | 不提前锁定协议和 API 形态。 |
| 异步输入 | subscriptions 和 outbox 混写 | `Artifact 异步输入消费单元` + 事件交接边界 | 保留运行角色,具体订阅 / outbox 后移。 |
| 后台处理 | hash-scan、lineage query、subscriptions 分散 | `Artifact 后台维护与派生单元` | 统一承接 projection、报告、对账、完整性候选、归档准备和同步交接。 |
| 存储承载 | PostgreSQL + content backends | 真相存储承载 + 派生消费承载 + 外部正文来源边界 | 分清 truth、derived 和 external body source,技术产品后移。 |
| 外部协作 | process / work / governance / archive / observability / bus 分散入图 | 外部输入边界、消费入口边界、内容来源边界和事件交接边界 | 不重画系统上下文,只保留运行时对接身份。 |
| 部署口径 | 主服务 + PG 起步,hash-scan 可内嵌或独立 | P0 可同部署但逻辑边界必须分开 | 兼顾起步实现与后续 worker / storage 拆分。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 API / application / domain / infra 代码层画容器 | 开发者熟悉。 | 这是实现分层,不是运行承载图。 | 不采用。 |
| 方案 B: 按同步入口、异步消费、后台维护、真相存储、派生承载、内容来源和事件交接边界画图 | 符合运行承载粒度,能保护 truth / derived / external body 边界。 | 后续需要在概要 / 详细设计再映射到代码结构。 | 采用。 |
| 方案 C: 强制同步入口、异步消费、后台维护全部独立部署 | 隔离清晰。 | P0 复杂度过高,也不是架构必须条件。 | 不采用。 |
| 方案 D: 直接沿用 PostgreSQL + content adapters + hash worker + bus 图 | 接近旧实现想象。 | 提前定死技术产品、进程和实现对象,不符合 Step 6 粒度。 | 不采用。 |
| 方案 E: 把 search / projection / report / preview 画成核心运行写入口 | 能突出消费体验。 | 会让派生面被误读为 Artifact truth 写源。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| P0 是否强制同步入口、异步输入和后台维护派生独立部署 | A. 全部独立部署;B. P0 可同部署但逻辑分离;C. 全部合并为不可拆单元 | B | 降低起步复杂度,保留后续拆分、扩缩和恢复边界。 |
| 是否在 Step 6 选定具体数据库、内容存储、消息后端、搜索后端和缓存 | A. 直接选定;B. 只保留正式承载角色;C. 完全不画存储 | B | Step 6 应表达承载角色,具体产品和机制属于技术选型或详细设计。 |
| 外部正文 / 内容来源是否进入主图 | A. 不进入;B. 作为运行时对接边界进入;C. 作为本仓内部存储进入 | B | Artifact 需要接触内容来源线索,但不得拥有外部正文生命周期。 |
| 派生读侧、搜索、报告和同步交接是否作为核心 truth 承载 | A. 是;B. 否,归入派生消费承载;C. 后续再决定 | B | Step 5 已确认派生读侧不得成为业务写源。 |
| `L0-bus` / observability / archive 是否成为本仓内部容器 | A. 是;B. 否,只作为运行交接边界;C. 由实现决定 | B | Step 4 / Step 5 已确认外部 truth 不被 Artifact 接管。 |

---

## 8. 结构化中间产物

### 8.1 容器 / 部署架构图

```text
+--------------------------------+        +--------------------------------+
| 下游消费 / 管理入口边界         |        | 外部语境 / 定义 / 自动化输入边界 |
| sdk / console / sync / peers    |        | work / process / method / runtime |
+---------------+----------------+        +---------------+----------------+
                | 入口                                    | 消费
                v                                         v

       +================================================================+
       |                  L1-artifact 正式运行承载                      |
       |                                                                |
       |  +---------------------------+   +----------------------------+ |
       |  | Artifact 同步入口         |   | Artifact 异步输入消费      | |
       |  | sync entry                |   | async intake               | |
       |  +-------------+-------------+   +-------------+--------------+ |
       |                | 处理                         | 处理            |
       |                v                              v                 |
       |  +-------------+------------------------------+--------------+ |
       |  |                 Artifact 真相存储承载                     | |
       |  |        fact / version / lineage / baseline truth          | |
       |  +-------------+------------------------------+--------------+ |
       |                | 处理 / 承载                                    |
       |                v                                                |
       |  +-------------+-------------+   +----------------------------+ |
       |  | Artifact 后台维护与派生   |-->| Artifact 派生消费承载      | |
       |  | maintenance               |   | derived consumer material   | |
       |  +-------------+-------------+   +----------------------------+ |
       |                | 依赖 / 输出                                    |
       +================+================================================+
                        |
                        v
      +-----------------+------------------+   +-------------------------+
      | Artifact 事件协作 / 追溯交接边界   |   | 外部正文 / 内容来源边界 |
      | event / trace / archive / handoff  |   | external body source    |
      +------------------------------------+   +-------------------------+
```

该图表达 `L1-artifact` 的正式运行承载结构,不表达源码目录、接口协议、事件名、数据库表、技术产品或部署参数。

图示说明:

- `Artifact 同步入口` 和 `Artifact 异步输入消费` 是运行入口差异,不是两套 Artifact truth。
- `Artifact 真相存储承载` 是正式 Artifact fact、version、lineage、baseline 和 consumption backref 的必要承载。
- `Artifact 后台维护与派生` 只从 Artifact truth 派生搜索、预览、projection、报告、对账、归档准备、观测解释和同步交接材料,不能生成新的业务 truth。
- `外部正文 / 内容来源边界` 只提供内容引用、来源摘要或完整性线索,不把外部正文生命周期迁入本仓。
- 外部边界只作为运行时入口、消费或交接边界出现,不重画系统上下文。

### 8.2 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 下游消费 / 管理入口边界 | 运行时对接的正式外部边界 | 承接 SDK、console、sync、work、process、governance、conversation、workspace、archive、observability 和管理入口对 Artifact 的正式消费或管理进入点。 | 通过入口关系进入同步入口单元,或消费派生 / 交接材料。 | 它只作为外部运行边界出现,不属于本仓内部运行承载。 |
| 外部语境 / 定义 / 自动化输入边界 | 运行时对接的正式外部边界 | 承接 work、process、governance、method-library、runtime、capability 等外部 truth 的引用、摘要、定义来源、自动化来源或状态线索。 | 被同步入口或异步输入消费单元消费。 | 它只提供 safe ref / summary / snapshot / signal,不把外部 truth body 交给 Artifact 拥有。 |
| Artifact 同步入口 | 同步入口单元 | 承接同步 Artifact 变更、查询、受控触发、管理动作和正式消费读取。 | 处理后推进 Artifact 真相存储承载,并读取派生或真相状态形成响应。 | 不在本章定义 API、RPC、command、query、handler 或鉴权细节。 |
| Artifact 异步输入消费 | 异步消费单元 | 承接外部状态变化、自动化产出、定义变化、证据变化和事件协作输入,并收束为 Artifact 可审查或可追溯语境。 | 消费外部输入边界和事件协作边界,处理后推进 Artifact 真相存储承载。 | 不直接接管来源仓正文,不绕过 Artifact truth 核心。 |
| Artifact 后台维护与派生 | 后台处理单元 | 承接派生视图、搜索、预览、报告、对账、重建、完整性候选检查、归档准备、观测解释和同步交接材料形成。 | 从真相存储承载派生结果,写入派生承载或输出交接材料。 | 不生成新 Artifact truth,不得创建、覆盖、冻结或关闭核心事实。 |
| Artifact 真相存储承载 | 正式存储承载 | 承载 Artifact fact、version、lineage、baseline 和 consumption backref truth。 | 被同步入口、异步输入和后台维护共同依赖。 | 这是本仓正式制品真相承载,不写具体数据库、表结构或存储产品。 |
| Artifact 派生消费承载 | 正式存储承载 | 承载搜索、预览、projection、报告、对账、归档准备、观测解释、同步交接和消费依据说明等派生辅助结果。 | 由后台维护与派生单元生成和维护。 | 可重建、可延迟,不得成为第二 truth。 |
| Artifact 事件协作 / 追溯交接边界 | 运行时对接的正式外部边界 | 承接跨仓事件协作、变化感知交接、追溯材料交接、维护证据交接、archive handoff 和观测解释交接。 | 被异步输入消费单元消费,也接收后台维护与派生输出。 | 它表达运行对接边界,不代表本仓拥有 bus、observability 或 archive truth。 |
| 外部正文 / 内容来源边界 | 运行时对接的正式外部边界 | 为 Artifact 事实、版本、派生预览或完整性解释提供外部正文位置、内容引用、来源摘要或完整性线索。 | 被同步入口、异步输入或后台维护依赖。 | 它不是本仓 truth store;本仓不得拥有外部正文生命周期。 |

### 8.3 部署关系结论

| 关系 | 结论 |
|---|---|
| 同步入口、异步输入和后台维护 | P0 可同部署,但逻辑运行职责必须分离;后续可按吞吐、恢复、重建、对账、归档或完整性检查压力拆分 worker。 |
| 真相存储与派生承载 | 即使物理同库,架构语义也必须区分;派生承载可重建、可延迟,不能成为 truth source。 |
| 外部正文 / 内容来源边界 | 必须作为运行时对接边界表达,但不得作为本仓内部 truth storage。 |
| 事件协作 / 追溯交接边界 | 是外部运行边界,不意味着本仓拥有 `L0-bus`、`L4-observability` 或 `L4-archive` 的主体架构。 |
| 缓存、搜索后端、数据库产品、消息产品、对象存储、hash 算法 | 不进入本步定稿,后续由技术选型、配置设计、详细设计或测试方案闭口。 |

### 8.4 通信方式结论

| 运行关系 | 当前架构口径 |
|---|---|
| 下游消费 / 管理入口边界到同步入口 | 只确认存在正式入口关系,不在本步选择 HTTP、gRPC、SDK facade、console action 或其他协议。 |
| 外部语境 / 定义 / 自动化输入边界到同步 / 异步入口 | 只确认存在 safe ref / summary / snapshot / signal 的消费关系,不写外部正文同步方式。 |
| 外部正文 / 内容来源边界到本仓运行单元 | 只确认存在内容引用、来源摘要或完整性线索的运行依赖,不写 adapter、storage backend、hash 算法或内容读取协议。 |
| 事件协作 / 追溯交接边界到异步输入 | 只确认存在正式消费关系,不在本步选择 topic、event schema、consumer group、relay、outbox 或 callback 机制。 |
| 同步入口 / 异步输入到真相存储承载 | 只确认运行处理会推进 Artifact truth,不写事务、表结构、repository 或一致性策略。 |
| 真相存储承载到后台维护与派生 | 只确认派生维护必须从 truth source 出发,不写调度、批处理、增量策略、索引实现或缓存策略。 |
| 后台维护与派生到派生承载 / 外部交接边界 | 只确认派生结果、维护证据和交接材料可以输出,不得反写 Artifact truth。 |

### 8.5 运行边界红线

| 红线 | 结论 |
|---|---|
| 不把源码结构当容器 | `domain`、`application`、`repository`、`handler`、`adapter`、`module` 不进入 Step 6 图。 |
| 不把外部正文当本仓 truth | 外部正文 / 内容来源边界只提供引用、摘要或线索,不接管正文生命周期。 |
| 不把派生读侧当写源 | 搜索、预览、projection、报告、对账、观测解释和同步交接只能从 truth 派生。 |
| 不把事件协作当 truth store | 事件、通知、outbox、bus 或 trace 只表达协作和交接,不承载 Artifact truth。 |
| 不提前选技术 | 数据库、对象存储、消息系统、缓存、搜索、hash、content-addressing 和运行环境后置。 |

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
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。下列事项进入后续 Step,不得在 Step 6 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-ART-ARCH-006-001 | Artifact 同步入口、异步输入和后台维护如何映射到实际进程 / worker / package | 后续概要 / 详细设计和实施计划收敛。 |
| Q-ART-ARCH-006-002 | Artifact truth store、derived carrier、cache、search、content source 和 message backbone 的具体产品选型 | 后续 Step 10、配置设计和详细设计收敛。 |
| Q-ART-ARCH-006-003 | 外部正文引用、content-addressing、hash、完整性候选检查和 tamper 线索如何落入正式 schema / port | 后续 Step 8、Step 9、详细设计和测试方案收敛。 |
| Q-ART-ARCH-006-004 | 事件协作、追溯交接、archive handoff、observability 交接和 sync 消费协议 | 后续 Step 9、概要 / 详细设计和验收标准收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓正式运行承载单元及主次关系 | pass | §8.1 / §8.2 已明确同步入口、异步输入、后台维护、truth carrier、derived carrier 和外部边界。 |
| 是否回答同步入口、异步消费者或后台任务在哪里 | pass | §4.2 / §4.3 已给出入口和后台职责。 |
| 是否回答数据库 / 缓存 / 总线如何接入 | pass | §4.4 已以 truth carrier、derived carrier、内容来源边界和事件交接边界表达,未选具体技术。 |
| 是否明确哪些可同部署、哪些必须语义分离 | pass | §4.5 / §8.3 已说明 P0 可同部署但逻辑职责分离。 |
| 是否明确正式通信主路径 | pass | §4.6 / §8.4 已收敛运行关系,未写协议或事件 schema。 |
| 是否避免把源码结构、接口协议、数据库表、事件 payload 或技术产品写成容器视图 | pass | 旧文档污染已在 §5 诊断,新图未出现实现层对象。 |
| 是否允许进入 Step 7 | pass | 当前容器 / 部署架构足以支撑依赖方向与层间约束讨论。 |

当前 Step 6 `容器 / 部署架构` 已完成。下一步必须等待用户确认后进入 Step 7 `依赖方向与层间约束`,并只创建 / 改写 `design-calibration/01_arch_step_07_dependency_direction.md`。
