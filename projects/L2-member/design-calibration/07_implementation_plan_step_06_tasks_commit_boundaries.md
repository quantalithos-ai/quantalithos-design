# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6。
>
> 回填章节：未来 `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`。只复用 phase / batch / boundary / review 的收敛粒度；不复用其 Governance 对象、event/outbox、Job、测试、证据或结论。
>
> 事实边界：以下任务、批次、路径、检查和 commit boundary 均为 future planned contract。目标实现仓不存在，未写代码、未运行检查、未生成 artifact / report / evidence，亦没有 commit 或 readiness。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6：拆分阶段任务、编写顺序与提交边界 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | 07 Step 1～5；正式 `03`、`04`、`05`、`06`；实施计划 / 实施台账 / 可落码性标准 |
| 本步输出 | 本文件；未来正式 §6 回填草稿；planned boundary inventory（仅设计，尚不创建台账骨架） |
| 目标实现仓 | `/home/aris/Projects/quantalithos-member` 不存在；`L2M-DDD-001` 使全部 future implementation activity 保持 blocked |
| 不可越过项 | 不创建实现仓、代码、脚本、artifact、report、implementation ledger 或 boundary skeleton；后两项只允许 Step 13 创建 |
| 停审方式 | 已逐 PH 收稳任务、批次、boundary 与开工复核，并完成逐 boundary 经验复核、粒度审计与回填；用户已授权连续推进，下一动作只能进入 Step 7。 |

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| 07 Step 5 PH-01～PH-08 | 固定能力纵切、顺序、输入、输出和不包含项 | 不改变 phase DAG，不提前定义 Step 7 门禁结论 |
| `03-详细设计.md` §3～§16 | 回指 crate 布局、CP01～CP07、34 对象、10 / 16 / 14 / 24 / 5、28 状态、Port、UoW、replay 与测试切口 | 不复制字段、DTO、trait、flow 或物理产品 |
| `04-配置设计.md` §5～§12 | 回指 profile、strict validation、composition、slot 与 fail-closed 规则 | 不选择 DB、broker、transport、IPC、secret 或部署产品 |
| `05-测试方案.md` §3～§14 | 回指 planned suites、TC、artifact/report 规则、P0/P1 资格 | 不把 planned suite、path 或 evidence candidate 写成执行事实 |
| `06-验收标准.md` §4～§14 | 回指 AC、VF、VETO、evidence、风险接受与送验条件 | 不填写通过、签署或 readiness |
| `03_ddd_step_17_implementation_handoff.md` | 回指 boundary 开工时的 object / protocol / state / Store / test closure入口 | 不将其视作 immutable implementation baseline |
| `设计真相源闭环与可落码性标准.md` §九 | 为每个 boundary 选择适用经验项和失败回流规则 | 不用泛称“遵循标准”替代逐 boundary 审核 |
| `实施计划书写规范.md` 与 `代码实施台账与门禁规范.md` | 固定代码批次、commit 边界、planned ledger 和二次校验纪律 | Step 6 仅设计 path / rules；不预创建 ledger |

## 3. SOP 问题回答

1. **每个阶段内有哪些实施动作，按什么顺序写？**

   每个 PH 都遵循同一受约束顺序：先复核 boundary 的正式 schema / ref / state / test 切口，再写 `contracts` 的有限 carrier，然后写 `domain` factory / legal helper，再写 `application` Port、UoW 与 named service，随后写 `infra` deterministic fake / blocked seam，最后接入 `api`、`worker` 或 `jobs` 的 logical entry 与相关测试。某层不适用可以跳过，不能倒置 public contract 和 business implementation，也不能由 entry 反向补 Store 或 helper。

2. **哪些任务必须同提交，哪些必须分开？**

   一个 boundary 内仅组合构成同一可验证增量的 contract、domain、Port / fake、entry 和 targeted test。CP01 与 CP02、CP02 与 CP03、CP04 与 CP05、CP06 与 CP07、Consumer 与 Job、release scripts 与业务 truth 均独立边界。24 个 outbound semantic candidate 不属于任何业务提交边界；它们只进入 dependency / non-materialization check。

3. **哪些高风险动作必须独立批次？**

   双锚 / credential fail-closed、状态 successor / CAS、non-Query UoW + typed replay、raw-body / redaction fence、Consumer receipt、CP04～CP07 gap / helper、Query no-write、projection rebuild、Job duplicate report、artifact-to-report materialization 都必须成为单独 batch 或受限 boundary。不得把它们藏在“补齐 service”或普通重构中。

4. **什么情况下可 future commit，什么情况下禁止？**

   未来仅当当前 boundary 的 immutable design baseline、目标仓、Design Gate、Scope Gate、planned checks、targeted tests、artifact / report（适用时）、staged diff 和英文 commit message 都满足正式规则时才能 commit。当前任何 boundary 都不可 commit：目标仓、immutable baseline、实际代码和检查均不存在。若字段、DTO、state、Port、Store、helper、external contract 或 evidence source 缺口出现，唯一允许动作是 `wait_design`，而非默认值、private fake map、shadow schema 或跨 boundary 带入。

5. **如何避免实现者自行补设计？**

   每个 boundary 在开工前必须用 §7.1 的设计闭环复核和 §7.5 的经验复核表重新确认；实现者只能二次校验 fixed baseline 与现场条件。发现 `L2M-DDD-*`、`scope_supersede_gap` 或 `L2M-UP-*` 所涉缺口时，记录 blocker 并回写 owning `03` / `04` / `05` / `06` / `07` source；不得以 direct Store update、fake-only lookup、error-string 分支、event/outbox 或外部成功声明替代。

6. **每个 boundary 的实施台账如何安排？**

   每个下表中的 boundary 已预分配 future path `design-calibration/implementation-boundaries/<boundary_id>.md`。这些 path 在 Step 13 的正式 `07` Boundary Gate Matrix 收稳后才会同时创建 planned skeleton；当前不创建文件，且未来 skeleton 不得标记任何 gate 为 `pass`。

## 4. 当前文档问题诊断

| 问题 | 风险 | 本步处理 |
|---|---|---|
| Step 5 只有 phase，无任务 / batch / review 边界 | 实现者会按文件、对象或当天工作量切分 | 为每个 PH 设计动作、批次、commit boundary 与不包含项 |
| 34 / 10 / 16 / 14 / 24 / 5 分母跨 CP 与 crate | 单个 boundary 可能过粗，或漏掉 public carrier / replay | 按 CP 可验证纵切拆 18 个 boundary，并保留有限分母追溯 |
| 24 candidate 容易被误排入 CP04/05 | 形成越权 Event、publisher、outbox、route 或 retry | 所有 boundary 明示 zero-configuration / non-materialization；无 event boundary |
| `L2M-DDD-001~007` 与 scope gap 开放 | 计划若写成“直接实现”会转嫁设计决策 | 受影响 batch 标为 blocked / wait_design trigger；不预设 workaround |
| owner exact seam 未闭合 | host / Runtime / resolver positive integration 会被 fake 伪通过 | P0 只排 local / negative / blocked-aware shape；P1 selected-run 不进本轮 boundary |
| 当前无 immutable baseline / run / evidence | 容易把路径模板、planned check 或 table 写成执行结论 | 所有 completion / check 使用 future 条件；不填 hash、run_id、result 或 verdict |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| phase 到实施动作 | 仅有 PH-01～08 目标 | 每个 PH 有有序任务、batch 和 boundary | 使设计可交给后续实现者执行 |
| commit 粒度 | 未定义 | 18 个可一句话描述的 planned boundary | 支持 review、回退、gate 和 ledger 承接 |
| 高风险逻辑 | 易混入 service / entry 实现 | UoW、replay、CAS、redaction、receipt、Job / evidence 单列复核 | 防止隐性设计缺口 |
| event / external seam | 可能被误作普通依赖 | 24 candidate 全程非物化；external positive 保持 P1 / blocker | 保持 truth owner 与 Core / Bus 边界 |
| implementation ledger | 模板可被过早创建 | 仅记录未来 path；Step 13 才创建 planned skeleton | 不伪造实施状态 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 每个 crate 一笔 commit | 不采用 | crate 横跨多个 CP，无法形成可验证业务增量 |
| 每个 PH 一笔 commit | 不采用 | PH-02～PH-07 均含多项状态 / UoW / entry 风险，边界过粗 |
| 每个 object / struct 一笔 commit | 不采用 | 过细，不能独立验证或回退能力闭环 |
| CP 子能力 + shared replay / entry 纵切 | 采用 | 保持 source truth 先于 read / continuation，并能绑定 targeted checks |
| 为 24 candidate 设 publisher boundary | 不采用 | `L2M-UP-005` 未闭合；会本地 shadow Core / Bus contract |
| 把真实 owner selected-run 混入 P0 boundary | 不采用 | 合同、credential、route、image / host / Runtime mapping 未闭合 |

## 7. 结构化中间产物

### 7.1 通用开工前设计闭环复核

每个 future boundary 在成为 current 前，设计者必须逐项复核下表；任何“适用但未闭合”均为 `blocked / wait_design`。此表不是当前 gate result，也不授权实现。

| 复核项 | 适用条件 | 必查内容 | 未闭合处理 |
|---|---|---|---|
| baseline / target repo | 所有 boundary | immutable design manifest、目标仓、workspace / crate 名和 Core path 存在且一致 | `L2M-DDD-001` / dirty baseline：`wait_design` / wait authorization |
| field / factory | 新增 local truth、attempt、gap、view 或 state | required field、reason、time、actor、version、typed ref 和 factory source 可回指 | 回写 `03` object / flow / state source |
| DTO / carrier construction | Command、Query、Consumer、Job 或 public result | outer / nested carrier、selector、source map、safe error、typed replay surface 完整 | 回写 Step 8 / 9 / protocol source |
| state / transition | factory、successor、attempt、gap、projection 或 entry state | legal helper、reserved edge、expected Store version 与 error mapping 一致 | 禁止 direct Store update；回写 Step 10 / 11 |
| Port / validation truth | service、resolver、handoff、visibility、config 或 external seam | source owner、Port result、unavailable map、no generic resolver / fake-only truth | 回写 Port / config / owner contract |
| UoW / idempotency / replay | non-Query、Consumer、Job | channel / operation / digest / complete typed carrier / commit ordering / CAS 来源完整 | 回写 Step 7 / 11 / 13 |
| Query / projection | Query、view、read model、rebuild | no-write, visibility / freshness marker, view index, committed source and rebuild input | 回写 Step 8～11 / test cut |
| receipt / Job report | Consumer、Job、entry loop | typed save/get, detail refs, duplicate replay, partial item report | `L2M-DDD-003` or report gap：`wait_design` |
| redaction / artifact | log, trace, config, script, report 或 acceptance material | body / secret fence、artifact-report pairing、provenance、human-review boundary | 回写 `04` / `05` / `06` |
| phase boundary | 所有 boundary | 不依赖后续 CP object、positive external result、Event / outbox or final evidence | 拆 / 后移 boundary，或回写 07 |

### 7.2 统一 future 编写与提交纪律

```text
formal design + current boundary reads
  -> contracts / fixture / negative cut
  -> domain factory / legal state helper
  -> application Port / UoW / idempotency / named service
  -> infra deterministic fake / blocked seam / composition
  -> api | worker | jobs logical entry
  -> targeted check and artifact/report rule (if applicable)
  -> boundary review and future commit
```

关键说明：

- `api`、`worker`、`jobs` 不反向拥有 Store、resolver、handoff、UoW 或 domain mutation；本图不是 transport / IPC / scheduler 图。
- 非 Query 的 typed replay 只能由 exact stored carrier 回放；Query 永不形成 digest、reservation 或 write UoW。
- future commit 一笔只对应一个下文 boundary；同 boundary 的 batches 可以分批写、分批验证，但不能把后续 phase 内容混入。
- 所有 `cargo`、script、artifact 或 report 条目均为 future planned check / output，当前未运行且未生成。

### 7.3 Planned boundary inventory

| Phase | Boundary | 一句话可验证目标 | future ledger path | execution posture |
|---|---|---|---|---|
| PH-01 | `commit-01-a` | 建立 seven-library-crate composition 与 Core-only dependency shape | `implementation-boundaries/commit-01-a.md` | blocked by target repo / baseline |
| PH-01 | `commit-01-b` | 建立 strict profile / composition slot 与 gate-report path skeleton | `implementation-boundaries/commit-01-b.md` | blocked by target repo / baseline |
| PH-02 | `commit-02-a` | 建立 CP01 double-anchor、admission / presence 与 local host-material contracts | `implementation-boundaries/commit-02-a.md` | blocked by repo; owner-positive seam remains blocked |
| PH-02 | `commit-02-b` | 建立 CP01 named service、local UoW / replay、fake and API logical entry | `implementation-boundaries/commit-02-b.md` | blocked by repo / credential-host seam |
| PH-03 | `commit-03-a` | 建立 CP02 scope / inbound / screening contract、legal local fact 与 refusal fence | `implementation-boundaries/commit-03-a.md` | blocked by repo; scope successor gap remains blocked |
| PH-03 | `commit-03-b` | 建立 CP02 service、safe worker pre-gate、read surface与 replay rule | `implementation-boundaries/commit-03-b.md` | blocked by repo / screening seam / receipt gap |
| PH-04 | `commit-04-a` | 建立 CP03 delivery decision、submission attempt / result-link contract与 state fence | `implementation-boundaries/commit-04-a.md` | blocked by repo / Runtime mapping |
| PH-04 | `commit-04-b` | 建立 CP03 application orchestration、blocked seam、API command/query local surface | `implementation-boundaries/commit-04-b.md` | blocked by repo / Runtime exact contract |
| PH-05 | `commit-05-a` | 建立 CP04 outbound local decision / material / attempt-gap safe boundary | `implementation-boundaries/commit-05-a.md` | blocked by repo / DDD-004 / owner seam |
| PH-05 | `commit-05-b` | 建立 CP05 append-only trace / observation posture和 redaction read boundary | `implementation-boundaries/commit-05-b.md` | blocked by repo / DDD-005 / observation seam |
| PH-06 | `commit-06-a` | 建立 CP06 owner-specific mirror resolution / gap local boundary | `implementation-boundaries/commit-06-a.md` | blocked by repo / DDD-006 / owner resolver contracts |
| PH-06 | `commit-06-b` | 建立 CP07 committed-only projection、summary / outlet / diagnostic no-write surface | `implementation-boundaries/commit-06-b.md` | blocked by repo / DDD-007 |
| PH-07 | `commit-07-a` | 建立 10 external Consumer finite entry / pre-gate / refusal posture | `implementation-boundaries/commit-07-a.md` | blocked by repo / DDD-003 / external sources |
| PH-07 | `commit-07-b` | 建立 4 committed-fact Consumer entry / receipt replay / source fence | `implementation-boundaries/commit-07-b.md` | blocked by repo / DDD-003 / source closure |
| PH-07 | `commit-07-c` | 建立 five Job carrier、report / duplicate replay和 logical entry | `implementation-boundaries/commit-07-c.md` | blocked by repo / report closure |
| PH-07 | `commit-07-d` | 建立 five local continuation Job orchestration / partial isolation boundary | `implementation-boundaries/commit-07-d.md` | blocked by repo / DDD-004~007 |
| PH-08 | `commit-08-a` | 建立 release gate / checks and artifact-to-report generator capability | `implementation-boundaries/commit-08-a.md` | blocked by repo / real execution absent |
| PH-08 | `commit-08-b` | 建立 local smoke and acceptance-draft generation path without verdict | `implementation-boundaries/commit-08-b.md` | blocked by repo / real evidence and review absent |

### 7.4 Phase task, batch and commit-boundary design

### PH-01 Foundation / composition skeleton

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-01-01` | 1 | 核验 implementation authorization、immutable design manifest、target repo、Rust / Core compatibility | Step 3 reading;`03` §3～4 | boundary-local baseline record and compatibility decision | 仅当 baseline / repo / Core path 均可核验才允许后续实现；否则 `wait_design` |
| `IMPL-01-02` | 2 | 建立 workspace、七个 library crate 和 inward dependency skeleton | `03` §4～5 | planned Cargo workspace / crate roots | crate 名、library-only 和 only-Core compile classification 可检查 |
| `IMPL-01-03` | 3 | 接入 strict config profiles、validated composition slots 与 unavailable mapping | `04` §5～11 | config loader / profile fixture / builder seam | invalid / missing / blocked slot 保持 fail-fast or safe unavailable |
| `IMPL-01-04` | 4 | 建立 planned gate / check / report root capability | `05` §9、§13;`06` §10 | scripts and output-path capability | generator 只能处理实际 future input，不产生 pass / EV / verdict |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-01-01` | workspace、seven library crate 与 dependency direction | baseline;`03` §3～4 | workspace / `contracts`…`jobs` library skeleton | 100～300 行，超过则按 crate root 拆分 | `cargo fmt --check`;`cargo check`;dependency-boundary | `commit-01-a` |
| `BATCH-01-02` | Core-only compile candidate、naming / path checks | `03` §3、§13;Step 3 | dependency guard and naming check | 100～200 行 | dependency-boundary;`git diff --check` | `commit-01-a` |
| `BATCH-01-03` | strict profile / builder-slot skeleton | `04` §6～11 | four profile fixtures and config / builder seam | 100～300 行 | config-redline;config parse smoke | `commit-01-b` |
| `BATCH-01-04` | gate / check / report script capability and output root | `05` §9、§13;`06` §10 | scripts skeleton, artifact/report path handling | 100～300 行 | script dry-run;report path static check | `commit-01-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-01-a` | workspace、命名、Core-only dependency check 均通过后 | Cargo workspace、七 library crate root、Core candidate 和 dependency guard | config、business carrier、domain truth、entry、test result | Design / Scope / Worktree Gate；fmt、check、dependency-boundary、diff check |
| `commit-01-b` | profile / builder-slot / script capability dry-run 通过后 | profile、strict validation、composition slot、gate/check/report path generator skeleton | business flow、real adapter、artifact / report / evidence instance、release conclusion | Design / Scope / Worktree Gate；config-redline、dry-run、check、diff check |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-01-a` | workspace root + naming + Core classification | 三者共同固定后续 crate 的可编译、可审查边界 | 01-01 / 01-02 | profiles、scripts、所有 CP 实现 |
| `commit-01-b` | strict profile + composition slots + generator roots | 配置不可用姿态与后续 gate/report path 需共同可检查 | 01-03 / 01-04 | 真实执行输出、acceptance conclusion |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-01-a` | target repo、baseline、crate / package name、Core actual export / rust-version | `blocked` | `L2M-DDD-001`、dirty baseline、Core compatibility 未核验前不得创建 workspace |
| `commit-01-b` | config source / profile / unavailable mapping、artifact-report path、no static-pass rule | `blocked` | repo / baseline 缺失；配置 schema 若漂移回写 `04` |

### PH-02 CP01 presence + host local surface

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-02-01` | 1 | 构造 CP01 double-anchor、startup admission、presence、host material / attempt public and domain surface | `03` §5～9;Command 001～004 | CP01 carrier、factory、legal state helpers | invalid / third subject / owner mismatch fail closed |
| `IMPL-02-02` | 2 | 构造 Presence / Host service 的 Store、UoW、idempotency 和 local blocked posture | `03` §6、§8、§10～12 | named service / Port / fake semantics | typed carrier before complete；CAS and exact replay remain local |
| `IMPL-02-03` | 3 | 映射 Command 001～004、Query 001～002 与 HostFeedback Consumer 的 logical entry / safe result | `03` §7～8;`05` CP01 cuts | API / worker local boundary | no host lifecycle / health / session / IPC claim |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-02-01` | CP01 contracts / domain factories / legal presence transitions | CP01 object and state sources | double-anchor, admission, presence, material / attempt carriers | 200～400 行，state helper 单独审查 | contract-domain-fast | `commit-02-a` |
| `BATCH-02-02` | CP01 service / Store fake / UoW / replay | CP01 flows and persistence | Presence / Host local service and deterministic fake | 300～500 行，UoW/replay独立验证 | service-flow-fast;infra-fake-parity;replay-recovery | `commit-02-b` |
| `BATCH-02-03` | CP01 API / worker logical entry and negative tests | Command / Query / Consumer source maps | finite entry mapping and safe refusal | 150～300 行 | api-worker-entry;redaction-boundary | `commit-02-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-02-a` | CP01 contract/domain/state tests 可独立通过后 | double anchor、admission / presence / material / attempt contract、factory、legal transition和 negative tests | Store implementation、UoW、host IPC / acceptance、API / worker entry | contract-domain-fast；state / subject fence；diff check |
| `commit-02-b` | local service、fake、entry 与 exact replay tests 可独立通过后 | CP01 named service、application Ports、deterministic fake、Commands 001～004 / Queries 001～002 / HostFeedback logical entry | credential issuing、host session / health / lifecycle、IPC、positive host success | service-flow-fast；infra-fake-parity；api-worker-entry；replay-recovery；redaction-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-02-a` | subject anchor + CP01 local fact + legal transition | 同一 factory / state boundary共同防止错误执行主语和非法 presence | 02-01 | service / adapter / external result |
| `commit-02-b` | UoW service + fake parity + logical entries | entry 只能经 named service，且 duplicate 必须回放同一 typed carrier | 02-02 / 02-03 | host positive integration、transport |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-02-a` | `MemberSubjectAnchor`、StartupAdmission / MemberPresence factory、state helper、expected version | `blocked` | repo/baseline；credential form and subject contracts retain `L2M-UP-006/008` safe fence |
| `commit-02-b` | Command / receipt carrier、operation context、UoW ordering、HostCollaborationPort outcome | `blocked` | `L2M-UP-001/006`：只允许 local / blocked path；不得 shadow IPC |

### PH-03 CP02 scope + inbound screening

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-03-01` | 1 | 构造 scope decision、body-free inbound fact、screening decision / policy及 Command 005～006 carrier | `03` CP02;state / protocol source | local CP02 contracts and legal factory surface | unknown / stale rule is not converted to allow |
| `IMPL-03-02` | 2 | 构造 scope / inbound named service与 UoW / replay / Store fake | `03` flow / persistence | safe local mutation / refusal handling | `ReplaceSubscriptionScope` remains blocked until helper exists |
| `IMPL-03-03` | 3 | 构造 InboundFactConsumer pre-gate及 Query 003～004 logical surface | `03` Consumer / Query source | body-free entry / no-write read surface | no Bus delivery / raw body / policy body |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-03-01` | scope / inbound / screening contracts and domain fences | CP02 object / state matrix | body-free CP02 carrier、four-state policy、refusal cases | 250～450 行 | contract-domain-fast;redaction-boundary | `commit-03-a` |
| `BATCH-03-02` | scope / screening application flow and fake UoW | Command 005～006 flows | service, Store fake, typed replay | 250～500 行; supersede lane separate | service-flow-fast;infra-fake-parity;replay-recovery | `commit-03-b` |
| `BATCH-03-03` | inbound Consumer pre-gate and Query no-write entry | Consumer / Query maps | finite worker/API surface and negative fixtures | 200～350 行 | api-worker-entry;service-flow-fast;redaction-boundary | `commit-03-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-03-a` | CP02 carrier、factory、four-state and body-free guards 通过后 | scope / inbound / screening contracts、domain policy、state / redaction negative tests | scope replacement execution、Store / service、Bus adapter、raw body | contract-domain-fast；redaction-boundary；state fence |
| `commit-03-b` | local CP02 service、pre-gate、Query no-write和 exact replay通过后 | Command 005 safe lane、InboundFactConsumer pre-gate、Query 003～004、service / fake / entry tests | `ReplaceSubscriptionScope` successor implementation、allowlist、policy body、Bus wire / ack | service-flow-fast；api-worker-entry；infra-fake-parity；replay-recovery；redaction-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-03-a` | scope + inbound fact + screening fence | 三者共同确保 intake 无 raw body 且不可 fail-open | 03-01 | UoW / worker dispatch / replacement helper |
| `commit-03-b` | service + deterministic fake + worker/API pre-gate | pre-gate、application transaction 与 no-write read surface需共享有限 carrier | 03-02 / 03-03 | Bus delivery / policy truth / supersede workaround |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-03-a` | source-backed scope、screening classification、body-free DTO / reason | `blocked` | repo/baseline；`L2M-UP-007` unknown policy必须拒绝 / blocked |
| `commit-03-b` | `Active -> Superseded` helper、Consumer receipt typed save/get、worker source mapping | `blocked` | `scope_supersede_gap`、`L2M-DDD-003`；affected lane `wait_design`，不 private Store save |

### PH-04 CP03 Runtime mediation local boundary

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-04-01` | 1 | 构造 delivery decision、submission attempt、result link、material reception及 Command 007～008 carrier | `03` CP03 / protocol / state | CP03 contracts、factory and legal local state surface | local decision / attempt never becomes Runtime run / outcome |
| `IMPL-04-02` | 2 | 构造 Runtime mediation service、typed resolver / entry Port、local UoW / replay和 blocked seam | `03` §6～13 | local application / fake / availability surface | exact mapping absent returns blocked / waiting / unknown |
| `IMPL-04-03` | 3 | 构造 Commands 007～008、Queries 005～006和 RuntimeMaterialConsumer logical entry | `03` §7～8;`05` CP03 cuts | API / worker logical mapping | no raw Runtime body, trigger client or external admission truth |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-04-01` | CP03 carrier / factory / state fence | delivery, attempt, link, reception source | contracts/domain and negative transitions | 250～450 行 | contract-domain-fast;redaction-boundary | `commit-04-a` |
| `BATCH-04-02` | CP03 service / resolver-port / UoW / fake | flow and persistence source | named service and blocked Runtime seam | 300～500 行，replay独立验证 | service-flow-fast;infra-fake-parity;replay-recovery | `commit-04-b` |
| `BATCH-04-03` | CP03 API / worker logical entry | Commands / Queries / Consumer source maps | entry mapping and no-write test | 200～350 行 | api-worker-entry;service-flow-fast;redaction-boundary | `commit-04-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-04-a` | CP03 carrier、factory、legal / illegal state tests通过后 | decision / attempt / link / reception contracts、domain factories、state fence | Runtime Port implementation、UoW service、transport trigger、Runtime client | contract-domain-fast；redaction-boundary；state / subject fence |
| `commit-04-b` | CP03 application local path、fake / blocked seam和 entry tests通过后 | resolver / entry Port abstraction、service / fake、Commands 007～008、Queries 005～006、RuntimeMaterialConsumer entry | Runtime loop/context/plan/outcome、formal trigger mapping、positive Runtime success | service-flow-fast；api-worker-entry；infra-fake-parity；replay-recovery；redaction-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-04-a` | decision + submission attempt + result / reception carrier | 局部状态分层和 source correlation 必须使用同一 typed reference discipline | 04-01 | service / Runtime adapter / external result |
| `commit-04-b` | named service + blocked seam + API/worker mapping | entry 必须通过同一 local UoW / replay path且错误不能被外部状态升级 | 04-02 / 04-03 | Runtime client、run / outcome truth |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-04-a` | Runtime typed ref、correlation、attempt state helper、safe reception body-free surface | `blocked` | repo/baseline；无正式 mapping 时仅 local contract/negative cut |
| `commit-04-b` | `RuntimeContractResolverPort` / `RuntimeEntryPort` result category、stored carrier、consumer source | `blocked` | `L2M-UP-003/004`；不得实现 trigger client或造 Runtime acceptance |

### PH-05 CP04 outbound + CP05 trace / observation

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-05-01` | 1 | 构造 CP04 outbound decision、safe material、publication attempt / gap和 Queries 007～008 | committed CP03 local fact;`03` CP04 | local safe material / attempt-gap surface | decision / material / attempt does not claim delivery or acceptance |
| `IMPL-05-02` | 2 | 构造 CP05 trace entry、interaction gap、observation material / attempt和 Queries 009～011 | committed CP01～04 facts;`03` CP05 | append-only redacted trace / observation posture | no complete log, observed state or evidence truth |
| `IMPL-05-03` | 3 | 构造 CP04 / CP05 named service、Store fake、local handoff / feedback seam及 finite read mapping | `03` §7～15 | service / fake / safe observation / redaction boundary | no publisher, outbox, route, delivery / observed success |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-05-01` | CP04 outbound carrier / decision / material / attempt-gap fences | CP04 object / flow / state | contracts/domain and safe refusal cases | 250～450 行 | contract-domain-fast;redaction-boundary | `commit-05-a` |
| `BATCH-05-02` | CP04 service / local handoff seam / read posture | CP04 Port and persistence | application / fake / Queries 007～008 | 250～500 行 | service-flow-fast;infra-fake-parity;replay-recovery | `commit-05-a` |
| `BATCH-05-03` | CP05 trace / gap / observation contracts and append-only policy | CP05 object / state / telemetry source | domain trace / observation safe carrier | 250～450 行 | contract-domain-fast;redaction-boundary | `commit-05-b` |
| `BATCH-05-04` | CP05 service / fake / Queries 009～011 and feedback local boundary | CP05 flow / Store / Query source | application / fake / read mapping | 250～500 行 | service-flow-fast;infra-fake-parity;redaction-boundary | `commit-05-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-05-a` | CP04 contracts、local service、safe read / replay tests通过后 | outbound decision / material / publication local attempt-gap, handoff Port abstraction, Queries 007～008, fake and targeted tests | Event / publisher / outbox / route / topic / retry / DLQ、downstream delivery / accepted fact | contract-domain-fast；service-flow-fast；infra-fake-parity；replay-recovery；redaction-boundary |
| `commit-05-b` | CP05 contracts、append-only service、safe read / redaction tests通过后 | trace / interaction gap / observation local posture, Queries 009～011, fake and targeted tests | observability backend、complete log、observed / evidence truth、external feedback success | contract-domain-fast；service-flow-fast；infra-fake-parity；redaction-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-05-a` | safe material + local attempt/gap + read posture | material and attempt/gap must preserve same source / correlation boundary and no delivery claim | 05-01 / 05-02 | all 24 candidate materialization and external delivery |
| `commit-05-b` | trace / observation body-free facts + redacted reads | append-only relation and outward-safe read must prevent hidden body leakage together | 05-03 / 05-04 | backend logging, observed/evidence truth |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-05-a` | publication attempt / gap helper、handoff result category、source / result correlation、no Event inventory | `blocked` | `L2M-DDD-004`、`L2M-UP-004/005`; no direct state / outbox workaround |
| `commit-05-b` | append-only trace factory、observation attempt-gap relation、redaction / safe telemetry mapping | `blocked` | `L2M-DDD-005`; backend / observation positive remains external |

### PH-06 CP06 mirror + CP07 read model

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-06-01` | 1 | 构造 owner-specific snapshot / resolution / gap和 Commands 009～010、Queries 012～013 | `03` CP06;owner-safe refs | mirror contract / legal local resolution posture | no generic resolver, foreign truth, authorization or health |
| `IMPL-06-02` | 2 | 构造 CP06 application resolver seams、Store fake、refresh refusal / exact replay | flow / persistence / config source | owner-specific Port / blocked seam / local service | unavailable / stale stays safe gap / waiting / blocked |
| `IMPL-06-03` | 3 | 构造 CP07 projection state / views、Queries 014～016和 capability outlet non-authorizing surface | committed local facts / CP06 resolution | summary / outlet / diagnostic read model | Query / projection does not repair source truth |
| `IMPL-06-04` | 4 | 构造 projection service、visibility basis、fake / API entry and no-write guard | CP07 flow / Store / test cuts | committed-only projection and logical API surface | stale / degraded / not-visible are explicit and no-write |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-06-01` | CP06 contracts / domain resolution-gap fence | owner-specific refs and CP06 state | snapshot / resolution / gap carriers, Commands 009～010 | 250～450 行 | contract-domain-fast;redaction-boundary | `commit-06-a` |
| `BATCH-06-02` | CP06 service / resolver seam / fake / Queries 012～013 | CP06 flow / persistence | named service, blocked resolver, no-write read | 250～500 行 | service-flow-fast;infra-fake-parity;replay-recovery | `commit-06-a` |
| `BATCH-06-03` | CP07 contracts / projection state / views | committed-fact and view sources | summary / outlet / diagnostic carrier | 250～450 行 | contract-domain-fast;projection-readmodel | `commit-06-b` |
| `BATCH-06-04` | CP07 projection service / visibility / API query mapping | CP07 flow / query tests | projection fake, Queries 014～016, no-write guard | 300～500 行 | projection-readmodel;service-flow-fast;api-worker-entry | `commit-06-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-06-a` | CP06 carrier、local service、resolver-blocked and query tests通过后 | snapshots / resolutions / gaps, Commands 009～010 safe lane, Queries 012～013, owner-specific Port abstraction, fake / replay tests | generic resolver、foreign body / authorization / health truth、direct refresh bypass | contract-domain-fast；service-flow-fast；infra-fake-parity；replay-recovery；redaction-boundary |
| `commit-06-b` | CP07 projection / query / no-write / visibility tests通过后 | projection state / views, Queries 014～016, read model service / fake, API query mapping | source repair、Tool registry / invocation / grant、generic SDK / UI | projection-readmodel；service-flow-fast；api-worker-entry；dependency-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-06-a` | owner-safe resolution + local gap + no-write read | safe resolution, stale and gap semantics must share one typed owner-specific boundary | 06-01 / 06-02 | generic external adapter / truth |
| `commit-06-b` | committed-only projection + safe views + API mapping | view source, freshness surface and entry disposition must prevent projection repair / invocation implication | 06-03 / 06-04 | source truth repair / capability execution |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-06-a` | source / purpose / scope mapping、resolution-gap helper、refresh relation, stored result | `blocked` | `L2M-DDD-006`; `L2M-UP-001/003/007` owner resolver details stay safe / blocked |
| `commit-06-b` | projection input source, version/CAS provenance, visibility / degraded marker, outlet non-authorizing mapping | `blocked` | `L2M-DDD-007`; must not synthesize view or pseudo-version |

### PH-07 Consumers + Jobs + replay continuation

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-07-01` | 1 | 固定 10 external Consumer 的 source/schema/body/dedup/ordering pre-gate 与 refusal surface | `03` §7～8;`05` Consumer cuts | finite worker entry contracts | no generic listener, ack, DLQ, raw body or external success |
| `IMPL-07-02` | 2 | 固定 4 committed-fact Consumer 的 committed source、receipt / trace / projection relation | CP01～CP07 committed facts | local continuation entry and typed receipt | no arbitrary Store scan or semantic candidate consumption |
| `IMPL-07-03` | 3 | 构造五类 Job carrier、stored report、duplicate replay与 entry mapping | `03` Job contract;`05`/`06` Job gates | finite logical Job surface | report fields symmetric across finish/save/get/replay |
| `IMPL-07-04` | 4 | 构造 Consumer / Job application continuation、partial isolation、replay / unknown / rollback handling | Steps 9/11/12/13 | local reports and continuation effects | no source-truth repair; reserved helper remains blocked |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-07-01` | external Consumer contracts and pre-gates | 10 Consumer source maps | worker carriers, rejection / blocked result | 250～450 行 | contract-domain-fast;api-worker-entry;redaction-boundary | `commit-07-a` |
| `BATCH-07-02` | committed-fact Consumer receipts and source fence | four committed Consumer flows | typed receipt / trace / projection relation | 250～450 行 | api-worker-entry;replay-recovery;projection-readmodel | `commit-07-b` |
| `BATCH-07-03` | Job shared carrier, report and idempotency surface | five Job schemas | job request/result/report, typed save/get | 250～450 行 | contract-domain-fast;job-continuation;replay-recovery | `commit-07-c` |
| `BATCH-07-04` | Job continuation orchestration and partial isolation | Job flow / Store / state source | logical runners and item-level report | 300～500 行，按 Job kind 分验证 | job-continuation;infra-fake-parity;replay-recovery | `commit-07-d` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-07-a` | 10 external Consumer contract / pre-gate / refusal tests通过后 | external source and schema checks, body-free gate, finite worker mapping | accepted receipt reconstruction、broker ack / listener / DLQ、positive external integration | contract-domain-fast；api-worker-entry；redaction-boundary |
| `commit-07-b` | 4 committed-fact Consumer source / receipt / relation tests通过后 | committed source refs, receipt / trace / projection local continuation | semantic event candidates、arbitrary Store scan、source repair | api-worker-entry；replay-recovery；projection-readmodel |
| `commit-07-c` | five Job public carrier / report / duplicate tests通过后 | Job metadata/input/output/report, typed stored report and exact replay | concrete resolver / handoff runner、scheduler、final acceptance verdict | contract-domain-fast；job-continuation；replay-recovery |
| `commit-07-d` | local continuation runners、partial isolation、report tests通过后 | five logical Job application flows, finite entry, item isolation and blocked outcomes | source-truth repair、blind retry、external delivery / observation claim | job-continuation；infra-fake-parity；replay-recovery；redaction-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-07-a` | external Consumer pre-gates + safe refusal | source/schema/body validation is the single boundary before application dispatch | 07-01 | broker or external acceptance |
| `commit-07-b` | committed-fact entry + receipt relation | committed source and receipt / local continuation must share exact relation | 07-02 | source scan / event materialization |
| `commit-07-c` | Job carrier + stored report + duplicate replay | public job surface cannot be split from its result carrier and replay contract | 07-03 | runner side effects |
| `commit-07-d` | runner + partial report + unknown fence | item isolation and report semantics are one verifiable continuation increment | 07-04 | source repair / scheduler |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-07-a` | 10 external source identities、schema/body gate、entry context、rejected receipt | `blocked` | `L2M-DDD-003` and `L2M-UP-001~007`; no default source / authority |
| `commit-07-b` | committed fact source cursor、receipt trace ref、projection marker and duplicate | `blocked` | `L2M-DDD-003`、`L2M-DDD-007`; no reconstruction from current truth |
| `commit-07-c` | Job selector、report detail refs、typed save/get、digest and result kind | `blocked` | public job surface closure required; no generic report shell |
| `commit-07-d` | policy executable summary、scope expansion、version / cursor provenance、partial failure | `blocked` | `L2M-DDD-004~007`; only local / blocked-aware runner can be planned |

### PH-08 Release gates + reports + acceptance handoff

| 任务编号 | 顺序 | 实施动作 | 输入 | future 输出 | future 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-08-01` | 1 | 组合 P0 release gate、config / dependency / redaction / report-pair checks | `05` §9/13;`06` §10/11 | gate orchestration capability | all checks consume actual run inputs; no static pass |
| `IMPL-08-02` | 2 | 从 raw suite artifact 生成 readable reports / evidence index | `05` evidence schema;`06` EV rules | report / index generator | every entry has artifact, report, digest, disposition and source refs |
| `IMPL-08-03` | 3 | 运行固定 local-smoke and redline scenario path | `05` release gates | fixed-run artifacts and reports | smoke is business path, not test-count proxy |
| `IMPL-08-04` | 4 | 生成 acceptance handoff、VETO、risk / open-issues drafts | `06` §12～14 | human-reviewable draft bundle | scripts never self-declare verdict / signoff / readiness |

| 批次编号 | 目标 | 输入 | future 输出 | 预计规模 | future 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-08-01` | gate orchestration / static boundary checks | suite and check matrix | release gate scripts and check outputs | 250～450 行 | release gate dry-run;dependency-boundary;config-redline | `commit-08-a` |
| `BATCH-08-02` | artifact-to-report and evidence index shell | artifact/report schema | report and index generator capability | 200～400 行 | report-generation-audit;redaction-boundary | `commit-08-a` |
| `BATCH-08-03` | local-smoke fixed scenario | CP01～CP07 P0 path | smoke runner and raw artifact contract | 250～450 行 | local-smoke;release-redline | `commit-08-b` |
| `BATCH-08-04` | VETO / risk / handoff draft generation | `06` evidence / VETO / risk rules | acceptance report drafts | 250～450 行 | report-generation-audit;redaction-boundary | `commit-08-b` |

| 提交边界 | future commit 时机 | 包含 | 不包含 | future 提交前门禁 |
|---|---|---|---|---|
| `commit-08-a` | gate / report generator dry-run and no-static-evidence check通过后 | release orchestration, dependency/config/redaction checks, minimal evidence index capability | final smoke result、VETO passed claim、signoff、production adapter | release gate dry-run；report-generation-audit；dependency-boundary；diff check |
| `commit-08-b` | authorized fixed run 的 smoke、report audit、VETO / handoff draft generation通过后 | local-smoke path, report/evidence mapping, VETO/risk/open-issues/handoff drafts | manual verdict, signoff, readiness, new business feature | local-smoke；release-redline；report-generation-audit；redaction-boundary；dependency-boundary |

| Boundary | 子功能分组 | 必须同提交的原因 | 批次 | 不包含 |
|---|---|---|---|---|
| `commit-08-a` | gate shell + report/index shell | gate runner and report source contract must agree on paths and dispositions | 08-01 / 08-02 | final acceptance conclusion |
| `commit-08-b` | smoke + acceptance drafts | final handoff material must derive from the same fixed-run artifact/report set | 08-03 / 08-04 | manual signoff / readiness |

| Boundary | 重点开工复核 | 设计层结论 | 阻塞 / 处理 |
|---|---|---|---|
| `commit-08-a` | artifact root、run / digest、report pairing、redaction / dependency source | `blocked` | no target repo, run or real artifact; remain planned only |
| `commit-08-b` | smoke scenario、EV / VETO provenance、human review responsibility、P0/P1 separation | `blocked` | real execution and review absent; no pass / signoff claim |

### 7.5 Commit boundary 经验复核总表

下表按 `设计真相源闭环与可落码性标准.md` §九选择每个 boundary 的高风险经验项。`设计层结论 = blocked` 是当前事实：目标仓、baseline 或所列设计缺口未闭合；它不是测试失败，也不是允许实现的 `pass`。

| Boundary | 涉及设计面 | 适用经验项 | 当前结论 | 主要 blocker / 回写入口 |
|---|---|---|---|---|
| `commit-01-a` | workspace / dependency | path baseline、Core export / version、phase boundary | `blocked` | DDD-001；`03` §3～4、Step 3 |
| `commit-01-b` | config / artifact paths | config binding、artifact materialization、phase boundary | `blocked` | dirty baseline / repo；`04` §6～11、`05` §13 |
| `commit-02-a` | subject / state / factory | field、DTO、state、ref identity、subject mapper | `blocked` | UP-006/008；`03` §5～10、Step 6/10 |
| `commit-02-b` | service / UoW / replay | idempotency、stored carrier、CAS、entry context factory | `blocked` | UP-001/006；DDD-001/003 |
| `commit-03-a` | scope / screening | validation truth、body-free snapshot、state、redaction | `blocked` | UP-007；`03` CP02、Step 8/9 |
| `commit-03-b` | scope successor / receipt | state helper、typed receipt save/get、sidecar read | `blocked` | scope_supersede_gap、DDD-003 |
| `commit-04-a` | Runtime carrier / state | field、DTO、ref identity、state、body-free | `blocked` | UP-003/004 |
| `commit-04-b` | Runtime service / entry | entry context factory、adapter outcome、idempotency、phase boundary | `blocked` | UP-003/004；no trigger mapping |
| `commit-05-a` | outbound material / handoff | accepted side-effect inventory、adapter outcome、ref-scope、no outbox | `blocked` | DDD-004、UP-004/005 |
| `commit-05-b` | trace / observation | history / trace construction、redaction、marker subject | `blocked` | DDD-005；backend external |
| `commit-06-a` | mirror / refresh | resolver dispatch、scope index、typed snapshot read、version | `blocked` | DDD-006; UP-001/003/007 |
| `commit-06-b` | projection / Query | projection rebuild input、visibility resolution、stale identity、no-write | `blocked` | DDD-007 |
| `commit-07-a` | external Consumer | source identity、entry context、body gate、receipt surface | `blocked` | DDD-003; UP external contracts |
| `commit-07-b` | committed Consumer | source cursor、marker trace、receipt replay、projection marker | `blocked` | DDD-003/007 |
| `commit-07-c` | Job public surface | job surface、report field symmetry、typed save/get、idempotency | `blocked` | report / source closure |
| `commit-07-d` | Job continuation | policy summary、scope expansion、version/cursor、partial isolation | `blocked` | DDD-004~007 |
| `commit-08-a` | gate / report shell | artifact materialization、path baseline、phase boundary | `blocked` | DDD-001; no real run |
| `commit-08-b` | smoke / acceptance handoff | evidence source、VETO closure、redaction、phase boundary | `blocked` | no artifact / report / review |

### 7.6 提交粒度、停审与跨 boundary 审计

| Boundary group | 一句话描述 | 粒度判断 | 可独立 review / 验证 / 回退 | 设计层停审结论 |
|---|---|---|---|---|
| PH-01 `commit-01-a/b` | 先固定可编译组合，再固定配置和证据路径 | 适中 | 是（future） | 保留；不包含业务实现 |
| PH-02～PH-04 `commit-02`～`04` | 依次形成 CP01、CP02、CP03 的 local / blocked-aware vertical slice | 适中 | 是（future） | 保留；高风险 state / replay 分批 |
| PH-05 `commit-05-a/b` | 分离 outbound safe material 与 trace / observation safe facts | 适中 | 是（future） | 保留；无 Event / publisher boundary |
| PH-06 `commit-06-a/b` | 先 owner-safe mirror，再 committed-only projection / read | 适中 | 是（future） | 保留；不修 source truth |
| PH-07 `commit-07-a/b/c/d` | Consumer pre-gate、committed continuation、Job report、Job runner 分层 | 适中 | 是（future） | 保留；receipt / report 缺口阻塞 |
| PH-08 `commit-08-a/b` | 最后从真实 artifact 生成 release reports / handoff drafts | 适中 | 是（future） | 保留；不得静态 pass |

#### 跨 boundary 粒度 / 依赖 / 门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 phase 均有任务、batch、boundary 与不包含项 | `pass_for_design` | 执行期仍须逐 boundary Design Gate |
| boundary 按可验证能力而非对象 / 文件拆分 | `pass_for_design` | 不得退化为函数级提交 |
| contracts 先于 domain，domain 先于 application，entry 后置 | `pass_for_design` | 不得因缺口倒置实现顺序 |
| Query no-write 与 projection no-repair 没有被后续 Job 越过 | `pass_for_design` | Step 7 / 12 仍需写 gate evidence |
| Consumer / Job 不读取未提交 truth | `pass_for_design` | DDD-003～007 closure 前保持 blocked |
| 24 semantic candidates 未被任何 boundary 物化 | `pass_for_design` | `L2M-UP-005` 关闭前只做 dependency check |
| 每个 boundary 有 targeted future gate | `pass_for_design` | 当前未运行，不得填 pass |
| 每个 boundary 有经验复核入口和责任人 | `pass_for_design` | 设计者移交前必须逐项重核 |
| boundary 不依赖后续 phase 的结果 / evidence | `pass_for_design` | PH-08 才生成最终证据路径 |
| 目标仓、baseline、external / DDD 缺口是否已消除 | `blocked` | 保留 blocker，不能宣称可实现 |

### 7.7 开工前与提交前总检查清单

未来每个 current boundary 必须按以下顺序执行；当前全部仅为 planned 规则：

1. 读取项目级台账、当前 boundary 台账、正式 `03/04/05/06/07` 与本 boundary required calibration。
2. 记录 immutable design baseline、目标 implementation repo、工作区初始状态和用户无关改动。
3. 完成字段、DTO、state、typed-ref、validation truth、metadata / idempotency、projection / job / artifact、phase boundary 复核；适用项未闭合即 `blocked / wait_design`。
4. 只修改 allowed scope，先完成当前 batch 的 targeted checks，再判断 boundary 是否可提交。
5. 未来提交前运行适用的 `cargo fmt --check`、`cargo check`、targeted tests、`git diff --check`、dependency / redaction / report checks；未运行不能写 `pass`。
6. staged diff 只含当前 boundary，commit message 使用英文 `type(scope): subject`，一 boundary 一笔 commit；body 按 Step 6 子功能分组，必要时用 `git commit -F`。
7. 提交后写回 hash、实际 checks、剩余 blocker、用户改动保护和下一 boundary；当前设计任务不执行此链路。

## 8. 回填草稿

未来正式 `07-实施计划.md` §6 应保留：PH-01～PH-08 各阶段的有序实施动作；统一 `contracts → domain → application → infra → api/worker/jobs → targeted checks` 的编写顺序；18 个 `commit-01-a`～`commit-08-b` boundary 的一句话目标、包含 / 不包含、批次和提交前门禁；每个 boundary 的设计者开工前闭环复核、经验复核、停审和 implementation-boundary 台账路径。正式正文不复制字段或函数 schema；字段、状态、Port、protocol、flow、Store 和 test cut 回指 `03`、`04`、`05`、`06` 及本 Step 中间产物。24 个 candidate 不进入任何实现 boundary，所有外部 positive 与 DDD gap 保持 blocked / wait_design。

## 9. 待确认事项

| 事项 | 影响 | 处理 |
|---|---|---|
| `/home/aris/Projects/quantalithos-member` 尚不存在 | 所有 boundary 无法开工 | 保留 `L2M-DDD-001`；不创建目标仓 |
| 当前 design workspace 未形成 immutable baseline | 所有 Design Gate 无法 pass | Step 11 / 12 固定完整 manifest；当前不提交 |
| Core contracts actual export / rust-version / path compatibility | PH-01 | 开工前核验；不建 shadow contract |
| `L2M-DDD-002` physical Store/UoW 未选 | CP01～CP07 durable / crash / performance lane | 只规划 logical / fake；不选产品 |
| `L2M-DDD-003~007`、`scope_supersede_gap` | CP02～CP07 affected boundary | 回写 owning design；不 direct-update / pseudo-version |
| `L2M-UP-001~008` 与 24 candidate | external positive / event lane | exact owner closure 后另行 selected-run；本轮不 materialize |
| workload / SLO authority | PH-08 qualification | Step 9 spike；当前无硬阈值 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| PH-01～PH-08 均有任务表 | `pass_for_design` | 每项有顺序、输入、输出和完成条件 |
| 每阶段均有 batch 表 | `pass_for_design` | 大动作标注拆分与规模 |
| 每阶段均有 commit boundary | `pass_for_design` | 18 个 boundary 覆盖所有 planned delivery |
| 每个 boundary 均有不包含项、门禁和复核入口 | `pass_for_design` | 外部 / 后续 phase 不越界 |
| 每个 boundary 均有经验复核和停审记录 | `pass_for_design` | 当前结论仍是 blocked，非 implementation pass |
| 跨 boundary 粒度 / 依赖 / 门禁审计 | `pass_for_design_with_blockers` | blocker 保留，未移交实现 |
| 可进入 Step 7 | `authorized` | 下一步只嵌入测试 / 验收门禁；不创建实现、ledger 或 boundary skeleton |
