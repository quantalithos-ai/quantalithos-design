# Step 13. 设计风险与待确认事项

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 4~12 已完成。
- `gate_status=pass_with_upstream_blockers`；本步区分“已构成概要设计风险”与“仍待 owner/正式合同确认”，不写 backlog、实施方案或虚假关闭计划。
- `formal_fill_allowed=step14_only`。

### Step 内计划

1. 回读 Step 1 blocker 映射、Step 4~11 审计缺口、Step 12 完成上限。
2. 将本仓内部可预见设计失败面整理为风险，将未有权威结论的外部合同整理为待确认。
3. 为每项标明受影响部分/对象/API/流/状态和当前保守口径。
4. 明确哪些阻断 03 正向合同、哪些只允许负向/blocked skeleton。
5. 审计无任务伪装、无重复交接、无已关闭假象后更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 1 §7.5 | `SYNC-UP-001~010` 对概要层影响 |
| Step 4~9 | 主体、对象、接口、流程、状态中的 blocker 落点 |
| Step 10 | 40 个异常与会放大风险的边界场景 |
| Step 11 | 配置不能绕过的风险边界 |
| Step 12 | 03 正向/blocked 承接上限与回退规则 |
| 项目执行台账 §4 | 当前上游 blocker 权威登记 |

## 3. SOP 问题回答

1. **已构成风险的是什么？** 即使遵循当前结构，若合同/实现处理不当仍可能造成 source authority 分叉、dirty overwrite、cursor 超前、metadata/provenance 断链、unknown blind replay、ACK elevation、query hidden writes、adapter capability leakage 和配置绕门禁。
2. **仍待确认的是什么？** SDK surface、source owner/priority、project posture action matrix、Governance handoff/probe/idempotency、metadata schema、Git/source mapping、incremental contract、tool/entry support 和 manual/path protection exact contract。
3. **影响哪些结构？** 每项在 §7.1/7.2 显式映射五部分、对象/API/flows/states/config/test seams。
4. **不收纳会怎样？** 03 可能用 raw DTO/private endpoint/opaque map/default allow/unsafe Git command 代替正式合同，或把 planned skeleton误写 ready implementation。
5. **哪些不是风险/待确认？** “实现命令”“补测试”“优化性能”“写文档”属于后续工作，不是设计风险；固定技术选型和排期也不在本步。

## 4. 当前文档问题诊断

旧 02 将固定性能、重试、跨端一致性等作为已定设计，没有对 owner/source/Git/Governance/provenance 缺口进行真实阻断。若仅把十项 blocker 重复列为风险，也会混淆“已知失败模式”与“缺少权威合同”。本步因此采用两个清单并给出不同门禁。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 风险与待确认混为历史 TODO | 本地已知风险与外部合同问题分表管理 |
| 固定技术/指标被写成定论 | LFS/shallow/GUI/性能数字继续 pending |
| 上游缺口可能被 03 自行补齐 | 每个待确认项明确正向路径 blocked 与回流 Step |
| “完成 02”可能被误读为 ready | 完成上限明确为文本设计 baseline / formal stop review |

## 6. 设计取舍

- 风险项以“错误实现会破坏什么 + 当前设计如何预防”表达，不给出未经验证的缓解完成声明。
- 待确认项沿用 `SYNC-UP-001~010` 稳定编号，避免创建另一套重复 upstream IDs。
- blocker 可以不阻塞正式 02 文本装配，但会局部阻塞 03 的正向 adapter/flow/schema 定稿及未来实现；不得将“文档可完成”写成“功能可实现”。
- Owner 合同闭合必须回流相关 Step；台账状态由正式证据更新，不以对话推测或 mock 关闭。

## 7. 结构化中间产物

### 7.1 设计风险清单

| ID | 风险 | 影响范围 | 当前处理口径 | 阻断含义 |
|---|---|---|---|---|
| `RISK-SYNC-HLD-001` | owner/source refs 被本地模型复制成第二 truth | CP1/CP3/CP5、ExternalOwnerSnapshot、ports | ref/snapshot + freshness + owner-specific port；forbidden body | 任何 raw owner entity/schema persistence 设计不得通过 |
| `RISK-SYNC-HLD-002` | explicit selection 被 CLI defaults/cache/Git context 稀释 | CP1、全部 P0 Commands | `SyncSelection` immutable + shared gate；missing/implicit rejected | 03 CLI 若引入隐式 project/version/source 必须回退 |
| `RISK-SYNC-HLD-003` | query 为提高“新鲜度”产生 hidden writes | status/inspect/all Get/List | query no-write + explicit refresh Command/job 分离 | 任何 query refresh/repair/probe/persist 设计阻断 |
| `RISK-SYNC-HLD-004` | metadata physical design破坏 generation/provenance closure | CP2、Manifest/UoW/Migrate/Rebind | logical schema、generation-checked transition、protected refs | 未证明 crash/migration/retention 安全前正向 schema 阻断 |
| `RISK-SYNC-HLD-005` | Git/fs adapter 过宽导致 dirty overwrite/path escape/auto Git | CP2/CP3、local ports | inward minimal ports、capability detection、non-overwrite、forbidden commands | arbitrary shell/auto merge/rebase/push/stash 一票否决 |
| `RISK-SYNC-HLD-006` | source/comparator/mapping 不足却推进 cursor | CP3、Cursor/Delta/Plan/Run | no proof no pull；only Finalized advances cursor | comparator/gap 未闭合时增量正向路径阻断 |
| `RISK-SYNC-HLD-007` | local file apply 与 metadata commit crash window 形成双重不一致 | CP2/CP3/CP4、Run/Checkpoint/UoW | Prepared→Applying→PendingFinalize→Finalized，多阶段 checkpoint | 03 未定义 actual adapter crash semantics 前不能声称 atomic apply |
| `RISK-SYNC-HLD-008` | conflict intent 被自动执行或历史被清理 | CP4、Conflict/Resolution/Provenance | intent vs action 分离、explicit Resume、protected history | auto resolution/cleanup 设计阻断 |
| `RISK-SYNC-HLD-009` | unknown outcome 被 timeout/retry config 转成 known failure并重放 | CP4/CP5、Checkpoint/Probe/Attempt | durable-before-effect、ProbeRequired/manual、no blind replay | 无正式 probe/idempotency 时 external retry 阻断 |
| `RISK-SYNC-HLD-010` | handoff ACK/HTTP/remote object/local commit 升格为 Review accepted | CP5、Attempt/LayeredStatus/Status | local/transport/probe/external decision 分层 | 单一 success 或 ACK-as-Decision 一票否决 |
| `RISK-SYNC-HLD-011` | candidate freeze 后 local/source/access drift 未使其失效 | CP1~CP5、Candidate/Observation/Generation | freeze-bound digest/scope/generation + pre-call revalidation | 复用 stale candidate 的 03 设计阻断 |
| `RISK-SYNC-HLD-012` | config/feature flag/fake 将 unsupported 合同包装成 support/readiness | all parts、composition/test | 15 项不可配置化边界、typed Unsupported、fake evidence ceiling | 未有正式合同/真实证据不得启用/宣称 ready |
| `RISK-SYNC-HLD-013` | diagnostic/provenance 为排障吸收 secret/raw body/evidence正文 | CP5 + all adapters | redaction-first、safe summaries、body-free refs | 泄漏或 formal evidence 冒充一票否决 |
| `RISK-SYNC-HLD-014` | 多轴状态在 DTO/UI 中被压成 global success | all states/views | object-qualified states、read completeness 与 business result 分离 | 03 output model 必须保留层次，不能布尔化 |

### 7.2 待确认事项清单

| ID | 待确认合同 | 影响范围 | 当前挂起口径 | 正式关闭后回流 |
|---|---|---|---|---|
| `SYNC-UP-001` | L0-sdk 精确 project/version/source/artifact/workspace/review-handoff surface、errors、compatibility | all owner ports/adapters, consumer contracts | capability-only skeleton；真实 methods/DTO/errors blocked | Step 1/5/7/8/10/12 |
| `SYNC-UP-002` | Artifact/Workspace source authority、watermark、priority/selection | SourceDelta/MaterialSourcePort/clone/pull | owner-neutral explicit source；ambiguous blocked | Step 1/3/5~10/12 |
| `SYNC-UP-003` | ProjectMember permission 与 archived/dissolved/retired allowed-action matrix | CP1 gate、posture invalidation、candidate | unknown/failure fail-closed | Step 1/3/6~10/12 |
| `SYNC-UP-004` | Review Gate handoff、ACK、probe、decision ref semantics | HandoffAttempt/ports/flows/states | candidate may prepare; transport/decision separate | Step 1/5~10/12 |
| `SYNC-UP-005` | external idempotency/equivalence/retry/probe contract | CP4/CP5 recovery | prepare→call→probe/manual; no blind replay | Step 3/6~10/12 |
| `SYNC-UP-006` | `.qs-sync` schema/layout/migration/integrity/recovery/retention | CP2/CP5 persistence/provenance/config | logical metadata only；physical positive path blocked | Step 3~12 affected sections |
| `SYNC-UP-007` | Git remote/platform source/branch/object mapping | CP2/CP3 adapters/mapping | Git local observation only；no remote truth | Step 1/3/5~10/12 |
| `SYNC-UP-008` | incremental cursor/mapping/comparator/gap/replay/version compatibility | CP2/CP3/CP4 | no proof, no pull/no cursor advance | Step 3/5~10/12 |
| `SYNC-UP-009` | Git LFS、shallow clone、GUI/Tauri current support matrix | adapter/entry/config/test | historical/pending; typed Unsupported | Step 2/4/7/10~12 after formal requirements/evidence |
| `SYNC-UP-010` | dirty/untracked/path protection 与 manual conflict decision exact contract | CP2~CP4, local adapters | any uncertainty pause/manual；no auto resolution | Step 3/5~10/12 |

### 7.3 当前设计完成上限与路径门禁

| 路径 | 02 文本设计 | 03 可展开 | 正向实现 readiness |
|---|---|---|---|
| local negative/fail-closed skeleton | 可完成 | 可定义 types/guards/tests | 未授权实现；未来可在设计内 planned |
| status no-write/local view | 可完成 | 可定义 read models/repositories；真实 owner refresh仍分离 | 未证明实现 |
| owner access/source/handoff adapters | capability/port skeleton 可完成 | 仅 blocked adapter contract 和 mapping slots | 被 `SYNC-UP-001~005/008` 阻断 |
| metadata physical persistence/migration | logical topics/state 可完成 | 可定义候选但不能假定 owner/tool facts | 被 `SYNC-UP-006/010` 阻断 |
| Git/fs safe apply | port/flow/state/exception 可完成 | 需 actual tool capability 设计与 negative tests | 被 `SYNC-UP-007/009/010` 阻断 |
| incremental pull | negative/gap semantics 可完成 | comparator contract slot 可定义 | 被 `SYNC-UP-002/008` 阻断 |
| push-review submit/probe | local prepare/layering 可完成 | blocked SDK adapter skeleton | 被 `SYNC-UP-001/004/005` 阻断 |
| LFS/shallow/GUI/Tauri | 只列 Unsupported/pending | 不进入当前 03 正向范围 | 无正式 support/readiness |

正式 02 可以在这些 blocker 下装配并停审，因为其目标是收稳结构和保守失败语义；这不授权进入 03，不表示任何正向 adapter、command、metadata schema 或 integration 已可落码。

### 7.4 风险—约束—验证切口追溯

| 风险组 | 主要约束/结构 | 后续验证切口 |
|---|---|---|
| owner/selection/query | `HC-SYNC-01~04`,`18`,`21`；CP1 + status | missing/stale/denied/owner unavailable/no hidden writes |
| metadata/Git/local safety | `HC-SYNC-05~10`,`15~17`；CP2/CP3 | corrupt/generation/dirty/path/tool/cursor no-advance |
| recovery/unknown | `HC-SYNC-09~12`,`19~21`；CP4 | crash/partial/unknown/probe unsupported/no replay |
| handoff/results | `HC-SYNC-12~14`,`18~21`；CP5 | ACK/timeout/probe/decision layer/candidate drift |
| provenance/config/evidence | `HC-SYNC-15~16`,`20~22`；CP5/Step11 | non-delete/body rejection/hard-gate override/fake ceiling |

### 7.5 未闭环项审计

| 审计项 | 结论 |
|---|---|
| 风险 vs 待确认分离 | pass；14 个已知设计风险与 10 个权威合同问题分开 |
| 与 Step 12 重复 | 无冲突；Step 12 是稳定交接，本步只标风险/门禁 |
| 任务伪装 | 无“实现/补测试/优化/排期”作为风险条目 |
| blocker 状态 | 全部 pending/blocked；无 fake/cache/history 关闭 |
| 完成上限 | formal 02 文本可完成；03/实现/测试/evidence/readiness 未授权未证明 |

## 8. 回填草稿

正式 §13 摘录 14 个设计风险、10 个待确认事项、路径门禁和完成上限。正文保留稳定 IDs 与回流 Step，不能把 `pass_with_upstream_blockers` 润色为 closed/ready。

延伸阅读入口指向本文件的“设计风险清单”“待确认事项清单”“当前设计完成上限与路径门禁”和“风险—约束—验证切口追溯”。

## 9. 待确认事项

本节自身无新增待确认 ID；以 `SYNC-UP-001~010` 为唯一 upstream pending 集合。任何关闭都需要正式 owner contract/证据与受影响 Step 回流审计，并更新项目台账。

## 10. 进入下一步条件

- [x] 设计风险与待确认事项分表表达，ID 稳定、影响和当前口径明确。
- [x] 每项可回指五部分、对象/API/flow/state/config/test seam。
- [x] 路径级完成上限明确，未把正式 02 完成等同 03/实现 readiness。
- [x] 无 backlog、任务、排期、伪造关闭或未经授权外部回写。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 14 正式装配。此结论仅为文档静态自检。
