# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 回填章节: `03-详细设计.md` §5 模块实现契约中的 Trait / Port / Adapter 契约,以及 §6 全局 Trait / Port 索引
> 生成日期: 2026-06-12
> 状态: 7.10 cross-module seam audit and Step 8 entry conditions 已完成,等待审核后进入 Step 8 protocol contracts

---

## 1. Step 状态 + Step 内计划

本 Step 重新开始。上一版 7.0 的问题是粒度仍偏“计划总表”,没有充分吸收 `L1-governance` Step 7 的展开方式:shared helper 先行、基础 port 先行、subject mapper / cursor / version / UoW / fake parity 显式闭合、repository 按 truth family 展开、append-only / projection / reference / outbox / result 分组闭口、external seam 和 entry restriction 单独审计。

本轮 Step 7 采用 governance 粒度,但保留 identity 当前标准流的停审节奏:先写 7.0 重新规划框架,审核后逐批写 7.1~7.10。每个批次必须包含 capability / 接缝清单、trait / helper 契约片段、调用方 / 实现方、读取面 / 保存面、version / cursor / UnitOfWork 口径、fake/durable 等价语义、停审记录和正反例。当前已完成 7.10 cross-module seam audit and Step 8 entry conditions,等待审核后进入 Step 8 protocol contracts。

本 Step 不写 Step 8 的 DTO / event / job schema,不写 Step 9 的函数级 flow,不写 Step 10 的完整状态矩阵,不写 Step 11 的 DDL / transaction order,不修改正式 `03-详细设计.md`。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 7 SOP | 已完成 | §2 |
| 阅读 `L1-governance` Step 7 作为粒度参考 | 已完成 | §2 / §4 |
| 读取 identity Step 5 模块归属和 Step 6.10 启动红线 | 已完成 | §2 |
| 回答 Step 7 全局 SOP 问题 | 已完成 | §3 |
| 诊断上一版 7.0 与 governance 粒度差距 | 已完成 | §4 |
| 明确 Step 7 重新分批取舍 | 已完成 | §5 / §6 |
| 写入 Step 7 重新规划批次状态表 | 已完成 | §7.1 |
| 写入 governance 粒度对齐表 | 已完成 | §7.2 |
| 写入 port 定义 / 实现 / 调用模块归属表 | 已完成 | §7.3 |
| 写入 Step 7 写入红线和停审记录 | 已完成 | §7.4 / §7.5 |
| 写入 7.0 正反例 | 已完成 | §7.6 |
| 写入 7.1 shared application port helpers | 已完成 | §7.7 |
| 写入 7.2 application 基础 ports | 已完成 | §7.8 |
| 写入 7.3 core truth repository ports | 已完成 | §7.9 |
| 写入 7.4 append-only / audit / history / trace repositories | 已完成 | §7.10 |
| 写入 7.5 projection / read / reference / report repositories | 已完成 | §7.11 |
| 写入 7.6 outbox / result / idempotency repositories | 已完成 | §7.12 |
| 写入 7.7 external resolver / publisher / handoff / adapter ports | 已完成 | §7.13 |
| 写入 7.8 API / worker / jobs entry restrictions and application facade access | 已完成 | §7.14 |
| 写入 7.9 infra adapter implementation contract and fake equivalence | 已完成 | §7.15 |
| 写入 7.10 cross-module seam audit and Step 8 entry conditions | 已完成 | §7.16 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 已阅读 | 确认 Step 7 必答问题、输出形态、按模块 / port 小循环停审要求 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已检索关键条目 | 前置 cursor、subject mapper、projection lookup、visibility resolution、typed snapshot read、stored receipt、idempotency reserve、fake parity 等经验 |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已阅读作为参考 | 参考 governance 的粒度、helper 先行、port family 分组、open item closure 和跨模块审计方式 |
| `03_ddd_step_05_module_contracts.md` | Step 5 已审核通过 | 提供 7 个 workspace crate、依赖方向、port 定义 / 实现 / 调用归属规则 |
| `03_ddd_step_06_object_contracts.md` §7.18 / §7.19 / §7.20 | Step 6.10 已审核通过 | 提供字段闭环、状态闭环、Step 7 承接清单和启动红线 |
| `02_hld_step_07_api_interface_skeleton.md` | 概要接口骨架 | 后续检查 port 是否支撑 command / query / consumer / outbound / job 协议 |
| `02_hld_step_08_processing_flows.md` | 概要处理流 | 后续检查 repository / resolver / outbox / projection / job 接缝是否支撑处理流 |
| `02_hld_step_09_state_machine.md` | 概要状态轮廓 | 后续检查读取面 / 保存面是否支撑状态矩阵 |
| `01-架构设计.md` §8 / §9 | 已收稳 | 提供依赖方向、数据所有权、通信方式和跨仓依赖裁剪 |

---

## 3. SOP 问题回答

### 3.1 哪些模块需要定义 trait / port?

`identity-application` 是唯一正式定义 repository、resolver、publisher、handoff、UnitOfWork、Clock、IdGenerator、idempotency、stored result、projection、reference、report writer 和 adapter boundary trait 的模块。

`identity-contracts` 只定义 public DTO、typed ref、marker、view、event、job、receipt 和 public error。`identity-domain` 只定义 object、state、policy、guard 和 domain error。`identity-infra` 只实现 application port。`identity-api`、`identity-worker`、`identity-jobs` 只做 entry mapping 和 application service dispatch,不得直接定义或调用 repository / publisher / handoff / projection port。

### 3.2 哪些模块负责实现这些 trait / port?

`identity-infra` 负责实现所有 application port,包括 durable adapter、in-memory fake、controlled adapter、resolver adapter、publisher adapter、handoff adapter、projection store、reference store、result store、clock/id generator 和 runtime wiring。

`identity-api`、`identity-worker`、`identity-jobs` 不实现业务 port;它们只能通过 application service / facade 进入用例边界。

### 3.3 当前模块的哪些 capability、对象能力、处理流或状态转换需要接缝?

以下能力必须有正式 port / adapter:

- command truth mutation: member、lifecycle、role/capability、career、memory。
- accepted side effect: trace、audit、outbox、projection stale、stored result。
- query read surface: summary view、trace/audit view、visibility decision、projection-backed view、report。
- consumer / callback: source summary、reference state、typed sidecar、handoff receipt、stored receipt。
- operations job: projection rebuild、reference refresh、reconciliation report、outbox publish、handoff retry、job report。
- duplicate replay: idempotency reserve、stored command/rejection/receipt/report。
- external seam: governance basis、role/capability source、work source、memory/archive source、publisher、handoff target、adapter availability。

### 3.4 每个 trait / port 如何证明承接 Step 6?

每个 trait / port 必须回指以下至少一类 Step 6 输入:

- Step 6 object / state / policy 的读取或保存需求。
- 6.8 字段闭环表中的正式字段来源。
- 6.9 状态闭环表中的状态 owner、终态、禁止混用或暂停条件。
- 6.10 Step 7 启动清单中的 port family 能力。

无法回指 Step 6 的 port 不得写入。若后续 Step 8~13 发现需要新增读取面或保存面,必须回 Step 7 补充,并检查是否也需要回 Step 6 闭口对象 / 字段 / 状态来源。

### 3.5 repository、outbox、projection、external client 的函数签名应达到什么粒度?

从 7.1 起,每个 trait 函数必须写出:

- 参数类型。
- 返回类型。
- 错误类型。
- 调用方和实现方。
- version / cursor / UnitOfWork / append-only / idempotency 语义。
- fake/durable 等价语义。
- 后续 Step 8 / 9 / 10 / 11 / 13 承接位置。

只写“调用数据库”“调用外部系统”“保存对象”“查询对象”不算闭合。

### 3.6 Step 7 是否可以决定 public DTO、flow、state matrix 或 DDL?

不可以。Step 7 只定义实现接缝。DTO schema 留 Step 8,函数级 flow 留 Step 9,状态矩阵留 Step 10,DDL / transaction order / persistence unique constraint 留 Step 11,错误恢复留 Step 12,幂等矩阵留 Step 13,config binding 留 Step 14。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 上一版 7.0 只按 broad port family 列计划 | 粒度仍不够接近 governance,后续容易在 7.1 后一次性膨胀 | 重新拆成 shared helper、基础 port、truth repo、append-only/projection/reference/outbox/result、external seam、infra/fake、cross audit |
| governance Step 7 已完整落 helper 和 trait 片段 | 可以作为粒度参考,但不能直接照抄对象和命名 | 采用其结构经验,内容仍从 identity Step 6 推导 |
| 只写 save / append,不写读取面 | Step 9 flow、Step 10 state matrix、Step 11 expected_version 会缺正式来源 | 每个 repository 批次必须写 versioned read / lookup / list / save 配对 |
| query / projection 容易临时拼 view ref | 违反 Step 6.8 view lookup 红线 | Step 7 必须定义 stable projection lookup 或明确缺口 |
| trace/audit/outbox subject 容易直接拼字符串 | 违反 Step 6.8 subject mapper 红线 | Step 7 必须定义 canonical subject mapper 和 key table |
| external reference / business source 容易混用 | typed sidecar save 的 expected_version 来源会不明 | Step 7 必须区分 business source resolver、reference bundle key、typed sidecar versioned save |
| fake runtime 容易用私有 map 补正式 port 缺口 | durable/fake 语义不等价,实现阶段会反复 blocker | 每个 port family 必须写 fake equivalence 要求 |
| entry 模块容易绕过 application | 会破坏 transaction、idempotency、trace/outbox 顺序 | Step 7 后段必须单独写 infra/API/worker/jobs implementation restriction |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 7 重启方式 | 沿用上一版 7.0 框架 | 整体替换为 governance 粒度参考后的 7.0 |
| 批次粒度 | 8 个 broad family | 11 个更细批次,shared helper 和基础 port 拆开 |
| helper surface | 只作为 support ports 一部分 | 独立 7.1,先闭 version/page/UoW/cursor/subject helper |
| subject mapper | 后置到 resolver family | 作为 shared helper / mapper completeness 的重点红线 |
| append-only / projection / reference / outbox / result | 分散在多个 broad family | 按 governance 的重接缝单独成批 |
| external seam | 与 mapper/resolver 混合 | 独立 external seam,覆盖 basis/source/publisher/handoff/adapter availability |
| fake equivalence | 汇总在后段 | 每批必须最小写入,7.9 总审计 |
| 停审 | 7.0 后进入 support ports | 7.0 后进入 shared application port helpers,再进入基础 ports |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 保留上一版 7.0,从 7.1 继续 | 不采用 | 用户明确要求重新开始;上一版粒度不足以对齐 governance |
| 完全照抄 governance Step 7 结构和内容 | 不采用 | governance 对象族不同;identity 必须从自身 Step 6 推导 |
| 使用 governance 的章节粒度,替换为 identity port family | 采用 | 既能获得成熟粒度,又不引入非 identity 对象 |
| shared helper 单独成批 | 采用 | version/page/UoW/cursor/subject helper 是后续 port 的共同前提 |
| application basic port 单独成批 | 采用 | Clock、IdGenerator、UoW manager、cursor assigner 是所有 save/append 的基础 |
| truth repository 和 append-only/projection/reference/outbox/result 分开 | 采用 | 避免把 mutable truth、append-only record、derived state、reference sidecar 和 result replay 混成一个 repository 总表 |
| external seam 与 mapper/resolver 混写 | 不采用 | 外部 source resolver、publisher、handoff、adapter availability 需要独立 fake/durable 等价语义 |
| Step 7 新增 Step 6 未定义状态或字段 | 不采用 | 违反 Step 6.10 红线 |

---

## 7. 结构化中间产物

### 7.1 Step 7 重新规划批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `7.0` | Step 7 重新规划框架、governance 粒度对齐、批次表、红线、停审记录 | 已写入 | 是;只做框架和计划,不写 trait 签名 | 已确认 | `7.1` |
| `7.1` | shared application port helpers | 已写入 | 是;覆盖 transaction/version/page/cursor/helper/ref-set/subject mapper helper、canonical key table 和 fake/durable parity | 已确认 | `7.2` |
| `7.2` | application 基础 ports | 已写入 | 是;覆盖 Clock、IdGenerator、UnitOfWork manager、cursor assigner、operation context factory、dispatch target catalog | 已确认 | `7.3` |
| `7.3` | core truth repository ports | 已写入 | 是;覆盖 member/lifecycle/role/career/memory repository capability、trait、versioned read/save/list、duplicate/source/callback lookup | 已确认 | `7.4` |
| `7.4` | append-only / audit / history / trace repositories | 已写入 | 是;覆盖 trace append/read、audit trail lookup/append、trace correction、handoff intent history read/write 和 fake/durable parity | 已确认 | `7.5` |
| `7.5` | projection / read / reference / report repositories | 已写入 | 是;覆盖 summary view lookup、projection state、read visibility、reference state/typed sidecar、maintenance expansion、reconciliation report | 已确认 | `7.6` |
| `7.6` | outbox / result / idempotency repositories | 已写入 | 是;覆盖 outbox record/state、idempotency reserve/complete、stored result save/load、command effect summary、job report replay | 已确认 | `7.7` |
| `7.7` | external resolver / publisher / handoff / adapter ports | 已写入 | 是;覆盖 governance basis、role/capability source、work source、memory/archive、external reference、topic/publisher、handoff、adapter availability | 已确认 | `7.8` |
| `7.8` | API / worker / jobs entry restrictions and application facade access | 已写入 | 是;覆盖 entry 不直连 port、context factory、dispatch boundary、ack/retry/dead-letter/job runner 限制 | 已确认 | `7.9` |
| `7.9` | infra adapter implementation contract and fake equivalence | 已写入 | 是;覆盖 durable/fake/controlled/disabled adapter parity, fake 不私有补口审计、runtime wiring 和 adapter error safe issue mapping | 已确认 | `7.10` |
| `7.10` | 跨模块接缝审计、Step 6 open item closure、回填草稿和进入 Step 8 条件 | 已写入 | 是;完成 Step 6.10 启动清单、Step 6.8/6.9 暂停条件、S7 open item 和进入 Step 8 条件审计 | 待审 | Step 8 |

### 7.2 governance Step 7 粒度对齐表

| governance Step 7 粒度 | identity 对应批次 | identity 处理口径 |
|---|---|---|
| Shared application port helper | `7.1` | 先定义 application-local helper、Versioned/Page、cursor、subject refs helper,不进入 public DTO |
| Application 基础 port | `7.2` | Clock、IdGenerator、UoW manager、truth/reference cursor assigner、operation context |
| Truth repository port capability 清单 | `7.3` | member/lifecycle/role/career/memory 按 truth family 展开 |
| Trace / audit / history repositories | `7.4` | accepted trace、audit trail、career/memory append-only、handoff marker history |
| Projection repository / read visibility / report | `7.5` | summary view lookup、projection state、read visibility resolution、reconciliation report |
| Reference snapshot repository | `7.5` | reference state、typed sidecar、source version、bundle key、expected_version 共版本规则 |
| Outbox repository and payload snapshot lookup | `7.6` | outbox record、payload marker/snapshot、pending list、state update |
| Idempotency and stored result repository | `7.6` | reserve(context)、stored accepted/rejected/receipt/job report save/get |
| External resolver / publisher / handoff / adapter availability | `7.7` | basis/source/work/memory/archive resolver、publisher、handoff、adapter availability |
| Infra / API / Worker / Jobs implementation contract | `7.8` / `7.9` | entry restriction 和 adapter fake/durable parity 分开写 |
| Step 6 open item closure / cross audit | `7.10` | 逐项闭合 DDD-S6-OPEN 与 DDD-S7-OPEN |

### 7.3 port 定义 / 实现 / 调用模块归属表

| 模块 | 是否定义 port | 是否实现 port | 是否可直接调用 port | 允许行为 | 禁止行为 |
|---|---|---|---|---|---|
| `identity-contracts` | 否 | 否 | 否 | 定义 DTO/ref/marker/view/event/job/receipt/error | 定义 repository trait、adapter trait、UoW、clock |
| `identity-domain` | 否 | 否 | 否 | 定义 object/state/policy/guard/domain error | 读取 repository、调用 resolver/publisher/handoff |
| `identity-application` | 是 | 否 | 是 | 定义并调用 port,编排 transaction/idempotency/result | 依赖 infra implementation、SQLx、Axum、bus |
| `identity-infra` | 否 | 是 | 仅实现,不作为业务调用方 | durable/fake/controlled adapter implementation and wiring | 新增业务 invariant、绕过 application flow |
| `identity-api` | 否 | 否 | 否 | route/request context mapping,调用 application service | 直连 repository、publisher、projection store |
| `identity-worker` | 否 | 否 | 否 | event/callback mapping,调用 application service | 直连 store、私自 ack accepted truth |
| `identity-jobs` | 否 | 否 | 否 | job metadata/scope/cursor mapping,调用 application job service | 直接 repair truth、全表扫描绕过 port |

### 7.4 Step 7 写入红线表

| 红线 | Step 7 禁止行为 | 正确处理 |
|---|---|---|
| 不补对象 | 为 trait 新增 Step 6 未定义 truth/helper object | 回 Step 6 修对象契约或记录待确认 |
| 不补状态 | 为 adapter error 新增 domain state variant | 回 Step 6.9 / Step 10 |
| 不补字段来源 | trait 参数需要字段但 Step 6.8 无正式来源 | 回 Step 6.8 或后续 Step 8/9 明确来源 |
| 不拼 ref/subject/view | 从字符串、timestamp、idempotency key、source ref 拼 ref | 定义 formal mapper / lookup / id source |
| 不混 cursor/version/key | expected_version、truth cursor、projection cursor、job cursor、idempotency key 互换 | 分别定义正式 port 和来源 |
| 不让 fake 私有补口 | fake 用额外 map 支撑正式 port 没有的读取面 | 先补正式 port,再实现 fake |
| 不绕过 application | entry / infra 直连 repository、publisher、handoff | entry 只 dispatch application service |
| 不把 adapter success 当业务状态 | endpoint 2xx / publish ok / deliver call ok 推进 truth/delivered | 必须通过 formal receipt/result marker |
| 不让 query 写状态 | query miss/stale 时 rebuild/mark fresh/write trace | rebuild / refresh 走 job/command |
| 不修改正式 `03` | Step 7 中直接写正式文档 | 等 Step 19 装配 |

### 7.5 7.0 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否重新开始 Step 7 | 通过 | 已整体替换上一版 7.0 |
| 是否阅读 governance Step 7 | 通过 | §2 / §7.2 已显式纳入参考 |
| 是否创建未来 Step 文件 | 未创建 | 只保留当前 Step 7 文件 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 是否定义 port trait 签名 | 未定义 | 7.0 只写重新规划框架 |
| 是否达到 governance 粒度 | 初步通过 | 已拆为 shared helper、基础 port、truth repo、append-only/projection/reference/outbox/result、external seam、infra/fake 和 cross audit |
| 是否保留逐批停审 | 通过 | 7.1~7.10 每批停审 |
| 是否列出禁止事项 | 通过 | §7.4 固定 Step 7 不得反向发明 |
| 下一批 | `7.1` | 7.0 已审核通过;7.1 已写入并停审 |

### 7.6 7.0 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| Step 7 重启 | 重新替换 7.0,按 governance 粒度重新分批 | 在旧 7.0 后面继续追加 |
| 粒度参考 | 学 governance 的 helper / repository / reference / result 分组 | 复制 governance 对象名 |
| helper 先行 | 7.1 先闭 Versioned/Page/UoW/cursor/subject helper | 直接在 repository trait 中临时定义 helper |
| subject mapper | 先定义 canonical mapper 和 key table | service 拼 `member:<id>` |
| cursor 来源 | UoW / store cursor source 有正式 helper | 用 timestamp/version/idempotency key |
| repository | read/save/list/version 成对 | 只写 save |
| projection lookup | stable lookup port | query 拼 view ref |
| stored result | typed save/get 对称 | duplicate 重跑 mutation |
| fake | fake 实现同一 port surface | fake 私有 map 补正式缺口 |
| entry | entry 只 dispatch application service | handler / worker / job 直连 store |

### 7.7 7.1 shared application port helpers

本批定义 application-local helper surface,为后续 7.2~7.10 的 port trait 提供统一参数、返回值和禁止混用规则。本批只定义 helper 类型、UoW cursor helper、subject mapper helper、query material degradation mapper、canonical key table 和 fake/durable parity;不定义 Clock、IdGenerator、repository、resolver、publisher、handoff、DTO、flow、state matrix 或 DDL。

#### 7.7.1 7.1 capability / 接缝清单

| capability | 需要的 helper | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| repository optimistic write | `IdentityVersion`, `Versioned<T>` | application services / repositories | infra repository adapters | 7.3~7.6, Step 11 |
| repository pagination | `IdentityRepositoryCursor`, `IdentityRepositoryPage`, `Page<T>` | application query/job services | infra repository adapters | Step 8 page DTO, Step 9 query/job |
| transaction identity | `IdentityTransactionRef` | application services, fake assertions, observability | UoW implementation | 7.2, Step 11, Step 15 |
| accepted truth cursor | `IdentityUnitOfWork.assign_truth_change_cursor()` | accepted command services | durable/fake UoW | Step 9 accepted flow, Step 11 transaction, Step 13 replay |
| reference marker cursor | `IdentityUnitOfWork.assign_reference_marker_cursor()` | consumer/reference refresh/job marker flows | durable/fake UoW | Step 9 consumer/job, Step 11, Step 13 |
| accepted subject identity | `IdentityAcceptedSubjectRefs`, `IdentityTruthChangeSubjectMapper` | accepted command services | mapper implementation in application/infra wiring | 7.4/7.6, Step 9, Step 15 |
| accepted audit material markers | `IdentityAcceptedAuditTrailMarkers`, `IdentityAcceptedAuditTrailMarkerMapper` | accepted command / handoff prepare services | mapper implementation in application/infra wiring | 7.4, Step 9, Step 11 |
| query material degraded markers | `IdentityQueryMaterialDegradationSummary`, `IdentityQueryMaterialDegradationMapper` | query services / page assemblers | mapper implementation in application/infra wiring | Step 8 query surface, Step 9 query branches, Step 12 recovery |
| marker trace subject | `IdentityMarkerSubjectMapper` | consumer/job/reference marker services | mapper implementation in application/infra wiring | 7.4, Step 9, Step 15 |
| common ref set / versioned ref | typed ref set helpers and `VersionedRef<TRef>` | query/job/rebuild/report services | application local helper | 7.5/7.6, Step 8/9 |

#### 7.7.2 application-local helper 契约片段

以下 helper 属于 `identity-application` 的 local surface,建议落在 `crates/application/src/ports.rs` 或 `crates/application/src/unit_of_work.rs`。它们不进入 public protocol DTO;若 Step 8 需要公开 page / cursor / result marker,必须在 `identity-contracts` 中另行定义 public schema 和映射规则。

```rust
/// Stable application-local reference for a write transaction.
pub struct IdentityTransactionRef(pub String);

/// Optimistic version attached to a persisted identity object or sidecar marker.
pub struct IdentityVersion(pub u64);

/// Cursor used only by application repository pagination.
pub struct IdentityRepositoryCursor(pub String);

/// Page request used by application repositories.
pub struct IdentityRepositoryPage {
    /// Opaque cursor from a previous repository page.
    pub cursor: Option<IdentityRepositoryCursor>,
    /// Maximum number of items requested by the caller.
    pub limit: u32,
}

/// A persisted object with its optimistic version.
pub struct Versioned<T> {
    /// Persisted object value.
    pub value: T,
    /// Version to pass into the next optimistic write.
    pub version: IdentityVersion,
}

/// A repository page with opaque pagination cursor.
pub struct Page<T> {
    /// Items returned by the repository.
    pub items: Vec<T>,
    /// Cursor for the next page.
    pub next_cursor: Option<IdentityRepositoryCursor>,
}

/// A typed ref paired with the optimistic version of its persisted object.
pub struct VersionedRef<TRef> {
    /// Persisted object ref.
    pub value_ref: TRef,
    /// Optimistic version for the object identified by value_ref.
    pub version: IdentityVersion,
}
```

| helper | 作用 | 闭环口径 | 禁止事项 |
|---|---|---|---|
| `IdentityTransactionRef` | UoW 事务引用 | application-local opaque ref;用于日志、fake adapter 断言和 error context | 不进入 public DTO;不当 truth cursor |
| `IdentityVersion` | optimistic update token | 只能来自 `get_*_with_version`, `list_*_with_version`, create result 或正式 request version | 不得用 truth cursor、source version、timestamp、digest、idempotency key 代替 |
| `IdentityRepositoryCursor` | repository page cursor | 只表达列表位置 | 不得当 version、truth cursor、projection cursor、job cursor |
| `IdentityRepositoryPage` | application repository page request | application-local list 参数 | Step 8 public page request 需另定义 DTO |
| `Versioned<T>` | object + version 配对读取面 | mutation 前置读取必须使用;save expected_version 从这里来 | save 方法内部 hidden read version |
| `Page<T>` | repository page result | 用于 application list/query/job scan | 不直接暴露为 public DTO |
| `VersionedRef<TRef>` | ref + version 的轻量列表项 | 用于 list 后按 ref 分支读取或批量更新 | 不把 ref 本身当 version |

#### 7.7.3 UnitOfWork helper 契约片段

```rust
/// Transaction handle passed to identity repository writes.
pub trait IdentityUnitOfWork {
    /// Returns a stable transaction reference for logging and fake adapter assertions.
    fn transaction_ref(&self) -> IdentityTransactionRef;

    /// Assigns the accepted truth boundary cursor after truth writes are staged in this UoW.
    fn assign_truth_change_cursor(&self) -> Result<IdentityTruthCursor, ApplicationError>;

    /// Assigns a committed reference marker cursor after reference/snapshot writes are staged in this UoW.
    fn assign_reference_marker_cursor(&self) -> Result<IdentityTruthCursor, ApplicationError>;
}

/// Creates and commits identity write transactions.
pub trait IdentityUnitOfWorkManager {
    /// Begins a new identity write transaction.
    async fn begin(&self) -> Result<Box<dyn IdentityUnitOfWork>, ApplicationError>;

    /// Commits a previously opened transaction.
    async fn commit(&self, uow: Box<dyn IdentityUnitOfWork>) -> Result<(), ApplicationError>;

    /// Rolls a transaction back after a failed application flow.
    async fn rollback(&self, uow: Box<dyn IdentityUnitOfWork>) -> Result<(), ApplicationError>;
}
```

| UoW rule | accepted truth cursor | reference marker cursor |
|---|---|---|
| call timing | accepted command 必须先把 changed truth save/stage 到同一 UoW,再调用 `assign_truth_change_cursor()` | consumer/reference refresh/job marker 必须先把 reference state / typed sidecar / marker save/stage 到同一 UoW,再调用 `assign_reference_marker_cursor()` |
| visibility | cursor 只在 UoW commit 后成为 committed truth cursor;rollback 不得泄露 | cursor 只在 UoW commit 后成为 committed reference marker cursor;rollback 不得泄露 |
| multiplicity | 每个 accepted command transaction 调用一次并复用返回值;同一 command 多个 accepted side effect 使用同一 boundary cursor | 每个 reference-only transaction 调用一次并复用返回值;projection stale 和 optional marker trace 使用同一 cursor |
| side effect relation | trace、audit、outbox、projection stale、stored result / effect summary 从同一 accepted cursor 复制 | projection stale、marker trace、receipt/report 对齐从同一 marker cursor 复制 |
| not allowed | page cursor、optimistic version、timestamp、id generator、trace id、outbox id、idempotency digest、hard-coded string | source version、snapshot version、event dedupe key、idempotency digest、page cursor、timestamp、trace id、id generator、hard-coded string |
| fake / durable parity | in-memory fake 必须提供单调、稳定、可断言的等价 cursor | in-memory fake 必须提供单调、稳定、可断言的等价 cursor |

#### 7.7.4 Accepted truth subject helper

`IdentityTraceRecord.subject_ref`、`AuditTrail.subject_ref` 和 `IdentityOutboxRecord.subject_ref` 必须由 formal mapper 从 typed truth ref 映射。Mapper 为每个 truth ref 生成一个 canonical subject key,并把同一个 key 分别包装成 trace、audit 和 outbox subject ref。Application service、repository adapter、entry module 和 fake runtime 不得自行拼接 `IdentitySourceRef`、route path、topic key 或 raw member id 字符串。

```rust
/// Accepted subject refs that share one canonical identity subject key.
pub struct IdentityAcceptedSubjectRefs {
    /// Subject used by identity trace records.
    pub trace_subject_ref: IdentityTraceSubjectRef,
    /// Subject used by identity audit trails.
    pub audit_subject_ref: IdentityAuditSubjectRef,
    /// Subject used by identity outbox records.
    pub outbox_subject_ref: IdentityOutboxSubjectRef,
}

/// Maps typed identity truth refs to body-free trace/audit/outbox subjects.
pub trait IdentityTruthChangeSubjectMapper {
    fn member_subjects(&self, member_ref: GlobalMemberRef) -> IdentityAcceptedSubjectRefs;
    fn role_capability_subjects(
        &self,
        summary_ref: RoleCapabilitySummaryRef,
    ) -> IdentityAcceptedSubjectRefs;
    fn role_capability_source_snapshot_subjects(
        &self,
        snapshot_ref: RoleCapabilitySourceSnapshotRef,
    ) -> IdentityAcceptedSubjectRefs;
    fn career_record_subjects(&self, record_ref: CareerRecordRef) -> IdentityAcceptedSubjectRefs;
    fn memory_reference_subjects(
        &self,
        reference_ref: MemoryReferenceRef,
    ) -> IdentityAcceptedSubjectRefs;
    fn outbox_record_subjects(&self, outbox_ref: IdentityOutboxRecordRef) -> IdentityAcceptedSubjectRefs;
    fn handoff_intent_subjects(&self, intent_ref: TraceHandoffIntentRef) -> IdentityAcceptedSubjectRefs;
}
```

| helper rule | 正式口径 |
|---|---|
| input source | 只能接收 typed truth `to_ref()` 结果或 loaded relation ref |
| canonical key | helper 内部使用 `identity:<truth-kind>:<id>` 形成 canonical key;`<id>` 是 typed ref 内部 id newtype 的完整 opaque value,即使包含分隔符也作为剩余整体处理,业务逻辑不得解析 |
| output | 返回 `IdentityAcceptedSubjectRefs`;三个 subject ref 必须包装同一个 canonical key |
| trace/outbox/audit relation | accepted flow 使用 `refs.trace_subject_ref` append trace,使用 `refs.audit_subject_ref` get-or-create audit trail,使用 `refs.outbox_subject_ref` create outbox record |
| fake / durable parity | fake runtime 和 durable adapter 必须按同一 canonical key table 生成 subject refs,测试可直接断言具体 key |
| forbidden | 不得在 service / adapter 中解析 ref 字符串、拼接 route path、使用 title/source body、event topic、trace id、cursor 或 timestamp 代替 subject |

##### Accepted audit trail marker helper

Accepted command / handoff prepare 写路径在 missing audit trail 时由 service 显式创建 `AuditTrail`,repository 不得隐式创建。由于 `AuditTrail::from_accepted_write(...)` 和 `AuditTrailEntry` 都需要 `AuditScopeRef` / `VisibilityResultRef`,这些字段必须来自正式 mapper,不能由 service 使用默认值、query metadata、read visibility resolver、operation name 字符串或 audit subject 字符串拼接。

```rust
/// Body-free markers required to materialize accepted write audit material.
pub struct IdentityAcceptedAuditTrailMarkers {
    pub audit_scope_ref: AuditScopeRef,
    pub trail_visibility_result_ref: VisibilityResultRef,
    pub entry_visibility_result_ref: VisibilityResultRef,
    pub read_surface_kind: IdentityReadSurfaceKind,
}

/// Maps accepted write context into body-free audit scope and visibility markers.
pub trait IdentityAcceptedAuditTrailMarkerMapper {
    fn accepted_command_audit_markers(
        &self,
        context: &IdentityOperationContext,
        subjects: &IdentityAcceptedSubjectRefs,
        change_kind_ref: &IdentityChangeKindRef,
        source_cursor_ref: &IdentityTruthCursor,
    ) -> IdentityAcceptedAuditTrailMarkers;
}
```

| helper rule | 正式口径 |
|---|---|
| 使用场景 | accepted command、accepted handoff prepare 或后续 Step 9 明确的 accepted write path 创建 / 追加 audit material |
| 输入来源 | `IdentityOperationContext`、`IdentityAcceptedSubjectRefs`、accepted change kind、同一 UoW 分配的 accepted truth cursor |
| `audit_scope_ref` | mapper 生成 accepted-write subject scope,语义是“该 audit subject 的 accepted body-free audit material”;不是 query scope、visibility scope 或 request filter |
| `trail_visibility_result_ref` | mapper 生成 trail materialized marker,只证明 accepted transaction 产生了 body-free audit material;不代表 public read authorization |
| `entry_visibility_result_ref` | mapper 生成 entry materialized marker,与本次 accepted cursor / change kind 对齐;query read 时可被 `VisibilityPolicy::for_audit(...)` 重新裁剪为 public view |
| `read_surface_kind` | accepted write 创建 trail 时固定为 `IdentityReadSurfaceKind::Found`;query surface 后续可返回 Empty/NotVisible/Degraded 等读取结果 |
| fake / durable parity | fake runtime 和 durable adapter 必须使用同一 canonical marker table;测试不得用私有 map 或默认 visible marker |
| forbidden | 不得使用默认 scope、常量 visible、query metadata、read visibility resolver、route、operation name 字符串、audit subject 字符串切割、trace id、timestamp、idempotency key 或 hard-coded marker 替代 |

| typed truth ref | canonical subject key |
|---|---|
| `GlobalMemberRef { member_id }` | `identity:member:<member_id>` |
| `RoleCapabilitySummaryRef { summary_id }` | `identity:role-capability-summary:<summary_id>` |
| `RoleCapabilitySourceSnapshotRef { snapshot_id }` | `identity:role-capability-source-snapshot:<snapshot_id>` |
| `CareerRecordRef { career_record_id }` | `identity:career-record:<career_record_id>` |
| `MemoryReferenceRef { memory_reference_id }` | `identity:memory-reference:<memory_reference_id>` |
| `IdentityOutboxRecordRef { outbox_id }` | `identity:outbox-record:<outbox_id>` |
| `TraceHandoffIntentRef { handoff_intent_id }` | `identity:trace-handoff-intent:<handoff_intent_id>` |

#### 7.7.5 Marker trace subject helper

Consumer / reference-refresh / job marker path 可能只写 source summary、reference state、projection stale marker、stored receipt/report 和可选 marker trace,不创建 accepted truth change 或 outbox payload。凡 Step 9 flow table 后续标记 `trace marker = yes` 的 marker path,必须先通过本 helper 取得正式 marker trace subject,再 append marker trace。Application service、repository adapter、worker、jobs 和 fake runtime 不得根据 event topic、payload type、external ref 字符串、dedupe key、trace id 或 cursor 自行拼接 `IdentityTraceSubjectRef`。

```rust
/// Maps body-free identity marker refs to trace subjects for consumer/job/reference-only marker traces.
pub trait IdentityMarkerSubjectMapper {
    fn source_marker_subject(&self, source_ref: IdentitySourceRef) -> IdentityTraceSubjectRef;
    fn external_reference_marker_subject(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> IdentityTraceSubjectRef;
    fn projection_marker_subject(&self, projection_ref: IdentityProjectionRef) -> IdentityTraceSubjectRef;
    fn job_marker_subject(&self, job_run_ref: IdentityJobRunRef) -> IdentityTraceSubjectRef;
    fn handoff_receipt_marker_subject(
        &self,
        receipt_ref: HandoffReceiptRef,
    ) -> IdentityTraceSubjectRef;
}
```

| helper rule | 正式口径 |
|---|---|
| input source | 只能接收 flow 已正式导出的 typed marker ref,例如 source ref、external reference ref、projection ref、job run ref、receipt ref |
| canonical key | helper 内部使用 `identity:marker:<marker-kind>:<id>` 形成 canonical key;`<id>` 是 typed ref 内部 opaque value |
| output | 返回 `IdentityTraceSubjectRef`;marker helper 不返回 audit/outbox subject,除非后续 Step 9 明确该 marker path 也创建 audit/outbox side effect |
| trace relation | marker trace 使用 helper output 作为 subject,source cursor 使用 reference marker cursor 或 job/projection cursor 的正式来源 |
| fake / durable parity | fake runtime 和 durable adapter 必须按同一 canonical key table 生成 marker subject refs |
| forbidden | 不得解析 external ref 字符串、拼 route path、使用 payload type、event topic、source version、reference cursor、dedupe key、idempotency digest、trace id 或 hard-coded string 代替 subject |

| marker ref | canonical marker trace subject key |
|---|---|
| `IdentitySourceRef { source_id }` | `identity:marker:source:<source_id>` |
| `ExternalReferenceRef { reference_id }` | `identity:marker:external-reference:<reference_id>` |
| `IdentityProjectionRef { projection_id }` | `identity:marker:projection:<projection_id>` |
| `IdentityJobRunRef { job_run_id }` | `identity:marker:job-run:<job_run_id>` |
| `HandoffReceiptRef { receipt_id }` | `identity:marker:handoff-receipt:<receipt_id>` |

#### 7.7.6A Query material degradation mapper helper

Query read path has two different degraded marker sources:

- resolver / dependency degraded before material load: `IdentityReadVisibilityRepository.resolve_*_read(...)` must return `Some(IdentityVisibilityAccessSummary { access_state: Degraded | Unavailable, degraded_marker_ref, degraded_kind, ... })`;
- material / projection / reference / report / outbox / handoff / trace / audit integrity degraded after a valid access summary already exists: service must call `IdentityQueryMaterialDegradationMapper` and copy the returned `IdentityQueryMaterialDegradationSummary` into public `IdentityQuerySurface.degraded`.

The mapper is application-local and body-free. It does not allocate ids, read repositories, call adapters, save decisions, repair projections, append trace/audit, or create visibility result refs. It only turns typed context plus the already-resolved access summary into a safe degraded marker summary.

```rust
pub trait IdentityQueryMaterialDegradationMapper {
    fn member_summary_view_missing(
        &self,
        access: IdentityVisibilityAccessSummary,
        expected_member_ref: GlobalMemberRef,
        expected_scope_ref: VisibilityScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn member_summary_view_invalid_owner(
        &self,
        access: IdentityVisibilityAccessSummary,
        view_ref: MemberSummaryViewRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn member_summary_view_scope_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        view_ref: MemberSummaryViewRef,
        expected_scope_ref: VisibilityScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn member_summary_view_missing_freshness(
        &self,
        access: IdentityVisibilityAccessSummary,
        view_ref: MemberSummaryViewRef,
        expected_member_ref: GlobalMemberRef,
        expected_scope_ref: VisibilityScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn forbidden_read_material(
        &self,
        access: IdentityVisibilityAccessSummary,
        read_material_marker: IdentityReadMaterialMarker,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn career_record_item_missing_after_list(
        &self,
        access: IdentityVisibilityAccessSummary,
        record_ref: CareerRecordRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn career_record_item_invalid_member(
        &self,
        access: IdentityVisibilityAccessSummary,
        record_ref: CareerRecordRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn memory_reference_item_missing_after_list(
        &self,
        access: IdentityVisibilityAccessSummary,
        reference_ref: MemoryReferenceRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn memory_reference_item_invalid_member(
        &self,
        access: IdentityVisibilityAccessSummary,
        reference_ref: MemoryReferenceRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn trace_item_missing_after_list(
        &self,
        access: IdentityVisibilityAccessSummary,
        trace_ref: IdentityTraceRecordRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn trace_item_invalid_member(
        &self,
        access: IdentityVisibilityAccessSummary,
        trace_ref: IdentityTraceRecordRef,
        expected_member_ref: GlobalMemberRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn trace_item_subject_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        trace_ref: IdentityTraceRecordRef,
        expected_subject_ref: IdentityTraceSubjectRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn audit_item_missing_or_invalid(
        &self,
        access: IdentityVisibilityAccessSummary,
        audit_trail_ref: AuditTrailRef,
        audit_scope_ref: AuditScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn projection_state_ref_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        projection_ref: IdentityProjectionRef,
        requested_state_ref: ProjectionStateRef,
        loaded_state_ref: ProjectionStateRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn reference_state_owner_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        reference_ref: ExternalReferenceRef,
        expected_owner_ref: IdentityReferenceOwnerRef,
        loaded_owner_ref: IdentityReferenceOwnerRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn reference_sidecar_degraded(
        &self,
        access: IdentityVisibilityAccessSummary,
        reference_ref: ExternalReferenceRef,
        resolution_state_ref: Option<ReferenceResolutionStateRef>,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn reconciliation_report_scope_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        report_ref: ReconciliationReportRef,
        expected_scope_ref: MaintenanceScopeRef,
        loaded_scope_ref: MaintenanceScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn reconciliation_report_item_missing_after_list(
        &self,
        access: IdentityVisibilityAccessSummary,
        report_ref: ReconciliationReportRef,
        expected_scope_ref: MaintenanceScopeRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn outbox_record_item_missing_after_list(
        &self,
        access: IdentityVisibilityAccessSummary,
        outbox_ref: IdentityOutboxRecordRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn outbox_record_selector_mismatch(
        &self,
        access: IdentityVisibilityAccessSummary,
        outbox_ref: IdentityOutboxRecordRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn handoff_intent_empty_trace_refs(
        &self,
        access: IdentityVisibilityAccessSummary,
        intent_ref: TraceHandoffIntentRef,
    ) -> IdentityQueryMaterialDegradationSummary;

    fn handoff_intent_delivered_without_receipt(
        &self,
        access: IdentityVisibilityAccessSummary,
        intent_ref: TraceHandoffIntentRef,
    ) -> IdentityQueryMaterialDegradationSummary;
}
```

| mapper method | `IdentityDegradedKind` | summary source | 使用分支 |
|---|---|---|---|
| `member_summary_view_missing(...)` | `PartialResult` | copies `access.read_subject_ref`, `access.scope_ref`, and `IdentityReadSurfaceKind::Degraded` | stable lookup/get view 后 material 缺失或 projection sidecar 不完整 |
| `member_summary_view_invalid_owner(...)` | `MaterialUnsafe` | copies `access.read_subject_ref`, `access.scope_ref`, and `IdentityReadSurfaceKind::Degraded` | loaded view `belongs_to(member_ref)` 失败 |
| `member_summary_view_scope_mismatch(...)` | `MaterialUnsafe` | copies `access.read_subject_ref`, `access.scope_ref`, and `IdentityReadSurfaceKind::Degraded` | loaded view `matches_visibility_scope(...)` 失败 |
| `member_summary_view_missing_freshness(...)` | `MaterialUnsafe` | copies `access.read_subject_ref`, `access.scope_ref`, and `IdentityReadSurfaceKind::Degraded` | loaded member summary view 被判定 stale/degraded 但缺少 `projection_freshness_ref`;must return `Degraded`,not `StaleVisible` |
| `forbidden_read_material(...)` | `MaterialUnsafe` | copies access summary plus `read_material_marker` | `assert_body_free()` / forbidden material failure |
| `career_record_item_missing_after_list(...)` | `PartialResult` | copies access summary plus career record ref and expected member | career page ref 已列出但 item get missing |
| `career_record_item_invalid_member(...)` | `MaterialUnsafe` | copies access summary plus career record ref and expected member | loaded career record `belongs_to(member_ref)` 失败 |
| `memory_reference_item_missing_after_list(...)` | `PartialResult` | copies access summary plus memory reference ref and expected member | memory page ref 已列出但 item get missing |
| `memory_reference_item_invalid_member(...)` | `MaterialUnsafe` | copies access summary plus memory reference ref and expected member | loaded memory reference `belongs_to(member_ref)` 失败 |
| `trace_item_missing_after_list(...)` | `PartialResult` | copies `access.read_subject_ref`, `access.scope_ref`, and `IdentityReadSurfaceKind::Degraded` | trace page ref 已列出但 item get missing |
| `trace_item_invalid_member(...)` | `MaterialUnsafe` | copies access summary | loaded trace member mismatch |
| `trace_item_subject_mismatch(...)` | `MaterialUnsafe` | copies access summary | selector.BySubject subject mismatch |
| `audit_item_missing_or_invalid(...)` | `PartialResult` or `MaterialUnsafe` per audit safe material table | copies access summary and audit scope | audit trail / entry missing,scope mismatch,raw material guard failure |
| `projection_state_ref_mismatch(...)` | `MaterialUnsafe` | copies access summary plus projection and requested/loaded state refs | `GetProjectionStateFlow` request state ref does not match loaded `ProjectionState.projection_state_ref` |
| `reference_state_owner_mismatch(...)` | `MaterialUnsafe` | copies access summary plus external reference and expected/loaded owner refs | `GetReferenceResolutionStateFlow` request owner does not match loaded reference owner |
| `reference_sidecar_degraded(...)` | `PartialResult` | copies access summary plus external reference and optional state ref | typed sidecar refs missing/degraded after stored reference state load |
| `reconciliation_report_scope_mismatch(...)` | `MaterialUnsafe` | copies access summary plus report ref and expected/loaded maintenance scope refs | exact or listed reconciliation report belongs to another maintenance scope |
| `reconciliation_report_item_missing_after_list(...)` | `PartialResult` | copies access summary plus report ref and expected scope | report ref returned by scope list cannot be loaded |
| `outbox_record_item_missing_after_list(...)` | `PartialResult` | copies access summary plus outbox ref | outbox ref returned by selector list cannot be loaded |
| `outbox_record_selector_mismatch(...)` | `MaterialUnsafe` | copies access summary plus outbox ref | loaded outbox topic/subject/trace/state does not match selector guard |
| `handoff_intent_empty_trace_refs(...)` | `MaterialUnsafe` | copies access summary plus handoff intent ref | loaded handoff intent has empty `trace_record_refs` |
| `handoff_intent_delivered_without_receipt(...)` | `MaterialUnsafe` | copies access summary plus handoff intent ref | loaded handoff state is `Delivered` but receipt marker is absent |

Rules:

- `degraded_marker_ref` comes from the mapper implementation's opaque degraded marker source;application query service receives a complete `IdentityQueryMaterialDegradationSummary` and only copies it.
- `visibility_result_ref` still comes from the access summary / visibility policy. The mapper must not generate or override visibility result refs.
- `read_subject_ref` and `visibility_scope_ref` are copied from `IdentityVisibilityAccessSummary`;the mapper must not infer them from `member_ref`, `view_ref`, `trace_ref`, `audit_trail_ref`, cursor, route, scope string, or result marker.
- `member_summary_view_missing_freshness(...)` is the only formal degraded marker source when `ReadMemberSummaryFlow` has loaded a stale/degraded `MemberSummaryView` but `projection_freshness_ref` is absent. Query service must return `Degraded` with the mapper summary;it must not read projection state, infer a projection ref from `view_ref`, reuse resolver markers, or synthesize a stale marker.
- Career / memory list item methods are the only formal source of degraded markers for `ListCareerRecordsFlow` and `ListMemoryReferencesFlow` item missing / member mismatch after a valid access summary. Query service must not use generic `forbidden_read_material(...)`, trace/audit mapper methods, repository error strings, or fake-only rules for those branches.
- For `ReadIdentityTrace` selector `ByMember` and `ByMemberAndChangeKind`, query service must first call `resolve_trace_member_page_read(...)`. Repository empty pages return `Empty` by copying this page access summary into the public surface. If the first listed `IdentityTraceRecordRef` is missing before an item subject can be loaded, the service must call `trace_item_missing_after_list(page_access, trace_ref)` and return page-level `Degraded`;it must not synthesize a visibility result, call `resolve_trace_read(...)` with a guessed subject, or silently turn the branch into `Empty`.
- For `commit-05-c` operations reads, projection/reference/report/outbox/handoff material degraded branches must use the dedicated operations mapper methods above. The query service must copy the returned summary only;it must not reuse member/trace/audit methods, generic error strings, repository diagnostics, adapter diagnostics, or fake-only enums.
- For `ListPendingIdentityOutboxFlow`, selector `ByTrace` must call `resolve_outbox_trace_page_read(trace_record_ref, ...)` before `find_outbox_records_by_trace(...)`;repository empty pages return `Empty` by copying this page access summary into the public surface. Item missing after any selector list must still have a valid access summary before calling `outbox_record_item_missing_after_list(...)`;for ByTrace listed refs the service calls `resolve_outbox_record_read(Some(outbox_ref), None, None, ...)` before item load. Resolver `None` remains malformed/unresolvable and cannot be turned into a synthesized visibility result or degraded marker.
- Fake runtime and durable adapters must use the same method-to-kind table and opaque marker creation rule. Fake may make markers deterministic for tests, but it must not use a private map to authorize degraded branches not represented by this trait.
- Forbidden: query service synthesizes degraded marker, classifies degraded kind from `ApplicationError` text, repository error string, HTTP status, view id prefix, trace subject string, raw log body, projection body, adapter diagnostic or fake-only enum.

#### 7.7.6 Maintenance issue mapper helper

Projection/reference/reconciliation jobs expose `MaintenanceIssueRef` directly, while publisher and handoff adapter outcomes store propagation-specific issue markers in `OutboxState` / `HandoffState`. Application job services must use this mapper when converting typed maintenance markers or propagation failures into `IdentityJobRunReport.issue_refs` and job output `issue_refs`;they must not cast refs or parse raw adapter errors.

```rust
/// Maps propagation issue markers into body-free maintenance issue refs for job/report surfaces.
pub trait IdentityMaintenanceIssueMapper {
    fn projection_missing_state_issue(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> MaintenanceIssueRef;

    fn projection_missing_cursor_issue(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> MaintenanceIssueRef;

    fn projection_unsupported_writer_issue(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> MaintenanceIssueRef;

    fn projection_missing_rebuild_scope_issue(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> MaintenanceIssueRef;

    fn reference_missing_state_issue(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> MaintenanceIssueRef;

    fn reference_refresh_failed_issue(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> MaintenanceIssueRef;

    fn maintenance_target_missing_issue(
        &self,
        target_ref: IdentityMaintenanceTargetRef,
    ) -> MaintenanceIssueRef;

    fn outbox_retryable_issue(
        &self,
        issue_ref: OutboxDeliveryIssueRef,
    ) -> MaintenanceIssueRef;

    fn outbox_permanent_issue(
        &self,
        issue_ref: OutboxDeliveryIssueRef,
    ) -> MaintenanceIssueRef;

    fn outbox_skipped_issue(
        &self,
        issue_ref: OutboxDeliveryIssueRef,
    ) -> MaintenanceIssueRef;

    fn outbox_unsupported_topic_issue(
        &self,
        issue_ref: OutboxDeliveryIssueRef,
    ) -> MaintenanceIssueRef;

    fn handoff_retryable_issue(
        &self,
        issue_ref: HandoffIssueRef,
    ) -> MaintenanceIssueRef;

    fn handoff_permanent_issue(
        &self,
        issue_ref: HandoffIssueRef,
    ) -> MaintenanceIssueRef;

    fn handoff_cancelled_issue(
        &self,
        issue_ref: HandoffIssueRef,
    ) -> MaintenanceIssueRef;

    fn handoff_unsupported_target_issue(
        &self,
        issue_ref: HandoffIssueRef,
    ) -> MaintenanceIssueRef;
}
```

| mapper method | `MaintenanceIssueKind` | `MaintenanceIssueRef.issue_ref` source |
|---|---|---|
| `projection_missing_state_issue(...)` | `Unrecognized` | `IdentityProjectionRef.projection_ref` |
| `projection_missing_cursor_issue(...)` | `Stale` | `IdentityProjectionRef.projection_ref` |
| `projection_unsupported_writer_issue(...)` | `Failed` | `IdentityProjectionRef.projection_ref` |
| `projection_missing_rebuild_scope_issue(...)` | `Partial` | `IdentityProjectionRef.projection_ref` |
| `reference_missing_state_issue(...)` | `Unrecognized` | `ExternalReferenceRef.source_ref` |
| `reference_refresh_failed_issue(...)` | `Failed` | `ExternalReferenceRef.source_ref` |
| `maintenance_target_missing_issue(...)` | `Unrecognized` | `IdentityMaintenanceTargetRef.target_ref` |
| `outbox_retryable_issue(...)` | `Unavailable` | `OutboxDeliveryIssueRef.issue_ref` |
| `outbox_permanent_issue(...)` | `Failed` | `OutboxDeliveryIssueRef.issue_ref` |
| `outbox_skipped_issue(...)` | `Failed` | `OutboxDeliveryIssueRef.issue_ref` |
| `outbox_unsupported_topic_issue(...)` | `Unrecognized` | `OutboxDeliveryIssueRef.issue_ref` |
| `handoff_retryable_issue(...)` | `Unavailable` | `HandoffIssueRef.issue_ref` |
| `handoff_permanent_issue(...)` | `Failed` | `HandoffIssueRef.issue_ref` |
| `handoff_cancelled_issue(...)` | `Failed` | `HandoffIssueRef.issue_ref` |
| `handoff_unsupported_target_issue(...)` | `Unrecognized` | `HandoffIssueRef.issue_ref` |

Rules:

- The mapper is a pure application helper. It does not allocate ids, read repository state, call adapters, or save issue bodies.
- The source marker is already safe and body-free;the mapper only changes the report surface type and outcome category.
- Projection/reference mapper methods copy the typed marker's body-free `IdentitySourceRef` into `MaintenanceIssueRef.issue_ref`;they do not inspect marker strings or derive hidden status.
- `OutboxState` and `HandoffState` continue to store their native issue refs. `MaintenanceIssueRef` is used for job output/report/reconciliation surfaces.
- Fake runtime and durable adapters must use the same mapping table. Tests may assert exact `MaintenanceIssueKind` and copied `IdentitySourceRef`.
- Forbidden: derive issue kind from adapter exception text, HTTP status, broker code, topic string, target path, payload body, receipt body, raw diagnostic, or fake private map.

#### 7.7.7 common ref set / versioned ref helper

```rust
/// Body-free set of identity member refs used by application-local repository and resolver calls.
pub struct GlobalMemberRefSet {
    /// Member refs in deterministic repository order.
    pub member_refs: Vec<GlobalMemberRef>,
}

/// Body-free set of projection refs used by stale marking and rebuild jobs.
pub struct IdentityProjectionRefSet {
    /// Projection refs in deterministic repository order.
    pub projection_refs: Vec<IdentityProjectionRef>,
}

/// Body-free set of external reference refs used by refresh scans.
pub struct ExternalReferenceRefSet {
    /// External reference refs in deterministic repository order.
    pub reference_refs: Vec<ExternalReferenceRef>,
}
```

| helper | 用途 | 闭环口径 | 禁止事项 |
|---|---|---|---|
| `GlobalMemberRefSet` | batch read/query/job scope expansion | application-local deterministic ref set | 不作为 public DTO;不通过字符串 scope 拼接 |
| `IdentityProjectionRefSet` | projection stale/rebuild affected refs | 只能来自 projection lookup/maintenance expansion port | 不全表扫描、不从 view ref 反推 |
| `ExternalReferenceRefSet` | reference refresh explicit refs | 只能来自 request/job scope/resolver formal output | 不从 business source ref 自动转换 |

#### 7.7.8 7.1 helper 后续承接表

| helper family | 后续 Step 7 承接 | 后续 Step 8/9/10/11/13 承接 |
|---|---|---|
| `IdentityVersion` / `Versioned<T>` | 7.3~7.6 repository read/save | Step 9 mutation precheck;Step 11 optimistic save;Step 13 conflict |
| `IdentityRepositoryCursor` / `Page<T>` | 7.3~7.6 list/read ports | Step 8 page DTO mapping;Step 9 query/job list |
| `IdentityUnitOfWork` | 7.2 UoW manager, 7.3~7.6 save/append ports | Step 9 transaction;Step 11 commit/rollback;Step 13 replay |
| truth cursor helper | 7.2 UoW cursor assigner | Step 9 accepted flow;Step 11 cursor persistence;Step 13 stored result |
| reference marker cursor helper | 7.2 UoW cursor assigner | Step 9 consumer/job marker;Step 11 stale marker;Step 13 receipt/report |
| accepted subject mapper | 7.4 trace/audit, 7.6 outbox | Step 9 accepted side effect;Step 15 observability |
| accepted audit marker mapper | 7.4 audit trail create / append | Step 9 accepted audit side effect;Step 11 audit trail persistence |
| query material degradation mapper | 7.5 projection/read visibility,7.4 trace/audit read,7.8 query facade | Step 8 query degraded marker;Step 9 material degraded branches;Step 12 recovery priority |
| marker subject mapper | 7.4 marker trace, 7.5/7.7 reference/job/handoff marker | Step 9 consumer/job/callback;Step 15 observability |
| maintenance issue mapper | 7.7 publisher/handoff outcomes and 7.6 job report | Step 9 publish/handoff/retry jobs;Step 12 recovery;Step 16 failure tests |
| ref set helper | 7.5 projection/reference/report, 7.7 resolver | Step 9 job/query;Step 11 persistence;Step 16 tests |

#### 7.7.9 7.1 fake / durable parity 表

| helper family | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| version | create/read/save 后版本单调且 conflict 可断言 | 使用 store optimistic token | fake 用 timestamp/digest 当 version |
| page cursor | list page cursor opaque 且 deterministic | 使用 store cursor / keyset cursor | page cursor 当 version/truth cursor |
| UoW transaction ref | 每个 transaction 有 stable ref | transaction/log context 有 stable ref | transaction ref 进入 public DTO |
| truth cursor | commit 后可断言单调;rollback 不泄露 | commit boundary cursor 来源稳定 | service 拼 cursor |
| reference marker cursor | reference-only transaction commit 后可断言 | reference marker boundary cursor 来源稳定 | source version/dedupe key 当 cursor |
| accepted subject mapper | fake 与 durable 使用同一 canonical key table | durable 不从 DB 私有 key 派生第二套 subject | trace/audit/outbox 不同 key |
| accepted audit marker mapper | fake 与 durable 使用同一 accepted audit marker table | durable 不从 read visibility resolver 或 private audit store 派生 marker | default scope / default visible / hard-coded marker |
| query material degradation mapper | fake 与 durable 使用同一 method-to-kind table 和 opaque degraded marker source | durable 不从 repository raw error 或 projection body 派生 marker/kind | query service 合成 marker、fake 私有 map、error string 分类 |
| marker subject mapper | fake 与 durable 使用同一 marker key table | durable 不从 topic/payload 派生第二套 subject | event topic/payload type 当 subject |
| maintenance issue mapper | fake 与 durable 使用同一 issue kind mapping table | durable 不从 adapter raw error 派生第二套 issue kind | raw error / HTTP status / topic string 决定 kind |

#### 7.7.10 7.1 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 shared helper | 通过 | 未写 Clock、IdGenerator、repository、resolver、publisher、handoff |
| 是否覆盖 cursor/version/key | 通过 | §7.7.2~§7.7.3 固定 version/page/UoW/truth cursor/reference marker cursor |
| 是否覆盖 accepted subject mapper | 通过 | §7.7.4 给出 mapper trait 和 canonical key table |
| 是否覆盖 accepted audit marker mapper | 通过 | §7.7.4 给出 accepted audit trail marker mapper,闭合 accepted write 创建 trail 所需 scope / visibility marker |
| 是否覆盖 query material degraded marker 来源 | 通过 | §7.7.6A 给出 query material degradation mapper,闭合 query 内部 missing/mismatch/unsafe/partial item 的 degraded marker 来源 |
| 是否覆盖 marker subject mapper | 通过 | §7.7.5 给出 marker mapper trait 和 canonical key table |
| 是否覆盖 fake/durable parity | 通过 | §7.7.9 固定 helper family 等价语义 |
| 是否越过后续 Step | 未越过 | 未写 DTO、flow、state matrix、DDL、具体 repository trait |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.2` | 7.1 已审核通过;7.2 已写入并停审 |

#### 7.7.11 7.1 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| optimistic version | `save(..., expected_version)` 来自 `Versioned<T>.version` | 用 source version 或 timestamp 当 expected_version |
| page cursor | `Page<T>.next_cursor` 只用于下一页 | 用 page cursor 当 truth cursor |
| truth cursor | accepted command staged truth 后由 UoW 分配 | service 调 id generator 拼 truth cursor |
| reference marker cursor | reference state/sidecar staged 后由 UoW 分配 | 用 event dedupe key 当 marker cursor |
| accepted subject | mapper 由 typed truth ref 生成同源 trace/audit/outbox subjects | service 拼 `member:<id>` |
| audit subject | audit trail 使用 mapper 返回的 audit subject | 从 trace subject 字符串强转 |
| query degraded marker | loaded view mismatch 先调用 `IdentityQueryMaterialDegradationMapper.member_summary_view_invalid_owner(...)`,再复制 summary marker | query service 用 `format!("degraded:{view_ref}")` 或 fake 私有 map 合成 marker |
| marker subject | source/ref/job/receipt marker 使用 marker mapper | 用 event topic/payload type 当 trace subject |
| fake parity | fake 和 durable 共享 canonical key table | fake 私有 map 让测试通过 |

### 7.8 7.2 application 基础 ports

本批定义所有后续 repository、resolver、outbox、handoff、idempotency、stored result、job 和 entry dispatch 共同依赖的 application 基础 port。本批只写 Clock、IdGenerator、UnitOfWork manager / cursor assigner、operation context factory、dispatch target catalog 和基础 port 的 fake/durable 等价语义;不写 core truth repository、external resolver、projection repository、outbox repository、handoff adapter、DTO、flow、state matrix 或 DDL。

#### 7.8.1 7.2 capability / 接缝清单

| capability | port / catalog | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| trusted time | `IdentityClockPort` | command/query/consumer/job/handoff service,entry factory | infra clock / fake clock | §7.18.2 `IdentityTimestamp`;§7.16/§7.17 started/received/checked time | Step 8 metadata;Step 9 flow;Step 11 persisted timestamp |
| stable id generation | `IdentityIdGeneratorPort` | application service,entry factory,job runner facade | infra id generator / deterministic fake | §7.18.2 object local id/ref;§7.20.6 id generator | Step 8 result refs;Step 9 factories;Step 11 PK |
| write transaction | `IdentityUnitOfWorkManager` + `IdentityUnitOfWork` | application mutation/consumer/job services | infra transaction manager / fake UoW | 7.1 helper;§7.20.6 application support | Step 9 transaction;Step 11 commit/rollback |
| accepted cursor | `IdentityTruthCursorAssigner` / UoW method | accepted command services | UoW implementation | §7.18.3 `IdentityTruthCursor`;§7.20.6 truth cursor assigner | Step 9 accepted flow;Step 11 cursor;Step 13 replay |
| reference marker cursor | `IdentityReferenceMarkerCursorAssigner` / UoW method | consumer/reference-refresh/job marker services | UoW implementation | §7.18.3 cursor 防混用;7.1 UoW helper | Step 9 consumer/job;Step 11 stale marker |
| operation context creation | `IdentityOperationContextFactory` | api/worker/jobs entry adapters,application facade tests | application factory using id/clock inputs | §7.16.4 `IdentityOperationContext`;§7.18.2 channel | Step 8 metadata;Step 9 handler/worker/job dispatch;Step 13 idempotency |
| dispatch target catalog | `IdentityDispatchTargetCatalog` | api/worker/jobs dispatch guard | application catalog / infra wiring | §7.17.13 `IdentityEntryDispatchGuard`;§7.20.6 target catalog | Step 9 service target matrix;Step 16 boundary tests |

#### 7.8.2 `IdentityClockPort`

`IdentityTimestamp` 已在 Step 6 固定为 identity wrapper。Clock port 只提供可信 application time,不重新定义 timestamp 结构,也不表达 cursor、version、source version 或 idempotency 语义。

```rust
/// Provides trusted Identity application time for records, snapshots, entries, and markers.
pub trait IdentityClockPort {
    /// Returns the current Identity application timestamp.
    fn now(&self) -> Result<IdentityTimestamp, ApplicationError>;
}
```

| 函数 | 使用方 | 字段来源 | 禁止事项 | fake / durable parity |
|---|---|---|---|---|
| `now` | command / query / consumer / job service;API / worker / job entry factory | created/changed/appended/occurred/checked/received/started/finished/recorded/decided time | 不得替代 truth cursor、projection cursor、job cursor、optimistic version、source version、idempotency key | fake clock 必须可固定 / 可推进;durable clock 必须统一时钟来源;二者都不能依赖 domain object 内部系统时间 |

#### 7.8.3 `IdentityIdGeneratorPort`

`IdentityIdGeneratorPort` 必须覆盖 Step 6 所有由 application、entry factory、result assembler、job runner facade 或 maintenance/report assembler 生成的 identity-owned id/ref。Domain object、handler、worker、jobs、repository adapter 和 fake runtime 不得从 `member_ref + kind + timestamp`、source ref、idempotency key、cursor、route 或 topic 拼接 id。

```rust
/// Generates stable Identity identifiers used by application and entry flows.
pub trait IdentityIdGeneratorPort {
    fn new_global_member_id(&self) -> Result<GlobalMemberId, ApplicationError>;
    fn new_role_capability_summary_id(&self) -> Result<RoleCapabilitySummaryId, ApplicationError>;
    fn new_role_capability_source_snapshot_id(&self) -> Result<RoleCapabilitySourceSnapshotId, ApplicationError>;
    fn new_career_record_id(&self) -> Result<CareerRecordId, ApplicationError>;
    fn new_memory_reference_id(&self) -> Result<MemoryReferenceId, ApplicationError>;

    fn new_member_summary_view_id(&self) -> Result<MemberSummaryViewId, ApplicationError>;
    fn new_identity_trace_record_id(&self) -> Result<IdentityTraceRecordId, ApplicationError>;
    fn new_audit_trail_id(&self) -> Result<AuditTrailId, ApplicationError>;
    fn new_projection_state_id(&self) -> Result<ProjectionStateId, ApplicationError>;
    fn new_reference_resolution_state_id(&self) -> Result<ReferenceResolutionStateId, ApplicationError>;
    fn new_reconciliation_report_id(&self) -> Result<ReconciliationReportId, ApplicationError>;
    fn new_reconciliation_finding_ref(&self) -> Result<ReconciliationFindingRef, ApplicationError>;

    fn new_identity_outbox_record_ref(&self) -> Result<IdentityOutboxRecordRef, ApplicationError>;
    fn new_identity_outbox_payload_marker_ref(&self) -> Result<IdentityOutboxPayloadMarkerRef, ApplicationError>;
    fn new_outbox_delivery_attempt_ref(&self) -> Result<OutboxDeliveryAttemptRef, ApplicationError>;
    fn new_outbox_delivery_issue_ref(&self) -> Result<OutboxDeliveryIssueRef, ApplicationError>;

    fn new_trace_handoff_intent_ref(&self) -> Result<TraceHandoffIntentRef, ApplicationError>;
    fn new_handoff_attempt_ref(&self) -> Result<HandoffAttemptRef, ApplicationError>;
    fn new_handoff_receipt_ref(&self) -> Result<HandoffReceiptRef, ApplicationError>;
    fn new_handoff_issue_ref(&self) -> Result<HandoffIssueRef, ApplicationError>;

    fn new_identity_operation_context_ref(&self) -> Result<IdentityOperationContextRef, ApplicationError>;
    fn new_identity_idempotency_record_ref(&self) -> Result<IdentityIdempotencyRecordRef, ApplicationError>;
    fn new_identity_stored_result_ref(&self) -> Result<IdentityStoredResultRef, ApplicationError>;
    fn new_identity_stored_surface_marker_ref(&self) -> Result<IdentityStoredSurfaceMarkerRef, ApplicationError>;
    fn new_identity_consumer_receipt_ref(&self) -> Result<IdentityConsumerReceiptRef, ApplicationError>;
    fn new_identity_command_effect_summary_ref(&self) -> Result<IdentityCommandEffectSummaryRef, ApplicationError>;
    fn new_identity_visibility_decision_ref(&self) -> Result<IdentityVisibilityDecisionRef, ApplicationError>;
    fn new_identity_job_run_ref(&self) -> Result<IdentityJobRunRef, ApplicationError>;
    fn new_identity_job_report_ref(&self) -> Result<IdentityJobReportRef, ApplicationError>;

    fn new_identity_runtime_assembly_ref(&self) -> Result<IdentityRuntimeAssemblyRef, ApplicationError>;
    fn new_identity_api_entry_ref(&self) -> Result<IdentityApiEntryRef, ApplicationError>;
    fn new_identity_entry_dispatch_ref(&self) -> Result<IdentityEntryDispatchRef, ApplicationError>;
    fn new_identity_worker_entry_ref(&self) -> Result<IdentityWorkerEntryRef, ApplicationError>;
    fn new_identity_worker_dispatch_ref(&self) -> Result<IdentityWorkerDispatchRef, ApplicationError>;
    fn new_identity_job_entry_ref(&self) -> Result<IdentityJobEntryRef, ApplicationError>;
    fn new_identity_job_dispatch_ref(&self) -> Result<IdentityJobDispatchRef, ApplicationError>;
}
```

| 覆盖组 | 方法 | Step 6 来源 | 禁止事项 |
|---|---|---|---|
| core truth | member、role capability summary、source snapshot、career、memory reference ids | §6.2-a~6.2-e;§7.18.2 object local id/ref | 不用 account / work / memory / archive external id 代替 identity-owned id |
| read / trace / audit / projection / report | member summary view、trace record、audit trail、projection state、reference state、reconciliation report/finding | §6.3~6.4 | 不由 query 拼 view id;不由 trace subject 拼 audit trail id |
| outbox / handoff | outbox record、payload marker、publish attempt/issue、handoff intent/attempt/receipt/issue | §6.5 | 不由 topic/target/trace/source 拼 id;receipt ref 不等于 adapter raw receipt |
| application support | operation context、idempotency record、stored result、stored surface marker、consumer receipt、effect summary、visibility decision、job run/report | §6.6 | 不用 idempotency key、digest、cursor、source event、worker dispatch 或 job name+time 生成 |
| entry/runtime | runtime assembly、api/worker/job entry、dispatch refs | §6.7 | 不用 route、event id、job run ref 或 profile+timestamp 临时拼接 |

#### 7.8.4 UnitOfWork manager / cursor assigner port

7.1 已定义 `IdentityUnitOfWork` 和 `IdentityUnitOfWorkManager` helper。本批把它固定为正式 application 基础 port:所有 write-side repository save/append/update 后续都必须接收同一个 `&dyn IdentityUnitOfWork` 或等价 transaction handle。Accepted command 使用 truth cursor;consumer/reference-refresh/job marker 使用 reference marker cursor。两种 cursor 都只能由 UoW implementation 分配,service 不能拼接。

```rust
/// Begins Identity write transactions.
pub trait IdentityUnitOfWorkManagerPort {
    async fn begin(&self) -> Result<Box<dyn IdentityUnitOfWork>, ApplicationError>;
    async fn commit(&self, uow: Box<dyn IdentityUnitOfWork>) -> Result<(), ApplicationError>;
    async fn rollback(&self, uow: Box<dyn IdentityUnitOfWork>) -> Result<(), ApplicationError>;
}

/// Explicit cursor assignment facade for flows that need compile-time dependency naming.
pub trait IdentityCursorAssignerPort {
    fn assign_truth_change_cursor(
        &self,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityTruthCursor, ApplicationError>;

    fn assign_reference_marker_cursor(
        &self,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityTruthCursor, ApplicationError>;
}
```

| 规则 | truth change cursor | reference marker cursor |
|---|---|---|
| 调用前置 | accepted command 的 primary truth save/stage 已进入同一 UoW | reference state / typed sidecar / stored receipt / marker write 已进入同一 UoW |
| 调用次数 | 每个 accepted command transaction 一次;trace/audit/outbox/stale/stored result 复用同一 cursor | 每个 reference-only consumer/job transaction 一次;marker trace/stale/report/receipt 复用同一 cursor |
| 可见性 | commit 后成为 committed accepted truth cursor;rollback 不泄露 | commit 后成为 committed reference marker cursor;rollback 不泄露 |
| 禁止来源 | timestamp、optimistic version、id generator、trace id、outbox id、idempotency key、request digest、page cursor | source version、snapshot version、event dedupe key、job cursor、idempotency digest、page cursor、timestamp |
| 后续承接 | Step 9 accepted flow;Step 11 transaction;Step 13 stored result replay | Step 9 consumer/job/refresh;Step 11 stale marker;Step 13 receipt/report replay |

#### 7.8.5 `IdentityOperationContextFactoryPort`

Step 6 已定义 `IdentityOperationContext` 的字段和 factory 语义。本批只定义 factory port,让 API、worker、jobs entry 在 dispatch application service 前能形成正式 context。Factory 必须固定 channel,并接收由 entry/canonicalizer 准备好的 body-free metadata、digest、trace context、source event 或 job run marker;不得由 service flow 根据 operation name 字符串猜 channel。

```rust
/// Builds application operation contexts from body-free entry metadata.
pub trait IdentityOperationContextFactoryPort {
    fn from_command(
        &self,
        operation_name: IdentityOperationName,
        actor_ref: ActorRef,
        request_metadata_ref: IdentityRequestMetadataRef,
        idempotency_key: Option<IdentityIdempotencyKey>,
        request_digest: IdentityRequestDigest,
        trace_context_ref: Option<IdentityTraceContextRef>,
        context_ref: IdentityOperationContextRef,
        started_at: IdentityTimestamp,
    ) -> Result<IdentityOperationContext, ApplicationError>;

    fn from_query(
        &self,
        operation_name: IdentityOperationName,
        actor_ref: ActorRef,
        request_metadata_ref: IdentityRequestMetadataRef,
        request_digest: IdentityRequestDigest,
        trace_context_ref: Option<IdentityTraceContextRef>,
        context_ref: IdentityOperationContextRef,
        started_at: IdentityTimestamp,
    ) -> Result<IdentityOperationContext, ApplicationError>;

    fn from_inbound_event(
        &self,
        operation_name: IdentityOperationName,
        actor_ref: ActorRef,
        request_metadata_ref: IdentityRequestMetadataRef,
        idempotency_key: IdentityIdempotencyKey,
        request_digest: IdentityRequestDigest,
        trace_context_ref: Option<IdentityTraceContextRef>,
        source_event_ref: IdentitySourceEventRef,
        context_ref: IdentityOperationContextRef,
        started_at: IdentityTimestamp,
    ) -> Result<IdentityOperationContext, ApplicationError>;

    fn from_job(
        &self,
        operation_name: IdentityOperationName,
        actor_ref: ActorRef,
        request_metadata_ref: IdentityRequestMetadataRef,
        idempotency_key: IdentityIdempotencyKey,
        request_digest: IdentityRequestDigest,
        trace_context_ref: Option<IdentityTraceContextRef>,
        job_run_ref: IdentityJobRunRef,
        context_ref: IdentityOperationContextRef,
        started_at: IdentityTimestamp,
    ) -> Result<IdentityOperationContext, ApplicationError>;

    fn from_handoff_callback(
        &self,
        operation_name: IdentityOperationName,
        actor_ref: ActorRef,
        request_metadata_ref: IdentityRequestMetadataRef,
        idempotency_key: IdentityIdempotencyKey,
        request_digest: IdentityRequestDigest,
        trace_context_ref: Option<IdentityTraceContextRef>,
        source_event_ref: IdentitySourceEventRef,
        context_ref: IdentityOperationContextRef,
        started_at: IdentityTimestamp,
    ) -> Result<IdentityOperationContext, ApplicationError>;
}
```

| factory | 固定 channel | 必填 marker | 禁止事项 |
|---|---|---|---|
| `from_command` | `IdentityOperationChannel::Command` | actor、metadata、digest、context ref、started_at | 不带 source_event_ref / job_run_ref;不保存 raw request |
| `from_query` | `IdentityOperationChannel::Query` | actor、metadata、digest、context ref、started_at | 不允许后续 mutation;不伪造 idempotency 必填 |
| `from_inbound_event` | `IdentityOperationChannel::Consumer` | source_event_ref、dedupe/idempotency key、metadata、digest | 不用 event payload hash 临时生成 source_event_ref |
| `from_job` | `IdentityOperationChannel::OperationsJob` | job_run_ref、metadata、idempotency key、digest | 不用 job name+timestamp 拼 job run |
| `from_handoff_callback` | `IdentityOperationChannel::HandoffCallback` | source_event_ref、dedupe/idempotency key、digest | 不保存 external receipt body |

#### 7.8.6 `IdentityDispatchTargetCatalogPort`

Dispatch target catalog 是 entry guard 的正式来源,只回答“这个 entry surface 是否允许 dispatch 到哪个 application service target”。它不执行 service、不做权限、不读取 repository、不决定 accepted/rejected。Step 9 后续必须把每个 route / binding / job name 映射到本 catalog 的 target,Step 16 用它验证 entry 不绕过 application。

```rust
/// Provides formal application service targets for entry dispatch guards.
pub trait IdentityDispatchTargetCatalogPort {
    fn api_command_target(
        &self,
        route_ref: IdentityApiRouteRef,
    ) -> Result<IdentityDispatchTargetRef, ApplicationError>;

    fn api_query_target(
        &self,
        route_ref: IdentityApiRouteRef,
    ) -> Result<IdentityDispatchTargetRef, ApplicationError>;

    fn worker_consumer_target(
        &self,
        binding_ref: IdentityConsumerBindingRef,
    ) -> Result<IdentityDispatchTargetRef, ApplicationError>;

    fn worker_callback_target(
        &self,
        binding_ref: IdentityConsumerBindingRef,
    ) -> Result<IdentityDispatchTargetRef, ApplicationError>;

    fn job_target(
        &self,
        job_name: IdentityJobName,
    ) -> Result<IdentityDispatchTargetRef, ApplicationError>;

    fn assert_application_target(
        &self,
        surface_kind: IdentityEntrySurfaceKind,
        target_ref: IdentityDispatchTargetRef,
    ) -> Result<(), ApplicationError>;
}
```

| target family | 输入 | 输出语义 | 禁止事项 |
|---|---|---|---|
| API command | route catalog ref | command application service target | 不指向 repository/UoW/publisher/handoff adapter |
| API query | route catalog ref | query application service target | 不指向 mutation service;query 不 rebuild/refresh |
| worker consumer | consumer binding ref | consumer application service target | 不直连 source resolver/repository |
| worker callback | callback binding ref | callback application service target | 不把 callback receipt 直接写 handoff state |
| job | job name catalog ref | job application service target | 不让 job runner 全表扫描或直接修 truth |
| assertion | surface + target | application-only dispatch guard | 不用 config 或 route 覆盖读写边界 |

#### 7.8.7 7.2 后续承接表

| 7.2 port | 后续 Step 7 承接 | 后续 Step 8/9/10/11/13/14/16 承接 |
|---|---|---|
| `IdentityClockPort` | 7.3~7.7 service/repo/adapter time inputs | Step 8 metadata timestamp;Step 9 all flow timestamps;Step 11 persisted timestamp |
| `IdentityIdGeneratorPort` | 7.3 truth repos、7.4 trace/audit/history、7.5 projection/report、7.6 outbox/result、7.8 entry | Step 8 result refs;Step 9 factories;Step 11 PK/unique;Step 16 deterministic fake |
| UoW manager / cursor assigner | 7.3~7.6 save/append/update ports | Step 9 tx boundary;Step 11 transaction order;Step 13 replay and conflict |
| operation context factory | 7.8 entry restrictions | Step 8 metadata/canonical digest;Step 9 dispatch;Step 13 reserve(context) |
| dispatch target catalog | 7.8 entry restrictions;7.9 fake/runtime wiring | Step 9 handler/consumer/job target matrix;Step 16 boundary tests |

#### 7.8.8 7.2 fake / durable parity 表

| port | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| Clock | 可固定、可推进、可断言 timestamp | 统一 trusted time source | domain object 直接读系统时间 |
| IdGenerator | deterministic 且不冲突,覆盖所有方法 | stable opaque id source,不解析业务字段 | fake 用 member/timestamp/source 拼 id |
| UoW manager | begin/commit/rollback 可观察;rollback 不泄露 staged cursor | transaction boundary 与 repository writes 同源 | service 无 UoW 直接写 repo |
| Cursor assigner | cursor 单调、同事务复用、rollback 不泄露 | committed boundary cursor 来自 store/transaction sequence | timestamp/version/key/digest 当 cursor |
| Operation context factory | channel 固定、必填 marker 校验一致 | entry metadata mapping 一致 | service 根据 operation name 猜 channel |
| Dispatch target catalog | target 只指向 application service fake | wiring target 只指向 application service | target 指向 repository、adapter、publisher、projection store |

#### 7.8.9 7.2 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 application 基础 ports | 通过 | 未写 repository、resolver、publisher、handoff、projection/outbox/result trait |
| 是否闭合 `IdentityTimestamp` 来源 | 通过 | `IdentityClockPort.now()` 是唯一基础来源;不替代 cursor/version |
| 是否覆盖 Step 6 generated id/ref | 通过 | `IdentityIdGeneratorPort` 分 core/read/outbox/handoff/application/entry 族列出 |
| 是否承接 7.1 UoW/cursor helper | 通过 | UoW manager 与 cursor assigner 固定 truth/reference marker cursor 来源 |
| 是否承接 operation context factory | 通过 | command/query/consumer/job/handoff callback channel 均由 factory 固定 |
| 是否承接 dispatch target catalog | 通过 | entry target 只允许 application service target |
| 是否覆盖 fake/durable parity | 通过 | §7.8.8 固定基础 port 等价语义 |
| 是否越过后续 Step | 未越过 | 未写 DTO、flow、state matrix、DDL、config schema、具体 repo/adapter |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.3` | 7.2 已审核通过;7.3 已写入并停审 |

#### 7.8.10 7.2 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| timestamp | service 通过 `IdentityClockPort.now()` 获取 `IdentityTimestamp` | domain object 内部调用系统时间 |
| cursor | accepted save/stage 后 UoW 分配 truth cursor | 用 `created_at` 或 `IdentityVersion` 当 cursor |
| id 生成 | `new_career_record_id()` 生成 career record id | `member_ref + source_ref + timestamp` 拼 career id |
| view id | projection builder / id generator 生成 view id,query 通过 lookup | query 临时拼 `member-summary:<member>` |
| operation channel | `from_query(...)` 固定 `Query` channel | service 从 operation name 字符串猜 channel |
| consumer context | `from_inbound_event(...)` 必须带 source_event_ref 和 dedupe key | 用 payload hash 私造 source event ref |
| job context | `from_job(...)` 必须带 job_run_ref | 用 job name + now 拼 job run ref |
| dispatch target | catalog 返回 application service target | API handler 直接调用 repository 或 UoW |
| fake id | fake generator deterministic 覆盖所有 id 方法 | fake 用私有 map 或字符串前缀补缺口 |
| fake rollback | rollback 后 cursor/idempotency side effect 不可见 | fake rollback 仍保留 staged cursor |

### 7.9 7.3 core truth repository ports

本批只定义 identity core truth repository port:member、lifecycle、role/capability、career、memory。所有 repository trait 归 `identity-application` 定义,由 `identity-infra` durable / fake adapter 实现。Application service 是唯一调用方。API、worker、jobs、domain object 和 contracts 不得直接调用 repository。

本批不写 trace、audit、history、projection、reference、outbox、handoff、resolver、publisher、stored result、idempotency、DTO、flow、state matrix 或 DDL。Career append-only 与 trace/history append-only 是两个不同层次:本批的 `CareerRecordRepository` 只保存 career truth/history object;统一 trace/history/audit append-only repository 留 7.4。

#### 7.9.1 7.3 capability / 接缝清单

| repository family | 必须支撑 | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| member anchor truth | member ref 唯一读取、optional anchor read、versioned save、anchor hold save | establish/read/lifecycle terminal services | infra member repo / fake | §7.7 `GlobalMember`;§7.20.2 member row | Step 9 establish/query/terminal hold;Step 11 unique key |
| lifecycle truth | lifecycle by member versioned read/save、current state read | establish lifecycle、update lifecycle services | infra lifecycle repo / fake | §7.8 `GlobalLifecycleState`;§7.20.2 lifecycle row | Step 9 lifecycle flow;Step 10 lifecycle matrix |
| role/capability summary | summary by ref/member, snapshot by ref/source, versioned save, source duplicate/read | maintain role capability、source changed services | infra role repo / fake | §7.9 `RoleCapabilitySummary` / snapshot;§7.20.2 role row | Step 9 summary/source flow;Step 11 optimistic save |
| career records | append career record、list by member/source marker、duplicate source lookup、correction relation read/save | append career、work consumer、correction services | infra career repo / fake | §7.11 `CareerRecord`;§7.20.2 career row | Step 9 append/correction flow;Step 11 append-only persistence |
| memory references | relation by member/memory/archive/handoff read, versioned save, callback target lookup | link/refresh/archive/callback services | infra memory repo / fake | §7.12 `MemoryReference`;§7.20.2 memory row | Step 9 memory/callback flow;Step 11 relation indexes |

#### 7.9.2 repository 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| versioned read | 需要 optimistic update 的 save 必须先通过 `get_*_with_version(...)`、`find_*_with_version(...)` 或 create-result version 获得 `IdentityVersion` |
| expected_version | `save_*` / update 类方法必须接收 `expected_version: Option<IdentityVersion>`;create 可用 `None`,update 必须使用 loaded version |
| UnitOfWork | 所有 save/append/update 方法必须接收 `uow: &dyn IdentityUnitOfWork`;read/list 不接收 UoW,除非 Step 11 后续明确 read-your-write 事务读取面 |
| body-free | repository 只保存 Step 6 truth object 字段;不得保存 role/work/memory/archive body、event body、request body、raw receipt、secret 或 adapter response |
| no hidden resolver | repository 不解析 external source、不调用 work/memory/method/governance resolver、不从 source ref 推导 safe summary |
| no hidden id | repository 不生成业务 id;id 来自 7.2 `IdentityIdGeneratorPort` 或 persistence identity 已正式定义的返回值 |
| fake parity | fake 必须实现同一 trait surface、同一 unique / version / append-only / lookup 语义,不得用私有 map 支撑正式 port 没有的读取面 |

#### 7.9.3 `GlobalMemberRepository`

```rust
/// Repository for Identity global member anchor truth.
pub trait GlobalMemberRepository {
    async fn get_member_with_version(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<Versioned<GlobalMember>>, ApplicationError>;

    async fn get_anchor_state(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<IdentityAnchorState>, ApplicationError>;

    async fn list_members(
        &self,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<GlobalMemberRef>>, ApplicationError>;

    async fn save_member(
        &self,
        member: GlobalMember,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<GlobalMemberRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_member_with_version` | establish reuse guard、read anchor、lifecycle/member dependency | `Some(Versioned<GlobalMember>)` 的 version 是后续 save expected_version 来源 | 不用 account/runtime/ProjectMember id 查询 |
| `get_anchor_state` | create guard 的 existing anchor state;query no-create | 只返回 anchor state,不隐式创建 member | 缺失时不得自动建档 |
| `list_members` | maintenance/report/query scan 的 body-free ref list | 返回 `VersionedRef<GlobalMemberRef>`;page cursor 只用于分页 | 不把 page cursor 当 truth cursor |
| `save_member` | establish、terminal hold 更新 | create 使用 `None`;更新 hold 使用 loaded version | 不释放 member ref;不自动写 lifecycle/trace/outbox |

#### 7.9.4 `GlobalLifecycleRepository`

```rust
/// Repository for Identity-owned global lifecycle state.
pub trait GlobalLifecycleRepository {
    async fn get_lifecycle_with_version(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<Versioned<GlobalLifecycleState>>, ApplicationError>;

    async fn list_lifecycles(
        &self,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<GlobalMemberRef>>, ApplicationError>;

    async fn save_lifecycle(
        &self,
        member_ref: GlobalMemberRef,
        lifecycle_state: GlobalLifecycleState,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<GlobalMemberRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_lifecycle_with_version` | establish initial lifecycle check、explicit lifecycle transition | version 是 lifecycle save expected_version 来源 | 不从 runtime disabled、ProjectMember 状态或 governance truth 推导 lifecycle |
| `list_lifecycles` | maintenance/report/query body-free scan | 返回 member ref + lifecycle version | 不做状态迁移或 stale repair |
| `save_lifecycle` | establish initial lifecycle、update lifecycle state | `member_ref` 是 lifecycle current row key;create 可 `None`;transition 必须用同一 `member_ref` 读取到的 loaded version | 不从 lifecycle_state / reason / basis / actor 推断 member;不释放 anchor;不写 governance basis body;不自动写 trace/outbox |

#### 7.9.5 `RoleCapabilityRepository`

```rust
/// Repository for Identity role/capability summaries and source snapshots.
pub trait RoleCapabilityRepository {
    async fn get_summary_with_version(
        &self,
        summary_ref: RoleCapabilitySummaryRef,
    ) -> Result<Option<Versioned<RoleCapabilitySummary>>, ApplicationError>;

    async fn find_current_summary_by_member(
        &self,
        member_ref: GlobalMemberRef,
    ) -> Result<Option<Versioned<RoleCapabilitySummary>>, ApplicationError>;

    async fn list_summaries_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<RoleCapabilitySummaryRef>>, ApplicationError>;

    async fn get_source_snapshot_with_version(
        &self,
        snapshot_ref: RoleCapabilitySourceSnapshotRef,
    ) -> Result<Option<Versioned<RoleCapabilitySourceSnapshot>>, ApplicationError>;

    async fn find_source_snapshot_by_source(
        &self,
        source_ref: RoleCapabilitySourceRef,
    ) -> Result<Option<Versioned<RoleCapabilitySourceSnapshot>>, ApplicationError>;

    async fn save_source_snapshot(
        &self,
        snapshot: RoleCapabilitySourceSnapshot,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<RoleCapabilitySourceSnapshotRef>, ApplicationError>;

    async fn save_summary(
        &self,
        summary: RoleCapabilitySummary,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<RoleCapabilitySummaryRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_summary_with_version` | update existing summary、query loaded summary | summary version 是 save expected_version 来源 | 不从 safe summary marker 推导 summary truth |
| `find_current_summary_by_member` | maintain current member role/capability | repository 返回 current summary;current 判定的持久规则留 Step 11 | 不用 member+source 拼 summary ref |
| `list_summaries_by_member` | member summary/projection/job scan | page cursor 只分页;item version 只用于 summary optimistic update | 不保存 RoleDefinition / CapabilityDefinition body |
| `get_source_snapshot_with_version` | source refresh/update snapshot | snapshot version 是 save snapshot expected_version 来源 | 不把 source version 当 optimistic version |
| `find_source_snapshot_by_source` | duplicate/source changed handling | 读取正式 source ref 对应 snapshot | 不解析 source ref 字符串;不调用 method-library resolver |
| `save_source_snapshot` | resolved/stale/unavailable/unrecognized/superseded snapshot | create `None`;update loaded version | 不保存 source/evidence body |
| `save_summary` | create/update/stale/unavailable summary | create `None`;update loaded version | 不在 repo 内判断 source usable;policy/service 已准备输入 |

#### 7.9.6 `CareerRecordRepository`

```rust
/// Repository for Identity career records. Career records are append-only truth/history objects.
pub trait CareerRecordRepository {
    async fn get_career_record(
        &self,
        record_ref: CareerRecordRef,
    ) -> Result<Option<Versioned<CareerRecord>>, ApplicationError>;

    async fn list_records_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<CareerRecordRef>>, ApplicationError>;

    async fn find_records_by_source_marker(
        &self,
        source_marker_ref: CareerSourceMarkerRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<CareerRecordRef>>, ApplicationError>;

    async fn find_duplicate_source_record(
        &self,
        source_marker_ref: CareerSourceMarkerRef,
    ) -> Result<Option<CareerRecordRef>, ApplicationError>;

    async fn list_corrections_for_record(
        &self,
        original_record_ref: CareerRecordRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<CareerRecordRef>>, ApplicationError>;

    async fn append_career_record(
        &self,
        record: CareerRecord,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<CareerRecordRef>, ApplicationError>;

    async fn save_career_record_state(
        &self,
        record: CareerRecord,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<CareerRecordRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_career_record` | correction relation read、query detail、supersede old record | returned version 用于 explanatory state update | 不保存 work body |
| `list_records_by_member` | query/projection/job list | list item version 只用于后续 targeted update | 不把 empty 当 create signal |
| `find_records_by_source_marker` | duplicate-source audit / query | source marker 是正式 duplicate key input | 不用 idempotency key、cursor 或 work body 扫描 |
| `find_duplicate_source_record` | append guard | 返回 first/current duplicate record ref;唯一性细节 Step 11 | 不在 repo 内 silently ignore duplicate append |
| `list_corrections_for_record` | correction relation query/audit | 只读取 correction refs | 不覆盖原记录 |
| `append_career_record` | append/correction/pending review record create | append-only create;不接 expected_version | 不 update/delete/reorder existing career facts |
| `save_career_record_state` | 标记旧记录 `SupersededByCorrection` 等解释性状态 | 必须来自 `get_career_record` version | 不把 correction 写成 in-place content replacement |

#### 7.9.7 `MemoryReferenceRepository`

```rust
/// Repository for Identity memory/archive reference relations.
pub trait MemoryReferenceRepository {
    async fn get_memory_reference_with_version(
        &self,
        reference_ref: MemoryReferenceRef,
    ) -> Result<Option<Versioned<MemoryReference>>, ApplicationError>;

    async fn list_references_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<MemoryReferenceRef>>, ApplicationError>;

    async fn find_reference_by_memory(
        &self,
        member_ref: GlobalMemberRef,
        memory_ref: MemoryRef,
    ) -> Result<Option<Versioned<MemoryReference>>, ApplicationError>;

    async fn find_reference_by_archive(
        &self,
        member_ref: GlobalMemberRef,
        archive_ref: ArchiveRef,
    ) -> Result<Option<Versioned<MemoryReference>>, ApplicationError>;

    async fn find_reference_by_handoff(
        &self,
        handoff_ref: ArchiveHandoffRef,
    ) -> Result<Option<Versioned<MemoryReference>>, ApplicationError>;

    async fn find_callback_target_by_handoff(
        &self,
        handoff_ref: ArchiveHandoffRef,
    ) -> Result<Option<MemoryReferenceRef>, ApplicationError>;

    async fn save_memory_reference(
        &self,
        reference: MemoryReference,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<MemoryReferenceRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_memory_reference_with_version` | relation update/query/callback loaded truth | version 是 save expected_version 来源 | 不读取 memory/archive body |
| `list_references_by_member` | member summary/projection/query | page cursor 只分页 | query miss 不创建 relation |
| `find_reference_by_memory` | duplicate relation/link/update | memory ref + member ref lookup | 不保存 memory body/embedding/index |
| `find_reference_by_archive` | archive/cold-storage relation lookup | archive ref + member ref lookup | 不保存 archive package metadata |
| `find_reference_by_handoff` | handoff state/result relation lookup | handoff marker lookup | handoff marker 不等于 delivered receipt |
| `find_callback_target_by_handoff` | callback routing into application service | body-free target ref only | callback raw body 不直接更新 truth |
| `save_memory_reference` | create/update relation state | create `None`;update loaded version | 不反写 external owner truth;不伪造 handoff delivered |

#### 7.9.8 7.3 fake / durable parity 表

| repository | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| `GlobalMemberRepository` | member ref unique;existing anchor state 可读取;save conflict 可断言 | unique key + optimistic version | fake query miss 自动建档 |
| `GlobalLifecycleRepository` | lifecycle by member unique;`save_lifecycle(member_ref, ...)` 使用显式 member key;version conflict 可断言 | member lifecycle current row/version | fake 从 member anchor 推 lifecycle;fake 从 lifecycle_state/reason/basis/actor 反推 member key |
| `RoleCapabilityRepository` | summary/snapshot version 独立;source lookup 使用 typed source ref | summary/snapshot optimistic store and source index | fake 把 source version 当 expected_version |
| `CareerRecordRepository` | append creates new record;duplicate marker lookup 稳定;state update 需 version | append-only career table + correction/source indexes | fake 覆盖旧 career record 或扫描 work body |
| `MemoryReferenceRepository` | memory/archive/handoff indexes 稳定;callback target lookup body-free | relation store + typed indexes | fake 保存 memory body/receipt body 或 callback 直改 state |

#### 7.9.9 7.3 后续承接表

| repository | Step 9 承接 | Step 10/11/13/16 承接 |
|---|---|---|
| member | establish、get anchor、terminal hold | anchor state matrix;member unique key;reuse conflict tests |
| lifecycle | initial lifecycle、explicit transition、high-risk basis save | lifecycle matrix;optimistic conflict;missing basis branch |
| role/capability | maintain summary、source changed、stale/unavailable handling | summary/source state matrix;source index;forbidden body tests |
| career | append、correction、work consumer duplicate source | append-only matrix;source unique/index;duplicate replay |
| memory | link、refresh、archive/handoff callback target | memory state matrix;handoff index;callback target tests |

#### 7.9.10 7.3 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 core truth repository | 通过 | 未写 trace/audit/history、projection/reference/outbox/result/resolver/adapter |
| 是否覆盖 member/lifecycle/role/career/memory | 通过 | 五组 repository trait 均已写入 |
| 是否包含读取面和保存面 | 通过 | 每组均有 versioned read/list/lookup 与 save/append |
| 是否闭合 version 来源 | 通过 | mutation save 的 expected_version 来自 versioned read;career append-only create 不使用 expected_version |
| 是否承接 UoW | 通过 | 所有 save/append/update 接收 `&dyn IdentityUnitOfWork` |
| 是否避免 fake 私有补口 | 通过 | §7.9.8 固定 fake/durable parity |
| 是否越过后续 Step | 未越过 | 未写 DTO、flow、state matrix、DDL、resolver、projection、outbox/handoff |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.4` | 7.3 已审核通过;7.4 已写入并停审 |

#### 7.9.11 7.3 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| member create | `get_member_with_version` 确认缺失后 `save_member(member, None, uow)` | query miss 时 repository 自动创建 member |
| anchor hold | loaded member version + `save_member(updated, Some(version), uow)` | terminal lifecycle 直接释放 / 复用 member ref |
| lifecycle | `get_lifecycle_with_version(member)` 后保存 transition | 从 runtime disabled 推导 lifecycle paused |
| role source | `find_source_snapshot_by_source(source_ref)` 用 typed source ref lookup | 解析 source ref 字符串或保存 role definition body |
| source version | source version 只进 snapshot 字段 | source version 当 `IdentityVersion` expected_version |
| career append | `append_career_record(new_record, uow)` 追加新记录 | update 覆盖旧 career record 内容 |
| career duplicate | `find_duplicate_source_record(source_marker)` | 用 idempotency key 或 work event body 查 duplicate |
| memory link | `find_reference_by_memory(member, memory_ref)` 后 save relation | 保存 memory text、embedding、archive package |
| callback target | `find_callback_target_by_handoff(handoff_ref)` 返回 body-free ref | callback raw receipt body 直接推进 relation state |
| fake parity | fake 按同一 trait 和 index 行为返回 conflict/duplicate | fake 用额外私有 map 或默认 valid 让测试通过 |

### 7.10 7.4 append-only / audit / history / trace repositories

本批只定义 append-only / audit / history / trace repository port。Step 6 已明确 `HistoryRecord` 并入 `IdentityTraceRecord`,因此本批不新增第二套 history truth;history 口径只通过 `IdentityTraceRecord`、`AuditTrail`、career append truth repository 的既有读取面和 `TraceHandoffIntent` 状态历史读取来表达。本批不写 projection/read/reference/report、outbox/result/idempotency、external resolver/publisher/handoff adapter、DTO、flow、state matrix 或 DDL。

所有 trait 归 `identity-application` 定义,由 `identity-infra` durable / fake adapter 实现。Application service 是唯一调用方。API、worker、jobs、domain object、contracts 和 adapter implementation 不得绕过 application 直接 append trace/audit/history。

#### 7.10.1 7.4 capability / 接缝清单

| repository family | 必须支撑 | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| accepted trace append/read | append accepted trace、get by ref、list by member/subject/cursor/change kind、correction supersession update | accepted command services、trace query service、handoff prepare service | infra trace repo / fake | §6.3 `IdentityTraceRecord`;§6.8 trace/audit field source | Step 9 accepted side effect;Step 11 append order;Step 15 audit |
| audit trail timeline | get/create audit trail by audit subject、append audit entry、read by scope/cursor | accepted command services、audit query service | infra audit repo / fake | §6.3 `AuditTrail` / `AuditTrailEntry` | Step 8 audit query DTO;Step 9 accepted/audit query;Step 11 audit index |
| trace correction history | append correction trace、mark old trace superseded,read supersession chain | correction command services、audit query service | infra trace repo / fake | §6.3 trace correction append-only | Step 9 correction flow;Step 10 trace correction matrix |
| handoff intent history | get/save handoff intent with version、list by member/target/state、list by trace/audit ref | prepare handoff、handoff callback/job service、audit/handoff query service | infra handoff intent repo / fake | §6.5 `TraceHandoffIntent`,`HandoffState` | Step 9 handoff flow;Step 11 handoff persistence |
| marker trace append | append consumer/job/reference/handoff marker trace when later flow requires trace marker | consumer/job/reference marker services | infra trace repo / fake | §6.8 marker trace subject;7.1 marker mapper | Step 9 consumer/job marker;Step 15 observability |

#### 7.10.2 append-only / audit / history 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| no second history truth | 不定义 `HistoryRecordRepository`;accepted change history 统一由 `IdentityTraceRecordRepository` 承接 |
| append-only trace | `append_trace_record(...)` 只创建新 trace;不得 update/delete/reorder trace 内容 |
| correction | correction 必须追加新的 trace record,旧 trace 只能通过 explicit supersession update 指向 correction trace |
| audit trail | audit trail 可以维护 timeline aggregate / entry index,但不得修复 trace、不得保存 raw log/body |
| subject source | accepted trace/audit subject 必须来自 7.1 `IdentityTruthChangeSubjectMapper`;marker trace subject 必须来自 `IdentityMarkerSubjectMapper` |
| cursor source | accepted trace 使用 7.2 truth cursor;consumer/job/reference marker trace 使用 reference marker cursor或后续正式 job/projection cursor |
| version source | audit trail / handoff intent 状态更新必须来自 versioned read;trace append create 不接 expected_version |
| UoW | 所有 append/update/save 方法接收 `uow: &dyn IdentityUnitOfWork`;read/list 不接 UoW |
| body-free | trace/audit/handoff history 只保存 safe marker/ref、change kind、cursor、actor/time、issue/receipt marker;不得保存 external body、raw log、debug dump、receipt body、archive package 或 secret |
| fake parity | fake 必须实现同一 append-only、subject index、cursor order、version conflict 和 supersession chain 语义;不得扫描私有 body 或私造 subject/view/ref |

#### 7.10.3 `IdentityTraceRecordRepository`

```rust
/// Append-only repository for accepted Identity trace/history records.
pub trait IdentityTraceRecordRepository {
    async fn get_trace_record(
        &self,
        trace_record_ref: IdentityTraceRecordRef,
    ) -> Result<Option<Versioned<IdentityTraceRecord>>, ApplicationError>;

    async fn list_trace_records_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_trace_records_by_subject(
        &self,
        subject_ref: IdentityTraceSubjectRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_trace_records_after_cursor(
        &self,
        subject_ref: IdentityTraceSubjectRef,
        after_cursor: Option<IdentityTruthCursor>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_trace_records_by_change_kind(
        &self,
        member_ref: GlobalMemberRef,
        change_kind_ref: IdentityChangeKindRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn append_trace_record(
        &self,
        trace_record: IdentityTraceRecord,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityTraceRecordRef>, ApplicationError>;

    async fn mark_trace_superseded_by_correction(
        &self,
        trace_record: IdentityTraceRecord,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityTraceRecordRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / cursor / subject 语义 | 禁止事项 |
|---|---|---|---|
| `get_trace_record` | trace detail、correction loaded old trace、handoff trace selection | returned version 只用于 supersession marker update | 不把 missing trace 自动补写 |
| `list_trace_records_by_member` | member trace query、audit/handoff preparation | page cursor 只分页;顺序规则 Step 11 固定 | 不读取 member truth 后修复 trace |
| `list_trace_records_by_subject` | audit subject timeline、accepted side effect verification | subject 必须来自 formal mapper | 不解析 subject string |
| `list_trace_records_after_cursor` | incremental audit/handoff/job scan | `after_cursor` 是 truth/reference marker cursor,不是 page cursor | 不用 timestamp/version/digest 当 cursor |
| `list_trace_records_by_change_kind` | trace query/report preparation | change kind 是 body-free marker | 不保存 reason body |
| `append_trace_record` | accepted trace、marker trace、correction trace append | create-only;trace id 来自 id generator;source cursor 已由 UoW 正式分配 | 不 update/delete/reorder existing trace |
| `mark_trace_superseded_by_correction` | correction append 后标记旧 trace | 必须先 `get_trace_record` 取得 version;只写 superseded marker | 不覆盖旧 trace 内容、不删除旧 trace |

#### 7.10.4 `IdentityAuditTrailRepository`

```rust
/// Repository for Identity audit timeline aggregates and body-free audit entries.
pub trait IdentityAuditTrailRepository {
    async fn get_audit_trail_with_version(
        &self,
        audit_trail_ref: AuditTrailRef,
    ) -> Result<Option<Versioned<AuditTrail>>, ApplicationError>;

    async fn find_audit_trail_by_subject(
        &self,
        audit_subject_ref: IdentityAuditSubjectRef,
    ) -> Result<Option<Versioned<AuditTrail>>, ApplicationError>;

    async fn list_audit_entries(
        &self,
        audit_trail_ref: AuditTrailRef,
        audit_scope_ref: AuditScopeRef,
        cursor_ref: Option<AuditCursorRef>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<AuditTrailEntry>, ApplicationError>;

    async fn save_audit_trail(
        &self,
        audit_trail: AuditTrail,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<AuditTrailRef>, ApplicationError>;

    async fn append_audit_entry(
        &self,
        audit_trail_ref: AuditTrailRef,
        entry: AuditTrailEntry,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<AuditTrailRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_audit_trail_with_version` | loaded trail update、query by ref | version 是 save/append expected_version 来源 | 不从 trace subject 强转 audit ref |
| `find_audit_trail_by_subject` | accepted flow get-or-create audit trail | audit subject 来自 7.1 mapper;missing 时由 service 使用 id generator 创建 | 不在 repository 内隐式创建 |
| `list_audit_entries` | audit query pagination/scope filter | `AuditCursorRef` 只表达 audit read cursor;repository page cursor 只分页 | audit cursor 不等于 truth cursor |
| `save_audit_trail` | create empty trail 或保存 assembled trail marker | create `None`;update loaded version | 不修复 missing trace;不保存 raw log |
| `append_audit_entry` | accepted trace 后追加 entry | expected_version 来自 loaded trail;entry 引用正式 trace ref | 不保存 trace body、debug body 或 external payload |

#### 7.10.5 `IdentityTraceHistoryRepository`

本 repository 是对 trace/history 的 body-free 读取聚合面,不是第二套 persistence truth。它只能从 `IdentityTraceRecord` 和 `AuditTrailEntry` 的正式存储读取历史链,用于后续 query/report/handoff preparation。若后续 Step 9 发现某条 flow 需要独立 history record schema,必须回 Step 6 先撤销“HistoryRecord 并入 IdentityTraceRecord”的结论,不能在 Step 7 私增对象。

```rust
/// Read-only history facade over IdentityTraceRecord and AuditTrailEntry material.
pub trait IdentityTraceHistoryRepository {
    async fn list_history_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_history_by_subject(
        &self,
        subject_ref: IdentityTraceSubjectRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_history_between_cursors(
        &self,
        subject_ref: IdentityTraceSubjectRef,
        after_cursor: Option<IdentityTruthCursor>,
        before_cursor: Option<IdentityTruthCursor>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;

    async fn list_supersession_chain(
        &self,
        trace_record_ref: IdentityTraceRecordRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityTraceRecordRef>>, ApplicationError>;
}
```

| 函数 | 使用场景 | 读取语义 | 禁止事项 |
|---|---|---|---|
| `list_history_by_member` | member history query/report | 等价于 trace record by member 的 read facade | 不新建 history row |
| `list_history_by_subject` | subject timeline query/audit | subject 来自 formal mapper | 不从 raw subject 字符串查询 |
| `list_history_between_cursors` | incremental report/handoff selection | cursor 是正式 truth/reference marker cursor | 不用 audit cursor/page cursor 替代 |
| `list_supersession_chain` | correction explainability | 只读取 trace supersession refs | 不修改旧 trace |

#### 7.10.6 `TraceHandoffIntentRepository`

`TraceHandoffIntent` 是 6.5 的 handoff intent truth/state object。本批只定义 intent repository 与状态历史读取面;实际 handoff adapter、target resolver、publisher / delivery port、callback DTO 和 retry job 留 7.7 / Step 8 / Step 9 / Step 14。Repository 不得把 adapter HTTP 2xx、job completed log 或 request sent 伪装为 `HandoffState::Delivered`;delivered 必须由 formal receipt marker 驱动。

```rust
/// Repository for trace/audit/archive handoff intents and their state history.
pub trait TraceHandoffIntentRepository {
    async fn get_handoff_intent_with_version(
        &self,
        intent_ref: TraceHandoffIntentRef,
    ) -> Result<Option<Versioned<TraceHandoffIntent>>, ApplicationError>;

    async fn list_handoff_intents_by_member(
        &self,
        member_ref: GlobalMemberRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<TraceHandoffIntentRef>>, ApplicationError>;

    async fn list_handoff_intents_by_trace(
        &self,
        trace_record_ref: IdentityTraceRecordRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<TraceHandoffIntentRef>>, ApplicationError>;

    async fn list_handoff_intents_by_audit_trail(
        &self,
        audit_trail_ref: AuditTrailRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<TraceHandoffIntentRef>>, ApplicationError>;

    async fn list_handoff_intents_by_target(
        &self,
        target_ref: HandoffTargetRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<TraceHandoffIntentRef>>, ApplicationError>;

    async fn list_retryable_handoff_intents(
        &self,
        target_ref: Option<HandoffTargetRef>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<TraceHandoffIntentRef>>, ApplicationError>;

    async fn save_handoff_intent(
        &self,
        intent: TraceHandoffIntent,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<TraceHandoffIntentRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / lookup 语义 | 禁止事项 |
|---|---|---|---|
| `get_handoff_intent_with_version` | callback/job update、query detail | version 是 state update expected_version 来源 | 不调用 handoff adapter |
| `list_handoff_intents_by_member` | member handoff query/report | page cursor 只分页 | 不读取 archive package |
| `list_handoff_intents_by_trace` | trace audit/handoff explainability | trace ref 来自 loaded trace or request | 不创建 missing intent |
| `list_handoff_intents_by_audit_trail` | audit handoff query | audit trail ref 来自 prepared context | 不从 audit subject 拼 trail ref |
| `list_handoff_intents_by_target` | target operations view | target ref 来自 config/binding/request | 不解析 target path/bucket |
| `list_retryable_handoff_intents` | retry job selection | retryable 只由 `HandoffState` 判断;job flow 留 Step 9 | 不定义 backoff schedule |
| `save_handoff_intent` | prepare pending intent、callback/job state update | create `None`;update loaded version | 不伪造 delivered;不保存 receipt body |

#### 7.10.7 fake / durable parity 表

| repository | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| `IdentityTraceRecordRepository` | append 顺序稳定;by member/by subject/by cursor/by change kind index 一致;supersession conflict 可断言 | append-only table + subject/member/cursor indexes + optimistic supersession update | fake 覆盖旧 trace 或用 raw body 搜索 |
| `IdentityAuditTrailRepository` | subject lookup、trail version、entry append、audit cursor pagination 可断言 | audit trail unique subject index + optimistic entry append | fake 缺 trail 时自动创建且跳过 service id source |
| `IdentityTraceHistoryRepository` | 只读 facade 与 trace repo 返回同一 refs/order | durable read facade 基于同一 trace/audit storage | 新建第二套 history store |
| `TraceHandoffIntentRepository` | pending/retryable/delivered state version conflict、trace/audit/target indexes 等价 | handoff intent optimistic store + typed indexes | fake 用 adapter success 或 job log 标记 delivered |

#### 7.10.8 7.4 后续承接表

| 7.4 repository | Step 9 承接 | Step 10/11/12/13/15/16 承接 |
|---|---|---|
| trace record | accepted command append trace、marker trace、correction trace | trace append-only matrix;transaction order;forbidden body tests;observability business trace |
| audit trail | accepted audit entry、audit query loaded trail | audit read surface;trail subject unique;not visible/degraded surface |
| trace history facade | history query/report/handoff selection | no second history truth audit;cursor range tests |
| handoff intent | prepare handoff、handoff callback/job update、retryable listing | handoff state matrix;fake delivered rejection;receipt marker/body-free tests |

#### 7.10.9 7.4 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 append-only / audit / history / trace repositories | 通过 | 未写 projection/read/reference/report、outbox/result/idempotency、external adapter |
| 是否避免新造 `HistoryRecord` | 通过 | §7.10.5 明确 history 是 trace/audit read facade |
| 是否承接 subject mapper | 通过 | accepted trace/audit 用 truth subject mapper;marker trace 用 marker mapper |
| 是否闭合 cursor 来源 | 通过 | accepted trace 用 truth cursor;marker trace 用 reference marker/job/projection formal cursor |
| 是否闭合 version 来源 | 通过 | trace append create-only;supersession/audit/handoff update 均来自 versioned read |
| 是否保持 body-free | 通过 | 禁止 raw log、external body、debug dump、receipt body、archive package 和 secret |
| 是否覆盖 fake/durable parity | 通过 | §7.10.7 固定 append-only/index/version/conflict 等价 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.5` | 7.4 已审核通过;7.5 已写入并停审 |

#### 7.10.10 7.4 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| accepted trace | service 从 mapper 获取 subject,从 UoW 获取 truth cursor 后 `append_trace_record` | repository 根据 member id 拼 subject 并补 cursor |
| marker trace | consumer/job path 通过 marker mapper 生成 trace subject | 用 event topic、source string、dedupe key 当 subject |
| trace correction | 追加 correction trace,再用 loaded old trace version 标记 superseded | 覆盖或删除旧 trace |
| audit get-or-create | service `find_audit_trail_by_subject`,missing 时用 id generator 创建并 save | repository 缺失时隐式创建 audit trail |
| audit cursor | `AuditCursorRef` 只用于 audit read pagination | 用 audit cursor 当 accepted truth cursor |
| history | `IdentityTraceHistoryRepository` 只返回 trace refs/order | 新建 `HistoryRecord` truth 和第二套持久表 |
| handoff intent | pending intent 保存 trace refs、target/scope 和 safe material marker | 保存 archive package、receipt body 或 adapter raw response |
| delivered | callback/job 提供 formal receipt marker 后更新 `HandoffState::Delivered` | HTTP 2xx、request sent 或 job success log 就标 delivered |
| fake parity | fake 与 durable 使用同一 subject/index/version 语义 | fake 私有 map 补 trail/view/subject 或默认 valid |

### 7.11 7.5 projection / read / reference / report repositories

本批定义 projection / read / reference / report repository port,目标是把 Step 6.3/6.4/6.8/6.10 中已要求的 stable view lookup、read subject/scope、projection freshness、reference bundle、typed sidecar expected_version、maintenance target expansion 和 report-only reconciliation 读取/保存面闭合。本批只写 repository / read-side port surface,不写 external resolver / publisher / handoff adapter、outbox/result/idempotency、DTO、flow、state matrix 或 DDL。

所有 trait 归 `identity-application` 定义,由 `identity-infra` durable / fake adapter 实现。Application service / query service / maintenance job service 是唯一调用方。Query service 不得通过 repository miss 触发 rebuild、refresh、repair 或 truth mutation。

#### 7.11.1 7.5 capability / 接缝清单

| repository / read family | 必须支撑 | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| projection lookup/read/state | stable member summary view lookup、projection state versioned read/save、member summary rebuild plan、stale mark、affected target expansion | accepted command services、query service、rebuild job service | infra projection repo / fake | §6.3 `MemberSummaryView`;§6.4 `ProjectionState`;§6.8 view lookup | Step 9 query/rebuild;Step 11 lookup/index |
| read visibility resolution | request/view/report -> read subject + scope + access summary、visibility decision optional save/read | query service、handoff/report read service | infra read resolver/read store / fake | §6.3 `VisibilityPolicy`;§6.8 read subject/scope | Step 8 query DTO;Step 9 query precheck;Step 12 not visible/degraded |
| reference state and typed sidecar | external reference bundle versioned read/save、owner lookup、typed sidecar read/save using same bundle version | consumer/reference refresh/job services | infra reference repo / fake | §6.4 `ReferenceResolutionState`;§6.8 external ref boundary | Step 9 consumer/refresh;Step 11 expected_version |
| maintenance expansion / inspection | maintenance scope -> projection/reference/report target refs、pending rebuild/refresh scans、target marker -> typed loaded state context | job services、reconciliation service | infra maintenance repo / fake | §6.4 `MaintenanceScopeRef`,`IdentityMaintenanceTargetRef`,`IdentityMaintenanceInspectionContext` | Step 9 maintenance jobs;Step 14 config binding |
| reconciliation report | report versioned read/save、list by scope/target/state、finding issue lookup | reconciliation job/query service | infra report repo / fake | §6.4 `ReconciliationReport` | Step 8 report DTO;Step 9 reconciliation;Step 11 report table |

#### 7.11.2 projection/read/reference/report 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| stable view lookup | query 必须先通过 lookup/read port 得到 `MemberSummaryViewRef` 或正式 missing/degraded surface;不得临时拼 `member-summary:<id>` |
| projection no-write query | query 只读取 view/projection state/visibility;missing/stale/degraded 不触发 rebuild、refresh 或 mark fresh |
| read subject/scope source | visibility precheck 必须从 request、loaded view/report、resolver summary 或 formal read mapper 获得 `IdentityReadSubjectRef` + `VisibilityScopeRef` |
| reference bundle key | reference state 和 typed sidecar save 的 expected_version 以同一 `ExternalReferenceRef` bundle 的 versioned read 为来源 |
| source version separated | `ExternalSourceVersionRef` 只表达外部源版本;不得当 `IdentityVersion` expected_version |
| typed sidecar | role/work/memory/governance/evidence safe sidecar 只保存 refs/summary markers,不保存 external body |
| maintenance report-only | maintenance expansion 只能返回 projection/reference/report target;target inspection 必须返回 typed loaded maintenance context;不得返回 core truth write target |
| UoW | projection/reference/report save/update 接收 `uow: &dyn IdentityUnitOfWork`;read/list/lookup 不接 UoW |
| fake parity | fake 与 durable 必须使用同一 lookup/index/version/missing/degraded 语义;fake 不得私下扫描 body 或拼 view/ref |

#### 7.11.3 `IdentityProjectionRepository`

```rust
/// Repository for Identity projections, stable view lookup, and projection freshness state.
pub trait IdentityProjectionRepository {
    async fn find_member_summary_view_ref(
        &self,
        member_ref: GlobalMemberRef,
        visibility_scope_ref: VisibilityScopeRef,
    ) -> Result<Option<MemberSummaryViewRef>, ApplicationError>;

    async fn get_member_summary_view(
        &self,
        view_ref: MemberSummaryViewRef,
    ) -> Result<Option<MemberSummaryView>, ApplicationError>;

    async fn get_projection_state_with_version(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> Result<Option<Versioned<ProjectionState>>, ApplicationError>;

    async fn find_projection_state_ref(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> Result<Option<ProjectionStateRef>, ApplicationError>;

    async fn list_projection_states(
        &self,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ProjectionStateRef>>, ApplicationError>;

    async fn list_stale_projection_states(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ProjectionStateRef>>, ApplicationError>;

    async fn get_projection_source_cursor(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> Result<Option<IdentityProjectionCursorRef>, ApplicationError>;

    async fn get_member_summary_rebuild_plan(
        &self,
        projection_ref: IdentityProjectionRef,
    ) -> Result<Option<MemberSummaryProjectionRebuildPlan>, ApplicationError>;

    async fn expand_affected_projection_refs(
        &self,
        subject_refs: IdentityAcceptedSubjectRefs,
    ) -> Result<IdentityProjectionRefSet, ApplicationError>;

    async fn save_member_summary_view(
        &self,
        view: MemberSummaryView,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<MemberSummaryViewRef>, ApplicationError>;

    async fn save_projection_state(
        &self,
        state: ProjectionState,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<ProjectionStateRef>, ApplicationError>;

    async fn mark_projection_stale(
        &self,
        projection_ref: IdentityProjectionRef,
        state: ProjectionState,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<ProjectionStateRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | lookup / version 语义 | 禁止事项 |
|---|---|---|---|
| `find_member_summary_view_ref` | query by member/scope | stable index lookup over persisted `(member_ref, visibility_scope_ref)`;missing 返回 `None` 由 query surface 处理 | 不拼 view ref;不扫描 projection body;不从 `visibility_result_ref` 反推 scope |
| `get_member_summary_view` | query load view | view ref 必须来自 lookup/request/formal result | missing 不触发 rebuild |
| `get_projection_state_with_version` | stale mark/rebuild update | version 是 projection state save expected_version 来源 | projection cursor 不当 version |
| `find_projection_state_ref` | query/report lightweight lookup | 只返回 state ref | 不创建 missing state |
| `list_projection_states` | maintenance scan | page cursor 只分页 | 不全表 repair truth |
| `list_stale_projection_states` | rebuild job selection | stale 判定来自 `ProjectionState` | 不在 query path 调用来 rebuild |
| `get_projection_source_cursor` | rebuild job before `mark_rebuilt(...)` | cursor 来自 projection builder / committed truth scan / projection source cursor store | 不用 page cursor、timestamp、truth cursor、job cursor 或 optimistic version 代替 |
| `get_member_summary_rebuild_plan` | rebuild member summary projection body | projection catalog returns member ref and formal visibility scopes for this target | 不从 projection ref、view ref、config string、first existing view 或 fake private map 推 visibility scope |
| `expand_affected_projection_refs` | accepted side effect mark stale | subject refs 来自 7.1 mapper | 不从 subject string 前缀推 affected views |
| `save_member_summary_view` | projection builder/rebuild job save view | create `None`;update loaded version;writes current `(view.member_ref, view.visibility_scope_ref) -> view.view_ref` lookup index | view 必须携带 `visibility_scope_ref`;不保存 forbidden body;不得保存无 scope 的 current view |
| `save_projection_state` | create/update projection state | create `None`;update loaded version | 不修改 core truth |
| `mark_projection_stale` | accepted truth side effect | expected_version 来自 loaded projection state;source cursor 已在 state 内正式给出 | 不用 timestamp/idempotency key 当 stale cursor |

#### 7.11.4 `IdentityReadVisibilityRepository`

本 repository 只保存和读取 visibility decision/read mapping 的 application-side material。外部授权、consumer entitlement、adapter availability resolver 留 7.7;本批只定义 query path 需要的正式 read subject/scope/access summary 读取面,防止 handler/service 从 route string、member id 或 view ref 临时推断。

所有 `resolve_*_read(...)` 的 `Some(IdentityVisibilityAccessSummary)` 必须包含 `read_subject_ref`、`scope_ref`、`visibility_result_ref`、`access_state` 和 redacted / not-visible surface 所需的 `redaction_marker_ref`。当 `access_state = Degraded | Unavailable` 时,同一个 summary 还必须包含 `degraded_marker_ref` 与 `degraded_kind`。`read_subject_ref` 是 query service 构造 `IdentityVisibilityDecision.read_subject_ref` 的唯一正式来源;`redaction_marker_ref` 是 query service 构造 `IdentityVisibilityDecision.redaction_marker_ref` 与 `IdentityQuerySurface.visibility.redaction_marker_ref` 的唯一正式来源;`degraded_marker_ref` / `degraded_kind` 是 query service 构造 public degraded surface 的唯一正式来源。repository / adapter 内部可调用 formal read subject mapper 和 redaction matrix / prepared context,或使用 request-scoped typed ref、loaded view/report typed ref 生成 canonical read subject;application service、handler 和 fake 不得从 route、member id、view id、report id、topic key、scope、redaction profile、result ref、error string 或字符串反推。

Resolver `None` rule:

| resolver result | 正式含义 | query service 处理 |
|---|---|---|
| `Some(access_state = Visible | Redacted | NotVisible)` | 已解析 read subject/scope/visibility result,可继续由 `VisibilityPolicy` 分类。 | 复制 summary 中的 subject/scope/result/redaction marker;不得重建 marker。 |
| `Some(access_state = Degraded | Unavailable)` | 已解析 read subject/scope,但 dependency/source/projection/policy 只能返回 degraded-like safe surface。 | 复制 summary 中的 visibility result、degraded marker 和 degraded kind,返回 `Degraded` / degraded-like surface。 |
| `None` | resolver 无法形成 canonical read subject / scope,或 request selector malformed / unsupported。 | 返回 entry validation / malformed query surface;不得合成 `VisibilityResultRef`、`IdentityDegradedMarkerRef`、`IdentityVisibilityDecision` 或默认 visible。 |

```rust
/// Read-side port for Identity visibility mapping and optional visibility decision material.
pub trait IdentityReadVisibilityRepository {
    async fn resolve_member_summary_read(
        &self,
        member_ref: GlobalMemberRef,
        view_ref: Option<MemberSummaryViewRef>,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_trace_read(
        &self,
        subject_ref: IdentityTraceSubjectRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_trace_member_page_read(
        &self,
        member_ref: GlobalMemberRef,
        change_kind_ref: Option<IdentityChangeKindRef>,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_audit_read(
        &self,
        audit_subject_ref: IdentityAuditSubjectRef,
        audit_scope_ref: AuditScopeRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_report_read(
        &self,
        report_ref: ReconciliationReportRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_reconciliation_scope_read(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_projection_state_read(
        &self,
        projection_ref: IdentityProjectionRef,
        projection_state_ref: Option<ProjectionStateRef>,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_reference_state_read(
        &self,
        external_reference_ref: ExternalReferenceRef,
        owner_ref: Option<IdentityReferenceOwnerRef>,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_outbox_record_read(
        &self,
        outbox_ref: Option<IdentityOutboxRecordRef>,
        subject_ref: Option<IdentityOutboxSubjectRef>,
        topic_key_ref: Option<TopicKeyRef>,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_outbox_trace_page_read(
        &self,
        trace_record_ref: IdentityTraceRecordRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn resolve_handoff_intent_read(
        &self,
        intent_ref: TraceHandoffIntentRef,
        consumer_ref: ConsumerRef,
        visibility_context_ref: VisibilityContextRef,
    ) -> Result<Option<IdentityVisibilityAccessSummary>, ApplicationError>;

    async fn get_visibility_decision(
        &self,
        visibility_result_ref: VisibilityResultRef,
    ) -> Result<Option<IdentityVisibilityDecision>, ApplicationError>;

    async fn save_visibility_decision(
        &self,
        decision: IdentityVisibilityDecision,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityVisibilityDecisionRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | read subject/scope 语义 | 禁止事项 |
|---|---|---|---|
| `resolve_member_summary_read` | member summary query precheck | returns access summary containing read subject/scope/result/redaction marker refs;`read_subject_ref` and `redaction_marker_ref` are copied into `IdentityVisibilityDecision` / public surface | 不从 route/member string 拼 subject、scope 或 redaction marker |
| `resolve_trace_read` | trace query precheck | trace subject 来自 7.1 mapper or request-loaded trace;resolver returns canonical read subject/scope/access summary | 不把 trace subject 强转 audit subject;service 不从 trace ref 拼 read subject |
| `resolve_trace_member_page_read` | `ReadIdentityTrace` selector `ByMember` / `ByMemberAndChangeKind` page-level precheck and empty / first-missing surface | member trace page read subject / scope / result marker comes from formal visibility/read mapper inside the port;`change_kind_ref` narrows scope when present | service 不从 member ref、change kind、page cursor、first trace ref、repository empty result 或 fake rule 拼 page visibility marker |
| `resolve_audit_read` | audit query precheck | audit subject/scope 均为 typed input;resolver returns canonical read subject/scope/access summary | not visible 不当 not found;service 不从 audit subject 字符串切 read subject |
| `resolve_report_read` | reconciliation report query precheck | report ref 必须来自 repository/result | 不从 report id 拼 scope |
| `resolve_reconciliation_scope_read` | reconciliation report list precheck | maintenance scope 来自 query request/job report scope;resolver 返回 scope-level read subject/scope/access summary | 不先扫描 report store 再推断 caller 是否可见该 scope |
| `resolve_projection_state_read` | `GetProjectionState` precheck | projection ref 来自 query request;optional state ref 只能来自 repository lookup / request;resolver 返回 read subject/scope/access summary | 不从 projection ref string、state ref string、cursor 或 member id 推导 visibility scope |
| `resolve_reference_state_read` | `GetReferenceResolutionState` precheck | external reference ref 和 optional owner ref 来自 query request / loaded reference state;resolver 返回 body-free access summary | 不调用 external resolver;不把 business source ref 或 owner ref 当 visibility scope |
| `resolve_outbox_record_read` | `ListPendingIdentityOutbox` / `GetIdentityOutboxState` precheck | single read 使用 outbox ref;list read 可用 formal subject/topic filter;resolver 返回 operations/outbox read subject and scope | 不读取 outbox payload body;不把 topic string、broker route 或 record id 拼 visibility subject |
| `resolve_outbox_trace_page_read` | `ListPendingIdentityOutbox` selector `ByTrace` page-level precheck and empty surface | trace page read subject/scope/result marker comes from formal trace-outbox relation visibility mapper inside the port;only authorizes listing relation by trace before any outbox item is available | 不读取 trace body/outbox payload;service 不从 trace ref、page cursor、repository empty result、first outbox ref 或 fake rule 拼 page visibility marker |
| `resolve_handoff_intent_read` | `GetTraceHandoffState` precheck | intent ref 来自 query request;resolver 返回 handoff read subject/scope/access summary | 不读取 receipt body、target path、archive package 或 adapter state |
| `get_visibility_decision` | duplicate/query diagnostics/read assembly | visibility result ref 来自 access summary/policy | 不调用 external auth |
| `save_visibility_decision` | optional query/report decision material | create `None`;update loaded version if present | query 不写 truth;不保存 consumer private body |

Operations and propagation query visibility rules:

- Maintenance / operations queries that expose `ProjectionState`, `ReferenceResolutionState`, `ReconciliationReport`, `IdentityOutboxRecord` or `TraceHandoffIntent` must call the matching resolver before `VisibilityPolicy`.
- `ReadReconciliationReport` scope listing must call `resolve_reconciliation_scope_read(...)` before `list_reports_by_scope(...)`;single report reads must additionally call `resolve_report_read(...)` for the loaded `report_ref`.
- `ListPendingIdentityOutbox` selector `ByTrace` must call `resolve_outbox_trace_page_read(...)` before repository list so a true empty page can still return `Empty` with formal `visibility_result_ref`;this page summary does not replace per-listed-ref or loaded-record visibility checks.
- Resolver output is only `IdentityVisibilityAccessSummary` with `read_subject_ref`, `scope_ref`, `visibility_result_ref`, optional `redaction_marker_ref`, and degraded/unavailable 时必填的 `degraded_marker_ref` / `degraded_kind`;it must not return projection body,reference safe summary body,outbox payload,topic binding secret,handoff receipt body,target path or archive package.
- Query services may load the target object after resolver precheck and may use loaded fields only for consistency checks and view assembly. They must not derive read subject/scope from loaded object when resolver is missing.
- `None` from these resolvers maps only to entry validation / malformed query surface in Step 8/9/12;dependency unavailable,source unavailable,projection unavailable and policy degraded must be `Some(IdentityVisibilityAccessSummary)` with degraded markers. `None` is never treated as visible by default and never authorizes service-side synthetic markers.
- Fake and durable adapters must use the same typed ref and index rules. Fake must not authorize operations/outbox/handoff query by string prefixes,topic names,raw route paths or private maps.

#### 7.11.5 `IdentityReferenceStateRepository`

Reference repository 以 `ExternalReferenceRef` 作为 bundle key。所有 typed sidecar 保存必须显式接收同一个 `ExternalReferenceRef` 与该 bundle 的 `IdentityVersion`,避免把 business `IdentitySourceRef`、safe summary ref 或 external source version 当作 persistence expected_version。

```rust
/// Repository for external reference resolution bundles and typed sidecar refs.
pub trait IdentityReferenceStateRepository {
    async fn get_reference_state_with_version(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> Result<Option<Versioned<ReferenceResolutionState>>, ApplicationError>;

    async fn find_reference_state_ref(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> Result<Option<ReferenceResolutionStateRef>, ApplicationError>;

    async fn list_reference_states_by_owner(
        &self,
        owner_ref: IdentityReferenceOwnerRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReferenceResolutionStateRef>>, ApplicationError>;

    async fn list_reference_states_by_kind(
        &self,
        reference_kind: ExternalReferenceKind,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReferenceResolutionStateRef>>, ApplicationError>;

    async fn list_stale_reference_states(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReferenceResolutionStateRef>>, ApplicationError>;

    async fn get_typed_sidecar_refs(
        &self,
        reference_ref: ExternalReferenceRef,
    ) -> Result<ExternalReferenceTypedSidecarRefs, ApplicationError>;

    async fn save_reference_state(
        &self,
        state: ReferenceResolutionState,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<ReferenceResolutionStateRef>, ApplicationError>;

    async fn save_typed_sidecar_refs(
        &self,
        reference_ref: ExternalReferenceRef,
        sidecar_refs: ExternalReferenceTypedSidecarRefs,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<ReferenceResolutionStateRef>, ApplicationError>;
}
```

```rust
/// Body-free typed sidecar refs attached to a single ExternalReferenceRef bundle.
pub struct ExternalReferenceTypedSidecarRefs {
    pub role_capability_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub career_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub memory_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub governance_basis_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub evidence_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
}

/// Safe resolver output for one ExternalReferenceRef bundle.
pub struct ExternalReferenceResolutionOutcome {
    pub state: ReferenceResolutionState,
    pub typed_sidecar_refs: Option<ExternalReferenceTypedSidecarRefs>,
}
```

| 函数 | 使用场景 | reference / version 语义 | 禁止事项 |
|---|---|---|---|
| `get_reference_state_with_version` | refresh/update/typed sidecar save precheck | returned version 是 `save_reference_state` / `save_typed_sidecar_refs` expected_version 来源 | 不用 source version 当 expected_version |
| `find_reference_state_ref` | query/report lightweight lookup | only returns state ref | missing 不创建 reference bundle |
| `list_reference_states_by_owner` | owner query/report/refresh scan | owner ref 来自 local typed owner mapper | 不从 external ref 推 owner |
| `list_reference_states_by_kind` | maintenance scan | kind 是 enum,不是 string prefix | 不全表 body scan |
| `list_stale_reference_states` | refresh job selection | stale 来自 `ReferenceResolutionState` | query 不触发 refresh |
| `get_typed_sidecar_refs` | loaded reference query/report | sidecar refs 都属于同一 reference bundle | 不保存 external body |
| `save_reference_state` | create/update resolution state | create `None`;update loaded version | 不修复 external truth |
| `save_typed_sidecar_refs` | consumer/refresh save safe sidecars | must pass same `reference_ref` and loaded bundle version | 不把 business source ref 当 bundle key;不跨 bundle 共用 version |
| `ExternalReferenceResolutionOutcome` | resolver output copied by refresh job | `state.external_reference_ref` must equal requested bundle;sidecar refs attach to the same bundle and are optional | service 不从 returned state、safe summary、source version 或 adapter diagnostic 反推 sidecar |

#### 7.11.6 `IdentityMaintenanceRepository`

```rust
/// Repository/read port for maintenance scope expansion and target scans.
pub trait IdentityMaintenanceRepository {
    async fn expand_maintenance_targets(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
    ) -> Result<Page<IdentityMaintenanceTargetRef>, ApplicationError>;

    async fn list_projection_targets_for_rebuild(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityProjectionRef>, ApplicationError>;

    async fn list_reference_targets_for_refresh(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<ExternalReferenceRef>, ApplicationError>;

    async fn list_report_targets(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityMaintenanceTargetRef>, ApplicationError>;

    async fn load_maintenance_target_inspection_context(
        &self,
        target_ref: IdentityMaintenanceTargetRef,
    ) -> Result<Option<IdentityMaintenanceInspectionContext>, ApplicationError>;
}
```

| 函数 | 使用场景 | expansion 语义 | 禁止事项 |
|---|---|---|---|
| `expand_maintenance_targets` | reconciliation target preparation | target kind 只能是 projection/reference/report | 不返回 core truth write target |
| `list_projection_targets_for_rebuild` | rebuild job | projection refs 来自 formal index/catalog | 不从 scope string 拼 projection ref |
| `list_reference_targets_for_refresh` | reference refresh job | external reference refs 来自 formal reference state/index | 不从 business source ref 自动转换 |
| `list_report_targets` | report job | report targets 是 body-free maintenance markers | 不执行 repair/remediation |
| `load_maintenance_target_inspection_context` | reconciliation target inspection | target marker -> typed loaded projection/reference/report state context | 不解析 `target_ref.target_ref`;不扫描 sibling stores;missing target must become safe issue |

#### 7.11.7 `IdentityReconciliationReportRepository`

```rust
/// Repository for report-only Identity reconciliation reports.
pub trait IdentityReconciliationReportRepository {
    async fn get_report_with_version(
        &self,
        report_ref: ReconciliationReportRef,
    ) -> Result<Option<Versioned<ReconciliationReport>>, ApplicationError>;

    async fn list_reports_by_scope(
        &self,
        maintenance_scope_ref: MaintenanceScopeRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReconciliationReportRef>>, ApplicationError>;

    async fn list_reports_by_target(
        &self,
        target_ref: IdentityMaintenanceTargetRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReconciliationReportRef>>, ApplicationError>;

    async fn list_reports_by_state(
        &self,
        state_kind: ReconciliationReportStateKind,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<ReconciliationReportRef>>, ApplicationError>;

    async fn save_report(
        &self,
        report: ReconciliationReport,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<ReconciliationReportRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / report-only 语义 | 禁止事项 |
|---|---|---|---|
| `get_report_with_version` | report query/update | version 是 report update expected_version 来源 | 不从 scope/time 拼 report ref |
| `list_reports_by_scope` | report query/history | scope 来自 request/job/config marker | 不全表 raw scan |
| `list_reports_by_target` | target report query | target ref 只能是 maintenance target | 不返回 repair action |
| `list_reports_by_state` | operations report list | state 是 report state,不是 truth repair state | partial/failed 不隐藏 |
| `save_report` | reconciliation job/report assembly | create `None`;update loaded version | 不修复 truth;不保存 raw diagnostic/body |

#### 7.11.8 fake / durable parity 表

| repository | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| `IdentityProjectionRepository` | stable lookup missing、view read、projection version/stale state、affected expansion 可断言 | projection index + state table + optimistic update | fake 拼 view ref 或 query miss 自动 rebuild |
| `IdentityReadVisibilityRepository` | same input returns same access summary/not visible/degraded;decision read/save versioned | read mapping / decision store 与 external resolver separation | fake 默认 visible 或把 not visible 当 not found |
| `IdentityReferenceStateRepository` | reference bundle version、typed sidecar same-bundle update、owner/kind/stale index 等价 | reference state + sidecar store share optimistic bundle version | fake 用 source version/source ref 当 expected_version |
| `IdentityMaintenanceRepository` | scope expansion returns deterministic target pages | durable uses formal catalog/index | fake 全表扫描 core truth 或返回 write target |
| `IdentityReconciliationReportRepository` | report state/version/list indexes 等价 | report table + target/scope indexes | fake 把 finding 当 repair action |

#### 7.11.9 7.5 后续承接表

| 7.5 repository | Step 9 承接 | Step 10/11/12/13/14/16 承接 |
|---|---|---|
| projection | member summary query、accepted stale side effect、rebuild job | projection state matrix;view lookup index;stale/degraded tests |
| read visibility | all query precheck、not visible/redacted/degraded surface | query disposition matrix;visibility degraded/error mapping |
| reference | consumer/reference refresh、source unavailable/stale, typed sidecar save | reference state matrix;bundle version/sidecar persistence;source mismatch tests |
| maintenance | rebuild/refresh/reconciliation target expansion | job scope/cursor;config binding;no repair tests |
| report | reconciliation report job/query | report state matrix;report-only persistence;forbidden body tests |

#### 7.11.10 7.5 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 projection/read/reference/report repositories | 通过 | 未写 outbox/result/idempotency、external resolver/publisher/handoff adapter |
| stable view lookup 是否闭合 | 通过 | `find_member_summary_view_ref` 是 query 获取 view ref 的正式读取面 |
| read subject/scope/redaction marker 是否闭合 | 通过 | visibility repository 返回带 `read_subject_ref` / `scope_ref` / `visibility_result_ref` / `redaction_marker_ref` 的 prepared access summary,service 不从 route/string/profile/result 推断 |
| typed sidecar expected_version 是否闭合 | 通过 | sidecar save 显式接收 `ExternalReferenceRef` 和同 bundle `IdentityVersion` |
| maintenance 是否保持 report-only | 通过 | expansion 只返回 projection/reference/report target;inspection 只返回 typed loaded maintenance context |
| query no-write 是否保持 | 通过 | missing/stale/degraded 不触发 rebuild/refresh/repair |
| fake/durable parity 是否覆盖 | 通过 | §7.11.8 固定 lookup/index/version/missing/degraded 等价 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.6` | 7.5 已审核通过;7.6 已写入并停审 |

#### 7.11.11 7.5 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| view lookup | query 先 `find_member_summary_view_ref(member, scope)` | query 拼 `member-summary:<member>` |
| stale query | query 返回 stale/degraded read surface | query 自动 rebuild projection 并 mark fresh |
| affected projections | accepted flow 用 subject refs 调 `expand_affected_projection_refs` | 从 subject 字符串前缀猜 affected view |
| visibility | repository/resolver 返回 access summary 后 policy 分类 visible/redacted/not visible | service 从 route 参数猜 read scope |
| not visible | not visible 是 visibility surface | 返回 not found 并泄漏 diagnostic |
| reference version | `get_reference_state_with_version(reference_ref)` 后保存 sidecar | 用 `ExternalSourceVersionRef` 当 `IdentityVersion` |
| sidecar bundle | sidecar save 显式传同一个 `ExternalReferenceRef` | `IdentitySourceRef` 自动等于 reference bundle key |
| member summary rebuild plan | `get_member_summary_rebuild_plan(projection_ref)` 返回 member ref 与 visibility scopes | rebuild 从 projection ref、view ref 或 fake map 推 scope |
| maintenance expansion / inspection | scope expansion 返回 maintenance targets,inspection port 返回 typed loaded target context | job 全表扫描、解析 target marker 或直接修 core truth |
| report | `save_report` 保存 body-free finding/issue refs | report 保存 raw diagnostic、secret 或 remediation plan |
| fake parity | fake missing lookup 返回 missing/degraded | fake 私有 map 拼 view/ref 让测试通过 |

### 7.12 7.6 outbox / result / idempotency repositories

本批定义 outbox / result / idempotency repository port,目标是让 accepted side effect、duplicate replay、stored rejected / receipt / job report、command effect summary 和 pending outbox 发布状态具备正式读取面 / 保存面。本批不写 external publisher / handoff adapter、topic binding resolver、event DTO、job DTO、flow、state matrix 或 DDL。

所有 trait 归 `identity-application` 定义,由 `identity-infra` durable / fake adapter 实现。Application command service、consumer service、job service 和 publish job service 是唯一调用方。Repository 不得重跑 mutation,不得根据 missing stored result 重新查询 truth 拼 response,不得把 publisher / handoff adapter success 当 accepted truth。

#### 7.12.1 7.6 capability / 接缝清单

| repository family | 必须支撑 | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| outbox repository | save pending outbox、get/list pending、state update、by subject/trace lookup、payload marker read | accepted command services、publish job service、query/report service | infra outbox repo / fake | §6.5 `IdentityOutboxRecord`,`OutboxState`;§6.8 outbox subject | Step 9 accepted/publish;Step 11 outbox table;Step 12 retry |
| idempotency repository | reserve with operation context/channel/key/digest、get existing、complete accepted/rejected/receipt/report、mark conflict/expired | command/consumer/job/callback services | infra idempotency repo / fake | §6.6 `IdentityIdempotencyRecord`;§6.8 key/digest/channel | Step 13 duplicate matrix;Step 11 unique |
| stored result repository | save/load command accepted、command rejected、consumer receipt、job report、handoff callback receipt surfaces | command/consumer/job/callback services | infra result repo / fake | §6.6 `StoredIdentityOperationResult` | Step 8 result DTO;Step 13 replay |
| command effect summary repository | save/get accepted effect summary、list by truth/cursor/context | command services、observability/report services | infra effect repo / fake | §6.6 `IdentityCommandEffectSummary` | Step 9 accepted flow;Step 11 transaction order |
| job report repository | save/get/list job run report、load stored report replay marker | job services、job query/replay services | infra job report repo / fake | §6.6 `IdentityJobRunReport` | Step 8 job protocol;Step 13 job replay |

#### 7.12.2 outbox / result / idempotency 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| no mutation replay | duplicate replay 必须读取 stored result;不得重跑 command/consumer/job/callback mutation |
| reserve source | idempotency reserve 必须接收 `IdentityOperationContext` 或显式复制 operation name/channel/key/digest |
| same key conflict | same key + different digest 必须进入 conflict surface;不得覆盖旧 record |
| completed symmetry | `Completed` / `RejectedStored` / receipt / job report replay 必须有 `IdentityStoredResultRef` 和 stored result save/load 对称面 |
| rejected scope | `CommandRejected` 只表示 Step 12/13 后续明确可 replay 的 rejected surface;repository 不把任意 internal error 存为 rejected result |
| outbox accepted-only | outbox 只能从 accepted identity fact + trace 创建;publish state failure 不回滚 accepted truth |
| outbox payload body-free | repository 只保存 payload marker / topic key / issue marker;不得保存 event envelope body、broker response body 或 secret |
| job report body-free | job report / stored result 只保存 report marker、issue refs、cursor refs;不得保存 raw job log / stack trace |
| UoW | save/complete/update 方法接收 `uow: &dyn IdentityUnitOfWork`;reserve 若写入 record 也必须接收 UoW |
| fake parity | fake 必须与 durable 对 same-key/digest、stored result missing、pending outbox list、state update conflict 等行为一致 |

#### 7.12.3 `IdentityOutboxRepository`

```rust
/// Repository for accepted Identity outbox records and publish state transitions.
pub trait IdentityOutboxRepository {
    async fn get_outbox_record_with_version(
        &self,
        outbox_ref: IdentityOutboxRecordRef,
    ) -> Result<Option<Versioned<IdentityOutboxRecord>>, ApplicationError>;

    async fn list_pending_outbox_records(
        &self,
        topic_key_ref: Option<TopicKeyRef>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityOutboxRecordRef>>, ApplicationError>;

    async fn list_retryable_outbox_records(
        &self,
        topic_key_ref: Option<TopicKeyRef>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityOutboxRecordRef>>, ApplicationError>;

    async fn list_outbox_records_by_subject(
        &self,
        subject_ref: IdentityOutboxSubjectRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityOutboxRecordRef>>, ApplicationError>;

    async fn find_outbox_records_by_trace(
        &self,
        trace_record_ref: IdentityTraceRecordRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityOutboxRecordRef>>, ApplicationError>;

    async fn save_outbox_record(
        &self,
        record: IdentityOutboxRecord,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityOutboxRecordRef>, ApplicationError>;

    async fn update_outbox_state(
        &self,
        record: IdentityOutboxRecord,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityOutboxRecordRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | version / state 语义 | 禁止事项 |
|---|---|---|---|
| `get_outbox_record_with_version` | publish job load/update、query/report | version 是 state update expected_version 来源 | 不调用 publisher |
| `list_pending_outbox_records` | publish job selection | pending 只来自 `OutboxState::PendingPublish` | 不按 broker topic raw string 查询 |
| `list_retryable_outbox_records` | retry publish job | retryable 只由 `OutboxState` 判定 | 不定义 backoff schedule |
| `list_outbox_records_by_subject` | audit/report/explainability | subject 来自 7.1 mapper | 不解析 subject string |
| `find_outbox_records_by_trace` | accepted effect/query relation | trace ref 来自 7.4 trace repo/result | missing 不补 outbox |
| `save_outbox_record` | accepted command side effect create | create `None`;must be accepted-only pending record | 不保存 event body;不等待 publish success 才 accepted |
| `update_outbox_state` | publish result state update | expected_version 来自 loaded record;state carries attempt/issue marker | publish failed 不回滚 accepted truth |

#### 7.12.4 `IdentityIdempotencyRepository`

```rust
/// Repository for operation idempotency reserve, conflict, completion, and replay lookup.
pub trait IdentityIdempotencyRepository {
    async fn get_by_key(
        &self,
        operation_name: IdentityOperationName,
        channel: IdentityOperationChannel,
        idempotency_key: IdentityIdempotencyKey,
    ) -> Result<Option<Versioned<IdentityIdempotencyRecord>>, ApplicationError>;

    async fn reserve(
        &self,
        context: IdentityOperationContext,
        record_ref: IdentityIdempotencyRecordRef,
        reserved_at: IdentityTimestamp,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdempotencyReserveOutcome, ApplicationError>;

    async fn complete_with_stored_result(
        &self,
        record: IdentityIdempotencyRecord,
        stored_result_ref: IdentityStoredResultRef,
        completed_at: IdentityTimestamp,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityIdempotencyRecordRef>, ApplicationError>;

    async fn complete_rejected_with_stored_result(
        &self,
        record: IdentityIdempotencyRecord,
        stored_result_ref: IdentityStoredResultRef,
        completed_at: IdentityTimestamp,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityIdempotencyRecordRef>, ApplicationError>;

    async fn mark_conflict(
        &self,
        record: IdentityIdempotencyRecord,
        conflicted_at: IdentityTimestamp,
        expected_version: IdentityVersion,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityIdempotencyRecordRef>, ApplicationError>;
}
```

```rust
/// Result of trying to reserve an idempotency key for an operation.
pub enum IdempotencyReserveOutcome {
    Reserved(Versioned<IdentityIdempotencyRecord>),
    ReplayAvailable {
        record: Versioned<IdentityIdempotencyRecord>,
        stored_result_ref: IdentityStoredResultRef,
    },
    Conflict(Versioned<IdentityIdempotencyRecord>),
    InFlight(Versioned<IdentityIdempotencyRecord>),
}
```

| 函数 | 使用场景 | digest/channel 语义 | 禁止事项 |
|---|---|---|---|
| `get_by_key` | duplicate precheck/report | key namespace includes operation name + channel | 不只按 key 字符串跨 channel 查询 |
| `reserve` | command/consumer/job/callback begin | context 必须提供 operation/channel/key/digest;same key same digest completed => replay;different digest => conflict | repository 不硬编码 channel |
| `complete_with_stored_result` | accepted/receipt/job complete | completed 必须带 stored result ref | completed 无 stored result |
| `complete_rejected_with_stored_result` | replayable rejected complete | 只用于可 replay rejected surface | 任意 validation/internal error 都存 rejected |
| `mark_conflict` | same key different digest | 保留原 digest;只记录 conflict state | 覆盖旧 digest 或保存 incoming raw body |

#### 7.12.5 `IdentityStoredResultRepository`

```rust
/// Stored accepted command envelope used as the duplicate replay source.
pub struct IdentityCommandAcceptedResultEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub command_name: IdentityCommandName,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub result: IdentityCommandTypedResult,
    pub effect: IdentityCommandEffectPublicSummary,
    pub recorded_at: IdentityTimestamp,
}

/// Stored replayable rejected command envelope used as the duplicate replay source.
pub struct IdentityCommandRejectedResultEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub command_name: IdentityCommandName,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub rejection: IdentityProtocolRejection,
    pub recorded_at: IdentityTimestamp,
}

/// Stored consumer/callback receipt envelope used as the duplicate replay source.
pub struct IdentityConsumerReceiptEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub result_kind: IdentityStoredResultKind,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub receipt: IdentityConsumerReceipt,
    pub recorded_at: IdentityTimestamp,
}
```

`IdentityCommandAcceptedResultEnvelope` 和 `IdentityCommandRejectedResultEnvelope` 是 command duplicate replay 的 typed stored surface。`StoredIdentityOperationResult` 仍是通用 stored shell,但不能单独作为 command replay 的完整来源。Accepted command 在 idempotency complete 前必须同一 UoW 保存 generic shell + accepted typed envelope;replayable rejected command 在 rejected idempotency complete 前必须同一 UoW 保存 generic shell + rejected typed envelope。

| 字段 | 来源 | 约束 |
|---|---|---|
| `stored_result_ref` | generic stored shell allocation / id generator | 必须等于 `StoredIdentityOperationResult.stored_result_ref`;不得等于 idempotency record ref |
| `operation_context_ref` | current `IdentityOperationContext.context_ref` | 只保存 context ref,不保存 command request body 或 credential |
| `command_name` | operation context / command route catalog | 必须与 `result` variant 或 `rejection` public surface 一致 |
| `surface_marker_ref` | stored surface marker assembler | 必须等于 generic stored shell marker;body-free |
| `result` | command accepted result assembler | `IdentityCommandTypedResult` variant;只保存业务结果字段,不得重复保存 effect |
| `effect` | accepted command effect public summary assembler | 只在 accepted envelope 保存;rejected envelope 不保存 effect |
| `rejection` | command rejected assembler | 只用于 Step 12/13 判定可 replay 的 `IdentityProtocolRejection`;不得保存 raw error body |
| `recorded_at` | clock | 不替代 truth cursor、reference marker cursor、version、digest 或 source event time |

`IdentityConsumerReceiptEnvelope` 是 consumer / callback duplicate replay 的 typed stored surface。`StoredIdentityOperationResult` 仍是通用 stored shell,但不能单独作为 consumer/callback replay 的完整来源。凡 accepted / rejected / quarantined / delayed / noop / unsupported 分支进入 idempotency complete 并返回 public receipt,必须在同一 UoW 内保存对应 envelope。

Consumer / callback receipt envelope 字段:

| 字段 | 来源 | 约束 |
|---|---|---|
| `stored_result_ref` | `IdentityIdGeneratorPort.new_identity_stored_result_ref()` or result store allocation | 必须等于 `receipt.stored_result_ref`;不得等于 receipt ref |
| `operation_context_ref` | current `IdentityOperationContext.context_ref` | 只保存 context ref,不保存 event/callback raw body |
| `result_kind` | consumer/callback flow family | consumer path 必须为 `ConsumerReceipt`;callback path 必须为 `HandoffCallbackReceipt` |
| `surface_marker_ref` | `IdentityIdGeneratorPort.new_identity_stored_surface_marker_ref()` / receipt surface assembler | 指向 body-free receipt surface;不保存 raw public response body |
| `receipt` | application receipt assembler | 完整 public `IdentityConsumerReceipt`;duplicate replay 直接返回该 receipt |
| `recorded_at` | clock | 不替代 truth cursor、reference marker cursor 或 source event time |

```rust
/// Repository for replayable Identity operation result surfaces.
pub trait IdentityStoredResultRepository {
    async fn get_stored_result(
        &self,
        stored_result_ref: IdentityStoredResultRef,
    ) -> Result<Option<StoredIdentityOperationResult>, ApplicationError>;

    async fn find_by_operation_context(
        &self,
        context_ref: IdentityOperationContextRef,
    ) -> Result<Option<StoredIdentityOperationResult>, ApplicationError>;

    async fn save_command_accepted_result(
        &self,
        result: StoredIdentityOperationResult,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn get_command_accepted_result(
        &self,
        stored_result_ref: IdentityStoredResultRef,
    ) -> Result<Option<IdentityCommandAcceptedResultEnvelope>, ApplicationError>;

    async fn save_command_accepted_envelope(
        &self,
        envelope: IdentityCommandAcceptedResultEnvelope,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn save_command_rejected_result(
        &self,
        result: StoredIdentityOperationResult,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn get_command_rejected_result(
        &self,
        stored_result_ref: IdentityStoredResultRef,
    ) -> Result<Option<IdentityCommandRejectedResultEnvelope>, ApplicationError>;

    async fn save_command_rejected_envelope(
        &self,
        envelope: IdentityCommandRejectedResultEnvelope,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn save_consumer_receipt_result(
        &self,
        result: StoredIdentityOperationResult,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn get_consumer_receipt(
        &self,
        stored_result_ref: IdentityStoredResultRef,
    ) -> Result<Option<IdentityConsumerReceiptEnvelope>, ApplicationError>;

    async fn save_consumer_receipt(
        &self,
        envelope: IdentityConsumerReceiptEnvelope,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn save_job_report_result(
        &self,
        result: StoredIdentityOperationResult,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn save_handoff_callback_receipt_result(
        &self,
        result: StoredIdentityOperationResult,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;

    async fn get_handoff_callback_receipt(
        &self,
        stored_result_ref: IdentityStoredResultRef,
    ) -> Result<Option<IdentityConsumerReceiptEnvelope>, ApplicationError>;

    async fn save_handoff_callback_receipt(
        &self,
        envelope: IdentityConsumerReceiptEnvelope,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityStoredResultRef, ApplicationError>;
}
```

| 函数 | 使用场景 | stored surface 语义 | 禁止事项 |
|---|---|---|---|
| `get_stored_result` | duplicate replay | returned marker is replay source | missing 不重跑 mutation |
| `find_by_operation_context` | diagnostics/replay consistency | context ref 来自 operation context | 不从 raw request 查 |
| `save_command_accepted_result` | accepted command complete generic shell | result kind must be `CommandAccepted`;typed replay still requires `save_command_accepted_envelope` | 不保存 public response body;不得作为完整 replay envelope |
| `get_command_accepted_result` | command accepted duplicate replay | must return envelope with result variant matching command name and effect | missing/wrong-kind/effect missing 不重跑 command |
| `save_command_accepted_envelope` | accepted command public replay | saves typed result + effect in same UoW before idempotency complete | 不保存 command request body;result DTO 不得重复携带 effect |
| `save_command_rejected_result` | replayable rejected complete generic shell | result kind must be `CommandRejected`;typed replay still requires `save_command_rejected_envelope` | 不把 repository/internal error 当 rejected result |
| `get_command_rejected_result` | command rejected duplicate replay | must return public `IdentityProtocolRejection` envelope | missing/wrong-kind 不重跑 validation/domain guard |
| `save_command_rejected_envelope` | replayable rejected public replay | saves final public rejection in same UoW before rejected idempotency complete | 不保存 raw error body;只用于 Step 12/13 replayable rejection |
| `save_consumer_receipt_result` | legacy/generic stored shell for consumer receipt | result kind must be `ConsumerReceipt`;typed replay still requires `save_consumer_receipt` | 不保存 event body;不得作为完整 replay envelope |
| `get_consumer_receipt` | consumer duplicate replay | must return envelope with result kind `ConsumerReceipt` | missing/wrong-kind 不重跑 consumer mutation |
| `save_consumer_receipt` | consumer accepted/rejected/quarantined/delayed/noop/unsupported receipt replay | saves full public receipt envelope in same UoW before idempotency complete | 不保存 event body;不得只保存 placeholder |
| `save_job_report_result` | job duplicate replay | result kind must be `JobReport` | 不保存 raw job log |
| `save_handoff_callback_receipt_result` | legacy/generic stored shell for callback receipt | result kind must be `HandoffCallbackReceipt`;typed replay still requires `save_handoff_callback_receipt` | 不保存 external receipt body;不得作为完整 replay envelope |
| `get_handoff_callback_receipt` | callback duplicate replay | must return envelope with result kind `HandoffCallbackReceipt` | wrong-kind 不得当普通 consumer receipt |
| `save_handoff_callback_receipt` | archive/trace callback receipt replay | saves full public receipt envelope in same UoW before idempotency complete | 不保存 external receipt body、archive package 或 adapter response |

#### 7.12.6 `IdentityCommandEffectSummaryRepository`

```rust
/// Repository for accepted command effect summaries.
pub trait IdentityCommandEffectSummaryRepository {
    async fn get_effect_summary(
        &self,
        effect_summary_ref: IdentityCommandEffectSummaryRef,
    ) -> Result<Option<IdentityCommandEffectSummary>, ApplicationError>;

    async fn list_effects_by_operation_context(
        &self,
        context_ref: IdentityOperationContextRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityCommandEffectSummaryRef>, ApplicationError>;

    async fn list_effects_by_truth_ref(
        &self,
        truth_ref: IdentityTruthRef,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityCommandEffectSummaryRef>, ApplicationError>;

    async fn list_effects_after_cursor(
        &self,
        after_cursor: Option<IdentityTruthCursor>,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityCommandEffectSummaryRef>, ApplicationError>;

    async fn save_effect_summary(
        &self,
        summary: IdentityCommandEffectSummary,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<IdentityCommandEffectSummaryRef, ApplicationError>;
}
```

| 函数 | 使用场景 | effect 语义 | 禁止事项 |
|---|---|---|---|
| `get_effect_summary` | accepted result/replay diagnostics | summary refs only | 不保存 raw command body |
| `list_effects_by_operation_context` | trace/replay audit | context ref 来自 operation context | 不从 idempotency key 反查 raw |
| `list_effects_by_truth_ref` | truth explainability | truth ref is typed sum | 不保存 external source string |
| `list_effects_after_cursor` | observability/report scan | cursor 是 accepted truth cursor | 不用 timestamp/page cursor |
| `save_effect_summary` | accepted command complete | summary references trace/audit/outbox/stale/stored result | 不决定 transaction order |

#### 7.12.7 `IdentityJobReportRepository`

```rust
/// Repository for Identity job run reports and replay markers.
pub trait IdentityJobReportRepository {
    async fn get_job_report_with_version(
        &self,
        report_ref: IdentityJobReportRef,
    ) -> Result<Option<Versioned<IdentityJobRunReport>>, ApplicationError>;

    async fn find_job_report_by_run(
        &self,
        job_run_ref: IdentityJobRunRef,
    ) -> Result<Option<Versioned<IdentityJobRunReport>>, ApplicationError>;

    async fn list_job_reports_by_name(
        &self,
        job_name: IdentityJobName,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityJobReportRef>>, ApplicationError>;

    async fn list_job_reports_by_result(
        &self,
        result_kind: IdentityJobResultKind,
        page: IdentityRepositoryPage,
    ) -> Result<Page<VersionedRef<IdentityJobReportRef>>, ApplicationError>;

    async fn save_job_report(
        &self,
        report: IdentityJobRunReport,
        expected_version: Option<IdentityVersion>,
        uow: &dyn IdentityUnitOfWork,
    ) -> Result<VersionedRef<IdentityJobReportRef>, ApplicationError>;
}
```

| 函数 | 使用场景 | job replay/report 语义 | 禁止事项 |
|---|---|---|---|
| `get_job_report_with_version` | query/update/replay | version 是 report update expected_version 来源 | 不保存 raw log |
| `find_job_report_by_run` | duplicate job replay | job_run_ref 来自 job entry | 不用 job name + timestamp |
| `list_job_reports_by_name` | operations query | job_name 是 formal enum/ref | 不自由字符串 |
| `list_job_reports_by_result` | operations query/retry view | partial/failed/retryable visible | 不把 partial silent success |
| `save_job_report` | job start/complete/partial/fail | create `None`;update loaded version | report 不修 truth |

#### 7.12.8 fake / durable parity 表

| repository | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| `IdentityOutboxRepository` | pending/retryable list deterministic;state update conflict;subject/trace index consistent | outbox table + state/topic/subject/trace indexes | fake publish success 回滚/改 truth |
| `IdentityIdempotencyRepository` | same key same digest replay;different digest conflict;in-flight visible;channel namespace consistent | unique operation/channel/key + digest compare + optimistic update | fake same key 直接 replay 不比 digest |
| `IdentityStoredResultRepository` | every stored kind save/load symmetric;missing returns missing and does not replay | stored result table by ref/context/kind | fake missing result 重跑 mutation |
| `IdentityCommandEffectSummaryRepository` | effect refs/cursor order deterministic | append effect summary store + indexes | fake 用 raw command body 生成 summary |
| `IdentityJobReportRepository` | job run uniqueness;partial/failed issue refs preserved;version conflict | job report table + run/name/result indexes | fake invalid cursor full scan and mark success |

#### 7.12.9 7.6 后续承接表

| 7.6 repository | Step 9 承接 | Step 10/11/12/13/14/16 承接 |
|---|---|---|
| outbox | accepted outbox side effect、publish job state update | outbox state matrix;pending/retry DDL;publisher failure mapping |
| idempotency | command/consumer/job/callback reserve and complete | duplicate matrix;unique key;conflict/replay tests |
| stored result | accepted/rejected/receipt/job/callback replay | stored payload schema;missing result error;no mutation replay |
| effect summary | accepted command effect/result assembly | transaction order audit;observability effect tests |
| job report | job start/partial/fail/success/noop report | job report state;retry config;partial/failed issue tests |

#### 7.12.10 7.6 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 outbox/result/idempotency repositories | 通过 | 未写 external publisher/handoff adapter、event/job DTO、flow、DDL |
| outbox accepted-only 是否闭合 | 通过 | save outbox 只来自 accepted change + trace,失败不回滚 truth |
| reserve context/channel 是否闭合 | 通过 | `reserve` 接收 `IdentityOperationContext`,channel 不由 repo 硬编码 |
| stored result save/load 是否对称 | 通过 | command accepted/rejected generic shell + typed envelope、receipt、job、callback 均有 save/get surface |
| duplicate replay 是否禁止重跑 mutation | 通过 | stored result shell 或 typed envelope/report missing 不允许重跑 mutation |
| rejected replay 范围是否越界 | 未越界 | 只定义可 replay rejected surface,具体范围留 Step 12/13 |
| fake/durable parity 是否覆盖 | 通过 | §7.12.8 固定 same key/digest、stored result missing、pending outbox 等价 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.7` | 7.6 已审核通过;7.7 已写入并停审 |

#### 7.12.11 7.6 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| idempotency reserve | `reserve(context, record_ref, now, uow)` 复制 operation/channel/key/digest | repository 根据 operation name 字符串猜 channel |
| same key replay | same key + same digest + stored result => replay stored surface | same key 不比 digest 直接 replay |
| conflict | same key + different digest => conflict | 覆盖旧 digest 或保存 incoming raw body |
| completed record | completed/rejected stored 必须有 stored result ref | completed 无 result,duplicate 时重跑 mutation |
| stored accepted | save `CommandAccepted` marker 后 replay | duplicate 重新查 truth 拼 response |
| stored rejected | 只保存可 replay rejected marker | 任意 internal/repository error 都当 rejected result 存储 |
| consumer receipt | stored receipt 只保存 surface marker | 保存 event payload body |
| job report replay | stored job report marker + job report repo | 保存 raw job log/stack trace |
| outbox create | accepted trace 后保存 pending outbox | publish 成功后才创建 outbox 或 accepted truth |
| outbox state | publish failed 只更新 outbox state + issue marker | publish failed 回滚 member/lifecycle/career truth |
| pending list | list pending by `TopicKeyRef` | 用 broker topic raw string 查询 |
| effect summary | summary 只引用 truth/trace/audit/outbox/stale/stored refs | summary 保存 command body 或决定 commit order |
| fake parity | fake missing stored result 返回 missing/error surface | fake 私下重跑 mutation 让 duplicate 成功 |

### 7.13 7.7 external resolver / publisher / handoff / adapter ports

本批定义 external resolver / publisher / handoff / adapter boundary port。它们只返回 body-free safe summary、marker、attempt、receipt、issue 和 availability surface,不得保存或暴露外部 truth body、raw adapter response、secret、broker payload 或 receipt body。本批不写 DTO、flow、state matrix、DDL、config schema 或 adapter implementation。

所有 trait 归 `identity-application` 定义,由 `identity-infra` durable / fake / controlled / disabled adapter 实现。Application service / job service 是唯一调用方。API、worker、jobs entry 不得直接调用 external adapter,必须经 application service。

#### 7.13.1 7.7 capability / 接缝清单

| port family | 必须支撑 | 调用方 | 实现方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| governance basis resolver | basis valid/stale/unavailable/invalid/not found safe summary | lifecycle command service | infra governance resolver / fake | §6.1-b `GovernanceBasisSummary`;§6.8 basis refs | Step 9 high-risk lifecycle;Step 12 invalid/unavailable |
| role/capability source resolver | source summary、source version、evidence summary、safe material state | role/capability service、source consumer | infra method/source resolver / fake | §6.1-c role/capability refs;§6.2-c summary | Step 9 role update;Step 12 source/evidence failure |
| work/career source resolver | work participation safe summary、duplicate source key support | career command/consumer service | infra work resolver / fake | §6.2-d career source summary | Step 9 career append;Step 13 duplicate |
| memory/archive source resolver | memory/archive/handoff safe summary、callback target marker | memory command/consumer/callback service | infra memory/archive resolver / fake | §6.2-e memory source summary;§6.5 receipt guard | Step 9 memory/handoff callback |
| external reference resolver | external reference bundle、owner mapping、safe summary、source version | reference refresh/consumer services | infra external reference resolver / fake | §6.4 `ReferenceResolutionState`;§6.8 external ref boundary | Step 9 refresh;Step 11 sidecar version |
| adapter availability | adapter ref/mode/availability issue | runtime/application services | infra adapter registry / fake | §6.7 `IdentityAdapterAvailability` | Step 14 config;Step 16 fake tests |
| topic binding / publisher | topic key resolution、publish attempt / issue / retryability | outbox publish job service | infra publisher adapter / fake | §6.5 `TopicKeyRef`,`OutboxState` | Step 9 publish;Step 12 retry/permanent |
| handoff target / delivery | target/scope resolution、handoff attempt / receipt / issue / retryability | handoff prepare/deliver/callback services | infra handoff adapter / fake | §6.5 `TraceHandoffIntent`,`HandoffState` | Step 9 handoff;Step 14 target config |

#### 7.13.2 external port 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| body-free only | resolver/publisher/handoff port 只返回 safe summary refs、source version refs、attempt refs、receipt refs、issue refs;不得返回外部 body |
| ref presence not valid | opaque ref 存在不代表 valid;必须结合 resolver summary state |
| source version separated | external source version 不等于 `IdentityVersion`、truth cursor、projection cursor 或 idempotency key |
| adapter success separated | publisher success 只代表 publish boundary;handoff delivered 必须有 formal receipt marker;均不代表 downstream consumed 或 accepted truth |
| retryability explicit | publisher/handoff failure 必须明确 retryable/permanent/skipped/unsupported,并携带 safe issue marker |
| fake not success | fake/controlled/disabled adapter 不得伪造 valid basis、published、delivered 或 available;必须按配置返回受控 marker/surface |
| no entry bypass | API/worker/jobs entry 不直接调用 resolver/publisher/handoff adapter |
| no persistence hidden write | resolver/publisher/handoff port 不直接写 core truth、trace、outbox、result 或 report repository |

#### 7.13.3 `IdentityExternalSourceResolverPort`

```rust
/// Resolves external business sources into body-free Identity safe summaries.
pub trait IdentityExternalSourceResolverPort {
    async fn resolve_governance_basis(
        &self,
        basis_ref: GovernanceBasisRef,
        risk_ref: Option<LifecycleRiskRef>,
    ) -> Result<GovernanceBasisSummary, ApplicationError>;

    async fn resolve_role_capability_source(
        &self,
        source_ref: RoleCapabilitySourceRef,
    ) -> Result<RoleCapabilitySourceResolution, ApplicationError>;

    async fn resolve_capability_evidence(
        &self,
        evidence_ref: CapabilityEvidenceRef,
    ) -> Result<CapabilityEvidenceResolution, ApplicationError>;

    async fn resolve_work_participation(
        &self,
        source_ref: WorkSourceRef,
    ) -> Result<WorkParticipationSourceSummary, ApplicationError>;

    async fn resolve_memory_reference_source(
        &self,
        source_ref: MemoryReferenceSourceRef,
    ) -> Result<MemoryReferenceSourceSummary, ApplicationError>;

    async fn resolve_archive_handoff_source(
        &self,
        handoff_ref: ArchiveHandoffRef,
    ) -> Result<MemoryReferenceSourceSummary, ApplicationError>;
}
```

```rust
pub struct RoleCapabilitySourceResolution {
    pub source_ref: RoleCapabilitySourceRef,
    pub source_state: RoleCapabilitySourceStateKind,
    pub source_version_ref: Option<RoleCapabilitySourceVersionRef>,
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,
    pub evidence_refs: Vec<CapabilityEvidenceRef>,
    pub material_marker: RoleCapabilityChangeMaterialMarker,
}

pub struct CapabilityEvidenceResolution {
    pub evidence_ref: CapabilityEvidenceRef,
    pub evidence_state: ReferenceResolutionStateKind,
    pub safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
}
```

| 函数 | 使用场景 | 返回语义 | 禁止事项 |
|---|---|---|---|
| `resolve_governance_basis` | high-risk lifecycle precheck | basis summary state says valid/stale/unavailable/invalid/not found | basis ref presence == valid |
| `resolve_role_capability_source` | role/capability summary update | safe summary + source version + evidence refs + material marker | 返回 role/capability definition body |
| `resolve_capability_evidence` | evidence precheck/report | evidence safe summary,not artifact body | 保存 evidence/artifact body |
| `resolve_work_participation` | career append/source consumer | work participation safe summary | 拥有 Project/Work truth 或 ProjectMember body |
| `resolve_memory_reference_source` | memory relation update | memory/archive safe summary | 返回 memory text/embedding/index |
| `resolve_archive_handoff_source` | archive callback/relation update | handoff source summary,not receipt body | handoff marker 当 delivered receipt |

#### 7.13.4 `IdentityExternalReferenceResolverPort`

```rust
/// Resolves ExternalReferenceRef bundles and local owner mappings.
pub trait IdentityExternalReferenceResolverPort {
    async fn resolve_external_reference(
        &self,
        reference_ref: ExternalReferenceRef,
        owner_ref: IdentityReferenceOwnerRef,
    ) -> Result<ExternalReferenceResolutionOutcome, ApplicationError>;

    async fn map_role_capability_owner(
        &self,
        summary_ref: RoleCapabilitySummaryRef,
    ) -> Result<IdentityReferenceOwnerRef, ApplicationError>;

    async fn map_career_owner(
        &self,
        record_ref: CareerRecordRef,
    ) -> Result<IdentityReferenceOwnerRef, ApplicationError>;

    async fn map_memory_owner(
        &self,
        reference_ref: MemoryReferenceRef,
    ) -> Result<IdentityReferenceOwnerRef, ApplicationError>;

    async fn map_lifecycle_basis_owner(
        &self,
        member_ref: GlobalMemberRef,
        basis_ref: GovernanceBasisRef,
    ) -> Result<IdentityReferenceOwnerRef, ApplicationError>;
}
```

| 函数 | 使用场景 | reference / owner 语义 | 禁止事项 |
|---|---|---|---|
| `resolve_external_reference` | reference refresh/consumer | external ref bundle + local owner => resolution state plus optional typed sidecar refs | business source ref 自动等于 bundle key;不从 returned state、safe summary、source version 或 error 文本反推 sidecar |
| `map_role_capability_owner` | typed sidecar owner mapping | owner ref from local summary ref | 从 external source string 推 owner |
| `map_career_owner` | career source reference | owner ref from career record ref | 用 work id 当 local owner |
| `map_memory_owner` | memory/archive reference | owner ref from memory relation ref | 用 memory/archive external id 当 local owner |
| `map_lifecycle_basis_owner` | governance basis reference | owner ref from member+basis marker | 保存 governance body |

#### 7.13.5 `IdentityAdapterAvailabilityPort`

```rust
/// Provides configured adapter availability without executing business operations.
pub trait IdentityAdapterAvailabilityPort {
    async fn get_adapter_availability(
        &self,
        adapter_ref: IdentityAdapterRef,
    ) -> Result<IdentityAdapterAvailability, ApplicationError>;

    async fn list_adapter_availability(
        &self,
        page: IdentityRepositoryPage,
    ) -> Result<Page<IdentityAdapterAvailability>, ApplicationError>;

    async fn assert_adapter_attempt_allowed(
        &self,
        adapter_ref: IdentityAdapterRef,
        required_mode: Option<IdentityAdapterModeRef>,
    ) -> Result<IdentityAdapterAvailability, ApplicationError>;
}
```

| 函数 | 使用场景 | availability 语义 | 禁止事项 |
|---|---|---|---|
| `get_adapter_availability` | service/job precheck | returns Available/Degraded/Unavailable/Disabled marker | endpoint URL 当 adapter ref |
| `list_adapter_availability` | runtime/report | body-free availability list | 保存 raw health body |
| `assert_adapter_attempt_allowed` | publisher/handoff/resolver precheck | disabled/unavailable visible issue | disabled adapter 伪造 success |

#### 7.13.6 `IdentityTopicBindingPort` and `IdentityOutboxPublisherPort`

```rust
/// Resolves Identity topic keys into publish boundary targets.
pub trait IdentityTopicBindingPort {
    async fn resolve_topic_binding(
        &self,
        topic_key_ref: TopicKeyRef,
        payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    ) -> Result<TopicBindingResolution, ApplicationError>;
}

/// Publishes body-free Identity outbox material to an outbound boundary.
pub trait IdentityOutboxPublisherPort {
    async fn publish_outbox_record(
        &self,
        record_ref: IdentityOutboxRecordRef,
        topic_binding: TopicBindingResolution,
        payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    ) -> Result<OutboxPublishOutcome, ApplicationError>;
}
```

```rust
pub struct TopicBindingResolution {
    pub topic_key_ref: TopicKeyRef,
    pub adapter_ref: IdentityAdapterRef,
    pub adapter_mode_ref: IdentityAdapterModeRef,
    pub publish_scope_ref: IdentitySourceRef,
}

pub enum OutboxPublishOutcome {
    Published {
        attempt_ref: OutboxDeliveryAttemptRef,
    },
    RetryableFailed {
        attempt_ref: Option<OutboxDeliveryAttemptRef>,
        issue_ref: OutboxDeliveryIssueRef,
    },
    PermanentlyFailed {
        attempt_ref: Option<OutboxDeliveryAttemptRef>,
        issue_ref: OutboxDeliveryIssueRef,
    },
    SkippedByPolicy {
        issue_ref: OutboxDeliveryIssueRef,
    },
    UnsupportedTopic {
        issue_ref: OutboxDeliveryIssueRef,
    },
}
```

| port / outcome | 语义 | 禁止事项 |
|---|---|---|
| `resolve_topic_binding` | topic key -> adapter/topic boundary marker | 返回 broker topic raw string / secret |
| `publish_outbox_record` | publish body-free payload marker | 保存 event envelope body |
| `Published` | publisher boundary accepted/published | downstream consumed / command accepted |
| `RetryableFailed` | safe issue marker,可重试 | 无 issue marker retry |
| `PermanentlyFailed` | safe issue marker,不可重试 | 归类为 retryable |
| `SkippedByPolicy` | policy skip visible marker | 静默删除 outbox |
| `UnsupportedTopic` | binding unsupported marker | service 拼 fallback topic |

#### 7.13.7 `IdentityHandoffTargetPort` and `IdentityHandoffDeliveryPort`

```rust
/// Resolves handoff target and scope markers into a delivery boundary.
pub trait IdentityHandoffTargetPort {
    async fn resolve_handoff_target(
        &self,
        target_ref: HandoffTargetRef,
        scope_ref: HandoffScopeRef,
        safe_material_ref: TraceHandoffSafeMaterialRef,
    ) -> Result<HandoffTargetResolution, ApplicationError>;
}

/// Delivers body-free trace/audit/archive handoff material.
pub trait IdentityHandoffDeliveryPort {
    async fn deliver_handoff(
        &self,
        intent_ref: TraceHandoffIntentRef,
        target_resolution: HandoffTargetResolution,
        safe_material_ref: TraceHandoffSafeMaterialRef,
    ) -> Result<HandoffDeliveryOutcome, ApplicationError>;

    async fn resolve_handoff_receipt(
        &self,
        receipt_ref: HandoffReceiptRef,
    ) -> Result<HandoffReceiptResolution, ApplicationError>;
}
```

```rust
pub struct HandoffTargetResolution {
    pub target_ref: HandoffTargetRef,
    pub scope_ref: HandoffScopeRef,
    pub adapter_ref: IdentityAdapterRef,
    pub adapter_mode_ref: IdentityAdapterModeRef,
}

pub enum HandoffDeliveryOutcome {
    Delivered {
        attempt_ref: HandoffAttemptRef,
        receipt_ref: HandoffReceiptRef,
    },
    RetryableFailed {
        attempt_ref: HandoffAttemptRef,
        issue_ref: HandoffIssueRef,
    },
    PermanentlyFailed {
        attempt_ref: HandoffAttemptRef,
        issue_ref: HandoffIssueRef,
    },
    CancelledByPolicy {
        issue_ref: HandoffIssueRef,
    },
    UnsupportedTarget {
        issue_ref: HandoffIssueRef,
    },
}

pub struct HandoffReceiptResolution {
    pub receipt_ref: HandoffReceiptRef,
    pub receipt_state: ReferenceResolutionStateKind,
    pub issue_ref: Option<HandoffIssueRef>,
}
```

| port / outcome | 语义 | 禁止事项 |
|---|---|---|
| `resolve_handoff_target` | target/scope -> adapter boundary marker | 返回 bucket/path/raw endpoint/secret |
| `deliver_handoff` | delivers safe material marker | 保存 archive package/receipt body |
| `resolve_handoff_receipt` | validates receipt marker state | 解析 receipt body 入仓 |
| `Delivered` | 必须有 attempt + receipt marker | HTTP 2xx/request sent/job log success |
| `RetryableFailed` | attempt + safe issue marker,可重试 | 无 attempt marker 写 retryable state |
| `PermanentlyFailed` | attempt + safe issue marker,不可重试 | 自动转 delivered 或无 attempt marker 写 failed state |
| `CancelledByPolicy` | visible cancel marker;未发起 delivery attempt 时使用 | 静默删除 intent |
| `UnsupportedTarget` | unsupported target marker;未发起 delivery attempt 时使用 | 拼 fallback target 或写 `HandoffState::Failed` |

#### 7.13.8 fake / durable parity 表

| port | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| source resolver | configured valid/stale/unavailable/invalid/not found safe summaries | external read adapter returns same state shape | fake opaque ref 默认 valid |
| external reference resolver | bundle key and owner mapping explicit | durable does not infer owner from external string | fake source ref == reference ref |
| adapter availability | fake/controlled/endpoint/disabled modes visible | durable registry uses formal adapter refs/modes | disabled/fake 伪造 success |
| topic binding | unsupported topic visible issue | durable binding does not expose broker secrets | fake fallback topic |
| publisher | Published/Retryable/Permanent/Skipped/Unsupported exact outcomes | durable maps adapter errors to safe issue markers | publish success == downstream consumed |
| handoff target/delivery | delivered requires receipt marker;failures carry issue marker | durable maps target/receipt without raw body | HTTP 2xx == Delivered |

#### 7.13.9 7.7 后续承接表

| 7.7 port | Step 9 承接 | Step 10/12/14/16 承接 |
|---|---|---|
| external source resolver | lifecycle/role/career/memory precheck and consumer flows | invalid/unavailable/degraded matrix;forbidden body tests |
| external reference resolver | reference refresh and typed sidecar flow | reference state matrix;bundle/source mismatch tests |
| adapter availability | all external attempt prechecks | runtime config binding;disabled/fake tests |
| topic binding/publisher | publish outbox job | outbox state matrix;retryable/permanent mapping |
| handoff target/delivery | prepare/deliver/callback handoff | handoff state matrix;fake delivered negative tests |

#### 7.13.10 7.7 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 external ports | 通过 | 未写 DTO、flow、state matrix、DDL、config schema |
| safe summary 是否 body-free | 通过 | resolver 只返回 safe summary/ref/version/material marker |
| adapter failure 分类是否闭合 | 通过 | publisher/handoff outcome 区分 retryable/permanent/skipped/unsupported |
| publish success 是否不等于 consumed | 通过 | `Published` 只代表 outbound boundary |
| handoff delivered 是否必须有 receipt | 通过 | `Delivered` outcome 必须有 `HandoffReceiptRef` |
| fake/disabled adapter 是否不伪成功 | 通过 | fake/durable parity 明确禁止 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.8` | 7.7 已审核通过;7.8 已写入并停审 |

#### 7.13.11 7.7 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| governance basis | resolver 返回 `GovernanceBasisSummary::Valid/Stale/Unavailable/...` | basis ref 存在就 accepted |
| role source | safe summary + source version + evidence refs | 返回 RoleDefinition/CapabilityDefinition body |
| evidence | evidence resolution 只给 safe marker | 保存 artifact/evidence body |
| work source | work participation safe summary | identity 拥有 ProjectMember truth |
| memory source | memory/archive safe summary | 保存 memory text、embedding、archive package |
| external reference | explicit `ExternalReferenceRef` + owner mapper | business source ref 自动等于 bundle key |
| adapter availability | disabled returns unavailable/issue | disabled adapter 返回 Published/Delivered |
| publisher | retryable/permanent failure 携带 issue marker | adapter exception raw body 入仓 |
| published | `Published { attempt_ref }` | 当成 downstream consumed |
| handoff delivered | `Delivered { attempt_ref, receipt_ref }` | HTTP 2xx 或 job log success 标 Delivered |
| receipt | receipt resolver 返回 marker state | 保存 external receipt body |
| fake | fake 按配置返回 valid/unavailable/retryable/permanent | fake 默认所有 external ref valid |

### 7.14 7.8 API / worker / jobs entry restrictions and application facade access

本批定义 API、worker、jobs entry module 如何进入 application facade,以及它们不得越过 application 直接调用 repository、UnitOfWork、resolver、publisher、handoff、projection、reference、idempotency 或 stored result port。本批只写 entry restriction、facade access、dispatch guard、ack/retry/dead-letter/job runner 边界和 fake/durable parity;不写 DTO schema、函数级 flow、状态矩阵、DDL、config schema、runtime assembly implementation 或具体 adapter implementation。

#### 7.14.1 7.8 capability / 接缝清单

| entry capability | 必须使用的 Step 7 surface | 允许调用方 | 被调用方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| API command/query entry | `IdentityOperationContextFactoryPort`,`IdentityDispatchTargetCatalogPort`,`IdentityApplicationFacade` | `identity-api` handler | application facade | §7.17 `IdentityApiEntryContext` / `IdentityEntryDispatchGuard`;§7.20.6 operation context / dispatch target | Step 8 API DTO;Step 9 handler flow;Step 13 idempotency |
| worker consumer/callback entry | `IdentityOperationContextFactoryPort`,`IdentityDispatchTargetCatalogPort`,`IdentityApplicationFacade` | `identity-worker` dispatcher | application facade | §7.17 `IdentityWorkerEntryContext`;§7.17.10 dispatch result | Step 8 event/callback protocol;Step 9 consumer/callback flow;Step 12 retry |
| operations job entry | `IdentityOperationContextFactoryPort`,`IdentityDispatchTargetCatalogPort`,`IdentityApplicationFacade` | `identity-jobs` runner | application facade | §7.17 `IdentityJobEntryContext`;§7.17.12 dispatch result | Step 8 job request/report;Step 9 job flow;Step 13 job replay |
| entry validation | entry validation issue / dispatch guard | API/worker/jobs entry | local entry guard + application target catalog | §7.17 entry validation objects | Step 12 public entry error mapping |
| pre-dispatch failure | runtime assembly / adapter availability / target disabled surface | API/worker/jobs entry | application facade unavailable surface only | §7.17 runtime assembly / adapter availability | Step 14 config binding;Step 16 entry tests |
| post-dispatch business result | command result / query visibility / consumer receipt / job report from application | API/worker/jobs entry | application service result | §7.16 stored result;§7.17 dispatch result not business state | Step 8/9/13 protocol replay |

#### 7.14.2 entry restriction 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| entry owns mapping only | API/worker/jobs 只负责 route/envelope/job input 解析、entry context 构造、entry validation、request digest/canonical marker、operation context factory 调用、dispatch target catalog 校验和 application facade 调用 |
| application owns business | command accepted/rejected、query visible/not visible/degraded、consumer receipt、handoff callback receipt、job report 只能由 application service 产生 |
| dispatch is not success | `IdentityApiDispatchResult`、`IdentityWorkerDispatchResult`、`IdentityJobDispatchResult` 只表示 entry 是否把请求交给 application target,不等于 accepted/rejected/query visible/consumer receipt/job report |
| entry no repository | entry module 不得直接调用 core truth repository、trace/audit repository、projection/read/reference/report repository、outbox/result/idempotency repository 或 UnitOfWork |
| entry no external adapter | entry module 不得直接调用 external resolver、publisher、handoff target/delivery、topic binding、adapter availability port 或 durable/fake adapter |
| entry no hidden transaction | entry module 不得 begin/commit/rollback UoW,不得保存 stored result,不得 append trace/audit/outbox/stale marker |
| entry no ref synthesis | entry module 不得拼 subject/view/ref/cursor/version/idempotency result;需要 ref/id 时只能通过 entry context factory、operation context factory、dispatch catalog 或 application facade 返回 |
| runtime block is entry surface | runtime not assembled、target disabled、adapter unavailable 可阻止 dispatch 并返回 entry-level surface,但不得写成业务 rejected、accepted、consumer skipped 或 job failed report |
| fake entry parity | fake API/worker/jobs entry 必须走同一 facade/dispatch guard,不得用测试专用入口直连 repository 或 fake store |

#### 7.14.3 `IdentityApplicationFacade` / service facade access

`IdentityApplicationFacade` 是 entry module 唯一可见的 application 入口集合。具体 command/query/event/job DTO schema 留 Step 8,函数级 flow 留 Step 9;本批只固定 facade access 方向和禁止绕行规则。Facade 可以在 implementation 内部调用 7.2~7.7 定义的 repository、result、idempotency、resolver、publisher、handoff 和 report ports,但 entry module 不可见这些 port。

```rust
/// Entry-visible facade for Identity application use cases.
pub trait IdentityApplicationFacade {
    type CommandRequest;
    type CommandResponse;
    type QueryRequest;
    type QueryResponse;
    type InboundEventRequest;
    type InboundEventReceipt;
    type CallbackRequest;
    type CallbackReceipt;
    type JobRequest;
    type JobReport;

    async fn dispatch_command(
        &self,
        context: IdentityOperationContext,
        request: Self::CommandRequest,
    ) -> Result<Self::CommandResponse, ApplicationError>;

    async fn dispatch_query(
        &self,
        context: IdentityOperationContext,
        request: Self::QueryRequest,
    ) -> Result<Self::QueryResponse, ApplicationError>;

    async fn dispatch_inbound_event(
        &self,
        context: IdentityOperationContext,
        request: Self::InboundEventRequest,
    ) -> Result<Self::InboundEventReceipt, ApplicationError>;

    async fn dispatch_callback(
        &self,
        context: IdentityOperationContext,
        request: Self::CallbackRequest,
    ) -> Result<Self::CallbackReceipt, ApplicationError>;

    async fn dispatch_job(
        &self,
        context: IdentityOperationContext,
        request: Self::JobRequest,
    ) -> Result<Self::JobReport, ApplicationError>;
}
```

| facade 函数 | entry 调用方 | operation context 来源 | 返回语义 | 禁止事项 |
|---|---|---|---|---|
| `dispatch_command` | API command handler | `IdentityOperationContextFactoryPort::from_api_command_entry(...)` | public command response / rejection surface | handler 直连 idempotency / stored result / repository |
| `dispatch_query` | API query handler | `IdentityOperationContextFactoryPort::from_api_query_entry(...)` | public query visible/not visible/degraded surface | handler 直连 projection/read repository |
| `dispatch_inbound_event` | worker consumer | `IdentityOperationContextFactoryPort::from_worker_event_entry(...)` | public consumer receipt/replay surface | worker ack 后再异步写 repository |
| `dispatch_callback` | worker callback consumer | `IdentityOperationContextFactoryPort::from_worker_callback_entry(...)` | public callback receipt/replay surface | callback handler 直连 handoff intent repository |
| `dispatch_job` | jobs runner | `IdentityOperationContextFactoryPort::from_job_entry(...)` | public job report/replay surface | job runner 扫 store 或直接 repair/rebuild/publish |

#### 7.14.4 `IdentityApiEntryPort` / handler restrictions

API handler 的正式职责是把 route、headers/body marker、actor marker、idempotency key、request digest 和 public request DTO 转成 entry context + operation context,再通过 dispatch target catalog 调用 application facade。Handler 不拥有业务 transaction,也不拥有 projection read/write。

```rust
/// API entry adapter boundary; implemented by identity-api and wired to the application facade.
pub trait IdentityApiEntryPort {
    type ApiRequest;
    type ApiResponse;

    async fn handle_api_request(
        &self,
        entry_context: IdentityApiEntryContext,
        request: Self::ApiRequest,
    ) -> Result<IdentityApiDispatchResult<Self::ApiResponse>, ApplicationError>;
}
```

| API entry step | 必须做 | 不得做 |
|---|---|---|
| route / request mapping | 使用 route catalog 得到 `IdentityApiRouteRef`,保存 body-free request marker | 从 URL/raw body 拼 command ref、view ref、subject ref |
| digest / canonicalizer | 生成 request digest / canonical marker,交给 operation context / application idempotency | handler 直接 reserve idempotency 或存 stored result |
| operation context | 调 `IdentityOperationContextFactoryPort` 创建 API command/query context | 根据 operation name 字符串手写 channel/context |
| dispatch target | 调 `IdentityDispatchTargetCatalogPort` 验证 application target | route 直接映射到 repository/adapter 函数 |
| facade dispatch | 调 `IdentityApplicationFacade::dispatch_command/query` | 直连 repository、projection、resolver、publisher、handoff、UoW |
| response mapping | 将 application response/rejection/query visibility 映射为 API response surface | 把 dispatch success 写成 accepted 或 visible |

#### 7.14.5 `IdentityWorkerEntryPort` / consumer and callback restrictions

Worker entry 的正式职责是解析 inbound event / callback envelope marker、dedupe key、consumer binding、delivery attempt marker和 trace context,构造 worker entry context + operation context,再调用 application facade。Ack、retry、dead-letter 只表达 worker delivery 处理结果,不得绕过 application result。

```rust
/// Worker entry adapter boundary for inbound events and callbacks.
pub trait IdentityWorkerEntryPort {
    type WorkerEnvelope;
    type WorkerDispatchSurface;

    async fn handle_worker_envelope(
        &self,
        entry_context: IdentityWorkerEntryContext,
        envelope: Self::WorkerEnvelope,
    ) -> Result<IdentityWorkerDispatchResult<Self::WorkerDispatchSurface>, ApplicationError>;
}
```

| worker entry step | 必须做 | 不得做 |
|---|---|---|
| envelope mapping | 只保存 event/callback envelope safe marker、source event id、consumer binding ref | 保存 payload body、broker raw message、secret header |
| dedupe / digest | 生成 event/callback dedupe key 和 request digest marker | 直接查/写 idempotency repository |
| operation context | 调 factory 创建 inbound event 或 callback context | consumer service 内外混用 command channel |
| dispatch target | catalog 只能返回 application consumer/callback service target | 直接调 source resolver、reference repo、handoff repo |
| ack decision | 基于 application receipt/rejection/retryable error 和 Step 12 映射输出 worker delivery decision | 把 broker ack 当 consumer accepted,把 broker retry 当 business retry state |
| dead-letter | 只在 Step 12 定义的 permanent/pre-dispatch failure 下产生 safe issue marker | 直接把 payload body写入 dead-letter business store |

#### 7.14.6 `IdentityJobEntryPort` / job runner restrictions

Job runner entry 的正式职责是把 scheduler/CLI/ops request 解析为 job entry context、job scope marker、job run metadata、operation context和 application job request,然后调用 application facade。Job runner 不直接扫描 truth store,不直接 rebuild projection,不直接 publish outbox,不直接 deliver handoff。

```rust
/// Job entry adapter boundary for Identity operations jobs.
pub trait IdentityJobEntryPort {
    type JobInput;
    type JobDispatchSurface;

    async fn run_job(
        &self,
        entry_context: IdentityJobEntryContext,
        input: Self::JobInput,
    ) -> Result<IdentityJobDispatchResult<Self::JobDispatchSurface>, ApplicationError>;
}
```

| job entry step | 必须做 | 不得做 |
|---|---|---|
| job metadata | 生成 job entry ref、job run metadata ref、job scope marker、request digest | 用 timestamp/CLI args 拼 job report ref |
| operation context | 调 factory 创建 job context,channel 固定为 job | 复用 command/query/worker context |
| dispatch target | catalog 校验 job service target | job runner 直接调用 projection/outbox/handoff/report repository |
| facade dispatch | 调 `IdentityApplicationFacade::dispatch_job` | runner 内部实现 rebuild/publish/refresh/handoff retry |
| job report | application 返回 job report / replay surface | dispatch 成功就标 job succeeded |
| partial/failure | Step 12/13 后续定义 retryable/partial/failed report | 把 pre-dispatch target disabled 写成业务 job failed truth |

#### 7.14.7 Entry dispatch target catalog usage

`IdentityDispatchTargetCatalogPort` 必须只暴露 application service target,不得暴露 repository target、adapter target、store target或 broker target。Entry dispatch guard 接收 route/envelope/job marker、runtime assembly state、target catalog result和 adapter availability surface后,只能产生 entry validation / dispatch surface。

| source entry | catalog input | allowed target kind | forbidden target kind |
|---|---|---|---|
| API command route | `IdentityApiRouteRef` + command operation marker | application command service target | repository/UoW/idempotency/stored result target |
| API query route | `IdentityApiRouteRef` + query operation marker | application query service target | projection/read repo direct target |
| worker event binding | `IdentityConsumerBindingRef` + event envelope marker | application inbound consumer service target | reference repo/resolver direct target |
| worker callback binding | `IdentityConsumerBindingRef` + callback marker | application callback service target | handoff repo/delivery adapter direct target |
| job runner | `IdentityJobScopeMarkerRef` + job kind marker | application job service target | projection/outbox/publisher/handoff/report writer direct target |

#### 7.14.8 ack / retry / dead-letter / pre-dispatch failure boundaries

| boundary | 正式口径 | 禁止事项 |
|---|---|---|
| API pre-dispatch failure | route disabled、runtime not assembled、target missing、validation invalid 返回 API entry surface | 当成 command rejected stored result |
| API post-dispatch response | application response 决定 accepted/rejected/query visible/not visible/degraded | dispatch target found 就返回 accepted |
| worker ack | 只表示 inbound envelope 已按 application receipt/replay surface 安全处理 | ack 后再异步写 truth/receipt |
| worker retry | 只表示 delivery 可重试;retryability 来自 application error/rejection/Step 12 mapping | adapter exception raw body 直接写 business state |
| worker dead-letter | 只表示 entry/adapter 层永久无法处理,必须带 safe issue marker | dead-letter 作为 consumer receipt |
| job pre-dispatch failure | runtime/target/config 失败只产生 entry dispatch failure | 写 job report succeeded/failed truth |
| job post-dispatch report | application job service 创建 stored/replayable job report | job runner 根据 process exit code 直接写 report |

#### 7.14.9 fake / durable parity

| entry surface | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| API entry | fake API handler 走 context factory、dispatch catalog、facade | durable API handler 同一路径 | fake handler 直接调用 repo/service internals |
| worker entry | fake worker 走 envelope marker、dedupe digest、facade receipt | durable worker 同一路径 | fake ack 直接表示 consumer accepted |
| job entry | fake job runner 走 job context、scope marker、facade report | durable job runner 同一路径 | fake job 直接修改 projection/outbox store |
| dispatch guard | fake/durable 均只允许 application target | durable 不暴露 adapter/store target | 测试专用 target 绕过 catalog |
| pre-dispatch failure | fake/durable 均返回 entry surface,不保存 business result | durable runtime/config failure 同样不写业务结果 | fake 为方便测试写 stored result |
| application result | fake/durable entry 都只转发 application produced result | durable 不重解释 application result | entry 重算 accepted/query visibility |

#### 7.14.10 后续承接表

| 7.8 结论 | Step 8 承接 | Step 9/12/13/14/16 承接 |
|---|---|---|
| API handler 只经 facade | API request/response DTO 和 handler result envelope | handler flow、public error mapping、duplicate replay tests |
| worker consumer/callback 只经 facade | inbound event/callback envelope DTO、receipt DTO | consumer/callback flow、ack/retry/dead-letter matrix、receipt replay |
| job runner 只经 facade | job request/report DTO | job flow、job report replay、runtime config binding、job tests |
| dispatch target catalog only application target | route/envelope/job target marker schema | service target matrix、entry boundary tests |
| pre-dispatch failure not business result | entry validation / dispatch failure surface | Step 12 error mapping、Step 13 no stored result before application boundary |
| fake/durable entry parity | test fixture entry schema | Step 16 boundary tests;7.9 infra/fake audit |

#### 7.14.11 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 entry/facade restriction | 通过 | 未写 DTO、flow、state matrix、DDL、config schema、adapter implementation |
| API 是否禁止直连 port | 通过 | §7.14.4 禁止 handler 调 repository/projection/resolver/publisher/handoff/UoW |
| worker 是否禁止把 ack 当业务成功 | 通过 | §7.14.5 / §7.14.8 固定 ack/retry/dead-letter 只是 delivery surface |
| jobs 是否禁止直接扫 store / repair | 通过 | §7.14.6 禁止 job runner 直连 projection/outbox/handoff/report repo |
| dispatch target 是否只指向 application service | 通过 | §7.14.7 固定 allowed target kind |
| pre-dispatch failure 是否不写业务结果 | 通过 | §7.14.2 / §7.14.8 固定 entry surface 与 application result 分离 |
| fake/durable parity 是否覆盖 entry | 通过 | §7.14.9 固定 fake entry 不得绕过 facade |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.9` | 7.8 已审核通过;7.9 已写入并停审 |

#### 7.14.12 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| API command | handler 构造 entry/context 后调用 facade command | handler 直接调用 member repository |
| API query | handler 调 facade query,由 application 返回 visible/not visible/degraded | handler 直接读 projection store 并拼 view |
| request digest | handler 生成 digest marker,application idempotency reserve | handler 自己写 idempotency record |
| dispatch target | catalog 返回 application service target | route 映射到 SQL repository function |
| worker consumer | worker envelope -> operation context -> facade receipt | worker ack 后后台写 reference state |
| worker ack | ack 表示 application receipt/replay 已安全返回 | broker ack 等于 consumer accepted |
| worker dead-letter | permanent delivery failure 带 safe issue marker | dead-letter 保存 raw payload body |
| callback | callback 经 facade 更新 handoff receipt | callback handler 直连 handoff repository |
| job runner | runner 经 facade 执行 publish/rebuild/refresh/report job | runner 直接扫描 outbox/projection store |
| pre-dispatch failure | runtime not assembled 返回 entry dispatch failure | 保存 rejected command result 或 failed job report |
| fake entry | fake API/worker/job 走同一 facade/guard | fake entry 直接访问 in-memory map |

### 7.15 7.9 infra adapter implementation contract and fake equivalence

本批定义 `identity-infra` 实现 application port 的边界契约、runtime wiring 规则、durable/fake/controlled/disabled adapter 等价语义和 fake 不私有补口审计。本批不写具体 adapter implementation code、DDL、config schema、DTO、函数级 flow、状态矩阵或测试代码;只固定实现者在 infra 层可以做什么、必须暴露什么、以及发现缺口时必须回 Step 7/6 而不是在 fake/runtime 里私补。

#### 7.15.1 7.9 capability / 接缝清单

| infra capability | 覆盖 port family | 实现方 | 调用方 | Step 6 来源 | 后续承接 |
|---|---|---|---|---|---|
| durable repository adapters | 7.3~7.6 repositories | `identity-infra` durable store adapters | application services only | §7.20.1~§7.20.4 repository 启动清单 | Step 11 persistence;Step 16 repository tests |
| in-memory fake runtime | 7.1~7.8 all formal ports | `identity-infra` fake runtime | application tests / local runtime | §7.20.7 fake equivalence | Step 16 fake parity tests |
| controlled adapters | external resolver / publisher / handoff / availability ports | `identity-infra` controlled adapters | application services / jobs | §7.17 adapter availability;§7.20.5 outbox/handoff/adapter | Step 14 config;Step 16 controlled failure tests |
| disabled adapters | same adapter ports with disabled surface | `identity-infra` disabled adapters | application services / jobs | §7.17 `IdentityAdapterAvailability` | Step 12 disabled mapping;Step 14 config |
| runtime wiring | application port graph + facade assembly | `identity-infra` runtime builder | API/worker/jobs entry receives facade only | §7.17 runtime assembly;7.8 facade restriction | Step 14 runtime config;Step 15 observability |
| safe issue mapping | repository/resolver/publisher/handoff/runtime failures | infra adapters return `ApplicationError` / safe issue refs | application service | Step 6 issue/ref markers;7.7 outcome surface | Step 12 error recovery |
| no private surface audit | fake/durable use same official port signatures | infra + Step 16 tests | design/implementation reviewer | §7.20.8 redlines | 7.10 cross audit |

#### 7.15.2 infra implementation 通用 contract 规则

| 规则 | 正式口径 |
|---|---|
| infra implements, not defines | `identity-infra` 只实现 `identity-application` 已定义的 trait / port,不得在 infra 内新增业务 repository、resolver、subject mapper、view lookup 或 stored result surface |
| no business invariant | infra adapter 不新增 domain invariant、不推进 domain state、不改写 application flow;业务判断必须在 domain/application |
| no hidden transaction semantics | durable UoW / fake UoW 必须遵守 7.1/7.2 的 begin/commit/rollback/cursor 分配语义;不得在 adapter 内隐式 commit 或补 side effect |
| same public error shape | durable/fake/controlled/disabled adapter 对同一 port 的 missing/conflict/unavailable/disabled/unsupported 必须返回同类 `ApplicationError` 或 safe issue marker |
| no raw body persistence | infra adapter 不保存外部 body、broker payload、raw config、secret、receipt body、memory text、archive package 或 raw diagnostic |
| no private fallback | fake/durable 均不得通过私有 map、字符串解析、default valid、test-only hook、scan all store 或 current truth rebuild 补正式 port 缺口 |
| deterministic tests only through config | fake 可通过测试 fixture / controlled config 预置返回,但返回 shape 必须是正式 port shape |
| disabled is visible | disabled adapter 必须返回 disabled/unavailable safe surface,不得伪造 Published、Delivered、Valid、Visible 或 Completed |
| runtime assembly is not business health | `IdentityRuntimeAssemblyState::Assembled` 只表示 wiring ready,不代表 resolver valid、publisher delivered、handoff completed 或 truth accepted |

#### 7.15.3 durable repository adapter contract

| repository family | durable 必须实现 | durable 禁止事项 |
|---|---|---|
| core truth repositories | versioned read/save/list、unique lookup、expected_version conflict、terminal hold | hidden read on save、query miss auto-create、source version 当 optimistic version |
| trace/audit/history/handoff repositories | append-only create、versioned correction/update、by subject/cursor/member/target lookup | overwrite old trace、implicit audit trail creation、HTTP 2xx 标 handoff delivered |
| projection/read/reference/report repositories | stable lookup、stale mark、versioned projection/reference read/save、typed sidecar with explicit bundle key、report-only save | query 拼 view ref、query rebuild、reference state 替 typed sidecar、保存 raw diagnostic |
| outbox/result/idempotency repositories | pending list、payload marker/state update、reserve(context)、complete(result_ref)、typed stored save/get | publish failure 回滚 truth、duplicate 重跑 mutation、stored result missing 时临时拼 response |

| durable contract | 正式口径 |
|---|---|
| optimistic conflict | 必须可区分 version conflict、not found、unique conflict、wrong result kind、missing stored result |
| page / cursor | page cursor 只做 repository pagination,不得当 truth cursor/job cursor/version |
| transaction | save/append/complete/mark_stale 必须接收同一 UoW,不得在 adapter 方法内开启隐藏事务 |
| body-free | 只保存 refs、markers、safe summaries、state、version、cursor、issue refs;外部正文留在外部系统 |

#### 7.15.4 in-memory fake runtime contract

```rust
/// In-memory runtime used for Identity application tests and local deterministic execution.
pub struct IdentityInMemoryRuntime {
    /// Implements the same application ports as durable infra.
    pub port_surface: IdentityRuntimePortSurface,
    /// Deterministic fake clock and id generator configuration.
    pub deterministic_sources: IdentityDeterministicSourceSet,
    /// Controlled external adapter fixtures exposed through formal port results.
    pub controlled_fixtures: IdentityControlledFixtureSet,
}
```

| fake area | 必须等价 | 禁止事项 |
|---|---|---|
| version | create/read/save 后 version 单调;conflict 可复现 | timestamp/digest 当 version |
| UoW/cursor | rollback 不泄露 staged writes/cursors;commit 后 cursor 可断言 | service/fake 直接分配 cursor 字符串 |
| subject mapper | 与 durable 共享 canonical key table | fake trace/audit/outbox 用不同 key 或私有 map |
| projection lookup | missing lookup 返回正式 missing/degraded surface | fake query 扫 store 或拼 view ref |
| reference bundle | typed sidecar save 使用正式 reference_ref + expected_version | fake 将 source ref 自动当 bundle key |
| idempotency/result | same key/digest replay;different digest conflict;missing stored result defect | duplicate 时重跑 mutation |
| publisher/handoff | outcome/receipt/issue 由 fixture 明确给出 | fake 默认 Published/Delivered |
| adapter availability | fake/controlled/disabled mode 可见 | disabled mode 伪造 external success |
| entry facade | fake API/worker/jobs 走 same facade/dispatch guard | 测试直接访问 fake maps |

#### 7.15.5 controlled / disabled adapter contract

| adapter mode | 使用场景 | 必须返回 | 禁止事项 |
|---|---|---|---|
| durable/endpoint | future real adapter or integration-like runtime | formal safe summary/outcome/receipt/issue shape | 暴露 raw endpoint、secret、external body |
| fake | deterministic local/test success/failure | fixture-defined formal result | opaque ref 默认 valid |
| controlled | failure injection / degraded scenario | configured valid/stale/unavailable/invalid/retryable/permanent outcome | 通过 panic/raw error 模拟业务失败 |
| disabled | feature disabled / missing binding | disabled/unavailable issue surface | 返回 Published/Delivered/Valid/Completed |

Controlled adapter 只允许控制正式 output variant,不得增加新状态或新 error string 作为业务规则。若 Step 12/14 尚未定义某个 failure mapping,controlled adapter 只能返回 generic unavailable / disabled safe surface,不能创建新的 domain/application 状态。

#### 7.15.6 runtime wiring contract

| runtime wiring item | 正式口径 | 禁止事项 |
|---|---|---|
| port graph | runtime builder 把 durable/fake/controlled/disabled implementations 装配成 application facade | API/worker/jobs 接收 repository/publisher/handoff adapter |
| assembly state | NotStarted/Validated/Assembled/Degraded/Failed 只表达 wiring lifecycle | assembled == adapter healthy/business accepted |
| adapter catalog | adapter ref/mode/availability 来自 formal catalog/config shell | endpoint URL/raw topic/raw target 当 adapter identity |
| dispatch catalog | route/envelope/job target 只指向 application service target | target 指向 SQL repo、publisher、projection store |
| config evidence | runtime 可保留 body-free config evidence/issue ref | 保存 raw env、secret、full config body |
| startup failure | missing required port/config produces runtime assembly failed/degraded surface | 自动降级成 fake success |
| observability | runtime log/metric 可记录 port family、adapter ref、issue ref | log/metric 替代 business trace/audit/result |

#### 7.15.7 adapter error safe issue mapping

| source | infra 映射为 | application 可做 | infra 不得做 |
|---|---|---|---|
| durable store not found | `ApplicationError::NotFound` / typed missing | 按 Step 9/12 映射 rejected/degraded/not visible | fake 自动创建 |
| optimistic conflict | `ApplicationError::VersionConflict` | rollback/retry/reject per flow | overwrite current value |
| store unavailable | dependency unavailable issue | return delayed/degraded/retryable | fallback to fake store |
| resolver invalid/stale/unavailable | resolver formal state / safe issue | policy/precheck/rejected/degraded | parse external body into truth |
| publisher failure | formal publisher outcome / issue marker | mark failed/permanent per flow | raw adapter exception decides state in service |
| handoff failure | formal handoff outcome / issue/receipt marker | update handoff intent state | HTTP 2xx without receipt == delivered |
| disabled adapter | disabled issue surface | pre-dispatch / dependency disabled | fake success |

#### 7.15.8 private port / private map blocker rule

实现或测试阶段只要出现以下任一情况,必须暂停并回 Step 7/6 闭口:

| 触发信号 | 必须暂停原因 | 正确闭口 |
|---|---|---|
| fake 需要额外 map 才能通过测试 | 正式 port 缺读取面或 key 来源 | 补正式 repository/resolver/lookup port |
| durable adapter 需要解析 opaque ref 字符串 | ref/subject/view/scope 规则未闭合 | 补 formal mapper / index lookup |
| fake 默认 external ref valid | resolver state/source summary 未闭合 | 补 resolver fixture shape 和 invalid/unavailable 分支 |
| entry test 直接调 fake store | 违反 7.8 facade boundary | 通过 application facade / dispatch catalog |
| adapter error string 决定 retry/dead-letter | outcome 分类未闭合 | 补正式 outcome enum / mapping |
| duplicate test 重跑 mutation | stored result surface 不完整 | 补 typed save/get / wrong-kind/missing mapping |
| query missing 时 fake rebuild view | query no-write 被破坏 | 补 job/command rebuild flow 或 projection lookup missing surface |

#### 7.15.9 7.9 后续承接表

| 7.9 结论 | Step 11 承接 | Step 12/14/16 承接 |
|---|---|---|
| durable repository adapter contract | optimistic version、UoW、persistence schema、unique/index/read/write order | repo error mapping;repository tests |
| fake runtime same surface | fake storage behavior and fixture setup | targeted fake parity tests |
| controlled/disabled adapters | adapter binding and failure injection config | disabled/degraded/error recovery tests |
| runtime wiring contract | transaction/persistence not hidden by runtime | config shell;startup observability |
| no private map blocker rule | implementation blocker handling | Step 16 test cut for fake private surface |

#### 7.15.10 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 infra/fake contract | 通过 | 未写 adapter code、DTO、flow、state matrix、DDL、config schema |
| infra 是否只实现 application port | 通过 | §7.15.2 固定 infra implements, not defines |
| durable/fake 是否同 surface | 通过 | §7.15.3~§7.15.4 固定同一正式 port surface |
| controlled/disabled 是否不伪成功 | 通过 | §7.15.5 明确 disabled/controlled 返回正式 safe surface |
| runtime wiring 是否不绕过 facade | 通过 | §7.15.6 固定 entry 只接 application facade |
| adapter error 是否 safe issue mapping | 通过 | §7.15.7 固定 raw body/error 不入业务状态 |
| private map blocker 是否明确 | 通过 | §7.15.8 明确 fake 私补即暂停回设计 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `7.10` | 7.9 已审核通过;7.10 已写入并停审 |

#### 7.15.11 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| infra port | durable adapter 实现 `GlobalMemberRepository` | infra 新增 `SqlMemberLookupPort` 给 service 用 |
| fake repository | fake 和 durable 都通过 `get_member_with_version` | fake 用私有 `members_by_source` map 补缺口 |
| version conflict | fake/durable 都返回 `VersionConflict` | fake 覆盖旧值让测试通过 |
| projection lookup | fake missing lookup 返回正式 missing/degraded | fake 拼 `member-summary:<id>` |
| reference sidecar | fake 使用 explicit reference_ref + expected_version | fake 把 source ref 当 bundle key |
| resolver | controlled fixture 返回 valid/stale/unavailable | fake opaque ref 默认 valid |
| publisher | fake 返回 configured Published/Retryable/Permanent | fake publish 直接表示 downstream consumed |
| handoff | Delivered 必须有 receipt marker | HTTP 2xx / fake success 标 delivered |
| disabled adapter | disabled issue surface | disabled 返回 valid/delivered |
| runtime wiring | API/worker/jobs 只拿 facade | handler 拿 repository / publisher |
| error mapping | raw adapter error 映射 safe issue ref | 保存 raw stack / external body |
| private map | 发现缺口回 Step 7 补 port | 为测试临时暴露 fake map |

### 7.16 7.10 cross-module seam audit and Step 8 entry conditions

本批不新增 port、trait、DTO、flow、状态矩阵、DDL、config schema 或 implementation code。本批只审计 `7.1`~`7.9` 是否已经承接 Step 6.10 启动清单、Step 6.8 字段暂停条件、Step 6.9 状态暂停条件、DDD-S6-OPEN 中归属 Step 7 的项目和 DDD-S7-OPEN 项,并给出进入 Step 8 的条件。

#### 7.16.1 7.10 scope / 审计规则

| 审计范围 | 本批做什么 | 本批不做什么 |
|---|---|---|
| Step 6.10 启动清单 | 检查 core repo、mapper/resolver、projection/read/report、outbox/handoff/adapter、application support、fake equivalence 是否都有 Step 7 承接 | 不新增新的对象或 port family |
| Step 6.8 字段暂停条件 | 检查 id/ref/cursor/version/key/subject/view/source/receipt 的正式来源是否已有 port/helper承接或后续 Step 归属 | 不定义 DTO 字段 schema |
| Step 6.9 状态暂停条件 | 检查状态 owner、终态、禁止混用是否已有 repository/adapter/facade/fake contract 防越界 | 不写完整状态矩阵 |
| DDD-S6-OPEN | 标注 Step 7 已闭口、后续 Step 闭口或仍需 blocker 的项目 | 不提前解决 Step 8/9/10/11/12/13/14 的问题 |
| DDD-S7-OPEN | 检查 Step 7 自己的 open item 是否已全部闭口 | 不创建 Step 8 文件 |

#### 7.16.2 Step 6.10 启动清单承接审计

| Step 6.10 capability | Step 7 承接位置 | 审计结论 | 备注 |
|---|---|---|---|
| core truth repository | 7.3 `GlobalMemberRepository` / `GlobalLifecycleRepository` / `RoleCapabilityRepository` / `CareerRecordRepository` / `MemoryReferenceRepository` | 闭合 | versioned read/save/list、append-only、duplicate/source/callback lookup 已覆盖 |
| mapper / resolver | 7.1 subject/marker mapper;7.5 read visibility/reference;7.7 external source/reference/adapter resolver | 闭合 | DTO 返回 schema、public rejection/degraded 留 Step 8/12 |
| projection / read / report | 7.5 projection/read/reference/maintenance/report repositories | 闭合 | stable lookup、versioned reference、maintenance expansion、report-only writer 已覆盖 |
| outbox / handoff / adapter | 7.6 outbox/result/idempotency;7.7 topic/publisher/handoff/availability | 闭合 | payload DTO、retry matrix、config binding 留 Step 8/12/14 |
| application support | 7.1 helpers;7.2 clock/id/UoW/context/dispatch;7.6 stored result/job report | 闭合 | canonical digest schema、public result DTO 留 Step 8/13 |
| fake equivalence | 每批 fake parity + 7.9 infra/fake 总审计 | 闭合 | Step 16 需要转成 targeted tests |
| Step 7 红线 | 7.4 red线、7.8 entry restriction、7.9 private map blocker | 闭合 | 实现阶段若命中 private map/缺 port 仍需暂停回设计 |

#### 7.16.3 Step 6.8 字段暂停条件承接审计

| 字段族 / 暂停条件 | Step 7 承接 | 审计结论 | 后续归属 |
|---|---|---|---|
| id/ref 不能拼接 | 7.2 `IdentityIdGeneratorPort`;7.1 subject/marker key table;7.5 stable view lookup | Step 7 闭合 | Step 8 DTO 只引用正式 ref;Step 11 PK/unique |
| cursor/version/key 不可混用 | 7.1 `IdentityVersion` / repository cursor / UoW cursor;7.2 cursor assigner;7.3~7.6 expected_version 来源 | Step 7 闭合 | Step 11/13 细化 transaction/idempotency |
| accepted subject 同源 | 7.1 `IdentityTruthChangeSubjectMapper`;7.4 trace/audit;7.6 outbox | Step 7 闭合 | Step 9 flow 使用 mapper output |
| marker subject 来源 | 7.1 `IdentityMarkerSubjectMapper`;7.4 marker trace | Step 7 闭合 | Step 9 consumer/job marker flow |
| view ref 稳定 lookup | 7.5 `IdentityProjectionRepository` lookup/read/stale | Step 7 闭合 | Step 8 query DTO;Step 11 projection index |
| read subject/scope | 7.5 `IdentityReadVisibilityRepository`;7.8 entry facade restriction | Step 7 闭合 | Step 8/9 query request mapping |
| external source/reference/bundle | 7.5 `IdentityReferenceStateRepository`;7.7 external source/reference resolver | Step 7 闭合 | Step 8 safe summary DTO;Step 11 typed sidecar storage |
| receipt/issue marker | 7.4 handoff intent repo;7.6 stored result/job report;7.7 handoff/publisher outcomes | Step 7 闭合 | Step 8 receipt DTO;Step 12 recovery mapping |
| runtime/config marker | 7.8 entry restriction;7.9 runtime wiring;7.7 adapter availability | Step 7 闭合 | Step 14 config schema |

#### 7.16.4 Step 6.9 状态暂停条件承接审计

| 状态族 / 禁止混用 | Step 7 防线 | 审计结论 | 后续归属 |
|---|---|---|---|
| domain truth 只能由 command/policy 推进 | 7.3 core repository 只由 application service 调用;7.8 entry 不直连 repo | Step 7 闭合 | Step 9/10 迁移矩阵 |
| query 不写状态 | 7.5 projection/read repositories 明确 query no rebuild/no write;7.8 handler 只经 facade | Step 7 闭合 | Step 9 query flow;Step 16 tests |
| outbox Published 不等于 consumed | 7.6 outbox repo;7.7 publisher outcome;7.9 fake 不伪 consumed | Step 7 闭合 | Step 10/12 publish state |
| handoff Delivered 必须有 receipt | 7.4 handoff intent repo;7.7 handoff delivery outcome;7.9 fake delivered guard | Step 7 闭合 | Step 10/12 handoff state |
| side effect failure 不回滚 accepted truth | 7.6 outbox/result;7.7 publisher/handoff outcome;7.9 adapter error mapping | Step 7 闭合 | Step 9/11 transaction order |
| idempotency completed 必须有 stored result | 7.6 idempotency/result symmetry | Step 7 闭合 | Step 13 replay matrix |
| entry dispatch 不等于 business accepted | 7.8 entry/facade restriction | Step 7 闭合 | Step 8/12 handler result mapping |
| assembled 不等于 adapter healthy | 7.9 runtime wiring;7.7 adapter availability | Step 7 闭合 | Step 14/15 runtime observability |
| fake 私有 state 禁止 | 7.9 private map blocker rule | Step 7 闭合 | Step 16 fake parity tests |

#### 7.16.5 DDD-S6-OPEN 归属审计

| open item 范围 | 编号 | Step 7 处理结果 | 后续归属 |
|---|---|---|---|
| Step 7 已闭口 | 001,002,003,014,021,022,023,025,026,027,028,031,033,036,039,042,043,044,048,052,053,060,061,062,063 | 已通过 7.1~7.9 给出 helper、port、resolver、mapper、lookup、stored result、operation context、adapter availability、fake equivalence 或承接编号 | 无 Step 7 blocker |
| Step 8 protocol schema | 004,005,007,009,011,012,015,018,020,024,029,030,032,035,037,040,041,049,050,051,058 | Step 7 已给 port/source/marker/facade 输入,public DTO / envelope / receipt / handler surface 留 Step 8 | Step 8/12/13/14 |
| Step 9 flow | 013,016,019,027,038,052,055 | Step 7 已给 resolver/repo/port;分支选择、pending/rejected/accepted flow 留 Step 9 | Step 9/12 |
| Step 10 state matrix | 006,008,010,013,016,019,038,056,057 | Step 7 未新增状态;状态迁移、terminal reopen、pending 持久化留 Step 10 | Step 10/12 |
| Step 11 persistence / transaction | 017,021,025,026,028,029,038,043 | Step 7 已给 read/save/version/cursor surface;DDL、unique、transaction order 留 Step 11 | Step 11/13 |
| Step 12 recovery / public error | 009,012,013,024,030,034,037,041,049,050,058,059 | Step 7 已给 issue/outcome/stored result input;错误分类和 public mapping 留 Step 12 | Step 12/13 |
| Step 14 config binding | 008,020,033,036,045,046,047,048,050,051 | Step 7 已给 adapter availability / runtime wiring / target binding 接缝;配置 schema 留 Step 14 | Step 14/15 |

结论:DDD-S6-OPEN 中归属 Step 7 的项目已在 7.1~7.9 闭合。剩余 open item 是后续 Step 的正式输入,不是 Step 7 blocker。

#### 7.16.6 DDD-S7-OPEN 闭口审计

| 编号 | 结论 | 证据 |
|---|---|---|
| DDD-S7-OPEN-001 | 已闭口 | 7.2 `IdentityClockPort` 使用 Step 6 identity wrapper |
| DDD-S7-OPEN-002 | 已闭口 | 7.1 shared helper 定义 application-local version/page |
| DDD-S7-OPEN-003 | 已闭口 | 7.1/7.2 UoW cursor helper / cursor assigner |
| DDD-S7-OPEN-004 | 已闭口 | 7.1 accepted subject mapper + canonical key table |
| DDD-S7-OPEN-005 | 已闭口 | 7.1 marker subject mapper |
| DDD-S7-OPEN-006 | 已闭口 | 7.2 `IdentityIdGeneratorPort` 分组覆盖 |
| DDD-S7-OPEN-007 | 已闭口 | 每批 fake parity + 7.9 汇总审计 |
| DDD-S7-OPEN-008 | 已闭口 | 每批后续承接表 + 本 7.10 总审计 |
| DDD-S7-OPEN-009 | 已闭口 | 7.5 projection/read/reference/report repositories |
| DDD-S7-OPEN-010 | 已闭口 | 7.6 idempotency/result symmetry |
| DDD-S7-OPEN-011 | 已闭口 | 7.7 resolver/publisher/handoff/adapter outcome |
| DDD-S7-OPEN-012 | 已闭口 | 7.8 entry/facade restrictions |
| DDD-S7-OPEN-013 | 已闭口 | 7.9 infra/fake equivalence |

#### 7.16.7 进入 Step 8 前 blocker 审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在 Step 7 未定义但 Step 8 必须引用的 helper / port | 未发现 | Step 8 若新增 DTO 字段需要新来源,必须回 Step 7 或 Step 6 |
| 是否存在 query/view ref 只能拼接的问题 | 未发现 | 7.5 已给 stable lookup;Step 8 只定义 public DTO |
| 是否存在 subject/audit/outbox key 只能拼接的问题 | 未发现 | 7.1 mapper + canonical key 已闭合 |
| 是否存在 source/reference expected_version 来源缺口 | 未发现 | 7.5 reference state + typed sidecar bundle version 已闭合 |
| 是否存在 duplicate replay 只能重跑 mutation 的缺口 | 未发现 | 7.6 stored result generic shell + typed command envelope / typed receipt / job report save-load symmetry 已闭合 |
| 是否存在 entry 绕过 application 的缺口 | 未发现 | 7.8 facade restriction + 7.9 runtime wiring 已闭合 |
| 是否存在 fake 必须私有补口的缺口 | 未发现 | 7.9 定义 blocker rule;实现阶段命中需回设计 |

Step 7 当前没有阻止进入 Step 8 的 design blocker。

#### 7.16.8 Step 8 启动输入清单

| Step 8 protocol family | 必须承接的 Step 7 surface |
|---|---|
| command request / response | operation context, idempotency key/digest, stored accepted/rejected generic shell, typed command accepted/rejected envelope, command effect summary, trace/audit/outbox refs |
| query request / response | read visibility resolution, stable view lookup, page DTO mapping, not visible/degraded surface |
| inbound event / callback | worker entry context, consumer binding, dedupe key, source/reference resolver, stored consumer/callback receipt |
| outbound event | outbox record, payload marker, topic key, outbox subject, publish outcome marker |
| job request / report | job entry context, job report repository, stored job report, maintenance expansion, projection/reference/report ports |
| handoff / archive protocol | handoff intent, safe material ref, target/scope resolver, receipt/issue marker |
| public error / validation surface | entry validation issue, adapter availability issue, resolver invalid/unavailable, stored result missing/wrong-kind |

#### 7.16.9 7.10 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只做 cross audit | 通过 | 未写 DTO、flow、state matrix、DDL、config schema、implementation code |
| Step 6.10 启动清单是否全部承接 | 通过 | §7.16.2 |
| Step 6.8 字段暂停条件是否映射 | 通过 | §7.16.3 |
| Step 6.9 状态暂停条件是否映射 | 通过 | §7.16.4 |
| DDD-S6-OPEN Step 7 归属是否闭合 | 通过 | §7.16.5 |
| DDD-S7-OPEN 是否闭合 | 通过 | §7.16.6 |
| 是否存在进入 Step 8 blocker | 未发现 | §7.16.7 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | Step 8 | 用户审核通过 Step 7 后进入 protocol contracts |

#### 7.16.10 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| 7.10 scope | 只审计 7.1~7.9 和进入 Step 8 条件 | 新增一组 repository trait |
| S6 open item | 标注 Step 7 已闭口或后续 Step 归属 | 把 Step 8 DTO 问题提前写成 trait |
| 字段暂停条件 | 确认 subject/view/version/cursor 来源已闭合 | 发现字段缺口后在 Step 8 临时拼 ref |
| 状态暂停条件 | 只确认 port/facade/fake 防越界 | 在 Step 7 新增状态 variant |
| Step 8 启动 | 列出 protocol family 需要承接的 surface | 直接创建 Step 8 文件并填 DTO |

---

## 8. 复杂度判断 / 是否拆模块、协议族、接口或附录

Step 7 复杂度高,必须拆批次执行。对比 governance 后,identity 当前不应只按 broad port family 写,而要先闭 shared helper 和基础 port,再展开 truth repository、append-only、projection/reference/read/report、outbox/result/idempotency、external seam、entry restriction、infra/fake equivalence 和 cross audit。

因此本 Step 采用 `7.0~7.10` 小循环。当前已完成 `7.0` 重新规划框架、`7.1 shared application port helpers`、`7.2 application 基础 ports`、`7.3 core truth repository ports`、`7.4 append-only / audit / history / trace repositories`、`7.5 projection / read / reference / report repositories`、`7.6 outbox / result / idempotency repositories`、`7.7 external resolver / publisher / handoff / adapter ports`、`7.8 API / worker / jobs entry restrictions and application facade access`、`7.9 infra adapter implementation contract and fake equivalence` 和 `7.10 cross-module seam audit and Step 8 entry conditions`。Step 7 已完成,等待审核后进入 Step 8 protocol contracts。

---

## 9. 回填草稿

正式 `03-详细设计.md` §5 / §6 后续应从已审核的 Step 7 中间产物装配。当前 7.0、7.1、7.2、7.3、7.4、7.5、7.6、7.7、7.8、7.9 和 7.10 可回填为:

```text
Step 7 Trait / Port / Adapter 契约采用 application-owned port family 小循环,并按 governance 成熟粒度拆分为 shared application port helpers、application 基础 ports、core truth repositories、append-only / audit / history / trace repositories、projection / read / reference / report repositories、outbox / result / idempotency repositories、external resolver / publisher / handoff / adapter ports、entry restrictions、infra adapter implementation / fake equivalence 和 cross-module audit。

`identity-application` 是唯一正式定义 repository、resolver、publisher、handoff、UnitOfWork、Clock、IdGenerator、idempotency、stored result、projection、reference、report writer 和 adapter boundary trait 的模块。`identity-infra` 只实现这些 port,`identity-api` / `identity-worker` / `identity-jobs` 只做 entry mapping 和 application service dispatch,不得直连 repository、publisher、projection store 或 handoff adapter。`identity-contracts` 和 `identity-domain` 不定义 infrastructure port。

每个批次必须先写 capability / 接缝清单,再写 trait / port contract,并回指 Step 6 对象能力、字段来源、状态 owner、终态或暂停条件。Step 7 不得新增 Step 6 未定义对象、状态、字段来源、cursor/version/key 来源、subject/view/ref 拼接规则或 fake 私有语义。缺口必须回 Step 6 或记录待确认事项。

shared application port helper 批次定义 IdentityTransactionRef、IdentityVersion、IdentityRepositoryCursor、IdentityRepositoryPage、Versioned<T>、Page<T>、VersionedRef<TRef>、IdentityUnitOfWork、IdentityUnitOfWorkManager、IdentityAcceptedSubjectRefs、IdentityTruthChangeSubjectMapper、IdentityAcceptedAuditTrailMarkers、IdentityAcceptedAuditTrailMarkerMapper、IdentityMarkerSubjectMapper、GlobalMemberRefSet、IdentityProjectionRefSet 和 ExternalReferenceRefSet。这些 helper 是 application-local surface,不直接进入 public DTO。IdentityVersion 只能来自 versioned read / create result / formal request version,不得与 source version、cursor、timestamp、digest 或 idempotency key 混用。IdentityUnitOfWork 负责分配 accepted truth cursor 和 reference marker cursor;cursor 只在 commit 后可见,rollback 不泄露。accepted subject mapper 必须从 typed truth ref 生成同源 trace/audit/outbox subjects;accepted audit marker mapper 必须从 operation context、accepted subjects、change kind 和 accepted cursor 生成 audit scope 与 visibility markers,不得用 query visibility 或默认 visible 代替;marker subject mapper 必须从 typed marker ref 生成 marker trace subject。fake runtime 与 durable adapter 必须使用同一 canonical key table、accepted audit marker table 和 cursor/version 语义,不得通过私有 map 补正式 port 缺口。

application 基础 port 批次定义 IdentityClockPort、IdentityIdGeneratorPort、IdentityUnitOfWorkManagerPort、IdentityCursorAssignerPort、IdentityOperationContextFactoryPort 和 IdentityDispatchTargetCatalogPort。IdentityClockPort 是 IdentityTimestamp 的唯一基础来源,不得替代 cursor、version 或 idempotency key。IdentityIdGeneratorPort 必须覆盖 core truth、read/trace/audit/projection/report、outbox/handoff、application support、entry/runtime 的 identity-owned id/ref 生成,domain object、entry module、repository adapter 和 fake runtime 不得临时拼接 id。UoW manager 与 cursor assigner 固定 accepted truth cursor 和 reference marker cursor 的分配时机、复用规则和 rollback 可见性。Operation context factory 必须按 command/query/consumer/job/handoff callback 固定 channel 和必填 marker,service flow 不得根据 operation name 字符串猜 channel。Dispatch target catalog 只返回 application service target,禁止 API/worker/jobs entry 直连 repository、UoW、publisher、handoff adapter 或 projection store。

core truth repository 批次定义 GlobalMemberRepository、GlobalLifecycleRepository、RoleCapabilityRepository、CareerRecordRepository 和 MemoryReferenceRepository。所有 repository trait 均由 identity-application 定义、identity-infra 实现,application service 是唯一调用方。需要 optimistic update 的 save 必须先通过 versioned read 获得 IdentityVersion,并在 save 时携带 expected_version 和同一 IdentityUnitOfWork。GlobalMemberRepository 支撑 member ref 唯一读取、anchor state 读取和 versioned save,不得 query miss 自动建档。GlobalLifecycleRepository 支撑 member lifecycle current read/save;save 必须显式接收 `member_ref` 作为 `identity_global_lifecycles` row key,并与 preceding versioned read 的 `member_ref` 一致,不得从 lifecycle state、reason、basis、actor、runtime 或 ProjectMember 状态推导 lifecycle key 或 lifecycle state。RoleCapabilityRepository 支撑 summary/snapshot versioned read/save 和 typed source lookup,不得保存 RoleDefinition / CapabilityDefinition / evidence body,也不得把 source version 当 optimistic version。CareerRecordRepository 支撑 append-only record create、member/source marker list、duplicate source lookup 和 correction relation read/update,不得覆盖旧 career record。MemoryReferenceRepository 支撑 member/memory/archive/handoff relation lookup、callback target lookup 和 versioned save,不得保存 memory body、archive package、receipt body或 callback raw body。

append-only / audit / history / trace repository 批次定义 IdentityTraceRecordRepository、IdentityAuditTrailRepository、IdentityTraceHistoryRepository 和 TraceHandoffIntentRepository。Step 6 已明确 HistoryRecord 并入 IdentityTraceRecord,因此 Step 7 不新增第二套 history truth。IdentityTraceRecordRepository 支撑 accepted trace、marker trace、correction trace 的 append-only create,并提供 by member、by subject、by cursor、by change kind 的读取面;旧 trace 的 correction 只能通过 loaded version 标记 superseded,不得覆盖或删除。IdentityAuditTrailRepository 支撑 audit trail by subject lookup、versioned get/save 和 body-free audit entry append;missing trail 必须由 service 使用 id generator 创建,repository 不隐式创建。IdentityTraceHistoryRepository 只是 trace/audit 只读 facade,用于 history query、report 和 handoff selection,不得新建 HistoryRecord 持久对象。TraceHandoffIntentRepository 支撑 pending handoff intent create/update、by member/trace/audit/target/retryable 读取和 versioned save;delivered 必须来自 formal HandoffReceiptRef,HTTP 2xx、request sent 或 job log success 不得伪装为 delivered。所有 append/update 都接收同一 IdentityUnitOfWork,subject 来自正式 mapper,cursor 来自 UoW / formal marker cursor,并保持 body-free。

projection / read / reference / report repository 批次定义 IdentityProjectionRepository、IdentityReadVisibilityRepository、IdentityReferenceStateRepository、IdentityMaintenanceRepository 和 IdentityReconciliationReportRepository。IdentityProjectionRepository 提供 stable member summary view lookup、view read、projection state versioned read/save、stale mark 和 affected projection expansion;query 不得拼 view ref,也不得因 missing/stale 触发 rebuild。IdentityReadVisibilityRepository 负责把 member summary、trace、audit、projection/reference state、report、outbox 和 handoff read request 映射为 prepared visibility access summary,从而给 VisibilityPolicy 提供 read subject、scope、visibility result、redaction marker 和 degraded/not visible 输入;`IdentityVisibilityAccessSummary.read_subject_ref` 是 service 构造 `IdentityVisibilityDecision.read_subject_ref` 的唯一正式来源,`IdentityVisibilityAccessSummary.redaction_marker_ref` 是 service 构造 redacted/not-visible public surface redaction marker 的唯一正式来源,service 不得从 route string、raw member id、view id、report id、outbox id、handoff id、scope、redaction profile、result ref 或字符串推断 subject/scope/redaction marker。IdentityQueryMaterialDegradationMapper 是 loaded material integrity degraded 的唯一正式 marker 来源,覆盖 member/career/memory/trace/audit 和 projection/reference/report/outbox/handoff operations reads;service 只能复制 summary,不得从 repository error、adapter diagnostic 或 fake 私有规则分类。IdentityReferenceStateRepository 以 ExternalReferenceRef 为 bundle key,所有 typed sidecar 保存必须显式传入同一 reference_ref 和 loaded bundle IdentityVersion;ExternalSourceVersionRef、IdentitySourceRef 和 safe summary ref 均不得替代 expected_version。IdentityMaintenanceRepository 只做 maintenance scope expansion,返回 projection/reference/report target,不得返回 core truth write target 或执行 repair。IdentityReconciliationReportRepository 只保存 body-free report-only finding/issue refs,不得保存 raw diagnostic、secret、external body 或 remediation plan。

outbox / result / idempotency repository 批次定义 IdentityOutboxRepository、IdentityIdempotencyRepository、IdentityStoredResultRepository、IdentityCommandEffectSummaryRepository 和 IdentityJobReportRepository。IdentityOutboxRepository 保存 accepted-only pending outbox、pending/retryable list、by subject/trace lookup 和 publish state update;publish failure 只更新 OutboxState 与 issue marker,不得回滚 accepted truth。IdentityIdempotencyRepository 的 reserve 必须接收 IdentityOperationContext,复制 operation name、channel、idempotency key 和 request digest;同 key 同 digest 且有 stored result 才 replay,同 key不同 digest 必须 conflict。IdentityStoredResultRepository 对 CommandAccepted、CommandRejected、ConsumerReceipt、JobReport 和 HandoffCallbackReceipt 提供 generic shell save/get 对称面,并对 command accepted/rejected 提供 typed envelope save/get 对称面;stored result 或 command typed envelope missing 不允许重跑 mutation。IdentityCommandEffectSummaryRepository 只保存 accepted truth、cursor、trace、audit、outbox、stale projection 和 stored result refs,不保存 command body、不决定 transaction order。IdentityJobReportRepository 保存 job run report,Partial / Failed / RetryableFailed 必须保留 safe issue refs,不得保存 raw job log 或把 partial 静默标成功。

external resolver / publisher / handoff / adapter port 批次定义 IdentityExternalSourceResolverPort、IdentityExternalReferenceResolverPort、IdentityAdapterAvailabilityPort、IdentityTopicBindingPort、IdentityOutboxPublisherPort、IdentityHandoffTargetPort 和 IdentityHandoffDeliveryPort。Resolver 只返回 body-free safe summary、source version、material marker、reference state 或 availability issue,不得返回 governance、method、work、memory、archive、evidence body。External reference resolver 必须显式区分 ExternalReferenceRef bundle key 与 local owner ref,不得把 business source ref 自动当 bundle key。Adapter availability 必须暴露 Available、Degraded、Unavailable、Disabled,disabled/fake/controlled adapter 不得伪造业务成功。Topic binding 和 publisher 只处理 payload marker,发布结果区分 Published、RetryableFailed、PermanentlyFailed、SkippedByPolicy 和 UnsupportedTopic;Published 只代表 outbound boundary,不代表 downstream consumed。Handoff target/delivery 只处理 safe material marker,target/scope 不暴露 raw path/bucket/secret,Delivered 必须同时带 HandoffAttemptRef 和 HandoffReceiptRef,HTTP 2xx、request sent 或 job log success 均不得当 delivered。

API / worker / jobs entry restriction 批次定义 entry module 进入 application 的唯一 facade 路径。`identity-api`、`identity-worker` 和 `identity-jobs` 只负责 route/envelope/job input 解析、body-free entry marker、request digest、operation context factory、dispatch target catalog 和 facade dispatch,不得直连 repository、UnitOfWork、resolver、publisher、handoff、projection/read/reference/report、idempotency 或 stored result port。IdentityApplicationFacade 是 entry-visible 的唯一 application 入口集合,具体 DTO schema 留 Step 8,函数级 flow 留 Step 9。Entry dispatch result 只表达 pre-dispatch / dispatch attempt,不等于 command accepted/rejected、query visible/not visible/degraded、consumer receipt、callback receipt 或 job report。Runtime not assembled、target disabled、adapter unavailable 等只能返回 entry surface,不得保存业务 rejected/stored result/job report。Worker ack/retry/dead-letter 只表达 delivery 处理结果,不能当 consumer accepted/rejected。Job runner 不得直接扫描 store、rebuild projection、publish outbox 或 deliver handoff;这些必须经 application job service。Fake API/worker/job entry 必须走同一 context factory、dispatch catalog 和 facade,不得用测试专用入口直连 in-memory map。

infra adapter implementation / fake equivalence 批次固定 `identity-infra` 只能实现 `identity-application` 已定义的 port,不得定义新的业务 repository、resolver、mapper、lookup 或 stored result surface。Durable repository adapters 必须实现 versioned read/save/list、unique lookup、append-only、stable projection lookup、explicit reference bundle sidecar、idempotency/result symmetry 和 body-free report/outbox/handoff surface,不得 hidden read-on-save、query rebuild、保存外部正文或用 source version 当 optimistic version。In-memory fake runtime 必须使用同一正式 port surface、同一 canonical subject key table、同一 UoW/cursor/version/idempotency/stored result 语义;缺口不得通过私有 map、default valid、scan all store、重跑 mutation 或测试专用 entry 解决。Controlled adapter 只能控制正式 output variant,disabled adapter 必须返回 disabled/unavailable safe issue surface,不得伪造 valid/published/delivered/completed。Runtime wiring 只把 port implementations 装配成 application facade,API/worker/jobs 只拿 facade 和 dispatch guard,不得拿 repository、publisher、handoff 或 projection store。Raw adapter error、config secret、external body、receipt body 和 diagnostic body 不进入业务状态;必须映射为 safe issue marker 或 `ApplicationError`。实现阶段只要 fake 需要私有 map、durable 需要解析 opaque ref、entry test 直连 store、adapter error string 决定状态、duplicate 重跑 mutation或 query miss rebuild view,必须暂停并回 Step 7/6 闭口。

cross-module seam audit 批次确认 Step 6.10 的 core repository、mapper/resolver、projection/read/report、outbox/handoff/adapter、application support、fake equivalence 和 Step 7 红线均已由 7.1~7.9 承接。Step 6.8 的 id/ref/cursor/version/key/subject/view/source/receipt 字段暂停条件均有正式 helper、mapper、lookup、versioned read/save、resolver、stored result 或 adapter outcome surface 承接。Step 6.9 的 truth/query/outbox/handoff/idempotency/entry/runtime/fake 状态混用风险均有 repository/facade/adapter/fake contract 防线。DDD-S7-OPEN-001~013 已全部闭口。DDD-S6-OPEN 中归属 Step 7 的项目已闭合,剩余项目按协议 schema、函数 flow、状态矩阵、事务持久化、错误恢复、幂等、配置和测试切口进入 Step 8~16。Step 7 当前没有阻止进入 Step 8 的 blocker。
```

当前不写入正式 `03-详细设计.md`。

---

## 10. 待确认事项

| 编号 | 待确认 | 影响 | 当前处理 |
|---|---|---|---|
| DDD-S7-OPEN-001 | `IdentityTimestamp` 最终使用 identity wrapper 还是复用 core 时间类型 | ClockPort 签名、contracts serialization | 已在 7.2 闭口;使用 Step 6 的 identity wrapper,ClockPort 返回 `IdentityTimestamp` |
| DDD-S7-OPEN-002 | shared helper 中 `IdentityVersion` / `IdentityRepositoryCursor` / `Versioned<T>` / `Page<T>` 的 application-local schema | repository read/list、Step 8 page DTO 映射 | 已在 7.1 闭口;public DTO 映射留 Step 8 |
| DDD-S7-OPEN-003 | truth cursor 与 reference marker cursor 是否均由 UnitOfWork helper 分配 | trace/outbox/projection stale、consumer marker、stored result | 已在 7.1/7.2 闭口;UoW manager / cursor assigner 是正式基础 port |
| DDD-S7-OPEN-004 | accepted subject mapper 是否返回 trace/audit/outbox 同源 subject refs,以及 canonical key table | trace/audit/outbox canonical subject、fake parity | 已在 7.1 闭口;7.4 已承接 trace/audit repositories;7.6 承接 outbox repositories |
| DDD-S7-OPEN-005 | marker trace subject mapper 是否覆盖 consumer/job/reference marker | reference-only trace marker、receipt trace ref | 已在 7.1 闭口;7.4 已承接 marker trace append;7.5/7.7 承接 marker flow source |
| DDD-S7-OPEN-006 | `IdGeneratorPort` 是否需要覆盖所有 trace/audit/outbox/history/report/job/result ids | factory 入参、append-only record id、stored result ref | 已在 7.2 闭口;按 core/read/outbox/handoff/application/entry 分组覆盖 |
| DDD-S7-OPEN-007 | fake equivalence 是每批内嵌还是 7.9 汇总为主 | durable/fake parity、test cuts | 每批写最小要求,7.9 做总审计 |
| DDD-S7-OPEN-008 | Step 7 port contract 是否直接标注 Step 8/9/10/11/13 承接编号 | 后续协议、flow、state、transaction、idempotency 可追溯性 | 每批写后续承接列,7.10 总审计 |
| DDD-S7-OPEN-009 | stable view lookup、read subject/scope、reference typed sidecar version 是否有正式 port surface | query/projection/reference 可落码性 | 已在 7.5 闭口;projection/read/reference/report repositories 分别承接 |
| DDD-S7-OPEN-010 | idempotency reserve context/channel、stored result rejected/receipt/job report save/load symmetry 是否闭合 | duplicate replay、consumer/job/callback replay | 已在 7.6 闭口;具体 DTO payload 和 replay matrix 留 Step 8/13 |
| DDD-S7-OPEN-011 | external resolver/publisher/handoff/adapter outcome 是否有 body-free 和 fake 等价 surface | source resolution、publish/handoff failure、adapter availability | 已在 7.7 闭口;具体 DTO/config/error mapping 留 Step 8/12/14 |
| DDD-S7-OPEN-012 | entry restriction / facade access / dispatch target catalog 是否闭合 | API/worker/job 不绕过 application,entry dispatch result 不等于业务结果 | 已在 7.8 闭口;具体 handler DTO、flow、ack/retry/dead-letter matrix 和 job report schema 留 Step 8/9/12/13 |
| DDD-S7-OPEN-013 | infra adapter implementation / fake equivalence 是否闭合 | durable/fake/controlled/disabled 同 surface,实现不私补 port 或业务规则 | 已在 7.9 闭口;具体 persistence DDL、config binding、error mapping tests 留 Step 11/12/14/16 |
| DDD-S7-OPEN-014 | Step 7 cross-module seam audit 是否完成,是否可进入 Step 8 | Step 6.10 / 6.8 / 6.9 / S6 open item / S7 open item 是否仍有 Step 7 blocker | 已在 7.10 闭口;未发现阻止 Step 8 的 Step 7 blocker |

---

## 11. 进入下一批条件

进入 Step 8 protocol contracts 前必须满足:

- 用户审核通过本次 Step 7 全部内容,尤其是 `7.10 cross-module seam audit and Step 8 entry conditions`。
- 保持正式 `03-详细设计.md` 不直接写入。
- 不创建 Step 8~19 文件。
- Step 8 必须创建/改写 `03_ddd_step_08_protocol_contracts.md`,不得提前创建 Step 9~19 文件。
- Step 8 必须按 API / command / query / inbound event / outbound event / callback / job / handoff protocol family 小循环停审,不得一次性生成全量 DTO 大表。
- Step 8 必须承接本 Step 的 helper、port、facade、resolver、stored result、entry、adapter outcome 和 fake parity 结论,不得新增没有 Step 6/7 来源的 public DTO 字段。
- Step 8 若发现 DTO 字段缺少正式来源、需要新 repository/lookup/resolver/save surface、或需要新增状态/对象,必须暂停并回 Step 6/7 闭口。
