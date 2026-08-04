# L4-observability 07-实施计划 Step 04：实施对象与交付物清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.4
> 文档性质：设计讨论中间产物。本文抽取实施对象和交付物，不重新定义上游 schema、state、protocol 或 truth owner。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 04 / 实施对象与交付物清单` |
| mode | `full-restart` |
| status | `completed_current_step_04` |
| current module | `implementation-objects-and-deliverables` |
| upstream | current Step 01~03；current formal `03/04/05/06` |
| formal `07` | 未在本 Step 修改，等待 Step 13 装配 |
| design gate | `pass_with_affected_open` |
| implementation handoff | `blocked_until_current_07_completion_and_boundary_audit` |
| new upstream blocker | `none` |
| inherited affected | 12 项保持原状态；positive delivery 不被本 Step 宣称关闭 |
| next allowed action | `continue_to_step_05` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 current `03/04/05/06` 的实施输入 | 来源索引 | done | crate、protocol、state、config、test、acceptance 入口可定位 |
| 按交付面抽取实施对象 | object inventory | done | 不按“完善代码”描述，所有对象有 owner/落点 |
| 抽取测试、脚本、报告和台账资产 | delivery inventory | done | planned 与真实执行资产严格区分 |
| 诊断旧 Step 04/旧正文范围漂移 | historical register | done | 旧协议数量、产品和提交状态不继承 |
| 形成 non-deliverable 和跨仓边界 | boundary register | done | 不把业务 truth 或外部系统实现纳入 P0 |
| 回填草稿、自检和停审 | §4 草稿 | done | 可进入 Step 05 |

## 3. SOP 问题回答

### 3.1 本轮真正交付什么

交付物按“可验证功能增量的承载资产”组织，而不是按所有 domain struct 或文件逐项罗列。每个交付面都必须能回指 current `03` 的 owner、current `05` 的测试切口和 current `06` 的验收门禁。

### 3.2 交付对象总览

| 交付面 | 对象组 | 唯一 owner / 预计落点 | 主要来源 | 完成判定 |
|---|---|---|---|---|
| workspace | 七个 role crate、workspace manifest、dependency graph | 目标仓根、`crates/<role>` | `03` §4 | 目标仓实际 Cargo metadata 与依赖方向符合设计；未以设计文件代替编译结果 |
| public contracts | refs、metadata、digest、cursor、visibility、availability、degraded、error、DTO、page、event/job wrapper | `crates/contracts/src/`；共享类型来自 `core-contracts` | `03` §5~§7 | 60 exact protocol 的 request/result/payload/report 可构造、序列化边界和 owner scan 闭合 |
| domain truth/projection | observation receipt、safety、correlation、safe signal、audit/evidence、handoff、retention/protection、gap/degraded、reference、maintenance、no-write | `crates/domain/src/` | `03` §5~§6、§9~§11、§14 | 27 formal state owner + 1 technical state 的 factory、合法/非法/terminal/reserved 语义与副作用测试闭合 |
| application orchestration | 五类 façade、input assembly、digest/idempotency、UoW、repositories/resolvers/publisher/delivery ports、recovery mapping | `crates/application/src/` | `03` §5.3、§8、§10~§13 | exact flow 可按 accepted/duplicate/reject/delayed/unknown 分支执行；不得让 entry 直连 store |
| infra implementation | typed config、loader/validator、runtime builder、fake/durable store seam、source resolver、publisher、external controlled/disabled adapter、telemetry sink | `crates/infra/src/` | `03` §5.4、§13~§15；`04` | complete-or-error assembly、profile legality、adapter descriptor parity、failure teardown 可验证 |
| synchronous entry | Command/Query route、metadata、request decode、response/error mapping、runtime assignment | `crates/api/src/` | `03` §5.5、§7~§8 | 16 Command + 14 Query exact binding；Query strict zero-write；entry 不持有 application private writer |
| asynchronous entry | inbound envelope validation、Consumer mapping、ack/retry/dead-letter、stored outbox publisher、projection worker | `crates/worker/src/` | `03` §5.6、§7.4~§7.5、§8.4~§8.5 | 9 Consumer 和 publication loop 按 committed local result 与 typed completion 运行；I05 affected 保持 controlled |
| operations entry | 9 one-shot Job binaries、dispatch、report/exit mapping、schedule registrar seam | `crates/jobs/src/` | `03` §5.7、§7.6、§8.6、§12~§13 | J01~J09 均有 exact input/output/duplicate/recovery surface；J06 positive 受 H13 gate |
| persistence | owned mutable state、append-only history、derived projections、reference/idempotency/outbox/job stores、cursor/version/fence | 各 role crate 的 owner 文件与 infra adapters | `03` §10~§12 | accepted write set、transaction order、rollback/commit-unknown probe、same-token/replay 规则可验证 |
| telemetry/audit | log、metric、trace、durable audit、redaction、correlation、recursion guard、retention/evidence/report linkage | domain/application telemetry contract + infra sink/recorder | `03` §14 | safe schema、低基数 label、redaction-before-serialization、no recursive authority loop 可检查 |
| config | root/typed sections、profile matrix、source priority、sensitive refs、activation/rollback/failure register | `crates/infra/src/config.rs` 与 profile fixtures | `04` §3~§13 | `LocalTest`/`IntegrationLike`/`RuntimeLike` 合法性和 13-stage complete-or-error 规则可执行 |
| test assets | 99 TC、82 DS、9 primary suite、6 environment lane、3 runtime profile、状态 corpus | `tests/{contract,domain,service,integration,support}` 与 fixtures | `05` §3~§10 | 每个 exact TC 有唯一 suite/DS/status/linkage；设计期仅为 planned |
| gate/report scripts | 1 gate、1 report、3 safety/static checks | `scripts/gates`、`scripts/reports`、`scripts/checks` | `03` §15.9；`05` §9 | 参数、canonical roots、nonzero/failure preservation 和 same-run provenance 可审查 |
| evidence/report shell | raw artifact、run report、acceptance/review handoff skeleton | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、`reports/review` | `05`、`06` | 只有真实 invocation 产生内容；设计阶段不生成 passed/evidence alias/verdict |
| implementation accounting | project ledger、Boundary Gate Matrix、16 planned boundary ledgers | design repo `design-calibration/` | 台账规范、Step 06/13 | Step 13 一次性创建；只激活一个 current boundary，未来均 `planned/wait_until_current` |

## 4. 代码对象与落点清单

### 4.1 七个 role crate

| crate | 主要文件族 | 实施责任 | 明确排除 |
|---|---|---|---|
| `contracts` | `refs.rs`、`metadata.rs`、`commands.rs`、`queries.rs`、`views.rs`、`events.rs`、`jobs.rs`、`errors.rs` | public typed contract、有限 vocabulary、wire/DTO、body-free carrier | domain transition、repository、UoW、业务 policy |
| `domain` | intake、signal、audit/evidence、handoff、retention/replay、read/diagnostic、gap/degraded、reference、maintenance、policies、history/outbox/errors | observation-owned object/state/policy/record formation | concrete infra、source truth、external body、entry route |
| `application` | service façade、input assembly、ports、unit_of_work、idempotency、digest、external_effects、errors | use-case orchestration、accepted flow、read flow、consumer/job flow、recovery mapping | concrete DB/bus/HTTP SDK、public route parsing |
| `infra` | config、runtime_builder、stores、resolvers、publishers、handoff/export adapters、telemetry hooks、clock/id | port implementation、strict assembly、fake/durable parity、availability | 改写 domain policy、绕过 application、拥有业务 truth |
| `api` | command/query handlers、routes、errors、main | synchronous entry mapping、runtime assignment、response surface | direct store/UoW/domain transition、inline repair |
| `worker` | consumers、outbox_publisher、projection_worker、errors、main | Consumer validation/completion、stored snapshot publication、derived worker dispatch | source truth write、Job orchestration、payload重建 |
| `jobs` | `bin/*.rs`、lib/errors | 9 one-shot Job entry、dispatch、report/exit surface | direct repository/adapter、常驻 Consumer、验收结论 |

### 4.2 协议交付面

| 协议族 | 数量 | 必须交付 | 共同完成判定 | 受影响项 |
|---|---:|---|---|---|
| Command | 16 | exact request/result/error binding、accepted/duplicate/conflict/delayed surface、stored result/outbox relation | 16/16 可由 contracts 构造并由 application flow 映射；accepted set 与 commit set 相等 | UoW、secondary type、external phase |
| Query | 14 | request/selector/page/view/surface/visibility/freshness/absence binding | 14/14 strict zero-write；不触发 refresh/rebuild/reservation | carrier/visibility/freshness/read bundle |
| Inbound Consumer | 9 | envelope/header/schema/producer map/payload family/completion/ack mapping | 9/9 pre-parse validation与typed outcome；I05 positive 仅在 owner closure 后启用 | I05 schema/binding、consumer outbox/completion |
| Outbound Event | 12 | committed snapshot、schema、payload digest、binding、cursor、publication marker | 12/12 stored immutable snapshot；publisher不重建 current truth | producer binding、external phase/retry |
| Operations Job | 9 | immutable plan、claim/fence、item outcome、report/result、resume/duplicate mapping | 9/9 facade-only entry；J06 positive 保持 Blocked/manual 控制面 | H13、report ref、secondary type |

## 5. 状态、持久化与横切对象交付面

### 5.1 状态 owner 交付

27 个 formal state owner 和 `ObservationJobPlanItemState` 技术协调状态必须按 current `03` 的 owner、variant、transition、副作用和 reserved/forbidden 规则落地。实施计划不复制完整转换矩阵，但每个 phase 必须指出所消费的状态族：

| 状态族 | owner 数量 | 交付阶段关注面 | 不得做的事 |
|---|---:|---|---|
| observation truth/safety | 6 | intake、redaction、correlation、safe signal、audit/evidence | 用 telemetry 状态替代 source truth 或跳过 safety gate |
| handoff/retention/gap | 9 | report readiness、authenticity、retention/protection、gap/degraded | 把 Delivered/ReleaseEligible/Resolved 解释为外部验收或 source 修复 |
| read/reference/maintenance | 7 | query surface、snapshot、read model、diagnostic、rebuild progress | Query 生成 identity、刷新或启动 rebuild |
| propagation/idempotency/report | 5 | outbox、reservation、job report、delivery | 用 job report 代替 acceptance report 或重新执行 terminal item |
| technical coordination | 1 | item claim/fence、item outcome fold | 将技术协调状态提升为业务 truth |

### 5.2 持久化交付面

| 交付组 | 必须包含 | 完成判定 | 保护边界 |
|---|---|---|---|
| owned mutable state | current observation-side state、version、state marker | repository/UoW 能按 current owner 读写并拒绝 stale version | 不存业务 source truth 或 raw body |
| append-only history | transition/audit/intake/publication/recovery records | accepted/controlled result 有对应 append record，顺序和 cursor 可复查 | history 不可作为 source truth 回写工具 |
| derived projection | signal rollup、read model、diagnostic、peripheral view、progress | bounded rebuild/replay 只消费已保存 observation material，Fresh 有完整 fence | 不补 source material、不删除 active material |
| technical stores | idempotency、reference、outbox、job plan/item/report、external intent | key/digest/fence/token/replay/commit-unknown 规则闭合 | technical ref 不冒充真实 run/evidence/verdict |

## 6. 测试、配置和证据交付面

| 资产 | 规模/标识 | 预计落点 | 完成判定 | 当前现实 |
|---|---|---|---|---|
| exact test cases | 99 `TC-OBS-*` | suite manifests / test modules | 每项有 primary suite、DS、lane/profile、assertion、planned evidence path | `planned`，未执行 |
| datasets | 82 `DS-OBS-*` | test support fixtures / static corpus | namespace、构造、隔离、清理和 substitute type 明确 | `planned`，未创建真实 run |
| primary suites | 9 `S-OBS-*` | test runner / scripts | required TC 集合、lane/profile、failure semantics 和 report mapping 明确 | `planned` |
| environment lanes | 6 | config/test manifest | lane 与 runtime class、adapter/store/clock/ID 合法组合固定 | target services 未建立 |
| runtime profiles | 3 | typed config fixtures | `LocalTest`、`IntegrationLike`、`RuntimeLike` strict validation | 只有设计合同 |
| scripts/checks | 5 | `scripts/{gates,reports,checks}` | 参数、canonical path、nonzero、failure retention、same-run join | 文件尚未在目标仓创建 |
| raw/report roots | 4 roots | target repo output | raw/report/acceptance/review 分层，禁止 `latest` | 不存在真实 `<run_id>` |

## 7. 非交付物和跨仓边界

| 项 | 分类 | 本轮处理 | 禁止误读 |
|---|---|---|---|
| L1/L2/L3/L4 业务 source truth | non-deliverable | 只消费 safe ref/summary/event/handoff | 不得新增写 port、复制 source body 或补偿写入 |
| raw log/metric/trace/audit/evidence/provider body | forbidden | 只允许 typed safe summary、digest、ref、redaction decision | hash/base64/opaque wrapper 也不能绕过 redaction |
| production DB/bus/APM/dashboard/GRC | external seam | fake/controlled/disabled 或 runtime handoff | 不把历史产品名当实现交付物或 Cargo 依赖 |
| capacity/P95/SLO/retention days | unfrozen | 只保留 candidate/qualitative gate | 不产生硬阈值或通过结论 |
| real evidence alias/verdict/signoff | execution-only | 由真实执行和验收产生 | 设计文件、静态 report、fake 不能生成 |
| 旧 implementation ledger/boundaries | historical | Step 13 重建 current 资产 | 旧 commit/hash/current 状态全部不继承 |

## 8. 交付物到阶段的初步归属

该表只给 Step 05 的输入，不提前定义 commit boundary：

| 交付簇 | 主要阶段候选 | 依赖 | 交付边界提醒 |
|---|---|---|---|
| workspace/config/report skeleton | PH-01 | target repo、core path、目录规范 | 不把 skeleton 当功能完成 |
| contracts/domain carrier | PH-02 | PH-01 naming/dependency | public owner 先于 service |
| intake/redaction/correlation | PH-03 | PH-02 contract/state/UoW | I05 controlled lane单独隔离 |
| audit/evidence/hash/gap | PH-04 | PH-02、PH-03 safe refs | body-free、append-only、visibility |
| signal/projection/query | PH-05 | safe signal/audit/read carrier | Query zero-write、freshness |
| handoff/retention/rebuild | PH-06 | query/evidence/maintenance contract | J06 controlled、no source repair |
| runtime/entry/worker/jobs/gates | PH-07 | all service/port/config contracts | complete-or-error activation |
| release/evidence/acceptance shell | PH-08 | tests/config/runtime reality | no static pass/evidence |

## 9. 当前文档问题诊断与设计取舍

| 问题 | current 处置 |
|---|---|
| 旧 Step 04 只有十个抽象对象，不能指导 phase/boundary | 重建为交付面、协议族、状态/持久化、测试/脚本/台账五层清单 |
| 旧正文把协议数量、crate 数和 AC/VF 编号写成过期值 | 以 current `03/05/06` 的 7 crate、60 protocol、27+1 state、99 TC、82 DS、9 suite、31 AC、24 NFR、10 VF 为准 |
| 交付物和非交付物混在一起 | 增加 non-deliverable、forbidden 和 external seam 表 |
| 真实证据和设计计划混淆 | 所有 test/artifact/report/evidence 资产标为 planned/not_run，不填执行事实 |

设计取舍：采用“交付面 + 功能阶段候选”的组织方式；不采用按 crate 完成、按文件完成或把所有对象列为一个任务。这样后续 phase 可以形成纵切，boundary 可以独立 review、验证和回退，而不改变上游对象 owner。

## 10. 回填草稿

正式 `07` §4 只回填：本轮交付覆盖七个 role crate、60 个 exact protocol、27+1 状态、observation-owned persistence、五类 application façade、strict config/runtime seam、API/worker/jobs entry、log/metric/trace/audit/evidence/retention/report 横切资产，以及 99 TC、82 DS、9 suite、6 lane、3 profile、5 script/check 和台账/报告路径。业务 source truth、raw/secret body、外部产品内部实现、无来源性能阈值、真实 evidence/verdict/signoff 和旧 implementation 状态不属于交付物。

## 11. 待确认事项与 Step 自检

| 检查项 | 结论 |
|---|---|
| 每项交付物是否有类型、owner、落点、来源和完成判定 | pass |
| 是否按功能交付面组织，而非把对象清单当实施顺序 | pass |
| 是否覆盖 code/test/config/script/report/ledger 交付面 | pass |
| 是否明确 non-deliverable、forbidden 和跨仓边界 | pass |
| 是否保留 I05/H13/UoW/recovery/external/consumer/report/secondary-type affected | pass_with_affected_open |
| 是否伪造目标仓、测试、run、artifact、report、evidence 或验收结果 | no |
| new upstream blocker | none |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | `continue_to_step_05` |
