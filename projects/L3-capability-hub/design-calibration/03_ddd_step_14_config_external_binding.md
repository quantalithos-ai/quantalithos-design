# L3-capability-hub 03 详细设计 Step 14: 配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §13 配置引用与外部依赖绑定
> 创建日期: 2026-07-18
> 当前模式: full-restart
> 状态: `03_step_14_completed_stop_review`
> 正式文档状态: 本 Step 不修改正式 `03-详细设计.md`;正式装配留 Step 19
> Safe-text scanner controlled repair: 2026-08-09; the fixed marker registry/matching/precedence is explicitly non-configurable; no config key, section, profile, Port or binding inventory changes

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 14 `定义配置引用与外部依赖绑定` |
| 用户授权 | 用户于2026-07-18明确要求“解除限制，进入下一个step”，随后在中断后回复“继续”；允许关闭Step 13项目内推进限制并进入本Step |
| Step 13 gate | `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`保留历史诊断，但按精确`IdempotencyKey::as_str().as_bytes()`原始UTF-8依赖假设在Capability Hub内解除；L0-core正式设计同步为非阻塞债务 |
| 标准输入 | 详细设计SOP Step 14、详细设计书写规范§5.13、设计真相源闭环标准§2.12、全局项目依赖关系与裁剪规则、中间产物规范 |
| 直接上游 | 正式`01/02`；Step 3/4/5/6/7/8/11/12/13；概要Step 11配置影响轮廓 |
| 粒度参考 | `projects/L1-governance`与`projects/L1-artifact`同名Step 14；只参考分批和表格粒度，不复制领域对象、outbox/relay或retention结论 |
| 实现边界 | 只写设计仓文档；不实现代码，不创建implementation ledger / planned boundary skeleton，不伪造commit、run、测试、evidence或签署 |
| 注释门禁 | `14.0`未新增Rust声明；`14.1~14.4.3`在`infra/config.rs`、entry codec与worker-private processing / continuation boundary定义的struct / enum / field / variant / payload / callable均必须逐项提供英文`///` Rustdoc |

## 1. Step 内计划与批次状态

| 批次 | 可审查产物 | 完成门禁 | 状态 |
|---|---|---|---|
| `14.0` | 标准/上游读取、SOP八问、候选全集、historical / blocker / debt检查、分批计划 | 候选有owner和后续落点，不提前写最终schema/产品/数值 | completed_stop_review |
| `14.1` | config owner、infra-local schema、validation/failure surface、禁止配置化矩阵 | 每个配置类型/字段/variant/callable可落码且英文Rustdoc完整；不污染contracts/domain | completed_stop_review |
| `14.2` | 配置引用明细表、entry/runner参数承接、codec/hash/authoritative-read/retry绑定 | 每项有类型、读取模块、默认口径、`04`落点和不变量 | completed_stop_review |
| `14.3` | 27 个 local/base Port 到 local durable/fake adapter 绑定、UoW/transaction/runtime builder 前半 | 每个 Port 只有一个装配 owner；durable/fake 语义一致；不发明 cleanup/hidden store | completed_stop_review |
| `14.4` | 9 external Port、6 Inbound、10 Outbound、8 Job的运行期/event/handoff绑定与不可用策略 | typed outcome/error不被transport text改写；external effect不回滚local truth | completed_and_consumed_by_14_5_0；`14.4.1~14.4.4`已完成并被`14.5.0`依赖分类基线承接 |
| `14.5` | 跨仓Rust依赖表、sibling存在性/不可用处理、完整runtime builder顺序 | 只有`core-contracts`进入Cargo；其余明确adapter/event/API/fake与缺失处理 | completed_stop_review；`14.5.0~14.5.4`已闭合，等待用户确认进入`14.6` |
| `14.6` | historical audit、Step 3~13交叉闭环、正式§13 assembly source、Step 15 handoff和完成门禁 | SOP三张表完整、无未分类依赖/配置、正式`03`仍未修改 | completed_stop_review |

本Step按批次停审。`14.0`只建立候选和门禁；任何候选在对应后续批次确认前均不是最终配置字段、默认值或crate选择。

`14.5`继续按以下子批次停审。子批次是设计推导和审查边界，不改变 Step 14 的正式章节归属：

| 子批次 | 产物 | 完成门禁 | 状态 |
|---|---|---|---|
| `14.5.0` | 实际 sibling 检查、依赖分类基线、缺失处理矩阵、跨层依赖图 | 事实与设计假设分离；只有 `core-contracts` 获得编译期候选资格 | completed_stop_review |
| `14.5.1` | 七个 workspace member 的 member-by-member Cargo dependency matrix | 每个 member 的直接依赖、禁止依赖、workspace 继承方式和路径均闭合 | completed_stop_review |
| `14.5.2` | runtime builder 完整顺序、composition root 和 cycle-free factory boundary | `infra` 不依赖 `worker`；entry graph 不暴露 partial graph；所有 blocking slot 有明确 gate | completed_stop_review；`14.5.2.0~14.5.2.3`已闭合Stage 0~7、API / Worker / Jobs composition和跨entry最终blocking matrix |
| `14.5.3` | runtime / event / downstream ASCII 裁剪图、不可用和 fake/fixture parity | configured / fake / disabled / missing 四类行为不混淆 | completed_stop_review |
| `14.5.4` | cross-step、historical、Rustdoc、`04` handoff 和 Step 14 收口输入 | 无未分类依赖；正式 §13 source 可由本 Step 直接装配 | completed_stop_review |

## 2. 本 Step 目标与非目标

### 2.1 必须闭合

1. 哪些代码层允许读取raw/validated配置，哪些层只接收已注入Port或typed参数。
2. `infra/config.rs`与`infra/runtime_builder.rs`如何承接local store、resolver、handoff、event collaboration、clock、id、codec和hash绑定。
3. Step 7的36个application-owned Port如何分别绑定local durable adapter、deterministic fake或external adapter。
4. API、worker、jobs入口只读取哪些entry-local配置，如何避免绕过Step 8 typed protocol和Step 9 application facade。
5. Step 13留下的deterministic protocol codec、SHA-256实现、authoritative read/session、bounded retry和timeout读取点。
6. `core-contracts`唯一编译期依赖的本地path写法，以及所有runtime/event/downstream依赖的协作方式和不可用处理。
7. disabled / not configured / temporarily unavailable / timeout / invalid typed response如何保持Step 12既有typed error/outcome语义。
8. 具体key、格式、env、endpoint、credential、topic、数值、部署和运维细节如何移交`04-配置设计.md`。

### 2.2 本 Step 不定义

- 不选择具体DB、cache、search、broker、scheduler、API gateway、secret platform、observability backend或部署平台。
- 不写raw URL、credential、secret/token、transport topic、consumer group、cron、SQL、TLS、环境变量名或配置文件示例。
- 不给timeout、retry count、backoff、jitter、batch size、parallelism、page limit或observation window伪造数值默认值。
- 不新增runtime/tools execution、provider route/quota/cost/failover/health、governance approval、method body、SDK client或marketplace listing状态。
- 不新增idempotency TTL、stored-result cleanup、Job journal expiry或capture deletion；当前Step 7没有相应Port，Step 13 v1窗口等于完整sidecar集合生命周期。
- 不把external collaboration包装成本地outbox、delivery retry、dead-letter或second queue lifecycle。
- 不定义完整CLI/env schema；Step 14只盘点entry-local参数owner，具体flag/env/default和binary矩阵由`04`继续闭合。
- 不修改正式`03-详细设计.md`，不创建`04`、implementation ledger或planned boundary skeleton。

## 3. 必读输入与读取结论

| 输入 | 读取结论 | 本 Step 使用 |
|---|---|---|
| 详细设计SOP Step 14 | 必须输出配置引用、外部依赖绑定、跨仓Rust依赖三张表并回答八问 | `14.1~14.6`逐批形成，不在`14.0`伪造完成 |
| 详细设计书写规范§5.13 | 运行期/event依赖不得写Cargo；path依赖必须给本地路径和不可用处理 | `14.5`硬门禁 |
| 真相源闭环标准§2.12 | config不得改变truth、state、metadata/idempotency、query/job、forbidden body或phase boundary | `14.1/14.2`禁止配置化矩阵 |
| 全局依赖裁剪规则 | 只有编译期依赖可进入path dependency；runtime/event通过adapter/event/projection/fake | `14.4/14.5`分类基线 |
| 正式`01-架构设计.md` §§5、7~11 | `L0-core`唯一编译期候选；bus/event、external source、governance/method seam和下游消费产品中立 | 不把具体技术设施写成已确认 |
| 正式`02-概要设计.md` §11~§12 | config只进入entry/consumer/job/adapter builder；需要闭合ConfigValidator、Adapter/Job/Read/Event/Publisher/Handoff方向 | 形成配置owner候选，不沿用旧`03`配置 |
| 概要Step 11 | 已列配置影响轮廓、禁止配置化边界和`03/04`分工 | 作为候选来源；字段级形状仍由本Step判断 |
| Step 3 | Rust workspace、唯一`core-contracts` path依赖、本地sibling分类和目标实现仓缺失已固定 | `14.5`不重分类 |
| Step 4 / 5 | `config`归`infra`；`infra/config.rs`与`runtime_builder.rs`已固定；application只依赖Port | `14.1~14.5`文件owner |
| Step 6 | infra runtime config / builder / adapter state是强reopen watchpoint；当前43+7对象不含canonical runtime config | 后续只在infra-local层闭合；若出现跨layer canonical state才受控回开Step 6 |
| Step 7 | 36 Ports = 5 base/read-gate + 22 repository/replay/capture/journal + 9 external | `14.3/14.4`必须36/36绑定，不新增private Port |
| Step 8 / 9 | 83 protocols/flows；entry只映射protocol并调用application；worker不得直连repository/publisher | 配置不能改变protocol inventory或调用边界 |
| Step 11 | 22 repository traits / 110 methods、原子UoW和authoritative durable state已固定 | physical binding不得降级为best effort或跨store非原子拼装 |
| Step 12 | 6种safe Port failure class、17 ApplicationError、51 issue codes和83/83 mapping已固定 | transport/config只单向映射到既有typed分类 |
| Step 13 | SHA-256/canonical frame、无TTL、bounded retry、commit-unknown权威读、capture/intent和Job journal重入已固定 | 本Step只绑定实现和参数读取点，不改语义 |
| L1-governance / L1-artifact Step 14 | 提供分批、配置表、外部依赖、runtime builder审计粒度 | 不复制其outbox/relay、retention或领域Port |

## 4. SOP 八问首轮回答

| SOP问题 | `14.0`裁决 |
|---|---|
| 1. 哪些模块需要读取配置? | raw config只由`infra/config.rs`加载/校验；`infra/runtime_builder.rs`读取validated config并构造adapter/service graph。`api`、`worker`、`jobs`入口装配只读取各自entry-local config view或builder产物。`application`只接收36个Port与少量后续明确的typed runtime参数；`contracts`、`domain`、repository object和protocol DTO不读取配置。 |
| 2. 配置项的类型、默认值和读取位置是什么? | `14.0`只识别候选section：runtime/profile、local store/UoW、external resolver、event collaboration、handoff、clock/id、codec/hash、API/read、consumer/event、job、retry/timeout和diagnostic。exact infra-local type/field/default口径在`14.1/14.2`闭合；数值和raw配置细节留`04`。不存在已授权的TTL/cleanup section。 |
| 3. 哪些外部依赖需要通过adapter注入? | 22 repository/store Port和5 base/read-gate Port由infra local adapter注入；9 external Port分别承接external source、governance、method、secret、document、consumer、observability/audit resolver、audit handoff和event collaboration。bus与6个Inbound source通过worker/event binding；下游SDK/runtime/tools主要消费API/event/view，不成为application直接client。 |
| 4. 外部依赖的超时、重试、降级策略是什么? | 具体数值后移`04`。只有Step 12的`TemporarilyUnavailable / Timeout`及Step 13声明的optimistic path可进入bounded retry；`NotConfigured / PermanentlyRejected`需配置/owner修复；invalid typed/unexpected/consistency/codec/commit-unknown不得自动重试或文本分类。Query只返回既有typed degraded surface，external collaboration失败不回滚truth。 |
| 5. 哪些配置细节应留给配置设计文档? | 配置文件格式/key、profile merge、CLI/env、endpoint、credential/TLS、transport topic/group、product kind、numeric timeout/retry/backoff/jitter/batch/parallelism/page/observation、schedule、health probe、hot reload、deployment secret source和运维文案。 |
| 6. 哪些跨仓Rust编译期依赖需要本地path? | 只有`quantalithos-core/crates/contracts`的`core-contracts`：workspace root使用`core-contracts = { path = "../quantalithos-core/crates/contracts" }`，实际需要的member用`core-contracts.workspace = true`。其余sibling不得进Cargo。 |
| 7. 哪些运行期或事件协作依赖要用adapter/event/projection/fake? | `quantalithos-bus`、governance、method-library、SDK、runtime、tools、marketplace候选、observability/audit、secret平台、external MCP/A2A/API与external document source全部走Port、event、API、controlled view、projection、handoff或明确fake。 |
| 8. 依赖仓不存在时如何处理? | `core-contracts`缺失或授权签名/字节语义不兼容时暂停并回开设计。运行期依赖缺失时仅local/test profile可使用显式fake/fixture；真实profile不得静默fallback fake。正式typed event/adapter contract缺失时暂停对应integration boundary并回设计，不私造sibling DTO。下游consumer缺失不阻塞Capability Hub core P0。 |

## 5. 配置读取与注入 owner 候选

| owner组 | 允许读取内容 | 注入/输出 | 明确禁止 | 后续批次 |
|---|---|---|---|---|
| `infra/config.rs` | raw config source、profile selector、infra-local sections | validated infra-local config或validation failure | public protocol、domain rule、secret正文、业务truth | `14.1` |
| `infra/runtime_builder.rs` | validated config、adapter registry/ref | 36 Port实现、application services、entry facade/runner graph | 让application持有raw config；disabled时伪造成功adapter | `14.3~14.5` |
| infra adapter modules | 对应section的validated constructor args | repository/resolver/handoff/collaboration/clock/id/codec实现 | 读取其它section补隐式依赖；定义业务状态 | `14.3/14.4` |
| `api` assembly | API-local boundary/read timeout/profile view | handlers只持有application facade与entry policy | handler直连repository/resolver；route改变closed operation | `14.2` |
| `worker` assembly | source/schema binding、loop/runtime controls | consumer/event continuation facade与ack mapping | topic反推source/event identity；直连capture repo/publisher | `14.2/14.4` |
| `jobs` assembly | job runner controls、entry-local config/profile | typed Step 8 Job input交给application job service | CLI scope字符串替代Job DTO；runner重规划/修truth | `14.2/14.4` |
| `application` | 不读raw config；仅接收Port和必要typed runtime parameter | deterministic orchestration与typed outcome |按config跳过metadata/idempotency/visibility/UoW/state guard | `14.1/14.2` |
| `contracts` / `domain` | none | none | config type、endpoint、topic、retry数值、adapter kind进入public/domain object | all batches |

Step 6的infra watchpoint在本Step保持有效：若`14.1`发现某配置状态必须跨adapter持久化、进入public response或成为application durable authority，必须先回开Step 6/7；普通infra-local config structs和builder-local state不计入43+7业务/application对象基线。

## 6. 配置 section 候选全集

以下是候选分组，不是最终Rust字段或配置key。`14.1/14.2`必须逐项裁剪、命名、给类型与默认口径；未被保留的候选不得进入`04`或实现fixture。

| 候选section | 候选内容 | 读取/绑定位置 | 必须保持的不变量 |
|---|---|---|---|
| runtime/profile | validated profile/config identity、allowed adapter/store kinds | `infra/config.rs`、`runtime_builder.rs` | profile不能改变state/owner/protocol |
| local store/UoW | truth/projection/reference/idempotency-result/capture-journal adapter refs、transaction authority | repository modules、UoW manager | Step 11原子集合、CAS、unique、authoritative read不变 |
| codec/hash | deterministic public surface/event envelope codec、SHA-256 implementation | contracts/application codec boundary、infra assembly | Step 13 frame/domain/field order/bytes不变；codec变更需schema/domain migration |
| external resolver | 7 resolver family bindings与availability | `source_resolvers.rs` | body-free typed outcome；不读外部正文补truth |
| audit handoff | observability/audit target binding与availability | `handoff_adapters.rs` | 不保存raw audit/evidence，不把receipt当验收 |
| event collaboration | stable-intent collaboration adapter、transport mapping | `publishers.rs` / worker facade binding | local只保存snapshot/capture/intent binding；无local delivery lifecycle |
| API/read | request boundary、page/timeout/freshness runtime hints | API assembly、typed application parameter | Query no-write；degraded source仍typed |
| consumer/event | source family、schema acceptance、entry availability、bounded dependency retry | worker assembly | six closed consumers不由topic字符串扩展；source event ref不是offset |
| jobs | runner timeout/attempt/batch/parallelism/schedule references | jobs assembly | frozen plan/journal唯一重入事实；job不修core truth |
| retry/timeout | typed Port failure eligible policies、contention attempt boundary | adapter wrapper/entry runner | only declared typed classes；无unbounded loop或raw-text classification |
| authoritative observation | primary/session read binding、commit confirmation procedure | UoW/store adapter | one `None`不证明rollback；无sleep/window/replica fallback猜测 |
| safe diagnostics | redacted config/adapter availability categories | infra/entry wrappers，Step 15继续 | 不含raw body、secret、endpoint、stack/evidence alias |

### 6.1 明确不存在的配置候选

| 禁止候选 | 原因 | 正确处理 |
|---|---|---|
| idempotency/result TTL | Step 7无delete/expire方法；Step 13 v1 key window等于reservation+sidecar集合生命周期 | 未来若要retention，先设计原子retention protocol并回开Step 7/11/13 |
| Job journal reset/expiry | 会让same key重规划并破坏frozen journal authority | 新run使用新raw key；未来cleanup需新设计 |
| event capture TTL/local DLQ | 会丢失pre-intent recovery authority并私占external delivery lifecycle | capture/snapshot保持现有生命周期；external owner管理delivery |
| bypass idempotency/visibility/trace flag | 破坏Step 8~13不变量 | config validation拒绝，不提供字段 |
| runtime/tools execution adapter | 不归Capability Hub | 下游消费formal exposure/controlled view |
| provider route/quota/cost/failover/retry config | 属于provider runtime/finance边界 | descriptor只保留正式body-free接入摘要 |
| governance approval/method body/SDK client config | 跨truth owner | 只配置已有ref/resolver/handoff绑定 |

## 7. 外部依赖候选全集

### 7.1 36 Port分类绑定候选

| Port组 | 数量 | 候选adapter owner | `14.0`不可放宽项 |
|---|---:|---|---|
| UoW / Clock / Id / read visibility | 5 | local transaction、system/deterministic clock、id generator、visibility resolver adapter | clock/id分离；Query read gate不由handler跳过 |
| core truth/relation/material repositories | 18 | `repositories.rs`、`projection_stores.rs`、`reference_stores.rs` | expected version、append/unique/index、query no-write、fake parity |
| reference/replay repositories | 4 | reference state、idempotency、stored result adapters | typed replay、canonical digest、no generic decoder/cleanup |
| event capture / Job execution repositories | 2（包含在18 repository分类基线中，单列风险） | capture/snapshot与journal adapter | capture+snapshot、journal+target/final sidecar对称，不拆hidden store |
| external resolver/handoff/collaboration Ports | 9 | `source_resolvers.rs`、`handoff_adapters.rs`、`publishers.rs` | exact typed outcome、body-free、stable intent、no error text mapping |

Step 7官方总数仍为`5 + 18 + 4 + 9 = 36`；上表对event capture / Job journal只作风险交叉标记，不重复计数。`14.3/14.4`必须输出36/36逐trait绑定索引。

### 7.2 runtime / event / downstream依赖候选

| 依赖 | 类型 | 当前协作候选 | 不可用时首轮口径 |
|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期 | shared metadata/ref/contracts + authorized `IdempotencyKey` accessor | 缺失暂停；签名/字节语义变化回开Step 13 |
| `quantalithos-bus` | 事件协作 | six inbound bindings + ten outbound collaboration envelopes | local/test显式fake；真实binding缺contract则暂停integration |
| external MCP / A2A / API sources | 运行期 | source/document/secret ref resolvers + descriptor source context | unavailable形成existing typed failure/outcome；不执行external capability |
| `quantalithos-governance` | 运行期/event | governance result resolver + inbound change consumer | fake/fixture仅local/test；不复制approval/Policy body |
| `quantalithos-method-library` | 运行期/event | method asset resolver + inbound change consumer | fake/fixture仅local/test；不复制method body |
| `quantalithos-sdk` | downstream consumer | API/formal exposure/controlled view/event | 缺失不阻塞core；本仓不引入SDK client |
| `quantalithos-runtime` / `tools` | downstream/runtime consumer | controlled view、formal exposure、consumer refs/feedback | 仓缺失不阻塞core；不建立源码依赖 |
| marketplace/console | optional read-only consumer | ecosystem discovery/API | disabled/absent不阻塞core；不得形成listing truth |
| observability/audit | runtime/handoff | audit ref resolver + safe handoff | fake handoff for local/test；真实缺失映射existing unavailable，不伪造evidence |
| secret/KMS/Vault | external security | secret ref/safe summary resolver only | unavailable保持typed unresolved/unavailable；secret正文永不入仓 |

## 8. Historical Material 与污染检查

| material | 冲突配置/依赖口径 | 当前处理 |
|---|---|---|
| README | MCP whitelist、runtime必经hub、Provider Contract、API key/KMS、quota/cost/LLM routing、Policy更新、marketplace注册 | 全部historical_material；只保留“external MCP/A2A/API capability integration center”方向线索 |
| 旧正式`03` | provider/KMS/cost/decision/outbox/topic/retry配置、单crate `config/`、runtime/tools access gateway | 不继承任何配置字段、adapter、目录或product；按新版Step 3~13重建 |
| 旧`05/06` | 旧P95/30s、实现/验收口径可能被误当默认值或证据 | 不进入Step 14；数值需后续`04/05/06`重新确认，不继承测试/签署事实 |
| L1参考Step 14 | outbox/relay、retention cleanup和其领域resolver清单 | 仅参考粒度；Capability Hub使用snapshot/capture + external collaboration，且v1无retention Port |
| sibling implementation | 可提供实际signature/path线索 | 不能伪称正式设计已同步；只在用户授权的exact accessor假设内使用 |

## 9. Blocker、设计债务与回开条件

| ID | 类型/状态 | 当前事实 | 处理口径 |
|---|---|---|---|
| `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` | historical blocker / resolved project-locally | L0-core正式设计未声明accessor；实现存在`as_str(&self)->&str` | 采用用户授权的exact原始UTF-8 bytes假设；不阻塞`14.x` |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non-blocking cross-repo debt | 上游正式设计仍待同步 | `14.5/14.6`保留；签名/byte semantics变化回开Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non-blocking cross-repo design debt | sibling `core-contracts`实现当前为string/numeric newtype `serde(transparent)`及actor/metadata explicit serde shape，但L0-core正式设计未承诺wire稳定性 | Hub v1 fixture锁定当前shared-field bytes；L0-core正式设计应同步；shape变化回开Step 8/13/14，不阻塞`14.2` |
| `CH-DDD-S14-INFRA-CONFIG-SCHEMA-001` | resolved in batch `14.1` | exact infra-local owner、validated root、profile matrix、validation/failure surface与禁止配置化矩阵已闭合 | 不回开Step 6；未来若config成为public/persisted/cross-Port authority则受控回开 |
| `CH-DDD-S14-CODEC-HASH-BINDING-001` | resolved in batch `14.2` | canonical frame保留手写；stable surface/outbound/inbound使用exact DTO `serde_json`；SHA-256使用`sha2 0.10.9` `Sha256` API | `14.5`只装配和审计Cargo member落点；不得换算法/formatter |
| `CH-DDD-S14-AUTHORITATIVE-READ-001` | semantic contract resolved in `14.2`;adapter assembly pending `14.3` | UoW manager三态resolution、linearizable authority read、barrier与winner procedure已闭合 | `14.3`逐local adapter证明可满足；不能满足则登记产品绑定blocker，禁止sleep/replica guess |
| `CH-DDD-S14-ENTRY-ARGS-001` | typed owner resolved in batch `14.2`;raw schema deferred to `04` | api/worker/jobs exact typed parameter blocks、reader与禁止项已闭合 | `04`写exact CLI/env/key/default数值；不得新增业务scope/target/run/idempotency参数 |
| target implementation repo absent | non-blocking design prerequisite | `/home/aris/Projects/quantalithos-capability-hub`当前不存在 | Step 17/`07`实施前检查；本Step不伪造Cargo或adapter已存在 |

Batch `14.1`完成时的unresolved upstream blocker为`0`。其余active closure item必须在指定批次关闭；若无法在既有owner/Port/protocol内闭合，立即登记blocker并回开对应Step，不得用配置字符串、fake private map或implementation TODO代替。

## 10. 批次写入与读取门禁

### 10.1 `14.1`配置 owner/schema

进入前读取：本文§§4~9、Step 4 `infra/config.rs`/`runtime_builder.rs`、Step 6 §§3.4/5 infra watchpoint、Step 12 config/adapter failure mapping、真相源标准§2.12。

必须输出：infra-local config root/section/type/validation/failure surface、允许读取矩阵、禁止配置化矩阵、全部新增struct/field/enum/variant/callable英文`///`。不得写完整配置key/env/数值。

### 10.2 `14.2`配置引用与technical binding

进入前读取：`14.1`确认结果、Step 8 entry schema、Step 12 retryability、Step 13 §§8/15/20/21。

必须输出：配置引用明细表；deterministic codec/SHA-256 crate/API；authoritative read/session；bounded retry/timeout/batch/parallelism读取点；entry-local typed owner和`04`移交。不得新增TTL/cleanup。

### 10.3 `14.3`local Port/adapter绑定

进入前读取：Step 7 5 base + 22 repository/replay/capture/journal traits、Step 11 transaction/consistency、`14.1/14.2`。

必须输出：27个local/base Port逐trait实现位置、store grouping、UoW authority、durable/fake parity、runtime builder前半顺序。不得选择未经上游授权的具体DB产品或拆分原子集合。

### 10.4 `14.4`external/event/job绑定

进入前读取：Step 7九external Ports、Step 8六Inbound/十Outbound/八Job、Step 9相应flow、Step 12 external mapping、Step 13 capture/retry。

必须输出：逐Port、逐consumer、逐outbound family、逐Job runner绑定；typed timeout/retry/degraded/disabled策略；event source/schema/transport mapping边界。不得本地化external delivery lifecycle。

### 10.5 `14.5`跨仓与runtime builder

进入前读取：Step 3/4 dependency matrix、正式`01` §8、全局依赖裁剪规则、`14.1~14.4`。

必须输出：跨仓Rust依赖表、本地路径/Cargo/协作方式/不可用处理、sibling存在性、runtime builder完整顺序与failure gate。只有`core-contracts`可进入Cargo。

### 10.6 `14.6`收口

进入前读取：本文全部、Step 3~13 active completion、正式`00/01/02` owner边界、旧README/正式`03/05/06`。

必须输出：historical/cross-step/cardinality审计、正式§13 assembly source、Step 15/16/17 handoff、Step完成门禁。正式`03`仍留Step 19。

## 11. Batch `14.0` 自检与停审快照（历史记录）

本节保留 `14.0` 完成时的停审快照，仅用于审计；当前恢复点以本文顶部状态、最新完成节§59、`03_ddd_calibration_flow.md` 和 `project_execution_ledger.md` 为准，不再使用本节或其他历史停审节中的旧 `next_allowed_action`。

| gate | 结果 | 依据 |
|---|---|---|
| Step 13解阻事实准确 | pass | 原诊断保留；exact accessor假设、非阻塞债务和reopen条件已记录 |
| SOP八问 | pass for intake batch | §4逐问回答；后续表格尚未伪称完成 |
| 配置候选owner完整 | pass | §§5~6覆盖infra/api/worker/jobs/application及technical binding |
| 36 Port候选覆盖 | pass as inventory | §7按`5+18+4+9=36`分类；逐trait绑定留`14.3/14.4` |
| 依赖类型裁剪 | pass | §7.2只允许core编译期；runtime/event/downstream不进Cargo |
| v1 retention边界 | pass | §6.1明确无TTL/cleanup配置，避免照抄L1参考 |
| historical material隔离 | pass | §8隔离README、旧`03/05/06`和参考项目差异 |
| blocker/debt | pass | unresolved upstream blocker=`0`；3个Step 14 closure item与1个`04`移交项有owner |
| structure comment gate | pass | 本批无Rust声明；后续新增配置声明必须逐struct/field/variant/callable英文Rustdoc |
| 正式/实现纪律 | pass | 正式`03`未修改；未创建`04`、implementation ledger、boundary skeleton、代码、commit、run、test/evidence/sign-off |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.0
gate_status = 03_step_14_batch_14_0_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_1
```

Batch `14.0`完成并停审。用户确认后只允许进入`14.1`，定义config owner、infra-local schema、validation/failure surface和禁止配置化边界；不得提前写`14.2`配置引用明细、`14.3/14.4`adapter绑定、`14.5`runtime builder或`14.6`正式§13 assembly source。

---

## 12. Batch `14.1` 开工输入与裁决

| 输入问题 | 读取结论 | 本批裁决 |
|---|---|---|
| Step 6 infra strong-reopen watchpoint | runtime config、builder state和adapter state尚未作为canonical object闭口 | 配置只是infra-local immutable assembly input，不持久化、不跨application Port；无需增加43+7对象或回开Step 6业务/application对象卡 |
| Step 4 / 5 owner | `config.rs`负责config structs / validation，`runtime_builder.rs`负责assembly；application只依赖Port | raw/config refs/validation均归`capability-hub-infra`；contracts/domain/application不定义或读取config type |
| Step 7 read visibility | `CapabilityReadVisibilityResolverPort`由formal owner/index/material/reference authority形成结果 | v1不设独立read-visibility adapter selector；它与local persistence binding及trusted actor context一起装配，避免配置默认Visible |
| Step 11 local atomicity | truth、material stale、capture、stored result、idempotency和Job journal会跨repository同UoW原子提交 | v1只有一个local persistence authority binding；禁止为不同logical store配置彼此独立且不能同事务提交的store slots |
| Step 12 error owner | startup/config assembly归`InfraError::RuntimeAssembly`；合法Port调用后的失败归六类`ApplicationPortFailureKind` | 不新增`ConfigError`业务层、protocol code或application variant；infra-local validation error只进入nonpublic source chain |
| Step 13 compatibility | canonical frame、SHA-256、stored-surface/event bytes和no-retention语义固定 | validated config只携带固定compatibility profile；raw config不能选择其它algorithm/codec semantics或TTL |

### 12.1 本批不进入的内容

- 不写配置引用明细表、字段默认值和读取模块全集；留`14.2`。
- 不选择codec/hash crate、authoritative-read driver或retry数值；留`14.2`。
- 不逐Port指定durable/fake constructor和runtime builder顺序；留`14.3~14.5`。
- 不写CLI flag、env key、config文件格式、endpoint、topic、credential或deployment profile正文；留`04-配置设计.md`。

## 13. 配置三层所有权

| 层 | owner / lifetime | 允许内容 | 输出 | 禁止内容 |
|---|---|---|---|---|
| raw source layer | `infra/config.rs` parser-local；只存在于startup load/validate期间 | format-specific sections、endpoint/transport/credential references、数值参数 | validated infra-local binding与后续typed parameter blocks | 进入log/public error/persistence/application/domain；raw secret/body复制 |
| validated binding layer | `CapabilityRuntimeConfig`；process-lifetime immutable | profile、entry kind、single persistence authority、external adapter modes/refs、clock/id、fixed compatibility、policy refs、redacted diagnostics mode | runtime builder只读输入 | hot mutation、business truth、state、Port outcome、raw URL/topic/secret |
| assembled runtime layer | `runtime_builder.rs` process-local state；`14.5`继续闭合 | concrete 36 Port implementations、application facade、entry runner | API/worker/jobs调用面 | 被当作persisted state、public DTO、recovery authority或第二adapter registry truth |

配置引用是startup进程内的symbolic safe name，不是URL、filesystem path、transport topic、credential、external object ref或business id。`infra/config.rs`必须先把raw材料解析、校验并绑定到对应ref；application和adapter Port方法不得接收config ref后再次读取raw config。

## 14. Exact Infra-local Binding Schema

本节声明均归`crates/infra/src/config.rs`，visibility为`pub(crate)`。它们不是public protocol type、HLD object、application helper或persisted schema；因此不改变250 public protocol types、43+7 objects/helpers、36 Ports、22/110 repositories/methods、83 protocols/flows或111/638 state baseline。

### 14.1 Schema、profile与entry identity

```rust
/// Supported validated runtime-configuration schema version.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityConfigSchemaVersion {
    /// Initial capability-hub runtime-binding schema.
    V1,
}

/// Closed runtime profile that constrains infrastructure binding kinds.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityRuntimeProfileKind {
    /// Developer-local runtime that may use deterministic or in-memory bindings.
    Local,
    /// Controlled integration runtime that may use explicit fakes or configured dependencies.
    Integration,
    /// Deployment runtime that requires durable and non-fake dependency bindings.
    Deployment,
}

/// Process entry assembled from one validated runtime configuration.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityRuntimeEntryKind {
    /// Synchronous command and query API entry.
    Api,
    /// Inbound-event and continuation worker entry.
    Worker,
    /// One-shot operations-job entry.
    Jobs,
}

/// Validated symbolic configuration name with no path, URI, secret, or transport meaning.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityConfigName(
    /// Name-safe process-local configuration identifier.
    String,
);

/// Symbolic configuration reference for one local persistence authority.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityStoreConfigRef(
    /// Validated store-binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one concrete external adapter binding.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityAdapterConfigRef(
    /// Validated external-adapter binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one deterministic fake fixture.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityFixtureConfigRef(
    /// Validated fixture binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one process entry parameter section.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityEntryConfigRef(
    /// Validated entry-section binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one runtime-only technical policy section.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityRuntimePolicyConfigRef(
    /// Validated technical-policy binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one physical inbound feed section.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityInboundFeedConfigRef(
    /// Validated inbound-feed binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one trusted inbound actor section.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityTrustedActorConfigRef(
    /// Validated trusted-actor binding name.
    CapabilityConfigName,
);

/// Symbolic configuration reference for one physical outbound event route.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityOutboundRouteConfigRef(
    /// Validated outbound-route binding name.
    CapabilityConfigName,
);
```

`CapabilityConfigName`的exact grammar为：non-empty ASCII；首字符必须是ASCII alphanumeric；其余字符只允许ASCII alphanumeric、`.`、`_`、`-`；禁止whitespace、control character、`/`、`\\`、`:`、`@`、`?`、`#`及`://`。长度上限由`04`给出，但raw parser必须在构造前执行该上限；本类型不得接收未经过parser bound检查的unbounded input。该grammar使ref不能承载path、URI、credential或transport topic。

### 14.2 Local persistence、external adapter、clock与id binding

```rust
/// Single local persistence authority used by all transactional repositories.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityLocalPersistenceBinding {
    /// In-memory implementation with durable-adapter-equivalent semantics.
    InMemory,
    /// Configured durable implementation behind one transaction authority.
    Durable {
        /// Symbolic reference to the validated durable store configuration.
        store_ref: CapabilityStoreConfigRef,
    },
}

/// Runtime binding for one application-owned external Port.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityExternalAdapterBinding {
    /// Deterministic typed fake available only outside the deployment profile.
    DeterministicFake {
        /// Symbolic reference to one validated typed fixture set.
        fixture_ref: CapabilityFixtureConfigRef,
    },
    /// Configured concrete runtime adapter with no raw material in this surface.
    Configured {
        /// Symbolic reference to one validated concrete adapter configuration.
        adapter_ref: CapabilityAdapterConfigRef,
    },
    /// Explicit unavailable adapter that returns the stable not-configured class when called.
    Disabled,
}

/// Runtime binding for the authoritative application clock.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityClockBinding {
    /// System-backed authoritative clock for normal runtime use.
    System,
    /// Deterministic clock available only outside the deployment profile.
    Deterministic {
        /// Symbolic reference to one validated clock fixture.
        fixture_ref: CapabilityFixtureConfigRef,
    },
}

/// Runtime binding for application identifier generation.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityIdGeneratorBinding {
    /// System-backed identifier generator for normal runtime use.
    System,
    /// Deterministic identifier generator available only outside the deployment profile.
    Deterministic {
        /// Symbolic reference to one validated identifier fixture.
        fixture_ref: CapabilityFixtureConfigRef,
    },
}
```

`InMemory`不是弱化语义的hash-map shortcut：它必须与durable adapter保持Step 11的single-UoW atomicity、CAS、unique/current indexes、stable page/cursor、insert-only sidecars、rollback、authoritative-read和asymmetry classification parity。`Disabled`也不是成功fake；application调用该Port时必须得到existing `PortFailure { failure: NotConfigured }`，不得自动切换`DeterministicFake`。

### 14.3 Fixed compatibility与diagnostics binding

```rust
/// Closed public-surface serialization compatibility profile.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityProtocolCodecProfile {
    /// Deterministic v1 stored-surface and outbound-envelope compatibility contract.
    StableSurfaceV1,
}

/// Closed canonical digest compatibility profile.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityDigestProfile {
    /// SHA-256 v1 digest contract fixed by Step 13.
    Sha256V1,
}

/// Fixed compatibility choices consumed by codec and digest assembly.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityCompatibilityBinding {
    /// Deterministic public-surface codec compatibility profile.
    protocol_codec: CapabilityProtocolCodecProfile,
    /// Canonical digest compatibility profile.
    digest: CapabilityDigestProfile,
}

/// Process-local diagnostic exposure mode.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityDiagnosticMode {
    /// No optional diagnostic emission.
    Off,
    /// Redacted diagnostics that exclude raw configuration and external bodies.
    Redacted,
}
```

Compatibility fields are present in the validated surface for explicit assembly and audit, but raw config may only select the one declared v1 value. They are not feature flags: changing codec representation, frame/domain, SHA-256 semantics or stored bytes requires a new compatibility version and migration design, not a different deployment value.

### 14.4 External Port binding group and validated root

The external binding group has one field for each of the nine Step 7 external Ports. No field is optional: a dependency that is intentionally unavailable uses `Disabled`, while an omitted field is an invalid raw document. This distinction lets the runtime builder inject all 36 application-owned Ports without an `Option<Port>` branch or entry-layer service lookup.

```rust
/// Complete runtime bindings for the nine application-owned external Ports.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityExternalPortBindings {
    /// Binding for `ExternalCapabilitySourceReferencePort`.
    external_source_reference: CapabilityExternalAdapterBinding,
    /// Binding for `GovernanceResultReferencePort`.
    governance_result_reference: CapabilityExternalAdapterBinding,
    /// Binding for `MethodAssetReferencePort`.
    method_asset_reference: CapabilityExternalAdapterBinding,
    /// Binding for `SecretReferencePort`.
    secret_reference: CapabilityExternalAdapterBinding,
    /// Binding for `ExternalDocumentReferencePort`.
    external_document_reference: CapabilityExternalAdapterBinding,
    /// Binding for `CapabilityConsumerReferencePort`.
    capability_consumer_reference: CapabilityExternalAdapterBinding,
    /// Binding for `ObservabilityAuditReferencePort`.
    observability_audit_reference: CapabilityExternalAdapterBinding,
    /// Binding for `ObservabilityAuditHandoffPort`.
    observability_audit_handoff: CapabilityExternalAdapterBinding,
    /// Binding for `CapabilityAccessEventCollaborationPort`.
    access_event_collaboration: CapabilityExternalAdapterBinding,
}

/// Immutable validated configuration consumed by the capability-hub runtime builder.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityRuntimeConfig {
    /// Validated schema version for this configuration graph.
    schema_version: CapabilityConfigSchemaVersion,
    /// Runtime profile that constrains all selected binding kinds.
    profile: CapabilityRuntimeProfileKind,
    /// Single process entry assembled from this configuration.
    entry: CapabilityRuntimeEntryKind,
    /// One local persistence authority shared by every transactional repository.
    local_persistence: CapabilityLocalPersistenceBinding,
    /// Complete binding group for the nine external Ports.
    external_ports: CapabilityExternalPortBindings,
    /// Authoritative application-clock binding.
    clock: CapabilityClockBinding,
    /// Application identifier-generator binding.
    id_generator: CapabilityIdGeneratorBinding,
    /// Fixed protocol-codec and digest compatibility choices.
    compatibility: CapabilityCompatibilityBinding,
    /// Symbolic reference to the selected entry-local parameter section.
    entry_config_ref: CapabilityEntryConfigRef,
    /// Symbolic reference to the selected runtime-only technical-policy section.
    runtime_policy_config_ref: CapabilityRuntimePolicyConfigRef,
    /// Validated technical policy values resolved from the selected policy section.
    technical_policy: CapabilityRuntimeTechnicalPolicy,
    /// Validated entry-local parameters matching the selected process entry.
    entry_parameters: CapabilityEntryParameters,
    /// Process-local redacted diagnostic mode.
    diagnostics: CapabilityDiagnosticMode,
}

/// Fully parsed infra-local candidate awaiting closed cross-field validation.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityRuntimeConfigCandidate {
    /// Parsed schema version candidate.
    schema_version: CapabilityConfigSchemaVersion,
    /// Parsed runtime-profile candidate.
    profile: CapabilityRuntimeProfileKind,
    /// Parsed process-entry candidate.
    entry: CapabilityRuntimeEntryKind,
    /// Parsed single local persistence candidate.
    local_persistence: CapabilityLocalPersistenceBinding,
    /// Parsed complete external Port binding candidate.
    external_ports: CapabilityExternalPortBindings,
    /// Parsed authoritative clock candidate.
    clock: CapabilityClockBinding,
    /// Parsed identifier-generator candidate.
    id_generator: CapabilityIdGeneratorBinding,
    /// Parsed fixed compatibility candidate.
    compatibility: CapabilityCompatibilityBinding,
    /// Parsed entry-local parameter-section reference candidate.
    entry_config_ref: CapabilityEntryConfigRef,
    /// Parsed runtime technical-policy section reference candidate.
    runtime_policy_config_ref: CapabilityRuntimePolicyConfigRef,
    /// Parsed technical policy values awaiting cross-field validation.
    technical_policy: CapabilityRuntimeTechnicalPolicy,
    /// Parsed entry-local parameters awaiting cross-field validation.
    entry_parameters: CapabilityEntryParameters,
    /// Parsed process-local diagnostic-mode candidate.
    diagnostics: CapabilityDiagnosticMode,
}
```

There is deliberately no field for `CapabilityReadVisibilityResolverPort`: the builder derives that local adapter from the same persistence authority and trusted actor-context boundary used by the formal visibility repositories. There is also no per-repository store slot, adapter registry selector, event topic, scheduler, retention, cleanup, execution gateway, governance approver, method body loader, SDK client, or marketplace binding in this root.

### 14.5 Required, optional, and disabled rules

| Surface | Cardinality in validated root | Allowed absence representation | Validation rule |
|---|---:|---|---|
| schema/profile/entry | exactly one each | none | raw omission, duplicate, unknown value, or non-v1 schema is startup-invalid |
| local persistence authority | exactly one | none | `InMemory` or one `Durable { store_ref }`; no disabled mode and no second transaction authority |
| nine external Port slots | exactly nine named fields | `Disabled` only | omission is invalid;`Disabled` must still assemble the exact Port and return `PortFailure(NotConfigured)` when called |
| clock/id generator | exactly one each | none | system or profile-permitted deterministic fixture;an entry cannot synthesize time or ids |
| compatibility | exactly one fixed pair | none | only `StableSurfaceV1 + Sha256V1` is accepted |
| entry config ref | exactly one | none | referenced section kind must equal `Api`, `Worker`, or `Jobs` selected by `entry` |
| runtime policy ref | exactly one | none | must resolve to one technical-policy section;its exact timeout/retry/read/job fields are batch `14.2` scope |
| Worker inbound source slots | exactly six named slots inside the `Worker` entry payload | `Disabled` per slot only | every configured slot resolves one exact feed section plus one exact trusted-actor section;every fake slot resolves one exact typed fixture section |
| configured outbound route slots | exactly ten named child fields inside the configured access-event-collaboration adapter section | none per family；absence only by disabling the whole Port slot | every route ref resolves the exact matching event-family section；fake/disabled slots must not carry physical route refs |
| diagnostics | exactly one | none | only `Off` or body-free `Redacted`;there is no raw/full/verbose mode |

An external Port is optional only in the sense that its slot may be explicitly `Disabled`;the runtime object graph itself is total. A `Configured` slot must resolve one adapter section for that exact Port family. A `DeterministicFake` slot must resolve one typed fixture section for that exact family. Sharing an endpoint or credential reference inside raw adapter sections may be designed in `04`, but it does not permit one Port-family config ref to masquerade as another.

### 14.6 Runtime profile compatibility matrix

| Binding surface | `Local` | `Integration` | `Deployment` |
|---|---|---|---|
| local persistence | `InMemory` or `Durable` | `InMemory` or `Durable` | `Durable` only |
| each external Port | `DeterministicFake` / `Configured` / `Disabled` | `DeterministicFake` / `Configured` / `Disabled` | `Configured` / `Disabled`;fake forbidden |
| each Worker inbound source | `DeterministicFake` / `Configured` / `Disabled` | `DeterministicFake` / `Configured` / `Disabled` | `Configured` / `Disabled`;fake forbidden |
| clock | `System` or `Deterministic` | `System` or `Deterministic` | `System` only |
| id generator | `System` or `Deterministic` | `System` or `Deterministic` | `System` only |
| protocol/digest compatibility | stable v1 pair only | stable v1 pair only | stable v1 pair only |
| diagnostics | `Off` or `Redacted` | `Off` or `Redacted` | `Off` or `Redacted` |

`Deployment` does not mean every external Port must be enabled. It means every enabled Port uses a configured non-fake adapter and all transactional repositories use a durable single-authority implementation. A disabled deployment Port remains explicitly unavailable;the builder must not substitute a local fixture, network auto-discovery, sibling repository client, or a generic success adapter.

## 15. Infra-local Validation and Failure Surface

### 15.1 Closed validation issue carrier

Validation must aggregate every safely reportable structural issue in deterministic order before runtime assembly. The issue carrier is crate-private and contains no raw value, path, URL, endpoint, topic, credential, secret, body, environment value, parser exception text, or external product code.

```rust
/// Closed safe category for one runtime-configuration validation issue.
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityConfigValidationIssueKind {
    /// A required schema section or field is absent.
    MissingRequiredBinding,
    /// A singleton schema section or field appears more than once.
    DuplicateBinding,
    /// A closed schema, profile, entry, binding, or compatibility value is unknown.
    UnsupportedValue,
    /// A symbolic configuration name violates the safe-name grammar or configured length bound.
    InvalidConfigName,
    /// A symbolic reference does not resolve to a declared raw configuration section.
    MissingReferencedSection,
    /// A symbolic reference resolves to a section owned by a different binding family.
    ReferencedSectionKindMismatch,
    /// A selected binding kind is forbidden by the runtime profile.
    ProfileBindingMismatch,
    /// More than one local persistence or transaction authority was declared.
    MultiplePersistenceAuthorities,
    /// The fixed codec and digest compatibility pair is not the declared v1 pair.
    CompatibilityMismatch,
    /// A raw configuration surface attempts to control a non-configurable design invariant.
    ForbiddenConfigurationSurface,
}

/// Safe location of one validation issue within the closed infra-local schema.
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityConfigValidationSubject {
    /// Runtime schema-version selection.
    SchemaVersion,
    /// Runtime-profile selection.
    RuntimeProfile,
    /// Process-entry selection or its entry-local section reference.
    RuntimeEntry,
    /// Single local persistence authority.
    LocalPersistence,
    /// External capability-source reference resolver binding.
    ExternalSourceReference,
    /// Governance-result reference resolver binding.
    GovernanceResultReference,
    /// Method-library asset reference resolver binding.
    MethodAssetReference,
    /// External secret reference resolver binding.
    SecretReference,
    /// External document reference resolver binding.
    ExternalDocumentReference,
    /// Runtime, tools, and SDK consumer-reference resolver binding.
    CapabilityConsumerReference,
    /// Observability or audit reference resolver binding.
    ObservabilityAuditReference,
    /// Observability or audit handoff binding.
    ObservabilityAuditHandoff,
    /// Capability access event-collaboration binding.
    AccessEventCollaboration,
    /// Capability-identity-changed outbound route binding.
    OutboundCapabilityIdentityChanged,
    /// Capability-registry-changed outbound route binding.
    OutboundCapabilityRegistryChanged,
    /// Adapter-descriptor-changed outbound route binding.
    OutboundAdapterDescriptorChanged,
    /// Governance-seam-relation-changed outbound route binding.
    OutboundGovernanceSeamRelationChanged,
    /// Capability-method-relation-changed outbound route binding.
    OutboundCapabilityMethodRelationChanged,
    /// Formal-exposure-boundary-changed outbound route binding.
    OutboundFormalExposureBoundaryChanged,
    /// Controlled-consumer-view-availability-changed outbound route binding.
    OutboundControlledConsumerViewAvailabilityChanged,
    /// Capability-change-impact-identified outbound route binding.
    OutboundCapabilityChangeImpactIdentified,
    /// Derived-material-refreshed outbound route binding.
    OutboundDerivedMaterialRefreshed,
    /// Reference-resolution-changed outbound route binding.
    OutboundReferenceResolutionChanged,
    /// Authoritative clock binding.
    Clock,
    /// Identifier-generator binding.
    IdGenerator,
    /// Fixed protocol-codec and digest compatibility binding.
    Compatibility,
    /// Runtime-only technical-policy section reference.
    RuntimePolicy,
    /// Governance-result reference-change consumer source binding.
    InboundGovernanceResultReferenceChanged,
    /// Method-asset reference-change consumer source binding.
    InboundMethodAssetReferenceChanged,
    /// Downstream consumption-impact consumer source binding.
    InboundDownstreamConsumptionImpactReported,
    /// External capability-source reference-change consumer source binding.
    InboundExternalCapabilitySourceReferenceChanged,
    /// Audit-material reference-change consumer source binding.
    InboundAuditMaterialReferenceChanged,
    /// External-document reference-change consumer source binding.
    InboundExternalDocumentReferenceChanged,
    /// Process-local diagnostic mode.
    Diagnostics,
    /// A prohibited raw configuration key or section outside the closed schema.
    ForbiddenSurface,
}

/// One body-free infra-local configuration validation issue.
#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityConfigValidationIssue {
    /// Closed schema subject affected by the issue.
    subject: CapabilityConfigValidationSubject,
    /// Closed safe issue category.
    kind: CapabilityConfigValidationIssueKind,
}

/// Non-empty deterministically ordered set of configuration validation issues.
#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) struct CapabilityConfigValidationIssues(
    /// Issues sorted by subject and then kind with duplicates removed.
    Vec<CapabilityConfigValidationIssue>,
);
```

`CapabilityConfigValidationIssues` is non-empty by construction. It is a safe infra-local source carrier, not a second business/protocol error taxonomy. Its `Display` is compile-time static and it may be boxed only as the nonpublic source of `InfraError::RuntimeAssembly`;a raw parser/concrete constructor failure may retain its own error in the same nonpublic source position. No startup diagnostic may include a raw key or value. Exact operator-facing redacted events belong to Step 15;exact raw syntax, source precedence, key names, length bound, parser-specific diagnostics, and construction of `CapabilityRuntimeConfigCandidate` belong to `04-配置设计.md`.

### 15.2 Constructor, accessors, and validator callables

```rust
impl CapabilityConfigName {
    /// Validates a parser-bounded symbolic name and constructs its safe representation.
    pub(crate) fn try_from_bounded_raw(
        raw: String,
        subject: CapabilityConfigValidationSubject,
    ) -> Result<Self, CapabilityConfigValidationIssue>;

    /// Returns the validated symbolic name without interpreting it as a path or URI.
    pub(crate) fn as_str(&self) -> &str;
}

impl CapabilityStoreConfigRef {
    /// Constructs one store reference after exact store-section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this store reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityAdapterConfigRef {
    /// Constructs one adapter reference after exact adapter-family section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this adapter reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityFixtureConfigRef {
    /// Constructs one fixture reference after exact fixture-family section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this fixture reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityEntryConfigRef {
    /// Constructs one entry reference after exact entry-kind section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this entry-section reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityRuntimePolicyConfigRef {
    /// Constructs one policy reference after exact technical-policy section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this technical-policy reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityInboundFeedConfigRef {
    /// Constructs one inbound-feed reference after exact feed-section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this inbound-feed reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityTrustedActorConfigRef {
    /// Constructs one trusted-actor reference after exact actor-section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this trusted-actor reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityOutboundRouteConfigRef {
    /// Constructs one outbound-route reference after exact route-section resolution.
    pub(crate) fn from_resolved_name(name: CapabilityConfigName) -> Self;

    /// Returns the validated symbolic name of this outbound-route reference.
    pub(crate) fn name(&self) -> &CapabilityConfigName;
}

impl CapabilityConfigValidationIssue {
    /// Constructs one body-free validation issue from closed safe values.
    pub(crate) fn new(
        kind: CapabilityConfigValidationIssueKind,
        subject: CapabilityConfigValidationSubject,
    ) -> Self;

    /// Returns the closed safe category of this validation issue.
    pub(crate) fn kind(&self) -> CapabilityConfigValidationIssueKind;

    /// Returns the closed schema subject of this validation issue.
    pub(crate) fn subject(&self) -> CapabilityConfigValidationSubject;
}

impl CapabilityConfigValidationIssues {
    /// Sorts and deduplicates validation issues, returning none for an empty input.
    pub(crate) fn from_issues(
        issues: Vec<CapabilityConfigValidationIssue>,
    ) -> Option<Self>;

    /// Wraps these safe issues as the nonpublic source of one runtime-assembly error.
    pub(crate) fn into_runtime_assembly_error(self) -> InfraError;

    /// Iterates over validation issues in deterministic subject-and-kind order.
    pub(crate) fn iter(
        &self,
    ) -> impl ExactSizeIterator<Item = &CapabilityConfigValidationIssue>;
}

impl std::fmt::Display for CapabilityConfigValidationIssues {
    /// Formats one compile-time static message without exposing issue or raw-source values.
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result;
}

impl std::error::Error for CapabilityConfigValidationIssues {}

impl CapabilityCompatibilityBinding {
    /// Returns the fixed public-surface codec profile.
    pub(crate) fn protocol_codec(&self) -> CapabilityProtocolCodecProfile;

    /// Returns the fixed canonical digest profile.
    pub(crate) fn digest(&self) -> CapabilityDigestProfile;
}

impl CapabilityExternalPortBindings {
    /// Returns the external capability-source reference resolver binding.
    pub(crate) fn external_source_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the governance-result reference resolver binding.
    pub(crate) fn governance_result_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the method-library asset reference resolver binding.
    pub(crate) fn method_asset_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the external secret reference resolver binding.
    pub(crate) fn secret_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the external document reference resolver binding.
    pub(crate) fn external_document_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the runtime, tools, and SDK consumer-reference resolver binding.
    pub(crate) fn capability_consumer_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the observability or audit reference resolver binding.
    pub(crate) fn observability_audit_reference(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the observability or audit handoff binding.
    pub(crate) fn observability_audit_handoff(&self) -> &CapabilityExternalAdapterBinding;

    /// Returns the capability access event-collaboration binding.
    pub(crate) fn access_event_collaboration(&self) -> &CapabilityExternalAdapterBinding;
}

impl CapabilityRuntimeConfig {
    /// Validates one fully parsed candidate and constructs the immutable runtime binding graph.
    pub(crate) fn try_from_candidate(
        candidate: CapabilityRuntimeConfigCandidate,
    ) -> Result<Self, InfraError>;

    /// Returns the validated runtime-configuration schema version.
    pub(crate) fn schema_version(&self) -> CapabilityConfigSchemaVersion;

    /// Returns the runtime profile selected for this immutable configuration.
    pub(crate) fn profile(&self) -> CapabilityRuntimeProfileKind;

    /// Returns the process entry selected for runtime assembly.
    pub(crate) fn entry(&self) -> CapabilityRuntimeEntryKind;

    /// Returns the single local persistence binding.
    pub(crate) fn local_persistence(&self) -> &CapabilityLocalPersistenceBinding;

    /// Returns all nine external Port bindings as one complete group.
    pub(crate) fn external_ports(&self) -> &CapabilityExternalPortBindings;

    /// Returns the authoritative clock binding.
    pub(crate) fn clock(&self) -> &CapabilityClockBinding;

    /// Returns the identifier-generator binding.
    pub(crate) fn id_generator(&self) -> &CapabilityIdGeneratorBinding;

    /// Returns the fixed codec and digest compatibility binding.
    pub(crate) fn compatibility(&self) -> &CapabilityCompatibilityBinding;

    /// Returns the selected entry-local parameter-section reference.
    pub(crate) fn entry_config_ref(&self) -> &CapabilityEntryConfigRef;

    /// Returns the selected runtime technical-policy section reference.
    pub(crate) fn runtime_policy_config_ref(
        &self,
    ) -> &CapabilityRuntimePolicyConfigRef;

    /// Returns the process-local diagnostic exposure mode.
    pub(crate) fn diagnostics(&self) -> CapabilityDiagnosticMode;
}
```

`CapabilityRuntimeConfigCandidate` is the only semantic handoff from the parser-local layer to cross-field validation. It can be formed only after raw structural checks have established required/unique fields, bounded symbolic names, all nine external slots, typed section-kind resolution, and rejection of unknown/forbidden surfaces. It is not valid runtime configuration, is never persisted or exported, and may exist only during startup. `04` must define the concrete structured parser and how file/environment/CLI sources construct this candidate without changing its fields.

The wrapper-ref constructors are the same validated-newtype pattern as `CapabilityConfigName`: each receives a grammar-valid name only after the parser has resolved it to the exact required section family, and exposes only a crate-private borrowed accessor. Passing a grammar-valid but unresolved or wrong-family name is forbidden even though the Rust parameter type is the same. The implementation must not add `Display`, `Debug`, serialization, generic string conversion, reverse parsing, or public constructors merely for assembly convenience.

### 15.3 Validation algorithm and precedence

The parser-local orchestration plus `try_from_candidate` performs the following closed sequence;later stages run only when their required structural inputs exist, while independent issues are accumulated:

1. Parse with bounded allocation and parser-local raw types. Parser failure becomes `InfraError::RuntimeAssembly`;raw parser text remains only in the nonpublic source chain.
2. Reject unknown, duplicate, or forbidden top-level sections and fields. Unknown extension points are not silently ignored in schema v1.
3. Validate all symbolic names with the grammar in §14.1 and construct typed refs only after the bound check.
4. Resolve each typed ref against the raw section registry and verify exact section-family ownership;never infer family from a name prefix.
5. Require one schema/profile/entry/persistence/clock/id/compatibility/entry-ref/policy-ref/diagnostic value and all nine external Port slots. When `entry=Worker`, also require the exact six named inbound-source slots inside the `Worker` payload;other entry variants must not carry inbound-source bindings.
6. Resolve every configured Worker source to one exact inbound-feed section and one exact trusted-actor section, and every fake source to one exact typed fixture section. Section-family mismatch is `ReferencedSectionKindMismatch` on that source's closed `CapabilityConfigValidationSubject`;slot omission is `MissingRequiredBinding`.
7. When the access-event-collaboration slot is configured, resolve exactly ten named outbound-route refs and require each route section's family marker to match its closed `Outbound*` validation subject. Missing/duplicate/unknown/wrong-family routes are startup issues；fake/disabled collaboration slots reject physical route children as forbidden orkind-mismatched material.
8. Enforce the profile matrix in §14.6, including durable-only deployment persistence and the deployment ban on all deterministic fixtures.
9. Enforce the fixed v1 compatibility pair and reject every prohibited surface in §16.
10. Sort/deduplicate safe issues. The validator calls `into_runtime_assembly_error` for a non-empty set and returns only `InfraError::RuntimeAssembly`;only a zero-issue path constructs `CapabilityRuntimeConfig`.

Validation is whole-root and immutable. There is no “warn and continue”, partial root, last-known-good fallback, hot reload merge, environment-dependent auto-default, adapter auto-discovery, or field-level repair. Defaults that may later be authorized in `04` must be explicit deterministic parser rules and must still produce the exact validated root above;`14.1` authorizes no implicit binding default.

### 15.4 Failure mapping by lifecycle phase

| Failure phase | Required surface | Forbidden surface |
|---|---|---|
| raw parsing, safe-name construction, reference resolution, profile validation, compatibility validation | `InfraError::RuntimeAssembly { source }`;process startup/entry assembly fails before a service call | `ApplicationError`, protocol response, consumer receipt, Job report, persisted issue, fake run/test/evidence/sign-off |
| runtime builder cannot construct a configured store/adapter/clock/id/codec dependency | `InfraError::RuntimeAssembly { source }`;no partially assembled service graph escapes | converting construction failure into `PortFailure`, silently choosing fake/in-memory/disabled, or starting a reduced graph |
| explicitly `Disabled` external Port is called after successful assembly | existing `ApplicationError::PortFailure { failure: ApplicationPortFailureKind::NotConfigured, ... }` for that exact Port | startup error, fake typed success, generic missing dependency string, or a new config error taxonomy |
| configured adapter is called and its concrete typed source fails | exhaustive safe map to `TemporarilyUnavailable`, `Timeout`, `PermanentlyRejected`, `InvalidTypedResponse`, or `UnexpectedSourceFailure`;`NotConfigured` only when the selected binding is absent/disabled at call boundary | raw text/status/private-code parsing, config issue propagation, or retryability inference from message text |
| concrete local persistence call fails after successful assembly | existing exact transaction/repository/application failure mapping from Step 12 | reclassifying a storage call as runtime assembly merely because config selected the adapter |

Only `TemporarilyUnavailable` and `Timeout` may enter a later bounded retry policy when Step 13 effect-boundary conditions are satisfied. `NotConfigured` and `PermanentlyRejected` require configuration or dependency-owner correction. `InvalidTypedResponse` and `UnexpectedSourceFailure` are not automatically retried. Batch `14.2` binds technical policy references and retry/timeout consumption points;this batch does not choose numbers.

## 16. 禁止配置化完整矩阵

The schema is closed. A raw key/section that attempts to express any row below is rejected as `ForbiddenConfigurationSurface`;an implementation change that adds such a field fails design review even if the raw key is absent. “Disabled” only controls whether one external Port is available;it never disables a domain/application invariant or removes a required local Port.

| 禁止配置化主语 | 禁止的配置效果 | 原因 / 固定真相源 | 违规处理或回开位置 |
|---|---|---|---|
| capability access truth owner | 把identity、registry、descriptor、seam、relation、exposure、trace/impact truth交给runtime、SDK、marketplace、governance或外部source | 正式`00/01/02`数据所有权固定 | validation/design gate reject；需回`00/01`重审 |
| capability identity prerequisite | 允许URL、endpoint、provider/tool name、runtime config、SDK cache或listing替代identity | Step 6 identity policy与Step 9 flow固定 | reject；回Step 6/8/9 |
| domain state vocabulary / transition | 增删state、允许非法迁移、跳过guard、恢复terminal对象或按profile改初态 | Step 10 `24 / 111 / 638` closed matrix | reject；回Step 6/10 |
| registry/formal exposure prerequisite | 未完成descriptor/governance/method/visibility前置即标记formal visible/consumable | Step 6 policy与Step 8~10闭合 | reject；回Step 6/8/9/10 |
| adapter descriptor | 配入provider runtime、route、quota、cost、failover、health、invocation retry或secret body | descriptor只拥有body-free接入摘要 | reject；回正式`00/01/02`与Step 6 |
| external MCP/A2A/API boundary | 让Hub执行能力调用、保存tool result/A2A message/API response或拥有provider execution state | Step 7 source Port只解析body-free reference | reject；runtime execution属于边界外 |
| governance seam | 在Hub生成/覆盖approval、Policy、shared rules、vote/workflow或按config自动批准 | governance truth归`L1-governance` | reject；回治理owner设计 |
| method-library relation | 读取/复制method body、source、TaskDefinition、AIPolicyDef、ProcessTemplateDef或按config改asset truth | relation只保存body-free正式ref | reject；回`L3-method-library`与本仓relation边界 |
| SDK exposure | 生成SDK client/package/cache、把SDK local visibility当formal exposure或允许SDK反写truth | Hub只拥有formal exposure与controlled view | reject；回SDK consumer boundary |
| marketplace / console | 创建listing、pricing、transaction、ranking或fulfillment truth | marketplace仅可读消费ecosystem material | reject；回边界外owner |
| secret boundary | 保存secret value、ciphertext、token、password、private key、decryption material或KMS/Vault lifecycle | Hub只保存external secret ref与safe summary | reject；回security/config owner |
| forbidden body scanner | 关闭、删除、重排或扩展八类closed marker；改变exact marker bytes、大小写/边界/precedence；或把raw external body降成safe text | Step 6 §7.2.1 and Step 12 §11.5 fix one trim, exact ASCII byte scan, registry precedence and fail-closed raw-source ownership | reject；回Step 6/8/12 |
| actor / metadata / trace | 关闭trusted actor、operation metadata、trace id、reason或command context要求 | `core-contracts`与Step 8 protocol固定 | reject；回Step 8/13 |
| idempotency / stored replay | 关闭key、digest、reservation/result、same-UoW save或允许duplicate重跑 | Step 11/13 authority固定 | reject；回Step 6/7/8/11/13 |
| idempotency canonical bytes | trim、case-fold、Unicode normalize或改用`Display / Debug / serde`形成key bytes | 用户授权的exact `as_str().as_bytes()`原始UTF-8假设 | reject；签名/字节变化回Step 13并处理上游债务 |
| idempotency/result/Job/capture retention | 配TTL、cleanup、expiry、reset、delete、journal reuse或local DLQ | v1无对应Port；sidecar与journal是recovery authority | reject；未来先回Step 6/7/11/13 |
| local persistence split | 给truth/projection/reference/idempotency/result/capture/journal配置不能共享UoW的独立authority | Step 11跨repository原子集合固定 | reject；回Step 7/11前不得选产品 |
| local adapter semantics | 让in-memory/fake省略CAS、unique、cursor、rollback、authoritative read或asymmetry校验 | Step 7 durable/fake parity固定 | implementation gate reject；回Step 7/11 |
| read visibility | 配默认Visible、绕过formal owner、在handler按route跳过resolver或以runtime allowlist替代 | Step 7 resolver-first和33 Query固定 | reject；回Step 7~9/12 |
| Query boundary | 让Query刷新reference/projection、创建truth、修复sidecar、生成capture/event或fallback external body | Step 9 33 Query zero-write | reject；回Step 8/9/11 |
| Inbound Consumer boundary | 让event直写identity/registry/descriptor/seam/relation/exposure或按topic扩展第七种consumer | Step 8六条closed consumer协议 | reject；回Step 8/9 |
| Outbound Event family/routing | 通过配置增删/合并十个event、改schema/routing key/payload/source、按subject选择route或让physical destination进入capture/digest | Step 8十族protocol与Step 13 source/schema/digest identity固定 | reject；family/schema变化回Step 8，identity变化回Step 6/11/13 |
| Operations Job boundary | 让Job修core truth、重扫替代frozen plan、重置journal、由CLI字符串重建typed scope或伪造target success | Step 8/9/11/13 Job contract | reject；回Step 6~13相应owner |
| outbound collaboration | 把external delivery失败回滚local truth、配置本地delivery attempt truth/outbox/relay/DLQ或从current truth重建payload | local snapshot/capture + external Port owner固定 | reject；回Step 6/7/9/11/13 |
| phase boundary | 合并local UoW与不可回滚external call，或让entry直接持有repository/resolver/publisher/handoff | Step 5/7/9 phase与owner固定 | implementation gate reject；回Step 5/7/9 |
| protocol/event/job inventory | 用配置新增/删除/重命名operation、DTO field、event kind、source family、Job kind或Port | Step 8 `83` protocols与Step 7 `36` Ports closed | reject；回Step 7/8/9 |
| codec/digest compatibility | 自由选择serialization、field order、frame/domain、hash algorithm或stored bytes | Step 13 stable v1 + SHA-256 compatibility | reject；新版本需migration设计并回Step 8/11/13 |
| error/retry taxonomy | 配置新业务error、按raw text/status/private code分类、重试permanent/unknown或把unavailable伪装success | Step 12 closed error/failure mapping | reject；回Step 12/13 |
| diagnostics | 输出raw config、endpoint、credential、secret、external body、stack、SQL、transport payload、evidence alias或签署 | Step 12 redaction与Step 15待闭合 | reject；只允许`Off / Redacted` |
| evidence / acceptance | 由配置生成run id、test result、evidence alias、acceptance sign-off或implementation commit | 当前只有设计事实，无真实执行证据 | reject；真实事实由后续执行owner产生 |
| sibling dependency direction | 把`core-contracts`以外 sibling配成Cargo/path/git source dependency | 正式`01`与全局依赖裁剪规则 | implementation gate reject；回Step 3/4/14.5 |

The matrix supersedes old README/`03/05/06` configuration clues. In particular, there is no capability whitelist that changes truth, no “runtime must invoke through Hub” switch, no Provider Contract, KMS/Vault store, quota/cost/router, governance-policy refresh, marketplace registration, local outbox product, or old numeric SLA default in the active schema.

## 17. 配置读取、传递与生命周期矩阵

| 模块 / 文件 | raw source | validated root/ref | resolved constructor args | 运行期允许持有 | 禁止 |
|---|---|---|---|---|---|
| `infra/config.rs` | sole parser/validation owner | constructs and owns `CapabilityRuntimeConfig` | resolves symbolic sections during startup | temporary safe validation issues | public DTO/domain object、raw value log、persistence、hot mutation |
| `infra/runtime_builder.rs` | none | reads root only through crate-private accessors | resolves each selected store/adapter/clock/id/codec and entry-policy section | assembly-local concrete handles until graph completion | raw parser access、partial graph escape、fallback product selection |
| `infra/repositories.rs` / projection/reference/idempotency modules | none | no root/ref retained after construction | one shared persistence authority handle plus module-local typed constructor args | concrete adapter state needed to implement existing Ports | second transaction authority、config lookup during Port call、private truth |
| `infra/source_resolvers.rs` | none | no root/ref retained after construction | exact configured/fake/disabled binding for seven resolver Ports | concrete client/fake/disabled adapter state | generic string dispatch、body import、cross-Port fallback |
| `infra/handoff_adapters.rs` / `publishers.rs` | none | no root/ref retained after construction | exact audit-handoff or collaboration constructor args | concrete Port implementation state | local delivery truth、payload copy、repository access |
| `infra/clock_id.rs` | none | no root/ref retained after construction | selected system/deterministic binding | one authoritative clock and one id generator | DB defaults、entry-generated time/id、deployment fixture |
| `api` entry assembly | none | does not receive the root | `14.2` entry-local typed API parameters plus application facade | facade/handler policy only | repository/resolver/adapter handle、raw config/ref |
| `worker` entry assembly | none | does not receive the root | public worker loop parameters, six already constructed source runners, and application facades | consumer/source runner state and typed header dispatcher | config/ref handle、capture repository/publisher handle、topic-derived protocol、generic string dispatcher |
| `jobs` entry assembly | none | does not receive the root | `14.2` runner typed parameters plus application Job facade | one-shot runner state | journal repository/resolver/handoff handle、CLI scope as business DTO |
| `application` | none | none | existing 36 Ports plus explicitly typed technical parameters fixed in `14.2` | service/facade dependencies only | infra config type/ref、raw endpoint/topic/credential、config-based guard bypass |
| `contracts` / `domain` | none | none | none | none | every config type/ref/adapter kind/policy number |

Validated config refs are consumed during assembly and must not be passed into application Port methods. A concrete adapter may retain the resolved endpoint/credential/transport material required for its own implementation, but it may not retain the whole raw document or read another adapter section at call time. Entry-local typed parameters are copies/views produced by assembly;they are not the `CapabilityRuntimeConfig` root and cannot modify it.

## 18. Step 6 Watchpoint and Cross-step Closure

### 18.1 Infra strong-reopen watchpoint decision

| Step 6 reopen condition | `14.1` result | Decision |
|---|---|---|
| config state becomes public protocol or domain/application object | no;all declarations are `pub(crate)` in `crates/infra/src/config.rs` | no reopen |
| config/availability becomes persisted or recovery authority | no;validated root and issue set are process-lifetime startup material only | no reopen |
| one config carrier must cross an application Port | no;builder injects existing Port implementations and later typed technical parameters | no reopen |
| adapter registry becomes a second truth owner | no;root is immutable assembly input and no runtime mutable registry state is declared | no reopen |
| application/entry needs raw config lookup | no;§17 prohibits it | no reopen |
| read visibility needs independent configurable state | no;derived from local persistence/formal authority and trusted context | no reopen |

The Step 6 infra watchpoint is therefore closed for batch `14.1` without modifying Step 6. The new infra-local declarations do not count toward 43 HLD objects + 7 application helpers, 250 public protocol types, 36 application Ports, 22 repository traits / 110 methods, 83 protocols/flows, or the 24-enum / 111-variant / 638-pair state baseline. A future requirement to persist config/availability, expose it publicly, pass it through an application Port, or make it authoritative for recovery must reopen Step 6 before implementation.

### 18.2 Step 7/11/12/13 closure

| Upstream contract | `14.1` binding result | Status |
|---|---|---|
| Step 7 36 Ports | nine external slots are total;27 local/base Ports derive from one persistence authority plus clock/id/read-visibility assembly;no new application Port | pass for schema owner;exact per-Port constructors remain `14.3/14.4` |
| Step 7 durable/fake parity | `InMemory` and deterministic fixtures cannot weaken typed semantics;deployment forbids them | pass |
| Step 11 UoW/atomicity | one persistence binding only;no per-logical-store split | pass |
| Step 12 startup error owner | validation/construction failure maps only to `InfraError::RuntimeAssembly`;validation issue carriers remain infra-local | pass |
| Step 12 Port failure classes | disabled -> `NotConfigured`;configured call failure preserves six-class mapping and raw-source ban | pass |
| Step 13 compatibility/idempotency | fixed stable-v1/SHA-256 pair, exact key bytes, no TTL/cleanup | pass |
| Step 13 retry | only temporary/timeout remain eligible;no number or attempt policy selected in this batch | pass;binding continues in `14.2` |

`CapabilityRuntimeConfigCandidate` is the parser-owned semantic handoff inside `infra/config.rs`;it is not application-owned and does not enter the 36-Port inventory. `04` must define the concrete structured parser that constructs it. No implementation may export the candidate or use parser-local types to defer or bypass the validated schema decisions in §§14~16.

## 19. Batch `14.1` Historical / Blocker Audit

| Audit item | Result | Basis |
|---|---|---|
| old README provider/runtime/marketplace config | isolated | §16 rejects each old owner/effect;none enters root |
| old formal `03` provider/KMS/cost/outbox config | isolated | no corresponding type/field/variant/callable exists |
| old `05/06` numbers/evidence | isolated | no numeric default, test result, run id, evidence alias or sign-off written |
| L1 reference retention/outbox patterns | isolated | no TTL/cleanup/local delivery lifecycle field;only structural granularity reused |
| `CH-DDD-S14-INFRA-CONFIG-SCHEMA-001` | resolved_in_batch_14_1 | owner, validated root, closed profile, nine external slots, validation/failure and forbidden matrix are exact |
| `CH-DDD-S14-CODEC-HASH-BINDING-001` | remains active for `14.2` | compatibility value is fixed, but concrete Rust crate/API binding intentionally not selected here |
| `CH-DDD-S14-AUTHORITATIVE-READ-001` | remains active for `14.2/14.3` | one persistence authority is fixed;driver/session/confirmation callable remains later scope |
| `CH-DDD-S14-ENTRY-ARGS-001` | remains deferred with `14.2` owner | entry ref slot exists;exact typed blocks/readers and `04` handoff remain later scope |
| upstream blocker | none | no current schema decision requires a new public/domain/application owner or sibling implementation fact |
| non-blocking cross-repo debt | unchanged | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` remains recorded |

The target implementation repository remains absent and is not treated as evidence that any adapter, parser, Cargo dependency, runtime profile, or configuration value exists.

## 20. Batch `14.1` Declaration and Comment Audit

| Declaration group | Count | Rustdoc audit |
|---|---:|---|
| infra-local structs/newtypes | 12 | every struct/newtype and all 42 struct/tuple fields have English `///` |
| infra-local enums | 12 | every enum and all 49 variants have English `///`;all 5 struct-variant payload fields have English `///` |
| callable declarations | 42 | every constructor/accessor/validator/formatter callable has English `///` |
| visibility | all `pub(crate)` or private field | no public protocol/domain/application type added |

The counts above are the historical `14.1` stop-review snapshot. Batch `14.4.2` later performs a controlled extension inside §14.1 by adding two inbound source-ref newtypes；batch `14.4.3` adds one outbound route-ref newtype。Those additions are not retroactively claimed as `14.1` work and are counted separately in §§50.3 and58.2。`CapabilityRuntimeConfigCandidate` is counted as the fully parsed semantic handoff;its concrete raw parser is intentionally left to `04`, which must preserve this field set and provide its own complete Rustdoc audit. The validator exposes only `InfraError`;`CapabilityConfigValidationIssues` remains an internal source carrier and is never a second public or application-facing result. The empty `std::error::Error` implementation adds no callable. No struct, field, enum, variant, variant payload, or callable declared by `14.1` is intentionally undocumented.

## 21. Batch `14.1` Self-check and Stop-review

| Gate | Result | Evidence |
|---|---|---|
| config owner/lifetime | pass | §13 raw/validated/assembled layers and §17 reader matrix |
| exact validated schema | pass | §§14.1~14.6 root, refs, bindings, profile matrix and cardinality |
| nine external Port slots | pass | `CapabilityExternalPortBindings` is 9/9 and total |
| single local authority | pass | one `CapabilityLocalPersistenceBinding`;no per-store split |
| validation/failure surface | pass | §§15.1~15.4 closed safe issues, deterministic validation and lifecycle mapping |
| forbidden configuration | pass | §16 covers truth/state/body/phase/protocol/dependency/evidence red lines |
| Step 6 watchpoint | pass without reopen | §18.1 confirms no public/persisted/cross-Port authority |
| structure/comment gate | pass | §20:12 structs/newtypes,12 enums,42 callables;all declared surfaces documented |
| historical pollution | pass | §19;old README/`03/05/06` and L1-specific mechanisms remain historical |
| blocker/debt | pass | unresolved upstream blocker=`0`;one schema closure resolved,three later items retain exact owner |
| scope discipline | pass | no `14.2` technical binding,per-Port constructor/runtime-builder sequence,Cargo table,formal §13 assembly or `04` schema written |
| formal/implementation discipline | pass | formal `03` unchanged;no `04`,code,implementation ledger,boundary skeleton,commit,run/test/evidence/sign-off created or claimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.1
gate_status = 03_step_14_batch_14_1_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
resolved_closure_item = CH-DDD-S14-INFRA-CONFIG-SCHEMA-001
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_2
```

Batch `14.1` is complete and stops for review. After explicit user confirmation, only batch `14.2` may begin: read this file §§12~21, Step 8 entry schemas, Step 12 retryability, Step 13 codec/digest/authoritative-read/retry contracts, and then define the configuration-reference table and technical binding points. Do not enter local/external per-Port adapter assembly, cross-repo runtime builder closure, formal `03` assembly, or implementation artifacts.

---

## 22. Batch `14.2` 开工输入、缺口诊断与裁决

本批已按门禁重新读取本文 §§12~21、Step 7 `CapabilityUnitOfWorkManager` 与 replay repositories、Step 8 API / Inbound / Job entry schema、Step 12 retryability、Step 13 canonical frame / commit-unknown / Job ordinal 契约，以及 sibling `quantalithos-core` 的 workspace manifests与contracts serde实现。读取只用于确定可落码绑定；sibling实现事实不会被伪装成L0-core正式设计已同步。

| 输入问题 | 读取结论 | `14.2` 裁决 |
|---|---|---|
| application是否需要config object | 业务service需要public page上限、内部scan页大小和bounded recovery policy，但不得依赖`infra` | policy由infra/runtime wrapper持有并注入entry或既有application constructor的primitive/standard typed values；application不接收`CapabilityRuntimeConfig`、config ref或raw key |
| API参数 | Step 8已固定26 Command / 33 Query、HTTP/JSON与page `limit > 0`；framework、body bound、deadline数值未固定 | API entry只持有body byte bound、public page bound和whole-call deadline；route/protocol inventory不可配置 |
| Worker参数 | 六Inbound必须header-first gate；continuation只传exact capture ref；transport binding后移 | Worker entry持有ingress/continuation deadline、bounded fetch size与loop parallelism；consumer name/source/schema映射不可配置 |
| Job参数 | runner提供完整typed `CapabilityJobRequest<T>`与validated run id；journal按ordinal串行 | Jobs entry持有request byte bound、whole-run deadline、planning scan page size和runner-level retry policy；target parallelism固定为`1`，不提供可配置字段 |
| codec/hash | Step 13固定custom canonical frame、stored/outbound byte stability和SHA-256；core workspace已有serde/serde_json但无sha2 manifest项 | canonical request/candidate frame仍手写；stored/outbound v1使用compact serde JSON direct-to-DTO；hash用`sha2 0.10.9` `Sha256` API；不存在algorithm/formatter runtime selector |
| core wire shape | sibling core newtypes当前`#[serde(transparent)]`、actor/metadata当前有explicit serde shape；L0-core正式设计未承诺这些属性 | 登记非阻塞design-sync debt；Hub v1 byte fixtures必须锁定当前shared-field shape；core serde shape改变视为breaking compatibility并回开Step 8/13/14 |
| commit unknown | repository reads无session参数，UoW manager只有`begin/commit/rollback` | 仅写“primary read”不充分；最小回开Step 7/11/12/13，为UoW manager增加按transaction ref的三态commit resolution，并把同一persistence binding全部recovery reads固定为linearizable authority reads |
| retry / timeout | Step 12只允许temporary/timeout自动重试；Step 13禁止unknown / consistency / permanent / invalid typed return自动重试 | retry是caller/entry或adapter invocation wrapper的bounded loop；必须先证明effect boundary，deadline耗尽只返回existing typed error，不证明zero effect |

### 22.1 本批 controlled reopen 范围

`CH-DDD-S14-AUTHORITATIVE-READ-001`暴露的是现有接口可落码缺口，而不是产品选择缺口。仅用一次`None`或“默认读主库”的散文不能证明rollback；但把session参数扩散到22个repository trait又会复制普通read surface且无必要。当前single persistence authority可以提供更小的闭口：transaction status由UoW manager按stable transaction ref解析，所有recovery repository read则固定为同一authority上的linearizable read。因此本批只允许以下最小同步：

1. Step 7让`CapabilityTransactionRef`可安全clone，并新增`CapabilityCommitResolution { Durable, NotDurable, Unknown }`；`CapabilityUnitOfWorkManager`增加`resolve_commit(&CapabilityTransactionRef)`。
2. Existing repository signatures保持不变。`14.3`必须把它们全部绑定到同一local authority；commit-unknown、reserve-loser和rollback recovery所用read禁止replica/eventual/cache/fallback，必须是linearizable authority read。
3. Step 11固定resolution barrier、exact read set和confirmed-not-durable判定；fake实现必须同语义。`Durable`保证随后authority reads至少观察到该atomic commit；`NotDurable`保证该transaction永不变为durable；`Unknown`不提供任何正反证明。
4. Step 12沿用existing transaction/application error，不新增public protocol错误；observation unavailable/timeout仍是typed transaction or Port failure，unresolved status仍是`CommitOutcomeUnknown`。
5. Step 13 commit-unknown伪代码在exact read与`resolve_commit`之间形成closed decision procedure；不改40个key/digest、83 flows、state matrix或replay语义。

该回开不新增trait：application-owned Port总数保持`36`，基础/read-gate仍为`5`，22 repository traits / 110 repository methods保持不变；只把既有UoW manager callable从`3`增为`4`并增加一个application-local supporting enum。若`14.3`具体adapter绑定不能满足linearizable authority read + stable transaction resolution，必须登记产品绑定blocker，不能改用infra私有session、sleep或replica guess。

### 22.2 本批不进入的内容

- 不写27个local/base Port逐项constructor或9 external Port完整adapter装配；留`14.3/14.4`。
- 不写physical endpoint、credential、TLS、topic、consumer group、scheduler、cron、framework、DB driver或deployment product。
- 不写任何timeout、retry count、backoff、jitter、byte/page/batch/parallelism数值；全部交`04`。
- 不新增TTL、cleanup、expiry、attempt store、lease、checkpoint、local DLQ、delivery lifecycle或Job plan parallelism。
- 不修改正式`03`，不创建正式`04`、implementation ledger或planned boundary skeleton。

## 23. Exact Technical Policy and Entry Parameter Schema

### 23.1 Validated numeric wrappers

以下infra-local数值类型归`crates/infra/src/config.rs`。它们只表达已校验的positive/bounded technical value；exact raw unit、key、上限、默认数值和来源优先级由`04`闭合。

```rust
/// Positive runtime duration represented in milliseconds after config parsing.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityRuntimeDuration(
    /// Positive duration value in milliseconds.
    std::num::NonZeroU64,
);

/// Positive byte-size boundary applied before typed protocol decoding.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityByteLimit(
    /// Positive maximum number of accepted bytes.
    std::num::NonZeroUsize,
);

/// Positive page or fetch-size boundary used by one declared read loop.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityBatchLimit(
    /// Positive maximum number of items requested in one bounded read.
    std::num::NonZeroU32,
);

/// Positive maximum count of attempts including the initial attempt.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityAttemptLimit(
    /// Positive total attempt count including the first call.
    std::num::NonZeroU32,
);

/// Positive maximum number of independent entry tasks in flight.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) struct CapabilityParallelismLimit(
    /// Positive independent-task concurrency bound.
    std::num::NonZeroUsize,
);
```

`CapabilityAttemptLimit`不保存“retry count”；`1`表示initial attempt only，retry次数等于`attempts - 1`。该定义避免“配置2到底总共2次还是重试2次”的歧义。`CapabilityParallelismLimit`只适用于彼此独立的entry message、capture或job invocation；它永远不适用于同一Job journal后续ordinal。

### 23.2 Retry and timeout policy blocks

```rust
/// Bounded delay policy between eligible technical retry attempts.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityRetryDelayPolicy {
    /// Delay before the first eligible retry.
    initial_delay: CapabilityRuntimeDuration,
    /// Upper bound applied to every calculated retry delay.
    maximum_delay: CapabilityRuntimeDuration,
    /// Closed multiplier represented as a positive integer ratio numerator.
    multiplier_numerator: std::num::NonZeroU32,
    /// Closed multiplier represented as a positive integer ratio denominator.
    multiplier_denominator: std::num::NonZeroU32,
    /// Maximum deterministic or randomized jitter duration.
    maximum_jitter: CapabilityRuntimeDuration,
}

/// Bounded retry policy for one already classified technical failure surface.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityRetryPolicy {
    /// Total allowed attempts including the initial call.
    attempts: CapabilityAttemptLimit,
    /// Delay calculation applied only before an eligible retry.
    delay: CapabilityRetryDelayPolicy,
}

/// Runtime deadlines grouped by exact lifecycle phase.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityTimeoutPolicy {
    /// Whole synchronous API invocation deadline.
    api_call: CapabilityRuntimeDuration,
    /// Inbound worker invocation deadline after header validation.
    inbound_call: CapabilityRuntimeDuration,
    /// Event-collaboration continuation invocation deadline.
    collaboration_call: CapabilityRuntimeDuration,
    /// Whole operations-job runner deadline.
    job_run: CapabilityRuntimeDuration,
    /// One external resolver, handoff, or collaboration Port-call deadline.
    external_port_call: CapabilityRuntimeDuration,
    /// One local persistence or transaction operation deadline.
    local_store_call: CapabilityRuntimeDuration,
    /// One commit-outcome observation deadline.
    commit_observation: CapabilityRuntimeDuration,
}

/// Validated runtime-only policy shared by assembly and technical wrappers.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityRuntimeTechnicalPolicy {
    /// Phase-specific runtime deadline policy.
    timeouts: CapabilityTimeoutPolicy,
    /// Bounded policy for eligible external Port call retries.
    external_retry: CapabilityRetryPolicy,
    /// Bounded policy for eligible local contention retries.
    contention_retry: CapabilityRetryPolicy,
    /// Bounded policy for commit-outcome observation attempts.
    commit_observation_retry: CapabilityRetryPolicy,
    /// Internal repository page size used by collect-before-mutate scans.
    internal_scan_page_limit: CapabilityBatchLimit,
}
```

The retry multiplier is an exact positive rational,not a floating-point value。`maximum_jitter` may be nonzero,但jitter implementation必须由runtime wrapper注入可测试randomness或deterministic fixture；jitter值不进入business digest、journal、stored result或public issue。Delay calculation必须saturate at`maximum_delay`并在whole phase deadline内裁剪，绝不能overflow、panic或延长whole-operation deadline。

### 23.3 Entry-local typed parameter blocks

API / worker / jobs数值参数由`infra::runtime_builder`从validated root复制到entry crate。三个`*EntryParameters`是public Rust assembly values但不是public network protocol、domain object或persisted config；字段private且只通过Rustdoc-complete accessor读取，也不得实现`Serialize / Deserialize`或保留config ref。Batch `14.4.2`增加的`CapabilityInboundSourceBinding`、`CapabilityInboundSourceBindings`和`CapabilityWorkerEntryBinding`仍是`pub(crate)` infra-local validated assembly values：它们可以在builder消费前持有feed/actor/fixture config ref，但所有ref必须在worker entry暴露前被解析并丢弃。

```rust
/// Validated API-entry parameters independent of any server framework.
#[derive(Clone, Eq, PartialEq)]
pub struct CapabilityApiEntryParameters {
    /// Maximum encoded request bytes accepted before typed decoding.
    request_body_limit: CapabilityByteLimit,
    /// Maximum caller-supplied page limit accepted by Query mapping.
    public_page_limit: CapabilityBatchLimit,
    /// Whole synchronous invocation deadline.
    call_timeout: CapabilityRuntimeDuration,
}

/// Validated worker-entry parameters independent of any broker product.
#[derive(Clone, Eq, PartialEq)]
pub struct CapabilityWorkerEntryParameters {
    /// Maximum encoded inbound event bytes accepted before payload decoding.
    inbound_body_limit: CapabilityByteLimit,
    /// Maximum deliveries one named source completes before one cooperative scheduler yield.
    fetch_batch_limit: CapabilityBatchLimit,
    /// Maximum concurrent application/completion or exact-ref continuation invocations.
    parallelism: CapabilityParallelismLimit,
    /// Deadline for one supported inbound consumer invocation.
    inbound_call_timeout: CapabilityRuntimeDuration,
    /// Deadline for one exact capture-ref collaboration continuation.
    collaboration_call_timeout: CapabilityRuntimeDuration,
}

/// Infra-local runtime binding for one closed inbound consumer source.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityInboundSourceBinding {
    /// Configured physical feed plus its independently resolved trusted-actor authority.
    Configured {
        /// Symbolic reference to the exact physical inbound-feed section.
        feed_ref: CapabilityInboundFeedConfigRef,
        /// Symbolic reference to the exact trusted-actor matching section.
        trusted_actor_ref: CapabilityTrustedActorConfigRef,
    },
    /// Deterministic encoded-envelope fixture used only by local or integration profiles.
    DeterministicFake {
        /// Symbolic reference to the exact typed source fixture section.
        fixture_ref: CapabilityFixtureConfigRef,
    },
    /// Explicitly omits this consumer source from the assembled worker graph.
    Disabled,
}

/// Complete named source-binding set for the six closed inbound consumers.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityInboundSourceBindings {
    /// Source binding for governance-result reference changes.
    governance_result_reference_changed: CapabilityInboundSourceBinding,
    /// Source binding for method-asset reference changes.
    method_asset_reference_changed: CapabilityInboundSourceBinding,
    /// Source binding for downstream consumption-impact reports.
    downstream_consumption_impact_reported: CapabilityInboundSourceBinding,
    /// Source binding for external capability-source reference changes.
    external_capability_source_reference_changed: CapabilityInboundSourceBinding,
    /// Source binding for audit-material reference changes.
    audit_material_reference_changed: CapabilityInboundSourceBinding,
    /// Source binding for external-document reference changes.
    external_document_reference_changed: CapabilityInboundSourceBinding,
}

/// Validated Worker-entry parameters and six closed inbound-source bindings.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityWorkerEntryBinding {
    /// Validated broker-neutral Worker loop and deadline parameters.
    parameters: CapabilityWorkerEntryParameters,
    /// Complete source-binding decisions for the six supported consumers.
    inbound_sources: CapabilityInboundSourceBindings,
}

/// Validated one-shot jobs-entry parameters independent of any scheduler product.
#[derive(Clone, Eq, PartialEq)]
pub struct CapabilityJobsEntryParameters {
    /// Maximum encoded job-request bytes accepted before typed decoding.
    request_body_limit: CapabilityByteLimit,
    /// Internal planning scan page size supplied to application job services.
    planning_page_limit: CapabilityBatchLimit,
    /// Whole one-shot runner deadline.
    run_timeout: CapabilityRuntimeDuration,
    /// Bounded retry policy for an unfinalized technical return proven safe to reenter.
    runner_retry: CapabilityRetryPolicy,
}

/// Closed entry-local assembly union matching the selected process entry.
#[derive(Clone, Eq, PartialEq)]
pub(crate) enum CapabilityEntryParameters {
    /// Parameters for the synchronous API entry.
    Api(
        /// Validated API-entry parameters.
        CapabilityApiEntryParameters,
    ),
    /// Parameters and source bindings for the inbound and continuation worker entry.
    Worker(
        /// Validated Worker-entry assembly binding.
        CapabilityWorkerEntryBinding,
    ),
    /// Parameters for the one-shot operations-job entry.
    Jobs(
        /// Validated jobs-entry parameters.
        CapabilityJobsEntryParameters,
    ),
}
```

There is deliberately no `target_parallelism` field in `CapabilityJobsEntryParameters`。One process may run independent job invocations according todeployment ownership,但within one accepted request the application always calls`next_planned_target()`and processes exactly one earliest Planned ordinal at a time。Likewise，worker `parallelism` must partition independent envelopes/captures before dispatch；it cannot process two phases of one capture or two attempts sharing one current UoW concurrently。

### 23.4 Constructors and accessors

```rust
impl CapabilityRuntimeDuration {
    /// Constructs one positive millisecond duration after raw-unit conversion.
    pub(crate) fn from_millis(value: std::num::NonZeroU64) -> Self;

    /// Returns this duration as a standard library duration.
    pub(crate) fn as_duration(&self) -> std::time::Duration;
}

impl CapabilityByteLimit {
    /// Constructs one positive byte-size boundary.
    pub(crate) fn new(value: std::num::NonZeroUsize) -> Self;

    /// Returns the accepted byte boundary.
    pub(crate) fn get(&self) -> usize;
}

impl CapabilityBatchLimit {
    /// Constructs one positive item-count boundary.
    pub(crate) fn new(value: std::num::NonZeroU32) -> Self;

    /// Returns the bounded item count.
    pub(crate) fn get(&self) -> u32;
}

impl CapabilityAttemptLimit {
    /// Constructs one positive total attempt count.
    pub(crate) fn new(value: std::num::NonZeroU32) -> Self;

    /// Returns the total attempt count including the initial call.
    pub(crate) fn get(&self) -> u32;
}

impl CapabilityParallelismLimit {
    /// Constructs one positive independent-task parallelism boundary.
    pub(crate) fn new(value: std::num::NonZeroUsize) -> Self;

    /// Returns the independent-task parallelism boundary.
    pub(crate) fn get(&self) -> usize;
}

impl CapabilityRuntimeTechnicalPolicy {
    /// Returns the phase-specific timeout policy.
    pub(crate) fn timeouts(&self) -> &CapabilityTimeoutPolicy;

    /// Returns the eligible external-call retry policy.
    pub(crate) fn external_retry(&self) -> &CapabilityRetryPolicy;

    /// Returns the eligible local-contention retry policy.
    pub(crate) fn contention_retry(&self) -> &CapabilityRetryPolicy;

    /// Returns the commit-observation retry policy.
    pub(crate) fn commit_observation_retry(&self) -> &CapabilityRetryPolicy;

    /// Returns the internal repository scan page limit.
    pub(crate) fn internal_scan_page_limit(&self) -> u32;
}

impl CapabilityApiEntryParameters {
    /// Returns the maximum encoded request body size.
    pub fn request_body_limit(&self) -> usize;

    /// Returns the maximum accepted public Query page limit.
    pub fn public_page_limit(&self) -> u32;

    /// Returns the whole synchronous invocation deadline.
    pub fn call_timeout(&self) -> std::time::Duration;
}

impl CapabilityWorkerEntryParameters {
    /// Returns the maximum encoded inbound event size.
    pub fn inbound_body_limit(&self) -> usize;

    /// Returns the per-source completion count before a cooperative scheduler yield.
    pub fn fetch_batch_limit(&self) -> u32;

    /// Returns the global application/completion and continuation concurrency limit.
    pub fn parallelism(&self) -> usize;

    /// Returns the supported inbound invocation deadline.
    pub fn inbound_call_timeout(&self) -> std::time::Duration;

    /// Returns the exact capture-ref continuation deadline.
    pub fn collaboration_call_timeout(&self) -> std::time::Duration;
}

impl CapabilityInboundSourceBinding {
    /// Constructs one configured source after exact feed and trusted-actor section resolution.
    pub(crate) fn configured(
        feed_ref: CapabilityInboundFeedConfigRef,
        trusted_actor_ref: CapabilityTrustedActorConfigRef,
    ) -> Self;

    /// Constructs one deterministic source after exact typed fixture-section resolution.
    pub(crate) fn deterministic_fake(fixture_ref: CapabilityFixtureConfigRef) -> Self;

    /// Constructs one explicitly disabled source binding.
    pub(crate) fn disabled() -> Self;

    /// Returns configured feed and trusted-actor references only for a configured source.
    pub(crate) fn configured_refs(
        &self,
    ) -> Option<(&CapabilityInboundFeedConfigRef, &CapabilityTrustedActorConfigRef)>;

    /// Returns the typed fixture reference only for a deterministic fake source.
    pub(crate) fn deterministic_fixture_ref(&self) -> Option<&CapabilityFixtureConfigRef>;

    /// Returns whether this source is explicitly omitted from the assembled worker graph.
    pub(crate) fn is_disabled(&self) -> bool;
}

impl CapabilityInboundSourceBindings {
    /// Returns the governance-result reference-change source binding.
    pub(crate) fn governance_result_reference_changed(
        &self,
    ) -> &CapabilityInboundSourceBinding;

    /// Returns the method-asset reference-change source binding.
    pub(crate) fn method_asset_reference_changed(&self) -> &CapabilityInboundSourceBinding;

    /// Returns the downstream consumption-impact source binding.
    pub(crate) fn downstream_consumption_impact_reported(
        &self,
    ) -> &CapabilityInboundSourceBinding;

    /// Returns the external capability-source reference-change source binding.
    pub(crate) fn external_capability_source_reference_changed(
        &self,
    ) -> &CapabilityInboundSourceBinding;

    /// Returns the audit-material reference-change source binding.
    pub(crate) fn audit_material_reference_changed(&self) -> &CapabilityInboundSourceBinding;

    /// Returns the external-document reference-change source binding.
    pub(crate) fn external_document_reference_changed(&self) -> &CapabilityInboundSourceBinding;
}

impl CapabilityWorkerEntryBinding {
    /// Returns the validated Worker loop and deadline parameters.
    pub(crate) fn parameters(&self) -> &CapabilityWorkerEntryParameters;

    /// Returns all six closed inbound-source binding decisions.
    pub(crate) fn inbound_sources(&self) -> &CapabilityInboundSourceBindings;
}

impl CapabilityJobsEntryParameters {
    /// Returns the maximum encoded job request size.
    pub fn request_body_limit(&self) -> usize;

    /// Returns the planning scan page limit.
    pub fn planning_page_limit(&self) -> u32;

    /// Returns the whole one-shot job runner deadline.
    pub fn run_timeout(&self) -> std::time::Duration;

    /// Returns the bounded runner retry policy.
    pub(crate) fn runner_retry(&self) -> &CapabilityRetryPolicy;
}
```

`CapabilityRetryPolicy` stays crate-visible because API/worker/jobs must not inspect attempts/delay and implement independent loops from raw values。Runtime builder binds each approved policy to its owning application or infrastructure wrapper before handoff；entry crates receive only the public scalar accessors that they are authorized to consume。For Jobs，`runner_retry` is consumed by the application-owned safe-reentry controller，while the Jobs-owned runtime consumes only `request_body_limit` and `run_timeout`。`14.5` closes the complete constructor graph。

---

## 24. 配置引用明细表

本节满足详细设计书写规范 §5.13 的配置引用表要求。表中的“默认口径”是设计级 presence / compatibility 规则，不是伪造数值；具体 raw key、source precedence、单位、上下限和数值默认值全部由正式 `04-配置设计.md` 闭合。`required` 表示 raw 配置必须显式或由 `04` 声明的 deterministic parser default 形成，不能由 runtime builder 临时猜值。

| 配置项 / validated field | 类型 | 读取模块 | 默认口径 | 详细配置文档位置 | 固定不变量 |
|---|---|---|---|---|---|
| schema version | `CapabilityConfigSchemaVersion` | `infra/config.rs` | required；v1 only | `04` runtime root / schema | unknown / zero / future version startup reject |
| runtime profile | `CapabilityRuntimeProfileKind` | `infra/config.rs`、`runtime_builder.rs` | required；无隐式 deployment | `04` profile matrix | profile只能约束binding kind，不能改protocol/state/truth |
| process entry | `CapabilityRuntimeEntryKind` | `infra/config.rs`、`runtime_builder.rs` | required；exactly one of API / Worker / Jobs | `04` binary / entry matrix | 一个validated root只装配一个entry |
| local persistence | `CapabilityLocalPersistenceBinding` | `runtime_builder.rs`、local adapter modules | required；single authority | `04` local persistence section | 22 repositories、UoW、commit resolution共享同一authority |
| external Port slots | `CapabilityExternalPortBindings` | `runtime_builder.rs` | all nine required；absence仅用explicit `Disabled` | `04` external adapter sections | slot family不互换；Deployment禁止fake |
| clock / id generator | `CapabilityClockBinding` / `CapabilityIdGeneratorBinding` | `infra/clock_id.rs`、`runtime_builder.rs` | required and separate | `04` clock / id sections | entry/domain不得生成替代time/id |
| protocol / digest profile | `CapabilityCompatibilityBinding` | codec/digest assembly | fixed `StableSurfaceV1 + Sha256V1` | `04` compatibility section | 不作为feature selector；变化需version/migration |
| API request bytes | `CapabilityApiEntryParameters.request_body_limit` | API request boundary before JSON decode | positive required numeric；无本Step数值 | `04` API entry section | 超限在typed decode/application前失败；不保存body |
| public Query page limit | `CapabilityApiEntryParameters.public_page_limit` | API Query mapper | positive required numeric | `04` API entry section | caller `limit=0`或超过上限reject，不静默截断 |
| API whole-call timeout | `CapabilityApiEntryParameters.call_timeout` | API invocation wrapper | positive required duration | `04` timeout / API section | deadline不改变application error/replay语义 |
| worker inbound bytes | `CapabilityWorkerEntryParameters.inbound_body_limit` | worker ingress before header decode | positive required numeric | `04` worker entry section | 超限零payload decode、零reserve、零UoW |
| worker fetch batch | `CapabilityWorkerEntryParameters.fetch_batch_limit` | each named source task outer scheduling loop | positive required numeric | `04` worker entry section | 每个enabled source完成该数量delivery后cooperative yield一次；不扫描或批量获取capture ref |
| worker parallelism | `CapabilityWorkerEntryParameters.parallelism` | one global Worker dispatch/application/completion semaphore | positive required numeric | `04` worker entry section | 约束六source已取得delivery后的处理与显式exact-ref continuation；source long-poll不占permit，同一delivery/capture phase/UoW不并发 |
| worker inbound / continuation timeout | two `CapabilityRuntimeDuration` fields | worker facade wrappers | positive required durations | `04` worker / timeout sections | header gate先于inbound deadline body；continuation只传capture ref |
| worker inbound source bindings | `CapabilityWorkerEntryBinding.inbound_sources` | `infra/config.rs` validation and `runtime_builder.rs` source construction | required only for `Worker`; exactly six named slots; each is `Configured`, `DeterministicFake`, or `Disabled` | `04` worker source sections | builder consumes all refs before worker exposure; logical consumer/source/schema mapping remains closed |
| configured worker feed refs | `CapabilityInboundFeedConfigRef` per configured source slot | `infra/config.rs` exact section resolution and `runtime_builder.rs` feed construction | required only for a `Configured` slot;no implicit/shared fallback | `04` worker feed sections | ref names transport material but cannot define consumer/source/schema/event identity |
| configured worker trusted actor refs | `CapabilityTrustedActorConfigRef` per configured source slot | `infra/config.rs` exact section resolution and `runtime_builder.rs` actor-matcher construction | required only for a `Configured` slot;resolved independently from feed ref | `04` trusted inbound actor sections | topic/feed/credential name cannot replace actor/family/source-kind authorization |
| configured outbound route refs | `CapabilityOutboundRouteConfigRef` in the configured access-event-collaboration adapter section | `infra/config.rs` exact section resolution and `infra/publishers.rs` adapter construction | all ten named routes required when the collaboration slot is `Configured`;no implicit wildcard/default route | `04` outbound route sections | route ref binds transport only;event name/schema/routing key/payload/source/digest stay fixed by Steps 8/13 |
| jobs request bytes | `CapabilityJobsEntryParameters.request_body_limit` | jobs request boundary before typed decode | positive required numeric | `04` jobs entry section | job name/schema/type mismatch在application前reject |
| jobs planning page | `CapabilityJobsEntryParameters.planning_page_limit` | jobs facade to application planning input | positive required numeric | `04` jobs entry section | collect-before-mutate；不成为public cursor/default scope |
| jobs whole-run timeout | `CapabilityJobsEntryParameters.run_timeout` | Jobs-owned Tokio one-shot runtime | positive required duration | `04` jobs / timeout sections | deadline不terminalize unknown target，不重建journal |
| jobs runner retry | `CapabilityJobsEntryParameters.runner_retry` | application-owned Job safe-reentry controller，bound by infra Stage 5 | required bounded policy | `04` jobs / retry sections | 仅由application基于journal / UoW durable authority消费；entry自动retry授权为零；typed `Retryable`已是本run终态；同journal target串行 |
| external call retry | `CapabilityRuntimeTechnicalPolicy.external_retry` | typed external Port invocation wrapper | required bounded policy | `04` retry policy section | 只允许temporary/timeout且effect boundary已证明 |
| contention retry | `CapabilityRuntimeTechnicalPolicy.contention_retry` | application invocation wrapper around fresh attempt | required bounded policy | `04` retry policy section | rollback成功 + exact owner reload；不得stale-token loop |
| commit observation | timeout + retry policy | UoW recovery wrapper | required bounded policy | `04` commit observation section | 只重复`resolve_commit`/authority reads，不重复mutation |
| internal scan page | `CapabilityRuntimeTechnicalPolicy.internal_scan_page_limit` | application facade constructor / scan wrapper | positive required numeric | `04` internal read section | stable pagination + collect-before-mutate；不暴露为Query default |
| diagnostics | `CapabilityDiagnosticMode` | infra / entry error wrapper | required `Off` or `Redacted` | `04` diagnostics section | 无raw/full/verbose，exact telemetry留Step 15 |

### 24.1 Validated root accessors补齐

Batch `14.1` 的 root 已新增 `technical_policy` 与 `entry_parameters` 字段；本批补齐它们的读取面，避免 runtime builder 直接访问 private field或重新解析ref。

```rust
impl CapabilityRuntimeConfig {
    /// Returns the validated runtime-only technical policy.
    pub(crate) fn technical_policy(&self) -> &CapabilityRuntimeTechnicalPolicy;

    /// Returns the validated parameters for the selected process entry.
    pub(crate) fn entry_parameters(&self) -> &CapabilityEntryParameters;
}

impl CapabilityEntryParameters {
    /// Returns API parameters only when the selected entry is API.
    pub(crate) fn as_api(&self) -> Option<&CapabilityApiEntryParameters>;

    /// Returns the Worker assembly binding only when the selected entry is Worker.
    pub(crate) fn as_worker(&self) -> Option<&CapabilityWorkerEntryBinding>;

    /// Returns jobs parameters only when the selected entry is jobs.
    pub(crate) fn as_jobs(&self) -> Option<&CapabilityJobsEntryParameters>;
}
```

`try_from_candidate`必须验证 `entry` 与 `CapabilityEntryParameters` variant exact match；mismatch形成 `ReferencedSectionKindMismatch` on `RuntimeEntry`，不得在 `as_*` 返回 `None` 后由 builder fallback 到其它entry。`04`必须把该 cross-field gate写成exact validation case。

## 25. Deterministic Codec and SHA-256 Binding

### 25.1 Cargo dependency与owner落点

目标仓当前不存在，因此下表是实施时必须写入目标 workspace 的设计绑定，不是声称 Cargo 已存在。版本与 API 取 sibling core 当前 workspace baseline及Step 13算法要求；`14.5`仍需把 member-by-member dependency matrix与完整builder顺序收口。

| crate | exact binding | 使用 crate / module | 用途 | 禁止用途 |
|---|---|---|---|---|
| `serde` | `1.0.228`, feature `derive` | `contracts`；`worker` / `jobs`仅用于已固定的borrowed header-first carrier | exact public DTO / enum / newtype v1 serialization；entry-local header解析 | canonical request/reference digest、generic map/value digest |
| `serde_json` | `1.0.145`, feature `raw_value` | `contracts`拥有stable typed codec；`worker` / `jobs`仅借用`RawValue`做有界header-first gate；API只调用contracts-owned codec function | compact direct typed JSON；header-first raw payload hold | `Value` tree、map iteration、pretty formatter、untyped generic decoder、entry自建第二套typed wire codec |
| `sha2` | `0.10.9` | `application` | Step 13 four digest domains through `Sha256` | runtime algorithm selector、password/secret hashing、adapter-private digest |
| `thiserror` | `2.0.17` | existing error-owning crates as required | nonpublic source chaining / existing wrapper implementation | error-text classification、public raw source exposure |

Workspace root design binding:

```toml
[workspace.dependencies]
serde = { version = "1.0.228", features = ["derive"] }
serde_json = { version = "1.0.145", features = ["raw_value"] }
sha2 = "0.10.9"
thiserror = "2.0.17"
```

`core-contracts` remains the only sibling path dependency;crates.io libraries in this table are not sibling repository dependencies. Version update of `serde` / `serde_json` / `sha2` requires compatibility fixtures before adoption, but does not permit the protocol profile to select a new wire format or hash algorithm.

### 25.2 Exact serializer / deserializer contract

The stable codec owner is `capability-hub-contracts`;the implementation may add `crates/contracts/src/codec.rs` and export exact DTO-specific functions from `lib.rs`. Every Step 8 public DTO / nested enum / newtype participating in API, stored surface, inbound envelope, outbound envelope, receipt or Job response implements explicit `Serialize / Deserialize` with stable field and variant names. Exact functions call `serde_json::to_vec(&typed_value)` and `serde_json::from_slice::<ExactType>(bytes)` directly.

Rules:

1. Serialization is compact UTF-8 JSON with no whitespace formatter, no pretty mode, no custom map, no locale and no floating-point technical field.
2. Struct declaration order is the emitted field order for v1;all Hub-owned v1 structs reject unknown fields on decode. Enum variant wire names/tags are explicit attributes or hand-written implementations, never inferred from future Rust rename/refactor.
3. `serde_json::Value`, `Map`, `HashMap`, generic `fn encode<T: Serialize>`, generic digest over `Serialize`, reserialization of stored bytes and adapter-owned codec choices are forbidden.
4. Stored result / outbound bytes are serialized once, rejected if empty or over the correct bound, hashed, then persisted unchanged. Reads hash the stored bytes before exact typed-envelope symmetry validation;they do not replace bytes with current serialization.
5. Canonical request/reference candidate field bytes continue to use the Step 13 versioned length-delimited grammar and contracts-owned private `CanonicalFieldWriter`. They never use JSON or serde field order.

The current sibling `core-contracts` implementation uses `#[serde(transparent)]` for string/numeric newtypes and explicit serde shapes for actor/metadata carriers, but L0-core formal design does not state that this is a stable wire promise. `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` therefore remains non-blocking:Hub contract fixtures must lock every shared nested field shape used by v1;any upstream shape change is a compatibility change that reopens Step 8/13/14. This document does not claim L0-core design or implementation has been changed.

### 25.3 Exact SHA-256 API

Application digest code uses the concrete API below for every Step 13 domain. The hash input is the already complete canonical frame or exact immutable serialized bytes;it is never a raw DTO or generic serializer input.

```rust
use sha2::{Digest, Sha256};

/// Calculates one complete SHA-256 output without text conversion.
fn sha256_bytes(input: &[u8]) -> [u8; 32] {
    let output = Sha256::digest(input);
    let mut bytes = [0_u8; 32];
    bytes.copy_from_slice(&output);
    bytes
}
```

The private helper lives in `crates/application/src/idempotency.rs` or one private digest module owned by application. It is called only by the five Step 13 digest functions;reference-candidate functions pass their completed canonical frame through the same helper. Lowercase 64-character hex is boundary serialization for a carrier, never input to hashing or a constructor. No hash object, algorithm name or formatter is injected through config.

## 26. Header-first Inbound Decode Binding

### 26.1 Bounded header carrier

Worker ingress must inspect the closed header before decoding the concrete payload. The codec uses `serde_json::value::RawValue` to retain the payload's exact raw JSON slice inside the already byte-bounded envelope. This does not authorize storing, logging, hashing for telemetry, or forwarding raw payload bytes.

```rust
/// Inbound envelope header decoded before the concrete payload schema is selected.
#[derive(serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CapabilityInboundHeaderFirstEnvelope<'a> {
    /// Trusted source actor context supplied by the configured worker boundary.
    source_actor_context: ActorContext,
    /// Closed inbound consumer selected by the logical worker binding.
    consumer_name: CapabilityInboundConsumerName,
    /// Closed upstream source family bound to the consumer.
    source_family: CapabilityInboundSourceFamily,
    /// Stable body-free upstream event identity.
    source_event_ref: CapabilitySourceEventRef,
    /// Declared concrete payload schema version.
    schema_version: CapabilityProtocolSchemaVersion,
    /// Source-provided idempotency key used by digest consistency validation.
    idempotency_key: IdempotencyKey,
    /// Distributed trace propagated from the source boundary.
    trace_id: TraceId,
    /// Upstream occurrence time without local mutation authority.
    occurred_at: Timestamp,
    /// Exact undecoded payload JSON retained only for this ingress invocation.
    #[serde(borrow)]
    payload: &'a serde_json::value::RawValue,
}
```

This struct is worker/codec-local, not a public protocol type or application helper. Its fields mirror the existing public `CapabilityInboundEventEnvelope<T>` exactly and remain private;every struct and field has English Rustdoc. A separate duplicate header struct, `Value`, generic map, or payload copy is forbidden.

### 26.2 Decode order and exact dispatch

```text
1. Reject transport bytes whose length exceeds inbound_body_limit;do not parse.
2. Parse CapabilityInboundHeaderFirstEnvelope borrowing payload RawValue.
3. Validate consumer_name is one of six exact names and source_family is its exact family.
4. Validate trusted actor binding, source_event_ref, idempotency key, trace and occurred_at.
5. If schema_version is not exactly v1, form the existing UnsupportedSchema receipt
   from validated header values;do not deserialize payload, reserve, call a Port or open UoW.
6. Dispatch the exact (consumer_name, source_family, schema_version) arm.
7. Deserialize RawValue::get().as_bytes() directly into that arm's exact payload DTO.
8. Run the existing forbidden-body and typed-ref validation, canonical field encoder,
   operation-context construction and application consumer facade.
9. Drop the header and RawValue before acknowledgement mapping;never persist/log raw payload.
```

Malformed header or malformed payload maps through existing `WorkerError::Source` / closed issue mapping from Step 12. Unknown consumer/source combinations never reach a generic payload decoder. Physical topic, consumer group, broker metadata or retry count cannot replace any header field or select a seventh protocol;their actual transport binding remains `14.4` / `04` scope.

API and jobs also enforce byte limits before exact typed JSON decoding. Jobs validate job name + schema version + concrete body type before application invocation. API validates route + command/query name + schema before dispatch. They may reuse contracts-owned exact codec helpers, but they do not use the inbound header-first carrier.

## 27. Authoritative Commit Resolution and Read Binding

### 27.1 Exact resolution procedure

Batch `14.2` has minimally synchronized Step 7, Step 11, Step 12 and Step 13. Application copies `uow.transaction_ref().clone()` before consuming the UoW in `commit`. If commit returns unknown, only the following decision procedure is legal:

| phase | authority call / read | allowed conclusion | next action |
|---|---|---|---|
| pre-observation | no new UoW/effect | durability unknown | enter bounded observation using original transaction ref |
| resolution `Durable` | same-authority linearizable exact read set after barrier | original atomic set is visible | validate idempotency/result/receipt/report/journal/capture/business symmetry;replay/continue only exact durable state |
| resolution `NotDurable` | same-authority winner/current-owner exact reads | original transaction can never commit | preserve any concurrent winner;only unchanged/absent non-winning set permits new attempt |
| resolution `Unknown` | no positive/negative proof | still `CommitOutcomeUnknown` | repeat only within observation attempts + deadline |
| resolution call error/timeout | no durability proof | still `CommitOutcomeUnknown` | retain nonpublic source,apply remaining observation budget,then return existing error |
| budget exhausted | no proof | `ApplicationError::CommitOutcomeUnknown` | no mutation retry,rollback/success claim or new key |

The first authority read may already expose a symmetric Completed/journal/capture winner and avoid unnecessary status polling, but a `None` or unchanged row never proves rollback by itself. For the original transaction, `NotDurable` can only come from `resolve_commit`. For a later process retry that no longer owns the original transaction ref, application cannot manufacture a status proof;it uses the same authority's atomic `reserve_if_absent` / unique serialization to select a winner, then classifies the returned exact record. One preflight `None` never authorizes an unprotected mutation.

### 27.2 Authority owner matrix

| recovery scenario | exact authority read set | serialization / barrier rule | forbidden fallback |
|---|---|---|---|
| Command / Inbound unknown | normalized reservation + shell/surface + exact typed response/receipt + declared business/sidecars | `Durable` barrier or atomic reserve winner | replica/cache/read model/current-truth rebuild |
| Job initial unknown | reservation + journal by same normalized key | `NotDurable` plus both absent,or matching Reserved + Planned journal | scope rescan/replan,run-id finder |
| Job target unknown | journal ordinal + exact declared effect owners/capture | terminal symmetric outcome,or `NotDurable` + all owners unchanged | infer from external return or request-local object |
| Job final unknown | reservation + typed report/surface + journal | Completed + Finalized exact ref,or `NotDurable` + no result + all-terminal journal | rerun targets,generic decoder,report-by-run |
| Outbound bind unknown | capture + immutable snapshot + bound intent symmetry | durable barrier for local bind;external stable intent remains external authority | second capture/intent,current source remap |
| reserve loser / unique loser | exact returned winner then same-authority owner load as declared | atomic `reserve_if_absent`,unique constraint or CAS | recursive entry call,sleep then blind insert |

`14.3` must bind all 27 local/base Ports to one concrete authority that can actually satisfy this matrix. If a proposed product or fake cannot provide stable transaction resolution plus linearizable reads and cross-repository atomicity, that product binding is blocked;implementation may not weaken the table or add an infra-private session API.

## 28. Timeout, Retry, Batch and Parallelism Ownership

### 28.1 Policy consumption matrix

| policy | owner / wrapper | eligible input | attempt identity | stop condition | forbidden behavior |
|---|---|---|---|---|---|
| external Port timeout | infra typed invocation wrapper | one declared external Port call | same typed input and stable external identity | call deadline or whole phase deadline | raw text classification、changing candidate/ref |
| external retry | same wrapper | only `TemporarilyUnavailable` / `Timeout` after effect-boundary proof | same typed input;stable intent semantics where declared | attempts,maximum delay,whole phase deadline | permanent/invalid/unexpected/commit unknown retry |
| contention retry | application invocation wrapper | confirmed rollback + optimistic/unique loser with exact owner reload | new UoW,discarded generated ids,original request key/digest | attempts or whole entry deadline | stale expected version,recursive reserve,hidden loop |
| commit observation | UoW recovery wrapper | only original commit outcome unknown | same `CapabilityTransactionRef`;no mutation | observation attempts/deadline | treating timeout/None as NotDurable |
| jobs runner retry | application-owned Job safe-reentry controller，constructed in infra Stage 5 | no typed response was formed, and the application flow plus durable recovery procedure proves the exact invocation safe to reenter | same typed service invocation identity、journal、run and key already owned by application | application attempts / whole service deadline | entry replay of encoded bytes、retrying a typed `Retryable` response、plain-error classification、new run/key、scope reparse、target parallelism |
| API page bound | API mapper | caller positive page request | current Query request | reject over-bound | silent clamp、repository-specific default |
| internal scan page | application scan wrapper | declared stable collect-before-mutate scan | same frozen scope/cursor chain | end cursor or whole phase deadline | page-by-page mutation where full candidate set required |
| worker fetch/parallelism | worker outer loop | independent messages/capture refs | one semaphore permit per independent item | fetch bound/permit/deadline | concurrent phases of same capture/UoW |
| Job target sequencing | application journal loop | next exact Planned ordinal | one target at a time | no Planned target | configurable target parallelism、ordinal skip |

### 28.2 Retry classifier and delay rules

Retry classification occurs after exact typed error formation and before sleeping. `ApplicationPortFailureKind::{TemporarilyUnavailable, Timeout}` are merely eligible;the wrapper must still prove that no undeclared local/external effect can be duplicated. `OptimisticConflict` is eligible only after rollback success and exact current-owner reload. `CommitOutcomeUnknown`, `ConsistencyDefect`, `CodecFailure`, `TransactionRollbackFailed`, `NotConfigured`, `PermanentlyRejected`, `InvalidTypedResponse` and `UnexpectedSourceFailure` are never transformed into automatic mutation retries.

Delay uses the exact positive rational multiplier from §23.2, saturates at `maximum_delay`, adds bounded jitter from an injected testable source, and clips to the remaining whole-phase deadline. An attempt that cannot start and finish within the remaining deadline is not launched. No delay/attempt/jitter value enters a request digest, event digest, journal, stored result, issue ref, business state or evidence alias.

## 29. `04-配置设计.md` Exact Handoff

Formal `04-配置设计.md` does not exist yet and must be created only after formal `03` is completed and the user confirms entry into document `04`. The following table is an exact handoff, not permission to create that document during this batch.

| `04` section obligation | must define | must preserve from Step 14 | may not invent |
|---|---|---|---|
| structured raw schema | strict format,top-level sections,unknown/duplicate handling,version | candidate/root exact fields and all nine slots | new owner/state/protocol/Port |
| source precedence | file/env/CLI/profile merge and conflict rejection | one immutable root and deterministic result | runtime hot reload,last-known-good silent fallback |
| symbolic ref registry | exact key grammar,length bound,section family resolution | safe ref types and wrong-family rejection | URL/topic/credential inside symbolic ref |
| numeric schema | units,minimum/maximum,overflow handling,explicit defaults for every wrapper field | positive wrapper semantics and attempt-includes-initial | zero/unbounded/negative or hidden code defaults |
| profile matrix | Local/Integration/Deployment exact allowed bindings | §14.6,Deployment durable/non-fake rules | profile-specific business semantics |
| codec/hash section | fixed compatibility literals and dependency versions | StableSurfaceV1/Sha256V1 only | algorithm/formatter selector |
| API entry | body/page/deadline raw keys and defaults | exact `CapabilityApiEntryParameters` | route/protocol feature flags |
| worker entry | body/fetch/parallelism/two deadlines;transport refs later map closed consumers | exact worker typed block and header-first order | source identity from topic,private payload field |
| outbound collaboration routes | ten named route sections,route product kind,destination/credential/TLS references and duplicate-candidate transport behavior | exact 10/10 event-name + schema-ref + logical-routing-key map;same stored candidate yields one stable intent | wildcard route that drops family identity,config-selected schema/payload,local outbox/attempt/DLQ/delivery truth |
| jobs entry | request bytes/planning page/run deadline/runner policy | full typed Job envelope and ordinal serial rule | `run_id`/key/scope/target flags,target parallelism |
| retry/timeout | all durations,attempts,ratio,jitter and whole-phase clipping | eligibility/owner matrix in §28 | retry permanent/unknown/consistency errors |
| persistence/adapter sections | product-specific endpoints/credentials/TLS/constructor material | one authority/nine typed slots/no fallback | secret body in validated root,multi-authority split |
| diagnostics | safe startup issue rendering and source disposal | Off/Redacted only,Step 15 field allowlist | raw/full/verbose/evidence claims |
| compatibility fixtures | exact compact JSON bytes,roundtrip/reject fixtures,shared core nested shapes,SHA-256 vectors | Step 8/13/25 byte semantics | current DTO reserialization as old-byte migration |

`04` must explicitly list every raw default;“use library default” is not acceptable for byte limits,deadlines,attempts,delay,ratio,jitter,page/batch orparallelism. The values must be reviewed against `05` test and `06` acceptance objectives later;this batch does not choose or claim any numeric result.

## 30. Batch `14.2` Cross-step, Historical and Comment Audit

### 30.1 Controlled reopen and cardinality

| surface | batch `14.2` delta | active result |
|---|---|---|
| Step 7 UoW helper | `CapabilityTransactionRef: Clone`;one `CapabilityCommitResolution` enum with 3 variants;UoW manager +1 callable | application Ports remain 36;UoW manager has 4 callables |
| Step 11 persistence | stable transaction resolution + linearizable recovery read/barrier semantics | repository traits/methods remain 22 / 110;logical stores unchanged |
| Step 12 errors | three-state resolution mapping reuses `CommitOutcomeUnknown` | 17 `ApplicationError`,51 issue codes,83 / 83 mappings unchanged |
| Step 13 concurrency | exact read + resolve + barrier reread and no-ref atomic winner rules | 40 keys/digests,83 flows,24 / 111 states and638 pairs unchanged |
| Step 14 config | 5 numeric wrappers,4 policy structs,3 public entry structs,1 entry enum,1 header-first struct | all infra/entry technical only;no HLD/domain/application helper/public protocol delta |

This is the historical `14.2` stop-review inventory. Batch `14.4.2` later changes only the `Worker` variant payload from `CapabilityWorkerEntryParameters` to the infra-local `CapabilityWorkerEntryBinding` and adds source-binding declarations around the existing public parameter object；batch `14.4.3` adds onlyinfra-local outbound route declarations andone worker-private continuation callable。The controlled deltas are audited in §§50.3 and58.2。

### 30.2 Declaration and Rustdoc audit

| declaration group added in `14.2` | count | Rustdoc result |
|---|---:|---|
| numeric wrapper structs | 5 | each wrapper and tuple field has English `///` |
| technical policy structs | 4 | each struct and all 19 fields have English `///` |
| entry parameter structs | 3 | each struct and all 12 fields have English `///` |
| entry parameter enum | 1 enum / 3 variants / 3 payload fields | enum,variants and payload fields all have English `///` |
| header-first worker struct | 1 struct / 9 fields | struct and every field have English `///` |
| new/updated callables | 33 | each constructor/accessor/root reader/entry reader/private hash helper has English `///` |
| Step 7 supporting declaration | 1 tuple struct field + derive;1 enum / 3 variants;1 callable | transaction field,enum,variants andcallable have English `///` |

The callable count is `10` wrapper constructors/accessors + `5` runtime-policy accessors + `12` concrete entry accessors + `2` root readers + `3` entry-variant readers + `1` private SHA helper = `33`. This is the historical `14.2` count;the later inbound source-ref/binding accessors andWorker-private processing mapper are counted in§50.3，while outbound route / classifier / binding accessors andthe exact-ref continuation callable are counted in§58.2。`CapabilityRetryDelayPolicy`, `CapabilityRetryPolicy` and `CapabilityTimeoutPolicy` intentionally expose no raw-field accessors to entries;infra-owned wrappers consume them through private/module-local construction. Existing `CapabilityCommitResolution` and `resolve_commit` were already drafted during the controlled reopen and are audited here. No struct, field, enum, variant, payload or callable in this batch is intentionally undocumented.

### 30.3 Historical / blocker / debt audit

| item | status after `14.2` | basis |
|---|---|---|
| old README / formal `03` provider runtime,KMS,cost,quota,policy,outbox config | historical_material | no corresponding config field,codec dependency,retry owner orentry parameter exists |
| old `05/06` numeric/evidence claims | historical_material | no numeric default,test result,run id,evidence alias orsign-off imported |
| L1 outbox/retention/job parallel patterns | historical_material | no TTL,cleanup,delivery lifecycle,target parallelism orhidden attempt store |
| `CH-DDD-S14-CODEC-HASH-BINDING-001` | resolved_in_batch_14_2 | exact crates,versions,API,owner andforbidden alternatives fixed |
| `CH-DDD-S14-AUTHORITATIVE-READ-001` | semantic_resolution_completed_adapter_binding_pending_14_3 | exact callable/three-state/barrier/read procedure fixed;concrete 27-Port assembly remains next batch |
| `CH-DDD-S14-ENTRY-ARGS-001` | typed_owner_completed_raw_schema_deferred_to_04 | exact entry structs/readers/boundaries fixed;raw keys/numbers remain formal `04` obligation |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non_blocking | authorized accessor contract unchanged |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non_blocking | current sibling shape inspected but formal L0-core wire commitment absent;Hub fixtures required |
| unresolved upstream blocker | none | no missing owner/Port/public schema prevents batch `14.3`;product binding failure must be raised there |

## 31. Batch `14.2` Self-check and Stop-review

| Gate | Result | Evidence |
|---|---|---|
| configuration-reference table | pass | §24 lists type,reader,default posture,`04` location andinvariant for every validated technical group |
| entry typed ownership | pass | §§23.3~23.4,24.1;API/worker/jobs receive only matching typed parameters/facade |
| codec/hash binding | pass | §25 exact `serde`/`serde_json`/`sha2` versions,functions,owners andanti-patterns |
| header-first inbound | pass | §26 bounded borrowed `RawValue`,closed dispatch andzero-effect unsupported schema order |
| authoritative recovery | pass at semantic seam | §27 plus Step 7/11/12/13 controlled sync;`14.3` must prove concrete local adapter assembly |
| retry/timeout/batch/parallelism | pass | §28 exact owner,eligibility,attempt identity,stop condition andforbidden behavior |
| formal `04` handoff | pass | §29 names raw schema/default/fixture obligations without creating `04` |
| baseline cardinality | pass | §30.1;36 Ports,22/110 repositories,250 public types,83 flows,24/111/638 state baseline preserved |
| structure/comment gate | pass | §30.2 audits every added struct/field/enum/variant/payload/callable with English `///` |
| historical/blocker/debt | pass | §30.3 isolates old material;no unresolved upstream blocker;two L0-core debts remain non-blocking |
| scope discipline | pass | no 27 local Port constructor table,9 external adapter assembly,transport product,cross-repo full table/runtime builder orformal§13 assembly source |
| truthfulness/artifact discipline | pass | formal `03` unchanged;no `04`,implementation ledger,boundary skeleton,code,commit,run,test/evidence/sign-off created orclaimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.2
gate_status = 03_step_14_batch_14_2_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
resolved_closure_item = CH-DDD-S14-CODEC-HASH-BINDING-001
semantic_closure_item = CH-DDD-S14-AUTHORITATIVE-READ-001
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_3
```

Batch `14.2` is complete and stops for review. After explicit user confirmation, only batch `14.3` may begin:read Step 7 all 5 base/read-gate +22 repository traits,Step 11 transaction/consistency/authority rules andthis file §§22~31,then write the 27 local/base Port adapter bindings andruntime-builder first half. Do not enter nine external Port/event/Job transport binding,full cross-repository builder closure,formal `03` assembly orimplementation artifacts.

## 32. Batch `14.3` 开工确认、范围与记号

本批在用户明确同意后开始。输入已重新读取并核对：Step 7 的 5 个 base/read-gate Port 与 22 个 repository trait、Step 11 的 logical store / transaction / authoritative-read / durable-fake parity 契约、Step 14 §§22~31 的 validated config / codec / entry policy，以及 Step 4 / 5 的现行文件职责。正式 `03-详细设计.md` 仍是 historical material，本批不修改正式文档。

### 32.1 本批必须闭合

1. 为 `CapabilityUnitOfWork`、`CapabilityUnitOfWorkManager`、`ClockPort`、`IdGeneratorPort`、`CapabilityReadVisibilityResolverPort` 给出唯一 local adapter owner。
2. 为 22 个 repository trait 给出 exact 文件、concrete adapter role、constructor 输入、注入来源和所覆盖的 logical store。
3. 证明所有需要跨 repository 原子提交的 logical store 共享同一个 local persistence authority；代码文件分组不等于事务 authority 分裂。
4. 固定 durable adapter 与 in-memory fake 在 transaction ref、CAS、unique/current index、cursor、body-free symmetry、rollback、commit resolution 和 recovery read 上的 parity。
5. 给出 runtime builder 的 local/base 前半顺序，明确在本批末尾停止，不提前装配 9 个 external Port。

### 32.2 本批不进入

| 不在本批的内容 | 处理位置 |
|---|---|
| 9 个 external resolver / handoff / collaboration Port | batch `14.4` |
| 6 个 Inbound、10 个 Outbound 的 transport / event source / schema binding | batch `14.4` |
| 8 个 Operations Job 的 runner / external effect 绑定 | batch `14.4` |
| sibling repo path dependency、完整 Cargo matrix、目标实现仓存在性 | batch `14.5` / `07` |
| 具体数据库、search、cache、broker、transaction product 或迁移 | `04` / `07`；本批不选择产品 |
| 正式 `03-详细设计.md` §13 装配、Step 15~19 | 后续对应 Step |

### 32.3 绑定记号与可落码约束

下表中的 `A`、`K`、`F` 只是本批的 constructor 记号，不是新增 application Port 或 public type：

| 记号 | 精确定义 | 来源 | 生命周期 / 禁止事项 |
|---|---|---|---|
| `A` | 一个 `CapabilityLocalPersistenceAuthority` 的 `Arc` 句柄；它同时拥有全部 local logical store、索引、transaction status 和 authority read barrier | `runtime_builder.rs` 从已验证 `CapabilityLocalPersistenceBinding` 构造 | process lifetime；不得按 logical store 拆成多个 authority，不得暴露给 `application` 或 entry |
| `U` | 一个由 `A` 开启的 concrete local transaction handle，实现既有 `CapabilityUnitOfWork` | `CapabilityUnitOfWorkManager::begin` | operation lifetime；只能通过传入的 `&dyn CapabilityUnitOfWork` 被 repository 使用，不得由 repository 自行创建 |
| `K` | 从固定 `StableSurfaceV1 + Sha256V1` compatibility binding 构造的内部 codec / digest verifier 组合 | `runtime_builder.rs` 读取 `CapabilityRuntimeConfig::compatibility()` | process lifetime；不可由配置选择算法、field order 或 hash domain |
| `F` | Local / Integration profile 使用的 typed deterministic fixture state | `infra/config.rs` 已验证的 fixture ref，由 builder 解析 | 只可用于非-Deployment；不得把 fake fixture 作为 Deployment fallback 或第二 truth store |

`A`、`U`、`K`、`F` 对应的具体私有字段仍属于 infra 实现细节；实现时每个新增 `struct`、所有字段、enum、variant、variant payload 和 callable 必须写英文 `///` Rustdoc。它们不是新的 HLD object、application helper、public protocol type、state owner 或 persisted store。

## 33. Single local persistence authority 与 store grouping

### 33.1 Authority 拓扑

`CapabilityLocalPersistenceBinding` 只选择一个 local persistence authority：`InMemory` 或 `Durable { store_ref }`。builder 必须先构造 `A`，再把同一个 `A` 注入所有 22 个 repository adapter 和 `CapabilityUnitOfWorkManager`。任何 repository adapter 不得从 `store_ref` 再次解析 raw config，也不得私自创建第二个连接池、transaction manager、session registry 或 recovery status owner。

```text
validated CapabilityRuntimeConfig
  -> one CapabilityLocalPersistenceAuthority (A)
       -> one CapabilityUnitOfWorkManager
       -> repositories.rs adapters
       -> projection_stores.rs adapters
       -> reference_stores.rs adapters
       -> idempotency_store.rs adapters
       -> read_visibility.rs resolver adapter
       -> same-authority linearizable recovery reads
```

代码文件的 grouping 只表达 trait / store 的 ownership 和实现职责，不代表下列 group 之间可以配置为不能共同 commit 的独立数据库。若某个 concrete product 不能在一个 authority 内提供 Step 11 的 atomic write set、unique/CAS、stable cursor、transaction-ref resolution 和 read barrier，该 product binding 必须在 startup assembly 前阻断并登记 blocker；不得用跨库 best-effort、sleep、replica read 或 application memory 补齐。

### 33.2 Logical store 到代码 grouping

| 代码 grouping | logical stores | 覆盖 repository traits | constructor 的 authority 输入 | 不允许的替代 owner |
|---|---|---|---|---|
| `crates/infra/src/repositories.rs` | `capability_identity_store`、`capability_access_review_store`、`capability_registry_store`、`adapter_descriptor_store`、`descriptor_risk_summary_store`、`secret_safe_summary_store`、`governance_seam_store`、`method_relation_store`、`formal_exposure_store`、`formal_visibility_store`、`capability_change_record_store`、`capability_trace_revision_store`、`capability_impact_store`、`downstream_impact_summary_store`、以及 `CapabilityTruthSnapshot` 的 committed typed read | 13：identity / review / registry / descriptor / safe summary / governance seam / method relation / exposure / visibility / change / trace / impact / truth snapshot | `A`；不接收每个 logical store 的独立 config ref | projection、external resolver、current-truth reconstruction、数据库 trigger |
| `crates/infra/src/projection_stores.rs` | `controlled_consumer_view_store`、`directory_projection_store`、`audit_export_summary_store`、`ecosystem_discovery_store`、`reconciliation_report_store` | 3：controlled view / derived material / reconciliation report | `A`；需复用 `K` 的 fixed surface / digest validation 时由 builder传入已绑定 verifier，不读取 raw config | search index 作为 formal owner、marketplace listing、audit body store |
| `crates/infra/src/reference_stores.rs` | `external_reference_store`、`reference_resolution_state_store` | 2：external reference / canonical resolution state | `A`；candidate digest 和 typed union validation沿用 application contract，不读取 external body | 每个 ref variant 的第二份 state、resolver response cache、raw locator search |
| `crates/infra/src/idempotency_store.rs` | `idempotency_record_store`、`stored_operation_result_store`、`stored_result_surface_store`、`stored_consumer_receipt_store`、`stored_job_report_store`、`event_payload_snapshot_store`、`event_capture_store`、`job_execution_journal_store` | 4：idempotency / stored result / event capture / Job execution | `A + K`；snapshot / surface bytes 只按既有 typed contract 校验 | local outbox、relay queue、DLQ、TTL cleanup、run-id finder、generic bytes decoder |

上表的 logical store 清单是 Step 11 inventory 的代码 ownership 映射，不是新增 store。`event_payload_snapshot_store` 与 `event_capture_store` 仍是 source-owning UoW 的 local sidecar；`stored_*` 仍是 immutable replay surface；`job_execution_journal_store` 仍以 normalized idempotency key 为唯一 owner。所有这些 store 必须能与相应 source / reservation / result 在同一个 `U` 中提交或整体回滚。

### 33.3 Authority constructor 与 lifecycle

| constructor / builder call | 输入 | 输出 / 注入 | 失败门禁 |
|---|---|---|---|
| `build_local_persistence_authority` | validated `CapabilityLocalPersistenceBinding`、profile、必要的 typed `F` fixture state | `A` | binding 解析、authority 初始化、transaction status 或 required index 无法建立时返回 `InfraError::RuntimeAssembly`；不返回部分可用 authority |
| `build_unit_of_work_manager` | `A` | `Arc<dyn CapabilityUnitOfWorkManager + Send + Sync>` | manager 必须与 `A` 是同一 authority；无法保证 stable transaction ref / resolution 时 startup reject |
| repository adapter constructors | `A`，需要时加 `K` | `Arc<dyn RepositoryPort + Send + Sync>` | 任何 adapter 使用不同 `A`、缺少 required index 或无法 checked-downcast `U` 时 wiring / assembly failure |
| `build_read_visibility_resolver` | `A`、formal visibility / owner-chain indexes 已由 authority 提供 | `Arc<dyn CapabilityReadVisibilityResolverPort + Send + Sync>` | 不能从 id、cursor、route 或 fixture 默认值推导 visibility；resolver index 不完整时 assembly reject |

`commit` 消费 `Box<dyn CapabilityUnitOfWork>` 前，application 复制 `uow.transaction_ref().clone()`。authority 必须把 transaction ref 与 staged write set 绑定；`resolve_commit` 只在同一个 `A` 上执行。`A` 不得把 transaction ref 当业务 key，也不得在 commit unknown 时根据普通 row absence 推断 `NotDurable`。

## 34. 27 个 local/base Port 逐项绑定表

### 34.1 5 个 base / read-gate Port

| Port | concrete owner / 文件 | constructor 输入 | 注入来源与调用方 | exact semantic gate |
|---|---|---|---|---|
| `CapabilityUnitOfWork` | `CapabilityLocalUnitOfWork`，`infra/runtime_builder.rs`；每次 `begin` 创建一个 `U` | `A`、新生成的 opaque `CapabilityTransactionRef` | `CapabilityLocalUnitOfWorkManager::begin`；application command / accepted consumer / write Job service 只获得 `Box<dyn CapabilityUnitOfWork>` | `transaction_ref()` 返回稳定 ref；`as_any()` 只允许所属 adapter checked downcast；不得暴露 staged rows、不得被 Query 或 external call 持有 |
| `CapabilityUnitOfWorkManager` | `CapabilityLocalUnitOfWorkManager`，`infra/runtime_builder.rs` | `A`、fixed transaction / observation policy wrapper | `runtime_builder.rs` 注入 application service graph | `begin / commit / rollback / resolve_commit` 都指向同一 `A`；commit unknown 保留 `Durable / NotDurable / Unknown`，rollback 不触碰 external side effect |
| `ClockPort` | `SystemClockAdapter` 或 `DeterministicClockAdapter`，`infra/clock_id.rs` | validated `CapabilityClockBinding`；Deterministic 分支另需 typed `F` | `runtime_builder.rs` 分别注入所有需要 `ClockPort` 的 application factory/service | `now()` 是唯一 authoritative application time 来源；system / deterministic 是独立 adapter；不得由 DB default、client time、external response 或 service 自己读取时钟 |
| `IdGeneratorPort` | `SystemIdGeneratorAdapter` 或 `DeterministicIdGeneratorAdapter`，`infra/clock_id.rs` | validated `CapabilityIdGeneratorBinding`；Deterministic 分支另需 typed `F` | `runtime_builder.rs` 注入 domain factory orchestration 所需 application service | 覆盖 Step 7 声明的全部 typed id methods；不得用 URL、identity key、trace、job run、digest 或随机 request metadata 代替；具体 UUID/ULID/统一编码不由配置选择，留实现仓 / `07` 固定 |
| `CapabilityReadVisibilityResolverPort` | `CapabilityReadVisibilityResolverAdapter`，`infra/read_visibility.rs`（本批同步补入文件布局） | `A`；actor context、typed subject/scope 是每次 callable 输入，不从 config 注入 | `runtime_builder.rs` 注入 `query_service`；API 不直接持有该 concrete adapter | `resolve_subject` 与 11 个 page resolver 都先于 repository body read；使用 formal owner / visibility / reference / material indexes；empty page 不默认 Visible，Degraded kind 不从错误文本或 fake-private marker 推导 |

`IdGeneratorPort` 的具体 ID 编码仍不是本批的配置项；这不是允许实现者在 domain 内自行生成 ID。实现仓必须在 `07` 选择并测试一个可碰撞检测、可 deterministic fake 的 concrete generator，并保持 Step 7 method surface 不变。

### 34.2 13 个 truth / relation / trace / impact / snapshot repository Port

| Port | concrete owner / 文件 | constructor 输入 | exact method surface（不得新增 private finder） | binding / failure gate |
|---|---|---|---|---|
| `CapabilityIdentityRepository` | `CapabilityIdentityRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_by_id`、`find_by_identity_key`、`search`、`save` | 绑定 `capability_identity_store`；identity-key unique、current/history index、CAS 和 empty page 由 durable/fake共同执行；storage failure沿既有 transaction/repository mapping返回 |
| `CapabilityAccessReviewRepository` | `CapabilityAccessReviewRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_identity`、`list_by_identity`、`save` | 绑定 `capability_access_review_store`；current 只认 `Recorded`，不把 review 当 governance approval；current uniqueness / CAS / rollback parity |
| `CapabilityRegistryRepository` | `CapabilityRegistryRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_identity`、`list_matching`、`save` | 绑定 `capability_registry_store`；Retired 仍 exact-readable 但不返回 current；不得读取 runtime / marketplace filter |
| `AdapterDescriptorRepository` | `AdapterDescriptorRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_registry_entry`、`list_by_registry_entry`、`save` | 绑定 `adapter_descriptor_store`；Accepted/Unresolved current constraint、registry owner parity、CAS 和 terminal retention 必须一致 |
| `DescriptorSafeSummaryRepository` | `DescriptorSafeSummaryRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_risk_summary_with_version`、`find_current_risk_summary`、`save_risk_summary`、`get_secret_summary_with_version`、`find_current_secret_summary`、`find_current_secret_summary_by_descriptor`、`save_secret_summary` | 绑定 `descriptor_risk_summary_store` 与 `secret_safe_summary_store`；只存 body-free safe summary；不读取 secret value，不用 missing 表示 low risk |
| `GovernanceSeamRepository` | `GovernanceSeamRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_identity`、`list_by_identity`、`save` | 绑定 `governance_seam_store`；Unresolved 仍是 current；不得创建或覆盖 governance approval truth |
| `CapabilityMethodRelationRepository` | `CapabilityMethodRelationRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_identity`、`list_by_identity`、`list_by_method_asset`、`save` | 绑定 `method_relation_store`；Unresolved current 不得被当作 missing；不得读取 method body / lifecycle |
| `FormalExposureRepository` | `FormalExposureRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_registry_entry`、`list_by_registry_entry`、`save` | 绑定 `formal_exposure_store`；registry owner、non-retired current 和 CAS；不读取 SDK package/client/cache |
| `FormalVisibilityRepository` | `FormalVisibilityRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_with_version`、`find_current_by_exposure`、`save` | 绑定 `formal_visibility_store`；`source_exposure_version` 必须与 final exposure version 对称；不得从 runtime allowlist生成 visibility |
| `CapabilityChangeRecordRepository` | `CapabilityChangeRecordRepositoryAdapter`，`infra/repositories.rs` | `A` | `append_identity_change`、`append_registry_change`、`append_descriptor_change`、`append_governance_seam_change`、`append_method_relation_change`、`append_exposure_change`、`get`、`list_by_subject` | 绑定 `capability_change_record_store`；六 variant append-only，duplicate / wrong union / overwrite 是既有 uniqueness/consistency error |
| `CapabilityTraceabilityRepository` | `CapabilityTraceabilityRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_revision`、`get_current_with_version`、`find_current_by_change`、`list_by_subject`、`append_revision` | 绑定 `capability_trace_revision_store`；historical exact ref 不升级 current；next revision 只使用 loaded expected version，gap / multiple highest reject |
| `CapabilityImpactRepository` | `CapabilityImpactRepositoryAdapter`，`infra/repositories.rs` | `A` | `get_impact_with_version`、`find_impact_by_traceability`、`list_impacts_by_consumer`、`save_impact`、`get_downstream_summary_with_version`、`find_downstream_summary_by_source_feedback`、`list_downstream_summaries`、`save_downstream_summary` | 绑定 `capability_impact_store` 与 `downstream_impact_summary_store`；trace / consumer / feedback owner parity、source-feedback unique、CAS；不得写 external execution result |
| `CapabilityTruthSnapshotRepository` | `CapabilityTruthSnapshotRepositoryAdapter`，`infra/repositories.rs` | `A` | `load_snapshot_page` | 绑定 virtual committed read over truth stores，不新增 snapshot table；scope 必须 exact，返回 refs + versions，不返回 row dump / mixed-time body graph |

### 34.3 9 个 view / derived / reference / technical repository Port

| Port | concrete owner / 文件 | constructor 输入 | exact method surface（不得新增 private finder） | binding / failure gate |
|---|---|---|---|---|
| `ControlledConsumerViewRepository` | `ControlledConsumerViewRepositoryAdapter`，`infra/projection_stores.rs` | `A` | `get_with_version`、`find_current_by_exposure_and_consumer`、`list_matching`、`list_affected_by_truth`、`list_affected_by_reference`、`save` | 绑定 `controlled_consumer_view_store`；affected index 按 source version 返回 current Loaded；stale save 与 source mutation同UoW；不得反写 exposure/registry truth |
| `CapabilityDerivedMaterialRepository` | `CapabilityDerivedMaterialRepositoryAdapter`，`infra/projection_stores.rs` | `A` | `get_directory_projection_with_version`、`find_directory_projection_by_registry_entry`、`search_directory_projections`、`save_directory_projection`、`get_audit_export_with_version`、`find_audit_export_by_traceability`、`list_audit_exports_by_scope`、`save_audit_export`、`get_ecosystem_discovery_with_version`、`find_ecosystem_discovery`、`save_ecosystem_discovery`、`list_material_refs` | 绑定 directory / audit export / ecosystem stores；scan 只返回 typed refs，exact load 缺失或 owner/index 不对称必须使当前 flow rollback；不得把 marketplace/search backend当 owner |
| `CapabilityReconciliationReportRepository` | `CapabilityReconciliationReportRepositoryAdapter`，`infra/projection_stores.rs` | `A` | `get`、`list_by_scope`、`find_by_job_run`、`append` | 绑定 immutable `reconciliation_report_store`；append-only；Job duplicate replay不得用该 Port解码 typed response或重跑 |
| `CapabilityExternalReferenceRepository` | `CapabilityExternalReferenceRepositoryAdapter`，`infra/reference_stores.rs` | `A` | `get_with_version`、`find_by_candidate_digest`、`list`、`save` | 绑定八 variant `external_reference_store`；kind + candidate digest、union/ref/object parity；不得扫描 raw locator或external body |
| `ReferenceResolutionStateRepository` | `ReferenceResolutionStateRepositoryAdapter`，`infra/reference_stores.rs` | `A` | `get_with_version`、`find_current_by_subject`、`list_by_reference_scope`、`save` | 绑定唯一 `reference_resolution_state_store`；每个 subject 单一 current state；terminal Invalid/Forbidden不得被 fake重开 |
| `CapabilityIdempotencyRepository` | `CapabilityIdempotencyRepositoryAdapter`，`infra/idempotency_store.rs` | `A` | `get_with_version`、`reserve_if_absent`、`save` | 绑定 `idempotency_record_store`；reserve 是 authority-level atomic winner；save 只允许 `Reserved -> Completed`；无 TTL、cleanup、conflict row 或 blind overwrite |
| `StoredCapabilityResultRepository` | `StoredCapabilityResultRepositoryAdapter`，`infra/idempotency_store.rs` | `A + K` | `get`、`get_surface`、`save`、`get_consumer_receipt`、`save_consumer_receipt`、`get_job_report`、`save_job_report` | 绑定 shell/surface/typed receipt/typed Job report stores；K 只验证 fixed bytes/digest，不能选择 decoder；missing/asymmetry 是 consistency defect，不重跑 mutation |
| `CapabilityEventCaptureRepository` | `CapabilityEventCaptureRepositoryAdapter`，`infra/idempotency_store.rs` | `A + K` | `get_with_snapshot`、`find_by_source_and_schema`、`list`、`capture`、`bind_intent` | 绑定 immutable snapshot + versioned capture；source/snapshot/capture 初始写同UoW，bind 只CAS intent；不保存 delivery lifecycle，不引入 second queue |
| `CapabilityJobExecutionRepository` | `CapabilityJobExecutionRepositoryAdapter`，`infra/idempotency_store.rs` | `A` | `get_with_version`、`create`、`save` | 绑定 `job_execution_journal_store`；normalized key唯一，完整 Planned plan initial create，whole-record CAS，ordinal serial terminalization；无 list/run/target/lease/attempt finder |

### 34.4 逐项 constructor / injection audit

| 审计维度 | 统一结论 |
|---|---|
| raw config 是否进入 Port constructor | 否；builder 从 immutable validated root 提取 binding，adapter只接收 `A`、`K`、typed fixture/material 或 implementation-specific resolved dependency |
| 每个 repository 是否有独立 store config slot | 否；logical store grouping是文件职责，全部 transaction-capable repository共享 `A` |
| repository 是否能隐式 begin / commit | 否；所有写方法接收既有 `&dyn CapabilityUnitOfWork`，adapter必须 checked-downcast到所属 `U` |
| Query 是否创建 UoW / refresh / repair | 否；Query只执行resolver-first read和既有get/find/list/load methods |
| external body / secret / method body 是否可能由 local adapter读取 | 否；local adapters只处理Hub-owned typed object、body-free ref、safe summary、snapshot bytes或已验证surface bytes |
| disabled local Port 是否可自动切 fake | 不适用；local persistence、Clock、IdGenerator和read gate不允许 disabled；external disabled留 `14.4` |
| private finder / second owner | 0；任何实现需要额外 finder、cache truth、run lookup或status table时必须回开 Step 7/11/6 |

## 35. Durable adapter / in-memory fake 语义 parity

### 35.1 必须一致的行为轴

| 行为轴 | durable adapter | in-memory fake | 不合格实现 |
|---|---|---|---|
| authority identity | 所有 logical store 和 transaction status在同一 configured authority | 一个 shared fake authority，不能每个 repository各有 map | repository 私有 map、global transaction string map、跨authority拼装 |
| UoW staging | staged writes/index changes 在 commit 前不可见；rollback 全部丢弃 | transaction-local staged state，commit 原子 merge；failure injection不可留下半写 | eager mutate shared map、只回滚主表不回滚 index/sidecar |
| transaction ref | authority生成 opaque stable ref，commit后可 resolve | fake 为每个 issued ref保留 terminal `Durable/NotDurable/Unknown`选择 | 用 row id、时间窗口或 process memory absence猜 commit 状态 |
| commit resolution | same-authority status / driver token + linearizable barrier | failure injection可分别模拟三态，`resolve_commit`与后续 exact reads一致 | 所有 unknown 都映射 NotDurable，或用 replica/cache替代 authority |
| CAS / unique / current index | 在同一原子写集内 enforce | 使用与 durable相同的 conditional unique / CAS winner规则 | last-write-wins、先查后插非原子、fake放宽 stale version |
| page / cursor | typed filter、stable order、scope-bound cursor、empty page | 相同 stable order / cursor misuse / empty page | map iteration order、fake默认排序、cursor跨方法复用 |
| union / digest symmetry | read/write 都校验 variant/ref/kind/digest/source owner 对称 | 执行完全相同校验，fixture不能绕过 | debug string dispatch、generic bytes shortcut、missing-as-success |
| event capture | source + complete snapshot + initial capture同UoW；bind CAS | 同一 staged set 和 failure injection | second queue、post-commit source rebuild、capture复制delivery state |
| Job journal | complete plan initial create、target/final whole-record CAS、terminal payload immutable | 同样的 plan/ordinal/terminal guards | private progress field、run scan、target parallelism、upsert |
| affected-material fence | source version / affected index / material CAS同一逻辑 fence | fake generation/fence reproduces concurrent obsolete-source conflict | 先提交source再补stale、fake允许旧source material并发成功 |
| missing vs degraded vs consistency | exact missing、typed degraded、loaded asymmetry分别映射既有错误/结果 | 完全相同分类 | fake把 unavailable/stale/partial变 missing或success |
| forbidden body | durable拒绝 raw secret/external/method/governance/audit body | fake builders和fixtures同样拒绝 | test convenience保存未经扫描的body |

### 35.2 Failure injection 与 recovery read contract

fake 只能增加测试专用的 failure-injection arrangement API，不能增加 application 可调用的 Port 方法或 persisted truth。允许注入的场景至少包括：begin failure、save failure、unique/CAS loser、rollback failure、明确 non-durable commit、durable-but-ack-lost commit、still-unknown resolution、missing/asymmetric sidecar、cursor misuse 和 forbidden body。每个场景都必须经过既有 `ApplicationError` / typed protocol mapping；本批不生成测试结果或 evidence。

`Durable` 返回前，`A` 必须已建立 read barrier；随后由同一 `A` 执行的 exact owner / sidecar reads不得看到旧写集。`NotDurable` 返回前，`A` 必须证明原 transaction ref不会稍后变为 durable；并发 winner仍需通过 exact unique/current owner read分类。`Unknown`、resolution timeout或authority error一律继续既有 `CommitOutcomeUnknown`，不得由 fake 为了方便改成 rollback success。

## 36. Runtime builder 前半顺序与 constructor graph

### 36.1 Local/base assembly order

```text
load raw source and validate CapabilityRuntimeConfigCandidate
  -> construct immutable CapabilityRuntimeConfig
  -> resolve one local persistence binding into A
  -> validate A supports atomic write sets, CAS/unique indexes,
     stable cursor, transaction-ref resolution and linearizable authority reads
  -> build CapabilityLocalUnitOfWorkManager from A
  -> build repository adapters in repositories.rs from A
  -> build projection / report adapters in projection_stores.rs from A
  -> build reference / canonical-state adapters in reference_stores.rs from A
  -> build idempotency / result / capture / journal adapters from A + K
  -> build ClockPort and IdGeneratorPort separately from validated bindings
  -> build CapabilityReadVisibilityResolverPort from A
  -> run local adapter parity / owner / UoW identity assembly gates
  -> retain the local/base port graph for the next assembly phase
```

本批结束于 `retain the local/base port graph`。下一步才允许装配 external resolver、handoff、event collaboration 和 entry runner；若在本阶段发现 external slot 影响 local authority construction，只能读取其 validated presence / disabled marker，不能提前构造 external adapter或改变 local transaction semantics。

### 36.2 Application constructor injection

application service constructor 只接收 `Arc<dyn ... + Send + Sync>` 的既有 application Port、既有 typed policy primitives（如 internal scan page limit / timeout wrapper）以及必要的 domain factory dependencies。它不接收 `CapabilityRuntimeConfig`、`CapabilityConfigName`、`CapabilityStoreConfigRef`、raw config、endpoint、credential、fixture ref 或 concrete adapter。

对于 Rust async object safety，Step 7 / Step 8 code block中的native `async fn`仍是语义签名，但实现形态不再留给实施者选择：所有进入`Arc<dyn ... + Send + Sync>` graph且含async callable的application Port / repository / service和entry handler trait及对应impl统一使用`#[async_trait::async_trait]`，版本固定为`0.1.89`，不得使用`?Send`。同步owner严格为`application`声明、`infra` adapter impl、`api` / `worker` / `jobs` handler声明与impl五个member；contracts/domain不直接依赖。该展开不得改变trait method、参数、返回类型、错误映射、UoW identity、fake parity或八臂Jobs签名。

### 36.3 Local builder failure gate

| gate | 必须证明 | 失败结果 |
|---|---|---|
| config-to-authority | `CapabilityLocalPersistenceBinding`只产生一个 `A`，profile约束已执行 | `InfraError::RuntimeAssembly`，不暴露 partial graph |
| authority-to-UoW | `begin / commit / rollback / resolve_commit`共享 `A`，U可 checked-downcast | `InfraError::RuntimeAssembly`；不得退化为 hidden session |
| authority-to-repository | 22 traits全部绑定，required indexes / current constraints / typed union checks存在 | `InfraError::RuntimeAssembly` 或既有 concrete adapter construction error |
| authority-to-read-gate | resolver-first source indexes和empty-page resolution可用 | `InfraError::RuntimeAssembly`；不得默认 Visible |
| durable/fake profile | Deployment无 fake；Local/Integration fake保持 parity | validation reject；不得静默替换 binding |
| post-assembly local call | local failure映射既有 `ApplicationError`，不伪造新 taxonomy | 按 Step 12 exact mapping；不得包装成 external failure |

## 37. Batch `14.3` 受控同步与注释审计

### 37.1 Step 4 / Step 7 owner sync

Step 4 的文件布局中补入 `crates/infra/src/read_visibility.rs`，职责为实现 `CapabilityReadVisibilityResolverPort` 的 durable / fake resolver adapter。Step 7 §16.1 已有该 owner 记录；本同步只修正文档文件职责，不新增 Port、trait、public type、state 或 persistence owner。

本批未新增 Rust public struct / enum / variant / payload。`CapabilityLocalPersistenceAuthority`、`CapabilityLocalUnitOfWork`、各 `<Trait>Adapter` 和 clock/id concrete role 是 planned infra-private implementation roles，不是已宣称存在的源码声明；实施时若落为 Rust declaration，必须逐项补英文 `///`，包括所有 struct field、enum variant 和 callable。

### 37.2 Cardinality audit

| surface | 本批结果 |
|---|---:|
| base / read-gate Port | 5 / 5 |
| repository Port | 22 / 22 |
| local/base Port total | 27 / 27 |
| repository trait method surface | 110 / 110，按 Step 7 exact signatures承接 |
| external Port | 0 / 9，本批明确未进入 |
| new application Port / HLD object / public protocol / state | 0 |
| logical store authority | 1，未拆分 |
| hidden local outbox / relay / DLQ / TTL / cleanup owner | 0 |

### 37.3 Historical / blocker audit

| item | 当前结论 |
|---|---|
| 旧 provider runtime / KMS / Vault / cost / policy / marketplace binding | 仍为 `historical_material`，未进入任何 local constructor 或 store grouping |
| 旧 outbox / relay / delivery lifecycle | 仍为 `historical_material`；event snapshot/capture 只按既有 Step 6~13 contract 绑定，external delivery留 `14.4` |
| `CH-DDD-S14-AUTHORITATIVE-READ-001` | local adapter binding已按 single `A`、stable transaction ref、linearizable read barrier 和 fake三态闭合；若具体产品不能满足，后续必须登记 product binding blocker，不得弱化语义 |
| `CH-DDD-S14-INFRA-CONFIG-SCHEMA-001` | 保持已关闭；本批未扩展 raw config schema或配置 key |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | 保持 non-blocking；本批未改 core accessor |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | 保持 non-blocking；K 只承接已固定 v1 bytes，Hub fixture仍需后续覆盖 |
| unresolved upstream blocker | 0；具体 backend若不能提供 authority guarantees，将在产品绑定阶段成为 blocker，不在本批伪造“可用” |

## 38. Batch `14.3` 自检与停审

| Gate | Result | Evidence |
|---|---|---|
| 5 个 base/read-gate Port 有唯一 adapter owner | pass | §34.1；`runtime_builder.rs` / `clock_id.rs` / `read_visibility.rs` 完整覆盖 |
| 22 个 repository trait 有 exact 文件、constructor 和 method surface | pass | §§33.2、34.2、34.3；110 / 110 methods承接，不新增 private finder |
| single persistence authority | pass | §33；所有 local repository、UoW manager、read gate共享 `A`，无 per-store authority slot |
| durable / fake parity | pass | §35；CAS、unique、cursor、rollback、typed symmetry、capture/journal、三态 resolution和failure injection均闭合 |
| runtime builder 前半 | pass | §36；在 external Port / event / Job binding前明确停下 |
| file-layout controlled sync | pass | §37.1；只补既有 read-visibility adapter owner |
| structure / comment gate | pass | §37.1；本批无新增 Rust declaration；planned concrete declarations已明确实施时逐项 `///` |
| historical / blocker audit | pass | §37.3；未继承旧配置或外部 runtime truth，无当前上游 blocker |
| formal document / implementation artifacts | unchanged | 正式 `03`、`04`、implementation ledger、planned boundary skeleton、commit、run、test/evidence/sign-off 均未创建或修改 |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.3
gate_status = 03_step_14_batch_14_3_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
local_base_ports_bound = 27/27
repository_methods_bound = 110/110
local_persistence_authority_count = 1
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_4
```

Batch `14.3` 已完成并停审。未经用户下一次明确确认，不得进入 `14.4`；下一批只读取并绑定 9 个 external Port、6 个 Inbound、10 个 Outbound 和 8 个 Job 的运行期 / event / handoff 边界，不得回写正式 `03` 或创建实现产物。

## 39. Batch `14.4.1` 开工输入、问题回答与边界诊断

### 39.1 本批读取门禁

本批只承接九个 Step 7 external Port 的已确认 trait surface，并将其绑定到 `infra` 的三个既有文件职责。Inbound source、Outbound event family、worker continuation、Operations Job runner 和完整 runtime builder 留在 `14.4.2~14.5`，不得在本批借外部 Port 名称提前增加入口或事件类型。

| 输入 | 本批读取结论 | 本批使用边界 |
|---|---|---|
| Step 7 §14 external Port contracts | 九个 Port 的 trait、callable 参数、返回类型和 body-free / owner boundary 已闭合 | 逐 callable 指定 adapter owner、typed validation 和 failure surface；不改 trait signature |
| Step 8 external reference / collaboration contracts | resolver observation、handoff outcome、collaboration item / outcome 是既有 typed carrier | adapter 只形成或转发合法 typed carrier；不新增 DTO、field、event schema 或 local status |
| Step 9 reference / handoff / collaboration flows | resolver 在 local UoW 写入前调用；handoff / collaboration 位于 local commit 外 | external failure 不回滚已提交 local truth；不把 post-commit call 变成 local transaction participant |
| Step 12 §15~§16 / §34~§43 | 六类 `ApplicationPortFailureKind` 和逐协议映射已闭合 | raw transport text、status、private code 不参与分类；typed outcome 不降级成 error |
| Step 13 §14、§17~§20 | external candidate / stable intent、exact ref、same-input retry 和 reentry authority 已闭合 | collaboration 只使用 stored snapshot；不得 current-truth rebuild、second intent 或 blind retry |
| Step 14 §§14~§18、§24、§28 | 九个 binding slot、typed timeout/retry owner、禁止配置化矩阵已闭合 | 读取 validated binding；具体 endpoint、topic、credential、数值由 `04` 移交 |

### 39.2 SOP 八问在本批的回答

| SOP问题 | `14.4.1`裁决 |
|---|---|
| 哪些代码层读取外部绑定配置？ | 只有 `infra/config.rs` 在 startup 解析 raw source，`infra/runtime_builder.rs` 读取 validated slot 并构造 concrete Port。`application`、`api`、`worker`、`jobs` 只接收既有 Port 或 facade，不保存 `CapabilityAdapterConfigRef`。 |
| 九个 Port 分别绑定到哪里？ | 七个 resolver family 绑定 `infra/source_resolvers.rs`；`ObservabilityAuditHandoffPort` 绑定 `infra/handoff_adapters.rs`；`CapabilityAccessEventCollaborationPort` 绑定 `infra/publishers.rs`。文件共享实现辅助函数不等于共享 Port 或共享 truth owner。 |
| `Configured`、`DeterministicFake`、`Disabled` 如何装配？ | 三种 binding 都必须生成对应 trait object。`Disabled` 不是缺失 object，而是一个 exact Port implementation；调用时返回该 Port 对应的 `PortFailure(NotConfigured)`。Deployment 禁止 fake，Local / Integration fake 必须保持 typed outcome 和 negative boundary parity。 |
| 外部 adapter 允许接收什么？ | 只接收 trait 声明的 body-free ref、locator summary、safe scope、candidate、exact stored event surface 或 exact typed ref。不得接收 capability invocation request、method body、secret value、governance body、SDK client state、raw audit body或 current truth body。 |
| 外部返回如何分类？ | 能形成声明的 typed observation / outcome 就沿用该 typed surface；无法形成合法 typed return 才返回 `ApplicationError::PortFailure`。返回已形成但与输入 subject / kind / source / intent 不对称的 carrier，由 application 按既有 `ConsistencyDefect` 处理。 |
| 哪些失败可重试？ | 只有 `TemporarilyUnavailable`、`Timeout`，且 invocation wrapper 能证明本次 external effect 尚未被接受，才可使用 `CapabilityRuntimeTechnicalPolicy.external_retry`。`NotConfigured`、`PermanentlyRejected`、`InvalidTypedResponse`、`UnexpectedSourceFailure`、`ConsistencyDefect`、`CodecFailure` 和 `CommitOutcomeUnknown` 不得自动 mutation retry。 |
| external handoff / collaboration 是否加入 local UoW？ | 不加入。resolver 是不可回滚的 external read；handoff 和 collaboration 是 local commit 后的 external effect。local capture / snapshot / trace revision 的提交由 application 既有 UoW负责，external failure只能形成既有 typed surface或 operational follow-up。 |
| 依赖缺失如何处理？ | 真实 binding 缺失在 startup 由 `InfraError::RuntimeAssembly` 阻断；显式 `Disabled` 允许 graph 完整装配但调用返回 `NotConfigured`；Local / Integration 可用 typed fake，不能把 fake 静默带入 Deployment。 |

### 39.3 当前文档问题诊断与取舍

旧正式 `03-详细设计.md` 把 provider client、KMS/Vault、runtime access gateway、publisher/outbox 和 policy refresh 混成一个外部依赖层。这些内容与当前 capability identity / registry / descriptor / governance seam / method relation / formal exposure 主线冲突，本批不从旧文档修补任何 adapter。

本批选择“按 Port family 分离 adapter，按文件共享非公开 transport helper”的取舍：

1. 每个 application Port 保留一个可追踪的 concrete owner，application failure 的 `ApplicationPortKind` 可以精确回指调用边界。
2. 相同外部产品可以被多个 family 使用，但必须分别经过 family-specific typed mapper；共享 endpoint 或 client 不得使 governance、method、secret、consumer 和 audit 的语义合并。
3. `publishers.rs` 只表示 event collaboration adapter 文件职责，不表示本地 publisher、outbox、relay、attempt、DLQ 或 delivery lifecycle。
4. 适配器不把外部返回的时间、状态文本或 receipt 当作 Capability Hub truth；application 仍使用 `ClockPort`、既有 state transition 和 exact local revision。

### 39.4 本批结构化基线

| surface | 本批目标 | 结果约束 |
|---|---:|---|
| external Port | 9 / 9 | 不新增、不删除、不合并 trait |
| resolver callable | 8 / 8 | source、governance、method、secret、document、consumer 2、audit reference |
| handoff callable | 2 / 2 | traceability、audit export |
| collaboration callable | 4 / 4 | `collaborate`、`get`、`list`、`repair` |
| external binding slots | 9 / 9 | 每个 slot 有唯一 family owner；显式 `Disabled` 才表示不可用 |
| new HLD object / application Port / public protocol / state | 0 | 仅增加 infra assembly prose 和 planned adapter roles |
| local delivery lifecycle / hidden store / TTL / cleanup | 0 | 仍由既有 Step 6~13 禁止矩阵排除 |

## 40. 九个 External Port 的共同装配契约

### 40.1 装配拓扑

```text
CapabilityRuntimeConfig.external_ports()
  -> runtime_builder.rs validates the exact nine slot/family pairs
       -> source_resolvers.rs
       |    -> source / governance / method / secret / document / consumer / audit adapters
       -> handoff_adapters.rs
       |    -> ObservabilityAuditHandoffPort adapter
       -> publishers.rs
            -> CapabilityAccessEventCollaborationPort adapter
  -> apply the already validated external-port timeout and retry wrapper
  -> inject Arc<dyn Port + Send + Sync> into application services/facades
  -> expose only application facades to api / worker / jobs
```

关键说明：

- 图表达的是 startup injection direction，不表达某个 transport 产品、topic、endpoint 或 scheduler。
- `source_resolvers.rs` 的七个 family adapter 必须保留不同 `ApplicationPortKind` 和不同 typed mapper；不能用一个 `resolve(String)` 代替既有 callable。
- `handoff_adapters.rs` 和 `publishers.rs` 不持有 Capability Hub repository，也不在外部 call 前后自行 begin / commit local UoW。
- `api`、`worker`、`jobs` 不根据配置 slot 选择业务 operation；closed operation / event / Job identity仍由 Step 8 contracts 和 application facade决定。

### 40.2 三种 binding 的共同运行规则

| binding | runtime builder 动作 | Port 调用行为 | 失败 / 降级 | profile 限制 |
|---|---|---|---|---|
| `Configured { adapter_ref }` | 按 slot family 解析一个具体 adapter section，并执行 family constructor validation | 调用真实外部协作边界；输入与返回必须经过 typed mapper | 无法形成合法 typed return -> 对应 `PortFailure`；合法 unresolved / unavailable outcome 原样保留 | Local / Integration / Deployment |
| `DeterministicFake { fixture_ref }` | 按 slot family 解析一个 typed fixture；fixture 不进入 application | 返回 deterministic typed observation / outcome；可注入规定的六类 Port failure | fake 不声称真实 external delivery、receipt、evidence 或 acceptance；错误分类与 configured parity | Local / Integration；Deployment reject |
| `Disabled` | 构造 exact disabled implementation，不产生 partial graph | 每个 callable直接返回对应 `ApplicationPortKind + NotConfigured` | 不触发 resolver、handoff、collaboration、Clock、Id、local repository 或成功型 fake fallback | 所有 profile |

`Disabled` 的实现可以共享一个 private no-op mechanism，但不得通过一个无类型 `Box<dyn Any>` 或字符串 family dispatch 返回错误。每个 Port 的 disabled branch必须在编译期或明确的 family implementation中固定其 `ApplicationPortKind`。

### 40.3 共同输入、输出和 failure gate

| boundary | adapter 必须做 | adapter 不得做 |
|---|---|---|
| input validation | 检查 trait 输入的 closed enum/ref、body-free candidate、scope和已验证摘要；必要时拒绝非法组合 | 重新解析 raw config、从字符串猜 kind、放宽 domain constructor或补造缺失 ref |
| serialization | 将 typed input映射为外部协作所需的 implementation-local request；保留 source/ref/schema/digest语义 | 用 `Debug`、`Display`、raw text或不稳定 map order作为 identity；保存或回传 forbidden body |
| response decode | 只接受该 Port family 声明的 typed response；确认必需字段存在且可形成现有 carrier | 用 HTTP status、broker code、SDK message或私有字符串决定业务 state / retryability |
| semantic symmetry | 将可形成的 typed carrier交给 application做 subject / kind / source / intent symmetry check | 把 semantic mismatch 降成 missing、degraded、quarantine 或成功型 outcome |
| timeout | 使用 `CapabilityTimeoutPolicy.external_port_call` 和本次 phase deadline 的较小者 | 将超时写入 domain state、生成新 issue code或延长 whole-operation deadline |
| retry | 只对已分类且 effect boundary 安全的 temporary / timeout调用既有 bounded wrapper | 对 permanent、invalid typed、unexpected、unknown 或不明 effect重复 mutation |
| diagnostics | 只保留 redacted adapter family / safe failure category供Step 15 | 暴露 endpoint、credential、secret、raw response、topic、stack、evidence alias |

共同 failure mapping 固定如下：

```text
Disabled callable
  -> ApplicationError::PortFailure {
       port: exact ApplicationPortKind::<family>,
       failure: ApplicationPortFailureKind::NotConfigured,
     }

Configured/Fake call cannot form declared typed return
  -> ApplicationError::PortFailure {
       port: exact ApplicationPortKind::<family>,
       failure: TemporarilyUnavailable | Timeout | PermanentlyRejected
                 | InvalidTypedResponse | UnexpectedSourceFailure,
     }

Configured/Fake call forms a typed observation/outcome
  -> return the existing typed carrier
  -> application validates input/output symmetry and applies Step 9/12 flow mapping
```

这里的 `::<family>` 是设计表中的闭合 owner 名称，不允许实现者改成 transport 名、URL、产品名或自由字符串。resolver 的合法 `Unresolved / Unavailable`、handoff 的 `Unavailable / Rejected / Retryable`、collaboration 的 `PendingDelivery / Failed / HandoffUnavailable` 都是 typed outcome，不应被上面的 `PortFailure` 重新包装。

### 40.4 共同构造与注入顺序

`runtime_builder.rs` 在 `14.3` 的 local/base graph 之后，按以下顺序装配九个 external Port：

1. 从 `CapabilityRuntimeConfig.external_ports()` 取得九个 named binding，验证 slot 与 family 一一对应。
2. 从 `CapabilityRuntimeTechnicalPolicy.timeouts()` 取得 external call deadline，从 `external_retry()` 取得已验证 bounded policy；不得在 adapter 内读取 raw config。
3. 按 source resolver、handoff、event collaboration 三个文件组构造 family-specific configured adapter、deterministic fake或disabled adapter。
4. 对 configured / fake adapter执行 body-free input/output contract gate；无法证明 stable intent、typed outcome或禁入正文边界时，返回 `InfraError::RuntimeAssembly`，不启动 partial graph。
5. 将九个 exact trait object注入 application services和 `CapabilityEventCollaborationService`；application constructor不接收 binding ref或具体 adapter类型。
6. 只把完成的 application facade交给 API / worker / jobs assembly；Inbound source / schema和Job runner参数由后续批次处理。

任何一个 external slot 构造失败都阻止整个 runtime graph 启动。只有显式 `Disabled` 才是可运行的 unavailable graph；不能把一个失败的 Configured adapter降级成 Disabled或 DeterministicFake。

## 41. Resolver Port 逐项绑定

### 41.1 `ExternalCapabilitySourceReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::ExternalCapabilitySourceReferencePort` |
| concrete owner | `ExternalCapabilitySourceReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.external_source_reference` |
| callable | `resolve_source_reference(subject, source_kind, locator, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、closed `ExternalCapabilitySourceKind`、`ExternalLocatorSummary`、body-free `ReferenceCandidate` |
| allowed output | exact `ReferenceResolutionObservation`，只含 resolution state、candidate / digest 对称所需的 body-free fields |
| forbidden output | MCP tool result、A2A message、API response、provider health、route、quota、cost、execution/session state或source body |
| failure owner | `ApplicationPortKind::ExternalCapabilitySourceReference` |

运行期调用顺序：

```text
application reference flow
  -> validate source kind / locator / candidate ownership
  -> ExternalCapabilitySourceReferencePort::resolve_source_reference(...)
  -> typed observation returned
  -> application checks subject / kind / candidate digest symmetry
  -> existing ReferenceResolutionState transition and local UoW
```

adapter 必须把 MCP、A2A 和 API 的产品差异收敛在 implementation-local mapper中，但不能把三类 source 合成一个可配置字符串分支。外部 source 不可用时可以返回既有 `ReferenceResolutionObservation` 的 unresolved / unavailable surface；只有调用本身无法形成该 observation 才映射 `TemporarilyUnavailable`、`Timeout`、`PermanentlyRejected`、`InvalidTypedResponse` 或 `UnexpectedSourceFailure`。

### 41.2 `GovernanceResultReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::GovernanceResultReferencePort` |
| concrete owner | `GovernanceResultReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.governance_result_reference` |
| callable | `resolve_governance_result_reference(subject, ref_kind, source, scope, candidate) -> Result<GovernanceResultReferenceObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、`GovernanceRefKind`、`GovernanceSourceRef`、`GovernanceResultScopeSummary`、body-free candidate |
| allowed output | `GovernanceResultReferenceObservation { resolution, allowed_safe_summary }`，两个部分必须属于同一 subject / kind / candidate |
| forbidden output | approval、Policy、shared_rules、vote、workflow、governance event body或未经过 safe-summary boundary 的原始字段 |
| failure owner | `ApplicationPortKind::GovernanceResultReference` |

`allowed_safe_summary` 是治理外部 owner明确允许进入 Capability Hub 的安全摘要，不是 approval truth，也不是本地 allow / deny decision。adapter不得根据该摘要自动改变 `GovernanceSeamRelation`；application只依据既有 flow 和 domain policy保存 body-free relation / resolution state。

返回结构若能形成但 `resolution` 与 `allowed_safe_summary` 的 subject、kind或candidate digest不一致，application必须形成既有 `ConsistencyDefect(PortReturn(...), ReferenceObservationShape)`；不能将其当作 `Quarantined` 的业务输入或重新调用另一个 governance resolver。

### 41.3 `MethodAssetReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::MethodAssetReferencePort` |
| concrete owner | `MethodAssetReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.method_asset_reference` |
| callable | `resolve_method_asset_reference(subject, asset_kind, locator, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、`MethodAssetKindSummary`、`MethodLibraryLocator`、body-free candidate |
| allowed output | body-free `ReferenceResolutionObservation`，包含 method asset ref / digest / resolution surface |
| forbidden output | method content、source code、`TaskDefinition`、`AIPolicyDef`、`ProcessTemplateDef`、version body或method lifecycle mutation |
| failure owner | `ApplicationPortKind::MethodAssetReference` |

adapter只能验证 method-library locator 和 candidate 是否可被外部 owner解析。它不能通过 Cargo path dependency读取 method-library domain object，也不能用当前 method body补全本地 relation。合法 unresolved / unavailable仍由既有 reference state处理；typed mapper失败才进入 PortFailure。

### 41.4 `SecretReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::SecretReferencePort` |
| concrete owner | `SecretReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.secret_reference` |
| callable | `resolve_secret_reference(subject, provider_ref, usage_scope, candidate) -> Result<SecretReferenceObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、`ExternalSecretProviderRef`、`SecretUsageScopeSummary`、body-free candidate |
| allowed output | `SecretReferenceObservation { resolution, handling_boundary, exposure_marker }`；不含 secret bytes |
| forbidden output | secret value、ciphertext、token、password、private key、decryption material、rotation state或provider access policy正文 |
| failure owner | `ApplicationPortKind::SecretReference` |

secret adapter 的成功只表示 reference / handling boundary可解析，不表示 capability可以被执行、不表示 credential可被读取，也不表示 formal exposure已批准。任何 secret body scanner violation必须是 `InvalidTypedResponse` 或 `UnexpectedSourceFailure` 的技术失败并阻断当前调用；不得把被拒绝正文转成 safe text继续保存。

### 41.5 `ExternalDocumentReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::ExternalDocumentReferencePort` |
| concrete owner | `ExternalDocumentReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.external_document_reference` |
| callable | `resolve_external_document_reference(subject, document_kind, locator, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、closed `ExternalDocumentKind`、`ExternalDocumentLocatorSummary`、body-free candidate |
| allowed output | body-free resolution observation；descriptor support relation所需的 document ref / digest / state marker |
| forbidden output | OpenAPI、protocol、schema、guide、document正文或通过正文推断的未声明 domain state |
| failure owner | `ApplicationPortKind::ExternalDocumentReference` |

`supported_descriptor_id` 是本地 relation field，不属于 document candidate identity。adapter返回的 observation不得覆盖该 relation；application必须按 Step 9 external-document flow保存 candidate digest、reference state和descriptor relation的既有原子集合。

### 41.6 `CapabilityConsumerReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::CapabilityConsumerReferencePort` |
| concrete owner | `CapabilityConsumerReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.capability_consumer_reference` |
| callable 1 | `resolve_runtime_tools_consumer(subject, consumer_kind, locator, scope, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| callable 2 | `resolve_sdk_consumer(subject, locator, surface, scope, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| allowed input | runtime/tools typed consumer locator or SDK locator/surface/scope；均为 body-free carrier |
| allowed output | consumer boundary reference resolution；不表示 execution authorized |
| forbidden output | invocation、tool result、runtime cache/allowlist、SDK client/binding/package/cache state、marketplace listing或consumer execution result |
| failure owner | `ApplicationPortKind::CapabilityConsumerReference` |

这是一个 Port、一个 slot、一个 adapter，但有两个 family-specific callable。adapter可以共享底层网络 client或fixture，却必须分别校验 RuntimeTools 与 SDK 的 closed input shape；不得增加 `resolve_consumer(String)` 或按 `consumer_kind` 动态构造另一种 public variant。`resolved` 只表示 reference boundary 可解析，不改变 formal exposure、runtime authorization或SDK publication truth。

### 41.7 `ObservabilityAuditReferencePort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::ObservabilityAuditReferencePort` |
| concrete owner | `ObservabilityAuditReferenceAdapter`，文件 `crates/infra/src/source_resolvers.rs` |
| runtime slot | `CapabilityExternalPortBindings.observability_audit_reference` |
| callable | `resolve_observability_audit_reference(subject, material_kind, locator, candidate) -> Result<ReferenceResolutionObservation, ApplicationError>` |
| allowed input | `ReferenceSubjectRef`、`AuditMaterialKind`、`AuditMaterialLocatorSummary`、body-free candidate |
| allowed output | body-free audit / observability reference resolution observation |
| forbidden output | raw log、span、trace、metric series、alert、audit event、GRC body、evidence alias或验收签署 |
| failure owner | `ApplicationPortKind::ObservabilityAuditReference` |

该 adapter 与 `ObservabilityAuditHandoffPort` 必须是两个独立 concrete owner。reference resolver只解析 candidate / locator；handoff adapter只接收已经存在的 exact trace / export ref。不得让 reference resolver调用 handoff、不得让 handoff adapter反查 reference repository，也不得把外部 audit receipt当成本仓 evidence或验收事实。

## 42. Handoff 与 Event Collaboration Port 逐项绑定

### 42.1 `ObservabilityAuditHandoffPort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::ObservabilityAuditHandoffPort` |
| concrete owner | `ObservabilityAuditHandoffAdapter`，文件 `crates/infra/src/handoff_adapters.rs` |
| runtime slot | `CapabilityExternalPortBindings.observability_audit_handoff` |
| callable 1 | `handoff_traceability(traceability_ref, audit_ref, handoff_scope) -> Result<CapabilityAuditHandoffOutcome, ApplicationError>` |
| callable 2 | `handoff_audit_export(export_ref, audit_ref, handoff_scope) -> Result<CapabilityAuditHandoffOutcome, ApplicationError>` |
| allowed input | exact `CapabilityAccessTraceabilityRecordRef` 或 `AuditFriendlyExportSummaryRef`、validated `ObservabilityAuditRefId`、body-free `CapabilityAuditHandoffScope` |
| allowed output | `CapabilityAuditHandoffOutcome`；`audit_ref_id` 必须等于输入，disposition / receipt / reason 必须满足既有 outcome invariant |
| forbidden input/output | trace/export body、raw log/span/metric/alert、audit event body、evidence alias、验收签署、repository handle或未验证 audit ref |
| failure owner | `ApplicationPortKind::ObservabilityAuditHandoff` |

装配与调用顺序：

```text
RecordTraceabilityHandoffSummary application flow
  -> local resolver-first validation of exact trace/export ref + audit ref
  -> local UoW appends the accepted HandoffPending / partial revision
  -> local commit is durable
  -> ObservabilityAuditHandoffPort::handoff_traceability(...) or handoff_audit_export(...)
  -> application validates outcome.audit_ref_id and disposition shape
  -> local trace/export truth remains authoritative
```

`ObservabilityAuditHandoffAdapter` 不反查 `CapabilityTraceabilityRepository`、`CapabilityDerivedMaterialRepository` 或 `CapabilityExternalReferenceRepository`。它接收的是 application 已经验证的 exact ref 和 safe scope；若外部系统需要更多内容，adapter 只能使用其 implementation-local external lookup，不得把本仓 body 复制到 Port 参数或本地存储。

| typed result / adapter error | application 处理 | 自动重试 |
|---|---|---|
| `Accepted` + receipt ref + no reason | 作为 external handoff observation；不生成本地 evidence / acceptance sign-off | 不因成功重复调用 |
| `Unavailable` + reason | 保留本地 pending / partial trace/export revision；由既有 Query / Job surface表达 | 仅当该 outcome明确允许后续 external repair，且不重复 local mutation |
| `Rejected` + reason | 保留本地 truth，按既有 handoff issue mapping形成稳定边界结果 | 否；修正 owner / scope / config 后用新请求身份处理 |
| `Retryable` + reason | 保留本地 truth，交给既有 handoff follow-up边界 | 仅按 typed outcome 与 effect-boundary policy；本批不定义次数 |
| raw temporary / timeout before typed outcome | `ApplicationError::PortFailure` with `TemporarilyUnavailable` / `Timeout` | 仅在 external effect 未被接受且 wrapper 可证明安全时 |
| raw permanent / invalid / unexpected | exact `PortFailure` class | 否 |
| returned outcome audit ref mismatch / invalid receipt-reason shape | `ConsistencyDefect` 或既有 typed contract error | 否；adapter/operator repair |

external handoff 的 receipt 不是 Capability Hub 的验收证据。即使 `Accepted`，也只能说明外部 handoff boundary 返回了合法 typed receipt；本仓不新增 evidence alias、签署状态或 audit body owner。

### 42.2 `CapabilityAccessEventCollaborationPort`

| 项 | 绑定结论 |
|---|---|
| trait owner | `application::ports::CapabilityAccessEventCollaborationPort` |
| concrete owner | `CapabilityAccessEventCollaborationAdapter`，文件 `crates/infra/src/publishers.rs` |
| runtime slot | `CapabilityExternalPortBindings.access_event_collaboration` |
| callable 1 | `collaborate(candidate: CapabilityEventCollaborationCandidateSurface) -> Result<CapabilityEventCollaborationOutcome, ApplicationError>` |
| callable 2 | `get(intent_ref: &CapabilityEventCollaborationIntentRef) -> Result<Option<CapabilityEventCollaborationItem>, ApplicationError>` |
| callable 3 | `list(scope: CapabilityEventCollaborationScanScope, page: CapabilityRepositoryPageRequest) -> Result<CapabilityRepositoryPage<CapabilityEventCollaborationItem>, ApplicationError>` |
| callable 4 | `repair(intent_ref: &CapabilityEventCollaborationIntentRef) -> Result<CapabilityEventCollaborationOutcome, ApplicationError>` |
| allowed input | `collaborate` 只能接收从 official immutable snapshot 构造的 candidate；`get/list/repair` 只能接收 stable intent / typed scan scope / repository page request |
| allowed output | `CapabilityEventCollaborationOutcome`、`CapabilityEventCollaborationItem`或 typed page；source、intent、status、reason必须对称 |
| forbidden surface | local outbox、relay、DLQ、attempt log、delivery retry counter、topic/consumer-group truth、payload重建、current truth回查或外部正文保存 |
| failure owner | `ApplicationPortKind::CapabilityAccessEventCollaboration` |

#### 42.2.1 `collaborate` candidate boundary

```text
CapabilityEventCaptureRepository::get_with_snapshot(capture_ref)
  -> validate capture/snapshot source + schema + digest + captured-time tuple
  -> CapabilityEventCollaborationCandidateSurface::try_from_stored_capture(...)
  -> CapabilityAccessEventCollaborationPort::collaborate(candidate)
  -> validate outcome.source == candidate.source
  -> bind the stable intent through the application-owned short local UoW
```

adapter 不得从 `CapabilityIdentity`、`CapabilityChangeRecord`、`CapabilityTraceabilityRecord`、registry、descriptor、governance、method、secret、consumer或audit repository重新形成 candidate。snapshot bytes、schema和digest已经是 candidate 的 identity material；adapter不得重新序列化、修改字段顺序或使用 transport envelope 替换 stored bytes。

成功返回的 `CapabilityEventCollaborationOutcome` 必须通过既有 `try_new(source, intent_ref, status, reason)` 语义构造：

- `Candidate`、`PendingDelivery`、`Delivered` 不带 reason。
- `Failed`、`HandoffUnavailable` 必须带 body-free `ChangeReason`。
- `source` 必须等于 candidate source；`intent_ref` 必须稳定，重复同一 source/schema/digest/bytes 不能创建第二 intent。

#### 42.2.2 `get`、`list` 与 `repair` boundary

| callable | application 使用时机 | adapter 必须保证 | 禁止行为 |
|---|---|---|---|
| `get` | `IntentBound` capture reentry、planned external-intent Job target | exact intent lookup；返回 item 的 source / intent / outcome 对称 | 从 current truth重建 item；把 missing item当 Delivered；返回 payload/body |
| `list` | 仅 repair inspection / typed external scan boundary | stable typed page；scope/page identity不被transport offset替换 | 作为 local capture recovery authority；创建 local status或按错误文本筛选 |
| `repair` | `PendingDelivery`、`Failed`、`HandoffUnavailable` 的 same-intent继续协作 | 保持同一 intent；返回合法 typed status，不创建第二 intent | 对 `Candidate`/`Delivered`创建第二 delivery；修改 source truth或capture state |

`get` / `list` 的结果是 external owner 的观察面，不是本地 repository。local pre-intent recovery 只能通过 `CapabilityEventCaptureRepository::list(AwaitingIntent)`；不能因为 collaboration `list` 返回空页就推断 local capture 不存在。

#### 42.2.3 collaboration status 与 local state 分离

| external `EventCollaborationStatus` | 归属 | Capability Hub 本地动作 |
|---|---|---|
| `Candidate` | external Port owner | 对 `Captured` candidate 可继续 `collaborate`；不写 local delivery state |
| `PendingDelivery` | external Port owner | 可由 `repair` / Job continuation继续；capture只保留 `Captured` 或已绑定 intent |
| `Delivered` | external Port owner | `IntentBound` capture保持不变；不改写为 local Delivered |
| `Failed` | external Port owner | 保留 typed reason，允许 same-intent repair；不回滚 source truth |
| `HandoffUnavailable` | external Port owner | 保留 typed reason，允许 same-intent repair；不生成 local DLQ / attempt record |

`CapabilityEventCaptureState` 仍只有 local `Captured -> IntentBound` 语义；external status 不进入 capture、source Command result、Inbound receipt或Job journal作为本地 state。Job report 可以复制 external typed status作为 `CapabilityCollaborationStatusView`，但该 view 仍是外部观察快照，不是本地 delivery authority。

#### 42.2.4 collaboration failure / retry matrix

| branch | required mapping | retry / recovery |
|---|---|---|
| `Disabled` | exact `PortFailure(CapabilityAccessEventCollaboration, NotConfigured)` | 不自动切换 fake；repair需显式恢复 binding后再调用 |
| configured/fake returns valid `Candidate/PendingDelivery/Delivered/Failed/HandoffUnavailable` | return typed outcome；application先验证 source/intent/status/reason shape | typed status按既有 flow；不把 Failed 转成 ApplicationError |
| raw `TemporarilyUnavailable` / `Timeout` before outcome | `PortFailure` with exact safe class | only same stored candidate/intent and proven no accepted external effect；使用 bounded external policy |
| raw `PermanentlyRejected` | `PortFailure(PermanentlyRejected)` | owner/config repair；不得重复 mutation |
| invalid typed response | `PortFailure(InvalidTypedResponse)` | adapter repair；不得猜 status或intent |
| unexpected source failure | `PortFailure(UnexpectedSourceFailure)` | operator/adapter repair；不得文本分类 |
| outcome source/intent mismatch | `ConsistencyDefect(PortReturn(...), CollaborationOutcomeShape)` | capture保持 `Captured` 或 Job target保持 `Planned`；exact reentry，不重建candidate |
| local bind CAS / commit failure after valid outcome | existing local transaction / commit error | external intent may already exist；reentry用同一 stored candidate或exact intent；不得创建第二 intent |

### 42.3 Handoff / collaboration 的 fake parity

`DeterministicFake` 不是“永远成功”的 stub。每个 fake 必须能够构造与 configured adapter 相同的合法 typed carrier、输入输出不对称、disabled和六类安全 Port failure fixture；同时必须模拟以下 owner boundary：

| parity axis | required fake behavior | forbidden shortcut |
|---|---|---|
| body-free input | 拒绝 method/governance/secret/audit/event正文和不完整 candidate | 为测试方便接受 `String` / `serde_json::Value` 任意 body |
| source / intent symmetry | same candidate produces stable same source / intent semantics；item与outcome对称 | 每次调用生成随机 intent；忽略 source字段 |
| handoff outcome | accepted必须有 receipt，非accepted必须有 reason | `Ok(())`、空 receipt或无reason failure |
| collaboration status | 五种既有 external status均可按fixture形成，repair保持同intent | fake只返回 Delivered或把Failed转error |
| local side effect | fake不写 Capability Hub truth、capture、journal或local delivery map | private fake outbox / attempt table成为测试依据 |
| retry injection | temporary/timeout可注入且可验证 effect未接受；permanent/invalid/unexpected不可被retry wrapper吞掉 | 所有error统一变 temporary或sleep后重试 |
| disabled behavior | exact PortFailure(NotConfigured) | disabled返回empty success / fake success |

本 parity 表只定义设计义务，不声称已执行任何 fake、contract、integration或recovery测试。

### 42.4 14.4.1 三层失败边界

```text
startup binding / constructor failure
  -> InfraError::RuntimeAssembly

external call before a valid typed carrier
  -> ApplicationError::PortFailure(exact Port + safe failure class)

valid typed resolver / handoff / collaboration carrier
  -> existing typed outcome
  -> application symmetry / state / issue mapping

loaded persisted or returned carrier is asymmetric
  -> ApplicationError::ConsistencyDefect
```

这四层不能互换：不能把 startup 缺失伪装成业务 `NotConfigured` 调用结果，也不能把 typed `Failed` status包装成 technical error；反过来，不能把 malformed returned carrier降成业务 `Failed` item或 `Degraded` surface。

## 43. Batch `14.4.1` 覆盖矩阵与构造审计

### 43.1 九个 external Port 覆盖矩阵

| # | external Port | binding slot | concrete owner | callable 数 | valid typed surface | disabled mapping | retry eligibility |
|---:|---|---|---|---:|---|---|---|
| 1 | `ExternalCapabilitySourceReferencePort` | `external_source_reference` | `infra::source_resolvers::ExternalCapabilitySourceReferenceAdapter` | 1 | `ReferenceResolutionObservation` | `ExternalCapabilitySourceReference + NotConfigured` | raw temporary / timeout only after no accepted effect proof |
| 2 | `GovernanceResultReferencePort` | `governance_result_reference` | `infra::source_resolvers::GovernanceResultReferenceAdapter` | 1 | `GovernanceResultReferenceObservation` | `GovernanceResultReference + NotConfigured` | raw temporary / timeout only; typed unresolved remains outcome |
| 3 | `MethodAssetReferencePort` | `method_asset_reference` | `infra::source_resolvers::MethodAssetReferenceAdapter` | 1 | `ReferenceResolutionObservation` | `MethodAssetReference + NotConfigured` | raw temporary / timeout only |
| 4 | `SecretReferencePort` | `secret_reference` | `infra::source_resolvers::SecretReferenceAdapter` | 1 | `SecretReferenceObservation` | `SecretReference + NotConfigured` | raw temporary / timeout only; body/shape failure never retries |
| 5 | `ExternalDocumentReferencePort` | `external_document_reference` | `infra::source_resolvers::ExternalDocumentReferenceAdapter` | 1 | `ReferenceResolutionObservation` | `ExternalDocumentReference + NotConfigured` | raw temporary / timeout only |
| 6 | `CapabilityConsumerReferencePort` | `capability_consumer_reference` | `infra::source_resolvers::CapabilityConsumerReferenceAdapter` | 2 | `ReferenceResolutionObservation` for runtime/tools and SDK | `CapabilityConsumerReference + NotConfigured` for both methods | raw temporary / timeout only; no execution retry |
| 7 | `ObservabilityAuditReferencePort` | `observability_audit_reference` | `infra::source_resolvers::ObservabilityAuditReferenceAdapter` | 1 | `ReferenceResolutionObservation` | `ObservabilityAuditReference + NotConfigured` | raw temporary / timeout only |
| 8 | `ObservabilityAuditHandoffPort` | `observability_audit_handoff` | `infra::handoff_adapters::ObservabilityAuditHandoffAdapter` | 2 | `CapabilityAuditHandoffOutcome` | `ObservabilityAuditHandoff + NotConfigured` | only safe raw temporary / timeout; typed `Retryable` follows existing handoff surface |
| 9 | `CapabilityAccessEventCollaborationPort` | `access_event_collaboration` | `infra::publishers::CapabilityAccessEventCollaborationAdapter` | 4 | `CapabilityEventCollaborationOutcome`, item, or typed page | `CapabilityAccessEventCollaboration + NotConfigured` for all methods | only same-candidate / same-intent safe temporary / timeout |

The matrix is an assembly index, not a new type inventory. The exact trait signatures remain owned by Step 7 §14, and the application call order remains owned by Step 9. A concrete adapter may use shared implementation-local client material, but the nine rows cannot be collapsed into one generic Port or one string-selected response decoder.

### 43.2 Constructor and injection contract

| construction stage | required input | output | failure gate |
|---|---|---|---|
| slot selection | immutable `CapabilityRuntimeConfig.external_ports()` and exact slot identity | one validated `CapabilityExternalAdapterBinding` per Port | missing slot, wrong family, unresolved section or profile mismatch -> `InfraError::RuntimeAssembly` |
| family constructor | resolved adapter material or typed fixture for one family; external-call timeout wrapper; bounded retry policy | one family-specific concrete adapter | constructor cannot prove body-free / typed contract -> `InfraError::RuntimeAssembly`; no partial graph |
| disabled constructor | no external client; fixed family marker | exact disabled implementation of the selected trait | disabled implementation must preserve exact `ApplicationPortKind`; no success fallback |
| trait-object injection | concrete adapter converted to `Arc<dyn Port + Send + Sync>` | application service / facade graph | object-safe composition failure blocks startup; application must not receive concrete adapter or config ref |
| entry exposure | completed application facade only | API / worker / jobs runner dependency | entry must not receive resolver, handoff, publisher, repository or raw config handle |

The external-call wrapper owns deadline clipping and bounded attempt policy. It receives already validated technical policy from the builder; it does not classify raw failures by sleeping, status text, or elapsed time. A wrapper cannot turn `CommitOutcomeUnknown` into an external retry, because commit observation and external mutation have different authorities.

### 43.3 Callable coverage audit

| callable family | expected | covered in §§41~42 | missing |
|---|---:|---:|---:|
| source resolver | 1 | 1 | 0 |
| governance resolver | 1 | 1 | 0 |
| method resolver | 1 | 1 | 0 |
| secret resolver | 1 | 1 | 0 |
| external document resolver | 1 | 1 | 0 |
| runtime/tools + SDK consumer resolver | 2 | 2 | 0 |
| observability/audit resolver | 1 | 1 | 0 |
| traceability + audit export handoff | 2 | 2 | 0 |
| collaborate / get / list / repair | 4 | 4 | 0 |
| **total** | **14** | **14** | **0** |

No callable is represented by an abbreviated “same as resolver” row. `get`, `list` and `repair` have separate recovery authority and status rules, and the two consumer methods retain distinct typed input families even though they share one Port and slot.

## 44. Cross-step Closure and Historical Audit for `14.4.1`

### 44.1 Truth-source and phase closure

| contract seam | authoritative owner | `14.4.1` binding | prohibited shortcut |
|---|---|---|---|
| external reference candidate identity | application/domain candidate + Step 13 digest | resolver adapter accepts candidate and returns typed observation; application performs symmetry check | adapter invents candidate digest or rebuilds from external body |
| governance approval / Policy truth | external governance owner | only body-free result ref and allowed safe summary cross the Port | local approval, allow/deny decision, policy body or auto-approval config |
| method asset truth | `quantalithos-method-library` owner | body-free method ref / locator observation | Cargo dependency, method body copy or lifecycle mutation |
| secret truth | external security owner | ref, handling boundary and exposure marker only | secret value, ciphertext, token or KMS/Vault lifecycle |
| consumer execution | runtime/tools/SDK owners | consumer boundary ref resolution only | invocation, tool result, SDK client/cache or authorization claim |
| observability / audit material | external observability/audit owner | body-free ref resolution or post-commit handoff | raw log/span/metric/audit body, evidence alias or acceptance sign-off |
| local access truth | Capability Hub local UoW and repositories | external calls occur around the declared local phase | external call joins local commit or external failure rolls back committed truth |
| event collaboration delivery | external collaboration Port | local snapshot/capture and stable intent binding remain local; status remains external | local outbox, relay, attempt/DLQ, delivery TTL or status copy |

### 44.2 Historical-material pollution audit

| historical material | conflict found | current handling |
|---|---|---|
| old `ProviderContract` / provider client | mixes route, quota, cost, secret and invocation | excluded; source adapter only resolves body-free source reference |
| old KMS/Vault configuration | implies secret body ownership and rotation lifecycle | excluded; only `SecretReferencePort` safe boundary remains |
| old runtime/tools access gateway | turns registry lookup into execution authorization | excluded; consumer resolver returns boundary ref only |
| old governance policy refresh | imports approval / Policy truth | excluded; governance result ref and safe summary only |
| old method body loading | imports method-library body | excluded; method asset relation remains body-free |
| old publisher/outbox/topic/relay | creates local delivery lifecycle | excluded; `publishers.rs` is external collaboration adapter only |
| old marketplace listing / SDK package | creates downstream product truth | excluded; consumer refs and ecosystem material remain read-only boundaries |
| old audit evidence / acceptance claims | fabricates evidence or sign-off | excluded; handoff receipt is not evidence or acceptance |

### 44.3 Blocker and debt result

| item | status after `14.4.1` | handling |
|---|---|---|
| unresolved upstream blocker | `0` | all nine Port contracts and typed outcome owners are available; no upstream document must be changed for this batch |
| `CH-DDD-S14-AUTHORITATIVE-READ-001` | resolved for local graph; not applicable to external Port ownership | external calls never replace local authority; concrete product inability to honor the existing boundary remains a later product blocker |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non-blocking | no accessor or byte semantics changed |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non-blocking | no new public wire type or serializer commitment added |
| target implementation repository absent | non-blocking design prerequisite | implementation phase must check `/home/aris/Projects/quantalithos-capability-hub`; this batch does not claim it exists |

## 45. Structure Comment Gate, Formal Handoff and Stop Review

### 45.1 Rust declaration comment gate

This batch adds no Rust declaration, public protocol type, HLD object, application helper, Port, state or persisted field. The adapter names in §§41~43 are planned implementation roles, not claims that source declarations already exist.

When implementation materializes any planned adapter or wrapper as Rust, the following are mandatory before the corresponding boundary can be marked implemented:

- every `struct` and `enum` receives an English `///` Rustdoc describing its ownership and boundary;
- every struct field, tuple field, enum variant and variant payload receives its own English `///` comment;
- every constructor, mapper, timeout/retry wrapper, disabled callable and adapter method receives an English `///` comment with parameter, return and side-effect semantics;
- no public protocol carrier or external outcome field may be introduced without reopening Step 6/7/8 and synchronizing the active cardinality baseline.

### 45.2 Formal `03` §13 assembly source

Step 19 must use this batch for the external portion of formal §13. The formal chapter must retain the following implementation-critical statements:

1. Nine named external Port slots are total in the runtime graph; explicit `Disabled` is the only intentional unavailable representation.
2. Seven resolver Port families live in `source_resolvers.rs`, handoff lives in `handoff_adapters.rs`, and event collaboration lives in `publishers.rs`; application owns the traits and infra owns concrete adapters.
3. Valid resolver observations, handoff outcomes and collaboration outcomes remain typed non-error surfaces. A Port failure is used only when a valid typed return cannot be formed.
4. Only `TemporarilyUnavailable` and `Timeout` can enter a bounded retry after effect-boundary proof. Permanent, invalid, unexpected, consistency, codec and commit-unknown classes do not receive automatic mutation retry.
5. Handoff and collaboration are external effects outside local UoW. Local capture/snapshot, trace/export revisions and stored results retain their existing authority; external failure never rolls back committed local truth.
6. Capability Hub does not own runtime execution, tools execution, marketplace listing, governance approval, method body, secret body, SDK client/package/cache, local outbox, relay, DLQ, delivery attempt state or audit evidence.

### 45.3 Batch self-check and stop gate

| gate | result | source / reason |
|---|---|---|
| nine external Port slots covered | pass | §43.1, 9 / 9 named slot-to-owner rows |
| resolver callable coverage | pass | §43.3, 8 / 8 |
| handoff callable coverage | pass | §43.3, 2 / 2 |
| collaboration callable coverage | pass | §43.3, 4 / 4 |
| configured / fake / disabled binding | pass | §40.2 and §43.2; no silent fallback |
| six-class Port failure mapping | pass | §§40.3, 42.1, 42.2.4; no raw text/status classification |
| typed outcome / consistency separation | pass | §§40.3, 42.4; malformed carrier is not business failure item |
| timeout / retry owner | pass | `CapabilityRuntimeTechnicalPolicy` only; no numeric values invented |
| local truth / external effect phase boundary | pass | §§42.1~42.2 and §44.1 |
| forbidden body and old-mainline pollution audit | pass | §44.2; no provider/runtime/governance/method/secret/marketplace leakage |
| Rustdoc gate | pass for design artifact | no new declaration; implementation obligation explicit in §45.1 |
| formal `03`, `04`, implementation ledger, boundary skeleton | unchanged | formal assembly remains Step 19; implementation artifacts remain Step 17/`07` |
| tests, run ids, evidence, acceptance sign-off, commit | not claimed | design-only batch; no execution evidence generated |
| unresolved upstream blocker | `0` | no current blocker |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.4.1
gate_status = 03_step_14_batch_14_4_1_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
external_ports_bound = 9/9
resolver_callables_bound = 8/8
handoff_callables_bound = 2/2
collaboration_callables_bound = 4/4
local_base_ports_bound = 27/27
repository_methods_bound = 110/110
local_persistence_authority_count = 1
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_4_2
```

Batch `14.4.1` completed and stops for review. The next batch, after explicit user confirmation, is `14.4.2`: bind the six Inbound Event Consumers to source/schema/worker entry boundaries. Do not bind Outbound Event families or Operations Jobs in the next batch, and do not modify formal `03-详细设计.md`.

---

## 46. Batch `14.4.2` 开工输入、SOP 回答与取舍

### 46.1 本批读取门禁

本批只承接 Step 8 §§9.3~9.8 的六条 Inbound protocol、Step 9 §§29.1~29.6 的六条函数级 flow、Step 12 §§34~35 的 disposition / error / recovery 语义、Step 13 的 event-derived normalized key与typed receipt replay，以及本文件 §26 的 header-first codec。它不读取或绑定十条 Outbound、八条 Operations Job、完整跨仓 dependency matrix或完整 runtime builder。

| 输入 | 已确认事实 | `14.4.2` 必须闭合 | 本批不得改变 |
|---|---|---|---|
| Step 8 §9 | 六个closed consumer、六个source family、六个logical event name、schema `1`、worker handler和application callable均已存在 | 每个slot绑定exact feed、trusted actor、logical dispatch arm和application facade | 不新增第七个consumer、generic event DTO或string dispatcher |
| Step 9 §29 | 五条reference flow和一条downstream feedback flow均只通过application写入其声明的local atomic set | worker只负责header gate、typed decode、context mapping、facade call和receipt-to-runtime action | 不让worker持有repository、resolver、UoW、stored result、Clock、IdGenerator或publisher adapter |
| Step 12 §§34~35 | `Accepted / DuplicateReplayed / Ignored / Rejected / UnsupportedSchema`不要求processing retry；`Delayed`要求same-event retry；`Quarantined`要求隔离 | 固定product-neutral processing action；保留technical `ApplicationError / WorkerError`边界 | 不选择broker ack/nack API、numeric code、DLQ product或新的retry taxonomy |
| Step 13 | application key来自closed operation + source family + public source-event ref；source key只进digest；duplicate只读typed receipt | transport metadata不得进入identity/key；source runner只把原始envelope bytes交给header-first dispatcher | 不从topic/group/partition/offset/attempt或payload推导event identity |
| §23 / §26 | Worker已有byte/batch/parallelism/deadline参数与borrowed `RawValue` header gate | 把六个source binding与parameters聚合为`CapabilityWorkerEntryBinding`并定义builder消费顺序 | 不把config ref传入worker，不复制payload，不建立second header carrier |

### 46.2 SOP 八问在本批的回答

| SOP问题 | `14.4.2`裁决 |
|---|---|
| 哪些模块读取配置? | 只有`infra/config.rs`解析/校验六个source slots，`infra/runtime_builder.rs`消费validated refs并构造runner。`worker::consumers`不读取root或ref，只接收已构造runner、public parameters和application facade。 |
| 配置项类型、默认与读取位置? | `CapabilityInboundSourceBinding`每槽必须显式为`Configured { feed_ref, trusted_actor_ref }`、`DeterministicFake { fixture_ref }`或`Disabled`；本Step不授权隐式默认。raw key、source precedence和具体feed产品留`04`。 |
| 哪些外部依赖经adapter/event注入? | 六条source feed是worker-side runtime/event dependency，不是application Port，也不是Cargo sibling dependency。configured feed由infra source constructor解析；trusted actor作为独立authority注入runner gate。 |
| 超时、重试、降级? | source fetch/delivery的物理deadline与redelivery参数留`04`；application call使用既有`inbound_call_timeout`。只有typed `Delayed`进入same-event transport retry；quarantine隔离，其他typed terminal receipt不要求processing retry。 |
| 哪些细节留`04`? | feed kind、topic/subscription/group、credential/TLS、poll/stream API、ack/nack/quarantine target、delivery deadline、redelivery/backoff数值、fixture source和startup source compatibility matrix。 |
| 跨仓Rust path dependency? | 本批为零；六条source contract通过本仓public event DTO、runtime/event binding或fixture表达。governance、method-library、runtime/tools/SDK、MCP/A2A/API、observability/audit和external-document仓均不得进Cargo。 |
| 运行期/event/fake如何表达? | 每个consumer是一个named slot；configured source与typed fake都必须输出相同encoded envelope并经过同一byte limit、header-first、actor/family/schema和negative-boundary路径。`Disabled`使该runner不进入运行图。 |
| 依赖不存在时怎么办? | Local/Integration可显式选择typed deterministic fixture；Deployment不得fake。缺少真实feed或trusted actor contract时对应slot必须`Disabled`或startup失败，不得静默fallback、伪造success或私造sibling DTO。 |

### 46.3 设计取舍

| 议题 | 候选 | 当前裁决 | 原因 |
|---|---|---|---|
| source schema | generic `Vec<SourceBinding>` + runtime string name；六个named fields | 六个named fields | 编译期体现6/6 closed inventory，避免重复、遗漏和第七协议注入 |
| actor authority | actor pattern嵌入topic/feed ref；独立trusted actor ref | 独立`CapabilityTrustedActorConfigRef` | source transport与身份授权是不同authority；topic名称不能替代actor gate |
| fake入口 | fake直接调用application DTO；fake提供encoded envelope | fake提供encoded envelope并走同一dispatcher | 必须覆盖byte/header/schema/actor/payload/body boundary，不允许fake绕过negative path |
| disabled语义 | 构造一个返回success/no-op的runner；从运行图移除 | 从运行图移除 | 未消费不是已成功处理；不得生成receipt、ack成功、offset advance或local effect |
| runtime action | 在contracts新增ack enum；worker-local product-neutral decision | 使用既有receipt/error形成worker-local processing action，不新增public protocol | ack是entry/runtime交接，不是跨仓业务协议；physical mapping留`04` |

本批没有发现需要回开 Step 4~13 的上游缺口。`CapabilityInboundSourceBinding`、`CapabilityInboundSourceBindings`和`CapabilityWorkerEntryBinding`均为infra-local assembly declarations，不改变43+7 objects/helpers、36 Ports、22/110 repository traits/methods、250 public types、83 protocols/flows或24/111/638 state baseline。

## 47. Worker Source Binding Schema 与装配拓扑

### 47.1 配置、builder与worker的消费顺序

```text
CapabilityRuntimeConfig::try_from_candidate
  -> validate entry == Worker <=> CapabilityEntryParameters::Worker(...)
  -> validate six named CapabilityInboundSourceBinding slots
  -> validate profile / feed section / trusted actor section / fixture family
  -> CapabilityWorkerEntryBinding
       parameters
       inbound_sources[6 named slots]
  -> infra::runtime_builder
       for each Configured slot:
         resolve feed_ref -> concrete encoded-envelope feed
         resolve trusted_actor_ref -> immutable actor matcher
         invoke the worker-binary-supplied runner factory with the fixed consumer/family/schema contract
       for each DeterministicFake slot:
         resolve fixture_ref -> deterministic encoded-envelope feed
         invoke the same worker-owned runner factory and header-first dispatcher path
       for each Disabled slot:
         construct no runner and register no source task
       consume and drop all config refs
  -> worker entry
       CapabilityWorkerEntryParameters
       zero to six already constructed source runners
       one closed header-first dispatcher / CapabilityInboundEventHandlers implementation
       CapabilityInboundConsumerService facade
  -> runtime-specific receipt/error action mapper
```

The builder must finish every enabled source constructor before any worker task starts. A configured source-construction failure is `InfraError::RuntimeAssembly`;it does not start the remaining subset. `Disabled` is the only intentional source absence and is not a construction failure. The worker receives neither `CapabilityRuntimeConfig` nor any feed/actor/fixture config ref, and no runner may perform config lookup or adapter discovery after startup.

This assembly must preserve the Step 5 crate direction: `capability-hub-infra` does not import `capability-hub-worker`. The Worker binary supplies the runner factory at composition time;the infra builder resolves feed/actor/fixture material, invokes that factory through a cycle-free generic or callback boundary, and returns the completed Worker entry graph. Batch `14.5` must write the exact factory/builder signature and member dependency matrix. It may not solve the cycle by exposing config refs to Worker, moving consumer dispatch into infra, or adding an eighth assembly crate.

### 47.2 Source runner constructor contract

Each enabled runner is a concrete worker/infra assembly object rather than a new application Port. Its implementation name may be product-specific in `04`, but its constructor inputs and runtime obligations are fixed here.

| Constructor input | Source | Runtime use | Forbidden use |
|---|---|---|---|
| exact closed consumer identity | compile-time slot, not raw string | selects one of six dispatch arms and the exact handler callable | dynamic registration, string match fallback, seventh consumer |
| exact source family | compile-time slot mapping | validates header before payload decode | derive fromtopic/feed/actor/payload |
| accepted protocol schema | fixed `CapabilityProtocolSchemaVersion(1)` | supports only payload schema `1`;other header value forms existing `UnsupportedSchema` receipt | treating config schema v1 as event schema or using config to enable a second payload schema |
| encoded-envelope feed | resolved `feed_ref` or fixture | yields one bounded byte sequence plus runtime-private delivery handle | adding broker offset/group/attempt to public/application DTO or identity |
| trusted actor matcher | resolved `trusted_actor_ref` or fixture-owned equivalent | validates source actor against exact family-specific authority | trusting actor display name、topic、credential name或payload field |
| body/fetch/parallelism/timeouts | `CapabilityWorkerEntryParameters` | bounds allocation, independent source tasks and facade call | changing protocol/business disposition or concurrent phases of one event/UoW |
| dispatcher / facade | worker-owned handler + application service facade | exact typed decode/context mapping/application call | repository/resolver/UoW/stored-result/publisher direct access |

The physical feed implementation may retain endpoint、credential、subscription and delivery handle required by its transport, but only inside the resolved source runner. It must never expose those values to contracts/domain/application, receipt, issue, log field, digest, source-event identity or stable test/evidence identity.

### 47.3 Runtime action vocabulary and callable boundary

`14.4.2` fixes a product-neutral worker processing decision, not a new public protocol type. The worker crate must materialize the following private enum and mapper with the same Step 12 meanings and English Rustdoc gate:

```rust
/// Worker-private processing decision awaiting physical transport mapping.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum CapabilityInboundProcessingAction {
    /// Processing is complete and requires no application-level retry.
    Complete,
    /// The same source event identity must enter the transport retry boundary.
    RetrySameEvent,
    /// The delivery must be isolated from automatic replay.
    Quarantine,
}

impl CapabilityInboundProcessingAction {
    /// Validates the expected consumer and event identity, then maps one typed receipt.
    pub(crate) fn try_from_receipt(
        expected_consumer: &CapabilityInboundConsumerName,
        expected_source_event_ref: &CapabilitySourceEventRef,
        receipt: &CapabilityInboundEventReceipt,
    ) -> Result<Self, WorkerError>;
}
```

This worker-private carrier is not added to Step 8 public type count and must not be serialized or persisted by Capability Hub. The runner returns the typed receipt or `WorkerError` together with this runtime-local decision through the physical adapter boundary selected in `04`;the exact transport callable shape depends on the selected library and therefore is not fixed here. Regardless of product API, mapping must be exhaustive on the existing receipt disposition and must never parse issue text.

### 47.4 Validation and assembly matrix

| Binding branch | Startup validation | Assembled graph | Invocation behavior |
|---|---|---|---|
| `Configured` | exact feed section + exact trusted-actor section exist,match this slot family,profile permits configured source | one runner with concrete feed and immutable actor matcher | every delivery traversesbyte/header/actor/family/schema/typed payload/application gates |
| `DeterministicFake` | exact fixture section exists,fixture is owned by this slot and profile isLocal/Integration；deliberate wrong-family/actor/schema/body cases must be marked as negative fixtures rather than supported mappings | one runner backed by deterministic encoded envelopes | same dispatcher and negative paths as configured source；no direct DTO/facade injection and no seventh supported protocol |
| `Disabled` | explicit variant present；no dangling feed/actor/fixture ref | no runner/task/subscription for this slot | no fetch、decode、application call、receipt、processing action orfalse success |
| missing slot | invalid | no runtime graph | `MissingRequiredBinding` on exact inbound validation subject |
| wrong ref family / profile fake | invalid | no runtime graph | `ReferencedSectionKindMismatch` or`ProfileBindingMismatch`;no fallback |
| constructor failure | refs were valid but concrete feed/matcher cannot be built | no partial graph escapes | `InfraError::RuntimeAssembly`;process does not start worker tasks |

## 48. Six Inbound Consumers 逐项绑定

### 48.1 Closed consumer-to-source table

| Config slot / Consumer | Logical event | Required source family | Trusted actor binding | Schema | Worker handler -> application method |
|---|---|---|---|---:|---|
| `governance_result_reference_changed` / `ConsumeGovernanceResultReferenceChanged` | `capability-hub.inbound.governance-result-reference-changed.v1` | `Governance` | configured L1-governance integration/system actor only | `1` | `consume_governance_result_reference_changed` -> same method on `CapabilityInboundConsumerService` |
| `method_asset_reference_changed` / `ConsumeMethodAssetReferenceChanged` | `capability-hub.inbound.method-asset-reference-changed.v1` | `MethodLibrary` | configured L3-method-library integration/system actor only | `1` | `consume_method_asset_reference_changed` -> same application method |
| `downstream_consumption_impact_reported` / `ConsumeDownstreamConsumptionImpactReported` | `capability-hub.inbound.downstream-consumption-impact-reported.v1` | `DownstreamConsumer` | configured runtime/tools/SDK/product integration actor matching the declared consumer family | `1` | `consume_downstream_consumption_impact_reported` -> same application method |
| `external_capability_source_reference_changed` / `ConsumeExternalCapabilitySourceReferenceChanged` | `capability-hub.inbound.external-capability-source-reference-changed.v1` | `ExternalCapabilitySource` | configured MCP/A2A/API discovery integration actor allowed for the typed source kind | `1` | `consume_external_capability_source_reference_changed` -> same application method |
| `audit_material_reference_changed` / `ConsumeAuditMaterialReferenceChanged` | `capability-hub.inbound.audit-material-reference-changed.v1` | `ObservabilityAudit` | configured observability/audit integration actor only | `1` | `consume_audit_material_reference_changed` -> same application method |
| `external_document_reference_changed` / `ConsumeExternalDocumentReferenceChanged` | `capability-hub.inbound.external-document-reference-changed.v1` | `ExternalDocument` | configured external-document integration actor only | `1` | `consume_external_document_reference_changed` -> same application method |

Every row is a compile-time closed mapping. A feed section may physically share a broker endpoint or credential section with another slot only if `04` explicitly permits that reuse;it still produces two independently validated logical runners and cannot exchange consumer identity、source family、trusted actor rules orpayload DTOs. A single wildcard subscription may be used by a concrete transport only behind a dispatcher that preserves these six exact arms;it cannot become a runtime registration API.

### 48.2 Governance-result reference change

- The runner accepts only `Governance + schema 1` and the configured governance actor matcher, then decodes only `ConsumeGovernanceResultReferenceChangedPayload`.
- The typed handler constructs the existing inbound operation context from the public source event ref, local mapped ref, source key and derived application key;it invokes only `CapabilityInboundConsumerService::consume_governance_result_reference_changed`.
- It may resolve and record body-free governance-result reference/state changes through application-owned Ports. It may not generate approval、Policy、shared-rules、vote/workflow truth or call a governance approval engine.

### 48.3 Method-asset reference change

- The runner accepts only `MethodLibrary + schema 1` and the configured method-library actor matcher, then decodes only `ConsumeMethodAssetReferenceChangedPayload`.
- It invokes only `consume_method_asset_reference_changed`;method resolver/repository/UoW activity remains inside application.
- It must quarantine method body、source code、definition/version material and must not create/remove/reactivate method relations or add a Cargo dependency on method-library.

### 48.4 Downstream consumption-impact report

- The runner accepts only `DownstreamConsumer + schema 1`. The trusted actor matcher must validate the declared runtime/tools/SDK/product consumer family;one generic “downstream” credential is insufficient when it cannot prove that family relationship.
- It decodes only `ConsumeDownstreamConsumptionImpactReportedPayload` and invokes only `consume_downstream_consumption_impact_reported`.
- Payload feedback values `Received / Partial / Delayed / Unavailable / Ignored` remain domain feedback. A successfully saved summary always yields processing `Accepted`;payload `Delayed` never selects transport retry by itself.

### 48.5 External capability-source reference change

- The runner accepts only `ExternalCapabilitySource + schema 1`. The actor matcher must additionally prove that the configured discovery integration is allowed for the payload's typed MCP/A2A/API source kind.
- It decodes only `ConsumeExternalCapabilitySourceReferenceChangedPayload` and invokes only `consume_external_capability_source_reference_changed`.
- It records only body-free reference/state support through application. It cannot execute MCP tools、A2A messages orAPI calls, import request/response/tool schemas, create capability identity automatically, or own provider route/quota/cost/failover.

### 48.6 Audit-material reference change

- The runner accepts only `ObservabilityAudit + schema 1` and the configured observability/audit actor matcher, then decodes only `ConsumeAuditMaterialReferenceChangedPayload`.
- It invokes only `consume_audit_material_reference_changed`;it does not invoke `ObservabilityAuditHandoffPort` as part of source consumption.
- Raw logs、spans、metrics、alerts、audit/GRC/evidence bodies and credentials remain forbidden. Receipt/issue/marker values are not evidence aliases、test evidence oracceptance sign-off.

### 48.7 External-document reference change

- The runner accepts only `ExternalDocument + schema 1` and the configured external-document actor matcher, then decodes only `ConsumeExternalDocumentReferenceChangedPayload`.
- It invokes only `consume_external_document_reference_changed`;descriptor binding/rebinding remains an explicit later Command/review boundary.
- Protocol、schema、guide、OpenAPI、provider-contract body and credential material are quarantined;the consumer keeps only body-free locator/safe summary/ref state and cannot create provider runtime semantics.

## 49. Header-first、Fake / Disabled 与 Ack / Retry 边界

### 49.1 Exact ingress order and authority

Every configured or fake runner executes the same ordered gates below for every encoded envelope. The order extends §26 with the source-binding authority fixed in this batch;it does not create a second decoder.

```text
resolved source runner receives encoded envelope + runtime-private delivery handle
  -> reject encoded length > inbound_body_limit;zero parse/application
  -> deserialize borrowed CapabilityInboundHeaderFirstEnvelope<RawValue>
  -> assert runner slot consumer == header.consumer_name
  -> assert runner slot source family == header.source_family
  -> validate header.source_actor_context with the runner's immutable trusted actor matcher
  -> validate source_event_ref / source key / trace / occurred_at as existing contract values
  -> if schema_version != CapabilityProtocolSchemaVersion(1):
       build existing header-only UnsupportedSchema receipt
       do not decode payload / derive application key / reserve / call Port / open UoW
  -> exact six-arm dispatch by compile-time slot mapping
  -> decode borrowed RawValue bytes into that arm's exact payload DTO
  -> validate envelope/payload symmetry and forbidden-body boundary
  -> map public source ref to local inbound ref
  -> derive application key only from closed operation + source family + public source event ref
  -> construct CapabilityOperationContext::from_inbound_event(...)
  -> call the one exact CapabilityInboundConsumerService method
  -> validate typed receipt consumer/source/effect symmetry
  -> drop borrowed header/payload bytes
  -> map typed receipt to CapabilityInboundProcessingAction
  -> physical transport mapping supplied later by 04
```

The runner slot identity is an independent check, not a replacement header value. A configured feed that delivers another supported consumer's otherwise valid envelope is rejected/quarantined by source isolation;the worker never reroutes it to that other handler. Unknown consumer names, unknown source-family values, malformed headers and malformed supported payloads use the existing `WorkerError::Source` mapping and never fall through to a generic JSON value or another protocol arm.

### 49.2 Event identity and digest boundary

| Candidate input | May select handler? | May form application key? | May enter request digest? | Rule |
|---|---|---|---|---|
| closed `consumer_name` / operation | yes,with exact slot check | yes | operation compared separately as Step 13 declares | compile-time six-arm mapping only |
| `source_family` | yes,with exact slot check | yes | yes | header value must match slot;never inferred |
| public `source_event_ref` | no | yes | yes | sole upstream event identity;must be source-owned body-free ref |
| source-provided `idempotency_key` | no | no | yes | changed source key for same event reaches same reservation and can conflict by digest |
| typed payload fields | no | no | yes | only after supported-schema exact decode and canonical field encoding |
| actor context / trace / `occurred_at` | actor is gate only | no | no | trace/time propagate but do not change identity/digest;local authoritative time remains Clock |
| topic/subscription/group/partition/offset/delivery id/attempt | no | no | no | runtime-private transport metadata only;never copied into public/application carrier |
| actor display name、payload locator、fixture sequence | no | no | no beyond declared typed payload field semantics | cannot be fallback source-event identity orkey |

Completed exact redelivery reaches application by the same normalized key and reads only `CapabilityIdempotencyRepository::get_with_version` plus `StoredCapabilityResultRepository::get_consumer_receipt`. The worker must not query current ref/state/summary, call resolver, take Clock/IdGenerator, or rebuild effect vectors before returning response-only `DuplicateReplayed`.

### 49.3 Typed receipt to processing-action mapping

`CapabilityInboundProcessingAction::try_from_receipt` first requires `receipt.consumer_name == expected_consumer` and `receipt.source_event_ref == expected_source_event_ref`, then performs an exhaustive seven-arm match over `CapabilityInboundReceiptDisposition` and validates the existing marker/result-ref invariants. Consumer-specific handler code validates the protocol card's effect-vector symmetry before calling this mapper. Any entry-local impossible receipt shape returns `WorkerError::local_source(WorkerSourceKind::InboundEnvelope, None)`;an `ApplicationError` already returned by the facade is preserved only through `WorkerError::from_application`. Neither path may become a best-effort ack.

| Receipt disposition | Required shape from Step 8/12 | Worker processing action | Runtime obligation | Forbidden behavior |
|---|---|---|---|---|
| `Accepted` | `result_ref=Some`;only application-returned effect refs | `Complete` | transport mapping marks application processing complete for this delivery | re-read effect、turn accepted feedback `Delayed` into retry、run follow-up marker automatically |
| `DuplicateReplayed` | same stored result/effect/issue refs + `StoredReplay` | `Complete` | transport mapping marks application processing complete for this delivery | rerun application body、resolver orcurrent reads |
| `Ignored` | stored replayable no-op receipt + `NoLocalEffect` | `Complete` | transport mapping marks application processing complete for this delivery | treat no-op assource disabled orsilent drop before receipt persistence |
| `Rejected` | stable redacted rejection;`NoLocalEffect`;result ref according existing safe-reservation rule | `Complete` | producer must correct input/state and send a distinct valid event where required | retry same invalid delivery automatically、convert toquarantine without typed rule |
| `UnsupportedSchema` | header-only;`result_ref=None`;`NoLocalEffect`;no payload decode | `Complete` | source owner must emit supported schema | decode body toguess old/new schema、reserve/store receipt、processing retry loop |
| `Delayed` | `result_ref=None`;`RetryRequired + NoLocalEffect`;no completed local effect | `RetrySameEvent` | exact same source event identity enters physical transport retry | create new source ref/key、ack complete、persistlocal retry state orchange payload |
| `Quarantined` | `BoundaryQuarantined + NoLocalEffect`;offending body absent;result ref only where safe contract permits | `Quarantine` | isolate delivery from automatic replay and expose only later Step 15 redacted category | automatic redelivery、local business DLQ record、leak original body/actor/transport detail |

`Complete` means no application-level processing retry is required. It does not assert which concrete broker method, offset operation or delivery response is used. `RetrySameEvent` does not authorize Capability Hub to persist an attempt, schedule, lease or backoff truth. `Quarantine` does not authorize a local business dead-letter aggregate. Physical ack/nack/release/dead-letter/quarantine APIs, target references and numeric policies are mandatory `04` bindings and must preserve this table exactly.

### 49.4 Technical error action boundary

A typed receipt owns business/processing disposition. `WorkerError` owns failure before a valid receipt exists. The physical runner must preserve the Step 12 recovery class and cannot turn every error into redelivery or quarantine.

| Error source | Exact recovery authority | Runtime action constraint | Prohibited mapping |
|---|---|---|---|
| malformed/oversized envelope or payload decode | source producer plus closed `WorkerSourceKind` / issue code | no blind same-bytes loop;physical adapter follows `04` terminal input-failure policy | fabricated `Rejected / UnsupportedSchema` receipt after malformed header、body logging |
| `ApplicationError::IdempotencyInProgress` surfaced as technical error rather than a card-formed `Delayed` receipt | exact normalized-key owner read | bounded exact-read-then-decide only;do not run body | generic dependency retry、new key/event identity |
| `PortFailure(TemporarilyUnavailable / Timeout)` | same typed Port input plus confirmed zero local effect | application card normally returns typed `Delayed`;if no card-safe receipt was formed,technical retry may occur only under existing bounded policy | parsing raw status/text、retry after unknown effect |
| optimistic/unique conflict | confirmed rollback + exact winner/current owner read | reload-and-decide under contention policy | stale-token immediate retry、transport quarantine |
| commit outcome unknown | transaction ref / exact reservation/result/receipt and same-authority resolution | exact read / `resolve_commit` procedure before any processing decision | ack success、retry body、quarantine orassume rollback |
| consistency / codec / rollback failure | exact durable refs and owner/operator repair | stop automatic processing;Step 15 later records redacted operational visibility | convert to`Delayed / Rejected / Quarantined` receipt ordrop delivery silently |
| permanent/not-configured/invalid/unexpected dependency | config/adapter owner repair | no automatic processing retry | fake fallback、temporary classification bymessage |

The runner may use `CapabilityRuntimeTechnicalPolicy` only where the stable error class already permits retry and the whole `inbound_call_timeout` remains. Attempt/delay values never enter the envelope, receipt, issue, digest, application key orbusiness state.

### 49.5 Deterministic fake parity

| Parity axis | Configured source | Deterministic fake requirement |
|---|---|---|
| encoded input | transport-owned bounded bytes | fixture yields the same encoded byte form,not a preconstructed DTO |
| slot/source identity | fixed runner slot + header checks | same fixed runner slot + header checks |
| actor authority | resolved immutable matcher | fixture-owned deterministic matcher with the same family/kind rules |
| supported schema | only`CapabilityProtocolSchemaVersion(1)` | same;unsupported fixture remains header-only |
| payload decode | exact typed DTO after header gate | same exact decoder and borrowed `RawValue` path |
| negative boundary | actor/family/schema/body/target/digest conflicts possible | fixture set must include deterministically selectable negative cases without redefining them as supported mappings |
| application path | exact handler -> existing consumer facade | same handler and facade;no direct repository/service shortcut |
| receipt/action | same typed receipt and processing-action mapper | same mapper;fixture must not assert transport product result |
| disabled behavior | no runner | no runner;fixture ref is forbidden on aDisabled slot |

Fake-only receipt dispositions、issue codes、actor bypasses、payload normalization、auto-generated source refs、repository shortcuts or success defaults are implementation failures. Step 16 will later turn these parity axes into named test cuts;this batch does not claim tests were run.

## 50. Cross-step、Historical 与 Rustdoc Audit for `14.4.2`

### 50.1 Step 8 / 9 / 12 / 13 closure

| Upstream seam | `14.4.2` binding result | Count / status |
|---|---|---|
| Step 8 Inbound inventory | six named source slots map one-to-one to six public consumers,source families,logical event names,payloads andhandler/application callables | 6 / 6,missing=0,extra=0 |
| Step 9 function flows | worker dispatch calls exactly the matching application facade and returns its typed receipt;all repository/resolver/UoW/stored-result ownership remains application | 6 / 6,entry direct data/effect dependency=0 |
| Step 12 disposition/error | seven receipt dispositions map exhaustively tothree worker processing actions;technical errors retain exact recovery class | 7 / 7 receipt arms;no raw-text classifier |
| Step 13 identity/replay | source event ref remains sole upstream identity;source key only entersdigest;transport metadata enters neither;duplicate only typed receipt read | 6 / 6 consumers use same rule |
| §26 header-first codec | byte limit -> borrowed header -> actor/family/schema -> exact payload decode -> application ->drop bytes | one shared implementation path;generic decoder=0 |
| Step 5 worker boundary | worker holds runners,parameters,dispatcher andfacade only | repository/resolver/UoW/stored-result/publisher handles=0 |

No controlled reopen of Step 4~13 is required. The existing worker file layout (`crates/worker/src/consumers.rs` and `errors.rs`) and infra owners (`config.rs`, `runtime_builder.rs`) can implement the contract. A physical transport adapter helper may be added under the existing worker/infra responsibilities in `04`/implementation planning, but it cannot become an eighth crate, an application Port or a generic event registry.

### 50.2 Historical-material and blocker audit

| Audit item | Result | Basis |
|---|---|---|
| README / old formal `03` provider/runtime/tool execution | historical_material | external-source consumer only records body-free ref/state;no invocation gateway、tool result、provider route/quota/cost |
| old governance decision / policy refresh | historical_material | governance source only carries result reference;no approval、Policy、shared rules orauto-approval |
| old method body / SDK client / marketplace listing | historical_material | method source isbody-free;downstream actor includes SDK asconsumer family only;no SDK package/cache orlisting truth |
| old audit evidence / KMS/Vault / external body | historical_material | audit/document/source runners quarantine bodies/credentials;receipt/issue isnot evidence orsign-off |
| L1 outbox/relay/DLQ/retention patterns | not imported | source processing owns no local delivery lifecycle、TTL、cleanup、attempt orDLQ aggregate |
| target implementation repository absent | non-blocking design prerequisite | no code/existence/test claim is made;implementation phase must check actual repo |
| unresolved upstream blocker | `0` | all six public protocols,facade callables,receipt dispositions,error/replay owners andworker files exist in current design baseline |
| non-blocking cross-repo debts | unchanged | L0-core idempotency accessor andserde wire design-sync debts are not altered by source binding |

If a later concrete feed product cannot provide original encoded envelope bytes, stable source event identity, immutable trusted actor context or an isolation action that preserves `Quarantine`, that is a real product-binding blocker for `04`/implementation. This batch does not weaken the logical contract in anticipation of such a product.

### 50.3 Declaration and English Rustdoc audit

Batch `14.4.2` performs a controlled extension of the existing §§14.1、15.1、23.3~23.4 declarations. The counts below are deltas for this batch, not replacements for historical `14.1/14.2` stop-review counts.

| Declaration delta | Count | Rustdoc result |
|---|---:|---|
| inbound config-ref newtypes | 2 structs / 2 tuple fields | both structs and fields have English `///` |
| source binding enum | 1 enum / 3 variants / 3 struct-variant payload fields | enum,all variants andevery payload field have English `///` |
| source binding group | 1 struct / 6 fields | struct and all six named slots have English `///` |
| Worker entry binding | 1 struct / 2 fields | struct and both fields have English `///` |
| validation-subject delta | 6 variants | all six variants have English `///` |
| Worker processing action | 1 worker-private enum / 3 variants | enum and all variants have English `///` |
| new or signature-updated config/source/entry/processing callables | 20 | every constructor/accessor/mapper has English `///` |
| updated `CapabilityEntryParameters::Worker` payload | 1 variant payload | existing variant and replacement payload remain individually documented |

The 20-callable delta is:four ref constructors/accessors + six `CapabilityInboundSourceBinding` constructors/accessors + six named source-group accessors + two Worker-entry accessors + one signature-updated `as_worker` reader + one processing mapper. No unchanged callable is counted merely because it was re-read. No declaration added or changed by this batch lacks English `///`;no field-level `pub` appears inside an enum struct variant.

### 50.4 Formal `03` §13 assembly source for this batch

Step 19 must preserve these Inbound-specific statements when assembling formal §13:

1. Worker entry configuration is `CapabilityWorkerEntryBinding { parameters, inbound_sources }`;the six source slots are named and total, each selected as `Configured`、`DeterministicFake` or`Disabled`.
2. Configured source binding separates physical feed ref from trusted actor ref. Builder resolves and consumes both refs before worker exposure;worker never receives raw/validated config refs.
3. Six consumer/source/schema/handler/application mappings are compile-time closed. Physical topic/group/credential cannot add,remove,rename orreroute a logical protocol.
4. All configured and fake sources pass through the same bounded header-first borrowed-`RawValue` path. Unsupported schema is header-only and performs zero payload decode/reserve/Port/UoW.
5. Source event identity comes only from `CapabilitySourceEventRef`;topic/group/partition/offset/delivery attempt、payload andactor display cannot provide a fallback. Source key entersdigest only.
6. Worker calls only the exact `CapabilityInboundConsumerService` method and uses application-returned receipt refs. It does not hold repository、resolver、UoW、stored-result、Clock/IdGenerator orpublisher adapter handles.
7. Receipt mapping is exact:Accepted/Duplicate/Ignored/Rejected/Unsupported -> Complete；Delayed -> RetrySameEvent；Quarantined -> Quarantine. Physical ack/nack/quarantine APIs remain `04` and cannot alter semantics.
8. `Disabled` means no runner and no false receipt/success. Fakes are Local/Integration only and must traverse identical positive/negative gates. Capability Hub owns no local delivery attempt、retry schedule、outbox、relay、DLQ orretention truth.

## 51. Batch `14.4.2` Coverage、Self-check 与 Stop Review

### 51.1 Coverage arithmetic

| Coverage item | Expected | Actual | Missing / extra |
|---|---:|---:|---:|
| named inbound source slots | 6 | 6 | 0 / 0 |
| consumer -> source-family mappings | 6 | 6 | 0 / 0 |
| consumer -> logical-event mappings | 6 | 6 | 0 / 0 |
| consumer -> worker handler mappings | 6 | 6 | 0 / 0 |
| consumer -> application callable mappings | 6 | 6 | 0 / 0 |
| accepted event schema variants per consumer | 1 | 1 (`CapabilityProtocolSchemaVersion(1)`) | 0 / 0 |
| header-first dispatch arms | 6 | 6 | 0 / 0 |
| receipt disposition arms | 7 | 7 | 0 / 0 |
| product-neutral processing actions | 3 | 3 | 0 / 0 |
| application Port / protocol / flow additions | 0 | 0 | 0 / 0 |

### 51.2 Completion gate

| Gate | Result | Source / reason |
|---|---|---|
| source-binding schema complete | pass | §§14.1、23.3、47;two refs,three-way binding,six slots,Worker aggregate andaccessors |
| six consumer mappings complete | pass | §48.1 and six independent boundary cards |
| trusted actor authority separate | pass | Configured carries exact feed + actor refs;runner validates actor before body |
| header-first and source identity | pass | §49.1~49.2;bounded borrowed decode and no transport-derived identity |
| duplicate / receipt replay | pass | §49.2;typed receipt only,no current/resolver/body execution |
| ack/retry/quarantine semantic mapping | pass | §§47.3、49.3~49.4;7/7 dispositions andtechnical error recovery separated |
| fake/disabled parity | pass | §§47.4、49.5;fake same path,Disabled no runner/no false success |
| worker owner boundary | pass | §§47.1~47.2、50.1;entry direct repository/resolver/UoW/publisher dependencies=0 |
| governance/method/runtime/tools/SDK/marketplace boundary | pass | §§48.2~48.7 and§50.2;no owner merger |
| Rustdoc / structure comment gate | pass | §50.3;every changed struct/field/enum/variant/payload/callable documented |
| historical material / blocker | pass | §50.2;unresolved upstream blocker=`0` |
| formal/document discipline | pass | formal`03` unchanged;formal`04` not created;Outbound/Job/14.5 not entered |
| evidence discipline | pass | no code、commit、run id、test result、evidence alias、acceptance sign-off orimplementation artifact claimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.4.2
gate_status = 03_step_14_batch_14_4_2_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
inbound_source_slots_bound = 6/6
inbound_consumer_source_family_mappings = 6/6
inbound_handler_callables_bound = 6/6
inbound_application_callables_bound = 6/6
inbound_receipt_disposition_arms = 7/7
worker_processing_actions = 3/3
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_4_3
```

Batch `14.4.2` is complete and stops for review. After explicit user confirmation, the next allowed batch is `14.4.3`: bind the ten closed Outbound Event families to capture/snapshot/collaboration/runtime handoff boundaries. Do not enter Operations Jobs、`14.5`、formal `03` assembly orformal `04` in that batch.

---

## 52. Batch `14.4.3` 开工输入、SOP 回答与设计取舍

### 52.1 本批读取门禁

本批只承接 Step 8 §10 的十个 Outbound Event protocol、Step 9 §§31 / 33 的十条 capture-and-collaborate flow、Step 12 §§36~39 的 Phase A/B/C error / recovery、Step 13 §§14 / 17 / 20~21 的 source-schema uniqueness与stable-intent重入，以及本文件 §§40~45 已闭合的 `CapabilityAccessEventCollaborationPort` runtime binding。它不进入八条 Operations Job runner、完整跨仓依赖、完整 runtime builder或正式文档装配。

| 输入 | 已确认事实 | `14.4.3` 必须闭合 | 本批不得改变 |
|---|---|---|---|
| Step 8 §10 | 10个closed event name、schema `1`、application schema ref、logical routing key、payload、pure mapper和capture callable均已固定 | 把每个schema family绑定到一个named physical route ref，并保持10/10 total mapping | 不新增第11个event、动态event registry、config-selected payload/schema或untyped event body |
| Step 9 §§31 / 33 | Phase A由source-owning application service在current UoW内完成source + immutable snapshot + initial capture；Phase B/C仅在commit后处理exact capture ref | 明确source continuation、optional worker handoff、application facade和adapter route selection的调用顺序 | 不让worker/adapter重读current truth、重跑mapper、扫描capture repository或持有隐藏queue |
| Step 12 §§36~39 | typed `Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable`都是合法outcome；raw Port failure、consistency defect、bind failure各有独立恢复 | 固定configured/fake/disabled route failure、unknown schema/source mismatch和bind/timeout重入 | 不把typed failed status降成error，不因post-commit失败回滚source truth |
| Step 13 | `(source_ref,schema_ref)`唯一capture；same stored bytes/digest必须形成stable same intent；`IntentBound`只允许external `get` | 固定route不得进入capture identity/digest，且route变更不得破坏old `Captured` reentry | 不增加route/version/attempt到public envelope、capture、digest或local delivery state |
| §§40~45 | collaboration Port的Configured/DeterministicFake/Disabled、four callables、five statuses和external retry边界已闭合 | 把Configured adapter section内十条route作为constructor material；fake保持同schema dispatch与stable intent parity | 不新增第二publisher Port、per-family Port、local outbox/relay/DLQ/attempt store |

### 52.2 SOP 八问在本批的回答

| SOP问题 | `14.4.3`裁决 |
|---|---|
| 哪些模块读取配置? | `infra/config.rs`只在startup解析并校验configured collaboration adapter section中的十个named route refs；`infra/runtime_builder.rs`解析该section并把完整route set交给`infra/publishers.rs` constructor。application、worker、domain和contracts不读取route ref。 |
| 配置项类型、默认与读取位置? | 每个route使用`CapabilityOutboundRouteConfigRef`；当`access_event_collaboration=Configured`时10槽全部required且无wildcard/default。当slot为fake或disabled时不得携带physical route refs。具体route product、destination、credential和raw defaults留`04`。 |
| 哪些外部依赖经adapter/event注入? | 十类Outbound均经既有`CapabilityAccessEventCollaborationPort`注入；它们不是十个新Port。source UoW只依赖local capture service；commit后application facade才调用该external Port。 |
| 超时、重试、降级? | `collaboration_call_timeout`和existing external retry policy只约束same exact capture/candidate调用。只有temporary/timeout且stable-intent/effect边界可证明时可bounded retry；typed五态原样返回并可bind；Disabled返回NotConfigured；任何分支都不回滚source truth。 |
| 哪些细节留`04`? | route section raw key、broker/API product、destination/topic/exchange/stream、credential/TLS、partitioning/header/property mapping、send API、timeout数值、stable-intent dedupe capability、route migration/startup probe和fixture source。 |
| 跨仓Rust path dependency? | 本批为零。Event transport或bus只通过runtime adapter / fake协作，不进入Cargo sibling dependency。只有后续`14.5`复核`core-contracts`编译期依赖。 |
| 运行期/event/fake如何表达? | complete stored candidate的`schema_ref`在configured/fake adapter内命中十臂closed dispatch；selected route只承载transport destination。Fake必须对十个schema、source gate、bytes/digest和stable intent执行同一语义。 |
| 依赖不存在时怎么办? | Local/Integration可显式使用typed deterministic collaboration fixture；Deployment可选择Configured或Disabled。缺少能保持exact bytes、source symmetry与stable intent的真实产品时Configured startup必须失败或integration暂停，不得静默fake/fallback。 |

### 52.3 设计取舍

| 议题 | 候选 | 当前裁决 | 原因 |
|---|---|---|---|
| route cardinality | one wildcard route；ten named route slots | configured adapter section内ten named route refs | 直接证明10/10 coverage，避免新增event被wildcard吞入或遗漏family |
| route selector | parse serialized envelope/routing key；match official schema ref | 只按official `CapabilityEventSchemaRef`十臂匹配 | adapter必须把stored complete bytes视为opaque，不应再次decode/normalize；schema ref已唯一标识event name/version |
| worker source | worker扫描`AwaitingIntent`；worker接收exact capture ref | worker只接收上游已选定exact ref；scan仍只属于repair Job application | Step 5/8/9明确worker无repository handle；扫描会私造publisher queue owner |
| cross-process handoff | 隐含broker/outbox传capture ref；无隐含handoff | source process可直接调用facade；若没有in-process exact-ref handoff则由repair Job恢复 | 当前没有public/internal durable handoff protocol；不得用实现私有queue补设计 |
| route identity | physical route进入capture/digest/intent key；route仅为transport binding | route不进入任何business/application identity | config不能改变event kind/schema/source；稳定candidate跨retry必须保持同intent |
| route change | ordinary hot config edit；compatibility migration | v1 active capture期间route mapping视为兼容性固定，变化需显式migration | capture不保存physical route；任意变更可能使old `Captured`在重入时指向另一destination |

本批没有发现需要回开 Step 4~13 的缺口。Step 8已经提供十个exact schema literal和logical routing key；Step 9已经提供shared facade；Step 7已经提供single collaboration Port与official stored candidate。因此只需扩展infra-local route binding和worker-private continuation callable，不新增public protocol、application Port、HLD object、repository、state或business truth。

## 53. Outbound Route Binding Schema 与 Startup Validation

### 53.1 Exact infra-local declarations

`CapabilityOutboundRouteConfigRef`已作为§14.1的受控扩展声明，归`crates/infra/src/config.rs`且visibility为`pub(crate)`。它只命名一个已解析的physical route section，不是public routing key、topic、URL、credential、event id或capture source。Configured collaboration adapter section必须使用以下十槽group；该group不是`CapabilityRuntimeConfig`的新top-level field，而是`CapabilityExternalPortBindings.access_event_collaboration`的`Configured { adapter_ref }`所指向section中的typed child material。

`CapabilityOutboundRouteBindings`归`crates/infra/src/config.rs`；`CapabilityOutboundRouteKind`与candidate classifier归`crates/infra/src/publishers.rs`。The classifier is shared by Configured、DeterministicFake andDisabled implementations so an impossible persisted schema/source pair is never hidden behind a binding-mode result.

```rust
/// Infra-private route family selected from one exact outbound schema and source pair.
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub(crate) enum CapabilityOutboundRouteKind {
    /// Capability identity change route family.
    CapabilityIdentityChanged,
    /// Capability registry change route family.
    CapabilityRegistryChanged,
    /// Adapter descriptor change route family.
    AdapterDescriptorChanged,
    /// Governance seam relation change route family.
    GovernanceSeamRelationChanged,
    /// Capability method relation change route family.
    CapabilityMethodRelationChanged,
    /// Formal exposure boundary change route family.
    FormalExposureBoundaryChanged,
    /// Controlled consumer-view availability change route family.
    ControlledConsumerViewAvailabilityChanged,
    /// Identified capability-change impact route family.
    CapabilityChangeImpactIdentified,
    /// Refreshed derived-material route family.
    DerivedMaterialRefreshed,
    /// Canonical reference-resolution change route family.
    ReferenceResolutionChanged,
}

impl CapabilityOutboundRouteKind {
    /// Validates one stored candidate's closed schema and source pairing.
    pub(crate) fn try_from_candidate(
        candidate: &CapabilityEventCollaborationCandidateSurface,
    ) -> Result<Self, ApplicationError>;

    /// Returns the fixed application schema-reference literal for this route family.
    pub(crate) fn schema_ref_literal(&self) -> &'static str;

    /// Returns the fixed logical routing-key literal for this route family.
    pub(crate) fn logical_routing_key_literal(&self) -> &'static str;
}

/// Complete physical route bindings for the ten closed outbound event families.
#[derive(Clone, Eq, PartialEq)]
pub(crate) struct CapabilityOutboundRouteBindings {
    /// Physical route binding for capability identity changes.
    capability_identity_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for capability registry changes.
    capability_registry_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for adapter descriptor changes.
    adapter_descriptor_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for governance seam relation changes.
    governance_seam_relation_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for capability method relation changes.
    capability_method_relation_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for formal exposure boundary changes.
    formal_exposure_boundary_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for controlled consumer-view availability changes.
    controlled_consumer_view_availability_changed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for identified capability-change impacts.
    capability_change_impact_identified: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for refreshed derived materials.
    derived_material_refreshed: CapabilityOutboundRouteConfigRef,
    /// Physical route binding for canonical reference-resolution changes.
    reference_resolution_changed: CapabilityOutboundRouteConfigRef,
}

impl CapabilityOutboundRouteBindings {
    /// Returns the capability-identity-changed route binding.
    pub(crate) fn capability_identity_changed(&self) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the capability-registry-changed route binding.
    pub(crate) fn capability_registry_changed(&self) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the adapter-descriptor-changed route binding.
    pub(crate) fn adapter_descriptor_changed(&self) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the governance-seam-relation-changed route binding.
    pub(crate) fn governance_seam_relation_changed(
        &self,
    ) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the capability-method-relation-changed route binding.
    pub(crate) fn capability_method_relation_changed(
        &self,
    ) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the formal-exposure-boundary-changed route binding.
    pub(crate) fn formal_exposure_boundary_changed(
        &self,
    ) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the controlled-consumer-view-availability-changed route binding.
    pub(crate) fn controlled_consumer_view_availability_changed(
        &self,
    ) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the capability-change-impact-identified route binding.
    pub(crate) fn capability_change_impact_identified(
        &self,
    ) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the derived-material-refreshed route binding.
    pub(crate) fn derived_material_refreshed(&self) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the reference-resolution-changed route binding.
    pub(crate) fn reference_resolution_changed(&self) -> &CapabilityOutboundRouteConfigRef;

    /// Returns the physical route binding for one validated outbound route family.
    pub(crate) fn route_for_kind(
        &self,
        kind: CapabilityOutboundRouteKind,
    ) -> &CapabilityOutboundRouteConfigRef;
}
```

`try_from_candidate` is an exact ten-arm schema match plus the event-specific source-union check in§55。It does not deserialize `serialized_envelope`,parse a routing key frombytes,match string prefixes,read config names orfall back to a default route。Unknown schema、`Traceability` source or a source variant incompatible withthe matching schema returns the existing `ApplicationError::ConsistencyDefect` on`EventCaptureShape`before any binding-mode branch or external call。It must not become `NotConfigured`、`PermanentlyRejected`or a newly invented “unknown event” status。

`schema_ref_literal` and`logical_routing_key_literal` are exhaustive compile-time literal maps copied fromStep 8 §10.3。They exist only to validate the typed candidate andoptionally populate physical transport properties；they do not reconstruct orrewrite the stored envelope。`route_for_kind` is total and cannot return`Option`because the configured route group was validated as10/10 complete atstartup。

### 53.2 Binding branch validation

| Collaboration slot | Route material rule | Runtime graph | Invalid condition |
|---|---|---|---|
| `Configured { adapter_ref }` | referenced adapter section contains exactly ten named `CapabilityOutboundRouteConfigRef` values；each resolves a route section owned by the matching event family | shared classifier first；then one configured `CapabilityAccessEventCollaborationAdapter` holding resolved client material plus the complete ten-route dispatch table | missing/duplicate/unknown route field、wrong family section、unresolved destination/credential、cannot preserve exact bytes/stable intent -> `InfraError::RuntimeAssembly` |
| `DeterministicFake { fixture_ref }` | no physical route ref；fixture family must support all ten closed schema/source arms and all five typed statuses plus declared safe failures | shared classifier first；then one fake Port with stable candidate-to-intent mapping | missing positive family、wildcard success、random intent、payload DTO shortcut or Deployment profile -> startup invalid |
| `Disabled` | no adapter section or route refs | shared classifier first；a valid candidate then reaches the exact disabled implementation and returns`CapabilityAccessEventCollaboration + NotConfigured` | carrying route/fixture material with Disabled is a forbidden configuration surface |

The ten route fields are total only inside a configured collaboration section。A Deployment profile may intentionally choose the whole Port as`Disabled`;it may not configure nine routes and silently drop one family。Conversely，a configured adapter cannot use`Disabled`per event family：per-family disabling would make source/capture formation depend ontransport config andwould violate the fixed 10-event protocol inventory。Operational consumers may ignore anevent externally,但Capability Hub still emits the complete declared candidate through its selected route。

### 53.3 Resolution and constructor order

```text
CapabilityExternalPortBindings.access_event_collaboration
  -> Configured(adapter_ref)
  -> resolve exact collaboration-adapter section
  -> resolve ten named outbound-route sections
  -> validate each route's fixed family marker and physical constructor material
  -> validate endpoint/client can transmit opaque complete envelope bytes unchanged
  -> validate candidate identity can produce a stable same intent across exact retry
  -> build one immutable schema_ref -> resolved route dispatch table
  -> construct CapabilityAccessEventCollaborationAdapter
  -> inject Arc<dyn CapabilityAccessEventCollaborationPort + Send + Sync>
  -> construct CapabilityEventCollaborationService facade
  -> expose only the facade to source continuation / worker / application owners
```

All ten route constructors must complete before the Port object is injected。There is no partially enabled adapter graph。Lower-level endpoint、credential、TLS client orphysical destination material may be shared bymultiple route sections only if`04`declares that reuse；the ten family-owned sections anddispatch arms remain distinct。The same route section cannot masquerade astwo families merely because their destinations are equal。

### 53.4 Route stability and migration gate

`CapabilityEventCaptureRecord` deliberately persists source、schema、digest、snapshot andoptional stable intent,not physical route。Therefore a configured route mapping for anexisting schema is compatibility material,not ordinary mutable deployment tuning。

| Change | v1 treatment | Required consequence |
|---|---|---|
| endpoint credential rotation with identical logical route/dedupe identity | may be allowed by`04` | constructor and external owner must preserve same candidate-to-intent semantics；no capture rewrite |
| physical destination rename/alias preserving global candidate dedupe | only with explicit product proof in`04` | old and new route must return the same stable intent for the same source/schema/digest/bytes |
| move one schema to a destination with independent dedupe namespace | incompatible while any matching capture can be`Captured` | startup/deployment migration blocker；must drain/bind under old mapping or introduce a new versioned design before switch |
| add route ref/version to capture ordigest | forbidden in v1 | requires reopeningSteps 6/8/11/13；cannot be an implementation shortcut |
| hot reload route table | forbidden | runtime root is immutable；a restart still must satisfy the compatibility rule above |

Because v1 defines no capture retention/delete Port,configuration design cannot assume that time alone makes anold route safe to forget。If a chosen transport cannot provide route-independent stable candidate deduplication or anexplicit migration mechanism，that transport is a real product-binding blocker for`04`/implementation。

## 54. Exact Capture-ref Continuation and Runtime Handoff

### 54.1 Owner topology

```text
[Phase A: source-owning application service]
  exact accepted source + complete envelope snapshot + initial Captured record
  -> same source UoW commit
  -> retain exact CapabilityEventCaptureRef in operation-local stable order

[Immediate continuation, when available in the same composition]
  source-owning application continuation
    or worker::event_publisher receiving that already selected exact ref
  -> CapabilityEventCollaborationService::collaborate_captured_event(capture_ref)
  -> official get_with_snapshot inside application facade
  -> Captured: candidate from stored bytes -> existing collaboration Port
  -> IntentBound: external get(existing intent) only
  -> exact source/outcome validation
  -> short local UoW bind when still Captured

[Deferred/crash/separate-process recovery]
  RepairCapabilityAccessEventCollaboration application Job
  -> official AwaitingIntent scan and frozen target plan
  -> inline capture/candidate/Port/bind + journal rules owned by the Job flow
```

The worker continuation is optional execution plumbing,not durability。There is no configured `outbound feed`、capture-ref broker、publisher queue orworker-owned scan。If an API/source process cannot hand the exact ref to an in-process continuation after commit，it simply leaves the durable capture as`Captured`;the later repair Job is the only declared recovery authority。An implementation must not create an undocumented cross-process queue to make`worker::event_publisher`appear mandatory。

### 54.2 Worker-private continuation callable

`crates/worker/src/event_publisher.rs` must expose one exact-ref callable rather than ten event-specific handlers or a repository scanner:

```rust
/// Delegates one exact committed event capture to the application collaboration facade.
pub(crate) async fn continue_captured_event(
    collaboration: &dyn CapabilityEventCollaborationService,
    capture_ref: CapabilityEventCaptureRef,
) -> Result<CapabilityEventCollaborationOutcome, WorkerError>;
```

The callable performs no event-name/schema/source inference and receives no config、repository、Clock、IdGenerator、Port orUoW handle。It invokes `collaborate_captured_event` once for the supplied ref and maps an application failure only through `WorkerError::from_application`。A local handoff/shape failure before the facade is invoked uses`WorkerError::local_source(WorkerSourceKind::CollaborationContinuation, ...)`andcannot fabricate an`ApplicationError`or collaboration outcome。

`CapabilityWorkerEntryParameters.collaboration_call_timeout`bounds one exact-ref continuation attempt。Deadline expiry orcaller cancellation does not prove that external intent formation orlocal bind did not occur；therefore the worker cannot mark success/failure、create a replacement ref orblindly call another route。A later attempt always re-enters with the same exact capture ref;the application facade then observes`Captured`or`IntentBound`and follows Step 13's stable-intent algorithm。

### 54.3 Source-service, worker and repair-Job separation

| Owner | Allowed input | Allowed call | Durable scan/write authority | Forbidden shortcut |
|---|---|---|---|---|
| source-owning application service | capture refs returned by its own current source UoW | after successful commit,call shared facade in retained stable order | source UoW already owns snapshot/capture formation；facade owns short bind UoW | call before commit、persist operation-local vector、rewrite stored result from outcome |
| `worker::event_publisher` | one exact capture ref already selected by application/binary composition | `continue_captured_event`only | none directly；all official read/bind remains inside application facade | capture repository scan、current source read、pure mapper、serializer、collaboration Port direct call |
| repair Job entry | full typed public Job request only | exact Job application service | application Job flow owns AwaitingIntent scan、frozen target journal andtarget UoW | call worker helper、use its independent short bind UoW、replan fromworker state |
| collaboration adapter | transient candidate orstable intent fromexisting Port method | `collaborate/get/list/repair` | external status/intent only；no local write | read capture repository、change source truth、copy delivery status locally |

The repair Job row is recorded only to preserve owner separation；its trigger、entry parameters、runner andeight-Job coverage remain batch`14.4.4`scope and are not bound here。

## 55. Ten Outbound Event Families 逐项绑定

### 55.1 Closed event-to-route table

| Event / route slot | Application schema ref | Logical routing key | Required technical source | Capture callable | Route kind |
|---|---|---|---|---|---|
| `CapabilityIdentityChanged` / `capability_identity_changed` | `capability-hub.outbound/CapabilityIdentityChanged@1` | `capability-hub.identity.changed.v1` | `Change(Identity(...))` | `capture_capability_identity_changed` | `CapabilityIdentityChanged` |
| `CapabilityRegistryChanged` / `capability_registry_changed` | `capability-hub.outbound/CapabilityRegistryChanged@1` | `capability-hub.registry.changed.v1` | `Change(Registry(...))` | `capture_capability_registry_changed` | `CapabilityRegistryChanged` |
| `AdapterDescriptorChanged` / `adapter_descriptor_changed` | `capability-hub.outbound/AdapterDescriptorChanged@1` | `capability-hub.adapter-descriptor.changed.v1` | `Change(Descriptor(...))` | `capture_adapter_descriptor_changed` | `AdapterDescriptorChanged` |
| `GovernanceSeamRelationChanged` / `governance_seam_relation_changed` | `capability-hub.outbound/GovernanceSeamRelationChanged@1` | `capability-hub.governance-seam-relation.changed.v1` | `Change(GovernanceSeam(...))` | `capture_governance_seam_relation_changed` | `GovernanceSeamRelationChanged` |
| `CapabilityMethodRelationChanged` / `capability_method_relation_changed` | `capability-hub.outbound/CapabilityMethodRelationChanged@1` | `capability-hub.capability-method-relation.changed.v1` | `Change(MethodRelation(...))` | `capture_capability_method_relation_changed` | `CapabilityMethodRelationChanged` |
| `FormalExposureBoundaryChanged` / `formal_exposure_boundary_changed` | `capability-hub.outbound/FormalExposureBoundaryChanged@1` | `capability-hub.formal-exposure-boundary.changed.v1` | `Change(Exposure(...))` | `capture_formal_exposure_boundary_changed` | `FormalExposureBoundaryChanged` |
| `ControlledConsumerViewAvailabilityChanged` / `controlled_consumer_view_availability_changed` | `capability-hub.outbound/ControlledConsumerViewAvailabilityChanged@1` | `capability-hub.controlled-consumer-view.availability-changed.v1` | `DerivedMaterial { ControlledConsumerView(...), exact version }` | `capture_controlled_consumer_view_availability_changed` | `ControlledConsumerViewAvailabilityChanged` |
| `CapabilityChangeImpactIdentified` / `capability_change_impact_identified` | `capability-hub.outbound/CapabilityChangeImpactIdentified@1` | `capability-hub.capability-change-impact.identified.v1` | `Impact(exact impact ref)` | `capture_capability_change_impact_identified` | `CapabilityChangeImpactIdentified` |
| `DerivedMaterialRefreshed` / `derived_material_refreshed` | `capability-hub.outbound/DerivedMaterialRefreshed@1` | `capability-hub.derived-material.refreshed.v1` | `DerivedMaterial` with `DirectoryProjection / AuditExport / EcosystemDiscovery / ReconciliationReport`,exact version | `capture_derived_material_refreshed` | `DerivedMaterialRefreshed` |
| `ReferenceResolutionChanged` / `reference_resolution_changed` | `capability-hub.outbound/ReferenceResolutionChanged@1` | `capability-hub.reference-resolution.changed.v1` | `ReferenceResolution(exact state ref)` | `capture_reference_resolution_changed` | `ReferenceResolutionChanged` |

Every row is compile-time closed。The schema ref selects the family only after the exact source-union payload also matches。The logical routing key is already serialized inside the immutable envelope；the adapter may copy the same fixed literal into a transport property only ifthe product requires it，but it must not use a different configured alias aspublic/event identity。The physical route ref is never serialized or returned toapplication。

### 55.2 `CapabilityIdentityChanged`

- The classifier accepts only the identity schema ref with`CapabilityEventCaptureSourceRef::Change(CapabilityChangeRecordRef::Identity(_))`。
- The adapter sends the exact complete stored envelope through`capability_identity_changed`and returns one source-symmetric stable intent outcome。
- It cannot load identity/review truth、merge multiple eligible identity records、route byidentity id orturn the notification into governance/runtime authorization。

### 55.3 `CapabilityRegistryChanged`

- The classifier accepts only the registry schema ref with`Change(Registry(_))`。A reconciliation report source is a consistency defect，not analternate registry route。
- The configured adapter uses only`capability_registry_changed`;it cannot inspect lifecycle to choose marketplace/runtime/downstream destinations dynamically。
- External failed/unavailable status never advances、retires、repairs orreconciles registry truth。

### 55.4 `AdapterDescriptorChanged`

- The classifier accepts only the descriptor schema ref with`Change(Descriptor(_))`。
- Multiple event-eligible descriptor records fromone source operation remain independent captures andindependent stable intents，even when the same physical route is selected。
- The adapter cannot decode provider route、secret、API schema ordocument body，coalesce safe-summary andsecret-reference records，orcall external capability execution。

### 55.5 `GovernanceSeamRelationChanged`

- The classifier accepts only the governance-seam schema ref with`Change(GovernanceSeam(_))`。
- The route carries the existing body-free seam envelope only；no approval、Policy、vote、workflow orshared-rules material may be attached asheaders orside payload。
- Delivery/collaboration status does not activate、expire、forbid orapprove the seam relation。

### 55.6 `CapabilityMethodRelationChanged`

- The classifier accepts only the method-relation schema ref with`Change(MethodRelation(_))`。
- The route sends the body-free method ref andrelation state already frozen inbytes；it cannot load method-library content、definition version body、source code orruntime executor state。
- Route selection cannot depend onmethod kind/body orbecome a method-library mutation acknowledgement。

### 55.7 `FormalExposureBoundaryChanged`

- The classifier accepts only the formal-exposure schema ref with`Change(Exposure(_))`。`ConsumerViewMarkedStale` remains ineligible byStep 8 andcannot be rerouted here。
- The event is a formal exposure boundary notification，not runtime/tool execution authorization、SDK package/cache state ormarketplace listing。
- A failed/unavailable collaboration outcome cannot suspend exposure oralter registry visibility。

### 55.8 `ControlledConsumerViewAvailabilityChanged`

- The classifier accepts only the controlled-view schema ref with`DerivedMaterial::ControlledConsumerView`andthe exact stored version。
- It is family-exclusive：the same source cannot use`DerivedMaterialRefreshed`orits route。A view audience/source-version mismatch should have failed inPhase A；a persisted schema/source contradiction is aPhase B consistency defect。
- The adapter cannot invoke runtime/tools/SDK、authorize a consumer、mutate exposure orcopy consumer cache state locally。

### 55.9 `CapabilityChangeImpactIdentified`

- The classifier accepts only the impact schema ref with`Impact(exact versioned impact ref)`。`Traceability`orother impact lifecycle revisions are not accepted aliases。
- The route carries only the frozen identified scope/consumer refs；it cannot include execution feedback、cost/billing、runtime result ordownstream response body。
- External delivery does not append downstream feedback orchange the impact lifecycle。

### 55.10 `DerivedMaterialRefreshed`

- The classifier accepts only the derived-material schema ref withone ofexactly foursource variants:`DirectoryProjection`、`AuditExport`、`EcosystemDiscovery`or`ReconciliationReport`。`ControlledConsumerView` is rejected because it owns the previous event family。
- The adapter treats serialized projection/report bytes as the Step 8 body-free envelope，not a request to export the underlying index、audit material、listing rows、report evidence orraw diff。
- Delivery failure does not run rebuild/reconciliation、repair core truth orcreate a marketplace/observability owner record。

### 55.11 `ReferenceResolutionChanged`

- The classifier accepts only the reference-resolution schema ref with`ReferenceResolution(exact state ref)`。
- The route carries the canonical body-free value already frozen bythe source transaction；it never calls aresolver、loads locator/external body orguesses a sibling owner fromthe reference string。
- External collaboration cannot alter thecanonical state、mark dependent material stale orfabricate external owner truth。

## 56. Candidate Dispatch、Typed Outcome and Reentry Matrix

### 56.1 Configured/Fake/Disabled invocation order

```text
CapabilityAccessEventCollaborationPort.collaborate(candidate)
  -> validate candidate capture/snapshot/source/schema/digest/bytes shape already formed
  -> CapabilityOutboundRouteKind::try_from_candidate(candidate)
  -> schema/source pair mismatch: ConsistencyDefect;zero external call
  -> binding branch:
       Configured -> route_for_kind(kind) -> exact opaque bytes send
       DeterministicFake -> same kind/source gate -> deterministic fixture outcome
       Disabled -> exact NotConfigured PortFailure for this valid candidate
  -> validate returned outcome source == candidate source
  -> validate stable intent and status/reason shape
  -> application facade performs local bind or reentry logic
```

The adapter may verify transport-level acknowledgement data needed toconstruct a typed outcome，but no raw broker/API response、message id、partition/offset、delivery attempt ordestination appears in`CapabilityEventCollaborationOutcome`。The stable intent ref is external-owner identity，not a wrapper aroundphysical message metadata unless theexternal owner guarantees all declared stability andlookup/repair semantics。

### 56.2 Outcome and failure matrix

| Branch | Port return / error | Local capture effect | Retry / reentry | Forbidden handling |
|---|---|---|---|---|
| valid configured/fake `Candidate` | typed outcome without reason | bind stable intent | later inspection/repair byexisting intent rules | treat asnot-sent andcreate second intent |
| valid `PendingDelivery` | typed outcome without reason | bind stable intent | later same-intent repair may continue | local Pending state/retry counter |
| valid `Delivered` | typed outcome without reason | bind stable intent | `IntentBound` reentry uses`get`only | local Delivered state、acceptance/evidence claim |
| valid `Failed` | typed outcome withsafe reason | bind stable intent | later same-intent repair;no automatic local mutation retry | convert toPortFailure、rollback source、local Failed state |
| valid `HandoffUnavailable` | typed outcome withsafe reason | bind stable intent | later same-intent repair afterowner/config recovery | create local DLQ/outbox orsecond route |
| valid candidate + Disabled | `PortFailure(CapabilityAccessEventCollaboration, NotConfigured)` | remains`Captured` | binding repair then exact same capture ref | fake fallback、drop capture、returntyped unavailable outcome |
| temporary/timeout beforetyped outcome | exact`PortFailure` | remains`Captured` | bounded same candidate only ifstable-intent/effect proof anddeadline permit | route failover that changes candidate namespace、new capture/ref |
| permanent/invalid/unexpected raw failure | exact`PortFailure` | remains`Captured` | owner/config/adapter repair | raw-text retry classification、typed status fabrication |
| unknown schema orschema/source contradiction | `ConsistencyDefect(...EventCaptureShape)` beforebinding branch | no external call；capture remains unchanged | data/design/operator repair | NotConfigured、fallback route、decode bytes toguess family |
| returned source/intent/status/reason contradiction | `ConsistencyDefect(PortReturn(...), CollaborationOutcomeShape)` | no bind | external adapter repair | downgrade toFailed/HandoffUnavailable |
| bind CAS loser | existing`OptimisticConflict` | winner-dependent；source/snapshot remain | reload exact capture；same intent ->`get` | stale expected-version retry、second intent |
| bind commit unknown | existing`CommitOutcomeUnknown` | unknown untilsame-authority resolution | exact capture read + stable external intent algorithm | claim Captured/IntentBound、blind collaborate |
| already`IntentBound` | no route selection or`collaborate`;external`get(existing intent)` | zero local mutation | repeat exact get asneeded | send envelope again、change route、bind again |

### 56.3 Route independence from candidate identity

| Material | Candidate/capture identity | Route selection | May change onretry? |
|---|---|---|---|
| `source_ref` | yes；exact immutable source | classifier gate only | no |
| `schema_ref` | yes；capture unique key anddigest domain input | exact route family selector | no |
| complete serialized envelope | yes；digest input andexternal candidate material | transmitted unchanged | no |
| candidate digest | yes | external stable-intent input | no |
| capture/snapshot ref | local technical authority | not sent aspublic event identity unlessexternal Port contract internally needs thebody-free capture ref already present in candidate | no replacement |
| physical route ref/destination | no | configured adapter-only | only under§53.4 compatible migration proof |
| external intent ref | post-collaboration owner identity | returned byexternal boundary | same candidate must yield same value |
| topic/message id/partition/attempt | no | transport-private | cannot affect application result orreentry |

No route property may enter`CapabilityEventCandidateDigest`orbeused tocreate another `(source_ref,schema_ref)` capture。Likewise，logical routing key is part ofthe already serialized Step 8 envelope andcannot be overwritten byconfigured destination naming。

## 57. Deterministic Fake、Historical and Boundary Audit

### 57.1 Fake parity

| Parity axis | Configured adapter | Deterministic fake requirement |
|---|---|---|
| family dispatch | ten exact schema/source arms | same ten arms；no wildcard/default success |
| bytes | sends exact stored complete envelope | fixture records/validates exact bytes without deserializing toalternate DTO |
| candidate identity | source + schema + digest + bytes | deterministic key uses the same complete candidate identity；route fixture name isnot identity |
| stable intent | external owner returns same intent forsame candidate | fake returns exact same intent acrossduplicate/concurrent calls andcan expose mismatch fixtures deliberately |
| typed statuses | all five legal statuses | all fiveconstructible withthe same reason rules |
| failures | concrete mapped temporary/timeout/permanent/invalid/unexpected | all safe classes injectable withoutmessage parsing |
| source/schema defect | consistency beforeexternal/binding branch | same defect，notfixture NotConfigured/failure |
| local side effect | none | none；no fake delivery map may becomeCapability Hub truth |
| route migration | product/config compatibility rule | fixture generation/version change cannot silently altercandidate-to-intent result |

The fake may keep process-local deterministic fixture state needed toreturn stable external-owner intent/item/status。That state is test implementation detail behindthe Port，not Capability Hub persistence、recovery authority orproof ofreal delivery。No fake outcome is a test result、evidence alias、acceptance sign-off orproduction event receipt。

### 57.2 Historical-material and owner audit

| Historical/conflicting material | Current handling |
|---|---|
| old publisher/outbox/topic table | only the ten Step 8 logical keys andthe configured external collaboration route table survive；no local outbox row、relay、publisher status orattempt lifecycle |
| L1-governance outbox/dead-letter pattern | not imported；Capability Hub's local state remainsimmutable snapshot + `Captured / IntentBound` only |
| README runtime/tools must invoke throughHub | excluded；formal exposure/view events arenotifications，notexecution gateway/authorization |
| README provider routing/quota/cost | excluded；descriptor event cannot carryorselect provider runtime routing |
| governance policy/approval refresh | excluded；seam event isbody-free relation truth only |
| method-library body sync | excluded；method event carriesbody-free asset ref/relation only |
| SDK/marketplace listing state | excluded；no SDK client/cache/package orlisting truth/config isintroduced |
| raw audit/evidence/export payload | excluded；derived/audit-related event remainsbody-free andcannot claim evidence/sign-off |

### 57.3 Blocker result

No unresolved upstream blocker was found。All ten event families、source unions、schema/routing literals、capture callables、shared facade、collaboration Port、error classes andreentry states already exist inSteps 6~13。

The following remain downstream product/configuration gates rather than current upstream blockers:

1. A configured transport must accept opaque complete envelope bytes withoutre-encoding。
2. The external collaboration owner must provide stable same-intent semantics forsource/schema/digest/bytes acrossretry androute-compatible migration。
3. The configured product must support exact `get`anddeclaredrepair semantics forbound intents。
4. Ifthese cannot beproven forone chosen product，`04`/implementation must record a product-binding blocker；the logical contract cannot beweakened。

## 58. Cross-step、Rustdoc 与 Formal Assembly Audit for `14.4.3`

### 58.1 Cross-step closure and controlled-extension audit

| Upstream / Step 14 seam | `14.4.3` closure | Count / result |
|---|---|---|
| Step 8 outbound inventory | each closed event name、schema ref、logical routing key、exact technical source andcapture callable maps toone named route kind / slot | 10 / 10；missing=0，extra=0 |
| Step 9 source / continuation flow | source-owning service captures inits current UoW；post-commit continuation receivesonly exact capture ref；repair Job remains theonly deferred scan owner | 10 / 10；worker repository / mapper / serializer / Port direct dependency=0 |
| Step 12 Phase A/B/C failure boundary | source atomicity、typed five-status outcome、raw Port failure、short bind UoW、commit-unknown recovery andIntentBound get-only remain distinct | all declared branches covered；raw-text classifier=0 |
| Step 13 capture identity / reentry | `(source_ref,schema_ref)` remains thecapture uniqueness key；digest uses exact stored bytes；physical route entersneither；same candidate requiresstable same intent | route-dependent capture/digest fields=0；second-intent path=0 |
| §§14~17 infra-local schema | one outbound route-ref newtype、ten validation subjects、ten required child slots、validation sequence、reader lifecycle andforbidden matrix are synchronized | controlled extension only；runtime root top-level field delta=0 |
| §§24 / 29 configuration handoff | configured route refs arepresent inconfiguration-reference table andformal `04` handoff with10/10、no-wildcard、stable-intent andmigration obligations | handoff rows complete；raw product/default values remain deferred |
| §§40~45 collaboration Port | all ten families reuse theone existing `CapabilityAccessEventCollaborationPort` andshared application facade | application Port additions=0；public protocol additions=0 |
| Step 4 / 5 worker owner | existing `crates/worker/src/event_publisher.rs` owner receivesexact refs only | new file/module/crate=0；hidden queue/outbox/relay=0 |

No controlled reopen ofSteps 4~13 is required。The infra-local declarations are implementation binding material anddo not change the43 HLD objects +7 application technical helpers、36 application Ports、22 repository traits /110 methods、250 public protocol types、83 protocols / flows or24 state-like enums /111 active variants /638 ordered state pairs。The worker-private continuation callable makes thealready declared file responsibility executable；it does not create anOutbound protocol、application Port、durable queue orrecovery owner。

### 58.2 Declaration and English Rustdoc audit

Batch `14.4.3` performs a controlled extension ofthe existing §§14.1、15.1 andworker continuation boundary。The counts below arethis batch's deltas，not replacements forthe historical `14.1 / 14.2 / 14.4.2` snapshots。

| Declaration delta | Count | Rustdoc result |
|---|---:|---|
| outbound route config-ref newtype | 1 struct / 1 tuple field | struct andtuple field have English `///` |
| validation-subject delta | 10 variants | all ten event-family variants have English `///` |
| outbound route-kind classifier | 1 enum / 10 variants | enum andall ten variants have English `///` |
| complete outbound route binding group | 1 struct / 10 fields | struct andall ten named route fields have English `///` |
| new config / classifier / binding / worker callables | 17 | every callable has English `///` |

The17-callable delta is：two `CapabilityOutboundRouteConfigRef` constructor/accessor callables +three `CapabilityOutboundRouteKind` classifier/literal callables +eleven `CapabilityOutboundRouteBindings` field/dispatch accessors +one worker-private `continue_captured_event` callable。No unchanged callable isrecounted merely because itwas reread。No declaration added bythis batch lacks English `///`；no enum struct-variant field usesfield-level `pub`；no raw route value receives `Display`、`Debug`、serialization orgeneric string-conversion escape hatches。

### 58.3 Formal `03` §13 assembly source for this batch

Step 19 must preserve these Outbound-specific statements when assembling formal §13：

1. A configured access-event-collaboration adapter contains exactly ten named `CapabilityOutboundRouteConfigRef` child slots；there isno wildcard/default route andno per-family `Disabled`。Fake andDisabled whole-Port branches carryno physical route refs。
2. `CapabilityOutboundRouteKind::try_from_candidate` performs one closed ten-arm application-schema match plus theexact source-union gate beforeConfigured / Fake / Disabled branching。Unknown orcontradictory persisted schema/source is`ConsistencyDefect(EventCaptureShape)`，never`NotConfigured`ortransport rejection。
3. The adapter selects aphysical route fromofficial `schema_ref`after source validation andtransmits thecomplete stored envelope bytes unchanged。It doesnot deserialize bytes、parse routing-key text、reload current truth orre-run a mapper / serializer。
4. Physical route material isinfra-only：it entersneither public envelope identity、logical routing key、`(source_ref,schema_ref)` uniqueness、candidate digest、local capture state norexternal outcome。The same stored candidate must produce thesame stable external intent across exact retry。
5. Route mapping iscompatibility material while matching captures may remain`Captured`。A destination change withoutsame-candidate same-intent proof isaproduct / migration blocker；v1 cannot addroute/version todigest orcapture andcannot assume retention makesold mappings disappear。
6. Source-owning application services retain exact capture refs only inoperation-local stable order andmay invoke collaboration only after source commit。The optional worker continuation acceptsone already selected exact ref andcalls onlythe shared application facade；it hasno repository、Port、UoW、mapper、serializer orscan authority。
7. Deferred/crash recovery remains`RepairCapabilityAccessEventCollaboration` application Job overofficial `AwaitingIntent` captures。No capture-ref broker、hidden queue、outbox、relay、attempt、DLQ orlocal delivery lifecycle isintroduced。
8. Configured、DeterministicFake andDisabled branches share thesame ten-arm schema/source classifier。Fake preserves exact bytes / stable intent / five-status / safe-failure parity；Disabled returns theexisting exact`NotConfigured`Port failure only fora structurally valid candidate。
9. All five collaboration statuses aretyped successful Port outcomes andmay bindthe stable intent。Raw failure leaves`Captured`；bind CAS / commit-unknown follows exact reload；an existing`IntentBound`capture calls external`get(existing intent)`only。
10. The ten event families keep theirStep 8 source exclusivity：six `Change`families、controlled-view-only derived source、identified impact、four-kind non-view derived source andcanonical reference-resolution source。No route may merge governance approval、method body、runtime/tools execution、SDK cache ormarketplace listing ownership intoCapability Hub。

## 59. Batch `14.4.3` Coverage、Self-check and Stop Review

### 59.1 Coverage arithmetic

| Coverage item | Expected | Actual | Missing / extra |
|---|---:|---:|---:|
| closed outbound event families | 10 | 10 | 0 / 0 |
| application schema-ref mappings | 10 | 10 unique literals | 0 / 0 |
| logical routing-key mappings | 10 | 10 unique literals | 0 / 0 |
| exact source-family gates | 10 | 10；six `Change` +controlled view +impact +four-kind derived union +reference | 0 / 0 |
| capture callable mappings | 10 | 10 | 0 / 0 |
| named configured route slots | 10 | 10 | 0 / 0 |
| route-kind classifier arms | 10 | 10 | 0 / 0 |
| collaboration binding branches | 3 | Configured / DeterministicFake / Disabled | 0 / 0 |
| typed collaboration status arms | 5 | Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable | 0 / 0 |
| worker-private continuation callables | 1 | 1 exact-ref callable | 0 / 0 |
| application Port / public protocol / durable owner additions | 0 | 0 | 0 / 0 |

Theten schema refs andlogical routing keys were mechanically compared withStep 8 §10.3；thetechnical source andcapture callable rows were compared withStep 8 §§10.4~10.5。`DerivedMaterialRefreshed` retains exactly four non-controlled-view source variants，and`ControlledConsumerViewAvailabilityChanged` remains family-exclusive。

### 59.2 Completion gate

| Gate | Result | Source / reason |
|---|---|---|
| outbound route binding schema | pass | §§53.1~53.3；ten named slots、closed classifier andtotal dispatch |
| configured/fake/disabled startup behavior | pass | §53.2；same classifier first、no partial configured graph、no physical refs onfake/disabled |
| route identity andmigration boundary | pass | §§53.4、56.3；route excluded fromcapture/digest/state，incompatible migration blocks product binding |
| source / worker / repair owner separation | pass | §§54.1~54.3；only exact-ref continuation，repair Job keeps deferred scan authority |
| ten family source/schema/capture closure | pass | §§55.1~55.11 and§59.1；10 /10，missing=0，extra=0 |
| typed outcome / error / reentry | pass | §§56.1~56.2；five statuses、raw failure、bind conflict / unknown andIntentBound get-only remain distinct |
| deterministic fake parity | pass | §57.1；same ten arms、bytes、identity、stable intent、statuses andsafe failures |
| governance/method/runtime/tools/SDK/marketplace boundary | pass | §§55.5~55.10、57.2；no owner merger orexecution/listing truth |
| configuration andformal handoff synchronization | pass | §§14.1、14.5、15.1~15.3、16、17、24、29、58.3 |
| Rustdoc / structure comment gate | pass | §58.2；every changed struct/field/enum/variant/callable documented |
| historical material / blocker | pass | §§57.2~57.3；unresolved upstream blocker=`0`，product gates remain explicit downstream conditions |
| scope discipline | pass | Operations Jobs、`14.5`、`14.6`、formal`03`andformal`04`not entered |
| evidence / implementation discipline | pass | no code、commit、run id、test result、evidence alias、acceptance sign-off、implementation ledger orboundary skeleton created orclaimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.4.3
gate_status = 03_step_14_batch_14_4_3_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
outbound_event_families_bound = 10/10
outbound_schema_refs_bound = 10/10
outbound_logical_routing_keys_bound = 10/10
outbound_source_gates_bound = 10/10
outbound_capture_callables_bound = 10/10
configured_outbound_route_slots = 10/10
worker_exact_capture_ref_continuation_callables = 1/1
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_4_4
```

Batch `14.4.3` iscomplete andstops forreview。After explicit user confirmation，the next allowed batch is`14.4.4`：read Step 8 §11、Step 9 §§35~39、Step 11 Job journal / target transaction contract、Step 12 §§40~44 andStep 13 Job reentry rules，then bind the eight closed Operations Job runners、entry parameters、trigger / schedule references andunavailability behavior。Do not enter`14.5`、`14.6`、formal`03`assembly orformal`04`inthat batch。

---

## 60. Batch `14.4.4` 开工输入、SOP 回答与设计取舍

> Historical snapshot boundary: §§60~66 record the state accepted at batch `14.4.4` only and are not a cumulative implementation source after `14.5.2.2.3`。The active contract in §§107~116 incorporates only the unchanged closed schema inventory from §§61.1~61.3，the delivery / typed-response unions from §62.4 and the eight-way protocol table from §§63.2~63.3。It replaces the runtime declarations and behavior in §§62.1~62.3，the borrowed-`self` runner surface in §63.1 and all timeout / retry procedure wording in §64。An implementation must not declare both §62.1 and §110.2 `CapabilityJobsRuntime` types，must not combine the §63.1 `&self` runner signatures with the owned-future signatures in §111.3，and must not restore the §62.3 infra-owned handler graph。

### 60.1 读取门禁与本批输入

本批在用户确认 `14.4.4` 后启动。读取范围固定为 Step 8 §11 的八张 Operations Job protocol card、Step 9 §§35~39 的八条函数级 flow、Step 11 的 Job initial / target / final UoW 与 crash recovery、Step 12 §§40~44 的 safe terminalization 与 typed report mapping、Step 13 的 normalized key / journal / target CAS / exact reentry，以及本文件 §§23、28、47、54 的 jobs 参数和 entry owner。`14.5` 的完整 Cargo member 矩阵和 `14.6` 的最终收口不在本批。

| 输入 | 已确认事实 | `14.4.4` 必须闭合 | 本批不得改变 |
|---|---|---|---|
| Step 8 §11 | 八个 Job 各自已有 request input、typed detail、handler、application service、schema `1`、logical trigger 和独立 flow | jobs entry 的 closed dispatch、八个 typed runner、trigger/handler/input/result 对称性 | 不新增 Job、request field、report detail、Port 或 public error |
| Step 9 §§35~39 | application service 自己拥有完整 planning、journal、target、final 和 replay 算法 | runner 只负责边界校验、完整 request 透传、facade 调用和 delivery/process mapping | 不在 jobs crate 重扫 scope、重建 digest、生成 target、读取 repository 或拼报告 |
| Step 11 | initial reservation + complete plan、per-target UoW、final-report UoW 是三个独立原子边界 | runner deadline 不改变 UoW 结果；unknown 只进入既有 recovery | 不把一个超时 target 直接终态化，不回滚已提交 target |
| Step 12 | typed `CapabilityJobProtocolDisposition::Retryable` 是可持久化的本次 run 终态；普通 `ApplicationError` 仍是 technical error | 只允许有明确 durable recovery proof 的未定型 technical return 进入 runner retry | 不从错误文本、`ApplicationError` 名称或 typed `Retryable` 推导重试许可 |
| Step 13 | 同一 normalized key / digest / run / journal 只允许 exact reentry；已完成报告只读 replay | retry 使用同一原始 bytes、同一 request、同一 run/key；应用 flow 决定是否安全 | 不新建 run/key、scope、cursor、attempt 表、lease、checkpoint 或 run finder |
| Step 14 §§23、28 | jobs entry 已有 `request_body_limit`、`planning_page_limit`、`run_timeout`、`runner_retry`；target parallelism 固定为 `1` | 明确四项参数的消费点与不进入 public request 的边界 | 不把 planning page、timeout、retry、scheduler 物化为 protocol 字段或 journal state |

### 60.2 SOP 八问在本批的裁决

| SOP 问题 | `14.4.4` 裁决 |
|---|---|
| 哪个层读取 jobs 配置？ | 只有 `infra/config.rs` 在 startup 形成 validated `CapabilityJobsEntryParameters`，`infra/runtime_builder.rs` 将其消费为 jobs facade / runner graph。`jobs` 不读取 raw config、section ref、repository 或 external adapter。 |
| 如何选择八个 Job？ | 采用一个 closed `CapabilityJobsDispatchKind` 八臂 union。触发器、`metadata.job_name`、schema `1` 和具体 typed body 必须全部相等；未知或交叉组合在 application 前拒绝。 |
| runner 接收哪些值？ | 接收已完成 byte-bound 的原始 request bytes，或由同一入口生成的完整 typed request；`run_id`、actor、trace、idempotency key、scope、targets 全部来自 request。runner 不生成或覆盖这些值。 |
| planning page 如何使用？ | `planning_page_limit` 是 assembly-time primitive，注入 application Job facade/service 的内部 scan policy；它不进入 `CapabilityJobRequest<T>`、canonical request bytes、digest、cursor、scope 或 journal。 |
| scheduler / cron / queue 属于谁？ | 属于部署或宿主进程。逻辑 trigger 只确定协议身份；本批只规定 one-shot runner 可被任意宿主调用，不定义 scheduler state、cron key、queue message、lease 或 acknowledgement protocol。 |
| 哪些返回可以 runner retry？ | 只有 application 尚未形成 typed response，且同一 exact invocation 已经过 journal / commit / effect boundary 的安全重入证明；runner 可重放完全相同的 encoded bytes。typed `Retryable`、plain `ApplicationError`、`CommitOutcomeUnknown`、consistency/codec/rollback failure 均不自动重试。 |
| 依赖不可用如何表达？ | startup 构造失败为 `InfraError::RuntimeAssembly`；显式 Disabled external Port 由 application 产生既有 `NotConfigured`；resolver/collaboration 的合法 typed unavailable 或 Job 的 `Retryable` 由 application 原样返回。runner 不伪造空报告或降级成功。 |
| 八个 Job 是否各自有配置 mode？ | 没有。Jobs entry 是一个支持八个 closed kinds 的入口；不存在 per-Job Configured/Fake/Disabled。一次调用未选择某 Job 就没有该 Job effect；fake/disabled 只属于底层 external Port binding。 |

### 60.3 取舍与可落码结论

1. 采用一个 dispatcher + 八个 typed one-shot runner，而不是按 trigger 字符串反射或八套重复 runtime。这样能在编译期保留 8/8 coverage，同时把 header gate、deadline、retry proof 和 process-exit mapping 置于一个 owner。
2. 采用借用 `serde_json::value::RawValue` 的入口载体只做 bounded/header-first dispatch；完成具体 typed decode 后立即丢弃 carrier。jobs entry 不保存 raw body，也不以 generic JSON map 代替八个闭合 DTO。
3. runner 将完整 `CapabilityJobRequest<T>` 不变地交给对应 application handler。application 返回完整 typed `CapabilityJobResponse<R>`；runner 不改 disposition、report、issue、ref、state 或 result variant。
4. `planning_page_limit` 通过 application constructor/facade primitive 注入，而不是加入 public request。否则相同业务请求会因部署参数变化而产生不同 digest，破坏 Step 13 identity。
5. 保留现有七个 jobs source files；两个 reconciliation Job 继续由 `crates/jobs/src/reconciliation.rs` 承载 shared runner wiring，不因八个 logical Job 强行新增第八个文件或新 crate。

本批的新增内容均为 entry-local / jobs-local assembly contract，不改变 `43 + 7` objects/helpers、36 Ports、22/110 repository traits/methods、250 public protocol types、83 protocols/flows 或 24 state-like enums / 111 active variants / 638 ordered pairs。

## 61. Jobs-local Header-first Gate、Closed Kind 与 Dispatch Declarations

### 61.1 Header-first 解码顺序

Jobs runner 必须在 concrete body decode 前完成字节上限和 envelope header gate。header 只读取既有 `CapabilityJobMetadata` 的 closed fields；它不生成新的业务字段，也不允许从 trigger、CLI 参数或 transport metadata 覆盖 request authority。

```text
1. Read one complete request byte sequence from the host boundary.
2. Reject bytes whose length exceeds CapabilityJobsEntryParameters.request_body_limit;
   do not allocate or decode a concrete body.
3. Decode only the closed job header carrier with deny-unknown-fields semantics.
4. Require metadata.job_name, metadata.schema_version, run_id, idempotency_key,
   actor_context and trace_id to be present and structurally valid.
5. Require schema_version == 1 and map job_name to exactly one closed dispatch arm.
6. Decode the body only into that arm's exact JobInput type; no generic map or fallback DTO.
7. Validate trigger == job_name == operation == concrete body type and preserve the
   complete CapabilityJobRequest<T> unchanged.
8. Invoke the exact handler; map only JobError / process-delivery outcome at the edge.
```

A malformed header, unknown field, oversize byte sequence, unsupported schema, unknown job name or body/type mismatch returns `JobError::Source` with the existing `JobSourceKind::{JobInput, UnsupportedSchema}` mapping. It does not call Clock, IdGenerator, `CapabilityOperationContext::from_job`, repository, resolver, Port, UoW or application Job service. A valid header followed by a malformed concrete body also remains an entry error and never becomes a journal-backed `Failed` report.

The header carrier is jobs-local and may borrow `RawValue` only for the current invocation:

```rust
/// Jobs-local header decoded before selecting one concrete operations-job body.
pub(crate) struct CapabilityJobsHeaderFirstEnvelope<'a> {
    /// Closed operations-job metadata supplied by the request authority.
    metadata: CapabilityJobMetadata,
    /// Exact undecoded body retained only until the selected typed decoder runs.
    #[serde(borrow)]
    body: &'a serde_json::value::RawValue,
}
```

The struct and both fields require the shown English `///` Rustdoc. It is not a public protocol type, is not persisted or hashed independently, and does not become a second header schema. The typed request's existing canonical encoder remains the only request digest source.

### 61.2 Closed dispatch kind and typed carriers

```rust
/// Closed jobs-entry dispatch identity for the eight operations-job protocols.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum CapabilityJobsDispatchKind {
    /// Dispatches registry-centered reconciliation.
    RunCapabilityRegistryReconciliation,
    /// Dispatches controlled consumer-view refresh.
    RefreshControlledConsumerView,
    /// Dispatches directory search and browse projection rebuild.
    RebuildDirectorySearchBrowseProjection,
    /// Dispatches audit-friendly export-summary preparation.
    PrepareAuditFriendlyExportSummary,
    /// Dispatches read-only ecosystem discovery-summary rebuild.
    RebuildReadOnlyEcosystemDiscoverySummary,
    /// Dispatches derived-material reconciliation.
    RunDerivedMaterialReconciliation,
    /// Dispatches external-reference resolution refresh.
    RefreshExternalReferenceResolution,
    /// Dispatches capability access-event collaboration repair.
    RepairCapabilityAccessEventCollaboration,
}

/// One decoded request body selected by the closed dispatch kind.
pub(crate) enum CapabilityJobsDecodedBody {
    /// Body for registry-centered reconciliation.
    RunCapabilityRegistryReconciliation(
        /// Exact typed registry-reconciliation input.
        RunCapabilityRegistryReconciliationJobInput,
    ),
    /// Body for controlled consumer-view refresh.
    RefreshControlledConsumerView(
        /// Exact typed controlled-view input.
        RefreshControlledConsumerViewJobInput,
    ),
    /// Body for directory projection rebuild.
    RebuildDirectorySearchBrowseProjection(
        /// Exact typed directory-rebuild input.
        RebuildDirectorySearchBrowseProjectionJobInput,
    ),
    /// Body for audit-friendly export preparation.
    PrepareAuditFriendlyExportSummary(
        /// Exact typed audit-export input.
        PrepareAuditFriendlyExportSummaryJobInput,
    ),
    /// Body for ecosystem discovery rebuild.
    RebuildReadOnlyEcosystemDiscoverySummary(
        /// Exact typed ecosystem-discovery input.
        RebuildReadOnlyEcosystemDiscoverySummaryJobInput,
    ),
    /// Body for derived-material reconciliation.
    RunDerivedMaterialReconciliation(
        /// Exact typed derived-material-reconciliation input.
        RunDerivedMaterialReconciliationJobInput,
    ),
    /// Body for external-reference refresh.
    RefreshExternalReferenceResolution(
        /// Exact typed reference-refresh input.
        RefreshExternalReferenceResolutionJobInput,
    ),
    /// Body for event-collaboration repair.
    RepairCapabilityAccessEventCollaboration(
        /// Exact typed collaboration-repair input.
        RepairCapabilityAccessEventCollaborationJobInput,
    ),
}
```

`CapabilityJobsDispatchKind` is the only accepted jobs kind classifier. `CapabilityJobsDecodedBody` is an entry-local union of existing public input types; it adds no protocol variant. Every enum, variant and tuple payload has an English `///` comment. No variant has a public field declaration inside the entry-local union.

The dispatcher must expose total typed mappings equivalent to the following design signatures:

```rust
impl CapabilityJobsDispatchKind {
    /// Selects one closed dispatch kind from the validated job name.
    pub(crate) fn from_job_name(name: &CapabilityJobName) -> Result<Self, JobError>;

    /// Returns the only supported schema version for this dispatch kind.
    pub(crate) fn schema_version(&self) -> CapabilityProtocolSchemaVersion;

    /// Returns the exact trigger literal for this dispatch kind.
    pub(crate) fn trigger_literal(&self) -> &'static str;
}

impl CapabilityJobsDecodedBody {
    /// Returns the closed dispatch kind represented by this typed body.
    pub(crate) fn kind(&self) -> CapabilityJobsDispatchKind;
}
```

Each callable has English `///` Rustdoc. `from_job_name` is an exhaustive typed mapper, not a string-prefix dispatcher; `schema_version` always returns `CapabilityProtocolSchemaVersion(1)`; `trigger_literal` is a fixed logical trigger lookup and cannot read configuration or a scheduler alias.

### 61.3 Exact eight trigger literals

| Dispatch kind | Logical trigger | Existing handler | Existing typed request -> response |
|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | `capability-hub.job.run-capability-registry-reconciliation.v1` | `CapabilityOperationsJobHandlers::run_capability_registry_reconciliation` | `CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>` -> `CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>` |
| `RefreshControlledConsumerView` | `capability-hub.job.refresh-controlled-consumer-view.v1` | `CapabilityOperationsJobHandlers::refresh_controlled_consumer_view` | `CapabilityJobRequest<RefreshControlledConsumerViewJobInput>` -> `CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>` |
| `RebuildDirectorySearchBrowseProjection` | `capability-hub.job.rebuild-directory-search-browse-projection.v1` | `CapabilityOperationsJobHandlers::rebuild_directory_search_browse_projection` | `CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>` -> `CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>` |
| `PrepareAuditFriendlyExportSummary` | `capability-hub.job.prepare-audit-friendly-export-summary.v1` | `CapabilityOperationsJobHandlers::prepare_audit_friendly_export_summary` | `CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>` -> `CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>` |
| `RebuildReadOnlyEcosystemDiscoverySummary` | `capability-hub.job.rebuild-read-only-ecosystem-discovery-summary.v1` | `CapabilityOperationsJobHandlers::rebuild_read_only_ecosystem_discovery_summary` | `CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>` -> `CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>` |
| `RunDerivedMaterialReconciliation` | `capability-hub.job.run-derived-material-reconciliation.v1` | `CapabilityOperationsJobHandlers::run_derived_material_reconciliation` | `CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>` -> `CapabilityJobResponse<DerivedMaterialReconciliationJobResult>` |
| `RefreshExternalReferenceResolution` | `capability-hub.job.refresh-external-reference-resolution.v1` | `CapabilityOperationsJobHandlers::refresh_external_reference_resolution` | `CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>` -> `CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>` |
| `RepairCapabilityAccessEventCollaboration` | `capability-hub.job.repair-capability-access-event-collaboration.v1` | `CapabilityOperationsJobHandlers::repair_capability_access_event_collaboration` | `CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>` -> `CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>` |

The table is a design inventory, not a claim that any trigger has run. Physical scheduler names, cron expressions, queue subjects, process arguments and acknowledgement values remain host/deployment concerns. A host may invoke the same one-shot runner directly, but it may not alter the logical trigger or typed request identity.

## 62. Runner Constructor、入口拓扑与外部 Scheduler 边界

### 62.1 Constructor inputs and ownership

The jobs graph is assembled only after the local/base Port graph and nine external Port graph are complete. The runner receives an application handler facade and validated technical primitives; it never receives raw config, config refs, repositories, UoW manager, resolver, collaboration Port, scheduler client or physical transport.

```rust
/// Jobs-entry dependency graph assembled by infra and consumed by one-shot runners.
pub(crate) struct CapabilityJobsRuntime {
    /// Application handler facade implementing all eight closed job methods.
    handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
    /// Maximum encoded request size checked before typed decoding.
    request_body_limit: usize,
    /// Internal planning page size already bound into the application facade.
    planning_page_limit: u32,
    /// Whole-run deadline for one one-shot invocation.
    run_timeout: std::time::Duration,
    /// Technical retry policy available only to the safe reentry wrapper.
    runner_retry: CapabilityRetryPolicy,
}
```

All five struct fields and the struct itself require English `///` Rustdoc. `planning_page_limit` is retained here only as assembly provenance; the runner does not place it in a request or digest. The builder must pass the same value to the application Job facade constructor before exposing `CapabilityJobsRuntime`, and the runner must not independently page repositories.

```rust
impl CapabilityJobsRuntime {
    /// Constructs the jobs entry from an already assembled application handler facade.
    pub(crate) fn new(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        parameters: &CapabilityJobsEntryParameters,
    ) -> Result<Self, InfraError>;

    /// Runs one complete encoded Job request through the closed dispatcher.
    pub(crate) async fn run_once(
        &self,
        request_bytes: &[u8],
    ) -> CapabilityJobsDelivery;
}
```

Both callables require English `///` Rustdoc. `new` only validates assembly inputs already validated by `infra/config.rs`; a missing handler or invalid primitive is `InfraError::RuntimeAssembly`. `run_once` owns header-first dispatch and calls exactly one typed handler for one invocation.

### 62.2 One-shot call graph

```text
host scheduler / cron / queue / manual process
  -> supplies one complete request byte sequence
  -> jobs::CapabilityJobsRuntime::run_once
       -> byte limit + header-first envelope
       -> exact job-name/schema/body classifier
       -> one CapabilityJobsDispatchKind arm
       -> one typed CapabilityJobRequest<T>
       -> one CapabilityOperationsJobHandlers method
            -> CapabilityOperationsJobService method
                 -> existing Step 9 planning / journal / target / final algorithm
       <- complete CapabilityJobResponse<R> or JobError::Application
       -> delivery/process-exit mapping only
  <- CapabilityJobsDelivery
```

The host trigger is outside the capability-hub protocol. The runner does not acknowledge a message before the application response or technical error is classified, but it also does not create a durable acknowledgement record. Process exit or scheduler acknowledgement must be a pure mapping of `CapabilityJobsDelivery`; it cannot change `CapabilityJobProtocolDisposition`, create a report, or retry a target.

### 62.3 Runtime assembly and crate direction

```text
infra::runtime_builder
  -> consumes validated jobs entry parameters
  -> injects planning_page_limit into application Job facade/service
  -> constructs Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>
  -> passes the facade to jobs::CapabilityJobsRuntime

jobs crate
  -> depends directly on application / infra / contracts only
  -> consumes core-owned metadata only through contracts-owned typed carriers
  -> does not depend on worker or api

host binary / scheduler
  -> owns physical trigger, process lifetime and acknowledgement
  -> does not provide run_id, actor, trace, key, scope or target outside request body
```

This preserves the Step 5 dependency direction and the existing `crates/jobs/src/*.rs` layout. `infra` may expose a cycle-free generic/callback assembly hook in `14.5`, but it may not import `capability-hub-jobs` merely to move dispatch into infra, and jobs may not read config to compensate for the crate boundary.

### 62.4 Delivery carrier

The runner needs a jobs-local delivery carrier so process-exit mapping cannot be confused with the public Job response. `run_once` returns this total carrier rather than a second `Result` channel:

```rust
/// Jobs-local result delivered to a host process or scheduler after one invocation.
pub(crate) enum CapabilityJobsDelivery {
    /// The application produced a complete typed Job response.
    Response(
        /// Complete typed response returned by the selected application handler.
        CapabilityJobsTypedResponse,
    ),
    /// The entry rejected or could not safely dispatch the request.
    TechnicalError(
        /// Thin jobs-local error preserving the existing source classification.
        JobError,
    ),
}

/// Entry-local erased carrier used only after one closed typed response is formed.
pub(crate) enum CapabilityJobsTypedResponse {
    /// Typed registry-reconciliation response.
    RunCapabilityRegistryReconciliation(
        /// Complete response for the registry-reconciliation Job.
        CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>,
    ),
    /// Typed controlled-view response.
    RefreshControlledConsumerView(
        /// Complete response for the controlled-view Job.
        CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>,
    ),
    /// Typed directory-projection response.
    RebuildDirectorySearchBrowseProjection(
        /// Complete response for the directory-projection Job.
        CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>,
    ),
    /// Typed audit-export response.
    PrepareAuditFriendlyExportSummary(
        /// Complete response for the audit-export Job.
        CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>,
    ),
    /// Typed ecosystem-discovery response.
    RebuildReadOnlyEcosystemDiscoverySummary(
        /// Complete response for the ecosystem-discovery Job.
        CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>,
    ),
    /// Typed derived-reconciliation response.
    RunDerivedMaterialReconciliation(
        /// Complete response for the derived-reconciliation Job.
        CapabilityJobResponse<DerivedMaterialReconciliationJobResult>,
    ),
    /// Typed reference-refresh response.
    RefreshExternalReferenceResolution(
        /// Complete response for the reference-refresh Job.
        CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>,
    ),
    /// Typed event-collaboration response.
    RepairCapabilityAccessEventCollaboration(
        /// Complete response for the event-collaboration Job.
        CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>,
    ),
}
```

Every struct-like/tuple declaration, variant and payload has an English `///` Rustdoc. The `CapabilityJobsTypedResponse` union is an entry-local exhaustiveness carrier over existing public response types; it is never serialized, persisted, used to choose a decoder, or exposed as a generic public response. A response whose variant, `job_name`, schema, run id or detail type is asymmetric is a `JobError::Source(JobSourceKind::JobResultMapping)` and cannot be downgraded to a failed report.

## 63. 八个 typed runner 声明与逐 Job 绑定

### 63.1 Runner callable surface

`CapabilityJobsRuntime::run_once` 只负责选择一个 `CapabilityJobsDispatchKind`，随后把完整的 typed request 交给一个对应的 one-shot runner。下面八个 callable 是 jobs crate 的内部 runner surface；它们不新增 application Port，也不在 jobs crate 中重做 Step 9 的 planning、journal、target 或 final-report 算法。

```rust
impl CapabilityJobsRuntime {
    /// Runs one registry-centered reconciliation request after header validation.
    async fn run_registry_reconciliation(
        &self,
        request: CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one controlled consumer-view refresh request after header validation.
    async fn run_controlled_consumer_view_refresh(
        &self,
        request: CapabilityJobRequest<RefreshControlledConsumerViewJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one directory search and browse projection rebuild request after header validation.
    async fn run_directory_search_browse_projection_rebuild(
        &self,
        request: CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one audit-friendly export-summary preparation request after header validation.
    async fn run_audit_friendly_export_preparation(
        &self,
        request: CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one read-only ecosystem discovery-summary rebuild request after header validation.
    async fn run_ecosystem_discovery_rebuild(
        &self,
        request: CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one derived-material reconciliation request after header validation.
    async fn run_derived_material_reconciliation(
        &self,
        request: CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one external-reference resolution refresh request after header validation.
    async fn run_external_reference_resolution_refresh(
        &self,
        request: CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;

    /// Runs one capability access-event collaboration repair request after header validation.
    async fn run_capability_access_event_collaboration_repair(
        &self,
        request: CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>,
    ) -> Result<CapabilityJobsTypedResponse, JobError>;
}
```

每个 runner 的实现只能执行以下四个动作：

1. 接收已经通过 header gate 的完整 request，并再次确认 request 的 `job_name`、schema、operation、body variant 和 runner kind 对称。
2. 将同一个 `CapabilityJobRequest<T>` 原样交给对应的 `CapabilityOperationsJobHandlers` callable；不得抽取字段后重新构造 request。
3. 对 application 返回的完整 `CapabilityJobResponse<R>` 执行对应的 `CapabilityJobsTypedResponse` variant mapping，并校验 response metadata 与 request identity 对称。
4. 将 jobs-local `JobError` 保持在入口边界；不得把它重写成一个新的 Job report、`CapabilityJobProtocolDisposition` 或 scheduler-specific retry category。

这些 runner 不接收 `CapabilityOperationContext`、`CapabilityJobExecutionRepository`、任何 repository、resolver、collaboration Port、Clock、IdGenerator、scheduler client 或 physical transport。`CapabilityOperationContext::from_job` 仍由 application Job service 在它拥有完整 typed request 后构造；runner 不生成 `run_id`、actor、trace、idempotency key、scope、target 或 result ref。

### 63.2 Exact per-Job dispatch table

| # | dispatch kind | fixed logical trigger | typed runner callable | handler | request -> response | Step 9 flow | local effect / forbidden effect |
|---:|---|---|---|---|---|---|---|
| 1 | `RunCapabilityRegistryReconciliation` | `capability-hub.job.run-capability-registry-reconciliation.v1` | `run_registry_reconciliation` | `CapabilityOperationsJobHandlers::run_capability_registry_reconciliation` | `CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>` -> `CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>` | `job_run_capability_registry_reconciliation_flow` | 可追加 registry-centered reconciliation report；不得创建、修复、更新或退休 registry truth，不得把 report 映射成 `CapabilityRegistryChanged` |
| 2 | `RefreshControlledConsumerView` | `capability-hub.job.refresh-controlled-consumer-view.v1` | `run_controlled_consumer_view_refresh` | `CapabilityOperationsJobHandlers::refresh_controlled_consumer_view` | `CapabilityJobRequest<RefreshControlledConsumerViewJobInput>` -> `CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>` | `job_refresh_controlled_consumer_view_flow` | 只写 controlled consumer view 的最终 `Ready` / `Partial` surface；不得改变 formal exposure、consumer registration、runtime cache 或 SDK package |
| 3 | `RebuildDirectorySearchBrowseProjection` | `capability-hub.job.rebuild-directory-search-browse-projection.v1` | `run_directory_search_browse_projection_rebuild` | `CapabilityOperationsJobHandlers::rebuild_directory_search_browse_projection` | `CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>` -> `CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>` | `job_rebuild_directory_search_browse_projection_flow` | 只从冻结的 registry/descriptor/exposure chain 写 directory projection；不得回写 registry、调用 marketplace listing 或读取 provider runtime |
| 4 | `PrepareAuditFriendlyExportSummary` | `capability-hub.job.prepare-audit-friendly-export-summary.v1` | `run_audit_friendly_export_preparation` | `CapabilityOperationsJobHandlers::prepare_audit_friendly_export_summary` | `CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>` -> `CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>` | `job_prepare_audit_friendly_export_summary_flow` | 只形成 body-free audit export summary；不得保存 raw audit body、evidence alias、验收签署、secret 或 external ledger body |
| 5 | `RebuildReadOnlyEcosystemDiscoverySummary` | `capability-hub.job.rebuild-read-only-ecosystem-discovery-summary.v1` | `run_ecosystem_discovery_rebuild` | `CapabilityOperationsJobHandlers::rebuild_read_only_ecosystem_discovery_summary` | `CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>` -> `CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>` | `job_rebuild_read_only_ecosystem_discovery_summary_flow` | 只形成 read-only discovery summary；不得创建 marketplace listing、pricing、transaction、fulfillment 或 runtime route truth |
| 6 | `RunDerivedMaterialReconciliation` | `capability-hub.job.run-derived-material-reconciliation.v1` | `run_derived_material_reconciliation` | `CapabilityOperationsJobHandlers::run_derived_material_reconciliation` | `CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>` -> `CapabilityJobResponse<DerivedMaterialReconciliationJobResult>` | `job_run_derived_material_reconciliation_flow` | 只比较冻结 truth/material basis 并记录 report；不得自动修复 core truth、material 或触发另一 Job |
| 7 | `RefreshExternalReferenceResolution` | `capability-hub.job.refresh-external-reference-resolution.v1` | `run_external_reference_resolution_refresh` | `CapabilityOperationsJobHandlers::refresh_external_reference_resolution` | `CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>` -> `CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>` | `job_refresh_external_reference_resolution_flow` | 只调用 kind-matched body-free resolver并更新 canonical resolution state；不得保存 external body、重写 locator、修改 relation/exposure 或把 `Created` 当作 refresh 成功 |
| 8 | `RepairCapabilityAccessEventCollaboration` | `capability-hub.job.repair-capability-access-event-collaboration.v1` | `run_capability_access_event_collaboration_repair` | `CapabilityOperationsJobHandlers::repair_capability_access_event_collaboration` | `CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>` -> `CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>` | `job_repair_capability_access_event_collaboration_flow` | 只复用 official capture/snapshot 或既有 external intent；不得重建 envelope、再次 capture、创建第二 intent 或复制 external delivery state |

表中八行必须是闭合一一映射。实现不得按 handler 名、Rust type 名、文件名、CLI alias 或 physical schedule 名称做动态 fallback；任一缺失、交叉或多重匹配都属于 `JobError::Source(JobSourceKind::JobInput)` 或 `JobResultMapping`，不进入 application。

### 63.3 Trigger、host schedule 与 request identity

| identity 层 | owner | 是否进入 request bytes / digest / journal | exact rule |
|---|---|---|---|
| logical Job trigger | `contracts` + closed dispatcher | 是，作为既有 Job metadata / operation 对称性的一部分 | 只接受八个固定 `.v1` literal；不能由配置替换 |
| physical scheduler / cron / queue name | deployment host | 否 | host 可以将一个 schedule ref 绑定到一个 logical trigger，但不能改 request 的 job name、schema、run、key 或 body |
| host schedule reference | deployment/config host | 否 | 只用于启动哪个 one-shot process；不作为 `CapabilityJobExecutionRecord` 的字段，不参与 canonical digest |
| `run_id` | request authority / application Job context | 是，作为 exact run fence，但不进 request digest | runner 不生成、覆盖或从 schedule 推导；同 key 不同 run 不是自动 takeover |
| idempotency key / scope / target list | request authority | key/scope/targets 按 Step 13 规则进入相应 identity；不由 runner 参数覆盖 | `planning_page_limit`、timeout、retry、schedule 不得成为这些字段的替代品 |

因此，Step 14 只绑定 jobs entry 的 one-shot runner policy；`04-配置设计.md` 可以定义 host schedule section 的 raw source 和 deployment mapping，但不能把 schedule 变成 Capability Hub 的业务状态、lease、attempt、queue message 或 acknowledgement protocol。

## 64. Timeout、retry、reentry、delivery 与依赖不可用

### 64.1 Whole-run deadline 与 phase deadline

`CapabilityJobsEntryParameters.run_timeout` 是一次 `run_once` 的 whole-run deadline。计时覆盖 bounded byte check、header-first decode、exact body decode、typed dispatch、application handler invocation 和最终 response/error mapping；它不改变 application 内部 initial / target / final UoW 的语义，也不授予 runner 直接终止或终态化 target 的权限。

| deadline 位置 | 允许动作 | 超时结果 | 禁止动作 |
|---|---|---|---|
| byte/header/body decode 前 | 立即停止解析并返回 jobs-local source error | 无 reservation、journal、Clock、IdGenerator、Port 或 application call | 分配 run、创建 failed report、把 malformed body 变成 target failure |
| application handler 尚未开始 | 返回 `JobError::Source(JobSourceKind::ApplicationDispatch)`，保留非公开 source chain | 无业务 effect；host 可修正进程调度后重新提交 exact request | 从 timeout 文本推导 `Retryable` response |
| application handler 已开始且尚未形成 typed response | 等待 application 的 cooperative cancellation / transaction recovery boundary；不能强行丢弃 future | 若 application 返回既有 typed error，按 §64.2；若无法证明 durable outcome，保留 `CommitOutcomeUnknown` / exact technical error | runner 自行 rollback、写 journal、终态化 target 或继续下一 ordinal |
| external Port call | 使用 `min(external_port_call, remaining whole-run deadline)` | Port 只返回既有 `Timeout` 或合法 typed unavailable/outcome | 延长 whole-run deadline、改写 source identity、把 timeout 当永久失败 |
| target UoW commit / rollback / resolve | 使用已有 UoW / authority resolution contract | unknown 继续是 `CommitOutcomeUnknown`；rollback failure 继续是 `TransactionRollbackFailed` | 一次 `None`、caller timeout、replica absence 被解释为 `NotDurable` |
| final report UoW | 只允许纯 assembler + final atomic save | 未完成时 journal 保持 `Planned` / all-terminal-unfinalized，后续 exact reentry 由 application 决定 | 根据已提交 target 数量重建 report、回滚先前 target 或生成第二 result ref |

runner deadline 到期时，process-exit / host acknowledgement 只能映射已经形成的 `CapabilityJobsDelivery`。它不能把“进程没有收到 response”解释成失败 target，也不能把“handler future 被取消”解释成 rollback 成功。若 concrete runtime 无法提供 cooperative cancellation 与 authority resolution，应在 runtime assembly 阶段拒绝该 binding，而不是静默启用强制 abort。

### 64.2 Retry authorization matrix

`runner_retry` 只提供一个 bounded attempt budget 和 delay policy；它不是 retry authorization。当前已有的 `CapabilityOperationsJobHandlers` 返回面中，没有任何 plain `ApplicationError` 或公开 `CapabilityJobProtocolDisposition` 可以单独授权 runner 自动重放。

| runner 观察到的结果 | runner 是否自动 retry | 交付 / 后续动作 | 原因 |
|---|---|---|---|
| 完整 `CapabilityJobResponse`，包括 `Completed`、`PartiallyCompleted`、`Failed`、`Retryable`、`DuplicateReplayed` 或 `Rejected` | 否 | 包装为对应 `CapabilityJobsTypedResponse` 并交付 | typed response 已是 application 对本次 run 的完整终态；`Retryable` 是可持久化的本次 run 终态，不是 runner 指令 |
| header、schema、job name、body 或 response variant mapping error | 否 | `CapabilityJobsDelivery::TechnicalError(JobError::Source(...))` | 输入/映射错误没有合法 application invocation，不能创建 report 或靠重试修复 |
| plain `JobError::Application(ApplicationError::PortFailure { .. })` | 否，除非另有 jobs-local durable proof | 保持 exact `JobError`；由 host/operator 按既有 recovery 规则处理 | `TemporarilyUnavailable` / `Timeout` 只是 eligible class，不是 runner authorization |
| `OptimisticConflict` 或 `UniquenessConflict` | 否，除非 application 已完成确认 rollback、exact reload 并提供未定型安全重入证明 | 保持现有 error 或由 application flow 自己完成声明的 bounded contention retry | runner 不拥有 owner reload、winner classification 或 UoW |
| `TransactionCommitFailed`、`TransactionRollbackFailed`、`CommitOutcomeUnknown`、`ConsistencyDefect`、`CodecFailure` | 否 | technical delivery；保留既有 recovery authority | 这些结果不能由 runner 猜测为 zero-effect 或 safe replay |
| run deadline / cancellation 没有形成 typed response | 否，除非同一 invocation 有 durable proof | technical delivery；exact request 可由 host 后续重入，仍由 application journal裁决 | “没有 response”不是 proof，也不是 `Retryable` |
| jobs-local private invocation boundary 同时给出“未形成 typed response”和“同一 exact invocation 可安全 reentry”的 durable proof | 仅在 proof 验证通过且 attempt budget 未耗尽时 | 原始 request bytes、同一 run、同一 key、同一 digest 原样重放；耗尽后交付 technical error | proof 必须来自现有 journal / transaction authority；不能由错误文本或配置 flag伪造 |

本批不新增一个 public retry protocol、application Port、repository method、persistent attempt field 或第二 error variant。若实现需要承载最后一行的内部 proof，只能使用 jobs crate 内部、非持久化的 invocation-local carrier；该 carrier 必须逐项有英文 `///`，只允许携带 exact request identity、未定型 phase 和已经形成的 typed durable-proof marker，不得携带 raw error、raw body、credential、scope 重算结果或 transport status。它不能改变现有 `CapabilityOperationsJobHandlers` public signature，也不能把 plain `ApplicationError` 自动升级为 proof。

### 64.3 Exact retry / reentry procedure

仅当 §64.2 最后一行的 private proof 已存在时，runner 才可以执行下列 bounded procedure；没有 proof 时 `runner_retry` 的有效授权次数为零，host 可以稍后提交同一 bytes，但那是新的 entry invocation，不是 runner 在本次调用内的自动 retry。

```text
original request bytes
  -> header/body validation exactly once per attempt
  -> same job name / schema / operation / run_id / key / digest
  -> one typed application invocation
  -> no typed response + durable proof of safe exact reentry
       -> apply bounded delay within remaining run_timeout
       -> replay the identical bytes; do not regenerate any identity
  -> typed response
       -> return response; never retry its disposition
  -> proof absent or budget exhausted
       -> return the original typed JobError / technical source
```

每次重放必须满足：

- 不重新解析 CLI、schedule、transport metadata 来覆盖 request authority。
- 不生成新的 `run_id`、idempotency key、scope、cursor、target、report id、capture id 或 result ref。
- 不重新展开 `All*` scope，不扫描 current truth，不重排 frozen journal，不跳过较早 Planned ordinal。
- 不改变 `planning_page_limit`、deadline、retry policy 后再计算 digest；这些值只属于 assembly/runtime policy。
- application 仍然以 normalized-key journal 为唯一 recovery authority：`Completed + Finalized` 只 replay，`Reserved + Planned` 只从 frozen plan 继续，asymmetry 直接 `ConsistencyDefect`。

### 64.4 Dependency-unavailable mapping

| 不可用位置 | startup / invocation 处理 | 是否创建 Job report | 是否允许 fake fallback |
|---|---|---:|---|
| local persistence authority、UoW、required handler facade 缺失 | `InfraError::RuntimeAssembly`，不启动 jobs runtime | 否 | 否；只能由显式 Local/Integration fake profile 在 assembly 前选择 |
| `CapabilityJobsEntryParameters` 缺字段、非法 numeric wrapper、entry variant mismatch | `InfraError::RuntimeAssembly` | 否 | 否；不能使用 library default 或另一个 entry 的参数 |
| header/body/schema/job mapping 不可用 | `JobError::Source(JobSourceKind::{JobInput, UnsupportedSchema})` | 否 | 否；不能转成 safe failed target |
| external resolver 返回合法 `Unavailable` / `Unresolved` / `Invalid` / `Forbidden` observation | 按对应 Job flow 形成 typed item、safe target failure 或既有 response disposition | 是，只有 application flow声明有合法 basis 时 | 不由 runner fallback；Configured/Disabled/Fake 由外部 Port binding提前决定 |
| external collaboration Port 返回合法 typed `PendingDelivery` / `Failed` / `HandoffUnavailable` | application 原样保留 typed status，并按 Job flow形成 item或target outcome | 是，按既有 report contract | 不把 status 改成 `ApplicationError` 或成功 |
| external Port 返回 `NotConfigured` | application 保持既有 `ApplicationError::PortFailure { failure: NotConfigured }`，或按协议声明的 typed unavailable path处理 | 仅在既有 Job flow能安全 terminalize时创建；否则保持 Planned / technical error | 不把 Configured 失败静默降为 fake |
| scheduler、cron、queue、host process 不可用 | host/deployment 自己处理；Capability Hub不创建 scheduler state | 否 | 不属于 Capability Hub runtime binding |
| SDK/runtime/tools/marketplace/governance approval/method body依赖不可用 | 不进入 Jobs application Port；保持边界外 | 否 | 不复制外部 owner truth，不创建替代 adapter |

`Disabled` 是显式的 external Port binding，不是每个 Job 的 mode。一个 Job request 只要通过 closed dispatch，就会调用该 Job 的 application handler；若其所需 external Port 为 Disabled，application 必须返回既有 typed unavailable/error surface。runner 不返回空成功报告、不跳过 metadata/idempotency、也不把 Disabled 当成“没有目标”。

## 65. Historical、cross-step、owner boundary 与 Rustdoc audit

### 65.1 Historical material 与 blocker

| material / finding | 当前定位 | 本批处理 |
|---|---|---|
| 旧正式 `03-详细设计.md` 的 provider runtime、route/quota/cost、KMS/Vault、policy refresh、runtime/tools decision | `historical_material` | 不进入 Job runner、trigger、timeout、retry、journal 或 delivery carrier；旧文档仍不作为 formal §13 source |
| 旧 README 的 provider contract、whitelist、marketplace、must-pass runtime 叙述 | `historical_material` | 不把 schedule、provider health、listing 或 execution 当作 Job 配置/结果；继续保留污染审计记录 |
| 旧 `05/06` 的测试数字、evidence alias、验收签署或实现完成语句 | `historical_material` | 本批没有测试运行、run id、evidence alias、签署或 implementation commit；后续 Step 16 / 正式 `05/06` 重新定义 |
| L1-governance / L1-artifact 的 outbox、relay、retention、DLQ、job attempt 模型 | `reference_only` | 只参考表格粒度；Capability Hub 继续使用 snapshot/capture、external Port-owned intent 和 journal，不复制 outbox / relay lifecycle |
| `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` | `resolved_by_explicit_user_authorized_dependency_assumption` | 本批继续使用已授权的 `IdempotencyKey::as_str().as_bytes()` 假设；不声称 L0-core 正式设计已更新 |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | `non_blocking_cross_repo_design_debt` | 保留到 Step 14.5 / Step 19；若 accessor 签名或字节语义变化，回开 Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | `non_blocking_cross_repo_design_debt` | 仍由 compatibility fixtures 和后续 14.5 依赖审计承接；不在本批更换 wire shape |
| unresolved upstream blocker | `0` | 本批没有缺失 owner、Port、protocol schema 或 journal authority；具体产品无法满足 single-authority / linearizable resolution 时，必须在 14.5 登记真实 product blocker |

### 65.2 Step 3~13 cross-step closure

| 上游 Step | 本批消费的 exact contract | 本批不得改变 | 结果 |
|---|---|---|---|
| Step 3 constraints | Rust workspace、唯一 `core-contracts` 编译期依赖、runtime/event 不入 Cargo | 不新增 sibling path dependency；不把 scheduler/bus/SDK 当 crate | pass |
| Step 4 file layout | 七个 crate、`crates/jobs/src/*.rs` 七文件布局、`infra/config.rs` / `runtime_builder.rs` owner | 不因八个 logical Job 新增第八个 crate或旧 provider 文件 | pass |
| Step 5 module contracts | jobs 只持有 one-shot runner/report mapping；application 持有 Job service；entry 不直连 Port | 不把 repository、journal、resolver、scheduler client 注入 jobs | pass |
| Step 6 object contracts | `CapabilityJobExecutionRecord`、`Planned/Finalized`、target ordinal/outcome、capture/snapshot、typed response symmetry | 不新增 lease、attempt、checkpoint、run finder、delivery state或 Job state | pass |
| Step 7 Port/repository | 36 Ports、22 repository traits / 110 methods、journal `get/create/save`、single UoW authority | 不新增 Job runner Port、retry Port、scheduler ack Port或private finder | pass |
| Step 8 protocols | 8 Job inputs/results、schema `1`、8 logical triggers、typed disposition | 不从 config/schedule扩展 Job kind；公开 `Retryable`不改为 runner command | pass |
| Step 9 flows | 8/8 initial-target-final UoW、frozen plan、exact reentry、journal-only assembly | runner 不重扫 scope、不重算 target、不拼 response、不修 core truth | pass |
| Step 10 states | idempotency `Reserved/Completed`、Job `Planned/Finalized`、target terminal outcomes | 不引入 runner `Running`、`Retrying`、`Lease` 或 `Attempt` state | pass |
| Step 11 persistence | same-authority atomic initial/target/final UoW、CAS、commit resolution、crash recovery | timeout 不改变 atomic set；unknown 不终态化 target | pass |
| Step 12 errors | 17 `ApplicationError`、51 issue codes、`JobError` thin wrapper、typed external outcomes | 不按 error text、HTTP/broker code或 `ApplicationError` 名称授权 retry | pass |
| Step 13 concurrency | exact canonical request identity、normalized key、journal-only reentry、bounded retry ownership | 不生成新 key/run，不 current-truth reconstruct，不把 `Retryable` response重跑 | pass |

### 65.3 Capability Hub owner boundary audit

| boundary | 本批允许承接 | 本批明确排除 | result |
|---|---|---|---|
| capability identity / registry | registry-centered read、reconciliation report、closed Job trigger | registry truth repair、runtime authorization、marketplace listing | pass |
| adapter descriptor / external MCP/A2A/API | body-free descriptor/source/reference read与typed unavailable | request/response body、provider health、execution result、route/quota/cost | pass |
| governance seam | body-free relation / result ref resolution | governance approval decision、workflow、Policy truth | pass |
| method-library relation | body-free method asset ref/relation | method body、source code、publication lifecycle、execution | pass |
| SDK exposure / controlled view | formal exposure source、consumer-safe view、read-only summary | SDK package/client/cache/publication state、runtime grant | pass |
| event collaboration | immutable snapshot/capture、stable intent Port、repair Job | local outbox/relay/DLQ、external delivery state copy、second queue | pass |
| scheduler / host | physical schedule and process invocation | Job business state、run identity override、acknowledgement truth | pass |

### 65.4 Rustdoc and structural comment audit

`14.4.4` 的新增 declaration delta 只包括八个 jobs-local runner callables；§61、§62 中的 jobs-local structs/enums/variants/payloads 已在本 Step 前序批次逐项审计，本批没有修改其字段或 variant。审计结果如下：

| declaration group | expected delta | comment gate |
|---|---:|---|
| typed runner callables in §63.1 | 8 | 每个 callable 前有完整英文 `///`；签名中的 existing request/response types不新增字段 |
| public protocol struct / enum / field / variant | 0 | 无新增；Step 8 的 250 public types 保持不变 |
| application Port / repository trait / method | 0 | 无新增；36 Ports、22/110 methods保持不变 |
| persisted state enum / variant / payload | 0 | 无新增；不引入 runner retry/lease/attempt state |
| jobs-local retry-proof carrier | 0 in current written contract | 本批不伪造该 carrier；如实现阶段确需引入，必须留在 jobs-local、非持久化、逐项 Rustdoc 完整且不得成为 application Port/public protocol |
| enum struct-variant field-level `pub` | 0 | pass；本批没有新增 enum struct variant |

任何后续实现中的新 Rust declaration 都必须复用本审查门禁：struct、每个 field、enum、每个 variant、每个 variant payload 和每个 callable 均有英文 `///`。不能用 `Other(String)`、generic JSON map、raw error text 或 undocumented private escape hatch绕过闭合类型。

## 66. 正式 §13 Assembly Source、coverage arithmetic 与 batch stop gate（历史 `14.4.4` 快照）

### 66.1 Formal `03` §13 normative structure

以下内容是 Step 19 装配正式 `03-详细设计.md` §13 的 source。当前仍不修改正式文档；正式章节不得写入本批用户确认、恢复状态、未执行的测试、run id、evidence alias、实现 commit 或验收签署。

```markdown
## 13. 配置引用与外部依赖绑定

### 13.1 配置读取 owner 与 validated root
### 13.2 单一 local persistence authority 与 27 个 local/base Port
### 13.3 九个 external Port 的 Configured / DeterministicFake / Disabled 绑定
### 13.4 API / Worker entry boundary、header-first 与 source binding
### 13.5 十个 Outbound Event 的 schema/source/capture/route binding
### 13.6 八个 Operations Job 的 typed runner、trigger 与 host schedule boundary
### 13.7 Codec/hash、authoritative commit resolution 与 runtime builder 顺序
### 13.8 Timeout、retry、dependency-unavailable 与 exact reentry
### 13.9 Cross-repository Rust dependency 与 fake/fixture policy
### 13.10 Forbidden configuration、historical material 与 Step 15 handoff
```

正式装配必须保留以下 Jobs 语义：

1. Jobs entry 只接受八个 closed kinds；每个 kind 有一个 fixed `.v1` logical trigger、一个 exact typed input、一个 existing application handler 和一个 variant-bound typed response。
2. `request_body_limit` 在 concrete body decode 前生效；`planning_page_limit` 只注入 application planning facade，不进入 public request、canonical digest、cursor、scope、journal 或 result。
3. scheduler/cron/queue/process arguments 是 host/deployment material；它们不能覆盖 request authority 或成为 Capability Hub state。
4. 一个 request 内 target parallelism 固定为 `1`；application 只从 normalized-key journal 的 frozen plan 选择 `next_planned_target()`，runner 不重规划。
5. application 已形成的 `CapabilityJobResponse` 无论 disposition 是 `Retryable` 还是其它 variant，都必须原样交付；plain `ApplicationError`、`CommitOutcomeUnknown`、consistency/codec/rollback failure均不自动授权 runner retry。
6. 自动 retry 只有在同一 exact invocation 尚未形成 typed response、并且现有 journal/transaction authority给出 durable safe-reentry proof 时才可能发生；重放使用同一原始 bytes、run、key和digest，不创建新 run/key或新的 target plan。
7. external unavailable 不得被 transport text 改写；合法 typed outcome 由 application 保留，Disabled 由 explicit Port binding形成 `NotConfigured`，startup dependency failure形成 `InfraError::RuntimeAssembly`。
8. Job runner 不拥有 runtime execution、tools execution、marketplace listing、governance approval、method body、secret body、external delivery state或local outbox/relay lifecycle。

### 66.2 Step 14 cumulative binding arithmetic

| binding surface | expected | actual | missing / extra | result |
|---|---:|---:|---:|---|
| local/base/read-gate Port bindings | 27 | 27 | 0 / 0 | pass |
| repository method coverage | 110 | 110 | 0 / 0 | pass |
| external Port slots | 9 | 9 | 0 / 0 | pass |
| external resolver/handoff/collaboration callables | 14 | 14 | 0 / 0 | pass |
| Inbound source bindings | 6 | 6 | 0 / 0 | pass |
| Inbound source/schema/handler/application mappings | 6 | 6 | 0 / 0 | pass |
| Outbound event families | 10 | 10 | 0 / 0 | pass |
| Outbound schema/source/logical-key/capture mappings | 10 each | 10 each | 0 / 0 | pass |
| named configured outbound route slots | 10 | 10 | 0 / 0 | pass |
| Operations Job dispatch kinds | 8 | 8 | 0 / 0 | pass |
| typed Job runner callables | 8 | 8 | 0 / 0 | pass |
| Job trigger/handler/input/result mappings | 8 each | 8 each | 0 / 0 | pass |
| Job Step 9 flows consumed | 8 | 8 | 0 / 0 | pass |
| public protocol type delta in 14.4.4 | 0 | 0 | 0 / 0 | pass |
| application Port / repository / persisted state delta in 14.4.4 | 0 | 0 | 0 / 0 | pass |

The cumulative Step 14 baseline remains `43 + 7` objects/helpers, `36` application-owned Ports, `22 / 110` repository traits/methods, `250` public protocol types, `83 / 83` protocols/flows, `24 / 111` state-like enums/active variants and `638 = 239 current + 98 reserved + 301 illegal` ordered state pairs. The `14.4.4` runner declarations are entry-local callable coverage and do not change those baselines.

### 66.3 Batch `14.4.4` completion gate

| gate | result | source / reason |
|---|---|---|
| eight closed Job dispatch kinds | pass | §§61.2、63.2；unknown/duplicate/crossed kind has no fallback |
| header-first byte/schema/body gate | pass | §61.1；oversize and malformed input stop before application/UoW |
| eight typed runner declarations | pass | §63.1；one callable and one handler/result mapping per Job |
| trigger versus physical schedule boundary | pass | §63.3；schedule is host material, never request/journal identity |
| planning page and target sequencing | pass | §§60.2、62.1、64.3；page is injected policy, target ordinal remains serial |
| timeout and commit-unknown behavior | pass | §64.1；deadline cannot terminalize unknown target or claim rollback |
| typed disposition delivery | pass | §64.2；all complete responses, including typed `Retryable`, are delivered without runner retry |
| retry authorization | pass | §§64.2~64.3；plain `ApplicationError` and error text never authorize; only durable proof can authorize a private bounded replay |
| exact reentry authority | pass | Step 11/13 journal and §64.3；same normalized key/digest/run, no replan/current-truth scan |
| dependency unavailable mapping | pass | §64.4；startup, Disabled, typed unavailable and host scheduler remain distinct |
| Capability Hub boundary | pass | §65.3；no runtime/tools, marketplace, governance approval, method body, SDK client or external delivery owner |
| historical material / blocker audit | pass | §65.1；unresolved upstream blocker=`0`, two L0-core debts remain non-blocking |
| cross-step closure | pass | §65.2；Step 3~13 contracts consumed without baseline mutation |
| Rustdoc / structure comment gate | pass | §65.4；8 new callables documented, no struct/field/variant omission |
| formal assembly source | pass | §66.1；only calibration source written, formal `03` remains untouched |
| implementation / evidence discipline | pass | no code, implementation ledger, boundary skeleton, commit, run id, test result, evidence alias or sign-off created or claimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.4.4
gate_status = 03_step_14_batch_14_4_4_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
local_base_port_bindings = 27/27
external_port_bindings = 9/9
inbound_source_bindings = 6/6
outbound_event_bindings = 10/10
operations_job_dispatch_kinds = 8/8
operations_job_typed_runner_callables = 8/8
operations_job_trigger_handler_input_result_mappings = 8/8
runner_retry_authorized_without_durable_proof = false
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5
```

该节是 `14.4.4` 完成时的历史停审快照。当前恢复点已经推进到 §67 的 `14.5.0`；不得把本节的旧 `next_allowed_action` 当作当前恢复指令。

## 67. Batch `14.5.0` 开工输入、事实核对与边界裁决

### 67.1 本批授权与输出边界

本批在用户继续授权后启动。它只建立跨仓依赖的事实基线和分类基线，不提前完成 `14.5.1` 的 member-by-member Cargo 矩阵，也不提前完成 `14.5.2` 的完整 runtime builder 签名。这样可以把“目录存在”“拥有可消费的 typed contract”“允许成为编译期依赖”三个不同判断分开记录。

| 项目 | 本批结论 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前子批次 | `14.5.0` 跨仓依赖事实与分类基线 |
| 本批直接输入 | Step 3 constraints、Step 4 file layout、Step 5 module contracts、正式 `01` 依赖裁剪、正式 `02` 配置影响与详细设计承接、全局项目依赖关系与裁剪规则、Step 14 §§1~66 |
| 本批主要输出 | sibling 实际存在性表、编译期候选事实、依赖类型分类表、缺失处理矩阵、跨层依赖图、待在 `14.5.1~14.5.4` 闭合的审查项 |
| 本批不输出 | 完整 Cargo member 矩阵、第三方 crate 最终版本清单、具体 transport/API client、runtime builder 最终 callable、配置 key/env、正式 `03` 章节 |
| 新增 Rust 声明 | `0`；没有新增 struct、field、enum、variant、variant payload 或 callable，因此本批不存在结构体注释遗漏 |
| 正式文档修改 | `false`；正式 `03-详细设计.md` 仍是 historical material，正式装配留 Step 19 |
| 实现产物 | `0`；不创建目标实现仓、Cargo 文件、implementation ledger、planned boundary skeleton 或测试产物 |

### 67.2 本批读取与核对结果

| 输入 / 检查对象 | 已核对事实 | 对本批的约束 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已固定 Rust workspace、目标实现仓路径、唯一 sibling 编译期依赖候选和非 core sibling 排除 | 不重新发明依赖分类；本批只把候选落实为实际路径事实 |
| `03_ddd_step_04_file_layout.md` | 目标实现仓采用七个 workspace member：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | 不新增第八个 crate；entry composition 不能通过新增 assembly crate 解决循环 |
| `03_ddd_step_05_module_contracts.md` | `application` 只依赖 Port；`infra` 承担 adapter/config/runtime builder；`api`、`worker`、`jobs` 是入口模块且不得互相依赖 | 不把运行期 sibling client 直接注入 application/domain；需在 `14.5.2` 明确 composition root |
| `quantalithos-core` workspace | 目录存在，workspace edition `2024`、`rust-version = 1.93`；contracts package 为 `core-contracts`，library crate 为 `core_contracts`，version `0.1.0` | 只有 `crates/contracts` 获得 sibling path dependency 候选资格 |
| `core-contracts` source modules | 已看到 `actor`、`commands`、`errors`、`events`、`jobs`、`metadata`、`queries`、`receipts`、`views` 模块；实际共享类型包括 `ActorContext`、`ActorRef`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`JobRunId`、`Timestamp`、`TraceId`、`Version`、`RequestMetadata` | Hub 只复用 shared contract / metadata；不导入 core domain、application、infra、jobs 或业务 DTO |
| `/home/aris/Projects` sibling 目录检查 | `quantalithos-core`、`quantalithos-bus`、`quantalithos-governance`、`quantalithos-method-library`、`quantalithos-sdk` 存在；`quantalithos-runtime`、`quantalithos-tools`、`quantalithos-marketplace`、`quantalithos-capability-hub` 不存在 | 目录存在不等于可入 Cargo；缺失的下游仓不阻塞当前 capability truth 设计，但会影响部署 profile 或后续 integration gate |
| 目标实现仓 | `/home/aris/Projects/quantalithos-capability-hub` 当前不存在 | 这是实施前置条件，不是本批设计 blocker；`07` 必须设置路径创建 / 确认门禁 |

### 67.3 “存在”“可协作”“可编译依赖”三层判定

本批采用以下判定顺序。后续任何依赖表都必须同时给出三层结果，不得只写“仓库存在”就推导 Cargo dependency。

| 判定层 | 必须证明的事实 | Capability Hub 的当前处理 |
|---|---|---|
| L1 目录存在性 | 本地路径存在，且可以作为调查输入 | 仅记录事实，不授予依赖资格 |
| L2 合约可用性 | 有已确认的 typed contract、版本 / schema 语义和 owner，可由本仓通过既有 Port 或 protocol 消费 | 只对当前已闭合的本仓 contracts / core shared types 使用；外部 runtime/event contract 尚需相应 binding |
| L3 编译期依赖资格 | 依赖不会越过架构边界，且全局规则明确允许进入 Cargo | 当前只有 `core-contracts`；所有其他 sibling 即使存在也保持非 Cargo 协作 |

因此，`quantalithos-bus`、`quantalithos-governance`、`quantalithos-method-library` 和 `quantalithos-sdk` 的目录存在性不能被写成 `Cargo.toml` 依赖；`quantalithos-runtime`、`quantalithos-tools` 和 `quantalithos-marketplace` 的目录缺失也不能被“临时创建本地 crate”掩盖。

### 67.4 唯一编译期 sibling 候选

`quantalithos-core/crates/contracts/Cargo.toml` 的实际 package / library 事实与 Step 3/4 一致。本批锁定以下设计写法，但把每个 member 是否直接使用该依赖留给 `14.5.1` 逐项审查：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要直接引用 shared core types 的 member 才使用：

```toml
core-contracts.workspace = true
```

该写法的边界如下：

| 规则 | 结论 |
|---|---|
| package 名 | `core-contracts` |
| Rust library 名 | `core_contracts`；源码使用 `core_contracts::...` |
| path 基准 | 相对目标 workspace root：`../quantalithos-core/crates/contracts` |
| 允许引用的内容 | `actor`、metadata、shared command/query/event/job/receipt/view contract 中已确认的公共类型 |
| 禁止引用的内容 | `core-domain`、`core-application`、`core-infra`、`core-jobs`、core 内业务 service / adapter / job implementation |
| 版本策略 | 当前设计阶段采用 local path；private git tag / rev 只能在后续实施计划明确切换门禁后使用 |
| 不可用处理 | path 缺失、package 名不符、公共类型签名或字节语义不兼容时暂停对应实现边界并回开设计；不得用相似本地类型静默替换 |

### 67.5 依赖类型分类表

| 依赖 / 关系 | 事实状态 | 全局依赖类型 | 本仓绑定面 | 是否进入 Cargo | 缺失 / 不可用处理 | 明确禁止 |
|---|---|---|---|---:|---|---|
| `quantalithos-core/crates/contracts` | 已存在且 contracts package 已核实 | 编译期 shared contract | workspace dependency；contracts / domain / application / infra / entry 按 `14.5.1` 逐 member 使用 | 是，唯一 sibling path candidate | 缺失或 shared API 不兼容时暂停需要该类型的 boundary；不得伪造 core DTO | 引入 core 业务层或 core job |
| `quantalithos-bus` | 目录存在；本仓只需事件协作边界 | event transport / runtime dependency | `Inbound` source binding、Outbound candidate collaboration、worker source runner、external collaboration Port 或 fake | 否 | Local/Integration 使用显式 encoded-envelope fake；Deployment 缺少真实 binding 时对应 source / route 为 `Disabled` 或 startup failure，不能静默成功 | 直接依赖 bus SDK、复制 broker state、在 Hub 内建立 outbox/relay/DLQ truth |
| `quantalithos-governance` | 目录存在；治理 truth 归外部 owner | runtime / event collaboration | governance result ref、policy result ref、safe summary、seam relation、Inbound event或resolver Port | 否 | 可用时走 typed resolver/event；不可用时按既有 `Unavailable` / `NotConfigured` surface，测试使用显式 fake；不生成 approval truth | 导入 governance domain、approval engine、policy truth或workflow |
| `quantalithos-method-library` | 目录存在；method body不归 Hub | runtime / event collaboration | method asset ref、body-free relation、safe summary、Inbound event或resolver Port | 否 | 缺失时保留 reference unavailable / disabled；fake只能提供 body-free fixture | 导入 method body、source、version body或发布实现 |
| `quantalithos-sdk` | 目录存在；属于下游消费面 | downstream consumer | public API、formal exposure、controlled consumer view、Outbound event | 否 | SDK 缺失不阻塞 Hub core；保留公开 exposure / view contract；不得在 Hub 内实现 SDK client | SDK client、client cache、language binding或发布状态 |
| `quantalithos-runtime` | 目录缺失；属于下游运行期消费面 | downstream runtime dependency | formal exposure、controlled view、consumer feedback或未来 event seam | 否 | 不影响 capability identity/registry 本地 truth；真实部署需另设 integration gate；不得用本仓执行器替代 | runtime execution、agent loop、provider routing、quota、cost、failover |
| `quantalithos-tools` | 目录缺失；属于下游 tools 消费面 | downstream runtime dependency | controlled consumer view、tools consumer reference、feedback event | 否 | core P0 不阻塞；保留 body-free consumer reference / unavailable surface | tools execution、invocation、tool result或授权引擎 |
| `quantalithos-marketplace` | 目录缺失；属于生态只读消费面 | downstream discovery dependency | ecosystem discovery summary / external ref | 否 | 不阻塞 Hub；只保留 read-only discovery boundary | listing、transaction、pricing、fulfillment、ranking |
| secret / KMS / Vault platform | 本地未作为 Hub sibling 依赖核实 | runtime external service | `SecretRef`、safe handling summary、external Port | 否 | explicit Disabled / NotConfigured 或 typed unavailable；不在 Hub 保存 secret 正文 | secret SDK、secret value、rotation truth |
| external MCP / A2A / API source | 由运行期配置选择，非本地 Rust sibling | external runtime source | `AdapterDescriptor`、external source ref、descriptor summary、external Port | 否 | Local/Integration fake；Deployment 缺 adapter 时启动失败或显式 unavailable | provider runtime、request/response body、route/quota/cost |
| external document / observability / audit source | 外部边界，不拥有正文 | resolver / handoff dependency | body-free reference Port、handoff Port、safe summary | 否 | typed unavailable / handoff failure；不能转成成功或本地正文 | raw document/log/trace/metric/evidence body |

`Marketplace` 行中的 `read-only discovery summary` 只表示边界外消费线索；`quantalithos-marketplace` 缺失时，不得把本仓的 `CapabilityRegistry` 伪装成 marketplace listing truth。

### 67.6 依赖分类与模块 owner 的交叉约束

| 模块 | 可接收的依赖形态 | 不可接收的依赖形态 | 本批裁决 |
|---|---|---|---|
| `contracts` | `core-contracts` shared types；本仓 public DTO / ref / view | 任意 runtime client、transport handle、raw config、secret、domain adapter | 只保留编译期 shared contract；不读取配置 |
| `domain` | `contracts` 与 core shared metadata；显式值参数 | repository、Port handle、sibling source code、endpoint、scheduler、transport | 不新增外部依赖；不把外部 observation直接写成 truth |
| `application` | 本仓 domain / contracts、36 个 Port、typed runtime policy参数 | concrete DB、bus、HTTP client、SDK、raw config、sibling crate | 所有外部关系必须通过既有 Port / typed carrier |
| `infra` | 本仓 application/domain/contracts、core shared types、第三方实现库、validated config | `worker` library；非 core sibling；将外部业务 DTO作为 domain truth | 只构造 adapter 和 entry-neutral service graph；`worker` composition 风险留 `14.5.2`闭合 |
| `api` | application facade、infra assembly、contracts | repository、external source client、worker/jobs | API 只映射 typed protocol，不改变 operation inventory |
| `worker` | application facade、infra 解析出的 source runner、contracts | 直接 repository/UoW/publisher、runtime sibling crate、raw config | worker 自己拥有 source runner / dispatch composition；不反向成为 infra 依赖 |
| `jobs` | application job service、infra assembly、contracts | scheduler state、journal repository、external client、其他 entry crate | host schedule 只在入口外层；Job runner 不拥有业务 truth |

### 67.7 缺失与不可用处理的四分法

后续 `14.5.1~14.5.3` 必须沿用以下四种状态，不得把它们合并为一个通用“依赖失败”：

| 状态 | 发生阶段 | 处理 owner | 允许的结果 | 禁止的结果 |
|---|---|---|---|---|
| `MissingSource` | 配置引用或本地 path 解析阶段发现目标不存在 | `infra/config.rs` / runtime assembly | 对 required compile-time / blocking binding 生成 `InfraError::RuntimeAssembly`；对显式 optional boundary按 profile形成 Disabled | 自动下载、自动创建 sibling、静默换 fake |
| `NotConfigured` | 依赖存在但 profile 未配置该 slot | validated config / Port binding | 形成既有 `NotConfigured` typed failure或显式 Disabled；不启动对应 runner | 返回空成功、跳过 metadata/idempotency、伪造 external observation |
| `TemporarilyUnavailable` / `Timeout` | invocation 期间已绑定 adapter 暂时不可用 | external Port / application mapping | 沿用 Step 12 typed failure、Query degraded或既有 Job target outcome；是否重试由既有 flow / durable proof决定 | 通过文本、HTTP code或 transport code新增 retry taxonomy |
| `InvalidContract` / `ConsistencyDefect` | schema、typed response、shared contract或authority语义不兼容 | startup validation或application consistency gate | startup reject或既有 consistency defect / `CommitOutcomeUnknown`；回设计 | 将不兼容响应降级成 unavailable，或用 generic JSON / string fallback |

`DeterministicFake` 只能在 Local/Integration profile 由配置显式选择，并且必须经过与 configured source 相同的 typed/header/identity/negative boundary；fake 不是缺失依赖的默认替代。Deployment profile 不得在真实依赖不可用时静默切换 fake。

### 67.8 跨层依赖图（事实基线，不是最终 builder）

```text
quantalithos-core/crates/contracts
        |  only approved sibling Cargo path dependency
        v
capability-hub-contracts
        v
capability-hub-domain
        v
capability-hub-application
        ^                         ^                    ^
        |                         |                    |
capability-hub-infra        capability-hub-api   capability-hub-worker/jobs
        |                         |                    |
        |                    typed entry facade        |
        +-------------------- composition inputs ------+

runtime / event / downstream systems
        |  Port / adapter / event / projection / API / handoff / fake only
        v
capability-hub-infra adapters and entry-owned source bindings
        v
capability-hub-application Ports and services

host scheduler / process / transport loop
        |  host material; never Capability Hub business state
        v
api entry | worker entry | jobs entry
```

图的规范解释：

1. `infra` 可以依赖 `application` 并提供 neutral graph，但不得依赖 `worker` library；`api`、`worker`、`jobs` 各自是 composition root，具体 factory 方向在 `14.5.2` 逐 callable 闭合。
2. runtime/event/downstream sibling 的箭头只表示协作边界，不表示 Cargo edge。
3. `core-contracts` 是 shared contract source，不是 Capability Hub 的 domain truth owner。
4. host scheduler、broker offset、process lifecycle和transport handle不进入 application/domain/contracts state。

### 67.9 已识别的 composition boundary 风险

前序 `14.4.2` 的 worker source binding 拓扑中有一句“`infra` 调用 worker factory 并返回 worker graph”的表述，若按字面实现会违反 Step 5 的 `infra` 不依赖 `worker` 规则。本批将该句登记为待校正的设计措辞，而不是通过新增 crate 或反向 Cargo edge解决。

本批的受控裁决是：

| 层 | 允许承担的工作 | 不允许承担的工作 |
|---|---|---|
| `infra` | 加载 / 校验配置；构造 immutable validated root；构造 local adapter、external Port adapter、entry-neutral application/service graph和已验证的 source binding inputs | import `worker`；启动 worker loop；持有 worker-specific dispatch implementation；把 raw config传给 entry |
| `api` composition root | 使用 infra neutral graph 组装 API handler / route | 直连 repository、external client或改变 operation kind |
| `worker` composition root | 使用 infra 提供的已解析 source inputs，自行构造 source runner、closed dispatcher和application facade调用 | 让 infra 反向依赖 worker；直连 repository / publisher / UoW |
| `jobs` composition root | 使用 infra neutral graph 组装八个 typed one-shot runner和host entry | 持有 scheduler truth、重规划 journal、重写 Job response |

最终 factory callable、crate feature / optional dependency以及 partial graph failure gate不在本批伪造，统一留 `14.5.2`；在该批完成前，任何实现者不得按旧句子自行选择依赖方向。

### 67.10 本批 blocker、debt 与 historical audit

| 项目 | 状态 | 处理结论 |
|---|---|---|
| `core-contracts` 本地 path | resolved fact | 目录、workspace、package、lib、版本和模块已核实；可进入 `14.5.1` member matrix |
| 非 core sibling 误入 Cargo | controlled risk | 本批已逐类锁定为 Port / event / API / projection / fake / downstream；实现 gate 必须拒绝非 core sibling dependency |
| `quantalithos-runtime` / `tools` / `marketplace` 缺失 | non-blocking downstream prerequisite | 不阻塞本地 capability identity / registry / descriptor / seam / exposure truth；部署 / integration boundary 后续单独检查 |
| 目标实现仓缺失 | non-blocking implementation prerequisite | 不在设计阶段创建或伪造目标仓；`07` 建立路径确认门禁 |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non-blocking cross-repo design debt | 保留 `as_str().as_bytes()` 授权假设；签名或 byte semantics 变化回开 Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non-blocking cross-repo design debt | 当前 shared serde shape只作为 fixture compatibility input；shape变化回开 Step 8/13/14 |
| 旧 provider/runtime/cost/KMS/marketplace 主线 | historical_material | 不进入依赖矩阵；不因存在旧 README / 旧正式文档而恢复 provider SDK、KMS client或runtime dependency |
| unresolved upstream blocker | `0` | 本批未发现必须回开 `00/01/02` 的 truth owner、scope或依赖裁剪冲突 |

### 67.11 Batch `14.5.0` coverage 与 stop gate

| gate | 结果 | 依据 |
|---|---|---|
| sibling 目录存在性已实际检查 | pass | `quantalithos-core`、bus、governance、method-library、SDK存在；runtime、tools、marketplace、目标实现仓缺失事实已记录 |
| 编译期 sibling 候选唯一 | pass | 只有 `core-contracts` 获得 path dependency资格；其余关系明确排除 |
| package / lib / path 写法明确 | pass | `core-contracts` / `core_contracts` / `../quantalithos-core/crates/contracts` |
| 目录存在与 contract 可用性分离 | pass | §67.3 三层判定已固定 |
| runtime / event / downstream 不入 Cargo | pass | §67.5、§67.8 分类与图已固定 |
| 缺失、未配置、暂不可用、契约不兼容分离 | pass | §67.7 四分法已固定 |
| `infra` / `worker` 循环风险登记 | pass | §67.9 受控裁决；最终 callable 留 `14.5.2` |
| capability-hub 边界保持 | pass | 无 runtime execution、tools execution、marketplace listing、governance approval truth、method body或SDK client依赖 |
| Rustdoc / struct comment gate | pass | 本批新增声明 `0`，无结构体、字段、enum、variant、payload或callable遗漏 |
| 正式文档和实现纪律 | pass | 正式 `03`、`04`、目标实现仓、implementation ledger、boundary skeleton、commit、run、测试、evidence和sign-off均未创建或声称 |
| unresolved upstream blocker | pass | `0`；两个 L0-core debt仍为非阻塞 |

本批只完成依赖事实和分类基线，不宣称完整 runtime builder 或七个 member 的最终 Cargo 依赖已经闭合。

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.0
gate_status = 03_step_14_batch_14_5_0_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
approved_sibling_cargo_candidates = core-contracts only
present_runtime_event_siblings = bus, governance, method-library, sdk (directory facts only)
missing_downstream_siblings = runtime, tools, marketplace
target_implementation_repo = absent
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_1
```

Batch `14.5.0` 完成并停审。用户确认后只进入 `14.5.1`，逐 member 闭合 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的 Cargo direct dependency、workspace inheritance、禁止 edge 和使用理由；不得自动进入 `14.5.2`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03` assembly 或 `04-配置设计.md`。

## 68. Batch `14.5.1` 开工输入、问题回答与判定口径

### 68.1 本批授权与输出边界

用户已确认从 `14.5.0` 进入本批。本批只闭合七个 workspace member 的直接 Cargo 依赖矩阵和依赖方向审计。它不实现目标仓、不创建 `Cargo.toml`，也不提前决定 `14.5.2` 的 runtime builder callable、composition root factory 或 partial-graph failure gate。

| 项目 | 本批结论 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前批次 | `14.5.1` 七个 workspace member 的 Cargo direct dependency matrix |
| 直接输入 | Step 3 constraints、Step 4 file layout、Step 5 module contracts、Step 8 metadata / codec boundary、Step 12 error owner、Step 14 §§23、25、26、61、67、参考 `L1-governance` / `L1-artifact` Step 5 / 14 |
| 本批输出 | workspace root dependency binding、七个 member 的 direct dependency 表、workspace inheritance 表、禁止依赖表、第三方 crate owner 表、编译期 / 运行期边界审计、缺失处理和实施门禁 |
| 本批不输出 | runtime builder 完整顺序、factory signature、feature / optional dependency选择、配置 key / env / endpoint、transport client、正式 `03`、目标实现仓或实现 artifact |
| 新增 Rust 声明 | `0`；本批只写 Cargo 设计矩阵和审计 prose，不新增 struct、field、enum、variant、payload 或 callable |
| 正式文档 | 不修改正式 `03-详细设计.md`；本文件仍是正式 §13 的校准 source |
| 实现 / 证据 | 不创建实现仓、Cargo 文件、implementation ledger、planned boundary skeleton；不声称测试、run、evidence、commit 或签署 |

### 68.2 SOP 问题回答

| SOP 问题 | 本批裁决 |
|---|---|
| 每个 member 的直接依赖是什么? | 以 §70 的七张 member card 为唯一设计 source。只列该 member 的源码直接命名或直接实现所需 package；传递依赖不重复列入。 |
| workspace 依赖如何继承? | sibling 和本仓 member package 均在 workspace root `[workspace.dependencies]` 中声明；member 的 `[dependencies]` 使用 `<name>.workspace = true`。第三方版本与 feature 也只在 root 定义。 |
| `core-contracts` 哪些 member 真正直接使用? | `contracts`、`domain`、`application`、`infra`、`worker` 直接使用。`api`、`jobs` 只消费本仓 contracts / facade，不直接命名 core 类型，因此不加入其 direct dependency。 |
| 为什么 `worker` 与 `jobs` 的 codec 依赖不同? | 两者都需要 `serde` / `serde_json` 做入口 gate；`worker` / `jobs` 只能借用 `RawValue` 做 bounded header-first carrier。stable public / stored / event / job codec 仍由 `contracts` 拥有，entry 不得新增 wire codec。 |
| 谁拥有 `sha2`? | 只有 `application`。canonical frame、request / reference digest 和 stored-surface digest均由 application 的既有 Step 13 digest callable调用；其它 member不得重新计算。 |
| `thiserror` 是否必须由所有 member 继承? | 不是。只有定义或包装本 crate error type 的 member 直接声明；当前七 member均有本地 error owner，因此均列 `thiserror.workspace = true`。实际没有错误 owner 的新文件不得为方便而加入。 |
| 谁拥有 Tokio，允许哪些 feature? | Worker batch 2先受控回开本矩阵；Jobs composition随后在本批再次受控回开。`worker`与`jobs`直接继承同一个`tokio = 1.52.3`，features精确为`rt,sync,time`；API/infra/application/domain/contracts不得直接继承，也不得启用`macros/full/net/process/fs/signal/rt-multi-thread`。 |
| 运行期 sibling 是否可以作为 workspace dependency? | 不可以。`bus`、governance、method-library、SDK、runtime、tools、marketplace、secret、MCP、A2A、API、document、observability均通过 Port、event、API、projection、handoff 或 fake；目录存在不改变 Cargo 分类。 |
| 本批完成后能否写完整 builder? | 不能。成员矩阵闭合后，`14.5.2`仍须单独闭合 `infra` neutral graph、三个 entry composition root、worker factory boundary 和 blocking slot gate。 |

### 68.3 事实、设计绑定与待实施事项分离

| 类别 | 已确认内容 | 不能从中推导的内容 |
|---|---|---|
| 事实 | `core-contracts` package / lib / path、现有 core shared module、七个 Hub member 名称、第三方设计版本和 Step 5 依赖方向已核对 | 不能推导目标实现仓已存在，不能推导任何真实 Cargo lock、编译结果或发布 artifact |
| 设计绑定 | root 使用 workspace dependency；member 只继承自身 direct dependency；非 core sibling 不进 Cargo；入口不得反向依赖彼此 | 不是实际 `Cargo.toml` 已写入，也不是实现 agent 已完成依赖扫描 |
| 待实施事项 | 在 `/home/aris/Projects/quantalithos-capability-hub` 创建 workspace 时按本批矩阵落文件，并在实现 gate 检查 forbidden edge | 不得在设计仓伪造目标仓、package、lockfile、commit 或测试结果 |

## 69. Workspace root 依赖绑定与命名规则

### 69.1 Root workspace 设计片段

以下是实施时目标 workspace root `Cargo.toml` 的设计 source。它不是当前文件系统中的实现文件，也不表示目标实现仓已经创建。

```toml
[workspace]
resolver = "2"
members = [
    "crates/contracts",
    "crates/domain",
    "crates/application",
    "crates/infra",
    "crates/api",
    "crates/worker",
    "crates/jobs",
]

[workspace.dependencies]
capability-hub-contracts = { path = "crates/contracts" }
capability-hub-domain = { path = "crates/domain" }
capability-hub-application = { path = "crates/application" }
capability-hub-infra = { path = "crates/infra" }
capability-hub-api = { path = "crates/api" }
capability-hub-worker = { path = "crates/worker" }
capability-hub-jobs = { path = "crates/jobs" }

core-contracts = { path = "../quantalithos-core/crates/contracts" }
async-trait = "0.1.89"
serde = { version = "1.0.228", features = ["derive"] }
serde_json = { version = "1.0.145", features = ["raw_value"] }
sha2 = "0.10.9"
thiserror = "2.0.17"
tokio = { version = "1.52.3", features = ["rt", "sync", "time"] }
```

Root rules:

1. `core-contracts` is the only sibling repository path dependency. Its package name is `core-contracts`, its Rust library name is `core_contracts`, and its path is relative to the target workspace root.
2. Local member package entries are workspace-local path dependencies. They express the already fixed seven-member direction; they do not authorize a member to add a reverse edge.
3. Version and feature declarations for the six third-party crates are centralized. A member may inherit a dependency only when its card in §70 marks the crate as direct. Worker batch 2 controlled-reopened the historical four-crate snapshot；Jobs composition subsequently added `async-trait` and reopened the Tokio owner set only after the complete dyn graph、current-thread executor、timer、single-assignment terminal and non-cancelling task ownership were proven。
4. No `workspace = true` entry is allowed for a runtime sibling. An implementation gate must reject any `quantalithos-bus`, governance, method-library, SDK, runtime, tools, marketplace or secret package entry.
5. This root source selects Tokio only as the Worker-local runtime primitive implementation and the Jobs-local one-shot executor implementation；it still does not select a concrete JSON source parser, HTTP client, broker SDK, database driver, scheduler or secret SDK. Adding one requires a new classified dependency decision; it cannot be smuggled in as a transitive or optional sibling.

### 69.2 Package / library / member identity table

| Member directory | Cargo package | Rust library / binary role | Direct dependency direction |
|---|---|---|---|
| `crates/contracts` | `capability-hub-contracts` | `capability_hub_contracts` library | shared core contract only |
| `crates/domain` | `capability-hub-domain` | `capability_hub_domain` library | contracts and shared core metadata |
| `crates/application` | `capability-hub-application` | `capability_hub_application` library | domain, contracts and shared core metadata |
| `crates/infra` | `capability-hub-infra` | `capability_hub_infra` library | application, domain, contracts and shared core metadata |
| `crates/api` | `capability-hub-api` | library plus API entry binary as fixed by Step 4 | application, infra and contracts |
| `crates/worker` | `capability-hub-worker` | library plus Worker entry binary as fixed by Step 4 | application, infra, contracts and shared core metadata |
| `crates/jobs` | `capability-hub-jobs` | library plus Jobs entry binaries as fixed by Step 4 | application, infra and contracts |

`api`、`worker` 和 `jobs` 的 binary 仍属于各自 member；本批不引入额外 assembly crate。`infra` 只能提供 entry-neutral assembly input，不能因此获得对 `worker` 或其它 entry member 的反向依赖。

## 70. 七个 workspace member 的 direct dependency cards

### 70.1 `contracts` member

实施时 `crates/contracts/Cargo.toml` 只允许继承下表依赖：

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `core-contracts` | sibling compile-time | `core-contracts.workspace = true` | `ActorContext`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`JobRunId`、`Timestamp`、`TraceId`、`Version`及 shared metadata / protocol carrier 的 public field | 复制 core type、导入 core domain / application / job implementation |
| `serde` | third-party compile-time | `serde.workspace = true` | Step 8 public DTO、view、event、receipt、Job carrier和稳定 enum / newtype codec的 derive / explicit implementation | config parsing、digest、generic serializer、entry-private wire schema |
| `serde_json` | third-party compile-time | `serde_json.workspace = true` | contracts-owned exact DTO codec、stored surface、event envelope和Job response的 direct typed encode / decode | `Value` tree、generic map、canonical digest、entry自建第二套codec |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | contracts-owned public protocol validation / source wrapper error implementation | 用 error text 推导业务分类、公开 raw source |

禁止的本地边：`capability-hub-domain`、`capability-hub-application`、`capability-hub-infra`、`capability-hub-api`、`capability-hub-worker`、`capability-hub-jobs`。禁止的外部边：所有 runtime / event / downstream sibling 和具体 transport / database / secret client。

`contracts` 是 stable public codec owner。其它 member即使接触到 DTO，也只能调用 contracts-owned typed function；不得因需要序列化某个入口 carrier而新增 `serde` feature、generic codec或独立 JSON shape。

### 70.2 `domain` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | typed ref、public marker、view input / output和 protocol-owned safe carrier的领域映射 | 让 domain 反向暴露 application service或读取 transport metadata |
| `core-contracts` | sibling compile-time | `core-contracts.workspace = true` | core metadata / actor / timestamp / version值进入 domain object、record和policy factory | 导入 core service、repository、job runner或本地替代 metadata |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `DomainError`及domain-owned invariant failure source chain | 从配置、HTTP code或外部错误文本产生domain状态 |

禁止的本地边：`capability-hub-application`、`capability-hub-infra`、`capability-hub-api`、`capability-hub-worker`、`capability-hub-jobs`。`domain` 不直接依赖 `serde` / `serde_json`；领域对象是否可序列化由 `contracts` 的 public carrier 或 infra adapter 的明确边界处理，不由 domain 偷带 wire codec。

`domain` 的 core dependency 是值和类型依赖，不是 core business dependency。它不得读取 raw config、endpoint、topic、credential、scheduler、repository、Port handle或任何外部正文。

### 70.3 `application` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-domain` | local compile-time | `capability-hub-domain.workspace = true` | command / query / consumer / Job service编排、domain transition和policy调用 | 把 domain 逻辑复制到 entry或adapter |
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | 36个Port、service facade、protocol result、typed error和stored surface的参数 / 返回类型 | 让application读取HTTP / broker / config raw carrier |
| `core-contracts` | sibling compile-time | `core-contracts.workspace = true` | `CapabilityOperationContext`、metadata mapping、core id / time / version及Step 13 exact `IdempotencyKey::as_str().as_bytes()` usage | 建立第二套 core metadata、改变字节语义或导入core application |
| `async-trait` | third-party compile-time | `async-trait.workspace = true` | 将既有async service / Port语义契约实现为可注入的`Arc<dyn ... + Send + Sync>`；Jobs service future保持`Send` | 改方法名/参数/返回/error、`?Send`、generic dispatcher或运行期反射 |
| `sha2` | third-party compile-time | `sha2.workspace = true` | Step 13固定的四类 digest domain和既有 `Sha256` helper | algorithm selector、secret/password hash、adapter-private digest或对已存bytes重序列化 |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `ApplicationError`、Port failure wrapper、commit resolution和source chain | 用source text / HTTP status决定retry或public issue |

禁止的本地边：`capability-hub-infra`、`capability-hub-api`、`capability-hub-worker`、`capability-hub-jobs`。禁止的外部边：DB driver、HTTP client、bus SDK、SDK client、runtime/tools/marketplace/secret sibling。所有外部交互必须通过既有 Port；application 不拥有 concrete adapter。

`sha2` 的 direct owner 只有 application。`contracts` 的 serialized bytes可由application调用 contracts codec后接收，但application不得让serde generic trait成为新的公共Port参数。

### 70.4 `infra` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-application` | local compile-time | `capability-hub-application.workspace = true` | repository / adapter实现、UoW、Port implementation、validated root和entry-neutral service graph | 让infra改变application orchestration或直接拥有业务truth |
| `capability-hub-domain` | local compile-time | `capability-hub-domain.workspace = true` | adapter persistence mapping、domain value / state mapping和同一UoW的domain load/save | 在infra新增domain transition、业务policy或外部正文字段 |
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | repository DTO、typed resolver result、event capture、public codec调用和entry binding输入 | 复制contracts schema、改写event / Job / public error |
| `core-contracts` | sibling compile-time | `core-contracts.workspace = true` | adapter对core metadata / timestamp / version / shared envelope的边界映射 | 导入core runtime、bus、application或job实现 |
| `async-trait` | third-party compile-time | `async-trait.workspace = true` | 实现application-owned async Port / repository trait并保持object-safe `Send` future | 在adapter改trait签名、`?Send`、generic dynamic Port或runtime reflection |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `InfraError`、startup validation、adapter source chain和runtime assembly failure | 将adapter text分类成业务error、公开secret或endpoint |

本批不为 `infra` 加入 `serde` / `serde_json`。`infra/config.rs` 的具体 raw source parser、格式和部署读取方式留给 `04-配置设计.md`；本批只要求 validated infra-local structs不成为public wire codec。若后续实施选择一个 parser crate，必须在 `04` 和 Step 14 收口前单独记录 owner、版本和依赖分类，不能默认为 stable protocol dependency。

禁止的本地边：`capability-hub-api`、`capability-hub-worker`、`capability-hub-jobs`。其中 `infra -> worker` 是已登记的 composition 风险，必须在 `14.5.2` 通过 entry-owned factory boundary解决，不得以 optional dependency、feature或callback伪装成反向 Cargo edge。

禁止的外部边：所有 non-core sibling、concrete bus / HTTP / DB / KMS / SDK client，除非未来依赖审查明确把该实现库归为本仓 infra implementation dependency；即便加入第三方实现库，也不能成为 application/domain/public contract的类型泄漏。

### 70.5 `api` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-application` | local compile-time | `capability-hub-application.workspace = true` | command / query handler调用application facade、映射typed outcome和`ApplicationError` | 直接调用repository、Port或domain transition |
| `capability-hub-infra` | local compile-time | `capability-hub-infra.workspace = true` | API composition root消费infra提供的entry-neutral application graph和validated entry parameters | 让handler读取raw config或持有具体adapter |
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | exact Command / Query request、body、response、view、metadata carrier和contracts-owned codec调用 | 自建DTO、generic JSON、改变route / operation inventory |
| `async-trait` | third-party compile-time | `async-trait.workspace = true` | Command / Query handler traits及concrete facade impl的object-safe `Send` future展开 | `?Send`、generic execute、route反射或method签名漂移 |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `ApiError` transport-neutral wrapper和边界source chain | 用HTTP status / error text改写application分类或业务outcome |

`api` 不直接继承 `core-contracts`、`serde` 或 `serde_json`。其 handler 接收 `capability-hub-contracts` 的完整 typed envelope，将已验证字段交给 application facade；core metadata 的定义和稳定解码由 contracts / application owner负责，API 不声明第二套 `ActorContext`、`CommandMetadata` 或 `QueryMetadata` 类型。API若在实现中出现显式 `core_contracts::...` import，必须先回开本批矩阵，不得由传递依赖掩盖 direct use。

禁止的本地边：`capability-hub-domain` 的 direct business call、`capability-hub-worker`、`capability-hub-jobs`。API只能通过infra装配结果接收application facade，不能以域对象或 repository 做旁路。

### 70.6 `worker` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-application` | local compile-time | `capability-hub-application.workspace = true` | inbound consumer、exact capture-ref continuation和application collaboration facade调用 | 直接持有repository、UoW、publisher或修复truth |
| `capability-hub-infra` | local compile-time | `capability-hub-infra.workspace = true` | worker composition root消费已解析source binding、entry-neutral graph和validated parameters | 让infra反向依赖worker、把raw config传入loop |
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | inbound envelope、六个closed payload、receipt、outbound capture ref和typed source / response carrier | generic body、重复header、private payload persistence |
| `core-contracts` | sibling compile-time | `core-contracts.workspace = true` | Step 14 §26 header-first carrier直接命名`ActorContext`、`TraceId`、`IdempotencyKey`、`Timestamp`等core metadata | 复制metadata schema、从topic或transport text推导source identity |
| `async-trait` | third-party compile-time | `async-trait.workspace = true` | 六臂Inbound handler trait及Worker concrete facade impl的object-safe `Send` future展开 | `?Send`、generic event execute、source反射或delivery ownership弱化 |
| `serde` | third-party compile-time | `serde.workspace = true` | borrowed header-first carrier的`Deserialize`、deny-unknown-fields和borrow annotation | stable public codec owner、generic deserialize fallback |
| `serde_json` | third-party compile-time | `serde_json.workspace = true` | `serde_json::value::RawValue`的有界借用和选定payload的exact typed decode；carrier在本次调用结束前丢弃 | `Value` tree、保存/日志/telemetry raw body、第二套wire codec |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `WorkerError`、source/ack mapping的本地source chain | 由transport text决定ack、retry或业务状态 |
| `tokio` | third-party compile-time | `tokio.workspace = true` | Worker-local executor spawn、owned join、activation/stop/completion signal、global permit semaphore和non-cancelling observation timer | `full`、network/process/fs/signal、business timeout、domain/application dependency、transport ack或delivery state |

`worker` 的 `core-contracts`、`serde`、`serde_json` 和 `tokio` 是入口技术依赖，不把 core metadata、raw carrier或runtime primitive提升为Capability Hub业务truth。`RawValue` 只保留已通过字节上限的当前调用切片；完成 header gate和该分支的 exact DTO decode后立即丢弃，不进入 application Port、capture、日志、hash或outbound event。Tokio只实现本批的 Worker-private supervisor traits；concrete Tokio types不得出现在infra handoff、application trait、contracts DTO、public callable或persisted state。

禁止的本地边：`capability-hub-domain` direct call、`capability-hub-jobs`、`capability-hub-api`。worker不得通过 `infra -> worker` 反向边装配；它由自己的 composition root消费infra的neutral inputs，并调用application facade。

### 70.7 `jobs` member

| 依赖 | 类型 | workspace 绑定 | 直接使用位置 / 原因 | 禁止用途 |
|---|---|---|---|---|
| `capability-hub-application` | local compile-time | `capability-hub-application.workspace = true` | 八个closed Job runner调用既有application Job service并交付完整typed response | 重规划journal、扫描current truth或修复core truth |
| `capability-hub-infra` | local compile-time | `capability-hub-infra.workspace = true` | Jobs composition root消费neutral graph、validated job parameters和runner technical policy | 持有scheduler state、repository或external client |
| `capability-hub-contracts` | local compile-time | `capability-hub-contracts.workspace = true` | `CapabilityJobRequest<T>`、`CapabilityJobMetadata`、八个typed input / response、header carrier和delivery mapping | generic Job body、按CLI字符串猜kind、复制run/idempotency authority |
| `async-trait` | third-party compile-time | `async-trait.workspace = true` | Jobs handler trait及concrete facade的object-safe、`Send` future展开，使其可进入owned Tokio task | `?Send`、generic execute、宏生成额外handler或改变八臂签名 |
| `serde` | third-party compile-time | `serde.workspace = true` | jobs-local header-first carrier的`Deserialize`和borrow annotation | public protocol codec owner、generic response serializer |
| `serde_json` | third-party compile-time | `serde_json.workspace = true` | borrowed `RawValue` body gate与selected exact JobInput decode；完成映射后丢弃 | `Value` tree、body persistence、第二套 Job wire schema |
| `thiserror` | third-party compile-time | `thiserror.workspace = true` | `JobError`、typed delivery mapping和本地 source chain | 用exit code、scheduler text或transport status推导业务 disposition |
| `tokio` | third-party compile-time | `tokio.workspace = true` | Jobs-local current-thread runtime、monotonic whole-run deadline、owned invocation task、single-assignment terminal notification和join | `full`、macros、net/process/fs/signal、multi-thread runtime、scheduler/lease/ack、business cancellation或runtime/tools execution |

`jobs` 不直接继承 `core-contracts`。`CapabilityJobMetadata` 已由 `capability-hub-contracts` 作为唯一 Job authority carrier 暴露；jobs 只把已验证的 typed request 交给 application。Tokio只实现Jobs-private execution ownership，concrete runtime、handle、instant、notify、mutex或join type不得进入infra handoff、application trait、contracts DTO、public callable或persisted state。若实现需要在 jobs 源码中显式标注 `JobRunId`、`TraceId` 或其它 core type，必须先回开本批并将该 direct use补入矩阵；不得依赖未声明的传递可见性。

禁止的本地边：`capability-hub-domain` direct call、`capability-hub-worker`、`capability-hub-api`。host scheduler / process arguments不是 Cargo dependency，也不是 Job state owner。

## 71. Workspace inheritance 与实际成员 `[dependencies]` source

### 71.1 Member-to-root inheritance matrix

| Member | 继承的本仓 member | 继承的 sibling | 继承的 third-party | 不继承 |
|---|---|---|---|---|
| `contracts` | 无 | `core-contracts` | `serde`、`serde_json`、`thiserror` | `sha2`、所有 runtime / event / downstream |
| `domain` | `capability-hub-contracts` | `core-contracts` | `thiserror` | `serde`、`serde_json`、`sha2`、entry crates |
| `application` | `capability-hub-domain`、`capability-hub-contracts` | `core-contracts` | `async-trait`、`sha2`、`thiserror` | `serde`、`serde_json`、entry / infra crates |
| `infra` | `capability-hub-application`、`capability-hub-domain`、`capability-hub-contracts` | `core-contracts` | `async-trait`、`thiserror` | `serde`、`serde_json`、`sha2`、entry crates |
| `api` | `capability-hub-application`、`capability-hub-infra`、`capability-hub-contracts` | 无 direct sibling | `async-trait`、`thiserror` | `core-contracts`、`serde`、`serde_json`、worker / jobs |
| `worker` | `capability-hub-application`、`capability-hub-infra`、`capability-hub-contracts` | `core-contracts` | `async-trait`、`serde`、`serde_json`、`thiserror`、`tokio` | `sha2`、api / jobs、runtime siblings |
| `jobs` | `capability-hub-application`、`capability-hub-infra`、`capability-hub-contracts` | 无 direct sibling | `async-trait`、`serde`、`serde_json`、`thiserror`、`tokio` | `core-contracts`、`sha2`、api / worker、runtime siblings |

### 71.2 Member `Cargo.toml` dependency source pattern

每个 member 的实现文件应只从 root workspace dependency继承 §70 标记的 direct package。下列片段是结构 source，不是已创建的实现文件：

```toml
# crates/contracts/Cargo.toml
[dependencies]
core-contracts.workspace = true
serde.workspace = true
serde_json.workspace = true
thiserror.workspace = true
```

```toml
# crates/domain/Cargo.toml
[dependencies]
capability-hub-contracts.workspace = true
core-contracts.workspace = true
thiserror.workspace = true
```

```toml
# crates/application/Cargo.toml
[dependencies]
capability-hub-contracts.workspace = true
capability-hub-domain.workspace = true
core-contracts.workspace = true
async-trait.workspace = true
sha2.workspace = true
thiserror.workspace = true
```

```toml
# crates/infra/Cargo.toml
[dependencies]
capability-hub-application.workspace = true
capability-hub-contracts.workspace = true
capability-hub-domain.workspace = true
core-contracts.workspace = true
async-trait.workspace = true
thiserror.workspace = true
```

```toml
# crates/api/Cargo.toml
[dependencies]
capability-hub-application.workspace = true
capability-hub-contracts.workspace = true
capability-hub-infra.workspace = true
async-trait.workspace = true
thiserror.workspace = true
```

```toml
# crates/worker/Cargo.toml
[dependencies]
capability-hub-application.workspace = true
capability-hub-contracts.workspace = true
capability-hub-infra.workspace = true
core-contracts.workspace = true
async-trait.workspace = true
serde.workspace = true
serde_json.workspace = true
thiserror.workspace = true
tokio.workspace = true
```

```toml
# crates/jobs/Cargo.toml
[dependencies]
capability-hub-application.workspace = true
capability-hub-contracts.workspace = true
capability-hub-infra.workspace = true
async-trait.workspace = true
serde.workspace = true
serde_json.workspace = true
thiserror.workspace = true
tokio.workspace = true
```

The ordering above is a readability convention, not a semantic dependency. An implementation gate must compare the actual package set, source path and feature set, not line order.

### 71.3 Third-party owner and feature matrix

| Crate | Root version / feature | Direct owners | Feature boundary | Forbidden drift |
|---|---|---|---|---|
| `async-trait` | `0.1.89` | `application`, `infra`, `api`, `worker`, `jobs` | all async application Port/repository/service and entry handler declarations/impls participating in the required dyn graph become object-safe `Send` futures | `?Send`、generic dispatch、signature/error drift、runtime reflection or treating macro expansion as a protocol |
| `serde` | `1.0.228`, `derive` | `contracts`, `worker`, `jobs` | contracts derive / explicit stable DTO; worker/jobs borrowed header carrier only | adding `rc`, arbitrary custom serializer, generic entry codec or config feature without review |
| `serde_json` | `1.0.145`, `raw_value` | `contracts`, `worker`, `jobs` | contracts exact typed codec; worker/jobs bounded borrowed `RawValue` and selected DTO decode | `Value` / `Map`, pretty output, reserialization of stored bytes, generic JSON dispatch |
| `sha2` | `0.10.9` | `application` only | Step 13 fixed SHA-256 helper and four digest domains | runtime algorithm selector, adapter digest, secret hash or other member direct use |
| `thiserror` | `2.0.17` | all seven current error-owning members | local typed source chaining only | error text as retry / issue classification, public source leakage |
| `tokio` | `1.52.3`;`rt,sync,time` | `worker`, `jobs` | Worker-private supervisor primitives；Jobs-private current-thread runtime、monotonic deadline、owned task、notification and join | `full`、macros、net、process、fs、signal、`rt-multi-thread`、domain/application/API/infra direct use or transport-product semantics |

`serde` / `serde_json` being direct in `worker` or `jobs` does not transfer codec ownership. The only stable wire owner remains `capability-hub-contracts`; entry carriers are private, borrowed and invocation-scoped. `async-trait` changes only Rust future lowering:application owns declarations，infra owns Port/repository implementations，and each entry owns its handler declaration/implementation；it adds no method、DTO、runtime owner or retry authority。Tokio being direct in Worker and Jobs does not make it a protocol/runtime sibling owner；it implements two entry-private runtime graphs with no cross-entry type sharing。The `async-trait 0.1.89` and Tokio `1.52.3` bindings are design dependency inputs corroborated by the existing `/home/aris/Projects/quantalithos-process/Cargo.lock` organization baseline;they are not a Capability Hub lockfile, compile result or test claim.

## 72. Dependency direction、cycle与编译门禁审计

### 72.1 Allowed edge matrix

| from \\ to | `core-contracts` | `contracts` | `domain` | `application` | `infra` | `api` | `worker` | `jobs` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `contracts` | allow | self | deny | deny | deny | deny | deny | deny |
| `domain` | allow | allow | self | deny | deny | deny | deny | deny |
| `application` | allow | allow | allow | self | deny | deny | deny | deny |
| `infra` | allow | allow | allow | allow | self | deny | deny | deny |
| `api` | deny direct | allow | deny direct business call | allow | allow | self | deny | deny |
| `worker` | allow | allow | deny direct business call | allow | allow | deny | self | deny |
| `jobs` | deny direct | allow | deny direct business call | allow | allow | deny | deny | self |

`api` / `jobs` 的 `core-contracts = deny direct` 是本批的 intentional closure，不是忘记填写。它们使用 contracts-owned envelopes / metadata carrier，且不能在入口层创建第二套 core type。若 Step 14.5.2 的 callable closure改变这一事实，必须回开本批矩阵并同步所有台账。

### 72.2 Cycle and forbidden-edge audit

| 检查项 | 预期 | 本批结果 | 处理 |
|---|---|---|---|
| `contracts -> domain/application/infra/entry` | 无边 | pass | implementation dependency scan必须拒绝 |
| `domain -> application/infra/entry` | 无边 | pass | domain保持纯净 |
| `application -> infra/api/worker/jobs` | 无边 | pass | concrete adapter只能由infra实现Port |
| `infra -> worker` | 无边 | pass with controlled wording correction | 旧“infra调用worker factory”只作为 historical composition风险；最终factory留`14.5.2` |
| `api <-> worker` | 无边 | pass | 两者均由host / composition root独立装配 |
| `api <-> jobs` | 无边 | pass | API不启动或调用maintenance runner |
| `worker <-> jobs` | 无边 | pass | continuation与one-shot job通过application facade共享，不互相import |
| non-core sibling -> any member Cargo edge | 无边 | pass | 运行期 / event / downstream只能走Port、event、API、projection、handoff或fake |
| `sha2` outside application | 无边 | pass | digest owner唯一 |
| stable codec outside contracts | 无边 | pass | entry RawValue不构成第二套wire codec |

### 72.3 Direct-use versus transitive-use rule

实现者不得因为某个上游 member已经依赖某 crate，就在下游源码中直接使用而不声明 direct dependency。Rust source中出现以下任一项即视为 direct use，必须在对应 member card出现：

- `use core_contracts::...`、core type的显式泛型 / 返回值 / field annotation。
- `use serde...`、`#[derive(Serialize / Deserialize)]`或`serde_json::...`。
- `use sha2...`或任何 digest计算。
- `thiserror` derive / attribute。
- 直接命名其它 workspace package的公开 type、trait或function。

反之，调用本 member对外暴露的 application facade、contracts-owned function或infra-neutral builder input，只依赖其所属本仓 package；不能借传递依赖绕过 owner。任何 direct-use变化都必须更新本批矩阵和 `project_execution_ledger.md`，不能由实现者自行“就近加依赖”。

## 73. 缺失处理、fake parity 与历史材料审计

### 73.1 Compile-time / runtime / event 四类处理

| 依赖类别 | 缺失或不兼容时 | 允许的本地 profile 行为 | 禁止行为 |
|---|---|---|---|
| `core-contracts` path | 在需要该类型的 member进入实现前暂停；package / lib / public signature / byte semantics不兼容均回开设计 | 不得用同名本地替代类型；只有已审定 fixture carrier可继续做不依赖该类型的文档工作 | 自动创建 sibling、下载替代包、改用字符串或generic JSON |
| 本仓 member path | workspace layout或package名不符时停止装配 | 不允许以复制源码、feature alias或duplicate crate绕过边界 | hidden duplicate implementation、reverse edge |
| third-party codec / hash / error / entry runtime crate | 版本或feature不兼容时停止该owner的实现绑定 | 可继续审查不依赖该 crate 的设计文字 | 随意换版本、换算法、在未授权member复制实现或扩大Tokio feature |
| runtime / event sibling | 不进入 Cargo；由 `infra` binding / Port在启动或调用时报告 `MissingSource`、`NotConfigured`、typed unavailable或`InvalidContract` | Local / Integration profile可显式选择 deterministic fake / encoded-envelope fixture；Deployment不得静默fake | 把运行期仓加入 Cargo、空成功、generic fallback、伪造外部 truth |

### 73.2 Fake 与 configured adapter parity

所有 configured / deterministic fake binding必须共享同一 application Port、typed result / error分类和 header / identity gate。fake不得因为不使用真实 sibling而省略：

1. core metadata authority和operation identity校验；
2. body-free reference、safe summary和method / governance正文排除；
3. UoW、idempotency、capture、journal、authoritative commit read的调用顺序；
4. `TemporarilyUnavailable`、`Timeout`、`NotConfigured`、`InvalidContract`和`ConsistencyDefect`的typed mapping；
5. configured 与 fake 的 disabled / unavailable observable category。

`worker` / `jobs` 的 `RawValue` 只是边界 carrier，fake source也必须先过同样的字节限制和 header-first gate。fake不能直接把已经解码的任意 Rust value塞给application来绕过入口协议。

### 73.3 Historical material and blocker audit

| 材料 / 风险 | 本批处理 |
|---|---|
| 旧 `ProviderContract`、provider SDK、route / quota / cost / failover | `historical_material`；不出现在任何 member dependency card |
| 旧 KMS / Vault client、secret正文、rotation | `historical_material`；只保留 `SecretRef` / safe summary Port边界 |
| 旧 runtime / tools execution gateway、marketplace listing | `historical_material`；不新增 runtime / tools / marketplace Cargo edge |
| 旧 outbox / relay / DLQ implementation | `historical_material`；本批不将 bus当Cargo或本地delivery truth |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | `non_blocking_cross_repo_design_debt`；保留 `as_str().as_bytes()`授权假设，语义变化回开Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | `non_blocking_cross_repo_design_debt`；shared serde shape变化回开Step 8/13/14 |
| `infra` / `worker` factory措辞 | `controlled composition risk`；不得按旧措辞加反向Cargo edge，留`14.5.2`闭合 |
| upstream truth / scope / dependency blocker | `0`；本批未发现需回开`00/01/02`的阻塞 |

## 74. Batch `14.5.1` Coverage、可落码性与 Stop Review

### 74.1 Coverage arithmetic

Worker batch 2 在证明 exact spawn / join、event、permit和observation timer ownership 后，对本节原四项第三方依赖快照执行受控回开；Jobs composition又在证明current-thread executor、owned invocation和single-assignment terminal后扩展同一Tokio direct-owner set。当前审计基线仍是五项；该更新不把Tokio提升为runtime sibling、public protocol或其它member依赖。

| 审计面 | 预期 | 实际 | 结果 |
|---|---:|---:|---|
| workspace member cards | 7 | 7 | pass |
| member package / library identities | 7 | 7 | pass |
| direct local member dependency decisions | 15 allowed edges | 15 | pass |
| direct sibling `core-contracts` decisions | 7 member decisions | 5 allow / 2 deny-direct | pass |
| third-party direct owner decisions | 6 crates | `async-trait` 5 (`application`, `infra`, `api`, `worker`, `jobs`)、`serde` 3、`serde_json` 3、`sha2` 1、`thiserror` 7、`tokio` 2 (`worker`, `jobs`) | pass;Worker and Jobs controlled reopen |
| runtime / event / downstream sibling Cargo edges | 0 | 0 | pass |
| forbidden entry cross-edges | 6 families | 6 denied | pass |
| dependency direction cycles | 0 | 0 | pass |
| new Rust declarations in this batch | 0 | 0 | pass |

### 74.2 可落码性 gate

| gate | 结果 | 依据 |
|---|---|---|
| 每个 member 有完整 direct dependency set | pass | §§70.1~70.7、§71.1 |
| 每个 dependency 有 workspace inheritance source | pass | §69.1、§71.2 |
| local package path 与 sibling path明确 | pass | §69.1~§69.2 |
| API / Jobs 不误加 core direct edge | pass | §§70.5、70.7、§72.1 |
| Worker header-first `RawValue`依赖闭合 | pass | §70.6、Step 14 §§26、61 |
| stable codec/hash owner唯一 | pass | §70.1、§70.3、§71.3 |
| entry runtime owner与feature最小化 | pass | §§69.1、70.6~70.7、71.1~71.3；`tokio = 1.52.3`,仅`rt,sync,time`且仅Worker / Jobs direct |
| error owner与`thiserror`归属明确 | pass | §68.2、§71.3 |
| runtime/event/downstream不进入Cargo | pass | §§67.5、73.1 |
| `infra -> worker`不形成Cargo edge | pass | §72.2；最终factory留`14.5.2` |
| fake不绕过协议和typed failure | pass | §73.2 |
| Rustdoc / struct comment gate | pass | 本批新增声明 `0`，无遗漏可审查 |
| 正式文档 / implementation artifact纪律 | pass | 正式`03`、`04`、目标实现仓、implementation ledger、boundary skeleton均未创建或修改 |
| 未伪造测试 / run / evidence / commit / sign-off | pass | 本批只做文档矩阵和审计 |
| unresolved upstream blocker | pass | `0`；两个L0-core debt为非阻塞 |

### 74.3 Formal §13 assembly source增量

Step 19装配正式 `03` §13 时，本批只贡献以下可回填内容：

```markdown
### 13.9 Cross-repository Rust dependency and member boundary

- workspace root 只声明七个本仓 member、唯一 sibling `core-contracts` path dependency及经owner审查的第三方 crate。
- `contracts`、`domain`、`application`、`infra`、`worker`直接继承`core-contracts`;`api`和`jobs`只消费本仓 contracts / facade，不直接命名 core type。
- `sha2`只由`application`拥有；stable `serde` / `serde_json` codec由`contracts`拥有；`worker` / `jobs`的`RawValue`只用于借用的header-first gate。
- `tokio`只由`worker`和`jobs`直接继承且仅启用`rt,sync,time`；Worker拥有source/continuation supervisor，Jobs拥有current-thread one-shot executor；concrete Tokio类型不得进入infra handoff、application trait、contracts DTO、public callable或persisted state。
- `infra`不得依赖`worker`;`api`、`worker`、`jobs`不得互相依赖；non-core sibling只能通过Port、event、API、projection、handoff或fake协作。
- path缺失、契约不兼容、runtime未配置、暂不可用和typed consistency defect必须分别映射到既有startup / Port / application error surface；不得静默fallback或伪造外部truth。
```

本段是正式章节的 source，不是正式文档写入；正式 `03` 仍保持未装配状态。

### 74.4 当前停审快照

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.1
gate_status = 03_step_14_batch_14_5_1_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
approved_sibling_cargo_candidates = core-contracts only
direct_core_contracts_members = contracts, domain, application, infra, worker
direct_core_contracts_denied_members = api, jobs
third_party_direct_owner = async-trait: application/infra/api/worker/jobs; serde: contracts/worker/jobs; serde_json: contracts/worker/jobs; sha2: application; thiserror: all current error-owning members; tokio: worker/jobs
runtime_event_downstream_cargo_edges = 0
dependency_cycle_count = 0
new_rust_declarations_in_batch = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_2
```

Batch `14.5.1` 完成并停审。下一批只允许在用户确认后进入 `14.5.2`，闭合 runtime builder 完整顺序、三个 composition root、`infra` neutral graph、worker factory boundary和partial-graph blocking gate；不得自动进入 `14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03` assembly、`04-配置设计.md`或任何实现产物。

## 75. Batch `14.5.2.0` 开工确认、composition ownership 与可见性裁决

### 75.1 本批授权与输出边界

用户已确认从 `14.5.1` 进入 `14.5.2`。本次写入是 `14.5.2` 的第一项可审查批次，只完成 composition ownership、cycle-free 方向和既有 Worker binding 可见性裁决；不提前写完整 constructor signature、完整七个 builder stage 的 callable 清单或三个 entry 的最终字段表。

| 项目 | 本批结论 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前批次 | `14.5.2.0` runtime builder / composition ownership 开工裁决 |
| 直接输入 | Step 5 module contracts、Step 7 Port owner、Step 8 handler/service surface、Step 9 inbound / collaboration / Job flow、Step 12 wrapper error owner、Step 14 §§23、26、47、67、68~74、详细设计 SOP Step 14、书写规范 §5.13 |
| 本批输出 | composition ownership 矩阵、cycle-free handoff 规则、neutral assembly input 内容边界、partial-graph 初始 gate、现有 `pub(crate)` binding 的处理决定、后续 `14.5.2.1~14.5.2.3` 的明确输入 |
| 本批不输出 | 具体数据库 / bus / scheduler / HTTP 产品、raw config key、endpoint / credential、最终 async trait 形式、完整 builder callable、正式 `03` 章节、`04`、实现代码 |
| 新增 Rust 声明 | `0`；本批只锁定 ownership 和边界，不新增 struct、field、enum、variant、payload 或 callable |
| 正式文档 | 不修改正式 `03-详细设计.md`；本文件仍是正式 §13 的校准 source |
| 实现 / 证据 | 不创建目标实现仓、Cargo 文件、implementation ledger、planned boundary skeleton；不声称测试、run、evidence、commit 或签署 |

### 75.2 本批 SOP 八问回答

| SOP 问题 | `14.5.2.0` 裁决 |
|---|---|
| 1. 哪些模块读取配置？ | raw config 和 validated root 仍只由 `infra/config.rs` / `infra::runtime_builder` 读取。`api`、`worker`、`jobs` 只消费已经装配的 entry parameters、application facade 和已解析的 source input；`application`、`domain`、`contracts` 不读取 config。 |
| 2. runtime builder 由谁拥有？ | `infra` 拥有 root validation、single persistence authority、36 个 Port adapter、application service graph 和 entry-neutral assembly input 的构造；它不拥有 API route、Worker loop、Job runner 或 host scheduler。 |
| 3. 三个 composition root 如何分离？ | `api` 自己组装 command/query handler 和 route；`worker` 自己组装 source runner、closed dispatcher、inbound/collaboration loop；`jobs` 自己组装八个 typed one-shot runner。三者只消费 `infra` 的完整 neutral output，不互相 import。 |
| 4. Worker factory 的方向是什么？ | 采用 entry-owned factory：Worker composition root 调用 infra 的 resolver 取得已解析 source input，再由 `worker` 自己构造 runner。不得保留旧“`infra` 调用 worker factory 并返回 worker graph”的字面语义；`infra` 不依赖 `worker`。 |
| 5. neutral assembly input 包含什么？ | 只包含已验证的 application facade、entry-local typed parameters、六个 named source slot 的 closed identity 和已解析的 feed / trusted-actor runtime handle。它不包含 raw config、config ref、secret、endpoint、repository、UoW、publisher、generic map 或可扩展 string dispatcher。 |
| 6. 什么是 partial graph？ | 任一 required local authority、Port、codec/hash、application facade、entry parameter 或已选择的 configured source 尚未成功构造时，都是 partial graph；不得向 entry 或 host 返回。显式 `Disabled` 是完整的 intentional binding，不是 partial graph。 |
| 7. startup failure 如何表达？ | root validation、adapter construction、entry factory construction 或 blocking source resolution 失败均停在 startup assembly，保留 `InfraError::RuntimeAssembly`；不得伪造 Command response、Inbound receipt、Job report 或业务失败。 |
| 8. 本批是否已经闭合全部 builder callable？ | 否。本批只锁定方向和内容边界；`14.5.2.1` 写 stage 顺序，`14.5.2.2` 写 API / Worker / Jobs exact composition callable，`14.5.2.3` 写完整 blocking matrix、failure gate 和最终审计。 |

### 75.3 当前材料问题诊断

| 材料 / 位置 | 问题 | 当前处理 |
|---|---|---|
| 前序 `14.4.2` §47.1 | “`infra` 调用 Worker binary supplied runner factory 并返回 Worker entry graph”若按字面实现，会要求 `infra -> worker` 的反向 Cargo edge，或把 Worker 类型塞入 infra。 | 降级为 historical wording；改成 Worker root 先取得 infra-owned neutral input，再由 Worker 构造并验证自己的 runtime。 |
| `CapabilityInboundSourceBinding` / `CapabilityWorkerEntryBinding` | 当前是 `pub(crate)` infra-local 类型；`worker` crate 不能直接读取，且不应读取 config refs。 | 保持 infra-local visibility；由 infra 在边界处转换为新的 cross-crate neutral assembly input。具体字段和 accessor 在后续批次逐项定义。 |
| `CapabilityEntryParameters::as_worker` | 当前为 `pub(crate)`，返回 infra-local binding；直接扩大为 `pub` 会泄漏 raw/validated config 结构。 | 不扩大现有 accessor；builder 输出 entry-owned typed view / input，worker 只消费该输出。 |
| 旧正式 `03` / README | 可能暗示 infra 直接启动 worker、provider runtime 或统一 gateway。 | 继续作为 `historical_material`；不进入当前 assembly source。 |
| Step 5 / 7 / 8 / 9 | application facade、Port owner、closed protocol inventory 已固定，但 composition 连接器尚未逐 callable 闭合。 | 以本批 ownership 裁决为前置，后续批次补 exact constructor、所有权和 failure gate。 |

### 75.4 方案取舍

| 方案 | 优点 | 主要问题 | 结论 |
|---|---|---|---|
| A. `infra` 直接依赖 `worker` 并调用其 factory | 表面上可由一个 builder 返回完整 Worker graph。 | 违反 Step 5 和 `14.5.1` 的 Cargo 方向；会使 infra 持有 worker-specific dispatch 和 loop 语义。 | 拒绝。 |
| B. 新增第八个 assembly crate | 可以把 API / Worker / Jobs 的共同装配移出 infra。 | Step 4 已固定七个 member；新增 crate 会重新定义模块边界并扩大 Cargo graph。 | 拒绝。 |
| C. `infra` 输出 neutral assembly input，entry root 自己完成 composition | 保持 `infra -> application` 单向依赖；每个 entry 保有自己的 protocol / loop / schedule 语义；Worker 不需要反向边。 | 需要明确 cross-crate handle、消费生命周期和不暴露 partial graph 的门禁。 | 采用。 |
| D. `worker` 把自有 factory callback 传入 infra，由 infra 回调构造 runner | 理论上可避免 infra import worker。 | callback 生命周期、startup error owner 和返回类型容易把 worker graph 重新隐藏进 infra；也会让 infra 参与 worker-specific orchestration。 | 不作为主方案；如后续 exact signature证明必要，只能作为 neutral input 的内部构造机制，不能改变 ownership。 |

### 75.5 采用方案的 ownership 矩阵

| 层 / crate | 拥有的装配责任 | 可以接收 | 明确不得拥有 |
|---|---|---|---|
| `infra/config.rs` | raw parse、section resolution、profile / binding validation、immutable validated root | parser-local raw input | application facade、entry task、business truth、raw diagnostic output |
| `infra/runtime_builder.rs` | single authority、27 local/base adapter、9 external adapter、clock/id、codec/hash、application facade graph、entry-neutral input | validated root、typed fixture、第三方实现库 | `worker` import、route / loop / schedule、partial graph、业务 retry taxonomy |
| `application` graph | 36 Port 注入、Command / Query / Consumer / Job / collaboration service 实现 | concrete Port trait objects、typed technical policy | raw config、physical feed、transport handle、entry retry loop |
| `api` composition root | API parameters、handler facade、route / RPC mapping、API error boundary | complete application command/query facade、typed API params | repository、resolver、UoW、external client、Worker / Jobs crate |
| `worker` composition root | source runner、header-first dispatcher、six closed consumer handlers、capture-ref continuation、processing-action mapping | complete inbound/collaboration application facade、resolved source input、typed Worker params | raw config/ref、repository、UoW、publisher、application Port direct call、generic protocol registry |
| `jobs` composition root | eight closed Job dispatch arms、header/body gate、typed runner、delivery mapping | complete Job application facade、typed Jobs params | journal repository、scheduler truth、scope replan、API / Worker crate |
| host / process | process start、transport ack、scheduler trigger、shutdown | final entry graph only | Capability Hub business state、receipt/report fabrication、startup-to-business-error conversion |

### 75.6 cycle-free neutral handoff 的内容边界

本批锁定后续 neutral input 必须满足以下形态。这里的“input”是 assembly handoff，不是新的 application Port、public network protocol、persisted object 或业务 truth。

| 内容组 | 必须提供 | 生命周期 / owner | 禁止内容 |
|---|---|---|---|
| application facade | 已构造且可调用的 Command / Query / Inbound Consumer / Operations Job / event-collaboration / maintenance facade trait objects | `application` 定义 trait；`infra` 构造；entry 借用或持有 `Arc` | concrete repository、UoW manager、resolver、publisher、raw adapter |
| entry parameters | `CapabilityApiEntryParameters`、`CapabilityWorkerEntryParameters` 或 `CapabilityJobsEntryParameters` 的 validated typed view | `infra` 复制并交给对应 entry；不含 config ref | raw numeric string、profile merge、跨 entry fallback |
| Worker source identity | 六个 named slot 对应的 closed consumer、source family、schema v1 固定关系 | `infra` 解析；`worker` 只校验并 dispatch | topic / group / offset 推导 protocol identity、动态注册第七 slot |
| Worker source handle | 已解析 encoded-envelope feed handle和trusted-actor matcher；fake 与 configured 使用同一 neutral boundary | concrete source adapter owner；worker factory 消费后持有必要 runtime handle | endpoint、credential、secret、raw config、source body、application Port |
| disabled slot | 六个 named slot 中显式的 disabled decision；不产生 runner/task | validated root / infra | 用空成功 runner、fake 成功或隐式 default 替代 |
| technical mapping | worker-local receipt -> `Complete` / `RetrySameEvent` / `Quarantine` 的输入条件 | `worker` owner | 新 public ack enum、raw error text 分类、local delivery truth |

Neutral handoff 必须是 closed、typed、immutable 的 named structure。后续实现不得用 `Vec`、generic map、`serde_json::Value`、string-key registry 或 `Option<dyn Any>` 代替六个 source slot或application facade。若某个 entry 不需要某个 facade，builder 应构造 entry-specific complete input，而不是把未构造的 facade 以 `None` 暴露给 entry。

### 75.7 assembly 生命周期与 partial-graph 初始门禁

本批只锁定 ownership-level 顺序；具体 callable 名、参数和返回类型留 `14.5.2.1` / `14.5.2.2`。生命周期必须遵守以下单向阶段：

```text
raw source
  -> validated immutable root
  -> one local persistence authority
  -> UoW / read-visibility / clock / id / codec / digest bindings
  -> 27 local/base Port adapters
  -> 9 external Port adapters (Configured / DeterministicFake / Disabled)
  -> complete application facade graph
  -> entry-specific typed parameters and neutral source inputs
  -> API / Worker / Jobs-owned composition
  -> complete entry graph validation
  -> host start / task start
```

| 阶段 | blocking 条件 | 失败结果 | 是否允许暴露后续 graph |
|---|---|---|---:|
| validated root | schema/profile/entry/ref/cardinality/compatibility 全部通过 | `InfraError::RuntimeAssembly` | 否 |
| local authority | one `A` 能提供 UoW、commit resolution、linearizable read 和 required indexes | `InfraError::RuntimeAssembly` | 否 |
| Port graph | 27 local/base + 9 external slot 均有 concrete adapter；缺省只能是显式 Disabled adapter | `InfraError::RuntimeAssembly` | 否 |
| application graph | entry 所需 service/facade 完整且 trait object 可调用 | `InfraError::RuntimeAssembly` | 否 |
| configured source | 每个 selected `Configured` / `DeterministicFake` slot 的 feed、actor、fixture 均解析且构造成功 | `InfraError::RuntimeAssembly`；不返回其余 partial source set | 否 |
| explicit Disabled source | slot 明确选择 Disabled，且无 dangling ref | 完整 input 中保留 disabled decision | 是，作为完整 graph |
| entry composition | API handler、Worker runner/dispatcher 或 Jobs runner 全部构造成功 | startup assembly failure；不生成业务 carrier | 否 |
| task / host start | final graph 已通过 entry-specific gate | 仅此后允许启动任务或接收请求 | 是 |

“没有构造某个 optional source”只有在 `Disabled` 已通过 profile / slot validation 时才是完整结果；`MissingSource`、wrong-family、constructor failure、facade omission 和 entry mismatch 都是 blocking failure。任何 startup failure 都不得转成 `ApplicationError`、`CapabilityCommandOutcome`、`CapabilityInboundEventReceipt`、`CapabilityJobResponse` 或 transport-level business retry。

### 75.8 既有 `pub(crate)` binding 的最终处理决定

| 既有声明 | 本批决定 | 后续落点 |
|---|---|---|
| `CapabilityInboundSourceBinding` | 保持 `pub(crate)`；只用于 infra config validation 和 source resolution | `14.5.2.1` 逐 slot resolver；`14.5.2.2` 转换为 neutral source input |
| `CapabilityInboundSourceBindings` | 保持六个 named private fields；不得转成 `Vec` / map | `14.5.2.1` 完整 source-set construction |
| `CapabilityWorkerEntryBinding` | 保持 infra-local aggregate；不跨 crate 直接传递 | `14.5.2.2` 由 builder 复制 typed params、解析 handles并丢弃 config refs |
| `CapabilityEntryParameters::as_worker` | 保持 `pub(crate)`；不作为 Worker crate API | `14.5.2.2` 新增 cross-crate assembly accessor / complete input |
| `CapabilityWorkerEntryParameters` | 可作为 validated typed entry value 跨 crate 消费；字段仍 private，参数读取通过有 Rustdoc 的 accessor | `14.5.2.2` Worker root constructor |

本批不把 raw/validated config 类型扩大为 `pub`，也不把 infra-local `CapabilityWorkerEntryBinding` 伪装成 public protocol。跨 crate boundary 只允许传递已解析的 typed runtime handle和 application facade；config refs 在转换完成后立即丢弃。

### 75.9 Rustdoc、基线与 blocker 审计

本批没有新增 Rust declaration，因此结构体 / 字段 / enum / variant / payload / callable 注释计数为 `0`。后续 `14.5.2.1~14.5.2.2` 一旦写出 neutral input、resolved source handle、facade graph 或 factory callable，必须逐项提供英文 `///`：struct 本身、每个 field、enum 及每个 variant、variant payload、每个 constructor/accessor/factory 都不能省略。不能以 private field、type alias、macro 或 callback 隐藏未注释声明。

| 审计项 | 结果 |
|---|---|
| `infra -> worker` Cargo edge | `0`；本批明确拒绝 |
| `api <-> worker/jobs`、`worker <-> jobs` edge | `0`；三个 root 独立 |
| partial facade / graph exposure | `0`；只允许 complete result 或显式 Disabled slot |
| application Port / repository / protocol / state baseline | unchanged：36 Ports、22/110 repositories、250 public types、83 flows、24/111/638 state baseline |
| Capability Hub scope pollution | none；不引入 runtime execution、tools execution、marketplace listing、governance approval truth、method body、SDK client或local delivery lifecycle |
| unresolved upstream blocker | `0` |
| non-blocking debt | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`、`CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` 保持原状态 |

### 75.10 正式 §13 回填草稿（本批增量）

以下文字只作为 Step 19 装配正式 §13 的 source，不修改正式文档：

```markdown
### 13.7 Runtime builder 与三个 composition root

`infra` 只负责从 immutable validated root 构造 single persistence authority、全部 application-owned Port adapter、application service/facade graph及entry-neutral assembly input。`infra`不得依赖`worker`、`api`或`jobs`，不得启动entry loop，也不得暴露partial graph。

API、Worker、Jobs分别拥有自己的composition root。API只组装typed Command / Query handler；Worker消费已解析的六个named source input，自行组装header-first dispatcher、closed consumer handler和exact capture-ref continuation；Jobs只组装八个typed one-shot runner。三个entry均只消费application facade和validated entry parameters，不持有repository、UoW、resolver、publisher或raw config。

`Configured`、`DeterministicFake`和`Disabled`是显式完整binding语义；missing source、wrong-family、constructor failure或required facade缺失在startup阶段形成`InfraError::RuntimeAssembly`。startup failure不伪造Command response、Inbound receipt或Job report；Deployment不得把真实依赖缺失静默替换成fake。
```

### 75.11 本批自检与停审条件

| gate | 结果 | 依据 |
|---|---|---|
| SOP 八问已回答 | pass | §75.2；本批八问均给出 owner、边界或后续批次 |
| historical composition wording 已隔离 | pass | §75.3；旧句子不再作为实现指令 |
| 方案比较已完成 | pass | §75.4；采用 neutral input + entry-owned composition |
| `infra` / `worker` cycle-free direction | pass | §§75.5、75.8；无反向 Cargo edge |
| existing `pub(crate)` binding 处理 | pass | §75.8；不泄漏 raw config/ref |
| partial graph gate 初始形态 | pass | §75.7；complete result / explicit Disabled / startup failure 三分清楚 |
| Rustdoc gate | pass | 本批新增声明 `0`；后续声明门禁已明确 |
| 正式文档与实现纪律 | pass | 正式 `03`、`04`、implementation ledger、boundary skeleton、测试、run、evidence、commit均未创建或声称 |
| unresolved upstream blocker | pass | `0` |

Batch `14.5.2.0` 完成并停审。下一批只允许在用户确认后进入 `14.5.2.1`，写入 `infra` runtime builder 的 exact stage order、每一阶段的输入 / 输出 / blocking failure 和 single-authority graph 形成顺序；不得自动进入 `14.5.2.2`、`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03` assembly、`04-配置设计.md`或任何实现产物。

## 76. Batch `14.5.2.1` 开工确认与本批输出

用户已确认继续。本批只推进 Step 14 的 runtime builder stage-order 子批，不推进三个 entry 的最终 composition callable。当前正式 `03-详细设计.md` 仍是 historical material；本批只写入本中间产物，供 Step 19 回填正式 §13。

### 76.1 本批读取门禁

| 输入 | 本批承接的结论 | 本批不重新定义的内容 |
|---|---|---|
| 详细设计 SOP Step 14、书写规范 §5.13 | 必须给出配置读取 owner、外部绑定点、失败/降级边界和跨仓依赖处理 | 不写 `04-配置设计.md` 的 raw key、source precedence、数值默认值 |
| Step 4 文件布局、Step 5 模块主轴 | 七个 workspace member 已固定；`infra/runtime_builder.rs`拥有基础设施装配；entry crate拥有自己的 loop / route / runner | 不新增第八个 crate，不重划限界上下文 |
| Step 7 `36` Port 与 `22 / 110` repository surface | 27 个 local/base Port 和 9 个 external Port必须全部有 concrete binding；repository method surface不变 | 不新增 Port、repository、finder、private registry或第二套 adapter interface |
| Step 8 / 9 protocol 与 flow | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job的既有 facade / flow是 application truth | 不在 builder中 dispatch业务协议、不改变 DTO、state或flow |
| Step 11 / 13 transaction、authority、idempotency | 一个 `A` 覆盖所有需要原子提交的 local store；commit unknown只能走 `resolve_commit` | 不由 builder补偿业务写入、不从普通 row absence猜commit结果 |
| Step 12 error owner | startup validation / construction使用 `InfraError::RuntimeAssembly`；已运行 Port失败沿既有 `ApplicationError` | 不新增 `ConfigError`、startup protocol response或业务issue variant |
| Step 14 §§33~38、39~66、67~75 | local/base、external、Inbound、Outbound、Job绑定已有 owner；`14.5.2.0`已锁定 cycle-free neutral handoff | 本批不写 API / Worker / Jobs 的最终 cross-crate struct 与 factory signature，留 `14.5.2.2` |

### 76.2 本批必须留下的可审查结果

1. 一个从 immutable `CapabilityRuntimeConfig` 到 complete neutral assembly input 的编号阶段序列。
2. 每个阶段的精确输入、输出、blocking predicate、失败 owner和允许保留的中间状态。
3. 单一 local persistence authority `A` 的形成、校验、注入和身份证明顺序。
4. 27 个 local/base adapter、9 个 external adapter、codec/hash、clock/id、application facade之间的先后关系。
5. partial graph不得逃逸的返回边界，以及 `Configured` / `DeterministicFake` / `Disabled` 的阶段语义。
6. 不新增 Rust declaration 的情况下，给出实现者可直接照写的 callable contract、伪代码和失败映射。

### 76.3 本批明确不输出

- API、Worker、Jobs 三个 composition root 的最终字段、所有权和跨 crate accessor；留 `14.5.2.2`。
- 完整 partial/fake/disabled/missing 组合矩阵、cycle audit、formal §13 最终回填和 Step 14 完成门禁；留 `14.5.2.3`。
- 具体数据库、message bus、HTTP framework、scheduler、secret product、endpoint、topic、credential或数值参数。
- 目标实现仓、Cargo 文件、测试脚本、implementation ledger、planned boundary skeleton、真实 run/evidence/sign-off或commit。

## 77. `14.5.2.1` SOP 八问与当前材料诊断

### 77.1 SOP 八问回答

| SOP 问题 | 本批裁决 |
|---|---|
| 1. 哪些模块需要读取配置？ | 只有 `infra/config.rs` 在 startup 形成 `CapabilityRuntimeConfig`，只有 `infra/runtime_builder.rs` 通过 crate-private accessor 消费它。adapter 文件只接收已解析 constructor input；application、domain、contracts和三个 entry不读取 root/ref/raw source。 |
| 2. 配置项的类型、默认值和读取位置是什么？ | 类型已在 §§14~24、28 固定；本批只规定读取阶段和 presence gate。raw key、source precedence、单位、边界和数值默认值交给 `04`，builder不得自行 default、merge或fallback。 |
| 3. 哪些外部依赖需要通过 adapter 注入？ | 九个 external Port均在 local/base graph之后通过 family-specific adapter注入；六个 Worker feed/actor source和十个 outbound route也只在对应 entry-neutral resolver阶段解析。运行期依赖不进入 Cargo。 |
| 4. 外部依赖的超时、重试、降级策略是什么？ | timeout / retry policy由 validated technical policy提供；builder只绑定 wrapper，不分类业务结果。`Configured`构造失败阻断 startup，`Disabled`形成完整 Port并在调用时返回 `NotConfigured`；合法 typed unavailable / retryable outcome仍由 application拥有。 |
| 5. 哪些配置细节留给 `04`？ | 文件格式、key/env/CLI precedence、具体数字、endpoint/transport/credential section、profile示例、部署挂载和敏感值引用方式全部留 `04`；本批只给出字段 owner和消费阶段。 |
| 6. 哪些跨仓 Rust 编译期依赖需要 path dependency？ | 只有 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；member direct-use矩阵沿用 §§68~74。builder不能把 runtime/event/downstream sibling变成 Cargo edge。 |
| 7. 哪些运行期或事件协作依赖通过 adapter/event/projection/fake表达？ | 外部 resolver、handoff、event collaboration、Worker feed/trusted actor、Outbound route和测试 fixture均通过既有 Port、neutral source handle、event capture或fake表达；不创建本地 outbox、relay、delivery state或generic registry。 |
| 8. 依赖仓库不存在或不兼容时怎么办？ | `core-contracts` package/lib/path/signature不兼容时暂停依赖该类型的实现；运行期依赖缺失、wrong-family、constructor failure或authority guarantee不足时返回 `InfraError::RuntimeAssembly`。Local/Integration只能显式选择审定 fake，Deployment不得静默替换。 |

### 77.2 旧材料与前序 wording 诊断

| 材料 | 风险 | 本批处理 |
|---|---|---|
| `03` 旧 provider / runtime / gateway 主线 | 会把 builder理解成 provider execution gateway或统一 runtime service | 继续隔离为 `historical_material`；builder只组装 capability-hub application Port和entry-neutral input |
| `14.4.2` “infra调用 worker factory”措辞 | 会产生 `infra -> worker` 反向依赖或让 infra持有 Worker loop | 以 `14.5.2.0` 裁决替换：infra只交付 neutral input，Worker root自己构造 runner |
| `14.3` “local/base graph保留”简略顺序 | 只说明前半，不足以让实现者判断 authority、codec、external和facade的精确先后 | 本批扩展为 numbered stage contract；每个 stage必须通过 gate后才能生成下一个输出 |
| 旧配置中的 outbox、retry、quota、cost、policy refresh | 会把外部交付或治理 truth本地化 | 不进入任何 stage input/output；仅保留既有 Port、typed outcome和safe summary边界 |

### 77.3 方案取舍

| 方案 | 优点 | 缺点 / 边界风险 | 结论 |
|---|---|---|---|
| 单一 `build_all()` 直接返回三个 entry graph | 调用点少 | 隐藏阶段失败、强迫 infra拥有 entry类型、容易暴露 partial graph并形成反向依赖 | 拒绝 |
| 每个 repository自行建立 authority/session | 文件局部简单 | 破坏跨repository atomicity、commit resolution和same-authority read | 拒绝 |
| 先构造 application facade，再补 Port | facade代码可先写 | service可能捕获不完整 Port、失败难以在startup定位、会形成可调用partial graph | 拒绝 |
| 编号 stage，先完成 authority/codec/local/external/facade，再输出neutral input | 失败边界可审计，单一owner清晰，entry与infra解耦 | 需要明确每个stage的不可变输出和丢弃规则 | 采用 |

## 78. Runtime builder 阶段模型与总拓扑

### 78.1 阶段编号

`infra/runtime_builder.rs` 必须按以下八个阶段执行。阶段编号是设计契约，不是新增状态机；它们是 startup-local control flow，不能写入Capability Hub业务状态、event、trace、job journal或持久化记录。

| Stage | 名称 | 进入条件 | 产出 | 失败是否允许继续 |
|---:|---|---|---|---:|
| 0 | `validate_root` | parser已形成candidate | immutable `CapabilityRuntimeConfig` | 否 |
| 1 | `build_authority` | root schema/profile/entry/ref gate通过 | 一个 `A` authority handle | 否 |
| 2 | `bind_technical_primitives` | `A`已通过atomicity/read guarantee | `UoW manager`、`K`、clock、id和technical wrappers | 否 |
| 3 | `bind_local_base_ports` | Stage 2所有primitive完整 | 27个local/base Port trait object | 否 |
| 4 | `bind_external_ports` | Stage 3 local graph完整 | 9个external Port trait object | 否 |
| 5 | `build_application_facades` | 36个Port和technical policy完整 | selected entry所需application service/facade graph | 否 |
| 6 | `resolve_entry_neutral_inputs` | application facade完整、entry variant匹配 | API/Worker/Jobs对应的validated parameters和neutral source inputs | 否 |
| 7 | `handoff_complete_graph` | entry-neutral input完整且无config ref | 一个entry-specific complete handoff；entry root随后自行composition | 否 |

任何 stage 返回错误，都必须丢弃该 stage及其之前尚未转移所有权的局部构造物；不得把已完成的前缀作为 `Ok` 返回。Stage 0~7的失败都发生在“host start / request receive / task spawn”之前，因此统一为 `InfraError::RuntimeAssembly`，但source chain中的safe internal category必须保留具体失败阶段和subject，不能用字符串猜测。

### 78.2 总拓扑

```text
raw parser candidate
  -> [S0] CapabilityRuntimeConfig::try_from_candidate
       -> validated immutable root
  -> [S1] one local persistence authority A
       -> [S2] UoW manager + K + clock + id + technical wrappers
  -> [S3] 27 local/base Port objects, all sharing A
  -> [S4] 9 external Port objects, each exact slot/family
  -> [S5] application service/facade graph, all required dependencies present
  -> [S6] entry-neutral parameters + resolved source handles
  -> [S7] complete handoff to exactly one selected entry root
       -> api / worker / jobs-owned composition
       -> host start, request receive or task spawn
```

关键说明:

- 图表达 startup assembly ownership和失败顺序，不表达业务调用流、事件传输拓扑或外部产品部署拓扑。
- `A`是所有local transaction-capable adapter的唯一authority；`K`只负责固定codec/digest compatibility，不是第二个store或业务service。
- Stage 7交付的是entry-specific neutral handoff，不是由infra创建的Worker/API/Jobs loop；具体handoff类型和factory由 `14.5.2.2` 收口。
- 显式 `Disabled` 在Stage 4或Stage 6作为一个已验证的完整 binding 保留；它不是失败的 `Configured`，也不是缺少字段。

### 78.3 Stage 0 的输入与输出

| 项 | exact contract |
|---|---|
| 输入 | parser-local `CapabilityRuntimeConfigCandidate`，其中所有symbolic ref、profile、entry、all nine external slots、Worker six slots（若适用）和Outbound ten route refs（若适用）已通过bounded structural parse |
| callable | `CapabilityRuntimeConfig::try_from_candidate(candidate: CapabilityRuntimeConfigCandidate) -> Result<CapabilityRuntimeConfig, InfraError>`；该既有callable的Rustdoc已在§15声明 |
| 检查 | schema version、profile matrix、entry/parameter variant、ref section family、slot cardinality、compatibility pair、禁止配置面和Deployment fake ban |
| 输出 | process-lifetime immutable `CapabilityRuntimeConfig`；只通过既有crate-private accessor读取 |
| 丢弃规则 | candidate、parser raw value、raw secret/body和validation issue source不离开 `infra/config.rs`；成功后不保存raw document |
| blocking failure | `CapabilityConfigValidationIssues::into_runtime_assembly_error()` -> `InfraError::RuntimeAssembly`；不创建任何adapter、facade或entry carrier |

Stage 0的“成功”不等于外部连接可用；它只证明所有需要在后续构造阶段解析的binding声明完整且类型正确。Configured endpoint/credential等resolved material仍在后续Stage 4/6按owner解析，不能在Stage 0以raw value形式进入其它crate。

### 78.4 Stage 1 的输入与输出

| 项 | exact contract |
|---|---|
| 输入 | `&CapabilityRuntimeConfig`、selected `CapabilityLocalPersistenceBinding`、profile和必要的typed deterministic fixture `F` |
| callable | `build_local_persistence_authority(binding: &CapabilityLocalPersistenceBinding, profile: CapabilityRuntimeProfileKind, fixture: Option<&DeterministicFixtureState>) -> Result<Arc<CapabilityLocalPersistenceAuthority>, InfraError>`；这是planned infra-private callable，实施时必须为函数及所有新声明补英文 `///` |
| 检查 | binding分支与profile合法；Deployment只允许durable；authority能建立required logical indexes/current constraints、CAS/unique、stable cursor、opaque transaction ref、commit status和linearizable read barrier |
| 输出 |唯一process-lifetime `A`；`A`同时拥有truth、relation、projection/reference、idempotency/result、capture和job journal所需local authority能力 |
| 失败 | binding section missing/wrong family、fixture不匹配、authority初始化失败、required index缺失、transaction/read guarantee无法证明 -> `InfraError::RuntimeAssembly` |
| 禁止 | 创建多个A、按logical store拆连接池、把A暴露给application/entry、用replica/cache/sleep补read barrier、将`InMemory`当作无CAS的map |

Stage 1输出必须在构造时完成authority capability gate。不能先返回一个“连接已创建但index/transaction guarantee稍后检查”的 `A`；这类对象属于partial graph，必须被转换为startup failure并销毁。

### 78.5 Stage 2 的输入与输出

| 项 | exact contract |
|---|---|
| 输入 | `A`、fixed `CapabilityCompatibilityBinding`、`CapabilityClockBinding`、`CapabilityIdGeneratorBinding`、`CapabilityRuntimeTechnicalPolicy`和profile-specific fixture material |
| callable顺序 | `build_unit_of_work_manager(A, technical_policy)` -> `build_codec_digest_binding(compatibility)` -> `build_clock(clock_binding, fixture)` -> `build_id_generator(id_binding, fixture)` -> `build_technical_invocation_wrappers(technical_policy)` |
| 检查 | UoW `begin/commit/rollback/resolve_commit`均指向同一A；K固定为`StableSurfaceV1 + Sha256V1`；clock/id各自唯一且不互相替代；timeout/retry wrapper只接受已验证bounded policy |
| 输出 |一个 `CapabilityUnitOfWorkManager` trait object、一个内部K、一个`ClockPort`、一个`IdGeneratorPort`和technical wrapper set；它们均为后续adapter/service constructor input |
| 失败 | manager无法证明A identity、codec/digest profile不匹配、clock/id fixture构造失败、policy wrapper无法建立deadline/attempt bound -> `InfraError::RuntimeAssembly` |
| 禁止 | codec/hash algorithm由配置动态选择；DB/client提供application time；entry自行生成id；wrapper按raw error text分类或把retry policy写进业务state |

Stage 2必须先复制/保有 `uow.transaction_ref().clone()` 所需的能力，但不得在startup创建业务UoW、reserve、capture、job journal或任何业务写入。`U`只在后续application调用期间由UoW manager按A创建。

## 79. Stage 3：27 个 local/base Port 的 exact binding 顺序

### 79.1 Stage 3 输入、输出与顺序约束

Stage 3 只消费 Stage 0~2 已经通过 gate 的 immutable root、`A`、`K`、UoW manager、clock、id 和 technical wrappers。它不重新读取 raw config，也不打开业务 transaction。这里的 `LocalBasePortGraph` 只是 runtime builder 内部的组合结果名称，不是新的 application trait、public protocol 或 persisted object；本批不新增该类型的 Rust declaration。

Stage 3 的输出必须同时满足：

1. 27 个 local/base Port binding slot 全部有唯一 owner；
2. 22 个 repository adapter、read-visibility adapter 和 UoW manager 都能证明使用同一个 `A`；
3. `ClockPort`、`IdGeneratorPort`、`CapabilityReadVisibilityResolverPort` 不从 entry 或外部 adapter 反向取得替代实现；
4. 每个 adapter constructor 只接收已经解析的 typed input，不接收 `CapabilityRuntimeConfig`、config ref、raw endpoint、credential 或 fixture name；
5. 任何一个 slot 失败都丢弃整个 local/base prefix，不向 Stage 4 或 application graph 返回部分结果。

### 79.2 27 个 slot 的编号绑定表

下表是 implementation-order contract。表中的“constructor”是实现时应落在既有 `infra` 文件中的 crate-private builder callable；它不是新增 Port。所有新增 callable 必须带英文 `///` Rustdoc，参数、返回类型和 failure source 必须与表中契约一致。

| 顺序 | Port / trait | concrete owner / 文件 | 构造输入 | 成功 gate 与下游用途 |
|---:|---|---|---|---|
| 1 | `CapabilityUnitOfWorkManager` | `CapabilityLocalUnitOfWorkManager` / `infra/runtime_builder.rs` | Stage 2 的 `A`、transaction/observation wrappers | `begin`、`commit`、`rollback`、`resolve_commit` 均绑定同一 `A`；作为所有 write service 的唯一 UoW owner |
| 2 | `ClockPort` | `SystemClockAdapter` 或 `DeterministicClockAdapter` / `infra/clock_id.rs` | validated `CapabilityClockBinding`、typed fixture（仅允许 profile） | `now()` 唯一且可测试；注入 domain/application service，不能由 DB、entry 或 external response替代 |
| 3 | `IdGeneratorPort` | `SystemIdGeneratorAdapter` 或 `DeterministicIdGeneratorAdapter` / `infra/clock_id.rs` | validated `CapabilityIdGeneratorBinding`、typed fixture（仅允许 profile） | Step 7 已声明的全部 typed id method 可用；不以 digest、URL、trace 或 job id 代替 |
| 4 | `CapabilityIdentityRepository` | `CapabilityIdentityRepositoryAdapter` / `infra/repositories.rs` | `A` | identity-key unique、current/history index、CAS 和 exact get/search 可用 |
| 5 | `CapabilityAccessReviewRepository` | `CapabilityAccessReviewRepositoryAdapter` / `infra/repositories.rs` | `A` | review current/history、`Recorded` 过滤、CAS 和 rollback 可用；不拥有 governance approval |
| 6 | `CapabilityRegistryRepository` | `CapabilityRegistryRepositoryAdapter` / `infra/repositories.rs` | `A` | identity owner、current lifecycle、typed list、CAS 可用；不读取 runtime/marketplace状态 |
| 7 | `AdapterDescriptorRepository` | `AdapterDescriptorRepositoryAdapter` / `infra/repositories.rs` | `A` | registry owner、descriptor current/history、body-free字段、CAS 可用 |
| 8 | `DescriptorSafeSummaryRepository` | `DescriptorSafeSummaryRepositoryAdapter` / `infra/repositories.rs` | `A` | risk summary 与 secret safe summary 两个 logical store 的 union/owner/CAS 校验可用；不读取 secret正文 |
| 9 | `GovernanceSeamRepository` | `GovernanceSeamRepositoryAdapter` / `infra/repositories.rs` | `A` | seam current/history、`Unresolved` current、CAS 可用；不生成或覆盖治理审批 |
| 10 | `CapabilityMethodRelationRepository` | `CapabilityMethodRelationRepositoryAdapter` / `infra/repositories.rs` | `A` | identity/method-ref 对称、current/history、CAS 可用；不读取 method body |
| 11 | `FormalExposureRepository` | `FormalExposureRepositoryAdapter` / `infra/repositories.rs` | `A` | registry owner、non-retired current、CAS 可用；不创建 SDK package/client |
| 12 | `FormalVisibilityRepository` | `FormalVisibilityRepositoryAdapter` / `infra/repositories.rs` | `A` | exposure owner 与 `source_exposure_version` 对称；不得从 runtime allowlist 推导 visibility |
| 13 | `CapabilityChangeRecordRepository` | `CapabilityChangeRecordRepositoryAdapter` / `infra/repositories.rs` | `A` | 六类 change variant append-only、source owner 和 unique guard 可用 |
| 14 | `CapabilityTraceabilityRepository` | `CapabilityTraceabilityRepositoryAdapter` / `infra/repositories.rs` | `A` | exact revision/current lookup、next-revision CAS、无 gap/multiple-highest 可用 |
| 15 | `CapabilityImpactRepository` | `CapabilityImpactRepositoryAdapter` / `infra/repositories.rs` | `A` | impact 与 downstream summary 两组 method、consumer/source-feedback unique、CAS 可用 |
| 16 | `CapabilityTruthSnapshotRepository` | `CapabilityTruthSnapshotRepositoryAdapter` / `infra/repositories.rs` | `A`、typed scope index | committed ref/version page 可用；不返回 row dump、mixed-time body 或 derived body |
| 17 | `ControlledConsumerViewRepository` | `ControlledConsumerViewRepositoryAdapter` / `infra/projection_stores.rs` | `A` | exposure+consumer current、affected-by-truth/reference index、stable page、CAS 可用 |
| 18 | `CapabilityDerivedMaterialRepository` | `CapabilityDerivedMaterialRepositoryAdapter` / `infra/projection_stores.rs` | `A`、必要的 `K` verifier | directory/audit-export/ecosystem material 的 exact get/find/search/save 与 typed scan 可用 |
| 19 | `CapabilityReconciliationReportRepository` | `CapabilityReconciliationReportRepositoryAdapter` / `infra/projection_stores.rs` | `A` | immutable append、scope/job-run read 可用；不得 update/delete/repair truth |
| 20 | `CapabilityExternalReferenceRepository` | `CapabilityExternalReferenceRepositoryAdapter` / `infra/reference_stores.rs` | `A`、`K` 的 candidate-digest verifier | 八类 body-free reference union、kind+digest unique、scope scan、CAS 可用 |
| 21 | `ReferenceResolutionStateRepository` | `ReferenceResolutionStateRepositoryAdapter` / `infra/reference_stores.rs` | `A` | 每个 subject 单一 current state、state-id 对称、typed scan、CAS 可用 |
| 22 | `CapabilityIdempotencyRepository` | `CapabilityIdempotencyRepositoryAdapter` / `infra/idempotency_store.rs` | `A`、`K` | atomic reserve、`Reserved -> Completed`、initial expected version 和 collision read 可用 |
| 23 | `StoredCapabilityResultRepository` | `StoredCapabilityResultRepositoryAdapter` / `infra/idempotency_store.rs` | `A`、`K` | command shell、consumer receipt、typed Job report 的 exact codec/surface symmetry 可用 |
| 24 | `CapabilityEventCaptureRepository` | `CapabilityEventCaptureRepositoryAdapter` / `infra/idempotency_store.rs` | `A`、`K` | snapshot+capture same-UoW、`(source_ref,schema_ref)` unique、intent bind CAS 可用 |
| 25 | `CapabilityJobExecutionRepository` | `CapabilityJobExecutionRepositoryAdapter` / `infra/idempotency_store.rs` | `A`、`K` | normalized-key journal、initial create、per-target/final CAS、plan/terminal immutability 可用 |
| 26 | `CapabilityReadVisibilityResolverPort` | `CapabilityReadVisibilityResolverAdapter` / `infra/read_visibility.rs` | `A`、已建立 owner/visibility/reference/material indexes | resolver-first 的 12 个 callable、empty-page、NotVisible/Degraded marker 和 source-version symmetry 可用 |
| 27 | `CapabilityUnitOfWork` | `CapabilityLocalUnitOfWork` per-operation factory / `infra/runtime_builder.rs` | slot 1 的 manager、`A`、新 opaque `CapabilityTransactionRef` | 只在 application operation 中由 manager 创建；可被 repository 接收但不暴露 staged rows，不在 startup 创建业务 UoW |

顺序 1~3 是对 Stage 2 primitive 的 ownership handoff，而不是重复构造；顺序 27 是每次 operation 的 factory contract，而不是 process-lifetime singleton。这样既完整计入 5 个 base/read-gate Port，又避免 startup 期间产生 reservation、capture 或 Job journal。

### 79.3 Stage 3 的 constructor 与 failure gate

每个 repository constructor 的输入必须来自上一阶段已经保存的 typed handle。不得出现如下隐式读取：在 `reference_stores.rs` 中重新读取 external resolver 配置、在 `projection_stores.rs` 中创建独立 search client、在 `idempotency_store.rs` 中创建第二个 transaction manager，或在 read resolver 中从 empty page 猜 `Visible`。

Stage 3 通过以下顺序验证 single-authority identity：

```text
Stage 2 UoW manager + A
  -> construct 22 repository adapters with the same A handle
  -> construct read-visibility resolver from the same A and its indexes
  -> verify every transactional adapter carries the same authority identity
  -> retain the complete local/base graph
```

伪代码中的每个调用均必须回指既有 Step 7 trait；实现时不得把下列注释替换成 generic `load_all()`、`register_store()` 或 string-key lookup：

```rust
// [CapabilityUnitOfWorkManager::begin()]
// No call is made during startup; this is the per-operation factory contract.

// [CapabilityIdentityRepositoryAdapter::new(A)]
// [CapabilityAccessReviewRepositoryAdapter::new(A)]
// [CapabilityRegistryRepositoryAdapter::new(A)]
// [AdapterDescriptorRepositoryAdapter::new(A)]
// [DescriptorSafeSummaryRepositoryAdapter::new(A)]
// [GovernanceSeamRepositoryAdapter::new(A)]
// [CapabilityMethodRelationRepositoryAdapter::new(A)]
// [FormalExposureRepositoryAdapter::new(A)]
// [FormalVisibilityRepositoryAdapter::new(A)]
// [CapabilityChangeRecordRepositoryAdapter::new(A)]
// [CapabilityTraceabilityRepositoryAdapter::new(A)]
// [CapabilityImpactRepositoryAdapter::new(A)]
// [CapabilityTruthSnapshotRepositoryAdapter::new(A)]
// [ControlledConsumerViewRepositoryAdapter::new(A)]
// [CapabilityDerivedMaterialRepositoryAdapter::new(A, K)]
// [CapabilityReconciliationReportRepositoryAdapter::new(A)]
// [CapabilityExternalReferenceRepositoryAdapter::new(A, K)]
// [ReferenceResolutionStateRepositoryAdapter::new(A)]
// [CapabilityIdempotencyRepositoryAdapter::new(A, K)]
// [StoredCapabilityResultRepositoryAdapter::new(A, K)]
// [CapabilityEventCaptureRepositoryAdapter::new(A, K)]
// [CapabilityJobExecutionRepositoryAdapter::new(A, K)]
// [CapabilityReadVisibilityResolverAdapter::new(A, owner_indexes)]
```

上述是 Rust-style assembly notation，不是声称这些 concrete `new` callable 已存在。实现时每个新增 `new` 或等价 constructor 都必须有英文 `///`，且必须返回 typed construction error，不能返回一个稍后再校验 index、transaction 或 codec 的 partial adapter。

| Stage 3 blocking condition | 失败 owner | 统一启动面 | 禁止的替代行为 |
|---|---|---|---|
| 任一 repository slot 未绑定或重复绑定 | `infra/runtime_builder.rs` | `InfraError::RuntimeAssembly` | `Option<Port>`、generic map、延迟发现 |
| adapter 使用了不同 `A` 或无法证明同一 authority | local adapter constructor | `InfraError::RuntimeAssembly` | 跨库 best-effort、sleep、replica fallback |
| required unique/current/CAS/index 不可用 | authority / adapter | `InfraError::RuntimeAssembly` | application memory补索引、last-write-wins |
| codec/surface/digest verifier 未绑定 | `idempotency_store.rs` / relevant adapter | `InfraError::RuntimeAssembly` | adapter自选 serde、重算 stored bytes |
| read resolver 缺少 owner/source-version index | `read_visibility.rs` | `InfraError::RuntimeAssembly` | empty page默认 visible、先读 body 再猜 marker |
| fake profile 省略 durable semantics | fake adapter construction | validation/assembly failure | fake map shortcut、跳过 CAS/unique/rollback |

## 80. Stage 4：9 个 external Port 的 exact binding 顺序

### 80.1 Stage 4 进入门禁

只有 Stage 3 的 27 个 local/base slot 全部通过，Stage 4 才能开始解析 external adapter binding。Stage 4 只为既有 9 个 external Port 创建 concrete Port object；它不创建 external truth、不保存正文、不启动 transport loop，也不把 runtime/event/downstream sibling 加入 Cargo。

Stage 4 的严格顺序如下：

| 顺序 | external Port | owner / 文件 | Configured 输入 | DeterministicFake 输入 | Disabled 结果 |
|---:|---|---|---|---|---|
| 1 | `ExternalCapabilitySourceReferencePort` | `infra/source_resolvers.rs` | exact external-source adapter ref、已解析 safe runtime handle | exact source fixture | typed Port implementation; call 时返回 `NotConfigured` |
| 2 | `GovernanceResultReferencePort` | `infra/source_resolvers.rs` | exact governance-result adapter ref、body-free result resolver handle | exact governance fixture | typed `NotConfigured` Port |
| 3 | `MethodAssetReferencePort` | `infra/source_resolvers.rs` | exact method-asset adapter ref、body-free asset resolver handle | exact method fixture | typed `NotConfigured` Port |
| 4 | `SecretReferencePort` | `infra/source_resolvers.rs` | exact secret-ref adapter ref、safe summary resolver handle | exact secret-summary fixture | typed `NotConfigured` Port；不暴露 secret正文 |
| 5 | `ExternalDocumentReferencePort` | `infra/source_resolvers.rs` | exact document adapter ref、body-free document resolver handle | exact document fixture | typed `NotConfigured` Port |
| 6 | `CapabilityConsumerReferencePort` | `infra/source_resolvers.rs` | exact consumer adapter ref；同时构造 runtime/tools 与 SDK 两个既有 callable | exact consumer fixture覆盖两个 closed consumer family | typed `NotConfigured` Port；两 callable 都不可伪造成功 |
| 7 | `ObservabilityAuditReferencePort` | `infra/source_resolvers.rs` | exact observability/audit reference adapter ref | exact audit-reference fixture | typed `NotConfigured` Port |
| 8 | `ObservabilityAuditHandoffPort` | `infra/handoff_adapters.rs` | exact handoff target adapter ref、typed handoff handle | exact handoff fixture | typed `NotConfigured` Port |
| 9 | `CapabilityAccessEventCollaborationPort` | `infra/publishers.rs` | exact collaboration adapter ref、10 named route refs、route-neutral runtime handle | exact ten-family collaboration fixture | typed `NotConfigured` Port；不产生 capture/delivery success |

Stage 4 共有 14 个既有 external callable：5 个单 callable resolver、consumer 的 2 个 callable、handoff 的 2 个 callable、collaboration 的 4 个 callable，以及 observability reference 的 1 个 callable；它们仍由 Step 7 定义，不新增 Port 或 generic external client trait。

### 80.2 三种 binding 的共同构造算法

每个 slot 必须先执行 closed family/schema/fixture gate，再选择 concrete branch；不得先创建一个 `Option`，之后由 application 猜测是否可用。

```text
validated external slot
  -> exact family/ref/fixture validation
  -> Configured: resolve typed runtime handle -> construct Port
  -> DeterministicFake: resolve typed fixture -> construct parity Port
  -> Disabled: construct exact NotConfigured Port
  -> verify Port callable surface and safe failure mapping
```

`Configured` 的 endpoint、credential、TLS、transport 或 product-specific handle只能停留在 infra adapter 私有值；它们不能进入 application Port method、protocol DTO、digest、trace、stored result 或日志 safe field。`DeterministicFake` 必须使用与 Configured 相同的 body-free、source/ref symmetry、typed failure 和 retry eligibility；fake 不能直接调用 application service 来绕过 Port。

`Disabled` 是成功的 startup binding，但不是成功的业务调用。其 Port 必须实现既有 trait，调用时返回 `ApplicationError::PortFailure` 中对应 Port 的 `NotConfigured` 类别；它不生成 placeholder reference、empty success、fake outcome、event collaboration intent 或 audit receipt。

### 80.3 Stage 4 blocking matrix

| 条件 | Configured | DeterministicFake | Disabled |
|---|---|---|---|
| adapter/fixture ref 缺失 | startup `InfraError::RuntimeAssembly` | startup `InfraError::RuntimeAssembly` | 不适用；variant本身必须存在 |
| section family 错误 | startup `InfraError::RuntimeAssembly` | startup `InfraError::RuntimeAssembly` | dangling child ref 仍是 startup failure |
| profile 禁止 fake | 不适用 | startup `InfraError::RuntimeAssembly` | 不适用 |
| concrete constructor 失败 | startup `InfraError::RuntimeAssembly` | startup `InfraError::RuntimeAssembly` | 不适用 |
| 外部 owner 在业务调用时暂不可用/超时 | existing typed `PortFailure`，由 application决定是否 bounded retry | 同一 typed `PortFailure` 分类 | `NotConfigured`，不得自动 fallback |
| typed response 结构不对称 | existing `InvalidTypedResponse` / `ConsistencyDefect` | 同一分类，不能降为 fake success | 不产生 response |
| external outcome 为合法失败状态 | typed successful outcome，保留 external owner 语义 | 同一 outcome shape | 不产生 outcome |

Stage 4 结束时，9 个 Port slot 必须全部为 concrete object。`Configured`、`DeterministicFake`、`Disabled` 三者都进入同一 typed Port graph；只有“缺失、wrong-family、profile mismatch、constructor failure”才是 partial graph。Stage 4 不把 external unavailable 转成 startup failure，除非 unavailable 发生在 adapter 构造/契约验证阶段；运行期 unavailable 必须留在既有 application error/outcome surface。

### 80.4 Collaboration route 的附加 gate

对于第 9 个 `CapabilityAccessEventCollaborationPort`：

1. `Configured` 必须先验证十个 named route ref 与十个 Step 8 event schema/source arm 一一对应；无 wildcard、无 per-family hidden default；
2. route 只选择 physical transport binding，不能进入 event envelope、logical routing key、capture uniqueness、candidate digest、local state 或 external outcome；
3. `DeterministicFake` 仍执行十臂 schema/source classifier、完整 envelope bytes、stable intent 和五类 typed collaboration outcome；
4. `Disabled` 不代表 outbound capture 被禁用。source-owning application flow 仍必须在 local UoW capture official snapshot/capture；只有 post-commit collaboration call 返回 `NotConfigured`；
5. route 构造失败阻断 startup，已运行后的 transport timeout 不回滚已提交 source/capture，也不由 worker 创建第二个 delivery state。

## 81. Stage 5：application service/facade graph 的构造顺序

### 81.1 Stage 5 的 owner 与输入边界

Stage 5 由 `infra/runtime_builder.rs` 负责调用 application-owned constructors，但所有 service trait、业务 orchestration、domain factory 和错误映射仍归 `application`。builder 只负责依赖注入和完整性验证，不在此阶段 dispatch Command、Query、Inbound、Outbound 或 Job，也不创建业务对象、reservation、capture、journal 或 audit handoff。

Stage 5 的 constructor 输入只能来自以下集合：

| 输入 | 来源 | 允许用途 | 禁止用途 |
|---|---|---|---|
| 27 个 local/base Port handles | Stage 3 | repository/UoW/read gate 注入 | entry 直接持有 concrete adapter |
| 9 个 external Port handles | Stage 4 | resolver/handoff/collaboration 注入 | 将外部正文或 transport handle传入 domain |
| `ClockPort` / `IdGeneratorPort` | Stage 2/3 | domain/application factory 与 protocol side effect | entry 或 adapter 自建时钟/id |
| fixed codec/digest binding `K` | Stage 2 | application canonical codec/digest helper注入 | dynamic algorithm selector、第二套 JSON codec |
| bounded technical wrappers | Stage 2 | timeout、eligible retry、commit observation、internal scan boundary | 通过 raw error text 改写业务结果 |
| validated entry technical values | Stage 0 | API/Worker/Jobs facade 的 entry-neutral boundary | application 读取 raw config/ref |

builder 不得把 `CapabilityRuntimeConfig`、`CapabilityConfigName`、`CapabilityStoreConfigRef`、`CapabilityAdapterConfigRef`、endpoint、credential、fixture ref、scheduler client 或 physical feed handle作为 application service constructor 参数。

### 81.2 Application graph 的严格构造阶段

Stage 5 内部仍采用固定顺序。这里的编号是 builder-local construction order，不是业务状态机，也不写入持久化或公共协议。

| 子阶段 | application graph owner | 必须构造的既有 trait group | 必需依赖 | blocking predicate |
|---:|---|---|---|---|
| 5.1 | `application::shared` | `CapabilityOperationContext` factories、canonical field-byte/digest helpers、shared write/query guards | `K`、clock/id、technical policy | canonical frame/domain、metadata/idempotency guard 和 no-write guard 均可被后续 service 调用；不得暴露 generic serializer |
| 5.2 | `application::command_service` | `CapabilityIdentityCommandService`、`CapabilityRegistryCommandService`、`CapabilityDescriptorCommandService`、`CapabilityRelationCommandService`、`CapabilityExposureCommandService`、`CapabilityTraceImpactCommandService`、`CapabilityReferenceCommandService` | 27 local/base Port、相关 9 external Port、domain factories、shared helpers | 26 Command handler callable 有 owner；每个 service 的所有 required Port 均非空且 trait-object 可调用 |
| 5.3 | `application::query_service` | `CapabilityIdentityQueryService`、`CapabilityRegistryQueryService`、`CapabilityDescriptorQueryService`、`CapabilityRelationQueryService`、`CapabilityExposureQueryService`、`CapabilityTraceImpactQueryService`、`CapabilityDerivedMaterialQueryService`、`CapabilityReferenceQueryService` | read-visibility resolver first、相应 read repositories、clock/context validator（不启 UoW） | 33 Query callable 有 owner；每个 Query constructor 不接写 Port、idempotency、external resolver 或 handoff |
| 5.4 | `application::consumer_service` | `CapabilityInboundConsumerService` | idempotency/typed receipt、reference/state repositories、matching resolver、必要 impact repository、UoW、clock/id、six source mapping | 6 Inbound callable 可形成完整 receipt；重复、unsupported、quarantine 和 retry 分支均可回指既有 typed surface |
| 5.5 | `application::outbound_capture_service` | `CapabilityEventCandidateMapper`、`CapabilityOutboundEventCaptureService` | 10 个 pure mapper、event capture repository、codec/digest、id generator、UoW | 10 个 capture callable 各自 source/schema/capture 对称；不得调用 external collaboration 或重载 current truth |
| 5.6 | `application::event_collaboration_service` | `CapabilityEventCollaborationService` | event capture repository、`CapabilityAccessEventCollaborationPort`、clock、UoW、technical wrappers | exact capture-ref load -> stored candidate -> one collaborate/get -> source check -> short bind 顺序可调用；不得让 Worker 接触 repository/Port |
| 5.7 | `application::job_service` / maintenance services | `CapabilityOperationsJobService`、既有 derived/reference/reconciliation maintenance implementations | truth snapshot、read repositories、material/report/reference stores、Job journal、typed result store、UoW、clock/id、matching resolver、必要 external Port | 8 Job service callable 完整；planning/target/final UoW、frozen journal、typed report replay和serial target规则可调用 |
| 5.8 | graph audit | 上述全部 facade trait objects的 closed assembly result | 5.1~5.7 outputs | selected entry 所需 graph完整；无 service 持有 raw config、concrete adapter、entry loop或未绑定 Port |

### 81.3 Service graph 的 exact ownership map

以下表复用 Step 7/8 已存在的 trait 名称；“facade”表示已有 application service trait 的实现，不新增泛化 `ApplicationFacade` trait，也不把所有 callable 合并成字符串 dispatcher。

| application facade group | exact existing service traits | Command/Query/consumer/Job coverage | 禁止合并或越界 |
|---|---|---|---|
| command | `CapabilityIdentityCommandService`; `CapabilityRegistryCommandService`; `CapabilityDescriptorCommandService`; `CapabilityRelationCommandService`; `CapabilityExposureCommandService`; `CapabilityTraceImpactCommandService`; `CapabilityReferenceCommandService` | 26 / 26 Command methods | 不接 HTTP、Worker envelope、Job scheduler；不新增 `ApplicationFacade` |
| query | `CapabilityIdentityQueryService`; `CapabilityRegistryQueryService`; `CapabilityDescriptorQueryService`; `CapabilityRelationQueryService`; `CapabilityExposureQueryService`; `CapabilityTraceImpactQueryService`; `CapabilityDerivedMaterialQueryService`; `CapabilityReferenceQueryService` | 33 / 33 Query methods | 不注入 UoW、idempotency、stored result、external resolver、handoff或collaboration |
| inbound | `CapabilityInboundConsumerService` | 6 / 6 consumer methods | 不直接保存 source offset、transport ack、delivery state或第三方 truth |
| outbound capture | `CapabilityOutboundEventCaptureService` plus existing `CapabilityEventCandidateMapper` | 10 / 10 event capture methods | 不负责 post-commit transport call；不新增 local outbox/relay |
| collaboration | `CapabilityEventCollaborationService` | 1 exact shared capture-ref continuation | 不改变 source truth；不被 Job Captured target 调用以避免拆分 target UoW |
| operations jobs | `CapabilityOperationsJobService` | 8 / 8 Job methods | 不拥有 scheduler、lease、attempt store、target parallelism或report-by-run recovery |

### 81.4 Application graph constructor contract

实现时应按以下 call order 写 builder；尖括号只是既有 trait implementation 的具体 constructor 名称占位，不允许落成未定义的 generic helper：

```text
[application::shared::build_operation_context_support(K, clock, id, technical_policy)]
  -> shared canonical field-byte / digest / metadata / no-write support

[application::command_service::build_command_services(
    uow, clock, id, all local repositories, required external Ports,
    read_visibility, K, technical wrappers)]
  -> seven existing Command service trait objects

[application::query_service::build_query_services(
    read_visibility, read repositories, K, query limits)]
  -> eight existing Query service trait objects

[application::consumer_service::build_inbound_consumer_service(
    uow, clock, id, idempotency, typed receipt/result, reference/state repositories,
    matching resolvers, required local repositories, K, inbound timeout)]
  -> one existing CapabilityInboundConsumerService trait object

[application::outbound_capture_service::build_outbound_capture_service(
    uow marker, clock, id, K, capture repository, ten existing mappers)]
  -> one existing CapabilityOutboundEventCaptureService trait object

[application::event_collaboration_service::build_event_collaboration_service(
    uow manager, clock, capture repository, collaboration Port, K,
    external timeout/retry wrapper)]
  -> one existing CapabilityEventCollaborationService trait object

[application::job_service::build_operations_job_service(
    uow, clock, id, truth/read/material/reference/report repositories,
    idempotency, typed Job result, Job journal, required resolver/handoff/collaboration Ports,
    K, internal scan page, job policy)]
  -> one existing CapabilityOperationsJobService trait object

[runtime_builder::audit_application_graph(all returned trait objects)]
  -> complete selected-entry service graph
```

上述 notation 只描述已有 trait 的依赖注入顺序，不创建名为 `build_command_services` 等公共 API。目标实现应在 application 内使用已有本地 constructor 组织方式；若需要新增 crate-private constructor，必须在实现设计中逐 callable 提供英文 `///`，并证明它不新增 Port/trait。

### 81.5 Stage 5 failure mapping

| failure | detection phase | result | forbidden fallback |
|---|---|---|---|
| required Port handle absent | constructor input validation | `InfraError::RuntimeAssembly` | `Option` service、no-op service、延迟 lookup |
| service trait implementation无法建立完整依赖 | application constructor | `InfraError::RuntimeAssembly` | 返回可调用 partial facade |
| Query service accidentally receives write authority | graph audit | `InfraError::RuntimeAssembly` / design gate | runtime flag控制 no-write、在 Query 内部开 UoW |
| capture service缺少某个 exact mapper | outbound service audit | `InfraError::RuntimeAssembly` | generic event mapper、current truth重建 |
| Job service缺少 journal/result/typed report Port | Job graph audit | `InfraError::RuntimeAssembly` | report-by-run重建、跳过journal、generic bytes |
| external Port是 Disabled | Stage 4已构造完整 Port | graph继续；调用时既有 `NotConfigured` | fake success、删除 service invariant |
| technical policy wrapper无法证明 boundedness | Stage 2/5 wrapper gate | `InfraError::RuntimeAssembly` | unbounded loop、业务层自行sleep/retry |

Stage 5 成功后，application graph 可以被 selected entry 使用，但仍不能被 host 启动。必须继续 Stage 6 检查 entry variant、source handle、route binding、typed parameter和跨 crate handoff是否完整。

## 82. Stage 6：entry-specific typed parameters 与 neutral source inputs

### 82.1 Stage 6 的选择规则

Stage 6 从 `CapabilityRuntimeConfig::entry()` 选择且只选择一个 entry branch。选择结果必须与 `CapabilityEntryParameters` variant 完全相等：

| selected entry | required parameter source | required application graph | additional neutral input |
|---|---|---|---|
| `Api` | `CapabilityApiEntryParameters` | 26 Command + 33 Query handler facade | none；API不消费物理 source |
| `Worker` | `CapabilityWorkerEntryBinding.parameters()` | 6 Inbound + collaboration facade + required maintenance facade | 六个 named source slot的 resolved feed/actor/fixture handle和closed dispatcher input |
| `Jobs` | `CapabilityJobsEntryParameters` | 8 Operations Job handler facade | none；host scheduler不进入 neutral input |

`CapabilityEntryParameters::as_api/as_worker/as_jobs` 只能在 variant match 后使用；`None` 是配置/assembly mismatch，不得 fallback 到另一个 entry。infra-local `CapabilityWorkerEntryBinding` 在本阶段被消费，feed/actor/fixture config refs随后丢弃。

### 82.2 API branch

API branch只形成 handler-facing typed input：`request_body_limit`、`public_page_limit`、`call_timeout`和已装配的 Command/Query service trait objects。它不接收 repository cursor内部格式、UoW、external Port、raw config或运行时 execution client。

API branch 的 blocking gate：

1. 26 个 Command method 与 33 个 Query method 均有对应 handler owner；
2. handler facade只能调用对应 application service，不持有 concrete adapter；
3. Query handler 的 page limit、visibility和no-write约束已绑定；
4. call timeout只包住一次 API invocation，不改变 stored replay、typed rejection或application error；
5. route/RPC mapping不改变 closed operation name、schema或 DTO type。

如果任一条件不满足，返回 `InfraError::RuntimeAssembly`，不启动 API listener，不生成 API response。

### 82.3 Worker branch：六个 named source 的 neutral resolution

Worker branch 对六个 source slot逐一执行相同但非泛化的 closed mapping。每个 slot都必须把以下信息固定在 assembly input中：

| 信息 | 由谁固定 | Worker 可做什么 | Worker 不可做什么 |
|---|---|---|---|
| consumer name | Step 8 closed protocol | 选择 exact handler arm | 从 topic/group/字符串动态注册 |
| source family | Step 8/14 source binding | header-first family gate | 从 payload/body反推 |
| schema version | Step 8 v1 | header gate和typed decode选择 | 配置开启第二版本 |
| feed handle | infra resolved source | 拉取bounded encoded envelope | 把 endpoint/credential暴露给application |
| trusted actor matcher | infra resolved authority | actor gate | 用topic/name/credential替代 |
| application facade | Stage 5 | 调 exact consumer/collaboration method | 直连 repository/Port/UoW |

Worker neutral resolution pseudo-flow：

```text
for each of the six compile-time named source slots in fixed order:
  [infra::resolve_feed_handle(slot binding)]
  [infra::resolve_trusted_actor_matcher(slot binding)]
  [worker-owned closed runner factory(slot identity, feed, actor, parameters, facades)]
  [worker-owned header-first dispatcher validation]
  retain resolved runner input only if all checks succeed

if slot is Disabled:
  retain an explicit disabled decision; create no feed, actor matcher, runner, task, receipt or ack
```

这里的 `[worker-owned closed runner factory]` 是 cycle-free handoff point，不表示 infra import worker。它的 exact cross-crate carrier、accessor和 factory signature留 `14.5.2.2`；本批只要求 infra 在 handoff 前完成所有 feed/actor resolution，并且任何 enabled slot failure 都阻断整个 Worker graph。

Worker branch 的 blocking gate：

1. 六个 slot全部存在且每个 slot的 configured/fake/disabled variant已通过 profile validation；
2. enabled slot 的 feed、trusted actor或fixture能够构造同一 header-first boundary；
3. closed consumer/source/schema/handler/application method 映射 6/6；
4. disabled slot没有生成成功 receipt、ack、offset或空 runner；
5. worker entry不接收 config refs、repository、UoW、publisher、resolver或application Port direct handle。

### 82.4 Jobs branch

Jobs branch 只形成八个 typed one-shot runner的输入：`request_body_limit`、`planning_page_limit`、`run_timeout`、approved `runner_retry`以及 `CapabilityOperationsJobHandlers` facade。`planning_page_limit`只由 application Job service用于bounded planning scan；runner自身不读 repository、不重规划、不并发同一 journal target。

Jobs branch 的 blocking gate：

1. `CapabilityOperationsJobHandlers` 的 8 个 method 与 `CapabilityOperationsJobService` 8 个 method 一一对应；
2. 每个 runner的 job name/schema/body type closed mapping完整；
3. `run_timeout`覆盖 bounded decode、dispatch、application call和delivery mapping，但不把 timeout转换为 target terminal state；
4. runner retry只允许“尚未形成 typed response且 durable recovery已证明同一 invocation 可安全重入”的技术情况；typed `Retryable`和普通 `ApplicationError`不得由 runner自行重试；
5. scheduler、cron、queue、lease、ack不进入 Job request、journal或application facade。

不满足时返回 `InfraError::RuntimeAssembly`，不产生 Job report、run evidence或伪造 exit success。

### 82.5 Stage 6 failure matrix

| branch | blocking failure | startup result | allowed runtime absence |
|---|---|---|---|
| API | wrong entry variant、handler缺失、Command/Query mapping缺口 | `InfraError::RuntimeAssembly` | 无；API graph必须完整 |
| Worker enabled source | feed/actor/fixture missing、wrong family、runner constructor failure | `InfraError::RuntimeAssembly`；不返回其他已构造 slot | 不适用 |
| Worker Disabled source | explicit Disabled且无dangling child ref | 作为完整 neutral input继续 | 该 slot不启动runner/task |
| Jobs | handler/service缺失、job variant mismatch、runner primitive无效 | `InfraError::RuntimeAssembly` | 无；八个 closed handler graph必须完整 |
| selected entry与parameters不匹配 | `as_*`返回None或variant mismatch | `InfraError::RuntimeAssembly` | 不允许跨entry fallback |

## 83. Stage 7：complete handoff 与 entry-owned composition boundary

### 83.1 Handoff 完成条件

Stage 7 不再构造业务 Port或application service；它只把 selected entry 所需的 complete neutral material 转移给对应 composition root。handoff 成功必须证明：

| gate | 证明内容 | failure |
|---|---|---|
| root identity | selected entry与typed parameter variant相等 | `InfraError::RuntimeAssembly` |
| application graph | selected entry所有 required facade均已构造且可调用 | `InfraError::RuntimeAssembly` |
| local authority | 所有 local transaction-capable adapter共享 `A` | `InfraError::RuntimeAssembly` |
| external graph | 9/9 external Port为 concrete Configured/Fake/Disabled binding | `InfraError::RuntimeAssembly` |
| Worker source graph | selected Worker的六个 named source均已解析或显式 Disabled | `InfraError::RuntimeAssembly` |
| neutral visibility | handoff不含raw config/ref、secret、endpoint、repository、UoW、publisher或generic map | `InfraError::RuntimeAssembly` / design gate |
| entry graph | 下一 composition root可在不访问 infra-private config的情况下构造自己的loop/route/runner | `InfraError::RuntimeAssembly` |

任何 gate 失败都必须在 entry root 调用 host start、API listener bind、Worker task spawn或Jobs one-shot receive之前返回 `InfraError::RuntimeAssembly`。不允许把 handoff failure包成 `ApiError`、`WorkerError` receipt、`JobError` report或业务 retry。

### 83.2 三个 composition root 的责任切分

| root | 接收 Stage 7 的内容 | root 自己构造 | root 明确不得接收/构造 |
|---|---|---|---|
| API composition root | complete Command/Query facade、`CapabilityApiEntryParameters`、API-neutral error/context support | route/RPC mapping、request byte gate、typed DTO decode、handler wiring、listener lifecycle | repository、UoW、resolver、external client、Worker/Jobs loop |
| Worker composition root | complete inbound/continuation facade、`CapabilityWorkerEntryParameters`、六个 resolved source inputs/disabled decisions | header-first dispatcher、six closed handler arms、source loop、processing-action mapping、task lifecycle | raw config/ref、repository、UoW、publisher Port、generic protocol registry、Jobs scheduler |
| Jobs composition root | complete `CapabilityOperationsJobHandlers`、`CapabilityJobsEntryParameters` | eight typed runner arms、header/body gate、delivery/exit mapping、one-shot lifecycle | journal repository、scope planner、scheduler truth、API/Worker crate、target retry logic |

Stage 7 不返回“全部三个 root”的混合 graph。一个 validated root只选择一个 `CapabilityRuntimeEntryKind`，因此 handoff必须是 entry-specific；未选择的 entry不会获得 `Option` facade或隐式 fallback。具体 cross-crate carrier和factory callable由 `14.5.2.2` 定义。

### 83.3 Handoff 伪代码与所有权转移

```text
validated root
  -> Stage 1 A
  -> Stage 2 technical primitives
  -> Stage 3 local/base Port graph
  -> Stage 4 external Port graph
  -> Stage 5 selected application facade graph
  -> Stage 6 selected entry parameters + neutral source inputs
  -> [handoff_complete_graph(selected entry, complete neutral material)]
       -> API root OR Worker root OR Jobs root
       -> entry-specific graph validation
       -> only then host start / listener bind / task spawn / one-shot receive
```

Ownership rule:

1. `infra` retains ownership of concrete adapter objects and any process-local builder state that remains behind application trait objects；entry只接收已约定的 abstraction/neutral handle。
2. config refs、raw parser data、secret/endpoint material在 Stage 6 转换后被丢弃，不跨越 handoff。
3. entry root 不得从 `Arc<dyn Service>` 反向 downcast 到 concrete service、repository或adapter；若需要此类 downcast，handoff gate失败。
4. handoff failure 时，未转移的 local objects由 infra cleanup；已转移的 immutable neutral values被丢弃；不得向 host返回 partial graph。
5. host start之后的调用失败不再是 runtime assembly failure，按 Step 12既有 API/Worker/Jobs wrapper和application typed error映射；只有重新构建/重启时的构造失败仍回到 `InfraError::RuntimeAssembly`。

### 83.4 Stage 7 与 cycle-free dependency proof

```text
infra  --depends on--> application + contracts + domain + core-contracts
api    --depends on--> application + contracts + infra
worker --depends on--> application + contracts + infra + core-contracts
jobs   --depends on--> application + contracts + infra

infra -X-> worker/api/jobs
api -X-> worker/jobs
worker -X-> api/jobs
jobs -X-> api/worker
```

Worker factory由 Worker root拥有；infra只提供 Stage 6 的 resolved neutral source material。若需要 callback/generic handoff，callback的定义/实现边界必须由 Worker 或 shared contracts-owned neutral carrier拥有，不能让 infra 的 Cargo manifest命名 `capability-hub-worker`。该 proof与 `14.5.1` member matrix一致；任何实现偏差都必须回开本批，不得用 optional dependency或feature flag绕过。

## 84. Stage 0~7 blocking failure matrix 与 partial-graph审计

### 84.1 全阶段 failure matrix

| Stage | blocking predicate | failure owner | startup surface | 是否允许保留完整结果 |
|---:|---|---|---|---:|
| 0 | root schema/profile/entry/ref/cardinality/compatibility/forbidden-surface gate通过 | `infra/config.rs` | `InfraError::RuntimeAssembly` | 否；不创建 adapter |
| 1 | one `A`具备 atomicity、CAS/unique、stable cursor、commit resolution、linearizable read | local authority builder | `InfraError::RuntimeAssembly` | 否；不暴露 A |
| 2 | UoW/codec/digest/clock/id/wrapper均与A和fixed profile一致 | technical primitive builder | `InfraError::RuntimeAssembly` | 否 |
| 3 | 27 local/base slot完整且同A | local adapter builder | `InfraError::RuntimeAssembly` | 否 |
| 4 | 9 external slot exact family/branch constructor成功 | external adapter builder | `InfraError::RuntimeAssembly` | 否；运行期 unavailable不在此列 |
| 5 | selected application service/facade graph完整 | application graph builder | `InfraError::RuntimeAssembly` | 否 |
| 6 | selected entry parameters/source handles/closed mapping完整 | entry-neutral resolver | `InfraError::RuntimeAssembly` | 仅显式 Disabled slot可保留为完整输入 |
| 7 | handoff内容无raw/private material且entry root可独立composition | handoff validator / selected root | `InfraError::RuntimeAssembly` | 否；host尚未启动 |

### 84.2 `Configured`、`DeterministicFake`、`Disabled`、`Missing` 四分法

| 状态 | 含义 | 是否完整 binding | startup行为 | invocation行为 |
|---|---|---:|---|---|
| `Configured` | exact external/local binding已验证并构造 concrete adapter | 是 | constructor failure阻断 | concrete typed call；失败按既有 Port/error/outcome |
| `DeterministicFake` | 显式 local/integration fixture，保持 configured semantic parity | 是 | profile/fixture/construction failure阻断 | same typed call/failure/bytes/source gate；不是真实 evidence |
| `Disabled` | explicit unavailable external slot，Port仍存在 | 是 | no child ref；完整 graph继续 | exact `NotConfigured`；不伪造成功 |
| `Missing` | required slot/section/ref不存在，或configured/fake尚未构造 | 否 | `InfraError::RuntimeAssembly` | 不可到达；不得以 Disabled或Fake替代 |

### 84.3 Failure surface separation

| 发生时机 | 允许的错误 surface | 禁止的错误 surface |
|---|---|---|
| startup config/adapter/facade/handoff assembly | `InfraError::RuntimeAssembly` with safe internal source category | API response、Inbound receipt、Job report、business retry、fake success |
| application调用显式 Disabled external Port | existing `ApplicationError::PortFailure(NotConfigured)` | startup error、generic string、empty typed success |
| configured/fake Port运行期 temporary/timeout | existing typed `PortFailure`，application按Step 12/13决定bounded retry | transport status/text分类、local delivery lifecycle |
| typed external outcome `Failed/HandoffUnavailable/PendingDelivery` | successful typed outcome，由external owner保持语义 | 降格为application failure、回滚local truth、复制delivery state |
| local repository/UoW failure after startup | existing application/transaction error mapping | 重新包装成config error、静默切fake、重复mutation |
| commit resolution Unknown | existing `CommitOutcomeUnknown`及Step 13 same-authority resolution procedure | row absence=rollback、sleep、replica guess、blind retry |

## 85. Runtime builder exact pseudocode、cross-step closure 与本批 self-check

### 85.1 Exact pseudocode（无新增 public declaration）

下列伪代码只使用本 Step 已确认的 callable/trait 名称；`build_*` 表示 infra/application crate-private constructor contract，不声称目标实现仓已有对应文件。每个实际新增 struct、field、enum、variant、variant payload或callable必须补英文 `///`，本批没有用伪代码逃避该门禁。

```rust
// [CapabilityRuntimeConfig::try_from_candidate(CapabilityRuntimeConfigCandidate)]
let config: CapabilityRuntimeConfig = validate_root(candidate)?;

// [build_local_persistence_authority(&CapabilityLocalPersistenceBinding, CapabilityRuntimeProfileKind, Option<&DeterministicFixtureState>)]
let authority = build_local_persistence_authority(
    config.local_persistence(),
    config.profile(),
    fixture_state,
)?;

// [build_unit_of_work_manager(&CapabilityLocalPersistenceAuthority, &CapabilityRuntimeTechnicalPolicy)]
let uow_manager = build_unit_of_work_manager(authority.clone(), config.technical_policy())?;

// [build_codec_digest_binding(&CapabilityCompatibilityBinding)]
let codec_digest = build_codec_digest_binding(config.compatibility())?;

// [build_clock(&CapabilityClockBinding, Option<&DeterministicFixtureState>)]
let clock = build_clock(config.clock(), fixture_state)?;

// [build_id_generator(&CapabilityIdGeneratorBinding, Option<&DeterministicFixtureState>)]
let id_generator = build_id_generator(config.id_generator(), fixture_state)?;

// [build_technical_invocation_wrappers(&CapabilityRuntimeTechnicalPolicy)]
let technical = build_technical_invocation_wrappers(config.technical_policy())?;

// [build_27_local_base_ports(authority, uow_manager, codec_digest, clock, id_generator, technical)]
let local_base = build_27_local_base_ports(
    authority.clone(),
    uow_manager.clone(),
    codec_digest.clone(),
    clock.clone(),
    id_generator.clone(),
    technical.clone(),
)?;

// [build_9_external_ports(config.external_ports(), codec_digest, technical)]
let external = build_9_external_ports(
    config.external_ports(),
    codec_digest.clone(),
    technical.clone(),
)?;

// [build_application_service_graph(local_base, external, clock, id_generator, codec_digest, technical)]
let services = build_application_service_graph(
    local_base,
    external,
    clock.clone(),
    id_generator.clone(),
    codec_digest.clone(),
    technical.clone(),
    config.technical_policy(),
)?;

// [resolve_selected_entry_neutral_inputs(config.entry(), config.entry_parameters(), services, technical)]
let neutral = resolve_selected_entry_neutral_inputs(
    config.entry(),
    config.entry_parameters(),
    services,
    technical,
)?;

// [handoff_complete_graph(config.entry(), neutral)]
let entry_handoff = handoff_complete_graph(config.entry(), neutral)?;

// Host start is outside infra builder and occurs only after the selected entry root validates this handoff.
return Ok(entry_handoff);
```

`validate_root`、`build_27_local_base_ports`、`build_9_external_ports`、`build_application_service_graph`、`resolve_selected_entry_neutral_inputs`和`handoff_complete_graph`是本批的 stage contract labels，不是允许实现者新增的 generic public API。落码时应拆成现有文件职责内的具体 crate-private callables，并在 `14.5.2.2` 给出跨 crate carrier与 factory exact signature。

### 85.2 Cross-step closure audit

| 审计面 | 预期 | 本批结果 |
|---|---:|---|
| Stage count | 8 stages, `0..7` | pass；顺序、输入、输出和阻断条件均已定义 |
| local/base Port slots | 27 / 27 | pass；§79 编号 1~27，22 repository + 5 base/read-gate |
| external Port slots | 9 / 9 | pass；§80 exact family/branch mapping |
| external callable coverage | 14 / 14 | pass；5 resolver + 2 consumer + 2 handoff + 1 observability + 4 collaboration |
| application service callable coverage | 26 Command + 33 Query + 6 Inbound + 10 Outbound capture + 1 collaboration + 8 Job | pass；全部回指 Step 8 existing traits |
| local authority count | 1 | pass；全部 transaction-capable adapter共享 `A` |
| Cargo sibling edges | 1 allowed sibling candidate, 0 runtime/event/downstream edges | pass；`core-contracts` only |
| `infra -> worker` edge | 0 | pass；Worker root拥有factory，infra只交付neutral input |
| entry graph completeness | selected entry only | pass；不返回三入口混合或partial graph |
| business state / protocol additions | 0 | pass；builder stage不是业务状态，未增 DTO/Port/flow |
| forbidden scope additions | 0 | pass；无runtime execution/tools execution/marketplace/governance approval/method body/SDK client/local delivery lifecycle |

### 85.3 Rustdoc / structure-comment audit

本批伪代码未新增实际 Rust declaration，因此新增 struct、field、enum、variant、variant payload和callable计数为 `0`。本批引用的已有 declarations已回指 Step 7/8/14 前序章节；实施阶段若将任一 stage label具体化为 Rust declaration，必须逐项提供英文 `///`：

- struct 本身及每个 field；
- enum 本身、每个 variant、每个 variant payload field；
- 每个 constructor、accessor、factory、runner和handoff callable；
- 跨 crate neutral carrier不能用未注释 tuple、generic map、`Option<dyn Any>`或宏隐藏字段。

`CapabilityJobsRuntime`、`CapabilityJobsDelivery`和既有 entry-local declarations已在前文提供完整注释；本批没有重复声明或改写它们。

### 85.4 Historical material、blocker 与债务结果

| 项目 | 结果 |
|---|---|
| 旧正式 `03` provider/runtime/gateway/config 主线 | `historical_material`；不进入 builder source |
| README 的 runtime/tools 必经 hub、provider route/quota/cost、marketplace listing | `historical_material`；Stage 0~7均不拥有这些 truth |
| `infra -> worker` 旧 factory wording | 已由 entry-owned factory + neutral handoff 替换；若实现仍形成反向 edge，属于本批 blocking design violation |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non-blocking；exact `as_str().as_bytes()`授权假设保持，语义变化回 Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non-blocking；stable shared shape变化回 Step 8/13/14 |
| target implementation repo | 仍不存在；本批不创建、不伪造 Cargo 或构造结果 |
| unresolved upstream blocker | `0` |

### 85.5 Batch `14.5.2.1` completion gate and stop review

| gate | 结果 | 依据 |
|---|---|---|
| immutable root -> neutral handoff numbered order | pass | §§78、79~83、85.1 |
| single persistence authority formation and proof | pass | Stage 1/2、§79.1~79.3；`A`唯一且不暴露 |
| 27 local/base adapter exact binding | pass | §79.2；27/27，method surface unchanged |
| 9 external Port exact binding | pass | §80；9/9，14/14 callable，three-way binding complete |
| application facade graph order | pass | §81；复用既有 service traits，不新增泛化 `ApplicationFacade` |
| API/Worker/Jobs entry-neutral selection | pass | §82；entry variant exact，Worker six slots closed，Jobs eight handlers closed |
| entry-owned composition and cycle proof | pass | §83；`infra -> worker`=0，host start after handoff only |
| partial graph / missing / Disabled separation | pass | §84；四分法和 stage failure matrix complete |
| startup vs runtime error surface | pass | §84.3；不伪造 protocol/receipt/report |
| config details deferred to `04` | pass | 未写 raw key/env/endpoint/credential/具体数值 |
| structure comment gate | pass | 本批无新增声明；后续落码门禁已逐项声明 |
| scope boundary | pass | 未进入 `14.5.2.2`、`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15或正式 `03` |
| implementation/evidence discipline | pass | 未创建目标实现仓、Cargo、implementation ledger、boundary skeleton；未声称测试/run/evidence/sign-off/commit |
| unresolved upstream blocker | pass | `0` |

### 85.6 Formal `03` §13 assembly source（本批增量）

以下内容只供 Step 19 回填，不修改正式 `03`：

```markdown
### 13.11 Runtime builder exact stage order and composition handoff

`infra::runtime_builder` 按 `validate_root -> build_authority -> bind_technical_primitives -> bind_local_base_ports -> bind_external_ports -> build_application_facades -> resolve_entry_neutral_inputs -> handoff_complete_graph` 的八阶段顺序运行。Stage 0~7 任一阻断失败均在 host start、request receive 或 task spawn 前形成 `InfraError::RuntimeAssembly`，不返回 partial graph。

所有 transaction-capable local adapter、22 个 repository trait、UoW manager、read visibility resolver和capture/journal store共享一个 local persistence authority `A`；27 个 local/base Port及9个 external Port必须先完成，再构造既有 Command、Query、Inbound Consumer、Outbound Capture、Event Collaboration和Operations Job service graph。builder不创建业务写入、不重跑flow、不拥有entry loop。

API、Worker、Jobs分别拥有composition root。API接收typed Command/Query facade；Worker接收六个closed named source的resolved neutral input并自行构造header-first dispatcher与loop；Jobs接收八个typed Operations Job facade并自行构造one-shot runner。`infra`不得依赖`worker`、`api`或`jobs`，entry不得持有repository、UoW、resolver、publisher或raw config。

`Configured`、`DeterministicFake`和`Disabled`都是完整binding；`Missing`、wrong-family、profile mismatch、constructor failure和required facade omission是startup blocking failure。显式`Disabled`只使对应external Port在调用时返回既有`NotConfigured`，不伪造success、receipt、report、event intent或delivery state。运行期temporary/timeout、typed external outcome和local persistence failure继续使用Step 12/13既有error/outcome语义。
```

Batch `14.5.2.1` 至此完成并停审。下一步只有在用户确认后进入 `14.5.2.2`，补齐 API/Worker/Jobs 的 exact cross-crate neutral carrier、entry-owned factory/accessor、composition callable和结构注释审计；不得自动进入 `14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03` assembly或任何实现产物。

## 86. Batch `14.5.2.2.1` API composition 开工确认、问题诊断与边界裁决

### 86.1 本批授权与读取门禁

用户已确认进入 `14.5.2.2`。本子批只推进 API composition 的第一个闭合单元：API-neutral carrier、7 个 Command service trait object、8 个 Query service trait object、API-owned handler facade 的输入边界和 API factory 的构造前置条件。本子批不进入 Worker、Jobs、`14.5.2.2.2`、`14.5.2.2.3`、`14.5.2.3` 或正式 `03`。

| 读取材料 | 本批承接的 exact 事实 | 本批不重新定义 |
|---|---|---|
| Step 5 module contract | `api` 只负责同步 Command / Query handler 与 route assembly；application 承接 service；infra 承接 adapter / builder | 不把 API 变成 domain/application owner，不新增业务模块 |
| Step 7 trait / Port contract | 7 个 Command service trait、8 个 Query service trait 已闭合；API 不持有 repository、UoW、resolver、clock/id 或 external Port | 不新增 service trait、Port、repository 或泛化 `ApplicationFacade` |
| Step 8 protocol contract | `CapabilityCommandHandlers` 有 26 个 exact method，`CapabilityQueryHandlers` 有 33 个 exact method；request、context、response类型已固定 | 不新增 route alias、generic execute、第二套 DTO 或 transport-specific protocol |
| Step 12 error contract | API source mapping与application error wrapper分离；startup assembly failure使用 `InfraError::RuntimeAssembly`，不能伪造 API response | 不新增 HTTP status taxonomy、业务 error variant 或 response envelope |
| Step 14 §§78~85 | Stage 5 已有完整 application graph，Stage 6 API branch只需要 typed params + service objects；`infra` 不依赖 `api` | 不让 infra 构造或持有 `CapabilityCommandHandlers` / `CapabilityQueryHandlers` |

本批的判断顺序固定为：

```text
application-owned service trait objects
  -> infra-owned API-neutral handoff
  -> api-owned Command handler facade
  -> api-owned Query handler facade
  -> api-owned route / listener composition
```

`CapabilityCommandHandlers` 与 `CapabilityQueryHandlers` 的 trait owner 仍是 `api`。它们不能出现在 `infra/runtime_builder.rs` 的构造输入或返回字段中；infra 只交付其实现所需的 application service trait objects。这样既保持 `infra -> application` 单向依赖，也避免 API handler 被误当成 application service。

### 86.2 SOP 八问与当前旧措辞诊断

| SOP问题 | 本子批裁决 |
|---|---|
| 哪个模块读取 API 配置？ | 仍只有 `infra/config.rs` 读取 raw source 并形成 `CapabilityApiEntryParameters`；API 只读取其三个 typed accessor，不读取 root、section ref、endpoint、credential或环境变量。 |
| API carrier 应该交付什么？ | 一个完整的 API-specific handoff：validated `CapabilityApiEntryParameters` + 7 个 Command service trait object + 8 个 Query service trait object。所有字段必填，不使用 `Option`、`Vec`、map、tuple或 `dyn Any` 表示服务缺失。 |
| 谁构造 `CapabilityCommandHandlers` / `CapabilityQueryHandlers`？ | `api` crate 的 composition root。infra 不依赖 API，也不构造 API trait facade。 |
| API handler 持有什么？ | 只持有对应 application service trait object、typed API parameters和静态 closed operation mapping；不持有 repository、UoW、resolver、clock/id、external Port、raw config或config ref。 |
| API 如何构造 `CapabilityOperationContext`？ | route/body/schema对称性通过后，使用既有 `CapabilityOperationName`、`CapabilityOperationIdempotencyKey` 和 `CapabilityOperationContext::from_command` / `from_query`；metadata authority来自 request envelope，body不重复。 |
| API 是否自己重试或降级？ | 不重试、不刷新、不重建、不把 Query technical error改成 degraded surface。call timeout只限制一次入口调用；application typed outcome / error保持原分类。 |
| startup factory 失败如何返回？ | API factory的本地 composition error在 API bootstrap 处单向包入 `InfraError::RuntimeAssembly`；不能转成 `ApiError`、HTTP response、Command rejection或Query body。 |
| 哪些依赖留给下游？ | route framework、listener、HTTP/RPC数字、raw key/env、endpoint、credential和部署参数留 `04` / host；本批只定代码绑定点和调用边界。 |

| 旧措辞 / 风险 | 诊断 | 当前处理 |
|---|---|---|
| `infra` “组装 handler 和 runner” | 会迫使 infra 依赖 `api` / `worker` / `jobs`，形成反向 Cargo edge | 改为 infra 交付 entry-neutral service handoff；每个 entry 自己构造 handler / runner |
| `CapabilityCommandHandlers` 直接作为 infra graph 字段 | 混淆 application facade 与 API handler，且 infra无法合法引用 API trait | 从 infra carrier删除；carrier只列 7 个 application Command service object |
| 一个 `ApplicationFacade` + generic `execute` | 隐藏 26/33 exact coverage，允许运行时字符串路由 | 拒绝；保留 7 + 8 个既有 service trait和两个 API-owned concrete facade |
| `Option<dyn Service>` / generic map | partial graph可以逃逸并在请求时才发现缺依赖 | 拒绝；carrier结构体所有 service 字段均为非 `Option` 的 `Arc<dyn ExactService>` |
| API 接收 repository / UoW / resolver | 入口会绕过 application flow、幂等和 no-write gate | 拒绝；API只接收 service trait object和typed entry parameters |
| API 读取 raw config / config ref | 部署细节泄漏到入口，造成隐式 fallback | 拒绝；Stage 6 已完成 ref resolution，API只消费 typed accessor |

### 86.3 本批新增声明与基线规则

本子批允许新增的声明只有 assembly-local carrier、API-owned handler facade、API runtime和composition-local error。它们不是 HLD business object、public protocol schema、Port、repository或持久化状态，不计入 `43 + 7` business/application object baseline，也不改变 `250` public protocol type、`83` protocol/flow、`36` Port、`22 / 110` repository baseline。

新增声明的 visibility 规则：

| 声明 | 计划 owner | visibility | 生命周期 |
|---|---|---|---|
| `CapabilityApiApplicationServices` | `application::services` | `pub` assembly value；字段 private | Stage 5 构造，API factory完成后由 handoff 持有的 `Arc` 被 facade接管 |
| `CapabilityApiEntryHandoff` | `infra::runtime_builder` | `pub` cross-crate handoff；字段 private | Stage 7 生成，API root消费一次 |
| `CapabilityCommandHandlerFacade` | `api::command_handlers` | `pub(crate)` concrete implementation | API process lifetime |
| `CapabilityQueryHandlerFacade` | `api::query_handlers` | `pub(crate)` concrete implementation | API process lifetime |
| `CapabilityApiRuntime` | `api::composition` / `api::lib` | `pub(crate)` entry runtime | listener启动前构造，listener生命周期持有 |
| `CapabilityApiCompositionError` | `api::composition` | `pub(crate)` startup-local error | 只存在于 factory/bootstrap，不能进入协议或持久化 |

所有新增 struct、field、enum、variant、variant payload、constructor、accessor、factory和mapper都必须有英文 `///`。本批不使用未注释 tuple、generic map、`Option<dyn Any>`或宏生成隐藏字段。

## 87. API-neutral service carrier 的 exact Rust 契约

### 87.1 Application-owned service object bundle

以下声明归 `crates/application/src/services.rs`。它是 application service trait object 的命名集合，不是新的 trait；它不执行调用、不保存 config、不拥有 concrete adapter，也不公开 repository / UoW。

```rust
/// Complete application-owned service trait objects required by the synchronous API entry.
#[derive(Clone)]
pub struct CapabilityApiApplicationServices {
    /// Application service for identity and access-review commands.
    identity_command: std::sync::Arc<dyn CapabilityIdentityCommandService + Send + Sync>,
    /// Application service for registry commands.
    registry_command: std::sync::Arc<dyn CapabilityRegistryCommandService + Send + Sync>,
    /// Application service for descriptor and safe-summary commands.
    descriptor_command: std::sync::Arc<dyn CapabilityDescriptorCommandService + Send + Sync>,
    /// Application service for governance and method-relation commands.
    relation_command: std::sync::Arc<dyn CapabilityRelationCommandService + Send + Sync>,
    /// Application service for formal exposure and visibility commands.
    exposure_command: std::sync::Arc<dyn CapabilityExposureCommandService + Send + Sync>,
    /// Application service for traceability and impact commands.
    trace_impact_command: std::sync::Arc<dyn CapabilityTraceImpactCommandService + Send + Sync>,
    /// Application service for canonical reference commands.
    reference_command: std::sync::Arc<dyn CapabilityReferenceCommandService + Send + Sync>,
    /// Application service for identity and access-review queries.
    identity_query: std::sync::Arc<dyn CapabilityIdentityQueryService + Send + Sync>,
    /// Application service for registry queries.
    registry_query: std::sync::Arc<dyn CapabilityRegistryQueryService + Send + Sync>,
    /// Application service for descriptor and safe-summary queries.
    descriptor_query: std::sync::Arc<dyn CapabilityDescriptorQueryService + Send + Sync>,
    /// Application service for governance and method-relation queries.
    relation_query: std::sync::Arc<dyn CapabilityRelationQueryService + Send + Sync>,
    /// Application service for formal exposure and consumer-view queries.
    exposure_query: std::sync::Arc<dyn CapabilityExposureQueryService + Send + Sync>,
    /// Application service for traceability, impact, and handoff queries.
    trace_impact_query: std::sync::Arc<dyn CapabilityTraceImpactQueryService + Send + Sync>,
    /// Application service for derived-material and reconciliation queries.
    derived_material_query: std::sync::Arc<dyn CapabilityDerivedMaterialQueryService + Send + Sync>,
    /// Application service for canonical reference and external-reference queries.
    reference_query: std::sync::Arc<dyn CapabilityReferenceQueryService + Send + Sync>,
}
```

`CapabilityApiApplicationServices::from_parts(...)` 的 exact parameter顺序必须与上面 15 个字段顺序一致：7 个 Command service先于 8 个 Query service。每个参数类型就是对应字段的完整 `Arc<dyn ExactService + Send + Sync>` 类型；不得把参数压缩成 `Vec`、map或统一 trait。该构造函数只接收 Stage 5 已成功构造的 service object；缺失 service必须在 infra Stage 5 阻断，不通过 `Option`传入。

```rust
impl CapabilityApiApplicationServices {
    /// Creates a complete API service bundle from all seven command services and eight query services.
    pub fn from_parts(
        identity_command: std::sync::Arc<dyn CapabilityIdentityCommandService + Send + Sync>,
        registry_command: std::sync::Arc<dyn CapabilityRegistryCommandService + Send + Sync>,
        descriptor_command: std::sync::Arc<dyn CapabilityDescriptorCommandService + Send + Sync>,
        relation_command: std::sync::Arc<dyn CapabilityRelationCommandService + Send + Sync>,
        exposure_command: std::sync::Arc<dyn CapabilityExposureCommandService + Send + Sync>,
        trace_impact_command: std::sync::Arc<dyn CapabilityTraceImpactCommandService + Send + Sync>,
        reference_command: std::sync::Arc<dyn CapabilityReferenceCommandService + Send + Sync>,
        identity_query: std::sync::Arc<dyn CapabilityIdentityQueryService + Send + Sync>,
        registry_query: std::sync::Arc<dyn CapabilityRegistryQueryService + Send + Sync>,
        descriptor_query: std::sync::Arc<dyn CapabilityDescriptorQueryService + Send + Sync>,
        relation_query: std::sync::Arc<dyn CapabilityRelationQueryService + Send + Sync>,
        exposure_query: std::sync::Arc<dyn CapabilityExposureQueryService + Send + Sync>,
        trace_impact_query: std::sync::Arc<dyn CapabilityTraceImpactQueryService + Send + Sync>,
        derived_material_query: std::sync::Arc<dyn CapabilityDerivedMaterialQueryService + Send + Sync>,
        reference_query: std::sync::Arc<dyn CapabilityReferenceQueryService + Send + Sync>,
    ) -> Self;

    /// Returns a cloned identity command service handle.
    pub fn identity_command(&self) -> std::sync::Arc<dyn CapabilityIdentityCommandService + Send + Sync>;
    /// Returns a cloned registry command service handle.
    pub fn registry_command(&self) -> std::sync::Arc<dyn CapabilityRegistryCommandService + Send + Sync>;
    /// Returns a cloned descriptor command service handle.
    pub fn descriptor_command(&self) -> std::sync::Arc<dyn CapabilityDescriptorCommandService + Send + Sync>;
    /// Returns a cloned relation command service handle.
    pub fn relation_command(&self) -> std::sync::Arc<dyn CapabilityRelationCommandService + Send + Sync>;
    /// Returns a cloned exposure command service handle.
    pub fn exposure_command(&self) -> std::sync::Arc<dyn CapabilityExposureCommandService + Send + Sync>;
    /// Returns a cloned trace-impact command service handle.
    pub fn trace_impact_command(&self) -> std::sync::Arc<dyn CapabilityTraceImpactCommandService + Send + Sync>;
    /// Returns a cloned reference command service handle.
    pub fn reference_command(&self) -> std::sync::Arc<dyn CapabilityReferenceCommandService + Send + Sync>;
    /// Returns a cloned identity query service handle.
    pub fn identity_query(&self) -> std::sync::Arc<dyn CapabilityIdentityQueryService + Send + Sync>;
    /// Returns a cloned registry query service handle.
    pub fn registry_query(&self) -> std::sync::Arc<dyn CapabilityRegistryQueryService + Send + Sync>;
    /// Returns a cloned descriptor query service handle.
    pub fn descriptor_query(&self) -> std::sync::Arc<dyn CapabilityDescriptorQueryService + Send + Sync>;
    /// Returns a cloned relation query service handle.
    pub fn relation_query(&self) -> std::sync::Arc<dyn CapabilityRelationQueryService + Send + Sync>;
    /// Returns a cloned exposure query service handle.
    pub fn exposure_query(&self) -> std::sync::Arc<dyn CapabilityExposureQueryService + Send + Sync>;
    /// Returns a cloned trace-impact query service handle.
    pub fn trace_impact_query(&self) -> std::sync::Arc<dyn CapabilityTraceImpactQueryService + Send + Sync>;
    /// Returns a cloned derived-material query service handle.
    pub fn derived_material_query(&self) -> std::sync::Arc<dyn CapabilityDerivedMaterialQueryService + Send + Sync>;
    /// Returns a cloned reference query service handle.
    pub fn reference_query(&self) -> std::sync::Arc<dyn CapabilityReferenceQueryService + Send + Sync>;
}
```

Accessor返回 cloned `Arc` 而不是 `&dyn Service`，原因是 API facade需要独立持有 process-lifetime handle，且不能借用 infra builder stack frame。`Arc` clone不复制 service truth、不创建第二个 adapter，也不允许 downcast；API只可调用 trait surface。

### 87.2 Infra-owned API entry handoff

以下 carrier归 `crates/infra/src/runtime_builder.rs`，是 Stage 7 的 API-specific neutral handoff。它只包含已验证的 API 参数和 application service bundle；所有 raw config、config ref、secret、endpoint、physical transport、repository、UoW和external Port都在进入该 carrier前被消费或丢弃。

```rust
/// Complete API-specific neutral handoff produced after runtime assembly stages zero through six.
pub struct CapabilityApiEntryHandoff {
    /// Validated API-local byte, page, and timeout parameters.
    parameters: CapabilityApiEntryParameters,
    /// Complete application-owned command and query service object bundle.
    application_services: CapabilityApiApplicationServices,
}

impl CapabilityApiEntryHandoff {
    /// Creates a complete API handoff after all required application services are present.
    pub(crate) fn new(
        parameters: CapabilityApiEntryParameters,
        application_services: CapabilityApiApplicationServices,
    ) -> Self;

    /// Returns the validated API entry parameters without exposing raw configuration.
    pub fn parameters(&self) -> &CapabilityApiEntryParameters;

    /// Consumes the handoff and returns the complete application service bundle for API-owned facade construction.
    pub fn into_application_services(self) -> CapabilityApiApplicationServices;
}
```

`CapabilityApiEntryHandoff` 必须是 complete-or-error carrier：`new` 的调用方只能在 Stage 5/6 coverage gate通过后调用；不能为未构造的 service增加 `Option` 字段。该 carrier不实现 `Clone`，API factory只能消费一个handoff一次。factory先借用并复制typed parameters，再调用唯一的消费式 `into_application_services(self)` 取得service bundle；不得同时保留handoff借用、复制handoff、重复构造entry graph或把handoff交回infra。handoff不暴露concrete adapter，也不把 `CapabilityApiEntryParameters` 序列化或持久化。

### 87.3 Carrier 生命周期与跨 crate accessor 表

| 生命周期点 | owner | 允许操作 | 禁止操作 |
|---|---|---|---|
| Stage 5 service graph | `infra`调用 `application` constructor | 形成15个 exact service trait object | dispatch请求、创建handler、读取 raw config |
| Stage 6 API branch | `infra::runtime_builder` | 校验 API variant、复制 typed params、调用 `CapabilityApiEntryHandoff::new` | 构造 `CapabilityCommandHandlers` / `CapabilityQueryHandlers` |
| Stage 7 handoff | API bootstrap | 借用一次typed parameters，再消费handoff取得service bundle并建立 API-owned facade | 访问 config ref、repository、UoW、Port或 downcast |
| API factory完成 | `api` | cloned `Arc` 转入两个 facade；保留 typed params | 将 handoff交给 route作为动态 registry、保留 partial service |
| host start之后 | `api` runtime | 只执行 exact route -> handler -> application service链 | 从 request / error text选择另一个 service或改变 operation inventory |

本批 carrier没有 `Vec`、`HashMap`、`serde_json::Value`、`Option<dyn Any>`、未注释 tuple或字符串 key。15 个 service field的缺失只能在 Stage 5 / Stage 7 startup gate被发现并映射为 `InfraError::RuntimeAssembly`。

## 88. API-owned concrete facade 与 runtime exact 契约

### 88.1 Command handler facade

以下声明归 `crates/api/src/command_handlers.rs`。它是 API 对既有 application service 的静态组合，不是新的 application service，也不拥有任何 domain object、repository、UoW、resolver、clock、id generator、external Port 或 raw configuration。每个字段都对应 `CapabilityApiApplicationServices` 的一个 Command accessor；字段数量固定为 7，不允许以 map、vector、统一 `execute` 或可选 trait object 替代。

```rust
/// API-owned synchronous facade for the seven capability command service groups.
pub(crate) struct CapabilityCommandHandlerFacade {
    /// Application service for identity and access-review commands.
    identity: std::sync::Arc<dyn CapabilityIdentityCommandService + Send + Sync>,
    /// Application service for registry commands.
    registry: std::sync::Arc<dyn CapabilityRegistryCommandService + Send + Sync>,
    /// Application service for descriptor and safe-summary commands.
    descriptor: std::sync::Arc<dyn CapabilityDescriptorCommandService + Send + Sync>,
    /// Application service for governance and method-relation commands.
    relation: std::sync::Arc<dyn CapabilityRelationCommandService + Send + Sync>,
    /// Application service for formal exposure and visibility commands.
    exposure: std::sync::Arc<dyn CapabilityExposureCommandService + Send + Sync>,
    /// Application service for traceability and impact commands.
    trace_impact: std::sync::Arc<dyn CapabilityTraceImpactCommandService + Send + Sync>,
    /// Application service for canonical reference commands.
    reference: std::sync::Arc<dyn CapabilityReferenceCommandService + Send + Sync>,
}

impl CapabilityCommandHandlerFacade {
    /// Creates the complete command facade from the validated fifteen-service API bundle.
    pub(crate) fn from_application_services(
        services: &CapabilityApiApplicationServices,
    ) -> Self;

    /// Converts an owned facade handle into the closed command-handler trait surface.
    pub(crate) fn into_handlers(
        self: std::sync::Arc<Self>,
    ) -> std::sync::Arc<dyn CapabilityCommandHandlers + Send + Sync>;
}
```

`from_application_services` 必须按 `identity -> registry -> descriptor -> relation -> exposure -> trace_impact -> reference` 顺序复制 7 个 `Arc`。它不得从 operation name、route text 或 request body选择字段。`into_handlers` 只用于 route composition；调用方不能通过 downcast 取得 service 或 adapter。该 facade 必须实现既有 `CapabilityCommandHandlers`，且 26 个方法的签名、request / result 类型和错误类型与 Step 8 §7.9 完全相同。实现方法只做三件事：验证已由 route binding选定的 closed operation、调用 `CapabilityOperationContext::from_command` 的共享 normalization helper、把 typed body 转交对应 application service。

```rust
#[async_trait::async_trait]
impl CapabilityCommandHandlers for CapabilityCommandHandlerFacade {
    // All twenty-six existing methods use the exact Step 8 signatures.
}
```

该compact skeleton只固定impl attribute位置；实施源码展开26个method时，每个method仍必须保留英文`///`，不得用此注释替代。

### 88.2 Query handler facade

以下声明归 `crates/api/src/query_handlers.rs`。它只持有 8 个既有 Query service trait object，所有 Query 方法必须保持 no-write 约束；不得把 Query service 与 Command service 合并，也不得在此 facade 内加入 read-visibility resolver 或 repository。

```rust
/// API-owned synchronous facade for the eight capability query service groups.
pub(crate) struct CapabilityQueryHandlerFacade {
    /// Application service for identity and access-review queries.
    identity: std::sync::Arc<dyn CapabilityIdentityQueryService + Send + Sync>,
    /// Application service for registry queries.
    registry: std::sync::Arc<dyn CapabilityRegistryQueryService + Send + Sync>,
    /// Application service for descriptor and safe-summary queries.
    descriptor: std::sync::Arc<dyn CapabilityDescriptorQueryService + Send + Sync>,
    /// Application service for governance and method-relation queries.
    relation: std::sync::Arc<dyn CapabilityRelationQueryService + Send + Sync>,
    /// Application service for formal exposure and consumer-view queries.
    exposure: std::sync::Arc<dyn CapabilityExposureQueryService + Send + Sync>,
    /// Application service for traceability and impact queries.
    trace_impact: std::sync::Arc<dyn CapabilityTraceImpactQueryService + Send + Sync>,
    /// Application service for derived-material and reconciliation queries.
    derived_material: std::sync::Arc<dyn CapabilityDerivedMaterialQueryService + Send + Sync>,
    /// Application service for canonical reference and external-reference queries.
    reference: std::sync::Arc<dyn CapabilityReferenceQueryService + Send + Sync>,
}

impl CapabilityQueryHandlerFacade {
    /// Creates the complete query facade from the validated fifteen-service API bundle.
    pub(crate) fn from_application_services(
        services: &CapabilityApiApplicationServices,
    ) -> Self;

    /// Converts an owned facade handle into the closed query-handler trait surface.
    pub(crate) fn into_handlers(
        self: std::sync::Arc<Self>,
    ) -> std::sync::Arc<dyn CapabilityQueryHandlers + Send + Sync>;
}
```

`from_application_services` 必须按 `identity -> registry -> descriptor -> relation -> exposure -> trace_impact -> derived_material -> reference` 顺序复制 8 个 `Arc`。该 facade 必须实现既有 `CapabilityQueryHandlers`，且 33 个方法逐项回指 Step 8 §8.10；实现方法不得创建 idempotency key、UoW、stored result、write metadata 或 external call。`into_handlers` 不提供动态 operation lookup，route binding仍逐个选择一个静态 trait method。

```rust
#[async_trait::async_trait]
impl CapabilityQueryHandlers for CapabilityQueryHandlerFacade {
    // All thirty-three existing methods use the exact Step 8 signatures.
}
```

该compact skeleton只固定impl attribute位置；实施源码展开33个method时，每个method仍必须保留英文`///`，不得用此注释替代。

### 88.3 API runtime 与 startup-local composition error

以下声明归 `crates/api/src/composition.rs`。`CapabilityApiRuntime` 是 listener / route composition 前的完整 entry runtime；它不负责 bind socket、读取环境变量、解码 raw bytes 或选择 HTTP status。route 层只能通过其 typed accessors取得 facade和 entry parameters。

```rust
/// Complete API entry runtime held for the lifetime of the synchronous listener.
pub(crate) struct CapabilityApiRuntime {
    /// Closed command-handler trait object with all twenty-six command methods covered.
    command_handlers: std::sync::Arc<dyn CapabilityCommandHandlers + Send + Sync>,
    /// Closed query-handler trait object with all thirty-three query methods covered.
    query_handlers: std::sync::Arc<dyn CapabilityQueryHandlers + Send + Sync>,
    /// Validated API byte, page, and timeout parameters.
    parameters: CapabilityApiEntryParameters,
}

/// Startup-local error raised while composing a complete API runtime.
pub(crate) enum CapabilityApiCompositionError {
    /// The handoff does not contain the API entry parameter variant selected by the host.
    EntryParametersMismatch,
    /// A required closed command operation is not covered by the command facade.
    MissingCommandCoverage {
        /// Closed command operation whose static mapping is absent.
        operation: CapabilityCommandName,
    },
    /// A required closed query operation is not covered by the query facade.
    MissingQueryCoverage {
        /// Closed query operation whose static mapping is absent.
        operation: CapabilityQueryName,
    },
    /// A facade constructor or static coverage audit returned an invalid partial graph.
    IncompleteFacadeGraph,
}

impl CapabilityApiRuntime {
    /// Builds the complete API runtime from one validated, API-specific handoff.
    pub(crate) fn from_handoff(
        handoff: CapabilityApiEntryHandoff,
    ) -> Result<Self, CapabilityApiCompositionError>;

    /// Returns the command facade as the closed handler trait surface for route wiring.
    pub(crate) fn command_handlers(&self) -> std::sync::Arc<dyn CapabilityCommandHandlers + Send + Sync>;

    /// Returns the query facade as the closed handler trait surface for route wiring.
    pub(crate) fn query_handlers(&self) -> std::sync::Arc<dyn CapabilityQueryHandlers + Send + Sync>;

    /// Returns validated API parameters for byte, page, and timeout wrappers.
    pub(crate) fn parameters(&self) -> &CapabilityApiEntryParameters;
}
```

`from_handoff` 的固定顺序和所有权规则为：

```text
consume handoff exactly once
  -> clone validated typed parameters from handoff.parameters()
  -> validate the copied typed parameters
  -> consume handoff.into_application_services()
  -> clone the fifteen Arc service handles from the consumed service bundle
  -> validate API parameter variant and positive typed values
  -> perform exhaustive 26-command / 33-query coverage audit
  -> construct CapabilityCommandHandlerFacade
  -> construct CapabilityQueryHandlerFacade
  -> wrap each concrete facade in Arc
  -> coerce each Arc<ConcreteFacade> to Arc<dyn HandlerTrait + Send + Sync>
  -> retain typed parameters and both trait-object Arcs
  -> return complete CapabilityApiRuntime
```

任何一步失败都不返回含有一个 facade 的 partial runtime。route composition不得保存指向局部concrete facade的借用；它只能clone `CapabilityApiRuntime`中的trait-object `Arc`。`CapabilityApiCompositionError` 只存在于 API bootstrap 的本地结果中；host composition boundary 将其作为 startup source 保留并映射为既有 `InfraError::RuntimeAssembly`。API crate 不反向依赖 infra，也不把该错误转换为 `ApiError`、Command rejection、Query surface 或 HTTP response。runtime accessor 返回 cloned `Arc`，但不复制 application service truth、不创建第二个 adapter，也不允许 downcast。`into_application_services(self)` 是唯一跨crate消费点；不得再提供返回 `&CapabilityApiApplicationServices` 的借用accessor。

### 88.4 concrete facade delegation invariant

| facade | 字段数 | exact coverage | 每个 method 的固定前缀 | 禁止行为 |
|---|---:|---:|---|---|
| `CapabilityCommandHandlerFacade` | 7 | 26 / 26 Command | closed route/name/body check -> `CapabilityOperationName::from_command_name` -> `CapabilityOperationIdempotencyKey::for_command` -> `CapabilityOperationContext::from_command` -> matching service call | generic execute、route alias、body metadata fallback、handler-owned retry / repository write |
| `CapabilityQueryHandlerFacade` | 8 | 33 / 33 Query | closed route/name/body check -> `CapabilityOperationName::from_query_name` -> `CapabilityOperationContext::from_query` -> matching service call | idempotency、UoW、stored result、resolver direct call、degraded body fabrication |

API facade 的 delegation failure只按既有边界分类：route / envelope / schema / typed normalization failure为 `ApiError::Source`，application service返回值为 `ApiError::Application { source }`。facade不得根据 `ApplicationError` 的文字、HTTP status、时间戳或 adapter 私有状态改变分类；也不得对技术失败自行重试、刷新、重建或降级。

## 89. Command facade 的 26/26 静态覆盖矩阵

### 89.1 矩阵使用规则

下表是 API composition 的静态 coverage audit，不是新的协议真相源。route、request、result、handler method、application service trait 和 Step 9 flow 均回指 Step 8 / Step 9 已闭合声明；实现者不得从表外新增 alias、bulk method 或 generic dispatcher。`facade field` 是 `CapabilityCommandHandlerFacade` 的唯一字段选择；`service callable` 的参数和返回类型必须逐字承接 Step 8 §7.10。

每条 Command 必须经过同一顺序：

```text
closed POST route
  -> exact CapabilityCommandName
  -> schema version 1
  -> concrete CapabilityCommandRequest<T>
  -> CapabilityOperationName::from_command_name
  -> CapabilityOperationIdempotencyKey::for_command
  -> CapabilityOperationContext::from_command
  -> one named application service callable
```

route、name、schema 或 body type 不对称时，application service不被调用，入口形成既有 `ApiError::Source`；只有完成对称校验并成功构造 context 后，才允许进入 application。Command body不得重复 actor、trace、request time、idempotency key或任何 transport metadata。

### 89.2 Identity、registry、descriptor 与 relation Command

| # | closed operation | facade field | service callable | request -> result | Step 9 flow |
|---:|---|---|---|---|---|
| 1 | `EstablishCapabilityAccessContext` | `identity` | `CapabilityIdentityCommandService::establish_capability_access_context` | `CapabilityCommandRequest<EstablishCapabilityAccessContextCommand>` -> `CapabilityCommandOutcome<EstablishCapabilityAccessContextResult>` | `command_establish_capability_access_context_flow` |
| 2 | `CorrectCapabilityIdentity` | `identity` | `CapabilityIdentityCommandService::correct_capability_identity` | `CapabilityCommandRequest<CorrectCapabilityIdentityCommand>` -> `CapabilityCommandOutcome<CorrectCapabilityIdentityResult>` | `command_correct_capability_identity_flow` |
| 3 | `RetireCapabilityIdentity` | `identity` | `CapabilityIdentityCommandService::retire_capability_identity` | `CapabilityCommandRequest<RetireCapabilityIdentityCommand>` -> `CapabilityCommandOutcome<RetireCapabilityIdentityResult>` | `command_retire_capability_identity_flow` |
| 4 | `RecordCapabilityAccessReviewFact` | `identity` | `CapabilityIdentityCommandService::record_capability_access_review_fact` | `CapabilityCommandRequest<RecordCapabilityAccessReviewFactCommand>` -> `CapabilityCommandOutcome<RecordCapabilityAccessReviewFactResult>` | `command_record_capability_access_review_fact_flow` |
| 5 | `RegisterCapabilityInRegistry` | `registry` | `CapabilityRegistryCommandService::register_capability_in_registry` | `CapabilityCommandRequest<RegisterCapabilityInRegistryCommand>` -> `CapabilityCommandOutcome<RegisterCapabilityInRegistryResult>` | `command_register_capability_in_registry_flow` |
| 6 | `UpdateRegistryLifecycleState` | `registry` | `CapabilityRegistryCommandService::update_registry_lifecycle_state` | `CapabilityCommandRequest<UpdateRegistryLifecycleStateCommand>` -> `CapabilityCommandOutcome<UpdateRegistryLifecycleStateResult>` | `command_update_registry_lifecycle_state_flow` |
| 7 | `UpdateRegistryVisibilityBasis` | `registry` | `CapabilityRegistryCommandService::update_registry_visibility_basis` | `CapabilityCommandRequest<UpdateRegistryVisibilityBasisCommand>` -> `CapabilityCommandOutcome<UpdateRegistryVisibilityBasisResult>` | `command_update_registry_visibility_basis_flow` |
| 8 | `RetireCapabilityRegistryEntry` | `registry` | `CapabilityRegistryCommandService::retire_capability_registry_entry` | `CapabilityCommandRequest<RetireCapabilityRegistryEntryCommand>` -> `CapabilityCommandOutcome<RetireCapabilityRegistryEntryResult>` | `command_retire_capability_registry_entry_flow` |
| 9 | `EstablishAdapterDescriptor` | `descriptor` | `CapabilityDescriptorCommandService::establish_adapter_descriptor` | `CapabilityCommandRequest<EstablishAdapterDescriptorCommand>` -> `CapabilityCommandOutcome<EstablishAdapterDescriptorResult>` | `command_establish_adapter_descriptor_flow` |
| 10 | `ReplaceAdapterDescriptor` | `descriptor` | `CapabilityDescriptorCommandService::replace_adapter_descriptor` | `CapabilityCommandRequest<ReplaceAdapterDescriptorCommand>` -> `CapabilityCommandOutcome<ReplaceAdapterDescriptorResult>` | `command_replace_adapter_descriptor_flow` |
| 11 | `RecordDescriptorRiskConstraintSummary` | `descriptor` | `CapabilityDescriptorCommandService::record_descriptor_risk_constraint_summary` | `CapabilityCommandRequest<RecordDescriptorRiskConstraintSummaryCommand>` -> `CapabilityCommandOutcome<RecordDescriptorRiskConstraintSummaryResult>` | `command_record_descriptor_risk_constraint_summary_flow` |
| 12 | `AttachDescriptorSecretReference` | `descriptor` | `CapabilityDescriptorCommandService::attach_descriptor_secret_reference` | `CapabilityCommandRequest<AttachDescriptorSecretReferenceCommand>` -> `CapabilityCommandOutcome<AttachDescriptorSecretReferenceResult>` | `command_attach_descriptor_secret_reference_flow` |
| 13 | `AttachGovernanceSeamRelation` | `relation` | `CapabilityRelationCommandService::attach_governance_seam_relation` | `CapabilityCommandRequest<AttachGovernanceSeamRelationCommand>` -> `CapabilityCommandOutcome<AttachGovernanceSeamRelationResult>` | `command_attach_governance_seam_relation_flow` |
| 14 | `ReplaceGovernanceSeamRelation` | `relation` | `CapabilityRelationCommandService::replace_governance_seam_relation` | `CapabilityCommandRequest<ReplaceGovernanceSeamRelationCommand>` -> `CapabilityCommandOutcome<ReplaceGovernanceSeamRelationResult>` | `command_replace_governance_seam_relation_flow` |
| 15 | `ExpireGovernanceSeamRelation` | `relation` | `CapabilityRelationCommandService::expire_governance_seam_relation` | `CapabilityCommandRequest<ExpireGovernanceSeamRelationCommand>` -> `CapabilityCommandOutcome<ExpireGovernanceSeamRelationResult>` | `command_expire_governance_seam_relation_flow` |
| 16 | `AttachCapabilityMethodRelation` | `relation` | `CapabilityRelationCommandService::attach_capability_method_relation` | `CapabilityCommandRequest<AttachCapabilityMethodRelationCommand>` -> `CapabilityCommandOutcome<AttachCapabilityMethodRelationResult>` | `command_attach_capability_method_relation_flow` |
| 17 | `RemoveCapabilityMethodRelation` | `relation` | `CapabilityRelationCommandService::remove_capability_method_relation` | `CapabilityCommandRequest<RemoveCapabilityMethodRelationCommand>` -> `CapabilityCommandOutcome<RemoveCapabilityMethodRelationResult>` | `command_remove_capability_method_relation_flow` |

### 89.3 Exposure、trace/impact 与 reference Command

| # | closed operation | facade field | service callable | request -> result | Step 9 flow |
|---:|---|---|---|---|---|
| 18 | `EstablishFormalExposureBoundary` | `exposure` | `CapabilityExposureCommandService::establish_formal_exposure_boundary` | `CapabilityCommandRequest<EstablishFormalExposureBoundaryCommand>` -> `CapabilityCommandOutcome<EstablishFormalExposureBoundaryResult>` | `command_establish_formal_exposure_boundary_flow` |
| 19 | `UpdateFormalVisibilityApplicability` | `exposure` | `CapabilityExposureCommandService::update_formal_visibility_applicability` | `CapabilityCommandRequest<UpdateFormalVisibilityApplicabilityCommand>` -> `CapabilityCommandOutcome<UpdateFormalVisibilityApplicabilityResult>` | `command_update_formal_visibility_applicability_flow` |
| 20 | `SuspendFormalExposureBoundary` | `exposure` | `CapabilityExposureCommandService::suspend_formal_exposure_boundary` | `CapabilityCommandRequest<SuspendFormalExposureBoundaryCommand>` -> `CapabilityCommandOutcome<SuspendFormalExposureBoundaryResult>` | `command_suspend_formal_exposure_boundary_flow` |
| 21 | `RetireFormalExposureBoundary` | `exposure` | `CapabilityExposureCommandService::retire_formal_exposure_boundary` | `CapabilityCommandRequest<RetireFormalExposureBoundaryCommand>` -> `CapabilityCommandOutcome<RetireFormalExposureBoundaryResult>` | `command_retire_formal_exposure_boundary_flow` |
| 22 | `RecordCapabilityChangeImpactFact` | `trace_impact` | `CapabilityTraceImpactCommandService::record_capability_change_impact_fact` | `CapabilityCommandRequest<RecordCapabilityChangeImpactFactCommand>` -> `CapabilityCommandOutcome<RecordCapabilityChangeImpactFactResult>` | `command_record_capability_change_impact_fact_flow` |
| 23 | `RecordTraceabilityHandoffSummary` | `trace_impact` | `CapabilityTraceImpactCommandService::record_traceability_handoff_summary` | `CapabilityCommandRequest<RecordTraceabilityHandoffSummaryCommand>` -> `CapabilityCommandOutcome<RecordTraceabilityHandoffSummaryResult>` | `command_record_traceability_handoff_summary_flow` |
| 24 | `RecordReferenceResolutionState` | `reference` | `CapabilityReferenceCommandService::record_reference_resolution_state` | `CapabilityCommandRequest<RecordReferenceResolutionStateCommand>` -> `CapabilityCommandOutcome<RecordReferenceResolutionStateResult>` | `command_record_reference_resolution_state_flow` |
| 25 | `RegisterExternalDocumentReference` | `reference` | `CapabilityReferenceCommandService::register_external_document_reference` | `CapabilityCommandRequest<RegisterExternalDocumentReferenceCommand>` -> `CapabilityCommandOutcome<RegisterExternalDocumentReferenceResult>` | `command_register_external_document_reference_flow` |
| 26 | `RegisterCapabilityConsumerReference` | `reference` | `CapabilityReferenceCommandService::register_capability_consumer_reference` | `CapabilityCommandRequest<RegisterCapabilityConsumerReferenceCommand>` -> `CapabilityCommandOutcome<RegisterCapabilityConsumerReferenceResult>` | `command_register_capability_consumer_reference_flow` |

### 89.4 Command coverage gate

| audit | expected | rule | failure |
|---|---:|---|---|
| closed Command operations | 26 | every Step 8 command name occurs exactly once | `MissingCommandCoverage` -> startup `InfraError::RuntimeAssembly` |
| handler methods | 26 | every trait method has exactly one facade delegation arm | duplicate, missing or wrong typed body is `IncompleteFacadeGraph` |
| application owners | 7 groups | only the seven existing Command service traits are used | new generic service or direct Port call is a design violation |
| request/result pairing | 26 | request body, operation name and result body are the same Step 8 row | mismatch is `ApiError::Source` at request time |
| flow pairing | 26 | each row points to one unique Step 9 `command_*_flow` | merged generic flow is not accepted as coverage |
| write-channel normalization | 26 | every fresh call uses envelope metadata and `CapabilityOperationContext::from_command` | missing key / metadata is rejected before application call |

The command facade has no valid partial coverage state. A process may be assembled only when all 26 rows pass; an explicitly disabled external dependency does not disable a Command operation, because Command service construction and API coverage remain required even when an external Port later returns its typed `NotConfigured` outcome.

## 90. Query facade 的 33/33 静态覆盖矩阵

### 90.1 Query coverage 规则

Query 矩阵承接 Step 8 §8.12、§8.13~§8.16 的 closed route、request selector、response view 和 Step 9 独立 flow。它只证明 facade 对 33 个既有 Query callable 的静态覆盖，不定义新的 view、page、resolver 或 degraded marker。每一行的 `facade field` 必须与 `CapabilityQueryHandlerFacade` 的 8 个字段之一一致，不能通过 operation name、字符串前缀或动态 registry 选择 service。

每条 Query 的固定前缀为：

```text
closed POST route
  -> exact CapabilityQueryName
  -> schema version 1
  -> concrete CapabilityQueryRequest<T>
  -> CapabilityOperationName::from_query_name
  -> CapabilityOperationContext::from_query
  -> matching application query service callable
```

`CapabilityOperationContext::from_query` 只接收 envelope 的 `actor_context`、`QueryMetadata` 和 metadata 中已验证的 `TraceId`。Query body 只携带 selector、scope、filter 和 page input，不得携带 actor、trace、idempotency、write metadata、repository cursor 或 resolver decision。service 内部先执行既有 `context.assert_query_no_write()`，再由 application-owned resolver 执行 visibility gate；API facade 不直接调用 resolver 或 repository。

### 90.2 Identity、registry、descriptor 与 relation Query

| # | closed operation | facade field | service callable | request -> response | Step 9 flow |
|---:|---|---|---|---|---|
| 1 | `GetCapabilityIdentity` | `identity` | `CapabilityIdentityQueryService::get_capability_identity` | `CapabilityQueryRequest<GetCapabilityIdentityQuery>` -> `CapabilityQueryResponse<CapabilityIdentityView>` | `query_get_capability_identity_flow` |
| 2 | `SearchCapabilityIdentities` | `identity` | `CapabilityIdentityQueryService::search_capability_identities` | `CapabilityQueryRequest<SearchCapabilityIdentitiesQuery>` -> `CapabilityPageResponse<CapabilityIdentitySearchItemView>` | `query_search_capability_identities_flow` |
| 3 | `GetCapabilityAccessReviewFact` | `identity` | `CapabilityIdentityQueryService::get_capability_access_review_fact` | `CapabilityQueryRequest<GetCapabilityAccessReviewFactQuery>` -> `CapabilityQueryResponse<CapabilityAccessReviewFactView>` | `query_get_capability_access_review_fact_flow` |
| 4 | `GetCapabilityRegistryEntry` | `registry` | `CapabilityRegistryQueryService::get_capability_registry_entry` | `CapabilityQueryRequest<GetCapabilityRegistryEntryQuery>` -> `CapabilityQueryResponse<CapabilityRegistryEntryView>` | `query_get_capability_registry_entry_flow` |
| 5 | `ListCapabilityRegistryEntries` | `registry` | `CapabilityRegistryQueryService::list_capability_registry_entries` | `CapabilityQueryRequest<ListCapabilityRegistryEntriesQuery>` -> `CapabilityPageResponse<CapabilityRegistryListItemView>` | `query_list_capability_registry_entries_flow` |
| 6 | `GetRegistryVisibilitySemantics` | `registry` | `CapabilityRegistryQueryService::get_registry_visibility_semantics` | `CapabilityQueryRequest<GetRegistryVisibilitySemanticsQuery>` -> `CapabilityQueryResponse<RegistryVisibilitySemanticsView>` | `query_get_registry_visibility_semantics_flow` |
| 7 | `GetAdapterDescriptor` | `descriptor` | `CapabilityDescriptorQueryService::get_adapter_descriptor` | `CapabilityQueryRequest<GetAdapterDescriptorQuery>` -> `CapabilityQueryResponse<AdapterDescriptorView>` | `query_get_adapter_descriptor_flow` |
| 8 | `GetDescriptorRiskConstraintSummary` | `descriptor` | `CapabilityDescriptorQueryService::get_descriptor_risk_constraint_summary` | `CapabilityQueryRequest<GetDescriptorRiskConstraintSummaryQuery>` -> `CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>` | `query_get_descriptor_risk_constraint_summary_flow` |
| 9 | `GetDescriptorSecretSafeSummary` | `descriptor` | `CapabilityDescriptorQueryService::get_descriptor_secret_safe_summary` | `CapabilityQueryRequest<GetDescriptorSecretSafeSummaryQuery>` -> `CapabilityQueryResponse<DescriptorSecretSafeSummaryView>` | `query_get_descriptor_secret_safe_summary_flow` |
| 10 | `ListDescriptorsByCapability` | `descriptor` | `CapabilityDescriptorQueryService::list_descriptors_by_capability` | `CapabilityQueryRequest<ListDescriptorsByCapabilityQuery>` -> `CapabilityPageResponse<AdapterDescriptorView>` | `query_list_descriptors_by_capability_flow` |
| 11 | `GetGovernanceSeamRelation` | `relation` | `CapabilityRelationQueryService::get_governance_seam_relation` | `CapabilityQueryRequest<GetGovernanceSeamRelationQuery>` -> `CapabilityQueryResponse<GovernanceSeamRelationView>` | `query_get_governance_seam_relation_flow` |
| 12 | `GetAccessGovernanceSeparation` | `relation` | `CapabilityRelationQueryService::get_access_governance_separation` | `CapabilityQueryRequest<GetAccessGovernanceSeparationQuery>` -> `CapabilityQueryResponse<AccessGovernanceSeparationView>` | `query_get_access_governance_separation_flow` |
| 13 | `GetCapabilityMethodRelation` | `relation` | `CapabilityRelationQueryService::get_capability_method_relation` | `CapabilityQueryRequest<GetCapabilityMethodRelationQuery>` -> `CapabilityQueryResponse<CapabilityMethodRelationView>` | `query_get_capability_method_relation_flow` |
| 14 | `ListCapabilityRelations` | `relation` | `CapabilityRelationQueryService::list_capability_relations` | `CapabilityQueryRequest<ListCapabilityRelationsQuery>` -> `CapabilityPageResponse<CapabilityRelationView>` | `query_list_capability_relations_flow` |

### 90.3 Exposure、trace、derived material 与 reference Query

| # | closed operation | facade field | service callable | request -> response | Step 9 flow |
|---:|---|---|---|---|---|
| 15 | `GetFormalExposureBoundary` | `exposure` | `CapabilityExposureQueryService::get_formal_exposure_boundary` | `CapabilityQueryRequest<GetFormalExposureBoundaryQuery>` -> `CapabilityQueryResponse<FormalExposureBoundaryView>` | `query_get_formal_exposure_boundary_flow` |
| 16 | `GetFormalVisibilityApplicability` | `exposure` | `CapabilityExposureQueryService::get_formal_visibility_applicability` | `CapabilityQueryRequest<GetFormalVisibilityApplicabilityQuery>` -> `CapabilityQueryResponse<FormalVisibilityApplicabilityView>` | `query_get_formal_visibility_applicability_flow` |
| 17 | `GetControlledConsumerView` | `exposure` | `CapabilityExposureQueryService::get_controlled_consumer_view` | `CapabilityQueryRequest<GetControlledConsumerViewQuery>` -> `CapabilityQueryResponse<ControlledConsumerViewView>` | `query_get_controlled_consumer_view_flow` |
| 18 | `ListConsumableCapabilitiesForRuntimeTools` | `exposure` | `CapabilityExposureQueryService::list_consumable_capabilities_for_runtime_tools` | `CapabilityQueryRequest<ListConsumableCapabilitiesForRuntimeToolsQuery>` -> `CapabilityPageResponse<ControlledConsumerViewView>` | `query_list_consumable_capabilities_for_runtime_tools_flow` |
| 19 | `GetSdkExposureBoundary` | `exposure` | `CapabilityExposureQueryService::get_sdk_exposure_boundary` | `CapabilityQueryRequest<GetSdkExposureBoundaryQuery>` -> `CapabilityQueryResponse<SdkExposureBoundaryView>` | `query_get_sdk_exposure_boundary_flow` |
| 20 | `GetCapabilityAccessTrace` | `trace_impact` | `CapabilityTraceImpactQueryService::get_capability_access_trace` | `CapabilityQueryRequest<GetCapabilityAccessTraceQuery>` -> `CapabilityPageResponse<CapabilityAccessTraceView>` | `query_get_capability_access_trace_flow` |
| 21 | `GetCapabilityChangeImpact` | `trace_impact` | `CapabilityTraceImpactQueryService::get_capability_change_impact` | `CapabilityQueryRequest<GetCapabilityChangeImpactQuery>` -> `CapabilityQueryResponse<CapabilityChangeImpactView>` | `query_get_capability_change_impact_flow` |
| 22 | `GetDownstreamConsumptionImpactSummary` | `trace_impact` | `CapabilityTraceImpactQueryService::get_downstream_consumption_impact_summary` | `CapabilityQueryRequest<GetDownstreamConsumptionImpactSummaryQuery>` -> `CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>` | `query_get_downstream_consumption_impact_summary_flow` |
| 23 | `GetAuditHandoffTraceSummary` | `trace_impact` | `CapabilityTraceImpactQueryService::get_audit_handoff_trace_summary` | `CapabilityQueryRequest<GetAuditHandoffTraceSummaryQuery>` -> `CapabilityQueryResponse<AuditHandoffTraceSummaryView>` | `query_get_audit_handoff_trace_summary_flow` |
| 24 | `SearchCapabilityDirectory` | `derived_material` | `CapabilityDerivedMaterialQueryService::search_capability_directory` | `CapabilityQueryRequest<SearchCapabilityDirectoryQuery>` -> `CapabilityPageResponse<CapabilityDirectoryProjectionView>` | `query_search_capability_directory_flow` |
| 25 | `BrowseCapabilityDirectory` | `derived_material` | `CapabilityDerivedMaterialQueryService::browse_capability_directory` | `CapabilityQueryRequest<BrowseCapabilityDirectoryQuery>` -> `CapabilityPageResponse<CapabilityDirectoryProjectionView>` | `query_browse_capability_directory_flow` |
| 26 | `GetAuditFriendlyExportSummary` | `derived_material` | `CapabilityDerivedMaterialQueryService::get_audit_friendly_export_summary` | `CapabilityQueryRequest<GetAuditFriendlyExportSummaryQuery>` -> `CapabilityQueryResponse<AuditFriendlyExportSummaryView>` | `query_get_audit_friendly_export_summary_flow` |
| 27 | `GetReadOnlyEcosystemDiscoverySummary` | `derived_material` | `CapabilityDerivedMaterialQueryService::get_read_only_ecosystem_discovery_summary` | `CapabilityQueryRequest<GetReadOnlyEcosystemDiscoverySummaryQuery>` -> `CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>` | `query_get_read_only_ecosystem_discovery_summary_flow` |
| 28 | `GetCapabilityReconciliationReport` | `derived_material` | `CapabilityDerivedMaterialQueryService::get_capability_reconciliation_report` | `CapabilityQueryRequest<GetCapabilityReconciliationReportQuery>` -> `CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>` | `query_get_capability_reconciliation_report_flow` |
| 29 | `GetReferenceResolutionState` | `reference` | `CapabilityReferenceQueryService::get_reference_resolution_state` | `CapabilityQueryRequest<GetReferenceResolutionStateQuery>` -> `CapabilityQueryResponse<ReferenceResolutionStateView>` | `query_get_reference_resolution_state_flow` |
| 30 | `GetExternalDocumentReference` | `reference` | `CapabilityReferenceQueryService::get_external_document_reference` | `CapabilityQueryRequest<GetExternalDocumentReferenceQuery>` -> `CapabilityQueryResponse<ExternalDocumentReferenceView>` | `query_get_external_document_reference_flow` |
| 31 | `GetRuntimeToolsConsumerReference` | `reference` | `CapabilityReferenceQueryService::get_runtime_tools_consumer_reference` | `CapabilityQueryRequest<GetRuntimeToolsConsumerReferenceQuery>` -> `CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>` | `query_get_runtime_tools_consumer_reference_flow` |
| 32 | `GetSdkExposureConsumerReference` | `reference` | `CapabilityReferenceQueryService::get_sdk_exposure_consumer_reference` | `CapabilityQueryRequest<GetSdkExposureConsumerReferenceQuery>` -> `CapabilityQueryResponse<SdkExposureConsumerReferenceView>` | `query_get_sdk_exposure_consumer_reference_flow` |
| 33 | `GetObservabilityAuditReference` | `reference` | `CapabilityReferenceQueryService::get_observability_audit_reference` | `CapabilityQueryRequest<GetObservabilityAuditReferenceQuery>` -> `CapabilityQueryResponse<ObservabilityAuditReferenceView>` | `query_get_observability_audit_reference_flow` |

### 90.4 Query coverage gate

| audit | expected | rule | failure |
|---|---:|---|---|
| closed Query operations | 33 | every Step 8 query name occurs exactly once | `MissingQueryCoverage` -> startup `InfraError::RuntimeAssembly` |
| handler methods | 33 | every trait method has one static facade delegation arm | duplicate, missing or wrong typed body is `IncompleteFacadeGraph` |
| application owners | 8 groups | only the eight existing Query service traits are used | generic query service or direct resolver/repository call is a design violation |
| request/response pairing | 33 | request body, operation name and view/page body match the same Step 8 row | mismatch is `ApiError::Source` before application call |
| flow pairing | 33 | each row points to one unique Step 9 `query_*_flow` | generic search or merged flow is not coverage |
| no-write contract | 33 | context is built with `from_query`; service owns resolver and `assert_query_no_write` | idempotency, UoW or stored-result access is a graph failure |

Query coverage is also complete-or-error. A configured, fake or disabled external Port does not remove a Query method; the service must remain callable and return the existing typed visibility, reference or `ApplicationError` surface according to its protocol card. API must never replace an unavailable source with an empty visible page or a fabricated degraded body.

## 91. API 入口规范化契约

### 91.1 入口处理顺序与协议 authority

API 的请求处理顺序固定为以下单向链路。每个阶段只能消费上游已经验证的类型；任何失败在进入下一阶段前结束，不能跳过阶段、回退到字符串 dispatch 或调用第二个 application service。

```text
exact POST path and closed operation row
  -> raw request-body byte limit
  -> schema-v1 binding and concrete body decode
  -> route / operation / body-type symmetry
  -> envelope authority and duplicate-field rejection
  -> Command or Query typed normalization
  -> exactly one closed handler method
  -> application typed outcome
  -> protocol response mapping
```

`POST /v1/capability-hub/commands/{operation}` 与 `POST /v1/capability-hub/queries/{operation}` 是 Step 8 的唯一同步 route。`/v1` 只表示 route 与 protocol schema binding；它不是新的 `CommandMetadata` / `QueryMetadata` 字段，也不得向现有 `CapabilityCommandRequest<T>` 或 `CapabilityQueryRequest<T>` 增加 `schema_version`。schema version 由 route-selected codec binding 和 closed protocol row共同确定；未知版本在typed body decode前拒绝。

| 入口阶段 | 必须检查 | 成功后的唯一输出 | 禁止行为 |
|---|---|---|---|
| route selection | method、path、operation row、Command/Query family | 一个closed protocol row | alias、bulk route、任意字符串 operation、route推导actor |
| byte gate | raw body长度不超过 `request_body_limit` | 允许进入typed decode的原始字节 | 先decode再检查、保存超限body、截断后继续 |
| schema/body decode | schema `1`、concrete `T`、serde shape、required field | 一个具体 `CapabilityCommandRequest<T>` 或 `CapabilityQueryRequest<T>` | `Value`/`Any` fallback、第二解码器、旧schema猜测 |
| symmetry | path operation、envelope name、body type、response row一致 | 与Step 8一一对应的typed request | 把body交给相邻service、按字段猜operation |
| authority normalization | actor、trace、metadata、page和body重复字段规则 | `CapabilityOperationContext` 或 typed API source error | 从route/body/ref文本补造metadata |
| dispatch | 一个静态handler method | 一个application typed call | generic `execute`、动态registry、二次调用 |

### 91.2 Command 入口 authority 与调用规则

Command 的 actor、request id、trace、requested time、idempotency key、reason 和 external reference 只来自 envelope 的 `actor_context` 与 `CommandMetadata`。Command body 只表达该协议卡声明的业务意图；若body重复这些字段，必须在application调用前拒绝，不能选择“body优先”或“metadata优先”继续执行。

每个 fresh Command handler method 必须按以下顺序执行：

```text
closed route/name/body check
  -> CapabilityOperationName::from_command_name
  -> CapabilityOperationIdempotencyKey::for_command
  -> CapabilityOperationContext::from_command
  -> matching application Command service callable
```

`CapabilityOperationContext::from_command` 的输入只允许是已验证的 `ActorContext`、`CommandMetadata`、trace 和由closed operation + envelope key形成的 normalized key。handler不得重新生成 key、从body提取 metadata、读取repository、创建UoW、调用resolver或对application error执行retry。application service返回的 `Accepted`、稳定 `Rejected`、`DuplicateReplayed` 和技术 `ApplicationError` 保持 Step 8 / Step 12 的既有语义。

### 91.3 Query 入口 authority 与分页冲突裁决

Query 的 actor、request id、trace、requested time 和 consistency 只来自 `CapabilityQueryRequest<T>` envelope 的 `actor_context` 与 `QueryMetadata`；Query body只承载 selector、scope、filter以及该协议声明的 `CapabilityPublicPageRequest`。Query不得生成idempotency key，不能把 `QueryMetadata` 改造成write metadata。

本仓的业务分页 authority 裁决如下：

1. 对有分页的Capability Query，body内的 `CapabilityPublicPageRequest` 是唯一业务分页来源；其 `cursor` 与 `limit` 参与该Query的scope-bound validation。
2. `core_contracts::QueryMetadata` 当前实际包含 `page: Option<PageRequest>`。它是shared core metadata的兼容字段，不得在Capability Hub内复制、重定义或与body page合并。
3. Capability API normalization 要求 `QueryMetadata.page == None`。若shared caller把 `page` 放入metadata，或body page与metadata page同时存在，入口在application调用前以 `ApiError::Source { kind: ApiSourceKind::EnvelopeNormalization, .. }` 拒绝。
4. 不允许“metadata优先”“body优先后忽略metadata”“取较小值”或静默截断；这些做法会产生第二分页authority并改变request语义。
5. body `limit == 0` 或超过 `CapabilityApiEntryParameters::public_page_limit()` 时，以 `ApiError::Source { kind: ApiSourceKind::ProtocolMapping, .. }` 拒绝。API不把超限值截断为配置上限；cursor合法性、query/scope绑定和repository page映射继续由application flow负责。

该裁决记录为对当前core shared shape的兼容性处理，不声称已修改 `quantalithos-core`。若已有上游caller无法把 `QueryMetadata.page` 保持为 `None`，必须回开当前Step/Step 8并登记真实跨仓 blocker；实现者不得通过双重映射绕过该冲突。

### 91.4 Query no-write 与 response boundary

每个Query facade method必须先完成 `CapabilityOperationContext::from_query`，随后由application service调用既有 `context.assert_query_no_write()` 和 resolver-first visibility flow。API facade不得直接调用 `CapabilityReadVisibilityResolverPort`、repository或external resolver。

| Query结果 | API行为 | 禁止替代 |
|---|---|---|
| `Visible` single/page | 映射Step 8声明的typed body/page | 从首项、空页或timestamp推导visibility |
| `NotVisible` | 返回既有成功型not-visible surface | 伪装404、加载body、生成issue作为业务错误 |
| typed `Degraded` | 返回协议卡允许的body-free/partial surface | 把technical error改成degraded、伪造marker |
| visible missing/empty | 返回协议声明的visible missing/empty surface | 改成not-visible、补造item或cursor |
| `ApplicationError` | 包为 `ApiError::Application`，保留原variant | 按HTTP文字重分类、重试或返回empty success |

### 91.5 Whole-call deadline 的闭合边界

`CapabilityApiEntryParameters::call_timeout` 表示一次 API invocation 的**响应观察预算**，而不是可强制取消 application future 的业务截止时间。它不是 Command / Query body 字段，不进入 operation name、idempotency key、request digest、stored result 或 public response。API wrapper 不得因为该字段而重复调用 handler、切换 service、刷新 resolver、生成补偿 Command 或改变 Query surface。

本设计不把“API 客户端在预算内没有收到 response”新增为 `ApiSourceKind` 或 `ApplicationError`。现有四类 `ApiSourceKind` 继续只描述 route、envelope、schema 和 protocol mapping 的 API-owned source failure；内部 Port 明确返回 `ApplicationPortFailureKind::Timeout` 时仍映射为既有 `ApplicationError::PortFailure`，application 已进入 commit ambiguity 时仍必须返回 `ApplicationError::CommitOutcomeUnknown`。二者不能由 host response timer 覆盖。

API runtime 必须使用 non-cancelling invocation race：handler 接收已经拥有的 typed request，入口只在 `call_timeout` 内等待其 typed result；预算耗尽时入口可以结束本次 transport response observation，但不得 abort、drop 或重新执行已经 dispatch 的 handler task。若选定的 server framework 只能以强制取消来实现该预算，Stage 7 composition 必须拒绝该 binding 并返回 `InfraError::RuntimeAssembly`，不能静默启用有副作用的不确定取消语义。

固定的三阶段规则如下：

| 阶段 | dispatch 状态 | deadline 到期行为 | 业务 / 错误语义 |
|---|---|---|---|
| `Admission` | 尚未调用任何 handler | 可以停止继续读取/解码并结束 transport observation；不得创建 UoW、幂等 reservation 或 application effect | 若已有 route/body/source错误，按 `ApiError::Source`；单纯等待预算耗尽不是新的 API source code |
| `Dispatched` | 已经调用且只允许调用一次 handler | 入口停止等待但保留拥有型 invocation 继续运行；不得 abort、retry、换 key 或猜 zero effect | 后续由 application / UoW authority决定 `Accepted`、typed rejection、既有 `ApplicationError` 或 `CommitOutcomeUnknown`；host timeout不改写结果 |
| `TypedResult` | handler已返回 typed outcome 或 `ApplicationError` | 在预算内完成既有 response mapping；预算后到达的 result只能被丢弃于 transport 层 | `ApplicationError`包为 `ApiError::Application`；正常 outcome按Step 8映射；response codec失败为 `ApiError::Source(ProtocolMapping)` |

对 Command，`Dispatched` 阶段之后的客户端重试只能使用原始 `CommandMetadata` 中的同一 idempotency key 和同一 canonical body；后续 reserve / stored-result authority决定 `DuplicateReplayed`、`IdempotencyInProgress`、`IdempotencyConflict` 或原始技术错误。对 Query，超时不生成 idempotency record、不生成 degraded marker、不触发 refresh / repair；后续独立 Query 仍按 resolver-first 和 no-write 规则重新读取。该约束与 Step 13 的“client timeout after accepted commit”重入规则一致。

`CH-DDD-S14-API-WHOLE-CALL-TIMEOUT-001` 在本批按上述 non-cancelling response-observation contract 关闭：不新增错误 owner、不新增 issue code、不修改 `ApplicationError`、`ApiSourceKind`、public envelope 或 83 条 protocol flow。若未来产品要求 deadline 能终止 application execution、保证取消后的 zero effect 或把等待超时持久化为业务状态，必须重新打开 Step 12/13/14，并为该新语义提供独立 owner、状态和恢复证明；不得复用本节的 transport observation timeout。

## 92. API factory complete-or-error 契约

### 92.1 Factory 输入、验证和输出

API factory只接受 `CapabilityApiEntryHandoff`，不接受 `CapabilityRuntimeConfig`、config ref、repository、UoW、resolver、clock/id generator、external Port、endpoint、credential或raw body。handoff已经证明Stage 0~6完成，但factory仍必须执行entry-local的静态防御性检查，避免错误的host选路或不完整graph逃逸。

| 顺序 | factory动作 | 必须证明 | 失败结果 |
|---:|---|---|---|
| 1 | 借用并clone typed API parameters | 参数属于API variant且positive wrapper不为空 | `EntryParametersMismatch`或`IncompleteFacadeGraph` |
| 2 | 消费handoff取得application service bundle | handoff只被消费一次，15个service handle完整 | `InfraError::RuntimeAssembly`，无protocol invocation |
| 3 | 构造Command concrete facade | 7个Command service handle全部接入固定字段 | startup-local composition error |
| 4 | 构造Query concrete facade | 8个Query service handle全部接入固定字段 | startup-local composition error |
| 5 | 审计26/26 Command和33/33 Query静态覆盖 | 每个closed operation恰好一个method/body/flow/service映射 | `Missing*Coverage`或`IncompleteFacadeGraph` |
| 6 | 将两个concrete facade包成trait-object `Arc` | route只持有owned trait object，不借用local facade | startup-local composition error |
| 7 | 构造 `CapabilityApiRuntime` | 两个handler trait object和typed parameters同时存在 | 不返回partial runtime |
| 8 | 交给route/listener composition | runtime已完整且factory stack frame不再被借用 | host启动继续 |

步骤1~7是原子性的composition contract，不是业务transaction；它们不能产生idempotency reservation、stored result、change record、trace revision、event capture或external effect。任何失败都必须在步骤8之前结束，并转换为既有 `InfraError::RuntimeAssembly`；不存在“先启动Command route、稍后补Query facade”的partial startup模式。

### 92.2 Ownership-safe factory pseudocode

以下伪代码只表达所有权和调用顺序，不新增generic API或动态dispatcher：

```text
fn from_handoff(handoff):
    typed_parameters = handoff.parameters().clone()
    validate_api_parameters(typed_parameters)
    services = handoff.into_application_services()

    command_facade = CapabilityCommandHandlerFacade::from_application_services(&services)
    query_facade = CapabilityQueryHandlerFacade::from_application_services(&services)
    audit_command_coverage(command_facade, 26)
    audit_query_coverage(query_facade, 33)

    command_handlers = Arc::new(command_facade).into_handlers()
    query_handlers = Arc::new(query_facade).into_handlers()
    return CapabilityApiRuntime { command_handlers, query_handlers, parameters: typed_parameters }
```

实际实现必须保证coverage audit在facade构造完成后、runtime返回前完成；若audit需要借用concrete facade，只能在trait-object `Arc`转移前完成，不能把借用存进runtime。`services`在两个facade复制Arc handles后释放；它不被runtime或route保留为第二个service registry。

### 92.3 Factory 与 route composition 的边界

| owner | 允许 | 禁止 |
|---|---|---|
| `infra::runtime_builder` | 解析config、构造Port、构造application service graph、生成API handoff、将factory错误包成`InfraError::RuntimeAssembly` | 构造API handler、读取HTTP body、选择route、执行业务flow |
| `api::composition` | 消费handoff、构造两个facade、执行静态coverage audit、返回完整runtime | 读取raw config、持有repository/UoW/resolver、动态注册operation |
| API route layer | exact POST route、byte gate、typed decode、authority normalization、调用一个handler、映射typed result | 直接调用application service以外的Port、重试、刷新、current-truth补response |
| host/listener | 绑定框架、socket和部署transport | 改写closed route/schema、把startup failure伪造成协议response |

Factory完成前不允许listener启动。listener启动后，route只能clone runtime中的trait-object `Arc`和读取typed parameters；不能向factory传回request-local state、raw config或新的service handle。

## 93. API startup 与运行期 failure matrix

### 93.1 Failure ownership rules

API failure 的归属先按“是否已经存在 application invocation”判定，再按 source owner 判定。启动 composition 发生在 listener bind 和 request receive 之前，始终归 `InfraError::RuntimeAssembly`；请求入口在 handler dispatch 之前的 route / envelope / schema / protocol mapping 失败归 `ApiError::Source`；handler 已被调用后的稳定 application failure只归 `ApiError::Application`，不得由 API facade 重新分类。

| 判断问题 | 结果 owner | 允许的外层类型 | 禁止替代 |
|---|---|---|---|
| 进程是否还在构造 runtime graph？ | infra startup | `InfraError::RuntimeAssembly` | API response、Command rejection、Query degraded、fake success |
| 是否尚未调用 application handler？ | API entry | `ApiError::Source { kind, source }` | 伪造 `ApplicationError`、reserve、UoW、stored result |
| 是否已调用 application handler并得到 stable error？ | application | `ApiError::Application { source }` | 按 HTTP status、错误文字或耗时重分类 |
| 是否只有 host response observation 超时而没有 typed application result？ | host transport | 非 Capability Hub error taxonomy 的 response-observation timeout | 新增 `ApiSourceKind`、`PortFailure`、`CommitOutcomeUnknown` 或 zero-effect claim |

### 93.2 Startup and factory failure matrix

| failure condition | detection point | required result | graph / side effect rule |
|---|---|---|---|
| selected `CapabilityEntryParameters` is `Worker` or `Jobs`, but API factory is selected | Stage 6 / `from_handoff` entry match | `CapabilityApiCompositionError::EntryParametersMismatch` -> `InfraError::RuntimeAssembly` | 不创建任何 API facade；listener不得启动 |
| API handoff missing or not produced by complete Stage 0~6 graph | Stage 7 handoff boundary | `InfraError::RuntimeAssembly` | 不接受 `Option` handoff、不延迟解析、不返回 partial graph |
| any of 7 Command service objects absent | service bundle construction / facade factory | `MissingCommandCoverage` or `IncompleteFacadeGraph` -> `InfraError::RuntimeAssembly` | 26 Command route不得部分启动 |
| any of 8 Query service objects absent | service bundle construction / facade factory | `MissingQueryCoverage` or `IncompleteFacadeGraph` -> `InfraError::RuntimeAssembly` | 33 Query route不得部分启动 |
| service trait object has wrong family, wrong order, or cannot be coerced to required trait | facade construction | `IncompleteFacadeGraph` -> `InfraError::RuntimeAssembly` | 不通过 map、`Option`、dynamic cast或no-op service补齐 |
| static Command coverage is not exactly 26/26 | coverage audit | `MissingCommandCoverage` / `IncompleteFacadeGraph` -> `InfraError::RuntimeAssembly` | 不允许按字符串 operation 延迟发现 |
| static Query coverage is not exactly 33/33 | coverage audit | `MissingQueryCoverage` / `IncompleteFacadeGraph` -> `InfraError::RuntimeAssembly` | 不允许把缺失 Query 变成空页或 degraded success |
| API typed parameter variant, positive wrapper or page bound is invalid | entry parameter validation | `InfraError::RuntimeAssembly` | 不使用另一个 entry 的参数、library default或运行期 fallback |
| framework cannot preserve one owned, non-cancelling invocation after response timeout | host/runtime binding audit | `InfraError::RuntimeAssembly` | 不启用强制 future abort；不把取消当 rollback proof |
| facade or route composition creates repository, UoW, resolver, external Port or raw-config field | static ownership audit | `InfraError::RuntimeAssembly` / design gate | API runtime只保留两个 handler trait-object `Arc`和typed parameters |

这些 startup failure 都发生在任何业务 invocation 之前，因此不产生 idempotency record、stored result、change record、trace revision、event capture、Job report 或 external effect。`CapabilityApiCompositionError` 只作为 API-local source 进入 host composition；它不进入 public protocol。

### 93.3 Request-boundary source failure matrix

| request condition | dispatch allowed? | exact wrapper | source kind / mapping | required side effect |
|---|---:|---|---|---|
| HTTP method、path、Command/Query family或closed operation row不匹配 | no | `ApiError::Source` | `RouteAssembly` | zero application call、zero write |
| schema version missing or unsupported | no | `ApiError::Source` | `UnsupportedSchema` | raw body不得进入 typed business decode；zero write |
| raw body exceeds `request_body_limit` | no | `ApiError::Source` | `ProtocolMapping` | 在 typed decode前拒绝；不得截断、保存或重试 body |
| concrete body无法解码、required shape不完整或 body type与route不对称 | no | `ApiError::Source` | `ProtocolMapping` | 不调用相邻 handler；zero reserve / UoW |
| route operation、envelope name和concrete body三者不一致 | no | `ApiError::Source` | `RouteAssembly` | 不按 body 猜 operation；zero write |
| Command actor / metadata重复、缺失或无法形成 `CapabilityOperationContext` | no | `ApiError::Source` | `EnvelopeNormalization` | 不创建 idempotency key或 reservation；zero write |
| Query actor / metadata重复、缺失或无法形成 read context | no | `ApiError::Source` | `EnvelopeNormalization` | 不创建 UoW、idempotency或 stored result |
| Query `QueryMetadata.page` 非 `None` | no | `ApiError::Source` | `EnvelopeNormalization` | 不合并 metadata page 与 body page；zero write |
| Query body page `limit == 0` 或超过 validated public page limit | no | `ApiError::Source` | `ProtocolMapping` | 不静默截断；不进入 application query |
| Query cursor / scope binding需要读取正式 owner才能判断 | yes | application dispatch | 不在 API 层提前分类；由 matching Query flow返回既有 typed result或`ApiError::Application` | resolver-first、strict no-write仍由 application owner执行 |
| response body无法按对应 concrete result/view编码 | handler already returned | `ApiError::Source` | `ProtocolMapping` | 不重跑 handler、不读取 current truth重建 response |

`ApiSourceKind::RouteAssembly`、`EnvelopeNormalization`、`UnsupportedSchema`和`ProtocolMapping` 的范围与 Step 12 §§17~26保持一致。字段名、原始 body、HTTP status、route fragment、adapter code和错误文字只能留在非公开 source chain，不能进入 issue ref、stored result或业务状态。

### 93.4 Application return and technical failure matrix

| application return / failure | API wrapper | retry / recovery rule | forbidden API behavior |
|---|---|---|---|
| fresh `CapabilityCommandOutcome::Accepted` | normal typed API response | no API retry；client duplicate uses same key and stored replay | 重查 truth补 response、追加 trace或再发 event |
| `CapabilityCommandOutcome::DuplicateReplayed` | normal typed replay response | no body execution；返回 application stored surface | 重跑 Command body、生成新 result ref |
| stable Command rejection / typed Query surface | normal protocol response | caller按协议修正或稍后读取；不由 API 改成技术 error | 按 response status重分类、写 rejection outside application |
| `ApplicationError::InvalidInput`, `ContractRejected`, `DomainRejected` or invalid transition | `ApiError::Application` preserving exact variant | input/owner correction；不直接同输入重试 | API自行构造 rejection、改变 issue code |
| `ApplicationError::PortFailure { failure: NotConfigured }` | `ApiError::Application` | 配置/owner修复；不 fake fallback | 返回空成功、切换 adapter、删除该 service |
| `ApplicationError::PortFailure { failure: TemporarilyUnavailable }` | `ApiError::Application` | only application/declared bounded policy may retry when effect boundary permits | API handler retry、换 candidate、换 key |
| `ApplicationError::PortFailure { failure: Timeout }` from a concrete Port | `ApiError::Application` | same Step 12/13 typed timeout rule; no raw-timeout reinterpretation | 把 Port timeout与host response-observation timeout混同 |
| `ApplicationError::PortFailure { failure: PermanentlyRejected / InvalidTypedResponse / UnexpectedSourceFailure }` | `ApiError::Application` | no automatic retry; adapter/config/operator repair | text/status based retry or degraded success |
| `ApplicationError::ConsistencyDefect { .. }` | `ApiError::Application` | stop current flow; exact durable authority / operator repair | half body、empty success、current-truth repair、retry |
| `ApplicationError::CommitOutcomeUnknown` | `ApiError::Application` | same-key exact recovery / later replay; never blind mutation retry | map to ordinary timeout, `NotConfigured`, failed Command or zero effect |
| `ApplicationError::TransactionRollbackFailed` or other transaction failure | `ApiError::Application` | preserve rollback / commit decision and Step 12 recovery action | claim rollback, terminalize result, fabricate rejection |
| typed external handoff/collaboration outcome returned inside an application result | matching typed Command/Query surface | preserve application-owned typed outcome; no API delivery state | invent Delivered/Failed state or retry from HTTP layer |

API 只做 wrapper 和 protocol mapping。`ApiError::Application` 的 `ApplicationError` 必须逐variant保留；API不能通过 `Display`、`Debug`、elapsed time、HTTP/RPC numeric status或transport disconnect 推导新的 retryability或业务 disposition。

### 93.5 Non-cancelling invocation pseudocode

以下伪代码明确 host deadline 与 application outcome 的关系；它不新增 public type、错误 variant或协议字段：

```text
receive owned request
  -> run admission / route / byte / schema / envelope checks
  -> if source error: return ApiError::Source and do not dispatch
  -> create exactly one owned handler invocation
  -> race response observation against call_timeout
     -> typed result before deadline: map result or ApiError::Application
     -> observation deadline first:
          stop waiting at transport boundary
          keep the already-dispatched invocation owned by the runtime
          do not abort, retry, replace key, or inspect current truth
          discard any later result only at transport response boundary
```

For a Command, the invocation's later durable result remains authoritative for same-key replay. For a Query, a late result has no write effect and is not converted into a degraded marker. A framework adapter that cannot implement the ownership rule is a startup incompatibility, not an invocation-time `PortFailure`.

## 94. API composition closure and stop-review audit

### 94.1 Coverage and ownership audit

| audit | expected | result |
|---|---:|---|
| API-neutral service fields | 7 Command + 8 Query = 15 | pass; all fields required, typed and owned by `Arc` |
| Command facade fields / methods | 7 / 26 | pass; static matrix §89 is 26/26 |
| Query facade fields / methods | 8 / 33 | pass; static matrix §90 is 33/33 |
| API runtime handler objects | 2 | pass; owned `Arc<dyn CapabilityCommandHandlers>` and `Arc<dyn CapabilityQueryHandlers>` |
| API handler direct forbidden dependencies | 0 | pass; no repository, UoW, resolver, external Port, clock/id or raw config |
| dynamic dispatch escape hatches | 0 | pass; no generic `execute`, string registry, alias route, `Vec`, map or `dyn Any` |
| startup partial graph paths | 0 | pass; all composition failures are complete-or-error |
| request source categories | 4 | pass; existing `ApiSourceKind` remains exhaustive for API-owned pre-dispatch failures |
| application error reclassification | 0 | pass; `ApiError::Application` preserves exact `ApplicationError` |
| host timeout new business taxonomy | 0 | pass; response observation timeout is transport-only |

### 94.2 Rustdoc and structure-comment audit

本子批没有新增 public protocol type、domain object、application Port、repository trait、state enum或`ApplicationError` variant。既有 `CapabilityApiApplicationServices`、`CapabilityApiEntryHandoff`、`CapabilityCommandHandlerFacade`、`CapabilityQueryHandlerFacade`、`CapabilityApiRuntime`、`CapabilityApiCompositionError` 及其全部字段、variant payload、constructor、accessor、factory和mapper均已有英文 `///`；`into_handlers` 是唯一 facade trait-object conversion callable。结构体注释、字段注释和 enum variant 注释无新增遗漏。

### 94.3 Historical material, blocker and boundary audit

| item | status | current treatment |
|---|---|---|
| old formal `03` / README provider runtime, execution gateway, marketplace, governance approval, method body, SDK client | `historical_material` | 不进入 API carrier、facade、route或timeout semantics |
| old API generic facade / handler-in-infra wording | `historical_material` | 由 §§86~92 的 entry-neutral handoff和entry-owned composition替代 |
| `CH-DDD-S14-API-WHOLE-CALL-TIMEOUT-001` | `resolved_in_batch_14_5_2_2_1` | non-cancelling response-observation contract；不新增错误taxonomy；application authority保留 |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | `non_blocking` | 同一 key replay仍依赖已授权的现有 core accessor语义；未声称L0-core正式文档已修改 |
| unresolved upstream blocker | `none` | 本子批没有需要新上游Port、public schema或跨仓实现事实的未闭合项 |

### 94.4 Batch completion gate

| gate | result | source |
|---|---|---|
| carrier ownership and one-time handoff | pass | §§87.1~87.3 |
| API facade complete coverage | pass | §§88~90; 26/26 + 33/33 |
| route normalization and metadata authority | pass | §91.1~91.4 |
| whole-call timeout / cancellation boundary | pass | §91.5 and §93.5; blocker resolved without new error owner |
| startup failure mapping | pass | §92 and §93.1~93.2; all pre-listener failures -> `InfraError::RuntimeAssembly` |
| runtime source failure mapping | pass | §93.3~93.4; source vs application separation preserved |
| Query resolver-first / no-write | pass | §90.1, §91.3~91.4, Step 9 shared guard |
| Rustdoc / structure comments | pass | §94.2 |
| boundary exclusion | pass | no runtime execution, tools execution, marketplace listing, governance approval, method body or SDK package/client |
| truthfulness / artifact discipline | pass | formal `03` unchanged; no implementation ledger, boundary skeleton, code, test result, run id, evidence alias or sign-off created or claimed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.2.2.1
gate_status = 03_step_14_batch_14_5_2_2_1_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
resolved_closure_item = CH-DDD-S14-API-WHOLE-CALL-TIMEOUT-001
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_2_2_2_worker
```

## 95. Batch `14.5.2.2.2` Worker batch 1 开工确认、问题诊断与写入门禁

### 95.1 本批授权、输入与输出边界

本批只进入 `14.5.2.2.2 Worker` 的第一批写入。它承接 `14.5.2.1` 的 Stage 0~7 runtime builder、`14.5.2.2.1` 的 API handoff 结构，以及 `14.4.2` 已闭合的六个 Inbound source binding 和 header-first 语义。本批不进入 Jobs，不处理 `14.5.2.3` 的完整组合矩阵，不修改正式 `03-详细设计.md`。

| 项目 | 本批裁决 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前子批 | `14.5.2.2.2 Worker batch 1` |
| 直接上游 | Step 5 worker module contract、Step 7 application Port owner、Step 8 Inbound protocol、Step 9 six inbound flow + capture continuation、Step 12 WorkerError / receipt action、Step 13 event identity / replay、Step 14 §§26、46~50、75~85、API §§86~94 |
| 本批必须写入 | Worker application service bundle、one-shot entry handoff、六个 named resolved source inputs、Worker root ownership、factory complete-or-error、header-first dispatch boundary、Configured/Fake/Disabled parity、Rustdoc audit和正式§13回填草稿 |
| 本批明确不写入 | physical broker/API feed method、ack/nack product、topic/group/cron、Jobs factory、new application Port、new public protocol、local outbox/relay/DLQ、runtime/tools execution、marketplace listing、governance approval、method body或SDK client |
| 新声明性质 | 只允许增加 assembly/runtime-boundary carrier或Worker-private helper；不得增加业务 truth、application Port、public protocol或持久化状态 |
| 正式文档 | 不修改正式 `03-详细设计.md`；本文件继续作为正式 §13 的校准 source |
| artifact discipline | 不创建目标实现仓、Cargo文件、implementation ledger、planned boundary skeleton；不声称测试、run、evidence、sign-off或commit |

### 95.2 既有材料问题诊断

| 材料 / 口径 | 风险 | 当前处理 |
|---|---|---|
| `14.4.2 §47.1` 的“infra 调用 worker binary supplied runner factory” | 若按字面保留，容易把 Worker concrete graph、loop或反向依赖塞入 `infra` | 解释为 composition-time neutral factory boundary；Worker root拥有 factory，infra只提供已解析输入和调用所需的中立载体 |
| `CapabilityInboundSourceBinding` / `CapabilityInboundSourceBindings` / `CapabilityWorkerEntryBinding` | 它们是 `pub(crate)` infra-local config binding，不能作为跨 crate runtime input直接暴露 | 保持原可见性；在 Stage 7 消费后转换为新的 resolved assembly-only input，随后丢弃 config ref |
| 旧正式 `03` / README 的 provider runtime、统一执行 gateway、marketplace与governance approval | 会把 Worker误解为执行、审批或目录分发中心 | 标记为 `historical_material`，不进入 Worker handoff、dispatcher或application service bundle |
| 物理 feed API尚未选型 | 过早写 `poll`、`ack`、broker offset或具体返回值会伪造产品事实 | 本批只固定输入所有权、六槽位身份、一次性消费和 failure owner；物理 transport callable留 `04` / 后续绑定 |

### 95.3 方案取舍

| 方案 | 主要优点 | 主要风险 | 结论 |
|---|---|---|---|
| `infra` 直接返回 Worker concrete graph | 单一启动调用点 | 需要 `infra -> worker` 反向依赖，并让 infra拥有 loop / dispatcher语义 | 拒绝 |
| Worker接收 raw config/ref后自行解析 | Worker实现直观 | 泄漏配置、secret、endpoint和source discovery；entry可绕过Stage 0~6 gate | 拒绝 |
| `Vec` / map注册六个source，再按字符串动态派发 | 形式上可扩展 | 丢失6/6 closed inventory，允许第七协议、wrong-family重路由和漏配 | 拒绝 |
| infra完成resolved material，Worker root消费不可复制handoff并构造闭合runtime | 保持依赖方向、owner清晰、启动失败原子、可审查 | 需要明确carrier字段和消费顺序 | 采用 |

### 95.4 本批写入门禁

1. 新增的每个 `struct`、字段、`enum`、variant、variant payload、constructor、accessor、factory和mapper都必须在设计伪代码中附英文 `///` Rustdoc；字段注释逐项列出，不以“其余字段同上”替代。
2. Worker handoff只能携带已解析的 feed / actor / fixture runtime input、两个 application service handle和 `CapabilityWorkerEntryParameters`；不得携带 raw config/ref、repository、UoW、resolver、publisher、Clock、IdGenerator或application Port。
3. 六个 source slot必须保持静态 named fields和固定 `(consumer, family, logical event, schema, trusted actor, application method)` 映射；不得用 `Vec`、map、wildcard、string registry或第七arm。
4. `Configured` 与 `DeterministicFake` 必须产生相同 encoded-envelope入口和相同负向路径；`Disabled` 不创建 runner、task、receipt、ack或application call。
5. 任一 enabled slot、service handle、parameter或dispatcher不完整，整个 Worker graph以 startup `InfraError::RuntimeAssembly` complete-or-error；不得部分启动已完成槽位。

## 96. Worker application bundle 与一次性交接 carrier

### 96.1 Worker application service bundle

Worker只需要两个 application-owned service trait object。Inbound consumer负责六个闭合事件方法；event collaboration service只负责把一个已经选定的 capture ref交回application continuation facade。两个对象都不把 repository、Port或config暴露给 Worker。

```rust
/// Complete application service handles required by the Worker entry.
#[derive(Clone)]
pub struct CapabilityWorkerApplicationServices {
    /// Application facade for the six closed inbound consumer methods.
    inbound_consumer: std::sync::Arc<dyn CapabilityInboundConsumerService + Send + Sync>,
    /// Application facade for exact captured-event collaboration continuation.
    event_collaboration: std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>,
}

impl CapabilityWorkerApplicationServices {
    /// Creates a complete Worker service bundle from both required application facades.
    pub fn from_parts(
        inbound_consumer: std::sync::Arc<dyn CapabilityInboundConsumerService + Send + Sync>,
        event_collaboration: std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>,
    ) -> Self;

    /// Returns a cloned inbound consumer service handle.
    pub fn inbound_consumer(
        &self,
    ) -> std::sync::Arc<dyn CapabilityInboundConsumerService + Send + Sync>;

    /// Returns a cloned event collaboration service handle.
    pub fn event_collaboration(
        &self,
    ) -> std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>;
}
```

`from_parts` 的两个参数都是required；不存在 `Option`、统一 `dyn CapabilityApplicationService`、字符串 lookup或 `Vec`。该bundle是 application-owned service handle集合，不是新的 service trait，也不改变 Step 8 / Step 9 已有 callable。Worker只获得trait object的闭合方法面：六个 `CapabilityInboundConsumerService` method和既有 `CapabilityEventCollaborationService::collaborate_captured_event`。

### 96.2 Resolved source input 的 assembly-only 语义

`CapabilityInboundSourceBinding` 及其六槽位集合在 `infra/config.rs` 内完成 profile、family、trusted actor和fixture校验。Stage 6之后，每个 enabled slot必须被转换成一个已经解析的 runtime input；该转换不新增application Port或public protocol。为了避免在本批伪造具体transport API，resolved input只定义 ownership和生命周期要求：

| 输入类别 | Worker可见内容 | Worker不可见内容 | 生命周期 |
|---|---|---|---|
| configured feed | 能产生bounded encoded envelope的owned runtime feed handle | raw endpoint、credential、TLS、topic、group、subscription、adapter registry、config ref | handoff消费后由对应runner持有 |
| trusted actor | 对固定source family执行actor acceptance的owned matcher | secret、credential name、raw actor policy document、外部治理正文 | handoff消费后由对应runner持有 |
| deterministic fixture | 与configured feed相同入口形状的owned encoded-envelope fixture | fixture path、测试私有状态、预构造typed DTO、绕过negative path的shortcut | local/integration runner生命周期 |

Resolved input必须满足以下最小契约：

- feed只返回一次调用所需的bounded encoded bytes和transport-private delivery handle；transport metadata不进入 envelope、source identity、digest、receipt或application context。
- actor matcher只回答该slot的trusted actor gate；不能根据topic、credential名称、payload或display name推断source family。
- fixture必须生成与configured source相同的encoded bytes，且故意的wrong-family、wrong-actor、unsupported-schema、malformed-body案例仍走同一dispatcher negative path。
- resolved input不实现 `Clone` 作为默认要求；如具体 transport需要内部共享，必须由 runner owner证明共享不复制delivery state、不产生第二个消费游标且不改变一次性handoff语义。

### 96.3 Worker entry handoff 的 exact carrier

以下 carrier由 `infra::runtime_builder` 在 Stage 7 形成，由 Worker composition root一次性消费。它是 assembly/runtime boundary，不是 public protocol、application Port、domain object或持久化记录。

```rust
/// Complete Worker-specific neutral handoff produced after runtime assembly.
pub struct CapabilityWorkerEntryHandoff {
    /// Validated Worker loop and invocation parameters.
    parameters: CapabilityWorkerEntryParameters,
    /// Complete application service handles required by the Worker root.
    application_services: CapabilityWorkerApplicationServices,
    /// Governance-result reference source input, or an explicit disabled decision.
    governance_result_reference_changed: CapabilityResolvedInboundSource,
    /// Method-asset reference source input, or an explicit disabled decision.
    method_asset_reference_changed: CapabilityResolvedInboundSource,
    /// Downstream consumption-impact source input, or an explicit disabled decision.
    downstream_consumption_impact_reported: CapabilityResolvedInboundSource,
    /// External capability-source reference source input, or an explicit disabled decision.
    external_capability_source_reference_changed: CapabilityResolvedInboundSource,
    /// Audit-material reference source input, or an explicit disabled decision.
    audit_material_reference_changed: CapabilityResolvedInboundSource,
    /// External-document reference source input, or an explicit disabled decision.
    external_document_reference_changed: CapabilityResolvedInboundSource,
}

impl CapabilityWorkerEntryHandoff {
    /// Creates a complete Worker handoff after all six source slots and service handles pass startup gates.
    pub(crate) fn new(
        parameters: CapabilityWorkerEntryParameters,
        application_services: CapabilityWorkerApplicationServices,
        governance_result_reference_changed: CapabilityResolvedInboundSource,
        method_asset_reference_changed: CapabilityResolvedInboundSource,
        downstream_consumption_impact_reported: CapabilityResolvedInboundSource,
        external_capability_source_reference_changed: CapabilityResolvedInboundSource,
        audit_material_reference_changed: CapabilityResolvedInboundSource,
        external_document_reference_changed: CapabilityResolvedInboundSource,
    ) -> Self;

    /// Returns a borrowed view of the validated Worker parameters before handoff consumption.
    pub fn parameters(&self) -> &CapabilityWorkerEntryParameters;

    /// Consumes the handoff and transfers all runtime inputs to the Worker-owned factory.
    pub fn into_parts(
        self,
    ) -> (
        CapabilityWorkerEntryParameters,
        CapabilityWorkerApplicationServices,
        CapabilityResolvedInboundSource,
        CapabilityResolvedInboundSource,
        CapabilityResolvedInboundSource,
        CapabilityResolvedInboundSource,
        CapabilityResolvedInboundSource,
        CapabilityResolvedInboundSource,
    );
}
```

`CapabilityWorkerEntryHandoff` 不实现 `Clone`。`into_parts(self)` 是唯一消费入口；实现者不得同时保留handoff借用、复制source handle、先启动部分runner再消费剩余字段或把carrier交回 `infra`。tuple返回只是本地伪代码中的一次性ownership transfer，若最终实现采用 named destructuring，必须保持相同的八项顺序和字段语义；不得把它改成 map或动态 registry。

### 96.4 `CapabilityResolvedInboundSource` 的闭合形状

为了表达 `Disabled` 是完整且有意的 binding，同时避免向 Worker传递 config ref，本批定义一个 assembly-local resolved carrier。它不是业务状态，也不进入 `contracts` public type count。

```rust
/// Resolved runtime input for one fixed inbound source slot.
pub enum CapabilityResolvedInboundSource {
    /// Configured feed and trusted-actor matcher resolved by infrastructure.
    Configured {
        /// Owned encoded-envelope feed handle for this source slot.
        feed: CapabilityEncodedEnvelopeFeed,
        /// Owned trusted-actor matcher for this source family.
        trusted_actor: CapabilityTrustedActorMatcher,
    },
    /// Deterministic encoded-envelope fixture with the same gate contract as a configured feed.
    DeterministicFake {
        /// Owned deterministic fixture feed for this source slot.
        feed: CapabilityEncodedEnvelopeFeed,
        /// Owned deterministic trusted-actor matcher with configured-source-equivalent gates.
        trusted_actor: CapabilityTrustedActorMatcher,
    },
    /// Explicitly disables this source slot without creating a runner or task.
    Disabled,
}
```

本段是 Worker batch 1 的历史说明：当时 `CapabilityEncodedEnvelopeFeed` 与 `CapabilityTrustedActorMatcher` 仍只是概念性 assembly handle。Worker batch 2 已在 §§103~106 将其闭合为 `infra` 暴露、字段私有、不可 downcast 的 assembly-only opaque wrappers，并固定 feed stop、delivery ownership、matcher 和 failure surface；因此实现不得再把“后续 batch 收口”当作开放设计。它们仍不是 application Port或public protocol，且不得改成 `String`、`serde_json::Value`、generic map或concrete infra adapter。

### 96.5 Handoff 消费顺序与 failure owner

```text
infra Stage 6
  -> validate Worker entry variant and six named source decisions
  -> resolve every enabled feed and trusted-actor matcher in fixed slot order
  -> construct application Worker service bundle
  -> construct CapabilityWorkerEntryHandoff only after all gates pass
Worker root
  -> consume handoff exactly once
  -> validate six source identities against the static slot table
  -> construct six handler arms and one header-first dispatcher
  -> construct runners only for Configured / DeterministicFake slots
  -> omit Disabled slots from task graph
  -> return complete Worker runtime or startup error
host
  -> spawn tasks only after complete runtime exists
```

任何 enabled source resolve、service bundle construction、slot identity审计、handler coverage审计或runner construction失败都必须在 task spawn 前映射为 `InfraError::RuntimeAssembly`。如果 Worker factory在已消费handoff后发现输入不完整，必须返回该 startup error并丢弃全部已构造runner；不得返回“已启动的前N个slot + 一个失败slot”。

## 97. 六个固定 source slot 与 application handler 连接

### 97.1 Closed source-slot matrix

Worker root不得从物理 feed、topic、subscription、credential或payload推断协议身份。每个 named field在factory中都有一个固定的静态映射；下表是本批唯一允许的六臂集合。

| Handoff field | Consumer | Family | Logical event | Schema | Trusted actor boundary | Exact payload | Worker handler | Application method |
|---|---|---|---|---:|---|---|---|---|
| `governance_result_reference_changed` | `ConsumeGovernanceResultReferenceChanged` | `Governance` | `capability-hub.inbound.governance-result-reference-changed.v1` | `1` | L1-governance integration/system actor | `ConsumeGovernanceResultReferenceChangedPayload` | `consume_governance_result_reference_changed` | `CapabilityInboundConsumerService::consume_governance_result_reference_changed` |
| `method_asset_reference_changed` | `ConsumeMethodAssetReferenceChanged` | `MethodLibrary` | `capability-hub.inbound.method-asset-reference-changed.v1` | `1` | L3-method-library integration/system actor | `ConsumeMethodAssetReferenceChangedPayload` | `consume_method_asset_reference_changed` | `CapabilityInboundConsumerService::consume_method_asset_reference_changed` |
| `downstream_consumption_impact_reported` | `ConsumeDownstreamConsumptionImpactReported` | `DownstreamConsumer` | `capability-hub.inbound.downstream-consumption-impact-reported.v1` | `1` | Declared runtime/tools/SDK/product consumer actor | `ConsumeDownstreamConsumptionImpactReportedPayload` | `consume_downstream_consumption_impact_reported` | `CapabilityInboundConsumerService::consume_downstream_consumption_impact_reported` |
| `external_capability_source_reference_changed` | `ConsumeExternalCapabilitySourceReferenceChanged` | `ExternalCapabilitySource` | `capability-hub.inbound.external-capability-source-reference-changed.v1` | `1` | MCP/A2A/API discovery integration actor allowed for the source kind | `ConsumeExternalCapabilitySourceReferenceChangedPayload` | `consume_external_capability_source_reference_changed` | `CapabilityInboundConsumerService::consume_external_capability_source_reference_changed` |
| `audit_material_reference_changed` | `ConsumeAuditMaterialReferenceChanged` | `ObservabilityAudit` | `capability-hub.inbound.audit-material-reference-changed.v1` | `1` | Observability/audit integration actor | `ConsumeAuditMaterialReferenceChangedPayload` | `consume_audit_material_reference_changed` | `CapabilityInboundConsumerService::consume_audit_material_reference_changed` |
| `external_document_reference_changed` | `ConsumeExternalDocumentReferenceChanged` | `ExternalDocument` | `capability-hub.inbound.external-document-reference-changed.v1` | `1` | External-document integration actor | `ConsumeExternalDocumentReferenceChangedPayload` | `consume_external_document_reference_changed` | `CapabilityInboundConsumerService::consume_external_document_reference_changed` |

The consumer, family, logical event and schema values in this table are compile-time closed values already defined by Step 8. The trusted actor text identifies the ownership boundary; it is not a new actor enum, credential format or approval rule. A physical feed may be shared only as an infrastructure optimization when `04` proves that each named slot still retains an independent family gate and dispatcher arm.

### 97.2 Worker handler facade ownership

The Worker root builds one concrete implementation of the existing `CapabilityInboundEventHandlers` trait from the `inbound_consumer` handle. This implementation is an entry-local delegation facade. It does not define a second application service, repository, resolver or protocol schema.

| Handler stage | Owner | Exact operation | Forbidden shortcut |
|---|---|---|---|
| Envelope symmetry | Worker handler facade | Verify the decoded envelope's consumer, family, source ref and payload shape still match the selected slot | Re-route a valid payload to another handler arm |
| Context mapping | Worker handler facade using existing `CapabilityOperationContext::from_inbound_event` | Map validated header metadata and public source identity; preserve trace and occurrence time without making them local identity | Read Clock/IdGenerator or derive identity from transport metadata |
| Application dispatch | `CapabilityInboundConsumerService` | Call exactly the row-matching method in §97.1 with one context and one typed payload | Call a neighboring method, generic `execute`, repository, resolver or Port |
| Receipt validation | Worker handler facade | Require receipt consumer/source identity to match the selected slot and source event | Rewrite a receipt, add a result ref or infer effect from application error text |
| Runtime action | Worker dispatcher | Reuse existing `CapabilityInboundProcessingAction::try_from_receipt` | Add an ack enum, local retry record or delivery state |

The six existing handler methods retain the exact signatures from Step 8 §9.4. The application service bundle only supplies the six existing consumer methods; it does not change the public protocol count or add a seventh dispatch arm. `CapabilityEventCollaborationService::collaborate_captured_event` remains a separate exact-ref continuation callable and is never selected by an inbound event name.

```rust
#[async_trait::async_trait]
impl CapabilityInboundEventHandlers for CapabilityInboundEventHandlerFacade {
    // All six existing methods use the exact Step 8 signatures.
}
```

The compact skeleton fixes the Worker impl attribute only. Each of the six expanded implementation methods still requires English `///` and the exact §97.1 delegation；the comment is not a substitute for method documentation.

### 97.3 Static coverage audit

Worker composition must perform this audit before any source task is spawned:

| Audit | Required result | Failure |
|---|---:|---|
| Named source fields | 6 | `IncompleteWorkerGraph` -> `InfraError::RuntimeAssembly` |
| Consumer/family pairs | 6 unique pairs | `SourceSlotIdentityMismatch` -> `InfraError::RuntimeAssembly` |
| Logical event/schema pairs | 6 unique pairs, every schema exactly `1` | `IncompleteWorkerGraph` -> `InfraError::RuntimeAssembly` |
| Handler/application method pairs | 6 / 6 exact pairs | `MissingInboundHandlerCoverage` -> `InfraError::RuntimeAssembly` |
| Application service handles | 2 / 2 required handles | `IncompleteWorkerGraph` -> `InfraError::RuntimeAssembly` |
| Dynamic registry, wildcard, fallback arm | 0 | design/implementation gate failure |

The audit is static and startup-local. It cannot be deferred until the first message, inferred from a string, or satisfied by a no-op handler. A successful audit does not assert that any source has delivered a message; it only proves that the closed Worker graph is structurally complete.

## 98. Header-first dispatcher contract

### 98.1 Dispatcher carrier and callable

The dispatcher is Worker-owned and receives only the handler trait object. It does not own the source feed, repository, UoW, resolver, publisher or transport acknowledgement. The following declaration is Worker-private; every declaration and field is required to retain the shown English Rustdoc.

```rust
/// Worker-owned dispatcher for the six closed inbound protocol arms.
pub(crate) struct CapabilityInboundDispatcher {
    /// Complete handler trait object covering all six inbound methods.
    handlers: std::sync::Arc<dyn CapabilityInboundEventHandlers + Send + Sync>,
}

impl CapabilityInboundDispatcher {
    /// Creates a dispatcher after the six-handler coverage audit succeeds.
    pub(crate) fn from_handlers(
        handlers: std::sync::Arc<dyn CapabilityInboundEventHandlers + Send + Sync>,
    ) -> Result<Self, CapabilityWorkerCompositionError>;

    /// Dispatches one bounded encoded envelope through the fixed header-first sequence.
    pub(crate) async fn dispatch_one(
        &self,
        expected_consumer: CapabilityInboundConsumerName,
        expected_family: CapabilityInboundSourceFamily,
        trusted_actor: &CapabilityTrustedActorMatcher,
        encoded_envelope: &[u8],
    ) -> Result<CapabilityInboundProcessingAction, WorkerError>;
}
```

`dispatch_one` is an invocation boundary, not a feed polling API. The caller supplies the immutable matcher and a bounded byte slice from the selected source runner; the dispatcher never stores either value, forwards the bytes to another slot or serializes them again. The matcher is the opaque assembly-only value closed by Worker batch 2, not a repository, application Port or remote approval call. The concrete transport method that obtains the slice remains outside this callable and is a later `04` binding.

### 98.2 Fixed header-first order

Every configured and fake source must use this exact order. The order is part of the Worker design contract and cannot be rearranged to optimize a particular transport:

```text
encoded length gate
  -> borrowed RawValue header parse
  -> selected-slot consumer/family check
  -> trusted actor check
  -> source ref / idempotency key / trace / occurrence-time validation
  -> exact schema v1 check
  -> exact six-arm dispatch
  -> exact payload DTO decode from the borrowed RawValue bytes
  -> forbidden-body and envelope/payload symmetry validation
  -> CapabilityOperationContext::from_inbound_event
  -> exact CapabilityInboundEventHandlers method
  -> receipt consumer/source/effect validation
  -> CapabilityInboundProcessingAction::try_from_receipt
  -> drop borrowed header and payload bytes
```

The sequence has these mandatory consequences:

1. An oversized byte sequence is rejected before JSON parsing, allocation beyond the configured bound, application key formation, UoW creation or receipt creation.
2. Header parsing uses the existing borrowed `CapabilityInboundHeaderFirstEnvelope<'a>` and `serde_json::value::RawValue`; `serde_json::Value`, a generic map and a second header carrier are forbidden.
3. The runner's expected consumer/family pair is checked against the header. A valid envelope delivered to the wrong slot is a source-boundary failure, not a reason to reroute to another arm.
4. A trusted actor mismatch is rejected before payload decode. Topic names, credential labels and payload actor fields cannot replace the configured actor matcher.
5. An unsupported schema uses the existing header-only `UnsupportedSchema` receipt path. The payload is not decoded, no application service is called, and no Port, reservation, UoW or local effect is created.
6. Only schema `1` reaches the exact six-arm dispatch and concrete payload decode. The selected arm has one concrete payload type from Step 8; it cannot accept a neighboring payload by structural similarity.
7. Context construction uses only validated header metadata, the fixed source family, public source-event reference, source idempotency key and typed payload fields allowed by Step 13. Trace and occurrence time are propagated but do not become a new identity or digest input outside the existing canonical rules.
8. After the application call, the dispatcher validates the returned receipt and maps it through the existing processing-action mapper. It never derives `Complete`, `RetrySameEvent` or `Quarantine` from `Display`, `Debug`, issue text, HTTP status or transport timing.

### 98.3 Negative path and side-effect matrix

| Failure point | Application call | Receipt | Worker result | Side-effect rule |
|---|---:|---|---|---|
| Byte length gate | no | none | `WorkerError::Source(WorkerSourceKind::InboundEnvelope)` | no decode, reserve, UoW, ack or body log |
| Header parse / required header missing | no | none | `WorkerError::Source(WorkerSourceKind::InboundEnvelope)` | raw header/body stays out of issue ref and persistence |
| Wrong slot consumer or family | no | none | `WorkerError::Source(WorkerSourceKind::InboundEnvelope)` | no reroute and no application effect |
| Trusted actor mismatch | no | none | existing Worker source mapping | no payload decode and no external resolver call |
| Unsupported schema | no | existing header-only `UnsupportedSchema` | `Complete` after receipt validation | no payload decode, local write or application call |
| Supported payload decode failure | no | none | `WorkerError::Source(WorkerSourceKind::PayloadDecoding)` | no fabricated rejection and no blind same-bytes retry |
| Context / forbidden-body mismatch | no | none | matching Worker source mapping | no idempotency reservation or UoW |
| Application returns typed receipt | exactly one | one validated receipt | existing receipt action | no handler retry or current-truth reread |
| Application returns `ApplicationError` | exactly one | none fabricated by Worker | `WorkerError::Application` | preserve exact error; recovery remains application-owned |
| Receipt shape contradiction | exactly one | returned receipt rejected locally | `WorkerError::Source(WorkerSourceKind::InboundEnvelope)` | do not rewrite or acknowledge as success |

The `UnsupportedSchema` row is the only pre-application path that returns a typed inbound receipt. It reuses the existing contract and error mapping; this batch does not add a new receipt variant or source code.

## 99. Worker runtime factory and complete-or-error composition

### 99.1 Worker-private composition types

The Worker root owns the concrete runtime and its local composition error. These are startup-local types; neither is a public protocol, domain state or application error variant.

```rust
/// Complete Worker runtime retained after all six source slots pass composition.
pub(crate) struct CapabilityWorkerRuntime {
    /// Validated Worker loop and invocation parameters.
    parameters: CapabilityWorkerEntryParameters,
    /// Header-first dispatcher covering all six inbound handler arms.
    dispatcher: std::sync::Arc<CapabilityInboundDispatcher>,
    /// Unstarted exact-ref collaboration continuation seed retained through source composition.
    event_collaboration: CapabilityWorkerContinuationSeed,
    /// Governance source runner, or `None` only for an explicit Disabled decision.
    governance_result_reference_changed: Option<CapabilityInboundSourceRunner>,
    /// Method-library source runner, or `None` only for an explicit Disabled decision.
    method_asset_reference_changed: Option<CapabilityInboundSourceRunner>,
    /// Downstream impact source runner, or `None` only for an explicit Disabled decision.
    downstream_consumption_impact_reported: Option<CapabilityInboundSourceRunner>,
    /// External capability-source runner, or `None` only for an explicit Disabled decision.
    external_capability_source_reference_changed: Option<CapabilityInboundSourceRunner>,
    /// Audit-material source runner, or `None` only for an explicit Disabled decision.
    audit_material_reference_changed: Option<CapabilityInboundSourceRunner>,
    /// External-document source runner, or `None` only for an explicit Disabled decision.
    external_document_reference_changed: Option<CapabilityInboundSourceRunner>,
}

/// Worker boundary that requires an owned invocation to survive observation timeout.
pub(crate) enum CapabilityWorkerNonCancellingBoundary {
    /// One admitted inbound delivery dispatched to its exact application consumer.
    InboundApplicationInvocation,
    /// One caller-supplied exact capture reference delegated to event collaboration.
    EventCollaborationContinuation,
}

/// Worker runtime primitive required before source or continuation work may start.
pub(crate) enum CapabilityWorkerRuntimePrimitive {
    /// Shared cooperative stop event for source and continuation admission.
    StopSignal,
    /// Shared release-or-abort barrier for all enabled named source tasks.
    ActivationBarrier,
    /// Global permit gate for independent source deliveries and exact-ref continuations.
    IndependentItemPermitGate,
}

/// Worker-private runtime failure before a boundary owner selects its stable classification.
pub(crate) struct CapabilityWorkerRuntimeFailure {
    /// Optional runtime cause retained only in the process-local source chain.
    source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
}

impl CapabilityWorkerRuntimeFailure {
    /// Creates one runtime failure from an optional nonpublic concrete cause.
    pub(crate) fn new(
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Consumes the wrapper and returns its optional nonpublic concrete cause.
    pub(crate) fn into_source(
        self,
    ) -> Option<Box<dyn std::error::Error + Send + Sync + 'static>>;
}

/// One exact failure observed while rolling back a parked Worker startup prefix.
pub(crate) enum CapabilityWorkerStartupCleanupCause {
    /// A prepared or spawned source feed could not be stopped after activation abort.
    SourceStop {
        /// Closed source slot whose stop-only feed authority failed.
        slot: CapabilityInboundSourceSlot,
        /// Exact source-call failure returned by the product-neutral stop boundary.
        source: CapabilitySourceFailure,
    },
    /// A parked source task returned an exact Worker error while being joined.
    TaskJoinWorker {
        /// Closed source slot whose parked task returned the error.
        slot: CapabilityInboundSourceSlot,
        /// Exact existing Worker error returned by the parked task.
        source: WorkerError,
    },
    /// The runtime could not join one parked source task after activation abort.
    TaskJoinRuntime {
        /// Closed source slot whose parked task could not be joined.
        slot: CapabilityInboundSourceSlot,
        /// Optional nonpublic runtime cause retained only in the startup source chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
}

/// Typed startup aggregate preserving the original failure and every cleanup cause.
pub(crate) struct CapabilityWorkerStartupCleanupFailure {
    /// Exact pre-cleanup composition failure that triggered activation abort.
    original: Box<CapabilityWorkerCompositionError>,
    /// Non-empty cleanup causes in fixed source-slot and stop-before-join order.
    cleanup_causes: Vec<CapabilityWorkerStartupCleanupCause>,
}

impl CapabilityWorkerStartupCleanupFailure {
    /// Returns the exact composition failure that triggered startup rollback.
    pub(crate) fn original(&self) -> &CapabilityWorkerCompositionError;

    /// Returns every cleanup cause without changing deterministic observation order.
    pub(crate) fn cleanup_causes(&self) -> &[CapabilityWorkerStartupCleanupCause];

    /// Consumes the aggregate without discarding the original or any cleanup cause.
    pub(crate) fn into_parts(
        self,
    ) -> (
        CapabilityWorkerCompositionError,
        Vec<CapabilityWorkerStartupCleanupCause>,
    );
}

/// Startup-local failure while composing or starting a complete Worker runtime.
pub(crate) enum CapabilityWorkerCompositionError {
    /// The handoff contains a non-Worker parameter variant or invalid Worker parameters.
    EntryParametersMismatch,
    /// A named source slot does not match its fixed consumer/family/schema contract.
    SourceSlotIdentityMismatch {
        /// Closed consumer whose identity failed the static audit.
        consumer: CapabilityInboundConsumerName,
    },
    /// A required inbound handler arm is absent from the concrete facade.
    MissingInboundHandlerCoverage {
        /// Closed consumer whose handler arm is absent.
        consumer: CapabilityInboundConsumerName,
    },
    /// A configured or fake source could not be converted into a complete runner.
    IncompleteSourceRunner {
        /// Closed consumer whose runner construction failed.
        consumer: CapabilityInboundConsumerName,
    },
    /// A Disabled source unexpectedly retained a resolved child handle.
    DisabledSourceHasRuntimeHandle {
        /// Closed consumer whose disabled binding is not empty.
        consumer: CapabilityInboundConsumerName,
    },
    /// The named runner, task, or continuation graph is not statically complete.
    IncompleteWorkerGraph,
    /// The selected Worker runtime cannot retain an admitted invocation after observation timeout.
    NonCancellingRuntimeUnsupported {
        /// Exact Worker invocation boundary whose ownership guarantee is unavailable.
        boundary: CapabilityWorkerNonCancellingBoundary,
    },
    /// The selected Worker runtime could not provide one required ownership primitive.
    RuntimePrimitiveUnavailable {
        /// Exact runtime primitive that could not be constructed.
        primitive: CapabilityWorkerRuntimePrimitive,
        /// Optional runtime-local construction cause retained only in the startup source chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// The selected async runtime failed to start one named source task.
    TaskStartFailed {
        /// Closed consumer whose source task could not be started.
        consumer: CapabilityInboundConsumerName,
        /// Optional runtime-local spawn cause retained only in the startup source chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// Startup rollback encountered at least one stop or join failure after a start failure.
    StartupCleanupFailed {
        /// Typed private aggregate retaining the original failure and all cleanup causes.
        failure: CapabilityWorkerStartupCleanupFailure,
    },
}

impl CapabilityWorkerCompositionError {
    /// Attaches ordered startup cleanup causes, or returns the original error when none exist.
    pub(crate) fn with_ordered_startup_cleanup_causes(
        self,
        cleanup_causes: Vec<CapabilityWorkerStartupCleanupCause>,
    ) -> Self;
}

impl CapabilityWorkerRuntime {
    /// Consumes one complete Worker handoff and constructs the all-or-error runtime.
    pub(crate) fn from_handoff(
        handoff: CapabilityWorkerEntryHandoff,
        task_spawner: std::sync::Arc<dyn CapabilityWorkerTaskSpawner + Send + Sync>,
    ) -> Result<Self, CapabilityWorkerCompositionError>;
}
```

`CapabilityInboundSourceRunner` is a Worker-private runtime object created by the six named factory arms. This sentence records the Worker batch 1 boundary: its internal feed operation was deliberately deferred there. Worker batch 2 §§103~106 now closes the transport-neutral feed, matcher, owned delivery, completion, activation and task lifecycle without turning any of them into a public protocol or application Port.

`with_ordered_startup_cleanup_causes` is the only constructor path for `StartupCleanupFailed`. An empty cleanup vector returns the original composition error unchanged. A non-empty vector wraps the exact original once;calling it on an existing aggregate appends later causes without nesting or reordering. `cleanup_causes` is therefore always non-empty, and no accessor can consume only the original while silently dropping cleanup diagnostics. Source-stop causes retain exact `CapabilitySourceFailure` values;parked-task joins retain either the exact `WorkerError` or the runtime join cause. Source-stop causes are collected across all prepared named feeds before any task-join cause;within each phase,slots remain in the fixed six-slot order. The startup-specific cause enum deliberately has no continuation variant because the continuation runtime cannot become externally callable before activation release.

### 99.2 Exact factory sequence

`CapabilityWorkerRuntime::from_handoff` must execute the following sequence and cannot return a prefix of the result:

```text
receive one Worker-local runtime supervisor selected by the binary composition root
  -> prove it supports non-cancelling inbound and continuation boundaries
  -> consume handoff.into_parts()
  -> validate Worker parameter wrapper and positive bounds
  -> ask the same supervisor for one global independent-delivery permit driver
     -> failure: RuntimePrimitiveUnavailable { IndependentItemPermitGate, exact private source }
  -> construct one global permit gate around that driver
  -> construct CapabilityInboundEventHandlerFacade from inbound_consumer handle
  -> audit the six exact handler methods
  -> construct CapabilityInboundDispatcher
  -> consume governance source input and build its named runner or preserve Disabled
  -> consume method source input and build its named runner or preserve Disabled
  -> consume downstream source input and build its named runner or preserve Disabled
  -> consume external-capability source input and build its named runner or preserve Disabled
  -> consume audit source input and build its named runner or preserve Disabled
  -> consume external-document source input and build its named runner or preserve Disabled
  -> verify every enabled slot has one runner and every Disabled slot has none
  -> construct CapabilityWorkerContinuationSeed from the exact collaboration service,
     collaboration_call_timeout,the same global permit gate and the same supervisor Arc
  -> return CapabilityWorkerRuntime
```

The six source constructors are not a dynamic loop. The implementation may share a private construction helper only if each call site remains a named, statically visible arm with its own expected consumer, family, schema and application method. A helper taking a string, `Vec`, map or wildcard matcher fails the design gate.

### 99.3 Startup error mapping

The Worker root returns `CapabilityWorkerCompositionError` only inside composition. The host/bootstrap boundary performs a one-way mapping:

```rust
/// Maps a Worker composition failure to the existing startup-owned infrastructure error.
pub(crate) fn map_worker_composition_error(
    error: CapabilityWorkerCompositionError,
) -> InfraError;
```

The mapper retains the local error as a non-public source chain under the existing `InfraError::RuntimeAssembly` variant. It does not produce `WorkerError`, an inbound receipt, an application issue, a job report or a transport response. Once `CapabilityWorkerRuntime` is returned, later malformed input or application failure uses `WorkerError`; startup and invocation ownership must not be conflated.

### 99.4 Runtime ownership and continuation boundary

| Runtime object | Owner | Receives | May do | Must not do |
|---|---|---|---|---|
| `CapabilityWorkerRuntime` | Worker root | typed parameters, dispatcher, six named runners, unstarted collaboration continuation seed | retain complete pre-start state and transfer all source/continuation ownership into one task set | read config, discover adapters, own repositories or create local delivery state |
| `CapabilityInboundSourceRunner` | Worker root / selected transport binding | one resolved feed,its immutable matcher,one static slot,shared dispatcher,body/batch/deadline bounds and global permit gate | obtain one bounded encoded envelope and invoke `dispatch_one`;the owning task loop reads its batch limit | access the task spawner,spawn work,decode through a generic DTO,reroute slot,write truth or invent ack semantics |
| `CapabilityInboundDispatcher` | Worker root | bounded bytes and expected slot identity | header-first decode, exact handler call, receipt/action mapping | poll source, acknowledge transport, scan capture, call resolver or publisher |
| `event_collaboration` seed / started continuation runtime | Worker root + application facade | one caller-supplied exact `CapabilityEventCaptureRef`, existing facade, typed timeout and shared permit gate | retain the facade across start, supervise one non-cancelling exact-ref call and drain it at shutdown | scan captures, create an autonomous publisher task, choose route, retry with a new ref or own UoW |

The physical feed's acknowledgement or lease operation is a host/transport concern. The runtime may expose a product-neutral processing action to that host, but the action is not a durable Capability Hub state and cannot be stored as a local delivery record.

## 100. Configured/Fake/Disabled parity and failure ownership

### 100.1 Three binding branches

| Branch | Startup construction | Invocation path | Absence / failure rule |
|---|---|---|---|
| `Configured` | Resolve feed and trusted actor for the exact named slot; construct one runner before task spawn | Same byte gate, borrowed header, slot/family/actor/schema checks, exact payload decode and application call | Resolution or construction failure blocks the whole Worker graph as `InfraError::RuntimeAssembly` |
| `DeterministicFake` | Resolve a typed encoded-envelope fixture for the exact slot; construct the same runner boundary | Same encoded bytes, same negative cases, same handler and receipt/action mapping | Fake is allowed only in approved Local/Integration profiles; it cannot bypass the dispatcher or claim external truth |
| `Disabled` | Keep an explicit disabled decision and no child feed/actor/fixture handle | No task, fetch, decode, application call, receipt, action, ack or offset advancement | Disabled is complete intentional absence; it is not `NotConfigured` success and not a fallback to fake |

Configured and fake branches may share an underlying implementation only when the observed boundary remains the same. A fake that accepts a preconstructed payload, skips the byte limit, changes actor validation or returns a fabricated successful receipt is not parity-compliant.

### 100.2 Failure owner matrix

| Condition | Owner | Exact surface | Required behavior |
|---|---|---|---|
| Missing Worker service handle or wrong entry variant | startup composition | `InfraError::RuntimeAssembly` | no handler, runner or task escapes |
| Missing/wrong-family source binding or resolved capability | startup composition | `InfraError::RuntimeAssembly` | no partial six-slot graph; explicit Disabled is the only intentional absence |
| Runner/factory construction failure | startup composition | `InfraError::RuntimeAssembly` | discard all already-built runners; do not start remaining tasks |
| Oversized/malformed/wrong-slot/actor-invalid envelope | Worker ingress | `WorkerError::Source` with existing `WorkerSourceKind` | no application call, no fabricated receipt, no raw body persistence |
| Unsupported schema `!= 1` after valid header | Worker ingress | existing header-only `UnsupportedSchema` receipt -> `Complete` | no payload decode, reservation, UoW or application call |
| Exact supported payload/application dispatch | application facade | existing `CapabilityInboundEventReceipt` or `ApplicationError` | call one exact method; preserve typed result/error |
| Application error after dispatch | Worker wrapper | `WorkerError::Application { source }` | preserve exact `ApplicationError`; Worker does not classify retryability |
| Receipt identity/effect mismatch | Worker ingress | `WorkerError::Source` | do not rewrite, acknowledge as success or call another handler |
| Physical acknowledgement or response timeout | host transport | transport-specific observation boundary | never change receipt, application truth, key, source identity or local state |

`WorkerError::Source` and `WorkerError::Application` retain the existing two-variant wrapper. No new Worker error variant is introduced by this batch. `RetrySameEvent` is produced only by the existing typed receipt disposition mapper; a plain `WorkerError` does not authorize an unbounded redelivery loop, and `CommitOutcomeUnknown` remains under application/authority recovery rather than transport guesswork.

### 100.3 Exact capture-ref continuation rule

The separate event-collaboration path uses the already declared `continue_captured_event(capture_ref)` callable. Worker may receive an exact ref selected after the source-owning application transaction commits, call `CapabilityEventCollaborationService::collaborate_captured_event` once, and map an application error through `WorkerError::from_application`. It may not scan `AwaitingIntent`, rebuild a candidate, access `CapabilityAccessEventCollaborationPort`, create a local outbox/relay/DLQ, or replace the ref after timeout. Deferred recovery remains the existing application Job boundary.

## 101. Cross-step closure, historical audit and batch stop review

### 101.1 Cross-step closure

| Upstream seam | Worker batch 1 result | Status |
|---|---|---|
| Step 5 module boundary | Worker owns consumer/loop/continuation composition; application owns service traits; infra owns raw config and resolved binding | closed |
| Step 7 Port boundary | Worker receives no repository, UoW, resolver, publisher, Clock, IdGenerator or application Port | closed |
| Step 8 six Inbound protocols | Six named fields map 1:1 to consumer, family, schema `1`, payload, handler and application method | `6/6` |
| Step 9 inbound flows | Header-first worker work ends at exact application call and typed receipt; local truth and transaction remain application-owned | `6/6` |
| Step 9 capture continuation | Worker accepts only an exact committed capture ref and calls the existing collaboration facade | `1/1` |
| Step 12 error model | Startup failures map to `InfraError::RuntimeAssembly`; invocation source/application failures retain `WorkerError` variants | closed |
| Step 13 identity/replay | Transport metadata never forms source identity/key/digest; duplicate uses existing typed receipt replay | closed |
| Step 14 dependency direction | `infra -> worker` remains `0`; Worker consumes neutral handoff and owns its factory | closed |

No application Port, public protocol, domain object, persisted state, receipt disposition or `ApplicationError` variant was added. The assembly carrier and Worker-private composition types are implementation-boundary material only.

### 101.2 Historical material and blocker audit

| Item | Status | Current treatment |
|---|---|---|
| Old provider/runtime/tools execution gateway | `historical_material` | Worker only consumes body-free inbound references and typed downstream impact; it does not execute capabilities or tools |
| Governance approval / policy engine | `historical_material` | Governance source actor and result reference do not approve, vote, activate or mutate governance truth |
| Method-library body / SDK client / marketplace listing | `historical_material` | Method/document inputs remain body-free; no SDK client, package cache or listing state enters Worker |
| Local outbox / relay / DLQ / delivery state | `excluded` | Worker has no capture scan, local delivery lifecycle or second queue authority |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | `non_blocking` | Existing authorized `IdempotencyKey::as_str().as_bytes()` assumption remains; semantic change reopens Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | `non_blocking` | Worker uses the existing borrowed header contract; shared serde shape changes reopen Step 8/14 |
| unresolved upstream blocker | `none` | No new Port, public schema, sibling Cargo edge or upstream truth decision is required for this batch |

### 101.3 Rustdoc and structure-comment audit

| Declaration group in this batch | Required documentation | Result |
|---|---|---|
| `CapabilityWorkerApplicationServices` and two fields | English `///` on struct and every field | pass |
| `CapabilityWorkerApplicationServices` constructor/accessors | English `///` on all three callables | pass |
| `CapabilityWorkerEntryHandoff` and eight fields | English `///` on struct and every field | pass |
| Handoff constructor, parameter accessor and consuming accessor | English `///` on all three callables | pass |
| `CapabilityResolvedInboundSource` and all variant/payload fields | English `///` on enum, variants and payload fields | pass |
| `CapabilityInboundDispatcher` and field/callables | English `///` on struct, field and both callables | pass |
| `CapabilityWorkerRuntime` and nine fields | English `///` on struct and every field | pass |
| `CapabilityWorkerCompositionError` and variant/payload fields | English `///` on enum, every variant and payload field | pass |
| runtime factory and composition mapper | English `///` on each callable | pass |
| opaque feed/matcher historical deferral | Worker batch 1 marked them assembly-only; Worker batch 2 §§103~106 now closes their exact wrappers, fields and callables | closed; no undocumented public protocol claim |

No struct field is left under an “同上” comment. The `CapabilityResolvedInboundSource` child handle names are intentionally marked as assembly-only concepts; they are not evidence that a transport API, external Port or concrete implementation already exists.

### 101.4 Formal `03` §13 assembly source

Step 19 may use the following Worker-specific material when assembling formal §13. It is not a modification of the formal document in this batch:

```markdown
### 13.8 Worker composition and inbound boundary

`infra` validates the six closed inbound source bindings, resolves configured/fake source capabilities and trusted-actor matchers, constructs the two required application service handles, and emits one non-cloneable Worker handoff. The handoff contains validated Worker parameters and six statically named source inputs; it contains no raw config/ref, secret, endpoint, repository, UoW, resolver, publisher or application Port.

The Worker root consumes that handoff exactly once. It owns the six-arm `CapabilityInboundEventHandlers` facade, header-first dispatcher, source runners, receipt-to-`Complete`/`RetrySameEvent`/`Quarantine` mapping and exact capture-ref continuation. The fixed order is byte gate, borrowed header parse, slot/family gate, trusted actor gate, header validation, schema check, exact arm dispatch, payload decode, context mapping, exact application method, receipt validation and processing-action mapping.

Configured and deterministic-fake sources use the same encoded-envelope and negative-path contract. An explicit Disabled slot creates no runner, task, receipt or acknowledgement. Any missing service, enabled-source resolution failure, wrong slot identity or runner construction failure prevents task start and maps to `InfraError::RuntimeAssembly`; invocation failures retain the existing `WorkerError` source/application boundary. Worker does not execute runtime/tools capabilities, own governance approval, import method bodies, publish through a local outbox or own marketplace/SDK state.
```

### 101.5 Batch completion gate and stop snapshot

| Gate | Result | Evidence in this calibration file |
|---|---|---|
| Worker service bundle is exactly two required application handles | pass | §96.1 |
| Handoff is one-shot, non-cloneable and free of raw config / forbidden dependencies | pass | §§96.3~96.5 |
| Six source slots remain named and closed | pass; `6/6` | §97.1 |
| Header-first sequence and negative paths are exact | pass | §98.2~§98.3 |
| Worker root owns factory and no `infra -> worker` edge is introduced | pass | §§99.1~99.4 |
| Configured/Fake/Disabled parity | pass | §100.1 |
| Startup versus invocation error ownership | pass | §100.2 |
| Capture-ref continuation remains facade-only | pass | §100.3 |
| Runtime execution/tools/marketplace/governance approval/method body/SDK boundary | pass | §101.2 and formal source |
| Structure comments / English Rustdoc | pass | §101.3 |
| Formal `03` modified | no; unchanged | artifact discipline preserved |
| Implementation ledger / boundary skeleton created | no | reserved for `07-实施计划.md` |
| Tests, run IDs, evidence aliases or sign-off claimed | no | none produced or claimed |
| Unresolved upstream blocker | none | §101.2 |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.2.2.2 Worker batch 1
gate_status = Worker_batch_1_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
worker_service_handles = 2/2
worker_named_source_slots = 6/6
worker_handler_application_mappings = 6/6
worker_processing_actions = 3_existing_actions
infra_to_worker_cargo_edges = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_2_2_2_worker_batch_2
```

Worker batch 1 在此停审。未经用户确认，不进入 Worker batch 2、Jobs composition、`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15或正式 `03` 装配。

## 102. Batch `14.5.2.2.2` Worker batch 2 开工确认与闭口裁决

### 102.1 授权、恢复点与本批范围

用户已明确回复“继续”，允许从 Worker batch 1 停审点进入本批。本批只闭合 batch 1 延后的 neutral feed handle、trusted-actor matcher、bounded encoded envelope、transport-private delivery ownership、one-delivery runner result、source task start/stop/shutdown 和 partial-start failure 语义。本批不进入 Jobs composition、`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15 或正式 `03` 装配。

| 项目 | 本批裁决 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前子批 | `14.5.2.2.2 Worker batch 2` |
| 直接上游 | Worker batch 1 §§95~101；Step 8 six Inbound protocol cards；Step 9 six Inbound flows；Step 12 `WorkerError`；Step 13 event identity / replay；Step 14 §§23~29、47~50、75~85 |
| 必须闭合 | cycle-free neutral runtime boundary、single owned delivery、bounded bytes、exact actor gate、`dispatch_one` invocation、existing action return、source task lifecycle、shutdown、startup rollback、Configured/Fake/Disabled parity |
| 保持不变 | 2 application handles、6 named source slots、schema `1`、7 receipt dispositions、3 existing processing actions、2 `WorkerError` variants、36 Ports、83 protocols / flows |
| 明确后移 `04` | concrete broker/API library、fetch/ack/release/quarantine method names、topic/group/subscription、lease/offset/checkpoint、timeout/backoff数值、shutdown grace数值 |
| artifact discipline | 只修改本 Step 中间产物和 flow/ledger；不修改正式 `03`，不创建 `04`、implementation ledger、planned boundary skeleton、实现代码或测试证据 |

### 102.2 Batch 1 已知笔误修正

Batch 1 §101.3 曾把 `CapabilityWorkerRuntime` 误记为 seven fields。其声明实际包含 `parameters`、`dispatcher`、`event_collaboration` 和六个 named source runner，共 **nine fields**。本批开工前已将审计行修正为 nine fields；该修正不改变结构、cardinality、owner 或 runtime 行为。

### 102.3 旧概念性 handle 的闭口问题

| Batch 1 概念 | 未闭合问题 | 本批最终处理 |
|---|---|---|
| `CapabilityEncodedEnvelopeFeed` | 只有名字，无法判断跨 crate owner、object safety、fetch failure 与 shutdown 行为 | 定义为 `infra` 暴露的 assembly-only opaque wrapper；内部持有 infra-private driver trait object，Worker只能调用受控方法 |
| `CapabilityTrustedActorMatcher` | 未定义输入、失败与 source-kind 附加约束 | 定义为 `infra` 暴露的 immutable matcher wrapper；输入只来自 borrowed header / decoded source-kind，返回 closed match decision，不执行I/O |
| encoded envelope + delivery handle | 未固定 bytes 与 delivery 的同生共死、是否可 clone、何时释放 | 定义一个 non-cloneable `CapabilityInboundDelivery`，同时拥有 bounded bytes和opaque transport-private completion handle |
| runner one-delivery result | 未说明 Worker如何把 processing action交回physical transport owner | 定义 Worker-owned non-persisted `CapabilityInboundDeliveryOutcome`；只携带原delivery ownership和existing processing action，再调用infra delivery的三个消费式完成方法 |
| task lifecycle | 未说明六任务如何原子启动、停止和回收 | 定义 prepare-all / start-all / shutdown-all 顺序；任何 start failure立即触发全组stop/join，不返回partial running runtime |

### 102.4 采用方案与依赖方向证明

| 方案 | 依赖方向 | 主要问题 | 结论 |
|---|---|---|---|
| Worker 定义 feed trait，infra 实现 | 需要 `infra -> worker` | 违反 member matrix并让infra依赖entry语义 | 拒绝 |
| application / contracts 定义 feed Port | 可编译 | 把transport消费提升为application Port或public protocol，污染36-Port / 250-type基线 | 拒绝 |
| Worker接收 concrete infra adapter / raw driver | `worker -> infra` | 泄漏产品类型、endpoint/credential或driver方法；Worker可绕过中立边界 | 拒绝 |
| `infra` 定义 assembly-only opaque wrappers，内部driver保持crate-private，Worker只调用wrapper methods | `worker -> infra` | 需要明确wrapper不构成Port/协议且不暴露driver downcast | 采用 |

最终 owner 固定为：

```text
infra/config.rs
  -> validate source refs and profile
infra/source_resolvers.rs
  -> build private concrete feed / actor drivers
infra/runtime_builder.rs
  -> erase drivers behind public assembly-only opaque wrappers
  -> produce CapabilityWorkerEntryHandoff
worker composition root
  -> consume handoff
  -> build six named CapabilityInboundSourceRunner values
  -> call only opaque wrapper methods
host transport adapter
  -> privately map processing action or technical failure to physical completion
```

`infra`仍不依赖`worker`；`worker`可按 `14.5.1` 已批准的方向依赖`infra`。Opaque wrapper不暴露concrete driver type、endpoint、credential、topic、group、subscription、offset、lease、attempt或downcast入口，也不允许Worker注册新driver。

## 103. Neutral feed、matcher 与 delivery carrier 的 exact Rust 契约

### 103.1 Visibility、owner 与声明分类

除后续 §104 明确归 Worker 的 outcome / runner / task types 外，本节声明归 `crates/infra/src/source_resolvers.rs` 或由该模块从 `infra::lib` 受控导出。它们是 **Rust assembly/runtime capability values**，不是 network protocol、application Port、domain object、repository、business state或persisted delivery record，不计入 Step 6 / Step 7 / Step 8 基线。

| 声明 | 对 Worker visibility | infra 内部实现 | Clone / Serialize / downcast |
|---|---|---|---|
| `CapabilityEncodedEnvelopeFeed` | `pub` opaque struct，字段private | 持有一个infra-private fetch driver、closed end policy和并发安全stop handle | no / no / no |
| `CapabilityEncodedEnvelopeFeedStop` | `pub` opaque stop handle，字段private | 持有一个infra-private concurrent stop driver；只能停止新fetch | explicit handle duplication only / no / no |
| `CapabilityTrustedActorMatcher` | `pub` opaque immutable struct，字段private | 持有已编译的actor acceptance material；不保留secret正文 | no by default / no / no |
| `CapabilityInboundDelivery` | `pub` opaque one-delivery value，字段private | owned bytes + one transport-private completion handle | no / no / no |
| `CapabilitySourceFetch` | `pub` assembly-only fetch result | one delivery or clean end-of-source | no / no / no |
| `CapabilitySourceFailure` | `pub` closed source-call category + private source chain | driver error is preclassified without text parsing | no / no / no |

The async representation in this subsection is already exact. Infra-private driver traits whose methods explicitly return `Pin<Box<dyn Future + Send + '_>>` retain those written signatures；they are not converted to native async traits or `async-trait`. All Step 7 / Step 8 native async trait declarations and corresponding application/infra/API/Worker/Jobs impls instead use the fixed `#[async_trait::async_trait]` lowering from §36.2. Neither form may change callable names、ownership、`Send` requirements、return semantics or the no-clone delivery rule.

### 103.2 Closed source failure category

```rust
/// Assembly-only source-call failure category independent of any transport product.
pub enum CapabilitySourceFailureKind {
    /// The source cannot currently produce or complete a delivery.
    TemporarilyUnavailable,
    /// The source operation exceeded its configured transport observation budget.
    Timeout,
    /// The source returned an invalid or internally contradictory delivery shape.
    InvalidDelivery,
    /// The source driver failed without a more specific safe classification.
    UnexpectedSourceFailure,
}

/// Assembly-only source-call failure with an optional nonpublic concrete cause.
pub struct CapabilitySourceFailure {
    /// Closed failure category selected by the concrete source adapter.
    kind: CapabilitySourceFailureKind,
    /// Optional concrete cause retained only in the process-local error chain.
    source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
}

impl CapabilitySourceFailure {
    /// Creates one source-call failure from an explicit closed category and optional private cause.
    pub(crate) fn new(
        kind: CapabilitySourceFailureKind,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Returns the closed source-call failure category without exposing the concrete cause.
    pub fn kind(&self) -> &CapabilitySourceFailureKind;
}
```

The four variants are **not** a new application error or processing disposition. They classify only source fetch/completion technical calls. A configured adapter must select the variant by a typed driver result; it cannot parse `Display`, `Debug`, status text, exception text or elapsed time after the fact. `NotConfigured` is absent because an enabled source must be fully resolved at startup and `Disabled` has no feed. Permanent configuration incompatibility is a startup `InfraError::RuntimeAssembly`, not an invocation source failure.

`CapabilitySourceFailure` implements `std::error::Error`;its `Display` surface renders only the closed failure kind, while `Error::source()` exposes the optional concrete cause only to the process-local chain. It does not expose endpoint, credential, topic, group, subscription, offset, lease, encoded bytes or raw product text.

### 103.3 Opaque feed handle and fetch result

```rust
/// Infra-private async fetch driver for one serialized encoded-envelope cursor.
pub(crate) trait CapabilityEncodedEnvelopeFeedDriver: Send {
    /// Fetches one complete delivery or reports the driver's physical source end.
    fn fetch_one<'a>(
        &'a mut self,
        maximum_encoded_bytes: usize,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = Result<CapabilitySourceFetch, CapabilitySourceFailure>,
                > + Send
                + 'a,
        >,
    >;
}

/// Infra-private concurrent stop driver shared by one feed and its stop-only handles.
pub(crate) trait CapabilityEncodedEnvelopeFeedStopDriver: Send + Sync {
    /// Requests idempotent stop and wakes a fetch that has not yielded a delivery.
    fn request_stop<'a>(
        &'a self,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), CapabilitySourceFailure>> + Send + 'a>,
    >;

    /// Returns whether this driver has observed a controlled stop request.
    fn is_stop_requested(&self) -> bool;
}

/// Infra-private end-of-source policy fixed when one feed is resolved.
pub(crate) enum CapabilityEncodedEnvelopeFeedEndPolicy {
    /// Only deterministic fixture exhaustion may end without a source failure.
    FiniteDeterministicFixture,
    /// A configured deployment source is continuous until controlled stop.
    ContinuousConfiguredSource,
}

/// Opaque concurrent stop handle for one fixed encoded-envelope feed.
pub struct CapabilityEncodedEnvelopeFeedStop {
    /// Infra-private stop driver shared with exactly one resolved feed.
    driver: std::sync::Arc<dyn CapabilityEncodedEnvelopeFeedStopDriver + Send + Sync>,
}

impl CapabilityEncodedEnvelopeFeedStop {
    /// Creates one stop handle from an already resolved infra-private stop driver.
    pub(crate) fn from_driver(
        driver: std::sync::Arc<dyn CapabilityEncodedEnvelopeFeedStopDriver + Send + Sync>,
    ) -> Self;

    /// Creates another handle to the same idempotent stop authority.
    pub fn duplicate_handle(&self) -> Self;

    /// Requests idempotent stop without completing or discarding an owned delivery.
    pub async fn request_stop(&self) -> Result<(), CapabilitySourceFailure>;

    /// Returns whether controlled stop has already been requested locally.
    pub fn is_stop_requested(&self) -> bool;
}

/// Opaque assembly-only handle for one fixed encoded-envelope source.
pub struct CapabilityEncodedEnvelopeFeed {
    /// Infra-private source driver erased before the Worker handoff is produced.
    driver: Box<dyn CapabilityEncodedEnvelopeFeedDriver + Send>,
    /// Closed rule distinguishing deterministic exhaustion from configured-source failure.
    end_policy: CapabilityEncodedEnvelopeFeedEndPolicy,
    /// Concurrent stop authority shared with the owning Worker source task handle.
    stop: CapabilityEncodedEnvelopeFeedStop,
}

/// Result of one source fetch without exposing transport cursor or lease metadata.
pub enum CapabilitySourceFetch {
    /// One owned encoded-envelope delivery is ready for Worker processing.
    Delivery(
        /// Non-cloneable delivery containing bounded bytes and its private completion handle.
        CapabilityInboundDelivery,
    ),
    /// The deterministic fixture is exhausted or controlled source stop completed.
    EndOfSource,
}

impl CapabilityEncodedEnvelopeFeed {
    /// Creates an opaque feed from one already resolved infra-private source driver.
    pub(crate) fn from_driver(
        driver: Box<dyn CapabilityEncodedEnvelopeFeedDriver + Send>,
        end_policy: CapabilityEncodedEnvelopeFeedEndPolicy,
        stop: CapabilityEncodedEnvelopeFeedStop,
    ) -> Self;

    /// Returns another handle to this feed's idempotent stop authority.
    pub fn stop_handle(&self) -> CapabilityEncodedEnvelopeFeedStop;

    /// Fetches at most one owned bounded delivery for the fixed source slot.
    pub async fn fetch_one(
        &mut self,
        maximum_encoded_bytes: usize,
    ) -> Result<CapabilitySourceFetch, CapabilitySourceFailure>;

    /// Requests idempotent source stop without completing or discarding an in-flight delivery.
    pub async fn request_stop(&self) -> Result<(), CapabilitySourceFailure>;
}
```

`CapabilityEncodedEnvelopeFeedDriver` is infra-private and is intentionally not exported from `infra::lib`;Worker cannot name, implement, register or downcast it. `fetch_one` takes `&mut self`, so one named runner has one serialized source cursor. Parallelism is applied only after separate deliveries have been detached into owned `CapabilityInboundDelivery` values; the same feed cannot issue two mutable fetch operations concurrently unless a later product binding proves an internal single-cursor implementation that still presents this exact serialized wrapper surface.

The driver's raw physical-end result is not authoritative by itself. The wrapper checks `CapabilityEncodedEnvelopeFeedEndPolicy` and `CapabilityEncodedEnvelopeFeedStopDriver::is_stop_requested()` before exposing `CapabilitySourceFetch::EndOfSource`;this is where an unexpected configured-source end is converted to `UnexpectedSourceFailure`. A driver cannot bypass that check by manufacturing a different wrapper or returning a pre-decoded payload.

`maximum_encoded_bytes` is copied from `CapabilityWorkerEntryParameters::inbound_body_limit()` and is a **construction guard**, not permission for the feed to truncate. A delivery whose full encoded envelope exceeds the bound must be returned as `InvalidDelivery` or an adapter-owned equivalent that maps to existing Worker source failure;the driver must never return a prefix. Worker repeats the independent exact length gate before header decode, preserving defense in depth.

`CapabilityEncodedEnvelopeFeedStop` is the only intentionally duplicable source handle. Duplicating it does not duplicate the feed cursor, encoded bytes, delivery, completion authority or transport lease. It exists so the task set can wake an in-progress fetch during shutdown while the source task retains exclusive `&mut CapabilityEncodedEnvelopeFeed` ownership. `request_stop` may interrupt or unblock a fetch that has not yielded a delivery; once a `CapabilityInboundDelivery` exists, stop cannot consume or complete it.

`EndOfSource` is legal only in two cases: a `FiniteDeterministicFixture` exhausted its declared fixture sequence, or either policy observed an idempotent controlled stop request. If a `ContinuousConfiguredSource` driver ends without controlled stop, `CapabilityEncodedEnvelopeFeed::fetch_one` converts that driver result to `CapabilitySourceFailureKind::UnexpectedSourceFailure`; it never returns `EndOfSource`. Temporary unavailability, timeout, credential failure and malformed transport data likewise use their typed failure categories. Legal `EndOfSource` stops that source task without producing a receipt, processing action, acknowledgement or local state.

### 103.4 Bounded delivery ownership

```rust
/// Infra-private one-delivery completion driver consumed by exactly one terminal operation.
pub(crate) trait CapabilityInboundDeliveryCompletion: Send {
    /// Completes one delivery after an existing action selected normal processing completion.
    fn complete_processing(
        self: Box<Self>,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), CapabilitySourceFailure>> + Send>,
    >;

    /// Requests physical handling of the exact same event without changing its identity.
    fn retry_same_event(
        self: Box<Self>,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), CapabilitySourceFailure>> + Send>,
    >;

    /// Isolates one delivery from automatic replay after the existing action selects quarantine.
    fn quarantine(
        self: Box<Self>,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), CapabilitySourceFailure>> + Send>,
    >;
}

/// Non-cloneable ownership unit for one bounded encoded inbound delivery.
pub struct CapabilityInboundDelivery {
    /// Complete encoded envelope bytes bounded before the handoff to Worker decoding.
    encoded_envelope: Box<[u8]>,
    /// Opaque transport-private handle consumed only by the source completion boundary.
    completion: Box<dyn CapabilityInboundDeliveryCompletion + Send>,
}

impl CapabilityInboundDelivery {
    /// Creates one delivery after the source driver proves complete-byte and completion-handle symmetry.
    pub(crate) fn from_parts(
        encoded_envelope: Box<[u8]>,
        completion: Box<dyn CapabilityInboundDeliveryCompletion + Send>,
        maximum_encoded_bytes: usize,
    ) -> Result<Self, CapabilitySourceFailure>;

    /// Borrows the complete encoded envelope for one header-first dispatch invocation.
    pub fn encoded_envelope(&self) -> &[u8];

    /// Consumes this delivery and marks application-level processing complete.
    pub async fn complete_processing(self) -> Result<(), CapabilitySourceFailure>;

    /// Consumes this delivery and requests transport handling for the same source event.
    pub async fn retry_same_event(self) -> Result<(), CapabilitySourceFailure>;

    /// Consumes this delivery and isolates it from automatic replay.
    pub async fn quarantine(self) -> Result<(), CapabilitySourceFailure>;
}
```

`CapabilityInboundDeliveryCompletion` is another infra-private driver trait. It owns the physical acknowledgement, release, retry, isolation, lease or response capability selected by `04`, but its methods and metadata are not visible to Worker. The three public assembly methods are product-neutral semantic operations, not broker `ack/nack` methods and not a second action enum. Worker batch 2 defines one Worker-private exhaustive mapper from the already existing `CapabilityInboundProcessingAction` to exactly one of these methods. This direction keeps `infra -> worker = 0`: infra never names the Worker enum, while Worker cannot inspect or downcast the completion driver.

`CapabilityInboundDelivery` does not implement `Clone`, `Copy`, `Serialize` or `Deserialize`. Its drop path cannot mean successful completion. If it is dropped before one consuming method returns success, the concrete transport retains its native unresolved-delivery behavior;`04` must bind and test that behavior, but Capability Hub may not infer completion, retry or quarantine from `Drop`. This prevents cancellation, panic or task abort from silently advancing an offset or claiming completion.

### 103.5 Trusted actor matcher contract

```rust
/// Infra-private immutable actor matcher compiled from one validated source binding.
pub(crate) trait CapabilityTrustedActorMatcherDriver: Send + Sync {
    /// Evaluates the common actor-to-source-family trust relation without performing I/O.
    fn evaluate(
        &self,
        actor: &ActorContext,
        expected_family: &CapabilityInboundSourceFamily,
    ) -> CapabilityTrustedActorDecision;

    /// Evaluates the external capability-source kind refinement without performing I/O.
    fn evaluate_external_source_kind(
        &self,
        actor: &ActorContext,
        source_kind: &ExternalCapabilitySourceKind,
    ) -> CapabilityTrustedActorDecision;
}

/// Closed trusted-actor decision for one immutable inbound source binding.
pub enum CapabilityTrustedActorDecision {
    /// The actor is accepted for this runner's fixed source family.
    Accepted,
    /// The actor is not accepted for this runner's fixed source family.
    Rejected,
}

/// Opaque immutable matcher for one fixed inbound source family.
pub struct CapabilityTrustedActorMatcher {
    /// Infra-private immutable matcher material with no raw secret or policy body.
    matcher: Box<dyn CapabilityTrustedActorMatcherDriver + Send + Sync>,
}

impl CapabilityTrustedActorMatcher {
    /// Creates an opaque matcher from one validated infra-private actor matcher driver.
    pub(crate) fn from_driver(
        matcher: Box<dyn CapabilityTrustedActorMatcherDriver + Send + Sync>,
    ) -> Self;

    /// Evaluates one header actor against the runner's fixed source family.
    pub fn evaluate(
        &self,
        actor: &ActorContext,
        expected_family: &CapabilityInboundSourceFamily,
    ) -> CapabilityTrustedActorDecision;

    /// Evaluates the source-kind refinement required by the external capability-source consumer.
    pub fn evaluate_external_source_kind(
        &self,
        actor: &ActorContext,
        source_kind: &ExternalCapabilitySourceKind,
    ) -> CapabilityTrustedActorDecision;
}
```

`CapabilityTrustedActorMatcherDriver` is infra-private and cannot perform network I/O, read config, refresh credentials, call governance approval or inspect transport metadata. It is compiled from validated startup material and returns only `Accepted / Rejected`. The common `evaluate` call occurs after borrowed header parse and before payload decode. `evaluate_external_source_kind` is the only post-payload refinement: it is called only in the already selected `ExternalCapabilitySource` arm after exact schema-1 payload decode and before context mapping/application dispatch, because the `source_kind` authority exists only in that exact payload. `Rejected` maps to the existing `WorkerError::local_source(WorkerSourceKind::InboundEnvelope, None)` boundary and no application call occurs. It does not itself select `Quarantine`;only an existing typed receipt may produce that processing action. The physical handling of this no-receipt source error remains the typed `04` binding and may not reroute the event or call a capability runtime.

Deterministic fake construction must provide a matcher with the same two call surfaces. It may encode explicit accepted/rejected fixture actors, but it cannot use an always-accept shortcut or bypass the external source-kind refinement.

### 103.6 Transport metadata exclusion matrix

| Physical material | May remain inside infra-private driver / completion? | May reach Worker wrapper? | May reach envelope / context / receipt / digest / persistence? |
|---|---:|---:|---:|
| endpoint / credential / TLS / subscription | yes | no | no |
| topic / group / partition / offset / checkpoint | yes | no | no |
| lease / delivery id / attempt / redelivery flag | yes | no | no |
| concrete ack / release / retry / quarantine token | yes,inside completion only | only as opaque ownership,never inspectable | no |
| complete encoded envelope bytes | yes | yes,inside bounded delivery | only existing typed decode;raw bytes are not persisted/logged |
| public source event ref / source key / actor / trace / time | only as envelope bytes | yes,after typed header decode | only according to existing Step 8/13 contracts |
| existing processing action | product mapping input | yes | no serialization or persistence |

No transport-private field may be converted into `CapabilitySourceEventRef`, `IdempotencyKey`, trace, actor, occurrence time, request digest, result ref, receipt marker, issue ref, evidence alias or Job run identity. A concrete product that cannot keep these fields private fails the `04` binding gate.

## 104. Worker-owned source runner 与 one-delivery lifecycle

### 104.1 Static slot descriptor and runner declaration

`CapabilityInboundSourceRunner` belongs to `crates/worker/src/consumers.rs`. It receives one feed and one matcher by ownership. The static slot descriptor is a Worker-private closed enum instead of six configurable strings;its methods return the exact consumer/family/schema mapping already fixed by §97.1.

```rust
/// Worker-private identity of one of the six closed inbound source slots.
#[derive(Clone, Copy, Eq, PartialEq)]
pub(crate) enum CapabilityInboundSourceSlot {
    /// Governance-result reference-change source slot.
    GovernanceResultReferenceChanged,
    /// Method-asset reference-change source slot.
    MethodAssetReferenceChanged,
    /// Downstream consumption-impact source slot.
    DownstreamConsumptionImpactReported,
    /// External capability-source reference-change source slot.
    ExternalCapabilitySourceReferenceChanged,
    /// Audit-material reference-change source slot.
    AuditMaterialReferenceChanged,
    /// External-document reference-change source slot.
    ExternalDocumentReferenceChanged,
}

impl CapabilityInboundSourceSlot {
    /// Returns the exact closed consumer bound to this source slot.
    pub(crate) fn consumer(&self) -> CapabilityInboundConsumerName;

    /// Returns the exact closed source family bound to this source slot.
    pub(crate) fn source_family(&self) -> CapabilityInboundSourceFamily;

    /// Returns the only supported inbound protocol schema for this source slot.
    pub(crate) fn schema_version(&self) -> CapabilityProtocolSchemaVersion;
}

/// Worker-private runtime lease whose drop releases only one concurrency permit.
pub(crate) trait CapabilityWorkerPermitLease: Send {}

/// Worker-private runtime semaphore driver used behind the stable permit-gate wrapper.
pub(crate) trait CapabilityWorkerPermitGateDriver: Send + Sync {
    /// Acquires one pre-admission lease, or returns `None` after cooperative stop wins the wait.
    fn acquire_until_stopped<'a>(
        &'a self,
        stop: &'a CapabilityWorkerStopSignal,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = Result<
                        Option<Box<dyn CapabilityWorkerPermitLease + Send>>,
                        CapabilityWorkerRuntimeFailure,
                    >,
                > + Send
                + 'a,
        >,
    >;

    /// Acquires one lease for a delivery already detached from its source feed.
    fn acquire_admitted(
        &self,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = Result<
                        Box<dyn CapabilityWorkerPermitLease + Send>,
                        CapabilityWorkerRuntimeFailure,
                    >,
                > + Send
                + '_,
        >,
    >;
}

/// Worker-private global gate for independently owned Worker entry items.
pub(crate) struct CapabilityWorkerPermitGate {
    /// Selected runtime semaphore hidden behind the exact acquire contract.
    driver: Box<dyn CapabilityWorkerPermitGateDriver + Send + Sync>,
    /// Positive maximum number of simultaneously owned independent item permits.
    maximum: usize,
}

impl CapabilityWorkerPermitGate {
    /// Creates one global gate from a validated limit and selected runtime permit driver.
    pub(crate) fn new(
        maximum: usize,
        driver: Box<dyn CapabilityWorkerPermitGateDriver + Send + Sync>,
    ) -> Result<Self, CapabilityWorkerCompositionError>;

    /// Waits for one permit while allowing cooperative stop to end only this wait.
    pub(crate) async fn acquire_until_stopped(
        &self,
        stop: &CapabilityWorkerStopSignal,
    ) -> Result<Option<CapabilityWorkerPermit>, CapabilityWorkerRuntimeFailure>;

    /// Waits without stop cancellation for capacity already owed to one owned delivery.
    pub(crate) async fn acquire_admitted(
        &self,
    ) -> Result<CapabilityWorkerPermit, CapabilityWorkerRuntimeFailure>;

    /// Returns the validated global independent-item limit.
    pub(crate) fn maximum(&self) -> usize;
}

/// Worker-private owned permit for one independent delivery or exact-ref continuation.
pub(crate) struct CapabilityWorkerPermit {
    /// Runtime lease whose drop releases only the corresponding semaphore slot.
    lease: Box<dyn CapabilityWorkerPermitLease + Send>,
}

/// Worker-private runner for one enabled and statically identified inbound source.
pub(crate) struct CapabilityInboundSourceRunner {
    /// Closed source slot controlling the exact consumer, family, schema, and handler arm.
    slot: CapabilityInboundSourceSlot,
    /// Opaque serialized feed owned by this runner.
    feed: CapabilityEncodedEnvelopeFeed,
    /// Immutable trusted-actor matcher for this runner's exact source boundary.
    trusted_actor: std::sync::Arc<CapabilityTrustedActorMatcher>,
    /// Shared header-first dispatcher covering all six closed handler arms.
    dispatcher: std::sync::Arc<CapabilityInboundDispatcher>,
    /// Maximum complete encoded envelope size accepted before header parsing.
    inbound_body_limit: usize,
    /// Maximum deliveries completed before this source task cooperatively yields once.
    fetch_batch_limit: usize,
    /// Response-observation budget for one already admitted application invocation.
    inbound_call_timeout: std::time::Duration,
    /// Shared permit gate limiting independent deliveries across all six source tasks.
    independent_delivery_permits: std::sync::Arc<CapabilityWorkerPermitGate>,
}

impl CapabilityInboundSourceRunner {
    /// Creates one runner from a fixed slot and one complete resolved source input.
    pub(crate) fn from_resolved_source(
        slot: CapabilityInboundSourceSlot,
        source: CapabilityResolvedInboundSource,
        dispatcher: std::sync::Arc<CapabilityInboundDispatcher>,
        parameters: &CapabilityWorkerEntryParameters,
        independent_delivery_permits: std::sync::Arc<CapabilityWorkerPermitGate>,
    ) -> Result<Option<Self>, CapabilityWorkerCompositionError>;

    /// Processes at most one fetched delivery through dispatch and physical completion.
    pub(crate) async fn run_one(
        &mut self,
        stop: &CapabilityWorkerStopSignal,
    ) -> Result<CapabilityInboundRunnerProgress, WorkerError>;

    /// Returns a duplicate of the feed's stop-only authority for task-set shutdown.
    pub(crate) fn stop_handle(&self) -> CapabilityEncodedEnvelopeFeedStop;

    /// Returns the positive per-source scheduling batch limit.
    pub(crate) fn fetch_batch_limit(&self) -> usize;

    /// Requests idempotent stop for this runner's source feed.
    pub(crate) async fn request_stop(
        &self,
    ) -> Result<(), WorkerError>;
}
```

`CapabilityWorkerPermitGate` is constructed exactly once from `CapabilityWorkerEntryParameters::parallelism()` and shared by all six runners plus the exact-ref continuation runtime. Its driver is Worker-private and chosen with the async runtime in `07`;the shown future-returning interface is the object-safe contract and cannot gain delivery, receipt or transport-completion methods. The gate is global, not six independently sized gates;otherwise the configured limit could be multiplied by six. A continuation is one independent item only after the caller supplies its exact committed capture ref, and it retains the separate `collaboration_call_timeout`.

The two acquire callables encode different ownership phases. Explicit continuation has no source delivery before admission, so cooperative stop may win `acquire_until_stopped` and leave zero work. A source runner first performs its one serialized fetch without holding a dispatch permit. Once a non-cloneable delivery has detached from the feed, that item is already admitted and must use `acquire_admitted`;cooperative stop cannot discard it while waiting for capacity. This prevents an empty long-polling source from monopolizing the global dispatch limit while bounding pre-permit delivery ownership to at most one bounded delivery per enabled named source.

`CapabilityWorkerPermit` does not implement `Clone`, `Copy`, `Serialize` or `Deserialize`. Dropping it releases only concurrency capacity. It cannot acknowledge a delivery, cancel an application invocation, mark collaboration complete or create a retry. `acquire_until_stopped` returning `None` means no item was admitted and therefore no application or source effect exists;once it returns `Some`, cooperative stop cannot revoke that permit or cancel the admitted item.

`from_resolved_source` is invoked by six statically visible factory arms. For `Configured` and `DeterministicFake`, it requires both feed and matcher, copies the positive `inbound_body_limit`、`fetch_batch_limit` and `inbound_call_timeout` from validated parameters, wraps the owned immutable matcher in one runner-local `Arc`, and returns `Some(runner)`;for `Disabled`, it returns `Ok(None)` without creating a feed, matcher, permit, task or completion handle. The runner receives no task spawner or runtime event factory. The matcher `Arc` allows an owned invocation future to retain actor authority after observation timeout;it does not permit matcher mutation, driver downcast or sharing between source slots. The factory rejects a wrong slot/source pair before tasks start. It may share private construction code, but no `Vec`, map, string registry, wildcard or `dyn Any` may choose the slot.

### 104.2 Worker-owned one-delivery outcome

```rust
/// Worker-private one-delivery result pairing ownership with one existing processing action.
pub(crate) struct CapabilityInboundDeliveryOutcome {
    /// Original non-cloneable delivery awaiting exactly one physical completion call.
    delivery: CapabilityInboundDelivery,
    /// Existing receipt-derived processing action preserved without reclassification.
    action: CapabilityInboundProcessingAction,
}

impl CapabilityInboundDeliveryOutcome {
    /// Creates one outcome from the original delivery and one validated processing action.
    pub(crate) fn new(
        delivery: CapabilityInboundDelivery,
        action: CapabilityInboundProcessingAction,
    ) -> Self;

    /// Consumes the outcome and performs the exact product-neutral completion operation.
    pub(crate) async fn complete(self) -> Result<(), CapabilitySourceFailure>;
}
```

`complete` is the only mapping site and must be exhaustive:

```text
Complete       -> delivery.complete_processing().await
RetrySameEvent -> delivery.retry_same_event().await
Quarantine     -> delivery.quarantine().await
```

No fourth arm, default arm, retry loop, error-text classifier or action rewrite is allowed. This struct is not serialized, persisted, logged as evidence or returned to application. Its purpose is ownership proof: one action cannot be completed against another delivery, and one delivery cannot receive two completion calls.

### 104.3 Runner progress and technical return

```rust
/// Worker-private progress result for one bounded source-loop iteration.
pub(crate) enum CapabilityInboundRunnerProgress {
    /// One delivery completed its exact processing-action mapping.
    DeliveryCompleted,
    /// A deterministic fixture exhausted or a controlled source stop completed.
    EndOfSource,
}
```

`CapabilityInboundRunnerProgress` is loop control only. `DeliveryCompleted` does not claim application acceptance:all `Complete` dispositions, including stable rejection, ignored, duplicate replay and unsupported schema, mean only that no same-event processing retry is required. `EndOfSource` means only deterministic fixture exhaustion or an observed controlled stop under §103.3;it never means an enabled configured source ended normally, source Disabled or healthy forever. Neither variant is a protocol response, business state, persisted checkpoint, metric result, acceptance evidence or implementation test result.

### 104.4 Exact `run_one` order

Every configured and deterministic-fake runner executes the following sequence:

```text
check stop before source fetch
  -> cooperative stop already requested: request feed stop and return EndOfSource
  -> call feed.fetch_one(inbound_body_limit) without holding a dispatch permit
     -> legal EndOfSource from fixture exhaustion or controlled stop: return EndOfSource
     -> unexpected configured-source end: feed converts it to UnexpectedSourceFailure
     -> CapabilitySourceFailure: map to WorkerError::Source
     -> owned CapabilityInboundDelivery:
          verify delivery.encoded_envelope().len() <= inbound_body_limit
          acquire one global permit with acquire_admitted()
          -> permit-driver failure:
               leave the already owned delivery unresolved
               map once to WorkerError::local_source(
                 WorkerSourceKind::InboundEnvelope,failure.into_source())
          -> permit acquired:
               move slot + delivery + Arc<trusted_actor> + Arc<dispatcher> into
                 CapabilityWorkerInboundInvocation::new(...)
               call invocation.observe_to_terminal(inbound_call_timeout)
               -> exact Ok after typed processing action and one completion call:
                    release permit
                    return DeliveryCompleted
               -> exact WorkerError after same invocation drains:
                    original delivery was left unresolved by the invocation future
                    release permit
                    return the exact WorkerError
```

Required consequences:

1. `fetch_one` and `dispatch_one` are each called at most once for this `run_one` invocation. A completion failure does not re-dispatch application code.
2. The global permit covers dispatch/application/completion for one already owned delivery, not source long-polling. It is released on every post-acquire return path and is not stored in a receipt, delivery, retry state or task registry. A stop request can end a not-yet-yielded fetch;once a delivery exists, its non-stop-cancellable `acquire_admitted` wait and any invocation must drain to an exact terminal result.
3. The runner never reads transport metadata, never changes the slot, and never creates a `CapabilitySourceEventRef` outside the encoded envelope.
4. A `WorkerError` without a typed processing action provides no legal completion choice in this Step. The delivery is released unresolved to the product-private boundary;`04` must define typed product handling for each existing source/application error class without adding a Hub action or inferring from text.
5. `CapabilitySourceFailure` from fetch/completion maps only to `WorkerError::Source { kind: WorkerSourceKind::InboundEnvelope, source: Some(..) }`. It never becomes `WorkerError::Application`, a receipt, `Delayed`, `Quarantined`, `CommitOutcomeUnknown` or startup error after tasks are running.
6. `ApplicationError` from the exact consumer remains `WorkerError::Application`. The runner cannot inspect it to choose complete/retry/quarantine;only a valid typed receipt can produce those actions.

### 104.5 Header-first trusted-actor order correction

Batch 1 already fixed the semantic order but its initial `dispatch_one` signature omitted the matcher parameter. The active signature in §98.1 is therefore corrected in this batch to accept `&CapabilityTrustedActorMatcher`. The exact order is now mechanically expressible:

```text
length gate
  -> borrowed header decode
  -> slot consumer/family check
  -> trusted_actor.evaluate(header.actor, slot.family)
  -> header ref/key/trace/time checks
  -> schema check
  -> exact payload decode
  -> for ExternalCapabilitySource only:
       trusted_actor.evaluate_external_source_kind(header.actor, payload.source_kind)
  -> forbidden-body/symmetry checks
  -> context mapping and exact application call
  -> receipt validation and processing action
```

The external source-kind refinement does not move general actor validation after payload decode. Common family acceptance still occurs before payload decode;only the kind-specific MCP/A2A/external-API check occurs after the exact payload makes that value available. A rejected decision returns only the existing `WorkerError::Source(InboundEnvelope)` boundary and leaves the delivery unresolved;it cannot select `Quarantine` or fabricate any receipt disposition.

### 104.6 Non-cancelling inbound invocation timeout

`CapabilityWorkerEntryParameters::inbound_call_timeout()` is a response-observation budget after header/payload admission, not proof that cancelling an application future has zero effect. The runner must preserve exactly one owned dispatcher/application invocation after dispatch begins. If the timeout expires first, it must not abort the application task, call `dispatch_one` again, invoke a neighboring handler, change event identity or complete the transport delivery.

| Phase | Application invocation | Timeout behavior | Delivery behavior |
|---|---:|---|---|
| fetch / admission | none | source timeout follows typed source handling;global dispatch permit is not held during fetch | no completion action is fabricated |
| dispatched | exactly one in progress | stop current response observation but retain owned invocation until its result is known or the process enters controlled shutdown | delivery remains owned/unresolved;no ack/retry/quarantine inference |
| typed action returned | invocation complete | map action to one consuming completion call | completion failure is source failure;never re-dispatch |
| `WorkerError` returned | invocation or source path failed without valid action | preserve exact wrapper | do not select a physical processing action from error text |

The exact Worker-private ownership carrier is:

```rust
/// Timing class recorded only after one owned inbound invocation reaches its exact terminal result.
pub(crate) enum CapabilityWorkerInvocationTiming {
    /// The owned invocation reached its exact terminal result within the observation budget.
    CompletedBeforeRunDeadline,
    /// The observation budget elapsed first and the same invocation was then drained to completion.
    DrainedAfterRunDeadline,
}

/// Terminal result of one owned invocation after no application future or delivery remains detached.
pub(crate) struct CapabilityWorkerInboundInvocationTerminal {
    /// Whether the same invocation required post-budget draining.
    timing: CapabilityWorkerInvocationTiming,
    /// Exact dispatch-and-completion result preserved without timeout reclassification.
    result: Result<(), WorkerError>,
}

impl CapabilityWorkerInboundInvocationTerminal {
    /// Returns the process-local observation timing without changing the exact terminal result.
    pub(crate) fn timing(&self) -> &CapabilityWorkerInvocationTiming;

    /// Consumes the terminal carrier and returns the exact dispatch-and-completion result.
    pub(crate) fn into_result(self) -> Result<(), WorkerError>;
}

/// Worker-private owner of one dispatcher future and its original non-cloneable delivery.
pub(crate) struct CapabilityWorkerInboundInvocation {
    /// Owned future containing dispatcher, immutable matcher, delivery, and exact completion mapping.
    invocation: std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), WorkerError>> + Send + 'static>,
    >,
}

impl CapabilityWorkerInboundInvocation {
    /// Creates one owned future that dispatches and completes exactly one original delivery.
    pub(crate) fn new(
        slot: CapabilityInboundSourceSlot,
        delivery: CapabilityInboundDelivery,
        trusted_actor: std::sync::Arc<CapabilityTrustedActorMatcher>,
        dispatcher: std::sync::Arc<CapabilityInboundDispatcher>,
    ) -> Self;

    /// Observes to the budget and then drains the same future until its exact result is known.
    pub(crate) async fn observe_to_terminal(
        self,
        observation_budget: std::time::Duration,
    ) -> CapabilityWorkerInboundInvocationTerminal;
}
```

`CapabilityWorkerInboundInvocation::new` moves the original delivery into the future. The future calls `dispatch_one` once;on a typed action it constructs `CapabilityInboundDeliveryOutcome` and consumes the original completion handle once, while on `WorkerError` it drops that delivery unresolved. The runner cannot borrow or complete the delivery outside this future.

`observe_to_terminal` races only the observation timer against the owned future. If the future wins, it returns `CompletedWithinObservationBudget`. If the timer wins, it records `DrainedAfterObservationBudget` process-locally and **continues polling the same future** until an exact `Result<(), WorkerError>` exists. It does not return a timeout error, detach a join handle, release the permit, lose the delivery or create a second invocation. Step 15 may later expose the redacted timing class;the timing is not a receipt, issue, processing action, retry authorization or test evidence.

The Worker-only Tokio binding implements that race as `tokio::time::timeout(observation_budget, invocation.as_mut()).await`,where `invocation` remains the same local `Pin<Box<...>>`. `Ok(result)` returns the exact result;`Err(_elapsed)` drops only the timeout wrapper and its temporary pinned borrow,then awaits the same owned `invocation` to terminal. It must not pass the owned box by value into a timeout and then lose it,spawn a replacement task,use `tokio::select!`,or require Tokio's `macros` feature. Continuation observation applies the same rule to `completion.wait_completed()`:an elapsed observation creates a fresh wait on the same irreversible completion event,never a second application invocation.

The source task therefore cannot detach an untracked application invocation. The task registry retains the source task and joins it during shutdown;that join necessarily drains any `CapabilityWorkerInboundInvocation` already created. If the selected async runtime/framework cannot keep polling an owned future after the observation timer fires, Worker startup returns `CapabilityWorkerCompositionError::NonCancellingRuntimeUnsupported`, which the existing mapper then converts to `InfraError::RuntimeAssembly`. This is the Worker equivalent of the API whole-call contract and does not add a new `WorkerSourceKind` or `ApplicationError` variant.

## 105. Six named task lifecycle、startup rollback 与 shutdown

### 105.1 Task owner declarations

The task registry belongs to the Worker composition root. It uses six named fields so startup/shutdown coverage remains statically auditable. A Disabled slot is represented by `None`;an enabled slot must transition from one owned runner to one parked task, then to one activated task exactly once. All runtime wrappers below are Worker-private and have exact fields/callables rather than unresolved placeholder names.

```rust
/// Worker-private runtime event that wakes all waiters after one irreversible transition.
pub(crate) trait CapabilityWorkerRuntimeEvent: Send + Sync {
    /// Signals the event idempotently without panicking and wakes every current or future waiter.
    fn signal(&self);

    /// Returns whether the irreversible event has already been signaled.
    fn is_signaled(&self) -> bool;

    /// Waits until the irreversible event has been signaled.
    fn wait<'a>(
        &'a self,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = ()> + Send + 'a>>;
}

/// Worker-private shared stop state implemented by one runtime event.
pub(crate) struct CapabilityWorkerStopState {
    /// Runtime event signaling that no new Worker item may be admitted.
    event: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
}

impl CapabilityWorkerStopState {
    /// Creates one non-signaled stop state from the selected runtime event implementation.
    pub(crate) fn new(
        event: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    ) -> Self;

    /// Signals cooperative stop idempotently.
    pub(crate) fn request_stop(&self);

    /// Returns whether cooperative stop has been requested.
    pub(crate) fn is_stop_requested(&self) -> bool;

    /// Waits until cooperative stop is requested.
    pub(crate) async fn wait_requested(&self);
}

/// Worker-private stop signal shared by source tasks and continuation admission.
#[derive(Clone)]
pub(crate) struct CapabilityWorkerStopSignal {
    /// Runtime-local cancellation state that cannot cancel an admitted application invocation.
    state: std::sync::Arc<CapabilityWorkerStopState>,
}

impl CapabilityWorkerStopSignal {
    /// Creates a new non-triggered stop signal from one runtime event.
    pub(crate) fn new(
        event: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    ) -> Self;

    /// Requests idempotent cooperative stop for all started source tasks.
    pub(crate) fn request_stop(&self);

    /// Returns whether cooperative stop has been requested.
    pub(crate) fn is_stop_requested(&self) -> bool;

    /// Waits until cooperative stop is requested without cancelling admitted work.
    pub(crate) async fn wait_requested(&self);
}

/// Worker-private activation decision observed exactly once by every parked source task.
#[derive(Clone, Copy, Eq, PartialEq)]
pub(crate) enum CapabilityWorkerActivationDecision {
    /// All enabled named tasks exist and may begin source interaction.
    Released,
    /// Startup failed and no parked task may fetch or call application code.
    Aborted,
}

/// Worker-private activation state shared by one complete start attempt.
pub(crate) struct CapabilityWorkerActivationState {
    /// Runtime event waking every parked task after release or abort is selected.
    decided: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    /// Single-assignment decision written before the event is signaled.
    decision: std::sync::Mutex<Option<CapabilityWorkerActivationDecision>>,
}

/// Worker-private controller retained by the start path until all named spawns succeed.
pub(crate) struct CapabilityWorkerActivationController {
    /// Shared single-assignment activation state for this start attempt.
    state: std::sync::Arc<CapabilityWorkerActivationState>,
}

/// Worker-private waiter moved into one parked source task.
pub(crate) struct CapabilityWorkerActivationWaiter {
    /// Shared single-assignment activation state for this start attempt.
    state: std::sync::Arc<CapabilityWorkerActivationState>,
}

impl CapabilityWorkerActivationController {
    /// Creates one unreleased controller and first waiter from one runtime event.
    pub(crate) fn new(
        decided: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    ) -> (Self, CapabilityWorkerActivationWaiter);

    /// Releases all parked source tasks after complete named-task coverage succeeds.
    pub(crate) fn release(self);

    /// Aborts all parked source tasks without permitting source or application interaction.
    pub(crate) fn abort(self);
}

impl CapabilityWorkerActivationWaiter {
    /// Creates another waiter for the same one-shot activation decision.
    pub(crate) fn duplicate_handle(&self) -> Self;

    /// Waits for the startup decision before any source operation is allowed.
    pub(crate) async fn wait(self) -> CapabilityWorkerActivationDecision;
}

/// Worker-private boundary that produced one terminal shutdown cause.
#[derive(Clone, Copy, Eq, PartialEq)]
pub(crate) enum CapabilityWorkerTerminalBoundary {
    /// Feed-stop operation for one enabled named source task.
    SourceFeedStop {
        /// Closed source slot whose fetch-stop authority was invoked.
        slot: CapabilityInboundSourceSlot,
    },
    /// Explicit exact-ref event-collaboration continuation drain.
    EventCollaborationContinuation,
    /// Runtime join operation for one enabled named source task.
    SourceTaskJoin {
        /// Closed source slot whose owned task was joined.
        slot: CapabilityInboundSourceSlot,
    },
}

/// Worker-private terminal cause retained during graceful shutdown.
pub(crate) enum CapabilityWorkerTerminalCause {
    /// A feed stop, continuation, or source task returned its exact Worker boundary error.
    Worker {
        /// Exact stop, continuation, or join boundary that returned the error.
        boundary: CapabilityWorkerTerminalBoundary,
        /// Exact Worker error returned by the owned boundary.
        source: WorkerError,
    },
    /// The runtime reported panic, cancellation, or another join-layer failure.
    Runtime {
        /// Exact continuation or source-task join boundary that failed in the runtime.
        boundary: CapabilityWorkerTerminalBoundary,
        /// Nonpublic runtime join cause retained only in the process-local chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
}

/// Worker-private runtime join driver for one owned spawned task.
pub(crate) trait CapabilityWorkerJoinDriver: Send {
    /// Joins the task and preserves either its exact Worker error or runtime join cause.
    fn join(
        self: Box<Self>,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<(), CapabilityWorkerTerminalCause>> + Send>,
    >;
}

/// Worker-private non-cloneable join handle for one spawned source task.
pub(crate) struct CapabilityWorkerJoinHandle {
    /// Selected runtime join driver consumed by the only join call.
    driver: Box<dyn CapabilityWorkerJoinDriver + Send>,
}

impl CapabilityWorkerJoinHandle {
    /// Creates one join handle from a successfully spawned runtime task.
    pub(crate) fn from_driver(
        driver: Box<dyn CapabilityWorkerJoinDriver + Send>,
    ) -> Self;

    /// Consumes the handle and returns the exact task or runtime terminal result.
    pub(crate) async fn join(self) -> Result<(), CapabilityWorkerTerminalCause>;
}

/// Worker-private source-task spawner selected by the Worker binary composition root.
pub(crate) trait CapabilityWorkerTaskSpawner: Send + Sync {
    /// Returns whether this runtime preserves an owned invocation after observation timeout.
    fn supports_non_cancelling(
        &self,
        boundary: CapabilityWorkerNonCancellingBoundary,
    ) -> bool;

    /// Creates one non-signaled irreversible event for stop, activation, or completion.
    fn new_event(
        &self,
    ) -> Result<
        Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
        CapabilityWorkerRuntimeFailure,
    >;

    /// Creates one global permit driver for the validated independent-item limit.
    fn new_permit_driver(
        &self,
        maximum: usize,
    ) -> Result<
        Box<dyn CapabilityWorkerPermitGateDriver + Send + Sync>,
        CapabilityWorkerRuntimeFailure,
    >;

    /// Cooperatively yields one source loop after its validated fairness batch completes.
    fn yield_now(
        &self,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = ()> + Send + '_>>;

    /// Spawns one named parked source task and returns its non-cloneable join handle.
    fn spawn_source(
        &self,
        slot: CapabilityInboundSourceSlot,
        task: std::pin::Pin<
            Box<dyn std::future::Future<Output = Result<(), WorkerError>> + Send + 'static>,
        >,
    ) -> Result<CapabilityWorkerJoinHandle, CapabilityWorkerRuntimeFailure>;

    /// Spawns one guarded exact-ref continuation task whose drop path completes it once.
    fn spawn_continuation(
        &self,
        task: CapabilityWorkerContinuationTask,
    ) -> Result<(), CapabilityWorkerRuntimeFailure>;
}

/// Worker-private owned handle for one named parked or activated source task.
pub(crate) struct CapabilityWorkerSourceTask {
    /// Closed source slot whose runner was moved into this task.
    slot: CapabilityInboundSourceSlot,
    /// Stop-only feed authority used to wake a not-yet-yielded fetch during shutdown.
    feed_stop: CapabilityEncodedEnvelopeFeedStop,
    /// Runtime-owned join handle for the parked or activated source loop.
    join_handle: CapabilityWorkerJoinHandle,
}

impl CapabilityWorkerSourceTask {
    /// Returns the closed source slot represented by this task.
    pub(crate) fn slot(&self) -> CapabilityInboundSourceSlot;

    /// Requests idempotent feed stop without completing an owned delivery.
    pub(crate) async fn request_feed_stop(&self) -> Result<(), WorkerError>;

    /// Joins one source task and preserves its exact Worker or runtime terminal failure.
    pub(crate) async fn join(self) -> Result<(), CapabilityWorkerTerminalCause>;
}

/// Worker-private state of one exact-ref continuation admitted by the explicit callable.
pub(crate) enum CapabilityWorkerContinuationProgress {
    /// No exact capture-ref continuation is currently admitted.
    Idle,
    /// One exact-ref continuation remains owned until its exact result is observed or shutdown.
    InFlight {
        /// Shared single-assignment completion retained independently of the caller future.
        completion: std::sync::Arc<CapabilityWorkerContinuationCompletion>,
    },
}

/// Worker-private single-assignment result of one supervised exact-ref continuation.
pub(crate) struct CapabilityWorkerContinuationCompletion {
    /// Runtime event signaled after a normal, application-error, or runtime-failure result is stored.
    completed: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    /// Closed single-assignment state protected across task and observer ownership.
    state: std::sync::Mutex<CapabilityWorkerContinuationCompletionState>,
}

/// Worker-private closed state of one continuation completion carrier.
pub(crate) enum CapabilityWorkerContinuationCompletionState {
    /// No terminal result has been assigned.
    Pending,
    /// One exact terminal result is available to its single matching observer.
    Completed(
        /// Exact application outcome or existing Worker error stored by the guarded task.
        Result<CapabilityEventCollaborationOutcome, WorkerError>,
    ),
    /// The exact terminal result has already been consumed by its matching observer.
    Taken,
}

impl CapabilityWorkerContinuationCompletion {
    /// Creates one unsignaled completion from an event supplied by the selected runtime.
    pub(crate) fn new(
        completed: Box<dyn CapabilityWorkerRuntimeEvent + Send + Sync>,
    ) -> Self;

    /// Stores one terminal result and signals observers only for the first assignment.
    fn complete_once(
        &self,
        result: Result<CapabilityEventCollaborationOutcome, WorkerError>,
    ) -> bool;

    /// Stores the existing continuation source error when a task terminates before a result.
    fn complete_runtime_termination_once(&self) -> bool;

    /// Waits until the supervised runtime has stored an exact terminal result.
    pub(crate) async fn wait_completed(&self);

    /// Takes the exact terminal result once after completion has been signaled.
    pub(crate) fn take_result(
        &self,
    ) -> Option<Result<CapabilityEventCollaborationOutcome, WorkerError>>;
}

/// Worker-private guard that terminalizes one continuation if its task is dropped early.
pub(crate) struct CapabilityWorkerContinuationCompletionGuard {
    /// Shared single-assignment carrier retained independently by the continuation runtime.
    completion: std::sync::Arc<CapabilityWorkerContinuationCompletion>,
    /// Whether this guard already stored the invocation's exact terminal result.
    terminal_written: bool,
}

impl CapabilityWorkerContinuationCompletionGuard {
    /// Creates one armed guard before the continuation future can be spawned or polled.
    pub(crate) fn new(
        completion: std::sync::Arc<CapabilityWorkerContinuationCompletion>,
    ) -> Self;

    /// Stores the exact invocation result and disarms the runtime-termination fallback.
    pub(crate) fn complete(
        mut self,
        result: Result<CapabilityEventCollaborationOutcome, WorkerError>,
    );
}

impl Drop for CapabilityWorkerContinuationCompletionGuard {
    /// Stores the existing continuation source error when an armed guard is dropped.
    fn drop(&mut self);
}

/// Worker-private opaque task whose captured guard terminalizes every drop path.
pub(crate) struct CapabilityWorkerContinuationTask {
    /// Opaque future owning one exact-ref invocation and one already armed completion guard.
    task: std::pin::Pin<Box<dyn std::future::Future<Output = ()> + Send + 'static>>,
}

impl CapabilityWorkerContinuationTask {
    /// Creates one guarded task from the exact invocation and its injected completion carrier.
    pub(crate) fn new(
        completion: std::sync::Arc<CapabilityWorkerContinuationCompletion>,
        invocation: std::pin::Pin<
            Box<
                dyn std::future::Future<
                        Output = Result<CapabilityEventCollaborationOutcome, WorkerError>,
                    > + Send
                    + 'static,
            >,
        >,
    ) -> Self;

    /// Consumes the wrapper and exposes only the guarded unit-output future to the runtime.
    pub(crate) fn into_future(
        self,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = ()> + Send + 'static>>;
}

/// Worker-private unstarted continuation seed moved from runtime into the task set.
pub(crate) struct CapabilityWorkerContinuationSeed {
    /// Application facade for one exact captured-event collaboration call.
    collaboration: std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>,
    /// Response-observation budget for one exact-ref continuation.
    observation_budget: std::time::Duration,
    /// Global independent-item permit gate shared with all six source runners.
    independent_item_permits: std::sync::Arc<CapabilityWorkerPermitGate>,
    /// Worker-local runtime supervisor shared by source start and continuation ownership.
    task_spawner: std::sync::Arc<dyn CapabilityWorkerTaskSpawner + Send + Sync>,
}

impl CapabilityWorkerContinuationSeed {
    /// Creates one unstarted continuation seed from the exact facade and validated parameters.
    pub(crate) fn new(
        collaboration: std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>,
        observation_budget: std::time::Duration,
        independent_item_permits: std::sync::Arc<CapabilityWorkerPermitGate>,
        task_spawner: std::sync::Arc<dyn CapabilityWorkerTaskSpawner + Send + Sync>,
    ) -> Result<Self, CapabilityWorkerCompositionError>;

    /// Converts the seed into a stop-aware continuation runtime after task activation.
    pub(crate) fn start(
        self,
        stop_signal: CapabilityWorkerStopSignal,
    ) -> CapabilityWorkerContinuationRuntime;
}

/// Worker-private explicit exact-ref continuation boundary retained by the task set.
pub(crate) struct CapabilityWorkerContinuationRuntime {
    /// Application facade for one exact captured-event collaboration call.
    collaboration: std::sync::Arc<dyn CapabilityEventCollaborationService + Send + Sync>,
    /// Response-observation budget for one exact-ref continuation.
    observation_budget: std::time::Duration,
    /// Global independent-item permit gate shared with all six source runners.
    independent_item_permits: std::sync::Arc<CapabilityWorkerPermitGate>,
    /// Shared cooperative stop signal rejecting new continuation admission.
    stop_signal: CapabilityWorkerStopSignal,
    /// Worker-local supervisor retaining admitted work independently of caller cancellation.
    task_spawner: std::sync::Arc<dyn CapabilityWorkerTaskSpawner + Send + Sync>,
    /// State retaining the one supervised completion independently of caller cancellation.
    progress: CapabilityWorkerContinuationProgress,
}

impl CapabilityWorkerContinuationRuntime {
    /// Delegates one caller-supplied exact committed capture reference and drains it to result.
    pub(crate) async fn continue_captured_event(
        &mut self,
        capture_ref: CapabilityEventCaptureRef,
    ) -> Result<CapabilityEventCollaborationOutcome, WorkerError>;

    /// Resumes observation of the one already admitted continuation without invoking it again.
    pub(crate) async fn drain_in_flight(
        &mut self,
    ) -> Result<Option<CapabilityEventCollaborationOutcome>, WorkerError>;

    /// Rejects new admission and verifies that no continuation is in flight.
    pub(crate) async fn shutdown(
        self,
    ) -> Result<(), CapabilityWorkerTerminalCause>;
}

/// Worker-private fixed-order shutdown failure preserving every exact terminal cause.
pub(crate) struct CapabilityWorkerShutdownFailure {
    /// Exact boundary whose Worker error was selected as the primary shutdown error.
    primary_boundary: CapabilityWorkerTerminalBoundary,
    /// First exact Worker error in feed-stop, continuation-drain, then source-join order.
    primary: WorkerError,
    /// All non-primary causes retained in their original deterministic observation order.
    additional: Vec<CapabilityWorkerTerminalCause>,
}

impl CapabilityWorkerShutdownFailure {
    /// Selects one primary from causes already collected in the required shutdown order.
    pub(crate) fn from_ordered_causes(
        causes: Vec<CapabilityWorkerTerminalCause>,
    ) -> Option<Self>;

    /// Returns the exact stop, continuation, or join boundary selected as primary.
    pub(crate) fn primary_boundary(&self) -> &CapabilityWorkerTerminalBoundary;

    /// Returns the first exact Worker error without reclassification.
    pub(crate) fn primary(&self) -> &WorkerError;

    /// Returns later private causes in deterministic join order.
    pub(crate) fn additional(&self) -> &[CapabilityWorkerTerminalCause];

    /// Consumes the aggregate without discarding its primary boundary or additional causes.
    pub(crate) fn into_parts(
        self,
    ) -> (
        CapabilityWorkerTerminalBoundary,
        WorkerError,
        Vec<CapabilityWorkerTerminalCause>,
    );
}

/// Complete named task set retained only after every enabled source starts successfully.
pub(crate) struct CapabilityWorkerTaskSet {
    /// Shared cooperative stop signal for this exact start attempt.
    stop_signal: CapabilityWorkerStopSignal,
    /// Explicit exact-ref continuation boundary retained for the complete Worker lifetime.
    event_collaboration: CapabilityWorkerContinuationRuntime,
    /// Governance source task, or `None` only when the slot is Disabled.
    governance_result_reference_changed: Option<CapabilityWorkerSourceTask>,
    /// Method-library source task, or `None` only when the slot is Disabled.
    method_asset_reference_changed: Option<CapabilityWorkerSourceTask>,
    /// Downstream impact source task, or `None` only when the slot is Disabled.
    downstream_consumption_impact_reported: Option<CapabilityWorkerSourceTask>,
    /// External capability-source task, or `None` only when the slot is Disabled.
    external_capability_source_reference_changed: Option<CapabilityWorkerSourceTask>,
    /// Audit-material source task, or `None` only when the slot is Disabled.
    audit_material_reference_changed: Option<CapabilityWorkerSourceTask>,
    /// External-document source task, or `None` only when the slot is Disabled.
    external_document_reference_changed: Option<CapabilityWorkerSourceTask>,
}

impl CapabilityWorkerTaskSet {
    /// Returns the explicit exact-ref continuation boundary without exposing a scanner or queue.
    pub(crate) fn event_collaboration(
        &mut self,
    ) -> &mut CapabilityWorkerContinuationRuntime;

    /// Requests cooperative stop, stops feeds, and joins continuation plus all named tasks.
    pub(crate) async fn shutdown(self) -> Result<(), CapabilityWorkerShutdownFailure>;
}
```

`CapabilityWorkerTaskSpawner`, `CapabilityWorkerRuntimeEvent`, `CapabilityWorkerJoinDriver`, `CapabilityWorkerPermitGateDriver` and `CapabilityWorkerPermitLease` are the complete Worker-private runtime-pluggable trait set. `07` may bind their concrete Tokio implementations but may not add another runtime abstraction or alter their ownership/result semantics. `yield_now` is scheduler cooperation only:it cannot fail,release a permit,stop a feed,complete a delivery or change the completed-count value. The stop signal is not a transport acknowledgement, lease cancellation, application cancellation token, persisted state or public API. It only prevents new admission and wakes permit/fetch waits;already admitted delivery waits and invocation futures continue to exact terminal results.

Every event returned by `new_event` must provide an idempotent,non-panicking `signal()` after successful construction. `CapabilityWorkerContinuationCompletion` writes the result while holding its private single-assignment mutex and then signals;because signaling cannot fail or unwind,an observer cannot see a permanently unsignaled carrier after a stored result. If a runtime cannot provide that primitive,`new_event` returns `CapabilityWorkerRuntimeFailure` before the event enters stop、activation or continuation state.

`CapabilityWorkerActivationController::new` and `CapabilityWorkerActivationWaiter::duplicate_handle` may use private runtime bookkeeping solely to distribute one waiter to each already-counted enabled task;source identity and dispatch remain named fields and static arms. `release` and `abort` are mutually exclusive consuming calls. A parked task first calls `waiter.wait()` and performs zero permit acquisition, source fetch, actor evaluation, decode, application invocation or completion before receiving `Released`. `Aborted` returns without touching the feed;startup cleanup uses the separate stop handle when waking a parked runtime task is required.

`CapabilityWorkerContinuationRuntime` is not a seventh source task and not an autonomous producer. Its only admission path is the explicit `continue_captured_event(capture_ref)` callable with a caller-supplied exact ref. The `&mut self` contract serializes admission. The callable checks `stop_signal` and `progress` before acquiring a permit or constructing a task. A stopped runtime or an existing `InFlight` value rejects the call before application invocation or second-task creation. Because the current exact callable accepts the body-free ref by value, rejection consumes only that transient Rust value;it does not delete, mutate or mark the durable `CapabilityEventCaptureRecord`. The caller must retain or reload the same exact ref from its own durable authority before any later submission, and Worker may not replace it with a current ref.

After the pre-admission gate, the callable acquires one global permit. A permit-driver failure maps once to `WorkerError::local_source(WorkerSourceKind::CollaborationContinuation, failure.into_source())`;no application call or continuation state exists. It then calls `task_spawner.new_event()` and injects that event into `CapabilityWorkerContinuationCompletion::new(completed)`. Event construction failure releases the permit and maps to the same existing Worker source boundary. The completion constructor never selects Tokio, creates a runtime or falls back to a different event implementation.

After the event exists, the callable constructs one `CapabilityWorkerContinuationTask`,stores `InFlight { completion }`,and synchronously moves the guarded task into `task_spawner.spawn_continuation`. The task owns the exact ref,facade and permit inside one invocation future. `spawn_continuation` has an all-or-error scheduling contract: `Ok(())` means the runtime owns the guarded task independently of caller cancellation;`Err(failure)` means no application poll occurred. On `Err`,dropping the returned call's consumed task triggers its guard before local ownership ends;the caller then restores `Idle` and returns `WorkerError::local_source(WorkerSourceKind::CollaborationContinuation, failure.into_source())`. The guard's internal source-only fallback is not returned instead of the exact spawn failure and cannot invoke application code.

`CapabilityWorkerContinuationTask::new` constructs and arms `CapabilityWorkerContinuationCompletionGuard` **outside** the async body,then moves that guard and the one invocation into the opaque unit-output future. The guard therefore exists even when a spawner rejects the task before its first poll. The future awaits the invocation once,then calls `guard.complete(result)` synchronously before returning. `complete` invokes `complete_once`,marks `terminal_written = true`,and only then lets the guard drop. If the future is instead dropped by spawn rejection、runtime cancellation or stack unwinding,the armed guard's `Drop` calls `complete_runtime_termination_once()`,which stores the existing `WorkerError::local_source(WorkerSourceKind::CollaborationContinuation, None)` and signals the same event. `into_future` is the only runtime handoff and exposes no ref、facade、permit or completion mutator.

The opaque future drop path deliberately uses `source = None`:after unwind/cancellation there is no transport-independent typed concrete cause that Worker may safely preserve,and panic/cancellation text must not be parsed or persisted. `complete_once` and `complete_runtime_termination_once` return `true` only for the single successful assignment;the guard has one normal writer and treats `false` as an internal invariant defect,never as permission to overwrite a result. Process abort,forced kill or allocator abort need not run `Drop` and cannot be reported as successful completion. This design requires no pin-projection helper or unsafe field projection:the concrete runtime receives the already pinned opaque future from `into_future`.

The completion state has one legal sequence: `Pending -> Completed(exact result) -> Taken`. Either normal completion or the armed drop guard owns the first transition;only `take_result` owns the second. `complete_once` returns `false` for `Completed` or `Taken` and never signals again. `take_result` returns `None` for `Pending` or `Taken`,so callers must first await the irreversible event and treat an event/state contradiction as an internal Worker invariant defect rather than waiting again、invoking application again or fabricating an outcome.

After successful spawn,the caller observes completion for `observation_budget`;if that budget expires,it keeps waiting on the same completion. If the caller itself cancels its wait,`InFlight` remains owned by the task set while the guarded task continues. Normal result、application error、panic unwinding and runtime cancellation therefore all signal one terminal carrier;none can leave a live process permanently parked in `InFlight`. A later `continue_captured_event` while `InFlight` is rejected before a second task or application call;the caller must use `drain_in_flight()` to observe and consume the original result before submitting another exact ref. `drain_in_flight` never accepts a ref and never invokes application code. Once either observation path takes the result,it synchronously returns progress to `Idle` before its next await point.

This boundary never scans captures, persists or queues refs, schedules retries or starts work on its own. The exact ref is not duplicated merely for supervision;it is moved into the one application invocation. `shutdown` rejects new admission, waits on the same completion when `InFlight`, consumes its exact result and returns any exact `WorkerError` to the task-set aggregate. A successful outcome may be discarded only at this shutdown observation boundary after the application facade has already returned;it is not converted to acceptance evidence or a delivery state.

`CapabilityWorkerShutdownFailure` is a private aggregation carrier, not a third `WorkerError` variant. Every retained cause carries an exact closed boundary, so skipped Disabled slots do not make a compact failure vector ambiguous. Shutdown first records exact feed-stop `WorkerError` values, then the continuation terminal cause, then six source join causes in the order fixed by §105.5. The first exact `WorkerError` in that complete sequence becomes `primary`;earlier or later runtime-only causes and every later exact Worker error remain intact inside `additional` for Step 15. Only when no operation returned an exact Worker error may the aggregator create one existing `WorkerError::local_source` with `source = None` from the first runtime-only boundary, using `CollaborationContinuation` for continuation or `InboundEnvelope` for a source task;the original non-cloneable runtime cause and its boundary remain intact in `additional`. No new variant is introduced and no error text is parsed or flattened.

`from_ordered_causes` returns `None` only for an empty vector. It scans without reordering:if any `Worker` cause exists,it removes the first such error as `primary`,copies its boundary into `primary_boundary`,and retains every other cause in original relative order. If all causes are runtime-only,it synthesizes the existing local-source primary from the first cause's boundary and retains the complete original vector in `additional`. `into_parts` is the only consuming accessor and returns all three owned components together;there is no callable that consumes only the primary and silently drops diagnostics.

### 105.2 Runtime start callable and ownership transition

```rust
impl CapabilityWorkerRuntime {
    /// Starts all enabled named source runners and returns only a complete task set.
    pub(crate) async fn start(
        self,
    ) -> Result<CapabilityWorkerTaskSet, CapabilityWorkerCompositionError>;
}
```

`start(self)` consumes the unstarted runtime, so a successful task set and an unstarted runtime cannot coexist. The Worker-local supervisor was selected by the binary composition root and retained inside the continuation seed at `from_handoff`;it is absent from the infra handoff and every `CapabilityInboundSourceRunner`. During `start`,the same supervisor `Arc` is moved into the explicit continuation runtime and cloned only into each enabled spawned source-loop future for its `yield_now()` call and runtime task ownership. It is not added to the runner or `CapabilityWorkerSourceTask` fields and never crosses into infra/application or a protocol carrier. The bootstrap calls `map_worker_composition_error` exactly once on any returned error;`start` itself does not emit `WorkerError` or fabricate a protocol invocation. It follows this fixed order:

```text
take the retained Worker-local supervisor from the continuation seed
  -> create stop event from that same supervisor
     -> failure: RuntimePrimitiveUnavailable { StopSignal, exact private source }
  -> create activation event from that same supervisor
     -> failure: RuntimePrimitiveUnavailable { ActivationBarrier, exact private source }
  -> create one stop signal and one unreleased activation controller/waiter
  -> prepare governance parked task + stop handle if runner Some
  -> prepare method parked task + stop handle if runner Some
  -> prepare downstream parked task + stop handle if runner Some
  -> prepare external-capability parked task + stop handle if runner Some
  -> prepare audit parked task + stop handle if runner Some
  -> prepare external-document parked task + stop handle if runner Some
  -> validate prepared count == enabled runner count
  -> spawn governance task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { governance consumer, exact private source }
  -> spawn method task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { method consumer, exact private source }
  -> spawn downstream task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { downstream consumer, exact private source }
  -> spawn external-capability task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { external-capability consumer, exact private source }
  -> spawn audit task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { audit consumer, exact private source }
  -> spawn external-document task parked on its activation waiter if prepared
     -> runtime failure: TaskStartFailed { external-document consumer, exact private source }
  -> verify every enabled named slot has exactly one parked task and stop handle
  -> convert the retained continuation seed with the shared stop signal
  -> construct the complete task set while all source tasks remain parked
  -> release the activation controller exactly once
  -> return complete CapabilityWorkerTaskSet
```

Preparing or spawning a parked task cannot fetch a delivery, call application or acquire a permit. Only activation `Released` allows source loops to begin. Disabled fields stay `None` throughout preparation, parked spawn, activation and shutdown. The continuation runtime is not accessible until the complete task set is returned, so no continuation call can race the spawn prefix.

### 105.3 Partial-start failure rollback

Most runtimes can fail while spawning a later task after earlier task handles exist. The activation barrier makes that prefix side-effect-free:earlier tasks are parked and cannot interact with a source or application before all enabled task handles are present. The prefix is temporary internal startup state only and must never escape as a successful partial Worker.

```text
on any prepare/spawn/coverage failure,retain that exact composition error as original:
  -> abort activation before any release
  -> request shared stop immediately
  -> call every prepared/spawned feed stop handle in fixed named order
     -> append each failure as SourceStop { exact slot,exact CapabilitySourceFailure }
  -> never spawn remaining task closures
  -> join every already spawned parked task in fixed named order
     -> append exact task error as TaskJoinWorker { exact slot,exact WorkerError }
     -> append runtime join error as TaskJoinRuntime { exact slot,private source }
  -> drop all remaining unstarted runners and opaque source handles
  -> call original.with_ordered_startup_cleanup_causes(cleanup_causes)
     -> empty cleanup causes: return the unchanged original error
     -> non-empty cleanup causes: return StartupCleanupFailed { failure }
bootstrap
  -> map_worker_composition_error(error)
  -> InfraError::RuntimeAssembly
```

| Failure point | May any task have started? | Required cleanup | Returned surface |
|---|---:|---|---|
| stop / activation event construction | no | drop all unstarted runners and retained handles;no stop/join is required | `RuntimePrimitiveUnavailable { StopSignal | ActivationBarrier }`,then mapper |
| task preparation / named coverage | no task or parked tasks only;zero source/application work | abort,stop prepared feeds,join parked tasks,drop unspawned runners | `CapabilityWorkerCompositionError`,then mapper -> startup error |
| first through fifth spawn | parked prefix only;zero source/application work | abort,stop/join parked prefix,do not spawn suffix | `TaskStartFailed`,then mapper -> startup error |
| sixth spawn / final coverage before release | all enabled tasks may be parked;zero source/application work | abort,stop/join all parked tasks | `TaskStartFailed` or `IncompleteWorkerGraph`,then mapper |
| cleanup stop/join also fails | parked only;zero delivery/application side effect | continue fixed-order best-effort cleanup and retain all private causes | `StartupCleanupFailed`,then mapper -> one startup error |
| activation release succeeds | enabled tasks may begin work | startup cannot report later source failure as composition failure | complete task set;later errors remain invocation/shutdown failures |

No startup failure may return `CapabilityWorkerTaskSet`, `WorkerError`, receipt, processing action or application issue. Exact cleanup source failures、parked-task `WorkerError` values and runtime join causes remain nested inside the startup-only typed aggregate;they do not escape as invocation results. Because release occurs only after final coverage,no startup rollback path can have fetched a delivery or called application code;there is therefore no racing delivery to classify. No source completion method is called during startup rollback. If a runtime cannot guarantee parked tasks remain inert until the shared decision,composition returns `NonCancellingRuntimeUnsupported { boundary: InboundApplicationInvocation }` before spawn.

### 105.4 Source task loop

Each enabled named task owns one runner and executes:

```text
activation waiter returns Aborted
  -> return cleanly without permit,fetch,decode,application orcompletion
activation waiter returns Released
  -> while stop not requested:
       run runner.run_one(&stop_signal) at most fetch_batch_limit times
         -> DeliveryCompleted: increment completed count;continue only below the limit
         -> EndOfSource from fixture exhaustion or controlled stop: break cleanly
         -> WorkerError: stop this task and return the exact error
       after fetch_batch_limit DeliveryCompleted values:
         -> call task_spawner.yield_now().await once
         -> reset the local completed count and re-check stop before the next fetch
  -> after stop observed:
       runner.request_stop()
       do not admit a new permit or fetch
       any already admitted invocation remains inside run_one and drains to exact terminal result
       return the exact stop/invocation result
```

The source loop does not automatically restart itself after `WorkerError`;a supervisor may decide process policy outside Capability Hub, but it cannot infer retry/quarantine from the error, create a local attempt store or silently replace the source with a fake. A configured feed's unexpected end is already a source failure and follows this same terminal path. A task failure must become operationally visible in Step 15;this batch does not define telemetry fields.

`fetch_batch_limit()` is a positive per-source scheduling fairness bound:after that many successful `DeliveryCompleted` returns, the task must invoke the selected runtime's cooperative yield primitive exactly once before resetting the count. `EndOfSource` or `WorkerError` terminates instead and does not fabricate a yield result. The neutral wrapper remains `fetch_one`;the implementation may not request an unbounded transport batch or create a `Vec`-based protocol registry. `parallelism()` limits dispatch/application/completion invocations plus explicit exact-ref continuations globally;at most one additional bounded delivery per enabled source may be waiting for `acquire_admitted`,and the same feed cursor remains serialized.

### 105.5 Graceful shutdown contract

`CapabilityWorkerTaskSet::shutdown(self)` performs:

```text
request shared cooperative stop once
  -> continuation runtime rejects new exact-ref admission
  -> call every present feed_stop.request_stop() in this exact source-slot order,
     retaining each exact WorkerError without skipping later stops:
       governance
       method
       downstream
       external-capability
       audit
       external-document
  -> source tasks stop new fetch admission;fetches without delivery wake and end
  -> deliveries already fetched continue their non-cancellable admitted-permit wait
  -> each already owned inbound or continuation invocation continues to exact terminal result
  -> valid typed action completes its original delivery exactly once
  -> no-action WorkerError leaves its delivery unresolved
  -> verify/drain continuation runtime after all six feed-stop attempts
  -> join governance task if present
  -> join method task if present
  -> join downstream task if present
  -> join external-capability task if present
  -> join audit task if present
  -> join external-document task if present
  -> select the first exact WorkerError across six feed stops,
     continuation drain,and six task joins as primary
  -> when none is exact WorkerError,create one existing local-source primary
     for the first runtime-only boundary and retain its original runtime cause privately
  -> preserve every other exact Worker/runtime cause in private additional causes
  -> return Ok only when all stop/drain/join operations succeeded
```

Shutdown ordering is fixed for deterministic audit and fake parity;it does not assign business priority. The total observation order is **six named feed stops -> continuation drain -> six named joins**. A failure in any phase does not skip later operations. `CapabilityWorkerShutdownFailure::primary` preserves the first exact `WorkerError` in that total order;when only runtime join causes exist, the synthesized existing local-source primary follows §105.1 and the original cause stays in `additional`. Additional causes remain available only to the process-local Step 15 observer and cannot replace the primary, create another `WorkerError` variant or enter a protocol response.

Shutdown has no numeric grace value in Step 14. `04` must define host signal binding and any finite observation parameters, but an observation expiry still cannot make `shutdown` return while an owned application invocation or delivery is live. If the deployment host eventually performs a forceful process kill, that external termination can prevent completion;it cannot be documented or emitted as successful ack, rollback proof, processing retry, quarantine, test pass or acceptance sign-off.

The task set, source task, join handle, continuation seed/runtime, activation controller/waiter, permit and shutdown failure do not implement `Clone` except the explicitly documented stop signal. Calling `shutdown` consumes the task set. Dropping a live task set without cooperative shutdown is a host integration defect;`Drop` cannot block, fabricate completion or claim all tasks joined. The implementation/host boundary must make explicit shutdown the normal path and test abrupt-stop behavior later without inventing business delivery state.

## 106. Worker batch 2 parity、failure totality 与 stop-review closure

### 106.1 Configured / DeterministicFake / Disabled lifecycle parity

| Lifecycle gate | `Configured` | `DeterministicFake` | `Disabled` | Hard invariant |
|---|---|---|---|---|
| resolved source input | one opaque feed + one immutable matcher | one finite opaque fixture feed + one immutable fixture matcher | no feed、matcher、stop or completion handle | no raw config/ref reaches Worker |
| runner construction | exactly one named `Some(runner)` | exactly one named `Some(runner)` | exact named `None` | wrong child cardinality is startup composition failure |
| task construction | one parked named task | one parked named task | no task | no dynamic registry or unnamed task |
| activation | waits on the same all-enabled release/abort barrier | same | no waiter | no source effect before complete coverage |
| permit gate | same one global gate shared by all enabled runners and continuation | same | no acquisition | configured parallelism is not multiplied per slot |
| encoded-byte gate | full delivery is bounded before and inside Worker | same full encoded-envelope path | no bytes | fake cannot inject a decoded payload |
| actor gate | common family gate;external source-kind refinement on its exact arm | same two matcher call surfaces and negative cases | no actor decision | no always-accept fake and no governance approval call |
| payload/application dispatch | one exact schema-1 arm and one existing application method | same | no dispatch | no generic payload registry or neighboring handler fallback |
| processing action | only a valid existing receipt maps to one of three existing actions | same | none | source/application error cannot select an action |
| completion | one consuming opaque completion call | same semantic completion driver contract | none | no clone、double completion or successful `Drop` |
| normal source end | controlled stop only;uncontrolled physical end is `UnexpectedSourceFailure` | declared fixture exhaustion or controlled stop | not applicable | enabled configured source never ends cleanly by driver exhaustion |
| shutdown | named feed stop,continuation drain,named join | same deterministic order | slot skipped without compact-index ambiguity | one failure never skips later cleanup |

Parity applies to observable classification and ownership, not to a fabricated claim that an external source exists. A deterministic fixture may end after its declared sequence;that finite end is the only branch-specific success behavior. Deployment cannot select the fake branch, and Disabled cannot be used as a missing-config fallback.

### 106.2 Source、action、delivery ownership and failure matrix

| Exact phase / result | Application call count | Delivery ownership after phase | Processing action / physical call | Exact returned surface |
|---|---:|---|---|---|
| stop is observed before source fetch | 0 | none | none | `CapabilityInboundRunnerProgress::EndOfSource` |
| source-runner admitted-permit driver fails | 0 | fetched original delivery unresolved | none | existing `WorkerError::Source(InboundEnvelope)` with private runtime cause |
| legal fixture exhaustion / controlled source stop | 0 | none | none | `CapabilityInboundRunnerProgress::EndOfSource` |
| configured driver ends without controlled stop | 0 | none | none | `CapabilitySourceFailure(UnexpectedSourceFailure)` -> existing `WorkerError::Source(InboundEnvelope)` |
| fetch temporary / timeout / invalid / unexpected failure | 0 | none | none | corresponding closed `CapabilitySourceFailureKind` -> existing Worker source error |
| complete bytes exceed bound or are truncated / contradictory | 0 | original delivery unresolved | none | existing `WorkerError::Source(InboundEnvelope)` |
| header malformed、slot/family mismatch or common actor rejection | 0 | original delivery unresolved | none | existing `WorkerError::Source(InboundEnvelope)` |
| valid header with unsupported schema | 0 | moved into one delivery outcome | existing receipt action `Complete` -> `complete_processing` once | `DeliveryCompleted` only after completion succeeds |
| exact payload malformed / forbidden-body or symmetry failure | 0 | original delivery unresolved | none | existing `WorkerError::Source(PayloadDecoding | InboundEnvelope)` as already classified by dispatcher |
| external source-kind actor refinement rejects | 0 | original delivery unresolved | none;matcher cannot choose Quarantine | existing `WorkerError::Source(InboundEnvelope)` |
| exact application method returns valid receipt | 1 | moved into one `CapabilityInboundDeliveryOutcome` | exhaustive receipt disposition -> exactly one of three consuming methods | `DeliveryCompleted` after physical call success |
| exact application method returns `ApplicationError` | 1 | original delivery unresolved | none | exact existing `WorkerError::Application` |
| receipt identity/effect validation fails | 1 | original delivery unresolved | none | existing Worker source error;no neighboring handler |
| physical completion call fails | 1 | completion driver was consumed;physical outcome remains product-private/unknown | no second completion and no application redispatch | existing `WorkerError::Source(InboundEnvelope)` with typed source failure |

“Unresolved” in this table means Capability Hub has not claimed successful physical completion. It does not authorize Worker to inspect a broker offset, retry flag or lease. A completion-call failure is separately marked unknown because the consuming product operation may have taken effect before returning failure;`04` must bind that typed product behavior without adding a fourth Hub action.

### 106.3 Runtime primitive and task failure totality

| Runtime callable / failure | Lifecycle owner | Exact mapping | Forbidden mapping |
|---|---|---|---|
| `new_permit_driver` during `from_handoff` | startup composition | `RuntimePrimitiveUnavailable { IndependentItemPermitGate, source }` | `WorkerError`、fake fallback or reduced limit |
| `new_event` for stop during `start` | startup composition | `RuntimePrimitiveUnavailable { StopSignal, source }` | source task start or invocation error |
| `new_event` for activation during `start` | startup composition | `RuntimePrimitiveUnavailable { ActivationBarrier, source }` | release a partial task prefix |
| `spawn_source` for one named slot | startup composition | `TaskStartFailed { consumer, source }`;abort/stop/join parked prefix | return partial task set or start suffix |
| startup rollback stop/join failure | startup composition | `StartupCleanupFailed { failure }`;typed aggregate retains exact original + every named source/Worker/runtime cleanup cause | replace original failure、flatten causes or drop later cleanup |
| source `acquire_admitted` runtime failure after fetch | active source task | leave the owned delivery unresolved;existing `WorkerError::Source(InboundEnvelope)` | composition error after activation or stop-cancelled delivery loss |
| continuation `acquire_until_stopped` runtime failure | explicit active callable | existing `WorkerError::Source(CollaborationContinuation)` | application error or new continuation variant |
| continuation `new_event` failure | explicit active callable | existing `WorkerError::Source(CollaborationContinuation)`;no spawn | implicit Tokio selection in completion constructor |
| `spawn_continuation` failure | explicit active callable | guarded task drops before first poll、completion carrier terminalizes、caller restores `Idle` and returns exact spawn source error | detached task、second call or lost durable capture authority |
| supervised continuation panic/cancel | guarded continuation future | armed guard completes the same carrier once with existing collaboration-continuation source error | parse panic text、overwrite a result or leave `InFlight` permanently unobservable |
| feed-stop failure during shutdown | task-set shutdown | exact existing source `WorkerError` tagged with named `SourceFeedStop` boundary | skip later stop/drain/join |
| source/continuation runtime join failure | task-set shutdown | exact `CapabilityWorkerTerminalCause::Runtime` with closed boundary | new `WorkerError` variant or text parsing |

All startup-local `CapabilityWorkerCompositionError` values pass through `map_worker_composition_error` exactly once and become the existing `InfraError::RuntimeAssembly` source chain. After activation release, the same low-level runtime wrapper can only map through an existing `WorkerError` source category or the private shutdown aggregate;it cannot travel backward into startup composition.

### 106.4 Dependency and cardinality audit

| Audit surface | Required cardinality | Batch 2 result |
|---|---:|---|
| workspace members | 7 | unchanged;contracts/domain/application/infra/api/worker/jobs |
| allowed local member edges | 15 | unchanged;`infra -> worker = 0` |
| sibling Cargo dependencies | 1 | only `core-contracts` |
| reviewed third-party crates | 5 | `serde`、`serde_json`、`sha2`、`thiserror`、controlled-reopened `tokio` |
| Tokio direct owners | 1 | `worker` only;`1.52.3`,features exactly `rt,sync,time` |
| application handles in Worker handoff | 2 | inbound consumer + event collaboration |
| named inbound source slots | 6 | each remains an exact named field;no map/registry |
| enabled source tasks | `0..=6` | one per non-Disabled slot after activation release |
| autonomous continuation source tasks | 0 | continuation is caller-admitted only,not a seventh source |
| continuation in-flight cardinality | `0..=1` | `&mut self` + `Idle / InFlight`;no local queue |
| global independent-item permit gates | 1 | shared by six runners and explicit continuation |
| delivery completion authorities | 1 per fetched delivery | non-cloneable and consumed once |
| existing receipt dispositions | 7 | unchanged |
| existing processing actions | 3 | `Complete / RetrySameEvent / Quarantine`;unchanged |
| existing `WorkerError` variants | 2 | `Source / Application`;unchanged |
| local/base + external application Ports | `27 + 9 = 36` | unchanged;runtime wrappers are not Ports |
| public protocols / flows | 83 | unchanged;6 Inbound remain 6/6 |
| public protocol types | 250 | unchanged;assembly/runtime wrappers do not enter this baseline |

The exact Tokio version is a design dependency decision corroborated by the current sibling lockfiles in `quantalithos-work` and `quantalithos-process`. It is not a Capability Hub lockfile, compile result, test result or implementation evidence. At this Worker batch's historical stop point, §25 remained the codec/hash/error binding snapshot and §69~§74 formed a five-crate workspace/member source；Jobs batch `14.5.2.2.3` later added `async-trait` to make the current cumulative source six crates and expanded Tokio ownership to Worker plus Jobs.

### 106.5 Structure comment and Rustdoc audit

| Declaration group | Required documentation | Result |
|---|---|---|
| infra source failure kind/wrapper | enum、4 variants、struct、2 fields、constructor/accessor | pass |
| infra feed driver/end policy/feed/stop/fetch result | every trait/callable、enum/variant/payload、struct/field and wrapper callable | pass |
| infra delivery completion and owned delivery | trait + 3 callables、struct + 2 fields、5 wrapper callables | pass |
| infra trusted-actor matcher | private trait/callables、decision enum/variants、opaque struct/field/callables | pass |
| Worker source-slot and permit wrappers | slot enum/6 variants/3 callables、2 runtime traits、gate/permit fields and callables | pass |
| Worker source runner and delivery outcome | both structs、every field and every constructor/runtime callable | pass |
| Worker runner progress and inbound invocation | enums/variants、terminal/invocation structs、every field and callable | pass |
| stop and activation wrappers | event trait、stop state/signal、activation enum/state/controller/waiter、every field/callable | pass |
| terminal/join/task-spawner wrappers | boundary/cause enums and payload fields、join trait/handle、all 6 spawner callables | pass |
| source task and continuation wrappers | progress/completion state/completion guard/guarded task/seed/runtime/task-set/shutdown structs、every field and callable | pass |
| composition additions | runtime primitive/failure、typed startup cleanup cause/aggregate、composition variants/payload fields/accessors | pass |

No struct field is covered by a group-level “same as above” comment. Every struct/enum/field/variant/variant payload/callable introduced or changed in §§99、103~105 has an English `///`;enum struct-variant payload fields have no field-level `pub`. The startup cleanup aggregate exposes the original plus all causes only through typed accessors/`into_parts`. Continuation `Pending / Completed / Taken` state、guard fields、opaque task field and every helper callable are individually documented. `CapabilityWorkerContinuationCompletion::new` accepts the runtime event explicitly,so it cannot hide an undocumented runtime choice.

### 106.6 Cross-step、historical material and blocker audit

| Item | Status | Current treatment |
|---|---|---|
| Step 5 crate direction | closed | opaque infra wrappers are consumed by Worker;infra-private drivers never import Worker |
| Step 7 application Ports | closed | feed、delivery、permit、task and runtime traits add zero application Ports |
| Step 8 / 9 Inbound protocol and flow | closed `6/6` | byte/header/actor/schema/payload/context/application/receipt order remains exact |
| Step 12 Worker error surface | closed | two variants and five `WorkerSourceKind` values unchanged |
| Step 13 identity/idempotency | closed | transport metadata never forms source/key/digest;same capture ref remains durable authority |
| old concept-only feed/matcher handles | `historical_material_superseded` | replaced by exact opaque wrappers and infra-private drivers in §103 |
| old clean end for configured sources | `historical_material_rejected` | uncontrolled configured end is always `UnexpectedSourceFailure` |
| old `CapabilityWorkerJoinFailure` name | `historical_material_rejected` | active carrier is `CapabilityWorkerShutdownFailure`;search must return no old declaration |
| old `start -> InfraError` wording | `historical_material_rejected` | `start` returns composition error;bootstrap mapper alone creates `InfraError::RuntimeAssembly` |
| Tokio accidentally placed in §25/contracts snippet | `corrected_mechanical_error` | At this historical Worker stop, Tokio existed in §69 root、Worker card/inheritance and the five-crate audit；Jobs batch `14.5.2.2.3` later extends the current owner/audit set without restoring the §25 error |
| runtime/tools execution、marketplace listing、governance approval、method body、SDK client | `historical_material_excluded` | none enters feed、dispatcher、task or continuation ownership |
| L0-core idempotency / serde debts | `non_blocking` | existing two debt records remain;semantic change reopens their owning steps |
| concrete transport/product and numeric shutdown binding | `04_handoff` | not an upstream blocker;must be selected and tested in configuration design/implementation |
| unresolved upstream blocker | `none` | no upstream truth、Port、protocol or dependency decision blocks this batch |

### 106.7 Formal `03` §13 assembly source increment

Step 19 must append the following immediately after the Worker composition source in §101.4. This remains calibration material and does not modify formal `03` in this batch.

```markdown
#### 13.8.1 Worker neutral delivery and supervised lifecycle

Infra resolves each enabled inbound source into an opaque serialized feed,immutable trusted-actor matcher and transport-private completion authority. Worker can fetch one bounded complete envelope,evaluate the closed matcher and consume one product-neutral completion method,but cannot inspect or downcast endpoint、credential、topic、group、partition、offset、lease、attempt or concrete ack metadata. One non-cloneable delivery owns both encoded bytes and exactly one completion handle;`Drop` is never successful completion.

Configured and deterministic-fake branches use the same byte/header/actor/schema/payload/application/receipt path. Only deterministic fixture exhaustion or controlled stop may return clean `EndOfSource`;an uncontrolled configured-source end is `UnexpectedSourceFailure`. A valid typed receipt maps exhaustively to the existing `Complete / RetrySameEvent / Quarantine` actions and exactly one consuming completion call. Source or application errors without a valid action leave Capability Hub unable to claim physical completion and cannot choose an action from error text.

Worker starts up to six enabled named source tasks behind one release-or-abort activation barrier. All task handles and named coverage must exist before release;any primitive or spawn failure aborts the parked prefix,stops/joins it in fixed order and maps through `CapabilityWorkerCompositionError -> InfraError::RuntimeAssembly`. One global permit gate bounds independent deliveries and explicit exact-ref continuation together.

The event-collaboration continuation is caller-admitted and single-flight,not a seventh source task,scan,queue or retry scheduler. The selected Worker supervisor injects its non-panicking completion event;an armed guard is created before spawn and moves with the admitted call,so normal result、spawn rejection、panic unwind and runtime cancellation each terminalize the same `Pending -> Completed -> Taken` carrier at most once. Caller cancellation and timeout only change observation timing and never detach,reinvoke or replace the exact capture ref.

Graceful shutdown performs six named feed-stop attempts,then drains the continuation,then joins six named tasks. It preserves the first exact existing `WorkerError` as primary and every other exact/runtime cause in a private boundary-tagged aggregate;it adds no `WorkerError` variant. At this historical Worker stop, Tokio was a Worker-only implementation dependency pinned to `1.52.3` with only `rt,sync,time`；Jobs batch `14.5.2.2.3` later adds Jobs as the second direct owner while preserving the same feature set. Concrete Tokio types still cannot cross either entry-private runtime boundary.
```

### 106.8 Batch completion gate and stop snapshot

| Completion gate | Result | Source |
|---|---|---|
| neutral feed / matcher / delivery wrappers are exact and cycle-free | pass | §§102.4、103.1~103.6 |
| one-delivery ownership and three-action completion are exhaustive | pass | §§104.2、104.4、106.2 |
| trusted actor common/refinement order is exact | pass | §§103.5、104.5 |
| configured unexpected end cannot masquerade as clean exhaustion | pass | §§103.3、104.3、106.1 |
| six source tasks share one global permit and one activation decision | pass | §§104.1、105.1~105.3 |
| partial start has zero source/application side effects and typed all-cause cleanup retention | pass | §§99.1、105.3 |
| inbound timeout drains the same owned future | pass | §104.6 |
| continuation is single-flight and terminalizes on normal/drop paths after admission | pass | §105.1、§106.3 |
| runtime primitive/spawn/join failure mappings are total | pass | §§105.2~105.5、106.3 |
| shutdown stop/drain/join order and primary retention are fixed | pass | §§105.1、105.5 |
| Tokio root/member placement and owner cardinality are exact | pass | §§69~74、106.4 |
| structure comments / English Rustdoc | pass | §106.5 |
| runtime execution/tools/marketplace/governance approval/method body/SDK excluded | pass | §106.6 |
| formal `03` modified | no | formal assembly remains Step 19 |
| `04` / implementation ledger / boundary skeleton created | no | reserved for later formal documents |
| implementation/test/run/evidence/sign-off claimed | no | none produced or claimed |
| unresolved upstream blocker | none | §106.6 |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.2.2.2 Worker batch 2
gate_status = 03_step_14_batch_14_5_2_2_2_worker_batch_2_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
worker_application_handles = 2
worker_named_source_slots = 6
worker_autonomous_continuation_tasks = 0
worker_max_in_flight_continuations = 1
worker_global_permit_gates = 1
worker_processing_actions = 3_existing_actions
worker_error_variants = 2_existing_variants
direct_tokio_members = worker_only
tokio_design_binding = 1.52.3 + rt,sync,time
infra_to_worker_cargo_edges = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_2_2_3_jobs
```

Worker batch 2 在此完成并停审。未经用户再次确认，不进入 `14.5.2.2.3 Jobs`、`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03` 装配、`04-配置设计.md`或任何实现产物。

## 107. Batch `14.5.2.2.3` Jobs composition 开工确认与旧契约校正

### 107.1 授权、读取门禁与本批范围

用户已明确同意从 Worker batch 2 停审点进入 `14.5.2.2.3 Jobs`。本批只闭合 Jobs-specific application service bundle、infra neutral handoff、Jobs-owned handler facade、complete-or-error runtime factory、八个 typed one-shot runner、non-cancelling invocation ownership、delivery / host-exit mapping和dependency / Rustdoc审计；不进入 `14.5.2.3` 的跨 entry最终blocking matrix，也不修改正式 `03-详细设计.md`。

| 已读取输入 | 本批采用的 exact 事实 | 本批不得改变 |
|---|---|---|
| 详细设计 SOP Step 14、书写规范 §5.13 | 配置读取owner、注入点、timeout/retry、依赖不可用和跨仓依赖必须能直接落到代码绑定 | 不写 raw key、数值默认值、scheduler产品或完整配置手册 |
| Step 4 / Step 5 | `jobs` 是七member之一，拥有one-shot runner、report/delivery mapping和`JobError`；`infra`拥有config/runtime builder | 不新增第八个crate，不建立`infra -> jobs`反向edge，不把Jobs runner移入infra |
| Step 8 §11 | `CapabilityOperationsJobHandlers`有8个exact入口method；`CapabilityOperationsJobService`有8个exact application method；request / response及schema `1`已闭合 | 不新增Job、通用`execute`、request字段、response variant或public error |
| Step 9 §§35~39 | 八条Job flow拥有planning、journal、target、final、replay和no-truth-repair算法 | Jobs entry不扫描repository、不构造UoW、不重排target、不拼report |
| Step 12 §§40~44 | `JobError`只有`Source` / `Application`；startup composition只归`InfraError::RuntimeAssembly`；safe terminalization由application durable authority决定 | 不新增timeout/retry/scheduler error variant，不把technical return伪造成report |
| Step 13 | same normalized key / digest / run / journal exact reentry；typed completed report只replay | 不生成新run/key、scope、target或attempt state |
| Step 14 §§60~66 | 八臂dispatch、header-first gate、typed delivery、host schedule boundary和durable-proof-only retry已定义 | 本批只校正composition、ownership和runtime lifecycle，不改变8/8协议矩阵 |
| Step 14 §§76~85 | Stage 5形成application service，Stage 6形成Jobs parameters，Stage 7由Jobs root消费neutral handoff | `infra`不构造Jobs-owned handler/runtime，不返回partial graph |

本批完成后必须停审。不得自动进入 `14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式 `03`、`04`、implementation ledger或planned boundary skeleton。

### 107.2 SOP 八问在 Jobs composition 的裁决

| SOP问题 | 本批裁决 |
|---|---|
| 1. 哪些模块读取Jobs配置？ | raw source只由`infra/config.rs`读取；`infra/runtime_builder.rs`复制validated `CapabilityJobsEntryParameters`并构造application service bundle；Jobs root只调用typed accessor。 |
| 2. 哪些参数进入Jobs root？ | 完整`CapabilityJobsEntryParameters`与一个complete `CapabilityOperationsJobService` handle进入handoff。`planning_page_limit`和private `runner_retry`已在Stage 5注入同一个application service；Jobs root只通过public accessor消费request byte bound和one-time monotonic run deadline duration。没有`target_parallelism`。 |
| 3. 谁实现`CapabilityOperationsJobHandlers`？ | Jobs crate内的concrete `CapabilityOperationsJobHandlerFacade`。它静态委托一个application service的8个method；infra不得命名或构造该concrete facade。 |
| 4. 谁拥有deadline和async runtime？ | Jobs binary composition root构造并独占一个Tokio current-thread runtime；`CapabilityJobsRuntime`持有其`Handle`并只在该runtime被持续drive期间接收调用。Tokio只拥有monotonic deadline、one owned invocation task、terminal notification和join；不拥有scheduler、business cancellation或journal。 |
| 5. runner何时可以retry？ | Jobs entry自动retry授权恒为零，因为8个handler return surface没有durable safe-reentry proof carrier。validated `runner_retry`只注入application-owned Job service内部的safe-reentry controller；只有该层基于journal/UoW authority证明“未形成typed response且exact reentry安全”后，才可在同一次service call内使用bounded policy。 |
| 6. timeout/cancellation如何表达？ | admission前可停止且零application call；dispatch后由Jobs-owned Tokio task继续拥有同一个invocation到terminal。deadline只分类before/after，不abort、重调、伪造rollback、target terminal或typed `Retryable`。 |
| 7. startup与invocation错误如何分离？ | service/parameter/Tokio runtime/coverage不完整为Jobs-local composition error，再单向映射`InfraError::RuntimeAssembly`；合法调用后的application error只为`JobError::Application`。 |
| 8. scheduler / trigger如何进入？ | physical scheduler、cron、queue、lease和ack完全留host。Jobs runtime接收一段完整owned bytes；logical trigger/job name/schema都来自contracts-ownedrequest authority。 |

### 107.3 旧措辞与前序占位的受控校正

| 旧位置 / wording | 问题 | 本批权威校正 |
|---|---|---|
| §62.1 `CapabilityJobsRuntime::new(...)->Result<Self, InfraError>` | entry crate直接返回infra error，混淆composition-local source与startup owner | Jobs factory先返回`CapabilityJobsCompositionError`；bootstrap mapper再单向形成`InfraError::RuntimeAssembly` |
| §62.3 “infra constructs `Arc<dyn CapabilityOperationsJobHandlers>`” | 会把Jobs-owned entry facade放入infra或要求infra命名Jobs implementation | infra只交付`CapabilityJobsApplicationServices`；Jobs root构造concrete handler facade |
| §62.1 runtime同时保存handler和`planning_page_limit` | planning page已在Stage 5注入application Job service，runner保存副本会留下第二消费点 | handoff参数仍完整可审计；factory校验provenance后runtime只保留request byte limit、run observation duration和handler；不保存或访问private retry policy |
| §64.1 “timeout后等待cooperative cancellation” | 容易被实现为drop/abort handler future；旧批次没有闭合direct async runtime | 本批受控回开§§68~74并固定Jobs-owned Tokio current-thread runtime；同一owned task继续到terminal，timeout/caller cancellation只停止当前观察 |
| §64.2 private durable-proof carrier“如实现需要可引入” | 当前handler签名没有该proof，若让entry从error猜proof会越权 | 本批固定entry-level proof carrier不存在、entry自动retry授权为零；policy由application service内部基于现有durable authority消费。若未来需要让entry重放bytes，必须回开Step 8/12/13/14 |
| Step 4 `runtime_builder.rs`“组装handler和runner” | 与七member cycle-free方向冲突 | 作为`historical_material`；runtime builder只组装application service和neutral handoff，entry handler/runner归Jobs |

这些校正不修改前序8个Job的protocol、flow、journal、disposition或error基线；它们只替代无法按当前Cargo方向落码的composition wording。后续正式§13必须采用本批结论，不得重新采用§62.1 / §62.3的旧字面语义。

### 107.4 本批声明分类与基线

| 声明 | owner / visibility | 生命周期 | 是否进入public / persisted baseline |
|---|---|---|---|
| `CapabilityJobsApplicationServices` | `application::services`, `pub`字段private | Stage 5形成，Jobs facade构造后只由`Arc`继续持有 | 否；assembly-only bundle |
| `CapabilityJobsEntryHandoff` | `infra::runtime_builder`, `pub`字段private | Stage 7形成并被Jobs factory消费一次 | 否；neutral handoff |
| `CapabilityOperationsJobHandlerFacade` | `jobs::handlers`, `pub(crate)` | Jobs runtime lifetime | 否；existing trait concrete implementation |
| `CapabilityJobsExecutor` / terminal cell / completion guard | `jobs::runtime`, `pub(crate)` | binary-owned current-thread runtime handle and one admitted invocation | 否；concrete Tokio-private technical boundary |
| `CapabilityJobsRuntime` | `jobs::composition`, `pub(crate)` | one-shot process invocation owner；只保存public request limit / run timeout and cannot access infra-private retry fields | 否；entry runtime |
| `CapabilityJobsCompositionError` | `jobs::composition`, `pub(crate)` | startup only | 否；不进入`JobError` / protocol |
| `CapabilityJobsInvocationTerminal` / timing | `jobs::runtime`, `pub(crate)` | one accepted invocation terminalization | 否；process-local observation |
| `CapabilityJobsHostExit` | `jobs::delivery`, `pub(crate)` | delivery到host的纯映射 | 否；不是scheduler protocol或business state |

本批不新增public protocol type、application Port、repository、UoW method、business object、state enum或`ApplicationError` / `JobError` variant。所有新增或修改的struct、field、enum、variant、payload、trait、callable都必须带英文 `///`；不能以“同上”代替字段注释。

## 108. Application service bundle 与 infra neutral handoff

### 108.1 `CapabilityJobsApplicationServices`

Jobs entry只需要一个完整的application service object。该bundle归`crates/application/src/services.rs`；它不实现Job协议、不形成context、不持有entry参数，也不暴露service背后的repository / UoW / Port。

```rust
/// Complete application service handles required by the operations-jobs entry.
#[derive(Clone)]
pub struct CapabilityJobsApplicationServices {
    /// Application service implementing all eight closed operations-job flows.
    operations_jobs: std::sync::Arc<dyn CapabilityOperationsJobService + Send + Sync>,
}

impl CapabilityJobsApplicationServices {
    /// Creates a complete Jobs service bundle from the required application service.
    pub fn from_parts(
        operations_jobs: std::sync::Arc<dyn CapabilityOperationsJobService + Send + Sync>,
    ) -> Self;

    /// Returns a cloned application operations-job service handle.
    pub fn operations_jobs(
        &self,
    ) -> std::sync::Arc<dyn CapabilityOperationsJobService + Send + Sync>;
}
```

`from_parts`没有`Option`、map、vector、generic `ApplicationFacade`或downcast入口。`operations_jobs()`只clone trait-object `Arc`，不复制service truth、不创建第二个journal owner，也不允许Jobs entry取得service内部依赖。

### 108.2 `CapabilityJobsEntryHandoff`

以下一次性交接carrier归`crates/infra/src/runtime_builder.rs`。它只在Stage 0~6全部完成、selected entry确认为Jobs且application Job service的8个callable coverage完整后构造。

```rust
/// Complete Jobs-specific neutral handoff produced after runtime assembly.
pub struct CapabilityJobsEntryHandoff {
    /// Validated request, planning, deadline, and application-owned retry parameters.
    parameters: CapabilityJobsEntryParameters,
    /// Complete application service handles required by the Jobs root.
    application_services: CapabilityJobsApplicationServices,
}

impl CapabilityJobsEntryHandoff {
    /// Creates a complete Jobs handoff after the application graph passes all startup gates.
    pub(crate) fn new(
        parameters: CapabilityJobsEntryParameters,
        application_services: CapabilityJobsApplicationServices,
    ) -> Self;

    /// Returns the validated Jobs parameters before the handoff is consumed.
    pub fn parameters(&self) -> &CapabilityJobsEntryParameters;

    /// Consumes the handoff and transfers typed parameters plus services to the Jobs root.
    pub fn into_parts(
        self,
    ) -> (
        CapabilityJobsEntryParameters,
        CapabilityJobsApplicationServices,
    );
}
```

`CapabilityJobsEntryHandoff`不实现`Clone`。`into_parts(self)`是唯一消费入口；Jobs factory不得保留一个handoff副本、把它交还infra、从中抽出service后重新读取config，或为八个runner各复制一套参数。tuple只是固定的两项ownership transfer；不得替换为`HashMap`、`serde_json::Value`、`dyn Any`或entry-union。

### 108.3 Stage 5~7 exact handoff order

```text
Stage 5 application graph
  -> construct one CapabilityOperationsJobService implementation
     with planning_page_limit and runner_retry bound inside its application-owned
     scan / safe-reentry control path
  -> audit all eight application methods and required Port graph
  -> CapabilityJobsApplicationServices::from_parts(service)

Stage 6 Jobs branch
  -> require selected entry == Jobs
  -> copy one validated CapabilityJobsEntryParameters
  -> prove planning_page_limit and runner_retry were already bound into the same
     service constructor

Stage 7 neutral handoff
  -> CapabilityJobsEntryHandoff::new(parameters, application_services)
  -> transfer the non-clone handoff to the Jobs binary composition root
  -> infra retains no Jobs handler, dispatcher, runner, host trigger, or request bytes
```

`planning_page_limit`和`runner_retry`的“同一值”证明发生在Stage 5/6 builder stack内：application service constructor消费该parameter block中的private technical values，handoff接收同一个validated parameter block的owned copy。Jobs root只执行public typed parameter完整性校验；它不读取repository验证page / retry行为，不访问private policy accessor，也不把page或attempt policy保存为另一个业务authority。application内部safe-reentry controller不能递归调用public handler；它只可在同一个service flow内依据exact journal/UoW proof继续原调用。

### 108.4 Handoff content exclusion audit

| 可携带 | 不可携带 |
|---|---|
| one `CapabilityJobsEntryParameters` | raw config、section ref、environment、CLI、schedule ref |
| one complete `CapabilityJobsApplicationServices` | repository、UoW、Clock、IdGenerator、resolver、handoff/collaboration Port |
| opaque typed retry policy already inside parameters | retry attempt state、proof flag、error classifier、sleep driver |
| typed request byte/page/deadline bounds | scheduler client、queue message、lease、ack、cron expression |

handoff构造失败只返回startup source；不创建`JobError`、`CapabilityJobResponse`、report、journal、run、issue ref、evidence alias或host success。

## 109. Jobs-owned handler facade 与 8/8 delegation

### 109.1 Concrete facade declaration

`CapabilityOperationsJobHandlers`是Step 8既有entry trait；它的concrete implementation归Jobs crate。facade只持有一个application service handle，所有method都执行同样的closed metadata guard、context construction和exact service delegation，但八臂必须在源码中静态可见。

```rust
/// Jobs-owned facade implementing all eight closed operations-job handler methods.
pub(crate) struct CapabilityOperationsJobHandlerFacade {
    /// Application service that owns planning, journal, target, and final-report flows.
    service: std::sync::Arc<dyn CapabilityOperationsJobService + Send + Sync>,
}

impl CapabilityOperationsJobHandlerFacade {
    /// Creates the complete handler facade from one application service handle.
    pub(crate) fn new(
        service: std::sync::Arc<dyn CapabilityOperationsJobService + Send + Sync>,
    ) -> Self;

    /// Converts the concrete facade into the existing closed handler trait surface.
    pub(crate) fn into_handlers(
        self: std::sync::Arc<Self>,
    ) -> std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>;
}
```

The concrete implementation block is mandatory and uses the same fixed lowering as the trait:

```rust
#[async_trait::async_trait]
impl CapabilityOperationsJobHandlers for CapabilityOperationsJobHandlerFacade {
    // All eight existing methods are implemented with the exact Step 8 signatures.
}
```

The comment inside this compact implementation skeleton does not replace method-level English `///` in implementation source when those methods are written out. It records only the required attribute placement；the eight exact methods and their Rustdoc are governed by §109.2 and Step 8 §11.4.

每个trait method的固定delegation顺序为：

```text
receive one complete CapabilityJobRequest<T>
  -> assert exact job name for this method
  -> assert schema version == 1
  -> assert metadata run/key/actor/trace structural validity
  -> construct one CapabilityOperationName from the closed job name
  -> CapabilityOperationContext::from_job(
       operation_name, actor_context, run_id, trace_id, idempotency_key)
  -> move the original request.body once into the matching service method
  -> return the complete CapabilityJobResponse<R> or exact ApplicationError
```

facade可以移动metadata字段来形成context和移动body给service，但不得从字段重新构造第二个`CapabilityJobRequest<T>`、覆盖run/key/actor/trace、调用Clock/IdGenerator、读repository、创建UoW、计算digest、形成target或组装response。request-level invalid shape按Step 8既有pre-body `Rejected`语义的唯一application-owned normalizer处理；raw decode、unknown job name、unsupported schema和method/body crossed mapping仍在facade前形成`JobError::Source`，不能伪造一个reportlessresponse绕过entry source boundary。

### 109.2 Eight exact handler-to-service bindings

| # | handler method | exact application service method | request body -> response detail | forbidden alternate |
|---:|---|---|---|---|
| 1 | `run_capability_registry_reconciliation` | same name | `RunCapabilityRegistryReconciliationJobInput` -> `CapabilityRegistryReconciliationJobResult` | registry Command、generic reconciliation |
| 2 | `refresh_controlled_consumer_view` | same name | `RefreshControlledConsumerViewJobInput` -> `ControlledConsumerViewRefreshJobResult` | exposure mutation、runtime cache refresh |
| 3 | `rebuild_directory_search_browse_projection` | same name | `RebuildDirectorySearchBrowseProjectionJobInput` -> `DirectorySearchBrowseProjectionRebuildJobResult` | marketplace listing、registry backfill |
| 4 | `prepare_audit_friendly_export_summary` | same name | `PrepareAuditFriendlyExportSummaryJobInput` -> `AuditFriendlyExportPreparationJobResult` | raw audit/evidence export |
| 5 | `rebuild_read_only_ecosystem_discovery_summary` | same name | `RebuildReadOnlyEcosystemDiscoverySummaryJobInput` -> `ReadOnlyEcosystemDiscoveryRebuildJobResult` | marketplace transaction/listing |
| 6 | `run_derived_material_reconciliation` | same name | `RunDerivedMaterialReconciliationJobInput` -> `DerivedMaterialReconciliationJobResult` | automatic rebuild / truth repair |
| 7 | `refresh_external_reference_resolution` | same name | `RefreshExternalReferenceResolutionJobInput` -> `ExternalReferenceResolutionRefreshJobResult` | external body copy、relation/exposure mutation |
| 8 | `repair_capability_access_event_collaboration` | same name | `RepairCapabilityAccessEventCollaborationJobInput` -> `CapabilityAccessEventCollaborationRepairJobResult` | new capture/event、second intent、local delivery state |

### 109.3 Handler coverage audit rule

Factory的8/8 coverage gate是compile-time/static mapping audit，不是运行期逐methodprobe。不得为了“检查handler可调用”在startup生成fake request、run id、actor、trace、key或application invocation。实现者必须以八个named runner constructor arm和上表的一一映射证明coverage；缺一个arm即`MissingHandlerCoverage`并阻断runtime。

| audit dimension | expected | forbidden escape |
|---|---:|---|
| handler trait methods | 8 | default method、wildcard fallback |
| application service methods | 8 | generic `run(kind, Value)` |
| concrete facade fields | 1 exact service | per-Job repository/Port/client fields |
| context factory path | 1 existing `from_job` path | runner-generated metadata、CLI override |
| direct truth repair callable | 0 | Command synthesis、domain/repository bypass |

## 110. Complete-or-error Jobs runtime factory

### 110.1 Concrete Tokio executor、deadline and terminal ownership

本批受控回开 §§68~74：Jobs member直接依赖Tokio `1.52.3`，features固定为`rt,sync,time`。Jobs binary创建一个current-thread runtime并在同一OS thread上以`CapabilityJobsProcess::run`持续drive它；不接收外部Tokio `Handle`，也不允许host在任意runtime中单独调用`CapabilityJobsRuntime::run_once`。这使spawn、timer、terminal event与join的具体owner在当前Step闭合，而不把scheduler或transport并入Jobs。

```rust
/// Jobs-local terminal timing for one accepted process invocation.
#[derive(Clone, Copy, Eq, PartialEq)]
pub(crate) enum CapabilityJobsInvocationTiming {
    /// The whole-run deadline elapsed before application dispatch was admitted.
    AdmissionEndedBeforeDispatch,
    /// Admission produced an exact Jobs source error before application dispatch.
    AdmissionRejectedBeforeDispatch,
    /// The owned invocation completed before the original whole-run deadline.
    CompletedBeforeRunDeadline,
    /// The original deadline elapsed and the same owned invocation later completed.
    DrainedAfterRunDeadline,
    /// A Tokio task or terminal primitive failed before an exact delivery was observed.
    RuntimeFailedBeforeTerminal,
}

/// Terminal carrier returned after the original invocation can no longer be detached.
pub(crate) struct CapabilityJobsInvocationTerminal {
    /// Process-local timing class for the one original invocation.
    timing: CapabilityJobsInvocationTiming,
    /// Optional exact Capability Hub delivery; admission-only expiry has no delivery.
    delivery: Option<CapabilityJobsDelivery>,
    /// Optional runtime cause retained only in the nonpublic process-local source chain.
    source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
}

impl CapabilityJobsInvocationTerminal {
    /// Creates an admission-only terminal without a Capability Hub delivery.
    pub(crate) fn admission_ended_before_dispatch() -> Self;

    /// Creates an admission rejection carrying one exact pre-dispatch Jobs error.
    pub(crate) fn admission_rejected_before_dispatch(error: JobError) -> Self;

    /// Creates a terminal whose exact delivery completed before the original deadline.
    pub(crate) fn completed_before_run_deadline(
        delivery: CapabilityJobsDelivery,
    ) -> Self;

    /// Creates a terminal whose same exact invocation drained after the deadline.
    pub(crate) fn drained_after_run_deadline(
        delivery: CapabilityJobsDelivery,
    ) -> Self;

    /// Creates a terminal for a Tokio or terminal-state failure without a delivery.
    pub(crate) fn runtime_failed(
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Returns the process-local observation timing without changing the terminal carrier.
    pub(crate) fn timing(&self) -> CapabilityJobsInvocationTiming;

    /// Consumes the terminal and returns timing, delivery, and runtime source together.
    pub(crate) fn into_parts(
        self,
    ) -> (
        CapabilityJobsInvocationTiming,
        Option<CapabilityJobsDelivery>,
        Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    );
}

/// Closed process-invariant failure for an impossible terminal field combination.
#[derive(Debug, thiserror::Error)]
pub(crate) enum CapabilityJobsTerminalInvariantError {
    /// Admission expiry carried a delivery or runtime source despite no dispatch.
    #[error("admission expiry carried an unexpected terminal payload")]
    InvalidAdmissionExpiryShape,
    /// Admission rejection lacked its technical error or carried a forbidden payload.
    #[error("admission rejection carried an invalid terminal payload")]
    InvalidAdmissionRejectionShape,
    /// A completed or drained invocation lacked its exact delivery or carried a source.
    #[error("completed invocation carried an invalid terminal payload")]
    InvalidInvocationCompletionShape,
    /// Runtime failure incorrectly carried a Capability Hub delivery.
    #[error("runtime failure carried an unexpected Capability Hub delivery")]
    InvalidRuntimeFailureShape,
}

/// Host-only source preserving one terminal invariant and an optional prior runtime cause.
#[derive(Debug, thiserror::Error)]
#[error("Jobs terminal mapping failed: {invariant}")]
pub(crate) struct CapabilityJobsTerminalMappingFailure {
    /// Closed invariant violated by the consumed terminal field combination.
    invariant: CapabilityJobsTerminalInvariantError,
    /// Optional earlier runtime cause retained beneath the invariant failure.
    #[source]
    source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
}

impl CapabilityJobsTerminalMappingFailure {
    /// Creates one host-only mapping failure while preserving the earlier runtime source.
    pub(crate) fn new(
        invariant: CapabilityJobsTerminalInvariantError,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;
}

/// Host-only failure raised when the owned task cannot publish its normal terminal once.
#[derive(Debug, thiserror::Error)]
#[error("Jobs owned task found its terminal cell already completed")]
pub(crate) struct CapabilityJobsTerminalWriteConflict;

/// Host-only failure raised when a successfully joined task has no consumable terminal.
#[derive(Debug, thiserror::Error)]
pub(crate) enum CapabilityJobsTerminalTakeFailure {
    /// The task joined successfully but the terminal cell was still pending or already taken.
    #[error("Jobs terminal was missing after successful task join")]
    MissingAfterSuccessfulJoin,
}

/// Host-only wrapper preserving an owned-task join error and discarded-cell audit bit.
#[derive(Debug, thiserror::Error)]
#[error("Jobs owned task join failed; terminal payload discarded: {discarded_terminal_present}")]
pub(crate) struct CapabilityJobsJoinFailure {
    /// Original Tokio join error retained as the nonpublic runtime source.
    #[source]
    join_error: tokio::task::JoinError,
    /// Whether one contradictory terminal payload was consumed and withheld from the host.
    discarded_terminal_present: bool,
}

impl CapabilityJobsJoinFailure {
    /// Preserves one join error and whether a terminal payload had to be discarded.
    pub(crate) fn new(
        join_error: tokio::task::JoinError,
        discarded_terminal_present: bool,
    ) -> Self;
}

/// Host-only failure raised when `run_once` returns while shutdown still drains an invocation.
#[derive(Debug, thiserror::Error)]
#[error("Jobs process found a residual invocation after run_once returned")]
pub(crate) struct CapabilityJobsProcessDrainConflict;

/// Non-resettable Tokio monotonic deadline created before byte admission.
pub(crate) struct CapabilityJobsRunDeadline {
    /// Original monotonic deadline shared by admission and post-dispatch observation.
    deadline: tokio::time::Instant,
}

impl CapabilityJobsRunDeadline {
    /// Creates one deadline by checked addition without using wall-clock time.
    pub(crate) fn try_start(
        maximum: std::time::Duration,
    ) -> Result<Self, CapabilityJobsRunDeadlineError>;

    /// Returns whether the original whole-run deadline has elapsed.
    pub(crate) fn is_elapsed(&self) -> bool;

    /// Returns the original monotonic deadline without extending or resetting it.
    pub(crate) fn deadline(&self) -> tokio::time::Instant;
}

/// Jobs-local failure to form the one finite monotonic run deadline.
#[derive(Debug, thiserror::Error)]
pub(crate) enum CapabilityJobsRunDeadlineError {
    /// Checked monotonic addition overflowed for the validated duration.
    #[error("validated job run duration overflowed the monotonic clock")]
    MonotonicDeadlineOverflow,
}

/// Single-assignment terminal state shared by one owned task and its observer.
pub(crate) enum CapabilityJobsTerminalState {
    /// No task result or runtime-termination result has been written.
    Pending,
    /// Exactly one task result or runtime-termination result has been written.
    Completed(
        /// Exact terminal written by the only successful writer.
        CapabilityJobsInvocationTerminal,
    ),
    /// The one completed terminal has already been consumed by the runtime owner.
    Taken,
}

/// Shared single-assignment terminal cell for one owned Jobs invocation.
pub(crate) struct CapabilityJobsTerminalCell {
    /// Synchronously protected `Pending -> Completed -> Taken` state.
    state: std::sync::Mutex<CapabilityJobsTerminalState>,
    /// One-observer notification with a stored permit after terminal publication.
    ready: tokio::sync::Notify,
}

impl CapabilityJobsTerminalCell {
    /// Creates one pending terminal cell before an owned task is spawned.
    pub(crate) fn new() -> std::sync::Arc<Self>;

    /// Synchronously stores the first exact terminal and then notifies the sole observer.
    pub(crate) fn complete_once(
        &self,
        terminal: CapabilityJobsInvocationTerminal,
    ) -> bool;

    /// Synchronously stores the runtime-termination fallback when the cell is still pending.
    pub(crate) fn complete_runtime_termination_once(&self) -> bool;

    /// Waits in a state-check loop so notification cannot be lost between check and await.
    pub(crate) async fn wait_completed(&self);

    /// Synchronously consumes the completed terminal exactly once after observation.
    pub(crate) fn take_terminal(&self) -> Option<CapabilityJobsInvocationTerminal>;
}

/// Pre-spawn guard that terminalizes an owned invocation if its task body is dropped.
pub(crate) struct CapabilityJobsCompletionGuard {
    /// Single-assignment terminal cell that must become observable on every task exit path.
    terminal: std::sync::Arc<CapabilityJobsTerminalCell>,
    /// True only after the normal invocation result has been stored successfully.
    terminal_written: bool,
}

impl CapabilityJobsCompletionGuard {
    /// Arms the guard before the async task body is constructed or spawned.
    pub(crate) fn new(
        terminal: std::sync::Arc<CapabilityJobsTerminalCell>,
    ) -> Self;

    /// Synchronously stores one normal terminal and disarms the fallback writer.
    pub(crate) fn complete(
        &mut self,
        terminal: CapabilityJobsInvocationTerminal,
    ) -> bool;
}

impl Drop for CapabilityJobsCompletionGuard {
    /// Writes the nonpublic runtime-termination fallback when normal completion did not win.
    fn drop(&mut self);
}

/// Exact response identity copied before the public request is moved into its handler.
pub(crate) struct CapabilityJobsExpectedResponseIdentity {
    /// Closed dispatch arm selected by the accepted header.
    kind: CapabilityJobsDispatchKind,
    /// Contracts-owned copy of the complete accepted request metadata authority.
    metadata: CapabilityJobMetadata,
}

impl CapabilityJobsExpectedResponseIdentity {
    /// Copies one dispatch arm and its contracts-owned response-validation metadata.
    pub(crate) fn from_metadata(
        kind: CapabilityJobsDispatchKind,
        metadata: &CapabilityJobMetadata,
    ) -> Self;

    /// Returns the closed dispatch arm expected from the typed response.
    pub(crate) fn kind(&self) -> CapabilityJobsDispatchKind;

    /// Returns the contracts-owned metadata copy used only for response validation.
    pub(crate) fn metadata(&self) -> &CapabilityJobMetadata;
}

/// Owned `'static` invocation future created from cloned handlers and one moved request.
pub(crate) type CapabilityJobsOwnedInvocationFuture = std::pin::Pin<
    Box<dyn std::future::Future<Output = CapabilityJobsDelivery> + Send + 'static>,
>;

/// Tokio-owned observer for one independently running Jobs invocation task.
pub(crate) struct CapabilityJobsOwnedInvocation {
    /// Single-assignment terminal cell shared with the owned task guard.
    terminal: std::sync::Arc<CapabilityJobsTerminalCell>,
    /// Join handle retained only for normal completion or graceful drain;it is never aborted.
    join: tokio::task::JoinHandle<Result<(), CapabilityJobsTerminalWriteConflict>>,
    /// Original whole-run deadline used to classify completion timing without resetting it.
    deadline: tokio::time::Instant,
}

impl CapabilityJobsOwnedInvocation {
    /// Waits until the original deadline or the same invocation terminal is first observed.
    pub(crate) async fn observe_terminal(&self) -> bool;

    /// Cancel-safely drains the same task and takes its terminal while retaining ownership.
    pub(crate) async fn drain(
        &mut self,
    ) -> CapabilityJobsInvocationTerminal;
}

/// Cancel-safe owner that restores one observed invocation to the runtime on drop.
pub(crate) struct CapabilityJobsInFlightObservationGuard<'a> {
    /// Runtime progress slot temporarily set to `Consumed` while observation owns the task.
    progress: &'a mut CapabilityJobsRuntimeProgress,
    /// Exact owned invocation restored to `InFlight` unless final drain completes.
    invocation: Option<CapabilityJobsOwnedInvocation>,
}

impl<'a> CapabilityJobsInFlightObservationGuard<'a> {
    /// Takes the exact `InFlight` invocation without losing any nonmatching progress state.
    pub(crate) fn try_take(
        progress: &'a mut CapabilityJobsRuntimeProgress,
    ) -> Option<Self>;

    /// Returns the exact invocation for non-consuming deadline observation.
    pub(crate) fn invocation(&self) -> &CapabilityJobsOwnedInvocation;

    /// Returns the exact invocation for cancel-safe terminal drain and join.
    pub(crate) fn invocation_mut(&mut self) -> &mut CapabilityJobsOwnedInvocation;

    /// Marks a fully drained invocation consumed so drop does not restore it.
    pub(crate) fn finish_consumed(&mut self);
}

impl Drop for CapabilityJobsInFlightObservationGuard<'_> {
    /// Restores the same owned invocation to `InFlight` after observer cancellation.
    fn drop(&mut self);
}

/// Jobs-private Tokio executor bound to the binary-owned current-thread runtime.
pub(crate) struct CapabilityJobsExecutor {
    /// Handle of the current-thread runtime that `CapabilityJobsProcess::run` keeps driving.
    handle: tokio::runtime::Handle,
}

impl CapabilityJobsExecutor {
    /// Binds the executor only when called inside the Jobs-owned current-thread runtime.
    pub(crate) fn bind_current() -> Result<Self, CapabilityJobsCompositionError>;

    /// Transfers one `'static` invocation to an owned task before returning its observer.
    pub(crate) fn spawn_owned(
        &self,
        deadline: CapabilityJobsRunDeadline,
        invocation: CapabilityJobsOwnedInvocationFuture,
    ) -> CapabilityJobsOwnedInvocation;
}

/// Binary-owned Jobs process that keeps the current-thread runtime alive through final drain.
pub(crate) struct CapabilityJobsProcess {
    /// Tokio current-thread runtime exclusively owned by this one-shot process.
    runtime: tokio::runtime::Runtime,
    /// Complete Jobs runtime created and executed only inside `runtime.block_on`.
    jobs: CapabilityJobsRuntime,
}

impl CapabilityJobsProcess {
    /// Builds the current-thread Tokio runtime and the complete Jobs graph before host receive.
    pub(crate) fn from_handoff(
        handoff: CapabilityJobsEntryHandoff,
    ) -> Result<Self, CapabilityJobsCompositionError>;

    /// Drives one owned request and drains any admitted task before returning to the host.
    pub(crate) fn run(
        mut self,
        request_bytes: Box<[u8]>,
    ) -> CapabilityJobsHostExit;
}
```

`CapabilityJobsRunDeadline::try_start`调用`tokio::time::Instant::now().checked_add(maximum)`；overflow为invocation-time host-only runtime failure并阻断当前request，不能saturate到无限期。deadline不可`Clone`且没有`remaining()`或reset callable。admission在byte check、header decode、header validation和selected body decode后分别调用`is_elapsed()`；任一次为true都返回`AdmissionEndedBeforeDispatch`，零application call、零`JobError`、零report。

`CapabilityJobsExecutor::bind_current`要求`Handle::try_current()`成功且`runtime_flavor() == RuntimeFlavor::CurrentThread`。`CapabilityJobsProcess::from_handoff`先用`Builder::new_current_thread().enable_time().build()`构造runtime，再在该runtime的`block_on`内部绑定executor和调用`CapabilityJobsRuntime::from_handoff`；任何runtime build/bind失败都进入`CapabilityJobsCompositionError -> InfraError::RuntimeAssembly`。host不得注入multi-thread handle，也不得在current-thread runtime停止drive后保留`CapabilityJobsRuntime`。

`spawn_owned`先创建terminal cell和`CapabilityJobsCompletionGuard`，再把guard与owned invocation一起移入唯一`async move` task；因此guard在`Handle::spawn`前已armed。Tokio `Handle::spawn`没有可恢复的spawn-error返回面：成功返回`JoinHandle`即runtime拥有task；若调用本身panic，unwind会drop尚未启动的task future及其guard，process仍不能声称delivery。task body只await同一个owned invocation；完成后以original Tokio `Instant`判断`CompletedBeforeRunDeadline`或`DrainedAfterRunDeadline`，同步写terminal：`guard.complete(terminal) == true`时返回`Ok(())`，`false`时返回`Err(CapabilityJobsTerminalWriteConflict)`。deadline observation使用`tokio::time::timeout_at(deadline, terminal.wait_completed())`，只取消可重建的notification wait，不把owned application future按值交给timeout，也不drop、abort、替换或重调handler。

`CapabilityJobsCompletionGuard::Drop`不能await，因此terminal cell必须使用`std::sync::Mutex<CapabilityJobsTerminalState>`。`complete_once`、`complete_runtime_termination_once`和`take_terminal`在无await的短临界区内通过`lock().unwrap_or_else(std::sync::PoisonError::into_inner)`取得state；poison recovery只接受已经处于三个closed variants之一的state，不从error text猜terminal。Drop可同步等待该短锁并完成first-writer fallback，不存在`try_lock`失败后永久遗失通知的分支。normal completion、panic unwind、runtime task cancellation和join fallback都竞争同一个`Pending -> Completed` transition，任何later writer只得到`false`且不得覆盖terminal。

`CapabilityJobsTerminalCell::complete_once`先在mutex内完成state write，释放lock后只调用`Notify::notify_one()`。本runtime恰有一个observer；`notify_one`在observer尚未poll时保留一个permit，避免`notify_waiters()`的无permit丢通知。`wait_completed`每轮必须先创建`notified()`future，再同步检查state，仅在`Pending`时await该future；`Completed/Taken`立即返回。`take_terminal`只做`Completed -> Taken`；`Pending/Taken`返回`None`。observer在successful join后仍取不到值是process invariant，只能形成runtime failure，不能重调application。

`CapabilityJobsOwnedInvocation::observe_terminal`只返回“original deadline前是否观察到terminal”，不改变terminal timing和delivery。`drain(&mut self)`先等待terminal，再cancel-safely await同一个`&mut JoinHandle`，最后同步take once；调用future在任一await被取消时，`CapabilityJobsInFlightObservationGuard`仍拥有join、cell和deadline并在Drop中恢复原`InFlight` slot。process abort、forced kill或allocator abort无法保证Drop，不能声称success、rollback或report。

`drain` 的 terminal / join / take 次序是唯一算法，不允许实现自行交换：

```text
terminal.wait_completed().await
  -> await &mut join exactly once
  -> if join == Ok(Ok(())):
       take_terminal() exactly once
       -> Some(terminal): return that exact terminal
       -> None: return RuntimeFailedBeforeTerminal(
            CapabilityJobsTerminalTakeFailure::MissingAfterSuccessfulJoin)
  -> if join == Ok(Err(write_conflict)):
       call take_terminal() exactly once only to consume and discard any cell payload
       return RuntimeFailedBeforeTerminal(write_conflict)
  -> if join == Err(join_error):
       call take_terminal() exactly once only to consume and discard any cell payload
       return RuntimeFailedBeforeTerminal(
         CapabilityJobsJoinFailure { join_error, discarded_terminal_present })
```

`JoinHandle` failure has absolute host-level precedence because the task did not finish through the required owned-task boundary. Even if the completion guard or normal path wrote a delivery first, that payload is consumed only to prevent a second take and is never returned to the host；the join source is preserved under `CapabilityJobsJoinFailure`. A successful join followed by `Pending` or `Taken` is `CapabilityJobsTerminalTakeFailure`, not a second wait、panic、default delivery or application re-dispatch. `complete_once == false` on the normal task path is likewise a task invariant failure: the task returns only after retaining a local `CapabilityJobsTerminalWriteConflict` source, so the subsequent join cannot make the earlier cell payload deliverable. First-writer storage prevents overwrite；runtime-failure precedence prevents a contradictory first write from escaping as a valid response.

`CapabilityJobsProcess::run` destructures its owned `runtime` and `jobs`, then performs one outer `runtime.block_on(async move { ... })`;it does not stop driving the current-thread runtime between calls. Inside that one block it executes `jobs.run_once(request_bytes).await` and then unconditionally executes `jobs.shutdown().await` as the final no-detached-task gate. The legal result is `(run_once_terminal, None)` because straight-line `run_once` already drains its admitted invocation. A residual `Some(shutdown_terminal)` contradicts the runtime lifecycle：both potentially unsafe terminals are discarded and replaced by `CapabilityJobsInvocationTerminal::runtime_failed(Some(Box::new(CapabilityJobsProcessDrainConflict)))`. After `block_on` returns the one selected terminal, `run` calls `map_jobs_host_exit` synchronously and returns only `CapabilityJobsHostExit`. There is no `block_on(run_once)` followed by dropping the runtime、no `shutdown_background`、and no host callback between dispatch and final drain.

### 110.2 Jobs runtime and composition error declarations

```rust
/// Complete Jobs runtime for one closed operations-job invocation at a time.
pub(crate) struct CapabilityJobsRuntime {
    /// Closed handler facade covering all eight operations-job methods.
    handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
    /// Maximum encoded request bytes accepted before typed body decoding.
    request_body_limit: usize,
    /// Whole-run duration used once to create the non-resettable Tokio deadline.
    run_timeout: std::time::Duration,
    /// Concrete Jobs-private owner of the admitted Tokio invocation task.
    executor: CapabilityJobsExecutor,
    /// One-shot lifecycle retaining an admitted invocation across caller cancellation.
    progress: CapabilityJobsRuntimeProgress,
}

/// Jobs-local one-shot lifecycle for one complete runtime instance.
pub(crate) enum CapabilityJobsRuntimeProgress {
    /// The runtime has not accepted its one encoded request.
    Ready,
    /// The runtime owns one admitted invocation until its terminal carrier is taken.
    InFlight {
        /// Opaque observer for the exact invocation already owned by the Tokio task.
        invocation: CapabilityJobsOwnedInvocation,
    },
    /// The runtime has consumed its only request and terminal delivery.
    Consumed,
}

/// Startup-local failure while composing a complete Jobs runtime.
#[derive(Debug, thiserror::Error)]
pub(crate) enum CapabilityJobsCompositionError {
    /// The selected entry does not provide valid Jobs parameters.
    #[error("selected entry did not provide valid Jobs parameters")]
    EntryParametersMismatch,
    /// The application operations-job service handle is absent or from the wrong graph.
    #[error("application operations-job service graph is incomplete")]
    IncompleteApplicationService,
    /// One closed Jobs handler or runner arm is missing from static coverage.
    #[error("closed Jobs handler or runner coverage is incomplete")]
    MissingHandlerCoverage {
        /// Closed dispatch kind whose handler or runner arm is absent.
        kind: CapabilityJobsDispatchKind,
    },
    /// The header, body, response, or trigger mapping is not exactly eight-way symmetric.
    #[error("Jobs dispatch graph is not exactly eight-way symmetric")]
    IncompleteDispatchGraph,
    /// The Jobs-owned Tokio current-thread runtime could not be constructed.
    #[error("Jobs-owned Tokio current-thread runtime construction failed")]
    RuntimeBuildFailed {
        /// Nonpublic Tokio or I/O source retained only for startup diagnostics.
        #[source]
        source: Box<dyn std::error::Error + Send + Sync + 'static>,
    },
    /// The Jobs executor was not bound inside its owned current-thread runtime.
    #[error("Jobs executor was not bound inside its owned runtime")]
    CurrentRuntimeUnavailable,
    /// The bound Tokio runtime is not the required current-thread flavor.
    #[error("Jobs executor was bound to an unsupported Tokio runtime flavor")]
    UnsupportedRuntimeFlavor,
}

impl CapabilityJobsRuntime {
    /// Consumes one complete Jobs handoff and constructs the all-or-error runtime.
    pub(crate) fn from_handoff(
        handoff: CapabilityJobsEntryHandoff,
        executor: CapabilityJobsExecutor,
    ) -> Result<Self, CapabilityJobsCompositionError>;

    /// Runs one complete owned encoded request through the closed one-shot dispatcher.
    pub(crate) async fn run_once(
        &mut self,
        request_bytes: Box<[u8]>,
    ) -> CapabilityJobsInvocationTerminal;

    /// Drains the one admitted invocation after caller cancellation without invoking it again.
    pub(crate) async fn drain_in_flight(
        &mut self,
    ) -> Option<CapabilityJobsInvocationTerminal>;

    /// Drains any admitted invocation before graceful process exit.
    pub(crate) async fn shutdown(self) -> Option<CapabilityJobsInvocationTerminal>;
}

/// Maps one Jobs composition failure to the existing startup-owned infrastructure error.
pub(crate) fn map_jobs_composition_error(
    error: CapabilityJobsCompositionError,
) -> InfraError;
```

当前Jobs runtime没有完整`CapabilityJobsEntryParameters` field、retry-proof field、attempt counter、delay primitive或自动重放callable。`from_handoff`只读取并保存public `request_body_limit()`和`run_timeout()`；它只读取`planning_page_limit()`做positive/provenance gate后立即丢弃parameter block，且无法访问crate-private `runner_retry()`。validated retry policy已由Stage 5注入application-owned safe-reentry controller。一个完整typed response，包括`Retryable`，到达entry后只允许交付，不能回流成第二次handler调用。

### 110.3 Exact factory sequence

```text
receive one CapabilityJobsEntryHandoff inside the Jobs-owned current-thread runtime
  -> CapabilityJobsExecutor::bind_current()
  -> consume handoff.into_parts()
  -> validate request_body_limit > 0, planning_page_limit > 0, run_timeout > 0
  -> prove planning_page_limit and runner_retry were injected into the same
     application service graph before handoff
  -> obtain exactly one CapabilityOperationsJobService Arc
  -> construct CapabilityOperationsJobHandlerFacade::new(service)
  -> wrap facade in Arc and convert through into_handlers()
  -> audit eight dispatch kinds, eight schema/name/body decoders,
     eight handler methods, eight typed response variants and eight runner arms
  -> copy request_body_limit and run_timeout through public accessors
  -> drop the complete CapabilityJobsEntryParameters block
     -> planning_page_limit was already bound and is not retained
     -> Jobs cannot name or read the infra-private runner_retry accessor
  -> retain the concrete current-thread CapabilityJobsExecutor
  -> initialize progress = Ready
  -> return one complete CapabilityJobsRuntime
```

factory不得调用handler、生成request、建立journal、启动scheduler或保存host trigger。任一步失败都丢弃本地`Arc`和typed values并返回一个composition error；不返回含7个runner的partial runtime，也不把某个missing arm变成runtime `JobError`。parameter block在factory内完成provenance gate后被drop，private `CapabilityRetryPolicy`既不会跨crate命名，也不会在Jobs runtime中留下inactive副本。

一个runtime实例只接受一段owned request bytes。`Ready -> InFlight -> Consumed`是Jobs-private technical lifecycle，不是persisted state，也不计入Step 10 state baseline。oversize / malformed input在dispatch前直接`Ready -> Consumed`并返回`admission_rejected_before_dispatch(error)`；deadline expiry before dispatch直接`Ready -> Consumed`并返回host-only no-delivery；合法dispatch在`spawn_owned`返回observer后立即进入`InFlight`。`run_once`正常观察并drain terminal后进入`Consumed`；若调用方取消，observation guard把同一个owned invocation恢复为`InFlight`，只允许`drain_in_flight`或`shutdown`继续等待。`Consumed`上的第二次`run_once`不调用decoder/handler，返回admission-rejected `JobError::Source(ApplicationDispatch, None)`；它不会创建第二个run或把host misuse映射成public `Rejected`。

`run_once`进入`Ready`后先调用`CapabilityJobsRunDeadline::try_start(self.run_timeout)`，再做byte/header/body gate；checked-add overflow形成`CapabilityJobsRunDeadlineError::MonotonicDeadlineOverflow`并经`CapabilityJobsInvocationTerminal::runtime_failed(Some(source))`交给host，零decode、零application call。dispatch future形成后将同一个deadline消费进`executor.spawn_owned`，因此不可重置的deadline覆盖admission、typed decode、dispatch、application call和delivery mapping，但只分类观察时机，不取消application。任何实现若在dispatch时重新构造deadline、使用duration重新启动timer或使用wall-clock回拨延长期限，均不符合本批。

### 110.4 Composition failure mapping

| failure | detection | required mapping | forbidden result |
|---|---|---|---|
| wrong selected entry / invalid typed wrapper | handoff/factory | `CapabilityJobsCompositionError::EntryParametersMismatch` -> `InfraError::RuntimeAssembly` | `JobError`、Rejected response |
| application Job service absent/wrong graph | Stage 5/7 | `IncompleteApplicationService` -> startup error | no-op service、fake success |
| any of 8 handler/runner/response arms absent | static audit | `MissingHandlerCoverage` / `IncompleteDispatchGraph` -> startup error | seven-arm runtime、string fallback |
| Tokio current-thread runtime build fails | process factory | `RuntimeBuildFailed { source }` -> startup error | fallback runtime、host-injected handle |
| executor is outside current runtime / wrong flavor | process factory | `CurrentRuntimeUnavailable` / `UnsupportedRuntimeFlavor` -> startup error | multi-thread/transitive runtime、future abort |
| duration cannot form finite Tokio deadline | request pre-dispatch | `CapabilityJobsRunDeadlineError::MonotonicDeadlineOverflow` inside host-only runtime terminal | startup error、saturating infinite timer、`JobInput` |
| Jobs entry implementation attempts auto-retry | static design / implementation audit | implementation不符合本批；回开Step 8/12/13/14后才可增加proof surface | parse error text、retry typed `Retryable`、访问private policy |
| mapper itself receives composition source | bootstrap | preserve source under`InfraError::RuntimeAssembly` | `JobError::Application`、report、evidence |

`map_jobs_composition_error`只做单向startup mapping，并把Jobs-local error保留在nonpublic source chain。它不能调用`JobError::local_source`或`from_application`，因为此时没有request invocation。application-owned safe-reentry controller构造失败仍属于Stage 5 `InfraError::RuntimeAssembly`；它不能延迟到第一次Job request才发现。

## 111. Header-first request ownership 与八臂 typed runner

### 111.1 Request bytes、header carrier 与 admission gate

Jobs root接收host交给它的一段完整`Box<[u8]>`。该ownership只覆盖当前one-shot invocation；Jobs不得保存原始bytes、把bytes写入journal、把RawValue作为stored result、或用entry层重新序列化来计算digest。canonical request digest仍由application flow按照Step 8 / Step 13的typed request规则形成。

```rust
/// Decodes the existing borrowed Jobs header before any concrete body decoder runs.
pub(crate) fn decode_jobs_header<'a>(
    request_bytes: &'a [u8],
) -> Result<CapabilityJobsHeaderFirstEnvelope<'a>, JobError>;

/// Decodes one exact body type selected by the closed dispatch kind.
pub(crate) fn decode_jobs_body(
    kind: CapabilityJobsDispatchKind,
    body: &serde_json::value::RawValue,
) -> Result<CapabilityJobsDecodedBody, JobError>;
```

上述两个callable是Jobs-local bounded codec gate，不是第二套public protocol codec。`decode_jobs_header`只使用既有`CapabilityJobMetadata`字段和borrowed `RawValue`；`decode_jobs_body`只能对`CapabilityJobsDispatchKind`的对应arm调用contracts-owned exact decoder。两者都必须拒绝unknown field、缺失required field、unsupported schema、body kind mismatch和raw bytes shape failure；不得使用`serde_json::Value`、`Map<String, _>`、字符串prefix、fallback body或generic deserializer。

Admission固定顺序如下：

```text
1. Create one non-resettable Tokio monotonic deadline before reading request bytes.
2. Check the deadline and request_bytes.len() against request_body_limit.
3. Decode only CapabilityJobsHeaderFirstEnvelope<'_>.
4. Validate header metadata structural shape and schema version == 1.
5. Map metadata.job_name to exactly one CapabilityJobsDispatchKind.
6. Check the same deadline again before concrete body decode.
7. Decode one exact body into CapabilityJobsDecodedBody.
8. Require decoded_body.kind() == dispatch_kind and header identity remains unchanged.
9. Copy one CapabilityJobsExpectedResponseIdentity from accepted metadata.
10. Move the metadata and exact typed body into one CapabilityJobRequest<T>.
11. Clone the handler Arc and build one `async move` owned application future.
12. Transfer that future and the original deadline to CapabilityJobsExecutor::spawn_owned.
```

The header carrier is borrowed only until step 10. After the typed request and expected identity are formed, the `RawValue` borrow and original bytes are dropped; no later runner or application service can access them. A deadline expiry before step 11 produces no application invocation, no Clock / IdGenerator call, no reservation, no journal and no report. It is a host admission observation outcome, not a target failure.

### 111.2 Source mapping for admission failures

| admission condition | dispatch | exact delivery | side effect |
|---|---:|---|---|
| monotonic deadline cannot be formed | no | `CapabilityJobsInvocationTerminal { RuntimeFailedBeforeTerminal, delivery: None, source }` | no decode, no application call |
| deadline expires before byte check, header completion or body decode | no | `CapabilityJobsInvocationTerminal::admission_ended_before_dispatch()` | no reservation, journal, report or generated id |
| bytes exceed `request_body_limit` | no | `JobError::Source(JobInput, ...)` | no body allocation or typed decode |
| header malformed / unknown field / missing metadata | no | `JobError::Source(JobInput, ...)` | no `from_job`, no repository or Port call |
| unknown `job_name` | no | `JobError::Source(JobInput, ...)` | no fallback arm |
| schema is not `1` | no | `JobError::Source(UnsupportedSchema, ...)` | body remains undecoded |
| body malformed or crossed with selected kind | no | `JobError::Source(JobInput, ...)` | no neighboring handler |
| valid envelope but application flow rejects a typed scope / target | yes | complete application `CapabilityJobResponse` with `Rejected` and `report=None` where Step 8 permits | application owns any safe rejection persistence; runner only delivers |

The last row is deliberately different from the preceding rows. A valid typed request has entered the existing application handler and the application may form the protocol-defined `Rejected` response according to its own flow. Jobs must not manufacture that response for a header or codec error, and must not convert `JobError::Source` into a reportless `CapabilityJobResponse`.

### 111.3 Exact dispatch and typed request construction

`CapabilityJobsRuntime::run_once`的dispatch body必须保持八个静态arm。§63.1的borrowed-`self` callable已由本批取代；以下八个private associated callable接收owned handler `Arc`、owned expected identity和owned request，因此返回future天然满足`'static`，不借用`CapabilityJobsRuntime`。

```rust
impl CapabilityJobsRuntime {
    /// Runs one owned registry-reconciliation request through the matching handler.
    fn run_registry_reconciliation_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned controlled-view refresh request through the matching handler.
    fn run_controlled_consumer_view_refresh_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RefreshControlledConsumerViewJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned directory-projection rebuild request through the matching handler.
    fn run_directory_search_browse_projection_rebuild_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned audit-export preparation request through the matching handler.
    fn run_audit_friendly_export_preparation_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned ecosystem-discovery rebuild request through the matching handler.
    fn run_ecosystem_discovery_rebuild_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned derived-material reconciliation request through the matching handler.
    fn run_derived_material_reconciliation_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned external-reference refresh request through the matching handler.
    fn run_external_reference_resolution_refresh_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Runs one owned event-collaboration repair request through the matching handler.
    fn run_capability_access_event_collaboration_repair_owned(
        handlers: std::sync::Arc<dyn CapabilityOperationsJobHandlers + Send + Sync>,
        expected: CapabilityJobsExpectedResponseIdentity,
        request: CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>,
    ) -> CapabilityJobsOwnedInvocationFuture;

    /// Converts one pre-dispatch source error into an immediate consumed terminal.
    fn terminal_from_job_source(error: JobError) -> CapabilityJobsInvocationTerminal;

    /// Observes and then consumes the exact invocation already stored in `InFlight`.
    async fn observe_and_take_in_flight(&mut self) -> CapabilityJobsInvocationTerminal;
}
```

每个`run_*_owned`在返回前clone一个handlers `Arc`，随后构造`Box::pin(async move { ... })`；future只拥有handler、expected identity和request，不借用runtime。future调用唯一matching handler，将`ApplicationError`映射为`JobError::from_application`，将matching response包入唯一typed variant，调用`validate_jobs_response_symmetry(&expected, &typed)`，最后调用`map_jobs_delivery`。没有generic body或generic response helper。

`terminal_from_job_source`只接受already-classified `JobError`并调用`CapabilityJobsInvocationTerminal::admission_rejected_before_dispatch(error)`；它不接受deadline expiry、application result或runtime source。`observe_and_take_in_flight`先调用`CapabilityJobsInFlightObservationGuard::try_take(&mut progress)`；guard只在原状态恰为`InFlight`时将slot临时置为`Consumed`并取得owned invocation。随后先调用`guard.invocation().observe_terminal().await`记录deadline observation，再调用`guard.invocation_mut().drain().await`等待、join和take同一个terminal。只有terminal完整返回后才调用`finish_consumed()`；任何await取消都会先drop当前borrow，再由guard Drop把同一个invocation恢复到`InFlight`，无second spawn、second handler或terminal丢失。

dispatch arm在构造request前通过`CapabilityJobsExpectedResponseIdentity::from_metadata(kind, &metadata)`调用contracts-owned `metadata.copy_for_response_validation()`复制完整metadata；然后原metadata只移动一次。expected identity只暴露`kind()`和`metadata()`，Jobs source不直接命名`JobRunId`、`IdempotencyKey`、`ActorContext`或`TraceId`，因此不新增`core-contracts` direct edge。不得重新生成`run_id`、根据host trigger覆盖`job_name`、将expected identity写入journal，或把八臂改成`Box<dyn Fn(Value)>` / string registry。

### 111.4 Eight runner coverage and effect boundary

| # | dispatch arm | existing runner | handler method | typed response variant | runner-owned action |
|---:|---|---|---|---|---|
| 1 | `RunCapabilityRegistryReconciliation` | `run_registry_reconciliation_owned` | `run_capability_registry_reconciliation` | `CapabilityJobsTypedResponse::RunCapabilityRegistryReconciliation` | delegate exact request; validate matching response |
| 2 | `RefreshControlledConsumerView` | `run_controlled_consumer_view_refresh_owned` | `refresh_controlled_consumer_view` | `CapabilityJobsTypedResponse::RefreshControlledConsumerView` | delegate exact request; validate matching response |
| 3 | `RebuildDirectorySearchBrowseProjection` | `run_directory_search_browse_projection_rebuild_owned` | `rebuild_directory_search_browse_projection` | `CapabilityJobsTypedResponse::RebuildDirectorySearchBrowseProjection` | delegate exact request; validate matching response |
| 4 | `PrepareAuditFriendlyExportSummary` | `run_audit_friendly_export_preparation_owned` | `prepare_audit_friendly_export_summary` | `CapabilityJobsTypedResponse::PrepareAuditFriendlyExportSummary` | delegate exact request; validate matching response |
| 5 | `RebuildReadOnlyEcosystemDiscoverySummary` | `run_ecosystem_discovery_rebuild_owned` | `rebuild_read_only_ecosystem_discovery_summary` | `CapabilityJobsTypedResponse::RebuildReadOnlyEcosystemDiscoverySummary` | delegate exact request; validate matching response |
| 6 | `RunDerivedMaterialReconciliation` | `run_derived_material_reconciliation_owned` | `run_derived_material_reconciliation` | `CapabilityJobsTypedResponse::RunDerivedMaterialReconciliation` | delegate exact request; validate matching response |
| 7 | `RefreshExternalReferenceResolution` | `run_external_reference_resolution_refresh_owned` | `refresh_external_reference_resolution` | `CapabilityJobsTypedResponse::RefreshExternalReferenceResolution` | delegate exact request; validate matching response |
| 8 | `RepairCapabilityAccessEventCollaboration` | `run_capability_access_event_collaboration_repair_owned` | `repair_capability_access_event_collaboration` | `CapabilityJobsTypedResponse::RepairCapabilityAccessEventCollaboration` | delegate exact request; validate matching response |

每一行的response variant必须与request `job_name`、schema `1`、run id和detail `T`严格对称。runner不调用application service以外的对象，不直接访问`CapabilityOperationsJobService`的内部implementation，不创建context，不调用Clock/IdGenerator，不读取repository，不重新执行Step 9 flow。application service内部可以执行既有planning、journal、target、final和application-owned safe reentry，但不能通过entry callback递归调用Jobs handler。

Only the eight `*_owned` callables in this table count toward active runner coverage. The borrowed-`self` names in historical §63.1 are superseded and must not be implemented、counted or exposed alongside them.

## 112. Non-cancelling observation、one-shot lifecycle 与取消恢复

### 112.1 `Ready -> InFlight -> Consumed` exact lifecycle

| lifecycle | owner | allowed operation | forbidden operation |
|---|---|---|---|
| `Ready` | `CapabilityJobsRuntime` | create one run deadline、admission gate、spawn one owned invocation | start second request、创建run/key、调用handler before body gate |
| `InFlight` | Jobs-owned Tokio task + runtime | observe terminal、cancel-safe drain、`drain_in_flight`、graceful `shutdown` | abort、drop join、second handler、new bytes、retry typed response |
| `Consumed` | `CapabilityJobsRuntime` | return exact terminal / host mapping | decode again、调用任何handler、重建report或重置deadline |

`CapabilityJobsRuntimeProgress`是entry-local technical lifecycle，不是Step 10 business truth、Job journal state、scheduler lease、attempt state、delivery state或recovery authority。caller取消`run_once` / `drain_in_flight` observation时，guard Drop必须把progress恢复为`InFlight`；owned Tokio task、join handle、terminal cell和original deadline继续存在于runtime字段中。

### 112.2 Observation procedure

```text
run_once(&mut self, request_bytes)
  -> if progress != Ready: admission-rejected ApplicationDispatch error; no decode/dispatch
  -> create one monotonic run deadline before byte gate
  -> perform admission and construct one exact invocation
  -> executor.spawn_owned(deadline, invocation)
  -> store progress = InFlight before the first observation await
  -> CapabilityJobsInFlightObservationGuard::try_take(progress)
  -> observe the terminal cell against the original deadline
  -> drain the same task, join it, and take the terminal exactly once
  -> finish_consumed before returning
  -> return the exact typed response or exact technical delivery
```

If the caller drops the `run_once` future after `progress = InFlight`, the observation guard restores that same invocation and no `Drop` path may spawn again or release the application invocation. A later host-level recovery call must use `drain_in_flight()` on the same runtime instance; it cannot submit a second request while `InFlight` remains. `drain_in_flight()` repeats only terminal observation/join/take for the same owned task and changes progress to `Consumed` after exact take. It does not accept request bytes or a new duration.

`shutdown(self)` first rejects further admission by consuming the runtime, then waits for an `InFlight` invocation and consumes its terminal carrier. A successful typed response during shutdown is merely observed and returned to the host shutdown boundary; it is not changed to `Completed` evidence, acknowledgement state or a new report. A technical terminal remains the exact `JobError`; shutdown does not aggregate it into a new Job error variant.

### 112.3 Timeout / cancellation matrix

| phase | application called? | timeout / cancellation behavior | authoritative owner |
|---|---:|---|---|
| before bytes accepted | no | no delivery or `JobInput` source delivery; no retry | Jobs admission gate |
| header/body decode | no | stop decode, drop borrowed carrier, return source delivery | Jobs codec gate |
| after exact request, before `spawn_owned` | no | no await/cancellation point is permitted; panic unwinds guard and makes no delivery claim | Jobs executor boundary |
| after `spawn_owned` | yes or may be pending | Tokio task retains same invocation; original deadline may elapse, but exact task is joined and drained | Jobs Tokio task + application authority |
| typed response formed | yes | response is mapped once; never retry disposition | application response + Jobs mapper |
| `ApplicationError` formed | yes | exact `JobError::Application`; no entry retry | application error owner |
| caller cancels while `InFlight` | yes or pending | caller stops observing only; runtime retains task and same terminal carrier | Jobs runtime lifecycle |
| process forced kill | unknown | no completion or success claim is possible; later exact request reentry is application/journal decision | host/process boundary |

Jobs uses only the concrete current-thread Tokio binding in §110.1. It must not call `JoinHandle::abort`、`abort_handle`、`shutdown_background`、`shutdown_timeout` or any cancellation primitive while an invocation is `InFlight`;`CapabilityJobsProcess::run` keeps `runtime.block_on` active until exact terminal drain. There is no `NonCancellingRuntimeUnsupported` branch or alternate runtime fallback. Tokio runtime build/current-runtime/flavor failures are startup composition failures;post-dispatch task/join/terminal invariant failures are host-only runtime failures, never timeout `ApplicationError` or typed `Retryable` responses.

## 113. Typed response symmetry、delivery 与 host exit mapping

### 113.1 Response symmetry validator

```rust
/// Validates that one typed response belongs to the exact dispatched Job request.
pub(crate) fn validate_jobs_response_symmetry(
    expected: &CapabilityJobsExpectedResponseIdentity,
    response: &CapabilityJobsTypedResponse,
) -> Result<(), JobError>;
```

The validator must prove all of the following before creating `CapabilityJobsDelivery::Response`:

1. response union variant matches `expected.kind()`;
2. response `job_name` equals `expected.metadata().job_name`;
3. response schema equals the accepted request schema (`1`);
4. response `run_id` equals `expected.metadata().run_id`;
5. response detail type and report detail match the selected Job;
6. `Rejected` with no body run retains the existing `report=None` rule;
7. every other application response preserves its typed report / issue / refs without runner reconstruction;
8. no response field contains raw request bytes, external body, secret, scheduler name or transport receipt.

Any failed check maps to `JobError::Source(JobSourceKind::JobResultMapping, source)` and the response is not delivered as a failed Job report. The runner must not call a second decoder, read current truth, ask the application to regenerate a response, or change a mismatched response to `Rejected`.

### 113.2 Typed delivery mapping

```rust
/// Maps one completed application result or entry error to the existing Jobs delivery union.
pub(crate) fn map_jobs_delivery(
    result: Result<CapabilityJobsTypedResponse, JobError>,
) -> CapabilityJobsDelivery;
```

`map_jobs_delivery` is exhaustive and has only two output families already defined in §62.2:

| input | exact output | retry / state rule |
|---|---|---|
| validated typed response with `Completed` | `CapabilityJobsDelivery::Response` | deliver once; no runner retry |
| validated typed response with `PartiallyCompleted` | `Response` | deliver exact mixed detail; no runner retry |
| validated typed response with `Failed` | `Response` | deliver exact report; no target rewrite |
| validated typed response with `Retryable` | `Response` | `Retryable` is this run's stored application response, not an entry retry instruction |
| validated `DuplicateReplayed` | `Response` | no application rerun or external call occurred in replay path |
| validated `Rejected` | `Response` | preserve `report=None` / existing rejection surface |
| `JobError::Source` | `TechnicalError` | no report, no journal, no retry from source text |
| `JobError::Application` | `TechnicalError` | preserve exact `ApplicationError`; application/journal recovery remains authoritative |

The delivery union is not serialized by a generic runner codec. If the host requires bytes, the host adapter uses the matching contracts-owned response codec after `Response` is formed; it cannot select a different variant, persist the delivery union or add scheduler fields. The delivery mapping itself does not decide numeric process exit codes.

### 113.3 Host exit carrier

```rust
/// Host-facing process result derived mechanically from one Jobs terminal carrier.
pub(crate) enum CapabilityJobsHostExit {
    /// A validated typed Job response is ready for host delivery.
    Response(
        /// Exact typed response preserved from the application result.
        CapabilityJobsTypedResponse,
    ),
    /// A Jobs-local or application error is ready for host error delivery.
    TechnicalError(
        /// Exact thin Jobs error preserved without business reclassification.
        JobError,
    ),
    /// No Capability Hub delivery existed because admission ended before dispatch.
    NoDeliveryBeforeDispatch(
        /// Exact process-local admission timing classification.
        CapabilityJobsInvocationTiming,
    ),
    /// A runtime source failed before a terminal Capability Hub delivery was formed.
    RuntimeFailure {
        /// Optional nonpublic runtime cause retained for process diagnostics only.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
}

/// Maps one terminal Jobs carrier to a host-only response / error / no-delivery class.
pub(crate) fn map_jobs_host_exit(
    terminal: CapabilityJobsInvocationTerminal,
) -> CapabilityJobsHostExit;
```

`map_jobs_host_exit` must consume terminal parts exactly once. A `Response` payload remains `Response` even when its disposition is `Retryable`, `Failed` or `Rejected`; host process policy may choose its own non-business exit treatment, but that treatment is not written into the request, journal, report or `CapabilityJobProtocolDisposition`. A `TechnicalError` preserves the existing `JobError`. `NoDeliveryBeforeDispatch` and `RuntimeFailure` are process-local host outcomes, not `JobError`, report, evidence, acknowledgement or retry taxonomy.

The mapper exhaustively applies the following `into_parts()` matrix. A row marked contradiction constructs `CapabilityJobsTerminalMappingFailure`, retains any existing runtime source beneath it, drops the unsafe-to-deliver contradictory payload, and returns `RuntimeFailure { source: Some(...) }`. It never panics, returns a default response, or invokes application code.

| timing | delivery | source | exact host exit |
|---|---|---|---|
| `AdmissionEndedBeforeDispatch` | `None` | `None` | `NoDeliveryBeforeDispatch(AdmissionEndedBeforeDispatch)` |
| `AdmissionRejectedBeforeDispatch` | `Some(TechnicalError(error))` | `None` | `TechnicalError(error)` |
| `CompletedBeforeRunDeadline` | `Some(Response(response))` | `None` | `Response(response)` |
| `CompletedBeforeRunDeadline` | `Some(TechnicalError(error))` | `None` | `TechnicalError(error)` |
| `DrainedAfterRunDeadline` | `Some(Response(response))` | `None` | `Response(response)` |
| `DrainedAfterRunDeadline` | `Some(TechnicalError(error))` | `None` | `TechnicalError(error)` |
| `RuntimeFailedBeforeTerminal` | `None` | optional source | `RuntimeFailure { source }` |
| `AdmissionEndedBeforeDispatch` | any other combination | any | contradiction -> `InvalidAdmissionExpiryShape` |
| `AdmissionRejectedBeforeDispatch` | any other combination | any | contradiction -> `InvalidAdmissionRejectionShape` |
| `CompletedBeforeRunDeadline` or `DrainedAfterRunDeadline` | any other combination | any | contradiction -> `InvalidInvocationCompletionShape` |
| `RuntimeFailedBeforeTerminal` | `Some(_)` | any | contradiction -> `InvalidRuntimeFailureShape` |

### 113.4 Host schedule boundary

| host material | Jobs runtime visibility | rule |
|---|---|---|
| cron / queue / manual trigger | none after choosing a request | cannot override `job_name`, schema, run id, key, actor, trace or body |
| process argument / environment | none | cannot become request field or journal state |
| queue ack / lease / offset | none | host owns acknowledgement; Jobs returns only delivery / technical class |
| process exit number | none in Jobs protocol | host maps `CapabilityJobsHostExit`; no numeric code becomes business disposition |
| schedule retry | none | host may resubmit exact bytes, but application decides same-key replay/conflict/reentry; it is not runner retry |

## 114. Failure totality、safe reentry 与依赖不可用

### 114.1 Runner retry authority

The current Jobs entry has no authorization to automatically replay a handler call. This is a deliberate closed result:

| observed result | automatic entry retry | exact handling |
|---|---:|---|
| typed `CapabilityJobResponse`, including `Retryable` | 0 | map and deliver once |
| `JobError::Source` before application | 0 | preserve source category; host may correct input and submit a new invocation |
| `JobError::Application` with temporary / timeout Port failure | 0 at entry | application flow or later exact host reentry follows existing Step 12 / 13 authority |
| `CommitOutcomeUnknown` | 0 | preserve unknown; no blind mutation or report reconstruction |
| consistency / codec / rollback failure | 0 | stop and retain exact recovery authority |
| caller observation timeout / cancellation | 0 | drain same invocation; never re-dispatch |
| application internal safe-reentry proof | still 0 at entry | application-owned service may use existing journal/UoW safe-reentry controller before returning its one typed response |

`runner_retry` remains a validated configuration input because the application Job service may need the same technical policy for its already-defined internal safe-reentry wrapper. The entry does not inspect attempts, delay, jitter or proof fields. No new private carrier is invented in this batch. If a future implementation requires Jobs entry itself to replay encoded bytes, it must reopen Step 8 protocol ownership, Step 12 error recovery, Step 13 reentry and Step 14 dependency binding before any code or formal document is changed.

### 114.2 Total failure matrix

| failure site | owner | result | forbidden shortcut |
|---|---|---|---|
| selected entry / parameter mismatch | Jobs composition | `CapabilityJobsCompositionError::EntryParametersMismatch` -> `InfraError::RuntimeAssembly` | fallback to API/Worker parameters |
| missing application service | runtime builder / factory | `IncompleteApplicationService` -> `InfraError::RuntimeAssembly` | no-op handler / fake success |
| missing 1 of 8 handler or runner arms | Jobs factory | `MissingHandlerCoverage` -> startup error | string dispatch / default arm |
| wrong body / schema / response variant | Jobs entry | `JobError::Source` exact kind | reportless protocol response fabricated by runner |
| Tokio current-thread runtime build/bind/flavor failure | Jobs process factory | exact `CapabilityJobsCompositionError` -> `InfraError::RuntimeAssembly` | alternate runtime、host handle、forced abort |
| monotonic deadline checked-add overflows | Jobs admission | host-only `RuntimeFailure` with `CapabilityJobsRunDeadlineError` | startup misclassification、`JobInput`、application call |
| deadline elapses during admission | Jobs admission | `NoDeliveryBeforeDispatch` | source error、generated report、application call |
| oversize/malformed/unsupported input | Jobs admission | exact `TechnicalError(JobError::Source(...))` | host no-delivery、application rejection fabrication |
| application returns typed response | application + Jobs validator | exact `Response` | response reinterpretation |
| application returns `ApplicationError` | application + Jobs wrapper | exact `TechnicalError(JobError::Application)` | text-based issue or retry |
| caller cancels after admission | Jobs runtime + observation guard | restore exact `InFlight`, later exact drain | abort、second request / new run |
| task panic/cancellation or terminal/join invariant failure | Jobs Tokio task / terminal cell | host-only `RuntimeFailure`;preserve nonpublic source | deliver contradictory payload、rerun handler |
| process exits before terminal carrier | host | no completion claim; later exact reentry is application decision | claim rollback or successful report |
| scheduler unavailable | host/deployment | no Capability Hub state | Jobs scheduler implementation |

### 114.3 Dependency and ownership matrix

| dependency / material | bound owner | Jobs use | timeout / retry | unavailable behavior |
|---|---|---|---|---|
| application operations-job service | `application` Stage 5 + `CapabilityJobsApplicationServices` | one `CapabilityOperationsJobHandlers` facade handle | application-owned technical policy; no entry retry | startup `InfraError::RuntimeAssembly` if absent |
| request codec | `contracts` exact codec + Jobs borrowed header gate | bounded header and selected body decode | no retry | `JobError::Source(JobInput / UnsupportedSchema)` |
| monotonic run deadline | Jobs runtime | one checked Tokio `Instant` created before admission | no retry/reset;classifies before/after only | checked-add overflow -> host-only runtime failure |
| owned invocation task / terminal cell / join | Jobs executor + current-thread runtime | one `Send + 'static` task、sync first-writer cell、one join | no business retry;cancel-safe observation/drain only | runtime/task/invariant failure -> host-only runtime failure |
| local repositories / UoW / Clock / IdGenerator | application + infra | indirect through service only | Step 11 / 12 / 13 policies | application `JobError::Application` after invocation; no Jobs direct repair |
| external resolver / collaboration / handoff | application Ports + infra adapters | indirect through Job service only | existing typed external policy | typed outcome or exact application error |
| scheduler / queue / ack | deployment host | not visible | host policy only | no local Job state |
| Tokio `1.52.3` `rt,sync,time` | Worker and Jobs direct members | Jobs current-thread runtime、`Handle`、`Instant`、`Notify`、owned task and join，all Jobs-private | deadline observation only;no cancellation/retry | build/bind/flavor failure blocks startup;post-dispatch runtime failure is host-only |
| `async-trait 0.1.89` | application/infra/api/worker/jobs direct owners | Jobs service/handler dyn-compatible `Send` futures | no timeout/retry semantics | missing annotation/dependency is compile gate failure;no boxed generic fallback |

Tokio and `async-trait` are concrete design bindings, not implementation evidence. This batch records exact direct owners、versions、features and type-leak prohibitions；it does not claim the absent target repository has compiled or run. No Tokio concrete type or macro-expanded future type may cross infra handoff、application trait semantic signatures、contracts DTO、public callable or persisted state.

## 115. Cross-step closure、historical audit 与 Rustdoc gate

### 115.1 Step 3~13 closure

| upstream | consumed exact contract | preserved / result |
|---|---|---|
| Step 3 constraints | Rust / English Rustdoc / no forbidden body / sibling Cargo isolation | Jobs remains no runtime execution, tools execution, marketplace, governance approval, method body, SDK client or external body owner |
| Step 4 file layout | `crates/jobs/src/*.rs` one-shot runner and binary package; `infra/runtime_builder.rs` assembly owner | entry handler/runner stays in Jobs; old infra “assemble runner” wording is historical |
| Step 5 module contracts | Jobs only owns runner and delivery mapping; application owns Job service | no repository, UoW, external client or scheduler state in Jobs |
| Step 6 objects | typed Job metadata/request/response/report/target refs and application technical helpers | no new public object, field or business state |
| Step 7 traits | existing `CapabilityOperationsJobService`, 36 Ports, 22 repository traits / 110 methods | no Jobs Port, retry Port, scheduler Port or repository shortcut |
| Step 8 protocols | 8 closed inputs/results, schema `1`, triggers, `CapabilityOperationsJobHandlers` | 8/8 mapping preserved; no new DTO or response variant |
| Step 9 flows | initial / target / final UoW, frozen plan, exact journal reentry | runner delegates once and never re-plans |
| Step 10 states | idempotency / Job journal states remain application-owned | `Ready/InFlight/Consumed` is process-local only, not baseline state |
| Step 11 persistence | single authority, commit resolution, final report UoW | timeout/cancel cannot terminalize unknown target |
| Step 12 errors | `JobError` two variants, `JobSourceKind` four variants, exact wrapper mapping | no new error variant; startup remains `InfraError::RuntimeAssembly` |
| Step 13 concurrency | same key/digest/run, journal-only exact reentry | no entry retry, current-truth rescan or new identity |

### 115.2 Capability Hub boundary audit

| boundary | Jobs may do | Jobs must not do |
|---|---|---|
| capability identity / registry | invoke registry-centered reconciliation report flow | create/update/retire registry or identity truth |
| adapter descriptor / MCP / A2A / API | invoke body-free reference / derived report flows through application | execute provider request, store body, own health/quota/cost/route |
| governance seam | consume body-free result/reference relation through application | approve, vote, activate or mutate governance truth |
| method-library relation | consume body-free method asset reference | read/store method body or publication lifecycle |
| SDK exposure | refresh controlled view / read-only discovery summary | create SDK package/client/cache or publication state |
| external collaboration | invoke repair Job through stored capture/intent boundary | create local outbox/relay/DLQ/attempt/delivery state |
| scheduler / host | receive one exact request and return delivery class | own Job business state, run identity or acknowledgement truth |

### 115.3 Historical material and debt register

| material / item | classification | current treatment |
|---|---|---|
| old formal `03` provider runtime / gateway / route / quota / cost / KMS / Vault主线 | `historical_material` | excluded from Jobs handoff, handler, runner, timeout and delivery |
| old README provider whitelist / marketplace / runtime must-pass wording | `historical_material` | not used as Jobs scope, trigger, dependency or result |
| §62.1 / §62.3 infra-owned Jobs runtime wording | `historical_material` | superseded by §§107~114 entry-owned composition |
| L1-governance / L1-artifact scheduler, outbox, relay, attempt or checkpoint patterns | `reference_only` | only table granularity is referenced; no second Jobs state owner is copied |
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | non-blocking cross-repo debt | same authorized accessor assumption remains; semantic change reopens Step 13 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | non-blocking cross-repo debt | Jobs keeps existing contracts codec / borrowed header boundary |
| `CH-DEBT-S14-JOBS-EXECUTOR-BINDING-001` | `resolved_during_14.5.2.2.3` | Jobs directly owns Tokio `1.52.3` current-thread runtime、monotonic deadline、owned task、sync terminal cell、notification and join；no executor choice remains for `07` |
| unresolved upstream blocker | `none` | all current Jobs owners、protocols、flows、errors、journal authority、async object safety and executor selection are closed；no upstream truth conflict remains |

### 115.4 Rustdoc and structure-comment audit

| declaration group | expected documentation | result |
|---|---|---|
| `CapabilityJobsApplicationServices` and field | struct + field English `///` | pass |
| `CapabilityJobsEntryHandoff` and fields | struct + both field English `///` | pass |
| handler facade and service field | struct + field + constructor/accessor English `///` | pass |
| invocation timing / terminal / runtime failure / deadline / owned invocation | enum, every variant, every payload, struct, every field and callable English `///` | pass |
| terminal invariant / mapping failure / completion and observation guards | enum/struct、every variant/field/payload/callable English `///` | pass |
| terminal write / take / join / process-drain failure sources | every struct/enum、variant、field and constructor English `///` | pass; all remain host-only runtime sources |
| Tokio executor / process / runtime declarations | every struct、field、constructor、runner and lifecycle callable English `///` | pass |
| `async-trait` binding | 33 Step 7 + 23 Step 8 = 56 dyn-injected async trait declarations；application/infra impls and 4 entry facade impl families use the fixed `Send` expansion | pass; no `?Send` or unresolved native-dyn choice |
| Jobs runtime / progress / composition error | struct/enum, every field/variant/payload and callable English `///` | pass |
| response validator, delivery mapper, host exit | every callable, enum, variant and payload English `///` | pass |
| existing 8 typed runner callables | existing §63.1 English Rustdoc retained | pass |
| public wire type / DTO field / Port / repository / persisted state delta | `0` | pass; no new public wire or durable declaration |
| contracts-owned public helper callable delta | `+1` | pass; exact `CapabilityJobMetadata::copy_for_response_validation` only |

No enum struct variant introduces undocumented fields. No generic `Other(String)`, `Value`, map, raw error or undocumented escape hatch is used as a closed Jobs arm. Concrete Tokio types remain Jobs-private and do not authorize a second runtime、public cancellation contract or host-injected executor.

## 116. Formal `03` §13 Jobs assembly source、coverage arithmetic 与 stop review

### 116.1 Formal §13 source for later assembly

Step 19 may use the following source when assembling formal `03` §13. This source does not modify formal `03` now:

```markdown
### 13.6 八个 Operations Job 的 typed runner、trigger 与 host schedule boundary

`infra` 只验证 Jobs entry parameters、single application Job service graph和planning / safe-reentry policy provenance，并输出一个不可Clone的 `CapabilityJobsEntryHandoff`。handoff只含`CapabilityJobsEntryParameters`和`CapabilityJobsApplicationServices`；不含raw config、repository、UoW、Clock、IdGenerator、Port、resolver、scheduler、queue、lease、ack或request bytes。`infra`不构造`CapabilityOperationsJobHandlers` concrete facade、不构造runner，也不依赖`capability-hub-jobs`。

Jobs composition root消费handoff一次，构造Jobs-owned `CapabilityOperationsJobHandlerFacade`，静态覆盖8个既有`CapabilityOperationsJobHandlers` methods，再构造8个typed one-shot runner。每个runner只接受一个已通过byte/header/body gate的`CapabilityJobRequest<T>`，调用对应application Job service method，并将对应`CapabilityJobResponse<R>`映射到matching `CapabilityJobsTypedResponse` variant。job name、schema `1`、body type、handler、response detail和logical trigger必须闭合对称；physical scheduler / cron / queue / process argument / acknowledgement不进入request identity、digest、journal或public Job response。

Jobs entry在byte gate之前创建一个不可重置的Tokio monotonic run deadline。admission阶段使用borrowed header-first carrier和selected exact body decoder；deadline到期是host-only no-delivery，oversize、malformed header、unknown job、unsupported schema或body mismatch则返回existing `JobError::Source`，两者都不创建reservation、journal、report或generated id。valid typed request进入application后，`Rejected` / `Completed` / `PartiallyCompleted` / `Failed` / `Retryable` / `DuplicateReplayed`均由application response authority形成并由Jobs原样交付。

dispatch一旦开始，Jobs-owned Tokio current-thread runtime中的唯一task拥有同一个application future和sync first-writer terminal cell。deadline到期只把最终terminal分类为`DrainedAfterRunDeadline`；caller cancellation或host disconnect由observation guard恢复同一个`InFlight` owner，不得abort、drop join、重调或替换run/key/scope/target。Jobs process持续`block_on`并drain同一个task，`Ready -> InFlight -> Consumed`只存在于Jobs process-local runtime。Jobs entry没有automatic runner retry authorization；typed `Retryable`不是runner指令，plain `ApplicationError`、commit unknown、consistency、codec和rollback failure也不自动重放。若将来需要entry-level safe replay，必须重新打开Step 8 / 12 / 13 / 14。

host exit只是`CapabilityJobsDelivery`的机械映射：typed response、technical JobError、admission-before-dispatch no-delivery和runtime-before-terminal failure分别保留其process-local class。host可以决定transport response、ack或process exit，但这些值不成为Capability Hub business state、Job disposition、journal、report、evidence或acceptance fact。
```

### 116.2 Jobs coverage and ownership arithmetic

| binding surface | expected | actual | missing / extra | result |
|---|---:|---:|---:|---|
| application Job service object | 1 | 1 | 0 / 0 | pass |
| handler methods | 8 | 8 | 0 / 0 | pass |
| dispatch kinds / body decoders | 8 | 8 | 0 / 0 | pass |
| typed runner callables | 8 | 8 | 0 / 0 | pass |
| handler -> service bindings | 8 | 8 | 0 / 0 | pass |
| response union variants | 8 | 8 | 0 / 0 | pass |
| logical triggers | 8 | 8 | 0 / 0 | pass |
| Jobs entry parameters | 4 existing fields | 4 existing fields | 0 / 0 | pass |
| Jobs direct Tokio dependency | 1 pinned binding | 1 (`tokio 1.52.3`, `rt,sync,time`) | 0 / 0 | pass; concrete types remain Jobs-private |
| async trait object-safety dependency owners | 5 | 5 (`application/infra/api/worker/jobs`) | 0 / 0 | pass; `async-trait 0.1.89`, no `?Send` |
| async trait declarations with fixed attribute | 56 | 56 (Step 7 `33` + Step 8 `23`) | 0 / 0 | pass; all corresponding impls require the same attribute |
| entry facade impl families with fixed attribute | 4 | 4 (API Command、API Query、Worker Inbound、Jobs) | 0 / 0 | pass |
| contracts metadata validation-copy callable | 1 | 1 | 0 / 0 | pass; Jobs has no direct core edge |
| new public wire type / DTO field / Port / repository / persisted state | 0 | 0 | 0 / 0 | pass |
| contracts-owned public helper callable delta | 1 | 1 | 0 / 0 | pass; metadata validation copy only |

### 116.3 Batch completion gate

| gate | result | source |
|---|---|---|
| application service bundle is complete and Job-owned | pass | §§108~109 |
| handoff is one-shot, non-cloneable and cycle-free | pass | §108 |
| `CapabilityOperationsJobHandlers` is Jobs-owned and 8/8 static | pass | §109 |
| request byte ownership and header-first gate are bounded | pass | §111 |
| eight typed runner arms preserve exact request/response symmetry | pass | §§111.3~111.4、§113.1 |
| monotonic run deadline begins before byte gate and cannot reset/cancel application | pass | §§110.1、111.1、112 |
| post-dispatch invocation is non-cancelling and drainable | pass | §§110.1、112 |
| terminal wait / join / take and process shutdown precedence is unique | pass | §110.1 |
| typed `Retryable` is delivered, never entry-retried | pass | §114.1 |
| host schedule / ack / exit remains outside Capability Hub truth | pass | §§113.3~113.4、116.1 |
| startup / invocation / application error owner separation | pass | §§110.4、114.2 |
| forbidden runtime/tools/marketplace/governance/method/SDK surfaces excluded | pass | §115.2 |
| structure comments / English Rustdoc | pass | §115.4 |
| formal `03` modified | no; calibration source only | artifact discipline preserved |
| `04` / implementation ledger / planned boundary skeleton created | no | reserved for later formal documents / `07` |
| implementation code, test result, run id, evidence alias or sign-off claimed | no | none produced or claimed |
| unresolved upstream blocker | none | executor、terminal、metadata copy and async object safety are closed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.2.2.3 Jobs
gate_status = 03_step_14_batch_14_5_2_2_3_jobs_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
jobs_application_service_handles = 1/1
jobs_handler_methods = 8/8
jobs_dispatch_body_decoders = 8/8
jobs_typed_runner_callables = 8/8
jobs_handler_service_bindings = 8/8
jobs_typed_response_variants = 8/8
jobs_logical_triggers = 8/8
jobs_entry_auto_retry_authorized = false
jobs_runtime_lifecycle = Ready -> InFlight -> Consumed
jobs_direct_tokio_members = 1
jobs_tokio_binding = 1.52.3 + rt,sync,time + current-thread only
jobs_executor_binding_debt = resolved_during_14_5_2_2_3
async_trait_direct_owners = application,infra,api,worker,jobs
async_trait_binding = 0.1.89 + Send futures + no ?Send
async_trait_declarations = 56 = step_7:33 + step_8:23
async_trait_entry_facade_impl_families = 4
public_wire_type_delta = 0
contracts_owned_public_helper_callable_delta = +1
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_2_3
```

Jobs batch `14.5.2.2.3`至此完成并停审。未经用户再次确认，不进入`14.5.2.3`、`14.5.3`、`14.5.4`、`14.6`、Step 15、正式`03`装配、`04-配置设计.md`或任何实现产物。

## 117. Batch `14.5.2.3` 开工确认、读取门禁与最终裁决范围

### 117.1 用户授权与本批边界

用户已确认从 `14.5.2.2.3 Jobs` 停审点进入 `14.5.2.3`。本批只把 Stage 0~7、API、Worker 和 Jobs 已分别闭合的 composition contract 收敛为一个跨 entry、可机械判定的 blocking matrix，并关闭 `14.5.2`；不进入 `14.5.3` 的 runtime / event / downstream 裁剪图，也不修改正式 `03-详细设计.md`。

| 项目 | 本批裁决 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前批次 | `14.5.2.3` cross-entry final blocking matrix |
| 标准输入 | 详细设计 SOP Step 14、详细设计书写规范 §5.13、真相源闭环标准的继续任务 / schema / callable / owner门禁 |
| 直接设计输入 | 本文件 §§75~85 的 Stage 0~7、§§86~94 API、§§95~106 Worker、§§107~116 Jobs；Step 3~5 dependency / module owner；Step 7 / 8 exact async trait surface；Step 12 / 13 error、timeout、commit unknown与safe reentry |
| 本批必须输出 | complete graph predicate、cross-entry constructor gate、first-exposure barrier、partial-graph disposal、startup / invocation failure separation、coverage arithmetic、正式 §13 回填增量和停审状态 |
| 本批不输出 | raw config key / env / numeric default、具体 HTTP / broker / scheduler / DB product、runtime/event/downstream deployment图、观测字段、测试用例、实施 boundary或代码 |
| Rust-facing增量 | `0`；不新增 struct、field、enum、variant、payload、trait或callable，不改变已有 visibility / signature |
| artifact纪律 | 正式 `03`、`04`、implementation ledger、planned boundary skeleton和目标实现仓均不创建或修改；不声称测试、run、evidence、sign-off或commit |

### 117.2 本批重新读取后的问题诊断

| 既有材料 | 若不收口会留下的问题 | 本批最终处理 |
|---|---|---|
| §84 Stage 0~7 blocking matrix | 已证明 infra prefix complete-or-error，但没有把三个 entry-owned factory 的结果放进同一判定顺序 | 形成 `shared prefix -> one handoff -> selected entry composition -> exposure barrier` 的唯一顺序 |
| API §92~94 | 已闭合 15 service、26 / 33 coverage和non-cancelling call，但未与 Worker / Jobs 的“首次可见行为”逐列对齐 | listener accept 只能发生在 complete API runtime及framework ownership gate之后 |
| Worker §99~106 | 已闭合六任务park / activation / rollback，但其 partial-start cleanup是 Worker-specific，不能误作所有 entry 的共同算法 | 共同矩阵只要求零partial exposure；Worker保留唯一的typed stop/join cleanup算法 |
| Jobs §108~116 | 已闭合 current-thread process和8/8 graph，但 runtime build failure、request admission failure与post-dispatch drain failure需在统一矩阵中分层 | factory / runtime bind是startup；admission及drain属于complete process运行期，二者不得互换 |
| 旧正式 `03` / README | 仍可能暗示一个统一 gateway 同时暴露 API / Worker / Jobs，或由 infra 直接启动三类 entry | 保持 `historical_material`；一个validated root和一个process只选择一个entry，不存在mixed runtime或cross-entry fallback |

本批没有发现需要新增 application Port、public protocol、repository、state、error variant或runtime union的缺口。三个 entry已经有各自 exact handoff、runtime、composition-local error和启动边界；最终矩阵只对既有结论做交叉完备性判定。

### 117.3 Final blocking matrix 的判定单位

本批使用以下术语，不新增 Rust type：

| 术语 | exact meaning | 不等于 |
|---|---|---|
| complete shared prefix | Stage 0~6 全部成功：一个 validated root、一个 `A`、technical primitives、27 local/base Ports、9 external Ports和selected application graph完整 | 某个 adapter“稍后再构造”、一个有 `Option` slot的graph |
| complete handoff | Stage 7为selected entry构造的一个不可Clone、无raw config/ref、可被对应root一次消费的typed carrier | 三entry union、service locator、dynamic registry |
| complete entry runtime | selected entry factory全部通过静态coverage、ownership和runtime primitive gate后的具体 API / Worker / Jobs runtime | handoff本身、已构造若干facade/task/runner的prefix |
| exposure barrier | complete entry runtime首次允许host接受外部item或释放任务执行的唯一闸门 | business transaction、domain state、persistent lifecycle |
| blocking failure | exposure barrier前任一required gate失败；必须停止startup且无Capability Hub业务delivery | 显式`Disabled`、运行期typed `NotConfigured`、合法external failed outcome |
| invocation failure | exposure barrier后，一个已接受item在existing API / Worker / Jobs / application error surface上的结果 | startup assembly error、切换另一个entry的信号 |

## 118. Complete Graph Predicate 与统一阶段门禁

### 118.1 唯一 complete predicate

Selected entry可跨越 exposure barrier，当且仅当下列 conjunction 全部为真：

```text
complete(selected_entry) =
    stage_0_validated_root
 && stage_1_single_authority
 && stage_2_technical_primitives
 && stage_3_local_base_ports_27_of_27
 && stage_4_external_ports_9_of_9
 && stage_5_selected_application_graph
 && stage_6_selected_parameters_and_neutral_inputs
 && stage_7_single_nonclone_handoff
 && selected_entry_factory_complete
 && selected_entry_runtime_ownership_complete
 && selected_entry_static_coverage_complete
```

这是 startup-local Boolean predicate，不是可持久化状态，也不允许实现为“缺少项列表 + 首次请求时补齐”。任一 conjunct 为假，结果只能是 blocking failure；不得返回一个 runtime、监听一个端口、释放一个source task、读取一段Job request bytes或调用application facade。

`Configured`、`DeterministicFake`和`Disabled`只在已通过exact family/profile/constructor gate时使对应binding conjunct为真。`Missing`、wrong-family、dangling child ref、forbidden fake、constructor failure或required service omission始终使predicate为假。一个 `Disabled` external Port仍是9/9 concrete Port之一；一个 `Disabled` Worker source则是六槽位之一的explicit no-runner decision。

### 118.2 Shared Stage 0~7 final blocking matrix

| Order | Required material | Exact pass predicate | Blocking examples | On failure | Forbidden continuation |
|---:|---|---|---|---|---|
| 0 | immutable root | schema、profile、selected entry、parameter variant、all refs/cardinalities及forbidden-surface gate完整 | unknown schema、entry/parameter mismatch、dangling ref、Deployment fake | `InfraError::RuntimeAssembly`;drop candidate/raw input | 构造authority或任一adapter |
| 1 | local authority `A` | one authority同时支持atomic write set、CAS/unique、cursor、opaque transaction resolution和linearizable recovery read | split authority、missing index、无法证明commit resolution | `InfraError::RuntimeAssembly`;drop local authority owner | 暴露pool/handle或进入Stage 2 |
| 2 | technical primitives | UoW、`K`、clock、id、bounded wrapper全部固定且指向同一approved owner | dynamic codec/hash、clock/id fallback、unbounded policy | `InfraError::RuntimeAssembly`;drop owned prefix | application或entry自行补primitive |
| 3 | local/base Port graph | 27/27 concrete trait objects；22 repositories、UoW和read gate共享`A` | missing Port、wrong authority、fake缺CAS / rollback parity | `InfraError::RuntimeAssembly`;drop entire local graph | 把已完成的26个slot交给Stage 4 |
| 4 | external Port graph | 9/9 exact Configured / Fake / Disabled concrete Ports；14/14 callable surface可达 | missing section、wrong family、constructor/fixture failure | `InfraError::RuntimeAssembly`;drop entire external graph | no-op Port、runtime fallback、partial application graph |
| 5 | selected application graph | selected entry所需service trait objects全部非optional且technical policy provenance已绑定 | missing facade/service、Query获得write authority、Job policy未注入 | `InfraError::RuntimeAssembly`;drop graph prefix | 首次item到达时lazy service lookup |
| 6 | entry-neutral input | selected parameter variant exact；Worker六slot全为resolved或explicit Disabled；无raw ref泄漏 | cross-entry parameter、enabled source missing feed/matcher、scheduler进入Jobs input | `InfraError::RuntimeAssembly`;drop all neutral inputs | fallback到另一entry或保留partial source set |
| 7 | one typed handoff | exactly one selected nonclone carrier；内容完整且entry root无需读取infra-private config | wrong handoff family、cloneable registry、repository/UoW/raw config泄漏 | `InfraError::RuntimeAssembly`;consume/drop carrier once | 同时构造第二entry、host start或protocol error |

Stage 0~7任一失败发生时都没有Capability Hub invocation identity：没有Command idempotency reservation、Inbound source receipt、Outbound capture、Job journal/report、evidence alias或acceptance fact。因此这些失败只能保留安全的startup source chain，不能借用 `ApiError`、`WorkerError`、`JobError` 或任何public disposition表达。

### 118.3 Binding 四分法在 complete predicate 中的位置

| Binding condition | Shared graph complete? | Worker source task present? | Invocation result authority | May select fallback? |
|---|---:|---:|---|---:|
| valid `Configured` | yes | yes, when the selected Worker slot is configured | concrete Port/feed typed result | no |
| valid `DeterministicFake` in an allowed profile | yes | yes, when the selected Worker slot is fake | parity fake typed result;never real evidence | no |
| explicit `Disabled` external Port | yes;concrete NotConfigured Port exists | n/a | existing application `PortFailure(NotConfigured)` on call | no |
| explicit `Disabled` Worker source | yes;closed slot decision exists | no | no source invocation、receipt、ack或empty success | no |
| `Missing` / wrong family / dangling child | no | no task may activate | none;startup only | no |
| constructor / static compatibility failure | no | no task may activate | none;startup only | no |
| runtime temporary / timeout after complete start | graph remains complete | existing task/invocation owner remains | existing typed Port / entry / application surface | no |

“dependency currently unreachable”不能仅凭文字统一归入 Missing：若真实 adapter constructor按 `04` contract要求startup connectivity / capability probe，则probe失败是constructor blocking failure；若该产品允许在不伪造能力的前提下构造client并将unavailable保留到调用期，则它是complete Configured binding，调用时返回typed temporary/timeout。具体产品的probe时机属于 `04`，但无论选择哪一类，都不得静默切Fake或Disabled。

## 119. Cross-entry Composition、Coverage 与 Exposure Barrier Matrix

### 119.1 Exactly-one entry cardinality

| Cardinality axis | Required value | Mechanical proof | Rejected shape |
|---|---:|---|---|
| selected `CapabilityRuntimeEntryKind` | 1 | validated root contains exactly one `Api` / `Worker` / `Jobs` value | flags enabling two entries、default fallback |
| matching `CapabilityEntryParameters` variant | 1 | selected `as_*` branch matches;the other two are unreachable | selected API + Worker params、`None` interpreted as default |
| Stage 7 handoff | 1 | only matching constructor is called and carrier is not `Clone` | union containing three optional handoffs |
| entry-owned composition root | 1 | owning binary consumes matching handoff once | infra calls every root、entry imports sibling entry |
| complete entry runtime | 1 | selected factory returns one concrete runtime/process | common runtime with optional API/Worker/Jobs fields |
| exposure barrier | 1 per process | only owning root may open its exact boundary | API listener plus Worker tasks in one validated process |

No cross-entry fallback exists. API composition failure cannot start Worker；Worker source failure cannot run Jobs；Jobs runtime build failure cannot expose API。Changing entry requires a new validated root and a new process startup, not a branch inside the failing graph.

### 119.2 Entry-by-entry final composition matrix

| Axis | API | Worker | Jobs |
|---|---|---|---|
| Stage 5 service bundle | `CapabilityApiApplicationServices`: 15 required handles = 7 Command + 8 Query | `CapabilityWorkerApplicationServices`: 2 required handles = Inbound Consumer + Event Collaboration | `CapabilityJobsApplicationServices`: 1 required Operations Job handle |
| Stage 7 handoff | one `CapabilityApiEntryHandoff` | one `CapabilityWorkerEntryHandoff` with six named source decisions | one `CapabilityJobsEntryHandoff` |
| handoff consumption | borrow typed parameters, then consume service bundle once | consume parameters、2 services and six sources once | consume parameters and one service bundle once |
| entry factory | `CapabilityApiRuntime::from_handoff` | `CapabilityWorkerRuntime::from_handoff` followed by consuming `start` | `CapabilityJobsProcess::from_handoff` builds runtime and `CapabilityJobsRuntime` inside owned current-thread context |
| static protocol coverage | 26/26 Command + 33/33 Query | 6/6 consumer/family/schema/handler arms + one exact-ref continuation | 8/8 job kind/name/schema/body/handler/response/trigger/runner symmetry |
| required runtime ownership | two handler trait-object `Arc`s；framework must retain one dispatched future after response-observation timeout | one supervisor、stop signal、activation barrier、one global permit gate、six named parked task slots、one continuation owner | Tokio `1.52.3` current-thread runtime、time driver、bound executor、one-shot terminal/join/take owner |
| allowed optionality | none in service/facade graph | runner/task `Option` only mirrors one explicit Disabled named slot | none in handler/runner graph；runtime progress is closed `Ready / InFlight / Consumed` |
| first exposure barrier | listener/route starts accepting only after complete runtime and framework ownership audit | activation barrier releases only after every enabled named task is parked and continuation runtime is owned | host bytes enter `CapabilityJobsProcess::run` only after process/runtime/facade construction succeeds |
| startup-local error | `CapabilityApiCompositionError` retained under startup `InfraError::RuntimeAssembly` | `CapabilityWorkerCompositionError`, including typed cleanup aggregate, mapped once to `InfraError::RuntimeAssembly` | `CapabilityJobsCompositionError` mapped once to `InfraError::RuntimeAssembly` |
| first valid invocation error surface | `ApiError::Source` before handler or `ApiError::Application` after handler | existing `WorkerError` / processing action after activation and accepted source item | pre-dispatch terminal/`JobError::Source`/host-only no-delivery, then typed response or technical/runtime host exit |
| forbidden direct owner | repository、UoW、resolver、external Port、raw config | repository、UoW、publisher Port、config ref、generic protocol registry | repository、journal planner、scheduler、queue、lease、ack、retry state |

The matrix does not create a common entry trait or runtime enum. Commonality exists only in startup decision rules；each concrete root retains its own types, lifecycle and error source. This avoids erasing Worker cleanup detail、Jobs terminal precedence or API route ownership behind a generic `start()` abstraction.

### 119.3 First-exposure barriers and zero-early-effect rules

| Entry | Last required pre-exposure gate | First permitted externally visible behavior | Before barrier, must remain zero | Barrier failure result |
|---|---|---|---|---|
| API | complete 26/33 runtime plus framework proof that one dispatched invocation survives response timeout | listener accepts an encoded request and applies route / byte / schema gate | accepted request、handler call、reservation、protocol response | startup/bootstrap failure；never an API response |
| Worker | all enabled tasks parked、all Disabled slots empty、continuation owned、activation decision committed | activation release lets feeds fetch and continuation accept an exact capture ref | source fetch、delivery ownership、actor/body decode、application call、completion/ack | activation abort + fixed cleanup；never a receipt/action |
| Jobs | current-thread runtime built and driven、executor bound、8/8 runtime complete | one owned request enters byte/deadline/header admission | request decode、handler call、journal/report、host delivery | startup failure；never `JobError` or Job response |

API socket/listener bind failure and Jobs host request-acquisition failure occur outside Capability Hub's protocol invocation because no item was accepted. They remain host/bootstrap failures and cannot be translated into Command rejection、Query degradation、Job `Rejected`或evidence. Worker task spawn failure is already inside its entry startup algorithm but before activation；it uses the exact Worker startup cleanup contract and still produces no inbound receipt.

## 120. Final Blocking Conditions by Entry

### 120.1 API blocking matrix

| Gate | Pass condition | Blocking source | Required disposal / result | Runtime path that is deliberately not blocking |
|---|---|---|---|---|
| handoff family | API params + complete 15-service bundle | `EntryParametersMismatch` / incomplete handoff | drop handoff/services；startup error | none |
| facade construction | all 7 Command and 8 Query service groups coercible to exact traits | `IncompleteFacadeGraph` | drop all cloned `Arc`s；no listener | application Port unavailable on a later call |
| static operation table | exactly 26 Command and 33 Query methods, each one route/name/body/service | `MissingCommandCoverage` / `MissingQueryCoverage` | drop both facades；startup error | typed Command rejection、Query not-visible/degraded result |
| typed parameters | body/page limits and call timeout are validated positive values from same root | parameter mismatch / invalid provenance | drop runtime prefix；startup error | request over limit；that is later `ApiError::Source` |
| runtime ownership | framework keeps one owned post-dispatch future alive after response observation ends | incompatible framework binding | no listener；startup incompatibility | response observation timeout after dispatch;future continues without retry |
| dependency audit | runtime retains only handlers + typed params | repository/UoW/resolver/raw config or dynamic registry detected | design/startup gate failure | application service internally uses its injected Ports |

API graph cannot start Command routes without Query routes or vice versa. A listener may expose a transport-specific health/readiness endpoint only if `04` and host design define it outside Capability Hub protocol inventory；it cannot claim the capability API ready before this matrix passes or answer business routes with “starting” placeholders.

### 120.2 Worker blocking matrix

| Gate | Pass condition | Blocking source | Required disposal / result | Runtime path that is deliberately not blocking |
|---|---|---|---|---|
| handoff family | Worker params、2 service handles、six named resolved decisions | `EntryParametersMismatch` / incomplete graph | drop handoff and all unstarted handles | none |
| slot identity | each named field matches exact consumer/family/schema | `SourceSlotIdentityMismatch` | no source runner returned | unsupported schema in a later encoded item |
| handler coverage | 6/6 facade methods and one dispatcher complete | `MissingInboundHandlerCoverage` / `IncompleteWorkerGraph` | drop facade/dispatcher；no task | typed ignored/rejected/quarantined receipt after dispatch |
| source construction | enabled slot has exact feed + matcher；Disabled has neither | `IncompleteSourceRunner` / `DisabledSourceHasRuntimeHandle` | drop all unstarted runners and opaque handles | configured feed later returns typed source failure |
| runtime primitives | one non-cancelling supervisor、stop、activation and global permit ownership | `NonCancellingRuntimeUnsupported` / `RuntimePrimitiveUnavailable` | drop unstarted runtime；startup error | observation timeout after an admitted delivery;same future is drained |
| task parking | every enabled named task starts behind same activation waiter | `TaskStartFailed` | abort activation；stop all prepared feeds；join every parked task in fixed order | one Disabled slot contributes no task and is still complete |
| cleanup totality | original start failure retained and all cleanup causes observed | optional `StartupCleanupFailed` aggregate | map once to startup `InfraError`;no activation release | runtime shutdown errors after successful activation use shutdown aggregate,not startup replay |

The number of enabled source tasks may be `0..=6`, but the number of named source decisions is always exactly six. Zero enabled tasks is a legal complete Worker graph only when all six bindings are explicit `Disabled`;it does not create six empty-success runners and does not make event collaboration an autonomous scan task. Exact-ref collaboration remains caller-supplied and independently admitted through the same global permit gate.

### 120.3 Jobs blocking matrix

| Gate | Pass condition | Blocking source | Required disposal / result | Runtime path that is deliberately not blocking |
|---|---|---|---|---|
| handoff family | Jobs params + one complete application service | `EntryParametersMismatch` / `IncompleteApplicationService` | drop handoff/service；startup error | malformed request after process creation |
| current-thread runtime | Tokio runtime builds with `rt,sync,time` and time driver | `RuntimeBuildFailed` | no host request accepted；startup error | deadline checked-add overflow on a concrete request is host-only invocation runtime failure |
| executor binding | bind occurs inside owned current-thread runtime and flavor matches | `CurrentRuntimeUnavailable` / `UnsupportedRuntimeFlavor` | drop runtime prefix；startup error | post-dispatch task join/terminal contradiction maps host-only runtime failure |
| static job graph | all eight handler, decoder, response, trigger and runner arms symmetric | `MissingHandlerCoverage` / `IncompleteDispatchGraph` | drop facade/runtime；startup error | typed `Retryable`, `Failed` or `Rejected` response;all are delivered once |
| parameter provenance | planning page/retry already bound into same application service；Jobs retains only byte/run bounds | provenance mismatch | startup error；no private retry accessor crosses crate | application-owned safe-reentry inside the one service invocation |
| process drive | one outer `block_on` can run admission through final shutdown drain | incompatible host/runtime integration | startup incompatibility；no scheduler fallback | caller observation cancellation;same `InFlight` invocation remains owned and drained |

Jobs entry has no “Disabled runner” branch because the selected Jobs process requires all eight closed protocol arms. Deployment may choose not to launch a Jobs process, but that host/deployment choice is not a partial selected-Jobs graph and cannot be represented by deleting runner arms after `CapabilityRuntimeEntryKind::Jobs` was selected.

## 121. Partial-graph Disposal、Cleanup 与 Failure Precedence

### 121.1 Ownership disposal matrix

| Failure location | Owned material at risk | Required disposal algorithm | Must not survive |
|---|---|---|---|
| Stage 0 | raw candidate / validation sources | discard raw/candidate after safe diagnostic mapping | raw config、secret/body、validated partial root |
| Stage 1~4 | authority、technical wrappers、local/external adapter handles | unwind owned constructor prefix；no handle is returned；all resource owners remain locally droppable | detached business task、published event、partial Port graph |
| Stage 5~7 | service `Arc`s、neutral handles、handoff fields | drop all local clones and consume/drop nonclone handoff exactly once | service locator、borrow into builder frame、second handoff |
| API factory | up to two concrete facades and cloned service handles | drop the complete local prefix before listener bind | one live route family、borrowed facade、protocol response |
| Worker factory before task start | dispatcher、runners、feeds/matchers、continuation seed | drop all unstarted owners | source fetch、completion token、continuation call |
| Worker partial task start | prepared feeds + parked task handles | activation abort -> six feed stops -> six joins；retain original + ordered cleanup causes | released task、accepted delivery、receipt/action |
| Jobs process factory | current-thread runtime、executor/facade/runtime prefix | leave build `block_on`,drop local owners before host receive | accepted bytes、spawned invocation、Job delivery |

Stage 1~7 constructors are forbidden from performing Capability Hub business mutation or external collaboration. A concrete product constructor may allocate a client、pool or local runtime resource, but it must return an owned handle that can be abandoned with the failed prefix and must not detach an unowned task or emit a business effect. If a future `04` product requires an asynchronous pre-handoff shutdown that cannot be retained behind such an owner, that binding is a real product blocker and must not be hidden by claiming ordinary Rust drop is sufficient.

### 121.2 Common no-partial-return algorithm

```text
build selected entry in local ownership
  -> after each stage, validate that stage completely
  -> on any error:
       retain exact startup source
       run only the cleanup contract already owned by that stage
       discard every untransferred prefix object
       return no handoff and no entry runtime
  -> after Stage 7, transfer exactly one handoff
  -> selected entry factory validates complete local runtime
  -> only selected entry's exposure barrier may make it externally callable
```

The algorithm does not define a generic rollback transaction. Startup cleanup only releases process-local resources and parked runtime ownership；it cannot roll back an already committed business write because business invocation is forbidden before exposure. Any implementation that needs to “compensate” capability truth during composition has already crossed the wrong boundary.

### 121.3 Failure source precedence

| Situation | Primary source | Additional source treatment | Forbidden precedence |
|---|---|---|---|
| one ordinary Stage 0~7 constructor failure | exact earliest blocking stage/source | later local drops are not invented as errors | generic `IncompleteGraph` replacing a known exact source |
| API local factory failure | exact `CapabilityApiCompositionError` | retained privately under startup mapping | HTTP status / `ApiError` replaces it |
| Worker start failure, cleanup succeeds | original `CapabilityWorkerCompositionError` | no empty aggregate wrapper | successful cleanup erases original |
| Worker start failure, cleanup also fails | original remains first;typed ordered cleanup causes retained | `StartupCleanupFailed` contains all causes | last cleanup failure replaces original、nested aggregate、string concat |
| Jobs runtime/factory failure | exact `CapabilityJobsCompositionError` | runtime/I/O source retained privately where variant permits | `JobError` / Job report replaces it |
| post-exposure failure | exact entry/application/runtime owner from §§122 and existing Step 12 | startup graph remains complete | mapping backward to `InfraError::RuntimeAssembly` to trigger fallback |

No row authorizes logging raw source text or exposing it through public response. Step 15 will define safe observability fields；this batch only fixes ownership and precedence.

## 122. Startup / Invocation Separation 与 Non-cancelling Boundary

### 122.1 Cross-entry phase matrix

| Phase | API | Worker | Jobs | Common invariant |
|---|---|---|---|---|
| shared assembly | no listener | no tasks released | no request accepted | only `InfraError::RuntimeAssembly`;zero business carrier |
| entry factory | facade/runtime local only | runners/continuation unstarted | owned current-thread process local only | composition-local error maps once to startup |
| exposure transition | listener begins accept | activation release | owned bytes enter one-shot admission | no second entry becomes available |
| pre-application item gate | route/byte/schema/context | fetch/byte/header/actor/schema/body | deadline/byte/header/job/schema/body | rejection/source outcome cannot create application side effects |
| post-dispatch observation | host response deadline cannot cancel handler | inbound/continuation observation timeout cannot cancel owned future | deadline/caller cancellation cannot abort owned task | same invocation remains driven;entry retry is not inferred |
| stable application result | exact Command/Query result or `ApiError::Application` | exact receipt/action or existing `WorkerError` | typed Job response or technical/runtime host exit | entry does not reread truth or synthesize another result |
| graceful end | host stops accepting and retains ownership obligations | six stops -> continuation drain -> six joins | `run_once -> shutdown` in one continuing `block_on` | no detached admitted invocation is claimed complete |

### 122.2 Non-cancelling implementation gate

The three entries share one semantic requirement but use different concrete owners:

| Entry | Owned post-dispatch unit | Observation may end? | Unit may be aborted/replaced? | Exact recovery owner |
|---|---|---:|---:|---|
| API | one runtime-owned handler future | yes,at transport response deadline/disconnect | no | runtime keeps future;Command durable replay / Query no-write remains application authority |
| Worker | one supervised inbound or exact-ref collaboration future plus delivery/terminal ownership | yes | no | same Worker supervisor,permit and completion/terminal guard drain it |
| Jobs | one Tokio task、join、sync terminal cell and original monotonic deadline | yes | no | same `InFlight` runtime slot and process final drain |

This common requirement does not permit a common executor abstraction. API framework selection remains `04`/implementation binding；Worker and Jobs already have distinct private Tokio ownership contracts. A framework/product that can only enforce timeout by dropping or aborting the application future fails the startup compatibility gate for that entry.

### 122.3 Owner-merger rejection matrix

| Proposed merger | Rejected because | Required boundary |
|---|---|---|
| infra starts API / Worker / Jobs directly | creates reverse Cargo edge and hides entry-specific lifecycle | infra stops at one neutral handoff；entry root composes itself |
| one process starts all three entries from one root | violates exactly-one entry and creates cross-entry fallback/state ambiguity | one validated root -> one selected entry -> one exposure barrier |
| Worker executes capability/tool/runtime requests | merges inbound integration with runtime execution owner | Worker only dispatches six reference/impact consumers and exact capture collaboration |
| Jobs owns scheduler/queue/lease/ack | turns one-shot application runner into scheduler truth | host chooses and submits exact request；Jobs owns no schedule state |
| API directly calls resolver/repository/Port | bypasses application idempotency、visibility and error authority | API calls exact application handler facade only |
| capability registry becomes method asset store | merges Method Library body/package truth | Hub stores body-free relation/ref/safe summary only |
| governance seam becomes approval engine | merges governance decision truth | Hub validates and records result reference/relation only |
| controlled exposure becomes SDK package/cache | merges SDK distribution/client owner | SDK only consumes formal controlled surface outside this graph |
| outbound event becomes marketplace listing or local delivery ledger | merges candidate/collaboration with listing or delivery truth | Hub owns immutable capture；external owner owns collaboration outcome |

## 123. Implementable Decision Procedures and Audit Gates

### 123.1 Three separate bootstrap procedures

The following pseudocode is deliberately split by binary. It does not introduce a shared runtime enum、generic factory or new callable.

```text
API bootstrap
  -> infra Stage 0..6 for selected Api
  -> construct one CapabilityApiEntryHandoff
  -> CapabilityApiRuntime::from_handoff
  -> audit framework non-cancelling ownership and closed route table
  -> bind/activate listener
  -> only then accept request bytes
```

```text
Worker bootstrap
  -> infra Stage 0..6 for selected Worker
  -> resolve all six named source decisions in fixed order
  -> construct one CapabilityWorkerEntryHandoff
  -> CapabilityWorkerRuntime::from_handoff
  -> start all enabled tasks parked behind one activation barrier
  -> on any start failure: abort + stop all prepared feeds + join all parked tasks
  -> otherwise release activation once
```

```text
Jobs bootstrap
  -> infra Stage 0..6 for selected Jobs
  -> construct one CapabilityJobsEntryHandoff
  -> build Tokio current-thread runtime with time enabled
  -> inside owned block_on bind executor and construct CapabilityJobsRuntime
  -> expose one complete CapabilityJobsProcess to host
  -> receive one owned request and keep the same block_on drive through shutdown drain
```

At every arrow, an error returns through the owning startup boundary and prevents later arrows. No arrow is an application retry point；no arrow may switch entry、replace configured binding with fake、or construct a public business result.

### 123.2 Mechanical implementation audit inventory

This inventory is a later Step 16 input, not a claim that tests have run.

| Audit family | Exact inventory | Pass condition |
|---|---:|---|
| shared runtime builder stages | 8 | Stage 0~7 ordered and no prefix returned |
| local/base Port slots | 27 | 27/27 concrete、same authority where required |
| external Port slots / callables | 9 / 14 | all concrete Configured/Fake/Disabled and exact callable surface |
| selected handoff per process | 1 | nonclone、entry-specific、consumed once |
| API services / handlers | 15 / 59 | 7+8 service handles；26+33 exact methods |
| Worker services / named source decisions | 2 / 6 | both handles；six decisions always present |
| Worker global permit / continuation owner | 1 / 1 | one gate shared by sources and continuation；no autonomous continuation task |
| Worker enabled task count | `0..=6` | exactly one parked task per enabled named source,none per Disabled source |
| Jobs service / dispatch symmetry | 1 / 8 | one service；8/8 decoder/handler/response/trigger/runner arms |
| entry exposure barriers | 3 kinds,1 selected | only selected listener/activation/request admission can open |
| infra reverse entry edges | 0 | no `infra -> api/worker/jobs` dependency |
| cross-entry dependency/fallback edges | 0 | entries do not import or start one another |
| public wire / DTO / Port / repository / state delta | 0 | this matrix changes no business/public schema |

### 123.3 Impossible-shape audit

| Impossible shape | Required detection point | Required result |
|---|---|---|
| two selected entries in one root | Stage 0 validation | startup failure before authority construction |
| matching params but wrong handoff family | Stage 7 / entry factory | composition/startup failure,not fallback |
| 8 external Ports + one missing Port | Stage 4 | no Stage 5 graph |
| API with 26 Commands but 32 Queries | API static audit | no listener |
| Worker with five resolved decisions and one absent decision | Stage 6 | no handoff |
| Worker Disabled slot carrying a feed/matcher | Worker factory | `DisabledSourceHasRuntimeHandle`;no activation |
| Worker fifth task started and sixth spawn fails | Worker `start` | abort、six-stop phase、join all parked tasks、no activation |
| Jobs with seven runner arms | Jobs static audit | no process/request admission |
| Jobs runtime built on multi-thread flavor | executor bind | startup failure；no runtime fallback |
| post-dispatch timeout interpreted as zero effect | runtime ownership audit | implementation rejection；same invocation must drain |
| any startup error serialized as protocol response | bootstrap boundary audit | implementation rejection；retain startup source only |

## 124. Cross-step Closure、Formal Source、Rustdoc Gate 与 Stop Review

### 124.1 Step 3~13 closure audit

| Upstream seam | `14.5.2.3` result | Baseline impact |
|---|---|---|
| Step 3/4 dependency direction | seven-member graph and `infra -X-> entry` direction preserved；selected entry owns its root | no crate/file-layout reopen |
| Step 5 module owner | infra builds adapters/application graph；API/Worker/Jobs retain route/loop/runner ownership | no module responsibility change |
| Step 6 object inventory | startup runtime/handoff types remain technical assembly carriers,not HLD business objects | 43 HLD + 7 application helper baseline unchanged |
| Step 7 Port/repository contracts | 27 local/base + 9 external = 36 Port bindings remain exact；33 async traits retain `async-trait` binding | 36 Ports、22 / 110 repositories/methods unchanged |
| Step 8 protocol contracts | API 59、Inbound 6、Outbound 10、Jobs 8 inventories remain closed；23 async handler traits unchanged | 250 public types、83 protocols unchanged |
| Step 9 function flows | entry only dispatches existing application flow；composition produces zero business side effect | 83 / 83 flows unchanged |
| Step 10 states | startup stages、Worker activation and Jobs runtime progress remain technical/nonpersisted | 24 state-like enums / 111 active variants / 638 pair baseline unchanged |
| Step 11 persistence | all local adapters still share one authority；entry obtains no direct repository/UoW | 22 / 110 persistence surface unchanged |
| Step 12 errors | startup / source / application / host-runtime surfaces remain separated | 17 errors、51 issue codes、83 / 83 mapping unchanged |
| Step 13 idempotency/reentry | no startup invocation；post-dispatch timeout/cancel keeps same invocation owner | 40 write operation key/digest and safe-reentry rules unchanged |

No controlled reopen is required. The active non-blocking L0-core design-sync debts remain unchanged；the target implementation repository remains absent and is still a later implementation prerequisite, not an upstream design blocker.

### 124.2 Historical material and boundary audit

| Material / risk | Status | Treatment |
|---|---|---|
| old unified capability runtime / provider execution gateway | `historical_material` | excluded from all three entry graphs |
| old tools execution and result ownership | `historical_material` | no tool invocation Port、runner or state enters Hub |
| old governance policy / approval execution | `historical_material` | only result-reference/relation seam remains |
| old method body/package/cache ownership | `historical_material` | only body-free method asset relation/ref remains |
| old marketplace listing / pricing / fulfillment | `historical_material` | no listing or transaction graph is constructed |
| old SDK client/package distribution | `historical_material` | SDK remains external controlled-surface consumer |
| scheduler/queue/lease/ack in Jobs | forbidden owner merger | host-only material；not request/journal/report truth |
| local outbox/relay/DLQ/attempt lifecycle | forbidden owner merger | no hidden store or runtime graph added |
| unresolved upstream blocker | `0` | all blocking predicates can be expressed using current exact contracts |

### 124.3 Structure comment and English Rustdoc gate

This batch adds no Rust declaration or signature. The gate therefore audits the declarations already introduced or changed by `14.5.2.2.1~14.5.2.2.3` rather than adding a placeholder type:

| Declaration family re-audited | Result |
|---|---|
| API application bundle、handoff、two facade structs、runtime、composition enum、fields、variants、payloads and callables | complete English `///` retained |
| Worker application bundle、resolved source carrier、handoff、dispatcher/runner/runtime/task/permit/activation/continuation/terminal/cleanup declarations and callables | complete English `///` retained |
| Jobs application bundle、handoff、facade、dispatch/response/runtime/deadline/executor/terminal/guard/process/error declarations and callables | complete English `///` retained |
| Step 7 33 async trait declarations and methods | 33/33 attribute binding retained；trait/method Rustdoc unchanged and complete |
| Step 8 23 async handler/service traits、methods and metadata copy callable | 23/23 attribute binding retained；struct/field/variant/callable Rustdoc unchanged and complete |
| new structs / fields / enums / variants / payloads / traits / callables in this batch | `0 / 0 / 0 / 0 / 0 / 0 / 0` |

Compact impl skeleton comments remain non-substitutes for method Rustdoc：implementation must expand every trait method with its required English `///`. Enum struct-variant payload fields remain individually documented and never use field-level `pub`.

### 124.4 Formal `03` §13 assembly source increment

Step 19 must preserve the following `14.5.2` final closure when assembling formal §13:

1. Runtime assembly is one strict Stage 0~7 prefix: validated root -> one authority -> technical primitives -> 27 local/base Ports -> 9 external Ports -> selected application graph -> entry-neutral inputs -> one nonclone handoff.
2. A graph is complete only when the selected entry factory、runtime ownership and static protocol coverage also pass. Missing/wrong-family/constructor/coverage failure blocks startup；explicit Disabled is a complete typed decision with no fake success.
3. One validated root selects exactly one API、Worker or Jobs entry. There is no mixed process、cross-entry import or failure fallback；infra does not depend on entry crates.
4. API requires 15 application handles and 26/26 Command + 33/33 Query coverage before listener accept；its framework must retain the same application future after response observation timeout.
5. Worker always carries six named source decisions and two application handles. It releases one activation barrier only after every enabled named task is parked；partial start performs fixed stop/join cleanup and emits no receipt/action.
6. Jobs requires one application service and 8/8 request/handler/response/trigger/runner symmetry inside its owned Tokio current-thread process. Runtime build/bind failure is startup；admission/deadline/drain outcomes after process creation retain Jobs host/runtime ownership.
7. Startup composition has zero business invocation/effect and maps only to startup failure. After exposure, API / Worker / Jobs use their existing source/application/runtime surfaces and never map backward to startup to select another binding.
8. Timeout or caller cancellation after dispatch ends only observation. API runtime、Worker supervisor or Jobs `InFlight` owner continues and drains the same invocation；none may abort、retry、replace identity or claim zero effect.
9. Partial graph ownership is never returned. API/Jobs prefixes drop before exposure；Worker partial task start additionally aborts activation、stops all prepared feeds and joins all parked tasks while preserving original and cleanup causes.
10. Composition does not merge runtime/tools execution、marketplace listing、governance approval、method body/package、SDK client/cache、scheduler/ack or local delivery lifecycle into Capability Hub.

### 124.5 Batch completion gate

| Gate | Result | Source |
|---|---|---|
| complete shared predicate covers Stage 0~7 | pass | §§118.1~118.2 |
| Configured / Fake / Disabled / Missing are unambiguous | pass | §§118.3、120 |
| exactly one handoff/root/runtime/exposure barrier | pass | §119.1 |
| API final blocking matrix complete | pass | §§119.2~119.3、120.1 |
| Worker final blocking and partial-start cleanup matrix complete | pass | §§119.2~119.3、120.2、121 |
| Jobs startup/admission/drain separation complete | pass | §§119.2~119.3、120.3、122 |
| startup vs invocation error owner is total | pass | §§121.3、122.1 |
| post-dispatch non-cancelling ownership is explicit for all entries | pass | §122.2 |
| owner-merger and historical-material exclusion | pass | §§122.3、124.2 |
| cross-step baseline remains coherent | pass | §124.1；no controlled reopen |
| structure comments / English Rustdoc | pass | §124.3；batch declaration delta zero |
| formal `03` modified | no | formal assembly remains Step 19 |
| `14.5.3` entered | no | next batch requires another user confirmation |
| `04` / implementation ledger / boundary skeleton created | no | reserved for later formal documents / `07` |
| implementation/test/run/evidence/sign-off/commit claimed | no | none produced or claimed |
| unresolved upstream blocker | none | all cross-entry blocking predicates are closed |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.2.3
gate_status = 03_step_14_batch_14_5_2_3_completed_stop_review
step_14_status = in_progress
batch_14_5_2_status = completed_stop_review
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
shared_builder_stages = 8/8
local_base_port_bindings = 27/27
external_port_bindings = 9/9
external_port_callables = 14/14
selected_entry_per_root = 1
selected_handoff_per_process = 1
api_application_handles = 15/15
api_handler_coverage = 59/59 = command:26/26 + query:33/33
worker_application_handles = 2/2
worker_named_source_decisions = 6/6
worker_enabled_source_tasks = 0..6 according to explicit binding decisions
worker_global_permit_gates = 1
worker_autonomous_continuation_tasks = 0
jobs_application_handles = 1/1
jobs_dispatch_symmetry = 8/8
entry_exposure_barriers_opened_before_complete_graph = 0
partial_graph_return_paths = 0
cross_entry_fallback_paths = 0
infra_to_entry_cargo_edges = 0
public_wire_dto_port_repository_state_delta = 0
rust_declaration_delta_in_batch = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_3
```

Batch `14.5.2.3` and the complete `14.5.2` runtime-builder/composition substage are now closed and stop for review. After explicit user confirmation, the only allowed next batch is `14.5.3`: read the dependency classification、runtime/event/downstream boundaries and current Configured/Fake/Disabled/Missing rules, then write the ASCII trimming diagrams and unavailable/fake/fixture parity matrix. Do not enter `14.5.4`、`14.6`、Step 15、formal `03` assembly、`04-配置设计.md` or any implementation artifact in that next batch.

---

## 125. Batch `14.5.3` 开工确认、读取结果与裁剪范围

### 125.1 授权、直接输入与本批边界

用户已确认从 `14.5.2.3` 停审点进入 `14.5.3`。本批只把已经闭合的跨仓分类、九个 external Port、六个 Inbound source slot、十个 Outbound event family、三个 entry 和下游消费面裁剪成可审查的 ASCII 依赖图与 parity matrix；不进入 `14.5.4`，不修改正式 `03-详细设计.md`。

| 项目 | 本批裁决 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 14 `定义配置引用与外部依赖绑定` |
| 当前批次 | `14.5.3` runtime / event / downstream dependency trimming and parity |
| 已读标准 | `详细设计讨论流程_SOP.md` Step 14、`详细设计书写规范.md` §5.13、`全局项目依赖关系与裁剪规则.md` §6、`设计真相源闭环与可落码性标准.md`、中间产物规范 |
| 已读上游 | 正式 `00/01/02`；Step 3/4/5/7/8/9/11/12/13；本文件 §§67~124；`L1-governance` 与 `L1-artifact` 对应依赖裁剪图正文 |
| 本批必须输出 | 编译期依赖裁剪图、runtime / external source 裁剪图、inbound / outbound event collaboration 裁剪图、downstream consumer 裁剪图、逐边 owner / 协作方式 / Cargo 禁止项、四态 parity、repository existence / profile / unavailable matrix、formal §13 source 与停审快照 |
| 本批明确不输出 | 具体 transport / broker / HTTP client / DB / scheduler / secret product、配置 key/env/default、观测字段、测试用例、implementation boundary、真实运行结果 |
| Rust-facing 增量 | `0`；不新增或修改 struct、field、enum、variant、payload、trait、callable、Port、protocol、state或Cargo source |
| 正式与实现纪律 | 正式 `03` 不修改；不创建 `04`、implementation ledger、planned boundary skeleton、目标实现仓；不伪造测试、run_id、evidence、签署或commit |

### 125.2 SOP 八问裁决

| SOP 问题 | 本批回答 | 代码落点 / owner |
|---|---|---|
| 哪些模块读取配置？ | 只有 `infra/config.rs` 解析 raw source，`infra/runtime_builder.rs` 读取 immutable validated root；application、domain、contracts和entry handler不读取raw config。 | `infra` owns parsing and assembly; entry root consumes one typed handoff. |
| 配置类型、默认值和读取位置是什么？ | 本批只复核既有 profile、entry、Port binding、source decision、route binding和typed technical parameter；精确 key、source precedence、default和数值留给 `04`。 | `14.1/14.2` validated root; `04` owns operator-facing schema. |
| 哪些外部依赖通过 adapter 注入？ | 七类 resolver、audit handoff、event collaboration共九个 external Port；六个 Inbound source和十个 Outbound route均通过这些已注入边界协作。 | `infra::source_resolvers`、`handoff_adapters`、`publishers`及Worker source owner. |
| 超时、重试、降级如何处理？ | startup constructor / static contract failure阻塞；已完成调用期的 `TemporarilyUnavailable` / `Timeout` 沿既有 Port/application surface；typed `Failed` / `HandoffUnavailable` 保持 outcome，不降成technical error；不自动换Fake。 | Step 12/13 error and effect-boundary owners; no new taxonomy. |
| 哪些细节留给配置设计？ | raw parser format、key/env、endpoint、credential reference source、transport product、numeric default、deployment secret handling和operator diagnostics。 | `04-配置设计.md`;本批只保留 binding point。 |
| 哪些跨仓 Rust 依赖进入 Cargo？ | 只有 `core-contracts` package / `core_contracts` library / `../quantalithos-core/crates/contracts` path；bus、governance、method-library、SDK及所有 runtime/downstream关系不进入 Cargo。 | Seven-member matrix §§69~74; implementation gate must reject other sibling edges. |
| 哪些运行期 / 事件依赖如何表达？ | runtime source用 external Port / adapter / typed ref；Inbound用六个closed source runner；Outbound用 immutable capture + one collaboration Port + named route slots；下游只消费 formal exposure / controlled view / ref / safe summary。 | §§40~66、§§128~130; no local outbox/relay/DLQ. |
| 依赖仓库不存在时怎么办？ | 编译期 required path缺失或契约不兼容是 startup/design blocking；optional external/downstream缺失只能形成 explicit Disabled / NotConfigured 或保持 integration prerequisite；不可静默换Fake，Deployment禁止Fake。 | `MissingSource`、`NotConfigured`、`TemporarilyUnavailable/Timeout`、`InvalidContract/ConsistencyDefect`四分法。 |

### 125.3 图例与判定语义

后续四张图遵循全局依赖规则。`[compile]` 表示源码级 package / Cargo dependency；`[runtime]` 表示运行期 adapter、API或consumer boundary；`[event]` 表示通过事件协作、source feed、capture或handoff协作。图中的箭头表示依赖、提供或消费方向，不表示函数调用顺序、事件传播时序、启动顺序或重试顺序。

图中只保留与 `L3-capability-hub` 相关的边，不复制 27 仓总图。`core-contracts` 是唯一可进入 Cargo 的 sibling；`L0-bus`、governance、method-library、SDK、runtime、tools、marketplace、observability和外部 MCP/A2A/API均通过非-Cargo边承接。

## 126. Compile-time dependency trimming

### 126.1 Compile crop

#### 依赖裁剪图: L3-capability-hub

```text
Global baseline
  |
  | crop only L3-capability-hub compile-related edges
  v
+--------------------------------+  [compile]  +----------------------+
| contracts / domain /           +------------>| L0-core              |
| application / infra / worker   |             | core-contracts       |
| approved direct owners         |             +----------------------+
+--------------------------------+

+----------------------+
| api / worker / jobs  |
+----------+-----------+
           | [compile] direct: infra / application / contracts
           v
+----------+-----------+
| infra                |
+----------+-----------+
           | [compile] direct: application / domain / contracts
           v
+----------+-----------+
| application          |
+----------+-----------+
           | [compile] direct: domain / contracts
           v
+----------+-----------+
| domain               |
+----------+-----------+
           | [compile] direct: contracts
           v
+----------+-----------+
| contracts            |
+----------------------+
```

图示说明:

- 顶部 `[compile]` 只表示允许的 sibling path dependency：`core-contracts = { path = "../quantalithos-core/crates/contracts" }`；不表示任何 core domain / application / job implementation可被导入。
- 下方 local edges 是目标 workspace 内七个 member 的已闭合方向；每层标签列出其全部直接本仓依赖，共15条direct edge。`infra`不依赖 `worker`、`api`或`jobs`，三个entry分别拥有composition root。
- `api`、`jobs` 对 `core-contracts` 的 direct use保持禁止；它们通过 contracts-owned typed envelope / metadata carrier消费上游契约。图只表达依赖裁剪，不表达构造顺序。
- 任一 required path缺失、package/lib不匹配、shared signature或字节语义不兼容，都在编译/启动边界阻断；不得创建相似本地crate替代。

### 126.2 Compile-time edge owner matrix

| 边 / 使用面 | owner | 允许的源码内容 | Cargo 处理 | 禁止项 |
|---|---|---|---|---|
| `contracts -> core-contracts` | `contracts` | shared actor、metadata、id、timestamp、version及已批准的shared protocol carrier | direct path dependency | core domain/service/job implementation、复制shared type |
| `domain -> core-contracts` | `domain` | core shared metadata / value type进入domain contract | direct path dependency | repository、Port、transport、external正文 |
| `application -> core-contracts` | `application` | operation context、metadata映射和授权的`IdempotencyKey::as_str().as_bytes()`语义 | direct path dependency | 改变byte semantics、第二套core metadata、core application |
| `infra -> core-contracts` | `infra` | adapter / envelope / timestamp边界映射 | direct path dependency | bus/governance/runtime实现、业务truth |
| `api -> core-contracts` | API entry owner | 无direct use；使用contracts-owned typed carrier | direct dependency denied | 入口声明第二套Actor/Metadata/Id类型 |
| `worker -> core-contracts` | Worker entry owner | header-first source carrier所需的shared actor/trace/metadata | direct path dependency | 从topic/offset/text推导source identity、保存raw body |
| `jobs -> core-contracts` | Jobs entry owner | 无direct use；使用contracts-owned Job metadata/request carrier | direct dependency denied | 从CLI/transport字符串猜Job kind或复制run authority |
| `infra -> worker/api/jobs` | no owner; forbidden edge | none | reject, including optional / feature / callback disguised edge | infra启动entry、持有entry concrete graph、反向Cargo cycle |
| any Hub member -> bus/governance/method-library/SDK/runtime/tools/marketplace | no Cargo owner | none; use Port/event/API/handoff/fake boundary | reject all sibling Cargo/path/git edges | import external domain/client/implementation |

### 126.3 Compile-time blocking and non-blocking distinction

| 情况 | 设计分类 | 允许行为 | 不允许行为 |
|---|---|---|---|
| `core-contracts` path不存在或package/lib不匹配 | `MissingSource` / `InvalidContract` | 停止需要该contract的实现边界，保留安全startup source chain | 生成本地替代DTO、自动下载或转DeterministicFake |
| 非core sibling目录不存在 | downstream / runtime prerequisite | 继续本地access truth设计；把对应consumer/integration标为未绑定 | 创建临时crate、把下游缺失转成Hub执行器 |
| 非core sibling目录存在但无已批准typed contract | integration contract gap | 通过现有Port / event / API boundary等待绑定 | 直接写Cargo path dependency或复制领域模型 |
| 上游shared bytes/signature变化 | `InvalidContract` / controlled reopen | 回开Step 8/13/14指定owner | 用generic JSON/string fallback继续实现 |

## 127. Runtime / external-source dependency trimming

### 127.1 Runtime / external crop

#### 依赖裁剪图: L3-capability-hub

```text
Global baseline
  |
  | crop only L3-capability-hub runtime and external-source edges
  v
                     +---------------------------+
                     | External MCP / A2A / API |
                     +-------------+-------------+
                                   | [runtime]
                                   v
+----------------------+   +-------+-----------------------+
| source / descriptor  +-->| nine external Port bindings  |
| ref / safe summary   |   | resolver / handoff / collab  |
+----------------------+   +-------+-----------------------+
                                   | [runtime]
                                   v
                         +---------+----------+
                         | application Ports |
                         | and service graph  |
                         +---------+----------+
                                   |
                                   | [runtime]
                                   v
                         +---------+----------+
                         | selected API /     |
                         | Worker / Jobs root |
                         +--------------------+

L1-governance ----[runtime]----> governance ref / safe-summary resolver
L3-method-library -[runtime]----> method asset ref / body-free relation resolver
secret / KMS / Vault -[runtime]-> SecretReferencePort
observability / audit -[runtime]-> reference and handoff Ports
```

图示说明:

- 外部 MCP、A2A和API只提供typed source context、descriptor target或body-free observation；它们不进入application truth，也不触发runtime/tools execution。
- 九个 external Port slot是完整注入面：七类resolver、`ObservabilityAuditHandoffPort`和`CapabilityAccessEventCollaborationPort`；显式 `Disabled` 仍构造 concrete `NotConfigured` Port。
- application只看到既有Port trait和typed result；entry root只看到完成的application facade / neutral handoff，不读取endpoint、credential、raw ref或外部client。
- 具体外部产品的连接探测时机由 `04` 决定；构造期失败阻塞startup，已绑定client的调用期temporary/timeout保留到既有typed failure surface。

### 127.2 Runtime edge owner and forbidden surface matrix

| runtime edge | provider / consumer owner | Hub binding | allowed collaboration | Cargo prohibition |
|---|---|---|---|---|
| external MCP/A2A/API -> source reference | external integration owner | `ExternalCapabilitySourceReferencePort` | typed source ref / resolution observation / descriptor context | no provider SDK or protocol-domain crate in Cargo |
| governance -> capability-hub | `L1-governance` owns approval/Policy truth | `GovernanceResultReferencePort` + governance Inbound source | result ref、policy result ref、allowed safe summary、seam relation | no governance domain / approval engine / policy client crate |
| method-library -> capability-hub | `L3-method-library` owns method body | `MethodAssetReferencePort` + method Inbound source | body-free method asset ref、relation、safe summary | no method-library source/body crate |
| secret platform -> capability-hub | secret owner outside Hub | `SecretReferencePort` | secret ref、handling boundary、safe exposure marker | no secret SDK/value/rotation state |
| document / observability / audit -> capability-hub | source owner outside Hub | document/audit resolver and handoff Ports | body-free ref、safe summary、typed handoff outcome | no raw document/log/span/metric/evidence body |
| runtime/tools/SDK consumer -> capability-hub | downstream consumer owns execution/client | `CapabilityConsumerReferencePort`、formal exposure、controlled view | consumer ref、formal boundary、feedback / impact summary | no runtime/tools/SDK implementation dependency |
| event bus -> source/collaboration | bus owns transport | six Inbound bindings + ten Outbound capture/collaboration slots | encoded envelope, source identity, typed outcome | no bus SDK or bus state in application/domain |

## 128. Inbound / outbound event collaboration trimming

### 128.1 Event crop

#### 依赖裁剪图: L3-capability-hub

```text
Global baseline
  |
  | crop only L3-capability-hub event collaboration edges
  v
+----------------+  [event]  +---------------------------+
| L0-bus /       +---------->| six Inbound source slots  |
| source feeds   |           | source/schema/actor gate  |
+----------------+           +-------------+-------------+
                                            | [event]
                                            v
                               +------------+-------------+
                               | Worker source dispatcher |
                               | six exact application    |
                               | consumer callables       |
                               +------------+-------------+
                                            | [runtime]
                                            v
                                  application inbound service

application truth
        | [event]
        v
+-------+----------------+
| ten Outbound event    |
| families + capture    |
+-------+----------------+
        | [event]
        v
+-------+----------------+
| one collaboration Port|
| named route per family|
+-------+----------------+
        | [event]
        v
L0-bus / external collaboration owner
(delivery status outside Hub)
```

图示说明:

- Inbound 的六个slot是 `Governance`、`MethodLibrary`、`DownstreamConsumer`、`ExternalCapabilitySource`、`ObservabilityAudit`、`ExternalDocument`；每个slot都有固定logical event、schema 1、trusted actor、handler和application callable。
- Outbound 的十个family各自有固定schema ref、logical routing key、source gate和capture callable；physical route只在infra adapter内解析，不能进入public envelope、capture identity或local state。
- Worker只拥有source runner、header-first gate、delivery/stop lifecycle和exact application facade调用；它不持有repository、publisher、outbox、relay、DLQ或delivery attempt truth。
- 外部delivery status由 collaboration Port / external owner维护；本地只保留immutable snapshot/capture和`Captured -> IntentBound`，不建立local delivery lifecycle。

### 128.2 Event collaboration edge matrix

| event edge | source / route owner | Hub owner | exact binding | Cargo prohibition / boundary |
|---|---|---|---|---|
| `L0-bus -> six Inbound` | bus/host owns transport feed | Worker entry + application inbound service | six named source decisions; source/schema/actor/header-first gate; 6/6 handler mappings | no bus crate in application/domain; no topic/group truth in protocol |
| six Inbound -> application | Worker owns dispatch; application owns business effect | `CapabilityInboundConsumerService` | one exact callable per closed consumer; receipt maps to `Complete` / `RetrySameEvent` / `Quarantine` | Worker cannot call repository/UoW/resolver directly |
| application truth -> ten Outbound capture families | application source operation owns truth and snapshot | application capture service / existing capture repositories | one source/schema/capture mapping per family; same-UoW immutable capture | no event mapper in worker/transport; no report-as-truth-change |
| capture -> collaboration Port | application facade owns candidate formation | `CapabilityAccessEventCollaborationPort` | candidate from official snapshot; `collaborate/get/list/repair` preserve source/intent/status symmetry | no local outbox/relay/DLQ/attempt lifecycle |
| collaboration Port -> physical route | external adapter owns route and delivery | infra publisher adapter | ten named route slots; route excluded from candidate identity/digest/state | no topic/route alias in public DTO or Cargo dependency |
| observability/audit -> handoff | external owner owns receipt | application trace/impact service + handoff adapter | exact trace/export ref + audit ref; typed handoff outcome | no evidence alias, sign-off or audit body in Hub |

### 128.3 Event unavailable and fake boundary

| branch | startup / invocation phase | required owner | allowed result | forbidden result |
|---|---|---|---|---|
| Inbound source binding `MissingSource` / wrong family | startup | `infra` + selected Worker root | startup blocking; no source task, receipt or ack | auto-create feed, wildcard dispatch, fake success |
| Inbound source explicitly `Disabled` | startup complete, source slot closed | Worker root | no runner/task for that slot; other selected graph remains explicit and total | empty receipt, synthetic `Ignored`, hidden fallback source |
| Inbound configured/fake fetch or decode temporary failure | invocation | Worker/application source owner | existing source/Worker typed failure and owner-specific recovery | convert to successful receipt or create local retry state |
| Outbound collaboration `Disabled` | graph complete; Port call | external Port/application mapping | exact `PortFailure(NotConfigured)`; capture remains recoverable | switch to fake, mark Delivered, create local DLQ |
| Outbound typed `Failed` / `HandoffUnavailable` | invocation after candidate formed | collaboration Port owner | typed outcome with stable intent/reason; local source truth unchanged | wrap as generic error or rollback source truth |
| Outbound raw temporary/timeout before typed outcome | invocation | Port/application effect-boundary owner | existing `TemporarilyUnavailable` / `Timeout`; same candidate/intent recovery only when safe | new retry taxonomy, blind duplicate delivery |
| malformed event/collaboration carrier | startup if constructor/static; invocation if returned response | contract/application consistency owner | `InvalidContract` / existing `ConsistencyDefect`; stop or preserve capture according to existing flow | downgrade to unavailable or fake |

## 129. Downstream consumer dependency trimming

### 129.1 Downstream crop

#### 依赖裁剪图: L3-capability-hub

```text
Global baseline
  |
  | crop only L3-capability-hub downstream consumer edges
  v
+----------------------------+
| L3-capability-hub truth    |
| identity / registry /      |
| descriptor / seam /        |
| method relation / exposure |
+-------------+--------------+
              | [runtime]
              v
    +---------+----------+       [runtime]       +----------------+
    | formal exposure   +----------------------->| L0-sdk         |
    | controlled view   |                        | SDK consumer   |
    +---------+----------+                        +----------------+
              |
              | [runtime]
              +---------------------> L2-runtime / L2-tools
              |
              | [runtime/event]
              +---------------------> L5-console / L6-marketplace
              |
              | [runtime/event]
              +---------------------> observability / archive / audit boundary

L2-runtime / L2-tools ----[event/runtime]----> capability feedback / impact input
```

图示说明:

- 下游只消费 formal exposure、controlled consumer view、descriptor safe summary、consumer ref和变化/影响摘要；下游不能反写 capability identity、registry、descriptor、seam、relation或formal exposure。
- `L0-sdk`是服务端边界的消费者，不是 Hub 的编译期 client owner；runtime/tools执行、SDK package/client、console状态和marketplace listing均在边界外。
- `L5-console`、`L6-marketplace`、observability/archive若缺失，只影响管理、发现、审计或归档消费，不阻塞本地核心truth；它们不得被本仓改造成required runtime dependency。
- 下游反馈若进入Inbound，只能经过六个closed source family之一和typed consumer impact/ref contract；不能通过任意 callback、shared database或源码依赖回写。

### 129.2 Downstream edge owner matrix

| downstream edge | consumer owner | Hub provides | Hub does not provide | Cargo rule |
|---|---|---|---|---|
| `L3-capability-hub -> L2-runtime` | runtime owns execution | formal exposure、controlled view、descriptor/ref、change/impact signal | execution plan、invocation、provider route、quota、cost、result | no runtime crate edge |
| `L3-capability-hub -> L2-tools` | tools owns tool execution | external capability access facts、controlled consumer surface、consumer ref | MCP/A2A/API call、tool result、tool authorization engine | no tools crate edge |
| `L3-capability-hub -> L0-sdk` | SDK owns client/package | service-side exposure and typed public boundary | SDK client、language binding、cache、publication truth | no SDK crate edge |
| `L3-capability-hub -> L5-console` | console owns management UI | management API / read-only browse boundary | UI state、workflow presentation、console cache truth | no console crate edge |
| `L3-capability-hub -> L6-marketplace` | marketplace owns discovery/listing | read-only discovery summary / object ref candidate | listing、pricing、transaction、fulfillment、ranking | no marketplace crate edge |
| `L3-capability-hub -> observability/archive` | external infra owns store/archive | audit-safe ref、trace/export handoff、summary | raw logs、metrics、audit store、archive package/body | no sibling crate edge |
| downstream feedback -> Hub | source consumer owns feedback context | typed impact/reference inbound boundary | arbitrary mutation callback、execution truth、consumer cache as truth | only existing event/API/Port boundary |

## 130. Four-state parity matrix: Configured / DeterministicFake / Disabled / Missing

### 130.1 Binding-level parity

| 绑定状态 | 构造条件 | graph cardinality | source / Port行为 | evidence / truth语义 | fallback |
|---|---|---:|---|---|---|
| `Configured` | exact family adapter、validated ref、constructor/probe policy通过 | required slot concrete，9/9 external Port total | 真实 typed adapter；调用期返回既有 observation/outcome或typed failure | 只表示真实绑定；不会自动产生evidence/签署 | 不允许切换Fake或另一family |
| `DeterministicFake` | Local/Integration显式选择，exact fixture family和parity gate通过 | 与Configured相同的slot/cardinality | 复用同一 source/schema/header/actor/negative/error/stable-intent语义；无真实外部副作用 | fake可产生测试输入/typed outcome，但不得伪造真实evidence、验收或外部receipt事实 | Deployment禁止；不可由Missing/Unavailable隐式选择 |
| `Disabled` | validated config显式关闭一个允许disabled的external Port或Worker source slot | external Port仍为concrete `NotConfigured`；Worker slot有decision但无task | Port调用返回既有`NotConfigured`；Worker无runner、fetch、receipt、ack或假成功 | 不产生observation、capture intent、delivery state或success | 不允许切Fake、空成功或删除required local Port |
| `Missing` | required section、path、family、fixture、shared contract或constructor material缺失/不兼容 | graph incomplete；不能通过Stage 0~7或entry gate | 无调用面；startup/design blocking，不能构造partial graph | 无invocation identity、receipt、capture、report、evidence | 不允许自动Disabled、Fake、fallback entry或generic JSON |

### 130.2 Phase and failure parity

| 现象 | `Configured` | `DeterministicFake` | `Disabled` | `Missing` |
|---|---|---|---|---|
| startup constructor failure | `InfraError::RuntimeAssembly`，drop prefix | fixture constructor/static mismatch同样startup failure | 只有显式Disabled构造成功 | `InfraError::RuntimeAssembly`或design blocking；无runtime |
| invocation temporary unavailable | existing `PortFailure(TemporarilyUnavailable)` / entry source surface | same typed class and same recovery/effect boundary | `PortFailure(NotConfigured)`，不是temporary | 不可调用；不能返回业务结果 |
| invocation timeout | existing typed `Timeout`，保留owner/非取消语义 | same typed `Timeout` and non-cancelling owner semantics | `NotConfigured`，不伪造timeout | 不可调用 |
| malformed typed response / schema | `InvalidContract` / existing `ConsistencyDefect` | fake必须同样拒绝并保持同类分类 | not applicable after valid Disabled construction | startup if known statically, otherwise consistency blocking; never unavailable fallback |
| post-commit typed external failure | preserve typed `Failed` / `HandoffUnavailable` and local truth | same status, source/intent/reason symmetry | no call, no status | no candidate/intent exists |
| retry / recovery authority | existing application / durable proof / same intent | same owner and bounded rule | explicit operator/config repair only | design/assembly repair; no invocation retry |

### 130.3 Profile and repository existence matrix

| surface | Local | Integration | Deployment | current repository fact |
|---|---|---|---|---|
| local persistence authority | `InMemory` or `Durable` with same CAS/UoW/read parity | `InMemory` or `Durable` with same parity | `Durable` only | design contract exists; target implementation repo absent |
| external Port | `Configured` / `DeterministicFake` / `Disabled` | `Configured` / `DeterministicFake` / `Disabled` | `Configured` / `Disabled`; Fake forbidden | nine slots and 14 callables are design-closed |
| six Inbound source slots | six named decisions; each `Configured`/`Fake`/`Disabled` | same | configured or explicit Disabled; no fake | bus directory exists, Hub implementation repo absent |
| ten Outbound route slots | configured adapter, fake adapter or whole-Port Disabled | same | configured or whole-Port Disabled | route names are design facts, physical transport absent |
| `quantalithos-core/crates/contracts` | required path | required path | required path | exists; package `core-contracts`, lib `core_contracts` |
| `quantalithos-bus` | fake allowed | real binding or explicit unavailable gate | real binding required for enabled source/route | directory exists; no Cargo edge authorized |
| `quantalithos-governance` | typed fixture/fake allowed | typed resolver/event binding | enabled binding required; otherwise Disabled/Unavailable | directory exists; no Cargo edge authorized |
| `quantalithos-method-library` | body-free fixture/fake allowed | typed resolver/event binding | enabled binding required; otherwise Disabled/Unavailable | directory exists; no Cargo edge authorized |
| `quantalithos-sdk` | consumer may be absent | integration consumer gate | consumer deployment gate separate | directory exists; no Cargo edge authorized |
| runtime/tools/marketplace | explicit fixture or absent downstream consumer | separate integration gate | separate deployment gate | directories absent; no local substitute permitted |
| observability/audit/archive/console | safe summary/handoff fake or absent | separate handoff/consumer gate | external owner gate | directories not found in current `/home/aris/Projects` check |

“目录存在”只证明本地调查输入存在，不证明 typed contract、配置、可连通性或 deployment readiness；“目录缺失”也不授权在设计仓创建替代实现。`core-contracts` 的 path/package/lib事实已经核实，但不代表目标实现 workspace、Cargo lock、编译或测试已存在。

## 131. Repository existence、profile 与 unavailable decision procedure

### 131.1 机械判定顺序

```text
1. classify relation as compile / runtime / event / downstream
2. for compile: verify path + package + library + approved API/bytes
3. for runtime/event: verify typed Port/protocol/source family and profile branch
4. choose exactly one of Configured / DeterministicFake / Disabled / Missing
5. run Stage 0~7 and selected-entry static coverage gate
6. only a complete graph crosses exposure barrier
7. after exposure, map invocation failure to the existing owner surface
```

The procedure is a design decision sequence, not an implementation/test result. It does not authorize lazy adapter discovery, cross-entry fallback, fake substitution, or a new generic unavailable type.

### 131.2 Unavailable matrix by owner and phase

| phase | detection owner | classification | required action | forbidden action |
|---|---|---|---|---|
| raw/path/config resolution | `infra/config.rs` | `MissingSource` / invalid family | aggregate safe validation issue; return startup assembly failure | expose a Port, create a fake, log raw value |
| constructor / capability probe | `infra/runtime_builder.rs` + adapter owner | constructor failure or `InvalidContract` | drop complete prefix; preserve nonpublic source chain | return `NotConfigured`, choose in-memory/fake, start reduced graph |
| selected Worker source decision | Worker root | explicit `Disabled` or missing required binding | close slot with no runner only for explicit Disabled; otherwise block startup | leave absent decision, spawn wildcard task |
| selected Jobs static graph | Jobs root | missing handler/decoder/response/trigger/runner arm | block process before request admission | accept request and return generic Job error |
| post-exposure Port invocation | concrete Port/application | `TemporarilyUnavailable` / `Timeout` / existing typed failure | preserve application/entry owner and existing recovery rules | reinterpret as startup, switch entry, fake fallback |
| post-commit collaboration | collaboration Port/application | typed `Failed` / `HandoffUnavailable` | retain local truth and stable intent; schedule only existing repair owner | rollback source truth, create local DLQ/attempt state |
| returned carrier contradiction | application consistency owner | `InvalidContract` / `ConsistencyDefect` | stop current flow or preserve capture according to existing Step 12/13 procedure | downgrade to unavailable, synthesize success |

### 131.3 Cargo and implementation gate checklist

Before an implementation boundary is created, the later implementation plan must mechanically verify:

1. only `core-contracts` appears as a non-local sibling dependency;
2. `infra -> api/worker/jobs` and all cross-entry edges are absent;
3. every external Port slot is concrete `Configured`, `DeterministicFake` or `Disabled`, never `Option<Port>`;
4. every Worker source has one named decision and every enabled source has one parked task;
5. all ten Outbound families map to one exact schema/source/capture/route arm;
6. all downstream consumers use formal exposure / controlled view / ref / safe summary, not source imports;
7. no local outbox, relay, DLQ, attempt lifecycle, scheduler, queue, lease or ack truth appears;
8. Deployment has no deterministic fake and no fake-generated real evidence.

These are later implementation gates, not claims that a target repository or test run already exists.

## 132. Cross-step closure and formal `03` §13 source increment

### 132.1 Upstream closure audit

| Upstream contract | `14.5.3` result | Baseline impact |
|---|---|---|
| Step 3 / 4 dependency direction and file layout | compile graph preserves seven members, one sibling path and entry-owned roots | no member/file-layout reopen |
| Step 5 module owners | infra owns adapter/neutral graph; application owns Port calls; API/Worker/Jobs own entry lifecycle | no owner merger |
| Step 7 Ports | 27 local/base + 9 external remain exact; 14 external callables remain exact | 36 Ports, 110 repository methods unchanged |
| Step 8 protocols | 6 Inbound, 10 Outbound, 8 Jobs and API 26 Command + 33 Query remain closed | 250 public types, 83 protocols unchanged |
| Step 9 flows | header-first, capture, collaboration and downstream feedback use existing flows | 83/83 flows unchanged |
| Step 10 states | source activation, capture bind and external statuses remain separated | 24 state-like enums / 111 variants / 638 pair baseline unchanged |
| Step 11 persistence | local truth and capture share existing authority; external delivery remains outside local state | 22 repository traits / 110 methods unchanged |
| Step 12 errors | startup, invocation, typed outcome and consistency defect remain separate | 17 errors / 51 issue codes / 83 mappings unchanged |
| Step 13 concurrency / idempotency | same candidate/intent and non-cancelling ownership remain exact | 40 key/digest write surfaces unchanged |

No controlled reopen is required. The `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` and `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` debts remain non-blocking and are not claimed as resolved by this batch.

### 132.2 Historical-material and boundary audit

| historical / conflicting material | current treatment |
|---|---|
| old Provider Contract / provider runtime / secret body / quota / route / cost | excluded; only descriptor, ref and safe summary boundaries remain |
| old unified runtime/tools execution gateway | excluded; runtime/tools are downstream consumers and never Hub execution owners |
| old governance approval / Policy refresh | excluded; only governance result ref, safe summary, seam relation and typed source remain |
| old method body / package / cache | excluded; only body-free method asset ref/relation remains |
| old marketplace listing / transaction | excluded; only read-only discovery ref/summary remains |
| old SDK client/package/cache | excluded; SDK consumes service-side exposure boundary |
| local outbox / relay / DLQ / attempt lifecycle | forbidden; immutable capture plus external collaboration Port remains the only event seam |
| README / formal old `03/05/06` | historical_material; no current dependency, parity or evidence claim is taken from them |

### 132.3 Formal `03` §13 assembly source

Step 19 assembling formal §13 must preserve these statements:

1. `core-contracts` is the only sibling Cargo path dependency. Runtime, event, external-source and downstream relations are represented by existing Port, adapter, API, event, snapshot, ref, safe-summary or handoff boundaries.
2. The compile graph is seven local members with entry-owned API/Worker/Jobs roots. `infra` returns only a neutral completed graph and never imports or starts an entry member.
3. External MCP/A2A/API, governance, method-library, secret, document, observability and audit sources never become Hub truth or execution owners. The Hub stores only the exact capability identity/registry/descriptor/seam/relation/exposure/ref/safe-summary surfaces already defined upstream.
4. Six Inbound source slots are closed by source family, schema, trusted actor, handler and application callable. A Disabled source has no runner and no synthetic receipt; a missing or incompatible source blocks startup.
5. Ten Outbound families are closed by schema ref, logical key, source gate, capture callable and named route. Physical route and external delivery state stay outside public envelope, capture identity, local state and Cargo dependencies.
6. Configured and DeterministicFake traverse the same positive, negative, header-first, identity, error and stable-intent boundaries. Fake is Local/Integration-only and cannot create real evidence or sign-off; Deployment forbids fake.
7. Disabled is an explicit concrete `NotConfigured` Port or Worker no-runner decision. Missing is startup/design blocking; it never silently becomes Disabled or Fake. Invocation temporary/timeout and typed external failed outcomes retain their existing owners.
8. Downstream runtime/tools/SDK/console/marketplace/observability/archive consume formal exposure, controlled views, refs or summaries and cannot write back core truth or become Cargo dependencies.

### 132.4 Rustdoc and structure-comment audit

This batch adds no Rust declaration. The audit therefore rechecks the declarations introduced or changed through `14.5.2.2.1~14.5.2.2.3`: every public/private boundary struct, field, enum, variant, variant payload, trait, trait method and callable retains the required English `///` Rustdoc; no enum struct-variant field uses field-level `pub`; no placeholder type or undocumented structural delta was introduced in `14.5.3`.

## 133. Batch completion gate and stop-review snapshot

### 133.1 Completion gate

| Gate | Result | Source / reason |
|---|---|---|
| SOP eight questions answered at binding-point level | pass | §125.2 |
| compile-time crop contains only approved sibling | pass | §126; `core-contracts` only |
| runtime/external crop has explicit Port owners | pass | §127; 9/9 external slots, 14/14 callables |
| event crop has 6 Inbound and 10 Outbound exact coverage | pass | §128; no local delivery lifecycle |
| downstream crop preserves consumer-only ownership | pass | §129; no execution/listing/SDK truth merger |
| Configured/Fake/Disabled/Missing are phase-distinct | pass | §130~131 |
| repository existence facts separated from contract/readiness facts | pass | §130.3; no target implementation claim |
| profile and Deployment fake prohibition explicit | pass | §130.3 |
| historical material and forbidden boundaries excluded | pass | §132.2 |
| cross-step baseline and Rustdoc gate | pass | §§132.1、132.4; declaration delta zero |
| formal `03` modified | no | reserved for Step 19 |
| `14.5.4` / `14.6` entered | no | next batches require separate confirmation |
| `04` / implementation ledger / boundary skeleton created | no | reserved for later formal docs / `07` |
| implementation/test/run/evidence/sign-off/commit claimed | no | none produced or claimed |
| unresolved upstream blocker | none | no new owner or contract gap found |

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.3
gate_status = 03_step_14_batch_14_5_3_completed_stop_review
step_14_status = in_progress
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
dependency_crop_compile_edges = 1 sibling + 15 local member edges
runtime_external_port_bindings = 9/9
runtime_external_callables = 14/14
inbound_source_slots = 6/6
outbound_event_families = 10/10
downstream_consumer_boundaries = 7 classified surfaces
configured_fake_disabled_missing_matrix = complete
target_implementation_repo = absent
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_5_4
```

Batch `14.5.3` is complete and stops for review. The next permitted action, after explicit user confirmation, is only `14.5.4` cross-step / historical / Rustdoc / `04` handoff and Step 14 closure input. Do not enter `14.6`, Step 15, formal `03` assembly, `04-配置设计.md` or any implementation artifact in this batch.

---

## 134. Batch `14.5.4` 开工确认与写入边界

用户已确认从 `14.5.3` 停审点进入本批。本批只完成 Step 14 的跨 Step 闭环清单、历史材料排除、结构声明注释复核、`04-配置设计.md` 交接输入和 Step 14 最终收口所需的审计索引；不进入 `14.6` 的最终收口、不进入 Step 15、不修改正式 `03-详细设计.md`，也不创建正式 `04`。

### 134.1 本批读取结论

| 读取项 | 本批确认的结论 | 对本批的约束 |
|---|---|---|
| 详细设计 SOP Step 14 | 必须留下配置引用表、外部依赖绑定表和跨仓 Rust 依赖绑定表；进入下一步的条件是实现者能够知道读取 owner 和绑定方式 | 本批只能整理已闭合的表和交接索引，不能用摘要替代表格 |
| 详细设计书写规范 §5.13 | runtime/event 关系不得写 Cargo；path dependency 必须写实际本地路径和缺失处理 | `core-contracts` 以外的 sibling 只能出现在 runtime/event/downstream 协作表 |
| 设计真相源闭环标准 §2.12 | 配置只能绑定 adapter、参数和 transport seam，不得改变业务 truth、state、metadata、idempotency、query/job 或 phase boundary | `04` handoff 必须带禁止配置化清单和失败映射 |
| 全局依赖关系与裁剪规则 | 单仓只展示相关依赖边；compile、runtime、event 必须分型 | 本批只引用 `14.5.3` 四张裁剪图，不再扩展全局 27 仓图 |
| 中间产物规范 | 每个批次必须有问题回答、诊断、取舍、结构化产物、回填入口和停审门禁 | 本批以本节及后续章节作为可追溯中间产物，不把它伪装成正式章节 |
| 正式 `00/01/02` | 当前 capability identity、registry、descriptor、governance seam、method relation、formal exposure 和 consumer view 是上游主语 | 历史 Provider / runtime / marketplace 主语不得重新进入本批 |
| Step 3~13 当前 closure | 36 Port、83 flow、24 state-like enum、110 repository methods 等基线已被前序校准锁定 | 本批只能做审计和回指，不能借配置绑定新增业务结构 |

### 134.2 本批不重新定义的内容

- 不重新选择 adapter、repository、event family、Job runner、entry root 或 Cargo member；这些选择以 `14.1~14.5.3` 为准。
- 不把 `04` 尚未决定的 raw format、source precedence、environment key、endpoint、credential source、transport product、数值默认值或部署矩阵写成已确认事实。
- 不把目标实现仓、真实 Cargo workspace、运行连通性、测试、evidence、run_id、签署或 commit 写成已存在事实。
- 不把下游 runtime、tools、SDK、marketplace、console、observability 或 archive 变成本仓 truth owner、execution owner 或编译期依赖。
- 不新增 Rust 声明；若后续 `04` 需要新增 infra-local parser carrier，必须在 `04` 自己的 calibration Step 中重新完成字段、variant、callable 和英文 Rustdoc 审计。

## 135. Cross-step closure manifest

### 135.1 业务和架构主语不变式

| 上游基线 | Step 14 绑定后的不变式 | 违反时的处理 |
|---|---|---|
| 需求定位与非目标 | Hub 仍是能力注册、外部能力接入描述、治理/方法关系接缝和受控暴露中心 | 回到正式 `00` / `01`，不得用配置开关扩大职责 |
| capability identity | identity 的来源、稳定键、修正/退役语义来自既有 domain/application flow | 配置只能选择已批准 source/adapter，不能生成第二套 identity |
| capability registry | registry truth 仍由既有 command、repository、UoW 和 state guard 管理 | 不得以 adapter availability、health、route 或 fake map 改写 registry state |
| adapter descriptor | descriptor 只表达接入描述和风险/约束摘要，不包含 provider runtime 或 secret body | 发现 provider execution、quota、cost、failover 字段时登记冲突并回退上游边界 |
| governance seam | Hub 只保存治理结果 ref、safe summary 和 seam relation | 配置不得决定 approval、Policy effective truth 或 shared rules |
| method relation | 只保存 body-free method asset ref/relation | 配置不得选择、缓存或加载 method body/package |
| formal exposure | exposure boundary 和 controlled consumer view 仍是唯一服务侧消费入口 | 下游不得通过 adapter/raw config 直读 truth |
| event/capture | immutable capture、stable intent 和既有 collaboration Port 是唯一 outbound seam | 不得添加 local outbox、relay、DLQ、attempt lifecycle 或第二队列 |

### 135.2 实现基线与 cardinality manifest

| 面 | 当前闭合数量 / 选择 | 唯一 owner / 入口 | 本批审计结论 |
|---|---:|---|---|
| workspace member | 7 个 local member | `infra` 提供 neutral graph；`api` / `worker` / `jobs` 各自拥有 entry root | 无跨 entry composition edge |
| sibling Cargo path | 1 个：package `core-contracts`，library `core_contracts`，path `../quantalithos-core/crates/contracts` | 使用 shared contract 的 member | 其余 sibling 为 zero Cargo edge |
| local/base Port | 27/27 | `infra/runtime_builder.rs` 与 single local authority | 每个 Port 一个 concrete binding，不使用 optional Port slot |
| external Port | 9/9 | 对应 resolver、handoff 或 collaboration adapter owner | 14/14 external callable 已有 exact owner |
| application Port total | 36/36 | application service constructor / facade | 配置不增加 private Port |
| repository trait/method | 22/22 traits，110/110 methods | shared local persistence authority | 不拆成隐式 per-store truth |
| API surface | 26/26 Command，33/33 Query | API entry facade | 59/59 handler mapping，entry 不直连 repository |
| Inbound source | 6/6 named source slots | Worker source decision 与 runner | Disabled 无 runner；Missing 阻塞 startup |
| Outbound event | 10/10 event families | capture callable + collaboration Port + named route | route 不进入 public envelope、capture identity或local state |
| Operations Job | 8/8 dispatch、runner、response、trigger | Jobs-owned closed dispatch | 无 wildcard runner、entry auto-retry或动态反射分派 |
| state-like enum | 24 个，111 个 active variants | Step 10 state matrix | 配置不能改变状态集合或迁移矩阵 |
| ordered state pairs | `638 = 239 current + 98 reserved + 301 illegal` | Step 10/13 audit | unclassified 保持为 0 |
| write identity surface | 40 个 key/digest write surfaces | Step 13 canonical frame / digest owner | adapter/route/config 不得改 canonical bytes |
| flow coverage | 83/83 | Step 9 application flow | startup binding 不改变 flow owner 或重入规则 |

### 135.3 配置读取和注入 closure

| 层 | 允许持有的输入 | 交接后必须满足 | 明确禁止 |
|---|---|---|---|
| `infra/config.rs` | raw source、profile selector、infra-local candidate | 产生 validated root 或 safe validation failure | 向 domain、protocol、public response 暴露 raw config |
| `infra/runtime_builder.rs` | validated root、resolved adapter refs、technical policy | 按 Stage 0~7 构造 complete graph，再生成一个 entry-neutral handoff | 返回 partial graph、启动 entry、跨 entry fallback |
| infra adapter | 对应 section 的 validated constructor input | 只实现其 concrete Port / technical boundary | 读取其他 section 补隐式依赖、拥有业务 state |
| application | 36 个 Port、既有 typed runtime parameters | 保持既有 guards、UoW、state、idempotency、error mapping | 接收 raw config、按 config 跳过业务 guard |
| API | 一个 service handoff、entry parameters | 只映射 Command/Query，完整 coverage 后才 exposure | 直连 repository、从 route 推 identity 或 operation |
| Worker | 六个 named source decisions、两个 application handles | enabled source 才有 parked task；Disabled 无 task/receipt | 从 topic/offset/text 猜 source/schema/actor |
| Jobs | 一个 service、八臂 closed dispatch、typed runner controls | admission、deadline、drain、response 责任保持分离 | runner 重规划、改变 journal truth 或自动重试 entry |

### 135.4 失败分类 closure

| 发生阶段 | 当前分类 | owner | 不能做的替代 |
|---|---|---|---|
| raw/path/config resolution | `MissingSource` 或 validation issue | `infra/config.rs` | 不能生成 fake、暴露 Port 或记录 raw value |
| constructor / static contract | `InvalidContract` 或 startup assembly failure | builder + adapter | 不能降级为 Disabled、in-memory 或 partial graph |
| explicit disabled binding | `NotConfigured` / concrete Disabled | selected Port/Worker owner | 不能伪造成功、生成 synthetic receipt 或 wildcard task |
| exposed Port invocation | `TemporarilyUnavailable`、`Timeout` 或既有 typed failure | concrete Port/application | 不能回译为 startup、换 entry 或静默换 Fake |
| external typed response | `Failed`、`HandoffUnavailable` 或既有 typed outcome | external Port/application | 不能由 transport text 改成 generic technical error |
| returned carrier contradiction | `InvalidContract` / `ConsistencyDefect` | application consistency owner | 不能降级成 unavailable 或合成 success |
| post-commit collaboration | stable intent + existing repair owner | collaboration/application | 不能回滚 local truth、创建 local DLQ 或新 attempt state |

### 135.5 Closure decision

`14.5.4` 的跨 Step 审计没有发现需要受控回开 Step 3~13 的新增冲突。`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` 和 `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` 仍是非阻塞跨仓设计债务；它们不被本批误报为已解决，也不授权实现侧自行改变 accessor、shared bytes 或 serde shape。若这些债务在后续真实绑定阶段产生签名或字节语义变化，必须回开 Step 8 / Step 13，并同步更新 Step 14 依赖表。

## 136. Historical material 与冲突排除清单

### 136.1 旧材料处理矩阵

| 材料 | 与当前绑定的冲突 | 当前有效处理 | 不得重新引入的表面 |
|---|---|---|---|
| `README.md` | 将 Hub 描述为 provider/runtime/治理/市场综合入口 | 只保留“外部 MCP / A2A / API 能力接入中心”线索 | provider secret、quota、cost、LLM routing、marketplace transaction |
| 旧 `00-需求文档.md` | Provider Contract、Cost Accounting、QueryCapabilities 等旧主线 | 仅作历史差异来源，当前需求以新版正式 `00` 为准 | 旧目标、旧用户故事、旧验收门禁 |
| 旧 `01-架构设计.md` | 四子域、execution gateway、KMS/Vault、provider failover | 仅作职责冲突审计，当前架构以新版正式 `01` 为准 | runtime execution、provider health/failover、secret platform truth |
| 旧 `02-概要设计.md` | CostRecord、CapabilityDecision、secret envelope | 仅作对象污染审计，当前概要以新版正式 `02` 为准 | 旧对象、旧状态、旧配置 section |
| 旧 `03-详细设计.md` | service/repository/projection/DTO 与 provider/outbox 方案耦合 | 在正式 Step 19 前保持 `historical_material` | 旧目录、旧 adapter、旧 topic、旧 retry lifecycle |
| 旧 `05-测试方案.md` | 旧性能数值、旧 TC/evidence 口径 | 不作为当前测试真相源，留给后续 Step 16 / 正式 `05` 重建 | 旧 P95、旧 run/evidence alias、旧放行结论 |
| 旧 `06-验收标准.md` | 旧验收签署和实现事实 | 不作为当前验收真相源，留给后续正式 `06` 重建 | 旧签署、旧 commit、旧测试结果 |
| `L1-governance` / `L1-artifact` Step 14 | 领域 resolver、outbox/relay、retention/cleanup | 只参考表格、分批和停审粒度 | 其领域 truth、delivery lifecycle、retention 语义 |
| sibling 目录存在性 | 目录存在不等于 typed contract、连通性或部署就绪 | 只记录为调查事实；以 binding contract / profile gate 判定 | 目录存在即自动写 Cargo 或声称可运行 |
| sibling 目录缺失 | 不能证明 Hub 可代替缺失系统 | 记录 integration/downstream prerequisite 或 startup blocker | 创建替代 crate、假造 provider/runtime/marketplace 实现 |

### 136.2 当前边界排除表

| 被排除边界 | 允许留下的最小协作表面 | 本批结论 |
|---|---|---|
| runtime execution / tools execution | formal exposure、controlled view、capability ref、safe summary、handoff | 永不进入 Hub application truth 或 Cargo |
| governance approval | governance result ref、safe summary、seam relation、typed source | approval action 和 Policy truth 留在 governance |
| method body / package / cache | body-free method asset ref/relation | Hub 不读取正文或缓存 |
| secret body / KMS lifecycle | secret ref、safe handling summary | 不保存、打印或传播 secret 正文 |
| marketplace listing / transaction | read-only discovery ref/summary | listing、交易、定价、履约留在 marketplace |
| SDK client / package | 服务端 exposure 和 typed consumer boundary | SDK 是下游消费方，不是 Hub dependency |
| local delivery lifecycle | immutable capture、stable intent、existing collaboration Port | 无 local outbox、relay、DLQ、lease、ack truth |

## 137. Rustdoc、结构声明与可落码门禁总审计

### 137.1 审计口径

本节是设计声明审计，不是实现仓源码扫描，也不构成编译、lint、测试或运行证据。审计对象是本 Step 之前写入中间产物的 Rust-facing 契约片段、声明清单和 planned boundary。凡是实际实现时落为 Rust 的 `struct`、tuple field、enum、enum variant、variant payload field、trait、trait method、constructor、accessor、mapper、factory、runner 或其他 callable，必须在对应实现文件中逐项保留英文 `///` Rustdoc；本 Step 不允许使用“结构体统一注释”“同上”或模块级注释替代字段级注释。

`14.5.4` 本批没有新增或修改任何 Rust 声明。以下表格按前序批次记录声明增量和复核来源，避免把同一声明重复计入累计总数。

### 137.2 分批声明增量与复核结果

| 来源批次 / 章节 | 本批次新增或变更的 Rust-facing surface | 已记录数量 / 覆盖 | Rustdoc / 结构字段结果 |
|---|---|---:|---|
| `14.1` §§14~20 | infra-local config wrapper、config enum、validation carrier、root/accessor | 12 structs/newtypes；12 enums；42 callables | struct、tuple/struct field、enum、每个 variant、payload field、callable 均有英文 `///` |
| `14.2` §§23~30 | numeric wrapper、technical policy、entry parameter、header-first、commit-resolution supporting declaration | 5 numeric wrappers；4 policy structs；3 entry structs；1 entry enum/3 variants/3 payloads；1 header-first struct/9 fields；33 callables；Step 7 supporting enum/3 variants/1 callable | 所有声明与字段逐项有英文 `///`；无 field-level `pub` variant payload |
| `14.3` §§33~38 | local authority、store grouping、adapter roles | 0 new Rust declaration | planned adapter role 不被伪称为已存在源码；落码时重新逐项注释 |
| `14.4.1` §§40~45 | external adapter binding roles and failure mapping | 0 new public/business declaration | adapter planned role、external outcome binding和callable ownership均已给出注释门禁；未产生实现声明 |
| `14.4.2` §§47~50 | inbound source refs、source binding、six-slot group、Worker binding、processing action | 2 ref structs/2 fields；1 enum/3 variants/3 payloads；1 six-field struct；1 two-field struct；6 validation variants；1 processing enum/3 variants；20 callables | 每个 struct/field/enum/variant/payload/callable均有英文 `///`；Worker variant payload无 field-level `pub` |
| `14.4.3` §§53~58 | outbound route ref、route classifier、ten-route binding、Worker exact-ref continuation | 1 ref struct/1 field；10 validation variants；1 enum/10 variants；1 struct/10 fields；17 callables | route field、classifier variant、continuation callable均有英文 `///`；无 generic route escape hatch |
| `14.4.4` §§61~65 | eight typed Job runner callables | 8 runner callables；public/business declaration delta 0 | runner callable与既有 Job schema/variant均已注释；未新增 delivery state |
| `14.5.0~14.5.2.1` §§67~85 | sibling fact、Cargo matrix、Stage 0~7 builder and neutral graph | 0 new Rust declaration | stage/pseudocode不是实现声明；后续 concrete handoff仍受字段级注释门禁 |
| `14.5.2.2.1` §§86~94 | API assembly carrier、facade、runtime、composition-local errors | public/business baseline delta 0；声明类别完整列于 §94.2 | API bundle、handoff、facade、runtime、enum/payload/callable注释均通过前序审计 |
| `14.5.2.2.2` §§96~106 | Worker application bundle、opaque feed/delivery/matcher、task/permit/continuation/cleanup declarations | declaration categories complete；无 public protocol/Port/state delta | struct、field、enum、variant、payload、trait/callable均逐项有英文 `///`；§106.5无遗漏 |
| `14.5.2.2.3` §§107~116 | Jobs application bundle、handoff、facade、executor、terminal、deadline、process and host mapping | declaration categories complete；8 runner callables；contracts helper callable `+1` | 56 async trait declarations/methods保持固定 `Send` lowering；无 `?Send`；§115.4通过 |
| `14.5.2.3` §§117~124 | shared complete predicate and cross-entry blocking matrix | 0 new struct/field/enum/variant/payload/trait/callable | API/Worker/Jobs既有声明复核通过；本批无 structural delta |
| `14.5.3` §§125~133 | dependency crop、parity、repository/profile/unavailable matrix | 0 new Rust declaration | 图、表和判定过程不引入 Rust surface；§132.4复核通过 |
| `14.5.4` §§134~本节 | cross-step、historical、handoff and closure audit | 0 new or changed Rust declaration | 本批只增加文档审计；不得把 `04` parser carrier提前写成已确认实现 |

### 137.3 强制结构注释清单

后续实施边界在读取本 Step 时，必须按以下顺序检查，而不能只检查顶层类型名称：

1. 每个 `struct` / tuple struct 本身有英文 `///`，并说明 owner、生命周期和边界。
2. 每个 named field、tuple field 和 enum struct-variant payload field 有独立英文 `///`，说明来源、空值/非空语义和禁止用途。
3. 每个 `enum`、每个 variant 和每个 variant payload 有独立英文 `///`，说明闭合分类和不可互换性。
4. 每个 `trait`、trait method、constructor、accessor、mapper、factory、runner、terminalizer、shutdown/join callable 有英文 `///`，说明输入、返回、所有权、失败和副作用。
5. 进入 `Arc<dyn ... + Send + Sync>` graph 的 async trait 与 impl 使用前序固定的 `async-trait 0.1.89` / `Send` 规则；不得以 `?Send`、未说明的 native async object safety 或 generic boxed fallback 改写契约。
6. enum struct variant 内不得出现 field-level `pub`；不得用 `Other(String)`、`Value`、generic map、raw error text 或未注释 private escape hatch 扩大闭合类型。
7. planned role、伪代码、Cargo matrix 和文档表格不能被当作源码存在性、编译结果或测试结果。

### 137.4 Rustdoc gate decision

| 门禁 | 结果 | 依据 |
|---|---|---|
| 本批新增 struct / field / enum / variant / payload | `0` | `14.5.4`只写审计和交接材料 |
| 本批新增 trait / trait method / callable | `0` | 无 Rust-facing contract delta |
| 前序配置声明逐项注释 | pass | §§20、30.2、50.3、58.2 |
| API / Worker / Jobs composition 声明逐项注释 | pass | §§94.2、101.3、106.5、115.4 |
| async trait attribute、`Send` 和 no `?Send` | pass | §§36.2、115.4 |
| enum payload field visibility | pass | 前序各批审计均为 no field-level `pub` |
| 实现仓源码、编译、测试、lint、run_id 或 evidence | not claimed | 目标实现仓不存在；本仓只保留设计材料 |

Rustdoc gate 通过只表示设计声明覆盖完整，不表示任何实现边界已实现或已验证。若后续 `04`、`05`、`06` 或 `07` 发现配置需要新增代码契约，必须先登记 `03` 回写项并回到对应详细设计 Step，不能由实现者或配置作者直接补声明。

## 138. `04-配置设计.md` 逐 Step handoff

本节是给后续配置设计校准工作台的输入，不是正式 `04` 文档。正式 `04` 只能在用户确认进入文档 `04` 后，按配置设计 SOP 逐 Step 创建 `04_config_calibration_flow.md` 和对应 Step 中间产物，再由正式文档装配。`04` 的正文不得仅引用本节标题而跳过对应字段、来源、默认、敏感级别、失效策略和下游承接。

### 138.1 配置设计 Step 承接矩阵

| `04` SOP Step | 本 Step 提供的已确认输入 | `04` 必须继续闭合 | 未闭合前的门禁 |
|---|---|---|---|
| Step 1 上游边界 | 正式 `00/01/02` 的职责、依赖、配置影响；本文件 §§134~137、现有 §24、§29 | 配置设计与正式/校准详细设计的权威顺序、历史 `03` 排除 | 未确认上游读取范围不得写正式配置项 |
| Step 2 目标与范围 | 配置只控制 adapter binding、entry technical parameter、profile 和 transport seam | P0/P1/P2 分层及本轮是否覆盖 Local/Integration/Deployment | 不得把 runtime execution、governance approval 或 marketplace 配置纳入范围 |
| Step 3 控制面总览 | raw source -> candidate -> validated root -> Stage 0~7 -> one entry handoff | file/env/CLI/secret-ref/config-center 的实际来源链和覆盖图 | 来源链未闭合时不得声称可部署 |
| Step 4 分类与禁止配置化 | §§135.1、135.3、136.2 的 truth/state/body/phase/owner 红线 | 每个配置组的类别、热/冷生效属性和禁止项表 | 任何业务不变量可被配置改变时阻塞并回写 `03` |
| Step 5 来源、优先级、冲突 | validated root immutable；raw 只在 `infra/config.rs` 读取 | source precedence、同优先级冲突、缺失来源、secret ref 覆盖规则 | 未确认 precedence 不得由实现者选择 merge 规则 |
| Step 6 profile 与环境矩阵 | Local/Integration/Deployment 的 allowed binding、Deployment 禁 fake、durable-only 规则 | CI/staging/prod 是否采用同一 profile、外部依赖准备和敏感值注入方式 | profile 缺失或允许 Deployment fake 时阻塞 |
| Step 7 配置项清单 | §24 的 exact validated fields、9 external slots、6 Worker slots、10 outbound routes、entry parameters | raw key、类型表示、单位、上下限、每项显式默认、作用域、敏感级别、失败策略和 JSON demo | 任何字段没有唯一 owner、来源或默认口径时不得定稿 |
| Step 8 敏感配置与密钥 | secret 只以 ref/safe summary 进入 Hub；raw secret 不进 root/log/response | secret ref 的存储、读取、轮换、审计、不可达和泄露防护 | secret body、token 或 credential 出现在普通配置或日志时阻塞 |
| Step 9 加载、校验、生效 | deterministic candidate -> validation issues -> `InfraError::RuntimeAssembly`；complete graph only | parser、type/range/cross-field validation、启动时机、冷更新/拒绝/回滚细节 | parser 需要新增代码契约时先回开 `03` |
| Step 10 变更、审计、回滚 | validated root 是 startup assembly input；不允许业务热变更 | 变更审批、审计 material、版本留痕、失败回滚和是否支持 hot reload | hot reload 若改变 root/Port/state，必须标为阻塞并回写 `03` |
| Step 11 失效与 fail-fast | `MissingSource`、`InvalidContract`、`NotConfigured`、invocation unavailable、consistency defect 四分法 | 缺失/错配/不可达/漂移/过期的 operator response、告警和测试切口 | 高风险项不得 silent fallback、fake fallback 或 last-known-good 猜测 |
| Step 12 下游承接 | Step 16/正式 `05` 负责测试；`06` 负责验收；`07` 负责实施 boundary；部署手册负责命令 | 逐配置场景到 05/06/07/运维的引用矩阵 | 不得在 `04` 伪造测试结果、验收签署或实施 commit |
| Step 13 迁移与废弃 | 当前设计没有已发布旧配置作为迁移事实；旧 README/正式 `03` 是 historical | 明确“无当前迁移项”或登记真实 legacy mapping、窗口和移除条件 | 不得把旧 Provider/KMS/config 字段自动迁移为新字段 |
| Step 14 风险与待确认 | §140 的 blocker、债务、03 回写规则 | owner、确认方、影响范围、未确认处理和详细设计影响表 | 存在 `待回写`/`阻塞待确认` 时不得进入 `04` Step 15 |
| Step 15 正式装配 | 只能装配已完成 `04` Step 1~14 的结果 | 15 章正式配置文档、校准来源、跨配置域总审计 | 不得跳过校准中间产物或直接复制本节为正式正文 |

### 138.2 `04` 必须保留的 validated root 字段组

| 字段组 | 当前 exact shape / cardinality | `04` 需要补充的 operator-facing 信息 | 固定禁止 |
|---|---|---|---|
| schema/profile/entry | schema version、profile、exactly one entry | raw key、版本兼容、source precedence、profile选择 | 多 entry 合并、未知版本静默兼容 |
| local persistence | one `CapabilityLocalPersistenceBinding` | backend product、endpoint/credential ref、durable/fake profile input | 多 authority、replica guess、隐藏 session |
| external Port bindings | 9 total slots；每槽 `Configured` / `DeterministicFake` / `Disabled` | adapter kind、constructor material、sensitive ref、availability probe | `Option<Port>`、wildcard adapter、Deployment fake |
| clock/id | separate clock and id binding | source、fixture policy、deployment ownership | domain/application 自行生成替代值 |
| compatibility | fixed `StableSurfaceV1` + `Sha256V1` | compatibility version rollout and fixture ownership | runtime algorithm/formatter selector |
| technical policy | timeout/retry/scan page/byte/batch/parallelism wrappers | unit、range、default、overflow、deadline clipping | unbounded/zero/negative、business digest input |
| API parameters | request bytes、public page、whole-call timeout | raw names/defaults/profile matrix | route feature flag、business scope/idempotency override |
| Worker parameters and source bindings | 5 technical parameters + 6 named source slots | feed/trusted actor/fixture ref source and sensitive handling | source identity from topic/offset、seventh dynamic slot |
| Outbound route bindings | exactly 10 named route refs when collaboration is configured | route product、destination ref、TLS/credential ref、migration policy | schema/payload/routing key configurable、local delivery state |
| Jobs parameters | request bytes、planning page、run timeout、application-owned retry policy | raw names/defaults/profile and fail-fast | target parallelism、run/key/scope/target override、entry retry |
| diagnostics | `Off` or `Redacted` | safe operator rendering and audit sink handoff | raw/full/verbose mode、secret/raw config output |

### 138.3 `04` 交接所需的配置引用表

| 配置引用 | validated type / binding | 读取 owner | `04` 必须补充 | 未确认时处理 |
|---|---|---|---|---|
| schema/profile/entry | `CapabilityConfigSchemaVersion` / `CapabilityRuntimeProfileKind` / `CapabilityRuntimeEntryKind` | `infra/config.rs` -> `runtime_builder.rs` | key、version、precedence、unknown handling | 阻塞 startup schema |
| local persistence | `CapabilityLocalPersistenceBinding` | local adapter builder | product、durability、secret ref、constructor failure | `MissingSource` / `InvalidContract`，不 fake fallback |
| nine external Port slots | `CapabilityExternalPortBindings` | external adapter owners | per-slot kind/ref/probe/secret sensitivity | explicit Disabled or startup block；不省略 slot |
| clock/id | `CapabilityClockBinding` / `CapabilityIdGeneratorBinding` | `infra/clock_id.rs` | source、fixture and deployment ownership | startup block，不能 domain fallback |
| codec/digest | `CapabilityCompatibilityBinding` | codec/digest assembly | fixed compatibility representation and fixture distribution | incompatible contract blocks |
| API / Worker / Jobs typed parameters | corresponding `*EntryParameters` | selected entry root after handoff | raw key、unit、default、range、cold update | validation issue before exposure |
| six inbound source slots | `CapabilityInboundSourceBinding` | Worker source resolver | feed/actor/fixture section refs, profile eligibility | Disabled only when explicit；Missing blocks Worker |
| ten outbound route slots | `CapabilityOutboundRouteConfigRef` group | collaboration adapter | route material/ref/sensitivity and route migration | configured route missing blocks Port; whole Port Disabled only explicit |
| technical retry/timeout policy | `CapabilityRuntimeTechnicalPolicy` | application/infra wrapper owner | exact numbers, deadline clipping and audit | invalid policy blocks startup; no generic retry |
| diagnostics | `CapabilityDiagnosticMode` | infra/entry error wrapper | safe field allowlist and sink | invalid mode blocks startup |

### 138.4 `04` 外部依赖绑定交接表

| 依赖 | 依赖类型 | 绑定位置 / 使用接口 | timeout / retry owner | 缺失或不可用处理 | Cargo 结论 |
|---|---|---|---|---|---|
| `quantalithos-core/crates/contracts` (`core-contracts`) | compile | approved shared types/codecs in `contracts`、`domain`、`application`、`infra`、Worker permitted shared carrier | compile/startup gate；不做 invocation retry | path/package/lib/signature/bytes mismatch 阻塞对应边界 | only sibling path: `../quantalithos-core/crates/contracts` |
| external MCP / A2A / API source | runtime | external source reference Port + adapter descriptor/ref/safe summary | external Port wrapper；仅 eligible temporary/timeout bounded retry | `Configured` constructor failure startup block；post-exposure typed unavailable | no sibling Cargo edge |
| governance result source | runtime/event | governance result reference Port、corresponding named Inbound source mapping、seam relation | application/Port owner；typed outcome retained | missing binding blocks enabled source/Port；explicit Disabled only if selected | no Cargo edge |
| method-library asset source | runtime/event | method asset reference Port、body-free relation、Inbound source | application/Port owner | no body fallback；missing typed contract blocks enabled binding | no Cargo edge |
| secret/KMS/Vault boundary | runtime | secret reference Port and safe handling summary | adapter call owner；no raw secret retry classification | ref unavailable is typed unavailable/startup according to phase | no Cargo edge |
| external document source | runtime/event | external document reference Port and named Inbound source | Port/application owner | missing source blocks configured slot; no raw document persistence | no Cargo edge |
| consumer/reference source | runtime | capability consumer reference Port and controlled view boundary | application query/consumer owner | unavailable/degraded uses existing typed surface | no Cargo edge |
| observability/audit reference | runtime/event | observability audit reference Port and safe summary/ref | handoff/application owner | handoff unavailable retains local truth and stable intent | no Cargo edge |
| audit/export handoff | runtime | observability/audit handoff Port | external collaboration owner; no local delivery lifecycle | typed `HandoffUnavailable`; existing repair owner only | no Cargo edge |
| capability access event collaboration / bus | event | immutable capture + collaboration Port + ten named route bindings | collaboration application/adapter owner | external effect failure does not rollback local truth; no local outbox/relay/DLQ | no Cargo edge |
| `L2-runtime` / `L2-tools` / `L0-sdk` | runtime downstream | formal exposure、controlled view、ref、safe summary | downstream consumer owner | absent consumer is integration prerequisite, not Hub execution fallback | no Cargo edge |
| marketplace / console / observability / archive consumers | runtime downstream | read-only discovery、handoff或consumer boundary | downstream owner | absent consumer does not create Hub substitute | no Cargo edge |

The exact six source names and their ownership are already closed in §§47~50 and §128. `04` must copy those exact names, not infer them from a transport topic or a numeric slot. Each row above is a dependency category, not a new source slot.

## 139. `04` 详细设计影响、阻塞与回写规则

### 139.1 当前风险与待确认事项

| ID | 风险 / 事项 | 影响范围 | owner / 待确认方 | 当前处理 | 是否阻塞当前 Step 14 |
|---|---|---|---|---|---|
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | L0-core 正式设计尚未同步已授权 accessor/bytes 语义 | Step 8/13、跨仓实现 | L0-core 设计 owner | 保留非阻塞债务；Hub 继续使用明确的 `as_str().as_bytes()` 假设 | 否；语义变化时回开 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | shared serde shape 未被 L0-core 正式设计承诺 | Step 8/13、compatibility fixtures | L0-core / contracts owner | 保留非阻塞债务；`04` 只能记录当前 fixture shape，不能宣称稳定发布 | 否；shape变化时回开 |
| `CH-DDD-S14-ENTRY-ARGS-001` | raw key、source precedence、单位、数值默认尚未由配置设计闭合 | `04` Step 5~7、实现准备 | 配置设计 owner | 由 `04` 逐项补齐；当前不写伪默认 | 否；阻塞 `04` 定稿/实现，不阻塞当前中间产物 |
| `CH-DDD-S14-PROFILE-MATRIX-001` | 真实 CI/staging/deployment profile 与外部资源尚未核实 | `04` Step 6、`07` deployment boundary | 配置/部署 owner | 保留 profile contract；目标实现仓缺失，不作 readiness 结论 | 否；阻塞真实部署绑定 |
| `CH-DDD-S14-SECRET-SOURCE-001` | secret ref/KMS/Vault 具体产品和轮换机制未选定 | `04` Step 8、运维承接 | 安全/部署 owner | 只保留 ref/safe-summary seam；不写产品或 raw secret | 否；具体产品选择前不可进入生产 binding |
| `CH-DDD-S14-TRANSPORT-ROUTE-001` | ten route 的物理 transport/destination/TLS material 未选定 | `04` Step 7~9、实现 adapter boundary | 集成/部署 owner | route schema/source/capture identity 已闭合；physical material 留 `04` | 否；配置/实现绑定前阻塞对应 route |
| `CH-DDD-S14-TARGET-REPO-ABSENT-001` | `/home/aris/Projects/quantalithos-capability-hub` 目标实现仓不存在 | 实现、测试、真实证据 | 实现/仓库 owner | 记录为 implementation prerequisite；不创建替代仓 | 否；不阻塞设计校准 |

### 139.2 配置结论对 `03` 的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 当前状态 |
|---|---|---|---|---|
| raw key、env key、file format、source precedence | 否，前提是不改变 validated field set | operator-facing schema | `03` §13 只保留 binding point | deferred to `04`; no 03 rewrite |
| numeric units、bounds、explicit defaults | 否，前提是不改变 wrapper/owner/flow | technical parameter values | `03` §13 / §28 只保留 owner and semantics | deferred to `04`; no numeric claim |
| profile allows `Configured` / `DeterministicFake` / `Disabled` | 否，前提是遵守现有 four-state matrix | profile binding | `03` §§14.6、130~131 | closed; `04` supplies profile rows |
| physical endpoint、credential ref、TLS、route product | 否，前提是不进入 public identity/capture/digest/state | adapter constructor material | `03` §13 external binding | deferred to `04`; no 03 rewrite |
| hot reload、new fallback、new adapter kind、new Port/field/error | 是 | code contract or lifecycle change | corresponding Step 6/7/8/9/10/12/14 section | blocking; controlled reopen required |
| configuration changes identity、registry state、governance approval、method body、execution or marketplace status | 是 | forbidden truth/ownership change | formal `00/01/02` plus affected `03` Step | reject; do not write `04` contract |
| secret raw value or provider runtime material in root | 是 | forbidden data boundary | `03` §6/§13 and Step 6/14 | reject; security blocker |

### 139.3 `04` formalization gate

`04` 只有在下列条件全部通过后，才能从其 Step 14 进入 Step 15 正式配置文档装配：

1. 所有 §24 validated field groups 都有 raw source、precedence、unit/range、explicit default、scope、sensitivity、effect timing 和 failure strategy。
2. 九个 external Port、六个 Inbound source、十个 Outbound route 和 selected entry 的 profile/cardinality 均有逐项配置记录；没有 `Option`、wildcard、silent fallback 或未命名 slot。
3. 配置来源、敏感引用、校验、生效、变更、回滚和失效策略不改变本 Step 已闭合的 truth/state/owner/phase boundary。
4. 所有“是否影响 `03`”为“是”的事项都已回写并重新完成对应详细设计 Step；不存在 `待回写` 或 `阻塞待确认` 的正式配置结论。
5. `04` 的测试/验收/实施/运维承接只提供输入，不伪造 `05/06/07/09` 文档中的结果、commit、run_id、evidence 或签署。
6. 具体实现仓和外部产品存在性仍与设计契约分开记录；目录或配置文件存在不能替代 typed contract/readiness gate。

本门禁是 `04` 的后续入口条件，不是当前项目已经完成 `04` 的声明。

## 140. 未分类配置、依赖、Owner、Profile 与 Failure Surface 归零审计

### 140.1 配置全集归零

本节只检查 §§14、23~24、47、53、138 已确认的配置和 binding 全集，不新增 raw key、数值、产品、字段或默认值。一个条目只有同时具备 typed shape、唯一读取/消费 owner、profile 约束、缺失处理和 `04` 落点，才计为已分类。

| 配置 / binding 组 | Exact inventory | 读取 / 消费 owner | Profile / cardinality | 缺失或失效出口 | 未分类 |
|---|---|---|---|---|---:|
| schema、profile、entry | schema v1、一个 profile、exactly one API / Worker / Jobs entry | `infra/config.rs` -> `runtime_builder.rs` -> selected entry root | 三项均 required；不允许 mixed entry 或隐式 Deployment | raw/schema mismatch 聚合为 safe startup validation issue | 0 |
| local persistence | 一个 `CapabilityLocalPersistenceBinding`、一个 authority `A` | local adapter builder、UoW manager、read visibility resolver | Local 可 deterministic in-memory；Integration/Deployment 必须 durable | missing/wrong family/constructor failure 阻塞 startup；不降为 replica guess | 0 |
| external Port bindings | 9/9 named slots、14/14 exact callables | 对应 resolver、handoff、collaboration adapter owner | 每槽恰为 `Configured` / `DeterministicFake` / `Disabled`；Deployment 禁 fake | Missing 阻塞 startup；Disabled 才产生既有 `NotConfigured`；invocation 保留 typed failure | 0 |
| clock 与 id | 两个独立 binding | `infra/clock_id.rs`、Stage 2 builder | 两槽 required；fake 只用于允许的 profile | 缺失阻塞 startup；domain/application 不得生成替代值 | 0 |
| compatibility | `StableSurfaceV1` + `Sha256V1` | contracts codec、application digest assembly | fixed compatibility，不是 runtime selector | 不兼容阻塞 startup / compatibility gate | 0 |
| technical policy | phase-specific timeout、external/contention/commit-observation retry、internal scan page | application / infra 中各自的唯一 wrapper | positive、bounded；exact raw unit/default 留 `04` | invalid value 阻塞 startup；不得 generic retry 或无界退避 | 0 |
| API entry parameters | request bytes、public page、whole-call timeout，3/3 | API boundary / mapper / invocation wrapper | 仅 selected API required | invalid/missing 阻塞 API exposure；dispatch 后 timeout 不取消 application | 0 |
| Worker entry parameters | inbound bytes、fetch batch、parallelism、inbound timeout、continuation timeout，5/5 | Worker root、dispatcher、supervisor | 仅 selected Worker required | invalid/missing 阻塞 task start；运行期保留 Worker error owner | 0 |
| Worker inbound sources | 6/6 named slots；Configured 各有 feed ref + trusted actor ref | `infra` resolver -> Worker source runner | 每槽三态；Disabled 无 runner；Missing 不是第四个可运行分支 | source resolution/constructor failure 阻塞 activation；receipt action保持 closed | 0 |
| Outbound route bindings | configured collaboration Port 下 10/10 named route refs | `infra/publishers.rs` collaboration adapter | whole Port Configured 时十槽全 required；无 wildcard/per-route Disabled | route 缺失或不兼容阻塞 adapter；post-commit external failure不回滚 local truth | 0 |
| Jobs entry parameters | request bytes、planning page、run timeout、application safe-reentry policy，4/4 | Jobs admission/runtime + application retry controller | 仅 selected Jobs required；target parallelism 固定为 1，不是配置 | invalid/missing 阻塞 process exposure；entry auto-retry 授权为 0 | 0 |
| diagnostics | `Off` / `Redacted` | infra / entry error wrapper | required closed enum；无 raw/full/verbose | invalid mode 阻塞 startup；不得输出 secret/raw config | 0 |

审计结果：已确认配置组的 `unclassified_config_group = 0`。仍留给 `04` 的 raw key、source precedence、单位、上下限、数值默认、endpoint、credential ref、TLS、transport product、轮换和部署注入方式，是明确的 operator-facing 待闭合输入，不是本 Step 的未分类设计项。

### 140.2 依赖关系与 Cargo 分类归零

| 关系全集 | Exact inventory | 唯一协作方式 / owner | Cargo 判定 | 不可用处理 | 未分类 |
|---|---:|---|---|---|---:|
| 本仓 member edge | 7 个 members、15 条允许的 direct local edges | §§69~74 的 member owner | local workspace edge only | cycle、反向 entry edge或缺失 member 阻塞实现装配 | 0 |
| sibling compile edge | 1 个：`core-contracts` / `core_contracts` / `../quantalithos-core/crates/contracts` | 5 个获准直接使用 shared contract 的 member | 唯一 sibling path dependency | path/package/lib/API/byte 语义不符时阻塞对应实现边界 | 0 |
| runtime external Port | 9 slots / 14 callables | application-owned Port + infra adapter | zero non-core sibling Cargo edge | startup constructor gate或既有 invocation typed failure | 0 |
| Inbound event | 6 named source families | typed envelope + Worker runner + application consumer | zero sibling Cargo edge | Disabled no-runner；Missing startup block；运行期按 receipt/error owner | 0 |
| Outbound event | 10 named schema/source/capture/route families | immutable capture + existing collaboration Port | zero sibling Cargo edge | local truth/intent保留；只由既有 repair owner继续 | 0 |
| downstream consumer | runtime、tools、SDK、console、marketplace、observability、archive 共 7 类 surface | formal exposure、controlled view、ref、safe summary或handoff | zero sibling Cargo edge | 缺失是 integration/downstream prerequisite，不触发 Hub substitute | 0 |
| external source/product | MCP / A2A / API、governance、method-library、secret、document、audit/observability | 对应 typed Port、event或handoff owner | zero sibling Cargo edge | 依 phase 映射 startup block、typed unavailable或existing failed outcome | 0 |

`unclassified_dependency_relation = 0`。目录存在性仍只是调查事实；它既不自动创建 Cargo edge，也不证明 typed contract、配置、连通性或 Deployment readiness。

### 140.3 Owner 与 Profile 归零

| 审计轴 | 已分类 owner / decision | 禁止的 owner 合并 | 未分类 |
|---|---|---|---:|
| raw config | 仅 `infra/config.rs` 读取；validated root 只在 builder 消费 | domain/application/entry 重读 raw source | 0 |
| adapter construction | `infra/runtime_builder.rs` 和对应 concrete adapter module | entry 自行发现 adapter；application 持有 config ref | 0 |
| business invocation | 既有 application facade / service | builder 执行业务 flow；API/Worker/Jobs 直连 repository | 0 |
| entry lifecycle | API listener、Worker tasks、Jobs one-shot process分别由各自 entry root 拥有 | `infra` 启动 entry；entry 间 fallback/import | 0 |
| local truth | single authority、repository、UoW 和 Step 6~13 state/flow owner | external adapter、route、health或config改写 truth | 0 |
| external effect | external source / handoff / collaboration owner | Hub 增加 outbox、relay、DLQ、attempt、lease、ack truth | 0 |
| Local profile | durable或deterministic fake按 exact slot 决定 | Missing 自动变 Fake；fake 生成真实 evidence | 0 |
| Integration profile | durable/configured为默认绑定；仅显式测试边界可 fake | 部分 slot 隐式 fake、跨 family fixture | 0 |
| Deployment profile | durable + Configured/explicit Disabled，fake 数量必须为 0 | fake fallback、in-memory authority、未解析 required slot | 0 |

`unclassified_owner = 0`，`unclassified_profile_decision = 0`。Runtime execution、tools execution、governance approval、method body、marketplace listing 和 SDK client 均已明确归于边界外 owner，不是待分配给 Capability Hub 的空缺职责。

### 140.4 Failure surface 归零

| 检测阶段 | Closed classification | 唯一处理 owner | 禁止转换 | 未分类 |
|---|---|---|---|---:|
| raw/path/source resolution | `MissingSource`、invalid family/version/value | config validator / startup mapper | 静默默认、打印 raw value、构造 fake | 0 |
| adapter / entry construction | constructor failure、wrong family、profile mismatch、coverage defect | runtime builder / selected entry composition | 暴露 partial graph、伪造 protocol response | 0 |
| explicit disabled invocation | existing `NotConfigured` or no-runner | concrete disabled adapter / Worker root | 当作 Missing、temporary unavailable或success | 0 |
| post-exposure dependency call | existing temporary/permanent/timeout/unexpected typed class | Port wrapper / application / entry | 回到 startup、切换 entry、fake fallback | 0 |
| valid external failed outcome | existing typed failed / handoff-unavailable status with safe reason | application flow / stable intent owner | 抛成 malformed carrier、回滚 committed local truth | 0 |
| returned carrier contradiction | `InvalidContract` / `ConsistencyDefect` | application consistency owner | 降级为 temporary unavailable或partial success | 0 |
| commit unknown / local consistency | Step 11~13 exact resolution、barrier与winner procedure | UoW / authority / application owner | sleep、replica guess、重复 mutation | 0 |
| post-dispatch timeout/cancel | observation ends；same invocation continues and drains | API runtime / Worker supervisor / Jobs process | abort、detach、自动重调、声称 zero effect | 0 |

`unclassified_failure_surface = 0`。这表示当前设计分类闭合，不表示外部产品已经连通、实现已经编译或任何失败场景已经测试。

### 140.5 归零裁决

| 归零项 | 结果 | 若后续出现非零项 |
|---|---:|---|
| 未分类配置组 | 0 | 回到 Step 14 对应 schema / binding 章节；不得由 `04` 或实现者补 code contract |
| 未分类依赖关系 | 0 | 先按 compile/runtime/event/downstream 分类，再决定是否受控回开 Step 3/4/7/14 |
| 无 owner 的 binding / lifecycle | 0 | 阻塞正式 §13 装配；禁止 shared/generic owner兜底 |
| 无 profile 决策的 slot | 0 | 阻塞 startup/config formalization；禁止 silent default |
| 无 failure surface 的 phase | 0 | 回开 Step 12/14；禁止 raw error text 或 generic unavailable |
| 需回开 Step 3~13 的当前事项 | 0 | 任一新字段、Port、variant、callable、state或lifecycle先登记 controlled reopen |
| unresolved upstream blocker | 0 | 非阻塞 L0-core design-sync debt 继续单列，不伪装为已解决 |

## 141. 正式 `03` §13 Canonical Assembly Index

### 141.1 编号漂移处理规则

前序批次为了逐批停审，留下 §§45.2、50.4、58.3、66、74.3、75.10、85.6、101.4、106.7、116.1、124.4、132.3 等多个 formal source increment；其中还出现过历史 `13.7`、`13.8`、`13.11` 草稿编号。这些编号只表示当时的增量位置，不是正式文档的最终章节编号。

Step 19 装配正式 `03-详细设计.md` §13 时，必须以本节为唯一编号和读取索引：先读取 §§134~142 的收口裁决，再按下表读取具体 source。不得直接串联历史 markdown 片段，不得保留重复小节编号，也不得从旧正式 `03` 的“测试关注点”章节沿用任何正文。

### 141.2 Canonical target structure 与 source map

| 正式目标小节 | 必须承载的正文 | Canonical source | 必须排除 |
|---|---|---|---|
| `13.1 配置所有权、validated root 与禁止配置化边界` | raw/candidate/validated/assembled ownership、root cardinality、validation/failure、生命周期和 truth/state 红线 | §§13~21、135~137、140.3~140.4 | raw config 下沉、业务 invariant feature flag、旧 Provider/KMS truth |
| `13.2 配置引用表与 entry technical parameters` | 书写规范要求的配置引用表；typed field、读取模块、presence/default口径、`04`落点 | §§23~24、28~29、138.2~138.3、140.1 | 伪造 raw key、数值默认、endpoint、credential、transport product |
| `13.3 Single local authority 与 27 个 local/base Port` | authority `A`、logical store grouping、27/27 binding、110 methods、durable/fake parity、commit visibility | §§33~38、79、131.2 | second authority、best-effort cross-store、hidden store/cleanup |
| `13.4 九个 external Port 与 14 个 callable` | total slots、resolver/handoff/collaboration owner、Configured/Fake/Disabled、typed outcome/error | §§40~45、80、127、130~131、140.2 | optional Port、generic adapter、raw text classification、local delivery state |
| `13.5 API composition 与 exposure barrier` | API handoff、15 service handles、26 Command + 33 Query coverage、non-cancelling invocation | §§86~94、119~124 | infra-owned API facade、repository直连、listener提前 exposure |
| `13.6 Worker source、composition 与 supervised lifecycle` | 6/6 source binding、header-first、trusted actor、receipt action、opaque delivery、activation/cleanup/continuation/shutdown | §§47~51、96~106、119~124、128 | seventh dynamic source、transport identity fallback、local queue/DLQ/attempt truth |
| `13.7 十个 Outbound Event 与 collaboration binding` | schema/logical key/source/capture/named route、stable intent、route migration、repair owner | §§53~59、128~132 | wildcard route、payload重建、route进入digest/state、local relay |
| `13.8 八个 Operations Job runner 与 owned process` | 8/8 request/handler/response/trigger/runner symmetry、Tokio current-thread owner、deadline/drain、host boundary | §§61~66、107~116、119~124 | scheduler/queue/lease/ack truth、target parallelism配置、entry auto-retry |
| `13.9 Runtime builder Stage 0~7 与 complete graph` | exact stage order、entry-neutral graph、one selected handoff、partial disposal、startup/exposure separation | §§75~85、117~124、131 | `infra -> entry` edge、cross-entry fallback、partial graph return |
| `13.10 Codec、digest、commit resolution、timeout 与 retry` | exact crate/API owner、header-first decode、SHA-256、authoritative read、phase-specific bounded policy | §§25~28、73、115、122、131 | generic serde digest、algorithm selector、sleep/replica guess、generic retry |
| `13.11 Cargo 与跨仓依赖绑定表` | 书写规范要求的 cross-repo table、7 member/15 edge graph、唯一 sibling path、runtime/event/downstream zero Cargo edge | §§67~74、125~132、138.4、140.2 | non-core sibling Cargo edge、目录存在即 readiness、SDK/runtime/tools import |
| `13.12 Profile、不可用策略、`04` handoff 与风险` | Local/Integration/Deployment、four-state parity、startup/invocation distinction、配置设计逐 Step handoff和回写门禁 | §§130~140 | Deployment fake、Missing转Disabled、伪造生产 readiness、提前完成 `04` |

正式 §13 必须至少包含 SOP 的三张结构化表：配置引用表、外部依赖绑定表、跨仓 Rust 依赖表。表可按上述目标小节拆分，但任何 row 都必须保留 exact owner、phase、profile、不可用处理和 Cargo 判定；不得用一段概述替代表格。

### 141.3 Source precedence 与重复消解

| 情况 | Step 19 处理规则 |
|---|---|
| 同一主题有早期和后期 source increment | 使用本索引指向的最新闭合规则；早期段只用于追溯，不并列复制 |
| 历史 source 标题编号与本表冲突 | 采用本表 `13.1~13.12`；删除历史编号，不删除已确认语义 |
| 早期 wording 被后续 composition closure 修正 | 以 §§117~124、130~140 的最终 owner/phase/cardinality 为准 |
| Step 14 与正式 `00/01/02` 冲突 | 停止装配并登记 blocker；不得以详细设计扩大上游职责 |
| Step 14 与 Step 3~13 active closure 冲突 | 回开对应 Step 并重新完成门禁；不得由 Step 19自行选边 |
| 旧 README / 正式 `03/05/06` 与当前 calibration 冲突 | 保持 `historical_material`；不进入正式正文、测试结论或 evidence |
| `04` 后续提出新 code contract | 先回写本索引对应的 `03` Step；`04` 不得静默新增字段/variant/Port/error/lifecycle |

### 141.4 Step 19 机械读取顺序

```text
1. read formal 00 / 01 / 02 ownership and exclusion boundaries
2. read current Step 3~13 closure and controlled-reopen records
3. read Step 14 §§134~142 final audit and this canonical index
4. assemble §13.1~§13.12 from the exact source rows above
5. verify three required tables and all cardinalities
6. verify historical material is absent from formal prose
7. verify no raw key/value/product/default or implementation evidence was invented
8. keep formal 03 unchanged until Step 19 itself is authorized and complete
```

本索引只关闭 source 漂移，不执行正式装配。正式 `03-详细设计.md` 当前仍是 `historical_material`。

## 142. Batch `14.5.4` Completion Gate 与 Stop-review Snapshot

### 142.1 Completion gate

| Gate | Result | Source / reason |
|---|---|---|
| Step 3~13 cross-step closure | pass | §135；无需 controlled reopen，既有 cardinality不变 |
| historical material / README / old formal docs 隔离 | pass | §136；旧 Provider、execution、approval、method body、listing、SDK、delivery lifecycle均未回流 |
| struct / field / enum / variant / payload / trait / callable 注释 | pass | §137；本批 declaration delta=`0`，前序英文 `///` 门禁完整 |
| `04` Step 1~15 handoff | pass | §§138~139；raw/operator details、回写门禁和禁止伪造结果均有 owner |
| 配置全集分类 | pass | §140.1；unclassified=`0` |
| dependency / Cargo 分类 | pass | §140.2；唯一 sibling path + runtime/event/downstream zero Cargo edge |
| owner / profile 分类 | pass | §140.3；unclassified owner/profile=`0`，Deployment fake=`0` |
| failure surface 分类 | pass | §140.4；startup、Disabled、invocation、typed outcome、consistency、commit unknown、cancel均分离 |
| formal §13 canonical source | pass | §141；`13.1~13.12`唯一装配索引已固定，历史编号漂移已消解 |
| SOP 配置引用表 | pass | §24、§138.3；typed shape、reader、presence/default口径、`04`落点齐全 |
| SOP 外部依赖绑定表 | pass | §§40~66、§138.4；binding、interface、timeout/retry owner、unavailable处理齐全 |
| SOP 跨仓 Rust 依赖表 | pass | §§68~74、126、138.4；package/library/path/使用位置/不可用处理齐全 |
| unresolved upstream blocker | none | 两项 L0-core design-sync记录仍是非阻塞 debt；无新 blocker |
| formal `03` modified | no | 正式装配保留给 Step 19 |
| formal `04` created | no | 只有用户确认完成整个 `03` 后才按配置 SOP 启动 |
| implementation ledger / planned boundary skeleton | not created | 只允许在正式 `07` 完成时同步创建 |
| implementation/test/run/evidence/sign-off/commit claimed | no | 未执行、未创建、未声称；当前不需要提交 |

### 142.2 Stop-review snapshot

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.5.4
gate_status = 03_step_14_batch_14_5_4_completed_stop_review
step_14_status = in_progress
batch_14_5_status = completed_stop_review
formal_03_modified = false
formal_04_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = 2
workspace_members = 7
local_direct_member_edges = 15
sibling_cargo_path_dependencies = 1
local_base_port_bindings = 27/27
external_port_bindings = 9/9
external_port_callables = 14/14
application_ports = 36/36
repository_traits_methods = 22/110
api_protocol_coverage = 59/59 = command:26/26 + query:33/33
inbound_source_slots = 6/6
outbound_event_families = 10/10
operations_job_dispatch = 8/8
protocol_flow_coverage = 83/83
state_like_enums_active_variants = 24/111
state_pairs = 638 = current:239 + reserved:98 + illegal:301
unclassified_config_groups = 0
unclassified_dependency_relations = 0
unclassified_owners = 0
unclassified_profile_decisions = 0
unclassified_failure_surfaces = 0
rust_declaration_delta_in_batch = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_14_batch_14_6
```

### 142.3 下一批读取门禁

Batch `14.5.4` 完成并在此停审。用户明确确认后，唯一允许进入的是 `14.6`，并按以下顺序读取：

1. 本 Step 14 全文，重点 §§135~142 及 §141 canonical index。
2. Step 3~13 的 current closure、controlled reopen 和 cardinality记录。
3. 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 的 owner / boundary / dependency结论。
4. README、旧正式 `03/05/06` 的 historical-material 冲突记录，不继承其正文或结论。
5. 详细设计 SOP Step 14、详细设计书写规范 §5.13、真相源闭环标准 §2.12 和全局依赖裁剪规则。

`14.6` 才负责 Step 14 最终 historical / cross-step 总审计、正式 §13 assembly source确认、Step 15 handoff和 Step 14 完成门禁。本批不得自动进入 `14.6`、Step 15、Step 19、正式 `03`、`04` 或任何 implementation artifact。

## 143. Batch `14.6` 开工确认、读取证据与最终裁决边界

### 143.1 用户授权与本批唯一目标

用户已在 `14.5.4` 停审后明确回复“同意”，授权进入 `14.6`。本批是 Step 14 的最终收口批次，只完成以下四件事：

1. 不依赖前序自评结论，按 SOP 八问重新建立 evidence matrix。
2. 将配置引用、外部依赖绑定和跨仓 Rust 依赖整理为可由 Step 19 原样读取的 canonical row set。
3. 在 §141 index 之外提供正式 §13.1~§13.12 的可直接装配正文源，并固定重复消解规则。
4. 给 Step 15 提供 owner、phase、failure、redaction 和候选切口输入，但不提前定义日志级别、指标名称 / 类型 / 标签或审计事件字段。

本批不修改正式 `03-详细设计.md`，不创建 `03_ddd_step_15_observability_audit.md`，不创建正式 `04-配置设计.md`，也不创建 implementation ledger、planned boundary skeleton 或目标实现仓。Step 14 完成只表示详细设计中的配置和依赖绑定契约已闭合，不表示实现、配置产品、外部连通性、测试、验收或部署已经完成。

### 143.2 最终读取清单与承接结论

| 输入 | 本批实际读取范围 | 承接的 authority | 不得从该输入推导 |
|---|---|---|---|
| 详细设计 SOP | Step 14 八问、三张期望表、执行约束、进入 Step 15 条件；Step 15 输入 / 输出 / 五问 / redaction 约束 | 本批输出形状与下一 Step 门禁 | 不能把 Step 15 表提前写成已确认埋点契约 |
| 详细设计书写规范 | §5.13 三张表格式和 Cargo / runtime / event 分类；§5.14 三类埋点表边界 | 正式 §13 / §14 的章节责任 | 不能把完整配置手册、告警阈值或运维流程写入 `03` |
| 中间产物规范 | Step 中间产物先于正式文档、停审、恢复点和单批可审查写入规则 | 本文件、flow、project ledger 三层同步 | 不能跳到 Step 15 或 Step 19 |
| 真相源闭环标准 | 配置、依赖、对象、Port、协议、状态、错误和 phase owner 必须一一闭合 | 禁止配置化、owner、failure、reopen gate | 不能让 `04` 或实现者补 code contract |
| 全局依赖裁剪规则 | compile / runtime / event / downstream 四类，ASCII 图与不可用处理 | 唯一 sibling Cargo edge和 non-core zero-Cargo rule | 目录存在不能证明 dependency readiness |
| 正式 `00/01/02` | capability identity / registry / descriptor / seam / method relation / exposure / controlled view 的 owner 和排除边界 | 本仓职责与外部 seam | 不能并入 runtime/tools execution、approval、method body、SDK client、marketplace listing |
| Step 3~13 current closure | 七 member / 15 local edge、对象 / Port / protocol / flow / state / repository / error / idempotency current baseline | 本批所有代码绑定点与 cardinality | 不能从历史小节恢复被后续批次替换的 wording |
| Step 14 §§12~142 | validated root、27 local/base Port、9 external Port、entry composition、event / Job、Cargo、profile、failure和 `04` handoff | canonical row 的 exact type / owner / phase / source | 不能只复制 §141 index 而省略正文 row set |
| README、旧正式 `03/05/06` | 仅核对 Provider / execution / approval / method body / listing / delivery lifecycle 等污染主语 | historical-material 隔离清单 | 不能继承旧对象、产品、测试结论、evidence 或数字 |
| `L1-governance` / `L1-artifact` Step 14 | 表格粒度、owner / source / handoff和完成门禁的组织方式 | 本批审查深度 | 不能复制其领域、outbox、retention或产品结论 |

### 143.3 本批不重新定义的闭合基线

| 基线 | Final value | 本批允许的动作 | 变化时处理 |
|---|---:|---|---|
| workspace members | 7 | 只回指七 member direct dependency cards | 回开 Step 3/4/14 |
| local direct member edges | 15 | 只装配 Cargo 表 | 回开 Step 3/4/14 |
| sibling Cargo path dependencies | 1 | 只保留 `core-contracts` | 新 sibling edge 先按全局规则重审 |
| local/base Port bindings | 27 / 27 | 只汇总 owner / constructor / authority | 回开 Step 7/11/14 |
| external Port / callable | 9 / 9；14 / 14 | 只汇总 binding / failure / profile | 回开 Step 7/9/12/14 |
| application Ports | 36 / 36 | 不新增 private Port | 回开 Step 7 |
| repository traits / methods | 22 / 110 | 不新增 private finder / cleanup method | 回开 Step 7/11 |
| API protocol coverage | 59 / 59 = 26 Command + 33 Query | 只回指 15 service handles和 exposure barrier | 回开 Step 8/9 |
| Inbound / Outbound / Jobs | 6 / 10 / 8 | 只汇总 source / route / runner binding | 回开 Step 8/9/14 |
| protocols / flows | 83 / 83 | 不新增 alias / generic execute | 回开 Step 8/9 |
| state-like enums / active variants | 24 / 111 | 不新增配置状态或 delivery lifecycle | 回开 Step 6/10 |
| ordered state pairs | 638 = 239 current + 98 reserved + 301 illegal | 不改变转换分类 | 回开 Step 10 |
| unresolved upstream blocker | 0 | 保留两项 L0-core design-sync debt | 真正语义冲突时登记 blocker并回开 |

### 143.4 最终证据判定规则

一个 SOP 问题只有同时满足以下条件才可判为 `closed`：

1. 有唯一读取 / 构造 / 调用 owner，而不是 `shared`、`generic`、`implementation decides`。
2. 有 typed input / output 或 exact table row，不能只用自由文本描述“通过 adapter”。
3. 有 startup、disabled、invocation、typed outcome、consistency 五层中适用的 failure 出口。
4. 有 Local / Integration / Deployment 或明确的“不适用”profile裁决。
5. 有正式 §13.1~§13.12 落点和 canonical source，不依赖旧正式文档。
6. 不新增 raw key、数值默认、产品、endpoint、credential、transport topic、真实 evidence 或测试结果。

任何一项缺失都将该问题判为 `open` 并阻塞 Step 14 完成；不得用“后续实现补齐”关闭。

## 144. SOP 八问最终独立 Evidence Matrix

### 144.1 逐问闭合

| # | SOP 问题 | Final answer | 唯一 owner / binding point | Mechanical evidence | 正式 §13 落点 | 结论 |
|---:|---|---|---|---|---|---|
| 1 | 哪些模块需要读取配置？ | raw source只由 `infra/config.rs` 读取并形成 candidate / validated root；`infra/runtime_builder.rs` 只消费 immutable validated root；API / Worker / Jobs只消费各自 typed entry handoff；application只消费Port和已绑定 technical policy；contracts/domain不读配置。 | raw=`infra/config.rs`；assembly=`infra/runtime_builder.rs`；entry lifecycle=各 entry root | §§13、17、75~85、117~124；raw reader count=1，entry raw reader count=0 | `13.1`、`13.5`、`13.6`、`13.8`、`13.9` | closed |
| 2 | 配置项的类型、默认值和读取位置是什么？ | 27个 canonical validated field row均有 exact type、reader、presence / compatibility 口径和 `04` 落点；本 Step不伪造 raw key、单位、上下限和数值默认。 | typed root=`CapabilityRuntimeConfig`；数值 wrapper / entry parameters由对应 wrapper owner消费 | §§14~17、23~24、145；untyped field=0，silent runtime default=0 | `13.1`、`13.2`、`13.10`、`13.12` | closed |
| 3 | 哪些外部依赖需要通过 adapter 注入？ | single local authority绑定27个local/base Port；九个external Port按七resolver + one handoff + one collaboration精确注入；六Inbound source、十Outbound route和八Job runner通过其既有 typed entry seam绑定。 | local adapter / resolver / handoff / publisher owner逐行固定；entry只接application facade | §§33~66、75~124、146；27/27、9/9、14/14、6/6、10/10、8/8 | `13.3`~`13.9` | closed |
| 4 | 外部依赖的超时、重试、降级策略是什么？ | timeout按API / inbound / collaboration / Job / external Port / local store / commit observation分 phase；retry仅在 typed eligible class和effect proof后执行；Disabled=`NotConfigured`，Missing=startup block，typed failed outcome保持业务 carrier，contract contradiction=`InvalidContract / ConsistencyDefect`。 | technical wrapper、application retry controller、UoW recovery、entry observation owner相互分离 | §§23、28、40~45、49、56、64、121~122、130~131、140.4 | `13.4`、`13.6`~`13.10`、`13.12` | closed |
| 5 | 哪些配置细节应留给配置设计文档？ | raw format/key、source precedence、profile rows、单位 / bounds / explicit numeric defaults、endpoint、credential ref、TLS、transport product / destination、secret rotation、deployment injection、change / rollback / invalidation由 `04` Step 1~15闭合。 | 配置设计 owner；任何 code-contract变化先回开 `03` | §§29、138~139；`04` handoff Step count=15，unowned handoff=0 | `13.2`、`13.11`、`13.12` | closed |
| 6 | 哪些跨仓 Rust 编译期依赖需要本地 path dependency？ | 只有 package `core-contracts`、lib `core_contracts`、path `../quantalithos-core/crates/contracts`；直接 owner为contracts/domain/application/infra/worker；api/jobs direct deny。 | workspace root + 五个获准 member | §§67~74、126、147；sibling Cargo path count=1，non-core sibling Cargo edge=0 | `13.11` | closed |
| 7 | 哪些运行期或事件协作依赖需要用 adapter / event / projection / fake 表达？ | external MCP/A2A/API、governance、method-library、secret、document、observability/audit走typed Port；bus和六Inbound / 十Outbound走event collaboration；runtime/tools/SDK/marketplace/console/archive走formal exposure、controlled view、ref、safe summary或handoff；均不进Cargo。 | 对应 application Port / Worker source / collaboration / downstream consumer owner | §§41~66、127~129、146~147；unclassified runtime/event/downstream edge=0 | `13.4`、`13.6`~`13.8`、`13.11`~`13.12` | closed |
| 8 | 依赖仓不存在时暂停、fake还是等待？ | compile dependency缺失 / 不兼容时暂停；Configured required slot Missing阻塞startup；Local / 明确Integration测试边界可选typed deterministic fake；Deployment fake=0；显式Disabled才产生no-runner / `NotConfigured`；下游consumer缺失只保留integration prerequisite，不触发Hub substitute。 | config validator / builder / selected entry / downstream owner按phase裁决 | §§67、74、117~124、130~131、139、147；Missing->Fake=0，Deployment fake=0 | `13.9`、`13.11`、`13.12` | closed |

### 144.2 八问反向覆盖审计

| 审计对象 | 必须至少被哪一问覆盖 | 实际覆盖 | 缺失 |
|---|---|---|---:|
| raw / candidate / validated / assembled config lifecycle | 1、2、5 | 1、2、5 | 0 |
| 27 local/base Port及single authority | 3、4 | 3、4 | 0 |
| 9 external Port / 14 callable | 3、4、7、8 | 3、4、7、8 | 0 |
| 6 Inbound / 10 Outbound / 8 Jobs | 3、4、7、8 | 3、4、7、8 | 0 |
| 7 member / 15 local Cargo edge / one sibling path | 6、8 | 6、8 | 0 |
| runtime / event / downstream zero-Cargo collaboration | 7、8 | 7、8 | 0 |
| Local / Integration / Deployment与四态binding | 2、4、8 | 2、4、8 | 0 |
| `04` raw/operator handoff与controlled reopen | 2、5 | 2、5 | 0 |
| historical material / forbidden owners | 3、7、8 | 3、7、8 | 0 |
| Step 15 redacted diagnostic handoff | 1、4、5 | 1、4、5 | 0 |

SOP 八问 `closed = 8 / 8`，反向审计缺失 `0`。该裁决来自上述 owner / evidence / formal target 的交叉检查，不以 §4 的首轮回答或 §125.2 的阶段性自评替代。

## 145. Canonical 配置引用表

### 145.1 正式装配规则

下表是正式 §13.2 唯一配置引用 row set，取代早期候选表，但不取代 §§14~17、23~29 的字段 / constructor / validation细节。`默认 / presence`列只给设计级必填、显式关闭或fixed compatibility口径；任何数值、raw key、source precedence和产品默认都必须由 `04` 明确给出。Step 19不得把 `required` 写成“实现默认”，也不得删去 failure / invariant列。

| # | 配置项 | Exact typed shape | 读取 / 消费 owner | 默认 / presence 口径 | 失败与固定不变量 | `04` 落点 |
|---:|---|---|---|---|---|---|
| 1 | schema version | `CapabilityConfigSchemaVersion` | `infra/config.rs` | required；仅v1 | unknown / zero / future version在startup reject | root / schema |
| 2 | runtime profile | `CapabilityRuntimeProfileKind` | `infra/config.rs` -> `runtime_builder.rs` | required；无隐式Deployment | 只约束binding kind，不改变truth / protocol / state | profile matrix |
| 3 | selected process entry | `CapabilityRuntimeEntryKind` | `infra/config.rs` -> selected entry root | required；API / Worker / Jobs恰选一个 | variant mismatch或mixed entry阻塞startup | binary / entry matrix |
| 4 | local persistence | `CapabilityLocalPersistenceBinding` | `runtime_builder.rs`、local adapters | required；single authority | 27 local/base Port、22/110 repository surface、UoW和commit resolution共享`A` | local persistence |
| 5 | external Port slots | `CapabilityExternalPortBindings` | `runtime_builder.rs` | 9/9 named slots required；关闭必须显式`Disabled` | family不可互换；Missing阻塞；Deployment fake=0 | external adapter sections |
| 6 | clock / identifier generator | `CapabilityClockBinding` + `CapabilityIdGeneratorBinding` | `infra/clock_id.rs` | 两槽独立且required | application / domain / entry不得产生替代time或id | clock / id |
| 7 | wire / digest compatibility | `CapabilityCompatibilityBinding` | contracts codec + application digest assembly | fixed `StableSurfaceV1 + Sha256V1` | 不兼容阻塞；不是runtime selector | compatibility |
| 8 | API request bytes | `CapabilityApiEntryParameters.request_body_limit` | API boundary before typed decode | positive required numeric；数值未在本Step给出 | 超限在application前失败且不保存body | API entry |
| 9 | public Query page limit | `CapabilityApiEntryParameters.public_page_limit` | API Query mapper | positive required numeric | zero / over-bound reject，不静默clamp | API entry |
| 10 | API whole-call timeout | `CapabilityApiEntryParameters.call_timeout` | API non-cancelling invocation wrapper | positive required duration | observation结束不取消、detach或重调application | API / timeout |
| 11 | Worker inbound bytes | `CapabilityWorkerEntryParameters.inbound_body_limit` | Worker before borrowed header decode | positive required numeric | 超限时payload decode / reserve / UoW均为0 | Worker entry |
| 12 | Worker fetch batch | `CapabilityWorkerEntryParameters.fetch_batch_limit` | each named source task | positive required numeric | 只控制每源cooperative yield；不构成业务batch | Worker entry |
| 13 | Worker parallelism | `CapabilityWorkerEntryParameters.parallelism` | one global Worker permit gate | positive required numeric | long-poll不占permit；同delivery / capture / UoW不并发 | Worker entry |
| 14 | Worker phase deadlines | `inbound_call_timeout` + `collaboration_call_timeout` | Worker application / exact-ref continuation wrappers | two positive required durations | header gate先行；timeout后same admitted work继续drive / drain | Worker / timeout |
| 15 | Worker source decisions | `CapabilityWorkerEntryBinding.inbound_sources` | config validator -> builder -> Worker root | Worker entry恰有6个named slot；每槽三态 | Missing不是运行态；Disabled无runner；Deployment无fake | Worker sources |
| 16 | configured feed refs | 每槽`CapabilityInboundFeedConfigRef` | `infra/config.rs` resolution -> feed constructor | 仅Configured槽required；无shared fallback | transport ref不得定义consumer / family / schema / event identity | Worker feeds |
| 17 | configured trusted-actor refs | 每槽`CapabilityTrustedActorConfigRef` | config resolution -> matcher constructor | 仅Configured槽required，独立于feed ref | actor / family / source-kind gate不可由topic或credential替代 | trusted actors |
| 18 | configured outbound route refs | configured collaboration section内10个`CapabilityOutboundRouteConfigRef` | `infra/config.rs` -> `infra/publishers.rs` | whole Port Configured时10/10 required；无wildcard | route不进入public envelope、digest、capture identity、local state | outbound routes |
| 19 | Jobs request bytes | `CapabilityJobsEntryParameters.request_body_limit` | Jobs admission before typed decode | positive required numeric | job kind / schema / body mismatch在application前reject | Jobs entry |
| 20 | Jobs planning page | `CapabilityJobsEntryParameters.planning_page_limit` | application planning input wrapper | positive required numeric | collect-before-mutate；不成为public cursor或scope default | Jobs entry |
| 21 | Jobs whole-run timeout | `CapabilityJobsEntryParameters.run_timeout` | Jobs-owned current-thread runtime | positive required duration | 不terminalize unknown target，不重建journal，residual task必须drain | Jobs / timeout |
| 22 | Jobs runner retry | `CapabilityJobsEntryParameters.runner_retry` | application safe-reentry controller | required bounded policy | entry auto-retry=0；仅durable proof允许same invocation重入 | Jobs / retry |
| 23 | external call retry | `CapabilityRuntimeTechnicalPolicy.external_retry` | typed external Port wrapper | required bounded policy | 仅temporary / timeout且effect proof通过；不解析文本 | retry policy |
| 24 | local contention retry | `CapabilityRuntimeTechnicalPolicy.contention_retry` | application invocation wrapper | required bounded policy | confirmed rollback + exact owner reload + fresh UoW | retry policy |
| 25 | commit observation | timeout + `commit_observation_retry` | UoW recovery wrapper | required bounded policy | 只重复`resolve_commit` / authority read；不重复mutation | commit observation |
| 26 | internal scan page | `CapabilityRuntimeTechnicalPolicy.internal_scan_page_limit` | application stable scan wrapper | positive required numeric | collect-before-mutate；不暴露成Query default | internal read |
| 27 | diagnostics exposure | `CapabilityDiagnosticMode` | infra / selected entry error wrapper | required；仅`Off` / `Redacted` | 无raw / full / verbose；field allowlist留Step 15 | diagnostics |

### 145.2 配置表机械闭合

| 检查 | 期望 | 实际 | 结果 |
|---|---:|---:|---|
| canonical config rows | 27 | 27 | pass |
| 无exact type的row | 0 | 0 | pass |
| 无唯一读取 / 消费owner的row | 0 | 0 | pass |
| 无presence / default口径的row | 0 | 0 | pass |
| 无failure / invariant的row | 0 | 0 | pass |
| 无`04`落点的row | 0 | 0 | pass |
| 本Step伪造的raw key / 数值默认 / endpoint / credential / product | 0 | 0 | pass |

## 146. Canonical 外部依赖绑定表

### 146.1 表的范围与读取方式

本表把实现装配所需的 local infrastructure、external Port、Inbound source、Outbound collaboration、host和downstream seam放在同一 phase-aware索引中。`使用接口 / exact inventory`必须继续回读列出的 Step 7 / 8 / 9 source获取完整函数签名；本表固定的是绑定owner、cardinality、timeout / retry owner、不可用出口和禁止的Cargo / truth合并，不能用一个generic adapter替代。

| # | 依赖 / exact inventory | 绑定位置与owner | 使用接口 / exact inventory | Timeout / retry owner | 不可用 / 降级出口 | Cargo与禁止边界 |
|---:|---|---|---|---|---|---|
| 1 | local persistence authority `A`；27/27 local/base Port | `infra/runtime_builder.rs`、`repositories.rs`、`projection_stores.rs`、`reference_stores.rs`、`idempotency_store.rs`、`read_visibility.rs` | `CapabilityUnitOfWork`、manager、Clock、Id、read visibility及22 repository traits / 110 methods；exact names见§34 | local store deadline；contention由application；commit observation由UoW recovery | constructor失败startup block；调用期沿Step 12 repository/UoW mapping；commit unknown保持三态 | 本仓local edge；禁止second authority、hidden store、private finder、TTL / cleanup、best-effort split commit |
| 2 | system / deterministic Clock + Id | `infra/clock_id.rs` | `ClockPort`与`IdGeneratorPort`分别注入 | 无generic retry；adapter不可用按phase返回startup或existing typed failure | Missing startup block；fake只在允许profile且保持typed parity | 无sibling edge；禁止entry/domain fallback和合并clock-id ref |
| 3 | stable wire codec + fixed SHA-256 | contracts codec；application digest assembly | `serde 1.0.228`、`serde_json 1.0.145 raw_value`、`sha2 0.10.9`的§25 exact API | 不重试codec / digest inconsistency | incompatibility startup / compatibility block；运行期contradiction为existing codec / consistency error | crates.io依赖，不是sibling；禁止generic `Value` digest、runtime algorithm selector |
| 4 | external capability source | `infra::source_resolvers::ExternalCapabilitySourceReferenceAdapter` | `ExternalCapabilitySourceReferencePort`；1 callable；`ReferenceResolutionObservation` | external Port phase timeout；temporary / timeout仅在effect-safe时bounded retry | Disabled=`ExternalCapabilitySourceReference + NotConfigured`；typed unresolved保持outcome；Missing startup block | zero sibling Cargo；禁止MCP/A2A/API execution或response body ownership |
| 5 | governance result / policy reference | `GovernanceResultReferenceAdapter` | `GovernanceResultReferencePort`；1 callable；`GovernanceResultReferenceObservation` | 同上 | Disabled=`GovernanceResultReference + NotConfigured`；typed unresolved不变 | zero Cargo；禁止approval、Policy、shared-rules、workflow truth |
| 6 | method-library asset reference | `MethodAssetReferenceAdapter` | `MethodAssetReferencePort`；1 callable；`ReferenceResolutionObservation` | 同上 | Disabled=`MethodAssetReference + NotConfigured`；typed unresolved不变 | zero Cargo；禁止method body、source、lifecycle或发布实现 |
| 7 | secret reference | `SecretReferenceAdapter` | `SecretReferencePort`；1 callable；`SecretReferenceObservation` | temporary / timeout only；body / shape failure不重试 | Disabled=`SecretReference + NotConfigured`；invalid shape保持contract failure | zero Cargo；禁止secret value、KMS/Vault operation、raw credential |
| 8 | external document reference | `ExternalDocumentReferenceAdapter` | `ExternalDocumentReferencePort`；1 callable；`ReferenceResolutionObservation` | external Port wrapper | Disabled=`ExternalDocumentReference + NotConfigured` | zero Cargo；禁止document body、raw locator dump |
| 9 | runtime / tools与SDK consumer refs | `CapabilityConsumerReferenceAdapter` | `CapabilityConsumerReferencePort`；2 exact callables；`ReferenceResolutionObservation` | temporary / timeout only；无execution retry | 两callable均Disabled=`CapabilityConsumerReference + NotConfigured` | zero Cargo；禁止runtime/tools execution、SDK client/cache/package truth |
| 10 | observability / audit reference | `ObservabilityAuditReferenceAdapter` | `ObservabilityAuditReferencePort`；1 callable；`ReferenceResolutionObservation` | external Port wrapper | Disabled=`ObservabilityAuditReference + NotConfigured` | zero Cargo；禁止raw log / metric / span / audit body或evidence alias |
| 11 | observability / audit handoff | `infra::handoff_adapters::ObservabilityAuditHandoffAdapter` | `ObservabilityAuditHandoffPort`；traceability + audit-export 2 callables；`CapabilityAuditHandoffOutcome` | safe temporary / timeout；typed `Retryable`按existing handoff owner | Disabled=`ObservabilityAuditHandoff + NotConfigured`；typed unavailable/rejected不转technical success | zero Cargo；local truth / trace保留；禁止验收签署、外部receipt当evidence |
| 12 | capability access-event collaboration | `infra::publishers::CapabilityAccessEventCollaborationAdapter` | `CapabilityAccessEventCollaborationPort`；`collaborate / get / list / repair` 4 callables | only same-candidate / same-intent safe temporary / timeout；repair owner不变 | Disabled=`CapabilityAccessEventCollaboration + NotConfigured`；typed Pending/Failed/HandoffUnavailable保持carrier | zero Cargo；禁止local outbox/relay/DLQ/attempt/lease/ack/delivery truth |
| 13 | governance-result Inbound source | Worker slot `governance_result_reference_changed` | `ConsumeGovernanceResultReferenceChanged` -> same application method；Governance + schema1 | Worker inbound deadline；receipt之后按existing processing action；source technical recovery独立 | Disabled无runner；Missing startup block；fake走same header/actor/body path | event seam，zero sibling Cargo；禁止governance truth生成 |
| 14 | method-asset Inbound source | Worker slot `method_asset_reference_changed` | `ConsumeMethodAssetReferenceChanged`；MethodLibrary + schema1 | 同上 | 同上 | event seam；禁止method body import |
| 15 | downstream impact Inbound source | Worker slot `downstream_consumption_impact_reported` | `ConsumeDownstreamConsumptionImpactReported`；DownstreamConsumer + schema1 | 同上 | 同上 | event seam；禁止execution result / consumer cache反写truth |
| 16 | external source-ref Inbound source | Worker slot `external_capability_source_reference_changed` | `ConsumeExternalCapabilitySourceReferenceChanged`；ExternalCapabilitySource + schema1 + source-kind refinement | 同上 | 同上 | event seam；禁止transport identity替代public source identity |
| 17 | audit-material Inbound source | Worker slot `audit_material_reference_changed` | `ConsumeAuditMaterialReferenceChanged`；ObservabilityAudit + schema1 | 同上 | 同上 | event seam；禁止raw audit/evidence body |
| 18 | external-document Inbound source | Worker slot `external_document_reference_changed` | `ConsumeExternalDocumentReferenceChanged`；ExternalDocument + schema1 | 同上 | 同上 | event seam；禁止document body |
| 19 | identity changed route | `infra/publishers.rs` named route `capability_identity_changed` | schema `CapabilityIdentityChanged@1`；key `capability-hub.identity.changed.v1`；`capture_capability_identity_changed` | collaboration deadline；same stable intent bounded rule | whole collaboration Disabled则`NotConfigured`；route Missing阻塞constructor | event seam；route不进digest/state；不动态查identity决定destination |
| 20 | registry changed route | named route `capability_registry_changed` | `CapabilityRegistryChanged@1`；`capability-hub.registry.changed.v1`；`capture_capability_registry_changed` | 同上 | 同上 | 禁止marketplace/runtime filter或reconciliation alias |
| 21 | descriptor changed route | named route `adapter_descriptor_changed` | `AdapterDescriptorChanged@1`；`capability-hub.adapter-descriptor.changed.v1`；`capture_adapter_descriptor_changed` | 同上 | 同上 | 禁止provider route、secret、quota、cost或execution payload |
| 22 | governance seam changed route | named route `governance_seam_relation_changed` | `GovernanceSeamRelationChanged@1`；`capability-hub.governance-seam-relation.changed.v1`；matching capture callable | 同上 | 同上 | 禁止approval / Policy / workflow side payload |
| 23 | method relation changed route | named route `capability_method_relation_changed` | `CapabilityMethodRelationChanged@1`；`capability-hub.capability-method-relation.changed.v1`；matching capture callable | 同上 | 同上 | 禁止method body / source / runtime executor state |
| 24 | formal exposure changed route | named route `formal_exposure_boundary_changed` | `FormalExposureBoundaryChanged@1`；`capability-hub.formal-exposure-boundary.changed.v1`；matching capture callable | 同上 | 同上 | 禁止runtime authorization、SDK package或listing truth |
| 25 | controlled view availability route | named route `controlled_consumer_view_availability_changed` | `ControlledConsumerViewAvailabilityChanged@1`；`capability-hub.controlled-consumer-view.availability-changed.v1`；matching capture callable | 同上 | 同上 | 禁止consumer execution、cache truth或exposure mutation |
| 26 | impact identified route | named route `capability_change_impact_identified` | `CapabilityChangeImpactIdentified@1`；`capability-hub.capability-change-impact.identified.v1`；matching capture callable | 同上 | 同上 | 禁止cost/billing、runtime result或downstream body |
| 27 | derived material refreshed route | named route `derived_material_refreshed` | `DerivedMaterialRefreshed@1`；`capability-hub.derived-material.refreshed.v1`；matching capture callable | 同上 | 同上 | 禁止raw index / audit / listing / report evidence body |
| 28 | reference resolution changed route | named route `reference_resolution_changed` | `ReferenceResolutionChanged@1`；`capability-hub.reference-resolution.changed.v1`；matching capture callable | 同上 | 同上 | 禁止resolver call、external body或canonical-state mutation |
| 29 | host schedule / one-shot Jobs invocation | Jobs entry root；host only provides encoded typed request | 8/8 closed logical triggers -> handlers -> application Job services；serial frozen journal targets | Jobs whole-run deadline；entry retry authorization=0；application durable-proof safe reentry only | admission / runtime / typed response / no-delivery分离；host不制造Job report | no scheduler sibling Cargo；禁止queue/lease/ack/schedule truth或target parallelism |
| 30 | runtime / tools downstream consumers | downstream owner | formal exposure、controlled view、consumer ref、impact / feedback seam | downstream owner；Hub不重试execution | absence是integration/deployment prerequisite，不触发Hub executor | zero Cargo；禁止execution、tools result、provider route/quota/cost |
| 31 | SDK downstream consumer | downstream owner | public contracts/API、formal exposure、controlled view、event | downstream release / integration owner | SDK缺失不阻塞Hub core truth | zero Cargo；禁止Hub-owned SDK client/cache/package lifecycle |
| 32 | marketplace / console discovery consumers | downstream owner | read-only directory / ecosystem summary / public view | downstream owner | absence不创建Hub substitute；可保持read-only surface | zero Cargo；禁止listing、pricing、transaction、fulfillment、ranking truth |
| 33 | observability / archive consumers | external owner | body-free ref、trace/export handoff、safe summary | handoff owner；failure保持typed handoff surface | absence按profile Disabled / unavailable或deployment prerequisite | zero Cargo；禁止raw telemetry/archive body、本地delivery lifecycle、真实evidence claim |

### 146.2 External binding completeness arithmetic

| Inventory | Expected | Canonical rows / source | Missing |
|---|---:|---|---:|
| local/base Port binding | 27 | row 1 + §34 exact 27 rows | 0 |
| external Port / callable | 9 / 14 | rows 4~12 | 0 / 0 |
| Inbound source slots | 6 | rows 13~18 | 0 |
| Outbound event / route families | 10 | rows 19~28 | 0 |
| Operations Job dispatch | 8 | row 29 + §63.2 exact 8 rows | 0 |
| downstream consumer classes | runtime/tools、SDK、marketplace/console、observability/archive | rows 30~33 | 0 |
| dependency row without phase failure exit | 0 | 0 | 0 |
| dependency row authorizing non-core sibling Cargo | 0 | 0 | 0 |

## 147. Canonical 跨仓 Rust 依赖绑定表

### 147.1 正式表

| 依赖仓库 / system | 全局依赖类型 | 本地路径 / existence fact | Cargo引用或协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | compile-time shared contract | `/home/aris/Projects/quantalithos-core`；package `core-contracts`、lib `core_contracts`已核实 | root: `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；contracts/domain/application/infra/worker使用`.workspace = true`；api/jobs direct deny | core actor / metadata / ids / time / version及approved shared carriers | path/package/lib/signature/byte semantics缺失或不兼容时暂停对应实现并回开Step 8/13/14；不得造本地替代DTO |
| `quantalithos-bus` | event transport / runtime | `/home/aris/Projects/quantalithos-bus`目录存在；typed Hub product binding未被本Step声称完成 | 不进Cargo；六Inbound feed、十Outbound route、opaque delivery/completion和deterministic fake | Worker sources + event collaboration adapter | Local/明确Integration可fake；Deployment enabled source/route缺binding时startup block或显式Disabled；不得静默成功 |
| `quantalithos-governance` | runtime / event collaboration | `/home/aris/Projects/quantalithos-governance`目录存在 | 不进Cargo；`GovernanceResultReferencePort` + governance Inbound event + body-free fixture | governance seam / reference support | typed binding不可用时Disabled / typed unavailable / integration gate；不生成approval truth |
| `quantalithos-method-library` | runtime / event collaboration | `/home/aris/Projects/quantalithos-method-library`目录存在 | 不进Cargo；`MethodAssetReferencePort` + method Inbound event + body-free fixture | method relation / reference support | typed binding不可用时Disabled / typed unavailable；不复制method body |
| `quantalithos-sdk` | downstream consumer | `/home/aris/Projects/quantalithos-sdk`目录存在 | 不进Cargo；消费public API/contracts、formal exposure、controlled view和events | SDK exposure consumer boundary | 缺失不阻塞Hub core；保留downstream integration gate，不在Hub实现SDK client |
| `quantalithos-runtime` | downstream runtime consumer | `/home/aris/Projects/quantalithos-runtime`目录缺失 | 不进Cargo；formal exposure / controlled view / consumer ref / feedback seam | runtime consumer boundary | 作为integration/deployment prerequisite；不在Hub创建executor或fallback runtime |
| `quantalithos-tools` | downstream tools consumer | `/home/aris/Projects/quantalithos-tools`目录缺失 | 不进Cargo；controlled view / tools ref / feedback seam | tools consumer boundary | 同上；不在Hub执行tools或保存tool result |
| `quantalithos-marketplace` | downstream discovery consumer | `/home/aris/Projects/quantalithos-marketplace`目录缺失 | 不进Cargo；read-only directory / ecosystem summary | discovery boundary | 不阻塞Hub core；不把registry变成listing truth |
| secret / KMS / Vault system | runtime external service | concrete local repo / product未选定 | 不进Cargo sibling；`SecretReferencePort` + symbolic ref + safe summary；具体third-party client若选定需`04`/Step 14受控增量 | secret reference resolution | 未选产品不阻塞当前Step；阻塞对应Deployment binding；禁止raw secret fallback |
| external MCP / A2A / API source | runtime external source | deployment-specific，非local Rust sibling | 不进Cargo sibling；`ExternalCapabilitySourceReferencePort` + descriptor/reference seam + fake | source discovery / descriptor relation | Configured material缺失startup block或显式Disabled；禁止Hub execution substitute |
| external document source | runtime / event source | deployment-specific | 不进Cargo sibling；`ExternalDocumentReferencePort` + Inbound reference event | body-free external reference support | typed unavailable / Disabled；禁止document body import |
| observability / audit / archive / console | runtime handoff / downstream consumers | 当前本地目录事实未形成可用Hub binding | 不进Cargo sibling；reference Port、handoff Port、safe summary、public read-only view | trace / audit handoff、external consumption | 按profile形成Disabled / typed unavailable / deployment prerequisite；禁止raw telemetry、archive body或evidence alias |

### 147.2 Cargo closure

| Gate | Final result |
|---|---|
| workspace members | 7 |
| allowed local direct member edges | 15 |
| sibling path dependency | exactly 1: `core-contracts` |
| members directly using sibling path | 5: contracts/domain/application/infra/worker |
| api/jobs direct core dependency | denied |
| non-core sibling Cargo edge | 0 |
| runtime / event / downstream dependency represented as Cargo | 0 |
| target implementation repository existence | absent；implementation prerequisite only |
| compile / lock / test result claimed | none |

若 `04` 或实现选择具体database、HTTP、broker、secret或observability第三方library，必须先把它作为“本仓infra implementation dependency”重新分类，记录owner、版本、feature、类型泄漏边界和不可用处理；不得因为它不是 sibling 就绕过本表。任何新增 sibling path仍视为Step 3/14 controlled reopen。

## 148. Formal `03` §13 Canonical Assembly Source（最终正文源）

### 148.1 装配声明

本节是 Step 19 可直接读取的最终正文源，不是正式 `03-详细设计.md` 本身。Step 19 必须按 `13.1~13.12` 的顺序复制本节正文，并将 §145.1、§146.1、§147.1 三张 canonical 表作为对应小节的原样结构化表嵌入。不得只复制本节标题、§141 索引或一段摘要；不得从历史 `03`、README、旧 `05/06` 或实现侧自行补行。

正式 §13 的共同绑定语义如下：

- raw configuration 的唯一读取 owner 是 `infra/config.rs`；validated root 的唯一构造 owner 是 `infra/runtime_builder.rs`。
- `CapabilityRuntimeConfig` 是 startup-local、immutable、infra-owned validated root，不是 domain object、public protocol、持久化记录或下游配置快照。
- selected process 一次只能是 API、Worker、Jobs 之一；`CapabilityEntryParameters` variant 必须与 selected entry 精确相等。
- local/base 27 个 Port、external 9 个 Port、6 个 Inbound source、10 个 Outbound route和8个 Job runner必须在各自 complete gate 中闭合；`Option`、wildcard、generic registry 和 lazy fallback不能隐藏缺口。
- `Configured`、`DeterministicFake`、`Disabled` 是合法完整 binding；`Missing`、wrong family、dangling ref、profile mismatch、constructor failure和contract contradiction是startup/design blocking。
- runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret body和local delivery lifecycle永远不属于 Hub 的 truth、Port、Cargo 或配置 owner。

### 148.2 `13.1` 配置所有权、validated root 与禁止配置化边界

`infra/config.rs` 先读取有限 raw source，再构造只存在于 startup 的 `CapabilityRuntimeConfigCandidate`。candidate 只允许承载结构校验已经通过的 section、safe symbolic reference、profile、entry 和 infra-local technical values；它不能被持久化、导出、传入 application 或用于生成日志正文。`try_from_candidate` 完成 unknown / duplicate / forbidden surface、safe-name、section-family、cardinality、profile、compatibility 和 cross-field validation 后，才形成 `CapabilityRuntimeConfig`。

validated root 至少包含 schema version、runtime profile、selected entry、single local persistence binding、9 个 external slot、独立 clock / id binding、fixed compatibility、entry parameters、technical policy和diagnostic mode。根对象只由 builder消费；adapter constructor接收已解析的 typed binding，application constructor接收 Port和已绑定的 technical policy，domain / contracts不读取配置。

配置不得改变 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure、controlled consumer view、trace / impact、metadata、idempotency、state transition、query no-write、Job journal、capture source、stable intent或任何外部正文排除规则。配置也不得增加 provider route / quota / cost / failover、runtime/tools execution、approval、method body、SDK client、marketplace listing、outbox / relay / DLQ / attempt / lease / ack 或 cleanup / TTL。命中禁止面时，validator返回 startup assembly failure；若需要改变 code contract，先回开对应 Step。

### 148.3 `13.2` 配置引用表与 entry technical parameters

正式正文必须嵌入 **§145.1 Canonical 配置引用表**，保留其 27 行、exact typed shape、读取 / 消费 owner、presence / default 口径、failure / invariant 和 `04` 落点。该表覆盖 root、local persistence、external slots、clock / id、compatibility、API、Worker、Jobs、retry / timeout、internal scan和diagnostics，不能被合并为“runtime config”一行。

entry technical parameters 的消费边界固定为：API只消费 request byte limit、public page limit和whole-call timeout；Worker只消费 inbound byte limit、per-source fetch batch、global parallelism和两个 phase deadline；Jobs只消费 request byte limit、planning page、whole-run deadline以及由application持有的safe-reentry policy provenance。Jobs没有 `target_parallelism`；同一 frozen journal 的 target 永远由application按ordinal串行处理。

raw key、文件格式、file/env/CLI precedence、单位、上下限、显式数值默认、endpoint、credential reference、TLS、transport destination、secret rotation和deployment injection全部留给 `04`。`04`可以填写这些 operator-facing details，但不得新增字段、variant、Port、error、state或lifecycle；一旦需要新增，必须先回写本节及对应 Step。

### 148.4 `13.3` Single local authority 与 27 个 local/base Port

所有 transaction-capable local adapter共享唯一 authority `A`。`A` 同时拥有原子 staged write set、CAS / unique约束、cursor / index语义、opaque transaction resolution和linearizable recovery read；UoW manager、22个repository trait / 110个method、read visibility resolver、capture / snapshot、idempotency / stored result和Job journal不能各自创建第二 authority。

正式正文必须按 §34 的 27/27 exact Port table装配，并保留每行 concrete owner、constructor输入、注入来源、method surface和failure gate。5个base / read-gate Port与22个repository/replay/capture/journal Port都必须在Stage 3形成 concrete object；任何一个缺失、wrong authority、private finder、hidden store、TTL / cleanup或durable / fake parity缺陷都使整个 local prefix失败，不允许向后续stage返回部分 graph。

durable adapter与deterministic in-memory fake必须在CAS、unique、cursor、rollback、capture / journal atomicity、三态 commit resolution和same-authority linearizable read上保持行为 parity。fake只能提供测试隔离，不能产生真实外部 receipt、evidence、acceptance或deployment readiness。

### 148.5 `13.4` 九个 external Port 与 14 个 callable

正式正文必须嵌入 **§146.1 rows 4~12**，并保留9个 exact Port、14个 callable、binding slot、concrete owner、typed return、timeout / retry owner和disabled mapping。七个 resolver family分别处理 external capability source、governance result、method asset、secret、external document、consumer和observability/audit；handoff与access-event collaboration各自保留独立 Port及callable surface。

Configured adapter和deterministic fake都必须通过同一 body-free、typed input/output、subject/kind/source/intent symmetry和negative-path gate。显式 Disabled构造 exact family implementation，调用时返回既有 `ApplicationPortKind + NotConfigured`；它不产生成功型 fake、receipt、capture intent或delivery state。运行期 temporary / timeout、typed Failed / HandoffUnavailable和valid unresolved outcome沿Step 12既有surface返回；malformed carrier为 `InvalidContract` / `ConsistencyDefect`，不得降级为 unavailable。

external adapter不持有 Capability Hub repository、UoW或业务truth，不在调用前后自行提交本地事务，不保存 secret / method / document / audit正文，也不通过 HTTP status、broker code、SDK message或error text推导 retryability。external effect失败不回滚已经提交的 local truth；repair由既有 application Job owner负责。

### 148.6 `13.5` API composition 与 exposure barrier

API 的 Stage 5 handoff包含15个application service handles：7个Command service和8个Query service。正式正文必须保留26/26 Command与33/33 Query coverage，API-owned handler facade由 `api` composition root构造，`infra`只交付entry-neutral application service bundle，不构造 API handler、不依赖 API crate。

API handler只持有typed entry parameters、对应application service trait object和closed operation mapping；不持有raw config、config ref、repository、UoW、resolver、clock / id、external Port或transport credential。route、body、schema和metadata完成对称校验后，调用既有 application facade；不得用generic `execute`、字符串路由、service map或缺失时的 `Option` 隐藏 coverage。

API exposure barrier在完整 runtime、listener ownership和non-cancelling invocation proof完成后才打开。call timeout只结束transport response observation，不abort、drop、detach或重调已经dispatch的application invocation；如果framework只能强制取消，则该binding在startup被拒绝。listener之前的composition错误是 `InfraError::RuntimeAssembly`，不是 API response。

### 148.7 `13.6` Worker source、composition 与 supervised lifecycle

Worker绑定6个named source slot：`governance_result_reference_changed`、`method_asset_reference_changed`、`downstream_consumption_impact_reported`、`external_capability_source_reference_changed`、`audit_material_reference_changed`和`external_document_reference_changed`。每个slot固定 logical event、source family、schema v1、trusted actor gate和application consumer callable；不能由topic、offset、credential、wildcard subscription或transport text推导身份。

每个 enabled source由Worker root构造一个parked source task；Configured与DeterministicFake使用同一 header-first、body-size、actor、schema、negative response和typed receipt路径，Disabled没有runner、fetch、receipt、ack或空成功，Missing阻塞activation。opaque delivery不可Clone，completion只允许 `Complete / RetrySameEvent / Quarantine` 三个既有动作；transport metadata、offset、lease、attempt和completion token永远停留在infra-private driver。

Worker必须在所有enabled task parked、Disabled slot closed、global permit gate和exact-ref continuation owner准备完成后通过activation barrier。fetch不占processing permit；同一delivery、capture ref、UoW或journal phase不可并发。shutdown按stop signal、continuation drain、source stop、六个task join和original failure preservation的既有顺序执行；不得新增local queue、DLQ、attempt lifecycle或application retry state。

### 148.8 `13.7` 十个 Outbound Event 与 collaboration binding

正式正文必须嵌入 **§146.1 rows 19~28**，并保留以下十个闭合event / route family：`CapabilityIdentityChanged`、`CapabilityRegistryChanged`、`AdapterDescriptorChanged`、`GovernanceSeamRelationChanged`、`CapabilityMethodRelationChanged`、`FormalExposureBoundaryChanged`、`ControlledConsumerViewAvailabilityChanged`、`CapabilityChangeImpactIdentified`、`DerivedMaterialRefreshed`和`ReferenceResolutionChanged`。

每一行固定 schema ref、logical routing key、required technical source、capture callable和named route kind。route只把已存immutable envelope映射到物理协作目标；不改变event name、schema、payload、source、candidate digest、capture identity、local state或stable intent。十个route必须在whole collaboration Port Configured时全部存在；没有wildcard、per-route silent default、payload重建或按marketplace/runtime destination动态选路。

local truth、snapshot、capture和initial intent binding仍由同一 application UoW / authority拥有；external pending / delivered / failed / unavailable属于 collaboration owner。post-commit协作失败保留local truth和stable intent，既有 repair Job复用exact capture / snapshot / intent，不能建立第二队列或本地delivery lifecycle。

### 148.9 `13.8` 八个 Operations Job runner 与 owned process

正式正文必须保留 §63.2 的八个闭合runner：`RunCapabilityRegistryReconciliation`、`RefreshControlledConsumerView`、`RebuildDirectorySearchBrowseProjection`、`PrepareAuditFriendlyExportSummary`、`RebuildReadOnlyEcosystemDiscoverySummary`、`RunDerivedMaterialReconciliation`、`RefreshExternalReferenceResolution`和`RepairCapabilityAccessEventCollaboration`。每个runner一一对应logical trigger、typed request、application handler、typed response和Step 9 flow；不得通过CLI alias、schedule name或字符串动态fallback。

Jobs root拥有Tokio `1.52.3` current-thread runtime及`rt,sync,time`限定feature，用于owned task、monotonic deadline、single terminal notification、join / take和process residual drain。host scheduler只提供启动和request bytes，不拥有Job journal、queue、lease、ack、attempt、target parallelism或业务retry。

Jobs admission在header-first和exact job-kind/schema/body对称后才调用application。生命周期固定为 `Ready -> InFlight -> Consumed`；post-dispatch observation timeout不取消application task，process关闭前必须join / drain。entry auto-retry授权为0；只有application依据durable journal、UoW和exact safe-reentry procedure决定同一 invocation是否可重入，typed `Retryable`结果不可被entry再次重试。

### 148.10 `13.9` Runtime builder Stage 0~7 与 complete graph

`infra::runtime_builder`按以下不可交换顺序执行：

```text
Stage 0 validate_root
  -> Stage 1 build_single_authority
  -> Stage 2 bind_technical_primitives
  -> Stage 3 bind_local_base_ports_27_of_27
  -> Stage 4 bind_external_ports_9_of_9
  -> Stage 5 build_selected_application_graph
  -> Stage 6 resolve_selected_entry_parameters_and_neutral_inputs
  -> Stage 7 create_one_nonclone_entry_handoff
  -> selected entry-owned factory
  -> selected entry runtime ownership gate
  -> first exposure barrier
```

Stage 0~7任一失败都丢弃未转移的完整prefix并返回 `InfraError::RuntimeAssembly`；不得返回partial graph、启动listener、释放Worker task、读取Jobs request或发送协议错误。一个validated root只产生一个selected entry handoff：API由API root构造handler / listener，Worker由Worker root构造source runner / dispatcher / supervisor，Jobs由Jobs root构造one-shot process / runner。`infra`不依赖任何entry crate，entry不持有repository、UoW、resolver、publisher或raw config。

complete predicate必须同时满足validated root、single authority、technical primitives、27/27 local Ports、9/9 external Ports、selected application graph、selected neutral inputs、one non-Clone handoff、entry factory、runtime ownership和static coverage。`Configured` / `Fake` / `Disabled`只在各自exact validation通过时使predicate成立；Missing永远不能被转换为Fake、Disabled、另一entry或generic unavailable。

### 148.11 `13.10` Codec、digest、commit resolution、timeout 与 retry

stable public / stored / event / Job codec由 `contracts` 拥有，`serde 1.0.228` 与 `serde_json 1.0.145` 的 `raw_value`只用于既定exact shape和entry-local bounded header gate；Worker / Jobs在header和selected payload decode完成后丢弃借用carrier。`sha2 0.10.9`只由application使用，按Step 13固定的canonical frame和四个digest domain生成bytes；不得使用generic `Value`、map iteration、pretty output、Display / Debug、runtime algorithm selector或再次序列化已存bytes。

commit unknown只由同一 authority `A`、原始 `CapabilityTransactionRef`、固定 observation policy和`resolve_commit`处理；普通row absence、sleep、replica read或猜测不能得出 Durable / NotDurable。contention retry必须先证明rollback成功、重新读取exact owner并创建fresh UoW；external retry只允许既有 temporary / timeout且effect boundary安全；commit unknown、consistency defect、codec failure、invalid typed response、permanent rejection和unexpected failure不进入mutation retry。

timeout按API、Worker inbound、Worker continuation、Jobs whole-run、external Port、local store和commit observation分层。入口 observation结束不等于application invocation被取消；retry delay、attempt、jitter不进入request / event / reference / result / journal digest，也不生成业务状态或evidence。

### 148.12 `13.11` Cargo 与跨仓依赖绑定表

正式正文必须嵌入 **§147.1 Canonical 跨仓 Rust 依赖绑定表**，并保留 §147.2 closure：7个workspace member、15条允许的local direct edge、唯一sibling path `core-contracts = { path = "../quantalithos-core/crates/contracts" }`、5个直接使用sibling的member、api/jobs direct deny以及non-core sibling zero Cargo edge。

`quantalithos-bus`、governance、method-library、SDK、runtime、tools、marketplace、secret、MCP、A2A、API、document、observability和archive全部以Port、event、projection、API、controlled view、ref、safe summary、handoff或fake协作。目录存在不等于Cargo资格、typed contract或Deployment readiness；目录缺失也不授权在Hub创建替代系统。若后续选择具体第三方实现库，必须作为infra implementation dependency单独分类，记录版本、feature、owner、类型泄漏和不可用策略。

### 148.13 `13.12` Profile、不可用策略、`04` handoff 与风险

Local profile允许durable或保持完整parity的deterministic fake；Integration允许显式fake或configured；Deployment只允许durable local authority、Configured或显式Disabled external binding，deterministic fake数量必须为0。`Missing`是startup/design blocking，不能静默变为Disabled或Fake；`Disabled`只表示显式关闭的external Port / Worker source，不改变required local Port和业务不变量。

不可用按phase分层：raw/path/source resolution为 `MissingSource` / validation issue；adapter或entry construction为 `InfraError::RuntimeAssembly`；exposed Port invocation为既有 `TemporarilyUnavailable` / `Timeout` / `PermanentlyRejected` / `InvalidTypedResponse` / `UnexpectedSourceFailure`；valid external failed outcome保留typed Failed / HandoffUnavailable；returned carrier contradiction为 `InvalidContract` / `ConsistencyDefect`；commit unknown保留三态 resolution。任何层都不得使用raw text、新generic error、entry fallback或fake fallback。

`04-配置设计.md` 必须承接 §145.1 的 27 个字段、§146.1 的 binding rows和§147.1 的依赖分类，逐项定义 raw schema、source precedence、profile、单位 / bounds / explicit defaults、endpoint / credential / TLS / transport、secret injection、change / rollback / invalidation和compatibility fixtures。`04`不能静默改变本节的 object、Port、protocol、flow、state、error、owner或phase boundary；改变时先受控回开本 Step及对应上游 Step。两项 L0-core design-sync debt只作为非阻塞同步项保留，不得宣称已由本节解决。

## 149. Step 15 Handoff：可观测性与审计埋点输入（不提前定义正式埋点）

### 149.1 Step 15 的直接输入与输出边界

Step 15启动时应读取：正式 `00/01/02` 的安全、追溯和外部交接边界；Step 8 的协议 metadata / schema；Step 9 的83条flow；Step 12 的错误、异常和恢复分类；Step 13 的幂等、commit unknown、reentry和digest规则；本 Step §§143~148 的配置、profile、failure和redaction边界。

Step 15 的正式输出仍只能是日志埋点表、指标埋点表和审计事件表。当前 §149 不预先决定日志级别、指标名称 / 类型 / 标签、审计事件名、采样率、告警阈值、backend、运维流程或真实 evidence alias；这些必须在用户确认后由独立 `03_ddd_step_15_observability_audit.md` 逐批闭合。

### 149.2 埋点候选位置矩阵

| 候选位置 | Step 15需要决定的观察对象 | 现阶段已固定的安全 / owner边界 | 当前不提前决定 |
|---|---|---|---|
| raw config validation | startup validation outcome、safe subject、selected phase | `infra/config.rs`只输出safe category；raw key/value、secret、endpoint不可出根 | level、event name、metric type、backend |
| Stage 0~7 builder | stage success/failure、complete predicate、selected entry、partial-prefix disposal | `runtime_builder`拥有startup boundary；不记录raw source chain、完整graph body或credential | exact field list、cardinality metric、sampling |
| local authority / commit resolution | transaction phase、commit outcome、observation/recovery branch | UoW / authority owner；transaction ref可作为safe correlation input但不能暴露 staged data | metric name、retry histogram、audit event schema |
| external Port invocation | family、phase、typed outcome / failure class、retry eligibility | concrete Port / application owner；不使用transport text或raw response | labels、severity、aggregation、sampling |
| API exposure / non-cancelling observation | request acceptance gate、dispatch observation end、continued invocation ownership | API root只记录safe protocol / phase facts；body、header secret和raw response禁止 | timeout metric name、trace field allowlist、log level |
| Worker activation / source task | named slot decision、activation barrier、stop / join / continuation cleanup | Worker root拥有task lifecycle；topic、offset、lease、attempt、encoded body禁止 | task metric taxonomy、alert threshold、audit schema |
| Inbound processing | source family/schema gate、trusted actor decision、receipt action、application disposition | application receipt / Worker completion owner分离；raw envelope不落日志、不进digest | receipt metric names、sampling、audit consumer |
| Outbound capture / collaboration | source-symmetric capture、intent binding、typed collaboration outcome、repair handoff | local capture truth与external delivery truth分离；不记录route credential、transport receipt或local delivery state | event/metric naming、retry dashboard、audit retention |
| Jobs admission / drain | job kind symmetry、deadline、terminal state、join/drain precedence | Jobs runtime owner；run/idempotency authority来自typed request，不由entry生成 | process metric names、exit mapping table、alert policy |
| typed external failed outcome | Failed / HandoffUnavailable / unavailable surface and safe reason | application preserves typed business carrier；不把失败伪装成technical success或evidence | log level、audit event payload、consumer routing |
| diagnostics / redaction | safe startup / invocation diagnostic mode | only `Off` / `Redacted`；禁止raw/full/verbose | redaction implementation fields、backend、retention |

### 149.3 Step 15 必须继续遵守的 redaction 规则

Step 15不得把 raw configuration、secret value、credential、endpoint、TLS material、topic / group / partition / offset、lease / delivery token、encoded envelope bytes、method body、document body、audit body、runtime/tools result、SDK response、marketplace listing body、evidence alias、验收签署或伪造的 run_id 写入日志、指标标签、trace attribute或审计事件。允许承接的只能是已经存在的 typed identity / ref、closed family、phase、safe failure category、version、digest（按既有公开域规则）、stable intent ref和safe summary。

Step 15可以为 `MissingSource`、`NotConfigured`、`TemporarilyUnavailable`、`Timeout`、`InvalidContract`、`ConsistencyDefect`、`CommitOutcomeUnknown`和typed Failed / HandoffUnavailable分别设计观察切口，但不得在本节新增 error variant、issue code、state或recovery action。任何观测字段如果会改变truth、owner、retry、reentry或phase语义，必须回开 Step 12/13/14。

### 149.4 Step 15 handoff gate

| Gate | 进入 Step 15 前的要求 | 当前结果 |
|---|---|---|
| protocol / flow inventory | 83/83 protocol-flow pair已闭合 | pass |
| error / recovery inventory | 17 ApplicationError、51 issue code、phase mapping已闭合 | pass |
| configuration diagnostics | `Off` / `Redacted` root mode已闭合；具体字段留Step 15 | pass |
| external / event owner | 9/9 Port、6 Inbound、10 Outbound、8 Jobs owner已闭合 | pass |
| body / secret / evidence boundary | redaction禁止面已列出 | pass |
| formal Step 15 artifact | 尚未创建 | intentionally absent |

Step 15的唯一允许下一动作是：用户确认后创建并进入 `03_ddd_step_15_observability_audit.md`，先读本节与上游闭合，再逐批写正式日志、指标、审计表。不得把本节候选矩阵直接当作 Step 15 完成结果。

## 150. Step 3~13、历史材料、结构注释与 phase boundary 最终机械审计

### 150.1 Step 3~13 独立 closure matrix

| Step | 本批复核的 binding输入 | 当前结论 | 非零项 / controlled reopen trigger |
|---:|---|---|---|
| 3 | language / runtime / workspace / sibling Cargo rule | 7 members、15 local edges、one `core-contracts` path、third-party owner完整 | 新crate、feature、sibling path或runtime owner变化 |
| 4 | file layout / composition root / owner boundary | config / builder在infra；API / Worker / Jobs各自root；无infra->entry反向边 | 新文件职责、entry混合或反向依赖 |
| 5 | module capability / constructor主轴 | application只接Port和typed policy；infra只adapter / graph；entry不持有repository | raw config下沉、generic facade、owner合并 |
| 6 | object / field / enum / state contract | 43 HLD objects + 7 helpers、24/111 state baseline不变；禁止配置改变domain surface | 新字段、variant、state、body或truth owner |
| 7 | 36 Port、22 traits / 110 methods、fake parity | 27 local/base + 9 external全绑定；无private finder / hidden Port | 新Port、method、adapter family或authority |
| 8 | 26 Command、33 Query、6 Inbound、10 Outbound、8 Jobs | 83/83 protocol and metadata identity完整 | route alias、generic execute、DTO / schema变化 |
| 9 | 83 flow、transaction / capture / retry boundary | startup binding不重跑flow；external failure不回滚local truth | flow owner、side effect、retry或phase变化 |
| 10 | 24 enum / 111 active variants / 638 pair matrix | config/profile不增删状态、不改变迁移 | 新state、delivery lifecycle或非法pair重新分类 |
| 11 | authority、UoW、CAS、commit resolution | A唯一；durable/fake parity和linearizable read完整 | second authority、best-effort commit、new store method |
| 12 | 17 errors、51 issue codes、failure precedence | startup / Disabled / invocation / typed outcome / consistency分离 | generic error、text classification或mapping漂移 |
| 13 | canonical bytes、four digest domains、safe reentry、commit unknown | exact accessor assumption和两项非阻塞debt明确 | core signature/bytes、digest、reentry或retention变化 |

机械结果：`step_3_to_13_unclassified_binding = 0`；`controlled_reopen_required = 0`；当前不存在需要由 `04` 或实现者补写的 code contract。

### 150.2 Historical-material final exclusion

| 来源 | 仍可能出现的旧主语 | Final disposition |
|---|---|---|
| README / old formal `00/01/02` | Provider、cost、KMS/Vault、runtime gateway、policy refresh、marketplace metadata | `historical_material`；不进入 §13正文 |
| old formal `03` | ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、旧adapter / topic / retry | `historical_material`；只用于污染审计 |
| old `05/06` | 旧性能数值、TC、run、evidence、签署和放行 | 不进入详细设计；后续 `05/06` 重建 |
| sibling directory facts | “目录存在即可编译 / 可连通 / ready” | 仅事实；按 §147 分类 |
| L1 reference material | governance / artifact 自有 truth、outbox、retention、delivery lifecycle | 只取粒度，不复制语义 |

`historical_material_reintroduced = 0`。若 Step 19正文出现上述旧对象、产品、数字或验收结论，装配必须停止并回到本节查源，不得以“旧内容仍有参考价值”继续拼接。

### 150.3 Rustdoc / structure-comment final gate

本批新增 Rust-facing declaration delta 为 `0`。前序已定义或受控同步的 struct、tuple field、enum、每个 variant、variant payload field、trait、trait method、constructor、accessor、mapper、factory、runner和entry-local callable均必须在实现文件逐项使用英文 `///`；enum struct variant内部不得出现field-level `pub`。本批的表、伪代码、assembly stage和formal source不新增可以绕过该门禁的匿名tuple、generic map、`Option<dyn Any>`或未注释结构。

| 审计面 | 期望 | 实际 | 结果 |
|---|---:|---:|---|
| declaration delta in `14.6` | 0 | 0 | pass |
| known prior declaration sets with English Rustdoc | all | all recorded prior gates pass | pass |
| unreviewed struct / field / variant / callable | 0 | 0 | pass |
| public field inside enum struct variant | 0 | 0 | pass |
| anonymous generic fallback surface | 0 | 0 | pass |

该表是设计门禁，不是目标实现源码扫描、编译、rustdoc、lint或测试结果；不得在正式文档中把它写成实现已通过。

### 150.4 Phase boundary and forbidden-owner final gate

| Boundary | Hub owns | Hub only references / hands off | Hub must never own |
|---|---|---|---|
| capability identity / registry | canonical identity and registry truth | downstream refs / event collaboration | runtime identity, listing or SDK cache |
| external MCP / A2A / API | descriptor、body-free source ref、safe summary | resolver / adapter outcome | execution session、request / response body、tool result |
| governance | seam relation、result ref、safe summary | typed resolver / Inbound event | approval、Policy / shared-rules truth、workflow |
| method-library | body-free asset relation / ref | resolver / Inbound event | method body、source、package、execution |
| exposure / consumer | formal exposure、controlled view、impact/ref | API、event、handoff、downstream consumer | runtime/tools execution、SDK client、marketplace listing |
| observability / audit | safe ref、trace / handoff summary | handoff / archive / downstream consumer | raw telemetry、evidence body、acceptance signature |
| event delivery | immutable snapshot、capture、stable intent binding | external collaboration status | local outbox、relay、DLQ、attempt / lease / ack lifecycle |

`forbidden_owner_merge = 0`；`forbidden_local_delivery_lifecycle = 0`；`forbidden_non_core_cargo_edge = 0`。

## 151. Step 14 Final Completion Gate 与 Stop-review Snapshot

### 151.1 Completion gate

| Gate | Result | Final source |
|---|---|---|
| `14.6` authorization and read closure | pass | §§143.1~143.3；用户确认已记录，读取清单完整 |
| SOP eight questions | pass, 8/8 | §144.1；每问有唯一owner、evidence和formal target |
| reverse coverage audit | pass, missing=0 | §144.2 |
| canonical config table | pass, 27/27 rows | §145.1~145.2 |
| canonical external binding table | pass, 33/33 rows；9/9 Port、14/14 callable、6/6 Inbound、10/10 Outbound、8/8 Jobs | §146.1~146.2 |
| canonical cross-repo table | pass, one sibling path、non-core zero Cargo | §147.1~147.2 |
| formal `03` §13.1~§13.12 source | pass；每小节均有正文和exact source | §148.2~§148.13 |
| Step 15 handoff | pass；candidate only，不提前完成埋点 | §149 |
| Step 3~13 closure | pass；controlled reopen=0 | §150.1 |
| historical material exclusion | pass；reintroduced=0 | §150.2 |
| Rustdoc / structure comment gate | pass as design gate；implementation scan未执行 | §150.3 |
| phase / forbidden owner boundary | pass；owner merge=0 | §150.4 |
| unclassified config groups | 0 | §140.1、§145.2 |
| unclassified dependency relations | 0 | §140.2、§146.2、§147.2 |
| unclassified owners | 0 | §140.3、§150.4 |
| unclassified profile decisions | 0 | §§130~131、§146 |
| unclassified failure surfaces | 0 | §140.4、§148.13 |
| unresolved upstream blocker | none | 两项L0-core design-sync仍为non-blocking debt |
| formal `03` modified | no | Step 19尚未授权 |
| formal `04` created | no | 必须等正式03完成和用户确认 |
| Step 15 file created | no | 下一Step再创建 |
| implementation ledger / planned boundary skeleton | not created | 只在正式 `07` 完成时创建 |
| implementation / test / run / evidence / sign-off / commit claimed | no | 本批无此类事实 |

### 151.2 Final stop-review snapshot

```text
current_document = 03-详细设计.md
current_step = 14
current_batch = 14.6
gate_status = 03_step_14_completed_stop_review
step_14_status = completed
formal_03_modified = false
formal_04_created = false
step_15_intermediate_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = 2
workspace_members = 7
local_direct_member_edges = 15
sibling_cargo_path_dependencies = 1
local_base_port_bindings = 27/27
external_port_bindings = 9/9
external_port_callables = 14/14
application_ports = 36/36
repository_traits_methods = 22/110
api_protocol_coverage = 59/59 = command:26/26 + query:33/33
inbound_source_slots = 6/6
outbound_event_families = 10/10
operations_job_dispatch = 8/8
protocol_flow_coverage = 83/83
state_like_enums_active_variants = 24/111
state_pairs = 638 = current:239 + reserved:98 + illegal:301
unclassified_config_groups = 0
unclassified_dependency_relations = 0
unclassified_owners = 0
unclassified_profile_decisions = 0
unclassified_failure_surfaces = 0
rust_declaration_delta_in_batch = 0
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15
```

### 151.3 Step 14 completion and next-step gate

Step 14 至此完成并停审。下一步只能在用户连续确认后进入 Step 15：先创建 `projects/L3-capability-hub/design-calibration/03_ddd_step_15_observability_audit.md`，读取本节 §149、Step 8/9/12/13和正式 `00/01/02`，然后逐批定义日志、指标和审计事件契约。当前不得自动修改正式 `03`、创建正式 `04`、进入 Step 16、Step 19或创建任何 implementation artifact。
