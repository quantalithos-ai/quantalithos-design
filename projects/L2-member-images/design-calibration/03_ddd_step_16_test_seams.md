# L2-member-images 03 详细设计 Step 16：测试切口与最小验证清单

> 创建日期：2026-08-31  
> 状态：`completed_stop_review`（测试切口已收敛；未执行测试，等待用户明确确认 Step 17）  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16  
> 回填位置：正式 `03-详细设计.md` 第 15 章“测试切口与最小验证清单”（当前只形成草稿，禁止装配）  
> 粒度参照：`projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md` 的模块、接口、状态与一致性表格粒度；不继承其 outbox、publisher、receipt、event、report、handoff/export、外部 backend 或治理域正向合同。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 16：测试切口与最小验证清单。 |
| 恢复入口 | 已先读取项目执行台账、03 flow、Step 16 SOP/书写规范、L1-governance 的 Step 16 粒度参考，以及 Step 5、8~15 的已停审材料。 |
| 直接输入 | 七个模块契约、10 Command、10 Query、2 条条件入站、6 个 Operations Job、零 outbound inventory、19 张状态机矩阵（覆盖 20 个 local lifecycle subject）、持久化/错误/并发/配置/观测约束。 |
| 本 Step 目标 | 为未来实现者和后续 `05-测试方案.md` 提供最小验证入口，使模块、逻辑协议、状态、数据一致性、fake 边界和 redaction 约束都能被反查。 |
| 当前可达性 | 10 个 Command 和 6 个 Job 仍在 `DDD-S9-B01/B02` 前 fail-closed；Query 严格只读；条件入站仅 marker-only 且 `accepted_input=false`；outbound inventory 固定为 `ImageOutboundEventInventory::NoneAuthorized`。 |
| 本 Step 不做 | 不实现或执行测试，不创建 fixture、测试仓、脚本、run/report/evidence、artifact digest、verdict、signoff 或 readiness；不选择 test framework/CI/coverage，不创建 05，也不修改正式 `03-详细设计.md`。 |
| 上游/兄弟边界 | `L2-member`、`L2-member-service` 及未停审 owner 输入只可形成 blocked/future seam；不得由测试名称、fake、cache、ACK 或 local composition 伪造正向合同。 |
| 强制停点 | 本 Step 完成后必须停审，等待用户明确确认才能创建 Step 17；正式 03、实施、测试执行与 commit 继续禁止。 |

### 0.1 当前测试切口的分类

| 分类 | 本 Step 中的含义 | 可以断言什么 | 不得断言什么 |
|---|---|---|---|
| `current-negative/no-write` | 已有设计明确的当前 fail-closed、read-only 或 marker-only 合同。 | 未开始 UoW、未 reserve、未读写 repository、未调用 adapter、未写 trace/history/gap/freshness/result、未 commit。 | 已完成 mutation、replay、外部调用、正向 owner 结果或测试已通过。 |
| `planned-pure-contract` | 对既有 DTO、typed ref、enum、guard、状态矩阵、redaction 规则的未来 unit/contract 测试入口。 | 输入/状态/字段禁入和合法/非法边必须如何被验证。 | 现有代码、fixture、测试框架或覆盖率已经存在。 |
| `future/reopen-positive` | 只有 B01/B02、对应 port/result、owner 合同和持久化条件全部重开后才可实现的正向验证。 | 正向测试所需前置、不可替代的 guard 和 expected local effect。 | 该 path 当前可调用、已实现、已运行或已得到外部成功。 |
| `blocked` | 缺少唯一可落码合同，不能以测试补足。 | blocker 仍阻止相关测试成为可执行验收。 | 用 mock/fake、配置、文字断言、猜测 digest 或 sibling 草稿关闭缺口。 |

`planned-pure-contract` 与 `current-negative/no-write` 都是**测试设计入口**，不是本轮测试执行结果。即使某个 future fake 已在详细设计中被命名，也只能在实现与其 durable parity 合同同时落地后才成为可运行测试依赖；它不能作为 Production fallback、外部事实或证据来源。

## 1. Step 内计划、写入批次与停审门禁

| 批次 | 覆盖范围 | 可审查产物 | 当前状态 | 完成门禁 |
|---:|---|---|---|---|
| 16.0 | 输入准入、SOP 问题、当前可达性与分类词汇 | §0~§5 | `done` | 不把测试切口误写成测试结果或正式 03 内容。 |
| 16.1 | 七个模块的最小测试入口 | §6 | `done` | 每个模块都有对象/函数/边界/建议类型，且不引入新模块或 port。 |
| 16.2 | Command、Query、条件入站、zero outbound 与 Job 切口 | §7 | `done` | 每个关键逻辑协议都有当前异常切口和受条件约束的 future 正向切口。 |
| 16.3 | 状态机与一致性/幂等/并发切口 | §8~§9 | `done` | 合法/非法边与 zero-effect/replay/version/append-only 条件可以反查前序 Step。 |
| 16.4 | 配置、fake、依赖与观测边界 | §10 | `done` | FakeOnly、static/live、redaction、local composition 和 zero outbound 不被弱化。 |
| 16.5 | 跨 Step 审计、回填草稿、blocker、handoff 与自检 | §11~§13 | `done` | 仅给 Step 17/05 留输入，不自动进入下一 Step。 |

| Step / 模块 | 问题回答 | 诊断 | 改动前后 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|---|
| `test_seams` | done | done | done | done | done | done | done | `pass_with_explicit_blockers` | 已完成并停审；等待用户明确确认 Step 17。 |

## 2. 本步输入与准入边界

| 输入 | 状态 | 本 Step 的限定用法 | 不可从中推导 |
|---|---|---|---|
| `03_ddd_step_05_module_contracts.md` | completed | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七模块及其依赖方向。 | 新 crate、外部 Rust public schema、sibling Cargo dependency 或 active process。 |
| `03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md` | completed | 反查对象不变量、port、UoW、repository、canonicalizer、fake 和 typed ref 的未来测试 seam。 | 尚未定义的 result factory、event receipt、outbox、publisher、body fixture 或 concrete external adapter。 |
| `03_ddd_step_08_protocol_contracts.md` | completed with blockers | 固定 10 Command、10 Query、2 条条件入站、6 Job、0 outbound 的 logical surface。 | HTTP/RPC route、topic、envelope、scheduler、run/report、outbound payload 或传输成功。 |
| `03_ddd_step_09_function_flows.md` | completed with blockers | 固定 Command/Job B01/B02 stop、Query no-write、marker-only inbound 和 future/reopen 顺序。 | 当前 mutation、page selection、adapter call、trace/result/replay 或 commit。 |
| `03_ddd_step_10_state_matrices.md` | completed with blockers | 固定 19 张状态机矩阵的正式状态名、合法/非法迁移及 20 个 local subject 范围。 | 全局 image lifecycle、global ready、runtime/container lifecycle 或 reserved positive state 已发生。 |
| `03_ddd_step_11_persistence_consistency.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` | completed with explicit blockers | 固定版本、append-only、UoW、replay、commit unknown、B03、PF 和 in-flight/namespace 的验证边界。 | 自动 repair、盲重试、lease/TTL、result 重算、scheduler cursor 或外部副作用重发。 |
| `03_ddd_step_14_config_dependencies.md`、`03_ddd_step_15_observability_audit.md` | completed with explicit blockers | 固定 config/slot/fake 纪律、local composition 非 readiness、日志/metric/span/local trace redaction。 | Production fake fallback、观测 backend、健康/就绪结论、audit receipt 或外部证据。 |
| `L1-governance` Step 16 | grain reference only | 参考“模块 → 接口 → 状态 → 一致性 → 边界审计”的表格层次。 | 其治理对象、outbox、publisher、outbound events、receipt、handoff/export、report、外部 backend 或正向测试事实。 |
| `L2-member`、`L2-member-service` 与各 owner 未停审材料 | pending owner input | 只保留 owner、seam 分类、gap 和重开条件。 | manifest/variant/ref 完整 schema、consumer confirmation、external digest、release/rollback 成功或 readiness。 |
| 旧正式 `03-详细设计.md` | historical_material / not opened | 无。 | 读取、继承、修订或以其补足测试结论。 |

## 3. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 每个模块至少需要哪些单元测试？ | `contracts` 验证 typed carrier、DTO shape、enum/ref/page 与 forbidden field；`domain` 验证 factory/guard/状态/immutable/static-live 边界；`application` 验证入口编排与 B01/B02/no-write；`infra` 验证 config/slot/fake-durable parity 的 future seam；`api` 验证 Command/Query mapping；`worker` 验证 marker-only；`jobs` 验证 bounded action marker 与 B01/B02。全部只是 planned cut。 |
| 2 | 每个接口至少需要哪些正向和异常测试？ | 对当前可达的 Command/Job，“正向”仅指合法 shape 到 B01/B02 的 fail-closed boundary，异常是 malformed/forbidden input 且同样零写；其真正 mutation 正向用例必须标为 `future/reopen-positive`。Query 的正向是读取既有 committed surface，异常是 `Empty/Gap/Stale/Rebuilding/Unavailable` 与 `RequireFresh` fail-closed；条件入站没有当前 accepted-input 正向，只有 marker disposition `accepted_input=false`；outbound 无正向库存。 |
| 3 | 状态机合法转换和非法转换如何测试？ | 以 Step 10 的正式 enum、factory/member 和 transition matrix 为唯一来源。每张矩阵至少有一条合法 edge、一个 terminal/replacement rule 与一条非法 edge；所有 future mutation test 同时断言前提/guard，所有非法边断言 `InvalidTransition` 或既有精确错误且对象不变。 |
| 4 | 事务、一致性、幂等和并发如何验证？ | 当前先验证 B01/B02 的 global zero-effect；未来才用明确的 fake/repository/UoW seam 验证 same-key replay、different-input conflict、version conflict、append-only、stored-result ordering、commit unknown、projection truth direction。`DDD-S13-OPEN-01/02`、B03 与 PF 未闭合时，相应正向/恢复测试保持 blocked。 |
| 5 | 哪些测试细节应留给测试方案？ | TC 编号、优先级、覆盖率、fixture/source-body 目录、生成器、真实 owner 联调、durable backend/CI 矩阵、执行命令、run/report/evidence、验收 verdict 和排期都留给 05/06/07。Step 16 只留下可反查的最小 seam 和不可越过的 blocker。 |

## 4. 当前材料诊断

| 来源位置 | 已有结论 | 若不做 Step 16 汇总的风险 | 本 Step 的处理 |
|---|---|---|---|
| Step 5 七模块 | 责任与依赖方向已固定，但测试提示分散在模块卡中。 | 实现者只测 domain happy path，漏掉 entry、fake、config 或零副作用边界。 | 用 §5 给每模块一个最小、非实施性的测试入口。 |
| Step 8 协议表 | logical schema 和错误 surface 已细化，transport 仍未绑定。 | 把每个 Command/Job 都误写为当前可 mutation 的 API 测试，或为 outbound 虚构测试。 | §6 按逻辑协议列当前/未来/异常三层，并将 outbound 单列为零库存审计。 |
| Step 9 flow | B01/B02、Query no-write、marker-only inbound 明确。 | 为了“正向覆盖”偷偷调用 repository、resolver、UoW、page 或 adapter。 | 所有 current negative seam 均以 spy/no-effect 断言为主；future positive 明列重开前提。 |
| Step 10 状态矩阵 | 状态契约细，但尚无统一反查表。 | 将 `Buildable`、`Succeeded`、`Eligible`、`Available`、`Resolved`、`Fresh` 混成 ready。 | §7 按 19 张 matrix 逐项保留合法/非法与 reserved-positive 条件。 |
| Step 11~13 | 版本、replay、unknown、B03、PF、in-flight/namespace 边界已收敛。 | mock 或 fake 被当作 B03/PF/OPEN 项的“修复证明”。 | §8 将其分为 current zero-effect、future contract 与 blocked recovery，禁止测试替代设计重开。 |
| Step 14~15 | fake/config/composition/redaction/metric 边界已收敛。 | slot `Available`、fake success 或日志存在被读为 runtime/consumer readiness。 | §9 把 Production/FakeOnly、static/live、redaction、local composition 和 zero outbound 变成独立验证切口。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 项 | 汇总前 | 本 Step 后的最小结论 | 原因 |
|---|---|---|---|
| 测试粒度 | 各 Step 内有零散“测试切口”文字。 | 形成模块、逻辑接口、状态机、一致性和横切边界五类反查面。 | 让未来 05 能展开，而不重写 03 的对象/flow。 |
| Command/Job 覆盖 | 有 future mapping，容易被误读为 happy path。 | 当前只验证 fail-closed/no-write；真正正向 mutation 是 blocker 条件下的 future seam。 | B01/B02 仍禁止任何合法写链。 |
| Query/Inbound 覆盖 | 只读/marker-only 已定义，但缺统一最小断言。 | Query 必断言 no-write；inbound 必断言 `accepted_input=false` 且没有 envelope/receipt/dedup。 | 防止测试为方便而扩大协议。 |
| 观测/配置测试 | redaction、fake 和 slot 已分散规定。 | 作为固定负向验证面，不把 signal/composition 变成 business truth。 | 保持 static/live、owner 与 readiness 边界。 |
| 测试产物 | 尚无实现/测试仓。 | 明确本 Step 不需要脚本、report、artifact 或 evidence 契约。 | 不能无实现主体时伪造运行材料。 |

### 5.2 设计取舍

| 议题 | 采用 | 未采用 | 原因 |
|---|---|---|---|
| Step 16 的范围 | 最小验证切口与 blocker 条件。 | 完整测试方案、TC 编号、覆盖率/CI/排期。 | 遵守详细设计与 05 的职责边界。 |
| 当前 Command/Job 的“正向”测试 | 验证合法输入在 B01/B02 正确停止且零写。 | 伪造 mutation success、fake result 或 digest。 | fail-closed 是当前唯一可验证合同。 |
| future 正向测试 | 保留为 reopen seam，逐项写出 prerequisite。 | 因对象/port 名称存在就视为可执行。 | 名称、DTO 和 flow mapping 不等实现 readiness。 |
| 状态覆盖 | 每张 Step 10 matrix 的合法、非法、terminal/replacement 与阶段隔离。 | 单一 image/global lifecycle happy path。 | 本仓没有 global state 或 global ready。 |
| fake 使用 | future TestOnly/durable parity 验证。 | fake 关闭 owner gap、注入 Production 或生成证据。 | fake 不拥有外部/兄弟真相。 |
| L1-governance 参考 | 继承表格粒度和闭环审计方法。 | 引入其 outbound/receipt/report/外部治理对象。 | 本仓 outbound inventory 为零，且不拥有这些领域。 |

## 6. 结构化中间产物：测试切口总图与模块汇总

### 6.1 测试切口总图

```text
Step 5 seven module contracts
  -> module/object/entry/fake/config seams
Step 8 protocol inventory + Step 9 reachable flows
  -> Command / Query / conditional inbound / Job seams
  -> zero outbound inventory audit
Step 10 state matrices
  -> legal edge / illegal edge / terminal-or-replacement seams
Step 11~13 persistence, recovery, concurrency
  -> zero-effect / version / append-only / replay / unknown seams
Step 14~15 config, dependencies, observability
  -> FakeOnly / static-live / redaction / local-composition / low-cardinality seams
```

所有箭头均是“设计可反查关系”，不是当前测试执行链。特别是 `Available`、`Assembled`、slot `Available`、`Fresh`、日志/metric/span 的存在，均不得作为 build、Artifact、consumer、member、runtime 或发布 readiness 的测试 oracle。

### 6.2 模块测试切口汇总表

| 测试切口 | 对应模块/契约 | 验证内容 | 建议测试类型 | 当前状态 |
|---|---|---|---|---|
| `contracts_typed_carrier_and_schema_boundary` | `contracts`；Step 6/8 typed ref、metadata、DTO、view/page/error carrier。 | non-empty/newtype/enum/page shape、required-vs-optional、逻辑 name mapping、Query 不携带 write reservation 意图；外部 body、route/topic、run/report/digest 不得进入 carrier。 | planned contract unit | `planned-pure-contract` |
| `domain_factory_guard_and_static_live_boundary` | `domain`；五 capability object、factory、guard、state enum。 | factory 初始状态保守、immutable input 不被原地修补、Role/runtime/tools/member/supervisor/extras 与 policy/memory/workspace live body 不入 local object；非法 transition 不改变 object。 | planned domain unit | `planned-pure-contract` |
| `application_boundary_and_no_write_orchestration` | `application`；coordinator、query facade、UoW/idempotency/error mapping。 | Command/Job 在 B01/B02 前无 canonicalize/reserve/UoW/read/write/adapter/result/commit；Query 不开 write UoW；future orchestration 的顺序只在 reopen 后测试。 | planned service + spy/fake | current negative；future/reopen |
| `infra_config_slot_and_fake_parity` | `infra`；repository/adapter/config/runtime builder/fake。 | config validation 只暴露安全类别；slot/composition 只形成 local assembly；FakeOnly/TestOnly 不进 Production；future fake 不从 private map/缓存制造 owner truth。 | planned config + fake contract | planned-pure-contract；blocked positive seams |
| `api_logical_protocol_mapping` | `api`；Command/Query logical handler。 | required shape、typed ref、metadata、safe error/query surface mapping；handler 不直接调 domain/repository，不把 transport/actor auth 事实补进本仓。 | planned handler contract | current negative/read-only |
| `worker_marker_only_boundary` | `worker`；两条 conditional inbound boundary。 | named marker result、`accepted_input=false`；无 envelope/payload/event ID/receipt/dedup/quarantine/UoW/snapshot/gap/trace write。 | planned boundary unit | current negative/no-write |
| `jobs_bounded_action_stop_boundary` | `jobs`；六条 Operations Job logical entry。 | action marker/metadata 到 B01/B02 的 stop；无 scheduler/run/tick、page selection、adapter、report/evidence、trace/result/UoW/commit；future per-item path必须重开。 | planned job-entry + spy/fake | current negative；future/reopen |

### 6.3 模块测试的共同禁止项

| 禁止项 | 原因 | 正确测试 oracle |
|---|---|---|
| 从 fake/cache/ACK/registry presence/tag/裸 digest 断言 candidate、eligible、available、accepted 或 resolved。 | 它们不是 owner-controlled safe conclusion 或 formal resolution。 | 断言 fail-closed/blocked/gap/unknown，或在 owner 合同重开后测试 exact typed ref/safe conclusion。 |
| 为测试构造 RoleDefinition、runtime/tools/member/supervisor、policy/memory/workspace live body。 | 本仓只承接模板/seed/static ref 与构建产物边界，不拥有这些主体/运行时真相。 | 使用既有 body-free typed ref、safe reason、declared-use marker 或明确 gap。 |
| 以 Query、日志、metric、span 或 config slot 产生/修复 local truth。 | Query strict no-write；观测/assembly 不是业务事务。 | 仅观察 existing committed surface 或 future UoW 内声明的 local effect。 |
| 为“覆盖事件”创建 outbound/outbox/publisher/receipt 测试。 | `NoneAuthorized` 是严格零库存。 | 静态/architecture seam 只验证上述对象和配置均不存在。 |

## 7. 结构化中间产物：逻辑协议测试切口

### 7.1 Command 测试切口汇总表（10）

> 共同前提：所有行的 `current-negative/no-write` 断言均可设计为“合法 DTO/metadata shape 到达 `ImageOperationContext` 后被 `DDD-S9-B01` 或 `DDD-S9-B02` fail-closed”的边界契约；它们不允许构造 canonical input、reservation、UoW、repository read/save、ID、resolver/adapter、trace/gap/freshness/result 或 commit。每行的 mutation positive case 都是 `future/reopen-positive`，而不是当前 test pass 条件。

| 测试切口 | 对应协议/flow | 当前最小断言 | future/reopen 正向断言及前提 | 异常/禁止断言 | 建议测试类型 |
|---|---|---|---|---|---|
| `define_image_variant_boundary` | `DefineImageVariant` / `DefineImageVariantFlow`。 | malformed family selector、blank label、wrong mapping ref 或缺 actor/metadata 在 context 前拒绝；合法 shape 到 B01；spy 为零 I/O/写入。 | B01/B02、mapping owner ref/validity、result/UoW/replay 合同闭合后：exact family/snapshot guard、new/existing family version语义、local variant save。 | 不读取 Method Library body；不把 `Resolved` 当 baseline/build；不以 mapping snapshot/fake宣布 owner truth。 | planned handler + service spy |
| `capture_assembly_baseline_boundary` | `CaptureAssemblyBaseline` / `CaptureAssemblyBaselineFlow`。 | wrong variant/ref、empty/duplicate/mutable/static-live-violating input、缺 metadata 拒绝；合法 shape 到 B01；零 resolver/UoW。 | B01/B02 和 MI-UP-002/006/008 的 safe ref/conclusion闭合后：pin/seed/base declared-use guard、immutable baseline 初始 `Incomplete`/合法 `Complete`。 | 不接收 live memory/checkpoint/workspace/container/path/body；`Complete` 不触发 builder/candidate。 | planned contract + service spy |
| `propose_variant_revision_boundary` | `ProposeVariantRevision` / `ProposeVariantRevisionFlow`。 | malformed variant/baseline/prior-ref/self replacement 或 unsafe reason 被拒绝；合法 shape 到 B01；零 exact-load/save/supersede。 | B01/B02 与 baseline/ref owner closure 后：same-variant exact relation、pure guard、new revision + prior replacement history。 | 不从 current pointer 猜 prior revision；`Buildable` 不等 build/Artifact/entry readiness。 | planned handler + domain/service |
| `request_build_intent_boundary` | `RequestBuildIntent` / `RequestBuildIntentFlow`。 | malformed revision/trigger/metadata 拒绝；合法 shape 到 B01；零 intent/snapshot/attempt、零 builder。 | B01/B02、Q-MI-003、MI-UP-005（若 verified trigger）和 safe build boundary闭合后：only Buildable revision may form local intent; `Accepted` remains local intent only。 | 不以 inbound marker、ACK/tag/cache/registry presence启动 intent；不创建 scheduler/run。 | planned service spy |
| `record_build_outcome_boundary` | `RecordBuildOutcome` / `RecordBuildOutcomeFlow`。 | wrong attempt/execution/output ref、invalid result kind 或 missing metadata 被拒绝；合法 shape 到 B01；零 adapter/result save/candidate。 | B01/B02 与 Q-MI-003 safe outcome contract闭合后：same-attempt correlation、safe observation、Succeeded/Failed/Unknown mapping与 candidate guard分离。 | 不以 raw provider response、ACK、tag、裸 digest 形成 Succeeded/Formed；Unknown 不重试。 | planned contract + service fake |
| `evaluate_candidate_eligibility_boundary` | `EvaluateCandidateEligibility` / `EvaluateCandidateEligibilityFlow`。 | malformed candidate/provenance/gate refs 或 missing metadata 拒绝；合法 shape 到 B01；零 gate/evidence seam/UoW。 | B01/B02、Q-MI-004 authority/applicable set/safe conclusion闭合后：provenance/gate/eligibility分别 guard，only formal inputs can produce local `Passed`/`Eligible`。 | 不默认 pass；不把 candidate Formed 升格为 eligibility、Artifact 或 supply。 | planned service fake |
| `record_artifact_handoff_boundary` | `RecordArtifactHandoff` / `RecordArtifactHandoffFlow`。 | typed relation/metadata malformed拒绝；合法 shape 到 B01；零 Artifact boundary、gap/record save。 | B01/B02 和 MI-UP-007 ArtifactConsumableRef + ContractResolutionRef闭合后：local handoff Pending/Gap或 reserved Accepted mapping。 | 不把 Artifact ACK/ref、fake 或 image ref视为 Accepted；不写 Artifact owner truth/delivery。 | planned boundary + service fake |
| `publish_instantiable_entry_boundary` | `PublishInstantiableEntry` / `PublishInstantiableEntryFlow`。 | invalid candidate/eligibility/entry pin/metadata 拒绝；合法 shape 到 B01；零 entry/history/repository write。 | B01/B02及前置 local eligibility/provenance guard重开后：immutable pin、new local entry、append-only transition。 | 不以 registry/image ref/container state推导 Available；不创建 Member Service manifest/instance。 | planned service + repository fake |
| `transition_availability_boundary` | `TransitionAvailability` / `TransitionAvailabilityFlow`。 | invalid action/ref/reason/metadata 拒绝；合法 shape 到 B01；零 transition append/update。 | B01/B02且 `DDD-S11-B03` persistence model闭合后：new append-only transition、exact entry version、合法 local availability edge。 | 不 delete/reinsert/overwrite old history；Available 不等 consumer/runtime readiness。 | planned domain + repository fake |
| `rollback_or_retire_entry_boundary` | `RollbackOrRetireEntry` / `RollbackOrRetireEntryFlow`。 | invalid target/self/transition/metadata 拒绝；合法 shape 到 B01；零 rollback/retire write。 | B01/B02、B03和 entry/history relation闭合后：new local history context、exact target guard、retire/replacement rules。 | 不原地复活旧 transition；不把 local rollback写成 external release/container rollback。 | planned domain + service fake |

### 7.2 Command 的共通最低验证规则

| 规则 | 当前可验证的 negative/no-write seam | future/reopen seam |
|---|---|---|
| 输入与 metadata | 缺 actor（Command）、missing key/correlation、wrong typed ref、空/越界字段在任何 UoW 前映射为既有 `Missing`/`ContractViolation`。 | canonical field source、stable input、actor/source authority 必须按被重新关闭的 per-operation contract 再测。 |
| B01/B02 | 10 个 Command 对合法 shape 都不 begin/reserve/read/save/adapter/trace/gap/result/complete/commit。 | 只有 concrete canonical mapper（B01）和 legal result ref/shell/body mapper（B02）均关闭后，才可测试 `canonicalize → begin → reserve → exact read/guard → save → result → complete → commit`。 |
| 失败与副作用 | rejected/blocked 当前不产生 accepted trace/history/gap/freshness/stored result/outbound。 | future local negative dispositions只有该 flow/UoW 明确允许时才能测试；绝不从 B01/B02 stop 人工造 gap。 |
| duplicate/replay | 当前没有 reservation/result，测试只能断言“不声称 replay 可执行”。 | same key+same stable input只读 stored result；same key+different input conflict；结果缺失 `ReplayUnavailable`，不从 current truth重算。 |
| outbound | `ImageOutboundEventInventory::NoneAuthorized`。 | 若未来另获 owner authority，必须重开 Step 5/7/8/9/11~16；本 Step 不预设 event test。 |

### 7.3 Query 测试切口汇总表（10）

> Query 是当前可读的逻辑 surface，但可读不等任何特定对象、projection 或 owner data 已存在。每行都必须断言：只读 existing committed local truth/history/view/marker；无 write UoW、reservation、local trace、gap/freshness write、resolver refresh、projection rebuild/repair、external body 或 audit append。`RequireFresh`/`InspectMarker` 仅解释既有 marker，不能触发修复或静默降级。

| 测试切口 | 对应 Query/flow | 正向读取切口 | 异常/边界切口 | 必须同时断言 |
|---|---|---|---|---|
| `get_image_variant_definition_read_only` | `GetImageVariantDefinition`。 | 既有 local variant definition summary按 exact ref返回。 | missing/wrong ref、Blocked/Superseded relation、unreadable scope映射为既有 safe surface。 | 无 `mark_resolved`、no UoW/no write。 |
| `get_assembly_derivation_read_only` | `GetAssemblyDerivation`。 | 既有 baseline/revision derivation summary只读返回。 | Incomplete/Conflict/Superseded、missing relation或 scope gap 不猜补。 | 不 `apply_completeness`/validate、不 resolver refresh。 |
| `get_build_trace_read_only` | `GetBuildTrace`。 | 既有 intent/snapshot/attempt/candidate trace summary按 local ref读。 | missing、Unknown/Blocked/terminal状态表面；不以 query recheck builder。 | 不记录 outcome、不 form candidate。 |
| `get_provenance_and_eligibility_read_only` | `GetProvenanceAndEligibility`。 | 既有 local provenance/gate/eligibility链只读。 | missing/gap/unknown/blocked；Q-MI-004 下不默认 Passed/Eligible。 | 不请求 gate/evidence、无 Artifact/supply side effect。 |
| `resolve_instantiable_entry_read_only` | `ResolveInstantiableEntry`。 | 既有 pinned local entry可按现有 surface解析。 | unavailable/gap/consumer pending或 stale relation保持可见。 | local `Available` 不推 consumer confirmation/instance/runtime readiness；不 resolve gap。 |
| `list_available_variants_page_read_only` | `ListAvailableVariants`。 | 只列既有 local `Available` pinned entry的稳定 page。 | malformed cursor/limit、empty page、visibility/scope surface；不借 page 回填 entry。 | page 不成为 scheduler cursor，no rebuild/write。 |
| `get_availability_history_page_read_only` | `GetAvailabilityHistory`。 | append-only既有 transition history分页返回。 | missing/empty/page boundary/terminal relationship；B03 不被 query 修补。 | 无 update/delete/reinsert/retire write。 |
| `get_image_trace_page_read_only` | `GetImageTrace`。 | 既有 committed `ImageTraceRecord` body-free page返回。 | empty/page boundary/subject mismatch；不得将 runtime span/log当 record。 | 无 read audit、no trace append、无 raw body。 |
| `get_contract_gaps_page_read_only` | `GetContractGaps`。 | existing lane-scoped local gap page只读返回。 | Empty/Blocked/Expired/visibility surface；不可由 query open/resolve/expire gap。 | 不从 sibling draft/fake/config关闭 gap；无 global ready。 |
| `get_projection_freshness_read_only` | `GetProjectionFreshness`。 | existing `Fresh`/`Stale`/`Rebuilding`/`Unavailable` marker按 preference 返回。 | `RequireFresh` 无 Fresh marker必须 fail-closed；`InspectMarker` 无 marker也 `Unavailable`；PF下 `Unavailable` 不恢复。 | 无 query-time rebuild/marker create/refresh；Fresh 不等 readiness。 |

### 7.4 条件入站、outbound 零库存与 Job 测试切口

| 测试切口 | 对应 surface | 当前最小断言 | future/reopen 或 blocker |
|---|---|---|---|
| `consume_verified_build_request_marker_only` | `ConsumeVerifiedBuildRequest` / worker boundary。 | 返回 named `Unavailable`/`Rejected`/`ReopenRequired` marker disposition，恒为 `accepted_input=false`；没有 payload parameter、event ID、receipt、dedup、UoW、intent/snapshot/trace/gap write。 | MI-UP-005 正式关闭 authority/schema/identity/dedup/receipt 后，必须重开 Step 7~10/16 才能设计 accepted input test。 |
| `consume_verified_source_refresh_marker_only` | `ConsumeVerifiedSourceRefresh` / worker boundary。 | 同上；不得把 source-refresh 名称变为 resolver call、snapshot write或 owner body intake。 | 同上；不从 marker/fake推导 source validity。 |
| `outbound_inventory_none_authorized` | `ImageOutboundEventInventory::NoneAuthorized`。 | architecture/static seam 确认没有 outbound DTO、outbox、publisher、topic、delivery、receipt、event metric/span或配置。 | MI-UP-009 未关闭；若将来有 outbound，必须作为跨 Step redesign，而不是添加“暂时 mock publisher”测试。 |
| `run_nightly_build_sweep_stop_boundary` | `RunNightlyBuildSweep`。 | metadata/action marker后 B01/B02 stop；零 page selection、intent/snapshot/attempt/builder/result/UoW。 | future `scope` page 和 build guard测试须B01/B02、Q-MI-003、declared repository/result contracts均闭合。 |
| `reconcile_build_attempts_stop_boundary` | `ReconcileBuildAttempts`。 | 当前不 list attempts、不 inspect adapter、不重试 Unknown、不写 candidate/result。 | future exact page + safe observation + duplicate replay测试须B01/B02、Q-MI-003、in-flight/replay contract闭合。 |
| `reevaluate_pending_qualifications_stop_boundary` | `ReevaluatePendingQualifications`。 | 当前不 list/re-evaluate gate、无 gate/evidence adapter、无 Pass/Eligible/result。 | Q-MI-004闭合后才可测试 bounded page、safe conclusion、non-default-pass和 local decision。 |
| `refresh_external_reference_snapshots_stop_boundary` | `RefreshExternalReferenceSnapshots`。 | 当前不 exact-load snapshot、不 resolve、不 create/invalidate/supersede snapshot、不 gap/trace/result。 | future only after B01/B02 + declared-use resolver/repository/replay contract；不接受 owner body。 |
| `rebuild_image_derived_views_stop_boundary` | `RebuildImageDerivedViews`。 | 当前不 select projection、load committed truth、create marker/view、rebuild或写 freshness。 | future tests require B01/B02 and PF recovery design; truth→projection only，Query cannot substitute job。 |
| `reconcile_artifact_and_consumer_handoffs_stop_boundary` | `ReconcileArtifactAndConsumerHandoffs`。 | 当前不 list/recheck handoff/gap、不 call Artifact/Member Service seam、不 resolve/accept/confirm、不写 report/evidence。 | MI-UP-001/007、B01/B02闭合后才可测试 bounded local gap maintenance；local entry仍不等 consumer/runtime result。 |

### 7.5 Job 的共通最低验证规则

| 规则 | 当前可验证的 negative/no-write seam | future/reopen seam |
|---|---|---|
| Job 输入 | wrong action/scope/page/limit/metadata 在 boundary 返回 safe contract error；不创建 scheduler/run/tick/cursor。 | exact scope/page可在重开后作为 canonical input；page 不变成 run/checkpoint/report。 |
| B01/B02 | 六个 Job 均为 action marker/boundary 后停止，零 page、adapter、UoW、trace/history/gap/freshness/result/commit。 | success/partial/no-op/unknown/blocked disposition与 stored replay只在 B01/B02/result contract已闭合后测试。 |
| 对象真相 | maintenance Job 不修 core Definition/Build/Qualification/Supply truth。 | projection 只从 committed local truth rebuild；reconciliation/handoff只处理明确 local record/gap，不替 owner truth。 |
| duplicate | 当前没有 job replay state。 | same key仅 replay stored disposition、不重新 list/inspect/rebuild/reconcile；`DDD-S13-OPEN-01/02` 未闭合的 in-flight/namespace 行保持 blocked。 |
| 输出边界 | 当前无 report/evidence/verdict/signoff。 | 即便 future Job 形成 local bounded disposition，也不自动取得 report/evidence/product release authority。 |

## 8. 结构化中间产物：状态机测试切口

> 状态名、factory/member、合法边与非法边唯一回指 `03_ddd_step_10_state_matrices.md`。下表不创建任何新状态、全局状态机或“镜像就绪”断言。除 Query/marker inspection 外，所有需要持久化的状态转换目前均受 B01/B02 阻断；因此“合法 transition”是 planned/future unit or domain seam，不是当前 Command/Job 成功断言。

| 测试切口 | 状态机 / local subject | 合法 transition / guard 切口 | 非法 / terminal / 隔离切口 | 当前状态 |
|---|---|---|---|---|
| `definition_lifecycle_matrix` | `DefinitionLifecycle`；family 与 variant 为不同 subject。 | `Draft → Resolved/Blocked/Superseded` 的 exact local relation/guard前提。 | `Blocked/Superseded → Resolved`拒绝；family Resolved不推 variant/baseline/revision。 | planned-pure-contract；mutation future/reopen |
| `assembly_baseline_completeness_matrix` | `BaselineCompleteness`。 | initial `Incomplete`；only immutable static guard可使 `Incomplete → Complete`；non-usable/collision进入 Incomplete/Conflict。 | `Conflict/Superseded → Complete`拒绝；不得原地添 pin/seed/base；Complete不等 build/candidate。 | planned-pure-contract；owner refs blocked |
| `variant_revision_lifecycle_matrix` | `VariantRevisionLifecycle`。 | `Proposed → Buildable/Invalid/Superseded`，Buildable要求 same-variant Complete baseline与纯 guard。 | `Invalid/Superseded → Buildable`拒绝；Buildable不启动 builder/intent。 | planned-pure-contract；future/reopen |
| `build_intent_lifecycle_matrix` | `BuildIntentLifecycle`。 | initial `Accepted/Pending/Blocked`须已验证 revision/trigger；`Pending → Accepted`只由正式 safe input。 | `Blocked/Cancelled → Accepted`拒绝；`Accepted`非 builder acceptance；marker不可直接造 Accepted。 | future/reopen；MI-UP-005/Q-MI-003 blocked |
| `build_snapshot_lifecycle_matrix` | `BuildSnapshotLifecycle`。 | initial `Incomplete`，same revision/baseline exact guard可 `→ Complete`。 | `Invalid → Complete`拒绝；captured static input不可追加/替换；Complete非 handoff/outcome。 | planned-pure-contract；mutation future/reopen |
| `build_attempt_lifecycle_matrix` | `BuildAttemptLifecycle`。 | `Created → HandoffPending → OutcomePending → Succeeded/Failed/Unknown`仅可由 correlated safe observation。 | `Created → Succeeded`、`Unknown/Failed → Succeeded`拒绝；Unknown不自动 retry；replacement只是 relation而非新 enum。 | future/reopen；Q-MI-003 blocked |
| `candidate_lifecycle_matrix` | `CandidateLifecycle`。 | `form → Formed`需 Complete snapshot、correlated Succeeded safe outcome与 immutable identity。 | `Rejected/Blocked/Unknown → Formed`拒绝；tag/ACK/cache/digest不能替 guard；Formed不跨资格。 | future/reopen；Q-MI-003 blocked |
| `provenance_lifecycle_matrix` | `ProvenanceLifecycle`。 | `Incomplete → Complete/Conflict`仅按同一 candidate链的 exact refs与 pure check。 | Conflict不原地完成；Complete不等 gate pass/eligibility/Artifact。 | planned-pure-contract；positive chain future |
| `gate_evaluation_lifecycle_matrix` | `GateEvaluationLifecycle`。 | open/conclusion/close 只在 formal applicable gate与 safe conclusion闭合后测试。 | empty/missing authority不得 default-pass；closed/replaced relation不可覆盖。 | future/reopen；Q-MI-004 blocked |
| `eligibility_lifecycle_matrix` | `EligibilityLifecycle`。 | eligible decision只在 Complete provenance + formal gate inputs满足时形成。 | negative/terminal不原地 Eligible；Eligible不等 entry/Artifact acceptance。 | future/reopen；Q-MI-004 blocked |
| `artifact_handoff_lifecycle_matrix` | `ArtifactHandoffLifecycle`。 | Pending/Gap local context与 future formal `Accepted` distinction。 | 无 `ArtifactConsumableRef + ContractResolutionRef`时不得 Accepted；不以 ACK/ref/fake代替。 | future/reopen；MI-UP-007 blocked |
| `availability_transition_lifecycle_matrix` | `AvailabilityTransitionLifecycle`。 | 合法 proposed/committed/rejected/supersede relation只在 append persistence闭合后测试。 | 旧 transition不可 update/delete/reinsert；B03下 terminalization路径必须保持禁止。 | B03 blocked；current no-write |
| `instantiable_entry_lifecycle_matrix` | `InstantiableEntryLifecycle`。 | create/publish/supersede/retire仅按 immutable pin与 local prior facts。 | non-eligible/incomplete input不能 Available；Available不等 manifest/launch/health/consumer confirmation。 | future/reopen |
| `consumer_handoff_gap_lifecycle_matrix` | `ConsumerHandoffGapLifecycle`。 | Open/Stale lane-scoped gap的 guard和 future formal resolve条件。 | `Stale → Resolved`、`Resolved → Open`拒绝；没有 MI-UP-001 contract/confirmation不得 Resolved。 | future/reopen；MI-UP-001 blocked |
| `reference_validity_matrix` | `ReferenceValidity`；external snapshot/mapping/seed declared-use carrier。 | conclusion→initial state、new capture/replacement，exact declared use only。 | `Stale/Conflict/Unavailable → Valid`不原地恢复；cache/fake/body不可作为 verified usable。 | planned-pure-contract；source seam future |
| `contract_gap_lifecycle_matrix` | `ContractGapLifecycle`。 | Open/Blocked/Expired 的 lane-scoped behavior；future formal resolution ref才可 Resolved。 | `Resolved/Expired`不可复用；config/sibling draft/fake/ACK不可 close；无 global ready。 | planned-pure-contract；resolution blocked |
| `projection_freshness_matrix` | `ProjectionFreshnessLifecycle`。 | `Stale → Rebuilding → Fresh`仅在 existing marker、committed truth watermark与future job闭合时；Fresh只表示 watermark alignment。 | Query不能 begin rebuild；`Unavailable → Rebuilding/Fresh`无正式 edge；cache/view/fake非 truth source。 | PF blocked；Query no-write current |
| `idempotency_lifecycle_matrix` | `ImageIdempotencyLifecycle`。 | future `Reserved → Completed/Conflict`要求 legal canonical input/result relation。 | Completed/Conflict不可复用；Query不 reserve；stable input不是 digest/signature。 | B01/B02/OPEN-01/02 blocked |
| `inbound_contract_marker_matrix` | `InboundContractState`。 | `Unavailable`/`Rejected`/`ReopenRequired` marker工厂和 mapping。 | 任一 marker均不能 accepted write；不产生 envelope/receipt/dedup/intent/snapshot。 | current-negative/no-write |

### 8.1 状态机跨边界测试规则

| 测试规则 | 必须验证 | 不得误作 oracle |
|---|---|---|
| 阶段隔离 | `Resolved` definition、`Complete` baseline、`Buildable` revision、`Accepted` intent、`Succeeded` attempt、`Formed` candidate、`Passed` gate、`Eligible`、Artifact `Accepted`、entry `Available`、consumer `Resolved`、projection `Fresh` 均是不同 subject/guard。 | 任一前序或后序状态自动证明另一个状态、build/Artifact/consumer/runtime success或 readiness。 |
| terminal/replacement | terminal negative state只可按新 local context、replacement relation或 formal resolution处理。 | 原地复活、history overwrite、用 rerun/fake/cache清除 terminal。 |
| current reachability | Command/Job 当前不产生任何 transition；Query只读既有状态；inbound只 inspection。 | 把 state unit matrix 说成现有 protocol flow 已通过。 |
| 错误精度 | 非法生命周期边断言 `DomainError::InvalidTransition` 与既有 protocol mapping；缺 ref/owner/availability分别用精确类别。 | 把所有 failure写成 `Unavailable`，或用 state enum掩盖 contract gap/consistency defect。 |

## 9. 结构化中间产物：一致性、幂等与并发测试切口

### 9.1 当前 zero-effect 与 future/reopen 一致性表

| 测试切口 | 对应契约 | 必须验证 | 当前状态 / blocker |
|---|---|---|---|
| `all_command_job_b01_b02_zero_effect` | Step 9/11/12/13 global stop rule。 | 所有 10 Command、6 Job：无 canonical input、UoW begin、reservation、repository read/save、ID、adapter/resolver、trace/history/gap/freshness/result/complete/commit；no outbound。 | `current-negative/no-write`；B01/B02 明确开放。 |
| `query_strict_no_write` | Step 9 Query flow、Step 11 read boundary。 | 所有 Query 无 UoW/reservation/trace/gap/freshness/view write、resolver refresh、rebuild/reconciliation或 read-audit。 | `current-negative/no-write`。 |
| `conditional_inbound_zero_effect` | Step 9/10 worker boundary。 | 两个 inbound 无 envelope/payload/receipt/dedup/quarantine/UoW/truth/snapshot/gap/trace/result，恒 `accepted_input=false`。 | `current-negative/no-write`；MI-UP-005。 |
| `future_same_key_same_input_replay` | Step 11/13 replay ordering。 | same channel/name/key/opaque stable input只读 matching stored shell/body；无 domain/adapter/page/rebuild/new trace。 | `future/reopen-positive`；B01/B02 与 result mapper。 |
| `future_same_key_different_input_conflict` | idempotency conflict。 | same lookup、different stable input返回 `IdempotencyConflict`；old record/body不变、无 domain mutation。 | `future/reopen-positive`；B01/B02。 |
| `stored_result_before_complete` | UoW ordering。 | result save失败或 complete失败时 whole UoW 不可见；completed record必须指向 same operation/kind result。 | future/reopen；B02。 |
| `replay_body_missing_or_mismatched` | stored shell/body consistency。 | `ReplayUnavailable`/safe consistency error；不得从 current truth、adapter、cache或 fake重算。 | future/reopen；result-store parity。 |
| `existing_reserved_inflight_fails_closed` | `DDD-S13-OPEN-01`。 | 在未有正式 lookup/outcome/recovery contract时，不允许 second writer、lease/TTL/cleanup、automatic `AlreadyInProgress`，也不把 record作为 Duplicate。 | `blocked`；不能用测试替代设计。 |
| `channel_name_namespace_not_assumed` | `DDD-S13-OPEN-02`。 | 不 cross-replay Command/Job raw key；不假定 global raw-key uniqueness或私造 global index。 | `blocked`；统一 identity/lookup后重开。 |
| `version_conflict_preserves_committed_truth` | expected local object version。 | stale exact version拒绝；reload同一 object后再 guard；不 last-write-wins/upsert/用 cursor/tag/digest作版本。 | future/reopen；durable/fake parity。 |
| `append_only_trace_and_history` | `ImageTraceRecord` / AvailabilityTransition。 | trace无 update/delete；history只 Absent append；old record/transition不被 overwrite。 | trace future UoW；availability terminal路径受 B03。 |
| `availability_history_b03_remains_blocked` | `DDD-S11-B03`。 | 不允许测试以 delete/reinsert/overwrite、entry current state或 fake shortcut终结既有 transition。 | `blocked`；重开 Step 7/10 persistence model。 |
| `projection_truth_direction_and_cursor_race` | committed truth→projection，version/watermark guard。 | rebuild只从 committed local truth；older writer不能覆盖 newer marker/view；query不 repair；Fresh需要 exact watermark。 | future/reopen；PF recovery仍 blocked。 |
| `projection_unavailable_no_shortcut` | `PF-UNAVAILABLE-RECOVERY`。 | `Unavailable` 不转 Rebuilding/Fresh；不以 alert/metric/cache/composition/retry把它“恢复”。 | `blocked`；需正式 recovery函数/source/UoW。 |
| `reference_refresh_preserves_boundary` | external snapshot/declared use。 | exact declared-use、safe conclusion、last good local snapshot纪律；source unavailable/conflict不从 body/cache/fake补结论。 | future/reopen；owner inputs pending。 |
| `commit_unknown_manual_consistency` | transaction boundary/re-entry。 | 未知 commit/rollback使用同 identity审计；无法证明 Duplicate/未提交则 `Unknown`/manual，不换 key、不补偿写、不重发 external seam。 | future/reopen；OPEN-01。 |
| `maintenance_job_no_truth_repair` | Step 9/11 Job discipline。 | rebuild/refresh/reconcile/handoff 不改 core Definition/Build/Qualification/Supply truth；gap只影响 exact lane。 | current-negative；future bounded local effects。 |

### 9.2 并发场景最小验证表

| 场景 | 冲突资源 | future/reopen 必须断言 | 当前/阻断状态 |
|---|---|---|---|
| definition/assembly 并发 | family、variant、baseline、revision、immutable pin/input。 | same-object stale version/unique conflict fail-closed；baseline input改动产生新 context，不覆盖原值。 | B01/B02 + MI-UP-002/003/006/008。 |
| build 并发 | revision、intent、snapshot、attempt、candidate。 | exact version/correlation；Unknown不自动重试、不形成 second attempt/candidate；safe outcome不因并发被猜补。 | B01/B02 + Q-MI-003。 |
| qualification 并发 | provenance、gate、eligibility。 | exact context version；pending/unknown不默认 Passed/Eligible；同一 candidate relation不得多义。 | B01/B02 + Q-MI-004。 |
| supply 并发 | entry、append-only transition、rollback/retire relation。 | entry exact version + new history Absent append；冲突不 overwrite；B03 path remain blocked。 | B01/B02 + B03。 |
| projection 双重 rebuild | view、freshness、truth watermark。 | stale/older writer不覆盖 newer committed marker/view；source truth不回滚；same-key duplicate不再次 rebuild。 | B01/B02 + PF。 |
| Artifact/consumer handoff 并发 | local handoff record、consumer gap。 | exact local gap/record version；MI-UP-001/007前只 Pending/Gap/Open/Stale，不能 accept/resolve/confirm。 | B01/B02 + MI-UP-001/007。 |
| same key first/second writer | reservation/in-flight state。 | second writer不 domain mutate/adapter call；具体 public disposition等待已闭合 lookup/recovery合同。 | `DDD-S13-OPEN-01` blocked。 |
| cross channel/name raw key | identity namespace。 | 不 cross-replay；最终 conflict/namespace surface只按统一 contract。 | `DDD-S13-OPEN-02` blocked。 |

### 9.3 错误恢复与不变量的测试 oracle

| 情形 | 必须断言 | 禁止“修复” |
|---|---|---|
| invalid typed request | 在 UoW 前返回精确 safe error，无 accepted trace/result。 | 默认值、隐式 actor/metadata、fake success。 |
| version/unique conflict | rollback或无写；reload同一 object后重新 guard仅是 future流程。 | last-write-wins、upsert、改用 cursor/tag/digest。 |
| source/adapter unavailable | safe `Unavailable`/`Blocked`/`Unknown`；不保存正向 owner result。 | cache/fake/ACK/slot state 作为成功结论。 |
| rollback/commit unknown | manual consistency/Unknown，保持影响 lane隔离。 | new key重跑、补偿 trace/gap/history、external重发。 |
| stored result断裂 | `ReplayUnavailable`，保留断裂可诊断。 | 从 current truth 或 adapter 重构旧 response。 |
| B03/PF/OPEN 事项 | blocker 仍存在且受影响 path 不可实现。 | 把负向测试“通过”说成已恢复/ready。 |

## 10. 结构化中间产物：配置、fake、依赖与可观测性测试切口

### 10.1 配置与 runtime composition 测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 | 当前状态 |
|---|---|---|---|---|
| `config_validation_is_redacted_and_fail_closed` | Step 14 `infra/config.rs`。 | 缺失/非法 local config 只返回 body-free `ImageRuntimeConfigRef` 或 redacted blocked reason；不把 key/value/path/endpoint/credential 泄露给 domain/application/contracts/entry。 | planned config unit | planned-pure-contract |
| `forbidden_business_boundary_is_not_configurable` | Step 14 禁止配置化表。 | config/profile/feature 不能关闭 metadata、idempotency、query no-write、redaction、B01/B02、MI-UP/Q-MI、B03/PF，也不能打开 event/consumer confirmation/positive lane。 | planned config invariant | planned-pure-contract |
| `slot_assembly_is_local_only` | `ImageRuntimeAssemblyState` / `ImageAdapterSlot`。 | slot `Available`、`Blocked` 或 local `Assembled` 仅说明 composition validation；不启动 process/worker/job/container，不等 provider health/build success/Artifact acceptance/consumer confirmation/readiness。 | planned composition unit | planned-pure-contract |
| `unbound_or_fake_slot_fails_closed` | real/blocked/TestOnly port selection。 | 未绑定 slot或 Production 中 FakeOnly/TestOnly 组合不得静默降级为 usable；只返回 local blocked/unavailable。 | planned composition + fake contract | planned-pure-contract |
| `config_does_not_create_dependency_kind` | compile/runtime/event/ref/adapter/fake 分类。 | 配置不能把 ref consumer变 Cargo dependency，不能把 adapter/slot变 owner truth或 event authority。 | planned architecture/config check | planned-pure-contract |

### 10.2 Fake 与外部依赖边界测试切口

| 测试切口 | 对应 seam | 验证内容 | 禁止 oracle |
|---|---|---|---|
| `fake_is_test_only_and_deterministic` | `ImageFakeMode::TestOnly` / `infra/fakes.rs` future seam。 | fake 只在显式 TestOnly composition提供 deterministic negative/blocked/version/UoW/replay behavior；不存在 fake 时不改变 Production/owner contract。 | fake success、private map或人为 payload作为 external fact/evidence/readiness。 |
| `fake_durable_contract_parity` | repository/UoW/idempotency/projection future fake。 | future fake 与 durable implementation对 exact ref、unique/version conflict、commit visibility、rollback、append-only、stored result consistency保持同一可观察契约。 | 用 fake private state 绕过 canonical/result/Reserved/recovery缺口。 |
| `dependency_kind_preservation` | Step 14 dependency ledger。 | `L3-method-library`、runtime/tools/member、Artifact、Member Service、sandbox、bus、builder/registry只按各自 `ref/runtime/event/adapter/fake` seam使用；当前无未核验 Cargo binding。 | “使用/消费”自动证明 compile dependency、schema、readiness或 positive result。 |
| `static_seed_not_live_state` | mapping/component/seed/policy/memory/workspace boundary。 | 测试输入只能是 static body-free ref/template/placement/safe reason；live memory/checkpoint/workspace file/mount/conversation/runtime/tool execution 永不进入 store/canonical input/log。 | 为方便 fixture而复制 owner/live body。 |
| `member_service_consumer_gap_not_confirmation` | `MemberServiceSupplyPort` / `ConsumerHandoffGap`。 | MI-UP-001下只验证 local Open/Stale/Gap/Unavailable/reopen；entry Available保持独立。 | manifest、consumer ref/confirmation、instance/container launch/health/readiness。 |
| `artifact_boundary_not_acceptance` | `QualificationBoundaryPort` / Artifact handoff。 | MI-UP-007下只验证 Pending/Gap/blocked；本仓不 mint lineage/acceptance。 | Artifact ACK、fake object、image ref或 response body作为 `Accepted`。 |

### 10.3 Redaction、日志、metric 与 local trace 测试切口

| 测试切口 | 对应契约 | 必须验证 | 严格禁止 |
|---|---|---|---|
| `structured_log_forbidden_field_absence` | Step 15 structured log rules。 | Command/Job B01/B02、Query degraded、marker-only inbound、config/slot的 planned log仅含 safe ref/category/disposition/error/duration；被拒绝输入也不回显。 | raw command/query/event/job body、idempotency key、stable input、Role/mapping/component/seed body、manifest/digest/tag、provider response、secret/endpoint/stack trace。 |
| `metric_low_cardinality_labels` | Step 15 metric table。 | labels仅有限 kind/state/disposition/error/seam/slot/content/freshness class；不把数量/计时解释为 external success。 | ref/ID/cursor/actor/request/trace/provider run ID/free text/payload/digest/tag/config/path/endpoint/credential。 |
| `runtime_span_is_not_image_trace_record` | span 与 append-only trace 区分。 | span/log/metric不能证明 `ImageTraceRecord` 已写或 UoW已 commit；current Command/Job/Query/inbound的 local trace write为零。 | 将 runtime span body、provider trace header、payload、health/readiness写进 trace record。 |
| `image_trace_record_is_body_free_and_append_only` | Step 6/7/11/15 local trace。 | future flow-required trace只在同 UoW、commit后可读；fields是 local subject/body-free refs/correlation/causation/safe reason/time。 | update/delete、独立 audit UoW、query/read audit、outbound event/receipt/report/evidence。 |
| `local_composition_observation_not_readiness` | config/slot logs and metrics。 | `Assembled`/slot `Available` 的 signal只标 local composition。 | `ready`/`healthy`/started/build success/consumer confirmation/Artifact acceptance/provider health断言。 |
| `redaction_boundary_rejects_live_and_external_body` | static/live、external boundary validator。 | forbidden raw material进入 test model、store、signal或 result时，应产生 safe `ContractViolation`/redacted diagnostic only。 | 以脱敏后仍保留未授权 body、或写成 test evidence/report。 |

### 10.4 本 Step 不产生脚本、报告或证据契约

| 项目 | 决定 | 原因 |
|---|---|---|
| gate/report/redaction script contract | 不创建。 | 当前没有实现仓、测试 suite、artifact/report root、run_id 或 05 的测试策略授权；凭空定义脚本会伪造执行面。 |
| run/report/evidence layout | 不创建。 | 本 Step 仅定义设计验证切口，不产生或承诺真实运行产物。 |
| coverage/CI matrix | 不创建。 | 属于后续测试方案/实施计划；在 B01/B02和 owner contracts未闭合时无法诚实指定正向 suite。 |
| 影响 | future 05 必须从本文件的切口与 blocker重建具体用例、fixture、执行与证据规则。 | 未存在的脚本/报告不能被视为漏项或 readiness 缺陷。 |

## 11. Step 5~15 跨文档测试入口审计

| 前序 Step | 本 Step 承接 | 审计结论 | 不得改变的边界 |
|---|---|---|---|
| Step 5 模块契约 | §6.2 覆盖七个模块的对象/entry/infra/fake测试入口。 | `pass`。每模块都有最小 seam，未增加模块或反向依赖。 | `contracts`不是外部 public schema；domain不 I/O；entry不直写。 |
| Step 6 对象契约 | §8 的 state/guard/static-live seam。 | `pass_with_pending`。factory/enum可测，positive factory save仍future。 | 不新造状态/字段/对象、global lifecycle或 live truth。 |
| Step 7 port/adapter | §6/§9/§10 的 spy/fake/UoW/repository seam。 | `pass_with_explicit_blockers`。测试不新增 port、fake public contract或 adapter product。 | fake不替 owner，no outbox/publisher/receipt。 |
| Step 8 协议 | §7 覆盖 10 Command、10 Query、2 inbound、6 Job、0 outbound。 | `pass`。每个关键 logical surface均有当前异常/no-write或读侧入口和 future正向条件。 | 未绑定 route/topic/envelope/scheduler/report。 |
| Step 9 流程 | §7.2、§7.5、§9.1 的 B01/B02/no-write/order。 | `pass_with_explicit_blockers`。current assertions只验证实际可达 stop/read/marker。 | 不因测试开始 UoW、page、adapter、result、trace或 commit。 |
| Step 10 状态 | §8 覆盖19张 matrix、合法/非法/terminal/replacement和阶段隔离。 | `pass_with_explicit_blockers`。future positive state仍受 owner/flow门禁。 | `Available`/`Fresh`等不变 readiness；PF不被补 recovery。 |
| Step 11 持久化 | §9 反查 version/UoW/append-only/result order/projection truth direction。 | `pass_with_explicit_blockers`。B03保持 blocked。 | 不 delete/reinsert/history overwrite、upsert或 current truth replay。 |
| Step 12 错误恢复 | §7、§9.3 的 precision/error/no raw body/unknown/manual seam。 | `pass_with_explicit_blockers`。测试不把 Unknown转重试成功。 | 不默认 error、补偿写、外部重发或 raw diagnostic。 |
| Step 13 并发幂等 | §9.1~§9.2 覆盖 duplicate/conflict/unknown/version/race。 | `pass_with_explicit_blockers`。OPEN-01/02没有被 mock 关闭。 | 不私造 lease/TTL/AlreadyInProgress/global key index。 |
| Step 14 配置依赖 | §10.1~§10.2 保持 slot/fake/dependency classification。 | `pass_with_explicit_blockers`。configuration不能打开正向 lane。 | 不写 Cargo/product/endpoint/secret/consumer contract。 |
| Step 15 观测审计 | §10.3 保持 redaction/low-cardinality/local trace/composition 语义。 | `pass_with_explicit_blockers`。observability不能构成 truth或 evidence。 | 无 backend/dashboard/SLO/report/health/readiness。 |

### 11.1 横切反例审计

| 反例 | 结果 | 必须处置 |
|---|---|---|
| “为了 Command 正向测试”在 B01/B02 前让 fake repository返回成功。 | `fail` | 保持 boundary stop；fake不得替 canonical/result/UoW契约。 |
| Query 测试为准备 fixture而创建 projection、gap、trace或刷新 source。 | `fail` | fixture必须是既有 committed local surface的抽象；Query保持 no-write。 |
| 条件入站测试加入临时 envelope、event id、dedup、receipt。 | `fail` | 删除临时协议；MI-UP-005前只测 marker。 |
| 以 test profile/slot `Available`、日志/metric断言 image/runtime/consumer ready。 | `fail` | 改为 local composition/test-only boundary；不得生成 readiness。 |
| 使用 sibling 草稿、fake、ACK、cache、tag或裸 digest作为 Artifact/consumer/gate/build positive fixture。 | `fail` | 改为 blocked/non-positive seam；等待 owner formal contract。 |
| 新建 outbox/publisher/notification test以“覆盖下游”。 | `fail` | 保持 `NoneAuthorized`，若需求出现则重开设计。 |
| 将 testcase 名称/预计结果写成 run/report/evidence/verdict/signoff。 | `fail` | 保留为 planned test seam；05/06/07才定义执行/验收材料。 |

## 12. 正式 `03-详细设计.md` 第 15 章回填草稿（禁止当前装配）

> 回填前提：项目台账允许正式 03 装配、03 flow 已完成至 Step 19，且后续 Step 均获得用户确认。当前条件不满足；下面只是从 §6~§11 摘录，不引入新结论。

### 15. 测试切口与最小验证清单

本章仅提供未来实现与 `05-测试方案.md` 的最小验证入口，不代表测试实现、执行、覆盖率、报告、证据或验收结论。测试切口分为 current fail-closed/no-write、planned pure contract、future/reopen positive 和 blocked 四类。当前 10 个 Command 与 6 个 Operations Job 在 `DDD-S9-B01/B02` 前只能验证合法 shape 后 fail-closed 的零副作用；10 个 Query 严格只读；两条条件入站只返回 marker disposition 且 `accepted_input=false`；`ImageOutboundEventInventory::NoneAuthorized` 是严格零库存。

| 测试切口范围 | 最小验证要求 | 状态 |
|---|---|---|
| 七个模块 | `contracts` typed carrier/forbidden field；`domain` factory/guard/state/static-live；`application` B01/B02/no-write；`infra` config/slot/fake；`api` mapping；`worker` marker-only；`jobs` bounded stop。 | planned/current-negative，见本文件 §6。 |
| 10 Command | 每条都有 invalid-shape/no-write seam；真正 mutation、UoW、replay和local result均待 B01/B02及关联 owner合同重开。 | current-negative + future/reopen，见 §7.1~§7.2。 |
| 10 Query | hit/Empty/Gap/Stale/Rebuilding/Unavailable、page、`RequireFresh`/`InspectMarker`以及 strict no-write。 | read-only，见 §7.3。 |
| 2 inbound / 0 outbound / 6 Job | inbound恒 marker-only；outbound严格为零；Job当前 marker/B01/B02 stop，future bounded action需重新闭合。 | current-negative + blocked，见 §7.4~§7.5。 |
| 状态机 | 19张 matrix 均覆盖合法 edge、非法 edge、terminal/replacement和跨阶段隔离。 | planned/future，见 §8。 |
| 一致性与幂等 | B01/B02 zero-effect、version、append-only、replay、unknown、projection truth direction、no truth repair。 | current-negative/future/blocked，见 §9。 |
| 配置、fake、观测 | FakeOnly/TestOnly、分类保持、static/live、redaction、low-cardinality、local composition non-readiness。 | planned boundary，见 §10。 |

必须保持以下共通规则：

- Query 不得开 write UoW、reserve、写 trace/gap/freshness或修复 projection/reference。
- Command/Job 当前不得 canonicalize、reserve、读写 repository、调 adapter、写 trace/history/gap/freshness/result或 commit。
- duplicate future only replay stored shell/body；不得从 current truth、adapter、cache或 fake重算。
- `ImageTraceRecord` 是 append-only/body-free local record，不是 span、outbound event、receipt、report/evidence或 readiness proof。
- `Available`、`Fresh`、`Assembled` 与 slot `Available` 都不是 member/consumer/runtime/build/Artifact readiness。
- fake、config、cache、ACK、tag、裸 digest、兄弟仓草稿不得关闭 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-*` 或 `Q-MI-*`。

## 13. 待确认事项、Step 17 handoff 与停审门禁

### 13.1 保持开放的 blocker

| ID | 对测试切口的影响 | 当前处理 | 重开前提 |
|---|---|---|---|
| `DDD-S9-B01` | Command/Job canonicalization、reservation、任何 mutation/replay测试均不可执行。 | 只保留 validation/context → no-write stop seam。 | concrete canonical carrier、per-protocol field mapper和受影响 Step重审。 |
| `DDD-S9-B02` | result identity/shell/body、complete和duplicate replay不可执行。 | 不伪造 result ref/body、测试结果或 replay success。 | legal result factory/mapper、UoW/result ordering与 fake parity闭合。 |
| `DDD-S11-B03` | availability history terminal/supersede persistence不能被正向测试。 | 仅验证禁止 delete/reinsert/overwrite。 | Step 7/10 定义可持久化的 append/final模型。 |
| `DDD-S13-OPEN-01` | in-flight Reserved/second writer/cleanup/re-entry没有可断言 public contract。 | fail closed；不新增 lease/TTL/AlreadyInProgress。 | composite lookup、outcome、durable/fake parity与 recovery contract闭合。 |
| `DDD-S13-OPEN-02` | cross channel/name raw key namespace没有最终 callable behavior。 | 不 cross replay，不预设 global key index。 | identity/lookup/conflict policy统一重开。 |
| `PF-UNAVAILABLE-RECOVERY` | projection Unavailable 后无正向恢复测试。 | 只验证不能直接 Rebuilding/Fresh。 | recovery function、truth source、version/UoW/error mapping闭合。 |
| `MI-UP-001~009` | consumer/component/mapping/inbound/Artifact/outbound等正向测试不能落地。 | body-free ref、gap、blocked/unavailable/marker-only或 zero outbound。 | 各 owner 正式合同停审后重开受影响 Step。 |
| `Q-MI-001~004` | scope、builder/registry、gate/evidence等正向 test oracle不能落地。 | 不选产品、不造 digest/default pass/evidence。 | governance/owner authority与受影响 seam正式闭合。 |

### 13.2 给 Step 17 与未来 05 的输入（不自动进入）

| 下游 | 可消费输入 | 仍不可假设 |
|---|---|---|
| Step 17 实施交接 | 七模块、28条非出站 logical surface、19 state matrix、zero-effect/replay/config/redaction seam，以及 blocker→重开位置。 | 实现仓、crate/Cargo落地、测试代码/框架、run/report/evidence、任何正向 owner readiness。 |
| `05-测试方案.md` | 本文件 §6~§11 的 test-cut 名、scope、oracle、current/future/blocked分类和正式状态名。 | TC编号、priority、coverage、fixture/body、integration/CI、脚本、证据、执行结果。 |
| `06-验收标准.md` | fail-closed/no-write、redaction、owner boundary和零 outbound的不可违背条件。 | 验收已通过、signoff、readiness、发布/回滚成功。 |
| `07-实施计划.md` | 需要在实施前重开/核验的 B01/B02/B03/OPEN/PF/MI-UP/Q-MI清单。 | 任何实施 phase、commit、run_id、artifact digest、report/evidence alias或测试 verdict。 |

### 13.3 自检与停审记录

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP 要求的模块、接口、状态机、一致性/幂等四类输出齐全 | pass | §6、§7、§8、§9。 |
| 七模块均有最小测试入口 | pass | §6.2。 |
| 10 Command、10 Query、2 inbound、0 outbound、6 Job均有明确切口 | pass | §7.1~§7.5；outbound为严格 absence test。 |
| 每张状态 matrix均有合法/非法/terminal或隔离入口 | pass_with_blockers | §8；所有 mutation仍按 B01/B02/owner gate分类。 |
| 一致性/幂等/并发/unknown/B03/PF均被反查 | pass_with_explicit_blockers | §9；open item未被测试假关闭。 |
| 配置、fake、static/live、redaction和local composition边界齐全 | pass | §10。 |
| 未替代 05 测试方案 | pass | 未定义 TC、优先级、coverage、fixture、CI、脚本、run/report/evidence。 |
| 未越权实现或生成事实 | pass | 未实现/执行测试，未创建实现仓、脚本、run/report/evidence/digest/verdict/signoff/readiness，未修改正式 03/其他项目，未提交 commit。 |

```text
Step 16 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_17
formal_03_write_allowed = false
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
