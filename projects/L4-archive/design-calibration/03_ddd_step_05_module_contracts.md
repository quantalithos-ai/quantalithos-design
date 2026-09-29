# Step 5. 定义模块实现契约主轴

## 1. Step 状态与执行计划

- 状态：`completed / pass_with_upstream_blockers / stop_review`；`current_part = closed`。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5。
- 未来回填：`03-详细设计.md` §5“模块实现契约”。
- 开工依据：[Step 4](03_ddd_step_04_units_file_layout.md) 已通过；用户已明确授权当前 Step 05，并要求 Step 05～Step 10 每步完成后单独审查。
- 本步边界：只收稳模块主轴、职责、暴露面、依赖和归属；不展开字段、函数签名、trait method、协议 schema、处理流或状态矩阵，不修改 historical 正式 03。

### 1.1 本 Step 串行小循环

| 阶段 | 动作 | 产物 | 状态 |
|---|---|---|---|
| A | 恢复 Step 4、flow 与项目台账，核对正式 00/01/02 分母 | 开工门禁和输入基线 | completed |
| B | 读取 Step 5 SOP/书写规范及 `L1-governance` 架构与 Step 5 粒度样本 | 参考裁剪结论 | completed |
| C | 回答 SOP 五问，诊断旧主轴和 Step 4 待闭口项 | 问题回答、诊断、取舍 | completed |
| D | 建立六模块总览、精确依赖、职责与暴露面 | 模块主轴 | completed |
| E | 审计 6 CP、26 对象、30 入口、7 port family、adapter/store/handler 唯一归属 | 全分母归属表 | completed |
| F | 形成回填草稿、复杂度判断、历史污染审计和完成门禁 | Step 6 承接与停审记录 | completed |

## 2. 本步输入与参考裁剪

### 2.1 正式输入

- 本仓：[正式 00](../00-需求文档.md)、[正式 01](../01-架构设计.md)、[正式 02](../02-概要设计.md)，以及 Step 1～4 校准链。
- 规范：`详细设计讨论流程_SOP.md` Step 5、`详细设计书写规范.md` §5.5、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`、`子项目目录与代码文件组织规范.md`、`standards/coding/rust.md`。
- 专项边界：正式 02 的 6 个 capability partition（CP1～CP6）、26 个正式对象、3 Command、5 Query、5 Consumer、17 Operations Job、7 类 required/local port 与 3 个未关闭的 outbound event candidate。
- 当前事实：目标实现仓 `/home/aris/Projects/quantalithos-archive` 不存在；以下内容全部是 planned contract，不是源码、Cargo graph 或运行证据。

### 2.2 `L1-governance` 参考粒度与架构裁剪

| 参考内容 | 本仓吸收方式 | 本仓明确不继承 |
|---|---|---|
| 正式 01 的 inward dependency、port-adapter 与入口/后台分离 | 用技术 role 形成可由 Cargo 约束的单向模块轴 | Governance truth、Gate、Decision、Policy、Control、Nonconformity 等领域主语 |
| 正式 02 的“业务组成部分跨技术模块实现” | CP1～CP6 是业务能力轴，不直接拆 crate | 把业务组成部分或对象清单直接当 crate |
| Step 5 的模块总览、逐模块职责、文件主体、归属和测试预告 | 采用同等审查维度并补齐 Archive 全分母 | 复制其七 role、`jobs` crate、outbox/publisher、route/server 或 external GRC 选择 |
| application 定义 ports，infra 实现 ports，入口层调用 application | 作为本仓依赖倒置主线 | 让 adapter、provider、worker 或查询入口获得业务裁决权 |
| 入口模块不承载 truth | `api` / `worker` 只做 validation、dispatch、composition 和 error mapping | 将 event arrival、provider ACK、handoff response 当 archive/restore success |

参考结论：采用 `L1-governance` 的架构组织方法和审计深度，而不是它的领域内容或物理拆分结果。Archive 已在 Step 4 独立证明只需六个 role；治理仓存在 `jobs`、outbox、publisher 或 API route，不构成本仓新增它们的依据。

## 3. SOP 问题回答

1. **本仓详细设计应该拆成哪些实现模块？**

   以 Step 4 已收稳的 workspace member 为主轴，共六个实现模块：`contracts`、`domain`、`application`、`infra`、`api`、`worker`。CP1～CP6 是贯穿这些模块的归档业务能力轴，不是一组 crate；17 个 Operations Job 是 worker 内 logical handlers，不创建 `jobs` 模块或 17 个 binary。

2. **每个模块对应概要设计中的哪个主要组成部分或代码主体？**

   - `contracts` 承接跨层共用的 `DeclaredArchiveScope`、`GovernanceDecisionRef`，以及 Archive-local refs/context、3 Command、5 Query、5 Consumer local carriers、17 Job I/O、五类 safe view 与 protocol error。
   - `domain` 承接 CP1～CP6 其余 24 个 Archive-owned truth/value/history 对象、状态、不变量和纯 closure/assessment/eligibility guard。
   - `application` 承接八个 service family、Archive-local transaction/idempotency 编排和七类 required/local port 定义。
   - `infra` 承接 Archive store、六类 external adapter family、consumer envelope mapping、配置绑定与 fail-closed construction。
   - `api` 承接 3 Command 与 5 no-write Query 的 transport-neutral handler。
   - `worker` 承接 5 Consumer、17 Operations Job、consumer/operation loop、唯一 planned process entry 和 shutdown。

3. **每个模块对外暴露什么？**

   `contracts` 暴露经 Step 6/8 闭合的 typed carriers、DTO、views 与 safe error；`domain` 只向本仓 application/infra 暴露 Archive truth、纯规则和 `DomainError`；`application` 暴露 services、read/write capability 分离的 ports、UoW/idempotency 和 `ApplicationError`；`infra` 暴露 adapter constructors、config validation 和 runtime construction，不暴露 provider truth；`api` 暴露 handler library surface；`worker` 的 library surface只服务本仓 binary 与测试，binary 是唯一当前 planned 运行入口。`api` 的 host/transport 尚未选择。

4. **每个模块允许和禁止依赖哪些模块？**

   精确 planned Cargo 边为：`contracts -> core-contracts`、`domain -> contracts`、`application -> contracts + domain`、`infra -> contracts + domain + application`、`api -> contracts + application`、`worker -> contracts + application + infra`。禁止任何反向边、入口模块互相依赖、`api -> infra`、`worker -> domain` 直达，以及任一 L1/L4/Bus/SDK/provider sibling 进入 Cargo graph。仅 `contracts` 直接引用已核验且语义适用的 `core-contracts` symbol；其他 crate 通过 Archive contracts 间接使用。

5. **哪些对象、trait、handler、repository 应归属于哪个模块？**

   26 个正式对象中，`DeclaredArchiveScope` 与 `GovernanceDecisionRef` 因跨 Command/domain 共用而归 `contracts` 的独立文件，其余 24 个 truth/value/history 对象归 `domain` 的十四个主语文件；其余 protocol DTO/ref/view/error 也归 `contracts`。八个 service、七类 port、UoW/idempotency/error 归 `application`；store/external adapter/config/builder 归 `infra`；3 Command 与 5 Query handler 归 `api`；5 Consumer 与 17 Job handler/loop 归 `worker`。本仓不新增 domain repository 对象或 provider-specific repository 名；`ArchiveStorePort` 的读取、版本写入和 UoW surface 在 Step 7/11 闭合，`store_adapter.rs` 只在 infra 实现该本地 port。

## 4. 当前材料问题诊断

| 位置 | 问题 / 风险 | 本步处理 |
|---|---|---|
| 正式 02 §4/§5 | 业务 CP、代码主体和实现层已给出，但还不能直接推导 Cargo/module contract | 固定六个技术模块，并将 CP 映射为跨模块 vertical slice |
| Step 4 | 文件树是 allowed maximum，member 精确依赖与 exports 仍待收缩；两类 public Command value/ref 起初落在 domain | 固定六个 member 的直接依赖和最小暴露面；将 `DeclaredArchiveScope` / `GovernanceDecisionRef` definition owner 校正到 contracts，消除反向依赖/同名 shadow risk |
| Step 4 图 | `infra`、`api`、`worker` 的依赖可被误读为所有外层都可直接访问所有内层 | 明确 `api` 不依赖 infra、worker 不直达 domain、只有 infra 实现 application ports |
| 正式 02 §7.6 | `ArchiveStorePort` 是一个 local family，但 repository/UoW 方法尚未定义 | 本步只固定 owner=`application`、impl=`infra`；精确方法留 Step 7/11 |
| 正式 02 §7.7 | 三个 outbound event 仍是 candidate | 不创建 event/outbox/publisher 模块或暴露面；继续由 `AR-HLD-Q-001` 阻断 |
| 旧正式 03 / README | 单体目录、retention/legal hold、固定 storage/security/provider 主语污染 | 不继承；只承接新版正式 00/01/02 与 Step 1～4 |
| `L1-governance` 样本 | 有 `jobs`、API routes、outbox/publisher 等经其领域证明的模块 | 只借方法与粒度；Archive 没有相同 authority，不复制结构 |
| application composition | API library 不依赖 infra 时，未来同步宿主尚无落点 | handler 只接收构造好的 application facade；host/transport 在正式合同出现前保持 pending，不以反向依赖补洞 |

没有发现需要新增、删除、合并或改名 CP、正式对象或入口的矛盾，因此无需回退正式 02。发现的两对象归属问题属于 Step 4 planned layout 校正，已同步回写 Step 4；正式对象总数与业务语义不变。外部合同缺口继续作为 blocker，不妨碍本地模块轴收稳。

## 5. 改动前后对比

| 维度 | Step 5 前 | Step 5 后 | 原因 |
|---|---|---|---|
| 详细设计主轴 | 六个 planned workspace role + 文件树 | 六个同名实现模块 + 精确职责、暴露和依赖 | 让后续对象/trait/protocol 能按模块串行闭口 |
| CP | 作为概要业务组成 | 明确为跨模块 vertical slice | 避免按 CP 拆 crate 或服务化 |
| direct dependencies | Step 4 给 allowed maximum | 收缩为逐 member direct dependency matrix | 防止 transitive convenience dependency 扩权 |
| API 装配 | transport-neutral，但未来 wiring 易被误解 | API 只依赖 contracts/application；host 接缝 pending | 保证 no-write query 不获得全写 infra runtime |
| worker/jobs | 一个 worker role，17 logical jobs | 维持一个 worker module/binary，按六 handler family 分组 | 避免 17 个调度入口和重复 role |
| Core 使用 | 唯一 compile candidate，member 未定 | 仅 contracts 可直接依赖已核验 Core symbol | 把 shared vocabulary 转换集中在公共边界 |
| 外部协作 | 文件树已有 adapter seam | 明确全是 runtime/event/ref/adapter，不进入 module dependency | 防止 L1 truth 或 provider SDK 渗入核心 |
| outbound | 无 production 文件 | 继续无 event/outbox/publisher module/export | 不越过 `AR-HLD-Q-001` |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| 以六个 workspace role 作为模块主轴 | Cargo 可约束依赖，文件/测试 owner 清晰 | 每个 CP 需要跨模块映射 | 采用 |
| 以 CP1～CP6 各建 crate | 业务名直观 | DTO/domain/service/adapter 重复并引入横向循环 | 不采用 |
| 复制 Governance 的七 role 并新增 `jobs` | 表面与样本一致 | 与 Step 4 结论冲突，重复 worker 调度语义 | 禁止 |
| `api` 依赖 infra 并自行装配 | 单包启动方便 | 查询入口获得写 adapter，且伪选 host | 不采用 |
| 所有 member 都直接依赖 Core | 使用 shared type 方便 | 扩大 compile surface，形成跨层耦合 | 不采用；只允许 contracts 直依赖 |
| 在 application 定义 required ports，由 infra 实现 | 核心语义不受 provider 控制，外部缺口可 fail-closed | mapping 与 wiring 成本更高 | 采用 |
| 为 outbound candidate 预建 events/outbox | 未来可能少改目录 | 把未核验合同变成实现暗示 | 禁止；关闭 blocker 后回退 02/Step 4/本 Step |

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 直接依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `archive-contracts` | 定义 2 个跨层正式 value/ref 对象和 Archive-local public/worker protocol vocabulary，不承载 owner truth | `DeclaredArchiveScope`、`GovernanceDecisionRef`、typed refs/context、Command/Query/Consumer/Job DTO、safe views、protocol errors | 已核验 `core-contracts` symbols only |
| `domain` | `crates/domain` / `archive-domain` | 定义其余 24 个 Archive-owned truth/value/history 对象、状态与纯规则 | domain objects、state/value types、pure guards、`DomainError` | `archive-contracts` |
| `application` | `crates/application` / `archive-application` | 编排 30 个入口对应的用例、局部 UoW、幂等、外部效果意图与 ports | 八 service family、七 port family、UoW/idempotency、`ApplicationError` | `archive-contracts`、`archive-domain` |
| `infra` | `crates/infra` / `archive-infra` | 实现本地 store 和 external adapter，绑定 config，构造 fail-closed runtime | adapter/config/builder constructors、technical error mapping | `archive-contracts`、`archive-domain`、`archive-application` |
| `api` | `crates/api` / `archive-api` | 承接同步 3 Command 与 5 no-write Query，保持 transport-neutral | command/query handlers、safe handler error mapping | `archive-contracts`、`archive-application` |
| `worker` | `crates/worker` / `archive-worker` | 承接 5 Consumer、17 logical Job、loop、lease/fence/checkpoint 和进程生命周期 | worker runners/dispatchers；`archive-worker` binary | `archive-contracts`、`archive-application`、`archive-infra` |

### 7.2 模块依赖图：L4-archive 模块实现主轴

```text
                         +------------------+
                         |  core-contracts  |
                         +---------^--------+
                                   |
                         +---------+--------+
                         |     contracts    |
                         +--^------^------^--+
                            |      |      |
                   +--------+      |      +---------+
                   |               |                |
             +-----+-----+   +-----+------+   +-----+-----+
             |  domain   |<--+ application |<--+    api    |
             +-----^-----+   +-----^---^---+   +-----------+
                   |               |   |
                   +-------+-------+   |
                           |           |
                       +---+---+       |
                       | infra |<------+
                       +---^---+
                           |
                       +---+----+
                       | worker |
                       +--------+

external runtime/event/ref/adapter only:
owners / bus / workspace / artifact / observability / storage /
integrity / governance decision / restore receivers / SDK consumers
```

图示约定：箭头从依赖方指向被依赖方；为可读性，`application -> contracts`、`infra -> contracts`、`api -> contracts`、`worker -> contracts` 的直接边在图中汇入 contracts 节点，精确边以 §7.3 为准。图不表达调用顺序、运行拓扑、事务或 external contract 已可用。

关键约束：

- `infra` 实现 `application` 定义的 port；`application` 永不反向依赖 infra。
- `api` 不依赖 infra，也没有 server/routes/provider；外部 host 只能注入受限 application facade。
- `worker` 是唯一 concrete composition/process root，但仍只能通过 application service 推进业务；不得用 infra adapter 直写绕过 service。
- `domain` 不执行 I/O，不认识 Tokio、store、provider、owner、Bus、SDK 或 receiver 实现。
- 任何外部 runtime/event/ref/adapter 关系都不是图中的 Cargo edge。

### 7.3 精确 planned Cargo 依赖矩阵

| 依赖方 | 允许的直接本地 crate | 条件性外部 crate | 明确禁止的直接依赖 | 原因 |
|---|---|---|---|---|
| `archive-contracts` | 无 | `core-contracts`，仅逐 symbol 核验后 | 其余 Archive member、L1/L4/Bus/SDK/provider | 公共协议不能依赖内部实现或外部 truth implementation |
| `archive-domain` | `archive-contracts` | 无 | application/infra/api/worker、Tokio、provider | domain 保持同步纯逻辑；shared carrier 从 contracts 输入 |
| `archive-application` | `archive-contracts`、`archive-domain` | 无 | infra/api/worker、provider SDK、owner crate | service 与 required ports 位于依赖倒置内侧 |
| `archive-infra` | `archive-contracts`、`archive-domain`、`archive-application` | 技术 crates 仅在 Step 7/11/14 证明需要并锁定后 | api/worker、任一 sibling 业务实现 | adapter 可实现 port 和映射 domain，但不能依赖入口 |
| `archive-api` | `archive-contracts`、`archive-application` | transport crate 当前无 | domain/infra/worker、server/provider | 只保留 transport-neutral、capability-limited handler |
| `archive-worker` | `archive-contracts`、`archive-application`、`archive-infra` | Tokio 1 系列；其他 runtime crate 后续闭口 | domain/api、L1/L4/Bus/SDK 业务 crate | 唯一运行装配层；外部协作通过 infra adapters |

`core-contracts` 的 planned 根路径仍为 `../quantalithos-core/crates/contracts`。只有 `archive-contracts` member 在确有已核验 symbol 使用时声明 `workspace = true`；其他 member 不为方便重复声明。若 symbol 语义不适配，则定义 Archive-local typed carrier/mapping 或阻塞相关 surface，禁止 shadow copy Core 类型。

### 7.4 依赖关系分类与模块落点

| 关系对象 | 分类 | 本仓定义方 | 实现 / 接入方 | 不得伪装为 |
|---|---|---|---|---|
| Core actor/command/query metadata 候选 | compile | `contracts` mapping boundary | `core-contracts` | 整个 Core 实现依赖 |
| L1 owner snapshot/export | runtime + ref + optional event | `application::ports::source_export` | `infra::source_export_adapters` / worker feedback | owner crate dependency或本仓 canonical truth |
| workspace projection | runtime + ref / Auxiliary | source export port 的明确 Auxiliary branch | source adapter | 任一 L1 canonical material |
| Artifact material/lineage | runtime + ref + optional event | source export port 的 artifact branch | source adapter / worker feedback | Artifact body/lineage ownership |
| observability audit/evidence material | runtime + ref + optional event | source export port 的 redacted material branch | source adapter / worker feedback | audit chain/backend truth |
| Bus trigger/feedback | event + adapter | contracts local consumer carrier | infra consumer mapping + worker | delivery/ack truth 或 Cargo dependency |
| integrity/signature/schema capability | runtime + adapter + ref | integrity/compatibility ports | infra adapters | algorithm/key/schema authority |
| object storage/lifecycle capability | runtime + adapter + ref | archive storage port | infra storage adapter | provider/tier/commit truth |
| governance decision | runtime + ref + optional event | governance decision port | infra adapter / worker feedback | RetentionPolicy/hold/delete/risk truth |
| owner restore receiver | runtime + adapter + ref + optional event | restore receiver port | infra adapters / worker feedback | owner DB 写权或 restored truth |
| SDK/product consumer | downstream adapter + ref | contracts/API public boundary | owning downstream | Archive 对 SDK 的反向 compile dependency |

### 7.5 逐模块职责与暴露面

#### 7.5.1 `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `archive-contracts` / `archive_contracts` |
| 对应概要代码主体 | `DeclaredArchiveScope`、`GovernanceDecisionRef`；typed refs/context；Command / Query / Consumer / Operations Job / safe view / protocol error 骨架 |
| 主要责任 | 为各入口、domain、application 和下游边界提供 Archive-local、body-free、可版本化的 typed carrier/value/ref；集中与 Core shared metadata 的映射 |
| 对外暴露 | `scope`、`governance_decision`、`refs`、`context`、`commands`、`queries`、`consumers`、`operations`、`views`、`errors` 中经审计的公开项 |
| 允许依赖 | 已核验、语义适配的 `core-contracts` symbol |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`；任一 L1/L4/Bus/SDK/provider crate |
| 禁止承担 | Archive truth/invariant、provider envelope truth、raw secret/body、transport route、outbound candidate 合同 |

暴露规则：`lib.rs` 逐项导出稳定 protocol surface，不使用 blanket `pub use`。外部 owner、Bus、provider 的 exact schema 先由 infra adapter 转成 local carrier；local carrier 的名字不声称对端存在同名类型。Step 6/8 必须把所有二级 enum/ref/marker/selection/result 补成 Rust-facing schema，否则不能视为 contracts 已闭口。

#### 7.5.2 `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `archive-domain` / `archive_domain` |
| 对应概要代码主体 | CP1～CP6 中除两个 contracts 跨层 value/ref 外的 24 个 Archive-owned truth/state/value/history 对象与纯业务规则 |
| 主要责任 | 保护 request/job、source binding/capture、bundle/manifest/closure、assessment、placement/lifecycle、restore plan/handoff 的本地不变量和多轴状态 |
| 对外暴露 | 24 个对象及其 current-boundary value/state types、纯 factory/transition/assessment guard、`DomainError`；只供本仓内层协作 |
| 允许依赖 | `archive-contracts` 中纯 Archive-local vocabulary |
| 禁止依赖 | application/infra/api/worker、Tokio、repository/config/clock/provider、owner/Bus/SDK implementation |
| 禁止承担 | 外部 authority、保留/hold/delete/risk 裁决、Artifact 或 owner truth、provider commit、receiver restored 判断 |

domain 可以判断“本仓已有输入是否满足 closure/transition guard”，不能主动读取 owner、governance、storage、integrity 或 receiver。外部 outcome 必须由 application 通过 typed port outcome 传入，domain 不解析技术错误字符串。不同 source 的 opaque version/fence 不做跨 owner 比较。

#### 7.5.3 `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `archive-application` / `archive_application` |
| 对应概要代码主体 | 八个 service family、30 入口用例编排、七类 required/local ports、UoW、idempotency 与 application error |
| 主要责任 | 组织 admission、capture、manifest/closure、assessment、placement/lifecycle、restore/handoff 和 no-write query；划分 local transaction 与 external effect；保持 stable intent、expected version、fence、retry/compensation 语境 |
| 对外暴露 | `ArchiveRequestService`、`SourceCaptureService`、`BundleAssemblyService`、`BundleVerificationService`、`PlacementService`、`LifecycleExecutionService`、`RestoreService`、`ArchiveQueryService`；ports/UoW/idempotency/error |
| 允许依赖 | `archive-contracts`、`archive-domain` |
| 禁止依赖 | infra/api/worker、provider/transport/Bus/owner SDK、具体 DB/object storage/KMS |
| 禁止承担 | 自行批准项目状态/治理决定、跨 owner transaction、provider schema、Bus ack、外部 business commit |

application 是唯一用例编排层。所有写路径必须经 service 和 UoW，不允许 worker 或 infra 自行组合 domain transition。`ArchiveQueryService` 只获得 read capability；不得注入能够 capture、verify、retrieve、repair、handoff 或保存状态的全写 runtime。是否需要 application facade object 及其精确 constructor 留 Step 6 闭口，不能由入口自行从 adapter 拼业务依赖。

#### 7.5.4 `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `archive-infra` / `archive_infra` |
| 对应概要代码主体 | local store adapter、source/integrity/compatibility/governance/storage/receiver adapters、consumer mapping、config、runtime builder |
| 主要责任 | 实现 application ports；在 external schema 与 local typed outcome 之间翻译；构造 enabled capability 集并对缺失/冲突 fail-closed |
| 对外暴露 | port implementation constructors、validated config/runtime builder surface、technical-to-application error mapping；不公开 provider payload |
| 允许依赖 | `archive-contracts`、`archive-domain`、`archive-application`，以及后续经批准的技术 crate |
| 禁止依赖 | api/worker、L1/L4/Bus/SDK 业务实现 crate；禁止由 adapter 反向定义 domain 状态或 policy |
| 禁止承担 | provider选择、key/secret truth、算法/schema authority、owner export/restore authority、readiness 结论 |

adapter 文件存在只说明需要一个实现接缝，不说明 endpoint、provider、credential、schema 或 capability 已可用。每个正向外部路径必须由 runtime builder 依据已验证 binding 显式启用；unsupported/missing/conflicting binding 保持 disabled/blocked，fake 仅从 test support 装配，不能成为 production fallback。

#### 7.5.5 `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `archive-api` / `archive_api` |
| 对应概要代码主体 | synchronous admission and read unit 的 3 Command 与 5 Query handler library |
| 主要责任 | 校验 local contracts request/context，调用受限 application service，映射 safe protocol disposition/error |
| 对外暴露 | command handlers、query handlers、`ApiError`/safe mapping；当前无 route/server/binary |
| 允许依赖 | `archive-contracts`、`archive-application` |
| 禁止依赖 | domain/infra/worker、Tokio host、HTTP/RPC framework、repository/adapter/provider |
| 禁止承担 | 身份认证真相、transport 选择、后台完成、查询时写入、外部恢复或存储副作用 |

Command 返回 accepted/rejected/blocked 或既有安全结果，不把后台阶段说成完成。Query handler 不因名字 `VerifyArchiveBundle` 触发新的 assessment；隐藏与不存在的安全映射必须在 Step 8 闭合。同步 host/composition 未正式确定时，本模块维持 library surface，不能伪造可部署服务。

#### 7.5.6 `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `archive-worker` / `archive_worker` + `archive-worker` binary |
| 对应概要代码主体 | asynchronous trigger/feedback unit、background archive/restore execution unit |
| 主要责任 | 运行五类 consumer dispatch、十七个 logical Job 的有界推进、lease/fence/checkpoint、shutdown 与 fail-closed wiring |
| 对外暴露 | 仓内 consumer/operation runners 和 composition surface；binary 是当前唯一 planned process entry |
| 允许依赖 | `archive-contracts`、`archive-application`、`archive-infra`；Tokio 仅作 I/O/runtime |
| 禁止依赖 | domain/api、L1/L4/Bus/SDK 业务 crate；禁止绕过 application 直接写 store 或直接裁决 outcome |
| 禁止承担 | Bus delivery truth、event authority、无 intent 外部调用、盲重放 commit-unknown、全局 archive/restore success |

consumer loop 完成本地事务不等于 Bus ack 已提交；operation loop 每次只推进一个有持久 intent 和 expected version/fence 的有界步骤。`main.rs` 只装配、启动和停机，不放业务规则。十七个 Job handler 是 worker module 内的逻辑入口，不因此获得十七个独立进程、调度 API 或运维 authority。

### 7.6 文件与代码主体映射

#### 7.6.1 Contracts 与 Domain

| 文件路径 | 代码主体 | 类型 | 责任 / 后续闭口 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | Archive-local ids、refs、external opaque refs | shared contract | 引用只定位，不携带 external truth/body；Step 6 闭合 carrier |
| `crates/contracts/src/context.rs` | actor/command/query/worker context 与 Core mapping seam | shared contract | metadata/idempotency 单一来源；Step 6/8 核验 shared/local 分流 |
| `crates/contracts/src/scope.rs` | `DeclaredArchiveScope` | immutable value object | public Command 与 domain 共用；只校验声明形状，Step 6 闭口 |
| `crates/contracts/src/governance_decision.rs` | `GovernanceDecisionRef` | opaque reference object | public Command/Consumer 与 domain 共用；只绑定 owner decision，Step 6 闭口 |
| `crates/contracts/src/commands.rs` | 3 Command request/result family | DTO | 写入口 public surface；Step 8 闭合 schema |
| `crates/contracts/src/queries.rs` | 5 Query selector family | DTO | 只读请求；Step 8 闭合 selection/page |
| `crates/contracts/src/consumers.rs` | 5 validated local consumer carrier | DTO | 不复制 exact Bus/owner envelope；Step 8 闭合 local input/outcome |
| `crates/contracts/src/operations/{coordination,capture,bundle,verification,lifecycle,restore}.rs` | 17 logical Job I/O family | DTO | Job 不是 binary；Step 8 闭合 input/report |
| `crates/contracts/src/views.rs` | 5 safe query view 与 unavailable marker | DTO/read model | current disclosure；Step 6/8 闭合字段来源 |
| `crates/contracts/src/errors.rs` | safe protocol error/disposition | error | 不泄露 raw provider/source/secret/hidden target；Step 8/12 闭合 |
| `crates/domain/src/{request,job}.rs` | CP1 的 3 个 domain 对象 | truth/history | admission 与 job coordination；scope 来自 contracts；Step 6 逐对象闭口 |
| `crates/domain/src/{source_binding,capture}.rs` | CP2 的 4 对象 | truth/value/history | authority/fence/coverage/finding；Step 6 逐对象闭口 |
| `crates/domain/src/{bundle,manifest,closure}.rs` | CP3 的 5 对象 | truth/value/history | immutable revision/inventory/closure；Step 6 逐对象闭口 |
| `crates/domain/src/{verification,compatibility}.rs` | CP4 的 3 对象 | truth/history | fixed-input assessments/findings；Step 6 逐对象闭口 |
| `crates/domain/src/{placement,lifecycle}.rs` | CP5 的 3 个 domain 对象 | truth/history | placement、execution、external action；decision ref 来自 contracts；Step 6 逐对象闭口 |
| `crates/domain/src/{restore_request,restore_plan,restore_handoff}.rs` | CP6 的 6 对象 | truth/value/history | per-owner plan/item/handoff/outcome/compensation；Step 6 逐对象闭口 |
| `crates/domain/src/errors.rs` | `DomainError` family | error | invariant/transition rejection；Step 6/10/12 闭合 variants |

#### 7.6.2 Application 与 Infra

| 文件路径 | 代码主体 | 类型 | 责任 / 后续闭口 |
|---|---|---|---|
| `crates/application/src/request_service.rs` | `ArchiveRequestService` | service | archive/restore admission、job coordination；Step 6/9 闭合 methods/flow |
| `crates/application/src/source_capture_service.rs` | `SourceCaptureService` | service | source planning/capture/reconcile；Step 6/9 闭合 |
| `crates/application/src/bundle_assembly_service.rs` | `BundleAssemblyService` | service | fixed inventory、manifest/closure/seal guard；Step 6/9 闭合 |
| `crates/application/src/bundle_verification_service.rs` | `BundleVerificationService` | service | fixed-input integrity/compatibility assessment；Step 6/9 闭合 |
| `crates/application/src/placement_service.rs` | `PlacementService` | service | placement/retrieval intent、effect、reconcile；Step 6/9 闭合 |
| `crates/application/src/lifecycle_execution_service.rs` | `LifecycleExecutionService` | service | decision-bound execution/reconcile；Step 6/9 闭合 |
| `crates/application/src/restore_service.rs` | `RestoreService` | service | plan/material/handoff/outcome/compensation；Step 6/9 闭合 |
| `crates/application/src/archive_query_service.rs` | `ArchiveQueryService` | read service | 五 Query no-write composition；Step 6/7/9 闭合只读能力 |
| `crates/application/src/ports/*.rs` | 7 required/local port families | trait/port | application 定义需求；Step 7 闭合 exact signatures/outcomes |
| `crates/application/src/ports/support.rs` | ID/clock/authority/visibility、只读 wrapper | local support | Step 7 补齐；不新增业务 family，不签发 owner authority |
| `crates/application/src/worker_control.rs` | claim/checkpoint 持久 carrier、bounded control | local support | Step 7 校正唯一 definition owner；worker 不再拥有其 repository 类型 |
| `crates/application/src/unit_of_work.rs` | local UoW/fixed revision/commit-unknown abstraction | trait/support | Step 7/11 闭合 transaction surface |
| `crates/application/src/idempotency.rs` | request/action/handoff key + digest coordination | service/support | Step 6/7/13 闭合 carrier与repository surface |
| `crates/application/src/errors.rs` | `ApplicationError` family | error | rejection/block/conflict/unknown；Step 12 闭合 mapping |
| `crates/infra/src/store_adapter.rs` | `ArchiveStorePort` implementation | adapter | backend/schema 未选；Step 7/11 闭合 fake/durable parity |
| `crates/infra/src/context_adapter.rs` | ID/clock implementation | adapter/support | 本地身份与观察时间，不内含 authority fallback |
| `crates/infra/src/authority_adapter.rs` | formal authority / scope binding implementation | adapter/support | owner 决定未闭合时 blocked，不解释 policy |
| `crates/infra/src/visibility_adapter.rs` | current formal disclosure implementation | adapter/support | 无 permission cache write，不泄漏 hidden existence |
| `crates/infra/src/source_export_adapters.rs` | per-owner source adapter family | adapter | `AR-UP-001/006~008` 未关前 disabled/blocked |
| `crates/infra/src/integrity_adapter.rs` | integrity/signature capability adapter | adapter | 不拥有 algorithm/key；`AR-UP-004` |
| `crates/infra/src/compatibility_adapter.rs` | schema/version capability adapter | adapter | 不拥有 evolution authority；`AR-UP-004` |
| `crates/infra/src/governance_adapter.rs` | decision applicability/validity adapter | adapter | 不执行 policy；`AR-UP-003` |
| `crates/infra/src/archive_storage_adapter.rs` | placement/retrieval/lifecycle adapter | adapter | provider/tier/commit semantics pending；`AR-UP-005` |
| `crates/infra/src/restore_receiver_adapters.rs` | per-owner restore receiver family | adapter | 不直写 owner DB；`AR-UP-009` |
| `crates/infra/src/consumer_adapters.rs` | trusted external envelope to local carrier mapping | adapter | 不拥有 Bus ack/delivery；exact contracts pending |
| `crates/infra/src/{config,runtime_builder,errors}.rs` | binding validation、construction、technical mapping | adapter/support | Step 7/12/14 闭合；缺 capability fail-closed |

#### 7.6.3 API 与 Worker

| 文件路径 | 代码主体 | 类型 | 责任 / 后续闭口 |
|---|---|---|---|
| `crates/api/src/command_handlers.rs` | 3 Command handlers | handler | 只调用 application；Step 8/9 闭合签名与 disposition |
| `crates/api/src/query_handlers.rs` | 5 Query handlers | handler | no-write capability；Step 8/9 闭合安全读取 |
| `crates/api/src/errors.rs` | safe handler error mapping | error | current disclosure；Step 8/12 闭合 |
| `crates/worker/src/consumer_loop.rs` | consumer dispatch loop | runner | validate/dedupe/dispatch/ack boundary；Step 9/13 闭合 |
| `crates/worker/src/consumers/*.rs` | 5 Consumer handlers | handler | trusted local carrier to application use case；Step 8/9 闭合 |
| `crates/worker/src/operation_loop.rs` | bounded selection/lease/fence/checkpoint loop | runner | stale worker/commit-unknown protection；Step 9/13 闭合 |
| `crates/worker/src/operations/*.rs` | 17 logical Job handlers | handler | 六业务 family；Step 8/9 闭合 |
| `crates/worker/src/main.rs` | `archive-worker` process entry | composition root | 只装配/启动/停机；Step 14 闭合 wiring |
| `crates/worker/src/errors.rs` | loop/dispatch/shutdown error | error | 不替代 application outcome；Step 12 闭合 |

根 `Cargo.toml`、各 member manifest、`lib.rs` 和 `rustfmt.toml` 的职责沿用 Step 4 §7.6，不在本步制造新实现对象。测试文件只作为各模块风险入口，见 §7.10；它们不是 evidence 或已运行结果。

### 7.7 对象、service、port、adapter 与入口唯一归属

#### 7.7.1 26 个正式对象归属

| CP / 数量 | 正式对象 | 唯一模块 / 文件 | Step 6 责任 |
|---|---|---|---|
| CP1 / 4 | `DeclaredArchiveScope` | `contracts::scope` | 跨 Command/domain 共用的 immutable value object；shape/value invariant |
| CP1 / 4 | `ArchiveRequest` | `domain::request` | request 字段、状态、factory、成员能力和不变量 |
| CP1 / 4 | `ArchiveJob`、`ArchiveJobStageRecord` | `domain::job` | job/stage 字段、状态、推进 guard 与 history append |
| CP2 / 4 | `ArchiveSourceBinding` | `domain::source_binding` | authority class、owner、version/fence/coverage binding |
| CP2 / 4 | `CaptureAttempt`、`CaptureCoverage`、`SourceCaptureFinding` | `domain::capture` | attempt/coverage/finding 的字段、状态和保守 outcome |
| CP3 / 5 | `ArchiveBundle` | `domain::bundle` | Bundle identity/revision posture 与 seal guard |
| CP3 / 5 | `BundleManifest`、`ManifestEntry` | `domain::manifest` | immutable revision、inventory entry 与 provenance |
| CP3 / 5 | `ManifestClosure`、`ClosureFinding` | `domain::closure` | declared/actual closure assessment 与 findings |
| CP4 / 3 | `VerificationAssessment`、`VerificationFinding` | `domain::verification` | fixed-input integrity/signature outcome 与 finding |
| CP4 / 3 | `CompatibilityAssessment` | `domain::compatibility` | target-specific version/schema posture |
| CP5 / 4 | `ArchivePlacement` | `domain::placement` | storage intent/commit/retrieval 独立状态轴 |
| CP5 / 4 | `GovernanceDecisionRef` | `contracts::governance_decision` | 跨 Command/Consumer/domain 共用的 owner-issued opaque decision binding；不是 policy truth |
| CP5 / 4 | `LifecycleExecution`、`ExternalActionRecord` | `domain::lifecycle` | decision-bound execution、intent/result/history |
| CP6 / 6 | `RestoreRequest` | `domain::restore_request` | restore admission truth；不授予写权 |
| CP6 / 6 | `RestorePlan`、`RestoreItem` | `domain::restore_plan` | immutable per-owner plan/item 与 eligibility posture |
| CP6 / 6 | `RestoreHandoff`、`HandoffOutcome`、`CompensationRecord` | `domain::restore_handoff` | intent/outcome/commit-unknown/compensation history |

计数审计：`4 + 4 + 5 + 3 + 4 + 6 = 26`，其中 `2 contracts + 24 domain = 26`；每个对象只有一个 definition owner。两个 contracts 对象仍属于各自 CP 的正式对象，不是重复 DTO。`GovernanceDecisionRef` 虽指向外部决定，仍是 Archive 保存适用性语境的本地正式对象；它不能复制决定正文或升级为 RetentionPolicy/legal hold/delete/risk truth。

#### 7.7.2 八个 service family 与 capability 归属

| Service | 所属 CP / capability | 允许协调的 domain 主体 | 需要的 port family | 禁止事项 |
|---|---|---|---|---|
| `ArchiveRequestService` | CP1 admission/job coordination | request/scope/job/stage；restore request admission 可建立 CP6 request | Archive store | 不把 accepted 当 archived/restored |
| `SourceCaptureService` | CP2 plan/capture/reconcile | binding/attempt/coverage/finding | Archive store + Source export | 不用 workspace/ref 补 canonical；不盲 recapture |
| `BundleAssemblyService` | CP3 manifest/closure/seal guard | bundle/manifest/entry/closure/finding | Archive store | 不从 storage/verification 反推 closure |
| `BundleVerificationService` | CP4 integrity/compatibility assessment | assessments/findings + fixed Bundle input refs | Archive store + Integrity + Compatibility | 不拥有 algorithm/key/schema；query 不调用本 service 触发重验 |
| `PlacementService` | CP5 placement/retrieval/reconcile | placement + correlated external action record | Archive store + Archive storage | ACK 不等 commit；commit-unknown 先 probe |
| `LifecycleExecutionService` | CP5 decision-bound lifecycle | decision ref/execution/action record | Archive store + Governance decision + Archive storage | 不解释 policy、期限、hold/delete/risk |
| `RestoreService` | CP6 plan/material/handoff/reconcile/compensation | restore request/plan/item/handoff/outcome/compensation | Archive store + Source/Integrity/Compatibility as eligible + Restore receiver | 不直接写 owner DB；per-owner outcome 不压平 |
| `ArchiveQueryService` | CP1～CP6 read composition | 已提交 Archive-owned state/views only | Archive store 的只读 capability | 不 capture/verify/retrieve/repair/handoff/write cache |

该表定义 service responsibility，不定义 Rust method。某个用例同时涉及多个 CP 时，由 owning service 读取已提交引用或调用内层纯规则；不得通过 service-to-service 循环、跨 CP 单一大事务或 worker 直接拼 domain object 解决。

#### 7.7.3 七类 port 与 adapter 唯一归属

| Port family / 定义 owner | Port 类型 | 实现 owner / 文件 | 使用 service | 当前门禁 |
|---|---|---|---|---|
| `ArchiveStorePort` / application | local read/write/UoW | infra `store_adapter.rs` | 全部 service；query 仅获 read capability | backend/schema pending；Step 7/11 闭口 |
| `SourceExportPort` / application | per-owner runtime/ref family | infra `source_export_adapters.rs` | SourceCapture、Restore | `AR-UP-001/006~008`，未闭合 path disabled |
| `IntegrityCapabilityPort` / application | runtime/adapter/ref | infra `integrity_adapter.rs` | BundleVerification、Restore eligibility | `AR-UP-004`，不私造 digest/signature/key |
| `CompatibilityCapabilityPort` / application | runtime/adapter/ref | infra `compatibility_adapter.rs` | BundleVerification、Restore eligibility | `AR-UP-004`，不私造 schema support |
| `GovernanceDecisionPort` / application | runtime/ref | infra `governance_adapter.rs` | LifecycleExecution | `AR-UP-003`，只消费正式决定 |
| `ArchiveStoragePort` / application | runtime/adapter/ref | infra `archive_storage_adapter.rs` | Placement、LifecycleExecution | `AR-UP-005`，ACK/commit/probe 分离 |
| `RestoreReceiverPort` / application | per-owner runtime/adapter/ref family | infra `restore_receiver_adapters.rs` | Restore | `AR-UP-009`，无 receiver contract 不成功 |

`consumer_adapters.rs` 是 inbound external envelope mapping，不是第八个 business port；Bus subscription/ack 合同尚未闭合时，它只能把已验证 envelope 转成 `contracts::consumers` local carrier 或拒绝/quarantine。Clock、ID factory、lease 等若 Step 6/7 证明是独立 helper port，必须登记为 application-local support seam，而不能混入上述七类正式业务 port 分母或让实现者临时生成 ref。

#### 7.7.4 30 个入口到 handler / service 归属

| 入口族 / 数量 | 入口 | handler owner | application owner | 边界 |
|---|---|---|---|---|
| Command / 3 | `RequestArchive`、`RequestRestore` | `api::command_handlers` | `ArchiveRequestService` | 原子受理/复用本地结果；不等待后台完成 |
| Command / 3 | `RequestLifecycleExecution` | `api::command_handlers` | `LifecycleExecutionService` | 只建立获准执行语境/intent |
| Query / 5 | `GetArchiveJobStatus`、`GetArchiveBundle`、`VerifyArchiveBundle`、`GetRestorePlan`、`GetRestoreHandoffStatus` | `api::query_handlers` | `ArchiveQueryService` | 全部 no-write，当前可见性/脱敏 |
| Consumer / 5 | `ConsumeArchiveTrigger` | `worker::consumers::archive_trigger` | `ArchiveRequestService` | 触发须经同一 admission authority/idempotency |
| Consumer / 5 | `ConsumeSourceExportFeedback` | `worker::consumers::source_export_feedback` | `SourceCaptureService` | 匹配 source/attempt/fence |
| Consumer / 5 | `ConsumeGovernanceDecisionChange` | `worker::consumers::governance_change` | `LifecycleExecutionService` | 重新核对/阻塞，不解释 policy |
| Consumer / 5 | `ConsumeStorageActionFeedback` | `worker::consumers::storage_feedback` | 由 persisted action owner 路由到 `PlacementService` 或 `LifecycleExecutionService` | worker 不按错误文本猜 owner/outcome |
| Consumer / 5 | `ConsumeRestoreReceiverFeedback` | `worker::consumers::restore_receiver_feedback` | `RestoreService` | per-owner outcome；success 不等 restored |
| Job / 1 | `AdvanceArchiveJob` | `worker::operations::coordination` | `ArchiveRequestService` | 只协调已提交局部姿态 |
| Job / 3 | `PlanArchiveSources`、`CaptureArchiveSource`、`ReconcileSourceCapture` | `worker::operations::capture` | `SourceCaptureService` | 逐 source 有界推进 |
| Job / 2 | `AssembleBundleManifest`、`SealArchiveBundle` | `worker::operations::bundle` | `BundleAssemblyService` | fixed inventory/assessment basis |
| Job / 2 | `AssessBundleIntegrity`、`AssessBundleCompatibility` | `worker::operations::verification` | `BundleVerificationService` | fixed input，Unknown/Blocked 可见 |
| Job / 4 | `PlaceArchiveBundle`、`RetrieveArchiveBundle`、`ReconcileExternalAction` | `worker::operations::lifecycle` | `PlacementService`；reconcile 按 persisted action owner 可委派 `LifecycleExecutionService` | intent-before-effect，probe-before-retry |
| Job / 4 | `ExecuteArchiveLifecycle` | `worker::operations::lifecycle` | `LifecycleExecutionService` | dispatch 前重读 decision/hold |
| Job / 5 | `BuildRestorePlan`、`PrepareRestoreMaterial`、`DispatchRestoreHandoff`、`ReconcileRestoreHandoff`、`ExecuteRestoreCompensation` | `worker::operations::restore` | `RestoreService` | per-owner、无跨域事务 |

入口计数为 `3 + 5 + 5 + 17 = 30`。上表中的“路由/委派”只能依据 persisted typed owner/correlation carrier，不能让 worker 自行判断业务状态；精确 carrier 和函数调用留 Step 6/8/9。

### 7.8 CP 到六模块 vertical-slice 映射

| Capability partition | `contracts` | `domain` | `application` | `infra` | `api` | `worker` |
|---|---|---|---|---|---|---|
| CP1 请求与作业协调 | archive/restore command、job/status DTO/ref + declared scope value | request/job/stage | Request service + store/UoW/idempotency | local store | archive/restore command + status query handler | trigger consumer + advance job |
| CP2 来源绑定与采集 | source feedback/capture job carriers | binding/attempt/coverage/finding | SourceCapture service + SourceExport port | owner/workspace/artifact/observability source adapters | bundle/job read only | feedback consumer + plan/capture/reconcile jobs |
| CP3 Bundle 清单与闭包 | bundle query + manifest job carriers/views | bundle/manifest/entry/closure/finding | BundleAssembly service | local store | bundle query handler | assemble/seal jobs |
| CP4 完整性与兼容评估 | verification query/job carriers/views | assessments/findings | BundleVerification service + capability ports | integrity/compatibility adapters | verification read handler | assessment jobs |
| CP5 存储与生命周期执行 | lifecycle command、feedback/job/view carriers + governance decision ref | placement/execution/action record | Placement/Lifecycle services + decision/storage ports | governance/storage adapters | lifecycle command + bundle/job read | governance/storage consumers + lifecycle jobs |
| CP6 恢复计划与交接 | restore command/query/feedback/job carriers/views | restore request/plan/item/handoff/outcome/compensation | Restore service + receiver/source/assessment ports | receiver/source/capability adapters | restore command/query handlers | receiver consumer + five restore jobs |

`ArchiveQueryService` 是跨 CP 的只读组合面，不是第七个 capability partition 或第二 truth。CP2 中 workspace projection 始终标记 `Auxiliary`；Artifact 与 observability 也分别保持制品/血缘和审计材料 owner 的正式边界。

### 7.9 Module export 与 visibility 边界

| 模块 | `lib.rs` 允许暴露的类别 | 默认保持内部的内容 | Step 6～8 闭口要求 |
|---|---|---|---|
| `contracts` | 经审计的 refs/context、request/result/selection、consumer/job carrier、safe view/error | Core mapping helper、raw serialization helper、external envelope/provider payload | 每个公开二级类型均有唯一 schema owner；不 blanket re-export |
| `domain` | 24 对象、当前边界 state/value type、pure factory/transition/guard、`DomainError` | persistence reconstruction helper、internal validation detail | 每个对象独立卡片；公开只是 Rust crate 可见，不转移业务 truth |
| `application` | 八 service family、required/local ports、read-only facade、UoW/idempotency/error | orchestration helper、internal mapping、effect sequencing detail | 写/读 capability 分离；constructor 不接收未使用的万能 runtime |
| `infra` | validated config/builder、port implementation constructor、必要 adapter availability | provider client/payload/secret、backend row/schema、fake production fallback | constructor 缺 binding 即 typed failure；外部 blocker 未关不暴露 ready instance |
| `api` | transport-neutral command/query handler surface、safe error mapping | route/server/middleware/provider-specific response | Step 8 定 DTO/disposition，Step 9 定调用；无 host 不声称 deployable |
| `worker` | binary composition 所需最小 runner/control surface | consumer/job handler implementation、store/adapter access、provider detail | handler 只调 application；test access 不成为 public product API |

跨 crate 的 Rust `pub` 只表达编译可见性，不等于跨仓 distribution contract 或外部业务授权。外部消费者可使用哪些 `archive-contracts` / `archive-api` symbol，仍须 Step 8 的协议闭口与后续发布 boundary；当前不能把整个 crate public surface 当稳定兼容承诺。

### 7.10 非 core 模块的 Step 6 闭口决策

| 模块 / 对象组 | Step 6 是否闭口 | 当步必须闭口的内容 | 明确 defer | 后续承接 |
|---|---|---|---|---|
| `contracts` shared vocabulary / formal value-ref objects | 是 | `DeclaredArchiveScope`、`GovernanceDecisionRef`，以及 typed id/ref、source authority/material class、version/fence/coverage、状态/marker、safe availability 等被多模块引用的 carrier | 具体 Command/Query/Consumer/Job wire schema | Step 8 |
| `contracts` safe views | 是 | 五类 view 的稳定 identity、availability/freshness/redaction/result carrier 与字段来源 | transport encoding | Step 8/14 |
| `domain` | 是 | 其余 24 对象逐对象字段、factory/member、state/value enum、不变量、禁止事项 | persistence layout | Step 11 |
| `application` | 是 | 八 service 的构造依赖边界，以及 operation context、idempotency/stored-result、read visibility、effect intent/owner correlation 等稳定 carrier（若由功能证明需要） | port trait exact method | Step 7；flow sequencing Step 9 |
| `infra` | 条件闭口 | runtime/binding availability、builder input/result、adapter state 中跨函数稳定 carrier；只依据已有功能创建 | provider config 字段、backend row/client | Step 7/11/14 与 04 |
| `api` | 条件闭口 | handler/facade ownership、entry disposition 中无法由 protocol DTO 替代的稳定 carrier | route/server/transport binding | Step 8/9/14 |
| `worker` | 条件闭口 | consumer/operation runner、lease/fence/checkpoint/dispatch disposition 中跨调用稳定 carrier | exact loop schedule/budget/provider client | Step 8/9/13/14 |

“条件闭口”不是一律 defer。Step 6 必须先从模块 capability 证明对象是否需要：若它是 availability、stored result、idempotency、entry disposition、effect correlation 或 job report 的唯一稳定 carrier，就当步定义；若只是函数局部变量或后续 trait/protocol 的重复包装，则明确不建对象。

### 7.11 模块级测试风险入口

| 模块 | planned test owner | 最小风险切口 | 当前不可声称 |
|---|---|---|---|
| `contracts` | `contracts/tests/protocol_boundaries.rs` | typed carrier、schema boundary、no external body/secret leak | exact external contract/compatibility 通过 |
| `contracts` + `domain` | contracts protocol boundary + domain invariant/state suites | 2 个跨层 value/ref 对象与 24 个 domain 对象不变量、closure、per-owner、多轴禁止传播 | Step 16 完整用例或测试已运行 |
| `application` | `application/tests/admission_consistency.rs`、`query_no_write.rs`、`operation_boundaries.rs` | UoW/幂等/intent、查询能力隔离、17 Job 有界推进 | durable transaction/provider success |
| `infra` | `infra/tests/adapter_contracts.rs`、`wiring_fail_closed.rs` | port outcome translation、missing capability、fake/durable parity | external integration/readiness |
| `api` | `api/tests/handler_boundaries.rs` | Command/Query effect 分离、safe error/disclosure | HTTP/RPC conformance |
| `worker` | `worker/tests/consumer_boundaries.rs`、`operation_recovery.rs` | duplicate/out-of-order、lease/fence/crash/commit-unknown | Bus delivery、real recovery 或 RTO evidence |

本表只固定测试责任归属，完整 case、fixture、命令、覆盖与证据由 Step 16 及正式 05 承接；本轮没有创建或执行测试。

### 7.12 跨模块闭环审计

| 审计维度 | 分母 / 判据 | 结果 | 仍需后续闭口 |
|---|---|---|---|
| 模块主轴 | Step 4 六 role 全部成为同名模块 | pass：6/6，无 `jobs/common/shared/ops` 新桶 | Step 6/7 填充对象与 trait |
| 架构方向 | 核心 inward、application port、infra adapter、entry 调用 service | pass：无反向依赖；API no-infra；worker no-domain | 实施时 Cargo manifest 验证 |
| CP 覆盖 | CP1～CP6 可跨六模块反查 | pass：6/6；未按 CP 拆 crate | Step 6 capability-to-object |
| 正式对象 | 26 个对象有唯一 contracts/domain definition | pass：2 contracts + 24 domain = 26，无重复 owner/反向依赖 | Step 6 字段/函数/state |
| Service | 8 个 family 有 application owner | pass：8/8，Query 是 read-only cross-CP face | Step 6 constructor；Step 9 flow |
| 接口 | 3 Command + 5 Query + 5 Consumer + 17 Job | pass：30/30，有 handler 与 service owner | Step 8 schema；Step 9 function flow |
| Port | 7 类 required/local port | pass：7/7，definition/implementation 分离 | Step 7 exact trait/outcome；Step 11 UoW |
| Store/repository | `ArchiveStorePort` owner=application，impl=infra | pass_at_module_level；query read capability 单独限制 | repository methods/schema/transaction 未定义 |
| Source authority | 8 类 source 均经 source port/adapter；workspace=Auxiliary | pass；未把 projection/artifact/audit 材料升格 | external exact contract blockers retained |
| External effects | intent owner=application/domain，call=infra，drive=worker | pass；ACK/commit/unknown 分离不变 | Step 6 carrier、Step 7 outcome、Step 9/11/13 |
| Outbound candidates | 不存在 event/outbox/publisher module/export | pass_with_blocker：3 candidates 全未实现 | `AR-HLD-Q-001` 关闭后回退 02/Step 4/5 |
| 依赖分类 | compile/runtime/event/ref/adapter/fake 不混写 | pass；仅 Core contracts 进入 compile candidate | 实施前 path/symbol 复核 |
| 事实诚实 | planned repo 不存在、无实现/测试/evidence | pass | 07 前置与实现台账 |

结论：每个对象、service、port、adapter、handler 和 store/repository family 都能找到唯一模块归属，满足 Step 5 SOP 的进入下一步结构条件。字段、方法、状态、trait、protocol 和 transaction 尚未完成，不能把本步视为可直接实现完整代码。

## 8. 复杂度判断与 Step 6 承接计划

Step 6 属于高复杂度 Step：需要先闭合 2 个 contracts 正式 value/ref 对象及其余 shared carrier，再闭合 24 个 domain 对象、五类 safe view，以及经 capability 证明必需的 application/infra/api/worker stable carrier。参照 `L1-governance` 的可审查批次方法，但按 Archive 六模块和 CP1～CP6 重排；每批可控不等于删减内容。

| 候选批次 | 范围 | 开始条件 | 完成后检查 |
|---|---|---|---|
| 6.0 | 建 Step 6 骨架、批次台账、模块顺序、非 core 闭口决策 | 用户审查并明确放行 Step 6 | 不先写对象卡；输入/分母齐全 |
| 6.1 | contracts 两个正式 value/ref 对象、shared vocabulary、typed refs、public marker/state、安全 view 支撑类型 | 6.0 通过 | 每个对象/二级类型有 Rust-facing schema/owner/source |
| 6.2 | domain CP1～CP2 的 7 个对象 | 6.1 通过 | capability → object → field/function/state 闭环 |
| 6.3 | domain CP3～CP4 的 8 个对象 | 前批通过 | closure/fixed-input/assessment 不变量闭环 |
| 6.4 | domain CP5～CP6 的 9 个对象 | 前批通过 | decision/effect/per-owner handoff 红线闭环 |
| 6.5 | application stable objects/services 与 idempotency/effect/read carriers | domain inputs稳定 | 非 core 对象逐项闭口或有正式 defer 理由 |
| 6.6 | infra/api/worker stable entry/runtime carriers | application carrier稳定 | provider/transport 未被私造；entry 不获得 truth |
| 6.7 | 字段来源、状态语义、重复对象、依赖方向、Step 7 承接总审计 | 六模块对象批次完成 | 形成完整 Step 6 停审结论 |

Step 6 写作必须逐对象给出英文 Rustdoc code contract、中文字段/函数/工厂/variant/不变量表；这是 Step 3 对当前 Rust 编码规范的承接。任何字段、enum label、ref 内部形态或状态迁移若无法从正式 02/当前 authority 闭合，必须保留 pending 或回退上游，不从历史 03 或 Governance 对象类比生成。

## 9. 后置 historical material 与参考污染审计

| 输入 | 可能污染 | 本步处置 |
|---|---|---|
| 旧正式 `03-详细设计.md` | 单体 module、index/retrieval/retention/legal hold 主轴 | 不继承；本步从正式 02 和 Step 4 重建六模块主轴 |
| README / draft | PostgreSQL、S3/MinIO/Glacier、AES/SHA、固定 API/性能 | 不进入模块/依赖/export；留 04/11/14 或 owning authority |
| `L1-governance` Step 5 | 七 role、`jobs`、outbox/publisher、API route 和治理对象 | 只复用逐模块分析维度；Archive 裁剪为六 role且无 outbound 模块 |
| workspace 投影材料 | 容易被当作公共 contracts canonical source | 明确只走 CP2 Auxiliary branch，不成为 owner truth |
| artifact/audit material | 容易被 contracts/domain 吸收成正文或后端 truth | 只保存 approved material/ref/provenance；owner 不变 |

本步没有修改上述参考项目或历史正式 03。未发现需要回写 `L1-governance` 或其他 owning project 的新问题。

## 10. 回填草稿

> 校准来源：
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“逐模块职责与暴露面”“对象、service、port、adapter 与入口唯一归属”“非 core 模块的 Step 6 闭口决策”和“跨模块闭环审计”，了解模块主轴如何从概要能力骨架收敛。

### 10.1 模块实现契约主轴

L4-archive 的详细设计以 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 六个技术模块为主轴。CP1～CP6 是跨模块的归档业务能力分区，不直接变成 crate；五个 Consumer 和十七个 Operations Job 统一由 worker 内 logical handlers 承载，不创建 `jobs` crate 或多 job binary。

| 模块 | 所属实现单元 | 主要职责 | 直接依赖 | 核心禁止事项 |
|---|---|---|---|---|
| `contracts` | `archive-contracts` | 两个跨层正式 value/ref 对象、typed refs/context、Command/Query/Consumer/Job DTO、safe views/errors | 已核验 `core-contracts` symbol | 不依赖 domain，不复制 external truth/schema |
| `domain` | `archive-domain` | 其余 24 个 Archive-owned truth/value/history 对象、状态和纯规则 | contracts | 不执行 I/O，不读取 provider/owner/policy engine |
| `application` | `archive-application` | 八 service、七 port、UoW/idempotency 与用例编排 | contracts、domain | 不依赖 infra，不决定外部 truth/authority |
| `infra` | `archive-infra` | store/external adapters、config binding、fail-closed construction | contracts、domain、application | 不反向定义业务状态，不把 missing binding 伪成 ready |
| `api` | `archive-api` | 3 Command 与 5 no-write Query 的 transport-neutral handlers | contracts、application | 不依赖 infra/domain，不隐式写或选择 transport |
| `worker` | `archive-worker` | 5 Consumer、17 logical Job、loop 和唯一 planned process root | contracts、application、infra | 不直达 domain/store，不把 ACK/response 当 commit/success |

planned 依赖方向以本 Step §7.2～§7.4 为准。只有 `archive-contracts` 可直接依赖经核验的 `core-contracts` symbols；L1 owners、Bus、workspace、artifact、observability、storage/integrity/governance/receiver capabilities 和 SDK/product consumers 均保持 runtime/event/ref/adapter 关系。

26 个正式对象的 definition owner 为 `2 contracts + 24 domain`。`DeclaredArchiveScope` 和 `GovernanceDecisionRef` 因同时进入 public Command/Consumer 与 domain 而定义在 contracts；它们仍分别属于 CP1/CP5 的正式 value/ref 对象，不成为 DTO 副本，也不获得 source/governance authority。对象、service、port、adapter 和 30 个入口的唯一归属采用本 Step §7.7；逐对象字段/函数/状态、trait 方法、protocol schema 和函数级处理流分别由 Step 6～9 闭口。

### 10.2 模块依赖约束摘要

```text
archive-contracts   -> core-contracts (verified symbols only)
archive-domain      -> archive-contracts
archive-application -> archive-contracts + archive-domain
archive-infra       -> archive-contracts + archive-domain + archive-application
archive-api         -> archive-contracts + archive-application
archive-worker      -> archive-contracts + archive-application + archive-infra
```

禁止反向依赖、入口模块互相依赖、API 依赖 infra、worker 直接依赖 domain，以及任一非 Core sibling 业务实现进入 Cargo graph。三类 outbound event 仍只是 candidate，因此当前没有 event/outbox/publisher module、file 或 export。

## 11. 待确认事项与回退规则

| 待确认 / blocker | 当前安全处置 | 关闭位置 / 回退规则 |
|---|---|---|
| shared refs/markers/value 内部 Rust schema | 只固定 owner 与用途，不猜 newtype/enum/集合语义 | Step 6；无法闭合则暂停相关对象批次 |
| 八 service constructor、facade 与 stable helper object | 只固定责任和依赖上限 | Step 6 按 capability 证明后闭口或显式 defer |
| 七 port 的 exact trait/outcome/repository surface | application 定义需求、infra 实现；不写伪签名 | Step 7/11 |
| Command/Query/Consumer/Job schema 与安全 disposition | contracts 文件 owner 已定，字段未在本步展开 | Step 8；不得引用 domain-only type |
| 30 入口函数调用、事务与 external-effect sequence | handler/service owner 已定，不声称调用流完成 | Step 9/11/13 |
| API transport/host/composition | API 仅 library；不依赖 infra 或创建 server | 正式 host/transport contract 后回审 Step 4/5/14 |
| external owner/provider/receiver contract | adapter family + disabled/blocked wiring | `AR-UP-001~009` 由 owning authority 关闭 |
| outbound event/outbox/publisher | 不定义模块、文件、trait 或 readiness | `AR-HLD-Q-001` 关闭后回退 02 Step 6～9，再重审 Step 4/5 |
| store backend/schema、Tokio/technical dependency precise pins | provider-neutral；不伪选 DB/driver | Step 7/11/14、04/07 |
| workload/batch/page/SLO | 不设默认值 | `AR-HLD-Q-002` 与 05/06/07 |

持续 blocker 仍为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`；本 Step 没有新增 owning-project blocker。两对象 definition owner 校正是本地 planned layout 闭环，不改变正式 02，因此不登记为外部 blocker。

## 12. 完成门禁、自检与停审

Step 07 反查修正（2026-09-11）：新增上述五个 planned 文件；持久 WorkerClaim/WorkerCheckpoint 及必要 shared carrier 归 application，运行期 entry/state/disposition 仍归 worker。Runtime authority/visibility、五类 inbound family 分类单独闭合，不把 storage producer 当 L1 SourceClass。Core 符号由 contracts 显式 re-export，精确 Cargo dependency 表不变。当前 Step05 完成结论保留，以下 Step06 未授权句是原停审历史，不覆盖 project ledger 的新授权。

### 12.1 Step 内计划完成状态

| 阶段 | 结果 |
|---|---|
| A 输入恢复 | completed；Step 4/flow/ledger 与正式 00/01/02 已复核 |
| B 参考裁剪 | completed；采用 `L1-governance` 的架构粒度，未复制领域主语/七 role |
| C 问题/诊断/取舍 | completed；SOP 五问逐项回答，历史和 reference 污染已审计 |
| D 模块主轴 | completed；六模块职责、exports、精确 direct dependency 已收稳 |
| E 全分母归属 | completed；6 CP、26 对象、8 service、30 入口、7 port 均有唯一 owner |
| F 收口 | completed；Step 6 批次承接、回填草稿、待确认和自检齐全 |

### 12.2 进入下一步条件

| 门禁 | 结论 |
|---|---|
| 模块主轴稳定 | pass：六技术模块与 Step 4 workspace role 一致；CP 不物理服务化 |
| 对外暴露稳定 | pass_at_step_5：类别与 visibility 边界明确；精确 symbol 等 Step 6/8 |
| 依赖方向稳定 | pass：逐 member direct dependency 已收缩，无反向/跨 sibling 业务 compile edge |
| 对象归属 | pass：`2 contracts + 24 domain = 26`，无 shadow type；Step 4 已同步修正 |
| trait/handler/repository 归属 | pass：application 定 port/store need，infra 实现，api/worker 只作入口 |
| 全接口覆盖 | pass：3 Command、5 Query、5 Consumer、17 Job 共 30 个均有 handler/service owner |
| external authority | pass_with_blockers：source matrix、governance、Artifact、workspace、observability、provider/receiver 边界未漂移 |
| outbound candidate | pass_with_blocker：未创建 event/outbox/publisher surface |
| 事实诚实 | pass：目标仓不存在；无源码/Cargo/test/evidence/readiness/commit 声明 |
| 正式文档边界 | pass：未修改 historical 正式 03，正式写入仍锁至 Step 19 |

`gate_status = completed / pass_with_upstream_blockers / stop_review`。

Step 05 已满足 SOP 的结构性进入 Step 06 条件，但按用户要求必须在此停审。当前不得创建 `03_ddd_step_06*`、不得进入对象字段级写作、不得修改正式 `03-详细设计.md`；下一动作仅为等待用户审查并明确放行 Step 06。
