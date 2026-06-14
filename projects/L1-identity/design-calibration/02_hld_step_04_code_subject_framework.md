# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-06-11
> 状态: 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 2 目标范围、Step 3 约束和 `01` 语义结构 / 运行承载 / 依赖方向 / 通信方式 | 已完成 | §2 |
| 回答 Step 4 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 4 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出架构模块到代码主体映射图、实现分层视图和关系说明 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §4 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_02_goals_scope.md` | 已完成并已获用户认可 | 提供本轮概要范围和深度口径 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供代码主体框架必须遵守的结构性约束 |
| `projects/L1-identity/01-架构设计.md` §6 | 当前架构输入 | 提供内部语义结构:核心子域、支撑子域、本地索引 / 投影 / 引用 |
| `projects/L1-identity/01-架构设计.md` §7 | 当前架构输入 | 提供同步入口、异步 / 后台承接、维护 / 对账、正式存储、trace / audit / outbox 承载 |
| `projects/L1-identity/01-架构设计.md` §8 | 当前架构输入 | 提供身份核心语义、能力承接、外部来源接缝、消费 / 投影接缝、技术承载、基础契约角色 |
| `projects/L1-identity/01-架构设计.md` §10 | 当前架构输入 | 提供同步请求、异步事件 / 回调、后台任务 / 延后承接三类交互 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定本 Step 必须产出两张 ASCII 图和业务 / 实现分层关系说明 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定第 4 章和 ASCII 图统一格式 |
| 旧 `02_hld_step_04_code_subject_framework.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

架构层语义结构需要落到两条轴上:

- 业务结构轴:平台级成员身份真相、成员生命周期边界、角色能力摘要、身份生涯与记忆引用、身份事实消费与追溯、外部来源引用、消费投影与对账、事件协作影子。
- 实现分层轴:Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Outbox。

在代码主体骨架上,平台级成员身份真相对应身份 command / query service、成员身份 domain object 和 identity repository 轮廓;生命周期对应 lifecycle application service、lifecycle domain state / policy 和 governance basis port 轮廓;角色能力摘要对应 role capability service、source resolver port、summary snapshot / reference state 轮廓;生涯与记忆引用对应 career append service、memory ref service、work / memory / archive source port 和 append-only history / reference state 轮廓;消费与追溯对应 query service、projection、trace / audit / history view、outbox publisher 轮廓;派生维护和事件协作对应 maintenance jobs、reference refresh、reconciliation report、outbox publisher、handoff runner 轮廓。

本 Step 只建立“可继续详细设计”的代码主体骨架,不定义最终对象字段、接口 schema、trait 签名、事务顺序或代码目录。

### 3.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

Inbound / Operations 是入口和运行承接层,包括:

- command intake:承接成员建档、生命周期、角色能力、career、memory refs 等受控写入意图。
- query intake:承接身份摘要读取、追溯读取、消费读取和可见性裁剪读取。
- event intake:承接 method / work / governance / memory / archive 等来源变化或回调。
- operations jobs:承接 projection rebuild、reference refresh、reconciliation、outbox publish、handoff follow-up。

Application Services 是用例编排层,包括:

- Identity command / query application service。
- Lifecycle application service。
- Role capability application service。
- Career and memory reference application service。
- Consumption / trace query application service。
- Maintenance / reconciliation / publisher / handoff application service。

Inbound / Operations 不直接拥有业务判断;Application Services 编排 domain、repository、port、trace / audit / outbox、projection 和 result。

### 3.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Outbox?

Domain Model 承载 identity 的本地语义和不变量,包括:

- 成员身份主语和 stable identity ref / tombstone 轮廓。
- lifecycle state、lifecycle transition guard、high-risk basis guard 轮廓。
- role / capability summary、source adoption state、evidence reference relation 轮廓。
- career append record、memory / archive ref relation、reference state 轮廓。
- trace / audit / history record、outbox event material、maintenance finding 轮廓。

Ports / Persistence / Projection / Outbox 承载边界与派生:

- repositories / unit-of-work / committed truth cursor。
- external source resolver / basis resolver / memory archive handoff / event publisher。
- query projection store、consumer state store、reference snapshot store、reconciliation report store。
- outbox publisher、handoff runner、trace / audit delivery boundary。

Domain 不依赖 ports 的实现、数据库、event bus 或相邻仓 implementation;Application 通过 port 接缝协调这些外部能力。

### 3.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

本 Step 需要先点名以下代码主体主语,但它们的完整契约后移:

- Inbound / Operations:Command Intake、Query Intake、Event Intake、Maintenance Jobs、Outbox Publisher、Handoff Runner。
- Application Services:Identity Service、Lifecycle Service、Role Capability Service、Career Memory Service、Consumption Query Service、Maintenance Service。
- Domain Model:Member Identity、Lifecycle State、Role Capability Summary、Career Record、Memory Reference、Reference State、Trace / Audit / History Record、Outbox Material、Reconciliation Finding。
- Ports / Persistence / Projection / Outbox:Identity Repository、Projection Store、Reference Snapshot Store、External Source Resolver、Governance Basis Resolver、Publisher Port、Handoff Port、Report Store。

这些名称是概要层的骨架主语,不是最终 Rust type、crate、文件、trait 或 DTO 名。

### 3.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

不在本步展开:

- crate / package / module / file path。
- HTTP / RPC route、topic name、queue name、CLI command。
- 完整 trait / struct / enum / DTO / event / job schema。
- DDL、表、索引、事务隔离、cursor 生成规则。
- framework、database、message broker、cache、search、deployment product。
- test case、fixture、acceptance artifact、implementation commit boundary。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 4 将业务主要组成部分名称定得过早 | Step 5 尚未按小循环审查职责与边界,提前定死名称会压缩后续讨论 | 本 Step 只给候选业务结构轴,最终组成部分由 Step 5 收口 |
| 旧 Step 4 图使用大边框样式 | 与当前 ASCII 图规范允许字符集不完全一致 | 本轮改为树形图和自上而下分层图 |
| 旧 Step 4 将具体 service / repository / port 作为较确定结构 | 容易让详细设计误以为 trait / object 已闭口 | 本轮标注为代码主体骨架,完整契约后移 `03` |
| 旧 Step 4 对 Inbound、Application、Domain、Ports 区分较粗 | 后续容易把入口、用例编排、领域对象和技术承载混在一个模块表里 | 本轮明确实现分层职责和禁止混用 |
| 旧 Step 4 没有突出 accepted fact propagation 与 report-only maintenance 的代码安放差异 | 后续 flow 可能混淆 accepted truth、传播失败和维护修复 | 本轮将 outbox / handoff / maintenance 分开安放 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 业务结构 | 直接列身份锚定、生命周期等为主要组成部分 | 先作为候选业务结构轴,Step 5 再正式收稳主要组成部分 |
| 图格式 | 使用自定义大边框图 | 使用规范允许的树形图和自上而下分层图 |
| 实现层级 | 简要区分 Inbound / Application / Domain / Ports | 明确入口、用例编排、domain、ports / persistence / projection / outbox 的职责差异 |
| 详细程度 | 接近 service / port 轮廓 | 明确只到代码主体骨架,不写 trait / schema |
| 约束承接 | 隐含依赖裁剪和 no-write | 显式把 query no-write、eventual propagation、report-only maintenance、forbidden body 用作安放依据 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 以架构子域名称直接作为最终主要组成部分 | 暂不采用 | Step 5 需要逐组成部分审查职责、capability 和对象发现线索 |
| 以实现分层作为主要组成部分 | 不采用 | Inbound / Application / Domain / Ports 是代码安放方式,不是业务做什么 |
| 以业务结构轴 + 实现分层轴双轴表达 | 采用 | 能承接架构模块,又不提前替代 Step 5 的职责边界讨论 |
| 在图中点名候选 service / repository / port | 有条件采用 | 可作为代码主体骨架,但必须声明完整契约后移 `03` |
| 在本 Step 输出目录 / crate / 文件路径 | 不采用 | 违反概要 Step 4 边界,且会提前进入实施设计 |

---

## 7. 结构化中间产物

#### 架构模块到代码主体映射图

```text
 L1-identity
 │
 ├─ 平台级成员身份真相
 │  ├─ Identity Command / Query Service
 │  ├─ Member Identity Domain Model
 │  └─ Identity Repository / Truth Store Boundary
 │
 ├─ 成员生命周期边界
 │  ├─ Lifecycle Application Service
 │  ├─ Lifecycle State / Transition Guard
 │  └─ Governance Basis Resolver Port
 │
 ├─ 角色能力摘要
 │  ├─ Role Capability Application Service
 │  ├─ Role Capability Summary / Source State
 │  └─ Method Source Resolver / Reference Snapshot Boundary
 │
 ├─ 身份生涯与记忆引用
 │  ├─ Career Memory Application Service
 │  ├─ Career Record / Memory Reference Domain Model
 │  └─ Work Source / Memory Archive Handoff Boundary
 │
 ├─ 身份事实消费与追溯
 │  ├─ Consumption Query Service
 │  ├─ Projection / Consumer State / Trace View
 │  └─ Trace / Audit / History Boundary
 │
 └─ 本地索引 / 投影 / 引用 / 事件协作
    ├─ Reference Refresh / Projection Rebuild Jobs
    ├─ Reconciliation Report Store
    └─ Outbox Publisher / Handoff Runner
```

关键说明:
- 该图把架构层语义结构映射到概要层代码主体骨架,不是 Step 5 的最终主要组成部分裁决。
- 图中 service、model、repository、port、job、publisher、runner 都是概要主语,完整契约、签名、字段和事务顺序后移 `03`。
- 外部来源只能以 resolver、source boundary、handoff boundary 或 reference snapshot 进入,不能作为本仓内部代码主体。
- 本地索引 / 投影 / 引用 / 事件协作只承接派生、传播和 report-only 维护,不得反写 identity truth 或相邻仓 truth。

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
│
▼
┌──────────────────────────────────────────┐
│ Inbound / Operations                     │
│ Command Intake / Query Intake            │
│ Event Intake / Jobs / Publisher / Handoff│
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ Application Services                     │
│ Identity / Lifecycle / Role Capability   │
│ Career Memory / Consumption / Maintenance│
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ Domain Model                             │
│ Member Identity / Lifecycle State        │
│ Summary / Career / Reference / History   │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ Ports / Persistence / Projection / Outbox│
│ Repositories / Resolvers / Stores        │
│ Publisher / Handoff / Report Boundary    │
└──────────────────────────────────────────┘
```

关键说明:
- 该图说明外部入口如何进入实现分层,不表达接口时序、事务边界、部署拓扑或文件目录。
- Inbound / Operations 只承接入口和运行触发;业务判断应在 Application Services 与 Domain Model 中完成。
- Domain Model 不依赖 adapter、database、event bus、projection store 或相邻仓 implementation。
- Ports / Persistence / Projection / Outbox 是边界和承载层,不能反向定义核心 identity truth。

### 7.1 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 从需求能力和架构语义结构承接而来的“做什么”主语,例如身份锚定、生命周期、角色能力、生涯记忆、消费追溯、维护对账等候选主轴;最终名称和职责在 Step 5 收口 |
| 实现分层 | `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Outbox` 等“代码如何安放”主语 |
| 二者关系 | 每个业务主要组成部分通常会穿过多层实现分层;每个实现分层也会承载多个业务主要组成部分的代码主体 |
| 禁止混用 | 不能把 `Application Services` 当成业务组成部分,也不能把 `生命周期` 当成单一代码层;否则对象、接口和 flow 会按错误轴拆分 |

### 7.2 关键判断

- 本 Step 暂定的业务结构轴来自 `01` 的核心子域、支撑子域和本地索引 / 投影 / 引用,用于指导 Step 5,不是最终主要组成部分清单。
- `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Outbox` 是实现分层,不是业务组成部分。
- `Identity Service`、`Lifecycle Service`、`Role Capability Service` 等是代码主体骨架名,不是完整类型名或文件名。
- query / projection / report / reconciliation 被安放在只读或派生路径,不能成为 truth write 的入口。
- event / outbox / handoff 被安放在 accepted fact propagation 和交接路径,不能成为 command accepted 的同步 fan-out 前置。
- 外部来源、相邻仓和下游 consumer 只能通过正式接缝进入,不能成为本仓内部 domain 主体。

---

## 8. 复杂度判断 / 是否拆分

本 Step 需要两张图和一个关系说明表,但不需要拆主要组成部分附录。

原因是 Step 4 的目标是建立全局代码主体框架和实现分层轴。若在本 Step 为每个业务结构轴继续拆职责、capability、对象候选和接口,会提前进入 Step 5~7。后续 Step 5 必须在本 Step 输出的框架上逐个主要组成部分展开并停审。

---

## 9. 回填草稿

正式 `02-概要设计.md` §4 后续应回填:

1. 架构模块到代码主体映射图。
2. 实现分层视图。
3. 业务主要组成部分与实现分层关系说明表。
4. 关键判断小节。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本 Step 只把业务结构轴作为候选,最终主要组成部分留到 Step 5 | 若不认可,Step 4 会提前替代 Step 5 | 当前按最新版 SOP 后移 |
| 是否认可图中代码主体名只是概要骨架名,不是最终 Rust type / trait / 文件名 | 若不认可,会提前进入 `03` 或实施设计 | 当前不写完整契约 |
| 是否认可 outbox / handoff / maintenance 与 command accepted path 在代码主体安放上分开 | 若不认可,后续 flow 可能混淆 truth accepted 与传播 / 维护 | 当前按 Step 3 约束分开 |

---

## 11. 进入下一步条件

进入 Step 5 前必须满足:

- 用户审核通过本 Step 的架构模块到代码主体映射图。
- 用户审核通过本 Step 的实现分层视图。
- 用户认可业务主要组成部分与实现分层不能混用。
- 用户认可本 Step 没有提前写入目录、文件路径、完整 trait / struct、数据库表、topic、DTO schema 或部署参数。
