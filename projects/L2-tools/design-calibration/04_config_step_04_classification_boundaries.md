# L2-tools 04 配置设计 Step 4: 配置分类与禁止配置化边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.4
> 回填目标: `projects/L2-tools/04-配置设计.md` §4
> 状态: `completed / pass; stop review`
> 模式: `full-restart / single-agent-serial`

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 定义配置分类与禁止配置化边界 |
| 前序门禁 | Step 3 `completed / pass; stop review`；11 控制面、21 配置域、唯一 reader/builder 已收稳。 |
| 本步状态 | `completed / pass; stop review` |
| 输入基线 | Step 2 范围、Step 3 控制面、`03` §3.3/§13.8/§14、配置规范。 |
| 正式文档写入 | 关闭；只形成 §4 回填草稿。 |
| 下一动作 | 等待用户 review；确认后创建并执行 Step 5 来源/优先级/冲突。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

## 2. 本步目标与边界

本 Step 为每个配置域分配稳定类别，并明确 startup/entry/job/adapter/store/feature/sensitive/test-only 的生效边界。所有“配置可以选择承载”的内容都必须与 03 的 owner、状态、事务、审计和安全不变量分离。

本 Step 不定义最终来源优先级、具体 key/value、secret provider、环境矩阵或加载函数；只决定“什么类型的配置可以存在、是否允许 reload/hot、什么永远不能配置化”。

## 3. 本步输入

| 输入 | 关键结论 | 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | CP-01~CP-11、21 配置域、每域允许/禁止能力和 owner。 | 逐域分类，防止遗漏/重叠。 |
| `03-详细设计.md` §3.3 | identity、state、phase、redaction、query/job、UoW/CAS、依赖裁剪不受配置控制。 | 形成禁止项总表。 |
| `03-详细设计.md` §13.8 | `NC-L2T-001~025` 固定红线。 | 建立逐 ID 配置映射。 |
| `03-详细设计.md` §13.7、§14 | timeout/retry/degraded 类别、body-free observability 和 audit 约束。 | 分类时保留 unknown/manual/degraded 语义。 |
| 配置设计书写规范 §4.7~§4.9 | sensitivity、activation、failure strategy 枚举。 | 使用 `public/internal/sensitive/secret`、`startup/entry/job/static` 等规范词表。 |

## 4. SOP 问题回答

### 4.1 配置类别、热更新与主要风险

| 配置类别 | 语义 | L2-tools 示例 | 是否允许 `reload`/`hot` | 主要风险与处理 |
|---|---|---|---|---|
| `startup/assembly` | 影响 runtime graph、Store/UoW、Port slot、entry bundle 的完整装配。 | profile、store adapter ref、UoW capability、adapter availability。 | 否；变更需新完整 assembly + restart/new process。 | partial graph、old/new 混合、capability 漏检；validator fail-fast。 |
| `entry-local` | 只影响一次 API/worker/job entry 的 selector 或 bounded parameter。 | config source selector、job profile、scope selector、diagnostic selector。 | 仅当前 entry/job 生效；不改变全局 runtime。 | 入口绕过 metadata/identity；entry validator reject。 |
| `job-startup` | 在一个 bounded Job slice 开始时冻结的 batch/cursor/watermark/timeout/retry category。 | `jobs.batch_limit`、scope、projection rebuild selector。 | 否；新 Job run 才读取。 | mid-run drift、重复扫描、repair 越权；snapshot pin。 |
| `adapter-binding` | 选择已定义 Port 的 adapter/ref/availability/capability marker。 | Hub/Auth/Sandbox/source/collaboration adapter ref。 | 否；需重组 runtime。 | endpoint/ref 被误作 Available；blocked-aware marker + formal response gate。 |
| `store-binding` | 选择 logical Store adapter 和 declared capability。 | seven Store refs、projection/reference store、idempotency sidecar。 | 否；需重组 runtime。 | atomicity/CAS/replay 降级；缺 capability fail-fast。 |
| `bounded-runtime-parameter` | 不改变语义的有界技术参数。 | page/batch、size、timeout/retry category、retention category。 | P0 不 hot；entry/job/startup 作用域。 | 无界资源、unknown 误重试；范围/类别校验。 |
| `feature-registration` | 只注册/取消外围 event/projection/status/job runner。 | `features.outbound_events`、`projection_events`、`external_status_refresh`。 | 否；新 assembly/new Job。 | 关闭核心 gate 或改变 truth；禁止项校验。 |
| `policy-binding` | 选择已存在的安全/redaction/visibility/body policy reference。 | redaction floor、safe output class、visibility resolver ref。 | 否；只能收紧，不能在线放宽。 | policy ref 伪造 authority/default visible；fail-closed。 |
| `sensitive-locator` | 只保存 opaque secret/connection/cert/credential ref。 | `adapter.credential_ref`、store connection ref。 | 否；轮换由受控外部 owner/重组承接。 | raw secret 泄露、ref 误归类；Step 8 单独收口。 |
| `test-only-deterministic` | 明确 Local/CI fixture 的 fake/in-memory/fixed clock/ID。 | deterministic Store/Port fake、scripted blocked/unknown。 | 否；隔离 assembly。 | fixture 进入 staging/production-like；profile isolation + reject。 |
| `diagnostic` | 仅生成 body-free safe issue/trace/metric labels。 | config issue ref、safe diagnostic mode。 | P0 不支持动态 verbose/debug。 | raw body/high-cardinality/secret 输出；fixed redaction floor。 |
| `static/design-invariant` | 不是普通配置，属于代码/设计不变量。 | truth owner、state machine、phase fence、redaction deny floor。 | 不适用。 | 误开放开关会破坏事实；只能走正式设计变更。 |

### 4.2 生效方式和更新策略

P0 只允许以下 activation：

| activation | 适用 | 规则 |
|---|---|---|
| `startup` | root/profile、Store/UoW、adapter、policy、feature registry、clock/ID | 全部 candidate 校验完才暴露 runtime；变更需新 assembly/restart；不支持 partial apply。 |
| `entry-local` | config source/profile selector、单次 diagnostic selector、API/worker entry bounded input | 只影响当前 entry；非法 selector 只拒绝当前 entry，不改变全局 config。 |
| `job-startup` | Job scope/cursor/batch/timeout/retry/feature enablement | Job 开始冻结 snapshot；旧 Job 不读取新 config。 |
| `static` | 25 redlines、owner/state/phase/security/no-write/idempotency invariants | 不作为 key；任何改变先回到 00~03/ADR。 |

P0 明确不支持 `reload`、`hot`、在线 admin override、remote config center、online last-known-good 或 mid-flight adapter swap。出现这些字段或 source 时，validator 返回 `UnsupportedCapability`/`UnsafeOverrideAttempt`，不静默忽略。

### 4.3 禁止配置化项

| 禁止配置化项 | 关联红线 | 原因 | 如需改变应走什么流程 |
|---|---|---|---|
| Tool identity/definition/revision、Binding current/history、invocation/admission/outcome/audit truth owner | `NC-L2T-001~005` | 配置不是业务事实源，不能让部署值创造/改写事实。 | 需求/架构/03 domain+flow 变更，重新执行相关 calibration。 |
| Core shared schema、依赖裁剪、Hub/Auth/Sandbox/Bus/Obs/SDK owner | `NC-L2T-002`,`NC-L2T-024` | Cargo/runtime/event 依赖和 authority 不能靠 profile 切换。 | 上游 owner 闭合、ADR、03/04/07 全链重审。 |
| Hub visibility/inventory -> authorization、default allow、自授权、policy taxonomy | `NC-L2T-006`,`NC-L2T-010~011` | 观察/要求/裁决三权分离。 | Authorization owner/schema 正式变更；L2 只消费 typed result。 |
| raw prompt/request/capture/provider response/external body/secret/credential/stack trace | `NC-L2T-008`,`NC-L2T-017` | 会破坏 body-free、redaction、审计和最小交接。 | 安全与数据边界正式变更；不得以 debug/emergency 例外。 |
| admission-before-execution、Sandbox-required host/direct bypass、local attempt -> accepted/run/receipt | `NC-L2T-009`,`NC-L2T-012~013` | 配置不能把危险动作变成安全动作，也不能创造外部状态。 | Sandbox/Authorization owner 与 03 phase/Port contract 变更。 |
| source mapping -> normalized outcome、single terminal outcome、outcome/audit pair atomicity | `NC-L2T-014~016` | 结果和审计必须有 formal source 和同一 UoW。 | 03 outcome/store/UoW contract 变更，补测试/验收。 |
| safe handoff four-check gate、local-truth-first、delivery/observation status | `NC-L2T-017~019` | 外发不可放宽，Bus/Obs status 不得成为终态。 | external owner/03 phase contract 变更。 |
| Query write/refresh、Consumer core write、Job subject repair、gap auto-close、projection fallback | `NC-L2T-020~022` | 异步/派生路径不能取得 subject owner 写权。 | 对应 owning Command/03 state/flow 变更。 |
| state vocabulary/transitions、append-only/immutable、semantic key/CAS/digest/replay/unknown/manual | `NC-L2T-023~024` | 并发和历史事实不能由部署值改写。 | 03 state/concurrency/persistence 重新设计。 |
| runtime planning/orchestration/retry/recovery、Sandbox recovery、Bus retry/DLQ/replay | `NC-L2T-025` | 明确不属于 L2。 | 回到 Runtime/Sandbox/Bus owner；不增加 L2 config switch。 |

### 4.4 每个配置域的分类边界

| 配置域组 | 适用类别 | 明确不适用 | 固定禁止项 |
|---|---|---|---|
| CP-01 source/profile/identity | startup/assembly、entry-local、test-only | hot/reload、policy-as-truth、secret material | identity/authority/readiness/commit claim。 |
| CP-02 boundary/entries | startup/assembly、entry-local、bounded-runtime-parameter | hot mid-request、diagnostic body dump | DTO/metadata/actor/idempotency/cursor semantics。 |
| CP-03 stores/UoW | startup/assembly、store-binding、sensitive-locator、test-only | entry-local store swap、hot transaction swap | CAS/UoW/pair atomicity/schema owner/second truth。 |
| CP-04 idempotency/replay | startup/assembly、store-binding、bounded retention category | hot retention shrink、entry-local namespace override | key/digest/replay/unknown semantics。 |
| CP-05 projection | startup/assembly、job-startup、bounded-runtime-parameter、feature-registration | Query hot refresh/write、live truth fallback | no-write/no-repair/no-fallback。 |
| CP-06 jobs | startup/assembly、job-startup、entry-local scope selector、bounded-runtime-parameter | generic scheduler config、mid-run mutation | subject repair/run/evidence/status fabrication。 |
| CP-07 adapters | startup/assembly、adapter-binding、sensitive-locator、test-only | hot adapter swap、endpoint-health-as-authority | owner/schema/mapping/route/readiness/host bypass。 |
| CP-08 handoff | startup/assembly、adapter-binding、sensitive-locator、job-startup | hot target reroute、retry override after unknown | four checks/one-call fence/delivery truth。 |
| CP-09 clock/ID | startup/assembly、test-only | entry-local identity source、hot clock/ID swap | semantic identity/digest/DB implicit defaults。 |
| CP-10 features | startup/assembly、job-startup、feature-registration | feature toggle for core safety/state | identity/admission/outcome/audit/idempotency/no-write。 |
| CP-11 safety/telemetry | startup/assembly、policy-binding、diagnostic (safe only)、sensitive-locator | hot redaction weakening、raw/verbose diagnostic | body/secret/credential/high-cardinality/audit mutation。 |

## 5. 当前材料问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `03` §13.8 | 25 条红线已列出，但未按配置类别和域逐项归属。 | 建立完整红线映射和域分类矩阵。 |
| Step 3 | 允许/禁止能力已列，但热/冷生效语义未收口。 | 统一 P0 startup/entry-local/job-startup/static；reload/hot reject。 |
| 旧 05/06 | 可能把 debug/retry/环境开关写成业务语义。 | 明确旧内容不继承；diagnostic 和 retry 只能是安全类别。 |
| P1/P2 | 产品化/remote config 可能污染 P0。 | 分类为 future/unsupported；不生成当前成功路径。 |

## 6. 改动前后对比

| 项 | Step 3 后 | Step 4 后 | 原因 |
|---|---|---|---|
| 配置类别 | 只有控制面/域 | 形成 12 类 activation/sensitivity 分类 | 为 Step 7 配置项最小列和 Step 9 生效校验提供词表。 |
| 热更新 | 尚未定 | P0 全部禁止 reload/hot；entry/job 仅局部生效 | 当前 03 没有在线 lifecycle/atomic swap contract。 |
| 禁止项 | 分散在 03 `NC-L2T-*` | 按 10 组红线重组并映射 21 域 | 防止配置绕过 owner、state、phase、安全和 no-write。 |
| P1/P2 | 仅范围层描述 | 明确出现相关 key/source 时 reject + design reopen | 防止 silent unsupported。 |

## 7. 配置设计取舍

| 议题 | 选择 | 取舍 |
|---|---|---|
| P0 是否支持 hot reload | 不支持 | 以完整 startup assembly、entry-local、job-startup 取代，保证旧 work snapshot 和 atomic graph。 |
| debug/diagnostic 是否开放 | 只允许 body-free safe diagnostic class | 保留问题定位能力，不产生 raw body/secret/high-cardinality 输出。 |
| feature flag 范围 | 只控制外围 registration | 核心 gate 永远存在，避免 feature 造成语义分叉。 |
| retry/timeout 是否按普通数字开放 | 先用 typed category，具体数值后续按测量 authority 收口 | 不把 unknown/manual/terminal semantics 配成可变数字。 |
| sensitive locator 是否普通 string | 作为独立 sensitive/opaque ref 类别 | 防止 raw secret 与普通配置 merge。 |
| forbidden boundary 是否允许 emergency override | 不允许 | `UnsafeOverrideAttempt`，必须走正式设计变更和 review。 |

## 8. 结构化中间产物

### 8.1 配置分类总表

（见 §4.1；12 类：startup/assembly、entry-local、job-startup、adapter-binding、store-binding、bounded-runtime-parameter、feature-registration、policy-binding、sensitive-locator、test-only-deterministic、diagnostic、static/design-invariant。）

### 8.2 禁止配置化项总表

（见 §4.3；覆盖 `NC-L2T-001~025`，按 truth/authority/body/admission/handoff/outcome/query-job/state/runtime ownership 分组。）

### 8.3 按配置域分类边界表

（见 §4.4；CP-01~CP-11 每组均列适用/不适用类别和固定禁止项。）

### 8.4 分类边界停审记录

| 域组 | 类别适用是否唯一 | hot/reload 边界 | 禁止项可执行 | 结论 |
|---|---|---|---|---|
| CP-01~CP-02 | 是 | startup/entry-local | 是 | 通过 |
| CP-03~CP-04 | 是 | startup/store binding | 是 | 通过 |
| CP-05~CP-06 | 是 | startup/job-startup | 是 | 通过 |
| CP-07~CP-08 | 是 | startup/adapter binding | 是 | 通过（blocker retained） |
| CP-09~CP-10 | 是 | startup/test-only/job-startup | 是 | 通过 |
| CP-11 | 是 | startup/policy-binding/diagnostic-safe | 是 | 通过 |

### 8.5 跨分类/禁止项审计表

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 同一行为是否在多个类别冲突 | 无 unresolved | timeout/retry 统一为 bounded category；sensitive ref 不进入普通 override。 |
| 所有 25 redlines 是否有归属 | 通过 | §4.3 按组覆盖；Step 14 再逐 ID cross-check。 |
| P1/P2 是否污染 P0 | 未污染 | hot/config center/admin/production positive 只作 reject/future。 |
| feature 是否能关闭 core gate | 不允许 | validator/builder negative check。 |
| test fixture 是否可隐式 fallback | 不允许 | explicit profile only。 |
| Query/Job/Consumer 是否获得 write override | 不允许 | static boundary + typed config validation。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 使用规范定义的 sensitivity/activation/failure 类别描述既有 candidate sections | 否 | 配置语义分类 | `03` §13.2/§13.7 已有类别 | 无回写 |
| P0 只支持 startup/entry-local/job-startup/static，不支持 hot/reload/admin/remote/LKG | 否 | lifecycle boundary；无新增 builder contract | `03` §13.3 已允许具体生效留给 04 | 无回写 |
| `NC-L2T-001~025` 作为 validator/builder negative boundary | 否 | 承接既有 redlines | `03` §13.8 | 无回写 |
| future 若要求 hot reload、dynamic adapter swap、online LKG 或新的 policy/config root | 是 | builder lifecycle/root/adapter/error contract change | `03` §4~§15 与对应 Step | 无回写（future design-change trigger；当前未触发） |

## 10. 回填草稿

正式 `04-配置设计.md` §4 应回填：

- 配置类别总表及 sensitivity/activation/failure 词表；
- P0 startup/entry-local/job-startup/static 生效规则；
- reload/hot/config center/admin/LKG unsupported 规则；
- 按 CP-01~CP-11 的分类边界矩阵；
- `NC-L2T-001~025` 禁止配置化总表；
- 分类停审和跨分类/VETO 审计；
- 当前无 03 回写、future lifecycle contract 先回写的说明。

## 11. 待确认事项

| 事项 | 影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| timeout/retry/retention 是否最终按 category 而非 raw number 暴露 | Step 7/9/11 | 架构/测试/运维 | 只允许 typed category 和安全范围，unknown/manual 不能改变。 |
| P1 secret provider 是否需要 reload/rotation API | 可能影响 builder/adapter contract | 安全/运维/实施 | 当前只允许 opaque ref + startup/new assembly；未来先回写 03。 |
| 未来是否需要 online config governance | 影响 source/actor/audit/lifecycle | 架构/安全 | 当前出现对应 key/source 即 reject。 |

## 12. 进入下一步条件

> 历史快照说明：本文件记录 Step 4 当时的停审门禁；当前文档级恢复点已由 `04_config_calibration_flow.md` 和 `project_execution_ledger.md` 承接至 Step 5，不应按本节旧的“下一动作”重新回退。

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置类别完整 | 通过 | §4.1。 |
| P0 冷/热生效边界明确 | 通过 | §4.2；P0 无 hot/reload。 |
| 禁止配置化项覆盖 25 redlines | 通过 | §4.3、§8.5。 |
| 每个配置域分类边界已停审 | 通过 | §4.4、§8.4。 |
| 跨分类/VETO 审计无 unresolved | 通过 | §8.5。 |
| 03 当前无待回写 | 通过 | §9；future trigger 未触发。 |
| 正式 04 是否提前写入 | 否 | 仍为中间产物。 |
| 下一动作 | 停审 | 用户确认后创建 Step 5。 |
