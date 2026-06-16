# Step 6. 逐模块定义对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 回填章节: `03-详细设计.md` §6 对象实现契约,以及 §5 模块实现契约中的对象小节
> 生成日期: 2026-06-12
> 状态: 6.10 Step 7 承接清单和启动红线已完成,等待审核后进入 Step 7

---

## 1. Step 状态 + Step 内计划

本 Step 按“先框架,再分批补充”的方式执行。当前已完成 6.0 执行框架、批次表、模块执行顺序、shared vocabulary / typed ref / public marker 收敛表,已写入 6.A 身份锚定与成员真相、6.B 全局生命周期、6.C 角色能力摘要对象正文,并完成 6.1-a foundation id/ref/time/channel、6.1-b reason/basis/risk 与 6.1-c role/capability source/evidence/material marker 细化。

对比 `L1-governance` Step 6 后,本 Step 需要从“业务对象批次”升级为“对象契约完整闭环”:不仅要写 domain truth/state/policy,还必须补齐 shared type 细化、view/report、trace/audit/outbox/handoff、application helper、entry object、字段闭环表、状态闭环表和 Step 7 启动红线。已写 6.A~6.C 不删除,后续作为 6.2 domain core truth/state/policy 的已写正文输入,按新规划复核和必要补齐。当前已完成 6.10 Step 7 承接清单和启动红线,等待审核后进入 Step 7。

本 Step 不写 Step 7 的 port / adapter trait,不写 Step 8 的 DTO / event / job schema,不写 Step 9 的函数级 flow,不写 Step 10 的完整状态矩阵,不写 Step 11 的 DDL / repository save 事务,也不修改正式 `03-详细设计.md`。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 5 模块实现契约主轴 | 已完成 | §2 |
| 读取 `02` 关键对象轮廓、接口骨架和状态主语 | 已完成 | §2 |
| 读取详细设计 SOP Step 6 和中间产物规范 | 已完成 | §2 |
| 回答 Step 6 SOP 问题中的全局框架问题 | 已完成 | §3 |
| 诊断旧对象总表式写法风险 | 已完成 | §4 |
| 明确本 Step 的批次写入取舍 | 已完成 | §5 / §6 |
| 写入 Step 6 批次状态表 | 已完成 | §7.1 |
| 写入 shared vocabulary / typed ref / public marker 收敛表 | 已完成 | §7.2 |
| 写入模块执行顺序表 | 已完成 | §7.3 |
| 写入 6.0 对象能力到字段 / 函数 / 状态映射原则 | 已完成 | §7.4 |
| 写入 6.0 模块内停审记录和正反例 | 已完成 | §7.5 / §7.6 |
| 写入 6.A 身份锚定与成员真相 | 已完成 | §7.7 |
| 写入 6.B 全局生命周期 | 已完成 | §7.8 |
| 写入 6.C 角色能力摘要 | 已完成 | §7.9 |
| 对齐 governance 粒度重规划 Step 6 | 已完成 | §7.1 / §7.3 / §8 / §11 |
| 写入 6.1-a foundation id/ref/time/channel | 已完成 | §7.2.1 |
| 写入 6.1-b reason/basis/risk | 已完成 | §7.2.2 |
| 写入 6.1-c role/capability source/evidence/material marker | 已完成 | §7.2.3 |
| 写入 6.2-a~6.2-c domain core 已写对象复核 | 已完成 | §7.10 |
| 写入 6.2-d 身份生涯记录 | 已完成 | §7.11 |
| 写入 6.2-e 记忆引用关系 | 已完成 | §7.12 |
| 写入 6.3 consumption / trace / audit / visibility | 已完成 | §7.13 |
| 写入 6.4 projection / reference / reconciliation | 已完成 | §7.14 |
| 写入 6.5 outbox / handoff / propagation | 已完成 | §7.15 |
| 写入 6.6 application helper objects | 已完成 | §7.16 |
| 写入 6.7 infra / api / worker / jobs entry objects | 已完成 | §7.17 |
| 写入 6.8 字段闭环表 | 已完成 | §7.18 |
| 写入 6.9 状态闭环表 | 已完成 | §7.19 |
| 写入 6.10 Step 7 承接清单和启动红线 | 已完成 | §7.20 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | Step 5 已完成,已获用户同意进入 Step 6 | 提供 7 个 workspace crate、模块职责、依赖方向和对象归属规则 |
| `03_ddd_step_04_file_layout.md` | 已审核通过 | 提供文件路径和 crate / module 安放 |
| `03_ddd_step_03_constraints.md` | 已审核通过 | 提供 Rust 2024、英文源码、`core-contracts` 和 runtime / event dependency 约束 |
| `02-概要设计.md` §5 | 已收稳 | 提供 8 个业务主要组成部分 |
| `02-概要设计.md` §6 | 已收稳 | 提供 28 个关键对象、合并 / 后移 / 排除口径 |
| `02-概要设计.md` §7 | 已收稳 | 提供 6 个 Command、14 个 Query、5 个 Consumer、10 类 outbound material、6 个 Operations Job |
| `02-概要设计.md` §8 | 已收稳 | 提供 command / query / consumer / job / propagation 的处理流方向 |
| `02-概要设计.md` §9 | 已收稳 | 提供状态主语和状态传播边界 |
| `design-calibration/02_hld_step_06_key_objects.md` | 概要 Step 6 中间产物 | 解释关键对象候选的来源、合并、后移和排除理由;若与正式 `02` 冲突,以正式 `02` 为准 |
| `standards/document/详细设计讨论流程_SOP.md` Step 6 | 最新流程标准 | 规定先 shared vocabulary、再逐模块 capability -> object -> field/function/state |
| `standards/document/设计文档讨论中间产物规范.md` §5.5.1 | 最新中间产物标准 | 规定 Step 6 必须有批次表、收敛表、模块执行顺序、停审记录和正反例 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新闭环标准 | 约束对象契约必须回指 capability,并前置字段、状态、cursor、subject、snapshot、projection lookup 等经验 |

---

## 3. SOP 问题回答

### 3.1 本仓是否需要先收敛 shared vocabulary、typed ref、public marker 或基础 state enum?

需要。`L1-identity` 的对象契约会横跨 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 和 `jobs` 七个实现模块。若不先收敛 shared vocabulary,后续 6.A~6.H 容易出现以下问题:

- 同一个成员、来源、证据、trace、outbox、handoff 或 report identity 被多个对象用不同字符串拼法表达。
- domain truth 字段和 contracts DTO 字段使用不同 ref 类型。
- query visibility、degraded、freshness、forbidden body 等 public marker 来源不清。
- outbox / handoff / audit / trace subject 在 Step 7~13 中再次暴露无法 1:1 落码的映射缺口。

因此 6.0 先只收敛跨模块共享的基础 ref、marker、operation vocabulary 和状态族名。具体 truth object、policy、view、application helper、adapter state 和 entry object 必须回到 6.A~6.H 的所属模块和 capability 中展开。

### 3.2 当前 Step 6 应按什么批次写入?

重规划后采用以下正式批次:

- `6.R`: Step 6 governance 粒度对齐与重规划。
- `6.1`: shared type / id-ref / reason / marker / helper set 细化。
- `6.2`: domain core truth / state / policy。已写 6.A~6.C 纳入 6.2-a~6.2-c 复核,后续继续 6.2-d career、6.2-e memory。
- `6.3`: consumption / trace / audit / visibility object contracts。
- `6.4`: projection / reference / reconciliation object contracts。
- `6.5`: outbox / handoff / propagation object contracts。
- `6.6`: application helper object contracts,包括 operation context、idempotency、stored result、visibility decision、job report assembly 等。
- `6.7`: infra / api / worker / jobs entry object contracts。
- `6.8`: 字段闭环表,覆盖高复用字段来源和对象组字段来源。
- `6.9`: 状态闭环表,覆盖状态初始来源、可变状态、终态、迁移 owner 和 Step 10 承接点。
- `6.10`: Step 7 承接清单、启动红线、正式 `03` 回填草稿和进入 Step 7 条件。

每个批次都必须先写 capability / 功能清单,再写功能到对象映射,最后写对象卡片或闭环审计表。批次是审查节奏,不是内容上限;若某批对象契约过大,可继续拆为 `6.2-d-1` / `6.2-d-2` 等子批。已写 6.A~6.C 只表示对应业务对象正文已存在,不代表 Step 6 已达到 governance 的完整闭环粒度。

### 3.3 本批 6.0 应定义哪些内容,不定义哪些内容?

本批定义:

- 批次状态表。
- shared vocabulary / typed ref / public marker 收敛表。
- 模块执行顺序表。
- 对象能力到字段 / 函数 / 状态映射的统一模板。
- 6.0 停审记录和正反例。

本批不定义:

- `GlobalMember`、`GlobalLifecycleState`、`RoleCapabilitySummary` 等具体对象字段全集。
- policy / guard 的完整函数签名。
- repository / resolver / publisher / handoff port。
- Command / Query / Event / Job DTO schema。
- 完整 state matrix、transaction order、idempotency stored result 或测试切口。

### 3.4 具体对象如何证明来自 capability?

后续每个对象必须满足:

```text
Step 5 业务组成部分 / 模块职责
  -> capability / 功能
  -> 输入 / 输出 / 状态 / 副作用 / 协作边界
  -> 承接对象
  -> 对象能力
  -> 字段 / factory / 成员函数 / 状态 enum / 不变量
```

如果对象不能回指 capability,必须删除、并入其它对象、标为 boundary ref,或挂起到后续 phase / 待确认事项。不得从旧 `03`、旧实现、对象名或测试愿望猜字段。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `03` 可能直接列全局对象表 | 缺少模块 capability 来源,无法判断功能是否有人承接 | Step 6 改为 6.0 + 6.A~6.I 小循环 |
| `02` §6 已有关键对象索引 | 索引不是字段 / 函数 / factory 结论,不能机械扩写 | 只作为对象候选和来源,后续按 capability 重新推导 |
| `02_hld_step_06_key_objects.md` 字段骨架较细 | 它是概要层骨架,不是详细设计完整契约 | 后续对象卡片可参考,但必须补字段来源和不变量 |
| Step 5 以 7 个 crate 为模块主轴 | 业务组成部分横跨 crate,如果按 crate 写对象会失去业务 capability 线索 | Step 6 以业务组成部分分批,并在每批标明归属 crate |
| 角色、work、memory、governance 等相邻仓 ref 较多 | 容易被误写成 identity-owned object 或 Cargo dependency | 6.0 先标为 boundary ref / marker,具体 resolver 留给 Step 7 |
| query / projection / outbox / handoff marker 多 | 若不前置 marker 口径,后续 query no-write 和 fake delivered 会反复阻塞 | 6.0 先定义 marker 分类,具体字段在对象批次和 Step 8~13 闭口 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 6 生成方式 | 容易一次性生成完整对象大表 | 先写 6.0 框架和 shared vocabulary,再逐批对象 |
| 对象来源 | 可能直接来自 `02` 对象名 | 必须来自 capability / 功能到对象映射 |
| shared refs | 分散在各对象字段中临时出现 | 先收敛为 typed ref / boundary ref / marker 分类 |
| 状态表达 | 可能在对象里各自发明状态 | 先承接 `02` §9 状态主语,后续 Step 10 再完整矩阵 |
| 审核节奏 | Step 6 末尾一次性审核 | 6.0 和后续每个业务批次均有停审记录 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 一次性写完所有对象字段 / 函数 / 状态 | 不采用 | 会回到薄粒度全局对象表,后续 Step 7~10 容易暴露来源缺口 |
| 先写 Step 6 框架和 shared vocabulary | 采用 | 能保证后续对象用同一 ref、marker、state vocabulary |
| 按 7 个 crate 写对象批次 | 不采用为主轴 | crate 是代码层,业务 capability 会跨 crate;容易失去功能来源 |
| 按 8 个业务组成部分写对象批次 | 采用 | 与 `02` §5~§9 的 capability、对象、flow、状态主语一致 |
| 本批补齐所有 typed ref 代码定义 | 不采用 | 6.0 只收敛分类和归属;完整 Rust struct / enum 字段留给具体对象批次或 Step 8 |
| 把 boundary refs 当作 identity-owned object 展开 | 不采用 | governance / work / method / memory / archive 等 truth 不归 identity |

---

## 7. 结构化中间产物

### 7.1 Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.R` | governance 粒度对齐与 Step 6 重规划 | 已写入 | 是 | 已确认 | `6.1` |
| `6.0` | 原框架、shared vocabulary、typed ref、public marker、模块执行顺序 | 已写入 | 部分;需由 `6.1` 细化 shared type schema | 已确认;纳入重规划 | `6.1` |
| `6.1-a` | foundation id/ref/time/channel:时间、操作通道、成员 ID/ref、通用来源 ref、summary/snapshot ID/ref | 已写入 | 是;覆盖已写 6.A~6.C 的基础二级类型,但不含 reason/basis/risk/source/evidence marker | 已确认 | `6.1-b` |
| `6.1-b` | reason / basis / risk:anchor reason、lifecycle reason、risk、governance basis | 已写入 | 是;覆盖 6.A / 6.B 已引用 reason/basis/risk 类型,但不含 role/capability source/evidence marker | 已确认 | `6.1-c` |
| `6.1-c` | role/capability source/evidence/material marker 和 helper set | 已写入 | 是;覆盖 6.C 已引用 role/capability/evidence/source version/material marker schema 与禁止事项 | 已确认 | `6.2-a~6.2-c` |
| `6.2-a` | domain core:身份锚定与成员真相 | 已复核 | 是;6.A 正文已按 `6.1-a` / `6.1-b` shared type 复核,未发现需重写项 | 已确认 | `6.2-b` |
| `6.2-b` | domain core:全局生命周期 | 已复核 | 是;6.B 正文已按 `6.1-a` / `6.1-b` 复核,high-risk basis 的 summary 输入缺口已标为 Step 7/9 承接 | 已确认 | `6.2-c` |
| `6.2-c` | domain core:角色能力摘要 | 已复核 | 是;6.C 正文已按 `6.1-c` source/evidence/material marker 复核,仅保留 Step 8/12 public surface 映射 | 已确认 | `6.2-d` |
| `6.2-d` | domain core:身份生涯记录 | 已写入 | 是;覆盖 career record/ref、work source marker、safe summary、append reason、source summary、material marker 和 append-only policy | 已确认 | `6.2-e` |
| `6.2-e` | domain core:记忆引用关系 | 已写入 | 是;覆盖 memory reference/ref、memory/archive source marker、reference state、source summary、reason/material marker 和 body-free policy | 已确认 | `6.3` |
| `6.3` | consumption / trace / audit / visibility | 已写入 | 是;覆盖 `MemberSummaryView` / `IdentityTraceRecord` / `AuditTrail` / `VisibilityPolicy`、subject/ref、read surface 和 redaction marker | 已确认 | `6.4` |
| `6.4` | projection / reference / reconciliation | 已写入 | 是;覆盖 `ProjectionState` / `ReferenceResolutionState` / `ReconciliationPolicy` / `ReconciliationReport`、projection/ref/report marker 和 report-only guard | 已确认 | `6.5` |
| `6.5` | outbox / handoff / propagation | 已写入 | 是;覆盖 `IdentityOutboxRecord` / `TraceHandoffIntent` / `OutboxState` / `HandoffState` / `OutboundEventPolicy` / `HandoffPolicy`、payload marker、receipt marker 和 propagation guard | 已确认 | `6.6` |
| `6.6` | application helper objects | 已写入 | 是;覆盖 operation context、idempotency record/key/digest、stored result、command effect summary、visibility decision 和 job run report assembly | 已确认 | `6.7` |
| `6.7` | infra / api / worker / jobs entry objects | 已写入 | 是;覆盖 runtime config shell、runtime assembly state、adapter availability、API/worker/job entry context、entry validation/result 和 dispatch guard | 已确认 | `6.8` |
| `6.8` | 字段闭环表 | 已写入 | 是;覆盖高复用字段来源、对象组字段来源、禁止替代表、实现暂停条件和 Step 7/8/9/11/13/14 承接点 | 已确认 | `6.9` |
| `6.9` | 状态闭环表 | 已写入 | 是;覆盖状态初始来源、可变状态、终态、迁移 owner、禁止迁移、Step 10 承接点和实现暂停条件 | 已确认 | `6.10` |
| `6.10` | Step 7 承接清单、启动红线、回填草稿和进入 Step 7 条件 | 已写入 | 是;覆盖 Step 7 port/adapter/fake 启动清单、禁止补口红线、Step 6 交付摘要和进入 Step 7 条件 | 待审 | Step 7 |

### 7.2 shared vocabulary / typed ref / public marker 收敛表

| 类型 / 类型族 | 所属层 | 需要先全局收敛的原因 | 后续使用模块 | 正式归属 |
|---|---|---|---|---|
| `GlobalMemberRef` | contracts typed ref | 成员身份是所有业务组成部分的主语,不能在每个对象里用字符串重写 | contracts、domain、application、infra、api、worker、jobs | `contracts::refs`;6.A 首次使用 |
| `IdentityTimestamp` | contracts value / shared scalar | 多个对象需要 created / changed / appended / checked 时间,必须统一来源和语义 | contracts、domain、application、infra | `contracts::metadata` 或 `contracts::refs`;Step 7/11 定义 clock 来源 |
| `IdentityOperationChannel` | domain / application vocabulary | policy 需要区分 command、query、consumer、job、handoff callback,以阻止 query/job 写 truth | domain、application、api、worker、jobs | `domain::changes` 或 `application::context`;6.A~6.H 使用 |
| `IdentitySourceRef` | contracts boundary ref | 建档、role、career、memory 等都需要 body-free 来源引用,但来源 owner 不同 | contracts、domain、application、infra | `contracts::refs`;具体 resolver Step 7 |
| `GovernanceBasisRef` | contracts boundary ref | 高风险 lifecycle 需要 governance basis,但 governance truth 不归 identity | contracts、domain、application、infra | `contracts::refs`;6.B 使用;Step 7 resolver |
| `RoleSourceRef` / `CapabilitySourceRef` / `CapabilityEvidenceRef` | contracts boundary refs | 角色能力摘要必须指向 method-library / evidence 来源,不得保存 definition body | contracts、domain、application、worker、infra | `contracts::refs`;6.C 使用;Step 7 resolver |
| `ProjectParticipationRef` / `WorkSourceRef` / `CareerSourceMarkerRef` / `CareerSafeSummaryRef` / `CareerAppendReasonRef` | contracts boundary refs / career markers | career record 只能保存 work participation 来源 marker、safe summary 和追加原因,不能拥有 ProjectMember truth 或 work body | contracts、domain、application、worker、infra | `contracts::refs`;6.2-d 使用;Step 7 resolver |
| `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef` / `MemoryReferenceSourceRef` / `MemoryReferenceReasonRef` | contracts boundary refs / memory markers | memory relation 和 archive handoff 只保存 ref / marker、safe summary 和变化原因,不得保存正文、embedding、index、package 或 receipt body | contracts、domain、application、worker、infra、jobs | `contracts::refs`;6.2-e / 6.5 使用 |
| `IdentityTraceSubjectRef` | contracts typed ref / marker | trace / audit / outbox / handoff 需要稳定 subject,不得由实现拼字符串 | contracts、domain、application、infra | `contracts::refs`;6.F / 6.H 使用;Step 7 mapper |
| `IdentityAuditSubjectRef` | contracts typed ref / marker | audit trail 需要 canonical subject,不能从 trace subject 私下拼 ref | contracts、domain、application、infra | `contracts::refs`;6.F 使用;Step 7 mapper |
| `IdentityOutboxSubjectRef` | contracts typed ref / marker | outbound event material 必须能回指 accepted fact subject | contracts、domain、application、infra、jobs | `contracts::refs`;6.H 使用;Step 7 mapper |
| `IdentityTruthCursor` | contracts / application marker | trace、outbox、projection stale、duplicate replay 需要 committed truth cursor 来源;不得用 timestamp/version 代替 | domain、application、infra、jobs | `contracts::refs` 或 `application::results`;Step 7/11/13 闭口 |
| `IdentityVersion` | contracts / persistence marker | optimistic save / duplicate replay / reference refresh 需要 version 语义 | domain、application、infra | `contracts::refs`;Step 11 闭口 |
| `IdentityVisibilityMarker` | contracts public marker | query not visible / redacted surface 必须统一,不能各 query 自己拼 marker | contracts、domain、application、api | `contracts::views`;6.F 使用;Step 8 定义最小 public shell;Step 12 细化 redaction matrix |
| `IdentityDegradedMarker` | contracts public marker | stale / unavailable / partial / missing source 需要显式 degraded surface,且 query no-write | contracts、application、api、jobs | `contracts::views`;6.F / 6.G 使用;Step 8 定义最小 public shell;Step 12 细化分类映射 |
| `IdentityFreshnessMarker` | contracts public marker | projection / reference / report read 需要 fresh / stale / failed surface | contracts、application、infra、api、jobs | `contracts::views`;6.F / 6.G 使用 |
| `IdentityForbiddenBodyMarker` | domain / contracts guard marker | role body、work body、memory body、archive package、receipt body 均禁止入仓 | contracts、domain、application、worker、jobs | `domain::errors` / `contracts::errors`;Step 8/12 测试 |
| `IdentityOutboxPayloadMarkerRef` | contracts event marker | outbound event payload 必须 body-free 且能回指 accepted fact | contracts、domain、application、infra、jobs | `contracts::events`;6.5 / Step 8 |
| `HandoffReceiptRef` | contracts handoff marker | handoff delivered 必须来自正式 receipt marker,不得把 request sent 当 delivered | contracts、domain、application、infra、jobs | `contracts::receipts`;6.5 / Step 8/14 |
| `IdentityJobRunRef` / `IdentityJobCursor` | contracts job marker | operations job 需要 run identity 和 cursor,但不写业务 truth | contracts、application、jobs、infra | `contracts::jobs`;6.G / 6.H;Step 8/13 |

约束:

- 上表只收敛共享 vocabulary 和归属,不是完整 Rust schema。
- boundary refs 只表达外部 truth / body-free source,不成为 identity-owned truth object。
- 任何 mapper、resolver、repository、publisher、handoff adapter 的 trait 签名留给 Step 7。
- 任何 public DTO / event / job / receipt 的完整字段留给 Step 8。
- cursor / version / id generator 生成责任留给 Step 7 / 11 / 13,本批只声明不能由实现临时替代。

#### 7.2.1 6.1-a foundation id/ref/time/channel 细化

本批只展开已写 6.A~6.C 中高频出现、且会被后续对象共同引用的 foundation shared types。目标不是提前定义全部协议 DTO,而是先让基础 ID/ref/time/channel 在 Step 6 内具备可落码的结构、字段来源和禁止事项。reason、basis、risk、role/capability source/evidence/material marker 留给 `6.1-b` / `6.1-c`。

##### 6.1-a capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属类型 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 统一成员身份主键 | id generator 或 request-bound member id | `GlobalMemberId` / `GlobalMemberRef` | 不创建 truth,只表达稳定身份主语 | `GlobalMemberId`,`GlobalMemberRef` | Step 7 id generator / repository key;Step 11 unique key |
| 统一本地时间值 | clock port 输出 | `IdentityTimestamp` | 只表达事件 / 状态变化时间,不表达 cursor/version | `IdentityTimestamp` | Step 7 clock port;Step 11 persisted timestamp |
| 统一操作通道 | API / worker / job / handoff entry context | `IdentityOperationChannel` | 供 policy 判定是否允许写 truth | `IdentityOperationChannel` | Step 8 metadata;Step 9 no-write guard;Step 12 wrong-channel rejection |
| 统一 body-free 来源引用 | command / event / resolver summary | `IdentitySourceRef` | 只保存来源 identity,不保存外部正文 | `IdentitySourceRef` | Step 7 source resolver;Step 12 forbidden body |
| 统一 identity-owned summary/snapshot identity | id generator 或 accepted source snapshot | `RoleCapabilitySummaryId/Ref`,`RoleCapabilitySourceSnapshotId/Ref` | 只标识本仓 summary/snapshot truth,不标识 method-library body | summary/snapshot id-ref 类型 | Step 7 repository/id generator;Step 11 unique key |

##### `IdentityTimestamp`

```rust
/// Identity-side timestamp captured from the configured clock source.
pub struct IdentityTimestamp {
    /// Milliseconds since Unix epoch, or another monotonic serializable instant chosen by the clock port.
    pub epoch_millis: i64,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `epoch_millis` | `i64` | 表达 identity 对象中的 created / changed / resolved / checked 时间 | 来源于 Step 7 clock port;必须可序列化和可比较;不得由 domain object 直接读取系统时间 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_clock(epoch_millis: i64) -> Result<Self, ContractError>` | 从 clock port 输出构造时间值 | `epoch_millis` 为 clock adapter 已规范化结果 | `Result<IdentityTimestamp, ContractError>` | 拒绝非法时间值;不读取系统时间 |
| `pub fn same_instant(&self, other: &IdentityTimestamp) -> bool` | 判断两个时间值是否同一瞬时 | `other` 为另一个 identity timestamp | `bool` | 只比较值;不做时区转换 |
| `pub fn is_after(&self, other: &IdentityTimestamp) -> bool` | 提供本地排序 helper | `other` 为比较基准 | `bool` | 仅用于对象内 guard;不得替代 version/cursor |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不等于 truth cursor | trace/outbox/projection stale/duplicate replay 需要 `IdentityTruthCursor`;不得用 timestamp 伪造 |
| 不等于 optimistic version | 并发控制版本由 Step 11/13 闭口;不得拿时间排序替代版本 |
| domain 不取系统时间 | 所有对象 factory 只能接收已注入时间值 |
| 当前暂用 wrapper | 是否直接复用 core 时间类型保留到 Step 7/8/11 reality check;实现不得自行换型 |

##### `IdentityOperationChannel`

```rust
/// Entry channel that explains why Identity code is executing.
pub enum IdentityOperationChannel {
    /// Explicit command path that may write Identity truth after all guards pass.
    Command,
    /// Query/read path; must not create or mutate truth.
    Query,
    /// Inbound consumer path from a subscribed event source.
    Consumer,
    /// Operations or maintenance job path.
    Job,
    /// Handoff callback or receipt path.
    HandoffCallback,
    /// Projection rebuild or read-model maintenance path.
    ProjectionMaintenance,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Command` | Explicit command path that may write Identity truth after all guards pass. | 建档、生命周期、summary、career、memory 等显式写入入口 | API command handler / application command service | 可进入 truth write guard;仍需对象 policy 校验 |
| `Query` | Query/read path; must not create or mutate truth. | 查询与 visibility 判断 | API query handler / read service | 只能读或返回 not visible / degraded / not found |
| `Consumer` | Inbound consumer path from a subscribed event source. | 响应 method/work/memory/archive 等事件 | worker consumer entry | 只能执行 Step 9 明确允许的 consumer write |
| `Job` | Operations or maintenance job path. | refresh/reconciliation/report 等作业 | jobs entry | 默认不写核心 truth;除非后续 flow 明确 |
| `HandoffCallback` | Handoff callback or receipt path. | 接收 handoff receipt / callback | worker handoff entry | 只更新 handoff/receipt 对象,不得伪造 accepted truth |
| `ProjectionMaintenance` | Projection rebuild or read-model maintenance path. | 投影修复或刷新 | jobs / infra projection entry | 只写 projection state/read model,不得创建 domain truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn allows_core_truth_write(&self) -> bool` | 判断是否可能写核心 identity truth | 无 | `bool` | 当前只有 `Command` 与 Step 9 明确允许的 `Consumer` 可继续进入写入 guard;helper 不替代 flow 审批 |
| `pub fn is_read_only(&self) -> bool` | 判断是否只读通道 | 无 | `bool` | `Query` 和 projection read 相关通道不得创建 truth |
| `pub fn requires_entry_metadata(&self) -> bool` | 判断入口是否必须提供 actor / trace metadata | 无 | `bool` | 具体 metadata 字段在 Step 8 闭口 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| channel 不是权限系统 | 权限、visibility 和 basis 由后续 policy / resolver 处理;channel 只表达入口性质 |
| query 不得升级为 command | 查询缺失不能通过 channel 改写触发建档 |
| job 默认不修复核心 truth | reconciliation/report 作业只能在后续 Step 9 明确 flow 后写指定对象 |
| 不由实现私加 variant | 新入口类型必须先回 Step 6/8/9 同步 |

##### `GlobalMemberId`

```rust
/// Stable opaque identifier for an Identity global member.
pub struct GlobalMemberId(pub String);
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `0` | `String` | 平台级成员身份稳定 ID | 来源于 Step 7 id generator 或正式 request-bound id;非空;不可复用;不得由 query/job 临时生成 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(value: String) -> Result<Self, ContractError>` | 构造成员 ID | `value` 为已分配 opaque id | `Result<GlobalMemberId, ContractError>` | 校验非空和规范化边界;不生成 id |
| `pub fn as_str(&self) -> &str` | 暴露只读字符串表示 | 无 | `&str` | 仅用于 serialization/log label;业务不得解析结构 |
| `pub fn same_id(&self, other: &GlobalMemberId) -> bool` | 同一性判断 | `other` 为另一个成员 ID | `bool` | 只做精确相等 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| opaque | 业务逻辑不得解析前缀、时间戳、来源系统或分片结构 |
| 不复用 | 退役、墓碑、外部账号删除后仍不得复用同一 ID |
| 不等于账号 / runtime / ProjectMember ID | 这些外部 ID 只能通过 source ref 关联 |
| 不由 query/job 生成 | 缺失成员查询必须走 read surface,不得自动生成 ID |

##### `GlobalMemberRef`

```rust
/// Typed reference to an Identity global member truth object.
pub struct GlobalMemberRef {
    /// Stable member id.
    pub member_id: GlobalMemberId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `member_id` | `GlobalMemberId` | 指向 `GlobalMember` truth 的 typed ref | 来自 request、route、loaded truth、accepted result 或 source event mapping;不得用裸字符串替代 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_id(member_id: GlobalMemberId) -> Self` | 从成员 ID 构造 typed ref | `member_id` 为已校验 ID | `GlobalMemberRef` | 不读取 repository |
| `pub fn same_member(&self, other: &GlobalMemberRef) -> bool` | 判断是否同一成员 | `other` 为另一个成员 ref | `bool` | 只比较 `member_id` |
| `pub fn id(&self) -> &GlobalMemberId` | 返回内部 ID | 无 | `&GlobalMemberId` | 只读 helper |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 只表达 identity truth | 不表达 lifecycle 可用性、visibility、role、work 或 memory 状态 |
| 不临时拼 ref | 所有 ref 必须由 typed ID 构造,不得用 `format!("member:...")` |
| 不携带外部正文 | account、credential、ProjectMember、runtime payload 不进入 ref |
| 不替代 actor | `ActorRef` 表达操作者;`GlobalMemberRef` 表达成员主语 |

##### `IdentitySourceRef`

```rust
/// Body-free reference to the source that caused or supports an Identity fact.
pub struct IdentitySourceRef {
    /// Source system or owner marker.
    pub source_owner: IdentitySourceOwner,
    /// Opaque source-side reference.
    pub external_ref: ExternalSourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_owner` | `IdentitySourceOwner` | 标识来源 owner / 系统类别 | 来自 request schema、event metadata 或 resolver summary;只用于 owner boundary 判断 |
| `external_ref` | `ExternalSourceRef` | 来源侧 opaque ref | 来源于外部系统或上游事件;不得保存 source body |

```rust
/// Owner class for a body-free Identity source reference.
pub enum IdentitySourceOwner {
    /// User/account/credential source used only as evidence or creation source.
    Account,
    /// Runtime or execution-side source.
    Runtime,
    /// Work/project participation source.
    Work,
    /// Method-library role/capability source.
    MethodLibrary,
    /// Memory or archive source.
    MemoryArchive,
    /// Governance basis or decision source.
    Governance,
    /// Identity-owned source produced by accepted Identity truth.
    Identity,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Account` | User/account/credential source used only as evidence or creation source. | 账号 / credential 作为来源线索 | create request / auth metadata | 只能作为 source marker,不得成为 member truth body |
| `Runtime` | Runtime or execution-side source. | runtime 信号来源 | runtime event / resolver | 只能作为 source marker 或 evidence,不得写 lifecycle runtime state |
| `Work` | Work/project participation source. | work / project 来源 | work event / resolver | career 批次使用 body-free ref |
| `MethodLibrary` | Method-library role/capability source. | role/capability 来源 | method event / resolver | role capability snapshot 使用 |
| `MemoryArchive` | Memory or archive source. | memory/archive 来源 | memory/archive event / callback | memory relation/handoff 使用 |
| `Governance` | Governance basis or decision source. | governance 依据来源 | governance resolver summary | high-risk basis 使用 body-free ref |
| `Identity` | Identity-owned source produced by accepted Identity truth. | identity 内部 accepted fact 来源 | accepted command/result | trace/outbox/projection 可回指 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(source_owner: IdentitySourceOwner, external_ref: ExternalSourceRef) -> Result<Self, ContractError>` | 构造 body-free source ref | owner 与 external ref 均来自正式输入 | `Result<IdentitySourceRef, ContractError>` | 校验 owner/ref 存在;不解析外部 body |
| `pub fn owner(&self) -> IdentitySourceOwner` | 返回来源 owner | 无 | `IdentitySourceOwner` | 用于 guard 判断 owner boundary |
| `pub fn same_source(&self, other: &IdentitySourceRef) -> bool` | 同一来源判断 | `other` 为另一个 source ref | `bool` | 比较 owner + external ref |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| body-free | 不保存账号资料、credential、runtime payload、work body、method body、memory body 或 archive package |
| owner 只做边界判断 | 不从 owner 推导外部 schema;具体 resolver 由 Step 7 定义 |
| 禁止字符串解析 | 不得从 `external_ref` 前缀反推 owner;owner 必须显式字段 |
| 不替代专用 ref | role/capability/governance/memory 等专用 ref 会在后续批次细化;通用 source ref 不得吞并它们 |

##### `RoleCapabilitySummaryId` / `RoleCapabilitySummaryRef`

```rust
/// Stable opaque identifier for an Identity-owned role capability summary.
pub struct RoleCapabilitySummaryId(pub String);

/// Typed reference to an Identity role capability summary truth object.
pub struct RoleCapabilitySummaryRef {
    /// Stable summary id.
    pub summary_id: RoleCapabilitySummaryId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `RoleCapabilitySummaryId.0` | `String` | identity-owned role/capability summary ID | 来源于 Step 7 id generator 或 accepted migration;非空;opaque |
| `RoleCapabilitySummaryRef.summary_id` | `RoleCapabilitySummaryId` | 指向 `RoleCapabilitySummary` truth | 来自 id generator、loaded truth 或 accepted result;不得临时拼接 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(value: String) -> Result<RoleCapabilitySummaryId, ContractError>` | 构造 summary ID | `value` 为已分配 opaque id | `Result<RoleCapabilitySummaryId, ContractError>` | 校验非空;不生成 id |
| `pub fn from_id(summary_id: RoleCapabilitySummaryId) -> RoleCapabilitySummaryRef` | 构造 typed ref | 已校验 summary id | `RoleCapabilitySummaryRef` | 不读取 repository |
| `pub fn same_summary(&self, other: &RoleCapabilitySummaryRef) -> bool` | 同一 summary 判断 | `other` 为另一个 summary ref | `bool` | 只比较 `summary_id` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 只标识 identity summary truth | 不标识 RoleDefinition、CapabilityDefinition、method policy 或 evidence body |
| opaque | 业务不得解析 summary id 的前缀、成员 id 或来源版本 |
| 不由 source ref 直接派生 | summary identity 由本仓 id source 负责;不能用 role/capability source ref 拼接 |

##### `RoleCapabilitySourceSnapshotId` / `RoleCapabilitySourceSnapshotRef`

```rust
/// Stable opaque identifier for an Identity-owned role capability source snapshot.
pub struct RoleCapabilitySourceSnapshotId(pub String);

/// Typed reference to a role capability source snapshot captured by Identity.
pub struct RoleCapabilitySourceSnapshotRef {
    /// Stable source snapshot id.
    pub snapshot_id: RoleCapabilitySourceSnapshotId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `RoleCapabilitySourceSnapshotId.0` | `String` | identity-owned source snapshot ID | 来源于 Step 7 id generator 或 source event accepted handling;非空;opaque |
| `RoleCapabilitySourceSnapshotRef.snapshot_id` | `RoleCapabilitySourceSnapshotId` | 指向 `RoleCapabilitySourceSnapshot` | 来自 id generator、loaded snapshot 或 accepted source resolution result |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(value: String) -> Result<RoleCapabilitySourceSnapshotId, ContractError>` | 构造 snapshot ID | `value` 为已分配 opaque id | `Result<RoleCapabilitySourceSnapshotId, ContractError>` | 校验非空;不生成 id |
| `pub fn from_id(snapshot_id: RoleCapabilitySourceSnapshotId) -> RoleCapabilitySourceSnapshotRef` | 构造 typed ref | 已校验 snapshot id | `RoleCapabilitySourceSnapshotRef` | 不读取 repository |
| `pub fn same_snapshot(&self, other: &RoleCapabilitySourceSnapshotRef) -> bool` | 同一 snapshot 判断 | `other` 为另一个 snapshot ref | `bool` | 只比较 `snapshot_id` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| snapshot ref 不是 source ref | `RoleCapabilitySourceRef` 指外部 source;本 ref 指 identity 本地 body-free snapshot |
| 不保存 source body | snapshot 对象后续只保存 refs/version/safe summary/evidence refs |
| 不从 source version 拼接 | snapshot id 由本仓生成;source version 作为字段保存,不是 snapshot id 生成规则 |

##### 6.1-a 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先覆盖已写 6.A~6.C 的基础二级类型 | 通过 | 已覆盖 `IdentityTimestamp`,`IdentityOperationChannel`,`GlobalMemberId/Ref`,`IdentitySourceRef`,`RoleCapabilitySummaryId/Ref`,`RoleCapabilitySourceSnapshotId/Ref` |
| 是否给出 Rust 结构 / enum | 通过 | 每个类型均有代码块;源码 rustdoc 后续应改写为英文,本文中文解释设计语义 |
| 字段来源是否闭合到当前 Step 粒度 | 通过 | id generator、request-bound id、clock、entry context、resolver summary、loaded truth 已标注;trait 留 Step 7 |
| 是否避免字符串拼接规则 | 通过 | 所有 id/ref 均标明 opaque,不得解析前缀或 `format!` 派生 |
| 是否越过 Step 7~10 | 通过 | 未定义 repository/clock/source resolver trait、DTO schema、flow、DDL 或完整状态矩阵 |
| 是否仍有后续 6.1 缺口 | 是 | reason/basis/risk 与 role/capability source/evidence/material marker 分别留给 `6.1-b` / `6.1-c` |

##### 6.1-a 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| 成员 ref | `GlobalMemberRef { member_id }` 只由已校验 `GlobalMemberId` 构造 | `format!("member:{account_id}")` 临时生成成员 ref |
| 时间值 | application 从 clock port 取得 `IdentityTimestamp` 后传给 domain factory | domain object 内部调用系统时间,或用 timestamp 当 truth cursor |
| 操作通道 | query handler 传入 `IdentityOperationChannel::Query`,policy 明确 no-write | query 查不到成员时把 channel 改成 command 自动建档 |
| source ref | `IdentitySourceRef { source_owner, external_ref }` 显式保存 owner 和 body-free external ref | 从 external ref 字符串前缀推断 owner,或保存 account/runtime/method body |
| summary id | `RoleCapabilitySummaryId` 由 identity id source 分配 | 用 `member_ref + role_source_ref` 拼成 summary id 并写入 repository |

#### 7.2.2 6.1-b reason / basis / risk 细化

本批只展开 6.A / 6.B 已经引用的原因、风险和治理依据 shared types。目标是让 anchor hold、lifecycle transition 和 high-risk guard 的字段来源可落码,同时明确 identity 不保存 governance truth body、不解析外部 basis 字符串、不把 risk/basis resolver 写成 Step 6 内部逻辑。

##### 6.1-b capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属类型 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 表达 anchor hold 原因 | lifecycle terminal flow / tombstone command 的安全原因 marker | `IdentityAnchorReasonRef` | 只保存 reason ref,不保存原因正文或审批 body | `IdentityAnchorReasonRef` | Step 8 terminal/tombstone DTO;Step 10 anchor hold reason 规则 |
| 表达 lifecycle 迁移原因 | command request / policy summary | `LifecycleReasonRef` | lifecycle write 必填;不保存详细说明正文 | `LifecycleReasonRef` | Step 8 lifecycle command;Step 10 transition matrix |
| 表达高风险动作分类 | command target / config-bound policy summary | `LifecycleRiskRef` | 用于判断是否需要 basis;不保存 policy body | `LifecycleRiskRef` | Step 7 risk policy source;Step 10 high-risk action set;Step 14 config binding |
| 表达治理依据引用 | governance resolver summary / command request | `GovernanceBasisRef` | body-free basis ref;不拥有 governance Gate/Approval/Policy truth | `GovernanceBasisRef` | Step 7 basis resolver;Step 8 high-risk request/result;Step 12 invalid/unavailable basis |
| 承载 basis 可用性判定输入 | basis resolver typed read | `GovernanceBasisSummary` | 只作为 guard 输入,不写 governance truth | `GovernanceBasisSummary` | Step 7 resolver result;Step 9 high-risk lifecycle precheck |

##### `IdentityAnchorReasonRef`

```rust
/// Body-free reason reference for holding an Identity member anchor.
pub struct IdentityAnchorReasonRef {
    /// Reason category for the anchor hold.
    pub reason_kind: IdentityAnchorReasonKind,
    /// Opaque reason source reference.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reason_kind` | `IdentityAnchorReasonKind` | 表达 anchor hold 的原因类别 | 来源于 lifecycle terminal command、tombstone command 或 accepted lifecycle summary;不得从 source 字符串解析 |
| `source_ref` | `IdentitySourceRef` | 原因来源 marker | body-free;可指 identity accepted fact、governance basis 或外部 request source;不得保存原因正文 |

```rust
/// Category of reason for keeping a member anchor permanently occupied.
pub enum IdentityAnchorReasonKind {
    /// Anchor is held because the member was retired.
    Retired,
    /// Anchor is held because the member was tombstoned.
    Tombstoned,
    /// Anchor is held because the source identity was superseded but must remain non-reusable.
    SupersededHold,
    /// Anchor is held by governance or compliance restriction.
    GovernanceHold,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Retired` | Anchor is held because the member was retired. | 退役后保持 ref 不复用 | lifecycle terminal accepted | `IdentityAnchorState::RetiredHeld` |
| `Tombstoned` | Anchor is held because the member was tombstoned. | 墓碑化后保持 ref 不复用 | tombstone / high-risk lifecycle accepted | `IdentityAnchorState::TombstoneHeld` |
| `SupersededHold` | Anchor is held because the source identity was superseded but must remain non-reusable. | 来源身份被替代但本地 ref 仍占用 | future merge/supersede flow;当前只保留类型 | Step 9/10 后续 flow 闭口 |
| `GovernanceHold` | Anchor is held by governance or compliance restriction. | governance/compliance 限制导致持有 | governance basis summary | terminal hold flow |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(reason_kind: IdentityAnchorReasonKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 anchor reason ref | kind 来自正式 flow;source 为 body-free marker | `Result<IdentityAnchorReasonRef, ContractError>` | 不读取 source body |
| `pub fn supports_tombstone_hold(&self) -> bool` | 判断是否可用于 tombstone hold | 无 | `bool` | 仅 `Tombstoned` 或后续 Step 10 明确允许的 governance hold 可返回 true |
| `pub fn same_reason(&self, other: &IdentityAnchorReasonRef) -> bool` | 同一 reason 判断 | `other` 为另一个 reason ref | `bool` | 比较 kind + source ref;不解析外部正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存原因正文 | human explanation、approval note、policy body 不进入 reason ref |
| 不释放 ref | reason 只解释 hold,不提供 reusable 语义 |
| 不从 lifecycle state 反推 | terminal state 与 anchor reason 必须由 flow 明确传入 |
| 不替代 governance basis | governance 依据仍由 `GovernanceBasisRef` / summary 表达 |

##### `LifecycleReasonRef`

```rust
/// Body-free reason reference for an Identity lifecycle transition.
pub struct LifecycleReasonRef {
    /// Reason category for the lifecycle transition.
    pub reason_kind: LifecycleReasonKind,
    /// Opaque reason source reference.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reason_kind` | `LifecycleReasonKind` | lifecycle 迁移原因类别 | 来自 command request、accepted basis summary 或 formally configured action reason;不得为空 |
| `source_ref` | `IdentitySourceRef` | 原因来源 marker | body-free;不得保存 ticket、approval、policy、runtime log 或 work body |

```rust
/// Category of reason for changing a member lifecycle state.
pub enum LifecycleReasonKind {
    /// Initial lifecycle created together with the member anchor.
    InitialProvisioned,
    /// Member was manually paused.
    ManualPause,
    /// Member was manually resumed.
    ManualResume,
    /// Member was retired.
    Retirement,
    /// Member was tombstoned.
    Tombstone,
    /// Lifecycle changed because a governance basis required it.
    GovernanceBasis,
    /// Lifecycle changed because an external source became invalid or unavailable.
    SourceInvalidated,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `InitialProvisioned` | Initial lifecycle created together with the member anchor. | 建档后初始可用 | establish accepted | `GlobalLifecycleState::Available` |
| `ManualPause` | Member was manually paused. | 显式暂停 | lifecycle command | `Paused` |
| `ManualResume` | Member was manually resumed. | 显式恢复 | lifecycle command | `Available` |
| `Retirement` | Member was retired. | 退役 | lifecycle command / governance basis | `Retired` |
| `Tombstone` | Member was tombstoned. | 墓碑化 | high-risk lifecycle command | `Tombstoned` |
| `GovernanceBasis` | Lifecycle changed because a governance basis required it. | 因治理依据变化 | governance basis resolver summary | 由 Step 10 矩阵限定 |
| `SourceInvalidated` | Lifecycle changed because an external source became invalid or unavailable. | 来源失效导致迁移候选 | source resolver / command | 由 Step 9/10 明确是否可 accepted |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(reason_kind: LifecycleReasonKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 lifecycle reason ref | kind 与 source 来自正式请求或 resolver summary | `Result<LifecycleReasonRef, ContractError>` | 不保存 reason body |
| `pub fn is_terminal_reason(&self) -> bool` | 判断是否为终态迁移原因候选 | 无 | `bool` | `Retirement` / `Tombstone` / 部分 `GovernanceBasis` 为候选;最终规则 Step 10 |
| `pub fn same_reason(&self, other: &LifecycleReasonRef) -> bool` | 同一 reason 判断 | `other` 为另一个 reason ref | `bool` | 比较 kind + source ref |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| lifecycle write 必须有 reason | 显式生命周期变化不得用空 reason accepted |
| reason 不等于 audit note | audit note / operator comment 后续归 trace/audit/event surface,不进 reason ref |
| 不保存外部 body | ticket、policy、approval、runtime log、work body 均不得进入本类型 |
| 不决定迁移矩阵 | reason 只是输入;允许迁移由 `LifecycleTransitionPolicy` / Step 10 矩阵闭口 |

##### `LifecycleRiskRef`

```rust
/// Body-free risk classification reference for a lifecycle action.
pub struct LifecycleRiskRef {
    /// Risk class of the lifecycle action.
    pub risk_kind: LifecycleRiskKind,
    /// Source of the risk classification.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `risk_kind` | `LifecycleRiskKind` | lifecycle 动作风险分类 | 来源于 command target、配置绑定 policy summary 或 risk resolver;不得由实现自行硬编码新增 |
| `source_ref` | `IdentitySourceRef` | 风险分类来源 marker | body-free;可指 identity config、governance policy summary 或 command schema |

```rust
/// Risk class for Identity lifecycle actions.
pub enum LifecycleRiskKind {
    /// Low-risk lifecycle action that does not require governance basis.
    Low,
    /// Medium-risk action that may require additional validation.
    Medium,
    /// High-risk action that requires governance basis before acceptance.
    High,
    /// Critical action that requires governance basis and explicit terminal handling.
    Critical,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Low` | Low-risk lifecycle action that does not require governance basis. | 普通可恢复动作 | config / request policy summary | 可不带 basis,仍需 reason/actor |
| `Medium` | Medium-risk action that may require additional validation. | 可能需要额外校验 | config / policy summary | 是否需要 basis 由 Step 10/14 明确 |
| `High` | High-risk action that requires governance basis before acceptance. | 高风险动作 | config / policy summary | 必须进入 basis guard |
| `Critical` | Critical action that requires governance basis and explicit terminal handling. | 关键终态动作 | config / policy summary | 必须有 basis,并由 terminal flow 处理 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(risk_kind: LifecycleRiskKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 lifecycle risk ref | kind/source 来自正式 policy source | `Result<LifecycleRiskRef, ContractError>` | 不读取 policy body |
| `pub fn requires_governance_basis(&self) -> bool` | 判断当前风险是否要求治理依据 | 无 | `bool` | `High` / `Critical` 返回 true;`Medium` 是否需要 basis 留 Step 10/14 |
| `pub fn same_risk(&self, other: &LifecycleRiskRef) -> bool` | 同一风险分类判断 | `other` 为另一个 risk ref | `bool` | 比较 kind + source ref |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| risk 不是权限结果 | risk 只表达动作风险;是否允许执行还需 actor、reason、basis、状态矩阵 |
| 不保存 policy body | 配置或治理 policy 正文不进入 identity |
| 不由实现私自扩展 | 新 risk kind 需要先回 Step 6/10/14 |
| 不替代 basis | `High` / `Critical` 只说明需要 basis,不说明 basis 有效 |

##### `GovernanceBasisRef`

```rust
/// Body-free reference to a governance basis used by Identity.
pub struct GovernanceBasisRef {
    /// Governance basis category.
    pub basis_kind: GovernanceBasisKind,
    /// Opaque governance-side reference.
    pub external_ref: ExternalSourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `basis_kind` | `GovernanceBasisKind` | 治理依据类别 | 来自 command request 或 governance resolver summary;不得从 external ref 解析 |
| `external_ref` | `ExternalSourceRef` | governance 侧 opaque ref | 指向 governance-owned basis;identity 不读取/保存正文 |

```rust
/// Category of governance basis referenced by Identity.
pub enum GovernanceBasisKind {
    /// Governance gate or decision basis.
    GateDecision,
    /// Approval or responsibility-chain basis.
    Approval,
    /// Policy or shared-rule basis.
    Policy,
    /// Compliance or control basis.
    ComplianceControl,
    /// Manually recorded governance exception.
    GovernanceException,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `GateDecision` | Governance gate or decision basis. | gate/decision 裁决作为依据 | governance resolver | high-risk lifecycle guard |
| `Approval` | Approval or responsibility-chain basis. | approval / responsibility chain 作为依据 | governance resolver | high-risk lifecycle guard |
| `Policy` | Policy or shared-rule basis. | policy fact / shared rules 作为依据 | governance resolver | lifecycle/policy guard 输入 |
| `ComplianceControl` | Compliance or control basis. | compliance/control 作为依据 | governance resolver | terminal/high-risk guard |
| `GovernanceException` | Manually recorded governance exception. | 例外授权 | governance resolver / request | 必须由 Step 8/12 明确 public surface |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(basis_kind: GovernanceBasisKind, external_ref: ExternalSourceRef) -> Result<Self, ContractError>` | 构造 governance basis ref | kind/external ref 来自 request 或 resolver | `Result<GovernanceBasisRef, ContractError>` | 校验非空;不读取 governance |
| `pub fn same_basis(&self, other: &GovernanceBasisRef) -> bool` | 同一 basis 判断 | `other` 为另一个 basis ref | `bool` | 比较 kind + external ref |
| `pub fn to_source_ref(&self) -> IdentitySourceRef` | 作为 body-free source marker 使用 | 无 | `IdentitySourceRef` | owner 固定为 `IdentitySourceOwner::Governance`;不复制 governance body |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不拥有 governance truth | Gate、Decision、Approval、Policy、Control 等 truth 归 `L1-governance` |
| 不解析 external ref | 不能通过字符串前缀判断 basis kind 或有效性 |
| 不等于 valid basis | ref 存在不代表 basis 有效;必须结合 resolver summary |
| 不保存治理正文 | approval note、policy body、control evidence、decision reason body 不进入 identity |

##### `GovernanceBasisSummary`

```rust
/// Body-free resolver summary for a governance basis referenced by Identity.
pub struct GovernanceBasisSummary {
    /// Governance basis ref that was resolved.
    pub basis_ref: GovernanceBasisRef,
    /// Resolution state returned by the governance basis resolver.
    pub basis_state: GovernanceBasisState,
    /// Risk class or lifecycle action that the basis is allowed to support.
    pub supports_risk_ref: Option<LifecycleRiskRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `basis_ref` | `GovernanceBasisRef` | 被解析的治理依据引用 | 来自 command request / resolver input |
| `basis_state` | `GovernanceBasisState` | basis 解析状态 | 来自 Step 7 governance basis resolver typed read;Step 6 不定义 trait |
| `supports_risk_ref` | `Option<LifecycleRiskRef>` | basis 支持的 lifecycle 风险分类 | 来自 resolver safe summary;用于 high-risk guard;不得读取 policy/decision body |

```rust
/// Resolution state for a governance basis summary.
pub enum GovernanceBasisState {
    /// Basis exists and can be used for the requested action class.
    Valid,
    /// Basis exists but is stale and must not be silently accepted as current.
    Stale,
    /// Basis cannot be resolved because governance dependency is unavailable.
    Unavailable,
    /// Basis was resolved but does not authorize the requested action class.
    InvalidForAction,
    /// Basis ref does not point to an existing governance basis.
    NotFound,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Valid` | Basis exists and can be used for the requested action class. | 可作为 high-risk guard 输入 | governance basis resolver | accepted precheck 候选 |
| `Stale` | Basis exists but is stale and must not be silently accepted as current. | 依据过期 | resolver / refresh summary | rejected / pending / dependency surface 由 Step 12 |
| `Unavailable` | Basis cannot be resolved because governance dependency is unavailable. | 依赖不可用 | resolver error summary | dependency unavailable surface |
| `InvalidForAction` | Basis was resolved but does not authorize the requested action class. | basis 与动作不匹配 | resolver summary / guard | rejected |
| `NotFound` | Basis ref does not point to an existing governance basis. | 未找到 basis | resolver | rejected / not found surface |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_resolver(basis_ref: GovernanceBasisRef, basis_state: GovernanceBasisState, supports_risk_ref: Option<LifecycleRiskRef>) -> Self` | 从 resolver summary 构造 body-free basis summary | 入参均来自 Step 7 resolver | `GovernanceBasisSummary` | 不保存 governance body |
| `pub fn is_valid_for(&self, risk_ref: &LifecycleRiskRef) -> bool` | 判断 basis 是否可支持指定风险分类 | `risk_ref` 为当前 lifecycle action risk | `bool` | `basis_state == Valid` 且 `supports_risk_ref` 同一或后续 Step 10/14 允许 |
| `pub fn requires_recheck(&self) -> bool` | 判断是否需要重新解析 | 无 | `bool` | `Stale` / `Unavailable` 可返回 true;不自动 accepted |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| summary 不是 governance truth | 只保存 resolver 可见的 body-free safe summary |
| invalid/unavailable 不得伪成功 | high-risk lifecycle 缺 valid summary 不得 accepted |
| 不定义 resolver trait | 读取面、fake 等价语义和错误映射留 Step 7/12 |
| 不写入 lifecycle truth body | lifecycle state 只保存 `GovernanceBasisRef`,不保存 summary body |

##### 6.1-b 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖已写 6.A / 6.B 中未细化类型 | 通过 | 已覆盖 `IdentityAnchorReasonRef`,`LifecycleReasonRef`,`LifecycleRiskRef`,`GovernanceBasisRef` |
| 是否给出 Rust 结构 / enum | 通过 | 每个 reason/basis/risk 类型均有代码块、字段表、helper 和禁止事项 |
| basis 有效性是否有 guard 输入 | 通过 | 补 `GovernanceBasisSummary` / `GovernanceBasisState`;但 resolver trait 留 Step 7 |
| 是否保存外部 truth body | 未保存 | reason、risk、basis 均 body-free,不保存 governance/approval/policy/control body |
| 是否越过 Step 7~10 | 通过 | 未定义 resolver trait、DTO schema、flow、DDL 或完整状态矩阵 |
| 是否仍有后续 6.1 缺口 | 是 | role/capability source/evidence/version/safe summary/material marker 留给 `6.1-c` |

##### 6.1-b 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| anchor reason | `IdentityAnchorReasonRef { reason_kind: Tombstoned, source_ref }` 解释 ref hold | 在 anchor state 中保存审批正文或删除理由长文本 |
| lifecycle reason | `LifecycleReasonRef` 必填且只保存 kind/source marker | lifecycle transition 接收空字符串 reason 并 accepted |
| risk | `LifecycleRiskRef::requires_governance_basis()` 只判断风险类别 | risk helper 直接读取 governance policy body |
| governance basis | `GovernanceBasisRef { basis_kind, external_ref }` + resolver summary 判断 valid | 从 `external_ref` 字符串前缀推断 basis 类型和有效性 |
| unavailable basis | `GovernanceBasisState::Unavailable` 进入 Step 12 dependency unavailable / pending 口径 | governance resolver 不可用时仍把 high-risk lifecycle accepted |

#### 7.2.3 6.1-c role/capability source/evidence/material marker 细化

本批只展开 6.C 已经引用、但尚未具备独立字段来源和禁止事项的 role / capability source、source version、evidence、safe summary、change reason 与 material marker。目标是让后续 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot` 和 `RoleCapabilitySourcePolicy` 可以只消费 typed marker,不私下保存 RoleDefinition / CapabilityDefinition / method body / evidence body,也不从字符串前缀推断来源种类。

本批不定义 source resolver / evidence resolver trait,不定义 command/event DTO 的完整 schema,不定义 role/capability source changed flow,不定义 DDL、transaction order 或完整 state matrix。

##### 6.1-c capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属类型 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 标识 role 来源 | method-library role source resolver / command source marker | `RoleSourceRef` | 只表达 role-bearing source,不保存 RoleDefinition body | `RoleSourceRef`,`RoleCapabilitySourceRef` | Step 7 source resolver;Step 8 maintain summary command/event |
| 标识 capability 来源 | method-library capability source resolver / command source marker | `CapabilitySourceRef` | 只表达 capability-bearing source,不保存 CapabilityDefinition body | `CapabilitySourceRef`,`RoleCapabilitySourceRef` | Step 7 source resolver;Step 8 maintain summary command/event |
| 统一 role/capability 来源主语 | request / event / resolver safe summary | `RoleCapabilitySourceRef` | 作为 snapshot/source-state 的 canonical ref | `RoleCapabilitySourceRef`,`RoleCapabilitySourceKind` | Step 7 canonical source mapping;Step 11 unique key |
| 标识来源版本 | resolver / source changed event | `RoleCapabilitySourceVersionRef` | 只用于 stale/superseded 判断;不作为 snapshot id | `RoleCapabilitySourceVersionRef` | Step 9 source changed flow;Step 10 source state;Step 11 persisted version |
| 标识能力证据 | resolver / command material marker / source event | `CapabilityEvidenceRef` | 只保存证据 ref 与 kind,不保存 artifact/evidence body | `CapabilityEvidenceRef`,`CapabilityEvidenceKind` | Step 7 evidence resolver;Step 12 missing/unavailable evidence |
| 标识安全摘要 | resolver / redaction-safe summary producer | `RoleCapabilitySafeSummaryRef` | 只指向可公开传播的 safe summary marker,不保存正文 | `RoleCapabilitySafeSummaryRef` | Step 8 query/outbound payload;Step 12 redaction |
| 标识摘要变化原因 | command / source changed event / reconciliation report | `RoleCapabilityChangeReasonRef` | 只保存原因 marker;不保存长文本或审批正文 | `RoleCapabilityChangeReasonRef` | Step 8 command/event schema;Step 10 required reason |
| 分类提交 material | API/worker schema precheck | `RoleCapabilityChangeMaterialMarker` | 区分 safe marker 与 forbidden body/scoring material | `RoleCapabilityChangeMaterialMarker`,`RoleCapabilityChangeMaterialKind` | Step 8 body-free schema;Step 12 rejection;Step 16 negative tests |

##### `RoleCapabilitySourceKind`

```rust
/// Role/capability source category owned outside Identity.
pub enum RoleCapabilitySourceKind {
    /// Method-library role definition source.
    RoleDefinition,
    /// Method-library capability definition source.
    CapabilityDefinition,
    /// Method-library bundle that contains both role and capability markers.
    RoleCapabilityBundle,
    /// Method-library source profile or catalog entry used only as a body-free summary source.
    MethodSourceProfile,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `RoleDefinition` | Method-library role definition source. | 表达 role-bearing 来源 | source resolver / command marker / source event | `RoleSourceRef`;snapshot source |
| `CapabilityDefinition` | Method-library capability definition source. | 表达 capability-bearing 来源 | source resolver / command marker / source event | `CapabilitySourceRef`;snapshot source |
| `RoleCapabilityBundle` | Method-library bundle that contains both role and capability markers. | 同时承载 role 与 capability marker 的来源 | resolver safe summary / source event | role/capability summary snapshot |
| `MethodSourceProfile` | Method-library source profile or catalog entry used only as a body-free summary source. | 方法库 profile / catalog safe marker | resolver safe summary | safe summary / source snapshot |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn supports_role(&self) -> bool` | 判断 source kind 是否可作为 role 来源 | 无 | `bool` | `RoleDefinition` / `RoleCapabilityBundle` 返回 true;不读取 source body |
| `pub fn supports_capability(&self) -> bool` | 判断 source kind 是否可作为 capability 来源 | 无 | `bool` | `CapabilityDefinition` / `RoleCapabilityBundle` 返回 true;不读取 source body |
| `pub fn is_method_owned(&self) -> bool` | 判断是否属于 method-library 边界 | 无 | `bool` | 当前所有 variant 均为 method-owned;helper 不替代 resolver |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| kind 必须显式传入 | 不得从 external ref 前缀推断 role/capability 类型 |
| kind 不等于 definition body | variant 只表达来源类别,不携带定义字段 |
| 不表达 ProjectMember role assignment | 项目内角色归 work,不进入本 source kind |

##### `RoleCapabilitySourceRef`

```rust
/// Body-free canonical source ref for role/capability material.
pub struct RoleCapabilitySourceRef {
    /// Source category.
    pub source_kind: RoleCapabilitySourceKind,
    /// Method-library owned body-free source ref.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_kind` | `RoleCapabilitySourceKind` | 标识 role / capability / bundle / profile 来源类别 | 来自 request schema、source event 或 resolver safe summary;不得从字符串推断 |
| `source_ref` | `IdentitySourceRef` | method-library owner 的 body-free external ref | `source_owner` 必须为 `IdentitySourceOwner::MethodLibrary`;不得保存 method body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(source_kind: RoleCapabilitySourceKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 canonical source ref | kind 显式给出;source ref 来自正式输入 | `Result<RoleCapabilitySourceRef, ContractError>` | 校验 owner 为 method-library;不读取 source body |
| `pub fn same_source(&self, other: &RoleCapabilitySourceRef) -> bool` | 判断是否同一来源 | `other` 为另一个 source ref | `bool` | 比较 kind + typed source ref |
| `pub fn supports_role(&self) -> bool` | 判断是否可包装为 `RoleSourceRef` | 无 | `bool` | 委托 `source_kind.supports_role()` |
| `pub fn supports_capability(&self) -> bool` | 判断是否可包装为 `CapabilitySourceRef` | 无 | `bool` | 委托 `source_kind.supports_capability()` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| canonical ref 只承载 body-free marker | RoleDefinition、CapabilityDefinition、method catalog body 不进入字段 |
| owner 必须为 method-library | 其它 owner 不能伪装成 role/capability source |
| 不从 source ref 派生 summary/snapshot id | summary/snapshot id 仍由 identity id source 分配 |
| 不替代 source resolver | 存在性、可用性、safe summary 和 version 由 Step 7 resolver 给出 |

##### `RoleSourceRef`

```rust
/// Body-free role source ref accepted by Identity role capability summary.
pub struct RoleSourceRef {
    /// Canonical role-capability source ref that supports role usage.
    pub source_ref: RoleCapabilitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `RoleCapabilitySourceRef` | role 来源 canonical ref | `source_kind.supports_role()` 必须为 true;来自 resolver / request / event |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_source(source_ref: RoleCapabilitySourceRef) -> Result<Self, ContractError>` | 从 canonical source 包装 role source | `source_ref` 必须支持 role | `Result<RoleSourceRef, ContractError>` | 不读取 RoleDefinition body |
| `pub fn canonical_source(&self) -> &RoleCapabilitySourceRef` | 返回 canonical source ref | 无 | `&RoleCapabilitySourceRef` | 只读 helper |
| `pub fn same_role_source(&self, other: &RoleSourceRef) -> bool` | 判断同一 role 来源 | `other` 为另一个 role source | `bool` | 委托 canonical source 比较 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 RoleDefinition body | role name、permission、assignment 详情均不进入 identity truth |
| 不表达 work role assignment | 项目参与角色归 work/career 批次 |
| 不允许 capability-only source 包装成 role | `CapabilityDefinition` 单独来源不得进入 `RoleSourceRef` |

##### `CapabilitySourceRef`

```rust
/// Body-free capability source ref accepted by Identity role capability summary.
pub struct CapabilitySourceRef {
    /// Canonical role-capability source ref that supports capability usage.
    pub source_ref: RoleCapabilitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `RoleCapabilitySourceRef` | capability 来源 canonical ref | `source_kind.supports_capability()` 必须为 true;来自 resolver / request / event |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_source(source_ref: RoleCapabilitySourceRef) -> Result<Self, ContractError>` | 从 canonical source 包装 capability source | `source_ref` 必须支持 capability | `Result<CapabilitySourceRef, ContractError>` | 不读取 CapabilityDefinition body |
| `pub fn canonical_source(&self) -> &RoleCapabilitySourceRef` | 返回 canonical source ref | 无 | `&RoleCapabilitySourceRef` | 只读 helper |
| `pub fn same_capability_source(&self, other: &CapabilitySourceRef) -> bool` | 判断同一 capability 来源 | `other` 为另一个 capability source | `bool` | 委托 canonical source 比较 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 CapabilityDefinition body | 能力等级、规则、评分算法、正文均不进入 identity truth |
| 不表达自动能力评分 | 自动评分/绩效推断由 material marker 拒绝 |
| 不允许 role-only source 包装成 capability | `RoleDefinition` 单独来源不得进入 `CapabilitySourceRef` |

##### `RoleCapabilitySourceVersionRef`

```rust
/// Opaque source-side version marker for role/capability source material.
pub struct RoleCapabilitySourceVersionRef {
    /// Source this version belongs to.
    pub source_ref: RoleCapabilitySourceRef,
    /// Opaque source-side version token.
    pub version_token: String,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `RoleCapabilitySourceRef` | 版本所属来源 | 来自 resolver / source event;必须与 snapshot.source_ref 匹配 |
| `version_token` | `String` | 来源侧 opaque version marker | 来源于 method-library resolver 或 source changed event;非空;不得解析结构 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(source_ref: RoleCapabilitySourceRef, version_token: String) -> Result<Self, ContractError>` | 构造来源版本 ref | source ref 与 token 来自正式输入 | `Result<RoleCapabilitySourceVersionRef, ContractError>` | 校验 token 非空;不解析 token |
| `pub fn belongs_to(&self, source_ref: &RoleCapabilitySourceRef) -> bool` | 判断版本是否属于指定来源 | `source_ref` 为 snapshot/request 来源 | `bool` | 只比较 typed source ref |
| `pub fn same_version(&self, other: &RoleCapabilitySourceVersionRef) -> bool` | 判断同一来源版本 | `other` 为另一个 version ref | `bool` | 比较 source_ref + version_token |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| version 不等于 snapshot id | snapshot id 由 identity id source 分配 |
| version 不等于 truth cursor | accepted truth cursor 留 Step 7/11/13 闭口 |
| 不解析 token | 不从 token 前缀、时间戳或序列推断业务状态 |
| 必须绑定 source_ref | 避免跨来源版本 token 碰撞 |

##### `CapabilityEvidenceKind` / `CapabilityEvidenceRef`

```rust
/// Body-free evidence category for a capability assertion.
pub enum CapabilityEvidenceKind {
    /// Evidence from a method-library artifact or catalog marker.
    MethodArtifact,
    /// Evidence from governance-approved summary or basis.
    GovernanceBasis,
    /// Evidence from work participation summary.
    WorkParticipationSummary,
    /// Evidence from an explicit identity-side safe marker.
    IdentitySafeMarker,
}

/// Body-free evidence reference for a role/capability summary.
pub struct CapabilityEvidenceRef {
    /// Evidence category.
    pub evidence_kind: CapabilityEvidenceKind,
    /// Opaque evidence source ref.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `evidence_kind` | `CapabilityEvidenceKind` | 证据类别 | 来自 resolver / command marker / source event;不得从 ref 字符串推断 |
| `source_ref` | `IdentitySourceRef` | body-free 证据来源 ref | 只保存 evidence identity;不得保存 artifact/evidence body |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `MethodArtifact` | Evidence from a method-library artifact or catalog marker. | 方法库 artifact / catalog 证据 marker | method resolver | summary evidence refs |
| `GovernanceBasis` | Evidence from governance-approved summary or basis. | governance 依据类证据 marker | governance resolver summary | summary evidence refs / high-risk guard |
| `WorkParticipationSummary` | Evidence from work participation summary. | work 参与摘要证据 marker | work resolver / consumer | career/summary linkage |
| `IdentitySafeMarker` | Evidence from an explicit identity-side safe marker. | identity 已接受事实的安全 marker | accepted identity truth / reconciliation marker | summary evidence refs |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(evidence_kind: CapabilityEvidenceKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 evidence ref | kind 与 source ref 来自正式输入 | `Result<CapabilityEvidenceRef, ContractError>` | 校验 kind/source owner 组合;不读取 evidence body |
| `pub fn same_evidence(&self, other: &CapabilityEvidenceRef) -> bool` | 判断同一 evidence marker | `other` 为另一个 evidence ref | `bool` | 比较 kind + source ref |
| `pub fn is_body_free(&self) -> bool` | 表达 evidence ref 不含正文 | 无 | `bool` | 恒为 true;用于 guard 可读性 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 evidence / artifact body | 附件、报告、日志、评估正文、embedding 均不进入 identity |
| 不从 evidence 推断能力等级 | evidence 只支持解释性摘要,不触发 automatic scoring |
| source owner 必须匹配 kind | 例如 method artifact 不得用 account owner 伪造 |
| 缺 evidence 不得 silent accepted | 缺失分支由 Step 9/10/12 闭口,本批固定必须可被 policy 检出 |

##### `RoleCapabilitySafeSummaryRef`

```rust
/// Body-free reference to a redaction-safe role/capability summary.
pub struct RoleCapabilitySafeSummaryRef {
    /// Source this safe summary describes.
    pub source_ref: RoleCapabilitySourceRef,
    /// Opaque safe summary marker.
    pub safe_summary_token: String,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `RoleCapabilitySourceRef` | safe summary 对应的来源 | 来自 resolver safe summary;必须与 snapshot.source_ref 匹配 |
| `safe_summary_token` | `String` | 可传播安全摘要 marker | 非空 opaque token;指向 redaction-safe summary,不保存 summary body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(source_ref: RoleCapabilitySourceRef, safe_summary_token: String) -> Result<Self, ContractError>` | 构造 safe summary ref | source ref 与 token 来自 resolver/request safe marker | `Result<RoleCapabilitySafeSummaryRef, ContractError>` | 校验非空;不保存正文 |
| `pub fn belongs_to_source(&self, source_ref: &RoleCapabilitySourceRef) -> bool` | 判断 safe summary 是否对应指定来源 | source ref 来自 snapshot/request | `bool` | 只比较 typed source ref |
| `pub fn same_safe_summary(&self, other: &RoleCapabilitySafeSummaryRef) -> bool` | 判断同一 safe summary marker | `other` 为另一个 safe summary ref | `bool` | 比较 source_ref + token |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref 不等于 safe summary body | 最小 public schema / redaction 字段留 Step 8/12 |
| 不从 token 推导 source | token 只 opaque 标识,source_ref 必须显式字段 |
| 不携带 sensitive definition | role/capability definition、method body、evidence body 不进入 token 字段 |
| 必须可与 source snapshot 对齐 | snapshot 写入前应校验 source_ref 一致 |

##### `RoleCapabilityChangeReasonRef`

```rust
/// Body-free reason reference for a role/capability summary change.
pub struct RoleCapabilityChangeReasonRef {
    /// Reason kind for the role/capability change.
    pub reason_kind: RoleCapabilityChangeReasonKind,
    /// Body-free source that explains where the reason came from.
    pub source_ref: IdentitySourceRef,
}

/// Reason category for role/capability summary changes.
pub enum RoleCapabilityChangeReasonKind {
    /// Explicit member summary maintenance command.
    ManualSummaryMaintenance,
    /// Method-library source was changed.
    SourceChanged,
    /// Source became unavailable or unrecognized.
    SourceUnavailable,
    /// Reconciliation found drift that requires a controlled update.
    ReconciliationCorrection,
    /// Legacy or migration-safe summary import.
    MigrationImport,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reason_kind` | `RoleCapabilityChangeReasonKind` | 摘要变化原因类别 | 来自 command intent、source event、reconciliation report 或 migration marker |
| `source_ref` | `IdentitySourceRef` | 原因来源 marker | body-free;不得保存原因长文本、审批正文或 source payload |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(reason_kind: RoleCapabilityChangeReasonKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造变化原因 ref | kind/source 来自正式输入 | `Result<RoleCapabilityChangeReasonRef, ContractError>` | 不保存 reason body |
| `pub fn is_source_driven(&self) -> bool` | 判断是否来源变化驱动 | 无 | `bool` | `SourceChanged` / `SourceUnavailable` 返回 true |
| `pub fn requires_reconciliation_trace(&self) -> bool` | 判断是否需要后续 trace/report 解释 | 无 | `bool` | `ReconciliationCorrection` 返回 true;不写 trace |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 必填但 body-free | 不允许空字符串 reason 或长文本原因正文进入 truth |
| 不替代 actor | reason 解释为什么变更;actor 解释谁发起 |
| 不替代 governance basis | 高风险 lifecycle basis 已由 `GovernanceBasisRef` 表达 |
| migration 必须显式标记 | 不得把 migration import 伪装为普通 source changed |

##### `RoleCapabilityChangeMaterialKind` / `RoleCapabilityChangeMaterialMarker`

```rust
/// Body-free material category for role/capability summary changes.
pub enum RoleCapabilityChangeMaterialKind {
    /// Safe summary marker only; no definition or evidence body included.
    SafeSummaryMarker,
    /// Source reference and source version marker only.
    SourceVersionMarker,
    /// Evidence references only; no evidence body included.
    EvidenceRefsOnly,
    /// Forbidden definition body was presented and must be rejected.
    ForbiddenDefinitionBody,
    /// Forbidden method body was presented and must be rejected.
    ForbiddenMethodBody,
    /// Forbidden evidence or artifact body was presented and must be rejected.
    ForbiddenEvidenceBody,
    /// Automatic scoring or performance inference material was presented and must be rejected.
    ForbiddenAutomaticScoring,
}

/// Material marker used by policy to block forbidden role/capability payloads.
pub struct RoleCapabilityChangeMaterialMarker {
    /// Material category.
    pub material_kind: RoleCapabilityChangeMaterialKind,
    /// Optional source marker that supplied the material.
    pub source_ref: Option<IdentitySourceRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `material_kind` | `RoleCapabilityChangeMaterialKind` | 提交 material 的 body-free 分类 | 来自 Step 8 DTO/event schema precheck;必须显式区分 safe 与 forbidden |
| `source_ref` | `Option<IdentitySourceRef>` | material 来源 marker | 可为空表示 request-level precheck;不保存 material body |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `SafeSummaryMarker` | Safe summary marker only; no definition or evidence body included. | 允许的 safe summary marker | command/event precheck | policy accepted 候选 |
| `SourceVersionMarker` | Source reference and source version marker only. | 允许的 source/version marker | source resolver/event | snapshot |
| `EvidenceRefsOnly` | Evidence references only; no evidence body included. | 允许的 evidence refs marker | command/resolver | summary evidence refs |
| `ForbiddenDefinitionBody` | Forbidden definition body was presented and must be rejected. | 禁止定义正文 | DTO/event precheck | rejected |
| `ForbiddenMethodBody` | Forbidden method body was presented and must be rejected. | 禁止 method body | DTO/event precheck | rejected |
| `ForbiddenEvidenceBody` | Forbidden evidence or artifact body was presented and must be rejected. | 禁止证据/附件正文 | DTO/event precheck | rejected |
| `ForbiddenAutomaticScoring` | Automatic scoring or performance inference material was presented and must be rejected. | 禁止自动评分/绩效推断 | DTO/event precheck | rejected |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(material_kind: RoleCapabilityChangeMaterialKind, source_ref: Option<IdentitySourceRef>) -> Self` | 构造 material marker | kind 来自 schema precheck;source 可选 | `RoleCapabilityChangeMaterialMarker` | 不保存 body |
| `pub fn is_forbidden(&self) -> bool` | 判断是否为禁止 material | 无 | `bool` | forbidden variant 返回 true |
| `pub fn is_safe_marker_only(&self) -> bool` | 判断是否仅含 body-free marker | 无 | `bool` | safe marker/source version/evidence refs 返回 true |
| `pub fn rejection_reason_code(&self) -> Option<&'static str>` | 给 Step 12 错误映射提供稳定分类 | 无 | `Option<&'static str>` | 只返回分类 code,不包含正文 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| forbidden variant 必须 rejected | 不能落入 domain truth、outbox payload、trace detail 或 stored result body |
| marker 不携带正文 | material body 在 schema precheck 层被拒绝或丢弃,不得传入 domain object |
| 自动评分必须显式拒绝 | identity 不从任务表现、日志、指标或模型输出自动写能力等级 |
| 不新增隐式 safe 类型 | 新 safe material kind 必须先回 Step 6/8/12 更新 |

##### 6.1-c 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 6.C 已引用但未细化类型 | 通过 | 已覆盖 `RoleSourceRef`,`CapabilitySourceRef`,`RoleCapabilitySourceRef`,`RoleCapabilitySourceVersionRef`,`CapabilityEvidenceRef`,`RoleCapabilitySafeSummaryRef`,`RoleCapabilityChangeReasonRef`,`RoleCapabilityChangeMaterialMarker` |
| 是否给出 Rust 结构 / enum | 通过 | 每个 source/evidence/safe summary/reason/material 类型均有代码块、字段表、helper 和禁止事项 |
| 是否明确 body-free / forbidden body 规则 | 通过 | definition body、method body、evidence/artifact body、automatic scoring material 均被禁止 |
| 是否避免字符串拼接 / 前缀解析 | 通过 | source kind、evidence kind、source owner、source ref 均显式字段;helper 只比较 typed 字段 |
| 是否越过 Step 7~10 | 通过 | 未定义 resolver trait、DTO schema、function flow、DDL 或完整状态矩阵 |
| 是否仍有后续 Step 6 缺口 | 是 | 需进入 `6.2-a~6.2-c` 复核已有 6.A~6.C 与 6.1 shared type 是否一致 |

##### 6.1-c 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| role source | `RoleSourceRef::from_source(source_ref)` 要求 kind 支持 role 且 owner 为 method-library | `format!("role:{id}")` 拼 source,或直接保存 RoleDefinition JSON |
| capability source | `CapabilitySourceRef` 只保存 capability-bearing canonical source | 从 ProjectMember assignment 推导 capability truth 并写入 identity |
| source version | `RoleCapabilitySourceVersionRef { source_ref, version_token }` 只做 stale/superseded 判断 | 用 source version token 作为 snapshot id 或 truth cursor |
| evidence | `CapabilityEvidenceRef { evidence_kind, source_ref }` 保存 body-free evidence marker | 在 summary/snapshot 中保存证据附件、报告正文、日志或 artifact body |
| safe summary | `RoleCapabilitySafeSummaryRef` 显式绑定 source ref 与 opaque safe marker | 从 safe summary token 前缀推断 source,或在 token 中塞入敏感定义字段 |
| material marker | `ForbiddenAutomaticScoring` 被 policy 拒绝 | 根据任务日志、绩效指标或模型输出自动写“能力等级” |

### 7.3 模块执行顺序表

| 顺序 | 批次 | 模块组 / 对象组 | 模块职责来源 | 输入来源 | 完成后停审点 |
|---:|---|---|---|---|---|
| 0 | `6.R` | governance 粒度对齐与重规划 | governance Step 6 粒度、详细设计 SOP、闭环标准 | 当前 6.0~6.C、governance §10~§20 | 新批次是否覆盖 shared type、domain、view/report、helper、entry、字段闭环、状态闭环和 Step 7 红线 |
| 1 | `6.1` | contracts shared type / refs / markers | `identity-contracts` public secondary types | `02` §6~§9、当前 6.0 shared vocabulary、已写 6.A~6.C 用到的未细化类型 | id/ref/reason/state/marker/helper set 是否具备 Rust 代码块、字段来源和禁止事项 |
| 2 | `6.2-a` | domain core:身份锚定与成员真相 | `identity-domain` truth/state/policy | 已写 6.A;`6.1` typed ref / reason / marker | 6.A 是否仍闭合,是否需补 shared type 字段来源 |
| 3 | `6.2-b` | domain core:全局生命周期 | `identity-domain` lifecycle state / guard | 已写 6.B;`6.1` lifecycle reason / risk / governance basis marker | high-risk basis、terminal state、anchor hold 是否闭合到 Step 10 / Step 7 |
| 4 | `6.2-c` | domain core:角色能力摘要 | `identity-domain` summary/source snapshot/policy | 已写 6.C;`6.1` role/capability/evidence/material marker | safe summary、source state、forbidden body marker 是否闭合 |
| 5 | `6.2-d` | domain core:身份生涯记录 | append-only career truth/history | `CareerRecord`,`CareerAppendPolicy`;career command/work consumer | append-only、duplicate source、work truth 排除闭合 |
| 6 | `6.2-e` | domain core:记忆引用关系 | memory relation/state/policy | `MemoryReference`,`MemoryReferenceState`,`MemoryReferencePolicy`;memory command/archive callback | memory body / embedding / archive package 排除闭合 |
| 7 | `6.3` | consumption / trace / audit / visibility | contracts view + domain trace/audit/policy | `MemberSummaryView`,`IdentityTraceRecord`,`AuditTrail`,`VisibilityPolicy`;query / trace / audit 消费组 | query no-write、visibility、redaction、trace/audit subject 和正文不泄漏闭合 |
| 8 | `6.4` | projection / reference / reconciliation | projection/reference/report state and policy | `ProjectionState`,`ReferenceResolutionState`,`ReconciliationPolicy`,`ReconciliationReport`;maintenance jobs | report-only、不修复外部 truth、projection lookup、reference typed read 风险闭合 |
| 9 | `6.5` | outbox / handoff / propagation | outbox/handoff state/policy | `IdentityOutboxRecord`,`TraceHandoffIntent`,`OutboxState`,`HandoffState`,`OutboundEventPolicy`,`HandoffPolicy`;outbound/job/callback | publish 不作 accepted 前置、handoff 不伪成功、不保存 payload/receipt body |
| 10 | `6.6` | application helper objects | application service support | operation context、idempotency、stored result、visibility decision、job report assembly | duplicate replay、query visibility、job result 和 operation metadata 是否有 object surface |
| 11 | `6.7` | infra / api / worker / jobs entry objects | infra and entry boundary | runtime config/builder state、adapter availability、API/worker/job entry / validation result | entry 不保存 raw body/secret,不绕过 application,adapter availability 不改 domain invariant |
| 12 | `6.8` | 字段闭环表 | 全对象组字段来源审计 | `6.1`~`6.7` | 高复用字段、对象组字段来源和实现暂停条件是否显式 |
| 13 | `6.9` | 状态闭环表 | 全状态族来源审计 | `6.1`~`6.7` | 初始状态、可变状态、终态、迁移 owner 和 Step 10 必须闭合点是否明确 |
| 14 | `6.10` | Step 7 承接和启动红线 | Step 7 输入门禁 | `6.1`~`6.9` | Step 7 所需 port 组、不得改写 Step 6 字段、不得自造读取面是否闭合 |

### 7.4 对象能力到字段 / 函数 / 状态映射统一模板

后续每个对象小节必须使用以下表格。若某项不适用,必须写“不适用”和原因,不得省略。

#### `<ObjectName>` 对象卡片模板

| 项 | 结论 |
|---|---|
| 所属批次 | `6.X` |
| 所属业务组成部分 | `<来自 Step 5 / 02 §5>` |
| 归属 crate / module | `identity-domain` / `identity-contracts` / `identity-application` 等 |
| 承接 capability | `<功能 / capability>` |
| 对象类别 | truth object / state enum / policy / guard / view / trace / audit / report / outbox / handoff / helper |
| 主要责任 | `<一句话>` |
| 不承担什么 | `<边界>` |
| 后续 Step 承接 | Step 7 / 8 / 9 / 10 / 11 / 12 / 13 / 16 |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| `<capability>` | `<field: Type>` | `<Object::from_...(...)>` | `<fn signature>` | `<State::Variant>` | `<request / loaded truth / resolver / id generator / UoW cursor>` |

```rust
/// <对象作用与核心不变量。实现源码 rustdoc 应使用英文;本文用中文描述注释要求。>
pub struct ObjectName {
    /// <字段作用、来源和 forbidden body 边界。>
    pub field_name: FieldType,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `<field>` | `<Type>` | `<作用>` | `<来源>` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `<fn>` | `<作用>` | `<参数类型和来源>` | `<返回>` | `<副作用>` |

```rust
/// <enum 表达的状态 / 分类 / 错误集合边界。>
pub enum StateName {
    /// <Variant 的业务语义。>
    Variant,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `<Variant>` | `<doc>` | `<作用>` | `<来源>` | `<去向>` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `<invariant>` | `<说明>` |

### 7.5 6.0 模块内停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否先完成 shared vocabulary / typed ref / public marker 收敛 | 通过 | 已列 §7.2;完整 schema 后移具体批次和 Step 8 |
| 是否避免把具体 truth object 放入全局章节 | 通过 | `GlobalMember` 等只在批次计划中出现,对象卡片未提前展开 |
| 是否明确后续模块执行顺序 | 通过 | 已列 §7.3 |
| 是否标明未完成对象批次 | 通过 | §7.1 已按重规划标明 6.1~6.10 的写入状态、缺口和停审节奏 |
| 是否越过 Step 7~10 | 通过 | 未写 port trait、DTO schema、flow、完整状态矩阵或 DDL |
| 是否需要修改正式 `03` | 不需要 | 正式 `03` 仍由 Step 19 装配 |

### 7.6 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| Step 6 写入节奏 | 先写 6.0 框架和 shared refs,审核后再写 6.A `GlobalMember` 对象卡片 | 一次性生成所有对象字段,然后标记 Step 6 完成 |
| 对象来源 | `GlobalMember` 来自“身份锚定与成员真相”的建档、防复用、query no-create capability | 因旧代码里有 `Member` 类型,直接补 id/name/status 字段 |
| boundary ref | `GovernanceBasisRef` 是 high-risk lifecycle 的 body-free basis 引用,具体 resolver 留给 Step 7 | 把 governance decision / approval truth 字段复制到 identity lifecycle 对象 |
| query marker | `IdentityVisibilityMarker` / `IdentityDegradedMarker` 使用 Step 8 shared public shell,从 `IdentityVisibilityDecision` / safe degraded summary 复制 body-free refs | 每个 query handler 自己用字符串拼 `not_visible` / `degraded` |
| cursor / version | `IdentityTruthCursor` 先声明不得用 timestamp/version 代替,来源留给 UoW / repository | 在对象字段中写 `cursor: String` 并默认由时间戳生成 |
| forbidden body | 6.0 先定义 forbidden body marker,后续每个对象说明不得保存 role/work/memory/archive body | `MemoryReference` 为方便查询保存 memory text 或 archive package metadata |

### 7.7 6.A 身份锚定与成员真相

本批只处理“身份锚定与成员真相”对象契约,目标是让平台级成员身份主语、稳定 `GlobalMemberRef`、不可复用持有、query no-create 和账号 / ProjectMember / runtime identity 排除规则在 Step 6 内可落码。生命周期可用性、角色能力、生涯、记忆、trace、audit、projection、outbox 和 handoff 均不在本批展开。

#### 7.7.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立平台级成员身份主语 | `GlobalMemberRef`, `IdentitySourceRef`, `ActorRef`, `IdentityTimestamp`, 已加载的 optional anchor state | 新 `GlobalMember` truth aggregate | `IdentityAnchorState::Established`;不写 lifecycle / trace / outbox 细节 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` | Step 7 member repository / id / clock;Step 8 `EstablishGlobalMember`;Step 9 accepted flow;Step 10 anchor state |
| 防止 ref 复用 | 待建立 `GlobalMemberRef`, 已加载的 `Option<IdentityAnchorState>` | `Ok(())` 或 domain rejection | 已建立、退役持有、墓碑持有均不可复用 | `IdentityAnchorPolicy`, `IdentityAnchorState` | Step 7 read existing anchor;Step 9 rejected branch;Step 10 illegal reuse |
| 保留退役 / 墓碑后的 anchor | 已存在 `GlobalMember`, 新 `IdentityAnchorState`, `ActorRef` | 更新后的 `GlobalMember.anchor_state` | 只变更 anchor hold 状态;不释放 `member_ref` | `GlobalMember`, `IdentityAnchorState` | 6.B lifecycle terminal state;Step 10 terminal hold |
| 查询不建档 | `IdentityOperationChannel`, query request 中的 `GlobalMemberRef` | `Ok(())` 或 domain rejection | query / projection / maintenance / report 不得创建 truth | `IdentityAnchorPolicy` | Step 8 `GetGlobalMemberAnchor`;Step 9 query no-write;Step 12 not_found surface |
| 身份边界排除 | `IdentitySourceRef`, `ActorRef`, operation channel | `Ok(())` 或 domain rejection | account / credential / session / ProjectMember / runtime identity 不进入 member truth | `IdentityAnchorPolicy`, `GlobalMember` | Step 7 source resolver;Step 8 create DTO;Step 12 forbidden body / wrong owner |

#### 7.7.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `GlobalMember` | 建立平台级成员身份主语;保留退役 / 墓碑后的 anchor | truth aggregate | 保存稳定 `member_ref`、创建来源、创建 actor、创建时间和当前 anchor state;提供同一性校验和 anchor state 更新入口 | 不保存账号、credential、session、runtime、ProjectMember、生命周期完整状态、trace、outbox 或 query view |
| `IdentityAnchorState` | 防止 ref 复用;保留退役 / 墓碑后的 anchor | state value / enum wrapper | 表达 `Established`、`RetiredHeld`、`TombstoneHeld`;提供不可复用和 tombstone 判定 | 不表达 `Available` / `Paused` / `Retired` / `Tombstoned` 生命周期矩阵;不提供释放 / 可复用状态 |
| `IdentityAnchorPolicy` | 建档 guard;防止 ref 复用;查询不建档;身份边界排除 | policy / guard | 对已加载输入做创建、读取、ref reuse 和 source owner 校验 | 不读取 repository、不生成 id、不取 clock、不调用外部 resolver、不写 trace / audit / outbox |

#### 7.7.3 `GlobalMember`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.A` |
| 所属业务组成部分 | 身份锚定与成员真相 |
| 归属 crate / module | `identity-domain::member`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 建立平台级成员身份主语;保留退役 / 墓碑后的 anchor |
| 对象类别 | truth aggregate |
| 主要责任 | 保存平台级成员身份主语和稳定 `GlobalMemberRef`,让生命周期、角色能力、生涯、记忆和消费追溯都能依附同一个 identity truth |
| 不承担什么 | 不承担认证账号、credential、session、runtime instance、ProjectMember、项目内承担事实、完整 lifecycle state、trace / audit / outbox material |
| 后续 Step 承接 | Step 7 member repository / id / clock;Step 8 `EstablishGlobalMemberRequest` / result;Step 9 establish flow;Step 10 anchor state;Step 11 persistence unique key |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 建立平台级成员身份主语 | `member_ref: GlobalMemberRef`, `source_ref: IdentitySourceRef`, `created_by_ref: ActorRef`, `created_at: IdentityTimestamp`, `anchor_state: IdentityAnchorState` | `GlobalMember::establish(member_ref, source_ref, actor_ref, created_at)` | `to_ref(&self) -> GlobalMemberRef` | `IdentityAnchorStateKind::Established` | `member_ref` 来自 Step 7 id generator 或 request-bound id;`source_ref` / `actor_ref` 来自 command metadata / request;`created_at` 来自 clock port |
| 校验同一成员主语 | `member_ref: GlobalMemberRef` | 不适用;读取已加载 truth 后调用 | `assert_same_ref(&self, member_ref: GlobalMemberRef) -> Result<(), IdentityDomainError>` | 不适用 | `member_ref` 来自 request / route / source event 映射 |
| 更新不可复用持有状态 | `anchor_state: IdentityAnchorState` | 不适用;由 lifecycle terminal flow 或 tombstone flow 传入已校验状态 | `hold_anchor(&mut self, anchor_state: IdentityAnchorState, actor_ref: ActorRef) -> Result<(), IdentityDomainError>` | `RetiredHeld` / `TombstoneHeld` | 新状态由 `IdentityAnchorPolicy` 或 lifecycle guard 校验后传入;`actor_ref` 来自 command metadata |

```rust
/// 平台级成员身份 truth 主语;`member_ref` 一旦建立不得释放或复用。
pub struct GlobalMember {
    /// 平台级成员身份稳定引用,不是账号、credential、session、runtime identity 或 ProjectMember。
    pub member_ref: GlobalMemberRef,

    /// 当前身份锚定状态,用于表达已建立、退役持有或墓碑持有。
    pub anchor_state: IdentityAnchorState,

    /// 建立该成员身份主语的 body-free 来源引用。
    pub source_ref: IdentitySourceRef,

    /// 执行建档的可信 actor 引用。
    pub created_by_ref: ActorRef,

    /// 成员身份主语首次建立时间。
    pub created_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | 平台级成员身份稳定引用 | 必填;建立后不可变;不得由 query / projection / job 生成;Step 7 闭合 id 来源;Step 11 需要唯一约束 |
| `anchor_state` | `IdentityAnchorState` | 表达 ref 当前锚定 / 持有语义 | `establish(...)` 初始为 `Established`;terminal hold 由已校验 state 更新;不得出现 reusable / released |
| `source_ref` | `IdentitySourceRef` | 建立身份主语的来源 marker | body-free;不得保存账号正文、credential、runtime payload、ProjectMember truth 或外部正文 |
| `created_by_ref` | `ActorRef` | 建档 actor | 来自 command metadata / request context;不是 `GlobalMemberRef` 的替代物 |
| `created_at` | `IdentityTimestamp` | 首次建立时间 | 来自 clock port;不得用作 truth cursor 或版本号 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn establish(member_ref: GlobalMemberRef, source_ref: IdentitySourceRef, actor_ref: ActorRef, created_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从受控创建意图建立平台级成员身份主语 | `member_ref` 来自 id source;`source_ref` 为 body-free 建档来源;`actor_ref` 为可信操作者;`created_at` 来自 clock | 新 `GlobalMember` | 初始 `anchor_state` 必须为 `IdentityAnchorState::established(created_at)`;不写 trace / outbox / lifecycle |
| `pub fn to_ref(&self) -> GlobalMemberRef` | 返回稳定成员引用 | 无 | `GlobalMemberRef` | 不改变对象 |
| `pub fn assert_same_ref(&self, member_ref: GlobalMemberRef) -> Result<(), IdentityDomainError>` | 校验调用方引用的成员与已加载 truth 一致 | `member_ref` 来自 request / route / source event 映射 | `Ok(())` 或 `IdentityDomainError` | 只做同一性校验,不读取 repository |
| `pub fn hold_anchor(&mut self, anchor_state: IdentityAnchorState, actor_ref: ActorRef) -> Result<(), IdentityDomainError>` | 接受已由 policy 校验的持有状态更新 | `anchor_state` 只能是不可复用持有状态;`actor_ref` 来自 command metadata | `Ok(())` 或 `IdentityDomainError` | 不改变 `member_ref`;不得把状态改为 reusable / released |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `member_ref` 一旦建立不得复用 | 即使生命周期退役、墓碑化或外部账号删除,同一个 ref 仍保持占用 |
| query / projection / maintenance 不创建 `GlobalMember` | 查询缺失必须返回 not_found / degraded / rejected surface,不得隐式建档 |
| 不保存外部正文或相邻仓 truth | account、credential、ProjectMember、work、role definition、memory body 均不进入 `GlobalMember` |
| `created_at` 不等于 truth cursor | cursor / version 来源后移 Step 7 / 11 / 13,不得由对象私自推导 |

#### 7.7.4 `IdentityAnchorState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.A` |
| 所属业务组成部分 | 身份锚定与成员真相 |
| 归属 crate / module | `identity-domain::member`;公开 variant 名称需在 Step 8 public schema 中复核 |
| 承接 capability | 防止 ref 复用;保留退役 / 墓碑后的 anchor |
| 对象类别 | state value / enum wrapper |
| 主要责任 | 表达 `GlobalMemberRef` 是否已建立、是否处于不可复用持有状态,为 ref reuse guard 和 tombstone 语义提供本地状态主语 |
| 不承担什么 | 不表达平台可用性、暂停、恢复、退役审批、高风险治理 basis、runtime availability 或 ProjectMember 状态 |
| 后续 Step 承接 | Step 9 establish / terminal hold flow;Step 10 anchor state matrix;Step 11 persisted state column |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 建立 anchor | `state_kind: IdentityAnchorStateKind`, `changed_at: IdentityTimestamp` | `IdentityAnchorState::established(changed_at)` | `is_reusable(&self) -> bool` | `Established` | `changed_at` 来自 establish command clock |
| 退役后持有 ref | `state_kind`, `reason_ref: Option<IdentityAnchorReasonRef>`, `changed_at` | `IdentityAnchorState::retired_held(reason_ref, changed_at)` | `is_reusable(&self) -> bool` | `RetiredHeld` | `reason_ref` 来自 lifecycle terminal reason / basis marker;clock 来源 Step 7 |
| 墓碑持有 ref | `state_kind`, `reason_ref`, `changed_at` | `IdentityAnchorState::tombstone_held(reason_ref, changed_at)` | `is_tombstone_held(&self) -> bool` | `TombstoneHeld` | `reason_ref` 来自 tombstone command / lifecycle terminal reason;clock 来源 Step 7 |

```rust
/// 身份引用锚定状态;所有当前变体都表示 `GlobalMemberRef` 不可复用。
pub struct IdentityAnchorState {
    /// 锚定状态类别:已建立、退役持有或墓碑持有。
    pub state_kind: IdentityAnchorStateKind,

    /// 进入不可复用持有状态时的原因引用;初始建立可为空。
    pub reason_ref: Option<IdentityAnchorReasonRef>,

    /// 锚定状态最近变化时间。
    pub changed_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_kind` | `IdentityAnchorStateKind` | 当前锚定状态类别 | 只允许 `Established`、`RetiredHeld`、`TombstoneHeld`;不定义 `Released` / `Reusable` |
| `reason_ref` | `Option<IdentityAnchorReasonRef>` | 持有状态的安全原因 marker | `Established` 可为空;`RetiredHeld` / `TombstoneHeld` 必须由后续 Step 10 明确是否必填;不得保存治理正文 |
| `changed_at` | `IdentityTimestamp` | 状态变化时间 | 来自 clock port;不等于 version / cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn established(changed_at: IdentityTimestamp) -> Self` | 创建已建立状态 | `changed_at` 来自 establish command clock | `IdentityAnchorState` | `reason_ref` 为 `None`;不可复用 |
| `pub fn retired_held(reason_ref: IdentityAnchorReasonRef, changed_at: IdentityTimestamp) -> Self` | 创建退役后 ref 持有状态 | `reason_ref` 为终态原因 marker;`changed_at` 来自 clock | `IdentityAnchorState` | 不释放 ref |
| `pub fn tombstone_held(reason_ref: IdentityAnchorReasonRef, changed_at: IdentityTimestamp) -> Self` | 创建墓碑持有状态 | `reason_ref` 为 tombstone 原因 marker;`changed_at` 来自 clock | `IdentityAnchorState` | 不释放 ref |
| `pub fn is_reusable(&self) -> bool` | 判断 ref 是否可复用 | 无 | `bool` | 当前所有正式 variant 必须返回 `false` |
| `pub fn is_tombstone_held(&self) -> bool` | 判断是否墓碑持有 | 无 | `bool` | 不改变状态 |

```rust
/// 身份引用锚定状态类别。
pub enum IdentityAnchorStateKind {
    /// 成员身份引用已建立,可被 identity 其它 truth 引用,但并不表示 runtime 可用。
    Established,

    /// 成员身份引用因退役被永久持有,不得分配给新的成员主语。
    RetiredHeld,

    /// 成员身份引用因墓碑化被永久持有,用于阻止删除后复用。
    TombstoneHeld,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Established` | 成员身份引用已建立,可被 identity 其它 truth 引用,但并不表示 runtime 可用。 | 建档 accepted 后的初始 anchor 状态 | `EstablishGlobalMember` accepted | `RetiredHeld` / `TombstoneHeld`;具体触发由 6.B / Step 10 闭口 |
| `RetiredHeld` | 成员身份引用因退役被永久持有,不得分配给新的成员主语。 | 退役后继续占用 ref | lifecycle terminal command accepted | 不回到 `Established`;是否可到 `TombstoneHeld` 由 Step 10 终态矩阵确认 |
| `TombstoneHeld` | 成员身份引用因墓碑化被永久持有,用于阻止删除后复用。 | 删除 / 墓碑后的 ref hold | tombstone command / terminal lifecycle accepted | 终态;不得回到 `Established` 或 `RetiredHeld` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不定义 `Reusable` / `Released` | ref 释放会违反 `BR-ID-001` 和 `VETO-ID-001` |
| 不替代 `GlobalLifecycleState` | 生命周期完整状态和高风险 basis 留给 6.B |
| `is_reusable()` 当前必须恒为 false | 这是显式不复用规则,不是实现便利函数 |
| 不保存外部 account / runtime / ProjectMember 状态 | 这些状态不属于 identity anchor |

#### 7.7.5 `IdentityAnchorPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.A` |
| 所属业务组成部分 | 身份锚定与成员真相 |
| 归属 crate / module | `identity-domain::member_policy` |
| 承接 capability | 建档 guard;防止 ref 复用;查询不建档;身份边界排除 |
| 对象类别 | policy / guard |
| 主要责任 | 在创建和读取边界上校验身份锚定不变量:只能由受控写入意图创建,查询不得建档,已持有 ref 不得复用,外部账号 / ProjectMember / runtime identity 不得被误当成员 truth |
| 不承担什么 | 不读取 repository、不生成 id、不调用 resolver、不取 clock、不写 trace / audit / outbox、不决定 lifecycle 高风险 basis |
| 后续 Step 承接 | Step 7 repository / resolver 输入准备;Step 8 create/read DTO guard;Step 9 rejected branch;Step 10 illegal transition / forbidden owner |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 建档 guard | `candidate_member_ref`, `source_ref`, `actor_ref`, `operation_channel` | `IdentityAnchorPolicy::for_create(...)` | `assert_can_establish(&self) -> Result<(), IdentityDomainError>` | 不适用 | `candidate_member_ref` 来自 id/request;`source_ref` 来自 request;`actor_ref` / channel 来自 command context |
| ref reuse guard | `existing_anchor_state: Option<IdentityAnchorState>` | `for_create(...)` | `assert_ref_not_reused(&self) -> Result<(), IdentityDomainError>` | 读取 `Established` / `RetiredHeld` / `TombstoneHeld` | loaded truth / repository read result;读取面后移 Step 7 |
| query no-create guard | `operation_channel` | `IdentityAnchorPolicy::for_read(channel)` | `assert_query_does_not_create(&self) -> Result<(), IdentityDomainError>` | 不适用 | channel 来自 API / query / job / worker entry context |
| 身份边界排除 | `source_ref`, `operation_channel` | `for_create(...)` | `assert_not_external_account_truth(&self) -> Result<(), IdentityDomainError>` | 不适用 | `source_ref` 为 body-free marker;source 类型解析规则后移 Step 7 / 8 |

```rust
/// 身份锚定 guard;只消费已加载输入,不读取 repository、不生成 id、不调用外部 adapter。
pub struct IdentityAnchorPolicy {
    /// 待创建或校验的成员身份引用。
    pub candidate_member_ref: GlobalMemberRef,

    /// 创建成员身份主语的 body-free 来源引用。
    pub source_ref: Option<IdentitySourceRef>,

    /// 发起写入或读取意图的 actor。
    pub actor_ref: Option<ActorRef>,

    /// 已存在的锚定状态;存在时不得作为新成员复用。
    pub existing_anchor_state: Option<IdentityAnchorState>,

    /// 当前操作通道,用于阻止 query / projection / maintenance 隐式创建 truth。
    pub operation_channel: IdentityOperationChannel,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `candidate_member_ref` | `GlobalMemberRef` | 待创建或读取的成员 ref | 来自 request / route / id generator;policy 不负责生成 |
| `source_ref` | `Option<IdentitySourceRef>` | 创建来源 marker | create guard 必填;read guard 可为空;不得携带外部正文 |
| `actor_ref` | `Option<ActorRef>` | 操作者引用 | create guard 必填;read guard 可按 Step 8 / 12 query visibility 规则确认 |
| `existing_anchor_state` | `Option<IdentityAnchorState>` | 读取到的既有 anchor 状态 | 来自 Step 7 repository read;不存在不等于可创建,仍需 channel/source/actor 校验 |
| `operation_channel` | `IdentityOperationChannel` | 当前操作通道 | command create 才允许创建;query/projection/maintenance/job/read 不允许创建 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_create(member_ref: GlobalMemberRef, source_ref: IdentitySourceRef, actor_ref: ActorRef, existing_anchor_state: Option<IdentityAnchorState>, operation_channel: IdentityOperationChannel) -> Self` | 构造建档 guard | 入参均由 application 层准备;`existing_anchor_state` 来自 loaded truth | `IdentityAnchorPolicy` | 不读取 repository、不生成 id |
| `pub fn for_read(member_ref: GlobalMemberRef, operation_channel: IdentityOperationChannel) -> Self` | 构造读取边界 guard | `member_ref` 来自 query;`operation_channel` 标明读通道 | `IdentityAnchorPolicy` | 不创建 truth |
| `pub fn assert_can_establish(&self) -> Result<(), IdentityDomainError>` | 校验是否允许建立成员主语 | 使用对象内字段 | `Ok(())` 或 domain rejection | 必须同时调用或覆盖 ref reuse、source、actor、channel 校验 |
| `pub fn assert_ref_not_reused(&self) -> Result<(), IdentityDomainError>` | 阻止已建立 / 持有 ref 复用 | 使用 `existing_anchor_state` | `Ok(())` 或 domain rejection | 对任何 existing state 均拒绝作为新成员创建 |
| `pub fn assert_query_does_not_create(&self) -> Result<(), IdentityDomainError>` | 阻止 query / projection / maintenance / job 创建成员 | 使用 `operation_channel` | `Ok(())` 或 domain rejection | read channel 只能读取或返回 not_found surface |
| `pub fn assert_not_external_account_truth(&self) -> Result<(), IdentityDomainError>` | 阻止把账号、credential、runtime identity 或 ProjectMember 当作成员 truth | 使用 `source_ref` marker;具体 source kind 解析由 Step 7 / 8 闭口 | `Ok(())` 或 domain rejection | 不保存 source body;不调用 external adapter |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| policy 只消费已加载状态和输入 | repository read、resolver、id generator、clock 都在 application / port 层,后移 Step 7 |
| `existing_anchor_state.is_some()` 时不得创建新成员 | 已建立、退役持有、墓碑持有均占用 ref |
| read / query channel 不得升级为 create | `GetGlobalMemberAnchor` 查不到成员只能走 not_found / no-create surface |
| account / credential / session / runtime / ProjectMember 不是 `GlobalMember` | 可作为来源 marker 或相邻仓引用,不得成为 identity-owned truth |

#### 7.7.6 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MemberAnchorView` | 后移并入 `MemberSummaryView` / anchor read surface | 它是读取 surface,不是本批 truth / state / policy;若提前定义会越到 query view DTO | 6.F query view;Step 8 query result schema |
| `IdentityTraceRecord` | 后移到身份事实消费与追溯 | 建档和 anchor hold 需要 trace,但 trace 是跨对象 accepted material,不属于本批核心 truth | 6.F trace / audit;Step 9 accepted side effect |
| `GlobalLifecycleState` | 后移到 6.B | lifecycle 表达平台可用性与高风险处置,不同于 anchor ref hold | 6.B |
| account / credential / session / runtime identity | 排除 | 归认证 / gateway / runtime,不是 identity-owned member truth | Step 7/8 只允许 body-free source marker |
| `ProjectMember` / work participation truth | 排除 | 项目内承担事实归 `L1-work` | 6.D 只保存 `ProjectParticipationRef` / `WorkSourceRef` marker |

#### 7.7.7 6.A 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.7.1 明确建档、防复用、anchor hold、query no-create、身份边界排除 |
| 是否有功能到对象映射 | 通过 | §7.7.2 将 5 个 capability 映射到 3 个对象 |
| 对象是否能回指 `02` / Step 5 | 通过 | `GlobalMember`、`IdentityAnchorState`、`IdentityAnchorPolicy` 均来自“身份锚定与成员真相” |
| 字段来源是否闭合到当前 Step 粒度 | 通过 | request / metadata / id generator / clock / loaded truth 均已标注;具体 port 留给 Step 7 |
| 状态是否闭合 | 通过 | `IdentityAnchorStateKind` 三个 variant 已定义;未定义 reusable / released |
| 是否越过 Step 7~10 | 通过 | 未定义 repository trait、DTO schema、transaction order、完整 state matrix 或 DDL |
| 是否提前展开其它业务批次 | 通过 | lifecycle、view、trace、work、memory、outbox 均明确后移 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |

#### 7.7.8 6.A 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| 建档对象 | `GlobalMember::establish(member_ref, source_ref, actor_ref, created_at)` 只建立 member truth 和 `Established` anchor | 建档时顺手写 lifecycle 全矩阵、trace outbox payload 和 query view |
| ref reuse | `IdentityAnchorPolicy` 看到任何 existing `IdentityAnchorState` 都拒绝创建 | 只在 `TombstoneHeld` 拒绝,但允许 `RetiredHeld` ref 分配给新成员 |
| query no-create | `GetGlobalMemberAnchor` 查不到成员返回 not_found surface,不创建 `GlobalMember` | 查询发现没有记录就调用 `establish(...)` 自动补档 |
| 身份边界 | `IdentitySourceRef` 是 body-free 来源 marker,账号 / credential / ProjectMember 只能作为外部来源线索 | `GlobalMember` 保存 account credential、session payload 或 ProjectMember 状态 |
| lifecycle 分离 | `IdentityAnchorState::TombstoneHeld` 只表达 ref hold,平台可用性状态留给 6.B | 用 `IdentityAnchorState` 直接表达 `Paused`、`Available` 或治理审批结果 |

### 7.8 6.B 全局生命周期

本批只处理“全局生命周期”对象契约,目标是让成员平台级可用性状态、显式生命周期迁移、高风险处置 basis guard 具备可落码对象主语。`GlobalLifecycleState` 表达 identity-owned 生命周期 truth state;`IdentityAnchorState` 仍只负责 ref hold;runtime health、ProjectMember 状态、work 事实和 governance 裁决 truth 不进入本批对象。

#### 7.8.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立初始生命周期 | 已建立 `GlobalMemberRef`, `ActorRef`, `LifecycleReasonRef`, `IdentityTimestamp` | `GlobalLifecycleState::Available` | 建档 accepted 后的初始 lifecycle;`GlobalMemberRef` 作为 repository row key 显式传入 save,不进入 lifecycle state value;不改变 anchor ref | `GlobalLifecycleState` | Step 7 lifecycle repository / clock;Step 8 establish result;Step 9 create flow;Step 10 lifecycle state |
| 显式生命周期迁移 | 当前 `GlobalLifecycleState`, 目标 `GlobalLifecycleStateKind`, `LifecycleReasonRef`, `ActorRef`, `IdentityOperationChannel`, `IdentityTimestamp` | 新 `GlobalLifecycleState` 或 domain rejection | 只允许 command write;非法迁移 rejected;query / job 不写 truth | `GlobalLifecycleState`, `LifecycleTransitionPolicy` | Step 8 `UpdateGlobalLifecycleState`;Step 9 transition flow;Step 10 transition matrix |
| 高风险处置 basis guard | 目标 lifecycle action, `LifecycleRiskRef`, `Option<GovernanceBasisRef>`, `ActorRef` | `Ok(())` 或 domain rejection / pending basis surface | 缺 basis 不得 accepted;identity 只保存 body-free basis ref | `HighRiskLifecycleGuard`, `GlobalLifecycleState` | Step 7 basis resolver;Step 8 high-risk request/result;Step 10 missing basis;Step 12 rejected/pending |
| lifecycle / anchor 分离 | `GlobalLifecycleStateKind`, `IdentityAnchorState` | 明确的 truth state 边界 | `Retired` / `Tombstoned` 不释放 `GlobalMemberRef`;anchor hold 由 6.A 对象承接 | `GlobalLifecycleState`, `IdentityAnchorState` | Step 9 lifecycle terminal flow;Step 10 anchor/lifecycle cross-check |
| 排除 runtime / ProjectMember / governance truth | lifecycle request、source/basis refs、operation channel | domain rejection 或 body-free marker | runtime、任务、ProjectMember、governance Gate/Approval/Policy/Control 不成为 identity lifecycle truth | `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | Step 7 external basis resolver;Step 12 wrong-owner / forbidden-body error |

#### 7.8.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `GlobalLifecycleState` | 建立初始生命周期;显式生命周期迁移;lifecycle / anchor 分离 | state value / truth state | 保存 lifecycle state kind、reason、actor、changed time、optional basis;提供可用性、终态和迁移构造入口 | 不携带 `member_ref`;不表达 anchor ref reuse、不保存 runtime / ProjectMember / governance truth、不写 trace / outbox / projection |
| `LifecycleTransitionPolicy` | 显式生命周期迁移;排除 runtime / ProjectMember 状态 | policy / guard | 校验 command-only、actor、reason、合法迁移和 wrong-owner 状态 | 不解析 governance basis body、不读取 repository、不调用 runtime、不决定 high-risk basis 有效性 |
| `HighRiskLifecycleGuard` | 高风险处置 basis guard;排除 governance truth ownership | policy / guard | 判断目标 action 是否高风险、是否需要 basis、basis 与 action 风险是否匹配 | 不保存 governance Gate / Approval / Policy / Control truth;不替代 governance 裁决 |

#### 7.8.3 `GlobalLifecycleState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.B` |
| 所属业务组成部分 | 全局生命周期 |
| 归属 crate / module | `identity-domain::lifecycle`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 建立初始生命周期;显式生命周期迁移;lifecycle / anchor 分离 |
| 对象类别 | state value / truth state |
| 主要责任 | 表达成员在平台范围内的全局可用性,让 command、query、consumer 和 downstream marker 能判断成员是否处于可用、暂停、退役或墓碑生命周期 |
| 不承担什么 | 不表达 runtime health、container status、task state、ProjectMember 状态、governance 裁决 truth 或 `GlobalMemberRef` 复用规则 |
| 后续 Step 承接 | Step 7 lifecycle repository / basis resolver;Step 8 lifecycle command/query schema;Step 9 transition flow;Step 10 lifecycle matrix;Step 11 persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 初始可用状态 | `state_kind`, `reason_ref`, `changed_by_ref`, `changed_at` | `GlobalLifecycleState::initial_available(actor_ref, reason_ref, changed_at)` | `is_available(&self) -> bool` | `Available` | `actor_ref` / `reason_ref` 来自 establish command context;`changed_at` 来自 clock |
| 普通迁移 | `state_kind`, `reason_ref`, `changed_by_ref`, `changed_at` | `GlobalLifecycleState::from_transition(current_state, target_state, reason_ref, actor_ref, changed_at, basis_ref)` | `can_transition_to(&self, target_state) -> bool`;`transition_to(...) -> Result<Self, IdentityDomainError>` | `Available` / `Paused` / `Retired` / `Tombstoned` | current state 来自 loaded truth;target/reason/actor 来自 command;clock 来自 Step 7 |
| 高风险迁移记录 | `basis_ref: Option<GovernanceBasisRef>` | `from_transition(...)` | `basis_ref(&self) -> Option<GovernanceBasisRef>` | `Retired` / `Tombstoned` 等高风险候选由 Step 10 确认 | `basis_ref` 来自 request / basis resolver summary;只保存 body-free ref |
| 终态判断 | `state_kind` | 不适用 | `is_terminal(&self) -> bool` | `Retired` / `Tombstoned` | loaded truth |

```rust
/// 成员平台级生命周期状态;表达全局可用性,不表达 runtime 或 ProjectMember 状态。
pub struct GlobalLifecycleState {
    /// 生命周期状态类别。
    pub state_kind: GlobalLifecycleStateKind,

    /// 最近一次生命周期变化原因引用。
    pub reason_ref: LifecycleReasonRef,

    /// 最近一次生命周期变化操作者。
    pub changed_by_ref: ActorRef,

    /// 最近一次生命周期变化时间。
    pub changed_at: IdentityTimestamp,

    /// 高风险生命周期变化的 body-free 授权 / 治理依据引用。
    pub basis_ref: Option<GovernanceBasisRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_kind` | `GlobalLifecycleStateKind` | 成员平台级生命周期状态 | 只允许 identity-owned lifecycle variant;不得承载 runtime / ProjectMember 状态 |
| `reason_ref` | `LifecycleReasonRef` | 生命周期变化原因 marker | 必填;来自 command request / accepted basis summary;不得保存原因正文 |
| `changed_by_ref` | `ActorRef` | 最近一次显式变化 actor | 必填;来自 command metadata;job / query 不得伪造业务 actor |
| `changed_at` | `IdentityTimestamp` | 最近一次变化时间 | 来自 clock port;不得用作 truth cursor / version |
| `basis_ref` | `Option<GovernanceBasisRef>` | 高风险变化的 body-free basis 引用 | 非高风险可为空;高风险必填规则由 `HighRiskLifecycleGuard` / Step 10 闭口;不得保存 governance body |

`GlobalLifecycleState` deliberately does not carry `GlobalMemberRef`. The lifecycle row owner is the explicit `member_ref` argument on `GlobalLifecycleRepository.save_lifecycle(...)`; application services must pass the same `member_ref` used for `get_lifecycle_with_version(member_ref)`. Implementations must not infer the lifecycle row key from reason refs, basis refs, actor refs, source strings, or lifecycle state contents.

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn initial_available(actor_ref: ActorRef, reason_ref: LifecycleReasonRef, changed_at: IdentityTimestamp) -> Self` | 创建建档后的初始 lifecycle state | actor/reason 来自 establish command;time 来自 clock | `GlobalLifecycleState` | `state_kind` 为 `Available`;`basis_ref` 为 `None`;不创建 `GlobalMember` |
| `pub fn from_transition(current_state: &GlobalLifecycleState, target_state: GlobalLifecycleStateKind, reason_ref: LifecycleReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp, basis_ref: Option<GovernanceBasisRef>) -> Result<Self, IdentityDomainError>` | 从当前 lifecycle 生成目标 lifecycle | current 来自 loaded truth;target/reason/actor/basis 来自 request / resolver;time 来自 clock | 新 `GlobalLifecycleState` 或 domain rejection | 只生成新状态值;合法性由 policy / guard 先校验 |
| `pub fn can_transition_to(&self, target_state: GlobalLifecycleStateKind) -> bool` | 判断目标状态是否可能成为合法迁移候选 | target 来自 command | `bool` | 只做本地候选判断;完整矩阵 Step 10 闭口 |
| `pub fn transition_to(&self, target_state: GlobalLifecycleStateKind, reason_ref: LifecycleReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp, basis_ref: Option<GovernanceBasisRef>) -> Result<Self, IdentityDomainError>` | 在已校验输入下生成目标状态 | 同上 | 新 `GlobalLifecycleState` 或 domain rejection | 不写 repository、不发 event、不释放 member ref |
| `pub fn is_available(&self) -> bool` | 判断是否平台可用 | 无 | `bool` | 不读取 runtime |
| `pub fn is_terminal(&self) -> bool` | 判断是否终态候选 | 无 | `bool` | `Retired` / `Tombstoned` 为终态候选;最终矩阵 Step 10 确认 |
| `pub fn basis_ref(&self) -> Option<GovernanceBasisRef>` | 返回高风险 basis marker | 无 | optional basis ref | 不解析 governance body |

```rust
/// 成员平台级生命周期状态类别。
pub enum GlobalLifecycleStateKind {
    /// 成员在平台范围内可被选择、调用或展示;不代表 runtime 实例正在运行。
    Available,

    /// 成员被显式暂停,暂不可用,可按正式流程恢复或继续处置。
    Paused,

    /// 成员已退役,通常不再作为可用成员被选择;成员引用仍不得复用。
    Retired,

    /// 成员进入墓碑化生命周期状态;成员引用由 anchor state 永久持有。
    Tombstoned,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Available` | 成员在平台范围内可被选择、调用或展示;不代表 runtime 实例正在运行。 | 建档后的初始可用状态或从暂停恢复 | `EstablishGlobalMember` accepted;恢复 command accepted | `Paused` / `Retired` / `Tombstoned`;具体矩阵 Step 10 闭口 |
| `Paused` | 成员被显式暂停,暂不可用,可按正式流程恢复或继续处置。 | 临时不可用 | lifecycle command accepted | `Available` / `Retired` / `Tombstoned`;具体矩阵 Step 10 闭口 |
| `Retired` | 成员已退役,通常不再作为可用成员被选择;成员引用仍不得复用。 | 退役终态候选 | lifecycle command accepted,必要时需 basis | 不回到普通主线;是否允许墓碑化后续 Step 10 闭口 |
| `Tombstoned` | 成员进入墓碑化生命周期状态;成员引用由 anchor state 永久持有。 | 墓碑终态 | high-risk lifecycle command accepted | 终态;不得回到 `Available` / `Paused` / `Retired` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 生命周期状态不释放 `GlobalMemberRef` | ref hold 由 6.A `IdentityAnchorState` 保护 |
| 不保存 runtime health / task state | runtime 可用性不是 identity lifecycle truth |
| 不保存 ProjectMember 状态 | 项目内承担事实归 `L1-work` |
| 不保存 governance truth body | 只允许 `GovernanceBasisRef` body-free marker |
| query / job 不得改变 lifecycle | lifecycle truth write 只来自显式 command / accepted consumer flow;本批固定 command-only 主线 |

#### 7.8.4 `LifecycleTransitionPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.B` |
| 所属业务组成部分 | 全局生命周期 |
| 归属 crate / module | `identity-domain::lifecycle_policy` |
| 承接 capability | 显式生命周期迁移;排除 runtime / ProjectMember 状态 |
| 对象类别 | policy / guard |
| 主要责任 | 校验生命周期变化必须来自显式写入意图、可信 actor、正式 reason,且迁移方向不违反全局生命周期边界 |
| 不承担什么 | 不解析 governance basis body、不读取 repository、不调用 runtime、不读取 ProjectMember 或任务状态、不写 trace / audit / outbox |
| 后续 Step 承接 | Step 8 lifecycle command flow;Step 9 transition flow;Step 10 illegal transition;Step 12 wrong-owner rejection |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 显式 command guard | `current_state`, `target_state`, `reason_ref`, `actor_ref`, `operation_channel` | `LifecycleTransitionPolicy::for_transition(...)` | `assert_explicit_command(&self) -> Result<(), IdentityDomainError>` | 不适用 | command metadata / request / loaded truth |
| 合法迁移 guard | `current_state`, `target_state` | `for_transition(...)` | `assert_allowed_transition(&self) -> Result<(), IdentityDomainError>` | `GlobalLifecycleStateKind` | current state 来自 loaded truth;target 来自 request |
| wrong-owner state 排除 | `target_state`, `operation_channel` | `for_transition(...)` | `assert_not_project_or_runtime_state(&self) -> Result<(), IdentityDomainError>` | 不适用 | request schema / operation channel |

```rust
/// 生命周期迁移 guard;校验显式 command、合法迁移和 owner boundary。
pub struct LifecycleTransitionPolicy {
    /// 当前生命周期状态。
    pub current_state: GlobalLifecycleState,

    /// 请求进入的目标生命周期状态。
    pub target_state: GlobalLifecycleStateKind,

    /// 生命周期变化原因引用。
    pub reason_ref: LifecycleReasonRef,

    /// 发起生命周期变化的 actor。
    pub actor_ref: ActorRef,

    /// 当前操作通道,用于拒绝 query / maintenance 静默写入。
    pub operation_channel: IdentityOperationChannel,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `current_state` | `GlobalLifecycleState` | 当前 lifecycle truth state | 来自 repository loaded truth;policy 不负责读取 |
| `target_state` | `GlobalLifecycleStateKind` | 请求目标状态 | 来自 command request;不能是 runtime / ProjectMember 状态 |
| `reason_ref` | `LifecycleReasonRef` | 变化原因 marker | 必填;body-free;不得用空 reason 通过显式写入约束 |
| `actor_ref` | `ActorRef` | 发起者 | 必填;来自 command metadata |
| `operation_channel` | `IdentityOperationChannel` | 操作通道 | 必须是允许 lifecycle write 的 command channel;query/job 不允许 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_transition(current_state: GlobalLifecycleState, target_state: GlobalLifecycleStateKind, reason_ref: LifecycleReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel) -> Self` | 构造普通 lifecycle 迁移 guard | current 来自 loaded truth;target/reason 来自 request;actor/channel 来自 command context | `LifecycleTransitionPolicy` | 不读取 repository、不调用外部系统 |
| `pub fn assert_explicit_command(&self) -> Result<(), IdentityDomainError>` | 校验生命周期变化来自显式 command | 使用 `actor_ref`、`reason_ref`、`operation_channel` | `Ok(())` 或 domain rejection | query / projection / maintenance / job 不得改 lifecycle truth |
| `pub fn assert_allowed_transition(&self) -> Result<(), IdentityDomainError>` | 校验迁移方向合法 | 使用 current/target | `Ok(())` 或 domain rejection | 完整允许矩阵在 Step 10 固化;本对象提供本地 guard 入口 |
| `pub fn assert_not_project_or_runtime_state(&self) -> Result<(), IdentityDomainError>` | 排除 runtime / ProjectMember 状态混入 | 使用 `target_state` 和 request schema | `Ok(())` 或 domain rejection | 不读取 runtime / work;只拒绝混层状态 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 生命周期变化必须显式 | 缺 actor、缺 reason、非 command channel 都不得 accepted |
| 不把 illegal transition 降级为 stale / degraded | lifecycle 是 truth write,非法迁移必须 rejected 或 pending basis,不得伪成功 |
| 不读取 runtime / ProjectMember 决定状态 | 这些系统可作为外部线索,不能拥有 identity lifecycle truth |
| 不处理 high-risk basis 解析 | basis 判定由 `HighRiskLifecycleGuard` 和 Step 7 resolver 承接 |

#### 7.8.5 `HighRiskLifecycleGuard`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.B` |
| 所属业务组成部分 | 全局生命周期 |
| 归属 crate / module | `identity-domain::lifecycle_policy` |
| 承接 capability | 高风险处置 basis guard;排除 governance truth ownership |
| 对象类别 | policy / guard |
| 主要责任 | 对高风险生命周期动作要求正式授权 / 治理依据引用,并保证 identity 只保存 basis ref 和校验结果,不拥有治理裁决 truth |
| 不承担什么 | 不定义 Governance Gate / Policy / Approval / Control schema,不保存治理正文,不替代 governance 裁决,不调用 governance adapter |
| 后续 Step 承接 | Step 7 basis resolver port;Step 8 high-risk lifecycle precheck;Step 10 missing / invalid / unavailable basis;Step 12 rejected / pending basis surface |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 判断是否需要 basis | `target_state`, `action_risk_ref` | `HighRiskLifecycleGuard::for_action(...)` | `requires_basis(&self) -> bool` | 不适用 | risk classification 来自 request / config-bound policy summary;具体来源 Step 7/14 闭口 |
| 缺 basis 拒绝 | `basis_ref: Option<GovernanceBasisRef>` | `for_action(...)` | `assert_basis_present(&self) -> Result<(), IdentityDomainError>` | 不适用 | request / basis resolver summary |
| basis 与动作匹配 | `basis_ref`, `action_risk_ref` | `for_action(...)` | `assert_basis_matches_action(&self) -> Result<(), IdentityDomainError>` | 不适用 | basis summary 由 Step 7 resolver 提供;本对象不解析 body |

```rust
/// 高风险生命周期处置 guard;只保存 body-free basis 引用和动作风险 marker。
pub struct HighRiskLifecycleGuard {
    /// 请求进入的生命周期目标状态。
    pub target_state: GlobalLifecycleStateKind,

    /// 生命周期动作风险分类引用。
    pub action_risk_ref: LifecycleRiskRef,

    /// 授权 / 治理依据 body-free 引用。
    pub basis_ref: Option<GovernanceBasisRef>,

    /// 发起高风险处置的 actor。
    pub actor_ref: ActorRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `target_state` | `GlobalLifecycleStateKind` | lifecycle action 目标 | 来自 command request;高风险集合由 Step 10 / 14 明确 |
| `action_risk_ref` | `LifecycleRiskRef` | 动作风险分类 marker | body-free;不得保存 policy body;来源由 Step 7/14 闭口 |
| `basis_ref` | `Option<GovernanceBasisRef>` | 授权 / 治理依据引用 | 高风险动作必须存在并可解析;本对象不保存 Gate/Approval/Policy body |
| `actor_ref` | `ActorRef` | 处置 actor | 来自 command metadata;用于错误和审计后续承接 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_action(target_state: GlobalLifecycleStateKind, action_risk_ref: LifecycleRiskRef, basis_ref: Option<GovernanceBasisRef>, actor_ref: ActorRef) -> Self` | 构造高风险 lifecycle guard | target/risk/basis 来自 command 或 resolver summary;actor 来自 metadata | `HighRiskLifecycleGuard` | 不调用 governance、不读取 repository |
| `pub fn requires_basis(&self) -> bool` | 判断目标动作是否需要 basis | 使用 `target_state` / `action_risk_ref` | `bool` | 只读本地 marker;高风险集合后续 Step 10/14 固化 |
| `pub fn assert_basis_present(&self) -> Result<(), IdentityDomainError>` | 高风险动作缺 basis 时拒绝 | 使用 `basis_ref` | `Ok(())` 或 domain rejection | 缺 basis 不得 accepted |
| `pub fn assert_basis_matches_action(&self) -> Result<(), IdentityDomainError>` | 校验 basis 与动作风险类别匹配 | 使用 `basis_ref` / `action_risk_ref`;basis summary 来源 Step 7 | `Ok(())` 或 domain rejection | 不解析 governance body;不把 unavailable 伪装为 valid |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 缺 basis 的高风险处置不得 accepted | 对应 `VETO-ID-004` |
| identity 只保存 `GovernanceBasisRef` | Gate、Approval、Policy、Control 等 truth 归 governance |
| basis unavailable / invalid 不得伪成功 | 后续 Step 12 必须明确 rejected / pending / dependency unavailable surface |
| 不由后台 job 补 basis 后静默推进 lifecycle | lifecycle 高风险处置必须走显式 command |

#### 7.8.6 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `LifecycleSummaryView` | 后移并入 `MemberSummaryView` / lifecycle query surface | 它是读取 surface,不是 lifecycle truth;提前定义会越到 query DTO / projection | 6.F `MemberSummaryView`;Step 8 query schema |
| `LifecycleTraceRecord` | 后移到身份事实消费与追溯 | lifecycle accepted change 需要 trace,但 trace 是跨组成部分追溯 material | 6.F `IdentityTraceRecord`;Step 9 accepted side effect |
| `GovernanceBasisRef` | 作为 boundary ref 使用 | governance 依据是外部 truth / authorization marker,不归 identity owned object | Step 7 basis resolver;Step 8 request/result;Step 12 basis error |
| runtime availability / container health / task state | 排除 | runtime 状态不是 identity lifecycle truth | 只可作为外部观察 marker,不得写 `GlobalLifecycleState` |
| `ProjectMember` / work assignment state | 排除 | 项目内承担事实归 `L1-work` | 6.D 只通过 work source marker 追加 career |
| Governance Gate / Approval / Policy / Control truth | 排除 | identity 只保存 `GovernanceBasisRef`,不复制治理对象 | Step 7 resolver 读取 basis summary |

#### 7.8.7 6.B 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.8.1 明确初始 lifecycle、显式迁移、高风险 basis、anchor 分离和 wrong-owner 排除 |
| 是否有功能到对象映射 | 通过 | §7.8.2 将 lifecycle truth、transition policy、high-risk guard 分开 |
| 对象是否能回指 `02` / Step 5 | 通过 | 三个对象均来自“全局生命周期”组成部分 |
| 字段来源是否闭合到当前 Step 粒度 | 通过 | request / metadata / loaded truth / clock / basis ref 来源已标注;resolver / repository 留给 Step 7 |
| 状态是否闭合 | 通过 | `GlobalLifecycleStateKind` 四个 variant 已定义;完整迁移矩阵留给 Step 10 |
| 是否越过 Step 7~10 | 通过 | 未定义 repository trait、basis resolver trait、DTO schema、transaction order、完整矩阵或 DDL |
| 是否与 6.A anchor 混层 | 通过 | lifecycle 不释放 `GlobalMemberRef`;anchor hold 仍由 `IdentityAnchorState` 承接 |
| 是否复制 governance truth | 通过 | 只使用 `GovernanceBasisRef` boundary ref,不定义 governance-owned schema |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |

#### 7.8.8 6.B 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| lifecycle truth | `GlobalLifecycleState` 只表达 `Available` / `Paused` / `Retired` / `Tombstoned` | 把 runtime container status 或 ProjectMember assignment status 写进 lifecycle enum |
| 显式迁移 | `LifecycleTransitionPolicy` 要求 command channel、actor 和 reason | maintenance job 发现异常后直接把成员改成 `Paused` |
| 高风险 basis | `HighRiskLifecycleGuard` 对高风险 `Tombstoned` 要求 `GovernanceBasisRef` | 缺 basis 时先 accepted lifecycle,后续再补治理记录 |
| governance 边界 | identity 保存 body-free `GovernanceBasisRef`,由 Step 7 resolver 判断 valid / unavailable | 在 identity lifecycle state 里保存 Gate / Approval / Policy / Control body |
| anchor 分离 | `Retired` / `Tombstoned` lifecycle 不释放 `GlobalMemberRef`,anchor hold 由 6.A 状态保护 | lifecycle 进入 `Tombstoned` 后删除 member ref 并允许新成员复用 |

### 7.9 6.C 角色能力摘要

本批只处理“角色能力摘要”对象契约,目标是让 identity-side role / capability summary、method-library 来源 snapshot、来源 / 证据 / forbidden body guard 具备可落码对象主语。本批不拥有 `RoleDefinition`、`CapabilityDefinition`、method body、ProjectMember role assignment、自动能力评估算法或绩效推断。

#### 7.9.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 维护成员角色 / 能力摘要 | `GlobalMemberRef`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySafeSummaryRef`, `List<CapabilityEvidenceRef>`, `ActorRef`, `IdentityTimestamp` | `RoleCapabilitySummary` | `summary_state` 进入 `Active` 或受 source state 影响进入 stale/unavailable/pending | `RoleCapabilitySummary`, `RoleCapabilitySourcePolicy` | Step 7 source/evidence resolver;Step 8 `MaintainRoleCapabilitySummary`;Step 9 summary flow;Step 10 summary state |
| 绑定 body-free role / capability 来源 | `RoleCapabilitySourceRef`, `RoleCapabilitySourceVersionRef`, `RoleCapabilitySafeSummaryRef`, evidence refs, resolved time | `RoleCapabilitySourceSnapshot` | `source_state` 进入 `SourceResolved` 或异常 marker | `RoleCapabilitySourceSnapshot` | Step 7 method source resolver;Step 8 source changed consumer;Step 10 source state |
| 响应来源变化 / 失效 | current summary, new source snapshot, changed time | 更新后的 summary state 或 source snapshot | `Stale` / `Unavailable` / `PendingReconciliation`;不得静默保持 active | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | Step 9 source changed flow;Step 12 degraded / rejected source |
| 要求来源 / 证据闭合 | source snapshot, evidence refs, operation channel | `Ok(())` 或 domain rejection | 无来源 / 无证据不能 accepted | `RoleCapabilitySourcePolicy` | Step 8 DTO precheck;Step 10 missing source / missing evidence |
| 禁止 definition body / method body / 自动评估正文 | change material marker, source snapshot, operation channel | `Ok(())` 或 domain rejection | forbidden body blocked before persistence / event material | `RoleCapabilitySourcePolicy` | Step 8 public schema;Step 12 forbidden body;Step 16 negative tests |

#### 7.9.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `RoleCapabilitySummary` | 维护成员角色 / 能力摘要;响应来源变化 / 失效 | truth / snapshot | 保存成员摘要 ref、member ref、body-free source refs、evidence refs、safe summary marker、source snapshot ref、summary state、actor 和 changed time | 不保存 RoleDefinition / CapabilityDefinition body、method body、自动评估算法正文、ProjectMember role assignment |
| `RoleCapabilitySourceSnapshot` | 绑定 body-free role / capability 来源;响应来源变化 / 失效 | reference / snapshot | 保存 source ref、version ref、source state、safe summary marker、evidence refs 和 resolved time;提供 source 匹配与 usable 判断 | 不成为 method-library truth;不保存 source body / evidence body |
| `RoleCapabilitySourcePolicy` | 要求来源 / 证据闭合;禁止 forbidden body;防止 stale/unavailable 静默 accepted | policy / guard | 校验 member、source/evidence、source usability、forbidden body 和 automatic scoring 排除 | 不读取 source adapter、不执行评估算法、不修复 method-library source、不写 trace/outbox |

#### 7.9.3 `RoleCapabilitySummary`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.C` |
| 所属业务组成部分 | 角色能力摘要 |
| 归属 crate / module | `identity-domain::role_capability`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 维护成员角色 / 能力摘要;响应来源变化 / 失效 |
| 对象类别 | truth / snapshot |
| 主要责任 | 承载成员身份侧可解释 role / capability 摘要、来源引用、证据引用和 summary state,用于成员解释、筛选和后续消费追溯 |
| 不承担什么 | 不保存 RoleDefinition / CapabilityDefinition body、method body、ProjectMember role assignment、自动评估算法正文、绩效推断或 evidence body |
| 后续 Step 承接 | Step 7 role capability repository / source resolver;Step 8 maintain summary command / source event;Step 9 summary flow;Step 10 summary state;Step 11 persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 创建成员摘要 | `summary_ref`, `member_ref`, `source_snapshot_ref`, `safe_summary_ref`, `evidence_refs`, `summary_state`, `changed_by_ref`, `changed_at` | `RoleCapabilitySummary::create_for_member(...)` | `belongs_to(&self, member_ref) -> bool` | `RoleCapabilitySummaryStateKind::Active` | summary id 来自 Step 7 id generator;member 来自 loaded `GlobalMember`;snapshot/evidence/safe summary 来自 resolver / request;time 来自 clock |
| 绑定 role source | `role_source_ref`, `source_snapshot_ref`, `summary_state` | 不适用;在已加载 summary 上调用 | `attach_role_source(...) -> Result<(), IdentityDomainError>` | `Active` / `Stale` | `RoleSourceRef` / snapshot 来自 source resolver |
| 更新能力摘要 | `capability_source_refs`, `evidence_refs`, `safe_summary_ref`, `changed_by_ref`, `changed_at` | 不适用 | `update_capability_summary(...) -> Result<(), IdentityDomainError>` | `Active` | source refs / evidence refs / safe summary 来自 request 或 resolved source summary |
| 标记来源失效 | `summary_state`, `source_snapshot_ref`, `changed_at` | `RoleCapabilitySummary::from_source_change(...)` | `mark_stale(...)`;`mark_unavailable(...)`;`requires_reconciliation()` | `Stale` / `Unavailable` / `PendingReconciliation` | source changed event / source resolver result |

```rust
/// 成员身份侧角色能力摘要;只保存 body-free source refs、evidence refs 和 safe summary marker。
pub struct RoleCapabilitySummary {
    /// 角色能力摘要身份。
    pub summary_ref: RoleCapabilitySummaryRef,

    /// 摘要所属成员。
    pub member_ref: GlobalMemberRef,

    /// 角色定义来源引用;不得承载 RoleDefinition body。
    pub role_source_ref: Option<RoleSourceRef>,

    /// 能力来源引用集合;不得承载 CapabilityDefinition body。
    pub capability_source_refs: Vec<CapabilitySourceRef>,

    /// 能力声明的证据引用集合;不得承载 evidence body。
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// 对外可见安全摘要 marker。
    pub safe_summary_ref: RoleCapabilitySafeSummaryRef,

    /// 当前摘要所依据的来源 snapshot。
    pub source_snapshot_ref: RoleCapabilitySourceSnapshotRef,

    /// 摘要当前状态。
    pub summary_state: RoleCapabilitySummaryStateKind,

    /// 最近一次维护摘要的 actor 或受控来源 actor。
    pub changed_by_ref: ActorRef,

    /// 最近一次摘要变化时间。
    pub changed_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `summary_ref` | `RoleCapabilitySummaryRef` | 摘要 identity | 来自 Step 7 id generator;不得由 source ref 字符串临时拼接 |
| `member_ref` | `GlobalMemberRef` | 摘要所属成员 | 必须依附已建立成员;member read 接缝后移 Step 7 |
| `role_source_ref` | `Option<RoleSourceRef>` | role 来源引用 | body-free;可为空表示只有 capability summary;不得保存 RoleDefinition body |
| `capability_source_refs` | `Vec<CapabilitySourceRef>` | capability 来源引用集合 | body-free;不得保存 CapabilityDefinition body;空集合是否允许由 policy / Step 10 确认 |
| `evidence_refs` | `Vec<CapabilityEvidenceRef>` | 能力声明证据引用 | body-free;不得保存 evidence body;policy 要求需要证据的声明不能为空 |
| `safe_summary_ref` | `RoleCapabilitySafeSummaryRef` | 可见安全摘要 marker | 来自 resolver / request;具体最小字段 Step 8 闭口 |
| `source_snapshot_ref` | `RoleCapabilitySourceSnapshotRef` | 当前来源 snapshot 引用 | 来自 `RoleCapabilitySourceSnapshot`;不得用 source version 代替 snapshot ref |
| `summary_state` | `RoleCapabilitySummaryStateKind` | 摘要状态 | 只允许 Step 6 定义 variant;状态矩阵 Step 10 闭口 |
| `changed_by_ref` | `ActorRef` | 维护 actor / 来源 actor | 来自 command metadata / source event context |
| `changed_at` | `IdentityTimestamp` | 摘要变化时间 | 来自 clock port;不得作为 truth cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn create_for_member(summary_ref: RoleCapabilitySummaryRef, member_ref: GlobalMemberRef, source_snapshot: &RoleCapabilitySourceSnapshot, safe_summary_ref: RoleCapabilitySafeSummaryRef, evidence_refs: Vec<CapabilityEvidenceRef>, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建成员角色能力摘要 | summary id 来自 id generator;member 来自 loaded member;source snapshot 来自 resolver;safe summary/evidence 来自 request/resolver | 新 `RoleCapabilitySummary` | 不保存 source body;source snapshot 必须 usable;初始 state 通常为 `Active` |
| `pub fn belongs_to(&self, member_ref: GlobalMemberRef) -> bool` | 判断摘要是否属于指定成员 | member ref 来自 request / loaded truth | `bool` | 只比较 typed ref |
| `pub fn attach_role_source(&mut self, role_source_ref: RoleSourceRef, source_snapshot: &RoleCapabilitySourceSnapshot, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 绑定或更新 role 来源 | source ref / snapshot 来自 resolver;actor/time 来自 context | `Ok(())` 或 domain rejection | 不保存 RoleDefinition body;更新 snapshot ref 和 changed metadata |
| `pub fn update_capability_summary(&mut self, capability_source_refs: Vec<CapabilitySourceRef>, evidence_refs: Vec<CapabilityEvidenceRef>, safe_summary_ref: RoleCapabilitySafeSummaryRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 更新能力摘要 marker 与证据 refs | body-free source/evidence refs 和 safe summary marker | `Ok(())` 或 domain rejection | 不执行能力评估算法;不保存 evidence body |
| `pub fn mark_stale(&mut self, source_snapshot: &RoleCapabilitySourceSnapshot, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 来源变化后标记摘要 stale | snapshot 来自 source changed flow | `Ok(())` 或 domain rejection | 不静默保持 active |
| `pub fn mark_unavailable(&mut self, source_ref: RoleCapabilitySourceRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 来源不可用时标记摘要 unavailable | source ref 来自 resolver / event | `Ok(())` 或 domain rejection | 不用旧 snapshot 伪装当前可用 |
| `pub fn requires_reconciliation(&self) -> bool` | 判断摘要是否需要对账或刷新 | 无 | `bool` | `Stale` / `Unavailable` / `PendingReconciliation` 可返回 true |

```rust
/// 角色能力摘要状态。
pub enum RoleCapabilitySummaryStateKind {
    /// 摘要有有效来源和证据,可用于受控读取和筛选。
    Active,

    /// 来源版本变化或摘要需要刷新,不得静默当作最新事实。
    Stale,

    /// 来源不可用或无法解析,读取可降级,写入需按 policy 拒绝或挂起。
    Unavailable,

    /// 摘要与来源存在待对账差异,修复必须通过正式能力或来源边界。
    PendingReconciliation,

    /// 摘要已被更新版本替代,不得作为当前摘要使用。
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | 摘要有有效来源和证据,可用于受控读取和筛选。 | 当前可用摘要 | maintain summary accepted;resolved source accepted | `Stale` / `Unavailable` / `PendingReconciliation` / `Superseded` |
| `Stale` | 来源版本变化或摘要需要刷新,不得静默当作最新事实。 | 来源发生变化后的显式 stale marker | source changed consumer;reference refresh job marker | `Active` / `Unavailable` / `PendingReconciliation` / `Superseded` |
| `Unavailable` | 来源不可用或无法解析,读取可降级,写入需按 policy 拒绝或挂起。 | 来源不可用 marker | resolver unavailable;source event unavailable | `Active` / `PendingReconciliation` / `Superseded` |
| `PendingReconciliation` | 摘要与来源存在待对账差异,修复必须通过正式能力或来源边界。 | 需要对账 | reconciliation report / source drift detection | `Active` / `Unavailable` / `Superseded` |
| `Superseded` | 摘要已被更新版本替代,不得作为当前摘要使用。 | 旧摘要 marker | accepted replacement | 不回到当前主线 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 RoleDefinition / CapabilityDefinition body | 定义正文归 method-library |
| 不保存 method body / 自动评估算法正文 | identity 只保存 safe summary marker、source refs 和 evidence refs |
| 不允许无 source / evidence 的能力声明 accepted | policy 必须阻止 missing source/evidence |
| 不从 ProjectMember role assignment 生成本地 role truth | 项目内角色事实归 work |
| stale / unavailable 不得伪装为 active | query 可降级,command / consumer 必须显式处理 |

#### 7.9.4 `RoleCapabilitySourceSnapshot`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.C` |
| 所属业务组成部分 | 角色能力摘要 |
| 归属 crate / module | `identity-domain::role_capability` |
| 承接 capability | 绑定 body-free role / capability 来源;响应来源变化 / 失效 |
| 对象类别 | reference / snapshot |
| 主要责任 | 表达 method-library role / capability 来源的 body-free snapshot、version marker、解析状态、safe summary marker 和 evidence refs |
| 不承担什么 | 不保存 RoleDefinition / CapabilityDefinition body、不承担 method-library truth、不执行能力评估算法、不保存 evidence body |
| 后续 Step 承接 | Step 7 method source resolver / evidence resolver;Step 8 source changed protocol;Step 9 source flow;Step 10 source state;Step 11 snapshot persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| resolved snapshot | `snapshot_ref`, `source_ref`, `source_version_ref`, `source_state`, `safe_summary_ref`, `evidence_refs`, `resolved_at` | `RoleCapabilitySourceSnapshot::from_resolved_source(...)` | `is_usable_for_summary(&self) -> bool`;`has_required_evidence(&self) -> bool` | `SourceResolved` | source resolver output;id generator;clock |
| stale snapshot | `source_version_ref`, `source_state`, `resolved_at` | `mark_stale(...)` | `matches_source(&self, source_ref) -> bool` | `SourceStale` | source changed event / resolver detected newer version |
| unavailable / unrecognized source | `snapshot_ref`, `source_ref`, `source_version_ref`, `source_state`, `resolved_at` | `unavailable(...)`;`unrecognized(...)` | `is_usable_for_summary(&self) -> bool` | `SourceUnavailable` / `SourceUnrecognized` | resolver failure / source mapping failure;version 来自 resolver summary 或 source changed payload |
| superseded source | `source_state`, `source_version_ref` | `mark_superseded(...)` | `is_superseded(&self) -> bool` | `SourceSuperseded` | accepted replacement / source version superseded |

```rust
/// Method-library 来源的 body-free snapshot;不保存 definition body 或 evidence body。
pub struct RoleCapabilitySourceSnapshot {
    /// 来源 snapshot 身份。
    pub snapshot_ref: RoleCapabilitySourceSnapshotRef,

    /// role / capability 来源引用。
    pub source_ref: RoleCapabilitySourceRef,

    /// 来源版本 marker。
    pub source_version_ref: RoleCapabilitySourceVersionRef,

    /// 来源解析状态。
    pub source_state: RoleCapabilitySourceStateKind,

    /// 来源安全摘要 marker。
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,

    /// 来源或能力声明的证据引用。
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// 最近一次解析 / 刷新时间。
    pub resolved_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_ref` | `RoleCapabilitySourceSnapshotRef` | snapshot identity | 来自 Step 7 id generator;不得用 source ref/version 拼接 |
| `source_ref` | `RoleCapabilitySourceRef` | role / capability 来源引用 | body-free;由 source resolver / request 提供 |
| `source_version_ref` | `RoleCapabilitySourceVersionRef` | 来源版本 marker | body-free;所有 snapshot state 必填;用于 stale / superseded 判断;不是 snapshot id |
| `source_state` | `RoleCapabilitySourceStateKind` | 来源状态 | 并入 snapshot,不再单独定义 `RoleCapabilitySourceState` truth |
| `safe_summary_ref` | `Option<RoleCapabilitySafeSummaryRef>` | 来源安全摘要 marker | resolved 状态必须有;unavailable / unrecognized 可为空;最小字段 Step 8 闭口 |
| `evidence_refs` | `Vec<CapabilityEvidenceRef>` | 来源 / 能力声明证据 refs | body-free;不得保存 evidence body |
| `resolved_at` | `IdentityTimestamp` | 最近解析时间 | 来自 clock;不得作为 source truth cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_resolved_source(snapshot_ref: RoleCapabilitySourceSnapshotRef, source_ref: RoleCapabilitySourceRef, source_version_ref: RoleCapabilitySourceVersionRef, safe_summary_ref: RoleCapabilitySafeSummaryRef, evidence_refs: Vec<CapabilityEvidenceRef>, resolved_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从正式来源解析结果创建 body-free snapshot | refs / safe summary / evidence 来自 source resolver;time 来自 clock | `RoleCapabilitySourceSnapshot` | state 为 `SourceResolved`;不保存 source body |
| `pub fn unavailable(snapshot_ref: RoleCapabilitySourceSnapshotRef, source_ref: RoleCapabilitySourceRef, source_version_ref: RoleCapabilitySourceVersionRef, checked_at: IdentityTimestamp) -> Self` | 构造来源不可用 snapshot | snapshot id 来自 generator;source ref 来自 request/resolver;source version 来自 resolver summary 或 Step 8 source changed payload;time 来自 clock | `RoleCapabilitySourceSnapshot` | `safe_summary_ref` 为空;state 为 `SourceUnavailable`;不得用 placeholder / timestamp / snapshot id 替代 source version |
| `pub fn unrecognized(snapshot_ref: RoleCapabilitySourceSnapshotRef, source_ref: RoleCapabilitySourceRef, source_version_ref: RoleCapabilitySourceVersionRef, checked_at: IdentityTimestamp) -> Self` | 构造来源无法识别 snapshot | snapshot id 来自 generator;source ref 与 source version 来自 resolver summary 或 Step 8 source changed payload;time 来自 clock | `RoleCapabilitySourceSnapshot` | state 为 `SourceUnrecognized`;不得 accepted summary;不得用 placeholder / timestamp / snapshot id 替代 source version |
| `pub fn matches_source(&self, source_ref: RoleCapabilitySourceRef) -> bool` | 判断 snapshot 是否对应同一正式来源 ref | source ref 来自 request / event | `bool` | 只比较正式 `source_ref` 字段,不解析字符串 |
| `pub fn has_required_evidence(&self) -> bool` | 判断是否具备证据引用 | 无 | `bool` | 只看 `evidence_refs`;不读取 evidence body |
| `pub fn is_usable_for_summary(&self) -> bool` | 判断 snapshot 是否可用于更新 summary | 无 | `bool` | 只有 `SourceResolved` 且 safe summary/evidence 满足 policy 时可用 |
| `pub fn mark_stale(&mut self, new_version_ref: RoleCapabilitySourceVersionRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 来源版本变化时标记 stale | version 来自 source changed event / resolver;time 来自 clock | `Ok(())` 或 domain rejection | 不更新为 active summary |
| `pub fn mark_unavailable(&mut self, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 来源不可用时标记 unavailable | time 来自 clock | `Ok(())` 或 domain rejection | 不保留旧 active 语义 |
| `pub fn mark_superseded(&mut self, new_version_ref: RoleCapabilitySourceVersionRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 来源被更新版本替代 | new version/time | `Ok(())` 或 domain rejection | state 为 `SourceSuperseded` |
| `pub fn is_superseded(&self) -> bool` | 判断 snapshot 是否被替代 | 无 | `bool` | 不改变状态 |

```rust
/// 角色能力来源 snapshot 状态。
pub enum RoleCapabilitySourceStateKind {
    /// 来源可解析,且可形成 body-free 安全摘要。
    SourceResolved,

    /// 来源版本已变化或 snapshot 过期。
    SourceStale,

    /// 来源暂不可用,不得用旧值静默覆盖新事实。
    SourceUnavailable,

    /// 来源无法映射到正式 ref 或 marker。
    SourceUnrecognized,

    /// 来源 snapshot 已被更新版本替代。
    SourceSuperseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `SourceResolved` | 来源可解析,且可形成 body-free 安全摘要。 | 可用来源 snapshot | source resolver success;source changed accepted | `SourceStale` / `SourceUnavailable` / `SourceUnrecognized` / `SourceSuperseded` |
| `SourceStale` | 来源版本已变化或 snapshot 过期。 | stale marker | source changed event;reference refresh job marker | `SourceResolved` / `SourceUnavailable` / `SourceSuperseded` |
| `SourceUnavailable` | 来源暂不可用,不得用旧值静默覆盖新事实。 | unavailable marker | resolver unavailable;dependency failure | `SourceResolved` / `SourceSuperseded` |
| `SourceUnrecognized` | 来源无法映射到正式 ref 或 marker。 | wrong / unknown source marker | resolver unrecognized;event mapping failure | `SourceResolved` only through new valid source resolution;or `SourceSuperseded` |
| `SourceSuperseded` | 来源 snapshot 已被更新版本替代。 | old snapshot marker | accepted replacement | 不回到当前主线 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `RoleCapabilitySourceState` 并入 snapshot | 来源状态必须绑定 source ref / version / snapshot,避免第二 truth |
| helper 只能使用显式字段 | `matches_source` 基于 `source_ref`,不得解析 source ref 字符串 |
| 不保存 definition / evidence body | snapshot 只保存 refs、version、state、safe summary marker |
| unavailable / unrecognized 不可用于 active summary | policy 必须阻止静默 accepted |

#### 7.9.5 `RoleCapabilitySourcePolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.C` |
| 所属业务组成部分 | 角色能力摘要 |
| 归属 crate / module | `identity-domain::role_capability_policy` |
| 承接 capability | 要求来源 / 证据闭合;禁止 definition body / method body / 自动评估正文;防止 stale/unavailable 静默 accepted |
| 对象类别 | policy / guard |
| 主要责任 | 校验角色能力摘要写入必须具备正式来源或证据,且不得携带定义正文、method body、evidence body、自动评估算法正文或绩效推断 |
| 不承担什么 | 不解析外部协议、不调用 method-library adapter、不评估能力等级、不替代 source resolver、不写 trace / outbox |
| 后续 Step 承接 | Step 7 source/evidence resolver;Step 8 role capability precheck;Step 9 rejected/stale flow;Step 10 forbidden body / missing evidence;Step 12 error surface |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| member dependency guard | `member_ref` | `RoleCapabilitySourcePolicy::for_summary_update(...)` | `assert_member_exists(&self) -> Result<(), IdentityDomainError>` | 不适用 | loaded member existence / request;read port Step 7 |
| source/evidence guard | `source_snapshot`, `evidence_refs` | `for_summary_update(...)` | `assert_source_or_evidence_present(&self) -> Result<(), IdentityDomainError>` | source state | source resolver / request |
| source usability guard | `source_snapshot` | `for_source_change(...)` | `assert_source_usable(&self) -> Result<(), IdentityDomainError>` | `SourceResolved` required for active write | source snapshot |
| forbidden body guard | `change_material_marker` | `for_summary_update(...)` | `assert_no_forbidden_body(&self) -> Result<(), IdentityDomainError>` | 不适用 | DTO / event material marker;schema Step 8 |
| automatic scoring guard | `change_material_marker` | `for_summary_update(...)` | `assert_not_automatic_scoring(&self) -> Result<(), IdentityDomainError>` | 不适用 | DTO / event material marker;schema Step 8 |

```rust
/// 角色能力来源 guard;阻止无来源、无证据、forbidden body 和自动评分进入 identity truth。
pub struct RoleCapabilitySourcePolicy {
    /// 被维护摘要的成员。
    pub member_ref: GlobalMemberRef,

    /// 当前来源解析 snapshot。
    pub source_snapshot: RoleCapabilitySourceSnapshot,

    /// 能力声明依据引用。
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// 摘要变化原因引用。
    pub change_reason_ref: RoleCapabilityChangeReasonRef,

    /// 发起维护或来源变化处理的 actor。
    pub actor_ref: ActorRef,

    /// 当前操作通道。
    pub operation_channel: IdentityOperationChannel,

    /// 变化 material 的 body-free 分类 marker。
    pub change_material_marker: RoleCapabilityChangeMaterialMarker,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被维护摘要的成员 | 必须对应已建立 member;读取面 Step 7 闭口 |
| `source_snapshot` | `RoleCapabilitySourceSnapshot` | 来源解析结果 | 来自 resolver / source event;policy 不调用 adapter |
| `evidence_refs` | `Vec<CapabilityEvidenceRef>` | 能力声明证据 refs | body-free;不得为空的场景 Step 10 固化 |
| `change_reason_ref` | `RoleCapabilityChangeReasonRef` | 变化原因 marker | 必填;不得保存原因正文 |
| `actor_ref` | `ActorRef` | 操作者 / 来源 actor | 来自 command metadata / event context |
| `operation_channel` | `IdentityOperationChannel` | 操作通道 | command / source consumer 可写;query / projection 不写 truth |
| `change_material_marker` | `RoleCapabilityChangeMaterialMarker` | material 类型 marker | Step 8 定义;必须能区分 safe summary vs forbidden body / scoring body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_summary_update(member_ref: GlobalMemberRef, source_snapshot: RoleCapabilitySourceSnapshot, evidence_refs: Vec<CapabilityEvidenceRef>, change_reason_ref: RoleCapabilityChangeReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, change_material_marker: RoleCapabilityChangeMaterialMarker) -> Self` | 构造角色能力摘要维护 guard | 入参来自 request / resolver / metadata;policy 不读取外部 | `RoleCapabilitySourcePolicy` | 不调用 adapter |
| `pub fn for_source_change(current_summary: &RoleCapabilitySummary, source_snapshot: RoleCapabilitySourceSnapshot, operation_channel: IdentityOperationChannel, change_material_marker: RoleCapabilityChangeMaterialMarker) -> Self` | 构造来源变化处理 guard | current summary 来自 loaded truth;source snapshot 来自 event/resolver | `RoleCapabilitySourcePolicy` | 不修复 source truth |
| `pub fn assert_member_exists(&self) -> Result<(), IdentityDomainError>` | 校验摘要必须依附已建立成员 | 使用 `member_ref`;真实读取结果由 application 提供 | `Ok(())` 或 domain rejection | 不读取 repository |
| `pub fn assert_source_or_evidence_present(&self) -> Result<(), IdentityDomainError>` | 防止无来源 / 无证据能力声明 | 使用 snapshot / evidence refs | `Ok(())` 或 domain rejection | 缺来源或证据不得 accepted |
| `pub fn assert_source_usable(&self) -> Result<(), IdentityDomainError>` | 阻止 stale / unavailable / unrecognized 静默 accepted | 使用 `source_snapshot.source_state` | `Ok(())` 或 domain rejection | `SourceResolved` 才可 active write |
| `pub fn assert_no_forbidden_body(&self) -> Result<(), IdentityDomainError>` | 防止 RoleDefinition / CapabilityDefinition / method / evidence body 入仓 | 使用 `change_material_marker` | `Ok(())` 或 domain rejection | marker schema 后移 Step 8,但 Step 6 固定必须存在 |
| `pub fn assert_not_automatic_scoring(&self) -> Result<(), IdentityDomainError>` | 防止能力等级自动评估或绩效推断写入 truth | 使用 `change_material_marker` | `Ok(())` 或 domain rejection | identity 不拥有 scoring algorithm body |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不允许缺来源 / 缺证据的能力声明 accepted | 对应 `BR-ID-008` |
| 不允许 definition body、method body、evidence body 进入 change material | 对应 `BR-ID-007` / `VETO-ID-003` |
| 不允许 identity 自动推断能力等级或绩效 | 对应 `BR-ID-009` |
| 不把 source stale/unavailable 当作 active | 必须显式 stale / unavailable / pending reconciliation |
| 不把维护对账作为直接修复 method-library truth 的通道 | source owner 仍为 method-library |

#### 7.9.6 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `RoleCapabilitySourceState` | 并入 `RoleCapabilitySourceSnapshot.source_state` | 来源状态必须绑定 source ref / version / snapshot,独立对象会制造第二来源 truth | 本批 `RoleCapabilitySourceSnapshot`;Step 10 source state |
| `RoleCapabilityView` | 后移并入 `MemberSummaryView` / role query surface | 它是成员消费摘要切片,不是独立 truth | 6.F `MemberSummaryView`;Step 8 query result |
| `RoleCapabilityTraceRecord` | 后移到身份事实消费与追溯 | role capability accepted change 需要 trace,但 trace 是跨组成部分统一对象 | 6.F `IdentityTraceRecord`;Step 9 accepted side effect |
| `RoleSourceRef` / `CapabilitySourceRef` / `CapabilityEvidenceRef` | 作为 boundary ref 使用 | 它们是外部来源 / 证据引用类型,不是 identity-owned object | Step 7 resolver;Step 8 protocol schema |
| `RoleDefinition` / `CapabilityDefinition` / method body | 排除 | 定义正文归 method-library,identity 只保存 safe summary marker | 不进入 identity Step 6 object |
| ProjectMember role assignment | 排除 | 项目内角色 / 承担事实归 work | 6.D career 只保存 work source marker |

#### 7.9.7 6.C 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.9.1 明确 summary 维护、source snapshot、source change、source/evidence guard 和 forbidden body guard |
| 是否有功能到对象映射 | 通过 | §7.9.2 将 summary、snapshot、policy 分开 |
| 对象是否能回指 `02` / Step 5 | 通过 | 三个对象均来自“角色能力摘要”组成部分 |
| 字段来源是否闭合到当前 Step 粒度 | 通过 | request / resolver / event / loaded member / id / clock 来源已标注;port 留给 Step 7 |
| 状态是否闭合 | 通过 | summary state 与 source state variant 已定义;完整矩阵留 Step 10 |
| helper 是否有字段支撑 | 通过 | `matches_source` 使用显式 `source_ref`;不从 summary marker 推导 |
| 是否越过 Step 7~10 | 通过 | 未定义 resolver trait、DTO schema、transaction order、完整状态矩阵或 DDL |
| 是否保存 forbidden body | 未保存 | RoleDefinition / CapabilityDefinition / method / evidence body 均排除 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |

#### 7.9.8 6.C 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| safe summary | `RoleCapabilitySummary` 保存 `safe_summary_ref`、source refs 和 evidence refs | 直接保存 RoleDefinition JSON、method body 或 capability definition body |
| source state | `RoleCapabilitySourceSnapshot.source_state` 绑定 source ref / version / snapshot | 单独建 `RoleCapabilitySourceState` 并脱离 snapshot 形成第二来源 truth |
| stale 来源 | source 版本变化后 summary 标记 `Stale` 或 `PendingReconciliation` | source stale 后继续把旧 summary 当 `Active` 发布 |
| evidence | 能力声明使用 `CapabilityEvidenceRef` body-free marker | 在 identity summary 里保存证据正文或 artifact body |
| 自动评分 | policy 拒绝 automatic scoring / performance inference material | identity 根据日志或任务表现自动写入“高级能力”结论 |

### 7.10 6.2-a~6.2-c domain core 已写对象复核

本批不是重写 6.A~6.C,而是把已写的 domain core truth / state / policy 对象放回 `6.1-a`、`6.1-b`、`6.1-c` 的 shared type 细化结果中复核。复核目标是确认已写字段、factory、helper、state 与 shared typed ref / marker 一致,并把还不能在 Step 6 自行决定的读取面、协议面、flow 面和状态矩阵面显式标出。

本批只允许处理:

- `6.A` 身份锚定与成员真相。
- `6.B` 全局生命周期。
- `6.C` 角色能力摘要。
- 已写对象对 `6.1-a~6.1-c` 的字段类型、来源、禁止事项和后续承接说明。

本批不允许处理:

- Step 7 repository / resolver / mapper / port trait。
- Step 8 command / query / event / job DTO 和 public surface。
- Step 9 function flow、事务顺序、accepted side effect。
- Step 10 完整状态矩阵、错误映射和测试切口。
- `6.2-d` 身份生涯记录或更后续对象。

#### 7.10.1 capability / source 一致性复核

| 批次 | capability 主轴 | 已写对象 | 已引用 shared type | 复核结论 |
|---|---|---|---|---|
| `6.2-a` | 建立平台级成员身份主语、防止 ref 复用、query no-create、身份边界排除 | `GlobalMember`,`IdentityAnchorState`,`IdentityAnchorPolicy` | `GlobalMemberRef`,`IdentitySourceRef`,`IdentityTimestamp`,`IdentityOperationChannel`,`IdentityAnchorReasonRef` | 闭合。字段均已回指 typed ref / marker;source owner 和 repository read 仍留 Step 7 |
| `6.2-b` | 初始 lifecycle、显式迁移、高风险 basis guard、anchor/lifecycle 分离 | `GlobalLifecycleState`,`LifecycleTransitionPolicy`,`HighRiskLifecycleGuard` | `LifecycleReasonRef`,`LifecycleRiskRef`,`GovernanceBasisRef`,`GovernanceBasisSummary`,`IdentityTimestamp`,`IdentityOperationChannel` | 基本闭合。需明确 `HighRiskLifecycleGuard` 的 basis match 必须消费 `GovernanceBasisSummary` 输入,不得只靠 `GovernanceBasisRef` 判断有效性 |
| `6.2-c` | role/capability body-free summary、source snapshot、source/evidence guard、forbidden material guard | `RoleCapabilitySummary`,`RoleCapabilitySourceSnapshot`,`RoleCapabilitySourcePolicy` | `RoleSourceRef`,`CapabilitySourceRef`,`RoleCapabilitySourceRef`,`RoleCapabilitySourceVersionRef`,`CapabilityEvidenceRef`,`RoleCapabilitySafeSummaryRef`,`RoleCapabilityChangeReasonRef`,`RoleCapabilityChangeMaterialMarker` | 闭合。safe summary / evidence / material 均已固定为 body-free marker;public DTO/event 映射留 Step 8/12 |

#### 7.10.2 已写对象逐项复核

| 对象 | 所属批次 | 复核结论 | 需要澄清 / 补强的口径 | 后续承接 |
|---|---|---|---|---|
| `GlobalMember` | `6.2-a` | 可保留。字段足以表达平台级成员 truth 主语,未混入 account / credential / runtime / ProjectMember truth | `member_ref` 来源仍只能写到 Step 7 id source 或 request-bound id,Step 6 不决定具体 generator trait | Step 7 member repository / id source;Step 9 establish flow;Step 11 unique key |
| `IdentityAnchorState` | `6.2-a` | 可保留。状态族只表达 anchor hold,不表达 lifecycle | `reason_ref` 字段保持 `Option<IdentityAnchorReasonRef>` 以支持 `Established`;`retired_held(...)` / `tombstone_held(...)` factory 必须接收 reason ref。按状态的持久化 nullable / required 规则留 Step 10/11 | Step 10 anchor state matrix;Step 11 column constraint |
| `IdentityAnchorPolicy` | `6.2-a` | 可保留。policy 只消费已加载输入,不读取 repository、不生成 id | `assert_not_external_account_truth(...)` 不能解析字符串 owner;必须等待 Step 7/8 给出 typed source owner / resolver summary | Step 7 source resolver;Step 8 create/read precheck;Step 12 wrong-owner error |
| `GlobalLifecycleState` | `6.2-b` | 可保留。生命周期 truth 与 anchor hold 已分离 | `basis_ref` 只保存 body-free `GovernanceBasisRef`;valid / stale / unavailable / invalid-for-action 由 `GovernanceBasisSummary` 和 Step 12 surface 承接 | Step 7 basis resolver;Step 10 lifecycle matrix;Step 11 persistence |
| `LifecycleTransitionPolicy` | `6.2-b` | 可保留。显式 command、actor、reason、迁移方向 guard 已有字段支撑 | `assert_allowed_transition(...)` 当前只提供本地 guard 入口,完整允许矩阵不能在 Step 6 里补完 | Step 9 transition flow;Step 10 transition matrix |
| `HighRiskLifecycleGuard` | `6.2-b` | 需补强说明。现有字段只有 `basis_ref` / `action_risk_ref`,不足以判断 basis 是否 valid for action | `assert_basis_matches_action(...)` 必须在 Step 7/9 接收或消费 `GovernanceBasisSummary`;不得从 `GovernanceBasisRef` 字符串、kind 或 presence 推断授权有效性 | Step 7 basis resolver result;Step 9 high-risk precheck;Step 12 invalid/unavailable basis |
| `RoleCapabilitySummary` | `6.2-c` | 可保留。summary 只保存 source refs、evidence refs、safe summary marker 和 source snapshot ref | `safe_summary_ref` 已由 `6.1-c` 固定为 body-free ref 并绑定 source;Step 8 只定义 public safe summary surface / redaction,不反向改变 truth 字段 | Step 8 query/outbound schema;Step 10 summary state;Step 12 redaction |
| `RoleCapabilitySourceSnapshot` | `6.2-c` | 可保留。source state 与 source ref/version/safe summary/evidence 绑定在同一 snapshot,避免第二 source truth | `source_version_ref` 不得替代 snapshot id、truth cursor 或 optimistic version;resolver read 和 stale 语义留 Step 7/9/11 | Step 7 source resolver;Step 9 source changed flow;Step 11 persisted version |
| `RoleCapabilitySourcePolicy` | `6.2-c` | 可保留。source/evidence/forbidden body/automatic scoring guard 已有 marker 支撑 | `change_material_marker` 的 kind family 已在 Step 6 固定;Step 8 只是把 API/worker DTO/event 映射到这些 kind,不得再发明隐式 safe material | Step 8 schema precheck;Step 12 rejection surface;Step 16 negative tests |

#### 7.10.3 字段闭环审计

| 字段 / 类型 | 当前使用对象 | 正式来源 | 复核结论 | 禁止替代 |
|---|---|---|---|---|
| `GlobalMemberRef` | `GlobalMember`,`IdentityAnchorPolicy`,`RoleCapabilitySummary` | `6.1-a` typed member ref;Step 7 id source / request-bound id | 已闭合为 opaque typed ref | 不得用 account id、credential id、ProjectMember id 或 runtime id 替代 |
| `IdentityTimestamp` | `GlobalMember`,`IdentityAnchorState`,`GlobalLifecycleState`,`RoleCapabilitySummary`,`RoleCapabilitySourceSnapshot` | `6.1-a`;clock port 后续闭口 | 已闭合为时间值 | 不得替代 truth cursor、optimistic version 或 source version |
| `IdentityOperationChannel` | `IdentityAnchorPolicy`,`LifecycleTransitionPolicy`,`RoleCapabilitySourcePolicy` | `6.1-a`;entry context 后续传入 | 已闭合为操作入口 marker | 不得替代权限、visibility、basis 或 idempotency key |
| `IdentitySourceRef` | `GlobalMember`,`IdentityAnchorPolicy`,reason/source/evidence marker | `6.1-a`;source resolver 后续闭口 | 已闭合为 body-free source ref | 不得保存外部正文、解析字符串前缀或隐式 owner |
| `IdentityAnchorReasonRef` | `IdentityAnchorState` | `6.1-b` | 已闭合。terminal factory 必填,字段可为 Option 以支持 Established | 不得保存 reason text、audit note 或 governance body |
| `LifecycleReasonRef` | `GlobalLifecycleState`,`LifecycleTransitionPolicy` | `6.1-b` | 已闭合为 lifecycle reason marker | 不得用空字符串 reason 或 actor 替代 |
| `LifecycleRiskRef` | `HighRiskLifecycleGuard` | `6.1-b`;risk classification 来源后续 Step 7/14 | 已闭合为动作风险 marker | 不得直接读取 policy body 或 governance body |
| `GovernanceBasisRef` | `GlobalLifecycleState`,`HighRiskLifecycleGuard` | `6.1-b`;governance boundary ref | 已闭合为 body-free basis ref | 不得保存 Gate / Approval / Policy / Control truth body |
| `GovernanceBasisSummary` | `HighRiskLifecycleGuard` 的匹配输入 | `6.1-b`;Step 7 resolver result | 需要在 Step 7/9 显式传入或消费,不能只隐含在 basis ref 中 | 不得从 `GovernanceBasisRef` presence 推断 valid |
| `RoleCapabilitySourceRef` | `RoleSourceRef`,`CapabilitySourceRef`,`RoleCapabilitySourceSnapshot` | `6.1-c` | 已闭合为 canonical body-free source | 不得从 external ref 前缀推断 source kind |
| `RoleSourceRef` | `RoleCapabilitySummary` | `6.1-c` | 已闭合,只能包装 supports_role 的 canonical source | 不得保存 RoleDefinition body |
| `CapabilitySourceRef` | `RoleCapabilitySummary` | `6.1-c` | 已闭合,只能包装 supports_capability 的 canonical source | 不得保存 CapabilityDefinition body 或评分算法 |
| `RoleCapabilitySourceVersionRef` | `RoleCapabilitySourceSnapshot` | `6.1-c`;source resolver / source event | 已闭合为 source-side opaque version | 不得替代 snapshot id、cursor 或 persistence version |
| `CapabilityEvidenceRef` | `RoleCapabilitySummary`,`RoleCapabilitySourceSnapshot`,`RoleCapabilitySourcePolicy` | `6.1-c`;evidence resolver / request marker | 已闭合为 body-free evidence ref | 不得保存 evidence / artifact body |
| `RoleCapabilitySafeSummaryRef` | `RoleCapabilitySummary`,`RoleCapabilitySourceSnapshot` | `6.1-c`;resolver safe summary marker | 已闭合为 source-bound safe summary ref | 不得把 summary body、definition field 或敏感字段塞入 token |
| `RoleCapabilityChangeReasonRef` | `RoleCapabilitySourcePolicy` | `6.1-c`;command / event / reconciliation marker | 已闭合为 body-free change reason | 不得替代 actor、basis 或 trace |
| `RoleCapabilityChangeMaterialMarker` | `RoleCapabilitySourcePolicy` | `6.1-c`;Step 8 DTO/event precheck 映射 | 已闭合为 safe/forbidden material kind family | 不得在 Step 8 新增未声明的隐式 safe payload |

#### 7.10.4 复核闭口与后续承接

| 项 | 复核闭口 | 后续必须如何承接 |
|---|---|---|
| `RoleCapabilityChangeMaterialMarker` | Step 6 已固定 material kind family,包括 safe marker、source version marker、evidence refs only、definition body、method body、evidence body、automatic scoring | Step 8 只负责把 public DTO / event / worker entry 映射到这些 kind;Step 12/16 负责 rejected surface 和负例测试 |
| `safe_summary_ref` 字段 | `RoleCapabilitySafeSummaryRef` 已固定为 source-bound body-free ref | Step 8 只定义 public safe summary surface / redaction,不得把 truth 字段改成 summary body |
| `IdentityAnchorState.reason_ref` | 字段保持 Option,因为 `Established` 没有 terminal reason;`retired_held(...)` / `tombstone_held(...)` factory 要求 reason ref | Step 10/11 决定按 state variant 的 required/nullable 持久化规则 |
| `HighRiskLifecycleGuard.assert_basis_matches_action(...)` | 仅靠 `basis_ref` / `action_risk_ref` 无法验证 basis 是否 valid for action | Step 7 basis resolver 必须产出 `GovernanceBasisSummary`;Step 9 high-risk precheck 必须把 summary 交给 guard 或等价 policy 输入 |
| source / evidence missing | Step 6 只固定缺 source/evidence 不得 silent accepted | rejected、pending source、dependency unavailable 或 degraded read 的具体分支留 Step 9/10/12 |
| lifecycle allowed transition | Step 6 只固定本地 guard 入口和状态族 | 完整迁移矩阵、终态规则、Retired 是否可到 Tombstoned 留 Step 10 |

#### 7.10.5 6.2-a~6.2-c 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| 已写对象复核 | 复核 `GlobalMember.source_ref` 是否使用 `IdentitySourceRef`,并把 owner 解析留给 Step 7 | 在复核阶段新增 `IdentitySourceResolverPort` trait |
| anchor reason | `IdentityAnchorState::retired_held(reason_ref, changed_at)` 要求 reason ref,字段仍允许 Established 为 None | 把 `reason_ref` 改成裸字符串或让 terminal hold 没有 reason |
| high-risk basis | `HighRiskLifecycleGuard` 要求 `GovernanceBasisSummary` 证明 basis valid for action | 看到 `Some(GovernanceBasisRef)` 就认定高风险处置可 accepted |
| safe summary | `RoleCapabilitySummary.safe_summary_ref` 使用 `RoleCapabilitySafeSummaryRef` 并绑定 source | 在 `RoleCapabilitySummary` 中保存 method definition、capability body 或 redaction 后正文 |
| material marker | `ForbiddenAutomaticScoring` 作为 rejected kind 进入 Step 12 映射 | Step 8 DTO 新增 `score: f64` 并让 policy 自动写能力等级 |
| source version | `RoleCapabilitySourceVersionRef` 只用于 source stale / superseded 判断 | 用 source version token 作为 snapshot id、truth cursor 或 optimistic lock version |

#### 7.10.6 6.2-a~6.2-c 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只复核已写 6.A~6.C | 通过 | 未写 6.2-d career,未创建 Step 7 文件 |
| 是否对齐 6.1 shared type | 通过 | `GlobalMemberRef`,`IdentityTimestamp`,`IdentitySourceRef`,reason/basis/risk,role/capability marker 均已回指 |
| 是否发现需重写对象卡片 | 未发现 | 现有 6.A~6.C 对象边界基本成立,只需以本节澄清消除后续误读 |
| 是否仍有 Step 7/9/10 缺口 | 有 | `GovernanceBasisSummary` 输入、source owner resolver、transition matrix、source/evidence missing branch 均留后续正式闭口 |
| 是否越过 Step 7~12 | 未越过 | 本节只写复核结论和后续承接,未定义 port、DTO、flow、DDL、错误 surface |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.2-d` | 用户审核通过后进入身份生涯记录对象契约 |

### 7.11 6.2-d 身份生涯记录

本批只处理“身份生涯记录” domain core 对象契约,目标是让成员身份侧 career history 以 append-only 方式记录可信 work participation 来源、safe summary、append reason、actor 和状态语义。`CareerRecord` 是 identity-owned append history,但 Project、WorkItem、ProjectMember truth 和 work body 仍归 `L1-work`,只能以 body-free ref / safe summary marker 进入 identity。

本批允许定义:

- `CareerRecordId` / `CareerRecordRef`。
- `ProjectParticipationRef` / `WorkSourceRef` / `CareerSourceMarkerRef` / `CareerSafeSummaryRef` / `CareerAppendReasonRef`。
- `WorkParticipationSourceSummary` / `WorkParticipationSourceState` 作为 Step 7 resolver result 的 body-free 输入 shape。
- `CareerRecord` / `CareerRecordStateKind`。
- `CareerAppendPolicy` / `CareerRecordChangeIntent` / `CareerAppendMaterialMarker`。

本批不定义:

- work participation resolver / repository / event consumer port trait。
- `AppendCareerRecord` request / result DTO。
- `HandleWorkParticipationAccepted` event envelope。
- `ListCareerRecords` query view / visibility surface。
- transaction order、stored result、idempotency replay 或 DDL unique key。

#### 7.11.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 追加生涯记录 | `GlobalMemberRef`, work participation safe source summary, append reason, actor, timestamp | `CareerRecord::Appended` | append-only identity history;不改 work truth | `CareerRecord`,`CareerAppendPolicy` | Step 7 member/career repo + work resolver;Step 8 append command;Step 9 accepted flow |
| 追加式纠错 | original `CareerRecordRef`, correction source marker, reason, actor | 新 `CareerRecord::CorrectionAppended`;旧记录可被解释性标记 `SupersededByCorrection` | 纠错仍是追加,旧记录不得删除或覆盖 | `CareerRecord`,`CareerRecordStateKind`,`CareerAppendPolicy` | Step 9 correction append;Step 10 correction matrix |
| 处理重复来源 | `CareerSourceMarkerRef`, existing records for same source | duplicate/no-op surface | 不新增重复 career history | `CareerAppendPolicy` | Step 7 source lookup;Step 9 duplicate replay/no-op;Step 13 idempotency |
| 来源待复核 | unresolved / untrusted / unavailable source summary | `CareerRecord::SourcePendingReview` 或 rejected surface | 不反写 work truth,不把 pending 当作 accepted mainline | `WorkParticipationSourceSummary`,`CareerRecordStateKind` | Step 9 pending/rejected branch;Step 12 source unavailable |
| 排除 work truth body | append material marker / DTO precheck | domain rejection | Project / WorkItem / ProjectMember body 不入仓 | `CareerAppendPolicy`,`CareerAppendMaterialMarker` | Step 8 schema precheck;Step 12 forbidden body;Step 16 negative tests |

#### 7.11.2 功能到对象映射

| 对象 / 类型 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `CareerRecordId` / `CareerRecordRef` | 标识 identity-owned career record | typed ref | opaque id/ref、同一性比较 | 不从 member/source 拼接 id;不标识 work truth |
| `ProjectParticipationRef` | 指向 work participation 来源 | boundary ref | 包装 work-owned body-free source ref | 不保存 ProjectMember / Project / WorkItem body |
| `WorkSourceRef` | 指向 work accepted fact / correction / migration source | boundary ref | 显式区分 work source kind 和 body-free source ref | 不从 external ref 字符串推断 kind |
| `CareerSourceMarkerRef` | 幂等 / duplicate source marker | source marker | 表达同一 work participation 来源是否已追加 | 不替代 idempotency key、truth cursor 或 record id |
| `CareerSafeSummaryRef` | 生涯可见摘要 marker | safe summary ref | 指向 redaction-safe work participation summary | 不保存 work summary body |
| `CareerAppendReasonRef` | 追加 / 纠错原因 marker | reason ref | body-free reason kind + source ref | 不保存 reason text 或 audit note body |
| `WorkParticipationSourceSummary` | 来源可信性输入 | resolver safe summary shape | 承载 trusted / pending / unresolved / unavailable 等状态 | 不定义 resolver trait,不保存 work body |
| `CareerRecord` | append-only career history | truth / history | 保存 member、source marker、safe summary、reason、actor、time 和 state | 不原地修改、删除、重排,不拥有 work truth |
| `CareerRecordStateKind` | career record 状态语义 | state enum | 区分 appended、correction、superseded、pending review | duplicate/rejected/empty/not visible 是 surface,不是 record state |
| `CareerAppendPolicy` | append guard | policy / guard | 校验 member、source trusted、not duplicate、append-only、forbidden body、write channel | 不读取 repository、不调用 work adapter、不生成 id、不写 trace/outbox |
| `CareerRecordChangeIntent` / `CareerAppendMaterialMarker` | append-only 与 forbidden body guard 输入 | marker / intent | 区分 append/correction/pending 与 update/delete/reorder/forbidden body | 不成为持久 career truth |

#### 7.11.3 career typed refs / markers

##### `CareerRecordId` / `CareerRecordRef`

```rust
/// Stable opaque identifier for an Identity career record.
pub struct CareerRecordId(pub String);

/// Typed reference to an Identity-owned career record.
pub struct CareerRecordRef {
    /// Stable career record id.
    pub record_id: CareerRecordId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `CareerRecordId.0` | `String` | identity-owned career record ID | 来源于 Step 7 id generator 或 accepted migration;非空;opaque |
| `CareerRecordRef.record_id` | `CareerRecordId` | 指向 `CareerRecord` truth/history | 来自 id generator、loaded record、accepted result;不得临时拼接 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(value: String) -> Result<CareerRecordId, ContractError>` | 构造 career record id | value 为已分配 opaque id | `Result<CareerRecordId, ContractError>` | 校验非空;不生成 id |
| `pub fn from_id(record_id: CareerRecordId) -> CareerRecordRef` | 构造 typed ref | 已校验 record id | `CareerRecordRef` | 不读取 repository |
| `pub fn same_record(&self, other: &CareerRecordRef) -> bool` | 判断同一 career record | `other` 为另一个 record ref | `bool` | 只比较 record id |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| opaque | 不得从 record id 解析 member/source/correction 信息 |
| 不由 source marker 直接派生 | source marker 用于 duplicate 检测,不是 record id 生成规则 |
| 不标识 work truth | Project、WorkItem、ProjectMember 和 work event id 不等于 `CareerRecordRef` |

##### `ProjectParticipationRef` / `WorkSourceRef`

```rust
/// Body-free reference to a work-owned project participation source.
pub struct ProjectParticipationRef {
    /// Work-owned source ref for project participation.
    pub source_ref: IdentitySourceRef,
}

/// Work source category used by Identity career append.
pub enum WorkSourceKind {
    /// Accepted project participation fact owned by Work.
    ProjectParticipationAccepted,
    /// Work-side correction or replacement marker.
    WorkCorrection,
    /// Migration-safe work participation import.
    MigrationImport,
    /// Work participation source that requires review before accepted career append.
    PendingReviewMarker,
}

/// Body-free work source ref used by career append and correction.
pub struct WorkSourceRef {
    /// Work source category.
    pub source_kind: WorkSourceKind,
    /// Work-owned body-free source reference.
    pub source_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `ProjectParticipationRef.source_ref` | `IdentitySourceRef` | 指向 work-owned participation 来源 | `source_owner` 必须为 `IdentitySourceOwner::Work`;不保存 ProjectMember body |
| `WorkSourceRef.source_kind` | `WorkSourceKind` | 标识来源类别 | 来自 request schema、work event metadata 或 resolver summary;不得从字符串推断 |
| `WorkSourceRef.source_ref` | `IdentitySourceRef` | work-owned source marker | owner 必须为 Work;不保存 work body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_work_source(source_ref: IdentitySourceRef) -> Result<ProjectParticipationRef, ContractError>` | 构造 participation ref | source ref 来自 work resolver / event / request marker | `Result<ProjectParticipationRef, ContractError>` | 校验 owner 为 Work |
| `pub fn new(source_kind: WorkSourceKind, source_ref: IdentitySourceRef) -> Result<WorkSourceRef, ContractError>` | 构造 work source ref | kind 显式给出;source ref 为 body-free marker | `Result<WorkSourceRef, ContractError>` | 校验 owner 为 Work;不读取 work |
| `pub fn same_source(&self, other: &WorkSourceRef) -> bool` | 同一 work source 判断 | `other` 为另一个 source ref | `bool` | 比较 kind + typed source ref |
| `pub fn is_pending_review_marker(&self) -> bool` | 判断是否来源待复核 marker | 无 | `bool` | 只读 kind |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| owner 必须为 Work | 不得用 account/runtime/method/governance source 伪造 career source |
| 不保存 work truth body | Project、WorkItem、ProjectMember、任务正文、项目私有字段均不进入 identity |
| 不解析 external ref | kind 必须显式字段,不能从前缀推断 |
| 不反向定义 work state | pending/review marker 只影响 identity append decision,不修改 work |

##### `CareerSourceMarkerRef` / `CareerSafeSummaryRef`

```rust
/// Stable source marker used to prevent duplicate career records for the same work source.
pub struct CareerSourceMarkerRef {
    /// Member that the source marker is associated with.
    pub member_ref: GlobalMemberRef,
    /// Work source represented by this marker.
    pub work_source_ref: WorkSourceRef,
    /// Opaque source-side or resolver-provided marker token.
    pub marker_token: String,
}

/// Body-free reference to a redaction-safe career summary.
pub struct CareerSafeSummaryRef {
    /// Work source this safe summary describes.
    pub work_source_ref: WorkSourceRef,
    /// Opaque safe summary marker.
    pub safe_summary_token: String,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `CareerSourceMarkerRef.member_ref` | `GlobalMemberRef` | duplicate 检测所属成员 | 来自 request/event/resolver mapped member;不能从 work private field 推导 |
| `CareerSourceMarkerRef.work_source_ref` | `WorkSourceRef` | duplicate 检测来源 | 来自 work resolver / event safe summary |
| `CareerSourceMarkerRef.marker_token` | `String` | opaque source marker | 非空;由 work event/resolver/request marker 提供;不得解析 |
| `CareerSafeSummaryRef.work_source_ref` | `WorkSourceRef` | safe summary 对应来源 | 必须与 record/policy 的 work source 一致 |
| `CareerSafeSummaryRef.safe_summary_token` | `String` | redaction-safe summary marker | 非空 opaque token;不保存 summary body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(member_ref: GlobalMemberRef, work_source_ref: WorkSourceRef, marker_token: String) -> Result<CareerSourceMarkerRef, ContractError>` | 构造 career source marker | 入参来自正式输入 / resolver summary | `Result<CareerSourceMarkerRef, ContractError>` | 校验 token 非空;不生成 marker |
| `pub fn same_marker(&self, other: &CareerSourceMarkerRef) -> bool` | 判断同一 career source marker | `other` 为另一个 marker | `bool` | 比较 member + work source + token |
| `pub fn new(work_source_ref: WorkSourceRef, safe_summary_token: String) -> Result<CareerSafeSummaryRef, ContractError>` | 构造 safe summary ref | source 与 token 来自 resolver / request safe marker | `Result<CareerSafeSummaryRef, ContractError>` | 校验非空;不保存正文 |
| `pub fn belongs_to_source(&self, work_source_ref: &WorkSourceRef) -> bool` | 判断 safe summary 是否对应来源 | work source 来自 record/policy | `bool` | 只比较 typed source ref |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source marker 不等于 idempotency key | idempotency key 保护请求重放;source marker 保护同一 work 来源不重复入 career |
| source marker 不等于 truth cursor | cursor 来源留 Step 7/11/13 |
| safe summary ref 不等于 summary body | public summary schema / redaction 留 Step 8/12 |
| 不从 token 推导 source | token opaque,source 必须显式字段 |

##### `CareerAppendReasonRef`

```rust
/// Body-free reason reference for a career append or correction.
pub struct CareerAppendReasonRef {
    /// Reason category for the career append.
    pub reason_kind: CareerAppendReasonKind,
    /// Body-free reason source.
    pub source_ref: IdentitySourceRef,
}

/// Reason category for career history append.
pub enum CareerAppendReasonKind {
    /// Explicit career append command.
    ManualAppend,
    /// Work participation accepted event.
    WorkParticipationAccepted,
    /// Correction of an existing career record.
    CorrectionAppend,
    /// Migration-safe import.
    MigrationImport,
    /// Source requires review and cannot enter accepted mainline yet.
    SourcePendingReview,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reason_kind` | `CareerAppendReasonKind` | 生涯追加原因类别 | 来自 command intent、work event、migration marker 或 review marker |
| `source_ref` | `IdentitySourceRef` | 原因来源 marker | body-free;不得保存原因长文本、work event body 或 audit note body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(reason_kind: CareerAppendReasonKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 career append reason | kind/source 来自正式输入 | `Result<CareerAppendReasonRef, ContractError>` | 不保存 reason body |
| `pub fn is_correction(&self) -> bool` | 判断是否纠错追加原因 | 无 | `bool` | `CorrectionAppend` 返回 true |
| `pub fn is_source_driven(&self) -> bool` | 判断是否 work/source 驱动 | 无 | `bool` | work/migration/pending review 类原因返回 true |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| reason 必填且 body-free | 不允许空字符串 reason 或长文本进入 truth |
| 不替代 actor | reason 解释为什么追加;actor 解释谁发起 |
| 不替代 source marker | reason 不用于 duplicate 检测 |

#### 7.11.4 `WorkParticipationSourceSummary`

```rust
/// Body-free resolver summary for a work participation source used by career append.
pub struct WorkParticipationSourceSummary {
    /// Project participation source ref.
    pub project_participation_ref: ProjectParticipationRef,
    /// Work source ref for the append.
    pub work_source_ref: WorkSourceRef,
    /// Stable source marker for duplicate detection.
    pub source_marker_ref: CareerSourceMarkerRef,
    /// Redaction-safe career summary marker, when available.
    pub safe_summary_ref: Option<CareerSafeSummaryRef>,
    /// Resolution state of the work source.
    pub source_state: WorkParticipationSourceState,
}

/// Resolution state for a work participation source summary.
pub enum WorkParticipationSourceState {
    /// Source is trusted for accepted career append.
    Trusted,
    /// Source exists but requires formal review before accepted append.
    PendingReview,
    /// Source cannot be mapped to a member or source marker.
    Unresolved,
    /// Source is known but not trusted for career append.
    Untrusted,
    /// Work dependency is unavailable.
    Unavailable,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `project_participation_ref` | `ProjectParticipationRef` | work participation 来源 | 来自 Step 7 resolver / event mapper;不保存 ProjectMember body |
| `work_source_ref` | `WorkSourceRef` | 本次 append 的 work source marker | 来自 request / resolver / event safe summary |
| `source_marker_ref` | `CareerSourceMarkerRef` | duplicate source marker | 必须与 member/source 绑定;Step 11 unique key 后续闭口 |
| `safe_summary_ref` | `Option<CareerSafeSummaryRef>` | 可传播安全摘要 marker | trusted append 通常必须存在;pending/unresolved 可为空;Step 10/12 固化 |
| `source_state` | `WorkParticipationSourceState` | 来源可信 / 待复核 / 不可用状态 | 来自 resolver/event mapper;Step 6 不定义 trait |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_resolver(project_participation_ref: ProjectParticipationRef, work_source_ref: WorkSourceRef, source_marker_ref: CareerSourceMarkerRef, safe_summary_ref: Option<CareerSafeSummaryRef>, source_state: WorkParticipationSourceState) -> Self` | 从 resolver / event mapper summary 构造 | 入参均为 body-free marker | `WorkParticipationSourceSummary` | 不保存 work body |
| `pub fn is_trusted(&self) -> bool` | 判断是否可进入 accepted career append | 无 | `bool` | `source_state == Trusted` 且 safe summary 存在的完整规则留 Step 10 |
| `pub fn requires_review(&self) -> bool` | 判断是否需要人工 / 正式复核 | 无 | `bool` | `PendingReview` / `Unresolved` / `Untrusted` 可返回 true |
| `pub fn has_safe_summary(&self) -> bool` | 判断是否具备 safe summary marker | 无 | `bool` | 只看 `safe_summary_ref` |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| summary 不是 work truth | 只保存 resolver 可见的 body-free safe summary |
| trusted 不等于读取 work body | trusted 由 Step 7 resolver / event mapper 给出,domain 不读取 work |
| unresolved/unavailable 不得伪成功 | 是否 rejected / pending review / report-only 留 Step 9/12,但不得 silent accepted |
| 不定义 port | resolver trait、fake 等价语义和错误映射留 Step 7/12 |

#### 7.11.5 `CareerRecord`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.2-d` |
| 所属业务组成部分 | 身份生涯记录 |
| 归属 crate / module | `identity-domain::career`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 追加生涯记录;追加式纠错;来源待复核;append-only history |
| 对象类别 | truth / history |
| 主要责任 | 保存成员身份侧 career append history,记录 work source marker、safe summary marker、append reason、actor、time 和 record state |
| 不承担什么 | 不拥有 Project、WorkItem、ProjectMember truth;不保存 work body;不做 visibility query;不写 trace/outbox/projection |
| 后续 Step 承接 | Step 7 career repository / work resolver;Step 8 append/list/consumer protocol;Step 9 append flow;Step 10 career state;Step 11 append-only persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 普通追加 | `career_record_ref`, `member_ref`, `source_summary`, `append_reason_ref`, `appended_by_ref`, `appended_at` | `CareerRecord::append_from_work_source(...)` | `matches_source_marker(&self, source_marker_ref) -> bool` | `Appended` | id generator;loaded member;work resolver/event summary;command metadata;clock |
| 追加式纠错 | `original_record_ref`, `correction_of_ref`, `append_reason_ref` | `CareerRecord::correction_for_record(...)` | `is_correction(&self) -> bool` | `CorrectionAppended` | original loaded record;correction request/source summary |
| 标记旧记录被纠错解释替代 | `superseded_by_ref` | 不适用;对旧 record 调用 | `mark_superseded_by_correction(&mut self, correction_record_ref, actor_ref, changed_at)` | `SupersededByCorrection` | accepted correction record ref;actor/time |
| 来源待复核 | `source_state`, optional `safe_summary_ref` | `CareerRecord::pending_review(...)` | `requires_source_review(&self) -> bool` | `SourcePendingReview` | resolver/event mapper pending summary |
| append-only guard 可读性 | `record_state`, `appended_at` | 不适用 | `is_append_only(&self) -> bool` | 所有持久 state | 本对象不提供 update/delete/reorder 方法 |

```rust
/// Identity-owned append-only career history record.
pub struct CareerRecord {
    /// Stable career record ref.
    pub career_record_ref: CareerRecordRef,

    /// Member whose career history this record belongs to.
    pub member_ref: GlobalMemberRef,

    /// Work-owned project participation source.
    pub project_participation_ref: ProjectParticipationRef,

    /// Work source marker for this append.
    pub work_source_ref: WorkSourceRef,

    /// Source marker used for duplicate detection.
    pub source_marker_ref: CareerSourceMarkerRef,

    /// Redaction-safe career summary marker.
    pub career_summary_ref: Option<CareerSafeSummaryRef>,

    /// Reason marker for this append.
    pub append_reason_ref: CareerAppendReasonRef,

    /// Actor that initiated the append or controlled source handling.
    pub appended_by_ref: ActorRef,

    /// Append time.
    pub appended_at: IdentityTimestamp,

    /// Career record state.
    pub record_state: CareerRecordStateKind,

    /// Original record explained by this correction, when this is a correction record.
    pub correction_of_ref: Option<CareerRecordRef>,

    /// Correction record that explains this record as superseded.
    pub superseded_by_ref: Option<CareerRecordRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `career_record_ref` | `CareerRecordRef` | 生涯记录身份 | 来自 Step 7 id generator / accepted migration;不得由 source marker 拼接 |
| `member_ref` | `GlobalMemberRef` | 所属成员 | 必须对应已建立 member;读取面 Step 7 |
| `project_participation_ref` | `ProjectParticipationRef` | work participation 来源 | body-free;不得保存 ProjectMember truth |
| `work_source_ref` | `WorkSourceRef` | append 来源 marker | 来自 command / resolver / event mapper;owner 必须 Work |
| `source_marker_ref` | `CareerSourceMarkerRef` | duplicate 检测 marker | 与 member/source 绑定;不得替代 idempotency key 或 cursor |
| `career_summary_ref` | `Option<CareerSafeSummaryRef>` | 安全摘要 marker | accepted `Appended` / `CorrectionAppended` 应有 safe summary;pending 可空;Step 10/12 固化 |
| `append_reason_ref` | `CareerAppendReasonRef` | 追加原因 | 必填;body-free |
| `appended_by_ref` | `ActorRef` | 追加 actor | 来自 command metadata / event context |
| `appended_at` | `IdentityTimestamp` | 追加时间 | 来自 clock port;不等于 truth cursor |
| `record_state` | `CareerRecordStateKind` | append history 状态 | 只允许本批定义的持久状态;duplicate/rejected 不入字段 |
| `correction_of_ref` | `Option<CareerRecordRef>` | 本记录纠错解释的原记录 | 仅 `CorrectionAppended` 使用;原记录仍保留 |
| `superseded_by_ref` | `Option<CareerRecordRef>` | 解释上替代本记录的 correction ref | 仅 `SupersededByCorrection` 使用;不得删除本记录 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append_from_work_source(career_record_ref: CareerRecordRef, member_ref: GlobalMemberRef, source_summary: WorkParticipationSourceSummary, append_reason_ref: CareerAppendReasonRef, actor_ref: ActorRef, appended_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从可信 work source 创建普通 career append | source_summary 来自 Step 7 resolver/event mapper;actor/time 来自 command/event context | 新 `CareerRecord` | state 为 `Appended`;不保存 work body |
| `pub fn correction_for_record(career_record_ref: CareerRecordRef, original_record_ref: CareerRecordRef, member_ref: GlobalMemberRef, source_summary: WorkParticipationSourceSummary, append_reason_ref: CareerAppendReasonRef, actor_ref: ActorRef, appended_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建追加式纠错记录 | original record ref 来自 loaded truth;source summary 为 correction marker | 新 `CareerRecord` | state 为 `CorrectionAppended`;旧记录不被覆盖 |
| `pub fn pending_review(career_record_ref: CareerRecordRef, member_ref: GlobalMemberRef, source_summary: WorkParticipationSourceSummary, append_reason_ref: CareerAppendReasonRef, actor_ref: ActorRef, appended_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建来源待复核记录 | source summary 为 pending/unresolved/untrusted | 新 `CareerRecord` | state 为 `SourcePendingReview`;是否持久化 pending record 留 Step 9/10 闭口 |
| `pub fn matches_source_marker(&self, source_marker_ref: &CareerSourceMarkerRef) -> bool` | 判断是否同一来源 marker | source marker 来自 request/event/resolver | `bool` | 比较 typed marker,不解析字符串 |
| `pub fn is_append_only(&self) -> bool` | 表达记录不可原地改写、删除或重排 | 无 | `bool` | 恒为 true;对象不提供 update/delete/reorder |
| `pub fn is_correction(&self) -> bool` | 判断是否 correction record | 无 | `bool` | `record_state == CorrectionAppended` |
| `pub fn requires_source_review(&self) -> bool` | 判断是否来源待复核 | 无 | `bool` | `record_state == SourcePendingReview` |
| `pub fn mark_superseded_by_correction(&mut self, correction_record_ref: CareerRecordRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 将旧记录解释性标记为被 correction 替代 | correction ref 来自新 accepted correction record;actor/time 用于后续 trace | `Ok(())` 或 domain rejection | 只改变解释状态和 superseded ref;不删除、不改写来源正文 |

```rust
/// Career record state for append-only identity career history.
pub enum CareerRecordStateKind {
    /// Normal appended career record.
    Appended,
    /// New record appended as a correction of an existing record.
    CorrectionAppended,
    /// Existing record is retained but explained as superseded by a correction record.
    SupersededByCorrection,
    /// Source requires review before it can enter accepted career mainline.
    SourcePendingReview,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Appended` | Normal appended career record. | 正常追加记录 | command accepted;work event accepted | `SupersededByCorrection` only through accepted correction;不得 update 为其它项目事实 |
| `CorrectionAppended` | New record appended as a correction of an existing record. | 追加式纠错记录 | correction command accepted | 终态候选;不得覆盖 original |
| `SupersededByCorrection` | Existing record is retained but explained as superseded by a correction record. | 旧记录被解释替代 | accepted correction side effect | 保留;不得删除 |
| `SourcePendingReview` | Source requires review before it can enter accepted career mainline. | 来源待复核 | unresolved/untrusted/pending source marker | 后续正式 append/correction 必须重新通过 guard;具体矩阵 Step 10 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不提供 update/delete/reorder 方法 |
| duplicate 不是 record state | duplicate command/event 必须返回 no-op / stored result surface,不得新增 `CareerRecord` |
| rejected 不是 record state | forbidden body、member missing、invalid source 在 accepted 前 rejected,不写 career truth |
| 不保存 work body | Project、WorkItem、ProjectMember、任务正文、artifact body 均排除 |
| cursor/filter 不影响历史顺序 | read cursor / filter 不能改变 `appended_at` 或 record state |

#### 7.11.6 `CareerAppendPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.2-d` |
| 所属业务组成部分 | 身份生涯记录 |
| 归属 crate / module | `identity-domain::career_policy` |
| 承接 capability | 成员依附 guard;来源可信 guard;duplicate source guard;append-only guard;forbidden work body guard |
| 对象类别 | policy / guard |
| 主要责任 | 校验 career append / correction 必须依附已建立成员、可信 work source、非重复 source marker、append-only change intent 和 body-free material |
| 不承担什么 | 不读取 repository、不调用 work resolver、不生成 id、不取 clock、不写 trace/audit/outbox、不决定 stored result |
| 后续 Step 承接 | Step 7 member/career repo + work resolver;Step 8 command/event schema;Step 9 append/correction/duplicate flow;Step 10 state matrix;Step 12 rejected surface |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| member guard | `member_ref`, `member_exists` | `CareerAppendPolicy::for_append(...)` | `assert_member_exists(&self)` | 不适用 | loaded member read result;Step 7 |
| source trusted guard | `source_summary` | `for_append(...)` / `for_correction(...)` | `assert_source_trusted(&self)` | source state | work resolver/event mapper summary |
| duplicate source guard | `source_marker_ref`, `existing_records_for_source` | `for_append(...)` | `assert_not_duplicate(&self)` | duplicate surface only | career repository lookup result;Step 7 |
| append-only guard | `change_intent` | `for_append(...)` / `for_correction(...)` | `assert_append_only(&self)` | intent marker | command/event precheck |
| forbidden body guard | `append_material_marker` | `for_append(...)` / `for_correction(...)` | `assert_not_work_truth_write(&self)` | material marker | Step 8 DTO/event schema precheck |
| write channel guard | `operation_channel` | `for_append(...)` | `assert_allowed_write_channel(&self)` | 不适用 | command / consumer entry context |

```rust
/// Career append guard;consumes loaded inputs and body-free source summary only.
pub struct CareerAppendPolicy {
    /// Member whose career record is being appended.
    pub member_ref: GlobalMemberRef,

    /// Whether the member was loaded from Identity truth.
    pub member_exists: bool,

    /// Body-free work source summary.
    pub source_summary: WorkParticipationSourceSummary,

    /// Existing records for the same source marker.
    pub existing_records_for_source: Vec<CareerRecordRef>,

    /// Career append reason.
    pub append_reason_ref: CareerAppendReasonRef,

    /// Actor that initiated the append.
    pub actor_ref: ActorRef,

    /// Current operation channel.
    pub operation_channel: IdentityOperationChannel,

    /// Requested change intent.
    pub change_intent: CareerRecordChangeIntent,

    /// Body-free material marker used to reject work truth bodies.
    pub append_material_marker: CareerAppendMaterialMarker,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被追加生涯的成员 | 来自 request/event mapper |
| `member_exists` | `bool` | 成员是否已建立 | 来自 Step 7 member repository read;policy 不读取 repository |
| `source_summary` | `WorkParticipationSourceSummary` | body-free work 来源摘要 | 来自 Step 7 resolver / event mapper;不保存 work body |
| `existing_records_for_source` | `Vec<CareerRecordRef>` | 同一 source marker 已存在记录 | 来自 Step 7 career repository lookup;用于 duplicate guard |
| `append_reason_ref` | `CareerAppendReasonRef` | 追加原因 | 必填;body-free |
| `actor_ref` | `ActorRef` | 追加 actor | 来自 command metadata / event context |
| `operation_channel` | `IdentityOperationChannel` | 操作通道 | command / consumer 可进入 career write guard;query/job 不写 career truth |
| `change_intent` | `CareerRecordChangeIntent` | 请求变化意图 | append/correction/pending 可候选;update/delete/reorder 必须 rejected |
| `append_material_marker` | `CareerAppendMaterialMarker` | material 分类 | Step 8 schema precheck 映射;不得携带 forbidden body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_append(member_ref: GlobalMemberRef, member_exists: bool, source_summary: WorkParticipationSourceSummary, existing_records_for_source: Vec<CareerRecordRef>, append_reason_ref: CareerAppendReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, change_intent: CareerRecordChangeIntent, append_material_marker: CareerAppendMaterialMarker) -> Self` | 构造 career append guard | 所有入参由 application 准备 | `CareerAppendPolicy` | 不读取 repository、不调用 work |
| `pub fn for_correction(member_ref: GlobalMemberRef, member_exists: bool, source_summary: WorkParticipationSourceSummary, existing_records_for_source: Vec<CareerRecordRef>, append_reason_ref: CareerAppendReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, append_material_marker: CareerAppendMaterialMarker) -> Self` | 构造 correction append guard | change intent 固定为 correction | `CareerAppendPolicy` | 不覆盖旧记录 |
| `pub fn assert_member_exists(&self) -> Result<(), IdentityDomainError>` | 校验必须依附已建立 member | 使用 `member_exists` | `Ok(())` 或 rejection | member missing 不得 append |
| `pub fn assert_source_trusted(&self) -> Result<(), IdentityDomainError>` | 校验来源可信且可安全摘要 | 使用 `source_summary` | `Ok(())` 或 rejection/pending candidate | 不读取 work body |
| `pub fn assert_not_duplicate(&self) -> Result<(), IdentityDomainError>` | 校验同一 source marker 不新增重复 history | 使用 `existing_records_for_source` | `Ok(())` 或 duplicate surface | duplicate 不新增 `CareerRecord` |
| `pub fn assert_append_only(&self) -> Result<(), IdentityDomainError>` | 拒绝 update/delete/reorder/in-place mutation | 使用 `change_intent` | `Ok(())` 或 rejection | correction 必须 append 新 record |
| `pub fn assert_not_work_truth_write(&self) -> Result<(), IdentityDomainError>` | 拒绝 Project / WorkItem / ProjectMember body 入仓 | 使用 `append_material_marker` | `Ok(())` 或 rejection | forbidden body 不进入 domain truth |
| `pub fn assert_allowed_write_channel(&self) -> Result<(), IdentityDomainError>` | 校验只有正式 command / consumer 可写 career | 使用 `operation_channel` | `Ok(())` 或 rejection | query/job/rebuild 不写 core truth |

```rust
/// Requested career record change intent.
pub enum CareerRecordChangeIntent {
    /// Append a new career record.
    AppendNew,
    /// Append a new correction record.
    AppendCorrection,
    /// Hold source marker for formal review.
    MarkSourcePendingReview,
    /// Forbidden in-place update of an existing record.
    ForbiddenInPlaceUpdate,
    /// Forbidden delete of an existing record.
    ForbiddenDelete,
    /// Forbidden reorder of career history.
    ForbiddenReorder,
}

/// Body-free career append material category.
pub enum CareerAppendMaterialKind {
    /// Safe career summary marker only.
    SafeSummaryMarker,
    /// Work source marker only.
    SourceMarkerOnly,
    /// Correction marker only.
    CorrectionMarkerOnly,
    /// Forbidden Project body was presented.
    ForbiddenProjectBody,
    /// Forbidden WorkItem body was presented.
    ForbiddenWorkItemBody,
    /// Forbidden ProjectMember body was presented.
    ForbiddenProjectMemberBody,
    /// Forbidden artifact or work evidence body was presented.
    ForbiddenArtifactBody,
}

/// Material marker used by career append policy.
pub struct CareerAppendMaterialMarker {
    /// Material category.
    pub material_kind: CareerAppendMaterialKind,
    /// Optional body-free source marker for the material.
    pub source_ref: Option<IdentitySourceRef>,
}
```

| 不变量 / 禁止事项 | 说明 |
|---|---|
| member missing 不得 append | 不从 work source 私下创建 `GlobalMember` |
| duplicate source 不新增 history | duplicate 是 command/consumer surface 或 stored replay,不是 record state |
| correction 只能追加 | 不覆盖、不删除、不重排旧记录 |
| forbidden body 必须 rejected | Project / WorkItem / ProjectMember / artifact body 不进入 truth、trace、outbox、report |
| query/job 不写 core truth | list query、projection rebuild、reconciliation job 不追加 career |

#### 7.11.7 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `CareerSummaryView` | 后移并入 `MemberSummaryView` | 生涯摘要是成员消费摘要读取切片,不是独立 truth | 6.3 `MemberSummaryView`;Step 8 query schema |
| `CareerTraceRecord` | 后移到身份事实消费与追溯 | career accepted append 需要 trace,但 trace 是跨组成部分统一对象 | 6.3 `IdentityTraceRecord`;Step 9 accepted side effect |
| `ProjectParticipationRef` / `WorkSourceRef` | 作为 boundary ref / marker | 它们指向 work-owned source,不是 identity-owned truth | 本批 typed marker;Step 7 resolver |
| `WorkParticipationSourceSummary` | 保留为 resolver safe summary shape | policy 需要可落码输入判断 source trusted / pending / unavailable | 本批字段 shape;Step 7 port 返回 |
| `Project` / `WorkItem` / `ProjectMember` | 排除 | 这些是 `L1-work` truth 或正文 | 不进入 identity Step 6 object |
| work event envelope / consumer entry | 后移 | 属于 Step 8 protocol / worker entry | Step 8 / 6.7 |
| source marker unique key / idempotency stored result | 后移 | 属于 persistence / concurrency | Step 11 / Step 13 |

#### 7.11.8 6.2-d 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.11.1 明确 append、correction、duplicate、pending review、forbidden body |
| 是否有功能到对象映射 | 通过 | §7.11.2 将 typed marker、source summary、truth/state、policy/intent/material 分开 |
| 字段类型是否闭合 | 通过 | `CareerRecordRef`,`ProjectParticipationRef`,`WorkSourceRef`,`CareerSourceMarkerRef`,`CareerSafeSummaryRef`,`CareerAppendReasonRef` 已定义 |
| append-only 是否闭合到对象粒度 | 通过 | `CareerRecord` 不提供 update/delete/reorder;`CareerAppendPolicy` 明确 forbidden intent |
| duplicate 是否误写成 record state | 未误写 | duplicate/no-op 是 command/consumer surface,不是 `CareerRecordStateKind` |
| 是否保存 work truth body | 未保存 | Project / WorkItem / ProjectMember / artifact body 均排除 |
| 是否越过 Step 7~13 | 未越过 | 未定义 resolver/repository/event trait、DTO、flow、DDL、stored result |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.2-e` | 用户审核通过后进入记忆引用关系对象契约 |

#### 7.11.9 6.2-d 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| work source | `WorkSourceRef { source_kind, source_ref }` 且 owner 为 Work | 从 `external_ref` 前缀解析项目 / 任务 / 成员身份 |
| source marker | `CareerSourceMarkerRef` 用于同一 member + work source duplicate 检测 | 把 idempotency key、timestamp 或 source version 当 source marker |
| ordinary append | `CareerRecord::append_from_work_source(...)` 保存 safe summary marker 和 reason | career record 保存 ProjectMember JSON、任务正文或项目私有字段 |
| correction | 追加新 `CorrectionAppended` record,旧记录可标 `SupersededByCorrection` | 原地覆盖旧 record 或删除旧 history |
| duplicate | duplicate source 返回 no-op / stored replay surface,不新增 history | 同一 source marker 再插入一条 `Appended` record |
| pending source | unresolved source 进入 pending/rejected/report-only 分支,不反写 work | resolver 不可用时仍 accepted career append |
| query | `ListCareerRecords` 只读取 append history / view | query 发现缺记录后自动追加 career truth |

### 7.12 6.2-e 记忆引用关系

本批只处理“记忆引用关系” domain core 对象契约,目标是让成员与外部 memory / archive refs 的身份侧关系、引用状态、迁移 / 冷存 marker 和正文排除边界可落码。`MemoryReference` 是 identity-owned reference relation,但 memory body、embedding、index、conversation body、artifact body、archive package、receipt body 和外部 carrier truth 均不属于 identity。

本批允许定义:

- `MemoryReferenceId` / `MemoryReferenceRef`。
- `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef`。
- `MemoryReferenceSourceRef` / `MemoryReferenceReasonRef` / `MemorySafeSummaryRef`。
- `MemoryReferenceSourceSummary` / `MemoryReferenceSourceState` 作为 Step 7 resolver / event mapper 的 body-free 输入 shape。
- `MemoryReference` / `MemoryReferenceState` / `MemoryReferenceStateKind`。
- `MemoryReferencePolicy` / `MemoryReferenceChangeIntent` / `MemoryReferenceChangeMaterialMarker`。

本批不定义:

- memory / archive resolver、repository、handoff adapter 或 event consumer port trait。
- `MaintainMemoryReference` request / result DTO。
- `HandleMemoryReferenceSourceStateChanged` / `HandleArchiveHandoffResult` event envelope。
- `ListMemoryReferences` query view / visibility surface。
- trace handoff `HandoffState`、external target / receipt schema、transaction order、DDL 或 retry strategy。

#### 7.12.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 关联 memory ref | `GlobalMemberRef`, memory source summary, reason, actor, timestamp | `MemoryReference` + `MemoryReferenceState::Linked` | 建立 identity 侧引用关系;不复制 memory body | `MemoryReference`,`MemoryReferenceState`,`MemoryReferencePolicy` | Step 7 member/memory repo + resolver;Step 8 maintain command;Step 9 accepted flow |
| 刷新引用状态 | loaded reference, source summary, reason, actor | `Stale` / `Unavailable` / `Linked` 等状态更新 | 只更新引用状态 marker;不修复外部 carrier | `MemoryReferenceState`,`MemoryReferencePolicy` | Step 9 source state consumer;Step 10 state matrix |
| 记录迁移 / 冷存 | archive ref / handoff marker / result marker | `Migrated` / `Archived` / `HandoffPending` / `HandoffFailed` | 只保存 refs / marker;不保存 archive package | `MemoryReference`,`MemoryReferenceState` | Step 8 archive callback;Step 9 handoff result flow |
| 来源待确认 | pending / unresolved / unavailable summary | `PendingVerification` 或 rejected/degraded surface | 不伪造 completed relation | `MemoryReferenceSourceSummary`,`MemoryReferenceState` | Step 9 pending/rejected;Step 12 degraded/unavailable |
| 排除 memory/archive body | change material marker / DTO precheck | domain rejection | memory body、embedding、index、archive package、receipt body 不入仓 | `MemoryReferencePolicy`,`MemoryReferenceChangeMaterialMarker` | Step 8 schema precheck;Step 12 forbidden body;Step 16 negative tests |

#### 7.12.2 功能到对象映射

| 对象 / 类型 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `MemoryReferenceId` / `MemoryReferenceRef` | 标识 identity-owned memory relation | typed ref | opaque id/ref、同一性比较 | 不从 member/memory/archive ref 拼接 id |
| `MemoryRef` | 指向外部 memory carrier | boundary ref | 包装 memory/archive owned body-free source ref | 不保存 memory body、embedding、index |
| `ArchiveRef` | 指向外部 archive / cold storage carrier | boundary ref | 包装 archive-owned body-free source ref | 不保存 archive package / package metadata |
| `ArchiveHandoffRef` | 指向迁移 / 冷存 handoff marker | handoff marker | 表达 external handoff/result marker identity | 不等于 delivered receipt;不携带 receipt body |
| `MemoryReferenceSourceRef` | 引用关系来源 marker | source marker | 标识 command/source event/handoff result 来源 | 不替代 resolver summary 或 truth cursor |
| `MemorySafeSummaryRef` | 可见 memory/archive 摘要 marker | safe summary ref | 指向 redaction-safe summary | 不保存 summary body |
| `MemoryReferenceReasonRef` | 引用变化原因 marker | reason ref | body-free reason kind + source ref | 不保存 reason text 或 audit note body |
| `MemoryReferenceSourceSummary` | 来源可信性输入 | resolver safe summary shape | 承载 linked/stale/unavailable/pending/handoff result 等 body-free state | 不定义 port,不保存 carrier body |
| `MemoryReference` | 成员与外部 refs 的身份侧关系 | truth / reference relation | 保存 member、memory/archive refs、source、safe summary、state、reason、actor、time | 不拥有外部 carrier truth,不保存正文 |
| `MemoryReferenceState` | 引用状态语义 | state value | 表达 linked、pending、stale、unavailable、migrated、archived、handoff pending/failed | 不等于 6.5 handoff delivery state |
| `MemoryReferencePolicy` | reference guard | policy / guard | 校验 member、reference present、source trusted、body-free、handoff marker、write channel | 不读取 repository、不调用 adapter、不生成 id |
| `MemoryReferenceChangeIntent` / `MemoryReferenceChangeMaterialMarker` | state change 与 forbidden body 输入 | marker / intent | 区分 link/refresh/archive/handoff result 与 forbidden body | 不成为持久 relation truth |

#### 7.12.3 memory/archive typed refs / markers

##### `MemoryReferenceId` / `MemoryReferenceRef`

```rust
/// Stable opaque identifier for an Identity memory reference relation.
pub struct MemoryReferenceId(pub String);

/// Typed reference to an Identity-owned memory reference relation.
pub struct MemoryReferenceRef {
    /// Stable memory reference id.
    pub reference_id: MemoryReferenceId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `MemoryReferenceId.0` | `String` | identity-owned memory relation ID | 来源于 Step 7 id generator 或 accepted migration;非空;opaque |
| `MemoryReferenceRef.reference_id` | `MemoryReferenceId` | 指向 `MemoryReference` truth/relation | 来自 id generator、loaded relation、accepted result;不得临时拼接 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(value: String) -> Result<MemoryReferenceId, ContractError>` | 构造 memory reference id | value 为已分配 opaque id | `Result<MemoryReferenceId, ContractError>` | 校验非空;不生成 id |
| `pub fn from_id(reference_id: MemoryReferenceId) -> MemoryReferenceRef` | 构造 typed ref | 已校验 reference id | `MemoryReferenceRef` | 不读取 repository |
| `pub fn same_reference(&self, other: &MemoryReferenceRef) -> bool` | 判断同一 memory reference | `other` 为另一个 reference ref | `bool` | 只比较 reference id |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| opaque | 不得从 id 解析 member、memory carrier、archive carrier 或 migration 信息 |
| 不由 carrier ref 派生 | memory/archive ref 是外部引用,不是本仓 relation id |
| 不标识外部 memory truth | memory carrier 内部 id 不等于 `MemoryReferenceRef` |

##### `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef`

```rust
/// External memory or archive carrier category.
pub enum MemoryCarrierKind {
    /// Active memory carrier reference.
    Memory,
    /// Archive or cold-storage carrier reference.
    Archive,
    /// Migration or handoff marker.
    ArchiveHandoff,
}

/// Body-free reference to an external memory carrier.
pub struct MemoryRef {
    /// Memory/archive owned source ref.
    pub source_ref: IdentitySourceRef,
}

/// Body-free reference to an external archive or cold-storage carrier.
pub struct ArchiveRef {
    /// Archive-owned source ref.
    pub source_ref: IdentitySourceRef,
}

/// Body-free archive handoff or migration marker.
pub struct ArchiveHandoffRef {
    /// Handoff marker source ref.
    pub source_ref: IdentitySourceRef,
    /// Opaque handoff marker token.
    pub handoff_token: String,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `MemoryRef.source_ref` | `IdentitySourceRef` | 外部 memory carrier 引用 | `source_owner` 必须为 `IdentitySourceOwner::MemoryArchive`;不得保存 memory body |
| `ArchiveRef.source_ref` | `IdentitySourceRef` | 外部 archive / cold storage 引用 | owner 必须为 MemoryArchive;不得保存 package |
| `ArchiveHandoffRef.source_ref` | `IdentitySourceRef` | handoff / migration marker 来源 | owner 必须为 MemoryArchive 或 Identity handoff marker;具体允许组合 Step 7/8 闭口 |
| `ArchiveHandoffRef.handoff_token` | `String` | opaque handoff marker | 非空;不得解析成 receipt/delivery state |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_source(source_ref: IdentitySourceRef) -> Result<MemoryRef, ContractError>` | 构造 memory ref | source ref 来自 resolver / event / request marker | `Result<MemoryRef, ContractError>` | 校验 owner;不读取 body |
| `pub fn from_source(source_ref: IdentitySourceRef) -> Result<ArchiveRef, ContractError>` | 构造 archive ref | source ref 来自 resolver / callback marker | `Result<ArchiveRef, ContractError>` | 校验 owner;不保存 package |
| `pub fn new(source_ref: IdentitySourceRef, handoff_token: String) -> Result<ArchiveHandoffRef, ContractError>` | 构造 handoff marker | source/token 来自 formal handoff/callback marker | `Result<ArchiveHandoffRef, ContractError>` | 校验非空;不代表 delivered |
| `pub fn same_handoff(&self, other: &ArchiveHandoffRef) -> bool` | 判断同一 handoff marker | `other` 为另一个 marker | `bool` | 比较 source + token |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| refs 只表达 carrier identity | 不保存 memory text、embedding、index、archive package、receipt body |
| handoff marker 不等于 delivered receipt | delivered / failed 由后续正式 result marker / Step 6.5 handoff state 承接 |
| 不解析 token | 不从 token 推断 archive target、package、receipt 或完成状态 |
| 不反向定义外部 carrier state | identity 只保存 relation state |

##### `MemoryReferenceSourceRef` / `MemorySafeSummaryRef` / `MemoryReferenceReasonRef`

```rust
/// Body-free source ref for a memory reference change.
pub struct MemoryReferenceSourceRef {
    /// Source category for the memory reference change.
    pub source_kind: MemoryReferenceSourceKind,
    /// Body-free source ref.
    pub source_ref: IdentitySourceRef,
}

/// Source category for memory reference changes.
pub enum MemoryReferenceSourceKind {
    /// Explicit maintain command.
    ManualCommand,
    /// Memory carrier source-state event.
    MemorySourceEvent,
    /// Archive or cold-storage handoff result.
    ArchiveHandoffResult,
    /// Migration-safe import.
    MigrationImport,
    /// Reference refresh or reconciliation marker.
    ReferenceRefreshMarker,
}

/// Body-free reference to a redaction-safe memory/archive summary.
pub struct MemorySafeSummaryRef {
    /// Carrier source this safe summary describes.
    pub source_ref: MemoryReferenceSourceRef,
    /// Opaque safe summary marker.
    pub safe_summary_token: String,
}

/// Body-free reason reference for a memory reference change.
pub struct MemoryReferenceReasonRef {
    /// Reason category.
    pub reason_kind: MemoryReferenceReasonKind,
    /// Body-free reason source.
    pub source_ref: IdentitySourceRef,
}

/// Reason category for memory reference changes.
pub enum MemoryReferenceReasonKind {
    /// Link or refresh requested by command.
    ManualMaintain,
    /// Carrier source state changed.
    SourceStateChanged,
    /// Archive or migration result was received.
    ArchiveHandoffResult,
    /// Source is unavailable or pending verification.
    SourcePendingVerification,
    /// Migration-safe import.
    MigrationImport,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `MemoryReferenceSourceRef.source_kind` | `MemoryReferenceSourceKind` | 来源类别 | 来自 request/event/callback/refresh marker;不得从字符串推断 |
| `MemoryReferenceSourceRef.source_ref` | `IdentitySourceRef` | body-free 来源 marker | owner 必须与 source kind 兼容;不保存正文 |
| `MemorySafeSummaryRef.source_ref` | `MemoryReferenceSourceRef` | safe summary 对应来源 | 必须与 relation/source summary 对齐 |
| `MemorySafeSummaryRef.safe_summary_token` | `String` | redaction-safe summary marker | 非空 opaque token;不保存 summary body |
| `MemoryReferenceReasonRef.reason_kind` | `MemoryReferenceReasonKind` | 引用变化原因类别 | 来自 command/event/callback/migration marker |
| `MemoryReferenceReasonRef.source_ref` | `IdentitySourceRef` | reason 来源 marker | body-free;不得保存 reason text 或 receipt body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn new(source_kind: MemoryReferenceSourceKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 memory reference source ref | kind/source 来自正式输入 | `Result<MemoryReferenceSourceRef, ContractError>` | 不读取 source body |
| `pub fn new(source_ref: MemoryReferenceSourceRef, safe_summary_token: String) -> Result<MemorySafeSummaryRef, ContractError>` | 构造 safe summary ref | source/token 来自 resolver safe summary | `Result<MemorySafeSummaryRef, ContractError>` | 不保存 body |
| `pub fn new(reason_kind: MemoryReferenceReasonKind, source_ref: IdentitySourceRef) -> Result<Self, ContractError>` | 构造 memory reason ref | reason kind/source 来自正式输入 | `Result<MemoryReferenceReasonRef, ContractError>` | 不保存 reason body |
| `pub fn belongs_to_source(&self, source_ref: &MemoryReferenceSourceRef) -> bool` | 判断 safe summary 是否属于来源 | source ref 来自 relation/source summary | `bool` | 只比较 typed source |
| `pub fn is_handoff_result(&self) -> bool` | 判断来源是否 handoff result | 无 | `bool` | 只读 source kind |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source kind 必须显式 | 不得从 external ref 前缀推断 |
| safe summary 不是正文 | 最小 public schema / redaction 留 Step 8/12 |
| reason 不替代 actor/source | reason 解释为什么变化;actor/source 仍是独立字段 |
| refresh marker 不修复 external truth | 只作为 state update 输入 |

#### 7.12.4 `MemoryReferenceSourceSummary`

```rust
/// Body-free source summary for memory/archive reference changes.
pub struct MemoryReferenceSourceSummary {
    /// Memory reference source.
    pub source_ref: MemoryReferenceSourceRef,
    /// Optional memory carrier ref.
    pub memory_ref: Option<MemoryRef>,
    /// Optional archive carrier ref.
    pub archive_ref: Option<ArchiveRef>,
    /// Optional archive handoff marker.
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,
    /// Optional redaction-safe summary marker.
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,
    /// Source state returned by resolver or event mapper.
    pub source_state: MemoryReferenceSourceState,
}

/// Source state for memory/archive reference changes.
pub enum MemoryReferenceSourceState {
    /// Source is trusted and usable for a linked relation.
    Trusted,
    /// Source is stale and requires refresh.
    Stale,
    /// Source cannot currently be resolved.
    Unavailable,
    /// Source requires formal verification before accepted relation.
    PendingVerification,
    /// Archive or migration result is accepted as a marker.
    HandoffResultAccepted,
    /// Archive or migration result failed.
    HandoffResultFailed,
    /// Source is unrecognized or not trusted.
    Untrusted,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_ref` | `MemoryReferenceSourceRef` | 来源 marker | 来自 resolver/event/callback mapper |
| `memory_ref` | `Option<MemoryRef>` | memory carrier ref | body-free;linked/migrated 可用 |
| `archive_ref` | `Option<ArchiveRef>` | archive carrier ref | body-free;archived/migrated 可用 |
| `archive_handoff_ref` | `Option<ArchiveHandoffRef>` | handoff / migration marker | pending/migrated/archived/failed 可用;不代表 delivered |
| `safe_summary_ref` | `Option<MemorySafeSummaryRef>` | redaction-safe summary marker | 不保存 summary body;是否必填由 Step 10/12 闭口 |
| `source_state` | `MemoryReferenceSourceState` | 来源状态 | 来自 Step 7 resolver / event mapper;Step 6 不定义 trait |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_resolver(source_ref: MemoryReferenceSourceRef, memory_ref: Option<MemoryRef>, archive_ref: Option<ArchiveRef>, archive_handoff_ref: Option<ArchiveHandoffRef>, safe_summary_ref: Option<MemorySafeSummaryRef>, source_state: MemoryReferenceSourceState) -> Self` | 从 resolver / event mapper summary 构造 | 入参均为 body-free marker | `MemoryReferenceSourceSummary` | 不保存 external body |
| `pub fn has_reference(&self) -> bool` | 判断是否至少有 memory/archive/handoff ref | 无 | `bool` | 只看 optional refs |
| `pub fn is_trusted(&self) -> bool` | 判断是否可进入 accepted relation 候选 | 无 | `bool` | `Trusted` / `HandoffResultAccepted` 可为 true;完整规则 Step 10 |
| `pub fn requires_verification(&self) -> bool` | 判断是否需要复核 | 无 | `bool` | pending/untrusted/unavailable/stale 可返回 true |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| summary 不是 external truth | 只保存 resolver 可见的 body-free marker |
| 不定义 resolver trait | port、fake 等价语义和错误映射留 Step 7/12 |
| unavailable 不得伪成功 | 不得将缺失 ref/summary silently accepted |
| handoff result marker 不等于 receipt body | receipt/body schema 后移 Step 8/6.5/14 |

#### 7.12.5 `MemoryReference`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.2-e` |
| 所属业务组成部分 | 记忆引用关系 |
| 归属 crate / module | `identity-domain::memory_reference`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 关联 memory ref;刷新引用状态;记录迁移 / 冷存;来源待确认;正文排除 |
| 对象类别 | truth / reference relation |
| 主要责任 | 保存成员与外部 memory/archive refs 的 identity relation,记录引用状态、source、safe summary、reason、actor 和 changed time |
| 不承担什么 | 不保存 memory body、embedding、index、archive package、artifact body、conversation body、receipt body 或 external carrier truth |
| 后续 Step 承接 | Step 7 memory repository/resolver;Step 8 maintain/list/consumer/callback protocol;Step 9 function flow;Step 10 state matrix;Step 11 persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 关联 memory ref | `memory_reference_ref`, `member_ref`, `source_summary`, `reason_ref`, `actor_ref`, `changed_at` | `MemoryReference::link_for_member(...)` | `belongs_to(&self, member_ref) -> bool` | `Linked` | id generator;loaded member;resolver/event summary;metadata;clock |
| 刷新引用状态 | loaded relation, `source_summary`, `reason_ref` | 不适用;调用 update | `update_reference_state(...)` | `Stale` / `Unavailable` / `Linked` | source event / refresh summary |
| 记录 archive / handoff | `archive_ref`, `archive_handoff_ref`, `source_summary` | `from_archive_handoff(...)` 或 update | `attach_archive_ref(...)` | `Migrated` / `Archived` / `HandoffPending` / `HandoffFailed` | archive callback / command marker |
| 来源待确认 | pending/untrusted/unavailable source summary | `MemoryReference::pending_verification(...)` | `requires_verification(&self) -> bool` | `PendingVerification` | resolver/event mapper pending summary |
| body-free 可读性 | optional refs / safe summary | 不适用 | `has_external_body(&self) -> bool` | 不适用 | 恒不保存正文;material precheck 留 policy |

```rust
/// Identity-owned relation between a member and external memory/archive references.
pub struct MemoryReference {
    /// Stable memory reference relation ref.
    pub memory_reference_ref: MemoryReferenceRef,

    /// Member that owns this identity-side relation.
    pub member_ref: GlobalMemberRef,

    /// External memory carrier ref.
    pub memory_ref: Option<MemoryRef>,

    /// External archive carrier ref.
    pub archive_ref: Option<ArchiveRef>,

    /// Archive handoff or migration marker.
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,

    /// Source marker for the current relation state.
    pub source_ref: MemoryReferenceSourceRef,

    /// Redaction-safe memory/archive summary marker.
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,

    /// Current reference state.
    pub reference_state: MemoryReferenceState,

    /// Reason marker for the latest relation change.
    pub change_reason_ref: MemoryReferenceReasonRef,

    /// Actor or controlled source that changed the relation.
    pub changed_by_ref: ActorRef,

    /// Latest relation change time.
    pub changed_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `memory_reference_ref` | `MemoryReferenceRef` | relation 身份 | 来自 Step 7 id generator / accepted migration;不得拼接 |
| `member_ref` | `GlobalMemberRef` | 所属成员 | 必须对应已建立 member;读取面 Step 7 |
| `memory_ref` | `Option<MemoryRef>` | 外部 memory ref | body-free;不保存 memory body |
| `archive_ref` | `Option<ArchiveRef>` | 外部 archive ref | body-free;不保存 package |
| `archive_handoff_ref` | `Option<ArchiveHandoffRef>` | 迁移 / 冷存 handoff marker | 不等于 delivered receipt;不保存 receipt body |
| `source_ref` | `MemoryReferenceSourceRef` | 当前状态来源 marker | 来自 command/event/callback/resolver summary |
| `safe_summary_ref` | `Option<MemorySafeSummaryRef>` | 可见摘要 marker | 不保存 summary body;是否必填留 Step 10/12 |
| `reference_state` | `MemoryReferenceState` | 当前引用状态 | 本批 state value;不得混用 6.5 handoff delivery state |
| `change_reason_ref` | `MemoryReferenceReasonRef` | 变化原因 | 必填;body-free |
| `changed_by_ref` | `ActorRef` | actor / controlled source | 来自 command metadata / event context |
| `changed_at` | `IdentityTimestamp` | 变化时间 | 来自 clock port;不等于 cursor/version |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn link_for_member(memory_reference_ref: MemoryReferenceRef, member_ref: GlobalMemberRef, source_summary: MemoryReferenceSourceSummary, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建成员 memory relation | source summary 来自 resolver/event mapper;actor/time 来自 context | 新 `MemoryReference` | state 为 `Linked` 或 pending;不保存 body |
| `pub fn from_archive_handoff(memory_reference_ref: MemoryReferenceRef, member_ref: GlobalMemberRef, source_summary: MemoryReferenceSourceSummary, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从 archive/handoff marker 创建 relation | source summary 必须包含 archive/handoff marker | 新 `MemoryReference` | state 由 summary 映射;不保存 package/receipt |
| `pub fn belongs_to(&self, member_ref: &GlobalMemberRef) -> bool` | 判断是否属于成员 | member ref 来自 request/query | `bool` | 只比较 typed ref |
| `pub fn attach_archive_ref(&mut self, archive_ref: ArchiveRef, archive_handoff_ref: ArchiveHandoffRef, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 记录 archive / cold storage 引用 | refs 来自正式 callback / command marker | `Ok(())` 或 domain rejection | 不保存 package;不伪造成 delivered |
| `pub fn update_reference_state(&mut self, reference_state: MemoryReferenceState, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, changed_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 更新引用状态 | state 已经 policy 校验 | `Ok(())` 或 rejection | 不读取 external carrier |
| `pub fn requires_verification(&self) -> bool` | 判断是否待确认 | 无 | `bool` | 委托 `reference_state` |
| `pub fn has_external_body(&self) -> bool` | 表达 relation 不携带 external body | 无 | `bool` | 必须恒为 false |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 至少一个外部 ref / marker | memory_ref、archive_ref、archive_handoff_ref 至少一个在 accepted relation 中存在;具体 state 规则 Step 10 |
| 不保存 external body | memory body、embedding、index、archive package、receipt body 均排除 |
| 不混用 handoff delivery state | `HandoffPending` / `HandoffFailed` 是 memory relation state,不是 6.5 `HandoffState::Delivered` |
| query 不创建 relation | `ListMemoryReferences` empty/not visible 不触发 link |

#### 7.12.6 `MemoryReferenceState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.2-e` |
| 所属业务组成部分 | 记忆引用关系 |
| 归属 crate / module | `identity-domain::memory_reference_state` |
| 承接 capability | linked / pending / stale / unavailable / migrated / archived / handoff pending / failed 状态语义 |
| 对象类别 | state value |
| 主要责任 | 表达 memory/archive 引用在 identity 侧的解析、可用性、迁移、冷存和 handoff result 方向 |
| 不承担什么 | 不复制 external carrier 状态机,不保存 archive package metadata,不替代 6.5 trace handoff delivery state |
| 后续 Step 承接 | Step 8 refresh/migrate/callback protocol;Step 9 function flow;Step 10 state matrix;Step 12 degraded/unavailable surface |

```rust
/// Identity-side state for a memory/archive reference relation.
pub struct MemoryReferenceState {
    /// Reference state category.
    pub state_kind: MemoryReferenceStateKind,

    /// Memory carrier ref associated with this state.
    pub memory_ref: Option<MemoryRef>,

    /// Archive carrier ref associated with this state.
    pub archive_ref: Option<ArchiveRef>,

    /// Archive handoff marker associated with this state.
    pub handoff_ref: Option<ArchiveHandoffRef>,

    /// Reason for this state.
    pub reason_ref: Option<MemoryReferenceReasonRef>,

    /// Last state check or transition time.
    pub checked_at: IdentityTimestamp,
}

/// Memory reference state category.
pub enum MemoryReferenceStateKind {
    /// Memory ref is linked to the member relation.
    Linked,
    /// Reference exists but requires formal verification.
    PendingVerification,
    /// External reference may be stale.
    Stale,
    /// External carrier is unavailable or unresolved.
    Unavailable,
    /// Reference has migrated to a new memory/archive marker.
    Migrated,
    /// Reference is archived or cold-stored.
    Archived,
    /// Archive handoff is pending.
    HandoffPending,
    /// Archive handoff failed.
    HandoffFailed,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state_kind` | `MemoryReferenceStateKind` | 引用状态类别 | 本批固定 variant;完整允许矩阵 Step 10 |
| `memory_ref` | `Option<MemoryRef>` | 状态关联 memory ref | linked/migrated 可用;不保存 body |
| `archive_ref` | `Option<ArchiveRef>` | 状态关联 archive ref | archived/migrated 可用;不保存 package |
| `handoff_ref` | `Option<ArchiveHandoffRef>` | handoff marker | pending/failed/migrated/archived 可用;不代表 delivered receipt |
| `reason_ref` | `Option<MemoryReferenceReasonRef>` | 状态原因 | initial linked 可由 relation reason 承接;required 规则 Step 10/11 |
| `checked_at` | `IdentityTimestamp` | 状态确认时间 | 来自 clock port;不等于 cursor/version |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn linked(memory_ref: MemoryRef, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Self` | 创建 linked 状态 | memory ref/reason/time 来自 accepted input | `MemoryReferenceState` | 不保存 body |
| `pub fn pending_verification(memory_ref: Option<MemoryRef>, archive_ref: Option<ArchiveRef>, handoff_ref: Option<ArchiveHandoffRef>, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Self` | 创建待确认状态 | refs 可选但必须至少有一个 marker,完整规则 Step 10 | `MemoryReferenceState` | 不伪成功 |
| `pub fn archived(archive_ref: ArchiveRef, handoff_ref: ArchiveHandoffRef, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Self` | 创建 archived 状态 | archive/handoff 来自 formal marker | `MemoryReferenceState` | 不保存 package |
| `pub fn handoff_failed(handoff_ref: ArchiveHandoffRef, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Self` | 创建 handoff failed 状态 | failed marker 来自 callback/result summary | `MemoryReferenceState` | 不删除 relation |
| `pub fn is_usable_for_summary(&self) -> bool` | 判断是否可进入安全摘要候选 | 无 | `bool` | linked/archived/migrated 可为候选;具体 visibility Step 12 |
| `pub fn requires_refresh(&self) -> bool` | 判断是否需刷新 / 对账 | 无 | `bool` | stale/unavailable/pending/failed 可 true |
| `pub fn is_handoff_terminal(&self) -> bool` | 判断 handoff relation 状态是否终态候选 | 无 | `bool` | archived/handoff failed 可 true;不代表 delivery state |
| `pub fn mark_stale(&mut self, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 stale | reason/time 来自 source event/refresh | `Ok(())` 或 rejection | 不改 external truth |
| `pub fn mark_unavailable(&mut self, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 unavailable | reason/time 来自 resolver/event | `Ok(())` 或 rejection | 不补默认 ref |
| `pub fn mark_migrated(&mut self, memory_ref: Option<MemoryRef>, archive_ref: Option<ArchiveRef>, handoff_ref: ArchiveHandoffRef, reason_ref: MemoryReferenceReasonRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 migrated | refs/marker 来自 formal result | `Ok(())` 或 rejection | 不保存 migration body |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `HandoffPending` 不等于 completed | 不能因请求发送或缺字段 callback 标为 archived/migrated |
| `Archived` 不等于 external owner complete state | 只表示 identity relation 指向 archive ref / marker |
| `Stale` / `Unavailable` 不自动修复 | refresh/reconciliation 不能反写 external carrier truth |
| query surface 不是 state | empty/not_found/not_visible/degraded 不进入 state enum |

#### 7.12.7 `MemoryReferencePolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.2-e` |
| 所属业务组成部分 | 记忆引用关系 |
| 归属 crate / module | `identity-domain::memory_reference_policy` |
| 承接 capability | member guard;reference present guard;source trusted guard;body-free guard;handoff marker guard;write channel guard |
| 对象类别 | policy / guard |
| 主要责任 | 校验 memory/archive relation 变化必须依附已建立成员、正式 body-free source、至少一个 ref/marker,并阻止 external body/package/receipt 泄漏 |
| 不承担什么 | 不读取 repository、不调用 memory/archive adapter、不生成 id、不执行 handoff、不决定 external carrier truth |
| 后续 Step 承接 | Step 7 memory/archive resolver + repository;Step 8 DTO/event/callback schema;Step 9 flow;Step 10 matrix;Step 12 errors |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| member guard | `member_ref`, `member_exists` | `MemoryReferencePolicy::for_link(...)` | `assert_member_exists(&self)` | 不适用 | loaded member read result;Step 7 |
| reference present guard | `source_summary` | `for_link(...)` / `for_archive_handoff(...)` | `assert_reference_present(&self)` | source state | resolver/event/callback summary |
| source trusted guard | `source_summary` | `for_link(...)` | `assert_source_trusted(&self)` | source state | resolver/event mapper |
| body-free guard | `change_material_marker` | `for_link(...)` | `assert_body_free(&self)` | material marker | Step 8 schema precheck |
| handoff marker guard | `archive_handoff_ref` | `for_archive_handoff(...)` | `assert_handoff_marker_body_free(&self)` | handoff marker | callback/command marker |
| owner write guard | `change_material_marker` | all factories | `assert_not_external_owner_write(&self)` | intent/material marker | DTO/event precheck |
| write channel guard | `operation_channel` | all factories | `assert_allowed_write_channel(&self)` | 不适用 | command/consumer/callback context |

```rust
/// Memory reference guard;consumes loaded inputs and body-free source summary only.
pub struct MemoryReferencePolicy {
    /// Member whose memory relation is being changed.
    pub member_ref: GlobalMemberRef,

    /// Whether the member was loaded from Identity truth.
    pub member_exists: bool,

    /// Body-free source summary.
    pub source_summary: MemoryReferenceSourceSummary,

    /// Reason for this change.
    pub reason_ref: MemoryReferenceReasonRef,

    /// Actor or controlled source.
    pub actor_ref: ActorRef,

    /// Operation channel.
    pub operation_channel: IdentityOperationChannel,

    /// Requested change intent.
    pub change_intent: MemoryReferenceChangeIntent,

    /// Body-free material marker.
    pub change_material_marker: MemoryReferenceChangeMaterialMarker,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被维护成员 | 来自 request/event mapper |
| `member_exists` | `bool` | 成员是否已建立 | 来自 Step 7 member repository read;policy 不读取 |
| `source_summary` | `MemoryReferenceSourceSummary` | body-free memory/archive 来源摘要 | 来自 Step 7 resolver/event/callback mapper |
| `reason_ref` | `MemoryReferenceReasonRef` | 变化原因 | 必填;body-free |
| `actor_ref` | `ActorRef` | 发起者 / 受控来源 | command metadata / event context |
| `operation_channel` | `IdentityOperationChannel` | 操作通道 | command/consumer/callback 可进入 guard;query/job 不写 relation |
| `change_intent` | `MemoryReferenceChangeIntent` | 请求变化意图 | link/refresh/archive/handoff result 可候选;external write/delete 必须 rejected |
| `change_material_marker` | `MemoryReferenceChangeMaterialMarker` | material 分类 | Step 8 schema precheck 映射;不得携带 forbidden body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_link(member_ref: GlobalMemberRef, member_exists: bool, source_summary: MemoryReferenceSourceSummary, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, change_material_marker: MemoryReferenceChangeMaterialMarker) -> Self` | 构造 memory link guard | 入参由 application 准备 | `MemoryReferencePolicy` | 不读取 repository、不调用 external |
| `pub fn for_refresh(member_ref: GlobalMemberRef, member_exists: bool, source_summary: MemoryReferenceSourceSummary, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, change_material_marker: MemoryReferenceChangeMaterialMarker) -> Self` | 构造 refresh/state update guard | 同上 | `MemoryReferencePolicy` | 不修复 external truth |
| `pub fn for_archive_handoff(member_ref: GlobalMemberRef, member_exists: bool, source_summary: MemoryReferenceSourceSummary, reason_ref: MemoryReferenceReasonRef, actor_ref: ActorRef, operation_channel: IdentityOperationChannel, change_material_marker: MemoryReferenceChangeMaterialMarker) -> Self` | 构造 archive/handoff result guard | 同上 | `MemoryReferencePolicy` | 不保存 receipt/package |
| `pub fn assert_member_exists(&self) -> Result<(), IdentityDomainError>` | 校验 member 存在 | 使用 `member_exists` | `Ok(())` 或 rejection | member missing 不得 link |
| `pub fn assert_reference_present(&self) -> Result<(), IdentityDomainError>` | 校验至少有 memory/archive/handoff marker | 使用 `source_summary` | `Ok(())` 或 rejection | 缺 ref/marker 不得 accepted |
| `pub fn assert_source_trusted(&self) -> Result<(), IdentityDomainError>` | 校验 source 可用于当前 intent | 使用 `source_summary.source_state` | `Ok(())` 或 rejection/pending | 不读取 external body |
| `pub fn assert_body_free(&self) -> Result<(), IdentityDomainError>` | 拒绝 memory body / embedding / package | 使用 `change_material_marker` | `Ok(())` 或 rejection | forbidden body 不进入 truth |
| `pub fn assert_handoff_marker_body_free(&self) -> Result<(), IdentityDomainError>` | 校验 handoff marker 不携带 receipt/package body | 使用 source summary / material marker | `Ok(())` 或 rejection | pending 不伪成功 |
| `pub fn assert_not_external_owner_write(&self) -> Result<(), IdentityDomainError>` | 阻止 identity 反写 memory/archive owner truth | 使用 change intent/material | `Ok(())` 或 rejection | 不修改 external carrier |
| `pub fn assert_allowed_write_channel(&self) -> Result<(), IdentityDomainError>` | 校验写入通道 | 使用 operation channel | `Ok(())` 或 rejection | query/job/report 不写 relation truth |

```rust
/// Requested memory reference change intent.
pub enum MemoryReferenceChangeIntent {
    /// Link a memory reference.
    LinkMemory,
    /// Refresh relation state from source marker.
    RefreshState,
    /// Attach archive or cold-storage reference.
    AttachArchive,
    /// Record archive handoff result marker.
    RecordArchiveHandoffResult,
    /// Mark relation pending verification.
    MarkPendingVerification,
    /// Forbidden write to external carrier truth.
    ForbiddenExternalOwnerWrite,
    /// Forbidden delete of external memory/archive body.
    ForbiddenExternalBodyDelete,
}

/// Body-free material category for memory reference changes.
pub enum MemoryReferenceChangeMaterialKind {
    /// Safe memory/archive summary marker only.
    SafeSummaryMarker,
    /// Memory or archive refs only.
    ReferenceMarkersOnly,
    /// Archive handoff marker only.
    HandoffMarkerOnly,
    /// Forbidden memory body was presented.
    ForbiddenMemoryBody,
    /// Forbidden embedding or index material was presented.
    ForbiddenEmbeddingOrIndex,
    /// Forbidden archive package or package metadata was presented.
    ForbiddenArchivePackage,
    /// Forbidden artifact, conversation, or receipt body was presented.
    ForbiddenExternalBody,
}

/// Material marker used by memory reference policy.
pub struct MemoryReferenceChangeMaterialMarker {
    /// Material category.
    pub material_kind: MemoryReferenceChangeMaterialKind,
    /// Optional body-free source marker.
    pub source_ref: Option<IdentitySourceRef>,
}
```

| 不变量 / 禁止事项 | 说明 |
|---|---|
| member missing 不得 link | 不从 memory source 私下创建 `GlobalMember` |
| 缺 ref/marker 不得 accepted | 至少需要 memory/archive/handoff marker |
| forbidden body 必须 rejected | memory body、embedding、index、archive package、receipt body 不进入 truth/trace/outbox/report |
| handoff pending 不伪成功 | completed 必须来自 formal result marker,且 delivery state 后续另有对象 |
| query/job/report 不写 relation | 读取、rebuild、reconciliation 不能修复 memory relation truth |

#### 7.12.8 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MemoryReferenceView` | 后移并入 `MemberSummaryView` | memory ref 可见摘要是成员消费摘要切片,不是独立 truth | 6.3 `MemberSummaryView`;Step 8 query schema |
| `MemoryReferenceTraceRecord` | 后移到身份事实消费与追溯 | memory relation/state/handoff result 需要 trace,但 trace 是跨组成部分统一对象 | 6.3 `IdentityTraceRecord`;Step 9 accepted side effect |
| `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef` | 作为 boundary ref / marker | 它们指向 external carrier / handoff marker,不是 identity-owned truth | 本批 typed marker;Step 7 resolver / callback |
| `MemoryReferenceSourceSummary` | 保留为 resolver safe summary shape | policy 需要 body-free 输入判断 source trusted / pending / unavailable / handoff result | 本批字段 shape;Step 7 port 返回 |
| `ReferenceResolutionState` | 后移到派生维护与对账 | 它是跨来源解析状态,不是本批 relation state | 6.4 |
| `HandoffState` / `TraceHandoffIntent` | 后移到 outbox / handoff / propagation | trace/archive handoff delivery 状态与 memory relation state 不同 | 6.5 |
| memory body / embedding / index / archive package / receipt body | 排除 | forbidden body 或 external package | 不进入 identity Step 6 object |
| resolver / event envelope / callback schema / handoff target | 后移 | 属于 Step 7 / Step 8 / config binding | Step 7 / Step 8 / Step 14 |

#### 7.12.9 6.2-e 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.12.1 明确 link、refresh、archive/handoff、pending verification、forbidden body |
| 是否有功能到对象映射 | 通过 | §7.12.2 将 typed marker、source summary、relation/state、policy/intent/material 分开 |
| 字段类型是否闭合 | 通过 | `MemoryReferenceRef`,`MemoryRef`,`ArchiveRef`,`ArchiveHandoffRef`,`MemoryReferenceSourceRef`,`MemorySafeSummaryRef`,`MemoryReferenceReasonRef` 已定义 |
| memory/archive body 是否排除 | 通过 | 正文、embedding、index、archive package、receipt body 均被 forbidden material 覆盖 |
| handoff 是否伪成功 | 未伪成功 | `ArchiveHandoffRef` 只是 marker,`HandoffPending` 不等于 delivered/completed |
| 是否混用 6.5 handoff state | 未混用 | `MemoryReferenceState` 只表达 relation state,`HandoffState` 后移 6.5 |
| 是否越过 Step 7~14 | 未越过 | 未定义 resolver/repository/event/callback trait、DTO、flow、DDL、target/receipt config |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.3` | 用户审核通过后进入 consumption / trace / audit / visibility 对象契约 |

#### 7.12.10 6.2-e 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| memory ref | `MemoryRef { source_ref }` 且 owner 为 MemoryArchive | 在 `MemoryReference` 中保存 memory text、embedding 或检索 index |
| archive ref | `ArchiveRef` 只保存 body-free archive marker | 保存 archive package、package metadata 或 artifact body |
| handoff marker | `ArchiveHandoffRef` 只表示 opaque marker,不代表 delivered | 根据“请求已发送”把 state 改成 `Archived` |
| source summary | `MemoryReferenceSourceSummary` 携带 refs/state/safe summary marker | resolver unavailable 时仍创建 `Linked` 关系 |
| state boundary | `MemoryReferenceState::HandoffPending` 与 6.5 `HandoffState` 分离 | 用 trace handoff delivered 状态覆盖 memory relation state |
| query | `ListMemoryReferences` 只读 relation / state / projection slice | query 发现缺 relation 后自动 link memory ref |
| refresh / reconciliation | refresh 标记 stale/unavailable 或 report-only | maintenance job 直接修复 external memory/archive truth |

### 7.13 6.3 consumption / trace / audit / visibility

本批处理“身份事实消费与追溯”的对象契约,目标是让成员摘要读取、accepted change trace、audit timeline 和 visibility / redaction guard 在 Step 6 内具备可落码字段、状态、函数和不变量。6.3 是 read / trace / audit / visibility 对象批次,不是 query port、projection repository、outbox、handoff 或协议 DTO 批次。

本批允许定义:

- `MemberSummaryViewId` / `MemberSummaryViewRef`、summary slice safe refs 与 `MemberSummaryView`。
- `IdentityTraceRecordId` / `IdentityTraceRecordRef`、`IdentityTraceSubjectRef`、`IdentityChangeKindRef`、`IdentityChangeReasonRef`、`IdentityTraceRecord`。
- `AuditTrailId` / `AuditTrailRef`、`AuditScopeRef`、`AuditCursorRef`、`AuditTrail` 和内嵌 `AuditTrailEntry` value。
- `ConsumerRef`、`VisibilityContextRef`、`VisibilityScopeRef`、`RedactionProfileRef`、`VisibilityResultRef`、`IdentityVisibilityAccessSummary`、`IdentityReadSurfaceKind`、`IdentityReadMaterialMarker` 和 `VisibilityPolicy`。

本批不定义:

- query repository / projection repository / trace repository / audit repository trait。
- `ReadMemberSummary` / `ReadIdentityTrace` / `ReadAuditTrail` request / response DTO。
- projection lookup、view ref 生成 port、trace append transaction、audit pagination SQL。
- outbox payload、handoff intent、event envelope、topic routing 或 publisher。
- 字段级 redaction 完整矩阵;本批只固定 redaction 输入/输出 marker 和禁止事项。

#### 7.13.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 读取成员可见摘要 | member ref、summary slices、projection freshness、visibility access summary | `MemberSummaryView` 或 not visible / degraded surface | 只读;不创建、不刷新、不修复 truth | `MemberSummaryView`,`VisibilityPolicy` | Step 7 query/projection read;Step 8 query DTO;Step 9 query flow;Step 10 query surface |
| 追加 accepted change trace | accepted identity truth change、trace/audit subject refs、change kind、source cursor、actor/time | `IdentityTraceRecord` | append-only trace material;可标记 projection stale / outbox 由后续批次承接 | `IdentityTraceRecord` | Step 7 trace append/read;Step 9 accepted side effect;Step 11 transaction ordering |
| 组装审计时间线 | audit subject/member/scope、trace refs、visibility result、cursor | `AuditTrail` | 读取组装或持久化 timeline marker;不修复 trace | `AuditTrail`,`AuditTrailEntry` | Step 7 audit read;Step 8 audit query;Step 10 trace missing / not visible |
| 应用 visibility / redaction | consumer、actor、scope、access summary、read material marker | visibility result、redacted / not visible / degraded marker | 只影响输出 surface;不改写 truth | `VisibilityPolicy`,`IdentityVisibilityAccessSummary` | Step 7 visibility resolver;Step 8 read surface;Step 12 redaction error |
| 排除 forbidden body | read material marker、trace material marker、summary slices | rejection / redaction / degraded marker | 外部正文不得进入 view/trace/audit/report | `IdentityReadMaterialMarker`,`VisibilityPolicy` | Step 8 DTO schema;Step 12 forbidden body;Step 16 negative tests |

#### 7.13.2 功能到对象映射

| 对象 / 类型 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `MemberSummaryViewId` / `MemberSummaryViewRef` | 标识成员摘要 read model | typed ref | opaque view identity、同一性比较 | 不从 member id、projection cursor 或 query 参数临时拼接 |
| `MemberAnchorSafeSummaryRef` / `LifecycleSafeSummaryRef` / `MemberSummarySliceRef` | summary slice marker | safe summary marker | 绑定 anchor/lifecycle/role/career/memory 的可见摘要 slice | 不保存 slice body、不替代业务 truth |
| `MemberSummaryView` | 读取成员可见摘要 | projection / read model | 聚合 body-free summary refs、visibility result、freshness/cursor marker | 不创建 truth、不触发 rebuild、不保存 consumer 私有状态 |
| `IdentityTraceRecordRef` | 标识 trace material | typed ref | opaque trace identity | 不等于 log id、outbox id 或 event id |
| `IdentityTraceSubjectRef` / `IdentityAuditSubjectRef` | trace/audit canonical subject | subject marker | 从 typed truth ref 映射成稳定 subject | 不由实现拼字符串;具体 mapper Step 7 |
| `IdentityChangeKindRef` / `IdentityChangeReasonRef` | change kind / reason marker | marker / reason ref | 表达变化类别与安全原因 | 不保存原因正文、debug note 或 audit log body |
| `IdentityTraceRecord` | 追加 accepted change trace | trace / history record | 记录 member、subject、change kind、source cursor、actor/time 和 safe markers | 不替代业务 truth、不保存 forbidden body、不原地覆盖 |
| `AuditTrailRef` / `AuditScopeRef` / `AuditCursorRef` | audit timeline identity/scope/cursor | audit markers | 标识审计时间线、读取范围和分页 cursor | cursor 不等于 truth cursor;scope 不改写 trace |
| `AuditTrail` / `AuditTrailEntry` | 组装审计时间线 | audit / history aggregate | 组织 trace refs、scope、visibility 和 read surface | 不保存 raw log、不修复缺失 trace |
| `ConsumerRef` / `VisibilityContextRef` / `VisibilityScopeRef` | visibility 输入 marker | boundary refs | 表达消费方、上下文和读取范围 | 不保存 consumer 私有权限状态 |
| `VisibilityResultRef` / `IdentityReadSurfaceKind` | read surface marker | public marker | 表达 found/not_found/not_visible/redacted/stale/degraded/empty | 不成为业务 truth state |
| `IdentityVisibilityAccessSummary` | visibility policy 输入 | resolver safe summary shape | 承载已解析的 read subject、scope、可见性 / redaction 结果 | 不定义 resolver port;不查询外部授权 |
| `IdentityReadMaterialMarker` | read/trace/audit material 分类 | material marker | 区分 safe marker 与 forbidden body | 不携带正文;forbidden 必须被 policy 拦截 |
| `VisibilityPolicy` | 应用 visibility/redaction 与 forbidden body guard | policy / guard | 校验 summary/trace/audit/event material 可见性和 body-free | 不读取 repository、不调用授权系统、不写 truth |

#### 7.13.3 consumption / trace / audit typed refs 与 marker

##### `MemberSummaryViewId` / `MemberSummaryViewRef`

```rust
/// Stable opaque identifier for an Identity member summary view.
pub struct MemberSummaryViewId(pub String);

/// Typed reference to an Identity member summary view.
pub struct MemberSummaryViewRef {
    /// Stable summary view id.
    pub view_id: MemberSummaryViewId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `MemberSummaryViewId.0` | `String` | summary view opaque id | 来源于正式 projection builder / repository lookup / id generator;不得由 query 临时拼接 |
| `view_id` | `MemberSummaryViewId` | typed view ref | 只表达 summary view identity,不表达 freshness 或 visibility |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| view ref 不可拼接 | 不允许 `member-summary:<member_id>`、cursor、query 参数或 consumer id 临时构造 |
| view ref 不等于 member ref | 一个 member 可以有不同 scope/profile 下的 projection/read marker,不能混用 |
| view ref 不表达 visible | 可见性由 `VisibilityResultRef` / `IdentityReadSurfaceKind` 表达 |

##### summary slice refs

```rust
/// Safe summary marker for the identity anchor slice.
pub struct MemberAnchorSafeSummaryRef {
    /// Body-free source marker for the anchor summary slice.
    pub source_ref: IdentitySourceRef,
}

/// Safe summary marker for the lifecycle slice.
pub struct LifecycleSafeSummaryRef {
    /// Body-free source marker for the lifecycle summary slice.
    pub source_ref: IdentitySourceRef,
}

/// Member summary slice category.
pub enum MemberSummarySliceKind {
    /// Anchor slice.
    Anchor,
    /// Lifecycle slice.
    Lifecycle,
    /// Role and capability slice.
    RoleCapability,
    /// Career slice.
    Career,
    /// Memory reference slice.
    MemoryReference,
}

/// Body-free reference to a member summary slice.
pub struct MemberSummarySliceRef {
    /// Slice category.
    pub slice_kind: MemberSummarySliceKind,
    /// Member that owns this slice.
    pub member_ref: GlobalMemberRef,
    /// Body-free safe summary source for the slice.
    pub safe_summary_source_ref: IdentitySourceRef,
}
```

| 字段 / 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `MemberAnchorSafeSummaryRef.source_ref` | anchor safe summary marker | 来自 accepted anchor fact / projection builder;不保存 account/runtime body |
| `LifecycleSafeSummaryRef.source_ref` | lifecycle safe summary marker | 来自 accepted lifecycle fact / projection builder;不保存 governance basis body |
| `MemberSummarySliceKind` | slice 分类 | 固定 anchor/lifecycle/role/career/memory 五类;不得由字符串前缀推断 |
| `MemberSummarySliceRef.member_ref` | slice 所属 member | 必须与 view member 一致 |
| `MemberSummarySliceRef.safe_summary_source_ref` | slice 安全来源 | 指向 body-free source/safe summary marker;不保存正文 |

##### trace / audit subject refs

```rust
/// Subject category for Identity trace material.
pub enum IdentityTraceSubjectKind {
    /// Global member anchor subject.
    Member,
    /// Lifecycle state subject.
    Lifecycle,
    /// Role capability summary subject.
    RoleCapabilitySummary,
    /// Career record subject.
    CareerRecord,
    /// Memory reference subject.
    MemoryReference,
    /// Projection or derived marker subject.
    ProjectionMarker,
}

/// Canonical subject for Identity trace material.
pub struct IdentityTraceSubjectRef {
    /// Subject category.
    pub subject_kind: IdentityTraceSubjectKind,
    /// Opaque canonical subject marker.
    pub subject_ref: IdentitySourceRef,
}

/// Canonical subject for Identity audit trail material.
pub struct IdentityAuditSubjectRef {
    /// Subject category aligned with trace subject kind.
    pub subject_kind: IdentityTraceSubjectKind,
    /// Opaque canonical audit subject marker.
    pub audit_subject_ref: IdentitySourceRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `subject_kind` | `IdentityTraceSubjectKind` | 变化主语分类 | 只能从 typed truth ref 所属对象确定;不得解析字符串 |
| `subject_ref` | `IdentitySourceRef` | trace canonical subject marker | 由 Step 7 subject mapper 从 `GlobalMemberRef` / `RoleCapabilitySummaryRef` / `CareerRecordRef` / `MemoryReferenceRef` 等映射 |
| `audit_subject_ref` | `IdentitySourceRef` | audit canonical subject marker | 与 trace subject 同源 mapper 生成,但 typed ref 独立,不能互相强转 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| mapper 是正式来源 | service / fake / durable 必须通过 Step 7 mapper,不得手写 `member:<id>`、`career:<id>` |
| audit subject 不从 trace 字符串切割 | 若 audit 与 trace subject 同值,也必须由 mapper 明文返回两个 typed refs |
| projection marker 不是 core truth | `ProjectionMarker` 只能解释派生 marker,不得反写业务 truth |

##### trace / audit / visibility markers

```rust
/// Stable opaque identifier for an Identity trace record.
pub struct IdentityTraceRecordId(pub String);

/// Typed reference to an Identity trace record.
pub struct IdentityTraceRecordRef {
    /// Stable trace record id.
    pub trace_record_id: IdentityTraceRecordId,
}

/// Stable opaque identifier for an audit trail.
pub struct AuditTrailId(pub String);

/// Typed reference to an audit trail.
pub struct AuditTrailRef {
    /// Stable audit trail id.
    pub audit_trail_id: AuditTrailId,
}

/// Body-free change kind marker.
pub struct IdentityChangeKindRef {
    /// Change kind category.
    pub change_kind: IdentityChangeKind,
    /// Optional body-free source marker for versioned change kinds.
    pub source_ref: Option<IdentitySourceRef>,
}

/// Identity accepted change category.
pub enum IdentityChangeKind {
    /// Member anchor was established or held.
    MemberAnchorChanged,
    /// Lifecycle state changed.
    LifecycleChanged,
    /// Role capability summary changed.
    RoleCapabilitySummaryChanged,
    /// Career record was appended or corrected.
    CareerRecordChanged,
    /// Memory reference changed.
    MemoryReferenceChanged,
    /// Trace correction was appended.
    TraceCorrectionAppended,
    /// Derived marker changed without creating core truth.
    DerivedMarkerChanged,
}

/// Body-free reason marker for identity trace/audit changes.
pub struct IdentityChangeReasonRef {
    /// Reason source marker.
    pub source_ref: IdentitySourceRef,
}
```

```rust
/// Consumer or downstream boundary requesting identity facts.
pub struct ConsumerRef {
    /// Opaque consumer marker.
    pub source_ref: IdentitySourceRef,
}

/// Visibility context marker supplied by query, event, or handoff boundary.
pub struct VisibilityContextRef {
    /// Opaque visibility context marker.
    pub source_ref: IdentitySourceRef,
}

/// Scope of fields or subjects covered by a visibility check.
pub struct VisibilityScopeRef {
    /// Opaque visibility scope marker.
    pub source_ref: IdentitySourceRef,
}

/// Redaction profile marker.
pub struct RedactionProfileRef {
    /// Opaque redaction profile marker.
    pub source_ref: IdentitySourceRef,
}

/// Visibility decision/result marker.
pub struct VisibilityResultRef {
    /// Opaque visibility result marker.
    pub source_ref: IdentitySourceRef,
}

/// Body-free redaction marker used by public query surfaces.
pub struct IdentityRedactionMarkerRef {
    /// Opaque redaction marker.
    pub source_ref: IdentitySourceRef,
}

/// Body-free degraded marker used by public query/rejection/job-safe surfaces.
pub struct IdentityDegradedMarkerRef {
    /// Opaque degraded marker.
    pub source_ref: IdentitySourceRef,
}

/// Public degraded category. Variants are safe to expose and never carry raw errors.
pub enum IdentityDegradedKind {
    DependencyUnavailable,
    SourceUnavailable,
    ProjectionStale,
    ProjectionRebuilding,
    MaterialUnsafe,
    PartialResult,
    AdapterUnavailable,
    Disabled,
}

/// Audit read scope marker.
pub struct AuditScopeRef {
    /// Opaque audit scope marker.
    pub source_ref: IdentitySourceRef,
}

/// Audit pagination cursor marker.
pub struct AuditCursorRef {
    /// Opaque audit cursor marker.
    pub source_ref: IdentitySourceRef,
}
```

| marker | 作用 | 约束 / 来源 |
|---|---|---|
| `IdentityTraceRecordRef` | trace identity | 来源于 Step 7 id generator;不等于 log id / event id |
| `AuditTrailRef` | audit timeline identity | 来源于 Step 7 id generator 或 repository lookup;不得从 audit subject 私下拼接 |
| `IdentityChangeKindRef` | accepted change 分类 | change kind 为固定 enum;可选 source marker 只表达来源,不保存正文 |
| `IdentityChangeReasonRef` | trace/audit reason | body-free;可指向 anchor/lifecycle/career/memory reason source |
| `ConsumerRef` | 读取或订阅方 | boundary ref;不保存 consumer 私有权限体 |
| `VisibilityContextRef` | 可见性上下文 | 来自 query metadata/event/handoff context;不等于 actor |
| `VisibilityScopeRef` | 可见性范围 | 字段级矩阵后移 Step 8/12;本批只固定 typed marker |
| `RedactionProfileRef` | 裁剪配置 marker | 配置绑定后移 Step 14;不得在对象内保存配置 body |
| `VisibilityResultRef` | 可见性结果 | 由 policy / resolver summary 形成;不表达 truth state |
| `IdentityRedactionMarkerRef` | public redaction marker | 来自 redaction matrix / visibility decision;不保存 policy body、denied raw reason 或字段正文 |
| `IdentityDegradedMarkerRef` | public degraded marker | 来自 resolver/dependency/projection safe summary;不保存 raw external error、stack trace 或 secret |
| `AuditScopeRef` | audit 范围 | query/read 时来自 audit request;accepted write 创建 trail 时来自 Step 7 accepted audit trail marker mapper;不得改变 trace truth 顺序 |
| `AuditCursorRef` | audit 分页 cursor | 不等于 `IdentityTruthCursor` |

##### visibility access summary / read material

```rust
/// Visibility access state from a resolver or prepared context.
pub enum IdentityVisibilityAccessState {
    /// Subject is visible without redaction.
    Visible,
    /// Subject is visible only after redaction.
    Redacted,
    /// Subject is not visible.
    NotVisible,
    /// Visibility check is partial or degraded.
    Degraded,
    /// Visibility dependency is unavailable.
    Unavailable,
}

/// Prepared visibility input consumed by VisibilityPolicy.
pub struct IdentityVisibilityAccessSummary {
    /// Canonical read subject resolved for this query/read target.
    pub read_subject_ref: IdentityReadSubjectRef,
    /// Consumer requesting the material.
    pub consumer_ref: ConsumerRef,
    /// Optional actor represented by the request.
    pub actor_ref: Option<ActorRef>,
    /// Visibility context marker.
    pub visibility_context_ref: VisibilityContextRef,
    /// Visibility scope marker.
    pub scope_ref: VisibilityScopeRef,
    /// Access state.
    pub access_state: IdentityVisibilityAccessState,
    /// Optional redaction profile marker.
    pub redaction_profile_ref: Option<RedactionProfileRef>,
    /// Optional public redaction marker copied into query surface when redacted/not-visible material requires one.
    pub redaction_marker_ref: Option<IdentityRedactionMarkerRef>,
    /// Body-free result marker.
    pub visibility_result_ref: VisibilityResultRef,
    /// Optional body-free degraded marker copied into degraded-like public surface.
    pub degraded_marker_ref: Option<IdentityDegradedMarkerRef>,
    /// Optional safe degraded classifier copied into public degraded surface.
    pub degraded_kind: Option<IdentityDegradedKind>,
}
```

Access summary degraded-source rule:

| access_state | 必填 marker | 说明 |
|---|---|---|
| `Visible` | `visibility_result_ref` | 可见性结果来自正式 resolver / prepared context。 |
| `Redacted` | `visibility_result_ref`;`redaction_marker_ref` | redaction marker 来自同一 resolver summary 或 redaction matrix。 |
| `NotVisible` | `visibility_result_ref`;not-visible 所需 `redaction_marker_ref` | 不可见仍必须有 body-free visibility result,不得用 missing/empty 代替。 |
| `Degraded` | `visibility_result_ref`;`degraded_marker_ref`;`degraded_kind` | resolver / dependency / projection safe summary 必须给出 public degraded marker 来源。 |
| `Unavailable` | `visibility_result_ref`;`degraded_marker_ref`;`degraded_kind` | dependency unavailable 仍返回 safe access summary,不得让 query service 合成 marker。 |

`IdentityReadVisibilityRepository.resolve_*_read(...)` 对合法 typed read request 不得用 `None` 表达 dependency unavailable、source unavailable、projection unavailable、redaction matrix unavailable 或 policy degraded。上述情况必须返回 `Some(IdentityVisibilityAccessSummary { access_state: Degraded | Unavailable, visibility_result_ref, degraded_marker_ref: Some(...), degraded_kind: Some(...) })`。`None` 仅保留给 resolver 无法形成 canonical read subject / scope 的非可读请求或 malformed selector 分支;query service 在该分支只能返回 entry validation / malformed query surface,不得私造 `VisibilityResultRef`、`IdentityDegradedMarkerRef` 或 `IdentityVisibilityDecision`。

```rust
/// Public read surface category.
pub enum IdentityReadSurfaceKind {
    /// Material is found and visible.
    Found,
    /// Material does not exist or projection is missing.
    NotFound,
    /// Material exists but is not visible to the requester.
    NotVisible,
    /// Material is returned with redaction.
    Redacted,
    /// Material exists but freshness is stale.
    Stale,
    /// Material can only be returned in degraded form.
    Degraded,
    /// Result set is empty.
    Empty,
}

/// Material category for read/trace/audit output.
pub enum IdentityReadMaterialKind {
    /// Safe summary refs only.
    SafeSummaryRefs,
    /// Trace refs and safe markers only.
    TraceRefsOnly,
    /// Audit refs and safe markers only.
    AuditRefsOnly,
    /// Redacted safe material.
    RedactedSafeMaterial,
    /// Forbidden external body.
    ForbiddenExternalBody,
    /// Forbidden raw log or debug body.
    ForbiddenRawDiagnostic,
    /// Forbidden secret or credential material.
    ForbiddenSecret,
}

/// Body-free read material marker consumed by VisibilityPolicy.
pub struct IdentityReadMaterialMarker {
    /// Material category.
    pub material_kind: IdentityReadMaterialKind,
    /// Optional source marker.
    pub source_ref: Option<IdentitySourceRef>,
}

/// Body-free degraded summary for query-internal material/projection integrity failures.
pub struct IdentityQueryMaterialDegradationSummary {
    /// Public degraded marker copied into query degraded surface.
    pub degraded_marker_ref: IdentityDegradedMarkerRef,
    /// Safe public degraded classifier.
    pub degraded_kind: IdentityDegradedKind,
    /// Read subject copied from the already-resolved access summary.
    pub read_subject_ref: IdentityReadSubjectRef,
    /// Visibility scope copied from the already-resolved access summary.
    pub visibility_scope_ref: VisibilityScopeRef,
    /// Read surface affected by this material degradation.
    pub read_surface_kind: IdentityReadSurfaceKind,
    /// Safe material marker that triggered the degradation, when available.
    pub read_material_marker: Option<IdentityReadMaterialMarker>,
}
```

| 不变量 / 禁止事项 | 说明 |
|---|---|
| access summary 不等于 port | 本批只定义 policy 输入 shape,读取面 / resolver trait 留 Step 7 |
| `NotVisible` 不等于 `NotFound` | public surface 可以按 Step 8/12 裁剪,但内部契约必须区分 |
| `Redacted` 是 read surface | 不原地修改 `IdentityTraceRecord` 或 `MemberSummaryView` truth/projection |
| forbidden material 必须拦截 | 外部正文、raw log、secret 不进入 view/trace/audit/report/outbox |
| query material degraded marker 必须有正式 summary | loaded view missing、projection integrity violation、member summary stale/degraded but missing freshness marker、career/memory list item missing/member mismatch、partial trace/audit item missing、forbidden read material 等 query 内部检测分支必须先由 Step 7 `IdentityQueryMaterialDegradationMapper` 生成 `IdentityQueryMaterialDegradationSummary`;query service 只能复制 `degraded_marker_ref` / `degraded_kind`,不得从 view ref、record ref、memory reference ref、trace ref、scope、error string 或 fake 私有规则合成 |

`IdentityQueryMaterialDegradationSummary` 只用于 query 已经取得合法 `IdentityVisibilityAccessSummary` 后,在加载 projection / career / memory / trace / audit material 时发现 material missing、owner/scope/subject/member mismatch、unsafe/forbidden material、loaded member summary stale/degraded but missing `projection_freshness_ref` 或 partial item missing 的分支。它不替代 visibility resolver:resolver dependency unavailable / policy degraded 仍必须通过 `IdentityVisibilityAccessSummary { access_state: Degraded | Unavailable, degraded_marker_ref, degraded_kind }` 表达。它也不保存 raw projection body、career body、memory body、trace body、audit entry body、adapter error、stack trace、credential 或 secret。

#### 7.13.4 `MemberSummaryView`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.3` |
| 所属业务组成部分 | 身份事实消费与追溯 |
| 归属 crate / module | `identity-contracts::views`;必要 marker 来自 `identity-contracts::refs` |
| 承接 capability | 读取成员可见摘要;应用 visibility/redaction;暴露 stale/degraded/not visible surface;排除外部正文 |
| 对象类别 | projection / read model |
| 主要责任 | 聚合成员锚点、生命周期、角色能力、生涯和 memory reference 的 body-free safe summary refs,并携带 visibility / freshness marker |
| 不承担什么 | 不创建 truth、不触发 projection rebuild、不读取 repository、不保存 consumer 私有状态、不保存外部正文 |
| 后续 Step 承接 | Step 7 projection/query read;Step 8 query result schema;Step 9 `ReadMemberSummary` flow;Step 10 query surface;Step 11 projection storage |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| member summary identity | `view_ref`, `member_ref`, `visibility_scope_ref` | `MemberSummaryView::from_projection(...)` | `belongs_to(...)`, `matches_visibility_scope(...)` | 不适用 | projection builder / repository lookup;member truth;read visibility summary |
| slice aggregation | `anchor_slice_ref`, `lifecycle_slice_ref`, role/career/memory slices | `from_projection(...)` | `has_required_slices()` | 不适用 | accepted truth safe summary refs / projection builder |
| visibility surface | `visibility_result_ref`, `read_surface_kind` | `visible(...)` / `not_visible(...)` / `degraded(...)` | `is_visible()` | `IdentityReadSurfaceKind` | `VisibilityPolicy` output |
| freshness marker | `source_cursor_ref`, `freshness_marker` | `from_projection(...)` / `stale(...)` | `is_stale_or_degraded()` | `Stale` / `Degraded` surface | projection state / committed truth scan;not query |
| body-free guard | `read_material_marker` | all factories | `assert_body_free()` | material kind | projection/read assembler precheck |

```rust
/// Member-facing identity summary view built from body-free safe summary refs.
pub struct MemberSummaryView {
    /// Stable summary view ref.
    pub view_ref: MemberSummaryViewRef,

    /// Member represented by this summary.
    pub member_ref: GlobalMemberRef,

    /// Visibility scope for which this summary view was materialized.
    pub visibility_scope_ref: VisibilityScopeRef,

    /// Anchor safe summary slice.
    pub anchor_slice_ref: MemberSummarySliceRef,

    /// Lifecycle safe summary slice.
    pub lifecycle_slice_ref: MemberSummarySliceRef,

    /// Optional role/capability safe summary slices.
    pub role_capability_slice_refs: Vec<MemberSummarySliceRef>,

    /// Career safe summary slices.
    pub career_slice_refs: Vec<MemberSummarySliceRef>,

    /// Memory reference safe summary slices.
    pub memory_slice_refs: Vec<MemberSummarySliceRef>,

    /// Visibility result for this read surface.
    pub visibility_result_ref: VisibilityResultRef,

    /// Public read surface category.
    pub read_surface_kind: IdentityReadSurfaceKind,

    /// Optional committed truth cursor covered by this projection.
    pub source_cursor_ref: Option<IdentityTruthCursor>,

    /// Public freshness marker copied into StaleVisible query surfaces.
    pub projection_freshness_ref: Option<ProjectionFreshnessMarkerRef>,

    /// Read material marker used to prevent forbidden bodies.
    pub read_material_marker: IdentityReadMaterialMarker,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_ref` | `MemberSummaryViewRef` | view 身份 | 来源于正式 projection builder / lookup;不得 query 拼接 |
| `member_ref` | `GlobalMemberRef` | summary 所属成员 | 来自 loaded member truth / projection row;必须与 slices 一致 |
| `visibility_scope_ref` | `VisibilityScopeRef` | summary lookup scope 维度 | 来自 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)` 或同等正式 read visibility summary;`save_member_summary_view(...)` 必须用它写入 `(member_ref, visibility_scope_ref)` index;不得从 `visibility_result_ref`、route、member id 或 view id 反推 |
| `anchor_slice_ref` | `MemberSummarySliceRef` | anchor safe slice | 来自 accepted anchor fact / projection builder |
| `lifecycle_slice_ref` | `MemberSummarySliceRef` | lifecycle safe slice | 来自 accepted lifecycle fact / projection builder;不保存 governance basis body |
| `role_capability_slice_refs` | `Vec<MemberSummarySliceRef>` | role/capability 摘要切片 | 来自 `RoleCapabilitySummary` safe marker;不保存 method body |
| `career_slice_refs` | `Vec<MemberSummarySliceRef>` | career 摘要切片 | 来自 `CareerSafeSummaryRef`;不保存 work body |
| `memory_slice_refs` | `Vec<MemberSummarySliceRef>` | memory reference 摘要切片 | 来自 `MemorySafeSummaryRef`;不保存 memory/archive body |
| `visibility_result_ref` | `VisibilityResultRef` | 本次可见性结果 | 来自 `VisibilityPolicy` / prepared access summary |
| `read_surface_kind` | `IdentityReadSurfaceKind` | public read surface | found/not_found/not_visible/redacted/stale/degraded/empty |
| `source_cursor_ref` | `Option<IdentityTruthCursor>` | projection 覆盖的 committed truth cursor | 来自 projection builder / committed truth scan;不得用 timestamp/version/query cursor |
| `projection_freshness_ref` | `Option<ProjectionFreshnessMarkerRef>` | public freshness marker | 由 projection builder / rebuild job 从 `ProjectionState` 或同等正式 freshness source 复制;`ReadMemberSummaryFlow` 只复制 loaded view 字段,不得从 `view_ref` 反推 projection state;loaded view stale/degraded 但该字段缺失时,必须通过 Step 7 `member_summary_view_missing_freshness(...)` 返回 `Degraded` |
| `read_material_marker` | `IdentityReadMaterialMarker` | read material 分类 | safe summary refs only;forbidden body 必须被拒绝或降级 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_projection(view_ref: MemberSummaryViewRef, member_ref: GlobalMemberRef, visibility_scope_ref: VisibilityScopeRef, anchor_slice_ref: MemberSummarySliceRef, lifecycle_slice_ref: MemberSummarySliceRef, role_capability_slice_refs: Vec<MemberSummarySliceRef>, career_slice_refs: Vec<MemberSummarySliceRef>, memory_slice_refs: Vec<MemberSummarySliceRef>, visibility_result_ref: VisibilityResultRef, source_cursor_ref: Option<IdentityTruthCursor>, projection_freshness_ref: Option<ProjectionFreshnessMarkerRef>, read_material_marker: IdentityReadMaterialMarker) -> Result<Self, IdentityDomainError>` | 从正式 projection/read assembler 输入构造 summary | 所有 slice 已经是 body-free safe refs;scope 已来自正式 read visibility summary;freshness marker 已由 projection builder / rebuild job 准备 | `MemberSummaryView` | 不读取 repository、不触发 rebuild |
| `pub fn not_visible(view_ref: MemberSummaryViewRef, member_ref: GlobalMemberRef, visibility_scope_ref: VisibilityScopeRef, visibility_result_ref: VisibilityResultRef) -> Self` | 构造 not visible surface | scope 来自正式 read visibility summary;不携带不可见字段 | `MemberSummaryView` | `read_surface_kind = NotVisible`;仍写入可校验的 `(member_ref, visibility_scope_ref)` 维度 |
| `pub fn degraded(view_ref: MemberSummaryViewRef, member_ref: GlobalMemberRef, visibility_scope_ref: VisibilityScopeRef, visibility_result_ref: VisibilityResultRef, source_cursor_ref: Option<IdentityTruthCursor>, projection_freshness_ref: Option<ProjectionFreshnessMarkerRef>) -> Self` | 构造 degraded surface | scope 来自正式 read visibility summary;可携带 body-free cursor / freshness marker | `MemberSummaryView` | 不修复 projection;不得从 `visibility_result_ref` 反推 scope |
| `pub fn belongs_to(&self, member_ref: &GlobalMemberRef) -> bool` | 判断 view 是否属于成员 | member ref 来自 query | `bool` | 只比较 typed ref |
| `pub fn matches_visibility_scope(&self, visibility_scope_ref: &VisibilityScopeRef) -> bool` | 判断 view 是否属于 lookup scope | scope 来自 read visibility summary | `bool` | 只比较 typed ref;不解析 visibility result |
| `pub fn has_required_slices(&self) -> bool` | 判断 anchor/lifecycle 基础 slice 是否存在 | 无 | `bool` | 不触发补建 |
| `pub fn is_visible(&self) -> bool` | 判断 surface 是否 visible/redacted | 无 | `bool` | not visible 返回 false |
| `pub fn is_stale_or_degraded(&self) -> bool` | 判断 freshness / degraded surface | 无 | `bool` | 不改变 projection state |
| `pub fn assert_body_free(&self) -> Result<(), IdentityDomainError>` | 拒绝 forbidden read material | 使用 `read_material_marker` | `Ok(())` 或 rejection/degraded | 不输出 body |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query no-write | summary read 不创建 member、不刷新 source、不重建 projection、不补 trace |
| stable view ref 来源必须正式 | Step 7/11 必须给 projection lookup / builder 来源,实现不得拼接 |
| slices 必须 body-free | 只保存 safe summary refs / markers,不保存 role/work/memory/body |
| stale/degraded 显式返回 | 不把 stale projection 伪装成 fresh found |
| not visible 不泄露 | 不通过空字段、debug marker 或 diagnostic 泄露不可见原因正文 |

#### 7.13.5 `IdentityTraceRecord`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.3` |
| 所属业务组成部分 | 身份事实消费与追溯 |
| 归属 crate / module | `identity-domain::trace` 或 `identity-contracts::trace` value;ref 在 `identity-contracts::refs` |
| 承接 capability | 追加 accepted change trace;按 subject / change kind 查询;redaction read surface;trace correction append-only |
| 对象类别 | trace / history record |
| 主要责任 | 为 accepted identity fact 或正式 derived marker 追加安全追溯 material,绑定 member、subject、audit subject、change kind、source cursor、actor/time 和 body-free markers |
| 不承担什么 | 不替代业务 truth、不保存 raw log/debug/body、不作为 event sourcing log、不修复历史 |
| 后续 Step 承接 | Step 7 trace repository / subject mapper;Step 8 trace query / accepted side effect;Step 9 function flow;Step 11 transaction;Step 12 redaction |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| accepted trace append | `trace_record_ref`, `member_ref`, `subject_ref`, `change_kind_ref`, `source_cursor_ref` | `from_accepted_change(...)` | `matches_subject(...)` | `Appended` | id generator;accepted truth change;subject mapper;cursor source |
| audit subject linkage | `audit_subject_ref` | `from_accepted_change(...)` | `matches_audit_subject(...)` | 不适用 | subject mapper;not string |
| redacted read surface | `visibility_result_ref`, `read_material_marker` | `redacted_read_surface(...)` | `redact_for(...)` | read surface only | `VisibilityPolicy` |
| correction explanation | `superseded_by_trace_ref` | `mark_superseded_by_correction(...)` | `is_superseded()` | `SupersededByCorrection` | formal correction trace |
| body-free guard | `reason_ref`, `source_ref`, `basis_ref`, `read_material_marker` | all factories | `assert_body_free()` | material kind | accepted change material precheck |

```rust
/// Persistent append-only trace material for an accepted Identity change.
pub struct IdentityTraceRecord {
    /// Stable trace record ref.
    pub trace_record_ref: IdentityTraceRecordRef,

    /// Member associated with the change.
    pub member_ref: GlobalMemberRef,

    /// Canonical trace subject.
    pub subject_ref: IdentityTraceSubjectRef,

    /// Canonical audit subject.
    pub audit_subject_ref: IdentityAuditSubjectRef,

    /// Change kind marker.
    pub change_kind_ref: IdentityChangeKindRef,

    /// Committed truth cursor for the accepted change.
    pub source_cursor_ref: IdentityTruthCursor,

    /// Optional body-free reason marker.
    pub reason_ref: Option<IdentityChangeReasonRef>,

    /// Optional body-free source marker.
    pub source_ref: Option<IdentitySourceRef>,

    /// Optional governance basis marker.
    pub basis_ref: Option<GovernanceBasisRef>,

    /// Optional actor or controlled source.
    pub actor_ref: Option<ActorRef>,

    /// Visibility result for a read surface.
    pub visibility_result_ref: Option<VisibilityResultRef>,

    /// Optional correction trace that supersedes this record in interpretation.
    pub superseded_by_trace_ref: Option<IdentityTraceRecordRef>,

    /// Material marker used to prevent forbidden bodies.
    pub read_material_marker: IdentityReadMaterialMarker,

    /// Time the accepted change was recorded.
    pub occurred_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `trace_record_ref` | `IdentityTraceRecordRef` | trace 身份 | Step 7 id generator;不得等于 event/log id |
| `member_ref` | `GlobalMemberRef` | 关联成员 | accepted change typed ref / loaded truth |
| `subject_ref` | `IdentityTraceSubjectRef` | trace 主语 | Step 7 subject mapper 从 typed truth ref 生成 |
| `audit_subject_ref` | `IdentityAuditSubjectRef` | audit 主语 | 同一 mapper 返回;不得从 trace subject 字符串切割 |
| `change_kind_ref` | `IdentityChangeKindRef` | 变化类别 | 从 accepted change intent/result 映射;固定 enum |
| `source_cursor_ref` | `IdentityTruthCursor` | accepted truth cursor | 来源于 accepted truth change / committed store;不得用 timestamp/version/idempotency key |
| `reason_ref` | `Option<IdentityChangeReasonRef>` | 变化原因 marker | body-free;不保存 note body |
| `source_ref` | `Option<IdentitySourceRef>` | 来源 marker | body-free;可指 external source marker |
| `basis_ref` | `Option<GovernanceBasisRef>` | governance basis marker | 不保存 governance body |
| `actor_ref` | `Option<ActorRef>` | actor / controlled source | command metadata / consumer context |
| `visibility_result_ref` | `Option<VisibilityResultRef>` | read surface 可见性 | 读取时可填;不改变 accepted trace material |
| `superseded_by_trace_ref` | `Option<IdentityTraceRecordRef>` | correction trace 解释性替代 | 必须指向后续正式 correction trace |
| `read_material_marker` | `IdentityReadMaterialMarker` | material 分类 | trace refs / safe marker only;forbidden body rejected |
| `occurred_at` | `IdentityTimestamp` | 记录时间 | clock port;不替代 cursor |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn from_accepted_change(trace_record_ref: IdentityTraceRecordRef, member_ref: GlobalMemberRef, subject_ref: IdentityTraceSubjectRef, audit_subject_ref: IdentityAuditSubjectRef, change_kind_ref: IdentityChangeKindRef, source_cursor_ref: IdentityTruthCursor, reason_ref: Option<IdentityChangeReasonRef>, source_ref: Option<IdentitySourceRef>, basis_ref: Option<GovernanceBasisRef>, actor_ref: Option<ActorRef>, read_material_marker: IdentityReadMaterialMarker, occurred_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从 accepted change 构造 trace | subject refs 已由 mapper 生成 | `IdentityTraceRecord` | 初始 appended;不保存 body |
| `pub fn redacted_read_surface(&self, visibility_result_ref: VisibilityResultRef) -> Self` | 生成 redacted read surface | visibility result 来自 policy | `IdentityTraceRecord` clone/read value | 不改写原记录 |
| `pub fn mark_superseded_by_correction(&mut self, correction_trace_ref: IdentityTraceRecordRef) -> Result<(), IdentityDomainError>` | 标记解释性替代 | correction trace 必须是正式追加记录 | `Ok(())` 或 rejection | 不删除旧 trace |
| `pub fn belongs_to(&self, member_ref: &GlobalMemberRef) -> bool` | 判断成员归属 | member ref 来自 request/query | `bool` | 只比较 typed ref |
| `pub fn matches_subject(&self, subject_ref: &IdentityTraceSubjectRef) -> bool` | 判断 trace subject | subject ref 来自 mapper/query | `bool` | 不解析字符串 |
| `pub fn matches_audit_subject(&self, audit_subject_ref: &IdentityAuditSubjectRef) -> bool` | 判断 audit subject | audit subject ref 来自 mapper/query | `bool` | 不解析字符串 |
| `pub fn is_superseded(&self) -> bool` | 判断是否有 correction 替代 | 无 | `bool` | 解释性状态 |
| `pub fn assert_body_free(&self) -> Result<(), IdentityDomainError>` | 校验 trace material 不携带 forbidden body | 使用 material marker | `Ok(())` 或 rejection | forbidden 不进入 trace |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| trace 必须来自 accepted change | rejected、query response、debug log、projection read miss 不创建 accepted trace |
| source cursor 必填 | accepted trace 不能缺 cursor,也不能用 timestamp/version 替代 |
| subject / audit subject 必须由 mapper 给出 | 不得在 service/fake/repo 中拼接 canonical key |
| append-only | correction 通过追加 trace 表达,旧 trace 保留 |
| body-free | role/work/memory/archive/governance body、raw log、secret 不进入 trace |

#### 7.13.6 `AuditTrail`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.3` |
| 所属业务组成部分 | 身份事实消费与追溯 |
| 归属 crate / module | `identity-domain::audit` / `identity-contracts::views` |
| 承接 capability | 组装审计时间线;按 audit subject/scope/cursor 读取;应用 visibility/redaction;显式 empty/not visible/degraded |
| 对象类别 | audit / history aggregate |
| 主要责任 | 将 trace refs 和安全 audit entries 组织为成员或 subject 范围内的可审计 timeline |
| 不承担什么 | 不保存 raw log、不写业务 truth、不修复 trace、不替代外部审计仓 |
| 后续 Step 承接 | Step 7 audit repository/read surface;Step 8 audit query DTO;Step 9 flow;Step 11 cursor/pagination |

```rust
/// Audit entry value embedded in an AuditTrail.
pub struct AuditTrailEntry {
    /// Trace record included by this entry.
    pub trace_record_ref: IdentityTraceRecordRef,
    /// Change kind marker.
    pub change_kind_ref: IdentityChangeKindRef,
    /// Redaction / visibility result for this entry.
    pub visibility_result_ref: VisibilityResultRef,
    /// Time associated with the trace.
    pub occurred_at: IdentityTimestamp,
}

/// Audit trail assembled from Identity trace records.
pub struct AuditTrail {
    /// Stable audit trail ref.
    pub audit_trail_ref: AuditTrailRef,

    /// Canonical audit subject.
    pub audit_subject_ref: IdentityAuditSubjectRef,

    /// Optional member scope.
    pub member_ref: Option<GlobalMemberRef>,

    /// Audit scope marker.
    pub audit_scope_ref: AuditScopeRef,

    /// Audit entries.
    pub entries: Vec<AuditTrailEntry>,

    /// Visibility result for the trail.
    pub visibility_result_ref: VisibilityResultRef,

    /// Public read surface category.
    pub read_surface_kind: IdentityReadSurfaceKind,

    /// Read pagination cursor.
    pub cursor_ref: Option<AuditCursorRef>,

    /// Time the trail was assembled or materialized.
    pub assembled_at: IdentityTimestamp,
}
```

`AuditTrailEntry.visibility_result_ref` 的来源规则:

| 写入 / 读取场景 | 正式来源 | 禁止事项 |
|---|---|---|
| accepted command / handoff prepare append entry | Step 7 `IdentityAcceptedAuditTrailMarkerMapper.accepted_command_audit_markers(...)` 返回的 `entry_visibility_result_ref` | 不调用 read visibility resolver;不使用默认 visible;不由 operation name、audit subject 字符串、trace id、timestamp 或 hard-coded marker 拼接 |
| query / read 组装 entry view | `VisibilityPolicy::for_audit(...)` / `IdentityReadVisibilityRepository.resolve_audit_read(...)` 的输出 | 不把 accepted write marker 当作 public authorization decision |

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `audit_trail_ref` | `AuditTrailRef` | audit timeline identity | Step 7 id/lookup;不得由 audit subject 拼接 |
| `audit_subject_ref` | `IdentityAuditSubjectRef` | audit 主语 | subject mapper 输出 |
| `member_ref` | `Option<GlobalMemberRef>` | 可选成员范围 | member-level audit 必填;system/report audit 可留后续 |
| `audit_scope_ref` | `AuditScopeRef` | audit 范围 | read/query surface 中来自 query metadata / audit request;accepted write 创建 missing trail 时必须来自 Step 7 `IdentityAcceptedAuditTrailMarkerMapper.accepted_command_audit_markers(...)`;不允许 service 使用默认 scope、常量、route、operation name 字符串或 audit subject 字符串拼接 |
| `entries` | `Vec<AuditTrailEntry>` | timeline entries | 来自 trace refs + read assembler;不保存 raw log |
| `visibility_result_ref` | `VisibilityResultRef` | trail 可见性结果 | read/query surface 中来自 `VisibilityPolicy` output;accepted write 创建 missing trail 时来自 Step 7 accepted audit trail marker mapper 的 trail visibility marker;该 marker 只证明 body-free audit material 已随 accepted transaction materialized,不是 public authorization/read decision |
| `read_surface_kind` | `IdentityReadSurfaceKind` | found/empty/not_visible/degraded | query surface,不是 truth state |
| `cursor_ref` | `Option<AuditCursorRef>` | 分页 cursor | 不等于 `IdentityTruthCursor` |
| `assembled_at` | `IdentityTimestamp` | 组装时间 | clock port;不表达 accepted change time |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assemble(audit_trail_ref: AuditTrailRef, audit_subject_ref: IdentityAuditSubjectRef, member_ref: Option<GlobalMemberRef>, audit_scope_ref: AuditScopeRef, entries: Vec<AuditTrailEntry>, visibility_result_ref: VisibilityResultRef, cursor_ref: Option<AuditCursorRef>, assembled_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 从 trace refs 组装 audit trail | entries 已经 body-free/redacted | `AuditTrail` | 不读取 repo、不修复 trace |
| `pub fn from_accepted_write(audit_trail_ref: AuditTrailRef, audit_subject_ref: IdentityAuditSubjectRef, member_ref: Option<GlobalMemberRef>, audit_scope_ref: AuditScopeRef, initial_entry: AuditTrailEntry, visibility_result_ref: VisibilityResultRef, assembled_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | accepted command missing trail 时创建 body-free trail | `audit_scope_ref` 与 `visibility_result_ref` 必须来自 Step 7 accepted audit trail marker mapper;initial entry 引用同事务 trace | `AuditTrail` | 只在 accepted write flow 使用;不执行 read visibility;不保存 raw log |
| `pub fn empty(audit_trail_ref: AuditTrailRef, audit_subject_ref: IdentityAuditSubjectRef, audit_scope_ref: AuditScopeRef, visibility_result_ref: VisibilityResultRef, assembled_at: IdentityTimestamp) -> Self` | 构造 empty surface | 无可见 entries | `AuditTrail` | 不补 trace |
| `pub fn not_visible(audit_trail_ref: AuditTrailRef, audit_subject_ref: IdentityAuditSubjectRef, audit_scope_ref: AuditScopeRef, visibility_result_ref: VisibilityResultRef, assembled_at: IdentityTimestamp) -> Self` | 构造 not visible surface | 不携带 entries | `AuditTrail` | 不泄漏 subject 详情 |
| `pub fn contains_trace(&self, trace_record_ref: &IdentityTraceRecordRef) -> bool` | 判断是否包含 trace | trace ref 来自 query/read | `bool` | 只比较 typed ref |
| `pub fn filter_by_scope(&self, audit_scope_ref: &AuditScopeRef) -> Self` | 返回 scope 裁剪 trail | scope marker 已正式给定 | `AuditTrail` | 不修改原 trail |
| `pub fn is_complete_for_scope(&self, audit_scope_ref: &AuditScopeRef) -> bool` | 判断当前读取是否完整 | scope marker | `bool` | degraded 时 false |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| audit 不修复 trace | missing / degraded 只能显式返回,不能补写 |
| cursor 不等于 truth cursor | audit cursor 只控制读取分页,不能作为 accepted change 来源 |
| entries 必须 body-free | 不保存 observability raw log、debug body、external payload body |
| visibility 仍生效 | audit 读取也要 redaction / not visible,不因审计角色绕过 |

#### 7.13.7 `VisibilityPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.3` |
| 所属业务组成部分 | 身份事实消费与追溯 |
| 归属 crate / module | `identity-domain::visibility_policy` |
| 承接 capability | visibility / redaction guard;forbidden body guard;read surface classification |
| 对象类别 | policy / guard |
| 主要责任 | 消费已解析 visibility access summary 和 material marker,判断 summary/trace/audit 是否可读、需 redaction、not visible 或 degraded |
| 不承担什么 | 不查询授权系统、不读取 repository、不保存 consumer 私有状态、不定义字段级 redaction schema、不写 truth |
| 后续 Step 承接 | Step 7 visibility resolver / query metadata;Step 8 DTO/read surface;Step 10 surface matrix;Step 12 redaction failure |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| visibility input | `access_summary` | `VisibilityPolicy::for_read(...)` | `assert_visible_or_redacted()` | access state | Step 7 resolver / prepared query context |
| summary read guard | `scope_ref`, `read_material_marker` | `for_summary(...)` | `assert_can_read_summary(...)` | read surface | query metadata + access summary |
| trace/audit guard | `subject_ref`, `audit_subject_ref`, `read_material_marker` | `for_trace(...)` / `for_audit(...)` | `assert_can_read_trace(...)` | read surface | subject mapper + access summary |
| forbidden body guard | `read_material_marker` | all factories | `assert_no_forbidden_body()` | material kind | DTO/assembler material precheck |
| redaction output | `redaction_profile_ref`, `redaction_marker_ref`, `visibility_result_ref` | all factories | `classify_read_surface()` | `Found`/`Redacted`/`NotVisible`/`Degraded` | access summary |

```rust
/// Visibility guard for identity read and propagation material.
pub struct VisibilityPolicy {
    /// Prepared visibility input.
    pub access_summary: IdentityVisibilityAccessSummary,

    /// Read material marker.
    pub read_material_marker: IdentityReadMaterialMarker,

    /// Scope being checked.
    pub scope_ref: VisibilityScopeRef,

    /// Optional trace subject being checked.
    pub trace_subject_ref: Option<IdentityTraceSubjectRef>,

    /// Optional audit subject being checked.
    pub audit_subject_ref: Option<IdentityAuditSubjectRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `access_summary` | `IdentityVisibilityAccessSummary` | 已解析可见性输入 | 来源于 Step 7 resolver / prepared context;policy 不调用外部系统 |
| `read_material_marker` | `IdentityReadMaterialMarker` | material 分类 | safe refs only;forbidden body 必须 rejected/degraded |
| `scope_ref` | `VisibilityScopeRef` | 字段 / 对象范围 | 来自 query/event/handoff context;字段级矩阵 Step 8/12 |
| `trace_subject_ref` | `Option<IdentityTraceSubjectRef>` | trace subject | 来自 subject mapper |
| `audit_subject_ref` | `Option<IdentityAuditSubjectRef>` | audit subject | 来自 subject mapper |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_summary(access_summary: IdentityVisibilityAccessSummary, read_material_marker: IdentityReadMaterialMarker) -> Self` | 构造 summary read guard | scope 从 access summary 复制 | `VisibilityPolicy` | 不读取 repository |
| `pub fn for_trace(access_summary: IdentityVisibilityAccessSummary, trace_subject_ref: IdentityTraceSubjectRef, read_material_marker: IdentityReadMaterialMarker) -> Self` | 构造 trace read guard | trace subject 已由 mapper 给出 | `VisibilityPolicy` | 不解析字符串 |
| `pub fn for_audit(access_summary: IdentityVisibilityAccessSummary, audit_subject_ref: IdentityAuditSubjectRef, read_material_marker: IdentityReadMaterialMarker) -> Self` | 构造 audit read guard | audit subject 已由 mapper 给出 | `VisibilityPolicy` | 不解析字符串 |
| `pub fn assert_can_read_summary(&self, member_ref: &GlobalMemberRef) -> Result<(), IdentityDomainError>` | 校验 summary 可读 | member ref 仅用于归属校验 | `Ok(())` 或 not visible/degraded | 不写 truth |
| `pub fn assert_can_read_trace(&self) -> Result<(), IdentityDomainError>` | 校验 trace/audit 可读 | 使用 access summary + subject refs | `Ok(())` 或 not visible/degraded | 不泄漏原因正文 |
| `pub fn assert_no_forbidden_body(&self) -> Result<(), IdentityDomainError>` | 拦截 forbidden read material | 使用 material marker | `Ok(())` 或 rejection/degraded | body 不进入输出 |
| `pub fn classify_read_surface(&self, found: bool, stale: bool) -> IdentityReadSurfaceKind` | 生成 public read surface | found/stale 由 caller 已加载输入给出 | read surface kind | 不触发 repair |
| `pub fn requires_redaction(&self) -> bool` | 判断是否 redacted | 使用 access state | `bool` | read surface only |
| `pub fn visibility_result_ref(&self) -> &VisibilityResultRef` | 返回 visibility result marker | 无 | ref | 不生成新 marker |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| policy 只消费准备好的 summary | 不调用外部授权、resolver、repository 或 config loader |
| not visible / redacted / degraded 是 surface | 不改写 `MemberSummaryView`、`IdentityTraceRecord` 或业务 truth |
| forbidden body 必须阻断 | 不允许 external body 进入 query、trace、audit、event、report 或 diagnostic |
| subject/scope 不拼字符串 | 统一由 typed ref / mapper / prepared context 提供 |
| consumer 私有状态不入仓 | `ConsumerRef` 只是 boundary marker |

#### 7.13.8 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `IdentityTraceView` | 并入 `AuditTrail` / query surface | 它是 trace 读取视图,不是第二套 trace truth | 本批 `AuditTrail`;Step 8 query DTO |
| `AuditEntry` | 作为 `AuditTrailEntry` value 内嵌 | 单条 entry 只在 audit timeline 中有意义,不单独作为 aggregate | 本批 `AuditTrail` |
| `HistoryRecord` | 并入 `IdentityTraceRecord` | accepted change history 与 trace material 合并,避免第二套 history truth | 本批 `IdentityTraceRecord` |
| `ConsumerRef` / `VisibilityContextRef` / `VisibilityResultRef` | 作为 boundary marker | 它们是读取上下文 / 结果 marker,不是 identity truth | 本批 typed marker;Step 7/8 继续细化 |
| `ProjectionState` / projection lookup | 后移到 6.4 | summary freshness 依赖 projection state,但 projection 状态对象另批定义 | 6.4 / Step 7 / Step 11 |
| `IdentityOutboxRecord` / event payload | 后移到 6.5 | accepted trace 可被 outbox 引用,但传播对象不属于 consumption 批 | 6.5 / Step 8 |
| `TraceHandoffIntent` / `HandoffState` | 后移到 6.5 | trace/audit handoff 是传播与外部交接对象 | 6.5 |
| query request / response DTO | 后移 | 属于协议契约,不是 Step 6 对象 | Step 8 |
| query / trace / audit repository trait | 后移 | 属于 port/adapter 契约 | Step 7 |
| field-level redaction matrix | 后移 | 需要协议字段和错误模型共同闭口 | Step 8 / Step 12 |
| raw observability log / debug body / external audit body | 排除 | forbidden body 或边界外 owner | 不进入 identity truth/view/trace/audit |

#### 7.13.9 6.3 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.13.1 明确 summary read、trace append、audit assemble、visibility/redaction、forbidden body |
| 是否有功能到对象映射 | 通过 | §7.13.2 将 view、trace、audit、visibility access summary、read material marker 分开 |
| view ref 来源是否避免拼接 | 通过 | `MemberSummaryViewRef` 明确来自 projection builder / lookup / id generator,不得 query 拼接 |
| trace/audit subject 是否闭口到 typed mapper | 通过 | `IdentityTraceSubjectRef` 与 `IdentityAuditSubjectRef` 独立 typed marker,来源留 Step 7 mapper,禁止字符串拼接 |
| trace cursor 是否不被 timestamp/version 替代 | 通过 | `IdentityTraceRecord.source_cursor_ref` 必填且必须来自 accepted truth cursor |
| redaction 是否被误写成 truth state | 未误写 | `Redacted` 表达 read surface,不原地改 trace / view |
| query no-write 是否保持 | 通过 | summary/trace/audit read 不创建、不刷新、不修复、不发布 |
| forbidden body 是否覆盖 | 通过 | read material marker 覆盖 external body、raw log、debug body、secret |
| 是否越过 Step 7~12 | 未越过 | 未定义 repository/port/DTO/DDL/transaction/error code/redaction matrix |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.4` | 已按用户继续指令视为审核通过,并已进入 projection / reference / reconciliation 对象契约 |

#### 7.13.10 6.3 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| view ref | `MemberSummaryViewRef` 来自 projection builder / lookup | query 中拼 `member-summary:<member_id>` |
| summary slice | `MemberSummarySliceRef` 只保存 body-free safe summary source | 在 view 中保存 RoleDefinition body、ProjectMember JSON 或 memory text |
| trace subject | Step 7 mapper 返回 `IdentityTraceSubjectRef` 和 `IdentityAuditSubjectRef` | service / fake 根据字符串前缀拼 subject |
| trace cursor | accepted change 提供 `IdentityTruthCursor` 后创建 trace | 用 `occurred_at`、version 或 idempotency key 当 cursor |
| trace correction | 追加 correction trace 并让旧 trace 指向 `superseded_by_trace_ref` | 原地覆盖或删除旧 trace |
| audit trail | `AuditTrail` 组织 trace refs 与 redacted entries | audit trail 保存 raw log、debug dump 或外部 event body |
| visibility | `VisibilityPolicy` 消费 `IdentityVisibilityAccessSummary` | policy 内部调用外部授权系统或读取 repository |
| redaction | 返回 `Redacted` read surface,原 trace/view 不变 | 把 redaction 当成持久 truth 状态写回 |
| not visible | 返回 not visible marker,不泄露不可见原因正文 | 用 not_found 掩盖并在 diagnostic 中暴露真实 subject |
| degraded | projection/visibility 不完整时返回 degraded surface | query 自动 rebuild projection 或修复 trace |

### 7.14 6.4 projection / reference / reconciliation

本批处理“派生维护与对账”的对象契约,目标是让 projection freshness、外部 reference resolution、report-only reconciliation 和 maintenance guard 在 Step 6 内具备可落码字段、状态、函数和不变量。6.4 是 projection / reference / report 对象批次,不是 repository trait、resolver port、job DTO、job flow、DDL、transaction order 或 retry/schedule 批次。

本批允许定义:

- `ProjectionStateId` / `ProjectionStateRef`、`IdentityProjectionRef`、`IdentityProjectionCursorRef`、`ProjectionFreshnessMarkerRef` 和 `ProjectionState`。
- `ExternalReferenceRef`、`ReferenceResolutionStateId` / `ReferenceResolutionStateRef`、`IdentityReferenceOwnerRef`、`ExternalSourceVersionRef`、`ExternalReferenceSafeSummaryRef` 和 `ReferenceResolutionState`。
- `MaintenanceScopeRef`、`IdentityMaintenanceTargetRef`、`MaintenanceIssueRef`、`IdentityMaintenanceIntent`、`ReconciliationFindingIntentRef`、`ReconciliationFindingMaterial` 和 `ReconciliationPolicy`。
- `ReconciliationReportId` / `ReconciliationReportRef`、`ReconciliationFindingRef`、`ReconciliationReportStateKind` 和 `ReconciliationReport`。

本批不定义:

- projection repository / projection index / reference resolver / report repository / job runner trait。
- `GetProjectionState` / `GetReferenceResolutionState` / `ReadReconciliationReport` query DTO。
- `RebuildIdentityProjection` / `RefreshExternalReferenceState` / `RunIdentityReconciliation` job DTO 或处理流。
- projection lookup 生成规则、affected view 扩展算法、reference refresh transaction order、optimistic version 规则、DDL / index。
- repair action、remediation plan 或跨仓 truth 修复能力。

#### 7.14.1 本批 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 表达 projection freshness | projection ref、member ref、source cursor、maintenance scope、checked time | `ProjectionState` | 只更新派生 freshness marker;不改写 identity truth | `ProjectionState` | Step 7 projection repository/index;Step 8 projection query/job DTO;Step 9 rebuild flow;Step 11 lookup/index |
| 标记 projection stale / degraded / failed | accepted truth cursor 或 committed scan cursor、issue marker、maintenance scope、checked time | stale/degraded/failed projection state | query 只能读取并返回 stale/degraded;不得触发 rebuild | `ProjectionState` | Step 9 accepted side effect / rebuild job;Step 10 projection state;Step 12 degraded surface |
| 表达外部 reference resolution | external reference、owner ref、source version、safe summary、issue、checked time | `ReferenceResolutionState` | 只记录解析状态;不拥有或修复外部 truth | `ReferenceResolutionState` | Step 7 resolver / snapshot read;Step 8 refresh job/consumer DTO;Step 10 source unavailable |
| 把 source stale / unavailable 显式化 | resolver summary、source changed marker、maintenance issue | stale/unavailable/unrecognized/pending reconciliation | 缺 source 不得 silent accepted;不补造默认 truth | `ReferenceResolutionState`,`ReconciliationReport` | Step 9 source consumer / refresh flow;Step 12 dependency unavailable |
| 限制维护为 report-only | maintenance scope、target、operation channel、finding material | `Ok(())` 或 domain rejection | maintenance job 只能更新 projection/reference/report marker | `ReconciliationPolicy` | Step 8 job precheck;Step 9 job flow;Step 10 forbidden repair |
| 生成对账报告 | maintenance scope、target refs、finding refs、issue refs、actor/time | `ReconciliationReport` | report-only finding;不自动 remediation | `ReconciliationReport`,`ReconciliationPolicy` | Step 7 report repository;Step 8 report query/job DTO;Step 10 report state |
| 排除 forbidden body | projection/reference/report material marker | rejection / degraded / report issue | external body、raw log、archive package、debug dump 不进入 report | `ReconciliationFindingMaterial`,`ReconciliationPolicy` | Step 8 schema;Step 12 forbidden body;Step 16 negative tests |

#### 7.14.2 功能到对象映射

| 对象 / 类型 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ProjectionStateId` / `ProjectionStateRef` | 标识 projection state | typed ref | opaque state identity、同一性比较 | 不从 projection ref、member id、query 参数或 cursor 临时拼接 |
| `IdentityProjectionRef` | 标识可维护 projection / view | projection marker | 指向 member summary、consumer projection 或其他 identity-owned derived view | 不保存 projection body、不表达 freshness、不替代 view ref lookup |
| `IdentityProjectionCursorRef` | projection 对齐的 source cursor marker | cursor marker | 表达 projection 对齐到哪个 accepted fact / committed scan marker | 不等于 page cursor、timestamp、optimistic version 或 idempotency key |
| `ProjectionFreshnessMarkerRef` | freshness public marker | read marker | 让 query/job/report 共享 fresh/stale/degraded 语义 | 不成为 truth state;不触发 rebuild |
| `ProjectionState` | projection freshness / rebuild marker | projection state | 表达 Fresh、Stale、RebuildPending、Rebuilt、Degraded、RebuildFailed | 不修复 truth、不保存 consumer UI state、不做 repository lookup |
| `ExternalReferenceRef` | 外部引用 marker | boundary ref | 表达 method/work/governance/memory/archive 等外部对象的 body-free reference | 不保存外部正文、不代表本仓拥有外部 truth |
| `ReferenceResolutionStateRef` | 标识 reference resolution state | typed ref | opaque resolution state identity | 不从 external id 字符串拼接 |
| `IdentityReferenceOwnerRef` | 标识本仓使用该外部引用的 owner | owner marker | 绑定 role/career/memory/lifecycle basis 等本仓对象 | 不等于 external reference;不代表外部 owner |
| `ExternalSourceVersionRef` | 外部来源版本 marker | version marker | 表达 resolver 看到的外部版本 | 不替代 identity version、truth cursor 或 source cursor |
| `ExternalReferenceSafeSummaryRef` | 外部引用安全摘要 marker | safe summary marker | 指向允许入仓的 body-free summary | 不保存 method body、work body、memory body、archive package 或 governance body |
| `ReferenceResolutionState` | 外部引用解析状态 | reference state | 表达 Resolved、Stale、Unavailable、Unrecognized、PendingReconciliation、RefreshFailed | 不修复外部 truth、不补造 accepted truth |
| `MaintenanceScopeRef` | 维护 / 对账范围 marker | boundary ref | 表达 job/report 覆盖范围 | 不在 Step 6 展开 affected target 算法 |
| `IdentityMaintenanceTargetRef` | 维护目标 marker | target marker | 指向 projection、reference state、report target | 不允许指向 core truth write target |
| `MaintenanceIssueRef` | 维护问题 marker | issue marker | 表达 stale、drift、unavailable、partial、failed 等安全问题 | 不保存 raw diagnostic、stack trace 或外部正文 |
| `IdentityMaintenanceIntent` | 维护意图分类 | intent marker | 区分 rebuild projection、refresh reference、reconcile、repair attempt 等 | repair attempt 必须被 policy 拒绝 |
| `ReconciliationFindingMaterial` | finding material 分类 | material marker | 区分 safe refs-only finding 与 forbidden body | 不携带正文;forbidden 必须被拦截 |
| `ReconciliationPolicy` | report-only / no-repair guard | policy / guard | 校验维护目标、入口 channel、body-free finding 和 no repair | 不读取 repository、不执行 job、不调用外部 resolver |
| `ReconciliationReportRef` | 标识对账报告 | typed ref | opaque report identity | 不从 scope、target 或时间拼接 |
| `ReconciliationFindingRef` | 标识 finding | finding marker | report 内对账发现引用 | 不等于 repair action |
| `ReconciliationReport` | report-only finding | report / finding aggregate | 保存 scope、targets、findings、issues、state、generated metadata | 不自动修复、不替代 trace/audit truth |

#### 7.14.3 projection / reference / reconciliation typed refs 与 marker

##### projection refs / cursor / freshness marker

```rust
/// Stable opaque identifier for an Identity projection state row.
pub struct ProjectionStateId(pub String);

/// Typed reference to an Identity projection state.
pub struct ProjectionStateRef {
    /// Stable projection state id.
    pub projection_state_id: ProjectionStateId,
}

/// Identity projection category.
pub enum IdentityProjectionKind {
    /// Member summary read model.
    MemberSummary,
    /// Consumer-facing identity projection.
    ConsumerProjection,
    /// Trace or audit read projection.
    TraceAuditProjection,
    /// Maintenance report projection.
    MaintenanceReportProjection,
}

/// Body-free reference to an Identity-owned projection or derived view.
pub struct IdentityProjectionRef {
    /// Projection category.
    pub projection_kind: IdentityProjectionKind,
    /// Opaque projection marker.
    pub projection_ref: IdentitySourceRef,
}

/// Cursor marker showing the accepted fact or committed scan position used by a projection.
pub struct IdentityProjectionCursorRef {
    /// Opaque projection source cursor marker.
    pub source_cursor_ref: IdentitySourceRef,
}

/// Public freshness marker for projection reads.
pub struct ProjectionFreshnessMarkerRef {
    /// Projection being described.
    pub projection_ref: IdentityProjectionRef,
    /// Freshness state exposed to read surfaces.
    pub state_kind: ProjectionStateKind,
}
```

| 字段 / 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ProjectionStateId.0` | projection state opaque id | 来源于 Step 7 id generator 或 repository lookup;不得由 query 拼接 |
| `IdentityProjectionKind` | projection 分类 | 固定 member summary、consumer projection、trace/audit projection、maintenance report projection;新分类需回 Step 6 |
| `IdentityProjectionRef.projection_ref` | projection marker | 来源于正式 projection builder / lookup / config-bound projection catalog;不得用 view body 或 query 参数 |
| `IdentityProjectionCursorRef.source_cursor_ref` | projection 对齐 cursor | 来源需要 Step 7/11 闭口;不得由 page cursor、timestamp、version、idempotency key 替代 |
| `ProjectionFreshnessMarkerRef.state_kind` | read surface freshness | 从 `ProjectionState` 派生;不触发 rebuild |

##### reference resolution refs / safe summary marker

```rust
/// External reference category used by Identity without owning external truth.
pub enum ExternalReferenceKind {
    /// Method-library role or capability source.
    MethodSource,
    /// Work participation source.
    WorkParticipation,
    /// Governance basis.
    GovernanceBasis,
    /// Memory object.
    Memory,
    /// Archive package or handoff target.
    Archive,
    /// Runtime or observability source marker.
    RuntimeSignal,
}

/// Body-free reference to an external truth owner.
pub struct ExternalReferenceRef {
    /// External reference category.
    pub reference_kind: ExternalReferenceKind,
    /// Opaque external reference marker.
    pub source_ref: IdentitySourceRef,
}

/// Stable opaque identifier for an Identity reference resolution state.
pub struct ReferenceResolutionStateId(pub String);

/// Typed reference to a reference resolution state.
pub struct ReferenceResolutionStateRef {
    /// Stable resolution state id.
    pub resolution_state_id: ReferenceResolutionStateId,
}

/// Identity object category that owns the local use of an external reference.
pub enum IdentityReferenceOwnerKind {
    /// Role capability summary or source snapshot.
    RoleCapability,
    /// Career record or career source marker.
    CareerRecord,
    /// Memory reference relation.
    MemoryReference,
    /// Lifecycle governance basis.
    LifecycleBasis,
    /// Projection or maintenance marker.
    Maintenance,
}

/// Body-free reference to the local Identity owner of an external reference.
pub struct IdentityReferenceOwnerRef {
    /// Owner category.
    pub owner_kind: IdentityReferenceOwnerKind,
    /// Opaque owner marker.
    pub owner_ref: IdentitySourceRef,
}

/// External source version marker.
pub struct ExternalSourceVersionRef {
    /// Opaque external version marker.
    pub version_ref: IdentitySourceRef,
}

/// Body-free safe summary marker for a resolved external reference.
pub struct ExternalReferenceSafeSummaryRef {
    /// External reference being summarized.
    pub external_reference_ref: ExternalReferenceRef,
    /// Opaque safe summary source marker.
    pub safe_summary_ref: IdentitySourceRef,
}
```

| 字段 / 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ExternalReferenceKind` | 外部来源类别 | 只表达 owner 类别;不得用字符串前缀推断具体 schema |
| `ExternalReferenceRef.source_ref` | 外部引用 marker | body-free;不得保存 method/work/memory/archive/governance body |
| `ReferenceResolutionStateRef` | resolution state identity | 来源于 Step 7 id generator / repository lookup;不得从 external ref 拼接 |
| `IdentityReferenceOwnerRef.owner_ref` | 本仓 owner marker | 来自 typed local object ref 的正式 mapper;不得直接复用 external id |
| `ExternalSourceVersionRef.version_ref` | 外部版本 | 只表达外部来源版本;不替代 optimistic version 或 truth cursor |
| `ExternalReferenceSafeSummaryRef.safe_summary_ref` | 可保存摘要 marker | resolver / event mapper 提供;完整读取面后移 Step 7 |

##### maintenance / reconciliation marker

```rust
/// Maintenance scope marker for projection rebuild, reference refresh, and reconciliation.
pub struct MaintenanceScopeRef {
    /// Opaque maintenance scope marker.
    pub scope_ref: IdentitySourceRef,
}

/// Maintenance target category.
pub enum IdentityMaintenanceTargetKind {
    /// Projection target.
    Projection,
    /// Reference resolution target.
    ReferenceResolution,
    /// Reconciliation report target.
    ReconciliationReport,
}

/// Body-free maintenance target marker.
pub struct IdentityMaintenanceTargetRef {
    /// Target category.
    pub target_kind: IdentityMaintenanceTargetKind,
    /// Opaque target marker.
    pub target_ref: IdentitySourceRef,
}

/// Maintenance issue category.
pub enum MaintenanceIssueKind {
    /// Projection or reference is stale.
    Stale,
    /// External dependency is unavailable.
    Unavailable,
    /// External reference cannot be recognized.
    Unrecognized,
    /// Derived material is incomplete.
    Partial,
    /// Drift was detected.
    DriftDetected,
    /// Maintenance execution failed.
    Failed,
    /// Forbidden material was detected.
    ForbiddenBody,
}

/// Body-free maintenance issue marker.
pub struct MaintenanceIssueRef {
    /// Issue category.
    pub issue_kind: MaintenanceIssueKind,
    /// Opaque issue source marker.
    pub issue_ref: IdentitySourceRef,
}

/// Maintenance intent category.
pub enum IdentityMaintenanceIntent {
    /// Rebuild an Identity-owned projection.
    RebuildProjection,
    /// Refresh external reference state.
    RefreshReference,
    /// Generate reconciliation report.
    Reconcile,
    /// Attempt to repair Identity truth.
    RepairIdentityTruth,
    /// Attempt to repair external truth.
    RepairExternalTruth,
}

/// Body-free finding intent marker.
pub struct ReconciliationFindingIntentRef {
    /// Opaque finding intent marker.
    pub intent_ref: IdentitySourceRef,
}

/// Material kind carried by a reconciliation finding.
pub enum ReconciliationFindingMaterialKind {
    /// Safe refs only.
    SafeRefsOnly,
    /// Safe maintenance issue refs only.
    IssueRefsOnly,
    /// Forbidden external body.
    ForbiddenExternalBody,
    /// Forbidden raw diagnostic body.
    ForbiddenDiagnosticBody,
    /// Forbidden secret or credential material.
    ForbiddenSecret,
}

/// Material marker consumed by ReconciliationPolicy.
pub struct ReconciliationFindingMaterial {
    /// Finding material category.
    pub material_kind: ReconciliationFindingMaterialKind,
    /// Optional body-free source marker.
    pub source_ref: Option<IdentitySourceRef>,
}
```

| marker | 作用 | 约束 / 来源 |
|---|---|---|
| `MaintenanceScopeRef` | 维护范围 | 只表达 scope marker;范围展开、affected target lookup 留 Step 7/9/11 |
| `IdentityMaintenanceTargetRef` | 维护目标 | 只能指向 projection/reference/report marker;不能指向 core truth write target |
| `MaintenanceIssueRef` | 安全问题引用 | 不保存 raw diagnostic、stack trace、external body 或 secret |
| `IdentityMaintenanceIntent` | 维护意图分类 | `RepairIdentityTruth` / `RepairExternalTruth` 必须被 `ReconciliationPolicy` 拦截 |
| `ReconciliationFindingIntentRef` | finding 意图 marker | 不等于 repair action 或执行计划 |
| `ReconciliationFindingMaterial` | finding material 分类 | forbidden material 必须 rejected / failed report;不得入仓 |

##### report refs / state

```rust
/// Stable opaque identifier for an Identity reconciliation report.
pub struct ReconciliationReportId(pub String);

/// Typed reference to an Identity reconciliation report.
pub struct ReconciliationReportRef {
    /// Stable report id.
    pub report_id: ReconciliationReportId,
}

/// Body-free reference to a reconciliation finding.
pub struct ReconciliationFindingRef {
    /// Opaque finding marker.
    pub finding_ref: IdentitySourceRef,
}

/// Reconciliation report state.
pub enum ReconciliationReportStateKind {
    /// Report was generated and can be read.
    Generated,
    /// No finding was detected in the requested scope.
    NoFinding,
    /// One or more findings were detected.
    FindingDetected,
    /// Report is partial because part of the scope failed or was unavailable.
    Partial,
    /// Report generation failed.
    Failed,
}
```

| 字段 / 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `ReconciliationReportRef` | report identity | 来源于 Step 7 id generator / report repository;不得从 scope/time 拼接 |
| `ReconciliationFindingRef` | finding identity | 来源于 report builder / id generator;不等于 repair action |
| `ReconciliationReportStateKind` | report-only 状态 | 不表达 truth 修复状态;`Partial` / `Failed` 不得伪装成功 |

#### 7.14.4 `ProjectionState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.4` |
| 所属业务组成部分 | 派生维护与对账 |
| 归属 crate / module | `identity-domain::projection_state`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 表达 projection freshness;标记 projection stale / degraded / failed;支持 query no-write stale surface |
| 对象类别 | projection / state value |
| 主要责任 | 表达 identity-owned projection 或 derived view 与 source cursor 的对齐状态,让读取和维护路径能显式处理 fresh、stale、pending、rebuilt、degraded 和 failed |
| 不承担什么 | 不保存核心 truth、不保存 projection body、不触发 rebuild、不读取 repository、不修复 truth、不保存 consumer UI/private state |
| 后续 Step 承接 | Step 7 projection repository/index;Step 8 projection query/job DTO;Step 9 accepted stale side effect / rebuild flow;Step 10 projection state;Step 11 lookup/index/cursor |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 创建 fresh state | `projection_state_ref`, `projection_ref`, `member_ref`, `state_kind`, `source_cursor_ref`, `checked_at` | `ProjectionState::fresh(...)` | `is_fresh(&self) -> bool` | `Fresh` | projection state id 来自 Step 7 id source;projection ref 来自 builder/lookup;cursor 来源 Step 7/11 闭口;time 来自 clock |
| 标记 stale | `source_cursor_ref`, `maintenance_scope_ref`, `checked_at` | `ProjectionState::stale(...)` 或 `mark_stale(...)` | `requires_rebuild(&self) -> bool` | `Stale` | accepted truth change / committed scan marker;scope 来自 job/request/config marker |
| 标记 rebuild pending / rebuilt | `state_kind`, `source_cursor_ref`, `checked_at` | `mark_rebuild_pending(...)`;`mark_rebuilt(...)` | `can_serve_read(&self) -> bool` | `RebuildPending` / `Rebuilt` | rebuild job prepared context;不由 query 触发 |
| 标记 degraded / failed | `issue_ref`, `maintenance_scope_ref`, `checked_at` | `mark_degraded(...)`;`mark_rebuild_failed(...)` | `issue_ref(&self) -> Option<MaintenanceIssueRef>` | `Degraded` / `RebuildFailed` | maintenance issue marker;不得保存 raw diagnostic |

```rust
/// Projection freshness and rebuild marker for Identity-owned derived views.
pub struct ProjectionState {
    /// Projection state identity.
    pub projection_state_ref: ProjectionStateRef,

    /// Projection or derived view being tracked.
    pub projection_ref: IdentityProjectionRef,

    /// Member related to this projection when the projection is member-scoped.
    pub member_ref: Option<GlobalMemberRef>,

    /// Current projection state.
    pub state_kind: ProjectionStateKind,

    /// Accepted fact or committed scan cursor that this projection reflects.
    pub source_cursor_ref: Option<IdentityProjectionCursorRef>,

    /// Scope used by the latest maintenance action.
    pub maintenance_scope_ref: Option<MaintenanceScopeRef>,

    /// Safe issue marker when projection is degraded or failed.
    pub issue_ref: Option<MaintenanceIssueRef>,

    /// Latest check or rebuild timestamp.
    pub checked_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `projection_state_ref` | `ProjectionStateRef` | projection state identity | 来源于 Step 7 id generator / repository lookup;不得拼接 |
| `projection_ref` | `IdentityProjectionRef` | 被维护的 projection 或 view | 来自 projection builder / lookup / config-bound catalog;不保存 body |
| `member_ref` | `Option<GlobalMemberRef>` | member-scoped projection 的成员主语 | 只在 member 相关 projection 中存在;不得从 projection ref 字符串解析 |
| `state_kind` | `ProjectionStateKind` | freshness / rebuild 状态 | 只能使用本对象定义的 variant;完整迁移矩阵 Step 10 |
| `source_cursor_ref` | `Option<IdentityProjectionCursorRef>` | projection 对齐的 source cursor | Fresh/Rebuilt 通常必填;Stale 可携带导致 stale 的 cursor;来源 Step 7/11 闭口 |
| `maintenance_scope_ref` | `Option<MaintenanceScopeRef>` | 最近一次维护范围 | 来自 job/request/config marker;不展开 affected target |
| `issue_ref` | `Option<MaintenanceIssueRef>` | degraded / failed issue marker | 只保存 safe issue ref;不得保存 raw diagnostic |
| `checked_at` | `IdentityTimestamp` | 最近检查 / 标记 / 重建时间 | 来自 clock port;不得作为 cursor 或 version |

```rust
/// Projection state kind.
pub enum ProjectionStateKind {
    /// Projection is aligned with a known source cursor.
    Fresh,

    /// Projection is behind or known to be stale.
    Stale,

    /// Projection rebuild has been requested but not completed.
    RebuildPending,

    /// Projection was rebuilt successfully.
    Rebuilt,

    /// Projection can be served only in degraded form.
    Degraded,

    /// Projection rebuild failed.
    RebuildFailed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | Projection is aligned with a known source cursor. | 可作为最新读取候选 | projection builder / rebuild completed | `Stale` / `Degraded` / `RebuildPending` |
| `Stale` | Projection is behind or known to be stale. | 显式 stale marker | accepted truth change / reference changed / committed scan detects drift | `RebuildPending` / `Rebuilt` / `Degraded` / `RebuildFailed` |
| `RebuildPending` | Projection rebuild has been requested but not completed. | 后台重建待处理 | rebuild job scheduling marker | `Rebuilt` / `Degraded` / `RebuildFailed` |
| `Rebuilt` | Projection was rebuilt successfully. | 最近一次重建成功 | rebuild job completed | `Fresh` / `Stale` / `Degraded` |
| `Degraded` | Projection can be served only in degraded form. | 可读但不完整 | partial rebuild / dependency unavailable | `RebuildPending` / `Rebuilt` / `RebuildFailed` |
| `RebuildFailed` | Projection rebuild failed. | 重建失败 | rebuild job failure | `RebuildPending` / `Degraded`;不得自动修复 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn fresh(projection_state_ref: ProjectionStateRef, projection_ref: IdentityProjectionRef, member_ref: Option<GlobalMemberRef>, source_cursor_ref: IdentityProjectionCursorRef, checked_at: IdentityTimestamp) -> Self` | 创建 fresh projection state | refs/id/time 均由 application 准备 | `ProjectionState` | 不生成 projection body;不读取 repository |
| `pub fn stale(projection_state_ref: ProjectionStateRef, projection_ref: IdentityProjectionRef, member_ref: Option<GlobalMemberRef>, source_cursor_ref: IdentityProjectionCursorRef, maintenance_scope_ref: MaintenanceScopeRef, checked_at: IdentityTimestamp) -> Self` | 创建 stale projection state | cursor 是正式 source cursor;scope 为维护范围 marker | `ProjectionState` | 不触发 rebuild |
| `pub fn failed(projection_state_ref: ProjectionStateRef, projection_ref: IdentityProjectionRef, issue_ref: MaintenanceIssueRef, maintenance_scope_ref: MaintenanceScopeRef, checked_at: IdentityTimestamp) -> Self` | 创建 rebuild failed state | issue 为 safe marker | `ProjectionState` | 不保存 raw error body |
| `pub fn is_fresh(&self) -> bool` | 判断 projection 是否 fresh | 无 | `bool` | 只读本地 state |
| `pub fn requires_rebuild(&self) -> bool` | 判断是否需要 rebuild | 无 | `bool` | `Stale` / `RebuildFailed` / 部分 `Degraded` 可返回 true;具体矩阵 Step 10 |
| `pub fn can_serve_read(&self) -> bool` | 判断是否可用于读取 surface | 无 | `bool` | stale/degraded 可读语义由 Step 8/12 public surface 承接 |
| `pub fn mark_stale(&mut self, source_cursor_ref: IdentityProjectionCursorRef, maintenance_scope_ref: MaintenanceScopeRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 stale | cursor/scope/time 由 application 准备 | `Ok(())` 或 domain rejection | 不允许用 timestamp/version/page cursor 替代 source cursor |
| `pub fn mark_rebuild_pending(&mut self, maintenance_scope_ref: MaintenanceScopeRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 rebuild pending | scope/time 来自 job context | `Ok(())` 或 domain rejection | query 不得调用 |
| `pub fn mark_rebuilt(&mut self, source_cursor_ref: IdentityProjectionCursorRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 rebuilt | cursor 为 rebuild 对齐 source cursor | `Ok(())` 或 domain rejection | 不写 core truth |
| `pub fn mark_degraded(&mut self, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 degraded | issue/time 来自 maintenance context | `Ok(())` 或 domain rejection | 不保存 issue body |
| `pub fn mark_rebuild_failed(&mut self, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 failed | issue/time 来自 job failure marker | `Ok(())` 或 domain rejection | 不执行 repair |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| projection 不是第二 truth | `ProjectionState` 只表达 derived freshness,不承载 `GlobalMember` / lifecycle / role / career / memory truth |
| query 不触发 rebuild | query 只能读取 state 并返回 stale/degraded surface |
| source cursor 必须正式 | 不得用 page cursor、timestamp、optimistic version、idempotency key 或 event id 替代 |
| failed/degraded 只保存 safe issue ref | raw diagnostic、stack trace、external body 不能进入对象 |
| projection ref 不可拼接 | view lookup / builder source 必须在 Step 7/11 闭口 |

#### 7.14.5 `ReferenceResolutionState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.4` |
| 所属业务组成部分 | 派生维护与对账 |
| 归属 crate / module | `identity-domain::reference_state`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 表达外部 reference resolution;把 source stale / unavailable 显式化;防止外部来源异常污染 identity truth |
| 对象类别 | reference / state value |
| 主要责任 | 记录 identity 使用的外部 reference 是否 resolved、stale、unavailable、unrecognized、pending reconciliation 或 refresh failed,并绑定 local owner、source version 和 safe summary marker |
| 不承担什么 | 不拥有外部 truth、不保存外部正文、不调用 resolver、不自动修复 method/work/governance/memory/archive、不生成 accepted truth |
| 后续 Step 承接 | Step 7 resolver / snapshot repository;Step 8 refresh/reference query DTO;Step 9 source consumer / refresh flow;Step 10 reference state;Step 11 version/read surface |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 创建 resolved state | `resolution_state_ref`, `external_reference_ref`, `reference_owner_ref`, `source_version_ref`, `safe_summary_ref`, `checked_at` | `ReferenceResolutionState::resolved(...)` | `is_usable_for_truth_update(&self) -> bool` | `Resolved` | resolver/event mapper 提供 body-free summary;id/time 来源 Step 7 |
| 标记 stale | `source_version_ref`, `checked_at` | `mark_stale(...)` | `is_stale(&self) -> bool` | `Stale` | source changed marker / resolver summary |
| 标记 unavailable/unrecognized | `issue_ref`, `checked_at` | `unavailable(...)`;`unrecognized(...)`;`mark_unavailable(...)` | `is_report_only(&self) -> bool` | `Unavailable` / `Unrecognized` | resolver failure / source unavailable marker |
| 标记 pending reconciliation / failed | `issue_ref`, `checked_at` | `mark_pending_reconciliation(...)`;`mark_refresh_failed(...)` | `requires_reconciliation(&self) -> bool` | `PendingReconciliation` / `RefreshFailed` | reconciliation/report issue marker |

```rust
/// Resolution state for an external reference used by Identity.
pub struct ReferenceResolutionState {
    /// Resolution state identity.
    pub resolution_state_ref: ReferenceResolutionStateRef,

    /// External reference being resolved.
    pub external_reference_ref: ExternalReferenceRef,

    /// Local Identity owner that uses the external reference.
    pub reference_owner_ref: IdentityReferenceOwnerRef,

    /// Current resolution state.
    pub state_kind: ReferenceResolutionStateKind,

    /// External source version observed by the resolver or event mapper.
    pub source_version_ref: Option<ExternalSourceVersionRef>,

    /// Body-free safe summary for the resolved external reference.
    pub safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,

    /// Safe issue marker for unavailable, unrecognized, pending, or failed states.
    pub issue_ref: Option<MaintenanceIssueRef>,

    /// Latest resolution or refresh timestamp.
    pub checked_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `resolution_state_ref` | `ReferenceResolutionStateRef` | resolution state identity | 来源于 Step 7 id generator / repository lookup;不得拼接 |
| `external_reference_ref` | `ExternalReferenceRef` | 被解析外部引用 | body-free;不得保存外部正文 |
| `reference_owner_ref` | `IdentityReferenceOwnerRef` | 本仓使用该 external ref 的 owner | 来源于 typed local object ref mapper;不得用 external ref 替代 |
| `state_kind` | `ReferenceResolutionStateKind` | 解析状态 | 只允许本对象 variant;状态矩阵 Step 10 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 外部来源版本 marker | `Resolved` / `Stale` 可携带;不替代 identity version/cursor |
| `safe_summary_ref` | `Option<ExternalReferenceSafeSummaryRef>` | 可入仓安全摘要 marker | `Resolved` 通常必填;不得保存 body |
| `issue_ref` | `Option<MaintenanceIssueRef>` | 不可用、无法识别、待对账或失败 issue | 只保存 safe issue ref |
| `checked_at` | `IdentityTimestamp` | 最近解析 / 刷新时间 | 来自 clock;不得作为 cursor/version |

```rust
/// External reference resolution state kind.
pub enum ReferenceResolutionStateKind {
    /// External reference was resolved with safe summary material.
    Resolved,

    /// External source version changed or resolution is stale.
    Stale,

    /// External dependency is unavailable.
    Unavailable,

    /// External reference is not recognized by the formal resolver boundary.
    Unrecognized,

    /// Reference state requires report-only reconciliation.
    PendingReconciliation,

    /// Refresh attempt failed.
    RefreshFailed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Resolved` | External reference was resolved with safe summary material. | 可作为 source summary 输入 | resolver / event mapper resolved | `Stale` / `Unavailable` / `PendingReconciliation` |
| `Stale` | External source version changed or resolution is stale. | 显式来源过期 | source changed event / refresh detects version drift | `Resolved` / `Unavailable` / `PendingReconciliation` / `RefreshFailed` |
| `Unavailable` | External dependency is unavailable. | dependency unavailable marker | resolver unavailable / external owner unavailable | `Resolved` / `PendingReconciliation` / `RefreshFailed` |
| `Unrecognized` | External reference is not recognized by the formal resolver boundary. | 无法映射 formal ref | resolver says unrecognized / unsupported source kind | `Resolved` / `PendingReconciliation`;不得直接 accepted truth |
| `PendingReconciliation` | Reference state requires report-only reconciliation. | 待对账解释 | report drift / unresolved mismatch | `Resolved` / `Unavailable` / `RefreshFailed` |
| `RefreshFailed` | Refresh attempt failed. | 刷新失败 | refresh job failure marker | `Stale` / `PendingReconciliation` / `Resolved` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn resolved(resolution_state_ref: ReferenceResolutionStateRef, external_reference_ref: ExternalReferenceRef, reference_owner_ref: IdentityReferenceOwnerRef, source_version_ref: ExternalSourceVersionRef, safe_summary_ref: ExternalReferenceSafeSummaryRef, checked_at: IdentityTimestamp) -> Self` | 创建 resolved state | ref/version/summary 均为 body-free marker | `ReferenceResolutionState` | 不保存外部正文 |
| `pub fn unavailable(resolution_state_ref: ReferenceResolutionStateRef, external_reference_ref: ExternalReferenceRef, reference_owner_ref: IdentityReferenceOwnerRef, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Self` | 创建 unavailable state | issue 为 safe marker | `ReferenceResolutionState` | 不补造默认 summary |
| `pub fn unrecognized(resolution_state_ref: ReferenceResolutionStateRef, external_reference_ref: ExternalReferenceRef, reference_owner_ref: IdentityReferenceOwnerRef, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Self` | 创建 unrecognized state | issue 来自 resolver summary | `ReferenceResolutionState` | 不从字符串发明 ref |
| `pub fn is_usable_for_truth_update(&self) -> bool` | 判断是否可作为后续 accepted source 输入 | 无 | `bool` | 只有满足 policy 的 `Resolved` 可返回 true;完整分支 Step 10/12 |
| `pub fn is_report_only(&self) -> bool` | 判断是否只能生成 report/finding | 无 | `bool` | pending/failed/unrecognized 通常 report-only |
| `pub fn requires_reconciliation(&self) -> bool` | 判断是否需要对账 | 无 | `bool` | `PendingReconciliation` / `RefreshFailed` 可返回 true |
| `pub fn mark_stale(&mut self, source_version_ref: ExternalSourceVersionRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 stale | version/time 来自 resolver/event mapper | `Ok(())` 或 domain rejection | 不改写 owner truth |
| `pub fn mark_unavailable(&mut self, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 unavailable | issue/time 来自 resolver/job | `Ok(())` 或 domain rejection | 不保存 external body |
| `pub fn mark_pending_reconciliation(&mut self, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 pending reconciliation | issue/time 来自 report/check | `Ok(())` 或 domain rejection | 修复必须走正式 owner 能力 |
| `pub fn mark_refresh_failed(&mut self, issue_ref: MaintenanceIssueRef, checked_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 refresh failed | issue/time 来自 refresh failure | `Ok(())` 或 domain rejection | 不触发 repair |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| external reference 只保存 body-free marker | method/work/governance/memory/archive 正文都禁止入仓 |
| `Resolved` 不代表本仓拥有外部 truth | 只表示当前 resolver summary 可用 |
| unavailable / unrecognized 不得 accepted truth | 不允许用默认值、空值或旧 summary 伪装 valid source |
| owner ref 与 external ref 分离 | local owner 必须来自 typed local object mapper |
| external source version 不替代 persistence version | optimistic save/read version 由 Step 11 闭口 |

#### 7.14.6 `ReconciliationPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.4` |
| 所属业务组成部分 | 派生维护与对账 |
| 归属 crate / module | `identity-domain::reconciliation_policy` |
| 承接 capability | 限制维护为 report-only;防止 projection/reference/reconciliation 绕过 command 写 truth;排除 forbidden body |
| 对象类别 | policy / guard |
| 主要责任 | 在 projection rebuild、reference refresh 和 reconciliation 入口上校验目标只能是派生 marker 或 report,并拒绝任何 identity truth repair、external truth repair、query path refresh 或 forbidden finding material |
| 不承担什么 | 不读取 repository、不调用 resolver、不执行 job、不写 report、不生成 id、不决定 retry/schedule |
| 后续 Step 承接 | Step 7 job/query boundary;Step 8 maintenance DTO;Step 9 maintenance flow;Step 10 forbidden repair;Step 12 rejection/error surface |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| projection rebuild guard | `maintenance_scope_ref`, `operation_channel`, `target_ref`, `actor_ref` | `for_projection_rebuild(...)` | `assert_report_only(&self)` | 不适用 | job context / target marker |
| reference refresh guard | `maintenance_scope_ref`, `operation_channel`, `target_ref`, `actor_ref` | `for_reference_refresh(...)` | `assert_not_cross_repo_repair(&self)` | 不适用 | refresh job/request context |
| reconciliation report guard | `finding_intent_ref`, `finding_material`, `target_ref` | `for_reconciliation(...)` | `assert_body_free(&self)` | 不适用 | reconciliation prepared context |
| query no-refresh guard | `operation_channel` | `for_query_read(...)` | `assert_not_query_path_refresh(&self)` | 不适用 | query operation context |
| repair intent rejection | `maintenance_intent` | `for_maintenance_intent(...)` | `assert_not_truth_write(&self)` | 不适用 | job/handler intent marker |

```rust
/// Guard that keeps Identity maintenance report-only.
pub struct ReconciliationPolicy {
    /// Scope covered by the maintenance operation.
    pub maintenance_scope_ref: MaintenanceScopeRef,

    /// Operation channel attempting maintenance.
    pub operation_channel: IdentityOperationChannel,

    /// Optional actor or system actor for controlled maintenance.
    pub actor_ref: Option<ActorRef>,

    /// Maintenance target.
    pub target_ref: IdentityMaintenanceTargetRef,

    /// Maintenance intent.
    pub maintenance_intent: IdentityMaintenanceIntent,

    /// Optional finding intent.
    pub finding_intent_ref: Option<ReconciliationFindingIntentRef>,

    /// Optional finding material marker.
    pub finding_material: Option<ReconciliationFindingMaterial>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `maintenance_scope_ref` | `MaintenanceScopeRef` | 维护 / 对账范围 | 来自 job/request/config marker;范围展开 Step 7/9/11 |
| `operation_channel` | `IdentityOperationChannel` | 入口通道 | query channel 不允许 refresh/rebuild/write |
| `actor_ref` | `Option<ActorRef>` | 受控 actor / system actor | 来源于 operation context;不表达权限 |
| `target_ref` | `IdentityMaintenanceTargetRef` | 维护目标 | 只能是 projection/reference/report marker;不得是 core truth |
| `maintenance_intent` | `IdentityMaintenanceIntent` | 维护意图 | repair intent 必须被拒绝 |
| `finding_intent_ref` | `Option<ReconciliationFindingIntentRef>` | finding 意图 | 只用于 report-only finding;不等于 repair plan |
| `finding_material` | `Option<ReconciliationFindingMaterial>` | finding material marker | 只允许 safe refs / issue refs;forbidden body 拒绝 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn for_projection_rebuild(maintenance_scope_ref: MaintenanceScopeRef, projection_ref: IdentityProjectionRef, actor_ref: Option<ActorRef>, operation_channel: IdentityOperationChannel) -> Self` | 构造 projection rebuild guard | projection ref 转为 maintenance target marker 的正式规则后移 Step 7 mapper | `ReconciliationPolicy` | 不触发 rebuild |
| `pub fn for_reference_refresh(maintenance_scope_ref: MaintenanceScopeRef, external_reference_ref: ExternalReferenceRef, actor_ref: Option<ActorRef>, operation_channel: IdentityOperationChannel) -> Self` | 构造 reference refresh guard | external ref 只作为 body-free target marker | `ReconciliationPolicy` | 不调用 resolver |
| `pub fn for_reconciliation(maintenance_scope_ref: MaintenanceScopeRef, target_ref: IdentityMaintenanceTargetRef, finding_intent_ref: ReconciliationFindingIntentRef, finding_material: ReconciliationFindingMaterial, actor_ref: Option<ActorRef>, operation_channel: IdentityOperationChannel) -> Self` | 构造 reconciliation guard | finding material 必须是 marker | `ReconciliationPolicy` | 不生成 report |
| `pub fn assert_report_only(&self) -> Result<(), IdentityDomainError>` | 校验目标只允许 projection/reference/report | 使用 `target_ref` / `maintenance_intent` | `Ok(())` 或 domain rejection | 不允许 core truth target |
| `pub fn assert_not_truth_write(&self) -> Result<(), IdentityDomainError>` | 防止维护写 identity truth | 使用 `maintenance_intent` | `Ok(())` 或 domain rejection | `RepairIdentityTruth` 拒绝 |
| `pub fn assert_not_cross_repo_repair(&self) -> Result<(), IdentityDomainError>` | 防止维护修复外部 truth | 使用 `maintenance_intent` / target kind | `Ok(())` 或 domain rejection | `RepairExternalTruth` 拒绝 |
| `pub fn assert_not_query_path_refresh(&self) -> Result<(), IdentityDomainError>` | 防止 query path 刷新 / rebuild | 使用 `operation_channel` | `Ok(())` 或 domain rejection | query 只能 read surface |
| `pub fn assert_body_free(&self) -> Result<(), IdentityDomainError>` | 防止 finding/report 带外部正文 | 使用 `finding_material` | `Ok(())` 或 domain rejection | forbidden body 拒绝 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| maintenance 只能更新派生状态或生成 report | 不得创建、更新、删除 `GlobalMember` / lifecycle / role / career / memory truth |
| repair intent 必须被拒绝 | 修复必须回到拥有 truth 的正式 command / owner 仓能力 |
| query channel 不得 refresh | query 发现 stale/unavailable 只能返回 surface |
| finding material 必须 body-free | forbidden external body、raw diagnostic、secret 不得进入 report |
| policy 不执行 IO | repository/resolver/job runner/transaction 留 Step 7/9/11 |

#### 7.14.7 `ReconciliationReport`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.4` |
| 所属业务组成部分 | 派生维护与对账 |
| 归属 crate / module | `identity-domain::reconciliation_report`;字段类型来自 `identity-contracts::refs` / `identity-contracts::metadata` |
| 承接 capability | 生成对账报告;保存 report-only finding;显式暴露 partial / failed;排除 forbidden body |
| 对象类别 | report / finding aggregate |
| 主要责任 | 保存 projection、reference 或消费边界的对账范围、目标、finding refs、issue refs、报告状态和生成元数据,作为审计与后续正式修复入口的 report-only material |
| 不承担什么 | 不修复 truth、不保存外部正文、不作为自动 remediation plan、不替代 `IdentityTraceRecord` / `AuditTrail` |
| 后续 Step 承接 | Step 7 report repository/read;Step 8 report query/job DTO;Step 9 reconciliation flow;Step 10 report state;Step 11 persistence |

| 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|
| 生成普通报告 | `report_ref`, `maintenance_scope_ref`, `target_refs`, `finding_refs`, `issue_refs`, `generated_by_ref`, `generated_at` | `ReconciliationReport::generated(...)` | `has_findings(&self) -> bool` | `Generated` / `FindingDetected` / `NoFinding` | report id 来自 Step 7 id source;targets/findings/issues 来自 prepared context |
| 生成 no finding 报告 | `target_refs`, `generated_at` | `no_finding(...)` | `is_report_only(&self) -> bool` | `NoFinding` | reconciliation job result |
| 追加 finding | `finding_refs`, `issue_refs` | `append_finding(...)` | `finding_count(&self) -> usize` | `FindingDetected` | safe finding / issue marker |
| 标记 partial / failed | `issue_refs`, `report_state`, `generated_at` | `partial(...)`;`failed(...)`;`mark_failed(...)` | `is_failed(&self) -> bool` | `Partial` / `Failed` | maintenance failure/partial marker |

```rust
/// Report-only reconciliation result for Identity maintenance.
pub struct ReconciliationReport {
    /// Report identity.
    pub report_ref: ReconciliationReportRef,

    /// Scope covered by this report.
    pub maintenance_scope_ref: MaintenanceScopeRef,

    /// Projection, reference, or report targets checked by this report.
    pub target_refs: Vec<IdentityMaintenanceTargetRef>,

    /// Body-free finding refs.
    pub finding_refs: Vec<ReconciliationFindingRef>,

    /// Safe issue refs for drift, unavailable dependency, partial result, or failure.
    pub issue_refs: Vec<MaintenanceIssueRef>,

    /// Report state.
    pub report_state: ReconciliationReportStateKind,

    /// Optional actor or system actor that generated the report.
    pub generated_by_ref: Option<ActorRef>,

    /// Report generation timestamp.
    pub generated_at: IdentityTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `report_ref` | `ReconciliationReportRef` | report identity | 来源于 Step 7 id generator / report store;不得拼 scope/time |
| `maintenance_scope_ref` | `MaintenanceScopeRef` | 报告范围 | 来自 job/request/config marker;不展开 affected target |
| `target_refs` | `Vec<IdentityMaintenanceTargetRef>` | 被检查目标 | 只能是 projection/reference/report marker;不得为 core truth write target |
| `finding_refs` | `Vec<ReconciliationFindingRef>` | 对账发现 refs | body-free;不得携带 repair action |
| `issue_refs` | `Vec<MaintenanceIssueRef>` | 漂移、失败、不可用问题 refs | safe marker;不得保存 raw diagnostic |
| `report_state` | `ReconciliationReportStateKind` | 报告状态 | `Partial` / `Failed` 必须显式暴露 |
| `generated_by_ref` | `Option<ActorRef>` | 生成 actor / system actor | 来自 operation context |
| `generated_at` | `IdentityTimestamp` | 报告生成时间 | 来自 clock;不得作为 report id 或 cursor |

| 状态 | 作用 | 允许来源 | 允许去向 / 约束 |
|---|---|---|---|
| `Generated` | 报告已生成且可读取 | report builder 成功 | 可根据 finding/issue 转为 `NoFinding` / `FindingDetected` / `Partial` |
| `NoFinding` | 范围内未发现漂移 | reconciliation completed with empty finding set | 仍是 report-only 结论;不表示 future clean |
| `FindingDetected` | 发现 drift / mismatch / unavailable issue | finding refs 非空 | 修复需走正式 owner 能力 |
| `Partial` | 部分范围失败或不可用 | partial job result | 不得伪造成 full success |
| `Failed` | 报告生成失败 | job/report failure marker | 必须携带 safe issue ref |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn generated(report_ref: ReconciliationReportRef, maintenance_scope_ref: MaintenanceScopeRef, target_refs: Vec<IdentityMaintenanceTargetRef>, finding_refs: Vec<ReconciliationFindingRef>, issue_refs: Vec<MaintenanceIssueRef>, generated_by_ref: Option<ActorRef>, generated_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建普通 report | 输入均为 body-free marker | `Result<ReconciliationReport, IdentityDomainError>` | 根据 finding/issue 决定 report state;不修复 truth |
| `pub fn no_finding(report_ref: ReconciliationReportRef, maintenance_scope_ref: MaintenanceScopeRef, target_refs: Vec<IdentityMaintenanceTargetRef>, generated_by_ref: Option<ActorRef>, generated_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建 no finding report | target refs 来自 prepared context | `Result<ReconciliationReport, IdentityDomainError>` | finding/issue 为空 |
| `pub fn failed(report_ref: ReconciliationReportRef, maintenance_scope_ref: MaintenanceScopeRef, issue_ref: MaintenanceIssueRef, generated_by_ref: Option<ActorRef>, generated_at: IdentityTimestamp) -> Result<Self, IdentityDomainError>` | 创建 failed report | issue 必填 | `Result<ReconciliationReport, IdentityDomainError>` | 不保存 raw failure |
| `pub fn append_finding(&mut self, finding_ref: ReconciliationFindingRef, issue_ref: Option<MaintenanceIssueRef>) -> Result<(), IdentityDomainError>` | 追加 finding | finding/issue 均为 marker | `Ok(())` 或 domain rejection | 只能从 `Generated` / `NoFinding` / `FindingDetected` 演进为 finding/partial |
| `pub fn mark_partial(&mut self, issue_ref: MaintenanceIssueRef, generated_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 partial | issue/time 来自 maintenance context | `Ok(())` 或 domain rejection | 不隐藏 partial |
| `pub fn mark_failed(&mut self, issue_ref: MaintenanceIssueRef, generated_at: IdentityTimestamp) -> Result<(), IdentityDomainError>` | 标记 failed | issue/time 来自 failure marker | `Ok(())` 或 domain rejection | failed 必须有 issue |
| `pub fn has_findings(&self) -> bool` | 判断是否有 finding | 无 | `bool` | 只看 finding refs |
| `pub fn is_failed(&self) -> bool` | 判断是否 failed | 无 | `bool` | `Failed` 返回 true |
| `pub fn assert_report_only(&self) -> Result<(), IdentityDomainError>` | 保证报告不被解释为修复计划 | 无 | `Ok(())` 或 domain rejection | report 不包含 repair action |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| finding 不等于 repair | 报告只描述问题,修复必须回到正式 command / owner 仓 |
| report 不保存正文 | external body、memory body、archive package、raw log、debug dump、secret 禁止入仓 |
| partial / failed 必须显式 | 不得把部分成功包装成 `NoFinding` 或 `Generated` |
| report 不替代 trace/audit | accepted business change trace 仍由 `IdentityTraceRecord` 承接 |
| target refs 必须是 maintenance target | 不允许 report 直接持有 mutable truth write target |

#### 7.14.8 本批并入 / 排除 / 后移对象

| 候选 / 相关对象 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MaintenanceTraceRecord` | 并入 `IdentityTraceRecord` / `ReconciliationReport` | 维护过程需要追溯,但不应形成第二套 history;accepted business change trace 与 report-only finding 已有正式对象 | 6.3 `IdentityTraceRecord`;6.4 `ReconciliationReport`;Step 8/9 maintenance trace material |
| `ProjectionRepository` / projection index | 后移 | repository/read/write/lookup surface 属于 Step 7 / Step 11,不是 Step 6 对象 | Step 7 port;Step 11 persistence / lookup |
| `ReferenceResolver` / external resolver summary port | 后移 | resolver trait、typed read、expected version 属于 Step 7/11 | Step 7 reference port;Step 11 version semantics |
| `RebuildIdentityProjection` / `RefreshExternalReferenceState` / `RunIdentityReconciliation` | 后移 | job DTO 和 flow 属于 Step 8/9 | Step 8 job protocol;Step 9 job flow |
| `MaintenanceJobRunner` / retry schedule | 后移 | runner、retry、schedule、backoff 属于 application / job / config 设计 | Step 7 / Step 14 |
| repair action / remediation plan | 排除 | 违反 report-only maintenance;修复必须走正式 owner 能力 | owner command flow 或相邻仓 |
| projection body / report raw diagnostic / external body | 排除 | forbidden body,不得进入 truth、projection、event、trace、report 或 handoff | Step 8 / 12 / 16 negative tests |
| affected projection expansion algorithm | 后移 | 需要正式 projection index / scope resolver,不能在 Step 6 自行定义 | Step 7/9/11 |

#### 7.14.9 6.4 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.14.1 明确 projection freshness、reference resolution、report-only、forbidden body |
| 是否有功能到对象映射 | 通过 | §7.14.2 将 projection state、reference state、policy、report 和 marker 分开 |
| 对象是否能回指 `02` / Step 5 | 通过 | 四个正式对象均来自“派生维护与对账”组成部分 |
| 字段来源是否闭合到当前 Step 粒度 | 通过但有待确认 | 字段均标注 request/job/prepared context/builder/resolver/clock 来源;具体 port/lookup/cursor 生成责任后移 Step 7/11 |
| 状态是否闭合 | 通过 | projection、reference、report state variant 已定义;完整迁移矩阵留 Step 10 |
| 是否越过 Step 7~11 | 未越过 | 未定义 repository/port/job DTO/flow/DDL/transaction/lookup SQL |
| query no-write 是否保持 | 通过 | query 只能读取 projection/reference/report state,不得 rebuild/refresh/reconcile |
| report-only maintenance 是否保持 | 通过 | `ReconciliationPolicy` 明确拒绝 identity truth repair 和 external truth repair |
| forbidden body 是否覆盖 | 通过 | finding material 和 issue marker 明确 raw diagnostic/external body/secret 不入仓 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.5` | 用户审核通过后进入 outbox / handoff / propagation 对象契约 |

#### 7.14.10 6.4 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| projection ref | `IdentityProjectionRef` 来自正式 projection builder / lookup | query 中拼 `member-summary:<member_id>` 或 `projection:<scope>` |
| source cursor | `ProjectionState::mark_stale(...)` 使用 `IdentityProjectionCursorRef` | 用 page cursor、timestamp、version、event id 或 idempotency key 当 source cursor |
| stale query | query 返回 stale/degraded surface | query 发现 stale 后同步 rebuild 并写 projection state |
| projection repair | rebuild 只更新 derived projection state / report issue | rebuild 过程中修改 `GlobalMember`、lifecycle、role、career 或 memory truth |
| reference state | `ReferenceResolutionState::Unavailable` 显式记录 safe issue marker | resolver unavailable 时用默认 empty summary 继续 accepted |
| external summary | `ExternalReferenceSafeSummaryRef` 只保存 body-free marker | 保存 method body、ProjectMember JSON、memory text 或 archive package |
| owner ref | `IdentityReferenceOwnerRef` 来自本仓 typed object mapper | 从 external id 字符串切割出 owner |
| maintenance policy | `ReconciliationPolicy` 拦截 `RepairExternalTruth` | reconciliation job 直接修复 method/work/memory/archive truth |
| finding material | `ReconciliationFindingMaterial::SafeRefsOnly` 进入 report | finding 保存 raw log、debug dump、secret 或外部正文 |
| report state | partial / failed 显式写成 `Partial` / `Failed` | 部分范围失败时仍返回 `NoFinding` |
| report-only | finding 只作为后续正式修复入口线索 | report 自动携带 remediation plan 并执行修复 |
| trace 边界 | 维护发现写 report,accepted business change trace 仍由 `IdentityTraceRecord` 表达 | 新建 `MaintenanceTraceRecord` 形成第二套 history |

### 7.15 6.5 outbox / handoff / propagation

本批处理“身份事实传播与外部交接”的对象契约,目标是让 accepted identity fact 的 outbox material、publish state、trace / audit / archive handoff intent、handoff state 和传播 / 交接 guard 在 Step 6 内具备可落码字段、状态、函数和不变量。6.5 是 outbox / handoff / propagation 对象批次,不是 publisher port、event envelope DTO、handoff adapter、worker runner、retry schedule、topic 配置、receipt schema、transaction order 或 DDL 批次。

本批统一命名:出站事件主语使用 `IdentityOutboxSubjectRef`。`outbound subject` 只作为语义描述,不另开 `IdentityOutboundSubjectRef`,避免 Step 7 subject mapper 出现两套 canonical key。

#### 7.15.1 6.5 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 承接对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 从 accepted identity fact 准备出站 material | accepted change、trace record、visibility context、topic marker | `IdentityOutboxRecord` | 初始 `OutboxState::PendingPublish` | `IdentityOutboxRecord`,`OutboundEventPolicy` | Step 7 outbox repository / publisher boundary;Step 8 outbound DTO |
| 表达 outbox 发布生命周期 | publish attempt marker、issue marker、clock | `OutboxState` | pending / published / retryable / failed / skipped | `OutboxState` | Step 9 publish flow;Step 10 publish state matrix |
| 限制 event payload 为 body-free marker | safe payload marker、forbidden material marker、visibility summary | accepted / rejected guard result | 不写 truth | `OutboundEventPolicy` | Step 8 rejection surface;Step 12 forbidden body |
| 准备 trace / audit / archive handoff 意图 | trace refs、audit trail ref、target、scope、safe material marker | `TraceHandoffIntent` | 初始 `HandoffState::PendingHandoff` | `TraceHandoffIntent`,`HandoffPolicy` | Step 7 handoff boundary;Step 8 handoff command / job DTO |
| 表达 handoff 交付生命周期 | handoff attempt marker、receipt marker、issue marker、clock | `HandoffState` | pending / delivered / retryable / failed / cancelled | `HandoffState` | Step 9 handoff result flow;Step 10 handoff state matrix |
| 防止 handoff 伪成功和正文泄露 | target / scope、trace refs、safe material、receipt marker | accepted / rejected guard result | 不写外部 truth | `HandoffPolicy` | Step 12 fake delivered / forbidden receipt body |
| 保持传播失败不回滚 accepted truth | outbox / handoff state 与 accepted truth 分离 | failure marker / retryable marker | 只更新传播状态 | `OutboxState`,`HandoffState` | Step 11 transaction order;Step 13 duplicate replay |

#### 7.15.2 功能到对象映射

| 功能 | 正式对象 | 对象能力 | 不进入本对象的内容 |
|---|---|---|---|
| accepted fact 出站记录 | `IdentityOutboxRecord` | 保存出站记录 ref、member、subject、change kind、payload marker、topic、trace ref 和 publish state | event envelope body、publisher adapter、topic config、consumer receipt |
| outbox 发布状态 | `OutboxState` | 表达 pending、published、retryable failed、failed、skipped by policy | accepted truth 状态、下游业务处理状态、retry schedule |
| outbox / event guard | `OutboundEventPolicy` | 校验 accepted-only、body-free、visibility、topic boundary、publish 非 accepted gate | 真实发布、topic 字符串解析、repository 读取、外部状态查询 |
| trace / audit / archive handoff 意图 | `TraceHandoffIntent` | 保存 handoff ref、member、trace refs、optional audit trail、target、scope、safe material 和 handoff state | archive package、observability raw log、receipt body、handoff adapter |
| handoff 交付状态 | `HandoffState` | 表达 pending、delivered、retryable failed、failed、cancelled | memory relation state、external archive truth、receipt body |
| handoff guard | `HandoffPolicy` | 校验 target/scope、trace refs、safe material、visibility 和 receipt marker | 执行 handoff、定义 receipt schema、修复 trace / audit 缺口 |

#### 7.15.3 6.5 typed refs / marker 收敛

| 类型 / marker | 分类 | 来源 | 使用对象 | 不变量 |
|---|---|---|---|---|
| `IdentityOutboxRecordId` / `IdentityOutboxRecordRef` | identity-owned outbox id/ref | Step 7 id generator 或 persistence identity;本批不定义生成算法 | `IdentityOutboxRecord` | opaque typed wrapper,不得从 member id、trace id 或 topic 字符串拼接 |
| `IdentityOutboxSubjectRef` | canonical outbound subject marker | Step 7 subject mapper 从 accepted truth ref 映射 | `IdentityOutboxRecord`,`OutboundEventPolicy` | 与 trace/audit subject 不得强转;不得手写 `member:<id>` |
| `IdentityOutboxPayloadMarkerRef` | body-free outbound payload marker | accepted change assembler / event material builder | `IdentityOutboxRecord`,`OutboundEventPolicy` | 只指向安全 snapshot / marker,不得包含 role body、work body、memory body、archive package 或 secret |
| `TopicKeyRef` | outbound routing boundary ref | Step 7/14 topic binding 或 event boundary | `IdentityOutboxRecord`,`OutboundEventPolicy` | 不在 Step 6 定义 topic 字符串、broker name 或 envelope schema |
| `OutboxDeliveryAttemptRef` | publish attempt marker | publisher boundary result | `OutboxState` | 只标识尝试,不代表下游消费成功 |
| `OutboxDeliveryIssueRef` | publish issue marker | publisher boundary failure / policy skip | `OutboxState` | 必须 body-free;不得保存 broker raw error body 或 secret |
| `TraceHandoffIntentId` / `TraceHandoffIntentRef` | identity-owned handoff id/ref | Step 7 id generator 或 persistence identity;本批不定义生成算法 | `TraceHandoffIntent` | opaque typed wrapper,不得从 target / trace ref 临时拼接 |
| `HandoffTargetRef` | handoff boundary target | Step 7/14 handoff target binding | `TraceHandoffIntent`,`HandoffPolicy` | target 是 boundary ref,不是 identity-owned external system truth |
| `HandoffScopeRef` | handoff scope marker | request / prepared handoff context / config binding | `TraceHandoffIntent`,`HandoffPolicy` | 不展开为外部目录、bucket、tenant 或 archive path |
| `TraceHandoffSafeMaterialRef` | handoff safe material marker | trace/audit material assembler | `TraceHandoffIntent`,`HandoffPolicy` | 只保存 safe refs / marker,不得保存 trace body、audit raw log、archive package 或 observability raw log |
| `HandoffAttemptRef` | handoff attempt marker | handoff adapter boundary result | `HandoffState` | 只标识交接尝试,不代表 delivered |
| `HandoffReceiptRef` | handoff receipt marker | formal handoff result / callback | `HandoffState`,`HandoffPolicy` | `Delivered` 必须绑定 receipt marker;receipt body 不入 identity |
| `HandoffIssueRef` | handoff issue marker | handoff adapter failure / policy cancel | `HandoffState` | 必须 body-free;不得保存 external receipt body、raw log 或 package |

Propagation attempt / issue / receipt refs are body-free marker wrappers:

```rust
pub struct OutboxDeliveryAttemptRef {
    pub attempt_ref: IdentitySourceRef,
}

pub struct OutboxDeliveryIssueRef {
    pub issue_ref: IdentitySourceRef,
}

pub struct HandoffAttemptRef {
    pub attempt_ref: IdentitySourceRef,
}

pub struct HandoffReceiptRef {
    pub receipt_ref: IdentitySourceRef,
}

pub struct HandoffIssueRef {
    pub issue_ref: IdentitySourceRef,
}
```

`OutboxDeliveryIssueRef` and `HandoffIssueRef` remain the canonical state markers stored in `OutboxState` and `HandoffState`. Operations job reports expose only `MaintenanceIssueRef`, so application job flow must use the Step 7 maintenance issue mapper to project propagation issue markers into report issue refs. The mapper copies the body-free issue source marker into `MaintenanceIssueRef.issue_ref` and supplies the maintenance issue kind from the formal publisher / handoff outcome:

| Propagation outcome | Source marker | Job report issue kind |
|---|---|---|
| outbox `RetryableFailed` | `OutboxDeliveryIssueRef.issue_ref` | `MaintenanceIssueKind::Unavailable` |
| outbox `PermanentlyFailed` | `OutboxDeliveryIssueRef.issue_ref` | `MaintenanceIssueKind::Failed` |
| outbox `SkippedByPolicy` | `OutboxDeliveryIssueRef.issue_ref` | `MaintenanceIssueKind::Failed` |
| outbox `UnsupportedTopic` | `OutboxDeliveryIssueRef.issue_ref` | `MaintenanceIssueKind::Unrecognized` |
| handoff `RetryableFailed` | `HandoffIssueRef.issue_ref` | `MaintenanceIssueKind::Unavailable` |
| handoff `PermanentlyFailed` | `HandoffIssueRef.issue_ref` | `MaintenanceIssueKind::Failed` |
| handoff `CancelledByPolicy` | `HandoffIssueRef.issue_ref` | `MaintenanceIssueKind::Failed` |
| handoff `UnsupportedTarget` | `HandoffIssueRef.issue_ref` | `MaintenanceIssueKind::Unrecognized` |

This is a projection into job/report surface, not a replacement for propagation state. Service code, fake runtime, and durable adapters must not invent a different issue kind from raw adapter error text, broker status, HTTP status, target path, payload body, receipt body, topic string, or private fake map.

#### 7.15.4 `IdentityOutboxRecord`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `contracts` 定义 ref / public marker;`domain` 定义对象与 policy-facing helper;`application` 负责编排创建和状态更新 |
| 承接 capability | accepted fact propagation、consumer boundary、publish failure visibility |
| 对象类别 | Outbox record |
| 主要责任 | 保存 accepted identity fact 的安全出站 material marker、topic boundary、trace 关联和 publish state |
| 不承担什么 | 不保存 event envelope body、不发布消息、不保存下游 receipt、不重算或修改 accepted truth |
| 后续 Step 承接 | Step 7 outbox repository / publisher port;Step 8 outbound event DTO;Step 9 publish flow;Step 11 outbox persistence;Step 13 duplicate replay |

对象能力:

| 能力 | 字段 / 函数承接 | 说明 |
|---|---|---|
| 绑定 accepted change 主语 | `member_ref`,`subject_ref`,`change_kind_ref`,`trace_record_ref` | 必须能回指 accepted change 和 trace |
| 保存安全 payload marker | `payload_marker_ref` | payload marker 不等于 payload body |
| 绑定 routing boundary | `topic_key_ref` | topic 只作为 boundary ref |
| 表达 publish state | `outbox_state` 和 `mark_*` 函数 | 状态变化不回滚 accepted truth |

```rust
pub struct IdentityOutboxRecord {
    pub outbox_record_ref: IdentityOutboxRecordRef,
    pub member_ref: GlobalMemberRef,
    pub subject_ref: IdentityOutboxSubjectRef,
    pub change_kind_ref: IdentityChangeKindRef,
    pub payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    pub topic_key_ref: TopicKeyRef,
    pub trace_record_ref: IdentityTraceRecordRef,
    pub outbox_state: OutboxState,
    pub created_at: IdentityTimestamp,
    pub updated_at: IdentityTimestamp,
}
```

字段来源:

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `outbox_record_ref` | `IdentityOutboxRecordRef` | id generator / persistence identity | 不得从 subject/topic/trace 拼接 |
| `member_ref` | `GlobalMemberRef` | accepted truth 主语 | 必须与 trace subject 对应同一成员语义 |
| `subject_ref` | `IdentityOutboxSubjectRef` | formal subject mapper | 不得字符串拼接或从 trace subject 强转 |
| `change_kind_ref` | `IdentityChangeKindRef` | accepted change intent / trace | 必须与 trace change kind 一致 |
| `payload_marker_ref` | `IdentityOutboxPayloadMarkerRef` | body-free payload material builder | 不保存 payload body |
| `topic_key_ref` | `TopicKeyRef` | event boundary / topic binding | 不写 broker/topic 字符串规则 |
| `trace_record_ref` | `IdentityTraceRecordRef` | accepted trace append result | outbox 不得无 trace 创建 |
| `outbox_state` | `OutboxState` | factory 初始 pending;publish result 更新 | `Published` 不代表 downstream consumed |
| `created_at` / `updated_at` | `IdentityTimestamp` | clock port | 不替代 cursor/version |

函数 / factory:

| 函数签名 | 作用 | 参数来源 | 不变量 |
|---|---|---|---|
| `pub fn from_accepted_change(args: IdentityOutboxRecordCreateArgs) -> Result<Self, DomainError>` | 从 accepted change 准备 pending outbox | accepted truth、trace、subject mapper、payload marker、topic marker、clock | 初始状态必须为 `OutboxState::PendingPublish`;payload marker body-free |
| `pub fn belongs_to(&self, member_ref: &GlobalMemberRef) -> bool` | 判断成员归属 | caller supplied typed ref | 只比较 typed ref |
| `pub fn matches_subject(&self, subject_ref: &IdentityOutboxSubjectRef) -> bool` | 判断出站主语 | formal subject ref | 不解析内部字符串 |
| `pub fn mark_published(&mut self, state: OutboxState) -> Result<(), DomainError>` | 更新为发布成功 | publisher boundary 状态 | `state` 必须是 `Published` 且带 attempt marker |
| `pub fn mark_retryable_failed(&mut self, state: OutboxState) -> Result<(), DomainError>` | 更新为可重试失败 | publisher failure marker | 不允许清空 payload/trace |
| `pub fn mark_failed(&mut self, state: OutboxState) -> Result<(), DomainError>` | 更新为失败 | publisher failure marker | 不回滚 accepted truth |
| `pub fn mark_skipped_by_policy(&mut self, state: OutboxState) -> Result<(), DomainError>` | 更新为策略跳过 | policy issue marker | 必须保留 issue marker |

不变量:

| 不变量 | 说明 |
|---|---|
| outbox 只能来自 accepted identity fact | pending outbox 不得从 draft / rejected / query material 创建 |
| outbox 必须绑定 trace | 没有 `trace_record_ref` 的 outbox 不可创建 |
| payload marker 必须 body-free | event body、secret、external body、archive package 不入 `IdentityOutboxRecord` |
| topic 是 boundary ref | topic 字符串、broker、routing expression 留给 Step 7/14 |
| publish 失败不回滚 accepted truth | 只改变 `OutboxState` |

#### 7.15.5 `OutboxState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `contracts` 定义 state kind / public marker;`domain` 定义 state value 与转换 helper |
| 承接 capability | publish lifecycle、failure visibility、retry boundary |
| 对象类别 | State value |
| 主要责任 | 表达 outbox publish lifecycle,区分 pending、published、retryable failed、failed 和 skipped by policy |
| 不承担什么 | 不表达 command accepted 状态、不表达下游业务处理状态、不定义 retry schedule |
| 后续 Step 承接 | Step 9 publish flow;Step 10 state matrix;Step 12 retryable / failed surface;Step 14 retry config |

```rust
pub enum OutboxStateKind {
    PendingPublish,
    Published,
    RetryableFailed,
    Failed,
    SkippedByPolicy,
}

pub struct OutboxState {
    pub state_kind: OutboxStateKind,
    pub attempt_ref: Option<OutboxDeliveryAttemptRef>,
    pub issue_ref: Option<OutboxDeliveryIssueRef>,
    pub changed_at: IdentityTimestamp,
}
```

状态语义:

| 状态 | 必填字段 | 语义 | 禁止解释 |
|---|---|---|---|
| `PendingPublish` | `changed_at` | outbox 已创建,等待 publish | 不代表 publish 已尝试 |
| `Published` | `attempt_ref`,`changed_at` | publisher boundary 成功接收 / 发布 | 不代表所有下游消费成功 |
| `RetryableFailed` | `issue_ref`,`changed_at` | publish 失败但可重试 | 不代表 command rejected |
| `Failed` | `issue_ref`,`changed_at` | publish 失败且需报告或人工处理 | 不回滚 accepted truth |
| `SkippedByPolicy` | `issue_ref`,`changed_at` | policy 判定不传播 | 不允许静默删除 outbox |

函数 / factory:

| 函数签名 | 作用 | 不变量 |
|---|---|---|
| `pub fn pending(changed_at: IdentityTimestamp) -> Self` | 创建 pending publish 状态 | 不带 attempt / issue |
| `pub fn published(attempt_ref: OutboxDeliveryAttemptRef, changed_at: IdentityTimestamp) -> Self` | 创建 published 状态 | 必须有 attempt marker |
| `pub fn retryable_failed(issue_ref: OutboxDeliveryIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建可重试失败状态 | 必须有 issue marker |
| `pub fn failed(issue_ref: OutboxDeliveryIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建失败状态 | 必须有 issue marker |
| `pub fn skipped_by_policy(issue_ref: OutboxDeliveryIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建策略跳过状态 | 必须有 issue marker |
| `pub fn is_retryable(&self) -> bool` | 判断是否可由 retry job 处理 | 仅 `RetryableFailed` 为 true |
| `pub fn is_terminal(&self) -> bool` | 判断是否终态候选 | `Published` / `Failed` / `SkippedByPolicy` 为终态候选 |

#### 7.15.6 `OutboundEventPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `domain` policy;`contracts` 提供 marker/ref |
| 承接 capability | accepted-only propagation、visibility guard、forbidden body guard、publish not acceptance gate |
| 对象类别 | Policy / Guard |
| 主要责任 | 校验 outbox / event material 只能来自 accepted identity fact,且满足 body-free、visibility、topic boundary 和最终一致约束 |
| 不承担什么 | 不发布消息、不读取 repository、不查询下游、不生成 topic、不改变 accepted truth |
| 后续 Step 承接 | Step 7 subject mapper / visibility resolver / publisher port;Step 8 event material DTO;Step 12 rejected / skipped surface |

```rust
pub struct OutboundEventPolicy {
    pub subject_ref: IdentityOutboxSubjectRef,
    pub change_kind_ref: IdentityChangeKindRef,
    pub payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    pub topic_key_ref: TopicKeyRef,
    pub visibility_context_ref: VisibilityContextRef,
}
```

函数 / factory:

| 函数签名 | 作用 | 参数来源 | 不变量 |
|---|---|---|---|
| `pub fn for_outbox(args: OutboundEventPolicyArgs) -> Result<Self, DomainError>` | 构造 event guard | subject mapper、change intent、payload marker、topic marker、visibility context | 不读取 repository |
| `pub fn assert_from_accepted_change(&self, trace_record_ref: &IdentityTraceRecordRef) -> Result<(), DomainError>` | 校验来源为 accepted change | accepted trace ref | 不能用 pending/draft/rejected material |
| `pub fn assert_payload_body_free(&self) -> Result<(), DomainError>` | 校验 payload marker 安全 | `payload_marker_ref` | forbidden body 必须 rejected / skipped |
| `pub fn assert_visible_for_topic(&self) -> Result<(), DomainError>` | 校验传播可见性 | prepared visibility context | 不调用授权系统 |
| `pub fn assert_publish_not_acceptance_gate(&self) -> Result<(), DomainError>` | 固定最终一致边界 | 无 | publish 成功不得作为 command accepted 前置 |

不变量:

| 不变量 | 说明 |
|---|---|
| accepted-only | outbox material 只能来自 accepted identity truth change |
| body-free | outbound payload 只能是 safe marker/snapshot ref |
| visibility first | 不可见 material 不得进入正常 publish payload |
| topic ref only | topic / envelope / broker binding 后移 Step 7/14 |
| failure separated | publisher failure 只能进入 `OutboxState`,不得反向修改 truth |

#### 7.15.7 `TraceHandoffIntent`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `contracts` 定义 ref / public marker;`domain` 定义对象与 helper;`application` 编排 prepare / update |
| 承接 capability | trace / audit / archive handoff、audit constraint、handoff failure visibility |
| 对象类别 | Handoff intent |
| 主要责任 | 表达 trace、audit、archive 或 observability 承接方的交接意图、target、scope、安全 material marker 和 handoff state |
| 不承担什么 | 不保存 archive package、不保存 observability raw log、不定义 receipt body、不执行 adapter delivery |
| 后续 Step 承接 | Step 7 handoff repository / adapter port;Step 8 prepare handoff / result DTO;Step 9 handoff flow;Step 14 target config |

对象能力:

| 能力 | 字段 / 函数承接 | 说明 |
|---|---|---|
| 绑定 trace / audit material | `trace_record_refs`,`audit_trail_ref` | handoff 必须可追溯 |
| 绑定 target / scope | `handoff_target_ref`,`handoff_scope_ref` | 只保存 boundary refs |
| 保存 safe material marker | `safe_material_ref` | 不保存 package/body |
| 表达 delivery lifecycle | `handoff_state` 和 `mark_*` 函数 | delivered 必须来自 receipt marker |

```rust
pub struct TraceHandoffIntent {
    pub handoff_intent_ref: TraceHandoffIntentRef,
    pub member_ref: GlobalMemberRef,
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,
    pub audit_trail_ref: Option<AuditTrailRef>,
    pub handoff_target_ref: HandoffTargetRef,
    pub handoff_scope_ref: HandoffScopeRef,
    pub safe_material_ref: TraceHandoffSafeMaterialRef,
    pub handoff_state: HandoffState,
    pub created_at: IdentityTimestamp,
    pub updated_at: IdentityTimestamp,
}
```

字段来源:

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `handoff_intent_ref` | `TraceHandoffIntentRef` | id generator / persistence identity | 不得从 target / scope / trace 临时拼接 |
| `member_ref` | `GlobalMemberRef` | handoff request / loaded trace context | 必须与 trace refs 关联的成员语义一致 |
| `trace_record_refs` | `Vec<IdentityTraceRecordRef>` | accepted trace selection / prepared handoff context | 不得为空 |
| `audit_trail_ref` | `Option<AuditTrailRef>` | prepared handoff context | optional 不代表 trace 可为空 |
| `handoff_target_ref` | `HandoffTargetRef` | request / config binding | 只作为 boundary ref |
| `handoff_scope_ref` | `HandoffScopeRef` | request / prepared scope | 不展开外部存储路径 |
| `safe_material_ref` | `TraceHandoffSafeMaterialRef` | handoff material builder | 不保存 package/body/raw log |
| `handoff_state` | `HandoffState` | factory 初始 pending;handoff result 更新 | `Delivered` 必须带 receipt marker |
| `created_at` / `updated_at` | `IdentityTimestamp` | clock port | 不替代 cursor/version |

函数 / factory:

| 函数签名 | 作用 | 参数来源 | 不变量 |
|---|---|---|---|
| `pub fn prepare(args: TraceHandoffIntentPrepareArgs) -> Result<Self, DomainError>` | 创建 pending handoff intent | trace refs、audit ref、target/scope、safe material、clock | trace refs 非空;初始 `PendingHandoff`;material body-free |
| `pub fn targets(&self, target_ref: &HandoffTargetRef) -> bool` | 判断目标 | caller supplied typed ref | 不解析 target 字符串 |
| `pub fn contains_trace(&self, trace_record_ref: &IdentityTraceRecordRef) -> bool` | 判断 trace 是否包含 | typed trace ref | 只比较 typed ref |
| `pub fn mark_delivered(&mut self, state: HandoffState) -> Result<(), DomainError>` | 标记 delivered | formal receipt marker state | `state` 必须是 `Delivered` 且含 receipt marker |
| `pub fn mark_retryable_failed(&mut self, state: HandoffState) -> Result<(), DomainError>` | 标记可重试失败 | handoff issue marker | 不允许清空 trace/material refs |
| `pub fn mark_failed(&mut self, state: HandoffState) -> Result<(), DomainError>` | 标记失败 | handoff issue marker | 不回滚 accepted truth |
| `pub fn mark_cancelled(&mut self, state: HandoffState) -> Result<(), DomainError>` | 标记取消 | policy issue marker | 必须保留 issue marker |

不变量:

| 不变量 | 说明 |
|---|---|
| handoff intent 必须绑定 trace refs | 无 trace refs 的 handoff 不可创建 |
| safe material 必须 body-free | archive package、receipt body、observability raw log 不入对象 |
| target/scope 是 boundary refs | adapter/schema/config 留给 Step 7/14 |
| delivered 必须来自 formal receipt marker | request sent、attempt ref、job success log 均不能当 delivered |
| handoff failure 不回滚 accepted truth | 只改变 handoff state |

#### 7.15.8 `HandoffState`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `contracts` 定义 state kind / public marker;`domain` 定义 state value 与转换 helper |
| 承接 capability | handoff lifecycle、receipt marker、fake delivered guard、failure visibility |
| 对象类别 | State value |
| 主要责任 | 表达 trace / audit / archive handoff 的 pending、delivered、retryable failed、failed 和 cancelled 状态 |
| 不承担什么 | 不表达 `MemoryReferenceState`、不保存 receipt body、不决定 external archive truth |
| 后续 Step 承接 | Step 9 handoff flow;Step 10 state matrix;Step 12 fake delivered / failed surface;Step 14 target binding |

```rust
pub enum HandoffStateKind {
    PendingHandoff,
    Delivered,
    RetryableFailed,
    Failed,
    Cancelled,
}

pub struct HandoffState {
    pub state_kind: HandoffStateKind,
    pub attempt_ref: Option<HandoffAttemptRef>,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub issue_ref: Option<HandoffIssueRef>,
    pub changed_at: IdentityTimestamp,
}
```

状态语义:

| 状态 | 必填字段 | 语义 | 禁止解释 |
|---|---|---|---|
| `PendingHandoff` | `changed_at` | intent 已创建,等待交接 | 不代表 request 已发送或 delivered |
| `Delivered` | `attempt_ref`,`receipt_ref`,`changed_at` | 已收到 formal receipt marker | 不保存 receipt body,不等于 external archive truth |
| `RetryableFailed` | `attempt_ref`,`issue_ref`,`changed_at` | 交接失败但可重试 | 不代表 trace / audit 失败 |
| `Failed` | `attempt_ref`,`issue_ref`,`changed_at` | 交接失败且需报告或人工处理 | 不回滚 accepted truth |
| `Cancelled` | `issue_ref`,`changed_at` | 策略或配置取消交接 | 不允许静默删除 intent |

函数 / factory:

| 函数签名 | 作用 | 不变量 |
|---|---|---|
| `pub fn pending(changed_at: IdentityTimestamp) -> Self` | 创建 pending handoff 状态 | 不带 attempt / receipt / issue |
| `pub fn delivered(attempt_ref: HandoffAttemptRef, receipt_ref: HandoffReceiptRef, changed_at: IdentityTimestamp) -> Self` | 创建 delivered 状态 | 必须带 formal receipt marker |
| `pub fn retryable_failed(attempt_ref: HandoffAttemptRef, issue_ref: HandoffIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建可重试失败状态 | issue marker body-free |
| `pub fn failed(attempt_ref: HandoffAttemptRef, issue_ref: HandoffIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建失败状态 | issue marker body-free |
| `pub fn cancelled(issue_ref: HandoffIssueRef, changed_at: IdentityTimestamp) -> Self` | 创建取消状态 | 必须说明取消 marker |
| `pub fn is_retryable(&self) -> bool` | 判断是否可重试 | 仅 `RetryableFailed` 为 true |
| `pub fn is_terminal(&self) -> bool` | 判断是否终态候选 | `Delivered` / `Failed` / `Cancelled` 为终态候选 |

#### 7.15.9 `HandoffPolicy`

| 项 | 结论 |
|---|---|
| 所属批次 | `6.5` |
| 所属业务组成部分 | 身份事实传播与外部交接 |
| 归属 crate | `domain` policy;`contracts` 提供 marker/ref |
| 承接 capability | handoff target guard、safe material guard、receipt marker guard、fake delivered guard |
| 对象类别 | Policy / Guard |
| 主要责任 | 校验 handoff intent 的 target、scope、trace refs、safe material、visibility 和 receipt marker 均符合安全交接边界 |
| 不承担什么 | 不执行 handoff、不定义 adapter/receipt schema、不读取 repository、不保存 external body、不改变 accepted truth |
| 后续 Step 承接 | Step 7 handoff adapter / target resolver;Step 8 handoff result DTO;Step 12 fake delivered / forbidden receipt body |

```rust
pub struct HandoffPolicy {
    pub handoff_target_ref: HandoffTargetRef,
    pub handoff_scope_ref: HandoffScopeRef,
    pub safe_material_ref: TraceHandoffSafeMaterialRef,
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,
    pub visibility_context_ref: VisibilityContextRef,
}
```

函数 / factory:

| 函数签名 | 作用 | 参数来源 | 不变量 |
|---|---|---|---|
| `pub fn for_handoff(args: HandoffPolicyArgs) -> Result<Self, DomainError>` | 构造 handoff guard | request / prepared handoff context / visibility context | 不读取 repository |
| `pub fn assert_target_allowed(&self) -> Result<(), DomainError>` | 校验 target/scope 合法 | prepared target/scope marker | 不解析外部路径或 adapter config |
| `pub fn assert_trace_refs_present(&self) -> Result<(), DomainError>` | 校验 trace refs 非空 | prepared trace selection | 无 trace 不可 handoff |
| `pub fn assert_safe_material_body_free(&self) -> Result<(), DomainError>` | 校验 safe material | safe material marker | body/package/raw log 必须 rejected |
| `pub fn assert_visible_for_handoff(&self) -> Result<(), DomainError>` | 校验 handoff 可见性 | prepared visibility context | 不调用授权系统 |
| `pub fn assert_receipt_is_marker(receipt_ref: &HandoffReceiptRef) -> Result<(), DomainError>` | 校验 receipt 只为 marker/ref | formal handoff result | receipt body 不入 identity |
| `pub fn assert_delivered_requires_receipt(state: &HandoffState) -> Result<(), DomainError>` | 防止伪 delivered | handoff result state | delivered 无 receipt 必须 rejected |

不变量:

| 不变量 | 说明 |
|---|---|
| target/scope 不由实现侧推断 | 必须来自 formal marker / config binding |
| trace refs 非空 | handoff 必须可追溯 |
| safe material body-free | trace body、audit raw log、archive package、receipt body 不入仓 |
| delivered 只能由 receipt marker 触发 | attempt success log / HTTP 2xx / job completed 不等于 delivered |
| handoff 不修复外部 truth | external archive / observability truth 不归 identity |

#### 7.15.10 本批并入 / 后移 / 排除对象

| 候选 / 概念 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `OutboxPendingView` | 并入 `IdentityOutboxRecord` 查询切片 | pending view 是 outbox record 的读取条件,不是新的 truth owner | Step 7 query / job read surface |
| `HandoffTraceRecord` | 并入 `IdentityTraceRecord` / `TraceHandoffIntent` | handoff 过程需要追溯,但不建立第二套 trace truth | Step 8 handoff trace material;Step 15 observability |
| `TopicKey` / `TopicKeyRef` | 保留为 boundary ref / 字段 | topic routing 不归 identity truth | Step 7 event boundary;Step 14 config binding |
| `HandoffTargetRef` / `HandoffScopeRef` | 保留为 boundary ref / 字段 | target/scope 由 handoff boundary 和配置决定 | Step 7 target resolver;Step 14 handoff config |
| `HandoffReceiptRef` | 保留为 receipt marker / 字段 | receipt body 不入 identity,但 delivered 必须有 marker | Step 8 result DTO;Step 12 fake delivered |
| event envelope schema | 后移 | 属于协议契约,不是 Step 6 object contract | Step 8 |
| publisher / handoff adapter trait | 后移 | 属于 port / adapter 契约 | Step 7 |
| retry runner / backoff schedule | 后移 | 属于 job / config / operations 设计 | Step 9 / Step 14 |
| outbox transaction order / unique index | 后移 | 属于 persistence / consistency 契约 | Step 11 |
| external receipt body / archive package / raw log | 排除 | forbidden body,不得进入 identity object | Step 12 / Step 16 negative tests |

#### 7.15.11 6.5 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.15.1 明确 accepted fact outbox、publish state、handoff intent、handoff state 和 guard 能力 |
| 是否有功能到对象映射 | 通过 | §7.15.2 将 record、state、policy、intent 分开 |
| 对象是否能回指 `02` / Step 5 | 通过 | 六个正式对象均来自“身份事实传播与外部交接”组成部分 |
| subject / payload / receipt marker 是否收口 | 通过但有待确认 | 本批固定 `IdentityOutboxSubjectRef`、payload marker body-free、receipt marker required;具体 mapper / DTO / config 后移 Step 7/8/14 |
| 状态是否闭合到 Step 6 粒度 | 通过 | `OutboxStateKind` 与 `HandoffStateKind` 已定义;完整迁移矩阵留 Step 10 |
| 是否越过 Step 7~11 | 未越过 | 未定义 publisher/adapter trait、event schema、query/job flow、DDL、transaction、retry schedule |
| publish 是否错误成为 accepted 前置 | 未发生 | `OutboundEventPolicy` 明确 publish not acceptance gate |
| handoff 是否伪 delivered | 未发生 | `HandoffState::Delivered` 必须带 formal receipt marker |
| forbidden body 是否覆盖 | 通过 | payload、safe material、issue、receipt 均禁止 body/package/raw log/secret |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.6` | 用户审核通过后进入 application helper objects |

#### 7.15.12 6.5 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| outbox subject | `IdentityOutboxSubjectRef` 来自 formal subject mapper | service 拼 `member:<id>` / `career:<id>` |
| payload material | `IdentityOutboxPayloadMarkerRef` 指向 body-free snapshot marker | outbox 保存 role definition body、work JSON、memory text、archive package |
| topic | `TopicKeyRef` 来自 topic binding | 在 domain object 写死 Kafka topic / exchange / URL |
| pending outbox | accepted change 后创建 `OutboxState::PendingPublish` | 等 publisher 成功后才让 command accepted |
| published | `Published` 带 `OutboxDeliveryAttemptRef`,只代表 outbound boundary 成功 | 把 `Published` 当成所有下游 consumer 已处理 |
| retryable failed | `RetryableFailed` 带 body-free issue marker | 失败时静默丢弃 outbox 或回滚 accepted truth |
| skipped by policy | `SkippedByPolicy` 带 issue marker 并可追溯 | 因不可见直接删除 outbox 记录 |
| handoff intent | `TraceHandoffIntent` 至少包含一个 `IdentityTraceRecordRef` | 无 trace refs 只按 target 创建 handoff |
| safe handoff material | `TraceHandoffSafeMaterialRef` 只保存 safe refs / marker | handoff intent 保存 archive package、receipt body、observability raw log |
| delivered | `HandoffState::Delivered` 必须带 formal `HandoffReceiptRef` | request sent、HTTP 2xx、job log success 就标记 delivered |
| handoff failure | `RetryableFailed` / `Failed` 显式保存 `HandoffIssueRef` | handoff adapter 抛错后吞掉状态 |
| receipt | receipt 只以 marker/ref 入仓 | 保存 external receipt body 或签名原文 |
| memory relation vs handoff delivery | `MemoryReferenceState::HandoffPending` 与 `HandoffState::PendingHandoff` 分离 | 用 handoff delivered 状态覆盖 memory relation truth |
| trace history | handoff 过程引用 `IdentityTraceRecord` 或 intent history marker | 新建 `HandoffTraceRecord` 作为第二套 trace truth |
| retry schedule | state 只标记 retryable | 在 `OutboxState` / `HandoffState` 中定义 backoff 算法 |

### 7.16 6.6 application helper objects

本批只收敛 application 层支撑对象。它们不是 domain truth,也不是 public DTO、port trait、handler result、repository record 或 runtime state。它们的职责是把 command / query / consumer / job / handoff callback 入口带来的元数据、幂等语义、stored replay surface、可见性裁决和 job report 汇总成可传入 service flow 的稳定对象,避免后续 Step 7~13 在 implementation 里临时补 context、digest、stored result、visibility 或 job report 规则。

#### 7.16.1 6.6 capability / 功能清单

| capability | 来源 | 需要的 application object surface | 本批边界 |
|---|---|---|---|
| 统一 operation metadata | `02` §7 command / query / consumer / job 均要求 actor、metadata、idempotency / cursor / trace context | `IdentityOperationContext` | 只定义 context 字段和 factory;不定义 API/worker/job entry DTO |
| 幂等 reserve / complete / replay 判断 | `02` §8 / §12 要求 accepted、rejected、duplicate replay 闭环 | `IdentityIdempotencyRecord`、`IdentityIdempotencyKey`、`IdentityRequestDigest` | 只定义 record state 和 digest identity;repository reserve/load/save 留 Step 7/13 |
| 请求摘要稳定化 | command / consumer / job 需要 same key same digest / same key different digest 判断 | `IdentityRequestDigest` | 只固定 canonical material marker;hash 算法、canonical serialization 留 Step 8/13 |
| stored result replay surface | duplicate command / consumer / job 不能重跑 mutation | `StoredIdentityOperationResult`;`IdentityCommandAcceptedResultEnvelope`;`IdentityCommandRejectedResultEnvelope` | generic shell 只标记 stored kind;command accepted/rejected typed envelope 是 command replay 的正式 public surface 来源 |
| accepted command effect 汇总 | accepted path 必须关联 truth、trace、audit、outbox、stale projection、stored result | `IdentityCommandEffectSummary` | 只作为 application 汇总对象;不定义 transaction order |
| query visibility 裁决 surface | query 必须区分 visible / redacted / not visible / degraded / stale | `IdentityVisibilityDecision` | 只承接 resolver/policy result;不读取授权系统、不做 redaction matrix |
| job report 汇总 | operations job 需要 run metadata、scope、cursor、partial / failed / retryable result | `IdentityJobRunReport` | 只定义 report assembly object;job entry、scheduler、retry 留 Step 6.7 / 9 / 14 |

#### 7.16.2 功能到对象映射

| 功能 | 主对象 | 辅助类型 / marker | 为什么不能并入 domain truth |
|---|---|---|---|
| operation metadata | `IdentityOperationContext` | `IdentityOperationContextRef`、`IdentityOperationName`、`IdentityOperationChannel` | context 来自入口和调用环境,不是 identity truth |
| 幂等记录 | `IdentityIdempotencyRecord` | `IdentityIdempotencyRecordRef`、`IdentityIdempotencyKey`、`IdentityIdempotencyStateKind` | 幂等记录服务 operation replay,不改变成员、career、memory 等业务事实 |
| 请求摘要 | `IdentityRequestDigest` | `IdentityCanonicalRequestMarkerRef`、`IdentityRequestDigestValue` | digest 是请求 material 的稳定摘要,不是业务状态 |
| stored replay | `StoredIdentityOperationResult` / command typed replay envelopes | `IdentityStoredResultRef`、`IdentityStoredResultKind`、`IdentityStoredSurfaceMarkerRef` | generic stored result 是 replay shell;command duplicate replay 必须读取 typed envelope,不能只靠 marker 或 current truth 重建 public DTO |
| command effect | `IdentityCommandEffectSummary` | `IdentityCommandEffectSummaryRef`、`IdentityAcceptedEffectKind` | effect summary 汇总一次 accepted write 的副产物,不拥有 trace/outbox/projection truth |
| query visibility | `IdentityVisibilityDecision` | `IdentityVisibilityDecisionRef`、`IdentityReadDispositionKind` | visibility 是一次 read 结果的裁决,不是 view truth |
| job report | `IdentityJobRunReport` | `IdentityJobRunRef`、`IdentityJobReportRef`、`IdentityJobResultKind`、projection/reference/report/outbox/handoff item refs | report 汇总 job run,不直接修复 truth 或 projection |

#### 7.16.3 6.6 typed refs / marker 收敛

| 类型 / marker | 所属对象 | 字段语义 | 生成 / 来源约束 | 后续承接 |
|---|---|---|---|---|
| `IdentityOperationContextRef` | `IdentityOperationContext` | 单次 operation context identity | 由 entry factory / id generator 生成;不得由 operation name + key 拼接 | Step 7 id generator、Step 8 metadata |
| `IdentityOperationName` | `IdentityOperationContext` / idempotency | command/query/consumer/job/handoff callback 名称 | 来自正式 entry / handler / worker / job 名称枚举;不得使用自由字符串 | Step 8 protocol、Step 13 idempotency |
| `IdentityRequestMetadataRef` | `IdentityOperationContext` | command/query metadata、event envelope metadata 或 job metadata marker | 来自正式 entry metadata builder;不得保存 raw header/body/credential | Step 6.7 / Step 8 |
| `IdentityTraceContextRef` | `IdentityOperationContext` | runtime trace / correlation context marker | 来自入口 propagated trace context;不等于 `IdentityTraceRecordRef` | Step 8 / Step 15 |
| `IdentitySourceEventRef` | `IdentityOperationContext` | inbound event envelope identity | 只来自 consumer entry;不得由 payload body hash 临时生成 | Step 6.7 / Step 8 / Step 13 |
| `IdentityIdempotencyKey` | context / idempotency | caller 或 system 提供的幂等键 | command 来自 request metadata;consumer 来自 event dedup key;job 来自 run metadata | Step 8 / Step 13 |
| `IdentityCanonicalRequestMarkerRef` | `IdentityRequestDigest` | canonical request material marker | 指向 body-free canonical material;不保存 raw body / event body / job payload | Step 8 canonicalization |
| `IdentityRequestDigestValue` | `IdentityRequestDigest` | canonical material digest 值 | 由 canonicalizer 生成;不得人工拼字段或使用 timestamp/version | Step 13 duplicate conflict |
| `IdentityProtocolSchemaVersionRef` | `IdentityRequestDigest` | canonical digest schema version marker | 来自 Step 8 protocol canonicalization version;不等于 source version / optimistic version | Step 8 / Step 13 |
| `IdentityDigestAlgorithmMarkerRef` | `IdentityRequestDigest` | digest algorithm binding marker | 来自 Step 8 public digest shell / implementation standard binding;Step 6 不固定算法 | Step 8 / Step 13 / Step 14 |
| `IdentityIdempotencyRecordRef` | `IdentityIdempotencyRecord` | idempotency record identity | repository / id generator 分配;不得等于 idempotency key | Step 7 repository、Step 11 persistence |
| `IdentityStoredResultRef` | `StoredIdentityOperationResult` | stored replay snapshot identity | complete accepted/rejected/receipt/report 时生成 | Step 7 / 11 / 13 |
| `IdentityStoredSurfaceMarkerRef` | `StoredIdentityOperationResult` | replayable public surface marker | 由 result assembler 生成;不保存 public response body 或 raw error body | Step 8 / Step 13 |
| `IdentityConsumerReceiptRef` | `IdentityConsumerReceipt` / stored receipt envelope | inbound consumer / callback public receipt identity | service result assembler / id generator 分配;不得等于 source event、worker dispatch、trace、stored result 或 surface marker ref | Step 7 id generator、Step 8 receipt、Step 13 duplicate replay |
| `IdentityStoredResultKind` | `StoredIdentityOperationResult` | stored result variant | 只区分 command accepted/rejected、consumer receipt、job report、handoff callback receipt | Step 8 / Step 13 |
| `IdentityCommandEffectSummaryRef` | `IdentityCommandEffectSummary` | accepted command effect 汇总 identity | service accepted path 生成;不替代 trace/ref/outbox ids | Step 9 / 13 |
| `IdentityAcceptedEffectKind` | `IdentityCommandEffectSummary` | accepted command effect kind | 来自正式 command accepted family;不得自由字符串 | Step 9 / Step 13 |
| `IdentityTruthRef` | `IdentityCommandEffectSummary` | accepted primary truth / intent sum type | 只承接 typed identity-owned ref,例如 member/lifecycle/role/career/memory/handoff intent;不得存 external source string | Step 9 / Step 11 |
| `IdentityTruthCursor` | `IdentityCommandEffectSummary` | accepted truth cursor marker | 来自 accepted truth cursor assigner;不得引入第二套 cursor ref 类型 | Step 7 / Step 11 / Step 13 |
| `IdentityVisibilityDecisionRef` | `IdentityVisibilityDecision` | 单次 read visibility decision identity | query assembler 或 policy evaluation 生成 | Step 8 / 12 |
| `IdentityReadSubjectRef` | `IdentityVisibilityAccessSummary`;`IdentityVisibilityDecision` | query read subject marker | 来自 Step 7 `IdentityReadVisibilityRepository.resolve_*_read(...)` 返回的 prepared access summary;repository / adapter 内部可使用 formal read subject mapper 或 typed request/view/report ref,但 service 不得由 route/query param 拼接 | Step 7 / Step 9 |
| `IdentityReadDispositionKind` | `IdentityVisibilityDecision` | visible/redacted/not visible/degraded/stale visible disposition | 由 visibility policy / resolver result 决定;不等于 HTTP status | Step 8 / Step 12 |
| `IdentityRedactionMarkerRef` | `IdentityVisibilityAccessSummary`;`IdentityVisibilityDecision` | redaction reason / field-set safe marker | 来自 Step 7 visibility resolver / prepared access summary 中的 redaction matrix result;query service 只能复制到 decision / public surface,不得由 profile、scope、result 或字符串推导;不保存 policy body 或 denied raw reason | Step 7 / Step 8 / Step 12 |
| `IdentityDegradedMarkerRef` | `IdentityVisibilityDecision` | degraded / stale / dependency issue safe marker | 来自 resolver/dependency summary;不保存 raw external error | Step 8 / Step 12 |
| `IdentityJobRunRef` | `IdentityJobRunReport` | 单次 job run identity | job entry / scheduler 提供;不得由 job name + time 拼接 | Step 6.7 / 9 / 14 |
| `IdentityJobReportRef` | `IdentityJobRunReport` | job report identity | report assembly 生成;不等于 run ref | Step 8 / 11 / 13 |
| `IdentityJobName` | `IdentityJobRunReport` | operations job 名称 | 来自正式 job entry 枚举;不得自由字符串 | Step 6.7 / Step 8 |
| `IdentityJobScopeMarkerRef` | `IdentityJobRunReport` | job 执行范围 marker | 来自 job request / schedule scope;不保存 scope expansion body | Step 8 / Step 9 |
| `IdentityJobCursorRef` | `IdentityJobRunReport` | job input/output cursor marker | 来自正式 job/source cursor;不得用 timestamp/page cursor/key 替代 | Step 9 / Step 11 / Step 13 |
| `IdentityJobResultKind` | `IdentityJobRunReport` | succeeded/partial/failed/noop/retryable failed result kind | 由 job flow completion 决定;partial/failed 必须带 issue marker | Step 8 / Step 12 / Step 14 |
| job item refs | `IdentityJobRunReport` | operations job 本轮处理 / 变更 / 失败的 body-free refs | 来自 Step 7 repository / adapter / report writer output;不得由 duplicate replay 重扫 store 反推 | Step 8 / Step 9 / Step 13 |

#### 7.16.4 `IdentityOperationContext`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::operation` |
| capability | 统一 command / query / consumer / job / handoff callback 的 operation metadata |
| 对象类别 | application helper / context |
| 责任 | 保存 operation name、channel、actor、metadata、idempotency、request digest、trace context、source event / job run marker |
| 非责任 | 不做权限判断、不读取 repository、不生成 business ref、不执行 flow、不保存 raw request body |
| 后续 Step | Step 7 定义 clock/id/resolver port;Step 8 定义 metadata DTO;Step 9 使用 context;Step 13 定义幂等持久化 |

```rust
pub struct IdentityOperationContext {
    pub context_ref: IdentityOperationContextRef,
    pub operation_name: IdentityOperationName,
    pub channel: IdentityOperationChannel,
    pub actor_ref: ActorRef,
    pub request_metadata_ref: IdentityRequestMetadataRef,
    pub idempotency_key: Option<IdentityIdempotencyKey>,
    pub request_digest: IdentityRequestDigest,
    pub trace_context_ref: Option<IdentityTraceContextRef>,
    pub source_event_ref: Option<IdentitySourceEventRef>,
    pub job_run_ref: Option<IdentityJobRunRef>,
    pub started_at: IdentityTimestamp,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `context_ref` | application entry factory / id generator | opaque ref,不得从 idempotency key 或 request digest 派生 |
| `operation_name` | API handler、consumer handler、job entry 或 handoff callback entry | 必须是正式 operation 名称,不得自由字符串 |
| `channel` | entry factory | command/query/consumer/job/handoff callback 显式区分;query channel 不允许写 truth |
| `actor_ref` | actor context / system actor context | system actor 只允许 job / consumer / callback 入口按正式规则提供 |
| `request_metadata_ref` | command/query metadata、event envelope、job run metadata | 只保存 metadata marker,不保存 raw header/body |
| `idempotency_key` | request metadata、event dedup key、job run metadata | query 可为空;mutation / consumer / job accepted path 需在 Step 13 定义是否必填 |
| `request_digest` | `IdentityRequestDigest::from_canonical_marker(...)` | same key conflict 只能比较 digest,不得比较 raw body |
| `trace_context_ref` | entry metadata / propagated trace context | runtime trace context marker,不替代 identity trace record |
| `source_event_ref` | consumer event envelope | 只在 consumer channel 中出现 |
| `job_run_ref` | operations job entry | 只在 job channel 中出现 |
| `started_at` | clock | 不替代 truth cursor、projection cursor 或 optimistic version |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_command(...)` | command operation name、actor、metadata、idempotency key、digest、trace context、started_at | command context | channel 固定为 `Command`;不得带 source_event_ref / job_run_ref |
| `from_query(...)` | query operation name、actor、metadata、digest、visibility context marker、started_at | query context | channel 固定为 `Query`;idempotency key 可为空;不得用于 mutation |
| `from_inbound_event(...)` | consumer operation name、system/consumer actor、event envelope marker、dedup key、digest、trace context、started_at | consumer context | channel 固定为 `Consumer`;必须带 source_event_ref |
| `from_job(...)` | job operation name、system actor、job_run_ref、job metadata、idempotency key、digest、started_at | job context | channel 固定为 `OperationsJob`;必须带 job_run_ref |
| `from_handoff_callback(...)` | callback operation name、actor/system actor、callback marker、digest、trace context、started_at | callback context | channel 固定为 `HandoffCallback`;不得保存 receipt body |
| `requires_idempotency()` | self | bool | command/consumer/job/callback 由 Step 13 固定必填范围;query 不强制 |
| `is_write_channel()` | self | bool | 只表达 channel 性质,不替代 authorization |

不变量:

- `channel` 必须由 factory 固定,service flow 不得在内部硬编码或覆盖。
- consumer context 必须有 `source_event_ref`;job context 必须有 `job_run_ref`;command/query context 不得伪造这两个字段。
- `request_digest` 必须来自 canonical marker,不得由 timestamp、idempotency key、operation name 或 raw body hash 临时生成。
- `IdentityOperationContext` 不保存 request body、event body、job payload、credential、secret、外部 receipt body 或 audit log 原文。

#### 7.16.5 `IdentityRequestDigest`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::idempotency` 或 `contracts::metadata` |
| capability | 提供 duplicate replay / conflict detection 的稳定请求摘要 |
| 对象类别 | application helper / value object |
| 责任 | 绑定 canonical material marker、digest value、schema version 和 algorithm marker |
| 非责任 | 不定义 DTO canonicalization 细节、不保存 raw request、不决定 public rejection |
| 后续 Step | Step 8 定义 canonical input;Step 13 定义 same key same/different digest 语义 |

```rust
pub struct IdentityRequestDigest {
    pub canonical_marker_ref: IdentityCanonicalRequestMarkerRef,
    pub digest_value: IdentityRequestDigestValue,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub algorithm_ref: IdentityDigestAlgorithmMarkerRef,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `canonical_marker_ref` | canonical request material builder | body-free marker;不得保存 raw request/event/job body |
| `digest_value` | digest canonicalizer | opaque digest value;不得拼接字段或使用业务 ref 代替 |
| `schema_version_ref` | Step 8 `IdentityProtocolSchemaVersionRef` | 版本变化必须影响 duplicate conflict 规则;不得另建 `IdentityDigestSchemaVersionRef` 同义类型 |
| `algorithm_ref` | Step 8 `IdentityDigestAlgorithmMarkerRef` | 算法选择留 Step 13 / implementation standard,Step 6 只保留 public marker;不得另建 `IdentityDigestAlgorithmRef` 同义类型 |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_canonical_marker(...)` | marker、digest value、schema version、algorithm marker | digest | 不读取 raw body |
| `matches(&self, other)` | two digests | bool | 必须同时比较 schema / algorithm / value |
| `conflicts_with(&self, other)` | two digests | bool | same idempotency key 但 digest 不 matches 时使用 |

不变量:

- digest 只能回答“canonical material 是否同一”,不能说明 actor 是否有权限、source 是否可信、truth 是否存在。
- digest schema version 不得被 optimistic version、source version、projection cursor 或 truth cursor 替代。
- query digest 只用于 context / observability / optional cache identity,不得引入 query mutation。

#### 7.16.6 `IdentityIdempotencyRecord`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::idempotency` |
| capability | 支撑 reserve、complete、duplicate replay 和 conflict surface |
| 对象类别 | application helper / state record |
| 责任 | 保存 operation name、channel、idempotency key、request digest、state、stored result ref、created / updated metadata |
| 非责任 | 不定义 repository trait、不持久化 transaction、不承载 business truth、不保存 public response body |
| 后续 Step | Step 7 repository;Step 11 uniqueness / transaction;Step 13 duplicate semantics |

```rust
pub struct IdentityIdempotencyRecord {
    pub record_ref: IdentityIdempotencyRecordRef,
    pub operation_name: IdentityOperationName,
    pub channel: IdentityOperationChannel,
    pub idempotency_key: IdentityIdempotencyKey,
    pub request_digest: IdentityRequestDigest,
    pub state: IdentityIdempotencyStateKind,
    pub stored_result_ref: Option<IdentityStoredResultRef>,
    pub reserved_at: IdentityTimestamp,
    pub completed_at: Option<IdentityTimestamp>,
}

pub enum IdentityIdempotencyStateKind {
    Reserved,
    Completed,
    RejectedStored,
    Conflict,
    Expired,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `record_ref` | id generator / repository allocation | 不等于 idempotency key |
| `operation_name` | `IdentityOperationContext` | 与 context 保持一致 |
| `channel` | `IdentityOperationContext` | 必须复制 context channel,不能由 repository 硬编码 |
| `idempotency_key` | `IdentityOperationContext` | mutation / consumer / job 必须按 Step 13 决定必填 |
| `request_digest` | `IdentityOperationContext` | conflict 判断只比较 digest |
| `state` | record factory / transition function | `Completed` / `RejectedStored` 必须有 stored result |
| `stored_result_ref` | stored result complete path | `Reserved` / `Conflict` / `Expired` 可为空 |
| `reserved_at` / `completed_at` | clock | 不替代 truth cursor 或 source cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `reserve(context, now)` | context、now | `Reserved` record | context 必须有 idempotency key;不得写 result |
| `complete(result_ref, now)` | stored result ref、now | `Completed` record | stored result ref 必填 |
| `complete_rejected(result_ref, now)` | stored rejected result ref、now | `RejectedStored` record | 只表示可 replay 的 rejected surface,不是 domain rejected state |
| `mark_conflict(now)` | now | `Conflict` record | 不保存 incoming raw body |
| `can_replay(digest)` | incoming digest | replay decision | same key + matching digest + stored result 才可 replay |

不变量:

- `Completed` 和 `RejectedStored` 必须指向 `IdentityStoredResultRef`;否则 duplicate replay 没有正式载体。
- `Conflict` 不得覆盖原始 `request_digest`,也不得保存 incoming raw material。
- idempotency record 的 `channel` 必须来自 `IdentityOperationContext`,避免 command/event/job duplicate 语义分裂。
- idempotency key 不是 source marker、truth cursor、projection cursor、job cursor 或 outbox id。

#### 7.16.7 `StoredIdentityOperationResult`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::results` |
| capability | 为 duplicate replay 提供稳定 stored result surface |
| 对象类别 | application helper / replay snapshot |
| 责任 | 保存 replay 所需的 accepted/rejected/receipt/report generic shell、surface marker 和 result kind |
| 非责任 | 不保存 raw response body、不单独承载 command typed result、不定义 repository save/load trait、不重建业务结果 |
| 后续 Step | Step 8 DTO/result schema;Step 11 persistence;Step 13 replay semantics |

```rust
pub struct StoredIdentityOperationResult {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub result_kind: IdentityStoredResultKind,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub recorded_at: IdentityTimestamp,
}

pub enum IdentityStoredResultKind {
    CommandAccepted,
    CommandRejected,
    ConsumerReceipt,
    JobReport,
    HandoffCallbackReceipt,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `stored_result_ref` | id generator / stored result repository | 不等于 idempotency record ref |
| `operation_context_ref` | context | 保留 replay 来源,不保存 full context body |
| `result_kind` | service accepted / rejected / receipt / report assembly | query 默认不进入 stored mutation result |
| `surface_marker_ref` | public surface builder / result assembler | body-free marker;具体 response DTO 留 Step 8 |
| `recorded_at` | clock | 不替代 command accepted cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `command_accepted(context_ref, marker, now)` | context ref、accepted surface marker、now | stored accepted generic shell | marker 只标记 stored kind;public accepted response 必须由 `IdentityCommandAcceptedResultEnvelope` replay |
| `command_rejected(context_ref, marker, now)` | context ref、rejected surface marker、now | stored rejected generic shell | 只用于已定义可 replay 的 rejection;public rejection 必须由 `IdentityCommandRejectedResultEnvelope` replay |
| `consumer_receipt(context_ref, marker, now)` | context ref、receipt marker、now | stored consumer receipt | 不保存 event body |
| `job_report(context_ref, marker, now)` | context ref、report marker、now | stored job report | 不保存 raw job log |
| `handoff_callback_receipt(context_ref, marker, now)` | context ref、receipt marker、now | stored callback receipt | 不保存 external receipt body |

不变量:

- stored result 是 replay generic shell,duplicate replay 必须先读取它确认 kind/context,再读取对应 typed envelope/report;不得重跑 mutation 或重新查询 truth 拼 response。
- command duplicate replay 不能只读取 `StoredIdentityOperationResult`;accepted replay 必须再读取 `IdentityCommandAcceptedResultEnvelope`,rejected replay 必须再读取 `IdentityCommandRejectedResultEnvelope`。
- stored result surface marker 不能保存 raw request、event body、job payload、external receipt body、secret 或 forbidden material。
- `CommandRejected` 只表示 Step 12 / Step 13 明确允许持久化并 replay 的 rejected surface;普通 validation error 是否存储留后续闭口。
- query success 不进入此对象,除非后续 Step 13 明确 query cache / result replay surface。

#### 7.16.8 `IdentityCommandAcceptedResultEnvelope` / `IdentityCommandRejectedResultEnvelope`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::results` |
| capability | 为 command duplicate replay 提供 typed stored public surface |
| 对象类别 | application helper / replay envelope |
| 责任 | 保存 command accepted public result/effect 或 replayable rejected public rejection,使 duplicate replay 不依赖 current truth |
| 非责任 | 不保存 command request body、不保存 raw error body、不决定 rejected 是否 replayable、不替代 generic stored shell |
| 后续 Step | Step 7 repository save/get;Step 8 command typed result enum;Step 11 persistence;Step 12/13 replay consistency |

```rust
pub struct IdentityCommandAcceptedResultEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub command_name: IdentityCommandName,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub result: IdentityCommandTypedResult,
    pub effect: IdentityCommandEffectPublicSummary,
    pub recorded_at: IdentityTimestamp,
}

pub struct IdentityCommandRejectedResultEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub command_name: IdentityCommandName,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub rejection: IdentityProtocolRejection,
    pub recorded_at: IdentityTimestamp,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `stored_result_ref` | `StoredIdentityOperationResult.stored_result_ref` | 必须存在同 ref generic shell;accepted kind 为 `CommandAccepted`,rejected kind 为 `CommandRejected` |
| `operation_context_ref` | `IdentityOperationContext.context_ref` | 只保存 context ref,不保存 request metadata body |
| `command_name` | command route catalog / operation context | 必须与 `result` variant 或 `rejection.surface_ref` 对应 command surface 一致 |
| `surface_marker_ref` | public surface builder | 必须等于 generic shell 的 `surface_marker_ref`;只作为 body-free marker |
| `result` | Step 8 command-specific typed result DTO union | 只保存 accepted command business result fields;不得包含 effect 或 raw command body |
| `effect` | accepted command effect public summary assembler | 只在 accepted envelope 出现;rejected envelope 不保存 effect |
| `rejection` | Step 8 `IdentityProtocolRejection` | 只用于 Step 12/13 判定 replayable 的 rejected surface;internal/repository failure 不得伪装为 rejected envelope |
| `recorded_at` | clock | 不替代 truth cursor、version、digest 或 idempotency key |

不变量:

- accepted duplicate replay 返回 `IdentityCommandResponse<T>` 时,`result` 必须来自 `IdentityCommandAcceptedResultEnvelope.result`,`effect` 必须来自 `IdentityCommandAcceptedResultEnvelope.effect`。
- rejected duplicate replay 返回 `IdentityProtocolRejection` 时,必须来自 `IdentityCommandRejectedResultEnvelope.rejection`。
- `IdentityCommandTypedResult` 是 Step 8 protocol-owned command result sum type,其 variant 必须覆盖所有 formal command result DTO;新增 command DTO 时必须同步新增 variant。
- generic `StoredIdentityOperationResult(CommandAccepted/CommandRejected)` 只用于 kind/context/ref consistency check,不能替代 typed envelope。
- typed envelope missing、wrong kind、command/result variant mismatch 或 effect missing 都是 replay consistency defect;不得读取 current truth、重新调用 resolver 或重跑 domain guard。

#### 7.16.9 `IdentityCommandEffectSummary`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::effects` |
| capability | 将 accepted command 的 truth、trace、audit、outbox、stale projection、stored result 汇总为 application effect surface |
| 对象类别 | application helper / effect summary |
| 责任 | 串联 accepted fact 与副产物 refs,供 service result、observability、stored result builder 使用 |
| 非责任 | 不生成 cursor、不保存 transaction order、不替代 trace/audit/outbox/projection truth |
| 后续 Step | Step 9 accepted flow;Step 11 tx order;Step 13 stored result |

```rust
pub struct IdentityCommandEffectSummary {
    pub effect_summary_ref: IdentityCommandEffectSummaryRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub effect_kind: IdentityAcceptedEffectKind,
    pub primary_truth_ref: IdentityTruthRef,
    pub accepted_cursor_ref: IdentityTruthCursor,
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,
    pub audit_trail_ref: Option<AuditTrailRef>,
    pub outbox_record_refs: Vec<IdentityOutboxRecordRef>,
    pub stale_projection_refs: Vec<IdentityProjectionRef>,
    pub stored_result_ref: IdentityStoredResultRef,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `effect_summary_ref` | accepted path id generator | 不等于 primary truth ref |
| `operation_context_ref` | operation context | 汇总入口元数据,不复制 full context |
| `effect_kind` | command accepted type | 必须是正式 accepted effect kind,不得自由字符串 |
| `primary_truth_ref` | domain accepted truth / accepted intent | 可以是 member/lifecycle/role/career/memory/handoff intent 等 typed identity-owned ref 的 sum type |
| `accepted_cursor_ref` | accepted truth cursor assigner | 不得用 timestamp/version/idempotency key 替代 |
| `trace_record_refs` | trace builder | accepted write 至少需要 formal trace;具体数量由 Step 9 |
| `audit_trail_ref` | audit update path | 可选性由 Step 9 / 11 闭口 |
| `outbox_record_refs` | outbox builder or explicit empty side-effect inventory | publish 失败不回滚此 summary;若 accepted flow 没有正式 canonical outbound payload,必须为空并在 Step 9 写明 |
| `stale_projection_refs` | projection stale marker | 不包含 projection body |
| `stored_result_ref` | stored result builder | duplicate replay 载体 |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_accepted_change(...)` | context ref、truth ref、cursor、trace refs、audit ref、outbox refs、stale projection refs、stored result ref | effect summary | 不保存 raw change body |
| `requires_trace()` | self | bool | accepted mutation 必须为 true;具体例外需 Step 9 明确 |
| `has_replay_surface()` | self | bool | stored result ref 存在则 true |
| `affected_projection_refs()` | self | slice | 只返回 refs,不触发 rebuild |

不变量:

- `accepted_cursor_ref` 必须来自正式 truth cursor 来源;effect summary 不能自己生成 cursor。
- outbox / projection stale / stored result 是 accepted write 的副产物 refs,但 effect summary 不决定 transaction commit order。
- `outbox_record_refs` 可以为空;只有 Step 8/9 已定义 canonical outbound payload 的 accepted path 才能创建 outbox record,不得为了填充 effect summary 私造 event。
- `primary_truth_ref` 必须是 typed identity-owned ref,不得保存 `ExternalSourceRef` 字符串或 ad hoc subject key。
- projection stale 只保存 affected refs,query / summary builder 不得通过此对象拼 view ref。

#### 7.16.10 `IdentityVisibilityDecision`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::query_support` |
| capability | 为 query assembler 提供统一 visible / redacted / not visible / degraded / stale 裁决对象 |
| 对象类别 | application helper / query decision |
| 责任 | 保存 read subject、visibility context、scope、visibility result、read surface kind、disposition、redaction/degraded markers |
| 非责任 | 不调用授权系统、不读取 repository、不做 field-level redaction matrix、不写 audit truth |
| 后续 Step | Step 7 visibility resolver;Step 8 query result DTO;Step 10 query state;Step 12 degraded/not visible mapping |

```rust
pub struct IdentityVisibilityDecision {
    pub decision_ref: IdentityVisibilityDecisionRef,
    pub read_subject_ref: IdentityReadSubjectRef,
    pub visibility_context_ref: VisibilityContextRef,
    pub visibility_scope_ref: VisibilityScopeRef,
    pub visibility_result_ref: VisibilityResultRef,
    pub surface_kind: IdentityReadSurfaceKind,
    pub disposition: IdentityReadDispositionKind,
    pub redaction_marker_ref: Option<IdentityRedactionMarkerRef>,
    pub degraded_marker_ref: Option<IdentityDegradedMarkerRef>,
    pub decided_at: IdentityTimestamp,
}

pub enum IdentityReadDispositionKind {
    Visible,
    Redacted,
    NotVisible,
    Degraded,
    StaleVisible,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `decision_ref` | query assembler / id generator | 单次 decision identity,不等于 view ref |
| `read_subject_ref` | `IdentityVisibilityAccessSummary.read_subject_ref` from Step 7 `IdentityReadVisibilityRepository.resolve_*_read(...)` | service / handler 不得从 URL、query param、raw member id、view id 或 loaded view body 拼接;adapter 内部若需映射必须使用 formal read subject mapper 或 typed request/view/report ref |
| `visibility_context_ref` | query operation metadata | 不保存 actor credential 或 policy body |
| `visibility_scope_ref` | request、view/ref 或 resolver summary | Step 7/9 必须明确来源,不得从 subject 字符串推断 |
| `visibility_result_ref` | visibility policy / resolver summary | public `IdentityVisibilityMarker` 从此字段复制;不保存 policy body、credential 或 raw denial reason |
| `surface_kind` | visibility policy / query assembler | found/not_found/not_visible/redacted/stale/degraded/empty read surface;不表达 summary/trace/audit/report 目标类型 |
| `disposition` | visibility policy result | `NotVisible` / `Degraded` 不应混同 |
| `redaction_marker_ref` | `IdentityVisibilityAccessSummary.redaction_marker_ref` or visibility policy redaction matrix result | body-free marker;query service 不得从 `redaction_profile_ref`、`visibility_result_ref`、scope、route 或字符串推导;具体字段裁剪留 Step 8/12 |
| `degraded_marker_ref` | `IdentityVisibilityAccessSummary.degraded_marker_ref` or dependency / stale / unavailable safe summary | body-free marker;`Degraded` / `Unavailable` access summary 必填;不得保存 raw error |
| `decided_at` | clock | 不代表 source freshness cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `visible(...)` | subject、context、scope、visibility result、surface kind、now | visible decision | 无 redaction/degraded marker |
| `redacted(...)` | subject、context、scope、visibility result、surface kind、redaction marker、now | redacted decision | marker 必填 |
| `not_visible(...)` | subject、context、scope、visibility result、surface kind、redaction marker、now | not visible decision | 不泄露 hidden subject body |
| `degraded(...)` | subject、context、scope、visibility result、surface kind、degraded marker、now | degraded decision | marker 必填;不等于 authorization denied |
| `stale_visible(...)` | subject、context、scope、visibility result、surface kind、degraded marker、now | stale-visible decision | 用于允许带 stale marker 的可见结果 |
| `allows_body_material()` | self | bool | 只有 visible/stale-visible 且 surface material safe 时可返回 body-free view material |

不变量:

- visibility decision 不能替代 `VisibilityPolicy`;它只是 policy / resolver 输出的 application surface。
- `visibility_scope_ref` 必须有正式来源;后续 query flow 若无法映射 scope,必须暂停补 Step 7/9,不得自行拼 scope。
- `visibility_result_ref` 必须来自正式 visibility policy / resolver summary,不得由 query route、HTTP status 或 ad hoc denied 字符串生成。
- `redaction_marker_ref` 必须来自 `IdentityVisibilityAccessSummary.redaction_marker_ref` 或同一次 `VisibilityPolicy` redaction matrix result;`redaction_profile_ref` 只是配置 / profile marker,不能替代 public redaction marker。
- `Degraded` / `Unavailable` access summary 必须携带 `degraded_marker_ref` 和 safe degraded kind;query service 只能复制,不得在 resolver `None` 分支自行生成 degraded marker 或 visibility result。
- `NotVisible` 不能伪装为 empty result;`Degraded` 不能伪装为 accepted success。
- redaction/degraded marker 不保存 raw denial reason、external error body、credential、secret 或 policy body。

#### 7.16.11 `IdentityJobRunReport`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.6 application helper objects` |
| 组件 / crate | `application::jobs` |
| capability | 汇总 operations job 的 run metadata、scope、cursor、影响对象、问题和最终结果 |
| 对象类别 | application helper / job report assembly |
| 责任 | 保存 job run ref、job name、scope、cursor、result kind、affected refs、issue refs、stored result ref |
| 非责任 | 不定义 scheduler、不执行 repair、不写 repository transaction、不保存 job raw log |
| 后续 Step | Step 6.7 job entry;Step 8 job protocol;Step 9 job flow;Step 11 job report persistence;Step 14 retry/timeout config |

```rust
pub struct IdentityJobRunReport {
    pub report_ref: IdentityJobReportRef,
    pub job_run_ref: IdentityJobRunRef,
    pub job_name: IdentityJobName,
    pub job_scope_ref: IdentityJobScopeMarkerRef,
    pub input_cursor_ref: Option<IdentityJobCursorRef>,
    pub output_cursor_ref: Option<IdentityJobCursorRef>,
    pub result_kind: IdentityJobResultKind,
    pub affected_member_refs: Vec<GlobalMemberRef>,
    pub affected_projection_refs: Vec<IdentityProjectionRef>,
    pub rebuilt_projection_refs: Vec<IdentityProjectionRef>,
    pub failed_projection_refs: Vec<IdentityProjectionRef>,
    pub refreshed_reference_refs: Vec<ExternalReferenceRef>,
    pub failed_reference_refs: Vec<ExternalReferenceRef>,
    pub inspected_target_refs: Vec<IdentityMaintenanceTargetRef>,
    pub report_refs: Vec<ReconciliationReportRef>,
    pub outbox_record_refs: Vec<IdentityOutboxRecordRef>,
    pub published_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub failed_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub delivered_handoff_refs: Vec<TraceHandoffIntentRef>,
    pub failed_handoff_refs: Vec<TraceHandoffIntentRef>,
    pub handoff_receipt_refs: Vec<HandoffReceiptRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
    pub stored_result_ref: Option<IdentityStoredResultRef>,
    pub started_at: IdentityTimestamp,
    pub finished_at: Option<IdentityTimestamp>,
}

pub enum IdentityJobResultKind {
    Succeeded,
    Partial,
    Failed,
    Noop,
    RetryableFailed,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `report_ref` | report assembly / id generator | 不等于 job_run_ref |
| `job_run_ref` | job entry | 必须来自 scheduler / job entry,不得拼接 |
| `job_name` | formal job entry | 必须是正式 job 名称枚举 |
| `job_scope_ref` | job request / schedule scope | 不保存 scope expansion body |
| `input_cursor_ref` / `output_cursor_ref` | job cursor source | 不得用 timestamp、page cursor 或 idempotency key 代替 |
| `result_kind` | job flow completion | `Partial` / `RetryableFailed` 必须显式暴露 |
| `affected_member_refs` | job output refs | 只保存 refs,不保存 member body |
| `affected_projection_refs` | projection maintenance output | 只保存 refs,不触发 rebuild |
| `rebuilt_projection_refs` / `failed_projection_refs` | projection rebuild output | 只保存本次 rebuild item refs;duplicate replay 不重扫 projection store |
| `refreshed_reference_refs` / `failed_reference_refs` | reference refresh output | 只保存 external reference bundle refs,不保存 external body |
| `inspected_target_refs` | reconciliation report input/output | 只保存 maintenance target refs;不得指向 core truth write target |
| `report_refs` | reconciliation job output | 只保存 report refs;report body 由 report repository 读取 |
| `outbox_record_refs` / `published_outbox_refs` / `failed_outbox_refs` | publish/retry job output | 只保存 outbox refs;Published 不等于 downstream consumed |
| `handoff_intent_refs` / `delivered_handoff_refs` / `failed_handoff_refs` / `handoff_receipt_refs` | handoff delivery/retry output | delivered 必须带 formal receipt ref;不保存 receipt body |
| `issue_refs` | safe issue marker | raw diagnostic / external body / secret 禁止 |
| `stored_result_ref` | stored job report builder | duplicate job replay 使用 |
| `started_at` / `finished_at` | clock | 不替代 cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `start(...)` | job_run_ref、job_name、scope、input cursor、started_at | initial report | 不写 truth |
| `succeed(...)` | affected refs、output cursor、stored result、finished_at | succeeded report | stored result 是否必填留 Step 13 闭口 |
| `partial(...)` | affected refs、issue refs、output cursor、stored result、finished_at | partial report | issue refs 必须非空 |
| `fail(...)` | issue refs、finished_at | failed report | 不保存 raw error body |
| `retryable_fail(...)` | issue refs、finished_at | retryable failed report | retry schedule 不在 Step 6 定义 |
| `noop(...)` | output cursor、stored result、finished_at | noop report | 表示无影响,不等于失败 |

不变量:

- job report 只能报告 job run 结果,不能成为 repair command 或 hidden mutation carrier。
- `Partial` / `Failed` / `RetryableFailed` 必须带 `MaintenanceIssueRef`;不得静默成功。
- cursor 必须来自正式 job / source cursor 来源;timestamp、page cursor、idempotency key 均不能替代。
- affected refs 和 issue refs 只保存 body-free refs / markers。

#### 7.16.12 本批并入 / 后移 / 排除对象

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `IdentityApplicationService` / command service | 后移 | service flow 不属于对象契约 | Step 9 |
| repository / id generator / resolver / unit of work trait | 后移 | port / adapter 契约 | Step 7 / Step 11 |
| public command / query / event / job request/result DTO | 后移 | protocol schema | Step 8 |
| API handler result / HTTP status mapping | 后移 | entry/API 层 surface | Step 6.7 / Step 8 / Step 12 |
| worker event envelope | 后移 | consumer protocol + worker entry | Step 8 / Step 6.7 |
| runtime config / builder state / adapter health | 后移 | infra / entry object | Step 6.7 / Step 14 |
| transaction order / optimistic version / unique index | 后移 | persistence consistency | Step 11 |
| duplicate replay full semantics | 后移 | concurrency / idempotency | Step 13 |
| query cache object | 排除本批 | `02` 未要求 query stored replay;不能在 Step 6 发明 cache | 若后续需要,Step 13 另行闭口 |
| retry schedule / backoff policy | 后移 | runtime operations config | Step 14 |

#### 7.16.13 6.6 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.16.1 从 operation metadata、idempotency、digest、stored result、effect、visibility、job report 推导 |
| 是否有功能到对象映射 | 通过 | §7.16.2 明确七类 helper 对象和不并入 domain truth 的理由 |
| 是否补齐 typed refs / marker | 通过 | §7.16.3 收敛 operation context、digest、idempotency、stored result、effect、visibility、job report ref / marker |
| 是否定义字段来源 | 通过 | 每个对象都有字段来源表,并标明禁止用 timestamp/version/key/cursor 混用 |
| 是否定义 factory / function | 通过 | 每个对象都有 factory / helper function,但不定义 service flow |
| 是否定义状态 / disposition | 通过 | idempotency state、stored result kind、read disposition、job result kind 已收敛 |
| 是否越过 Step 7 | 未越过 | 未定义 repository / resolver / id generator / UoW trait |
| 是否越过 Step 8 | 未越过 | 未定义 request / response / event / job DTO |
| 是否越过 Step 9 / 11 / 13 | 未越过 | 未定义 flow、transaction order、duplicate replay 完整矩阵 |
| 是否保存 forbidden material | 未发生 | context、digest、stored result、visibility、job report 均只保存 body-free marker/ref |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.7` | 用户审核通过后进入 infra / api / worker / jobs entry objects |

#### 7.16.14 6.6 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| operation channel | `IdentityOperationContext::from_inbound_event(...)` 固定 `Consumer` channel | service 内部根据 operation name 字符串猜 channel |
| command context | command context 保存 metadata ref、idempotency key、digest marker | command context 保存 raw request body 或 credential |
| query context | query context 明确 `Query` channel 且不写 truth | query handler 用 command context 进入 mutation path |
| consumer context | consumer context 必须带 `source_event_ref` 和 dedup key | consumer flow 没有 event identity,靠 payload 内容去重 |
| job context | job context 必须带 `job_run_ref` | 用 job name + timestamp 临时拼 run id |
| request digest | digest 来自 canonical marker + schema version + algorithm marker | 用 timestamp、version、idempotency key 或 raw JSON 字符串当 digest |
| duplicate replay | same key + same digest + stored result shell + typed envelope/report 才 replay | same key 直接 replay,不比较 digest |
| duplicate conflict | same key + different digest 标为 conflict | 覆盖旧 record 或保存 incoming raw request |
| stored accepted result | stored result 保存 generic shell,`IdentityCommandAcceptedResultEnvelope` 保存 typed result/effect | duplicate 时重新查询 truth 拼 response |
| stored rejected result | 仅存 Step 12/13 明确可 replay 的 rejected generic shell + `IdentityCommandRejectedResultEnvelope` | 所有 validation error 都写 stored result |
| command effect summary | summary 引用 truth ref、cursor、trace、outbox、stale projection、stored result refs | summary 保存 raw event body 或决定 transaction order |
| accepted cursor | `accepted_cursor_ref` 来自正式 truth cursor assigner | 用 `started_at`、optimistic version 或 idempotency key 当 cursor |
| visibility scope | scope 来自 request/view/resolver summary | 从 read subject 字符串拆出 scope |
| not visible | 返回 `NotVisible` decision,不泄露 body | 返回空列表伪装成没有数据 |
| degraded | 返回 `Degraded` 或 `StaleVisible` 并带 marker | 把 dependency unavailable 当 visible success |
| job partial | `Partial` 带 issue refs 和 affected refs | 部分失败仍标记 `Succeeded` |
| job cursor | job report 保存 input/output cursor refs | 用 page cursor、timestamp 或 retry count 替代 job cursor |
| issue material | issue 只保存 `MaintenanceIssueRef` | job report 保存 raw stack trace、external body 或 secret |

### 7.17 6.7 infra / api / worker / jobs entry objects

本批只收敛 entry / runtime assembly 侧的对象契约。它们位于 `identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 的入口边界,职责是把配置、adapter 可用性、entry metadata、validation result 和 dispatch guard 收敛为对象,让 Step 7~14 能继续定义 port、DTO、flow、transaction 和配置。它们不定义 port trait、不定义 public DTO schema、不执行 service flow、不访问 repository implementation、不保存 raw body / secret。

#### 7.17.1 6.7 capability / 功能清单

| capability | 来源 | 需要的 entry object surface | 本批边界 |
|---|---|---|---|
| runtime config shell | `02` §11 要求 profile、adapter mode、store、job、publisher/handoff config 影响运行装配 | `IdentityRuntimeConfigShell` | 只定义已校验配置外壳和禁配红线;具体配置项 schema 留 Step 14 |
| runtime assembly state | Step 4/5 规定 `infra` 做 runtime wiring,entry 不绕过 application | `IdentityRuntimeAssemblyState` | 只表达 assembly lifecycle;不实例化 adapter implementation |
| adapter availability | `02` 明确 fake / controlled / endpoint / disabled 不得伪造成功 | `IdentityAdapterAvailability` | 只表达可用性 marker;不定义 adapter trait 或调用结果 |
| API entry context | Command / Query API 需要 actor、metadata、idempotency、visibility context | `IdentityApiEntryContext`、`IdentityApiEntryValidation`、`IdentityApiDispatchResult` | 只做 entry metadata / validation / dispatch surface;不定义 request DTO / HTTP status |
| worker entry context | Consumer / callback 需要 event envelope、source event id、dedupe key、trace context | `IdentityWorkerEntryContext`、`IdentityWorkerEntryValidation`、`IdentityWorkerDispatchResult` | 只做 envelope marker / dispatch surface;event schema 留 Step 8 |
| job entry context | Operations Job 需要 run metadata、scope、cursor、system actor、idempotency key | `IdentityJobEntryContext`、`IdentityJobEntryValidation`、`IdentityJobDispatchResult` | 只做 job entry marker / dispatch surface;job DTO、scheduler、retry 留 Step 8/9/14 |
| dispatch guard | API/worker/jobs 必须经 application service,不得直接访问 store / adapter | `IdentityEntryDispatchGuard` | 只定义 guard 输入和禁止事项;不定义 service flow |

#### 7.17.2 功能到对象映射

| 功能 | 主对象 | 辅助类型 / marker | 为什么不并入 Step 6.6 application helper |
|---|---|---|---|
| validated runtime config shell | `IdentityRuntimeConfigShell` | `IdentityRuntimeProfileRef`、`IdentityConfigEvidenceRef`、`IdentityConfigIssueRef` | 6.6 是 operation context;runtime config 是进程装配输入 |
| runtime assembly lifecycle | `IdentityRuntimeAssemblyState` | `IdentityRuntimeAssemblyRef`、`IdentityRuntimeAssemblyStateKind` | assembly 是 infra/entry wiring 状态,不是 operation metadata |
| adapter availability | `IdentityAdapterAvailability` | `IdentityAdapterRef`、`IdentityAdapterModeRef`、`IdentityAdapterAvailabilityIssueRef` | availability 属于 runtime adapter readiness,不是 application policy |
| API entry | `IdentityApiEntryContext` | `IdentityApiRouteRef`、`IdentityApiEntryRef`、`IdentityApiRequestMarkerRef` | API entry 是 handler 边界对象,不保存 public DTO body |
| API validation/dispatch | `IdentityApiEntryValidation` / `IdentityApiDispatchResult` | `IdentityEntryValidationIssueRef`、`IdentityEntryDispatchRef` | entry validation 不等于 domain/application rejection |
| worker entry | `IdentityWorkerEntryContext` | `IdentityWorkerEntryRef`、`IdentityEventEnvelopeMarkerRef`、`IdentityConsumerBindingRef` | worker entry 表达 event/callback intake,不等于 consumer service flow |
| worker validation/dispatch | `IdentityWorkerEntryValidation` / `IdentityWorkerDispatchResult` | `IdentityWorkerDispatchRef`、`IdentityEntryValidationIssueRef` | worker dispatch result 不等于 consumer receipt DTO |
| job entry | `IdentityJobEntryContext` | `IdentityJobEntryRef`、`IdentityJobRunMetadataRef`、`IdentityJobScopeMarkerRef` | job entry 是 runner 输入,不等于 job report |
| job validation/dispatch | `IdentityJobEntryValidation` / `IdentityJobDispatchResult` | `IdentityJobDispatchRef`、`IdentityEntryValidationIssueRef` | job dispatch result 不等于 job run report |
| dispatch guard | `IdentityEntryDispatchGuard` | `IdentityEntrySurfaceKind`、`IdentityDispatchTargetRef` | guard 防止 entry 绕过 application,不是 service facade |

#### 7.17.3 6.7 typed refs / marker 收敛

| 类型 / marker | 所属对象 | 字段语义 | 生成 / 来源约束 | 后续承接 |
|---|---|---|---|---|
| `IdentityRuntimeProfileRef` | `IdentityRuntimeConfigShell` | runtime profile identity | 来自 config profile binding;不得改变 domain invariant | Step 14 |
| `IdentityConfigEvidenceRef` | `IdentityRuntimeConfigShell` | 已加载配置 evidence marker | 指向 body-free config evidence digest/marker;不保存 secret / env raw value | Step 14 / Step 15 |
| `IdentityConfigIssueRef` | `IdentityRuntimeConfigShell` / assembly / validation | config validation safe issue marker | 不保存 secret、endpoint raw value 或 config file body | Step 12 / Step 14 |
| `IdentityRuntimeAssemblyRef` | `IdentityRuntimeAssemblyState` | runtime assembly identity | process bootstrap 生成;不得由 profile + timestamp 拼接 | Step 14 |
| `IdentityRuntimeAssemblyStateKind` | `IdentityRuntimeAssemblyState` | NotStarted/Validated/Assembled/Failed/Degraded state | 只表达 runtime wiring state,不表达 business health | Step 14 |
| `IdentityAdapterRef` | `IdentityAdapterAvailability` | resolver/store/publisher/handoff adapter identity | 来自 formal adapter catalog;不得使用 endpoint URL 作为 identity | Step 7 / Step 14 |
| `IdentityAdapterModeRef` | `IdentityAdapterAvailability` | fake/controlled/endpoint/disabled mode marker | 来自 validated config;mode 不得放宽 business invariant | Step 14 / Step 16 |
| `IdentityAdapterAvailabilityIssueRef` | `IdentityAdapterAvailability` | adapter unavailable/degraded safe issue marker | 不保存 raw error / secret / external response body | Step 12 / Step 14 |
| `IdentityApiEntryRef` | `IdentityApiEntryContext` | 单次 API entry identity | handler entry factory 生成;不等于 operation context ref | Step 8 / Step 15 |
| `IdentityApiRouteRef` | `IdentityApiEntryContext` | API route / operation route marker | 来自 route catalog;不得由 raw URL 临时拼接 | Step 8 / Step 12 |
| `IdentityApiRequestMarkerRef` | `IdentityApiEntryContext` | body-free request material marker | 不保存 request body/header secret;只指向 canonical metadata | Step 8 / Step 13 |
| `IdentityEntryValidationIssueRef` | API/worker/job validation | entry validation safe issue marker | 不保存 raw body、raw header、stack trace 或 secret | Step 8 / Step 12 |
| `IdentityEntryDispatchRef` | dispatch result | entry dispatch attempt identity | entry dispatch factory 生成;不等于 service result ref | Step 9 / Step 15 |
| `IdentityWorkerEntryRef` | `IdentityWorkerEntryContext` | 单次 worker entry identity | worker dispatcher 生成;不等于 source event id | Step 8 / Step 13 |
| `IdentityEventEnvelopeMarkerRef` | `IdentityWorkerEntryContext` | inbound/callback envelope safe marker | 来自 event envelope parser;不保存 event payload body | Step 8 |
| `IdentityConsumerBindingRef` | `IdentityWorkerEntryContext` | consumer binding / subscription marker | 来自 config/topic binding;不保存 broker topic string | Step 8 / Step 14 |
| `IdentityWorkerDispatchRef` | worker dispatch result | worker dispatch attempt identity | worker dispatcher 生成;不等于 consumer receipt ref | Step 9 / Step 15 |
| `IdentityJobEntryRef` | `IdentityJobEntryContext` | 单次 job entry identity | job runner 生成;不等于 job_run_ref | Step 8 / Step 14 |
| `IdentityJobRunMetadataRef` | `IdentityJobEntryContext` | job run metadata safe marker | 来自 job runner args / schedule;不保存 raw CLI args with secrets | Step 8 / Step 14 |
| `IdentityJobScopeMarkerRef` | `IdentityJobEntryContext` | job scope request marker | 来自 job input/schedule;scope expansion 留 Step 9 | Step 8 / Step 9 |
| `IdentityJobDispatchRef` | job dispatch result | job dispatch attempt identity | job runner 生成;不等于 job report ref | Step 9 / Step 15 |
| `IdentityEntrySurfaceKind` | dispatch guard / validation | ApiCommand/ApiQuery/WorkerConsumer/WorkerCallback/Job | 来自 entry factory;不得自由字符串 | Step 8 / Step 12 |
| `IdentityDispatchTargetRef` | dispatch guard | application service target marker | 来自 service catalog;不得直接指向 repository/adapter | Step 9 |

#### 7.17.4 `IdentityRuntimeConfigShell`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `infra::config` |
| capability | 承接已校验 runtime profile、adapter mode、store/job/publisher/handoff binding 的配置外壳 |
| 对象类别 | infra entry helper / validated config shell |
| 责任 | 保存 profile、config evidence、adapter mode refs、entry binding refs、issue refs 和 validation state |
| 非责任 | 不保存 secret/raw env/raw config body、不定义 config loader trait、不改变 domain invariant、不实例化 adapter |
| 后续 Step | Step 14 配置 schema / loader / validation;Step 7 adapter binding;Step 15 config evidence |

```rust
pub struct IdentityRuntimeConfigShell {
    pub profile_ref: IdentityRuntimeProfileRef,
    pub config_evidence_ref: IdentityConfigEvidenceRef,
    pub adapter_mode_refs: Vec<IdentityAdapterModeRef>,
    pub api_binding_ref: Option<IdentityApiRouteCatalogRef>,
    pub worker_binding_ref: Option<IdentityConsumerBindingCatalogRef>,
    pub job_binding_ref: Option<IdentityJobCatalogRef>,
    pub issue_refs: Vec<IdentityConfigIssueRef>,
    pub validation_state: IdentityConfigValidationStateKind,
}

pub enum IdentityConfigValidationStateKind {
    Validated,
    Degraded,
    Invalid,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `profile_ref` | config profile binding | profile 只能影响 adapter/runtime behavior,不能改变 truth ownership |
| `config_evidence_ref` | config loader safe evidence | 不保存 env raw value、secret、full config body |
| `adapter_mode_refs` | validated config | fake/controlled/endpoint/disabled 只表达 mode,不伪造成业务成功 |
| `api_binding_ref` | route catalog binding | optional;API process 可无 worker/job binding |
| `worker_binding_ref` | consumer/callback binding catalog | optional;不得保存 broker topic/raw subscription string |
| `job_binding_ref` | job catalog binding | optional;不得保存 raw CLI args |
| `issue_refs` | config validator | `Degraded` / `Invalid` 必须有 issue refs |
| `validation_state` | config validator | invalid 不得进入 assembled runtime |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `validated(...)` | profile、evidence、bindings、adapter modes | config shell | issue refs 为空;不实例化 adapter |
| `degraded(...)` | profile、evidence、bindings、adapter modes、issue refs | config shell | issue refs 必须非空;可启动性由 Step 14 |
| `invalid(...)` | profile/evidence、issue refs | config shell | issue refs 必须非空;不得继续 assembly |
| `allows_entry(surface_kind)` | entry surface kind | bool | 只基于 binding marker 判断;不做权限 |
| `adapter_modes()` | self | slice | 只读 helper |

不变量:

- config shell 不得保存 secret、token、raw env value、full config body、endpoint credential 或 broker credential。
- config 不得放宽 query no-write、body-free、report-only、accepted-only outbox、fake delivered guard 等 domain / application 红线。
- disabled adapter 只能表达 unavailable/degraded,不能被 entry 伪装为 accepted success。
- `Invalid` config shell 不得进入 `IdentityRuntimeAssemblyState::Assembled`。

#### 7.17.5 `IdentityRuntimeAssemblyState`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `infra::config` / `infra::runtime` |
| capability | 表达 runtime wiring 从未启动、配置已校验、已装配、降级、失败的状态 |
| 对象类别 | infra entry helper / runtime state |
| 责任 | 保存 assembly ref、profile、state、adapter availability refs、issue refs 和 assembled_at |
| 非责任 | 不保存 adapter implementation、不执行 health check、不代表 business truth health |
| 后续 Step | Step 14 runtime builder;Step 15 runtime observability;Step 16 fake/runtime tests |

```rust
pub struct IdentityRuntimeAssemblyState {
    pub assembly_ref: IdentityRuntimeAssemblyRef,
    pub profile_ref: IdentityRuntimeProfileRef,
    pub state_kind: IdentityRuntimeAssemblyStateKind,
    pub adapter_availability_refs: Vec<IdentityAdapterRef>,
    pub issue_refs: Vec<IdentityConfigIssueRef>,
    pub assembled_at: Option<IdentityTimestamp>,
}

pub enum IdentityRuntimeAssemblyStateKind {
    NotStarted,
    ConfigValidated,
    Assembled,
    Degraded,
    Failed,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `assembly_ref` | runtime bootstrap id generator | 不得由 profile + timestamp 拼接 |
| `profile_ref` | `IdentityRuntimeConfigShell` | 与 config shell profile 一致 |
| `state_kind` | runtime builder lifecycle | `Failed` / `Degraded` 必须带 issue refs |
| `adapter_availability_refs` | adapter availability catalog | 只保存 adapter refs,不保存 implementation handles |
| `issue_refs` | config/runtime validator | body-free issue marker |
| `assembled_at` | clock | 不代表 service readiness cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `not_started(assembly_ref, profile_ref)` | refs | state | 无 adapter refs |
| `config_validated(config_shell)` | validated config | state | invalid config 不可调用 |
| `assembled(config_shell, adapter_refs, assembled_at)` | config、adapter refs、time | state | 所有 required adapter availability 已校验 |
| `degraded(config_shell, adapter_refs, issue_refs, assembled_at)` | config、partial adapters、issues、time | state | issue refs 必须非空 |
| `failed(config_shell, issue_refs)` | config、issues | state | issue refs 必须非空;不得 dispatch entry |
| `can_dispatch(surface_kind)` | self | bool | 只表达 runtime assembled/degraded 是否允许 entry 尝试 |

不变量:

- runtime assembly state 不得保存 adapter object、connection string、secret 或 raw health check body。
- `Assembled` 只表示 wiring 完成,不表示 downstream publish/deliver/consume 成功。
- `Degraded` 必须可见,不得伪装成 `Assembled`。
- entry dispatch 必须检查 assembly state,但 business decision 仍由 application/domain 完成。

#### 7.17.6 `IdentityAdapterAvailability`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `infra::config` / `infra::runtime` |
| capability | 表达 resolver/store/publisher/handoff/report writer 等 adapter 的 mode 与可用性 |
| 对象类别 | infra entry helper / adapter availability |
| 责任 | 保存 adapter ref、mode、availability kind、issue marker、checked_at |
| 非责任 | 不定义 port trait、不调用 adapter、不保存 external response body、不决定 domain accepted |
| 后续 Step | Step 7 port/adapter;Step 14 adapter config;Step 16 fake/controlled tests |

```rust
pub struct IdentityAdapterAvailability {
    pub adapter_ref: IdentityAdapterRef,
    pub adapter_mode_ref: IdentityAdapterModeRef,
    pub availability_kind: IdentityAdapterAvailabilityKind,
    pub issue_ref: Option<IdentityAdapterAvailabilityIssueRef>,
    pub checked_at: IdentityTimestamp,
}

pub enum IdentityAdapterAvailabilityKind {
    Available,
    Degraded,
    Unavailable,
    Disabled,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `adapter_ref` | adapter catalog | 不等于 endpoint URL / topic / target path |
| `adapter_mode_ref` | config shell | fake/controlled/endpoint/disabled 明确区分 |
| `availability_kind` | config/health/assembly summary | disabled 不得变成 available |
| `issue_ref` | availability checker | Degraded/Unavailable/Disabled 必须带 issue 或 config issue |
| `checked_at` | clock | 不替代 source freshness cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `available(adapter_ref, mode, checked_at)` | refs、time | availability | disabled mode 不可 available |
| `degraded(adapter_ref, mode, issue_ref, checked_at)` | refs、issue、time | availability | issue 必填 |
| `unavailable(adapter_ref, mode, issue_ref, checked_at)` | refs、issue、time | availability | issue 必填 |
| `disabled(adapter_ref, mode, issue_ref, checked_at)` | refs、issue、time | availability | mode 必须表达 disabled |
| `allows_attempt()` | self | bool | Available/Degraded 可尝试与否由 Step 14 细化;Disabled 必 false |
| `must_not_fake_success()` | self | bool | fake/controlled/disabled 均不能伪造 published/delivered/accepted |

不变量:

- adapter availability 不是 external truth state,不得反写 identity domain state。
- fake / controlled adapter 只能返回受控 marker,不得把 request sent 当 published/delivered。
- disabled adapter 必须形成 visible issue/degraded/unavailable surface,不得静默跳过 accepted side effect。
- adapter ref、mode、issue 均为 body-free marker。

#### 7.17.7 `IdentityApiEntryContext`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `api::handlers` / `api::router` |
| capability | 承接 Command / Query API entry 的 route、request marker、actor/metadata/idempotency/visibility context |
| 对象类别 | api entry helper |
| 责任 | 保存 API entry ref、route、surface kind、request marker、actor context、metadata marker、idempotency key、visibility context |
| 非责任 | 不保存 request body/header secret、不定义 DTO schema、不做 domain validation、不直接调用 repository |
| 后续 Step | Step 8 API request/result DTO;Step 9 handler/service flow;Step 12 API error mapping |

```rust
pub struct IdentityApiEntryContext {
    pub api_entry_ref: IdentityApiEntryRef,
    pub route_ref: IdentityApiRouteRef,
    pub surface_kind: IdentityEntrySurfaceKind,
    pub request_marker_ref: IdentityApiRequestMarkerRef,
    pub actor_ref: ActorRef,
    pub request_metadata_ref: IdentityRequestMetadataRef,
    pub idempotency_key: Option<IdentityIdempotencyKey>,
    pub visibility_context_ref: Option<VisibilityContextRef>,
    pub received_at: IdentityTimestamp,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `api_entry_ref` | handler entry factory | 不等于 operation context ref |
| `route_ref` | route catalog | 不得从 raw URL 临时拼接 |
| `surface_kind` | route binding | command/query 必须显式区分 |
| `request_marker_ref` | request material marker builder | 不保存 request body、header secret、credential |
| `actor_ref` | actor extractor | actor context 不等于 member ref |
| `request_metadata_ref` | metadata extractor | body-free metadata marker |
| `idempotency_key` | command metadata | query 可为空;是否必填留 Step 13 |
| `visibility_context_ref` | query metadata / visibility extractor | command 可为空 |
| `received_at` | clock | 不替代 operation started_at 或 truth cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_command_route(...)` | route、request marker、actor、metadata、key、time | API command context | surface kind 固定 ApiCommand;visibility 可为空 |
| `from_query_route(...)` | route、request marker、actor、metadata、visibility context、time | API query context | surface kind 固定 ApiQuery;不得带 mutation intent |
| `to_operation_context(...)` | request digest、trace context、context ref、started_at | `IdentityOperationContext` | 只做 mapping;不调用 service |
| `requires_idempotency()` | self | bool | 仅表达 entry 规则;最终留 Step 13 |

不变量:

- API entry context 不得保存 request body、raw header、credential、token、secret 或 response body。
- command/query route 必须由 route catalog 显式区分;handler 不得根据 HTTP method 或 URL 字符串猜业务语义。
- API entry 不得直接访问 repository / adapter / UoW,必须通过 application service dispatch。
- query API entry 不得触发 create、refresh、rebuild、repair 或 outbox publish。

#### 7.17.8 `IdentityApiEntryValidation` 与 `IdentityApiDispatchResult`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `api::handlers` |
| capability | 表达 API entry 的 pre-dispatch validation 与 dispatch attempt result |
| 对象类别 | api entry helper / validation result |
| 责任 | 区分 accepted-for-dispatch、rejected-at-entry、not-routable、runtime-unavailable、dispatched |
| 非责任 | 不定义 HTTP status、不替代 application rejection、不保存 raw error |
| 后续 Step | Step 8 API result DTO;Step 12 error mapping;Step 15 handler observability |

```rust
pub struct IdentityApiEntryValidation {
    pub api_entry_ref: IdentityApiEntryRef,
    pub route_ref: IdentityApiRouteRef,
    pub validation_kind: IdentityEntryValidationKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}

pub struct IdentityApiDispatchResult {
    pub dispatch_ref: IdentityEntryDispatchRef,
    pub api_entry_ref: IdentityApiEntryRef,
    pub target_ref: IdentityDispatchTargetRef,
    pub dispatch_kind: IdentityEntryDispatchKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}
```

```rust
pub enum IdentityEntryValidationKind {
    Dispatchable,
    RejectedAtEntry,
    NotRoutable,
    RuntimeUnavailable,
}

pub enum IdentityEntryDispatchKind {
    Dispatched,
    SkippedRejectedAtEntry,
    SkippedRuntimeUnavailable,
    FailedBeforeApplication,
}
```

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `dispatchable(api_entry_ref, route_ref)` | refs | validation | issue refs 为空 |
| `rejected_at_entry(api_entry_ref, route_ref, issue_refs)` | refs、issues | validation | issue refs 必须非空 |
| `runtime_unavailable(api_entry_ref, route_ref, issue_refs)` | refs、issues | validation | issue refs 必须非空 |
| `dispatched(api_entry_ref, target_ref, dispatch_ref)` | refs | dispatch result | 不包含 service result body |
| `failed_before_application(api_entry_ref, target_ref, issue_refs)` | refs、issues | dispatch result | issue refs 必须非空 |

不变量:

- entry validation failure 不等于 domain/application rejection;Step 12 必须单独映射 public surface。
- `Dispatched` 只说明已调用 application boundary,不说明 command accepted 或 query visible。
- issue refs 必须 body-free,不得保存 raw request、panic stack、secret 或 external error body。

#### 7.17.9 `IdentityWorkerEntryContext`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `worker::dispatcher` |
| capability | 承接 inbound event consumer 与 handoff/archive callback 的 envelope、binding、dedupe、trace context |
| 对象类别 | worker entry helper |
| 责任 | 保存 worker entry ref、surface kind、consumer binding、envelope marker、source event ref、dedupe key、trace context、received_at |
| 非责任 | 不保存 event payload body、不定义 event DTO schema、不拥有外部 truth、不直接更新 repository |
| 后续 Step | Step 8 event/callback schema;Step 9 consumer/callback flow;Step 13 dedupe;Step 14 consumer binding |

```rust
pub struct IdentityWorkerEntryContext {
    pub worker_entry_ref: IdentityWorkerEntryRef,
    pub surface_kind: IdentityEntrySurfaceKind,
    pub consumer_binding_ref: IdentityConsumerBindingRef,
    pub envelope_marker_ref: IdentityEventEnvelopeMarkerRef,
    pub source_event_ref: IdentitySourceEventRef,
    pub idempotency_key: IdentityIdempotencyKey,
    pub trace_context_ref: Option<IdentityTraceContextRef>,
    pub received_at: IdentityTimestamp,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `worker_entry_ref` | worker dispatcher | 不等于 source event ref |
| `surface_kind` | binding catalog | WorkerConsumer / WorkerCallback 显式区分 |
| `consumer_binding_ref` | binding config | 不保存 broker topic string |
| `envelope_marker_ref` | envelope parser | 不保存 payload body |
| `source_event_ref` | event envelope | consumer 必填;不得从 payload hash 临时生成 |
| `idempotency_key` | dedupe key builder | 不等于 source cursor |
| `trace_context_ref` | envelope metadata | runtime trace marker,不等于 identity trace record |
| `received_at` | clock | 不替代 source version/cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_inbound_event(...)` | binding、envelope marker、source event ref、dedupe key、trace context、time | worker consumer context | surface kind 固定 WorkerConsumer |
| `from_callback_event(...)` | binding、envelope marker、source event ref、dedupe key、trace context、time | worker callback context | surface kind 固定 WorkerCallback |
| `to_operation_context(...)` | digest、actor/system actor、context ref、started_at | `IdentityOperationContext` | channel 映射为 Consumer 或 HandoffCallback |
| `requires_dedupe()` | self | bool | consumer/callback 均 true |

不变量:

- worker entry context 不得保存 event payload body、external receipt body、archive package、raw broker headers、credential 或 secret。
- consumer/callback 只消费外部已成立事实或 marker,不得拥有外部 truth。
- worker 不得直接写 repository 或 domain object,必须 dispatch 到 application service。
- dedupe key 不得替代 source event ref、source version、truth cursor 或 idempotency record ref。

#### 7.17.10 `IdentityWorkerEntryValidation` 与 `IdentityWorkerDispatchResult`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `worker::dispatcher` |
| capability | 表达 worker entry 的 envelope/binding/dedupe/runtime validation 与 dispatch result |
| 对象类别 | worker entry helper / validation result |
| 责任 | 区分 dispatchable、unrecognized、dedupe missing、runtime unavailable、dispatched / skipped |
| 非责任 | 不定义 consumer receipt DTO、不执行 source resolver、不保存 event body |
| 后续 Step | Step 8 consumer receipt;Step 12 unrecognized/unavailable;Step 13 duplicate replay |

```rust
pub struct IdentityWorkerEntryValidation {
    pub worker_entry_ref: IdentityWorkerEntryRef,
    pub consumer_binding_ref: IdentityConsumerBindingRef,
    pub validation_kind: IdentityWorkerEntryValidationKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}

pub struct IdentityWorkerDispatchResult {
    pub dispatch_ref: IdentityWorkerDispatchRef,
    pub worker_entry_ref: IdentityWorkerEntryRef,
    pub target_ref: IdentityDispatchTargetRef,
    pub dispatch_kind: IdentityEntryDispatchKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}
```

```rust
pub enum IdentityWorkerEntryValidationKind {
    Dispatchable,
    UnrecognizedBinding,
    MissingDedupeKey,
    InvalidEnvelopeMarker,
    RuntimeUnavailable,
}
```

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `dispatchable(worker_entry_ref, binding_ref)` | refs | validation | issue refs 为空 |
| `unrecognized_binding(worker_entry_ref, binding_ref, issue_refs)` | refs、issues | validation | issue refs 必须非空 |
| `missing_dedupe_key(worker_entry_ref, binding_ref, issue_refs)` | refs、issues | validation | 不从 payload body 补 key |
| `invalid_envelope_marker(worker_entry_ref, binding_ref, issue_refs)` | refs、issues | validation | 不保存 invalid body |
| `dispatched(worker_entry_ref, target_ref, dispatch_ref)` | refs | dispatch result | 不包含 consumer receipt body |

不变量:

- unrecognized binding 不得 silent ack 为业务成功;Step 12/13 必须明确 ack/retry/dead-letter surface。
- missing dedupe key 不得通过 payload body hash 自行补造。
- dispatch result 不等于 consumer accepted receipt;receipt schema 留 Step 8。

#### 7.17.11 `IdentityJobEntryContext`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `jobs::runner` |
| capability | 承接 operations job 的 run metadata、scope、cursor、system actor、idempotency key |
| 对象类别 | jobs entry helper |
| 责任 | 保存 job entry ref、job name、run ref、metadata marker、scope marker、input cursor、system actor、idempotency key、started_at |
| 非责任 | 不保存 raw CLI args/secret、不定义 job input DTO、不执行 job flow、不直接访问 repository |
| 后续 Step | Step 8 job input/report DTO;Step 9 job flow;Step 13 job replay;Step 14 job config |

```rust
pub struct IdentityJobEntryContext {
    pub job_entry_ref: IdentityJobEntryRef,
    pub job_name: IdentityJobName,
    pub job_run_ref: IdentityJobRunRef,
    pub run_metadata_ref: IdentityJobRunMetadataRef,
    pub scope_marker_ref: IdentityJobScopeMarkerRef,
    pub input_cursor_ref: Option<IdentityJobCursorRef>,
    pub system_actor_ref: ActorRef,
    pub idempotency_key: IdentityIdempotencyKey,
    pub started_at: IdentityTimestamp,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `job_entry_ref` | job runner entry factory | 不等于 job_run_ref |
| `job_name` | job binary / catalog | 必须是正式 job name |
| `job_run_ref` | scheduler / run metadata | 不得由 job name + timestamp 拼接 |
| `run_metadata_ref` | job runner metadata | 不保存 raw CLI args / env secret |
| `scope_marker_ref` | job input / schedule | scope expansion 留 Step 9 |
| `input_cursor_ref` | job input / previous report | 不得用 timestamp/page cursor/key 替代 |
| `system_actor_ref` | system actor context | job 不伪造 human actor |
| `idempotency_key` | job run metadata | duplicate replay 使用;不是 cursor |
| `started_at` | clock | 不替代 job cursor |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `from_job_run(...)` | job name、run ref、metadata、scope、cursor、system actor、key、time | job entry context | 不执行 job |
| `to_operation_context(...)` | digest、trace context、context ref、started_at | `IdentityOperationContext` | channel 固定 OperationsJob |
| `to_initial_report(...)` | report ref | `IdentityJobRunReport` | 只创建 report assembly object |
| `requires_idempotency()` | self | bool | job entry true |

不变量:

- job entry 不是 business command,不得直接推进 GlobalMember、lifecycle、role、career、memory truth。
- job entry 不得保存 raw args、raw config、secret、adapter endpoint 或 runtime log。
- job scope marker 不等于 expanded target list;scope expansion 和 authorization 留 Step 9/14。
- job runner 不得绕过 application service 访问 repository / adapter。

#### 7.17.12 `IdentityJobEntryValidation` 与 `IdentityJobDispatchResult`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `jobs::runner` |
| capability | 表达 job entry 的 name/scope/cursor/runtime/idempotency validation 与 dispatch result |
| 对象类别 | jobs entry helper / validation result |
| 责任 | 区分 dispatchable、unknown job、invalid scope、invalid cursor、runtime unavailable、dispatched |
| 非责任 | 不定义 job report DTO、不执行 job retry schedule、不保存 raw failure |
| 后续 Step | Step 8 job protocol;Step 9 job flow;Step 12 job error;Step 14 retry/timeout |

```rust
pub struct IdentityJobEntryValidation {
    pub job_entry_ref: IdentityJobEntryRef,
    pub job_name: IdentityJobName,
    pub validation_kind: IdentityJobEntryValidationKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}

pub struct IdentityJobDispatchResult {
    pub dispatch_ref: IdentityJobDispatchRef,
    pub job_entry_ref: IdentityJobEntryRef,
    pub target_ref: IdentityDispatchTargetRef,
    pub dispatch_kind: IdentityEntryDispatchKind,
    pub issue_refs: Vec<IdentityEntryValidationIssueRef>,
}
```

```rust
pub enum IdentityJobEntryValidationKind {
    Dispatchable,
    UnknownJob,
    InvalidScope,
    InvalidCursor,
    MissingIdempotencyKey,
    RuntimeUnavailable,
}
```

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `dispatchable(job_entry_ref, job_name)` | refs | validation | issue refs 为空 |
| `unknown_job(job_entry_ref, job_name, issue_refs)` | refs、issues | validation | issue refs 必须非空 |
| `invalid_scope(job_entry_ref, job_name, issue_refs)` | refs、issues | validation | 不保存 raw scope body |
| `invalid_cursor(job_entry_ref, job_name, issue_refs)` | refs、issues | validation | 不尝试自动修复 cursor |
| `missing_idempotency_key(job_entry_ref, job_name, issue_refs)` | refs、issues | validation | 不用 cursor / run ref 代替 key |
| `dispatched(job_entry_ref, target_ref, dispatch_ref)` | refs | dispatch result | 不包含 job report body |

不变量:

- invalid cursor 不得 fallback 到 full scan,除非 Step 9/14 明确 job flow 允许。
- missing idempotency key 不得用 job_run_ref、cursor 或 timestamp 代替。
- job dispatch result 不等于 job report;report assembly 由 `IdentityJobRunReport` 和 Step 8/9 负责。

#### 7.17.13 `IdentityEntryDispatchGuard`

| 项 | 内容 |
|---|---|
| 所属批次 | `6.7 infra / api / worker / jobs entry objects` |
| 组件 / crate | `api::handlers` / `worker::dispatcher` / `jobs::runner` |
| capability | 防止 API/worker/jobs entry 绕过 application service 或直接访问 infra store/adapter |
| 对象类别 | entry helper / guard |
| 责任 | 校验 surface kind、runtime assembly state、dispatch target、application-only dispatch 边界 |
| 非责任 | 不做 domain authorization、不做 visibility、不执行 service flow、不定义 route/event/job schema |
| 后续 Step | Step 9 handler/consumer/job dispatch flow;Step 15 observability;Step 16 boundary tests |

```rust
pub struct IdentityEntryDispatchGuard {
    pub surface_kind: IdentityEntrySurfaceKind,
    pub target_ref: IdentityDispatchTargetRef,
    pub runtime_state_kind: IdentityRuntimeAssemblyStateKind,
    pub adapter_availability_refs: Vec<IdentityAdapterRef>,
}

pub enum IdentityEntrySurfaceKind {
    ApiCommand,
    ApiQuery,
    WorkerConsumer,
    WorkerCallback,
    OperationsJob,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `surface_kind` | entry context | 不得自由字符串 |
| `target_ref` | service catalog / dispatch mapping | 必须指向 application service target,不得指向 repository/adapter |
| `runtime_state_kind` | runtime assembly state | Failed 不得 dispatch |
| `adapter_availability_refs` | runtime assembly state | 只用于 entry readiness,不用于 domain decision |

| 函数 / factory | 输入 | 输出 | 约束 |
|---|---|---|---|
| `for_api(...)` | API context、runtime state、target | guard | target 必须为 application API service |
| `for_worker(...)` | worker context、runtime state、target | guard | target 必须为 application consumer/callback service |
| `for_job(...)` | job context、runtime state、target | guard | target 必须为 application maintenance/propagation service |
| `assert_application_dispatch_only()` | self | `Ok(())` / issue | 禁止 repository/adapter/UoW target |
| `assert_runtime_dispatchable()` | self | `Ok(())` / issue | Failed/Invalid runtime 不得 dispatch |
| `assert_surface_target_matches()` | self | `Ok(())` / issue | ApiQuery 不得 dispatch 到 command mutation target |

不变量:

- entry dispatch guard 不替代 domain policy、visibility policy 或 application precheck。
- entry target 必须是 application service target;不得指向 repository、adapter、publisher、handoff runner 或 projection store。
- API query、worker consumer、operations job 的 target 必须与 surface kind 匹配,不得用配置或 route 覆盖读写边界。
- guard issue 必须通过 safe issue marker 表达,不得保存 raw request/event/job/config body。

#### 7.17.14 本批并入 / 后移 / 排除对象

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| public command/query/event/job DTO | 后移 | 协议 schema 不属于 entry object contract | Step 8 |
| HTTP status / API response envelope | 后移 | public error/result 映射 | Step 8 / Step 12 |
| event payload schema / ack / dead-letter policy | 后移 | event protocol 与 consumer recovery | Step 8 / Step 12 / Step 13 |
| job retry schedule / timeout / batch size | 后移 | runtime config 与 operations policy | Step 14 |
| adapter trait / resolver trait / publisher trait | 后移 | port / adapter contract | Step 7 |
| durable repository / fake runtime behavior | 后移 | adapter implementation and fake equivalence | Step 7 / Step 11 / Step 16 |
| service dispatch flow | 后移 | 函数级 flow | Step 9 |
| observability event/log/metric schema | 后移 | runtime observability | Step 15 |
| CLI / ops manual command entry | 排除本批 | `02` P0 未定义人工 CLI / ops command | 如新增需回 Step 2/4/6 |
| config loader implementation | 后移 | 配置加载机制 | Step 14 |

#### 7.17.15 6.7 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先写 capability 清单 | 通过 | §7.17.1 从 runtime config、assembly、adapter availability、API/worker/job entry、dispatch guard 推导 |
| 是否有功能到对象映射 | 通过 | §7.17.2 将 config/runtime/adapter/API/worker/job/guard 分离 |
| 是否补齐 typed refs / marker | 通过 | §7.17.3 收敛 runtime、adapter、API、worker、job、dispatch marker |
| 是否定义字段来源 | 通过 | 每个对象都有字段来源和禁止保存 raw body/secret 的约束 |
| 是否定义 factory / function | 通过 | 每个对象都有 entry factory / validation / dispatch helper,但不定义 service flow |
| 是否越过 Step 7 | 未越过 | 未定义 port trait、adapter trait 或 fake runtime 等价语义 |
| 是否越过 Step 8 | 未越过 | 未定义 command/query/event/job DTO schema |
| 是否越过 Step 9 / 11 / 14 | 未越过 | 未定义函数级 flow、repository transaction、config loader/具体配置项 |
| 是否入口绕过 application | 未发生 | `IdentityEntryDispatchGuard` 明确 target 只能指向 application service |
| 是否保存 forbidden material | 未发生 | entry/context/validation/result 均只保存 body-free marker/ref |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.8` | 用户审核通过后进入字段闭环表 |

#### 7.17.16 6.7 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| runtime config | config shell 保存 profile ref、evidence marker、adapter mode refs | config shell 保存 raw env、secret、完整 TOML/JSON body |
| config invariant | profile 只能影响 adapter/runtime behavior | profile 允许 query 写 truth 或 job 修复 core truth |
| runtime assembly | `Assembled` 只代表 wiring 完成 | `Assembled` 代表下游 publish/deliver 成功 |
| degraded runtime | `Degraded` 带 issue refs 并对 entry 可见 | degraded 被伪装成 assembled success |
| adapter mode | fake/controlled/endpoint/disabled 显式区分 | fake adapter 直接返回 published/delivered success |
| disabled adapter | disabled 形成 issue/unavailable surface | disabled 时静默跳过 outbox/handoff side effect |
| API route | route ref 来自 route catalog | handler 从 raw URL 字符串猜 operation |
| API request marker | entry context 保存 body-free request marker | entry context 保存 request body/header secret |
| API query | query entry surface kind 固定 ApiQuery | query handler dispatch 到 command mutation target |
| API dispatch | dispatch result 只说明调用 application boundary | dispatch result 被当成 command accepted |
| worker envelope | worker context 保存 envelope marker 和 source event ref | worker context 保存 event payload body |
| worker dedupe | dedupe key 来自 envelope/binding | 缺 key 时用 payload hash 私造 |
| unrecognized binding | 输出 unrecognized issue surface | silent ack 成业务成功 |
| job run | job_run_ref 来自 scheduler/run metadata | 用 job name + timestamp 拼 run ref |
| job cursor | input cursor ref 是正式 job cursor marker | invalid cursor fallback 到 full scan |
| job idempotency | job entry 必须有 idempotency key | 用 job_run_ref 或 cursor 替代 key |
| dispatch guard | target 只能是 application service target | entry 直接调用 repository、publisher、handoff adapter |
| issue marker | validation issue 保存 safe marker | issue 保存 raw stack trace、config secret、external response body |

### 7.18 6.8 字段闭环表

本批不新增对象,只审计 `6.1`~`6.7` 已出现的字段族。目标是让 Step 7~14 在定义 port、DTO、flow、persistence、idempotency、config 和 tests 时,能直接知道每类字段的正式来源、禁止替代、后续承接位置和实现暂停条件。若后续实现发现某字段没有正式来源,必须回到本表或对应 Step 文档闭口,不得在代码里临时拼接、解析字符串、复用 timestamp/version/idempotency key 或 fake 私有 map。

#### 7.18.1 6.8 字段闭环能力清单

| capability | 覆盖字段族 | 本批产物 | 不做什么 |
|---|---|---|---|
| 高复用字段来源审计 | id/ref、actor、timestamp、operation channel、reason/source/basis、safe summary、material marker | §7.18.2 | 不新增 object schema |
| cursor / version / key 防混用 | truth cursor、projection cursor、job cursor、source version、optimistic version、idempotency key、digest | §7.18.3 | 不定义 repository transaction |
| subject / scope / view lookup 防拼接 | trace/audit/outbox subject、read subject、view ref、projection ref、scope ref、target ref | §7.18.4 | 不定义 mapper trait |
| 外部 reference / source / evidence / receipt 边界 | source ref、external reference state、safe summary、evidence ref、receipt ref、handoff material | §7.18.5 | 不定义 resolver/adapter |
| 对象组字段闭环 | core truth、history、view/report、outbox/handoff、application helper、entry helper | §7.18.6 | 不重复对象正文 |
| 实现暂停条件 | 字段缺 source、字段混用、field-to-port 无法追溯、fake 需私有 map | §7.18.7 | 不裁定后续 Step 的最终 schema |

#### 7.18.2 高复用字段来源审计表

| 字段族 | 出现对象 / 批次 | 正式来源 | 禁止替代 / 禁止推断 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|
| `GlobalMemberId` / `GlobalMemberRef` | `GlobalMember`, lifecycle, role, career, memory, view, trace | Step 7 id generator、request-bound typed id、loaded truth、accepted result、source event mapping | 不得用 account id、ProjectMember id、runtime id、display name、email 或 route string 替代 | Step 7 id/repository;Step 8 route/request;Step 11 uniqueness | 缺 id 生成责任或 route id 解析规则时暂停 |
| object local id/ref | career/memory/outbox/handoff/report/entry/context/result 等 | Step 7 id generator、projection builder、job runner、entry factory、report assembly | 不得由 `member_ref + type + timestamp` 拼接;不得复用 idempotency key | Step 7 id generator;Step 8/9 factory;Step 11 PK | 无 stable builder 或 id generator surface 时暂停 |
| `ActorRef` | command truth、policy、trace、audit、context、job/system actor | actor context / system actor context / entry metadata | 不得用 `GlobalMemberRef`、request user string、job name 或 source owner 替代 | Step 8 actor metadata;Step 9 flow;Step 12 missing actor | actor 来源不可信或 system actor 边界未定义时暂停 |
| `IdentityTimestamp` | created/changed/appended/occurred/checked/received/started/finished | Step 7 clock port / entry received clock | 不得替代 truth cursor、projection cursor、job cursor、optimistic version、source version | Step 7 clock;Step 11 persisted timestamp | 需要排序/并发/version 语义却只有 timestamp 时暂停 |
| `IdentityOperationChannel` | policy、operation context、entry factory | `IdentityOperationContext` / entry factory 固定 | 不得由 operation name 字符串或 route method 猜测;不得替代 authorization/visibility | Step 8 metadata;Step 9 dispatch;Step 10 no-write matrix | channel 与 entry surface 无法唯一映射时暂停 |
| reason refs | anchor/lifecycle/career/memory/change/reject/waive | command intent、accepted source summary、formal reason marker | 不保存 reason body、audit note、ticket body、policy text | Step 8 request fields;Step 12 public rejection | reason kind 或 source marker 未定义时暂停 |
| basis refs | `GovernanceBasisRef`, `EvidenceSummaryRef` usages | governance/evidence resolver safe summary、command basis marker | presence 不等于 valid;external ref 不等于 local truth;不保存 basis/evidence body | Step 7 resolver;Step 8 DTO;Step 9 precheck;Step 12 unavailable/invalid | 需要判断 sufficient/valid 但只有 opaque ref 时暂停 |
| safe summary refs | role/career/memory/reference/config/report | resolver/event/report builder safe summary marker | 不保存 external body、definition body、work body、memory body、diagnostic body | Step 7 resolver;Step 8 view/event;Step 12 degraded | safe summary 最小 schema 或 resolver 来源未定义时暂停 |
| material marker | change material/read material/handoff material/finding material/request marker | command/event/query assembler、handoff/report builder | safe marker 不得携带 forbidden body;forbidden marker 必须映射 rejected/degraded | Step 8 protocol;Step 12 error;Step 16 tests | 无法区分 safe/forbidden material kind 时暂停 |

#### 7.18.3 Cursor / version / key 防混用表

| 字段族 | 正式语义 | 正式来源 | 明确禁止 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|
| `IdentityTruthCursor` | committed identity accepted truth cursor | accepted truth change cursor assigner / committed truth store | timestamp、optimistic version、idempotency key、trace id、outbox id、source version | Step 7 cursor port;Step 9 accepted flow;Step 11 transaction;Step 13 replay | accepted trace/outbox/projection stale 需要 cursor 但无 assigner 时暂停 |
| `IdentityProjectionCursorRef` | projection rebuild / freshness cursor | projection builder、committed truth scan、projection store | query page cursor、timestamp、truth object version、idempotency key | Step 7 projection port;Step 11 projection store;Step 13 stale replay | projection stale/rebuild 需要 source cursor 但未定义扫描来源时暂停 |
| `IdentityJobCursorRef` | operations job input/output cursor | job request/schedule、previous job report、source scan port | timestamp、page cursor、retry count、job_run_ref、idempotency key | Step 8 job DTO;Step 9 job flow;Step 13 job replay;Step 14 batch/retry | job needs resume/partial but cursor source 未定义时暂停 |
| source version refs | role/source/reference external freshness | source event / resolver safe summary / external reference state | local updated_at、optimistic version、snapshot id、digest | Step 7 resolver;Step 8 event;Step 11 persistence | stale判断需要 version 但来源只给 timestamp/digest 时暂停 |
| optimistic `IdentityVersion` | repository concurrency version | versioned repository read / create result / list versioned item | source version、truth cursor、timestamp、digest、idempotency key | Step 7 repository;Step 11 transaction;Step 13 conflicts | save 需要 expected version 但没有 versioned read 时暂停 |
| `IdentityIdempotencyKey` | caller/system duplicate key | command metadata、event dedup key、job metadata、callback metadata | truth cursor、source marker、job cursor、source event ref、request digest | Step 8 metadata;Step 13 duplicate replay | mutation/consumer/job 要 replay 但 key 缺失或必填规则未定义时暂停 |
| `IdentityRequestDigest` | canonical request material digest | canonical material marker + schema version + algorithm marker | raw JSON string、timestamp、version、idempotency key、source digest | Step 8 canonicalization;Step 13 conflict | same-key conflict 需比较 digest 但 canonical schema 未定义时暂停 |
| source digest | external safe summary digest | resolver / event safe summary | request digest、idempotency digest、truth cursor | Step 7 resolver;Step 8 event;Step 12 digest mismatch | digest mismatch branch 要求存在但 payload schema 未定义时暂停 |
| `IdentityStoredResultRef` | duplicate replay result identity | stored result repository / result assembler | idempotency record ref、command result body、truth ref | Step 7 result repo;Step 11 persistence;Step 13 replay | duplicate replay 要返回 result 但 save/load surface 未定义时暂停 |

#### 7.18.4 Subject / scope / view lookup 闭环表

| 字段族 | 正式语义 | 正式来源 | 禁止事项 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|
| `IdentityTraceSubjectRef` | accepted trace canonical subject | Step 7 subject mapper from typed truth/ref | 不得拼 `member:<id>`、从 source ref 字符串解析、强转 audit/outbox subject | Step 7 mapper;Step 9 trace append;Step 15 audit | accepted flow 需要 trace 但 mapper 无对应 truth ref 时暂停 |
| `IdentityAuditSubjectRef` | audit trail canonical subject | Step 7 subject mapper / audit subject mapper | 不得从 trace subject 字符串派生,除非 mapper 明确同值 | Step 7 mapper/repo;Step 9 audit;Step 11 unique | audit trail save/update 需要 subject/ref 但读取面未闭合时暂停 |
| `IdentityOutboxSubjectRef` | outbound payload canonical subject | Step 7 subject mapper from accepted fact | 不得使用 `IdentityOutboundSubjectRef` 临时类型或拼 topic key | Step 7 mapper;Step 8 payload;Step 9 outbox | outbox record 需要 subject 但 accepted fact 无 mapper 时暂停 |
| marker trace subject | consumer/job/reference marker subject | formal marker subject mapper | 不得用 source string、event id、adapter ref 拼 subject | Step 7 marker mapper;Step 9 consumer/job;Step 15 trace | marker trace 要 append 但 mapper 未定义时暂停 |
| `IdentityReadSubjectRef` | query visibility subject | Step 7 `IdentityReadVisibilityRepository.resolve_*_read(...)` 返回的 `IdentityVisibilityAccessSummary.read_subject_ref`;repository / adapter 内部可使用 formal read subject mapper、loaded view/report 或 request-scoped typed ref | service / handler 不得从 route/query param/raw member id 拼接;不得从 `VisibilityScopeRef` 或 `VisibilityResultRef` 反推 | Step 7 read resolver;Step 9 query;Step 12 not visible | query visibility 需要 subject 但 access summary 无 `read_subject_ref` 时暂停 |
| `VisibilityScopeRef` / `VisibilityContextRef` | read visibility scope/context | query metadata、view ref、resolver summary、request | 不得从 subject 字符串拆 scope;不得用 actor ref 替代 | Step 7 visibility resolver;Step 8 query DTO;Step 9 query precheck | query flow 无法映射 scope 时暂停 |
| `MemberSummaryViewRef` / projection view refs | stable projection/read model identity | projection builder / projection index lookup | query 不得临时拼 view ref;不得扫描 store 私找 | Step 7 projection lookup;Step 11 index;Step 16 query tests | query 需要 view_ref 但无 builder/lookup 时暂停 |
| `IdentityProjectionRef` / `ProjectionStateRef` | projection state identity | projection catalog / builder | 不等于 view ref unless formally mapped;不得由 scope 拼接 | Step 7 projection repo;Step 11 persistence | stale/rebuild 需要 projection ref 但 scope expansion 未定义时暂停 |
| `MaintenanceScopeRef` / target refs | maintenance job scope and affected targets | job input/schedule、scope expansion port、projection/reference catalog | 不得全表扫描、解析 ref 前缀、从 config profile 推断业务 scope | Step 7 maintenance port;Step 9 job;Step 14 config | job/reconciliation 需要 affected targets 但 expansion rule 未定义时暂停 |
| `HandoffScopeRef` / `HandoffTargetRef` | handoff allowed target/scope | config binding / allowed target catalog | 不得保存 bucket/path/raw endpoint;不得把 target available 当 delivered | Step 7 handoff port;Step 14 config;Step 12 target unavailable | prepare/deliver handoff 需要 target rule 但 binding 未定义时暂停 |

#### 7.18.5 External reference / source / receipt 边界表

| 字段族 | 正式语义 | 正式来源 | 禁止事项 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|
| `IdentitySourceRef` | business source link / reason source / command source marker | request schema、event metadata、resolver summary | 不自动等于 external reference bundle key;不保存 body;不从 `external_ref` 前缀推 owner | Step 7 resolver;Step 8 DTO/event;Step 12 wrong owner | flow 同时有 source ref 与 reference ref 但未区分用途时暂停 |
| `ExternalReferenceRef` | external reference resolution bundle key | resolver / event envelope / reference state | 不等于 `IdentitySourceRef`;不得由 source string 拼接;不得复用 same expected_version 到第二 bundle | Step 7 reference repo;Step 11 versioned save | typed sidecar save 需要 bundle key 但 payload 只给 business source 时暂停 |
| local owner refs | `IdentityReferenceOwnerRef` 等 | object truth ref / local owner mapper | 不得把 external reference 反写为 local owner truth | Step 7 owner mapper;Step 11 foreign key/index | reference state 需要 owner 但 owner mapper 未定义时暂停 |
| role/capability source refs | `RoleCapabilitySourceRef`, `RoleSourceRef`, `CapabilitySourceRef` | method-library resolver/event safe summary | 不保存 RoleDefinition/CapabilityDefinition/method body;不从 string 推 kind | Step 7 source resolver;Step 8 event;Step 9 summary update | source kind/supports_role/capability 未闭合时暂停 |
| career source marker | `CareerSourceMarkerRef`, `WorkSourceRef`, `ProjectParticipationRef` | work accepted event / work resolver safe summary | 不拥有 ProjectMember/Work truth;duplicate source 不等于 idempotency key | Step 7 work resolver;Step 8 event;Step 11 uniqueness;Step 13 duplicate | duplicate guard 需要 source key 但 source marker 未定义时暂停 |
| memory/archive source marker | `MemoryReferenceSourceRef`, `ArchiveRef`, `ArchiveHandoffRef` | memory/archive resolver or callback marker | 不保存 memory body、embedding、index、archive package、receipt body | Step 7 resolver/handoff;Step 8 callback;Step 14 target | archive callback 需要 receipt/source relation 但 marker 未定义时暂停 |
| evidence refs | `CapabilityEvidenceRef`, `EvidenceSummaryRef` 等 | evidence resolver / source event / command basis | evidence ref 不等于 artifact body;verified presence 需 safe digest/summary;不保存 evidence body | Step 7 resolver;Step 8 DTO/event;Step 12 digest/body rejected | policy 需要 acceptable evidence 但 only opaque ref 无 summary 时暂停 |
| receipt refs | `HandoffReceiptRef`, stored receipt marker | handoff callback / adapter receipt marker builder | request sent、HTTP 2xx、job log success 不等于 delivered;不保存 receipt body/signature raw | Step 8 receipt DTO;Step 9 callback;Step 14 adapter;Step 16 fake delivered tests | state 要进入 Delivered 但无 formal receipt marker 时暂停 |
| config evidence refs | `IdentityConfigEvidenceRef`, config issue refs | config loader safe digest/marker | 不保存 raw env/full config/secret;config 不改变 domain invariant | Step 14 config;Step 15 evidence/log;Step 16 config tests | runtime builder 需要 evidence 但 config digest/schema 未定义时暂停 |
| adapter availability refs | `IdentityAdapterRef`, `IdentityAdapterModeRef`, availability issue | adapter catalog / validated config / health summary | endpoint URL 不等于 adapter identity;fake/controlled/disabled 不得伪造 success | Step 7 adapter;Step 14 config;Step 16 fake tests | entry/flow 依赖 adapter 状态但 mode/availability 未定义时暂停 |

#### 7.18.6 对象组字段来源审计表

| 对象组 | 关键字段族 | 字段来源 | 禁止事项 | 后续承接 |
|---|---|---|---|---|
| `GlobalMember` / anchor | `member_ref`, `source_ref`, `created_by_ref`, `created_at`, `anchor_state` | id generator/request-bound id、command source、actor context、clock、factory | 不保存 account/credential/runtime body;不释放/复用 member id | Step 7 repo/id/clock;Step 8 establish command;Step 10 anchor state |
| lifecycle | `state_kind`, `reason_ref`, `basis_ref`, `changed_by_ref`, `changed_at`, risk refs | command intent、reason source、governance basis summary、actor、clock、config/action risk | basis presence 不等于 valid;runtime/project state 不得推进 lifecycle | Step 7 basis resolver;Step 9 transition;Step 10 matrix;Step 12 missing/invalid basis |
| role capability | `source_refs`, `source_snapshot_ref`, `source_version_ref`, `safe_summary_ref`, `evidence_refs`, `summary_state` | method source resolver/event、id generator、safe summary/evidence markers | 不保存 role/capability definition body;source version 不等于 snapshot id/version | Step 7 resolver;Step 8 source event;Step 10 source state;Step 11 unique |
| career | `source_marker_ref`, `safe_summary_ref`, `append_reason_ref`, `duplicate source marker`, `record_state` | work event/resolver safe summary、reason source、existing source lookup | 不拥有 work/project truth;correction 不覆盖旧记录;duplicate 不等于 idempotency key | Step 7 work resolver/repo;Step 9 append flow;Step 11 unique;Step 13 duplicate |
| memory reference | `memory_ref`, `archive_ref`, `handoff_ref`, `source_summary`, `reference_state`, `reason_ref` | memory/archive resolver、handoff callback marker、reason source | 不保存 memory body/embedding/archive package/receipt body | Step 7 memory/archive resolver;Step 8 callback;Step 10 state;Step 14 handoff |
| trace/audit | `trace_subject_ref`, `audit_subject_ref`, `change_kind_ref`, `source_cursor_ref`, `actor_ref`, `read_material_marker` | subject mapper、accepted change kind、truth cursor assigner、actor/context, material builder | 不拼 subject;source cursor 不用 timestamp/version/key;不保存 raw log | Step 7 mapper;Step 9 accepted trace;Step 11 append-only;Step 15 audit |
| summary view / read surface | `view_ref`, `slice_refs`, `visibility_result_ref`, `read_material_marker`, `source_cursor_ref` | projection builder/index、query assembler、visibility resolver/policy、truth scan cursor | query 不拼 view ref、不触发 rebuild、不保存 forbidden body | Step 7 projection/read resolver;Step 8 query DTO;Step 9 query;Step 12 degraded |
| projection/reference/reconciliation | `projection_ref`, `reference_ref`, `source_version_ref`, `safe_summary_ref`, `maintenance_scope_ref`, `finding_refs` | projection catalog、external reference state、resolver, job scope expansion, report builder | reference 不补造 external truth;report finding 不等于 repair action | Step 7 reference/projection repo;Step 9 maintenance;Step 11 persistence |
| outbox/handoff | `outbox_subject_ref`, `payload_marker_ref`, `topic_key_ref`, `handoff_target_ref`, `safe_material_ref`, `receipt_ref` | subject mapper、payload builder、topic binding、target binding、handoff material builder、callback marker | publish/deliver 不阻塞 accepted;Published/Delivered 不伪造 downstream success | Step 7 publisher/handoff;Step 8 event/receipt;Step 9 propagation;Step 14 config |
| application helper | `operation_context_ref`, `request_digest`, `idempotency_key`, `stored_result_ref`, `effect_summary_ref`, `visibility_decision_ref` | entry factory、canonicalizer、metadata、stored result repository, accepted effect assembler, visibility policy | digest/key/cursor/version 不混用;stored result 不重跑 mutation | Step 7 result repo;Step 8 metadata;Step 9 flow;Step 13 replay |
| entry helper | `runtime_profile_ref`, `config_evidence_ref`, `adapter_mode_ref`, `route_ref`, `envelope_marker_ref`, `job_scope_marker_ref`, `dispatch_target_ref` | config loader, adapter catalog, route/binding/job catalog, entry factory, service catalog | 不保存 raw config/request/event/job body;entry 不直连 repo/adapter | Step 8 protocol;Step 9 dispatch;Step 14 config;Step 15 observability |

#### 7.18.7 禁止替代字段总表

| 不得替代的目标字段 | 常见错误替代 | 正式处理 |
|---|---|---|
| truth cursor | timestamp、optimistic version、idempotency key、trace id、outbox id | 等 Step 7/11 定义 accepted truth cursor 来源 |
| projection cursor | page cursor、timestamp、truth cursor 默认等同、job cursor | 等 Step 7/11 定义 projection/source scan cursor |
| job cursor | job_run_ref、timestamp、retry count、idempotency key | Step 8/9/14 定义 job input/output cursor |
| optimistic version | source version、digest、timestamp、cursor | Step 7 versioned read + Step 11 save |
| request digest | raw JSON 字符串、source digest、idempotency key | Step 8 canonical material + Step 13 digest |
| idempotency key | source marker、event id、cursor、stored result ref | Step 8 metadata/dedupe key + Step 13 rules |
| source ref | reference bundle key、actor ref、member ref | Step 7/8 明确 source/ref 字段用途 |
| view ref | route/member/scope string 拼接 | projection builder/index lookup |
| subject ref | `format!("member:...")`、source external ref、topic key | formal subject mapper |
| receipt ref | request sent、HTTP 2xx、adapter log success | formal receipt marker / callback schema |
| adapter availability | business accepted、published、delivered | adapter availability 只表达 readiness |
| config profile | domain invariant override、query write permission | config 只装配 runtime/adapter behavior |
| issue marker | raw stack trace、external error body、secret | safe issue marker / redacted diagnostic |

#### 7.18.8 实现暂停条件表

| 暂停条件 | 必须回写位置 | 不允许的绕法 |
|---|---|---|
| 需要保存对象但找不到 stable id/ref 来源 | Step 7 id generator / Step 8 request / Step 11 persistence | 在 service 里拼字符串或用 timestamp |
| 需要 trace/audit/outbox subject 但 mapper 无对应 typed ref | Step 7 subject mapper / Step 9 flow | `format!`、强转、复用另一个 subject |
| 需要 expected_version 但没有 versioned read/create source | Step 7 repository / Step 11 transaction | source version、timestamp、fake private version map |
| 需要 duplicate replay 但 stored result save/load 不闭合 | Step 7 result repo / Step 13 idempotency | duplicate 时重跑 mutation或重新查 truth 拼 response |
| query visibility 无 read subject 或 scope 来源 | Step 7 read resolver / Step 9 query flow | 从 route/member/source 字符串拆 scope |
| projection-backed query 无 stable view lookup | Step 7 projection index / Step 11 persistence | query 拼 view ref 或扫描 projection store |
| consumer sidecar save 同时涉及 source ref/reference ref 但用途未分离 | Step 7 repository / Step 9 consumer flow | 把 business source ref 当 reference bundle key |
| handoff delivered 无 receipt marker | Step 8 receipt / Step 9 callback / Step 14 adapter | 把 request sent / 2xx / job log 当 delivered |
| fake/controlled adapter 需要模拟成功但正式 receipt/result marker 未定义 | Step 7 fake equivalence / Step 14 config / Step 16 tests | fake 直接返回业务成功 |
| job partial/retryable failed 无 issue/report surface | Step 8 job report / Step 12 error / Step 14 retry | 静默 succeeded 或直接 full retry |
| config 需要影响业务 invariant | Step 14 config + 回退 Step 6/9/10 审计 | 在 config 中允许 query write、job repair core truth |
| public DTO 需要字段但 Step 6 字段来源不明 | Step 8 protocol + 回退 Step 6 字段表 | DTO 暴露实现内部字段或 raw body |

#### 7.18.9 6.8 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否新增对象 | 未新增 | 本批只做字段闭环审计 |
| 是否覆盖高复用字段 | 通过 | §7.18.2 覆盖 id/ref、actor、timestamp、channel、reason/source/basis、safe summary、material marker |
| 是否覆盖 cursor/version/key | 通过 | §7.18.3 明确 cursor/version/key/digest/source version 不可混用 |
| 是否覆盖 subject/scope/view | 通过 | §7.18.4 明确 mapper/lookup/resolver 来源和暂停条件 |
| 是否覆盖 external/source/receipt | 通过 | §7.18.5 明确 business source、reference bundle、safe summary、receipt/config/adapter 边界 |
| 是否覆盖对象组字段 | 通过 | §7.18.6 按 core truth、view/report、outbox/handoff、application helper、entry helper 分组 |
| 是否列出暂停条件 | 通过 | §7.18.8 明确实现不得绕过的条件 |
| 是否越过 Step 7~14 | 未越过 | 未定义 port trait、DTO schema、flow、DDL、idempotency矩阵、配置项 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.9` | 用户审核通过后进入状态闭环表 |

#### 7.18.10 6.8 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| id 来源 | `CareerRecordRef` 来自 id generator | 用 `member_ref + source_ref + timestamp` 拼 id |
| actor 字段 | `ActorRef` 来自 entry metadata | 用 `GlobalMemberRef` 代替 actor |
| timestamp | `changed_at` 只来自 clock | 用 `changed_at` 当 optimistic version |
| truth cursor | trace 使用 accepted truth cursor | 用 idempotency key 当 trace cursor |
| projection cursor | rebuild 使用 projection/source scan cursor | 用 query page cursor 当 freshness cursor |
| expected version | save 使用 repository versioned read | 用 source version 或 digest 当 expected_version |
| idempotency | duplicate 比较 key + digest | same key 不比 digest 直接 replay |
| source vs reference | business source ref 只作来源 marker | 把 source ref 当 reference bundle key |
| subject | subject 来自 mapper | service 拼 `member:<id>` |
| view ref | view ref 来自 projection index | query 拼 `summary:<member_id>` |
| visibility scope | scope 来自 request/view/resolver | 从 read subject 字符串拆 scope |
| evidence | evidence summary 只保存 body-free ref/digest | 保存 artifact/evidence body |
| receipt | delivered 必须有 receipt ref | HTTP 2xx 直接标 delivered |
| config | config 保存 evidence marker | config shell 保存 secret/raw env |
| fake | fake 返回 controlled marker | fake 伪造 published/delivered success |
| issue | issue 保存 safe issue ref | issue 保存 stack trace/external body/secret |

### 7.19 6.9 状态闭环表

本批不新增对象和状态 variant,只审计 `6.1`~`6.7` 已出现的状态族。目标是让 Step 10 状态矩阵有稳定输入:每个状态必须知道初始来源、允许变更 owner、终态语义、禁止迁移、后续承接 Step 和实现暂停条件。若后续 Step 9/10/12/13/14 需要新增状态、改变终态或允许跨 owner 迁移,必须回到本表或对应对象契约闭口,不得在 flow、adapter、fake runtime 或测试里临时扩展。

#### 7.19.1 6.9 状态闭环能力清单

| capability | 覆盖状态族 | 本批产物 | 不做什么 |
|---|---|---|---|
| truth 状态初始来源审计 | anchor、lifecycle、role/capability、career、memory | §7.19.2 | 不写完整迁移矩阵 |
| derived / reference / report 状态审计 | summary view、projection、reference、reconciliation report | §7.19.3 | 不定义 repository/job flow |
| propagation / handoff 状态审计 | outbox、handoff intent、publish/deliver result | §7.19.4 | 不定义 publisher/handoff adapter |
| application / entry 状态审计 | idempotency、stored result、visibility、job report、runtime assembly、adapter availability、entry validation/dispatch | §7.19.5 | 不定义 API/worker/job DTO |
| 状态禁止混用审计 | truth vs projection、published vs delivered、validation vs accepted、degraded vs failed | §7.19.6 | 不裁定 public error envelope |
| Step 10 启动输入 | 状态族、owner、终态、禁止迁移、暂停条件 | §7.19.7 | 不提前写 Step 10 matrix |

#### 7.19.2 Domain truth 状态闭环表

| 状态族 | 已定义状态 / disposition | 初始来源 | 允许变更 owner | 终态 / 准终态 | 禁止迁移 / 禁止解释 | Step 10 承接 | 实现暂停条件 |
|---|---|---|---|---|---|---|---|
| `IdentityAnchorState` | `Established`, `RetiredHeld`, `TombstoneHeld` | `GlobalMember.establish(...)` 或 lifecycle terminal hold factory | anchor domain method only;由 accepted command flow 调用 | `RetiredHeld` / `TombstoneHeld` 是 member ref 不复用 hold | 不得从 query、job、runtime health、ProjectMember state 推进;不得释放/复用 `GlobalMemberRef` | anchor hold matrix、terminal reason 必填规则 | terminal hold 需要 reason/source 但 Step 8/9 未给正式来源时暂停 |
| `GlobalLifecycleState` | `Available`, `Paused`, `Retired`, `Tombstoned` | establish 后的 lifecycle factory / lifecycle transition command | lifecycle domain method + `LifecycleTransitionPolicy` | `Tombstoned` 为强终态;`Retired` 是否可到 `Tombstoned` 留 Step 10 | 不得由 runtime disabled、project membership、role absence、memory stale 自动推进 | allowed transition matrix、高风险 action、terminal relation with anchor | action risk、basis summary、reason、actor 任一来源未闭合时暂停 |
| lifecycle high-risk precheck disposition | allowed / missing basis / invalid basis / unavailable basis | `HighRiskLifecycleGuard` 输入 | policy only;service 不自行判断 | 不是持久化 lifecycle state | 不得把 `GovernanceBasisRef` presence 解释为 valid;不得降级为 silent accepted | precheck outcome 到 Step 12 rejection/dependency mapping | `GovernanceBasisSummary` resolver schema 未闭合时暂停 |
| `RoleCapabilitySummaryStateKind` | usable / stale / pending source / unavailable / rejected material 等 Step 6 已列状态族 | role/capability source snapshot builder | role/capability summary domain method + source policy | rejected/forbidden material 不应生成 usable summary | 不得保存 definition body 后标 usable;source stale 不等于 local optimistic conflict | source state matrix、source/evidence missing branch | source/evidence/material marker 到 Step 8/9/12 未闭合时暂停 |
| `RoleCapabilitySourceSnapshot` source state | resolved / stale / pending / unavailable / invalid material | resolver/event safe summary | source snapshot factory/update method | invalid material 不得进入 usable summary | 不得用 source version、timestamp 或 digest 替代 source state | snapshot state transition、stale refresh path | versioned read/save 或 source event schema 未闭合时暂停 |
| `CareerRecordStateKind` | active / superseded by correction / source pending review / rejected surface marker 等 | append accepted factory or correction append | `CareerAppendPolicy` + career record append method | append-only:旧记录不删除;correction 只产生新记录 | 不得覆盖旧 record;duplicate/rejected/empty/not visible 不等于 record_state | append/correction/duplicate matrix | duplicate source marker、pending source 是否持久化未闭口时暂停 |
| `MemoryReferenceState` | `Linked`, `PendingVerification`, `Stale`, `Unavailable`, `Migrated`, `Archived`, `HandoffPending`, `HandoffFailed` | memory reference factory / source or callback update | `MemoryReferencePolicy` + memory reference domain method | `Archived` / `Migrated` 是 relation state,不等于 archive package delivered | 不得保存 memory body 后标 Linked;handoff callback 不得直接修 core truth without policy | memory source/callback state matrix | archive callback、receipt marker、pending verification 持久化规则未闭合时暂停 |

#### 7.19.3 Derived / reference / report 状态闭环表

| 状态族 | 已定义状态 / disposition | 初始来源 | 允许变更 owner | 终态 / 准终态 | 禁止迁移 / 禁止解释 | Step 10 / 11 承接 | 实现暂停条件 |
|---|---|---|---|---|---|---|---|
| `MemberSummaryView` freshness/read state | fresh / stale / degraded / partial / not visible / redacted 等 read surface | projection builder or query visibility decision | projection builder for freshness;visibility policy for read decision | not visible 不是 missing data;degraded 不是 failed mutation | query 不得触发 rebuild;stale visible 必须显式标记 | query state outcome、projection stale semantics | view lookup、read subject、visibility scope 任一未闭合时暂停 |
| `ProjectionState` | fresh / stale / pending rebuild / rebuilding / rebuilt / degraded / failed | projection catalog/builder and stale marker | projection maintenance job / projection builder only | failed/degraded 不修复 core truth | 不得由 query 写 projection state;不得用 truth cursor 当 projection cursor | rebuild/mark stale matrix、cursor semantics | source cursor、projection ref、affected target expansion 未闭合时暂停 |
| `ReferenceResolutionState` | resolved / stale / unavailable / unrecognized / pending reconciliation / refresh failed | resolver/event/reference refresh | reference resolver/consumer/job only | unrecognized 不得自动创建 local truth | business source ref 不等于 reference bundle key;不可跨 bundle 复用 expected_version | reference refresh matrix、versioned save | typed sidecar save 的 reference_ref / expected_version 来源未闭合时暂停 |
| `ReconciliationReport` state | completed / partial / failed / no findings / generated with findings | report assembly job | reconciliation report builder only | report 是 observation,不是 repair result | 不得让 report flow 修复 identity truth、external truth 或 projection truth | report-only state matrix | finding safe material、target expansion、partial semantics 未闭合时暂停 |
| maintenance issue/finding disposition | issue present / retryable issue / fatal issue / finding only | maintenance job / report builder | report builder only | finding 不等于 corrective action | 不得保存 raw diagnostic、external body、secret;不得把 issue 当 accepted change | Step 12 issue mapping、Step 15 observability | safe issue/finding public schema 未闭合时暂停 |

#### 7.19.4 Outbox / handoff 状态闭环表

| 状态族 | 已定义状态 / disposition | 初始来源 | 允许变更 owner | 终态 / 准终态 | 禁止迁移 / 禁止解释 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|---|---|
| `OutboxState` | `PendingPublish`, `Published`, `RetryableFailed`, `Failed`, `SkippedByPolicy` | accepted identity fact + outbox record factory | outbox publisher job / outbox policy | `Published` 只代表 outbound boundary 成功;`Failed` 为 publish terminal unless retry policy says otherwise | `Published` 不代表下游消费成功;HTTP 2xx 不等于 accepted truth | Step 9 publish flow;Step 10 outbox state;Step 14 topic binding | topic binding、payload marker、retryable issue 未闭合时暂停 |
| outbound visibility disposition | allowed / skipped by policy / redacted payload / forbidden body | `OutboundEventPolicy` | policy only | skipped 不改变 accepted truth | 不得因 outbox skip 回滚 truth;不得发布 forbidden body | Step 8 event payload;Step 12 skipped/rejected mapping | visibility summary、payload safe marker 未闭合时暂停 |
| `HandoffState` | `PendingHandoff`, `Delivered`, `RetryableFailed`, `Failed`, `Cancelled` | `TraceHandoffIntent` factory | handoff callback/job + `HandoffPolicy` | `Delivered` 必须有 formal `HandoffReceiptRef`;`Cancelled` 不等于 failed | request sent、adapter ok、job log success 不等于 delivered;fake 不得伪造 delivered | Step 9 handoff/callback;Step 14 adapter;Step 16 fake tests | receipt marker、target/scope binding、callback schema 未闭合时暂停 |
| handoff material disposition | safe / forbidden / target unavailable / scope denied | `HandoffPolicy` | policy only | forbidden material 不得进入 pending handoff | 不得保存 archive package、observability raw log、receipt body | Step 8 material DTO;Step 12 target/material errors | safe material marker 或 allowed target catalog 未闭合时暂停 |

#### 7.19.5 Application / entry 状态闭环表

| 状态族 | 已定义状态 / disposition | 初始来源 | 允许变更 owner | 终态 / 准终态 | 禁止迁移 / 禁止解释 | 后续承接 | 实现暂停条件 |
|---|---|---|---|---|---|---|---|
| `IdentityIdempotencyRecord` state | reserved / completed / rejected stored / failed without stored result / conflict 等状态族 | idempotency reserve from operation context + digest | idempotency repository via application flow | completed/rejected stored 必须有 stored result ref | 不得用 idempotency key 替代 truth cursor/job cursor;failed without stored 不得 replay accepted | Step 13 duplicate matrix;Step 11 result persistence | reserve context/channel、digest canonicalization、stored result save/load 未闭合时暂停 |
| `StoredIdentityOperationResult` surface state | accepted command / rejected command / consumer receipt / job report replay marker | result assembler after terminal public surface | stored result repository only | stored result 是 replay snapshot,不重跑 mutation | 不保存 raw public response body;不把 repository error 当 stored rejected | Step 8 result DTO;Step 13 replay | rejected/receipt/report replay surface 未闭合时暂停 |
| `IdentityVisibilityDecision` | visible / redacted / not visible / degraded / stale visible | visibility policy + resolver prepared context | query application service only | not visible 是 public denial;degraded 是 partial/unavailable read | 不得把 not visible 当 not found;不得用 degraded 写 truth | Step 9 query flow;Step 12 query surface | read subject、scope、actor/access summary 未闭合时暂停 |
| `IdentityJobRunReport` result kind | succeeded / partial / failed / retryable failed / skipped / no-op | job runner/report assembly | jobs application boundary only | failed/retryable failed 必须带 safe issue marker | job report 不等于 truth repair;job cursor 不等于 idempotency key | Step 9 job flow;Step 13 job replay;Step 14 retry | job cursor、scope expansion、issue schema 未闭合时暂停 |
| `IdentityRuntimeAssemblyState` | unassembled / assembling / assembled / degraded / failed | runtime builder/config validation | infra runtime builder only | assembled 只代表 wiring ready | assembled 不代表 adapter healthy、publisher delivered 或 truth accepted | Step 14 runtime config;Step 15 health | config evidence、adapter binding、startup failure surface 未闭合时暂停 |
| `IdentityAdapterAvailability` | available / degraded / unavailable / disabled | adapter catalog/config/health summary | infra adapter registry only | disabled 是 explicit mode,不是 success | fake/controlled/disabled 不得伪造 external success;endpoint URL 不等于 adapter ref | Step 7 adapter port;Step 14 binding;Step 16 fake tests | adapter mode/ref/availability issue 未闭合时暂停 |
| API entry validation state | valid / rejected before dispatch / degraded route context / unauthorized entry 等 | API entry context validator | API entry boundary only | pre-dispatch rejection 不等于 application rejected unless mapped | route validation 不得调用 repository;query route 不得 dispatch mutation | Step 8 API DTO;Step 12 handler surface | route catalog、request marker、actor metadata 未闭合时暂停 |
| worker entry validation state | accepted for dispatch / duplicate replay candidate / unrecognized binding / missing dedupe / retryable entry failure | worker entry validator | worker boundary only | unrecognized binding 不产生 business accepted | ack/retry/dead-letter 不等于 domain state;missing dedupe 不得 fallback payload hash | Step 8 event envelope;Step 13 consumer replay;Step 14 worker binding | dedupe key、binding catalog、ack/retry mapping 未闭合时暂停 |
| job entry validation state | valid / invalid scope / invalid cursor / duplicate replay candidate / skipped by config | job entry validator | job boundary only | skipped by config 不等于 succeeded job unless report says so | invalid cursor 不得 full scan fallback;job_run_ref 不替代 idempotency key | Step 8 job DTO;Step 13 replay;Step 14 config | job metadata、scope/cursor/idempotency schema 未闭合时暂停 |
| dispatch result state | dispatched / not dispatched / dispatch failed / target disabled | `IdentityEntryDispatchGuard` | entry dispatch layer only | dispatch success 不等于 application accepted | entry 不得绕过 application 直连 repo/publisher/handoff | Step 9 service target matrix;Step 16 handler tests | dispatch target catalog 未闭合时暂停 |

#### 7.19.6 状态禁止混用总表

| 禁止混用 | 正确口径 | 反例 |
|---|---|---|
| anchor hold vs lifecycle state | anchor hold 只保证 `GlobalMemberRef` 不复用;lifecycle state 表达成员业务可用性 | `RetiredHeld` 被当成 `Retired` lifecycle |
| terminal truth vs failed side effect | accepted truth 不因 outbox/handoff failed 回滚 | publish failed 后把 lifecycle 改回 Available |
| source pending vs accepted state | source pending/rejected 是 flow/query surface 或显式 pending state,不得 silent accepted | source unavailable 仍写 usable role summary |
| stale projection vs stale truth | projection stale 只影响 derived view freshness | projection stale 后修改 `GlobalMember` truth |
| reference unavailable vs local missing | reference state 描述外部 reference,不代表 local truth 不存在 | external unavailable 后删除 `MemoryReference` |
| Published vs Delivered | Published 是 outbound publish boundary,Delivered 是 handoff receipt boundary | publisher 2xx 后标 handoff Delivered |
| entry valid vs command accepted | entry validation 只到 dispatch 前 | API validation valid 后直接返回 accepted |
| dispatch success vs service success | dispatch success 只代表调用 application boundary | worker dispatch 成功后 ack business accepted |
| degraded vs failed | degraded 是可返回 partial/read/runtime surface;failed 是明确失败 surface | query partial data 被标 failed mutation |
| retryable failed vs failed | retryable failed 必须有 retry policy/issue marker | 所有 failed 都自动重试 |
| idempotency completed vs stored result present | completed/rejected stored 必须有 stored result ref | record completed 但 duplicate replay 查不到 result |
| job skipped vs succeeded | skipped/no-op 必须显式报告原因 | disabled job 被记录为 succeeded |

#### 7.19.7 Step 10 启动输入表

| Step 10 输入项 | 来自本批 | Step 10 必须回答 | 不得在 Step 10 才首次发明 |
|---|---|---|---|
| 状态族全集 | §7.19.2~§7.19.5 | 每个状态族的 variant、初始状态、允许迁移和禁止迁移 | 新 truth state variant、new public disposition |
| 状态 owner | 各表 `允许变更 owner` | 哪个 flow/domain method/job/callback 能改变状态 | adapter/fake 私有状态变更 |
| 终态和准终态 | 各表 `终态 / 准终态` | 终态是否允许补充 trace/audit/outbox/handoff side effect | 终态后重新 open without formal transition |
| side effect failure relation | outbox/handoff/application tables | side effect failed 是否影响 accepted truth | 失败回滚 accepted truth 或 silently ignore |
| query/read disposition | visibility/view tables | visible/redacted/not visible/degraded/stale visible 的 public mapping | not visible == not found, degraded == mutation failed |
| idempotency state relation | idempotency/stored result tables | reserve/completed/rejected stored/conflict/replay 的矩阵 | same key no digest compare, completed without stored result |
| job/runtime/entry state relation | job/runtime/entry tables | entry validation、dispatch、job report、runtime health 如何映射 public surface | dispatch valid == accepted, assembled == adapter success |

#### 7.19.8 实现暂停条件表

| 暂停条件 | 必须回到哪里闭口 | 不允许的实现替代 |
|---|---|---|
| Step 9 flow 想新增状态或跳过现有状态 | 回 Step 6.9 / Step 10 | 在 service enum 里私加 variant |
| Step 10 发现状态初始来源不明 | 回对应对象契约 / Step 6.9 | 用 default/zero state 或 adapter health 推断 |
| 状态迁移 owner 不是 domain method/policy/正式 job/callback | Step 9 / Step 10 | repository save 时自动改 state |
| terminal state 需要 reopen | Step 10 明确 reopen transition 和 reason | 直接覆盖 terminal state |
| side effect failed 要影响 accepted truth | Step 9 / Step 11 事务边界 | publish/handoff failed 后回滚 truth |
| query 需要写 stale/rebuild 状态 | Step 9 query / Step 11 projection | query path 触发 rebuild 或 mark fresh |
| duplicate replay 发现 completed 但无 stored result | Step 13 / Step 11 | 重跑 mutation 补 result |
| fake runtime 需要模拟 state change | Step 7 fake equivalence / Step 16 test cut | fake 使用私有状态或跳过 policy |
| adapter callback 缺 receipt/issue marker | Step 8 callback / Step 14 adapter binding | callback body raw 字符串直接推进 Delivered/Failed |
| job retry/partial/failure 状态缺 issue marker | Step 12 / Step 14 | silent retry 或标 succeeded |

#### 7.19.9 6.9 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否新增对象 | 未新增 | 本批只做状态闭环审计 |
| 是否新增状态 variant | 未新增 | 仅汇总 `6.1`~`6.7` 已定义状态族和 disposition |
| 是否覆盖 truth 状态 | 通过 | 覆盖 anchor、lifecycle、role/capability、career、memory |
| 是否覆盖 derived/reference/report 状态 | 通过 | 覆盖 summary view、projection、reference、reconciliation report |
| 是否覆盖 propagation/handoff 状态 | 通过 | 覆盖 outbox、outbound visibility、handoff state/material |
| 是否覆盖 application/entry 状态 | 通过 | 覆盖 idempotency、stored result、visibility、job、runtime、adapter、API/worker/job entry、dispatch |
| 是否列出禁止混用 | 通过 | §7.19.6 固定状态语义边界 |
| 是否列出 Step 10 输入 | 通过 | §7.19.7 固定 Step 10 不得首次发明的内容 |
| 是否越过 Step 10 | 未越过 | 未写完整迁移矩阵、错误映射或测试切口 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一批 | `6.10` | 用户审核通过后进入 Step 7 承接清单和启动红线 |

#### 7.19.10 6.9 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| anchor 与 lifecycle | `TombstoneHeld` 只表示 member ref 不复用 | 把 `TombstoneHeld` 当 lifecycle `Tombstoned` 自动迁移 |
| high-risk lifecycle | basis summary invalid 时拒绝或 pending | 只有 `GovernanceBasisRef` 就 accepted |
| role source | source unavailable 进入 pending/degraded/rejected surface | 写 usable summary |
| career correction | correction 追加新 record 并 supersede 旧 record | 覆盖旧 career record |
| memory handoff | handoff callback 通过 receipt marker 推进 handoff state | callback raw body 直接写 `Delivered` |
| projection | job 标 stale/rebuilt,query 只读取 | query miss 时 rebuild projection |
| reference | external unavailable 写 reference state | 删除 local identity truth |
| outbox | publish failed 只更新 outbox state | 回滚 accepted identity truth |
| handoff | delivered 必须有 `HandoffReceiptRef` | HTTP 2xx 标 delivered |
| idempotency | completed 必须有 stored result ref | completed 无 result 时重跑 mutation |
| visibility | not visible 与 not found 区分 | 隐藏数据返回 404 并绕过审计 |
| job | partial report 带 issue refs | partial 被静默标 succeeded |
| runtime | assembled 只代表 wiring 完成 | assembled 代表所有 adapter healthy |
| entry | dispatch success 不等于 accepted | API dispatch 成功直接返回 accepted |

### 7.20 6.10 Step 7 承接清单和启动红线

本批不新增对象、字段、状态、port trait 签名或 DTO schema,只把 `6.1`~`6.9` 的对象契约、字段闭环和状态闭环转换成 Step 7 的启动输入。Step 7 可以在这些清单基础上定义 trait / port / adapter contract,但不得在 Step 7 为了写 trait 而反向发明 Step 6 未定义的 truth object、state variant、field source、cursor 来源、subject key、view id 生成规则或 fake runtime 私有语义。

#### 7.20.1 6.10 承接能力清单

| capability | Step 7 必须承接 | 本批产物 | 不做什么 |
|---|---|---|---|
| core truth repository 启动清单 | member、lifecycle、role/capability、career、memory 的 versioned read/save/list 需求 | §7.20.2 | 不定义 trait 方法签名 |
| mapper / resolver 启动清单 | subject/read subject/scope/reference/source/evidence/basis/visibility mapper | §7.20.3 | 不给 resolver 返回 schema |
| projection / read / report 启动清单 | view lookup、projection state、reference state、reconciliation report、maintenance target expansion | §7.20.4 | 不写 query flow |
| outbox / handoff / adapter 启动清单 | outbox repo、publisher、handoff adapter、receipt/issue marker、topic/target binding | §7.20.5 | 不写 adapter implementation |
| application support 启动清单 | id/clock/cursor/idempotency/stored result/operation context/job report | §7.20.6 | 不写 transaction/idempotency matrix |
| fake equivalence 启动清单 | fake repo/resolver/publisher/handoff/projection/runtime 必须与正式 port 同语义 | §7.20.7 | 不允许 fake 私有补口 |
| Step 7 红线 | 不得补 object/state/field/source、不得拼 ref、不得绕过 Step 6 | §7.20.8 | 不替代 Step 7 文档 |

#### 7.20.2 Core truth repository 承接清单

| 对象 / 状态族 | Step 7 需要的读取面 / 保存面类别 | 必须承接的 Step 6 语义 | 禁止补口 | 若缺口出现 |
|---|---|---|---|---|
| `GlobalMember` / `IdentityAnchorState` | member ref 唯一读取、versioned save、reuse check、anchor hold save | member ref 不复用;anchor hold 不等于 lifecycle;query no-create | 用 account/runtime/ProjectMember id 查 member;save 时自动释放 ref | 回 Step 6/7 明确 id source 和 reuse read |
| `GlobalLifecycleState` | lifecycle truth versioned read/save、member lifecycle current read | lifecycle 只能由 command/policy 推进;high-risk 要 basis summary | 用 runtime disabled/project state 推 lifecycle;repository 自动迁移 | 回 Step 7/9/10 闭 transition source |
| `RoleCapabilitySummary` / snapshot | summary by member read、source snapshot read/save、versioned save、source duplicate/read | safe summary body-free;source/evidence/material marker 不保存 body | resolver 无 summary 时 repo 私造 usable;source version 当 expected_version | 回 Step 7/8/11 闭 source summary/versioned read |
| `CareerRecord` | append-only save、list by member/source marker、duplicate source lookup、correction relation read | correction 追加新 record;duplicate source marker 不等于 idempotency key | update 覆盖旧 record;扫描 body 找 duplicate | 回 Step 7/11/13 闭 source unique/read |
| `MemoryReference` | relation by member/memory/archive/handoff read、versioned save、callback target lookup | relation body-free;handoff callback 不直接绕 policy 修 truth | 保存 memory body/embedding/package;callback raw body 推 Delivered | 回 Step 7/8/14 闭 callback target/receipt marker |

#### 7.20.3 Mapper / resolver 承接清单

| mapper / resolver 族 | Step 7 必须回答 | 来自 Step 6 | 禁止事项 | Step 7 启动红线 |
|---|---|---|---|---|
| trace/audit/outbox subject mapper | typed truth/ref 到 `IdentityTraceSubjectRef` / `IdentityAuditSubjectRef` / `IdentityOutboxSubjectRef` 是否同源同值 | §7.18.4, §7.19.6 | service 拼 `member:<id>`;trace subject 强转 audit/outbox subject | 每个 accepted truth 变更必须有正式 mapper |
| marker trace subject mapper | consumer/job/reference marker 到 marker subject 的映射 | §7.18.4 | event id、source string、adapter ref 拼 subject | consumer/job trace 若需要 marker subject,必须有 formal helper |
| read subject / visibility resolver | query request/view/report 到 `IdentityReadSubjectRef` + scope/access summary | §7.18.4, §7.19.5 | 从 route/member/source 字符串拆 scope;not visible 当 not found | 每条 query flow 进入 Step 9 前必须能定位 read subject 和 scope 来源 |
| governance basis resolver | `GovernanceBasisRef` 到 `GovernanceBasisSummary` | §7.18.2, §7.19.2 | basis presence == valid;字符串解析 action suitability | high-risk lifecycle guard 不能只有 opaque ref |
| role/capability source resolver | source/evidence/safe summary/source version/material state | §7.18.5, §7.19.2 | 保存 definition/method/evidence body;source version 当 optimistic version | Step 7 必须区分 source version、safe summary、expected_version |
| work/career source resolver | work participation safe summary、source marker、duplicate source key | §7.18.6, §7.19.2 | 拥有 Project/Work/ProjectMember truth;idempotency key 当 duplicate source | career append 进入 Step 9 前必须有 source summary 来源 |
| memory/archive resolver | memory/archive safe summary、handoff callback target、archive/handoff marker | §7.18.5, §7.19.2 | 保存 memory body、archive package、receipt body | callback 与 handoff state 需要 formal receipt/issue marker |
| external reference resolver | `ExternalReferenceRef` bundle、owner mapper、safe summary、source version | §7.18.5, §7.19.3 | business source ref 当 bundle key;跨 bundle 复用 expected_version | typed sidecar save 必须有 reference_ref + version 来源 |
| adapter availability resolver | adapter ref/mode/availability issue | §7.18.5, §7.19.5 | endpoint URL 当 adapter identity;fake/disabled 伪造 success | Step 7 adapter contract 必须表达 available/degraded/unavailable/disabled |

#### 7.20.4 Projection / read / report 承接清单

| 读侧 / 维护对象 | Step 7 需要的 port 类别 | 必须承接的 Step 6 语义 | 禁止补口 | 若缺口出现 |
|---|---|---|---|---|
| `MemberSummaryView` | stable view lookup、get view、list/index by member/scope | view ref 来自 projection builder/index;query 不拼 view ref | query 扫 store 或拼 `summary:<member>` | 回 Step 7/11 定义 lookup 或 builder |
| `ProjectionState` | projection state read/save、mark stale、rebuild source scan、source cursor read | projection cursor 不等于 truth cursor/page cursor/key | query path mark fresh/rebuild | 回 Step 7/9/11 闭 cursor/source scan |
| `ReferenceResolutionState` | reference state versioned read/save、typed sidecar save/read | reference bundle key 与 business source ref 分离 | save typed sidecar 只靠 opaque source | 回 Step 7/11 闭 versioned read 和 bundle key |
| `ReconciliationReport` | report write/read/list、finding/issue safe material read | report-only,不修 truth;partial/failed 显式 | report job 自动 repair 或 silent succeeded | 回 Step 7/9/12 闭 report surface |
| maintenance target expansion | scope -> projection/reference/report targets | maintenance scope 不等于 full scan/config profile | job 私自全表扫描 | 回 Step 7/9/11 闭 expansion port |

#### 7.20.5 Outbox / handoff / adapter 承接清单

| 边界对象 | Step 7 需要的 port/adapter 类别 | 必须承接的 Step 6 语义 | 禁止补口 | 若缺口出现 |
|---|---|---|---|---|
| `IdentityOutboxRecord` | outbox save/read/list pending/update state | only accepted fact creates outbox;payload body-free;Published 不等于 consumed | publisher 成功回写 accepted truth;保存 event body | 回 Step 7/8/9/11 闭 outbox payload/state |
| topic binding | topic key resolver / publisher binding | topic key 是 boundary ref,不是 broker 字符串 | service 拼 topic name | 回 Step 7/14 闭 binding source |
| publish adapter | publish attempt/issue marker、retryable classification | failed 不回滚 truth;retryable 必须有 safe issue marker | adapter exception raw body 入仓 | 回 Step 8/12/14 闭 issue marker |
| `TraceHandoffIntent` | handoff intent repo、target/scope resolver、callback target lookup | handoff material body-free;target/scope 来自 binding/catalog | 保存 archive package/path/bucket/raw target | 回 Step 7/14 闭 target/scope binding |
| handoff adapter/callback | deliver attempt、receipt/issue marker、state update | Delivered 必须有 formal receipt ref;fake 不得伪造 delivered | HTTP 2xx/job log success 标 Delivered | 回 Step 8/9/14/16 闭 receipt/fake semantics |

#### 7.20.6 Application support 承接清单

| support 对象 / 字段 | Step 7 必须提供的能力类别 | 必须承接的 Step 6 语义 | 禁止补口 | 若缺口出现 |
|---|---|---|---|---|
| id generator | member/career/memory/trace/audit/outbox/handoff/report/job/result 等 typed id source | object local ref 不拼 timestamp/member/source | 用 idempotency key/source ref 当 object id | 回 Step 7 明确 id generator 分组 |
| clock | created/changed/appended/received/checked/started/finished timestamp | timestamp 不替代 cursor/version/key | 用 time 排序当 concurrency/cursor | 回 Step 7/11/13 闭 clock/cursor/version |
| truth cursor assigner | accepted truth cursor | trace/outbox/stale/stored result 同一 accepted cursor 来源 | 用 timestamp/version/idempotency key | 回 Step 7/9/11/13 闭 cursor assigner |
| idempotency repository | reserve with operation context/channel/key/digest、complete with stored result、conflict read | completed/rejected stored 必须有 stored result | reserve 不保存 channel;completed 无 result | 回 Step 7/13 闭 reserve/result symmetry |
| stored result repository | accepted/rejected/consumer receipt/job report stored result save/load | duplicate replay 不重跑 mutation | 缺 result 时重跑或拼 response | 回 Step 7/11/13 闭 stored surface |
| operation context factory | command/query/consumer/job/callback context metadata | channel 来自 entry factory,不是 operation string guess | service 私造 context channel | 回 Step 8/9 闭 entry metadata mapping |
| job report writer | job run report save/load/replay | partial/failed/retryable failed 带 safe issue marker | skipped/partial silent success | 回 Step 7/9/12/14 闭 report issue |
| entry dispatch target catalog | API/worker/job target 到 application service boundary | entry 只 dispatch application,不直连 repo/adapter | handler/worker/job 绕过 service | 回 Step 9/16 闭 target matrix |

#### 7.20.7 Fake equivalence 启动清单

| fake / test double | 必须等价的正式语义 | 不允许的 fake 行为 | Step 7 必须写明 |
|---|---|---|---|
| in-memory repository fake | versioned read/save、unique key、append-only、stored result symmetry | 私有 map 补 subject/view/ref/version 规则 | fake 与 durable 使用同一 port surface 和 same error semantics |
| resolver fake | safe summary、unavailable、invalid、stale、unrecognized、digest mismatch | opaque ref 自动 valid;body string 解析出 owner/scope | 每个 resolver output 的状态和 safe marker shape |
| subject mapper fake | typed ref -> subject refs | 拼字符串或让 trace/audit/outbox 隐式同值 | mapper 是否同值必须 formal |
| projection fake | stable view lookup、stale marker、cursor handling | query 临时拼 view ref;missing lookup 扫 store | lookup missing/degraded/rebuild 的等价行为 |
| publisher fake | publish attempt/issue marker、Published boundary | fake 直接标 downstream consumed | fake published 只代表 publish boundary |
| handoff fake | receipt/issue marker、Delivered boundary | fake 无 receipt 标 Delivered | fake delivered 必须有 formal receipt marker |
| idempotency/result fake | same key/digest replay、same key/different digest conflict、stored result missing handling | duplicate 时重跑 mutation | replay/ conflict / missing result 与正式 repo 一致 |
| runtime/config fake | adapter mode/availability/config evidence | fake/disabled 伪造 success 或绕过 config | fake mode、controlled mode、disabled mode 的差异 |

#### 7.20.8 Step 7 禁止补口红线

| 红线 | 禁止行为 | 正确处理 |
|---|---|---|
| 不补 Step 6 object | Step 7 为了 trait 新增 truth object/helper state | 回 Step 6 修对象契约或标待确认 |
| 不补 state variant | port error/adapter state 反向新增 domain state | 回 Step 6.9 / Step 10 闭口 |
| 不补 field source | trait 参数需要字段但 Step 6 未给正式来源 | 回 Step 6.8 或 Step 8/9 确认来源 |
| 不拼 typed ref/subject/view | 用字符串、时间、idempotency key、source ref 拼 subject/view/ref | 新增 formal mapper/lookup/id source 前先回设计 |
| 不复用 cursor/version/key | expected_version、truth cursor、projection cursor、job cursor、idempotency key 互换 | 按 §7.18.3 分别定义正式 port |
| 不让 fake 私有补口 | fake repo/resolver 用额外 map 支撑正式 port 没有的读取面 | 正式 port 先闭口,fake 只实现同一 surface |
| 不绕过 application | API/worker/job entry 直连 repo/publisher/handoff | Step 9 定义 application service target |
| 不把 adapter success 当业务状态 | endpoint 2xx/publish ok/deliver call ok 推进 truth/delivered | 通过 formal receipt/result marker 映射 |
| 不让 query 写状态 | query miss/stale 时 rebuild/mark fresh/write trace | query 只读;rebuild/refresh 走 job/command |
| 不修改正式 `03` | Step 7 前直接把草稿写入正式文档 | 等 Step 19 统一装配 |

#### 7.20.9 Step 6 交付摘要

| 交付项 | 状态 | 对 Step 7 的意义 |
|---|---|---|
| shared typed refs / markers | 已完成 | Step 7 port 参数和返回值只能引用这些已收敛类型或后续 Step 正式新增类型 |
| domain core truth/state/policy | 已完成 | repository/resolver 必须服务这些 truth,不得新增 identity-owned truth |
| consumption / trace / audit / visibility | 已完成 | subject mapper、read resolver、audit/trace repository 必须逐项闭合 |
| projection / reference / reconciliation | 已完成 | projection lookup、reference versioned read、maintenance expansion 必须有正式读取面 |
| outbox / handoff / propagation | 已完成 | publisher/handoff adapter 只能承接 body-free marker、receipt/issue marker 和状态边界 |
| application helper | 已完成 | idempotency、stored result、operation context、job report port 必须与 helper object 对称 |
| infra / entry object | 已完成 | Step 7/8/9/14 必须承接 route/binding/job/config/adapter marker,不得直连实现细节 |
| 字段闭环表 | 已完成 | Step 7 启动前必须逐项确认 id/ref/cursor/version/key/subject/view/source/receipt 来源 |
| 状态闭环表 | 已完成 | Step 10 可以基于本表写矩阵;Step 7 不得新增状态语义 |

#### 7.20.10 6.10 模块内停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否新增对象 | 未新增 | 本批只做 Step 7 承接清单和启动红线 |
| 是否新增 port trait 签名 | 未新增 | 只列能力类别,不定义方法签名 |
| 是否覆盖 core repository | 通过 | §7.20.2 覆盖 member/lifecycle/role/career/memory |
| 是否覆盖 mapper/resolver | 通过 | §7.20.3 覆盖 subject/read/basis/source/work/memory/reference/adapter |
| 是否覆盖 projection/read/report | 通过 | §7.20.4 覆盖 view lookup、projection、reference、report、maintenance expansion |
| 是否覆盖 outbox/handoff/adapter | 通过 | §7.20.5 覆盖 outbox、topic、publisher、handoff、callback |
| 是否覆盖 application support | 通过 | §7.20.6 覆盖 id/clock/cursor/idempotency/result/context/job/dispatch |
| 是否覆盖 fake equivalence | 通过 | §7.20.7 固定 fake 不得私有补口 |
| 是否列出红线 | 通过 | §7.20.8 固定 Step 7 不得反向发明 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | Step 7 | 用户审核通过后创建/进入 Step 7 |

#### 7.20.11 6.10 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| repository port | 定义 versioned read/save 支撑 expected_version | save 方法自己查 hidden map |
| subject mapper | mapper 从 typed truth ref 返回 trace/audit/outbox subject refs | service 拼 `member:<id>` |
| view lookup | Step 7 定义 stable lookup | query service 拼 view id |
| reference sidecar | typed sidecar save 带 bundle key/version 来源 | 用 business source ref 当 bundle key |
| idempotency | reserve 绑定 context/channel/key/digest | 只按 key reserve |
| stored result | accepted/rejected/receipt/report save/load 对称 | duplicate 时重跑 mutation |
| fake resolver | fake 返回 same safe summary state family | fake 默认所有 opaque ref valid |
| fake handoff | fake delivered 有 formal receipt marker | fake 直接设 Delivered |
| adapter availability | fake/controlled/endpoint/disabled 明确区分 | fake mode 伪造 external success |
| Step 7 scope | Step 7 只定义 port/adapter contract | Step 7 新增 domain state 或 DTO flow |

---

## 8. 复杂度判断 / 是否拆模块、协议族、接口或附录

Step 6 复杂度高,必须按 governance 粒度拆批次。当前 6.A~6.C 的单对象卡片粒度基本可继续沿用,但整个 Step 6 的闭环粒度不足:缺 shared type 细化、application helper、entry object、字段闭环表、状态闭环表和 Step 7 启动红线。

因此后续不直接进入 6.D。当前先执行 `6.1 shared type / id-ref / reason / marker / helper set 细化`,把已写 6.A~6.C 中引用但未展开的二级类型补到可落码粒度,再按 `6.2` 继续 domain core truth/state/policy。`6.1-a` 已收敛 foundation id/ref/time/channel,`6.1-b` 已收敛 reason/basis/risk,`6.1-c` 已收敛 role/capability source/evidence/material marker。`6.2-a~6.2-c` 已作为已写对象复核批次完成,结论是 6.A~6.C 不需要整体重写,但 `HighRiskLifecycleGuard` 的 basis summary 输入、source/evidence missing 分支和 lifecycle 完整矩阵必须在后续 Step 7/9/10/12 继续闭口。`6.2-d` 已完成身份生涯记录对象契约,补齐 career record/ref、work source marker、safe summary、append reason、source summary、material marker 和 append-only policy。`6.2-e` 已完成记忆引用关系对象契约,补齐 memory reference/ref、memory/archive/handoff marker、source summary、reference state、reason/material marker 和 body-free policy。`6.3` 已完成 consumption / trace / audit / visibility 对象契约,补齐 summary view/ref、trace/audit subject、accepted trace cursor、audit timeline、read surface 和 visibility policy。`6.4` 已完成 projection / reference / reconciliation 对象契约,补齐 projection state/ref/cursor marker、reference resolution state、maintenance target/issue/finding marker、report-only policy 和 reconciliation report。`6.5` 已完成 outbox / handoff / propagation 对象契约,补齐 outbox record/state、handoff intent/state、payload/receipt marker、publish not acceptance gate 和 fake delivered guard。`6.6` 已完成 application helper objects,补齐 operation context、request digest、idempotency record、stored result、command effect summary、visibility decision 和 job run report assembly。`6.7` 已完成 infra / api / worker / jobs entry objects,补齐 runtime config shell、runtime assembly state、adapter availability、API/worker/job entry context、entry validation/result 和 dispatch guard。`6.8` 已完成字段闭环表,补齐高复用字段来源、cursor/version/key 防混用、subject/scope/view lookup、external source/reference/receipt 边界、对象组字段和实现暂停条件。`6.9` 已完成状态闭环表,补齐 truth、derived/reference/report、outbox/handoff、application/entry 状态族的初始来源、变更 owner、终态、禁止混用、Step 10 输入和实现暂停条件。`6.10` 已完成 Step 7 承接清单和启动红线,把对象/字段/状态闭环转成 core repository、mapper/resolver、projection/read/report、outbox/handoff/adapter、application support 和 fake equivalence 启动 checklist。Step 6 已达到进入 Step 7 的粒度,等待用户审核。

后续建议:

- `6.1` 已拆成 `6.1-a` foundation id/ref/time/channel、`6.1-b` reason/basis/risk、`6.1-c` role/capability source/evidence/material marker 三个子批。
- `6.2` 按业务 core 分成 6.2-a~6.2-e;已写 6.A~6.C 对应 6.2-a~6.2-c 的正文输入,当前复核已完成;`6.2-d` / `6.2-e` 已写入。
- `6.3` 已完成 consumption / trace / audit / visibility,按 view / trace / audit / visibility policy 子批粒度写入,未提前写 projection rebuild 或 outbox/handoff。
- `6.4` 已完成 projection / reference / reconciliation,按 projection state、reference resolution state、report-only policy、reconciliation report 子批粒度写入,未提前写 repository trait、job DTO、DDL 或 transaction order。
- `6.5` 已完成 outbox / handoff / propagation,按 outbox record/state、handoff intent/state、event guard、handoff guard 写入,未提前写 publisher port、topic schema、adapter implementation、retry schedule 或 delivery transaction。
- `6.6` 已完成 application helper objects,按 operation context、request digest、idempotency record、stored result、command effect summary、visibility decision、job run report 写入,未提前写 port trait、协议 DTO、service flow、repository transaction 或 infra runtime。
- `6.7` 已完成 infra / api / worker / jobs entry objects,按 runtime config shell、assembly state、adapter availability、API/worker/job entry context、validation/result、dispatch guard 写入,未提前写 Step 7 port trait、Step 8 public protocol DTO、Step 9 flow、Step 11 transaction 或 Step 14 config loader。
- `6.8` 已完成字段闭环表,覆盖高复用字段、cursor/version/key、subject/scope/view lookup、external reference/source/receipt、对象组字段、禁止替代字段和实现暂停条件,未新增对象、port、DTO、flow、DDL 或 config schema。
- `6.9` 已完成状态闭环表,覆盖 truth、derived/reference/report、outbox/handoff、application/entry 状态族,并固定状态初始来源、变更 owner、终态/准终态、禁止混用、Step 10 输入和实现暂停条件,未新增状态 variant、flow、错误映射或测试切口。
- `6.10` 已完成 Step 7 承接清单和启动红线,覆盖 core truth repository、mapper/resolver、projection/read/report、outbox/handoff/adapter、application support、fake equivalence 和禁止补口红线,未定义 port 方法签名、DTO schema、flow 或 DDL。
- 每批完成后先更新本文件对应状态和停审记录,再等待用户确认。

---

## 9. 回填草稿

正式 `03-详细设计.md` §6 后续应从已审核的 6.0~6.I 装配。当前 6.0、6.1-a、6.1-b、6.1-c、6.A、6.B、6.C、6.2-a~6.2-c 复核、6.2-d、6.2-e、6.3、6.4、6.5、6.6、6.7、6.8、6.9 和 6.10 可回填为:

```text
Step 6 对象契约采用分批写入。全局只预先收敛跨模块共享的 typed ref、boundary ref、public marker、cursor/version marker 和 operation vocabulary。具体 truth object、state enum、policy、view、trace、audit、report、outbox 和 handoff 对象必须回到所属业务组成部分中,按 capability -> object -> field / factory / function / state / invariant 的链路展开。

shared type 细化先按 foundation 批次收敛 IdentityTimestamp、IdentityOperationChannel、GlobalMemberId/Ref、IdentitySourceRef、RoleCapabilitySummaryId/Ref 和 RoleCapabilitySourceSnapshotId/Ref。所有 ID/ref 均为 opaque typed wrapper,不得由实现解析字符串前缀或临时拼接;IdentityTimestamp 只来自 clock port,不得替代 truth cursor 或 optimistic version;IdentityOperationChannel 只表达入口性质,不得替代权限、visibility 或治理 basis。

reason/basis/risk 批次收敛 IdentityAnchorReasonRef、LifecycleReasonRef、LifecycleRiskRef、GovernanceBasisRef 和 GovernanceBasisSummary。anchor/lifecycle reason 只保存 reason kind 与 body-free source ref,不保存原因正文或 audit note。LifecycleRiskRef 只表达动作风险分类,不替代权限或 basis。GovernanceBasisRef 只保存 governance-owned basis 的类别和 opaque ref;basis 是否 valid / stale / unavailable / invalid for action 由 GovernanceBasisSummary 承载为 resolver safe summary,读取面和错误映射留给 Step 7 / Step 12。

role/capability source/evidence/material marker 批次收敛 RoleCapabilitySourceKind、RoleCapabilitySourceRef、RoleSourceRef、CapabilitySourceRef、RoleCapabilitySourceVersionRef、CapabilityEvidenceRef、RoleCapabilitySafeSummaryRef、RoleCapabilityChangeReasonRef 和 RoleCapabilityChangeMaterialMarker。role/capability source 必须显式携带 source kind 和 method-library owned body-free source ref,不得从 external ref 字符串推断。source version 只作为来源版本 marker,不得替代 snapshot id、truth cursor 或 optimistic version。evidence 与 safe summary 只保存 typed marker,不保存 artifact/body。change material marker 必须能区分 safe marker 与 forbidden definition body、method body、evidence body 和 automatic scoring material,后者必须在 Step 8/12 映射为 rejected。

身份锚定与成员真相批次定义 GlobalMember、IdentityAnchorState 和 IdentityAnchorPolicy。GlobalMember 是平台级成员身份 truth 主语,只保存稳定 GlobalMemberRef、anchor_state、body-free source_ref、created_by_ref 和 created_at。IdentityAnchorState 只表达 Established、RetiredHeld、TombstoneHeld 三类不可复用 anchor 状态,不替代 lifecycle。IdentityAnchorPolicy 只消费已加载输入和 operation channel,负责建档 guard、ref reuse guard、query no-create 和账号 / credential / runtime / ProjectMember 排除,不读取 repository、不生成 id、不调用外部 adapter。

全局生命周期批次定义 GlobalLifecycleState、LifecycleTransitionPolicy 和 HighRiskLifecycleGuard。GlobalLifecycleState 表达成员平台级 Available、Paused、Retired、Tombstoned 生命周期状态,保存 reason_ref、changed_by_ref、changed_at 和 optional GovernanceBasisRef,但不表达 runtime、ProjectMember 或 governance truth。LifecycleTransitionPolicy 校验 lifecycle write 必须来自显式 command、actor、reason 和合法迁移。HighRiskLifecycleGuard 对高风险处置要求 body-free GovernanceBasisRef,缺 basis 或 basis 不匹配不得 accepted。

角色能力摘要批次定义 RoleCapabilitySummary、RoleCapabilitySourceSnapshot 和 RoleCapabilitySourcePolicy。RoleCapabilitySummary 只保存成员 role / capability 的 body-free source refs、evidence refs、safe summary marker、source snapshot ref 和 summary state。RoleCapabilitySourceSnapshot 将 source ref、version、source state、safe summary marker 和 evidence refs 绑定在同一 snapshot 中,不另建 source state truth。RoleCapabilitySourcePolicy 校验来源 / 证据闭合、source usable、forbidden body 和 automatic scoring 排除;RoleDefinition、CapabilityDefinition、method body、evidence body 和 ProjectMember role assignment 均不进入 identity truth。

domain core 已写对象复核批次确认 6.A、6.B、6.C 的对象边界无需整体重写,但必须按 shared type 细化结果解释字段来源。IdentityAnchorState.reason_ref 字段保留 Option 以承接 Established,terminal hold factory 仍要求 reason ref。RoleCapabilitySafeSummaryRef 和 RoleCapabilityChangeMaterialMarker 已在 Step 6 固定为 body-free ref / marker kind family,Step 8 只做 public DTO/event 映射。HighRiskLifecycleGuard 的 basis 匹配不能只依赖 GovernanceBasisRef 是否存在,后续 Step 7/9 必须把 GovernanceBasisSummary 作为正式 resolver summary 输入。

身份生涯记录批次定义 CareerRecord、CareerRecordStateKind 和 CareerAppendPolicy,并补齐 CareerRecordRef、ProjectParticipationRef、WorkSourceRef、CareerSourceMarkerRef、CareerSafeSummaryRef、CareerAppendReasonRef、WorkParticipationSourceSummary、CareerRecordChangeIntent 和 CareerAppendMaterialMarker。CareerRecord 是 identity-owned append-only history,保存 member ref、work participation source marker、duplicate source marker、safe summary marker、append reason、actor、append time 和 record state,但不拥有 Project、WorkItem、ProjectMember truth。Correction 必须通过追加新的 CorrectionAppended record 表达,旧记录最多以 SupersededByCorrection 解释性标记,不得覆盖或删除。Duplicate source、rejected append、empty、not visible 是 command / query / consumer surface,不是 CareerRecord.record_state。CareerAppendPolicy 只消费 loaded member、work source safe summary、existing source records、operation channel、change intent 和 material marker,负责 member exists、source trusted、not duplicate、append-only、forbidden body 和 write channel guard,不读取 repository、不调用 work resolver、不生成 id、不写 trace/outbox。

记忆引用关系批次定义 MemoryReference、MemoryReferenceState 和 MemoryReferencePolicy,并补齐 MemoryReferenceRef、MemoryRef、ArchiveRef、ArchiveHandoffRef、MemoryReferenceSourceRef、MemorySafeSummaryRef、MemoryReferenceReasonRef、MemoryReferenceSourceSummary、MemoryReferenceChangeIntent 和 MemoryReferenceChangeMaterialMarker。MemoryReference 是 identity-owned reference relation,保存 member ref、memory/archive/handoff refs、source marker、safe summary marker、reference state、reason、actor 和 changed time,但不保存 memory body、embedding、index、archive package、artifact body、conversation body、receipt body 或 external carrier truth。MemoryReferenceState 表达 Linked、PendingVerification、Stale、Unavailable、Migrated、Archived、HandoffPending、HandoffFailed,但不等于后续 6.5 的 trace / handoff delivery state。MemoryReferencePolicy 只消费 loaded member、body-free source summary、reason、operation channel、change intent 和 material marker,负责 member exists、reference present、source trusted、body-free、handoff marker、external-owner write 和 write channel guard,不读取 repository、不调用 memory/archive resolver、不执行 handoff。

身份事实消费与追溯批次定义 MemberSummaryView、IdentityTraceRecord、AuditTrail 和 VisibilityPolicy,并补齐 MemberSummaryViewRef、MemberSummarySliceRef、IdentityTraceRecordRef、IdentityTraceSubjectRef、IdentityAuditSubjectRef、IdentityChangeKindRef、IdentityChangeReasonRef、AuditTrailRef、AuditScopeRef、AuditCursorRef、ConsumerRef、VisibilityContextRef、VisibilityScopeRef、VisibilityResultRef、IdentityVisibilityAccessSummary、IdentityReadSurfaceKind 和 IdentityReadMaterialMarker。MemberSummaryView 是 body-free read model,只聚合 anchor、lifecycle、role/capability、career 和 memory safe summary slice refs,并携带 visibility result、read surface、optional source cursor 与 optional `projection_freshness_ref`;view ref 必须来自正式 projection builder / lookup,不得由 query 拼接。`ReadMemberSummaryFlow` 的 stale marker 只能复制 loaded `MemberSummaryView.projection_freshness_ref`;loaded stale/degraded view 缺少该 marker 时必须用 Step 7 `member_summary_view_missing_freshness(...)` 转为 degraded material surface,不得读取 projection state 或从 view ref 反推 projection ref。IdentityTraceRecord 是 accepted change 的 append-only trace material,必须绑定 member、trace/audit subject、change kind、source cursor、actor/time 和 safe markers;source cursor 不得用 timestamp、version 或 idempotency key 替代。AuditTrail 只组织 trace refs 和 redacted entries,不保存 raw log 或修复缺失 trace。VisibilityPolicy 只消费已解析 IdentityVisibilityAccessSummary 和 read material marker,负责 summary/trace/audit 的 visible、redacted、not visible、degraded 和 forbidden body guard;redaction public marker 来自 access summary 或同次 redaction matrix result,不得由 redaction profile/result/scope 推导;不调用授权系统、不读取 repository、不写 truth。

派生维护与对账批次定义 ProjectionState、ReferenceResolutionState、ReconciliationPolicy 和 ReconciliationReport,并补齐 ProjectionStateRef、IdentityProjectionRef、IdentityProjectionCursorRef、ProjectionFreshnessMarkerRef、ExternalReferenceRef、ReferenceResolutionStateRef、IdentityReferenceOwnerRef、ExternalSourceVersionRef、ExternalReferenceSafeSummaryRef、MaintenanceScopeRef、IdentityMaintenanceTargetRef、MaintenanceIssueRef、IdentityMaintenanceIntent、ReconciliationFindingIntentRef、ReconciliationFindingMaterial、ReconciliationReportRef 和 ReconciliationFindingRef。ProjectionState 只表达 identity-owned projection / derived view 与 source cursor 的 freshness、stale、pending、rebuilt、degraded 和 failed 状态,不保存 projection body,不修复 core truth,query 不得触发 rebuild。ReferenceResolutionState 只表达外部 reference 的 resolved、stale、unavailable、unrecognized、pending reconciliation 和 refresh failed 状态,并绑定 local owner、external version 和 safe summary marker,不保存外部正文、不补造 accepted truth。ReconciliationPolicy 保证 maintenance 只能 report-only,拒绝 identity truth repair、external truth repair、query path refresh 和 forbidden finding material。ReconciliationReport 保存 scope、target refs、finding refs、issue refs、report state 和 generated metadata,`Partial` / `Failed` 必须显式暴露,finding 不等于 repair action。

身份事实传播与外部交接批次定义 IdentityOutboxRecord、OutboxState、OutboundEventPolicy、TraceHandoffIntent、HandoffState 和 HandoffPolicy,并补齐 IdentityOutboxRecordRef、IdentityOutboxSubjectRef、IdentityOutboxPayloadMarkerRef、TopicKeyRef、OutboxDeliveryAttemptRef、OutboxDeliveryIssueRef、TraceHandoffIntentRef、HandoffTargetRef、HandoffScopeRef、TraceHandoffSafeMaterialRef、HandoffAttemptRef、HandoffReceiptRef 和 HandoffIssueRef。IdentityOutboxRecord 只能从 accepted identity fact 和正式 trace 创建,保存 body-free payload marker、topic boundary 和 outbox state,不得保存 event body、publisher adapter detail 或下游 receipt。OutboxState 表达 PendingPublish、Published、RetryableFailed、Failed 和 SkippedByPolicy,其中 Published 只代表 outbound boundary 成功,不代表下游业务已消费。OutboundEventPolicy 固定 accepted-only、body-free、visibility、topic boundary 和 publish not acceptance gate。TraceHandoffIntent 必须绑定非空 trace refs、optional audit trail、target/scope boundary refs、safe material marker 和 handoff state,不得保存 archive package、observability raw log 或 receipt body。HandoffState 表达 PendingHandoff、Delivered、RetryableFailed、Failed 和 Cancelled,其中 Delivered 必须来自 formal HandoffReceiptRef。HandoffPolicy 固定 target/scope、trace refs、safe material、visibility、receipt marker 和 fake delivered guard。

application helper 批次定义 IdentityOperationContext、IdentityRequestDigest、IdentityIdempotencyRecord、StoredIdentityOperationResult、IdentityCommandEffectSummary、IdentityVisibilityDecision 和 IdentityJobRunReport,并补齐 IdentityOperationContextRef、IdentityOperationName、IdentityIdempotencyKey、IdentityCanonicalRequestMarkerRef、IdentityRequestDigestValue、IdentityIdempotencyRecordRef、IdentityStoredResultRef、IdentityCommandEffectSummaryRef、IdentityVisibilityDecisionRef、IdentityJobRunRef 和 IdentityJobReportRef。IdentityOperationContext 统一 command/query/consumer/job/handoff callback 的 operation metadata,但不做权限、不读取 repository、不保存 raw body。IdentityRequestDigest 只绑定 canonical material marker、digest value、schema version 和 algorithm marker,不得用 timestamp、version、idempotency key 或 raw JSON 替代。IdentityIdempotencyRecord 保存 operation name、channel、key、digest、state 和 optional stored result ref,Completed / RejectedStored 必须有 stored result。StoredIdentityOperationResult 是 duplicate replay snapshot,只保存 accepted/rejected/receipt/report surface marker,不重跑 mutation、不保存 public response body。IdentityCommandEffectSummary 汇总 accepted truth、cursor、trace、audit、outbox、stale projection 和 stored result refs,但不生成 cursor、不定义 transaction order。IdentityVisibilityDecision 表达 visible、redacted、not visible、degraded、stale visible 等 query 裁决,scope 必须来自 request/view/resolver summary,不得从字符串推断。IdentityJobRunReport 汇总 job run、scope、cursor、affected refs、issue refs 和 result kind,Partial / Failed / RetryableFailed 必须显式带 safe issue marker。

infra / api / worker / jobs entry 批次定义 IdentityRuntimeConfigShell、IdentityRuntimeAssemblyState、IdentityAdapterAvailability、IdentityApiEntryContext、IdentityApiEntryValidation、IdentityApiDispatchResult、IdentityWorkerEntryContext、IdentityWorkerEntryValidation、IdentityWorkerDispatchResult、IdentityJobEntryContext、IdentityJobEntryValidation、IdentityJobDispatchResult 和 IdentityEntryDispatchGuard,并补齐 runtime profile/config evidence/config issue、runtime assembly、adapter ref/mode/availability issue、API route/request marker、worker envelope/binding marker、job metadata/scope marker、entry validation issue、dispatch target 等 entry marker。Runtime config shell 只保存 profile、safe evidence、adapter mode 和 binding marker,不得保存 secret/raw env/full config body,也不得通过配置放宽 domain invariant。Runtime assembly state 只表达 wiring lifecycle,Assembled 不代表下游 publish/deliver 成功。Adapter availability 区分 Available、Degraded、Unavailable、Disabled,disabled/fake/controlled 均不得伪造业务成功。API/worker/job entry context 只保存 body-free entry marker、actor/metadata/dedupe/scope/cursor 等入口元数据,不保存 request/event/job raw body。Entry validation / dispatch result 只表达 entry pre-dispatch 和 dispatch attempt,不等于 application accepted、consumer receipt 或 job report。Entry dispatch guard 固定所有入口只能 dispatch 到 application service target,不得直连 repository、publisher、handoff adapter、projection store 或 UoW。

字段闭环批次不新增对象,只审计 `6.1`~`6.7` 已出现字段族的正式来源和禁止替代。高复用字段表固定 id/ref、actor、timestamp、operation channel、reason/source/basis、safe summary 和 material marker 的来源。Cursor / version / key 表固定 truth cursor、projection cursor、job cursor、source version、optimistic version、idempotency key、request digest、source digest 和 stored result ref 不得互相替代。Subject / scope / view 表固定 trace/audit/outbox/read subject 必须来自 formal mapper,view/projection ref 必须来自 builder/index lookup,visibility scope 必须来自 request/view/resolver summary。External boundary 表固定 business source ref 不自动等于 reference bundle key,receipt 必须来自 formal marker,config evidence 与 adapter availability 不能保存 secret/raw body 或伪造成功。对象组字段审计把 core truth、history、view/report、outbox/handoff、application helper 和 entry helper 的字段来源与后续承接 Step 逐一列出。实现暂停条件明确:字段缺正式来源、mapper/lookup/versioned read/stored result/config/receipt 未闭合时,实现必须回设计闭口,不得临时拼接、复用 timestamp/version/key/cursor 或 fake 私有 map。

状态闭环批次不新增状态 variant,只审计 `6.1`~`6.7` 已出现状态族的初始来源、变更 owner、终态/准终态、禁止混用和 Step 10 承接输入。Domain truth 状态覆盖 IdentityAnchorState、GlobalLifecycleState、lifecycle high-risk precheck、RoleCapabilitySummaryStateKind、source snapshot state、CareerRecordStateKind 和 MemoryReferenceState,并固定 query/job/runtime/project/source 不得私自推进 truth state。Derived/reference/report 状态覆盖 MemberSummaryView freshness/read state、ProjectionState、ReferenceResolutionState、ReconciliationReport 和 maintenance issue/finding disposition,并固定 query 不 rebuild、reference unavailable 不删除 local truth、report 不等于 repair action。Propagation/handoff 状态覆盖 OutboxState、outbound visibility、HandoffState 和 handoff material disposition,并固定 Published 不等于 Delivered、side effect failure 不回滚 accepted truth、Delivered 必须有 formal receipt marker。Application/entry 状态覆盖 IdentityIdempotencyRecord、StoredIdentityOperationResult、IdentityVisibilityDecision、IdentityJobRunReport、IdentityRuntimeAssemblyState、IdentityAdapterAvailability、API/worker/job entry validation 和 dispatch result,并固定 entry valid / dispatch success 不等于 application accepted,assembled 不等于 adapter healthy,completed/rejected stored 必须有 stored result。实现暂停条件明确:flow 想新增状态、状态初始来源不明、terminal reopen、query 写 state、fake 私有 state、callback 缺 receipt/issue marker 或 duplicate replay 缺 stored result 时,必须回 Step 6.9 / Step 10 / Step 13 / Step 14 闭口。

Step 7 承接批次不新增实现契约,只把 Step 6 的对象、字段和状态闭环转换为 Trait / Port / Adapter 契约的启动清单。Step 7 必须覆盖 core truth repository、mapper/resolver、projection/read/report、outbox/handoff/adapter、application support 和 fake equivalence 六类 port/adapter 能力。Core repository 必须支撑 member、lifecycle、role/capability、career 和 memory 的 versioned read/save、append-only、duplicate source lookup 和 terminal hold 语义。Mapper/resolver 必须支撑 trace/audit/outbox subject、marker subject、read subject/scope、governance basis、role/capability source、work/career source、memory/archive、external reference 和 adapter availability 的正式来源。Projection/read/report 必须支撑 stable view lookup、projection state、reference versioned read、report-only writer 和 maintenance target expansion。Outbox/handoff/adapter 必须支撑 body-free payload、topic/target binding、publish attempt/issue、handoff receipt/issue 和 fake delivered guard。Application support 必须支撑 id generator、clock、truth cursor assigner、idempotency reserve/result、stored result、operation context、job report 和 dispatch target catalog。Fake equivalence 必须使用同一 formal port surface,不得用私有 map、字符串拼接、默认 valid、伪造 delivered/published 或重跑 mutation 补齐正式缺口。
```

当前不写入正式 `03-详细设计.md`。

---

## 10. 待确认事项

| 编号 | 待确认 | 影响 | 当前处理 |
|---|---|---|---|
| DDD-S6-OPEN-001 | `IdentityTimestamp` 最终是否直接复用 core 时间类型或 identity wrapper | 字段类型、clock port、serialization | Step 7 / 8 / 11 reality check 后闭口 |
| DDD-S6-OPEN-002 | `IdentityTruthCursor` 生成责任 | trace / outbox / projection stale / duplicate replay | Step 7 / 11 / 13 闭口,不得临时用 timestamp/version |
| DDD-S6-OPEN-003 | trace / audit / outbox subject mapper 是否同源复用 | trace、audit、outbox、handoff | Step 7 定义 mapper 和 canonical key |
| DDD-S6-OPEN-004 | role / capability safe summary 最小字段 | `RoleCapabilitySummary`, query view, outbound payload | 6.C / Step 8 闭口;不得保存 definition body |
| DDD-S6-OPEN-005 | memory / archive handoff receipt marker 最小字段 | `MemoryReferenceState`, `TraceHandoffIntent`, `HandoffState` | 6.5 已固定 receipt 只能是 marker 且 delivered 必须有 marker;最小 public schema 留 Step 8 / 14 |
| DDD-S6-OPEN-006 | `IdentityAnchorReasonRef` 是否必须在 `RetiredHeld` / `TombstoneHeld` 中必填 | anchor hold state、lifecycle terminal flow、persistence nullable 规则 | 6.B / Step 10 闭口;当前 6.A 使用 factory 必填、字段为 Option 以承接初始 `Established` |
| DDD-S6-OPEN-007 | `IdentitySourceRef` 的 source kind 如何识别 account / credential / runtime / ProjectMember 禁止来源 | create guard、source resolver、rejection error | Step 7 / 8 / 12 闭口;当前只定义 body-free marker 和禁止 owner |
| DDD-S6-OPEN-008 | high-risk lifecycle action 的正式集合 | `HighRiskLifecycleGuard`, Step 10 transition matrix, Step 12 missing basis surface | Step 10 / 14 闭口;当前只定义 guard 能力和 basis 必须存在规则 |
| DDD-S6-OPEN-009 | `GovernanceBasisRef` 的 valid / invalid / unavailable summary schema | basis resolver、high-risk lifecycle rejected / pending / dependency-unavailable surface | Step 7 / 8 / 12 闭口;当前只保存 body-free ref |
| DDD-S6-OPEN-010 | `Retired` 是否允许后续迁移到 `Tombstoned` | lifecycle terminal matrix、anchor hold 关系、测试切口 | Step 10 闭口;当前只标记为待矩阵确认 |
| DDD-S6-OPEN-011 | `RoleCapabilitySafeSummaryRef` 的最小 public schema | summary view、outbound payload、redaction、consumer compatibility | Step 8 / 12 闭口;当前 Step 6 只固定 body-free ref 和 source 绑定规则 |
| DDD-S6-OPEN-012 | `RoleCapabilityChangeMaterialMarker` 的 public DTO / event 映射 | forbidden body detection、automatic scoring rejection、DTO tests | Step 8 / 12 / 16 闭口;当前 Step 6 已固定 safe/forbidden material kind 族 |
| DDD-S6-OPEN-013 | source/evidence 缺失时是 rejected、pending source 还是 degraded read | command flow、source event flow、query surface、state matrix | Step 9 / 10 / 12 闭口;当前固定不得 silent accepted |
| DDD-S6-OPEN-014 | `HighRiskLifecycleGuard.assert_basis_matches_action(...)` 如何接收 `GovernanceBasisSummary` | high-risk lifecycle precheck、basis resolver、invalid/unavailable basis error surface | Step 7 / 9 闭口;不得从 `GovernanceBasisRef` presence、kind 或字符串推断 basis valid |
| DDD-S6-OPEN-015 | `WorkParticipationSourceSummary` 的正式 resolver / event mapper 来源 | `CareerRecord`, `CareerAppendPolicy`, work consumer, duplicate source lookup | Step 7 / 8 / 9 闭口;当前 Step 6 只固定 body-free summary shape,不定义 port 或 event schema |
| DDD-S6-OPEN-016 | `CareerRecord::SourcePendingReview` 是否持久化为 career record,还是仅作为 rejected / pending surface | career state matrix、pending review flow、query visibility | Step 9 / 10 / 12 闭口;当前只固定 pending source 不得 silent accepted |
| DDD-S6-OPEN-017 | career source marker unique key 与 idempotency key / stored result 的关系 | duplicate command/event replay、persistence unique constraint、consumer dedupe | Step 11 / 13 闭口;当前固定 source marker 不等于 idempotency key / cursor |
| DDD-S6-OPEN-018 | `MemoryReferenceSourceSummary` 的正式 resolver / event mapper / callback 来源 | `MemoryReference`, `MemoryReferencePolicy`, source state consumer, archive handoff result | Step 7 / 8 / 9 闭口;当前 Step 6 只固定 body-free summary shape |
| DDD-S6-OPEN-019 | `MemoryReferenceState::PendingVerification` 是否持久化为 relation state,还是仅作为 pending/rejected surface | memory state matrix、source pending flow、query visibility | Step 9 / 10 / 12 闭口;当前只固定 pending/unavailable 不得 silent accepted |
| DDD-S6-OPEN-020 | `ArchiveHandoffRef` 与 `TraceHandoffIntent` / `HandoffState` / receipt marker 的边界 | archive callback、handoff delivery、receipt body exclusion、config binding | 6.5 已固定 handoff marker 不等于 delivered receipt;callback DTO 和 config binding 留 Step 8 / 14 |
| DDD-S6-OPEN-021 | `MemberSummaryViewRef` 的正式 projection builder / lookup 来源 | summary query、projection fake、view ref 稳定性 | 已闭合:query 只能通过 Step 7 `find_member_summary_view_ref(member_ref, visibility_scope_ref)` 读取;Step 11 `member_summary_views` 按 `(member_ref, visibility_scope_ref)` current index 持久化;broader projection catalog 仍由 DDD-S6-OPEN-026 承接 |
| DDD-S6-OPEN-022 | `IdentityTraceSubjectRef` / `IdentityAuditSubjectRef` / `IdentityOutboxSubjectRef` 是否由同一个 subject mapper 同时返回 | trace、audit、outbox、handoff canonical subject | Step 7 mapper 闭口;当前固定不得字符串拼接或强转 |
| DDD-S6-OPEN-023 | `IdentityVisibilityAccessSummary` 的正式 resolver / prepared context 来源 | summary/trace/audit query、event/handoff visibility、redaction failure | Step 7 / Step 8 / Step 12 闭口;当前 Step 6 只固定 policy 输入 shape |
| DDD-S6-OPEN-024 | field-level redaction matrix 与 `IdentityReadSurfaceKind` 的 public DTO 映射 | query response、trace/audit redaction、not visible/degraded surface | PH-02 public marker shell 已由 Step 8 `IdentityVisibilityMarker` / `IdentityDegradedMarker` / `IdentityRedactionMarkerRef` / `IdentityDegradedMarkerRef` 闭合;剩余 field-level omission matrix 与 per-field DTO 裁剪规则留 Step 12 |
| DDD-S6-OPEN-025 | `IdentityProjectionCursorRef` 的正式来源及其与 `IdentityTruthCursor` 的关系 | projection stale、rebuild、duplicate replay、fake runtime 等价语义 | Step 7 / Step 11 / Step 13 闭口;当前固定不得用 page cursor/timestamp/version/idempotency key 替代 |
| DDD-S6-OPEN-026 | `IdentityProjectionRef` / `ProjectionStateRef` 的正式 builder / lookup / catalog 来源 | projection rebuild、projection state read、projection fake | Step 7 / Step 11 闭口;summary query stale marker 已由 `MemberSummaryView.projection_freshness_ref` 承载,缺失时通过 Step 7 `member_summary_view_missing_freshness(...)` 返回 degraded,不得由 query 拼接或反推 projection ref |
| DDD-S6-OPEN-027 | `MaintenanceScopeRef` 展开 affected projection/reference/report target 的正式规则 | rebuild / refresh / reconciliation job、partial report、stale marker | Step 7 / Step 9 / Step 11 闭口;当前 Step 6 不定义扩展算法 |
| DDD-S6-OPEN-028 | `ExternalReferenceRef` / `IdentityReferenceOwnerRef` 的正式 mapper 与 typed read 来源 | role/career/memory/lifecycle basis source refresh、reference state fake | Step 7 / Step 8 / Step 11 闭口;当前固定 external ref 与 local owner ref 不可混用 |
| DDD-S6-OPEN-029 | `ExternalReferenceSafeSummaryRef` 和 `ExternalSourceVersionRef` 的最小 public schema / versioned read 口径 | reference refresh、source changed consumer、optimistic save、degraded read | Step 7 / Step 8 / Step 11 / Step 12 闭口;当前只固定 body-free marker |
| DDD-S6-OPEN-030 | `MaintenanceIssueRef` / `ReconciliationFindingRef` 的最小 safe issue/finding schema | report query、observability、forbidden body negative tests | Step 8 / Step 12 / Step 16 闭口;当前固定 raw diagnostic/external body/secret 不入仓 |
| DDD-S6-OPEN-031 | `IdentityOutboxSubjectRef` 的正式 mapper 与 canonical key | trace/audit/outbox subject 同源、fake runtime、outbox lookup | Step 7 闭口;当前 6.5 固定不得使用 `IdentityOutboundSubjectRef` 或字符串拼接 |
| DDD-S6-OPEN-032 | `IdentityOutboxPayloadMarkerRef` 的最小 public schema 与 builder 来源 | outbound event DTO、redaction、duplicate replay、consumer compatibility | Step 8 / Step 12 / Step 16 闭口;当前只固定 body-free marker |
| DDD-S6-OPEN-033 | `TopicKeyRef` 的正式 binding 来源和 visibility 适配规则 | publisher route、topic config、skipped by policy、event tests | Step 7 / Step 14 闭口;当前不定义 broker/topic 字符串 |
| DDD-S6-OPEN-034 | `OutboxDeliveryAttemptRef` / `OutboxDeliveryIssueRef` 的来源和 retryable 判定 | publish flow、retry job、failed surface、observability | Step 8 / Step 9 / Step 12 / Step 14 闭口;当前只固定 attempt/issue 为 body-free marker |
| DDD-S6-OPEN-035 | `TraceHandoffSafeMaterialRef` 的最小 schema 与 material builder 来源 | prepare handoff、archive package exclusion、observability handoff | Step 8 / Step 12 / Step 16 闭口;当前只固定 safe refs only |
| DDD-S6-OPEN-036 | `HandoffTargetRef` / `HandoffScopeRef` 的正式 config binding 和 allowed target 规则 | prepare handoff、deliver handoff、target unavailable / invalid surface | Step 7 / Step 14 闭口;当前不解析外部 path / bucket / tenant |
| DDD-S6-OPEN-037 | `HandoffReceiptRef` / `HandoffAttemptRef` / `HandoffIssueRef` 的正式 result mapping | delivered、retryable failed、fake delivered negative tests | Step 8 / Step 9 / Step 12 闭口;当前固定 delivered 必须有 receipt marker |
| DDD-S6-OPEN-038 | outbox / handoff 状态更新与 accepted truth transaction 边界 | accepted command、publish job、handoff callback、retry job | Step 9 / Step 11 / Step 13 闭口;当前只固定失败不回滚 accepted truth |
| DDD-S6-OPEN-039 | `IdentityOperationContext` 的 entry factory 与 metadata 映射 | command/query/consumer/job/callback context、channel、actor、trace context | Step 6.7 / Step 8 / Step 9 闭口;当前只固定 context object shape |
| DDD-S6-OPEN-040 | `IdentityRequestDigest` 的 canonical material schema、hash algorithm 和 version 迁移 | duplicate replay、conflict detection、stored result compatibility | PH-02 digest shell 已统一为 Step 8 `IdentityProtocolSchemaVersionRef` + `IdentityDigestAlgorithmMarkerRef`;剩余 canonical material schema、具体算法绑定和迁移语义留 Step 13/14 |
| DDD-S6-OPEN-041 | mutation / consumer / job 的 idempotency key 必填范围和 missing key public surface | command accepted/rejected、consumer receipt、job report replay | Step 8 / Step 12 / Step 13 闭口;当前只固定 helper object,不裁定所有入口是否必填 |
| DDD-S6-OPEN-042 | `StoredIdentityOperationResult` 的具体 variant payload、save/load symmetry 和 rejected replay 范围 | duplicate replay、consumer receipt replay、job report replay | Step 7 / Step 8 / Step 11 / Step 13 闭口;当前只固定 surface marker 不保存 raw body |
| DDD-S6-OPEN-043 | `IdentityCommandEffectSummary.accepted_cursor_ref` 的正式来源和 transaction order | accepted command flow、trace/outbox/stale/stored result 一致性 | Step 7 / Step 9 / Step 11 / Step 13 闭口;当前固定不得用 timestamp/version/key 替代 |
| DDD-S6-OPEN-044 | `IdentityVisibilityDecision.visibility_scope_ref` 与 read subject 的正式映射 | query visibility、not visible、degraded、field redaction | Step 7 / Step 8 / Step 9 / Step 12 闭口;当前固定不得从 subject 字符串推断 |
| DDD-S6-OPEN-045 | `IdentityJobRunReport` 的 job cursor、stored report replay 和 retryable failed 规则 | operations job duplicate replay、partial report、retry/timeout config | Step 8 / Step 9 / Step 13 / Step 14 闭口;当前只固定 report assembly object |
| DDD-S6-OPEN-046 | `IdentityRuntimeConfigShell` 的正式配置 schema、profile matrix 和 evidence digest | runtime builder、adapter binding、config error、验收 evidence | Step 14 闭口;当前只固定 body-free config shell 和禁配红线 |
| DDD-S6-OPEN-047 | `IdentityRuntimeAssemblyState` 的 assembly lifecycle 与 degraded/failed 启动策略 | API/worker/job entry readiness、runtime observability | Step 14 / Step 15 闭口;当前只固定 state object |
| DDD-S6-OPEN-048 | `IdentityAdapterAvailability` 的 fake / controlled / endpoint / disabled 精确定义 | resolver/publisher/handoff/report writer 等 adapter 等价语义和测试 | Step 7 / Step 14 / Step 16 闭口;当前固定不得伪造业务成功 |
| DDD-S6-OPEN-049 | API route catalog、entry validation issue 与 public HTTP/result surface 的映射 | handler tests、public rejection/not visible/degraded response | Step 8 / Step 12 闭口;当前不定义 HTTP status 或 response envelope |
| DDD-S6-OPEN-050 | Worker consumer binding、ack/retry/dead-letter 与 duplicate replay 规则 | event consumer reliability、unrecognized binding、missing dedupe key | Step 8 / Step 12 / Step 13 / Step 14 闭口;当前只固定 entry validation surface |
| DDD-S6-OPEN-051 | Job entry scope/cursor/idempotency 的 protocol schema、retry/timeout/batch 规则 | job runner、report、partial/failed/retryable surface | Step 8 / Step 9 / Step 13 / Step 14 闭口;当前只固定 job entry object |
| DDD-S6-OPEN-052 | `IdentityEntryDispatchGuard` 的 dispatch target catalog 与 service target 匹配矩阵 | API query no-write、worker ownership、job report-only boundary | Step 9 / Step 16 闭口;当前固定不得绕过 application |
| DDD-S6-OPEN-053 | `6.8` 字段闭环表中的暂停条件如何转成 Step 7 port checklist | Step 7 port completeness、mapper/lookup/versioned read 启动红线 | Step 7 / 6.10 闭口;当前只固定字段级暂停条件 |
| DDD-S6-OPEN-054 | cursor/version/key 禁止替代规则如何落到 Step 13 幂等矩阵 | duplicate replay、stored result、version conflict、consumer/job replay | Step 13 闭口;当前只固定字段不可混用 |
| DDD-S6-OPEN-055 | subject/scope/view lookup 字段闭环如何映射到 query test cuts | query visibility、projection lookup、not visible/degraded surface | Step 9 / Step 16 闭口;当前只固定查询不得拼 ref/scope |
| DDD-S6-OPEN-056 | `6.9` 状态闭环表如何转成 Step 10 状态矩阵 | 所有 truth/derived/outbox/handoff/application/entry 状态迁移 | Step 10 闭口;当前只固定状态族、owner、终态和禁止混用 |
| DDD-S6-OPEN-057 | terminal / quasi-terminal state 是否允许 reopen 或补 side effect | lifecycle terminal、anchor hold、outbox failed、handoff failed、job failed | Step 10 / Step 12 闭口;当前只固定不能私自 reopen 或回滚 accepted truth |
| DDD-S6-OPEN-058 | entry validation / dispatch result / application accepted 的 public 映射 | API/worker/job handler tests、HTTP/result envelope、consumer ack/retry | Step 8 / Step 12 / Step 16 闭口;当前只固定三者不可混用 |
| DDD-S6-OPEN-059 | idempotency completed/rejected stored 与 stored result 缺失时的恢复策略 | duplicate replay、stored result repository、一致性恢复 | Step 13 / Step 12 闭口;当前只固定不得重跑 mutation 补 result |
| DDD-S6-OPEN-060 | `6.10` Step 7 启动清单如何拆成具体 trait/port 分组 | Step 7 文件结构、trait ownership、adapter boundary | Step 7 闭口;当前只固定能力类别和启动红线 |
| DDD-S6-OPEN-061 | fake equivalence 是否需要每个 port 单独列 fake 语义表 | fake runtime、targeted tests、durable adapter parity | Step 7 / Step 16 闭口;当前只固定 fake 不得私有补口 |
| DDD-S6-OPEN-062 | Step 7 是否需要单独的 mapper/resolver 汇总红线附录 | subject/read/scope/reference/source/evidence/basis/adapter mapper 完整性 | Step 7 闭口;当前只固定 mapper/resolver 必须覆盖的族 |
| DDD-S6-OPEN-063 | Step 7 port contract 是否需要直接标注 Step 8/9/10/11/13 承接编号 | 后续协议、flow、state、transaction、idempotency 可追溯性 | Step 7 / Step 17 闭口;当前只固定从 Step 6 到 Step 7 的承接 |

---

## 11. 进入下一批条件

进入 Step 7 前必须满足:

- 用户审核通过本次 `6.10 Step 7 承接清单和启动红线`。
- 保持正式 `03-详细设计.md` 不直接写入。
- Step 7 可以创建 `03_ddd_step_07_trait_port_adapter_contracts.md`,但不得提前创建 Step 8~19 文件。
- Step 7 必须按 port/adapter 族小循环写入并停审,不得一次性生成全局 trait 大表。
- Step 7 必须把本 Step 的 `6.8` 字段暂停条件和 `6.9` 状态暂停条件逐项映射为 port completeness / fake equivalence checklist。
- Step 7 不得新增 Step 6 未定义的 object、state、field source、cursor/source/version 规则、subject/view/ref 拼接规则或 fake 私有语义;若发现缺口,必须回 Step 6 或记录待确认事项。
- Step 7 必须重点审计 subject mapper、read resolver、projection lookup、reference versioned read、stored result、idempotency reserve、clock/id generator、adapter availability、handoff receipt 和 fake runtime 等必备读取面/保存面。
