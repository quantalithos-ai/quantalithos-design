# Step 6. 容器 / 部署架构

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `container_deployment` | pass | 同步入口、后台处理、条件型异步消费、正式状态承载和外部运行边界已分层;独立进程、产品和协议均未被伪定 | 进入 Step 7 依赖方向与层间约束 | `01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 4~5、架构 SOP Step 6 与书写规范 §4.7。
- [x] 从输入 / 输出面识别同步、后台和条件型异步承载角色。
- [x] 从镜像域 truth / derived trace 边界识别正式状态承载角色。
- [x] 区分运行承载角色、语义上下文和独立部署进程。
- [x] 明确 current / conditional 单元与可同部署边界。
- [x] 形成容器 / 部署图、运行单元表和短部署说明。
- [x] 排除代码分层、协议、数据库 / CI / registry 产品和资源参数。
- [x] 核对 event output、container lifecycle 和 readiness 未进入本仓承载。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 4 系统上下文 | 上游来源、external capabilities、Artifact 和 Member Service 对接边界 |
| Step 5 限界上下文 | 4 核心 + 1 支撑语义,但不一一映射运行单元 |
| 正式 00 IF-MI-001~014 | 查询 / 变更 / background / event-input 能力形态线索,不继承实现名 |
| 正式 00 NFR / VETO | fail-closed、history、trace、no-live-state 和 no-fake-readiness |
| MI-UP-001 / 005 / 007 / 009 | consumer、event intake、Artifact handoff 和 no-event-output 上限 |

## 3. SOP 问题回答

1. 本仓运行时有哪些正式承载单元?

   回答:架构要求“镜像供给同步入口”“构建与供给后台处理”“条件型构建输入消费”“镜像域正式状态承载”“派生读取与追溯承载”五类内部承载角色。它们是目标运行角色,不声称已有进程、服务、镜像、数据库或部署。

2. 同步入口在哪里?

   回答:镜像供给同步入口承接 definition / baseline / trace / entry 的受控读写和下游 pinned entry 解析语义。它不承接 container create / start / health,也不直接操作外部 builder / registry truth。

3. 异步消费者或后台任务在哪里?

   回答:构建与供给后台处理承接 nightly intent、input snapshot、外部执行交接、candidate / eligibility / availability 推进和维护恢复;条件型构建输入消费只在 MI-UP-005 正式闭口后承接获准事件输入,当前不可用。

4. 数据库 / 缓存 / 总线如何接入?

   回答:本步只确认镜像域正式状态必须有唯一承载,派生读取 / trace 可有独立逻辑承载且不得反写真相。具体数据库、object store、cache、queue、bus、registry 或 report backend 均不选定;Bus 只可能连接条件型入站单元,没有出站关系。

5. 哪些单元必须分开部署,哪些可以同部署?

   回答:同步、后台和条件型异步职责必须逻辑分离,但当前可同部署在一个运行环境;正式状态与派生承载即使物理同库也必须语义分离。吞吐、隔离、恢复或构建耗时出现正式依据后才决定拆分 worker / service。

6. 哪些通信关系是正式主路径?

   回答:来源边界进入同步或后台处理;nightly / conditional input 进入后台处理;后台处理依赖正式状态与外部 execution / Artifact 能力;同步入口读取正式 / 派生承载并向 Member Service 提供入口;所有正向推进仍受 domain gate 约束。

## 4. 当前材料问题诊断

| 候选部署表达 | 问题 | 当前处理 |
|---|---|---|
| API Service + Build Worker + Publisher + Rollback Worker 固定四服务 | 过早锁进程数量,且按用例而非承载角色拆分 | 当前只固定同步 / 后台 / conditional async 三类处理角色 |
| CI 平台即后台处理单元 | 将外部 builder / scheduler 变成本仓领域容器 | CI / builder 只在外部能力边界 |
| Registry 即正式状态承载 | Registry 存在无法表达 intent / eligibility / rollback truth | 单列镜像域正式状态承载 |
| 每个 BC-MI 一个独立服务 | 将语义上下文机械映射部署 | 不要求一一映射 |
| Event consumer / publisher 成对出现 | MI-UP-009 无出站 authority | 只保留条件型入站消费,当前 disabled |
| Container runtime / Sandbox 出现在部署图 | 会混淆被供给镜像与本仓运行承载 | 不进入本仓内部框 |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前结论 |
|---|---|---|
| 运行入口 | 泛 API / CLI | 产品中立的镜像供给同步入口角色 |
| 后台 | 多 worker 名称 | 单一后台处理角色,后续可按正式压力拆分 |
| 事件 | 默认消费和发布 | Conditional inbound only;no output |
| 状态 | Registry / filesystem 即真相 | 镜像域正式状态承载与外部 registry 分层 |
| 派生读取 | 与 truth 混存混写 | 逻辑独立、可重建、不得反写 |
| 部署 | 一上下文一服务 | 当前允许处理角色同部署,语义边界不合并 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个核心上下文一个独立服务 | 隔离直观 | 无 workload 依据,增加分布式一致性和运维复杂度 | 不采用 |
| 只有 CI 配置和 registry,不设领域运行承载 | 最小实现 | 无法承载定义、attempt、eligibility、availability truth | 不采用 |
| 3 类处理角色 + 2 类状态角色,允许初期同部署 | 保留职责和演进边界,不预设产品 | 后续概要需映射实际主体 | 采用 |
| 立即引入 event consumer / publisher / outbox | 异步扩展方便 | 入站 schema 和出站 authority 均未闭口 | 不采用;仅保留 disabled inbound role |
| 将派生读取与正式状态强制物理分库 | 隔离最强 | 当前缺少规模与恢复依据 | 不采用;只要求语义分离 |

## 7. 结构化中间产物

### 7.1 容器 / 部署架构图

图类型:容器 / 部署架构图

图标题:L2-member-images 正式运行承载角色

```text
          +-----------------------------+       +-----------------------------+
          | Definition / input sources  |       | Nightly / conditional input |
          +--------------+--------------+       +--------------+--------------+
                         | 入口                                | 入口
                         v                                     v

      +====================================================================+
      |                  L2-member-images 运行承载                         |
      |                                                                    |
      |  +---------------------------+   +-------------------------------+ |
      |  | 镜像供给同步入口           |   | 条件型构建输入消费             | |
      |  | sync entry                |   | async intake (conditional)    | |
      |  +-------------+-------------+   +---------------+---------------+ |
      |                | 处理                              | 消费           |
      |                +----------------+------------------+               |
      |                                 v                                  |
      |                 +---------------+----------------+                 |
      |                 | 构建与供给后台处理              |                 |
      |                 +----------+---------------------+                 |
      |                            | 承载 / 依赖                            |
      |             +--------------+---------------+                      |
      |             v                              v                      |
      |  +----------+----------------+  +----------+-------------------+  |
      |  | 镜像域正式状态承载         |  | 派生读取与追溯承载             |  |
      |  +---------------------------+  +------------------------------+  |
      +===============================+====================================+
                                      | 依赖 / 输出
                   +------------------+------------------+
                   v                                     v
      +------------+----------------+       +------------+----------------+
      | External execution / supply |       | Member Service consumer     |
      | build/registry/evidence/art |       | pinned entry boundary       |
      +-----------------------------+       +-----------------------------+
```

说明:

- 三类处理角色可以同部署,但同步、后台和条件型异步职责不得混写。
- 条件型构建输入消费在 MI-UP-005 关闭前不具备 positive 运行路径;图中没有 event output。
- 正式状态承载是镜像域 truth 的唯一承载角色;派生读取 / trace 可重建且不得反写。
- External execution / supply 与 Member Service 均在本仓边界外;前者执行不等于领域成功,后者消费不等于 local readiness。
- 图只表达运行承载角色与入口 / 处理 / 消费 / 承载 / 依赖关系,不表示进程、协议、产品或已部署事实。

### 7.2 运行单元说明

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| Definition / input sources | 运行时对接的正式外部边界 | 提供 mapping、component、seed、gate 和正式引用的受控输入。 | 通过入口关系进入同步或后台处理。 | 只提供 ref / snapshot / safe conclusion,不转移正文 owner。 |
| Nightly / conditional input | 运行时对接的正式外部边界 | 提供必须保留的 nightly 意图和未来获准异步输入。 | 进入后台处理或条件型异步消费。 | Nightly 不预设 scheduler;conditional event 仍 pending。 |
| 镜像供给同步入口 | 同步入口单元 | 承接镜像定义 / baseline 的受控管理、trace 读取与 pinned entry resolve。 | 读取 / 推进正式状态,读取派生 trace,向 consumer 输出。 | 不定义 route、DTO、鉴权、API / CLI 产品或 container lifecycle。 |
| 条件型构建输入消费 | 异步消费单元 | 在 authority 闭口后收束 verified build input。 | 消费条件输入并交给后台处理。 | 当前 `conditional / unavailable`;不发布任何出站事件。 |
| 构建与供给后台处理 | 后台处理单元 | 承接 nightly intent、snapshot、external handoff、candidate、eligibility、availability、恢复与维护推进。 | 依赖正式状态和外部能力,向同步入口提供可读结果。 | 它不是 builder / registry / evidence backend 本体。 |
| 镜像域正式状态承载 | 正式存储承载 | 承载 definition、revision、intent / attempt / snapshot / candidate、eligibility、availability、entry 和 history。 | 被同步入口与后台处理共同依赖。 | 不选数据库 / object store;不得由 registry 或派生视图替代。 |
| 派生读取与追溯承载 | 正式存储承载 | 承载可重建 source trace、gap、历史读取与维护摘要。 | 从正式状态和受控外部引用派生,供同步入口读取。 | 可与正式状态物理同置,语义上不得反写 truth。 |
| External execution / supply | 运行时对接的正式外部边界 | 承载 builder、registry、evidence 与 Artifact handoff 的执行 / 存储 / 安全结论。 | 被后台处理依赖并返回 conservative outcome。 | Adapter success 不直接形成 candidate / eligibility / availability / Artifact ref。 |
| Member Service consumer | 运行时对接的正式外部边界 | 消费 pinned entry 或 contract gap。 | 从同步入口或等价供给面读取。 | 不把 launch、health、upgrade 或 confirmation 写回本仓 truth。 |

### 7.3 部署关系结论

- 当前架构不要求同步入口、后台处理和 conditional async intake 独立进程;可以同部署,但职责、失败和可观测边界必须可区分。
- 若构建耗时、吞吐、隔离、恢复或伸缩出现正式测量依据,后台处理可独立拆分;本步不预设 worker 数量或调度产品。
- 镜像域正式状态与派生读取 / trace 即使物理同库,也必须保持 truth / derived 分层;缓存不得成为可用性来源。
- Builder、registry、evidence backend 和 Artifact 系统始终是外部运行边界;本仓不部署或拥有其产品 truth。
- Member Service 和实际 member container 不属于本仓部署拓扑;本仓镜像候选也不是本仓自身运行容器。

### 7.4 通信方式上限

| 运行关系 | 本步只确认 | 本步不确认 |
|---|---|---|
| 外部来源 -> 同步 / 后台入口 | 正式 ref / snapshot / safe conclusion 的入口关系 | HTTP / RPC / file / SDK / callback 选择 |
| Nightly -> 后台处理 | 必须存在可形成 intent 的运行承接 | cron / CI / scheduler 产品和时间参数 |
| Conditional input -> async intake | 未来可承接 verified event input | event family / schema / topic / consumer group / readiness |
| 后台处理 -> external capabilities | 产品中立的交接与 conservative outcome | Builder / registry / scanner / signer / Artifact API 产品 |
| 处理单元 -> 正式 / 派生承载 | 正式状态与派生读取角色存在 | 事务、表、repository、cache、分区和 retention |
| 同步入口 -> Member Service | Pinned entry / gap 的消费方向 | Exact manifest schema、transport、launch / confirmation |

### 7.5 部署说明

本图以本仓运行承载为主语,把外部定义 / 执行 / 消费对象压缩为对接边界。当前最小部署可以让三类处理角色同置,但不能因此把后台失败、conditional event 和同步查询混成一条状态。正式状态与派生读取可以物理同置,其写入 authority 仍必须分离。具体服务数量、存储、CI、registry、消息系统和环境拓扑由后续设计在获得正式合同和测量依据后决定。

## 8. 回填草稿

正式 01 §7 回填 §7.1 图、§7.2 运行单元说明、§7.3 部署关系和 §7.5 短文。正式正文须保留“运行角色不等于已部署进程”和 conditional async 未 ready 的限定。

## 9. 待确认事项

- MI-UP-005 持续阻塞条件型异步输入的 positive deployment / integration。
- MI-UP-001 / 007 持续限制 consumer / Artifact 外部运行边界的 exact contract。
- Q-MI-003 / 004 使 backend 产品和 evidence inventory 保持未选定。
- 当前无实现或 workload 证据,因此不声明任何进程数量、扩缩规则、资源参数或运行 readiness。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 正式处理 / 状态 / 外部运行角色是否清楚 | pass |
| 同部署与逻辑分离是否明确 | pass |
| Conditional inbound / no outbound event 是否保留 | pass |
| 是否未把子域、源码、协议、产品、参数写成部署事实 | pass |
| 是否未声明任何真实部署或 readiness | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 7,不得跳到 Step 8 或修改正式 01。
