# Step 6. 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 回填章节: `01-架构设计.md` §7 容器 / 部署架构
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 6 | pass。用户已确认 Step 5 `限界上下文与子域划分`,可进入 Step 6。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md` 和 `01_arch_step_05_bounded_context_subdomains.md`。 |
| 是否已读取架构 SOP Step 6 与书写规范 §4.7 | pass。已读取运行承载单元、同步入口、后台处理、异步消费、正式存储承载、正式基础设施依赖和运行时对接边界要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的依赖、核心能力、功能、规则、数据归属、接口、NFR、验收和风险章节。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_06_container_deployment.md` 和 `projects/L1-governance/design-calibration/01_arch_step_06_container_deployment.md` 的图 + 运行单元表 + 部署 / 通信结论组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_06_container_deployment.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

说明 `L4-sandbox` 在运行时由哪些正式承载单元组成,这些单元如何承接受控执行入口、异步控制 / 交接信号、真实隔离执行承接、后台维护清理、truth / material 状态承载、isolation backend 对接和材料 / 观测 / 事件交接边界。

本步只表达运行承载角色与部署关系,不写源码目录、代码模块、handler / repository / service 分层、API 路径、事件名、DTO、数据库表、索引、缓存策略、协议选择、部署脚本、基础设施产品或技术选型理由。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 承接正式外部上下文对象、输入 / 输出面、isolation backend、`L0-bus`、material / observability consumer 和依赖失效降级口径。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成并经用户确认 | 承接核心子域、支撑子域、本地影子层和统一语言,避免把运行承载图画成子域结构图。 |
| `projects/L4-sandbox/00-需求文档.md` §6 / §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15 | 当前正式需求基线 | 承接核心闭环、功能需求、规则、数据归属、接口依赖、非功能要求、验收否决和风险。 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面、运行期依赖、事件协作和材料交接边界。 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提供 execution isolation truth、capture / handoff、failure / cleanup / redline 和禁止正文边界,用于判断正式存储承载。 |
| `00_req_step_13_non_functional_requirements.md` | 已完成 | 提供安全零容忍、可用性、审计 / 可追溯、幂等 / 一致性和可观测性约束。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §6 | historical material | 诊断旧 sandbox-api、execution orchestrator、limits / policy gate、backend adapter、audit emitter、Docker/gVisor/local_process 和 capability-hub / observability 是否污染 Step 6。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧后端清单、RPC / SDK、目录结构、安全基线和性能目标是否被误写成运行承载。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 4、Step 5、正式 00、SOP Step 6 和书写规范 §4.7 | done | 本文件 §1、§3 |
| 回答正式运行单元、同步入口、异步 / 后台、存储 / 基础设施依赖、运行时外部边界和主路径问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中实现模块图、技术产品、协议和部署手册污染点 | done | 本文件 §6 |
| 收敛容器 / 部署架构图、运行单元说明表、部署关系、通信关系和运行边界红线 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 6 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 这个仓运行时有哪些正式容器或运行单元?

`L4-sandbox` 的正式运行承载单元按运行职责划分,不是按源码模块、进程名、adapter、API、后端产品或事件名划分:

| 运行承载对象 | 判断 |
|---|---|
| `执行消费 / 语境策略输入边界` | 运行时对接的正式外部边界,收缩 tools、runtime、member-service、runner、identity / work refs 和 policy 来源。 |
| `控制 / 事件协作输入边界` | 运行时对接的正式外部边界,收缩 `L0-bus`、control signal、handoff state 和调查 / 安全交接输入。 |
| `Sandbox 同步入口单元` | 本仓承接同步受控执行请求、查询、控制意图和归责读取的运行入口。 |
| `Sandbox 异步控制与交接消费单元` | 本仓消费异步控制、事件协作、handoff 状态、调查状态和维护触发的运行单元。 |
| `Sandbox 受控执行承接单元` | 本仓承载隔离执行建立、边界落实、policy 执行、capture 和执行收束的主运行单元。 |
| `Sandbox 后台维护与清理单元` | 本仓承载 lease 巡检、orphan 发现、cleanup guard、reaper、redline containment 和维护收束的后台运行单元。 |
| `Sandbox truth / material 状态承载` | 本仓正式存储承载,承载 execution isolation truth、capture / handoff、failure / control、cleanup / redline 相关状态和材料引用。 |
| `isolation backend 承载边界` | 正式基础设施依赖,承载真实进程、文件系统、网络、资源和生命周期控制,但不拥有 sandbox truth。 |
| `材料 / 观测 / 事件交接边界` | 运行时对接的正式外部边界,收缩 artifact、observability、runtime、runner、`L0-bus` 等消费 / 协作边界。 |

这些对象后续可以被实现为一个或多个进程、worker、scheduler、adapter、storage 或部署单元,但 Step 6 不锁定具体实现形态。

### 5.2 同步入口在哪里?

同步入口位于 `Sandbox 同步入口单元`。它承接执行消费方发起的正式受控执行请求、执行环境身份 / 责任链语境进入、归责查询、状态读取和控制意图进入,并把需要真实执行或正式控制的请求交给 `Sandbox 受控执行承接单元` 或 `Sandbox 异步控制与交接消费单元`。

本步只确认正式同步入口关系,不定义 API、RPC、SDK 方法、route、command、query、DTO、鉴权函数、错误 schema 或具体协议。

### 5.3 异步消费者或后台任务在哪里?

异步消费位于 `Sandbox 异步控制与交接消费单元`。它消费 `L0-bus` 或下游协作边界带来的执行状态协作、control signal、handoff ack / pending / failed 线索、调查状态、安全交接状态和维护触发,并把这些输入收束到 sandbox truth / material 状态承载或转交给执行承接 / 后台维护单元。

后台任务位于 `Sandbox 后台维护与清理单元`。它承接 lease expiry、orphan environment 检测、cleanup guard、reaper、redline containment、保守回收、材料保留和调查交接相关运行职责。它不推进 runtime recover,不改变 artifact retention truth,不拥有 operator UI 或正式调查生命周期。

### 5.4 数据库 / 缓存 / 总线如何接入?

本步不选择具体数据库、对象存储、文件存储、缓存、消息后端、审计存储、trace 后端、日志平台、secrets 系统或外部 GRC 产品。架构层只确认:

- `Sandbox truth / material 状态承载` 是本仓正式 execution isolation truth、capture / handoff、failure / cleanup / redline 状态与材料引用的必要承载。
- `isolation backend 承载边界` 是本仓建立真实隔离执行环境所需的正式基础设施依赖,但不把 Docker/gVisor/Firecracker/k8s/local_process 等产品写成当前定稿。
- `控制 / 事件协作输入边界` 和 `材料 / 观测 / 事件交接边界` 表达与 `L0-bus`、observability、artifact、runtime、runner 等运行协作关系,不把事件流或观测存储当成 sandbox truth。
- 缓存若后续引入,只能作为派生读取、能力摘要或性能优化,不得成为执行 truth、policy truth、capture truth 或 cleanup truth 的来源。

### 5.5 哪些运行单元必须分开部署,哪些可以同部署?

架构上必须区分同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 承载边界和材料 / 观测 / 事件交接边界。P0 可以将 `Sandbox 同步入口单元`、`Sandbox 受控执行承接单元`、`Sandbox 异步控制与交接消费单元` 和 `Sandbox 后台维护与清理单元` 同部署在一个服务进程或同一运行环境中,但运行职责、失败归责和可拆分边界必须保持清楚。

随着执行时长、并发、容量、清理可靠性、安全调查或材料交接压力增加,受控执行承接、异步控制消费和后台维护清理应能拆分为独立运行单元。`Sandbox truth / material 状态承载` 即使与其他物理存储共享基础设施,架构语义也必须单独表达。`isolation backend 承载边界` 是本仓依赖的外部承载,不能被写成本仓业务 truth 存储。

### 5.6 哪些通信关系是正式主路径?

正式主路径包括:

- `执行消费 / 语境策略输入边界` 通过入口关系进入 `Sandbox 同步入口单元`。
- `Sandbox 同步入口单元` 处理后进入 `Sandbox 受控执行承接单元`。
- `Sandbox 受控执行承接单元` 依赖 `Sandbox truth / material 状态承载` 和 `isolation backend 承载边界`,并向材料 / 观测 / 事件交接边界输出执行材料。
- `控制 / 事件协作输入边界` 被 `Sandbox 异步控制与交接消费单元` 消费,再影响执行承接、handoff 状态或后台维护。
- `Sandbox 后台维护与清理单元` 依赖 truth / material 状态承载和必要的安全交接状态,以保守方式推进 cleanup、reaper 和 redline 收束。
- `材料 / 观测 / 事件交接边界` 消费 sandbox 输出材料、观测材料、失败 / control / cleanup / redline 交接材料。

本步只表达运行关系,不表达具体协议、事件主题、接口名称、payload、事务边界、订阅机制、调度机制、后端 API、文件路径或时序细节。

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 / 关键依赖 | 写至少 Docker + gVisor,并列 containerd、Firecracker、runc。 | 把具体后端产品误写成运行承载定稿。 | 本步只保留抽象 `isolation backend 承载边界`,具体产品后移 Step 10 / 04 / 07。 |
| 核心职责 | 写默认无出网、Policy allowlist、审计事件。 | 主题相关,但 allowlist、事件名和审计 sink 不是运行承载对象。 | 分别放入 policy 输入、受控执行承接、材料 / 观测交接和后续交互 / 技术选型。 |
| 目录结构 | 写 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 这是源码 / 模块组织,不是容器 / 部署架构。 | 不继承。 |
| 性能目标 / 安全基线 | 写启动 / 销毁时延、seccomp、AppArmor、cap drop。 | 属于测试、验收、技术选型或配置候选。 | 不进入 Step 6 图和运行单元表。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| `sandbox-api -> execution orchestrator -> limits / policy gate -> backend adapter -> audit emitter` | 把接口、实现组件、policy 机制、adapter 和审计输出写成容器图。 | 改为同步入口、受控执行承接、异步消费、后台维护、状态承载和外部交接边界。 |
| `Docker / gVisor / local_process backend` | 提前锁定技术产品,且 `local_process(test only)` 若误升级会违反宿主直跑红线。 | 不进入正式运行承载定稿;只保留抽象 isolation backend 边界和 fail-closed 口径。 |
| `capability-hub allowlist` | 固定 policy 来源并把 allowlist 写成运行容器依赖。 | 改为 policy 来源输入边界,具体来源矩阵后续 Step 9 / 03 收敛。 |
| `observability audit sink` | 把观测接收端画成运行依赖,容易把观测存储当 truth。 | 改为材料 / 观测 / 事件交接边界,不拥有 observability store。 |
| `RPC / SDK` 通信选择 | 协议选择早于 Step 9 和详细设计。 | 本步只写入口 / 处理 / 消费 / 承载 / 依赖关系。 |
| `sandbox execution metadata`、`allowlist snapshot`、`backend capability flags` | 数据归属和实现数据混入容器章节。 | 本步只表达 `Sandbox truth / material 状态承载`;数据所有权后续 Step 8 收敛。 |
| `api -> application -> domain -> infra` | 代码分层和依赖倒置图属于后续依赖方向 / 概要 / 详细设计。 | 不进入 Step 6。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图的主语 | `sandbox-api`、execution orchestrator、limits / policy gate、backend adapter、audit emitter。 | `L4-sandbox` 正式运行承载:同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 和外部交接边界。 | 容器 / 部署架构应表达运行承载角色,不是实现模块、adapter 或审计 sink。 |
| 同步入口 | 旧文档写成 `sandbox-api` 和 RPC / SDK 入口。 | `Sandbox 同步入口单元` 承接正式受控执行请求、查询、控制意图和归责读取。 | 不提前锁定协议、API 形态、SDK 方法或 route。 |
| 主执行承载 | 旧文档写成 execution orchestrator + backend adapter。 | `Sandbox 受控执行承接单元` 承接隔离环境建立、边界落实、policy 执行、capture 和执行收束。 | 保留运行职责,不把 orchestration 代码模块或后端 adapter 写成架构事实。 |
| 异步 / 控制输入 | 旧文档缺少正式异步控制消费边界,或把事件直接归入 audit。 | `Sandbox 异步控制与交接消费单元` 消费 control signal、handoff 状态、安全交接和维护触发。 | control / handoff / investigation 不是普通审计事件,需要独立运行承载。 |
| 后台清理 | 旧文档把 cleanup、lease、reaper 分散在后端或运维逻辑中。 | `Sandbox 后台维护与清理单元` 承接 lease 巡检、orphan 检测、cleanup guard、reaper 和 redline containment。 | 清理和安全收束是 sandbox 核心非 happy path,不能落入调用方私有兜底。 |
| 状态承载 | 旧文档写 sandbox metadata、allowlist snapshot、backend flags 等实现数据。 | `Sandbox truth / material 状态承载` 承载 execution isolation truth、capture / handoff、failure / cleanup / redline 状态和材料引用。 | Step 6 只确认正式状态承载角色,数据所有权和字段后续 Step 8 / 03 收敛。 |
| 后端依赖 | Docker / gVisor / local_process 被写成运行后端清单。 | `isolation backend 承载边界` 作为正式基础设施依赖,不锁定产品组合。 | 防止 `local_process(test only)` 升格为正式执行路径,防止技术选型提前硬化。 |
| 观测 / 事件 | 旧文档把 observability audit sink 当运行依赖。 | `材料 / 观测 / 事件交接边界` 只作为材料、观测和协作交接边界。 | 观测存储和事件流不能成为 sandbox truth store。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用 `sandbox-api -> orchestrator -> backend adapter -> audit emitter` | 接近旧文档,实现想象直观。 | 混合接口、代码模块、后端产品、policy 机制和观测 sink,无法表达 cleanup / lease / redline truth。 | 不采用。 |
| 方案 B: 按同步入口、异步控制消费、受控执行承接、后台维护清理、状态承载、后端边界和材料交接边界画图 | 对齐 Step 4 / Step 5 和新版需求,能覆盖执行身份、边界、policy、capture、failure、cleanup 和 redline。 | 后续概要 / 详细设计还需映射到代码结构和具体部署。 | 采用。 |
| 方案 C: 强制同步入口、执行承接、异步消费和 reaper 全部分离部署 | 隔离清楚,方便独立扩缩。 | P0 复杂度偏高,且 Step 6 不应变成部署手册。 | 不采用为硬约束;保留可拆分边界。 |
| 方案 D: 直接选定 Docker + gVisor + Firecracker / k8s / local_process 等后端组合 | 看起来可落地。 | 提前进入技术选型,且 local_process 若误升格会违反宿主直跑红线。 | 不采用;后端产品后移 Step 10 / 04 / 07。 |
| 方案 E: 把 audit / trace / metric / event bus 作为内部 truth 承载 | 方便观测和排障。 | 会把 observability store 或事件流误写成 sandbox truth。 | 不采用;只保留材料 / 观测 / 事件交接边界。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| P0 是否强制同步入口、执行承接、异步控制消费和后台清理独立部署 | A. 全部独立部署;B. P0 可同部署但运行职责分离;C. 全部合并为不可拆单元 | B | 降低起步复杂度,同时保留执行、控制和清理的失败归责及未来拆分边界。 | 本步采用 B。 |
| 是否在 Step 6 选定具体 isolation backend | A. 直接选定 Docker/gVisor/Firecracker/k8s/local_process;B. 只保留抽象 `isolation backend 承载边界`;C. 暂不表达后端 | B | sandbox 运行必须依赖真实隔离承载,但产品组合属于后续技术选型 / 配置 / 实施。 | 本步采用 B。 |
| 是否把 `capability-hub allowlist` 写成固定 policy 来源 | A. 固定 capability-hub;B. 写成 policy 来源输入边界;C. 由实现决定 | B | sandbox 只执行给定 launch / isolation policy,不拥有 policy definition 或 approval truth。 | 本步采用 B。 |
| 是否把 observability / bus 当作本仓运行存储 | A. 是;B. 否,只作为交接边界;C. 后续再决定 | B | 观测和事件协作可以消费材料,不能承载 sandbox execution isolation truth。 | 本步采用 B。 |
| cleanup / reaper 是否属于调用方或 SRE 私有任务 | A. 属于调用方 / SRE;B. 属于 sandbox 后台维护与清理单元;C. 只在测试阶段实现 | B | lease、orphan、cleanup guard、reaper 和 redline containment 是 sandbox failure / safety 主线的一部分。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 容器 / 部署架构图

```text
+--------------------------------+      +--------------------------------+
| 执行消费 / 语境策略输入边界      |      | 控制 / 事件协作输入边界         |
| tools / runtime / member / run  |      | bus / handoff / investigation  |
+---------------+----------------+      +---------------+----------------+
                | 入口                                  | 消费
                v                                       v

      +================================================================+
      |                  L4-sandbox 正式运行承载                       |
      |                                                                |
      |  +----------------------------+  +----------------------------+ |
      |  | Sandbox 同步入口单元       |  | Sandbox 异步控制与交接消费  | |
      |  | sync entry                 |  | async control intake        | |
      |  +-------------+--------------+  +--------------+-------------+ |
      |                | 处理                           | 处理 / 消费   |
      |                v                                v              |
      |  +-------------+--------------------------------+-------------+ |
      |  |              Sandbox 受控执行承接单元                       | |
      |  |      environment identity / boundary / policy / capture      | |
      |  +-------------+----------------+---------------+-------------+ |
      |                | 承载 / 依赖     | 承载 / 依赖   | 处理          |
      |                v                v               v              |
      |  +-------------+-------------+  +----------------------------+  |
      |  | Sandbox truth / material   |  | Sandbox 后台维护与清理      |  |
      |  | 状态承载                  |  | lease / cleanup / reaper    |  |
      |  +-------------+-------------+  +--------------+-------------+  |
      |                | 承载 / 依赖                    | 依赖           |
      +================+=================================+==============+
                       |                                 |
                       v                                 v
      +----------------+----------------+      +---------+--------------+
      | 材料 / 观测 / 事件交接边界       |      | isolation backend      |
      | artifact / observability / bus  |      | process / fs / network |
      +---------------------------------+      +------------------------+
```

该图表达 `L4-sandbox` 的正式运行承载结构,不表达源码目录、接口协议、事件名、数据库表、技术产品或部署参数。

图示说明:

- `Sandbox 同步入口单元` 和 `Sandbox 异步控制与交接消费单元` 是入口 / 消费形态差异,不是两套 sandbox truth。
- `Sandbox 受控执行承接单元` 是隔离执行建立、边界落实、policy 执行、capture 和执行收束的主运行承载。
- `Sandbox truth / material 状态承载` 是本仓正式状态承载;观测、事件和下游材料交接不得替代它。
- `isolation backend` 是正式基础设施依赖,不是本仓业务 truth 存储,也不在本步锁定 Docker/gVisor/Firecracker/k8s/local_process。
- `Sandbox 后台维护与清理单元` 必须能独立表达 lease、orphan、cleanup guard、reaper 和 redline containment 的运行职责。

### 9.2 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 执行消费 / 语境策略输入边界 | 运行时对接的正式外部边界 | 承接 tools、runtime、member-service、runner 等执行消费方带来的执行语境、身份 / 工作引用、给定 policy / authorization 摘要和受控执行意图。 | 通过入口关系进入 `Sandbox 同步入口单元`。 | 只作为外部运行边界出现,不拥有 ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun、identity / work 或 policy truth。 |
| 控制 / 事件协作输入边界 | 运行时对接的正式外部边界 | 承接 `L0-bus`、control signal、handoff 状态、安全交接、调查状态和维护触发等协作输入。 | 被 `Sandbox 异步控制与交接消费单元` 消费。 | 它提供协作信号和状态线索,不得反向定义 sandbox truth。 |
| Sandbox 同步入口单元 | 同步入口单元 | 承接受控执行请求、状态查询、归责读取和控制意图进入,并将需要真实执行或正式控制的请求交给内部运行承载。 | 从执行消费 / 语境策略输入边界接收入口,处理后进入受控执行承接或异步控制消费。 | 不在本章定义 API、RPC、SDK 方法、route、command、query、DTO 或鉴权细节。 |
| Sandbox 异步控制与交接消费单元 | 异步消费单元 | 消费控制、handoff、失败协作、安全交接、调查状态和维护触发输入,并将其收束为 truth 更新、执行控制或后台维护输入。 | 消费控制 / 事件协作输入边界,处理后影响受控执行承接、truth / material 状态承载或后台维护清理。 | 它不是事件总线或观测存储,也不拥有 runtime recover 或调查生命周期。 |
| Sandbox 受控执行承接单元 | 后台处理单元 | 承载执行环境身份建立、隔离边界落实、资源 / 文件系统 / 网络 / 进程限制施加、policy 执行裁定、输出 capture 和执行收束。 | 由同步入口触发,依赖 truth / material 状态承载和 isolation backend,并向材料 / 观测 / 事件交接边界输出材料。 | 这是主执行运行承载,不是旧 `execution orchestrator` 或 `backend adapter` 代码模块。 |
| Sandbox 后台维护与清理单元 | 后台处理单元 | 承载 lease 巡检、orphan environment 发现、cleanup guard、reaper、保守回收、材料保留检查和 redline containment。 | 依赖 truth / material 状态承载、isolation backend 和必要安全交接状态,处理后输出 cleanup / redline 材料。 | 不推进 runtime 业务恢复,不拥有 artifact retention 或 investigation case truth。 |
| Sandbox truth / material 状态承载 | 正式存储承载 | 承载 execution isolation truth、capture / handoff、failure / control、cleanup / redline 状态和材料引用。 | 被同步入口、异步消费、受控执行承接和后台维护清理共同依赖。 | 这是本仓正式状态承载;不写具体数据库、表结构、索引、对象存储或缓存产品。 |
| isolation backend 承载边界 | 正式基础设施依赖 | 提供真实进程、文件系统、网络、资源限制和生命周期控制的承载能力。 | 被受控执行承接和后台维护清理依赖。 | 它是基础设施依赖,不拥有 sandbox truth;本步不锁定具体后端产品。 |
| 材料 / 观测 / 事件交接边界 | 运行时对接的正式外部边界 | 承接 captured output、candidate material、observability material、failure / control / cleanup / redline material 和协作信号输出。 | 接收受控执行承接、异步消费和后台维护清理输出,供 artifact、observability、runtime、runner 和 `L0-bus` 等消费。 | 它表达运行交接边界,不代表本仓拥有 artifact truth、observability store 或 bus truth。 |

### 9.3 部署关系结论

| 关系 | 结论 |
|---|---|
| 同步入口、受控执行承接、异步控制消费和后台维护清理 | P0 可同部署在一个服务进程或同一运行环境中,但运行职责、失败归责和未来拆分边界必须分清。 |
| 受控执行承接与后台维护清理 | 架构语义必须分开;前者承接正式执行主路径,后者承接 lease、orphan、cleanup、reaper 和 redline 非 happy path。 |
| truth / material 状态承载 | 即使后续与其他物理存储共享基础设施,架构语义也必须单独表达,不得被观测、事件或后端产品替代。 |
| isolation backend 承载边界 | 必须作为正式基础设施依赖表达,但不得写成 Docker/gVisor/Firecracker/k8s/local_process 的定稿组合。 |
| 材料 / 观测 / 事件交接边界 | 是外部运行边界,不意味着 sandbox 拥有 artifact、observability、bus、runtime 或 runner 的主体架构。 |
| 数据库、缓存、消息系统、对象存储、日志平台、trace 后端、secrets、GRC 产品和部署脚本 | 不进入本步定稿,后续由 Step 10、04、03、05、06 或 07 闭口。 |

### 9.4 通信方式结论

| 运行关系 | 当前架构口径 |
|---|---|
| 执行消费 / 语境策略输入边界到同步入口 | 只确认存在正式入口关系,不在本步选择 HTTP、gRPC、SDK facade、CLI、queue command 或 console action。 |
| 同步入口到受控执行承接 | 只确认同步入口会把需要真实执行或正式控制的请求交给执行承接,不写 handler、service、DTO、事务或状态机。 |
| 控制 / 事件协作输入边界到异步控制消费 | 只确认存在正式消费关系,不选择 topic、event schema、consumer group、callback、relay 或 outbox 机制。 |
| 受控执行承接到 truth / material 状态承载 | 只确认执行承接依赖并推进本仓正式状态承载,不写表、索引、锁、事务隔离或缓存策略。 |
| 受控执行承接到 isolation backend | 只确认需要真实隔离承载,不写 Docker API、k8s job、container runtime、seccomp profile 或 sandbox backend adapter。 |
| 异步控制消费到后台维护清理 | 只确认控制、handoff、安全交接和维护触发可以影响后台维护,不写调度、重试、订阅或恢复策略。 |
| 受控执行 / 后台维护到材料 / 观测 / 事件交接边界 | 只确认材料和协作输出关系,不把 handoff、audit、trace、metric 或 event 流写成 truth storage。 |

### 9.5 运行边界红线

| 红线 | 结论 |
|---|---|
| 不把源码结构当容器 | `api`、`application`、`domain`、`repository`、`handler`、`adapter`、`module`、`src/` 不进入 Step 6 图。 |
| 不把具体后端产品当架构定稿 | Docker、gVisor、Firecracker、containerd、runc、k8s、local_process 只可能是后续候选,本步不定稿。 |
| 不允许宿主直跑或 test-only 升格 | 无法建立真实受控隔离环境或无法落实必需限制时必须拒绝或保守失败,不得 fallback 到宿主直跑。 |
| 不把 policy 来源写成本仓 truth | sandbox 只执行给定 launch / isolation policy 和 authorization 摘要,不生成 allowlist、approval、capability 或 policy DSL truth。 |
| 不把观测 / 事件当 truth store | audit、trace、metric、event、outbox、bus 只承载交接和协作,不能替代 execution isolation truth。 |
| 不把材料交接当 formal artifact | captured output 和 candidate material 必须显式 handoff,不能由 sandbox 宣布为 artifact baseline、evidence 或 retention truth。 |
| 不把 cleanup 交给调用方私有兜底 | lease、orphan、cleanup guard、reaper 和 redline containment 必须在 sandbox 运行承载中有正式位置。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` §7 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

### 10.1 §7 容器 / 部署架构建议正文

`L4-sandbox` 的容器 / 部署架构按运行承载角色划分,不是按源码目录、代码模块、协议、后端产品或部署工作负载划分。正式运行结构由 `Sandbox 同步入口单元`、`Sandbox 异步控制与交接消费单元`、`Sandbox 受控执行承接单元`、`Sandbox 后台维护与清理单元`、`Sandbox truth / material 状态承载`、`isolation backend 承载边界` 和 `材料 / 观测 / 事件交接边界` 组成。

同步入口承接受控执行请求、状态查询、归责读取和控制意图进入。异步控制与交接消费承接 `L0-bus`、control signal、handoff 状态、安全交接、调查状态和维护触发。受控执行承接单元负责执行环境身份建立、隔离边界落实、resource / filesystem / network / process 限制施加、给定 policy 的执行裁定、输出 capture 和执行收束。后台维护与清理单元负责 lease 巡检、orphan environment 发现、cleanup guard、reaper、材料保留检查和 redline containment。

`Sandbox truth / material 状态承载` 是 execution isolation truth、capture / handoff、failure / control、cleanup / redline 状态和材料引用的正式承载。`isolation backend 承载边界` 是真实进程、文件系统、网络、资源限制和生命周期控制成立所需的正式基础设施依赖,但不拥有 sandbox truth。`材料 / 观测 / 事件交接边界` 只表达 captured output、candidate material、observability material、failure / control / cleanup / redline material 和协作信号的运行交接,不代表 sandbox 拥有 artifact truth、observability store 或 bus truth。

P0 可以将同步入口、受控执行承接、异步控制消费和后台维护清理同部署,但它们的运行职责、失败归责和未来拆分边界必须清楚。后续当执行时长、并发、容量、清理可靠性、安全调查或材料交接压力增加时,受控执行承接、异步控制消费和后台维护清理应能拆分为独立运行单元。具体数据库、缓存、消息系统、对象存储、日志平台、trace 后端、secrets、GRC 产品、isolation backend 产品组合和部署参数不在本章定稿。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 推荐处理 | 当前状态 |
|---|---|---|
| P0 运行单元是否强制独立部署 | 采用“可同部署但职责分离”的架构口径,后续 07 再形成 implementation boundary。 | 本步已收敛,不阻塞 Step 7。 |
| 具体 isolation backend 产品组合 | 后移 Step 10 `关键技术选型`、04 `配置设计` 和 07 `实施计划`,Step 6 只保留抽象承载边界。 | 本步已收敛,不阻塞 Step 7。 |
| policy 来源是否固定到单一上游 | 后续 Step 9 / 03 细化接缝矩阵;当前只表达给定 policy / authorization 输入边界。 | 本步已收敛,不阻塞 Step 7。 |
| cleanup / reaper 是否需要独立 worker | Step 6 只要求运行职责独立表达;是否独立进程由后续实施计划和 boundary skeleton 裁剪。 | 本步已收敛,不阻塞 Step 7。 |

### 11.2 本 Step 未确认事项

本 Step 没有发现阻塞进入 Step 7 的上游 blocker。仍需按流程等待用户审查并确认 Step 6 后,才能启动 Step 7 `依赖方向与层间约束`。

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否已读取 Step 4 / Step 5 / 正式 00 / SOP Step 6 / 书写规范 §4.7 | pass。输入已在 §1 和 §3 记录。 |
| 是否已明确正式运行承载单元 | pass。已在 §5 和 §9 收敛同步入口、异步消费、受控执行、后台清理、状态承载、后端边界和外部交接边界。 |
| 是否已明确同步入口、异步消费和后台维护位置 | pass。同步入口、异步控制消费、受控执行承接和后台维护清理已分离表达。 |
| 是否已明确存储 / 基础设施 / 外部运行边界 | pass。truth / material 状态承载、isolation backend 承载边界和材料 / 观测 / 事件交接边界已收敛。 |
| 是否避免写入代码目录、协议、事件、DTO、schema、表结构和技术产品 | pass。相关内容均被排除或后移。 |
| 是否记录旧 README / 旧 `01` 冲突并作为 historical material 处理 | pass。已在 §6 和 §7 记录。 |
| 是否允许进入下一步 | pass_wait_review。Step 6 已完成,但必须先等待用户审查;用户确认后才允许进入 Step 7。 |

进入下一步条件:

```text
已明确 L4-sandbox 的正式运行承载单元、同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载、isolation backend 承载边界和材料 / 观测 / 事件交接边界。
已明确 P0 可同部署但逻辑运行职责必须分离,后续可按执行、控制、清理和安全压力拆分。
已明确具体 isolation backend、数据库、缓存、消息、观测、部署参数和协议 schema 不在本步定稿。
正式 `01-架构设计.md` 仍不得修改;用户确认 Step 6 后,才允许启动 Step 7 `依赖方向与层间约束`。
```
