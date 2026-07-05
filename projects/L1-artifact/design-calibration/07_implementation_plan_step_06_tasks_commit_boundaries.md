# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填章节: `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 PH-01~PH-08;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md`;可落码性标准 §九 |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 阶段总表 | 已完成;用户已确认 | 固定 PH-01~PH-08 的实施顺序、依赖关系和阶段目标 |
| `03-详细设计.md` §4~§16 | 已存在 | 提取对象、port、protocol、flow、状态机、持久化、一致性、幂等、观测与 handoff 契约 |
| `04-配置设计.md` §6~§12 | 已存在 | 固定 profile、config source priority、runtime builder、disabled / degraded seam 和脚本参数边界 |
| `05-测试方案.md` §6 / §9 / §13 / §14 | 已存在 | 绑定 P0 suite、脚本、artifact/report roots、candidate evidence 和回归触发条件 |
| `06-验收标准.md` §5~§14 | 已存在 | 绑定 `AC-ART-*`、`VETO-ART-*`、risk acceptance 和 acceptance handoff |
| `standards/document/实施计划书写规范.md` | 已存在 | 固定 boundary gate matrix、required_reads、allowed_scope、required_checks、Commit Gate、Handoff Gate |
| `standards/document/代码实施台账与门禁规范.md` | 已存在 | 固定项目级 implementation ledger、boundary ledger 和 future planned skeleton 预创建规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` §九 | 已存在 | 约束每个 commit boundary 的开工前设计闭环复核和经验复核 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个阶段内有哪些实施动作? | 每个 phase 都拆成 contracts / domain、application / ports / UoW、infra fake / runtime、entry、tests / scripts / evidence 五类动作,并按 commit boundary 收敛成可验证增量。 |
| 阶段内代码按什么顺序写? | 统一顺序为: public contracts/ref/view/receipt/job shell -> domain truth/state/policy -> application ports/UoW/idempotency -> infra fake/runtime/config -> api/worker/jobs entry -> targeted suites / script / report shell。 |
| 是否先锁定 public contract 和测试切口,再填内部实现? | 是。任何 service、worker、job、publisher 在 public DTO、状态矩阵、port surface 和最小测试切口未闭合前不得开工。 |
| 哪些内容必须同提交,哪些必须拆开? | 同一可验证能力的 contracts+domain+unit tests 可以同提交;同一 accepted flow 的 application+repo fake+entry+targeted tests 可以同提交。不同 capability family、不同 phase、release evidence 与业务功能必须拆开。 |
| 提交边界如何命名? | 采用 `commit-<phase>-<slot>` 形式,从 `commit-01-a` 到 `commit-08-b`。每一笔都必须能用一句话描述,并可独立 review、独立验证、必要时独立回退。 |
| 每个提交前必须跑哪些检查? | 至少包括 `git status --short`、`cargo fmt --check`、`cargo check` 或 boundary 级 package check、targeted tests、`git diff --check`、`git diff --cached`。涉及 scripts / reports 的 boundary 还必须跑 dry-run 或 report audit。 |
| 哪些动作必须拆成多批代码实现? | query family、consumer family、outbound payload builder、relay publisher loop、public jobs、report generator 都必须分批实现。批次控制服务于 review 和验证,不是压缩范围。 |
| 是否存在过粗或过细提交风险? | 存在。`commit-05-b`、`commit-06-c`、`commit-07-b`、`commit-08-b` 偏大,因此要求同 boundary 内按子批次先写后验;单个 struct / trait / helper 不单独成 boundary。 |
| 每个 boundary 开工前需要复核什么? | 必须复核字段来源、DTO 构造、状态闭环、ref identity、validation truth、expected version、idempotency、outbox source、projection / stale source、artifact materialization 和 phase boundary。 |
| 经验复核由谁完成? | 由设计者在移交实现前完成。实现 agent 只做 baseline 二次校验和 blocker 回报,不能自行补 schema、port、状态、mapper、gate 或 evidence 口径。 |
| 是否要在 Step 6 就定义 implementation ledgers? | 要。Step 6 固定项目级 `implementation_execution_ledger.md`、全部 `implementation-boundaries/<boundary>.md` 路径和 gate matrix;Step 13 必须按本表预创建全部 planned skeleton。 |
| 当前是否允许把 boundary 设计责任留给实现 agent? | 不允许。future boundary 缺 ledger skeleton、required_reads、allowed_scope、required_checks 或 gate definition,都属于设计未完成。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 5 | 只有 phase 顺序,没有 commit boundary | 实现 agent 无法按门禁推进,实现 ledger 也无法预创建 | 本 Step 固定 `commit-01-a` 到 `commit-08-b` |
| `03-详细设计.md` | 设计面多而细,若直接交给实现容易跨 phase 混写 | 容易把 query、event、job、evidence 混成一笔大提交 | 以五个核心能力和外围 seam 为主轴拆 boundary |
| `05-测试方案.md` | suite 数量多,跨 contracts/domain/service/worker/jobs/release | 容易最后集中补测 | 本 Step 逐 boundary 绑定 required checks |
| `06-验收标准.md` | `AC-ART-*` / `VETO-ART-*` 是裁决门禁,不是代码对象 | 容易在最后才发现 boundary 越界或证据不闭合 | 本 Step 把 acceptance redline 前置到 phase / boundary 粒度 |
| implementation ledger | 还没有 boundary gate matrix | Step 13 无法预创建全部 planned skeleton | 本 Step 直接固定 ledger 路径、required_reads、allowed_scope、Commit Gate、Handoff Gate |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施拆分粒度 | 只有 phase,没有 boundary | 形成 20 个 commit boundary | 让实现推进、review 和回退都有稳定单位 |
| required_reads | 只有 Step 3 phase 级阅读矩阵 | 下钻到 boundary 级 required reads | 避免实现 agent 全量扫 `design-calibration` |
| gate 定义 | 只有阶段门禁 | 增加 required checks、Commit Gate、Handoff Gate | 支持 implementation ledger 预创建 |
| 经验复核 | 可能留给实现现场发现 | 设计者逐 boundary 预复核 | 降低实现期反复回设计的概率 |
| future boundary skeleton | 还没有明确定义列表 | 全部 future boundary 在 Step 13 必须预创建为 planned | 避免每推进一段就回设计侧补文件 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 phase 一笔提交 | 简单 | PH-03~PH-08 过大,无法独立 review / rollback | 不采用 |
| 每个对象或每个 trait 一笔提交 | diff 小 | 失去业务可验证增量 | 不采用 |
| 按 capability family 和可验证增量拆 boundary | 能同时承接测试、验收和门禁 | 文档更长 | 采用 |
| 把 `PublishPendingArtifactRelays` 并入 public jobs | 表格更短 | 违背 worker-only internal facade 口径 | 不采用 |
| 把 implementation-boundaries 留给实现 agent 现场补 | 设计阶段省事 | 违反 planned skeleton 预创建规则 | 不采用 |

## 7. 结构化中间产物

### 7.1 通用开工前设计闭环复核

| 复核项 | 适用条件 | 检查内容 | 失败处理 |
|---|---|---|---|
| 字段闭环 | 当前 boundary 新增或修改 truth / support / record object | 必填字段、reason、timestamp、actor、version、ref 来源、状态条件字段均有正式来源 | 暂停并回写 `03/04/05/06/07` |
| DTO 构造闭环 | 当前 boundary 新增 command / query / consumer / event / job / report DTO | request / event / job / report 能 1:1 构造目标 service input 或 output | 暂停并补 protocol / flow |
| 状态闭环 | 当前 boundary 涉及状态迁移 | 正式 enum variant、合法/非法迁移、terminal guard 和 history retain 规则闭合 | 暂停并补 state matrix |
| Query / view 闭环 | 当前 boundary 新增 query / page / view / marker | hit、missing、empty、not-visible、degraded、stale、freshness surface 有正式来源 | 暂停并补 query/view schema |
| Projection / stale 闭环 | 当前 boundary 写 projection invalidation、rebuild、read model lookup | affected identity、stale marker、rebuild source、lookup helper、去重/分页规则闭合 | 暂停并补 projection source |
| Ref identity / scope 闭环 | 当前 boundary 解析外部 ref、selector、scope、trace target | ref kind、scope resolver、error mapping、safe summary 或 marker 来源已定义 | 暂停并补 ref / resolver |
| Validation truth 闭环 | 当前 boundary 有 policy guard、availability、topic map、capability check | guard 所依赖的 truth、snapshot、summary、config source 已正式闭合 | 暂停并补 guard source |
| optimistic version 闭环 | 当前 boundary 更新已有 truth / marker / record | `expected_version` 来源于 request、loaded version 或 prior create result | 暂停并补 version 读取面 |
| idempotency / stored result 闭环 | 当前 boundary 有 command / consumer / job duplicate replay | key、digest、stored result ref、receipt / report source 和 UoW 顺序闭合 | 暂停并补幂等契约 |
| history / trace / audit 构造闭环 | 当前 boundary append history、trace、audit、handoff record | record id、subject、kind、time、actor、payload source 有来源 | 暂停并补 record factory |
| outbox source identity 闭环 | 当前 boundary append outbound event 或 publish relay | event kind、payload snapshot、truth ref、publication marker、retry / failed state 有正式来源 | 暂停并补 outbox / relay schema |
| config binding 闭环 | 当前 boundary 读 config、profile、adapter mode 或 script arg | env key、priority、profile、disabled/degraded/unavailable 映射闭合 | 暂停并回写配置设计 |
| artifact materialization 闭环 | 当前 boundary 生成 artifact / report / summary / handoff bundle | `run_id`、artifact root、report root、digest、redaction、index 来源闭合 | 暂停并补测试/验收口径 |
| phase boundary | 每个 boundary 都适用 | 不引用后续 phase truth、result、report 或未激活 boundary 的 surface | 调整 Step 6 或回写设计 |

### 7.2 提交前通用检查清单

| 检查 | 命令或动作 | 失败处理 |
|---|---|---|
| 工作区复核 | `git status --short` | 排除无关改动;不得把用户未授权文件混入 |
| 格式检查 | `cargo fmt --check` | 修正后重跑 |
| 编译检查 | `cargo check` 或 boundary 指定 package check | 当前 boundary 编译失败不得提交 |
| targeted tests | 按 boundary 的 `required_checks` 运行 | 失败不得提交 |
| 空白检查 | `git diff --check` | 修正 whitespace |
| staged diff 复核 | `git diff --cached` | 只允许当前 boundary 改动 |
| message 复核 | `git commit -F <message-file>` | 对齐 Step 11 的 commit 纪律 |

### 7.3 Boundary 级 required_reads 矩阵

| Commit boundary | required_reads |
|---|---|
| `commit-01-a` | Step 3 前置条件;`03-详细设计.md` §3~§5;`03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md`;目录组织规范 |
| `commit-01-b` | `04-配置设计.md` §6~§10;`05-测试方案.md` §9 / §13;`06-验收标准.md` §3 / §10;`04_config_step_06_environment_profiles_matrix.md`;`05_test_plan_step_09_automation_gates.md` |
| `commit-02-a` | `03-详细设计.md` §5~§10;`03_ddd_step_05_module_contracts.md`;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` contracts/domain 切口 |
| `commit-02-b` | `commit-02-a` 全部必读 + `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`06-验收标准.md` `AC-ART-021~026` |
| `commit-03-a` | `03-详细设计.md` version 相关正式章节;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` state / contract 切口 |
| `commit-03-b` | `03-详细设计.md` lineage 相关正式章节;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` lineage / impact 切口 |
| `commit-03-c` | `commit-03-a` + `commit-03-b` 全部必读 + `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`06-验收标准.md` `AC-ART-023`;`AC-ART-038` |
| `commit-04-a` | `03-详细设计.md` baseline 相关正式章节;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` baseline / state 切口 |
| `commit-04-b` | `commit-04-a` 全部必读 + `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`06-验收标准.md` `AC-ART-023`;`AC-ART-033~034` |
| `commit-05-a` | `03-详细设计.md` query / view / projection 正式章节;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` query / view 切口;`06-验收标准.md` `AC-ART-024`;`AC-ART-027` |
| `commit-05-b` | `commit-05-a` 全部必读 + `03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05-测试方案.md` `application_query_no_write`;projection 切口 |
| `commit-05-c` | `commit-05-a` + `commit-05-b` 全部必读 + `03_ddd_step_15_observability_audit.md`;`05-测试方案.md` trace/report read 与 projection maintenance 切口;`06-验收标准.md` `AC-ART-037` |
| `commit-06-a` | `03-详细设计.md` consumer / event / receipt / outbox public contract 正式章节;`03_ddd_step_08_protocol_contracts.md`;`05-测试方案.md` consumer/event contracts 切口;`06-验收标准.md` `AC-ART-028~029` |
| `commit-06-b` | `commit-06-a` 全部必读 + `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` |
| `commit-06-c` | `commit-06-a` + `commit-06-b` 全部必读 + `04-配置设计.md` topic / adapter mode 章节;`05-测试方案.md` relay / outbox / worker 切口;`06-验收标准.md` `AC-ART-029`;`AC-ART-041` |
| `commit-07-a` | `03-详细设计.md` public job / report / handoff marker 正式章节;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05-测试方案.md` job contracts 切口 |
| `commit-07-b` | `commit-07-a` 全部必读 + `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_15_observability_audit.md`;`06-验收标准.md` `AC-ART-030`;`AC-ART-036`;`AC-ART-038~040` |
| `commit-07-c` | `commit-07-a` + `commit-07-b` 全部必读 + `04-配置设计.md` handoff/export adapter 章节;`05-测试方案.md` handoff/export / redaction 切口;`06-验收标准.md` `AC-ART-032`;`AC-ART-040` |
| `commit-08-a` | `04-配置设计.md` runtime / script args 章节;`05-测试方案.md` §9 / §13 automation/evidence;`06-验收标准.md` `AC-ART-050~055`;`VETO-ART-006~008` |
| `commit-08-b` | `commit-08-a` 全部必读 + `05-测试方案.md` release-main-smoke;`06-验收标准.md` `AC-ART-056~058`;`VETO-ART-001~009`;final decision / risk acceptance 章节 |

### 7.4 阶段任务拆分总表

| Phase | 阶段目标 | 主要任务 | Commit boundaries | 阶段输出 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 建立目标实现仓、workspace、命名、唯一 compile-time dependency、config/profile、script/evidence roots | 仓骨架、crate skeleton、config shell、gate/report/check script shell、artifact/report roots | `commit-01-a`;`commit-01-b` | 可编译 workspace 和基础运行/证据壳 | `cargo check`;config parse smoke;scripts dry-run;dependency boundary |
| PH-02 | 建立 Artifact fact accepted 最小纵切 | fact / intake / review / responsibility command contracts、domain truth、accepted write path、repo fake、api handler | `commit-02-a`;`commit-02-b` | formal fact truth + accepted command flow | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake`;`AC-ART-021~026` |
| PH-03 | 建立 version / lineage truth | version contracts/domain、lineage contracts/domain、history retain、impact relation、service orchestration | `commit-03-a`;`commit-03-b`;`commit-03-c` | formal version / lineage truth 和 replay / conflict guard | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake`;`AC-ART-023`;`AC-ART-038` |
| PH-04 | 建立 baseline freeze truth | baseline candidate / freeze / supersede / history audit contracts、domain、services | `commit-04-a`;`commit-04-b` | baseline truth 和 formal-member-only guards | `contract-domain-fast`;`service-flow-fast`;`AC-ART-023`;`AC-ART-033~034` |
| PH-05 | 建立 consumable / read-only surface | query/view/projection identities、13 Query、read no-write、consumption backref、trace/report read | `commit-05-a`;`commit-05-b`;`commit-05-c` | read-only query and projection surface | `service-flow-fast` query slice;projection tests;`AC-ART-024`;`AC-ART-027`;`AC-ART-037` |
| PH-06 | 建立 inbound / outbound event seam 与 relay publication | 6 Consumer、receipts/local snapshots、8 Outbound Event、outbox snapshot、relay publication loop、topic map | `commit-06-a`;`commit-06-b`;`commit-06-c` | consumer/event/relay seam | `entry-worker-job`;`operations-replay-core`;`redaction-boundary`;`AC-ART-028~029`;`AC-ART-041` |
| PH-07 | 建立 public jobs / reconciliation / handoff / export | 6 public jobs、report replay、rebuild/refresh/reconcile、handoff/export、no-truth-repair | `commit-07-a`;`commit-07-b`;`commit-07-c` | public maintenance and external delivery seam | `entry-worker-job`;`operations-replay-core`;`redaction-boundary`;`AC-ART-030`;`AC-ART-036`;`AC-ART-038~040` |
| PH-08 | 建立 release gate / final reports / acceptance handoff | gate scripts、evidence index、release smoke、veto checklist、risk/open issues、acceptance handoff | `commit-08-a`;`commit-08-b` | 可审计的 final evidence pack | `release-main-smoke`;`report-generation-audit`;`dependency-boundary`;`redaction-boundary`;`AC-ART-050~058`;`VETO-ART-001~009` |

### 7.5 代码实现批次与编写顺序表

| 批次编号 | 顺序 | 目标 | 输出 | 预计规模 | 验证门禁 | 所属 boundary |
|---|---:|---|---|---|---|---|
| BATCH-01-01 | 1 | workspace / crate skeleton / naming / dependency baseline | root `Cargo.toml`、seven crates skeleton、package/lib/bin names | 100~300 行 | `cargo check`;dependency boundary check | `commit-01-a` |
| BATCH-01-02 | 2 | config profile shell + runtime config stub + scripts/roots | config fixtures、runtime builder shell、`scripts/gates|reports|checks|dev`、artifact/report roots | 100~300 行 | config parse smoke;scripts dry-run | `commit-01-b` |
| BATCH-02-01 | 3 | fact/intake/review/responsibility public contracts + domain truth | refs、command/result DTO、domain objects、state tests、fixtures | 200~400 行 | `contract-domain-fast` fact slice | `commit-02-a` |
| BATCH-02-02 | 4 | accepted fact command flow | application ports/UoW/idempotency、repo fake、api handlers、service tests | 200~400 行 | `service-flow-fast` fact slice;`infra-runtime-fake` | `commit-02-b` |
| BATCH-03-01 | 5 | version contracts + domain state/history | version refs/DTO/domain/state tests | 200~400 行 | `contract-domain-fast` version slice | `commit-03-a` |
| BATCH-03-02 | 6 | lineage contracts + domain relation/impact state | lineage refs/DTO/domain/state tests | 200~400 行 | `contract-domain-fast` lineage slice | `commit-03-b` |
| BATCH-03-03 | 7 | version + lineage services/runtime | repos、services、handlers、history retain、conflict / replay tests | 300~500 行 | `service-flow-fast` version/lineage;`infra-runtime-fake` | `commit-03-c` |
| BATCH-04-01 | 8 | baseline contracts + domain candidate/freeze/supersede/history | baseline DTO/domain/state tests | 200~400 行 | `contract-domain-fast` baseline slice | `commit-04-a` |
| BATCH-04-02 | 9 | baseline services/runtime/audit | repos、services、handlers、history audit tests | 300~500 行 | `service-flow-fast` baseline slice | `commit-04-b` |
| BATCH-05-01 | 10 | query/view/projection public contracts | 13 Query DTO、view DTO、page/marker/freshness/read identities | 300~500 行 | query contract tests | `commit-05-a` |
| BATCH-05-02 | 11 | core query services | query ports、projection repositories、visibility/degraded/freshness/no-write tests | 300~500 行 | `service-flow-fast` query slice | `commit-05-b` |
| BATCH-05-03 | 12 | trace/report/history/backref query + API query entry | remaining query handlers、response mapping、projection maintenance seam | 200~400 行 | API query tests;projection targeted | `commit-05-c` |
| BATCH-06-01 | 13 | inbound consumer/event public carriers | consumer envelope/receipt/dead-letter DTO、fixtures、worker input shells | 200~400 行 | consumer contract tests | `commit-06-a` |
| BATCH-06-02 | 14 | consumer services + snapshots/receipts/stale markers | application consumer services、local snapshot store、receipt store、worker entry | 300~500 行 | `entry-worker-job` consumer slice | `commit-06-b` |
| BATCH-06-03 | 15 | outbound event snapshot + relay publication loop | outbound event DTO、outbox snapshot record、payload builders、publisher fake、relay worker loop | 300~500 行 | `operations-replay-core` relay slice;topic map check | `commit-06-c` |
| BATCH-07-01 | 16 | public jobs shared schema/report/result carriers | job DTO、job receipt/report/result store surface、handoff/export markers | 200~400 行 | job contract tests | `commit-07-a` |
| BATCH-07-02 | 17 | maintenance/rebuild/reconcile jobs | projection rebuild、reference refresh、reconciliation、report replay services/runtime | 300~500 行 | `operations-replay-core` jobs slice | `commit-07-b` |
| BATCH-07-03 | 18 | handoff/export jobs and entry | handoff/export service、fake adapters、jobs crate runner、partial failure/report output | 300~500 行 | handoff/export tests;`entry-worker-job`;redaction targeted | `commit-07-c` |
| BATCH-08-01 | 19 | gate/check/report generator shell | gate scripts、dependency/redaction/report audit、evidence index generator shell | 200~400 行 | report-generation dry-run;dependency check | `commit-08-a` |
| BATCH-08-02 | 20 | release smoke and final acceptance pack | `release-main-smoke`、veto checklist、risk/open issues、acceptance handoff bundle | 300~500 行 | `release-main-smoke`;report-generation-audit;VETO audit | `commit-08-b` |

### 7.6 Boundary Gate Matrix

| Commit boundary | ledger file | allowed_scope | forbidden_scope | required_checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-01-a` | `projects/L1-artifact/design-calibration/implementation-boundaries/commit-01-a.md` | workspace root、crate manifests、stub libs/bins | config profiles、scripts、任何业务 DTO/domain/service | `cargo fmt --check`;`cargo check`;dependency boundary;`git diff --check` | staged diff 只含 workspace / naming / dependency baseline | 记录 commit hash、验证命令和 `commit-01-b` 为 next boundary |
| `commit-01-b` | `.../commit-01-b.md` | `config/`;`scripts/`;artifact/report roots;runtime config shell | 业务 truth、query/event/job、final evidence 结论 | config parse smoke;scripts dry-run;`cargo check`;`git diff --check` | staged diff 只含 config / scripts / roots | 记录 commit hash、script shell 验证和 PH-02 开工前 blocker 状态 |
| `commit-02-a` | `.../commit-02-a.md` | `crates/contracts`;`crates/domain`;`tests/contract`;`tests/domain` fact/intake/review slice | application、infra fake、api handler、query/event/job | `contract-domain-fast` fact slice;`cargo check`;`git diff --check` | staged diff 只含 public contracts + domain truth | 记录 commit hash、fact slice evidence、`commit-02-b` 激活条件 |
| `commit-02-b` | `.../commit-02-b.md` | `crates/application`;`crates/infra`;`crates/api`;`tests/service`;`tests/integration` fact slice | version/lineage/baseline、query/event/job | `service-flow-fast` fact slice;`infra-runtime-fake`;`cargo check`;`git diff --check` | accepted flow、idempotency、stored result、repo fake 全通过 | 记录 commit hash、service evidence 和 PH-03 activation |
| `commit-03-a` | `.../commit-03-a.md` | version contracts/domain/tests | lineage service、baseline、query/event/job | `contract-domain-fast` version slice;`cargo check`;`git diff --check` | staged diff 只含 version public/domain slice | 记录 commit hash 和 `commit-03-b` 激活 |
| `commit-03-b` | `.../commit-03-b.md` | lineage contracts/domain/tests | version service、baseline、query/event/job | `contract-domain-fast` lineage slice;`cargo check`;`git diff --check` | staged diff 只含 lineage public/domain slice | 记录 commit hash 和 `commit-03-c` 激活 |
| `commit-03-c` | `.../commit-03-c.md` | version+lineage application/infra/api/tests | baseline、query/event/job、release scripts | `service-flow-fast` version/lineage;`infra-runtime-fake`;`cargo check`;`git diff --check` | conflict / replay / history retain 全通过 | 记录 commit hash、evidence 路径和 PH-04 activation |
| `commit-04-a` | `.../commit-04-a.md` | baseline contracts/domain/tests | query/event/job、release scripts | `contract-domain-fast` baseline slice;`cargo check`;`git diff --check` | staged diff 只含 baseline public/domain slice | 记录 commit hash 和 `commit-04-b` 激活 |
| `commit-04-b` | `.../commit-04-b.md` | baseline application/infra/api/tests | query/event/job、release scripts | `service-flow-fast` baseline slice;`cargo check`;`git diff --check` | freeze/supersede/history audit 全通过 | 记录 commit hash、baseline evidence 和 PH-05 activation |
| `commit-05-a` | `.../commit-05-a.md` | query/view/projection contracts、query fixtures、read model identities | consumer/event/job、publisher、report generators | query contract tests;`cargo check`;`git diff --check` | staged diff 只含 read contracts / markers / identities | 记录 commit hash 和 `commit-05-b` 激活 |
| `commit-05-b` | `.../commit-05-b.md` | query services、projection repos、visibility/freshness/degraded tests | consumer/event/job、report generators | `service-flow-fast` query slice;projection tests;`cargo check`;`git diff --check` | no-write、visibility、degraded、stale surface 全通过 | 记录 commit hash、query evidence 和 `commit-05-c` 激活 |
| `commit-05-c` | `.../commit-05-c.md` | remaining query handlers、trace/report/history/backref reads、projection maintenance seam | consumer/event/job、publisher、release scripts | API query tests;projection targeted;`cargo check`;`git diff --check` | API entry 不越权、backref/report read 成立 | 记录 commit hash、query/report evidence 和 PH-06 activation |
| `commit-06-a` | `.../commit-06-a.md` | consumer/event contracts、receipts、fixtures、worker input shells | consumer services、publisher、public jobs | consumer contract tests;`cargo check`;`git diff --check` | staged diff 只含 inbound public carriers | 记录 commit hash 和 `commit-06-b` 激活 |
| `commit-06-b` | `.../commit-06-b.md` | consumer application/infra/worker slice、snapshots/receipts/stale markers | outbound relay/public jobs/release scripts | `entry-worker-job` consumer slice;`cargo check`;`git diff --check` | duplicate / unsupported / delayed / stale marker paths全通过 | 记录 commit hash、consumer evidence 和 `commit-06-c` 激活 |
| `commit-06-c` | `.../commit-06-c.md` | outbound event DTO、outbox snapshot、payload builders、publisher fake、relay loop | public jobs、release scripts | `operations-replay-core` relay slice;topic map check;redaction targeted;`cargo check`;`git diff --check` | publish path只读 stored snapshot、truth unchanged、relay not counted as public job | 记录 commit hash、relay/outbox evidence 和 PH-07 activation |
| `commit-07-a` | `.../commit-07-a.md` | job contracts、job report/result carriers、handoff/export markers | concrete job service、release scripts | job contract tests;`cargo check`;`git diff --check` | staged diff 只含 public job shared surface | 记录 commit hash 和 `commit-07-b` 激活 |
| `commit-07-b` | `.../commit-07-b.md` | maintenance/rebuild/reconcile job services/runtime/tests | handoff/export adapters、release scripts | `operations-replay-core` jobs slice;`cargo check`;`git diff --check` | no-truth-repair、report replay、partial failure 全通过 | 记录 commit hash、jobs evidence 和 `commit-07-c` 激活 |
| `commit-07-c` | `.../commit-07-c.md` | handoff/export services、fake adapters、jobs entry/runtime、artifact/report output | release scripts / final acceptance material | handoff/export tests;`entry-worker-job`;redaction targeted;`cargo check`;`git diff --check` | handoff/export partial failure 与 redaction 闭合 | 记录 commit hash、handoff/export evidence 和 PH-08 activation |
| `commit-08-a` | `.../commit-08-a.md` | gate/check/report generator scripts、evidence index shell | 新业务功能、手工 passed 结论 | release gate dry-run;dependency-boundary;report-generation dry-run;`git diff --check` | staged diff 只含 scripts / report shell / no-static-evidence checks | 记录 commit hash 和 `commit-08-b` 激活 |
| `commit-08-b` | `.../commit-08-b.md` | release smoke、final reports、veto/risk/open issues、acceptance handoff bundle | 任何新业务功能或真实 production binding | `release-main-smoke`;report-generation-audit;dependency-boundary;redaction-boundary;VETO audit;`git diff --check` | final evidence 全由真实 artifact/report 推导 | 记录 commit hash、全部 suite/report 路径、handoff summary 和 next action `done` |

### 7.7 Commit boundary 子功能分组表

| Commit boundary | 子功能分组 | 必须同提交的原因 | 不包含 |
|---|---|---|---|
| `commit-01-a` | workspace skeleton + naming + only-core dependency | 这三者共同定义后续所有 crate 的稳定落点 | config/scripts/业务代码 |
| `commit-01-b` | config shell + script shell + artifact/report roots | 三者共同构成后续所有 gate / report 的前置基础 | 业务 flow、真实 evidence 结论 |
| `commit-02-a` | fact/intake/review/responsibility contracts + domain truth + state tests | 它们共同形成 Artifact fact truth 的最小 formal contract | application/infra/api/query/event/job |
| `commit-02-b` | accepted fact command service + UoW/idempotency + repo fake + api handler | 同一 accepted write flow 必须一起验证 | version/lineage/baseline/read/event/job |
| `commit-03-a` | version contracts + version domain/history | formal version truth 需要 public contract 与 domain state 同时闭合 | lineage/application/baseline |
| `commit-03-b` | lineage contracts + lineage relation/impact domain | lineage truth 需要 relation/refusal/impact surface 同时闭合 | version service/baseline |
| `commit-03-c` | version/lineage services + runtime fake + handlers | replay/conflict/history retain 必须在同一写路径中验证 | baseline/read/event/job |
| `commit-04-a` | baseline contracts + candidate/freeze/supersede/history domain | baseline truth 先独立成立,再允许 service 落码 | query/event/job |
| `commit-04-b` | baseline services + runtime fake + audit tests | baseline freeze 的 accepted flow 需要 repo/version/history 一起验证 | read/event/job/release scripts |
| `commit-05-a` | query request/response/view contracts + projection identities | read surface 先固定 public protocol,避免 service 私补 DTO | consumer/event/job |
| `commit-05-b` | core query services + visibility/degraded/freshness/no-write | 13 Query 的核心执行语义和 no-write 必须一起验证 | consumer/event/job/release scripts |
| `commit-05-c` | trace/report/history/backref query + API query entry | 剩余 read surface 和 API entry 一起闭合,防止 entry 越权 | consumer/event/job/publisher |
| `commit-06-a` | consumer envelopes/receipts + worker input shell | external inbound seam 必须先有稳定 public carrier | consumer services/publisher/jobs |
| `commit-06-b` | consumer services + local snapshot/receipt/stale markers + worker entry | consumer accepted / duplicate / delayed 语义必须一起验证 | outbound relay/public jobs |
| `commit-06-c` | outbound event snapshot + payload builders + publisher fake + relay worker loop | outbox append 和 relay publish 必须共用 stored snapshot 语义 | public jobs/final reports |
| `commit-07-a` | public job schema + result/report/replay carriers | 6 public jobs 的 shared surface 先固定,避免各 job 私自扩 shape | concrete job service/release scripts |
| `commit-07-b` | rebuild/refresh/reconcile/report replay services | 这些 jobs 共享 maintenance + replay + no-truth-repair 语义 | handoff/export/final reports |
| `commit-07-c` | handoff/export service + jobs entry + artifact/report output | external delivery seam 需要 partial failure、redaction、entry/runtime 一起验证 | release final verdict |
| `commit-08-a` | gate/check/report shell + evidence index shell | final evidence 依赖稳定脚本和 path 口径,但还不生成 final verdict | business logic/final smoke |
| `commit-08-b` | release smoke + final reports + veto/risk + acceptance handoff | final acceptance material 必须由真实 suite outputs 同步生成 | 新业务功能、真实 production binding |

### 7.8 Commit boundary 经验复核表

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 |
|---|---|---|---|---|---|
| `commit-01-a` | workspace / path / dependency | path baseline;phase boundary | DTO/state/outbox/query/job/evidence 不适用 | Step 3;`03` file layout | 开工前复核 |
| `commit-01-b` | config / scripts / artifact roots | config binding;artifact materialization;phase boundary | truth/object/idempotency 不适用 | `04`;`05` §9/§13;`06` §10 | 开工前复核 |
| `commit-02-a` | command contracts / domain truth / state | 字段闭环;DTO 构造闭环;状态闭环;ref identity;phase boundary | query/event/job/persistence fake 不适用 | `03` Step 6/8/10 | 开工前复核 |
| `commit-02-b` | command flow / UoW / idempotency / repo fake | validation truth;optimistic version;idempotency;history/trace/audit;outbox source identity | query/job 不适用 | `03` Step 7/9/11/13 | 开工前复核 |
| `commit-03-a` | version contracts / domain state | 字段闭环;DTO 构造闭环;状态闭环;history retain source;phase boundary | service/query/event/job 不适用 | `03` Step 6/8/10 | 开工前复核 |
| `commit-03-b` | lineage contracts / relation state | 字段闭环;DTO 构造闭环;状态闭环;ref-scope/source identity | service/query/event/job 不适用 | `03` Step 6/8/10 | 开工前复核 |
| `commit-03-c` | version/lineage service / persistence / replay | optimistic version;idempotency;history/trace/audit;validation truth;phase boundary | query/event/job 不适用 | `03` Step 7/9/11/13 | 开工前复核 |
| `commit-04-a` | baseline contracts / freeze state | 字段闭环;DTO 构造闭环;状态闭环;formal-member validation truth | query/event/job 不适用 | `03` Step 6/8/10 | 开工前复核 |
| `commit-04-b` | baseline service / history audit / runtime | optimistic version;history/trace/audit;idempotency;validation truth | query/event/job 不适用 | `03` Step 7/9/11/13 | 开工前复核 |
| `commit-05-a` | query/view/page/freshness contracts | Query response 闭环;DTO 构造闭环;ref identity;phase boundary | persistence write/idempotency 不适用 | `03` Step 7/8/10 | 开工前复核 |
| `commit-05-b` | query service / projection read / visibility | Query response 闭环;projection stale 闭环;ref-scope 解析;validation truth;phase boundary | outbox/job 不适用 | `03` Step 7/9/11 | 开工前复核 |
| `commit-05-c` | API query entry / trace/report/backref reads | Query response 闭环;artifact materialization for report reads;phase boundary | truth write/idempotency 不适用 | `03` Step 8/9/15 | 开工前复核 |
| `commit-06-a` | inbound carriers / receipts | DTO 构造闭环;ref identity;public target 穷尽;phase boundary | persistence write/publisher/public job 不适用 | `03` Step 8/12/13 | 开工前复核 |
| `commit-06-b` | consumer flow / snapshots / receipts / stale | ref-scope 解析;projection stale 闭环;idempotency;optimistic version;validation truth | outbound publish/public job 不适用 | `03` Step 7/9/11/13 | 开工前复核 |
| `commit-06-c` | outbound payload / outbox / relay publish | outbox source identity;history/trace/audit;config binding;idempotency;phase boundary | public job shared report 不适用 | `03` Step 7/8/9/11/13;`04` | 开工前复核 |
| `commit-07-a` | public job schema / stored report result | public job surface阶段闭环;idempotency;artifact materialization;phase boundary | concrete job scope parsing 不适用 | `03` Step 8/13;`05` | 开工前复核 |
| `commit-07-b` | maintenance/replay/reconcile job services | projection stale/rebuild;ref-scope 解析;job policy executable summary;optimistic version;artifact materialization | handoff/export 不适用 | `03` Step 7/9/11/15;`05/06` | 开工前复核 |
| `commit-07-c` | handoff/export services + jobs entry | artifact materialization;ref-scope 解析;public target 穷尽;redaction;job report failed refs | projection rebuild 不适用 | `03` Step 7/8/9;`04`;`05/06` | 开工前复核 |
| `commit-08-a` | gates / checks / report shell | artifact materialization;path baseline;phase boundary | business DTO/state/outbox 不适用 | `05` §9/§13;`06` §10/§11 | 开工前复核 |
| `commit-08-b` | release smoke / final reports / handoff | artifact materialization;evidence source 闭环;VETO 证据闭环;release smoke 闭环;phase boundary | production adapter 不适用 | `05` release gates;`06` final signoff | 开工前复核 |

### 7.9 提交粒度判断表

| Commit boundary | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| `commit-01-a` | 适中 | 是 | 是 | 保留 |
| `commit-01-b` | 适中 | 是 | 是 | 保留 |
| `commit-02-a` | 适中 | 是 | 是 | 保留 |
| `commit-02-b` | 适中 | 是 | 是 | 保留 |
| `commit-03-a` | 适中 | 是 | 是 | 保留 |
| `commit-03-b` | 适中 | 是 | 是 | 保留 |
| `commit-03-c` | 适中 | 是 | 是 | 若 service 超过 500 行,按 version/lineage family 分批写但同 boundary 提交 |
| `commit-04-a` | 适中 | 是 | 是 | 保留 |
| `commit-04-b` | 适中 | 是 | 是 | 保留 |
| `commit-05-a` | 偏大但合理 | 是 | 是 | DTO 按 query family 分批写,同 boundary 提交 |
| `commit-05-b` | 偏大但合理 | 是 | 是 | service 按 query family 分批写,同 boundary 提交 |
| `commit-05-c` | 适中 | 是 | 是 | 保留 |
| `commit-06-a` | 适中 | 是 | 是 | 保留 |
| `commit-06-b` | 偏大但合理 | 是 | 是 | consumer family 分批写,同 boundary 提交 |
| `commit-06-c` | 偏大但合理 | 是 | 是 | outbound payload / relay loop 分批写,同 boundary 提交 |
| `commit-07-a` | 适中 | 是 | 是 | 保留 |
| `commit-07-b` | 偏大但合理 | 是 | 是 | 按 job family 分批写,同 boundary 提交 |
| `commit-07-c` | 适中 | 是 | 是 | 保留 |
| `commit-08-a` | 适中 | 是 | 是 | 保留 |
| `commit-08-b` | 偏大但合理 | 是 | 是 | report generator 按产物分批写,同 boundary 提交 |

### 7.10 Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `commit-01-a` | 是否只建立 workspace / naming / dependency baseline | 通过 | 目标实现仓不存在仍是 PH-01 开工 blocker |
| `commit-01-b` | 是否只建立 config / script / root shell 而不伪造 evidence | 通过 | 不得生成静态 passed 报告 |
| `commit-02-a` | fact truth 是否先于 version / lineage / baseline / query 成立 | 通过 | actor/metadata/idempotency 仍由 `commit-02-b` 承接写路径 |
| `commit-02-b` | accepted fact flow 是否闭合 UoW/idempotency/stored result | 通过 | 不得提前实现 query/event/job |
| `commit-03-a` | version truth 是否可独立验证 | 通过 | lineage / service 后置到 `03-b/03-c` |
| `commit-03-b` | lineage relation 是否不依赖 baseline / query | 通过 | impact read surface 仍留到 PH-05 |
| `commit-03-c` | version/lineage service 是否不依赖后续 read/event/job | 通过 | replay/conflict 需走正式 persistence surface |
| `commit-04-a` | baseline truth 是否只依赖 formal version | 通过 | baseline read surface 后置到 PH-05 |
| `commit-04-b` | baseline accepted flow 是否不触及 query/event/job | 通过 | history audit 只作为 truth write side effect |
| `commit-05-a` | query public DTO 是否字段级闭合 | 通过 | 判定逻辑仍后置到 `05-b` |
| `commit-05-b` | query service 是否 strict no-write | 通过 | projection repair / rebuild 不能在 query path 内发生 |
| `commit-05-c` | API query entry 是否只调 application | 通过 | entry 不得直接依赖 repo 或 domain truth write |
| `commit-06-a` | inbound carrier 是否不混入 service/publisher 语义 | 通过 | service 仍后置到 `06-b` |
| `commit-06-b` | consumer accepted path 是否闭合 receipt/snapshot/stale marker | 通过 | core truth create/update 不能由 consumer 直接执行 |
| `commit-06-c` | relay publish 是否只从 stored snapshot 发布 | 通过 | `PublishPendingArtifactRelays` 仍不是 public job |
| `commit-07-a` | public job schema 是否与 relay facade 分离 | 通过 | relay 已在 PH-06 完成 |
| `commit-07-b` | maintenance jobs 是否保持 no-truth-repair | 通过 | 任何 truth repair 需回写设计,不能落码 |
| `commit-07-c` | handoff/export 是否只输出 marker/report 而不接管外部 truth | 通过 | external target 不可成为 compile-time dependency |
| `commit-08-a` | gate/report shell 是否不伪造 final verdict | 通过 | 仅生成 shell 和 source-bound reports |
| `commit-08-b` | final acceptance material 是否全由真实 artifacts 推导 | 通过 | 仍不得生成真实 signoff 结论或 production claim |

### 7.11 实施台账与 planned boundary 预创建规则

| 项 | 路径或规则 | 本 Step 结论 |
|---|---|---|
| 项目级 implementation ledger | `projects/L1-artifact/design-calibration/implementation_execution_ledger.md` | Step 13 必须创建并在实现移交时激活 `current_boundary = commit-01-a` |
| boundary ledger 根目录 | `projects/L1-artifact/design-calibration/implementation-boundaries/` | Step 13 必须预创建 `commit-01-a.md` 到 `commit-08-b.md` 全部 skeleton |
| 当前 boundary 激活规则 | 只有一个 current boundary | 初始 current 只能是 `commit-01-a`;未来 boundary 一律 `planned / wait_until_current` |
| future boundary 规则 | 预创建但不激活 | future boundary 必须写明 `status = planned`、`next_allowed_action = wait_until_current` |
| 实现继续入口 | `implementation_execution_ledger.md` -> 当前 boundary ledger -> `07-实施计划.md` -> required_reads | 实现 agent 每次继续都必须按此顺序恢复 |
| 设计 blocker 回流 | boundary ledger 标 `blocked / wait_design` | 实现端不能自行补 schema、port、状态、mapper、script、evidence 或 boundary |

### 7.12 跨 boundary 粒度 / 依赖 / 门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否形成从 `commit-01-a` 到 `commit-08-b` 的连续 boundary 链 | 通过 | 共 20 个 boundary,无缺口 |
| 是否存在 future boundary 未定义 ledger file 的情况 | 通过 | 全部 boundary 路径已固定 |
| 是否存在把 `PublishPendingArtifactRelays` 混入 public jobs | 通过 | relay 仅在 PH-06,public jobs 仅在 PH-07 |
| 五个核心能力是否都映射到 boundary | 通过 | fact:PH-02;version+lineage:PH-03;baseline:PH-04;consumable/read:PH-05 |
| 是否存在后续 phase 才能验证当前 boundary 的情况 | 通过 | 当前 boundary 都有独立 required checks |
| 是否存在非 core sibling compile-time dependency 漏洞 | 通过 | 仅 PH-01 允许写 dependency baseline,且只允许 `core-contracts` |
| 是否存在把 release evidence 当成业务实现一部分的 boundary | 通过 | release/report 仅在 PH-08 收口 |
| 是否存在实现 agent 需要现场补 implementation-boundaries 的风险 | 通过 | Step 6 已固定全部 boundary 路径和 gate matrix |
| 是否存在过粗 boundary | 有受控风险 | `commit-05-a`、`commit-05-b`、`commit-06-b`、`commit-06-c`、`commit-07-b`、`commit-08-b` 偏大,必须按批次分写但同 boundary review |
| 是否存在过细 boundary | 无 | 没有把单个 helper / trait / struct 单独成 boundary |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Boundary 级 required_reads 矩阵”“阶段任务拆分总表”“代码实现批次与编写顺序表”“Boundary Gate Matrix”“Commit boundary 子功能分组表”“Commit boundary 经验复核表”和“跨 boundary 粒度 / 依赖 / 门禁审计表”小节,了解本章实现计划如何收敛。

正式 `07-实施计划.md` §6 应回填:

L1-artifact 的 P0 实施按 20 个 commit boundary 推进,从 `commit-01-a` 到 `commit-08-b` 形成连续链。PH-01 建仓和 config/script/report 壳;PH-02 建 fact accepted 最小纵切;PH-03 建 version / lineage;PH-04 建 baseline freeze;PH-05 建 13 Query 和 read-only surface;PH-06 建 6 Consumer、8 Outbound Event 与 worker-only relay publication;PH-07 建 6 public jobs、reconciliation、handoff/export;PH-08 建 release gate、final evidence、veto/risk 和 acceptance handoff。

每个 boundary 都必须预先定义 `required_reads`、`allowed_scope`、`required_checks`、Commit Gate 和 Handoff Gate,并由设计者先完成开工前设计闭环复核与经验复核。实现 agent 不得在实现现场补 schema、port、状态、mapper、evidence 或 implementation-boundaries。正式实现移交前必须按本章 Boundary Gate Matrix 预创建全部 `implementation-boundaries/<boundary>.md` skeleton;初始 current boundary 只能是 `commit-01-a`,未来 boundary 一律保持 `planned / wait_until_current`。

同一 boundary 内允许按批次分写,但 review / rollback / evidence 仍以 boundary 为单位。若发现字段来源、DTO 构造、状态迁移、expected version、idempotency、projection source、outbox snapshot、artifact/report 路径或 phase boundary 未闭合,不得继续写代码,必须先回写设计真相源并固定新 baseline。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `quantalithos-artifact` 目标实现仓当前未发现 | `commit-01-a` 无实际落点 | 作为 PH-01 开工前 blocker 保留,不影响 Step 6 设计完成 |
| `commit-05-a` / `05-b` / `06-b` / `06-c` / `07-b` / `08-b` 偏大 | 影响实现期 review 节奏 | 已要求同 boundary 内分批写入,不再继续拆 boundary |
| Step 7 如何把 suite / AC / VETO 下钻到每个 boundary | 影响测试与验收门禁表 | 下一步在 Step 7 继续细化 |
| Step 13 如何实际预创建全部 planned ledger skeleton | 影响实现移交 | 本 Step 已固定列表,Step 13 负责生成 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| commit boundary 已定义 | 通过 | 已固定 `commit-01-a` 到 `commit-08-b` |
| boundary-level required_reads 已定义 | 通过 | 实现 agent 可按 boundary 精准补读 |
| allowed_scope / required_checks / gates 已定义 | 通过 | implementation ledger 可直接承接 |
| 经验复核和停审记录已定义 | 通过 | 设计者责任已固定 |
| planned boundary 预创建规则已定义 | 通过 | Step 13 可生成全部 skeleton |
| 可进入 Step 7 | 待用户确认 | 下一步收稳测试与验收门禁嵌入 |
