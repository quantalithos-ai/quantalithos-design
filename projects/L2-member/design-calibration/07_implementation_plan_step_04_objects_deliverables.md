# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
>
> 回填章节：未来 `07-实施计划.md` §4 实施对象与交付物清单
>
> 输入事实等级：design-planning only；本文件不表示目标实现仓、代码、Cargo manifest、脚本、测试、artifact、report、evidence、verdict、signoff、readiness 或 commit 已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4：抽取实施对象与交付物 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | 07 Step 1～3；当前正式 `00~06`；正式 `03` 与 Step 17 implementation handoff |
| 本步输出 | 本文件；未来正式 §4 的回填草稿 |
| 停审方式 | 本 Step 已完成对象、交付物、非交付物和跨仓交付形态的设计级审计。用户已授权连续完成后续 Step，下一动作只能进入 Step 5。 |
| 不可越过项 | 不创建实现仓；不实现任何 planned delivery；不把 24 candidate 变成 Event / publisher / outbox；不把 blocked seam 写成实际交付。 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| 07 Step 2 范围 | completed | 固定 P0 member-local、negative、blocked-aware 范围与 P1/P2 非范围 | 不把交付物扩张为外部 positive integration |
| 07 Step 3 前置条件 | completed | 固定 planned Rust、七 crate、Core-only compile candidate、脚本和证据路径纪律 | 不把 planned path 写成已存在目录 |
| `03-详细设计.md` §3～§16 | current formal | 抽取模块、对象组、Port、协议、flow、state、logical Store、配置、观测和 test cut 的实施对象 | 不复制字段、DTO、trait 或 flow schema |
| `04-配置设计.md` §3～§12 | current formal | 抽取 profile / config validation / composition / blocked-slot 交付面 | 不选择 DB、broker、IPC、transport 或 secret 产品 |
| `05-测试方案.md` §3～§14 | current formal | 抽取 planned suites、checks、reports 和证据生产链 | 不创建脚本、run、artifact、report 或 EV 实例 |
| `06-验收标准.md` §3～§14 | current formal | 抽取 future AC / VETO / handoff 可判定面 | 不填写验收结论或签署 |

## 3. SOP 问题回答

1. **本轮会新增或修改哪些代码模块？**

   未来获授权实现时，代码对象是七个 planned Rust library crate：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。它们共同承接 CP01～CP07 的 member-local truth、safe read 和 conservative seam；不是七个进程、seven-CP package 或可直接启动的 daemon。

2. **本轮会新增或修改哪些接口、事件、Job 或 adapter？**

   未来代码面包含 10 Command、16 Query、14 transport-neutral Consumer、5 logical Operations Job、application-owned Store / resolver / handoff / technical Port，以及 deterministic fake / blocked seam 的实现位置。24 个 outbound semantic candidate 不在交付对象中：`L2M-UP-005` 未关闭前，它们只需被依赖与非物化检查覆盖，绝不产生 event wire carrier、publisher、outbox、route、topic、retry 或 DLQ。

3. **本轮会新增哪些测试？**

   未来测试交付为正式 `05` 已定义的 P0 suite、其 case / fixture / fake 支撑、dependency / redaction / replay / report checks，以及由真实执行才可生成的 artifact-to-report 生产链。测试对象覆盖 local / negative / blocked-aware 语义；owner positive seam 只保留 conditional selected-run，不能被 fake 计作 P0 integration pass。

4. **本轮会产生哪些配置、迁移、种子数据或文档同步？**

   计划中的配置交付是 profile 读取、strict validation、validated composition ref、logical Store / technical / resolver / handoff slot 与 blocked-slot posture；计划中的开发支撑是 deterministic fixture / fake builder、gate/check/report scripts 和报告模板规则。不会交付 migration、DDL、ORM、physical DB / queue / broker、真实 secret、固定 endpoint、IPC / transport schema、生产部署或真实证据。

5. **哪些上游设计对象本轮不交付？**

   不交付 LLM reasoning / plan / memory / checkpoint、Runtime loop / context / plan / outcome、tool execution / registry / MCP-A2A-API adapter、host lifecycle / health / session、image build / manifest / compatibility、external truth、physical Store / UoW product、scheduler、transport、observability backend、外部 positive qualification、性能 / SLO 结论和真实验收结论。

6. **哪些交付物跨仓或依赖外部模块？**

   `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是唯一 planned Cargo compile candidate。Runtime、Tools、member-service、member-images、L0-bus、L0-sdk、Identity、Governance、Conversation、Artifact 与 observability 均只通过 runtime / event / ref / adapter / fake / persistence seam 协作；它们不因目录相邻而成为 package dependency，也不授权本仓复制其 truth。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 未来正式 §4 | 尚无 project-specific object / deliverable inventory | Step 5 无法按可验证增量排序 | 按 implementation surface 聚合，而非把 34 个对象原样当作任务 |
| `03` 协议分母 | `10 / 16 / 14 / 24 / 5` 容易被误读为全部可正向交付 | 可能创建越权 Event 或 transport | 24 candidate 单列为 non-delivery / static redline，其余分母保留到后续 phase / boundary 追溯 |
| DDD / external gaps | 目标仓、Store、receipt、helper、host / Runtime / Core / Bus 等未闭合 | 某些 future code surface 无法 1:1 落码 | 保留 affected delivery 为 blocked-aware planned surface；不把缺口隐藏为“待实现” |
| 测试和证据 | suite / report contract 已设计但没有执行事实 | 容易将路径或模板误写成 evidence | 只列 future producer / path contract，明确不产生实例 |
| 旧材料 | CloudEvents、AG-UI、UDS、launch token 等曾作为 historical material 出现 | 可能污染交付物与依赖清单 | 不列为任何当前 implementation delivery |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施对象 | 分散在 crate、CP、对象、protocol 和 test cut 中 | 收敛为 code / config / test / script / report 的可追溯交付面 | 让后续阶段以能力而非文件拆分 |
| 24 candidate | 容易与 Consumer 或 Job 一并被理解为接口交付 | 明确为 zero-configuration non-delivery guard | 保留 Core / Bus owner 边界 |
| 外部协作 | 可能被笼统列为 dependency | 用 compile / runtime / event / ref / adapter / fake / persistence 分类 | 防止错误 Cargo path dependency |
| 完成口径 | 易把 planned 路径当做已交付 | 每项只给 future completion condition | 防止伪造执行期事实 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 逐个列出全部 34 domain object | 表面细致 | 不能说明 crate、测试、配置和证据交付，也会复制详细设计 | 不采用 |
| 按 CP + implementation surface 聚合 | 能映射可验证功能增量和后续 boundary | 需要继续回读 object card | 采用 |
| 将全部 external adapter 作为 P0 code delivery | 表面上覆盖面大 | 合同未闭合，必然私造 schema / transport | 不采用 |
| 将 deterministic fake / blocked seam 作为 P0 local delivery形态 | 能验证 owner boundary、failure 和 consistency 语义 | 不证明外部成功 | 采用 |
| 将 Event publisher / outbox 纳入 CP04/05 交付 | 常见基础设施路径 | 违反 `L2M-UP-005` 和 24 candidate 红线 | 不采用 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 权威来源 | future planned 落点 | future completion condition |
|---|---|---|---|---|
| seven-crate workspace / naming / inward dependency shape | code composition | `03` §3～§5 | target repo `Cargo.toml`、`crates/{contracts,domain,application,infra,api,worker,jobs}` | crate / package / library-only naming、Core-only compile classification 和 dependency guard 可检查 |
| CP01 / CP02 local truth and safe admission | domain + application + API | `03` §5～§12；Command 001～006；Query 001～004 | contracts/domain/application/infra/api | dual anchor、scope / screening fence、state / UoW / replay与 blocked posture可测 |
| CP03 Runtime mediation local boundary | domain + application + API | `03` §5～§12；Command 007～008；Query 005～006 | contracts/domain/application/infra/api | safe context / local attempt / result link / reception 不宣称 Runtime truth |
| CP04 outbound local decision boundary | domain + application + API + Job seam | `03` §5～§12；Query 007～008；`PublicationRelay` | contracts/domain/application/infra/api/jobs | committed-safe decision / material / local attempt-gap semantics能回指；DDD gap 未闭合时保持 blocked |
| CP05 interaction trace / observation boundary | domain + application + API + Job seam | `03` §5～§12；Query 009～011；`ObservationRelay` | contracts/domain/application/infra/api/jobs | correlation、append-only、body-free / redaction与 observed fence可测 |
| CP06 owner-specific mirror | domain + application + API + worker + Job seam | `03` §5～§12；Command 009～010；Query 012～013 | contracts/domain/application/infra/api/worker/jobs | safe source ref / resolution / gap、no generic resolver、no foreign truth |
| CP07 summary / outlet / diagnostic projection | domain + application + API + worker + jobs | `03` §5～§12；Query 014～016 | contracts/domain/application/infra/api/worker/jobs | committed-only projection、freshness / stale / no-write与 non-authorizing outlet可测 |
| finite protocol / entry surface | contracts + API + worker + jobs | `03` §7～§8 | command / query / consumer / job public carrier and logical entries | 10 Command、16 no-write Query、14 Consumer、5 Job finite mapping / typed replay / safe error可测 |
| Store / UoW / idempotency / deterministic fake parity | infra + test support | `03` §6、§10、§12；`05` §3～§6 | infra Store slots、test support | append / successor、CAS、rollback、exact stored carrier、Unknown fence与 no-write保持一致 |
| configuration / composition | config + infra | `04` §3～§12；`03` §13 | infra config / runtime builder and profile fixtures | strict validation、validated ref、slot availability和 non-configurable invariant可检查 |
| safe observability / local audit | code + checks | `03` §14；`05` / `06` redaction rules | module-local instrumentation and checks | finite labels、safe refs、redaction与 no external fact claim可检查 |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | future completion condition |
|---|---|---|---|---|
| workspace and seven library crate skeleton | code | `03` §3～§4 | target implementation repository | target repo exists; naming and Core-only compile boundary pass the future checks |
| public contracts / refs / metadata / errors / views / receipts / Job carriers | code + contract test | `03` §5～§8 | `crates/contracts` | finite typed surfaces support construction and invalid / body-free guards |
| CP01～CP07 domain policies, state helpers and local records | code + domain test | `03` §5～§6、§9 | `crates/domain` | legal / illegal state and owner boundary tests are available; reserved gaps remain blocked |
| named services, Ports, UoW and exact replay orchestration | code + service test | `03` §5～§13 | `crates/application` | non-Query ordering, Query no-write, CAS and carrier pairing can be tested |
| local / support / projection / continuation Stores; blocked seams; builder | code + fake-parity test | `03` §5、§10、§13；`04` | `crates/infra` | validated composition and deterministic fake preserve formal semantics without selecting physical product |
| Command / Query logical entry mappings | code + entry test | `03` §5、§7～§8 | `crates/api` | pre-gate, safe error mapping and Query no-write can be checked without a transport decision |
| Consumer logical entry and source/body/dedup pre-gates | code + entry test | `03` §5、§7～§8 | `crates/worker` | 14-name finite dispatch and conservative refusal path are available; accepted receipt lane remains gap-gated |
| five logical continuation Job entries / report mapping | code + job test | `03` §5、§7～§8 | `crates/jobs` | finite selector, partial isolation, exact report replay and no-source-repair can be checked where design is closed |
| four P0 profile fixtures and validation support | config + test | `04` §6～§11 | future config / test-support locations | `local-dev`、`ci-test`、`integration-like`、`operations-replay` obey strict validation and invariants |
| P0 suites, checks and deterministic fixtures | test + script | `05` §3～§12 | future `tests/` and `scripts/gates|checks` | each planned P0 suite has an executable future contract; no result is presumed now |
| report generators and acceptance-handoff draft generator | script + report contract | `05` §9、§13；`06` §10～§14 | future `scripts/reports` | outputs are derived only from actual artifacts; generators cannot self-declare pass / signoff |
| artifact / report / acceptance path rules | evidence contract | `05` §13；`06` §3、§10～§14 | future `artifacts/test/<run_id>` and `reports/` | future raw artifact, readable report, VETO and handoff relations can be audited; no instance exists now |

### 7.3 Non-delivery / explicitly excluded inventory

| 非交付物 | 不交付原因 | 未来 owner / trigger |
|---|---|---|
| Runtime loop, context, plan, outcome, checkpoint and LLM reasoning | Runtime truth is external | `L2-runtime` formal contract and owner-controlled integration |
| tool execution, capability registry, MCP / A2A / API adapters | Tools truth is external | `L2-tools` / capability owner |
| host IPC, endpoint registry, session, health, lifecycle and credential issuing | member-service / Identity own the truth | `L2M-UP-001` / `L2M-UP-006` closure |
| image build, manifest, pinned entry compatibility and release readiness | member-images owns supply truth | `L2M-UP-002` closure |
| any member Event envelope, publisher, outbox, route, topic, retry or DLQ | 24 candidate remain non-materialized | `L2M-UP-005` formal Core / Bus contract then controlled design reopen |
| foreign body / authorization / health / delivery / observation / evidence truth | violates owner and body-free rules | external owner only |
| physical DB / ORM / migrations / broker / scheduler / transport / deployment | no product authority | future configuration / implementation authority |
| non-project execution subject, production capacity, hard SLO or vendor integration | P2 / unapproved scope | new formal requirement / authority |
| actual tests, artifacts, reports, EV, acceptance verdict, signoff or readiness | require real authorized execution | future fixed baseline and execution |

### 7.4 跨仓 / external delivery shape

| 交互对象 | 分类 | 本仓 future delivery shape | 禁止误写为 |
|---|---|---|---|
| `L0-core` `core-contracts` | compile | sole planned local Cargo path candidate | member Event schema / route already closed |
| `L2-runtime` | runtime + ref | application Port, typed boundary ref, safe material, local attempt / result link / blocked posture | Runtime client, trigger mapping, run / outcome truth |
| `L2-tools` | runtime + ref | safe capability / tool contract view and owner-specific resolution seam | execution, registry or external adapter |
| `L2-member-service` | runtime + adapter | host material / attempt, safe feedback ref, unavailable / blocked seam | IPC contract, health, session or lifecycle |
| `L2-member-images` | ref + runtime | opaque pinned release / availability / waiting posture | manifest, compatibility or image readiness |
| `L0-bus` / `L0-sdk` | event + adapter | Consumer boundary after owner verification; typed ref or fake at test cut | Cargo dependency, wire event or route |
| `L1-identity`, `L1-governance`, `L1-conversation`, `L1-artifact` | ref + resolver | owner-specific safe resolution / body-free ref | foreign source body or authoritative local mirror |
| deterministic fake | fake | test-only implementation of application-owned Port with parity constraints | external acceptance, evidence or integration success |
| local Store / UoW | persistence | logical local fact / support / projection / continuation persistence seam | a selected physical product |

### 7.5 Blocked-delivery map

| blocker | affected planned delivery | allowed planning / future local action | prohibited shortcut |
|---|---|---|---|
| `L2M-DDD-001` | every code / script / test delivery | retain target paths and gates as planned | create target repository from this design task |
| dirty design baseline | every Design Gate | define future manifest / baseline freeze check | treat current HEAD or dirty tree as immutable baseline |
| `L2M-DDD-002` | durable Store / crash / performance delivery | deterministic fake and logical semantics planning | select a DB / UoW product ad hoc |
| `L2M-DDD-003` | Consumer accepted receipt / replay | pre-gate and refusal planning only | reconstruct receipt from current truth / fake map |
| `L2M-DDD-004~007`, `scope_supersede_gap` | CP02 replace, CP04～CP07 successors / helpers / versions | model affected boundary as blocked / wait_design | write direct state / Store save / inferred helper |
| `L2M-UP-001~004,006~008` | positive host / Runtime / credential / screening / subject deliveries | local safe / blocked-aware behavior | shadow IPC, credential, Runtime mapping, allowlist or third subject |
| `L2M-UP-005` | all 24 outbound semantic candidates | dependency / non-materialization checks only | Event, publisher, outbox, route, topic, retry or DLQ |

## 8. 回填草稿

未来正式 `07-实施计划.md` §4 应说明：本轮以 implementation surface 而不是 34 个对象清单组织交付。未来代码形态是 seven planned Rust library crate，覆盖 CP01～CP07 local truth、safe read、finite `10 Command / 16 Query / 14 Consumer / 5 Job` carrier 和 logical entry，以及 Store / UoW / idempotency、strict configuration、deterministic fake、tests、checks、report generation 和 future artifact/report path contract。每个实现对象必须回读 `03` 的正式章节和 owning calibration，不在 07 复制字段或 Port schema。

24 个 outbound semantic candidate 不属于实现交付；在 `L2M-UP-005` 关闭前，唯一交付是 zero-configuration / non-materialization guard。host、Runtime、image、credential、screening、foreign truth、physical product、transport、scheduler、deployment、SLO、真实证据和验收结论均不属于 P0。跨仓只有 `core-contracts` 是 planned compile candidate；其他关系严格按 runtime、event、ref、adapter、fake 或 persistence seam 表达。所有 blocked delivery 都必须等待正式 owner / design closure，不能由实现端发明 schema、helper 或外部成功。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 / trigger |
|---|---|---|
| immutable design baseline 的 manifest / commit 形态 | 所有 future delivery completion condition | Step 11 / Step 12 固定交付前检查；当前保持 blocked |
| target implementation repository creation authorization | 所有 planned paths | `L2M-DDD-001`;不在此任务创建 |
| Core contracts actual compatibility | workspace / contracts delivery | PH / boundary 开工前核验；当前不宣称 compile |
| physical Store / UoW choice | durable and recovery delivery | `L2M-DDD-002`;保持 logical / fake separation |
| owner exact contracts and DDD helpers | affected positive / successor / receipt deliveries | 保持 blocked / wait_design;后续 Step 8/9 标 owner and deadline trigger |
| workload / SLO authority | non-functional delivery | 保持 P2 / spike,不写阈值 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象可追溯 | 通过 | 每类均回指正式 `03`、`04`、`05` 或 `06` |
| 交付物可判定 | 通过 | 每项有 planned target 和 future completion condition |
| 非交付物清楚 | 通过 | external truth / physical product / real execution均已隔离 |
| 24 candidate 防误入 | 通过 | non-delivery and dependency check only |
| blocker 未弱化 | 通过 | 所有 UP / DDD / baseline blocker 保持开放 |
| 可进入 Step 5 | 通过 | 下一步只设计 phase / dependency order，不提前拆 commit boundary |
