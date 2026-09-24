# Step 10. 异常与边界场景轮廓

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 10 / 异常与边界场景轮廓 |
| 状态 | `completed` |
| 当前模块 | `exceptions_boundaries:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 会改变主处理流、状态机或跨部分协作的异常已按六部分与横切崩溃窗口收稳；每项有明确承接主体和 fail-closed 口径，未下沉为错误码、retry 参数或补偿脚本。 |
| next_allowed_action | `read_and_start_step_11` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复台账、02 flow、Step 9，读取概要 SOP Step 10 与书写规范 §4.10。
- [x] 从 Step 8 事务/unknown 出口、Step 9 禁止迁移和正式验收负向条件发现异常。
- [x] 按六个组成部分逐一固定会改变主线的异常与边界场景。
- [x] 收稳跨部分 crash window、storage/clock/contract 与并发冲突。
- [x] 画一张异常影响图并完成接口、对象、状态与 ownership 审计。
- [x] 形成正式回填草稿并同步 flow / 项目台账。

## 2. 本步输入、筛选规则与问题回答

| 输入 | 使用方式 |
|---|---|
| Step 8 | 定位 Command/Job/Consumer 的事务外副作用、ambiguous result 和 reconcile 出口。 |
| Step 9 | 定位禁止迁移、跨轴传播和必须冻结的状态。 |
| 正式 00 §10、§14 | 提取 `latest`、authority、完整性、ACK、保护、恢复和 evidence 负向验收。 |
| 正式 01 §8～10、§13 | 校验 owner/local 双视图、SDK-first、最终一致和横切故障边界。 |
| `RUN-UP-001~008` | 将未闭合合同表现为 blocked/not-ready，而不是虚构正向错误处理。 |

只纳入以下异常：

1. 会改变 Step 8 主流程分支、要求冻结副作用或转入 reconcile/manual-review；
2. 会使 Step 9 状态失效、冲突或禁止迁移；
3. 会改变主要组成部分间接缝、ownership、visibility 或材料保护；
4. 如果遗漏，会让 03 错误实现成 fail-open、自动 replay、跨轴推导或敏感正文回退。

不纳入普通字段格式、UI loading、平台系统调用错误枚举、HTTP/RPC 状态全集、重试次数、backoff、补偿脚本与运维步骤；这些留给详细设计、配置设计和测试方案。

## 3. Context and explicit selection 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| actor/session/context 缺失、过期或不可见 | `ContextResolver`、`SelectionService`、`RunnerContextRef` | 返回 restricted/blocked；不得创建选择后的任何副作用。已有未确认副作用进入 `RecoveryCase`。 |
| 输入是 `latest`、默认分支、目录最新文件或可变 tag | Inbound validation + `ReleaseSelection` | 明确拒绝，不能解析成“当前版本”，不能从历史/cache 猜 exact ref。 |
| Release/version exact ref 不存在或不对当前 actor 可见 | `ReleaseAuthorityReadPort` 边界 + selection query | 返回 not-found/restricted 的安全姿态；两者不靠空结果合并，且不创建本地 authority。 |
| baseline/approval/decision chain 缺失、过期、撤销或 scope 冲突 | `SelectionService` + `ReleaseSelection` | selection 保持 blocked/stale/invalidated；不得取得或运行。Runner 不解释 policy 正文。 |
| authority check 后、selection 本地提交前 source version 改变 | `SelectionService` expected-version gate | 放弃旧读取结果，保持 selected/checking/stale；不得提交 current。 |
| selection generation 在下载、验证或 run intent 建立期间改变 | `ReleaseSelection` propagation + material/lifecycle services | 旧 binding 的 integrity/cache/intent 失效；已可能提交的 owner 副作用进入 recovery，不静默改绑。 |
| authority owner 不可用、SDK exact surface 未闭合 | required port readiness gate | 显示 blocked/unavailable/not-ready；不以 cache、角色或历史成功补齐。 |
| authority event 重复、乱序、gap 或 schema/source version 未识别 | planned Consumer + `RecoveryCase` | 当前合同未闭合时不消费；未来仅 dedup/标 stale/对账，不按最后到达覆盖 current。 |

本部分结论：异常只会把选择导向 blocked/stale/invalidated/recovery，不存在 fallback authority 或隐式版本主线。

## 4. Material acquisition and qualification 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| locator/manifest 缺失、不可见、过期或 transport constraint 不可解释 | `MaterialSourcePort` readiness + `AcquisitionService` | task blocked/failed，材料不创建或保持 quarantine；不保存 secret locator 正文。 |
| 下载中断、应用退出或网络切换 | `AcquisitionTask` + Acquire Job | 保存可解释的 paused/failed/unknown posture；resume 前重验 generation/source/authority，不盲续传。 |
| provider 声称 complete 但没有稳定 quarantine handle | `MaterialCachePort` 边界 | 不进入 `complete`/cache quarantined；按取得失败或 unknown 收束。 |
| 进度回退、超界、单位变化或来自旧 task attempt | `AcquisitionTask.record_progress` gate | 拒绝污染当前 task，保留上一安全进度并记录 redacted failure；进度从不参与完整性判断。 |
| 并发重复取得同一 binding | `AcquisitionService` idempotency + local store | 相同 idempotency 复用同一 task；不同 metadata 不静默合并，冲突显式。 |
| 取得期间用户 cancel，但传输 provider 仍返回 bytes | cancellation boundary + `MaterialCachePort` | 不晋级；残留只可进入受保护 quarantine/safe cleanup，不把 cancel 当删除完成。 |
| digest/signature/manifest/source 不匹配 | `IntegrityVerifierPort` + `IntegrityPosture` | 进入 invalid；不得改名、重打包、重声明或选择宽松算法放行。 |
| 平台兼容性不满足或能力无法观察 | `IntegrityPosture` + `PlatformResourcePort` | incompatible 进入 invalid；无法证明进入 blocked/unknown，不默认兼容。 |
| 验证器不可用、policy/algorithm 未由 owner 给出 | `QualificationService` readiness | integrity blocked/pending，cache 保持 quarantine；Runner 不自选算法/policy。 |
| 验证通过后 authority/manifest/digest/generation 漂移 | `IntegrityPosture.invalidate` + cache propagation | integrity/cache 转 stale，禁止 RequestRun；必须用新 basis 重验。 |
| 本地 cache 命中但 source binding 或 digest 不一致 | `MaterialCacheEntry` lookup gate | 不复用；冲突 entry 隔离为 stale/invalid，不能覆盖新 binding。 |
| 磁盘空间压力或 cache capacity 超限 | eviction evaluation + `ProtectionGuard` | 只形成 candidate；任何 active/unknown protection 优先，不能 fail-open 删除。 |
| quarantine/qualified metadata 可读但 bytes 缺失、损坏或句柄无效 | `MaterialCachePort` + qualification | entry 进入 stale/invalid，禁止 run；不得仅凭 metadata 宣称 qualified。 |
| release 过程中应用崩溃，材料存在性无法证明 | safe release operation + `RecoveryCase` | 标 unknown/frozen，重查本地句柄和 owner protection；不直接标 evicted。 |

本部分结论：所有材料异常都维持 `complete != verified != qualified`，且磁盘压力不能越过保护轴。

## 5. Run intent and lifecycle 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| RequestRun 入参 selection/material/context binding 不一致 | `RunLifecycleService` + domain assertions | 本地拒绝，不建立可提交 intent，不尝试 adapter 调用。 |
| run request 本地 intent 已落盘，但进程在外部调用前崩溃 | local operation boundary + `RecoveryCase` | 恢复后先证明“未发送”才允许显式重试；无法证明则 unknown/reconcile。 |
| owner 可能已接收，但 timeout/连接断开或本地 receipt 落盘前崩溃 | `RunIntent` + `RecoveryCase` | intent=unknown；按 correlation/idempotency 只读查询，不自动重发。 |
| owner 明确 accepted 但 boundary/run ref 未出现 | `OwnerRunProjection` | request accepted 保持，execution not_started/unknown；不显示 running。 |
| owner 明确 rejected | `RunIntent` | rejected terminal for intent；用户修正前置后创建新 intent，不原地改为 accepted。 |
| 同一 idempotency key 对应不同 binding/payload | Command metadata gate + local store/owner port | 显式 conflict，不能把旧 receipt 复用给新请求。 |
| start/stop/cancel 与当前 owner request/run/lease basis 冲突 | `ControlService` + `ControlIntent` | control conflict，冻结并读 owner current state；不强制覆盖。 |
| control ACK 到达但效果未确认 | `ControlIntent` / owner control projection | accepted 与 confirmed 分离；不从本地进程变化推效果。 |
| control timeout、重复点击或重连 | `ControlIntent` + recovery | 首次结果 unknown 时禁止自动/隐式 replay；UI 重复点击也受同一门禁。 |
| stop confirmed 但 execution/lease/cleanup 尚未收束 | lifecycle + resource/cleanup boundary | 分轴展示；不进入 cleaned/released/evicted。 |
| Sandbox 与 Runtime owner-safe 状态相互矛盾 | `OwnerRunProjection` + `RecoveryCase` | 标 conflict/unknown/stale，保留来源，停止危险控制；不得选“更乐观”的一方。 |
| owner event 重复、乱序、gap 或 query 与 event 不同版本 | planned consumers + Refresh/Reconcile | dedup 或标 stale/对账；query current basis 优先于无来源本地到达顺序，但 exact 规则等 owner 合同。 |
| PID、端口、socket、toast、本地日志与 owner state 不一致 | lifecycle projection + resource/diagnosis sections | 作为 local observation/diagnostic 显示冲突，不改变 owner request/execution/result。 |
| Runtime/Sandbox read surface restricted/unavailable | lifecycle query | 返回 partial/restricted/unavailable，保持 last-known 的 stale 标识；不补 terminal result。 |

本部分结论：所有不明确提交或控制结果进入 unknown/reconcile；没有 ACK、本地进程或 UI 信号到 running/terminal 的捷径。

## 6. Resource, cleanup and recovery protection 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| local port/path/process probe 显示可用，但 owner allocation/lease 显示占用 | `ResourceRecoveryService` + `ResourceObservation` | 显示双视图 conflict，以 owner 资格为准；不抢占、不改 allocation。 |
| local probe 显示冲突，但 owner 已分配 | preflight + presentation | 显示冲突和影响，阻止/等待正式协调；Runner 不私自 kill 或换端口后伪装一致。 |
| platform probe 不支持、权限不足或结果过期 | `PlatformResourcePort` + observation | posture unknown/unavailable，涉及安全前置时 fail-closed；不默认 available。 |
| required platform capability 在当前 OS/arch 缺失 | qualification/resource boundary | 显示 incompatible/blocked 与安全下一步；不通过切换私有 Sandbox backend 绕过。 |
| cleanup 请求前 lease/capture/handoff/retention/orphan 任一 active | `ProtectionGuard` + `RequestCleanup` | blocked/protected；不得调用清理或删除材料。 |
| 任一保护来源不可见、stale 或互相冲突 | `ProtectionGuard` | state=unknown，保守保护；不采用“未看到即不存在”。 |
| owner cleanup accepted 但未 confirmed | cleanup `ControlIntent` / owner projection | pending/accepted；不显示 released，不触发本地材料删除。 |
| cleanup 结果 timeout/ambiguous 或本地 receipt 丢失 | cleanup + `RecoveryCase` | unknown/frozen，只读查询 owner；不重复 cleanup。 |
| owner cleanup confirmed，但 local material 仍受 handoff/retention 保护 | cleanup + material guard | owner资源结果与本地释放分离；继续保护材料。 |
| orphan/lease epoch 在 cleanup 或 eviction 期间变化 | expected-basis guard + recovery | 放弃旧判断，进入 conflict/unknown；不继续删除。 |
| disconnect、suspend、resume、app restart 或 session expiry | connectivity + `RecoveryCase` | 立即冻结受影响副作用；重验 context/generation/lease/owner status。 |
| transport 恢复但业务 source 仍 stale | `ConnectivityView` + Refresh/Reconcile | reconnecting/reconciling；online 不清除业务 stale/unknown。 |
| recovery queries 部分成功、部分 restricted/unavailable | Reconcile Job | 保持 affected subjects frozen，输出 partial；不能用多数来源推定一致。 |
| recovery expected basis 与 owner actual basis 冲突 | `RecoveryCase` | conflict 或 manual_review；不得修复 owner、推进 owner cursor或自动补偿。 |
| manual review 被打开但没有新的正式依据 | `OpenManualReview` + protection | 仍冻结/保护；人工状态不是 override 或 signoff。 |
| 本地 state store unavailable、写冲突或恢复记录损坏 | `RunnerStateStorePort` + application services | 在不能原子保存 intent/basis 时禁止外部副作用；已可能发出的操作转 recovery/manual review。 |
| clock jump、休眠导致 freshness 无法可信判断 | `ClockConnectivityPort` + affected objects | freshness=unknown/stale；重读正式来源，不以本地 wall clock 乐观延长。 |

本部分结论：资源观察、owner allocation/lease、cleanup 结果与本地释放始终分轴；所有恢复路径 query-first/no-replay。

## 7. Preview, diagnosis and handoff 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| output/diagnostic source restricted、partial、stale 或 unavailable | `PreviewService` / `DiagnosisService` | 返回相应 visibility/freshness；不以 raw logs、空成功或旧正文补齐。 |
| source payload 超过允许范围 | `OutputPreview` bounded composition | 只返回 clipped/redacted 内容与 truncation posture；不把完整正文落盘。 |
| redaction policy/ref 缺失、redaction 失败或结果无法验证 | `RedactionPort` + preview/handoff gate | blocked/restricted；不得显示或发送未脱敏材料。 |
| safe source refs 互相矛盾，无法确定失败来源 | `FailureDiagnosis` | classification uncertain，next step 指向 reconcile/manual-review；不输出 verdict。 |
| 用户请求 handoff 时 diagnosis/material 已 stale 或 visibility 改变 | `HandoffService` expected-basis gate | 阻止提交或重新准备 redacted refs；不复用旧材料。 |
| handoff owner 合同未闭合、目标不可用或权限不足 | `ObservabilityHandoffPort` readiness | blocked/not-ready；本地 diagnosis 仍非 evidence。 |
| handoff 可能已接收但 receipt 未确认 | `HandoffPosture` + `RecoveryCase` | state=unknown，只读对账；不自动重发，不释放受保护材料。 |
| owner accepted/delivered receipt 到达 | Handoff projection + protection evaluation | 只更新交接姿态；不生成 evidence/report/verdict/signoff，也不单独解除 retention。 |
| handoff event duplicate/gap/out-of-order | planned Consumer | 当前不消费；未来 dedup/unknown/reconcile，不按最后到达覆盖。 |
| Archive reference unavailable或 restore 合同缺失 | `ArchiveReferencePort` peripheral boundary | 不影响 selection/run/cleanup 成功判断；显示外围 unavailable。 |
| 本地日志或 telemetry 可用而正式 diagnostic 不可用 | diagnosis/presentation boundary | 仅作 redacted local diagnostic hint，明确 non-authoritative；不得当审计证据。 |

本部分结论：所有 fallback 都只能降低信息强度，不能降低 redaction/visibility 门禁或升级证据语义。

## 8. Entry and presentation composition 异常与边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 单一 section not-ready/partial/stale | `RunnerReadModelComposer` | 该 section 明确降级，其余 section 可读；不压成顶层 success 或空结果。 |
| context 不可用或 actor visibility 无法解析 | entry facade/read model | 返回整体 unavailable/restricted；所有 command 禁止，query 仍遵守最小可见性。 |
| GUI/CLI/product entry 对同一 intent 给出不同默认值 | shared Command/Query facade | domain 输入必须一致；入口不得绕过 explicit version、idempotency 或 protection。 |
| render/query 被调用时 projection stale | presenters + Query service | 只显示 stale，不在 render 内 refresh/repair/write。 |
| foreground refresh 与用户换选并发 | `RefreshVisibleSourcesJob` generation gate | 旧 refresh 结果丢弃或标 stale，不覆盖新 generation。 |
| 页面重载/应用重启丢失临时展示状态 | presentation boundary | 从 local truth/safe projections 重建；临时 UI state 不改变 domain 状态。 |
| 平台窗口/桌面壳/CLI 能力不同 | entry adapter boundary | 保持同一 use case 和状态语义；不因载体不同改变 owner/bypass 规则。 |
| 外部系统返回 HTTP 200/通用 success 但语义字段缺失 | adapter normalization | 映射为 malformed/unknown/blocked，不提升为 accepted/current/running。 |

本部分结论：展示降级不得触发副作用或改变 domain truth；各入口共享相同失败和门禁语义。

## 9. 横切 crash window 与并发边界

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 本地 intent/state transaction 未提交就崩溃 | application service + local store | 外部调用不得先发生；恢复后视为未建立，不凭日志补建。 |
| 本地 intent 已提交、外部调用尚未开始时崩溃 | operation boundary + recovery | 只有可证明 not-sent 才能显式再次提交；否则先 reconcile。 |
| 外部调用可能成功、本地 receipt transaction 未提交时崩溃 | intent + `RecoveryCase` | unknown；使用同 correlation/idempotency 只读查 owner，不自动 replay。 |
| owner result 已保存但 view projection 未更新 | Refresh/Reconcile Job | 从已持久 ref 重建 projection；query 不承担修复。 |
| 两个 Command 对同一 aggregate expected version 冲突 | local repository + application service | 一个提交，另一个 conflict；不 last-write-wins，不覆盖 generation/basis。 |
| cancellation 与 external completion 竞态 | owning service + task/intent state | 以可证明的 owner/local result 分轴记录；cancel intent 不抹去已经成立的 owner fact。 |
| SDK/adapter 返回未知 schema/version | adapter readiness boundary | fail-closed/blocked；不得 generic JSON passthrough 到 domain。 |
| redacted diagnostic 本地持久化/telemetry 写入失败 | diagnosis/handoff + local store | 不影响 owner run truth；显示诊断 unavailable，且不回退 raw logging。 |

## 10. 异常影响图

```text
正常主线候选
  context -> explicit selection -> authority current
          -> acquire -> quarantine -> verify -> qualified
          -> run/control intent -> owner projection
          -> cleanup/protection -> preview/diagnosis/handoff
  │
  ├─ binding/source/authority drift
  │     └─► stale/invalidated/blocked ─► 禁止后续副作用
  │
  ├─ external side effect result ambiguous / crash window
  │     └─► unknown ─► RecoveryCase frozen ─► read-only reconcile
  │                                      ├─ proven ─► re-run current gate
  │                                      └─ unproven ─► manual_review
  │
  ├─ active or unknown protection
  │     └─► protected/blocked ─► 禁止 cleanup/material release
  │
  └─ visibility/redaction/source gap
        └─► partial/restricted/unavailable ─► 不以 raw/local/default 补齐
```

关键说明：

- 图只表达四类会改变主线的异常出口及其归属，不表达错误码、重试次数、补偿脚本或运维步骤。
- `re-run current gate` 表示重新进行前置校验，不表示重放原副作用。
- fail-closed 同时作用于 authority、材料、owner 副作用、保护与敏感展示；不存在局部便利性 override。
- 异常状态只传播到 Runner local state/view，不能修改上游 truth。

## 11. 异常到对象 / 接口 / 状态承接审计

| 异常族 | 主要对象 | 入口 / 处理流 | 状态出口 | 结论 |
|---|---|---|---|---|
| context/authority/version | `RunnerContextRef`、`ReleaseSelection` | select/invalidate/query/refresh | blocked/stale/invalidated | covered。 |
| transfer/integrity/cache | `AcquisitionTask`、`IntegrityPosture`、`MaterialCacheEntry` | acquisition commands/job | paused/failed/invalid/stale/quarantine | covered。 |
| request/control owner ambiguity | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | run/control/reconcile | unknown/conflict/stale | covered。 |
| resource/protection/cleanup | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | cleanup/eviction/reconcile | conflict/protected/unknown/manual_review | covered。 |
| preview/diagnosis/handoff | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | queries/refresh/handoff | partial/restricted/blocked/unknown | covered。 |
| entry/refresh | `RunnerReadModel`、`ConnectivityView` | read model/refresh | section partial/stale/unavailable | covered。 |
| crash/concurrency/store | all local aggregates + `RecoveryCase` | common command/job skeleton | conflict/unknown/frozen | covered；03 必须细化。 |

## 12. 本步边界与历史污染扫描

| 候选内容 | 本步处置 |
|---|---|
| 完整错误码、HTTP status mapping、OS errno | 不进入；交给 03 adapter/error contract。 |
| retry/backoff/timeout 数值 | 不进入；unknown/no-replay 红线固定，机制与数值后置。 |
| 自动 kill、重建容器、强制删目录等补偿脚本 | 不采用；绕过 Sandbox/保护边界。 |
| Docker/gVisor/Firecracker 特有失败 | 不进入核心异常；backend 是 Sandbox 私有实现。 |
| Tauri/Electron 窗口错误 | 不成为 domain 异常；技术选择仍待 03 核验。 |
| 旧本地日志“成功”判断 | 明确排除；仅可形成 non-authoritative redacted hint。 |
| 上游 blocker | 不伪装成已处理异常；正向 seam 保持 blocked/not-ready。 |

## 13. 回填草稿

正式 §10 使用一张按六部分加横切边界组织的异常表，并保留异常影响图。为控制篇幅，可合并同一状态出口的场景，但必须明确：implicit version/authority 失败、binding drift、下载与验证分离、两类副作用 crash window、ACK/owner 状态分离、保护 fail-closed、断线 no-replay、redaction fallback 禁止、partial read model 与 SDK/contract not-ready。

## 14. 待详细设计展开但不在本步回答

- 共享 error taxonomy、每个 port/adapter 的 typed error mapping 与用户安全文案。
- 本地 transaction/operation journal、outcome probe、idempotency collision、crash injection 与 recovery algorithm。
- 下载 checkpoint/cancellation、文件原子晋级/删除、store corruption 处理和平台差异。
- Event dedup/order/gap persistence（仅在正式 event contract 闭合后）。
- timeout、backoff、并发/容量、freshness 与 retention 的配置值和验证方式。

## 15. 进入下一步条件

- [x] 已只选择会改变处理流、状态机或跨部分协作的关键异常/边界场景。
- [x] 每个场景都明确落到主要组成部分、service、对象或 port boundary，并有概要处理口径。
- [x] 两类核心 crash window、unknown/reconcile/no-replay 与保护 fail-closed 已固定。
- [x] 异常影响图不含错误码、重试参数、补偿脚本或实现步骤。
- [x] 异常到对象、接口、状态出口审计无孤儿，`RUN-UP-001~008` 仍保持 blocker。
- [x] 未把设计风险、技术选型或普通参数错误混成本章主线。

结论：`gate_status=pass`，允许进入 Step 11“配置影响轮廓”。
