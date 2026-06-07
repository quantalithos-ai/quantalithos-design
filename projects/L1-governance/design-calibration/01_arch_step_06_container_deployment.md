# Step 6. 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 回填章节: `01-架构设计.md` §7 容器 / 部署架构
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-governance` 在运行时由哪些正式承载单元组成,这些单元如何承接同步入口、异步输入、后台维护、正式真相存储、派生承载和外部运行时交接边界。

本步只表达运行承载角色与部署关系,不写源码目录、代码模块、handler / repository / service 分层、API 路径、事件名、DTO、数据库表、索引、缓存策略、协议选择、部署脚本、基础设施产品或技术选型理由。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 已完成 | 提供正式外部上下文对象、输入面、输出面和降级口径 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地影子层 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面和依赖边界 |
| `00_req_step_13_non_functional_requirements.md` | 已完成 | 提供治理决策可用性、派生延迟、审计追溯、报告和恢复口径 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 提供外部 truth、自动化边界、report / archive 和对账相关风险 |
| 旧 `01-架构设计.md` §6 | 旧 Draft | 作为旧容器图、技术栈、存储和通信方式问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓运行时有哪些正式容器或运行单元?

`L1-governance` 的正式运行承载单元包括:

- `Governance 同步入口单元`
- `Governance 异步输入消费单元`
- `Governance 后台维护与派生单元`
- `Governance 真相存储承载`
- `Governance 派生视图 / 报告 / 对账承载`
- `下游消费 / 管理入口边界`
- `外部语境 / 定义 / 证据输入边界`
- `治理事件协作 / 追溯交接边界`

这些是运行承载角色,不是源码模块、进程名、crate 名、服务名、接口名或技术产品名。后续概要 / 详细设计可以再把它们映射到实际应用进程、worker、adapter、repository 或具体部署形态。

### 3.2 同步入口在哪里?

同步入口位于 `Governance 同步入口单元`。它承接来自 SDK、workspace、console、process、work、artifact、conversation、runtime、capability、observability、archive 和审计 / 管理入口的同步读写、查询、受控触发和治理管理进入点。

本步只确认存在正式同步入口关系,不定义 API、路由、RPC、SDK 方法、command、query、鉴权函数或错误 schema。

### 3.3 异步消费者或后台任务在哪里?

异步输入由 `Governance 异步输入消费单元` 承接,用于消费外部语境、定义、证据、运行反馈、能力反馈、相邻仓状态变化和事件协作边界提供的正式输入或可引用摘要。它只能将这些输入收束为 Governance 可裁决语境、引用、快照或状态推进依据,不能接管外部 truth 正文。

后台维护、派生视图、报告、dashboard、对账、重建、归档准备、追溯交接材料和公开消费材料由 `Governance 后台维护与派生单元` 承接。它只能从 Governance truth 派生消费辅助结果或交接材料,不能创建、批准、关闭或改写治理事实。

### 3.4 数据库 / 缓存 / 总线如何接入?

本步不选择具体数据库、缓存、消息后端、搜索后端、对象存储、report 系统、policy engine、GRC 产品或协议。架构层只确认:

- `Governance 真相存储承载` 是本仓正式治理状态的必要承载。
- `Governance 派生视图 / 报告 / 对账承载` 承载从 Governance truth 派生的查询、报告、dashboard、对账、维护和交接准备材料。
- `治理事件协作 / 追溯交接边界` 是本仓与事件协作、observability、archive 和相邻仓消费形成运行交接的正式外部边界。
- 缓存不是本步确认的核心运行承载;若后续引入,只能作为派生辅助或性能优化,不得成为 truth source。

### 3.5 哪些运行单元必须分开部署,哪些可以同部署?

架构上必须区分同步入口、异步输入消费、后台维护派生、真相存储、派生承载和外部交接边界。P0 可以把 `Governance 同步入口单元`、`Governance 异步输入消费单元` 和 `Governance 后台维护与派生单元` 同部署在一个服务进程或同一运行环境中,但它们的职责边界必须清楚。

随着吞吐、隔离、恢复、重建、报告、对账、归档或审计压力增加,异步输入消费和后台维护派生可以拆分为独立 worker。`Governance 真相存储承载` 与 `Governance 派生视图 / 报告 / 对账承载` 即使物理同库,架构语义也必须分开。

### 3.6 哪些通信关系是正式主路径?

正式主路径包括:

- 下游消费 / 管理入口边界进入 Governance 同步入口单元。
- 外部语境 / 定义 / 证据输入边界进入 Governance 同步入口或异步输入消费单元。
- 治理事件协作 / 追溯交接边界进入 Governance 异步输入消费单元。
- 同步入口和异步输入共同推进 Governance 真相存储承载。
- 后台维护与派生单元从 Governance truth 派生消费辅助结果、报告、对账和交接材料。
- 后台维护与派生单元通过治理事件协作 / 追溯交接边界输出变化感知、追溯材料、维护证据或归档准备材料。

本步只表达运行关系,不表达具体协议、事件主题、接口名称、事务边界、订阅机制、调度机制或时序细节。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 容器图写 `api / rpc -> application -> PostgreSQL / bus / artifact sync` | 把接口协议、代码分层、技术产品和外部适配混在容器图中 | 改为正式运行承载单元和外部运行边界 |
| `application` 下直接列 Gate / Approval / Policy / Compliance / Nonconformity | 把语义对象和用例清单写进容器图 | 对象线索后移概要 / 详细设计,Step 6 只写运行角色 |
| `governance-domain` 被写成容器 | 这是代码或逻辑层,不是运行承载单元 | 不在 Step 6 画 domain / application / infra 分层 |
| `policy-distributor` 和 `subscriptions` 被提前命名为进程 | 过早锁定部署进程和实现命名 | 改为异步输入消费、后台维护与派生、事件协作交接边界 |
| `postgres`、`bus(outbox)`、`artifact sync`、`runtime / capability-hub distribution` | 提前进入技术选型、协议和外部产品 | 改为真相存储承载、派生承载和运行时交接边界 |
| 技术栈表写 Rust / PostgreSQL | Step 6 不应锁定技术产品和实现栈 | 技术栈后移到技术选型或详细设计 |
| 旧文档缺少派生视图 / 报告 / 对账承载边界 | 容易让 report、dashboard、reconciliation 或 archive 准备材料反写真相 | 增加派生承载和后台维护边界,明确可重建、可延迟、不得成为 truth |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图的主语 | API / application / domain / PostgreSQL / bus | `L1-governance` 正式运行承载 | 容器图应表达运行承接角色,不是代码分层或基础设施清单 |
| 同步入口 | `governance-api` + gRPC / HTTP | `Governance 同步入口单元` | 不提前锁定协议和 API 形态 |
| 异步输入 | subscriptions 直接绑定 process / work / artifact / identity | `Governance 异步输入消费单元` | 保留运行角色,外部仓在系统上下文表达 |
| 后台处理 | policy distribution / outbox / report 线索分散 | `Governance 后台维护与派生单元` | 报告、对账、重建、交接和公开材料统一按后台承载表达 |
| 存储承载 | PostgreSQL | 真相存储承载 + 派生视图 / 报告 / 对账承载 | 分清 truth 与派生消费结果,技术产品后移 |
| 外部协作 | bus、artifact sync、runtime distribution 直接入图 | 外部语境输入边界 + 事件协作 / 追溯交接边界 | 运行时对接边界存在,但不重画系统上下文或拥有外部系统 |
| 部署口径 | 单服务 + PostgreSQL 起步 | P0 可同部署但逻辑边界必须分开 | 兼顾起步实现与后续 worker / storage 拆分 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 API / application / domain / infra 代码层画容器 | 开发者熟悉 | 这是实现分层,不是运行承载图 | 不采用 |
| 方案 B: 按同步入口、异步消费、后台维护、真相存储、派生承载和外部交接边界画图 | 符合运行承载粒度,能保护 truth 与派生边界 | 后续需要在概要 / 详细设计再映射到代码结构 | 采用 |
| 方案 C: 强制同步入口、异步消费、后台维护全部独立部署 | 隔离清晰 | P0 复杂度过高,也不是架构必须条件 | 不采用 |
| 方案 D: 直接沿用 PostgreSQL + outbox + policy distributor 图 | 接近旧实现想象 | 提前定死技术产品、进程和实现对象,不符合 Step 6 粒度 | 不采用 |
| 方案 E: 把 report / dashboard / reconciliation 画成核心运行入口 | 能突出消费能力 | 会让派生面被误读为治理写源 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 容器 / 部署架构图

```text
+-----------------------------+        +-----------------------------+
| 下游消费 / 管理入口边界      |        | 外部语境 / 定义 / 证据输入边界 |
| sdk / workspace / console   |        | identity / method / peers    |
+--------------+--------------+        +--------------+--------------+
               | 入口                                  | 消费
               v                                       v

      +================================================================+
      |                 L1-governance 正式运行承载                     |
      |                                                                |
      |  +--------------------------+   +-----------------------------+ |
      |  | Governance 同步入口      |   | Governance 异步输入消费      | |
      |  | sync entry               |   | async intake                 | |
      |  +-------------+------------+   +--------------+--------------+ |
      |                | 处理                          | 处理            |
      |                v                               v                 |
      |  +-------------+-------------------------------+--------------+ |
      |  |                Governance 真相存储承载                     | |
      |  |                truth state carrier                         | |
      |  +-------------+-------------------------------+--------------+ |
      |                | 处理 / 承载                                     |
      |                v                                                 |
      |  +-------------+------------+   +-----------------------------+ |
      |  | Governance 后台维护与派生 |-->| 派生视图 / 报告 / 对账承载   | |
      |  | maintenance              |   | derived carrier             | |
      |  +-------------+------------+   +-----------------------------+ |
      |                | 依赖 / 输出                                     |
      +================+================================================+
                       |
                       v
              +--------+----------------------+
              | 治理事件协作 / 追溯交接边界   |
              | event / trace / archive       |
              +-------------------------------+
```

该图表达 `L1-governance` 的正式运行承载结构,不表达源码目录、接口协议、事件名、数据库表、技术产品或部署参数。

图示说明:

- `Governance 同步入口` 和 `Governance 异步输入消费` 是运行入口差异,不是两套 Governance truth。
- `Governance 真相存储承载` 是唯一正式治理真相承载,派生视图 / 报告 / 对账承载不得反写真相。
- `Governance 后台维护与派生` 只从 Governance truth 派生消费结果、报告、对账状态、维护证据或交接材料,不能生成新的治理事实。
- 外部边界只作为运行时入口、消费或交接边界出现,不重画系统上下文。

### 7.2 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 下游消费 / 管理入口边界 | 运行时对接的正式外部边界 | 承接 SDK、workspace、console、process、work、artifact、conversation、runtime、capability、observability、archive 和审计 / 管理入口对 Governance 的正式消费或管理进入点。 | 通过入口关系进入同步入口单元,或消费派生 / 交接材料。 | 它只作为外部运行边界出现,不属于本仓内部运行承载。 |
| 外部语境 / 定义 / 证据输入边界 | 运行时对接的正式外部边界 | 承接 identity、method、artifact、process、work、conversation、runtime、capability、observability 等外部 truth 的引用、摘要、定义来源、证据来源或状态线索。 | 被同步入口或异步输入消费单元消费。 | 它只提供 safe ref / summary / snapshot / signal,不把外部 truth body 交给 Governance 拥有。 |
| Governance 同步入口 | 同步入口单元 | 承接同步治理变更、查询、受控触发、管理动作和正式消费读取。 | 处理后推进 Governance 真相存储承载,并读取派生或真相状态形成响应。 | 不在本章定义 API、RPC、command、query、handler 或鉴权细节。 |
| Governance 异步输入消费 | 异步消费单元 | 承接外部状态变化、运行反馈、能力反馈、定义变化、证据变化和事件协作输入,并收束为 Governance 可裁决语境或可追溯状态。 | 消费外部输入边界和事件协作边界,处理后推进 Governance 真相存储承载。 | 不直接接管来源仓正文,不绕过 Governance truth 核心。 |
| Governance 后台维护与派生 | 后台处理单元 | 承接派生视图、报告、dashboard、对账、重建、维护报告、归档准备、追溯交接材料和公开消费材料形成。 | 从真相存储承载派生结果,写入派生承载或输出交接材料。 | 不生成新治理事实,不得批准、关闭或覆盖 truth。 |
| Governance 真相存储承载 | 正式存储承载 | 承载治理语境、Gate / Decision / Approval、Policy 生效事实、shared rules、Control、AIIA / SoA 治理结论、Nonconformity、纠正闭环和治理追溯 truth。 | 被同步入口、异步输入和后台维护共同依赖。 | 这是本仓唯一正式治理真相承载,不写具体数据库、表结构或存储产品。 |
| 派生视图 / 报告 / 对账承载 | 正式存储承载 | 承载查询视图、报告、dashboard、对账结果、维护状态、公开消费摘要和归档准备材料等派生辅助结果。 | 由后台维护与派生单元生成和维护。 | 可重建、可延迟,不得成为第二 truth。 |
| 治理事件协作 / 追溯交接边界 | 运行时对接的正式外部边界 | 承接跨仓事件协作、变化感知交接、治理追溯材料交接、维护证据交接和 archive handoff。 | 被异步输入消费单元消费,也接收后台维护与派生输出。 | 它表达运行对接边界,不代表本仓拥有 bus、observability 或 archive truth。 |

### 7.3 部署关系结论

- P0 可以把 `Governance 同步入口`、`Governance 异步输入消费` 和 `Governance 后台维护与派生` 同部署,但逻辑运行职责必须分清。
- `Governance 真相存储承载` 与 `派生视图 / 报告 / 对账承载` 即使物理同库,架构语义也必须区分。
- 当吞吐、隔离、恢复、重建、报告、对账、归档或审计压力上升时,异步输入消费和后台维护派生可以拆分为独立 worker。
- `治理事件协作 / 追溯交接边界` 是外部运行边界,不意味着本仓拥有 `L0-bus`、`L4-observability` 或 `L4-archive` 的主体架构。
- 缓存、具体搜索后端、具体数据库产品、具体消息产品、具体报告系统、具体 GRC 产品和 policy engine 实现细节不进入本步主图。

### 7.4 通信方式结论

| 运行关系 | 当前架构口径 |
|---|---|
| 下游消费 / 管理入口边界到同步入口 | 只确认存在正式入口关系,不在本步选择 HTTP、gRPC、SDK facade、console action 或其他协议。 |
| 外部语境 / 定义 / 证据输入边界到同步 / 异步入口 | 只确认存在 safe ref / summary / snapshot / signal 的消费关系,不写外部正文同步方式。 |
| 治理事件协作 / 追溯交接边界到异步输入 | 只确认存在正式消费关系,不在本步选择 topic、event schema、consumer group、relay 或 callback 机制。 |
| 同步入口 / 异步输入到真相存储承载 | 只确认运行处理会推进 Governance truth,不写事务、表结构、repository 或一致性策略。 |
| 真相存储承载到后台维护与派生 | 只确认派生维护必须从 truth source 出发,不写调度、批处理、增量策略、索引实现或缓存策略。 |
| 后台维护与派生到派生承载 / 外部交接边界 | 只确认派生结果、维护证据和交接材料可以输出,不得反写 Governance truth。 |

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §7 “容器 / 部署架构”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| P0 是否强制同步入口、异步输入和后台维护派生独立部署 | A. 全部独立部署;B. P0 可同部署但逻辑分离;C. 全部合并为不可拆单元 | B | 既能降低起步复杂度,又保留后续拆分、扩缩和恢复边界 | 已确认采用 B |
| 是否在 Step 6 选定具体数据库、消息后端、report store、搜索后端和缓存 | A. 直接选定;B. 只保留正式承载角色;C. 完全不画存储 | B | Step 6 应表达承载角色,具体产品和机制属于技术选型或详细设计 | 已确认采用 B |
| report / dashboard / reconciliation 是否作为核心运行写入口 | A. 作为核心写入口;B. 归入后台维护与派生和派生承载;C. 归入同步入口 | B | 当前阶段只需确认派生维护与反写边界,具体 projection / report 形态后移 | 已确认采用 B |
| Governance 是否拥有 bus / observability / archive truth | A. 拥有;B. 不拥有,只作为运行交接边界;C. 待详细设计决定 | B | Step 4 / Step 5 已确认外部 truth 不被 Governance 接管 | 已确认采用 B |
| Policy engine / DSL 是否作为当前正式运行容器 | A. 是;B. 否,只保留 Governance truth 和未来技术空间 | B | 当前核心是 Policy effective fact 和 control applicability,engine / DSL 是未来实现或增强机制 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本 Step 没有需要阻塞下一步的未确认事项。

---

## 10. 进入下一步条件

```text
已明确 L1-governance 的正式运行承载单元、同步入口、异步输入、后台维护、真相承载、派生承载和外部运行时交接边界。
已明确 P0 可同部署但逻辑运行职责必须分离。
已明确 truth carrier 与 derived/report/reconciliation carrier 即使物理同库也必须语义分离。
已明确 bus / observability / archive / external GRC / policy engine / cache 等不在本步成为 Governance 拥有的核心运行 truth。
可以进入 Step 7 依赖方向与层间约束。
```
