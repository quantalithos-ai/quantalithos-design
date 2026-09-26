# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9。
> 回填章节：未来正式 `04-配置设计.md` §9「配置加载、校验与生效机制」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 事实边界：本 Step 只规定既有 `ValidatedSyncRuntimeConfig`、八个 config family、loader/validator/composition seam 和 capability snapshot 如何被加载、校验、组装与暴露；不实现代码、不锁定 parser/package、secret provider、物理 `.qs-sync` backend 或任何运行实例。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `9 / loading_validation_activation` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～8 均 `pass_with_upstream_blockers`，Step 8 已停审 |
| 正式 04 写入 | `false`；Step 15 前不得创建 `04-配置设计.md` |
| 允许的下一动作 | 更新 flow/ledger 后进入 Step 10；不提前创建 Step 10 文件 |
| 实现 / 测试 / commit | `false / false / false` |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |

本 Step 的通过只表示配置加载和冷生效的设计路径可审查、可校验、可交给后续实施；不表示 parser、validator、adapter、provider、SDK、Git/filesystem、`.qs-sync` backend、consumer/job runner 或任何 test run 已存在。

## 2. 本步目标、范围与非范围

### 2.1 本步目标

本 Step 必须闭合：

1. 普通 source 的选择、合并和不可用策略；
2. strict JSON parse、duplicate/alias/unknown/forbidden key 拒绝；
3. 42 个既有 leaf 的 required、类型、范围和 opaque-ref 校验；
4. profile、binding、budget、redaction、operations slot 的 cross-field 校验；
5. `ValidatedSyncRuntimeConfig` 到 composition、capability snapshot、read-only graph、mutation facade 和条件注册槽的装配目标；
6. startup、job-run-start、entry-local、test harness 的生效边界；
7. P0 对 `reload`/`hot` 的明确拒绝，以及失败时不暴露半装配 facade 的规则。

### 2.2 本步不定义

- parser、schema validator、环境变量读取库、Node/package manager、具体函数签名或 error enum 的实现细节；
- 具体 secret provider、endpoint、TLS、SDK method/version/error、Git executable/library、filesystem product 或 `.qs-sync` physical schema；
- 配置变更审批、审计记录载体、回滚矩阵（Step 10）；
- 失效告警、降级矩阵和运维处置（Step 11）；
- 测试用例、验收 verdict、实施 commit、部署实例、artifact/report/evidence/readiness；
- 任何新 runtime type、Port、DTO、state、topic、scheduler 或 source-authority/comparator 语义。

## 3. 本步输入与权威边界

| 输入 | 权威级别 | 本 Step 承接内容 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 当前 04 直接输入 | `approved default < selected strict JSON < allowlisted environment`、冲突和 fail-fast |
| `04_config_step_06_environment_profiles_matrix.md` | 当前 04 直接输入 | 四个 P0 profile、test/replay ceiling、future profile waiting |
| `04_config_step_07_config_items.md` | 当前 04 直接输入 | 42 leaf 的 raw path、required/nullability、类型、scope、生效和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 当前 04 直接输入 | ref-only、adapter-private resolution、最小暴露、rotation/no-hot 和 forbidden output |
| `03-详细设计.md` §13 | 当前正式直接输入 | loader/validator/composition 边界、八个 family、snapshot pinning、builder 顺序 |
| `03_ddd_step_14_config_dependencies.md` | 当前详细设计中间产物 | 42 code-level leaf、capability totality、四态 availability、call disposition |
| `03_ddd_step_15_observability_audit.md` | 当前详细设计中间产物 | closed issue/signal、redaction-first、telemetry failure isolation |
| `00-需求文档.md`～`02-概要设计.md` | 当前正式基线 | 显式选择、non-overwrite、query no-write、provenance、review/ownership 红线 |
| 配置 SOP/书写规范/中间产物规范 | 流程与结果规范 | 加载流程图、域表、停审、跨校验审计和 03 影响判定 |

旧 README、旧 05/06、draft、其他项目的 loader 或 secret key 只作 `historical_material`/框架参考，不得成为本 Step 的 runtime truth。

## 4. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 配置在什么时机加载？ | startup/cold composition 加载全局 runtime candidate；job-run-start 只冻结当前显式 job 的 bounded 参数和既有 request；entry-local 只解析当前入口的显式 selector/request；test harness 单独组装 deterministic composition。P0 不支持 runtime reload/hot。 |
| 配置如何 parse 和 type validate？ | 只接受严格 JSON；先检测重复 key、alias、未知 key、禁止字段和 JSONC 注释，再按九个功能 section 校验 object/list/scalar、closed profile、positive safe integer、nullable ref 和 opaque-ref grammar。任何存在但非法的高优先级值都 fail-fast，不回退。 |
| 哪些配置需要 cross-field validate？ | `identity` 与 selector/profile；boundary 与 jobs；execution 与 jobs；metadata 三 ref 的 logical capability；SDK profile/credential/provider 与各 adapter slot；localTools root policy 与 inspection/apply；support redaction/digest；operations nullable ref 与 profile/contract；所有 profile-specific fake/replay restrictions。详见 §9。 |
| 哪些配置 startup/reload/hot/build-time/static？ | startup：除 job run 输入外的 42 leaf；job-run-start：仅既有 `SyncJobBudgets` 的 run-local pin 和显式 job input；entry-local：既有协议字段；test harness：deterministic refs；reload/hot：P0 unsupported；truth/ownership/state/UoW/idempotency/query/review/provenance 是 static design boundary，不是配置。 |
| 校验失败后如何处理？ | startup 失败不产生 `ValidatedSyncRuntimeConfig`、snapshot 或 facade；job-run-start 只拒绝当前 job；entry-local 只拒绝当前 entry；test fixture 失败只使 test composition fail-fast。不得用低优先级、历史 snapshot、fake、cache、日志、ACK 或 default 抹平错误。 |
| builder 如何暴露模块？ | 只有 `src/config/*` 读取 raw source，`src/composition/*` 读取 validated config 并按 03 顺序构造 adapters、ports、graphs、snapshot 和 conditional slots。Application 只接收 ports/最小 limits/budgets/snapshot ref；Domain 不读 raw config、env、profile 或 provider。 |
| capability 何时判定？ | 类型/交叉校验通过后由 capability validation 和 adapter constructor seam 分类每个 exact capability 为 `bound/blocked/unsupported/unknown`。合法 ref 不等于 `bound`；`bound` 也不等于健康、授权、source freshness、Git clean、accepted 或 readiness。 |
| reload/hot 请求怎么处理？ | 作为 unsupported activation kind whole-request reject；不实现 last-known-good、半热切换或在途 snapshot rebinding。未来若需要，必须先回写 03 lifecycle/builder/audit/rollback contract。 |

## 5. 当前文档问题诊断与设计取舍

### 5.1 当前问题诊断

| 观察到的缺口 | 风险 | 本 Step 的收敛方式 |
|---|---|---|
| Step 7 已有 42 个 leaf，但缺少一个按顺序执行的 loader 链 | 实现者可能让每个 adapter 自行读环境、文件或任意 map | 固定唯一的 source selection → strict parse → structural scan → type/range/ref → sensitive/hard-boundary → cross-field → composition 链；只有 `src/config/*` 读取 raw source |
| Step 8 已定义 ref-only 和禁止输出，但未说明何时检查 forbidden material | raw secret、body、path 或命令字段可能先进入错误或诊断面 | 在任何 typed config 产生前执行 sensitive/forbidden-content scan；拒绝结果只保留安全 issue ref |
| 03 §13 已给出 builder 顺序，但没有逐配置域的 assemble target 和失败层级 | 配置合法、adapter 合同未闭合、单次调用失败可能被混为同一类 | 分层记录 parse/validation、static binding capability、per-entry call disposition；不以 ref 存在推导 `bound` |
| P0 明确无 hot update，但未规定收到 reload/hot 请求的结果 | 实施侧可能私造 last-known-good 或半热切换 | 将 reload/hot 作为不支持的 activation kind whole-request reject；不改写旧 snapshot |
| `operations.*` 是 nullable registration intent，容易被误读成 scheduler 开关 | 可能私造 topic、daemon、scope 或 key | 只在正式 contract 和 capability 满足时注册；`null`、blocked、unsupported、unknown 均不产生正向注册事实 |

### 5.2 设计取舍

| 议题 | 采用方案 | 不采用方案 | 取舍理由 |
|---|---|---|---|
| 解析格式 | 运行时只接受严格 JSON；JSONC 仅存在于文档示例 | 运行时兼容注释、尾逗号或宽松 parser | 让 source candidate 可重放、可审计，避免示例格式成为隐式能力 |
| 重复 key 检测 | 在普通 JSON parse 前后保留重复/alias 扫描语义；发现即 whole-candidate reject | 依赖 parser 的最后一次覆盖行为 | 覆盖会隐藏配置漂移和安全边界冲突 |
| 高优先级非法值 | 值存在但非法时 fail-fast，不回退低优先级 | fallback 到文件、default、cache 或历史 snapshot | 防止错误配置被误报为已生效配置 |
| adapter 可用性 | ref/静态构造通过后再分类 `bound/blocked/unsupported/unknown` | loader 直接探测所有服务，或把 ref 当 `ready` | 保持 source validation、binding contract、运行时调用和 owner truth 分层 |
| 生效 | cold composition 产生新的 immutable snapshot；在途对象继续旧 snapshot | 原地修改 config、热替换 adapter、重绑历史 operation | 与 03 的 snapshot pinning、unknown recovery 和 provenance 一致 |
| facade 暴露 | 只有 composition 完成且输出面已安全裁剪后才暴露；route capability 单独 preflight | 暴露半装配 graph，调用时再补 adapter | 避免半构造对象和隐式 fallback；不把 blocked route 伪装成成功 |

## 6. 结构化中间产物

### 6.1 配置加载流程图：L5-sync 配置加载、校验与冷生效

```text
[source selection]
  approved default (only default_allowed)
      + selected strict JSON candidate
      + allowlisted environment overlay
                  |
                  v
[transient source candidate]
  source readability / selected-source conflict check
                  |
                  v
[strict JSON parse]
  syntax + comment/JSONC rejection
                  |
                  v
[structural scan]
  duplicate key + alias collision + unknown key + forbidden field
                  |
                  v
[schema/type/range/ref validation]
  nine raw sections / 42 leaves / nullable operations slots
                  |
                  v
[sensitive and hard-boundary validation]
  opaque-ref only; no raw secret/body/path/command/override
                  |
                  v
[cross-field validation]
  profile, limits, budgets, adapter families, redaction, registration
                  |
                  v
[ValidatedSyncRuntimeConfig]
  immutable typed config; no source reread
                  |
                  v
[composition binding]
  Clock/ID/Digest -> metadata -> fs/Git -> SDK -> diagnostics
                  |
                  v
[exact capability classification]
  one binding per SyncAdapterCapability:
  bound | blocked | unsupported | unknown
                  |
                  v
[immutable AdapterCapabilitySnapshot]
  body-free; new composition identity
                  |
          +-------+-----------------------+
          |                               |
          v                               v
[read-only graph]                 [mutation graph/facade]
  query + inspect only             only after required static bindings;
  no UoW/write/lock/probe          every route performs capability preflight
          |                               |
          +---------------+---------------+
                          v
             [conditional operations registration]
              nullable slots remain null/blocked unless
              formal contract and capability are present
```

关键说明：

1. “transient source candidate” 是 loader 边界内的短生命周期数据，不是新的 domain object、DTO、Port 或 durable truth；raw source body 在进入 issue surface 前必须被裁剪。
2. `strict JSON parse` 明确拒绝 JSONC 注释、宽松尾逗号、重复 key 的静默覆盖和未授权 source；文档中的 `jsonc` 代码块不能被当作运行时输入。
3. `ValidatedSyncRuntimeConfig` 只在 `src/config/*` 与 `src/composition/*` 之间传递；Application 只拿到既有 ports、最小 limits/budgets 和 snapshot ref，Domain 不读取 config/source/profile。
4. capability snapshot 的 `bound` 仅表示静态 typed binding 通过；健康、授权、source freshness、working-tree clean、Review accepted 和 readiness 仍需各自的正式事实。
5. builder 任一必需阶段失败时，不暴露半装配 facade；单个 route capability 不满足时返回既有 blocked/unsupported/unknown 语义，不用 fake、cache、ACK 或日志补齐。

### 6.2 配置组加载、校验、生效与失败总表

下表覆盖九个 raw section（其中 `identity` 对应 03 的 config/profile refs，其余八组对应既有 typed config family），不新增 leaf。

| 配置项 / 配置组 | 加载时机 | parse / 结构校验 | type / range / ref 校验 | cross-field 校验 | 生效方式 | 失败策略 |
|---|---|---|---|---|---|---|
| `identity.configRef` | startup/cold | 只能来自 selected strict JSON；禁止普通 env 覆盖 | opaque config ref、canonical identity 一致性 | 与 candidate identity、来源选择和 profile 语境一致；不得从路径/业务对象生成替代身份 | 固定到新 composition 与 snapshot | 缺失、非法或 mismatch → startup fail-fast；不回退旧 snapshot |
| `identity.profileRef` | startup/cold；显式 selector 可 entry-local | canonical profile field；selector 不产生第二份 candidate | 只允许四个 P0 语义 profile；future profile 不进入当前 schema | selector 与 candidate 冲突 reject；不隐式选择 project/version/source/target | 新 composition 固定；entry selector 只影响当前入口 | unknown/mismatch → startup 或 current-entry rejected |
| `boundary.*`（5） | startup/cold | `boundary` 必须为 closed object，五个 leaf 全部出现 | finite safe positive integer；bytes/items/paths/records 单位按 Step 7 | target scope、page、request 和 diagnostic 上限关系合法；不得 clamp 或无限化 | composition 冻结，入口/mapper/job validator 读取最小子集 | 缺失/类型/范围/关系非法 → startup fail-fast；当前超限 entry rejected |
| `execution.*`（8） | startup/cold | `execution` closed object，八个 leaf 全部出现 | finite safe positive integer；timeout 为毫秒，concurrency 为正整数 | 与 jobs 并发上限、shutdown 边界和 03 timeout-result mapping 相容；不生成 generic retry | composition 冻结到 wrapper/scheduler | 缺失/非法 → startup fail-fast；调用超时按 03 归一为 unavailable/unknown/partial/outcome-unknown |
| `jobs.*`（2） | startup 校验；job-run-start pin | `jobs` closed object；只接受既有 budget leaf | positive safe integer；不接受 schedule/scope/key 字段 | `maxBatchItems <= boundary.maxTargetScopeItems`；`maxParallelItems <= execution.maxConcurrentMutations`；不覆盖 startup invariant | 新显式 job run 冻结；在途 run 不变 | startup 关系非法 → fail-fast；run-local 输入非法 → current job rejected |
| `metadata.*`（3） | startup/cold | `metadata` closed object，三 slot 必须存在 | opaque adapter ref grammar；null 不允许 | store/UoW/lock 分别验证；同一 concrete family 可复用，但不能因同 ref 自动通过全部能力；test ref 仅 test composition | 绑定 logical `.qs-sync` store/UoW/lock/snapshot seam | malformed → startup fail-fast；合同未闭合 → capability blocked/unknown，写图不构造 |
| `sdk.*`（7） | startup/cold | `sdk` closed object，七 slot 必须存在 | opaque adapter/credential ref；raw material、endpoint、DTO/body 禁止 | profile、credential provider、owner/source/handoff/decision/probe slot 各自兼容；不把 owner 成功推导为 source/handoff 成功 | 新 composition 绑定各 SDK port | malformed → startup fail-fast；surface/permission/source/probe 未闭合 → affected route blocked/unknown |
| `localTools.*`（5） | startup/cold | `localTools` closed object，五 slot 必须存在 | opaque Git/fs/root-policy refs；不接受 argv/shell/remote/refspec | observation/apply、inspection/root policy 和 non-overwrite 约束相容；LFS/shallow/GUI 不在 schema | 新 composition 绑定 local adapters；entry path 另行校验 | malformed/unsafe → startup 或 current-entry rejected；unknown tool capability 不当 clean/apply |
| `support.*`（6） | startup/cold | `support` closed object，六 slot 必须存在 | opaque provider/policy/algorithm refs；redaction vocabulary closed | redaction 只能收紧；digest adapter/algorithm 相容；deterministic clock/ID 只在 test composition | snapshot 固定安全输出与 provider refs | missing/unsafe/incompatible → startup fail-fast；diagnostics sink failure 隔离业务结果 |
| `operations.*`（4） | startup/cold registration intent；job runner 可在显式 job entry 使用 | closed object；每 slot 为 `null` 或 canonical opaque ref | nullable ref；空字符串不等于 null；不接受 topic/schema/schedule | non-null 只在正式 contract/capability 满足时注册；null 保持未注册 | 新 composition 条件注册；显式 job 才 pin runner | null → 未注册；malformed → startup fail-fast；contract blocked → registration remains blocked/current job rejected |

### 6.3 按配置域组织的加载 / 校验 / 生效表

| 配置域 | parse | type validate | cross-field validate | assemble target | 暴露给 | 不暴露给 | 失败策略 |
|---|---|---|---|---|---|---|---|
| identity/profile | closed `identity` object | `SyncRuntimeConfigRef`、`SyncRuntimeProfileRef` | canonical identity、profile allowlist、selector conflict | existing config/profile refs in `ValidatedSyncRuntimeConfig` | composition、entry boundary | domain、owner truth、project/version selector | whole candidate / entry reject |
| boundary | closed `boundary` object | five positive safe integers with units | page/path/target/request/diagnostic ceilings | existing `SyncBoundaryLimits` | entry decoders、query mappers、job validators | domain state transitions、permission evaluator | startup fail-fast or entry reject |
| execution | closed `execution` object | eight positive safe integers | timeout/result-layer and concurrency compatibility | existing `SyncExecutionBudgets` | wrappers、composition scheduler、shutdown coordinator | generic retry policy、state machine | startup fail-fast |
| jobs | closed `jobs` object | two positive safe integers | target scope and mutation concurrency relation | existing `SyncJobBudgets` plus run-local pin | explicit job entry/runners | scheduler truth、actor/scope/key generation | startup or job reject |
| metadata | closed `metadata` object | three opaque refs | independent store/UoW/lock capability validation | metadata adapters、repositories、snapshot repository | application ports/composition | physical schema、raw DSN、domain truth | startup fail-fast or write graph blocked |
| sdk | closed `sdk` object | seven opaque refs | profile/provider and per-slot capability compatibility | SDK adapter registry / existing owner/source/handoff/decision/probe ports | application flows | provider payload、sibling DTO、local permission truth | startup fail-fast or affected route blocked |
| localTools | closed `localTools` object | Git/fs/root policy refs | inspect/apply/root/non-overwrite compatibility | Git observation/worktree and filesystem adapter seams | command/query local boundary | arbitrary shell、remote truth、merge strategy | startup/entry reject or apply blocked |
| support | closed `support` object | diagnostics/redaction/clock/id/digest refs | redaction safety and digest compatibility | support providers and snapshot safe-output hooks | adapters、application instrumentation boundary | raw exception/body、evidence/readiness | startup fail-fast; telemetry failure isolated |
| operations | closed `operations` object | nullable refs | formal contract and exact capability before registration | conditional consumer/job registration slots | operations entry only when registered | domain feature flags、topic/schema/scheduler truth | null/blocked; malformed fail-fast |

域表中的“暴露给”是依赖注入边界，不是实现已存在的模块或 capability 结果；“blocked”与“unknown”仍必须保留在 snapshot/route disposition 中。

### 6.4 Cross-field validation matrix

下表的“rule id”只是本 Step 的审查索引，不是新增 error enum、DTO 或 public protocol。实现时应映射到既有 validation/error surface；不得把 safe issue label 当作业务状态。

| Rule id | 参与字段 / 配置组 | 必须验证的关系 | 失败层级与动作 |
|---|---|---|---|
| `CF-IDENTITY-01` | `identity.configRef`、selected source candidate | ref 的 canonical identity 与最终 candidate 一致；不能由绝对路径、Project、version 或历史 snapshot 静默生成替代值 | startup whole-candidate reject；不产生 typed config 或 snapshot |
| `CF-PROFILE-01` | `identity.profileRef`、entry-local profile selector | selector 只能选择当前入口语境；与 candidate 冲突时拒绝，不选择更宽松 profile | current entry rejected；startup selector冲突则 startup fail-fast |
| `CF-PROFILE-02` | profile、所有 adapter/ref slots、test fixture refs | `local-dev`/`ci-test` 可用显式 test composition；`integration-like` 不得 fake fallback；`operations-replay` 必须脱敏且只读；future profile 不进入 P0 schema | candidate/profile reject；受影响 composition 不暴露 |
| `CF-BOUNDARY-01` | `boundary.maxRequestBytes`、entry decoder input | request size 必须在 positive safe integer 范围；不得用截断、无限或零表示“无上限” | startup fail-fast；超限 entry rejected |
| `CF-BOUNDARY-02` | `boundary.maxPageItems`、query request page | entry-local page size 只能收窄 startup ceiling，不得扩大或 silent clamp | current query entry rejected；不产生 write/refresh |
| `CF-BOUNDARY-03` | `boundary.maxPathScopeItems`、explicit path scope | path set 必须在 canonicalization 后计数；超过上限不得截断后继续 clone/pull/status/push-review/apply | current entry rejected；不调用 local apply |
| `CF-BOUNDARY-04` | `boundary.maxTargetScopeItems`、`jobs.maxBatchItems` | job target scope 和 batch 均不得超过 startup ceiling；job input 只能收窄 | startup fail-fast 或 current job rejected |
| `CF-BOUNDARY-05` | `boundary.maxDiagnosticItems`、support presenter | safe diagnostic 输出必须 bounded；超限只能按既有 degraded/presenting 语义处理，不宣称 complete | startup fail-fast；单次呈现按既有 bounded result 处理 |
| `CF-EXEC-01` | all `execution.*` timeouts | 每项为 finite safe positive integer；单位固定为 Step 7 的 milliseconds；不得将 timeout 配成 generic retry 或 timeout-as-not-happened | startup fail-fast |
| `CF-EXEC-02` | `execution.maxConcurrentMutations`、`jobs.maxParallelItems` | job parallelism 不得超过 composition mutation ceiling；并发预算不能替代 target lock、expected version 或 UoW | startup fail-fast 或 current job rejected |
| `CF-EXEC-03` | `execution.shutdownTimeout`、in-flight operation | shutdown 只能停止接收新入口并保留 unknown/needs-action 语义；不能用 timeout 伪造 terminal result | startup fail-fast if invalid；运行时沿既有 recovery flow |
| `CF-JOB-01` | `jobs.maxBatchItems`、`boundary.maxTargetScopeItems` | batch ≤ target scope ceiling；job input 可提供更小 bounded 值，不可更大 | startup fail-fast 或 current job rejected |
| `CF-JOB-02` | `jobs.maxParallelItems`、`execution.maxConcurrentMutations` | parallel ≤ mutation ceiling；每 item 仍使用独立既有 UoW/version 语义 | startup fail-fast 或 current job rejected |
| `CF-META-01` | three `metadata.*AdapterRef` slots | 每个 slot 独立做 ref shape 与 capability validation；同 ref 可实现多个 slot，但不能因此合并 logical store/UoW/lock 证明 | malformed → startup fail-fast；contract gap → affected mutation blocked/unknown |
| `CF-META-02` | metadata refs、selected profile | test/in-memory ref 只允许 test composition 或明确 P0 local posture；不得在 integration-like/未来 production-like 伪装 durable bound | profile/candidate reject 或 capability remains blocked |
| `CF-SDK-01` | `sdk.sdkProfileRef`、`credentialProviderRef`、其余 SDK refs | profile/provider 必须是允许的 opaque ref；provider 解析不把 raw material 传给 config/application/domain | malformed → startup fail-fast；resolver/contract gap → affected route blocked/unknown |
| `CF-SDK-02` | owner/source/handoff/decision/probe slots | 每个 external capability 独立分类；owner access 不推出 source authority，handoff ACK 不推出 accepted/Decision/readiness | route preflight blocked/unsupported/unknown；不创建外部 truth |
| `CF-TOOLS-01` | Git observation/worktree、filesystem inspection/apply、root policy refs | observation/apply 分离；root policy 必须和 inspection/apply 安全边界相容；不接受 shell/argv/remote/refspec/merge fields | malformed/unsafe → startup or current-entry reject |
| `CF-TOOLS-02` | local tool refs、explicit target/path input | target/path 必须显式、bounded、canonical；dirty/untracked/path/symlink/lock unknown 时不继续、不覆盖用户修改 | current entry rejected or route blocked; no local effect |
| `CF-SUPPORT-01` | `support.redactionPolicyRef`、diagnostics | policy 必须覆盖 forbidden secret/body/path/output classes，且高优先级 source 只能收紧不能放宽 | startup fail-fast；不构造可写 graph |
| `CF-SUPPORT-02` | `support.digestAdapterRef`、`digestAlgorithmRef`、idempotency context | adapter 与 algorithm ref 必须相容；不得隐式切算法、以 Git ref/body hash替代或重算既有 truth | startup fail-fast；不创建新 composition |
| `CF-OPS-01` | `operations.*` nullable refs、profile | `null` 只表示未提供/未注册；non-null 仍需正式 contract 和 exact capability；不得由 ref 合成 topic、schedule、actor、scope 或 key | null → remain unregistered；malformed → startup fail-fast；contract gap → blocked/current job rejected |
| `CF-OPS-02` | operations slots、source/handoff/review redlines | consumer/job registration 不能改变 Project/Artifact/Baseline/Gate/Workspace/Archive/Git ownership，不能绕过 Review Gate 或把 ACK 升格 | whole-candidate reject if override appears |
| `CF-HARD-01` | every source and every raw section | unknown key、alias、duplicate key、JSONC/comment、forbidden body、implicit selection、auto merge/rebase/push/stash、provenance delete/repair 等 hard-boundary intent 一律拒绝 | whole-candidate reject; no fallback |
| `CF-HARD-02` | all high-priority overlays | overlay 存在但非法时不得回退 file/default/cache/old snapshot；source unavailable、invalid、unsupported、adapter blocked 必须保持可区分 | source-dependent fail-fast or typed blocked/unknown; never success fallback |

### 6.5 生效方式与冻结矩阵

| 生效边界 | 读取 / 冻结内容 | 允许的输入 | 不允许的覆盖 | 失败处理与历史语境 |
|---|---|---|---|---|
| startup / cold composition | `identity`、`boundary`、`execution`、`metadata`、`sdk`、`localTools`、`support`、`operations` 全部 42 leaf；以及经验证的 `jobs` baseline | selected strict JSON、allowlisted environment、仅明确 `default_allowed` 的 approved default | entry-local request、job input、旧 snapshot、cache、fake、日志或 ACK 不能覆盖 startup invariant | 任一 required leaf/structure/cross-field/hard-boundary 失败：不产生 `ValidatedSyncRuntimeConfig`、snapshot、graph 或 facade |
| job-run-start | 既有 `SyncJobBudgets` 的 run-local pin、显式 job scope/target/replay input | current explicit job request 在 startup ceiling 内的收窄值 | 不改 actor、project/version/source/target authority、idempotency key/digest、UoW、state、dirty guard 或 global config | 当前 job rejected；既有 composition 和其他 runs 不变；不创建副作用 key |
| entry-local | 既有协议允许的 profile/source selector、project/version/source/target/path/conflict/resume request | caller 显式输入，经 03 request/permission/path/state guard 校验 | 不得生成 implicit latest/default、覆盖 profile/config、改变 owner truth、扩大 scope 或触发 hidden write | current entry rejected/blocked/unknown；Query 仍 zero-write |
| test harness | deterministic refs、fixed Clock/ID/Digest、test adapter seeds | test-only composition and de-identified fixtures | 不得流入 production-like composition，不得把 fake 标为真实 `bound` 或生成 integration evidence | test composition fail-fast（设计姿态，不是已运行测试）；不影响其他 composition |
| reload | P0 无可生效配置 | 只可作为明确请求被识别 | last-known-good、部分替换、热重绑、旧对象 rebinding 均禁止 | `UnsupportedReload` 设计级 issue；旧 composition 保持不变；不产生新 facade |
| hot | P0 无可生效配置 | 无 | store/adapter/redaction/capability/snapshot 的原地变更禁止 | `UnsupportedReload`/unsupported activation；不改变业务结果或历史记录 |
| build-time/static boundary | 03 已固定的 TypeScript package/runtime 纪律和 domain/ownership/state/UoW/idempotency/redaction 不变量 | 正式设计变更流程 | 不得以 JSON/env/profile 重新定义 Port、DTO、error、state、flow、source authority 或 comparator | 配置 candidate reject；若需求确实改变，先回流 03/上游 owner |

冻结规则：每个成功的 cold composition 只生成一个新的 immutable `AdapterCapabilitySnapshot`；`SyncOperation`、`MaterializationPlan`、`ReviewCandidate`、`HandoffAttempt` 继续引用各自创建时的 `runtimeBindingSnapshotRef`。配置变化、provider rotation 或 profile 变化不会改写在途对象，也不会使旧 unknown attempt 自动重放。

### 6.6 Runtime builder assemble target table

本表把既有 `ValidatedSyncRuntimeConfig` family 映射到 03 已定义的 composition seam。表中的 target 是装配目标和注入边界，不是已经存在的文件、类、adapter 实例或健康证明；不新增 runtime type、Port、DTO、state 或 scheduler。

| validated group | 03 既有 assemble target | composition 阶段 | 可暴露给 | 不可暴露给 | 失败 / capability 姿态 |
|---|---|---|---|---|---|
| `identity.*` | `ValidatedSyncRuntimeConfig.configRef/profileRef` 与 composition context | source/validation 完成后、任何 adapter 前 | composition、entry boundary | Domain、Project/version/source/target owner 选择 | canonical mismatch → no composition；profile conflict → entry/startup reject |
| `boundary.*` | `SyncBoundaryLimits` 的既有 typed 值 | validation 后、entry/mapper graph 前 | decoder、query mapper、job/path validators | domain state machine、permission evaluator | invalid → startup fail-fast；entry limit violation → current entry rejected |
| `execution.*` | `SyncExecutionBudgets` 的既有 typed 值 | validation 后、wrapper/scheduler 组装前 | local/SDK/effect wrappers、shutdown coordinator、composition concurrency guard | generic retry policy、state transition logic | invalid → startup fail-fast；单次 timeout 由既有 disposition 映射 |
| `jobs.*` | `SyncJobBudgets` 与显式 job-run frozen params | startup validation；job-run-start pin | explicit job entry/runner | actor/scope/key/scheduler truth | invalid startup → no composition；run-local invalid → current job rejected |
| `metadata.*` | logical `.qs-sync` store/UoW/lock、repositories、`RuntimeBindingSnapshotRepository` seam | Clock/ID/Digest 后、local tools 前 | application repositories/UoW/lock ports、snapshot ensure path | physical schema/DSN、Domain truth、raw provider material | missing/malformed → no composition；contract gap → mutation graph not built，binding blocked/unknown |
| `localTools.*` | Git observation/worktree、filesystem inspection/apply、allowed-root policy adapters | metadata seam 后 | Command/Query local boundary、path safety guard | arbitrary shell/argv、Git remote truth、merge/rebase/push strategy | unsafe root/tool → startup or entry reject；unknown safety → no apply |
| `sdk.*` | owner/source/handoff/decision/probe adapter registry and existing inward ports | local tools 后 | application flows through formal ports | provider payload、sibling DTO、local permission/Review truth | malformed → no composition；surface/contract gap → affected capability blocked/unknown |
| `support.*` | diagnostics/redaction/Clock/ID/Digest providers and safe-output hooks | external adapters 后、capability classification 前 | adapter wrappers、application instrumentation boundary、snapshot factory | raw exception/body、full sensitive ref、evidence/readiness | unsafe redaction or incompatible digest → no composition；sink call failure isolated |
| all groups | one `AdapterCapabilityBinding` per existing `SyncAdapterCapability` plus immutable `AdapterCapabilitySnapshot` | after all static binding checks | read-only graph and route preflight | raw source, mutable config, health/readiness claim | missing/duplicate capability mapping → no snapshot and no facade |
| `operations.*` | existing conditional consumer/job registration slots | after snapshot and route capability classification | operations entry only when formal contract/capability permits | topic/schema/schedule/daemon truth, automatic business action | `null` remains unregistered; non-null but blocked remains blocked; no positive registration claim |

Assembly invariants:

1. `src/config/*` is the only raw-source reader. `src/composition/*` receives validated config and performs the existing builder sequence; adapters receive only their local binding family.
2. The read-only graph is constructed without UoW, write repository, lock, handoff, probe, or diagnostic-emit capability. A Query may read the current composition snapshot but cannot `ensure` a snapshot or repair metadata.
3. The mutation facade is exposed only after required static bindings, redaction safety, snapshot allocation, and route graph construction succeed. Per-entry capability preflight remains mandatory; facade exposure is not a readiness claim.
4. Conditional Consumer/Job slots are registration intents. A non-null ref never creates a private topic, scheduler, actor, scope, idempotency key, or external effect.

### 6.7 Config validation issue surface and capability separation

以下是配置设计层的 issue classes 和安全字段边界，**不是**要求实施时新增同名 public error enum。正式 error mapping 仍以 03 既有 error/recovery contract 为准；若实施需要改变该 contract，必须回流 03 后再进入后续文档。

| 层级 / issue class | 触发条件 | 允许携带 | 不得携带 | composition / entry 结果 |
|---|---|---|---|---|
| source selection | selected source 缺失、不可读、source 冲突或 unsupported source | source kind、bounded profile class、safe issue ref | source path、raw document、environment value、secret | no candidate；startup or current entry rejected |
| `ParseFailed` | 非严格 JSON、注释/尾逗号、截断或语法错误 | safe source kind、redacted location class、issue ref | raw body、parser dump、stack | no typed config；startup fail-fast |
| `DuplicateKey` / `AliasCollision` | 同一 source 重复 canonical key、alias/大小写/归一化路径碰撞 | section/field class、issue ref | duplicate values、raw candidate | whole-candidate reject；不采用最后一次覆盖 |
| `UnknownField` / `ForbiddenField` | closed section 外的 key、禁止配置化字段、topic/schedule/command 等 | section/field class、hard-boundary rule ref | attempted value/body/command | whole-candidate reject；不 warning、不忽略 |
| `MissingRequired` | 38 个 non-nullable leaf 或 required section 缺失 | section/leaf class、issue ref | source body、secret | startup fail-fast；不回退低优先级 |
| `InvalidType` / `InvalidRange` | scalar/object/list/nullability、safe integer、单位或正数约束失败 | expected type/range class、section/leaf class、issue ref | raw sensitive value、full candidate | startup fail-fast 或 current job/entry rejected |
| `InvalidRef` | opaque ref grammar、canonical identity、profile/ref class 不合法 | ref class、section/slot、issue ref | full ref、endpoint、credential/path body | startup fail-fast；不把 malformed ref 分类为 blocked/bound |
| `SensitiveContent` | raw secret、token、provider payload、file body、Git output、endpoint credential 出现 | forbidden-content class、issue ref | detected material、hash、截断原文 | whole-candidate/entry/job reject；不落任何输出面 |
| `CrossFieldConflict` | profile/budget/adapter/redaction/registration 关系非法 | involved section classes、rule id、issue ref | raw values when sensitive | startup fail-fast 或 current job/entry rejected |
| `ForbiddenInvariantOverride` | ownership、state、UoW、idempotency、query write、dirty guard、review/provenance redline 被配置 | invariant class、issue ref | attempted payload | whole-candidate reject；不降级为 warning |
| `UnsupportedSource` / `UnsupportedActivation` | config center/admin/reload/hot 等 P0 不支持 source/activation | source/activation kind、profile class、issue ref | source body、old snapshot | reject request；旧 composition unchanged |
| capability classification | ref 语法合法但 adapter contract 未闭合或无法安全判断 | exact capability、`blocked/unsupported/unknown`、safe blocker/issue ref | health claim、owner body、provider response | snapshot may exist with conservative posture; affected route preflight blocks |
| per-call disposition | 已分类 capability 的单次调用返回 unavailable/denied/invalid/unknown | existing call disposition、bounded correlation/issue ref | raw external/local output | existing operation/query result layer; no config fallback or promotion |

Issue surface rules:

- 失败先裁剪、后序列化；不得把完整 raw candidate、exception、provider response 或 command output 交给 logger/diagnostics 再依赖 sink 清洗。
- `blocked`、`unsupported`、`unknown` 是 capability/route posture，不是 parse success，也不是 configuration success；它们不能被低优先级 default、fake、cache、ACK 或 log 改成 `bound`。
- `bound` 只表示既有 static constructor/capability validation 通过；它不证明授权、健康、source freshness、Git clean、Review accepted、Artifact/Baseline 或 readiness。
- issue ref、blocker ref 和 change marker 是安全关联值；full sensitive ref、raw path、body、secret、diff、stdout/stderr、evidence/report/verdict/signoff/readiness 永不进入 issue surface。

### 6.8 配置域加载校验停审记录

| 配置域 / 组 | 必填与结构 | 类型 / 交叉校验 | 生效 / 失败 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|
| `identity` | 2/2 leaf；closed object；无隐式 identity | canonical config ref、P0 profile allowlist、selector conflict | cold composition；invalid 不产生 snapshot | 仅承接既有 refs | 通过（带上游 blocker） |
| `boundary` | 5/5 required positive leaves | safe integer、unit、page/path/target ceiling | cold；超限 entry reject，不截断成功 | 仅承接 `SyncBoundaryLimits` | 通过（带上游 blocker） |
| `execution` | 8/8 required positive leaves | timeout/result-layer、concurrency、no generic retry | cold；timeout 沿既有 disposition | 仅承接 `SyncExecutionBudgets` | 通过（带上游 blocker） |
| `jobs` | 2/2 required positive leaves | batch/parallel 与 boundary/execution 关系 | startup baseline + run-start pin；invalid job reject | 仅承接 `SyncJobBudgets` | 通过（带上游 blocker） |
| `metadata` | 3/3 required refs | store/UoW/lock independent capability checks | malformed fail-fast；contract gap 不构造 mutation graph | `SYNC-UP-006` 保持 | 通过（带 `SYNC-UP-006`） |
| `sdk` | 7/7 required refs | provider/profile 与 owner/source/handoff/decision/probe 分离 | malformed fail-fast；positive gap blocked/unknown | `SYNC-UP-001~005/008` 保持 | 通过（带上游 blocker） |
| `localTools` | 5/5 required refs | root/inspection/apply/non-overwrite safety | unsafe reject；unknown 不 apply/不当 clean | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` 保持 | 通过（带上游 blocker） |
| `support` | 6/6 required refs | redaction deny、digest compatibility、deterministic test ceiling | unsafe fail-fast；sink failure 隔离 | 只承接 support family | 通过（带上游 blocker） |
| `operations` | 4 nullable slots | null/ref、formal contract、profile/capability | null 未注册；blocked 不升级；malformed fail-fast | 不新增 consumer/topic/scheduler contract | 通过（带上游 blocker） |

逐域停审结论：42 个 leaf 均有 parse、type/range/ref、cross-field、生效和失败归属；没有把合法 ref 当作 `bound`，没有把 optional `null` 当作 disabled/healthy/ready，也没有用 profile 或 test double 绕过 ownership、review、dirty-worktree、provenance 或 evidence boundary。

### 6.9 跨加载校验审计表

| 审计项 | 结论 | 证据 / 修正 |
|---|---|---|
| Step 7 的 42 个 leaf 是否全部有加载时机和失败策略 | 通过 | `identity 2 + boundary 5 + execution 8 + jobs 2 + metadata 3 + sdk 7 + localTools 5 + support 6 + operations 4 = 42`；§6.2、§6.8 逐域覆盖 |
| required 与 nullable 是否一致 | 通过 | 38 个 non-nullable leaf startup required；4 个 operations slot 只允许 `null` 或合法 opaque ref；空字符串不表示 null |
| strict JSON / JSONC 边界是否清楚 | 通过 | §6.1、§6.7 明确运行时拒绝注释、尾逗号和宽松语法；JSONC 只作文档示例 |
| duplicate key / alias / unknown / forbidden key 是否 whole-candidate reject | 通过 | `DuplicateKey`、`AliasCollision`、`UnknownField`、`ForbiddenField` 和 `CF-HARD-01` 均拒绝，不采用最后一次覆盖 |
| 高优先级非法值是否会 fallback | 无 | `CF-HARD-02` 和来源纪律固定 fail-fast；不回退 file/default/cache/旧 snapshot |
| 数字是否完成类型、范围、单位和跨项校验 | 通过 | 所有 number 为 finite safe positive integer；bytes/items/paths/records/ms 单位在 Step 7 和 §6.2/6.4 回指；不 clamp、不无限化 |
| profile 是否会隐式选择 Project/version/source/target | 不允许 | `CF-PROFILE-01/02`、entry-local 冻结矩阵和 00/03 显式选择红线 |
| job input 是否能覆盖 startup invariant | 不允许 | 仅允许新 run 的 bounded 收窄值；不改 actor、scope、key、state、UoW、idempotency、dirty guard 或 owner truth |
| metadata logical capability 是否被物理 backend 语义替代 | 无 | 仅绑定既有 store/UoW/lock/snapshot seam；`.qs-sync` physical schema、migration、retention 继续 blocked |
| SDK/owner/source/review/Decision/probe 是否发生能力串联 | 无 | 每个 slot 独立分类；owner access 不推出 source/handoff，ACK 不推出 accepted/Decision/readiness |
| Git/filesystem 是否允许任意命令、remote 或覆盖 dirty worktree | 不允许 | localTools 只接受 typed refs；root/dirty/path/symlink/lock unknown fail-closed；LFS/shallow/GUI 不进 schema |
| sensitive/raw body 是否进入 issue、snapshot、metadata 或 telemetry | 不允许 | sensitive scan 在 typed config 前；§6.7 只允许 safe issue refs；Step 8 redaction boundary 继续有效 |
| redaction/digest 是否可能被高优先级 source 放宽或隐式切换 | 不允许 | `CF-SUPPORT-01/02`；unsafe policy/不兼容 algorithm startup fail-fast |
| reload/hot 是否有无回滚缺口 | 不适用（P0 明确拒绝） | `UnsupportedActivation` whole-request reject；不做 last-known-good、half-graph 或旧对象 rebinding |
| builder 是否可能在 Ready 前暴露 facade | 不允许 | §6.1、§6.6：先完成校验、静态 binding、snapshot、graph，再暴露；失败无 snapshot/facade |
| read graph 是否持有 mutation 能力 | 不允许 | read-only graph 不含 UoW/write/lock/probe/diagnostic-emit；Query zero-write |
| operations null/ref 是否会创建 scheduler/topic/daemon | 不允许 | `CF-OPS-01/02`；null 未注册，non-null 仍需 formal contract/capability；不生成 scope/key |
| source validation、capability classification、单次 call disposition 是否分层 | 通过 | source/parse issue、snapshot availability、per-call disposition 分别记录；不混为 `ready` |
| 03 是否需要新增 runtime type/Port/DTO/error/state/flow | 当前不需要 | 本 Step 只细化既有 family、builder 顺序和 issue surface；issue class 为设计索引，不锁新 error enum |

跨加载审计结论：当前没有 unresolved 的必填、类型、范围、交叉字段、热生效或 builder 暴露缺口。上游 blocker 仍限制 positive capability；它们不被配置加载设计关闭，也不阻塞本 Step 的冷生效契约。

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| runtime 只接受 strict JSON；JSONC 仅作文档示例 | 否 | source/parse 规则细化 | 不适用 | 无回写 |
| source → parse → structural scan → type/range/ref → sensitive/hard-boundary → cross-field → composition 顺序 | 否 | 承接既有 loader/validator/composition seam | 不适用 | 无回写 |
| 42 leaf 的 required、nullable、单位和 profile-specific cross-field 规则 | 否 | 既有 `ValidatedSyncRuntimeConfig` family 的配置语义 | 不适用 | 无回写 |
| P0 startup/cold、job-run-start、entry-local、test harness 的生效边界 | 否 | 承接既有 immutable snapshot pinning 与 explicit request flow | 不适用 | 无回写 |
| reload/hot 作为 unsupported activation whole-request reject | 否 | 承接 03 当前无 hot update 规则；不引入 lifecycle | 不适用 | 无回写 |
| builder 必须在 Ready-equivalent composition 完成后才暴露 graph/facade | 否 | 承接既有 builder 顺序和 read/write graph isolation | 不适用 | 无回写 |
| issue surface 采用 redacted safe refs，区分 source/config issue 与 capability disposition | 否 | 承接 03 observability/redaction/error recovery；不锁新 error enum | 不适用 | 无回写 |
| future reload、last-known-good、secret provider contract、product-specific constructor、new source/adapter/slot 或 scheduler | 是（未来触发） | 会改变 runtime config、builder、lifecycle、error、rollback 或 operations contract | 03 §13、Step 12/14/18 及受影响上游 owner contract | 阻塞待确认（未来变更；当前不进入正式 04） |

当前计数：`待回写=0`；`阻塞待确认=0`（最后一行是未来触发条件，不是当前待回写项）。`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 继续保持原状态。

## 8. 回填草稿（未来正式 `04-配置设计.md` §9）

> 校准来源：
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“配置加载流程图”“配置组加载、校验、生效与失败总表”“按配置域组织的加载 / 校验 / 生效表”“Cross-field validation matrix”“Runtime builder assemble target table”“Config validation issue surface”“加载校验停审记录”和“跨加载校验审计表”。

正式 §9 应按以下顺序回填，不新增本文件以外的配置项或代码契约：

1. 先声明运行时只接受 strict JSON，JSONC 仅用于文档示例；列出 source precedence 和 whole-candidate reject 规则。
2. 回填 §6.1 流程图，并保留 source selection、duplicate/alias/unknown/forbidden scan、sensitive validation 和 cross-field validation 的先后关系。
3. 回填 §6.2 的配置组总表和 §6.3 的域表，确保 42 leaf 的加载时机、parse/type/range/ref、cross-field、assemble target、生效和失败策略可逐项追溯到 Step 7/8 与 03。
4. 回填 §6.4 交叉校验矩阵，特别保留 profile 不得隐式选择业务对象、job input 只能收窄、ref 不等于 bound、operations null 不等于 ready、dirty/unknown 不继续和 ACK 不升格等红线。
5. 回填 §6.5 生效/冻结矩阵和 §6.6 builder target；明确新 composition 生成新的 immutable snapshot，在途 operation/plan/candidate/attempt 继续旧 ref。
6. 回填 §6.7 issue surface 与 §6.9 audit；不得把 issue class 当成已实现 error enum，也不得把 capability posture 当成健康、授权、accepted、evidence 或 readiness。

正式正文不得：

- 写入未在 00～03、Step 5～9 或用户确认中出现的 parser/package/provider/endpoint/tool/version/physical schema；
- 把文档示例数字/ref/profile 写成 operational default、部署实例、SLO、测试结果、artifact/report/evidence、review verdict、signoff 或 readiness；
- 把 `blocked/unsupported/unknown`、`null`、上传 ACK、Git commit、诊断 receipt 或本地 job report 升格为 positive platform truth；
- 暗示 P0 存在 reload/hot、auto merge/rebase/push、dirty overwrite、hidden query write、fallback fake、provenance delete 或 review gate bypass。

## 9. 待确认事项与当前处理

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| exact parser duplicate-key detection and validator package | 实施层 parser/validator 选择；可能影响本地 `SYNC-LOCAL-004` | 本 Step 只要求可观察的 duplicate/alias reject 语义，不锁 package、函数或实现；保持 `local_pending` |
| exact numeric ceilings / capacity sizing | production-like tuning、Step 10 audit 和 Step 11 failure matrix | 仅要求 positive safe integer 和已定义关系；Step 7 文档数字仍是 candidate，不是默认/SLO |
| secret provider resolution boundary | 可能改变 03 adapter constructor 或 lifecycle | P0 只校验 opaque ref；adapter-private resolution 若获授权需先回写 03，当前保持 blocked/unknown |
| future reload / last-known-good / hot rotation | 会改变 builder、snapshot、audit、rollback | P0 whole-request reject；Step 13/14 仅登记演进触发，不创建开关 |
| exact physical `.qs-sync` backend/schema/migration/retention | metadata capability 和 recovery | 仅 logical refs/contract；`SYNC-UP-006` 持续 blocker，不用 loader 伪造 bound |
| SDK/source/permission/handoff/Decision/probe exact method/schema/error/version | positive route capability | 只保留 typed adapter slots；`SYNC-UP-001~005/008` 持续 blocked/unknown |
| Git executable/library、filesystem implementation、LFS/shallow/GUI support | local observation/apply capability | 只保留 typed refs；`SYNC-UP-007/009/010`、`SYNC-LOCAL-001~005` 持续 pending |
| formal Consumer/Job transport and runner contracts | conditional registration | nullable slots remain null/blocked；不创建 topic、daemon、schedule 或 private transport |
| implementation error enum mapping | 可能影响 03 error surface | 本 Step issue classes 只是审查索引；若需新增 enum，先回流 03，再由后续文档承接 |

这些事项不构成当前 Step 的 unresolved 设计缺口；它们是外部合同、实施选择或未来演进门禁。任何事项一旦要求新增 code shape，必须在正式 04 前回流 03，并重新审查受影响 Step。

## 10. Step 9 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已回答 SOP Step 9 的八个问题 | pass | §4；覆盖时机、parse/type、cross-field、activation、failure、逐组一致性、逐域停审和跨域审计 |
| 已输出配置加载流程图 | pass | §6.1；含 source、strict parse、结构扫描、校验、assembly、snapshot、graph 和 registration |
| 已覆盖 42 leaf 的加载/校验/生效/失败 | pass | §6.2、§6.3、§6.8；与 Step 7 required/nullability 和 Step 8 sensitive boundary 对齐 |
| 类型、范围、ref grammar 和 forbidden-content 校验明确 | pass | §6.2、§6.4、§6.7 |
| cross-field 校验覆盖 profile、limits、jobs、metadata、SDK、tools、support、operations | pass | §6.4 `CF-*` 矩阵 |
| source/config issue、capability posture、per-call disposition 分层 | pass | §6.7；不把 blocked/unknown 当 parse success 或 readiness |
| runtime builder assemble target、read/write graph isolation、facade gate 明确 | pass | §6.6；只承接 03 既有 seam |
| startup/job-run-start/entry-local/test/reload/hot/build-time 边界明确 | pass | §6.5；P0 reload/hot whole-request reject |
| high-priority invalid 不 fallback；JSONC/duplicate/alias/unknown/forbidden reject | pass | §5.2、§6.1、§6.4、§6.7、§6.9 |
| 每个配置域完成停审，跨加载审计无 unresolved 缺口 | pass | §6.8、§6.9 |
| 对 03 的影响判定已记录且当前无待回写 | pass | §7；未来变更触发已明确回流 03 |
| 未新增 runtime type/Port/DTO/error/state/flow；未伪造实现事实 | pass | §2.2、§6.7、§7、§9 |
| 正式 04 仍未创建；未实现代码、未运行测试、未提交 commit | pass | 台账和工作区审计 |

### Step 9 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

本 Step 已闭合配置加载、严格解析、结构/类型/范围/ref/敏感/交叉校验、冷生效、builder 装配目标、facade 暴露门禁和 P0 reload/hot 拒绝。允许的下一动作是：更新 `04_config_calibration_flow.md` 与 `project_execution_ledger.md`，然后进入 Step 10「变更、审计与回滚」。在用户或流程允许前，不创建 Step 10 文件，不创建正式 `04-配置设计.md`。
