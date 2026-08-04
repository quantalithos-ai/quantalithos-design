# L4-observability 04-配置设计 Step 08 · 定义敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 08
> 回填章节: `04-配置设计.md` §8
> 当前模式: `full-restart`
> 本步边界: 只收口 Step 07 已登记 opaque ref / locator 的敏感级别、存储、私有解析、轮换、审计和禁止输出；不新增 raw config key、secret provider 产品/API、hot reload、部署挂载、真实 credential、测试结果或验收事实

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/04-配置设计.md`，仍为 `historical_material`，本 Step 不修改 |
| 当前 Step | Step 08 定义敏感配置与密钥管理 |
| 前序门禁 | Step 07 current M3复核`pass`；用户于2026-08-02授权连续完成全部M4 |
| 当前模块 | `sensitive-locator-provider-rotation-no-output` |
| 输入状态 | Step 08 SOP/规范、current Step 04~07、formal `00~03`、DDD Step 12/14/15、旧 Step 08 与 L1 粒度参考已按顺序读取；R2额外消费current Step09触发的entry-safe targeted repair |
| 写入状态 | `completed_current_after_M3_revalidation`；原full-restart与R2内容均已对最终formal `03`复核 |
| gate_status | `pass_consumed_by_step_09` |
| next_allowed_action | `continue_to_current_step_09_under_continuous_M4_authorization` |
| 上游 blocker | `none`；`CFG-BLK-07-01`保持resolved，`CFG-BLK-09-01`的Step08敏感边界分支已按formal `03` R2闭合 |
| implementation readiness | `blocked`；formal `04~07`、目标仓、implementation ledger / skeleton 与真实 tests / evidence 均未完成 |

### 1.1 Step 内计划

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取 Step 08 标准与 current 输入 | §3 输入与采用方式 | done | 先 current source，后 historical/reference |
| 回答 SOP 八问 | §4 | done | 不把 provider 产品或 raw secret 写成配置事实 |
| 诊断旧材料与参考粒度 | §5~§6 | done | 旧对象、key、profile、产品、数值均不继承 |
| 建立敏感级别与三层模型 | §7~§8.2 | done | root ref、infra descriptor、resolved material 不混同 |
| 逐项闭合 Step 07 inventory | §8.3~§8.6 | done | 20 R + 4 S-L + 3 mixed 行均有唯一处理 |
| 闭合读取、轮换、历史绑定与 no-output | §8.7~§8.13 | done | old work 不改道，raw material 不持久化 |
| 完成逐项停审、跨敏感/VETO 与 `03` impact | §8.14~§10 | done | 无 unresolved conflict 才可 pass |
| 静态检查、flow/ledger 同步与停审 | §12 | done_plus_R2 | 原Step08已经用户确认并进入Step09；R2后只返回Step09重审，不重开文档切换 |

### 1.2 写入前检查

| 检查面 | 结果 |
|---|---|
| 正式 `04` 是否允许写入 | no；只能 Step 15 装配 |
| Step 09 是否已获用户确认 | yes；本R2由current Step09的definition/use审计触发，回灌后只允许重审Step09，不得读取Step10 |
| 是否需要新增 secret provider 产品/API | no；current code contract 只要求 `infra` 私有解析边界 |
| 是否需要回写 formal `03` | R2 done；current Step09曾发现raw entry binding与safe projection冲突，已定向回写DDD Step05/07/14/17/19及formal §5/§13/§15/§16，保持raw binding infra-only |
| 是否允许 raw token/password/private key/cert/DSN/credential body 入示例 | no |
| 是否允许记录完整 consumer/target/binding ref、locator 或 fingerprint | no；current安全基线只允许canonical field ID、finite subject kind/outbound event name、family/phase/count/result与safe change/config/issue refs；Step 10 未定义generic ref-output或safe fingerprint schema |
| 是否允许复用已解析 material 到新 assembly | no；每个 assembly 独立解析并独立持有，失败不回退旧 cache |
| 是否允许 rotation 重定向 old Job/outbox/intent | no；只影响 new complete assembly/new work |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 把 Step 07 的 `N/R/S-L/mixed` 工程标签归一到书写规范的 `public/internal/sensitive/secret` 语义，同时保留 `R` 与 `S-L` 的实现差异。
2. 对 27 个直接标记为 `R`、`S-L` 或 `mixed` 的 registry 行逐项给出存储、明文、解析、轮换、审计、failure 和 no-output 规则。
3. 明确 ordinary config、infra private binding registry 与 adapter-private resolved material 三层 ownership，禁止 application/domain/entry 获取 raw locator/material。
4. 明确 selected binding 的 provider bootstrap、resolution order、material lifetime、zeroization/error-chain 边界，但不虚构具体 KMS/Vault/cloud provider。
5. 固定 new assembly rotation、credential-only rotation、destination rotation、historical binding retention 与 old work resume 的可判定规则。
6. 把六条 environment lane 的 secret ownership、fixture 隔离和 failure posture闭合，不把 staging/prod 实例写成已存在。
7. 为 Step 09 加载、Step 10 变更审计、Step 11 failure、Step 12 test/acceptance/implementation handoff 提供可直接消费的 contract。
8. 证明配置不能成为外部 truth、业务审计或验收 evidence，并保持 log/metric/trace/audit/report 不泄露 raw material。

### 2.2 本步非目标

- 不新增 `secret_provider`、`kms_key`、`mount_path`、`credential_version`、`rotation_interval`、`reload`、`admin_override` 等 raw root field。
- 不选择 Vault、KMS、cloud secret manager、OS keyring、sidecar、CSI、file mount、HSM、database、broker 或 scheduler 产品。
- 不定义具体 locator URI scheme、provider protocol、mount/path/env name、IAM policy、certificate chain、trust store、permission、lease、TTL 或 production rotation runbook。
- 不支持 raw secret file/env、secret value env、CLI credential、entry-local credential、multi-file include、remote config center 或 hot override。
- 不让 `CredentialRef` 自动替代所有 `StoreBindingRef` / `TransportBindingRef` / `PolicyBindingRef`；每个 typed ref 仍由自己的 infra resolver/registry owner解释。
- 不把 provider audit log、secret read receipt、adapter health、delivery receipt 或 runtime log升级为本仓业务审计 truth或验收 evidence。
- 不定义 Step 09 的 exact loader伪代码、Step 10 的审批角色/审计 record schema、Step 11 全 failure matrix、Step 12 case/AC/commit boundary。
- 不修改 formal `03/04`，不实现代码，不创建 implementation ledger/boundary skeleton，不伪造 commit/run/evidence/test/verdict/signoff。

## 3. 输入与采用方式

| 输入 | 采用内容 | 本步不继承 / 不越界 |
|---|---|---|
| 配置设计 SOP Step 08 | 敏感配置表、明文禁止、轮换、审计、逐项停审、跨敏感泄露审计 | 不把模板最小列当内容上限 |
| 配置书写规范 §4.7 / §5.8 / §6 | `public/internal/sensitive/secret` 四级与 no-output 评审规则 | 不照搬示例 DSN/token 作为项目字段 |
| 通用标准与依赖裁剪 | 唯一 truth source、逐 Step、config binding、forbidden material、only-core compile dependency | 不新增运行期 sibling Cargo edge |
| current Step 04 | `CAT-SENSITIVE`只作属性；D21 stage 5 private resolution；无 hot update；24 组 forbidden rule | 不恢复 debug bypass、raw body key或旧分类 |
| current Step 05 | `DECL < JSON < allowlisted ENV`；locator参与 merge，resolved material不参与；C14/C15/C16/C22/C24 | 不给 raw material优先级，不做invalid winner fallback |
| current Step 06 | 六 lane、三 runtime class、Fake credential absent、Endpoint/Disabled规则、实例未建立 | 不发明第四 profile或声称生产 provider ready |
| current Step 07 | 十列 registry、nested object、27 个 R/S-L/mixed 行、strict JSON/JSONC、23 域与 VETO | 不改 path/type/requiredness/source/value；不新增 secret field |
| formal `00/01/02` | forbidden body、redaction-first、no source-truth write、product neutrality | 不把 secret handling变成业务能力/truth |
| formal `03` §3 / §11 / §13 / §14 | typed refs、13-stage builder、`RuntimeAssemblyError`、private memory、safe catalog、historical binding、redaction allowlist | 不新增 public DTO、business port/state/error或 durable secret row |
| DDD Step 12 / 14 / 15 | startup-only error、exact binding/token、old-work recovery、telemetry字段白名单 | 不把 infra cause或provider body穿透到 public/application |
| 旧 L4 Step 08 | 仅用于识别 81 行 schema-first、废弃对象和自动推进问题 | 全量替换，不承接其对象与 gate |
| L1-governance / L1-artifact Step 08 | 只参考四级分类、读取图、敏感表、环境、no-output、停审与 impact结构 | 不复制其 key/profile/provider/replay root/digest 审计口径 |

### 3.1 本步判断原则

| 原则 | Current contract |
|---|---|
| Classification follows material, not string type | JSON string可能是普通 enum、body-free identity、sensitive locator或secret material；不能按serde type统一处理 |
| `R` is not automatically secret | `R`是 ref-sensitive identity/locator；可以进入 validated config或formal durable owner，但不能完整输出或解析成endpoint |
| `S-L` is not secret material | `S-L`只保存 opaque locator；真正 material在 infra/adapter private memory，不能回填 config/snapshot/provenance |
| Mixed container is leaf-classified | catalog/object本身 `mixed`；每个 leaf按N/R/S-L独立处理，不能整对象 Debug/serialize到诊断 |
| Provider is an infra mechanism | provider产品/API不是root schema，也不成为application port、domain policy或truth source |
| Resolution follows validated semantics | provider只能满足已选择 locator，不得改变 mode/family/target/capability/timeout/schema/actor |
| Rotation creates a new assembly | current无in-place hot swap；新 material只随new complete assembly服务new work |
| Old work follows durable binding identity | Job/outbox/intent/preparation按stored snapshot/binding解析；不可改用current locator/route |
| Audit is metadata-only and future-owned | Step 10只能记录safe change metadata；本Step不新增可泄露full ref/digest的审计schema |
| No output means no transformed surrogate | raw secret/locator/provider body不得以hash/digest/base64/Display/Debug/error chain绕过 |

## 4. SOP 问题回答

### 4.1 哪些配置是 sensitive 或 secret?

Step 07 的 20 个 `R` 行归 `sensitive reference`，4 个 `S-L` 行归 `sensitive locator`，3 个 `mixed` container按leaf拆分。`technical.*_binding_ref`、policy refs、adapter/effect/consumer/schedule refs属于 `sensitive`，但不必然触发 secret material读取。Store binding、endpoint credential、outbound/inbound transport locator属于 `sensitive` 且可能在infra阶段解析出真实 material。

真实 password、private key、raw token、cert/key body、DSN、connection string、endpoint URL、topic/subscription、broker credential、provider response、raw policy body和external body属于 `secret` 或 forbidden material；它们不是 Step 07 配置项，任何ordinary source都不得提供。

### 4.2 敏感配置如何存储，是否允许明文?

Root strict JSON / allowlisted ENV只保存typed non-empty opaque ref/null。`ValidatedObservabilityConfig`可保留infra-owned refs用于assembly，但application-visible safe catalog、entry slice、Job snapshot、outbox/intent/token只保留formal body-free identity/capability，不包含`CredentialRef`、`TransportBindingRef`或resolved material。

真实 material只能存在于构造中的infra/adapter private memory，生命周期不超过持有它的assembly/adapter；不得进入config identity、provenance、error、log、metric、span、audit、report、store row、snapshot、artifact或core dump设计。Current文档不声称某个具体memory locking/zeroize库已选定；实现至少必须避免`Clone/Debug/Display/Serialize`扩散，并在drop/replacement时best-effort clear。具体平台能力留`07` reality check。

### 4.3 敏感配置如何轮换?

Current只支持cold/new-assembly rotation：准备new opaque locator或使同一versioned locator解析到可确定的新provider revision，构造并完整验证new assembly，activation后只让new work使用。Old assembly/in-flight request按Step09/10 drain；accepted Job、outbox、intent、preparation继续使用stored config snapshot/effect binding。

Credential material轮换只有在destination与provider idempotency namespace不变、same `effect_binding_ref`仍能解析且overlap覆盖全部active/ambiguous token时才可保持binding ref；否则必须生成new `effect_binding_ref`。不得因轮换修改token、payload、plan、intent、state或重新发送ambiguous effect。

### 4.4 读取和变更是否需要审计?

Sensitive material的每次runtime读取不写本仓durable business audit，也不为Query/adapter call创建read audit；provider自己的access audit属于provider/operations责任，不是L4 truth。Runtime只可按formal Step 15记录finite assembly stage/result、config ref、adapter family、effect phase、safe issue ref。

配置变更需要Step10承接metadata-only审计：change identity、authorized actor safe ref、old/new `ConfigBindingRef`、受影响canonical field/subject family、change class、validation/activation result、reason/change request safe ref。不得记录full locator、raw value、provider revision body、endpoint、credential、secret fingerprint或provider access receipt。

### 4.5 日志、错误返回、审计中如何避免泄露?

先将typed outcome映射到Step15 allowlist，再序列化；禁止对raw config、ref object、adapter descriptor、provider error、config diff调用`Debug`/`Display`。`RuntimeAssemblyError`只携带formal body-free fields；provider cause在infra boundary立即映射并丢弃可输出链。Redaction失败suppress整个字段集并增加non-recursive counter，不能输出fallback dump或hash surrogate。

### 4.6 每个敏感配置是否回指 Step 7、来源规则和加载/变更机制?

是。§8.3逐行覆盖Step07的20 R、4 S-L、3 mixed登记；§8.7回指Step05 source；§8.8/§8.10已被Step09加载/assembly消费，Step10变更审计仍只保留handoff；§8.12给出failure映射。R2只回灌已确认Step的冲突修复，不提前读取/编写Step10。

### 4.7 每个敏感配置完成后是否通过停审?

结构化停审记录见§8.14。原Step08已在静态coverage、path/tag等值、table/fence/duplicate-heading、whitespace/bad-character与truthfulness检查通过后由用户确认进入Step09；R2又完成opaque registrar敏感暴露重审，当前gate为`pass_after_R2_consumed_by_step_09`。表格存在本身不构成pass证据。

### 4.8 是否仍有 raw secret、误归类、日志泄露或轮换审计缺口?

跨敏感审计见§8.15。设计层已消除raw secret source、provider override、full-ref输出、old-work reroute和hot rotation歧义。具体provider产品、部署权限、zero-downtime overlap/runbook和Step10审计持久化仍是P1/后续设计材料，但不阻塞P0 contract；它们不得被误写为已实现或已验证。

## 5. Historical material 诊断

| 材料 | 主要问题 | Current处理 |
|---|---|---|
| 旧 `04_config_step_08_sensitive_secrets.md` | 仅81行；主体是废弃`NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`等schema；没有Step07回指、敏感表、读取链、轮换、审计、停审或泄露审计 | 全量替换；旧对象与`next_step_or_formal_assembly`门禁均废止 |
| 旧 formal `04` §8 | 来自旧自动全Step链，key/profile/source/provider语义与current Step05~07不一致 | 继续`historical_material`；只在Step15全量装配 |
| README | 具名产品、技术栈、hash chain、冷存、P95等旧线索 | 不进入provider、secret、rotation或审计truth |
| 旧 formal `05/06/07` | 使用旧profile/case/evidence/implementation boundary | 只作historical direction；不得反向定义secret gate或声称测试通过 |
| 旧 implementation ledger/boundaries | 创建时点、配置key与boundary已失效 | 直到current formal `07`完成时才重建 |
| L1-governance Step08 | 299行，结构比旧L4完整，但包含其store/route/replay/redaction key与旧profile | 只参考章节粒度；不复制key、profile、full-ref digest或provider假设 |
| L1-artifact Step08 | 278行，包含artifact replay root与Artifact handoff主语 | 只参考停审和no-output结构；不复制Artifact truth |

## 6. 改动前后与设计取舍

### 6.1 改动前后对比

| 设计面 | 旧 Step08 | Current Step08 | 原因 |
|---|---|---|---|
| 主轴 | log/metric/trace/audit schema | Step07 sensitive refs/locators/material lifecycle | Step08应管理secret而非重写详细设计对象 |
| inventory | 无 | 20 R + 4 S-L + 3 mixed逐行覆盖 | loader/validator/implementation可1:1追溯 |
| secret source | 未定义 | raw material无ordinary source与priority | 防止file/env secret与fallback |
| ownership | 未定义 | root opaque ref -> infra descriptor -> adapter-private material | 防止application/domain持有secret |
| provider | 未定义 | product-neutral infra mechanism，具体产品未选 | 保持可落码边界与产品中立 |
| bootstrap | 未定义 | process/deployment给infra最小resolver capability；bootstrap本身不进入root | 避免用同一secret解析自身locator的循环 |
| rotation | 未定义 | new complete assembly + old-work pinning + overlap/retire gate | 与formal `03` token/historical binding一致 |
| audit | 泛化“可审计” | runtime telemetry与future config-change audit分层 | 不制造secret read business truth |
| no-output | 只有泛化redaction | channel-by-channel allow/deny且no hash surrogate | 防止error/debug/report泄露 |
| gate | 自动允许下一步/装配 | 静态检查后停审，用户确认才可Step09 | 遵守逐Step流程 |

### 6.2 设计取舍

| 议题 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| root表示 | typed opaque ref/null | raw DSN/token/key/cert/path/URL | root必须可审计且不携带material |
| secret resolution | infra-private resolver/registry contract | application `SecretProvider` business port | formal `03`已把解析限定在infra，新增业务port会越界 |
| provider选择 | deployment/infra composition决定，产品未锁 | 新`secret_provider` root field或provider enum | current `03`无此type/reader；避免静默扩code contract |
| classification | R/S-L/mixed leaf-aware | 所有ref一律secret或一律internal | 两种极端都会造成无谓解析或泄露 |
| config identity | body-free semantic revision，不含material | raw config hash/secret fingerprint/file path | secret rotation与config语义需分离，且禁止hash逃逸 |
| runtime read audit | provider/operations自有access audit + safe runtime telemetry | L4每读一次写business audit | 避免self-observation与secret access成为业务truth |
| rotation | new assembly，old work pinned | hot mutate adapter、current route重定向old work | formal builder/snapshot/token已固定cold semantics |
| credential-only rotation | 可保留binding ref仅当destination/idempotency namespace不变且old token可解析 | 只要credential变就总换ref，或永不换ref | exact binding identity由destination/idempotency语义决定 |
| old material retention | 保留versioned locator/descriptor resolution能力 | 持久化raw secret或复用current locator | 同时满足recoverability和forbidden material |
| audit representation | safe change/config/issue refs + canonical field ID + finite subject kind/outbound event name + family/phase/count/result | full consumer/target/binding ref、locator/hash/fingerprint、provider revision body | Step15没有批准generic ref/digest输出，opaque identity与hash均可泄露或被关联 |
| local/CI | fixture/controlled opaque refs，禁止prod material | 把production secret复制到fixture | 环境隔离与no-fabrication |

## 7. 敏感级别与三层 ownership 模型

### 7.1 规范级别归一

| 规范级别 | 本项目含义 | Step07映射 | 存储 / 输出要求 |
|---|---|---|---|
| `public` | 可公开且无拓扑/安全/审计含义的finite token或文档结构 | `N`中的公开schema/profile说明；不是本Step逐项主语 | 可进入文档；runtime输出仍受Step15具体埋点表约束 |
| `internal` | 内部numeric/enum/limit/retry参数或安全关键但非locator的结构 | 多数`N`；本Step只在跨域审计确认其不含secret | 可入内部配置；禁止把raw config整体输出 |
| `sensitive` | 完整值泄露会暴露binding、policy、topology、target、scheduler、consumer或credential入口的opaque ref | 全部`R`、`S-L`、mixed容器中的敏感leaf | 可按Step07进入ordinary config；不得完整进入log/error/metric/span/audit/report |
| `secret` | password、private key、raw token、cert/key body、DSN/connection string、endpoint/topic/subscription、credential/provider response等真实material | Step07不存在合法字段 | 不得进入root/env raw value、文档示例、validated/app config、store/snapshot、telemetry/report/artifact |

`public/internal`不意味着可以Debug整个root；`sensitive`不意味着值本身就是credential；`secret`也不因被base64/hash/digest包装而降级。

### 7.2 `R`、`S-L` 与 `mixed` 的实现语义

| Step07标签 | 规范级别 | 是否可进入root | 是否触发material解析 | 是否可进入application/durable surface |
|---|---|---|---|---|
| `R` | `sensitive` | 是，typed opaque ref | 通常只做registry/descriptor/policy resolution；不得假定有credential material | 仅formal owner明确允许的safe typed identity，例如`ExternalEffectBindingRef`、consumer ref、schedule ref；不得完整输出 |
| `S-L` | `sensitive` locator | 是，typed opaque locator或explicit null | 是，在infra stage5或store/transport constructor private boundary | raw locator与resolved material均不得进入application catalog/entry/Job snapshot/outbox/token/report |
| `mixed` | container非单一级别 | 是，strict typed object/array | 只对S-L leaf解析 | N/R formal fields按各owner投影；S-L leaf在safe projection时剔除 |

### 7.3 三层 ownership

```text
[R0 DECL / R1 strict JSON / R2 allowlisted ENV]
               |
               | opaque typed ref / locator only
               v
[Raw + typed candidate in infra::config]
               |
               | validate source/profile/requiredness/redline
               v
[Validated infra config + body-free ConfigBindingRef]
               |
               +--> [R refs -> typed registry/policy/descriptor resolution]
               |
               +--> [S-L refs -> private provider/transport/store resolution]
                                |
                                v
                    [adapter-private material handle]
                                |
                                v
                    [complete runtime or one safe error]

safe outward projection only:
  application catalog / entry slices / Job snapshot / outbox / intent / token
  = formal body-free identity + finite family/capability/timeout
  != locator / endpoint / credential / provider response
```

| Layer | Owner | 可持有 | 不得持有 / 不得做 |
|---|---|---|---|
| ordinary config candidate | `infra::config` | Step07 typed values、R/S-L opaque ref、source kind | raw secret、provider response、external body、implicit provider default |
| private binding/descriptor registry | `infra` composition | exact binding revision、product-neutral family/mode/capability、pinned locator refs、resolver handles | 暴露到application/domain/entry；把current descriptor重定向old ref |
| resolved material handle | concrete store/transport/external adapter | minimum bytes/handle needed by adapter call,process-local only | `Clone/Debug/Display/Serialize`扩散；config snapshot/log/report/store；改变binding semantics |
| safe application projection | application runtime | `ConfigBindingRef`、`ExternalEffectBindingRef`、family、timeout、capability | `AdapterBindingRef`、`CredentialRef`、`TransportBindingRef`、raw route/material |
| durable execution/effect | repositories defined informal `03` | config snapshot safe subset、effect binding ref、token/body-free digest | locator、secret、provider revision body、current-route fallback |

## 8. 结构化中间产物

### 8.1 Provider bootstrap 与 resolution contract

Current设计不在root新增provider配置。Process/deployment在调用`infra::config`/runtime builder前提供一个受控、产品中立的private resolution capability；其具体产品、authentication、mount和permission属于`07`/deployment/operations material。Bootstrap必须满足:

1. 不能依赖同一root中待解析的secret来解析provider自身bootstrap，避免循环依赖。
2. Bootstrap material不进入`RawObservabilityConfig`、`ConfigBindingRef`、source precedence或field provenance。
3. Resolver按typed ref owner分派：policy/binding/schedule descriptor、store locator、transport locator和credential locator不能用一个free-text fallback resolver互猜。
4. Resolver只返回minimum private handle/material和typed unavailable/mismatch；不得返回可持久化provider body或任意metadata map。
5. Provider selection/status不能改变mode、family、effect subject、capability、timeout、schema、actor、redaction、idempotency或truth owner。
6. Selected locator失败必须保持`SensitiveReferenceUnavailable`/对应constructor failure；不得读取raw env secret、旧进程cache、first credential、fake/controlled或另一target。
7. Explicit `Disabled`且binding/credential均null时不调用resolver；Fake必须credential null；Controlled只在formal seam确需credential时解析nonprod locator；Endpoint按descriptor requiredness解析。
8. Resolved material lifetime绑定new assembly/adapter；builder失败须drop全部已构造private handles，不能泄漏partial runtime。

### 8.2 Safe resolution order

| Order | 输入 | Owner | 输出 | Failure / no-output |
|---:|---|---|---|---|
| 1 | raw JSON/ENV occurrences | `infra::config::loader/parser` | typed ref/null candidate | raw material-like value/unknown key -> `InvalidConfiguration`;不打印value |
| 2 | typed candidate | source/profile/redline validator | compatible R/S-L refs | invalid winner不fallback；issue只safe ref |
| 3 | compatible candidate | config identity producer | `ConfigBindingRef` | secret/material/provider response不参与identity；full normalized root不输出 |
| 4 | R typed refs | owner-specific private registries | exact policy/binding/schedule descriptor | unresolved/mismatch -> safe assembly error；不按prefix猜owner |
| 5 | S-L typed locators | private resolver boundary | process-local material/handle | unavailable -> `SensitiveReferenceUnavailable`或family-specific construction failure；不回填candidate |
| 6 | descriptors + handles | store/adapter constructors | concrete private adapters + typed implementation descriptor | descriptor mismatch -> formal assembly error；provider body丢弃 |
| 7 | concrete registries | runtime builder safe projector | application catalog/entry slices/Job snapshot factory | drop locator/material；projection不完整则assembly失败 |
| 8 | complete runtime | process root | eligible new assembly | assembled不等于provider healthy、business accepted或evidence |

### 8.3 Step 07 敏感配置总表

表中 `ordinary storage` 指Step07 strict JSON/allowlisted ENV的opaque value，不表示配置文件本身可以公开。`private resolution` 为 `none` 时仍需typed registry validation和no-output。

| Step07 path / family | Step07标签 | 规范级别 | Ordinary storage | Raw material明文 | Private resolution / consumer | Rotation / historical rule | Safe audit / failure |
|---|---|---|---|---|---|---|---|
| `technical.clock_binding_ref` | R | sensitive | `AdapterBindingRef` string/null | 不可含path/provider body | clock registry；Fixed/System constructor条件 | new assembly；old request只随old runtime drain，不进Job snapshot | field ID + config ref + Clock family；missing/invalid assembly fail |
| `technical.id_generator_binding_ref` | R | sensitive | `AdapterBindingRef` string/null | 不可含seed/key/provider body | ID registry；Deterministic/Runtime constructor条件 | new assembly；不得让rotation改既有object ref | field ID + config ref + IdGenerator family；fail assembly |
| `safety.redaction_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含policy body/规则文本 | safety policy registry；pre-façade required | new assembly only；old runtime不可中途换policy | field ID + config ref；unresolved fail closed |
| `safety.safe_label_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含allowlist body或label值 | safe-label policy registry | new assembly；不得放宽high-cardinality红线 | field ID + config ref；unresolved fail closed |
| `safety.correlation_mapping_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含identity map/body | correlation mapper registry | new assembly；不重解释old correlation truth | field ID + config ref；ambiguous fail closed |
| `safety.visibility_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含authorization/subject body | visibility policy registry | new assembly；Query不持久化或热换 | field ID + config ref；unresolved fail closed |
| `safety.body_free_scanner_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含raw scanner sample/body | body-free scanner registry；无Disabled | new assembly；所有lane必需 | field ID + config ref；missing/unresolved阻断assembly |
| `stores.<...>.binding_ref` | S-L | sensitive locator | `StoreBindingRef` string/null | 不可含DSN/connection string/password/cert | store resolver/constructor private memory | Durable locator变更=new assembly；old plan/store rows不迁移/重解释；InMemory必须null | canonical field ID + slot/family + config ref；resolution fail或schema/capability mismatch，no fallback InMemory |
| `projection.freshness_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含threshold body/source data | freshness policy registry；application只收validated policy input | new assembly；accepted Job freeze relevant executable setting per formal snapshot | field ID + config ref；unresolved不default Fresh、不inline rebuild |
| `external.<root_adapter>.binding_ref` | R | sensitive | `AdapterBindingRef` string/null | 不可含endpoint/topic/path/fixture body | exact adapter registry；mode/family descriptor | new assembly；effect destination identity另由effect binding固定；Disabled null | canonical field ID + slot/family + config ref；missing/constructor mismatch safe error |
| `external.<root_adapter>.credential_ref` | S-L | sensitive locator | `CredentialRef` string/null | 不可含token/password/key/cert/credential body | stage5 private credential resolver；Endpoint/provider conditional | credential-only rotation可保持binding仅在§8.9条件成立；否则new binding/new assembly | canonical field ID + slot/family + config ref；unavailable=`SensitiveReferenceUnavailable`，不输出full ref |
| `external.outbound_event_targets` | R container | mixed/sensitive | whole strict catalog | 不可含route/credential/payload | leaf处理；safe catalog仅投影subject/effect binding/capability | catalog变更new assembly；old outbox snapshot pin exact effect binding | changed finite outbound event names/count + config ref；missing/duplicate=`EntryBindingIncomplete` |
| `external.outbound_event_targets[].effect_binding_ref` | R | sensitive identity | `ExternalEffectBindingRef` | 不可编码endpoint/topic/credential | application safe catalog + infra historical registry key | destination/idempotency revision变更必须new ref；old outbox/plan继续old ref | canonical field ID + finite outbound event name + old/new config ref；missing historical binding -> manual/no call |
| `external.outbound_event_targets[].transport_binding_ref` | S-L | sensitive locator | `TransportBindingRef` | 不可含topic/subscription/broker credential | infra publisher route/transport resolver | target revision变更new assembly；old effect binding必须仍解析old transport | canonical field ID + finite outbound event name/family + config ref；unresolved publisher assembly fail |
| `external.report_handoff_targets` | R container | mixed/sensitive | whole strict catalog | 不可含archive endpoint/package/credential | leaf处理；application safe catalog不含adapter locator | new assembly；existing intent/preparation pin old effect binding | canonical catalog field ID + changed count + ReportHandoff family + config ref；duplicate/mismatch fail |
| `external.report_handoff_targets[].consumer_ref` | R | sensitive body-free identity | `ReportConsumerRef` | 不可含target/location/report body | contracts typed owner；不是secret resolver输入 | consumer identity变更是new catalog subject，不改old handoff | canonical field ID + ReportHandoff family + config/issue ref；wrong wrapper/duplicate fail |
| `external.report_handoff_targets[].effect_binding_ref` | R | sensitive identity | `ExternalEffectBindingRef` | 不可含endpoint/credential | safe catalog key + historical handoff registry | preparation/delivery same ref；rotation不改existing intent | canonical field ID + ReportHandoff family/phase + config/issue ref；old missing -> unavailable/manual，不reroute |
| `external.report_handoff_targets[].adapter` | mixed | mixed/sensitive | strict adapter object | credential leaf不可明文 | binding R + credential S-L + finite N leaves | entire target validates asone revision/new assembly | canonical field ID + ReportHandoff family/phase + config/issue ref；禁止Debug whole object |
| `external.peripheral_export_targets` | R container | mixed/sensitive | whole strict catalog | 不可含GRC/dashboard/external audit body/credential | leaf处理；外围target与core隔离 | new assembly；existing export intent pin old ref | canonical catalog field ID + changed count + PeripheralExport family + config ref；duplicate/mismatch fail，不污染core |
| `external.peripheral_export_targets[].consumer_ref` | R | sensitive body-free identity | `PeripheralConsumerRef` | 不可含target/product/body | contracts typed owner | new subject不重写old preparation/view | canonical field ID + PeripheralExport family + config/issue ref；wrong wrapper/duplicate fail |
| `external.peripheral_export_targets[].effect_binding_ref` | R | sensitive identity | `ExternalEffectBindingRef` | 不可含endpoint/credential | safe catalog key + historical export registry | prepare/deliver same ref；no current default fallback | canonical field ID + PeripheralExport family/phase + config/issue ref；missing old binding manual/no call |
| `external.peripheral_export_targets[].adapter` | mixed | mixed/sensitive | strict adapter object | credential leaf不可明文 | binding R + credential S-L + finite N leaves | entire target one immutable revision/new assembly | canonical field ID + PeripheralExport family/phase + config/issue ref；禁止whole-object output |
| `entries.inbound_consumers` | mixed | mixed/sensitive | whole strict catalog | 不可含topic/subscription/credential/actor map body | operation/producer/schema N；transport S-L；policy R | new assembly registers new worker set；old delivered event不重路由 | operation set/count + config ref；duplicate/gap fail worker root |
| `entries.inbound_consumers[].transport_binding_ref` | S-L | sensitive locator | `TransportBindingRef` | 不可含topic/subscription/broker credential/header | infra consumer transport resolver | new assembly only；unregistered operation不consume/ack | operation/family/config ref；unresolved=`EntryBindingIncomplete`/assembly fail |
| `entries.inbound_consumers[].actor_mapping_policy_ref` | R | sensitive safety | `PolicyBindingRef` | 不可含actor table/identity body | worker context policy registry | new assembly；accepted event actor/context不重解释 | operation/config ref；unresolved/ambiguous fail worker root |
| `entries.job_schedules` | R container | mixed/sensitive | whole strict catalog | 不可含cron provider credential/job input | operation N + schedule ref R | new assembly registration；existing Job plan不读取schedule/current config | changed operation IDs/count + config ref；invalid schedule does not synthesize input |
| `entries.job_schedules[].schedule_binding_ref` | R | sensitive | `ScheduleBindingRef` | 不可含cron expression/provider credential/actor/key/input | infra scheduler registry；trigger only | new assembly；schedule rotation只影响future trigger，old Job pinned snapshot | operation/config ref；unresolved configured schedule fails/disables exact registration |

本表共27行，与Step07十列表中`R=20`、`S-L=4`、`mixed=3`逐行一致。重复family行展开的是同一schema family，不代表新增raw字段；具体entry cardinality继续由Step07 catalog约束。

### 8.4 Registry coverage 与 family 聚合

| Family ID | Step07 registry rows | R | S-L | mixed | Resolution owner | 主要 private material / 禁止误读 |
|---|---|---:|---:|---:|---|---|
| `SEN-F01` technical adapters | `technical.clock_binding_ref`;`technical.id_generator_binding_ref` | 2 | 0 | 0 | infra clock/ID registry | binding descriptor；不得把fixed seed/runtime provider body写入root |
| `SEN-F02` safety policies | five `safety.*_policy_ref` | 5 | 0 | 0 | infra safety/policy registry | validated policy implementation；不得保存policy body或authorization map |
| `SEN-F03` durable stores | `stores.<...>.binding_ref` family | 0 | 1 | 0 | infra store resolver/constructors | DSN/connection/cert/credential material；4 logical slots共享schema但逐slot校验 |
| `SEN-F04` projection policy | `projection.freshness_policy_ref` | 1 | 0 | 0 | infra policy registry/application constructor | executable freshness basis；不允许provider返回Fresh truth |
| `SEN-F05` root external adapters | root `.binding_ref` + `.credential_ref` families | 1 | 1 | 0 | infra adapter/credential registry | endpoint/credential/provider material；5 slots逐family解析 |
| `SEN-F06` outbound publication | catalog + effect ref + transport ref | 2 | 1 | 0 | external catalog validator + publisher registry | transport route/credential；12 subjects必须total且old snapshot可恢复 |
| `SEN-F07` report handoff | catalog + consumer/effect refs + adapter object | 3 | 0 | 1 | handoff registry | adapter object内credential leaf按S-L；consumer/effect refs不等于secret |
| `SEN-F08` peripheral export | catalog + consumer/effect refs + adapter object | 3 | 0 | 1 | export registry | 同上；外围目标失败不得污染core truth |
| `SEN-F09` inbound consumers | catalog + transport + actor policy | 1 | 1 | 1 | worker transport/policy registries | broker route/credential与actor policy body；9 operation逐项静态映射 |
| `SEN-F10` schedules | catalog + schedule ref | 2 | 0 | 0 | jobs scheduler registry | trigger descriptor；不得携带actor/key/Job input或provider credential |
| **Total** | 27 registry rows | **20** | **4** | **3** | typed owner保持分离 | 无unowned sensitive row |

Coverage规则:

1. Family row可对应多个runtime slot或catalog entry，但其Step07 schema、source和sensitivity标签只有一个owner；实现不得复制成slot-specific raw key体系。
2. `S-L=4`是四种locator schema family，不是四个具体secret实例。实际resolver调用数量由selected mode、slot和catalog cardinality决定。
3. `R=20`中只有exact typed owner允许的identity可进入application/durable surface；`AdapterBindingRef`、policy ref、schedule ref的完整值默认仍不输出。
4. 三个`mixed`必须按nested schema逐leaf处理；whole-object serialization、diff、hash或Debug均不构成合法审计。

### 8.5 Secret / forbidden material taxonomy

| Material family | 是否是root配置项 | Private landing | Allowed use | 永久禁止落点 |
|---|---|---|---|---|
| password / raw token / API key | no | selected adapter private handle | authenticate exact selected call | JSON/env raw value、validated config、application、store、telemetry、report |
| private key / certificate key body | no | crypto/transport adapter private handle | exact handshake/sign operation | config identity、error chain、artifact、Job snapshot、outbox |
| public certificate body / trust material | no in current root | transport adapter/deployment trust boundary | validate exact endpoint where required | 普通root扩展、business truth、audit body；如需配置化先回`03/04` |
| DSN / connection string / store credential | no | store constructor/private pool handle | build exact qualified store adapter | root `StoreBindingRef` value、repository row、SQL error、diagnostic dump |
| endpoint URL / route / topic / subscription | no | infra binding/transport registry | exact binding revision dispatch | application catalog、protocol DTO、metric label、span、report |
| provider response / metadata map | no | transient infra call frame only | construct minimum private handle then discard | error chain、cache-as-source、config snapshot、audit/report |
| raw policy body / actor map | no | validated policy implementation/private registry | evaluate formal policy input | root policy ref value、telemetry、Query response、history body |
| external request/response/payload body | no | transient adapter boundary subject to formal body-free rule | only formal outbound operation already defined | configuration、secret cache、error、trace、audit、handoff/report |
| secret fingerprint / hash / digest | no current field | none unless future design owns typed safe fingerprint | none in current P0 | 用于绕过no-output、metric label、generic change audit |

Raw secret-like value进入普通JSON/env时，validator不得尝试“脱敏后继续”。它必须拒绝candidate，并只产生typed error category与`RuntimeAssemblyIssueRef`。本Step不定义通过regex猜secret；合法性由strict field registry、typed ref constructor、owner-specific resolver和redline共同判定。

### 8.6 六条 environment lane 敏感处理矩阵

| Lane | Runtime class | 允许表示 | Private resolution owner | 明确禁止 | 不可用 / rotation posture |
|---|---|---|---|---|---|
| `ENV-LCL-ISO` | LocalTest | InMemory null store refs；Fake/Controlled body-free binding refs；Fake credential null | local controlled/fake registry；不要求network secret provider | production locator/material、raw fixture body、Endpoint credential、private-map truth | required fixture descriptor缺失则assembly fail；new candidate/new assembly，不热改 |
| `ENV-LCL-INT` | IntegrationLike | Durable store locators；Controlled/Endpoint nonprod binding与credential locators | developer/integration-owned private provider boundary | raw DSN/token、production material、Fake fallback、cache代provider | selected resolution fail closed；rotation重建integration assembly并验证old binding |
| `ENV-CI-ISO` | LocalTest | suite-owned deterministic/fake/controlled opaque refs；credential null unlessformal Controlled seam requires nonprod locator | isolated suite private registry | production secret、raw fixture、输出private map为evidence | missing fixture/locator使planned test setup失败；不声称pipeline已存在 |
| `ENV-CI-INT` | IntegrationLike | Durable/nonprod Endpoint or Controlled locators | CI-managed nonprod private provider boundary | raw CI env secret、production reuse、InMemory/Fake替代durable/selected dependency | provider unavailable fail assembly；rotation scenario属于future Step12 test input,not_run |
| `ENV-STG-RT` | RuntimeLike | deployment-owned Durable/Endpoint locators；外围可explicit Disabled且null | staging operations/private provider composition | fixture/Controlled/Fake、developer cache、raw env material、partial runtime | selected required material不可解析则no new assembly；instance/provider/evidence当前未建立 |
| `ENV-PRD-RT` | RuntimeLike | operations-owned versioned Durable/Endpoint locators；explicit optional Disabled | production operations/private provider composition | fixture、Controlled/Fake、raw JSON/env secret、current route代old binding | fail closed/no fake fallback；rotation需overlap/drain/retire proof，runbook当前未建立 |

共同规则:

- 六lane使用同一Step07 schema和Step05 precedence；不存在production专用secret key、test override reader或第二provider contract。
- 表中owner是责任边界，不证明provider、credential、endpoint、store或lane实例真实存在。
- Local/CI material不能成为staging/prod fallback；staging/prod不可用也不能降级到test seam。
- `Disabled`只按formal family requiredness允许，并要求binding/credential null；不是“secret provider unavailable”的fallback值。

### 8.7 Ordinary source、locator 与 provider result 边界

| Input / occurrence | 是否参与R0/R1/R2 | Allowed content | Validation / conflict | Forbidden behavior |
|---|---|---|---|---|
| `SRC-DECL` | yes for formally declared fields/defaults only | LocalTest body-free fixture binding或non-sensitive selector；无production credential | 仅formal default可供值；required marker不生成locator | 编译production secret、provider default、first credential |
| `SRC-JSON` | yes, R1 | Step07 strict typed opaque ref/null/catalog | duplicate/alias/unknown/raw material reject；catalog whole replacement | include secret file、inline DSN/token/cert/body、index fragment override |
| `SRC-ENV` | yes, R2 for allowlisted leaf only | Step07批准的opaque ref/null semantics | empty仍present；invalid/malformed/raw material不fallback | env直接承载secret material、whole catalog、多个alias择一 |
| `SRC-SECRET` result | no | minimum adapter-private material/handle for validated locator | must match exact owner/locator/binding context；unavailable safe error | 改mode/target/capability/timeout、回填root、参与config identity |
| deployment bootstrap | no | private resolver capability/authority handle | process root在loader/builder外提供；product-specific reality留`07` | 写入root key、用待解析secret解自身、出现在provenance |
| entry / Job DTO | no | only formal protocol fields | raw credential/locator override reject；Job只使用accepted snapshot | handler/runner读env/provider/current config |
| derived safe catalog/slice/registrar | no | body-free identity、finite family/capability/timeout、locator-free registration metadata、opaque all-or-nothing registration capability | must be complete one-assembly projection from one candidate；registrar只允许finite `registrations` + `register_all` | 保留credential/transport/schedule locator、material/private registry getter、`Any`/downcast、generic lookup或扩大root权限 |
| `SRC-HISTORY` | no for new candidate | stored safe snapshot/effect binding identity | exact historical descriptor/locator resolution only | current source/route/credential fallback、rebuild old snapshot |
| provider cache / old assembly memory | no | only assembly-private current handle | cannot satisfy a new assembly candidate | last-known-secret、stale credential fallback、cache becomes source |

Selected winner是显式意图。高优先级locator无效或所指material不可读时，失败位置虽分别属于`InvalidConfiguration`和`SensitiveReferenceUnavailable`，但都不得删除winner后回退低层locator。Provider返回空、expired、wrong owner或descriptor mismatch也不是“该层absent”。

### 8.8 Material lifetime 与 private-memory contract

| Phase | 可存在的敏感形态 | Lifetime / ownership | Failure cleanup | 禁止扩散 |
|---|---|---|---|---|
| raw source read | opaque ref string、strict object bytes；不允许material | `infra::config` candidate construction | parse/reject后drop raw buffers；不保留diagnostic copy | stdout/stderr、panic/debug dump、issue body、artifact |
| typed candidate | typed R/S-L refs | one candidate validation lifetime | candidate失败drop全部；no partial validated object | application/domain/entry、business store |
| config identity | body-free `ConfigBindingRef` + safe source-kind summary | assembly/history identity lifetime | identity失败无adapter构造 | raw normalized config、locator/material/hash surrogate |
| private resolution | selected locator + transient provider material | resolver call frame / assembly constructor | any failure drops prior material/handles and returns one safe error | provider error chain、retry log、config provenance |
| concrete adapter | private material handle | owning assembly/adapter lifetime | failed build dropsall unexposed adapters；normal drop best-effort clears owned buffers | clone to service constructor、serialize、Debug/Display |
| safe catalog / entry slice / opaque registrar | no locator/material；registrar只封装pre-resolved private slots与finite registration action | complete runtime/application lifetime；opaque registered handle只维持process-local callback ownership | projection/slot/catalog/prepare/arm incomplete -> no exposed root；revoke/join all | locator/material/private getter、downcast/back-reference、repository/UoW/service locator |
| accepted Job/outbox/intent | config/effect binding refs only | durable formal owner retention | corruption/missing -> manual/consistency, no reconstruction | credential locator/material、current config substitution |
| runtime telemetry | finite category + safe refs only | sink-specific operational lifetime | mapper failure suppresses fields/nonrecursive counter | raw config/ref/material/provider body/hash |

Implementation requirements inherited by later `07` reality check:

1. Private material wrapper must not implement or derive broad `Debug`, `Display`, `Serialize`, `Deserialize`, `Clone`, `Eq`, `Hash` unless a narrower audited implementation proves no material exposure; design does not claim code exists.
2. Adapter constructor should receive the narrowest private handle/value, not the whole secret response or whole validated config.
3. Temporary byte/string copies must be minimized and cleared on drop where the selected Rust/platform facilities permit; inability to guarantee physical memory erasure must be documented as implementation/operations risk, not hidden as a pass claim.
4. Panic hooks, crash dumps, allocator/core-dump controls and OS process access are deployment/runtime hardening inputs for`07`/operations; current design only guarantees application-level no serialization/output.
5. Provider response expiry/lease metadata may drive adapter-private validity but cannot becomebusiness state、config source或metric high-cardinality label。

### 8.9 Rotation decision matrix

| Rotation kind | Identity comparison | Required action | Old-work behavior | Forbidden shortcut |
|---|---|---|---|---|
| policy binding ref changes | semantic policy revision changes | new config ref + complete assembly；revalidateredlines | old in-flight request drains old runtime；accepted Job keepsformal snapshot | hot mutate policy object、rejudgecommitted truth |
| store binding locator changes | store destination/schema/credential context may change | new complete assembly + store capability/schema/UoW/fence gate | existing durable rows remain underoriginal store semantics；migration not implied | switch current store then read old plan from guessed location、fallback InMemory |
| credential material rotates, destination/idempotency namespace same | same typed binding and exact destination;provider guarantees old token remains resolvable through overlap | may retain `effect_binding_ref`;new assembly resolves new material;must keep historical resolution capability for active/ambiguous effects | old token uses exact same binding identity and remains probe/finalize-capable | mutate active adapter in place、retire old material before ambiguity closes |
| credential material rotates but old token cannot be resolved | recoverability changed | new `effect_binding_ref` for new work;retain old binding/material access or classify old work manual | no reroute/no call if exact old binding unavailable | use new credential blindly with old token without provider/idempotency proof |
| endpoint/route/topic/target changes | destination revision changes | new `effect_binding_ref` and new complete assembly | old outbox/intent/preparation uses old binding/route | keep ref while changing destination、current route fallback |
| provider idempotency namespace changes | external duplicate identity changes | new `effect_binding_ref`;new token only fornew effect | old token/probe stays old namespace | reuse old token against new namespace |
| consumer transport binding changes | registration/transport destination changes | new assembly/worker registration | already acceptedlocal fact不重consume；broker recovery follows exact old operational binding where retained | ack/replay withcurrent route、change producer family |
| schedule binding changes | trigger descriptor changes | new assembly registration | existing Job plan/snapshot unaffected | schedule injects/mutatesactor、key、scope、Job input |
| optional target disabled | selected target availability changes | new assembly validates Disabled semantics/null locators | existing intent/preparation still needsold binding or manual classification | Disabled treatedsuccess、delete old descriptor/material immediately |
| rollback to prior config | prior candidate must still be complete/valid and references resolvable | build a new assembly from prior semantic revision;activation policy Step10 | never rewrites plan/outbox/intent/state | reuse old process handle as unvalidated LKG、claim rollback repaired truth |

`ConfigBindingRef` identifies one body-free validated semantic revision, not material bytes. Pure provider-side credential rotation can therefore leaveconfig semantics unchanged, but deployment/operations still must produce an auditable activation event and prove adapter reconstruction/overlap;this is not hot config support and does not authorize in-place mutation.

### 8.10 Historical binding retention 与 retirement gate

| Retained subject | Durable identity | Infra must retain / restore | Retirement condition | Missing behavior |
|---|---|---|---|---|
| Pending/Failed/ambiguous outbox publication | snapshot `effect_binding_ref` + token inputs | immutable publisher destination descriptor、pinned transport/credential locators或equivalent resolvable revision | terminal Published/DeadLettered plus retention/recovery obligations closed | stop before call；manual/consistency；no current route |
| handoff preparation intent | intent + effect binding + material digest | exact handoff preparation adapter revision | preparation terminal and no delivery/finalize ambiguity requiring same binding | blocked/manual；no new target/intent |
| handoff delivery intent/preparation | delivery copies preparation binding | exact same destination/idempotency namespace and probe capability | local terminal finalize plus retention/probe obligations closed | no call/reroute；retain local material |
| export preparation/delivery | exact export binding chain | exact export target revision | symmetric to handoff | manual/Unavailable；never fabricateDelivered |
| Draft/nonterminal Job plan | `JobExecutionConfigSnapshot` + effect bindings | all referenced safe descriptors and historical adapter resolution paths | terminal report/result sealed and no referenced effect ambiguity | manual consistency；no current config/relist |
| terminal duplicate replay | stored result/report/config identity asformal owner requires | no raw material;only readable schema/profile/binding identity needed for exact replay | formal technical retention + active reference protection permit | fail closed;do not recompute response/report |

Historical registry rules:

1. Durable business/execution stores persist only formal safe binding identity and snapshot fields already defined in`03`;they never persist raw locator/material to make recovery easier.
2. Infra/operations owns a recoverable, versioned binding registry outside application truth. It maps exact binding identity to immutable product-neutral descriptor and pinned opaque locator refs; concrete physical storage/provider is P1/`07` material,not fabricated here.
3. Registry revision cannot be rebound in place to a different destination/idempotency namespace. Credential-only replacement under the same revision is allowed only under§8.9 proof and overlap rule.
4. Retire scan must consider outbox,plan,intent,preparation,terminal replay and manual/ambiguous recovery obligations;config activation alone is never a retire signal.
5. If operations explicitly classifies an old effect manual,local material and safe issue refs remain according toretention;classification does not assert external negative/positive outcome.

### 8.11 Change audit handoff to Step 10

本 Step定义audit requirement，不新增durable config-audit对象。Step10必须在不泄露locator/material的前提下选择现有operations/config control plane或提出明确`03`影响；最小语义如下:

| Change class | Required safe metadata | Prohibited metadata | Activation / review expectation |
|---|---|---|---|
| R ref change | safe change/actor/config/issue refs、canonical field ID、finite subject kind/outbound event name、family、validation result | old/new full binding/consumer/target ref、ref hash/digest、raw diff | new complete assembly；policy/safety/target changes按high/critical review |
| S-L locator change | above + adapter/store/transport family、rotation class | locator、provider URI/revision body、credential fingerprint | provider/descriptor resolution + capability gate before activation |
| mixed catalog change | safe change/config/issue refs、canonical catalog field ID、finite subject kind/outbound event names、added/removed counts、family/phase、totality result | full consumer/target/binding ref、whole catalog、array index、adapter object dump | whole replacement validation；old binding retirement separately gated |
| credential-only provider rotation | safe change/config/issue refs、canonical field ID、family、rotation result、overlap/retire status category | full binding/consumer/target ref、material、fingerprint、provider receipt/body、old/new locator | reconstruct/new assembly；same-ref proof documented outside business truth |
| activation/rollback | old/new config refs、assembly result、drain/rollback status、safe issue ref | raw config/source path/env/secret | only complete runtime eligible;rollback builds/activates validated prior semantics |
| historical retirement | safe change/decision/issue refs、binding family、finite obligation categories/counts、retirement result | full binding/consumer/target ref、descriptor/locator/material、subject payload | only after all §8.10 obligations close;manual remains explicit |

Formal Step15中某个既有业务记录拥有typed identity，不会自动授权generic telemetry或config-change audit复制该identity；metric labels仍禁止任何ref，durable operations audit若尚无owner也不得由Step10私建business ledger。Current安全基线只允许canonical field ID、finite subject kind/outbound event name、family/phase/count/result与safe change/config/issue refs；默认不记录完整Report/Peripheral consumer ref、target/binding ref、locator或其可关联fingerprint。

### 8.12 Error / unavailable / fallback matrix

| Scenario | Detection boundary | Required result | Writes / output | Forbidden fallback |
|---|---|---|---|---|
| raw secret/material出现在JSON/ENV field | parser/redline validator | `InvalidConfiguration` | no adapter/business write；safe issue ref only | redact value后继续、treat asopaque ref、fallback lower source |
| typed ref empty/malformed/wrong owner | typed constructor/validator | `InvalidConfiguration` | no partial candidate/runtime | trim/casefold/prefix guess/alias |
| required locator missing aftermerge | cross-field validator | `InvalidConfiguration` or formal required binding failure | no resolution attempt | provider default/first locator/empty string |
| selected locator provider unavailable/denied/expired | infra private resolver | `SensitiveReferenceUnavailable` forsecret/endpoint resolution or exact safe construction category | no material/config/report write；safe assembly telemetry | raw env secret、old cache、fake/controlled、another target |
| store descriptor/schema/UoW/CAS/fence mismatch | builder capability gate | `StoreCompatibilityMismatch` / `RequiredCapabilityMissing` | startup probe only | InMemory/process mutex/best-effort store |
| adapter descriptor/mode/family/phase mismatch | adapter constructor | `AdapterConstructionFailed` / `RequiredCapabilityMissing` | no partial handle escape | trust config claim、Disabled/degraded conversion |
| enabled catalog/entry binding incomplete | totality/entry validator | `EntryBindingIncomplete` / `InvalidConfiguration` | no affected composition root | first-call failure、partial route registration |
| explicit Disabled with non-null binding/credential/capability conflict | config validator | `InvalidConfiguration` | no resolver call | ignore extra material、no-op success |
| assembly succeeds then exact adapter becomesUnavailable | availability/operation boundary | formal exact-scope Unavailable/Degraded/ApplicationError | onlyformal runtime telemetry/owned marker where flow defines | source fallback、reroute、changebusiness truth |
| historical binding/locator not resolvable | resume/preflight | manual/consistency/typed unavailable;no external call | retainold snapshot/intent/plan + safe issue | current binding/credential substitution、rebuild token/material |
| private cause cannot be safely mapped | infra error mapper | generic finite safe category + issue ref/suppression | no raw cause chain | Display/source-chain/debug fallback |
| new candidate/rotation fails whileold assembly exists | process activation boundary | reject new assembly；old lifecycle unchanged perStep09/10 | no claim ofautomatic rollback/LKG | partially replace adapters、reuse newlyresolved subset |

### 8.13 禁止输出与持久化边界

| Surface | Allowed | Denied |
|---|---|---|
| structured log | finite phase/result/error kind、`config_ref` whereformal、adapter family、effect phase、safe issue ref | raw config/path/env、full R/S-L ref、secret/material、endpoint/route/topic、provider body/error chain |
| metric name/value/labels | low-cardinality assembly/error/family/result categories；safe count/duration values | all refs、locator/material、provider/product name、subject/actor/trace/binding identity、secret hash |
| trace/span | formal operation/family/phase/result；propagated trace context | config dump、full binding/credential/transport/policy/schedule refs、endpoint/provider detail |
| startup error / CLI stderr | `RuntimeAssemblyError` variant + safe issue ref；config ref/family only wherevariant owns | raw value、source path、env name/value、full locator、provider cause、stack/panic dump |
| durable business audit/history | only fields already owned byformal record schema | config change log、secret read receipt、locator/material/provider metadata |
| future config-change audit | §8.11 safe metadata afterStep10 owner decision | full refs/diffs、fingerprint、material、provider receipt/body |
| Job report / stored result | formal refs/counts/outcomes and safe config snapshot subset | raw config、R/S-L locator、secret、provider status body、real run/evidence/verdict |
| outbox/event payload | formal body-free event snapshot only | config/binding/transport/credential refs unless exactformal payload already owns safe binding identity；secret/material |
| handoff/export report | formal local intent/preparation/delivery/issue refs | target endpoint/credential/package/provider response、signoff/verdict |
| generated artifact/test fixture | planned redacted schema/result whenfuture `05/06` defines it | real credential、raw provider response、private registry dump、fabricated evidence |
| config identity/provenance | body-free config ref、safe source kind perStep05/09 | raw normalized config、file/path/env identity、locator/material、secret hash |

Enforcement sequence固定为typed allowlist mapping before serialization。Forbidden material不能通过hash、digest、base64、URL masking、partial string、error source chain或“仅debug级别”输出。Mapping失败suppress whole unsafe field set；不得让observability自身为secret leak attempt创建包含原值的second signal。

### 8.14 敏感配置逐项停审记录

| Family | 存储/明文 | 读取 owner | Rotation / historical | Audit / no-output | 结论 / 缺口 |
|---|---|---|---|---|---|
| F01 technical adapter refs | opaque R only；no seed/provider body | clock/ID registry | new assembly；不改既有ref truth | config ref + finite family only | pass；no `03` change |
| F02 five safety policy refs | opaque R；policy body禁止 | safety/policy registry | new assembly；no mid-request change | full ref/policy body denied | pass；required/fail closed |
| F03 four store slots | S-L locator/null；DSN/credential禁止 | store private resolver/constructor | new assembly；no migration/current-store fallback | slot/family/config ref only | pass；physical provider remainsP1 |
| F04 freshness policy | opaque R；nothreshold body | policy registry/application input | new assembly/Job formal freeze | no full ref/default Fresh | pass |
| F05 five root adapters | R binding + S-L credentialleaf | exact adapter/credential registries | §8.9 credential vs destination rule | family/phase/config/issue only | pass；Disabled/Fake null rules retained |
| F06 publication | whole catalog;effect R;transport S-L | catalog + publisher registry | 12 subject new binding;old outbox pin | no route/topic/credential/full ref | pass；historical registry P1 storage undecided but semantic gate closed |
| F07 handoff | typed consumer/effect R + mixed adapter | handoff registry | prepare/deliver same old binding | no target/package/credential/signoff | pass |
| F08 peripheral export | typed consumer/effect R + mixed adapter | export registry | exact target isolation/old intent pin | no product/body/credential/verdict | pass |
| F09 inbound consumers | mixed catalog;transport S-L;policy R | worker transport/policy registries | new registration only;no accepted fact reinterpretation | operation/family/config only | pass；9 static producer map unchanged |
| F10 schedules | catalog/ref R;no cron/provider body | scheduler registry | new triggers only;existing Job snapshot unchanged | operation/config only | pass；schedule neversupplies Job input |
| raw secret/material family | no root field/source/default | private adapter only | provider rotation per§8.9 | denied allchannels/surrogates | pass；concrete provider not established |
| six environment lanes | same schema/precedence | lane-owned private composition | no cross-lane fallback | no environment credential/evidence claim | pass；staging/prod reality remainsnot established |

Each family has explicit storage、plaintext ban、reader、rotation、audit、log/error/report prohibition and failure posture。No unresolved family-level conflict remains。

### 8.15 跨敏感配置泄露风险审计

| Audit item | Conclusion | Gap / correction |
|---|---|---|
| Step07 20 R / 4 S-L / 3 mixed是否全覆盖 | pass | §8.3~§8.4 exact total；无unowned row |
| R是否被误当raw secret | no | R保留typed identity/registry语义；不无谓进入provider |
| S-L是否被误当material | no | locator可入ordinary config，material只在private memory |
| mixed container是否whole dump/hash | forbidden | leaf classification + safe projection；whole object noDebug/audit |
| JSON/ENV是否可承载raw credential | no | C14/typed redline reject；invalid不fallback |
| provider result是否成为override/source | no | stage5 only；不改mode/target/capability/timeout/identity |
| provider bootstrap是否循环依赖root secret | no by contract | external private capability；具体deployment proof留`07` |
| new assembly是否复用old cache/LKG secret | no | every assembly resolves own candidate；failure doesnot partially swap |
| credential rotation是否可能改道old effect | no | exact binding + overlap/idempotency proof；otherwise new ref |
| destination/namespace change是否可能复用old ref | no | must create new `effect_binding_ref` |
| old binding是否通过持久化raw secret恢复 | no | durable owner只存safe identity；infra registry保留descriptor+locator resolution |
| missing old binding是否fallback current route | no | manual/consistency/no call；material retained |
| full consumer/target/binding ref、locator或fingerprint是否进入audit/telemetry | no | no current safe fingerprint或generic ref-output schema；only canonical field ID、finite subject kind/outbound event name、family/phase/count/result与safe change/config/issue refs |
| provider access audit是否被当L4业务truth | no | provider/operations-owned；L4 only safe runtime signal |
| Fake/Controlled/Disabled是否泄露private map/material | forbidden | same no-output/parity；Fake credential null |
| Local/CI是否可复制production material | no | lane matrix explicitly forbids |
| staging/prod是否被声称provider/credential ready | no | contract only，instance/material/evidence not established |
| error/source chain是否可能泄漏 | forbidden | infra maps typed category then drops raw cause;noDisplay chain |
| hash/base64/partial mask是否可绕no-output | no | all transformed surrogates denied |
| secret handling是否改变truth/no-write/redaction/idempotency | no | no invariant switch/config field/port/state added |
| 是否需要立即回写`03` | no | existing code contract sufficient；future triggers listed §9.2 |
| unresolved cross-sensitive conflict | none | exact inventory、lane/domain/VETO、Markdown与truthfulness静态检查均通过 |

### 8.16 23 配置域敏感边界停审

| Domain | Sensitive relevance | Owner / boundary | Step08 conclusion |
|---|---|---|---|
| `CFG-D01` source acquisition | source may carry opaque refs,never material | infra loader/registry | pass；raw secret no source/priority |
| `CFG-D02` config identity | config ref must exclude locator/material/path | config identity producer | pass；no secret fingerprint |
| `CFG-D03` runtime/technical | two adapter refs R | technical registry | pass；new assembly only |
| `CFG-D04` protocol boundary | no sensitive field in current schema | contracts/boundary | pass；must not infersecret from payload/header |
| `CFG-D05` entry dispatch/schedule | transport S-L、actor/schedule R | worker/jobs infra registries | pass；entry never reads provider/env |
| `CFG-D06` redaction/body-free | required policy refs R,safety critical | safety registry | pass；noDisabled/test bypass |
| `CFG-D07` correlation/visibility/labels | policy refs R；source allowlist N | policy registry | pass；no identity/authorization body |
| `CFG-D08` observation/idempotency store | store locator S-L | store constructor | pass；no DSN/no InMemory fallback |
| `CFG-D09` projection store | store locator S-L | projection store constructor | pass；unavailable notFresh |
| `CFG-D10` Job execution/report store | store locator S-L | Job store constructor | pass；claim/fence capability required |
| `CFG-D11` transaction/schema | no newsecret field；store descriptor private | builder gate | pass；timeout/revision not credential |
| `CFG-D12` digest | no sensitive config；profiles N | canonical serializer | pass；never digest secret as surrogate |
| `CFG-D13` technical retention | no locator；numeric N | idempotency/intent stores | pass；retention doesnot authorizesecret retirement alone |
| `CFG-D14` projection/freshness | policy R + numeric N | policy registry/Job snapshot | pass；no policy body/defaultFresh |
| `CFG-D15` claim/concurrency/budget | no locator；numeric N | execution config | pass；fence/claim tokens remainprivate and are notconfig |
| `CFG-D16` retry | no locator；policy numeric N | wrappers/Job snapshot | pass；provider cannot rewrite retry/recovery |
| `CFG-D17` safe resolvers | binding R + credential S-L | four adapter registries | pass；private material/formal outcome only |
| `CFG-D18` publication | catalog/effect R + transport/credential S-L | publisher/historical registry | pass；12 targets total、old binding retained |
| `CFG-D19` report handoff | consumer/effect R + mixed adapter | handoff registry | pass；no package/credential/signoff |
| `CFG-D20` peripheral export | consumer/effect R + mixed adapter | export registry | pass；no product truth/verdict |
| `CFG-D21` sensitive refs | all three layers/lifecycle | infra private boundary | pass；provider/bootstrap/rotation/no-output closed |
| `CFG-D22` lifecycle | old config/binding identity sensitive | process activation + historical registry | pass；new assembly/old work pin/no reroute |
| `CFG-D23` environment/view | lane ownership and isolation | document-only matrix | pass；no new source/field/instance evidence |

All 23 domains retain theirStep03/04 owner and do not gain a new global secret map。Sensitive handling is an attribute/boundary,not a second configuration authority。

### 8.17 Requirement VETO 与敏感门禁映射

| Requirement VETO | Sensitive-side gate | Evidence in this Step | Conclusion |
|---|---|---|---|
| `VF-OBS-001` core closure missing | required locator/descriptor/capability fail complete assembly；no partial façade | §8.2/§8.12/§8.16 | covered |
| `VF-OBS-002` raw secret/payload/runtime body enters | material no root/source/store/output；typed rejection before serialization | §8.5/§8.7/§8.13 | covered |
| `VF-OBS-003` external evidence/artifact/identity/governance body stored | policy/provider/external body excluded；onlybody-free refs | §8.3/§8.5/§8.13 | covered |
| `VF-OBS-004` telemetry/handoff/export becomes truth | provider/access/receipt/health remain non-authority | §8.11/§8.13/§8.15 | covered |
| `VF-OBS-005` correlation changes business truth | actor/correlation policy body private；ref rotation never reinterpretscommitted truth | §8.3/§8.9 | covered |
| `VF-OBS-006` fake run/evidence/verdict/signoff | provider/config/rotation audit is not evidence；no real material/result claim | §2.2/§8.6/§8.13 | covered |
| `VF-OBS-007` retention deletes active material | historical binding retirement requiresall active/ambiguous obligations closed | §8.9~§8.10 | covered |
| `VF-OBS-008` non-core compile dependency | provider/store/transport remainruntime infra composition | §2.2/§3/§8.1 | covered |
| `VF-OBS-009` named product becomes truth/prerequisite | provider/product unselected；capability/locator product-neutral | §2.2/§6.2/§8.1 | covered |
| `VF-OBS-010` historical material promoted | old Step/key/profile/provider/digest audit wording excluded | §5~§6 | covered |

No VETO is weakened by environment、provider、rotation、emergency、test、debug or optional target。A secret-provider success cannot override any VETO or serve as acceptance evidence。

## 9. 对详细设计的影响判定

### 9.1 Current conclusion

| Step08 conclusion | 是否改变 code contract | Current `03` basis | Action |
|---|---|---|---|
| R/S-L/mixed归一为规范四级 | no | formal §13已有typed refs与infra/application ownership | no writeback |
| ordinary root只保存opaque ref/null | no | formal §5.4/§13 raw/validated/snapshot三层；Step14 `CredentialRef`/`StoreBindingRef`等 | no writeback |
| material只在infra/adapter private memory | no | formal §5.4、§13.8 builder stage5、§14 redaction | no writeback |
| provider product/API不进入root/public/application | no | formal `03`明确provider detail封装在infra，exact provider留`04`/implementation | no writeback；保持product-neutral |
| bootstrap由process/deployment提供private resolution capability | no,作为现有infra builder内部composition约束 | formal runtime builder在stage5解析sensitive refs；constructor实现细节未成为public/business contract | no writeback；Step07 reality check确认具体composition |
| selected locator不可读fail closed/no fallback | no | `RuntimeAssemblyError::SensitiveReferenceUnavailable`与complete-or-error builder已定义 | no writeback |
| safe catalog/entry/Job snapshot剔除locator/material | no after R2 | formal §5.4/§13 R2将raw Consumer/schedule binding保持infra-only，worker/jobs slice改为locator-free metadata并由prebuilt registrar封装private slots | consumed targeted writeback；不放宽Step08 no-locator/no-material边界 |
| opaque registrar是否形成新sensitive exposure | no | formal R2只暴露finite safe metadata、`register_all`和无API的opaque handle；禁止locator/material/private registry getter、`Any`、downcast、lookup/invoke/serialize | least-authority capability allowed；不属于application business port/public protocol |
| change/rotation形成new complete assembly | no | formal §13.8 activation与immutable config | no writeback |
| credential-only rotation保留binding ref的严格条件 | no | formal §13.5已有destination/idempotency namespace/old-token可解析规则 | no writeback |
| historical registry保留descriptor+locator resolution而非material | no | formal exact binding catalog/old binding recovery + forbidden material共同推导 | no schema writeback；physical registry留`07` reality check |
| runtime secret read不写business audit | no | formal Query/no-write、telemetry non-authority、startup failure no business write | no writeback |
| no full locator/fingerprint output | no | formal §14 field matrix拒绝endpoint/topic/route/path/credential ref及hash escape | no writeback |

Current Step08本身没有新增raw key、sensitive level、provider API、business struct/port、builder stage、error variant、state、store、protocol或function flow。R2只消费formal `03`已定义的infra-entry technical registrar，用它闭合原no-locator/no-material边界；不声称已实现或已注册。Upstream blocker=`none`，Step08敏感边界分支已被current Step09 R2消费。

### 9.2 Future impact triggers

| Future request / discovery | Why it changes `03` | Required return point | Block-until behavior |
|---|---|---|---|
| root新增provider kind/ref、KMS key、mount、certificate、trust-store、secret version/TTL field | changes raw/typed config schema,validation,builder binding | DDD Step06/14/17/19 + formal §5/§13；再回current `04` | no implementation/config key until writeback confirmed |
| pluggable/public `SecretProvider` trait、new builder constructor API或provider-specific error surface | changes infra code contract/DI/error definition | DDD Step04/05/07/12/14/17/19 + formal §4/§5/§11/§13 | internal implementation cannot invent public trait/API |
| in-place reload/hot rotation/adapter swap | changes builder/activation/concurrency/snapshot/error/rollback flow | DDD Step09/11/12/13/14/17 + formal §8/§10~§13 | current remains cold new assembly only |
| application/domain/entry需要读取locator/material/provider availability | violates ownership and constructor boundaries | DDD Step05/07/09/14/15/17 + formal §5/§8/§13/§14 | prohibited;stop design/implementation |
| durable store/Job snapshot/audit/report需要保存locator/material/fingerprint | changes persistence/security/report schema | DDD Step06/08/11/14/15/17 + formal §6/§7/§10/§13/§14 | prohibited until full redaction/VETO review |
| credential rotation changes destination/idempotency namespace withoutnew binding ref | breaks token/idempotency/historical binding | DDD Step08/09/11/13/14/17 + formal §7/§8/§10/§12/§13 | reject candidate/rotation;no old effect call |
| secret/provider result affects retry、visibility、truth、state、retention或acceptance | changes business invariant/authority | return formal `00~03` owning boundary | hard VETO;no config workaround |
| provider becomes non-core sibling compile dependency | changes architecture/dependency closure | formal `01` + DDD Step03/04/14/17 | prohibited until architecture approval |
| config-change durable audit requires a new local owner/record/repository | changes object/store/UoW/telemetry contract | DDD Step06/07/09/11/15/17/19 + formal §5/§8/§10/§14 | Step10 must report blocker,not invent generic audit ledger |
| exact safe locator fingerprint is required in output/audit | changes redaction schema/canonicalization/privacy surface | DDD Step06/13/15/16/17 + formal §6/§12/§14/§15 | current emits no fingerprint/hash |

## 10. 正式 `04` §8 回填草稿

Formal `04-配置设计.md`只能在Step15装配。Its §8 must preserve the following structure and conclusions,not copy the full calibration discussion verbatim:

````md
## 8. 敏感配置与密钥管理

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“三层ownership模型”“Step07敏感配置总表”“provider bootstrap与safe resolution”“rotation/historical binding”“禁止输出”“停审/VETO”和“详细设计影响判定”。

### 8.1 敏感级别与ownership

| Level | Current meaning | Rule |
|---|---|---|
| `internal` | non-secret runtime/validation parameter | may enter internal config;whole root still cannot be logged |
| `sensitive` | opaque binding/policy/target/transport/credential locator | ordinary config may store typed ref;full value cannot enter output |
| `secret` | raw credential/key/token/cert/DSN/endpoint/provider material | never a root field;infra/adapter private memory only |

Step07 `R` is a sensitive typed reference;`S-L` is a sensitive locator,not material;`mixed` containers are classified per leaf。Application/domain/entry receive only safe validated projections and never read provider/file/env。

### 8.2 Sensitive resolution chain

ordinary DECL/JSON/ENV opaque ref
  -> typed candidate and redline validation
  -> body-free config identity
  -> owner-specific infra descriptor/secret resolution
  -> private adapter material
  -> complete runtime or safe startup error

Provider result has no source priority and cannot change mode,target,capability,timeout,schema,policy or truth。Disabled skips resolution only whenformal binding/credential-null rule is satisfied。

### 8.3 Sensitive configuration table

The formal table must cover technical refs、five safety policy refs、four store locator slots、freshness policy、five root adapters、12 outbound target bindings、report/export catalogs、9 Consumer transports/actor policies and Job schedules。Each row/family retains:level,ordinary storage,plaintext ban,private reader,rotation/historical rule,audit/no-output and failure。

### 8.4 Rotation and historical binding

Current supports only a new complete assembly。Credential-only rotation may preserve an effect binding ref only when destination and provider idempotency namespace are unchanged and every old/ambiguous token remains resolvable;otherwise new work requires a new binding ref。Existing Job/outbox/intent/preparation always uses its stored snapshot/binding;missing historical binding stops beforecall and never falls back tocurrent route。

### 8.5 Prohibited output and audit

Log/metric/span/error/audit/report/artifact cannot contain raw config,full locator,secret,endpoint,topic,path,provider body/error chain or transformed hash/base64 surrogate。Allowed startup fields are finite phase/result/error,config ref,adapter family/effect phase and safe issue ref according toformal telemetry tables。Config-change audit requirements are handed toStep10;this section creates no business audit truth。

### 8.6 Failure and stop rules

Raw material in ordinary source or malformed typed ref rejects the candidate。Selected locator unavailable maps tosafe assembly failure with no fallback。Descriptor/capability/entry mismatch keeps its own formal error category。Post-assembly Unavailable is an operation/availability fact,not a source fallback or truth change。
````

Formal assembly prohibitions:

- Do not include any real locator、endpoint、topic、path、credential、provider product/API、secret fingerprint、mount or env key.
- Do not claim staging/prod provider/credential/rotation evidence exists.
- Do not say every R ref is raw secret or every S-L locator may enterapplication.
- Do not compress historical binding into “restart uses current secret”.
- Do not create generic secret-read business audit or acceptance evidence.

## 11. Downstream handoff and open material

### 11.1 Step09 loading / validation handoff

| Required Step09 input | Fixed here | Must still define in Step09 |
|---|---|---|
| source-to-ref parse | raw material forbidden;R/S-L typed constructors;invalid winner nofallback | exact env registry/key mapping,coherent source read,parse order and safe provenance carrier |
| config identity | established beforematerial resolution;no locator/material/hash/path | canonical identity producer,input fields,recoverability and collision/error behavior |
| resolution plan | owner-specific R registry then S-L private resolution | exact internal call/order,dedup/cleanup behavior and all-or-error assembly mechanics without addingpublic contract |
| requiredness | mode/slot/surface conditional;Disabled/Fake null rules | executable cross-field matrix and exact startup stop point per root |
| safe projection | catalog/slices/snapshot exclude locator/material；opaque prebuilt registrar可作为least-authority registration capability | exact raw/private/safe/handler totality、all-or-nothing register/revoke和无locator/material/private getter证明 |
| candidate failure withold runtime | no partial swap/no implicit LKG claim | activation handoff and observable process result,without enteringStep10 rollback policy |

### 11.2 Step10 change / audit / rollback handoff

| Required Step10 input | Fixed here | Must still define in Step10 |
|---|---|---|
| change classes | R,S-L,mixed catalog,credential-only,destination,activation,retirement | review/authorization classes and change lifecycle |
| audit metadata | safe change/actor/config/issue refs + canonical field ID + finite subject kind/outbound event name + family/phase/count/result；no full Report/Peripheral consumer、target/binding ref | actual owner/landing/schema;must backwrite`03` if new durable record required |
| activation | new complete assembly only | prepare/activate/drain/rollback ordering and failure behavior |
| historical retirement | active/ambiguous/replay obligations must close | reference scan,decision authority and operational retention procedure |
| rollback | rebuild/activate prior valid semantics,never rewriteold material | exact eligibility and conflict handling;no unvalidated process handle reuse |

### 11.3 Step11 / Step12 / `05~07` handoff

| Downstream | Input from Step08 | Prohibited claim |
|---|---|---|
| Step11 failure | §8.12 exact distinction:invalid config,sensitive unavailable,descriptor/capability/entry mismatch,post-assembly unavailable,historical missing,new-candidate fail | all failures are one secret error;provider unavailable meansfallback |
| Step12 config handoff | 27-row coverage、six lanes、rotation/old binding、no-output、bootstrap/cleanup risks | tests/instances/provider/runbook already exist |
| current `05` | positive/negative cuts for R/S-L/mixed,source rejection,provider unavailable,private projection,rotation,old binding,no-output,fake parity | test IDs/results/evidence in this Step |
| current `06` | VETO for raw material,full-ref leak,hash escape,rerouteold effect,provider truth/fake success | acceptance pass/verdict/signoff |
| current `07` | provider/bootstrap/permissions reality check,private wrapper,adapter construction,historical registry,activation/retirement,redaction checker | implementation commit/hash,selected product or production readiness |
| deployment/operations | concrete provider,identity/permission,mount/network,credential issuance,overlap,retire,incident/core-dump/runbook | configuration design as proof of operational readiness |

### 11.4 Open material classification

| Open material | Current status | Blocking scope | Owner / deadline |
|---|---|---|---|
| `CFG-BLK-09-01` Step08 sensitive exposure branch | `resolved_by_formal_03_R2` | no longer blocks D05/D21；registrar公开面若新增locator/material/private getter则重新阻断 | current Step09 re-audit；implementation reality由`05~07` |
| concrete secret/provider/store/transport products and APIs | `not_selected` | does not block Step08/formal design;blocks corresponding real Endpoint/Durable implementation/integration | ADR/`07` reality check before affected implementation boundary |
| provider bootstrap identity/permission and deployment mechanism | `not_established` | blocks real IntegrationLike/RuntimeLike assembly | `07` + deployment before environment bring-up |
| historical binding registry physical storage and retention implementation | `not_selected` | blocks external effect implementation/recovery readiness,not semantic design | `07` boundary before publisher/handoff/export implementation |
| physical memory zeroization/locking/core-dump hardening | `not_evaluated` | blocks security hardening claim,not code-level no-output contract | `07`/security/operations before production readiness |
| same-ref credential rotation proof and overlap/runbook | `not_established` | blocks real rotation/retirement,not static binding rule | operations/security before first rotation |
| config-change audit owner/schema | deferred toStep10 | blocks claiming auditable config change implementation | Step10;backwrite`03` if new durable owner is needed |
| exact loader/env/provenance/config identity algorithm | deferred toStep09 | blocks config loader implementation | Step09 |
| actual tests/evidence/acceptance | `not_run` / nonexistent | blocks implementation/release readiness | current `05/06/07` and real execution |

These are explicit downstream preconditions,not upstream blockers forStep08。They cannot be converted into defaults、fake evidence or “implementation may decide” semantics。

## 12. Current M3 affected sensitive-boundary register

| Affected ID | Sensitive-boundary relevance | Fail-closed / no-output rule | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | payload schema不是secret/provider可提供对象 | provider/body/credential不得补schema，I05保持不激活 | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | producer binding不是locator resolution副作用 | transport locator不能推producer/event mapping | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | H13 authority不来自credential或replay target | 不因target可解析而生成positive H13 | open_controlled |
| `R06-F-AFFECT-UOW-01` | resolved material只构造adapter，不改变UoW | secret/provider失败不得触发partial accepted write | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | sensitive unavailable是typed startup/runtime事实 | 不从provider文本或secret kind推recovery class | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | exact descriptor/locator必须与frozen binding relation一致 | resolved material不可替换binding/phase link | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | credential rotation必须保持same destination/namespace/token semantics | 不因新credential可用重置retry accounting | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | worker registrar不得暴露secret或outbox rebuild能力 | 无same-UoW surface时不注册positive path | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | provider/transport health不是commit certainty | 不以Available、credential refresh或timeout选择ack-success | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | report destination credential不是report ref owner | 不输出/mintrun、report ref、evidence alias或signoff | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | sensitive wrapper不得变成public secondary carrier | no alias/getter/downcast/private registry exposure | inherited_affected |
| `03-RPR-S09-PER-FLOW` | secret cut只验证每flow边界之一 | provider matrix不替代60条exact flow audit | inherited_affected |

Final M3 revalidation confirms five separate layers:ordinary opaque locator、infra-private descriptor、resolved material、
locator-free safe projection和stored historical binding identity。任何层都不能通过getter、hash/fingerprint、error、log、
metric、span、audit、report或evidence index泄漏上一层material。Step08关闭`0/12`；新上游blocker=`none`。

## 13. Final self-check and gate

### 13.1 Static / semantic checklist

| Check | Final status | Evidence / assertion |
|---|---|---|
| SOP eight questions answered | done | §4.1~§4.8 |
| four standard levels and R/S-L/mixed semantics | done | §7.1~§7.2 |
| three-layer ownership and bootstrap | done | §7.3/§8.1~§8.2 |
| Step07 sensitive inventory total | pass | Step07/08 canonical path + normalized tag逐行`diff`为空；R20/S-L4/mixed3=27 |
| six environment lanes | pass | §8.6 exact 6个唯一ENV ID |
| source/provider/material separation | done | §8.7~§8.8 |
| rotation/historical binding closure | done | §8.9~§8.10 |
| audit/no-output/error closure | done | §8.11~§8.13 |
| per-family stop review | done | §8.14 |
| cross-sensitive audit | done | §8.15 |
| 23 config domains | pass | §8.16 exact 23个唯一CFG-D01~D23 |
| 10 requirement VETOs | pass | §8.17 exact 10个唯一VF-OBS-001~010 |
| `03` impact and future triggers | done_after_R2 | §9.1~§9.2；`CFG-BLK-09-01`定向回写已消费，opaque registrar不放宽locator/material禁止边界 |
| formal §8 draft and downstream handoff | done | §10~§11 |
| no raw secret/product/instance/evidence fabrication | pass | product/evidence词仅用于diagnosis、prohibition或`not_*` open material；无actual value/run/result/signoff |
| Markdown/table/fence/duplicate heading/whitespace | pass | 36个表格块/422行列数一致；6条围栏成对；无重复标题、坏字符或新增尾随空白；`git diff --check`通过 |

### 13.2 Completion gate

Step08 may become `pass` only when all of the following are true:

```text
every Step07 R/S-L/mixed registry row has one owner and handling rule;
ordinary refs,private descriptors,and secret material remain separated;
storage,plaintext ban,reading,rotation,audit,and no-output are explicit;
new assembly and historical binding behavior are both recoverable without storing material;
all six lanes,23 config domains,and 10 requirement VETOs are covered;
no code contract is silently extended and no unresolved upstream blocker remains;
Markdown and truthfulness checks pass;
the project stops for user review before Step09.
```

| Gate | Current status | Reason / next action |
|---|---|---|
| Step08 input gate | `pass` | standards,current upstream,historical/reference read inrequired order |
| Step08 content gate | `pass_consumed_by_step_09` | 原Step08与R2已对最终formal `03`复核，并传播12项affected sensitive boundary |
| upstream blocker | `none` | `CFG-BLK-09-01`的Step08分支已闭合；raw binding仍infra-only，registrar无locator/material/private getter |
| formal `04` gate | `blocked` | only Step15 may assembleformal document |
| implementation readiness | `blocked` | current `04~07`,target repo,provider reality,tests/evidence incomplete |
| next_allowed_action | `continue_to_current_step_09_under_continuous_M4_authorization` | 按SOP进入Step09；不得跳到Step10或formal装配 |
