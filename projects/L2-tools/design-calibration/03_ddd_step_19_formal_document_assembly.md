# L2-tools 03 详细设计 Step 19: 正式文档装配与全链审计

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 19
> 对应书写规范: `standards/document/详细设计书写规范.md`
> 回填目标: `projects/L2-tools/03-详细设计.md`
> 状态: completed / pass; stop review
> 模式: full-restart / single-agent-serial
> 说明: 本文件记录 18 章装配、旧文档替换、来源追溯和全链审计结果；完成后停审，不进入 04。

## 0. 装配前门禁

| 项目 | 结论 |
|---|---|
| Step 1~18 | 全部 `completed / pass`；Step 18 未发现新增上游 blocker。 |
| 正式文档写入 | 此中间产物创建后开放；仅允许整体删除旧正式 03 并按本文件重建。 |
| 历史正式 03 | 只作 `historical_material`；不得增量编辑或继承其对象、技术栈、API、状态、存储或结果事实。 |
| 直接上游 | 当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。 |
| 当前协议数量 | 13 Commands、11 Queries、5 Inbound Consumers、4 Outbound semantic Events、4 Operations Jobs。 |
| 对象数量 | 41 个 domain/business objects，分组 `6/6/5/6/10/8`；stable application/infra/entry carriers 另按 owning module 索引。 |
| Flow 数量 | `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04`，共 37 条。 |
| 实现仓 | `/home/aris/Projects/quantalithos-tools` 当前不存在；正式文档只写 planned layout，不写代码或构建事实。 |
| 上游 blocker | `L2T-UP-001~009` 保持 open；正式 03 只装配 local truth、negative path、blocked-aware seam。 |
| 提交 | 不需要，也未经用户明确要求不提交。 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按规范主链组织？ | 是，采用书写规范规定的 18 章：上游关系、目标范围、约束、布局、模块契约、全局索引、协议、函数流、状态、持久化、错误、并发、配置、观测、测试、实施承接、风险、参考。 |
| 第 5 章是否以模块为主轴？ | 是。七个工程模块分别展开文件、capability、对象、trait/Port/adapter、关键函数、错误和测试切口；六个业务组成部分在模块内映射，不拆成业务 crate。 |
| 对象、trait、协议、flow、state 是否互相可回指？ | 以 Step 6~10 和 R-6~R-9 为 canonical source；正式章节提供索引、关键契约和精确来源链接，字段级细节不足时必须继续读对应 annex。 |
| 正式正文是否需要复制全部中间产物？ | 不复制过程记录和整份 annex，但不能压缩为摘要。正式正文必须给出足以定位实现的 workspace、模块、对象分组、Port/Store、协议 inventory、flow 模板、状态矩阵、事务/错误/幂等/观测/测试契约；字段级完整卡片通过每节来源入口承接。 |
| 是否误把后续文档内容写入 03？ | 不写完整配置值、测试计划、验收签署、phase/commit 排期、部署拓扑或运行报告；只写 03 需要的 implementation contract 和 minimum test cuts。 |
| 是否给 07 足够输入？ | 第 16 章提供字段、DTO、Query、状态、side-effect、metadata/idempotency、projection 和 boundary pre-audit 输入；07 仍需逐 boundary 重做最终审计。 |

## 2. 正式文档写入纪律

### 2.1 替换策略

1. 记录旧正式 `03-详细设计.md` 为 historical material，不从旧文件复制正文。
2. 删除旧文件。
3. 先写新文档元信息、18 章骨架和章节来源入口。
4. 按 100~300 行写入批次，依次回填章节 1~18。
5. 每个批次做局部来源/命名/边界审计，最后做全链审计。

### 2.2 正式章节来源规则

每章正文开头必须列出具体 `design-calibration/...` 文件；不能只写“见校准材料”。延伸阅读至少指向该文件的“结构化中间产物”“回填草稿”“待确认事项”或等价明确小节。正式文档结论不得新增未出现在 Step 1~18、正式 00/01/02 或用户确认中的 schema/owner/state/product。

### 2.3 正文与过程边界

| 可进入正式 03 | 必须留在中间产物或后续文档 |
|---|---|
| 收口后的模块、对象、trait、协议、flow、state、Store/UoW、错误、幂等、配置绑定、观测和 minimum test cuts | SOP 问题原答、方案比较过程、批次状态、过程停笔记录、完整测试计划、真实结果、run/evidence/signoff、具体 phase/commit 排期 |
| blocked/unavailable/unknown 的安全语义和 reopen 条件 | 未确认 owner 的 positive provider/schema/route/client/readiness |

## 3. 18 章装配矩阵

| 章 | 正式主题 | 主校准来源 | 必须装配的实现输入 |
|---:|---|---|---|
| 1 | 与上游文档的关系声明 | Step 1、正式 00/01/02 | 真相源优先级、旧材料处理、本文不再回答/必须回答、blocker 边界。 |
| 2 | 本次详细设计目标与范围 | Step 2、正式 00/01/02 | runtime 行动契约层范围、六业务组成部分、七工程模块、非范围和 phase discipline。 |
| 3 | 实现约束与编码规范承接 | Step 3、Step 14、Rust/目录/依赖标准 | Rust 2024/MSRV planned baseline、英文源码/rustdoc、Core-only compile candidate、runtime/event seam、forbidden body、backend neutrality。 |
| 4 | 实现单元与文件布局 | Step 4、Step 5 | planned workspace、七 member/package/crate/binary/file tree、依赖方向、文件职责。 |
| 5 | 模块实现契约 | Step 5~7、R-5~R-7、六业务 annex | 七模块独立 capability/object/trait/adapter/function/error/test sections；41 对象按所属模块闭口；七 Store、七 external Port 和 entry boundary。 |
| 6 | 全局对象/Trait/API 索引 | Step 6~8、R-6~R-8 | 41 objects、stable carriers、Store/Port/adapter、13/11/5/4/4 protocol 到 flow 索引；不新增 schema。 |
| 7 | API/Command/Query/Event/Job 协议 | Step 8、R-8、protocol annexes | shared metadata/ref/page/error、每个 public protocol 的用途/DTO/result/error/idempotency/replay 和 blocked boundary。 |
| 8 | 逐接口函数级处理流 | Step 9、R-9、五类 flow annexes | 37 flow inventory、exact entry/call graph/UoW/phase/state/effect/error/replay/test pointers、Query no-write、Job bounded/no-repair、external call fence。 |
| 9 | 状态机与转换矩阵 | Step 10、六状态族 annexes | 状态主语筛选、六状态族正式 enum、合法/非法迁移、terminal/unknown/late rules、测试回指。 |
| 10 | 数据持久化/事务/一致性 | Step 11、Step 7 stores | 七 logical Store、IdempotencyStore、semantic key/version、UoW ordering、rollback/commit unknown、projection/reference/status isolation。 |
| 11 | 错误/异常/恢复 | Step 12、Step 9/10 | domain/application/port/protocol/job errors、37-flow mapping、retry/manual/blocked/unknown、quarantine/dead-letter boundary。 |
| 12 | 并发/幂等/重入 | Step 13、Step 11/12 | scoped key/digest、CAS、semantic uniqueness、duplicate replay、`L2T-CONC-001~023`、late material and unknown re-entry。 |
| 13 | 配置/外部依赖绑定 | Step 14、Step 3/7 | typed candidates、builder order、seven Store/UoW/technical bindings、blocked external adapters、25 config redlines、fallback。 |
| 14 | 可观测性/审计埋点 | Step 15、Step 6~14 | body-free logs/metrics/trace、ToolAuditEntry atomic pair、fact/ref/report markers、redaction/low-cardinality/external status fence。 |
| 15 | 测试切口/最小验证清单 | Step 16、Step 5~15 | 七模块切口、37 flow 正反/重放/no-write、六状态、TX/CONC/ERR/CFG/OBS cuts、planned script contract only。 |
| 16 | 到实施计划承接 | Step 17、Step 3/4/6~16 | preread、authority、field/DTO/query/state/side-effect closure、07 boundary audit inputs、禁止实现者选边。 |
| 17 | 风险/待确认 | Step 18、正式 00 §15 | `L2T-DDD-R01~R08`、`L2T-UP-001~009`、`L2T-DDD-Q01~Q06`、safe defaults/reopen。 |
| 18 | 参考 | Step 1~19、standards、正式上游 | 具体文档路径和用途；不写外部未核实资料或伪造证据。 |

## 4. 第 5 章模块装配计划

正式 §5 必须按以下顺序写入，单模块小节固定包含：职责、文件映射、capability/object mapping、对象契约入口、trait/Port/adapter、关键函数、错误、测试切口。

| 模块 | 文件组 | 主要对象/载体 | 主要协议/flow | 禁止边界 |
|---|---|---|---|---|
| `contracts` | `refs.rs`, `metadata.rs`, `commands.rs`, `queries.rs`, `consumers.rs`, `events.rs`, `jobs.rs`, `views.rs`, `errors.rs` | typed refs、metadata、DTO、views、receipts、reports、ProtocolError | 全部 public surface | 不含 domain invariant、raw body、transport/backend type。 |
| `domain` | `contract.rs`, `binding.rs`, `invocation.rs`, `precondition.rs`, `handoff.rs`, `outcome.rs`, `safe_handoff.rs`, `integrity.rs`, `shared.rs`, `policies.rs`, `errors.rs` | 41 truth/fact/assessment/state/policy objects | CF domain guards、state transitions、pure mappers | 不依赖 Store/Port/config/clock implementation、Runtime loop、authorization truth。 |
| `application` | `*_service.rs`, `ports.rs`, `unit_of_work.rs`, `idempotency.rs`, `errors.rs`, `mapping.rs` | service facades、seven Stores、external Ports、UoW、stored replay carriers | 37 flow orchestration | 不依赖 concrete DB/HTTP/broker/SDK；不新增第二 truth。 |
| `infra` | `config.rs`, `runtime_builder.rs`, `repositories.rs`, `projection_store.rs`, `idempotency_store.rs`, `reference_store.rs`, `source_resolvers.rs`, `publishers.rs`, `handoff_adapters.rs`, `clock_id.rs`, `fakes.rs`, `errors.rs` | adapters、durable/fake stores、availability、builder | Store/Port implementations, config binding | 不裁决业务 allow/deny、不伪造 provider readiness、不隐藏 transaction。 |
| `api` | `command_handlers.rs`, `query_handlers.rs`, `routes.rs`, `errors.rs`, `bin/tools_api.rs` | handler/mapper/entry carriers | CF/QF sync entry | 不直写 Store、不调用 external Port、不固定 HTTP/RPC。 |
| `worker` | `consumers.rs`, `collaboration_worker.rs`, `projection_worker.rs`, `errors.rs`, `bin/tools_worker.rs` | envelope/claim/receipt/continuation runner | IF/OF/JF-03 maintenance entry | 不直接改 core truth、不拥有 Bus delivery/Sandbox run/Observation store。 |
| `jobs` | `job_entry.rs`, `binding_consistency.rs`, `reference_integrity.rs`, `derived_views.rs`, `external_status.rs`, `errors.rs`, action binaries | Job input/target/report mapping | JF-01~04 | 不修 Contract/Binding/Invocation/Outcome/Audit，不制造 scheduler/run/evidence。 |

正式 §5 的每个对象详细字段和函数签名由对应 Step 6/7 annex 承接；正文必须明确精确来源，不得把上表当作字段全集。

## 5. 全链审计矩阵

| 审计项 | 检查方法 | 通过条件 |
|---|---|---|
| Source traceability | 每章检查具体来源路径和延伸阅读 | 无“前文/见校准”模糊引用。 |
| Object closure | 41 对象按 `6/6/5/6/10/8` 与 Step 6/R-6 对照 | 每对象有唯一 owner、字段/factory/state/function 来源。 |
| Support carriers | 检查 ref-set/summary/status/marker/receipt/report | 当前实现边界所用二级类型有唯一 Rust-facing owner/shape。 |
| DTO construction | 逐 `13/11/5/4/4` 对照 Step 8/9 | 每个必填字段来自 metadata/body/lookup/Port/derived/system；缺失行为明确。 |
| Callable closure | flow 伪代码与 Step 7 method ledger 对照 | 不存在未定义 repository/Port/private finder。 |
| Flow closure | 37 flow inventory 对照 | exact entry、UoW/phase、state/effect、error/replay/test 都可回指。 |
| State closure | 六状态族与 Step 16 对照 | 合法/非法/terminal/unknown/late 同名且 owner 唯一。 |
| Store/UoW | Step 7/11/13 对照 | seven Stores、IdempotencyStore、CAS、semantic key、rollback/unknown 一致。 |
| Error/recovery | Step 12 flow matrix 对照 | protocol mapping、retry/manual owner、blocked/unknown no blind retry。 |
| Query boundary | Step 9/13/15/16 对照 | Query no-write/no-refresh/no-Port/no-repair。 |
| Job boundary | Step 9/10/15/16 对照 | bounded target/report；不修 core truth、不造 run/evidence。 |
| External boundary | blockers matrix 对照 | UP-001~009 仍 open；无 positive readiness wording。 |
| Config boundary | Step 14 redlines 对照 | config 只影响 composition/entries/jobs/projections，不改变 truth semantics。 |
| Telemetry/redaction | Step 15/16 对照 | body-free, low-cardinality, atomic audit pair, no forbidden field。 |
| Phase input | Step 17 §6.7 对照 | 03 不预写 phase/commit；后续 07 有逐-boundary 审计输入。 |
| Historical purge | 旧文档关键词扫描 | 不残留旧 registry/policy/executor/MCP/固定 backend/旧状态或测试结果。 |

## 6. 装配修正与明确不写项

| 项目 | 正式 03 口径 |
|---|---|
| Protocol count | 统一为 13 Command、11 Query、5 Consumer、4 outbound Event、4 Job；不得引入旧草稿数量。 |
| Replay carrier | `StoredCommandResult` + `StoredCommandValue`；Consumer 用 `ConsumerReceipt`，Job 用 `JobReport`。 |
| Job field | `JobReport.job: ToolJobName`；不保留 `job_kind: ToolJobKind` 第二字段。 |
| Attempt split | `ExecutionHandoffAttempt` 与 `ExternalSubmissionAttempt` 分离；不合并 delivery/observation lifecycle。 |
| Audit split | `ToolAuditEntry` 是 outcome audit pair，不是 runtime log、Bus history、Observability store 或 acceptance evidence。 |
| External status | `BusDeliveryStatusRef` / `ObservationMaterialRef` 只表达 typed ref/status/unknown/blocked，不升级 local attempt。 |
| Upstream blockers | `L2T-UP-001~009` 仍 open，正文只写 blocked/unavailable/unknown/fail-closed。 |
| Not in 03 | 完整 04 配置值、05 TC/fixture/CI、06 signoff/veto evidence、07 phase/commit/ledger、代码/test output。 |

## 7. 分批写入计划

| 批次 | 章节 | 预计产物 | 批后检查 |
|---:|---|---|---|
| 19.1 | 元信息、§1~§4 | 上游声明、范围、约束、布局和来源入口 | 旧技术栈/路径/协议污染扫描。 |
| 19.2 | §5 contracts/domain/application | 七模块前半与 41 对象 owner 映射 | module/object/source/forbidden-boundary audit。 |
| 19.3 | §5 infra/api/worker/jobs、§6 | 七模块后半、trait/store/entry/global indices | dependency/callable/index audit。 |
| 19.4 | §7~§8 | protocol inventory、secondary types、37 flow templates and matrices | DTO/flow/error/replay/no-write audit。 |
| 19.5 | §9~§12 | state、persistence、errors、concurrency | transition/UoW/CAS/digest/unknown audit。 |
| 19.6 | §13~§15 | config、observability、test cuts | blocker/redaction/test boundary audit。 |
| 19.7 | §16~§18 | handoff、risks、references、self-check | full-chain audit and stop review. |

## 8. 正式文档最小可落码标准

正式 03 不能只列“服务负责处理”或“调用仓库”。至少必须让实现者在对应来源中找到：

- planned path、crate、module、file owner；
- public struct/enum/newtype、field/variant、来源和禁止替代；
- application-owned trait/Port/Store 的 exact method 和 error surface；
- DTO -> domain object 的字段构造、missing/blocked/conflict 处理；
- 每条 flow 的 entry、call order、UoW/phase、state/effect、error/replay/test；
- Query view/page/freshness/visibility/no-write；
- state transition 和 illegal transition；
- semantic key、expected version、commit unknown、side-effect unknown；
- config binding、adapter availability 和 redaction/forbidden fields；
- 后续 07 必须使用的 boundary audit inputs。

若正式章节摘要和来源 annex 不足以完成上述任一项，正式文档必须明确“继续阅读的精确来源”，不能用摘要替代，也不能把缺口留给实现者。

## 9. Step 19 自检清单

| 检查项 | 状态 |
|---|---|
| 历史正式 03 内容被 full-restart 正文替换 | pass |
| 18 章主链完整 | pass |
| 每章具体校准来源 | pass |
| §5 以七模块为主轴 | pass |
| 41 对象与 stable carriers 有 owner/来源 | pass |
| `13/11/5/4/4` protocol inventory 一致 | pass |
| 37 flow、六状态族、七 Store/七 external Port 可回指 | pass |
| Query no-write、Job no-truth-repair、external fence | pass |
| error/recovery/idempotency/unknown/late material | pass |
| config/redaction/forbidden-field | pass |
| `L2T-UP-001~009` 未被写成 resolved/readiness | pass |
| 未写真实实现/test/evidence/commit/phase | pass |
| Step 17/18 已回填 §16/§17 | pass |
| 07 boundary audit inputs 已提供 | pass |

## 10. Stop review 预期与进入条件

Step 19 完成结论：正式 03 已从历史正文整体重建，18 章、来源、对象/协议/flow/state/store/test/phase boundary 全链审计通过；没有新增 blocker。正式文档状态为 `completed / pass; stop review`，本流程停止，不进入 04。

```text
step_status = completed
gate_status = pass; stop review
gate_reason = formal 03 was rebuilt from historical material and passed the full source/schema/callable/flow/state/store/test/phase-boundary audit; no new upstream blocker was found
next_allowed_action = wait_for_user_review_before_04
formal_03_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
