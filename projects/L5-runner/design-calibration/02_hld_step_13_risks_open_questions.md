# Step 13. 设计风险与待确认事项

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 13 / 设计风险与待确认事项 |
| 状态 | `completed` |
| 当前模块 | `risks_open_questions:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 会影响概要成立与 03 展开的设计风险、需要权威来源回答的待确认事项已分离；每项均有影响范围、当前保守口径、owner/source 与进入 03 的限制，无 backlog/TODO 混入。 |
| next_allowed_action | `read_and_start_step_14` |
| 正式正文写入 | `allowed_in_step_14_only` |

### 1.1 Step 内计划

- [x] 恢复台账、02 flow、Step 12，读取概要 SOP Step 13 与书写规范 §4.13。
- [x] 从 Step 1～12 提取仍影响概要成立性的风险，不复制普通任务或稳定承接项。
- [x] 将已知风险与尚无定论的待确认问题分表表达。
- [x] 为每个待确认问题指定权威来源、影响的对象/接口/流程/状态/配置及挂起口径。
- [x] 审计 `RUN-UP-001~008` 未被本地关闭，技术和实现事实未被伪造。
- [x] 形成正式回填草稿并同步 flow / 项目台账。

## 2. 风险与待确认的区分口径

- 设计风险：已经识别到触发条件与结构影响，且即使采用当前保守设计仍会造成能力受限、复杂度上升或未来回退；必须保留当前处理口径。
- 待确认事项：某个 exact contract、技术/仓库事实、数值 authority 或产品范围尚无正式定论；必须由明确 owner/source 回答。在确认前使用 blocked/not-ready/unknown/conditional，而不是猜测。
- 已经稳定交给 03 的字段、签名、事务、错误、测试 seam 不是待确认；它们是下一层正常展开内容。
- “实现”“写测试”“优化性能”“补文档”等任务、排期和 backlog 不进入本 Step。

## 3. 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Artifact/Governance consumption contract 尚未闭合会使选择、取得和 qualification 正向主线长期 blocked（`RUN-UP-001/002`） | `ReleaseSelection`、`IntegrityPosture`、`MaterialSourcePort`、authority queries、Acquire Job 与 RequestRun gate | 保留 exact immutable selection、required ports 与 blocked/stale/invalidated 路径；不本地批准、不自选 manifest/policy/算法。 |
| Sandbox/Runtime Runner-facing contract 未闭合会使 request/control/execution/cleanup/reconcile 无法形成真实正向集成（`RUN-UP-003/004/007`） | `RunIntent`、`ControlIntent`、`OwnerRunProjection`、ProtectionGuard/RecoveryCase、Sandbox/Runtime adapters | 只收稳 intent、多轴 owner projection 与 unknown/reconcile；accepted 不推 running，stop 不推 cleanup，不接私有 backend。 |
| Observability handoff/diagnostic contract 未闭合会使安全预览和交接只有本地负向闭环（`RUN-UP-005`） | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture`、redaction/diagnostic/handoff ports、retention guard | 仅保存 bounded/redacted safe refs/summary；交接保持 blocked/not-ready，receipt 非 evidence。 |
| L0-sdk exact client/error/redaction/trace surface 未完全核验，required port 可能与未来正式 surface 不一一对应（`RUN-UP-008`） | 所有 owner adapters、error model、ActorContext/metadata/trace、consumer readiness | Required ports 作为 Runner semantic boundary；03 先核验真实 SDK，再做 adapter mapping；不让 SDK DTO 反向成为 domain model。 |
| 多 owner 最终一致与事件/query gap 会造成 stale/unknown/conflict 窗口 | `OwnerRunProjection`、selection authority、handoff posture、Refresh/Reconcile Jobs、RunnerReadModel | 所有 projection 保留 source/version/freshness/visibility；gap 触发 stale/query reconcile，不按最后到达或本地时间乐观覆盖。 |
| 外部副作用与本地事务无法原子提交，两个 crash window 会造成重复副作用风险 | run/control/cleanup/handoff commands、operation persistence、RecoveryCase | 外部调用前持久化 intent/basis；ambiguous 结果=unknown；query-first outcome reconcile，禁止自动 replay。03 必须细化 crash-safe operation contract。 |
| 材料 bytes、metadata、integrity、protection 与释放跨多个本地承载，崩溃可能造成 orphan/stale/误删风险 | acquisition/cache/verifier/store、ProtectionGuard、eviction/cleanup/recovery | quarantine-first、short transaction、binding recheck、missing protection→unknown；safe release 后才标 evicted。03 必须定义 metadata/bytes reconciliation。 |
| 跨平台 port/path/disk/process/capability 观察差异可能被误写成 allocation/lease truth | `PlatformResourcePort`、`ResourceObservation`、preflight/cleanup UX | local observation 与 owner view 双视图；unsupported/permission/freshness=unknown；禁止自动抢占与固定旧平台数字。 |
| Store/clock/connectivity 故障可能破坏 intent 原子保存和 freshness 判定 | `RunnerStateStorePort`、`ClockConnectivityPort`、所有 Command/Job、RecoveryCase | 不能原子保存 intent/basis 时禁止新副作用；clock jump/suspend 将 freshness 置 stale/unknown；重连只触发只读恢复。 |
| 多轴状态与 section-level read model 增加实现和 UX 复杂度，易被重新压成单一 status | 17 个对象、状态机、逻辑页面/CLI、验收映射 | 03 必须以 typed axes、source attribution、transition tests 与 presenter mapping 保持独立；任何合并需回退 Step 6/9。 |
| 配置/provider 灵活性可能成为绕过安全门禁或依赖方向的后门 | composition root、adapters/jobs/store、ConfigValidator、SDK/private backend boundary | Domain 不读配置；显式版本、authority、integrity、no-replay、guard、redaction、evidence、SDK-first 和 transaction invariants 不可配置。 |
| 本地 diagnosis/telemetry 与正式 audit/evidence 概念相近，存在语义升级风险 | diagnostic types、logging/telemetry、handoff view、05/06 证据设计 | 类型/字段/文案显式 non-authoritative；不保存 raw body；不得生成 evidence/report/verdict/signoff 或用 receipt/日志验收。 |
| Planned event consumers 可能被误认为当前可用，或以 generic topic/payload 提前实现 | 四个 Consumers、dedup/order/gap store、L0-bus/L0-sdk boundary | 当前全部 planned/blocked；只有正式 owner event seam 闭合才启用，否则使用显式 query/refresh/reconcile。 |
| 真实 implementation repository、语言/runtime/GUI/process/store 未确认，03 Step 4 可能无法形成真实文件布局 | 03 技术约束、模块/文件布局、dependencies、persistence/config/test architecture | 03 必须查真实 sibling repo 与标准；不能猜 repo/crate/path。证据不足时 Step 3/4 保持 blocker/抽象实现单元，而不伪造路径。 |
| 旧 README/旧 02/03/draft 中技术、数字和 queue/retry/replay 主线可能污染后续细化 | 技术选择、模块名、状态、异常、性能/配置 | 全部保持 historical_material；每步独立推导后做冲突扫描，不自动继承 Tauri/Rust/Docker/gVisor/Firecracker/数字。 |
| 外围批量预取、多运行比较、Archive 浏览若提前进入核心会放大对象/API/状态并混入未闭合 owner contract | `FR-RUN-014~016`、cache/job/read model、Archive port | 当前只保留 conditional extension boundary；不参与 core success。若要展开需明确需求并回退 00/01/02。 |

## 4. 待确认事项表

| 待确认 | 权威来源 | 影响范围 | 当前挂起口径 |
|---|---|---|---|
| Release consumption object 的 immutable ref、locator、manifest、digest/signature、platform metadata、revoke/expire 与 visibility exact contract | `L1-artifact` 正式合同 + `L0-sdk` public surface | selection/material objects、authority/material ports、acquire/verify flow、state invalidation | `RUN-UP-001/008 blocked`；只定义 required semantics，无 exact DTO/transport/algorithm。 |
| Approved/baselined Release 的 authority chain、Decision/Approval applicability、scope、expiry/revoke/conflict precedence | `L1-governance` + Artifact integration authority | `ReleaseSelection.current`、qualification、RequestRun gate、selection queries | `RUN-UP-002 blocked`；不可验证即 blocked/stale/invalidated，Runner 不解释 policy。 |
| RunnerContext 所需 actor/session/project/scope safe view 由哪一正式 client/surface 提供，Project/Workspace visibility 如何组合 | `L1-work`、`L1-workspace`、`L0-sdk` | `RunnerContextRef`、context query、entry availability、visibility | 只保存 safe refs；缺失/restricted 时禁 command，不推断 ProjectMember/项目状态。 |
| Sandbox Runner-facing request/control/status/lease/cleanup/reconcile DTO、idempotency、expected basis、receipt/error 和 orphan/reaper 语义 | `L4-sandbox` + `L0-sdk` | `SandboxRunPort`、Run/ControlIntent、ProtectionGuard、RecoveryCase、cleanup | `RUN-UP-003/007/008 blocked`；accepted≠running，unknown no-replay，private backend 禁止。 |
| Runtime 的端侧安全 status/result/recovery read view、RuntimeRunRef、source ordering 和 visibility | `L2-runtime` + `L0-sdk` | `RuntimeStatusReadPort`、OwnerRunProjection、preview/diagnosis、reconcile | `RUN-UP-004/008 blocked`；无正式 ref/view 就 unknown/unavailable，不从本地推断。 |
| Observability safe diagnostic/output DTO、redaction responsibility、handoff/receipt、visibility/freshness/retention 与 evidence boundary | `L4-observability` + `L0-sdk` | Diagnostic/Redaction/Handoff ports、OutputPreview、FailureDiagnosis、HandoffPosture/guard | `RUN-UP-005/008 blocked`；只保留本地 safe summary/ref 与 blocked handoff，非 evidence。 |
| Archive safe reference/restore view 对 Runner 的正式可见范围、与 retention/handoff 的关系 | `L4-archive` + `L0-sdk` | peripheral Archive port、diagnosis context、read model、protection inputs | `RUN-UP-006/008 blocked/peripheral`；不进入 run/cleanup success，也不拉 bundle。 |
| Host port/path/disk/process probe 与 Sandbox allocation/lease/cleanup 在 Windows/macOS/Linux 等平台的责任划分和 capability taxonomy | Sandbox/platform owners + approved cross-platform authority | `PlatformResourcePort`、ResourceObservation、preflight、cleanup、cross-platform UX/tests | `RUN-UP-007`；只定义 observation/unknown/conflict，不固定命令、端口策略或覆盖声明。 |
| 真实 `L0-core` / `L0-sdk` package/version、ActorContext、CommandMetadata、Error/Trace/Redaction shared types 与依赖方式 | `L0-sdk`/`L0-core` 正式文档 + 真实 manifest/repo | 03 dependencies、shared vocabulary、all adapters/errors/tracing | `RUN-UP-008 pending`；不写 crate/package/path dependency 直到核验。 |
| 四类 owner changes 是否存在正式 event seam；若有，其 envelope/id/source version/order/gap/dedup/cursor 合同 | 各 owner + `L0-sdk` / approved event seam | planned Consumers、Refresh/Reconcile、local dedup store、state propagation | 无合同则 Consumer 保持 disabled/blocked，以 query/reconcile 承接；不直连 L0-bus topic/group。 |
| Runner 是否需要任何正式 outbound event 及其消费者/ownership/delivery/evidence 边界 | 需求/架构 + 明确消费者合同 | Step 7～9、outbox/persistence、dependency graph | 当前结论为无；不得在 03 自行增加。若答案改变必须回退 00/01/02。 |
| 真实 implementation repository 是否存在、代码语言/runtime/toolchain 与 workspace/manifest 约束 | `/home/aris/Projects` 真实仓、repository standards、用户/架构 authority | 03 Step 3/4 的语言、依赖、模块/file layout 与验证命令 | 进入 03 后只读核验；无真实仓/authority 则保持未定/blocked，不伪造 repo 或 crate。 |
| GUI/CLI/product entry 的首期载体、桌面壳、进程模型、后台 worker 生命周期与跨平台 packaging | 产品/架构 authority + 真实实现约束 | presentation/inbound、operations、connectivity/restart recovery、config | 保持逻辑入口与 shared facade；不继承 Tauri/Electron 或单/多进程假设。 |
| 本地 state store、material cache、file atomicity、migration/locking/corruption recovery 的技术能力 | 真实 repo/platform constraints + 03 technical decision | repositories/UoW、crash windows、cache promotion/release、startup recovery | 先定义 ports与 required guarantees；不锁 SQLite/embedded DB/filesystem layout。 |
| Integrity verifier、download transport、redaction、clock/connectivity 与 platform probe provider 的选择和进程/线程边界 | Owner contract + platform/security authority + 03 technical decision | adapters/jobs/resource budget/config/test seam | 只定义 provider-neutral port；不从 README 或 Sandbox backend 推导。 |
| Workload、cache/preview/resource budgets、concurrency、timeouts、freshness、retention、sampling、P95/P99 的权威数值 | 产品 workload、owner limits、安全 policy、未来性能/容量测试 authority | 03 bounded types、04 config、05 tests、06 acceptance | 当前只写 bounded/configurable/validated；不复用历史数字或声明 SLA。 |
| 配置 source/format/precedence、reload/restart boundary、secret provider 与变更兼容策略 | 03 技术选择与安全/部署 authority | ConfigLoader/Validator/runtime builder、04 配置设计 | 当前只定 typed validated snapshot/no domain read；不假定热更新或格式。 |
| local operation/history/telemetry 的 retention 与是否需要 formal audit handoff | Observability/security/data-governance authority | local persistence、redaction、diagnostic handoff、04/05/06 | 默认 non-audit、bounded/redacted；不能作为 evidence，未有 retention authority 不写数值。 |
| 外围 `FR-RUN-014~016` 是否进入首期，以及若进入的精确用户/owner 合同 | 产品需求与相邻 owner | batch prefetch/multi-run comparison/archive browsing objects/APIs/pages/states | 当前不展开；保持 conditional extension，不影响 core。 |

## 5. 风险到 03 进入条件的影响

| 类别 | 是否阻止建立 03 calibration flow | 允许的 03 展开 | 禁止的 03 结论 |
|---|---:|---|---|
| `RUN-UP-001~008` exact owner contracts | 否 | Runner-side required types/ports、blocked adapters、negative paths、local transaction/state/test seams | exact owner API/DTO/event ready、正向 integration/test passed。 |
| 真实 repo/语言/runtime/目录未知 | 不阻止 Step 1～3 只读校准；可能限制 Step 4 | 技术决策输入、抽象 implementation units、候选 layout 与 blocker | 猜测 repo/crate/file path、声称编译验证。 |
| GUI/process/store/provider 未定 | 否，若保持技术中立 | ports、required guarantees、decision criteria、planned implementation units | 从 README 自动选择产品或写 provider-specific implementation。 |
| workload/数值未知 | 否 | bounded types、config contract、measurement/test seam | 固定 timeout/capacity/concurrency/SLA。 |
| event/outbound event 未定 | 否 | planned inbound skeleton + query fallback；outbound not applicable | generic topic/payload/outbox implementation。 |

这些风险不阻止按用户授权进入 03 Step 1～4，但会限制 Step 3 技术结论和 Step 4 文件布局的确定性。若真实来源不足，03 必须显式 `blocked/pending`，而不是用历史材料补齐。

## 6. 已稳定、不得重新包装为待确认的结论

以下内容已经收稳：六个组成部分；17 个关键对象；Command/Query/Job/required port 分类；query no-write；当前无 outbound event；explicit immutable selection；`accepted != running`；多轴状态；unknown no-replay；ProtectionGuard fail-closed；redaction/bounded/source attribution；local diagnosis/receipt 非 evidence；SDK/public API only；domain 不读配置。03 若要改变这些结论必须按 Step 12 回退规则处理，不能将其写成“技术待确认”。

## 7. 历史污染与真实性审计

| 审计项 | 结论 |
|---|---|
| README/旧文档技术选择 | 仍为 historical material，未作为已确认项。 |
| 上游 blocker | `RUN-UP-001~008` 均保留，未由本仓关闭。 |
| 实现仓/语言/crate/path | 未声明存在或确定。 |
| API/event readiness | 未声明；planned/required 与 available 分离。 |
| 数值/SLA | 未引入无 authority 数字。 |
| 测试/证据/签署 | 未伪造 baseline、run_id、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 项目管理内容 | 无 backlog、任务、排期或人员分工。 |

## 8. 回填草稿

正式 §13 使用压缩后的设计风险表和待确认事项表。至少保留：八个上游 blocker、跨 owner 一致性/crash window、material/store/protection、跨平台、配置/证据污染、真实实现仓/技术选择/数值/event/outbound event 的待确认，以及进入 03 时“可设计 required boundary、不可宣称 readiness”的限制。正式正文不把每个问题改写成 TODO。

## 9. 进入下一步条件

- [x] 风险与待确认事项已拆分，均说明对对象、接口、流程、状态、配置或下游的影响。
- [x] 每个风险有当前保守处置，每个待确认问题有权威来源与挂起口径。
- [x] 稳定承接项未被重新包装为待确认，任务/backlog/排期未混入。
- [x] `RUN-UP-001~008`、真实 repo/技术/数值/event 等未闭环事实未被伪造关闭。
- [x] 已说明这些项不阻止 03 Step 1～4 校准，但会限制正向合同、技术结论与文件布局确定性。

结论：`gate_status=pass`，允许进入 Step 14“正式概要设计文档装配”。
