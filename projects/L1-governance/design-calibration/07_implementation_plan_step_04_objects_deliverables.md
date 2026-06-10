# Step 4. 抽取实施对象与交付物

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填章节: `07-实施计划.md` §4 实施对象与交付物清单

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 抽取实施对象与交付物 |
| 当前状态 | 已完成;自动继续后续 Step |
| 输入基线 | Step 2 实施范围;Step 3 前置条件;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_04_objects_deliverables.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 5 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | 已完成 | 固定 P0 / 非范围,防止交付物膨胀 |
| Step 3 前置条件 | 已完成 | 固定目标仓、workspace、依赖、脚本、artifact/report roots |
| `03-详细设计.md` §4~§16 | 已存在 | 抽取代码模块、对象、protocol、flow、state、persistence、config、observability、test cuts |
| `05-测试方案.md` §6 / §9 / §13 | 已存在 | 抽取测试 suite、script、artifact、report 和 evidence 交付物 |
| `06-验收标准.md` §5~§14 | 已存在 | 抽取 AC / VETO / evidence / handoff 可判定交付物 |

## 3. SOP 问题回答

1. 本轮会新增或修改哪些代码模块。

   回答: 本轮会在目标实现仓新增或修改七个 workspace member:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。同时新增 `tests/contract`、`tests/domain`、`tests/service`、`tests/integration`、`tests/support` 和脚本目录 `scripts/gates`、`scripts/reports`、`scripts/checks`、`scripts/dev`。

2. 本轮会新增或修改哪些接口、事件、job 或 adapter。

   回答: 会实现 23 Command、14 Query、9 Inbound Event Consumer、12 Outbound Event、7 Operations Job,并实现 source resolver、publisher、handoff、archive、external GRC、adapter availability、Clock、IdGenerator、UnitOfWork、repository、idempotency / result / receipt / report store 和 runtime builder fake / in-memory adapter。

3. 本轮会新增哪些测试。

   回答: 会新增 contract-domain-fast、service-flow-fast、config-redline、dependency-boundary、infra-runtime-fake、entry-worker-job、operations-replay-core、redaction-boundary、report-generation-audit、release-main-smoke 等 P0 suite 覆盖的 contract、domain、application、infra、entry、job、redaction、dependency、evidence tests。P1 real-like selected-run 只保留脚本和 residual surface,不作为 P0 blocking。

4. 本轮会产生哪些配置、迁移、种子数据或文档同步。

   回答: 会产生 runtime config skeleton、profile fixtures、adapter availability fixtures、deterministic fake clock/id fixtures、DS-GOV-* fixture builder、artifact/report path skeleton、gate/report/check scripts 和 acceptance handoff / veto / risk report generation shell。不产生正式 DB migration、真实 vendor config、production secret 或真实验收 verdict。

5. 哪些上游设计对象本轮不交付。

   回答: 不交付 FR-GOV-E01~E06 对应的高级 dashboard / analytics、Policy DSL / simulation、复杂 Gate orchestration、自动草拟、真实 external GRC vendor deep integration、production capacity / SLO tooling。不交付相邻仓 truth、外部正文模型、真实 DB / bus / search / object storage 产品实现。

6. 哪些交付物跨仓或依赖外部模块。

   回答: 编译期跨仓交付物只依赖 `quantalithos-core` 的 `core-contracts`。identity、process、work、method-library、artifact/archive、conversation、runtime/capability、observability、external GRC 均通过 body-free ref、safe snapshot、event、adapter、handoff、fake / controlled / disabled seam 交付,不得作为 Cargo dependency。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚无交付物清单 | 后续 phase 无法判断输出是否完整 | 本 Step 建立代码 / 测试 / config / evidence / doc 交付物 |
| `03` 对象清单 | 对象数量多 | 若直接把对象清单当实施清单会不可执行 | 按交付物类型和模块聚合 |
| `05` suite / script | 测试与脚本分散在多个章节 | 后续 Step 7 难以绑定门禁 | 本 Step 先抽出 suite / script 交付物 |
| `06` 验收项 | AC / VETO 是裁决口径,不是代码对象 | 实现者可能写验收结论而非产物 | 本 Step 只抽取可判定 evidence / report 交付物 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施对象 | 分散在详细设计对象、protocol、flow、test cuts | 聚合为代码模块、protocol、adapter、tests、scripts、reports | 让 Step 5 能按可验证增量排序 |
| 交付物 | 未区分 code / test / config / doc / evidence | 按类型列出完成判定 | 避免“完善相关代码”式模糊任务 |
| 非交付物 | 只在 Step 2 范围中描述 | 抽成非交付物清单 | 防止 P1/P2 被阶段任务吸收 |
| 跨仓依赖 | 多个相邻仓参与语义 | 明确只有 core 是编译期依赖 | 执行依赖裁剪 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按对象逐项列所有 domain struct | 看似完整 | 不能指导实施顺序,也不能表达 tests/scripts/report | 不采用 |
| 按交付物类型和可验证 surface 聚合 | 可执行,能映射 phase 和 gate | 不列出每个字段 | 采用 |
| 把真实 DB/bus/external GRC adapter 列为 P0 交付物 | 更接近生产 | 与 P0 fake / controlled / disabled seam 冲突 | 不采用 |
| 把 fake / in-memory / script/report evidence 列为 P0 交付物 | 能证明设计语义和验收证据链 | 不覆盖真实产品 | 采用 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Workspace skeleton | code | `03` §4 | `Cargo.toml`;`crates/*`;`tests/*` | 七 crate workspace 可 `cargo check` |
| Public contracts | code | `03` §7 | `crates/contracts/src/*` | 23 Command、14 Query、9 Consumer、12 Event、7 Job DTO / fixtures 可测 |
| Domain truth and policies | code | `03` §5~§6 / §9~§10 | `crates/domain/src/*` | core truth state transition / invariant tests 通过 |
| Application services and ports | code | `03` §7~§13 | `crates/application/src/*` | command / query / consumer / job service tests 通过 |
| Infra runtime and fake adapters | code | `03` §7 / §11 / §14 | `crates/infra/src/*` | in-memory repository、fake resolver / publisher / handoff / export、runtime builder tests 通过 |
| API entry | code | `03` §4 / §7~§9 | `crates/api/src/*` | command / query handler tests 通过 |
| Worker entry | code | `03` §7~§9 | `crates/worker/src/*` | inbound consumer and outbox worker tests 通过 |
| Operations jobs entry | code | `03` §7~§13 | `crates/jobs/src/*` | 7 job runner and report tests 通过 |
| Test suites | test | `05` §6 / §9 | `tests/*` | P0 suite matrix 可执行 |
| Runtime config and fixtures | config / test | `04`;`05` §8 | config fixtures / test support | local-dev、ci-test、integration-like、operations-replay 可装配 |
| Gate / report / check scripts | script | `05` §9 / §13 | `scripts/gates`;`scripts/reports`;`scripts/checks` | `--help`、path check、sample report 通过 |
| Artifacts and reports roots | evidence | `05` §13;`06` §10 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance` | raw artifact / human report 可配对 |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Governance contracts crate | code | `03` §7 | `crates/contracts` | DTO roundtrip、metadata、schema version、fixtures 通过 |
| Governance domain crate | code | `03` §5~§6 / §9~§10 | `crates/domain` | state / policy / invariant / forbidden transition tests 通过 |
| Governance application crate | code | `03` §7~§13 | `crates/application` | command / query / consumer / job service flow tests 通过 |
| Governance infra crate | code | `03` §7 / §11 / §14 | `crates/infra` | fake UoW、repository version、runtime builder、adapter failure tests 通过 |
| Governance API crate | code | `03` §4 / §7 | `crates/api` | handler routes call application and map errors |
| Governance worker crate | code | `03` §7~§9 | `crates/worker` | consumer and outbox loop tests 通过 |
| Governance jobs crate | code | `03` §7~§13 | `crates/jobs` | operations job runner / report / duplicate replay tests 通过 |
| Command protocol and handlers | code / test | `03` §7.1 / §8 | contracts / application / api | 23 Command protocol and accepted/rejected/duplicate paths covered |
| Query protocol and handlers | code / test | `03` §7.2 / §8 | contracts / application / api | 14 Query view surface and no-write covered |
| Consumer protocol and workers | code / test | `03` §7.3 / §8 | contracts / application / worker | 9 Consumer accepted/duplicate/unsupported/delayed paths covered |
| Outbound event and publisher | code / test | `03` §7.3 / §8 / §11 | contracts / domain / application / worker | 12 payload mappings, stored snapshot, retry / failed marker covered |
| Operations job runners | code / test | `03` §7.4 / §8 / §12~§13 | contracts / application / jobs | 7 job report / partial failure / duplicate replay covered |
| Config and runtime builder | config / code / test | `04`;`03` §13 | infra / config fixtures | P0 profiles strict validation and fail-fast covered |
| Redaction and dependency checks | script / test | `05` §9~§10;`06` §10~§11 | `scripts/checks` | no raw body/secret and only core compile dependency covered |
| Evidence report generation | script / evidence | `05` §13;`06` §10~§14 | `scripts/reports`;`reports/*` | evidence index, gate summary, acceptance handoff shell generated from artifacts |

### 7.3 非交付物清单

| 非交付物 | 来源 | 不交付原因 | 后续处理 |
|---|---|---|---|
| Advanced governance dashboard / analytics | FR-GOV-E01 | P2 / future | 后续产品能力 |
| Policy DSL / simulation engine | FR-GOV-E02 | P2 / future | ADR / future detailed design |
| Complex Gate orchestration | FR-GOV-E03 | P2 / future | 基础 Gate / Decision 先成立 |
| AIIA / SoA auto drafting | FR-GOV-E04 | P2 / future | 只保存治理结论,不生成正文 |
| Vendor-specific external GRC adapter | FR-GOV-E05 | P1/P2 | P0 disabled / fake / controlled export |
| Production capacity / SLO tooling | FR-GOV-E06 | P2 | 只输出 sample / report |
| Durable DB / message bus / search product binding | `03` §17;`06` §13 | 产品未锁定 | P1/P2 or ADR |
| Deployment / operation runbook | `03` §2 非范围 | 非实施计划职责 | 运维文档 |
| Real acceptance verdict | `06` §14 | 需要真实 run evidence | 验收执行阶段填写 |

### 7.4 跨仓 / 外部依赖交付物表

| 交付物 | 依赖对象 | 依赖类型 | 当前交付形态 | 完成判定 |
|---|---|---|---|---|
| core contracts dependency | `quantalithos-core` | compile-time | Cargo path dependency | dependency-boundary 通过 |
| identity actor capability seam | `quantalithos-identity` | event / resolver | event DTO + fake resolver / snapshot | consumer tests 通过 |
| process governance context seam | `quantalithos-process` | event / ref | event DTO + safe ref / fake | consumer tests 通过 |
| work governance context seam | `quantalithos-work` | event / ref | event DTO + safe ref / fake | consumer tests 通过 |
| method policy/control seam | `quantalithos-method-library` | event / snapshot | method policy/control snapshot fake | consumer tests 通过 |
| artifact evidence seam | artifact/archive boundary | ref / safe summary | evidence summary ref / fake | redaction and body-free tests 通过 |
| conversation context seam | `quantalithos-conversation` | event / safe summary | event DTO + fake | consumer tests 通过 |
| runtime signal seam | runtime / capability boundary | event / safe marker | runtime signal ref / fake | no truth ownership tests 通过 |
| external GRC export seam | external system | disabled / fake / controlled adapter | external export report / marker | disabled/failure mapping tests 通过 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖交付物表”小节,了解本轮实施实际交付什么、不交付什么。

正式 `07-实施计划.md` §4 应回填:

本轮交付物按代码、测试、配置、脚本、证据和文档交付面组织,而不是按 domain struct 清单组织。代码交付包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 workspace member。协议交付包括 23 Command、14 Query、9 Inbound Event Consumer、12 Outbound Event 和 7 Operations Job。运行和证据交付包括 P0 config profiles、fake / in-memory / controlled adapters、gate / report / check scripts、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。

本轮不交付高级治理看板、Policy DSL、复杂 Gate 编排、AIIA / SoA 自动草拟、vendor-specific external GRC adapter、production capacity / SLO tooling、真实 DB / bus / search / object storage 产品绑定、部署 runbook 或真实验收 verdict。

跨仓依赖只允许 `quantalithos-core` 作为编译期 dependency。identity、process、work、method-library、artifact/archive、conversation、runtime/capability、observability 和 external GRC 均通过 ref、safe summary、event、adapter、handoff、disabled / fake / controlled seam 交付。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓不存在 | 所有 code / test / script 交付物无落点 | Step 5 PH-01 前置 |
| artifact/archive 实现仓未在本地目录中列出 | artifact evidence seam 只能按 ref / fake 表达 | Step 8 记录外部依赖处理 |
| external GRC 产品未锁定 | external export 只能 fake / disabled / controlled | 明确非 P0 产品绑定 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象明确 | 通过 | 七 crate、protocol、adapter、tests、scripts、reports |
| 交付物可判定 | 通过 | 每项有预计落点和完成判定 |
| 非交付物明确 | 通过 | P1/P2 和真实产品均排除 |
| 跨仓依赖边界明确 | 通过 | 只有 core 编译期依赖 |
| 可进入 Step 5 | 通过 | 下一步设计实施阶段与依赖顺序 |
