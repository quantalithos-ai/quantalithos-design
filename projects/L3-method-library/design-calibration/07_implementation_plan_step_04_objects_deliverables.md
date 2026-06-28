# Step 4. 抽取实施对象与交付物

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填章节: `07-实施计划.md` §4 实施对象与交付物清单
> 当前模块: `R4.2 objects and deliverables:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 抽取实施对象与交付物 |
| 当前模块 | `R4.2 objects and deliverables:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 2 实施范围;Step 3 前置条件;`03-详细设计.md` §4~§16;`05-测试方案.md`;`06-验收标准.md`;L1-governance Step 4 框架参考 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_04_objects_deliverables.md` |
| 停审方式 | 用户已确认 Step 4,允许进入 Step 5 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | completed_confirmed | 固定 P0 core、peripheral、future 和非范围 |
| Step 3 前置条件 | completed_confirmed | 固定目标仓、正式 workspace layout、dependency、artifact/report 和台账前置 |
| `03-详细设计.md` §4~§16 | 已读取 | 抽取七实现单元、八业务组成、协议数量、flow、state、tx、error、config、observability 和 implementation handoff |
| `05-测试方案.md` | 已读取 | 抽取 suite family、blocking checks、artifact/report、EV-ML 和 regression 交付物 |
| `06-验收标准.md` | 已读取 | 抽取 AC/VETO、evidence index、acceptance handoff、risk acceptance 和 final decision 输入 |
| `projects/L1-governance/design-calibration/07_implementation_plan_step_04_objects_deliverables.md` | framework_reference | 只参考表格和门禁粒度,不复制 governance 领域事实 |

## 3. SOP 问题回答

1. 本轮会新增或修改哪些代码模块。

   回答: 本轮实施对象是目标仓 `/home/aris/Projects/quantalithos-method-library` 的七个正式 workspace member:`crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。现有旧 `crates/method_library_*` member 和 package 命名不作为交付真相,必须作为 PH-01 / 首个 boundary 的迁移或重建对象。

2. 本轮会新增或修改哪些接口、事件、job 或 adapter。

   回答: 必须承接 `03` 的 58 Command、57 Query、4 Inbound Consumer、34 Outbound Event / sender、8 Operations Job,并落到 contracts DTO、application flow / port、infra fake / controlled adapter、api / worker / jobs entry。Step 4 不逐条拆 commit,只确认这些 protocol family 全部属于交付物池;具体顺序由 Step 5 / Step 6 再拆。

3. 本轮会新增哪些测试。

   回答: 必须交付 `contract-domain-fast`、`service-flow-fast`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`config-redline`、`dependency-boundary`、`redaction-boundary`、`observability-boundary`、`report-generation-audit`、`release-main-smoke` 对应的测试 / 检查 / 报告生成入口。`operations-replay-extended` 和 `p1-real-like-selected-run` 只能作为 extended / residual,不得替代 P0 blocking suite。

4. 本轮会产生哪些配置、迁移、种子数据或文档同步。

   回答: 会产生正式 workspace 迁移、config profile fixtures、adapter availability fixtures、deterministic fake clock/id、runtime builder/fake seams、scripts roots、run-scoped artifact/report roots、implementation ledger / boundary ledger 设计产物和 acceptance handoff shell。不会在 Step 4 创建真实 implementation ledger 实例、真实 CI、真实脚本实现、真实 evidence 或最终验收结论。

5. 哪些上游设计对象本轮不交付。

   回答: 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / PostgreSQL / GATE-T / AC-P0 主线不交付。FR-ML-E-001~004 只作为 peripheral / residual / future 有界入口,不得阻塞 P0 core。marketplace 交易履约、UI/console、artifact/archive 正文、governance execution、真实 external provider、production-like capacity 和部署运维 runbook 不属于本轮 P0 交付物。

6. 哪些交付物跨仓或依赖外部模块。

   回答: 编译期跨仓交付物只允许 `quantalithos-core` / `core-contracts` path dependency。`quantalithos-bus`、`quantalithos-process`、`quantalithos-identity`、`L2-runtime`、`L2-member-images`、`quantalithos-sdk`、artifact/archive、observability、marketplace 等只能通过 ref、safe summary、event、adapter、handoff、fake / controlled / disabled seam 交付。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 旧 `07-实施计划.md` | 交付物仍围绕旧 MethodContent / publish / snapshot / outbox | 会把废弃主线反向带入 phase | 不继承,仅作为 old_direction_input |
| 目标实现仓 | 当前 layout 是旧 `crates/method_library_*` | 与正式 `03` §4 的七实现单元冲突 | 作为正式交付物中的 PH-01 migration deliverable |
| `03` protocol / flow | 数量大,直接列全会淹没实施对象 | Step 5/6 难以排序 | Step 4 按 family / surface 聚合,后续再拆 |
| `05/06` evidence | suite、EV、report path 分散 | 容易最后补证据或静态造证据 | Step 4 把测试 / artifact / report 作为一等交付物 |
| implementation ledger | 当前只定义规范,未生成 L3 实例 | 实现 agent 无法合法开工 | Step 4 只列为设计交付物,Step 6 后再定义实例 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施对象 | 分散在 `03` 的 layout、module、protocol、flow、state 中 | 聚合为 code、protocol、flow、adapter、tests、scripts、evidence、ledger 交付物 | 让 Step 5 可按依赖排序 |
| 旧实现仓 | 可能被当成可继续开发基线 | 明确为迁移对象,不是当前 truth | 防止继承旧 package / README / report path |
| 测试证据 | 容易等代码后补 | 作为交付物清单的一部分 | 对齐 `05/06` 的 EV-ML 和 run-scoped 证据 |
| 外部依赖 | 多个 sibling repo 参与语义 | 只允许 core 编译期依赖,其他为 seam | 防止 non-core compile dependency |
| 非交付物 | 只在 Step 2 范围里描述 | 独立列为非交付物 | 防止 peripheral 进入 P0 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 161 个 flow 逐项列交付物 | 最细 | Step 4 过早替代 Step 6 commit boundary,不可维护 | 不采用 |
| 按七实现单元 + protocol family + suite/evidence 聚合 | 可执行,能承接 Step 5/6/7 | 需要后续继续拆分 | 采用 |
| 把旧实现仓 layout 当作交付起点 | 快 | 与正式 `03` 冲突,会恢复旧主线 | 不采用 |
| 把 implementation ledger 现在直接实例化 | 能提前开工 | Step 6 尚未定义 boundary id 和 scope | 不采用;只列为后续设计交付物 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 预计落点 | 完成判定方向 |
|---|---|---|---|---|
| Workspace layout migration | code / structure | `03` §4;Step 3 | `Cargo.toml`;`crates/<role>` | 旧 `crates/method_library_*` 迁移到七正式 member,package/crate 命名通过检查 |
| Public contracts | code | `03` §7~§8 | `crates/contracts/src/*` | typed refs、metadata、Command/Query/Event/Job DTO、views、errors、fixtures 可编译可测 |
| Domain truth and policies | code | `03` §5~§10 | `crates/domain/src/*` | 八业务组成的 truth、state、policy、guard、invariant 测试通过 |
| Application services and ports | code | `03` §7~§13 | `crates/application/src/*` | command/query/consumer/outbound/job service、UoW、idempotency、ports 可测 |
| Infra runtime and adapters | code / config | `03` §10~§14;`04` | `crates/infra/src/*` | repository/material store/fake adapter/runtime builder/config binding 可测 |
| API entry | code | `03` §4 / §7~§8 | `crates/api/src/*` | command/query handler 只调用 application facade |
| Worker entry | code | `03` §7~§13 | `crates/worker/src/*` | inbound consumer、event candidate publisher、background runner 不修 truth |
| Jobs entry | code | `03` §8~§13 | `crates/jobs/src/*` | 8 Operations Job runner、checkpoint、report、duplicate replay 可测 |
| Test suite assets | test | `05` §6 / §9 | `tests/**`;crate unit tests | P0 suite matrix 可执行并产生 raw artifact |
| Gate/report/check scripts | script | `05` §9 / §13;`06` §10 | `scripts/gates`;`scripts/reports`;`scripts/checks`;`scripts/dev` | 能生成 run-scoped report,不使用 `latest` |
| Artifact/report roots | evidence | `05` §13;`06` §3 / §10 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance` | artifact/report pair、evidence index、handoff shell 路径成立 |
| Implementation ledgers | design artifact | 台账规范;Step 3 | `design-calibration/implementation_execution_ledger.md`;`implementation-boundaries/<boundary_id>.md` | Step 6 定义 boundary 后生成,缺失时不得开工 |

### 7.2 Protocol / flow 交付物池

| Family | 数量 | 交付落点 | 验证方向 |
|---|---:|---|---|
| Command | 58 | contracts DTO、application command services、api handlers、domain writes、stored result | accepted/rejected/duplicate/conflict/UoW/side-effect refs |
| Query | 57 | contracts query/view、application query service、api handlers、read resolvers/material stores | no-write、visible/empty/stale/degraded/unavailable、safe surface |
| Inbound Consumer | 4 | contracts consumer envelope、worker runner、application intake、infra source adapter | body-free intake、dedup、stored receipt、unsupported no-parse/no-write |
| Outbound Event / sender | 34 | contracts event candidate/outcome、application publisher flow、worker publisher、infra publisher | candidate vs publisher outcome 分离,不重读 current truth |
| Operations Job | 8 | contracts job input/report、application job service、jobs runner、infra stores | checkpoint/report/partial failure/duplicate replay/no truth repair |

### 7.3 代码交付物清单

| 交付物 | 类型 | 预计落点 | 完成判定方向 |
|---|---|---|---|
| `method-library-contracts` | crate | `crates/contracts` | public surface 完整,无 domain truth 写入 |
| `method-library-domain` | crate | `crates/domain` | state / policy / invariant 覆盖 P0 core |
| `method-library-application` | crate | `crates/application` | service flow、ports、UoW、idempotency、replay surface 成立 |
| `method-library-infra` | crate | `crates/infra` | fake / controlled / disabled adapter、runtime builder、config validation 成立 |
| `method-library-api` | entry crate | `crates/api` | command/query transport-neutral entry 成立 |
| `method-library-worker` | entry crate | `crates/worker` | consumer / publisher runner 成立,不恢复 old outbox relay |
| `method-library-jobs` | entry crate | `crates/jobs` | operations job entry 成立,不修 core truth |
| Workspace support | structure | root `Cargo.toml`;`tests/**` | edition、dependency matrix、test support 和 old layout cleanup 通过 |

### 7.4 测试、证据与报告交付物清单

| 交付物 | 来源 | 预计落点 | 完成判定方向 |
|---|---|---|---|
| Blocking suite matrix | `05` §6 / §9 | tests / scripts | `contract-domain-fast`、`service-flow-fast`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core` 等可执行 |
| Cross-cutting audits | `05` §9;`06` §10~§11 | `scripts/checks`;reports | config、dependency、redaction、observability、report-generation audit 可执行 |
| Raw artifact root | `05` §13;`06` §3 | `artifacts/test/<run_id>` | 每个 blocking suite 有机器 artifact |
| Suite reports | `05` §13;`06` §10 | `reports/runs/<run_id>/suites/<suite>.md` | report 由 raw artifact 推导 |
| Evidence index | `06` §10 | `reports/runs/<run_id>/evidence-index.md` | EV-ML -> TC -> suite -> artifact -> report -> AC/VETO 可追踪 |
| Acceptance handoff | `06` §3 / §14 | `reports/acceptance/handoff.md` | 汇总 baseline、run_id、scope、residual,不填写虚假 pass |
| Risk acceptance | `06` §12~§14 | `reports/acceptance/risk-acceptance.md` | 只记录允许 residual,不得覆盖 VETO / P0 hard gate |

### 7.5 非交付物清单

| 非交付物 | 来源 | 不交付原因 | 后续处理 |
|---|---|---|---|
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox | 旧 `07`;`03` reset | 当前设计已废弃旧主线 | historical material only |
| PostgreSQL / sqlx / concrete DB migration | 旧材料;`03/04` | 当前 product-neutral,不锁产品 | 后续 ADR / adapter boundary |
| Marketplace 交易、安装、履约 | `00/03` 非范围 | 属相邻仓 / peripheral | future / residual |
| UI / console / SDK 深层体验 | `00/03` 非范围 | 不属于方法资产 truth center | future / separate project |
| Artifact/archive 正文生命周期 | `00/03` 非范围 | 本仓只保存 ref / summary / marker | sibling runtime seam |
| Governance execution / Gate enforce | `03` 非范围 | 本仓只承接 safe conclusion / basis ref | L1-governance |
| Real external provider binding | `04/06` | P0 使用 disabled / fake / controlled seam | P1 selected-run |
| Production-like capacity / hard SLO | `06` | 当前只要求 sample/trend | future / operations readiness |
| Final acceptance verdict | `06` | 需要真实 run evidence | 验收执行阶段 |

### 7.6 跨仓 / 外部依赖交付物表

| 交付物 | 依赖对象 | 依赖类型 | 当前交付形态 | 完成判定方向 |
|---|---|---|---|---|
| Core contracts dependency | `quantalithos-core` | compile-time | `core-contracts` path dependency | dependency-boundary 通过 |
| Event collaboration seam | `quantalithos-bus` | runtime / event | event candidate / publisher adapter / fake | 不进入 Cargo compile dependency |
| Process consumption seam | `quantalithos-process` | runtime / ref | consumption context ref / safe summary / fake | 下游 truth 不入仓 |
| Identity actor seam | `quantalithos-identity` | runtime / actor | actor / role safe ref / adapter fake | member lifecycle 不入仓 |
| Runtime/member image seam | runtime / member-images | runtime / adapter | availability / degraded / unavailable marker | downstream-not-ready 可判定 |
| Artifact/archive seam | artifact/archive boundary | ref / summary | evidence / artifact refs,body-free | raw body 不入仓 |
| Observability/report seam | observability / reports | report / metric | safe metric/span/report shell | observability 不成 truth |
| Marketplace/peripheral seam | marketplace | residual / fake | discovery / distribution context ref | 不阻塞 P0 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“Protocol / flow 交付物池”“代码交付物清单”“测试、证据与报告交付物清单”“非交付物清单”和“跨仓 / 外部依赖交付物表”小节。

正式 `07-实施计划.md` §4 后续应回填:

本轮实施对象按七个正式实现单元、五类 protocol / flow family、测试证据链和实施台账交付面组织,而不是按旧 `MethodContent`、publish、snapshot 或 outbox 主线组织。代码交付必须落到 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`,并在首个实施阶段处理现有旧 workspace layout 与正式设计的冲突。

Protocol / flow 交付物池包含 58 Command、57 Query、4 Inbound Consumer、34 Outbound Event / sender 和 8 Operations Job。测试与证据交付物包含 P0 blocking suites、cross-cutting audits、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、evidence index、handoff 和 risk acceptance shell。implementation ledger 与 boundary ledger 是正式设计交付物,但只有 Step 6 定义 boundary 后才能生成实例。

本轮不交付旧主线对象、具体数据库产品、marketplace 交易履约、UI/console/SDK 深层体验、artifact/archive 正文生命周期、governance execution、真实 external provider binding、production-like capacity、hard SLO 或最终验收 verdict。除 `core-contracts` 编译期依赖外,其他 sibling repo 均通过 runtime/event/ref/adapter/fake/controlled seam 协作。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧实现仓 layout 是迁移保留部分代码还是清空重建 | 影响 PH-01 具体任务 | Step 5/6 按依赖顺序和 commit boundary 决定 |
| 58/57/4/34/8 是否全部进入同一 release line | 影响 phase 粒度 | Step 5/6 按 core 与 peripheral / residual 分层拆 |
| scripts roots 是否在首个 boundary 创建还是随 suite 分批创建 | 影响 Step 6 | Step 7 / Step 11 再绑定 checks 和 evidence |
| implementation ledger 首个 boundary id | 影响台账实例 | Step 6 定义后生成 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象已从 current `03/05/06` 抽取 | 通过 | 七实现单元、protocol family、tests、scripts、evidence、ledger 均已列出 |
| 旧实现仓冲突已作为交付物风险记录 | 通过 | PH-01 / 首个 boundary 需迁移或重建 |
| 非交付物已明确 | 通过 | old mainline、真实产品、UI、marketplace、production capacity 等排除 |
| 跨仓依赖边界已明确 | 通过 | 只有 `core-contracts` 是编译期 sibling dependency |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R4.2 / Step 5 | 通过 | 用户已确认,允许进入 Step 5 |

## 11. R4.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 4 实施对象、代码交付物、protocol / flow 交付物池、测试证据交付物、非交付物和跨仓依赖边界 |
| 后续动作 | 进入 Step 5 `R5.1 phases and dependencies:先思考` |
