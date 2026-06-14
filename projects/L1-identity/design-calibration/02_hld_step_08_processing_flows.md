# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-06-11
> 状态: Step 8 已完成,等待审核后进入 Step 9

---

## 1. Step 状态 + Step 内计划

本 Step 不沿用旧版一次性全量处理流。本轮先建立 Step 8 执行框架,再按 Step 5 的 8 个主要组成部分逐个展开关键 Command、Query、Inbound Event Consumer 和 Operations Job 的处理流。每批完成后停审,最后做跨处理流一致性审计。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 5 主要组成部分、Step 6 关键对象、Step 7 接口骨架和最新版 Step 8 SOP / 书写规范 | 已完成 | §2 |
| 回答 Step 8 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 8 一次性处理流的问题 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 建立处理流分类规则、ASCII 模板和选择规则 | 已完成 | §7.1~§7.3 |
| 建立 8-A~8-I 小循环计划 | 已完成 | §7.4 |
| 逐批补充“身份锚定与成员真相”处理流 | 已完成 | §12 |
| 逐批补充“全局生命周期”处理流 | 已完成 | §13 |
| 逐批补充“角色能力摘要”处理流 | 已完成 | §14 |
| 逐批补充“身份生涯记录”处理流 | 已完成 | §15 |
| 逐批补充“记忆引用关系”处理流 | 已完成 | §16 |
| 逐批补充“身份事实消费与追溯”处理流 | 已完成 | §17 |
| 逐批补充“派生维护与对账”处理流 | 已完成 | §18 |
| 逐批补充“身份事实传播与外部交接”处理流 | 已完成 | §19 |
| 完成跨处理流一致性审计 | 已完成 | §20 |
| 形成正式 `02` §8 回填草稿 | 已完成 | §20.9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供 8 个主要组成部分、capability 和边界 |
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供处理流可点名的关键对象、policy、state、projection、trace / outbox 主语 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成并已获用户认可 | 提供 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 Step 8 展开范围 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 query no-write、eventual propagation、report-only、forbidden body、visibility 等处理流门禁 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `FR-ID-001~014`、业务规则、VETO 和验收边界 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供同步 / 异步协作、后台维护、传播和依赖裁剪方向 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 8 必须按主要组成部分标注处理流归属和停审 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定 §8 处理流 ASCII 图、关键设计点和禁止下沉内容 |
| 旧 `02_hld_step_08_processing_flows.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox?

Command 写路径必须从 Step 7 的正式 Command 入口开始,经过 application service 编排,再进入 Step 6 已定义的 domain object / policy。accepted truth change 才允许产生 trace、outbox material、projection stale marker 或 stored result。publish、handoff delivery、projection rebuild 和 query fallback 不得被塞进 command accepted 前置。

当前必须独立展开的 Command:

| Command | 所属批次 | 处理流核心 |
|---|---|---|
| `EstablishGlobalMember` | 8-A | 建档、防复用、anchor policy、trace / outbox material |
| `UpdateGlobalLifecycleState` | 8-B | lifecycle transition、高风险 basis、trace / outbox、projection stale |
| `MaintainRoleCapabilitySummary` | 8-C | source / evidence guard、summary accepted、source snapshot state |
| `AppendCareerRecord` | 8-D | append-only、source marker dedup、correction append |
| `MaintainMemoryReference` | 8-E | body-free ref relation、memory reference state、handoff marker guard |
| `PrepareTraceHandoff` | 8-H | 创建 pending handoff intent,不执行交付,不改变业务 truth |

### 3.2 每个关键 Query 如何从入口读取 projection 或只读视图?

Query 只能读取 truth summary、projection、trace、audit、report、outbox state 或 handoff state。包含 visibility、redaction、fallback、stale、degraded 或 projection not ready 的 Query 必须有独立处理流;简单状态读取可以走通用读路径,但仍要在覆盖清单中说明原因。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录?

Inbound Event Consumer 必须从 event envelope / source event id / dedup key / source marker 开始。它只能消费外部已成立事实或 callback marker,更新本地 snapshot、reference state、append-only record、handoff state 或 report marker。它不得拥有外部 truth,不得把外部事件绕过本仓 policy 直接写成不受控核心 truth。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账?

Operations Job 必须从 job run metadata、scope、cursor、system actor 和幂等边界开始。它只能基于已持久化事实、projection state、reference state、outbox record、handoff intent 或 report marker 执行 rebuild、refresh、reconciliation、publish、deliver 或 retry。Job 不得作为业务 command,不得修复相邻仓 truth,不得在 publish / handoff 成功时伪造新的业务 accepted fact。

### 3.5 处理流中点名的关键函数调用,其参数分别是什么类型?

本 Step 如点名函数调用,必须使用 `TypeName param_name` 格式。例如 `IdentityAnchorPolicy.assert_new_anchor(GlobalMemberRef member_ref, ActorContext actor)`。禁止写 `assert_new_anchor(member_ref, actor)` 这类裸参数调用。

框架阶段不点名具体函数调用链。具体函数骨架从 8-A 开始按处理流逐条写入。

### 3.6 哪些处理步骤必须在概要设计点名,哪些完整函数调用链应留给详细设计?

概要设计必须点名:

- 入口类别:Command、Query、Event、Job。
- application service 的关键编排职责。
- 使用的 Step 6 domain object、policy、projection、outbox、trace 或 report 主语。
- 事务内外的大体边界。
- accepted / rejected / duplicate / stale / degraded / not visible 等会改变主线结果的概要口径。
- 禁止事项和后移到 `03/04` 的细节。

留给详细设计:

- 完整 DTO 字段级 schema。
- repository / resolver / publisher / handoff port trait 签名。
- 完整函数调用链、Rust 签名、错误码全集、SQL、DDL、retry 参数和调度参数。
- topic routing、event envelope、handoff target、receipt body-free marker 的字段级协议。

### 3.7 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流?

- Step 7 确认的 6 个 Command 全部画独立处理流。
- Step 7 确认的 5 个 Inbound Event Consumer 都会改写本地 snapshot / state / append record / handoff marker,全部画独立处理流。
- Step 7 确认的 6 个 Operations Job 都会影响 query 一致性、reference freshness、report-only 对账或 propagation reliability,全部画独立处理流。

### 3.8 哪些 Query 可以只走通用读路径,哪些 Query 必须画独立处理流?

包含 visibility、redaction、fallback、stale、degraded、projection not ready 或 handoff / outbox 状态解释的 Query 必须画独立处理流。仅按 ref 读取单一状态、且无裁剪 / fallback / 降级语义的 Query 可以走通用读路径,但必须在对应批次说明未展开原因。

### 3.9 每个处理流属于哪个主要组成部分,承接哪个接口,使用哪些关键对象?

本 Step 按 8-A~8-H 逐主要组成部分展开,并在每批处理流后记录接口、对象、接缝和边界。跨部分的 trace、outbox、projection、visibility、handoff 等 shared boundary 必须回指 Step 5 / Step 6 / Step 7,不得在处理流中临时发明新主语。

### 3.10 是否存在接口没有处理流口径、处理流点名对象未定义、处理流跨组成部分但接缝未说明?

框架阶段只建立审计规则,不提前宣称全量通过。每批必须检查:

- Step 7 接口是否有处理流或未展开理由。
- 处理流点名对象是否已在 Step 6 定义。
- 处理流是否误把 external body、runtime body、ProjectMember truth、method body、memory body、receipt body 写入 identity。
- 跨部分使用 trace / outbox / projection / visibility / handoff 时,是否已在 Step 5 / Step 7 说明接缝。
- 是否把 detailed port、DTO schema、SQL、retry 参数下沉进概要。

### 3.11 每个主要组成部分的处理流完成后是否通过停审?

必须停审。8-A~8-H 每批完成后都要有本批停审记录;8-I 再做跨处理流一致性审计。框架阶段完成后先停审,审核通过后进入 8-A。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 8 一次性写完全仓处理流 | 与最新版 SOP “Step 5~9 按主要组成部分小循环停审”不一致 | 改为先建框架,后续按 8-A~8-I 分批写入 |
| 旧 Step 8 使用 `CreateGlobalMemberFlow`、`ChangeGlobalLifecycleFlow` 等旧命名 | 与新版 Step 7 正式接口 `EstablishGlobalMember`、`UpdateGlobalLifecycleState` 等不一致 | 后续处理流必须以 Step 7 接口名为准 |
| 旧 Step 8 将部分 flow 写成函数调用链 | 容易下沉到详细设计,且参数类型骨架不稳定 | 只保留结构化处理流和关键设计点;函数调用参数必须带类型 |
| 旧 Step 8 对 Query 独立处理流选择较粗 | visibility、fallback、projection not ready 和 degraded 口径容易被漏掉 | 本轮先定义 Query 展开规则,后续逐批判断 |
| 旧 Step 8 对 Inbound Event / Job 幂等和边界说明不足 | 容易让 Consumer / Job 静默改业务 truth 或修复外部 truth | 本轮强制 event envelope、dedup、job run metadata、scope、cursor 和 no external repair |
| 旧 Step 8 对 outbox / handoff 处理流混入目标 / receipt 细节 | 容易提前关闭 `03/04` 才能定义的 protocol / config surface | 本轮只写 body-free refs / marker 和事务内外边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 生成方式 | 一次性处理流总稿 | 先建 Step 8 框架,再按主要组成部分逐批写处理流 |
| 接口来源 | 旧接口名和旧 flow 名混用 | 严格以 Step 7 接口审计表为准 |
| 图示规范 | 部分自定义大框图 | 使用统一自上而下 ASCII 模板 |
| Query 判断 | 部分 Query 直接合并到通用读路径 | 按 visibility / fallback / degraded / projection not ready 判断是否独立画图 |
| Consumer / Job | 幂等、source marker、run metadata 不够稳定 | 每条 Consumer / Job 都显式说明 envelope、dedup、scope、cursor 和 no truth repair |
| 详细程度 | 偏向函数链 / 事务细节 | 只写概要处理骨架,详细函数、port、DTO、错误码、SQL 后移 `03` |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 保留旧 Step 8 并替换接口名 | 不采用 | 旧稿的生成方式、命名、粒度和停审方式都与最新版标准不一致 |
| 一次性生成所有处理流 | 不采用 | 会重复早期 identity 粒度过粗问题,难以逐组成部分审核 |
| 先建 Step 8 框架,再按 8-A~8-I 分批写处理流 | 采用 | 与 governance 式粒度一致,能让每批先审查接口、对象和边界再进入下一批 |
| 每个 Query 都画独立图 | 不强制采用 | 简单只读状态 Query 可用通用读路径,但有 visibility / fallback / degraded 时必须独立画图 |
| 在 Step 8 定义 port trait / DTO schema / retry policy | 不采用 | 这些属于 `03/04` 或 Step 10~12 的详细承接,不是概要处理流正文 |

---

## 7. 结构化中间产物

### 7.1 处理流分类规则

| 类别 | 必须展开的处理重点 | 关键边界 |
|---|---|---|
| Command 写路径 | actor / metadata / idempotency、load truth / reference state、domain policy、accepted truth change、trace / outbox / projection stale / result | 不等待 publish / handoff 成功;不保存外部正文;不绕过 policy |
| Query 读路径 | actor / visibility、projection / truth summary / trace / audit / report 读取、not found / not visible / stale / degraded | 不写 truth;不触发 rebuild / refresh / repair |
| Inbound Event Consumer | envelope / source event id / dedup、source marker 解析、本地 snapshot / state / append record / handoff marker | 不拥有外部 truth;不保存外部 body;不静默改核心 truth |
| Outbound Event material | accepted fact material、payload marker、trace ref、topic / consumer boundary | 发布机制由 job 执行;事件不携带 forbidden body |
| Operations Job | run metadata、scope、cursor、system actor、基于已持久化 state / marker 执行 rebuild / refresh / report / publish / deliver / retry | 不作为业务 command;不修复相邻仓 truth;不伪造 delivered |

### 7.2 处理流 ASCII 模板

后续每个独立处理流必须使用以下自上而下结构。具体内容可按 Command / Query / Event / Job 调整,但不得改成横向时序图、完整调用链或伪代码。

```text
+---------------------------------------------------------------+
| <接口名>                                                      |
+---------------------------------------------------------------+
<Command / Query / Event / Job>
  |
  v
<Inbound / Consumer / Job / Handler Boundary>
  - <关键职责 1>
  - <关键职责 2>
  |
  v
<Application Service>
  - <关键编排 1>
  - <关键编排 2>
  |
  v
<Domain Object / Projection / Outbox>
  - <关键领域动作 1>
  - <关键领域动作 2>
  |
  v
<Result / Event / Projection / Report>
```

关键设计点必须紧跟每个处理流:

- 该处理流守住的边界。
- 该处理流不得做的事情。
- 该处理流交给 `03/04/05/06/07` 继续展开的内容。

### 7.3 处理流选择规则

| 接口类别 | 是否必须独立处理流 | 判断规则 |
|---|---|---|
| P0 Command | 必须 | Step 7 的 6 个 Command 全部独立画图 |
| Inbound Event Consumer | 必须 | 只要改写本地 snapshot / state / append record / handoff marker,必须独立画图 |
| Operations Job | 必须 | 影响 query 一致性、传播可靠性、reference freshness 或 report-only 对账时必须独立画图 |
| Query | 条件必须 | 有 visibility、redaction、fallback、stale、degraded、projection not ready、outbox / handoff state 解释时独立画图 |
| Outbound Event | 通常不单独画 accepted 前置图 | 作为 command / consumer accepted material 和 publish job 输入说明;若后续发现 event material 生成本身复杂,在对应批次补独立图 |

### 7.4 按主要组成部分的小循环计划

| 批次 | 主要组成部分 | 处理流范围 | 必须独立画图的接口 | 本批停审重点 |
|---|---|---|---|---|
| 8-A | 身份锚定与成员真相 | 建档 / anchor flow | `EstablishGlobalMember`;视边界决定 `GetGlobalMemberAnchor` 是否独立 | ref 不复用、query no-create、trace / outbox material、不引入账号 / ProjectMember / runtime truth |
| 8-B | 全局生命周期 | lifecycle flow | `UpdateGlobalLifecycleState`;视边界决定 `GetGlobalLifecycleSummary` 是否独立 | 合法迁移、高风险 basis、projection stale、后台不静默改 lifecycle |
| 8-C | 角色能力摘要 | role capability flow | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged`;视边界决定 `GetRoleCapabilitySummary` 是否独立 | source / evidence guard、snapshot / stale、forbidden body |
| 8-D | 身份生涯记录 | career flow | `AppendCareerRecord`, `HandleWorkParticipationAccepted`;视边界决定 `ListCareerRecords` 是否独立 | append-only、source marker dedup、correction append、不保存 work body |
| 8-E | 记忆引用关系 | memory reference flow | `MaintainMemoryReference`, `HandleMemoryReferenceSourceStateChanged`, `HandleArchiveHandoffResult`;视边界决定 `ListMemoryReferences` 是否独立 | body-free refs、handoff marker、不保存 memory / archive body、不伪成功 |
| 8-F | 身份事实消费与追溯 | consumption query flow | `ReadMemberSummary`, `ReadIdentityTrace`, `ReadAuditTrail` | visibility、redaction、not visible、stale / degraded、query 不触发 repair |
| 8-G | 派生维护与对账 | maintenance flow | `RebuildIdentityProjection`, `RefreshExternalReferenceState`, `RunIdentityReconciliation`;视边界决定 7-G Queries 是否独立 | projection rebuild、reference refresh、report-only reconciliation、不修复相邻仓 truth |
| 8-H | 身份事实传播与外部交接 | propagation / handoff flow | `PrepareTraceHandoff`, `HandleTraceHandoffResult`, `PublishIdentityOutbox`, `DeliverTraceHandoff`, `RetryIdentityPropagationFailures`;视边界决定 outbox / handoff Queries 是否独立 | publish / handoff 不作 accepted 前置、handoff 不伪造 delivered、不保存 receipt / package body |
| 8-I | 跨处理流一致性审计 | 全部处理流 | 不新增接口 | 接口覆盖、对象引用、跨部分接缝、事务边界粒度、未展开理由一致 |

### 7.5 每批处理流输出模板

后续 8-A~8-H 每批必须使用以下结构:

1. 本批输入与承接。
2. 本批问题回答。
3. 当前材料诊断。
4. 本批设计取舍。
5. 处理流覆盖清单。
6. 独立处理流 ASCII 图与关键设计点。
7. 未展开独立处理流的原因。
8. 处理流与对象 / 接口对应关系。
9. 本批审计。
10. 本批回填草稿。
11. 本批待确认事项。
12. 进入下一批的条件。

---

## 8. 复杂度判断 / 是否拆分

Step 8 必须拆分。原因:

- Step 7 已确认 6 个 Command、5 个 Inbound Event Consumer、6 个 Operations Job 和 14 个 Query,一次性写入会难以审查。
- 处理流会连接对象、接口、state、trace、outbox、projection、visibility、handoff 等多个主语,最容易发生跨部分串线。
- Identity 的 forbidden body、query no-write、report-only、eventual propagation 和 handoff 不伪成功约束都需要在处理流层逐批验证。
- 旧 Step 8 已经出现一次性生成、旧接口名和粒度偏实现的问题。

拆分方式:

- 主文件保留 Step 8 统一框架、分类规则、模板、小循环计划和最终审计。
- 后续内容继续写入本文件的连续批次小节;若单批过长,可在当前 Step 到达后创建 `02_hld_step_08_processing_flows_<batch>.md` 附录。
- 不创建 Step 9~Step 14 的未来文件。
- 本次只完成 Step 8 框架,审核通过后再进入 8-A。

---

## 9. 回填草稿

正式 `02-概要设计.md` §8 后续应回填:

1. 通用处理流骨架。
2. 按主要组成部分组织的处理流覆盖清单。
3. P0 Command 独立处理流。
4. 改写本地状态的 Inbound Event Consumer 独立处理流。
5. 影响一致性或传播可靠性的 Operations Job 独立处理流。
6. 必须独立展开的 Query 处理流。
7. 未展开独立处理流的接口及理由。
8. 处理流与对象 / 接口对应关系。
9. 处理流归属停审记录和跨处理流一致性审计表。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 8 先建立框架、再按 8-A~8-I 逐批补充 | 若不认可,需要重新决定 Step 8 写入方式 | 当前沿用 Step 5~7 的分批方式 |
| 是否认可 Step 7 的接口审计表作为 Step 8 唯一展开来源 | 若不认可,需先回 Step 7 修正接口 | 当前不从旧 Step 8 继承旧接口名 |
| 是否认可 6 个 Command、5 个 Consumer、6 个 Job 全部独立画图 | 若不认可,需要说明哪些接口可安全合并 | 当前按 SOP 硬约束处理 |
| 是否认可 Query 按 visibility / fallback / degraded / projection not ready 选择独立处理流 | 若不认可,可能导致 query 边界不足或文档过重 | 当前采用条件展开 |
| 是否认可本框架阶段不写 8-A 具体处理流 | 若不认可,可在审核通过后立即进入 8-A | 当前先停审框架 |

---

## 11. 进入下一步条件

当前 8-F “身份事实消费与追溯”处理流已完成,等待用户审核。进入 8-G 前必须满足:

- `ReadMemberSummary` 只读处理流已被认可。
- `ReadIdentityTrace` 只读处理流已被认可。
- `ReadAuditTrail` 只读处理流已被认可。
- query no-write、visibility / redaction、forbidden body 不泄漏、trace / audit 不作为第二 truth 的边界已被认可。
- 本批没有引入 Command、Inbound Event Consumer、Outbound Event、Operations Job、状态矩阵、DTO schema、port trait、SQL、retry 参数或未来 Step 文件。

用户审核通过后,进入 8-G “派生维护与对账”处理流。

---

## 12. 8-A 身份锚定与成员真相处理流

### 12.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-001` | `EstablishGlobalMember` 必须能建立新的平台级成员身份主语 |
| `FR-ID-002` | `GetGlobalMemberAnchor` 必须只读基础身份锚点,返回 found / not_found / not_visible / stale / degraded |
| `FR-ID-003` | 建档流必须保护 `GlobalMemberRef` 稳定且不可复用 |
| `BR-ID-001` / `VETO-ID-001` | 已建立、退役持有或墓碑持有的 ref 不得被新成员复用 |
| `BR-ID-002` / `VETO-ID-002` | 读取、projection、maintenance 不得隐式创建成员 |
| `BR-ID-003` | 账号、credential、runtime instance、ProjectMember 不得写成 `GlobalMember` truth |
| Step 6 `GlobalMember` | 建档写路径的 truth aggregate |
| Step 6 `IdentityAnchorState` | 建档后初始 anchor state 和 ref hold 语义 |
| Step 6 `IdentityAnchorPolicy` | 创建、防复用、query no-create 和边界混层 guard |
| Step 6 `MemberSummaryView` | 基础锚点 query 可读取的 projection slice |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted member fact 的追溯和传播 material |
| Step 7 `EstablishGlobalMember` | 本批唯一建档 Command |
| Step 7 `GetGlobalMemberAnchor` | 本批基础锚点 Query |
| Step 7 `GlobalMemberEstablished` / `IdentityAnchorChanged` | 本批 accepted outbound event material |

### 12.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `EstablishGlobalMember` 是 P0 建档 Command,必须独立画图。 |
| 本批哪些 Query 必须独立画图? | `GetGlobalMemberAnchor` 含 visibility、not_found、not_visible、stale / degraded 口径,必须独立画图。 |
| 本批是否有 Inbound Event Consumer? | 没有。外部账号、项目成员或来源事件不得直接建立 `GlobalMember` truth。 |
| 本批是否有 Operations Job? | 没有。建档和基础读取都不是 job;projection rebuild 和 outbox publish 后移 8-G / 8-H。 |
| 本批 outbound event 是否独立画图? | 不独立画 accepted 前置图。`GlobalMemberEstablished` / `IdentityAnchorChanged` 是 accepted outbox material,发布处理流后移 8-H。 |

### 12.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 查询路径变成创建路径 | `GetGlobalMemberAnchor` not_found 时自动建立 `GlobalMember` | 独立 query flow 明确 no-write,not_found 只返回结果 marker |
| ref 复用 | retired / tombstone ref 被重新分配给新成员 | command flow 必须读取 existing anchor state 并调用 `IdentityAnchorPolicy.assert_ref_not_reused(...)` |
| 外部身份混入 truth | account、credential、runtime id 或 ProjectMember body 被保存为成员 truth | command flow 只接受 body-free `IdentitySourceRef`,并调用边界 guard |
| outbox publish 成为建档成功条件 | 下游发布失败导致 `EstablishGlobalMember` accepted 回滚 | command flow 只创建 pending outbound material;发布和重试后移 8-H |
| projection stale 被误当 truth | anchor query 从 stale projection 反写 truth | query flow 只返回 stale / degraded marker,不得修复 projection 或成员 truth |

### 12.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把 create/read 合成 upsert flow | 不采用 | 会破坏 query no-create 和 ref 不复用边界 |
| 允许外部 event 直接触发建档 flow | 不采用 | 建档必须有 actor、metadata、idempotency 和 anchor policy |
| `GetGlobalMemberAnchor` 只走通用读路径 | 不采用 | 它需要表达 visibility、not_visible、stale / degraded 和 no-create 语义 |
| `GlobalMemberEstablished` 单独画 event material 生成 flow | 不采用 | event material 是 accepted command 的事务内结果;真正 publish flow 在 8-H |
| 在本批定义 id generator / repository port 方法名 | 不采用 | 本批只点名生成 / 分配接缝,正式 trait 和方法名留给 `03` |

### 12.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `EstablishGlobalMember` | Command | 是 | P0 建档写路径,改写 `GlobalMember` / `IdentityAnchorState` 并产生 trace / outbox material |
| `GetGlobalMemberAnchor` | Query | 是 | 基础读取包含 visibility、not_found、not_visible、stale / degraded 和 query no-create |
| `GlobalMemberEstablished` | Outbound Event material | 否 | 来自 `EstablishGlobalMember` accepted result,发布机制后移 `PublishIdentityOutbox` |
| `IdentityAnchorChanged` | Outbound Event material | 否 | 本批只产生 established 类 anchor change material;其他 anchor 变化留给 8-B / Step 9 |
| 建档类 Inbound Event Consumer | Inbound Event Consumer | 不适用 | 本批明确不定义 |
| 建档类 Operations Job | Operations Job | 不适用 | 本批明确不定义 |

### 12.6 `EstablishGlobalMember` 处理流

```text
Command: EstablishGlobalMember
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberCreateIntent 与 body-free IdentitySourceRef
  |
  v
Identity Application Service
  - 取得或分配 GlobalMemberRef
  - 读取 existing IdentityAnchorState
  - 构造 IdentityAnchorPolicy.for_create(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref, Option<IdentityAnchorState> existing_anchor_state)
  |
  v
Domain Object / Policy
  - 调用 IdentityAnchorPolicy.assert_can_establish(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref)
  - 调用 IdentityAnchorPolicy.assert_ref_not_reused(GlobalMemberRef member_ref, Option<IdentityAnchorState> existing_anchor_state)
  - 调用 IdentityAnchorPolicy.assert_not_external_account_truth(IdentitySourceRef source_ref)
  - 调用 GlobalMember.establish(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref, IdentityTimestamp created_at)
  |
  v
Accepted Truth Material
  - 保存 GlobalMember 与 IdentityAnchorState::Established
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
GlobalMemberCommandResult
```

关键设计点:

- `GlobalMemberRef` 的正式生成 / 分配来源只在本流点名为接缝,具体方法名和唯一约束留给 `03`。
- existing anchor state 存在且不可复用时必须 rejected,不能转为 update 或 upsert。
- accepted result 只保证本仓 truth、trace、outbox material 成立;outbox publish 不作为 command 成功前置。
- command 输入、trace、outbox 和结果都不得携带 account body、credential、ProjectMember truth、runtime body 或 external source body。
- `IdentityTraceRecord.from_accepted_change(...)` 和 `IdentityOutboxRecord.from_accepted_change(...)` 的完整字段、事务顺序、stored result schema 留给 `03`。

### 12.7 `GetGlobalMemberAnchor` 处理流

```text
Query: GetGlobalMemberAnchor
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef 与 optional ConsistencyHintRef
  |
  v
Identity Query Service
  - 调用 IdentityAnchorPolicy.for_read(IdentityOperationChannel channel)
  - 调用 IdentityAnchorPolicy.assert_query_does_not_create(IdentityOperationChannel channel)
  - 读取 GlobalMember truth summary 与 IdentityAnchorState
  - 可用时读取 MemberSummaryView anchor slice 与 ProjectionState
  |
  v
Visibility / Projection Boundary
  - 应用 VisibilityContextRef 得到 VisibilityResultRef
  - 不可见时返回 not_visible,不得泄露 source body 或内部原因正文
  - projection stale / unavailable 时返回 stale 或 degraded marker
  |
  v
GlobalMemberAnchorResult
```

关键设计点:

- not_found、not_visible、stale、degraded 都是 query result 口径,不是隐式 create、repair 或 retry trigger。
- query 可以读取 truth summary 和 projection slice,但不得刷新外部 source、修复 projection 或创建 `GlobalMember`。
- 不可见不等于不存在;response shape 和字段级 redaction 留给 7-F / `03` 继续展开。
- `MemberSummaryView` 只作为基础 anchor slice 的读取来源,完整成员消费摘要在 8-F 展开。

### 12.8 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| 建档类 Inbound Event Consumer | 外部事件不得绕过 actor、metadata、idempotency 和 `IdentityAnchorPolicy` 直接创建 `GlobalMember` | 若未来存在 source claim,只能作为 `IdentitySourceRef` 或待审输入进入 Command / `03` |
| 建档类 Operations Job | 后台任务不得静默创建成员或修复成员 truth | projection rebuild 后移 8-G;outbox publish 后移 8-H |
| `GlobalMemberEstablished` publish flow | 本批只创建 accepted outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| `IdentityAnchorChanged` 非 established 变化 | retired / tombstone 等变化与 lifecycle / anchor state 关系需要 Step 9 收敛 | 8-B / Step 9 / `03` |

### 12.9 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `EstablishGlobalMember` | `EstablishGlobalMember` Command | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | ref allocation、member truth repository、trace / outbox material | 不保存外部正文;不等待 publish;不从 query / job 触发 |
| `GetGlobalMemberAnchor` | `GetGlobalMemberAnchor` Query | `GlobalMember`, `IdentityAnchorState`, `MemberSummaryView`, `ProjectionState`, `VisibilityPolicy` / visibility boundary | member read repository、projection read、visibility / redaction | no-write;not_visible 不泄露;stale 不修复 |

### 12.10 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | Command 和 Query 均有独立处理流;event material 有后移说明 |
| 处理流点名对象是否已在 Step 6 定义 | 通过 | `GlobalMember`、`IdentityAnchorState`、`IdentityAnchorPolicy`、`MemberSummaryView`、`IdentityTraceRecord`、`IdentityOutboxRecord` 均可反查 |
| 是否保持 query no-write | 通过 | `GetGlobalMemberAnchor` 明确 not_found / stale / degraded 不触发创建或修复 |
| 是否保护 ref 不复用 | 通过 | `EstablishGlobalMember` 必须读取 existing anchor state 并调用 ref reuse guard |
| 是否越过账号 / ProjectMember / runtime 边界 | 通过 | command / query / event material 均只允许 body-free refs / markers |
| 是否混入发布可靠性细节 | 通过 | 本批只准备 pending outbox material,publish / retry 后移 8-H |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集或 retry 参数 |

### 12.11 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `EstablishGlobalMember` 是身份锚定与成员真相的 P0 写路径。它校验 actor、metadata、幂等、来源 ref 和 existing anchor state,通过 `IdentityAnchorPolicy` 后创建 `GlobalMember` 与初始 `IdentityAnchorState::Established`,并生成 trace / pending outbox material。
- `GetGlobalMemberAnchor` 是基础锚点只读路径。它只读取 member truth summary、anchor state 和可用的 projection slice,应用 visibility 后返回 found / not_found / not_visible / stale / degraded,不得创建或修复 truth。
- `GlobalMemberEstablished` / `IdentityAnchorChanged` 是本批 accepted event material,真正发布、失败重试和可靠性处理在传播与交接处理流中展开。
- 本批不定义建档类 inbound event consumer 或 operations job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 12.12 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 `EstablishGlobalMember` 只建立 member truth / anchor state,不同步发布 | 若不认可,会把 propagation reliability 拉进 command accepted 前置 | 当前 publish 后移 8-H |
| 是否认可 `GetGlobalMemberAnchor` 独立画图 | 若不认可,可降级为通用读路径,但会弱化 query no-create 和 visibility 说明 | 当前独立画图 |
| 是否认可本批不定义建档类 Consumer / Job | 若不认可,需重新讨论外部来源自动建档是否违反受控建档边界 | 当前仅允许外部来源作为 body-free `IdentitySourceRef` |
| 是否认可 `IdentityAnchorChanged` 的非 established 变化后移 | 若不认可,需要在 8-A 提前讨论 retired / tombstone 与 lifecycle 的关系 | 当前后移 8-B / Step 9 |

### 12.13 进入 8-B 的条件

进入 8-B “全局生命周期”前,需要用户确认:

- `EstablishGlobalMember` 和 `GetGlobalMemberAnchor` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- ref 不复用、query no-create、账号 / ProjectMember / runtime 排除和 publish 不作 accepted 前置已满足本批停审。
- 本批未展开的 event publish、projection rebuild、retired / tombstone lifecycle 关系可以在 8-B / 8-G / 8-H / Step 9 继续收敛。

---

## 13. 8-B 全局生命周期处理流

### 13.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-004` | `UpdateGlobalLifecycleState` 必须能显式调整成员全局生命周期 / 可用性 |
| `FR-ID-005` | 高风险生命周期处置必须保留授权 / 治理依据引用 |
| `BR-ID-004` | 生命周期变化必须来自显式管理意图、原因和操作者上下文 |
| `BR-ID-005` / `VETO-ID-004` | 缺少正式 basis 的高风险处置不得 accepted |
| `BR-ID-006` | 全局生命周期不得等同 runtime、ProjectMember 或任务状态 |
| Step 6 `GlobalMember` | lifecycle command / query 必须先依附已建立成员主语 |
| Step 6 `GlobalLifecycleState` | lifecycle truth state 主语 |
| Step 6 `LifecycleTransitionPolicy` | 显式 command、合法迁移、reason 和 actor guard |
| Step 6 `HighRiskLifecycleGuard` | 高风险目标状态的 basis ref guard |
| Step 6 `MemberSummaryView` | lifecycle query 可读取的 projection slice |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted lifecycle fact 的追溯和传播 material |
| Step 7 `UpdateGlobalLifecycleState` | 本批唯一 lifecycle Command |
| Step 7 `GetGlobalLifecycleSummary` | 本批 lifecycle Query |
| Step 7 `GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` | 本批 accepted outbound event material |

### 13.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `UpdateGlobalLifecycleState` 是 P0 lifecycle truth 写路径,必须独立画图。 |
| 本批哪些 Query 必须独立画图? | `GetGlobalLifecycleSummary` 含 visibility、not_found、not_visible、stale / degraded 和不补 basis 口径,必须独立画图。 |
| 本批是否有 Inbound Event Consumer? | 没有。governance / authorization / runtime / work 事件不得直接改写 `GlobalLifecycleState`。 |
| 本批是否有 Operations Job? | 没有。后台任务不得静默 pause / retire / tombstone。 |
| 本批 outbound event 是否独立画图? | 不独立画 accepted 前置图。`GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` 是 accepted outbox material,发布处理流后移 8-H。 |

### 13.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| runtime 状态污染 lifecycle truth | 用容器健康、agent 在线状态、任务执行状态更新 `GlobalLifecycleState` | command flow 明确拒绝 runtime / task / ProjectMember 状态作为 lifecycle truth |
| 外部 governance event 直接改 lifecycle | 授权事件绕过 identity command 和 transition policy | 本批不定义 lifecycle Consumer;basis 只作为 `GovernanceBasisRef` / resolution marker |
| 高风险处置缺 basis | retire / tombstone / high-risk pause 没有正式依据仍 accepted | command flow 在目标状态高风险时必须通过 `HighRiskLifecycleGuard` |
| query 补 basis 或修复状态 | 读取时发现缺 basis 后直接补写或改状态 | query flow 只读,返回 stale / degraded / not_visible 等 marker |
| publish 成为 lifecycle 成功条件 | 下游传播失败导致 lifecycle accepted 回滚 | command flow 只创建 pending outbox material;发布后移 8-H |

### 13.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 拆分 pause / resume / retire / tombstone 多个 Command | 不采用为概要处理流主线 | 它们共享 transition policy、basis guard、trace / outbox 边界;具体 intent variant 留给 Step 9 / `03` |
| 用 `UpdateGlobalLifecycleState` 统一 lifecycle write path | 采用 | 能集中承接 actor、reason、idempotency、合法迁移和高风险 basis |
| governance / runtime event 直接触发生命周期变化 | 不采用 | 会绕过显式 command 和本仓 policy,也容易把外部 truth 混入 identity |
| `GetGlobalLifecycleSummary` 只走通用读路径 | 不采用 | 它需要表达 visibility、basis body 不泄露、stale / degraded 和 no-write |
| 在本批定义 basis resolver 详细 port | 不采用 | 本批只写 body-free basis resolution boundary,正式 port / schema 后移 `03` |

### 13.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `UpdateGlobalLifecycleState` | Command | 是 | P0 lifecycle 写路径,改写 `GlobalLifecycleState` 并产生 trace / outbox material |
| `GetGlobalLifecycleSummary` | Query | 是 | lifecycle 读取包含 visibility、not_found、not_visible、stale / degraded 和 basis redaction |
| `GlobalLifecycleChanged` | Outbound Event material | 否 | 来自 `UpdateGlobalLifecycleState` accepted result,发布机制后移 8-H |
| `GlobalMemberAvailabilityChanged` | Outbound Event material | 否 | lifecycle accepted result 的消费友好 material,是否与 lifecycle event 合并留给 `03` |
| lifecycle 类 Inbound Event Consumer | Inbound Event Consumer | 不适用 | 本批明确不定义 |
| lifecycle 类 Operations Job | Operations Job | 不适用 | 本批明确不定义 |

### 13.6 `UpdateGlobalLifecycleState` 处理流

```text
Command: UpdateGlobalLifecycleState
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberRef / LifecycleTransitionIntent / LifecycleReasonRef / optional GovernanceBasisRef
  |
  v
Lifecycle Application Service
  - 读取 GlobalMember 与当前 GlobalLifecycleState
  - 从 intent 得到 target GlobalLifecycleStateKind 与 action risk marker
  - 构造 LifecycleTransitionPolicy.for_transition(GlobalLifecycleState current_state, GlobalLifecycleStateKind target_state, LifecycleReasonRef reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)
  |
  v
Domain Object / Policy
  - 调用 LifecycleTransitionPolicy.assert_explicit_command(IdentityOperationChannel channel, ActorRef actor_ref, LifecycleReasonRef reason_ref)
  - 调用 LifecycleTransitionPolicy.assert_allowed_transition(GlobalLifecycleState current_state, GlobalLifecycleStateKind target_state)
  - 调用 LifecycleTransitionPolicy.assert_not_project_or_runtime_state(GlobalLifecycleStateKind target_state)
  - 高风险时构造 HighRiskLifecycleGuard.for_action(GlobalLifecycleStateKind target_state, LifecycleRiskRef action_risk_ref, Option<GovernanceBasisRef> basis_ref, ActorRef actor_ref)
  - 高风险时调用 HighRiskLifecycleGuard.assert_basis_present(GlobalLifecycleStateKind target_state, Option<GovernanceBasisRef> basis_ref)
  - 高风险时调用 HighRiskLifecycleGuard.assert_basis_matches_action(GovernanceBasisRef basis_ref, LifecycleRiskRef action_risk_ref)
  - 调用 GlobalLifecycleState.from_transition(...)
  |
  v
Accepted Truth Material
  - 保存新的 GlobalLifecycleState
  - 必要时保留 IdentityAnchorState retired / tombstone hold 的后续处理线索
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
LifecycleCommandResult
```

关键设计点:

- lifecycle 写入必须来自受控 Command,不能由 query、maintenance job、runtime event 或 ProjectMember event 触发。
- `GovernanceBasisRef` 只作为 body-free basis ref / resolution marker,不得保存 Gate、Policy、Approval、Control truth 或 basis body。
- 高风险 action 缺 basis、basis unavailable 或 basis mismatch 时不得 accepted;具体 rejected / pending_basis response surface 留给 `03` / Step 10。
- lifecycle accepted 后可以产生 availability event material,但 publish 不作为 command 成功前置。
- retired / tombstone 对 `IdentityAnchorState` 的 hold 影响只在本批保留处理线索,完整状态关系留给 Step 9。

### 13.7 `GetGlobalLifecycleSummary` 处理流

```text
Query: GetGlobalLifecycleSummary
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef 与 optional ConsistencyHintRef
  |
  v
Lifecycle Query Service
  - 读取 GlobalMember 存在性
  - 读取 GlobalLifecycleState truth summary
  - 可用时读取 MemberSummaryView lifecycle slice 与 ProjectionState
  |
  v
Visibility / Redaction Boundary
  - 应用 VisibilityContextRef 得到 VisibilityResultRef
  - 不可见时返回 not_visible,不得泄露 high-risk basis body 或内部治理详情
  - projection stale / unavailable 时返回 stale 或 degraded marker
  |
  v
GlobalLifecycleSummaryResult
```

关键设计点:

- query 不补 basis、不读取 runtime health、不调用 governance resolver、不修复 lifecycle truth。
- not_found、not_visible、stale、degraded 是正式读取结果口径,不是异常绕过或 repair trigger。
- 不可见时不能泄露 `GovernanceBasisRef` 背后的正文、治理裁决详情或内部原因。
- 完整成员摘要、跨字段 redaction、trace / audit 读取在 8-F 展开。

### 13.8 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| lifecycle 类 Inbound Event Consumer | 外部 event 不得直接改写 `GlobalLifecycleState`;basis 只作为 body-free ref / resolution source | `03` basis resolver;Step 10 missing / unavailable basis |
| lifecycle 类 Operations Job | 后台任务不得静默 pause、retire 或 tombstone 成员 | 8-G projection / reconciliation;8-H outbox publish |
| `GlobalLifecycleChanged` publish flow | 本批只创建 accepted outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| `GlobalMemberAvailabilityChanged` 独立生成 flow | 它是 lifecycle accepted result 的消费友好 material,是否独立事件或合并 payload 留给 `03` | 8-H outbound publish;`03` event payload |
| retired / tombstone 与 anchor hold 完整状态关系 | 涉及 lifecycle state 与 anchor state 关系,不在处理流中写完整状态矩阵 | Step 9 状态定义与状态流转 |

### 13.9 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `UpdateGlobalLifecycleState` | `UpdateGlobalLifecycleState` Command | `GlobalMember`, `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | member / lifecycle repository、basis resolution boundary、trace / outbox material | 不保存 governance body;不读取 runtime / ProjectMember truth;不等待 publish |
| `GetGlobalLifecycleSummary` | `GetGlobalLifecycleSummary` Query | `GlobalMember`, `GlobalLifecycleState`, `MemberSummaryView`, `ProjectionState`, visibility boundary | member / lifecycle read repository、projection read、visibility / redaction | no-write;不补 basis;不泄露 basis body;stale 不修复 |

### 13.10 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | Command 和 Query 均有独立处理流;event material 有后移说明 |
| 处理流点名对象是否已在 Step 6 定义 | 通过 | `GlobalLifecycleState`、`LifecycleTransitionPolicy`、`HighRiskLifecycleGuard`、`IdentityTraceRecord`、`IdentityOutboxRecord` 等均可反查 |
| 是否保持 lifecycle 显式 command | 通过 | 本批不定义 lifecycle Consumer 或 Job,并禁止 query / maintenance 静默写 truth |
| 高风险 basis 是否闭合到概要层 | 通过 | 写路径明确 basis present / matches action guard,但不保存 governance body |
| 是否越过 runtime / ProjectMember 边界 | 通过 | transition policy 明确拒绝 runtime / ProjectMember state 混入 lifecycle |
| 是否混入发布可靠性细节 | 通过 | 本批只准备 pending outbox material,publish / retry 后移 8-H |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集或 retry 参数 |

### 13.11 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `UpdateGlobalLifecycleState` 是全局生命周期的 P0 写路径。它读取成员与当前生命周期状态,通过 `LifecycleTransitionPolicy` 校验显式 command 和合法迁移,在高风险目标状态下通过 `HighRiskLifecycleGuard` 校验 body-free `GovernanceBasisRef`,然后保存新的 `GlobalLifecycleState` 并生成 trace / pending outbox material。
- `GetGlobalLifecycleSummary` 是 lifecycle slice 的只读路径。它读取 member / lifecycle truth summary 与可用的 projection slice,应用 visibility 后返回 found / not_found / not_visible / stale / degraded,不得补 basis、读取 runtime health 或修复 truth。
- `GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` 是本批 accepted event material,真正发布、失败重试和可靠性处理在传播与交接处理流中展开。
- 本批不定义 lifecycle 类 inbound event consumer 或 operations job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 13.12 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 lifecycle 写入口统一为 `UpdateGlobalLifecycleState` | 若不认可,需拆 pause / resume / retire / tombstone 处理流 | 当前用 intent 表达具体目标,状态矩阵后移 Step 9 / `03` |
| 是否认可高风险 basis 只保存 body-free `GovernanceBasisRef` | 若不认可,会破坏 governance truth ownership | 当前只定义 basis ref / resolution marker |
| 是否认可不定义 lifecycle Consumer / Job | 若不认可,需重新讨论外部事件或后台任务是否会绕过显式 command | 当前坚持显式 command 才能改写 lifecycle truth |
| 是否认可 `GlobalMemberAvailabilityChanged` 后移到 `03` 决定是否合并 | 若不认可,需在本 Step 细分 event material | 当前保留为消费友好 event material |
| 是否认可 retired / tombstone 与 anchor hold 关系后移 Step 9 | 若不认可,需要在处理流中提前写状态矩阵 | 当前只保留后续处理线索 |

### 13.13 进入 8-C 的条件

进入 8-C “角色能力摘要”前,需要用户确认:

- `UpdateGlobalLifecycleState` 和 `GetGlobalLifecycleSummary` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- lifecycle 与 runtime、ProjectMember、governance truth 的边界保持分离。
- 缺 basis 高风险处置不 accepted、后台任务不静默改 lifecycle、publish 不作 accepted 前置已满足本批停审。

---

## 14. 8-C 角色能力摘要处理流

### 14.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-006` | `MaintainRoleCapabilitySummary` 必须能维护成员身份侧角色摘要 |
| `FR-ID-007` | `MaintainRoleCapabilitySummary` 必须能维护能力画像安全摘要和证据引用 |
| `FR-ID-008` | `HandleRoleCapabilitySourceChanged` 必须能响应 role / capability 来源变化 |
| `BR-ID-007` / `VETO-ID-003` | RoleDefinition / CapabilityDefinition 正文、method body、evidence body 不得进入 identity |
| `BR-ID-008` | 角色能力摘要必须有来源或证据,不得形成无来源声明 |
| `BR-ID-009` | Identity 不负责自动评估能力等级或推断绩效 |
| Step 6 `RoleCapabilitySummary` | role / capability 摘要写路径的本地 truth / snapshot 主语 |
| Step 6 `RoleCapabilitySourceSnapshot` | body-free 来源 snapshot、version marker 和 source state |
| Step 6 `RoleCapabilitySourcePolicy` | source / evidence 必填、forbidden body 和自动评分 guard |
| Step 6 `MemberSummaryView` | role capability query 可读取的 projection slice |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted role capability fact / source state change 的追溯和传播 material |
| Step 7 `MaintainRoleCapabilitySummary` | 本批 role / capability 摘要 Command |
| Step 7 `GetRoleCapabilitySummary` | 本批 role / capability 摘要 Query |
| Step 7 `HandleRoleCapabilitySourceChanged` | 本批 method-library 来源变化 Consumer |
| Step 7 `RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` | 本批 accepted outbound event material |

### 14.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `MaintainRoleCapabilitySummary` 是 P0 role / capability 摘要写路径,必须独立画图。 |
| 本批哪些 Query 必须独立画图? | `GetRoleCapabilitySummary` 含 visibility、stale / degraded、source state 和 forbidden body redaction,必须独立画图。 |
| 本批哪些 Inbound Event Consumer 必须独立画图? | `HandleRoleCapabilitySourceChanged` 会改写 `RoleCapabilitySourceSnapshot` 和相关 summary stale / unavailable / pending marker,必须独立画图。 |
| 本批是否有 Operations Job? | 没有。source refresh、stale reconciliation 和 projection rebuild 后移 8-G。 |
| 本批 outbound event 是否独立画图? | 不独立画 accepted 前置图。`RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` 是 accepted outbox material,发布处理流后移 8-H。 |

### 14.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| method-library 正文进入 identity | Command、Consumer 或 event material 保存 RoleDefinition / CapabilityDefinition body 或 method body | 所有 flow 只接收 source ref、version marker、safe summary marker 和 evidence refs |
| 无来源能力声明 accepted | 管理员或来源事件写入能力摘要但没有 source / evidence | command flow 必须调用 `RoleCapabilitySourcePolicy.assert_source_or_evidence_present(...)` |
| 自动评分进入 truth | 把能力等级、绩效推断或不可解释算法结果写成 identity truth | command flow 必须调用 `assert_not_automatic_scoring(...)` |
| source event 静默改 active summary | method-library 事件直接覆盖 summary 为 active | consumer flow 只更新 snapshot state、mark stale / unavailable / pending reconciliation,不直接 active accepted summary |
| query 触发外部刷新 | `GetRoleCapabilitySummary` 读取时调用 method-library 或修复 summary | query flow 只读本地 truth / snapshot / projection,source refresh 后移 8-G |

### 14.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 拆分 role summary 与 capability summary 两条 Command | 不采用为概要处理流主线 | 二者共享 source / evidence / forbidden body / trace / outbox 边界;具体 intent variant 留给 `03` |
| 用 `MaintainRoleCapabilitySummary` 统一写路径 | 采用 | 能集中承接 source snapshot、evidence refs、actor、幂等和 forbidden body guard |
| method-library event 直接改写 active summary | 不采用 | 外部来源变化只能提供 body-free snapshot / state marker;是否更新 summary 仍需本仓 command / policy |
| `GetRoleCapabilitySummary` 只走通用读路径 | 不采用 | 它需要表达 source stale / unavailable、visibility、not_visible、degraded 和 forbidden body redaction |
| 在本批定义 source / evidence resolver 详细 port | 不采用 | 本批只写 resolution boundary,正式 port / schema 后移 `03` |

### 14.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `MaintainRoleCapabilitySummary` | Command | 是 | P0 role / capability 摘要写路径,改写 `RoleCapabilitySummary` / source snapshot 并产生 trace / outbox material |
| `GetRoleCapabilitySummary` | Query | 是 | role capability 读取包含 visibility、source state、stale / degraded 和 forbidden body redaction |
| `HandleRoleCapabilitySourceChanged` | Inbound Event Consumer | 是 | 消费 method-library 来源变化,改写本地 source snapshot / stale marker |
| `RoleCapabilitySummaryChanged` | Outbound Event material | 否 | 来自 `MaintainRoleCapabilitySummary` accepted result,发布机制后移 8-H |
| `RoleCapabilitySourceStateChanged` | Outbound Event material | 否 | 来自 source event 消费后的本地 source state change,发布机制后移 8-H |
| source refresh / reconciliation job | Operations Job | 不适用 | 本批明确不定义,后移 8-G |

### 14.6 `MaintainRoleCapabilitySummary` 处理流

```text
Command: MaintainRoleCapabilitySummary
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberRef / RoleCapabilityChangeIntent / RoleCapabilitySourceRef / optional RoleCapabilitySourceVersionRef
  - 接收 List<CapabilityEvidenceRef> / RoleCapabilitySafeSummaryRef / RoleCapabilityChangeReasonRef
  |
  v
Role Capability Application Service
  - 读取 GlobalMember 与当前 RoleCapabilitySummary
  - 解析或接收 body-free RoleCapabilitySourceSnapshot
  - 构造 RoleCapabilitySourcePolicy.for_summary_update(GlobalMemberRef member_ref, RoleCapabilitySourceSnapshot source_snapshot, List<CapabilityEvidenceRef> evidence_refs, RoleCapabilityChangeReasonRef change_reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)
  |
  v
Domain Object / Policy
  - 调用 RoleCapabilitySourcePolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 RoleCapabilitySourcePolicy.assert_source_or_evidence_present(RoleCapabilitySourceSnapshot snapshot, List<CapabilityEvidenceRef> evidence_refs)
  - 调用 RoleCapabilitySourcePolicy.assert_source_usable(RoleCapabilitySourceSnapshot snapshot)
  - 调用 RoleCapabilitySourcePolicy.assert_no_forbidden_body(RoleCapabilityChangeMaterial change_material)
  - 调用 RoleCapabilitySourcePolicy.assert_not_automatic_scoring(RoleCapabilityChangeMaterial change_material)
  - 创建或更新 RoleCapabilitySummary
  |
  v
Accepted Truth Material
  - 保存 RoleCapabilitySummary 与关联 RoleCapabilitySourceSnapshot
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
RoleCapabilityCommandResult
```

关键设计点:

- source / evidence 缺失、source stale / unavailable / unrecognized、forbidden body、自动评分材料都不得 accepted。
- `RoleCapabilitySafeSummaryRef` 只是安全摘要 marker,不得包含 RoleDefinition / CapabilityDefinition body、method body、evidence body 或评分算法正文。
- role-only、capability-only、evidence correction、source rebind 等 intent variant 留给 `03` 细化,本批只收稳统一写路径。
- accepted result 只保证本仓 summary / snapshot / trace / pending outbox material 成立;publish 不作为 command 成功前置。
- source / evidence resolver 的正式 port、unresolved / unavailable response surface 和字段级 schema 留给 `03` / Step 10。

### 14.7 `GetRoleCapabilitySummary` 处理流

```text
Query: GetRoleCapabilitySummary
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / optional RoleCapabilitySummaryRef / optional ConsistencyHintRef
  |
  v
Role Capability Query Service
  - 读取 GlobalMember 存在性
  - 读取 RoleCapabilitySummary truth / snapshot
  - 读取 RoleCapabilitySourceSnapshot state
  - 可用时读取 MemberSummaryView role capability slice 与 ProjectionState
  |
  v
Visibility / Source State Boundary
  - 应用 VisibilityContextRef 得到 VisibilityResultRef
  - 不可见时返回 not_visible,不得泄露 source definition body 或 evidence body
  - source stale / unavailable 或 projection stale 时返回 stale / degraded marker
  |
  v
RoleCapabilitySummaryResult
```

关键设计点:

- query 不调用 method-library、不刷新 source、不补 evidence、不修复 summary。
- not_found、not_visible、stale、degraded 是正式读取结果口径,不是外部刷新或 repair trigger。
- 不可见或 degraded 时仍不得泄露 RoleDefinition / CapabilityDefinition body、method body、evidence body 或算法说明正文。
- 完整成员摘要、跨字段 redaction、trace / audit 读取在 8-F 展开。

### 14.8 `HandleRoleCapabilitySourceChanged` 处理流

```text
Event: HandleRoleCapabilitySourceChanged
  |
  v
Inbound Event Consumer
  - 校验 event envelope / source event id / dedup key / trace context
  - 接收 RoleCapabilitySourceRef / RoleCapabilitySourceVersionRef / RoleCapabilitySafeSummaryRef / source state marker
  - 接收 optional List<CapabilityEvidenceRef>
  |
  v
Role Capability Application Service
  - 根据 body-free event material 构造 RoleCapabilitySourceSnapshot
  - 查找关联 RoleCapabilitySummary
  - 构造 RoleCapabilitySourcePolicy.for_source_change(RoleCapabilitySummary current_summary, RoleCapabilitySourceSnapshot source_snapshot, IdentityOperationChannel operation_channel)
  |
  v
Domain Object / Policy
  - 调用 RoleCapabilitySourcePolicy.assert_no_forbidden_body(RoleCapabilityChangeMaterial change_material)
  - 调用 RoleCapabilitySourcePolicy.assert_source_or_evidence_present(RoleCapabilitySourceSnapshot snapshot, List<CapabilityEvidenceRef> evidence_refs)
  - 来源可用时更新 RoleCapabilitySourceSnapshot
  - 来源 stale / unavailable / unrecognized 时标记相关 RoleCapabilitySummary stale / unavailable / pending reconciliation
  |
  v
Accepted Source State Material
  - 保存 RoleCapabilitySourceSnapshot state change
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
RoleCapabilitySourceStateChanged result marker
```

关键设计点:

- Consumer 只消费 method-library 已成立的来源变化或状态 marker,不拥有 RoleDefinition / CapabilityDefinition truth。
- 来源事件不得直接把 `RoleCapabilitySummary` 改成 active accepted summary;它只能更新 snapshot state、mark stale / unavailable / pending reconciliation,除非后续 `03` 另行定义严格 accepted source-update flow。
- 缺 source ref、version marker、safe summary marker 或 dedup key 时,后续 Step 10 必须进入 rejected、quarantine、pending review 或 report-only,不得静默更新摘要。
- event material、trace、outbox 都不得携带 definition body、method body、evidence body 或评分算法结果。
- source refresh、stale reconciliation 和重复 source event 的细粒度重试 / quarantine 策略留给 8-G / Step 10 / `03`。

### 14.9 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| source refresh Operations Job | 本批只处理同步 command 和来源事件消费;后台刷新 / 对账属于维护能力 | 8-G `RefreshExternalReferenceState` / `RunIdentityReconciliation` |
| `RoleCapabilitySummaryChanged` publish flow | 本批只创建 accepted outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| `RoleCapabilitySourceStateChanged` publish flow | 本批只创建 source state change outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| role-only / capability-only / evidence correction 细分 flow | 概要层使用统一 `MaintainRoleCapabilitySummary`;具体 intent variant 留给详细设计 | `03` command / state / test contracts |

### 14.10 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `MaintainRoleCapabilitySummary` | `MaintainRoleCapabilitySummary` Command | `GlobalMember`, `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | member / summary repository、method source resolution、evidence reference boundary、trace / outbox material | 不保存 definition / method / evidence body;不自动评分;不等待 publish |
| `GetRoleCapabilitySummary` | `GetRoleCapabilitySummary` Query | `GlobalMember`, `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `MemberSummaryView`, `ProjectionState`, visibility boundary | summary read repository、projection read、visibility / redaction | no-write;不刷新 source;不泄露 forbidden body;stale 不修复 |
| `HandleRoleCapabilitySourceChanged` | `HandleRoleCapabilitySourceChanged` Consumer | `RoleCapabilitySourceSnapshot`, `RoleCapabilitySummary`, `RoleCapabilitySourcePolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | event envelope / dedup、method source boundary、trace / outbox material | 不拥有 method truth;不直接 active accepted summary;不携带 forbidden body |

### 14.11 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | Command、Query 和 Consumer 均有独立处理流;event material 有后移说明 |
| 处理流点名对象是否已在 Step 6 定义 | 通过 | `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、`RoleCapabilitySourcePolicy`、`IdentityTraceRecord`、`IdentityOutboxRecord` 等均可反查 |
| forbidden body 是否闭合 | 通过 | 三条处理流均明确禁止 definition body、method body、evidence body 和评分算法结果 |
| source / evidence guard 是否闭合 | 通过 | command 和 consumer 都必须校验 source / evidence present 与 source usable |
| Query 是否保持 no-write | 通过 | `GetRoleCapabilitySummary` 不刷新 method source、不补 evidence、不修复 summary |
| Consumer 是否只消费外部事实 / marker | 通过 | `HandleRoleCapabilitySourceChanged` 只更新 snapshot / stale marker,不拥有 method truth |
| 是否混入维护 job | 通过 | source refresh / stale reconciliation 后移 8-G |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集或 retry 参数 |

### 14.12 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `MaintainRoleCapabilitySummary` 是角色能力摘要的 P0 写路径。它读取成员与当前摘要,解析或接收 body-free source snapshot,通过 `RoleCapabilitySourcePolicy` 校验 source / evidence、forbidden body 和自动评分边界,然后保存 `RoleCapabilitySummary` / `RoleCapabilitySourceSnapshot` 并生成 trace / pending outbox material。
- `GetRoleCapabilitySummary` 是 role / capability slice 的只读路径。它读取 summary、source snapshot 和可用 projection slice,应用 visibility 后返回 found / not_found / not_visible / stale / degraded,不得刷新 method source 或返回定义 / 证据正文。
- `HandleRoleCapabilitySourceChanged` 是 method-library 来源变化的 Consumer。它只更新 body-free `RoleCapabilitySourceSnapshot` 与相关 stale / unavailable / pending reconciliation marker,不直接把外部事件写成 active summary。
- `RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` 是本批 accepted event material,真正发布、失败重试和可靠性处理在传播与交接处理流中展开。
- 本批不定义 source refresh / stale reconciliation operations job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 14.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 role / capability 写入口统一为 `MaintainRoleCapabilitySummary` | 若不认可,需拆 role-only / capability-only / evidence correction 处理流 | 当前用 intent 表达具体目标,详细 variant 后移 `03` |
| 是否认可 source event 只更新 snapshot / stale marker | 若不认可,需定义外部来源事件直接 accepted summary 的严格 policy | 当前避免外部事件绕过本仓 summary policy |
| 是否认可 evidence 只保存 `CapabilityEvidenceRef` | 若不认可,会破坏 evidence / artifact body ownership | 当前只定义 evidence ref / resolver marker |
| 是否认可 `GetRoleCapabilitySummary` 独立画图 | 若不认可,会弱化 stale / degraded 和 forbidden body redaction 说明 | 当前独立画图 |
| 是否认可 source refresh / stale reconciliation 后移 8-G | 若不认可,需提前定义 maintenance job | 当前后移到派生维护与对账 |

### 14.14 进入 8-D 的条件

进入 8-D “身份生涯记录”前,需要用户确认:

- `MaintainRoleCapabilitySummary`、`GetRoleCapabilitySummary` 和 `HandleRoleCapabilitySourceChanged` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- role / capability summary 与 method-library definition truth 的边界保持分离。
- 无来源 / 无证据声明不 accepted、source stale / unavailable 不静默污染 summary、forbidden body 不入仓已满足本批停审。

---

## 15. 8-D 身份生涯记录处理流

### 15.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-009` | `AppendCareerRecord` 必须能追加成员身份侧生涯记录 |
| `BR-ID-010` | 生涯记录只能追加,不得改写、删除或重排已确认历史 |
| `BR-ID-011` | Project、WorkItem、ProjectMember truth 不得由 identity 反向定义 |
| `BR-ID-014` | 生涯追加必须可追溯到安全可见来源、原因或 actor |
| `NFR-ID-006` | 重复项目参与来源不得产生重复 career history |
| `NFR-ID-007` | 纠错必须以追加形式表达,不得原地覆盖 |
| `VETO-ID-003` | ProjectMember、work item、artifact 等正文不得进入 identity truth / event / report |
| Step 6 `CareerRecord` | identity-owned append-only career history 主语 |
| Step 6 `CareerAppendPolicy` | 来源可信、幂等安全、append-only、work truth 排除 guard |
| Step 6 `MemberSummaryView` | career query 可读取的 projection slice |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted career append fact 的追溯和传播 material |
| Step 7 `AppendCareerRecord` | 本批 career append Command |
| Step 7 `ListCareerRecords` | 本批 career Query |
| Step 7 `HandleWorkParticipationAccepted` | 本批 work participation accepted Consumer |
| Step 7 `CareerRecordAppended` / `CareerCorrectionAppended` | 本批 accepted outbound event material |

### 15.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `AppendCareerRecord` 是 P0 career append 写路径,必须独立画图。 |
| 本批哪些 Query 必须独立画图? | `ListCareerRecords` 含 visibility、cursor、stale / degraded 和 append no-write 口径,必须独立画图。 |
| 本批哪些 Inbound Event Consumer 必须独立画图? | `HandleWorkParticipationAccepted` 会按 work accepted fact 追加或拒绝 career record,必须独立画图。 |
| 本批是否有 Operations Job? | 没有。duplicate source reconciliation、career projection rebuild 和 drift report 后移 8-G。 |
| 本批 outbound event 是否独立画图? | 不独立画 accepted 前置图。`CareerRecordAppended` / `CareerCorrectionAppended` 是 accepted outbox material,发布处理流后移 8-H。 |

### 15.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| career 被写成可修改履历 | update / delete / reorder 既有 `CareerRecord` | command / consumer flow 只允许 append 或 correction append |
| work truth 复制进 identity | 保存 Project、WorkItem、ProjectMember body 或任务正文 | 所有 flow 只允许 `ProjectParticipationRef`、`WorkSourceRef`、safe summary marker 和 source marker |
| 重复来源生成重复历史 | 重放同一 work participation event 新增多条 career record | command / consumer 必须使用 `CareerSourceMarkerRef` 与 idempotency / dedup |
| 纠错覆盖原记录 | 修正旧经历时直接修改旧 record | correction 只能创建新的 `CareerRecord`,旧记录最多通过追加关系解释 |
| maintenance 静默追加 | 对账任务发现 work source 后直接追加 career truth | 本批不定义 career job;对账只报告或触发正式入口 |

### 15.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 拆分 append command 和 correction command | 不采用为概要处理流主线 | 二者共享 source trust、append-only、dedup 和 work truth 排除边界;具体 intent variant 留给 `03` |
| 用 `AppendCareerRecord` 统一追加和纠错追加 | 采用 | 能集中承接 source marker、reason、actor、idempotency 和 append-only guard |
| work event 直接写入 ProjectMember / 项目事实摘要 | 不采用 | identity 只追加身份侧 career history,work truth 仍归 `L1-work` |
| `ListCareerRecords` 只走通用读路径 | 不采用 | 它需要表达 visibility、cursor、stale / degraded 和 forbidden work body redaction |
| 在本批定义 work resolver / event schema 详细 port | 不采用 | 本批只写 work participation boundary,正式 port / schema 后移 `03` |

### 15.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `AppendCareerRecord` | Command | 是 | P0 career append 写路径,新增 `CareerRecord` 或 correction record 并产生 trace / outbox material |
| `ListCareerRecords` | Query | 是 | career 读取包含 visibility、cursor、stale / degraded 和 work body redaction |
| `HandleWorkParticipationAccepted` | Inbound Event Consumer | 是 | 消费 work accepted fact,会追加 career record 或返回 duplicate / rejected / pending marker |
| `CareerRecordAppended` | Outbound Event material | 否 | 来自 command / consumer accepted result,发布机制后移 8-H |
| `CareerCorrectionAppended` | Outbound Event material | 否 | 来自 correction append accepted result,发布机制后移 8-H |
| career maintenance job | Operations Job | 不适用 | 本批明确不定义,后移 8-G |

### 15.6 `AppendCareerRecord` 处理流

```text
Command: AppendCareerRecord
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberRef / CareerAppendIntent / ProjectParticipationRef / WorkSourceRef
  - 接收 CareerSourceMarkerRef / CareerSafeSummaryRef / CareerAppendReasonRef / optional CareerRecordRef original_record_ref
  |
  v
Career Application Service
  - 读取 GlobalMember 与已有 CareerRecord source marker
  - 识别普通追加或 correction append intent
  - 构造 CareerAppendPolicy.for_append(...) 或 CareerAppendPolicy.for_correction(...)
  |
  v
Domain Object / Policy
  - 调用 CareerAppendPolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 CareerAppendPolicy.assert_source_trusted(ProjectParticipationRef project_participation_ref, WorkSourceRef work_source_ref)
  - 调用 CareerAppendPolicy.assert_not_duplicate(CareerSourceMarkerRef source_marker_ref, List<CareerRecordRef> existing_records)
  - 调用 CareerAppendPolicy.assert_append_only(CareerRecordChangeIntent change_intent)
  - 调用 CareerAppendPolicy.assert_not_work_truth_write(CareerAppendMaterial append_material)
  - 调用 CareerRecord.append_from_work_source(...) 或 CareerRecord.correction_for_record(...)
  |
  v
Accepted Truth Material
  - 追加新的 CareerRecord
  - 必要时建立 correction append 关系,不修改旧记录正文
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
CareerCommandResult
```

关键设计点:

- append-only 是本流核心不变量;任何 update / delete / reorder 旧记录的 intent 都必须 rejected。
- `CareerSourceMarkerRef` 是重复来源和重放安全的概要判定输入,正式唯一约束和 repository 查询面留给 `03`。
- correction append 只能追加新 `CareerRecord`,不能覆盖、删除或重排 original record。
- command material、trace、outbox 和 result 都不得携带 Project、WorkItem、ProjectMember body、任务正文或 artifact body。
- accepted result 只保证 career truth / trace / pending outbox material 成立;publish 不作为 command 成功前置。

### 15.7 `ListCareerRecords` 处理流

```text
Query: ListCareerRecords
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / optional CareerCursorRef / optional CareerRecordFilterRef / optional ConsistencyHintRef
  |
  v
Career Query Service
  - 读取 GlobalMember 存在性
  - 读取 CareerRecord append history
  - 可用时读取 MemberSummaryView career slice 与 ProjectionState
  |
  v
Visibility / Cursor Boundary
  - 应用 VisibilityContextRef 得到 VisibilityResultRef
  - 按 cursor / filter 返回可见 CareerSafeSummaryRef 列表
  - 不可见时返回 not_visible,不得泄露 Project / WorkItem / ProjectMember body
  - projection stale / unavailable 时返回 stale 或 degraded marker
  |
  v
CareerRecordListResult
```

关键设计点:

- query 不追加 career record、不纠错、不调用 work source、不修复 duplicate marker。
- empty、not_found、not_visible、stale、degraded 都是正式读取结果口径,不是 append 或 repair trigger。
- cursor / filter 是读取控制面,不得反向改变 career history 顺序或状态。
- 完整成员摘要、跨字段 redaction、trace / audit 读取在 8-F 展开。

### 15.8 `HandleWorkParticipationAccepted` 处理流

```text
Event: HandleWorkParticipationAccepted
  |
  v
Inbound Event Consumer
  - 校验 event envelope / source event id / dedup key / trace context
  - 接收 GlobalMemberRef / ProjectParticipationRef / WorkSourceRef / CareerSourceMarkerRef
  - 接收 CareerSafeSummaryRef / optional CareerAppendReasonRef
  |
  v
Career Application Service
  - 读取 GlobalMember 与已有 CareerRecord source marker
  - 将 work accepted fact 映射为 body-free career append candidate
  - 构造 CareerAppendPolicy.for_append(...)
  |
  v
Domain Object / Policy
  - 调用 CareerAppendPolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 CareerAppendPolicy.assert_source_trusted(ProjectParticipationRef project_participation_ref, WorkSourceRef work_source_ref)
  - 调用 CareerAppendPolicy.assert_not_duplicate(CareerSourceMarkerRef source_marker_ref, List<CareerRecordRef> existing_records)
  - 调用 CareerAppendPolicy.assert_append_only(CareerRecordChangeIntent change_intent)
  - 调用 CareerAppendPolicy.assert_not_work_truth_write(CareerAppendMaterial append_material)
  - 调用 CareerRecord.append_from_work_source(...)
  |
  v
Accepted / Duplicate / Pending Material
  - accepted 时追加新的 CareerRecord
  - duplicate 时返回 no new history marker
  - unresolved / untrusted 时进入 rejected / pending review / report-only marker
  - accepted 时创建 IdentityTraceRecord 与 IdentityOutboxRecord
  - 标记相关 MemberSummaryView stale
  |
  v
Career source event handling result
```

关键设计点:

- Consumer 消费的是 `L1-work` 已成立项目参与事实,但不拥有 Project、WorkItem 或 ProjectMember truth。
- 缺 `GlobalMemberRef`、source marker、safe summary marker、event id 或 dedup key 时,后续 Step 10 必须进入 rejected、quarantine、pending review 或 report-only,不得自行从项目私有字段推导成员身份。
- duplicate source 不新增重复 career history;是否回放 stored result 或返回 duplicate marker 留给 `03`。
- work event material、trace、outbox 都不得携带 Project / WorkItem / ProjectMember body 或 artifact body。
- Consumer accepted append 与 command append 共享 append-only 和 source marker 语义,但不反写 work truth。

### 15.9 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| career maintenance job | 本批不允许后台任务直接追加或修复 career truth | 8-G `RunIdentityReconciliation` / projection rebuild |
| `CareerRecordAppended` publish flow | 本批只创建 accepted outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| `CareerCorrectionAppended` publish flow | 本批只创建 correction append outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| append / correction / conflict intent 细分 flow | 概要层使用统一 `AppendCareerRecord`;具体 variant 留给详细设计 | `03` command / state / test contracts |

### 15.10 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `AppendCareerRecord` | `AppendCareerRecord` Command | `GlobalMember`, `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | member / career repository、work participation source boundary、trace / outbox material | append-only;不保存 work body;不等待 publish |
| `ListCareerRecords` | `ListCareerRecords` Query | `GlobalMember`, `CareerRecord`, `MemberSummaryView`, `ProjectionState`, visibility boundary | career read repository、projection read、visibility / cursor boundary | no-write;不调用 work source;不泄露 work body;stale 不修复 |
| `HandleWorkParticipationAccepted` | `HandleWorkParticipationAccepted` Consumer | `GlobalMember`, `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | event envelope / dedup、work participation boundary、source marker lookup、trace / outbox material | 不拥有 work truth;duplicate 不新增 history;不携带 work body |

### 15.11 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | Command、Query 和 Consumer 均有独立处理流;event material 有后移说明 |
| 处理流点名对象是否已在 Step 6 定义 | 通过 | `CareerRecord`、`CareerAppendPolicy`、`IdentityTraceRecord`、`IdentityOutboxRecord` 等均可反查 |
| append-only 是否闭合 | 通过 | command 和 consumer 都明确禁止 update / delete / reorder,纠错只能追加 |
| duplicate source 是否闭合 | 通过 | 两条写路径都要求 `CareerSourceMarkerRef` / dedup |
| work truth 边界是否闭合 | 通过 | 三条处理流均禁止 Project / WorkItem / ProjectMember body 入仓 |
| Query 是否保持 no-write | 通过 | `ListCareerRecords` 不追加、不纠错、不调用 work source、不修复 projection |
| 是否混入维护 job | 通过 | duplicate reconciliation 和 projection rebuild 后移 8-G |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集或 retry 参数 |

### 15.12 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `AppendCareerRecord` 是身份生涯记录的 P0 写路径。它读取成员与已有 source marker,通过 `CareerAppendPolicy` 校验 work 来源可信、重复来源、append-only 和 work truth 排除后,追加新的 `CareerRecord` 或 correction record,并生成 trace / pending outbox material。
- `ListCareerRecords` 是 career slice 的只读路径。它读取 career append history 和可用 projection slice,应用 visibility / cursor 后返回 found / empty / not_found / not_visible / stale / degraded,不得追加、纠错或调用 work source。
- `HandleWorkParticipationAccepted` 是 work 项目参与来源的 Consumer。它只消费 body-free work accepted fact refs / marker,通过同一 append policy 后追加 career record 或返回 duplicate / rejected / pending marker,不反写 work truth。
- `CareerRecordAppended` / `CareerCorrectionAppended` 是本批 accepted event material,真正发布、失败重试和可靠性处理在传播与交接处理流中展开。
- 本批不定义 career maintenance operations job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 15.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可普通追加和纠错追加统一为 `AppendCareerRecord` | 若不认可,需拆 append / correction 处理流 | 当前用 intent / optional original record ref 表达具体目标,详细 variant 后移 `03` |
| 是否认可 work participation event 可以触发 accepted career append | 若不认可,需改为 pending review / command-only 模式 | 当前允许 policy 通过时追加,但不保存 work body |
| 是否认可 duplicate source 以 `CareerSourceMarkerRef` / dedup key 闭合 | 若不认可,后续实现会缺少幂等判定来源 | 当前把 source marker 作为 command / event 必填骨架 |
| 是否认可 `ListCareerRecords` 独立画图 | 若不认可,会弱化 visibility / cursor / work body redaction 说明 | 当前独立画图 |
| 是否认可 career maintenance job 后移 8-G | 若不认可,需提前定义 duplicate reconciliation / projection rebuild | 当前后移到派生维护与对账 |

### 15.14 进入 8-E 的条件

进入 8-E “记忆引用关系”前,需要用户确认:

- `AppendCareerRecord`、`ListCareerRecords` 和 `HandleWorkParticipationAccepted` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- career history 保持 append-only,纠错仍通过追加表达。
- Project / WorkItem / ProjectMember truth 不进入 identity,重复来源不新增重复 history 的口径已满足本批停审。

---

## 16. 8-E 记忆引用关系处理流

### 16.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-010` | `MaintainMemoryReference` 必须能维护成员相关 memory / archive refs |
| `FR-ID-011` | `HandleArchiveHandoffResult` 必须能记录迁移 / 冷存协作状态 |
| `BR-ID-012` / `VETO-ID-003` | identity 不保存 memory 原文、向量、artifact body、conversation body、runtime body 或 archive package |
| `BR-ID-014` | memory ref 变化必须可追溯到安全可见来源、原因或 actor |
| `NFR-ID-004` | 禁止保存外部正文、credential、token、raw secret |
| `OQ-ID-003` / `R-ID-003` | memory refs 的承载方、handoff target、migration result surface 后移 `03/04` |
| Step 6 `MemoryReference` | 成员与外部 memory / archive refs 的身份侧关系主语 |
| Step 6 `MemoryReferenceState` | pending、linked、stale、unavailable、migrated、archived、handoff failed 等状态主语 |
| Step 6 `MemoryReferencePolicy` | member existence、source trust、body-free、handoff marker guard |
| Step 6 `MemberSummaryView` | memory reference query 可读取的 projection slice |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted memory reference fact / handoff state change 的追溯和传播 material |
| Step 7 `MaintainMemoryReference` | 本批 memory reference Command |
| Step 7 `ListMemoryReferences` | 本批 memory reference Query |
| Step 7 `HandleMemoryReferenceSourceStateChanged` | 本批 memory / archive source state Consumer |
| Step 7 `HandleArchiveHandoffResult` | 本批 archive / memory handoff result Consumer |
| Step 7 `MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` | 本批 accepted outbound event material |

### 16.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `MaintainMemoryReference` 是 P0 memory ref relation / state 写路径,必须独立画图。 |
| 本批哪些 Query 必须独立画图? | `ListMemoryReferences` 含 visibility、cursor、stale / degraded 和 external carrier redaction,必须独立画图。 |
| 本批哪些 Inbound Event Consumer 必须独立画图? | `HandleMemoryReferenceSourceStateChanged` 与 `HandleArchiveHandoffResult` 都会改写本地 `MemoryReferenceState`,必须独立画图。 |
| 本批是否有 Operations Job? | 没有。reference refresh、reconciliation、handoff follow-up 和 retry 后移 8-G / 8-H。 |
| 本批 outbound event 是否独立画图? | 不独立画 accepted 前置图。`MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` 是 accepted outbox material,发布处理流后移 8-H。 |

### 16.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 保存 memory body / embedding / index | Command、Consumer、Query 或 event material 携带原文、向量、检索索引 | 所有 flow 只允许 refs、safe summary marker、state marker 和 body-free source refs |
| 保存 archive package / receipt body | handoff result 把 package metadata、归档包体或完整 receipt 写入 identity | `HandleArchiveHandoffResult` 只接受 `ArchiveRef`、`ArchiveHandoffRef` 和 result marker |
| 外部 carrier 状态机复制进 identity | 直接建完整 memory / archive owner 状态 | `MemoryReferenceState` 只表达身份侧引用状态,不拥有外部 carrier truth |
| Query 触发外部刷新 | 读取 memory refs 时调用 memory / archive adapter 修复状态 | query flow 只读本地 relation / projection slice,refresh 后移 8-G |
| Handoff pending 伪装成功 | intent 或 callback 不完整时直接标记 archived / migrated | consumer flow 必须区分 pending、failed、migrated、archived,不得伪造 completed |

### 16.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 拆分 link memory、attach archive、update state 多个 Command | 不采用为概要处理流主线 | 它们共享 member/source/body-free/trace/outbox 边界;具体 intent variant 留给 `03` |
| 用 `MaintainMemoryReference` 统一同步维护入口 | 采用 | 能集中承接 memory / archive refs、source、reason、actor、幂等和 forbidden body guard |
| 将 archive handoff result 写成 Command | 不采用 | 外部 handoff 结果更适合作为 Inbound Event / callback,但仍受本仓 policy 校验 |
| `ListMemoryReferences` 只走通用读路径 | 不采用 | 它需要表达 visibility、cursor、stale / degraded、carrier state redaction 和 forbidden body 排除 |
| 在本批固定 handoff target / receipt schema | 不采用 | 上游已后移 `OQ-ID-003`;概要层只保留 refs / marker 和 `03/04` 承接 |

### 16.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `MaintainMemoryReference` | Command | 是 | P0 memory ref relation / state 写路径,改写 `MemoryReference` / `MemoryReferenceState` 并产生 trace / outbox material |
| `ListMemoryReferences` | Query | 是 | memory ref 读取包含 visibility、cursor、stale / degraded 和 carrier body redaction |
| `HandleMemoryReferenceSourceStateChanged` | Inbound Event Consumer | 是 | 消费 memory / archive carrier source state,更新本地 reference state |
| `HandleArchiveHandoffResult` | Inbound Event Consumer | 是 | 消费 archive / memory handoff result marker,更新 migration / archived / failed state |
| `MemoryReferenceChanged` | Outbound Event material | 否 | 来自 command / source state accepted result,发布机制后移 8-H |
| `MemoryArchiveHandoffStateChanged` | Outbound Event material | 否 | 来自 handoff result accepted marker,发布机制后移 8-H |
| reference refresh / reconciliation / handoff follow-up job | Operations Job | 不适用 | 本批明确不定义,后移 8-G / 8-H |

### 16.6 `MaintainMemoryReference` 处理流

```text
Command: MaintainMemoryReference
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberRef / MemoryReferenceChangeIntent / optional MemoryReferenceRef
  - 接收 optional MemoryRef / optional ArchiveRef / optional ArchiveHandoffRef
  - 接收 MemoryReferenceSourceRef / MemoryReferenceReasonRef
  |
  v
Memory Reference Application Service
  - 读取 GlobalMember 与当前 MemoryReference / MemoryReferenceState
  - 识别 link memory / attach archive / mark stale / record migration 等 intent
  - 构造 MemoryReferencePolicy.for_link(...) 或 MemoryReferencePolicy.for_archive_handoff(...)
  |
  v
Domain Object / Policy
  - 调用 MemoryReferencePolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 MemoryReferencePolicy.assert_reference_present(Option<MemoryRef> memory_ref, Option<ArchiveRef> archive_ref)
  - 调用 MemoryReferencePolicy.assert_source_trusted(MemoryReferenceSourceRef source_ref)
  - 调用 MemoryReferencePolicy.assert_body_free(MemoryReferenceChangeMaterial change_material)
  - 调用 MemoryReferencePolicy.assert_handoff_marker_body_free(ArchiveHandoffRef archive_handoff_ref)
  - 调用 MemoryReferencePolicy.assert_not_external_owner_write(MemoryReferenceChangeMaterial change_material)
  - 创建或更新 MemoryReference 与 MemoryReferenceState
  |
  v
Accepted Truth Material
  - 保存 MemoryReference relation 与 body-free state / marker
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
MemoryReferenceCommandResult
```

关键设计点:

- memory / archive relation 写入必须依附已建立成员、正式来源和至少一个 body-free external ref。
- command material、trace、outbox 和 result 都不得携带 memory body、embedding、index、artifact body、conversation body、runtime body、archive package 或 receipt body。
- `ArchiveHandoffRef` 只是 handoff marker,不能承载 package 或完整 receipt。
- link memory、attach archive、mark stale / unavailable、record migration 等 intent variant 留给 `03` 细化。
- accepted result 只保证 reference truth / trace / pending outbox material 成立;publish、follow-up 和 retry 不作为 command 成功前置。

### 16.7 `ListMemoryReferences` 处理流

```text
Query: ListMemoryReferences
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / optional MemoryReferenceCursorRef / optional MemoryReferenceFilterRef / optional ConsistencyHintRef
  |
  v
Memory Reference Query Service
  - 读取 GlobalMember 存在性
  - 读取 MemoryReference relation 与 MemoryReferenceState
  - 可用时读取 MemberSummaryView memory reference slice 与 ProjectionState
  |
  v
Visibility / Cursor Boundary
  - 应用 VisibilityContextRef 得到 VisibilityResultRef
  - 按 cursor / filter 返回可见 MemoryReferenceSummaryRef 列表
  - 不可见时返回 not_visible,不得泄露 external carrier 内部状态或正文
  - projection / reference stale 或 unavailable 时返回 stale / degraded marker
  |
  v
MemoryReferenceListResult
```

关键设计点:

- query 不刷新外部 memory / archive、不调用 adapter、不修复 `MemoryReferenceState`。
- empty、not_found、not_visible、stale、degraded 都是正式读取结果口径,不是 refresh 或 repair trigger。
- 不可见或 degraded 时不得泄露 memory 原文、embedding、index、archive package、receipt body 或 carrier 内部状态。
- 完整成员摘要、跨字段 redaction、trace / audit 读取在 8-F 展开。

### 16.8 `HandleMemoryReferenceSourceStateChanged` 处理流

```text
Event: HandleMemoryReferenceSourceStateChanged
  |
  v
Inbound Event Consumer
  - 校验 event envelope / source event id / dedup key / trace context
  - 接收 GlobalMemberRef / MemoryReferenceRef / MemoryReferenceSourceRef
  - 接收 optional MemoryRef / optional ArchiveRef / MemoryReferenceStateKind / safe state marker
  |
  v
Memory Reference Application Service
  - 读取 GlobalMember 与当前 MemoryReference
  - 将 source state event 映射为 body-free MemoryReferenceState
  - 构造 MemoryReferencePolicy.for_refresh(...)
  |
  v
Domain Object / Policy
  - 调用 MemoryReferencePolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 MemoryReferencePolicy.assert_source_trusted(MemoryReferenceSourceRef source_ref)
  - 调用 MemoryReferencePolicy.assert_body_free(MemoryReferenceChangeMaterial change_material)
  - 调用 MemoryReferencePolicy.assert_not_external_owner_write(MemoryReferenceChangeMaterial change_material)
  - 将 MemoryReferenceState 更新为 linked / stale / unavailable / pending verification
  |
  v
Accepted Source State Material
  - 保存 MemoryReferenceState state change
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
MemoryReference source state handling result
```

关键设计点:

- Consumer 只消费外部 carrier 的 source state marker,不拥有 memory / archive carrier truth。
- source event 缺 typed ref、source ref、state marker、event id 或 dedup key 时,后续 Step 10 必须进入 rejected、quarantine、pending review 或 report-only。
- stale / unavailable 不触发本流自动刷新外部 carrier;refresh job 后移 8-G。
- event material、trace、outbox 都不得携带 memory body、embedding、index、archive package 或 carrier 内部正文。

### 16.9 `HandleArchiveHandoffResult` 处理流

```text
Event: HandleArchiveHandoffResult
  |
  v
Inbound Event Consumer
  - 校验 event envelope / source event id / dedup key / trace context
  - 接收 GlobalMemberRef / optional MemoryReferenceRef / ArchiveRef / ArchiveHandoffRef
  - 接收 handoff result marker / MemoryReferenceReasonRef
  |
  v
Memory Reference Application Service
  - 读取 GlobalMember 与当前 MemoryReference
  - 将 handoff result marker 映射为 MemoryReferenceState 候选
  - 构造 MemoryReferencePolicy.for_archive_handoff(...)
  |
  v
Domain Object / Policy
  - 调用 MemoryReferencePolicy.assert_member_exists(GlobalMemberRef member_ref)
  - 调用 MemoryReferencePolicy.assert_reference_present(Option<MemoryRef> memory_ref, Option<ArchiveRef> archive_ref)
  - 调用 MemoryReferencePolicy.assert_handoff_marker_body_free(ArchiveHandoffRef archive_handoff_ref)
  - 调用 MemoryReferencePolicy.assert_body_free(MemoryReferenceChangeMaterial change_material)
  - 按 marker 更新 MemoryReferenceState 为 migrated / archived / handoff pending / handoff failed
  |
  v
Accepted Handoff State Material
  - 保存 MemoryReferenceState handoff result marker
  - 创建 IdentityTraceRecord.from_accepted_change(...)
  - 创建 IdentityOutboxRecord.from_accepted_change(...)
  - 标记相关 MemberSummaryView stale
  |
  v
MemoryArchiveHandoffStateChanged result marker
```

关键设计点:

- delivered / migrated / archived 只能来自正式 result marker,不能由 intent 创建、请求发送或缺字段 callback 推断。
- `HandoffPending`、`HandoffFailed`、`Migrated`、`Archived` 必须显式区分,不得把 pending / failed 伪造成完成。
- 本流不定义完整 receipt schema、handoff target schema、archive package metadata 或 retry 参数,这些后移 `03/04` 和 8-H。
- 缺 intent / target / attempt / result marker 时,后续 Step 10 必须进入 rejected、quarantine、pending review 或 report-only,不得自行拼接 receipt 或 target。
- event material、trace、outbox 都不得携带 receipt body、archive package、package metadata、memory body 或 artifact body。

### 16.10 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| reference refresh job | 本批只处理同步 command 和来源 / handoff event;后台刷新属于维护能力 | 8-G `RefreshExternalReferenceState` |
| memory / archive reconciliation job | 对账只能 report-only,不得在本批直接修复引用 truth | 8-G `RunIdentityReconciliation` |
| handoff follow-up / retry job | 交付、重试和失败恢复属于传播 / 交接能力 | 8-H `DeliverTraceHandoff` / `RetryIdentityPropagationFailures` |
| `MemoryReferenceChanged` publish flow | 本批只创建 accepted outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| `MemoryArchiveHandoffStateChanged` publish flow | 本批只创建 handoff state change outbox material,不执行发布 | 8-H `PublishIdentityOutbox` |
| handoff target / receipt / package schema | 概要层只允许 refs / marker,不提前关闭 `OQ-ID-003` | `03/04` |

### 16.11 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `MaintainMemoryReference` | `MaintainMemoryReference` Command | `GlobalMember`, `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | member / memory reference repository、memory / archive source boundary、trace / outbox material | 不保存 memory / archive body;不写 external owner truth;不等待 publish |
| `ListMemoryReferences` | `ListMemoryReferences` Query | `GlobalMember`, `MemoryReference`, `MemoryReferenceState`, `MemberSummaryView`, `ProjectionState`, visibility boundary | memory reference read repository、projection read、visibility / cursor boundary | no-write;不刷新 external carrier;不泄露 carrier body;stale 不修复 |
| `HandleMemoryReferenceSourceStateChanged` | `HandleMemoryReferenceSourceStateChanged` Consumer | `GlobalMember`, `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | event envelope / dedup、memory / archive source boundary、trace / outbox material | 不拥有 carrier truth;不携带 memory body;stale / unavailable 不自动修复 |
| `HandleArchiveHandoffResult` | `HandleArchiveHandoffResult` Consumer | `GlobalMember`, `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord`, `MemberSummaryView` | event envelope / dedup、archive handoff boundary、trace / outbox material | 不保存 receipt body / package;不伪造 delivered;不反写 archive owner truth |

### 16.12 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | Command、Query 和两个 Consumer 均有独立处理流;event material 有后移说明 |
| 处理流点名对象是否已在 Step 6 定义 | 通过 | `MemoryReference`、`MemoryReferenceState`、`MemoryReferencePolicy`、`IdentityTraceRecord`、`IdentityOutboxRecord` 等均可反查 |
| forbidden body 是否闭合 | 通过 | 四条处理流均明确禁止 memory body、embedding、index、artifact body、conversation body、runtime body、archive package 和 receipt body |
| Handoff 不伪成功是否闭合 | 通过 | handoff result flow 区分 pending / failed / migrated / archived,不由 intent 或缺字段 callback 推断成功 |
| Query 是否保持 no-write | 通过 | `ListMemoryReferences` 不刷新 external carrier、不修复 reference state |
| Consumer 是否只消费外部事实 / marker | 通过 | 两个 Consumer 都只消费 refs / state marker / result marker,不拥有 carrier truth |
| 是否混入维护 / follow-up job | 通过 | refresh / reconciliation 后移 8-G,handoff delivery / retry 后移 8-H |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集、retry 参数或 receipt schema |

### 16.13 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `MaintainMemoryReference` 是记忆引用关系的 P0 写路径。它读取成员和当前引用关系,通过 `MemoryReferencePolicy` 校验 member、external refs、source、body-free 和 external owner 边界后,保存 `MemoryReference` / `MemoryReferenceState` 并生成 trace / pending outbox material。
- `ListMemoryReferences` 是 memory reference slice 的只读路径。它读取本地 relation / state 和可用 projection slice,应用 visibility / cursor 后返回 found / empty / not_found / not_visible / stale / degraded,不得刷新外部 memory / archive 或返回正文。
- `HandleMemoryReferenceSourceStateChanged` 是 memory / archive carrier source state 的 Consumer。它只消费 refs / marker,更新本地 `MemoryReferenceState` 为 linked / stale / unavailable / pending verification 等,不拥有 carrier truth。
- `HandleArchiveHandoffResult` 是 archive / memory handoff result 的 Consumer。它只保存 handoff result marker 和状态,明确区分 migrated / archived / pending / failed,不保存 receipt body 或 archive package。
- `MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` 是本批 accepted event material,真正发布、失败重试和可靠性处理在传播与交接处理流中展开。
- 本批不定义 reference refresh、reconciliation 或 handoff follow-up job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 16.14 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 memory / archive 同步维护统一为 `MaintainMemoryReference` | 若不认可,需拆 link memory / attach archive / update state 处理流 | 当前用 intent 表达具体维护目标,详细 variant 后移 `03` |
| 是否认可 archive handoff result 用 Inbound Event Consumer 承接 | 若不认可,需改为 command-only 或 job-only 模式 | 当前按外部 callback / event 处理,但仍经本仓 policy |
| 是否认可本 Step 不固定 handoff target / receipt schema | 若不认可,会提前关闭 `OQ-ID-003` | 当前只保留 refs / marker,完整 surface 后移 `03/04` |
| 是否认可 `ListMemoryReferences` 独立画图 | 若不认可,会弱化 external carrier body redaction 和 stale / degraded 说明 | 当前独立画图 |
| 是否认可 reference refresh / reconciliation / handoff follow-up 后移 | 若不认可,需提前定义 maintenance / propagation jobs | 当前后移到 8-G / 8-H |

### 16.15 进入 8-F 的条件

进入 8-F “身份事实消费与追溯”前,需要用户确认:

- `MaintainMemoryReference`、`ListMemoryReferences`、`HandleMemoryReferenceSourceStateChanged` 和 `HandleArchiveHandoffResult` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- memory / archive 只保存 refs、state 和 marker,不保存正文、embedding、index、archive package 或 receipt body。
- handoff pending / failed / migrated / archived 状态不被伪造成成功的口径已满足本批停审。

---

## 17. 8-F 身份事实消费与追溯处理流

### 17.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | `ReadMemberSummary` 必须让相邻仓通过正式边界消费成员身份事实 |
| `FR-ID-013` | `ReadIdentityTrace` / `ReadAuditTrail` 必须支持身份变化追溯 |
| `BR-ID-013` | 消费方只能读 / 订阅 / 展示身份事实,不得反写 identity truth |
| `BR-ID-014` | trace / audit 必须保留安全可见原因、来源、actor、basis 或 marker |
| `OQ-ID-004` | 字段级 visibility / privacy 裁剪后移 `03`,本批只定义概要 visibility 边界 |
| Step 6 `MemberSummaryView` | 成员身份事实消费 read model |
| Step 6 `IdentityTraceRecord` | accepted identity fact 变化追溯 material |
| Step 6 `AuditTrail` | 可审计时间线读取 aggregate |
| Step 6 `VisibilityPolicy` | summary / trace / audit 读取的 visibility guard |
| Step 6 `ProjectionState` | summary / trace 读取可能返回 stale / degraded 的 freshness marker |
| Step 7 `ReadMemberSummary` | 本批成员摘要 Query |
| Step 7 `ReadIdentityTrace` | 本批 trace Query |
| Step 7 `ReadAuditTrail` | 本批 audit Query |

### 17.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 不需要。消费与追溯读取不得创建、修复、刷新或改写 identity truth。 |
| 本批哪些 Query 必须独立画图? | `ReadMemberSummary`、`ReadIdentityTrace`、`ReadAuditTrail` 均包含 visibility / redaction、stale / degraded 或 trace / audit 边界,必须独立画图。 |
| 本批是否需要 Inbound Event Consumer? | 不需要。消费追溯不接收外部事实,只读取本仓 accepted facts / trace / projection。 |
| 本批是否需要 Outbound Event? | 不需要。Query response 不替代 outbound event material。 |
| 本批是否需要 Operations Job? | 不需要。projection rebuild、trace projection refresh、reference refresh 和 reconciliation 留给 8-G。 |

### 17.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| Query 反向写 truth | 读取 not_found / stale 时自动创建成员、刷新来源或修复 projection | 三条 Query 均明确 no-write,只返回 not_found / not_visible / stale / degraded |
| visibility 被绕过 | trace、audit、diagnostic 或 degraded response 输出不可见字段 | 三条 Query 都必须经 `VisibilityPolicy` / visibility boundary |
| 外部正文泄漏 | summary / trace / audit 返回 method body、work body、memory body、artifact body 或 archive package | 输出只使用 safe summary refs、trace refs、markers 和 redaction result |
| trace 被当成第二 truth | 通过 trace / audit 推导并覆盖业务状态 | trace / audit 只读,不替代 `GlobalMember`、lifecycle、role、career、memory truth |
| 读取触发维护任务 | Query 发现 stale 后直接运行 rebuild / refresh | 本批 Query 只暴露 stale / degraded marker,维护留给 8-G |

### 17.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把前面各批 slice query 全部合并成 `ReadMemberSummary` | 不完全采用 | `ReadMemberSummary` 是统一消费入口,但前序 slice query 仍保留为专项读取 |
| 为 trace / audit 分别定义 Query | 采用 | `FR-ID-013` 同时需要变化追溯和审计时间线读取 |
| 在 Query 内触发 projection rebuild | 不采用 | 会混淆 Query 与 Operations Job,违反 no-write |
| 在本批定义字段级 redaction schema | 不采用 | `OQ-ID-004` 后移 `03`;本批只定义 visibility context / result marker |
| 把 query response 当 outbound event payload | 不采用 | Query response 是同步读取面,event material 和 publish flow 留给 8-H |

### 17.5 处理流覆盖清单

| 接口 | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `ReadMemberSummary` | Query | 是 | 成员摘要读取包含 visibility、projection freshness、not_visible、stale / degraded 和 forbidden body redaction |
| `ReadIdentityTrace` | Query | 是 | trace 读取包含 visibility / redaction、subject / change kind filter、append-only trace 不作第二 truth |
| `ReadAuditTrail` | Query | 是 | audit 读取包含 scope / cursor、visibility、trace refs 组装和不修复缺失 trace |
| consumption Command | Command | 不适用 | 本批明确不定义 |
| consumption Consumer | Inbound Event Consumer | 不适用 | 本批明确不定义 |
| consumption Event | Outbound Event | 不适用 | 本批明确不新增 |
| consumption Job | Operations Job | 不适用 | 本批明确不定义 |

### 17.6 `ReadMemberSummary` 处理流

```text
Query: ReadMemberSummary
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / optional ConsumerRef / optional ConsistencyHintRef
  |
  v
Identity Consumption Query Service
  - 读取 GlobalMember 存在性
  - 读取 MemberSummaryView 与 ProjectionState
  - 必要时读取各 truth summary / projection slice 的 safe refs
  - 构造 VisibilityPolicy.for_consumer(...)
  |
  v
Visibility / Projection Boundary
  - 调用 VisibilityPolicy.assert_can_read_summary(ConsumerRef consumer_ref, GlobalMemberRef member_ref, VisibilityContextRef visibility_context_ref)
  - 调用 VisibilityPolicy.redact_summary(MemberSummaryView summary_view, VisibilityContextRef visibility_context_ref)
  - projection stale / unavailable 时返回 stale 或 degraded marker
  - 不可见时返回 not_visible,不得泄露不可见字段或外部正文
  |
  v
MemberSummaryResult
```

关键设计点:

- query 不创建 member、不刷新 source、不重建 projection、不修复 truth。
- `MemberSummaryView` 只能输出 safe summary refs / markers,不得输出 method、work、memory、artifact、conversation、archive package 或 runtime body。
- stale / degraded 表达 freshness 或 visibility 降级,不能被伪装成 fresh。
- 字段级 redaction schema、consumer DTO 和 fallback 优先级留给 `03` / Step 10。

### 17.7 `ReadIdentityTrace` 处理流

```text
Query: ReadIdentityTrace
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / optional IdentityTraceSubjectRef / optional IdentityChangeKindRef / optional TraceCursorRef
  |
  v
Identity Trace Query Service
  - 读取 IdentityTraceRecord append history
  - 按 subject / change kind / cursor 过滤 trace refs
  - 构造 VisibilityPolicy.for_consumer(...)
  |
  v
Trace Visibility Boundary
  - 调用 VisibilityPolicy.assert_can_read_trace(ConsumerRef consumer_ref, IdentityTraceSubjectRef subject_ref, VisibilityContextRef visibility_context_ref)
  - 调用 VisibilityPolicy.redact_trace(IdentityTraceRecord trace_record, VisibilityContextRef visibility_context_ref)
  - 不可见 reason / source / basis / actor marker 必须裁剪
  |
  v
IdentityTraceResult
```

关键设计点:

- trace 是 accepted change 的追溯 material,不是 `GlobalMember`、lifecycle、role、career、memory truth 的替代来源。
- trace query 不追加、修改、删除或纠错 trace;纠错只能通过后续正式 append trace 语义表达。
- `TraceCursorRef` 是读取分页 marker,不得当作 accepted truth cursor。
- trace result 不得泄露外部正文、basis body、evidence body、debug log 或不可见 actor / reason 详情。

### 17.8 `ReadAuditTrail` 处理流

```text
Query: ReadAuditTrail
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 GlobalMemberRef / AuditScopeRef / optional AuditCursorRef
  |
  v
Identity Audit Query Service
  - 按 AuditScopeRef 读取或组装 IdentityTraceRecord refs
  - 构造 AuditTrail.assemble_for_member(GlobalMemberRef member_ref, AuditScopeRef audit_scope_ref, List<IdentityTraceRecordRef> trace_record_refs, VisibilityResultRef visibility_result_ref, AuditCursorRef cursor_ref, IdentityTimestamp assembled_at)
  - 构造 VisibilityPolicy.for_audit(...)
  |
  v
Audit Visibility Boundary
  - 调用 AuditTrail.filter_by_scope(AuditScopeRef audit_scope_ref)
  - 调用 AuditTrail.apply_visibility(VisibilityPolicy visibility_policy, VisibilityContextRef visibility_context_ref)
  - trace 缺失、不完整或不可见时返回 empty / not_visible / degraded marker
  |
  v
AuditTrailResult
```

关键设计点:

- audit trail 是 trace refs 的审计读取组织方式,不是 observability raw log 存储,也不创建业务 truth。
- audit query 不修复缺失 trace、不补写 audit entry、不把 cursor 当 truth cursor。
- 不可见或 degraded 审计结果不能通过 debug / diagnostic 字段泄漏正文或敏感 marker。
- audit DTO、entry schema、分页顺序和持久化策略留给 `03`。

### 17.9 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| consumption Command | 消费与追溯是只读能力,不得通过 command 修复 summary、trace、audit 或 projection | 不适用 |
| consumption Consumer | 本批不接收外部事实;外部来源进入前序 role / career / memory 或后续 maintenance / propagation | 8-C~8-E / 8-G / 8-H |
| consumption Outbound Event | Query response 不等于 accepted event material | 8-H outbound publish |
| consumption Operations Job | projection rebuild、trace projection refresh、reconciliation 属于维护能力 | 8-G |
| 字段级 redaction schema | `OQ-ID-004` 后移,概要层只定义 visibility context / result marker | `03` visibility contract |

### 17.10 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `ReadMemberSummary` | `ReadMemberSummary` Query | `GlobalMember`, `MemberSummaryView`, `ProjectionState`, `VisibilityPolicy` | summary projection boundary、visibility / redaction boundary、consumer boundary | no-write;不刷新 source;不泄露外部正文;stale 不修复 |
| `ReadIdentityTrace` | `ReadIdentityTrace` Query | `IdentityTraceRecord`, `VisibilityPolicy` | trace repository boundary、visibility / redaction boundary | trace 只读;不作第二 truth;不泄露不可见 reason / source / basis |
| `ReadAuditTrail` | `ReadAuditTrail` Query | `AuditTrail`, `IdentityTraceRecord`, `VisibilityPolicy` | audit / trace repository boundary、visibility / redaction boundary | audit 只读;不修复缺失 trace;不保存 raw log |

### 17.11 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | 三个 Query 均有独立处理流 |
| 是否只定义 Query | 通过 | 本批不新增 Command、Inbound Event、Outbound Event 或 Job |
| Query 是否保持 no-write | 通过 | 三条 Query 均不创建、不刷新、不重建、不修复 truth |
| visibility 是否闭合到概要层 | 通过 | 三条 Query 都经过 visibility / redaction boundary,字段级 schema 后移 |
| forbidden body 是否闭合 | 通过 | 明确禁止外部正文通过 summary、trace、audit、debug 或 diagnostic 输出 |
| trace / audit 是否被当作第二 truth | 通过 | trace / audit 只读,不修复业务 truth 或 projection |
| 是否混入维护 job | 通过 | projection rebuild、trace refresh、reconciliation 后移 8-G |
| 是否下沉到详细实现 | 通过 | 未写 port trait 签名、DTO 字段全集、SQL、错误码全集、redaction schema 或 retry 参数 |

### 17.12 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `ReadMemberSummary` 是成员身份事实消费的统一只读路径。它读取 member / summary projection,应用 visibility 后返回 found / not_found / not_visible / stale / degraded,不得创建、刷新、重建或修复 truth。
- `ReadIdentityTrace` 是身份变化追溯只读路径。它读取 accepted change trace refs,按 subject / change kind / cursor 过滤并裁剪可见字段,不得把 trace 当第二 truth。
- `ReadAuditTrail` 是审计时间线只读路径。它按 audit scope 组装 trace refs 并应用 visibility,不得保存 raw log、修复缺失 trace 或泄露不可见字段。
- 本批不定义 Command、Inbound Event Consumer、Outbound Event 或 Operations Job。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 17.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 8-F 只定义 Query | 若不认可,需要重新论证消费追溯是否允许写入 | 当前坚持 query no-write |
| 是否认可 `ReadMemberSummary` 作为统一消费摘要入口 | 若不认可,需要拆更多 summary query 并重审前序 slice query 关系 | 当前保留统一入口,前序 slice query 仍作为专项读取 |
| 是否认可 trace / audit 读取不触发修复 | 若不认可,会混入 8-G 维护职责 | 当前只返回 empty / not_visible / degraded marker |
| 是否认可字段级 redaction schema 后移 `03` | 若不认可,本 Step 会越界进入 protocol schema | 当前只保留 visibility context / result marker |
| 是否认可 Query response 不作为 outbound event | 若不认可,会混淆同步读取和 accepted fact propagation | 当前 event publish 留给 8-H |

### 17.14 进入 8-G 的条件

进入 8-G “派生维护与对账”前,需要用户确认:

- `ReadMemberSummary`、`ReadIdentityTrace` 和 `ReadAuditTrail` 的处理流粒度可以作为后续 Step 9 / `03` 输入。
- Query no-write、visibility / redaction、forbidden body 不泄漏和 trace / audit 不作为第二 truth 已满足本批停审。
- projection rebuild、reference refresh、trace projection refresh 和 reconciliation 可以在 8-G 继续收敛。

## 18. 8-G 派生维护与对账处理流

### 18.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-014` | projection、reference resolution 和 reconciliation report 需要可读取、可维护、可降级 |
| `BR-ID-015` | 维护 / 对账只能 report-only 或更新本仓派生状态,不得修复相邻仓 truth |
| `VETO-ID-005` | maintenance / reconciliation 修改相邻仓 truth 或绕过正式 command 写 identity truth 为 0 容忍 |
| `AC-ID-005` | 需要证明身份事实可被消费、变化可追溯、对账不修复相邻仓 truth |
| 架构 ADR-ID-ARCH-009 | projection / reference / reconciliation 允许延后、失败和降级,不能成为 accepted truth 前置 |
| Step 5 “派生维护与对账” | projection rebuild、reference refresh、漂移发现和 report-only finding |
| Step 6 `ProjectionState` | projection freshness、stale、degraded、rebuild pending、rebuilt、failed 状态主语 |
| Step 6 `ReferenceResolutionState` | 外部引用 resolved、stale、unavailable、unrecognized、refresh failed 状态主语 |
| Step 6 `ReconciliationPolicy` | report-only、no cross-repo repair、no command bypass、no query refresh guard |
| Step 6 `ReconciliationReport` | 对账范围、finding refs、issue refs、failed / partial / no finding 的 report-only 主语 |
| Step 7 `GetProjectionState` | projection state 只读 Query |
| Step 7 `GetReferenceResolutionState` | reference resolution state 只读 Query |
| Step 7 `ReadReconciliationReport` | reconciliation report 只读 Query |
| Step 7 `RebuildIdentityProjection` | projection rebuild Operations Job |
| Step 7 `RefreshExternalReferenceState` | external reference state refresh Operations Job |
| Step 7 `RunIdentityReconciliation` | report-only reconciliation Operations Job |

### 18.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 不需要。派生维护不是业务 actor 对 identity truth 的写入入口。 |
| 本批哪些 Query 必须独立画图? | `GetProjectionState`、`GetReferenceResolutionState`、`ReadReconciliationReport` 均涉及 stale / degraded / failed / visibility 或 report-only 解释,必须独立画图。 |
| 本批是否需要 Inbound Event Consumer? | 不需要。外部来源事实已在 8-C~8-E 的 source consumer 中处理;本批 job 只刷新 body-free marker。 |
| 本批是否需要 Outbound Event? | 不需要。维护状态和 report 是否传播交给 8-H 的 outbox / handoff 批次复核。 |
| 本批是否需要 Operations Job? | 需要。`RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation` 都是后台维护任务。 |

### 18.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| projection 被当作第二 truth | rebuild 后覆盖 `GlobalMember`、lifecycle、role、career 或 memory truth | job 只能更新 `ProjectionState` 和派生视图 freshness marker |
| reference refresh 保存外部正文 | 刷新时保存 method / work / memory / archive body 或 package | 只保存 typed ref、safe summary marker、source version marker、issue ref 和状态 |
| Query 触发维护 | state / report 读取时同步 rebuild、refresh 或 reconciliation | Query 全部 no-write,只返回 not_found / stale / degraded / failed marker |
| 对账变成跨仓修复 | 发现 drift 后直接修复 method、work、governance、memory 或本仓核心 truth | `RunIdentityReconciliation` 只生成 report-only finding,不生成 remediation command |
| 失败被吞掉 | failed / partial / unavailable 被伪装成 resolved / clean / fresh | 结果必须显式保留 failed、partial、unavailable、unrecognized、degraded marker |

### 18.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把 rebuild / refresh / reconciliation 作为业务 Command | 不采用 | 它们不表达业务 truth 变更,只能作为维护任务 |
| Query 内发现 stale 后自动启动维护 | 不采用 | 违反 query no-write,也会让读取延迟和副作用不可预测 |
| projection rebuild 可以修复核心 truth | 不采用 | projection 是派生结果,不是 accepted identity fact 来源 |
| reference refresh 保存外部 safe summary marker | 采用 | marker 可支持 freshness / issue 解释,但不能保存外部正文 |
| reconciliation report 只描述 finding | 采用 | 修复必须回到正式 owner 能力或正式 identity command,不能由 report 自动执行 |
| 本批直接定义 publish / handoff | 不采用 | propagation 属于 8-H,本批只闭合派生维护与对账 |

### 18.5 处理流覆盖清单

| 接口 | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `GetProjectionState` | Query | 是 | projection freshness / stale / degraded / rebuild failed 需要明确 no-write 解释 |
| `GetReferenceResolutionState` | Query | 是 | reference resolved / unavailable / unrecognized / refresh failed 不能触发外部 resolver |
| `ReadReconciliationReport` | Query | 是 | report-only、visibility / redaction、failed / partial / finding detected 需要独立边界 |
| `RebuildIdentityProjection` | Operations Job | 是 | 会更新派生 projection state,必须防止 truth write |
| `RefreshExternalReferenceState` | Operations Job | 是 | 会刷新 reference state marker,必须防止外部正文和跨仓 repair |
| `RunIdentityReconciliation` | Operations Job | 是 | 会生成 finding / report,必须防止自动 remediation |
| maintenance Command | Command | 不适用 | 本批明确不定义 |
| maintenance Consumer | Inbound Event Consumer | 不适用 | 本批不新增外部事件消费面 |
| maintenance Event | Outbound Event | 不适用 | 传播留给 8-H |

### 18.6 `GetProjectionState` 处理流

```text
+---------------------------------------------------------------+
| GetProjectionState                                           |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 IdentityProjectionRef / optional GlobalMemberRef / optional ConsistencyHintRef
  |
  v
Projection State Query Service
  - 读取 ProjectionState 和 projection metadata
  - 不触发 RebuildIdentityProjection
  - 构造 projection visibility / freshness 解释
  |
  v
Projection Visibility Boundary
  - 应用 VisibilityPolicy 对 projection state marker 做裁剪
  - stale / degraded / rebuild_failed 必须显式返回
  - IdentityProjectionCursorRef 只能作为 projection cursor / marker
  |
  v
ProjectionStateResult
```

关键设计点:

- `GetProjectionState` 不创建 projection、不重建 projection、不写 `ProjectionState`。
- projection cursor 不能被解释为 accepted identity truth cursor。
- projection metadata 不得携带不可见字段、external body、runtime body 或 debug body。
- projection not_found、stale、degraded、rebuild_failed 都是可见状态,不得被伪装成 fresh。

### 18.7 `GetReferenceResolutionState` 处理流

```text
+---------------------------------------------------------------+
| GetReferenceResolutionState                                  |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 ExternalReferenceRef / optional IdentityReferenceOwnerRef / optional ConsistencyHintRef
  |
  v
Reference State Query Service
  - 读取 ReferenceResolutionState
  - 不调用外部 resolver
  - 不尝试识别 unknown external ref
  |
  v
Reference Visibility Boundary
  - 裁剪 safe summary marker / issue marker
  - unavailable / unrecognized / refresh_failed 必须显式返回
  - 不返回 source body / package / private adapter response
  |
  v
ReferenceResolutionStateResult
```

关键设计点:

- Query 只读已持久化的 `ReferenceResolutionState`,不主动刷新外部来源。
- `ExternalReferenceSafeSummaryRef` 只是安全摘要 marker,不是 method、work、memory、archive 正文。
- unavailable / unrecognized 不得被默认补造成 resolved。
- 外部引用是否可用于后续 truth update 由正式 source flow / command policy 决定,不是本 Query 决定。

### 18.8 `ReadReconciliationReport` 处理流

```text
+---------------------------------------------------------------+
| ReadReconciliationReport                                     |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 MaintenanceScopeRef / optional ReconciliationReportRef / optional ReportCursorRef
  |
  v
Reconciliation Report Query Service
  - 读取 ReconciliationReport store
  - 按 scope / report ref / cursor 选择 report-only result
  - 构造 visibility / redaction context
  |
  v
Report Visibility Boundary
  - finding_refs / issue_refs 按 visibility 裁剪
  - failed / partial / finding_detected 不得隐藏
  - ReportCursorRef 只作为读取分页 marker
  |
  v
ReconciliationReportResult
```

关键设计点:

- report 是对账发现和维护结果,不是修复计划或执行任务。
- report query 不触发 `RunIdentityReconciliation`,也不触发 remediation command。
- report body 不得包含外部正文、raw log、archive package、adapter response 或 debug dump。
- `ReportCursorRef` 不得当作 truth cursor 或 accepted change cursor。

### 18.9 `RebuildIdentityProjection` 处理流

```text
+---------------------------------------------------------------+
| RebuildIdentityProjection                                    |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / MaintenanceScopeRef
  - 接收 IdentityProjectionRef / optional GlobalMemberRef / optional IdentityProjectionCursorRef
  |
  v
Maintenance Service
  - 构造 ReconciliationPolicy.for_projection_rebuild(MaintenanceScopeRef maintenance_scope_ref, IdentityProjectionRef projection_ref, Option<ActorRef> actor_ref)
  - 调用 ReconciliationPolicy.assert_not_truth_write(IdentityMaintenanceIntent maintenance_intent)
  - 调用 ReconciliationPolicy.assert_not_cross_repo_repair(IdentityMaintenanceIntent maintenance_intent)
  |
  v
Projection Rebuild Boundary
  - 从 accepted identity facts / safe summaries 重建 identity-owned projection
  - 更新 ProjectionState 为 rebuilt / stale / degraded / rebuild_failed
  - 必要时生成 MaintenanceIssueRef 或 report issue marker
  |
  v
Projection Maintenance Result
```

关键设计点:

- rebuild 只能更新 identity-owned projection 和 `ProjectionState`,不能修改 `GlobalMember`、lifecycle、role、career 或 memory truth。
- job 失败只能产生 degraded / rebuild_failed / issue marker,不能在相邻仓或本仓核心 truth 上自动修复。
- rebuild cursor、batch size、事务拆分、runner retry 和调度配置后移 `03/04`。
- 若 projection 不完整,读取侧必须可见 stale / degraded,不能由 job 静默吞掉。

### 18.10 `RefreshExternalReferenceState` 处理流

```text
+---------------------------------------------------------------+
| RefreshExternalReferenceState                                |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / MaintenanceScopeRef
  - 接收 ExternalReferenceRef 或 reference owner scope / optional ReferenceRefreshCursorRef
  |
  v
Maintenance Service
  - 构造 ReconciliationPolicy.for_reference_refresh(MaintenanceScopeRef maintenance_scope_ref, ExternalReferenceRef external_reference_ref, Option<ActorRef> actor_ref)
  - 调用 ReconciliationPolicy.assert_body_free(ReconciliationFindingMaterial finding_material)
  - 调用 ReconciliationPolicy.assert_not_cross_repo_repair(IdentityMaintenanceIntent maintenance_intent)
  |
  v
Reference Refresh Boundary
  - 解析 body-free external reference marker / safe summary marker
  - 更新 ReferenceResolutionState 为 resolved / stale / unavailable / unrecognized / refresh_failed
  - 必要时生成 MaintenanceIssueRef 或 report issue marker
  |
  v
Reference Refresh Result
```

关键设计点:

- refresh 不拥有外部 truth,不得保存 method / work / governance / memory / archive 正文。
- refresh 不能修复外部 owner truth,也不能把 unavailable / unrecognized 默认转成 accepted identity fact。
- resolver port、错误分类、timeout、retry 和 adapter profile 属于 `03/04` 详细设计。
- 若 external reference 无法识别,结果必须进入 unrecognized / refresh_failed / issue marker,不能伪装 resolved。

### 18.11 `RunIdentityReconciliation` 处理流

```text
+---------------------------------------------------------------+
| RunIdentityReconciliation                                    |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / MaintenanceScopeRef
  - 接收 target refs / optional ReconciliationCursorRef / ReconciliationPolicyRef
  |
  v
Reconciliation Service
  - 构造 ReconciliationPolicy.for_reconciliation(MaintenanceScopeRef maintenance_scope_ref, ReconciliationFindingIntentRef finding_intent_ref, Option<ActorRef> actor_ref)
  - 调用 ReconciliationPolicy.assert_report_only(MaintenanceScopeRef maintenance_scope_ref, IdentityMaintenanceTargetRef target_ref)
  - 调用 ReconciliationPolicy.assert_not_truth_write(IdentityMaintenanceIntent maintenance_intent)
  |
  v
Report Generation Boundary
  - 比较 projection state / reference state / safe trace markers
  - 生成 ReconciliationReport no_finding / finding_detected / failed / partial
  - 记录 finding refs、issue refs 和 trace marker
  |
  v
Reconciliation Job Result
```

关键设计点:

- reconciliation 只能生成 `ReconciliationReport`,不得生成自动 remediation command。
- finding 只描述 drift、stale、unavailable、partial 或 failed,修复必须回到正式 owner 能力。
- report material 必须 body-free,不得包含 external body、raw log、archive package 或 private adapter response。
- 对账范围、target refs、cursor 语义和 finding 分类后移 Step 10 / `03` 细化。

### 18.12 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| maintenance Command | 维护与对账不是业务 truth 写入口 | 不适用 |
| maintenance Inbound Event Consumer | 本批不新增外部事件消费;source changed 已由 8-C~8-E 处理 | 8-C~8-E |
| derived-state Outbound Event | event material / publish / handoff 属于传播批次 | 8-H |
| automatic remediation flow | report-only 不允许自动修复 | 若需要修复,回到正式 owner command 或对应仓 |
| runner retry / schedule / adapter timeout | 属于运行配置和详细设计 | Step 10~12 / `03/04` |

### 18.13 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `GetProjectionState` | `GetProjectionState` Query | `ProjectionState`, `VisibilityPolicy` | projection store boundary、visibility boundary | no-write;不触发 rebuild;cursor 不是 truth cursor |
| `GetReferenceResolutionState` | `GetReferenceResolutionState` Query | `ReferenceResolutionState`, `VisibilityPolicy` | reference state store boundary、visibility boundary | no-write;不调用 resolver;不保存或返回外部正文 |
| `ReadReconciliationReport` | `ReadReconciliationReport` Query | `ReconciliationReport`, `ReconciliationPolicy`, `VisibilityPolicy` | report store boundary、visibility / redaction boundary | report-only;不触发 remediation;failed / partial 不隐藏 |
| `RebuildIdentityProjection` | `RebuildIdentityProjection` Job | `ProjectionState`, `ReconciliationPolicy`, `ReconciliationReport` | projection rebuild boundary、maintenance run metadata boundary | 只写派生状态;不写 identity truth;不修复外部 truth |
| `RefreshExternalReferenceState` | `RefreshExternalReferenceState` Job | `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport` | reference resolver boundary、maintenance run metadata boundary | 只刷新 body-free marker;不保存 external body;不跨仓 repair |
| `RunIdentityReconciliation` | `RunIdentityReconciliation` Job | `ReconciliationPolicy`, `ReconciliationReport`, `IdentityTraceRecord` | reconciliation report store boundary、maintenance run metadata boundary | report-only;不自动修复;不绕过 command |

### 18.14 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | 三个 Query 和三个 Operations Job 均有独立处理流 |
| 是否没有业务 Command | 通过 | 本批不新增 business command |
| Query 是否保持 no-write | 通过 | 三个 Query 均不触发 rebuild、refresh、reconciliation 或 repair |
| Job 是否只写派生状态 / report | 通过 | job 输出限定为 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` / issue marker |
| report-only 是否闭合 | 通过 | 对账只生成 finding / issue / report,不生成 remediation command |
| forbidden body 是否闭合 | 通过 | 明确禁止 external body、raw log、adapter response、archive package、debug body |
| failed / partial / stale / degraded 是否显式 | 通过 | 所有 Query 和 Job 都保留失败、部分完成、过期或降级 marker |
| 是否下沉到详细实现 | 通过 | 未写 DTO 字段全集、port trait 签名、SQL、runner retry、timeout、schedule 或 adapter profile |

### 18.15 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `GetProjectionState` 是 projection freshness / stale / degraded / rebuild failed 的只读路径,不触发 rebuild。
- `GetReferenceResolutionState` 是 external reference resolution state 的只读路径,不调用外部 resolver,不保存或返回外部正文。
- `ReadReconciliationReport` 是 report-only 对账报告读取路径,不触发 remediation。
- `RebuildIdentityProjection`、`RefreshExternalReferenceState` 和 `RunIdentityReconciliation` 是后台维护任务,只能更新派生状态、reference marker 或 report。
- 本批不定义业务 Command、Inbound Event Consumer 或 Outbound Event;传播与 handoff 留给 8-H。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 18.16 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本批不定义业务 Command | 若不认可,需要重新论证 maintenance 是否可以写 truth | 当前坚持 maintenance 不是业务 command |
| 是否认可 Query 不触发维护 | 若不认可,query no-write 会被破坏 | 当前 Query 只返回状态和 marker |
| 是否认可 job 只写派生状态 / report | 若不认可,会触碰跨仓 repair 或 command bypass | 当前只允许 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` |
| 是否认可 report finding 不等于 remediation plan | 若不认可,需要新增正式修复能力 | 当前 finding 只描述问题 |
| 是否认可 event propagation 留给 8-H | 若不认可,本批需要提前定义 outbox 关系 | 当前不提前定义 outbound event |

### 18.17 进入 8-H 的条件

进入 8-H “身份事实传播与外部交接”前,需要用户确认:

- `GetProjectionState`、`GetReferenceResolutionState`、`ReadReconciliationReport` 的 no-write 处理流可以作为后续 Step 9 / `03` 输入。
- `RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation` 只写派生状态 / marker / report,不修复相邻仓 truth。
- report-only、forbidden body、stale / degraded / failed / partial 显式暴露的口径已满足本批停审。

---

## 19. 8-H 身份事实传播与外部交接处理流

### 19.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | accepted identity fact 必须通过正式 outbox / event material 被相邻仓消费 |
| `FR-ID-013` | 身份变化 trace / audit / archive / observability material 必须可追溯交接 |
| `BR-ID-013` | 下游消费不得反写 identity truth,传播只表达本仓 accepted fact |
| `BR-ID-014` | handoff 必须可追溯到安全可见原因、来源、actor、basis 或 marker |
| `VETO-ID-003` | event / handoff material 携带 memory、artifact、conversation、runtime body、receipt body、archive package 或 secret 为 0 容忍 |
| `AC-ID-005` | 必须证明身份事实可消费、变化可追溯、传播失败不回滚 accepted truth |
| Step 6 `IdentityOutboxRecord` / `OutboxState` | accepted fact event material 和 publish state 主语 |
| Step 6 `TraceHandoffIntent` / `HandoffState` | trace / audit / archive handoff intent 与交接状态主语 |
| Step 6 `OutboundEventPolicy` / `HandoffPolicy` | accepted-only、body-free、visibility、not acceptance gate 和 no fake delivery guard |
| Step 7 `PrepareTraceHandoff` | 本批唯一 Command,只创建 pending handoff intent |
| Step 7 `ListPendingIdentityOutbox` / `GetIdentityOutboxState` / `GetTraceHandoffState` | 本批传播 / handoff 状态 Query |
| Step 7 `HandleTraceHandoffResult` | 本批 handoff receipt / failure marker Consumer |
| Step 7 outbound event skeleton | 前序 accepted fact material 的统一发布输入 |
| Step 7 `PublishIdentityOutbox` / `DeliverTraceHandoff` / `RetryIdentityPropagationFailures` | 本批传播 / handoff Operations Job |

### 19.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批哪些 Command 必须独立画图? | `PrepareTraceHandoff` 必须独立画图。它写 `TraceHandoffIntent` / `HandoffState::PendingHandoff`,但不改变业务 truth,不执行交付。 |
| 本批哪些 Query 必须独立画图? | `ListPendingIdentityOutbox`、`GetIdentityOutboxState`、`GetTraceHandoffState` 都包含 visibility、state marker、failed / retryable / pending 解释,必须独立画图。 |
| 本批哪些 Inbound Event Consumer 必须独立画图? | `HandleTraceHandoffResult` 必须独立画图。它消费 receipt / failure marker,只更新 `HandoffState`,不保存 receipt body。 |
| 本批哪些 Outbound Event material 独立画图? | canonical outbound events 作为 `PublishIdentityOutbox` 的输入统一说明,不逐个画 accepted 前置图。 |
| 本批哪些 Operations Job 必须独立画图? | `PublishIdentityOutbox`、`DeliverTraceHandoff`、`RetryIdentityPropagationFailures` 都影响传播可靠性和失败可见性,必须独立画图。 |

### 19.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| publish / handoff 成为 command accepted 前置 | 建档、lifecycle、role、career、memory command 等待下游发布或 archive 交接成功才返回 accepted | 前序 command 只创建 pending outbox material;publish / handoff job 后续执行 |
| event 携带外部正文或不可见字段 | payload 中塞入 method body、work body、memory body、archive package、receipt body、raw log、secret 或 redacted 字段 | `OutboundEventPolicy` 和 `HandoffPolicy` 都只允许 safe marker / refs |
| 未 accepted fact 被传播 | pending、rejected、stale、report finding 或 projection rebuild marker 被当成 identity fact event 发布 | `PublishIdentityOutbox` 只处理来自 accepted change 的 `IdentityOutboxRecord` |
| handoff 伪成功 | intent 创建或 delivery request 发送后直接标记 delivered | delivered 只能由 `HandleTraceHandoffResult` 消费正式 `HandoffReceiptRef` marker 后形成 |
| Query 触发发布或交接 | 读取 outbox / handoff state 时自动 publish、deliver 或 retry | 三个 Query 只读状态,返回 pending / failed / degraded marker,不得写入 |
| retry 绕过 policy | 重试直接发布 failed record,忽略 visibility、payload body-free 或 target allowed guard | `RetryIdentityPropagationFailures` 必须重新经过 `OutboundEventPolicy` / `HandoffPolicy` |
| 下游消费状态被误解 | `OutboxState::Published` 被解释为所有下游业务已经处理 | `Published` 只表示本仓 outbound boundary 接受 publish,不表达 consumer business ack |

### 19.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 前序每个 accepted command 同步发布 event | 不采用 | 会把最终一致传播变成 command accepted 前置,也会扩大事务边界 |
| 将 `PrepareTraceHandoff` 保留为 Command | 采用 | handoff intent 可能需要 actor、reason、target 和幂等边界,但它只写 intent / state |
| handoff receipt 走 Command | 不采用 | receipt / failure 是外部结果,更适合 Inbound Event Consumer / callback |
| Query 读取时顺便触发 retry | 不采用 | 违反 query no-write,也会让运维读取产生副作用 |
| `RetryIdentityPropagationFailures` 复用 publish / deliver guard | 采用 | retry 不能绕过 accepted-only、body-free、visibility 和 target guard |
| 在 Step 8 定义 envelope / topic / receipt schema | 不采用 | 这些属于 `03/04` 协议和配置设计,本批只保留概要处理流和边界 |

### 19.5 处理流覆盖清单

| 接口 / Event material | 类别 | 是否独立处理流 | 原因 |
|---|---|---|---|
| `PrepareTraceHandoff` | Command | 是 | 显式创建 pending handoff intent,需要 actor、幂等、target 和 safe material guard |
| `ListPendingIdentityOutbox` | Query | 是 | 读取 pending / retryable / failed outbox 状态,需要 no-write 和 payload body-free 说明 |
| `GetIdentityOutboxState` | Query | 是 | 单条 outbox state 解释需要区分 published、retryable failed、failed、skipped |
| `GetTraceHandoffState` | Query | 是 | handoff pending / delivered / retryable / failed / cancelled 语义不能泄露 receipt body |
| `HandleTraceHandoffResult` | Inbound Event Consumer | 是 | 外部 receipt / failure callback 会更新 `HandoffState`,必须防伪成功和正文泄漏 |
| canonical identity outbound events | Outbound Event material | 否 | 事件 material 来自前序 accepted outbox,由 `PublishIdentityOutbox` 统一处理 |
| `PublishIdentityOutbox` | Operations Job | 是 | 负责发布 pending / retryable outbox 并更新 `OutboxState` |
| `DeliverTraceHandoff` | Operations Job | 是 | 负责交付 safe handoff material,但 delivered 需 receipt marker |
| `RetryIdentityPropagationFailures` | Operations Job | 是 | 选择 retryable outbox / handoff 并重新执行 publish / deliver guard |

### 19.6 `PrepareTraceHandoff` 处理流

```text
+---------------------------------------------------------------+
| PrepareTraceHandoff                                          |
+---------------------------------------------------------------+
Command
  |
  v
Command Intake
  - 校验 ActorContext / CommandMetadata / IdempotencyKey
  - 接收 GlobalMemberRef / HandoffScopeRef / HandoffTargetRef / trace refs / safe material marker
  |
  v
Handoff Application Service
  - 读取 GlobalMember truth summary、IdentityTraceRecord refs 和 optional AuditTrailRef
  - 构造 HandoffPolicy.for_handoff(HandoffTargetRef handoff_target_ref, HandoffScopeRef handoff_scope_ref, TraceHandoffSafeMaterialRef safe_material_ref, List<IdentityTraceRecordRef> trace_record_refs, VisibilityContextRef visibility_context_ref)
  - 复核 duplicate key 是否命中既有 TraceHandoffIntent
  |
  v
Domain Object / Policy
  - 调用 HandoffPolicy.assert_target_allowed(HandoffTargetRef handoff_target_ref, HandoffScopeRef handoff_scope_ref)
  - 调用 HandoffPolicy.assert_trace_refs_present(List<IdentityTraceRecordRef> trace_record_refs)
  - 调用 HandoffPolicy.assert_safe_material_body_free(TraceHandoffSafeMaterialRef safe_material_ref)
  - 调用 HandoffPolicy.assert_visible_for_handoff(VisibilityContextRef visibility_context_ref)
  - 调用 TraceHandoffIntent.prepare(...)
  |
  v
Accepted Handoff Material
  - 保存 TraceHandoffIntent 与 HandoffState::PendingHandoff
  - 记录 handoff trace marker 或 intent history marker
  - 保存幂等 result
  |
  v
TraceHandoffCommandResult
```

关键设计点:

- `PrepareTraceHandoff` 只创建 pending intent,不执行 delivery,不标记 delivered,不改变 `GlobalMember`、lifecycle、role、career 或 memory truth。
- trace refs、audit ref、safe material、target 和 scope 都是 body-free refs / marker;target schema、receipt schema 和 adapter 参数后移 `03/04`。
- duplicate 命中只能返回已保存的 handoff intent result,不得重新创建第二个 handoff intent。
- safe material 不得包含 archive package、observability raw log、memory body、runtime body 或不可见字段。

### 19.7 `ListPendingIdentityOutbox` 处理流

```text
+---------------------------------------------------------------+
| ListPendingIdentityOutbox                                    |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 optional GlobalMemberRef / optional TopicKeyRef / optional OutboxStateKind / optional OutboxCursorRef
  |
  v
Outbox Query Service
  - 读取 IdentityOutboxRecord page 和 OutboxState
  - 不触发 PublishIdentityOutbox
  - 不展开 payload_marker_ref 背后的正文
  |
  v
Visibility / Redaction Boundary
  - 按 VisibilityContextRef 裁剪 outbox refs / issue marker
  - pending / retryable / failed / skipped 必须显式返回
  - OutboxCursorRef 只作为 page cursor
  |
  v
IdentityOutboxListResult
```

关键设计点:

- 本 Query 只列出状态,不发布、不重试、不修改 `OutboxState`。
- `payload_marker_ref` 可以显示为 marker / ref,不得展开 payload body 或外部正文。
- `OutboxCursorRef` 是查询分页 cursor,不得被当作 accepted truth cursor 或 source cursor。
- empty、not_visible、degraded 都是合法 query result,不能触发后台副作用。

### 19.8 `GetIdentityOutboxState` 处理流

```text
+---------------------------------------------------------------+
| GetIdentityOutboxState                                       |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 IdentityOutboxRecordRef
  |
  v
Outbox State Query Service
  - 读取 IdentityOutboxRecord 与 OutboxState
  - 读取最近 delivery attempt / issue marker
  - 不调用 publisher 或 retry runner
  |
  v
Outbox Visibility Boundary
  - 裁剪 topic / issue / attempt marker
  - published 只解释为本仓 publish boundary 成功
  - failed / retryable_failed / skipped_by_policy 必须显式保留
  |
  v
IdentityOutboxStateResult
```

关键设计点:

- `Published` 不等于所有下游业务已经消费或处理成功。
- `SkippedByPolicy` 必须保留原因 marker,不能伪装为 published 或 ignored。
- 查询结果不返回 topic 私有配置、publisher raw response、下游响应正文或 payload body。
- not_found 与 not_visible 必须区分,不可见不能伪装成不存在。

### 19.9 `GetTraceHandoffState` 处理流

```text
+---------------------------------------------------------------+
| GetTraceHandoffState                                         |
+---------------------------------------------------------------+
Query
  |
  v
Query Intake
  - 校验 ActorContext / QueryMetadata / VisibilityContextRef
  - 接收 TraceHandoffIntentRef
  |
  v
Handoff State Query Service
  - 读取 TraceHandoffIntent 与 HandoffState
  - 读取最近 handoff attempt / receipt / issue marker
  - 不触发 DeliverTraceHandoff 或 retry
  |
  v
Handoff Visibility Boundary
  - 裁剪 receipt / issue / target marker
  - pending / delivered / retryable_failed / failed / cancelled 必须显式返回
  - receipt 只返回 HandoffReceiptRef marker
  |
  v
TraceHandoffStateResult
```

关键设计点:

- `Delivered` 必须来自正式 receipt marker,不能由 intent 存在或 delivery request 已发送推导。
- Query 不返回 receipt body、archive package、observability raw log、target private config 或 safe material body。
- Query 不触发交付或重试,只解释当前 `HandoffState`。
- cancelled / failed 不得被隐藏为 not_found。

### 19.10 `HandleTraceHandoffResult` 处理流

```text
+---------------------------------------------------------------+
| HandleTraceHandoffResult                                     |
+---------------------------------------------------------------+
Inbound Event Consumer
  |
  v
Consumer Intake
  - 校验 event envelope / source event id / dedup key / trace context
  - 接收 TraceHandoffIntentRef / HandoffTargetRef / HandoffAttemptRef / result marker
  |
  v
Handoff Result Consumer Service
  - 读取 TraceHandoffIntent 与当前 HandoffState
  - 校验 callback target / attempt 与 intent 匹配
  - 根据 result marker 选择 delivered / retryable failed / failed / cancelled
  |
  v
Domain Object / Policy
  - 成功时调用 HandoffPolicy.assert_receipt_is_marker(HandoffReceiptRef receipt_ref)
  - 失败时校验 HandoffIssueRef 是 marker,不是 receipt body 或 raw error body
  - 调用 TraceHandoffIntent.mark_delivered(...) 或 mark_retryable(...) / mark_failed(...)
  |
  v
Handoff State Material
  - 更新 HandoffState
  - 记录 handoff result trace marker
  - 必要时创建 retryable issue marker
  |
  v
HandoffResultConsumerReceipt
```

关键设计点:

- 外部 callback 只能更新 `HandoffState` marker,不能反写外部 archive / observability truth,也不能改业务 truth。
- 缺少 intent ref、target ref、attempt ref 或 result marker 时,后续 Step 10 应走 rejected / quarantine / pending review / report-only,不能实现侧拼接。
- receipt / issue 都只能是 marker / ref;raw receipt body、archive package、raw log 和 adapter response 不入仓。
- duplicate callback 必须按 dedup key 和 attempt marker 处理,不能重复推进 delivered 或重复生成 trace。

### 19.11 Outbound Event material 统一说明

```text
+---------------------------------------------------------------+
| Canonical Identity Outbound Event Material                    |
+---------------------------------------------------------------+
Accepted Identity Change
  |
  v
Accepted Truth Material
  - 前序 Command / Consumer 创建 IdentityTraceRecord
  - 前序 Command / Consumer 创建 IdentityOutboxRecord::from_accepted_change(...)
  |
  v
OutboundEventPolicy
  - assert_from_accepted_change(...)
  - assert_payload_body_free(...)
  - assert_visible_for_topic(...)
  |
  v
Pending IdentityOutboxRecord
```

本批统一承接以下 canonical event material:

| Event material | 产生来源 | 本批处理 |
|---|---|---|
| `GlobalMemberEstablished` | `EstablishGlobalMember` accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `IdentityAnchorChanged` | anchor accepted change | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `GlobalLifecycleChanged` | `UpdateGlobalLifecycleState` accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `GlobalMemberAvailabilityChanged` | lifecycle availability marker accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `RoleCapabilitySummaryChanged` | `MaintainRoleCapabilitySummary` accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `RoleCapabilitySourceStateChanged` | `HandleRoleCapabilitySourceChanged` accepted state change | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `CareerRecordAppended` | `AppendCareerRecord` 或 work source accepted append | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `CareerCorrectionAppended` | career correction append accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `MemoryReferenceChanged` | memory reference command / source accepted result | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |
| `MemoryArchiveHandoffStateChanged` | archive handoff accepted marker | 作为 pending outbox,由 `PublishIdentityOutbox` 发布 |

关键设计点:

- canonical event material 都必须来自 accepted identity change,不能来自 query、projection rebuild、report finding、rejected result 或 stale marker。
- event payload 只允许 refs、safe summary marker、change kind、trace ref、topic marker,不得携带外部正文或不可见字段。
- event envelope、topic routing、payload version、field redaction 和 publisher adapter 后移 `03/04`。

### 19.12 `PublishIdentityOutbox` 处理流

```text
+---------------------------------------------------------------+
| PublishIdentityOutbox                                        |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / outbox scope / optional OutboxCursorRef
  - 选择 pending 或 retryable IdentityOutboxRecord
  |
  v
Outbox Publish Service
  - 读取 IdentityOutboxRecord 与 OutboxState
  - 构造 OutboundEventPolicy.for_outbox(...)
  - 校验当前状态可发布
  |
  v
Outbound Publish Boundary
  - 调用 OutboundEventPolicy.assert_from_accepted_change(...)
  - 调用 OutboundEventPolicy.assert_payload_body_free(...)
  - 调用 OutboundEventPolicy.assert_visible_for_topic(...)
  - 向 outbound publisher boundary 交付 topic key / payload marker / trace ref
  |
  v
Outbox State Material
  - publish 成功: OutboxState::Published
  - 可重试失败: OutboxState::RetryableFailed + issue marker
  - 不可恢复失败: OutboxState::Failed + issue marker
  - 策略跳过: OutboxState::SkippedByPolicy + issue marker
```

关键设计点:

- publish job 只能发布已存在的 pending / retryable outbox,不能重算 accepted truth 或生成新业务 fact。
- publish 成功不改变前序 accepted truth;publish 失败也不回滚前序 accepted truth。
- publisher raw response、downstream body、topic private config 不进入 identity truth。
- job cursor、batch size、retry policy、topic adapter 和 timeout 后移 `03/04`。

### 19.13 `DeliverTraceHandoff` 处理流

```text
+---------------------------------------------------------------+
| DeliverTraceHandoff                                          |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / handoff scope / optional HandoffCursorRef
  - 选择 pending 或 retryable TraceHandoffIntent
  |
  v
Handoff Delivery Service
  - 读取 TraceHandoffIntent 与 HandoffState
  - 构造 HandoffPolicy.for_handoff(...)
  - 校验当前状态可交付
  |
  v
Handoff Delivery Boundary
  - 调用 HandoffPolicy.assert_target_allowed(...)
  - 调用 HandoffPolicy.assert_trace_refs_present(...)
  - 调用 HandoffPolicy.assert_safe_material_body_free(...)
  - 向 handoff delivery boundary 交付 safe material marker / target ref
  |
  v
Handoff State Material
  - delivery request accepted: 保持 PendingHandoff 或记录 attempt marker
  - 可重试失败: HandoffState::RetryableFailed + issue marker
  - 不可恢复失败: HandoffState::Failed + issue marker
  - delivered: 等待 HandleTraceHandoffResult 的 receipt marker 后确认
```

关键设计点:

- delivery request 被外部 boundary 接收不等于 delivered;delivered 必须由正式 receipt marker 回写。
- 本 Job 不保存 archive package、receipt body、observability raw log 或 adapter response。
- handoff 失败只更新 `HandoffState` / issue marker,不回滚 accepted identity truth。
- target profile、adapter、receipt schema、timeout、retry 参数后移 `03/04`。

### 19.14 `RetryIdentityPropagationFailures` 处理流

```text
+---------------------------------------------------------------+
| RetryIdentityPropagationFailures                             |
+---------------------------------------------------------------+
Operations Job
  |
  v
Job Intake
  - 校验 job run metadata / system actor / propagation failure scope
  - 接收 optional OutboxCursorRef / optional HandoffCursorRef / retry policy marker
  |
  v
Propagation Retry Service
  - 选择 OutboxState::RetryableFailed 的 IdentityOutboxRecord
  - 选择 HandoffState::RetryableFailed 的 TraceHandoffIntent
  - 过滤不可恢复 failed / skipped / cancelled
  |
  v
Retry Execution Boundary
  - 对 outbox 重新执行 PublishIdentityOutbox 同等 guard
  - 对 handoff 重新执行 DeliverTraceHandoff 同等 guard
  - 记录 retry attempt / issue marker
  |
  v
Propagation Retry Result
  - 成功项更新 published 或 pending attempt marker
  - 失败项保留 retryable 或升级 failed
  - 不可恢复项进入 issue marker / report-only
```

关键设计点:

- retry 只能处理 retryable marker,不能强行重试 failed、skipped_by_policy、cancelled 或 not_visible 项。
- retry 成功不是新业务 fact,只更新传播 / handoff 状态。
- retry 必须重新经过 body-free、visibility、target 和 accepted-only guard,不能走捷径。
- retry scope、退避策略、最大次数、调度和 report 输出后移 `03/04/05/06/07`。

### 19.15 未展开独立处理流的原因

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| 每个 canonical event 的单独 publish flow | 它们都进入 `IdentityOutboxRecord`,发布机制相同 | `PublishIdentityOutbox`;`03` event payload variant |
| 下游 consumer ack flow | 本仓不拥有下游业务消费 truth,`Published` 不代表 consumer processed | 下游仓自行处理;必要时通过 report / trace marker 观察 |
| handoff target / receipt schema flow | target、receipt、adapter 和 profile 属于详细协议 / 配置 | `03/04` |
| raw publisher / raw handoff response handling | raw response 不应进入概要处理流或 identity truth | `03` 错误映射;`04` adapter profile |
| propagation remediation flow | 传播失败不生成业务修复 command | Step 10 failure;Step 12 handoff;`05/06/07` |

### 19.16 处理流与对象 / 接口对应关系

| 处理流 | 承接接口 | 使用对象 | 接缝 | 边界 |
|---|---|---|---|---|
| `PrepareTraceHandoff` | `PrepareTraceHandoff` Command | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy`, `IdentityTraceRecord` | handoff store boundary、visibility / redaction boundary | 只创建 pending intent;不交付;不改业务 truth |
| `ListPendingIdentityOutbox` | `ListPendingIdentityOutbox` Query | `IdentityOutboxRecord`, `OutboxState`, `VisibilityPolicy` | outbox store boundary、visibility boundary | no-write;不发布;不展开 payload body |
| `GetIdentityOutboxState` | `GetIdentityOutboxState` Query | `IdentityOutboxRecord`, `OutboxState`, `VisibilityPolicy` | outbox store boundary、delivery issue boundary | no-write;published 不等于 consumer processed |
| `GetTraceHandoffState` | `GetTraceHandoffState` Query | `TraceHandoffIntent`, `HandoffState`, `VisibilityPolicy` | handoff store boundary、receipt marker boundary | no-write;receipt body 不入仓 |
| `HandleTraceHandoffResult` | `HandleTraceHandoffResult` Consumer | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | handoff callback boundary、dedup boundary | 只处理 marker;不伪造 delivered;不保存 raw body |
| canonical outbound material | outbound event skeleton | `IdentityOutboxRecord`, `IdentityTraceRecord`, `OutboundEventPolicy` | outbox material boundary、topic marker boundary | 只来自 accepted change;body-free |
| `PublishIdentityOutbox` | `PublishIdentityOutbox` Job | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy` | outbound publisher boundary、job run metadata boundary | 不回滚 truth;不发布未 accepted material |
| `DeliverTraceHandoff` | `DeliverTraceHandoff` Job | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | handoff delivery boundary、job run metadata boundary | 不伪 delivered;receipt 后续 marker 确认 |
| `RetryIdentityPropagationFailures` | `RetryIdentityPropagationFailures` Job | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState` | retry selection boundary、issue marker boundary | 只处理 retryable marker;不绕过 policy |

### 19.17 本批审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口是否都有处理流口径 | 通过 | 1 个 Command、3 个 Query、1 个 Consumer、3 个 Job 均有独立处理流;canonical event material 有统一处理 |
| Command 是否只创建 handoff intent | 通过 | `PrepareTraceHandoff` 不执行交付、不标记 delivered、不改变业务 truth |
| Query 是否保持 no-write | 通过 | outbox / handoff Query 均不 publish、deliver、retry 或修复 |
| Consumer 是否只处理外部 marker | 通过 | `HandleTraceHandoffResult` 只消费 receipt / failure marker,不保存 body |
| Outbound Event 是否只来自 accepted fact | 通过 | canonical event material 必须由 accepted change 创建 `IdentityOutboxRecord` |
| Operations Job 是否与 accepted truth 分离 | 通过 | publish / delivery / retry 只更新 propagation state,失败不回滚 truth |
| forbidden body 是否闭合 | 通过 | event / handoff / receipt / publisher response 均禁止正文、package、raw log、secret |
| handoff 是否防伪成功 | 通过 | delivered 只能来自正式 receipt marker |
| retry 是否不绕过 policy | 通过 | retry 复用 publish / deliver guard,只处理 retryable marker |
| 是否下沉到详细实现 | 通过 | 未写 envelope schema、topic routing、receipt schema、adapter、SQL、retry 参数或 runner 调度 |

### 19.18 本批回填草稿

正式 `02-概要设计.md` §8 中,本批可汇总为:

- `PrepareTraceHandoff` 是 trace / audit / archive handoff intent 的显式准备路径,只创建 pending intent,不执行交付,不改变业务 truth。
- `ListPendingIdentityOutbox`、`GetIdentityOutboxState` 和 `GetTraceHandoffState` 是传播 / handoff 状态只读路径,不触发 publish、deliver 或 retry。
- `HandleTraceHandoffResult` 是 handoff receipt / failure marker 的消费路径,只更新 `HandoffState`,不保存 receipt body、archive package 或 raw log。
- canonical outbound events 统一来自前序 accepted change 创建的 `IdentityOutboxRecord`;`PublishIdentityOutbox` 负责发布 pending / retryable outbox 并更新 `OutboxState`。
- `DeliverTraceHandoff` 负责交付 safe material marker,但 delivered 必须等待正式 receipt marker。
- `RetryIdentityPropagationFailures` 只处理 retryable outbox / handoff marker,并复用 publish / deliver guard。
- 本批保持 accepted truth 与传播可靠性分离:publish / handoff 失败不回滚 accepted truth,成功也不产生新业务 fact。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 19.19 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 `PrepareTraceHandoff` 只创建 pending intent | 若不认可,会把 handoff delivery 拉进 command accepted 前置 | 当前只写 intent / state |
| 是否认可 canonical event material 统一由 `PublishIdentityOutbox` 发布 | 若不认可,需回到 8-A~8-E 分散定义 event publish flow | 当前统一发布路径 |
| 是否认可 `Published` 不代表下游业务已处理 | 若不认可,本仓会越界拥有下游 consumer truth | 当前只表达 publish boundary 成功 |
| 是否认可 delivered 必须来自 receipt marker | 若不认可,会出现 handoff 伪成功 | 当前由 `HandleTraceHandoffResult` 确认 |
| 是否认可 topic / envelope / receipt / adapter / retry 参数后移 `03/04` | 若不认可,Step 8 会越界进入详细协议和配置 | 当前只保留 refs、marker 和概要流 |

### 19.20 进入 8-I 的条件

进入 8-I “跨处理流一致性审计”前,需要用户确认:

- `PrepareTraceHandoff`、outbox / handoff Query、`HandleTraceHandoffResult`、canonical outbound material 和 propagation jobs 的处理流粒度可以作为 Step 9 / `03` 输入。
- accepted truth 与 propagation / handoff state 已分离:publish / handoff 失败不回滚 accepted truth,成功不产生新业务 fact。
- event / handoff material 的 body-free、visibility / redaction、no fake delivered、retry 不绕过 policy 口径已满足本批停审。

---

## 20. 8-I 跨处理流一致性审计

### 20.1 审计目标

本批不新增 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、对象、状态或外部接缝。目标是对 8-A~8-H 的处理流做跨批次审计,确认:

- Step 7 接口均有处理流口径或明确未展开理由。
- Step 8 点名对象均能回指 Step 6,没有悬空对象。
- Command / Query / Consumer / Job / Event material 分类没有互相越界。
- query no-write、report-only、forbidden body、eventual propagation、handoff 不伪成功等约束在所有批次一致。
- Step 9 状态机可以从 Step 8 取得触发来源、状态主语和非法方向线索。

### 20.2 接口覆盖审计

| 类别 | Step 7 数量 | Step 8 处理状态 | 结论 |
|---|---:|---|---|
| Command | 6 | `EstablishGlobalMember`、`UpdateGlobalLifecycleState`、`MaintainRoleCapabilitySummary`、`AppendCareerRecord`、`MaintainMemoryReference`、`PrepareTraceHandoff` 均已独立展开 | 通过 |
| Query | 14 | 8-A~8-H 均已按 visibility / stale / degraded / no-write 要求独立展开 | 通过 |
| Inbound Event Consumer | 5 | role source、work participation、memory source、archive handoff、trace handoff result 均已独立展开 | 通过 |
| Outbound Event material | 10 | 前序 accepted material 已在 8-H 统一收敛为 canonical outbox material | 通过 |
| Operations Job | 6 | projection rebuild、reference refresh、reconciliation、outbox publish、handoff delivery、propagation retry 均已独立展开 | 通过 |

未发现 Step 7 接口缺少 Step 8 处理流。未单独画图的 outbound event 不是遗漏,而是被明确收敛为 `IdentityOutboxRecord` material 并由 `PublishIdentityOutbox` 统一发布。

### 20.3 处理流与对象反查审计

| 主要组成部分 | 处理流族 | Step 6 对象承接 | 审计结论 |
|---|---|---|---|
| 身份锚定与成员真相 | 建档 / anchor read | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空对象 |
| 全局生命周期 | lifecycle transition / lifecycle read | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空对象 |
| 角色能力摘要 | role summary command / source consumer / role query | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy`, `ReferenceResolutionState`, `IdentityOutboxRecord` | 无悬空对象 |
| 身份生涯记录 | career append / work consumer / career query | `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空对象 |
| 记忆引用关系 | memory command / source consumer / archive result / memory query | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `ReferenceResolutionState`, `IdentityOutboxRecord` | 无悬空对象 |
| 身份事实消费与追溯 | summary / trace / audit query | `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy`, `ProjectionState` | 无悬空对象 |
| 派生维护与对账 | projection / reference / reconciliation query and job | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport`, `IdentityTraceRecord` | 无悬空对象 |
| 身份事实传播与外部交接 | handoff command / outbox query / callback / publish / delivery / retry | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy` | 无悬空对象 |

对象审计结论与 Step 6 §7.13 保持一致。Step 8 未新增 Step 6 之外的业务对象;topic、target、receipt、cursor、attempt、issue 等均保持为 refs / markers 或后移到 `03/04`。

### 20.4 分类边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Command 是否只表达显式写意图 | 通过 | 6 个 Command 均从 actor / metadata / idempotency 进入;不由 Query、Job 或 Consumer 隐式触发 |
| Query 是否 no-write | 通过 | 14 个 Query 均只读取 truth summary、projection、trace、audit、report、outbox 或 handoff state;不触发 rebuild / refresh / publish / retry |
| Consumer 是否只消费外部已成立事实 / marker | 通过 | 5 个 Consumer 均要求 envelope、source id、dedup 和 body-free marker;不拥有外部 truth |
| Outbound Event 是否只来自 accepted fact | 通过 | event material 只由 accepted command / consumer 创建 `IdentityOutboxRecord`;query、report、stale marker 不产生业务 event |
| Job 是否不是业务 command | 通过 | 6 个 Job 只处理 projection、reference state、report、outbox、handoff 或 retry marker |
| Handoff 是否不伪成功 | 通过 | delivered 必须来自正式 receipt marker;delivery request accepted 只记录 attempt / pending |

### 20.5 跨批次约束审计

| 约束 | 覆盖批次 | 审计结论 |
|---|---|---|
| ref 不复用 | 8-A | `IdentityAnchorPolicy` 保护 existing anchor state;query / job 不创建成员 |
| query no-write | 8-A~8-H | 所有 Query 均明示 no-write;stale / degraded 不触发修复 |
| forbidden body | 8-A~8-H | account、credential、ProjectMember、method body、work body、memory body、archive package、receipt body、runtime body、raw log、secret 均被排除 |
| 高风险 lifecycle basis | 8-B | high-risk target 必须有 `GovernanceBasisRef` / marker;basis body 后移 |
| append-only career | 8-D | correction 也是追加记录,不原地改写旧 career |
| reference-only memory | 8-E | memory / archive 只保存 refs、safe marker 和状态,不保存正文 |
| visibility / redaction | 8-A~8-H | Query、event、handoff 均保留 visibility / redaction boundary;字段级 schema 后移 `03` |
| report-only maintenance | 8-G | reconciliation 只生成 report / finding,不生成 remediation command |
| eventual propagation | 8-A~8-H | accepted truth 与 outbox publish / handoff delivery 分离,失败不回滚 accepted truth |
| retry 不绕过 policy | 8-H | propagation retry 必须复用 publish / delivery guard,只处理 retryable marker |

### 20.6 未展开项一致性审计

| 未展开项 | 出现批次 | 统一处理 |
|---|---|---|
| event publish flow | 8-A~8-E | 统一后移到 8-H `PublishIdentityOutbox` |
| projection rebuild | 8-A~8-F | 统一后移到 8-G `RebuildIdentityProjection` |
| reference refresh | 8-C~8-E | 统一后移到 8-G `RefreshExternalReferenceState` |
| handoff delivery / retry | 8-E / 8-H | 统一由 8-H `DeliverTraceHandoff` / `RetryIdentityPropagationFailures` 处理 |
| external schema / body | 8-A~8-H | 统一后移到 source owner 或 `03/04`;本仓只保留 refs / marker |
| automatic remediation | 8-G | 明确不定义;修复必须回正式 owner command |
| runner schedule / retry config | 8-G / 8-H | 后移 `03/04/07`,不在概要处理流定义 |

未展开项没有形成冲突。所有未展开理由都可回指 Step 3 约束、Step 5 边界或 Step 7 接口骨架。

### 20.7 Step 9 状态承接清单

Step 9 应从本 Step 承接以下状态主语和触发来源:

| 状态主语 | 触发来源 | Step 9 需要明确 |
|---|---|---|
| `IdentityAnchorState` | `EstablishGlobalMember`;retired / tombstone hold 后续 lifecycle 关系 | established、reserved / held、retired hold、tombstone hold、非法复用方向 |
| `GlobalLifecycleState` | `UpdateGlobalLifecycleState` | active / suspended / retired / tombstoned 等状态集合、合法迁移、高风险 basis 前置 |
| `RoleCapabilitySummary` / source state | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged` | draft / active / stale / unavailable / superseded 等概要状态方向 |
| `CareerRecord.record_state` | `AppendCareerRecord`, `HandleWorkParticipationAccepted` | append-only、correction append、duplicate no-op、非法原地修改 |
| `MemoryReferenceState` | `MaintainMemoryReference`, `HandleMemoryReferenceSourceStateChanged`, `HandleArchiveHandoffResult` | linked / stale / unavailable / pending archive / archived / failed 等引用状态方向 |
| `ProjectionState` | `RebuildIdentityProjection`;projection query 只读 | fresh / stale / degraded / rebuild_failed 等 projection 状态,query 不推进 |
| `ReferenceResolutionState` | source consumers, `RefreshExternalReferenceState` | resolved / stale / unavailable / unrecognized / refresh_failed 等引用解析状态 |
| `ReconciliationReport` status | `RunIdentityReconciliation` | no_finding / finding_detected / failed / partial 等 report-only 状态 |
| `OutboxState` | accepted outbox material, `PublishIdentityOutbox`, retry job | pending / published / retryable_failed / failed / skipped_by_policy;published 不代表下游已处理 |
| `HandoffState` | `PrepareTraceHandoff`, `DeliverTraceHandoff`, `HandleTraceHandoffResult`, retry job | pending / delivered / retryable_failed / failed / cancelled;delivered 必须来自 receipt marker |

Step 9 不应新增未在 Step 6 / Step 8 出现的状态主语。若发现状态需要新对象承接,必须回退 Step 6 / Step 8 修正,不能在状态矩阵中临时新增对象。

### 20.8 详细设计承接风险清单

| 风险 | 当前 Step 8 处理 | 后续承接 |
|---|---|---|
| visibility 字段级裁剪未定义 | Step 8 只固定 visibility boundary 和 no-write | `03` query / view contracts |
| event payload / envelope / topic 未定义 | Step 8 只固定 canonical event material 和 outbox boundary | `03/04` |
| handoff target / receipt schema 未定义 | Step 8 只固定 refs / marker 和 no fake delivered | `03/04` |
| retry policy / batch / cursor 未定义 | Step 8 只固定 retry 不绕过 policy | `03/04/07` |
| basis / evidence / safe summary resolver 未定义 | Step 8 只保留 refs / marker | `03` port / protocol contracts |
| projection rebuild source ordering 未定义 | Step 8 只固定 rebuild 不改 truth | `03` persistence / transaction / job details |
| reconciliation finding taxonomy 未定义 | Step 8 只固定 report-only | Step 10 / `03` |

这些风险不阻塞 Step 9,但必须在 Step 12 详细设计承接清单中保留,并在 `03/04/05/06/07` 对应章节闭合。

### 20.9 Step 8 回填草稿

正式 `02-概要设计.md` §8 后续可汇总为:

1. Command 写路径从 actor / metadata / idempotency 进入 application service,经 Step 6 policy / domain object 形成 accepted identity truth、trace、outbox material 或 handoff intent。
2. Query 路径只读 truth summary、projection、trace、audit、report、outbox 或 handoff state,返回 found / not_found / not_visible / stale / degraded / failed marker,不得创建、刷新、重建、发布或修复。
3. Inbound Event Consumer 只消费外部已成立事实或 callback marker,通过 envelope、source id、dedup 和 body-free refs 更新本地 snapshot / reference / append record / handoff state。
4. Operations Job 只能基于已持久化 facts / markers 做 projection rebuild、reference refresh、report-only reconciliation、outbox publish、handoff delivery 或 retry,不得作为业务 command。
5. Outbound Event material 只来自 accepted identity fact,通过 `IdentityOutboxRecord` 统一发布;publish 失败不回滚 accepted truth。
6. Handoff 只交接 safe material marker,delivered 必须由正式 receipt marker 确认,不得保存 receipt body、archive package 或 raw log。
7. Step 8 的状态线索交给 Step 9 收敛,详细 port、DTO、envelope、topic、receipt、retry、SQL 和 adapter schema 后移 `03/04`。

正式正文要等 Step 14 统一装配,当前不直接回填。

### 20.10 Step 8 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 8-A~8-H 的处理流覆盖所有 Step 7 接口 | 若不认可,需回退对应批次补处理流或修正接口骨架 | 当前审计为通过 |
| 是否认可 outbound event 不逐个画 publish flow | 若不认可,Step 8 会明显膨胀并重复 publish 机制 | 当前统一由 `PublishIdentityOutbox` 承接 |
| 是否认可 Step 9 不新增状态主语 | 若不认可,需先回 Step 6 / Step 8 补对象和处理流来源 | 当前要求 Step 9 只承接已出现状态主语 |
| 是否认可 detailed protocol / config / retry 后移 | 若不认可,Step 8 会越界进入 `03/04` | 当前后移 `03/04/07` |

### 20.11 进入 Step 9 的条件

进入 Step 9 “状态定义与状态流转”前,需要用户确认:

- 8-A~8-H 的处理流覆盖、对象反查和分类边界审计通过。
- Step 9 状态主语清单可以作为下一步唯一输入,不得新增未来源于 Step 6 / Step 8 的状态对象。
- query no-write、report-only、forbidden body、eventual propagation、handoff 不伪成功和 retry 不绕过 policy 的跨批次约束已满足 Step 8 停审。
