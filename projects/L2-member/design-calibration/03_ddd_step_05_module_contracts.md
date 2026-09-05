# Step 5. 定义模块实现契约主轴

> 项目：`L2-member`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
> 参考粒度与格式：`projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`
> 未来回填：`03-详细设计.md` §5“模块实现契约”
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 5：定义模块实现契约主轴 |
| 前序门禁 | Step 4 `completed / pass_with_upstream_blockers / stop_review` |
| 当前模块 | `module_contracts` |
| 本步目标 | 将七个业务主要组成部分映射到 planned 实现模块，固定模块职责、暴露面、允许 / 禁止依赖及后续对象 / Port / 协议归属。 |
| 本步输出 | 模块总览表、模块依赖图、模块职责表、文件与代码主体映射、对象归属预告、业务组成部分映射、测试切口预告、回填草稿、待确认事项。 |
| 完成门禁 | 每个对象、trait、handler、repository、projection 与 job 均能找到唯一实现归属；依赖分类不把运行期 / 事件协作伪装成 Cargo dependency。 |
| 当前结论 | 模块主轴稳定；`L2M-UP-001~008` 与 `L2M-DDD-001~002` 仍开放，只影响正向 seam / physical binding，不造成模块归属冲突。 |

### 1.1 Step 内计划

| 顺序 | 子阶段 | 可审查产物 | 状态 | 门禁 |
|---:|---|---|---|---|
| 1 | 输入恢复 | ledger、03 flow、Step 4、02 主要组成部分 / 分层 | completed | 只承接已收稳的 CP、分层和 planned layout。 |
| 2 | SOP 问题回答 | §3 五项问题逐项回答 | completed | 模块集合、对应主体、暴露面、依赖方向、对象归属均有明确答案。 |
| 3 | 当前材料诊断 | §4 历史 / draft / HLD 差异表 | completed | 不继承旧五模块、旧 transport 或旧 external owner。 |
| 4 | 设计取舍 | §5 方案比较 | completed | 业务组成部分与实现层保持正交；不新增第八业务模块。 |
| 5 | 结构化中间产物 | §6～§13 表、图与映射 | completed | 每个 planned 模块有职责、文件、依赖和下游承接。 |
| 6 | 回填草稿与审计 | §14～§16 | completed | 正式 §5 可追溯；开放 seam 明确标记；未越界到 Step 6～9。 |

### 1.2 本步写入边界

- 本文件只确定“模块实现契约主轴”，不定义对象字段全集、trait 函数签名、完整 DTO schema、函数级 flow、状态转换矩阵、DDL、配置键或测试结果。
- CP01～CP07 是业务责任轴，不是 Cargo crate 边界；`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 是实现承载轴。
- 所有外部 truth 继续由其 owner 持有。本仓只拥有 member-local interaction truth、support truth 和 derived-read truth。
- 目标实现仓 `/home/aris/Projects/quantalithos-member` 当前不存在；本文所有 workspace、crate、文件和 dependency 都是 `planned`，不是已实现事实。
- `L2M-UP-001~008` 不得在本步被写成已确认的 host / Runtime / image / credential / event / rule / subject 正向合同。

## 2. 本步输入

| 输入 | 本步承接内容 | 使用上限 |
|---|---|---|
| `design-calibration/03_ddd_step_04_file_layout.md` | 七个 planned library crate、目录树、命名、Core-only compile 候选和无 binary 结论。 | 不反推尚未选择的 transport、DB、scheduler、process topology。 |
| `02-概要设计.md` §4～§7 | CP01～CP07、实现分层、34 个对象、接口分类和入口主体。 | 不把概要骨架当作完整 schema 或实现。 |
| `02-概要设计.md` §8～§12 | 处理流、状态、异常、配置影响和详细设计承接方向。 | 只用于模块职责与后续 Step 归属。 |
| `02_hld_step_04_code_subject_framework.md` | 业务责任轴 / 实现分层轴的正交关系。 | 不新增业务组成部分。 |
| `02_hld_step_05_components_boundary.md` | CP01～CP07 capability、owner、non-owner 和对象候选。 | 不改变 source owner 或传播方向。 |
| `02_hld_step_06_key_objects_*.md` | 各 CP 对象骨架和禁止事项。 | 只做对象归属预告；字段与方法留 Step 6。 |
| `02_hld_step_07_api_interface_skeleton.md` | 10 Command、16 Query、14 Consumer、24 semantic Event、5 Job 的分母。 | 不在本步展开协议 schema。 |
| `02_hld_step_08_processing_flows.md` | Command / Query / Consumer / Job 的逻辑入口与 local-first 顺序。 | 不写函数级调用链。 |
| `02_hld_step_09_state_machine.md` | 各对象状态族和 unknown / gap / stale 红线。 | 不在本步重写状态矩阵。 |
| `02_hld_step_12_detailed_design_handoff.md` | 03 需要继续展开的对象、Port、协议、flow、状态、配置方向和回退规则。 | 不通过模块表暗改概要设计。 |
| 详细设计 SOP、书写规范、中间产物规范、真相源标准、全局依赖规则 | 本步格式、门禁、可落码性与依赖分类。 | 不能以格式要求关闭上游 blocker。 |
| `L1-governance` Step 5 | 本文件的粒度、章节顺序、表格字段和停审格式参考。 | 仅参考表达，不继承 Governance 的 truth / object / adapter。 |

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块？

采用与 Step 4 planned workspace 对齐的七个实现模块：

1. `contracts`：公共 semantic carrier、typed ref、metadata、view、event、job、receipt 和 protocol error。
2. `domain`：CP01～CP07 的 member-local truth、support truth、derived-read policy、状态与不变量。
3. `application`：九个命名 Application Service、用例编排、Unit of Work、幂等和 application-owned Port / Store trait。
4. `infra`：application Port 的实现、local store、projection store、blocked seam、配置绑定候选和 runtime builder。
5. `api`：同步 Command / Query 的 logical entry translation；当前仅 planned library boundary。
6. `worker`：owner-specific Consumer、feedback / committed-fact re-entry 和 local continuation dispatch；不等于已确认常驻进程。
7. `jobs`：relay、refresh、rebuild、reconcile 的 Operations Job logical runner；不等于已确认 scheduler 或 binary。

`CP01 Presence and Host Collaboration`、`CP02 Inbound Boundary`、`CP03 Runtime Mediation`、`CP04 Outbound Boundary`、`CP05 Interaction Trace`、`CP06 External Context Mirror`、`CP07 Member Read Model` 是七个业务主要组成部分，均横跨上述模块实现，不单独成为 crate。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体？

| 模块 | 承接的概要设计主体 | 职责上限 |
|---|---|---|
| `contracts` | Command / Query / Consumer / semantic Event / Job / View / Receipt 骨架，member-owned refs 与 safe markers | 只定义可传播的类型和 schema 槽位；不承载 domain invariant、外部正文或 route truth。 |
| `domain` | CP01～CP07 的 decision、record、attempt、gap、snapshot、resolution、projection-state 和 policy | 只表达本仓 local / support / derived-read truth；不读 I/O、config、transport 或 sibling code。 |
| `application` | Presence、Host Collaboration、Subscription Scope、Inbound Boundary、Runtime Mediation、Outbound Boundary、Interaction Trace、External Context Mirror、Member Read Model service | 负责 use-case、事务、幂等、Port 调用与 local continuation；不拥有外部 truth。 |
| `infra` | local truth / support / projection / continuation Store、source resolver、publisher、handoff、Clock / ID、runtime builder | 实现 application-owned Port；不把 adapter 局部成功升级为 owner success。 |
| `api` | `PresenceCommandApi`、`RuntimeDeliveryCommandApi`、`InteractionTraceQueryApi`、`MemberQueryApi` 等 logical entry | 解析和映射 DTO；不直接 mutation domain、repository 或 external adapter。 |
| `worker` | 14 个 owner-specific / committed-fact Consumer、feedback dispatch、continuation dispatch | 验证 envelope / dedup / ordering 后调用 application；不取得 source-owner truth。 |
| `jobs` | `PublicationRelayJob`、`ObservationRelayJob`、`ExternalContextRefreshJob`、`MemberProjectionRebuildJob`、`GapReconciliationJob` | 只继续已提交事实的 relay / refresh / rebuild / reconcile；不创建或修复核心 truth。 |

### 3.3 每个模块对外暴露什么？

| 模块 | 对外暴露 | 明确不暴露 |
|---|---|---|
| `contracts` | public DTO、typed ref、metadata、reason、marker、view、event / job / receipt 和 protocol error | raw body、secret、hidden reasoning、外部 definition、DB row、transport header。 |
| `domain` | object factory、纯 domain method、policy / guard、状态 enum、`DomainError` | repository、adapter、HTTP / RPC / Bus client、config reader、external body。 |
| `application` | 九个 service、facade、repository / resolver / publisher / handoff / technical Port trait、UoW、idempotency、`ApplicationError` | concrete infra type、framework type、外部 SDK、entry-specific state。 |
| `infra` | Port implementation、store、blocked seam、config binding、runtime builder、fake assembly 和 `InfraError` | 第二套业务裁决、generic provider、未证实的 ready / accepted / delivered。 |
| `api` | command / query entry function、logical route placeholder、`ApiError` | HTTP / RPC / UDS 既定 route、直接 Store 写入、外部 orchestration。 |
| `worker` | Consumer entry、continuation dispatch、`WorkerError` | raw payload 留存、Bus delivery truth、直接 domain mutation。 |
| `jobs` | Job runner、job result / report carrier、`JobError` | scheduler 产品、真实 run evidence、source repair、readiness signoff。 |

### 3.4 每个模块允许依赖哪些模块，禁止依赖哪些模块？

planned Cargo / code dependency 只允许向内：

```text
                    +----------------+
                    | core-contracts |
                    +--------+-------+
                             ^
                             |
                    +--------+-------+
                    |   contracts   |
                    +--------+-------+
                             ^
                             |
                    +--------+-------+
                    |    domain    |
                    +--------+-------+
                             ^
                             |
                    +--------+-------+       implements
                    |  application  |<--------------------+
                    +--------+-------+                     |
                             ^                             |
              +--------------+--------------+              |
              |              |              |              |
          +---+---+      +---+----+     +---+---+          |
          |  api  |      | worker |     | jobs  |----------+
          +-------+      +--------+     +-------+        infra
                                                         (Port impl)
```

允许方向：

| 调用 / 编译方 | 允许依赖 |
|---|---|
| `contracts` | `core-contracts`（仅已核验 shared surface） |
| `domain` | `contracts`、`core-contracts` |
| `application` | `domain`、`contracts`、`core-contracts` |
| `infra` | `application`、`domain`、`contracts`、`core-contracts` |
| `api` / `worker` / `jobs` | `application`、`contracts`；需要 composition 时可依赖 `infra`，但不依赖彼此 |

禁止方向：

- `contracts` 不依赖 `domain`、`application`、`infra` 或入口 crate。
- `domain` 不依赖 repository、adapter、config、HTTP、Bus、DB、scheduler、Runtime loop、Tools execution 或外部 SDK。
- `application` 不依赖 `infra`、`api`、`worker`、`jobs` 或 concrete transport / persistence product。
- `api`、`worker`、`jobs` 不互相依赖，也不绕过 application 直接写 domain / Store。
- 非 `core-contracts` sibling 仓不得进入 planned Cargo path dependency。
- 不建立无边界的 `common`、`utils`、`manager`、`generic_provider` 或 `generic_listener` crate / module。

图中箭头只表示允许的 compile / code dependency，不表示 runtime IPC、event route、handoff、调度顺序或部署拓扑。

### 3.5 哪些对象、trait、handler、repository 应归属哪个模块？

| 主体类别 | 唯一归属 | 归属规则 |
|---|---|---|
| typed ID / ref / reason / marker / metadata / DTO / view / event / job / receipt | `contracts` | 只承载 public / cross-layer carrier；不定义领域不变量。 |
| aggregate / record / entity / value object / state enum / policy / guard / history / outbox record | `domain` | 只承载 member-owned local truth、support truth 或 derived-read semantics。 |
| Application Service、repository trait、source resolver trait、publisher / handoff trait、UoW、Clock、ID、idempotency、result store trait | `application` | caller owns the abstraction；统一编排 transaction、dedup、side-effect fence。 |
| durable / in-memory / blocked seam adapter、projection store、reference store、publisher adapter、runtime builder | `infra` | 只实现 application trait；不得夺取 owner 或改变状态语义。 |
| synchronous command / query handler、entry mapper | `api` | 只做协议到 application 的转换。 |
| external / internal Consumer、feedback dispatcher、committed-fact dispatcher | `worker` | 只做 envelope gate 和 application re-entry。 |
| relay / refresh / rebuild / reconcile runner | `jobs` | 只做 Operations continuation；Job report 不是核心 truth。 |

## 4. 当前文档问题诊断

| 位置 / 材料 | 问题 | 本步修正 |
|---|---|---|
| 旧 `03-详细设计.md` | 旧 persona / endpoint / capability / execution-binding 结构把 identity、Runtime、tool capability 和 member truth 混在一起。 | 不继承旧目录和旧模块名；按当前 CP01～CP07 与七个实现模块重建。 |
| 旧 README | CloudEvents、AG-UI、UDS、launch token、supervisord、固定 port 等 physical / historical 假设容易被当作实现边界。 | 入口模块仅保留 logical library boundary；载体和 route 继续 pending。 |
| draft 的八组成部分 | `truth core`、`safe material and maintenance` 是横切 invariant / 实现形态，不是独立业务 owner。 | 将 truth core 作为 CP01～CP05 的共同约束；material / maintenance 分回 CP04、CP05、CP07 与 Jobs。 |
| 02 的业务主要组成部分 | 业务责任轴与实现分层轴若混写，容易把 CP01～CP07 机械拆成 crate。 | 明确双轴：CP 说明“做什么”，模块说明“在哪里承载”。 |
| Step 4 planned layout | 已有文件树，但尚未把对象、Port、handler、repository 唯一归属固定。 | 本步补齐归属表和跨层映射；完整字段 / trait / protocol 留给 Step 6～8。 |
| sibling / 上游材料 | 兄弟项目 exact host / image / Runtime seam 尚未稳定。 | 只留下 blocked-aware logical slot，不把 sibling 变成编译依赖或正向 adapter。 |

## 5. 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| A. 以七个 CP 各自建立 crate | 业务直观。 | 每个 CP 都横跨 DTO、domain、service、Port、Store、entry 和 projection，容易形成循环依赖及重复 shared type。 | 不采用。CP 作为业务责任轴。 |
| B. 以七个 workspace member 作为模块主轴 | 与 Step 4 文件布局、L1-governance 粒度和 Cargo 依赖方向一致；能让边界由代码结构表达。 | 需要额外维护 CP→模块映射。 | 采用。 |
| C. 只按六个实现层写文档，不列 crate / file | 语义简洁。 | 实现者无法定位 package、文件和依赖；后续 Step 6～9 容易重新发明归属。 | 不采用。 |
| D. 建立中心 `MemberFacade` / `MemberService` mega owner | 入口集中。 | 会再次吸收 presence、Runtime、projection、adapter 和 external truth，形成旧 persona 污染。 | 不采用；允许薄 `facade` 做路由，不拥有 truth。 |
| E. 所有 sibling 进入 workspace 共享类型 | 表面复用容易。 | 把 runtime / event / ref / adapter 关系伪装成 compile dependency，制造循环和 owner 越界。 | 不采用；仅 `core-contracts` 为 planned compile candidate。 |
| F. 立即拆出 `config` / `observability` / `common` crate | 看似复用。 | 无稳定 cross-crate owner；会掩盖配置、观测和 shared vocabulary 的真实归属。 | 不采用；配置留 `infra`，观测只以 trace / handoff seam 表达。 |

## 6. 结构化中间产物

### 6.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `member-contracts` | 定义 public semantic carrier、typed ref、metadata、reason、marker、view、event、job、receipt 和 protocol error。 | DTO、refs、views、events、jobs、receipts、protocol errors。 | `core-contracts` |
| `domain` | `crates/domain` / `member-domain` | 定义 CP01～CP07 的 local truth、support truth、derived-read state、policy、guard、history 和 domain error。 | aggregates、records、value objects、state、policy、`DomainError`。 | `contracts`、`core-contracts` |
| `application` | `crates/application` / `member-application` | 编排九个 Application Service、Command / Query / Consumer / Job use-case、UoW、幂等和所有 inward Port。 | services、facade、ports、stores traits、UoW、idempotency、`ApplicationError`。 | `contracts`、`domain`、`core-contracts` |
| `infra` | `crates/infra` / `member-infra` | 实现 Store、resolver、publisher、handoff、Clock / ID、blocked seams、config binding 和 runtime builder。 | adapters、stores、builder、config、`InfraError`。 | `contracts`、`domain`、`application`、`core-contracts` |
| `api` | `crates/api` / `member-api` | 同步 Command / Query logical entry translation。 | handlers、entry mappers、`ApiError`。 | `contracts`、`application`、`infra`（仅 assembly） |
| `worker` | `crates/worker` / `member-worker` | owner-specific Consumer、feedback / committed-fact re-entry、continuation dispatch。 | consumers、dispatchers、`WorkerError`。 | `contracts`、`application`、`infra`（仅 assembly） |
| `jobs` | `crates/jobs` / `member-jobs` | Publication / Observation relay、External Context refresh、projection rebuild、gap reconciliation。 | job runners、job report mapping、`JobError`。 | `contracts`、`application`、`infra`（仅 assembly） |

### 6.2 模块依赖图：`L2-member` 模块实现主轴

```text
+------------------+
|  core-contracts   |
+---------+--------+
          ^
          |
+---------+--------+
|     contracts    |
+---------+--------+
          ^
          |
+---------+--------+
|       domain     |
+---------+--------+
          ^
          |
+---------+--------+        implements inward ports
|    application   |<--------------------------------+
+---------+--------+                                 |
          ^                                          |
          |                                          |
   +------+------+------+                            |
   |             |     |                            |
+--+--+      +---+--+  +--+---+                     |
| api |      |worker|  |jobs |---------------------+
+-----+      +------+  +-----+                  infra
                                               (adapters)
```

关键说明：

- 图表达 module / crate 依赖，不表达函数级 flow、event route、IPC、scheduler、process 或部署拓扑。
- `application` 定义 Port，`infra` 实现 Port；`application` 不依赖 `infra`。
- `api`、`worker`、`jobs` 只调用 application facade / service；入口之间不互依。
- `contracts` 与 `domain` 不读取配置、repository、adapter 或外部正文。
- 仅 `core-contracts` 是已核验的 planned compile candidate；其它关系分别归 runtime、event、ref、adapter、fake 或 persistence。

### 6.3 模块职责表

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `member-contracts` |
| 对应概要设计主要组成部分 | §7 API / 接口骨架、§8 事件与 Job carrier、§12 read / handoff surface；覆盖 CP01～CP07 的 public boundary。 |
| 主要责任 | 定义跨入口复用的 semantic DTO、typed refs、metadata、safe reason / marker、query view、receipt、event candidate 和 job report carrier。 |
| 对外暴露 | `refs.rs`、`metadata.rs`、`commands.rs`、`queries.rs`、`consumers.rs`、`events.rs`、`jobs.rs`、`views.rs`、`receipts.rs`、`errors.rs`。 |
| 允许依赖 | `core-contracts` 中已核验且确有使用的 shared primitive。 |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs`；任何 sibling business crate。 |
| owner 边界 | 不拥有外部 envelope、topic、route、delivery、authorization、Runtime outcome 或正文。 |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `member-domain` |
| 对应概要设计主要组成部分 | CP01～CP07 的对象、状态、policy、history、trace、outbox 和 projection state。 |
| 主要责任 | 保存 / 推导 member-owned local truth、support truth 和 derived-read truth，执行 subject、owner、body-free、append / successor、unknown fence 等不变量。 |
| 对外暴露 | CP 对象、value object、state enum、policy / guard 和 `DomainError`；供 application 编排，不承诺跨仓 public API。 |
| 允许依赖 | `contracts`、`core-contracts`。 |
| 禁止依赖 | repository、adapter、config、HTTP、RPC、Bus client、Runtime loop、LLM、Tools execution、外部 SDK、Job runner。 |
| owner 边界 | 不保存 Runtime run / context / plan / outcome、Governance approval truth、Conversation / Artifact body、host lifecycle 或 observability backend。 |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `member-application` |
| 对应概要设计主要组成部分 | 九个 Application Service、通用 Command / Query / Consumer / Job 编排、Ports / Store / Handoff seam。 |
| 主要责任 | 校验入口上下文、加载 typed truth / resolution、调用 domain method、控制 UoW、幂等、local commit、trace / projection stale / continuation side effect。 |
| 对外暴露 | `facade.rs`、九个 service、`ports/`、`unit_of_work.rs`、`idempotency.rs`、`errors.rs`。 |
| 允许依赖 | `contracts`、`domain`、`core-contracts`。 |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`、具体 DB / queue / HTTP / RPC / SDK。 |
| owner 边界 | 只编排 member local / support / derived-read 写入；不替代 domain policy 或外部 owner。 |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `member-infra` |
| 对应概要设计主要组成部分 | Persistence / Projection、Ports / External Seams、Config Binding、Runtime Assembly。 |
| 主要责任 | 实现 application-owned Store / resolver / publisher / handoff / technical Port，提供 deterministic fake / blocked seam slot、配置解析和依赖装配。 |
| 对外暴露 | local truth / support / projection stores、source resolvers、publishers、handoff adapters、blocked seam implementations、config、runtime builder、`InfraError`。 |
| 允许依赖 | `contracts`、`domain`、`application`、`core-contracts`。 |
| 禁止依赖 | `api`、`worker`、`jobs`；禁止 adapter 改写 domain invariant 或创建 source-owner truth。 |
| owner 边界 | adapter 返回 typed ref / safe result / attempt / gap / blocked outcome；不得把 transport 成功等同业务成功。 |

#### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `member-api`，当前 planned library only。 |
| 对应概要设计主要组成部分 | CP01、CP03 的 Command entry，CP05 的 trace Query entry，CP07 的 member Query entry。 |
| 主要责任 | 解析 contracts DTO、检查入口 metadata、调用 application facade、映射 application / protocol error。 |
| 对外暴露 | command / query entry functions、logical route placeholder、`ApiError`。 |
| 允许依赖 | `contracts`、`application`；`infra` 仅由 composition root 使用。 |
| 禁止依赖 | 直接访问 repository、domain transition、publisher、resolver；不预设 HTTP / RPC / UDS route 或 server lifecycle。 |

#### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `member-worker`，当前 planned library only。 |
| 对应概要设计主要组成部分 | 14 个 Consumer、feedback re-entry、CP01～CP07 committed-fact / projection dispatch。 |
| 主要责任 | 做 envelope、source、version、dedup、ordering、body gate，调用 application consumer service，转发 receipt / quarantine-safe disposition。 |
| 对外暴露 | CP-specific consumer entry、continuation dispatch、`WorkerError`。 |
| 允许依赖 | `contracts`、`application`；`infra` 仅由 assembly 使用。 |
| 禁止依赖 | 直接写 Store / domain、拥有 Bus delivery / Runtime outcome / host health、形成 generic provider。 |

#### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `member-jobs`，当前 planned library only。 |
| 对应概要设计主要组成部分 | CP04 publication relay、CP05 observation relay、CP06 context refresh、CP07 projection rebuild / gap reconciliation。 |
| 主要责任 | 校验 Job metadata、加载 committed facts / gaps / watermark / prepared attempts，调用 application continuation service，返回 blocked / waiting / partial / unknown-safe report。 |
| 对外暴露 | 五类 logical runner、job result mapping、`JobError`。 |
| 允许依赖 | `contracts`、`application`；`infra` 仅由 assembly 使用。 |
| 禁止依赖 | 直接修复 source truth、直接调用 concrete adapter、把 job report / run id / evidence 当业务事实；不预设 scheduler / binary。 |

### 6.4 文件与代码主体映射表

| 文件路径（planned） | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | member-local ID、typed external refs、purpose / reason / marker | shared contract | 区分 local record ref、external owner ref、source / payload / envelope ref；禁止 untyped string owner。 |
| `crates/contracts/src/metadata.rs` | actor、correlation、idempotency、trace、source metadata | DTO | 提供 command / query / consumer / job 的安全元数据；不携带正文或 secret。 |
| `crates/contracts/src/commands.rs` | 10 个 Command request / result carrier | DTO | 承载 local / support truth write intent；不执行 policy。 |
| `crates/contracts/src/queries.rs` | 16 个 Query request / response / page carrier | DTO | 承载 body-free read surface、freshness、gap、visibility、not-ready。 |
| `crates/contracts/src/consumers.rs` | external / member-fact envelope、receipt、disposition | DTO | 规定 source / version / dedup / body gate 槽位；exact carrier 仍 pending。 |
| `crates/contracts/src/events.rs` | 24 个 semantic Event candidate | DTO | 传播 committed local ref / revision / marker；不表达 route、delivery 或 observed。 |
| `crates/contracts/src/jobs.rs` | 5 个 Job request / report carrier | DTO | 只承载 relay / refresh / rebuild / reconcile 的 public logical surface。 |
| `crates/contracts/src/views.rs` | presence、posture、trace、mirror、summary、outlet、diagnostic read views | DTO | 提供稳定 body-free Query output；不取得写权。 |
| `crates/contracts/src/receipts.rs` | consumer / handoff / continuation receipt | DTO | 显式 duplicate、blocked、unknown、quarantine-safe result；不伪造外部 acceptance。 |
| `crates/contracts/src/errors.rs` | protocol-safe error codes / redacted detail | DTO | 对外错误不泄露 secret、raw body 或 adapter internals。 |
| `crates/domain/src/invariants.rs` | cross-CP subject / owner / body / history guards | policy support | 统一 invariant helper；不是无界 `common` bucket。 |
| `crates/domain/src/presence_host.rs` | CP01 五对象 / policy | domain | admission、presence、host material / attempt。 |
| `crates/domain/src/inbound.rs` | CP02 五对象 / policy | domain | scope、body-free fact、screening。 |
| `crates/domain/src/runtime_mediation.rs` | CP03 五对象 / policy | domain | delivery、submission、result link、reception。 |
| `crates/domain/src/outbound.rs` | CP04 五对象 / policy | domain | outbound decision、safe material、publication attempt / gap。 |
| `crates/domain/src/interaction_trace.rs` | CP05 五对象 / policy | domain | committed trace、observation material / attempt / gap。 |
| `crates/domain/src/external_context_mirror.rs` | CP06 四对象 / policy | domain | snapshot、neutral resolution、mirror gap。 |
| `crates/domain/src/read_model.rs` | CP07 五对象 / policy | domain | projection state、read policy、derived view identity semantics。 |
| `crates/domain/src/errors.rs` | `DomainError` | domain | 领域失败、非法状态、body / owner / source invariant violation。 |
| `crates/application/src/facade.rs` | 薄 entry-facing facade | application | 按命名 service 路由；不形成 mega owner。 |
| `crates/application/src/presence_service.rs` | PresenceApplicationService | service | admission / presence use case。 |
| `crates/application/src/host_collaboration_service.rs` | HostCollaborationService | service | material / attempt / feedback continuation。 |
| `crates/application/src/subscription_scope_service.rs` | SubscriptionScopeService | service | scope establish / replace。 |
| `crates/application/src/inbound_boundary_service.rs` | InboundBoundaryService | service | fact intake / screening。 |
| `crates/application/src/runtime_mediation_service.rs` | RuntimeMediationService | service | delivery / submission / result / reception。 |
| `crates/application/src/outbound_boundary_service.rs` | OutboundBoundaryService | service | outbound decision / material / attempt / gap。 |
| `crates/application/src/interaction_trace_service.rs` | InteractionTraceService | service | committed-fact trace / observation continuation。 |
| `crates/application/src/external_context_mirror_service.rs` | ExternalContextMirrorService | service | owner-specific resolution / refresh。 |
| `crates/application/src/member_read_model_service.rs` | MemberReadModelService | service | projection update / read assembly / rebuild coordination。 |
| `crates/application/src/ports/mod.rs` | Port exports | trait boundary | 显式导出，不隐藏 source-owner seam。 |
| `crates/application/src/ports/stores.rs` | local / support / projection / continuation Store traits | trait | 提供 versioned read、append、expected-version、page 和 UoW 入口。 |
| `crates/application/src/ports/sources.rs` | subject / identity / rule / Runtime / capability / route resolver traits | trait | owner-specific safe resolution；不建立 generic external hub。 |
| `crates/application/src/ports/handoff.rs` | host / publication / observation handoff traits | trait | 只返回 attempt / submission / receipt / gap-safe result。 |
| `crates/application/src/ports/technical.rs` | Clock / ID / digest / serialization technical traits | trait | 为 domain/application 提供稳定技术输入；不改变 owner。 |
| `crates/application/src/unit_of_work.rs` | local UoW trait | application | 控制 truth、trace、projection marker、result 的本地提交边界。 |
| `crates/application/src/idempotency.rs` | key / digest / stored-result orchestration | application | duplicate / same-digest replay / conflict；禁止 blind replay。 |
| `crates/application/src/errors.rs` | `ApplicationError` | application | 统一映射 domain、port、UoW、consistency、blocked / unknown。 |
| `crates/infra/src/local_truth_store.rs` | CP01～CP05 local Store implementation slot | adapter | planned fake / durable implementation；不选择 DB。 |
| `crates/infra/src/support_truth_store.rs` | CP06 support Store implementation slot | adapter | snapshot / resolution / gap；不持有 external truth。 |
| `crates/infra/src/projection_store.rs` | CP07 projection Store implementation slot | adapter | summary / outlet / diagnostic / state；可重建。 |
| `crates/infra/src/continuation_store.rs` | attempt / gap continuation carrier | adapter | 不等同 broker、outbox product 或 scheduler。 |
| `crates/infra/src/blocked_seams.rs` | pending upstream seam implementations | adapter | fail-closed / waiting / blocked；不伪造 success。 |
| `crates/infra/src/config.rs` | typed effective config candidate | adapter | 只绑定已允许的运行参数；完整 key 留 Step 14 / 04。 |
| `crates/infra/src/runtime_builder.rs` | composition root | adapter | 注入 application Ports；不选择 physical topology。 |
| `crates/api/src/command_entry.rs` | Command entry mapper | handler | DTO → application request；不直接 mutation。 |
| `crates/api/src/query_entry.rs` | Query entry mapper | handler | DTO → read service；保持 no-write。 |
| `crates/worker/src/<cp>.rs` | CP-specific Consumer dispatch | handler | source / dedup / body gate 后 re-entry。 |
| `crates/worker/src/continuation_dispatch.rs` | local continuation dispatch | handler | 不选择 queue / polling / scheduler。 |
| `crates/jobs/src/publication_relay.rs` | PublicationRelayJob | runner | 已提交 outbound material 的 continuation。 |
| `crates/jobs/src/observation_relay.rs` | ObservationRelayJob | runner | body-free observation continuation。 |
| `crates/jobs/src/external_context_refresh.rs` | ExternalContextRefreshJob | runner | snapshot / resolution refresh。 |
| `crates/jobs/src/projection_rebuild.rs` | MemberProjectionRebuildJob | runner | projection rebuild。 |
| `crates/jobs/src/gap_reconciliation.rs` | GapReconciliationJob | runner | 只更新 read-side gap / freshness。 |

### 6.5 业务组成部分到模块映射表

| 业务组成部分 | `contracts` | `domain` | `application` | `infra` | `api` / `worker` / `jobs` |
|---|---|---|---|---|---|
| CP01 Presence and Host Collaboration | admission / presence / host material DTO、refs、receipt | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy` | `PresenceApplicationService`、`HostCollaborationService`、subject / credential / host Port 调用 | presence / host Store、blocked credential / host seam adapter | `api` command entry、`worker` host feedback；无独立 CP01 Job。 |
| CP02 Inbound Boundary | scope / fact / screening DTO、envelope / receipt | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、两类 policy | `SubscriptionScopeService`、`InboundBoundaryService`、rule-resolution read | inbound Store、dedup Store、Bus intake blocked seam | `worker` InboundFactConsumer；scope commands / queries 在 `api`。 |
| CP03 Runtime Mediation | delivery / submission / result / reception DTO、refs、receipt | 四个 Runtime mediation object、`RuntimeMediationPolicy` | `RuntimeMediationService`、entry / result / material Port 调用 | mediation Store、Runtime blocked seam | `api` delivery / link command；`worker` material consumer。 |
| CP04 Outbound Boundary | outbound / material / attempt / gap DTO、event candidate | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、policy | `OutboundBoundaryService`、feedback / publication orchestration | outbound / continuation Store、publication blocked seam | `worker` reception / feedback；`jobs` publication relay。 |
| CP05 Interaction Trace | trace / observation view、receipt、event / job DTO | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、policy | `InteractionTraceService`、trace / observation Port 调用 | trace Store、observation handoff adapter | `worker` committed-fact / feedback；`api` trace Query；`jobs` observation relay。 |
| CP06 External Context Mirror | snapshot / resolution / gap DTO、source refs、freshness markers | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy` | `ExternalContextMirrorService`、owner-specific resolver orchestration | support Store、blocked source resolvers、reference state adapter | `api` resolve / refresh command、resolution Query；`worker` 五类 source update；`jobs` refresh。 |
| CP07 Member Read Model | summary / outlet / diagnostic / projection DTO、page / not-ready surface | `MemberProjectionState`、`ReadProjectionPolicy` 及 view identity guards | `MemberReadModelService`、projection / read Port 调用 | projection Store、rebuild / reconcile support | `api` 三类 Query；`worker` projection / outlet update；`jobs` rebuild / reconcile。 |

### 6.6 Application Service 主轴

| Service | 主要 CP | 核心职责 | 不承接 |
|---|---|---|---|
| `PresenceApplicationService` | CP01 | admission、presence 建立与显式 transition | host health、container lifecycle、credential issue。 |
| `HostCollaborationService` | CP01 | material、attempt、feedback link 与 local continuation | host acceptance、session、registry。 |
| `SubscriptionScopeService` | CP02 | scope establish / replace、revision 和 current match | Bus subscription delivery、Governance policy truth。 |
| `InboundBoundaryService` | CP02 | envelope intake、transient inspection marker、screening | raw body persistence、LLM inference、Runtime admission。 |
| `RuntimeMediationService` | CP03 | screening → delivery decision → submission attempt → result / reception | Runtime loop、run、context、plan、outcome。 |
| `OutboundBoundaryService` | CP04 | accepted reception → outbound decision → safe material → attempt / gap | Conversation truth、Bus delivery、downstream acceptance。 |
| `InteractionTraceService` | CP05 | committed local fact trace、observation material / attempt / gap | complete log、evidence、observed truth。 |
| `ExternalContextMirrorService` | CP06 | source-specific snapshot / resolution / gap 与 freshness | external truth、authorization、registry、definition body。 |
| `MemberReadModelService` | CP07 | projection update / rebuild / read-side assembly | core mutation、source repair、authorization / invocation。 |

### 6.7 依赖类型分类

| 依赖类别 | 关联 / 代表 | 本仓表达 | 是否 Cargo dependency |
|---|---|---|---|
| compile | `L0-core` `core-contracts` | shared primitive、metadata / error / envelope category 的正式引用候选 | 是，且仅此候选可进入 planned path dependency。 |
| runtime | member-service、Runtime、Work、Identity、Governance、Tools / Method 等 | application-owned inward Port、typed ref、safe result、blocked-aware adapter | 否。 |
| event | `L0-bus`、host / Runtime / downstream / observation feedback | Consumer、semantic event candidate、receipt、local continuation | 否。 |
| ref | `ProjectMemberRef`、`GlobalMemberRef`、Runtime / source / target / feedback refs | contracts typed ref 和 domain 关联字段 | 否；不引入 source owner crate。 |
| adapter | host / Runtime / Bus / resolver / publisher / handoff 技术翻译 | `infra` implementation of application Port | 不是依赖类型；exact carrier pending。 |
| fake | deterministic test double for local Ports | future `infra` / tests support，保持与 Port 语义一致 | 否，且不得当作 external evidence。 |
| persistence | local truth / support / projection / continuation Store | application trait + infra implementation slot | 否；DB / table / queue 尚未选择。 |

### 6.8 唯一 planned compile dependency

未来目标仓 root `Cargo.toml` 只可保留如下候选关系：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

这不表示 member-specific Core event family、source、subject、payload 或 route 已闭口；`L2M-UP-005` 仍开放。`L0-bus`、`L0-sdk`、`L2-runtime`、`L2-tools`、`L2-member-service`、`L2-member-images` 及所有 L1 / L3 sibling 均不进入本仓 Cargo path dependency。

## 7. 对象归属预告（Step 6 输入）

### 7.1 `contracts` shared types 与 public carriers

下列类型在 Step 6 只做归属和边界预告，完整字段、函数和 enum variant 必须在 Step 6 独立展开：

| 对象组 | 归属文件 | 代表类型 | 约束 |
|---|---|---|---|
| local IDs / refs | `contracts/src/refs.rs` | `StartupAdmissionId`、`MemberPresenceId`、`RuntimeBoundaryRef`、`PublicationGapId` 等 | typed、body-free；区分 local record ref 与 external owner ref。 |
| metadata | `contracts/src/metadata.rs` | `ActorContext`、`CommandMetadata`、`QueryMetadata`、`MemberCorrelation`、`IdempotencyKey` | 不携带 raw body、credential secret 或 transport header。 |
| public state / reason / marker | `contracts/src/refs.rs` / `metadata.rs` | `StartupAdmissionDisposition`、`ScreeningDisposition`、`ProjectionFreshness` 等 | public DTO 可引用；状态语义不跨对象复用。 |
| command / query / consumer / event / job carrier | `commands.rs`、`queries.rs`、`consumers.rs`、`events.rs`、`jobs.rs` | 10 / 16 / 14 / 24 / 5 分母 | 每个 carrier 在 Step 8 有独立 schema；exact route / envelope pending。 |
| view / receipt / error | `views.rs`、`receipts.rs`、`errors.rs` | posture、summary、outlet、diagnostic、not-ready、receipt、protocol error | Query no-write、degraded / unknown 显式。 |

### 7.2 `domain` truth / support / derived-read objects

| CP | 对象组 | planned domain 文件 | owner 边界 |
|---|---|---|---|
| CP01 | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy` | `presence_host.rs` | 不拥有 host / credential / container truth。 |
| CP02 | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、`SubscriptionScopePolicy`、`InboundScreeningPolicy` | `inbound.rs` | 不拥有 Bus delivery、Governance policy 或 raw body。 |
| CP03 | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy` | `runtime_mediation.rs` | 不拥有 Runtime run / context / plan / outcome / transport。 |
| CP04 | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy` | `outbound.rs` | 不拥有 Conversation、Bus delivery 或 downstream acceptance。 |
| CP05 | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy` | `interaction_trace.rs` | 不拥有 complete log、evidence、observed truth。 |
| CP06 | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy` | `external_context_mirror.rs` | 不拥有 external truth、authorization、registry、definition body。 |
| CP07 | `MemberProjectionState`、`ReadProjectionPolicy`；视图字段由 contracts carrier 承载 | `read_model.rs` | 不拥有 core write、source truth、authorization 或 invocation readiness。 |

### 7.3 非 core 模块对象归属预告

| 模块 | 预告对象 / carrier | Step 6 处理口径 |
|---|---|---|
| `application` | service facade、`OperationContext`、idempotency record、stored result ref、visibility decision、job report assembly helper | 不是新的业务 truth；Step 6 需决定哪些是唯一稳定 carrier，哪些留 Step 7 / 8。 |
| `infra` | runtime config candidate、builder、adapter availability、store state、blocked seam state | 只表达技术承载 / availability；不形成 owner truth。 |
| `api` | command entry、query entry、request context、error mapping | 只做 DTO / service translation；不持有 domain lifecycle。 |
| `worker` | consumer entry、receipt accumulator、continuation dispatch context | 只表达边界处理；不取得 source write 权。 |
| `jobs` | job entry、cursor / watermark context、job report mapper | 只表达 Operations continuation；不把 report 写成事实。 |

## 8. 模块测试切口预告

正式测试切口留给未来 Step 16；本步只固定每个模块必须能被测试的结构边界，不声明任何已执行结果：

| 模块 | 最小测试职责 |
|---|---|
| `contracts` | DTO construction / roundtrip、二级 public type schema、metadata / idempotency presence、enum compatibility、body-free fixture、receipt / report surface。 |
| `domain` | 每个 CP 的不变量、合法 / 非法 transition、append / successor、unknown fence、source-owner / subject guard、forbidden-body rejection。 |
| `application` | Command UoW、duplicate same-digest replay / conflict、Query no-write、Consumer dedup / ordering、Job no-truth-repair、Port error mapping。 |
| `infra` | versioned Store read / write、expected-version conflict、blocked seam outcome、fake / durable parity、builder missing-slot rejection、config validation。 |
| `api` | actor / metadata validation、DTO mapping、protocol error redaction、Query no-write、未支持 route / carrier 的保守映射。 |
| `worker` | envelope field gate、unsupported version、duplicate / late / out-of-order、forbidden-body quarantine、application re-entry。 |
| `jobs` | cursor / watermark、partial result、unknown side-effect fence、projection stale / rebuild、refresh append-only、report replay。 |

## 9. CP01～CP07 的模块接缝与方向审计

| 接缝 | 正向方向 | 禁止方向 | 结论 |
|---|---|---|---|
| CP01 → CP02 | admitted subject / local presence 作为 screening 前置 | CP02 修改 host / credential / presence source | pass |
| CP02 → CP03 | passed / controlled-degraded screening 进入 delivery evaluation | CP03 重裁 Governance rule 或接收 raw body | pass |
| CP03 → CP04 | accepted committed material reception 进入 outbound evaluation | CP04 反写 Runtime decision / outcome | pass |
| CP01～CP04 → CP05 | committed local fact refs 形成 trace / observation relation | Trace 回滚或覆盖源事实 | pass |
| CP06 → CP02 | CP06 committed neutral rule resolution 供 CP02 read | CP02 建第二个 rule-source Consumer | pass |
| CP06 → CP07 | capability / method resolution / gap 供 outlet projection | CP07 直连 Tools / Method source event | pass |
| CP01～CP06 → CP07 | committed facts / resolution 供 read projection | Query / projection 修复 source truth | pass |
| host / Runtime / Bus / downstream feedback | owner-specific Consumer 形成 link / gap / classification | feedback 直接改写 local source decision | pass |

## 10. 依赖裁剪与上游 blocker 影响

| Blocker | 受影响模块 | 本步保守口径 |
|---|---|---|
| `L2M-UP-001` host / IPC / credential / lifecycle contract | `application` Ports、`infra` blocked seams、`worker` host feedback、`api` presence entry | 只保留 logical HostCollaborationPort 和 blocked-aware result；不选 UDS、RPC、credential carrier、health / session。 |
| `L2M-UP-002` image release / manifest / pinned entry | `infra` builder、`api` / `worker` assembly | image supply 不进入 member object、crate 或 Cargo；缺失时 waiting / blocked。 |
| `L2M-UP-003` Runtime entry mapping | `application` RuntimeMediationService、`infra` Runtime seam、`api` delivery entry | 只规划 RuntimeEntryPort；mapping 不可证明时 blocked / pending。 |
| `L2M-UP-004` Runtime handoff / source family | CP03、CP04、CP05 external seam | 只使用 typed ref / safe material / attempt / gap；不写 accepted / delivered / observed。 |
| `L2M-UP-005` Core member schema / event route | `contracts` consumers / events、`worker` dispatch、`infra` publisher | semantic event / logical envelope 可规划，type / source / subject / payload / topic / route 不闭口。 |
| `L2M-UP-006` startup credential owner | CP01 domain / application / infra | 只消费 verification result；不签发、保存或撤销 credential。 |
| `L2M-UP-007` screening rule source / taxonomy | CP02 policy read、CP06 source consumer | CP06 是唯一 source-update Consumer owner；unknown / stale / conflict fail-closed。 |
| `L2M-UP-008` non-project execution subject | 所有 subject-bearing module | 正向只支持 `ProjectMemberRef + GlobalMemberRef`；第三主语不创建，保持 blocked。 |
| `L2M-DDD-001` implementation repo missing | 全部 planned crate / file | 全部路径标 planned；不运行 build / test，不声称实现。 |
| `L2M-DDD-002` physical persistence / UoW / durability unknown | `infra` Store、`application` UoW / Ports | 只固定 logical Store / UoW owner；DB、queue、schema、durability 留后续 Step / authority。 |

## 11. 回填草稿

未来正式 `03-详细设计.md` §5 应从本文件回填以下收口内容：

1. 七个实现模块及其 `contracts → domain → application → infra → api / worker / jobs` 依赖方向。
2. CP01～CP07 是业务责任轴，跨七个实现模块，不机械映射成 crate。
3. 每个模块的职责、暴露面、允许 / 禁止依赖和 planned 文件责任。
4. `application` 是 Port / Store / resolver / publisher / handoff / UoW / idempotency trait 的唯一 owner，`infra` 是唯一实现层。
5. `api`、`worker`、`jobs` 只作为入口 / continuation layer，不直接写 domain / Store，也不拥有外部 truth。
6. `core-contracts` 是唯一 planned sibling compile candidate；runtime、event、ref、adapter、fake、persistence 关系不进入 Cargo dependency。
7. CP06 是 Governance rule 与 Tools / Method capability source update 的唯一 member-side Consumer owner；CP07 只消费 CP06 已提交 resolution / gap。
8. Step 6 应按模块 capability → object 扩展；Step 7 按模块 Port；Step 8 按协议族；Step 9 按接口 flow，不能把过程表直接装入正式正文。

正式正文不得回填本文件的写入过程、用户授权状态、现场路径探测、上游 blocker 详情表、测试结果或 readiness 声明。

## 12. 待确认事项

| 事项 | 当前状态 | 后续承接 / 回开条件 |
|---|---|---|
| host registration / IPC / credential exact contract | pending (`L2M-UP-001/006`) | Step 7 定义 blocked-aware Port；上游 authority 发布 exact carrier 后回开受影响模块。 |
| image pinned release / manifest / builder handoff | pending (`L2M-UP-002`) | 不进入 object / Cargo；若改变 builder 输入，回开 Step 4 / 7。 |
| Runtime entry / result / material mapping | pending (`L2M-UP-003/004`) | Step 7 / 8 / 9 只允许 ref、safe result、attempt、gap；不得补造 run。 |
| member-specific event schema / route | pending (`L2M-UP-005`) | Step 8 可定义 semantic carrier；exact type / route 由 Core / Bus authority 关闭。 |
| screening rule taxonomy | pending (`L2M-UP-007`) | CP06 负责 source update；CP02 只读 neutral resolution。 |
| third execution subject | pending (`L2M-UP-008`) | 维持 project-scoped fail-closed；若新增主语，必须回退 Step 1～3 和概要对象池。 |
| implementation repo | missing (`L2M-DDD-001`) | Step 4 layout 和本文件继续 planned；正式实现授权前不得创建。 |
| physical persistence / UoW durability | pending (`L2M-DDD-002`) | Step 7 固定 logical read / write faces，Step 11 再收口物理一致性。 |
| non-core module object closure | deferred to Step 6 | Step 6 必须逐模块决定 application / infra / entry / job carrier 是否闭口或 defer。 |

## 13. 进入下一步条件

| 检查项 | 结论 | 说明 |
|---|---|---|
| 七个实现模块与 Step 4 一致 | pass | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 唯一且稳定。 |
| CP01～CP07 与模块正交 | pass | 业务责任没有被机械拆成 crate；每个 CP 均有跨层承载。 |
| 模块职责 / 暴露 / 禁止方向完整 | pass | 七个模块均有责任表和依赖红线。 |
| 对象、trait、handler、repository 归属明确 | pass | domain / contracts / application / infra / entry 归属可回指；字段和签名留后续 Step。 |
| 依赖分类正确 | pass | compile / runtime / event / ref / adapter / fake / persistence 未混写。 |
| pending 诚实性 | pass_with_upstream_blockers | `L2M-UP-001~008`、`L2M-DDD-001~002` 保持开放；没有伪造正向合同。 |
| 未越界进入 Step 6～9 | pass | 无完整对象、Port、协议 schema、函数流或状态矩阵。 |
| 正式正文未修改 | pass | 只创建本 Step calibration 文件；formal 03 仍禁止。 |

### 13.1 Step 5 结论

```text
step_05_status = completed
step_05_gate = pass_with_upstream_blockers
gate_status = stop_review
current_module = module_contracts
next_allowed_action = create_step_06_object_contracts_after_step_05_review
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```

Step 5 已完成并停审。下一步（在本轮已授权范围内）是读取 Step 6 SOP、书写规范 §5.5 对象契约要求、`L1-governance` Step 6 和本文件，创建 `03_ddd_step_06_object_contracts.md`；不得跳过 Step 6 或在本 Step 文件中预写其对象字段全集。
