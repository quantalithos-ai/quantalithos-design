# L4-observability 03-详细设计 Step 17 · 收口详细设计到实施计划的承接清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 回填章节: `03-详细设计.md` §16 详细设计到实施计划的承接清单
> 当前模式: `full-restart`
> 本步边界: 只形成详细设计交给后续 `07-实施计划.md` 的输入,不定义 phase / commit boundary,不创建实现代码、implementation ledger 或 boundary skeleton

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 17 `收口详细设计到实施计划的承接清单` |
| 输出文件 | `projects/L4-observability/design-calibration/03_ddd_step_17_implementation_handoff.md` |
| 上游完成状态 | Step 01~16 均有当前设计记录；Step 09~16 为 `completed_design_record_with_affected_open`，不表示 implementation-ready |
| 本步写入状态 | `completed_design_record_with_affected_open` |
| 本步自检状态 | `pass_with_affected_open` |
| 正式回填状态 | `blocked_until_current_step_19` |
| gate_status | `completed_design_record_with_affected_open` |
| next_allowed_action | `continue_M3_step_18_under_current_user_authorization` |
| 上游 blocker | 未发现新的上游 blocker；I05 payload/binding 与 J06 H13 既有 blocker、其余 inherited affected 保持开放 |
| historical targeted repair | R1 `CFG-BLK-07-01` 与 R2 `CFG-BLK-09-01` 已在旧装配轮关闭；只作为已消费历史修复保留，不覆盖本次 M2/M3 affected register |

### 1.1 Step 内分批计划与停审记录

| 批次 | 范围 | 写入状态 | 批次结论 | 后续承接 |
|---|---|---|---|---|
| `17.0` | 标准、上游、历史材料与本地现实输入审计 | done | 当前 `00/01/02` 可继续承接;旧 README、旧正式 `03`、旧 `04~07` 均非当前真相源 | `17.1` |
| `17.1` | Step 01~16 可实施契约 inventory | done | 七模块、对象、port、60 个协议、flow、27 个状态机及横切契约均有来源；`0/60` 无条件可激活 | `17.2` |
| `17.2` | 字段 / DTO / Query / 状态 / public type / 命名闭环 | done | current owner可回指；inherited affected由唯一boundary gate承接，不交给实现者补口 | `17.3` |
| `17.3` | 实施前置阅读、implementation precondition 与引用规则 | done | 实施者开工前必须读取的正式文档、校准产物、规范和 git 纪律已明确 | `17.4` |
| `17.4` | `07` phase / commit-boundary 审计输入 | done | 已给出审计维度、闭包规则、失败处理和 ledger / skeleton 创建时点 | `17.5` |
| `17.5` | 下游边界、正式回填草稿、自检与门禁 | done | 本轮用户已授权完成M3；只允许Step 18继续消费 | `18.0` |

本文件的 `completed_design_record_with_affected_open` 只表示“详细设计已经形成可由实施计划承接并逐
boundary 审计的输入”。它不表示 affected 已关闭、正式 `03` 已完成本轮装配、`04/05/06/07` 已
重建，也不表示项目已经可以移交实现。

## 2. 本步目标与非目标

### 2.1 目标

1. 逐类确认 Step 01~16 中哪些契约已经足够交给实施计划。
2. 固定实施者开始编码前的全局阅读清单和关注面阅读矩阵。
3. 完成字段、DTO / Event / Job、Query response、public protocol type、状态、命名和 phase boundary 的预复核。
4. 明确 `07` 应如何引用详细设计,避免复制字段表、协议 schema、状态矩阵和函数 flow 形成第二真相源。
5. 向 `07` 提供逐 phase / commit boundary 整体可落码闭环审计所需的对象、协议、flow、状态、持久化、错误、幂等、配置、测试与验收映射输入。
6. 把尚未允许进入实现的事项和 implementation kickoff precondition 明确列出,避免实现 agent 自行补设计。

### 2.2 非目标

- 不写开发排期、工期、人力或每日任务。
- 不在本步拆 phase、task 或 commit boundary。
- 不提前重建正式 `07-实施计划.md`。
- 不创建或刷新 `implementation_execution_ledger.md` 与 `implementation-boundaries/*`。
- 不修改正式 `03-详细设计.md`;正式装配只允许发生在 Step 19。
- 不重新定义 Step 06 对象字段、Step 07 port、Step 08 DTO、Step 09 flow 或 Step 10 状态。
- 不选择 HTTP / RPC、消息、存储、OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard、alert、GRC 等具体产品实现。
- 不创建目标实现仓、源码、脚本、配置、测试、artifact 或 report。
- 不伪造实现 commit、真实 `run_id`、真实 evidence alias、测试结果、验收 verdict 或签署。

## 3. 本步输入与采用方式

### 3.1 规范输入

| 输入 | 采用方式 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 17 | 约束本步必须输出实施承接、前置阅读、字段 / DTO / 状态 / phase boundary / 命名复核和待确认项 |
| `standards/document/详细设计书写规范.md` 5.16 | 约束正式 §16 的结构、跨文档复核和 `07` 审计输入 |
| `standards/document/设计文档讨论中间产物规范.md` 5.10 | 约束真相源、字段、构造、Query、public type、状态、phase、命名、冲突和正反例十类产物 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 约束实现者不得自行补 schema / port / state / boundary,并要求 `07` 做逐 boundary 整体审计 |
| `standards/document/实施计划书写规范.md` | 只提取 `07` 的前置阅读、ledger、commit、boundary 与交付实现前审计要求,不提前写实施计划 |
| `standards/document/代码实施台账与门禁规范.md` | 固定 implementation ledger 与 boundary skeleton 的职责和创建时点 |
| `standards/coding/rust.md` | 固定 Rust 标识符、rustdoc、注释、错误和测试名的英文约束 |
| `standards/document/子项目目录与代码文件组织规范.md` | 固定目标仓、workspace member、package、crate、module 和文件命名 |
| `projects/README.md` | 固定设计仓 / 实现仓区分及项目级提交纪律入口 |

### 3.2 项目输入

| 输入 | 当前身份 | 本步采用方式 |
|---|---|---|
| 当前正式 `00-需求文档.md` | current baseline | 提供需求、数据归属、接口、非功能和验收方向 |
| 当前正式 `01-架构设计.md` | current baseline | 提供职责、依赖、真相 ownership、通信和横切红线 |
| 当前正式 `02-概要设计.md` | direct upstream | 提供七模块代码主体、十个主要组成部分、接口骨架、flow family 和状态轮廓 |
| 当前 `03` Step 01~16 | current detailed-design truth | 提供本步全部可实施契约和闭环证明 |
| `03_ddd_calibration_flow.md` | document ledger | 提供逐 Step 门禁、历史材料处理与当前恢复点 |
| `project_execution_ledger.md` | project ledger | 提供正式文档链状态、blocker 和 next allowed action |
| L1-governance / L1-artifact / L1-identity Step 17 | granularity reference | 只参考结构、复核维度和引用规则,不复制相邻域 truth |

### 3.3 Historical material 诊断

| 材料 | 诊断 | 本步处理 |
|---|---|---|
| `projects/L4-observability/README.md` | 仍以 OTel Collector、TimescaleDB、Grafana、DORA/EBM、哈希链、血缘 API 和告警引擎为产品化主线,与当前产品中立和 observation-only 边界冲突 | 记为 `historical_material`;不进入实施承接 |
| 当前磁盘上的 `03-详细设计.md` | 4990 行旧 Step 19/R2 装配稿，主体粒度可复用但状态早于 M2，缺本轮 affected-aware closure | 记为 `historical_material_pending_current_step_19_reassembly`;不得直接作为本轮实现基线 |
| pre-M2 Step 17 completion | 主体 inventory 完整，但使用 `pass_for_step_17` / `closed_consumed_by_04_step_09` 且没有12项 inherited affected handoff | 保留结构化材料，顶层门禁和 affected 结论由本轮 current 记录替换 |
| 当前磁盘上的 `04-配置设计.md` | 上一轮产物,尚未按本轮 full-restart 重建 | 记为 `historical_material`;后续按配置设计 SOP 逐 Step 重建 |
| 当前磁盘上的 `05-测试方案.md` | 上一轮产物,不能证明与当前 60 协议、27 状态机和 Step 16 切口一致 | 记为 `historical_material`;后续按测试方案 SOP 重建 |
| 当前磁盘上的 `06-验收标准.md` | 上一轮产物,不能作为当前验收 gate / evidence 依据 | 记为 `historical_material`;后续按验收 SOP 重建 |
| 当前磁盘上的 `07-实施计划.md` | 上一轮产物,不能作为当前 phase / commit boundary | 记为 `historical_material`;后续按实施计划 SOP 重建 |
| 旧 implementation ledger / boundary files | 上一轮实现移交材料 | 记为 `historical_material`;仅在新 `07` 完成时创建当前版本 |

### 3.4 真相源优先级

```text
current standards
  -> current formal 00 / 01 / 02
  -> current 03 Step 01~16 calibration artifacts
  -> this Step 17 handoff artifact
  -> future Step 18 risk closure
  -> future Step 19 formal 03 assembly
  -> future current-round 04 / 05 / 06 / 07

README, old formal 03~07 and old implementation ledgers
  -> historical diagnosis only
```

若未来正式文档与当前 Step 产物冲突,在 Step 19 之前以当前 Step 产物为设计校准真相源;正式 `03` 由 Step 19 装配并通过一致性检查后,才成为实施计划的直接正式输入。

## 4. SOP 问题回答

| # | SOP 问题 | 当前答案 |
|---:|---|---|
| 1 | 哪些实现契约已经足够进入实施计划? | Step 01~16 已覆盖范围、Rust / repo 约束、七模块布局、对象、port、60 个 public protocol、逐接口 flow、27 个状态机、logical persistence、错误恢复、并发幂等、typed config / external binding、观测审计和测试切口。它们足以作为 `07` 拆 boundary 和判断 blocked path 的输入；`60/60` 有设计记录，零项可在不审计 inherited affected 的情况下无条件激活。 |
| 2 | 实施者需要先阅读哪些文档? | 必须先读当前轮正式 `00~07`、当前 boundary 指定的 calibration 文件、Rust / 目录 / 依赖 / 真相源 / ledger / commit 规范。完整矩阵见 §10。 |
| 3 | 提交规范、git config、Rust 与注释规范是否列入前置? | 是。目标实现仓必须现场核实 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`;源码与实现仓 commit 使用英文;具体格式见 §10 / §11。当前只核实 design 仓身份,不伪造目标仓配置。 |
| 4 | Domain 必填字段是否可回指来源? | 是。Step 06 提供逐对象字段 / factory / method 来源,Step 07 提供 lookup / generator / clock / policy / resolver,Step 08 提供 DTO / event / job 字段,Step 09 提供 copy / derive / lookup 顺序,Step 11 提供落盘。分组复核见 §12.2。 |
| 5 | 每个 Command / Event / Job 是否可构造目标对象或明确缺失处理? | `pass_with_affected_open`。16 Command、9 Consumer、12 Event、9 Job 均有 target与flow；I05因canonical payload/producer binding缺失只能保持slot disabled，J06因H13 owner未闭合只能输出controlled blocked/manual，其他owner gap按§14.7分配。 |
| 6 | Query response / view / page / marker 和 read-model identity 是否闭合? | 是。14 Query 均有 request、response / view / page、field source、visibility / freshness / degraded / availability / missing / rebuild surface、public ref 与 projection lookup 规则;Query 严格 no-write。见 §12.4。 |
| 7 | 状态枚举、状态图、测试切口和验收口径是否统一? | 详细设计侧已统一为 Step 10 的 27 个正式 enum 和 variant,Step 16 已按相同名称给出切口。当前 `05/06` 仍是 historical material,必须重建后再由 `07` 复核。见 §12.6。 |
| 8 | 当前 phase / commit boundary 是否误用后续对象、结果或证据? | 本步不预写 phase / commit boundary。Step 01~16 已把 current / reserved surface 分开;未来 `07` 每个 boundary 必须形成 dependency closure,不得引用后续 DTO、port、state、result、report、script 或 evidence。见 §12.7 / §14。 |
| 9 | 是否仍有旧名、口语名或别名漂移? | 当前 canonical names 可回指，但旧正式 `03` 中仍有 pre-M2 completion wording 与过时 UoW order；本轮不将其视为已关闭，Step 19 必须扫描并修正。README、旧 `04~07` 继续禁用。 |
| 10 | 哪些内容仍待确认,不能进入实施? | 目标实现仓不存在;正式 `03` 未装配;当前轮 `04/05/06/07` 未完成;逐 boundary 审计、ledger / skeleton、真实工具 / adapter / DDL / fixture / CI / evidence 均未落地。见 §11 / §13。 |
| 11 | 实施计划如何引用本文而不是重复本文? | `07` 只写 boundary、顺序、门禁和引用位置,使用“正式章节 + calibration 精确小节”指针;不得复制字段表、DTO schema、状态矩阵、伪代码、logical schema 或测试定义。见 §10.4。 |
| 12 | 是否为 `07` 的交付实现前整体审计提供足够输入? | `pass_with_affected_open`。§8~§14给出inventory、closure、precondition、模板和affected activation gates；最终审计只能在current正式`03/05/06/07`与全部boundary skeleton完成后执行，任何open gate都必须阻塞对应boundary。 |

## 5. 当前文档问题诊断与改动前后对比

| 主题 | 旧 Step 17 | 当前 Step 17 | 设计后果 |
|---|---|---|---|
| 输入审计 | 只声称读过 Step 05~16 | 逐项读取标准、正式 `00/01/02`、Step 01~16、L1 参考和本地现实 | 不把旧 README / `03~07` 当真相源 |
| 可实施 inventory | 只有 9 行摘要 | 按 layout、module、object、port、protocol、flow、state、persistence、error、idempotency、config、telemetry、test 展开 | `07` 可按实际设计面拆 boundary |
| 字段 / DTO | 只写 `pass` | 给出字段组、构造 surface、来源、缺失行为和唯一真相源 | 实现者不能自行补字段 |
| Query | 未逐项复核 | 14 Query 逐项复核 response / view / page / marker 与 no-write | 防止只定义返回类型名 |
| 状态 | 只写引用 Step 10 | 27 enum 逐项固定 variant、trigger owner 和测试入口 | 下游不能继续用旧口语状态 |
| phase boundary | 只写 pending | 明确本步不拆 boundary,并给 `07` dependency closure 和逐 boundary audit 输入 | pending 不会被误解为可直接实现 |
| 实施前置 | 未区分 design pass 与 implementation readiness | 分开上游 blocker、文档门禁、仓门禁、git / dependency / baseline 门禁 | 目标仓缺失不会阻塞设计,但会阻塞开工 |
| 下游文档 | 笼统说 Step 16 进入 `05/06` | 明确 `04~07` 均为 historical material,按顺序重建后才可移交 | 防止旧测试 / 验收 /计划抢占真相源 |
| 证据纪律 | 仅一句不得伪造 | 将 script、artifact、report、run、evidence、verdict、signoff 分层并设门禁 | 不把 planned contract 当执行结果 |

## 6. 设计取舍与实施红线

| 议题 | 采用方案 | 不采用方案 | 原因 |
|---|---|---|---|
| Step 17 粒度 | 全链路 inventory + 分组闭环 + 逐 public surface / state 审计 | 47 行索引摘要 | 当前 Step 06~16 已达到可落码粒度,交接不能压缩掉关键边界 |
| 真相源引用 | `07` 精确引用正式章节和 calibration 小节 | 在 `07` 复制 schema / flow / state | 避免两份定义漂移 |
| phase / commit | 留给 `07` 基于正式 `03/05/06` 拆分 | 在 Step 17 提前写 boundary | 本步没有当前轮测试和验收 gate,无法闭合 boundary |
| 产品绑定 | 保持 product-neutral adapter / typed config | 沿用 README 的 OTel / Grafana / TimescaleDB 等固定产品 | 产品不能反向成为业务 truth 或核心 schema owner |
| 数据边界 | observation-owned fact / audit projection / body-free linkage / marker / derived maintenance | raw log / metric / trace / audit / evidence body 或相邻域 truth | 本仓只拥有观测与审计投影事实 |
| 外部副作用 | durable snapshot / intent + stable token + exact binding + probe | 从 current truth / current config 重建并盲重试 | 防止重复发布、错投目标和副作用漂移 |
| Query | committed authorized read + explicit surface + zero write | inline refresh / repair / audit append | Query 不得反写任何 truth / projection / marker |
| 实现 readiness | 所有正式文档、boundary 审计和 implementation ledger 完成后才移交 | Step 17 pass 后立即编码 | Step 17 只是 `03 -> 07` 承接输入 |

实施期间不得跨越以下红线:

1. 不得新增 raw body 字段、provider response、secret、credential、endpoint、topic、path、真实 evidence alias、final verdict 或 signoff 到 public / domain / persistence / telemetry surface。
2. 不得让 Observability 写 Governance、Artifact、Identity、Runtime、Sandbox、Archive、Bus、Console、dashboard、external audit 或 GRC truth。
3. 不得让 `api` / `worker` / `jobs` 直接访问 repository、UoW、resolver、publisher 或 delivery adapter。
4. 不得让 publisher / handoff / export 从 current truth 或 current route 重建已提交 material。
5. 不得让 Query、diagnostic、rebuild、replay、handoff、export 或 retention flow 修 source truth。
6. 不得把 telemetry、report、script exit code、job outcome 或 delivery receipt当成验收结论。
7. 不得把 reserved transition / future protocol 混入当前 boundary。

## 7. 实施承接关系图

```text
[Current formal 00 / 01 / 02]
             |
             v
[03 Step 01~04: scope / constraints / layout]
             |
             v
[03 Step 05~10: module / object / port / protocol / flow / state]
             |
             v
[03 Step 11~16: persistence / error / idempotency / config / telemetry / test cuts]
             |
             v
[Step 17: inventory + closure + preconditions + 07 audit input]
             |
             v
[Step 18: risks and open questions]
             |
             v
[Step 19: assemble current formal 03]
             |
             v
[Current-round 04 -> 05 -> 06 -> 07]
             |
             v
[07 creates implementation ledger + all planned boundary skeletons]
             |
             v
[07 audits formal 03 / 05 / 06 / 07 per phase and commit boundary]
             |
       pass only,baseline fixed
             v
[Implementation agent may start the current boundary]
```

任一箭头前的门禁未通过,不得跳到下一层。尤其不能从本 Step 17 直接跳到实现。

## 8. 可实施契约 inventory

### 8.1 Step 01~16 承接总表

| Step | 已闭合契约 | `07` 如何使用 | 不得重写 / 越权 |
|---|---|---|---|
| Step 01 | 当前正式 `00/01/02` 输入边界、旧材料降级纪律 | 固定 design baseline 和冲突优先级 | 不恢复 README / 旧 `03` 主线 |
| Step 02 | 本轮目标、七模块覆盖、P0 / 非范围 | 界定实施范围和明确排除 | 不把产品 dashboard / alert / raw telemetry body 当 P0 truth |
| Step 03 | Rust、源码语言、git / commit、依赖裁剪、目标仓 gate | 写全局实施前置和依赖门禁 | 不新增非 `core-contracts` sibling path dependency |
| Step 04 | 七 workspace member、package / crate / binary、文件树与职责 | 定义仓初始化和文件级交付物 | 不按十个业务组成部分或产品拆 crate |
| Step 05 | 七模块职责、十个组成部分映射、allowed / forbidden dependency | 定义 module delivery order 和 crate gate | 不改变依赖方向或增加 `shared/common/utils` 桶 |
| Step 06 | public secondary type、domain / application / entry object、字段、factory、method、state owner；含schema/source/producer finite type、14 Query enum与report/peripheral consumer typed refs | 当前 boundary 涉及对象时精确引用对象卡片 | 不由实现者补字段、variant、wire token、默认值、状态或 raw body carrier |
| Step 07 | service façade、repository、projection、resolver、publisher、delivery、UoW、idempotency、runtime port；R2 infra-entry registrar与finite handler catalog | 当前 boundary 引用 exact callable surface、registration totality和fake / durable parity | adapter 不得改签名或绕过 application；registrar不得扩成business port或locator service |
| Step 08 | 16 Command、14 Query、9 Consumer、12 Outbound Event、9 Job 及 shared DTO | protocol boundary 引用 exact request / response / event / report schema | 不复制成第二套 DTO;public contract 不依赖 domain-only type |
| Step 09 | shared templates 与逐接口函数 flow、事务和 side-effect 顺序 | 定义代码编写顺序和 boundary 内纵切 | 不改 UoW / idempotency / outbox / external-call 顺序 |
| Step 10 | 27 正式状态机、非法 / terminal / reserved transition | state implementation / test / acceptance 使用唯一名称 | 不实现 reserved transition,不把 one-shot outcome 当 lifecycle |
| Step 11 | ownership、logical store、repository semantics、version / cursor、transaction、consistency / recovery | persistence boundary 与 integration gate | 不把 logical store 名误解为固定产品 DDL,不以 telemetry 替代 consistency |
| Step 12 | error layers、public mapping、abnormal branch、retry / manual / quarantine / dead-letter | error surface 与 failure-injection gate | 不用 message text / generic string 猜分类 |
| Step 13 | actor-scoped idempotency、stable digest、source version、plan / claim / fence、token / probe | concurrency / retry / recovery boundary | 不盲重试、不换 key / token / binding、不重列 immutable plan |
| Step 14 | typed config、runtime builder、adapter capability、exact external binding、startup failure；raw binding -> safe item -> prebuilt registrar -> opaque handle | config / assembly / adapter / entry-registration boundary | 配置不改变 truth、state、DTO、idempotency 或 no-write；locator/material不进入entry |
| Step 15 | log / metric / trace / durable audit 分层、allowlist、redaction、recursion guard | telemetry / audit instrumentation boundary | telemetry 不是 truth / result / acceptance / retry authority |
| Step 16 | 七模块、60 protocol、27 state + plan item、consistency / idempotency / config / telemetry test cut、5 planned scripts | `05` 展开用例,`07` 嵌入 boundary gate | 不声称脚本、test、artifact、report 或 evidence 已存在 / 通过 |

### 8.2 Workspace 与模块 inventory

| 模块 | 路径 / package / crate | 实施责任 | 必须依赖闭包 | 禁止行为 |
|---|---|---|---|---|
| `contracts` | `crates/contracts`;`observability-contracts`;`observability_contracts` | typed refs、metadata、DTO、view、event、job、receipt、public error | `core-contracts` | 依赖 domain / application / infra;承载 raw body |
| `domain` | `crates/domain`;`observability-domain`;`observability_domain` | observation-owned state、policy、history / record formation | contracts + core | 读取 config / repository / adapter / source service |
| `application` | `crates/application`;`observability-application`;`observability_application` | service、port、UoW、idempotency、flow orchestration | domain + contracts + core | 依赖 infra 或产品 adapter |
| `infra` | `crates/infra`;`observability-infra`;`observability_infra` | repositories、stores、resolvers、publisher / delivery、config、runtime builder、technical registrar type/implementation | application + domain + contracts + core | 定义新业务 policy、改变application port、依赖entry crate或暴露locator/private registry |
| `api` | `crates/api`;`observability-api`;`observability_api` | 同步 Command / Query mapping | application + infra + contracts + core | 直接访问 repository / UoW |
| `worker` | `crates/worker`;`observability-worker`;`observability_worker` | inbound consumer、publication / maintenance loop entry、9项handler implementation/catalog construction、opaque registered-set ownership | application + infra + contracts + core | 直接调用 resolver / publisher / DB；读取transport/policy locator或构造adapter |
| `jobs` | `crates/jobs`;`observability-jobs`;`observability_jobs` | one-shot operation job entry / report mapping、9项handler implementation/catalog construction、opaque scheduled-set ownership | application + infra + contracts + core | 生成 signoff / real run / evidence alias；读取schedule locator或补造Job request |

十个业务组成部分继续作为跨模块 capability 主语,不转换为十个 crate: intake/safety、correlation/safe signal、audit/evidence、handoff/authenticity、retention/replay/no-write、read/diagnostic、gap/degraded、peripheral/export、product-neutral adapter/reference、derived maintenance/replay coordination。

### 8.3 对象族 inventory

| 对象族 | 正式对象 / carrier | 唯一 owner | 实施用途 | 边界 |
|---|---|---|---|---|
| public identity / digest / cursor | `BodyFreeRef`,typed ref family（含`ReportConsumerRef` / `PeripheralConsumerRef`）,`SchemaVersion`,`SourceFamilyKind`,`ObservationProducerFamily`,`RequestDigest`,`DigestSummary`,`ObservationCursor`,`ReferenceCursor`,`ObservationCommittedCursor` | contracts | DTO、repository key、protocol decode、Consumer route、idempotency、outbox、projection | typed ref不退化裸string；family不隐式互转；schema != digest/store/source version；cursor != version != page token |
| intake / safety | `ObservationReceipt`,`SafetyDisposition`,`IntakeDecisionRecord` | domain | admission 和 redaction-first | 不保存输入正文 |
| correlation / signal | `CorrelationContext`,`SafeSignal`,`SignalRollupWindow`,`CorrelationLinkRecord` | domain | safe observation fact 与派生 rollup | 不拥有 runtime truth,不保存 raw log / metric / trace |
| audit / evidence | `AuditProjection`,`EvidenceLinkage`,`AuditAppendRecord` | domain | append-only audit projection 与 body-free linkage | 不拥有 source audit / Governance / Artifact truth |
| handoff / authenticity | `EvidenceIndexInputView`,`ReportHandoffRecord`,`AuthenticityHint`,`HandoffLifecycleRecord` | contracts + domain | immutable handoff input、readiness、delivery marker | Delivered != verdict/signoff;不生成真实 alias |
| retention / replay / no-write | `RetentionMarker`,`ActiveReferenceProtection`,`ReplayScope`,`NoWriteViolation` | domain | hold / protection / observation-side replay guard | 不删除 / 修复 source truth |
| gap / degraded / read | `GapState`,`DegradedOutputState`,`ReadVisibilityState`,`DiagnosticScope`,`DiagnosticSummary` | domain | explicit missing/not-visible/stale/blocked semantics | Query 只读;不补造 success |
| reference / maintenance | `ReferenceSnapshotState`,`ProjectionMaintenanceState`,`ReplayCoordinationState`,`RollupRebuildState` | domain | body-free snapshot 与派生维护进度 | Resolved / Fresh 只表示本地 snapshot / projection |
| peripheral / export | `ExternalAuditExportPreparation`,`PeripheralDeliveryState` | domain | body-free preparation / delivery marker | 不拥有外部审计 / GRC / dashboard truth |
| idempotency / outbox / job | `ObservationIdempotencyReservation`,`StoredObservationResult`,`ObservationOutboxRecord`,`ObservationJobExecutionPlan`,`ObservationExecutionClaim`,`ObservationJobReportDraft` | application + domain carrier | replay、stored snapshot、staged execution | terminal replay不重跑;outbox不重建payload |
| runtime / entry | `AdapterAvailabilityState`,`BuiltObservabilityRuntime`,`ValidatedInboundConsumerRegistration`,`ValidatedJobScheduleRegistration`,`InboundConsumerRegistrar`,`JobScheduleRegistrar`,finite handler catalog,opaque registered sets | application + infra + entry | assembly、pre-exposure registration和runtime routing | availability/registration不改变domain truth；safe item/registrar无locator/material getter |

### 8.4 Trait / Port / Adapter inventory

| 契约组 | application-owned surface | infra responsibility | 当前 boundary 使用规则 |
|---|---|---|---|
| service façade | `ObservationTruthWriteService`,`ObservationReadService`,`ObservationInboundEventService`,`ObservationMaintenanceService`,`ObservationPublicationService` | runtime builder 注入实现依赖 | entry 只能调用 façade |
| transaction / identity | `ObservationUnitOfWorkManager`,Clock,ID generators,operation context factory | durable / deterministic fake implementation | accepted write 使用 UoW;Query 不 begin write UoW |
| truth / state repository | intake,correlation/signal,audit/evidence,handoff,retention/gap,reference/maintenance/peripheral repositories | versioned / append-only adapter | existing update 必须使用 loaded expected version |
| projection | `ObservationProjectionStore`,source reader,dependency / lookup helpers | complete capture + read fence + atomic replacement | Query 只读;rebuild item 才 replace |
| idempotency / result | reservation + stored result repositories | atomic reserve outcome + exact replay | result-before-complete;different digest conflict |
| job execution | plan / report / claim / fence repository | immutable plan、global work claim、monotonic fence | resume不重新list / resolve / bind current config |
| outbox / publication | outbox repository + `ObservationEventPublisher` | immutable snapshot store + exact binding publisher | publish only stored snapshot / stable token |
| body-free resolver | identity/governance/artifact/runtime/sandbox/archive safe summary resolver ports | product-neutral adapters / fakes | output只能是 ref / summary / digest / visibility / freshness |
| handoff / export | preparation / delivery / probe ports | exact binding adapter + probe | intent-before-call;Unknown/Unsupported fail closed |
| availability | `AdapterAvailabilityProbe` | exact-scope safe snapshot | health不等 operation success |
| entry registration technical seam | no application-owned surface；Step 07 R2 infra-owned registrar/handler type | pre-resolve private transport/actor-policy/scheduler；project safe metadata；all-or-nothing register/revoke | worker/jobs只实现finite handler并持有opaque handle；不得lookup locator/adapter或形成business port |

### 8.5 Public protocol inventory

| 族 | 数量 | 正式名称 | 实施闭口点 |
|---|---:|---|---|
| Command | 16 | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`BindCorrelationContext`;`RecordSafeSignal`;`AppendAuditProjection`;`LinkBodyFreeEvidence`;`PrepareReportHandoff`;`EvaluateAuthenticityHint`;`SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation`;`RecordGapState`;`PrepareExternalAuditExport`;`RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState` | request / response schema、actor/idempotency/digest、target object、accepted UoW、outbox / stored result |
| Query | 14 | `GetObservationReceipt`;`GetIntakeStatus`;`GetSafeSignal`;`GetSignalRollup`;`GetAuditTimeline`;`GetEvidenceIndexInput`;`GetReportHandoff`;`GetRetentionProtection`;`GetObservationReadModel`;`GetDiagnosticView`;`GetGapStatus`;`GetPeripheralExportView`;`GetReferenceSnapshotView`;`GetRebuildProgress` | request、view/page/surface、identity、visibility/freshness/degraded、zero-write |
| Inbound Consumer | 9 | `ConsumeBusObservationMaterial`;`ConsumeSourceAuditMaterial`;`ConsumeIdentityObservationContext`;`ConsumeGovernanceAuditContext`;`ConsumeArtifactEvidenceContext`;`ConsumeRuntimeSignalSummary`;`ConsumeSandboxSignalSummary`;`ConsumeArchiveHandoffFeedback`;`ConsumeReportConsumerFeedback` | envelope、source version、dedup、body-free mapping、receipt、quarantine/dead-letter |
| Outbound Event | 12 | `ObservationReceiptChanged`;`SafetyDispositionChanged`;`SafeSignalRecorded`;`AuditProjectionAppended`;`EvidenceLinkageChanged`;`ReportHandoffChanged`;`RetentionMarkerChanged`;`NoWriteViolationRecorded`;`GapStateChanged`;`ReferenceSnapshotChanged`;`DerivedProjectionChanged`;`PeripheralDeliveryChanged` | accepted transaction snapshot、event kind/schema/binding/payload digest、publisher no-rebuild |
| Operations Job | 9 | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups`;`RefreshReferenceSnapshots`;`ScanObservationGaps`;`CoordinateObservationReplay`;`PrepareReportHandoffDelivery`;`PrepareExternalAuditExport`;`RebuildPeripheralViews` | job metadata、immutable plan/config、item claim/fence、stored report、duplicate replay |

### 8.6 Flow 与状态 inventory

| 设计面 | 已闭口内容 | 实施使用方式 |
|---|---|---|
| Command flow | 16 个 exact flow + shared accepted transaction template | 依次 validate -> context/reserve -> load/resolve -> domain -> history/outbox/stale/result -> complete -> commit |
| Query flow | 14 个 authorized read-only flow | visibility decision -> committed read -> view/surface mapping;write spy 必须为零 |
| Consumer flow | 9 个 exact branch + dedup / source-version guard | unsupported / duplicate / older / delayed / quarantine / accepted 各自闭口 |
| Outbound flow | 12 payload source mapping + one publication flow | accepted UoW 保存 exact snapshot;worker 只发布 snapshot |
| Job flow | 9 个 start / item / finalize flow | immutable plan、short UoW、claim/fence、structured item outcome、terminal report |
| 状态机 | 27 个正式 lifecycle / state owner | enum、factory、transition、illegal / terminal / reserved、side effect、test 使用同名 |
| 技术 item state | `ObservationJobPlanItemState` | 不计入 27 domain/persistent state owners,但按 claim/fence 与 plan CAS 实施 |

### 8.7 横切实现 inventory

| 横切面 | 已定义位置 | 可实施结论 | 不得替代 |
|---|---|---|---|
| persistence / transaction | Step 11 | logical store、key/index/version/cursor、accepted / publisher / staged job / external transaction ordering可直接映射到 adapter | 不锁定物理产品;log不能替代 transaction |
| error / recovery | Step 12 | typed layers、public mapping、rollback、retry、quarantine、dead-letter、manual recovery可落码 | 不以字符串或 telemetry 猜错误 |
| concurrency / idempotency | Step 13 | operation + actor + key、canonical digest、source version、plan / claim / fence、token / probe可落码 | 不用business key / work key互相替代 |
| config / external binding | Step 14 | validated typed config、runtime assembly、exact historical binding、five token families、entry-safe registrar可落码 | 不把 endpoint / credential / transport-policy-schedule locator暴露给application或entry |
| log / metric / trace / audit | Step 15 | channel ownership、allowlist、low-cardinality、redaction、recursion guard和60 surface coverage可落码 | runtime telemetry不成为durable truth |
| tests | Step 16 | module / protocol / state / consistency / concurrency / config / telemetry切口和planned script contract可交给 `05/07` | 不声称已运行 / 通过 |

## 9. 实施承接清单

### 9.1 主承接清单

| 承接项 | 已定义位置 | 实施者如何使用 | 开工前必须能回答 | 缺口处理 |
|---|---|---|---|---|
| 上游 truth / ownership | 正式 `00` §2 / §10 / §11;正式 `01` §4 / §9;Step 01 / 02 | 判断当前改动是否只写 observation-owned fact、projection、marker、history 或 technical state | 这个字段 / write target 的 owner 是谁? | owner 不明立即暂停并回设计 |
| P0 / 非范围 | Step 02 §8 | 确认当前 boundary 的 capability 属于本轮且不自然膨胀 | 是否引入 raw body、业务 remediation、产品 dashboard truth 或 source cleanup? | 越界项移出当前实施 |
| Rust / repository / dependency | Step 03 §7;Step 04 §7 | 初始化 workspace、Cargo、source language 和依赖 | 是否只有 `core-contracts` sibling path dependency? | 依赖不符不得开工 |
| 模块与文件 owner | Step 04 §7;Step 05 §7 | 将每个 type / trait / adapter / handler 放到唯一 crate / file owner | 该类型为什么属于此 crate? | 回查 owner,不得放 `common/utils` |
| public / domain object | Step 06 §7 | 逐字段实现 struct / enum / factory / method / invariant | 每个 required field 从哪个 DTO / lookup / generator / policy 来? | 不得加默认值或 placeholder |
| application ports | Step 07 §7~§12 | 实现 exact trait 或 adapter,保持 callable signature | 谁定义 port,谁实现,谁能调用? | adapter 不得自行扩签名 |
| public protocol | Step 08 §7.4~§7.9 | 逐 DTO / event / job schema 实现 contracts 和 entry mapping | 外层 envelope、payload、result / view / receipt / report 是否齐全? | 回写设计,不创建私有替代 DTO |
| function flow | Step 09 §7~§13 | 按 exact order 实现 service 与 side effect | reserve、load、domain、save、outbox、result、commit 顺序是什么? | 不得以“等价重排”绕过事务契约 |
| state machine | Step 10 §9~§15 | 实现 enum、factory、transition guard、terminal / reserved rejection | 当前 transition 是否有正式 trigger surface? | 无 trigger 即不得实现 |
| persistence / consistency | Step 11 §8~§19 | 实现 repository key、version、cursor、UoW、logical store 和 recovery | write set 是否在同一 UoW? expected version 来自哪里? | 不能靠 log / compensating source write修复 |
| error / recovery | Step 12 §8~§24 | 实现 typed internal / public / entry mapping 和恢复分类 | 当前失败是 reject、conflict、retry、quarantine、dead-letter、manual 还是 degraded? | 不得用 message text 猜分支 |
| concurrency / idempotency | Step 13 §8~§26 | 实现 atomic reserve、digest、source order、plan / claim / fence、probe | duplicate / in-flight / commit unknown 会不会重跑副作用? | 不能换 key / token / binding 重试 |
| config / runtime / registration | Step 07 R2 §12.4；Step 14 §9.4 / §17~§19 | 实现 validated config、runtime assembly、safe catalog、exact binding、prebuilt registrar和group registration | raw locator是否只在infra；safe item/private slot/handler是否exact total；失败是否zero active root? | config不能放宽invariant；不得让entry按ref查registry或first-call补binding |
| telemetry / native audit | Step 15 §7~§18 | 按 channel owner 和 allowlist 埋点,保持 redaction / recursion guard | 该事实应进 runtime telemetry 还是 durable audit? | telemetry 不得当 durable result |
| test cut / script contract | Step 16 §7~§20 | 将当前 boundary 映射到 `05` 用例和 `07` gate | positive、abnormal、state、consistency、safety cut 都在哪里? | 未重建 `05/06/07` 前不声称可验收 |

### 9.2 Accepted side-effect 承接清单

| Flow family | 允许写入 | 必须同一 UoW / 固定顺序 | 外围副作用 | 明确禁止 |
|---|---|---|---|---|
| 16 Command | owned state / marker、history、cursor、outbox snapshot、stored result、reservation complete | Step 09 shared command template + Step 11 accepted ordering | commit 后由 worker 发布 | source truth write、raw body save、telemetry决定commit |
| 9 Consumer | local receipt / snapshot / projection input / gap / history、outbox、stored receipt | envelope/dedup/source-version guard先于mutation | ack / retry / dead-letter在entry映射 | 复制外部正文、改上游truth、older event回退state |
| 14 Query | none | committed authorized reads only | response mapping | reservation、read audit append、refresh、repair、stale mark、outbox |
| 12 Outbound Event append | accepted mutation内 exact payload snapshot | state/history/cursor/snapshot/result原子提交 | publication独立执行 | publish时读current truth重组payload |
| Outbox publication | publication marker、item outcome、job report | stable token + current claim/fence + expected version | exact historical binding call | 回滚原truth、换binding、`Failed -> Pending` |
| Derived / reference Jobs | plan/report、projection/reference/gap/maintenance/progress | start / item / finalize短UoW;item fence | resolver可在事务外调用,结果在新UoW分类 | 长事务、source repair、从current config改plan |
| Handoff / export Jobs | intent、local preparation/delivery marker、report、outbox | intent-before-call;probe-before-ambiguous retry;finalize-only | exact handoff/export adapter | verdict、signoff、真实alias、blind redelivery |

### 9.3 Evidence、report 与 script 承接

| 交付面 | Step 17 可交付的内容 | 后续文档必须继续定义 | 当前明确不存在 |
|---|---|---|---|
| test identifiers | Step 13 / 16 的 canonical `TC-OBS-*` 切口 | `05` 的 suite、fixture、environment、priority、automation、artifact mapping | test run / pass result |
| script command | 5 个 planned path、参数、输入输出和失败语义 | `05/06/07` 的 exact invocation、artifact schema、gate / acceptance mapping | script file / exit result |
| artifact root | `artifacts/test/<run_id>` shape contract | run creation、schema、retention、producer | real `<run_id>` / artifact |
| report root | `reports/runs/<run_id>` shape contract | report pages、index、redaction check、review flow | real report / evidence alias |
| handoff report | body-free draft / report ref / changed / failed / gap refs | delivery adapter、human / Agent review和下游 acceptance mapping | final verdict / signoff |
| acceptance evidence | 只提供未来映射入口 | 当前轮 `06` 定义 AC / VETO / EV contract,`07` 绑定 boundary | 验收结论、签署、真实 EV alias |

### 9.4 Planned script inventory

| Planned path | 当前契约 | `07` 应如何引用 | 禁止声明 |
|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | `--run-id` / `--artifact-root` / `--config-profile`;任一 required check 失败则非 0 | 在实际交付该脚本的 boundary 和后续使用它的 gate 分别引用 | 当前已存在 / 已通过 |
| `scripts/reports/generate_reports.sh` | 从真实 artifact 生成 `reports/runs/<run_id>`;缺失输入失败 | 必须依赖 artifact producer boundary | 可从模板补默认 success |
| `scripts/checks/check_redaction.sh` | 扫 raw body / secret / credential / route / provider material 和 hash escape | safety gate 必须映射 Step 15 / 16 | 已有 redaction evidence |
| `scripts/checks/check_metric_labels.sh` | 扫 metric allowlist、低基数 label 和敏感字段 | telemetry boundary 与 CI gate 引用 | 指标已采集或 checker 已运行 |
| `scripts/checks/check_dependency_boundary.sh` | 扫 workspace、依赖方向和非 core sibling path dependency | workspace / dependency boundary 后运行 | Cargo metadata 当前存在 |

## 10. 实施前置阅读清单与引用规则

### 10.1 全局必读材料

| 文档 | 路径 | 阅读目的 | 未读风险 | 可审查确认方式 |
|---|---|---|---|---|
| 当前轮需求 | `projects/L4-observability/00-需求文档.md` | 说明能力、规则、数据归属、接口和验收方向 | 把观测基础设施写成业务 truth owner | 能指出当前 boundary 对应 FR / BR / DR / AC 方向 |
| 当前轮架构 | `projects/L4-observability/01-架构设计.md` | 说明职责、依赖、通信、ownership 和产品中立 | 引入反向依赖 / 产品主线 | 能说明当前 writer、source owner 和 forbidden dependency |
| 当前轮概要 | `projects/L4-observability/02-概要设计.md` | 说明七模块、十组成部分、interface / flow / state skeleton | 按旧 README 或产品拆模块 | 能回指当前 capability 的 code subject |
| 正式详细设计 | Step 19 后的 `projects/L4-observability/03-详细设计.md` | 作为下游设计和实施计划的正式输入 | 使用当前磁盘 4990 行 pre-M2 装配稿并忽略其 stale completion | 能回指 current 正式章节、calibration source 与 affected gate |
| 配置设计 | 当前轮完成后的 `04-配置设计.md` | 读取 config key / source / profile / validation / activation | 实现端私定配置面 | 能说明当前 binding 的 typed config owner |
| 测试方案 | 当前轮完成后的 `05-测试方案.md` | 读取 suite、fixture、environment、automation、artifact | 把 Step 16 cut 当测试结果 | 能指出当前 boundary 对应 TC / command / artifact |
| 验收标准 | 当前轮完成后的 `06-验收标准.md` | 读取 AC / VETO、证据与放行规则 | 自行解释“通过” | 能指出当前 boundary 的 veto 和 evidence requirement |
| 实施计划 | 当前轮完成后的 `07-实施计划.md` | 读取 phase / task / commit boundary、门禁和暂停规则 | 越过 boundary 或提交时机 | 能说明 current boundary、predecessor、gate 和 next action |
| 当前 implementation ledger | `projects/L4-observability/design-calibration/implementation_execution_ledger.md` | 恢复项目实现状态、baseline、current boundary | 从过期上下文继续 | 路径存在且 current gate 与 `07` 一致 |
| 当前 boundary skeleton | `projects/L4-observability/design-calibration/implementation-boundaries/<boundary_id>.md` | 读取当前 boundary 文件 / 测试 /证据 / commit 边界 | 实现范围扩散 | boundary id 与 ledger / `07` 一致 |

### 10.2 规范与工程纪律必读

| 文档 | 阅读目的 | 当前固定结论 |
|---|---|---|
| `standards/coding/rust.md` | Rust code、rustdoc、error、test style | 标识符、rustdoc、普通注释、错误说明、测试名默认英文;public item / enum variant有文档 |
| `standards/document/子项目目录与代码文件组织规范.md` | workspace / package / crate / file owner | 实现仓 `quantalithos-observability`;成员 `crates/<role>`;代码命名不含 `L4` |
| `standards/document/全局项目依赖关系与裁剪规则.md` | compile-time / runtime / event dependency | sibling compile-time only `core-contracts`;其他关系走 port / event / adapter |
| `standards/document/设计真相源闭环与可落码性标准.md` | boundary 开工前字段 / DTO / state / phase / evidence audit | 实现者只二次校验,不现场补设计 |
| `standards/document/代码实施台账与门禁规范.md` | project / boundary ledger | current-round `07` 完成时创建全部 planned skeleton |
| `standards/document/实施计划书写规范.md` §4.6~§4.9 | boundary、gate、commit 和 message | 每个 boundary gate 通过后才 commit;实现仓使用英文 message |
| `projects/README.md` §1.1 / §8.2 | design repo / implementation repo 和 project commit discipline | 不在设计仓实现代码;目标仓现场核实 git identity |

### 10.3 关注面阅读矩阵输入

此表是未来 `07` 按 phase / commit boundary 生成阅读矩阵的输入,不是当前 phase 划分。

| 当前 boundary 涉及面 | 必读正式章节 | 必读 calibration | 读取目的 | 可验证开工门禁 |
|---|---|---|---|---|
| workspace / Cargo | `03` §3 / §4 | Step 03 / 04 / 05 | package、crate、dependency、file owner | 能列出 allowed / forbidden Cargo edge |
| public ref / object | `03` §5 / §6 | Step 06 | field、factory、invariant、state owner | required field source 全部可指认 |
| application port / adapter | `03` §5 / §6 | Step 07 | callable signature、owner、fake parity | adapter 不需要补参数 / 返回类型 |
| Command | `03` §7 / §8 / §10~§12 | Step 06~13 对应小节 | DTO -> object -> UoW -> result / outbox | positive / reject / duplicate / conflict 均闭合 |
| Query | `03` §7 / §8 / §10 / §14 / §15 | Step 07~10 / 15 / 16 | view / page / marker、visibility、freshness、no-write | write spy target 集合明确且预期为零 |
| Inbound Consumer | `03` §7 / §8 / §10~§12 | Step 08 / 09 / 11~13 | envelope、dedup、source order、receipt / dead-letter | older / duplicate / unsupported分支明确 |
| Outbound / publisher | `03` §7 / §8 / §10~§13 | Step 07~14 | stored snapshot、outbox、stable token / binding / probe | 不读 current truth / route |
| Staged Job | `03` §7~§13 | Step 06~14 | plan、config snapshot、claim/fence、item / finalize / replay | boundary 包含当前 job 的最小 public surface和technical closure |
| persistence / projection | `03` §10 | Step 07 / 09~13 | logical key、version、cursor、source fence、replace | expected version / cursor source明确 |
| config / runtime | `03` §13;`04` 对应章节 | Step 14 | typed source、validation、assembly、binding lifecycle | required adapter capability可判定 |
| telemetry / audit | `03` §14 | Step 15 | channel、field allowlist、redaction、recursion | 每个 signal owner和failure semantics明确 |
| tests / scripts | `03` §15;`05/06` 对应章节 | Step 13 / 16 | test cut、fixture / artifact / evidence / gate | 当前 boundary 有可执行命令和真实产物路径 |

### 10.4 `07` 引用规则

| 规则 | 正确写法 | 禁止写法 |
|---|---|---|
| object / field | “实现 `ObservationReceipt`,字段与 factory 见正式 `03` §5 / Step 06 `ObservationReceipt`” | 在 `07` 重写一份字段表 |
| port | “adapter 实现 Step 07 `ObservationIntakeRepository` exact surface” | 用“实现 repository”省略签名和 version 语义 |
| protocol | “承接 Step 08 `SubmitObservationMaterialRequest/Response`” | 新建 boundary-local DTO 或改字段名 |
| flow | “按 Step 09 `SubmitObservationMaterialFlow` 顺序” | 在实施计划改成另一套 UoW / outbox 顺序 |
| state | “使用 Step 10 `ObservationReceiptState` variants” | 用 `processed/success/done` 等口语状态 |
| persistence | “按 Step 11 logical contract 映射物理 schema” | 把 logical store 名当已选数据库 / DDL |
| error / idempotency | 精确引用 Step 12 / 13 error class 与 recovery / replay | 写“失败重试三次”覆盖 typed policy |
| config | 引用 Step 14 typed section / binding,具体 key 由当前 `04` 给出 | config 改 DTO / truth / state |
| tests / acceptance | 引用当前 `05` TC、命令、artifact 和当前 `06` AC / VETO | 把 Step 16 cut 写成“测试已通过” |

### 10.5 冲突处理规则

| 冲突 | 处理 |
|---|---|
| README vs 当前正式 `00/01/02` | README 作为 historical material;以当前正式链为准 |
| 旧正式 `03~07` vs current calibration | 在对应正式文档重新装配前,以 current calibration 为校准真相;不得实施 |
| 正式 `03` vs calibration | 暂停;回到 Step 19 修正并重新检查,不能由实现者选一份 |
| `03` vs `05/06/07` | 暂停受影响 boundary;回写设计链并固定新 baseline |
| design vs target repo reality | 实现者只报告精确 file / type / dependency mismatch;设计者决定修文档或 boundary |
| current boundary vs future boundary | 当前 boundary 必须依赖闭包;不能提前调用 future type / result / evidence |
| standard vs project-specific old material | 当前标准优先;历史内容只能登记,不能降低门禁 |

## 11. Implementation Preconditions

### 11.1 当前前置状态

| 前置项 | 当前检查结果 | 对 Step 17 的影响 | 对实现开工的影响 |
|---|---|---|---|
| 当前正式 `00/01/02` | 已完成本轮正式装配 | 可继续 | 满足上游输入之一 |
| Step 01~16 | 均有设计记录；Step 09~16 为 `completed_design_record_with_affected_open` | 可形成承接输入 | 尚需逐 boundary 消费 affected gate 并完成正式 `03` 装配 |
| Step 17 | 本文件完成 | 可停审 | 不是 implementation-ready 结论 |
| Step 18 | 未开始 | 不阻塞本 Step 完成 | 未关闭前不能装配正式 `03` |
| Step 19 / 正式 `03` | 未开始;当前磁盘文件为 historical material | 不阻塞本 Step | blocker |
| 当前轮 `04` | 未开始;旧文件 historical | 不阻塞本 Step | config boundary blocker |
| 当前轮 `05` | 未开始;旧文件 historical | 不阻塞本 Step | test / artifact gate blocker |
| 当前轮 `06` | 未开始;旧文件 historical | 不阻塞本 Step | acceptance / veto blocker |
| 当前轮 `07` | 未开始;旧文件 historical | 不阻塞本 Step | phase / boundary / ledger blocker |
| 目标仓 `/home/aris/Projects/quantalithos-observability` | 当前未发现 | 不属于上游设计 blocker | implementation kickoff blocker |
| 目标仓 git identity | 无仓可核实;当前只核实 design 仓为 `quantalithos-labs` / `quantalithos.ai@gmail.com` | 不影响设计 | 必须在目标仓现场核实 |
| target Cargo workspace / core path | 尚不存在可检查 workspace;core contracts 已核实 | 设计可固定期望 | 初始化 / 开工 boundary 必须验证 |
| implementation ledger / boundary skeleton | 旧材料不得使用;当前版本尚未创建 | 符合本 Step 边界 | `07` 完成时必须同时创建 |
| real design baseline | 本 Step 不伪造 commit/hash | 不影响停审 | `07` 最终移交前必须记录真实 baseline |
| tests / scripts / artifacts / evidence | 均未实现或运行 | 符合设计阶段 | boundary gate 必须产生真实结果 |

### 11.2 实现开工硬门禁

以下条件全部满足前,不得把项目交给实现 agent:

1. Step 18 已关闭本轮风险与待确认项。
2. Step 19 已按 Step 01~18 全量装配正式 `03-详细设计.md`,且 cross-reference / naming / fence 检查通过。
3. `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 已按当前轮 SOP 逐 Step 重建。
4. `07` 已定义全部 phase / commit boundary,且每个 boundary 形成 dependency closure、test / acceptance gate 和 rollback / pause rule。
5. `07` 已创建 current `implementation_execution_ledger.md` 和全部 planned `implementation-boundaries/<boundary_id>.md` skeleton。
6. `07` 已按每个 phase / commit boundary 对正式 `03/05/06/07` 完成交付实现前整体可落码闭环审计,所有 blocker 关闭。
7. 目标实现仓已确认或由明确的初始化 boundary 创建,workspace、edition、rust-version、crate names 与 `core-contracts` path 可核实。
8. 目标仓项目级 git identity 已现场核实,不得从 design 仓配置推断。
9. 使用真实 design baseline;如要求 commit hash,只能记录实际存在的 hash,不能用占位符冒充。

### 11.3 Git、源码与提交前置

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| target `user.name` | `quantalithos-labs` | 在目标仓修正后再允许 commit |
| target `user.email` | `quantalithos.ai@gmail.com` | 在目标仓修正后再允许 commit |
| commit language | 实现仓 title / body 使用英文 | 不合规 message 不提交 |
| commit title | `<type>(<scope>): <subject>` | 按 `07` boundary 重写 |
| commit body | 一句 boundary summary + 按子功能列文件及大致改动量 | 不用空泛 summary |
| AI footer | 实际由 Codex 参与时 `Co-Authored-By: Codex <noreply@openai.com>`;前置真实空行 | 不伪造其他参与者 |
| source language | identifier、rustdoc、普通注释、error text explanation、test name 默认英文 | review 前修正 |
| commit timing | current boundary 的 required gate 真实通过后 | 未通过不提交半成品 |

本 Step 当前不需要提交。用户未要求 commit,且项目尚处设计 Step 17 停审点。

## 12. 跨文档一致性复核

### 12.1 真相源表

| 设计事实 | 当前唯一真相源 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 仓定位与业务边界 | 当前正式 `00` | §2 / §4 / §9~§14 | `01~07` / implementation | 与 README 冲突时 README 降级 |
| 架构职责、依赖与 ownership | 当前正式 `01` | §4~§10 / §13 | `02~07` / Cargo / runtime | 相邻仓存在不等于可编译依赖 |
| 七模块、十组成部分、接口 / flow / state skeleton | 当前正式 `02` | §4~§12 | current `03` | 详细设计只能展开,不能改主轴 |
| 上游承接与范围 | Step 01 / 02 | `03_ddd_step_01*`;`03_ddd_step_02*` | formal `03` / `07` | 范围扩大必须回到设计 |
| Rust、仓、依赖、命名 | Step 03 / 04 | constraints / file layout | target workspace / `07` | target reality 不符则暂停并回写 |
| 模块职责与依赖方向 | Step 05 | module contracts | Cargo / crate review | 不允许反向依赖和公共杂物桶 |
| public / domain / application object schema | Step 06 | object contracts §7 | contracts / domain / application / tests | 缺字段回 Step 06,实现不得私补 |
| callable port / repository / adapter | Step 07 | trait / port / adapter contracts §7~§13 | application / infra / entries | adapter 不得改写 port |
| public protocol schema | Step 08 | protocol contracts §7.4~§7.12 | contracts / API / worker / jobs | DTO 冲突回 Step 08 |
| finite support type / Consumer static map | Step 06 + Step 08 | object contracts typed vocabulary；protocol §7.4 / §7.7 | contracts metadata/refs、API/worker、infra config | 缺variant/token/map回Step 06/08；不得由config/transport/实现猜测 |
| 函数级处理流与 side-effect order | Step 09 | function flows §7~§13 | application services | flow 不得因实现便利重排 |
| lifecycle / state variants | Step 10 | state matrix §9~§15 | domain / tests / acceptance | 后续全部使用 exact enum / variant |
| persistence / transaction / consistency | Step 11 | §8~§19 | infra / integration tests | physical mapping 不得改变 logical invariant |
| error / recovery taxonomy | Step 12 | §8~§24 | all entries / tests / operations | 不从 message text 推断 |
| concurrency / idempotency / reentry | Step 13 | §8~§26 | application / infra / jobs / tests | duplicate不得重跑副作用 |
| config / external binding | Step 14 | §8~§19 | current `04` / infra / runtime | config不得改contract / truth |
| telemetry / native audit | Step 15 | §7~§18 | implementation / current `05/06` | telemetry不替代durable fact |
| minimum test cuts / script contracts | Step 16 | §7~§20 | current `05/06/07` | 未执行切口不得写为evidence |
| implementation handoff input | 本 Step 17 | §8~§14 | Step 18 / 19 / current `07` | 本步不等于最终移交pass |

### 12.2 字段闭环表

本表按对象族复核 required field source。exact 全字段表仍只存在于 Step 06,本表不复制 schema 成为第二真相源。

| Domain / application 对象 | Required field group | 字段来源 | 构造入口 | DTO / Event / Job 输入 | 缺失处理 | 测试入口 | 当前结论 |
|---|---|---|---|---|---|---|---|
| `ObservationReceipt` | receipt/source/purpose/time/state/disposition | ID generator;Command/Event source ref;typed purpose;clock;safety result | `receive` + admission transition | `SubmitObservationMaterialRequest`;bus material | reject / delayed / quarantine;不补 source | Step 16 Command / Consumer | pass |
| `SafetyDisposition` | disposition/receipt/state/redaction/forbidden/summary | ID generator;receipt;safety policy;resolver safe summary | `evaluate` + allow/reject/quarantine | submit / safety Command;bus/sandbox payload | reject / quarantine;raw body不保存 | Step 16 safety / redaction | pass |
| `CorrelationContext` | context/receipt/source/trace/causation/state | ID generator;receipt lookup;typed correlation seed | `from_receipt` + bind/degrade/invalidate | `BindCorrelationContextRequest`;runtime/sandbox payload | reject / partial / invalid | Step 16 correlation cuts | pass |
| `SafeSignal` | signal/kind/context/state/summary/runtime ref | ID generator;request/event;context lookup;safe resolver | `from_summary` + record/suppress | `RecordSafeSignalRequest`;runtime/sandbox payload | reject / delayed / stale / suppressed | Step 16 signal / body scan | pass |
| `SignalRollupWindow` | window/scope/state/signal set/cursor | rollup policy;stored SafeSignal;committed cursor | factory + accept/seal/reopen | signal flow;rebuild job | failed / stale;不读 raw metric/trace | Step 16 state / job | pass |
| `AuditProjection` | projection/subject/context/source audit/state/append ref | ID generator;typed subject;context lookup;source audit ref | `create` + append/restrict | `AppendAuditProjectionRequest`;source audit payload | reject / delayed / restricted | Step 16 audit cuts | pass |
| `EvidenceLinkage` | linkage/projection/boundary/purpose/state/digest/visibility | ID generator;projection lookup;typed input;body-free resolver | `candidate` + link/body block/visibility | `LinkBodyFreeEvidenceRequest`;governance/artifact payload | reject / delayed / body-blocked / not-visible / stale | Step 16 evidence cuts | pass |
| immutable `EvidenceIndexInputView` | input/scope/linkage/audit/gap/visibility | Query preview + accepted Command committed revalidation | application assembler + repository save | `PrepareReportHandoffRequest` complete view | reject ref-only / mismatch;Query不得保存 | Step 16 handoff / consistency | pass |
| `ReportHandoffRecord` | handoff/scope/consumer/state/readiness/input/hint | ID generator;Command;immutable input lookup;policy | `draft` + prepare/block/deliver | prepare Command;delivery Job;feedback Event | blocked / degraded / failed;不补 verdict | Step 16 handoff tests | pass |
| `AuthenticityHint` | hint/handoff/state/origin/gap basis | ID generator;handoff and evidence/gap lookup;policy | assess + confirm/placeholder/insufficient | authenticity Command | insufficient / placeholder;不生成真实 alias | Step 16 authenticity tests | pass |
| `RetentionMarker` | marker/protected/state/protection/archive hint | ID generator;Command;protection lookup;policy/resolver | `for_observation` + hold/release-candidate/conflict | retention Command / maintenance input | conflict / blocked;不执行delete | Step 16 retention tests | pass |
| `ActiveReferenceProtection` | protection/protected/consumer set/state | ID generator;Command;repository canonical set | factory + attach/expire/release | protect Command / handoff/replay context | reject / conflict;active consumer阻止release | Step 16 protection / concurrency | pass |
| `ReplayScope` | scope/targets/allowed effect/state | ID generator;typed Command target set;no-write policy | factory + approve/block/close | `DefineReplayScopeRequest`;replay Job | reject empty / external target;blocked | Step 16 replay tests | pass |
| `NoWriteViolation` | violation/context/forbidden target/state/record | ID generator;application guard;typed target | `detect` + block/escalate/close | no-write Command / blocked job path | fail closed;即使记录失败也不放行write | Step 16 no-write / failure injection | pass |
| `GapState` / `DegradedOutputState` | gap/source/kind/state/degraded ref/reason | ID generator;resolver/repository outcome;classification policy | open/ack/mitigate/close;policy replacement | gap Command;Consumer / Job outcome | explicit gap/degraded/blocked;不造 success | Step 16 gap / query | pass |
| `ReferenceSnapshotState` | snapshot/subject/state/summary/refresh/source version | ID generator;Command/Event;resolver;source comparator | pending + refresh/stale/unresolved/invalid/unavailable | reference Commands;context Consumers;refresh Job | unresolved / unavailable / invalid;older no-write | Step 16 reference / ordering | pass |
| `ProjectionMaintenanceState` | maintenance/target/state/progress/source position | ID generator;immutable target binding;source capture | missing/fresh factory + schedule/start/complete/fail | rebuild Jobs | item failed / target remains stale;不修 truth | Step 16 projection fence | pass |
| `ExternalAuditExportPreparation` / `PeripheralDeliveryState` | preparation/delivery/consumer/view/state/receipt refs | Command / Job;projection lookup;exact external intent | factory + prepare/block/delivery finalize | export Command / Job / feedback | blocked / unavailable / unknown / failed | Step 16 export tests | pass |
| `ObservationOutboxRecord` + snapshot | outbox/event/subject/snapshot/cursor/state/binding/payload digest | accepted committed change;ID/cursor allocators;catalog binding | pending + marker transitions | 12 Outbound payload builders | accepted UoW rollback if incomplete;publisher不重建 | Step 16 outbound / outbox | pass |
| `ObservationIdempotencyReservation` / stored result | operation/actor/key/digest/state/result/surface | operation context;request/envelope/job metadata;canonical serializer | atomic reserve + result-before-complete | 16 Command;9 Consumer;9 Job | conflict / in-flight / consistency;Query排除 | Step 13 canonical IDs / Step 16 | pass |
| Job plan / item / claim / report | execution/plan/config/items/work key/fence/outcome/report refs | Job DTO;validated config snapshot;repository versions;ID generator | start / claim / classify / finalize | 9 Job inputs | blocked / partial / failed / manual;resume不重列 | Step 16 Job / claim / fence | pass |
| public projection composite | stable view/scope/marker/current summary/member refs/freshness | lookup index;ID generator first-create;captured committed source | application pure assembler + versioned replace | 14 Query / rebuild Jobs | missing / stale / unavailable / consistency defect | Step 16 Query / projection | pass |

#### 12.2.1 关键 required field 精确来源索引

`验收证据` 暂不分配编号。当前轮 `06` 重建后必须把这些字段不变量映射到真实 AC / VETO / evidence contract。

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `ObservationReceipt` | `receipt_ref` | `ObservationReceiptRef` | `IdGeneratorPort` | `ObservationReceipt::receive(...)` | generated in submit / consumer flow | generator failure -> rollback / reject | `SubmitObservationMaterial_positive/abnormal` | 待当前轮 `06` |
| `ObservationReceipt` | `source_ref` / `submission_purpose` / `received_at` | typed ref + enum + `ObservedAt` | request/event + boundary clock | `receive(...)` | `SubmitObservationMaterialRequest.*`;bus payload | missing source/purpose -> reject;time不能替代source version | intake cuts | 待 `06` |
| `SafetyDisposition` | `redaction_marker` / `forbidden_body` / `sanitized_summary_ref` | marker + flag + optional safe ref | safety policy + resolver safe summary | `evaluate` then allow/reject/quarantine | submit/safety request or safe consumer material | unsafe/missing summary -> reject/quarantine;no body save | safety + redaction cuts | 待 `06` |
| `CorrelationContext` | `receipt_ref` / `source_ref` / optional trace/causation | typed refs | receipt lookup + request/event correlation seed | `from_receipt(...)` | `BindCorrelationContextRequest.*`;runtime/sandbox envelope | mismatch -> invalid/reject;不推导business identity | correlation cuts | 待 `06` |
| `SafeSignal` | `signal_kind` / `correlation_context_ref` / `summary_ref` | enum + typed refs | request/event + context lookup + safe resolver | `from_summary(...)` then `record` | `RecordSafeSignalRequest.*`;runtime/sandbox payload | raw/missing summary -> reject/delayed/stale | signal + body scan cuts | 待 `06` |
| `SignalRollupWindow` | window/scope/signal set/source cursor | typed refs/set/cursor | rollup policy + stored `SafeSignal` + UoW cursor | window factory / `accept_signal` / `seal` | record signal flow;rollup Job input | incomplete cursor -> remain stale/failed;no raw metric/trace | rollup state / Job cuts | 待 `06` |
| `AuditProjection` | `subject_ref` / `correlation_context_ref` / `source_audit_ref` | typed refs | Command/Event + context lookup | `AuditProjection::create(...)` | `AppendAuditProjectionRequest.*`;source-audit payload | missing owner/context -> reject/delayed | audit cuts | 待 `06` |
| `EvidenceLinkage` | `projection_ref` / `boundary_ref` / `evidence_purpose` / `digest_summary` | typed refs + enum + digest | request/event + projection lookup + body-free resolver | `EvidenceLinkage::candidate(...)` | `LinkBodyFreeEvidenceRequest.*`;governance/artifact payload | missing digest -> delayed;body -> BodyBlocked | evidence cuts | 待 `06` |
| immutable `EvidenceIndexInputView` | input/scope/linkage/audit/gap/visibility | typed refs/sets/surface | Query preview + accepted revalidation + ID generator | application assembler + repository save | complete `PrepareReportHandoffRequest.evidence_index_input` | ref-only/mismatch -> reject;Query never saves | handoff consistency cuts | 待 `06` |
| `ReportHandoffRecord` | `handoff_scope_ref` / `consumer_ref` / `evidence_index_input_ref` / `readiness` | typed refs + state | Command + immutable input lookup + policy | `ReportHandoffRecord::draft(...)` | `PrepareReportHandoffRequest.*`;delivery Job/feedback | missing/blocked -> reject/blocked/degraded;no verdict | handoff cuts | 待 `06` |
| `AuthenticityHint` | `hint_ref` / `handoff_ref` / `evidence_origin` / `placeholder_reason` | typed refs + enum + optional reason | ID generator + handoff/evidence/gap lookup + policy | assess then confirm/placeholder/insufficient | `EvaluateAuthenticityHintRequest.*` | no real basis -> insufficient/placeholder;no alias | authenticity cuts | 待 `06` |
| `RetentionMarker` | `protected_ref` / `active_protection_ref` / `archive_eligibility_ref` | typed refs / optional refs | Command/Job + repository lookup + body-free resolver | `for_observation(...)` then policy transition | `SetRetentionMarkerRequest.*`;maintenance input | active ref -> hold/conflict;never cleanup | retention cuts | 待 `06` |
| `ActiveReferenceProtection` | `protected_ref` / `consumer_refs` | typed ref + canonical set | Command + repository current set | factory / `attach_consumer` | `ProtectActiveReferenceRequest.*` | missing/mismatch -> reject;non-empty set blocks release | protection / race cuts | 待 `06` |
| `ReplayScope` | `target_refs` / `allowed_effect` | typed canonical set + enum | Command body + no-write/retention validation | replay factory + approve/block | `DefineReplayScopeRequest.*` | empty/external target -> reject/blocked | replay cuts | 待 `06` |
| `NoWriteViolation` | `trigger_context_ref` / `attempted_write_target` | typed refs | application/job guard | `NoWriteViolation::detect(...)` | `RecordNoWriteViolationRequest.*` or blocked internal input | missing record persistence still blocks attempted write | no-write failure injection | 待 `06` |
| `GapState` | `source_ref` / `gap_kind` / `degraded_ref` | typed ref + enum + optional ref | resolver/repository outcome + classification | `GapState::open(...)` / mitigate/close | `RecordGapStateRequest.*`;Consumer/Job outcome | missing basis -> reject;not-visible != missing | gap + Query cuts | 待 `06` |
| `DegradedOutputState` | `reason` / `gap_ref` / `state` | typed reason + optional ref + enum | degraded policy + gap lookup | policy evaluation / replacement | gap/handoff/export branch input | hard block -> Blocked;recovery needs new accepted replacement | degraded / no-write cuts | 待 `06` |
| `ReferenceSnapshotState` | `subject_ref` / `safe_summary_ref` / `refresh_record_ref` / source version | typed refs/options/version marker | Command/Event + resolver + comparator | `pending(...)` then formal outcome | reference requests;context payload;refresh Job | unresolved/unavailable/invalid explicit;older no-write | reference / ordering cuts | 待 `06` |
| `ProjectionMaintenanceState` | `target_ref` / `progress_ref` / source-position coverage | typed refs + optional ref + captured positions | Job target binding + projection capture | missing/fresh factory + start/complete/fail | rebuild Job inputs / repository capture | incomplete/fence conflict -> failed/stale,not Fresh | projection fence cuts | 待 `06` |
| `ExternalAuditExportPreparation` | `consumer_ref` / `view_ref` / `visibility` | typed refs + surface | export Command + projection lookup/policy | export factory + prepare/block | `PrepareExternalAuditExportRequest.*`;delivery Job | blocked/missing -> no external call | export Command / Job cuts | 待 `06` |
| `PeripheralDeliveryState` | `preparation_ref` / `consumer_ref` / `view_ref` / delivery receipt | typed refs + body-free result | preparation + Job input + exact adapter result | delivery factory + prepare/record/block | export Job / feedback payload | Unknown/Unsupported -> manual;no Delivered fabrication | export token/probe cuts | 待 `06` |
| `ObservationOutboxRecord` | event/subject/snapshot/cursor/state | typed refs + tagged cursor + enum | accepted change + ID/cursor + payload builder | `ObservationOutboxRecord::pending(...)` | one of 12 outbound snapshot inputs | missing snapshot/binding -> accepted UoW rollback | outbound / outbox cuts | 待 `06` |
| `StoredObservationResult` | reservation/operation/actor/digest/public ref/replay surface | typed refs/enums/digest/body-free bytes | acquired operation context + exact response/receipt/report | `from_replay_surface(...)` | 16 Command / 9 Consumer / 9 Job result | mismatch/missing -> consistency/manual;never recompute | 25 canonical concurrency cuts | 待 `06` |
| `ObservationJobExecutionPlan` | operation/digest/config snapshot/items/plan digest | finite enum + digest + immutable snapshot/list | Job DTO + validated config + repository reads | Job start materialization | 9 Job request inputs | incomplete/mismatch -> start rollback;resume no relist | Job idem / plan cuts | 待 `06` |
| `ObservationJobPlanItemOutcome` | affected/failed/gap/progress refs + reason + digest | canonical typed sets + optional reason + digest | fenced item result | item classification + plan CAS | per-Job item execution | malformed fold -> consistency error;no finalize | item/finalize cuts | 待 `06` |
| public projection composite | stable identity/scope/marker/current-summary/freshness | typed refs/scope/state | lookup index + first-create ID + captured committed source | pure assembler + versioned replace | Query response / rebuild Job | mismatch -> typed consistency error;Query no repair | Query / projection cuts | 待 `06` |

### 12.3 DTO / Event / Job 到目标对象构造闭环表

| 输入契约 | 目标对象 / durable result | Required source closure | 不得混同 | 缺失 / 异常行为 | 关联 flow | 结论 |
|---|---|---|---|---|---|---|
| `SubmitObservationMaterialRequest` | receipt + safety + decision + result/outbox | request refs/purpose + ID/clock + safe resolver | source ref != source body | reject/delayed/quarantine | `SubmitObservationMaterialFlow` | pass |
| `RecordSafetyDispositionRequest` | safety + optional receipt transition + decision | receipt/version + typed marker/reason | redaction marker != summary body | reject/quarantine/rollback | `RecordSafetyDispositionFlow` | pass |
| `BindCorrelationContextRequest` | context + link record | receipt/source + typed seed + ID | trace/source ref != business identity | reject/partial/invalid | `BindCorrelationContextFlow` | pass |
| `RecordSafeSignalRequest` | signal + rollup/link record | context + safe summary + signal kind + ID | summary ref != raw telemetry | reject/delayed/stale/suppressed | `RecordSafeSignalFlow` | pass |
| `AppendAuditProjectionRequest` | projection + append record | subject/context/source audit ref + ID | source audit ref != audit body | reject/delayed/restricted | `AppendAuditProjectionFlow` | pass |
| `LinkBodyFreeEvidenceRequest` | linkage + append record | projection + boundary/purpose/digest + resolver | boundary ref != evidence body | body-blocked/not-visible/stale | `LinkBodyFreeEvidenceFlow` | pass |
| `PrepareReportHandoffRequest` | immutable input + handoff + lifecycle | full view + committed constituent validation + ID | input ref != complete input;Delivered != verdict | reject/blocked/degraded | `PrepareReportHandoffFlow` | pass |
| `EvaluateAuthenticityHintRequest` | hint + handoff lifecycle | handoff/evidence/gap + policy + ID | origin ref != real alias / signoff | insufficient/placeholder/reject | `EvaluateAuthenticityHintFlow` | pass |
| `SetRetentionMarkerRequest` | marker + change record | protected ref + protection/policy + ID | release marker != cleanup authority | conflict/blocked | `SetRetentionMarkerFlow` | pass |
| `ProtectActiveReferenceRequest` | protection + change record | protected/consumer refs + current version + ID | consumer ref != owner truth | reject/conflict | `ProtectActiveReferenceFlow` | pass |
| `DefineReplayScopeRequest` | replay scope + execution record | canonical targets/effect + no-write/retention | replay target != source repair target | reject/blocked | `DefineReplayScopeFlow` | pass |
| `RecordNoWriteViolationRequest` | violation + record | trigger/target + guard + ID | record success != permission to write | fail closed / reject | `RecordNoWriteViolationFlow` | pass |
| `RecordGapStateRequest` | gap + degraded/transition record | source/kind/reason + classification + ID | missing != not-visible;resolved != source repaired | reject/blocked/degraded | `RecordGapStateFlow` | pass |
| `PrepareExternalAuditExportRequest` | preparation + delivery marker | consumer/view/visibility + ID/policy | preparation != audit conclusion | reject/blocked;no external call | `PrepareExternalAuditExportFlow` | pass |
| `RegisterReferenceSnapshotRequest` | snapshot + refresh record | subject/source version + resolver + ID | source version != local row version | unresolved/unavailable/invalid | `RegisterReferenceSnapshotFlow` | pass |
| `UpdateReferenceSnapshotStateRequest` | updated snapshot + refresh record | loaded version + typed source version/outcome | occurred_at != source ordering | older no-write/equal conflict | `UpdateReferenceSnapshotStateFlow` | pass |
| 9 `ObservationInboundEventEnvelope<T>` | local receipt/projection/reference/handoff/delivery/gap + stored receipt | envelope identity/version/dedup/actor + typed payload + resolver | source event ref != local object ref | duplicate/unsupported/delayed/quarantine/dead-letter | 9 exact Consumer flows | pass |
| 12 Outbound payload builders | immutable outbox protocol snapshot | committed object/state/record + exact event binding/cursor | event ref != truth object id;binding not public payload | accepted UoW rollback if builder/binding fails | shared append + publication flow | pass |
| `PublishObservationOutboxJobInput` | immutable plan + publication markers/report | stored eligible snapshot/version + plan config | job execution ref != publication token | dead-letter/retry/manual;no rebuild | publication Job flow | pass |
| `RebuildObservationReadModelsJobInput` | read/diagnostic views + maintenance/progress/report | target/scopes/visibility/min position + complete capture | source cursor != filter;scope != generated view ref | reject/failed item/partial | read-model Job flow | pass |
| `RebuildSignalRollupsJobInput` | rollup/rebuild/report | scope/windows/cursor + stored SafeSignal | safe signal != raw metric/trace | failed/stale;no Fresh fabrication | rollup Job flow | pass |
| `RefreshReferenceSnapshotsJobInput` | snapshots/views/report | canonical scope/items + resolver + source version | resolver result != external lifecycle truth | partial/retryable/invalid | refresh Job flow | pass |
| `ScanObservationGapsJobInput` | gaps/status/progress/report | fixed expected refs/visibility + committed reads | absence != source failure truth | failed/blocked;no synthetic close | gap scan Job flow | pass |
| `CoordinateObservationReplayJobInput` | coordination/execution/maintenance/report | approved scope/target/no-write guard | replay coordination != source repair | blocked/failed | replay Job flow | pass |
| `PrepareReportHandoffDeliveryJobInput` | intent/preparation/delivery lifecycle/report | handoff/input/consumer + frozen binding/token | delivery receipt != acceptance | unknown/unsupported/manual/finalize-only | handoff Job flow | pass |
| `PrepareExternalAuditExportJobInput` | intent/preparation/delivery/report | preparation/view/consumer + frozen binding/token | external delivered != audit conclusion | unknown/blocked/manual | export Job flow | pass |
| `RebuildPeripheralViewsJobInput` | peripheral views/progress/report | consumer scopes/min cursor + captured projections | view != consumer product truth | failed/partial/stale | peripheral Job flow | pass |

### 12.4 Query response / view 闭环表

| Query | Request -> service input | Response DTO / View | identity / field source | empty / visibility / degraded 口径 | no-write gate | Step 16 test entry | 结论 |
|---|---|---|---|---|---|---|---|
| `GetObservationReceipt` | `GetObservationReceiptRequest` -> `GetObservationReceiptInput` | `ObservationReceiptView` | receipt ref -> intake repository | missing != not-visible;restricted source explicit | no save/refresh/outbox | positive / abnormal | pass |
| `GetIntakeStatus` | request -> input | `ObservationPublicPage<IntakeStatusItemView>` | scope + opaque page -> receipt/safety rows | empty page valid;safety absent is pending surface | no cursor write | positive / abnormal | pass |
| `GetSafeSignal` | request -> input | `SafeSignalProjectionView` | signal ref or context page -> signal/projection | suppressed/stale/not-visible explicit;no raw body | no resolver rerun / record | positive / abnormal | pass |
| `GetSignalRollup` | request -> input | `SignalRollupView` | window/scope -> rollup + freshness marker | Pending/Stale/Rebuilding/Failed explicit | no seal/rebuild | positive / abnormal | pass |
| `GetAuditTimeline` | request -> input | page of `AuditTimelineEntryView` | subject + page -> append order/projection | restricted/omitted != missing;empty valid | no read-audit append | positive / abnormal | pass |
| `GetEvidenceIndexInput` | request -> input | `EvidenceIndexInputView` | generated preview ref + scope + canonical refs | missing linkage -> gap;preview not persisted | no handoff input save | positive / abnormal | pass |
| `GetReportHandoff` | request -> input | `ReportHandoffView` | handoff ref -> handoff/input/hint | blocked/degraded/stale/missing explicit | no prepare/deliver | positive / abnormal | pass |
| `GetRetentionProtection` | request -> input | `RetentionProtectionView` | protected ref -> marker/protection | absent marker / conflict explicit | no release/delete | positive / abnormal | pass |
| `GetObservationReadModel` | request -> input | `ObservationReadModel` / page | canonical scope -> lookup -> stable view/marker | stale/rebuilding/missing explicit | no rebuild / stale mark | positive / abnormal | pass |
| `GetDiagnosticView` | request -> input | `DiagnosticView` | scope -> stable view/scope/marker/current summary | Partial/Stale/Unavailable + gaps | no replacement / repair | positive / abnormal | pass |
| `GetGapStatus` | request -> input | `GapStatusView` | gap/source -> gap + marker | Suppressed != Resolved;not-visible != missing | no acknowledge/close | positive / abnormal | pass |
| `GetPeripheralExportView` | request -> input | `DashboardAlertExportView` | consumer + scope -> stable view/marker | disabled/not-visible/stale/blocked | no export adapter call | positive / abnormal | pass |
| `GetReferenceSnapshotView` | request -> input | `ReferenceSnapshotView` | snapshot/subject -> snapshot + sidecar | Unresolved/Stale/Unavailable/Invalid explicit | no refresh / body copy | positive / abnormal | pass |
| `GetRebuildProgress` | request -> input | `RebuildProgressView` | target -> stable progress/marker + maintenance/report | missing / failed / rebuilding explicit | no start/finalize job | positive / abnormal | pass |

Query 统一使用 `ObservationQuerySurface` 表达 visibility、freshness、degraded、availability、missing 和 rebuild。public `ObservationPublicPage*` 与 application-local `Page<T>` / repository cursor helper 保持分离。

### 12.5 Public protocol 传递类型闭环表

| 协议 surface | 外层 DTO | 关键传递类型 | 正式归属 / schema | missing / duplicate / retry | 依赖边界 | 测试入口 | 结论 |
|---|---|---|---|---|---|---|---|
| Command | `ObservationCommandRequest<T>` / response | metadata、name、typed refs、result/outcome/error | contracts;Step 08 §7.4 / §7.5 | missing actor/key reject;same digest replay;different conflict | contracts不依赖domain | 16 x positive/abnormal | pass |
| Query | `ObservationQueryRequest<T>` / response / public page | metadata、surface、view/ref/page info | contracts;Step 08 §7.4 / §7.6 | missing/not-visible/stale/degraded explicit;no replay store | strict no-write | 14 x positive/abnormal | pass |
| Inbound Event | `ObservationInboundEventEnvelope<T>` / receipt | producer/consumer/source event/source version/dedup/schema/payload | contracts;Step 08 §7.7 | duplicate replay;unsupported no parse;retry/quarantine/dead-letter typed | no source body / truth | 9 x positive/abnormal | pass |
| Outbound Event | envelope + protocol payload snapshot | event kind/ref/schema/cursor/body-free payload | contracts + application stored snapshot;Step 08 §7.8 / Step 11 | outbox CAS;same-token retry;dead-letter | publisher reads stored snapshot only | 12 x positive/abnormal | pass |
| Operations Job | `ObservationJobRequest<T>` / response / report | metadata、input/output、outcome、report refs | contracts;Step 08 §7.9 | exact terminal report replay;partial/blocked/failed typed | job no truth repair | 9 x positive/abnormal | pass |
| Projection public types | read/diagnostic/gap/reference/peripheral/progress views | generated stable ref、scope、freshness marker、visibility | contracts;Step 06 / 08 | missing/stale/consistency fail closed | repository returns domain/projection helper,not public DTO | Query / projection cuts | pass |
| External effects | stored snapshot/intent + token + probe result | `ExternalEffectBindingRef`,five stable token families | application carrier;Step 06 / 07 / 13 / 14 | Unknown/Unsupported manual;known success finalize-only | endpoint/credential remain infra-private | outbox/handoff/export cuts | pass |
| Idempotent replay | reservation + `StoredObservationReplaySurface` | operation/actor/key/digest/kind/schema/surface digest | application;Step 06 / 13 | Acquired/Replay/Conflict/InFlight exact | Query excluded;body-free bytes only | canonical Step 13 / 16 cuts | pass |
| Finite support vocabulary | all protocol families / config binding | `SchemaVersion`;`SourceFamilyKind`;`ObservationProducerFamily`;`ObservationQueryOperation`;two consumer typed refs | Step 06唯一definition；Step 08 static map；Step 13/14 lossless use | unknown/mismatch在parse/reserve/assembly前拒绝；无fallback | contracts/application owner固定；config不扩enum | definition/use + 9-map cuts | pass_after_targeted_repair |

### 12.6 状态闭环表

`验收证据` 列不填写虚构 `AC/EV`。当前轮 `06` 尚未重建,因此只记录下游必须使用当前正式状态名并在未来补真实映射。

| # | 状态枚举 | 正式状态值 | 产生 / 迁移 owner | 非法 / reserved 约束 | Step 16 测试入口 | 验收证据 | 结论 |
|---:|---|---|---|---|---|---|---|
| 1 | `ObservationReceiptState` | `Received`,`Accepted`,`Rejected`,`Quarantined`,`Degraded`,`Superseded` | receipt factory / admission flow | Rejected终态;Superseded current reserved | legal/illegal/terminal/reserved | 待当前轮 `06` 映射 | pass |
| 2 | `SafetyDispositionState` | `Pending`,`Safe`,`Redacted`,`Rejected`,`Quarantined` | safety factory / policy | terminal rewrite拒绝;body never retained | clean/redacted/reject/quarantine | 待 `06` | pass |
| 3 | `CorrelationContextState` | `Unbound`,`Bound`,`Partial`,`Invalid` | context factory / bind/degrade/invalidate | Invalid终态;opaque ref冲突 fail closed | bind/partial/invalid | 待 `06` | pass |
| 4 | `SafeSignalState` | `Candidate`,`Recorded`,`Suppressed`,`Stale` | signal factory / safe policy | Suppressed终态;raw telemetry forbidden | record/stale/suppress | 待 `06` | pass |
| 5 | `AuditProjectionState` | `PendingAppend`,`Appended`,`VisibilityRestricted`,`Suppressed` | projection factory / append/restrict | Suppressed current reserved | append/restrict/reserved | 待 `06` | pass |
| 6 | `EvidenceLinkageState` | `Candidate`,`Linked`,`BodyBlocked`,`NotVisible`,`Stale` | linkage factory / body-free + visibility policy | BodyBlocked终态;NotVisible != missing | link/body block/visibility/stale | 待 `06` | pass |
| 7 | `ReportHandoffState` | `Draft`,`Prepared`,`Delivered`,`Failed`,`Cancelled` | handoff factory / prepare/deliver/block | Delivered终态;Cancelled reserved;Delivered != signoff | lifecycle + terminal | 待 `06` | pass |
| 8 | `HandoffReadinessState` | `PendingEvidence`,`Ready`,`Blocked`,`Degraded` | readiness policy in accepted write | Query reevaluation不得持久化 | all policy outcomes + no-write | 待 `06` | pass |
| 9 | `AuthenticityHintState` | `Unassessed`,`RealEvidenceLinked`,`PlaceholderDetected`,`Insufficient` | authenticity policy | two terminal variants不可改写;不生成real alias | real/placeholder/insufficient | 待 `06` | pass |
| 10 | `RetentionMarkerState` | `Unmarked`,`ActiveHold`,`ReleaseEligible`,`Released`,`Conflict` | retention policy / marker methods | Released current reserved;绝不授权source delete | hold/candidate/conflict/reserved | 待 `06` | pass |
| 11 | `ActiveReferenceProtectionState` | `Unprotected`,`Protected`,`Expired`,`Released`,`Conflicted` | protection methods / repository recheck | active consumers阻止Released | attach/expire/conflict/release race | 待 `06` | pass |
| 12 | `ReplayScopeState` | `Defined`,`Approved`,`Blocked`,`Completed`,`Cancelled` | replay boundary policy / coordination | terminal scope不重开;Approved only observation-side | approve/block/complete/cancel | 待 `06` | pass |
| 13 | `NoWriteViolationState` | `Detected`,`Blocked`,`Escalated`,`Closed` | no-write guard / violation methods | Closed终态;记录失败也不得放行write | block/escalate/close/fail closed | 待 `06` | pass |
| 14 | `GapLifecycleState` | `Open`,`Acknowledged`,`Resolved`,`Suppressed` | gap methods / scanner | suppress/unsuppress current reserved;Resolved != source repair | open/ack/mitigate/close/reserved | 待 `06` | pass |
| 15 | `DegradedOutputKind` | `None`,`Active`,`Blocked` | degraded policy / accepted replacement | recovery用new replacement;Query不写 | limited/block/replacement/no-write | 待 `06` | pass |
| 16 | `SignalRollupState` | `Pending`,`Fresh`,`Stale`,`Rebuilding`,`Failed` | rollup methods / rebuild Job | Fresh要求完整stored SafeSignal cursor | signal/rebuild/failure/raw-body exclusion | 待 `06` | pass |
| 17 | `ReadVisibilityKind` | `Visible`,`Restricted`,`NotVisible`,`Blocked` | request-scoped visibility policy | each request new evaluation;no durable Query transition | all surfaces + zero write | 待 `06` | pass |
| 18 | `DiagnosticFreshnessState` | `Fresh`,`Stale`,`Partial`,`Unavailable` | assembler / accepted maintenance replacement | Query不repair;composite mismatch fail closed | stale/partial/unavailable/replace | 待 `06` | pass |
| 19 | `ReferenceSnapshotStateKind` | `Pending`,`Resolved`,`Stale`,`Unresolved`,`Invalid`,`Unavailable` | resolver outcome / snapshot methods | Invalid终态;older/uncomparable不覆盖 | all outcomes + source ordering | 待 `06` | pass |
| 20 | `ProjectionMaintenanceStateKind` | `Fresh`,`Stale`,`Rebuilding`,`Failed` | stale marker / rebuild target flow | Fresh要求all members + target fence | stale/start/complete/fail/fence | 待 `06` | pass |
| 21 | `ReplayCoordinationKind` | `Pending`,`Coordinating`,`Blocked`,`Completed`,`Failed` | replay Job execution | terminal execution需new execution | coordinate/block/complete/fail | 待 `06` | pass |
| 22 | `RollupRebuildKind` | `Pending`,`Running`,`Completed`,`Failed`,`Cancelled` | rollup rebuild Job | Cancelled current reserved;terminal不重开 | start/complete/fail/reserved | 待 `06` | pass |
| 23 | `PeripheralDeliveryKind` | `Pending`,`Prepared`,`Delivered`,`Failed`,`Blocked`,`Cancelled` | export preparation / delivery flow | Cancelled reserved;Delivered仅交付状态 | prepare/deliver/fail/block/reserved | 待 `06` | pass |
| 24 | `ExportPreparationState` | `Draft`,`Prepared`,`Blocked`,`Delivered`,`Failed` | export Command / Job | Delivered != external audit conclusion | prepare/block/deliver/fail | 待 `06` | pass |
| 25 | `OutboxPublicationState` | `Pending`,`Published`,`Failed`,`DeadLettered` | accepted outbox / publisher | Failed同token retry,不得回Pending;terminal不重开 | append/publish/retry/dead-letter/fence | 待 `06` | pass |
| 26 | `IdempotencyReservationState` | `Reserved`,`Completed` | atomic idempotency repository | Replay/Conflict/InFlight是incoming outcome,不是durable state | reserve/replay/conflict/in-flight/result | 待 `06` | pass |
| 27 | `JobReportState` | `Draft`,`Completed`,`PartiallyCompleted`,`FailedRetryable`,`FailedPermanent`,`Blocked` | Job report start / finalize | terminal report immutable;duplicate只replay | all terminal / duplicate / tamper | 待 `06` | pass |

`ObservationJobPlanItemState` 的 `Planned`,`Running`,`Succeeded`,`FailedRetryable`,`FailedPermanent`,`Blocked`,`SkippedTerminal` 是 application coordination state。它不改变上述 27 个正式状态 owner 数量,但当前轮 `05/06/07` 必须单独覆盖 claim / fence / outcome / report canonical fold。

### 12.7 Phase / commit boundary 闭环表

| Phase / commit boundary | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 | 当前结论 |
|---|---|---|---|---|---|---|---|
| 待当前轮 `07` 定义 | 由正式 `03` 对象 / protocol / flow / state 与当前 `05/06` gate 共同决定 | 本 Step 不预写 task / phase / commit | Step 19 正式 `03`;current `04/05/06` | future-only DTO / port / transition / report / script / evidence | `07` 逐 boundary 引用 current `05` | `07` 逐 boundary 引用 current `06` | pending until `07`;not a Step 17 blocker |

未来每个 commit boundary 必须同时满足:

1. **Type closure**: 当前代码需要构造、保存、返回、序列化或测试的主类型与二级 public / support type 均在本 boundary 或前置 boundary 可用。
2. **Callable closure**: 当前 service / handler / job 所调用的 trait、repository、policy、helper 和 error surface 已实现,不能先留假签名给后续 boundary。
3. **Protocol closure**: 当前 public Command / Query / Consumer / Job 的 request、response / receipt / report、entry mapping 和 error mapping 在同一可运行纵切闭口。
4. **Job closure**: 若当前 flow 已声明 public Job,其 metadata、input/output、report、idempotency、plan / claim / fence 最小 surface 不能后置到 operations phase。
5. **Persistence closure**: 当前 accepted write 的 key、version、UoW、history、cursor、outbox、stored result 和 consistency mapper 同 boundary 可验证。
6. **External-effect closure**: snapshot / intent、binding、token、probe、local finalize 和 ambiguous recovery 不能拆成会迫使 blind retry 的边界。
7. **Test closure**: current `05` 中对应 positive / abnormal / state / failure-injection 命令能执行并产生真实 artifact。
8. **Acceptance closure**: current `06` 中对应 gate / VETO 有可检查 evidence contract;不要求提前伪造通过结果。
9. **No future evidence**: boundary 不得断言由后续 script / report / human signoff 才产生的 evidence 已存在。

`07` 每个 boundary 的开工前复核模板至少为:

| 复核项 | 当前 boundary 必须证明 | 失败处理 |
|---|---|---|
| field closure | required fields都有DTO / lookup / derive / generator source | 暂停;回写 Step 06/08/09或调整boundary |
| DTO construction | input可构造target object / view / report | 暂停;不得加placeholder/default |
| Query closure | response view/page/marker、identity、empty/degraded、no-write齐全 | 暂停;回写design |
| state closure | exact enum / variant / trigger / illegal path与tests/acceptance一致 | 暂停;禁用口语状态 |
| phase closure | 无future type/result/evidence依赖 | 调整boundary或前移完整依赖闭包 |
| side-effect closure | UoW/outbox/intent/token/probe/finalize顺序完整 | 暂停;不得临时blind retry |
| evidence closure | test command、artifact producer、report consumer、AC/VETO映射存在 | 补当前 `05/06/07`;不伪造result |
| naming closure | public/internal/static mapping唯一 | 回写design和all consumers |

### 12.8 命名一致性表

| 名称类型 | 正式名称 / 映射 | 禁用旧名 / 口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| target repo | `quantalithos-observability` | `L4-observability` 作为代码仓名 | Step 03 / 04;projects README | 架构层级只留设计导航 |
| package / crate | `observability-<role>` / `observability_<role>` | `l4-observability-*`;业务组成部分 crate;单体旧 `src/*` | Step 04 / 05 | 七 role workspace统一 |
| modules | `contracts/domain/application/infra/api/worker/jobs` | `audit_chain`,`trace_reconstruction`,`metrics`,`log_aggregator`,`lineage_api`,`dora_ebm` 作为核心 crate | old README | 旧产品目录不进入当前实现 |
| intake object | `ObservationReceipt` / `ObservationReceiptState` | `ObservationEnvelope`,`ObservationIngestReceipt`,`IngestObservationMaterialCommand` | old Step / old `03` | 使用 Step 06 / 08 exact names |
| safety | `SafetyDisposition` / `SafetyDispositionState` | `RedactionDecision` | old Step 10 | redaction只是 disposition 分支 |
| audit | `AuditProjection` / `AuditProjectionState` | `AuditEventProjection`;通用业务 audit ledger | old Step 10 / README | 本仓只拥有 observation audit projection |
| signal | `SafeSignal`;`SignalRollupWindow` | `MetricPoint`,`TraceSpanRecord`,raw log/metric/trace schema | old Step / README | raw provider body永不入仓 |
| Query naming | HLD name -> `*Request` -> `*Input` -> exact view/page | HLD `*Query` 与 Rust DTO 并存成两套任意类型 | Step 08 §7.6.5 | static one-to-one mapping |
| public Job collision | public Job `PrepareExternalAuditExport` -> `ObservationJobOperation::PrepareExternalAuditExportDelivery` -> `prepare_external_audit_export_delivery` | 把 Command operation与Job operation混用 | Step 06 / 08 / 13 | family + body static map;UoW前拒绝 mismatch |
| public Command collision | public Command `PrepareExternalAuditExport` -> `ObservationCommandOperation::PrepareExternalAuditExport` -> `prepare_external_audit_export` | 由 route string 猜 Command / Job | Step 08 / 13 | discriminator必须来自typed family |
| protocol snapshot | `ObservationOutboundEventPayloadSnapshot` | application stored snapshot含binding与protocol bytes却共用模糊名字 | Step 08 / 11 / 14 | application store明确保存 `(effect_binding_ref, protocol_snapshot)` |
| idempotency | operation + actor + logical key + digest | raw key、business unique key、work key互相替代 | Step 13 | 四类identity不得混用 |
| source order | `ObservationSourceVersionRef` | `occurred_at`,schema version,local cursor/version | Step 06 / 13 | only producer comparator declares order |
| job execution | `ObservationJobExecutionRef` | external real `run_id`;test run id | Step 06 / 08 | local technical identity不冒充evidence run |
| delivery state | owner-qualified `ReportHandoffState` / `PeripheralDeliveryKind` / `ExportPreparationState` | 泛化 `Delivered` 推导验收成功 | Step 10 | 每个 owner 独立解释 |
| test IDs | Step 16 exact names + 25 canonical `TC-OBS-*` IDs | `EV-CAND-*` / `AC-*` 占位或“tests passed” | Step 13 / 16 | current `05/06` 重建时正式映射 |

### 12.9 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 当前修正 / 后续动作 | 处理状态 |
|---|---|---|---|---|---|
| `OBS-DDD-17-001` | README vs current `00/01/02` / Step 01~16 | 产品 / truth / dependency 主线冲突 | 全实现 | README 降级 historical;不继承固定产品、DORA/EBM、hash chain、alert / lineage truth | current design 已隔离;README后续另行校准 |
| `OBS-DDD-17-002` | 4990 行 pre-M2 正式 `03` vs current Step 01~16 | 正式正文虽已有完整章节骨架,但完成语义、affected 状态和 accepted UoW 顺序未消费 M2/M3 | implementation direct input | Step 19 按 current Step 01~18 重装并执行全文门禁,不得因篇幅充足就提前实施 | pending Step 19;implementation blocker |
| `OBS-DDD-17-003` | old `04` vs current Step 14 | typed config / binding 可能漂移 | runtime/config | 后续按配置 SOP full-restart | pending current `04`;implementation blocker |
| `OBS-DDD-17-004` | old `05` vs current Step 16 | protocol/state/test/evidence 可能漂移 | verification | 后续按测试 SOP full-restart并保留真实执行边界 | pending current `05`;implementation blocker |
| `OBS-DDD-17-005` | old `06` vs current state/test cuts | AC / VETO / evidence 可能漂移 | acceptance | 后续按验收 SOP full-restart;不沿用旧签署 | pending current `06`;implementation blocker |
| `OBS-DDD-17-006` | old `07` vs current Step 01~17 | phase / commit boundary 失效 | implementation order | 后续按实施 SOP full-restart并逐 boundary审计 | pending current `07`;implementation blocker |
| `OBS-DDD-17-007` | `/home/aris/Projects/quantalithos-observability` absent | implementation environment missing | workspace / git / Cargo | 由 current `07` 设初始化 / 确认前置;本 Step不创建 | implementation kickoff blocker;not upstream design blocker |
| `OBS-DDD-17-008` | old implementation ledger / boundaries | stale execution state | agent recovery | `07` 完成时创建 current ledger和全部planned skeleton;旧文件不恢复 | pending current `07` |
| `OBS-DDD-17-009` | Command / Job 都显示 `PrepareExternalAuditExport` | family name collision | route / digest / idempotency | static family+body map到两个finite operation;unknown/mismatch在UoW前拒绝 | resolved in Step 06/08/13;must audit in `07` |
| `OBS-DDD-17-010` | Step 17 旧 47 行文件 | handoff 粒度不足 | `07` input | 本文件全量重建为inventory + closure + precondition + audit input | resolved current Step |
| `OBS-DDD-17-011` | current `04` Step07 downstream definition/use审计 | 6个support type只有use没有完整definition | protocol/config/idempotency/handoff/export implementation | 定向回写Step06/08/13/14、formal §6/§7/§12/§13和本handoff；固定variant/token/owner/9 Consumer map | resolved by `CFG-BLK-07-01` targeted repair；不改变60 protocol / 27 state / port surface |
| `OBS-DDD-17-012` | current `04` Step09 D05/D21 exposure audit | raw Consumer/schedule binding被直接放入entry slice，entry又无private registrar | worker/jobs startup无法在no-locator/no-adapter边界内落码 | R2定向回写Step05/07/14/17/19和formal §5/§6/§13/§15/§16；safe metadata + prebuilt registrar + finite handler + opaque handle | resolved by `CFG-BLK-09-01` targeted repair；不改变business port、60 protocol、27 state、UoW或durable schema |

上述 pending 项都不构成当前 Step 17 的**上游 blocker**。它们构成严格的下游文档门禁或 implementation kickoff blocker,必须保持可见,不能被 `pass_for_step_17` 覆盖。

### 12.10 正反例

正确示例:

```md
| Boundary item | Design source | Implementation action | Gate |
|---|---|---|---|
| SubmitObservationMaterial vertical slice | formal 03 §7 / §8 / §10~§12;Step 06 / 08 / 09 / 11 / 13 | implement exact request -> receipt/safety/decision -> history/outbox/result UoW | current 05 positive/abnormal + current 06 boundary VETO |
```

正确原因:

- 只引用 schema / flow / state 真相源,不在 `07` 重写它们。
- object、protocol、transaction、idempotency 和 test gate 一起闭口。
- gate 仍要求真实执行,没有声称结果已通过。

Query 正确示例:

```md
GetDiagnosticView boundary precheck:
- request/view/identity: Step 08 §7.6.2~§7.6.5.
- read flow and zero-write: Step 09 Query batch.
- composite consistency: Step 11 diagnostic composite.
- tests: current 05 mapping of Step 16 GetDiagnosticView_positive/abnormal and TC-OBS-QUERY-NOWRITE-001.
```

错误示例:

```md
commit-03-a: implement observability ingestion and dashboards.
Use any convenient DTO. If a field is absent, derive it from the raw telemetry payload.
Mark the work accepted when logs show success.
```

错误原因:

- boundary 过粗且混入旧 dashboard 产品主线。
- 允许实现端自行补 DTO 和读取 forbidden raw body。
- 用 runtime log 代替 durable result、test artifact 和 acceptance evidence。

Phase boundary 错误示例:

```md
Implement PrepareReportHandoff now; add its job report, delivery token, probe, scripts, and acceptance evidence in later phases.
```

错误原因:

- 当前 flow 会立即依赖后置 result / token / probe,不形成 dependency closure。
- ambiguous external outcome 会迫使实现端盲重试。
- 当前 boundary 不能依赖后续 evidence 才解释是否完成。

### 12.11 `19.R2 / CFG-BLK-09-01` registration implementation closure

#### 12.11.1 Exact file ownership

| File | Must define / implement | Must consume | Must not contain |
|---|---|---|---|
| `crates/infra/src/config.rs` | raw `InboundConsumerBindingConfig` / `JobScheduleBindingConfig` validation；locator-free safe item derivation | current `04` exact source/key/schema | resolved secret/material、entry handler、business invocation |
| `crates/infra/src/runtime_builder.rs` | object-safe registrar/handler/catalog/opaque handle type shape；private registrar implementation；existing context-factory + two registrar `BuiltObservabilityRuntime` fields；stage 8/11 totality | validated raw binding、resolved private transport/actor-policy/scheduler、safe item | dependency on worker/jobs、generic service locator、public DTO replacement |
| `crates/infra/src/lib.rs` | re-export only the technical types needed by entry crates | runtime builder public composition surface | private registry/concrete adapter export、`Any`/downcast hook |
| `crates/worker/src/consumers.rs` | 9 exact `InboundConsumerHandler` implementations and typed envelope dispatch | inbound façade、context factory、safe actor、existing envelope/receipt | transport locator/ack token/topic、repository/resolver/UoW |
| `crates/worker/src/lib.rs` | build exact `InboundConsumerHandlerCatalog` | worker services + worker safe slice | generic map/default handler、raw config |
| `crates/worker/src/main.rs` | call `register_all` after catalog totality；retain `Box<dyn RegisteredInboundConsumerSet>` for process lifetime | worker slice + inbound registrar + service bundle | adapter construction/private registry lookup；expose root before success |
| `crates/jobs/src/lib.rs` | 9 exact `ObservationJobHandler` implementations/catalog；variant/body/operation total map | publication/maintenance façade、context factory、existing Job wrappers | schedule locator、generated metadata/input、second DTO/error taxonomy |
| `crates/jobs/src/bin/*.rs` | one-shot exact handler entry；scheduled composition where assigned；retain opaque schedule set in host root | jobs slice + schedule registrar + service bundle | current-config resume、direct adapter/repository、fake run/evidence identity |

不新建`entry_registration.rs`：Step 04当前文件树没有该文件，technical seam先归`runtime_builder.rs`；若current `07`基于实际代码体量决定拆文件，必须在对应boundary先更新正式文件ownership引用和all planned skeleton，不能让实现agent自行漂移真相源。

#### 12.11.2 Definition and construction order

1. 在infra定义object-safe boxed-Future type aliases、safe metadata、finite invocation/result enum、handler/catalog、registrar和opaque registered-set trait。
2. 在`config.rs`实现raw binding parse/validate/canonical sort；不得先把raw type暴露给entry再回收。
3. 在runtime builder stage 8解析private transport、actor-policy与scheduler capability；scheduler必须证明可转交完整existing Job request。
4. 在stage 11一一投影safe item并构造one-assembly registrar private slots；校验raw/private/safe count、operation和producer/schema totality。
5. Worker/jobs只用existing façade和DTO实现handler，构造exact 9-slot catalog；disabled项为`None`，enabled项为`Some`。
6. Composition root调用group `register_all`。Registrar执行prepare-all -> totality -> arm-all；失败revoke/join全部并返回`EntryBindingIncomplete`。
7. 只有成功返回opaque handle后才允许process root exposure；handle存活期绑定registered callbacks，drop/shutdown不声明durable completion。

#### 12.11.3 Planned minimum tests

| Planned cut | Required assertion | Owner |
|---|---|---|
| `entry_registration_safe_projection` | worker/jobs public constructor无法取得`TransportBindingRef`/`PolicyBindingRef`/`ScheduleBindingRef`、private registry或concrete adapter | infra static/compile test |
| `entry_registration_catalog_totality` | 9 Consumer + 9 Job enabled/disabled、operation/body/producer/schema exact；missing/extra/mismatch returns `EntryBindingIncomplete` | infra + entry unit test |
| `entry_registration_atomic_start` | no callback before group success；Nth prepare/arm fail revokes/joins prior items；zero active root/partial handle | controlled registrar test |
| `entry_registration_no_synthesized_job_request` | incomplete scheduler invocation fails capability/startup；no default actor/key/scope/target/cursor/input or generated run/evidence identity | jobs + scheduler fake |
| `entry_registration_bounded_envelope` | unbounded descriptor/oversized frame never calls handler；frame is move-only/no Debug/Serialize；unsupported schema no payload parse | worker + transport fake |
| `entry_registration_invocation_mapping` | Consumer completion maps existing ack/retry/dead-letter semantics；Job invocation maps exact existing response or typed Protocol/Application failure without fake report；startup errors not reused at runtime | worker/jobs integration |
| `entry_registration_no_reverse_dependency` | infra Cargo/dependency scan has no worker/jobs edge；worker/jobs may depend on infra | workspace static gate |

这些是planned test contracts，不表示文件、fixture、command、artifact或result已存在。Current `05`必须展开suite/case/environment/artifact，current `06`必须定义对应VETO/evidence consumer，current `07`必须把它们绑定到exact boundary后才能开工。

#### 12.11.4 Boundary pause conditions

任一相关implementation boundary遇到以下情形必须暂停并回设计：selected transport只能向callback暴露provider envelope/ack object；actor mapper不能产出stable body-free`ActorSafeRef`；scheduler只能发tick而不能转交完整existing Job request；registrar无法撤销/等待partial registration；runtime要求entry按locator查private registry；需要新增第10个handler、generic unknown handler、business port、durable registration state或startup error variant。不得以unsafe/downcast/global singleton/default input/first-call validation绕过。

## 13. 未进入实施的待确认项

| 项 | 当前状态 | 为什么不能交给实现者自行处理 | 责任文档 / 时点 | 是否上游 blocker |
|---|---|---|---|---|
| Step 18 风险与待确认事项 | pending in M3 sequence | 需汇总 Step 01~17 未关闭项,并区分既有 upstream/internal affected、boundary blocker 与 implementation precondition | M3 Step 18 | 否;但未分类前阻塞 Step 19 |
| 正式 `03-详细设计.md` | pre-M2 assembly / historical for current completion | current Step 09~18 尚未传播到正式正文的完成语义、affected gate 与 UoW 顺序 | M3 Step 19 | 否;但阻塞正式 baseline |
| exact config key / source / profile / activation | current `04` 未重建 | config 不能由实现代码现场发明 | current `04` | 否;但阻塞相关 boundary |
| test suite / fixture / environment / CI / artifact schema | current `05` 未重建 | Step 16 只定义最小切口,不是完整测试方案 | current `05` | 否;但阻塞验证 |
| AC / VETO / evidence / release rule | current `06` 未重建 | 不能由实现者判断什么算通过 | current `06` | 否;但阻塞验收 |
| phase / task / commit boundary | current `07` 未重建 | 需要正式 `03/05/06` 才能形成依赖 / test / acceptance closure | current `07` | 否;但阻塞开工 |
| implementation ledger / all planned boundary skeletons | current version absent | 实现恢复点和 gate 必须由设计计划预建,不能让 agent 边做边补 | current `07` 完成时同时创建 | 否;但阻塞开工 |
| target repository | `/home/aris/Projects/quantalithos-observability` absent | workspace、git、Cargo reality 无法核实 | `07` implementation precondition / initialization boundary | 否;但阻塞 kickoff |
| target git identity | not verified | design repo identity 不能替代 target repo local config | target repo exists before first commit | 否;但阻塞 commit |
| physical persistence product / DDL | not selected / not designed here | Step 11 只给 logical contract,产品与物理 schema需由受控 boundary / spike映射 | current `04/07` or explicit spike | 否 |
| transport routes / topics / RPC / schedules | route-neutral | 必须由 typed config / adapter binding映射,不能写死在 domain/contracts | current `04/07` | 否 |
| external adapter product capability | product-neutral contract only | Unsupported probe / idempotency能力必须按真实 adapter验证 | `04/07` spike / boundary precheck | 否 |
| exact performance / capacity / SLO numbers | 当前无稳定来源 | 不得从旧 README 的 P95 / 10w / 15s 数字继承 | current `05/06` 如有来源再定义 | 否 |
| exact retention duration / lease / retry / backoff | typed semantics已定义,数值未定义 | 数字不得改变 state / no-write / token invariant | current `04` | 否 |
| real scripts | only five planned command contracts | 当前没有 script file,实现顺序和gate需 `07` 定义 | current `05/07` | 否 |
| run / artifact / report / evidence / verdict / signoff | nonexistent by design | 只能由真实执行和审查产生 | implementation / test / acceptance stage | 否 |
| README current-round rewrite | historical conflict recorded | 不影响 `03` 继续,但不能作为实现说明 | 后续单独校准或正式文档链完成后同步 | 否 |

## 14. `07` Phase / Commit-Boundary 整体审计输入

### 14.1 审计目的与责任

本 Step 只提供审计输入。current `07` 的设计者必须在正式移交实现前,按**每个** phase / commit boundary 对正式 `03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 做整体可落码闭环审计。

- 设计者负责选择适用标准项、发现 blocker、回写设计、调整 boundary 和固定新 baseline。
- 实现者只在开工前做二次校验,确认 target repo reality 与审计结论仍一致。
- 实现者不负责现场补 schema、port、state、test evidence 或 phase boundary。

### 14.2 审计输入 inventory

| 审计面 | Step 17 提供的输入 | `07` 必须增加的 boundary-specific 内容 |
|---|---|---|
| scope / ownership | §8.1 / §9.1;正式 `00/01/02` | current boundary FR / capability、write target owner、non-scope |
| module / file | §8.2;Step 04 / 05 | exact files、creation / modification order、Cargo edge |
| object / field | §8.3 / §12.2;Step 06 | 当前涉及 required fields、source、factory、secondary type closure |
| port / callable | §8.4;Step 07 | exact method set、fake / durable implementation、call graph closure |
| protocol | §8.5 / §12.3~§12.5;Step 08 | current request/response/event/job schema + entry mapping |
| flow / side effect | §8.6 / §9.2;Step 09 | boundary内 function order、UoW、external call cut |
| state | §12.6;Step 10 | current variants / transitions / reserved exclusion / test assertions |
| persistence | §8.7 / §12.2;Step 11 | physical mapping、version/cursor source、transaction/conformance gate |
| error / recovery | §8.7;Step 12 | current internal/public/entry mapping、retry/manual/rollback behavior |
| concurrency / idempotency | §8.7;Step 13 | exact key/digest/source version/claim/fence/token/probe tests |
| config / binding / entry registration | §8.7 / §12.11;Step 07 R2 / Step 14 + current `04` | exact key/profile/adapter capability/historical binding lifecycle；safe item/private slot/finite catalog/group registration closure |
| telemetry / audit | §8.7;Step 15 | current log/metric/span/audit points、allowlist、failure semantics |
| test / script | §9.3 / §9.4;Step 16 + current `05` | executable command、fixture/environment、artifact producer、failure output |
| acceptance | current `06` | exact AC / VETO / evidence consumer / reviewer;不得引用虚构 alias |
| commit | §11.3 + current `07` | one boundary -> one compliant commit;actual gate pass before commit |

### 14.3 每 boundary 的适用经验审计

`07` 必须从 `设计真相源闭环与可落码性标准.md` 的历史阻塞经验中选择当前 boundary 适用项。至少检查:

| 经验项 | 何时适用 | 本项目证据入口 | 典型 blocker |
|---|---|---|---|
| secondary public type closure | DTO / field / port引用helper/ref/reason/marker | Step 06 / 08 | 类型只有名字无schema / owner |
| factory required-field closure | boundary构造domain / projection / report | Step 06 / 09 / §12.2 | factory缺required source |
| Query view / identity / marker closure | 任一 Query / read model | Step 08 §7.6 / §12.4 | 只有返回类型名,无字段/identity/degraded source |
| public job surface closure | current flow暴露Job | Step 08 / 13 / §8.5 | Job DTO/report/claim/fence后置 |
| accepted side-effect inventory | Command / Consumer accepted path | Step 09 / 11 / §9.2 | history/outbox/result/stale写集遗漏 |
| outbox snapshot closure | emits Outbound Event | Step 08 / 11 / 14 | publisher需读取current truth或route |
| external intent/token/probe closure | handoff/export/publish | Step 13 / 14 | unknown outcome只能blind retry |
| projection composite / fence closure | rebuild/read model/diagnostic | Step 09 / 11 / 13 | partial replace或source race标Fresh |
| idempotency identity separation | Command/Consumer/Job duplicate | Step 13 | raw key/business key/work key混用 |
| source version closure | Inbound / reference update | Step 06 / 08 / 13 | 用timestamp猜顺序 |
| no-write fail-closed | Query/replay/handoff/export | Step 09 / 12 / 15 | marker失败后仍执行forbidden write |
| config cannot change invariant | runtime / adapter boundary | Step 14 + current `04` | config放宽body-free / state / idempotency |
| telemetry ownership / recursion | instrumentation boundary | Step 15 / 16 | log/metric成为truth或递归回灌 |
| artifact materialization | scripts / test / acceptance | Step 16 + current `05/06` | script/report没有真实artifact input |
| entry registration closure | worker/jobs/config/runtime boundary | Step 07 R2 / Step 14 R2 / §12.11 | locator进入entry、catalog非finite、partial active root、scheduler补造Job request |

### 14.4 Boundary audit template input

```md
#### <boundary_id> 交付实现前闭环审计

| 项 | 内容 |
|---|---|
| Boundary | `<boundary_id>` |
| Design baseline | `<真实存在的 baseline>` |
| Included surfaces | `<objects / protocols / flows / states / stores / scripts>` |
| Excluded future surfaces | `<明确排除>` |
| Formal sources | `<03/05/06/07 exact sections>` |
| Calibration sources | `<exact files / sections>` |

| 审计项 | 适用标准 / 经验项 | 证据位置 | 结论 | blocker / 处理 |
|---|---|---|---|---|
| field / DTO closure | ... | ... | pass / not_applicable / blocker | ... |
| Query / public type closure | ... | ... | ... | ... |
| state / trigger closure | ... | ... | ... | ... |
| persistence / side-effect closure | ... | ... | ... | ... |
| idempotency / reentry closure | ... | ... | ... | ... |
| config / telemetry closure | ... | ... | ... | ... |
| test / evidence / acceptance closure | ... | ... | ... | ... |
| phase dependency closure | ... | ... | ... | ... |
| naming / historical conflict | ... | ... | ... | ... |
```

`not_applicable` 必须说明理由。只写“遵循标准”不能视为审计。若任一适用项是 blocker,不得移交该 boundary,必须先回写设计真相源并重新固定真实 baseline。

### 14.5 Blocker 回报输入

实现 agent 二次校验发现不一致时,回报至少包含:

| 字段 | 内容 |
|---|---|
| boundary id | 当前 `07` / ledger 中的 exact boundary |
| baseline | 实际读取的 design baseline |
| conflict location | target file / type / signature + design source |
| missing closure | field / DTO / port / state / flow / persistence / test / evidence / phase |
| observed impact | 为什么无法按当前 boundary 落码或验证 |
| safe stop | 已停止在哪一步,是否产生任何 durable / external effect |
| requested design action | 回写哪份正式文档 / calibration 或调整哪个 boundary |

禁止回报“设计不够清楚,我先按代码补了”。

### 14.6 Ledger 与 skeleton 创建边界

| 产物 | 本 Step 17 | current `07` 完成时 | 实现阶段 |
|---|---|---|---|
| `project_execution_ledger.md` | 更新设计恢复点 | 继续记录文档链状态 | 不替代 implementation ledger |
| `implementation_execution_ledger.md` | 不创建 / 不刷新旧材料 | 必须按全部 planned boundaries 创建当前版本 | 每次 boundary 切换更新真实状态 |
| `implementation-boundaries/<boundary_id>.md` | 不创建 skeleton | 必须一次创建所有 planned skeleton,每个绑定 `07` | 当前 boundary 写入真实执行 / gate / commit 状态 |
| commit / run / evidence | 不创建 / 不伪造 | 只定义真实产生规则 | 由实际执行写入 |

### 14.7 Inherited affected activation gates

下表是 `07` 必须逐 boundary 消费的激活门禁,不是普通 backlog。`design record exists` 只允许规划受影响
boundary；在对应 owner 的 current 正式文档或受控验证关闭 affected 前,不得实现 positive path、启用 entry、
声明 vertical slice 完成,也不得用 placeholder、默认值或 private type 绕过。

| affected ID | 当前缺口 | `07` 必须阻塞的 boundary | 未关闭前唯一允许行为 | 关闭真相源 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | I05 event payload schema 无唯一上游 owner | I05 decode、schema negotiation、accepted Consumer positive path | 保留 slot；在 decode / UoW 前返回 typed unsupported / reserved | 上游 producer schema + current `03/04/07` binding audit |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | I05 producer event identity / binding 未固定 | I05 producer binding、consumer registration 与 enabled entry | disabled 或 startup fail closed；零 source write | 上游 producer owner + current `04/07` |
| `R06.6-F2-H13-UPSTREAM` | H13 `ReplayScopeTransition` 仍为 explicit no-record | J06 positive execution、completion 与 H13 audit write | `Blocked` / manual；零 H13 fabrication、零 source write | H13 owner 的 current design decision |
| `R06-F-AFFECT-UOW-01` | accepted UoW 新顺序尚需全 boundary 传播 | 所有 Command / Consumer accepted mutation 与 owner-coupled Event append | 固定 `stage owner/post-state + membership plan -> assign cursor -> construct/append cursor-bound history/outbox/stale -> result -> complete -> commit` | current `03` + `07` boundary audit |
| `S08-RECOVERY-CLASS-OWNER-01` | recovery class owner 与 public mapping 尚未全量闭合 | error mapper、retry/dead-letter/manual decision boundary | 保持 `DomainError::ReservedTransition` 与 `ApplicationError::ReservedTransition` 分层；未知分类 fail closed | current `03/05/07` exact mapper audit |
| `R07-EXTERNAL-PHASE-LINK-01` | external phase 与 local intent/result link 未逐 adapter 验证 | publication、handoff、export external-call/finalize boundary | 先持久化 immutable intent；link 不完整则不调用 external target | current `04/07` capability / binding record |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | same-token retry / probe accounting owner 未闭合 | publication、handoff、export retry / probe / manual boundary | Unknown 保留 intent 并 probe / manual；禁止 blind retry、换 token | current `04/07` capability audit |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | Consumer accepted outbox/result surface 未逐项闭合 | 9 Consumer 中需要 follower Event 的 accepted boundary | 无 owner-coupled snapshot 则回滚；不得 commit 后从 current truth 补建 | current `03/07` vertical slice |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | Consumer commit-unknown completion/action 未全量闭合 | worker ack/retry/dead-letter 与 duplicate probe boundary | 不 ack success；按 stored result / reservation probe 后 retry 或 manual | current `03/05/07` exact Consumer gate |
| `S08-JOB-REPORT-REF-OWNER-01` | Job report ref 的唯一 owner / mint / durable relation 未全量闭合 | 9 Job result/report/finalize boundary | 不生成假 report ref；缺 owner 时不得 finalize `Completed` | current `03/07` Job vertical slice |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | public secondary carrier 的唯一 owner 仍有 inherited gap | contracts/public protocol、DTO assembler、wire compatibility boundary | 不建 alias / duplicate enum；缺 owner 在 entry / UoW 前拒绝 | current `03` owner registry + `07` compile boundary |
| `03-RPR-S09-PER-FLOW` | 60 协议虽有记录,逐 flow 落码审计仍需绑定 | 对应 60 个 protocol vertical slice | 只引用 exact flow card；共享模板不能单独作为完成依据 | current `03` Step 09 + `07` per-boundary audit |

激活审计必须同时保留以下聚合事实：`60 = 16 + 14 + 9 + 12 + 9`，`60/60` 有设计记录，
`0/60` 无条件完成；27 个正式状态机均有设计记录，但任何状态机记录都不能替受影响 protocol 补 schema、
owner、UoW、recovery 或 external capability。

## 15. 下游文档与 Step 门禁

### 15.1 Step 18 承接

本轮用户已授权一次完成 M3,因此 Step 18 可在本 Step 静态门禁通过后继续。Step 18 至少必须承接:

| 输入 | Step 18 必须判定 |
|---|---|
| README / formal `03~07` historical conflicts | risk、blocker、accepted historical debt 或后续同步项 |
| target repo absent | design risk vs implementation precondition |
| product / physical adapter selection | 是否需 spike,是否阻塞某类 future boundary |
| exact config / performance / retention values unresolved | 哪些留 `04/05/06`,哪些会阻塞正式 `03` |
| public Command / Job name collision | 当前静态映射是否足够,是否还需正式风险说明 |
| reserved transitions | 明确 current non-scope 和未来启用条件 |
| `04~07` historical material | 正式文档重建顺序和禁止沿用项 |
| §14.7 inherited affected register | 逐项保留 12 个稳定 ID、当前状态、阻塞范围、未关闭前行为和关闭 owner；不得合并成“无 blocker” |

本 Step 未发现**新的**、要求在进入 Step 18 前回写正式 `00/01/02` 的上游 blocker；I05 两项既有
`open_upstream_internal`、H13 既有 `open_controlled` 以及其余 inherited affected 必须继续阻塞各自 boundary。

### 15.2 Step 19 承接

本轮 M3 连续授权下,只有 Step 18 完成 affected-aware 风险分类后,Step 19 才能:

1. 按 Step 01~18 全量装配正式 `03-详细设计.md`。
2. 保留每章 calibration source 和延伸阅读入口。
3. 确保七模块、60 protocol、27 state、logical persistence、error/idempotency/config/telemetry/test cut 不被压缩成不可落码摘要。
4. 运行 cross-reference、heading、table、fence、naming、historical token、protocol count、state count 和 `git diff --check`。
5. 不把 Step 17 的 implementation precondition误写为已满足。
6. 传播 §14.7 affected gate、Step 16 reserved positive test gate和 accepted UoW 新顺序。

### 15.3 `04~07` 正式文档边界

| 文档 | 从本 Step 承接 | 继续展开 | 不得沿用 / 不得做 |
|---|---|---|---|
| `04-配置设计.md` | Step 14 typed config / binding / runtime assembly | key、source、precedence、profile、validation、activation、rollback、secret ref | 旧产品 config;配置改变 truth / protocol |
| `05-测试方案.md` | Step 16 cut + Step 13 canonical IDs + Step 15 safety | suite、case、fixture、environment、automation、artifact / report | 宣称设计切口已执行 |
| `06-验收标准.md` | current `00` acceptance direction + formal `03` invariants + current `05` evidence | AC、VETO、evidence、review、release / signoff rule | 伪造 verdict / alias /签署 |
| `07-实施计划.md` | formal `03/04/05/06` + 本 Step audit input | phase、task、commit boundary、reading matrix、gate、rollback、ledger / skeleton | 重写 schema / flow / state;省略逐boundary审计 |

文档切换仍遵守“一份正式文档完成并停审,用户确认后才能进入下一份”。
`04~07` 不得把 `0/60` 无条件完成改写成“详细设计已全部 implementation-ready”；每个实施 boundary 必须显式消费 §14.7。

## 16. 正式 `03` §16 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_17_implementation_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读本文件 §8~§14,了解实施契约 inventory、前置阅读、跨文档闭环、implementation precondition 和 `07` 逐 boundary 审计输入。

### 16. 详细设计到实施计划的承接清单

本详细设计已经为实施计划形成以下设计记录:七模块 workspace 与依赖方向、public / domain / application object schema、application-owned port、infra-entry technical registrar、16 Command / 14 Query / 9 Inbound Consumer / 12 Outbound Event / 9 Operations Job、逐接口 flow、27 个正式状态机、logical persistence / transaction / consistency、typed error / recovery、concurrency / idempotency / reentry、typed config / external binding、log / metric / trace / durable audit 分层以及最小测试 / script 切口。协议聚合结论必须写作 `60/60` 有设计记录、`0/60` 无条件完成；Registration seam固定为raw binding infra-only、locator-free safe item、prebuilt registrar、finite handler catalog、all-or-nothing register与opaque process handle。

实施计划必须精确引用本详细设计与对应 calibration source,只继续展开 phase、task、commit boundary、编写顺序、test / acceptance gate、暂停 / 回退和实施完成判定。实施计划不得复制对象字段表、DTO schema、状态矩阵、函数 flow 或 logical store 形成第二真相源。

实施者开始编码前必须读取当前轮正式 `00~07`、当前 boundary 指定的 calibration 产物、Rust 编码规范、目录与依赖裁剪规范、真相源闭环标准、实施台账规范和提交规范。正式移交实现前,`07` 必须按每个 phase / commit boundary 对正式 `03/05/06/07` 完成整体可落码闭环审计,并创建 current implementation ledger 和全部 planned boundary skeleton。

Observability 只拥有 observation-owned fact、audit projection、body-free evidence linkage、report handoff、retention / no-write / gap marker、history / outbox / stored result 和派生维护事实。它不拥有 Governance、Artifact、Identity、Runtime、Sandbox、Archive、Bus 或外围产品业务 truth,不保存 raw log / metric / trace / audit / evidence body,不由 Query / replay / handoff / export / retention flow 反写 source truth。

当前 `03` Step 17 完成只表示 detailed-design handoff record 可供 Step 18/19 和 `07` 继续消费。§14.7 的 inherited affected、目标实现仓、正式 `03` 装配、当前轮 `04/05/06/07`、逐 boundary 审计、implementation ledger / skeleton 和真实测试 / evidence 尚未满足前,不得移交实现。

## 17. 最终自检与门禁

### 17.1 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否读取 Step 17 SOP、书写规范 5.16、中间产物 5.10 与实施计划规则 | pass | 已用于固定产物结构和 `07` 边界 |
| 是否读取 current formal `00/01/02` 与 Step 01~16 | pass | inventory和closure可逐项回指 |
| 是否只把 L1 项目作为粒度参考 | pass | 未复制 Governance / Artifact / Identity truth |
| 是否诊断 README / old `03~07` / old ledger | pass | 均记录 historical material 或 pending replacement |
| 是否输出实施承接清单 | pass | §9 |
| 是否输出实施前置阅读清单 | pass | §10 |
| 是否包含 git config、commit、Rust 和注释规范 | pass | §10.2 / §11.3 |
| 是否输出真相源、字段、构造、Query、public type、状态、phase、命名、冲突和正反例 | pass | §12.1~§12.10 |
| 是否覆盖 16 / 14 / 9 / 12 / 9 全部 public protocol | pass | §8.5 / §12.3~§12.5 |
| 是否覆盖 27 正式状态机 + Job plan item | pass | §12.6 |
| 是否明确 observation-only / body-free / no-write / no-signoff | pass | §6 / §9 / §16 |
| 是否给 `07` 提供逐 boundary 整体审计输入 | pass | §14 |
| `CFG-BLK-09-01` exact file/type/order/test/pause closure是否完整 | pass_after_R2 | §12.11；不新增phase、boundary、commit或evidence事实 |
| 是否提前定义 phase / commit boundary | no | 只定义 closure rule和模板 |
| 是否创建 implementation ledger / boundary skeleton | no | 明确留 current `07` 完成时 |
| 是否要求同步正式 `03-详细设计.md` | pending Step 19 | 本文件只提供回填草稿和 affected activation gate,不替代 formal truth |
| 是否读取或进入 Step 18 | allowed after this gate | 用户已授权一次完成 M3；必须先完成本 Step 再顺序进入 |
| 是否创建代码、脚本、测试、artifact、report | no | design-only |
| 是否伪造 commit、run、evidence、test result、verdict、signoff | no | 全文保持planned / pending / not-run语义 |
| 是否发现新的上游 blocker | no | I05 两项既有 `open_upstream_internal`、H13 既有 `open_controlled` 和其余 inherited affected 均未关闭 |
| 是否把 affected 绑定到实施边界 | pass | §14.7 逐项给出阻塞 boundary、允许行为与关闭真相源 |

### 17.2 当前 Step 切换条件

```text
Step 17 implementation handoff artifact is complete.
Field, DTO, Query, public type, state, naming, and pre-phase closure are reviewable.
No new upstream blocker was found.
All twelve inherited affected items remain visible and are bound to activation gates.
Only Step 18 may consume this artifact under the current M3 authorization.
Formal 03 remains blocked until current Step 19 assembly.
```

### 17.3 门禁

| gate | 状态 | 说明 |
|---|---|---|
| Step 17 输入门禁 | pass | 标准、上游、Step 01~16、L1 参考和本地现实已读取 |
| Step 17 内容门禁 | pass | inventory、handoff、reading、closure、precondition、`07` audit input均已完成 |
| 上游 blocker | no_new_blocker | 无需回退正式 `00/01/02`；I05/H13 既有 blocker 与其余 inherited affected 保持开放 |
| 正式 `03` 门禁 | blocked_until_current_step_19 | 4990行pre-M2装配稿仍需传播M2/M3 closure、affected状态和current UoW顺序 |
| implementation readiness | blocked | current `04~07`、target repo、audit、ledger/skeleton与真实tests/evidence尚未完成 |
| Step 切换门禁 | continue_M3_step_18_under_current_user_authorization | 只允许Step 18消费,不得进入`04`或实现阶段 |

当前恢复记录:

```text
03-详细设计 / Step 17 收口详细设计到实施计划的承接清单 / completed_design_record_with_affected_open
gate_status = pass_with_affected_open
next_allowed_action = continue_M3_step_18_under_current_user_authorization
```

下一步只读取 Step 18 对应 SOP / 书写规范、Step 01~17 未关闭项、本文件 §13~§15 和项目台账。不得读取或修改任何 `04` 文件,不得创建 implementation ledger / boundary skeleton,不得实现代码或提交 commit。
