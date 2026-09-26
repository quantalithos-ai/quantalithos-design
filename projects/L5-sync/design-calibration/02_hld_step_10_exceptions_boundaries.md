# Step 10. 异常与边界场景轮廓

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 8~9 的主流程与多轴状态已通过。
- `gate_status=pass_with_upstream_blockers`；本步只点名会改变主线、状态传播或部分协作的异常，不展开错误码、retry 参数、补偿脚本或恢复实现。
- `formal_fill_allowed=step14_only`。

### Step 内计划

1. 回读 Step 8 各流异常分支、Step 9 禁止迁移、正式 00 §10/14 的红线。
2. 按 access、working copy/metadata、source/apply、recovery、handoff/provenance、query/diagnostics 分类。
3. 为每个场景标明主责部分、受影响流/状态和概要姿态。
4. 仅为会改变跨部分协作的异常补一张影响图。
5. 审计 fail-closed、non-overwrite、unknown、no-write、owner/provenance/evidence 边界后更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 8 §8~14 | 各 Command/Query/Consumer/Job 的非正常分支与 effect boundary |
| Step 9 §8~13 | NeedsAction/Restricted/Gap/Partial/Unknown/ProbeRequired/Invalidated 等状态与禁止迁移 |
| Step 3 `HC-SYNC-01~22` | fail-closed、non-overwrite、local atomic、forbidden body、blocker 传播 |
| 正式 00 §10、§13~15 | `BR-SYNC`、NFR、`VETO-SYNC-001~005` 与 `SYNC-UP-001~010` |

## 3. SOP 问题回答

1. **哪些异常必须先点名？** 任何会导致危险副作用、状态轴混淆、local cursor 超前、provenance 断链、blind replay 或 ACK/Decision 升格的场景均必须在 02 点名。
2. **哪些会改写协作？** owner/access/source invalidation 会使 plan/candidate 失效；dirty/path/metadata/source gap 会转 CP4；apply/handoff unknown 会创建 checkpoint/probe；query dependency unavailable 只降级 view，不写状态。
3. **哪些不能留到 03 才发现？** implicit context、owner unavailable、dirty overwrite、metadata corrupt、gap/comparator missing、partial/unknown finalize、handoff timeout、provenance gap、secret/raw body 和 unsupported LFS/shallow/GUI。
4. **概要层讲到什么程度？** 说明 detection input 类别、落在哪个部分、影响哪些对象/状态、是否可自动继续和安全下一动作类别；不列完整错误 taxonomy。
5. **哪些留 03？** 错误 enum/code、retry/backoff/timeout、锁/transaction/crash recovery、文件隔离与 rollback、CLI exit code、operator runbook 和测试故障注入细节。

## 4. 当前文档问题诊断

旧 02 主要按 transport/network/timeout 讨论任务重试，没有覆盖 implicit context、owner truth、dirty/untracked、metadata/provenance、cursor gap、Git/path 和 Review Gate 边界；其自动重试/重同步倾向与当前 no-blind-replay、non-overwrite 冲突。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 网络/任务错误是主要异常 | owner/local/source/recovery/handoff 多层异常分别归属 |
| 重试/重同步是通用恢复 | local-safe resume、formal probe、manual/blocked 分流 |
| 冲突只指数据版本冲突 | access/posture、metadata、cursor、mapping、dirty/path、apply、handoff 都可形成 typed conflict |
| query 依赖失败可能触发刷新 | query 只降级 view，绝不写/修复/探测 |

## 6. 设计取舍

- 对无法证明安全的异常统一偏向 `blocked/needs-action/unknown/unsupported/manual`，而不是最大化自动完成率。
- Known failure 与 unknown outcome 分开：前者可以明确停止，后者必须 checkpoint + probe/manual；两者不能共用“失败后重试”。
- 异常记录只存安全摘要和 refs；排障需要也不能突破 forbidden-body/secret/provenance 边界。
- Unsupported 能力是正式姿态，不用 silent fallback（例如从增量退化到不安全 full、从 SDK 改 private endpoint、从 GUI 改 arbitrary Git command）。

## 7. 结构化中间产物

### 7.1 Selection & Access 异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-001` | principal/project/version/source/target/operation 任一缺失或含 implicit `latest` | CP1 / Selection、Operation | inbound 拒绝；不创建可执行 operation，不从目录/cache/Git 补值 |
| `EX-SYNC-002` | owner SDK 不可用、timeout、响应不可解释 | CP1 / Evaluation、Snapshot | `Unknown/Unavailable`，mutation blocked；status 只显示 stale/unknown |
| `EX-SYNC-003` | permission denied/revoked 或 action matrix 不支持 | CP1 / Evaluation、Operation | `Denied/Blocked`；不产生 Git/fs/metadata/handoff 副作用 |
| `EX-SYNC-004` | Project archived/dissolved/retired/read-only 姿态不明或变化 | CP1 / Snapshot、Plan、Candidate | fail-closed；未执行 plan/candidate invalidated；不本地恢复项目 |
| `EX-SYNC-005` | selection 与既有 binding/source/target 不一致 | CP1+CP2 / Selection、Binding | needs explicit rebind；不静默采用旧/新任一关系 |

### 7.2 Working Copy & Metadata 异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-006` | target 非空、已绑定其他 source 或身份不明 | CP2 / Binding、Observation | clone/rebind stopped；保留现场，要求显式选择/人工处理 |
| `EX-SYNC-007` | dirty/untracked/conflicted working tree | CP2→CP4 / Observation、Conflict | no overwrite/stash/merge/rebase；创建 typed conflict/needs-action |
| `EX-SYNC-008` | canonical path、symlink、permission、lock 或 root escape 不安全/未知 | CP2→CP4 / Observation、PathChangeSet | blocked/conflict；不 fallback 到更宽权限或不安全路径 |
| `EX-SYNC-009` | Git/fs 工具缺失、版本/能力 unsupported，包括 LFS/shallow | CP2/CP3 / Observation、Plan | `Unsupported/Blocked`；不宣称当前支持，不执行替代任意命令 |
| `EX-SYNC-010` | `.qs-sync` manifest 缺失但 target 已有内容 | CP2 / Manifest、Binding | 不自动初始化/认领；needs-action/rebind review |
| `EX-SYNC-011` | metadata schema 旧、未知或不兼容 | CP2 / Manifest、Binding | NeedsMigration/Unknown；只允许显式 migration 或 read-only protected |
| `EX-SYNC-012` | metadata corruption、dangling refs、generation mismatch | CP2→CP4 / Manifest、Conflict、Checkpoint | Corrupt/Unknown + mutation blocked；scan 不自动 repair/delete |
| `EX-SYNC-013` | provenance root 缺失、digest/parent closure 不可验证 | CP2+CP5 / Manifest、Provenance | IntegrityUnknown/Protected；不得补造或重绑来源链 |
| `EX-SYNC-014` | local UoW commit 冲突或提交 outcome unknown | CP2→CP4 / Operation、Checkpoint | 不报告新 generation/cursor；读取后 reconcile/probe local commit 或 manual |

### 7.3 Source Materialization 异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-015` | Artifact/Workspace source authority/priority ambiguous | CP3 / SourceDelta、Plan | blocked；不本地选择“看起来最新”来源 |
| `EX-SYNC-016` | comparator/cursor/mapping/gap/replay 合同缺失 | CP3 / CursorState、SourceDelta | Unsupported/Unknown；incremental pull 不执行 |
| `EX-SYNC-017` | source gap、out-of-order、continuity proof 不成立 | CP3→CP4 / Cursor、Conflict | Gap + conflict/needs-action；不推进 cursor、不假 full 安全 |
| `EX-SYNC-018` | source 在 resolve/plan/apply 间漂移 | CP3 / Plan、Run | plan Invalidated；重新 resolve/replan，不继续旧 plan |
| `EX-SYNC-019` | mapping collision、rename/delete ambiguity、path overlap | CP3→CP4 / Mapping、PathChangeSet、Conflict | Conflict；等待明确 resolution，不自动选路径/内容 |
| `EX-SYNC-020` | working copy 在 plan 后漂移 | CP3→CP4 / Plan、Observation、Conflict | precondition mismatch；plan invalidated，no apply |
| `EX-SYNC-021` | local apply known partial | CP3→CP4 / Run、Checkpoint | Partial + checkpoint；旧 cursor/mapping 不 finalize，显式 recovery |
| `EX-SYNC-022` | local apply outcome unknown | CP3→CP4 / Run、Checkpoint | OutcomeUnknown；先观察/reconcile，禁止重复 apply/假 rollback |
| `EX-SYNC-023` | apply complete 但 metadata finalize 失败/未知 | CP3+CP2→CP4 / Run、Cursor、Mapping | AppliedPendingFinalize/unknown checkpoint；不得报告 Finalized 或重放 files blindly |

### 7.4 Conflict & Recovery 异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-024` | checkpoint input/generation/fingerprint 已漂移 | CP4 / Checkpoint | Invalidated；不得原地 resume，返回 revalidate/replan/manual |
| `EX-SYNC-025` | manual resolution scope/actor/decision 失效或越界 | CP4 / Resolution、Conflict | Rejected/Superseded；不执行 local action |
| `EX-SYNC-026` | prior external attempt 存在但正式 probe unsupported | CP4 / Checkpoint、Probe | Unsupported/manual；不以 retry 或 remote search 替代 |
| `EX-SYNC-027` | formal probe 返回仍 unknown 或 probe 自身失败 | CP4 / Probe、Attempt | StillUnknown/FailedKnown；原 attempt 仍 unknown，不 blind replay |
| `EX-SYNC-028` | 用户取消时 external effect 可能已发生 | CP4+CP5 / Operation、Checkpoint、Attempt | local Cancelled + external unknown/probe-required 并存；不宣称远端撤销 |

### 7.5 Review Handoff & Provenance 异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-029` | candidate freeze 前 dirty/conflict/access/posture/source drift | CP5 / Candidate | Blocked/Invalidated；不得 prepare attempt |
| `EX-SYNC-030` | frozen candidate 在 call 前/后 local drift | CP5 / Candidate、Attempt | call 前 invalidated/no call；call 后 attempt history 保留，新变化需新 candidate |
| `EX-SYNC-031` | handoff known rejection/validation failure | CP5 / Attempt | FailedKnown/typed transport or owner state；不自动改 files/retry |
| `EX-SYNC-032` | handoff timeout/lost response | CP5→CP4 / Attempt、Checkpoint、Probe | OutcomeUnknown→ProbeRequired；禁止 blind resubmit |
| `EX-SYNC-033` | 仅收到 ACK/HTTP 200/remote object | CP5 / Attempt、LayeredStatus | TransportKnown；external Decision remains absent/pending/unknown |
| `EX-SYNC-034` | decision ref 不可见、stale、unmatched 或 event ambiguous | CP5 / Snapshot、LayeredStatus | Restricted/Stale/Unknown；不创建伪 attempt/Decision |
| `EX-SYNC-035` | provenance write/integrity failure during handoff | CP5→CP4 / Provenance、Attempt | handoff local result不能宣称完整；保护 attempt/ref，进入 needs-action |

### 7.6 Query、Diagnostics 与边界支持异常

| ID | 场景 | 主责部分 / 受影响对象 | 当前概要口径 |
|---|---|---|---|
| `EX-SYNC-036` | status 某 slice/repository/Git observation unavailable | CP5 read surface / StatusView | PartialRead/UnavailableRead + degraded reasons；不 refresh/repair |
| `EX-SYNC-037` | 缺失记录被误当 empty/clean/no conflict | 全部 read surface | 明确 Missing/Unknown/NotInitialized；禁止默认成功 |
| `EX-SYNC-038` | diagnostic/telemetry adapter unavailable | CP5 / diagnostic view | 业务状态不变；仅 diagnostics unavailable，不能阻断已知 local safety result或伪造 evidence |
| `EX-SYNC-039` | adapter result 含 credential/raw body/output/evidence/report body | adapter boundary / all objects | redaction/reject/quarantine；正文不入 metadata/status/log |
| `EX-SYNC-040` | GUI/Tauri/LFS/shallow/daemon capability 被请求但无支持合同 | inbound/adapter boundary | `Unsupported`；不切旁路实现、不弱化核心门禁 |

### 7.7 异常影响图

```text
Explicit input / owner / local / source / handoff anomaly
                         │
                         ▼
Owning part classifies typed result
     ┌───────────────────┼────────────────────┐
     ▼                   ▼                    ▼
Known safe failure    Conflict / drift    Outcome unknown
     │                   │                    │
     ▼                   ▼                    ▼
stop + preserve       invalidate plan /     durable checkpoint
known history         candidate + manual     + formal probe
                         │                    │
                         └─────────┬──────────┘
                                   ▼
                          blocked / needs-action
                                   │
                         explicit revalidate / replan /
                         resume / probe / manual only
```

关键说明：

- 所有异常先由拥有该状态的部分分类；CP4 负责恢复语义，不吞并其他部分 truth。
- Known failure、conflict 与 unknown outcome 是不同路径，不能统一“重试”。
- 图不表达错误码、retry/backoff 参数、补偿脚本、文件 rollback 或 operator runbook。
- 任何分支都不能产生自动 merge/rebase/push、cursor 超前、ACK 升格或 provenance 删除。

### 7.8 异常边界审计

| 审计项 | 结论 |
|---|---|
| 一票否决覆盖 | `VETO-SYNC-001~005` 均有对应异常停止路径 |
| 五部分覆盖 | CP1~CP5 与跨部分 query/adapter 均有异常场景 |
| known vs unknown | 明确分离；unknown 均 checkpoint/probe/manual |
| local cursor/generation | partial/unknown/commit ambiguity 均不推进/不宣称切换 |
| owner truth | denied/stale/archive/decision 不本地重解释或修复 |
| query no-write | read unavailable 只降级 view，不触发修复 |
| forbidden body | adapter/input/output 边界均拒绝或裁剪敏感正文 |
| historical options | LFS/shallow/GUI/Tauri 均 Unsupported/pending，不 silent fallback |

## 8. 回填草稿

正式 §10 按六类摘录 40 个异常场景、异常影响图与审计摘要。正文保持“场景—主责部分/对象—概要姿态”粒度，错误码、重试参数、补偿和 runbook 全部交 03/05/07。

延伸阅读入口指向本文件各异常分类、“异常影响图”和“异常边界审计”。

## 9. 待确认事项

`SYNC-UP-001~010` 继续决定哪些异常可由正式 adapter 精确分类/探测；在合同未闭合时使用 Unknown/Unsupported/Blocked，而不是新增私有 fallback。LFS、浅克隆、GUI/Tauri 仍为 historical/pending。

## 10. 进入下一步条件

- [x] 40 个会改变主线/状态/协作的异常场景均有主责部分、对象和安全姿态。
- [x] known failure/conflict/unknown、query degradation 和 unsupported 明确分流。
- [x] 异常影响图只表达跨部分路由，未下沉错误码/retry/compensation 实现。
- [x] 一票否决、owner、cursor、provenance、forbidden body 与 historical option 边界无遗漏。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 11。此结论仅为文档静态自检。
