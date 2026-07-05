# Step 4. 抽取实施对象与交付物

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填章节: `07-实施计划.md` §4 实施对象与交付物清单
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_04_objects_deliverables.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 抽取实施对象与交付物 |
| 当前状态 | 已完成;用户审查通过 |
| 输入基线 | Step 2 实施范围;Step 3 前置条件;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_04_objects_deliverables.md` |
| 停审方式 | 用户已确认,已进入 Step 5 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | 已完成;用户已确认 | 固定 P0 Artifact truth center、非范围和 P1 / P2 防误入 |
| Step 3 前置条件 | 已完成;用户已确认 | 固定目标仓、workspace、依赖、脚本、artifact/report roots 和 implementation ledger 入口 |
| `03-详细设计.md` §4~§16 | 已存在 | 抽取代码模块、对象、protocol、flow、state、persistence、config、observability 和 test cuts |
| `05-测试方案.md` §9 / §13 / §14 | 已存在 | 抽取 blocking suite、gate / report / check scripts、raw artifact、run report 和 candidate evidence |
| `06-验收标准.md` §5~§14 | 已存在 | 抽取 `AC-ART-001~058`、`VETO-ART-001~009`、evidence integrity、risk acceptance 和 handoff 可判定交付物 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮会新增或修改哪些代码模块? | 本轮目标实现仓为 `/home/aris/Projects/quantalithos-artifact`,会建立或修改七个 Rust workspace member:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。同时需要 `tests/contract`、`tests/domain`、`tests/service`、`tests/integration`、`tests/support` 以及 `scripts/gates`、`scripts/reports`、`scripts/checks`、`scripts/dev`。 |
| 本轮会新增或修改哪些接口、事件、job 或 adapter? | 必须交付 16 Command、13 Query、6 Inbound Event Consumer、8 Outbound Event、6 public Operations Job,并单列 worker-only `PublishPendingArtifactRelays` relay publication facade。Adapter / port 交付包括 repository、UnitOfWork、Clock、IdGenerator、idempotency / stored result、resolver、publisher、handoff/export、runtime config builder、fake / controlled / disabled adapter。 |
| 本轮会新增哪些测试? | 必须交付 P0 blocking suites 和对应 case family: `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke`。`p1-real-like-selected-run` 只保留 selected-run 入口和 residual 口径,不计 P0 pass。 |
| 本轮会产生哪些配置、迁移、种子数据或文档同步? | 会产生 P0 config profile skeleton / fixtures、adapter availability fixture、deterministic fake clock/id fixture、safe test data builders、raw artifact/report path skeleton、gate/report/check scripts、acceptance handoff / veto / risk / open-issues draft generators。不会产生正式 DB migration、真实 bus topic provisioning、production secret、真实 vendor config 或真实验收 verdict。 |
| 哪些上游设计对象本轮不交付? | 不交付外部正文/附件/运行材料正文存储、真实 DB / bus / search / object storage 产品绑定、真实 upstream/downstream 产品深度集成、production-like / capacity / hard SLO、高级 dashboard / analytics、derived UX、长期 evidence retention 天数、部署运维 runbook、正式 `EV-ART-*` alias、真实 `run_id`、final verdict 或 signoff。 |
| 哪些交付物跨仓或依赖外部模块? | 编译期只允许依赖 `/home/aris/Projects/quantalithos-core` 的 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。`quantalithos-bus`、identity、process、work、governance、method-library、conversation、runtime/capability、archive、observability、sync 和 external GRC / vendor 均只能通过 body-free ref、safe summary、event、adapter、handoff、disabled / fake / controlled seam 协作,不得成为 Cargo path dependency。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚未建立实施对象与交付物章节 | 后续 phase / commit boundary 无法判断输出是否完整 | 本 Step 抽取代码、协议、测试、配置、证据、台账和非交付物 |
| `03` 对象 / port / protocol | 设计对象很多且粒度细 | 若直接复制对象表,实施计划会退化成不可执行清单 | 按可验证交付面聚合,字段级 truth 仍回读 `03` |
| `05` suite / evidence | 自动化、证据、报告分布在多个章节和校准文件 | Step 7 难以把测试门禁绑定到交付物 | 本 Step 先抽出 suite、script、artifact/report 和 evidence 交付物 |
| `06` 验收项 | `AC-ART-*` / `VETO-ART-*` 是裁决口径,不是代码对象 | 实现者可能伪造验收结论或静态 evidence | 本 Step 只交付可判定路径和报告生成器,不填写真实 verdict |
| implementation ledger | `07` 尚未定义正式台账和 boundary skeleton | 实现移交时会反复因缺 boundary 回设计侧 | 本 Step 先列为设计移交交付物,Step 6 / Step 13 再具体生成 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施对象 | 分散在详细设计模块、对象、protocol、flow、test cuts | 聚合为代码模块、protocol/adapter/job、tests、scripts、config、evidence 和 ledgers | 让 Step 5 能按可验证增量排序 |
| 交付物 | 未区分 code / test / config / evidence / design handoff | 每项给出来源、落点和完成判定 | 避免“完善相关代码”式模糊任务 |
| 非交付物 | 只在 Step 2 范围中描述 | 抽成非交付物清单 | 防止 P1/P2 或执行期结论被纳入 P0 |
| 跨仓依赖 | 多个相邻仓参与语义 | 明确只有 core 是编译期依赖,其余是 runtime seam / fake / disabled | 保持 dependency boundary 和 VETO 口径 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按所有 domain object / DTO / trait 逐项列交付物 | 看似完整 | 无法指导 phase 顺序,也会复制详细设计字段级 truth | 不采用 |
| 按交付物类型和可验证 surface 聚合 | 可执行,能映射 phase / gate / evidence | 不列每个字段 | 采用 |
| 把真实 DB / bus / vendor adapter 作为 P0 交付物 | 接近生产 | 违反 P0 fake / controlled / disabled seam,会让 P0 被未锁定产品阻塞 | 不采用 |
| 把 fake runtime、report scripts 和 implementation ledgers 列为交付物 | 能保证实现可验证、可移交、可恢复 | 增加设计阶段台账工作 | 采用 |
| 把 `PublishPendingArtifactRelays` 并入 public jobs | 表格更短 | 违反 worker-only relay facade 口径和证据统计 | 不采用;单列 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Workspace skeleton | code | `03` §4;Step 3 | `/home/aris/Projects/quantalithos-artifact/Cargo.toml`;`crates/*`;`tests/*` | 七 crate workspace 可 `cargo check`,无 `L1` / `l1_` 命名泄漏 |
| Public contracts surface | code | `03` §5~§7;`06` §7 | `crates/contracts/src/*` | typed ref、DTO、receipt、error、view、event、job、fixtures 可被 contract tests 覆盖 |
| Domain truth and policies | code | `03` §5~§12 | `crates/domain/src/*` | fact / version / lineage / baseline / consumable core transition 和 invariant tests 通过 |
| Application services and ports | code | `03` §7~§13 | `crates/application/src/*` | command / query / consumer / job service tests 通过,accepted mutation UoW 顺序闭合 |
| Infra runtime and fake adapters | code | `03` §7 / §11 / §14;`04` | `crates/infra/src/*` | in-memory repository、fake resolver / publisher / handoff、runtime builder、profile tests 通过 |
| API entry | code | `03` §4 / §7~§9 | `crates/api/src/*` | Command / Query handler 调用 application,不直接写 truth |
| Worker entry and relay loop | code | `03` §7~§9;`05` §9 | `crates/worker/src/*` | 6 Consumer 和 `PublishPendingArtifactRelays` worker-only loop tests 通过 |
| Operations job entry | code | `03` §7~§13 | `crates/jobs/src/*` | 6 public job runner、report replay、partial failure、no-truth-repair tests 通过 |
| Test suites and fixtures | test | `05` §6 / §9 / §13 | `tests/*`;`tests/support/*` | P0 suite matrix 可执行,fixtures 不含 forbidden body / secret |
| Runtime config assets | config / test | `04`;`05` §8~§9;`06` §9 | config fixtures / test support | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可装配且 fail-fast |
| Gate / report / check scripts | script | `05` §9 / §13;`06` §10 | `scripts/gates`;`scripts/reports`;`scripts/checks`;`scripts/dev` | `--help`、path check、sample artifact/report 生成通过 |
| Artifacts and reports roots | evidence | `05` §13;`06` §10 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance`;`reports/review` | raw artifact / human report 可配对,不引用 `latest` |
| Implementation ledgers | design handoff | Step 3;代码实施台账规范 | `projects/L1-artifact/design-calibration/implementation_execution_ledger.md`;`implementation-boundaries/*.md` | Step 13 前当前 boundary 激活,全部 future boundary 预创建为 `planned / wait_until_current` |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Artifact contracts crate | code | `03` §5~§7 | `crates/contracts` | 16 Command、13 Query、6 Consumer、8 Event、6 Job、relay worker DTO 和 public carriers 编译并通过 roundtrip / fixture tests |
| Artifact domain crate | code | `03` §5~§12 | `crates/domain` | Artifact fact、version、lineage、baseline、consumption boundary、trace/audit/outbox objects 的合法/非法迁移测试通过 |
| Artifact application crate | code | `03` §7~§13 | `crates/application` | service facade、repository/UoW/idempotency/port traits、stored result / receipt / report replay tests 通过 |
| Artifact infra crate | code | `03` §7 / §11 / §14;`04` | `crates/infra` | fake runtime、in-memory store、config loader、adapter failure mapping、dependency boundary tests 通过 |
| Artifact API crate | code | `03` §4 / §7~§9 | `crates/api` | synchronous Command / Query entry 调用 application 并映射 protocol error |
| Artifact worker crate | code | `03` §7~§9;`05` §9 | `crates/worker` | inbound consumer、relay publication loop、outbox worker no-current-truth-rebuild tests 通过 |
| Artifact jobs crate | code | `03` §7~§13 | `crates/jobs` | 6 public operations jobs 的 duplicate report replay、partial failure 和 disabled target surface 通过 |
| Command protocol and handlers | code / test | `03` §7~§9;`06` §7 | contracts / application / api | 16 Command accepted / rejected / duplicate / conflict paths covered |
| Query protocol and handlers | code / test | `03` §7~§9;`06` §7 | contracts / application / api | 13 Query no-write、not-visible、degraded、stale、empty page surface covered |
| Inbound consumer protocol and workers | code / test | `03` §7~§9;`06` §7 | contracts / application / worker | 6 Consumer duplicate / unsupported / delayed / rejected / no-truth-write paths covered |
| Outbound events and publisher material | code / test | `03` §7~§11;`06` §7~§8 | contracts / domain / application / worker | 8 payload snapshot、topic-neutral key、stored-snapshot-only publisher tests 通过 |
| Worker-only relay facade | code / test | `03` §8~§9;`05` §9 / §13;`06` §7 | `crates/worker`;`tests/integration` | `PublishPendingArtifactRelays` 不计 public job,entry-worker-job 与 operations-replay-core 均可追溯 |
| Public operations jobs | code / test | `03` §7~§13;`06` §7~§10 | `crates/jobs`;`crates/application` | 6 public jobs no-truth-repair、report replay、handoff/export marker tests 通过 |
| P0 test suite matrix | test | `05` §9 / §13;`06` §10 | `tests/*`;`scripts/gates/*` | 10 个 P0 suites / checks 可从 gate scripts 运行并输出 raw artifacts |
| Config and runtime builder | config / code / test | `04`;`05` §8~§9;`06` §9 | `crates/infra`;config fixtures | strict validation、source priority、topic completeness、profile isolation 和 fail-fast covered |
| Redaction and dependency checks | script / test | `05` §9 / §13;`06` §9~§11 | `scripts/checks` | raw body / secret / full ref scan clean;only core compile dependency report generated |
| Evidence report generation | script / evidence | `05` §13;`06` §10~§14 | `scripts/reports`;`reports/*` | evidence index、gate summary、suite reports、handoff、veto、risk、open issues 从 raw artifacts 生成 |
| Implementation handoff ledgers | design handoff | Step 3;代码实施台账规范 | design repo `implementation_execution_ledger.md`;`implementation-boundaries/` | Step 13 预创建,实现 agent 不需要现场补 boundary 文件 |

### 7.3 非交付物清单

| 非交付物 | 来源 | 不交付原因 | 后续处理 |
|---|---|---|---|
| 外部正文 / 附件 / 运行材料正文存储 | `00` §11;`01`;`06` §6 / §11 | 违反 body-free Artifact truth boundary | 仅允许 ref / safe summary / marker |
| 真实 DB / bus / search / object storage 产品绑定 | `03` §2 / §17;`05`;`06` §13 | 产品未锁定,P0 只证明 seam 语义 | P1/P2 或 ADR |
| 真实 upstream / downstream 产品深度集成 | `05`;`06` §2 / §13 | P0 只验 formal seam contract | 产品绑定后补 selected-run / E2E |
| `staging-like` / `production-like` / capacity / hard SLO | `05`;`06` §2 / §9 | 当前无正式阈值且不阻塞 P0 | residual / future |
| 高级 dashboard / analytics / derived UX | `06` §2 | P2 能力,基础 read surface / report 已覆盖 P0 | 后续产品阶段 |
| 长期 evidence retention 天数 | `06` §2 / §13 | 属于运维留存策略 | 后续运维标准 |
| 部署拓扑、生产告警、运维 runbook | `03` §2 非范围 | 不属于实施计划职责 | `09-部署与运维手册.md` |
| 真实 `run_id`、implementation commit、config digest、final verdict、signoff | `06` §3 / §14 | 执行期数据,设计阶段不得伪造 | 实施和验收执行阶段填写 |
| 正式 `EV-ART-*` evidence alias | `06` 文档元信息 / §15 | 当前证据口径固定为 `EV-CAND-ART-*` | 若未来新增 alias 必须保持可逆追溯 |

### 7.4 跨仓 / 外部依赖交付物表

| 交付物 | 依赖对象 | 依赖类型 | 当前交付形态 | 完成判定 |
|---|---|---|---|---|
| core contracts dependency | `quantalithos-core` | compile-time | Cargo path dependency: `../quantalithos-core/crates/contracts` | dependency-boundary 证明 non-core sibling 未进入 Cargo graph |
| bus publication seam | `quantalithos-bus` | runtime / topic seam | topic-neutral key、publisher trait、fake publisher | enabled binding 可校验,无真实 bus provisioning 也不阻塞 P0 |
| identity actor / responsibility seam | `quantalithos-identity` | runtime ref / event | actor / capability / responsibility safe ref + fake resolver | consumer / command tests 证明不复制 identity truth |
| process / work context seam | `quantalithos-process`;`quantalithos-work` | runtime ref / event | process/work artifact context ref、safe summary、fake resolver | artifact truth 不接管 process/work truth |
| governance evidence basis seam | `quantalithos-governance` | runtime ref / evidence basis | governance artifact context / basis ref、safe marker | evidence / handoff reports body-free |
| method definition seam | `quantalithos-method-library` | runtime ref / snapshot | method artifact definition ref、policy/control snapshot fake | method body 不入 Artifact truth |
| conversation / runtime signal seam | `quantalithos-conversation`;runtime/capability | event / safe marker | conversation context event、runtime signal ref、safe marker | inbound consumer no-truth-repair covered |
| archive / observability / sync handoff seam | external or future repos | disabled / fake / controlled adapter | handoff material ref、export marker、report | disabled / failed / retryable surface 不改 Artifact truth |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖交付物表”小节,了解本轮实施实际交付什么、不交付什么。

正式 `07-实施计划.md` §4 应回填:

本轮交付物按代码、测试、配置、脚本、证据和设计移交台账组织,而不是按 domain struct 清单组织。代码交付包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 workspace member。协议交付包括 16 Command、13 Query、6 Inbound Event Consumer、8 Outbound Event、6 public Operations Job,以及 worker-only `PublishPendingArtifactRelays` relay publication facade。运行与证据交付包括 P0 config profiles、fake / in-memory / controlled / disabled adapters、gate / report / check scripts、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、`reports/review` 和 implementation boundary ledgers。

本轮不交付外部正文存储、真实 DB / bus / search / object storage 产品绑定、真实 upstream / downstream 产品深度集成、production-like / capacity / hard SLO、高级 dashboard / analytics、derived UX、长期 evidence retention 天数、部署运维 runbook、正式 `EV-ART-*` alias、真实 `run_id`、final verdict 或 signoff。

跨仓依赖只允许 `quantalithos-core` 作为编译期 dependency。`quantalithos-bus`、identity、process、work、governance、method-library、conversation、runtime/capability、archive、observability、sync 和 external vendor 均通过 body-free ref、safe summary、event、adapter、handoff、disabled / fake / controlled seam 交付。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-artifact` 当前未发现 | code / test / script 交付物无实际落点 | Step 5 将其作为 PH-01 foundation 前置或首项交付 |
| implementation boundary 数量和命名尚未拆分 | 影响 Step 6 / Step 13 ledger 预创建 | Step 6 按 phase / commit boundary 固定后,Step 13 预创建全部 skeleton |
| P1 selected-run 是否进入未来 release candidate | 影响 future gate,不影响当前 P0 | Step 7 / Step 9 记录为 residual / selected-run |
| 真实产品选型何时进入 ADR | 影响 durable adapter 和真实 E2E | Step 9 记录风险和触发条件 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象明确 | 通过 | 七 crate、protocol、adapter、tests、scripts、reports、ledgers |
| 交付物可判定 | 通过 | 每项有来源、预计落点和完成判定 |
| 非交付物明确 | 通过 | P1/P2、真实产品、执行期结论和 formal evidence alias 均排除 |
| 跨仓依赖边界明确 | 通过 | 只有 core 编译期依赖,其余为 runtime seam / fake / disabled |
| 可进入 Step 5 | 待用户确认 | 下一步设计实施阶段与依赖顺序 |
