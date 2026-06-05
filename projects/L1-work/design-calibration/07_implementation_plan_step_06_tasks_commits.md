# L1-work 07 实施计划 Step 6: 阶段任务、编写顺序与提交边界

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_06_tasks_commits.md` |

本步把 PH-01~PH-09 拆成阶段任务、代码实现批次和 commit boundary。本步不创建正式 `07-实施计划.md`,不执行实现仓代码修改,不替代 Step 7 的测试与验收门禁细化。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-09 阶段顺序、阶段目标和阶段门禁 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承交付物、非交付物、目标仓、crate、script、artifact、report 和跨仓依赖边界 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承阅读门禁、永久记忆种子、实现仓英文 commit 和唯一编译期依赖 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取文件布局、模块契约、对象、trait、协议、flow、状态、事务、幂等、配置、观测和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 runtime config、profile、adapter binding、artifact / report root、redaction 和 fail-fast 规则 |
| `05-测试方案.md` §5~§13 | 已完成 | 提取 `TC-WORK-*`、`EV-WORK-*`、suite、gate、artifact 和 report 证据 |
| `06-验收标准.md` §5~§11 | 已完成 | 提取 `AC-WORK-*`、`VF-WORK-*`、VETO、状态 / 事务 / no-write / evidence 红线 |
| `standards/document/实施计划书写规范.md` | 已读取 | 约束代码批次、提交边界、提交时机、规模门禁和开工前设计闭环复核 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 约束 Step 6 的任务表、批次表、提交边界表和进入下一步条件 |

校准来源:

- `design-calibration/03_ddd_step_04_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts.md`
- `design-calibration/03_ddd_step_06_object_contracts.md`
- `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
- `design-calibration/03_ddd_step_08_protocol_contracts.md`
- `design-calibration/03_ddd_step_09_function_flows.md`
- `design-calibration/03_ddd_step_10_state_matrix.md`
- `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
- `design-calibration/03_ddd_step_12_error_recovery.md`
- `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
- `design-calibration/03_ddd_step_14_config_external_binding.md`
- `design-calibration/03_ddd_step_15_observability_audit.md`
- `design-calibration/03_ddd_step_16_test_cuts.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/05_test_plan_step_06_cases_matrix.md`
- `design-calibration/05_test_plan_step_09_automation_gates.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_08_state_transaction_consistency.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`
- `design-calibration/06_acceptance_step_11_veto.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段内有哪些实施动作 | 每阶段按 contract / fixture、domain / state、application / UoW、infra / entry、evidence / gate 五类动作组织,但提交边界以可验证功能增量为准。 |
| 2. 每个任务的输入、输出和完成判定是什么 | 阶段任务表逐项列出输入、输出和完成判定;完成判定必须能回到 `TC-WORK-*`、suite、artifact 或 report,不能只写“代码完成”。 |
| 3. 阶段内代码应该按什么顺序写 | 先读当前 boundary 的正式章节和校准来源,再锁定 public contract / fixture / negative case,再实现 domain 和 application,再接 infra / entry,最后跑门禁和整理证据。 |
| 4. 是否先锁定外部契约和测试切口 | 是。Command / Query / Event / Job DTO、fixture、error surface 和 forbidden body negative case 必须先形成,再填内部实现。 |
| 5. 哪些任务必须同提交,哪些任务必须分开提交 | 同一 commit boundary 内的 DTO、domain、service、in-memory / fake adapter 和测试可以同提交;不同阶段、不同状态机、不同 no-write / redaction / evidence 风险不得混提交。 |
| 6. 哪些时机可以 commit | 一个 commit boundary 的全部代码批次和声明门禁通过后可以 commit;代码不可编译、测试失败、设计闭环未通过、混入无关改动或只是 WIP 时不能 commit。 |
| 7. 哪些测试必须提交前执行 | 至少执行本 boundary 声明的 fmt / check / unit / service / contract / integration / worker / job / config / redaction / report check。Step 7 会细化命令和验收嵌入。 |
| 8. 是否存在提交边界过大或过小的问题 | 有。按 crate 或全部 domain 提交过大;按单个 struct / 文件提交过小。本步按可验证纵切和风险隔离点拆成 22 个 commit boundary。 |
| 9. 是否存在无关修改混入风险 | 有。config skeleton、script、report、fixture、redaction 和 production adapter 容易混入业务阶段;本步在每个提交边界写明不包含内容。 |
| 10. 每个提交边界能否一句话描述 | 必须能。无法一句话描述的 boundary 在实施前需要拆分或回到 Step 6 修正。 |
| 11. 每个提交边界是否可独立 review / 验证 / 回退 | 必须可以。每个 boundary 都绑定批次、提交时机和提交前门禁。 |
| 12. 是否存在单批超过 300 / 500 行风险 | PH-02~PH-08 均存在超过 300 行风险,因此拆成多个 100~300 行批次;预计超过 500 行的动作必须继续拆分。 |
| 13. 哪些动作必须拆成多个代码批次 | Command 写路径、promotion review、dependency graph、iteration commitment、authorized query、projection rebuild、consumer dedup、outbox publish、handoff、evidence pack 必须拆批。 |
| 14. 哪些高风险逻辑必须单独批次 | 状态机、事务 / UoW、幂等 / dedup、optimistic version、authorization、redaction、outbox retry、projection no-write、reconciliation read-only、configured adapter fail-fast 必须单独批次或单独门禁。 |
| 15. 每批完成后执行哪些门禁 | 每批至少执行 `cargo fmt`、对应 `cargo check` 和目标 suite 的最小可用切片;高风险批次必须加跑对应 `TC-WORK-*` 或 redaction / no-write / evidence check。 |
| 16. 代码批次与提交边界的关系 | 一个 commit boundary 可以包含一个或少数几个强相关批次;批次通过后再判断是否达到提交边界,不得为每个文件单独提交。 |
| 17. phase / commit boundary 开工前复核什么 | 复核字段、DTO / Event / Job 构造、状态、ref identity、validation truth、metadata / idempotency、projection rebuild、artifact materialization 和 phase boundary。 |
| 18. 发现上游冲突如何处理 | 暂停当前 boundary,记录 blocker 并回写设计真相源;不得在实现仓自行补字段、选状态名、改变 phase scope 或造第二真相。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 5 只有阶段顺序 | PH-01~PH-09 已排序,但没有阶段内任务和提交边界 | 实施者仍可能按对象或 crate 随意编码 | 本步补任务、批次和 commit boundary |
| Work P0 对象跨度大 | 18 Command、8 Query、7 Consumer、9 Event、6 Job 横跨七个 crate | 单阶段大提交不可 review | 按功能纵切与风险隔离点拆 22 个 boundary |
| Query / Operations 容易后置 | 查询、projection、outbox、reconciliation 和 reports 是验收面 | 最后才发现 no-write 或 evidence 不闭合 | PH-07 / PH-08 独立拆分,PH-09 只做 release 收口 |
| 配置和证据易散落 | `04/05/06` 均要求 config、artifact、report、redaction | 最终验收证据不可复核 | PH-01 建骨架,PH-09 收口,中间阶段按 boundary 产最小证据 |
| 设计缺口处理方式未落到 commit | 详细设计已强调不得自行补设计 | 实现 agent 可能遇缺口时临时落码 | 本步给每个 boundary 固定开工前设计闭环复核 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段内部任务 | 只有阶段名称和目标 | 每阶段有 `IMPL-*` 任务 | 实施动作可执行 |
| 编写顺序 | 只有阶段依赖 | 形成全局顺序和阶段特化顺序 | 避免先铺内部对象再补协议 / 测试 |
| 代码批次 | 未定义 | 每阶段有 `BATCH-*` 代码切片 | 控制批次规模和验证粒度 |
| 提交边界 | 未定义 | 形成 `commit-01-a`~`commit-09-a` 共 22 个 boundary | 支持 review、回退和证据审查 |
| 开工复核 | 只在标准中出现 | 映射到每个 boundary 的固定门禁 | 防止 1:1 落码时自行补设计 |
| 测试证据 | 只作为阶段门禁 | 每个 boundary 有最小提交前门禁,完整门禁留 Step 7 | 避免测试后置 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一个阶段一笔提交 | 简单,git log 短 | PH-04 / PH-07 / PH-08 过大 | 不采用 |
| 一个文件一笔提交 | 局部 diff 小 | 不能表达业务闭环,review 噪音大 | 不采用 |
| 一个可验证纵切一笔提交 | 可一句话描述,可验证,可回退 | 需要跨 crate 同步组织 | 采用 |
| 测试最后统一提交 | 初期编码快 | 不满足阶段可验证和验收证据要求 | 不采用 |
| 功能与对应测试同 boundary | 每笔提交可复核 | 单笔提交稍大 | 采用 |
| 在 Step 6 细化所有 test command | 具体 | 会抢 Step 7 职责 | 不采用;Step 6 只写最小门禁族 |

## 7. 结构化中间产物

### 7.1 全局编写顺序规则

| 顺序 | 动作 | 原因 |
|---:|---|---|
| 1 | 读取当前 phase / commit boundary 的正式章节和校准来源 | 确认 scope、字段、状态、协议和验收口径 |
| 2 | 执行开工前设计闭环复核 | 避免实现者自行补字段、DTO、状态或 phase scope |
| 3 | 建立 / 更新 public contract、fixture、negative case 和测试切口 | 先锁定外部行为和失败面 |
| 4 | 实现 domain value object、state、policy 和 invariant | 让核心规则可独立测试 |
| 5 | 实现 application service、port、UoW、idempotency / dedup 和 error mapping | 集中事务、副作用和幂等逻辑 |
| 6 | 实现 infra in-memory / fake adapter、projection / store 和 runtime wiring | 支撑 P0 可验证路径,不做 production adapter |
| 7 | 接入 API / worker / jobs entry | 只做薄入口和 DTO mapping |
| 8 | 运行本批次门禁并写入 artifact / report skeleton | 确认批次可验证 |
| 9 | 达到 commit boundary 后提交 | 只提交已验证、可 review、可回退的增量 |

### 7.2 开工前设计闭环复核模板

每个 phase / commit boundary 开工前必须执行下表。失败时暂停当前 boundary,回报设计缺口,不得在实现仓临时造字段、状态或 DTO。

| 复核项 | 检查内容 | 失败处理 |
|---|---|---|
| 字段闭环 | 本 boundary 的 Domain 必填字段能回指 DTO、Event、Job、repository lookup、resolver、id generator 或 clock | 暂停并回写 `03` 对象契约 / flow |
| DTO 构造闭环 | Command / Query / Event / Job 输入能构造目标对象、result、receipt、view、page 或 marker | 暂停并回写协议契约 |
| 状态闭环 | 状态 enum、转换矩阵、测试断言和验收口径使用同一正式状态名 | 回写状态矩阵或测试 / 验收口径 |
| ref identity 闭环 | id / ref / cursor / page token / projection key 有正式类型、归属和查找规则 | 暂停并补 shared ref 或 repository key |
| validation truth 闭环 | 校验所需 truth、snapshot、policy、resolver 或 config source 已定义 | 暂停并补 truth source / port |
| metadata / idempotency 闭环 | metadata authority、idempotency key、canonical digest、result ref、duplicate result 和 UoW 顺序闭合 | 暂停并补幂等 / 事务契约 |
| projection rebuild 闭环 | projection / search / board / trace 的 committed truth、replay source、stale / failed marker 已定义 | 暂停并补 projection truth source |
| artifact materialization 闭环 | gate / job / report 能定位 artifact root、report root、run_id、safe snapshot 和 failure reason | 暂停并补 `04/05/06` 证据口径 |
| phase boundary 闭环 | 当前 boundary 不依赖后续 phase 才产出的 DTO、state、service、adapter、evidence 或 report | 调整提交边界或回写实施计划 |

### 7.3 阶段任务表

| 任务编号 | 阶段 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---|---:|---|---|---|---|
| IMPL-01-01 | PH-01 | 1 | 创建目标仓、Rust workspace、crate skeleton 和 package 命名 | `03` §4、Step 3 | `/home/aris/Projects/quantalithos-work`、root `Cargo.toml`、`crates/*` | workspace 可 `cargo check` |
| IMPL-01-02 | PH-01 | 2 | 接入唯一 `core-contracts` path dependency 和基础 lint / fmt 约束 | `03` §3 / §4、`06` `VF-WORK-008` | Cargo dependency、minimal crate exports | dependency compile 和非 core dependency check 通过 |
| IMPL-01-03 | PH-01 | 3 | 建立 strict config skeleton、runtime builder skeleton、script / artifact / report root | `04` §3~§12、`05` §9 / §13 | config fixtures、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | script `--help`、path check、config smoke 通过 |
| IMPL-02-01 | PH-02 | 1 | 定义 Project / Backlog command contracts、result、fixtures 和 negative case | `03` §7 / §8、`05` `CORE` | command DTO、result DTO、fixture、contract tests | DTO roundtrip / validation 通过 |
| IMPL-02-02 | PH-02 | 2 | 实现 Project / Backlog domain lifecycle、trace / audit / outbox intent policy | `03` §6 / §9 / §10 | domain objects、state tests | `TC-WORK-CORE-001~003` domain 切片通过 |
| IMPL-02-03 | PH-02 | 3 | 实现 Project command service、UoW、idempotency、in-memory repo 和 minimal handler | `03` §8 / §11~§13 | service、repo、handler、duplicate result | `TC-WORK-CORE-001~004` service 切片通过 |
| IMPL-03-01 | PH-03 | 1 | 定义 ProjectMember command contracts、identity snapshot refs 和 fixtures | `03` §7、`05` `MEMBER` | DTO、resolver fixture、contract tests | member protocol tests 通过 |
| IMPL-03-02 | PH-03 | 2 | 实现 ProjectMember domain、responsibility state、identity boundary policy | `03` §6 / §9 | member domain、policy tests | `TC-WORK-MEMBER-001/003/004` domain 切片通过 |
| IMPL-03-03 | PH-03 | 3 | 实现 identity resolver port / fake、service、repository 和 unresolved handling | `03` §7~§13 | resolver fake、service、repo、handler | `TC-WORK-MEMBER-001~004` service 切片通过 |
| IMPL-04-01 | PH-04 | 1 | 定义 Backlog / WorkItem / ChildWorkItem / Promote command contracts 和 fixtures | `03` §7、`05` `FORMAL` / `PROMOTE` | DTO、result、fixture、contract tests | FORMAL / PROMOTE protocol tests 通过 |
| IMPL-04-02 | PH-04 | 2 | 实现 Backlog / WorkItem / ChildWorkItem domain、maintenance lock 和 forbidden body guard | `03` §6 / §9 / §15 | domain state、policy、body guard | `TC-WORK-FORMAL-001~005` domain 切片通过 |
| IMPL-04-03 | PH-04 | 3 | 实现 formal work command service、repository、lifecycle handler 和 outbox / stale marker | `03` §8 / §11~§13 | services、repo、handler、tests | FORMAL service 切片通过 |
| IMPL-04-04 | PH-04 | 4 | 实现 promotion request / review、runtime intake ref、version conflict 和 body reject | `03` §6~§13 | promote domain / service、runtime fixture | `TC-WORK-PROMOTE-001~005` 通过 |
| IMPL-05-01 | PH-05 | 1 | 定义 dependency / blocker command contracts、evidence refs 和 fixtures | `03` §7、`05` `DEP` | DTO、fixtures、contract tests | dependency / blocker protocol tests 通过 |
| IMPL-05-02 | PH-05 | 2 | 实现 dependency graph、cycle reject、blocker state 和 terminal guard | `03` §6 / §9 / §10 | domain graph、state tests | `TC-WORK-DEP-001~004` domain 切片通过 |
| IMPL-05-03 | PH-05 | 3 | 实现 evidence resolver seam、resolve blocker service、audit history 和 no body guard | `03` §7~§13 | resolver fake、service、repo tests | `TC-WORK-DEP-001~005` service 切片通过 |
| IMPL-06-01 | PH-06 | 1 | 定义 Iteration / Commitment command contracts、process timebox refs 和 fixtures | `03` §7、`05` `ITER` | DTO、fixtures、contract tests | iteration protocol tests 通过 |
| IMPL-06-02 | PH-06 | 2 | 实现 Iteration / Commitment domain、candidate guard、close / cancel state | `03` §6 / §9 / §10 | domain state、policy tests | `TC-WORK-ITER-001/003/005` domain 切片通过 |
| IMPL-06-03 | PH-06 | 3 | 实现 process seam、commit / change service、work marks、UoW 和 concurrency guard | `03` §7~§13 | services、repo、resolver fake、tests | `TC-WORK-ITER-001~005` service 切片通过 |
| IMPL-07-01 | PH-07 | 1 | 定义 8 Query、view / page DTO、projection freshness surface 和 fixtures | `03` §7 / §8、`05` `QUERY` | query DTO、view DTO、fixtures | query protocol tests 通过 |
| IMPL-07-02 | PH-07 | 2 | 实现 authorized query service、read model store、no-write assertion 和 error surface | `03` §8 / §11 / §12 | query service、projection store、tests | `TC-WORK-QUERY-001~005` 切片通过 |
| IMPL-07-03 | PH-07 | 3 | 实现 search、trace page、board view、stale / failed / rebuilding marker 和 handlers | `03` §7~§15 | query handlers、search / trace / board tests | `TC-WORK-QUERY-006~008` 和 no-write tests 通过 |
| IMPL-08-01 | PH-08 | 1 | 定义 inbound / outbound event DTO、job DTO、receipt / report 和 fixtures | `03` §7 / §8、`05` `OPS` | event / job contracts、fixtures | event / job contract tests 通过 |
| IMPL-08-02 | PH-08 | 2 | 实现 7 Consumer、dedup、reference snapshot / marker、dead-letter / quarantine | `03` §8 / §12 / §13 | consumer services、dedup store、tests | 同族 consumer tests 和 redaction scan 通过 |
| IMPL-08-03 | PH-08 | 3 | 实现 outbox publisher、9 outbound events、publication retry / failed marker | `03` §7~§13 | publisher fake、outbox service、tests | `TC-WORK-OPS-001` 和 event tests 通过 |
| IMPL-08-04 | PH-08 | 4 | 实现 projection rebuild、reference refresh、reconciliation、trace / archive handoff jobs | `03` §8 / §11~§15 | job runners、reports、handoff fake | `TC-WORK-OPS-002~006` 切片通过 |
| IMPL-09-01 | PH-09 | 1 | 执行 release gate scripts、evidence index、redaction report 和 acceptance handoff | `05` §9 / §13、`06` §10 / §11 | release reports、evidence pack、veto checklist | release gates 和 evidence checks 通过 |
| IMPL-09-02 | PH-09 | 2 | 整理 residual risks、open issues、handoff summary 和 final verification note | `06` §12~§14 | `reports/acceptance/handoff.md`、risk notes | P0 S/A blocker 为 0,VETO 均有结论 |

### 7.4 代码实现批次表

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | workspace、crate skeleton 和 core dependency 可编译 | IMPL-01-01~02 | Cargo workspace、empty crate exports、dependency report | 100~300 行 | `cargo fmt`;`cargo check`;dependency grep | commit-01-a |
| BATCH-01-02 | config、script、artifact、report skeleton 可检查 | IMPL-01-03 | config fixture、runtime shell、script `--help`、path README | 100~300 行 | config smoke;script help;path check | commit-01-b |
| BATCH-02-01 | Project / Backlog contracts 和 fixtures 稳定 | IMPL-02-01 | command DTO、result、fixtures、contract tests | 100~300 行 | DTO roundtrip / validation | commit-02-a |
| BATCH-02-02 | Project / Backlog domain 和 lifecycle 成立 | IMPL-02-02 | domain state、trace / audit / outbox intent helpers、unit tests | 100~300 行 | `unit-contract-domain` selected CORE | commit-02-a |
| BATCH-02-03 | Project / Backlog 最小写路径闭环 | IMPL-02-03 | service、UoW、idempotency、repo、handler tests | 需拆分;每批不超过 300 行 | `service-core` selected CORE | commit-02-b |
| BATCH-03-01 | ProjectMember contracts、fixtures 和 domain 成立 | IMPL-03-01~02 | DTO、resolver fixture、member domain、policy tests | 100~300 行 | member contract / domain tests | commit-03-a |
| BATCH-03-02 | identity seam 和 member service 闭环 | IMPL-03-03 | resolver port / fake、service、repo、handler tests | 需拆分;每批不超过 300 行 | `service-core` selected MEMBER | commit-03-b |
| BATCH-04-01 | Backlog / WorkItem / ChildWorkItem contracts 和 domain 成立 | IMPL-04-01~02 | DTO、formal work domain、body guard tests | 需拆分;每批不超过 300 行 | FORMAL contract / domain tests | commit-04-a |
| BATCH-04-02 | formal work service 和 lifecycle 闭环 | IMPL-04-03 | service、repo、handler、outbox / stale tests | 需拆分;每批不超过 300 行 | `service-core` selected FORMAL | commit-04-b |
| BATCH-04-03 | promote request / review / runtime boundary 闭环 | IMPL-04-04 | promote domain / service、runtime fixture、version conflict tests | 需拆分;每批不超过 300 行 | PROMOTE service + concurrency selected | commit-04-c |
| BATCH-05-01 | dependency / blocker contracts、graph 和 state 成立 | IMPL-05-01~02 | DTO、graph domain、cycle / terminal tests | 100~300 行 | DEP contract / domain tests | commit-05-a |
| BATCH-05-02 | evidence resolver 和 blocker resolve service 闭环 | IMPL-05-03 | resolver fake、service、audit history、no body tests | 需拆分;每批不超过 300 行 | DEP service + redaction selected | commit-05-b |
| BATCH-06-01 | iteration contracts、domain 和 state 成立 | IMPL-06-01~02 | DTO、iteration domain、candidate guard tests | 100~300 行 | ITER contract / domain tests | commit-06-a |
| BATCH-06-02 | commitment service、process seam 和 concurrency guard 闭环 | IMPL-06-03 | resolver fake、service、UoW、version tests | 需拆分;每批不超过 300 行 | ITER service + concurrency selected | commit-06-b |
| BATCH-07-01 | query / view / page contracts 和 fixtures 稳定 | IMPL-07-01 | 8 Query DTO、view DTO、fixtures、contract tests | 需拆分;每批不超过 300 行 | `api-contract-fast` selected QUERY | commit-07-a |
| BATCH-07-02 | authorized read model 和 core query service 闭环 | IMPL-07-02 | query service、projection store、auth / no-write tests | 需拆分;每批不超过 300 行 | `service-core` selected QUERY | commit-07-b |
| BATCH-07-03 | search、trace、board 和 query handlers 闭环 | IMPL-07-03 | handlers、search refs、trace page、board view tests | 需拆分;每批不超过 300 行 | `api-contract-fast`;`integration-p0` selected QUERY | commit-07-c |
| BATCH-08-01 | event / job contracts、receipt 和 report schema 稳定 | IMPL-08-01 | inbound / outbound event DTO、job DTO、fixtures | 需拆分;每批不超过 300 行 | `worker-job-contract` schema selected | commit-08-a |
| BATCH-08-02 | 7 consumer dedup、snapshot / marker 和 quarantine 闭环 | IMPL-08-02 | consumer services、dedup store、dead-letter tests | 需拆分;每批不超过 300 行 | `consumer-outbox` selected consumers | commit-08-b |
| BATCH-08-03 | outbox publish 和 9 outbound events 闭环 | IMPL-08-03 | outbox publisher、publisher fake、retry / failed tests | 需拆分;每批不超过 300 行 | `TC-WORK-OPS-001`;event tests | commit-08-c |
| BATCH-08-04 | projection rebuild、reference refresh 和 reconciliation 闭环 | IMPL-08-04 | job runners、report marker、read-only tests | 需拆分;每批不超过 300 行 | `TC-WORK-OPS-002~004`;no-write tests | commit-08-d |
| BATCH-08-05 | trace / archive handoff jobs 闭环 | IMPL-08-04 | handoff fake、handoff markers、rerun tests | 需拆分;每批不超过 300 行 | `TC-WORK-OPS-005~006`;redaction selected | commit-08-e |
| BATCH-09-01 | release gates、evidence index 和 redaction report 可复核 | IMPL-09-01 | gate results、evidence index、redaction report、veto checklist | 100~300 行脚本 / report glue | release gates selected | commit-09-a |
| BATCH-09-02 | acceptance handoff 和 residual risk 收口 | IMPL-09-02 | acceptance handoff、risk notes、final verification | 100~300 行 report glue | evidence pack;path check;no `latest` | commit-09-a |

### 7.5 提交边界表

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace、crate skeleton 和 `core-contracts` dependency 可编译后 | root workspace、`crates/*` skeleton、path dependency、dependency check | 业务 DTO、domain、API route、production adapter | `cargo fmt`;`cargo check`;dependency grep |
| commit-01-b | config / script / evidence skeleton 可检查后 | config fixture、runtime shell、gate / report / check script skeleton、artifact / report roots | 业务测试实现、release report 内容、真实外部依赖 | config smoke;script `--help`;path check |
| commit-02-a | Project / Backlog DTO、domain 和 lifecycle tests 通过后 | Project / Backlog contracts、domain、fixtures、trace / audit / outbox intent helpers | application service、API handler、member、work item | contract / domain CORE tests |
| commit-02-b | Project / Backlog 写路径和 duplicate tests 通过后 | command service、UoW、idempotency、in-memory repo、minimal handler | member、formal work、query、production store | `TC-WORK-CORE-001~004` selected |
| commit-03-a | ProjectMember contracts、domain 和 identity boundary tests 通过后 | member DTO、resolver fixture、member domain、responsibility policy | resolver runtime wiring、member handler、formal work | member contract / domain tests |
| commit-03-b | ProjectMember service、resolver fake 和 unresolved handling tests 通过后 | resolver port / fake、member service、repository、handler、unresolved surface | work item、dependency、production identity adapter | `TC-WORK-MEMBER-001~004` selected |
| commit-04-a | formal work contracts、domain、body guard tests 通过后 | Backlog / WorkItem / ChildWorkItem DTO、domain、maintenance lock、forbidden body tests | application write service、promotion, dependency | FORMAL contract / domain / redaction selected |
| commit-04-b | formal work write service 和 lifecycle tests 通过后 | create / child / lifecycle services、repository、handler、outbox / stale marker | promotion review、dependency / blocker、query handlers | `TC-WORK-FORMAL-001~005` selected |
| commit-04-c | promote request / review、runtime boundary 和 version conflict tests 通过后 | promote DTO / domain / service、runtime fixture、version conflict tests | dependency / blocker、iteration、production runtime adapter | `TC-WORK-PROMOTE-001~005` selected |
| commit-05-a | dependency / blocker graph domain tests 通过后 | dependency / blocker DTO、domain graph、cycle reject、terminal guard | evidence resolver service、iteration | DEP contract / domain tests |
| commit-05-b | evidence resolver、resolve blocker 和 audit history tests 通过后 | evidence resolver seam / fake、dependency / blocker services、audit / no body tests | iteration, query, production artifact adapter | `TC-WORK-DEP-001~005` selected |
| commit-06-a | Iteration / Commitment contracts、domain 和 state tests 通过后 | iteration DTO、commitment domain、candidate guard、close / cancel state | process resolver service、query、operations jobs | ITER contract / domain tests |
| commit-06-b | iteration service、process seam 和 concurrency guard tests 通过后 | process resolver fake、commit / change / lifecycle service、work marks、UoW tests | query projection, production process adapter | `TC-WORK-ITER-001~005` selected |
| commit-07-a | query / view / page contracts 和 fixtures tests 通过后 | 8 Query DTO、view / page DTO、fixtures、protocol tests | read model service、projection store、handlers | query contract tests |
| commit-07-b | authorized read model、projection freshness 和 no-write tests 通过后 | query service、projection store、auth guard、stale / failed surface | search / trace / board handlers、operations rebuild | `TC-WORK-QUERY-001~005` selected |
| commit-07-c | search、trace、board view 和 query handler tests 通过后 | search refs、trace page、board view、query handlers、no-write evidence | outbox publish, consumer, jobs | `TC-WORK-QUERY-006~008`;`api-contract-fast` selected |
| commit-08-a | event / job DTO、receipt 和 report schema tests 通过后 | inbound / outbound event DTO、job DTO、receipt / report fixtures | consumer services、outbox publisher、job runners | event / job contract tests |
| commit-08-b | 7 consumer dedup / quarantine / marker tests 通过后 | consumer services、dedup store、reference snapshot / marker、dead-letter / quarantine | outbox publish, operations jobs, production external adapters | consumer selected tests;redaction selected |
| commit-08-c | outbox publish、outbound events、retry / failed tests 通过后 | outbox publisher、publisher fake、9 outbound events、publication state tests | projection rebuild, handoff jobs, real bus adapter | `TC-WORK-OPS-001`;consumer-outbox selected |
| commit-08-d | projection rebuild、reference refresh、reconciliation tests 通过后 | rebuild job、reference refresh job、reconciliation report、read-only guards | trace / archive handoff, release pack | `TC-WORK-OPS-002~004`;no-write checks |
| commit-08-e | trace / archive handoff rerun and redaction tests 通过后 | handoff jobs、fake handoff adapters、failed markers、rerun evidence | real observability / archive integration, release summary | `TC-WORK-OPS-005~006`;redaction selected |
| commit-09-a | release gates、evidence pack、veto checklist 和 acceptance handoff 可复核后 | release gate scripts, evidence index, redaction report, acceptance handoff, residual risk note | 新功能、production adapter、验收裁决 | `release-main-smoke`;`release-config-redline`;`release-evidence-pack`;path check |

### 7.6 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留 |
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 适中 | 是 | 是 | 保留 |
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 适中 | 是 | 是 | 保留 |
| commit-04-a | 偏大但合理 | 是 | 是 | formal work DTO / domain 超 300 行时拆批次,不拆 boundary |
| commit-04-b | 偏大但合理 | 是 | 是 | create / child / lifecycle 可拆批次,不混 promotion |
| commit-04-c | 适中 | 是 | 是 | 保留 |
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 适中 | 是 | 是 | 保留 |
| commit-06-a | 适中 | 是 | 是 | 保留 |
| commit-06-b | 适中 | 是 | 是 | 保留 |
| commit-07-a | 偏大但合理 | 是 | 是 | query DTO / view DTO 按 query group 拆批次 |
| commit-07-b | 偏大但合理 | 是 | 是 | projection / no-write 单独批次验证 |
| commit-07-c | 偏大但合理 | 是 | 是 | search / trace / board 各自拆批次 |
| commit-08-a | 偏大但合理 | 是 | 是 | event / job schema 按 inbound / outbound / job 拆批次 |
| commit-08-b | 偏大但合理 | 是 | 是 | 7 consumer 分组拆批次 |
| commit-08-c | 适中 | 是 | 是 | 保留 |
| commit-08-d | 偏大但合理 | 是 | 是 | rebuild / refresh / reconciliation 分批 |
| commit-08-e | 适中 | 是 | 是 | 保留 |
| commit-09-a | 适中 | 是 | 是 | 只做 release evidence 收口,不加新功能 |

### 7.7 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| 开工复核 | 当前 boundary 已按 §7.2 复核,无未闭合字段 / DTO / 状态 / phase dependency |
| git 配置 | 实现仓项目级 `user.name` / `user.email` 符合 §3 前置条件 |
| diff 范围 | 只覆盖一个 commit boundary,不混入用户已有未提交改动、无关格式化或跨阶段功能 |
| 编译格式 | `cargo fmt`、目标 crate `cargo check` 或 workspace check 通过 |
| 边界门禁 | 本 boundary 声明的 suite / `TC-WORK-*` / redaction / no-write / report check 已通过或有明确失败证据 |
| 证据路径 | 需要 artifact / report 的 boundary 使用显式 `run_id`,不引用 `latest` |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 |
| 外部依赖 | 非 `core-contracts` sibling repo 未进入 Cargo dependency |
| Commit message | 实现仓英文标题 `type(scope): subject`;body 按子功能分组;footer 规则留 Step 11 展开 |

### 7.8 提交边界到阶段阅读门禁提示

| 阶段 | 开工前重点补读 |
|---|---|
| PH-01 | `03` §3~§5、`04` §3~§9、`05` §9 / §13、Step 3 / Step 4 / Step 5 |
| PH-02 | `03` §6 Project / Backlog、§7 Command、§8 Command flow、§10~§13、`05` CORE、`06` `AC-WORK-001/006` |
| PH-03 | `03` ProjectMember object / port / flow、identity boundary、`05` MEMBER、`06` `AC-WORK-002/007` |
| PH-04 | `03` Backlog / WorkItem / ChildWorkItem / Promote contracts、runtime boundary、`05` FORMAL / PROMOTE、`06` `AC-WORK-003/008/009` |
| PH-05 | `03` Dependency / Blocker / evidence resolver contracts、`05` DEP、`06` `AC-WORK-010/019/027` |
| PH-06 | `03` Iteration / Commitment / process seam contracts、`05` ITER、`06` `AC-WORK-004/011` |
| PH-07 | `03` Query / View / Projection / Trace contracts、`05` QUERY、`06` `AC-WORK-005/012` 和 no-write 红线 |
| PH-08 | `03` Consumer / Outbound Event / Job contracts、`05` OPS / CFG / NFR、`06` operations / redaction / evidence 红线 |
| PH-09 | `05` §9 / §13、`06` §10 / §11 / §14、Step 7 / Step 11 / Step 12 的最终门禁 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §6。

````markdown
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“全局编写顺序规则”“开工前设计闭环复核模板”“阶段任务表”“代码实现批次表”“提交边界表”和“提交前检查清单”小节,了解实施任务如何按可验证功能增量和提交边界收敛。

每个 phase / commit boundary 开工前必须先完成设计闭环复核。复核至少覆盖字段闭环、DTO / Event / Job 构造闭环、状态闭环、ref identity、validation truth、metadata / idempotency、projection rebuild、artifact materialization 和 phase boundary。任一适用项未通过时,暂停当前 boundary 并回报设计缺口,不得在实现仓自行补设计。

本轮实施按 PH-01~PH-09 推进。阶段内先锁定 public contract、fixture 和测试切口,再实现 domain / application,再接 infra / entry,最后运行门禁并按提交边界提交。

| 阶段 | 关键任务 | 代码批次 | 提交边界 | 提交前门禁 |
|---|---|---|---|---|
| PH-01 | workspace、core dependency、config、script、artifact / report skeleton | BATCH-01-01~02 | commit-01-a / commit-01-b | `cargo check`;config smoke;script help;path check |
| PH-02 | Project / Backlog contracts、domain、write path、idempotency | BATCH-02-01~03 | commit-02-a / commit-02-b | CORE contract / domain / service tests |
| PH-03 | ProjectMember、identity boundary、resolver seam | BATCH-03-01~02 | commit-03-a / commit-03-b | MEMBER contract / domain / service tests |
| PH-04 | Backlog / WorkItem / ChildWorkItem / Promote 正式工作全集 | BATCH-04-01~03 | commit-04-a / commit-04-b / commit-04-c | FORMAL / PROMOTE tests;redaction selected |
| PH-05 | Dependency / Blocker / Evidence graph 和解除依据 | BATCH-05-01~02 | commit-05-a / commit-05-b | DEP tests;no body selected |
| PH-06 | Iteration / Commitment / process ref boundary | BATCH-06-01~02 | commit-06-a / commit-06-b | ITER tests;concurrency selected |
| PH-07 | 8 Query、projection、trace、search、board 和 no-write | BATCH-07-01~03 | commit-07-a / commit-07-b / commit-07-c | QUERY contract / service / API tests;no-write checks |
| PH-08 | Consumer、outbox、events、operations jobs、handoff | BATCH-08-01~05 | commit-08-a / commit-08-b / commit-08-c / commit-08-d / commit-08-e | worker / job / consumer / OPS tests;redaction / no-write checks |
| PH-09 | release gate、evidence index、redaction report、acceptance handoff | BATCH-09-01~02 | commit-09-a | release gates;evidence pack;path check;veto checklist |

代码批次以 100~300 行为宜;预计超过 300 行应拆分;预计超过 500 行必须拆分。状态机、事务、并发、幂等、权限、安全、审计、错误恢复、projection no-write、outbox retry、reconciliation read-only 和跨仓同步逻辑必须单独批次实现、单独验证。

每个 commit boundary 必须能用一句话描述、能独立 review、能独立验证、必要时能独立回退。禁止按单个文件、单个 struct、单个函数或当天工作量提交;禁止把无关格式化、功能、测试、配置和文档混成一笔。
````

## 9. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续必须继续收口:

- Step 7 细化每个阶段和 commit boundary 的测试命令、suite、artifact、report 和验收门禁。
- Step 8 细化配置、环境、profile、外部依赖准备和 failure mode。
- Step 11 展开实现仓 commit message 模板、body 分组、footer 和提交纪律。
- 实施时若某 boundary 发现设计闭环失败,必须暂停并回写设计,不得把本 Step 的 commit boundary 当作强行开工许可。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个阶段都有任务表、代码批次和提交边界 | 已满足 |
| 每个阶段或 commit boundary 都有开工前设计闭环复核口径 | 已满足 |
| 每个提交边界都有提交时机、包含内容、不包含内容和提交前门禁 | 已满足 |
| 批次规模、验证门禁和提交关系清楚 | 已满足 |
| 未修改正式 `07-实施计划.md` | 已满足 |

用户审核确认后,可以进入 Step 7: 嵌入测试与验收门禁。
