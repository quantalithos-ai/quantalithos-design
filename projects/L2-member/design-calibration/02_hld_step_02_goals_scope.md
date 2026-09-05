# Step 2. 明确本仓设计目标与当前范围

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 2
> 回填章节: `02-概要设计.md` §2 本次设计目标与范围
> 生成日期: 2026-08-23
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标与边界

把 Step 1 可承接的需求 / 架构输入裁剪成本轮概要设计必须收稳的结构成果,明确当前深度和非范围。本步不正式命名对象、API、状态或代码目录。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `02_hld_step_01_upstream_boundary.md` §7 | 继承上游映射、“不再回答 / 必须回答”和 blocked boundary |
| 正式 `00-需求文档.md` C1~C5、FR / IB / BR / NFR / AC / VF | 判断哪些能力必须有概要结构承接 |
| 正式 `01-架构设计.md` 7 BC、责任层、逻辑承载、数据与交互 | 限制结构范围和设计深度 |
| `概要设计书写规范.md` §4.2 | 固定设计目标表、非范围表与章节边界 |

## 3. SOP 问题回答

### 3.1 本次最主要要把哪些结构说清

1. 七个架构上下文如何落成业务主要组成部分与代码主体骨架,同时保持实现分层独立。
2. 每个组成部分的 capability、关键对象、API / port、处理流和状态归属如何闭环。
3. project-scoped presence、四态 screening、Runtime controlled delivery / committed material reception、outbound decision / attempt、interaction trace、external mirror、summary / outlet 各自的本地 truth / ref / projection 边界。
4. sync admission、async committed fact / feedback、background continuation 如何分层,以及外部状态为何不回滚本地事实。
5. `L2M-UP-001~008` 如何以 typed slot、port、blocked / degraded / gap 进入结构,而不是被伪装成闭口合同。

### 3.2 应停在什么深度才足以进入详细设计

- 点名稳定的业务组成部分、代码主体、关键对象、API / Event / Job / Port 名称。
- 关键对象给出类型、责任、关键字段及字段类型、状态、成员 / 工厂函数骨架和禁止事项。
- 正式接口给出类别、输入 / 输出类型骨架、写入 / 读取边界和归属对象。
- P0 Command、会改写本地状态的 Consumer、关键 Query / Job 给出有类型参数的处理流骨架。
- 状态族给出 owner、状态含义、触发接口、允许 / 禁止迁移和传播影响。
- 配置只识别影响面与禁止配置化边界;完整 schema、函数、事务、配置和物理载体交给 03 / 04。

### 3.3 哪些内容属于本次范围

| 范围 | 必须形成的结果 |
|---|---|
| 代码主体框架 | 7 BC 到业务主体与实现层的双轴映射、两张规范 ASCII 图 |
| 主要组成部分 | capability 清单、对象发现池、内部 / 外部接缝、逐部分停审 |
| 关键对象 | local truth / decision / record / policy / ref / snapshot / projection / gap 的正式轮廓 |
| 接口骨架 | Command、Query、Inbound Consumer、Outbound Event、Operations Job、external / persistence ports |
| 关键处理流 | presence、scope / screening、Runtime delivery / reception、outbound、trace / observation、mirror、read model 主线 |
| 状态模型 | presence、screening、submission / reception、outbound / attempt / gap、resolution / projection 状态族 |
| 异常边界 | invalid subject、forbidden body、stale / conflict、duplicate / late、unknown side effect、external failure |
| 配置影响 | adapter / source / activation / schedule / retention 等影响轮廓和不可配置化 invariant |
| 下游承接 | 03 的对象 / port / transaction / error / schema 展开清单与回退规则 |

### 3.4 哪些内容当前不进入概要设计

| 非范围 | 留给哪一层 / Owner |
|---|---|
| 需求、用户故事、验收、BC / owner / 技术取舍重议 | 已由正式 00 / 01 收稳;变化须回退上游 |
| 完整对象字段全集、序列化 schema、DTO、error code、函数实现 | `03-详细设计.md` |
| aggregate / repository / transaction / concurrency / idempotency physical key、outbox carrier | `03-详细设计.md` |
| 配置键、默认值、环境变量、JSON、secret 名称与加载优先级 | `04-配置设计.md` |
| 测试场景、用例、workload、阈值、执行结果、evidence | `05-测试方案.md` / 后续执行 |
| 验收 verdict、signoff、readiness | `06-验收标准.md` / 后续真实验收 |
| 实施任务、commit boundary、排期、灰度 / 回滚 | `07-实施计划.md` / 实施流程 |
| host、Runtime、Bus、Governance、Identity、Work、Tools、Conversation 等外部 truth 的详细模型 | 各正式 owner |
| language / framework / DB / queue / IPC / process manager / deployment product | 03 / 04 / 07 在 authority 与证据下选择 |
| exact sibling / shared / event contracts | 对应 owner 闭口后受控回开;当前仅 typed boundary slot |

### 3.5 哪些内容应留给详细设计

- 每个正式对象的完整 field / invariant / constructor / method / persistence mapping。
- 每个 API / consumer / event / job / port 的完整 signature、DTO / schema、error / timeout / idempotency contract。
- local commit、history、attempt / gap、projection update 的 unit-of-work 与 transaction boundary。
- external adapter translation、backpressure、ordering、duplicate / late / unknown resolution 的实现合同。
- config ownership / validation / builder injection 和 04 配置项承接入口。
- 可验证的 test seams / fakes;不得在 03 把 fake 写成 external integration。

## 4. 当前文档问题诊断

| historical 02 范围 | 问题 | 本轮调整 |
|---|---|---|
| 重新解释项目定位、背景、架构位置、技术选型和备选方案 | 重复正式 00 / 01,概要主线不聚焦可实现结构 | 只在 §1~3 简短承接,主体集中 §4~12 |
| persona / capability / execution binding 五部分 | 基于已废弃 owner,遗漏 inbound、outbound、trace、mirror | 从 7 BC 重新映射,Step 4 前不冻结代码主体 |
| 完整函数调用链、上线 / 回滚 / 指标 | 分别越入 03、05~07 | 从本轮范围排除 |
| 以所有 sibling 合同已可用为前提 | 伪闭口 | exact seam 进入 Step 13 pending,结构只做 blocked-aware |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 概要目标 | 再次解释 member 是什么 | 把已收稳边界转译为可实现结构骨架 |
| 第一层结构 | 历史 persona / endpoint / capability / binding / summary | 从正式 7 BC 推导,Step 5 冻结主要组成部分 |
| 设计深度 | 架构重复与实现调用链混杂 | 对象 / 接口 / flow / state 足够下交 03,不写实现 |
| open seam | 隐含当作可用 | typed slot + pending / blocked / fail-closed |
| 下游关系 | 上线、测试、指标提前进入 | 只输出详细设计承接清单 |

## 6. 设计取舍

| 取舍 | 采用理由 | 代价 |
|---|---|---|
| 7 BC 作为 Step 4 映射起点,不是预先确定代码目录 | 保持架构主语稳定又不混同实现组织 | Step 4 / 5 需要双轴判断 |
| core C1~C4 全覆盖,summary 必需,outlet 可裁剪 | 与正式需求和架构一致 | outlet 需显式 not_available / stale / gap |
| local / negative / blocked-aware 设计可以完成 | 不让 exact external contract 阻断本地语义 | 03 正向 adapter / integration 仍受 blocker |
| 正式 02 只保留收口摘要,详细卡片留 calibration | 控制正式文档可读性并保留可追溯推导 | calibration 文件数量与审计成本增加 |

## 7. 结构化中间产物

### 7.1 设计目标表

| ID | 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|---|
| `HLD-G-L2M-001` | 代码主体框架可落码 | 建立业务组成部分与实现分层双轴,防止架构上下文直接退化成目录 | 稳定 code subject / layer inventory 与依赖方向 |
| `HLD-G-L2M-002` | 七组成部分 capability 闭环 | 每个部分说明做什么、不做什么、输入输出、状态副作用和接缝 | capability-to-object / interface / flow / state mapping |
| `HLD-G-L2M-003` | member local truth 主语稳定 | 正式化 presence、screening、mediation、outbound、trace、mirror、view 所需关键对象 | 对象名、类型、字段 / 函数骨架和 invariant |
| `HLD-G-L2M-004` | 交互骨架可实现且不越权 | 收稳五类 API / Event / Job 与 ports,区分同步、异步和后台路径 | protocol-neutral interface / port contracts |
| `HLD-G-L2M-005` | 流程与状态分层可验证 | 关键流回指接口 / 对象,状态归属与 external truth 分层明确 | flow / state / propagation skeleton 和禁止迁移 |
| `HLD-G-L2M-006` | 开放接缝不伪闭口 | `L2M-UP-001~008` 进入明确 slot / blocker,正向能力 fail closed | blocked boundary handoff 与受控回开条件 |
| `HLD-G-L2M-007` | 03 承接完整 | 明确对象、接口、流程、状态、异常和配置 contract 的下沉边界 | 详细设计清单及主语变更回退规则 |

### 7.2 非范围表

| ID | 非范围 | 留给哪一层 |
|---|---|---|
| `HLD-NG-L2M-001` | 重定义需求、架构、owner、BC、ADR | 正式 00 / 01 的受控回开 |
| `HLD-NG-L2M-002` | Runtime / Tools / host / Bus / Governance / Conversation 等外部 truth | 对应 owner 正式链 |
| `HLD-NG-L2M-003` | 完整 schema、函数、DDL、transaction、adapter 实现 | 03 |
| `HLD-NG-L2M-004` | 配置项、默认值、secret、环境变量和加载实现 | 04,实现注入合同先由 03 承接 |
| `HLD-NG-L2M-005` | 测试用例 / 结果、验收 verdict、implementation / commit | 05~07 与真实执行流程 |
| `HLD-NG-L2M-006` | 产品 / transport / process / deployment 与无来源数字指标 | 后续按 authority / evidence 决定 |

### 7.3 当前阶段设计深度口径

```text
本轮 02 收敛到 language-neutral、transport-neutral 的可实现结构骨架:
组成部分与 capability 已冻结;
关键对象有字段类型与函数参数类型;
接口有分类、输入输出和状态边界;
关键流程有对象 / port / commit / handoff 轮廓;
状态有 owner、迁移和传播关系;
exact schema、实现和物理承载仍交给 03 / 04。
```

## 8. 回填草稿

正式 §2 将摘录 §7.1 设计目标、§7.2 非范围和 §7.3 深度口径。正式正文不复制 SOP 问答、旧文档诊断或方案比较。

## 9. 待确认事项

本 Step 不新增阻塞 Step 3 的事项。能力出口是否首批激活仍是裁剪问题,但其结构和 `not_available / stale / gap` 语义必须在 02 定义;它不影响 C1~C4 与 Member Summary 的概要闭环。

## 10. 进入下一步条件与停审

| 门禁 | 结果 |
|---|---|
| 设计目标与正式 00 / 01 一致 | pass |
| 当前范围覆盖代码主体、组成部分、对象、接口、流、状态、异常、配置影响和 03 承接 | pass |
| 非范围明确归属到上游 owner 或 03~07 | pass |
| 深度停在概要骨架,未提前正式化对象 / API / schema | pass |
| open seam 不阻塞本地概要,也未被写成 closed | pass |

Step 2 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / 项目台账至 Step 3,然后创建 `02_hld_step_03_constraints.md`。
