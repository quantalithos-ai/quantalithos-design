# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11。
> 回填章节：未来正式 `04-配置设计.md` §11「失效模式与降级 / fail-fast 策略」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 事实边界：本 Step 只规定既有 42 个配置 leaf 在加载、组装、入口和运行期依赖失效时的处置；不实现 loader、provider、adapter、告警平台、重试调度或任何运行实例。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `11 / failure_degradation` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～10 均 `pass_with_upstream_blockers`；Step 10 已停审 |
| 正式 04 写入 | `false`；Step 15 前不得创建 `04-配置设计.md` |
| 允许的下一动作 | 更新 flow/ledger 后进入 Step 12；只创建 Step 12 唯一中间产物，不提前创建 Step 13～15 文件 |
| 实现 / 测试 / commit | `false / false / false` |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |

本 Step 的通过只表示失效、降级、fail-fast 和 fail-closed 的设计边界可审查；不表示任何配置已加载、adapter 已健康、capability 已 `bound`、入口已运行或告警/测试已经执行。文中的“已验证候选”只表示外部流程提供、可重新走 Step 9 校验的候选输入，不是 Artifact、Baseline、Review accepted、evidence、signoff 或 readiness。

### 1.1 Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | `11 / failure_degradation` |
| 输出文件 | `design-calibration/04_config_step_11_failure_degradation.md` |
| 已读取通用规范 | yes：设计文档编写通则、中间产物规范、真相源闭环与可落码性标准、全局依赖规则 |
| 已读取 SOP / 书写规范 | yes：配置设计讨论流程 SOP、配置设计书写规范；参照 L1-governance 同 Step 粒度但不继承其业务 truth |
| 已读取前序输入 | yes：项目台账、04 flow、Step 5～10、正式 03、03 错误/配置/观测中间产物 |
| 当前模式 | `full-restart` |
| 本 Step 模块骨架 | done：术语、问题回答、诊断、取舍、失效矩阵、域矩阵、观测/告警、测试切口、回填与门禁 |
| 进入条件 | pass：Step 10 已 `completed / stop_review` |

## 2. 本步目标、范围与非范围

### 2.1 本步目标

本 Step 必须闭合：

1. 42 个 leaf 在 startup/cold、job-run-start、entry-local、test harness 四个生效边界上的缺失、错误、不可用、漂移和过期处置。
2. `fail-fast`、`fail-closed`、运行期 `degraded`、`delayed`、`failed_known` / `outcome_unknown` 的适用边界；高风险失败不得 silent fallback。
3. 普通 source、opaque ref、capability classification、单次 adapter call 和既有 public disposition 不混层。
4. P0 对 config center、admin override、reload、hot、online last-known-good 和 fake fallback 的明确拒绝。
5. safe diagnostic / telemetry 的最小字段与禁止输出边界，并把配置异常与业务结果、平台 truth、Review 状态分离。
6. 每个配置域的停审、跨失效审计和对 03 的影响判定；不提前定义 Step 12 的下游测试/验收承接。

### 2.2 本步范围

| 范围 | 本 Step 结论 |
|---|---|
| source/parse/structure | strict JSON、duplicate/alias/unknown/forbidden scan 失败时 whole-candidate reject；高优先级非法值不回退 |
| typed validation | 42 leaf 的 required、nullable、finite safe positive integer、ref、profile 和 cross-field 失败映射 |
| composition | `ValidatedSyncRuntimeConfig`、既有 builder 顺序、`AdapterCapabilitySnapshot` 和 read/write graph 暴露门禁 |
| runtime dependency | 已合法绑定但调用时不可用，按既有 command/query/consumer/job surface 表达 unavailable/blocked/degraded/delayed/unknown |
| drift / expiry | candidate 与 composition 不一致、外部标记过期或 replay fixture 不可用时重新校验或拒绝；不在线改写旧 snapshot |
| output safety | raw secret、full sensitive ref、endpoint/body、文件正文、Git stdout/stderr、provider response 永不进入输出面 |

### 2.3 明确非范围

- 具体 parser、validator package、CLI 命令、HTTP endpoint、配置中心、KMS/Vault/secret provider 或告警产品。
- retry/backoff 的时间、队列、调度器、pager、SLO、dashboard、runbook 和部署挂载。
- `SyncProtocolError`、`AdapterCallDisposition`、`AdapterAvailability` 或既有 domain/application error family 的新增 variant；本 Step 只复用既有类型语义。
- 自动 restart、自动 rollback、online last-known-good、hot adapter replacement、动态 source refresh 或 admin override。
- 对 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote、用户 dirty worktree 或已发生外部 effect 的修复/回滚。
- 运行、测试、artifact、report、evidence、review verdict、signoff 或 readiness 的事实声明。

## 3. 本步输入与权威边界

| 输入 | 权威级别 | 本 Step 承接内容 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 当前 04 直接输入 | `approved default < selected strict JSON < allowlisted environment`；高优先级非法值不得 fallback |
| `04_config_step_07_config_items.md` | 当前 04 直接输入 | 42 leaf 的 canonical path、38 required + 4 nullable、scope、生效和 per-domain failure |
| `04_config_step_08_sensitive_secrets.md` | 当前 04 直接输入 | ref-only、adapter-private resolution、raw material 零泄露、rotation/no-hot |
| `04_config_step_09_loading_validation_activation.md` | 当前 04 直接输入 | source→strict parse→scan→typed validation→composition、snapshot pinning、reload/hot reject |
| `04_config_step_10_change_audit_rollback.md` | 当前 04 直接输入 | safe audit、previous validated candidate + cold restart、run/entry/test 回退边界 |
| `03-详细设计.md` §11～§15 | 当前正式直接输入 | 既有 error/disposition、builder 顺序、四态 capability、immutable snapshot、non-overwrite 与 provenance 红线 |
| `03_ddd_step_12_error_recovery.md` | 当前详细设计中间产物 | `dependency_unavailable`、`failed_known`、`outcome_unknown`、query no-write、consumer/job recovery |
| `03_ddd_step_14_config_dependencies.md` | 当前详细设计中间产物 | `ValidatedSyncRuntimeConfig`、`AdapterCapabilitySnapshot`、`AdapterCallDisposition` 和 composition/adapter boundary |
| `03_ddd_step_15_observability_audit.md` | 当前详细设计中间产物 | closed telemetry vocabulary、safe diagnostic、sink failure isolation 和 no-readiness claim |

旧 README、旧 05/06、draft 以及其他项目 Step 11 仅作 `historical_material`/框架参考；不引入其配置名、默认值、队列、outbox、projection 或业务状态。

## 4. SOP 问题回答

| SOP 问题 | L5-sync 回答 |
|---|---|
| 必填配置缺失时如何处理？ | 38 个 non-nullable leaf 或 required section 缺失：startup/cold 在生成 `ValidatedSyncRuntimeConfig` 前 fail-fast，不产生新 composition/snapshot/facade；job-run-start 缺失 run-local 必填输入时只拒绝当前 job；entry-local 缺失显式 selector/target/path 时只拒绝当前 entry；test fixture 缺失时 test composition fail-fast。4 个 `operations.*` nullable slot 缺失归一为 `null`，不产生 positive capability。 |
| 类型、范围、交叉字段错误如何处理？ | strict parse、duplicate/alias/unknown/forbidden、type/range/ref/cross-field 任一失败均产生 redacted issue 并拒绝对应候选/入口；startup 错误不回退，job/entry 只拒绝当前边界，test 只终止当前 composition。不得 clamp、默认无限/零、把超限请求截断后当完整结果。 |
| secret/KMS/Vault 不可用如何处理？ | P0 不定义具体 secret provider/KMS/Vault，普通配置只接收 opaque ref。若未来 provider 合同获授权，required startup binding 的缺失/形态错误仍 fail-fast；合法 ref 但解析/调用不可用按既有 `blocked`、`dependency_unavailable` 或 `outcome_unknown` 映射，相关 route 拒绝，不用 fake/cache/旧 key 替代，也不输出材料。 |
| config center 不可达如何处理？ | P0 没有 remote config center/admin override；出现该 source/activation 直接 `unsupported`/reject，不降级为另一个 source。未来若引入，必须先回流 03/04 重新定义 source、lifecycle、audit 和 rollback；当前不得伪造 local last-known-good。 |
| 配置漂移或过期如何发现和处理？ | 以 safe/redacted candidate digest、profile class、composition/snapshot context、job input/fixture/replay ref 的既有关联检测。不一致时新 composition 重新走完整校验；已运行对象继续原 `runtimeBindingSnapshotRef`。外部标记 expired、replay carrier 失效或 freshness 无法安全判断时，拒绝新入口或返回既有 `unavailable/blocked/unknown`；不添加隐式 TTL、刷新或自动修复。 |

## 5. 当前文档问题诊断与设计取舍

### 5.1 当前问题诊断

| 位置 | 问题 | 本 Step 的修正 |
|---|---|---|
| Step 7 配置项表 | 每域已有失败词，但缺少统一 activation-surface 矩阵 | 用 startup/job/entry/test 四面矩阵统一判定，并逐域覆盖 42 leaf |
| Step 8 敏感边界 | provider/ref 不可用与 raw secret 违规容易被混作同一类错误 | raw material 走 fail-closed；合法 ref 的运行期不可用走既有 dependency/capability 语义 |
| Step 9 issue surface | `blocked/unsupported/unknown` 可能被误读为配置通过 | 明确 source/config validation、snapshot availability、per-call disposition 三层分离 |
| Step 10 回滚 | previous candidate 可能被误读为在线 LKG | 只允许显式选择已验证候选后重新 cold compose/restart；不切换在途 snapshot |
| 03 error/recovery | Query、Consumer、Job 的降级面不同 | 逐 surface 映射既有 Query/Consumer/Job disposition；Query 不写，unknown 不重放 |
| 历史 README/draft | LFS、浅克隆、GUI、固定默认值可能偷渡为失效 fallback | 继续登记为 historical/pending；不创建开关、不承诺支持 |

### 5.2 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| startup invalid | 分散在 Step 7/9 | 所有结构/类型/范围/安全/交叉错误统一 fail-fast | 防止高风险错误被低优先级值或旧 snapshot 掩盖 |
| runtime unavailable | 可能被写成“一律启动失败”或“一律降级” | 按 required composition、command、query、consumer、job 分层 | 保留既有 effect/读写边界，避免把 unavailable 伪装成成功 |
| drift/expiry | 只有 digest 关联，没有失效动作 | 新 composition 重新校验；旧对象 pin 原 snapshot；新入口拒绝或保守返回 | 保持 immutable context 与 exact replay |
| LKG | 可能被 rollback 语言暗示 | P0 明确无 online LKG/reload/hot；仅 restart rollback | 不引入未授权 lifecycle |
| alert/audit | 可能记录 raw source/ref/body | 只记录 closed section/class、safe issue/change marker、capability/disposition | 防止 secret、拓扑和外部正文泄露 |

### 5.3 设计取舍

| 议题 | 采用方案 | 未采用方案 | 取舍理由 |
|---|---|---|---|
| 非法 startup candidate | whole-candidate fail-fast | 低优先级 fallback、clamp、warning 后继续 | 高优先级非法值和 hard boundary 不能静默改变语义 |
| 安全不确定 | fail-closed | fail-open 或 fake/cache fallback | owner、provenance、redaction、dirty/path 和 credential 边界不可猜测 |
| required adapter 不可用 | composition/required route 阻断；运行期调用按既有 disposition | 一律启动失败或一律 degraded | 既有 read/query/consumer/job 能力对外部依赖要求不同 |
| Query 失效 | 返回既有 `partial/missing/not_visible/blocked/unavailable`，保持 zero-write | Query 内修复、refresh、回滚 | 03 已禁止 Query 持有 mutation capability |
| effect 不确定 | 保留 `outcome_unknown`/checkpoint/probe 语义 | timeout 当作未发生、换 key 重放 | 防止重复 SDK/Git/filesystem/Review effect |
| 配置回退 | 显式 previous validated candidate + 新 cold composition/restart | online LKG、原地 patch、自动 restart | P0 没有 hot/reload contract |
| future config center/provider | 记录为 future trigger，先回流 03 | 在本 Step 预留隐式 remote source/health flag | 不伪造上游合同、产品或实现 |

## 6. 结构化中间产物

### 6.1 策略术语与既有 disposition 映射

| 策略 | L5-sync 精确定义 | 适用阶段/表面 | 不得解释为 |
|---|---|---|---|
| `fail-fast` | 在当前边界立即停止，不产生新 typed config/composition，或不启动当前 job/entry/test | startup loader/builder、job-run-start、entry-local、test composition | 外部 rollback、Review 结论或平台 truth |
| `fail-closed` | 安全/ownership/provenance/dirty/path/redaction 不明确时拒绝，不使用宽松默认、cache 或 fake | raw material、forbidden field、hard-boundary override、permission/source/handoff ambiguity | `bound`、健康、授权、accepted 或 readiness |
| `degraded` | 技术依赖/读取不完整被显式保留，核心 local truth 不被伪造修复 | query/read model、非核心 diagnostics、既有运行期依赖 surface | 配置 parse/type/range 错误的成功替代 |
| `delayed` | 既有 Consumer/Job 语义允许暂缓当前处理，保留安全 key/ref/status | in-flight reservation、临时依赖不可用且尚未发生新 effect | 自动扩大 scope、换 key、盲重放 |
| `failed_known` | effect 边界已知且失败，按既有 command/job/consumer carrier 表达 | 单次 call 已明确无成功 effect或 job item 明确失败 | 外部 owner 已回滚、Review rejected 或业务 truth 被删除 |
| `outcome_unknown` | 无法证明 effect 是否发生，保留 attempt/checkpoint 并要求 probe/manual | SDK handoff、Git/fs apply、local commit ambiguity | “失败所以没发生”、自动 retry 或 config rollback |
| `blocked/unsupported/unknown` | 既有 `AdapterAvailability`/route posture | 合法 ref 但合同/能力未闭合或无法判断 | parse success、`bound`、运行健康或 readiness |
| `restart rollback` | 显式选择已验证候选，重新经过 Step 9 并 cold compose/restart | startup candidate 失败后的恢复 | online last-known-good、旧对象 rebinding |

### 6.2 失效决策流程图

```text
[source selection]
       |
       +-- source absent and optional? ----> [apply approved default/null rule]
       |                                      |
       |                                      +-- required unresolved -> [startup fail-fast]
       v
[strict JSON parse + duplicate/alias/unknown/forbidden scan]
       |
       +-- invalid/raw/hard-boundary -----> [whole-candidate reject + safe issue]
       v
[type/range/ref/sensitive/cross-field validation]
       |
       +-- startup candidate invalid ----> [no ValidatedSyncRuntimeConfig]
       +-- job/entry input invalid ------> [current job/entry rejected]
       +-- test fixture invalid ----------> [test composition fail-fast]
       v
[runtime composition / static binding classification]
       |
       +-- malformed required binding ---> [no new composition/snapshot/facade]
       +-- legal ref, contract blocked ---> [snapshot conservative posture; route blocked]
       +-- legal ref, capability unknown -> [snapshot unknown; route preflight blocks]
       v
[single adapter call / read / local effect]
       |
       +-- query read incomplete --------> [existing partial/unavailable; zero-write]
       +-- consumer temporary dependency -> [existing delayed/quarantine/failed_known]
       +-- job item known failure --------> [existing partial/failed_known report]
       +-- effect ambiguity -------------> [outcome_unknown + checkpoint/probe]
       +-- diagnostics sink failure ------> [business disposition unchanged]
```

流程约束：每个分支都保留 source/config issue、capability posture、single-call disposition 和 business carrier 的层次；不得用日志、ACK、cache、Git commit、local report 或诊断 receipt 将保守分支提升为成功/接受/就绪。

### 6.3 42 leaf 按配置域的失效覆盖

| 配置域（leaf 数） | 覆盖的 canonical leaf | 配置失效（加载/校验） | 合法配置但依赖/运行失效 | 处置上限 |
|---|---:|---|---|---|
| `identity`（2） | `configRef`、`profileRef` | 缺失、canonical mismatch、未知 profile、selector conflict → startup 或 current entry reject | owner/source 语境不能由 profile 补齐 → affected route `blocked/unknown` | 不从 path、Project、version、branch、latest/default 推断 identity |
| `boundary`（5） | `maxRequestBytes`、`maxPageItems`、`maxPathScopeItems`、`maxTargetScopeItems`、`maxDiagnosticItems` | 非 finite safe positive integer、overflow、cross-field ceiling 冲突 → startup fail-fast | 当前 request/job/diagnostic 超限 → entry/job reject 或 bounded/degraded output；不截断冒充完整 | 不允许 zero/infinite/clamp-as-success |
| `execution`（8） | `localReadTimeout`、`localCommitTimeout`、`metadataLockAcquireTimeout`、`sdkReadTimeout`、`externalEffectTimeout`、`localToolEffectTimeout`、`shutdownTimeout`、`maxConcurrentMutations` | 缺失、单位/范围/并发关系错误 → startup fail-fast | read → unavailable；commit/effect timeout → `commit_status_unknown`/`outcome_unknown`；lock timeout → blocked | 无 generic retry、无 timeout-as-not-happened |
| `jobs`（2） | `maxBatchItems`、`maxParallelItems` | 缺失、非正整数、超过 target/concurrency ceiling → startup fail-fast | run-local batch/parallel/scope 不合法 → current job rejected；在途 run 不改 | 不生成 actor/key/schedule，不接管旧 run |
| `metadata`（3） | `storeAdapterRef`、`unitOfWorkAdapterRef`、`lockAdapterRef` | ref 缺失/非法/重复 → startup fail-fast | 合法 ref 但 store/UoW/lock contract blocked/unavailable → snapshot conservative；mutation blocked；commit ambiguity 保留 unknown | 不选择 physical `.qs-sync` schema，不删 provenance |
| `sdk`（7） | `sdkProfileRef`、`credentialProviderRef`、`ownerAccessAdapterRef`、`materialSourceAdapterRef`、`reviewHandoffAdapterRef`、`reviewDecisionReadAdapterRef`、`recoveryProbeAdapterRef` | ref/profile 不合法、raw material、forbidden endpoint/body → fail-closed/startup reject | resolver/access/source/handoff/decision/probe unavailable → route blocked/dependency_unavailable/unknown；ACK 不升格 | 不本地授权、不猜 source、不盲重提 |
| `localTools`（5） | `gitObservationAdapterRef`、`gitWorktreeAdapterRef`、`filesystemInspectionAdapterRef`、`filesystemApplyAdapterRef`、`allowedTargetRootPolicyRef` | ref/root policy 不合法或 safety rule 无法证明 → startup/entry reject | observation unavailable → query unavailable/blocked；apply partial/ambiguous → `outcome_unknown`；dirty/path/symlink unknown → fail-closed | 不 merge/rebase/push/stash，不覆盖用户修改 |
| `support`（6） | `diagnosticsAdapterRef`、`redactionPolicyRef`、`clockAdapterRef`、`idAdapterRef`、`digestAdapterRef`、`digestAlgorithmRef` | redaction unsafe、digest incompatible、required provider 缺失 → startup fail-closed | diagnostics sink unavailable → isolate signal；clock/id/digest call unavailable → mutation blocked/rejected before effect | 不用 system time/Git commit/random fallback，不重算旧 digest/ID |
| `operations`（4） | `accessOrPostureConsumerRef`、`materialSourceConsumerRef`、`reviewDecisionConsumerRef`、`jobRunnerRef` | non-null ref 非法 → startup fail-fast | `null` 保持未注册；合法 ref 但 consumer/job contract blocked → consumer blocked、current job rejected | 不创建 topic/schema/daemon/schedule/scope/key |

计数固定为 `2+5+8+2+3+7+5+6+4=42`。表中“合法 ref 但依赖失效”不等同于配置有效性升级；它只沿既有 capability/call disposition 继续保守传播。

### 6.4 通用失效模式表

| 失效模式 | 影响 | 系统行为 | 安全观测 | planned test cut（未运行） |
|---|---|---|---|---|
| selected strict JSON source 缺失且 required | 无法形成 candidate | startup fail-fast；不构造 typed config | source kind、section class、safe issue ref | required source missing stops before builder |
| selected source 不可读 | 不能证明候选内容 | startup fail-fast；不换 source 猜值 | source availability class；不记路径/body | unreadable source does not fallback |
| strict JSON parse/JSONC/comment/trailing comma | 候选不可信 | whole-candidate reject | parse issue class、bounded location class | strict parser rejects non-JSON |
| duplicate key / alias collision | canonical value 不唯一 | whole-candidate reject；不采用最后一次覆盖 | section/field class、issue ref | duplicate and normalized alias rejection |
| unknown section/field | 可能越过配置边界 | whole-candidate reject；不 warning 忽略 | closed section/field class | unknown key rejection |
| forbidden field / command / remote / merge / provenance override | 试图配置化硬边界 | fail-closed；不产生新 composition | forbidden class、rule ref | forbidden boundary key rejection |
| required leaf missing | 绑定或预算不闭合 | startup fail-fast；job/entry/test 按当前边界拒绝 | section/leaf class；不记 raw candidate | each required family missing |
| invalid type/nullability | 无法安全收窄 typed config | startup fail-fast 或 current job/entry rejected | expected type class | scalar/object/null mismatch |
| invalid range/unit/overflow | 预算或 scope 不安全 | startup fail-fast；超限请求/job rejected | range class、unit class | finite safe positive integer checks |
| invalid ref/profile/canonical identity | binding intent 不可信 | startup/entry reject；不分类为 `blocked`/`bound` | ref class、profile class、issue ref | malformed ref/profile conflict |
| cross-field conflict | profile、budget、adapter 或 registration 关系不成立 | whole candidate 或 current input reject | rule class、section classes | budget/profile/slot matrix conflicts |
| high-priority environment value invalid | 高优先级覆盖不可信 | fail-fast；不得回退 JSON/default | source kind、section class、issue ref | invalid env does not fallback |
| raw secret/provider body/full sensitive ref | 发生敏感泄露风险 | fail-closed；不截断、不替换、不回显、不落输出 | forbidden-content class only | raw material absent from every carrier |
| redaction policy unsafe/deny rule relaxed | 输出边界不可证明 | startup fail-closed；不暴露 mutation facade | policy class、issue ref | unsafe redaction rejected |
| unsupported reload/hot/config center/admin source | 未授权 lifecycle/source | whole-request/source reject；旧 composition unchanged | activation/source class、issue ref | unsupported activation rejection |
| required static binding malformed | builder 无法安全构造 | no `ValidatedSyncRuntimeConfig`/new snapshot/facade | binding slot、issue ref | malformed required ref stops builder |
| legal binding contract blocked | positive route 前置未闭合 | conservative snapshot may retain `blocked`; affected mutation/route rejected | capability + blocker ref | blocked capability prevents route |
| legal binding availability unknown | 无法安全判断 | preserve `unknown`; no local allow/fallback | capability + unknown reason class | unknown capability remains blocked |
| source/candidate digest drift before composition | candidate 与预期关联不一致 | restart validation; reject new composition until corrected | redacted digest classes only | drift blocks composition |
| snapshot/config drift after composition | in-flight context must remain immutable | stop new affected entries if required; old objects keep original snapshot; no hot rebind | snapshot/config relation class | old snapshot remains pinned |
| external/ref/fixture marked expired | 新入口语境过期或不可重现 | startup/job/entry/test reject as applicable; no implicit refresh | expiry class、safe ref marker | expired replay/fixture rejected |
| expiry/freshness cannot be judged | 不确定是否仍可用 | fail-closed for mutation; query/inspection may expose unavailable/unknown | freshness/availability class | indeterminate freshness blocks write |
| diagnostics/telemetry sink unavailable | 观测不完整 | preserve business disposition; emit no raw fallback; Step 11 不触发 rollback/replay | bounded sink-unavailable counter if safe | sink failure isolated |
| runtime builder partial assembly | 半图可能泄露写能力 | builder failure；不暴露 facade；不生成新 mutation graph | composition disposition、safe issue ref | partial graph never exposed |
| metadata read unavailable | local context 不完整 | Query existing unavailable/partial；mutation blocked；不 repair in Query | capability/call disposition | query no-write on store outage |
| metadata commit status unknown | 是否提交不明 | preserve `commit_status_unknown`; reload original identity/key | operation/checkpoint refs only | no new key after commit ambiguity |
| SDK owner/source read unavailable | 权限/source freshness 不明 | command blocked/dependency unavailable；query unavailable；不本地 allow | capability + call disposition | no local authorization fallback |
| review handoff/Decision/probe unavailable | handoff/Decision 层不明 | current handoff blocked or `outcome_unknown`; probe/manual path only | attempt/checkpoint/probe refs | ACK/timeout never means accepted |
| Git observation unavailable | clean/dirty/path 状态不明 | Inspect unavailable/blocked；apply prohibited | tool capability + safe class | unknown observation is not clean |
| Git/filesystem apply partial/unknown | local effect may have happened | retain run/checkpoint and `outcome_unknown`; no auto retry/overwrite | run/checkpoint/effect class | unknown apply requires probe/manual |
| conditional consumer unavailable | invalidation event cannot be handled | existing consumer `blocked/delayed/quarantined/failed_known` as applicable; no payload parse | consumer/disposition class | no snapshot mutation on unavailable consumer |
| explicit job runner unavailable | maintenance action cannot start | current job rejected/blocked; no daemon/schedule creation | job kind/run ref class | job requires runner contract |
| operations slot is `null` | optional consumer/runner omitted | remains unregistered; core composition unaffected | null/non-null slot class | null does not create runtime resource |

### 6.5 按 activation surface 的失败矩阵

| activation surface | 配置/输入失败 | 依赖运行失败 | 允许恢复 | 禁止动作 |
|---|---|---|---|---|
| startup/cold | source、parse、structure、type、range、ref、sensitive、cross-field、hard-boundary 失败 → fail-fast/fail-closed；不产生新 typed config/graph | static binding 合法但 contract blocked/unknown → snapshot 保守分类；required route 不暴露可写能力 | 修正候选，或显式选择已验证候选后重新 load/validate/compose/restart | lower-priority fallback、half facade、online LKG、自动 restart、热替换 |
| job-run-start | job kind/batch/parallel/target/replay input 非法 → current job rejected | runner/target/capability unavailable → job blocked/failed_known/partial，按既有 job carrier | 新授权 run、新 run identity、同一合法输入重试（若既有 contract 允许） | 扩大 startup ceiling、接管旧 run、换 key 盲重放、改旧 report |
| entry-local | selector/profile/path/scope/conflict/resume input 非法 → current entry rejected | owner/source/Git/fs/metadata read unavailable → existing blocked/unavailable/unknown surface | caller 以新 entry 显式修正；Query 保持 zero-write | 猜 latest/default、写回 global config、以日志/cache补权限、覆盖 dirty worktree |
| test harness | fixture/ref/clock/id/digest 不合法或 profile 注入 fake → test composition fail-fast | test adapter unavailable → test composition remains failed/blocked；不改变 production-like composition | 修正脱敏 fixture 后重新组装 | 把 fake promotion 为 `bound`/健康、生成真实 evidence/readiness |
| reload/hot request | P0 unsupported → whole request reject | N/A | 显式 startup restart flow | partial replacement、old snapshot rebinding、online LKG |

### 6.6 按配置域停审记录

| 配置域 | 缺失/非法 | 合法 ref/运行依赖不可用 | 输出/恢复边界 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|
| `identity` | startup/entry reject；不隐式生成 identity | affected route blocked/unknown | 不输出 full identity；新 composition 才换 profile | 复用既有 identity/profile refs | 通过（带 blocker） |
| `boundary` | startup fail-fast；请求/job 超限 reject | bounded diagnostic/read surface 可 degraded；不截断成功 | 只记 class/issue；不放宽安全上限 | 复用 limits guards | 通过（带 blocker） |
| `execution` | startup fail-fast | timeout 按既有 call/effect disposition；unknown 不重放 | 不记录 raw timing/context；不新增 retry config | 复用 budgets/wrappers | 通过（带 blocker） |
| `jobs` | startup 或 current job reject | runner/target unavailable → blocked/failed_known/partial | 旧 report/run immutable；新 run 才恢复 | 复用 Job disposition | 通过（带 blocker） |
| `metadata` | malformed ref → startup fail-fast | read unavailable/query degraded；UoW/lock blocked；commit unknown 保留 | 不 repair/delete `.qs-sync`；不写 raw backend | `SYNC-UP-006` 保持 | 通过（带 `SYNC-UP-006`） |
| `sdk` | malformed/raw material → fail-closed | owner/source/handoff/Decision/probe 按既有 blocked/unavailable/unknown | 不本地授权、不将 ACK 升格、不重提 unknown effect | `SYNC-UP-001~005/008` 保持 | 通过（带 blocker） |
| `localTools` | ref/root safety 失败 → startup/entry reject | observation unavailable；apply partial/unknown；dirty/path unknown fail-closed | 不覆盖修改、不 merge/rebase/push/stash；不输出 path/body/stdout | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` 保持 | 通过（带 blocker） |
| `support` | redaction/digest/required provider 失败 → fail-closed/startup | diagnostics sink 隔离；clock/id/digest unavailable 阻止相关 mutation | safe marker only；不重算旧 ID/digest | 复用 support/observability seam | 通过（带 blocker） |
| `operations` | malformed non-null → startup fail-fast | null 未注册；contract blocked → blocked；runner unavailable → current job rejected | 不创建 transport/schedule/daemon/scope/key | 不新增 Consumer/Job contract | 通过（带 blocker） |

逐域停审结论：每个 domain 都分别定义了配置错误、运行期依赖失效、public/worker/job surface、恢复上限和禁止动作；没有把合法 ref、`null`、`blocked`、`unknown` 或诊断信号提升为 `bound`、健康、授权、accepted 或 readiness。

### 6.7 观测、告警与安全字段矩阵

| 场景 | 是否告警/记录 | 允许的安全字段 | 永久禁止 | 业务结果关系 |
|---|---|---|---|---|
| startup validation rejected | 是，使用既有 safe diagnostic/telemetry seam | source kind、section/slot class、profile class、issue ref、redacted digest class | raw config、env value、full ref、secret、parser dump | 不产生新 composition；不等于 review/平台拒绝 |
| high-priority invalid source | 是 | source kind、closed rule class、issue ref | raw value、文件路径正文 | 不 fallback lower source |
| sensitive/hard-boundary violation | 是，安全级别由既有观测语义承接 | forbidden class、rule ref、correlation ref | 检测到的原文、hash raw secret、provider body | fail-closed；不产生业务 effect |
| capability blocked/unsupported/unknown | 可聚合记录 | capability、availability、safe blocker/issue ref、snapshot class | health/readiness claim、owner body、endpoint/path | affected route 保守阻断 |
| query degraded/unavailable | 可聚合记录 | query kind、disposition、freshness/availability class | body、repair result、隐式 write | Query zero-write；不改变 local truth |
| consumer delayed/quarantined/failed_known | 是/按既有 consumer seam | consumer kind、event/disposition class、safe ref | raw envelope/payload | 不代表 source owner truth |
| job partial/failed_known/outcome_unknown | 是 | job kind、run ref class、item disposition/count class、safe issue ref | item body、external payload、evidence/report verdict | 旧 report/attempt 不改写 |
| SDK/Git/fs effect unknown | 是 | attempt/run/checkpoint ref、effect kind、outcome disposition | stdout/stderr、diff、credential、path body | 走 probe/manual；不盲重放 |
| diagnostics/telemetry sink unavailable | 可记录 drop class | signal kind、sink disposition、bounded counter | 原始待发送 payload | 不改变 command/query/job disposition，不触发 rollback |
| drift/expiry | 是 | digest class、profile class、freshness/expiry class、issue ref | full candidate/ref/path/body | 新入口重新校验或拒绝；旧 snapshot 不改 |

告警和审计均不是新的平台 truth carrier。safe record 只说明技术处置或关联关系；不得称为 Artifact、Baseline、Review accepted、evidence、signoff 或 readiness。

### 6.8 计划测试切口（仅设计，不运行）

| 计划切口 | 覆盖 | 预期设计断言 |
|---|---|---|
| strict JSON / duplicate / alias / unknown | source/parser/structure | 非严格或歧义候选 whole-candidate reject；不采用最后一次覆盖 |
| required leaf / nullable operations | 42 leaf required/nullability | 38 required 缺失 fail-fast；4 nullable `null` 不注册 capability |
| high-priority invalid no fallback | source precedence | env/selector 存在但非法时不使用 JSON/default |
| type/range/unit/cross-field | boundary/execution/jobs/profile | invalid candidate 或当前 job/entry reject；不 clamp/infinity |
| raw secret/redaction/hard-boundary | Step 8/03 redline | fail-closed；safe issue 不含原文、full ref 或 body |
| malformed vs blocked ref | loader vs capability layer | malformed 不分类为 blocked/bound；合法但 contract blocked 保留 conservative snapshot |
| builder partial assembly | composition gate | 不暴露半装配 facade 或 mutation graph |
| capability four-state | snapshot classification | `bound` 不证明 health/auth/freshness/clean/accepted/readiness |
| query unavailable/degraded | metadata/source/read adapters | 只返回既有 read disposition；无 UoW/write/probe/repair |
| consumer delayed/quarantine | conditional operations | 不信任 unsupported/invalid payload；不推进 snapshot/cursor |
| job rejection/partial/unknown | explicit jobs | current job rejected 或 item disposition preserved；旧 report immutable |
| commit/effect timeout | UoW/Git/fs/Review | `commit_status_unknown`/`outcome_unknown` 保留；不换 key/盲重试 |
| dirty/path/tool unknown | local safety | apply blocked；不覆盖用户修改、不 merge/rebase/push/stash |
| drift/expiry/restart rollback | Step 10/11 | 新 composition 重新校验；旧 snapshot pin；未验证 rollback target 被拒绝 |
| diagnostics sink failure | observability isolation | sink failure 不改变业务 disposition、不补造 success/evidence |

所有切口均为 planned design input，未运行、未生成测试报告或证据。

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 42 leaf 的加载/入口/运行期失效分层 | 否 | 承接既有 config families、entry boundary 和 error mapping | 不适用 | 无回写 |
| 高优先级非法值、unknown/forbidden/raw material 不 fallback | 否 | 承接 Step 5、03 hard-boundary/redaction | 不适用 | 无回写 |
| 合法 ref 的 blocked/unsupported/unknown 与 malformed ref 分离 | 否 | 承接 `AdapterAvailability`、`AdapterBindingReason` 和 issue surface | 不适用 | 无回写 |
| Query degraded/unavailable 保持 no-write；Consumer/Job 保留既有 disposition | 否 | 承接 03 error/recovery/public surface | 不适用 | 无回写 |
| effect/commit unknown 保留 checkpoint/probe/原 key，不盲重放 | 否 | 承接 03 UoW/effect recovery | 不适用 | 无回写 |
| drift/expiry 只阻止新 composition/入口，旧对象继续 immutable snapshot | 否 | 承接 `runtimeBindingSnapshotRef` pinning | 不适用 | 无回写 |
| 若引入 remote config center、online LKG、hot reload、secret health contract、新 retry policy、new durable audit carrier 或新的 public disposition | 是（未来触发） | 改变 loader、builder、lifecycle、error/recovery 或 observability contract | 03 §13～§15、Step 12/14/15 及上游 owner contract | 当前不触发；变更前必须回流 03 |

当前计数：`待回写=0`；`阻塞待确认=0`（最后一行是未来触发条件，不是当前待回写项）。`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 继续保持原状态。

## 8. 回填草稿（未来正式 `04-配置设计.md` §11）

> 校准来源：
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“策略术语与既有 disposition 映射”“失效决策流程图”“42 leaf 按配置域的失效覆盖”“通用失效模式表”“按 activation surface 的失败矩阵”“按配置域停审记录”“观测、告警与安全字段矩阵”和“计划测试切口”。

正式 §11 应按以下顺序回填：

1. 先声明 P0 的 fail-fast/fail-closed/degraded/delayed/unknown 术语，以及这些词不表示平台 truth、Review 结论或 readiness。
2. 回填 source/parse/structure/type/range/ref/sensitive/cross-field 失败与 42 leaf 域表；保留 38 required + 4 nullable 计数。
3. 回填 startup、job-run-start、entry-local、test harness 和 unsupported reload/hot 的失败矩阵。
4. 回填合法 ref 的四态 capability、单次调用 unavailable/unknown、Query no-write、Consumer/Job disposition 和 local effect unknown 的关系。
5. 回填 drift/expiry/restart rollback：只影响新 composition/入口，旧 `runtimeBindingSnapshotRef` 不改写。
6. 回填 safe observation/alert 字段；禁止 raw secret、full ref、endpoint/path/body、Git 输出、provider response、evidence/report/verdict/signoff/readiness。
7. 回填逐域停审、跨失效审计和 03 影响判定；Step 12 再承接测试/验收/实施，不在本节伪造结果。

正式正文不得：

- 把 `bound`、`validated`、`built`、`completed_known`、`failed_known`、`degraded`、`delayed` 或 `outcome_unknown` 改写成 Review accepted、Artifact/Baseline、证据或 readiness；
- 把合法 ref、`null`、cache、ACK、Git commit、旧 report 或 telemetry receipt 当作 owner authorization、source freshness、clean worktree 或平台 truth；
- 引入配置中心、secret provider、hot/reload/LKG、自动 retry、自动 rollback、merge/rebase/push/stash、dirty overwrite、Query hidden write 或 fake promotion；
- 在未回流 03 的情况下新增 runtime type、Port、DTO、error、state、flow、durable carrier 或具体产品/命令。

## 9. 待确认事项与当前处理

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future config center / online LKG 是否需要 | source priority、lifecycle、audit、rollback | P0 不引入；若需求成立先回流 03/04 Step 13～14 |
| future secret provider/KMS/Vault 合同 | adapter constructor、resolver lifecycle、failure mapping | P0 只保存 opaque refs；provider material 永不进入普通配置 |
| exact expiry/freshness metadata | drift/expiry detection | 只承接既有 safe digest/ref/freshness posture；不新增 TTL leaf |
| exact retry/backoff policy | Consumer/Job/adapter recovery | 本 Step 不增加 `RetryPolicyConfig`；由后续正式合同决定 |
| alert threshold/aggregation/SLO | 运维与部署承接 | 只定义是否记录及安全字段；不写平台或阈值实例 |
| physical `.qs-sync` failure/retention semantics | metadata degraded/recovery | `SYNC-UP-006` 持续 blocker；保持 logical contract |
| SDK/source/permission/handoff/probe exact error/version | positive capability mapping | `SYNC-UP-001~005/008` 持续 blocked/unknown，不猜 DTO/API |
| Git/fs/LFS/shallow/GUI support matrix | local tool failure surface | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` 持续 pending；不生成开关 |
| formal Consumer/Job transport/runner contract | conditional failure/retry | nullable/blocked；不创建 topic/daemon/scheduler |

这些事项是后续 owner、实施或演进输入，不构成当前 Step 的 unresolved 设计缺口；若任何事项要求改变 03 contract，必须先回流并重新审查受影响 Step。

## 10. Step 11 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已逐项回答 SOP 五个问题 | pass | §4：缺失、错误、secret/provider、config center、漂移/过期 |
| 42 leaf 失效覆盖完整 | pass | §6.3：`2+5+8+2+3+7+5+6+4=42` |
| fail-fast / fail-closed / degraded / delayed / failed_known / outcome_unknown 边界清楚 | pass | §6.1、§6.4、§6.5 |
| 高风险失败无 silent fallback、无高优先级回退 | pass | §5.2、§6.4、§6.8 |
| malformed ref 与 blocked/unsupported/unknown capability 分层 | pass | §6.1、§6.3、§6.4 |
| startup/job/entry/test/reload/hot 处置闭合 | pass | §6.5 |
| drift/expiry、restart rollback、旧 snapshot pinning 闭合 | pass | §4、§6.4、§7 |
| Query no-write、Consumer/Job disposition、effect unknown 恢复边界闭合 | pass | §6.1、§6.5、§6.8 |
| safe observation/alert 无 raw secret/full ref/body/path/Git 输出 | pass | §6.7、§8 |
| 未新增 runtime type/Port/DTO/error/state/flow；未伪造实现/测试/证据 | pass | §2.3、§7～§9 |
| 正式 04 仍未创建，Step 12～15 文件未提前创建 | pass | flow、台账与目录静态审计 |
| 03 影响判定无当前待回写 | pass | §7 |

### Step 11 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

本 Step 已闭合 P0 配置缺失、解析/类型/范围/交叉错误、敏感违规、source 不可用、合法 ref 依赖失效、漂移/过期、运行期 adapter 不可用、Query/Consumer/Job 降级、local effect unknown、safe alert 和禁止 fallback 规则。允许的下一动作是：更新 `04_config_calibration_flow.md` 与 `project_execution_ledger.md`，然后进入 Step 12「下游承接」；不创建 Step 12 文件或正式 `04-配置设计.md`，直到流程进入对应 Step。
