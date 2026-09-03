# L2-member-images 04 配置设计 Step 11：失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11  
> 回填位置：正式 `04-配置设计.md` §11“失效模式与降级 / fail-fast 策略”  
> 本 Step 只定义 P0 输入失败、selector 不可验证与可用性 marker 的配置层行为；不定义告警平台、secret provider、config center、外部调用、修复任务、重试参数或运行时恢复。

## 1. Step 状态、目标与执行计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11：定义失效模式与降级 / fail-fast 策略 |
| 当前状态 | `completed`；P0 failure matrix、五域处理、activation/recovery boundary 与跨失效审计已完成 |
| 输入基线 | Step 5 来源优先级；Step 7 P0 配置项；Step 8 敏感边界；Step 9 loading/activation；Step 10 change/rollback；正式 03 的错误、配置、观测边界 |
| 输出文件 | `design-calibration/04_config_step_11_failure_degradation.md` |
| 本 Step 后动作 | 仅可按串行门禁创建并完成 Step 12；正式 04 仍不得写入 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断/取舍 | 结构化产物 | 03 影响判定 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| failure vocabulary | done | done | done | done | done | done | `pass` | 进入 five-domain matrix |
| composition / local / static failures | done | done | done | done | done | done | `pass` | 进入 external / diagnostics |
| external / diagnostics failures | done | done | done | done | done | done | `pass` | 进入 activation/recovery audit |
| cross-failure audit | done | done | done | done | done | done | `pass` | 允许创建 Step 12 |

## 2. 本步边界、输入与 SOP 问题回答

### 2.1 本步目标与非范围

本 Step 规定：P0 配置的 parse、schema、source、type/ref-shape、sensitive、cross-field 或 required-slot 失败，必须在 builder 之前或过程中停止为 `Blocked`，不得借由默认值、缓存、LKG、fake、retry 或 live repair 继续。可选 external boundary selector 的未知/不可验证只可冻结为保守 marker；它并不构成配置成功以外的外部结果，也不允许 config layer 调用 provider。

| 本 Step 覆盖 | 本 Step 不覆盖 |
|---|---|
| 缺失、strict JSON 错误、非法高优先级 env、typed ref、sensitive、交叉字段、slot 装配失败 | JSON/env 以外的 remote config source、config center、admin override、provider health API |
| 失效时的 `fail-fast`、`fail-closed`、`conservative marker`、`unsupported` 与显式 restart recovery | runtime retry/backoff、scheduler、repair、cache、projection recovery、container/host 生命周期 |
| 可安全形成的 issue/marker/log/metric test cut 类别 | alert backend、SLO、阈值、notification、report/evidence、runbook 或真实告警结果 |
| selector 过期/漂移的 next-startup 保守处理 | digest/fingerprint 算法、持续 drift 检测、Artifact/build provenance 或发布回滚 |

### 2.2 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | completed | 继承唯一 source chain、非法高优先级 source 不回退与 safe absence 语义。 |
| `04_config_step_07_config_items.md` | completed | 继承五域 21 个 P0 item、必填性、scope 与 failure policy。 |
| `04_config_step_08_sensitive_secrets.md` | completed | 继承 raw secret/body/restricted policy 禁止、selector 轮换与 output redaction。 |
| `04_config_step_09_loading_validation_activation.md` | completed | 继承 parse、validate、assembly、typed exposure、startup-only、issue surface 与 `Assembled/Blocked`。 |
| `04_config_step_10_change_audit_rollback.md` | completed | 继承 rejected candidate、prior validated input、restart rollback 与无 LKG/online switch。 |
| `03_ddd_step_12_error_recovery.md`、`03_ddd_step_14_config_dependencies.md`、`03_ddd_step_15_observability_audit.md` | current calibration input | 继承 safe error/marker、config binding、local no-readiness、planned safe signal边界。 |
| `L1-governance` 04 Step 11 | format / granularity reference | 参考术语、失效矩阵、activation、测试切口与交叉审计粒度；不继承 config center、outbox、job、外部治理或观测事实。 |

### 2.3 SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 必填配置缺失时系统如何处理？ | `composition` 必填项、local composition 所需三 slot、当前 scope 所需 static slot 任一缺失或不可验证，effective config 不成立，assembly 为 `Blocked`，不暴露可执行业务 facade。 |
| 类型、范围或交叉字段错误时如何处理？ | P0 只接受 schema-known strict JSON、allowlisted env 与 opaque selector；unknown/duplicate/type/enum/ref-shape/collection/profile-mode-scope 等错误均 reject 整份 effective config。不存在范围型 threshold、retry、TTL 或 retention 参数可“折中”采用。 |
| secret / KMS / Vault 不可用时如何处理？ | P0 不读取 raw secret，也不定义 KMS/Vault/provider。因此这些依赖不是当前配置 source；若 raw material 出现，fail-closed。未来 secret provider 必须先重开 03/04；其不可用不能 fallback 到 raw file、fake 或 LKG。 |
| config center 不可达时如何处理？ | P0 没有 remote config center/admin override；此类 source 不被接受，不存在运行期不可达后的 fallback。未来引入会改变 source/adapter contract，须重新设计。 |
| 配置漂移或过期如何发现和处理？ | P0 不具有连续 drift detector、version/digest algorithm 或 expiry authority。每次显式的新 startup/rollback 输入都必须重新按当前 schema、profile、owner/kind/mutable 和 scope 校验；无法再验证的 input 按缺失/unknown/owner-gap 处理为 `Blocked`/`Gap`。运行中的 frozen P0 不被在线改写。 |

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 位置 | 已有结论 | 本 Step 补齐 / 保持的边界 |
|---|---|---|
| Step 7 | 每项已列失败策略，但缺少跨域语义和 public 可见口径。 | 收口 P0 config invalid、required static/local gap、optional external marker 和 diagnostics floor 的区别。 |
| Step 8 | raw material、full ref、body 不得进入普通配置/输出。 | 明确安全失败是 fail-closed，不可作为 degraded 或“继续运行”。 |
| Step 9 | builder 只产生 `Unassembled/Assembled/Blocked`，可选 external slot 可冻结 marker。 | 明确 `Assembled` 与 optional marker 并存时也没有 external readiness；invalid config 从不降级为 marker success。 |
| Step 10 | rollback 是 prior validated input 的新启动流程。 | 明确 prior input 无法再验证时回退也拒绝，不能调用 LKG。 |
| 03 error/recovery | Query 只读、当前 Command/Job zero-effect、owner gaps 有 safe dispositions。 | config layer 不新增 repair/retry/state transition；受影响 future lane 只承接原有 marker。 |

### 3.2 改动前后对比

| 主题 | 进入 Step 11 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| failure vocabulary | “blocked/unknown/gap”分散在 item/loader 章节 | 定义 fail-fast、fail-closed、conservative marker、unsupported 和 explicit restart recovery 的适用面 | 防止把 marker 当成成功或把配置错误伪装为 degraded。 |
| required 与 optional | 既有 required/optional 描述分散 | required local/static failure 阻止 assembly；optional external 只保存保守 marker | 既保持本地 composition 边界，也不虚构 external availability。 |
| source unavailable | 无 config-center/provider 的显式口径不足 | P0 无 remote source/provider；future trigger 不被写成当前依赖 | 防止临时加入产品/凭据/在线恢复。 |
| drift / expiry | selector mutable/pin 有规则，但没有统一失效收口 | 只在显式下一次启动时重新校验；无 continuous detector、digest 或 live reconciliation | 避免私造版本/观测系统。 |
| observability / test | 有 safe issue surface，未按失效模式归类 | 只给 future 05/06 的 planned cut 和安全字段类别 | 不伪造告警、test/report/evidence。 |

### 3.3 设计取舍

| 议题 | 取舍 | 原因 |
|---|---|---|
| 非法配置是否用 safe default 继续 | 不继续；fail-fast 或 fail-closed。 | P0 selector/slot 影响 composition，safe absence 不是成功默认。 |
| optional external selector 不可用 | 不让 config builder probe/retry；仅保留 marker。 | builder 不拥有 provider call、owner truth 或 recovery policy。 |
| “degraded”是否用于 schema/required error | 不使用。 | invalid config 不是降级服务状态，必须拒绝装配。 |
| redaction policy 缺失 | 使用固定 redaction floor；若提供 weaker/unknown selector 则 reject。 | fixed floor 是唯一可安全缺省，不是开放的 fallback。 |
| config drift 是否在线修复 | 不支持；下一显式启动重新校验。 | P0 startup-only，无 config store/LKG/reload contract。 |

## 4. 失效策略术语与总原则

| 术语 | 本项目的严格含义 | 可出现的位置 | 不得误读为 |
|---|---|---|---|
| `fail-fast` | 在 source collection、parse、validation 或 mandatory slot assembly 时拒绝 effective config，不暴露可执行业务 facade。 | required configuration、schema/type/ref/cross-field、mandatory local/static slot。 | 进程/容器实际已经停止、外部发布失败或业务真相回滚。 |
| `fail-closed` | 安全/不变量边界出现 raw material、body、weakening、fake 或 bypass 时拒绝，且只输出安全类别。 | secret/body、redaction floor、profile/fake、invariant override、online reload request。 | 已产生安全事件、告警或审批结论。 |
| `conservative marker` | 对可选 external boundary 的 `Unknown`/`Unavailable`/`Gap`/`ReopenRequired` 等既有安全 disposition；不调用 provider。 | optional external slot、未闭合 owner contract。 | external capability 启动、降级成功、candidate/digest/gate/Artifact/consumer result。 |
| `unsupported` | P0 明确不接受的 source/operation 被拒绝。 | config center、admin override、reload/hot、LKG、partial apply。 | 将来永远不可能支持；需设计重开才可讨论。 |
| explicit restart recovery | 由外部过程提供另一份或 prior validated body-free input，经全链路重新校验后的新启动。 | 改正候选或回退候选。 | 原地改 live config、自动反转、cache/LKG、host/container 已完成回滚。 |

共同规则：

1. 任何 parse/schema/source/sensitive/cross-field 或 required slot 失败都先于 application/domain/UoW/external positive lane；不产生 mutation、result、trace、event、candidate、digest、Artifact 或 consumer confirmation。
2. `Assembled`只表示 mandatory local composition validation。它可与 optional external conservative marker 并存，绝不构成 build、qualification、Member Service、runtime、container 或 overall readiness。
3. config layer 不调用外部 provider、不做 query-time repair、不执行 retry/backoff、不写 live memory/checkpoint/workspace，也不解除 `DDD-*`、`PF-*`、`MI-UP-*` 或 `Q-MI-*` blocker。
4. 所有可见失败信息仅限 safe error category、config domain/key/slot/seam category、profile/mode category和 opaque issue/marker ref；不含原值或外部正文。

## 5. P0 失效模式表

| 失效模式 | 影响 | 系统行为 | 是否形成安全信号切口 | 未来测试切口 |
|---|---|---|---|---|
| project JSON 缺失且当前 local composition 需要配置 | 无 effective config | `fail-fast`；`Blocked`；不暴露 facade | 是；source category + issue ref | source absent / required config negative case。 |
| strict JSON syntax、JSONC、重复 key、未知 section/key、错误层级 | 输入不可判定 | `fail-fast`；reject whole effective config | 是；parse/schema category | strict JSON / duplicate / unknown-field rejection。 |
| allowlisted env selector 为空、非法、含 body/raw material 或与 JSON 冲突 | 高优先级 source 不可信 | `fail-fast`；不回退 JSON 或 safe absence | 是；source/key category + issue ref | invalid high-priority env must not fallback。 |
| `profile` / `mode` 缺失、未知，或 TestOnly/harness/profile 冲突 | fake/isolation 不能安全判断 | `fail-closed`；assembly `Blocked` | 是；composition category | CI-only fake allowed; all other combinations rejected。 |
| `composition.config_ref` 或 required local store ref 缺失、unknown、owner/kind mismatch | mandatory local composition 不完整 | `fail-fast`；不 begin UoW，不 repair | 是；slot category | required config/local slots block facade。 |
| required static mapping/component/seed/base selector 缺失、mutable、重复、scope/owner/kind mismatch | definition/build input 无法安全绑定 | `fail-fast` for required scope；affected lane `Blocked`/`Gap` | 是；static slot/layer category | no `latest`, no body, no empty collection bypass。 |
| optional external boundary selector 缺失、unknown、owner contract pending 或不可验证 | affected external lane 无安全输入 | 冻结 conservative marker；mandatory scope 则 `fail-fast` | 是；seam category + marker/issue ref | optional marker/no provider call; mandatory scope blocks。 |
| raw password/token/key/cert/DSN/credential/endpoint/provider body、manifest 或 live-state body 出现 | 安全与 ownership 红线被跨越 | `fail-closed`；reject before builder；不回显 | 是；forbidden-material category | redaction/non-leak negative case。 |
| redaction selector weaker、unknown、携带 body 或试图清空 fixed floor | diagnostics 安全边界不可信 | `fail-closed`；reject candidate；缺省仍为 fixed floor | 是；diagnostics policy category | weaker selector / raw-debug bypass rejection。 |
| reload/hot/online override/LKG/partial apply 请求 | 启动期不变量被绕过 | `unsupported`；reject operation；当前 frozen input 不变 | 是；activation category | unsupported reload/no partial apply。 |
| candidate 或 rollback input 在当前 schema/profile/owner/scope 下不再可验证 | 新启动无法形成安全 composition | `fail-fast` 或 required lane `Blocked`；不使用 cache/old body | 是；rollback/source/slot category | previous input must be freshly validated。 |
| frozen input 在运行中被外部替换、过期或漂移 | P0 不支持 live detection/reconciliation | 当前进程不在线改写；下一显式 startup 重新校验，失败则按上表处理 | 仅下一 startup 的安全 validation cut | no online drift repair / fresh validation on restart。 |
| remote config center / secret provider 不可达 | P0 不以其为 source/reader | `unsupported` / not applicable；未来需求需重开设计 | 无当前运行信号事实 | remote source/provider keys rejected or absent。 |

“是否形成安全信号切口”只表示未来可依 03 §14 的 planned log/metric/span 或 safe issue surface观察本地配置 disposition；它不是已有告警、报告、证据、SLO、run id 或运维执行结果。

## 6. 按配置域组织的 failure / degraded matrix

| 配置域 | 失败分类 | 配置层正式处理 | 可暴露的安全结果 | 明确禁止 |
|---|---|---|---|---|
| `composition` | source/parse/profile/mode/config_ref invalid | whole effective config reject；`Blocked`；不让 builder 暴露 facade | safe issue ref、`Blocked` category | implicit profile、Production + fake、低优先级 fallback、online reload。 |
| `local_persistence` | required truth/projection/idempotency binding 缺失/unknown/mismatch | `fail-fast`；local composition 不成立 | required slot `Blocked` + safe issue | begin UoW、cache/repair、fake 或改变 recovery/lease/TTL/retry。 |
| `static_references` | mapping/component/seed/base required slot 缺失、mutable、scope/owner/kind/collection error | required scope `fail-fast`；非 required affected lane 仅 `Gap`/`Unknown` | static slot category + marker/issue | mapping/RoleDefinition/component/seed/base body、`latest`、live state、hardened base/sandbox success。 |
| `external_boundaries` | selector optional unavailable/owner pending；或 mandatory scope invalid | optional 仅 conservative marker；mandatory `fail-fast`；config builder 不 probe provider | `Unknown`/`Unavailable`/`Gap`/`ReopenRequired` 既有 disposition | provider invocation、retry、candidate/digest/registry/gate/Artifact/manifest/confirmation。 |
| `diagnostics` | absent selector；or weaker/unknown/body selector | absent 使用 fixed floor；unsafe supplied selector `fail-closed` | fixed-floor category / safe issue | debug/raw bypass、matched-value output、observability backend config。 |

### 6.1 生效方式到失效处理矩阵

| 生效面 | 检测点 | 处理 | 恢复入口 | 不允许 |
|---|---|---|---|---|
| startup composition | source precheck、strict parse/schema、type/ref/sensitive/cross-field、required slot assembly | fail-fast/fail-closed 或 optional marker；`Unassembled -> Blocked` / local `Assembled` | 修正 candidate 或 prior validated input，重新完整启动 | partial facade、online mutate、cache/LKG、fake fallback。 |
| explicit TestOnly harness | explicit profile/mode/harness、fixture selector、local slots | harness fail-fast/fail-closed；不越过 TestOnly | 修正 fixture selector并重新运行 harness | fixture body、非 CI fake、把测试结果视为 external result。 |
| existing application facade after local assembly | optional external marker 由 future owning port 承接；当前 Command/Job 仍受 B01/B02 停止 | 不改写 existing flow；Query strict no-write，affected lane保持 safe disposition | owner contract/03 reopening 后才可重新讨论正向 lane | config-based execution、provider repair、UoW/recovery、readiness。 |
| change / rollback candidate | Step 10 external input 提交后的 fresh validation | invalid input reject；可验证 input 才能进入新启动 | prior validated input 必须当前仍通过同一校验链 | 自动回退、unvalidated rollback、真正的 host/container orchestration声明。 |

### 6.2 配置失败与既有错误面映射

| 配置层情况 | 组装状态 / marker | 与 03 的关系 | 不得新增 |
|---|---|---|---|
| invalid effective config / mandatory local/static slot failure | `ImageRuntimeAssemblyState::Blocked` | 不暴露 facade；不改变 `ImageApplicationError`、domain error 或 protocol DTO | config error enum、public route/status、result/trace/event。 |
| optional external selector unavailable/pending | existing conservative availability marker | future port 可保守映射 `Unavailable`/`Gap`/`ReopenRequired`；当前不执行 provider | health check、retry queue、external error body、success response。 |
| redaction violation | `Blocked`/safe issue；fixed floor可维持 | 承接 03 safe diagnostic/no-body规则 | debug mode、raw diagnostic persistence。 |
| live-state / runtime recovery request | `unsupported` / `Blocked` | 继续 `DDD-S11-B03`、`DDD-S13-*`、`PF-*`原状 | recovery state machine、cache、lease/TTL、repair job。 |

## 7. 安全观测与测试承接切口

### 7.1 安全信号规则

| 场景 | 允许的 planned 安全字段 | 禁止字段 | 说明 |
|---|---|---|---|
| source/parse/schema reject | source category、section/key category、safe issue ref、local disposition | raw file/env value、JSON fragment、完整 selector | 可由 03 §14 所列 config validation cut 承接。 |
| required/local/static slot failure | slot/layer category、`Blocked`、safe reason/issue category | DSN、component/seed/mapping/base body、owner response | 只是 local composition 诊断。 |
| optional external marker | seam category、marker class、profile category、safe issue/ref | endpoint、credential、provider response、candidate/digest/gate/Artifact/consumer body | 不等 external health/readiness。 |
| sensitive/redaction reject | forbidden material/policy category、safe issue ref | matched material、raw secret/full ref、debug output | fail-closed 不能泄漏被拒绝内容。 |
| restart/rollback validation | activation category、safe change/rollback ref（若外部已提供）、safe disposition | command/container ID、actual restart result、config/image digest | 不拥有 operations execution truth。 |

### 7.2 未来 05/06 的配置失效测试切口

| 测试主题 | 应验证的设计行为 | 禁止断言 |
|---|---|---|
| strict source/schema | JSONC、duplicate key、unknown key、invalid high-priority env 均拒绝且不回退 | 已启动服务、真实告警、report/evidence。 |
| required composition/local/static slots | 缺失/owner-kind/mutable/scope/collection错误为 `Blocked`，无 facade/UoW | build、digest、Artifact/consumer 或 readiness。 |
| profile/fake | 仅 `ci-test + explicit TestOnly`可使用 fake；其他 profile reject | production-like integration成功。 |
| sensitive/no-output | raw material、full ref/body、weak redaction 都拒绝且输出只安全类别 | 真实 secret/provider retrieval。 |
| external optional / mandatory | optional 产生 conservative marker；mandatory scope fail-fast；builder不调用 provider | external availability、candidate/gate/confirmation。 |
| activation/recovery | reload/LKG/partial apply reject；rollback input重新校验 | online rollback或container操作已发生。 |
| drift/expiry | 下一显式启动重新验证不可验证 input，运行中不在线修复 | continuous drift detection、digest matching、自动恢复。 |

这些是计划的设计测试切口，非测试用例、测试执行、报告、证据或验收 verdict。Step 12 将把它们以承接关系交给后续 05/06/07，而不提前创建下游文档。

## 8. 配置失效模式停审与跨失效审计

### 8.1 域级停审记录

| 配置域 / 失效类型 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| source / composition | 缺失、strict JSON、env precedence、profile/fake、reload | 通过 | 任何 invalid source 均 reject；无 LKG/reload。 |
| local persistence | required completeness、UoW/recovery 隔离 | 通过 | 不配置 physical product，也不引入 cache/repair。 |
| static references | pin/mutable/scope/owner/collection、static/live | 通过 | `MI-UP-002/003/006/008`仍为 owner gap。 |
| external boundaries | optional marker、mandatory scope、provider-call absence | 通过 | `MI-UP-001/007`、`Q-MI-003/004`仍阻断正向 lane。 |
| diagnostics | fixed floor、unsafe reject、output redaction | 通过 | 不配置 backend/alert、无 raw output。 |
| drift / expiry / remote source | next-startup revalidation、无 current remote dependency | 通过 | 未定义 continuous detector、provider/center或digest算法。 |

### 8.2 跨失效策略审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险 P0 failure 是否可能 silent fallback | 不允许 | required/invalid均 fail-fast或fail-closed。 |
| 非法 high-priority env 是否可使用 JSON/safe absence | 不允许 | whole effective config reject。 |
| config invalid 是否被写成 degraded / local success | 不允许 | only optional external slot may expose marker；invalid config blocks assembly。 |
| optional external marker 是否可能升级为外部成功 | 不允许 | no provider call、candidate/digest/gate/Artifact/consumer result。 |
| raw material、redaction weaken、fake leak 是否 fail-open | 不允许 | fail-closed且无原值输出。 |
| P0 是否依赖 config center/KMS/Vault/online LKG | 不依赖 | future 要求必须重开设计。 |
| drift/expiry 是否伪造 continuous detector、version 或 digest | 不允许 | only fresh validation on explicit next startup。 |
| 恢复是否改变 UoW/history/live state/recovery blocker | 不允许 | restart input validation不越过03边界。 |
| 观测/测试切口是否伪造告警、结果、evidence或readiness | 不允许 | 只列 planned safe cut。 |
| 是否有当前需回写 03 的结论 | 否 | 见 §9；future trigger未触发。 |

## 9. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| invalid/required P0 input 在 existing loader/builder 前 fail-fast，`Blocked`不暴露 facade | 否 | 细化既有 config/composition failure语义 | 不适用；承接 03 §13 | 无回写 |
| optional external selector 仅产生既有 conservative marker，不调用 provider | 否 | 细化现有 slot/availability边界 | 不适用；承接 03 §13、§11 | 无回写 |
| raw material、weak redaction、fake leak、reload/LKG 为 fail-closed/unsupported | 否 | 承接 03 §13~§14 的安全/activation边界 | 不适用 | 无回写 |
| drift/expiry仅在下一startup重新校验，不创建 continuous detector/recovery | 否 | 配置失效语义 | 不适用；不增加 state/port/error | 无回写 |
| 未来需要 remote config center、secret provider health、online LKG/reload、continuous drift detector、external retry/repair或alert backend | 不属于当前配置结论 | 触发时可能改变 source、port、builder、error、state/observability | 触发时重开 03 §5/§6/§8/§11/§13/§14 与相关 Step | 无回写（当前未触发） |

本 Step 没有“待回写”或“阻塞待确认”的 03 影响项。所有既有 DDD、PF、MI-UP、Q-MI blocker 继续只阻断受影响正向 lane，不能由 failure wording 关闭。

## 10. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读：
> - 建议继续阅读“失效策略术语与总原则”“P0 失效模式表”“按配置域组织的 failure / degraded matrix”“生效方式到失效处理矩阵”“配置失败与既有错误面映射”“安全观测与测试承接切口”和“跨失效策略审计表”。

正式 `04-配置设计.md` §11 应回填以下收口结论：

1. P0 的 source、strict JSON/schema、type/ref-shape、sensitive、cross-field 或 mandatory slot 失败必须 fail-fast/fail-closed，assembly `Blocked`且不暴露 facade；不得以 defaults、cache、LKG、fake、partial apply、retry 或 live repair 继续。
2. `conservative marker`只适用于可选 external boundary selector 的既有 `Unknown`/`Unavailable`/`Gap`/`ReopenRequired` disposition；它不触发 provider 调用，也不表示外部降级成功或 readiness。
3. P0 不支持 remote config center、admin override、secret provider reader、hot/reload、online LKG、continuous drift detector或自动回退。drift/expiry只在下一次显式启动/回退输入重新校验时处理。
4. `diagnostics.redaction_policy_ref`缺省使用 fixed floor；weaker/unknown/body selector与所有 raw material、fake leak和invariant override均 fail-closed，且不得输出原值。
5. 安全信号和测试切口只能携带配置域/key/slot/seam/profile/mode类别、safe issue/marker/ref和local disposition；不产生告警结果、report/evidence、digest、发布、Artifact、consumer或runtime readiness事实。

正式章节不得引入外部 provider、重试/告警数值、host/container 操作、持续检测、实际告警/测试/回滚结果，或用 degradation 绕开 invalid config 与现有 blocker。

## 11. 待确认事项与持续 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| config artifact 保留、prior validated input 可用性与 restart 运维流程 | 实际 rollback/recovery 执行 | 仅保留新的 startup validation规则；input不可验证则 fail-closed。 |
| future remote config / secret provider / live drift requirement | source、health、error、recovery契约 | P0 不引入；先重开03/04。 |
| alert backend、SLO、threshold、notification/runbook | 安全信号到运维的实际转换 | 仅保留 planned safe cut；不创建观测/运维真相。 |
| `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004` | static/external slot 的验证与正向解释 | marker/gap/blocked；不生成 owner success。 |
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 应用写入、terminal/recovery lane | 不由配置增加 retry、repair、state transition或UoW。 |

## 12. 自检与 Step 11 停审门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否覆盖 P0 缺失、错配、敏感、不可用、漂移/过期和 remote-source问题 | 通过 | §5、§6。 |
| 是否区分 fail-fast、fail-closed、conservative marker、unsupported和restart recovery | 通过 | §4、§6.1。 |
| 是否禁止 silent fallback、high-priority fallback、LKG、partial apply、fake或live repair | 通过 | §4、§5、§8.2。 |
| 是否区分 invalid config 与 optional external marker | 通过 | §4、§6。 |
| 是否避免伪造 config center/KMS/provider、continuous detector、digest或告警结果 | 通过 | §2、§5、§7。 |
| 是否保持 static/live、owner、UoW/recovery、no-readiness和outbound边界 | 通过 | §4、§6、§8.2。 |
| 是否存在当前待回写/阻塞待确认的 03 影响 | 否 | §9均为无回写；future trigger未发生。 |
| 是否把 persistent blocker 写成已关闭 | 否 | §9、§11继续开放。 |

```text
step_11 = completed
gate_status = pass
current_module = cross-failure-audit (closed)
next_allowed_action = create_and_complete_step_12_downstream_handoff
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

**停审结论：** Step 11 已完成。用户已授权完成全部 04，下一动作只能严格创建并完成 Step 12；不得提前装配正式 04 或进入 05~07、implementation、测试执行、evidence 或 commit。
