# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填章节：`07-实施计划.md` §4 实施对象与交付物清单
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 · 抽取实施对象与交付物 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 2 范围、Step 3 前置/阅读矩阵、正式 `03`～`06` |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得写入 |
| 实施移交 | `blocked / wait_design`；以下均为 planned deliverables，不是现有文件或执行结果 |
| 下一动作 | 进入 Step 5 · 设计实施阶段与依赖顺序 |

## 2. 本步输入

| 输入 | 来源 | 抽取结论 |
|---|---|---|
| 十模块与 planned file layout | `03-详细设计.md` §4～§5 | 作为客户端代码职责对象；不把路径当已创建文件 |
| 对象、Port、协议与 flow | `03` §6～§9 | 作为可验证 implementation surface；保持 5 Command/16 Query/1 consumer、0 Event/0 Job |
| state/consistency/error/config/diagnostic | `03` §9～§14 | 作为横切代码/测试交付面；数据库和服务端事务明确 N/A |
| test cuts/data/env/suites/scripts | `05` §3～§14 | 作为 planned test, fake, script, artifact/report 交付面 |
| config contract | `04` §3～§13 | 作为四项配置、三 profile、startup-only builder 交付面 |
| acceptance evidence/VETO/handoff | `06` §3、§10～§14 | 作为 future evidence/review-ready path；不产生真实 evidence/verdict |

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块

目标实现仓（当前不存在）未来承载以下十个职责模块。它们是同一 browser package 的模块边界，不是服务、owner 或独立 truth：

| 模块 | 未来交付责任 | 关键设计输入 | 当前状态 |
|---|---|---|---|
| `entry` | bootstrap、composition root、session shell、host lifecycle/presentation | `ConsoleSessionShell`、entry Ports、startup config | planned/not_created |
| `access` | formal actor/scope/visibility/qualification 的安全呈现与 disclosure ceiling | `AccessContext`、qualification/disclosure guards | planned/not_created |
| `navigation` | route binding、topic visibility、selection/history、敏感选择清理 | `NavigationState`、host route/cleanup Ports | planned/not_created |
| `views` | owner-safe material mapper、source/status axes、safe refs、Query no-write | `OwnerViewSnapshot/Model`、8 Core Query | planned/not_created |
| `intent` | draft/request/result presentation、qualification、controlled submit、reconciliation | 5 Command、unknown/no-replay | planned/not_created |
| `features` | 八个管理主题的 owner partition、activation、page/semantic composition | 8 Topic Query、TopicDescriptor/Model | planned/not_created |
| `recovery` | degradation、subject-specific recovery、focus/announcement/a11y mapping | recovery ceiling、semantic equivalence | planned/not_created |
| `adapters` | official SDK/formal boundary 的窄 adapter、safe mapping、availability/error mapping | owner/query/command/reconcile/invalidation Ports | planned/not_created；positive surface blocked |
| `state` | exact-scope whole-record session carrier、single writer、invalidation marker | `ClientStateCarrierPort`、volatile posture | planned/not_created |
| `diagnostics` | body-free diagnostic context、redaction gate、optional sink isolation | `DiagnosticEmissionPort`、whitelist | planned/not_created |

禁止新增顶层 `api`、`repository`、`projection`、`worker`、`job`、`bff`、`private-bus` 或 owner domain 模块；若未来设计需要改变此清单，必须先回写正式 03。

### 3.2 哪些接口、事件、job 或 adapter 属于交付物

| surface | 计划数量/名称 | 本轮交付口径 |
|---|---|---|
| Command | 5：`RequestAccessContextSwitch`、`SaveClientPreference`、`DiscardDraftIntent`、`SubmitControlledIntent`、`ApplyRecoveryAction` | 实现 local/formal phase 和错误/取消边界；唯一 owner write 仍是 `OwnerCommandPort.submit` |
| Core Query | 8：context、navigation、owner view、source status、safe link、request presentation、reconcile、topic activation | 全部 zero-write；formal safe material 先映射再 filter/window |
| Topic Query | 8：member、project/workspace、method、governance、observability、capability、archive、sandbox | canonical owner partitions；局部失败隔离；正向 owner surface conditional |
| Conditional consumer | 1：`ConsumeSdkInvalidationHint` | 当前 disabled/pending-contract/no-write；不直连 bus、cursor 或 replay |
| Outbound Event | 0 | 不创建 outbox、publisher、event bus 或业务 event |
| Operations Job | 0 | 不创建 worker、scheduler、后台 repair/reconcile job |
| Narrow Port/adapter | 以正式 03 §6.2 和 calibration Step 7 为准 | 只实现已闭口 safe carrier/typed error/blocked posture；不得发明 owner DTO/schema |

### 3.3 未来会新增哪些测试、配置和数据交付面

#### 测试与测试数据

| 交付面 | 未来内容 | 完成判定（planned） |
|---|---|---|
| unit/contract | typed refs、state/error union、config schema、whole-record、redaction | 对应正式 TC 产生同 run raw/report；未执行前保持 planned |
| module/flow | 10 模块、5 Command、16 Query、topic composition、recovery | Query write=0、single-flight、unknown/no-replay、partition isolation 可断言 |
| adapter/integration | narrow Port parity、formal/fake outcome、partial/unavailable/unknown | exact contract 缺失时只验证 blocked/no-call；不造 positive |
| semantic a11y | 三通道同 guard/action/outcome、focus/announce fallback | semantic P0 可验证；具体 browser/AT 仅 authority-selected |
| architecture/security | SDK-only、forbidden structure、5+16+1、0 Event/Job、唯一 owner write、redaction | generated graph/call ledger/scan report 能回指 source |
| data/fakes | deterministic refs、formal-shaped safe fixtures、case-local ledger/scheduler、synthetic leak corpus | 每个 case 隔离；teardown 清理；不含真实 secret/body |

#### 配置、脚本与证据路径

| 交付面 | 未来内容 | 当前边界 |
|---|---|---|
| runtime config | strict whole-document、四项配置、三个既有 profile、startup-only validation | `runtime.profile` required；其余 defaults `[]/false/false`；不增加 key |
| gate/check scripts | gates、architecture、redaction、pairing、no-static checks | 显式 run/profile/root；失败不能 skip-pass |
| report/evidence scripts | run reports、candidate index、acceptance draft | 只从真实 artifact/report 生成；不得写 signoff/readiness |
| artifact/report roots | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` | 禁止 `latest`、跨 run 拼接和项目重复层级 |
| future EV families | 8 个正式 `EV-*-001` family | 当前 instance=0；不能在设计仓创建执行 evidence |

### 3.4 哪些上游对象本轮不交付

| 不交付对象 | 归属/原因 | 处理 |
|---|---|---|
| 成员、项目、流程、治理、artifact/evidence、workspace、method、capability、observability、archive、sandbox domain aggregate | 各正式 owner | 只保留 safe view/ref/activation seam |
| DB/repository/UoW/projection/outbox/BFF/private bus/worker/job | 服务端或禁止结构 | static forbidden；不以 fake 替代其 truth |
| owner exact DTO、scope hierarchy、qualification reason、idempotency/reconciliation schema | owner/SDK contract 未闭口 | boundary blocked；等待 design fix |
| framework/router/bundler/package manager/host concrete binding | 无 authority | framework-neutral planned Ports |
| durable/cross-session state、multi-tab CAS、online LKG | `CON-Q-044` pending | 保持 session-volatile、whole-record、single-writer |
| production diagnostic sink、browser/AT matrix、quantitative/load thresholds | authority 未选择 | selected/P2 residual，不形成当前 P0 pass |
| real run、artifact、report、EV、defect、risk acceptance、verdict、signoff、readiness | 执行/验收阶段事实 | 只交付 future generator/path contract |

### 3.5 跨仓或外部依赖交付物

| 依赖 | 允许交付关系 | 不交付 |
|---|---|---|
| `@quantalithos/sdk` | approved public package import、typed adapter seam、formal-shaped fake | SDK 私有源码、owner sibling package path、未知 `unknown` schema |
| L1～L4 owner | runtime query/command/ref 通过 SDK/formal service；每个 topic 独立 partition | owner domain 复制、数据库 snapshot、private API/bus |
| L0-bus / SDK hint | conditional invalidation Port，默认 disabled | broker client、cursor/replay/store |
| browser host | host lifecycle/route/focus/announcement adapter | 具体框架绑定，除非 authority 到达 |

## 4. 实施对象清单

| 对象族 | 代表对象/Port | 交付责任 | 来源 | 状态 |
|---|---|---|---|---|
| session/access | `ConsoleSessionShell`、`AccessContext`、`QualificationBoundary`、`DisclosureGuard` | safe bootstrap/context/disclosure | `03` §5、§6 | planned |
| navigation | `RouteBinding`、`TopicVisibility`、`NavigationState` | guarded selection/cleanup/history | `03` §5～§9 | planned |
| views | `SafeViewPayload`、`SourceStatusAxes`、`OwnerViewSnapshot/Model`、`SafeLinkReference` | safe mapping/status/query | `03` §5～§8 | planned |
| intent | `DraftIntent`、`RequestPresentation`、`ResultReference`、submission/replay guards | local draft + controlled command | `03` §5、§7～§12 | planned |
| features | `TopicDescriptor`、`TopicActivationState`、`TopicView/PageModel`、8 topic descriptors | canonical owner composition | `03` §5～§8 | planned |
| recovery/a11y | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、semantic bindings | explicit recovery + equivalent channels | `03` §5、§9、§11、§15 | planned |
| adapters | `OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、`SdkInvalidationPort` and formal adapters | SDK/formal boundary mapping | `03` §6/§7/§13 | planned/positive blocked |
| state/diagnostics | `ClientStateRecord`、`InvalidationMarker`、`DiagnosticContext` and sinks | scoped volatile carrier + body-free diagnostics | `03` §10/§14 | planned |
| config | `runtime.profile`、`bindings.adapterBindings`、`invalidation.enableSdkInvalidation`、`diagnostics.enableDiagnostics` | strict startup builder and fail-closed posture | `04` §3～§12 | planned |

## 5. 交付物清单

| 交付物 ID | 类型 | 预计落点 | 来源 | 完成判定（未来） |
|---|---|---|---|---|
| `DEL-CON-CODE-001` | code | target repo `src/entry`、`access`、`navigation`、`views`、`intent` | `03` §4～§9 | package/build authority 固定后，十模块按 boundary 可编译；当前未创建 |
| `DEL-CON-CODE-002` | code | target repo `src/features`、`recovery`、`adapters`、`state`、`diagnostics` | `03` §4～§15 | owner-safe composition、recovery、carrier、diagnostic contracts 可验证；当前未创建 |
| `DEL-CON-CONTRACT-001` | code/contract | target repo public module seams | `03` §6～§8 | 5+16+1 inventory 与 no-write/owner-write inventory 与正式设计一致 |
| `DEL-CON-CONFIG-001` | config | target repo config loader/validator（具体路径 pending） | `04` §3～§13 | 四项 key、三 profile、strict/startup-only、fail-closed/zero-secret 可测试 |
| `DEL-CON-TEST-001` | test | target repo `tests/{unit,contract,flow,accessibility}`（具体 harness pending） | `05` §3～§7 | 96 TC 与 data registry/scheduler/call ledger 有可执行映射；当前未创建 |
| `DEL-CON-TEST-002` | test/tooling | target repo planned suites/gates/checks | `05` §9～§14 | P0 suites、selected posture、失败/不可用/重跑规则可执行；当前未创建 |
| `DEL-CON-DATA-001` | test data | target repo test fixture builders/case-local fakes | `05` §7～§8 | deterministic, isolated, body-free data setup/teardown；当前未创建 |
| `DEL-CON-EVIDENCE-001` | tooling/report | `scripts/reports/*`, `artifacts/test/<run_id>`, `reports/runs/<run_id>` | `05` §13；`06` §10 | 真实 run 才能生成 paired artifact/report/candidate；当前 instance=0 |
| `DEL-CON-GATE-001` | tooling/check | `scripts/gates/*`, `scripts/checks/*` | `05` §9；`06` §4/§11 | VETO/redaction/dependency/pairing/no-static checks 可执行；未执行 |
| `DEL-CON-DOC-001` | design/ledger | design calibration implementation ledger + boundary ledgers | 代码实施台账规范 | Step 6 确认边界后全量 planned skeleton；当前尚未创建 |
| `DEL-CON-HANDOFF-001` | handoff | future `reports/acceptance/` and implementation ledger | `06` §10/§14；台账规范 | fixed baseline/run/review refs 可回指；当前不可移交 |

## 6. 非交付物清单

| 非交付物 | 明确排除原因 | 状态 |
|---|---|---|
| owner domain truth、数据库、服务端 repository/UoW/projection/outbox | 违反 Console ownership/SDK-only | 禁止 |
| Outbound Event、Operations Job、worker、scheduler、BFF/private bus | 正式协议数量为 0/0；不适用或禁止 | 禁止 |
| provider contract、固定 control/metric 数量、旧技术框架 | historical material/无 authority | 排除 |
| 完整 owner body、credential、secret、audit/evidence/report 正文 | forbidden body/owner responsibility | 禁止 |
| production-ready integration、browser/AT compatibility verdict、SLO/readiness | authority/baseline 未固定 | future/blocked |
| 实现仓创建、真实 package/build、测试运行、artifact/report/evidence/verdict/signoff | 本轮只做设计计划 | 未发生 |

## 7. 改动前后对比

| 项 | 改动前 | 收口后 |
|---|---|---|
| 实施对象 | 03 的对象和文件树容易被误当全量任务 | 以十职责模块、正式协议族和横切交付面组织 |
| 测试/证据 | 05/06 路径存在但责任分散 | 明确 fixture、suite、script、artifact/report、future EV 的责任边界 |
| 外部依赖 | 可能误写 sibling source 或 DB 为交付物 | 仅 SDK/formal runtime seam；positive contract 缺失即 blocked |
| 非交付物 | 可能漏掉 Event/Job、owner body、真实 verdict | 明确 0 Event/0 Job 与全部禁止事实 |

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把每个对象/文件作为交付物 | 详尽 | 退化成文件清单，无法支撑 phase 验证 | 不采用 |
| 只列最终页面和截图 | 易读 | 漏掉 Port、state、negative gate、证据真实性 | 不采用 |
| 按模块、协议族、横切门禁和证据交付面抽取 | 可追溯、可由 Step 5/6 组织 | 仍需保留 planned/blocked 事实 | 采用 |

## 9. 回填草稿

正式 `07-实施计划.md` §4 应按代码模块、协议/边界、配置、测试数据、脚本、证据和 handoff 交付面列出 planned deliverables；明确十模块、5 Command、16 Query、1 conditional consumer、0 Event、0 Job 与四项配置。交付物均是未来实现目标，目标仓、脚本、测试、artifact、report、evidence、verdict 和 signoff 当前不存在；owner truth、数据库、服务端单元、私有 bus、完整正文和 production/compatibility 结论明确为非交付物。

## 10. 待确认事项

| 事项 | 影响 | 当前状态 | 处理时点 |
|---|---|---|---|
| package manager/framework/router/bundler/host binding | code/test concrete landing | pending | Step 8/目标仓 authority |
| exact owner/SDK DTO/Port/reconcile | positive adapters and selected tests | blocker | boundary 开工前回写设计 |
| test runner and report generator toolchain | 96 TC and evidence scripts | pending | Step 8/目标仓创建后 |
| all commit boundary names and ownership | ledger skeleton and phase order | pending | Step 5/6 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 代码实施对象按正式 03 抽取 | `pass` | 十模块、协议族、state/diagnostic/config seam 完整 |
| 测试、数据、脚本、证据和 handoff 交付面明确 | `pass` | 责任和真实性边界清楚 |
| 非交付物与 0 Event/0 Job 红线明确 | `pass` | 不引入服务端/owner truth |
| 每个交付物可追溯且不伪造实现事实 | `pass` | planned/not_created 语义保留 |
| 可进入 Step 5 | `pass` | 下一步按可验证增量设计 phase 顺序 |

## 12. Step 自审记录

- [x] 已读取 Step 2/3、正式 03/04/05/06 相关章节和实施计划 Step 4 SOP。
- [x] 已回答代码模块、接口/事件/job、测试、配置/数据、非交付和跨仓依赖问题。
- [x] 已按职责与可验证交付面抽取，而非机械复制所有对象/文件。
- [x] 已明确 5+16+1、0 Event/0 Job、唯一 owner write 和四项配置。
- [x] 未创建目标仓、代码、脚本、测试、artifact/report/evidence 或真实交付事实。
- [x] 已保留 owner/SDK、toolchain、runner 和 boundary blocker，允许进入 Step 5。
